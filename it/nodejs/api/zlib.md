---
title: Documentazione Node.js - Zlib
description: Il modulo zlib in Node.js fornisce funzionalità di compressione utilizzando gli algoritmi Gzip, Deflate/Inflate e Brotli. Include metodi sincroni e asincroni per comprimere e decomprimere i dati, insieme a varie opzioni per personalizzare il comportamento della compressione.
head:
  - - meta
    - name: og:title
      content: Documentazione Node.js - Zlib | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Il modulo zlib in Node.js fornisce funzionalità di compressione utilizzando gli algoritmi Gzip, Deflate/Inflate e Brotli. Include metodi sincroni e asincroni per comprimere e decomprimere i dati, insieme a varie opzioni per personalizzare il comportamento della compressione.
  - - meta
    - name: twitter:title
      content: Documentazione Node.js - Zlib | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Il modulo zlib in Node.js fornisce funzionalità di compressione utilizzando gli algoritmi Gzip, Deflate/Inflate e Brotli. Include metodi sincroni e asincroni per comprimere e decomprimere i dati, insieme a varie opzioni per personalizzare il comportamento della compressione.
---


# Zlib {#zlib}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice Sorgente:** [lib/zlib.js](https://github.com/nodejs/node/blob/v23.5.0/lib/zlib.js)

Il modulo `node:zlib` fornisce funzionalità di compressione implementate usando Gzip, Deflate/Inflate e Brotli.

Per accedervi:



::: code-group
```js [ESM]
import os from 'node:zlib';
```

```js [CJS]
const zlib = require('node:zlib');
```
:::

La compressione e la decompressione sono costruite attorno alla [Streams API](/it/nodejs/api/stream) di Node.js.

La compressione o la decompressione di uno stream (come un file) può essere eseguita convogliando lo stream sorgente attraverso uno stream `Transform` di `zlib` in uno stream di destinazione:



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
    console.error('Si è verificato un errore:', err);
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
    console.error('Si è verificato un errore:', err);
    process.exitCode = 1;
  }
});
```
:::

Oppure, usando la promise API `pipeline`:



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
    console.error('Si è verificato un errore:', err);
    process.exitCode = 1;
  });
```
:::

È anche possibile comprimere o decomprimere i dati in un singolo passaggio:



::: code-group
```js [ESM]
import process from 'node:process';
import { Buffer } from 'node:buffer';
import { deflate, unzip } from 'node:zlib';

const input = '.................................';
deflate(input, (err, buffer) => {
  if (err) {
    console.error('Si è verificato un errore:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString('base64'));
});

const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
unzip(buffer, (err, buffer) => {
  if (err) {
    console.error('Si è verificato un errore:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString());
});

// Or, Promisified

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
    console.error('Si è verificato un errore:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString('base64'));
});

const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
unzip(buffer, (err, buffer) => {
  if (err) {
    console.error('Si è verificato un errore:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString());
});

// Or, Promisified

const { promisify } = require('node:util');
const do_unzip = promisify(unzip);

do_unzip(buffer)
  .then((buf) => console.log(buf.toString()))
  .catch((err) => {
    console.error('Si è verificato un errore:', err);
    process.exitCode = 1;
  });
```
:::

## Utilizzo del pool di thread e considerazioni sulle prestazioni {#threadpool-usage-and-performance-considerations}

Tutte le API `zlib`, ad eccezione di quelle esplicitamente sincrone, utilizzano il pool di thread interno di Node.js. Ciò può portare a effetti sorprendenti e limitazioni delle prestazioni in alcune applicazioni.

La creazione e l'utilizzo simultaneo di un gran numero di oggetti zlib può causare una significativa frammentazione della memoria.

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import { Buffer } from 'node:buffer';

const payload = Buffer.from('This is some data');

// ATTENZIONE: NON FARLO!
for (let i = 0; i < 30000; ++i) {
  zlib.deflate(payload, (err, buffer) => {});
}
```

```js [CJS]
const zlib = require('node:zlib');

const payload = Buffer.from('This is some data');

// ATTENZIONE: NON FARLO!
for (let i = 0; i < 30000; ++i) {
  zlib.deflate(payload, (err, buffer) => {});
}
```
:::

Nell'esempio precedente, vengono create contemporaneamente 30.000 istanze di deflate. A causa del modo in cui alcuni sistemi operativi gestiscono l'allocazione e la deallocazione della memoria, ciò potrebbe portare a una significativa frammentazione della memoria.

Si raccomanda vivamente di memorizzare nella cache i risultati delle operazioni di compressione per evitare la duplicazione degli sforzi.

## Compressione di richieste e risposte HTTP {#compressing-http-requests-and-responses}

Il modulo `node:zlib` può essere utilizzato per implementare il supporto per i meccanismi di content-encoding `gzip`, `deflate` e `br` definiti da [HTTP](https://tools.ietf.org/html/rfc7230#section-4.2).

L'header HTTP [`Accept-Encoding`](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14#sec14.3) viene utilizzato all'interno di una richiesta HTTP per identificare le codifiche di compressione accettate dal client. L'header [`Content-Encoding`](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14#sec14.11) viene utilizzato per identificare le codifiche di compressione effettivamente applicate a un messaggio.

Gli esempi forniti di seguito sono drasticamente semplificati per mostrare il concetto di base. L'utilizzo della codifica `zlib` può essere costoso e i risultati dovrebbero essere memorizzati nella cache. Consulta [Regolazione dell'utilizzo della memoria](/it/nodejs/api/zlib#memory-usage-tuning) per maggiori informazioni sui compromessi velocità/memoria/compressione coinvolti nell'utilizzo di `zlib`.

::: code-group
```js [ESM]
// Esempio di richiesta client
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
      console.error('Si è verificato un errore:', err);
      process.exitCode = 1;
    }
  };

  switch (response.headers['content-encoding']) {
    case 'br':
      pipeline(response, zlib.createBrotliDecompress(), output, onError);
      break;
    // Oppure, usa semplicemente zlib.createUnzip() per gestire entrambi i seguenti casi:
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
// Esempio di richiesta client
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
      console.error('Si è verificato un errore:', err);
      process.exitCode = 1;
    }
  };

  switch (response.headers['content-encoding']) {
    case 'br':
      pipeline(response, zlib.createBrotliDecompress(), output, onError);
      break;
    // Oppure, usa semplicemente zlib.createUnzip() per gestire entrambi i seguenti casi:
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
// esempio server
// L'esecuzione di un'operazione gzip su ogni richiesta è piuttosto costosa.
// Sarebbe molto più efficiente memorizzare nella cache il buffer compresso.
import zlib from 'node:zlib';
import http from 'node:http';
import fs from 'node:fs';
import { pipeline } from 'node:stream';

http.createServer((request, response) => {
  const raw = fs.createReadStream('index.html');
  // Memorizza sia una versione compressa che una non compressa della risorsa.
  response.setHeader('Vary', 'Accept-Encoding');
  const acceptEncoding = request.headers['accept-encoding'] || '';

  const onError = (err) => {
    if (err) {
      // Se si verifica un errore, non c'è molto che possiamo fare perché
      // il server ha già inviato il codice di risposta 200 e
      // una certa quantità di dati è già stata inviata al client.
      // La cosa migliore che possiamo fare è terminare immediatamente la risposta
      // e registrare l'errore.
      response.end();
      console.error('Si è verificato un errore:', err);
    }
  };

  // Nota: questo non è un parser accept-encoding conforme.
  // Vedi https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
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
// esempio server
// L'esecuzione di un'operazione gzip su ogni richiesta è piuttosto costosa.
// Sarebbe molto più efficiente memorizzare nella cache il buffer compresso.
const zlib = require('node:zlib');
const http = require('node:http');
const fs = require('node:fs');
const { pipeline } = require('node:stream');

http.createServer((request, response) => {
  const raw = fs.createReadStream('index.html');
  // Memorizza sia una versione compressa che una non compressa della risorsa.
  response.setHeader('Vary', 'Accept-Encoding');
  const acceptEncoding = request.headers['accept-encoding'] || '';

  const onError = (err) => {
    if (err) {
      // Se si verifica un errore, non c'è molto che possiamo fare perché
      // il server ha già inviato il codice di risposta 200 e
      // una certa quantità di dati è già stata inviata al client.
      // La cosa migliore che possiamo fare è terminare immediatamente la risposta
      // e registrare l'errore.
      response.end();
      console.error('Si è verificato un errore:', err);
    }
  };

  // Nota: questo non è un parser accept-encoding conforme.
  // Vedi https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
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

Per impostazione predefinita, i metodi `zlib` genereranno un errore durante la decompressione di dati troncati. Tuttavia, se è noto che i dati sono incompleti o si desidera ispezionare solo l'inizio di un file compresso, è possibile sopprimere la gestione degli errori predefinita modificando il metodo di flushing utilizzato per decomprimere l'ultimo chunk di dati di input:

```js [ESM]
// Questa è una versione troncata del buffer degli esempi precedenti
const buffer = Buffer.from('eJzT0yMA', 'base64');

zlib.unzip(
  buffer,
  // Per Brotli, l'equivalente è zlib.constants.BROTLI_OPERATION_FLUSH.
  { finishFlush: zlib.constants.Z_SYNC_FLUSH },
  (err, buffer) => {
    if (err) {
      console.error('Si è verificato un errore:', err);
      process.exitCode = 1;
    }
    console.log(buffer.toString());
  });
```
Ciò non cambierà il comportamento in altre situazioni di generazione di errori, ad esempio quando i dati di input hanno un formato non valido. Utilizzando questo metodo, non sarà possibile determinare se l'input è terminato prematuramente o è privo dei controlli di integrità, rendendo necessario verificare manualmente che il risultato decompresso sia valido.


## Ottimizzazione dell'utilizzo della memoria {#memory-usage-tuning}

### Per i flussi basati su zlib {#for-zlib-based-streams}

Da `zlib/zconf.h`, modificato per l'uso in Node.js:

I requisiti di memoria per deflate sono (in byte):

```js [ESM]
(1 << (windowBits + 2)) + (1 << (memLevel + 9))
```
Cioè: 128K per `windowBits` = 15 + 128K per `memLevel` = 8 (valori predefiniti) più alcuni kilobyte per piccoli oggetti.

Ad esempio, per ridurre i requisiti di memoria predefiniti da 256K a 128K, le opzioni dovrebbero essere impostate su:

```js [ESM]
const options = { windowBits: 14, memLevel: 7 };
```
Questo, tuttavia, generalmente degraderà la compressione.

I requisiti di memoria per inflate sono (in byte) `1 \<\< windowBits`. Cioè, 32K per `windowBits` = 15 (valore predefinito) più alcuni kilobyte per piccoli oggetti.

Questo si aggiunge a un singolo buffer di output interno di dimensione `chunkSize`, che di default è 16K.

La velocità della compressione `zlib` è influenzata in modo più drammatico dall'impostazione `level`. Un livello più alto risulterà in una compressione migliore, ma richiederà più tempo per essere completata. Un livello più basso risulterà in una compressione inferiore, ma sarà molto più veloce.

In generale, opzioni di maggiore utilizzo della memoria significheranno che Node.js dovrà effettuare meno chiamate a `zlib` perché sarà in grado di elaborare più dati su ogni operazione di `write`. Quindi, questo è un altro fattore che influisce sulla velocità, a costo dell'utilizzo della memoria.

### Per i flussi basati su Brotli {#for-brotli-based-streams}

Ci sono equivalenti alle opzioni zlib per i flussi basati su Brotli, anche se queste opzioni hanno intervalli diversi rispetto a quelle di zlib:

- l'opzione `level` di zlib corrisponde all'opzione `BROTLI_PARAM_QUALITY` di Brotli.
- l'opzione `windowBits` di zlib corrisponde all'opzione `BROTLI_PARAM_LGWIN` di Brotli.

Vedi [sotto](/it/nodejs/api/zlib#brotli-constants) per maggiori dettagli sulle opzioni specifiche di Brotli.

## Flushing {#flushing}

La chiamata a [`.flush()`](/it/nodejs/api/zlib#zlibflushkind-callback) su un flusso di compressione farà in modo che `zlib` restituisca la maggior quantità di output possibile. Questo può avvenire a costo di una qualità di compressione degradata, ma può essere utile quando i dati devono essere disponibili il prima possibile.

Nell'esempio seguente, `flush()` viene utilizzato per scrivere una risposta HTTP parziale compressa al client:

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import http from 'node:http';
import { pipeline } from 'node:stream';

http.createServer((request, response) => {
  // Per semplicità, i controlli Accept-Encoding vengono omessi.
  response.writeHead(200, { 'content-encoding': 'gzip' });
  const output = zlib.createGzip();
  let i;

  pipeline(output, response, (err) => {
    if (err) {
      // Se si verifica un errore, non c'è molto che possiamo fare perché
      // il server ha già inviato il codice di risposta 200 e
      // una certa quantità di dati è già stata inviata al client.
      // La cosa migliore che possiamo fare è terminare immediatamente la risposta
      // e registrare l'errore.
      clearInterval(i);
      response.end();
      console.error('An error occurred:', err);
    }
  });

  i = setInterval(() => {
    output.write(`The current time is ${Date()}\n`, () => {
      // I dati sono stati passati a zlib, ma l'algoritmo di compressione potrebbe
      // aver deciso di memorizzare i dati nel buffer per una compressione più efficiente.
      // La chiamata a .flush() renderà i dati disponibili non appena il client
      // è pronto a riceverli.
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
  // Per semplicità, i controlli Accept-Encoding vengono omessi.
  response.writeHead(200, { 'content-encoding': 'gzip' });
  const output = zlib.createGzip();
  let i;

  pipeline(output, response, (err) => {
    if (err) {
      // Se si verifica un errore, non c'è molto che possiamo fare perché
      // il server ha già inviato il codice di risposta 200 e
      // una certa quantità di dati è già stata inviata al client.
      // La cosa migliore che possiamo fare è terminare immediatamente la risposta
      // e registrare l'errore.
      clearInterval(i);
      response.end();
      console.error('An error occurred:', err);
    }
  });

  i = setInterval(() => {
    output.write(`The current time is ${Date()}\n`, () => {
      // I dati sono stati passati a zlib, ma l'algoritmo di compressione potrebbe
      // aver deciso di memorizzare i dati nel buffer per una compressione più efficiente.
      // La chiamata a .flush() renderà i dati disponibili non appena il client
      // è pronto a riceverli.
      output.flush();
    });
  }, 1000);
}).listen(1337);
```
:::


## Costanti {#constants}

**Aggiunto in: v0.5.8**

### Costanti zlib {#zlib-constants}

Tutte le costanti definite in `zlib.h` sono anche definite in `require('node:zlib').constants`. Nel normale corso delle operazioni, non sarà necessario utilizzare queste costanti. Sono documentate in modo che la loro presenza non sia sorprendente. Questa sezione è tratta quasi direttamente dalla [documentazione di zlib](https://zlib.net/manual#Constants).

In precedenza, le costanti erano disponibili direttamente da `require('node:zlib')`, ad esempio `zlib.Z_NO_FLUSH`. L'accesso alle costanti direttamente dal modulo è attualmente ancora possibile, ma è deprecato.

Valori di flush consentiti.

- `zlib.constants.Z_NO_FLUSH`
- `zlib.constants.Z_PARTIAL_FLUSH`
- `zlib.constants.Z_SYNC_FLUSH`
- `zlib.constants.Z_FULL_FLUSH`
- `zlib.constants.Z_FINISH`
- `zlib.constants.Z_BLOCK`
- `zlib.constants.Z_TREES`

Codici di ritorno per le funzioni di compressione/decompressione. I valori negativi sono errori, i valori positivi sono utilizzati per eventi speciali ma normali.

- `zlib.constants.Z_OK`
- `zlib.constants.Z_STREAM_END`
- `zlib.constants.Z_NEED_DICT`
- `zlib.constants.Z_ERRNO`
- `zlib.constants.Z_STREAM_ERROR`
- `zlib.constants.Z_DATA_ERROR`
- `zlib.constants.Z_MEM_ERROR`
- `zlib.constants.Z_BUF_ERROR`
- `zlib.constants.Z_VERSION_ERROR`

Livelli di compressione.

- `zlib.constants.Z_NO_COMPRESSION`
- `zlib.constants.Z_BEST_SPEED`
- `zlib.constants.Z_BEST_COMPRESSION`
- `zlib.constants.Z_DEFAULT_COMPRESSION`

Strategia di compressione.

- `zlib.constants.Z_FILTERED`
- `zlib.constants.Z_HUFFMAN_ONLY`
- `zlib.constants.Z_RLE`
- `zlib.constants.Z_FIXED`
- `zlib.constants.Z_DEFAULT_STRATEGY`

### Costanti Brotli {#brotli-constants}

**Aggiunto in: v11.7.0, v10.16.0**

Sono disponibili diverse opzioni e altre costanti per gli stream basati su Brotli:

#### Operazioni di Flush {#flush-operations}

I seguenti valori sono operazioni di flush valide per gli stream basati su Brotli:

- `zlib.constants.BROTLI_OPERATION_PROCESS` (predefinito per tutte le operazioni)
- `zlib.constants.BROTLI_OPERATION_FLUSH` (predefinito quando si chiama `.flush()`)
- `zlib.constants.BROTLI_OPERATION_FINISH` (predefinito per l'ultimo chunk)
- `zlib.constants.BROTLI_OPERATION_EMIT_METADATA`
    - Questa particolare operazione potrebbe essere difficile da usare in un contesto Node.js, poiché il livello di streaming rende difficile sapere quali dati finiranno in questo frame. Inoltre, al momento non c'è modo di consumare questi dati attraverso l'API Node.js.


#### Opzioni del compressore {#compressor-options}

Esistono diverse opzioni che possono essere impostate sui codificatori Brotli, influenzando l'efficienza e la velocità di compressione. Sia le chiavi che i valori sono accessibili come proprietà dell'oggetto `zlib.constants`.

Le opzioni più importanti sono:

- `BROTLI_PARAM_MODE`
    - `BROTLI_MODE_GENERIC` (predefinito)
    - `BROTLI_MODE_TEXT`, regolato per il testo UTF-8
    - `BROTLI_MODE_FONT`, regolato per i font WOFF 2.0


- `BROTLI_PARAM_QUALITY`
    - Varia da `BROTLI_MIN_QUALITY` a `BROTLI_MAX_QUALITY`, con un valore predefinito di `BROTLI_DEFAULT_QUALITY`.


- `BROTLI_PARAM_SIZE_HINT`
    - Valore intero che rappresenta la dimensione di input prevista; il valore predefinito è `0` per una dimensione di input sconosciuta.



I seguenti flag possono essere impostati per un controllo avanzato sull'algoritmo di compressione e sulla regolazione dell'utilizzo della memoria:

- `BROTLI_PARAM_LGWIN`
    - Varia da `BROTLI_MIN_WINDOW_BITS` a `BROTLI_MAX_WINDOW_BITS`, con un valore predefinito di `BROTLI_DEFAULT_WINDOW`, oppure fino a `BROTLI_LARGE_MAX_WINDOW_BITS` se è impostato il flag `BROTLI_PARAM_LARGE_WINDOW`.


- `BROTLI_PARAM_LGBLOCK`
    - Varia da `BROTLI_MIN_INPUT_BLOCK_BITS` a `BROTLI_MAX_INPUT_BLOCK_BITS`.


- `BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING`
    - Flag booleano che diminuisce il rapporto di compressione a favore della velocità di decompressione.


- `BROTLI_PARAM_LARGE_WINDOW`
    - Flag booleano che abilita la modalità "Large Window Brotli" (non compatibile con il formato Brotli standardizzato in [RFC 7932](https://www.rfc-editor.org/rfc/rfc7932.txt)).


- `BROTLI_PARAM_NPOSTFIX`
    - Varia da `0` a `BROTLI_MAX_NPOSTFIX`.


- `BROTLI_PARAM_NDIRECT`
    - Varia da `0` a `15 \<\< NPOSTFIX` a passi di `1 \<\< NPOSTFIX`.



#### Opzioni del decompressore {#decompressor-options}

Queste opzioni avanzate sono disponibili per controllare la decompressione:

- `BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION`
    - Flag booleano che influenza i modelli di allocazione della memoria interna.


- `BROTLI_DECODER_PARAM_LARGE_WINDOW`
    - Flag booleano che abilita la modalità "Large Window Brotli" (non compatibile con il formato Brotli standardizzato in [RFC 7932](https://www.rfc-editor.org/rfc/rfc7932.txt)).


## Classe: `Options` {#class-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.5.0, v12.19.0 | L'opzione `maxOutputLength` è ora supportata. |
| v9.4.0 | L'opzione `dictionary` può essere un `ArrayBuffer`. |
| v8.0.0 | L'opzione `dictionary` può essere un `Uint8Array` ora. |
| v5.11.0 | L'opzione `finishFlush` è ora supportata. |
| v0.11.1 | Aggiunto in: v0.11.1 |
:::

Ogni classe basata su zlib accetta un oggetto `options`. Nessuna opzione è richiesta.

Alcune opzioni sono rilevanti solo durante la compressione e vengono ignorate dalle classi di decompressione.

- `flush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `zlib.constants.Z_NO_FLUSH`
- `finishFlush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `zlib.constants.Z_FINISH`
- `chunkSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `16 * 1024`
- `windowBits` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `level` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (solo compressione)
- `memLevel` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (solo compressione)
- `strategy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (solo compressione)
- `dictionary` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) (solo deflate/inflate, dizionario vuoto per impostazione predefinita)
- `info` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) (Se `true`, restituisce un oggetto con `buffer` e `engine`.)
- `maxOutputLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Limita la dimensione dell'output quando si utilizzano i [metodi di convenienza](/it/nodejs/api/zlib#convenience-methods). **Predefinito:** [`buffer.kMaxLength`](/it/nodejs/api/buffer#bufferkmaxlength)

Vedere la documentazione [`deflateInit2` e `inflateInit2`](https://zlib.net/manual#Advanced) per maggiori informazioni.


## Classe: `BrotliOptions` {#class-brotlioptions}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.5.0, v12.19.0 | L'opzione `maxOutputLength` è ora supportata. |
| v11.7.0 | Aggiunto in: v11.7.0 |
:::

Ogni classe basata su Brotli accetta un oggetto `options`. Tutte le opzioni sono opzionali.

- `flush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `zlib.constants.BROTLI_OPERATION_PROCESS`
- `finishFlush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `zlib.constants.BROTLI_OPERATION_FINISH`
- `chunkSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `16 * 1024`
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Oggetto chiave-valore contenente i [parametri Brotli](/it/nodejs/api/zlib#brotli-constants) indicizzati.
- `maxOutputLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Limita la dimensione dell'output quando si utilizzano i [metodi di convenienza](/it/nodejs/api/zlib#convenience-methods). **Predefinito:** [`buffer.kMaxLength`](/it/nodejs/api/buffer#bufferkmaxlength)

Per esempio:

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
## Classe: `zlib.BrotliCompress` {#class-zlibbrotlicompress}

**Aggiunto in: v11.7.0, v10.16.0**

Comprime i dati utilizzando l'algoritmo Brotli.

## Classe: `zlib.BrotliDecompress` {#class-zlibbrotlidecompress}

**Aggiunto in: v11.7.0, v10.16.0**

Decomprime i dati utilizzando l'algoritmo Brotli.

## Classe: `zlib.Deflate` {#class-zlibdeflate}

**Aggiunto in: v0.5.8**

Comprime i dati utilizzando deflate.

## Classe: `zlib.DeflateRaw` {#class-zlibdeflateraw}

**Aggiunto in: v0.5.8**

Comprime i dati utilizzando deflate e non aggiunge un header `zlib`.

## Classe: `zlib.Gunzip` {#class-zlibgunzip}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.0.0 | Dati spazzatura alla fine del flusso di input ora comporteranno un evento `'error'`. |
| v5.9.0 | Sono ora supportati membri di file gzip concatenati multipli. |
| v5.0.0 | Un flusso di input troncato ora comporterà un evento `'error'`. |
| v0.5.8 | Aggiunto in: v0.5.8 |
:::

Decomprime un flusso gzip.


## Classe: `zlib.Gzip` {#class-zlibgzip}

**Aggiunta in: v0.5.8**

Comprime i dati usando gzip.

## Classe: `zlib.Inflate` {#class-zlibinflate}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v5.0.0 | Un flusso di input troncato ora risulterà in un evento `'error'`. |
| v0.5.8 | Aggiunta in: v0.5.8 |
:::

Decomprime un flusso deflate.

## Classe: `zlib.InflateRaw` {#class-zlibinflateraw}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.8.0 | I dizionari personalizzati sono ora supportati da `InflateRaw`. |
| v5.0.0 | Un flusso di input troncato ora risulterà in un evento `'error'`. |
| v0.5.8 | Aggiunta in: v0.5.8 |
:::

Decomprime un flusso deflate raw.

## Classe: `zlib.Unzip` {#class-zlibunzip}

**Aggiunta in: v0.5.8**

Decomprime un flusso compresso con Gzip o Deflate rilevando automaticamente l'intestazione.

## Classe: `zlib.ZlibBase` {#class-zlibzlibbase}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.7.0, v10.16.0 | Questa classe è stata rinominata da `Zlib` a `ZlibBase`. |
| v0.5.8 | Aggiunta in: v0.5.8 |
:::

Non esportata dal modulo `node:zlib`. È documentata qui perché è la classe base delle classi compressore/decompressore.

Questa classe eredita da [`stream.Transform`](/it/nodejs/api/stream#class-streamtransform), consentendo agli oggetti `node:zlib` di essere utilizzati in pipe e operazioni di flusso simili.

### `zlib.bytesWritten` {#zlibbyteswritten}

**Aggiunta in: v10.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La proprietà `zlib.bytesWritten` specifica il numero di byte scritti nel motore, prima che i byte vengano elaborati (compressi o decompressi, a seconda della classe derivata).

### `zlib.crc32(data[, value])` {#zlibcrc32data-value}

**Aggiunta in: v22.2.0, v20.15.0**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Quando `data` è una stringa, verrà codificata come UTF-8 prima di essere utilizzata per il calcolo.
- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un valore iniziale opzionale. Deve essere un intero senza segno a 32 bit. **Predefinito:** `0`
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un intero senza segno a 32 bit contenente il checksum.

Calcola un checksum a 32 bit [Cyclic Redundancy Check](https://en.wikipedia.org/wiki/Cyclic_redundancy_check) di `data`. Se viene specificato `value`, viene utilizzato come valore iniziale del checksum, altrimenti, viene utilizzato 0 come valore iniziale.

L'algoritmo CRC è progettato per calcolare i checksum e rilevare errori nella trasmissione dei dati. Non è adatto per l'autenticazione crittografica.

Per essere coerenti con altre API, se i `data` sono una stringa, verranno codificati con UTF-8 prima di essere utilizzati per il calcolo. Se gli utenti utilizzano solo Node.js per calcolare e abbinare i checksum, questo funziona bene con altre API che utilizzano la codifica UTF-8 per impostazione predefinita.

Alcune librerie JavaScript di terze parti calcolano il checksum su una stringa basata su `str.charCodeAt()` in modo che possa essere eseguita nei browser. Se gli utenti desiderano abbinare il checksum calcolato con questo tipo di libreria nel browser, è meglio utilizzare la stessa libreria in Node.js se viene eseguita anche in Node.js. Se gli utenti devono utilizzare `zlib.crc32()` per abbinare il checksum prodotto da tale libreria di terze parti:



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

**Aggiunto in: v0.9.4**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Chiude l'handle sottostante.

### `zlib.flush([kind, ]callback)` {#zlibflushkind-callback}

**Aggiunto in: v0.5.8**

- `kind` **Predefinito:** `zlib.constants.Z_FULL_FLUSH` per gli stream basati su zlib, `zlib.constants.BROTLI_OPERATION_FLUSH` per gli stream basati su Brotli.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Svuota i dati in sospeso. Non chiamare questa funzione in modo frivolo, le scariche premature influiscono negativamente sull'efficacia dell'algoritmo di compressione.

Chiamare questa funzione svuota solo i dati dallo stato `zlib` interno e non esegue alcun tipo di scarica a livello di stream. Piuttosto, si comporta come una normale chiamata a `.write()`, ovvero verrà accodata dietro altre scritture in sospeso e produrrà output solo quando i dati vengono letti dallo stream.

### `zlib.params(level, strategy, callback)` {#zlibparamslevel-strategy-callback}

**Aggiunto in: v0.11.4**

- `level` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `strategy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Questa funzione è disponibile solo per gli stream basati su zlib, ovvero non Brotli.

Aggiorna dinamicamente il livello di compressione e la strategia di compressione. Applicabile solo all'algoritmo deflate.

### `zlib.reset()` {#zlibreset}

**Aggiunto in: v0.7.0**

Ripristina il compressore/decompressore ai valori predefiniti di fabbrica. Applicabile solo agli algoritmi di inflate e deflate.

## `zlib.constants` {#zlibconstants}

**Aggiunto in: v7.0.0**

Fornisce un oggetto che enumera le costanti relative a Zlib.

## `zlib.createBrotliCompress([options])` {#zlibcreatebrotlicompressoptions}

**Aggiunto in: v11.7.0, v10.16.0**

- `options` [\<brotli options\>](/it/nodejs/api/zlib#class-brotlioptions)

Crea e restituisce un nuovo oggetto [`BrotliCompress`](/it/nodejs/api/zlib#class-zlibbrotlicompress).


## `zlib.createBrotliDecompress([options])` {#zlibcreatebrotlidecompressoptions}

**Aggiunto in: v11.7.0, v10.16.0**

- `options` [\<opzioni Brotli\>](/it/nodejs/api/zlib#class-brotlioptions)

Crea e restituisce un nuovo oggetto [`BrotliDecompress`](/it/nodejs/api/zlib#class-zlibbrotlidecompress).

## `zlib.createDeflate([options])` {#zlibcreatedeflateoptions}

**Aggiunto in: v0.5.8**

- `options` [\<opzioni zlib\>](/it/nodejs/api/zlib#class-options)

Crea e restituisce un nuovo oggetto [`Deflate`](/it/nodejs/api/zlib#class-zlibdeflate).

## `zlib.createDeflateRaw([options])` {#zlibcreatedeflaterawoptions}

**Aggiunto in: v0.5.8**

- `options` [\<opzioni zlib\>](/it/nodejs/api/zlib#class-options)

Crea e restituisce un nuovo oggetto [`DeflateRaw`](/it/nodejs/api/zlib#class-zlibdeflateraw).

Un aggiornamento di zlib dalla 1.2.8 alla 1.2.11 ha cambiato il comportamento quando `windowBits` è impostato su 8 per i flussi deflate raw. zlib avrebbe automaticamente impostato `windowBits` a 9 se inizialmente fosse stato impostato a 8. Le versioni più recenti di zlib genereranno un'eccezione, quindi Node.js ha ripristinato il comportamento originale di aggiornamento di un valore di 8 a 9, poiché passare `windowBits = 9` a zlib si traduce effettivamente in un flusso compresso che utilizza effettivamente solo una finestra a 8 bit.

## `zlib.createGunzip([options])` {#zlibcreategunzipoptions}

**Aggiunto in: v0.5.8**

- `options` [\<opzioni zlib\>](/it/nodejs/api/zlib#class-options)

Crea e restituisce un nuovo oggetto [`Gunzip`](/it/nodejs/api/zlib#class-zlibgunzip).

## `zlib.createGzip([options])` {#zlibcreategzipoptions}

**Aggiunto in: v0.5.8**

- `options` [\<opzioni zlib\>](/it/nodejs/api/zlib#class-options)

Crea e restituisce un nuovo oggetto [`Gzip`](/it/nodejs/api/zlib#class-zlibgzip). Vedi [esempio](/it/nodejs/api/zlib#zlib).

## `zlib.createInflate([options])` {#zlibcreateinflateoptions}

**Aggiunto in: v0.5.8**

- `options` [\<opzioni zlib\>](/it/nodejs/api/zlib#class-options)

Crea e restituisce un nuovo oggetto [`Inflate`](/it/nodejs/api/zlib#class-zlibinflate).

## `zlib.createInflateRaw([options])` {#zlibcreateinflaterawoptions}

**Aggiunto in: v0.5.8**

- `options` [\<opzioni zlib\>](/it/nodejs/api/zlib#class-options)

Crea e restituisce un nuovo oggetto [`InflateRaw`](/it/nodejs/api/zlib#class-zlibinflateraw).

## `zlib.createUnzip([options])` {#zlibcreateunzipoptions}

**Aggiunto in: v0.5.8**

- `options` [\<opzioni zlib\>](/it/nodejs/api/zlib#class-options)

Crea e restituisce un nuovo oggetto [`Unzip`](/it/nodejs/api/zlib#class-zlibunzip).


## Metodi di convenienza {#convenience-methods}

Tutti questi accettano un [`Buffer`](/it/nodejs/api/buffer#class-buffer), [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView), [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) o una stringa come primo argomento, un secondo argomento opzionale per fornire opzioni alle classi `zlib` e chiamerà il callback fornito con `callback(error, result)`.

Ogni metodo ha una controparte `*Sync`, che accetta gli stessi argomenti, ma senza un callback.

### `zlib.brotliCompress(buffer[, options], callback)` {#zlibbrotlicompressbuffer-options-callback}

**Aggiunto in: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opzioni brotli\>](/it/nodejs/api/zlib#class-brotlioptions)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.brotliCompressSync(buffer[, options])` {#zlibbrotlicompresssyncbuffer-options}

**Aggiunto in: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opzioni brotli\>](/it/nodejs/api/zlib#class-brotlioptions)

Comprime un blocco di dati con [`BrotliCompress`](/it/nodejs/api/zlib#class-zlibbrotlicompress).


### `zlib.brotliDecompress(buffer[, options], callback)` {#zlibbrotlidecompressbuffer-options-callback}

**Aggiunto in: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opzioni brotli\>](/it/nodejs/api/zlib#class-brotlioptions)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.brotliDecompressSync(buffer[, options])` {#zlibbrotlidecompresssyncbuffer-options}

**Aggiunto in: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opzioni brotli\>](/it/nodejs/api/zlib#class-brotlioptions)

Decomprime un blocco di dati con [`BrotliDecompress`](/it/nodejs/api/zlib#class-zlibbrotlidecompress).

### `zlib.deflate(buffer[, options], callback)` {#zlibdeflatebuffer-options-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.4.0 | Il parametro `buffer` può essere un `ArrayBuffer`. |
| v8.0.0 | Il parametro `buffer` può essere qualsiasi `TypedArray` o `DataView`. |
| v8.0.0 | Il parametro `buffer` ora può essere un `Uint8Array`. |
| v0.6.0 | Aggiunto in: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opzioni zlib\>](/it/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.deflateSync(buffer[, options])` {#zlibdeflatesyncbuffer-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.4.0 | Il parametro `buffer` può essere un `ArrayBuffer`. |
| v8.0.0 | Il parametro `buffer` può essere qualsiasi `TypedArray` o `DataView`. |
| v8.0.0 | Il parametro `buffer` ora può essere un `Uint8Array`. |
| v0.11.12 | Aggiunto in: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opzioni zlib\>](/it/nodejs/api/zlib#class-options)

Comprime un blocco di dati con [`Deflate`](/it/nodejs/api/zlib#class-zlibdeflate).

### `zlib.deflateRaw(buffer[, options], callback)` {#zlibdeflaterawbuffer-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.0.0 | Il parametro `buffer` può essere qualsiasi `TypedArray` o `DataView`. |
| v8.0.0 | Il parametro `buffer` ora può essere un `Uint8Array`. |
| v0.6.0 | Aggiunto in: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opzioni zlib\>](/it/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.deflateRawSync(buffer[, options])` {#zlibdeflaterawsyncbuffer-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.4.0 | Il parametro `buffer` può essere un `ArrayBuffer`. |
| v8.0.0 | Il parametro `buffer` può essere qualsiasi `TypedArray` o `DataView`. |
| v8.0.0 | Il parametro `buffer` ora può essere un `Uint8Array`. |
| v0.11.12 | Aggiunto in: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opzioni zlib\>](/it/nodejs/api/zlib#class-options)

Comprime un blocco di dati con [`DeflateRaw`](/it/nodejs/api/zlib#class-zlibdeflateraw).


### `zlib.gunzip(buffer[, options], callback)` {#zlibgunzipbuffer-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.4.0 | Il parametro `buffer` può essere un `ArrayBuffer`. |
| v8.0.0 | Il parametro `buffer` può essere qualsiasi `TypedArray` o `DataView`. |
| v8.0.0 | Il parametro `buffer` può essere un `Uint8Array` ora. |
| v0.6.0 | Aggiunto in: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/it/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.gunzipSync(buffer[, options])` {#zlibgunzipsyncbuffer-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.4.0 | Il parametro `buffer` può essere un `ArrayBuffer`. |
| v8.0.0 | Il parametro `buffer` può essere qualsiasi `TypedArray` o `DataView`. |
| v8.0.0 | Il parametro `buffer` può essere un `Uint8Array` ora. |
| v0.11.12 | Aggiunto in: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/it/nodejs/api/zlib#class-options)

Decomprime un blocco di dati con [`Gunzip`](/it/nodejs/api/zlib#class-zlibgunzip).

### `zlib.gzip(buffer[, options], callback)` {#zlibgzipbuffer-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.4.0 | Il parametro `buffer` può essere un `ArrayBuffer`. |
| v8.0.0 | Il parametro `buffer` può essere qualsiasi `TypedArray` o `DataView`. |
| v8.0.0 | Il parametro `buffer` può essere un `Uint8Array` ora. |
| v0.6.0 | Aggiunto in: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/it/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.gzipSync(buffer[, options])` {#zlibgzipsyncbuffer-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.4.0 | Il parametro `buffer` può essere un `ArrayBuffer`. |
| v8.0.0 | Il parametro `buffer` può essere qualsiasi `TypedArray` o `DataView`. |
| v8.0.0 | Il parametro `buffer` ora può essere un `Uint8Array`. |
| v0.11.12 | Aggiunto in: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opzioni zlib\>](/it/nodejs/api/zlib#class-options)

Comprime un blocco di dati con [`Gzip`](/it/nodejs/api/zlib#class-zlibgzip).

### `zlib.inflate(buffer[, options], callback)` {#zlibinflatebuffer-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.4.0 | Il parametro `buffer` può essere un `ArrayBuffer`. |
| v8.0.0 | Il parametro `buffer` può essere qualsiasi `TypedArray` o `DataView`. |
| v8.0.0 | Il parametro `buffer` ora può essere un `Uint8Array`. |
| v0.6.0 | Aggiunto in: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opzioni zlib\>](/it/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.inflateSync(buffer[, options])` {#zlibinflatesyncbuffer-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.4.0 | Il parametro `buffer` può essere un `ArrayBuffer`. |
| v8.0.0 | Il parametro `buffer` può essere qualsiasi `TypedArray` o `DataView`. |
| v8.0.0 | Il parametro `buffer` ora può essere un `Uint8Array`. |
| v0.11.12 | Aggiunto in: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opzioni zlib\>](/it/nodejs/api/zlib#class-options)

Decomprime un blocco di dati con [`Inflate`](/it/nodejs/api/zlib#class-zlibinflate).


### `zlib.inflateRaw(buffer[, options], callback)` {#zlibinflaterawbuffer-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.4.0 | Il parametro `buffer` può essere un `ArrayBuffer`. |
| v8.0.0 | Il parametro `buffer` può essere qualsiasi `TypedArray` o `DataView`. |
| v8.0.0 | Il parametro `buffer` ora può essere un `Uint8Array`. |
| v0.6.0 | Aggiunto in: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opzioni zlib\>](/it/nodejs/api/zlib#class-options)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.inflateRawSync(buffer[, options])` {#zlibinflaterawsyncbuffer-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.4.0 | Il parametro `buffer` può essere un `ArrayBuffer`. |
| v8.0.0 | Il parametro `buffer` può essere qualsiasi `TypedArray` o `DataView`. |
| v8.0.0 | Il parametro `buffer` ora può essere un `Uint8Array`. |
| v0.11.12 | Aggiunto in: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opzioni zlib\>](/it/nodejs/api/zlib#class-options)

Decomprime un blocco di dati con [`InflateRaw`](/it/nodejs/api/zlib#class-zlibinflateraw).

### `zlib.unzip(buffer[, options], callback)` {#zlibunzipbuffer-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.4.0 | Il parametro `buffer` può essere un `ArrayBuffer`. |
| v8.0.0 | Il parametro `buffer` può essere qualsiasi `TypedArray` o `DataView`. |
| v8.0.0 | Il parametro `buffer` ora può essere un `Uint8Array`. |
| v0.6.0 | Aggiunto in: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opzioni zlib\>](/it/nodejs/api/zlib#class-options)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.unzipSync(buffer[, options])` {#zlibunzipsyncbuffer-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.4.0 | Il parametro `buffer` può essere un `ArrayBuffer`. |
| v8.0.0 | Il parametro `buffer` può essere qualsiasi `TypedArray` o `DataView`. |
| v8.0.0 | Il parametro `buffer` ora può essere un `Uint8Array`. |
| v0.11.12 | Aggiunto in: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opzioni zlib\>](/it/nodejs/api/zlib#class-options)

Decomprime un blocco di dati con [`Unzip`](/it/nodejs/api/zlib#class-zlibunzip).

