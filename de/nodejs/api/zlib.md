---
title: Node.js Dokumentation - Zlib
description: Das zlib-Modul in Node.js bietet Kompressionsfunktionen mit den Algorithmen Gzip, Deflate/Inflate und Brotli. Es umfasst synchrone und asynchrone Methoden zum Komprimieren und Dekomprimieren von Daten sowie verschiedene Optionen zur Anpassung des Kompressionsverhaltens.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - Zlib | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Das zlib-Modul in Node.js bietet Kompressionsfunktionen mit den Algorithmen Gzip, Deflate/Inflate und Brotli. Es umfasst synchrone und asynchrone Methoden zum Komprimieren und Dekomprimieren von Daten sowie verschiedene Optionen zur Anpassung des Kompressionsverhaltens.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - Zlib | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Das zlib-Modul in Node.js bietet Kompressionsfunktionen mit den Algorithmen Gzip, Deflate/Inflate und Brotli. Es umfasst synchrone und asynchrone Methoden zum Komprimieren und Dekomprimieren von Daten sowie verschiedene Optionen zur Anpassung des Kompressionsverhaltens.
---


# Zlib {#zlib}

::: tip [Stable: 2 - Stable]
[Stable: 2](/de/nodejs/api/documentation#stability-index) [Stability: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/zlib.js](https://github.com/nodejs/node/blob/v23.5.0/lib/zlib.js)

Das Modul `node:zlib` bietet Komprimierungsfunktionen, die mit Gzip, Deflate/Inflate und Brotli implementiert werden.

Um darauf zuzugreifen:

::: code-group
```js [ESM]
import os from 'node:zlib';
```

```js [CJS]
const zlib = require('node:zlib');
```
:::

Komprimierung und Dekomprimierung basieren auf der Node.js [Streams API](/de/nodejs/api/stream).

Das Komprimieren oder Dekomprimieren eines Streams (z. B. einer Datei) kann durch das Weiterleiten des Quell-Streams durch einen `zlib` `Transform`-Stream in einen Ziel-Stream erreicht werden:

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';
import process from 'node:process';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream';

const gzip = createGzip();
const source = createReadStream('input.txt');
const destination = createWriteStream('input.txt.gz');

pipeline(source, gzip, destination, (err) => {
  if (err) {
    console.error('Ein Fehler ist aufgetreten:', err);
    process.exitCode = 1;
  }
});
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');
const process = require('node:process');
const { createGzip } = require('node:zlib');
const { pipeline } = require('node:stream');

const gzip = createGzip();
const source = createReadStream('input.txt');
const destination = createWriteStream('input.txt.gz');

pipeline(source, gzip, destination, (err) => {
  if (err) {
    console.error('Ein Fehler ist aufgetreten:', err);
    process.exitCode = 1;
  }
});
```
:::

Oder mit der Promise `pipeline` API:

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';
import process from 'node:process';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

async function do_gzip(input, output) {
  const gzip = createGzip();
  const source = createReadStream(input);
  const destination = createWriteStream(output);
  await pipeline(source, gzip, destination);
}

await do_gzip('input.txt', 'input.txt.gz');
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');
const process = require('node:process');
const { createGzip } = require('node:zlib');
const { pipeline } = require('node:stream/promises');

async function do_gzip(input, output) {
  const gzip = createGzip();
  const source = createReadStream(input);
  const destination = createWriteStream(output);
  await pipeline(source, gzip, destination);
}

do_gzip('input.txt', 'input.txt.gz')
  .catch((err) => {
    console.error('Ein Fehler ist aufgetreten:', err);
    process.exitCode = 1;
  });
```
:::

Es ist auch möglich, Daten in einem einzigen Schritt zu komprimieren oder zu dekomprimieren:

::: code-group
```js [ESM]
import process from 'node:process';
import { Buffer } from 'node:buffer';
import { deflate, unzip } from 'node:zlib';

const input = '.................................';
deflate(input, (err, buffer) => {
  if (err) {
    console.error('Ein Fehler ist aufgetreten:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString('base64'));
});

const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
unzip(buffer, (err, buffer) => {
  if (err) {
    console.error('Ein Fehler ist aufgetreten:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString());
});

// Oder, Promisified

import { promisify } from 'node:util';
const do_unzip = promisify(unzip);

const unzippedBuffer = await do_unzip(buffer);
console.log(unzippedBuffer.toString());
```

```js [CJS]
const { deflate, unzip } = require('node:zlib');

const input = '.................................';
deflate(input, (err, buffer) => {
  if (err) {
    console.error('Ein Fehler ist aufgetreten:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString('base64'));
});

const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
unzip(buffer, (err, buffer) => {
  if (err) {
    console.error('Ein Fehler ist aufgetreten:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString());
});

// Oder, Promisified

const { promisify } = require('node:util');
const do_unzip = promisify(unzip);

do_unzip(buffer)
  .then((buf) => console.log(buf.toString()))
  .catch((err) => {
    console.error('Ein Fehler ist aufgetreten:', err);
    process.exitCode = 1;
  });
```
:::

## Threadpool-Nutzung und Leistungsüberlegungen {#threadpool-usage-and-performance-considerations}

Alle `zlib`-APIs, mit Ausnahme der explizit synchronen, verwenden den internen Threadpool von Node.js. Dies kann in einigen Anwendungen zu überraschenden Effekten und Leistungsbeschränkungen führen.

Das gleichzeitige Erstellen und Verwenden einer großen Anzahl von zlib-Objekten kann zu erheblicher Speicherfragmentierung führen.

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import { Buffer } from 'node:buffer';

const payload = Buffer.from('This is some data');

// WARNUNG: NICHT MACHEN!
for (let i = 0; i < 30000; ++i) {
  zlib.deflate(payload, (err, buffer) => {});
}
```

```js [CJS]
const zlib = require('node:zlib');

const payload = Buffer.from('This is some data');

// WARNUNG: NICHT MACHEN!
for (let i = 0; i < 30000; ++i) {
  zlib.deflate(payload, (err, buffer) => {});
}
```
:::

Im vorherigen Beispiel werden 30.000 Deflate-Instanzen gleichzeitig erstellt. Aufgrund der Art und Weise, wie einige Betriebssysteme die Speicherzuweisung und -freigabe handhaben, kann dies zu erheblicher Speicherfragmentierung führen.

Es wird dringend empfohlen, die Ergebnisse von Komprimierungsoperationen zwischenzuspeichern, um doppelten Aufwand zu vermeiden.

## Komprimieren von HTTP-Anfragen und -Antworten {#compressing-http-requests-and-responses}

Das Modul `node:zlib` kann verwendet werden, um die Unterstützung für die von [HTTP](https://tools.ietf.org/html/rfc7230#section-4.2) definierten Content-Encoding-Mechanismen `gzip`, `deflate` und `br` zu implementieren.

Der HTTP-Header [`Accept-Encoding`](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14#sec14.3) wird innerhalb einer HTTP-Anfrage verwendet, um die vom Client akzeptierten Komprimierungs-Encodings zu identifizieren. Der Header [`Content-Encoding`](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14#sec14.11) wird verwendet, um die tatsächlich auf eine Nachricht angewendeten Komprimierungs-Encodings zu identifizieren.

Die unten angegebenen Beispiele sind drastisch vereinfacht, um das grundlegende Konzept zu zeigen. Die Verwendung der `zlib`-Kodierung kann teuer sein, und die Ergebnisse sollten zwischengespeichert werden. Weitere Informationen zu den Kompromissen zwischen Geschwindigkeit, Speicher und Komprimierung bei der Verwendung von `zlib` finden Sie unter [Speicherverbrauchsoptimierung](/de/nodejs/api/zlib#memory-usage-tuning).

::: code-group
```js [ESM]
// Client-Anfrage Beispiel
import fs from 'node:fs';
import zlib from 'node:zlib';
import http from 'node:http';
import process from 'node:process';
import { pipeline } from 'node:stream';

const request = http.get({ host: 'example.com',
                           path: '/',
                           port: 80,
                           headers: { 'Accept-Encoding': 'br,gzip,deflate' } });
request.on('response', (response) => {
  const output = fs.createWriteStream('example.com_index.html');

  const onError = (err) => {
    if (err) {
      console.error('Ein Fehler ist aufgetreten:', err);
      process.exitCode = 1;
    }
  };

  switch (response.headers['content-encoding']) {
    case 'br':
      pipeline(response, zlib.createBrotliDecompress(), output, onError);
      break;
    // Oder verwende einfach zlib.createUnzip(), um beide der folgenden Fälle zu behandeln:
    case 'gzip':
      pipeline(response, zlib.createGunzip(), output, onError);
      break;
    case 'deflate':
      pipeline(response, zlib.createInflate(), output, onError);
      break;
    default:
      pipeline(response, output, onError);
      break;
  }
});
```

```js [CJS]
// Client-Anfrage Beispiel
const zlib = require('node:zlib');
const http = require('node:http');
const fs = require('node:fs');
const { pipeline } = require('node:stream');

const request = http.get({ host: 'example.com',
                           path: '/',
                           port: 80,
                           headers: { 'Accept-Encoding': 'br,gzip,deflate' } });
request.on('response', (response) => {
  const output = fs.createWriteStream('example.com_index.html');

  const onError = (err) => {
    if (err) {
      console.error('Ein Fehler ist aufgetreten:', err);
      process.exitCode = 1;
    }
  };

  switch (response.headers['content-encoding']) {
    case 'br':
      pipeline(response, zlib.createBrotliDecompress(), output, onError);
      break;
    // Oder verwende einfach zlib.createUnzip(), um beide der folgenden Fälle zu behandeln:
    case 'gzip':
      pipeline(response, zlib.createGunzip(), output, onError);
      break;
    case 'deflate':
      pipeline(response, zlib.createInflate(), output, onError);
      break;
    default:
      pipeline(response, output, onError);
      break;
  }
});
```
:::

::: code-group
```js [ESM]
// Server Beispiel
// Das Ausführen einer gzip-Operation bei jeder Anfrage ist recht aufwendig.
// Es wäre viel effizienter, den komprimierten Puffer zwischenzuspeichern.
import zlib from 'node:zlib';
import http from 'node:http';
import fs from 'node:fs';
import { pipeline } from 'node:stream';

http.createServer((request, response) => {
  const raw = fs.createReadStream('index.html');
  // Speichern Sie sowohl eine komprimierte als auch eine unkomprimierte Version der Ressource.
  response.setHeader('Vary', 'Accept-Encoding');
  const acceptEncoding = request.headers['accept-encoding'] || '';

  const onError = (err) => {
    if (err) {
      // Wenn ein Fehler auftritt, können wir nicht viel tun, da
      // der Server bereits den 200-Antwortcode gesendet hat und
      // bereits eine gewisse Datenmenge an den Client gesendet wurde.
      // Das Beste, was wir tun können, ist, die Antwort sofort zu beenden
      // und den Fehler zu protokollieren.
      response.end();
      console.error('Ein Fehler ist aufgetreten:', err);
    }
  };

  // Hinweis: Dies ist kein konformer Accept-Encoding-Parser.
  // Siehe https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
  if (/\bdeflate\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'deflate' });
    pipeline(raw, zlib.createDeflate(), response, onError);
  } else if (/\bgzip\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'gzip' });
    pipeline(raw, zlib.createGzip(), response, onError);
  } else if (/\bbr\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'br' });
    pipeline(raw, zlib.createBrotliCompress(), response, onError);
  } else {
    response.writeHead(200, {});
    pipeline(raw, response, onError);
  }
}).listen(1337);
```

```js [CJS]
// Server Beispiel
// Das Ausführen einer gzip-Operation bei jeder Anfrage ist recht aufwendig.
// Es wäre viel effizienter, den komprimierten Puffer zwischenzuspeichern.
const zlib = require('node:zlib');
const http = require('node:http');
const fs = require('node:fs');
const { pipeline } = require('node:stream');

http.createServer((request, response) => {
  const raw = fs.createReadStream('index.html');
  // Speichern Sie sowohl eine komprimierte als auch eine unkomprimierte Version der Ressource.
  response.setHeader('Vary', 'Accept-Encoding');
  const acceptEncoding = request.headers['accept-encoding'] || '';

  const onError = (err) => {
    if (err) {
      // Wenn ein Fehler auftritt, können wir nicht viel tun, da
      // der Server bereits den 200-Antwortcode gesendet hat und
      // bereits eine gewisse Datenmenge an den Client gesendet wurde.
      // Das Beste, was wir tun können, ist, die Antwort sofort zu beenden
      // und den Fehler zu protokollieren.
      response.end();
      console.error('Ein Fehler ist aufgetreten:', err);
    }
  };

  // Hinweis: Dies ist kein konformer Accept-Encoding-Parser.
  // Siehe https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
  if (/\bdeflate\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'deflate' });
    pipeline(raw, zlib.createDeflate(), response, onError);
  } else if (/\bgzip\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'gzip' });
    pipeline(raw, zlib.createGzip(), response, onError);
  } else if (/\bbr\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'br' });
    pipeline(raw, zlib.createBrotliCompress(), response, onError);
  } else {
    response.writeHead(200, {});
    pipeline(raw, response, onError);
  }
}).listen(1337);
```
:::

Standardmäßig werfen die `zlib`-Methoden einen Fehler, wenn abgeschnittene Daten dekomprimiert werden. Wenn jedoch bekannt ist, dass die Daten unvollständig sind oder nur der Anfang einer komprimierten Datei inspiziert werden soll, ist es möglich, die standardmäßige Fehlerbehandlung zu unterdrücken, indem die Flushing-Methode geändert wird, die zum Dekomprimieren des letzten Chunks von Eingabedaten verwendet wird:

```js [ESM]
// Dies ist eine abgeschnittene Version des Puffers aus den obigen Beispielen
const buffer = Buffer.from('eJzT0yMA', 'base64');

zlib.unzip(
  buffer,
  // Für Brotli ist das Äquivalent zlib.constants.BROTLI_OPERATION_FLUSH.
  { finishFlush: zlib.constants.Z_SYNC_FLUSH },
  (err, buffer) => {
    if (err) {
      console.error('Ein Fehler ist aufgetreten:', err);
      process.exitCode = 1;
    }
    console.log(buffer.toString());
  });
```
Dies ändert nicht das Verhalten in anderen fehlerhaften Situationen, z. B. wenn die Eingabedaten ein ungültiges Format haben. Bei Verwendung dieser Methode ist es nicht möglich festzustellen, ob die Eingabe vorzeitig beendet wurde oder die Integritätsprüfungen fehlen, sodass manuell geprüft werden muss, ob das dekomprimierte Ergebnis gültig ist.


## Speicherverbrauchsoptimierung {#memory-usage-tuning}

### Für zlib-basierte Streams {#for-zlib-based-streams}

Aus `zlib/zconf.h`, modifiziert für die Verwendung in Node.js:

Die Speicheranforderungen für Deflate betragen (in Bytes):

```js [ESM]
(1 << (windowBits + 2)) + (1 << (memLevel + 9))
```
Das heißt: 128 KB für `windowBits` = 15 + 128 KB für `memLevel` = 8 (Standardwerte) zuzüglich einiger Kilobyte für kleine Objekte.

Um beispielsweise die standardmäßigen Speicheranforderungen von 256 KB auf 128 KB zu reduzieren, sollten die Optionen wie folgt festgelegt werden:

```js [ESM]
const options = { windowBits: 14, memLevel: 7 };
```
Dies führt jedoch im Allgemeinen zu einer Verschlechterung der Komprimierung.

Die Speicheranforderungen für Inflate betragen (in Bytes) `1 \<\< windowBits`. Das heißt, 32 KB für `windowBits` = 15 (Standardwert) zuzüglich einiger Kilobyte für kleine Objekte.

Dies gilt zusätzlich zu einem einzelnen internen Ausgabepuffer der Größe `chunkSize`, der standardmäßig 16 KB beträgt.

Die Geschwindigkeit der `zlib`-Komprimierung wird am stärksten von der Einstellung `level` beeinflusst. Ein höheres Level führt zu einer besseren Komprimierung, dauert aber länger. Ein niedrigeres Level führt zu einer geringeren Komprimierung, ist aber viel schneller.

Im Allgemeinen bedeuten größere Optionen für die Speichernutzung, dass Node.js weniger Aufrufe an `zlib` durchführen muss, da es bei jeder `write`-Operation mehr Daten verarbeiten kann. Dies ist also ein weiterer Faktor, der die Geschwindigkeit beeinflusst, jedoch auf Kosten des Speicherverbrauchs.

### Für Brotli-basierte Streams {#for-brotli-based-streams}

Es gibt Äquivalente zu den zlib-Optionen für Brotli-basierte Streams, obwohl diese Optionen unterschiedliche Bereiche als die zlib-Optionen haben:

- Die `level`-Option von zlib entspricht der `BROTLI_PARAM_QUALITY`-Option von Brotli.
- Die `windowBits`-Option von zlib entspricht der `BROTLI_PARAM_LGWIN`-Option von Brotli.

Weitere Informationen zu Brotli-spezifischen Optionen finden Sie [unten](/de/nodejs/api/zlib#brotli-constants).

## Flushing {#flushing}

Durch Aufrufen von [`.flush()`](/de/nodejs/api/zlib#zlibflushkind-callback) auf einem Komprimierungsstream gibt `zlib` so viel Ausgabe wie möglich zurück. Dies kann zu Lasten der Komprimierungsqualität gehen, kann aber nützlich sein, wenn Daten so schnell wie möglich verfügbar sein müssen.

Im folgenden Beispiel wird `flush()` verwendet, um eine komprimierte partielle HTTP-Antwort an den Client zu schreiben:

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import http from 'node:http';
import { pipeline } from 'node:stream';

http.createServer((request, response) => {
  // Der Einfachheit halber werden die Accept-Encoding-Prüfungen ausgelassen.
  response.writeHead(200, { 'content-encoding': 'gzip' });
  const output = zlib.createGzip();
  let i;

  pipeline(output, response, (err) => {
    if (err) {
      // Wenn ein Fehler auftritt, können wir nicht viel tun, da
      // der Server bereits den 200-Antwortcode gesendet hat und
      // bereits eine bestimmte Datenmenge an den Client gesendet wurde.
      // Das Beste, was wir tun können, ist, die Antwort sofort zu beenden
      // und den Fehler zu protokollieren.
      clearInterval(i);
      response.end();
      console.error('An error occurred:', err);
    }
  });

  i = setInterval(() => {
    output.write(`The current time is ${Date()}\n`, () => {
      // Die Daten wurden an zlib übergeben, aber der Komprimierungsalgorithmus hat möglicherweise
      // entschieden, die Daten für eine effizientere Komprimierung zu puffern.
      // Durch Aufrufen von .flush() werden die Daten verfügbar, sobald der Client
      // bereit ist, sie zu empfangen.
      output.flush();
    });
  }, 1000);
}).listen(1337);
```

```js [CJS]
const zlib = require('node:zlib');
const http = require('node:http');
const { pipeline } = require('node:stream');

http.createServer((request, response) => {
  // Der Einfachheit halber werden die Accept-Encoding-Prüfungen ausgelassen.
  response.writeHead(200, { 'content-encoding': 'gzip' });
  const output = zlib.createGzip();
  let i;

  pipeline(output, response, (err) => {
    if (err) {
      // Wenn ein Fehler auftritt, können wir nicht viel tun, da
      // der Server bereits den 200-Antwortcode gesendet hat und
      // bereits eine bestimmte Datenmenge an den Client gesendet wurde.
      // Das Beste, was wir tun können, ist, die Antwort sofort zu beenden
      // und den Fehler zu protokollieren.
      clearInterval(i);
      response.end();
      console.error('An error occurred:', err);
    }
  });

  i = setInterval(() => {
    output.write(`The current time is ${Date()}\n`, () => {
      // Die Daten wurden an zlib übergeben, aber der Komprimierungsalgorithmus hat möglicherweise
      // entschieden, die Daten für eine effizientere Komprimierung zu puffern.
      // Durch Aufrufen von .flush() werden die Daten verfügbar, sobald der Client
      // bereit ist, sie zu empfangen.
      output.flush();
    });
  }, 1000);
}).listen(1337);
```
:::


## Konstanten {#constants}

**Hinzugefügt in: v0.5.8**

### zlib-Konstanten {#zlib-constants}

Alle in `zlib.h` definierten Konstanten sind auch unter `require('node:zlib').constants` definiert. Im normalen Betrieb ist es nicht erforderlich, diese Konstanten zu verwenden. Sie sind dokumentiert, damit ihre Anwesenheit nicht überraschend ist. Dieser Abschnitt stammt fast direkt aus der [zlib-Dokumentation](https://zlib.net/manual#Constants).

Zuvor waren die Konstanten direkt über `require('node:zlib')` verfügbar, beispielsweise `zlib.Z_NO_FLUSH`. Der direkte Zugriff auf die Konstanten über das Modul ist derzeit noch möglich, aber veraltet.

Zulässige Flush-Werte.

- `zlib.constants.Z_NO_FLUSH`
- `zlib.constants.Z_PARTIAL_FLUSH`
- `zlib.constants.Z_SYNC_FLUSH`
- `zlib.constants.Z_FULL_FLUSH`
- `zlib.constants.Z_FINISH`
- `zlib.constants.Z_BLOCK`
- `zlib.constants.Z_TREES`

Rückgabecodes für die Komprimierungs-/Dekomprimierungsfunktionen. Negative Werte sind Fehler, positive Werte werden für spezielle, aber normale Ereignisse verwendet.

- `zlib.constants.Z_OK`
- `zlib.constants.Z_STREAM_END`
- `zlib.constants.Z_NEED_DICT`
- `zlib.constants.Z_ERRNO`
- `zlib.constants.Z_STREAM_ERROR`
- `zlib.constants.Z_DATA_ERROR`
- `zlib.constants.Z_MEM_ERROR`
- `zlib.constants.Z_BUF_ERROR`
- `zlib.constants.Z_VERSION_ERROR`

Komprimierungsstufen.

- `zlib.constants.Z_NO_COMPRESSION`
- `zlib.constants.Z_BEST_SPEED`
- `zlib.constants.Z_BEST_COMPRESSION`
- `zlib.constants.Z_DEFAULT_COMPRESSION`

Komprimierungsstrategie.

- `zlib.constants.Z_FILTERED`
- `zlib.constants.Z_HUFFMAN_ONLY`
- `zlib.constants.Z_RLE`
- `zlib.constants.Z_FIXED`
- `zlib.constants.Z_DEFAULT_STRATEGY`

### Brotli-Konstanten {#brotli-constants}

**Hinzugefügt in: v11.7.0, v10.16.0**

Es gibt mehrere Optionen und andere Konstanten, die für Brotli-basierte Streams verfügbar sind:

#### Flush-Operationen {#flush-operations}

Die folgenden Werte sind gültige Flush-Operationen für Brotli-basierte Streams:

- `zlib.constants.BROTLI_OPERATION_PROCESS` (Standard für alle Operationen)
- `zlib.constants.BROTLI_OPERATION_FLUSH` (Standard beim Aufruf von `.flush()`)
- `zlib.constants.BROTLI_OPERATION_FINISH` (Standard für den letzten Chunk)
- `zlib.constants.BROTLI_OPERATION_EMIT_METADATA`
    - Diese spezielle Operation kann in einem Node.js-Kontext schwer zu verwenden sein, da die Streaming-Schicht es schwierig macht zu wissen, welche Daten in diesem Frame landen werden. Außerdem gibt es derzeit keine Möglichkeit, diese Daten über die Node.js-API zu verarbeiten.


#### Kompressoroptionen {#compressor-options}

Es gibt verschiedene Optionen, die bei Brotli-Encodern festgelegt werden können und die Kompressionseffizienz und -geschwindigkeit beeinflussen. Sowohl auf die Schlüssel als auch auf die Werte kann als Eigenschaften des `zlib.constants`-Objekts zugegriffen werden.

Die wichtigsten Optionen sind:

- `BROTLI_PARAM_MODE`
    - `BROTLI_MODE_GENERIC` (Standard)
    - `BROTLI_MODE_TEXT`, angepasst für UTF-8-Text
    - `BROTLI_MODE_FONT`, angepasst für WOFF 2.0-Schriften


- `BROTLI_PARAM_QUALITY`
    - Bereich von `BROTLI_MIN_QUALITY` bis `BROTLI_MAX_QUALITY`, mit einem Standardwert von `BROTLI_DEFAULT_QUALITY`.


- `BROTLI_PARAM_SIZE_HINT`
    - Ganzzahliger Wert, der die erwartete Eingabegröße darstellt; Standardwert ist `0` für eine unbekannte Eingabegröße.



Die folgenden Flags können für eine erweiterte Steuerung des Komprimierungsalgorithmus und zur Feinabstimmung der Speichernutzung festgelegt werden:

- `BROTLI_PARAM_LGWIN`
    - Bereich von `BROTLI_MIN_WINDOW_BITS` bis `BROTLI_MAX_WINDOW_BITS`, mit einem Standardwert von `BROTLI_DEFAULT_WINDOW`, oder bis zu `BROTLI_LARGE_MAX_WINDOW_BITS`, wenn das Flag `BROTLI_PARAM_LARGE_WINDOW` gesetzt ist.


- `BROTLI_PARAM_LGBLOCK`
    - Bereich von `BROTLI_MIN_INPUT_BLOCK_BITS` bis `BROTLI_MAX_INPUT_BLOCK_BITS`.


- `BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING`
    - Boolesches Flag, das das Komprimierungsverhältnis zugunsten der Dekomprimierungsgeschwindigkeit verringert.


- `BROTLI_PARAM_LARGE_WINDOW`
    - Boolesches Flag, das den "Large Window Brotli"-Modus aktiviert (nicht kompatibel mit dem im [RFC 7932](https://www.rfc-editor.org/rfc/rfc7932.txt) standardisierten Brotli-Format).


- `BROTLI_PARAM_NPOSTFIX`
    - Bereich von `0` bis `BROTLI_MAX_NPOSTFIX`.


- `BROTLI_PARAM_NDIRECT`
    - Bereich von `0` bis `15 \<\< NPOSTFIX` in Schritten von `1 \<\< NPOSTFIX`.



#### Dekompressoroptionen {#decompressor-options}

Diese erweiterten Optionen stehen zur Steuerung der Dekomprimierung zur Verfügung:

- `BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION`
    - Boolesches Flag, das sich auf interne Speicherzuordnungsmuster auswirkt.


- `BROTLI_DECODER_PARAM_LARGE_WINDOW`
    - Boolesches Flag, das den "Large Window Brotli"-Modus aktiviert (nicht kompatibel mit dem im [RFC 7932](https://www.rfc-editor.org/rfc/rfc7932.txt) standardisierten Brotli-Format).


## Klasse: `Options` {#class-options}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v14.5.0, v12.19.0 | Die Option `maxOutputLength` wird jetzt unterstützt. |
| v9.4.0 | Die Option `dictionary` kann ein `ArrayBuffer` sein. |
| v8.0.0 | Die Option `dictionary` kann jetzt ein `Uint8Array` sein. |
| v5.11.0 | Die Option `finishFlush` wird jetzt unterstützt. |
| v0.11.1 | Hinzugefügt in: v0.11.1 |
:::

Jede zlib-basierte Klasse akzeptiert ein `options`-Objekt. Es sind keine Optionen erforderlich.

Einige Optionen sind nur beim Komprimieren relevant und werden von den Dekompressionsklassen ignoriert.

- `flush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `zlib.constants.Z_NO_FLUSH`
- `finishFlush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `zlib.constants.Z_FINISH`
- `chunkSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `16 * 1024`
- `windowBits` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `level` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (nur Komprimierung)
- `memLevel` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (nur Komprimierung)
- `strategy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (nur Komprimierung)
- `dictionary` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) (nur Deflate/Inflate, standardmäßig leeres Wörterbuch)
- `info` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) (Wenn `true`, wird ein Objekt mit `buffer` und `engine` zurückgegeben.)
- `maxOutputLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Begrenzt die Ausgabegröße bei Verwendung von [Komfortmethoden](/de/nodejs/api/zlib#convenience-methods). **Standard:** [`buffer.kMaxLength`](/de/nodejs/api/buffer#bufferkmaxlength)

Weitere Informationen finden Sie in der Dokumentation zu [`deflateInit2` und `inflateInit2`](https://zlib.net/manual#Advanced).


## Klasse: `BrotliOptions` {#class-brotlioptions}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v14.5.0, v12.19.0 | Die Option `maxOutputLength` wird jetzt unterstützt. |
| v11.7.0 | Hinzugefügt in: v11.7.0 |
:::

Jede Brotli-basierte Klasse nimmt ein `options`-Objekt entgegen. Alle Optionen sind optional.

- `flush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `zlib.constants.BROTLI_OPERATION_PROCESS`
- `finishFlush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `zlib.constants.BROTLI_OPERATION_FINISH`
- `chunkSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `16 * 1024`
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Key-Value-Objekt mit indizierten [Brotli-Parametern](/de/nodejs/api/zlib#brotli-constants).
- `maxOutputLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Beschränkt die Ausgabegröße bei Verwendung von [Komfortmethoden](/de/nodejs/api/zlib#convenience-methods). **Standard:** [`buffer.kMaxLength`](/de/nodejs/api/buffer#bufferkmaxlength)

Zum Beispiel:

```js [ESM]
const stream = zlib.createBrotliCompress({
  chunkSize: 32 * 1024,
  params: {
    [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
    [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
    [zlib.constants.BROTLI_PARAM_SIZE_HINT]: fs.statSync(inputFile).size,
  },
});
```
## Klasse: `zlib.BrotliCompress` {#class-zlibbrotlicompress}

**Hinzugefügt in: v11.7.0, v10.16.0**

Komprimiert Daten mit dem Brotli-Algorithmus.

## Klasse: `zlib.BrotliDecompress` {#class-zlibbrotlidecompress}

**Hinzugefügt in: v11.7.0, v10.16.0**

Dekomprimiert Daten mit dem Brotli-Algorithmus.

## Klasse: `zlib.Deflate` {#class-zlibdeflate}

**Hinzugefügt in: v0.5.8**

Komprimiert Daten mit Deflate.

## Klasse: `zlib.DeflateRaw` {#class-zlibdeflateraw}

**Hinzugefügt in: v0.5.8**

Komprimiert Daten mit Deflate und hängt keinen `zlib`-Header an.

## Klasse: `zlib.Gunzip` {#class-zlibgunzip}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v6.0.0 | Nachfolgender Müll am Ende des Eingabestreams führt jetzt zu einem `'error'`-Ereignis. |
| v5.9.0 | Mehrere verkettete gzip-Dateielemente werden jetzt unterstützt. |
| v5.0.0 | Ein abgeschnittener Eingabestream führt jetzt zu einem `'error'`-Ereignis. |
| v0.5.8 | Hinzugefügt in: v0.5.8 |
:::

Dekomprimiert einen gzip-Stream.


## Klasse: `zlib.Gzip` {#class-zlibgzip}

**Hinzugefügt in: v0.5.8**

Komprimiert Daten mit gzip.

## Klasse: `zlib.Inflate` {#class-zlibinflate}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v5.0.0 | Ein abgeschnittener Eingabestream führt jetzt zu einem `'error'`-Ereignis. |
| v0.5.8 | Hinzugefügt in: v0.5.8 |
:::

Dekomprimiert einen Deflate-Stream.

## Klasse: `zlib.InflateRaw` {#class-zlibinflateraw}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v6.8.0 | Benutzerdefinierte Wörterbücher werden jetzt von `InflateRaw` unterstützt. |
| v5.0.0 | Ein abgeschnittener Eingabestream führt jetzt zu einem `'error'`-Ereignis. |
| v0.5.8 | Hinzugefügt in: v0.5.8 |
:::

Dekomprimiert einen rohen Deflate-Stream.

## Klasse: `zlib.Unzip` {#class-zlibunzip}

**Hinzugefügt in: v0.5.8**

Dekomprimiert entweder einen Gzip- oder Deflate-komprimierten Stream durch automatische Erkennung des Headers.

## Klasse: `zlib.ZlibBase` {#class-zlibzlibbase}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v11.7.0, v10.16.0 | Diese Klasse wurde von `Zlib` in `ZlibBase` umbenannt. |
| v0.5.8 | Hinzugefügt in: v0.5.8 |
:::

Wird nicht vom `node:zlib`-Modul exportiert. Sie wird hier dokumentiert, da sie die Basisklasse der Kompressor-/Dekompressorklassen ist.

Diese Klasse erbt von [`stream.Transform`](/de/nodejs/api/stream#class-streamtransform), wodurch `node:zlib`-Objekte in Pipes und ähnlichen Stream-Operationen verwendet werden können.

### `zlib.bytesWritten` {#zlibbyteswritten}

**Hinzugefügt in: v10.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die `zlib.bytesWritten`-Eigenschaft gibt die Anzahl der Bytes an, die in die Engine geschrieben wurden, bevor die Bytes verarbeitet werden (komprimiert oder dekomprimiert, je nach abgeleiteter Klasse).

### `zlib.crc32(data[, value])` {#zlibcrc32data-value}

**Hinzugefügt in: v22.2.0, v20.15.0**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Wenn `data` ein String ist, wird er als UTF-8 codiert, bevor er für die Berechnung verwendet wird.
- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ein optionaler Startwert. Es muss eine 32-Bit-Ganzzahl ohne Vorzeichen sein. **Standard:** `0`
- Rückgabe: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Eine 32-Bit-Ganzzahl ohne Vorzeichen, die die Prüfsumme enthält.

Berechnet eine 32-Bit-[Cyclic Redundancy Check](https://en.wikipedia.org/wiki/Cyclic_redundancy_check)-Prüfsumme von `data`. Wenn `value` angegeben ist, wird er als Startwert der Prüfsumme verwendet, andernfalls wird 0 als Startwert verwendet.

Der CRC-Algorithmus dient zur Berechnung von Prüfsummen und zur Erkennung von Fehlern bei der Datenübertragung. Er ist nicht für die kryptografische Authentifizierung geeignet.

Um mit anderen APIs konsistent zu sein, wird `data` als UTF-8 codiert, bevor es für die Berechnung verwendet wird, falls es ein String ist. Wenn Benutzer nur Node.js verwenden, um die Prüfsummen zu berechnen und abzugleichen, funktioniert dies gut mit anderen APIs, die standardmäßig die UTF-8-Codierung verwenden.

Einige JavaScript-Bibliotheken von Drittanbietern berechnen die Prüfsumme eines Strings basierend auf `str.charCodeAt()`, sodass sie in Browsern ausgeführt werden kann. Wenn Benutzer die Prüfsumme abgleichen möchten, die mit dieser Art von Bibliothek im Browser berechnet wurde, ist es besser, dieselbe Bibliothek in Node.js zu verwenden, wenn sie auch in Node.js ausgeführt wird. Wenn Benutzer `zlib.crc32()` verwenden müssen, um die Prüfsumme abzugleichen, die von einer solchen Drittanbieterbibliothek erzeugt wird:

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import { Buffer } from 'node:buffer';

let crc = zlib.crc32('hello');  // 907060870
crc = zlib.crc32('world', crc);  // 4192936109

crc = zlib.crc32(Buffer.from('hello', 'utf16le'));  // 1427272415
crc = zlib.crc32(Buffer.from('world', 'utf16le'), crc);  // 4150509955
```

```js [CJS]
const zlib = require('node:zlib');
const { Buffer } = require('node:buffer');

let crc = zlib.crc32('hello');  // 907060870
crc = zlib.crc32('world', crc);  // 4192936109

crc = zlib.crc32(Buffer.from('hello', 'utf16le'));  // 1427272415
crc = zlib.crc32(Buffer.from('world', 'utf16le'), crc);  // 4150509955
```
:::


### `zlib.close([callback])` {#zlibclosecallback}

**Hinzugefügt in: v0.9.4**

- `callback` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Schließt das zugrunde liegende Handle.

### `zlib.flush([kind, ]callback)` {#zlibflushkind-callback}

**Hinzugefügt in: v0.5.8**

- `kind` **Standard:** `zlib.constants.Z_FULL_FLUSH` für Zlib-basierte Streams, `zlib.constants.BROTLI_OPERATION_FLUSH` für Brotli-basierte Streams.
- `callback` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Leert ausstehende Daten. Rufen Sie dies nicht leichtfertig auf, vorzeitiges Leeren beeinträchtigt die Wirksamkeit des Komprimierungsalgorithmus negativ.

Das Aufrufen dieser Funktion leert nur Daten aus dem internen `zlib`-Zustand und führt keine Art von Leeren auf der Stream-Ebene durch. Vielmehr verhält es sich wie ein normaler Aufruf von `.write()`, d. h. es wird hinter anderen ausstehenden Schreibvorgängen in die Warteschlange eingereiht und gibt erst dann eine Ausgabe, wenn Daten aus dem Stream gelesen werden.

### `zlib.params(level, strategy, callback)` {#zlibparamslevel-strategy-callback}

**Hinzugefügt in: v0.11.4**

- `level` [\<Integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `strategy` [\<Integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Diese Funktion ist nur für Zlib-basierte Streams verfügbar, d. h. nicht für Brotli.

Aktualisieren Sie dynamisch das Kompressionslevel und die Kompressionsstrategie. Nur für den Deflate-Algorithmus anwendbar.

### `zlib.reset()` {#zlibreset}

**Hinzugefügt in: v0.7.0**

Setzt den Kompressor/Dekompressor auf die Werkseinstellungen zurück. Nur auf die Inflate- und Deflate-Algorithmen anwendbar.

## `zlib.constants` {#zlibconstants}

**Hinzugefügt in: v7.0.0**

Bietet ein Objekt, das Zlib-bezogene Konstanten auflistet.

## `zlib.createBrotliCompress([options])` {#zlibcreatebrotlicompressoptions}

**Hinzugefügt in: v11.7.0, v10.16.0**

- `options` [\<Brotli-Optionen\>](/de/nodejs/api/zlib#class-brotlioptions)

Erstellt ein neues [`BrotliCompress`](/de/nodejs/api/zlib#class-zlibbrotlicompress)-Objekt und gibt es zurück.


## `zlib.createBrotliDecompress([options])` {#zlibcreatebrotlidecompressoptions}

**Hinzugefügt in: v11.7.0, v10.16.0**

- `options` [\<Brotli-Optionen\>](/de/nodejs/api/zlib#class-brotlioptions)

Erstellt ein neues [`BrotliDecompress`](/de/nodejs/api/zlib#class-zlibbrotlidecompress)-Objekt und gibt es zurück.

## `zlib.createDeflate([options])` {#zlibcreatedeflateoptions}

**Hinzugefügt in: v0.5.8**

- `options` [\<zlib-Optionen\>](/de/nodejs/api/zlib#class-options)

Erstellt ein neues [`Deflate`](/de/nodejs/api/zlib#class-zlibdeflate)-Objekt und gibt es zurück.

## `zlib.createDeflateRaw([options])` {#zlibcreatedeflaterawoptions}

**Hinzugefügt in: v0.5.8**

- `options` [\<zlib-Optionen\>](/de/nodejs/api/zlib#class-options)

Erstellt ein neues [`DeflateRaw`](/de/nodejs/api/zlib#class-zlibdeflateraw)-Objekt und gibt es zurück.

Ein Upgrade von zlib von 1.2.8 auf 1.2.11 änderte das Verhalten, wenn `windowBits` für rohe Deflate-Streams auf 8 gesetzt ist. zlib setzte automatisch `windowBits` auf 9, wenn es ursprünglich auf 8 gesetzt war. Neuere Versionen von zlib werfen eine Ausnahme, daher hat Node.js das ursprüngliche Verhalten der Hochstufung eines Werts von 8 auf 9 wiederhergestellt, da das Übergeben von `windowBits = 9` an zlib tatsächlich zu einem komprimierten Stream führt, der effektiv nur ein 8-Bit-Fenster verwendet.

## `zlib.createGunzip([options])` {#zlibcreategunzipoptions}

**Hinzugefügt in: v0.5.8**

- `options` [\<zlib-Optionen\>](/de/nodejs/api/zlib#class-options)

Erstellt ein neues [`Gunzip`](/de/nodejs/api/zlib#class-zlibgunzip)-Objekt und gibt es zurück.

## `zlib.createGzip([options])` {#zlibcreategzipoptions}

**Hinzugefügt in: v0.5.8**

- `options` [\<zlib-Optionen\>](/de/nodejs/api/zlib#class-options)

Erstellt ein neues [`Gzip`](/de/nodejs/api/zlib#class-zlibgzip)-Objekt und gibt es zurück. Siehe [Beispiel](/de/nodejs/api/zlib#zlib).

## `zlib.createInflate([options])` {#zlibcreateinflateoptions}

**Hinzugefügt in: v0.5.8**

- `options` [\<zlib-Optionen\>](/de/nodejs/api/zlib#class-options)

Erstellt ein neues [`Inflate`](/de/nodejs/api/zlib#class-zlibinflate)-Objekt und gibt es zurück.

## `zlib.createInflateRaw([options])` {#zlibcreateinflaterawoptions}

**Hinzugefügt in: v0.5.8**

- `options` [\<zlib-Optionen\>](/de/nodejs/api/zlib#class-options)

Erstellt ein neues [`InflateRaw`](/de/nodejs/api/zlib#class-zlibinflateraw)-Objekt und gibt es zurück.

## `zlib.createUnzip([options])` {#zlibcreateunzipoptions}

**Hinzugefügt in: v0.5.8**

- `options` [\<zlib-Optionen\>](/de/nodejs/api/zlib#class-options)

Erstellt ein neues [`Unzip`](/de/nodejs/api/zlib#class-zlibunzip)-Objekt und gibt es zurück.


## Komfortmethoden {#convenience-methods}

Alle diese nehmen einen [`Buffer`](/de/nodejs/api/buffer#class-buffer), [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView), [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) oder einen String als erstes Argument entgegen, ein optionales zweites Argument, um Optionen für die `zlib`-Klassen bereitzustellen, und rufen den bereitgestellten Callback mit `callback(error, result)` auf.

Jede Methode hat ein `*Sync`-Gegenstück, das dieselben Argumente akzeptiert, jedoch ohne Callback.

### `zlib.brotliCompress(buffer[, options], callback)` {#zlibbrotlicompressbuffer-options-callback}

**Hinzugefügt in: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli options\>](/de/nodejs/api/zlib#class-brotlioptions)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.brotliCompressSync(buffer[, options])` {#zlibbrotlicompresssyncbuffer-options}

**Hinzugefügt in: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli options\>](/de/nodejs/api/zlib#class-brotlioptions)

Komprimiert einen Datenblock mit [`BrotliCompress`](/de/nodejs/api/zlib#class-zlibbrotlicompress).


### `zlib.brotliDecompress(buffer[, options], callback)` {#zlibbrotlidecompressbuffer-options-callback}

**Hinzugefügt in: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli options\>](/de/nodejs/api/zlib#class-brotlioptions)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.brotliDecompressSync(buffer[, options])` {#zlibbrotlidecompresssyncbuffer-options}

**Hinzugefügt in: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli options\>](/de/nodejs/api/zlib#class-brotlioptions)

Dekomprimiert einen Datenabschnitt mit [`BrotliDecompress`](/de/nodejs/api/zlib#class-zlibbrotlidecompress).

### `zlib.deflate(buffer[, options], callback)` {#zlibdeflatebuffer-options-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v9.4.0 | Der Parameter `buffer` kann ein `ArrayBuffer` sein. |
| v8.0.0 | Der Parameter `buffer` kann ein beliebiges `TypedArray` oder `DataView` sein. |
| v8.0.0 | Der Parameter `buffer` kann jetzt ein `Uint8Array` sein. |
| v0.6.0 | Hinzugefügt in: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/de/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.deflateSync(buffer[, options])` {#zlibdeflatesyncbuffer-options}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v9.4.0 | Der Parameter `buffer` kann ein `ArrayBuffer` sein. |
| v8.0.0 | Der Parameter `buffer` kann ein beliebiger `TypedArray` oder `DataView` sein. |
| v8.0.0 | Der Parameter `buffer` kann jetzt ein `Uint8Array` sein. |
| v0.11.12 | Hinzugefügt in: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/de/nodejs/api/zlib#class-options)

Komprimiert einen Datenblock mit [`Deflate`](/de/nodejs/api/zlib#class-zlibdeflate).

### `zlib.deflateRaw(buffer[, options], callback)` {#zlibdeflaterawbuffer-options-callback}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v8.0.0 | Der Parameter `buffer` kann ein beliebiger `TypedArray` oder `DataView` sein. |
| v8.0.0 | Der Parameter `buffer` kann jetzt ein `Uint8Array` sein. |
| v0.6.0 | Hinzugefügt in: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/de/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.deflateRawSync(buffer[, options])` {#zlibdeflaterawsyncbuffer-options}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v9.4.0 | Der Parameter `buffer` kann ein `ArrayBuffer` sein. |
| v8.0.0 | Der Parameter `buffer` kann ein beliebiger `TypedArray` oder `DataView` sein. |
| v8.0.0 | Der Parameter `buffer` kann jetzt ein `Uint8Array` sein. |
| v0.11.12 | Hinzugefügt in: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/de/nodejs/api/zlib#class-options)

Komprimiert einen Datenblock mit [`DeflateRaw`](/de/nodejs/api/zlib#class-zlibdeflateraw).


### `zlib.gunzip(buffer[, options], callback)` {#zlibgunzipbuffer-options-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v9.4.0 | Der Parameter `buffer` kann ein `ArrayBuffer` sein. |
| v8.0.0 | Der Parameter `buffer` kann ein beliebiges `TypedArray` oder `DataView` sein. |
| v8.0.0 | Der Parameter `buffer` kann jetzt ein `Uint8Array` sein. |
| v0.6.0 | Hinzugefügt in: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/de/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.gunzipSync(buffer[, options])` {#zlibgunzipsyncbuffer-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v9.4.0 | Der Parameter `buffer` kann ein `ArrayBuffer` sein. |
| v8.0.0 | Der Parameter `buffer` kann ein beliebiges `TypedArray` oder `DataView` sein. |
| v8.0.0 | Der Parameter `buffer` kann jetzt ein `Uint8Array` sein. |
| v0.11.12 | Hinzugefügt in: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/de/nodejs/api/zlib#class-options)

Dekomprimiert einen Datenblock mit [`Gunzip`](/de/nodejs/api/zlib#class-zlibgunzip).

### `zlib.gzip(buffer[, options], callback)` {#zlibgzipbuffer-options-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v9.4.0 | Der Parameter `buffer` kann ein `ArrayBuffer` sein. |
| v8.0.0 | Der Parameter `buffer` kann ein beliebiges `TypedArray` oder `DataView` sein. |
| v8.0.0 | Der Parameter `buffer` kann jetzt ein `Uint8Array` sein. |
| v0.6.0 | Hinzugefügt in: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/de/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.gzipSync(buffer[, options])` {#zlibgzipsyncbuffer-options}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v9.4.0 | Der Parameter `buffer` kann ein `ArrayBuffer` sein. |
| v8.0.0 | Der Parameter `buffer` kann ein beliebiges `TypedArray` oder `DataView` sein. |
| v8.0.0 | Der Parameter `buffer` kann jetzt ein `Uint8Array` sein. |
| v0.11.12 | Hinzugefügt in: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/de/nodejs/api/zlib#class-options)

Komprimiert einen Datenblock mit [`Gzip`](/de/nodejs/api/zlib#class-zlibgzip).

### `zlib.inflate(buffer[, options], callback)` {#zlibinflatebuffer-options-callback}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v9.4.0 | Der Parameter `buffer` kann ein `ArrayBuffer` sein. |
| v8.0.0 | Der Parameter `buffer` kann ein beliebiges `TypedArray` oder `DataView` sein. |
| v8.0.0 | Der Parameter `buffer` kann jetzt ein `Uint8Array` sein. |
| v0.6.0 | Hinzugefügt in: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/de/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.inflateSync(buffer[, options])` {#zlibinflatesyncbuffer-options}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v9.4.0 | Der Parameter `buffer` kann ein `ArrayBuffer` sein. |
| v8.0.0 | Der Parameter `buffer` kann ein beliebiges `TypedArray` oder `DataView` sein. |
| v8.0.0 | Der Parameter `buffer` kann jetzt ein `Uint8Array` sein. |
| v0.11.12 | Hinzugefügt in: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/de/nodejs/api/zlib#class-options)

Dekomprimiert einen Datenblock mit [`Inflate`](/de/nodejs/api/zlib#class-zlibinflate).


### `zlib.inflateRaw(buffer[, options], callback)` {#zlibinflaterawbuffer-options-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v9.4.0 | Der Parameter `buffer` kann ein `ArrayBuffer` sein. |
| v8.0.0 | Der Parameter `buffer` kann ein beliebiges `TypedArray` oder `DataView` sein. |
| v8.0.0 | Der Parameter `buffer` kann jetzt ein `Uint8Array` sein. |
| v0.6.0 | Hinzugefügt in: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib Optionen\>](/de/nodejs/api/zlib#class-options)
- `callback` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.inflateRawSync(buffer[, options])` {#zlibinflaterawsyncbuffer-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v9.4.0 | Der Parameter `buffer` kann ein `ArrayBuffer` sein. |
| v8.0.0 | Der Parameter `buffer` kann ein beliebiges `TypedArray` oder `DataView` sein. |
| v8.0.0 | Der Parameter `buffer` kann jetzt ein `Uint8Array` sein. |
| v0.11.12 | Hinzugefügt in: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib Optionen\>](/de/nodejs/api/zlib#class-options)

Dekomprimiert einen Datenblock mit [`InflateRaw`](/de/nodejs/api/zlib#class-zlibinflateraw).

### `zlib.unzip(buffer[, options], callback)` {#zlibunzipbuffer-options-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v9.4.0 | Der Parameter `buffer` kann ein `ArrayBuffer` sein. |
| v8.0.0 | Der Parameter `buffer` kann ein beliebiges `TypedArray` oder `DataView` sein. |
| v8.0.0 | Der Parameter `buffer` kann jetzt ein `Uint8Array` sein. |
| v0.6.0 | Hinzugefügt in: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib Optionen\>](/de/nodejs/api/zlib#class-options)
- `callback` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.unzipSync(buffer[, options])` {#zlibunzipsyncbuffer-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v9.4.0 | Der Parameter `buffer` kann ein `ArrayBuffer` sein. |
| v8.0.0 | Der Parameter `buffer` kann ein beliebiges `TypedArray` oder `DataView` sein. |
| v8.0.0 | Der Parameter `buffer` kann jetzt ein `Uint8Array` sein. |
| v0.11.12 | Hinzugefügt in: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib-Optionen\>](/de/nodejs/api/zlib#class-options)

Dekomprimiert einen Datenblock mit [`Unzip`](/de/nodejs/api/zlib#class-zlibunzip).

