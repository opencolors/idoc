---
title: Node.js Web Streams API
description: Dokumentation der Web Streams API in Node.js, die beschreibt, wie man mit Streams für eine effiziente Datenverarbeitung arbeitet, einschließlich lesbare, schreibbare und Transformations-Streams.
head:
  - - meta
    - name: og:title
      content: Node.js Web Streams API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Dokumentation der Web Streams API in Node.js, die beschreibt, wie man mit Streams für eine effiziente Datenverarbeitung arbeitet, einschließlich lesbare, schreibbare und Transformations-Streams.
  - - meta
    - name: twitter:title
      content: Node.js Web Streams API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Dokumentation der Web Streams API in Node.js, die beschreibt, wie man mit Streams für eine effiziente Datenverarbeitung arbeitet, einschließlich lesbare, schreibbare und Transformations-Streams.
---


# Web Streams API {#web-streams-api}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.0.0 | Nicht mehr experimentell. |
| v18.0.0 | Die Verwendung dieser API gibt keine Laufzeitwarnung mehr aus. |
| v16.5.0 | Hinzugefügt in: v16.5.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Eine Implementierung des [WHATWG Streams Standard](https://streams.spec.whatwg.org/).

## Übersicht {#overview}

Der [WHATWG Streams Standard](https://streams.spec.whatwg.org/) (oder "Web Streams") definiert eine API für die Verarbeitung von Streaming-Daten. Sie ähnelt der Node.js [Streams](/de/nodejs/api/stream) API, ist aber später entstanden und hat sich zur "Standard"-API für das Streamen von Daten in vielen JavaScript-Umgebungen entwickelt.

Es gibt drei Haupttypen von Objekten:

- `ReadableStream` - Stellt eine Quelle für Streaming-Daten dar.
- `WritableStream` - Stellt ein Ziel für Streaming-Daten dar.
- `TransformStream` - Stellt einen Algorithmus zur Transformation von Streaming-Daten dar.

### Beispiel `ReadableStream` {#example-readablestream}

Dieses Beispiel erstellt einen einfachen `ReadableStream`, der den aktuellen `performance.now()`-Zeitstempel einmal pro Sekunde für immer ausgibt. Ein asynchrones Iterable wird verwendet, um die Daten aus dem Stream zu lesen.

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

### Klasse: `ReadableStream` {#class-readablestream}

::: info [Historie]
| Version | Änderungen |
|---|---|
| v18.0.0 | Diese Klasse ist jetzt im globalen Objekt verfügbar. |
| v16.5.0 | Hinzugefügt in: v16.5.0 |
:::

#### `new ReadableStream([underlyingSource [, strategy]])` {#new-readablestreamunderlyingsource--strategy}

**Hinzugefügt in: v16.5.0**

- `underlyingSource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine benutzerdefinierte Funktion, die unmittelbar beim Erstellen des `ReadableStream` aufgerufen wird.
    - `controller` [\<ReadableStreamDefaultController\>](/de/nodejs/api/webstreams#class-readablestreamdefaultcontroller) | [\<ReadableByteStreamController\>](/de/nodejs/api/webstreams#class-readablebytestreamcontroller)
    - Gibt zurück: `undefined` oder ein Promise, das mit `undefined` erfüllt wird.


    - `pull` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine benutzerdefinierte Funktion, die wiederholt aufgerufen wird, wenn die interne Warteschlange des `ReadableStream` nicht voll ist. Die Operation kann synchron oder asynchron sein. Wenn asynchron, wird die Funktion erst wieder aufgerufen, wenn das zuvor zurückgegebene Promise erfüllt ist.
    - `controller` [\<ReadableStreamDefaultController\>](/de/nodejs/api/webstreams#class-readablestreamdefaultcontroller) | [\<ReadableByteStreamController\>](/de/nodejs/api/webstreams#class-readablebytestreamcontroller)
    - Gibt zurück: Ein Promise, das mit `undefined` erfüllt wird.


    - `cancel` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine benutzerdefinierte Funktion, die aufgerufen wird, wenn der `ReadableStream` abgebrochen wird.
    - `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Gibt zurück: Ein Promise, das mit `undefined` erfüllt wird.


    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss `'bytes'` oder `undefined` sein.
    - `autoAllocateChunkSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wird nur verwendet, wenn `type` gleich `'bytes'` ist. Wenn auf einen Wert ungleich Null gesetzt, wird automatisch ein View-Buffer für `ReadableByteStreamController.byobRequest` zugewiesen. Wenn nicht festgelegt, muss man die internen Warteschlangen des Streams verwenden, um Daten über den Standardleser `ReadableStreamDefaultReader` zu übertragen.


- `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die maximale interne Warteschlangengröße, bevor Gegendruck ausgeübt wird.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine benutzerdefinierte Funktion, die verwendet wird, um die Größe jedes Datenchunks zu identifizieren.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Gibt zurück: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


#### `readableStream.locked` {#readablestreamlocked}

**Hinzugefügt in: v16.5.0**

- Typ: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ist auf `true` gesetzt, wenn es einen aktiven Leser für diesen [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) gibt.

Die Eigenschaft `readableStream.locked` ist standardmäßig `false` und wird auf `true` gesetzt, solange ein aktiver Leser die Daten des Streams konsumiert.

#### `readableStream.cancel([reason])` {#readablestreamcancelreason}

**Hinzugefügt in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Rückgabe: Ein Promise, das mit `undefined` erfüllt wird, sobald die Abbruch abgeschlossen ist.

#### `readableStream.getReader([options])` {#readablestreamgetreaderoptions}

**Hinzugefügt in: v16.5.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'byob'` oder `undefined`


- Rückgabe: [\<ReadableStreamDefaultReader\>](/de/nodejs/api/webstreams#class-readablestreamdefaultreader) | [\<ReadableStreamBYOBReader\>](/de/nodejs/api/webstreams#class-readablestreambyobreader)



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

Führt dazu, dass `readableStream.locked` auf `true` gesetzt wird.

#### `readableStream.pipeThrough(transform[, options])` {#readablestreampipethroughtransform-options}

**Hinzugefügt in: v16.5.0**

- `transform` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) Der `ReadableStream`, an den `transform.writable` die potenziell modifizierten Daten pusht, die er von diesem `ReadableStream` empfängt.
    - `writable` [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream) Der `WritableStream`, in den die Daten dieses `ReadableStream` geschrieben werden.


- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preventAbort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, führen Fehler in diesem `ReadableStream` nicht dazu, dass `transform.writable` abgebrochen wird.
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, führen Fehler im Ziel `transform.writable` nicht dazu, dass dieser `ReadableStream` abgebrochen wird.
    - `preventClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, führt das Schließen dieses `ReadableStream` nicht dazu, dass `transform.writable` geschlossen wird.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ermöglicht das Abbrechen der Datenübertragung mithilfe eines [\<AbortController\>](/de/nodejs/api/globals#class-abortcontroller).


- Rückgabe: [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) Von `transform.readable`.

Verbindet diesen [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) mit dem Paar [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) und [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream), das im Argument `transform` bereitgestellt wird, so dass die Daten aus diesem [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) in `transform.writable` geschrieben, möglicherweise transformiert und dann an `transform.readable` weitergeleitet werden. Sobald die Pipeline konfiguriert ist, wird `transform.readable` zurückgegeben.

Führt dazu, dass `readableStream.locked` auf `true` gesetzt wird, solange der Pipe-Vorgang aktiv ist.



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

**Hinzugefügt in: v16.5.0**

- `destination` [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream) Ein [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream), in den die Daten dieses `ReadableStream` geschrieben werden.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preventAbort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, führen Fehler in diesem `ReadableStream` nicht dazu, dass `destination` abgebrochen wird.
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, führen Fehler im `destination` nicht dazu, dass dieser `ReadableStream` abgebrochen wird.
    - `preventClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, führt das Schließen dieses `ReadableStream` nicht dazu, dass `destination` geschlossen wird.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ermöglicht das Abbrechen der Datenübertragung mithilfe eines [\<AbortController\>](/de/nodejs/api/globals#class-abortcontroller).


- Gibt zurück: Ein Promise, das mit `undefined` erfüllt wird.

Führt dazu, dass `readableStream.locked` auf `true` gesetzt wird, während der Pipe-Vorgang aktiv ist.

#### `readableStream.tee()` {#readablestreamtee}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.10.0, v16.18.0 | Unterstützung für das Verzweigen eines lesbaren Byte-Streams. |
| v16.5.0 | Hinzugefügt in: v16.5.0 |
:::

- Gibt zurück: [\<ReadableStream[]\>](/de/nodejs/api/webstreams#class-readablestream)

Gibt ein Paar neuer [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream)-Instanzen zurück, an die die Daten dieses `ReadableStream` weitergeleitet werden. Jeder erhält die gleichen Daten.

Führt dazu, dass `readableStream.locked` auf `true` gesetzt wird.

#### `readableStream.values([options])` {#readablestreamvaluesoptions}

**Hinzugefügt in: v16.5.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, verhindert das Schließen des [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream), wenn der asynchrone Iterator abrupt beendet wird. **Standard**: `false`.



Erstellt und gibt einen asynchronen Iterator zurück, der zum Konsumieren der Daten dieses `ReadableStream` verwendet werden kann.

Führt dazu, dass `readableStream.locked` auf `true` gesetzt wird, während der asynchrone Iterator aktiv ist.

```js [ESM]
import { Buffer } from 'node:buffer';

const stream = new ReadableStream(getSomeSource());

for await (const chunk of stream.values({ preventCancel: true }))
  console.log(Buffer.from(chunk).toString());
```

#### Asynchrone Iteration {#async-iteration}

Das [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream)-Objekt unterstützt das asynchrone Iteratorprotokoll mithilfe der `for await`-Syntax.

```js [ESM]
import { Buffer } from 'node:buffer';

const stream = new ReadableStream(getSomeSource());

for await (const chunk of stream)
  console.log(Buffer.from(chunk).toString());
```
Der asynchrone Iterator wird den [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) konsumieren, bis er terminiert.

Standardmäßig wird der [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) geschlossen, wenn der asynchrone Iterator frühzeitig beendet wird (entweder durch ein `break`, `return` oder ein `throw`). Um das automatische Schließen des [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) zu verhindern, verwende die Methode `readableStream.values()`, um den asynchronen Iterator zu erhalten und die Option `preventCancel` auf `true` zu setzen.

Der [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) darf nicht gesperrt sein (d. h. er darf keinen vorhandenen aktiven Leser haben). Während der asynchronen Iteration wird der [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) gesperrt.

#### Übertragung mit `postMessage()` {#transferring-with-postmessage}

Eine [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream)-Instanz kann mithilfe eines [\<MessagePort\>](/de/nodejs/api/worker_threads#class-messageport) übertragen werden.

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

**Hinzugefügt in: v20.6.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) Objekt, das das Iterable-Protokoll `Symbol.asyncIterator` oder `Symbol.iterator` implementiert.

Eine Hilfsmethode, die einen neuen [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) aus einem Iterable erstellt.



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


### Klasse: `ReadableStreamDefaultReader` {#class-readablestreamdefaultreader}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Diese Klasse ist jetzt im globalen Objekt verfügbar. |
| v16.5.0 | Hinzugefügt in: v16.5.0 |
:::

Standardmäßig gibt der Aufruf von `readableStream.getReader()` ohne Argumente eine Instanz von `ReadableStreamDefaultReader` zurück. Der Standard-Reader behandelt die Datenchunks, die durch den Stream geleitet werden, als opake Werte, wodurch der [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) im Allgemeinen mit jedem JavaScript-Wert arbeiten kann.

#### `new ReadableStreamDefaultReader(stream)` {#new-readablestreamdefaultreaderstream}

**Hinzugefügt in: v16.5.0**

- `stream` [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream)

Erstellt einen neuen [\<ReadableStreamDefaultReader\>](/de/nodejs/api/webstreams#class-readablestreamdefaultreader), der an den angegebenen [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) gebunden ist.

#### `readableStreamDefaultReader.cancel([reason])` {#readablestreamdefaultreadercancelreason}

**Hinzugefügt in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: Ein Promise, das mit `undefined` erfüllt wird.

Bricht den [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) ab und gibt ein Promise zurück, das erfüllt wird, wenn der zugrunde liegende Stream abgebrochen wurde.

#### `readableStreamDefaultReader.closed` {#readablestreamdefaultreaderclosed}

**Hinzugefügt in: v16.5.0**

- Typ: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Erfüllt mit `undefined`, wenn der zugehörige [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) geschlossen wird, oder abgelehnt, wenn der Stream Fehler verursacht oder die Sperre des Readers freigegeben wird, bevor der Stream mit dem Schließen fertig ist.

#### `readableStreamDefaultReader.read()` {#readablestreamdefaultreaderread}

**Hinzugefügt in: v16.5.0**

- Gibt zurück: Ein Promise, das mit einem Objekt erfüllt wird:
    - `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `done` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Fordert den nächsten Datenchunk vom zugrunde liegenden [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) an und gibt ein Promise zurück, das mit den Daten erfüllt wird, sobald diese verfügbar sind.


#### `readableStreamDefaultReader.releaseLock()` {#readablestreamdefaultreaderreleaselock}

**Hinzugefügt in: v16.5.0**

Gibt die Sperre dieses Readers für den zugrunde liegenden [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) frei.

### Klasse: `ReadableStreamBYOBReader` {#class-readablestreambyobreader}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Diese Klasse ist jetzt im globalen Objekt verfügbar. |
| v16.5.0 | Hinzugefügt in: v16.5.0 |
:::

Der `ReadableStreamBYOBReader` ist ein alternativer Konsument für byte-orientierte [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream)s (solche, die mit `underlyingSource.type` gleich `'bytes'` erstellt wurden, als der `ReadableStream` erstellt wurde).

Das `BYOB` steht kurz für "bring your own buffer" (bringe deinen eigenen Puffer mit). Dies ist ein Muster, das ein effizienteres Lesen von byte-orientierten Daten ermöglicht, das unnötiges Kopieren vermeidet.

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

**Hinzugefügt in: v16.5.0**

- `stream` [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream)

Erstellt einen neuen `ReadableStreamBYOBReader`, der an den gegebenen [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) gebunden ist.


#### `readableStreamBYOBReader.cancel([reason])` {#readablestreambyobreadercancelreason}

**Hinzugefügt in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: Ein Promise, das mit `undefined` erfüllt wird.

Bricht den [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) ab und gibt ein Promise zurück, das erfüllt wird, wenn der zugrunde liegende Stream abgebrochen wurde.

#### `readableStreamBYOBReader.closed` {#readablestreambyobreaderclosed}

**Hinzugefügt in: v16.5.0**

- Typ: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit `undefined` erfüllt, wenn der zugehörige [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) geschlossen wird, oder abgelehnt, wenn der Stream Fehler aufweist oder die Sperre des Readers freigegeben wird, bevor der Stream den Schließvorgang abgeschlossen hat.

#### `readableStreamBYOBReader.read(view[, options])` {#readablestreambyobreaderreadview-options}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.7.0, v20.17.0 | Option `min` hinzugefügt. |
| v16.5.0 | Hinzugefügt in: v16.5.0 |
:::

- `view` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `min` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wenn gesetzt, wird das zurückgegebene Promise erst erfüllt, sobald `min` Anzahl von Elementen verfügbar sind. Wenn nicht gesetzt, wird das Promise erfüllt, wenn mindestens ein Element verfügbar ist.


- Gibt zurück: Ein Promise, das mit einem Objekt erfüllt wird:
    - `value` [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `done` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)


Fordert den nächsten Datenblock vom zugrunde liegenden [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) an und gibt ein Promise zurück, das mit den Daten erfüllt wird, sobald diese verfügbar sind.

Übergeben Sie keine gepoolte [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)-Objektinstanz an diese Methode. Gepoolte `Buffer`-Objekte werden mit `Buffer.allocUnsafe()` oder `Buffer.from()` erstellt oder oft von verschiedenen `node:fs`-Modul-Callbacks zurückgegeben. Diese Arten von `Buffer`n verwenden ein gemeinsam genutztes zugrunde liegendes [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)-Objekt, das alle Daten aus allen gepoolten `Buffer`-Instanzen enthält. Wenn ein `Buffer`, [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) oder [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) an `readableStreamBYOBReader.read()` übergeben wird, wird das zugrunde liegende `ArrayBuffer` der Ansicht *getrennt*, wodurch alle vorhandenen Ansichten, die möglicherweise in diesem `ArrayBuffer` vorhanden sind, ungültig werden. Dies kann katastrophale Folgen für Ihre Anwendung haben.


#### `readableStreamBYOBReader.releaseLock()` {#readablestreambyobreaderreleaselock}

**Hinzugefügt in: v16.5.0**

Gibt die Sperre dieses Readers für den zugrunde liegenden [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) frei.

### Klasse: `ReadableStreamDefaultController` {#class-readablestreamdefaultcontroller}

**Hinzugefügt in: v16.5.0**

Jeder [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) verfügt über einen Controller, der für den internen Zustand und die Verwaltung der Stream-Warteschlange verantwortlich ist. Der `ReadableStreamDefaultController` ist die Standard-Controller-Implementierung für `ReadableStream`s, die nicht byte-orientiert sind.

#### `readableStreamDefaultController.close()` {#readablestreamdefaultcontrollerclose}

**Hinzugefügt in: v16.5.0**

Schließt den [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream), dem dieser Controller zugeordnet ist.

#### `readableStreamDefaultController.desiredSize` {#readablestreamdefaultcontrollerdesiredsize}

**Hinzugefügt in: v16.5.0**

- Typ: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Gibt die Datenmenge zurück, die zum Füllen der Warteschlange des [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) verbleibt.

#### `readableStreamDefaultController.enqueue([chunk])` {#readablestreamdefaultcontrollerenqueuechunk}

**Hinzugefügt in: v16.5.0**

- `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Fügt der Warteschlange des [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) einen neuen Datenblock hinzu.

#### `readableStreamDefaultController.error([error])` {#readablestreamdefaultcontrollererrorerror}

**Hinzugefügt in: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Signalisiert einen Fehler, der dazu führt, dass der [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) einen Fehler ausgibt und geschlossen wird.

### Klasse: `ReadableByteStreamController` {#class-readablebytestreamcontroller}

::: info [Verlauf]
| Version  | Änderungen                                                              |
| :------- | :---------------------------------------------------------------------- |
| v18.10.0 | Unterstützung für die Handhabung einer BYOB-Pull-Anfrage von einem freigegebenen Reader. |
| v16.5.0  | Hinzugefügt in: v16.5.0                                                      |
:::

Jeder [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) verfügt über einen Controller, der für den internen Zustand und die Verwaltung der Stream-Warteschlange verantwortlich ist. Der `ReadableByteStreamController` ist für byte-orientierte `ReadableStream`s.


#### `readableByteStreamController.byobRequest` {#readablebytestreamcontrollerbyobrequest}

**Hinzugefügt in: v16.5.0**

- Typ: [\<ReadableStreamBYOBRequest\>](/de/nodejs/api/webstreams#class-readablestreambyobrequest)

#### `readableByteStreamController.close()` {#readablebytestreamcontrollerclose}

**Hinzugefügt in: v16.5.0**

Schließt den [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream), dem dieser Controller zugeordnet ist.

#### `readableByteStreamController.desiredSize` {#readablebytestreamcontrollerdesiredsize}

**Hinzugefügt in: v16.5.0**

- Typ: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Gibt die Datenmenge zurück, die noch benötigt wird, um die Warteschlange des [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) zu füllen.

#### `readableByteStreamController.enqueue(chunk)` {#readablebytestreamcontrollerenqueuechunk}

**Hinzugefügt in: v16.5.0**

- `chunk`: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

Fügt einen neuen Datenblock an die Warteschlange des [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) an.

#### `readableByteStreamController.error([error])` {#readablebytestreamcontrollererrorerror}

**Hinzugefügt in: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Signalisiert einen Fehler, der dazu führt, dass der [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) einen Fehler ausgibt und sich schließt.

### Klasse: `ReadableStreamBYOBRequest` {#class-readablestreambyobrequest}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Diese Klasse wird nun im globalen Objekt bereitgestellt. |
| v16.5.0 | Hinzugefügt in: v16.5.0 |
:::

Bei Verwendung von `ReadableByteStreamController` in byteorientierten Streams und bei Verwendung von `ReadableStreamBYOBReader` bietet die Eigenschaft `readableByteStreamController.byobRequest` Zugriff auf eine `ReadableStreamBYOBRequest`-Instanz, die die aktuelle Leseanforderung darstellt. Das Objekt wird verwendet, um Zugriff auf den `ArrayBuffer`/`TypedArray` zu erhalten, der für die Leseanforderung zum Füllen bereitgestellt wurde, und bietet Methoden, um zu signalisieren, dass die Daten bereitgestellt wurden.


#### `readableStreamBYOBRequest.respond(bytesWritten)` {#readablestreambyobrequestrespondbyteswritten}

**Hinzugefügt in: v16.5.0**

- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Signalisiert, dass eine Anzahl von `bytesWritten` Bytes in `readableStreamBYOBRequest.view` geschrieben wurde.

#### `readableStreamBYOBRequest.respondWithNewView(view)` {#readablestreambyobrequestrespondwithnewviewview}

**Hinzugefügt in: v16.5.0**

- `view` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

Signalisiert, dass die Anfrage mit in ein neues `Buffer`, `TypedArray` oder `DataView` geschriebenen Bytes erfüllt wurde.

#### `readableStreamBYOBRequest.view` {#readablestreambyobrequestview}

**Hinzugefügt in: v16.5.0**

- Typ: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

### Klasse: `WritableStream` {#class-writablestream}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Diese Klasse ist jetzt im globalen Objekt verfügbar. |
| v16.5.0 | Hinzugefügt in: v16.5.0 |
:::

Der `WritableStream` ist ein Ziel, an das Stream-Daten gesendet werden.

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

**Hinzugefügt in: v16.5.0**

- `underlyingSink` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine benutzerdefinierte Funktion, die sofort aufgerufen wird, wenn der `WritableStream` erstellt wird.
    - `controller` [\<WritableStreamDefaultController\>](/de/nodejs/api/webstreams#class-writablestreamdefaultcontroller)
    - Gibt zurück: `undefined` oder ein Promise, das mit `undefined` erfüllt wird.


    - `write` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine benutzerdefinierte Funktion, die aufgerufen wird, wenn ein Datenchunk in den `WritableStream` geschrieben wurde.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `controller` [\<WritableStreamDefaultController\>](/de/nodejs/api/webstreams#class-writablestreamdefaultcontroller)
    - Gibt zurück: Ein Promise, das mit `undefined` erfüllt wird.


    - `close` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine benutzerdefinierte Funktion, die aufgerufen wird, wenn der `WritableStream` geschlossen wird.
    - Gibt zurück: Ein Promise, das mit `undefined` erfüllt wird.


    - `abort` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine benutzerdefinierte Funktion, die aufgerufen wird, um den `WritableStream` abrupt zu schließen.
    - `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Gibt zurück: Ein Promise, das mit `undefined` erfüllt wird.


    - `type` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Die Option `type` ist für die zukünftige Verwendung reserviert und *muss* undefiniert sein.


- `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die maximale interne Warteschlangengröße, bevor Gegendruck angewendet wird.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine benutzerdefinierte Funktion, die verwendet wird, um die Größe jedes Datenchunks zu identifizieren.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Gibt zurück: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


#### `writableStream.abort([reason])` {#writablestreamabortreason}

**Hinzugefügt in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: Ein Promise, das mit `undefined` erfüllt wird.

Bricht den `WritableStream` abrupt ab. Alle in der Warteschlange befindlichen Schreibvorgänge werden abgebrochen und die zugehörigen Promises werden abgelehnt.

#### `writableStream.close()` {#writablestreamclose}

**Hinzugefügt in: v16.5.0**

- Gibt zurück: Ein Promise, das mit `undefined` erfüllt wird.

Schließt den `WritableStream`, wenn keine zusätzlichen Schreibvorgänge erwartet werden.

#### `writableStream.getWriter()` {#writablestreamgetwriter}

**Hinzugefügt in: v16.5.0**

- Gibt zurück: [\<WritableStreamDefaultWriter\>](/de/nodejs/api/webstreams#class-writablestreamdefaultwriter)

Erstellt und gibt eine neue Writer-Instanz zurück, die zum Schreiben von Daten in den `WritableStream` verwendet werden kann.

#### `writableStream.locked` {#writablestreamlocked}

**Hinzugefügt in: v16.5.0**

- Typ: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Die Eigenschaft `writableStream.locked` ist standardmäßig `false` und wird auf `true` gesetzt, solange ein aktiver Writer an diesen `WritableStream` angehängt ist.

#### Übertragen mit postMessage() {#transferring-with-postmessage_1}

Eine [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream)-Instanz kann mit einem [\<MessagePort\>](/de/nodejs/api/worker_threads#class-messageport) übertragen werden.

```js [ESM]
const stream = new WritableStream(getWritableSinkSomehow());

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  data.getWriter().write('hello');
};

port2.postMessage(stream, [stream]);
```
### Klasse: `WritableStreamDefaultWriter` {#class-writablestreamdefaultwriter}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Diese Klasse ist jetzt im globalen Objekt verfügbar. |
| v16.5.0 | Hinzugefügt in: v16.5.0 |
:::

#### `new WritableStreamDefaultWriter(stream)` {#new-writablestreamdefaultwriterstream}

**Hinzugefügt in: v16.5.0**

- `stream` [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream)

Erstellt einen neuen `WritableStreamDefaultWriter`, der an den angegebenen `WritableStream` gebunden ist.

#### `writableStreamDefaultWriter.abort([reason])` {#writablestreamdefaultwriterabortreason}

**Hinzugefügt in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: Ein Promise, das mit `undefined` erfüllt wird.

Bricht den `WritableStream` abrupt ab. Alle in der Warteschlange befindlichen Schreibvorgänge werden abgebrochen und die zugehörigen Promises werden abgelehnt.


#### `writableStreamDefaultWriter.close()` {#writablestreamdefaultwriterclose}

**Hinzugefügt in: v16.5.0**

- Gibt zurück: Ein Promise, das mit `undefined` erfüllt wird.

Schließt den `WritableStream`, wenn keine weiteren Schreibvorgänge erwartet werden.

#### `writableStreamDefaultWriter.closed` {#writablestreamdefaultwriterclosed}

**Hinzugefügt in: v16.5.0**

- Typ: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Erfüllt mit `undefined`, wenn der zugehörige [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream) geschlossen wird oder abgelehnt, wenn der Stream Fehler aufweist oder die Sperre des Writers freigegeben wird, bevor der Stream den Schließvorgang beendet.

#### `writableStreamDefaultWriter.desiredSize` {#writablestreamdefaultwriterdesiredsize}

**Hinzugefügt in: v16.5.0**

- Typ: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Datenmenge, die zum Füllen der Warteschlange des [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream) benötigt wird.

#### `writableStreamDefaultWriter.ready` {#writablestreamdefaultwriterready}

**Hinzugefügt in: v16.5.0**

- Typ: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Erfüllt mit `undefined`, wenn der Writer einsatzbereit ist.

#### `writableStreamDefaultWriter.releaseLock()` {#writablestreamdefaultwriterreleaselock}

**Hinzugefügt in: v16.5.0**

Gibt die Sperre dieses Writers für den zugrunde liegenden [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) frei.

#### `writableStreamDefaultWriter.write([chunk])` {#writablestreamdefaultwriterwritechunk}

**Hinzugefügt in: v16.5.0**

- `chunk`: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: Ein Promise, das mit `undefined` erfüllt wird.

Fügt einen neuen Datenblock an die Warteschlange des [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream) an.

### Klasse: `WritableStreamDefaultController` {#class-writablestreamdefaultcontroller}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Diese Klasse ist jetzt im globalen Objekt verfügbar. |
| v16.5.0 | Hinzugefügt in: v16.5.0 |
:::

Der `WritableStreamDefaultController` verwaltet den internen Zustand des [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream).

#### `writableStreamDefaultController.error([error])` {#writablestreamdefaultcontrollererrorerror}

**Hinzugefügt in: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Wird vom Benutzercode aufgerufen, um zu signalisieren, dass bei der Verarbeitung der `WritableStream`-Daten ein Fehler aufgetreten ist. Wenn diese Funktion aufgerufen wird, wird der [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream) abgebrochen, wobei aktuell ausstehende Schreibvorgänge abgebrochen werden.


#### `writableStreamDefaultController.signal` {#writablestreamdefaultcontrollersignal}

- Typ: [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ein `AbortSignal`, der verwendet werden kann, um ausstehende Schreib- oder Schließoperationen abzubrechen, wenn ein [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream) abgebrochen wird.

### Klasse: `TransformStream` {#class-transformstream}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Diese Klasse ist jetzt im globalen Objekt verfügbar. |
| v16.5.0 | Hinzugefügt in: v16.5.0 |
:::

Ein `TransformStream` besteht aus einem [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) und einem [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream), die so verbunden sind, dass die in den `WritableStream` geschriebenen Daten empfangen und möglicherweise transformiert werden, bevor sie in die Warteschlange des `ReadableStream` geschoben werden.

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

**Hinzugefügt in: v16.5.0**

- `transformer` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine benutzerdefinierte Funktion, die unmittelbar aufgerufen wird, wenn der `TransformStream` erstellt wird. 
    - `controller` [\<TransformStreamDefaultController\>](/de/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - Gibt zurück: `undefined` oder ein Promise, das mit `undefined` erfüllt wird.
  
 
    - `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine benutzerdefinierte Funktion, die einen Datenchunk empfängt und möglicherweise modifiziert, der in `transformStream.writable` geschrieben wurde, bevor er an `transformStream.readable` weitergeleitet wird. 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `controller` [\<TransformStreamDefaultController\>](/de/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - Gibt zurück: Ein Promise, das mit `undefined` erfüllt wird.
  
 
    - `flush` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine benutzerdefinierte Funktion, die unmittelbar vor dem Schließen der beschreibbaren Seite des `TransformStream` aufgerufen wird und das Ende des Transformationsprozesses signalisiert. 
    - `controller` [\<TransformStreamDefaultController\>](/de/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - Gibt zurück: Ein Promise, das mit `undefined` erfüllt wird.
  
 
    - `readableType` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Die Option `readableType` ist für die zukünftige Verwendung reserviert und *muss* `undefined` sein.
    - `writableType` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Die Option `writableType` ist für die zukünftige Verwendung reserviert und *muss* `undefined` sein.
  
 
- `writableStrategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die maximale interne Warteschlangengröße, bevor Gegendruck angewendet wird.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine benutzerdefinierte Funktion, die verwendet wird, um die Größe jedes Datenchunks zu identifizieren. 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Gibt zurück: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  
 
- `readableStrategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die maximale interne Warteschlangengröße, bevor Gegendruck angewendet wird.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine benutzerdefinierte Funktion, die verwendet wird, um die Größe jedes Datenchunks zu identifizieren. 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Gibt zurück: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  


#### `transformStream.readable` {#transformstreamreadable}

**Hinzugefügt in: v16.5.0**

- Typ: [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream)

#### `transformStream.writable` {#transformstreamwritable}

**Hinzugefügt in: v16.5.0**

- Typ: [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream)

#### Übertragung mit postMessage() {#transferring-with-postmessage_2}

Eine [\<TransformStream\>](/de/nodejs/api/webstreams#class-transformstream)-Instanz kann mithilfe eines [\<MessagePort\>](/de/nodejs/api/worker_threads#class-messageport) übertragen werden.

```js [ESM]
const stream = new TransformStream();

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  const { writable, readable } = data;
  // ...
};

port2.postMessage(stream, [stream]);
```
### Klasse: `TransformStreamDefaultController` {#class-transformstreamdefaultcontroller}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Diese Klasse ist jetzt im globalen Objekt verfügbar. |
| v16.5.0 | Hinzugefügt in: v16.5.0 |
:::

Der `TransformStreamDefaultController` verwaltet den internen Zustand des `TransformStream`.

#### `transformStreamDefaultController.desiredSize` {#transformstreamdefaultcontrollerdesiredsize}

**Hinzugefügt in: v16.5.0**

- Typ: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Datenmenge, die erforderlich ist, um die Warteschlange der lesbaren Seite zu füllen.

#### `transformStreamDefaultController.enqueue([chunk])` {#transformstreamdefaultcontrollerenqueuechunk}

**Hinzugefügt in: v16.5.0**

- `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Fügt der Warteschlange der lesbaren Seite einen Datenblock hinzu.

#### `transformStreamDefaultController.error([reason])` {#transformstreamdefaultcontrollererrorreason}

**Hinzugefügt in: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Signalisiert sowohl der lesbaren als auch der schreibbaren Seite, dass beim Verarbeiten der Transformationsdaten ein Fehler aufgetreten ist, wodurch beide Seiten abrupt geschlossen werden.

#### `transformStreamDefaultController.terminate()` {#transformstreamdefaultcontrollerterminate}

**Hinzugefügt in: v16.5.0**

Schließt die lesbare Seite des Transports und bewirkt, dass die schreibbare Seite abrupt mit einem Fehler geschlossen wird.

### Klasse: `ByteLengthQueuingStrategy` {#class-bytelengthqueuingstrategy}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Diese Klasse ist jetzt im globalen Objekt verfügbar. |
| v16.5.0 | Hinzugefügt in: v16.5.0 |
:::


#### `new ByteLengthQueuingStrategy(init)` {#new-bytelengthqueuingstrategyinit}

**Hinzugefügt in: v16.5.0**

- `init` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

#### `byteLengthQueuingStrategy.highWaterMark` {#bytelengthqueuingstrategyhighwatermark}

**Hinzugefügt in: v16.5.0**

- Typ: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### `byteLengthQueuingStrategy.size` {#bytelengthqueuingstrategysize}

**Hinzugefügt in: v16.5.0**

- Typ: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Gibt zurück: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

### Klasse: `CountQueuingStrategy` {#class-countqueuingstrategy}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Diese Klasse ist jetzt im globalen Objekt verfügbar. |
| v16.5.0 | Hinzugefügt in: v16.5.0 |
:::

#### `new CountQueuingStrategy(init)` {#new-countqueuingstrategyinit}

**Hinzugefügt in: v16.5.0**

- `init` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

#### `countQueuingStrategy.highWaterMark` {#countqueuingstrategyhighwatermark}

**Hinzugefügt in: v16.5.0**

- Typ: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### `countQueuingStrategy.size` {#countqueuingstrategysize}

**Hinzugefügt in: v16.5.0**

- Typ: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Gibt zurück: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

### Klasse: `TextEncoderStream` {#class-textencoderstream}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Diese Klasse ist jetzt im globalen Objekt verfügbar. |
| v16.6.0 | Hinzugefügt in: v16.6.0 |
:::


#### `new TextEncoderStream()` {#new-textencoderstream}

**Hinzugefügt in: v16.6.0**

Erstellt eine neue `TextEncoderStream`-Instanz.

#### `textEncoderStream.encoding` {#textencoderstreamencoding}

**Hinzugefügt in: v16.6.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die von der `TextEncoderStream`-Instanz unterstützte Kodierung.

#### `textEncoderStream.readable` {#textencoderstreamreadable}

**Hinzugefügt in: v16.6.0**

- Typ: [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream)

#### `textEncoderStream.writable` {#textencoderstreamwritable}

**Hinzugefügt in: v16.6.0**

- Typ: [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream)

### Klasse: `TextDecoderStream` {#class-textdecoderstream}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Diese Klasse ist jetzt im globalen Objekt verfügbar. |
| v16.6.0 | Hinzugefügt in: v16.6.0 |
:::

#### `new TextDecoderStream([encoding[, options]])` {#new-textdecoderstreamencoding-options}

**Hinzugefügt in: v16.6.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Identifiziert die `encoding`, die diese `TextDecoder`-Instanz unterstützt. **Standard:** `'utf-8'`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `fatal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn Dekodierungsfehler schwerwiegend sind.
    - `ignoreBOM` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, enthält der `TextDecoderStream` die Byte Order Mark im dekodierten Ergebnis. Wenn `false`, wird die Byte Order Mark aus der Ausgabe entfernt. Diese Option wird nur verwendet, wenn `encoding` `'utf-8'`, `'utf-16be'` oder `'utf-16le'` ist. **Standard:** `false`.
  
 

Erstellt eine neue `TextDecoderStream`-Instanz.

#### `textDecoderStream.encoding` {#textdecoderstreamencoding}

**Hinzugefügt in: v16.6.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die von der `TextDecoderStream`-Instanz unterstützte Kodierung.

#### `textDecoderStream.fatal` {#textdecoderstreamfatal}

**Hinzugefügt in: v16.6.0**

- Typ: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Der Wert ist `true`, wenn Dekodierungsfehler dazu führen, dass ein `TypeError` ausgelöst wird.


#### `textDecoderStream.ignoreBOM` {#textdecoderstreamignorebom}

**Hinzugefügt in: v16.6.0**

- Typ: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Der Wert ist `true`, wenn das Dekodierungsergebnis die Byte Order Mark enthält.

#### `textDecoderStream.readable` {#textdecoderstreamreadable}

**Hinzugefügt in: v16.6.0**

- Typ: [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream)

#### `textDecoderStream.writable` {#textdecoderstreamwritable}

**Hinzugefügt in: v16.6.0**

- Typ: [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream)

### Klasse: `CompressionStream` {#class-compressionstream}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Diese Klasse ist jetzt im globalen Objekt verfügbar. |
| v17.0.0 | Hinzugefügt in: v17.0.0 |
:::

#### `new CompressionStream(format)` {#new-compressionstreamformat}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.2.0, v20.12.0 | Format akzeptiert jetzt den Wert `deflate-raw`. |
| v17.0.0 | Hinzugefügt in: v17.0.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Einer von `'deflate'`, `'deflate-raw'` oder `'gzip'`.

#### `compressionStream.readable` {#compressionstreamreadable}

**Hinzugefügt in: v17.0.0**

- Typ: [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream)

#### `compressionStream.writable` {#compressionstreamwritable}

**Hinzugefügt in: v17.0.0**

- Typ: [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream)

### Klasse: `DecompressionStream` {#class-decompressionstream}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Diese Klasse ist jetzt im globalen Objekt verfügbar. |
| v17.0.0 | Hinzugefügt in: v17.0.0 |
:::

#### `new DecompressionStream(format)` {#new-decompressionstreamformat}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.2.0, v20.12.0 | Format akzeptiert jetzt den Wert `deflate-raw`. |
| v17.0.0 | Hinzugefügt in: v17.0.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Einer von `'deflate'`, `'deflate-raw'` oder `'gzip'`.

#### `decompressionStream.readable` {#decompressionstreamreadable}

**Hinzugefügt in: v17.0.0**

- Typ: [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream)

#### `decompressionStream.writable` {#decompressionstreamwritable}

**Hinzugefügt in: v17.0.0**

- Typ: [\<WritableStream\>](/de/nodejs/api/webstreams#class-writablestream)


### Utility-Konsumenten {#utility-consumers}

**Hinzugefügt in: v16.7.0**

Die Utility-Konsumentenfunktionen bieten allgemeine Optionen für die Verarbeitung von Streams.

Sie werden wie folgt aufgerufen:

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

**Hinzugefügt in: v16.7.0**

- `stream` [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/de/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit einem `ArrayBuffer` erfüllt, der den gesamten Inhalt des Streams enthält.

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

**Hinzugefügt in: v16.7.0**

- `stream` [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/de/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit einem [\<Blob\>](/de/nodejs/api/buffer#class-blob) erfüllt, der den gesamten Inhalt des Streams enthält.

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

**Hinzugefügt in: v16.7.0**

- `stream` [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/de/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit einem [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) erfüllt, der den gesamten Inhalt des Streams enthält.

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
const { Buffer } = require('node:buffer');

const dataBuffer = Buffer.from('hello world from consumers!');

const readable = Readable.from(dataBuffer);
buffer(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Prints: from readable: 27
});
```
:::

#### `streamConsumers.json(stream)` {#streamconsumersjsonstream}

**Hinzugefügt in: v16.7.0**

- `stream` [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/de/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit dem Inhalt des Streams erfüllt, der als UTF-8-codierte Zeichenkette geparst und dann durch `JSON.parse()` geleitet wird.

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

**Hinzugefügt in: v16.7.0**

- `stream` [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/de/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit dem Inhalt des Streams als UTF-8-kodierter Zeichenfolge aufgelöst.

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

