---
title: Node.js Stream API Dokumentation
description: Detaillierte Dokumentation zur Node.js Stream API, die lesbare, schreibbare, duplex- und Transform-Streams abdeckt, zusammen mit ihren Methoden, Ereignissen und Nutzungsbeispielen.
head:
  - - meta
    - name: og:title
      content: Node.js Stream API Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Detaillierte Dokumentation zur Node.js Stream API, die lesbare, schreibbare, duplex- und Transform-Streams abdeckt, zusammen mit ihren Methoden, Ereignissen und Nutzungsbeispielen.
  - - meta
    - name: twitter:title
      content: Node.js Stream API Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Detaillierte Dokumentation zur Node.js Stream API, die lesbare, schreibbare, duplex- und Transform-Streams abdeckt, zusammen mit ihren Methoden, Ereignissen und Nutzungsbeispielen.
---


# Stream {#stream}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/stream.js](https://github.com/nodejs/node/blob/v23.5.0/lib/stream.js)

Ein Stream ist eine abstrakte Schnittstelle für die Arbeit mit Streaming-Daten in Node.js. Das Modul `node:stream` stellt eine API zur Implementierung der Stream-Schnittstelle bereit.

Es gibt viele Stream-Objekte, die von Node.js bereitgestellt werden. Zum Beispiel sind eine [Anfrage an einen HTTP-Server](/de/nodejs/api/http#class-httpincomingmessage) und [`process.stdout`](/de/nodejs/api/process#processstdout) beides Stream-Instanzen.

Streams können lesbar, schreibbar oder beides sein. Alle Streams sind Instanzen von [`EventEmitter`](/de/nodejs/api/events#class-eventemitter).

So greifen Sie auf das Modul `node:stream` zu:

```js [ESM]
const stream = require('node:stream');
```
Das Modul `node:stream` ist nützlich, um neue Arten von Stream-Instanzen zu erstellen. Es ist normalerweise nicht erforderlich, das Modul `node:stream` zu verwenden, um Streams zu konsumieren.

## Organisation dieses Dokuments {#organization-of-this-document}

Dieses Dokument enthält zwei Hauptabschnitte und einen dritten Abschnitt für Notizen. Der erste Abschnitt erklärt, wie bestehende Streams innerhalb einer Anwendung verwendet werden. Der zweite Abschnitt erklärt, wie neue Arten von Streams erstellt werden.

## Arten von Streams {#types-of-streams}

Es gibt vier grundlegende Stream-Typen innerhalb von Node.js:

- [`Writable`](/de/nodejs/api/stream#class-streamwritable): Streams, in die Daten geschrieben werden können (z. B. [`fs.createWriteStream()`](/de/nodejs/api/fs#fscreatewritestreampath-options)).
- [`Readable`](/de/nodejs/api/stream#class-streamreadable): Streams, aus denen Daten gelesen werden können (z. B. [`fs.createReadStream()`](/de/nodejs/api/fs#fscreatereadstreampath-options)).
- [`Duplex`](/de/nodejs/api/stream#class-streamduplex): Streams, die sowohl `Readable` als auch `Writable` sind (z. B. [`net.Socket`](/de/nodejs/api/net#class-netsocket)).
- [`Transform`](/de/nodejs/api/stream#class-streamtransform): `Duplex`-Streams, die die Daten beim Schreiben und Lesen verändern oder transformieren können (z. B. [`zlib.createDeflate()`](/de/nodejs/api/zlib#zlibcreatedeflateoptions)).

Zusätzlich enthält dieses Modul die Utility-Funktionen [`stream.duplexPair()`](/de/nodejs/api/stream#streamduplexpairoptions), [`stream.pipeline()`](/de/nodejs/api/stream#streampipelinesource-transforms-destination-callback), [`stream.finished()`](/de/nodejs/api/stream#streamfinishedstream-options-callback), [`stream.Readable.from()`](/de/nodejs/api/stream#streamreadablefromiterable-options) und [`stream.addAbortSignal()`](/de/nodejs/api/stream#streamaddabortsignalsignal-stream).


### Streams Promises API {#streams-promises-api}

**Hinzugefügt in: v15.0.0**

Die `stream/promises`-API bietet einen alternativen Satz asynchroner Hilfsfunktionen für Streams, die `Promise`-Objekte zurückgeben, anstatt Callbacks zu verwenden. Die API ist über `require('node:stream/promises')` oder `require('node:stream').promises` zugänglich.

### `stream.pipeline(source[, ...transforms], destination[, options])` {#streampipelinesource-transforms-destination-options}

### `stream.pipeline(streams[, options])` {#streampipelinestreams-options}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0, v17.2.0, v16.14.0 | Fügt die Option `end` hinzu, die auf `false` gesetzt werden kann, um das automatische Schließen des Ziel-Streams zu verhindern, wenn die Quelle endet. |
| v15.0.0 | Hinzugefügt in: v15.0.0 |
:::

- `streams` [\<Stream[]\>](/de/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `source` [\<Stream\>](/de/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)


- `...transforms` [\<Stream\>](/de/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)


- `destination` [\<Stream\>](/de/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)


- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Pipeline-Optionen
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal)
    - `end` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Beendet den Ziel-Stream, wenn der Quell-Stream endet. Transformations-Streams werden immer beendet, selbst wenn dieser Wert `false` ist. **Standard:** `true`.


- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird erfüllt, wenn die Pipeline abgeschlossen ist.



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

Um ein `AbortSignal` zu verwenden, übergeben Sie es innerhalb eines Options-Objekts als letztes Argument. Wenn das Signal abgebrochen wird, wird `destroy` für die zugrunde liegende Pipeline mit einem `AbortError` aufgerufen.



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

Die `pipeline`-API unterstützt auch asynchrone Generatoren:



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  await pipeline(
    fs.createReadStream('lowercase.txt'),
    async function* (source, { signal }) {
      source.setEncoding('utf8');  // Arbeitet mit Strings anstelle von `Buffer`s.
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
    source.setEncoding('utf8');  // Arbeitet mit Strings anstelle von `Buffer`s.
    for await (const chunk of source) {
      yield await processChunk(chunk, { signal });
    }
  },
  createWriteStream('uppercase.txt'),
);
console.log('Pipeline succeeded.');
```
:::

Denken Sie daran, das an den asynchronen Generator übergebene `signal`-Argument zu behandeln. Insbesondere in dem Fall, in dem der asynchrone Generator die Quelle für die Pipeline ist (d. h. das erste Argument), oder die Pipeline wird niemals abgeschlossen.



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

Die `pipeline`-API bietet eine [Callback-Version](/de/nodejs/api/stream#streampipelinesource-transforms-destination-callback):


### `stream.finished(stream[, options])` {#streamfinishedstream-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.5.0, v18.14.0 | Unterstützung für `ReadableStream` und `WritableStream` hinzugefügt. |
| v19.1.0, v18.13.0 | Die Option `cleanup` wurde hinzugefügt. |
| v15.0.0 | Hinzugefügt in: v15.0.0 |
:::

- `stream` [\<Stream\>](/de/nodejs/api/stream#stream) | [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream) Ein lesbarer und/oder beschreibbarer Stream/Webstream.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `error` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `cleanup` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Wenn `true`, entfernt die von dieser Funktion registrierten Listener, bevor das Promise erfüllt wird. **Standard:** `false`.


- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird erfüllt, wenn der Stream nicht mehr lesbar oder beschreibbar ist.

::: code-group
```js [CJS]
const { finished } = require('node:stream/promises');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

async function run() {
  await finished(rs);
  console.log('Stream ist mit dem Lesen fertig.');
}

run().catch(console.error);
rs.resume(); // Den Stream entleeren.
```

```js [ESM]
import { finished } from 'node:stream/promises';
import { createReadStream } from 'node:fs';

const rs = createReadStream('archive.tar');

async function run() {
  await finished(rs);
  console.log('Stream ist mit dem Lesen fertig.');
}

run().catch(console.error);
rs.resume(); // Den Stream entleeren.
```
:::

Die `finished`-API bietet auch eine [Callback-Version](/de/nodejs/api/stream#streamfinishedstream-options-callback).

`stream.finished()` hinterlässt hängende Event-Listener (insbesondere `'error'`, `'end'`, `'finish'` und `'close'`), nachdem das zurückgegebene Promise aufgelöst oder abgelehnt wurde. Der Grund dafür ist, dass unerwartete `'error'`-Ereignisse (aufgrund fehlerhafter Stream-Implementierungen) keine unerwarteten Abstürze verursachen sollen. Wenn dies ein unerwünschtes Verhalten ist, sollte `options.cleanup` auf `true` gesetzt werden:

```js [ESM]
await finished(rs, { cleanup: true });
```

### Objektmodus {#object-mode}

Alle von Node.js-APIs erstellten Streams arbeiten ausschließlich mit Strings, [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)-, [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)- und [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)-Objekten:

- `Strings` und `Buffers` sind die am häufigsten verwendeten Typen mit Streams.
- `TypedArray` und `DataView` ermöglichen Ihnen die Handhabung von Binärdaten mit Typen wie `Int32Array` oder `Uint8Array`. Wenn Sie ein TypedArray oder DataView in einen Stream schreiben, verarbeitet Node.js die rohen Bytes.

Es ist jedoch möglich, dass Stream-Implementierungen mit anderen Arten von JavaScript-Werten arbeiten (mit Ausnahme von `null`, das innerhalb von Streams einen besonderen Zweck erfüllt). Solche Streams gelten als "Objektmodus".

Stream-Instanzen werden in den Objektmodus geschaltet, indem die Option `objectMode` beim Erstellen des Streams verwendet wird. Der Versuch, einen vorhandenen Stream in den Objektmodus zu schalten, ist nicht sicher.

### Pufferung {#buffering}

Sowohl [`Writable`](/de/nodejs/api/stream#class-streamwritable)- als auch [`Readable`](/de/nodejs/api/stream#class-streamreadable)-Streams speichern Daten in einem internen Puffer.

Die Menge der potenziell gepufferten Daten hängt von der Option `highWaterMark` ab, die an den Konstruktor des Streams übergeben wird. Für normale Streams gibt die Option `highWaterMark` eine [Gesamtzahl von Bytes](/de/nodejs/api/stream#highwatermark-discrepancy-after-calling-readablesetencoding) an. Für Streams, die im Objektmodus arbeiten, gibt `highWaterMark` eine Gesamtzahl von Objekten an. Für Streams, die mit Strings arbeiten (diese aber nicht dekodieren), gibt `highWaterMark` eine Gesamtzahl von UTF-16-Codeeinheiten an.

Daten werden in `Readable`-Streams gepuffert, wenn die Implementierung [`stream.push(chunk)`](/de/nodejs/api/stream#readablepushchunk-encoding) aufruft. Wenn der Konsument des Streams [`stream.read()`](/de/nodejs/api/stream#readablereadsize) nicht aufruft, verbleiben die Daten in der internen Warteschlange, bis sie verbraucht werden.

Sobald die Gesamtgröße des internen Lesepuffers den durch `highWaterMark` angegebenen Schwellenwert erreicht, stoppt der Stream vorübergehend das Lesen von Daten aus der zugrunde liegenden Ressource, bis die aktuell gepufferten Daten verbraucht werden können (d. h. der Stream stoppt den Aufruf der internen [`readable._read()`](/de/nodejs/api/stream#readable_readsize)-Methode, die zum Füllen des Lesepuffers verwendet wird).

Daten werden in `Writable`-Streams gepuffert, wenn die Methode [`writable.write(chunk)`](/de/nodejs/api/stream#writablewritechunk-encoding-callback) wiederholt aufgerufen wird. Solange die Gesamtgröße des internen Schreibpuffers unter dem von `highWaterMark` festgelegten Schwellenwert liegt, geben Aufrufe von `writable.write()` `true` zurück. Sobald die Größe des internen Puffers `highWaterMark` erreicht oder überschreitet, wird `false` zurückgegeben.

Ein Hauptziel der `stream`-API, insbesondere der Methode [`stream.pipe()`](/de/nodejs/api/stream#readablepipedestination-options), ist es, die Pufferung von Daten auf ein akzeptables Maß zu beschränken, so dass Quellen und Ziele mit unterschiedlichen Geschwindigkeiten den verfügbaren Speicher nicht überlasten.

Die Option `highWaterMark` ist ein Schwellenwert, keine Grenze: Sie bestimmt die Datenmenge, die ein Stream puffert, bevor er aufhört, nach weiteren Daten zu fragen. Sie erzwingt im Allgemeinen keine strenge Speicherbegrenzung. Spezifische Stream-Implementierungen können strengere Grenzen erzwingen, dies ist jedoch optional.

Da [`Duplex`](/de/nodejs/api/stream#class-streamduplex)- und [`Transform`](/de/nodejs/api/stream#class-streamtransform)-Streams sowohl `Readable` als auch `Writable` sind, verwaltet jeder *zwei* separate interne Puffer, die zum Lesen und Schreiben verwendet werden, wodurch jede Seite unabhängig voneinander arbeiten kann, während ein angemessener und effizienter Datenfluss aufrechterhalten wird. Beispielsweise sind [`net.Socket`](/de/nodejs/api/net#class-netsocket)-Instanzen [`Duplex`](/de/nodejs/api/stream#class-streamduplex)-Streams, deren `Readable`-Seite den Verbrauch von Daten ermöglicht, die *von* dem Socket empfangen werden, und deren `Writable`-Seite das Schreiben von Daten *an* den Socket ermöglicht. Da Daten möglicherweise mit einer schnelleren oder langsameren Rate in den Socket geschrieben werden als Daten empfangen werden, sollte jede Seite unabhängig von der anderen arbeiten (und puffern).

Die Mechanismen der internen Pufferung sind ein internes Implementierungsdetail und können jederzeit geändert werden. Für bestimmte erweiterte Implementierungen können die internen Puffer jedoch mit `writable.writableBuffer` oder `readable.readableBuffer` abgerufen werden. Die Verwendung dieser undokumentierten Eigenschaften wird nicht empfohlen.


## API für Stream-Konsumenten {#api-for-stream-consumers}

Fast alle Node.js-Anwendungen, egal wie einfach sie sind, verwenden Streams in irgendeiner Form. Das Folgende ist ein Beispiel für die Verwendung von Streams in einer Node.js-Anwendung, die einen HTTP-Server implementiert:

```js [ESM]
const http = require('node:http');

const server = http.createServer((req, res) => {
  // `req` ist ein http.IncomingMessage, der ein lesbarer Stream ist.
  // `res` ist ein http.ServerResponse, der ein beschreibbarer Stream ist.

  let body = '';
  // Die Daten als utf8-Strings abrufen.
  // Wenn keine Kodierung festgelegt ist, werden Buffer-Objekte empfangen.
  req.setEncoding('utf8');

  // Lesbare Streams geben 'data'-Ereignisse aus, sobald ein Listener hinzugefügt wurde.
  req.on('data', (chunk) => {
    body += chunk;
  });

  // Das 'end'-Ereignis zeigt an, dass der gesamte Body empfangen wurde.
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      // Dem Benutzer etwas Interessantes zurückschreiben:
      res.write(typeof data);
      res.end();
    } catch (er) {
      // Uh oh! Schlechtes JSON!
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
[`Writable`](/de/nodejs/api/stream#class-streamwritable)-Streams (wie `res` im Beispiel) stellen Methoden wie `write()` und `end()` bereit, die verwendet werden, um Daten in den Stream zu schreiben.

[`Readable`](/de/nodejs/api/stream#class-streamreadable)-Streams verwenden die [`EventEmitter`](/de/nodejs/api/events#class-eventemitter)-API, um Anwendungscode zu benachrichtigen, wenn Daten zum Lesen aus dem Stream verfügbar sind. Diese verfügbaren Daten können auf verschiedene Arten aus dem Stream gelesen werden.

Sowohl [`Writable`](/de/nodejs/api/stream#class-streamwritable)- als auch [`Readable`](/de/nodejs/api/stream#class-streamreadable)-Streams verwenden die [`EventEmitter`](/de/nodejs/api/events#class-eventemitter)-API auf verschiedene Weise, um den aktuellen Status des Streams zu kommunizieren.

[`Duplex`](/de/nodejs/api/stream#class-streamduplex)- und [`Transform`](/de/nodejs/api/stream#class-streamtransform)-Streams sind sowohl [`Writable`](/de/nodejs/api/stream#class-streamwritable) als auch [`Readable`](/de/nodejs/api/stream#class-streamreadable).

Anwendungen, die entweder Daten in einen Stream schreiben oder Daten aus einem Stream konsumieren, müssen die Stream-Schnittstellen nicht direkt implementieren und haben im Allgemeinen keinen Grund, `require('node:stream')` aufzurufen.

Entwickler, die neue Arten von Streams implementieren möchten, sollten den Abschnitt [API für Stream-Implementierer](/de/nodejs/api/stream#api-for-stream-implementers) konsultieren.


### Beschreibbare Streams {#writable-streams}

Beschreibbare Streams sind eine Abstraktion für ein *Ziel*, in das Daten geschrieben werden.

Beispiele für [`Writable`](/de/nodejs/api/stream#class-streamwritable)-Streams sind:

- [HTTP-Anfragen auf dem Client](/de/nodejs/api/http#class-httpclientrequest)
- [HTTP-Antworten auf dem Server](/de/nodejs/api/http#class-httpserverresponse)
- [fs Write-Streams](/de/nodejs/api/fs#class-fswritestream)
- [zlib-Streams](/de/nodejs/api/zlib)
- [crypto-Streams](/de/nodejs/api/crypto)
- [TCP-Sockets](/de/nodejs/api/net#class-netsocket)
- [Stdin des Kindprozesses](/de/nodejs/api/child_process#subprocessstdin)
- [`process.stdout`](/de/nodejs/api/process#processstdout), [`process.stderr`](/de/nodejs/api/process#processstderr)

Einige dieser Beispiele sind tatsächlich [`Duplex`](/de/nodejs/api/stream#class-streamduplex)-Streams, die die [`Writable`](/de/nodejs/api/stream#class-streamwritable)-Schnittstelle implementieren.

Alle [`Writable`](/de/nodejs/api/stream#class-streamwritable)-Streams implementieren die von der Klasse `stream.Writable` definierte Schnittstelle.

Während sich spezifische Instanzen von [`Writable`](/de/nodejs/api/stream#class-streamwritable)-Streams in verschiedener Hinsicht unterscheiden können, folgen alle `Writable`-Streams dem gleichen grundlegenden Verwendungsmuster, wie im folgenden Beispiel veranschaulicht:

```js [ESM]
const myStream = getWritableStreamSomehow();
myStream.write('some data');
myStream.write('some more data');
myStream.end('done writing data');
```
#### Klasse: `stream.Writable` {#class-streamwritable}

**Hinzugefügt in: v0.9.4**

##### Ereignis: `'close'` {#event-close}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Option `emitClose` hinzugefügt, um anzugeben, ob `'close'` bei Zerstörung ausgegeben wird. |
| v0.9.4 | Hinzugefügt in: v0.9.4 |
:::

Das Ereignis `'close'` wird ausgelöst, wenn der Stream und alle seine zugrunde liegenden Ressourcen (z. B. ein Dateideskriptor) geschlossen wurden. Das Ereignis zeigt an, dass keine weiteren Ereignisse ausgelöst werden und keine weiteren Berechnungen mehr stattfinden.

Ein [`Writable`](/de/nodejs/api/stream#class-streamwritable)-Stream löst immer das Ereignis `'close'` aus, wenn er mit der Option `emitClose` erstellt wurde.

##### Ereignis: `'drain'` {#event-drain}

**Hinzugefügt in: v0.9.4**

Wenn ein Aufruf von [`stream.write(chunk)`](/de/nodejs/api/stream#writablewritechunk-encoding-callback) `false` zurückgibt, wird das Ereignis `'drain'` ausgelöst, wenn es angemessen ist, die Daten in den Stream zu schreiben.

```js [ESM]
// Schreibe die Daten eine Million Mal in den angegebenen beschreibbaren Stream.
// Achte auf Gegendruck.
function writeOneMillionTimes(writer, data, encoding, callback) {
  let i = 1000000;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        // Letztes Mal!
        writer.write(data, encoding, callback);
      } else {
        // Prüfe, ob wir fortfahren oder warten sollen.
        // Übergebe den Callback nicht, da wir noch nicht fertig sind.
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // Musste frühzeitig anhalten!
      // Schreibe mehr, sobald es abläuft.
      writer.once('drain', write);
    }
  }
}
```

##### Ereignis: `'error'` {#event-error}

**Hinzugefügt in: v0.9.4**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Das `'error'`-Ereignis wird ausgelöst, wenn beim Schreiben oder Weiterleiten von Daten ein Fehler aufgetreten ist. Der Listener-Callback erhält beim Aufruf ein einzelnes `Error`-Argument.

Der Stream wird geschlossen, wenn das `'error'`-Ereignis ausgelöst wird, es sei denn, die Option [`autoDestroy`](/de/nodejs/api/stream#new-streamwritableoptions) wurde beim Erstellen des Streams auf `false` gesetzt.

Nach `'error'` *sollten* keine weiteren Ereignisse als `'close'` ausgelöst werden (einschließlich `'error'`-Ereignisse).

##### Ereignis: `'finish'` {#event-finish}

**Hinzugefügt in: v0.9.4**

Das `'finish'`-Ereignis wird ausgelöst, nachdem die [`stream.end()`]-Methode(/de/nodejs/api/stream#writableendchunk-encoding-callback) aufgerufen wurde und alle Daten in das zugrunde liegende System geschrieben wurden.

```js [ESM]
const writer = getWritableStreamSomehow();
for (let i = 0; i < 100; i++) {
  writer.write(`hello, #${i}!\n`);
}
writer.on('finish', () => {
  console.log('All writes are now complete.');
});
writer.end('This is the end\n');
```
##### Ereignis: `'pipe'` {#event-pipe}

**Hinzugefügt in: v0.9.4**

- `src` [\<stream.Readable\>](/de/nodejs/api/stream#class-streamreadable) Quell-Stream, der in diesen beschreibbaren Stream weiterleitet

Das `'pipe'`-Ereignis wird ausgelöst, wenn die [`stream.pipe()`]-Methode(/de/nodejs/api/stream#readablepipedestination-options) auf einem lesbaren Stream aufgerufen wird und dieser beschreibbare Stream zu seinen Zielen hinzugefügt wird.

```js [ESM]
const writer = getWritableStreamSomehow();
const reader = getReadableStreamSomehow();
writer.on('pipe', (src) => {
  console.log('Something is piping into the writer.');
  assert.equal(src, reader);
});
reader.pipe(writer);
```
##### Ereignis: `'unpipe'` {#event-unpipe}

**Hinzugefügt in: v0.9.4**

- `src` [\<stream.Readable\>](/de/nodejs/api/stream#class-streamreadable) Der Quell-Stream, der dieses beschreibbare Element [entkoppelt](/de/nodejs/api/stream#readableunpipedestination) hat

Das `'unpipe'`-Ereignis wird ausgelöst, wenn die [`stream.unpipe()`]-Methode(/de/nodejs/api/stream#readableunpipedestination) auf einem [`Readable`](/de/nodejs/api/stream#class-streamreadable)-Stream aufgerufen wird und dieses [`Writable`](/de/nodejs/api/stream#class-streamwritable) aus seinen Zielen entfernt wird.

Dies wird auch ausgelöst, falls dieser [`Writable`](/de/nodejs/api/stream#class-streamwritable)-Stream einen Fehler ausgibt, wenn ein [`Readable`](/de/nodejs/api/stream#class-streamreadable)-Stream in ihn hineinschreibt.

```js [ESM]
const writer = getWritableStreamSomehow();
const reader = getReadableStreamSomehow();
writer.on('unpipe', (src) => {
  console.log('Something has stopped piping into the writer.');
  assert.equal(src, reader);
});
reader.pipe(writer);
reader.unpipe(writer);
```

##### `writable.cork()` {#writablecork}

**Hinzugefügt in: v0.11.2**

Die Methode `writable.cork()` erzwingt, dass alle geschriebenen Daten im Speicher gepuffert werden. Die gepufferten Daten werden geleert, wenn entweder die Methoden [`stream.uncork()`](/de/nodejs/api/stream#writableuncork) oder [`stream.end()`](/de/nodejs/api/stream#writableendchunk-encoding-callback) aufgerufen werden.

Die Hauptabsicht von `writable.cork()` besteht darin, eine Situation zu berücksichtigen, in der mehrere kleine Chunks schnell hintereinander in den Stream geschrieben werden. Anstatt diese sofort an das zugrunde liegende Ziel weiterzuleiten, puffert `writable.cork()` alle Chunks, bis `writable.uncork()` aufgerufen wird, was sie alle an `writable._writev()` übergibt, falls vorhanden. Dies verhindert eine Head-of-Line-Blocking-Situation, in der Daten gepuffert werden, während auf die Verarbeitung des ersten kleinen Chunks gewartet wird. Die Verwendung von `writable.cork()` ohne Implementierung von `writable._writev()` kann sich jedoch nachteilig auf den Durchsatz auswirken.

Siehe auch: [`writable.uncork()`](/de/nodejs/api/stream#writableuncork), [`writable._writev()`](/de/nodejs/api/stream#writable_writevchunks-callback).

##### `writable.destroy([error])` {#writabledestroyerror}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v14.0.0 | Funktioniert als No-Op für einen Stream, der bereits zerstört wurde. |
| v8.0.0 | Hinzugefügt in: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Optional, ein Fehler, der mit dem `'error'`-Event ausgegeben werden soll.
- Gibt zurück: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Zerstört den Stream. Gibt optional ein `'error'`-Event aus und gibt ein `'close'`-Event aus (es sei denn, `emitClose` ist auf `false` gesetzt). Nach diesem Aufruf ist der beschreibbare Stream beendet und nachfolgende Aufrufe von `write()` oder `end()` führen zu einem `ERR_STREAM_DESTROYED`-Fehler. Dies ist eine destruktive und sofortige Möglichkeit, einen Stream zu zerstören. Vorherige Aufrufe von `write()` wurden möglicherweise nicht geleert und können einen `ERR_STREAM_DESTROYED`-Fehler auslösen. Verwenden Sie `end()` anstelle von destroy, wenn Daten vor dem Schließen geleert werden sollen, oder warten Sie auf das `'drain'`-Event, bevor Sie den Stream zerstören.

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
Sobald `destroy()` aufgerufen wurde, sind alle weiteren Aufrufe ein No-Op, und es werden keine weiteren Fehler außer von `_destroy()` als `'error'` ausgegeben.

Implementierer sollten diese Methode nicht überschreiben, sondern stattdessen [`writable._destroy()`](/de/nodejs/api/stream#writable_destroyerr-callback) implementieren.


##### `writable.closed` {#writableclosed}

**Hinzugefügt in: v18.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ist `true`, nachdem `'close'` emittiert wurde.

##### `writable.destroyed` {#writabledestroyed}

**Hinzugefügt in: v8.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ist `true`, nachdem [`writable.destroy()`](/de/nodejs/api/stream#writabledestroyerror) aufgerufen wurde.

```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

console.log(myStream.destroyed); // false
myStream.destroy();
console.log(myStream.destroyed); // true
```
##### `writable.end([chunk[, encoding]][, callback])` {#writableendchunk-encoding-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.0.0, v20.13.0 | Das Argument `chunk` kann nun eine `TypedArray`- oder `DataView`-Instanz sein. |
| v15.0.0 | Der `callback` wird vor 'finish' oder bei einem Fehler aufgerufen. |
| v14.0.0 | Der `callback` wird aufgerufen, wenn 'finish' oder 'error' emittiert wird. |
| v10.0.0 | Diese Methode gibt nun eine Referenz auf `writable` zurück. |
| v8.0.0 | Das Argument `chunk` kann nun eine `Uint8Array`-Instanz sein. |
| v0.9.4 | Hinzugefügt in: v0.9.4 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Optionale Daten zum Schreiben. Für Streams, die nicht im Objektmodus arbeiten, muss `chunk` ein [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/de/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) oder [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) sein. Für Objektmodus-Streams kann `chunk` jeder JavaScript-Wert außer `null` sein.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Kodierung, wenn `chunk` ein String ist
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback, wenn der Stream beendet ist.
- Gibt zurück: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Der Aufruf der Methode `writable.end()` signalisiert, dass keine weiteren Daten in den [`Writable`](/de/nodejs/api/stream#class-streamwritable) geschrieben werden. Die optionalen Argumente `chunk` und `encoding` ermöglichen das Schreiben eines letzten zusätzlichen Datenblocks unmittelbar vor dem Schließen des Streams.

Der Aufruf der Methode [`stream.write()`](/de/nodejs/api/stream#writablewritechunk-encoding-callback) nach dem Aufruf von [`stream.end()`](/de/nodejs/api/stream#writableendchunk-encoding-callback) löst einen Fehler aus.

```js [ESM]
// Schreibe 'hello, ' und beende dann mit 'world!'.
const fs = require('node:fs');
const file = fs.createWriteStream('example.txt');
file.write('hello, ');
file.end('world!');
// Jetzt mehr zu schreiben ist nicht erlaubt!
```

##### `writable.setDefaultEncoding(encoding)` {#writablesetdefaultencodingencoding}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v6.1.0 | Diese Methode gibt nun eine Referenz auf `writable` zurück. |
| v0.11.15 | Hinzugefügt in: v0.11.15 |
:::

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die neue Standardkodierung
- Gibt zurück: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Die Methode `writable.setDefaultEncoding()` setzt die Standard-`encoding` für einen [`Writable`](/de/nodejs/api/stream#class-streamwritable)-Stream.

##### `writable.uncork()` {#writableuncork}

**Hinzugefügt in: v0.11.2**

Die Methode `writable.uncork()` leert alle Daten, die seit dem Aufruf von [`stream.cork()`](/de/nodejs/api/stream#writablecork) gepuffert wurden.

Wenn Sie [`writable.cork()`](/de/nodejs/api/stream#writablecork) und `writable.uncork()` verwenden, um die Pufferung von Schreibvorgängen in einen Stream zu verwalten, verschieben Sie Aufrufe von `writable.uncork()` mit `process.nextTick()`. Auf diese Weise können alle `writable.write()`-Aufrufe, die innerhalb einer bestimmten Node.js-Ereignisschleifenphase auftreten, zusammengefasst werden.

```js [ESM]
stream.cork();
stream.write('some ');
stream.write('data ');
process.nextTick(() => stream.uncork());
```
Wenn die Methode [`writable.cork()`](/de/nodejs/api/stream#writablecork) mehrmals auf einem Stream aufgerufen wird, muss die gleiche Anzahl von Aufrufen von `writable.uncork()` aufgerufen werden, um die gepufferten Daten zu leeren.

```js [ESM]
stream.cork();
stream.write('some ');
stream.cork();
stream.write('data ');
process.nextTick(() => {
  stream.uncork();
  // Die Daten werden erst geleert, wenn uncork() ein zweites Mal aufgerufen wird.
  stream.uncork();
});
```
Siehe auch: [`writable.cork()`](/de/nodejs/api/stream#writablecork).

##### `writable.writable` {#writablewritable}

**Hinzugefügt in: v11.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ist `true`, wenn es sicher ist, [`writable.write()`](/de/nodejs/api/stream#writablewritechunk-encoding-callback) aufzurufen, was bedeutet, dass der Stream nicht zerstört wurde, einen Fehler aufgeworfen hat oder beendet wurde.

##### `writable.writableAborted` {#writablewritableaborted}

**Hinzugefügt in: v18.0.0, v16.17.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt zurück, ob der Stream zerstört wurde oder einen Fehler aufgeworfen hat, bevor er `'finish'` ausgab.


##### `writable.writableEnded` {#writablewritableended}

**Hinzugefügt in: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ist `true`, nachdem [`writable.end()`](/de/nodejs/api/stream#writableendchunk-encoding-callback) aufgerufen wurde. Diese Eigenschaft gibt nicht an, ob die Daten geleert wurden; verwenden Sie stattdessen [`writable.writableFinished`](/de/nodejs/api/stream#writablewritablefinished).

##### `writable.writableCorked` {#writablewritablecorked}

**Hinzugefügt in: v13.2.0, v12.16.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Anzahl, wie oft [`writable.uncork()`](/de/nodejs/api/stream#writableuncork) aufgerufen werden muss, um den Stream vollständig zu entkorken.

##### `writable.errored` {#writableerrored}

**Hinzugefügt in: v18.0.0**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Gibt einen Fehler zurück, wenn der Stream mit einem Fehler zerstört wurde.

##### `writable.writableFinished` {#writablewritablefinished}

**Hinzugefügt in: v12.6.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wird unmittelbar vor dem Ausgeben des [`'finish'`](/de/nodejs/api/stream#event-finish)-Ereignisses auf `true` gesetzt.

##### `writable.writableHighWaterMark` {#writablewritablehighwatermark}

**Hinzugefügt in: v9.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Gibt den Wert von `highWaterMark` zurück, der beim Erstellen dieses `Writable` übergeben wurde.

##### `writable.writableLength` {#writablewritablelength}

**Hinzugefügt in: v9.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Diese Eigenschaft enthält die Anzahl der Bytes (oder Objekte) in der Warteschlange, die zum Schreiben bereit sind. Der Wert liefert Introspektionsdaten zum Status von `highWaterMark`.

##### `writable.writableNeedDrain` {#writablewritableneeddrain}

**Hinzugefügt in: v15.2.0, v14.17.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ist `true`, wenn der Puffer des Streams voll ist und der Stream `'drain'` ausgibt.


##### `writable.writableObjectMode` {#writablewritableobjectmode}

**Hinzugefügt in: v12.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Getter für die Eigenschaft `objectMode` eines gegebenen `Writable`-Streams.

##### `writable[Symbol.asyncDispose]()` {#writablesymbolasyncdispose}

**Hinzugefügt in: v22.4.0, v20.16.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Ruft [`writable.destroy()`](/de/nodejs/api/stream#writabledestroyerror) mit einem `AbortError` auf und gibt ein Promise zurück, das erfüllt wird, wenn der Stream abgeschlossen ist.

##### `writable.write(chunk[, encoding][, callback])` {#writablewritechunk-encoding-callback}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v22.0.0, v20.13.0 | Das `chunk`-Argument kann jetzt eine `TypedArray`- oder `DataView`-Instanz sein. |
| v8.0.0 | Das `chunk`-Argument kann jetzt eine `Uint8Array`-Instanz sein. |
| v6.0.0 | Das Übergeben von `null` als `chunk`-Parameter wird jetzt immer als ungültig betrachtet, auch im Objektmodus. |
| v0.9.4 | Hinzugefügt in: v0.9.4 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Optionale Daten zum Schreiben. Für Streams, die nicht im Objektmodus arbeiten, muss `chunk` ein [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/de/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) oder [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) sein. Für Objektmodus-Streams kann `chunk` ein beliebiger JavaScript-Wert außer `null` sein.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Die Kodierung, wenn `chunk` ein String ist. **Standard:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback, wenn dieser Datenblock geleert wurde.
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`, wenn der Stream wünscht, dass der aufrufende Code wartet, bis das `'drain'`-Ereignis ausgelöst wird, bevor er mit dem Schreiben zusätzlicher Daten fortfährt; andernfalls `true`.

Die `writable.write()`-Methode schreibt Daten in den Stream und ruft den bereitgestellten `callback` auf, sobald die Daten vollständig verarbeitet wurden. Wenn ein Fehler auftritt, wird der `callback` mit dem Fehler als erstem Argument aufgerufen. Der `callback` wird asynchron und vor dem Auslösen von `'error'` aufgerufen.

Der Rückgabewert ist `true`, wenn der interne Puffer kleiner als das `highWaterMark` ist, das beim Erstellen des Streams konfiguriert wurde, nachdem `chunk` zugelassen wurde. Wenn `false` zurückgegeben wird, sollten weitere Versuche, Daten in den Stream zu schreiben, gestoppt werden, bis das [`'drain'` ](/de/nodejs/api/stream#event-drain)-Ereignis ausgelöst wird.

Solange ein Stream nicht geleert wird, puffern Aufrufe von `write()` `chunk` und geben false zurück. Sobald alle aktuell gepufferten Chunks geleert (vom Betriebssystem zur Zustellung angenommen) wurden, wird das `'drain'`-Ereignis ausgelöst. Sobald `write()` false zurückgibt, schreiben Sie keine weiteren Chunks, bis das `'drain'`-Ereignis ausgelöst wird. Während das Aufrufen von `write()` für einen Stream, der nicht geleert wird, zulässig ist, puffert Node.js alle geschriebenen Chunks, bis die maximale Speichernutzung erreicht ist. Ab diesem Zeitpunkt wird der Vorgang bedingungslos abgebrochen. Noch bevor er abbricht, führt eine hohe Speichernutzung zu einer schlechten Leistung des Garbage Collectors und zu einem hohen RSS (der normalerweise nicht an das System zurückgegeben wird, selbst nachdem der Speicher nicht mehr benötigt wird). Da TCP-Sockets möglicherweise niemals geleert werden, wenn der Remote-Peer die Daten nicht liest, kann das Schreiben eines Sockets, der nicht geleert wird, zu einer aus der Ferne ausnutzbaren Sicherheitslücke führen.

Das Schreiben von Daten, während der Stream nicht geleert wird, ist besonders problematisch für einen [`Transform`](/de/nodejs/api/stream#class-streamtransform), da die `Transform`-Streams standardmäßig angehalten werden, bis sie gepiped werden oder ein `'data'`- oder `'readable'`-Ereignishandler hinzugefügt wird.

Wenn die zu schreibenden Daten bei Bedarf generiert oder abgerufen werden können, wird empfohlen, die Logik in einen [`Readable`](/de/nodejs/api/stream#class-streamreadable) zu kapseln und [`stream.pipe()`](/de/nodejs/api/stream#readablepipedestination-options) zu verwenden. Wenn jedoch das Aufrufen von `write()` bevorzugt wird, ist es möglich, den Gegendruck zu berücksichtigen und Speicherprobleme mithilfe des [`'drain'` ](/de/nodejs/api/stream#event-drain)-Ereignisses zu vermeiden:

```js [ESM]
function write(data, cb) {
  if (!stream.write(data)) {
    stream.once('drain', cb);
  } else {
    process.nextTick(cb);
  }
}

// Warten Sie, bis cb aufgerufen wird, bevor Sie weitere Schreibvorgänge durchführen.
write('hello', () => {
  console.log('Schreiben abgeschlossen, jetzt weitere Schreibvorgänge durchführen.');
});
```
Ein `Writable`-Stream im Objektmodus ignoriert das `encoding`-Argument immer.


### Lesbare Streams {#readable-streams}

Lesbare Streams sind eine Abstraktion für eine *Quelle*, aus der Daten entnommen werden.

Beispiele für `Readable`-Streams sind:

- [HTTP-Antworten auf dem Client](/de/nodejs/api/http#class-httpincomingmessage)
- [HTTP-Anfragen auf dem Server](/de/nodejs/api/http#class-httpincomingmessage)
- [fs-Leseströme](/de/nodejs/api/fs#class-fsreadstream)
- [zlib-Streams](/de/nodejs/api/zlib)
- [crypto-Streams](/de/nodejs/api/crypto)
- [TCP-Sockets](/de/nodejs/api/net#class-netsocket)
- [stdout und stderr von Kindprozessen](/de/nodejs/api/child_process#subprocessstdout)
- [`process.stdin`](/de/nodejs/api/process#processstdin)

Alle [`Readable`](/de/nodejs/api/stream#class-streamreadable)-Streams implementieren die durch die Klasse `stream.Readable` definierte Schnittstelle.

#### Zwei Lesemodi {#two-reading-modes}

`Readable`-Streams arbeiten effektiv in einem von zwei Modi: fließend und pausiert. Diese Modi sind getrennt vom [Objektmodus](/de/nodejs/api/stream#object-mode). Ein [`Readable`](/de/nodejs/api/stream#class-streamreadable)-Stream kann sich im Objektmodus befinden oder nicht, unabhängig davon, ob er sich im fließenden Modus oder im pausierten Modus befindet.

- Im fließenden Modus werden Daten automatisch aus dem zugrunde liegenden System gelesen und einer Anwendung so schnell wie möglich über Ereignisse über die [`EventEmitter`](/de/nodejs/api/events#class-eventemitter)-Schnittstelle bereitgestellt.
- Im pausierten Modus muss die Methode [`stream.read()`](/de/nodejs/api/stream#readablereadsize) explizit aufgerufen werden, um Datenblöcke aus dem Stream zu lesen.

Alle [`Readable`](/de/nodejs/api/stream#class-streamreadable)-Streams beginnen im pausierten Modus, können aber auf eine der folgenden Arten in den fließenden Modus umgeschaltet werden:

- Hinzufügen eines [`'data'`](/de/nodejs/api/stream#event-data)-Ereignis-Handlers.
- Aufrufen der Methode [`stream.resume()`](/de/nodejs/api/stream#readableresume).
- Aufrufen der Methode [`stream.pipe()`](/de/nodejs/api/stream#readablepipedestination-options), um die Daten an einen [`Writable`](/de/nodejs/api/stream#class-streamwritable) zu senden.

Der `Readable` kann mit einer der folgenden Methoden wieder in den pausierten Modus wechseln:

- Wenn keine Pipe-Ziele vorhanden sind, durch Aufrufen der Methode [`stream.pause()`](/de/nodejs/api/stream#readablepause).
- Wenn Pipe-Ziele vorhanden sind, durch Entfernen aller Pipe-Ziele. Mehrere Pipe-Ziele können durch Aufrufen der Methode [`stream.unpipe()`](/de/nodejs/api/stream#readableunpipedestination) entfernt werden.

Das wichtigste Konzept, das man sich merken sollte, ist, dass ein `Readable` erst dann Daten generiert, wenn ein Mechanismus zum Verbrauchen oder Ignorieren dieser Daten bereitgestellt wird. Wenn der Verbrauchsmechanismus deaktiviert oder entfernt wird, wird der `Readable` *versuchen*, die Datengenerierung zu stoppen.

Aus Gründen der Abwärtskompatibilität wird das Entfernen von [`'data'`](/de/nodejs/api/stream#event-data)-Ereignis-Handlern den Stream **nicht** automatisch anhalten. Wenn Pipe-Ziele vorhanden sind, garantiert der Aufruf von [`stream.pause()`](/de/nodejs/api/stream#readablepause) auch nicht, dass der Stream *pausiert* bleibt, sobald diese Ziele entleert sind und weitere Daten anfordern.

Wenn ein [`Readable`](/de/nodejs/api/stream#class-streamreadable) in den fließenden Modus geschaltet wird und keine Verbraucher zur Verfügung stehen, um die Daten zu verarbeiten, gehen diese Daten verloren. Dies kann beispielsweise vorkommen, wenn die Methode `readable.resume()` aufgerufen wird, ohne dass ein Listener an das Ereignis `'data'` angehängt ist, oder wenn ein `'data'`-Ereignis-Handler aus dem Stream entfernt wird.

Das Hinzufügen eines [`'readable'`](/de/nodejs/api/stream#event-readable)-Ereignis-Handlers bewirkt automatisch, dass der Stream nicht mehr fließt und die Daten über [`readable.read()`](/de/nodejs/api/stream#readablereadsize) verbraucht werden müssen. Wenn der [`'readable'`](/de/nodejs/api/stream#event-readable)-Ereignis-Handler entfernt wird, beginnt der Stream wieder zu fließen, wenn ein [`'data'`](/de/nodejs/api/stream#event-data)-Ereignis-Handler vorhanden ist.


#### Drei Zustände {#three-states}

Die "zwei Modi" des Betriebs für einen `Readable`-Stream sind eine vereinfachte Abstraktion für das kompliziertere interne Zustandsmanagement, das innerhalb der `Readable`-Stream-Implementierung stattfindet.

Insbesondere befindet sich jeder `Readable`-Stream zu jedem gegebenen Zeitpunkt in einem von drei möglichen Zuständen:

- `readable.readableFlowing === null`
- `readable.readableFlowing === false`
- `readable.readableFlowing === true`

Wenn `readable.readableFlowing` gleich `null` ist, wird kein Mechanismus zum Konsumieren der Daten des Streams bereitgestellt. Daher wird der Stream keine Daten erzeugen. Während dieses Zustands bewirkt das Anhängen eines Listeners für das `'data'`-Ereignis, das Aufrufen der `readable.pipe()`-Methode oder das Aufrufen der `readable.resume()`-Methode, dass `readable.readableFlowing` auf `true` gesetzt wird, wodurch der `Readable`-Stream aktiv mit der Ausgabe von Ereignissen beginnt, sobald Daten generiert werden.

Das Aufrufen von `readable.pause()`, `readable.unpipe()` oder das Empfangen von Gegendruck führt dazu, dass `readable.readableFlowing` auf `false` gesetzt wird, wodurch der Fluss von Ereignissen vorübergehend gestoppt wird, die Generierung von Daten jedoch *nicht* angehalten wird. Während dieses Zustands bewirkt das Anhängen eines Listeners für das `'data'`-Ereignis nicht, dass `readable.readableFlowing` auf `true` gesetzt wird.

```js [ESM]
const { PassThrough, Writable } = require('node:stream');
const pass = new PassThrough();
const writable = new Writable();

pass.pipe(writable);
pass.unpipe(writable);
// readableFlowing ist jetzt false.

pass.on('data', (chunk) => { console.log(chunk.toString()); });
// readableFlowing ist immer noch false.
pass.write('ok');  // Wird kein 'data' ausgeben.
pass.resume();     // Muss aufgerufen werden, damit der Stream 'data' ausgibt.
// readableFlowing ist jetzt true.
```
Während `readable.readableFlowing` gleich `false` ist, können sich Daten im internen Puffer des Streams ansammeln.

#### Wählen Sie einen API-Stil {#choose-one-api-style}

Die `Readable`-Stream-API hat sich über mehrere Node.js-Versionen hinweg entwickelt und bietet mehrere Methoden zum Konsumieren von Stream-Daten. Im Allgemeinen sollten Entwickler *eine* der Methoden zum Konsumieren von Daten auswählen und *niemals* mehrere Methoden verwenden, um Daten aus einem einzelnen Stream zu konsumieren. Insbesondere die Verwendung einer Kombination aus `on('data')`, `on('readable')`, `pipe()` oder asynchronen Iteratoren kann zu unintuitivem Verhalten führen.


#### Klasse: `stream.Readable` {#class-streamreadable}

**Hinzugefügt in: v0.9.4**

##### Ereignis: `'close'` {#event-close_1}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Füge die `emitClose`-Option hinzu, um anzugeben, ob `'close'` beim Zerstören ausgegeben wird. |
| v0.9.4 | Hinzugefügt in: v0.9.4 |
:::

Das Ereignis `'close'` wird ausgelöst, wenn der Stream und alle seine zugrunde liegenden Ressourcen (z. B. ein Dateideskriptor) geschlossen wurden. Das Ereignis gibt an, dass keine weiteren Ereignisse mehr ausgelöst werden und keine weiteren Berechnungen mehr stattfinden.

Ein [`Readable`](/de/nodejs/api/stream#class-streamreadable)-Stream löst immer das Ereignis `'close'` aus, wenn er mit der Option `emitClose` erstellt wird.

##### Ereignis: `'data'` {#event-data}

**Hinzugefügt in: v0.9.4**

- `chunk` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Der Datenblock. Für Streams, die nicht im Objektmodus arbeiten, ist der Datenblock entweder eine Zeichenkette oder ein `Buffer`. Für Streams, die sich im Objektmodus befinden, kann der Datenblock ein beliebiger JavaScript-Wert außer `null` sein.

Das Ereignis `'data'` wird ausgelöst, wenn der Stream das Eigentum an einem Datenblock an einen Konsumenten abgibt. Dies kann vorkommen, wenn der Stream durch Aufrufen von `readable.pipe()`, `readable.resume()` oder durch Anhängen eines Listener-Callbacks an das Ereignis `'data'` in den fließenden Modus versetzt wird. Das Ereignis `'data'` wird auch ausgelöst, wenn die Methode `readable.read()` aufgerufen wird und ein Datenblock zur Rückgabe verfügbar ist.

Das Anhängen eines `'data'`-Ereignis-Listeners an einen Stream, der nicht explizit pausiert wurde, versetzt den Stream in den fließenden Modus. Die Daten werden dann so schnell wie möglich übergeben.

Der Listener-Callback erhält den Datenblock als Zeichenkette, wenn eine Standardkodierung für den Stream mit der Methode `readable.setEncoding()` angegeben wurde; andernfalls werden die Daten als `Buffer` übergeben.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
});
```

##### Event: `'end'` {#event-end}

**Hinzugefügt in: v0.9.4**

Das `'end'`-Ereignis wird ausgelöst, wenn keine weiteren Daten aus dem Stream konsumiert werden können.

Das `'end'`-Ereignis **wird nicht ausgelöst**, solange die Daten nicht vollständig konsumiert wurden. Dies kann erreicht werden, indem der Stream in den fließenden Modus versetzt wird oder indem [`stream.read()`](/de/nodejs/api/stream#readablereadsize) wiederholt aufgerufen wird, bis alle Daten konsumiert wurden.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Empfangen ${chunk.length} Bytes an Daten.`);
});
readable.on('end', () => {
  console.log('Es wird keine weiteren Daten geben.');
});
```
##### Event: `'error'` {#event-error_1}

**Hinzugefügt in: v0.9.4**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Das `'error'`-Ereignis kann von einer `Readable`-Implementierung jederzeit ausgelöst werden. Typischerweise kann dies auftreten, wenn der zugrunde liegende Stream aufgrund eines internen Fehlers keine Daten generieren kann oder wenn eine Stream-Implementierung versucht, einen ungültigen Datenblock zu übertragen.

Der Listener-Callback erhält ein einzelnes `Error`-Objekt.

##### Event: `'pause'` {#event-pause}

**Hinzugefügt in: v0.9.4**

Das `'pause'`-Ereignis wird ausgelöst, wenn [`stream.pause()`](/de/nodejs/api/stream#readablepause) aufgerufen wird und `readableFlowing` nicht `false` ist.

##### Event: `'readable'` {#event-readable}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Das `'readable'`-Ereignis wird immer im nächsten Tick nach dem Aufruf von `.push()` ausgelöst. |
| v10.0.0 | Die Verwendung von `'readable'` erfordert den Aufruf von `.read()`. |
| v0.9.4 | Hinzugefügt in: v0.9.4 |
:::

Das `'readable'`-Ereignis wird ausgelöst, wenn Daten zum Lesen aus dem Stream verfügbar sind, bis zum konfigurierten High Water Mark (`state.highWaterMark`). Effektiv gibt es an, dass der Stream neue Informationen im Puffer hat. Wenn Daten in diesem Puffer verfügbar sind, kann [`stream.read()`](/de/nodejs/api/stream#readablereadsize) aufgerufen werden, um diese Daten abzurufen. Darüber hinaus kann das `'readable'`-Ereignis auch ausgelöst werden, wenn das Ende des Streams erreicht wurde.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('readable', function() {
  // Es gibt jetzt Daten zum Lesen.
  let data;

  while ((data = this.read()) !== null) {
    console.log(data);
  }
});
```
Wenn das Ende des Streams erreicht wurde, gibt der Aufruf von [`stream.read()`](/de/nodejs/api/stream#readablereadsize) `null` zurück und löst das `'end'`-Ereignis aus. Dies gilt auch, wenn nie Daten zum Lesen vorhanden waren. Im folgenden Beispiel ist `foo.txt` beispielsweise eine leere Datei:

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
Die Ausgabe der Ausführung dieses Skripts ist:

```bash [BASH]
$ node test.js
readable: null
end
```
In einigen Fällen führt das Anhängen eines Listeners für das `'readable'`-Ereignis dazu, dass eine bestimmte Datenmenge in einen internen Puffer gelesen wird.

Im Allgemeinen sind die Mechanismen `readable.pipe()` und `'data'` einfacher zu verstehen als das `'readable'`-Ereignis. Die Behandlung von `'readable'` kann jedoch zu einem höheren Durchsatz führen.

Wenn sowohl `'readable'` als auch [`'data'`](/de/nodejs/api/stream#event-data) gleichzeitig verwendet werden, hat `'readable'` Vorrang bei der Steuerung des Flusses, d. h. `'data'` wird nur ausgelöst, wenn [`stream.read()`](/de/nodejs/api/stream#readablereadsize) aufgerufen wird. Die `readableFlowing`-Eigenschaft würde zu `false`. Wenn `'data'`-Listener vorhanden sind, wenn `'readable'` entfernt wird, beginnt der Stream zu fließen, d. h. `'data'`-Ereignisse werden ohne Aufruf von `.resume()` ausgelöst.


##### Ereignis: `'resume'` {#event-resume}

**Hinzugefügt in: v0.9.4**

Das `'resume'`-Ereignis wird ausgelöst, wenn [`stream.resume()`](/de/nodejs/api/stream#readableresume) aufgerufen wird und `readableFlowing` nicht `true` ist.

##### `readable.destroy([error])` {#readabledestroyerror}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.0.0 | Funktioniert als No-op für einen Stream, der bereits zerstört wurde. |
| v8.0.0 | Hinzugefügt in: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Fehler, der als Payload im `'error'`-Ereignis übergeben wird
- Gibt zurück: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Zerstört den Stream. Löst optional ein `'error'`-Ereignis aus und löst ein `'close'`-Ereignis aus (es sei denn, `emitClose` ist auf `false` gesetzt). Nach diesem Aufruf gibt der lesbare Stream alle internen Ressourcen frei und nachfolgende Aufrufe von `push()` werden ignoriert.

Sobald `destroy()` aufgerufen wurde, sind alle weiteren Aufrufe No-ops und es können keine weiteren Fehler außer von `_destroy()` als `'error'` ausgegeben werden.

Implementierer sollten diese Methode nicht überschreiben, sondern stattdessen [`readable._destroy()`](/de/nodejs/api/stream#readable_destroyerr-callback) implementieren.

##### `readable.closed` {#readableclosed}

**Hinzugefügt in: v18.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ist `true`, nachdem `'close'` ausgelöst wurde.

##### `readable.destroyed` {#readabledestroyed}

**Hinzugefügt in: v8.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ist `true`, nachdem [`readable.destroy()`](/de/nodejs/api/stream#readabledestroyerror) aufgerufen wurde.

##### `readable.isPaused()` {#readableispaused}

**Hinzugefügt in: v0.11.14**

- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Die Methode `readable.isPaused()` gibt den aktuellen Betriebszustand des `Readable` zurück. Dies wird hauptsächlich von dem Mechanismus verwendet, der der Methode `readable.pipe()` zugrunde liegt. In den meisten typischen Fällen gibt es keinen Grund, diese Methode direkt zu verwenden.

```js [ESM]
const readable = new stream.Readable();

readable.isPaused(); // === false
readable.pause();
readable.isPaused(); // === true
readable.resume();
readable.isPaused(); // === false
```

##### `readable.pause()` {#readablepause}

**Hinzugefügt in: v0.9.4**

- Gibt zurück: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Die `readable.pause()`-Methode bewirkt, dass ein Stream im fließenden Modus keine [`'data'`](/de/nodejs/api/stream#event-data)-Ereignisse mehr ausgibt und aus dem fließenden Modus heraustritt. Alle verfügbaren Daten verbleiben im internen Puffer.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
  readable.pause();
  console.log('There will be no additional data for 1 second.');
  setTimeout(() => {
    console.log('Now data will start flowing again.');
    readable.resume();
  }, 1000);
});
```
Die `readable.pause()`-Methode hat keine Wirkung, wenn ein `'readable'`-Ereignis-Listener vorhanden ist.

##### `readable.pipe(destination[, options])` {#readablepipedestination-options}

**Hinzugefügt in: v0.9.4**

- `destination` [\<stream.Writable\>](/de/nodejs/api/stream#class-streamwritable) Das Ziel zum Schreiben von Daten
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Pipe-Optionen
    - `end` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Beendet den Writer, wenn der Reader endet. **Standard:** `true`.
  
 
- Gibt zurück: [\<stream.Writable\>](/de/nodejs/api/stream#class-streamwritable) Die *Destination*, die eine Kette von Pipes ermöglicht, wenn es sich um einen [`Duplex`](/de/nodejs/api/stream#class-streamduplex)- oder einen [`Transform`](/de/nodejs/api/stream#class-streamtransform)-Stream handelt.

Die Methode `readable.pipe()` hängt einen [`Writable`](/de/nodejs/api/stream#class-streamwritable)-Stream an den `readable`-Stream an, wodurch dieser automatisch in den fließenden Modus wechselt und alle seine Daten an den angehängten [`Writable`](/de/nodejs/api/stream#class-streamwritable)-Stream weiterleitet. Der Datenfluss wird automatisch so gesteuert, dass der Ziel-`Writable`-Stream nicht von einem schnelleren `Readable`-Stream überlastet wird.

Das folgende Beispiel leitet alle Daten vom `readable`-Stream in eine Datei namens `file.txt`:

```js [ESM]
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// All the data from readable goes into 'file.txt'.
readable.pipe(writable);
```
Es ist möglich, mehrere `Writable`-Streams an einen einzigen `Readable`-Stream anzuhängen.

Die Methode `readable.pipe()` gibt eine Referenz auf den *Ziel*-Stream zurück, wodurch es möglich ist, Ketten von Pipe-Streams einzurichten:

```js [ESM]
const fs = require('node:fs');
const zlib = require('node:zlib');
const r = fs.createReadStream('file.txt');
const z = zlib.createGzip();
const w = fs.createWriteStream('file.txt.gz');
r.pipe(z).pipe(w);
```
Standardmäßig wird [`stream.end()`](/de/nodejs/api/stream#writableendchunk-encoding-callback) auf dem Ziel-`Writable`-Stream aufgerufen, wenn der Quell-`Readable`-Stream [`'end'`](/de/nodejs/api/stream#event-end) ausgibt, sodass das Ziel nicht mehr beschreibbar ist. Um dieses Standardverhalten zu deaktivieren, kann die Option `end` als `false` übergeben werden, wodurch der Ziel-Stream offen bleibt:

```js [ESM]
reader.pipe(writer, { end: false });
reader.on('end', () => {
  writer.end('Goodbye\n');
});
```
Ein wichtiger Vorbehalt ist, dass, wenn der `Readable`-Stream während der Verarbeitung einen Fehler ausgibt, das `Writable`-Ziel *nicht automatisch geschlossen wird*. Wenn ein Fehler auftritt, ist es notwendig, jeden Stream *manuell* zu schließen, um Speicherlecks zu vermeiden.

Die `Writable`-Streams [`process.stderr`](/de/nodejs/api/process#processstderr) und [`process.stdout`](/de/nodejs/api/process#processstdout) werden erst geschlossen, wenn der Node.js-Prozess beendet wird, unabhängig von den angegebenen Optionen.


##### `readable.read([size])` {#readablereadsize}

**Hinzugefügt in: v0.9.4**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Optionales Argument, um anzugeben, wie viele Daten gelesen werden sollen.
- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Die Methode `readable.read()` liest Daten aus dem internen Puffer und gibt sie zurück. Wenn keine Daten zum Lesen verfügbar sind, wird `null` zurückgegeben. Standardmäßig werden die Daten als `Buffer`-Objekt zurückgegeben, es sei denn, eine Codierung wurde mit der Methode `readable.setEncoding()` angegeben oder der Stream arbeitet im Objektmodus.

Das optionale Argument `size` gibt eine bestimmte Anzahl von Bytes an, die gelesen werden sollen. Wenn `size` Bytes nicht zum Lesen verfügbar sind, wird `null` zurückgegeben, *es sei denn*, der Stream ist beendet. In diesem Fall werden alle im internen Puffer verbleibenden Daten zurückgegeben.

Wenn das Argument `size` nicht angegeben wird, werden alle im internen Puffer enthaltenen Daten zurückgegeben.

Das Argument `size` muss kleiner oder gleich 1 GiB sein.

Die Methode `readable.read()` sollte nur für `Readable`-Streams aufgerufen werden, die im pausierten Modus arbeiten. Im fließenden Modus wird `readable.read()` automatisch aufgerufen, bis der interne Puffer vollständig geleert ist.

```js [ESM]
const readable = getReadableStreamSomehow();

// 'readable' kann mehrmals ausgelöst werden, da Daten im Puffer zwischengespeichert werden
readable.on('readable', () => {
  let chunk;
  console.log('Stream ist lesbar (neue Daten im Puffer empfangen)');
  // Verwenden Sie eine Schleife, um sicherzustellen, dass wir alle aktuell verfügbaren Daten lesen
  while (null !== (chunk = readable.read())) {
    console.log(`Habe ${chunk.length} Bytes an Daten gelesen...`);
  }
});

// 'end' wird einmal ausgelöst, wenn keine Daten mehr verfügbar sind
readable.on('end', () => {
  console.log('Ende des Streams erreicht.');
});
```
Jeder Aufruf von `readable.read()` gibt einen Datenblock oder `null` zurück, was bedeutet, dass im Moment keine weiteren Daten zum Lesen vorhanden sind. Diese Chunks werden nicht automatisch verkettet. Da ein einzelner `read()`-Aufruf nicht alle Daten zurückgibt, kann die Verwendung einer While-Schleife erforderlich sein, um kontinuierlich Chunks zu lesen, bis alle Daten abgerufen wurden. Beim Lesen einer großen Datei kann `.read()` vorübergehend `null` zurückgeben, was darauf hindeutet, dass alle zwischengespeicherten Inhalte verbraucht wurden, aber möglicherweise noch weitere Daten zwischengespeichert werden müssen. In solchen Fällen wird ein neues `'readable'`-Ereignis ausgelöst, sobald sich weitere Daten im Puffer befinden, und das `'end'`-Ereignis signalisiert das Ende der Datenübertragung.

Um also den gesamten Inhalt einer Datei aus einem `readable` zu lesen, ist es notwendig, Chunks über mehrere `'readable'`-Ereignisse zu sammeln:

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
Ein `Readable`-Stream im Objektmodus gibt immer ein einzelnes Element von einem Aufruf von [`readable.read(size)`](/de/nodejs/api/stream#readablereadsize) zurück, unabhängig vom Wert des Arguments `size`.

Wenn die Methode `readable.read()` einen Datenblock zurückgibt, wird auch ein `'data'`-Ereignis ausgelöst.

Der Aufruf von [`stream.read([size])`](/de/nodejs/api/stream#readablereadsize) nachdem das [`'end'`](/de/nodejs/api/stream#event-end)-Ereignis ausgelöst wurde, gibt `null` zurück. Es wird kein Laufzeitfehler ausgelöst.


##### `readable.readable` {#readablereadable}

**Hinzugefügt in: v11.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ist `true`, wenn es sicher ist, [`readable.read()`](/de/nodejs/api/stream#readablereadsize) aufzurufen, was bedeutet, dass der Stream nicht zerstört wurde oder `'error'` oder `'end'` ausgegeben hat.

##### `readable.readableAborted` {#readablereadableaborted}

**Hinzugefügt in: v16.8.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt zurück, ob der Stream zerstört wurde oder ein Fehler aufgetreten ist, bevor `'end'` ausgegeben wurde.

##### `readable.readableDidRead` {#readablereadabledidread}

**Hinzugefügt in: v16.7.0, v14.18.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt zurück, ob `'data'` ausgegeben wurde.

##### `readable.readableEncoding` {#readablereadableencoding}

**Hinzugefügt in: v12.7.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Getter für die Eigenschaft `encoding` eines gegebenen `Readable`-Streams. Die Eigenschaft `encoding` kann mit der Methode [`readable.setEncoding()`](/de/nodejs/api/stream#readablesetencodingencoding) gesetzt werden.

##### `readable.readableEnded` {#readablereadableended}

**Hinzugefügt in: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wird `true`, wenn das [`'end'`](/de/nodejs/api/stream#event-end)-Ereignis ausgegeben wird.

##### `readable.errored` {#readableerrored}

**Hinzugefügt in: v18.0.0**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Gibt einen Fehler zurück, wenn der Stream mit einem Fehler zerstört wurde.

##### `readable.readableFlowing` {#readablereadableflowing}

**Hinzugefügt in: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Diese Eigenschaft spiegelt den aktuellen Zustand eines `Readable`-Streams wider, wie im Abschnitt [Drei Zustände](/de/nodejs/api/stream#three-states) beschrieben.


##### `readable.readableHighWaterMark` {#readablereadablehighwatermark}

**Hinzugefügt in: v9.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Gibt den Wert von `highWaterMark` zurück, der bei der Erstellung dieses `Readable`-Objekts übergeben wurde.

##### `readable.readableLength` {#readablereadablelength}

**Hinzugefügt in: v9.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Diese Eigenschaft enthält die Anzahl der Bytes (oder Objekte) in der Warteschlange, die zum Lesen bereitstehen. Der Wert liefert Introspektionsdaten bezüglich des Status von `highWaterMark`.

##### `readable.readableObjectMode` {#readablereadableobjectmode}

**Hinzugefügt in: v12.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/JavaScript/Data_structures#Boolean_type)

Getter für die Eigenschaft `objectMode` eines gegebenen `Readable`-Streams.

##### `readable.resume()` {#readableresume}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Die `resume()`-Methode hat keine Auswirkung, wenn ein `'readable'`-Ereignis abgehört wird. |
| v0.9.4 | Hinzugefügt in: v0.9.4 |
:::

- Gibt zurück: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Die `readable.resume()`-Methode bewirkt, dass ein explizit pausierter `Readable`-Stream wieder [`'data'`](/de/nodejs/api/stream#event-data)-Ereignisse ausgibt und den Stream in den fließenden Modus schaltet.

Die `readable.resume()`-Methode kann verwendet werden, um die Daten aus einem Stream vollständig zu verbrauchen, ohne diese Daten tatsächlich zu verarbeiten:

```js [ESM]
getReadableStreamSomehow()
  .resume()
  .on('end', () => {
    console.log('Ende erreicht, aber nichts gelesen.');
  });
```
Die `readable.resume()`-Methode hat keine Auswirkung, wenn ein `'readable'`-Ereignis-Listener vorhanden ist.

##### `readable.setEncoding(encoding)` {#readablesetencodingencoding}

**Hinzugefügt in: v0.9.4**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die zu verwendende Kodierung.
- Gibt zurück: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Die `readable.setEncoding()`-Methode legt die Zeichenkodierung für Daten fest, die aus dem `Readable`-Stream gelesen werden.

Standardmäßig ist keine Kodierung zugewiesen, und Stream-Daten werden als `Buffer`-Objekte zurückgegeben. Das Festlegen einer Kodierung bewirkt, dass die Stream-Daten als Strings der angegebenen Kodierung und nicht als `Buffer`-Objekte zurückgegeben werden. Beispielsweise bewirkt der Aufruf von `readable.setEncoding('utf8')`, dass die Ausgabedaten als UTF-8-Daten interpretiert und als Strings übergeben werden. Der Aufruf von `readable.setEncoding('hex')` bewirkt, dass die Daten im hexadezimalen Stringformat kodiert werden.

Der `Readable`-Stream verarbeitet Multibyte-Zeichen, die über den Stream geliefert werden, ordnungsgemäß, die andernfalls falsch dekodiert würden, wenn sie einfach als `Buffer`-Objekte aus dem Stream gezogen würden.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.setEncoding('utf8');
readable.on('data', (chunk) => {
  assert.equal(typeof chunk, 'string');
  console.log('Habe %d Zeichen Stringdaten erhalten:', chunk.length);
});
```

##### `readable.unpipe([destination])` {#readableunpipedestination}

**Hinzugefügt in: v0.9.4**

- `destination` [\<stream.Writable\>](/de/nodejs/api/stream#class-streamwritable) Optionaler spezifischer Stream, der vom Pipe entfernt werden soll
- Gibt zurück: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Die Methode `readable.unpipe()` trennt einen `Writable`-Stream, der zuvor mit der Methode [`stream.pipe()`](/de/nodejs/api/stream#readablepipedestination-options) verbunden wurde.

Wenn `destination` nicht angegeben ist, werden *alle* Pipes getrennt.

Wenn `destination` angegeben ist, aber keine Pipe dafür eingerichtet ist, tut die Methode nichts.

```js [ESM]
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// Alle Daten von readable gehen in 'file.txt',
// aber nur für die erste Sekunde.
readable.pipe(writable);
setTimeout(() => {
  console.log('Schreibe nicht mehr in file.txt.');
  readable.unpipe(writable);
  console.log('Dateistream manuell schließen.');
  writable.end();
}, 1000);
```
##### `readable.unshift(chunk[, encoding])` {#readableunshiftchunk-encoding}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.0.0, v20.13.0 | Das Argument `chunk` kann jetzt eine `TypedArray`- oder `DataView`-Instanz sein. |
| v8.0.0 | Das Argument `chunk` kann jetzt eine `Uint8Array`-Instanz sein. |
| v0.9.11 | Hinzugefügt in: v0.9.11 |
:::

- `chunk` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Datenchunk, der in die Lesewarteschlange zurückgeschoben werden soll. Für Streams, die nicht im Objektmodus arbeiten, muss `chunk` ein [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/de/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) oder `null` sein. Für Objektmodus-Streams kann `chunk` ein beliebiger JavaScript-Wert sein.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Kodierung von String-Chunks. Muss eine gültige `Buffer`-Kodierung sein, z. B. `'utf8'` oder `'ascii'`.

Die Übergabe von `chunk` als `null` signalisiert das Ende des Streams (EOF) und verhält sich genauso wie `readable.push(null)`, wonach keine Daten mehr geschrieben werden können. Das EOF-Signal wird am Ende des Puffers platziert und alle gepufferten Daten werden weiterhin geleert.

Die Methode `readable.unshift()` schiebt einen Datenchunk zurück in den internen Puffer. Dies ist in bestimmten Situationen nützlich, in denen ein Stream von Code verarbeitet wird, der eine gewisse Datenmenge, die er optimistisch aus der Quelle entnommen hat, "rückgängig machen" muss, damit die Daten an eine andere Partei weitergegeben werden können.

Die Methode `stream.unshift(chunk)` kann nicht aufgerufen werden, nachdem das Ereignis [`'end'`](/de/nodejs/api/stream#event-end) ausgelöst wurde, da sonst ein Laufzeitfehler ausgelöst wird.

Entwickler, die `stream.unshift()` verwenden, sollten stattdessen die Verwendung eines [`Transform`](/de/nodejs/api/stream#class-streamtransform)-Streams in Betracht ziehen. Weitere Informationen finden Sie im Abschnitt [API für Stream-Implementierer](/de/nodejs/api/stream#api-for-stream-implementers).

```js [ESM]
// Einen Header, der durch \n\n begrenzt wird, abziehen.
// Verwende unshift(), wenn wir zu viel bekommen.
// Rufe den Callback mit (error, header, stream) auf.
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
        // Die Header-Grenze wurde gefunden.
        const split = str.split(/\n\n/);
        header += split.shift();
        const remaining = split.join('\n\n');
        const buf = Buffer.from(remaining, 'utf8');
        stream.removeListener('error', callback);
        // Entferne den 'readable'-Listener vor dem Unshifting.
        stream.removeListener('readable', onReadable);
        if (buf.length)
          stream.unshift(buf);
        // Jetzt kann der Body der Nachricht aus dem Stream gelesen werden.
        callback(null, header, stream);
        return;
      }
      // Der Header wird noch gelesen.
      header += str;
    }
  }
}
```
Im Gegensatz zu [`stream.push(chunk)`](/de/nodejs/api/stream#readablepushchunk-encoding) beendet `stream.unshift(chunk)` den Leseprozess nicht, indem der interne Lesestatus des Streams zurückgesetzt wird. Dies kann zu unerwarteten Ergebnissen führen, wenn `readable.unshift()` während eines Lesevorgangs aufgerufen wird (d. h. innerhalb einer [`stream._read()`](/de/nodejs/api/stream#readable_readsize)-Implementierung in einem benutzerdefinierten Stream). Das Aufrufen von `stream.push('')`](/de/nodejs/api/stream#readablepushchunk-encoding) unmittelbar nach dem Aufruf von `readable.unshift()` setzt den Lesestatus jedoch entsprechend zurück, aber es ist am besten, den Aufruf von `readable.unshift()` zu vermeiden, während ein Lesevorgang durchgeführt wird.


##### `readable.wrap(stream)` {#readablewrapstream}

**Hinzugefügt in: v0.9.4**

- `stream` [\<Stream\>](/de/nodejs/api/stream#stream) Ein "alter Stil" lesbarer Stream
- Gibt zurück: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Vor Node.js 0.10 implementierten Streams nicht die gesamte `node:stream` Modul-API, wie sie derzeit definiert ist. (Siehe [Kompatibilität](/de/nodejs/api/stream#compatibility-with-older-nodejs-versions) für weitere Informationen.)

Wenn eine ältere Node.js-Bibliothek verwendet wird, die [`'data'`](/de/nodejs/api/stream#event-data)-Ereignisse ausgibt und eine [`stream.pause()`](/de/nodejs/api/stream#readablepause)-Methode hat, die nur beratend ist, kann die `readable.wrap()`-Methode verwendet werden, um einen [`Readable`](/de/nodejs/api/stream#class-streamreadable)-Stream zu erstellen, der den alten Stream als Datenquelle verwendet.

Es wird selten notwendig sein, `readable.wrap()` zu verwenden, aber die Methode wurde als Komfortfunktion für die Interaktion mit älteren Node.js-Anwendungen und -Bibliotheken bereitgestellt.

```js [ESM]
const { OldReader } = require('./old-api-module.js');
const { Readable } = require('node:stream');
const oreader = new OldReader();
const myReader = new Readable().wrap(oreader);

myReader.on('readable', () => {
  myReader.read(); // usw.
});
```
##### `readable[Symbol.asyncIterator]()` {#readablesymbolasynciterator}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v11.14.0 | Symbol.asyncIterator-Unterstützung ist nicht mehr experimentell. |
| v10.0.0 | Hinzugefügt in: v10.0.0 |
:::

- Gibt zurück: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) um den Stream vollständig zu verbrauchen.

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
Wenn die Schleife mit einem `break`, `return` oder einem `throw` beendet wird, wird der Stream zerstört. Mit anderen Worten, die Iteration über einen Stream verbraucht den Stream vollständig. Der Stream wird in Chunks der Größe gelesen, die der Option `highWaterMark` entspricht. Im obigen Codebeispiel befinden sich die Daten in einem einzigen Chunk, wenn die Datei weniger als 64 KiB Daten enthält, da keine `highWaterMark`-Option für [`fs.createReadStream()`](/de/nodejs/api/fs#fscreatereadstreampath-options) bereitgestellt wird.


##### `readable[Symbol.asyncDispose]()` {#readablesymbolasyncdispose}

**Hinzugefügt in: v20.4.0, v18.18.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Ruft [`readable.destroy()`](/de/nodejs/api/stream#readabledestroyerror) mit einem `AbortError` auf und gibt ein Promise zurück, das erfüllt wird, wenn der Stream beendet ist.

##### `readable.compose(stream[, options])` {#readablecomposestream-options}

**Hinzugefügt in: v19.1.0, v18.13.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `stream` [\<Stream\>](/de/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) ermöglicht das Zerstören des Streams, wenn das Signal abgebrochen wird.


- Gibt zurück: [\<Duplex\>](/de/nodejs/api/stream#class-streamduplex) ein Stream, der mit dem Stream `stream` zusammengesetzt ist.

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
Weitere Informationen finden Sie unter [`stream.compose`](/de/nodejs/api/stream#streamcomposestreams).

##### `readable.iterator([options])` {#readableiteratoroptions}

**Hinzugefügt in: v16.3.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `destroyOnReturn` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf `false` gesetzt, wird das Aufrufen von `return` für den Async-Iterator oder das Beenden einer `for await...of`-Iteration mit `break`, `return` oder `throw` den Stream nicht zerstören. **Standard:** `true`.


- Gibt zurück: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) zum Konsumieren des Streams.

Der von dieser Methode erstellte Iterator gibt Benutzern die Möglichkeit, die Zerstörung des Streams abzubrechen, wenn die `for await...of`-Schleife durch `return`, `break` oder `throw` beendet wird, oder wenn der Iterator den Stream zerstören soll, falls der Stream während der Iteration einen Fehler ausgibt.

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

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.7.0, v18.19.0 | `highWaterMark` in Optionen hinzugefügt. |
| v17.4.0, v16.14.0 | Hinzugefügt in: v17.4.0, v16.14.0 |
:::

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `fn` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Eine Funktion, die über jeden Chunk im Stream gemappt werden soll.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Ein Datenchunk aus dem Stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Wird abgebrochen, wenn der Stream zerstört wird, wodurch der `fn`-Aufruf frühzeitig abgebrochen werden kann.

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die maximale Anzahl gleichzeitiger Aufrufe von `fn`, die gleichzeitig für den Stream aufgerufen werden sollen. **Standard:** `1`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wie viele Elemente zwischengespeichert werden sollen, während auf den Konsum der gemappten Elemente durch den Benutzer gewartet wird. **Standard:** `concurrency * 2 - 1`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ermöglicht das Zerstören des Streams, wenn das Signal abgebrochen wird.

- Gibt zurück: [\<Readable\>](/de/nodejs/api/stream#class-streamreadable) Ein Stream, der mit der Funktion `fn` gemappt wurde.

Diese Methode ermöglicht das Mappen über den Stream. Die Funktion `fn` wird für jeden Chunk im Stream aufgerufen. Wenn die Funktion `fn` ein Promise zurückgibt, wird auf dieses Promise `await` gewartet, bevor es an den Ergebnisstream übergeben wird.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// Mit einem synchronen Mapper.
for await (const chunk of Readable.from([1, 2, 3, 4]).map((x) => x * 2)) {
  console.log(chunk); // 2, 4, 6, 8
}
// Mit einem asynchronen Mapper, der maximal 2 Abfragen gleichzeitig durchführt.
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map((domain) => resolver.resolve4(domain), { concurrency: 2 });
for await (const result of dnsResults) {
  console.log(result); // Protokolliert das DNS-Ergebnis von resolver.resolve4.
}
```

##### `readable.filter(fn[, options])` {#readablefilterfn-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.7.0, v18.19.0 | `highWaterMark` in Optionen hinzugefügt. |
| v17.4.0, v16.14.0 | Hinzugefügt in: v17.4.0, v16.14.0 |
:::

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `fn` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Eine Funktion zum Filtern von Chunks aus dem Stream.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Ein Daten-Chunk aus dem Stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Wird abgebrochen, wenn der Stream zerstört wird, wodurch der `fn`-Aufruf frühzeitig abgebrochen werden kann.

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die maximale Anzahl gleichzeitiger Aufrufe von `fn`, die gleichzeitig auf dem Stream aufgerufen werden sollen. **Standard:** `1`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wie viele Elemente gepuffert werden sollen, während auf den Benutzerverbrauch der gefilterten Elemente gewartet wird. **Standard:** `concurrency * 2 - 1`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ermöglicht das Zerstören des Streams, wenn das Signal abgebrochen wird.

- Gibt zurück: [\<Readable\>](/de/nodejs/api/stream#class-streamreadable) Ein Stream, der mit dem Prädikat `fn` gefiltert wurde.

Diese Methode ermöglicht das Filtern des Streams. Für jeden Chunk im Stream wird die Funktion `fn` aufgerufen, und wenn sie einen Truthy-Wert zurückgibt, wird der Chunk an den Ergebnis-Stream übergeben. Wenn die Funktion `fn` ein Promise zurückgibt, wird dieses Promise `await`ed.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// Mit einem synchronen Prädikat.
for await (const chunk of Readable.from([1, 2, 3, 4]).filter((x) => x > 2)) {
  console.log(chunk); // 3, 4
}
// Mit einem asynchronen Prädikat, das maximal 2 Abfragen gleichzeitig durchführt.
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
  // Protokolliert Domains mit mehr als 60 Sekunden im aufgelösten DNS-Eintrag.
  console.log(result);
}
```

##### `readable.forEach(fn[, options])` {#readableforeachfn-options}

**Hinzugefügt in: v17.5.0, v16.15.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Eine Funktion, die für jeden Chunk des Streams aufgerufen wird.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Ein Datenchunk aus dem Stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Wird abgebrochen, wenn der Stream zerstört wird, wodurch der `fn`-Aufruf frühzeitig abgebrochen werden kann.
  
 
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die maximale Anzahl gleichzeitiger Aufrufe von `fn`, die gleichzeitig im Stream aufgerufen werden sollen. **Standard:** `1`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ermöglicht das Zerstören des Streams, wenn das Signal abgebrochen wird.
  
 
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Eine Promise dafür, wann der Stream abgeschlossen ist.

Diese Methode ermöglicht das Iterieren eines Streams. Für jeden Chunk im Stream wird die Funktion `fn` aufgerufen. Wenn die Funktion `fn` eine Promise zurückgibt, wird diese Promise `await`ed.

Diese Methode unterscheidet sich von `for await...of`-Schleifen darin, dass sie optional Chunks gleichzeitig verarbeiten kann. Darüber hinaus kann eine `forEach`-Iteration nur durch Übergabe einer `signal`-Option und Abbrechen des zugehörigen `AbortController` gestoppt werden, während `for await...of` mit `break` oder `return` gestoppt werden kann. In beiden Fällen wird der Stream zerstört.

Diese Methode unterscheidet sich vom Abhören des [`'data'`](/de/nodejs/api/stream#event-data)-Ereignisses darin, dass sie das [`readable`](/de/nodejs/api/stream#class-streamreadable)-Ereignis im zugrunde liegenden Mechanismus verwendet und die Anzahl gleichzeitiger `fn`-Aufrufe begrenzen kann.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// Mit einem synchronen Prädikat.
for await (const chunk of Readable.from([1, 2, 3, 4]).filter((x) => x > 2)) {
  console.log(chunk); // 3, 4
}
// Mit einem asynchronen Prädikat, das maximal 2 Abfragen gleichzeitig durchführt.
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
  // Protokolliert das Ergebnis, ähnlich wie `for await (const result of dnsResults)`
  console.log(result);
});
console.log('done'); // Stream ist abgeschlossen
```

##### `readable.toArray([options])` {#readabletoarrayoptions}

**Hinzugefügt in: v17.5.0, v16.15.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) ermöglicht das Abbrechen der toArray-Operation, wenn das Signal abgebrochen wird.


- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ein Promise, das ein Array mit dem Inhalt des Streams enthält.

Diese Methode ermöglicht das einfache Abrufen des Inhalts eines Streams.

Da diese Methode den gesamten Stream in den Speicher liest, werden die Vorteile von Streams zunichte gemacht. Sie ist für Interoperabilität und Bequemlichkeit gedacht, nicht als primäre Methode zum Konsumieren von Streams.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

await Readable.from([1, 2, 3, 4]).toArray(); // [1, 2, 3, 4]

// DNS-Abfragen gleichzeitig mit .map durchführen und
// die Ergebnisse mit toArray in einem Array sammeln
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

**Hinzugefügt in: v17.5.0, v16.15.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) eine Funktion, die für jeden Chunk des Streams aufgerufen wird.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) ein Datenchunk aus dem Stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) wird abgebrochen, wenn der Stream zerstört wird, wodurch der `fn`-Aufruf frühzeitig abgebrochen werden kann.


- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) die maximale Anzahl gleichzeitiger Aufrufe von `fn`, die gleichzeitig für den Stream aufgerufen werden sollen. **Standard:** `1`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) ermöglicht das Zerstören des Streams, wenn das Signal abgebrochen wird.


- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ein Promise, das zu `true` ausgewertet wird, wenn `fn` für mindestens einen der Chunks einen Truthy-Wert zurückgegeben hat.

Diese Methode ähnelt `Array.prototype.some` und ruft `fn` für jeden Chunk im Stream auf, bis der erwartete Rückgabewert `true` (oder ein beliebiger Truthy-Wert) ist. Sobald ein `fn`-Aufruf für einen Chunk erwarteten Rückgabewert Truthy ist, wird der Stream zerstört und das Promise wird mit `true` erfüllt. Wenn keiner der `fn`-Aufrufe für die Chunks einen Truthy-Wert zurückgibt, wird das Promise mit `false` erfüllt.

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// Mit einem synchronen Prädikat.
await Readable.from([1, 2, 3, 4]).some((x) => x > 2); // true
await Readable.from([1, 2, 3, 4]).some((x) => x < 0); // false

// Mit einem asynchronen Prädikat, das maximal 2 Dateiprüfungen gleichzeitig durchführt.
const anyBigFile = await Readable.from([
  'file1',
  'file2',
  'file3',
]).some(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
console.log(anyBigFile); // `true`, wenn eine Datei in der Liste größer als 1 MB ist
console.log('done'); // Stream ist beendet
```

##### `readable.find(fn[, options])` {#readablefindfn-options}

**Hinzugefügt in: v17.5.0, v16.17.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Eine Funktion, die für jeden Chunk des Streams aufgerufen wird.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Ein Daten-Chunk aus dem Stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Wird abgebrochen, wenn der Stream zerstört wird, wodurch der `fn`-Aufruf frühzeitig abgebrochen werden kann.




- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die maximale Anzahl gleichzeitiger Aufrufe von `fn`, die gleichzeitig für den Stream aufgerufen werden sollen. **Standard:** `1`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ermöglicht das Zerstören des Streams, wenn das Signal abgebrochen wird.


- Rückgabe: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Ein Promise, das zu dem ersten Chunk ausgewertet wird, für den `fn` mit einem Truthy-Wert ausgewertet wurde, oder `undefined`, wenn kein Element gefunden wurde.

Diese Methode ähnelt `Array.prototype.find` und ruft `fn` für jeden Chunk im Stream auf, um einen Chunk mit einem Truthy-Wert für `fn` zu finden. Sobald der erwartete Rückgabewert eines `fn`-Aufrufs truthy ist, wird der Stream zerstört und das Promise mit dem Wert erfüllt, für den `fn` einen Truthy-Wert zurückgegeben hat. Wenn alle `fn`-Aufrufe für die Chunks einen Falsy-Wert zurückgeben, wird das Promise mit `undefined` erfüllt.

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// Mit einem synchronen Prädikat.
await Readable.from([1, 2, 3, 4]).find((x) => x > 2); // 3
await Readable.from([1, 2, 3, 4]).find((x) => x > 0); // 1
await Readable.from([1, 2, 3, 4]).find((x) => x > 10); // undefined

// Mit einem asynchronen Prädikat, wobei maximal 2 Dateiüberprüfungen gleichzeitig durchgeführt werden.
const foundBigFile = await Readable.from([
  'file1',
  'file2',
  'file3',
]).find(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
console.log(foundBigFile); // Dateiname der großen Datei, wenn eine Datei in der Liste größer als 1 MB ist
console.log('done'); // Stream ist abgeschlossen
```

##### `readable.every(fn[, options])` {#readableeveryfn-options}

**Hinzugefügt in: v17.5.0, v16.15.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `fn` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Eine Funktion, die für jeden Chunk des Streams aufgerufen wird.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Ein Daten-Chunk aus dem Stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) wird abgebrochen, wenn der Stream zerstört wird, wodurch der `fn`-Aufruf frühzeitig abgebrochen werden kann.




- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die maximale Anzahl gleichzeitiger Aufrufe von `fn`, die gleichzeitig auf dem Stream aufgerufen werden sollen. **Standard:** `1`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) ermöglicht das Zerstören des Streams, wenn das Signal abgebrochen wird.


- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Ein Promise, das zu `true` ausgewertet wird, wenn `fn` für alle Chunks einen Truthy-Wert zurückgegeben hat.

Diese Methode ähnelt `Array.prototype.every` und ruft `fn` für jeden Chunk im Stream auf, um zu prüfen, ob alle erwarteten Rückgabewerte für `fn` einen Truthy-Wert haben. Sobald ein `fn`-Aufruf auf einem Chunk-Erwartungswert einen Falsy-Wert zurückgibt, wird der Stream zerstört und das Promise wird mit `false` erfüllt. Wenn alle `fn`-Aufrufe auf den Chunks einen Truthy-Wert zurückgeben, wird das Promise mit `true` erfüllt.

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// Mit einem synchronen Prädikat.
await Readable.from([1, 2, 3, 4]).every((x) => x > 2); // false
await Readable.from([1, 2, 3, 4]).every((x) => x > 0); // true

// Mit einem asynchronen Prädikat, das maximal 2 Dateiüberprüfungen gleichzeitig durchführt.
const allBigFiles = await Readable.from([
  'file1',
  'file2',
  'file3',
]).every(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
// `true`, wenn alle Dateien in der Liste größer als 1MiB sind
console.log(allBigFiles);
console.log('done'); // Stream ist beendet
```

##### `readable.flatMap(fn[, options])` {#readableflatmapfn-options}

**Hinzugefügt in: v17.5.0, v16.15.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `fn` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncGeneratorFunction\>](https://tc39.es/proposal-async-iteration/#sec-asyncgeneratorfunction-constructor) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Eine Funktion, die auf jeden Chunk im Stream angewendet wird.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Ein Daten-Chunk aus dem Stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Wird abgebrochen, wenn der Stream zerstört wird, wodurch der Aufruf von `fn` frühzeitig abgebrochen werden kann.




- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die maximale Anzahl gleichzeitiger Aufrufe von `fn`, die gleichzeitig auf den Stream angewendet werden. **Standard:** `1`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ermöglicht das Zerstören des Streams, wenn das Signal abgebrochen wird.


- Gibt zurück: [\<Readable\>](/de/nodejs/api/stream#class-streamreadable) Ein Stream, der mit der Funktion `fn` flach abgebildet wurde.

Diese Methode gibt einen neuen Stream zurück, indem der gegebene Callback auf jeden Chunk des Streams angewendet und dann das Ergebnis geglättet wird.

Es ist möglich, einen Stream oder eine andere Iterable oder Async Iterable von `fn` zurückzugeben, und die Ergebnis-Streams werden in den zurückgegebenen Stream zusammengeführt (geglättet).

```js [ESM]
import { Readable } from 'node:stream';
import { createReadStream } from 'node:fs';

// Mit einem synchronen Mapper.
for await (const chunk of Readable.from([1, 2, 3, 4]).flatMap((x) => [x, x])) {
  console.log(chunk); // 1, 1, 2, 2, 3, 3, 4, 4
}
// Mit einem asynchronen Mapper, kombiniere den Inhalt von 4 Dateien
const concatResult = Readable.from([
  './1.mjs',
  './2.mjs',
  './3.mjs',
  './4.mjs',
]).flatMap((fileName) => createReadStream(fileName));
for await (const result of concatResult) {
  // Dies enthält den Inhalt (alle Chunks) aller 4 Dateien
  console.log(result);
}
```

##### `readable.drop(limit[, options])` {#readabledroplimit-options}

**Hinzugefügt in: v17.5.0, v16.15.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `limit` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) die Anzahl der Chunks, die aus dem Readable entfernt werden sollen.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) erlaubt das Zerstören des Streams, wenn das Signal abgebrochen wird.


- Gibt zurück: [\<Readable\>](/de/nodejs/api/stream#class-streamreadable) ein Stream mit `limit` entfernten Chunks.

Diese Methode gibt einen neuen Stream zurück, bei dem die ersten `limit` Chunks entfernt wurden.

```js [ESM]
import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).drop(2).toArray(); // [3, 4]
```
##### `readable.take(limit[, options])` {#readabletakelimit-options}

**Hinzugefügt in: v17.5.0, v16.15.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `limit` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) die Anzahl der Chunks, die aus dem Readable entnommen werden sollen.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) erlaubt das Zerstören des Streams, wenn das Signal abgebrochen wird.


- Gibt zurück: [\<Readable\>](/de/nodejs/api/stream#class-streamreadable) ein Stream mit `limit` entnommenen Chunks.

Diese Methode gibt einen neuen Stream mit den ersten `limit` Chunks zurück.

```js [ESM]
import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).take(2).toArray(); // [1, 2]
```
##### `readable.reduce(fn[, initial[, options]])` {#readablereducefn-initial-options}

**Hinzugefügt in: v17.5.0, v16.15.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) eine Reduzierungsfunktion, die über jeden Chunk im Stream aufgerufen wird.
    - `previous` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) der Wert, der vom letzten Aufruf von `fn` erhalten wurde, oder der `initial`-Wert, falls angegeben, oder andernfalls der erste Chunk des Streams.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) ein Datenchunk aus dem Stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) abgebrochen, wenn der Stream zerstört wird, wodurch der `fn`-Aufruf frühzeitig abgebrochen werden kann.



- `initial` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) der Initialwert, der in der Reduktion verwendet werden soll.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) erlaubt das Zerstören des Streams, wenn das Signal abgebrochen wird.


- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ein Promise für den endgültigen Wert der Reduktion.

Diese Methode ruft `fn` für jeden Chunk des Streams der Reihe nach auf und übergibt ihm das Ergebnis der Berechnung des vorherigen Elements. Sie gibt ein Promise für den endgültigen Wert der Reduktion zurück.

Wenn kein `initial`-Wert angegeben wird, wird der erste Chunk des Streams als Initialwert verwendet. Wenn der Stream leer ist, wird das Promise mit einem `TypeError` mit der Code-Eigenschaft `ERR_INVALID_ARGS` abgelehnt.

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
Die Reduzierungsfunktion iteriert das Stream-Element elementweise, was bedeutet, dass es keinen `concurrency`-Parameter oder Parallelität gibt. Um eine `reduce` gleichzeitig auszuführen, können Sie die asynchrone Funktion in die Methode [`readable.map`](/de/nodejs/api/stream#readablemapfn-options) extrahieren.

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

### Duplex- und Transform-Streams {#duplex-and-transform-streams}

#### Klasse: `stream.Duplex` {#class-streamduplex}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v6.8.0 | Instanzen von `Duplex` geben jetzt `true` zurück, wenn `instanceof stream.Writable` überprüft wird. |
| v0.9.4 | Hinzugefügt in: v0.9.4 |
:::

Duplex-Streams sind Streams, die sowohl die [`Readable`](/de/nodejs/api/stream#class-streamreadable)- als auch die [`Writable`](/de/nodejs/api/stream#class-streamwritable)-Schnittstelle implementieren.

Beispiele für `Duplex`-Streams sind:

- [TCP-Sockets](/de/nodejs/api/net#class-netsocket)
- [zlib-Streams](/de/nodejs/api/zlib)
- [crypto-Streams](/de/nodejs/api/crypto)

##### `duplex.allowHalfOpen` {#duplexallowhalfopen}

**Hinzugefügt in: v0.9.4**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wenn `false`, beendet der Stream automatisch die beschreibbare Seite, wenn die lesbare Seite endet. Wird anfänglich durch die `allowHalfOpen`-Konstruktoroption festgelegt, die standardmäßig auf `true` gesetzt ist.

Dies kann manuell geändert werden, um das Half-Open-Verhalten einer vorhandenen `Duplex`-Stream-Instanz zu ändern, muss aber geändert werden, bevor das `'end'`-Ereignis ausgelöst wird.

#### Klasse: `stream.Transform` {#class-streamtransform}

**Hinzugefügt in: v0.9.4**

Transform-Streams sind [`Duplex`](/de/nodejs/api/stream#class-streamduplex)-Streams, bei denen die Ausgabe in irgendeiner Weise mit der Eingabe zusammenhängt. Wie alle [`Duplex`](/de/nodejs/api/stream#class-streamduplex)-Streams implementieren `Transform`-Streams sowohl die [`Readable`](/de/nodejs/api/stream#class-streamreadable)- als auch die [`Writable`](/de/nodejs/api/stream#class-streamwritable)-Schnittstelle.

Beispiele für `Transform`-Streams sind:

- [zlib-Streams](/de/nodejs/api/zlib)
- [crypto-Streams](/de/nodejs/api/crypto)

##### `transform.destroy([error])` {#transformdestroyerror}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v14.0.0 | Funktioniert als No-Op bei einem Stream, der bereits zerstört wurde. |
| v8.0.0 | Hinzugefügt in: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- Gibt zurück: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Zerstört den Stream und löst optional ein `'error'`-Ereignis aus. Nach diesem Aufruf würde der Transform-Stream alle internen Ressourcen freigeben. Implementierer sollten diese Methode nicht überschreiben, sondern stattdessen [`readable._destroy()`](/de/nodejs/api/stream#readable_destroyerr-callback) implementieren. Die Standardimplementierung von `_destroy()` für `Transform` löst auch `'close'` aus, es sei denn, `emitClose` ist auf false gesetzt.

Sobald `destroy()` aufgerufen wurde, sind alle weiteren Aufrufe No-Ops, und es werden keine weiteren Fehler außer von `_destroy()` als `'error'` ausgelöst.


#### `stream.duplexPair([options])` {#streamduplexpairoptions}

**Hinzugefügt in: v22.6.0, v20.17.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein Wert, der an beide [`Duplex`](/de/nodejs/api/stream#class-streamduplex)-Konstruktoren übergeben wird, um Optionen wie die Pufferung festzulegen.
- Rückgabe: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) von zwei [`Duplex`](/de/nodejs/api/stream#class-streamduplex)-Instanzen.

Die Hilfsfunktion `duplexPair` gibt ein Array mit zwei Elementen zurück, wobei jedes ein `Duplex`-Stream ist, der mit der anderen Seite verbunden ist:

```js [ESM]
const [ sideA, sideB ] = duplexPair();
```
Was auch immer in einen Stream geschrieben wird, wird auf dem anderen lesbar gemacht. Dies bietet ein Verhalten, das einer Netzwerkverbindung ähnelt, bei der die vom Client geschriebenen Daten vom Server lesbar werden und umgekehrt.

Die Duplex-Streams sind symmetrisch; der eine oder der andere kann ohne Verhaltensunterschied verwendet werden.

### `stream.finished(stream[, options], callback)` {#streamfinishedstream-options-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.5.0 | Unterstützung für `ReadableStream` und `WritableStream` hinzugefügt. |
| v15.11.0 | Die Option `signal` wurde hinzugefügt. |
| v14.0.0 | `finished(stream, cb)` wartet auf das Ereignis `'close'`, bevor der Callback aufgerufen wird. Die Implementierung versucht, Legacy-Streams zu erkennen und dieses Verhalten nur auf Streams anzuwenden, von denen erwartet wird, dass sie `'close'` ausgeben. |
| v14.0.0 | Das Ausgeben von `'close'` vor `'end'` auf einem `Readable`-Stream führt zu einem `ERR_STREAM_PREMATURE_CLOSE`-Fehler. |
| v14.0.0 | Der Callback wird auf Streams aufgerufen, die bereits vor dem Aufruf von `finished(stream, cb)` abgeschlossen sind. |
| v10.0.0 | Hinzugefügt in: v10.0.0 |
:::

- `stream` [\<Stream\>](/de/nodejs/api/stream#stream) | [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream) Ein lesbarer und/oder schreibbarer Stream/Webstream.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `error` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf `false` gesetzt, wird ein Aufruf von `emit('error', err)` nicht als beendet behandelt. **Standard:** `true`.
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf `false` gesetzt, wird der Callback aufgerufen, wenn der Stream endet, auch wenn der Stream möglicherweise noch lesbar ist. **Standard:** `true`.
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf `false` gesetzt, wird der Callback aufgerufen, wenn der Stream endet, auch wenn der Stream möglicherweise noch beschreibbar ist. **Standard:** `true`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ermöglicht das Abbrechen des Wartens auf die Stream-Beendigung. Der zugrunde liegende Stream wird *nicht* abgebrochen, wenn das Signal abgebrochen wird. Der Callback wird mit einem `AbortError` aufgerufen. Alle registrierten Listener, die von dieser Funktion hinzugefügt wurden, werden ebenfalls entfernt.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine Callback-Funktion, die ein optionales Fehlerargument entgegennimmt.
- Rückgabe: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine Aufräumfunktion, die alle registrierten Listener entfernt.

Eine Funktion, um benachrichtigt zu werden, wenn ein Stream nicht mehr lesbar oder beschreibbar ist oder ein Fehler oder ein vorzeitiges Schließereignis aufgetreten ist.

```js [ESM]
const { finished } = require('node:stream');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

finished(rs, (err) => {
  if (err) {
    console.error('Stream fehlgeschlagen.', err);
  } else {
    console.log('Stream ist mit dem Lesen fertig.');
  }
});

rs.resume(); // Stream entleeren.
```
Besonders nützlich in Fehlerszenarien, in denen ein Stream vorzeitig zerstört wird (wie eine abgebrochene HTTP-Anfrage) und kein `'end'` oder `'finish'` ausgibt.

Die `finished`-API bietet eine [Promise-Version](/de/nodejs/api/stream#streamfinishedstream-options).

`stream.finished()` hinterlässt hängende Ereignis-Listener (insbesondere `'error'`, `'end'`, `'finish'` und `'close'`), nachdem `callback` aufgerufen wurde. Der Grund dafür ist, dass unerwartete `'error'`-Ereignisse (aufgrund fehlerhafter Stream-Implementierungen) keine unerwarteten Abstürze verursachen. Wenn dies ein unerwünschtes Verhalten ist, muss die zurückgegebene Aufräumfunktion im Callback aufgerufen werden:

```js [ESM]
const cleanup = finished(rs, (err) => {
  cleanup();
  // ...
});
```

### `stream.pipeline(source[, ...transforms], destination, callback)` {#streampipelinesource-transforms-destination-callback}

### `stream.pipeline(streams, callback)` {#streampipelinestreams-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.7.0, v18.16.0 | Unterstützung für Webstreams hinzugefügt. |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v14.0.0 | Der `pipeline(..., cb)` wartet auf das `'close'`-Ereignis, bevor der Callback aufgerufen wird. Die Implementierung versucht, Legacy-Streams zu erkennen und dieses Verhalten nur auf Streams anzuwenden, von denen erwartet wird, dass sie `'close'` ausgeben. |
| v13.10.0 | Unterstützung für asynchrone Generatoren hinzugefügt. |
| v10.0.0 | Hinzugefügt in: v10.0.0 |
:::

- `streams` [\<Stream[]\>](/de/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream[]\>](/de/nodejs/api/webstreams#class-readablestream) | [\<WritableStream[]\>](/de/nodejs/api/webstreams#class-writablestream) | [\<TransformStream[]\>](/de/nodejs/api/webstreams#class-transformstream)
- `source` [\<Stream\>](/de/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) 
    - Gibt zurück: [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `...transforms` [\<Stream\>](/de/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<TransformStream\>](/de/nodejs/api/webstreams#class-transformstream) 
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Gibt zurück: [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `destination` [\<Stream\>](/de/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream) 
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Gibt zurück: [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird aufgerufen, wenn die Pipeline vollständig abgeschlossen ist. 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `val` Aufgelöster Wert von `Promise`, der von `destination` zurückgegeben wird.
  
 
- Gibt zurück: [\<Stream\>](/de/nodejs/api/stream#stream)

Eine Modulmethode zum Pipe zwischen Streams und Generatoren, die Fehler weiterleitet und ordnungsgemäß bereinigt, und einen Callback bereitstellt, wenn die Pipeline abgeschlossen ist.

```js [ESM]
const { pipeline } = require('node:stream');
const fs = require('node:fs');
const zlib = require('node:zlib');

// Verwenden Sie die Pipeline-API, um auf einfache Weise eine Reihe von Streams
// zusammenzufügen und benachrichtigt zu werden, wenn die Pipeline vollständig abgeschlossen ist.

// Eine Pipeline, um eine potenziell riesige Tar-Datei effizient zu komprimieren:

pipeline(
  fs.createReadStream('archive.tar'),
  zlib.createGzip(),
  fs.createWriteStream('archive.tar.gz'),
  (err) => {
    if (err) {
      console.error('Pipeline fehlgeschlagen.', err);
    } else {
      console.log('Pipeline erfolgreich.');
    }
  },
);
```
Die `pipeline`-API bietet eine [Promise-Version](/de/nodejs/api/stream#streampipelinesource-transforms-destination-options).

`stream.pipeline()` ruft `stream.destroy(err)` für alle Streams auf, außer:

- `Readable`-Streams, die `'end'` oder `'close'` ausgegeben haben.
- `Writable`-Streams, die `'finish'` oder `'close'` ausgegeben haben.

`stream.pipeline()` lässt nach dem Aufruf des `callback` hängende Event-Listener auf den Streams zurück. Im Falle der Wiederverwendung von Streams nach einem Fehler kann dies zu Event-Listener-Lecks und verschluckten Fehlern führen. Wenn der letzte Stream lesbar ist, werden hängende Event-Listener entfernt, sodass der letzte Stream später verarbeitet werden kann.

`stream.pipeline()` schließt alle Streams, wenn ein Fehler ausgelöst wird. Die `IncomingRequest`-Verwendung mit `pipeline` kann zu einem unerwarteten Verhalten führen, da sie den Socket zerstört, ohne die erwartete Antwort zu senden. Siehe das folgende Beispiel:

```js [ESM]
const fs = require('node:fs');
const http = require('node:http');
const { pipeline } = require('node:stream');

const server = http.createServer((req, res) => {
  const fileStream = fs.createReadStream('./fileNotExist.txt');
  pipeline(fileStream, res, (err) => {
    if (err) {
      console.log(err); // Keine solche Datei
      // Diese Nachricht kann nicht gesendet werden, da `pipeline` den Socket bereits zerstört hat.
      return res.end('error!!!');
    }
  });
});
```

### `stream.compose(...streams)` {#streamcomposestreams}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.1.0, v20.10.0 | Unterstützung für Stream-Klasse hinzugefügt. |
| v19.8.0, v18.16.0 | Unterstützung für Webstreams hinzugefügt. |
| v16.9.0 | Hinzugefügt in: v16.9.0 |
:::

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - `stream.compose` ist experimentell.
:::

- `streams` [\<Stream[]\>](/de/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream[]\>](/de/nodejs/api/webstreams#class-readablestream) | [\<WritableStream[]\>](/de/nodejs/api/webstreams#class-writablestream) | [\<TransformStream[]\>](/de/nodejs/api/webstreams#class-transformstream) | [\<Duplex[]\>](/de/nodejs/api/stream#class-streamduplex) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)

Kombiniert zwei oder mehr Streams zu einem `Duplex`-Stream, der in den ersten Stream schreibt und aus dem letzten liest. Jeder bereitgestellte Stream wird mit `stream.pipeline` in den nächsten geleitet. Wenn einer der Streams einen Fehler erzeugt, werden alle zerstört, einschließlich des äußeren `Duplex`-Streams.

Da `stream.compose` einen neuen Stream zurückgibt, der wiederum in andere Streams geleitet werden kann (und sollte), ermöglicht er die Komposition. Im Gegensatz dazu ist beim Übergeben von Streams an `stream.pipeline` der erste Stream typischerweise ein lesbarer Stream und der letzte ein beschreibbarer Stream, wodurch ein geschlossener Kreislauf entsteht.

Wenn eine `Function` übergeben wird, muss dies eine Factory-Methode sein, die ein `source` `Iterable` entgegennimmt.

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

console.log(res); // prints 'HELLOWORLD'
```
`stream.compose` kann verwendet werden, um asynchrone Iterables, Generatoren und Funktionen in Streams zu konvertieren.

- `AsyncIterable` konvertiert in ein lesbares `Duplex`. Kann nicht `null` liefern.
- `AsyncGeneratorFunction` konvertiert in ein lesbares/beschreibbares Transform-`Duplex`. Muss ein `AsyncIterable` als erste Parameterquelle verwenden. Kann nicht `null` liefern.
- `AsyncFunction` konvertiert in ein beschreibbares `Duplex`. Muss entweder `null` oder `undefined` zurückgeben.

```js [ESM]
import { compose } from 'node:stream';
import { finished } from 'node:stream/promises';

// Konvertiere AsyncIterable in ein lesbares Duplex.
const s1 = compose(async function*() {
  yield 'Hello';
  yield 'World';
}());

// Konvertiere AsyncGenerator in ein Transform-Duplex.
const s2 = compose(async function*(source) {
  for await (const chunk of source) {
    yield String(chunk).toUpperCase();
  }
});

let res = '';

// Konvertiere AsyncFunction in ein beschreibbares Duplex.
const s3 = compose(async function(source) {
  for await (const chunk of source) {
    res += chunk;
  }
});

await finished(compose(s1, s2, s3));

console.log(res); // prints 'HELLOWORLD'
```
Siehe [`readable.compose(stream)`](/de/nodejs/api/stream#readablecomposestream-options) für `stream.compose` als Operator.


### `stream.Readable.from(iterable[, options])` {#streamreadablefromiterable-options}

**Hinzugefügt in: v12.3.0, v10.17.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) Objekt, das das Iterable-Protokoll `Symbol.asyncIterator` oder `Symbol.iterator` implementiert. Gibt ein 'error'-Ereignis aus, wenn ein Nullwert übergeben wird.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optionen, die an `new stream.Readable([options])` übergeben werden. Standardmäßig setzt `Readable.from()` `options.objectMode` auf `true`, es sei denn, dies wird explizit durch Setzen von `options.objectMode` auf `false` abgewählt.
- Gibt zurück: [\<stream.Readable\>](/de/nodejs/api/stream#class-streamreadable)

Eine Hilfsmethode zum Erstellen lesbarer Streams aus Iteratoren.

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
Der Aufruf von `Readable.from(string)` oder `Readable.from(buffer)` führt nicht dazu, dass die Zeichenketten oder Puffer iteriert werden, um die Semantik der anderen Streams aus Leistungsgründen zu erfüllen.

Wenn ein `Iterable`-Objekt, das Promises enthält, als Argument übergeben wird, kann dies zu unbehandelten Ablehnungen führen.

```js [ESM]
const { Readable } = require('node:stream');

Readable.from([
  new Promise((resolve) => setTimeout(resolve('1'), 1500)),
  new Promise((_, reject) => setTimeout(reject(new Error('2')), 1000)), // Unbehandelte Ablehnung
]);
```
### `stream.Readable.fromWeb(readableStream[, options])` {#streamreadablefromwebreadablestream-options}

**Hinzugefügt in: v17.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `readableStream` [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal)


- Gibt zurück: [\<stream.Readable\>](/de/nodejs/api/stream#class-streamreadable)


### `stream.Readable.isDisturbed(stream)` {#streamreadableisdisturbedstream}

**Hinzugefügt in: v16.8.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `stream` [\<stream.Readable\>](/de/nodejs/api/stream#class-streamreadable) | [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream)
- Gibt zurück: `boolean`

Gibt zurück, ob der Stream gelesen oder abgebrochen wurde.

### `stream.isErrored(stream)` {#streamiserroredstream}

**Hinzugefügt in: v17.3.0, v16.14.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `stream` [\<Readable\>](/de/nodejs/api/stream#class-streamreadable) | [\<Writable\>](/de/nodejs/api/stream#class-streamwritable) | [\<Duplex\>](/de/nodejs/api/stream#class-streamduplex) | [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream) | [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt zurück, ob im Stream ein Fehler aufgetreten ist.

### `stream.isReadable(stream)` {#streamisreadablestream}

**Hinzugefügt in: v17.4.0, v16.14.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `stream` [\<Readable\>](/de/nodejs/api/stream#class-streamreadable) | [\<Duplex\>](/de/nodejs/api/stream#class-streamduplex) | [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt zurück, ob der Stream lesbar ist.

### `stream.Readable.toWeb(streamReadable[, options])` {#streamreadabletowebstreamreadable-options}

**Hinzugefügt in: v17.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `streamReadable` [\<stream.Readable\>](/de/nodejs/api/stream#class-streamreadable)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die maximale interne Warteschlangengröße (des erstellten `ReadableStream`), bevor Gegendruck beim Lesen aus dem angegebenen `stream.Readable` ausgeübt wird. Wenn kein Wert angegeben wird, wird er aus dem angegebenen `stream.Readable` übernommen.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine Funktion, die die Größe des gegebenen Datenblocks angibt. Wenn kein Wert angegeben wird, ist die Größe für alle Chunks `1`.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Gibt zurück: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)





- Gibt zurück: [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream)


### `stream.Writable.fromWeb(writableStream[, options])` {#streamwritablefromwebwritablestream-options}

**Hinzugefügt in: v17.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `writableStream` [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal)

- Gibt zurück: [\<stream.Writable\>](/de/nodejs/api/stream#class-streamwritable)

### `stream.Writable.toWeb(streamWritable)` {#streamwritabletowebstreamwritable}

**Hinzugefügt in: v17.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `streamWritable` [\<stream.Writable\>](/de/nodejs/api/stream#class-streamwritable)
- Gibt zurück: [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream)

### `stream.Duplex.from(src)` {#streamduplexfromsrc}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.5.0, v18.17.0 | Das Argument `src` kann jetzt ein `ReadableStream` oder `WritableStream` sein. |
| v16.8.0 | Hinzugefügt in: v16.8.0 |
:::

- `src` [\<Stream\>](/de/nodejs/api/stream#stream) | [\<Blob\>](/de/nodejs/api/buffer#class-blob) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<AsyncGeneratorFunction\>](https://tc39.es/proposal-async-iteration/#sec-asyncgeneratorfunction-constructor) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream)

Eine Hilfsmethode zum Erstellen von Duplex-Streams.

- `Stream` konvertiert einen beschreibbaren Stream in einen beschreibbaren `Duplex` und einen lesbaren Stream in einen `Duplex`.
- `Blob` konvertiert in einen lesbaren `Duplex`.
- `string` konvertiert in einen lesbaren `Duplex`.
- `ArrayBuffer` konvertiert in einen lesbaren `Duplex`.
- `AsyncIterable` konvertiert in einen lesbaren `Duplex`. Darf nicht `null` ergeben.
- `AsyncGeneratorFunction` konvertiert in einen lesbaren/beschreibbaren Transform-`Duplex`. Muss eine Quell-`AsyncIterable` als ersten Parameter verwenden. Darf nicht `null` ergeben.
- `AsyncFunction` konvertiert in einen beschreibbaren `Duplex`. Muss entweder `null` oder `undefined` zurückgeben.
- `Object ({ writable, readable })` konvertiert `readable` und `writable` in `Stream` und kombiniert sie dann zu `Duplex`, wobei der `Duplex` in `writable` schreibt und aus `readable` liest.
- `Promise` konvertiert in einen lesbaren `Duplex`. Der Wert `null` wird ignoriert.
- `ReadableStream` konvertiert in einen lesbaren `Duplex`.
- `WritableStream` konvertiert in einen beschreibbaren `Duplex`.
- Gibt zurück: [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)

Wenn ein `Iterable`-Objekt, das Promises enthält, als Argument übergeben wird, kann dies zu einer unbehandelten Ablehnung führen.

```js [ESM]
const { Duplex } = require('node:stream');

Duplex.from([
  new Promise((resolve) => setTimeout(resolve('1'), 1500)),
  new Promise((_, reject) => setTimeout(reject(new Error('2')), 1000)), // Unbehandelte Ablehnung
]);
```

### `stream.Duplex.fromWeb(pair[, options])` {#streamduplexfromwebpair-options}

**Hinzugefügt in: v17.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `pair` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream)
    - `writable` [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream)
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal)
  
 
- Gibt zurück: [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)



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

**Hinzugefügt in: v17.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `streamDuplex` [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)
- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream)
    - `writable` [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream)





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


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.7.0, v18.16.0 | Unterstützung für `ReadableStream` und `WritableStream` hinzugefügt. |
| v15.4.0 | Hinzugefügt in: v15.4.0 |
:::

- `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ein Signal, das eine mögliche Stornierung darstellt
- `stream` [\<Stream\>](/de/nodejs/api/stream#stream) | [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream) Ein Stream, an den ein Signal angehängt werden soll.

Fügt einem lesbaren oder schreibbaren Stream ein AbortSignal hinzu. Dies ermöglicht es dem Code, die Stream-Zerstörung mithilfe eines `AbortController` zu steuern.

Das Aufrufen von `abort` auf dem `AbortController`, der dem übergebenen `AbortSignal` entspricht, verhält sich genauso wie das Aufrufen von `.destroy(new AbortError())` auf dem Stream und `controller.error(new AbortError())` für Webstreams.

```js [ESM]
const fs = require('node:fs');

const controller = new AbortController();
const read = addAbortSignal(
  controller.signal,
  fs.createReadStream(('object.json')),
);
// Später den Vorgang abbrechen und den Stream schliessen
controller.abort();
```
Oder Verwendung eines `AbortSignal` mit einem lesbaren Stream als asynchron iterierbar:

```js [ESM]
const controller = new AbortController();
setTimeout(() => controller.abort(), 10_000); // ein Timeout setzen
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
      // Der Vorgang wurde abgebrochen
    } else {
      throw e;
    }
  }
})();
```
Oder Verwendung eines `AbortSignal` mit einem ReadableStream:

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
      // Der Vorgang wurde abgebrochen
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

**Hinzugefügt in: v19.9.0, v18.17.0**

- `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Gibt das von Streams verwendete Standard-HighWaterMark zurück. Standardmäßig `65536` (64 KiB) oder `16` für `objectMode`.

### `stream.setDefaultHighWaterMark(objectMode, value)` {#streamsetdefaulthighwatermarkobjectmode-value}

**Hinzugefügt in: v19.9.0, v18.17.0**

- `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) highWaterMark Wert

Legt das von Streams verwendete Standard-HighWaterMark fest.

## API für Stream-Implementierer {#api-for-stream-implementers}

Das `node:stream`-Modul-API wurde entwickelt, um es einfach zu machen, Streams mithilfe des prototypischen Vererbungsmodells von JavaScript zu implementieren.

Zuerst würde ein Stream-Entwickler eine neue JavaScript-Klasse deklarieren, die eine der vier grundlegenden Stream-Klassen (`stream.Writable`, `stream.Readable`, `stream.Duplex` oder `stream.Transform`) erweitert, wobei sichergestellt wird, dass der entsprechende Konstruktor der übergeordneten Klasse aufgerufen wird:

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  constructor({ highWaterMark, ...options }) {
    super({ highWaterMark });
    // ...
  }
}
```
Wenn Sie Streams erweitern, beachten Sie, welche Optionen der Benutzer bereitstellen kann und sollte, bevor Sie diese an den Basiskonstruktor weiterleiten. Wenn die Implementierung beispielsweise Annahmen in Bezug auf die Optionen `autoDestroy` und `emitClose` trifft, dürfen Sie dem Benutzer nicht erlauben, diese zu überschreiben. Seien Sie explizit, welche Optionen weitergeleitet werden, anstatt implizit alle Optionen weiterzuleiten.

Die neue Stream-Klasse muss dann eine oder mehrere spezifische Methoden implementieren, abhängig von der Art des zu erstellenden Streams, wie in der folgenden Tabelle detailliert beschrieben:

| Anwendungsfall | Klasse | Zu implementierende Methode(n) |
| --- | --- | --- |
| Nur lesen | [`Readable`](/de/nodejs/api/stream#class-streamreadable) | [`_read()`](/de/nodejs/api/stream#readable_readsize) |
| Nur schreiben | [`Writable`](/de/nodejs/api/stream#class-streamwritable) | [`_write()`](/de/nodejs/api/stream#writable_writechunk-encoding-callback)  ,   [`_writev()`](/de/nodejs/api/stream#writable_writevchunks-callback)  ,   [`_final()`](/de/nodejs/api/stream#writable_finalcallback) |
| Lesen und schreiben | [`Duplex`](/de/nodejs/api/stream#class-streamduplex) | [`_read()`](/de/nodejs/api/stream#readable_readsize)  ,   [`_write()`](/de/nodejs/api/stream#writable_writechunk-encoding-callback)  ,   [`_writev()`](/de/nodejs/api/stream#writable_writevchunks-callback)  ,   [`_final()`](/de/nodejs/api/stream#writable_finalcallback) |
| Geschriebene Daten bearbeiten, dann das Ergebnis lesen | [`Transform`](/de/nodejs/api/stream#class-streamtransform) | [`_transform()`](/de/nodejs/api/stream#transform_transformchunk-encoding-callback)  ,   [`_flush()`](/de/nodejs/api/stream#transform_flushcallback)  ,   [`_final()`](/de/nodejs/api/stream#writable_finalcallback) |
Der Implementierungscode für einen Stream sollte *niemals* die "öffentlichen" Methoden eines Streams aufrufen, die für die Verwendung durch Konsumenten bestimmt sind (wie im Abschnitt [API für Stream-Konsumenten](/de/nodejs/api/stream#api-for-stream-consumers) beschrieben). Dies kann zu unerwünschten Nebenwirkungen im Anwendungscode führen, der den Stream konsumiert.

Vermeiden Sie das Überschreiben öffentlicher Methoden wie `write()`, `end()`, `cork()`, `uncork()`, `read()` und `destroy()` oder das Auslösen interner Ereignisse wie `'error'`, `'data'`, `'end'`, `'finish'` und `'close'` über `.emit()`. Dies kann aktuelle und zukünftige Stream-Invarianten brechen, was zu Verhaltens- und/oder Kompatibilitätsproblemen mit anderen Streams, Stream-Dienstprogrammen und Benutzererwartungen führt.


### Vereinfachte Konstruktion {#simplified-construction}

**Hinzugefügt in: v1.2.0**

In vielen einfachen Fällen ist es möglich, einen Stream zu erstellen, ohne auf Vererbung angewiesen zu sein. Dies kann erreicht werden, indem direkt Instanzen der Objekte `stream.Writable`, `stream.Readable`, `stream.Duplex` oder `stream.Transform` erstellt und geeignete Methoden als Konstruktoroptionen übergeben werden.

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  construct(callback) {
    // Zustand initialisieren und Ressourcen laden...
  },
  write(chunk, encoding, callback) {
    // ...
  },
  destroy() {
    // Ressourcen freigeben...
  },
});
```
### Implementierung eines beschreibbaren Streams {#implementing-a-writable-stream}

Die Klasse `stream.Writable` wird erweitert, um einen [`Writable`](/de/nodejs/api/stream#class-streamwritable)-Stream zu implementieren.

Benutzerdefinierte `Writable`-Streams *müssen* den Konstruktor `new stream.Writable([options])` aufrufen und die Methode `writable._write()` und/oder `writable._writev()` implementieren.

#### `new stream.Writable([options])` {#new-streamwritableoptions}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.0.0 | Standardwert für highWaterMark erhöht. |
| v15.5.0 | Unterstützung für die Übergabe eines AbortSignals. |
| v14.0.0 | Änderung des Standardwerts der Option `autoDestroy` auf `true`. |
| v11.2.0, v10.16.0 | Hinzufügen der Option `autoDestroy`, um den Stream automatisch `destroy()` aufzurufen, wenn er `'finish'` ausgibt oder Fehler auftreten. |
| v10.0.0 | Hinzufügen der Option `emitClose`, um anzugeben, ob `'close'` bei der Zerstörung ausgegeben wird. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Pufferstand, bei dem [`stream.write()`](/de/nodejs/api/stream#writablewritechunk-encoding-callback) beginnt, `false` zurückzugeben. **Standard:** `65536` (64 KiB) oder `16` für `objectMode`-Streams.
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt an, ob `string`s, die an [`stream.write()`](/de/nodejs/api/stream#writablewritechunk-encoding-callback) übergeben werden, in `Buffer`s (mit der in dem [`stream.write()`](/de/nodejs/api/stream#writablewritechunk-encoding-callback)-Aufruf angegebenen Kodierung) kodiert werden sollen, bevor sie an [`stream._write()`](/de/nodejs/api/stream#writable_writechunk-encoding-callback) übergeben werden. Andere Datentypen werden nicht konvertiert (d. h. `Buffer`s werden nicht in `string`s dekodiert). Wenn dies auf false gesetzt wird, wird verhindert, dass `string`s konvertiert werden. **Standard:** `true`.
    - `defaultEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Standardkodierung, die verwendet wird, wenn keine Kodierung als Argument für [`stream.write()`](/de/nodejs/api/stream#writablewritechunk-encoding-callback) angegeben wird. **Standard:** `'utf8'`.
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt an, ob [`stream.write(anyObj)`](/de/nodejs/api/stream#writablewritechunk-encoding-callback) eine gültige Operation ist. Wenn diese Option gesetzt ist, ist es möglich, andere JavaScript-Werte als String, [\<Buffer\>](/de/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) oder [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) zu schreiben, falls dies von der Stream-Implementierung unterstützt wird. **Standard:** `false`.
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt an, ob der Stream nach der Zerstörung `'close'` ausgeben soll. **Standard:** `true`.
    - `write` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementierung für die Methode [`stream._write()`](/de/nodejs/api/stream#writable_writechunk-encoding-callback).
    - `writev` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementierung für die Methode [`stream._writev()`](/de/nodejs/api/stream#writable_writevchunks-callback).
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementierung für die Methode [`stream._destroy()`](/de/nodejs/api/stream#writable_destroyerr-callback).
    - `final` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementierung für die Methode [`stream._final()`](/de/nodejs/api/stream#writable_finalcallback).
    - `construct` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementierung für die Methode [`stream._construct()`](/de/nodejs/api/stream#writable_constructcallback).
    - `autoDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt an, ob dieser Stream automatisch `.destroy()` für sich selbst aufrufen soll, nachdem er beendet wurde. **Standard:** `true`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ein Signal, das eine mögliche Abbrechen darstellt.

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  constructor(options) {
    // Ruft den stream.Writable()-Konstruktor auf.
    super(options);
    // ...
  }
}
```
Oder bei Verwendung von Konstruktoren im Pre-ES6-Stil:

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
Oder mit dem vereinfachten Konstruktoransatz:

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
Der Aufruf von `abort` auf dem `AbortController`, der dem übergebenen `AbortSignal` entspricht, verhält sich genauso wie der Aufruf von `.destroy(new AbortError())` auf dem beschreibbaren Stream.

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
// Später wird der Vorgang abgebrochen, wodurch der Stream geschlossen wird
controller.abort();
```

#### `writable._construct(callback)` {#writable_constructcallback}

**Hinzugefügt in: v15.0.0**

- `callback` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Ruft diese Funktion auf (optional mit einem Fehlerargument), wenn der Stream die Initialisierung abgeschlossen hat.

Die Methode `_construct()` DARF NICHT direkt aufgerufen werden. Sie kann von Kindklassen implementiert werden und wird in diesem Fall nur von den internen Methoden der Klasse `Writable` aufgerufen.

Diese optionale Funktion wird in einem Tick aufgerufen, nachdem der Stream-Konstruktor zurückgekehrt ist, wodurch alle `_write()`, `_final()` und `_destroy()` Aufrufe verzögert werden, bis `callback` aufgerufen wird. Dies ist nützlich, um den Zustand zu initialisieren oder Ressourcen asynchron zu initialisieren, bevor der Stream verwendet werden kann.

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


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.11.0 | _write() ist optional, wenn _writev() bereitgestellt wird. |
:::

- `chunk` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Der zu schreibende `Buffer`, der von der an [`stream.write()`](/de/nodejs/api/stream#writablewritechunk-encoding-callback) übergebenen `string` konvertiert wurde. Wenn die Option `decodeStrings` des Streams `false` ist oder der Stream im Objektmodus arbeitet, wird der Chunk nicht konvertiert und entspricht dem, was an [`stream.write()`](/de/nodejs/api/stream#writablewritechunk-encoding-callback) übergeben wurde.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn der Chunk ein String ist, dann ist `encoding` die Zeichenkodierung dieses Strings. Wenn chunk ein `Buffer` ist oder der Stream im Objektmodus arbeitet, kann `encoding` ignoriert werden.
- `callback` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Ruft diese Funktion auf (optional mit einem Fehlerargument), wenn die Verarbeitung für den bereitgestellten Chunk abgeschlossen ist.

Alle `Writable`-Stream-Implementierungen müssen eine [`writable._write()`](/de/nodejs/api/stream#writable_writechunk-encoding-callback)- und/oder [`writable._writev()`](/de/nodejs/api/stream#writable_writevchunks-callback)-Methode bereitstellen, um Daten an die zugrunde liegende Ressource zu senden.

[`Transform`](/de/nodejs/api/stream#class-streamtransform)-Streams stellen ihre eigene Implementierung von [`writable._write()`](/de/nodejs/api/stream#writable_writechunk-encoding-callback) bereit.

Diese Funktion DARF NICHT direkt vom Anwendungscode aufgerufen werden. Sie sollte von Kindklassen implementiert und nur von den internen Methoden der Klasse `Writable` aufgerufen werden.

Die `callback`-Funktion muss synchron innerhalb von `writable._write()` oder asynchron (d. h. unterschiedlicher Tick) aufgerufen werden, um entweder zu signalisieren, dass der Schreibvorgang erfolgreich abgeschlossen wurde oder mit einem Fehler fehlgeschlagen ist. Das erste Argument, das an den `callback` übergeben wird, muss das `Error`-Objekt sein, wenn der Aufruf fehlgeschlagen ist, oder `null`, wenn der Schreibvorgang erfolgreich war.

Alle Aufrufe von `writable.write()`, die zwischen dem Zeitpunkt, zu dem `writable._write()` aufgerufen wird, und dem Aufruf des `callback` erfolgen, führen dazu, dass die geschriebenen Daten gepuffert werden. Wenn der `callback` aufgerufen wird, kann der Stream ein [`'drain'`](/de/nodejs/api/stream#event-drain)-Ereignis auslösen. Wenn eine Stream-Implementierung in der Lage ist, mehrere Datenchunks gleichzeitig zu verarbeiten, sollte die Methode `writable._writev()` implementiert werden.

Wenn die Eigenschaft `decodeStrings` in den Konstruktoroptionen explizit auf `false` gesetzt ist, dann bleibt `chunk` dasselbe Objekt, das an `.write()` übergeben wird, und kann ein String anstelle eines `Buffer` sein. Dies dient zur Unterstützung von Implementierungen, die eine optimierte Behandlung für bestimmte String-Datenkodierungen haben. In diesem Fall gibt das `encoding`-Argument die Zeichenkodierung des Strings an. Andernfalls kann das `encoding`-Argument sicher ignoriert werden.

Der Methode `writable._write()` ist ein Unterstrich vorangestellt, da sie intern für die Klasse ist, die sie definiert, und niemals direkt von Benutzerprogrammen aufgerufen werden sollte.


#### `writable._writev(chunks, callback)` {#writable_writevchunks-callback}

- `chunks` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Die zu schreibenden Daten. Der Wert ist ein Array von [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), die jeweils einen diskreten Datenblock darstellen, der geschrieben werden soll. Die Eigenschaften dieser Objekte sind:
    - `chunk` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine Pufferinstanz oder ein String, der die zu schreibenden Daten enthält. `chunk` ist ein String, wenn `Writable` mit der Option `decodeStrings` auf `false` gesetzt wurde und ein String an `write()` übergeben wurde.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Zeichenkodierung des `chunk`. Wenn `chunk` ein `Buffer` ist, ist `encoding` gleich `'buffer'`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine Callback-Funktion (optional mit einem Fehlerargument), die aufgerufen wird, wenn die Verarbeitung der bereitgestellten Chunks abgeschlossen ist.

Diese Funktion DARF NICHT direkt von Anwendungscode aufgerufen werden. Sie sollte von Kindklassen implementiert und nur von den internen `Writable`-Klassenmethoden aufgerufen werden.

Die Methode `writable._writev()` kann zusätzlich oder alternativ zu `writable._write()` in Stream-Implementierungen implementiert werden, die in der Lage sind, mehrere Datenblöcke gleichzeitig zu verarbeiten. Wenn sie implementiert ist und gepufferte Daten aus vorherigen Schreibvorgängen vorhanden sind, wird `_writev()` anstelle von `_write()` aufgerufen.

Die Methode `writable._writev()` hat ein vorangestelltes Unterstrichzeichen, da sie intern für die Klasse ist, die sie definiert, und niemals direkt von Benutzerprogrammen aufgerufen werden sollte.

#### `writable._destroy(err, callback)` {#writable_destroyerr-callback}

**Hinzugefügt in: v8.0.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Ein möglicher Fehler.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine Callback-Funktion, die ein optionales Fehlerargument entgegennimmt.

Die Methode `_destroy()` wird von [`writable.destroy()`](/de/nodejs/api/stream#writabledestroyerror) aufgerufen. Sie kann von Kindklassen überschrieben werden, darf aber **nicht** direkt aufgerufen werden.


#### `writable._final(callback)` {#writable_finalcallback}

**Hinzugefügt in: v8.0.0**

- `callback` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Rufen Sie diese Funktion (optional mit einem Fehlerargument) auf, wenn das Schreiben der verbleibenden Daten abgeschlossen ist.

Die Methode `_final()` **darf nicht** direkt aufgerufen werden. Sie kann von abgeleiteten Klassen implementiert werden und wird in diesem Fall nur von den internen Methoden der Klasse `Writable` aufgerufen.

Diese optionale Funktion wird aufgerufen, bevor der Stream geschlossen wird, wodurch das Ereignis `'finish'` verzögert wird, bis `callback` aufgerufen wird. Dies ist nützlich, um Ressourcen zu schließen oder gepufferte Daten zu schreiben, bevor ein Stream endet.

#### Fehler beim Schreiben {#errors-while-writing}

Fehler, die während der Verarbeitung der Methoden [`writable._write()`](/de/nodejs/api/stream#writable_writechunk-encoding-callback), [`writable._writev()`](/de/nodejs/api/stream#writable_writevchunks-callback) und [`writable._final()`](/de/nodejs/api/stream#writable_finalcallback) auftreten, müssen weitergegeben werden, indem der Callback aufgerufen und der Fehler als erstes Argument übergeben wird. Das Auslösen eines `Error` innerhalb dieser Methoden oder das manuelle Auslösen eines `'error'`-Ereignisses führt zu undefiniertem Verhalten.

Wenn ein `Readable`-Stream in einen `Writable`-Stream geleitet wird, wenn `Writable` einen Fehler ausgibt, wird der `Readable`-Stream entleert.

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
#### Ein Beispiel für einen beschreibbaren Stream {#an-example-writable-stream}

Das Folgende veranschaulicht eine eher simple (und etwas sinnlose) benutzerdefinierte `Writable`-Stream-Implementierung. Obwohl diese spezielle `Writable`-Stream-Instanz keinen wirklichen Nutzen hat, veranschaulicht das Beispiel jedes der erforderlichen Elemente einer benutzerdefinierten [`Writable`](/de/nodejs/api/stream#class-streamwritable)-Stream-Instanz:

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

#### Dekodieren von Puffern in einem beschreibbaren Stream {#decoding-buffers-in-a-writable-stream}

Das Dekodieren von Puffern ist eine häufige Aufgabe, beispielsweise bei der Verwendung von Transformatoren, deren Eingabe eine Zeichenkette ist. Dies ist kein trivialer Prozess bei der Verwendung von Multi-Byte-Zeichenkodierungen wie UTF-8. Das folgende Beispiel zeigt, wie Multi-Byte-Zeichenketten mit `StringDecoder` und [`Writable`](/de/nodejs/api/stream#class-streamwritable) dekodiert werden.

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
### Implementieren eines lesbaren Streams {#implementing-a-readable-stream}

Die Klasse `stream.Readable` wird erweitert, um einen [`Readable`](/de/nodejs/api/stream#class-streamreadable)-Stream zu implementieren.

Benutzerdefinierte `Readable`-Streams *müssen* den Konstruktor `new stream.Readable([options])` aufrufen und die Methode [`readable._read()`](/de/nodejs/api/stream#readable_readsize) implementieren.

#### `new stream.Readable([options])` {#new-streamreadableoptions}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.0.0 | Standard-`highWaterMark` erhöht. |
| v15.5.0 | Unterstützung für die Übergabe eines `AbortSignal`. |
| v14.0.0 | Änderung der Standardeinstellung der Option `autoDestroy` auf `true`. |
| v11.2.0, v10.16.0 | Option `autoDestroy` hinzugefügt, um den Stream automatisch `destroy()` zu beenden, wenn er `'end'` ausgibt oder Fehler auftreten. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die maximale [Anzahl von Bytes](/de/nodejs/api/stream#highwatermark-discrepancy-after-calling-readablesetencoding), die im internen Puffer gespeichert werden sollen, bevor das Lesen aus der zugrunde liegenden Ressource eingestellt wird. **Standard:** `65536` (64 KiB) oder `16` für `objectMode`-Streams.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn angegeben, werden Puffer mit der angegebenen Kodierung in Zeichenketten dekodiert. **Standard:** `null`.
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ob sich dieser Stream als ein Stream von Objekten verhalten soll. Das bedeutet, dass [`stream.read(n)`](/de/nodejs/api/stream#readablereadsize) einen einzelnen Wert anstelle eines `Buffer` der Größe `n` zurückgibt. **Standard:** `false`.
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ob der Stream `'close'` ausgeben soll, nachdem er zerstört wurde. **Standard:** `true`.
    - `read` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementierung für die Methode [`stream._read()`](/de/nodejs/api/stream#readable_readsize).
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementierung für die Methode [`stream._destroy()`](/de/nodejs/api/stream#readable_destroyerr-callback).
    - `construct` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementierung für die Methode [`stream._construct()`](/de/nodejs/api/stream#readable_constructcallback).
    - `autoDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ob dieser Stream nach dem Beenden automatisch `.destroy()` aufrufen soll. **Standard:** `true`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ein Signal, das eine mögliche Abbruch darstellt.
  
 

```js [ESM]
const { Readable } = require('node:stream');

class MyReadable extends Readable {
  constructor(options) {
    // Ruft den Konstruktor stream.Readable(options) auf.
    super(options);
    // ...
  }
}
```
Oder bei Verwendung von Konstruktoren im Pre-ES6-Stil:

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
Oder unter Verwendung des vereinfachten Konstruktoransatzes:

```js [ESM]
const { Readable } = require('node:stream');

const myReadable = new Readable({
  read(size) {
    // ...
  },
});
```
Das Aufrufen von `abort` auf dem `AbortController`, der dem übergebenen `AbortSignal` entspricht, verhält sich genauso wie das Aufrufen von `.destroy(new AbortError())` auf dem erstellten lesbaren Objekt.

```js [ESM]
const { Readable } = require('node:stream');
const controller = new AbortController();
const read = new Readable({
  read(size) {
    // ...
  },
  signal: controller.signal,
});
// Später wird der Vorgang abgebrochen und der Stream geschlossen
controller.abort();
```

#### `readable._construct(callback)` {#readable_constructcallback}

**Hinzugefügt in: v15.0.0**

- `callback` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Ruft diese Funktion auf (optional mit einem Fehlerargument), wenn der Stream die Initialisierung abgeschlossen hat.

Die Methode `_construct()` DARF NICHT direkt aufgerufen werden. Sie kann von untergeordneten Klassen implementiert werden und wird, falls dies der Fall ist, nur von den internen Methoden der Klasse `Readable` aufgerufen.

Diese optionale Funktion wird im nächsten Tick durch den Stream-Konstruktor eingeplant, wodurch alle `_read()`- und `_destroy()`-Aufrufe verzögert werden, bis `callback` aufgerufen wird. Dies ist nützlich, um den Status zu initialisieren oder Ressourcen asynchron zu initialisieren, bevor der Stream verwendet werden kann.

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

**Hinzugefügt in: v0.9.4**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der asynchron zu lesenden Bytes

Diese Funktion DARF NICHT direkt von Anwendungscode aufgerufen werden. Sie sollte von untergeordneten Klassen implementiert und nur von den internen Methoden der Klasse `Readable` aufgerufen werden.

Alle `Readable`-Stream-Implementierungen müssen eine Implementierung der Methode [`readable._read()`](/de/nodejs/api/stream#readable_readsize) bereitstellen, um Daten aus der zugrunde liegenden Ressource abzurufen.

Wenn [`readable._read()`](/de/nodejs/api/stream#readable_readsize) aufgerufen wird, sollte die Implementierung, falls Daten aus der Ressource verfügbar sind, beginnen, diese Daten mithilfe der Methode [`this.push(dataChunk)`](/de/nodejs/api/stream#readablepushchunk-encoding) in die Lesewarteschlange zu schieben. `_read()` wird nach jedem Aufruf von [`this.push(dataChunk)`](/de/nodejs/api/stream#readablepushchunk-encoding) erneut aufgerufen, sobald der Stream bereit ist, weitere Daten zu akzeptieren. `_read()` kann weiterhin aus der Ressource lesen und Daten pushen, bis `readable.push()` `false` zurückgibt. Nur wenn `_read()` erneut aufgerufen wird, nachdem es gestoppt hat, sollte es die zusätzlichen Daten wieder in die Warteschlange schieben.

Sobald die Methode [`readable._read()`](/de/nodejs/api/stream#readable_readsize) aufgerufen wurde, wird sie erst wieder aufgerufen, wenn weitere Daten über die Methode [`readable.push()`](/de/nodejs/api/stream#readablepushchunk-encoding) gepusht werden. Leere Daten, wie z. B. leere Puffer und Zeichenketten, führen nicht dazu, dass [`readable._read()`](/de/nodejs/api/stream#readable_readsize) aufgerufen wird.

Das Argument `size` ist ein Ratschlag. Für Implementierungen, bei denen ein "Lesen" eine einzelne Operation ist, die Daten zurückgibt, kann das Argument `size` verwendet werden, um zu bestimmen, wie viele Daten abgerufen werden sollen. Andere Implementierungen können dieses Argument ignorieren und einfach Daten bereitstellen, sobald sie verfügbar sind. Es ist nicht erforderlich, zu "warten", bis `size` Bytes verfügbar sind, bevor [`stream.push(chunk)`](/de/nodejs/api/stream#readablepushchunk-encoding) aufgerufen wird.

Die Methode [`readable._read()`](/de/nodejs/api/stream#readable_readsize) hat ein Präfix mit einem Unterstrich, da sie intern für die Klasse ist, die sie definiert, und niemals direkt von Benutzerprogrammen aufgerufen werden sollte.


#### `readable._destroy(err, callback)` {#readable_destroyerr-callback}

**Hinzugefügt in: v8.0.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Ein möglicher Fehler.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine Callback-Funktion, die ein optionales Fehlerargument entgegennimmt.

Die Methode `_destroy()` wird von [`readable.destroy()`](/de/nodejs/api/stream#readabledestroyerror) aufgerufen. Sie kann von Kindklassen überschrieben werden, darf aber **nicht** direkt aufgerufen werden.

#### `readable.push(chunk[, encoding])` {#readablepushchunk-encoding}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.0.0, v20.13.0 | Das Argument `chunk` kann jetzt eine `TypedArray`- oder `DataView`-Instanz sein. |
| v8.0.0 | Das Argument `chunk` kann jetzt eine `Uint8Array`-Instanz sein. |
:::

- `chunk` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Datenchunk, der in die Lesewarteschlange eingereiht werden soll. Bei Streams, die nicht im Objektmodus arbeiten, muss `chunk` ein [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/de/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) oder [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) sein. Für Objektmodus-Streams kann `chunk` ein beliebiger JavaScript-Wert sein.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Kodierung von String-Chunks. Muss eine gültige `Buffer`-Kodierung sein, wie z. B. `'utf8'` oder `'ascii'`.
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn weitere Datenchunks weiterhin eingereiht werden können; andernfalls `false`.

Wenn `chunk` ein [\<Buffer\>](/de/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) oder [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ist, wird der Datenchunk der internen Warteschlange hinzugefügt, damit Benutzer des Streams ihn verarbeiten können. Das Übergeben von `chunk` als `null` signalisiert das Ende des Streams (EOF), nach dem keine weiteren Daten geschrieben werden können.

Wenn der `Readable` im pausierten Modus arbeitet, können die mit `readable.push()` hinzugefügten Daten durch Aufrufen der Methode [`readable.read()`](/de/nodejs/api/stream#readablereadsize) gelesen werden, wenn das Ereignis [`'readable'`](/de/nodejs/api/stream#event-readable) ausgelöst wird.

Wenn der `Readable` im fließenden Modus arbeitet, werden die mit `readable.push()` hinzugefügten Daten durch Auslösen eines `'data'`-Ereignisses geliefert.

Die Methode `readable.push()` ist so flexibel wie möglich konzipiert. Wenn man beispielsweise eine Low-Level-Quelle umschließt, die eine Art Pause/Resume-Mechanismus und einen Daten-Callback bereitstellt, kann die Low-Level-Quelle durch die benutzerdefinierte `Readable`-Instanz umschlossen werden:

```js [ESM]
// `_source` ist ein Objekt mit readStop()- und readStart()-Methoden,
// und einem `ondata`-Member, das aufgerufen wird, wenn es Daten hat, und
// einem `onend`-Member, das aufgerufen wird, wenn die Daten vorbei sind.

class SourceWrapper extends Readable {
  constructor(options) {
    super(options);

    this._source = getLowLevelSourceObject();

    // Jedes Mal, wenn es Daten gibt, schiebe sie in den internen Puffer.
    this._source.ondata = (chunk) => {
      // Wenn push() false zurückgibt, stoppe das Lesen von der Quelle.
      if (!this.push(chunk))
        this._source.readStop();
    };

    // Wenn die Quelle endet, schiebe den EOF-signalisierenden `null`-Chunk.
    this._source.onend = () => {
      this.push(null);
    };
  }
  // _read() wird aufgerufen, wenn der Stream mehr Daten abrufen möchte.
  // Das beratende Größenargument wird in diesem Fall ignoriert.
  _read(size) {
    this._source.readStart();
  }
}
```
Die Methode `readable.push()` wird verwendet, um den Inhalt in den internen Puffer zu schieben. Sie kann von der Methode [`readable._read()`](/de/nodejs/api/stream#readable_readsize) angetrieben werden.

Für Streams, die nicht im Objektmodus arbeiten, wird der `chunk`-Parameter von `readable.push()`, falls `undefined`, als leere Zeichenkette oder Puffer behandelt. Siehe [`readable.push('')`](/de/nodejs/api/stream#readablepush) für weitere Informationen.


#### Fehler beim Lesen {#errors-while-reading}

Fehler, die während der Verarbeitung von [`readable._read()`](/de/nodejs/api/stream#readable_readsize) auftreten, müssen über die Methode [`readable.destroy(err)`](/de/nodejs/api/stream#readable_destroyerr-callback) weitergegeben werden. Das Auslösen eines `Error` innerhalb von [`readable._read()`](/de/nodejs/api/stream#readable_readsize) oder das manuelle Auslösen eines `'error'`-Ereignisses führt zu undefiniertem Verhalten.

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
#### Ein Beispiel für einen Zähl-Stream {#an-example-counting-stream}

Das Folgende ist ein einfaches Beispiel für einen `Readable`-Stream, der die Ziffern von 1 bis 1.000.000 in aufsteigender Reihenfolge ausgibt und dann endet.

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
### Implementierung eines Duplex-Streams {#implementing-a-duplex-stream}

Ein [`Duplex`](/de/nodejs/api/stream#class-streamduplex)-Stream ist einer, der sowohl [`Readable`](/de/nodejs/api/stream#class-streamreadable) als auch [`Writable`](/de/nodejs/api/stream#class-streamwritable) implementiert, wie z. B. eine TCP-Socket-Verbindung.

Da JavaScript keine Unterstützung für Mehrfachvererbung bietet, wird die Klasse `stream.Duplex` erweitert, um einen [`Duplex`](/de/nodejs/api/stream#class-streamduplex)-Stream zu implementieren (im Gegensatz zur Erweiterung der Klassen `stream.Readable` *und* `stream.Writable`).

Die Klasse `stream.Duplex` erbt prototypisch von `stream.Readable` und parasitär von `stream.Writable`, aber `instanceof` funktioniert aufgrund der Überschreibung von [`Symbol.hasInstance`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance) auf `stream.Writable` für beide Basisklassen korrekt.

Benutzerdefinierte `Duplex`-Streams *müssen* den Konstruktor `new stream.Duplex([options])` aufrufen und *sowohl* die Methoden [`readable._read()`](/de/nodejs/api/stream#readable_readsize) als auch `writable._write()` implementieren.


#### `new stream.Duplex(options)` {#new-streamduplexoptions}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v8.4.0 | Die Optionen `readableHighWaterMark` und `writableHighWaterMark` werden jetzt unterstützt. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Wird sowohl an die Konstruktoren `Writable` als auch `Readable` übergeben. Hat auch die folgenden Felder:
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf `false` gesetzt, beendet der Stream automatisch die beschreibbare Seite, wenn die lesbare Seite endet. **Standard:** `true`.
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Legt fest, ob das `Duplex` lesbar sein soll. **Standard:** `true`.
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Legt fest, ob das `Duplex` beschreibbar sein soll. **Standard:** `true`.
    - `readableObjectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Legt `objectMode` für die lesbare Seite des Streams fest. Hat keine Auswirkung, wenn `objectMode` `true` ist. **Standard:** `false`.
    - `writableObjectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Legt `objectMode` für die beschreibbare Seite des Streams fest. Hat keine Auswirkung, wenn `objectMode` `true` ist. **Standard:** `false`.
    - `readableHighWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt `highWaterMark` für die lesbare Seite des Streams fest. Hat keine Auswirkung, wenn `highWaterMark` angegeben wird.
    - `writableHighWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt `highWaterMark` für die beschreibbare Seite des Streams fest. Hat keine Auswirkung, wenn `highWaterMark` angegeben wird.

```js [ESM]
const { Duplex } = require('node:stream');

class MyDuplex extends Duplex {
  constructor(options) {
    super(options);
    // ...
  }
}
```
Oder bei Verwendung von Pre-ES6-Style-Konstruktoren:

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
Oder mit dem vereinfachten Konstruktoransatz:

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
Bei Verwendung von Pipeline:

```js [ESM]
const { Transform, pipeline } = require('node:stream');
const fs = require('node:fs');

pipeline(
  fs.createReadStream('object.json')
    .setEncoding('utf8'),
  new Transform({
    decodeStrings: false, // Akzeptiert String-Eingabe anstelle von Buffers
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
        // Sicherstellen, dass es sich um gültiges JSON handelt.
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
      console.error('Fehlgeschlagen', err);
    } else {
      console.log('Abgeschlossen');
    }
  },
);
```

#### Ein Beispiel für einen Duplex-Stream {#an-example-duplex-stream}

Das Folgende veranschaulicht ein einfaches Beispiel für einen `Duplex`-Stream, der ein hypothetisches Low-Level-Quellobjekt umschließt, in das Daten geschrieben und aus dem Daten gelesen werden können, jedoch unter Verwendung einer API, die nicht mit Node.js-Streams kompatibel ist. Das Folgende veranschaulicht ein einfaches Beispiel für einen `Duplex`-Stream, der eingehende geschriebene Daten über die [`Writable`](/de/nodejs/api/stream#class-streamwritable)-Schnittstelle puffert, die über die [`Readable`](/de/nodejs/api/stream#class-streamreadable)-Schnittstelle wieder ausgelesen werden.

```js [ESM]
const { Duplex } = require('node:stream');
const kSource = Symbol('source');

class MyDuplex extends Duplex {
  constructor(source, options) {
    super(options);
    this[kSource] = source;
  }

  _write(chunk, encoding, callback) {
    // Die zugrunde liegende Quelle verarbeitet nur Strings.
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
Der wichtigste Aspekt eines `Duplex`-Streams ist, dass die `Readable`- und `Writable`-Seiten unabhängig voneinander arbeiten, obwohl sie innerhalb einer einzelnen Objektinstanz koexistieren.

#### Objektmodus-Duplex-Streams {#object-mode-duplex-streams}

Für `Duplex`-Streams kann `objectMode` ausschließlich für die `Readable`- oder `Writable`-Seite mithilfe der Optionen `readableObjectMode` bzw. `writableObjectMode` festgelegt werden.

Im folgenden Beispiel wird beispielsweise ein neuer `Transform`-Stream (der ein Typ von [`Duplex`](/de/nodejs/api/stream#class-streamduplex)-Stream ist) erstellt, der eine `Writable`-Seite im Objektmodus hat, die JavaScript-Zahlen akzeptiert, die auf der `Readable`-Seite in hexadezimale Strings konvertiert werden.

```js [ESM]
const { Transform } = require('node:stream');

// Alle Transform-Streams sind auch Duplex-Streams.
const myTransform = new Transform({
  writableObjectMode: true,

  transform(chunk, encoding, callback) {
    // Erzwinge den Chunk bei Bedarf zu einer Zahl.
    chunk |= 0;

    // Transformiere den Chunk in etwas anderes.
    const data = chunk.toString(16);

    // Füge die Daten zur lesbaren Warteschlange hinzu.
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

### Implementierung eines Transform-Streams {#implementing-a-transform-stream}

Ein [`Transform`](/de/nodejs/api/stream#class-streamtransform)-Stream ist ein [`Duplex`](/de/nodejs/api/stream#class-streamduplex)-Stream, bei dem die Ausgabe auf irgendeine Weise aus der Eingabe berechnet wird. Beispiele hierfür sind [zlib](/de/nodejs/api/zlib)-Streams oder [crypto](/de/nodejs/api/crypto)-Streams, die Daten komprimieren, verschlüsseln oder entschlüsseln.

Es gibt keine Anforderung, dass die Ausgabe die gleiche Größe wie die Eingabe, die gleiche Anzahl von Chunks oder zur gleichen Zeit eintreffen muss. Beispielsweise hat ein `Hash`-Stream immer nur einen einzigen Chunk an Ausgabe, der bereitgestellt wird, wenn die Eingabe beendet ist. Ein `zlib`-Stream erzeugt eine Ausgabe, die entweder viel kleiner oder viel größer als seine Eingabe ist.

Die `stream.Transform`-Klasse wird erweitert, um einen [`Transform`](/de/nodejs/api/stream#class-streamtransform)-Stream zu implementieren.

Die `stream.Transform`-Klasse erbt prototypisch von `stream.Duplex` und implementiert ihre eigenen Versionen der `writable._write()`- und [`readable._read()`](/de/nodejs/api/stream#readable_readsize)-Methoden. Benutzerdefinierte `Transform`-Implementierungen *müssen* die [`transform._transform()`](/de/nodejs/api/stream#transform_transformchunk-encoding-callback)-Methode implementieren und *können* auch die [`transform._flush()`](/de/nodejs/api/stream#transform_flushcallback)-Methode implementieren.

Bei der Verwendung von `Transform`-Streams ist Vorsicht geboten, da Daten, die in den Stream geschrieben werden, dazu führen können, dass die `Writable`-Seite des Streams pausiert, wenn die Ausgabe auf der `Readable`-Seite nicht verarbeitet wird.

#### `new stream.Transform([options])` {#new-streamtransformoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Wird sowohl an die `Writable`- als auch an die `Readable`-Konstruktoren übergeben. Hat auch die folgenden Felder:
    - `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementierung für die [`stream._transform()`](/de/nodejs/api/stream#transform_transformchunk-encoding-callback)-Methode.
    - `flush` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementierung für die [`stream._flush()`](/de/nodejs/api/stream#transform_flushcallback)-Methode.


```js [ESM]
const { Transform } = require('node:stream');

class MyTransform extends Transform {
  constructor(options) {
    super(options);
    // ...
  }
}
```
Oder bei Verwendung von Pre-ES6-Style-Konstruktoren:

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
Oder unter Verwendung des vereinfachten Konstruktoransatzes:

```js [ESM]
const { Transform } = require('node:stream');

const myTransform = new Transform({
  transform(chunk, encoding, callback) {
    // ...
  },
});
```

#### Ereignis: `'end'` {#event-end_1}

Das [`'end'`](/de/nodejs/api/stream#event-end)-Ereignis stammt von der `stream.Readable`-Klasse. Das `'end'`-Ereignis wird ausgegeben, nachdem alle Daten ausgegeben wurden, was nach dem Aufruf des Callbacks in [`transform._flush()`](/de/nodejs/api/stream#transform_flushcallback) geschieht. Im Fehlerfall sollte `'end'` nicht ausgegeben werden.

#### Ereignis: `'finish'` {#event-finish_1}

Das [`'finish'`](/de/nodejs/api/stream#event-finish)-Ereignis stammt von der `stream.Writable`-Klasse. Das `'finish'`-Ereignis wird ausgegeben, nachdem [`stream.end()`](/de/nodejs/api/stream#writableendchunk-encoding-callback) aufgerufen wurde und alle Chunks von [`stream._transform()`](/de/nodejs/api/stream#transform_transformchunk-encoding-callback) verarbeitet wurden. Im Fehlerfall sollte `'finish'` nicht ausgegeben werden.

#### `transform._flush(callback)` {#transform_flushcallback}

- `callback` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine Callback-Funktion (optional mit einem Fehlerargument und Daten), die aufgerufen wird, wenn die verbleibenden Daten geleert wurden.

Diese Funktion DARF NICHT direkt vom Anwendungscode aufgerufen werden. Sie sollte von Unterklassen implementiert und nur von den internen `Readable`-Klassenmethoden aufgerufen werden.

In einigen Fällen muss eine Transformationsoperation am Ende des Streams möglicherweise noch ein zusätzliches Datenbit ausgeben. Beispielsweise speichert ein `zlib`-Komprimierungsstream einen internen Zustand, der verwendet wird, um die Ausgabe optimal zu komprimieren. Wenn der Stream jedoch endet, müssen diese zusätzlichen Daten geleert werden, damit die komprimierten Daten vollständig sind.

Benutzerdefinierte [`Transform`](/de/nodejs/api/stream#class-streamtransform)-Implementierungen *können* die `transform._flush()`-Methode implementieren. Diese wird aufgerufen, wenn keine weiteren zu verarbeitenden Daten geschrieben wurden, aber bevor das Ereignis [`'end'`](/de/nodejs/api/stream#event-end) ausgegeben wird, das das Ende des [`Readable`](/de/nodejs/api/stream#class-streamreadable)-Streams signalisiert.

Innerhalb der `transform._flush()`-Implementierung kann die `transform.push()`-Methode null oder mehrmals aufgerufen werden, je nach Bedarf. Die `callback`-Funktion muss aufgerufen werden, wenn die Flush-Operation abgeschlossen ist.

Die `transform._flush()`-Methode hat ein Unterstrich-Präfix, da sie intern für die Klasse ist, die sie definiert, und niemals direkt von Benutzerprogrammen aufgerufen werden sollte.


#### `transform._transform(chunk, encoding, callback)` {#transform_transformchunk-encoding-callback}

- `chunk` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Der `Buffer`, der transformiert werden soll, konvertiert von dem `string`, der an [`stream.write()`](/de/nodejs/api/stream#writablewritechunk-encoding-callback) übergeben wurde. Wenn die Option `decodeStrings` des Streams `false` ist oder der Stream im Objektmodus arbeitet, wird der Chunk nicht konvertiert und ist das, was an [`stream.write()`](/de/nodejs/api/stream#writablewritechunk-encoding-callback) übergeben wurde.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn der Chunk ein String ist, dann ist dies der Encoding-Typ. Wenn Chunk ein Buffer ist, dann ist dies der spezielle Wert `'buffer'`. Ignoriere ihn in diesem Fall.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine Callback-Funktion (optional mit einem Fehlerargument und Daten), die aufgerufen werden soll, nachdem der bereitgestellte `chunk` verarbeitet wurde.

Diese Funktion DARF NICHT direkt vom Anwendungscode aufgerufen werden. Sie sollte von Kindklassen implementiert und nur von den internen Methoden der `Readable`-Klasse aufgerufen werden.

Alle `Transform`-Stream-Implementierungen müssen eine `_transform()`-Methode bereitstellen, um Eingaben zu akzeptieren und Ausgaben zu erzeugen. Die `transform._transform()`-Implementierung verarbeitet die geschriebenen Bytes, berechnet eine Ausgabe und übergibt diese Ausgabe dann mithilfe der Methode `transform.push()` an den lesbaren Teil.

Die Methode `transform.push()` kann null oder mehrmals aufgerufen werden, um Ausgaben aus einem einzelnen Eingabe-Chunk zu generieren, je nachdem, wie viel als Ergebnis des Chunks ausgegeben werden soll.

Es ist möglich, dass aus einem bestimmten Chunk von Eingabedaten keine Ausgabe generiert wird.

Die `callback`-Funktion muss nur aufgerufen werden, wenn der aktuelle Chunk vollständig verbraucht ist. Das erste Argument, das an den `callback` übergeben wird, muss ein `Error`-Objekt sein, wenn beim Verarbeiten der Eingabe ein Fehler aufgetreten ist, oder `null`, falls nicht. Wenn ein zweites Argument an den `callback` übergeben wird, wird es an die `transform.push()`-Methode weitergeleitet, aber nur, wenn das erste Argument falsch ist. Mit anderen Worten, die folgenden sind äquivalent:

```js [ESM]
transform.prototype._transform = function(data, encoding, callback) {
  this.push(data);
  callback();
};

transform.prototype._transform = function(data, encoding, callback) {
  callback(null, data);
};
```
Die Methode `transform._transform()` hat ein Präfix mit einem Unterstrich, da sie intern für die Klasse ist, die sie definiert, und niemals direkt von Benutzerprogrammen aufgerufen werden sollte.

`transform._transform()` wird niemals parallel aufgerufen; Streams implementieren einen Warteschlangenmechanismus, und um den nächsten Chunk zu empfangen, muss `callback` entweder synchron oder asynchron aufgerufen werden.


#### Klasse: `stream.PassThrough` {#class-streampassthrough}

Die Klasse `stream.PassThrough` ist eine triviale Implementierung eines [`Transform`](/de/nodejs/api/stream#class-streamtransform)-Streams, der die Eingangs-Bytes einfach an den Ausgang weiterleitet. Ihr Zweck liegt primär in Beispielen und Tests, aber es gibt einige Anwendungsfälle, in denen `stream.PassThrough` als Baustein für neuartige Stream-Arten nützlich ist.

## Zusätzliche Hinweise {#additional-notes}

### Stream-Kompatibilität mit Async-Generatoren und Async-Iteratoren {#streams-compatibility-with-async-generators-and-async-iterators}

Mit der Unterstützung von Async-Generatoren und -Iteratoren in JavaScript sind Async-Generatoren effektiv ein erstklassiges Sprachkonstrukt für Streams geworden.

Einige gängige Interop-Fälle der Verwendung von Node.js-Streams mit Async-Generatoren und Async-Iteratoren werden unten aufgeführt.

#### Verbrauchen von lesbaren Streams mit Async-Iteratoren {#consuming-readable-streams-with-async-iterators}

```js [ESM]
(async function() {
  for await (const chunk of readable) {
    console.log(chunk);
  }
})();
```
Async-Iteratoren registrieren einen permanenten Fehlerhandler für den Stream, um nicht behandelte Fehler nach der Zerstörung zu verhindern.

#### Erstellen von lesbaren Streams mit Async-Generatoren {#creating-readable-streams-with-async-generators}

Ein lesbarer Node.js-Stream kann mit der Utility-Methode `Readable.from()` aus einem asynchronen Generator erstellt werden:

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
#### Weiterleiten an beschreibbare Streams von Async-Iteratoren {#piping-to-writable-streams-from-async-iterators}

Achten Sie beim Schreiben in einen beschreibbaren Stream von einem Async-Iterator auf die korrekte Behandlung von Gegendruck und Fehlern. [`stream.pipeline()`](/de/nodejs/api/stream#streampipelinesource-transforms-destination-callback) abstrahiert die Behandlung von Gegendruck und Gegendruck-bezogenen Fehlern:

```js [ESM]
const fs = require('node:fs');
const { pipeline } = require('node:stream');
const { pipeline: pipelinePromise } = require('node:stream/promises');

const writable = fs.createWriteStream('./file');

const ac = new AbortController();
const signal = ac.signal;

const iterator = createIterator({ signal });

// Callback-Muster
pipeline(iterator, writable, (err, value) => {
  if (err) {
    console.error(err);
  } else {
    console.log(value, 'value returned');
  }
}).on('close', () => {
  ac.abort();
});

// Promise-Muster
pipelinePromise(iterator, writable)
  .then((value) => {
    console.log(value, 'value returned');
  })
  .catch((err) => {
    console.error(err);
    ac.abort();
  });
```

### Kompatibilität mit älteren Node.js-Versionen {#compatibility-with-older-nodejs-versions}

Vor Node.js 0.10 war die `Readable`-Stream-Schnittstelle einfacher, aber auch weniger leistungsstark und nützlich.

- Anstatt auf Aufrufe der [`stream.read()`](/de/nodejs/api/stream#readablereadsize)-Methode zu warten, begannen [`'data'`](/de/nodejs/api/stream#event-data)-Ereignisse sofort auszusenden. Anwendungen, die eine gewisse Bearbeitungszeit benötigten, um zu entscheiden, wie Daten zu verarbeiten sind, mussten gelesene Daten in Puffer speichern, damit die Daten nicht verloren gehen.
- Die [`stream.pause()`](/de/nodejs/api/stream#readablepause)-Methode war eher beratend als garantiert. Dies bedeutete, dass es immer noch notwendig war, darauf vorbereitet zu sein, [`'data'`](/de/nodejs/api/stream#event-data)-Ereignisse zu empfangen, *auch wenn sich der Stream in einem pausierten Zustand befand*.

In Node.js 0.10 wurde die [`Readable`](/de/nodejs/api/stream#class-streamreadable)-Klasse hinzugefügt. Aus Gründen der Abwärtskompatibilität mit älteren Node.js-Programmen wechseln `Readable`-Streams in den "Flowing Mode", wenn ein [`'data'`](/de/nodejs/api/stream#event-data)-Ereignishandler hinzugefügt wird oder wenn die [`stream.resume()`](/de/nodejs/api/stream#readableresume)-Methode aufgerufen wird. Der Effekt ist, dass es, selbst wenn die neue [`stream.read()`](/de/nodejs/api/stream#readablereadsize)-Methode und das [`'readable'`](/de/nodejs/api/stream#event-readable)-Ereignis nicht verwendet werden, nicht mehr notwendig ist, sich Sorgen über den Verlust von [`'data'`](/de/nodejs/api/stream#event-data)-Chunks zu machen.

Während die meisten Anwendungen weiterhin normal funktionieren, führt dies zu einem Sonderfall unter den folgenden Bedingungen:

- Es wird kein [`'data'`](/de/nodejs/api/stream#event-data)-Ereignis-Listener hinzugefügt.
- Die [`stream.resume()`](/de/nodejs/api/stream#readableresume)-Methode wird nie aufgerufen.
- Der Stream wird nicht an ein beschreibbares Ziel weitergeleitet.

Betrachten Sie zum Beispiel den folgenden Code:

```js [ESM]
// WARNUNG!  FEHLERHAFT!
net.createServer((socket) => {

  // Wir fügen einen 'end'-Listener hinzu, verbrauchen aber nie die Daten.
  socket.on('end', () => {
    // Dies wird nie erreicht.
    socket.end('Die Nachricht wurde empfangen, aber nicht verarbeitet.\n');
  });

}).listen(1337);
```
Vor Node.js 0.10 wurden die eingehenden Nachrichtendaten einfach verworfen. In Node.js 0.10 und darüber bleibt der Socket jedoch für immer pausiert.

Die Problemumgehung in dieser Situation besteht darin, die [`stream.resume()`](/de/nodejs/api/stream#readableresume)-Methode aufzurufen, um den Datenfluss zu starten:

```js [ESM]
// Problemumgehung.
net.createServer((socket) => {
  socket.on('end', () => {
    socket.end('Die Nachricht wurde empfangen, aber nicht verarbeitet.\n');
  });

  // Starten Sie den Datenfluss und verwerfen Sie ihn.
  socket.resume();
}).listen(1337);
```
Zusätzlich zum Umschalten neuer `Readable`-Streams in den Flowing Mode können Streams im Pre-0.10-Stil mit der [`readable.wrap()`](/de/nodejs/api/stream#readablewrapstream)-Methode in eine `Readable`-Klasse verpackt werden.


### `readable.read(0)` {#readableread0}

Es gibt einige Fälle, in denen es notwendig ist, eine Aktualisierung der zugrunde liegenden lesbaren Stream-Mechanismen auszulösen, ohne tatsächlich Daten zu verbrauchen. In solchen Fällen ist es möglich, `readable.read(0)` aufzurufen, was immer `null` zurückgibt.

Wenn der interne Lesepuffer unter dem `highWaterMark` liegt und der Stream gerade nicht liest, löst der Aufruf von `stream.read(0)` einen Low-Level-[`stream._read()`](/de/nodejs/api/stream#readable_readsize)-Aufruf aus.

Während die meisten Anwendungen dies fast nie tun müssen, gibt es Situationen innerhalb von Node.js, in denen dies geschieht, insbesondere in den Interna der `Readable`-Stream-Klasse.

### `readable.push('')` {#readablepush}

Die Verwendung von `readable.push('')` wird nicht empfohlen.

Das Hinzufügen eines Null-Byte-[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/de/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) oder [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) zu einem Stream, der sich nicht im Objektmodus befindet, hat einen interessanten Nebeneffekt. Da es sich *um* einen Aufruf von [`readable.push()`](/de/nodejs/api/stream#readablepushchunk-encoding) handelt, beendet der Aufruf den Leseprozess. Da das Argument jedoch eine leere Zeichenkette ist, werden dem lesbaren Puffer keine Daten hinzugefügt, sodass ein Benutzer nichts verbrauchen kann.

### `highWaterMark`-Diskrepanz nach dem Aufruf von `readable.setEncoding()` {#highwatermark-discrepancy-after-calling-readablesetencoding}

Die Verwendung von `readable.setEncoding()` ändert das Verhalten der Funktionsweise von `highWaterMark` im Nicht-Objektmodus.

Typischerweise wird die Größe des aktuellen Puffers mit dem `highWaterMark` in *Bytes* gemessen. Nachdem jedoch `setEncoding()` aufgerufen wurde, beginnt die Vergleichsfunktion, die Größe des Puffers in *Zeichen* zu messen.

Dies ist in üblichen Fällen mit `latin1` oder `ascii` kein Problem. Es wird jedoch empfohlen, dieses Verhalten zu beachten, wenn Sie mit Zeichenketten arbeiten, die Mehrbytezeichen enthalten könnten.

