---
title: Documentazione dell'API Stream di Node.js
description: Documentazione dettagliata sull'API Stream di Node.js, che copre stream leggibili, scrivibili, duplex e di trasformazione, insieme ai loro metodi, eventi ed esempi di utilizzo.
head:
  - - meta
    - name: og:title
      content: Documentazione dell'API Stream di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Documentazione dettagliata sull'API Stream di Node.js, che copre stream leggibili, scrivibili, duplex e di trasformazione, insieme ai loro metodi, eventi ed esempi di utilizzo.
  - - meta
    - name: twitter:title
      content: Documentazione dell'API Stream di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Documentazione dettagliata sull'API Stream di Node.js, che copre stream leggibili, scrivibili, duplex e di trasformazione, insieme ai loro metodi, eventi ed esempi di utilizzo.
---


# Stream {#stream}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/stream.js](https://github.com/nodejs/node/blob/v23.5.0/lib/stream.js)

Uno stream è un'interfaccia astratta per lavorare con dati in streaming in Node.js. Il modulo `node:stream` fornisce un'API per implementare l'interfaccia stream.

Ci sono molti oggetti stream forniti da Node.js. Ad esempio, una [richiesta a un server HTTP](/it/nodejs/api/http#class-httpincomingmessage) e [`process.stdout`](/it/nodejs/api/process#processstdout) sono entrambe istanze di stream.

Gli stream possono essere leggibili, scrivibili o entrambi. Tutti gli stream sono istanze di [`EventEmitter`](/it/nodejs/api/events#class-eventemitter).

Per accedere al modulo `node:stream`:

```js [ESM]
const stream = require('node:stream');
```
Il modulo `node:stream` è utile per creare nuovi tipi di istanze stream. Di solito non è necessario utilizzare il modulo `node:stream` per consumare stream.

## Organizzazione di questo documento {#organization-of-this-document}

Questo documento contiene due sezioni principali e una terza sezione per le note. La prima sezione spiega come utilizzare gli stream esistenti all'interno di un'applicazione. La seconda sezione spiega come creare nuovi tipi di stream.

## Tipi di stream {#types-of-streams}

Esistono quattro tipi di stream fondamentali all'interno di Node.js:

- [`Writable`](/it/nodejs/api/stream#class-streamwritable): stream in cui è possibile scrivere dati (ad esempio, [`fs.createWriteStream()`](/it/nodejs/api/fs#fscreatewritestreampath-options)).
- [`Readable`](/it/nodejs/api/stream#class-streamreadable): stream da cui è possibile leggere dati (ad esempio, [`fs.createReadStream()`](/it/nodejs/api/fs#fscreatereadstreampath-options)).
- [`Duplex`](/it/nodejs/api/stream#class-streamduplex): stream che sono sia `Readable` che `Writable` (ad esempio, [`net.Socket`](/it/nodejs/api/net#class-netsocket)).
- [`Transform`](/it/nodejs/api/stream#class-streamtransform): stream `Duplex` che possono modificare o trasformare i dati mentre vengono scritti e letti (ad esempio, [`zlib.createDeflate()`](/it/nodejs/api/zlib#zlibcreatedeflateoptions)).

Inoltre, questo modulo include le funzioni di utilità [`stream.duplexPair()`](/it/nodejs/api/stream#streamduplexpairoptions), [`stream.pipeline()`](/it/nodejs/api/stream#streampipelinesource-transforms-destination-callback), [`stream.finished()`](/it/nodejs/api/stream#streamfinishedstream-options-callback) [`stream.Readable.from()`](/it/nodejs/api/stream#streamreadablefromiterable-options) e [`stream.addAbortSignal()`](/it/nodejs/api/stream#streamaddabortsignalsignal-stream).


### API Streams Promises {#streams-promises-api}

**Aggiunto in: v15.0.0**

L'API `stream/promises` fornisce un insieme alternativo di funzioni di utilità asincrone per gli stream che restituiscono oggetti `Promise` invece di utilizzare i callback. L'API è accessibile tramite `require('node:stream/promises')` o `require('node:stream').promises`.

### `stream.pipeline(source[, ...transforms], destination[, options])` {#streampipelinesource-transforms-destination-options}

### `stream.pipeline(streams[, options])` {#streampipelinestreams-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0, v17.2.0, v16.14.0 | Aggiunta l'opzione `end`, che può essere impostata su `false` per impedire la chiusura automatica dello stream di destinazione quando la sorgente termina. |
| v15.0.0 | Aggiunto in: v15.0.0 |
:::

- `streams` [\<Stream[]\>](/it/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `source` [\<Stream\>](/it/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)


- `...transforms` [\<Stream\>](/it/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)


- `destination` [\<Stream\>](/it/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)


- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni della pipeline
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal)
    - `end` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Termina lo stream di destinazione quando termina lo stream di origine. Gli stream di trasformazione terminano sempre, anche se questo valore è `false`. **Predefinito:** `true`.


- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si adempie quando la pipeline è completa.

::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function run() {
  await pipeline(
    fs.createReadStream('archive.tar'),
    zlib.createGzip(),
    fs.createWriteStream('archive.tar.gz'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

await pipeline(
  createReadStream('archive.tar'),
  createGzip(),
  createWriteStream('archive.tar.gz'),
);
console.log('Pipeline succeeded.');
```
:::

Per utilizzare un `AbortSignal`, passalo all'interno di un oggetto di opzioni, come ultimo argomento. Quando il segnale viene interrotto, `destroy` verrà chiamato sulla pipeline sottostante, con un `AbortError`.

::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function run() {
  const ac = new AbortController();
  const signal = ac.signal;

  setImmediate(() => ac.abort());
  await pipeline(
    fs.createReadStream('archive.tar'),
    zlib.createGzip(),
    fs.createWriteStream('archive.tar.gz'),
    { signal },
  );
}

run().catch(console.error); // AbortError
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

const ac = new AbortController();
const { signal } = ac;
setImmediate(() => ac.abort());
try {
  await pipeline(
    createReadStream('archive.tar'),
    createGzip(),
    createWriteStream('archive.tar.gz'),
    { signal },
  );
} catch (err) {
  console.error(err); // AbortError
}
```
:::

L'API `pipeline` supporta anche i generatori async:

::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  await pipeline(
    fs.createReadStream('lowercase.txt'),
    async function* (source, { signal }) {
      source.setEncoding('utf8');  // Work with strings rather than `Buffer`s.
      for await (const chunk of source) {
        yield await processChunk(chunk, { signal });
      }
    },
    fs.createWriteStream('uppercase.txt'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';

await pipeline(
  createReadStream('lowercase.txt'),
  async function* (source, { signal }) {
    source.setEncoding('utf8');  // Work with strings rather than `Buffer`s.
    for await (const chunk of source) {
      yield await processChunk(chunk, { signal });
    }
  },
  createWriteStream('uppercase.txt'),
);
console.log('Pipeline succeeded.');
```
:::

Ricorda di gestire l'argomento `signal` passato al generatore async. Soprattutto nel caso in cui il generatore async è la sorgente per la pipeline (cioè il primo argomento) oppure la pipeline non verrà mai completata.

::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  await pipeline(
    async function* ({ signal }) {
      await someLongRunningfn({ signal });
      yield 'asd';
    },
    fs.createWriteStream('uppercase.txt'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import fs from 'node:fs';
await pipeline(
  async function* ({ signal }) {
    await someLongRunningfn({ signal });
    yield 'asd';
  },
  fs.createWriteStream('uppercase.txt'),
);
console.log('Pipeline succeeded.');
```
:::

L'API `pipeline` fornisce [la versione callback](/it/nodejs/api/stream#streampipelinesource-transforms-destination-callback):


### `stream.finished(stream[, options])` {#streamfinishedstream-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.5.0, v18.14.0 | Aggiunto il supporto per `ReadableStream` e `WritableStream`. |
| v19.1.0, v18.13.0 | Aggiunta l'opzione `cleanup`. |
| v15.0.0 | Aggiunto in: v15.0.0 |
:::

- `stream` [\<Stream\>](/it/nodejs/api/stream#stream) | [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream) Uno stream/webstream leggibile e/o scrivibile.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `error` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `cleanup` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Se `true`, rimuove i listener registrati da questa funzione prima che la promise sia soddisfatta. **Predefinito:** `false`.
  
 
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si completa quando lo stream non è più leggibile o scrivibile.



::: code-group
```js [CJS]
const { finished } = require('node:stream/promises');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

async function run() {
  await finished(rs);
  console.log('Lo stream ha terminato la lettura.');
}

run().catch(console.error);
rs.resume(); // Scarica lo stream.
```

```js [ESM]
import { finished } from 'node:stream/promises';
import { createReadStream } from 'node:fs';

const rs = createReadStream('archive.tar');

async function run() {
  await finished(rs);
  console.log('Lo stream ha terminato la lettura.');
}

run().catch(console.error);
rs.resume(); // Scarica lo stream.
```
:::

L'API `finished` fornisce anche una [versione di callback](/it/nodejs/api/stream#streamfinishedstream-options-callback).

`stream.finished()` lascia event listeners pendenti (in particolare `'error'`, `'end'`, `'finish'` e `'close'`) dopo che la promise restituita è stata risolta o rifiutata. La ragione di ciò è che gli eventi `'error'` imprevisti (a causa di implementazioni di stream non corrette) non causino arresti anomali imprevisti. Se questo è un comportamento indesiderato, allora `options.cleanup` dovrebbe essere impostato su `true`:

```js [ESM]
await finished(rs, { cleanup: true });
```

### Modalità oggetto {#object-mode}

Tutti gli stream creati dalle API di Node.js operano esclusivamente su stringhe, oggetti [\<Buffer\>](/it/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) e [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView):

- `Strings` e `Buffers` sono i tipi più comuni utilizzati con gli stream.
- `TypedArray` e `DataView` consentono di gestire dati binari con tipi come `Int32Array` o `Uint8Array`. Quando si scrive un TypedArray o DataView in uno stream, Node.js elabora i byte raw.

È possibile, tuttavia, che le implementazioni di stream funzionino con altri tipi di valori JavaScript (ad eccezione di `null`, che ha uno scopo speciale all'interno degli stream). Tali stream sono considerati operanti in "modalità oggetto".

Le istanze di stream vengono commutate in modalità oggetto utilizzando l'opzione `objectMode` quando viene creato lo stream. Tentare di commutare uno stream esistente in modalità oggetto non è sicuro.

### Buffering {#buffering}

Sia gli stream [`Writable`](/it/nodejs/api/stream#class-streamwritable) che [`Readable`](/it/nodejs/api/stream#class-streamreadable) memorizzano i dati in un buffer interno.

La quantità di dati potenzialmente bufferizzati dipende dall'opzione `highWaterMark` passata al costruttore dello stream. Per gli stream normali, l'opzione `highWaterMark` specifica un [numero totale di byte](/it/nodejs/api/stream#highwatermark-discrepancy-after-calling-readablesetencoding). Per gli stream che operano in modalità oggetto, `highWaterMark` specifica un numero totale di oggetti. Per gli stream che operano su (ma non decodificano) stringhe, `highWaterMark` specifica un numero totale di unità di codice UTF-16.

I dati vengono bufferizzati negli stream `Readable` quando l'implementazione chiama [`stream.push(chunk)`](/it/nodejs/api/stream#readablepushchunk-encoding). Se il consumer dello Stream non chiama [`stream.read()`](/it/nodejs/api/stream#readablereadsize), i dati rimarranno nella coda interna fino a quando non verranno consumati.

Una volta che la dimensione totale del buffer di lettura interno raggiunge la soglia specificata da `highWaterMark`, lo stream smetterà temporaneamente di leggere i dati dalla risorsa sottostante fino a quando i dati attualmente bufferizzati non potranno essere consumati (ovvero, lo stream smetterà di chiamare il metodo interno [`readable._read()`](/it/nodejs/api/stream#readable_readsize) utilizzato per riempire il buffer di lettura).

I dati vengono bufferizzati negli stream `Writable` quando il metodo [`writable.write(chunk)`](/it/nodejs/api/stream#writablewritechunk-encoding-callback) viene chiamato ripetutamente. Mentre la dimensione totale del buffer di scrittura interno è inferiore alla soglia impostata da `highWaterMark`, le chiamate a `writable.write()` restituiranno `true`. Una volta che la dimensione del buffer interno raggiunge o supera `highWaterMark`, verrà restituito `false`.

Un obiettivo chiave dell'API `stream`, in particolare il metodo [`stream.pipe()`](/it/nodejs/api/stream#readablepipedestination-options), è limitare il buffering dei dati a livelli accettabili in modo che sorgenti e destinazioni di velocità diverse non sovraccarichino la memoria disponibile.

L'opzione `highWaterMark` è una soglia, non un limite: indica la quantità di dati che uno stream bufferizza prima di smettere di chiedere ulteriori dati. In generale, non impone una rigorosa limitazione della memoria. Implementazioni di stream specifiche possono scegliere di imporre limiti più rigidi, ma farlo è facoltativo.

Poiché gli stream [`Duplex`](/it/nodejs/api/stream#class-streamduplex) e [`Transform`](/it/nodejs/api/stream#class-streamtransform) sono sia `Readable` che `Writable`, ognuno mantiene *due* buffer interni separati utilizzati per la lettura e la scrittura, consentendo a ciascun lato di operare indipendentemente dall'altro mantenendo un flusso di dati appropriato ed efficiente. Ad esempio, le istanze di [`net.Socket`](/it/nodejs/api/net#class-netsocket) sono stream [`Duplex`](/it/nodejs/api/stream#class-streamduplex) il cui lato `Readable` consente il consumo di dati ricevuti *dalla* socket e il cui lato `Writable` consente la scrittura di dati *nella* socket. Poiché i dati possono essere scritti nella socket a una velocità maggiore o minore rispetto a quella con cui vengono ricevuti, ogni lato deve operare (e bufferizzare) indipendentemente dall'altro.

La meccanica del buffering interno è un dettaglio di implementazione interno e può essere modificata in qualsiasi momento. Tuttavia, per alcune implementazioni avanzate, i buffer interni possono essere recuperati utilizzando `writable.writableBuffer` o `readable.readableBuffer`. L'uso di queste proprietà non documentate è sconsigliato.


## API per i consumatori di stream {#api-for-stream-consumers}

Quasi tutte le applicazioni Node.js, non importa quanto semplici, utilizzano stream in qualche modo. Il seguente è un esempio di utilizzo degli stream in un'applicazione Node.js che implementa un server HTTP:

```js [ESM]
const http = require('node:http');

const server = http.createServer((req, res) => {
  // `req` è un http.IncomingMessage, che è uno stream leggibile.
  // `res` è un http.ServerResponse, che è uno stream scrivibile.

  let body = '';
  // Ottieni i dati come stringhe utf8.
  // Se una codifica non è impostata, verranno ricevuti oggetti Buffer.
  req.setEncoding('utf8');

  // Gli stream leggibili emettono eventi 'data' una volta aggiunto un listener.
  req.on('data', (chunk) => {
    body += chunk;
  });

  // L'evento 'end' indica che l'intero corpo è stato ricevuto.
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      // Rispondi con qualcosa di interessante all'utente:
      res.write(typeof data);
      res.end();
    } catch (er) {
      // uh oh! json non valido!
      res.statusCode = 400;
      return res.end(`error: ${er.message}`);
    }
  });
});

server.listen(1337);

// $ curl localhost:1337 -d "{}"
// object
// $ curl localhost:1337 -d "\"foo\""
// string
// $ curl localhost:1337 -d "not json"
// error: Unexpected token 'o', "not json" is not valid JSON
```
Gli stream [`Writable`](/it/nodejs/api/stream#class-streamwritable) (come `res` nell'esempio) espongono metodi come `write()` e `end()` che vengono utilizzati per scrivere dati sullo stream.

Gli stream [`Readable`](/it/nodejs/api/stream#class-streamreadable) utilizzano l'API [`EventEmitter`](/it/nodejs/api/events#class-eventemitter) per notificare al codice dell'applicazione quando i dati sono disponibili per essere letti dallo stream. Tali dati disponibili possono essere letti dallo stream in diversi modi.

Sia gli stream [`Writable`](/it/nodejs/api/stream#class-streamwritable) che [`Readable`](/it/nodejs/api/stream#class-streamreadable) utilizzano l'API [`EventEmitter`](/it/nodejs/api/events#class-eventemitter) in vari modi per comunicare lo stato corrente dello stream.

Gli stream [`Duplex`](/it/nodejs/api/stream#class-streamduplex) e [`Transform`](/it/nodejs/api/stream#class-streamtransform) sono sia [`Writable`](/it/nodejs/api/stream#class-streamwritable) che [`Readable`](/it/nodejs/api/stream#class-streamreadable).

Le applicazioni che scrivono o consumano dati da uno stream non sono tenute a implementare direttamente le interfacce di stream e generalmente non avranno motivo di chiamare `require('node:stream')`.

Gli sviluppatori che desiderano implementare nuovi tipi di stream dovrebbero fare riferimento alla sezione [API per gli implementatori di stream](/it/nodejs/api/stream#api-for-stream-implementers).


### Flussi scrivibili {#writable-streams}

I flussi scrivibili sono un'astrazione per una *destinazione* verso cui i dati vengono scritti.

Esempi di flussi [`Writable`](/it/nodejs/api/stream#class-streamwritable) includono:

- [Richieste HTTP, sul client](/it/nodejs/api/http#class-httpclientrequest)
- [Risposte HTTP, sul server](/it/nodejs/api/http#class-httpserverresponse)
- [Flussi di scrittura fs](/it/nodejs/api/fs#class-fswritestream)
- [Flussi zlib](/it/nodejs/api/zlib)
- [Flussi crittografici](/it/nodejs/api/crypto)
- [Socket TCP](/it/nodejs/api/net#class-netsocket)
- [Stdin del processo figlio](/it/nodejs/api/child_process#subprocessstdin)
- [`process.stdout`](/it/nodejs/api/process#processstdout), [`process.stderr`](/it/nodejs/api/process#processstderr)

Alcuni di questi esempi sono in realtà flussi [`Duplex`](/it/nodejs/api/stream#class-streamduplex) che implementano l'interfaccia [`Writable`](/it/nodejs/api/stream#class-streamwritable).

Tutti i flussi [`Writable`](/it/nodejs/api/stream#class-streamwritable) implementano l'interfaccia definita dalla classe `stream.Writable`.

Mentre le istanze specifiche di flussi [`Writable`](/it/nodejs/api/stream#class-streamwritable) possono differire in vari modi, tutti i flussi `Writable` seguono lo stesso schema di utilizzo fondamentale come illustrato nell'esempio seguente:

```js [ESM]
const myStream = getWritableStreamSomehow();
myStream.write('some data');
myStream.write('some more data');
myStream.end('done writing data');
```
#### Classe: `stream.Writable` {#class-streamwritable}

**Aggiunto in: v0.9.4**

##### Evento: `'close'` {#event-close}


::: info [Cronologia]
| Versione | Cambiamenti |
| --- | --- |
| v10.0.0 | Aggiunta l'opzione `emitClose` per specificare se `'close'` viene emesso alla distruzione. |
| v0.9.4 | Aggiunto in: v0.9.4 |
:::

L'evento `'close'` viene emesso quando il flusso e qualsiasi sua risorsa sottostante (un descrittore di file, ad esempio) sono stati chiusi. L'evento indica che non verranno emessi ulteriori eventi e non si verificherà alcun ulteriore calcolo.

Un flusso [`Writable`](/it/nodejs/api/stream#class-streamwritable) emetterà sempre l'evento `'close'` se viene creato con l'opzione `emitClose`.

##### Evento: `'drain'` {#event-drain}

**Aggiunto in: v0.9.4**

Se una chiamata a [`stream.write(chunk)`](/it/nodejs/api/stream#writablewritechunk-encoding-callback) restituisce `false`, l'evento `'drain'` verrà emesso quando sarà appropriato riprendere la scrittura dei dati nel flusso.

```js [ESM]
// Scrivi i dati al flusso scrivibile fornito un milione di volte.
// Sii attento alla contropressione.
function writeOneMillionTimes(writer, data, encoding, callback) {
  let i = 1000000;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        // Ultima volta!
        writer.write(data, encoding, callback);
      } else {
        // Vedi se dovremmo continuare o aspettare.
        // Non passare la callback, perché non abbiamo ancora finito.
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // Dovevo fermarmi prima!
      // Scrivi ancora una volta che si svuota.
      writer.once('drain', write);
    }
  }
}
```

##### Evento: `'error'` {#event-error}

**Aggiunto in: v0.9.4**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

L'evento `'error'` viene emesso se si è verificato un errore durante la scrittura o il trasferimento di dati. Il callback del listener riceve un singolo argomento `Error` quando viene chiamato.

Lo stream viene chiuso quando viene emesso l'evento `'error'` a meno che l'opzione [`autoDestroy`](/it/nodejs/api/stream#new-streamwritableoptions) non sia stata impostata su `false` durante la creazione dello stream.

Dopo `'error'`, nessun altro evento oltre a `'close'` *dovrebbe* essere emesso (inclusi gli eventi `'error'`).

##### Evento: `'finish'` {#event-finish}

**Aggiunto in: v0.9.4**

L'evento `'finish'` viene emesso dopo che il metodo [`stream.end()`](/it/nodejs/api/stream#writableendchunk-encoding-callback) è stato chiamato e tutti i dati sono stati scaricati nel sistema sottostante.

```js [ESM]
const writer = getWritableStreamSomehow();
for (let i = 0; i < 100; i++) {
  writer.write(`hello, #${i}!\n`);
}
writer.on('finish', () => {
  console.log('Tutte le scritture sono ora complete.');
});
writer.end('Questa è la fine\n');
```
##### Evento: `'pipe'` {#event-pipe}

**Aggiunto in: v0.9.4**

- `src` [\<stream.Readable\>](/it/nodejs/api/stream#class-streamreadable) stream sorgente che sta eseguendo il piping verso questo scrivibile

L'evento `'pipe'` viene emesso quando il metodo [`stream.pipe()`](/it/nodejs/api/stream#readablepipedestination-options) viene chiamato su uno stream readable, aggiungendo questo scrivibile al suo insieme di destinazioni.

```js [ESM]
const writer = getWritableStreamSomehow();
const reader = getReadableStreamSomehow();
writer.on('pipe', (src) => {
  console.log('Qualcosa sta eseguendo il piping nello writer.');
  assert.equal(src, reader);
});
reader.pipe(writer);
```
##### Evento: `'unpipe'` {#event-unpipe}

**Aggiunto in: v0.9.4**

- `src` [\<stream.Readable\>](/it/nodejs/api/stream#class-streamreadable) Lo stream sorgente che ha [rimosso il pipe](/it/nodejs/api/stream#readableunpipedestination) da questo scrivibile

L'evento `'unpipe'` viene emesso quando il metodo [`stream.unpipe()`](/it/nodejs/api/stream#readableunpipedestination) viene chiamato su uno stream [`Readable`](/it/nodejs/api/stream#class-streamreadable), rimuovendo questo [`Writable`](/it/nodejs/api/stream#class-streamwritable) dal suo insieme di destinazioni.

Questo viene emesso anche nel caso in cui questo stream [`Writable`](/it/nodejs/api/stream#class-streamwritable) emetta un errore quando uno stream [`Readable`](/it/nodejs/api/stream#class-streamreadable) esegue il pipe al suo interno.

```js [ESM]
const writer = getWritableStreamSomehow();
const reader = getReadableStreamSomehow();
writer.on('unpipe', (src) => {
  console.log('Qualcosa ha smesso di eseguire il piping nello writer.');
  assert.equal(src, reader);
});
reader.pipe(writer);
reader.unpipe(writer);
```

##### `writable.cork()` {#writablecork}

**Aggiunto in: v0.11.2**

Il metodo `writable.cork()` forza tutti i dati scritti a essere memorizzati nel buffer in memoria. I dati bufferizzati verranno scaricati quando vengono chiamati i metodi [`stream.uncork()`](/it/nodejs/api/stream#writableuncork) o [`stream.end()`](/it/nodejs/api/stream#writableendchunk-encoding-callback).

L'intento principale di `writable.cork()` è di gestire una situazione in cui diversi piccoli chunk vengono scritti nello stream in rapida successione. Invece di inoltrarli immediatamente alla destinazione sottostante, `writable.cork()` bufferizza tutti i chunk fino a quando non viene chiamato `writable.uncork()`, che li passerà tutti a `writable._writev()`, se presente. Ciò impedisce una situazione di blocco head-of-line in cui i dati vengono bufferizzati mentre si attende che il primo piccolo chunk venga elaborato. Tuttavia, l'uso di `writable.cork()` senza implementare `writable._writev()` può avere un effetto negativo sulla velocità effettiva.

Vedi anche: [`writable.uncork()`](/it/nodejs/api/stream#writableuncork), [`writable._writev()`](/it/nodejs/api/stream#writable_writevchunks-callback).

##### `writable.destroy([error])` {#writabledestroyerror}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.0.0 | Funziona come no-op su uno stream che è già stato distrutto. |
| v8.0.0 | Aggiunto in: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Opzionale, un errore da emettere con l'evento `'error'`.
- Restituisce: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Distrugge lo stream. Facoltativamente, emette un evento `'error'` ed emette un evento `'close'` (a meno che `emitClose` non sia impostato su `false`). Dopo questa chiamata, lo stream scrivibile è terminato e le successive chiamate a `write()` o `end()` comporteranno un errore `ERR_STREAM_DESTROYED`. Questo è un modo distruttivo e immediato per distruggere uno stream. Le chiamate precedenti a `write()` potrebbero non essere state scaricate e potrebbero attivare un errore `ERR_STREAM_DESTROYED`. Utilizzare `end()` invece di destroy se i dati devono essere scaricati prima della chiusura oppure attendere l'evento `'drain'` prima di distruggere lo stream.

```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

const fooErr = new Error('foo error');
myStream.destroy(fooErr);
myStream.on('error', (fooErr) => console.error(fooErr.message)); // foo error
```
```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

myStream.destroy();
myStream.on('error', function wontHappen() {});
```
```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();
myStream.destroy();

myStream.write('foo', (error) => console.error(error.code));
// ERR_STREAM_DESTROYED
```
Una volta che `destroy()` è stato chiamato, ulteriori chiamate saranno no-op e nessun ulteriore errore eccetto da `_destroy()` può essere emesso come `'error'`.

Gli implementatori non devono sovrascrivere questo metodo, ma implementare invece [`writable._destroy()`](/it/nodejs/api/stream#writable_destroyerr-callback).


##### `writable.closed` {#writableclosed}

**Aggiunto in: v18.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

È `true` dopo che è stato emesso `'close'`.

##### `writable.destroyed` {#writabledestroyed}

**Aggiunto in: v8.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

È `true` dopo che è stato chiamato [`writable.destroy()`](/it/nodejs/api/stream#writabledestroyerror).

```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

console.log(myStream.destroyed); // false
myStream.destroy();
console.log(myStream.destroyed); // true
```
##### `writable.end([chunk[, encoding]][, callback])` {#writableendchunk-encoding-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.0.0, v20.13.0 | L'argomento `chunk` ora può essere un'istanza di `TypedArray` o `DataView`. |
| v15.0.0 | La `callback` viene richiamata prima di 'finish' o in caso di errore. |
| v14.0.0 | La `callback` viene richiamata se vengono emessi 'finish' o 'error'. |
| v10.0.0 | Questo metodo ora restituisce un riferimento a `writable`. |
| v8.0.0 | L'argomento `chunk` ora può essere un'istanza di `Uint8Array`. |
| v0.9.4 | Aggiunto in: v0.9.4 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Dati opzionali da scrivere. Per i flussi che non operano in modalità oggetto, `chunk` deve essere una [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/it/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) o [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView). Per i flussi in modalità oggetto, `chunk` può essere qualsiasi valore JavaScript diverso da `null`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codifica se `chunk` è una stringa
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback per quando il flusso è terminato.
- Restituisce: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

La chiamata al metodo `writable.end()` segnala che non verranno più scritti dati nel [`Writable`](/it/nodejs/api/stream#class-streamwritable). Gli argomenti opzionali `chunk` e `encoding` consentono di scrivere un ulteriore blocco di dati finale immediatamente prima di chiudere il flusso.

La chiamata al metodo [`stream.write()`](/it/nodejs/api/stream#writablewritechunk-encoding-callback) dopo aver chiamato [`stream.end()`](/it/nodejs/api/stream#writableendchunk-encoding-callback) genererà un errore.

```js [ESM]
// Scrivi 'hello, ' e poi termina con 'world!'.
const fs = require('node:fs');
const file = fs.createWriteStream('example.txt');
file.write('hello, ');
file.end('world!');
// Scrivere altro ora non è consentito!
```

##### `writable.setDefaultEncoding(encoding)` {#writablesetdefaultencodingencoding}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.1.0 | Questo metodo ora restituisce un riferimento a `writable`. |
| v0.11.15 | Aggiunto in: v0.11.15 |
:::

- `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La nuova codifica predefinita
- Restituisce: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Il metodo `writable.setDefaultEncoding()` imposta la `encoding` predefinita per un flusso [`Writable`](/it/nodejs/api/stream#class-streamwritable).

##### `writable.uncork()` {#writableuncork}

**Aggiunto in: v0.11.2**

Il metodo `writable.uncork()` scarica tutti i dati bufferizzati da quando è stato chiamato [`stream.cork()`](/it/nodejs/api/stream#writablecork).

Quando si utilizzano [`writable.cork()`](/it/nodejs/api/stream#writablecork) e `writable.uncork()` per gestire il buffering delle scritture in un flusso, differire le chiamate a `writable.uncork()` utilizzando `process.nextTick()`. In questo modo è possibile raggruppare tutte le chiamate `writable.write()` che si verificano all'interno di una determinata fase del ciclo di eventi di Node.js.

```js [ESM]
stream.cork();
stream.write('some ');
stream.write('data ');
process.nextTick(() => stream.uncork());
```
Se il metodo [`writable.cork()`](/it/nodejs/api/stream#writablecork) viene chiamato più volte su un flusso, è necessario chiamare lo stesso numero di volte `writable.uncork()` per scaricare i dati bufferizzati.

```js [ESM]
stream.cork();
stream.write('some ');
stream.cork();
stream.write('data ');
process.nextTick(() => {
  stream.uncork();
  // I dati non verranno scaricati finché uncork() non viene chiamato una seconda volta.
  stream.uncork();
});
```
Vedi anche: [`writable.cork()`](/it/nodejs/api/stream#writablecork).

##### `writable.writable` {#writablewritable}

**Aggiunto in: v11.4.0**

- [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

È `true` se è sicuro chiamare [`writable.write()`](/it/nodejs/api/stream#writablewritechunk-encoding-callback), il che significa che il flusso non è stato distrutto, ha generato un errore o è terminato.

##### `writable.writableAborted` {#writablewritableaborted}

**Aggiunto in: v18.0.0, v16.17.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce se il flusso è stato distrutto o ha generato un errore prima di emettere `'finish'`.


##### `writable.writableEnded` {#writablewritableended}

**Aggiunto in: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

È `true` dopo che è stato chiamato [`writable.end()`](/it/nodejs/api/stream#writableendchunk-encoding-callback). Questa proprietà non indica se i dati sono stati scaricati; per questo, utilizzare invece [`writable.writableFinished`](/it/nodejs/api/stream#writablewritablefinished).

##### `writable.writableCorked` {#writablewritablecorked}

**Aggiunto in: v13.2.0, v12.16.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Numero di volte in cui è necessario chiamare [`writable.uncork()`](/it/nodejs/api/stream#writableuncork) per sbloccare completamente lo stream.

##### `writable.errored` {#writableerrored}

**Aggiunto in: v18.0.0**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Restituisce un errore se lo stream è stato distrutto con un errore.

##### `writable.writableFinished` {#writablewritablefinished}

**Aggiunto in: v12.6.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

È impostato su `true` immediatamente prima che venga emesso l'evento [`'finish'`](/it/nodejs/api/stream#event-finish).

##### `writable.writableHighWaterMark` {#writablewritablehighwatermark}

**Aggiunto in: v9.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Restituisce il valore di `highWaterMark` passato durante la creazione di questo `Writable`.

##### `writable.writableLength` {#writablewritablelength}

**Aggiunto in: v9.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Questa proprietà contiene il numero di byte (o oggetti) nella coda pronti per essere scritti. Il valore fornisce dati di introspezione relativi allo stato di `highWaterMark`.

##### `writable.writableNeedDrain` {#writablewritableneeddrain}

**Aggiunto in: v15.2.0, v14.17.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

È `true` se il buffer dello stream è pieno e lo stream emetterà `'drain'`.


##### `writable.writableObjectMode` {#writablewritableobjectmode}

**Aggiunto in: v12.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Getter per la proprietà `objectMode` di un determinato stream `Writable`.

##### `writable[Symbol.asyncDispose]()` {#writablesymbolasyncdispose}

**Aggiunto in: v22.4.0, v20.16.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Chiama [`writable.destroy()`](/it/nodejs/api/stream#writabledestroyerror) con un `AbortError` e restituisce una promise che si risolve quando lo stream è terminato.

##### `writable.write(chunk[, encoding][, callback])` {#writablewritechunk-encoding-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.0.0, v20.13.0 | L'argomento `chunk` ora può essere un'istanza di `TypedArray` o `DataView`. |
| v8.0.0 | L'argomento `chunk` ora può essere un'istanza di `Uint8Array`. |
| v6.0.0 | Passare `null` come parametro `chunk` sarà sempre considerato non valido, anche in modalità oggetto. |
| v0.9.4 | Aggiunto in: v0.9.4 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Dati facoltativi da scrivere. Per gli stream che non operano in modalità oggetto, `chunk` deve essere un [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/it/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) o [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView). Per gli stream in modalità oggetto, `chunk` può essere qualsiasi valore JavaScript diverso da `null`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) La codifica, se `chunk` è una stringa. **Predefinito:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback per quando questo chunk di dati viene scaricato.
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` se lo stream desidera che il codice chiamante attenda che l'evento `'drain'` venga emesso prima di continuare a scrivere dati aggiuntivi; altrimenti `true`.

Il metodo `writable.write()` scrive alcuni dati nello stream e richiama la `callback` fornita una volta che i dati sono stati completamente gestiti. Se si verifica un errore, la `callback` verrà richiamata con l'errore come primo argomento. La `callback` viene richiamata in modo asincrono e prima che venga emesso `'error'`.

Il valore di ritorno è `true` se il buffer interno è inferiore a `highWaterMark` configurato quando lo stream è stato creato dopo aver ammesso `chunk`. Se viene restituito `false`, ulteriori tentativi di scrittura di dati nello stream devono interrompersi fino all'emissione dell'evento [`'drain'`](/it/nodejs/api/stream#event-drain).

Mentre uno stream non si sta svuotando, le chiamate a `write()` bufferizzeranno `chunk` e restituiranno false. Una volta che tutti i chunk attualmente bufferizzati sono stati svuotati (accettati per la consegna dal sistema operativo), verrà emesso l'evento `'drain'`. Una volta che `write()` restituisce false, non scrivere più chunk fino all'emissione dell'evento `'drain'`. Sebbene sia consentito chiamare `write()` su uno stream che non si sta svuotando, Node.js bufferizzerà tutti i chunk scritti fino a quando non si verifica il massimo utilizzo della memoria, a quel punto si interromperà incondizionatamente. Anche prima che si interrompa, l'elevato utilizzo della memoria causerà scarse prestazioni del garbage collector e un RSS elevato (che in genere non viene rilasciato al sistema, anche dopo che la memoria non è più richiesta). Poiché i socket TCP potrebbero non svuotarsi mai se il peer remoto non legge i dati, scrivere su un socket che non si sta svuotando potrebbe portare a una vulnerabilità sfruttabile da remoto.

La scrittura di dati mentre lo stream non si sta svuotando è particolarmente problematica per un [`Transform`](/it/nodejs/api/stream#class-streamtransform), perché gli stream `Transform` vengono messi in pausa per impostazione predefinita finché non vengono piped o viene aggiunto un gestore di eventi `'data'` o `'readable'`.

Se i dati da scrivere possono essere generati o recuperati su richiesta, si consiglia di incapsulare la logica in un [`Readable`](/it/nodejs/api/stream#class-streamreadable) e utilizzare [`stream.pipe()`](/it/nodejs/api/stream#readablepipedestination-options). Tuttavia, se si preferisce chiamare `write()`, è possibile rispettare la contropressione ed evitare problemi di memoria utilizzando l'evento [`'drain'`](/it/nodejs/api/stream#event-drain):

```js [ESM]
function write(data, cb) {
  if (!stream.write(data)) {
    stream.once('drain', cb);
  } else {
    process.nextTick(cb);
  }
}

// Aspetta che cb venga chiamata prima di eseguire qualsiasi altra scrittura.
write('hello', () => {
  console.log('Scrittura completata, esegui altre scritture ora.');
});
```
Uno stream `Writable` in modalità oggetto ignorerà sempre l'argomento `encoding`.


### Stream leggibili {#readable-streams}

Gli stream leggibili sono un'astrazione per una *sorgente* da cui vengono consumati i dati.

Esempi di stream `Readable` includono:

- [Risposte HTTP, sul client](/it/nodejs/api/http#class-httpincomingmessage)
- [Richieste HTTP, sul server](/it/nodejs/api/http#class-httpincomingmessage)
- [Stream di lettura fs](/it/nodejs/api/fs#class-fsreadstream)
- [Stream zlib](/it/nodejs/api/zlib)
- [Stream crittografici](/it/nodejs/api/crypto)
- [Socket TCP](/it/nodejs/api/net#class-netsocket)
- [stdout e stderr del processo figlio](/it/nodejs/api/child_process#subprocessstdout)
- [`process.stdin`](/it/nodejs/api/process#processstdin)

Tutti gli stream [`Readable`](/it/nodejs/api/stream#class-streamreadable) implementano l'interfaccia definita dalla classe `stream.Readable`.

#### Due modalità di lettura {#two-reading-modes}

Gli stream `Readable` operano effettivamente in una delle due modalità: flowing e paused. Queste modalità sono separate dalla [modalità oggetto](/it/nodejs/api/stream#object-mode). Uno stream [`Readable`](/it/nodejs/api/stream#class-streamreadable) può essere in modalità oggetto o meno, indipendentemente dal fatto che sia in modalità flowing o in modalità paused.

- In modalità flowing, i dati vengono letti automaticamente dal sistema sottostante e forniti a un'applicazione il più rapidamente possibile utilizzando eventi tramite l'interfaccia [`EventEmitter`](/it/nodejs/api/events#class-eventemitter).
- In modalità paused, il metodo [`stream.read()`](/it/nodejs/api/stream#readablereadsize) deve essere chiamato esplicitamente per leggere blocchi di dati dallo stream.

Tutti gli stream [`Readable`](/it/nodejs/api/stream#class-streamreadable) iniziano in modalità paused, ma possono essere commutati in modalità flowing in uno dei seguenti modi:

- Aggiungendo un gestore di eventi [`'data'`](/it/nodejs/api/stream#event-data).
- Chiamando il metodo [`stream.resume()`](/it/nodejs/api/stream#readableresume).
- Chiamando il metodo [`stream.pipe()`](/it/nodejs/api/stream#readablepipedestination-options) per inviare i dati a uno stream [`Writable`](/it/nodejs/api/stream#class-streamwritable).

Lo stream `Readable` può tornare in modalità paused utilizzando uno dei seguenti metodi:

- Se non ci sono destinazioni di pipe, chiamando il metodo [`stream.pause()`](/it/nodejs/api/stream#readablepause).
- Se ci sono destinazioni di pipe, rimuovendo tutte le destinazioni di pipe. È possibile rimuovere più destinazioni di pipe chiamando il metodo [`stream.unpipe()`](/it/nodejs/api/stream#readableunpipedestination).

Il concetto importante da ricordare è che uno stream `Readable` non genererà dati fino a quando non viene fornito un meccanismo per consumare o ignorare tali dati. Se il meccanismo di consumo è disabilitato o rimosso, lo stream `Readable` *cercherà* di interrompere la generazione dei dati.

Per motivi di compatibilità con le versioni precedenti, la rimozione dei gestori di eventi [`'data'`](/it/nodejs/api/stream#event-data) **non** metterà automaticamente in pausa lo stream. Inoltre, se ci sono destinazioni piped, la chiamata a [`stream.pause()`](/it/nodejs/api/stream#readablepause) non garantirà che lo stream *rimanga* in pausa una volta che tali destinazioni si scaricano e richiedono più dati.

Se uno stream [`Readable`](/it/nodejs/api/stream#class-streamreadable) viene commutato in modalità flowing e non sono disponibili consumer per gestire i dati, tali dati andranno persi. Ciò può verificarsi, ad esempio, quando viene chiamato il metodo `readable.resume()` senza un listener collegato all'evento `'data'`, o quando un gestore di eventi `'data'` viene rimosso dallo stream.

L'aggiunta di un gestore di eventi [`'readable'`](/it/nodejs/api/stream#event-readable) fa sì che lo stream smetta automaticamente di fluire e i dati devono essere consumati tramite [`readable.read()`](/it/nodejs/api/stream#readablereadsize). Se il gestore di eventi [`'readable'`](/it/nodejs/api/stream#event-readable) viene rimosso, lo stream ricomincerà a fluire se è presente un gestore di eventi [`'data'`](/it/nodejs/api/stream#event-data).


#### Tre stati {#three-states}

I "due modi" di funzionamento per uno stream `Readable` sono un'astrazione semplificata per la gestione dello stato interno più complessa che avviene all'interno dell'implementazione dello stream `Readable`.

Nello specifico, in un dato momento, ogni `Readable` si trova in uno dei tre possibili stati:

- `readable.readableFlowing === null`
- `readable.readableFlowing === false`
- `readable.readableFlowing === true`

Quando `readable.readableFlowing` è `null`, non viene fornito alcun meccanismo per consumare i dati dello stream. Pertanto, lo stream non genererà dati. Mentre si trova in questo stato, collegare un listener per l'evento `'data'`, chiamare il metodo `readable.pipe()` o chiamare il metodo `readable.resume()` cambierà `readable.readableFlowing` in `true`, facendo sì che il `Readable` inizi a emettere attivamente eventi man mano che i dati vengono generati.

Chiamare `readable.pause()`, `readable.unpipe()` o ricevere contropressione farà sì che `readable.readableFlowing` venga impostato come `false`, interrompendo temporaneamente il flusso di eventi ma *non* interrompendo la generazione di dati. Mentre si trova in questo stato, collegare un listener per l'evento `'data'` non cambierà `readable.readableFlowing` in `true`.

```js [ESM]
const { PassThrough, Writable } = require('node:stream');
const pass = new PassThrough();
const writable = new Writable();

pass.pipe(writable);
pass.unpipe(writable);
// readableFlowing è ora false.

pass.on('data', (chunk) => { console.log(chunk.toString()); });
// readableFlowing è ancora false.
pass.write('ok');  // Non emetterà 'data'.
pass.resume();     // Deve essere chiamato per fare in modo che lo stream emetta 'data'.
// readableFlowing è ora true.
```
Mentre `readable.readableFlowing` è `false`, i dati potrebbero accumularsi all'interno del buffer interno dello stream.

#### Scegli uno stile API {#choose-one-api-style}

L'API stream `Readable` si è evoluta attraverso molteplici versioni di Node.js e fornisce molteplici metodi per consumare i dati dello stream. In generale, gli sviluppatori dovrebbero scegliere *uno* dei metodi per consumare i dati e *non dovrebbero mai* utilizzare più metodi per consumare i dati da un singolo stream. Nello specifico, utilizzare una combinazione di `on('data')`, `on('readable')`, `pipe()` o iteratori asincroni potrebbe portare a un comportamento non intuitivo.


#### Classe: `stream.Readable` {#class-streamreadable}

**Aggiunto in: v0.9.4**

##### Evento: `'close'` {#event-close_1}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Aggiunta l'opzione `emitClose` per specificare se `'close'` viene emesso durante la distruzione. |
| v0.9.4 | Aggiunto in: v0.9.4 |
:::

L'evento `'close'` viene emesso quando lo stream e una qualsiasi delle sue risorse sottostanti (ad esempio, un descrittore di file) sono state chiuse. L'evento indica che non verranno emessi altri eventi e non si verificheranno ulteriori calcoli.

Uno stream [`Readable`](/it/nodejs/api/stream#class-streamreadable) emetterà sempre l'evento `'close'` se viene creato con l'opzione `emitClose`.

##### Evento: `'data'` {#event-data}

**Aggiunto in: v0.9.4**

- `chunk` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Il chunk di dati. Per gli stream che non operano in modalità oggetto, il chunk sarà una stringa o un `Buffer`. Per gli stream che sono in modalità oggetto, il chunk può essere qualsiasi valore JavaScript diverso da `null`.

L'evento `'data'` viene emesso ogni volta che lo stream cede la proprietà di un chunk di dati a un consumer. Ciò può verificarsi ogni volta che lo stream viene commutato in modalità di flusso chiamando `readable.pipe()`, `readable.resume()` o collegando una callback listener all'evento `'data'`. L'evento `'data'` verrà emesso anche ogni volta che viene chiamato il metodo `readable.read()` e un chunk di dati è disponibile per essere restituito.

Collegare un listener di eventi `'data'` a uno stream che non è stato esplicitamente messo in pausa commuterà lo stream in modalità di flusso. I dati verranno quindi passati non appena saranno disponibili.

Alla callback listener verrà passato il chunk di dati come stringa se è stata specificata una codifica predefinita per lo stream utilizzando il metodo `readable.setEncoding()`; altrimenti i dati verranno passati come `Buffer`.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Ricevuti ${chunk.length} byte di dati.`);
});
```

##### Evento: `'end'` {#event-end}

**Aggiunto in: v0.9.4**

L'evento `'end'` viene emesso quando non ci sono più dati da consumare dal flusso.

L'evento `'end'` **non verrà emesso** a meno che i dati non siano completamente consumati. Ciò può essere ottenuto commutando il flusso in modalità flowing o chiamando [`stream.read()`](/it/nodejs/api/stream#readablereadsize) ripetutamente fino a quando tutti i dati non sono stati consumati.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
});
readable.on('end', () => {
  console.log('There will be no more data.');
});
```
##### Evento: `'error'` {#event-error_1}

**Aggiunto in: v0.9.4**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

L'evento `'error'` può essere emesso da un'implementazione `Readable` in qualsiasi momento. In genere, ciò può verificarsi se il flusso sottostante non è in grado di generare dati a causa di un errore interno sottostante o quando un'implementazione del flusso tenta di inviare un chunk di dati non valido.

Al callback del listener verrà passato un singolo oggetto `Error`.

##### Evento: `'pause'` {#event-pause}

**Aggiunto in: v0.9.4**

L'evento `'pause'` viene emesso quando viene chiamato [`stream.pause()`](/it/nodejs/api/stream#readablepause) e `readableFlowing` non è `false`.

##### Evento: `'readable'` {#event-readable}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | `'readable'` viene sempre emesso nel tick successivo dopo che è stato chiamato `.push()`. |
| v10.0.0 | L'utilizzo di `'readable'` richiede la chiamata di `.read()`. |
| v0.9.4 | Aggiunto in: v0.9.4 |
:::

L'evento `'readable'` viene emesso quando ci sono dati disponibili per essere letti dal flusso, fino al limite massimo configurato (`state.highWaterMark`). In effetti, indica che il flusso ha nuove informazioni all'interno del buffer. Se i dati sono disponibili all'interno di questo buffer, è possibile chiamare [`stream.read()`](/it/nodejs/api/stream#readablereadsize) per recuperare tali dati. Inoltre, l'evento `'readable'` può anche essere emesso quando è stata raggiunta la fine del flusso.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('readable', function() {
  // There is some data to read now.
  let data;

  while ((data = this.read()) !== null) {
    console.log(data);
  }
});
```
Se è stata raggiunta la fine del flusso, la chiamata a [`stream.read()`](/it/nodejs/api/stream#readablereadsize) restituirà `null` e attiverà l'evento `'end'`. Questo è vero anche se non ci sono mai stati dati da leggere. Ad esempio, nel seguente esempio, `foo.txt` è un file vuoto:

```js [ESM]
const fs = require('node:fs');
const rr = fs.createReadStream('foo.txt');
rr.on('readable', () => {
  console.log(`readable: ${rr.read()}`);
});
rr.on('end', () => {
  console.log('end');
});
```
L'output dell'esecuzione di questo script è:

```bash [BASH]
$ node test.js
readable: null
end
```
In alcuni casi, l'aggiunta di un listener per l'evento `'readable'` farà sì che una certa quantità di dati venga letta in un buffer interno.

In generale, i meccanismi `readable.pipe()` e dell'evento `'data'` sono più facili da capire rispetto all'evento `'readable'`. Tuttavia, la gestione di `'readable'` potrebbe comportare un aumento della velocità effettiva.

Se sia `'readable'` che [`'data'`](/it/nodejs/api/stream#event-data) vengono utilizzati contemporaneamente, `'readable'` ha la precedenza nel controllo del flusso, ovvero `'data'` verrà emesso solo quando viene chiamato [`stream.read()`](/it/nodejs/api/stream#readablereadsize). La proprietà `readableFlowing` diventerebbe `false`. Se ci sono listener `'data'` quando viene rimosso `'readable'`, il flusso inizierà a fluire, ovvero gli eventi `'data'` verranno emessi senza chiamare `.resume()`.


##### Evento: `'resume'` {#event-resume}

**Aggiunto in: v0.9.4**

L'evento `'resume'` viene emesso quando viene chiamato [`stream.resume()`](/it/nodejs/api/stream#readableresume) e `readableFlowing` non è `true`.

##### `readable.destroy([error])` {#readabledestroyerror}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.0.0 | Funziona come no-op su uno stream che è già stato distrutto. |
| v8.0.0 | Aggiunto in: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Errore che verrà passato come payload nell'evento `'error'`
- Restituisce: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Distrugge lo stream. Facoltativamente emette un evento `'error'` ed emette un evento `'close'` (a meno che `emitClose` non sia impostato su `false`). Dopo questa chiamata, lo stream leggibile rilascerà qualsiasi risorsa interna e le successive chiamate a `push()` verranno ignorate.

Una volta che `destroy()` è stato chiamato, qualsiasi ulteriore chiamata sarà un no-op e nessun ulteriore errore tranne che da `_destroy()` potrà essere emesso come `'error'`.

Gli implementatori non devono sovrascrivere questo metodo, ma invece implementare [`readable._destroy()`](/it/nodejs/api/stream#readable_destroyerr-callback).

##### `readable.closed` {#readableclosed}

**Aggiunto in: v18.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

È `true` dopo che `'close'` è stato emesso.

##### `readable.destroyed` {#readabledestroyed}

**Aggiunto in: v8.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

È `true` dopo che [`readable.destroy()`](/it/nodejs/api/stream#readabledestroyerror) è stato chiamato.

##### `readable.isPaused()` {#readableispaused}

**Aggiunto in: v0.11.14**

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Il metodo `readable.isPaused()` restituisce lo stato operativo corrente di `Readable`. Questo è utilizzato principalmente dal meccanismo alla base del metodo `readable.pipe()`. Nella maggior parte dei casi tipici, non ci sarà alcun motivo per utilizzare questo metodo direttamente.

```js [ESM]
const readable = new stream.Readable();

readable.isPaused(); // === false
readable.pause();
readable.isPaused(); // === true
readable.resume();
readable.isPaused(); // === false
```

##### `readable.pause()` {#readablepause}

**Aggiunto in: v0.9.4**

- Restituisce: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Il metodo `readable.pause()` farà sì che uno stream in modalità flowing smetta di emettere eventi [`'data'`](/it/nodejs/api/stream#event-data), uscendo dalla modalità flowing. Qualsiasi dato che diventa disponibile rimarrà nel buffer interno.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Ricevuti ${chunk.length} byte di dati.`);
  readable.pause();
  console.log('Non ci saranno ulteriori dati per 1 secondo.');
  setTimeout(() => {
    console.log('Ora i dati inizieranno a fluire di nuovo.');
    readable.resume();
  }, 1000);
});
```
Il metodo `readable.pause()` non ha alcun effetto se è presente un listener di eventi `'readable'`.

##### `readable.pipe(destination[, options])` {#readablepipedestination-options}

**Aggiunto in: v0.9.4**

- `destination` [\<stream.Writable\>](/it/nodejs/api/stream#class-streamwritable) La destinazione per la scrittura dei dati
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni di pipe
    - `end` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Termina il writer quando il reader termina. **Predefinito:** `true`.
  
 
- Restituisce: [\<stream.Writable\>](/it/nodejs/api/stream#class-streamwritable) La *destinazione*, consentendo una catena di pipe se è uno stream [`Duplex`](/it/nodejs/api/stream#class-streamduplex) o [`Transform`](/it/nodejs/api/stream#class-streamtransform)

Il metodo `readable.pipe()` collega uno stream [`Writable`](/it/nodejs/api/stream#class-streamwritable) al `readable`, facendolo passare automaticamente in modalità flowing e inviando tutti i suoi dati al [`Writable`](/it/nodejs/api/stream#class-streamwritable) collegato. Il flusso di dati sarà gestito automaticamente in modo che lo stream `Writable` di destinazione non sia sopraffatto da uno stream `Readable` più veloce.

L'esempio seguente invia tramite pipe tutti i dati dal `readable` a un file denominato `file.txt`:

```js [ESM]
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// Tutti i dati da readable vanno in 'file.txt'.
readable.pipe(writable);
```
È possibile collegare più stream `Writable` a un singolo stream `Readable`.

Il metodo `readable.pipe()` restituisce un riferimento allo stream di *destinazione*, rendendo possibile impostare catene di stream piped:

```js [ESM]
const fs = require('node:fs');
const zlib = require('node:zlib');
const r = fs.createReadStream('file.txt');
const z = zlib.createGzip();
const w = fs.createWriteStream('file.txt.gz');
r.pipe(z).pipe(w);
```
Per impostazione predefinita, [`stream.end()`](/it/nodejs/api/stream#writableendchunk-encoding-callback) viene chiamato sullo stream `Writable` di destinazione quando lo stream `Readable` di origine emette [`'end'`](/it/nodejs/api/stream#event-end), in modo che la destinazione non sia più scrivibile. Per disabilitare questo comportamento predefinito, l'opzione `end` può essere passata come `false`, facendo in modo che lo stream di destinazione rimanga aperto:

```js [ESM]
reader.pipe(writer, { end: false });
reader.on('end', () => {
  writer.end('Goodbye\n');
});
```
Un avvertimento importante è che se lo stream `Readable` emette un errore durante l'elaborazione, la destinazione `Writable` *non viene chiusa* automaticamente. Se si verifica un errore, sarà necessario chiudere *manualmente* ogni stream per prevenire perdite di memoria.

Gli stream `Writable` [`process.stderr`](/it/nodejs/api/process#processstderr) e [`process.stdout`](/it/nodejs/api/process#processstdout) non vengono mai chiusi fino a quando il processo Node.js non si chiude, indipendentemente dalle opzioni specificate.


##### `readable.read([size])` {#readablereadsize}

**Aggiunto in: v0.9.4**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Argomento opzionale per specificare quanti dati leggere.
- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Il metodo `readable.read()` legge i dati dal buffer interno e li restituisce. Se non sono disponibili dati da leggere, viene restituito `null`. Per impostazione predefinita, i dati vengono restituiti come oggetto `Buffer` a meno che non sia stata specificata una codifica utilizzando il metodo `readable.setEncoding()` o lo stream non stia operando in modalità oggetto.

L'argomento opzionale `size` specifica un numero specifico di byte da leggere. Se non sono disponibili `size` byte da leggere, verrà restituito `null` *a meno che* lo stream non sia terminato, nel qual caso verranno restituiti tutti i dati rimanenti nel buffer interno.

Se l'argomento `size` non è specificato, verranno restituiti tutti i dati contenuti nel buffer interno.

L'argomento `size` deve essere minore o uguale a 1 GiB.

Il metodo `readable.read()` deve essere chiamato solo su stream `Readable` che operano in modalità in pausa. In modalità fluente, `readable.read()` viene chiamato automaticamente fino a quando il buffer interno non è completamente svuotato.

```js [ESM]
const readable = getReadableStreamSomehow();

// 'readable' potrebbe essere attivato più volte man mano che i dati vengono memorizzati nel buffer
readable.on('readable', () => {
  let chunk;
  console.log('Lo stream è leggibile (nuovi dati ricevuti nel buffer)');
  // Utilizzare un ciclo per assicurarsi di leggere tutti i dati attualmente disponibili
  while (null !== (chunk = readable.read())) {
    console.log(`Lettura di ${chunk.length} byte di dati...`);
  }
});

// 'end' verrà attivato una volta quando non sono più disponibili dati
readable.on('end', () => {
  console.log('Raggiunta la fine dello stream.');
});
```
Ogni chiamata a `readable.read()` restituisce un blocco di dati o `null`, indicando che non ci sono più dati da leggere in quel momento. Questi blocchi non vengono concatenati automaticamente. Poiché una singola chiamata a `read()` non restituisce tutti i dati, potrebbe essere necessario utilizzare un ciclo while per leggere continuamente i blocchi fino a quando non vengono recuperati tutti i dati. Durante la lettura di un file di grandi dimensioni, `.read()` potrebbe restituire temporaneamente `null`, indicando che ha consumato tutto il contenuto memorizzato nel buffer, ma potrebbero esserci ancora più dati da memorizzare nel buffer. In tali casi, viene emesso un nuovo evento `'readable'` una volta che ci sono più dati nel buffer e l'evento `'end'` indica la fine della trasmissione dei dati.

Pertanto, per leggere l'intero contenuto di un file da un `readable`, è necessario raccogliere blocchi su più eventi `'readable'`:

```js [ESM]
const chunks = [];

readable.on('readable', () => {
  let chunk;
  while (null !== (chunk = readable.read())) {
    chunks.push(chunk);
  }
});

readable.on('end', () => {
  const content = chunks.join('');
});
```
Uno stream `Readable` in modalità oggetto restituirà sempre un singolo elemento da una chiamata a [`readable.read(size)`](/it/nodejs/api/stream#readablereadsize), indipendentemente dal valore dell'argomento `size`.

Se il metodo `readable.read()` restituisce un blocco di dati, verrà emesso anche un evento `'data'`.

La chiamata a [`stream.read([size])`](/it/nodejs/api/stream#readablereadsize) dopo che l'evento [`'end'`](/it/nodejs/api/stream#event-end) è stato emesso restituirà `null`. Non verrà generato alcun errore di runtime.


##### `readable.readable` {#readablereadable}

**Aggiunto in: v11.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

È `true` se è sicuro chiamare [`readable.read()`](/it/nodejs/api/stream#readablereadsize), il che significa che lo stream non è stato distrutto o non ha emesso `'error'` o `'end'`.

##### `readable.readableAborted` {#readablereadableaborted}

**Aggiunto in: v16.8.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce se lo stream è stato distrutto o ha generato un errore prima di emettere `'end'`.

##### `readable.readableDidRead` {#readablereadabledidread}

**Aggiunto in: v16.7.0, v14.18.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce se `'data'` è stato emesso.

##### `readable.readableEncoding` {#readablereadableencoding}

**Aggiunto in: v12.7.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Getter per la proprietà `encoding` di un dato stream `Readable`. La proprietà `encoding` può essere impostata utilizzando il metodo [`readable.setEncoding()`](/it/nodejs/api/stream#readablesetencodingencoding).

##### `readable.readableEnded` {#readablereadableended}

**Aggiunto in: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Diventa `true` quando viene emesso l'evento [`'end'`](/it/nodejs/api/stream#event-end).

##### `readable.errored` {#readableerrored}

**Aggiunto in: v18.0.0**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Restituisce l'errore se lo stream è stato distrutto con un errore.

##### `readable.readableFlowing` {#readablereadableflowing}

**Aggiunto in: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Questa proprietà riflette lo stato attuale di uno stream `Readable` come descritto nella sezione [Tre stati](/it/nodejs/api/stream#three-states).


##### `readable.readableHighWaterMark` {#readablereadablehighwatermark}

**Aggiunto in: v9.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Restituisce il valore di `highWaterMark` passato durante la creazione di questo `Readable`.

##### `readable.readableLength` {#readablereadablelength}

**Aggiunto in: v9.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Questa proprietà contiene il numero di byte (o oggetti) nella coda pronti per essere letti. Il valore fornisce dati di introspezione riguardanti lo stato di `highWaterMark`.

##### `readable.readableObjectMode` {#readablereadableobjectmode}

**Aggiunto in: v12.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Getter per la proprietà `objectMode` di un determinato stream `Readable`.

##### `readable.resume()` {#readableresume}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | `resume()` non ha alcun effetto se è in ascolto un evento `'readable'`. |
| v0.9.4 | Aggiunto in: v0.9.4 |
:::

- Restituisce: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Il metodo `readable.resume()` fa sì che uno stream `Readable` esplicitamente in pausa riprenda a emettere eventi [`'data'`](/it/nodejs/api/stream#event-data), portando lo stream in modalità flowing.

Il metodo `readable.resume()` può essere utilizzato per consumare completamente i dati da uno stream senza elaborare effettivamente nessuno di quei dati:

```js [ESM]
getReadableStreamSomehow()
  .resume()
  .on('end', () => {
    console.log('Raggiunta la fine, ma non ho letto nulla.');
  });
```
Il metodo `readable.resume()` non ha effetto se c'è un listener di eventi `'readable'`.

##### `readable.setEncoding(encoding)` {#readablesetencodingencoding}

**Aggiunto in: v0.9.4**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codifica da utilizzare.
- Restituisce: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Il metodo `readable.setEncoding()` imposta la codifica dei caratteri per i dati letti dallo stream `Readable`.

Per impostazione predefinita, non viene assegnata alcuna codifica e i dati dello stream verranno restituiti come oggetti `Buffer`. L'impostazione di una codifica fa sì che i dati dello stream vengano restituiti come stringhe della codifica specificata anziché come oggetti `Buffer`. Ad esempio, chiamando `readable.setEncoding('utf8')` i dati di output verranno interpretati come dati UTF-8 e passati come stringhe. Chiamando `readable.setEncoding('hex')` i dati verranno codificati in formato stringa esadecimale.

Lo stream `Readable` gestirà correttamente i caratteri multi-byte forniti attraverso lo stream che altrimenti verrebbero decodificati in modo errato se semplicemente estratti dallo stream come oggetti `Buffer`.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.setEncoding('utf8');
readable.on('data', (chunk) => {
  assert.equal(typeof chunk, 'string');
  console.log('Ottenuti %d caratteri di dati stringa:', chunk.length);
});
```

##### `readable.unpipe([destination])` {#readableunpipedestination}

**Aggiunta in: v0.9.4**

- `destination` [\<stream.Writable\>](/it/nodejs/api/stream#class-streamwritable) Stream specifico opzionale da scollegare.
- Restituisce: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Il metodo `readable.unpipe()` scollega uno stream `Writable` precedentemente collegato utilizzando il metodo [`stream.pipe()`](/it/nodejs/api/stream#readablepipedestination-options).

Se `destination` non è specificato, allora *tutti* i pipe vengono scollegati.

Se `destination` è specificato, ma non è impostato alcun pipe per esso, allora il metodo non fa nulla.

```js [ESM]
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// Tutti i dati da readable vanno in 'file.txt',
// ma solo per il primo secondo.
readable.pipe(writable);
setTimeout(() => {
  console.log('Smetti di scrivere su file.txt.');
  readable.unpipe(writable);
  console.log('Chiudi manualmente lo stream del file.');
  writable.end();
}, 1000);
```
##### `readable.unshift(chunk[, encoding])` {#readableunshiftchunk-encoding}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.0.0, v20.13.0 | L'argomento `chunk` ora può essere un'istanza di `TypedArray` o `DataView`. |
| v8.0.0 | L'argomento `chunk` ora può essere un'istanza di `Uint8Array`. |
| v0.9.11 | Aggiunta in: v0.9.11 |
:::

- `chunk` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Chunk di dati da reinserire nella coda di lettura. Per gli stream che non operano in modalità oggetto, `chunk` deve essere un [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/it/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) o `null`. Per gli stream in modalità oggetto, `chunk` può essere qualsiasi valore JavaScript.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Codifica dei chunk di stringa. Deve essere una codifica `Buffer` valida, come `'utf8'` o `'ascii'`.

Passare `chunk` come `null` segnala la fine dello stream (EOF) e si comporta come `readable.push(null)`, dopo il quale non è possibile scrivere altri dati. Il segnale EOF viene inserito alla fine del buffer e tutti i dati memorizzati nel buffer verranno comunque scaricati.

Il metodo `readable.unshift()` reinserisce un chunk di dati nel buffer interno. Questo è utile in certe situazioni in cui uno stream viene utilizzato da codice che ha bisogno di "annullare il consumo" di una certa quantità di dati che ha estratto in modo ottimistico dalla sorgente, in modo che i dati possano essere passati a qualche altra parte.

Il metodo `stream.unshift(chunk)` non può essere chiamato dopo che l'evento [`'end'`](/it/nodejs/api/stream#event-end) è stato emesso o verrà generato un errore di runtime.

Gli sviluppatori che utilizzano `stream.unshift()` dovrebbero spesso considerare di passare all'uso di uno stream [`Transform`](/it/nodejs/api/stream#class-streamtransform). Vedere la sezione [API per gli implementatori di stream](/it/nodejs/api/stream#api-for-stream-implementers) per maggiori informazioni.

```js [ESM]
// Estrai un'intestazione delimitata da \n\n.
// Usa unshift() se otteniamo troppo.
// Chiama il callback con (error, header, stream).
const { StringDecoder } = require('node:string_decoder');
function parseHeader(stream, callback) {
  stream.on('error', callback);
  stream.on('readable', onReadable);
  const decoder = new StringDecoder('utf8');
  let header = '';
  function onReadable() {
    let chunk;
    while (null !== (chunk = stream.read())) {
      const str = decoder.write(chunk);
      if (str.includes('\n\n')) {
        // Trovato il limite dell'intestazione.
        const split = str.split(/\n\n/);
        header += split.shift();
        const remaining = split.join('\n\n');
        const buf = Buffer.from(remaining, 'utf8');
        stream.removeListener('error', callback);
        // Rimuovi il listener 'readable' prima di unshifting.
        stream.removeListener('readable', onReadable);
        if (buf.length)
          stream.unshift(buf);
        // Ora il corpo del messaggio può essere letto dallo stream.
        callback(null, header, stream);
        return;
      }
      // Stiamo ancora leggendo l'intestazione.
      header += str;
    }
  }
}
```
A differenza di [`stream.push(chunk)`](/it/nodejs/api/stream#readablepushchunk-encoding), `stream.unshift(chunk)` non terminerà il processo di lettura resettando lo stato di lettura interno dello stream. Ciò può causare risultati inattesi se `readable.unshift()` viene chiamato durante una lettura (cioè dall'interno di un'implementazione [`stream._read()`](/it/nodejs/api/stream#readable_readsize) su uno stream personalizzato). Seguire la chiamata a `readable.unshift()` con un [`stream.push('')`](/it/nodejs/api/stream#readablepushchunk-encoding) immediato ripristinerà lo stato di lettura in modo appropriato, tuttavia è meglio evitare semplicemente di chiamare `readable.unshift()` mentre si è in procinto di eseguire una lettura.


##### `readable.wrap(stream)` {#readablewrapstream}

**Aggiunto in: v0.9.4**

- `stream` [\<Stream\>](/it/nodejs/api/stream#stream) Uno stream di lettura "vecchio stile"
- Restituisce: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Prima di Node.js 0.10, gli stream non implementavano l'intera API del modulo `node:stream` come è definita attualmente. (Vedere [Compatibilità](/it/nodejs/api/stream#compatibility-with-older-nodejs-versions) per maggiori informazioni.)

Quando si utilizza una libreria Node.js più vecchia che emette eventi [`'data'`](/it/nodejs/api/stream#event-data) e ha un metodo [`stream.pause()`](/it/nodejs/api/stream#readablepause) che è solo consultivo, il metodo `readable.wrap()` può essere utilizzato per creare uno stream [`Readable`](/it/nodejs/api/stream#class-streamreadable) che utilizza il vecchio stream come sorgente dati.

Sarà raramente necessario utilizzare `readable.wrap()`, ma il metodo è stato fornito come una comodità per interagire con le applicazioni e librerie Node.js più vecchie.

```js [ESM]
const { OldReader } = require('./old-api-module.js');
const { Readable } = require('node:stream');
const oreader = new OldReader();
const myReader = new Readable().wrap(oreader);

myReader.on('readable', () => {
  myReader.read(); // ecc.
});
```
##### `readable[Symbol.asyncIterator]()` {#readablesymbolasynciterator}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.14.0 | Il supporto a Symbol.asyncIterator non è più sperimentale. |
| v10.0.0 | Aggiunto in: v10.0.0 |
:::

- Restituisce: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) per consumare completamente lo stream.

```js [ESM]
const fs = require('node:fs');

async function print(readable) {
  readable.setEncoding('utf8');
  let data = '';
  for await (const chunk of readable) {
    data += chunk;
  }
  console.log(data);
}

print(fs.createReadStream('file')).catch(console.error);
```
Se il ciclo termina con un `break`, `return`, o un `throw`, lo stream verrà distrutto. In altri termini, l'iterazione su uno stream consumerà lo stream completamente. Lo stream verrà letto in chunk di dimensioni pari all'opzione `highWaterMark`. Nell'esempio di codice sopra, i dati saranno in un singolo chunk se il file ha meno di 64 KiB di dati perché non viene fornita alcuna opzione `highWaterMark` a [`fs.createReadStream()`](/it/nodejs/api/fs#fscreatereadstreampath-options).


##### `readable[Symbol.asyncDispose]()` {#readablesymbolasyncdispose}

**Aggiunto in: v20.4.0, v18.18.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Chiama [`readable.destroy()`](/it/nodejs/api/stream#readabledestroyerror) con un `AbortError` e restituisce una promise che si adempie quando lo stream è terminato.

##### `readable.compose(stream[, options])` {#readablecomposestream-options}

**Aggiunto in: v19.1.0, v18.13.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `stream` [\<Stream\>](/it/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) consente di distruggere lo stream se il segnale viene interrotto.


- Restituisce: [\<Duplex\>](/it/nodejs/api/stream#class-streamduplex) uno stream composto con lo stream `stream`.

```js [ESM]
import { Readable } from 'node:stream';

async function* splitToWords(source) {
  for await (const chunk of source) {
    const words = String(chunk).split(' ');

    for (const word of words) {
      yield word;
    }
  }
}

const wordsStream = Readable.from(['this is', 'compose as operator']).compose(splitToWords);
const words = await wordsStream.toArray();

console.log(words); // prints ['this', 'is', 'compose', 'as', 'operator']
```
Vedere [`stream.compose`](/it/nodejs/api/stream#streamcomposestreams) per maggiori informazioni.

##### `readable.iterator([options])` {#readableiteratoroptions}

**Aggiunto in: v16.3.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `destroyOnReturn` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando impostato su `false`, chiamare `return` sull'iteratore asincrono, o uscire da un'iterazione `for await...of` usando un `break`, `return`, o `throw` non distruggerà lo stream. **Predefinito:** `true`.


- Restituisce: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) per consumare lo stream.

L'iteratore creato da questo metodo offre agli utenti la possibilità di annullare la distruzione dello stream se il ciclo `for await...of` viene chiuso da `return`, `break` o `throw`, oppure se l'iteratore deve distruggere lo stream se lo stream ha emesso un errore durante l'iterazione.

```js [ESM]
const { Readable } = require('node:stream');

async function printIterator(readable) {
  for await (const chunk of readable.iterator({ destroyOnReturn: false })) {
    console.log(chunk); // 1
    break;
  }

  console.log(readable.destroyed); // false

  for await (const chunk of readable.iterator({ destroyOnReturn: false })) {
    console.log(chunk); // Will print 2 and then 3
  }

  console.log(readable.destroyed); // True, stream was totally consumed
}

async function printSymbolAsyncIterator(readable) {
  for await (const chunk of readable) {
    console.log(chunk); // 1
    break;
  }

  console.log(readable.destroyed); // true
}

async function showBoth() {
  await printIterator(Readable.from([1, 2, 3]));
  await printSymbolAsyncIterator(Readable.from([1, 2, 3]));
}

showBoth();
```

##### `readable.map(fn[, options])` {#readablemapfn-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.7.0, v18.19.0 | aggiunto `highWaterMark` nelle opzioni. |
| v17.4.0, v16.14.0 | Aggiunto in: v17.4.0, v16.14.0 |
:::

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) una funzione per mappare ogni chunk nello stream.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) un chunk di dati dallo stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) interrotto se lo stream viene distrutto permettendo di interrompere anticipatamente la chiamata `fn`.




- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) il numero massimo di invocazioni concorrenti di `fn` da chiamare sullo stream contemporaneamente. **Predefinito:** `1`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) quanti elementi memorizzare nel buffer durante l'attesa del consumo da parte dell'utente degli elementi mappati. **Predefinito:** `concurrency * 2 - 1`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) consente di distruggere lo stream se il segnale viene interrotto.


- Restituisce: [\<Readable\>](/it/nodejs/api/stream#class-streamreadable) uno stream mappato con la funzione `fn`.

Questo metodo consente di mappare lo stream. La funzione `fn` verrà chiamata per ogni chunk nello stream. Se la funzione `fn` restituisce una promise, tale promise verrà `await`ed prima di essere passata allo stream di risultati.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// Con un mapper sincrono.
for await (const chunk of Readable.from([1, 2, 3, 4]).map((x) => x * 2)) {
  console.log(chunk); // 2, 4, 6, 8
}
// Con un mapper asincrono, eseguendo al massimo 2 query alla volta.
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map((domain) => resolver.resolve4(domain), { concurrency: 2 });
for await (const result of dnsResults) {
  console.log(result); // Registra il risultato DNS di resolver.resolve4.
}
```

##### `readable.filter(fn[, options])` {#readablefilterfn-options}

::: info [Storia]
| Versione | Modifiche |
| --- | --- |
| v20.7.0, v18.19.0 | aggiunto `highWaterMark` nelle opzioni. |
| v17.4.0, v16.14.0 | Aggiunto in: v17.4.0, v16.14.0 |
:::

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) una funzione per filtrare i chunk dallo stream.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) un chunk di dati dallo stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) interrotto se lo stream viene distrutto consentendo di interrompere anticipatamente la chiamata `fn`.
  
 
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) il numero massimo di invocazioni concorrenti di `fn` da chiamare sullo stream contemporaneamente. **Predefinito:** `1`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) quanti elementi bufferizzare durante l'attesa del consumo da parte dell'utente degli elementi filtrati. **Predefinito:** `concurrency * 2 - 1`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) consente di distruggere lo stream se il segnale viene interrotto.
  
 
- Restituisce: [\<Readable\>](/it/nodejs/api/stream#class-streamreadable) uno stream filtrato con il predicato `fn`.

Questo metodo consente di filtrare lo stream. Per ogni chunk nello stream, verrà chiamata la funzione `fn` e, se restituisce un valore truthy, il chunk verrà passato allo stream di risultati. Se la funzione `fn` restituisce una promise, quella promise verrà `await`ed.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// Con un predicato sincrono.
for await (const chunk of Readable.from([1, 2, 3, 4]).filter((x) => x > 2)) {
  console.log(chunk); // 3, 4
}
// Con un predicato asincrono, che esegue al massimo 2 query alla volta.
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).filter(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address.ttl > 60;
}, { concurrency: 2 });
for await (const result of dnsResults) {
  // Registra i domini con più di 60 secondi sul record DNS risolto.
  console.log(result);
}
```

##### `readable.forEach(fn[, options])` {#readableforeachfn-options}

**Aggiunto in: v17.5.0, v16.15.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) una funzione da chiamare su ogni blocco dello stream.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) un blocco di dati dallo stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) interrotto se lo stream viene distrutto consentendo di interrompere anticipatamente la chiamata `fn`.
  
 
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) il numero massimo di invocazioni concorrenti di `fn` da chiamare sullo stream contemporaneamente. **Predefinito:** `1`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) consente di distruggere lo stream se il segnale viene interrotto.
  
 
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) una promise per quando lo stream ha terminato.

Questo metodo consente di iterare uno stream. Per ogni blocco nello stream verrà chiamata la funzione `fn`. Se la funzione `fn` restituisce una promise, quella promise verrà `await`ed.

Questo metodo è diverso dai cicli `for await...of` in quanto può facoltativamente elaborare i blocchi contemporaneamente. Inoltre, un'iterazione `forEach` può essere interrotta solo avendo passato un'opzione `signal` e interrompendo il relativo `AbortController` mentre `for await...of` può essere interrotto con `break` o `return`. In entrambi i casi lo stream verrà distrutto.

Questo metodo è diverso dall'ascolto dell'evento [`'data'`](/it/nodejs/api/stream#event-data) in quanto utilizza l'evento [`readable`](/it/nodejs/api/stream#class-streamreadable) nel meccanismo sottostante e può limitare il numero di chiamate `fn` concorrenti.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// Con un predicato sincrono.
for await (const chunk of Readable.from([1, 2, 3, 4]).filter((x) => x > 2)) {
  console.log(chunk); // 3, 4
}
// Con un predicato asincrono, effettuando al massimo 2 query alla volta.
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address;
}, { concurrency: 2 });
await dnsResults.forEach((result) => {
  // Registra il risultato, simile a `for await (const result of dnsResults)`
  console.log(result);
});
console.log('done'); // Lo stream ha terminato
```

##### `readable.toArray([options])` {#readabletoarrayoptions}

**Aggiunto in: v17.5.0, v16.15.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) permette di annullare l'operazione toArray se il segnale viene interrotto.
  
 
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) una promise contenente un array con il contenuto dello stream.

Questo metodo permette di ottenere facilmente il contenuto di uno stream.

Poiché questo metodo legge l'intero stream in memoria, nega i vantaggi degli stream. È inteso per l'interoperabilità e la comodità, non come il modo principale per consumare gli stream.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

await Readable.from([1, 2, 3, 4]).toArray(); // [1, 2, 3, 4]

// Esegui query DNS in parallelo usando .map e raccogli
// i risultati in un array usando toArray
const dnsResults = await Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address;
}, { concurrency: 2 }).toArray();
```
##### `readable.some(fn[, options])` {#readablesomefn-options}

**Aggiunto in: v17.5.0, v16.15.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) una funzione da chiamare su ogni chunk dello stream.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) un chunk di dati dallo stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) interrotto se lo stream viene distrutto permettendo di interrompere la chiamata a `fn` in anticipo.
  
 
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) il numero massimo di invocazioni concorrenti di `fn` da chiamare sullo stream contemporaneamente. **Predefinito:** `1`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) permette di distruggere lo stream se il segnale viene interrotto.
  
 
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) una promise che valuta a `true` se `fn` ha restituito un valore truthy per almeno uno dei chunk.

Questo metodo è simile a `Array.prototype.some` e chiama `fn` su ogni chunk nello stream finché il valore di ritorno atteso è `true` (o qualsiasi valore truthy). Una volta che una chiamata `fn` su un chunk con valore di ritorno atteso è truthy, lo stream viene distrutto e la promise viene soddisfatta con `true`. Se nessuna delle chiamate `fn` sui chunk restituisce un valore truthy, la promise viene soddisfatta con `false`.

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// Con un predicato sincrono.
await Readable.from([1, 2, 3, 4]).some((x) => x > 2); // true
await Readable.from([1, 2, 3, 4]).some((x) => x < 0); // false

// Con un predicato asincrono, effettuando al massimo 2 controlli di file alla volta.
const anyBigFile = await Readable.from([
  'file1',
  'file2',
  'file3',
]).some(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
console.log(anyBigFile); // `true` se un qualsiasi file nella lista è più grande di 1MB
console.log('done'); // Lo Stream è terminato
```

##### `readable.find(fn[, options])` {#readablefindfn-options}

**Aggiunto in: v17.5.0, v16.17.0**

::: warning [Stable: 1 - Sperimentale]
[Stable: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) una funzione da chiamare su ogni chunk dello stream.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) un chunk di dati dallo stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) interrotto se lo stream viene distrutto, consentendo di interrompere anticipatamente la chiamata `fn`.




- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) il numero massimo di invocazioni concorrenti di `fn` da chiamare contemporaneamente sullo stream. **Predefinito:** `1`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) consente di distruggere lo stream se il segnale viene interrotto.


- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) una promise che valuta il primo chunk per il quale `fn` ha valutato con un valore truthy, o `undefined` se non è stato trovato alcun elemento.

Questo metodo è simile a `Array.prototype.find` e chiama `fn` su ogni chunk nello stream per trovare un chunk con un valore truthy per `fn`. Una volta che il valore di ritorno atteso di una chiamata `fn` è truthy, lo stream viene distrutto e la promise viene soddisfatta con il valore per il quale `fn` ha restituito un valore truthy. Se tutte le chiamate `fn` sui chunk restituiscono un valore falsy, la promise viene soddisfatta con `undefined`.

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// Con un predicato sincrono.
await Readable.from([1, 2, 3, 4]).find((x) => x > 2); // 3
await Readable.from([1, 2, 3, 4]).find((x) => x > 0); // 1
await Readable.from([1, 2, 3, 4]).find((x) => x > 10); // undefined

// Con un predicato asincrono, eseguendo al massimo 2 controlli di file alla volta.
const foundBigFile = await Readable.from([
  'file1',
  'file2',
  'file3',
]).find(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
console.log(foundBigFile); // Nome del file grande, se un qualsiasi file nella lista è più grande di 1MB
console.log('done'); // Lo stream è terminato
```

##### `readable.every(fn[, options])` {#readableeveryfn-options}

**Aggiunto in: v17.5.0, v16.15.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) una funzione da chiamare su ogni chunk dello stream.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) un chunk di dati dallo stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) interrotto se lo stream viene distrutto consentendo di interrompere anticipatamente la chiamata a `fn`.
  
 
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) il numero massimo di invocazioni simultanee di `fn` da chiamare sullo stream contemporaneamente. **Predefinito:** `1`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) consente di distruggere lo stream se il segnale viene interrotto.
  
 
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) una promise che valuta a `true` se `fn` ha restituito un valore truthy per tutti i chunk.

Questo metodo è simile a `Array.prototype.every` e chiama `fn` su ogni chunk nello stream per verificare se tutti i valori di ritorno attesi sono valori truthy per `fn`. Una volta che una chiamata a `fn` su un valore di ritorno atteso di un chunk è falsy, lo stream viene distrutto e la promise viene soddisfatta con `false`. Se tutte le chiamate `fn` sui chunk restituiscono un valore truthy, la promise viene soddisfatta con `true`.

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// Con un predicato sincrono.
await Readable.from([1, 2, 3, 4]).every((x) => x > 2); // false
await Readable.from([1, 2, 3, 4]).every((x) => x > 0); // true

// Con un predicato asincrono, effettuando al massimo 2 controlli di file alla volta.
const allBigFiles = await Readable.from([
  'file1',
  'file2',
  'file3',
]).every(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
// `true` se tutti i file nell'elenco sono più grandi di 1MiB
console.log(allBigFiles);
console.log('fatto'); // Lo stream è terminato
```

##### `readable.flatMap(fn[, options])` {#readableflatmapfn-options}

**Aggiunto in: v17.5.0, v16.15.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncGeneratorFunction\>](https://tc39.es/proposal-async-iteration/#sec-asyncgeneratorfunction-constructor) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) una funzione da mappare su ogni chunk nello stream.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) un chunk di dati dallo stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) interrotto se lo stream viene distrutto, consentendo di interrompere anticipatamente la chiamata a `fn`.



- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) il numero massimo di invocazioni concorrenti di `fn` da chiamare sullo stream contemporaneamente. **Predefinito:** `1`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) consente di distruggere lo stream se il segnale viene interrotto.


- Restituisce: [\<Readable\>](/it/nodejs/api/stream#class-streamreadable) uno stream flat-mapped con la funzione `fn`.

Questo metodo restituisce un nuovo stream applicando la callback fornita a ciascun chunk dello stream e quindi appiattendo il risultato.

È possibile restituire uno stream o un altro iterabile o iterabile asincrono da `fn` e gli stream di risultati verranno uniti (appiattiti) nello stream restituito.

```js [ESM]
import { Readable } from 'node:stream';
import { createReadStream } from 'node:fs';

// Con un mapper sincrono.
for await (const chunk of Readable.from([1, 2, 3, 4]).flatMap((x) => [x, x])) {
  console.log(chunk); // 1, 1, 2, 2, 3, 3, 4, 4
}
// Con un mapper asincrono, combina il contenuto di 4 file
const concatResult = Readable.from([
  './1.mjs',
  './2.mjs',
  './3.mjs',
  './4.mjs',
]).flatMap((fileName) => createReadStream(fileName));
for await (const result of concatResult) {
  // Questo conterrà il contenuto (tutti i chunk) di tutti e 4 i file
  console.log(result);
}
```

##### `readable.drop(limit[, options])` {#readabledroplimit-options}

**Aggiunto in: v17.5.0, v16.15.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `limit` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) il numero di chunk da eliminare dal readable.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) consente di distruggere lo stream se il segnale viene interrotto.
  
 
- Restituisce: [\<Readable\>](/it/nodejs/api/stream#class-streamreadable) uno stream con `limit` chunk eliminati.

Questo metodo restituisce un nuovo stream con i primi `limit` chunk eliminati.

```js [ESM]
import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).drop(2).toArray(); // [3, 4]
```
##### `readable.take(limit[, options])` {#readabletakelimit-options}

**Aggiunto in: v17.5.0, v16.15.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `limit` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) il numero di chunk da prendere dal readable.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) consente di distruggere lo stream se il segnale viene interrotto.
  
 
- Restituisce: [\<Readable\>](/it/nodejs/api/stream#class-streamreadable) uno stream con `limit` chunk presi.

Questo metodo restituisce un nuovo stream con i primi `limit` chunk.

```js [ESM]
import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).take(2).toArray(); // [1, 2]
```
##### `readable.reduce(fn[, initial[, options]])` {#readablereducefn-initial-options}

**Aggiunto in: v17.5.0, v16.15.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) una funzione riduttore da chiamare su ogni chunk nello stream.
    - `previous` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) il valore ottenuto dall'ultima chiamata a `fn` o il valore `initial` se specificato o il primo chunk dello stream altrimenti.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) un chunk di dati dallo stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) interrotto se lo stream viene distrutto, consentendo di interrompere la chiamata `fn` in anticipo.
  
 
  
 
- `initial` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) il valore iniziale da utilizzare nella riduzione.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) consente di distruggere lo stream se il segnale viene interrotto.
  
 
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) una promise per il valore finale della riduzione.

Questo metodo chiama `fn` su ogni chunk dello stream in ordine, passandogli il risultato del calcolo sull'elemento precedente. Restituisce una promise per il valore finale della riduzione.

Se non viene fornito alcun valore `initial`, il primo chunk dello stream viene utilizzato come valore iniziale. Se lo stream è vuoto, la promise viene rifiutata con un `TypeError` con la proprietà del codice `ERR_INVALID_ARGS`.

```js [ESM]
import { Readable } from 'node:stream';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const directoryPath = './src';
const filesInDir = await readdir(directoryPath);

const folderSize = await Readable.from(filesInDir)
  .reduce(async (totalSize, file) => {
    const { size } = await stat(join(directoryPath, file));
    return totalSize + size;
  }, 0);

console.log(folderSize);
```
La funzione riduttore itera lo stream elemento per elemento, il che significa che non esiste alcun parametro `concurrency` o parallelismo. Per eseguire una `reduce` contemporaneamente, puoi estrarre la funzione async nel metodo [`readable.map`](/it/nodejs/api/stream#readablemapfn-options).

```js [ESM]
import { Readable } from 'node:stream';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const directoryPath = './src';
const filesInDir = await readdir(directoryPath);

const folderSize = await Readable.from(filesInDir)
  .map((file) => stat(join(directoryPath, file)), { concurrency: 2 })
  .reduce((totalSize, { size }) => totalSize + size, 0);

console.log(folderSize);
```

### Flussi duplex e di trasformazione {#duplex-and-transform-streams}

#### Classe: `stream.Duplex` {#class-streamduplex}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.8.0 | Le istanze di `Duplex` ora restituiscono `true` quando si controlla `instanceof stream.Writable`. |
| v0.9.4 | Aggiunto in: v0.9.4 |
:::

I flussi Duplex sono flussi che implementano sia le interfacce [`Readable`](/it/nodejs/api/stream#class-streamreadable) che [`Writable`](/it/nodejs/api/stream#class-streamwritable).

Esempi di flussi `Duplex` includono:

- [Socket TCP](/it/nodejs/api/net#class-netsocket)
- [Flussi zlib](/it/nodejs/api/zlib)
- [Flussi crittografici](/it/nodejs/api/crypto)

##### `duplex.allowHalfOpen` {#duplexallowhalfopen}

**Aggiunto in: v0.9.4**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se `false`, il flusso terminerà automaticamente il lato scrivibile quando termina il lato leggibile. Impostato inizialmente dall'opzione del costruttore `allowHalfOpen`, che ha come valore predefinito `true`.

Questo può essere modificato manualmente per cambiare il comportamento semiaperto di un'istanza di flusso `Duplex` esistente, ma deve essere modificato prima che venga emesso l'evento `'end'`.

#### Classe: `stream.Transform` {#class-streamtransform}

**Aggiunto in: v0.9.4**

I flussi di trasformazione sono flussi [`Duplex`](/it/nodejs/api/stream#class-streamduplex) in cui l'output è in qualche modo correlato all'input. Come tutti i flussi [`Duplex`](/it/nodejs/api/stream#class-streamduplex), i flussi `Transform` implementano sia le interfacce [`Readable`](/it/nodejs/api/stream#class-streamreadable) che [`Writable`](/it/nodejs/api/stream#class-streamwritable).

Esempi di flussi `Transform` includono:

- [Flussi zlib](/it/nodejs/api/zlib)
- [Flussi crittografici](/it/nodejs/api/crypto)

##### `transform.destroy([error])` {#transformdestroyerror}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.0.0 | Funziona come no-op su un flusso che è già stato distrutto. |
| v8.0.0 | Aggiunto in: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- Restituisce: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Distrugge il flusso e, facoltativamente, emette un evento `'error'`. Dopo questa chiamata, il flusso di trasformazione rilascerà tutte le risorse interne. Gli implementatori non devono sovrascrivere questo metodo, ma implementare invece [`readable._destroy()`](/it/nodejs/api/stream#readable_destroyerr-callback). L'implementazione predefinita di `_destroy()` per `Transform` emette anche `'close'` a meno che `emitClose` non sia impostato su false.

Una volta che `destroy()` è stato chiamato, qualsiasi ulteriore chiamata sarà un no-op e nessun ulteriore errore tranne da `_destroy()` può essere emesso come `'error'`.


#### `stream.duplexPair([options])` {#streamduplexpairoptions}

**Aggiunto in: v22.6.0, v20.17.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un valore da passare a entrambi i costruttori [`Duplex`](/it/nodejs/api/stream#class-streamduplex), per impostare opzioni come il buffering.
- Restituisce: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) di due istanze [`Duplex`](/it/nodejs/api/stream#class-streamduplex).

La funzione di utilità `duplexPair` restituisce un Array con due elementi, ognuno dei quali è uno stream `Duplex` connesso all'altro lato:

```js [ESM]
const [ sideA, sideB ] = duplexPair();
```
Qualsiasi cosa venga scritta su uno stream diventa leggibile sull'altro. Fornisce un comportamento analogo a una connessione di rete, in cui i dati scritti dal client diventano leggibili dal server e viceversa.

Gli stream Duplex sono simmetrici; uno o l'altro può essere utilizzato senza alcuna differenza di comportamento.

### `stream.finished(stream[, options], callback)` {#streamfinishedstream-options-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.5.0 | Aggiunto il supporto per `ReadableStream` e `WritableStream`. |
| v15.11.0 | È stata aggiunta l'opzione `signal`. |
| v14.0.0 | `finished(stream, cb)` aspetterà l'evento `'close'` prima di invocare il callback. L'implementazione cerca di rilevare gli stream legacy e applica questo comportamento solo agli stream che si prevede emettano `'close'`. |
| v14.0.0 | L'emissione di `'close'` prima di `'end'` su uno stream `Readable` causerà un errore `ERR_STREAM_PREMATURE_CLOSE`. |
| v14.0.0 | Il callback verrà invocato su stream che sono già terminati prima della chiamata a `finished(stream, cb)`. |
| v10.0.0 | Aggiunto in: v10.0.0 |
:::

- `stream` [\<Stream\>](/it/nodejs/api/stream#stream) | [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream) Uno stream/webstream leggibile e/o scrivibile.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `error` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su `false`, una chiamata a `emit('error', err)` non viene trattata come terminata. **Predefinito:** `true`.
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando impostato su `false`, il callback verrà chiamato quando lo stream termina anche se lo stream potrebbe essere ancora leggibile. **Predefinito:** `true`.
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando impostato su `false`, il callback verrà chiamato quando lo stream termina anche se lo stream potrebbe essere ancora scrivibile. **Predefinito:** `true`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) consente di interrompere l'attesa per la fine dello stream. Lo stream sottostante *non* verrà interrotto se il segnale viene interrotto. Il callback verrà chiamato con un `AbortError`. Verranno rimossi anche tutti i listener registrati aggiunti da questa funzione.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione di callback che accetta un argomento di errore opzionale.
- Restituisce: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione di pulizia che rimuove tutti i listener registrati.

Una funzione per essere notificati quando uno stream non è più leggibile, scrivibile o ha subito un errore o un evento di chiusura prematura.

```js [ESM]
const { finished } = require('node:stream');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

finished(rs, (err) => {
  if (err) {
    console.error('Stream failed.', err);
  } else {
    console.log('Stream is done reading.');
  }
});

rs.resume(); // Scarica lo stream.
```
Particolarmente utile negli scenari di gestione degli errori in cui uno stream viene distrutto prematuramente (come una richiesta HTTP interrotta) e non emetterà `'end'` o `'finish'`.

L'API `finished` fornisce la [versione promise](/it/nodejs/api/stream#streamfinishedstream-options).

`stream.finished()` lascia listener di eventi pendenti (in particolare `'error'`, `'end'`, `'finish'` e `'close'`) dopo che `callback` è stato invocato. La ragione di ciò è che eventi `'error'` inattesi (a causa di implementazioni di stream errate) non causino arresti anomali imprevisti. Se questo è un comportamento indesiderato, allora la funzione di pulizia restituita deve essere invocata nel callback:

```js [ESM]
const cleanup = finished(rs, (err) => {
  cleanup();
  // ...
});
```

### `stream.pipeline(source[, ...transforms], destination, callback)` {#streampipelinesource-transforms-destination-callback}

### `stream.pipeline(streams, callback)` {#streampipelinestreams-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.7.0, v18.16.0 | Aggiunto il supporto per i webstream. |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v14.0.0 | `pipeline(..., cb)` attenderà l'evento `'close'` prima di invocare la callback. L'implementazione cerca di rilevare gli stream legacy e applica questo comportamento solo agli stream che dovrebbero emettere `'close'`. |
| v13.10.0 | Aggiunto il supporto per i generatori async. |
| v10.0.0 | Aggiunto in: v10.0.0 |
:::

- `streams` [\<Stream[]\>](/it/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream[]\>](/it/nodejs/api/webstreams#class-readablestream) | [\<WritableStream[]\>](/it/nodejs/api/webstreams#class-writablestream) | [\<TransformStream[]\>](/it/nodejs/api/webstreams#class-transformstream)
- `source` [\<Stream\>](/it/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) 
    - Restituisce: [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `...transforms` [\<Stream\>](/it/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<TransformStream\>](/it/nodejs/api/webstreams#class-transformstream) 
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Restituisce: [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `destination` [\<Stream\>](/it/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream) 
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Restituisce: [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chiamata quando la pipeline è completamente terminata. 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `val` Valore risolto di `Promise` restituito da `destination`.
  
 
- Restituisce: [\<Stream\>](/it/nodejs/api/stream#stream)

Un metodo del modulo per collegare tramite pipe tra stream e generatori inoltrando gli errori ed eseguendo una pulizia corretta e fornendo una callback quando la pipeline è completa.

```js [ESM]
const { pipeline } = require('node:stream');
const fs = require('node:fs');
const zlib = require('node:zlib');

// Usa l'API pipeline per collegare facilmente una serie di stream
// insieme e ricevere una notifica quando la pipeline è completamente terminata.

// Una pipeline per comprimere in gzip un file tar potenzialmente enorme in modo efficiente:

pipeline(
  fs.createReadStream('archive.tar'),
  zlib.createGzip(),
  fs.createWriteStream('archive.tar.gz'),
  (err) => {
    if (err) {
      console.error('Pipeline fallita.', err);
    } else {
      console.log('Pipeline riuscita.');
    }
  },
);
```
L'API `pipeline` fornisce una [versione promise](/it/nodejs/api/stream#streampipelinesource-transforms-destination-options).

`stream.pipeline()` chiamerà `stream.destroy(err)` su tutti gli stream eccetto:

- Stream `Readable` che hanno emesso `'end'` o `'close'`.
- Stream `Writable` che hanno emesso `'finish'` o `'close'`.

`stream.pipeline()` lascia event listener pendenti sugli stream dopo che la `callback` è stata invocata. In caso di riutilizzo degli stream dopo un errore, ciò può causare perdite di event listener ed errori nascosti. Se l'ultimo stream è leggibile, gli event listener pendenti verranno rimossi in modo che l'ultimo stream possa essere consumato in seguito.

`stream.pipeline()` chiude tutti gli stream quando viene generato un errore. L'utilizzo di `IncomingRequest` con `pipeline` potrebbe portare a un comportamento imprevisto poiché distruggerebbe il socket senza inviare la risposta prevista. Vedi l'esempio qui sotto:

```js [ESM]
const fs = require('node:fs');
const http = require('node:http');
const { pipeline } = require('node:stream');

const server = http.createServer((req, res) => {
  const fileStream = fs.createReadStream('./fileNotExist.txt');
  pipeline(fileStream, res, (err) => {
    if (err) {
      console.log(err); // Nessun file di questo tipo
      // questo messaggio non può essere inviato una volta che `pipeline` ha già distrutto il socket
      return res.end('errore!!!');
    }
  });
});
```

### `stream.compose(...streams)` {#streamcomposestreams}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.1.0, v20.10.0 | Aggiunto il supporto per la classe stream. |
| v19.8.0, v18.16.0 | Aggiunto il supporto per i webstream. |
| v16.9.0 | Aggiunto in: v16.9.0 |
:::

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - `stream.compose` è sperimentale.
:::

- `streams` [\<Stream[]\>](/it/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream[]\>](/it/nodejs/api/webstreams#class-readablestream) | [\<WritableStream[]\>](/it/nodejs/api/webstreams#class-writablestream) | [\<TransformStream[]\>](/it/nodejs/api/webstreams#class-transformstream) | [\<Duplex[]\>](/it/nodejs/api/stream#class-streamduplex) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)

Combina due o più stream in uno stream `Duplex` che scrive nel primo stream e legge dall'ultimo. Ogni stream fornito viene collegato al successivo, utilizzando `stream.pipeline`. Se uno qualsiasi degli stream genera un errore, tutti vengono distrutti, incluso lo stream `Duplex` esterno.

Poiché `stream.compose` restituisce un nuovo stream che a sua volta può (e deve) essere collegato ad altri stream, abilita la composizione. Al contrario, quando si passano stream a `stream.pipeline`, in genere il primo stream è uno stream leggibile e l'ultimo è uno stream scrivibile, formando un circuito chiuso.

Se viene passata una `Function`, deve essere un metodo factory che accetta un `Iterable` `source`.

```js [ESM]
import { compose, Transform } from 'node:stream';

const removeSpaces = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, String(chunk).replace(' ', ''));
  },
});

async function* toUpper(source) {
  for await (const chunk of source) {
    yield String(chunk).toUpperCase();
  }
}

let res = '';
for await (const buf of compose(removeSpaces, toUpper).end('hello world')) {
  res += buf;
}

console.log(res); // stampa 'HELLOWORLD'
```
`stream.compose` può essere utilizzato per convertire iterabili asincroni, generatori e funzioni in stream.

- `AsyncIterable` si converte in un `Duplex` leggibile. Non può restituire `null`.
- `AsyncGeneratorFunction` si converte in un `Duplex` transform leggibile/scrivibile. Deve accettare un `AsyncIterable` source come primo parametro. Non può restituire `null`.
- `AsyncFunction` si converte in un `Duplex` scrivibile. Deve restituire `null` o `undefined`.

```js [ESM]
import { compose } from 'node:stream';
import { finished } from 'node:stream/promises';

// Converte AsyncIterable in Duplex leggibile.
const s1 = compose(async function*() {
  yield 'Hello';
  yield 'World';
}());

// Converte AsyncGenerator in Duplex transform.
const s2 = compose(async function*(source) {
  for await (const chunk of source) {
    yield String(chunk).toUpperCase();
  }
});

let res = '';

// Converte AsyncFunction in Duplex scrivibile.
const s3 = compose(async function(source) {
  for await (const chunk of source) {
    res += chunk;
  }
});

await finished(compose(s1, s2, s3));

console.log(res); // stampa 'HELLOWORLD'
```
Vedi [`readable.compose(stream)`](/it/nodejs/api/stream#readablecomposestream-options) per `stream.compose` come operatore.


### `stream.Readable.from(iterable[, options])` {#streamreadablefromiterable-options}

**Aggiunto in: v12.3.0, v10.17.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) Oggetto che implementa il protocollo iterabile `Symbol.asyncIterator` o `Symbol.iterator`. Emette un evento 'error' se viene passato un valore null.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni fornite a `new stream.Readable([options])`. Per impostazione predefinita, `Readable.from()` imposterà `options.objectMode` su `true`, a meno che non si escluda esplicitamente impostando `options.objectMode` su `false`.
- Restituisce: [\<stream.Readable\>](/it/nodejs/api/stream#class-streamreadable)

Un metodo di utilità per creare stream leggibili dagli iteratori.

```js [ESM]
const { Readable } = require('node:stream');

async function * generate() {
  yield 'hello';
  yield 'streams';
}

const readable = Readable.from(generate());

readable.on('data', (chunk) => {
  console.log(chunk);
});
```
Chiamare `Readable.from(string)` o `Readable.from(buffer)` non farà iterare le stringhe o i buffer per corrispondere alla semantica degli altri stream per motivi di prestazioni.

Se un oggetto `Iterable` contenente promise viene passato come argomento, potrebbe comportare un rifiuto non gestito.

```js [ESM]
const { Readable } = require('node:stream');

Readable.from([
  new Promise((resolve) => setTimeout(resolve('1'), 1500)),
  new Promise((_, reject) => setTimeout(reject(new Error('2')), 1000)), // Rifiuto non gestito
]);
```
### `stream.Readable.fromWeb(readableStream[, options])` {#streamreadablefromwebreadablestream-options}

**Aggiunto in: v17.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `readableStream` [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal)
  
 
- Restituisce: [\<stream.Readable\>](/it/nodejs/api/stream#class-streamreadable)


### `stream.Readable.isDisturbed(stream)` {#streamreadableisdisturbedstream}

**Aggiunto in: v16.8.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `stream` [\<stream.Readable\>](/it/nodejs/api/stream#class-streamreadable) | [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream)
- Restituisce: `boolean`

Restituisce se lo stream è stato letto o annullato.

### `stream.isErrored(stream)` {#streamiserroredstream}

**Aggiunto in: v17.3.0, v16.14.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `stream` [\<Readable\>](/it/nodejs/api/stream#class-streamreadable) | [\<Writable\>](/it/nodejs/api/stream#class-streamwritable) | [\<Duplex\>](/it/nodejs/api/stream#class-streamduplex) | [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream) | [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce se lo stream ha riscontrato un errore.

### `stream.isReadable(stream)` {#streamisreadablestream}

**Aggiunto in: v17.4.0, v16.14.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `stream` [\<Readable\>](/it/nodejs/api/stream#class-streamreadable) | [\<Duplex\>](/it/nodejs/api/stream#class-streamduplex) | [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce se lo stream è leggibile.

### `stream.Readable.toWeb(streamReadable[, options])` {#streamreadabletowebstreamreadable-options}

**Aggiunto in: v17.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `streamReadable` [\<stream.Readable\>](/it/nodejs/api/stream#class-streamreadable)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La dimensione massima della coda interna (della `ReadableStream` creata) prima che la contropressione venga applicata durante la lettura dalla `stream.Readable` data. Se non viene fornito alcun valore, verrà preso dalla `stream.Readable` data.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione che determina la dimensione del blocco di dati dato. Se non viene fornito alcun valore, la dimensione sarà `1` per tutti i blocchi.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)





- Restituisce: [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream)


### `stream.Writable.fromWeb(writableStream[, options])` {#streamwritablefromwebwritablestream-options}

**Aggiunto in: v17.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `writableStream` [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal)


- Restituisce: [\<stream.Writable\>](/it/nodejs/api/stream#class-streamwritable)

### `stream.Writable.toWeb(streamWritable)` {#streamwritabletowebstreamwritable}

**Aggiunto in: v17.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `streamWritable` [\<stream.Writable\>](/it/nodejs/api/stream#class-streamwritable)
- Restituisce: [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream)

### `stream.Duplex.from(src)` {#streamduplexfromsrc}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.5.0, v18.17.0 | L'argomento `src` può ora essere un `ReadableStream` o `WritableStream`. |
| v16.8.0 | Aggiunto in: v16.8.0 |
:::

- `src` [\<Stream\>](/it/nodejs/api/stream#stream) | [\<Blob\>](/it/nodejs/api/buffer#class-blob) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<AsyncGeneratorFunction\>](https://tc39.es/proposal-async-iteration/#sec-asyncgeneratorfunction-constructor) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream)

Un metodo di utilità per la creazione di stream duplex.

- `Stream` converte lo stream scrivibile in `Duplex` scrivibile e lo stream leggibile in `Duplex`.
- `Blob` converte in `Duplex` leggibile.
- `string` converte in `Duplex` leggibile.
- `ArrayBuffer` converte in `Duplex` leggibile.
- `AsyncIterable` converte in un `Duplex` leggibile. Non può restituire `null`.
- `AsyncGeneratorFunction` converte in un `Duplex` di trasformazione leggibile/scrivibile. Deve prendere un `AsyncIterable` sorgente come primo parametro. Non può restituire `null`.
- `AsyncFunction` converte in un `Duplex` scrivibile. Deve restituire `null` o `undefined`
- `Object ({ writable, readable })` converte `readable` e `writable` in `Stream` e quindi li combina in `Duplex` dove il `Duplex` scriverà sul `writable` e leggerà dal `readable`.
- `Promise` converte in `Duplex` leggibile. Il valore `null` viene ignorato.
- `ReadableStream` converte in `Duplex` leggibile.
- `WritableStream` converte in `Duplex` scrivibile.
- Restituisce: [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)

Se un oggetto `Iterable` contenente promesse viene passato come argomento, potrebbe comportare un rifiuto non gestito.

```js [ESM]
const { Duplex } = require('node:stream');

Duplex.from([
  new Promise((resolve) => setTimeout(resolve('1'), 1500)),
  new Promise((_, reject) => setTimeout(reject(new Error('2')), 1000)), // Rifiuto non gestito
]);
```

### `stream.Duplex.fromWeb(pair[, options])` {#streamduplexfromwebpair-options}

**Aggiunto in: v17.0.0**

::: warning [Stable: 1 - Sperimentale]
[Stable: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `pair` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream)
    - `writable` [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream)


- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal)


- Restituisce: [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)



::: code-group
```js [ESM]
import { Duplex } from 'node:stream';
import {
  ReadableStream,
  WritableStream,
} from 'node:stream/web';

const readable = new ReadableStream({
  start(controller) {
    controller.enqueue('world');
  },
});

const writable = new WritableStream({
  write(chunk) {
    console.log('writable', chunk);
  },
});

const pair = {
  readable,
  writable,
};
const duplex = Duplex.fromWeb(pair, { encoding: 'utf8', objectMode: true });

duplex.write('hello');

for await (const chunk of duplex) {
  console.log('readable', chunk);
}
```

```js [CJS]
const { Duplex } = require('node:stream');
const {
  ReadableStream,
  WritableStream,
} = require('node:stream/web');

const readable = new ReadableStream({
  start(controller) {
    controller.enqueue('world');
  },
});

const writable = new WritableStream({
  write(chunk) {
    console.log('writable', chunk);
  },
});

const pair = {
  readable,
  writable,
};
const duplex = Duplex.fromWeb(pair, { encoding: 'utf8', objectMode: true });

duplex.write('hello');
duplex.once('readable', () => console.log('readable', duplex.read()));
```
:::


### `stream.Duplex.toWeb(streamDuplex)` {#streamduplextowebstreamduplex}

**Aggiunto in: v17.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `streamDuplex` [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)
- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream)
    - `writable` [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream)
  
 

::: code-group
```js [ESM]
import { Duplex } from 'node:stream';

const duplex = Duplex({
  objectMode: true,
  read() {
    this.push('world');
    this.push(null);
  },
  write(chunk, encoding, callback) {
    console.log('writable', chunk);
    callback();
  },
});

const { readable, writable } = Duplex.toWeb(duplex);
writable.getWriter().write('hello');

const { value } = await readable.getReader().read();
console.log('readable', value);
```

```js [CJS]
const { Duplex } = require('node:stream');

const duplex = Duplex({
  objectMode: true,
  read() {
    this.push('world');
    this.push(null);
  },
  write(chunk, encoding, callback) {
    console.log('writable', chunk);
    callback();
  },
});

const { readable, writable } = Duplex.toWeb(duplex);
writable.getWriter().write('hello');

readable.getReader().read().then((result) => {
  console.log('readable', result.value);
});
```
:::

### `stream.addAbortSignal(signal, stream)` {#streamaddabortsignalsignal-stream}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.7.0, v18.16.0 | Aggiunto il supporto per `ReadableStream` e `WritableStream`. |
| v15.4.0 | Aggiunto in: v15.4.0 |
:::

- `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Un segnale che rappresenta una possibile cancellazione
- `stream` [\<Stream\>](/it/nodejs/api/stream#stream) | [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/it/nodejs/api/webstreams#class-writablestream) Uno stream a cui collegare un segnale.

Allega un AbortSignal a un flusso leggibile o scrivibile. Ciò consente al codice di controllare la distruzione del flusso utilizzando un `AbortController`.

La chiamata a `abort` sull'`AbortController` corrispondente all'`AbortSignal` passato si comporterà allo stesso modo della chiamata a `.destroy(new AbortError())` sullo stream e `controller.error(new AbortError())` per i webstream.

```js [ESM]
const fs = require('node:fs');

const controller = new AbortController();
const read = addAbortSignal(
  controller.signal,
  fs.createReadStream(('object.json')),
);
// Successivamente, interrompi l'operazione chiudendo lo stream
controller.abort();
```
Oppure usa un `AbortSignal` con un flusso leggibile come iterabile asincrono:

```js [ESM]
const controller = new AbortController();
setTimeout(() => controller.abort(), 10_000); // imposta un timeout
const stream = addAbortSignal(
  controller.signal,
  fs.createReadStream(('object.json')),
);
(async () => {
  try {
    for await (const chunk of stream) {
      await process(chunk);
    }
  } catch (e) {
    if (e.name === 'AbortError') {
      // L'operazione è stata annullata
    } else {
      throw e;
    }
  }
})();
```
Oppure usa un `AbortSignal` con un ReadableStream:

```js [ESM]
const controller = new AbortController();
const rs = new ReadableStream({
  start(controller) {
    controller.enqueue('hello');
    controller.enqueue('world');
    controller.close();
  },
});

addAbortSignal(controller.signal, rs);

finished(rs, (err) => {
  if (err) {
    if (err.name === 'AbortError') {
      // L'operazione è stata annullata
    }
  }
});

const reader = rs.getReader();

reader.read().then(({ value, done }) => {
  console.log(value); // hello
  console.log(done); // false
  controller.abort();
});
```

### `stream.getDefaultHighWaterMark(objectMode)` {#streamgetdefaulthighwatermarkobjectmode}

**Aggiunto in: v19.9.0, v18.17.0**

- `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Restituisce l'highWaterMark predefinito utilizzato dagli stream. Il valore predefinito è `65536` (64 KiB) o `16` per `objectMode`.

### `stream.setDefaultHighWaterMark(objectMode, value)` {#streamsetdefaulthighwatermarkobjectmode-value}

**Aggiunto in: v19.9.0, v18.17.0**

- `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) valore highWaterMark

Imposta l'highWaterMark predefinito utilizzato dagli stream.

## API per gli implementatori di stream {#api-for-stream-implementers}

L'API del modulo `node:stream` è stata progettata per rendere possibile l'implementazione semplice degli stream utilizzando il modello di ereditarietà prototipale di JavaScript.

Innanzitutto, uno sviluppatore di stream dichiarerebbe una nuova classe JavaScript che estende una delle quattro classi di stream di base (`stream.Writable`, `stream.Readable`, `stream.Duplex` o `stream.Transform`), assicurandosi di chiamare il costruttore della classe padre appropriato:

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  constructor({ highWaterMark, ...options }) {
    super({ highWaterMark });
    // ...
  }
}
```
Quando si estendono gli stream, tieni presente quali opzioni l'utente può e deve fornire prima di inoltrarle al costruttore di base. Ad esempio, se l'implementazione fa supposizioni in merito alle opzioni `autoDestroy` e `emitClose`, non consentire all'utente di sovrascriverle. Sii esplicito su quali opzioni vengono inoltrate invece di inoltrarle implicitamente tutte.

La nuova classe di stream deve quindi implementare uno o più metodi specifici, a seconda del tipo di stream che viene creato, come dettagliato nella tabella seguente:

| Caso d'uso | Classe | Metodo/i da implementare |
| --- | --- | --- |
| Sola lettura | [`Readable`](/it/nodejs/api/stream#class-streamreadable) | [`_read()`](/it/nodejs/api/stream#readable_readsize) |
| Sola scrittura | [`Writable`](/it/nodejs/api/stream#class-streamwritable) | [`_write()`](/it/nodejs/api/stream#writable_writechunk-encoding-callback)  ,   [`_writev()`](/it/nodejs/api/stream#writable_writevchunks-callback)  ,   [`_final()`](/it/nodejs/api/stream#writable_finalcallback) |
| Lettura e scrittura | [`Duplex`](/it/nodejs/api/stream#class-streamduplex) | [`_read()`](/it/nodejs/api/stream#readable_readsize)  ,   [`_write()`](/it/nodejs/api/stream#writable_writechunk-encoding-callback)  ,   [`_writev()`](/it/nodejs/api/stream#writable_writevchunks-callback)  ,   [`_final()`](/it/nodejs/api/stream#writable_finalcallback) |
| Opera sui dati scritti, quindi legge il risultato | [`Transform`](/it/nodejs/api/stream#class-streamtransform) | [`_transform()`](/it/nodejs/api/stream#transform_transformchunk-encoding-callback)  ,   [`_flush()`](/it/nodejs/api/stream#transform_flushcallback)  ,   [`_final()`](/it/nodejs/api/stream#writable_finalcallback) |
Il codice di implementazione per uno stream non dovrebbe *mai* chiamare i metodi "pubblici" di uno stream destinati all'uso da parte dei consumatori (come descritto nella sezione [API per i consumatori di stream](/it/nodejs/api/stream#api-for-stream-consumers)). In tal caso, potrebbero verificarsi effetti collaterali negativi nel codice dell'applicazione che utilizza lo stream.

Evita di sovrascrivere metodi pubblici come `write()`, `end()`, `cork()`, `uncork()`, `read()` e `destroy()` o di emettere eventi interni come `'error'`, `'data'`, `'end'`, `'finish'` e `'close'` tramite `.emit()`. In tal caso, è possibile interrompere gli invarianti dello stream attuali e futuri, causando problemi di comportamento e/o compatibilità con altri stream, utilità di stream e aspettative dell'utente.


### Costruzione semplificata {#simplified-construction}

**Aggiunto in: v1.2.0**

Per molti casi semplici, è possibile creare uno stream senza fare affidamento sull'ereditarietà. Questo può essere realizzato creando direttamente istanze degli oggetti `stream.Writable`, `stream.Readable`, `stream.Duplex` o `stream.Transform` e passando metodi appropriati come opzioni del costruttore.

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  construct(callback) {
    // Inizializza lo stato e carica le risorse...
  },
  write(chunk, encoding, callback) {
    // ...
  },
  destroy() {
    // Libera le risorse...
  },
});
```
### Implementazione di uno stream scrivibile {#implementing-a-writable-stream}

La classe `stream.Writable` viene estesa per implementare uno stream [`Writable`](/it/nodejs/api/stream#class-streamwritable).

Gli stream `Writable` personalizzati *devono* chiamare il costruttore `new stream.Writable([options])` e implementare il metodo `writable._write()` e/o `writable._writev()`.

#### `new stream.Writable([options])` {#new-streamwritableoptions}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.0.0 | aumenta il valore predefinito di highWaterMark. |
| v15.5.0 | supporta il passaggio di un AbortSignal. |
| v14.0.0 | Modifica l'opzione `autoDestroy` predefinita in `true`. |
| v11.2.0, v10.16.0 | Aggiunta l'opzione `autoDestroy` per `destroy()` automaticamente lo stream quando emette `'finish'` o errori. |
| v10.0.0 | Aggiunta l'opzione `emitClose` per specificare se `'close'` viene emesso durante la distruzione. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Livello del buffer quando [`stream.write()`](/it/nodejs/api/stream#writablewritechunk-encoding-callback) inizia a restituire `false`. **Predefinito:** `65536` (64 KiB), o `16` per stream `objectMode`.
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se codificare le `string` passate a [`stream.write()`](/it/nodejs/api/stream#writablewritechunk-encoding-callback) in `Buffer` (con la codifica specificata nella chiamata [`stream.write()`](/it/nodejs/api/stream#writablewritechunk-encoding-callback)) prima di passarle a [`stream._write()`](/it/nodejs/api/stream#writable_writechunk-encoding-callback). Altri tipi di dati non vengono convertiti (ad esempio, i `Buffer` non vengono decodificati in `string`). Impostare su false impedirà la conversione delle `string`. **Predefinito:** `true`.
    - `defaultEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codifica predefinita che viene utilizzata quando non viene specificata alcuna codifica come argomento per [`stream.write()`](/it/nodejs/api/stream#writablewritechunk-encoding-callback). **Predefinito:** `'utf8'`.
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se [`stream.write(anyObj)`](/it/nodejs/api/stream#writablewritechunk-encoding-callback) è un'operazione valida o meno. Quando impostato, diventa possibile scrivere valori JavaScript diversi da stringa, [\<Buffer\>](/it/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) o [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) se supportato dall'implementazione dello stream. **Predefinito:** `false`.
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se lo stream deve emettere o meno `'close'` dopo essere stato distrutto. **Predefinito:** `true`.
    - `write` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementazione per il metodo [`stream._write()`](/it/nodejs/api/stream#writable_writechunk-encoding-callback).
    - `writev` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementazione per il metodo [`stream._writev()`](/it/nodejs/api/stream#writable_writevchunks-callback).
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementazione per il metodo [`stream._destroy()`](/it/nodejs/api/stream#writable_destroyerr-callback).
    - `final` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementazione per il metodo [`stream._final()`](/it/nodejs/api/stream#writable_finalcallback).
    - `construct` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementazione per il metodo [`stream._construct()`](/it/nodejs/api/stream#writable_constructcallback).
    - `autoDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se questo stream debba chiamare automaticamente `.destroy()` su se stesso dopo la fine. **Predefinito:** `true`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Un segnale che rappresenta una possibile cancellazione.
  
 

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  constructor(options) {
    // Chiama il costruttore stream.Writable().
    super(options);
    // ...
  }
}
```
Oppure, quando si utilizzano costruttori in stile pre-ES6:

```js [ESM]
const { Writable } = require('node:stream');
const util = require('node:util');

function MyWritable(options) {
  if (!(this instanceof MyWritable))
    return new MyWritable(options);
  Writable.call(this, options);
}
util.inherits(MyWritable, Writable);
```
Oppure, utilizzando l'approccio del costruttore semplificato:

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  write(chunk, encoding, callback) {
    // ...
  },
  writev(chunks, callback) {
    // ...
  },
});
```
Chiamare `abort` sull'`AbortController` corrispondente al `AbortSignal` passato si comporterà allo stesso modo della chiamata `.destroy(new AbortError())` sullo stream scrivibile.

```js [ESM]
const { Writable } = require('node:stream');

const controller = new AbortController();
const myWritable = new Writable({
  write(chunk, encoding, callback) {
    // ...
  },
  writev(chunks, callback) {
    // ...
  },
  signal: controller.signal,
});
// Successivamente, interrompi l'operazione chiudendo lo stream
controller.abort();
```

#### `writable._construct(callback)` {#writable_constructcallback}

**Aggiunto in: v15.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chiama questa funzione (opzionalmente con un argomento di errore) quando lo stream ha terminato l'inizializzazione.

Il metodo `_construct()` NON DEVE essere chiamato direttamente. Può essere implementato da classi figlie e, in tal caso, verrà chiamato solo dai metodi interni della classe `Writable`.

Questa funzione opzionale verrà chiamata in un tick dopo che il costruttore dello stream ha restituito, ritardando qualsiasi chiamata a `_write()`, `_final()` e `_destroy()` fino a quando non viene chiamata `callback`. Questo è utile per inizializzare lo stato o inizializzare asincronamente le risorse prima che lo stream possa essere utilizzato.

```js [ESM]
const { Writable } = require('node:stream');
const fs = require('node:fs');

class WriteStream extends Writable {
  constructor(filename) {
    super();
    this.filename = filename;
    this.fd = null;
  }
  _construct(callback) {
    fs.open(this.filename, 'w', (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  _write(chunk, encoding, callback) {
    fs.write(this.fd, chunk, callback);
  }
  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}
```
#### `writable._write(chunk, encoding, callback)` {#writable_writechunk-encoding-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.11.0 | _write() è opzionale quando si fornisce _writev(). |
:::

- `chunk` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Il `Buffer` da scrivere, convertito dalla `string` passata a [`stream.write()`](/it/nodejs/api/stream#writablewritechunk-encoding-callback). Se l'opzione `decodeStrings` dello stream è `false` o lo stream sta operando in modalità oggetto, il chunk non verrà convertito e sarà qualsiasi cosa sia stata passata a [`stream.write()`](/it/nodejs/api/stream#writablewritechunk-encoding-callback).
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se il chunk è una stringa, allora `encoding` è la codifica dei caratteri di quella stringa. Se chunk è un `Buffer`, o se lo stream sta operando in modalità oggetto, `encoding` può essere ignorato.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chiama questa funzione (opzionalmente con un argomento di errore) quando l'elaborazione è completa per il chunk fornito.

Tutte le implementazioni dello stream `Writable` devono fornire un metodo [`writable._write()`](/it/nodejs/api/stream#writable_writechunk-encoding-callback) e/o [`writable._writev()`](/it/nodejs/api/stream#writable_writevchunks-callback) per inviare dati alla risorsa sottostante.

Gli stream [`Transform`](/it/nodejs/api/stream#class-streamtransform) forniscono la propria implementazione di [`writable._write()`](/it/nodejs/api/stream#writable_writechunk-encoding-callback).

Questa funzione NON DEVE essere chiamata direttamente dal codice dell'applicazione. Dovrebbe essere implementata da classi figlie e chiamata solo dai metodi interni della classe `Writable`.

La funzione `callback` deve essere chiamata sincronicamente all'interno di `writable._write()` o asincronicamente (cioè tick diverso) per segnalare se la scrittura è stata completata con successo o non è riuscita con un errore. Il primo argomento passato al `callback` deve essere l'oggetto `Error` se la chiamata non è riuscita o `null` se la scrittura è riuscita.

Tutte le chiamate a `writable.write()` che si verificano tra il momento in cui viene chiamato `writable._write()` e il `callback` viene chiamato faranno sì che i dati scritti vengano memorizzati nel buffer. Quando viene richiamato il `callback`, lo stream potrebbe emettere un evento [`'drain'`](/it/nodejs/api/stream#event-drain). Se un'implementazione dello stream è in grado di elaborare più chunk di dati contemporaneamente, è necessario implementare il metodo `writable._writev()`.

Se la proprietà `decodeStrings` è impostata esplicitamente su `false` nelle opzioni del costruttore, allora `chunk` rimarrà lo stesso oggetto passato a `.write()` e potrebbe essere una stringa anziché un `Buffer`. Questo per supportare le implementazioni che hanno una gestione ottimizzata per determinate codifiche di dati stringa. In tal caso, l'argomento `encoding` indicherà la codifica dei caratteri della stringa. Altrimenti, l'argomento `encoding` può essere tranquillamente ignorato.

Il metodo `writable._write()` è preceduto da un trattino basso perché è interno alla classe che lo definisce e non dovrebbe mai essere chiamato direttamente dai programmi utente.


#### `writable._writev(chunks, callback)` {#writable_writevchunks-callback}

- `chunks` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) I dati da scrivere. Il valore è un array di [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) che rappresentano ciascuno un blocco discreto di dati da scrivere. Le proprietà di questi oggetti sono:
    - `chunk` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un'istanza buffer o una stringa contenente i dati da scrivere. Il `chunk` sarà una stringa se il `Writable` è stato creato con l'opzione `decodeStrings` impostata su `false` ed è stata passata una stringa a `write()`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codifica dei caratteri del `chunk`. Se `chunk` è un `Buffer`, la `encoding` sarà `'buffer'`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione di callback (opzionalmente con un argomento di errore) da invocare quando l'elaborazione è completa per i chunk forniti.

Questa funzione NON DEVE essere chiamata direttamente dal codice dell'applicazione. Dovrebbe essere implementata dalle classi figlie e chiamata solo dai metodi interni della classe `Writable`.

Il metodo `writable._writev()` può essere implementato in aggiunta o in alternativa a `writable._write()` nelle implementazioni di stream in grado di elaborare più chunk di dati contemporaneamente. Se implementato e se ci sono dati memorizzati nel buffer da scritture precedenti, verrà chiamato `_writev()` invece di `_write()`.

Il metodo `writable._writev()` è preceduto da un trattino basso perché è interno alla classe che lo definisce e non dovrebbe mai essere chiamato direttamente dai programmi utente.

#### `writable._destroy(err, callback)` {#writable_destroyerr-callback}

**Aggiunto in: v8.0.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Un possibile errore.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione di callback che accetta un argomento di errore opzionale.

Il metodo `_destroy()` viene chiamato da [`writable.destroy()`](/it/nodejs/api/stream#writabledestroyerror). Può essere sovrascritto dalle classi figlie ma **non deve** essere chiamato direttamente.


#### `writable._final(callback)` {#writable_finalcallback}

**Aggiunto in: v8.0.0**

- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chiama questa funzione (opzionalmente con un argomento di errore) quando hai finito di scrivere tutti i dati rimanenti.

Il metodo `_final()` **non deve** essere chiamato direttamente. Può essere implementato dalle classi figlie e, in tal caso, verrà chiamato solo dai metodi interni della classe `Writable`.

Questa funzione opzionale verrà chiamata prima che lo stream si chiuda, ritardando l'evento `'finish'` fino a quando non viene chiamata `callback`. Questo è utile per chiudere le risorse o scrivere dati memorizzati nel buffer prima che uno stream termini.

#### Errori durante la scrittura {#errors-while-writing}

Gli errori che si verificano durante l'elaborazione dei metodi [`writable._write()`](/it/nodejs/api/stream#writable_writechunk-encoding-callback), [`writable._writev()`](/it/nodejs/api/stream#writable_writevchunks-callback) e [`writable._final()`](/it/nodejs/api/stream#writable_finalcallback) devono essere propagati invocando la callback e passando l'errore come primo argomento. Lanciare un `Error` dall'interno di questi metodi o emettere manualmente un evento `'error'` provoca un comportamento indefinito.

Se uno stream `Readable` esegue il pipe in uno stream `Writable` quando `Writable` emette un errore, lo stream `Readable` verrà scollegato.

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) {
      callback(new Error('chunk is invalid'));
    } else {
      callback();
    }
  },
});
```
#### Un esempio di stream scrivibile {#an-example-writable-stream}

Quanto segue illustra un'implementazione di stream `Writable` personalizzata piuttosto semplicistica (e un po' inutile). Sebbene questa specifica istanza di stream `Writable` non sia di alcuna particolare utilità reale, l'esempio illustra ciascuno degli elementi richiesti di un'istanza di stream [`Writable`](/it/nodejs/api/stream#class-streamwritable) personalizzata:

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  _write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) {
      callback(new Error('chunk is invalid'));
    } else {
      callback();
    }
  }
}
```

#### Decodifica dei buffer in un flusso scrivibile {#decoding-buffers-in-a-writable-stream}

La decodifica dei buffer è un'operazione comune, ad esempio, quando si utilizzano trasformatori la cui input è una stringa. Questo non è un processo banale quando si utilizzano codifiche di caratteri multi-byte, come UTF-8. L'esempio seguente mostra come decodificare stringhe multi-byte utilizzando `StringDecoder` e [`Writable`](/it/nodejs/api/stream#class-streamwritable).

```js [ESM]
const { Writable } = require('node:stream');
const { StringDecoder } = require('node:string_decoder');

class StringWritable extends Writable {
  constructor(options) {
    super(options);
    this._decoder = new StringDecoder(options?.defaultEncoding);
    this.data = '';
  }
  _write(chunk, encoding, callback) {
    if (encoding === 'buffer') {
      chunk = this._decoder.write(chunk);
    }
    this.data += chunk;
    callback();
  }
  _final(callback) {
    this.data += this._decoder.end();
    callback();
  }
}

const euro = [[0xE2, 0x82], [0xAC]].map(Buffer.from);
const w = new StringWritable();

w.write('currency: ');
w.write(euro[0]);
w.end(euro[1]);

console.log(w.data); // currency: €
```
### Implementazione di un flusso leggibile {#implementing-a-readable-stream}

La classe `stream.Readable` viene estesa per implementare un flusso [`Readable`](/it/nodejs/api/stream#class-streamreadable).

I flussi `Readable` personalizzati *devono* chiamare il costruttore `new stream.Readable([options])` e implementare il metodo [`readable._read()`](/it/nodejs/api/stream#readable_readsize).

#### `new stream.Readable([options])` {#new-streamreadableoptions}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.0.0 | aumenta highWaterMark predefinito. |
| v15.5.0 | supporta il passaggio di un AbortSignal. |
| v14.0.0 | Cambia l'opzione `autoDestroy` predefinita in `true`. |
| v11.2.0, v10.16.0 | Aggiunge l'opzione `autoDestroy` per `destroy()` automaticamente il flusso quando emette `'end'` o errori. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il massimo [numero di byte](/it/nodejs/api/stream#highwatermark-discrepancy-after-calling-readablesetencoding) da memorizzare nel buffer interno prima di cessare la lettura dalla risorsa sottostante. **Predefinito:** `65536` (64 KiB), o `16` per i flussi `objectMode`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se specificato, i buffer verranno decodificati in stringhe utilizzando la codifica specificata. **Predefinito:** `null`.
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se questo flusso deve comportarsi come un flusso di oggetti. Ciò significa che [`stream.read(n)`](/it/nodejs/api/stream#readablereadsize) restituisce un singolo valore invece di un `Buffer` di dimensione `n`. **Predefinito:** `false`.
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se il flusso deve emettere `'close'` dopo essere stato distrutto. **Predefinito:** `true`.
    - `read` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementazione per il metodo [`stream._read()`](/it/nodejs/api/stream#readable_readsize).
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementazione per il metodo [`stream._destroy()`](/it/nodejs/api/stream#readable_destroyerr-callback).
    - `construct` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementazione per il metodo [`stream._construct()`](/it/nodejs/api/stream#readable_constructcallback).
    - `autoDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se questo flusso deve chiamare automaticamente `.destroy()` su se stesso dopo la fine. **Predefinito:** `true`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Un segnale che rappresenta una possibile cancellazione.
  
 

```js [ESM]
const { Readable } = require('node:stream');

class MyReadable extends Readable {
  constructor(options) {
    // Chiama il costruttore stream.Readable(options).
    super(options);
    // ...
  }
}
```
Oppure, quando si utilizzano costruttori in stile pre-ES6:

```js [ESM]
const { Readable } = require('node:stream');
const util = require('node:util');

function MyReadable(options) {
  if (!(this instanceof MyReadable))
    return new MyReadable(options);
  Readable.call(this, options);
}
util.inherits(MyReadable, Readable);
```
Oppure, utilizzando l'approccio del costruttore semplificato:

```js [ESM]
const { Readable } = require('node:stream');

const myReadable = new Readable({
  read(size) {
    // ...
  },
});
```
Chiamare `abort` sull'`AbortController` corrispondente all'`AbortSignal` passato si comporterà allo stesso modo della chiamata di `.destroy(new AbortError())` sul flusso leggibile creato.

```js [ESM]
const { Readable } = require('node:stream');
const controller = new AbortController();
const read = new Readable({
  read(size) {
    // ...
  },
  signal: controller.signal,
});
// Successivamente, interrompere l'operazione chiudendo il flusso
controller.abort();
```

#### `readable._construct(callback)` {#readable_constructcallback}

**Aggiunto in: v15.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chiama questa funzione (opzionalmente con un argomento di errore) quando lo stream ha terminato l'inizializzazione.

Il metodo `_construct()` NON DEVE essere chiamato direttamente. Può essere implementato dalle classi figlio e, in tal caso, verrà chiamato solo dai metodi interni della classe `Readable`.

Questa funzione opzionale verrà pianificata nel prossimo tick dal costruttore dello stream, ritardando qualsiasi chiamata a `_read()` e `_destroy()` fino a quando non viene chiamata `callback`. Ciò è utile per inizializzare lo stato o inizializzare asincronamente le risorse prima che lo stream possa essere utilizzato.

```js [ESM]
const { Readable } = require('node:stream');
const fs = require('node:fs');

class ReadStream extends Readable {
  constructor(filename) {
    super();
    this.filename = filename;
    this.fd = null;
  }
  _construct(callback) {
    fs.open(this.filename, (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  _read(n) {
    const buf = Buffer.alloc(n);
    fs.read(this.fd, buf, 0, n, null, (err, bytesRead) => {
      if (err) {
        this.destroy(err);
      } else {
        this.push(bytesRead > 0 ? buf.slice(0, bytesRead) : null);
      }
    });
  }
  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}
```
#### `readable._read(size)` {#readable_readsize}

**Aggiunto in: v0.9.4**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di byte da leggere in modo asincrono

Questa funzione NON DEVE essere chiamata direttamente dal codice dell'applicazione. Dovrebbe essere implementata dalle classi figlio e chiamata solo dai metodi interni della classe `Readable`.

Tutte le implementazioni di stream `Readable` devono fornire un'implementazione del metodo [`readable._read()`](/it/nodejs/api/stream#readable_readsize) per recuperare i dati dalla risorsa sottostante.

Quando viene chiamato [`readable._read()`](/it/nodejs/api/stream#readable_readsize), se i dati sono disponibili dalla risorsa, l'implementazione deve iniziare a inserire tali dati nella coda di lettura utilizzando il metodo [`this.push(dataChunk)`](/it/nodejs/api/stream#readablepushchunk-encoding). `_read()` verrà chiamato di nuovo dopo ogni chiamata a [`this.push(dataChunk)`](/it/nodejs/api/stream#readablepushchunk-encoding) una volta che lo stream è pronto per accettare più dati. `_read()` può continuare a leggere dalla risorsa e a inserire dati fino a quando `readable.push()` non restituisce `false`. Solo quando `_read()` viene chiamato di nuovo dopo che si è fermato, dovrebbe riprendere a inserire dati aggiuntivi nella coda.

Una volta che il metodo [`readable._read()`](/it/nodejs/api/stream#readable_readsize) è stato chiamato, non verrà chiamato di nuovo fino a quando non verranno inseriti altri dati tramite il metodo [`readable.push()`](/it/nodejs/api/stream#readablepushchunk-encoding). Dati vuoti come buffer e stringhe vuote non causeranno la chiamata di [`readable._read()`](/it/nodejs/api/stream#readable_readsize).

L'argomento `size` è indicativo. Per le implementazioni in cui una "lettura" è una singola operazione che restituisce dati, è possibile utilizzare l'argomento `size` per determinare la quantità di dati da recuperare. Altre implementazioni possono ignorare questo argomento e semplicemente fornire i dati quando diventano disponibili. Non è necessario "attendere" che siano disponibili `size` byte prima di chiamare [`stream.push(chunk)`](/it/nodejs/api/stream#readablepushchunk-encoding).

Il metodo [`readable._read()`](/it/nodejs/api/stream#readable_readsize) è preceduto da un trattino basso perché è interno alla classe che lo definisce e non dovrebbe mai essere chiamato direttamente dai programmi utente.


#### `readable._destroy(err, callback)` {#readable_destroyerr-callback}

**Aggiunto in: v8.0.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Un possibile errore.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione di callback che accetta un argomento di errore opzionale.

Il metodo `_destroy()` viene chiamato da [`readable.destroy()`](/it/nodejs/api/stream#readabledestroyerror). Può essere sovrascritto dalle classi figlio ma **non deve** essere chiamato direttamente.

#### `readable.push(chunk[, encoding])` {#readablepushchunk-encoding}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.0.0, v20.13.0 | L'argomento `chunk` ora può essere un'istanza di `TypedArray` o `DataView`. |
| v8.0.0 | L'argomento `chunk` ora può essere un'istanza di `Uint8Array`. |
:::

- `chunk` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Blocco di dati da inserire nella coda di lettura. Per gli stream che non operano in modalità oggetto, `chunk` deve essere un [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/it/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) o [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView). Per gli stream in modalità oggetto, `chunk` può essere qualsiasi valore JavaScript.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Codifica dei blocchi di stringa. Deve essere una codifica `Buffer` valida, come `'utf8'` o `'ascii'`.
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se è possibile continuare a inserire blocchi di dati aggiuntivi; `false` altrimenti.

Quando `chunk` è un [\<Buffer\>](/it/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) o [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), il `chunk` di dati verrà aggiunto alla coda interna affinché gli utenti dello stream lo consumino. Passare `chunk` come `null` segnala la fine dello stream (EOF), dopo di che non è possibile scrivere altri dati.

Quando `Readable` opera in modalità in pausa, i dati aggiunti con `readable.push()` possono essere letti chiamando il metodo [`readable.read()`](/it/nodejs/api/stream#readablereadsize) quando viene emesso l'evento [`'readable'`](/it/nodejs/api/stream#event-readable).

Quando `Readable` opera in modalità flowing, i dati aggiunti con `readable.push()` verranno forniti emettendo un evento `'data'`.

Il metodo `readable.push()` è progettato per essere il più flessibile possibile. Ad esempio, quando si incapsula una sorgente di livello inferiore che fornisce una qualche forma di meccanismo di pausa/ripresa e un callback di dati, la sorgente di basso livello può essere incapsulata dall'istanza `Readable` personalizzata:

```js [ESM]
// `_source` è un oggetto con i metodi readStop() e readStart() e
// un membro `ondata` che viene chiamato quando ha dati e
// un membro `onend` che viene chiamato quando i dati sono terminati.

class SourceWrapper extends Readable {
  constructor(options) {
    super(options);

    this._source = getLowLevelSourceObject();

    // Ogni volta che ci sono dati, inseriscili nel buffer interno.
    this._source.ondata = (chunk) => {
      // Se push() restituisce false, interrompi la lettura dalla sorgente.
      if (!this.push(chunk))
        this._source.readStop();
    };

    // Quando la sorgente termina, inserisci il blocco `null` che segnala EOF.
    this._source.onend = () => {
      this.push(null);
    };
  }
  // _read() verrà chiamato quando lo stream vuole estrarre più dati.
  // L'argomento advisory size viene ignorato in questo caso.
  _read(size) {
    this._source.readStart();
  }
}
```
Il metodo `readable.push()` viene utilizzato per inserire il contenuto nel buffer interno. Può essere guidato dal metodo [`readable._read()`](/it/nodejs/api/stream#readable_readsize).

Per gli stream che non operano in modalità oggetto, se il parametro `chunk` di `readable.push()` è `undefined`, verrà trattato come stringa o buffer vuoti. Vedi [`readable.push('')`](/it/nodejs/api/stream#readablepush) per maggiori informazioni.


#### Error durante la lettura {#errors-while-reading}

Gli errori che si verificano durante l'elaborazione di [`readable._read()`](/it/nodejs/api/stream#readable_readsize) devono essere propagati attraverso il metodo [`readable.destroy(err)`](/it/nodejs/api/stream#readable_destroyerr-callback). Lanciare un `Error` dall'interno di [`readable._read()`](/it/nodejs/api/stream#readable_readsize) o emettere manualmente un evento `'error'` comporta un comportamento non definito.

```js [ESM]
const { Readable } = require('node:stream');

const myReadable = new Readable({
  read(size) {
    const err = checkSomeErrorCondition();
    if (err) {
      this.destroy(err);
    } else {
      // Do some work.
    }
  },
});
```
#### Un esempio di stream di conteggio {#an-example-counting-stream}

Quello che segue è un esempio base di uno stream `Readable` che emette i numeri da 1 a 1.000.000 in ordine crescente e poi termina.

```js [ESM]
const { Readable } = require('node:stream');

class Counter extends Readable {
  constructor(opt) {
    super(opt);
    this._max = 1000000;
    this._index = 1;
  }

  _read() {
    const i = this._index++;
    if (i > this._max)
      this.push(null);
    else {
      const str = String(i);
      const buf = Buffer.from(str, 'ascii');
      this.push(buf);
    }
  }
}
```
### Implementazione di uno stream duplex {#implementing-a-duplex-stream}

Uno stream [`Duplex`](/it/nodejs/api/stream#class-streamduplex) è uno che implementa sia [`Readable`](/it/nodejs/api/stream#class-streamreadable) che [`Writable`](/it/nodejs/api/stream#class-streamwritable), come una connessione socket TCP.

Poiché JavaScript non supporta l'ereditarietà multipla, la classe `stream.Duplex` viene estesa per implementare uno stream [`Duplex`](/it/nodejs/api/stream#class-streamduplex) (invece di estendere le classi `stream.Readable` *e* `stream.Writable`).

La classe `stream.Duplex` eredita prototipicamente da `stream.Readable` e parassiticamente da `stream.Writable`, ma `instanceof` funzionerà correttamente per entrambe le classi base a causa della sovrascrittura di [`Symbol.hasInstance`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance) su `stream.Writable`.

Gli stream `Duplex` personalizzati *devono* chiamare il costruttore `new stream.Duplex([options])` e implementare *sia* i metodi [`readable._read()`](/it/nodejs/api/stream#readable_readsize) che `writable._write()`.


#### `new stream.Duplex(options)` {#new-streamduplexoptions}

::: info [Cronologia]
| Versione | Modifiche |
|---|---|
| v8.4.0 | Le opzioni `readableHighWaterMark` e `writableHighWaterMark` sono ora supportate. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Passato sia ai costruttori `Writable` che `Readable`. Ha anche i seguenti campi:
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su `false`, lo stream terminerà automaticamente il lato scrivibile quando il lato leggibile termina. **Predefinito:** `true`.
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Imposta se il `Duplex` debba essere leggibile. **Predefinito:** `true`.
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Imposta se il `Duplex` debba essere scrivibile. **Predefinito:** `true`.
    - `readableObjectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Imposta `objectMode` per il lato leggibile dello stream. Non ha effetto se `objectMode` è `true`. **Predefinito:** `false`.
    - `writableObjectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Imposta `objectMode` per il lato scrivibile dello stream. Non ha effetto se `objectMode` è `true`. **Predefinito:** `false`.
    - `readableHighWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta `highWaterMark` per il lato leggibile dello stream. Non ha effetto se `highWaterMark` è fornito.
    - `writableHighWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta `highWaterMark` per il lato scrivibile dello stream. Non ha effetto se `highWaterMark` è fornito.
  
 

```js [ESM]
const { Duplex } = require('node:stream');

class MyDuplex extends Duplex {
  constructor(options) {
    super(options);
    // ...
  }
}
```
Oppure, quando si utilizzano costruttori in stile pre-ES6:

```js [ESM]
const { Duplex } = require('node:stream');
const util = require('node:util');

function MyDuplex(options) {
  if (!(this instanceof MyDuplex))
    return new MyDuplex(options);
  Duplex.call(this, options);
}
util.inherits(MyDuplex, Duplex);
```
Oppure, utilizzando l'approccio del costruttore semplificato:

```js [ESM]
const { Duplex } = require('node:stream');

const myDuplex = new Duplex({
  read(size) {
    // ...
  },
  write(chunk, encoding, callback) {
    // ...
  },
});
```
Quando si utilizza pipeline:

```js [ESM]
const { Transform, pipeline } = require('node:stream');
const fs = require('node:fs');

pipeline(
  fs.createReadStream('object.json')
    .setEncoding('utf8'),
  new Transform({
    decodeStrings: false, // Accept string input rather than Buffers
    construct(callback) {
      this.data = '';
      callback();
    },
    transform(chunk, encoding, callback) {
      this.data += chunk;
      callback();
    },
    flush(callback) {
      try {
        // Make sure is valid json.
        JSON.parse(this.data);
        this.push(this.data);
        callback();
      } catch (err) {
        callback(err);
      }
    },
  }),
  fs.createWriteStream('valid-object.json'),
  (err) => {
    if (err) {
      console.error('failed', err);
    } else {
      console.log('completed');
    }
  },
);
```

#### Un esempio di stream duplex {#an-example-duplex-stream}

Il seguente illustra un semplice esempio di stream `Duplex` che avvolge un ipotetico oggetto sorgente di livello inferiore in cui i dati possono essere scritti e da cui i dati possono essere letti, anche se utilizzando un'API non compatibile con gli stream di Node.js. Il seguente illustra un semplice esempio di stream `Duplex` che memorizza nel buffer i dati scritti in entrata tramite l'interfaccia [`Writable`](/it/nodejs/api/stream#class-streamwritable) che viene riletta tramite l'interfaccia [`Readable`](/it/nodejs/api/stream#class-streamreadable).

```js [ESM]
const { Duplex } = require('node:stream');
const kSource = Symbol('source');

class MyDuplex extends Duplex {
  constructor(source, options) {
    super(options);
    this[kSource] = source;
  }

  _write(chunk, encoding, callback) {
    // La sorgente sottostante gestisce solo stringhe.
    if (Buffer.isBuffer(chunk))
      chunk = chunk.toString();
    this[kSource].writeSomeData(chunk);
    callback();
  }

  _read(size) {
    this[kSource].fetchSomeData(size, (data, encoding) => {
      this.push(Buffer.from(data, encoding));
    });
  }
}
```
L'aspetto più importante di uno stream `Duplex` è che i lati `Readable` e `Writable` operano indipendentemente l'uno dall'altro nonostante coesistano all'interno di una singola istanza di oggetto.

#### Stream duplex in modalità oggetto {#object-mode-duplex-streams}

Per gli stream `Duplex`, `objectMode` può essere impostato esclusivamente per il lato `Readable` o `Writable` utilizzando rispettivamente le opzioni `readableObjectMode` e `writableObjectMode`.

Nell'esempio seguente, ad esempio, viene creato un nuovo stream `Transform` (che è un tipo di stream [`Duplex`](/it/nodejs/api/stream#class-streamduplex)) che ha un lato `Writable` in modalità oggetto che accetta numeri JavaScript che vengono convertiti in stringhe esadecimali sul lato `Readable`.

```js [ESM]
const { Transform } = require('node:stream');

// Tutti gli stream Transform sono anche Stream Duplex.
const myTransform = new Transform({
  writableObjectMode: true,

  transform(chunk, encoding, callback) {
    // Coerce the chunk to a number if necessary.
    chunk |= 0;

    // Transform the chunk into something else.
    const data = chunk.toString(16);

    // Push the data onto the readable queue.
    callback(null, '0'.repeat(data.length % 2) + data);
  },
});

myTransform.setEncoding('ascii');
myTransform.on('data', (chunk) => console.log(chunk));

myTransform.write(1);
// Prints: 01
myTransform.write(10);
// Prints: 0a
myTransform.write(100);
// Prints: 64
```

### Implementazione di uno stream di trasformazione {#implementing-a-transform-stream}

Uno stream [`Transform`](/it/nodejs/api/stream#class-streamtransform) è uno stream [`Duplex`](/it/nodejs/api/stream#class-streamduplex) in cui l'output viene calcolato in qualche modo dall'input. Esempi includono gli stream [zlib](/it/nodejs/api/zlib) o gli stream [crypto](/it/nodejs/api/crypto) che comprimono, crittografano o decrittografano i dati.

Non è necessario che l'output abbia le stesse dimensioni dell'input, lo stesso numero di chunk o arrivi nello stesso momento. Ad esempio, uno stream `Hash` avrà sempre e solo un singolo chunk di output che viene fornito quando l'input è terminato. Uno stream `zlib` produrrà un output che è molto più piccolo o molto più grande del suo input.

La classe `stream.Transform` viene estesa per implementare uno stream [`Transform`](/it/nodejs/api/stream#class-streamtransform).

La classe `stream.Transform` eredita prototipicamente da `stream.Duplex` e implementa le proprie versioni dei metodi `writable._write()` e [`readable._read()`](/it/nodejs/api/stream#readable_readsize). Le implementazioni `Transform` personalizzate *devono* implementare il metodo [`transform._transform()`](/it/nodejs/api/stream#transform_transformchunk-encoding-callback) e *possono* anche implementare il metodo [`transform._flush()`](/it/nodejs/api/stream#transform_flushcallback).

È necessario prestare attenzione quando si utilizzano stream `Transform` poiché i dati scritti nello stream possono causare la pausa del lato `Writable` dello stream se l'output sul lato `Readable` non viene consumato.

#### `new stream.Transform([options])` {#new-streamtransformoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Passato sia ai costruttori `Writable` che `Readable`. Ha anche i seguenti campi:
    - `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementazione per il metodo [`stream._transform()`](/it/nodejs/api/stream#transform_transformchunk-encoding-callback).
    - `flush` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementazione per il metodo [`stream._flush()`](/it/nodejs/api/stream#transform_flushcallback).

```js [ESM]
const { Transform } = require('node:stream');

class MyTransform extends Transform {
  constructor(options) {
    super(options);
    // ...
  }
}
```
Oppure, quando si utilizzano costruttori in stile pre-ES6:

```js [ESM]
const { Transform } = require('node:stream');
const util = require('node:util');

function MyTransform(options) {
  if (!(this instanceof MyTransform))
    return new MyTransform(options);
  Transform.call(this, options);
}
util.inherits(MyTransform, Transform);
```
Oppure, utilizzando l'approccio semplificato del costruttore:

```js [ESM]
const { Transform } = require('node:stream');

const myTransform = new Transform({
  transform(chunk, encoding, callback) {
    // ...
  },
});
```

#### Evento: `'end'` {#event-end_1}

L'evento [`'end'`](/it/nodejs/api/stream#event-end) proviene dalla classe `stream.Readable`. L'evento `'end'` viene emesso dopo che tutti i dati sono stati emessi, il che si verifica dopo che è stata chiamata la callback in [`transform._flush()`](/it/nodejs/api/stream#transform_flushcallback). In caso di errore, `'end'` non deve essere emesso.

#### Evento: `'finish'` {#event-finish_1}

L'evento [`'finish'`](/it/nodejs/api/stream#event-finish) proviene dalla classe `stream.Writable`. L'evento `'finish'` viene emesso dopo che [`stream.end()`](/it/nodejs/api/stream#writableendchunk-encoding-callback) è stato chiamato e tutti i chunk sono stati elaborati da [`stream._transform()`](/it/nodejs/api/stream#transform_transformchunk-encoding-callback). In caso di errore, `'finish'` non deve essere emesso.

#### `transform._flush(callback)` {#transform_flushcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione di callback (opzionalmente con un argomento di errore e dati) da chiamare quando i dati rimanenti sono stati scaricati.

Questa funzione NON DEVE essere chiamata direttamente dal codice dell'applicazione. Dovrebbe essere implementata dalle classi figlie e chiamata solo dai metodi interni della classe `Readable`.

In alcuni casi, un'operazione di trasformazione potrebbe aver bisogno di emettere un bit aggiuntivo di dati alla fine dello stream. Ad esempio, uno stream di compressione `zlib` memorizzerà una quantità di stato interno utilizzato per comprimere in modo ottimale l'output. Quando lo stream termina, tuttavia, quei dati aggiuntivi devono essere scaricati in modo che i dati compressi siano completi.

Le implementazioni personalizzate di [`Transform`](/it/nodejs/api/stream#class-streamtransform) *possono* implementare il metodo `transform._flush()`. Questo verrà chiamato quando non ci sono più dati scritti da consumare, ma prima che l'evento [`'end'`](/it/nodejs/api/stream#event-end) venga emesso segnalando la fine dello stream [`Readable`](/it/nodejs/api/stream#class-streamreadable).

All'interno dell'implementazione di `transform._flush()`, il metodo `transform.push()` può essere chiamato zero o più volte, a seconda dei casi. La funzione `callback` deve essere chiamata al termine dell'operazione di flush.

Il metodo `transform._flush()` è preceduto da un trattino basso perché è interno alla classe che lo definisce e non dovrebbe mai essere chiamato direttamente dai programmi utente.


#### `transform._transform(chunk, encoding, callback)` {#transform_transformchunk-encoding-callback}

- `chunk` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Il `Buffer` da trasformare, convertito dalla `string` passata a [`stream.write()`](/it/nodejs/api/stream#writablewritechunk-encoding-callback). Se l'opzione `decodeStrings` dello stream è `false` o lo stream opera in modalità oggetto, il chunk non sarà convertito e sarà qualsiasi cosa sia stata passata a [`stream.write()`](/it/nodejs/api/stream#writablewritechunk-encoding-callback).
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se il chunk è una stringa, allora questo è il tipo di codifica. Se il chunk è un buffer, allora questo è il valore speciale `'buffer'`. Ignoralo in quel caso.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione di callback (opzionalmente con un argomento di errore e dati) da chiamare dopo che il `chunk` fornito è stato elaborato.

Questa funzione NON DEVE essere chiamata direttamente dal codice dell'applicazione. Dovrebbe essere implementata dalle classi figlio e chiamata solo dai metodi interni della classe `Readable`.

Tutte le implementazioni dello stream `Transform` devono fornire un metodo `_transform()` per accettare input e produrre output. L'implementazione `transform._transform()` gestisce i byte che vengono scritti, calcola un output, quindi passa quell'output alla parte leggibile usando il metodo `transform.push()`.

Il metodo `transform.push()` può essere chiamato zero o più volte per generare output da un singolo chunk di input, a seconda di quanto deve essere emesso come risultato del chunk.

È possibile che non venga generato alcun output da un dato chunk di dati di input.

La funzione `callback` deve essere chiamata solo quando il chunk corrente è completamente consumato. Il primo argomento passato alla `callback` deve essere un oggetto `Error` se si è verificato un errore durante l'elaborazione dell'input o `null` altrimenti. Se un secondo argomento viene passato alla `callback`, verrà inoltrato al metodo `transform.push()`, ma solo se il primo argomento è falsy. In altre parole, i seguenti sono equivalenti:

```js [ESM]
transform.prototype._transform = function(data, encoding, callback) {
  this.push(data);
  callback();
};

transform.prototype._transform = function(data, encoding, callback) {
  callback(null, data);
};
```
Il metodo `transform._transform()` è preceduto da un trattino basso perché è interno alla classe che lo definisce e non dovrebbe mai essere chiamato direttamente dai programmi utente.

`transform._transform()` non viene mai chiamato in parallelo; gli stream implementano un meccanismo di coda e, per ricevere il chunk successivo, è necessario chiamare `callback`, sia sincrona che asincrona.


#### Classe: `stream.PassThrough` {#class-streampassthrough}

La classe `stream.PassThrough` è un'implementazione banale di uno stream [`Transform`](/it/nodejs/api/stream#class-streamtransform) che passa semplicemente i byte di input all'output. Il suo scopo è principalmente per esempi e test, ma ci sono alcuni casi d'uso in cui `stream.PassThrough` è utile come elemento costitutivo per nuovi tipi di stream.

## Note aggiuntive {#additional-notes}

### Compatibilità degli stream con generatori asincroni e iteratori asincroni {#streams-compatibility-with-async-generators-and-async-iterators}

Con il supporto dei generatori e iteratori asincroni in JavaScript, i generatori asincroni sono effettivamente una costruzione di stream di prima classe a livello di linguaggio a questo punto.

Di seguito sono forniti alcuni casi comuni di interoperabilità dell'utilizzo di stream Node.js con generatori asincroni e iteratori asincroni.

#### Consumare stream leggibili con iteratori asincroni {#consuming-readable-streams-with-async-iterators}

```js [ESM]
(async function() {
  for await (const chunk of readable) {
    console.log(chunk);
  }
})();
```
Gli iteratori asincroni registrano un gestore di errori permanente sullo stream per prevenire eventuali errori post-distruzione non gestiti.

#### Creazione di stream leggibili con generatori asincroni {#creating-readable-streams-with-async-generators}

Uno stream leggibile di Node.js può essere creato da un generatore asincrono utilizzando il metodo di utilità `Readable.from()`:

```js [ESM]
const { Readable } = require('node:stream');

const ac = new AbortController();
const signal = ac.signal;

async function * generate() {
  yield 'a';
  await someLongRunningFn({ signal });
  yield 'b';
  yield 'c';
}

const readable = Readable.from(generate());
readable.on('close', () => {
  ac.abort();
});

readable.on('data', (chunk) => {
  console.log(chunk);
});
```
#### Piping verso stream scrivibili da iteratori asincroni {#piping-to-writable-streams-from-async-iterators}

Quando si scrive su uno stream scrivibile da un iteratore asincrono, assicurarsi della corretta gestione della contropressione e degli errori. [`stream.pipeline()`](/it/nodejs/api/stream#streampipelinesource-transforms-destination-callback) astrae la gestione della contropressione e degli errori correlati alla contropressione:

```js [ESM]
const fs = require('node:fs');
const { pipeline } = require('node:stream');
const { pipeline: pipelinePromise } = require('node:stream/promises');

const writable = fs.createWriteStream('./file');

const ac = new AbortController();
const signal = ac.signal;

const iterator = createIterator({ signal });

// Callback Pattern
pipeline(iterator, writable, (err, value) => {
  if (err) {
    console.error(err);
  } else {
    console.log(value, 'value returned');
  }
}).on('close', () => {
  ac.abort();
});

// Promise Pattern
pipelinePromise(iterator, writable)
  .then((value) => {
    console.log(value, 'value returned');
  })
  .catch((err) => {
    console.error(err);
    ac.abort();
  });
```

### Compatibilità con versioni precedenti di Node.js {#compatibility-with-older-nodejs-versions}

Prima di Node.js 0.10, l'interfaccia dello stream `Readable` era più semplice, ma anche meno potente e meno utile.

- Invece di aspettare le chiamate al metodo [`stream.read()`](/it/nodejs/api/stream#readablereadsize), gli eventi [`'data'`](/it/nodejs/api/stream#event-data) iniziavano a essere emessi immediatamente. Le applicazioni che avrebbero dovuto eseguire una certa quantità di lavoro per decidere come gestire i dati erano tenute a memorizzare i dati letti in buffer in modo che i dati non andassero persi.
- Il metodo [`stream.pause()`](/it/nodejs/api/stream#readablepause) era consultivo, piuttosto che garantito. Ciò significava che era comunque necessario essere preparati a ricevere eventi [`'data'`](/it/nodejs/api/stream#event-data) *anche quando lo stream era in uno stato di pausa*.

In Node.js 0.10, è stata aggiunta la classe [`Readable`](/it/nodejs/api/stream#class-streamreadable). Per la compatibilità con le versioni precedenti dei programmi Node.js, gli stream `Readable` passano in "flowing mode" quando viene aggiunto un gestore di eventi [`'data'`](/it/nodejs/api/stream#event-data), oppure quando viene chiamato il metodo [`stream.resume()`](/it/nodejs/api/stream#readableresume). L'effetto è che, anche quando non si utilizzano il nuovo metodo [`stream.read()`](/it/nodejs/api/stream#readablereadsize) e l'evento [`'readable'`](/it/nodejs/api/stream#event-readable), non è più necessario preoccuparsi di perdere chunk di [`'data'`](/it/nodejs/api/stream#event-data).

Sebbene la maggior parte delle applicazioni continuerà a funzionare normalmente, ciò introduce un caso limite nelle seguenti condizioni:

- Non viene aggiunto alcun listener di eventi [`'data'`](/it/nodejs/api/stream#event-data).
- Il metodo [`stream.resume()`](/it/nodejs/api/stream#readableresume) non viene mai chiamato.
- Lo stream non viene piped a nessuna destinazione scrivibile.

Ad esempio, considera il seguente codice:

```js [ESM]
// ATTENZIONE! ROTTO!
net.createServer((socket) => {

  // Aggiungiamo un listener 'end', ma non consumiamo mai i dati.
  socket.on('end', () => {
    // Non arriverà mai qui.
    socket.end('Il messaggio è stato ricevuto ma non è stato elaborato.\n');
  });

}).listen(1337);
```
Prima di Node.js 0.10, i dati del messaggio in entrata sarebbero semplicemente stati scartati. Tuttavia, in Node.js 0.10 e versioni successive, il socket rimane in pausa per sempre.

La soluzione alternativa in questa situazione è chiamare il metodo [`stream.resume()`](/it/nodejs/api/stream#readableresume) per avviare il flusso di dati:

```js [ESM]
// Soluzione alternativa.
net.createServer((socket) => {
  socket.on('end', () => {
    socket.end('Il messaggio è stato ricevuto ma non è stato elaborato.\n');
  });

  // Avvia il flusso di dati, scartandoli.
  socket.resume();
}).listen(1337);
```
Oltre ai nuovi stream `Readable` che passano in flowing mode, gli stream in stile pre-0.10 possono essere avvolti in una classe `Readable` utilizzando il metodo [`readable.wrap()`](/it/nodejs/api/stream#readablewrapstream).


### `readable.read(0)` {#readableread0}

Ci sono alcuni casi in cui è necessario attivare un aggiornamento dei meccanismi di flusso leggibile sottostanti, senza consumare effettivamente alcun dato. In tali casi, è possibile chiamare `readable.read(0)`, che restituirà sempre `null`.

Se il buffer di lettura interno è inferiore a `highWaterMark` e il flusso non è attualmente in lettura, la chiamata a `stream.read(0)` attiverà una chiamata [`stream._read()`](/it/nodejs/api/stream#readable_readsize) di basso livello.

Sebbene la maggior parte delle applicazioni non avrà quasi mai bisogno di farlo, ci sono situazioni all'interno di Node.js in cui ciò viene fatto, in particolare all'interno della classe di flusso `Readable`.

### `readable.push('')` {#readablepush}

L'uso di `readable.push('')` non è raccomandato.

L'invio di uno [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/it/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) o [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) a zero byte a un flusso che non è in modalità oggetto ha un interessante effetto collaterale. Poiché *è* una chiamata a [`readable.push()`](/it/nodejs/api/stream#readablepushchunk-encoding), la chiamata terminerà il processo di lettura. Tuttavia, poiché l'argomento è una stringa vuota, nessun dato viene aggiunto al buffer leggibile, quindi non c'è nulla che un utente possa consumare.

### Discrepanza `highWaterMark` dopo la chiamata a `readable.setEncoding()` {#highwatermark-discrepancy-after-calling-readablesetencoding}

L'uso di `readable.setEncoding()` cambierà il comportamento del modo in cui `highWaterMark` opera in modalità non oggetto.

In genere, la dimensione del buffer corrente viene misurata rispetto a `highWaterMark` in *byte*. Tuttavia, dopo che `setEncoding()` è stato chiamato, la funzione di confronto inizierà a misurare la dimensione del buffer in *caratteri*.

Questo non è un problema nei casi comuni con `latin1` o `ascii`. Ma si consiglia di essere consapevoli di questo comportamento quando si lavora con stringhe che potrebbero contenere caratteri multi-byte.

