---
title: Documentazione dell'API del Sistema di File di Node.js
description: Guida completa al modulo del sistema di file di Node.js, che dettaglia i metodi per operazioni sui file come la lettura, la scrittura, l'apertura, la chiusura e la gestione delle autorizzazioni e delle statistiche dei file.
head:
  - - meta
    - name: og:title
      content: Documentazione dell'API del Sistema di File di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Guida completa al modulo del sistema di file di Node.js, che dettaglia i metodi per operazioni sui file come la lettura, la scrittura, l'apertura, la chiusura e la gestione delle autorizzazioni e delle statistiche dei file.
  - - meta
    - name: twitter:title
      content: Documentazione dell'API del Sistema di File di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Guida completa al modulo del sistema di file di Node.js, che dettaglia i metodi per operazioni sui file come la lettura, la scrittura, l'apertura, la chiusura e la gestione delle autorizzazioni e delle statistiche dei file.
---


# File system {#file-system}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/fs.js](https://github.com/nodejs/node/blob/v23.5.0/lib/fs.js)

Il modulo `node:fs` consente di interagire con il file system in un modo modellato sulle funzioni POSIX standard.

Per utilizzare le API basate su promise:

::: code-group
```js [ESM]
import * as fs from 'node:fs/promises';
```

```js [CJS]
const fs = require('node:fs/promises');
```
:::

Per utilizzare le API di callback e sincrone:

::: code-group
```js [ESM]
import * as fs from 'node:fs';
```

```js [CJS]
const fs = require('node:fs');
```
:::

Tutte le operazioni del file system hanno forme sincrone, basate su callback e basate su promise e sono accessibili sia tramite la sintassi CommonJS che tramite i moduli ES6 (ESM).

## Esempio di Promise {#promise-example}

Le operazioni basate su Promise restituiscono una promise che viene soddisfatta al completamento dell'operazione asincrona.

::: code-group
```js [ESM]
import { unlink } from 'node:fs/promises';

try {
  await unlink('/tmp/hello');
  console.log('eliminato correttamente /tmp/hello');
} catch (error) {
  console.error('si è verificato un errore:', error.message);
}
```

```js [CJS]
const { unlink } = require('node:fs/promises');

(async function(path) {
  try {
    await unlink(path);
    console.log(`eliminato correttamente ${path}`);
  } catch (error) {
    console.error('si è verificato un errore:', error.message);
  }
})('/tmp/hello');
```
:::

## Esempio di Callback {#callback-example}

La forma di callback accetta una funzione di callback di completamento come ultimo argomento e invoca l'operazione in modo asincrono. Gli argomenti passati alla callback di completamento dipendono dal metodo, ma il primo argomento è sempre riservato a un'eccezione. Se l'operazione viene completata correttamente, il primo argomento è `null` o `undefined`.

::: code-group
```js [ESM]
import { unlink } from 'node:fs';

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('eliminato correttamente /tmp/hello');
});
```

```js [CJS]
const { unlink } = require('node:fs');

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('eliminato correttamente /tmp/hello');
});
```
:::

Le versioni basate su callback delle API del modulo `node:fs` sono preferibili all'uso delle API promise quando è richiesta la massima performance (sia in termini di tempo di esecuzione che di allocazione della memoria).


## Esempio sincrono {#synchronous-example}

Le API sincrone bloccano l'event loop di Node.js e l'ulteriore esecuzione di JavaScript fino al completamento dell'operazione. Le eccezioni vengono generate immediatamente e possono essere gestite utilizzando `try…catch`, oppure possono essere lasciate propagare verso l'alto.

::: code-group
```js [ESM]
import { unlinkSync } from 'node:fs';

try {
  unlinkSync('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (err) {
  // handle the error
}
```

```js [CJS]
const { unlinkSync } = require('node:fs');

try {
  unlinkSync('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (err) {
  // handle the error
}
```
:::

## API Promises {#promises-api}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.0.0 | Esporto come `require('fs/promises')`. |
| v11.14.0, v10.17.0 | Questa API non è più sperimentale. |
| v10.1.0 | L'API è accessibile solo tramite `require('fs').promises`. |
| v10.0.0 | Aggiunto in: v10.0.0 |
:::

L'API `fs/promises` fornisce metodi asincroni del file system che restituiscono promises.

Le API promise utilizzano il threadpool sottostante di Node.js per eseguire operazioni del file system al di fuori del thread dell'event loop. Queste operazioni non sono sincronizzate o threadsafe. È necessario prestare attenzione quando si eseguono più modifiche simultanee sullo stesso file o potrebbero verificarsi danni ai dati.

### Classe: `FileHandle` {#class-filehandle}

**Aggiunto in: v10.0.0**

Un oggetto [\<FileHandle\>](/it/nodejs/api/fs#class-filehandle) è un wrapper oggetto per un descrittore di file numerico.

Le istanze dell'oggetto [\<FileHandle\>](/it/nodejs/api/fs#class-filehandle) vengono create dal metodo `fsPromises.open()`.

Tutti gli oggetti [\<FileHandle\>](/it/nodejs/api/fs#class-filehandle) sono [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter).

Se un [\<FileHandle\>](/it/nodejs/api/fs#class-filehandle) non viene chiuso utilizzando il metodo `filehandle.close()`, cercherà di chiudere automaticamente il descrittore di file ed emetterà un avviso di processo, contribuendo a prevenire perdite di memoria. Si prega di non fare affidamento su questo comportamento perché può essere inaffidabile e il file potrebbe non essere chiuso. Invece, chiudere sempre esplicitamente i [\<FileHandle\>](/it/nodejs/api/fs#class-filehandle). Node.js potrebbe modificare questo comportamento in futuro.


#### Evento: `'close'` {#event-close}

**Aggiunto in: v15.4.0**

L'evento `'close'` viene emesso quando il [\<FileHandle\>](/it/nodejs/api/fs#class-filehandle) è stato chiuso e non può più essere utilizzato.

#### `filehandle.appendFile(data[, options])` {#filehandleappendfiledata-options}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.1.0, v20.10.0 | L'opzione `flush` è ora supportata. |
| v15.14.0, v14.18.0 | L'argomento `data` supporta `AsyncIterable`, `Iterable` e `Stream`. |
| v14.0.0 | Il parametro `data` non forzerà più l'input non supportato a stringhe. |
| v10.0.0 | Aggiunto in: v10.0.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/it/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `'utf8'`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, il descrittore di file sottostante viene scaricato prima di chiuderlo. **Predefinito:** `false`.
  
 
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si adempie con `undefined` in caso di successo.

Alias di [`filehandle.writeFile()`](/it/nodejs/api/fs#filehandlewritefiledata-options).

Quando si opera su handle di file, la modalità non può essere modificata rispetto a quella impostata con [`fsPromises.open()`](/it/nodejs/api/fs#fspromisesopenpath-flags-mode). Pertanto, questo è equivalente a [`filehandle.writeFile()`](/it/nodejs/api/fs#filehandlewritefiledata-options).


#### `filehandle.chmod(mode)` {#filehandlechmodmode}

**Aggiunto in: v10.0.0**

- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) la maschera di bit del modo del file.
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si adempie con `undefined` in caso di successo.

Modifica i permessi del file. Vedere [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2).

#### `filehandle.chown(uid, gid)` {#filehandlechownuid-gid}

**Aggiunto in: v10.0.0**

- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID utente del nuovo proprietario del file.
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID del gruppo del nuovo gruppo del file.
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si adempie con `undefined` in caso di successo.

Cambia la proprietà del file. Un wrapper per [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2).

#### `filehandle.close()` {#filehandleclose}

**Aggiunto in: v10.0.0**

- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si adempie con `undefined` in caso di successo.

Chiude l'handle del file dopo aver atteso il completamento di qualsiasi operazione in sospeso sull'handle.

```js [ESM]
import { open } from 'node:fs/promises';

let filehandle;
try {
  filehandle = await open('thefile.txt', 'r');
} finally {
  await filehandle?.close();
}
```
#### `filehandle.createReadStream([options])` {#filehandlecreatereadstreamoptions}

**Aggiunto in: v16.11.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `null`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `64 * 1024`
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) **Predefinito:** `undefined`
  
 
- Restituisce: [\<fs.ReadStream\>](/it/nodejs/api/fs#class-fsreadstream)

`options` può includere valori `start` e `end` per leggere un intervallo di byte dal file anziché l'intero file. Sia `start` che `end` sono inclusivi e iniziano a contare da 0, i valori ammessi sono nell'intervallo [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. Se `start` è omesso o `undefined`, `filehandle.createReadStream()` legge sequenzialmente dalla posizione corrente del file. `encoding` può essere uno qualsiasi di quelli accettati da [\<Buffer\>](/it/nodejs/api/buffer#class-buffer).

Se il `FileHandle` punta a un dispositivo carattere che supporta solo letture bloccanti (come una tastiera o una scheda audio), le operazioni di lettura non terminano finché i dati non sono disponibili. Ciò può impedire al processo di uscire e al flusso di chiudersi naturalmente.

Per impostazione predefinita, il flusso emetterà un evento `'close'` dopo essere stato distrutto. Imposta l'opzione `emitClose` su `false` per modificare questo comportamento.

```js [ESM]
import { open } from 'node:fs/promises';

const fd = await open('/dev/input/event0');
// Create a stream from some character device.
const stream = fd.createReadStream();
setTimeout(() => {
  stream.close(); // This may not close the stream.
  // Artificially marking end-of-stream, as if the underlying resource had
  // indicated end-of-file by itself, allows the stream to close.
  // This does not cancel pending read operations, and if there is such an
  // operation, the process may still not be able to exit successfully
  // until it finishes.
  stream.push(null);
  stream.read(0);
}, 100);
```
Se `autoClose` è false, il descrittore di file non verrà chiuso, anche in caso di errore. È responsabilità dell'applicazione chiuderlo e assicurarsi che non vi siano perdite di descrittori di file. Se `autoClose` è impostato su true (comportamento predefinito), in caso di `'error'` o `'end'` il descrittore di file verrà chiuso automaticamente.

Un esempio per leggere gli ultimi 10 byte di un file lungo 100 byte:

```js [ESM]
import { open } from 'node:fs/promises';

const fd = await open('sample.txt');
fd.createReadStream({ start: 90, end: 99 });
```

#### `filehandle.createWriteStream([options])` {#filehandlecreatewritestreamoptions}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.0.0, v20.10.0 | L'opzione `flush` è ora supportata. |
| v16.11.0 | Aggiunto in: v16.11.0 |
:::

- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'utf8'`
    - `autoClose` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `true`
    - `emitClose` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `true`
    - `start` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `highWaterMark` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `16384`
    - `flush` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, il descrittore di file sottostante viene scaricato prima di essere chiuso. **Predefinito:** `false`.


- Restituisce: [\<fs.WriteStream\>](/it/nodejs/api/fs#class-fswritestream)

`options` può includere anche un'opzione `start` per consentire la scrittura di dati in una posizione successiva all'inizio del file, i valori consentiti sono nell'intervallo [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. La modifica di un file anziché la sua sostituzione può richiedere che l'opzione `flags` `open` sia impostata su `r+` anziché sul valore predefinito `r`. La `encoding` può essere una qualsiasi di quelle accettate da [\<Buffer\>](/it/nodejs/api/buffer#class-buffer).

Se `autoClose` è impostato su true (comportamento predefinito) su `'error'` o `'finish'`, il descrittore di file verrà chiuso automaticamente. Se `autoClose` è false, il descrittore di file non verrà chiuso, anche in caso di errore. È responsabilità dell'applicazione chiuderlo e assicurarsi che non vi siano perdite di descrittori di file.

Per impostazione predefinita, lo stream emetterà un evento `'close'` dopo essere stato distrutto. Imposta l'opzione `emitClose` su `false` per modificare questo comportamento.


#### `filehandle.datasync()` {#filehandledatasync}

**Aggiunto in: v10.0.0**

- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si adempie con `undefined` in caso di successo.

Forza tutte le operazioni I/O attualmente in coda associate al file allo stato di completamento I/O sincronizzato del sistema operativo. Fare riferimento alla documentazione POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2) per i dettagli.

A differenza di `filehandle.sync`, questo metodo non scarica i metadati modificati.

#### `filehandle.fd` {#filehandlefd}

**Aggiunto in: v10.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il descrittore numerico del file gestito dall'oggetto [\<FileHandle\>](/it/nodejs/api/fs#class-filehandle).

#### `filehandle.read(buffer, offset, length, position)` {#filehandlereadbuffer-offset-length-position}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.0.0 | Accetta valori bigint come `position`. |
| v10.0.0 | Aggiunto in: v10.0.0 |
:::

- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un buffer che verrà riempito con i dati del file letti.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La posizione nel buffer in cui iniziare il riempimento. **Predefinito:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte da leggere. **Predefinito:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) La posizione da cui iniziare a leggere i dati dal file. Se `null` o `-1`, i dati verranno letti dalla posizione corrente del file e la posizione verrà aggiornata. Se `position` è un numero intero non negativo, la posizione corrente del file rimarrà invariata. **Predefinito**: `null`
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si adempie in caso di successo con un oggetto con due proprietà:
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte letti
    - `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un riferimento all'argomento `buffer` passato.
  
 

Legge i dati dal file e li memorizza nel buffer specificato.

Se il file non viene modificato contemporaneamente, la fine del file viene raggiunta quando il numero di byte letti è zero.


#### `filehandle.read([options])` {#filehandlereadoptions}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.0.0 | Accetta valori bigint come `position`. |
| v13.11.0, v12.17.0 | Aggiunto in: v13.11.0, v12.17.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un buffer che verrà riempito con i dati del file letti. **Predefinito:** `Buffer.alloc(16384)`
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La posizione nel buffer in cui iniziare a riempire. **Predefinito:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte da leggere. **Predefinito:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) La posizione da cui iniziare a leggere i dati dal file. Se `null` o `-1`, i dati verranno letti dalla posizione corrente del file e la posizione verrà aggiornata. Se `position` è un numero intero non negativo, la posizione corrente del file rimarrà invariata. **Predefinito:**: `null`
  
 
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si adempie in caso di successo con un oggetto con due proprietà: 
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte letti
    - `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un riferimento all'argomento `buffer` passato.
  
 

Legge i dati dal file e li memorizza nel buffer specificato.

Se il file non viene modificato contemporaneamente, la fine del file viene raggiunta quando il numero di byte letti è zero.


#### `filehandle.read(buffer[, options])` {#filehandlereadbuffer-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.0.0 | Accetta valori bigint come `position`. |
| v18.2.0, v16.17.0 | Aggiunto in: v18.2.0, v16.17.0 |
:::

- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un buffer che verrà riempito con i dati del file letti.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La posizione nel buffer in cui iniziare a riempire. **Predefinito:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte da leggere. **Predefinito:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) La posizione da cui iniziare a leggere i dati dal file. Se `null` o `-1`, i dati verranno letti dalla posizione corrente del file e la posizione verrà aggiornata. Se `position` è un intero non negativo, la posizione corrente del file rimarrà invariata. **Predefinito**: `null`
  
 
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si risolve in caso di successo con un oggetto con due proprietà:
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte letti
    - `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un riferimento all'argomento `buffer` passato.
  
 

Legge i dati dal file e li memorizza nel buffer specificato.

Se il file non viene modificato contemporaneamente, la fine del file viene raggiunta quando il numero di byte letti è zero.


#### `filehandle.readableWebStream([options])` {#filehandlereadablewebstreamoptions}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.0.0, v18.17.0 | Aggiunta l'opzione per creare uno stream 'bytes'. |
| v17.0.0 | Aggiunto in: v17.0.0 |
:::

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Se aprire uno stream normale o uno stream `'bytes'`. **Predefinito:** `undefined`
  
 
-  Restituisce: [\<ReadableStream\>](/it/nodejs/api/webstreams#class-readablestream) 

Restituisce un `ReadableStream` che può essere utilizzato per leggere i dati dei file.

Verrà generato un errore se questo metodo viene chiamato più di una volta o se viene chiamato dopo che `FileHandle` è stato chiuso o è in fase di chiusura.



::: code-group
```js [ESM]
import {
  open,
} from 'node:fs/promises';

const file = await open('./some/file/to/read');

for await (const chunk of file.readableWebStream())
  console.log(chunk);

await file.close();
```

```js [CJS]
const {
  open,
} = require('node:fs/promises');

(async () => {
  const file = await open('./some/file/to/read');

  for await (const chunk of file.readableWebStream())
    console.log(chunk);

  await file.close();
})();
```
:::

Mentre `ReadableStream` leggerà il file fino al completamento, non chiuderà automaticamente `FileHandle`. Il codice utente deve comunque chiamare il metodo `fileHandle.close()`.

#### `filehandle.readFile(options)` {#filehandlereadfileoptions}

**Aggiunto in: v10.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `null`
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) consente di interrompere un readFile in corso
  
 
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si realizza in caso di lettura riuscita con il contenuto del file. Se non viene specificata alcuna codifica (utilizzando `options.encoding`), i dati vengono restituiti come oggetto [\<Buffer\>](/it/nodejs/api/buffer#class-buffer). Altrimenti, i dati saranno una stringa.

Legge in modo asincrono l'intero contenuto di un file.

Se `options` è una stringa, specifica la `encoding`.

[\<FileHandle\>](/it/nodejs/api/fs#class-filehandle) deve supportare la lettura.

Se vengono effettuate una o più chiamate `filehandle.read()` su un handle di file e quindi viene effettuata una chiamata `filehandle.readFile()`, i dati verranno letti dalla posizione corrente fino alla fine del file. Non legge sempre dall'inizio del file.


#### `filehandle.readLines([options])` {#filehandlereadlinesoptions}

**Aggiunto in: v18.11.0**

- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `null`
    - `autoClose` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `true`
    - `emitClose` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `true`
    - `start` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `Infinity`
    - `highWaterMark` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `64 * 1024`
  
 
- Restituisce: [\<readline.InterfaceConstructor\>](/it/nodejs/api/readline#class-interfaceconstructor)

Metodo di convenienza per creare un'interfaccia `readline` e trasmettere in streaming sul file. Vedere [`filehandle.createReadStream()`](/it/nodejs/api/fs#filehandlecreatereadstreamoptions) per le opzioni.

::: code-group
```js [ESM]
import { open } from 'node:fs/promises';

const file = await open('./some/file/to/read');

for await (const line of file.readLines()) {
  console.log(line);
}
```

```js [CJS]
const { open } = require('node:fs/promises');

(async () => {
  const file = await open('./some/file/to/read');

  for await (const line of file.readLines()) {
    console.log(line);
  }
})();
```
:::

#### `filehandle.readv(buffers[, position])` {#filehandlereadvbuffers-position}

**Aggiunto in: v13.13.0, v12.17.0**

- `buffers` [\<Buffer[]\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `position` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) L'offset dall'inizio del file da cui leggere i dati. Se `position` non è un `number`, i dati verranno letti dalla posizione corrente. **Predefinito:** `null`
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si completa con successo con un oggetto contenente due proprietà:
    - `bytesRead` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) il numero di byte letti
    - `buffers` [\<Buffer[]\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) proprietà contenente un riferimento all'input `buffers`.
  
 

Legge da un file e scrive in un array di [\<ArrayBufferView\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)s


#### `filehandle.stat([options])` {#filehandlestatoptions}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.5.0 | Accetta un oggetto `options` aggiuntivo per specificare se i valori numerici restituiti devono essere bigint. |
| v10.0.0 | Aggiunto in: v10.0.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se i valori numerici nell'oggetto [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) restituito devono essere `bigint`. **Predefinito:** `false`.


- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si risolve con un [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) per il file.

#### `filehandle.sync()` {#filehandlesync}

**Aggiunto in: v10.0.0**

- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si risolve con `undefined` in caso di successo.

Richiede che tutti i dati per il descrittore di file aperto vengano scaricati sul dispositivo di archiviazione. L'implementazione specifica dipende dal sistema operativo e dal dispositivo. Consultare la documentazione POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2) per maggiori dettagli.

#### `filehandle.truncate(len)` {#filehandletruncatelen}

**Aggiunto in: v10.0.0**

- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0`
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si risolve con `undefined` in caso di successo.

Tronca il file.

Se il file era più grande di `len` byte, solo i primi `len` byte verranno mantenuti nel file.

Il seguente esempio mantiene solo i primi quattro byte del file:

```js [ESM]
import { open } from 'node:fs/promises';

let filehandle = null;
try {
  filehandle = await open('temp.txt', 'r+');
  await filehandle.truncate(4);
} finally {
  await filehandle?.close();
}
```
Se il file era precedentemente più corto di `len` byte, viene esteso e la parte estesa viene riempita con byte nulli (`'\0'`):

Se `len` è negativo, verrà utilizzato `0`.


#### `filehandle.utimes(atime, mtime)` {#filehandleutimesatime-mtime}

**Aggiunto in: v10.0.0**

- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Modifica i timestamp del filesystem dell'oggetto a cui fa riferimento [\<FileHandle\>](/it/nodejs/api/fs#class-filehandle), quindi adempie la promise senza argomenti in caso di successo.

#### `filehandle.write(buffer, offset[, length[, position]])` {#filehandlewritebuffer-offset-length-position}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.0.0 | Il parametro `buffer` non forzerà più l'input non supportato in buffer. |
| v10.0.0 | Aggiunto in: v10.0.0 |
:::

- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La posizione iniziale all'interno di `buffer` da cui iniziano i dati da scrivere.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte da `buffer` da scrivere. **Predefinito:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) L'offset dall'inizio del file in cui i dati da `buffer` devono essere scritti. Se `position` non è un `number`, i dati verranno scritti nella posizione corrente. Consulta la documentazione POSIX [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2) per maggiori dettagli. **Predefinito:** `null`
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Scrive `buffer` nel file.

La promise viene adempiuta con un oggetto contenente due proprietà:

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) il numero di byte scritti
- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) un riferimento al `buffer` scritto.

Non è sicuro utilizzare `filehandle.write()` più volte sullo stesso file senza attendere che la promise sia adempiuta (o rifiutata). Per questo scenario, utilizzare [`filehandle.createWriteStream()`](/it/nodejs/api/fs#filehandlecreatewritestreamoptions).

Su Linux, le scritture posizionali non funzionano quando il file viene aperto in modalità append. Il kernel ignora l'argomento position e aggiunge sempre i dati alla fine del file.


#### `filehandle.write(buffer[, options])` {#filehandlewritebuffer-options}

**Aggiunto in: v18.3.0, v16.17.0**

- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `null`


- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Scrive `buffer` nel file.

Simile alla funzione `filehandle.write` di cui sopra, questa versione accetta un oggetto `options` opzionale. Se non viene specificato alcun oggetto `options`, il valore predefinito sarà quello sopra indicato.

#### `filehandle.write(string[, position[, encoding]])` {#filehandlewritestring-position-encoding}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.0.0 | Il parametro `string` non forzerà più l'input non supportato a stringhe. |
| v10.0.0 | Aggiunto in: v10.0.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) L'offset dall'inizio del file in cui devono essere scritti i dati da `string`. Se `position` non è un `number`, i dati verranno scritti nella posizione corrente. Vedi la documentazione POSIX [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2) per maggiori dettagli. **Predefinito:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codifica stringa prevista. **Predefinito:** `'utf8'`
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Scrive `string` nel file. Se `string` non è una stringa, la promise viene rifiutata con un errore.

La promise viene soddisfatta con un oggetto contenente due proprietà:

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) il numero di byte scritti
- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) un riferimento alla `string` scritta.

Non è sicuro usare `filehandle.write()` più volte sullo stesso file senza aspettare che la promise sia soddisfatta (o rifiutata). Per questo scenario, usare [`filehandle.createWriteStream()`](/it/nodejs/api/fs#filehandlecreatewritestreamoptions).

Su Linux, le scritture posizionali non funzionano quando il file è aperto in modalità append. Il kernel ignora l'argomento position e aggiunge sempre i dati alla fine del file.


#### `filehandle.writeFile(data, options)` {#filehandlewritefiledata-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.14.0, v14.18.0 | L'argomento `data` supporta `AsyncIterable`, `Iterable` e `Stream`. |
| v14.0.0 | Il parametro `data` non forzerà più l'input non supportato in stringhe. |
| v10.0.0 | Aggiunto in: v10.0.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/it/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) La codifica dei caratteri prevista quando `data` è una stringa. **Predefinito:** `'utf8'`
  
 
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Scrive in modo asincrono i dati in un file, sostituendo il file se esiste già. `data` può essere una stringa, un buffer, un oggetto [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) o un oggetto [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol). La promise viene soddisfatta senza argomenti in caso di successo.

Se `options` è una stringa, allora specifica la `encoding`.

Il [\<FileHandle\>](/it/nodejs/api/fs#class-filehandle) deve supportare la scrittura.

Non è sicuro utilizzare `filehandle.writeFile()` più volte sullo stesso file senza attendere che la promise sia soddisfatta (o rifiutata).

Se vengono effettuate una o più chiamate `filehandle.write()` su un file handle e quindi viene effettuata una chiamata `filehandle.writeFile()`, i dati verranno scritti dalla posizione corrente fino alla fine del file. Non scrive sempre dall'inizio del file.


#### `filehandle.writev(buffers[, position])` {#filehandlewritevbuffers-position}

**Aggiunto in: v12.9.0**

- `buffers` [\<Buffer[]\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) L'offset dall'inizio del file in cui devono essere scritti i dati da `buffers`. Se `position` non è un `number`, i dati verranno scritti nella posizione corrente. **Predefinito:** `null`
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Scrive un array di [\<ArrayBufferView\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView) nel file.

La promise viene risolta con un oggetto contenente due proprietà:

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) il numero di byte scritti
- `buffers` [\<Buffer[]\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) un riferimento all'input `buffers`.

Non è sicuro chiamare `writev()` più volte sullo stesso file senza attendere che la promise venga risolta (o rifiutata).

Su Linux, le scritture posizionali non funzionano quando il file viene aperto in modalità append. Il kernel ignora l'argomento position e aggiunge sempre i dati alla fine del file.

#### `filehandle[Symbol.asyncDispose]()` {#filehandlesymbolasyncdispose}

**Aggiunto in: v20.4.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Un alias per `filehandle.close()`.


### `fsPromises.access(path[, mode])` {#fspromisesaccesspath-mode}

**Aggiunto in: v10.0.0**

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `fs.constants.F_OK`
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Soddisfa con `undefined` in caso di successo.

Verifica le autorizzazioni di un utente per il file o la directory specificata da `path`. L'argomento `mode` è un intero opzionale che specifica i controlli di accessibilità da eseguire. `mode` deve essere il valore `fs.constants.F_OK` o una maschera costituita dall'OR bit a bit di uno qualsiasi tra `fs.constants.R_OK`, `fs.constants.W_OK` e `fs.constants.X_OK` (ad esempio, `fs.constants.W_OK | fs.constants.R_OK`). Controlla [Costanti di accesso ai file](/it/nodejs/api/fs#file-access-constants) per i possibili valori di `mode`.

Se il controllo di accessibilità ha esito positivo, la promise viene soddisfatta senza alcun valore. Se uno qualsiasi dei controlli di accessibilità fallisce, la promise viene rifiutata con un oggetto [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error). L'esempio seguente verifica se il file `/etc/passwd` può essere letto e scritto dal processo corrente.

```js [ESM]
import { access, constants } from 'node:fs/promises';

try {
  await access('/etc/passwd', constants.R_OK | constants.W_OK);
  console.log('can access');
} catch {
  console.error('cannot access');
}
```
Si sconsiglia di utilizzare `fsPromises.access()` per verificare l'accessibilità di un file prima di chiamare `fsPromises.open()`. In questo modo si introduce una race condition, poiché altri processi potrebbero modificare lo stato del file tra le due chiamate. Invece, il codice utente dovrebbe aprire/leggere/scrivere direttamente il file e gestire l'errore generato se il file non è accessibile.

### `fsPromises.appendFile(path, data[, options])` {#fspromisesappendfilepath-data-options}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.1.0, v20.10.0 | L'opzione `flush` è ora supportata. |
| v10.0.0 | Aggiunto in: v10.0.0 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/it/nodejs/api/fs#class-filehandle) nome file o [\<FileHandle\>](/it/nodejs/api/fs#class-filehandle)
- `data` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `'utf8'`
    - `mode` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0o666`
    - `flag` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Vedere [supporto dei `flag` del file system](/it/nodejs/api/fs#file-system-flags). **Predefinito:** `'a'`.
    - `flush` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, il descrittore di file sottostante viene scaricato prima di essere chiuso. **Predefinito:** `false`.
  
 
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Soddisfa con `undefined` in caso di successo.

Aggiunge asincronamente i dati a un file, creando il file se non esiste ancora. `data` può essere una stringa o un [\<Buffer\>](/it/nodejs/api/buffer#class-buffer).

Se `options` è una stringa, specifica la `encoding`.

L'opzione `mode` influisce solo sul file appena creato. Vedere [`fs.open()`](/it/nodejs/api/fs#fsopenpath-flags-mode-callback) per maggiori dettagli.

Il `path` può essere specificato come un [\<FileHandle\>](/it/nodejs/api/fs#class-filehandle) che è stato aperto per l'aggiunta (usando `fsPromises.open()`).


### `fsPromises.chmod(path, mode)` {#fspromiseschmodpath-mode}

**Aggiunto in: v10.0.0**

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Adempie con `undefined` in caso di successo.

Modifica i permessi di un file.

### `fsPromises.chown(path, uid, gid)` {#fspromiseschownpath-uid-gid}

**Aggiunto in: v10.0.0**

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Adempie con `undefined` in caso di successo.

Modifica la proprietà di un file.

### `fsPromises.copyFile(src, dest[, mode])` {#fspromisescopyfilesrc-dest-mode}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.0.0 | Ha cambiato l'argomento `flags` in `mode` e ha imposto una validazione del tipo più rigorosa. |
| v10.0.0 | Aggiunto in: v10.0.0 |
:::

- `src` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) nome del file sorgente da copiare
- `dest` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) nome del file di destinazione dell'operazione di copia
- `mode` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Modificatori opzionali che specificano il comportamento dell'operazione di copia. È possibile creare una maschera costituita dall'OR bit a bit di due o più valori (ad es. `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`) **Predefinito:** `0`.
    - `fs.constants.COPYFILE_EXCL`: L'operazione di copia fallirà se `dest` esiste già.
    - `fs.constants.COPYFILE_FICLONE`: L'operazione di copia tenterà di creare un reflink copy-on-write. Se la piattaforma non supporta copy-on-write, viene utilizzato un meccanismo di copia di fallback.
    - `fs.constants.COPYFILE_FICLONE_FORCE`: L'operazione di copia tenterà di creare un reflink copy-on-write. Se la piattaforma non supporta copy-on-write, l'operazione fallirà.
  
 
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Adempie con `undefined` in caso di successo.

Copia asincronamente `src` in `dest`. Per impostazione predefinita, `dest` viene sovrascritto se esiste già.

Non vengono fornite garanzie sull'atomicità dell'operazione di copia. Se si verifica un errore dopo che il file di destinazione è stato aperto per la scrittura, verrà effettuato un tentativo di rimuovere la destinazione.

```js [ESM]
import { copyFile, constants } from 'node:fs/promises';

try {
  await copyFile('source.txt', 'destination.txt');
  console.log('source.txt è stato copiato in destination.txt');
} catch {
  console.error('Impossibile copiare il file');
}

// Utilizzando COPYFILE_EXCL, l'operazione fallirà se destination.txt esiste.
try {
  await copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
  console.log('source.txt è stato copiato in destination.txt');
} catch {
  console.error('Impossibile copiare il file');
}
```

### `fsPromises.cp(src, dest[, options])` {#fspromisescpsrc-dest-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.3.0 | Questa API non è più sperimentale. |
| v20.1.0, v18.17.0 | Accetta un'opzione `mode` aggiuntiva per specificare il comportamento di copia come l'argomento `mode` di `fs.copyFile()`. |
| v17.6.0, v16.15.0 | Accetta un'opzione `verbatimSymlinks` aggiuntiva per specificare se eseguire la risoluzione del percorso per i collegamenti simbolici. |
| v16.7.0 | Aggiunto in: v16.7.0 |
:::

- `src` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) percorso di origine da copiare.
- `dest` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) percorso di destinazione in cui copiare.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) dereferenzia i collegamenti simbolici. **Predefinito:** `false`.
    - `errorOnExist` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) quando `force` è `false` e la destinazione esiste, genera un errore. **Predefinito:** `false`.
    - `filter` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funzione per filtrare file/directory copiati. Restituisce `true` per copiare l'elemento, `false` per ignorarlo. Quando si ignora una directory, anche tutto il suo contenuto verrà saltato. Può anche restituire una `Promise` che si risolve in `true` o `false` **Predefinito:** `undefined`.
    - `src` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) percorso di origine da copiare.
    - `dest` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) percorso di destinazione in cui copiare.
    - Restituisce: [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Un valore che è coercibile a `boolean` o una `Promise` che si realizza con tale valore.

    - `force` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) sovrascrive il file o la directory esistente. L'operazione di copia ignorerà gli errori se lo si imposta su false e la destinazione esiste. Utilizzare l'opzione `errorOnExist` per modificare questo comportamento. **Predefinito:** `true`.
    - `mode` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) modificatori per l'operazione di copia. **Predefinito:** `0`. Vedere il flag `mode` di [`fsPromises.copyFile()`](/it/nodejs/api/fs#fspromisescopyfilesrc-dest-mode).
    - `preserveTimestamps` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, i timestamp di `src` verranno conservati. **Predefinito:** `false`.
    - `recursive` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) copia le directory in modo ricorsivo **Predefinito:** `false`
    - `verbatimSymlinks` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, la risoluzione del percorso per i collegamenti simbolici verrà saltata. **Predefinito:** `false`

- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si realizza con `undefined` in caso di successo.

Copia in modo asincrono l'intera struttura di directory da `src` a `dest`, incluse sottodirectory e file.

Quando si copia una directory in un'altra directory, i glob non sono supportati e il comportamento è simile a `cp dir1/ dir2/`.


### `fsPromises.glob(pattern[, options])` {#fspromisesglobpattern-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.2.0 | Aggiunto il supporto per `withFileTypes` come opzione. |
| v22.0.0 | Aggiunto in: v22.0.0 |
:::

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `pattern` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) directory di lavoro corrente. **Predefinito:** `process.cwd()`
    - `exclude` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funzione per filtrare file/directory. Restituisce `true` per escludere l'elemento, `false` per includerlo. **Predefinito:** `undefined`.
    - `withFileTypes` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se il glob deve restituire i percorsi come Dirent, `false` altrimenti. **Predefinito:** `false`.

- Restituisce: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) Un AsyncIterator che produce i percorsi dei file che corrispondono al pattern.

::: code-group
```js [ESM]
import { glob } from 'node:fs/promises';

for await (const entry of glob('**/*.js'))
  console.log(entry);
```

```js [CJS]
const { glob } = require('node:fs/promises');

(async () => {
  for await (const entry of glob('**/*.js'))
    console.log(entry);
})();
```
:::

### `fsPromises.lchmod(path, mode)` {#fspromiseslchmodpath-mode}

**Deprecato a partire da: v10.0.0**

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si adempie con `undefined` in caso di successo.

Modifica le autorizzazioni su un collegamento simbolico.

Questo metodo è implementato solo su macOS.


### `fsPromises.lchown(path, uid, gid)` {#fspromiseslchownpath-uid-gid}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.6.0 | Questa API non è più deprecata. |
| v10.0.0 | Aggiunta in: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  Si adempie con `undefined` in caso di successo.

Cambia la proprietà su un link simbolico.

### `fsPromises.lutimes(path, atime, mtime)` {#fspromiseslutimespath-atime-mtime}

**Aggiunta in: v14.5.0, v12.19.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  Si adempie con `undefined` in caso di successo.

Modifica i tempi di accesso e modifica di un file nello stesso modo di [`fsPromises.utimes()`](/it/nodejs/api/fs#fspromisesutimespath-atime-mtime), con la differenza che se il percorso si riferisce a un link simbolico, il link non viene dereferenziato: invece, i timestamp del link simbolico stesso vengono modificati.


### `fsPromises.link(existingPath, newPath)` {#fspromiseslinkexistingpath-newpath}

**Aggiunto in: v10.0.0**

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si risolve con `undefined` in caso di successo.

Crea un nuovo collegamento da `existingPath` a `newPath`. Consulta la documentazione POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) per maggiori dettagli.

### `fsPromises.lstat(path[, options])` {#fspromiseslstatpath-options}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.5.0 | Accetta un oggetto `options` aggiuntivo per specificare se i valori numerici restituiti devono essere bigint. |
| v10.0.0 | Aggiunto in: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se i valori numerici nell'oggetto [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) restituito devono essere `bigint`. **Predefinito:** `false`.
  
 
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si risolve con l'oggetto [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) per il collegamento simbolico `path` specificato.

Equivalente a [`fsPromises.stat()`](/it/nodejs/api/fs#fspromisesstatpath-options) a meno che `path` non faccia riferimento a un collegamento simbolico, nel qual caso viene eseguito lo stat del collegamento stesso, non del file a cui fa riferimento. Consultare il documento POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) per maggiori dettagli.


### `fsPromises.mkdir(path[, options])` {#fspromisesmkdirpath-options}

**Aggiunto in: v10.0.0**

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `recursive` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `false`
    - `mode` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Non supportato su Windows. **Predefinito:** `0o777`.


- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) In caso di successo, si risolve con `undefined` se `recursive` è `false`, oppure con il primo percorso di directory creato se `recursive` è `true`.

Crea una directory in modo asincrono.

L'argomento opzionale `options` può essere un numero intero che specifica `mode` (permessi e sticky bit) oppure un oggetto con una proprietà `mode` e una proprietà `recursive` che indica se le directory principali devono essere create. La chiamata a `fsPromises.mkdir()` quando `path` è una directory esistente comporta un rifiuto solo quando `recursive` è false.

::: code-group
```js [ESM]
import { mkdir } from 'node:fs/promises';

try {
  const projectFolder = new URL('./test/project/', import.meta.url);
  const createDir = await mkdir(projectFolder, { recursive: true });

  console.log(`created ${createDir}`);
} catch (err) {
  console.error(err.message);
}
```

```js [CJS]
const { mkdir } = require('node:fs/promises');
const { join } = require('node:path');

async function makeDirectory() {
  const projectFolder = join(__dirname, 'test', 'project');
  const dirCreation = await mkdir(projectFolder, { recursive: true });

  console.log(dirCreation);
  return dirCreation;
}

makeDirectory().catch(console.error);
```
:::


### `fsPromises.mkdtemp(prefix[, options])` {#fspromisesmkdtempprefix-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.6.0, v18.19.0 | Il parametro `prefix` ora accetta buffer e URL. |
| v16.5.0, v14.18.0 | Il parametro `prefix` ora accetta una stringa vuota. |
| v10.0.0 | Aggiunto in: v10.0.0 |
:::

- `prefix` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'utf8'`


- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si completa con una stringa contenente il percorso del file system della directory temporanea appena creata.

Crea una directory temporanea univoca. Un nome di directory univoco viene generato aggiungendo sei caratteri casuali alla fine del `prefix` fornito. A causa di incongruenze della piattaforma, evitare i caratteri `X` finali nel `prefix`. Alcune piattaforme, in particolare i BSD, possono restituire più di sei caratteri casuali e sostituire i caratteri `X` finali nel `prefix` con caratteri casuali.

L'argomento opzionale `options` può essere una stringa che specifica una codifica o un oggetto con una proprietà `encoding` che specifica la codifica dei caratteri da utilizzare.

```js [ESM]
import { mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

try {
  await mkdtemp(join(tmpdir(), 'foo-'));
} catch (err) {
  console.error(err);
}
```
Il metodo `fsPromises.mkdtemp()` aggiungerà i sei caratteri selezionati casualmente direttamente alla stringa `prefix`. Ad esempio, data una directory `/tmp`, se l'intenzione è creare una directory temporanea *all'interno* di `/tmp`, il `prefix` deve terminare con un separatore di percorso specifico della piattaforma (`require('node:path').sep`).


### `fsPromises.open(path, flags[, mode])` {#fspromisesopenpath-flags-mode}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.1.0 | L'argomento `flags` è ora opzionale e il valore predefinito è `'r'`. |
| v10.0.0 | Aggiunto in: v10.0.0 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Vedi [supporto per i `flag` del file system](/it/nodejs/api/fs#file-system-flags). **Predefinito:** `'r'`.
- `mode` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta la modalità del file (permessi e sticky bit) se il file viene creato. **Predefinito:** `0o666` (leggibile e scrivibile)
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Adempie con un oggetto [\<FileHandle\>](/it/nodejs/api/fs#class-filehandle).

Apre un [\<FileHandle\>](/it/nodejs/api/fs#class-filehandle).

Fare riferimento alla documentazione POSIX [`open(2)`](http://man7.org/linux/man-pages/man2/open.2) per maggiori dettagli.

Alcuni caratteri (`\< \> : " / \ | ? *`) sono riservati in Windows come documentato in [Denominazione di file, percorsi e spazi dei nomi](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file). In NTFS, se il nome file contiene un colon, Node.js aprirà uno stream del file system, come descritto in [questa pagina MSDN](https://docs.microsoft.com/en-us/windows/desktop/FileIO/using-streams).

### `fsPromises.opendir(path[, options])` {#fspromisesopendirpath-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.1.0, v18.17.0 | Aggiunta l'opzione `recursive`. |
| v13.1.0, v12.16.0 | È stata introdotta l'opzione `bufferSize`. |
| v12.12.0 | Aggiunto in: v12.12.0 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `'utf8'`
    - `bufferSize` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di voci di directory che vengono memorizzate nel buffer internamente durante la lettura dalla directory. Valori più alti portano a prestazioni migliori ma a un maggiore utilizzo della memoria. **Predefinito:** `32`
    - `recursive` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `Dir` risolto sarà un [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) contenente tutti i sottofile e le sottodirectory. **Predefinito:** `false`

- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Adempie con un [\<fs.Dir\>](/it/nodejs/api/fs#class-fsdir).

Apre in modo asincrono una directory per la scansione iterativa. Consultare la documentazione POSIX [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3) per maggiori dettagli.

Crea un [\<fs.Dir\>](/it/nodejs/api/fs#class-fsdir), che contiene tutte le ulteriori funzioni per la lettura e la pulizia della directory.

L'opzione `encoding` imposta la codifica per il `path` durante l'apertura della directory e le successive operazioni di lettura.

Esempio usando l'iterazione asincrona:

```js [ESM]
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name);
} catch (err) {
  console.error(err);
}
```
Quando si utilizza l'iteratore async, l'oggetto [\<fs.Dir\>](/it/nodejs/api/fs#class-fsdir) verrà chiuso automaticamente dopo l'uscita dell'iteratore.


### `fsPromises.readdir(path[, options])` {#fspromisesreaddirpath-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.1.0, v18.17.0 | Aggiunta l'opzione `recursive`. |
| v10.11.0 | Aggiunta una nuova opzione `withFileTypes`. |
| v10.0.0 | Aggiunto in: v10.0.0 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'utf8'`
    - `withFileTypes` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `false`
    - `recursive` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, legge ricorsivamente il contenuto di una directory. In modalità ricorsiva, elencherà tutti i file, i sottofile e le directory. **Predefinito:** `false`.


- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si adempie con un array dei nomi dei file nella directory escludendo `'.'` e `'..'`.

Legge il contenuto di una directory.

L'argomento opzionale `options` può essere una stringa che specifica una codifica oppure un oggetto con una proprietà `encoding` che specifica la codifica dei caratteri da utilizzare per i nomi file. Se `encoding` è impostato su `'buffer'`, i nomi file restituiti verranno passati come oggetti [\<Buffer\>](/it/nodejs/api/buffer#class-buffer).

Se `options.withFileTypes` è impostato su `true`, l'array restituito conterrà oggetti [\<fs.Dirent\>](/it/nodejs/api/fs#class-fsdirent).

```js [ESM]
import { readdir } from 'node:fs/promises';

try {
  const files = await readdir(path);
  for (const file of files)
    console.log(file);
} catch (err) {
  console.error(err);
}
```

### `fsPromises.readFile(path[, options])` {#fspromisesreadfilepath-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.2.0, v14.17.0 | L'argomento options può includere un AbortSignal per interrompere una richiesta readFile in corso. |
| v10.0.0 | Aggiunto in: v10.0.0 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/it/nodejs/api/fs#class-filehandle) nomefile o `FileHandle`
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `null`
    - `flag` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Vedere [supporto dei `flag` del file system](/it/nodejs/api/fs#file-system-flags). **Predefinito:** `'r'`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) consente di interrompere una readFile in corso

- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  Si completa con il contenuto del file.

Legge in modo asincrono l'intero contenuto di un file.

Se non viene specificata alcuna codifica (tramite `options.encoding`), i dati vengono restituiti come oggetto [\<Buffer\>](/it/nodejs/api/buffer#class-buffer). Altrimenti, i dati saranno una stringa.

Se `options` è una stringa, specifica la codifica.

Quando `path` è una directory, il comportamento di `fsPromises.readFile()` è specifico della piattaforma. Su macOS, Linux e Windows, la promise verrà rifiutata con un errore. Su FreeBSD, verrà restituita una rappresentazione del contenuto della directory.

Un esempio di lettura di un file `package.json` situato nella stessa directory del codice in esecuzione:

::: code-group
```js [ESM]
import { readFile } from 'node:fs/promises';
try {
  const filePath = new URL('./package.json', import.meta.url);
  const contents = await readFile(filePath, { encoding: 'utf8' });
  console.log(contents);
} catch (err) {
  console.error(err.message);
}
```

```js [CJS]
const { readFile } = require('node:fs/promises');
const { resolve } = require('node:path');
async function logFile() {
  try {
    const filePath = resolve('./package.json');
    const contents = await readFile(filePath, { encoding: 'utf8' });
    console.log(contents);
  } catch (err) {
    console.error(err.message);
  }
}
logFile();
```
:::

È possibile interrompere una `readFile` in corso utilizzando un [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal). Se una richiesta viene interrotta, la promise restituita viene rifiutata con un `AbortError`:

```js [ESM]
import { readFile } from 'node:fs/promises';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const promise = readFile(fileName, { signal });

  // Interrompi la richiesta prima che la promise si stabilizzi.
  controller.abort();

  await promise;
} catch (err) {
  // Quando una richiesta viene interrotta - err è un AbortError
  console.error(err);
}
```
L'interruzione di una richiesta in corso non interrompe le singole richieste del sistema operativo, ma piuttosto il buffering interno eseguito da `fs.readFile`.

Qualsiasi [\<FileHandle\>](/it/nodejs/api/fs#class-filehandle) specificato deve supportare la lettura.


### `fsPromises.readlink(path[, options])` {#fspromisesreadlinkpath-options}

**Aggiunto in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'utf8'`


- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si adempie con `linkString` in caso di successo.

Legge il contenuto del collegamento simbolico a cui fa riferimento `path`. Consulta la documentazione POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2) per maggiori dettagli. La promise viene adempiuta con `linkString` in caso di successo.

L'argomento opzionale `options` può essere una stringa che specifica una codifica, o un oggetto con una proprietà `encoding` che specifica la codifica dei caratteri da utilizzare per il percorso del collegamento restituito. Se `encoding` è impostato su `'buffer'`, il percorso del collegamento restituito verrà passato come oggetto [\<Buffer\>](/it/nodejs/api/buffer#class-buffer).

### `fsPromises.realpath(path[, options])` {#fspromisesrealpathpath-options}

**Aggiunto in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'utf8'`


- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si adempie con il percorso risolto in caso di successo.

Determina la posizione effettiva di `path` usando la stessa semantica della funzione `fs.realpath.native()`.

Sono supportati solo i percorsi che possono essere convertiti in stringhe UTF8.

L'argomento opzionale `options` può essere una stringa che specifica una codifica, o un oggetto con una proprietà `encoding` che specifica la codifica dei caratteri da utilizzare per il percorso. Se `encoding` è impostato su `'buffer'`, il percorso restituito verrà passato come oggetto [\<Buffer\>](/it/nodejs/api/buffer#class-buffer).

Su Linux, quando Node.js è collegato a musl libc, il file system procfs deve essere montato su `/proc` affinché questa funzione funzioni. Glibc non ha questa restrizione.


### `fsPromises.rename(oldPath, newPath)` {#fspromisesrenameoldpath-newpath}

**Aggiunto in: v10.0.0**

- `oldPath` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si completa con `undefined` in caso di successo.

Rinomina `oldPath` in `newPath`.

### `fsPromises.rmdir(path[, options])` {#fspromisesrmdirpath-options}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.0.0 | L'utilizzo di `fsPromises.rmdir(path, { recursive: true })` su un `path` che è un file non è più consentito e si traduce in un errore `ENOENT` su Windows e un errore `ENOTDIR` su POSIX. |
| v16.0.0 | L'utilizzo di `fsPromises.rmdir(path, { recursive: true })` su un `path` che non esiste non è più consentito e si traduce in un errore `ENOENT`. |
| v16.0.0 | L'opzione `recursive` è deprecata, il suo utilizzo attiva un avviso di deprecazione. |
| v14.14.0 | L'opzione `recursive` è deprecata, utilizzare invece `fsPromises.rm`. |
| v13.3.0, v12.16.0 | L'opzione `maxBusyTries` è stata rinominata in `maxRetries`, e il suo valore predefinito è 0. L'opzione `emfileWait` è stata rimossa, e gli errori `EMFILE` utilizzano la stessa logica di ripetizione degli altri errori. L'opzione `retryDelay` è ora supportata. Gli errori `ENFILE` vengono ora ritentati. |
| v12.10.0 | Le opzioni `recursive`, `maxBusyTries` e `emfileWait` sono ora supportate. |
| v10.0.0 | Aggiunto in: v10.0.0 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `maxRetries` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se si verifica un errore `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` o `EPERM`, Node.js ripete l'operazione con un backoff lineare in cui l'attesa è di `retryDelay` millisecondi in più ad ogni tentativo. Questa opzione rappresenta il numero di tentativi. Questa opzione viene ignorata se l'opzione `recursive` non è `true`. **Predefinito:** `0`.
    - `recursive` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, esegue una rimozione ricorsiva della directory. In modalità ricorsiva, le operazioni vengono ritentate in caso di errore. **Predefinito:** `false`. **Deprecata.**
    - `retryDelay` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La quantità di tempo in millisecondi da attendere tra i tentativi. Questa opzione viene ignorata se l'opzione `recursive` non è `true`. **Predefinito:** `100`.
  
 
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si completa con `undefined` in caso di successo.

Rimuove la directory identificata da `path`.

L'utilizzo di `fsPromises.rmdir()` su un file (non una directory) comporta il rifiuto della promise con un errore `ENOENT` su Windows e un errore `ENOTDIR` su POSIX.

Per ottenere un comportamento simile al comando Unix `rm -rf`, utilizzare [`fsPromises.rm()`](/it/nodejs/api/fs#fspromisesrmpath-options) con le opzioni `{ recursive: true, force: true }`.


### `fsPromises.rm(path[, options])` {#fspromisesrmpath-options}

**Aggiunto in: v14.14.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, le eccezioni verranno ignorate se `path` non esiste. **Predefinito:** `false`.
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se viene riscontrato un errore `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` o `EPERM`, Node.js riproverà l'operazione con un'attesa di backoff lineare di `retryDelay` millisecondi più lunga ad ogni tentativo. Questa opzione rappresenta il numero di tentativi. Questa opzione viene ignorata se l'opzione `recursive` non è `true`. **Predefinito:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, esegue una rimozione ricorsiva della directory. In modalità ricorsiva le operazioni vengono riprovate in caso di errore. **Predefinito:** `false`.
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La quantità di tempo in millisecondi da attendere tra i tentativi. Questa opzione viene ignorata se l'opzione `recursive` non è `true`. **Predefinito:** `100`.
  
 
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si completa con `undefined` in caso di successo.

Rimuove file e directory (modellato sull'utility standard POSIX `rm`).

### `fsPromises.stat(path[, options])` {#fspromisesstatpath-options}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.5.0 | Accetta un oggetto `options` aggiuntivo per specificare se i valori numerici restituiti devono essere bigint. |
| v10.0.0 | Aggiunto in: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se i valori numerici nell'oggetto [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) restituito devono essere `bigint`. **Predefinito:** `false`.
  
 
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si completa con l'oggetto [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) per il `path` fornito.


### `fsPromises.statfs(path[, options])` {#fspromisesstatfspath-options}

**Aggiunto in: v19.6.0, v18.15.0**

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se i valori numerici nell'oggetto [\<fs.StatFs\>](/it/nodejs/api/fs#class-fsstatfs) restituito debbano essere `bigint`. **Predefinito:** `false`.
  
 
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si adempie con l'oggetto [\<fs.StatFs\>](/it/nodejs/api/fs#class-fsstatfs) per il `path` dato.

### `fsPromises.symlink(target, path[, type])` {#fspromisessymlinktarget-path-type}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Se l'argomento `type` è `null` o omesso, Node.js rileverà automaticamente il tipo `target` e selezionerà automaticamente `dir` o `file`. |
| v10.0.0 | Aggiunto in: v10.0.0 |
:::

- `target` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `type` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `null`
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si adempie con `undefined` in caso di successo.

Crea un collegamento simbolico.

L'argomento `type` viene utilizzato solo sulle piattaforme Windows e può essere `'dir'`, `'file'` o `'junction'`. Se l'argomento `type` è `null`, Node.js rileverà automaticamente il tipo `target` e utilizzerà `'file'` o `'dir'`. Se `target` non esiste, verrà utilizzato `'file'`. I punti di giunzione di Windows richiedono che il percorso di destinazione sia assoluto. Quando si utilizza `'junction'`, l'argomento `target` verrà automaticamente normalizzato al percorso assoluto. I punti di giunzione sui volumi NTFS possono puntare solo alle directory.


### `fsPromises.truncate(path[, len])` {#fspromisestruncatepath-len}

**Aggiunto in: v10.0.0**

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `len` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0`
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si adempie con `undefined` in caso di successo.

Tronca (accorcia o estende la lunghezza) il contenuto in `path` a `len` byte.

### `fsPromises.unlink(path)` {#fspromisesunlinkpath}

**Aggiunto in: v10.0.0**

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si adempie con `undefined` in caso di successo.

Se `path` si riferisce a un collegamento simbolico, il collegamento viene rimosso senza influire sul file o sulla directory a cui si riferisce tale collegamento. Se il `path` si riferisce a un percorso di file che non è un collegamento simbolico, il file viene eliminato. Vedi la documentazione POSIX [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2) per maggiori dettagli.

### `fsPromises.utimes(path, atime, mtime)` {#fspromisesutimespath-atime-mtime}

**Aggiunto in: v10.0.0**

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si adempie con `undefined` in caso di successo.

Modifica i timestamp del file system dell'oggetto a cui fa riferimento `path`.

Gli argomenti `atime` e `mtime` seguono queste regole:

- I valori possono essere numeri che rappresentano l'ora Unix epoch, `Date` o una stringa numerica come `'123456789.0'`.
- Se il valore non può essere convertito in un numero, o è `NaN`, `Infinity` o `-Infinity`, verrà generato un `Error`.


### `fsPromises.watch(filename[, options])` {#fspromiseswatchfilename-options}

**Aggiunto in: v15.9.0, v14.18.0**

- `filename` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `persistent` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se il processo debba continuare a essere eseguito fintanto che i file sono monitorati. **Predefinito:** `true`.
    - `recursive` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se tutte le sottodirectory debbano essere monitorate oppure solo la directory corrente. Questo si applica quando viene specificata una directory e solo sulle piattaforme supportate (Vedi [avvertenze](/it/nodejs/api/fs#caveats)). **Predefinito:** `false`.
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Specifica la codifica dei caratteri da utilizzare per il nome file passato al listener. **Predefinito:** `'utf8'`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Un [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) utilizzato per segnalare quando il watcher deve interrompersi.


- Restituisce: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) di oggetti con le proprietà:
    - `eventType` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il tipo di modifica
    - `filename` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Il nome del file modificato.


Restituisce un iteratore asincrono che controlla le modifiche su `filename`, dove `filename` è un file o una directory.

```js [ESM]
const { watch } = require('node:fs/promises');

const ac = new AbortController();
const { signal } = ac;
setTimeout(() => ac.abort(), 10000);

(async () => {
  try {
    const watcher = watch(__filename, { signal });
    for await (const event of watcher)
      console.log(event);
  } catch (err) {
    if (err.name === 'AbortError')
      return;
    throw err;
  }
})();
```
Sulla maggior parte delle piattaforme, viene emesso `'rename'` ogni volta che un nome file appare o scompare nella directory.

Tutte le [avvertenze](/it/nodejs/api/fs#caveats) per `fs.watch()` si applicano anche a `fsPromises.watch()`.


### `fsPromises.writeFile(file, data[, options])` {#fspromiseswritefilefile-data-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.0.0, v20.10.0 | L'opzione `flush` è ora supportata. |
| v15.14.0, v14.18.0 | L'argomento `data` supporta `AsyncIterable`, `Iterable` e `Stream`. |
| v15.2.0, v14.17.0 | L'argomento options può includere un AbortSignal per interrompere una richiesta writeFile in corso. |
| v14.0.0 | Il parametro `data` non forzerà più l'input non supportato in stringhe. |
| v10.0.0 | Aggiunto in: v10.0.0 |
:::

- `file` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/it/nodejs/api/fs#class-filehandle) nome del file o `FileHandle`
- `data` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/it/nodejs/api/stream#stream)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `'utf8'`
    - `mode` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0o666`
    - `flag` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Vedi [supporto per i `flag` del file system](/it/nodejs/api/fs#file-system-flags). **Predefinito:** `'w'`.
    - `flush` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se tutti i dati vengono scritti correttamente nel file e `flush` è `true`, viene utilizzato `filehandle.sync()` per scaricare i dati. **Predefinito:** `false`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) consente di interrompere un writeFile in corso

- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si completa con `undefined` in caso di successo.

Scrive in modo asincrono i dati in un file, sostituendo il file se esiste già. `data` può essere una stringa, un buffer, un [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) o un oggetto [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol).

L'opzione `encoding` viene ignorata se `data` è un buffer.

Se `options` è una stringa, specifica la codifica.

L'opzione `mode` influisce solo sul file appena creato. Vedi [`fs.open()`](/it/nodejs/api/fs#fsopenpath-flags-mode-callback) per maggiori dettagli.

Qualsiasi [\<FileHandle\>](/it/nodejs/api/fs#class-filehandle) specificato deve supportare la scrittura.

Non è sicuro utilizzare `fsPromises.writeFile()` più volte sullo stesso file senza attendere che la promise sia definita.

Similmente a `fsPromises.readFile` - `fsPromises.writeFile` è un metodo di convenienza che esegue internamente più chiamate `write` per scrivere il buffer passato. Per codice sensibile alle prestazioni, considera l'utilizzo di [`fs.createWriteStream()`](/it/nodejs/api/fs#fscreatewritestreampath-options) o [`filehandle.createWriteStream()`](/it/nodejs/api/fs#filehandlecreatewritestreamoptions).

È possibile utilizzare un [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) per annullare un `fsPromises.writeFile()`. L'annullamento è "il meglio possibile" ed è probabile che venga comunque scritta una certa quantità di dati.

```js [ESM]
import { writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const data = new Uint8Array(Buffer.from('Hello Node.js'));
  const promise = writeFile('message.txt', data, { signal });

  // Interrompi la richiesta prima che la promise si stabilizzi.
  controller.abort();

  await promise;
} catch (err) {
  // Quando una richiesta viene interrotta - err è un AbortError
  console.error(err);
}
```
L'interruzione di una richiesta in corso non interrompe le singole richieste del sistema operativo, ma piuttosto il buffering interno eseguito da `fs.writeFile`.


### `fsPromises.constants` {#fspromisesconstants}

**Aggiunto in: v18.4.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Restituisce un oggetto contenente costanti comunemente utilizzate per le operazioni del file system. L'oggetto è lo stesso di `fs.constants`. Vedi [Costanti FS](/it/nodejs/api/fs#fs-constants) per maggiori dettagli.

## API Callback {#callback-api}

Le API callback eseguono tutte le operazioni in modo asincrono, senza bloccare il ciclo di eventi, quindi invocano una funzione di callback al completamento o in caso di errore.

Le API callback utilizzano il threadpool Node.js sottostante per eseguire operazioni sul file system al di fuori del thread del ciclo di eventi. Queste operazioni non sono sincronizzate o threadsafe. È necessario prestare attenzione quando si eseguono più modifiche simultanee sullo stesso file, altrimenti potrebbero verificarsi danneggiamenti dei dati.

### `fs.access(path[, mode], callback)` {#fsaccesspath-mode-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.8.0 | Le costanti `fs.F_OK`, `fs.R_OK`, `fs.W_OK` e `fs.X_OK` che erano presenti direttamente su `fs` sono deprecate. |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v7.6.0 | Il parametro `path` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v6.3.0 | Le costanti come `fs.R_OK`, ecc. che erano presenti direttamente su `fs` sono state spostate in `fs.constants` come deprecazione leggera. Pertanto, per Node.js `\< v6.3.0` utilizzare `fs` per accedere a quelle costanti, o fare qualcosa come `(fs.constants || fs).R_OK` per funzionare con tutte le versioni. |
| v0.11.15 | Aggiunto in: v0.11.15 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `fs.constants.F_OK`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)



Verifica le autorizzazioni di un utente per il file o la directory specificata da `path`. L'argomento `mode` è un intero opzionale che specifica i controlli di accessibilità da eseguire. `mode` deve essere il valore `fs.constants.F_OK` o una maschera costituita dall'OR bit a bit di uno qualsiasi tra `fs.constants.R_OK`, `fs.constants.W_OK` e `fs.constants.X_OK` (ad esempio `fs.constants.W_OK | fs.constants.R_OK`). Controlla [Costanti di accesso ai file](/it/nodejs/api/fs#file-access-constants) per i possibili valori di `mode`.

L'argomento finale, `callback`, è una funzione di callback che viene invocata con un possibile argomento di errore. Se uno qualsiasi dei controlli di accessibilità fallisce, l'argomento di errore sarà un oggetto `Error`. Gli esempi seguenti controllano se `package.json` esiste e se è leggibile o scrivibile.

```js [ESM]
import { access, constants } from 'node:fs';

const file = 'package.json';

// Controlla se il file esiste nella directory corrente.
access(file, constants.F_OK, (err) => {
  console.log(`${file} ${err ? 'non esiste' : 'esiste'}`);
});

// Controlla se il file è leggibile.
access(file, constants.R_OK, (err) => {
  console.log(`${file} ${err ? 'non è leggibile' : 'è leggibile'}`);
});

// Controlla se il file è scrivibile.
access(file, constants.W_OK, (err) => {
  console.log(`${file} ${err ? 'non è scrivibile' : 'è scrivibile'}`);
});

// Controlla se il file è leggibile e scrivibile.
access(file, constants.R_OK | constants.W_OK, (err) => {
  console.log(`${file} ${err ? 'non è' : 'è'} leggibile e scrivibile`);
});
```
Non utilizzare `fs.access()` per verificare l'accessibilità di un file prima di chiamare `fs.open()`, `fs.readFile()` o `fs.writeFile()`. Ciò introduce una race condition, poiché altri processi potrebbero modificare lo stato del file tra le due chiamate. Invece, il codice utente dovrebbe aprire/leggere/scrivere direttamente il file e gestire l'errore generato se il file non è accessibile.

**scrivi (NON RACCOMANDATO)**

```js [ESM]
import { access, open, close } from 'node:fs';

access('myfile', (err) => {
  if (!err) {
    console.error('myfile esiste già');
    return;
  }

  open('myfile', 'wx', (err, fd) => {
    if (err) throw err;

    try {
      writeMyData(fd);
    } finally {
      close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});
```
**scrivi (RACCOMANDATO)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile esiste già');
      return;
    }

    throw err;
  }

  try {
    writeMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
**leggi (NON RACCOMANDATO)**

```js [ESM]
import { access, open, close } from 'node:fs';
access('myfile', (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile non esiste');
      return;
    }

    throw err;
  }

  open('myfile', 'r', (err, fd) => {
    if (err) throw err;

    try {
      readMyData(fd);
    } finally {
      close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});
```
**leggi (RACCOMANDATO)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile non esiste');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
Gli esempi "non raccomandati" sopra controllano l'accessibilità e quindi utilizzano il file; gli esempi "raccomandati" sono migliori perché utilizzano direttamente il file e gestiscono l'errore, se presente.

In generale, controlla l'accessibilità di un file solo se il file non verrà utilizzato direttamente, ad esempio quando la sua accessibilità è un segnale da un altro processo.

Su Windows, le policy di controllo dell'accesso (ACL) su una directory possono limitare l'accesso a un file o una directory. La funzione `fs.access()`, tuttavia, non controlla l'ACL e pertanto potrebbe segnalare che un percorso è accessibile anche se l'ACL impedisce all'utente di leggere o scrivere su di esso.


### `fs.appendFile(path, data[, options], callback)` {#fsappendfilepath-data-options-callback}

::: info [Cronologia]
| Versione     | Modifiche                                                  |
| :----------- | :--------------------------------------------------------- |
| v21.1.0, v20.10.0 | L'opzione `flush` è ora supportata.                        |
| v18.0.0      | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v10.0.0      | Il parametro `callback` non è più opzionale. Non passandolo verrà generato un `TypeError` in fase di esecuzione. |
| v7.0.0       | Il parametro `callback` non è più opzionale. Non passandolo emetterà un avviso di deprecazione con id DEP0013. |
| v7.0.0       | L'oggetto `options` passato non verrà mai modificato.     |
| v5.0.0       | Il parametro `file` ora può essere un descrittore di file. |
| v0.6.7       | Aggiunto in: v0.6.7                                         |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nome del file o descrittore del file
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Vedi [supporto dei `flag` del file system](/it/nodejs/api/fs#file-system-flags). **Predefinito:** `'a'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, il descrittore di file sottostante viene scaricato prima di chiuderlo. **Predefinito:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)


Aggiunge asincronamente dati a un file, creando il file se non esiste già. `data` può essere una stringa o un [\<Buffer\>](/it/nodejs/api/buffer#class-buffer).

L'opzione `mode` influisce solo sul file appena creato. Vedi [`fs.open()`](/it/nodejs/api/fs#fsopenpath-flags-mode-callback) per maggiori dettagli.

```js [ESM]
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});
```
Se `options` è una stringa, allora specifica la codifica:

```js [ESM]
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', 'utf8', callback);
```
Il `path` può essere specificato come un descrittore di file numerico che è stato aperto per l'aggiunta (utilizzando `fs.open()` o `fs.openSync()`). Il descrittore di file non verrà chiuso automaticamente.

```js [ESM]
import { open, close, appendFile } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('message.txt', 'a', (err, fd) => {
  if (err) throw err;

  try {
    appendFile(fd, 'data to append', 'utf8', (err) => {
      closeFd(fd);
      if (err) throw err;
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
});
```

### `fs.chmod(path, mode, callback)` {#fschmodpath-mode-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora lancia `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Non passarlo genererà un `TypeError` in fase di runtime. |
| v7.6.0 | Il parametro `path` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Non passarlo emetterà un avviso di deprecazione con id DEP0013. |
| v0.1.30 | Aggiunto in: v0.1.30 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Modifica in modo asincrono i permessi di un file. Nessun argomento, a parte una possibile eccezione, viene fornito al callback di completamento.

Consulta la documentazione POSIX [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2) per maggiori dettagli.

```js [ESM]
import { chmod } from 'node:fs';

chmod('my_file.txt', 0o775, (err) => {
  if (err) throw err;
  console.log('I permessi per il file "my_file.txt" sono stati modificati!');
});
```
#### Modalità file {#file-modes}

L'argomento `mode` utilizzato sia nel metodo `fs.chmod()` sia nel metodo `fs.chmodSync()` è una bitmask numerica creata utilizzando un OR logico delle seguenti costanti:

| Costante | Ottale | Descrizione |
| --- | --- | --- |
| `fs.constants.S_IRUSR` | `0o400` | lettura da parte del proprietario |
| `fs.constants.S_IWUSR` | `0o200` | scrittura da parte del proprietario |
| `fs.constants.S_IXUSR` | `0o100` | esecuzione/ricerca da parte del proprietario |
| `fs.constants.S_IRGRP` | `0o40` | lettura da parte del gruppo |
| `fs.constants.S_IWGRP` | `0o20` | scrittura da parte del gruppo |
| `fs.constants.S_IXGRP` | `0o10` | esecuzione/ricerca da parte del gruppo |
| `fs.constants.S_IROTH` | `0o4` | lettura da parte di altri |
| `fs.constants.S_IWOTH` | `0o2` | scrittura da parte di altri |
| `fs.constants.S_IXOTH` | `0o1` | esecuzione/ricerca da parte di altri |

Un metodo più semplice per costruire la `mode` è utilizzare una sequenza di tre cifre ottali (ad esempio `765`). La cifra più a sinistra (`7` nell'esempio), specifica i permessi per il proprietario del file. La cifra centrale (`6` nell'esempio), specifica i permessi per il gruppo. La cifra più a destra (`5` nell'esempio), specifica i permessi per gli altri.

| Numero | Descrizione |
| --- | --- |
| `7` | lettura, scrittura ed esecuzione |
| `6` | lettura e scrittura |
| `5` | lettura ed esecuzione |
| `4` | solo lettura |
| `3` | scrittura ed esecuzione |
| `2` | solo scrittura |
| `1` | solo esecuzione |
| `0` | nessun permesso |

Ad esempio, il valore ottale `0o765` significa:

- Il proprietario può leggere, scrivere ed eseguire il file.
- Il gruppo può leggere e scrivere il file.
- Gli altri possono leggere ed eseguire il file.

Quando si utilizzano numeri raw dove sono previste modalità di file, qualsiasi valore maggiore di `0o777` può comportare comportamenti specifici della piattaforma che non sono supportati per funzionare in modo coerente. Pertanto, costanti come `S_ISVTX`, `S_ISGID` o `S_ISUID` non sono esposte in `fs.constants`.

Avvertenze: su Windows è possibile modificare solo il permesso di scrittura e la distinzione tra i permessi di gruppo, proprietario o altri non è implementata.


### `fs.chown(path, uid, gid, callback)` {#fschownpath-uid-gid-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Non passarlo genererà un `TypeError` in fase di esecuzione. |
| v7.6.0 | Il parametro `path` può essere un oggetto `URL` WHATWG utilizzando il protocollo `file:`. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Non passarlo emetterà un avviso di deprecazione con id DEP0013. |
| v0.1.97 | Aggiunto in: v0.1.97 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Modifica in modo asincrono il proprietario e il gruppo di un file. Nessun argomento, ad eccezione di una possibile eccezione, viene fornito al callback di completamento.

Vedi la documentazione POSIX [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2) per maggiori dettagli.

### `fs.close(fd[, callback])` {#fsclosefd-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v15.9.0, v14.17.0 | Un callback predefinito viene ora utilizzato se non ne viene fornito uno. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Non passarlo genererà un `TypeError` in fase di esecuzione. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Non passarlo emetterà un avviso di deprecazione con id DEP0013. |
| v0.0.2 | Aggiunto in: v0.0.2 |
:::

- `fd` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Chiude il descrittore del file. Nessun argomento, ad eccezione di una possibile eccezione, viene fornito al callback di completamento.

Chiamare `fs.close()` su qualsiasi descrittore di file (`fd`) attualmente in uso tramite qualsiasi altra operazione `fs` può portare a un comportamento indefinito.

Vedi la documentazione POSIX [`close(2)`](http://man7.org/linux/man-pages/man2/close.2) per maggiori dettagli.


### `fs.copyFile(src, dest[, mode], callback)` {#fscopyfilesrc-dest-mode-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v14.0.0 | L'argomento `flags` è stato modificato in `mode` ed è stata imposta una convalida del tipo più rigida. |
| v8.5.0 | Aggiunto in: v8.5.0 |
:::

- `src` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) nome del file sorgente da copiare
- `dest` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) nome del file di destinazione dell'operazione di copia
- `mode` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) modificatori per l'operazione di copia. **Predefinito:** `0`.
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Copia asincronamente `src` in `dest`. Per impostazione predefinita, `dest` viene sovrascritto se esiste già. Nessun argomento diverso da una possibile eccezione viene fornito alla funzione di callback. Node.js non fornisce alcuna garanzia sull'atomicità dell'operazione di copia. Se si verifica un errore dopo che il file di destinazione è stato aperto per la scrittura, Node.js tenterà di rimuovere la destinazione.

`mode` è un numero intero facoltativo che specifica il comportamento dell'operazione di copia. È possibile creare una maschera costituita dall'OR bit a bit di due o più valori (ad esempio `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`).

- `fs.constants.COPYFILE_EXCL`: L'operazione di copia non riuscirà se `dest` esiste già.
- `fs.constants.COPYFILE_FICLONE`: L'operazione di copia tenterà di creare un reflink copy-on-write. Se la piattaforma non supporta copy-on-write, viene utilizzato un meccanismo di copia di fallback.
- `fs.constants.COPYFILE_FICLONE_FORCE`: L'operazione di copia tenterà di creare un reflink copy-on-write. Se la piattaforma non supporta copy-on-write, l'operazione fallirà.

```js [ESM]
import { copyFile, constants } from 'node:fs';

function callback(err) {
  if (err) throw err;
  console.log('source.txt è stato copiato in destination.txt');
}

// destination.txt verrà creato o sovrascritto per impostazione predefinita.
copyFile('source.txt', 'destination.txt', callback);

// Utilizzando COPYFILE_EXCL, l'operazione fallirà se destination.txt esiste.
copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL, callback);
```

### `fs.cp(src, dest[, options], callback)` {#fscpsrc-dest-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.3.0 | Questa API non è più sperimentale. |
| v20.1.0, v18.17.0 | Accetta un'opzione `mode` aggiuntiva per specificare il comportamento di copia come argomento `mode` di `fs.copyFile()`. |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v17.6.0, v16.15.0 | Accetta un'opzione `verbatimSymlinks` aggiuntiva per specificare se eseguire la risoluzione del percorso per i collegamenti simbolici. |
| v16.7.0 | Aggiunto in: v16.7.0 |
:::

- `src` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) percorso di origine da copiare.
- `dest` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) percorso di destinazione in cui copiare.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) dereferenzia i collegamenti simbolici. **Predefinito:** `false`.
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) quando `force` è `false` e la destinazione esiste, genera un errore. **Predefinito:** `false`.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funzione per filtrare i file/directory copiati. Restituisce `true` per copiare l'elemento, `false` per ignorarlo. Quando si ignora una directory, anche tutto il suo contenuto verrà ignorato. Può anche restituire una `Promise` che si risolve in `true` o `false` **Predefinito:** `undefined`.
    - `src` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) percorso di origine da copiare.
    - `dest` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) percorso di destinazione in cui copiare.
    - Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Un valore che può essere coercibile a `boolean` o una `Promise` che si realizza con tale valore.


    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) sovrascrive il file o la directory esistente. L'operazione di copia ignorerà gli errori se lo imposti su false e la destinazione esiste. Usa l'opzione `errorOnExist` per modificare questo comportamento. **Predefinito:** `true`.
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) modificatori per l'operazione di copia. **Predefinito:** `0`. Vedi il flag `mode` di [`fs.copyFile()`](/it/nodejs/api/fs#fscopyfilesrc-dest-mode-callback).
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true` i timestamp da `src` verranno conservati. **Predefinito:** `false`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) copia le directory in modo ricorsivo **Predefinito:** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, la risoluzione del percorso per i collegamenti simbolici verrà saltata. **Predefinito:** `false`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)



Copia in modo asincrono l'intera struttura della directory da `src` a `dest`, incluse sottodirectory e file.

Quando si copia una directory in un'altra directory, i glob non sono supportati e il comportamento è simile a `cp dir1/ dir2/`.


### `fs.createReadStream(path[, options])` {#fscreatereadstreampath-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.10.0 | L'opzione `fs` non necessita del metodo `open` se è stato fornito un `fd`. |
| v16.10.0 | L'opzione `fs` non necessita del metodo `close` se `autoClose` è `false`. |
| v15.5.0 | Aggiunto il supporto per `AbortSignal`. |
| v15.4.0 | L'opzione `fd` accetta argomenti FileHandle. |
| v14.0.0 | Modificato il valore predefinito di `emitClose` a `true`. |
| v13.6.0, v12.17.0 | Le opzioni `fs` consentono di sovrascrivere l'implementazione `fs` utilizzata. |
| v12.10.0 | Abilitata l'opzione `emitClose`. |
| v11.0.0 | Imposte nuove restrizioni su `start` e `end`, generando errori più appropriati nei casi in cui non possiamo gestire ragionevolmente i valori di input. |
| v7.6.0 | Il parametro `path` può essere un oggetto WHATWG `URL` che utilizza il protocollo `file:`. |
| v7.0.0 | L'oggetto `options` passato non verrà mai modificato. |
| v2.3.0 | L'oggetto `options` passato può essere una stringa ora. |
| v0.1.31 | Aggiunto in: v0.1.31 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `flags` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Vedere [supporto dei `flag` del file system](/it/nodejs/api/fs#file-system-flags). **Predefinito:** `'r'`.
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `null`
    - `fd` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/it/nodejs/api/fs#class-filehandle) **Predefinito:** `null`
    - `mode` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0o666`
    - `autoClose` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `true`
    - `emitClose` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `true`
    - `start` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `Infinity`
    - `highWaterMark` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `64 * 1024`
    - `fs` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `null`
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `null`


- Restituisce: [\<fs.ReadStream\>](/it/nodejs/api/fs#class-fsreadstream)

`options` può includere i valori `start` e `end` per leggere un intervallo di byte dal file anziché l'intero file. Sia `start` che `end` sono inclusivi e iniziano a contare da 0, i valori consentiti sono nell'intervallo [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. Se `fd` è specificato e `start` viene omesso o `undefined`, `fs.createReadStream()` legge sequenzialmente dalla posizione corrente del file. La `encoding` può essere una qualsiasi di quelle accettate da [\<Buffer\>](/it/nodejs/api/buffer#class-buffer).

Se `fd` è specificato, `ReadStream` ignorerà l'argomento `path` e utilizzerà il descrittore di file specificato. Ciò significa che non verrà emesso alcun evento `'open'`. `fd` dovrebbe essere bloccante; `fd` non bloccanti dovrebbero essere passati a [\<net.Socket\>](/it/nodejs/api/net#class-netsocket).

Se `fd` punta a un dispositivo carattere che supporta solo letture bloccanti (come tastiera o scheda audio), le operazioni di lettura non terminano fino a quando i dati non sono disponibili. Ciò può impedire al processo di uscire e allo stream di chiudersi naturalmente.

Per impostazione predefinita, lo stream emetterà un evento `'close'` dopo che è stato distrutto. Imposta l'opzione `emitClose` su `false` per modificare questo comportamento.

Fornendo l'opzione `fs`, è possibile sovrascrivere le implementazioni `fs` corrispondenti per `open`, `read` e `close`. Quando si fornisce l'opzione `fs`, è richiesta una sovrascrittura per `read`. Se non viene fornito alcun `fd`, è richiesta anche una sovrascrittura per `open`. Se `autoClose` è `true`, è richiesta anche una sovrascrittura per `close`.

```js [ESM]
import { createReadStream } from 'node:fs';

// Crea uno stream da un dispositivo carattere.
const stream = createReadStream('/dev/input/event0');
setTimeout(() => {
  stream.close(); // Potrebbe non chiudere lo stream.
  // Marcando artificialmente la fine dello stream, come se la risorsa sottostante avesse
  // indicato la fine del file da sola, consente allo stream di chiudersi.
  // Questo non annulla le operazioni di lettura in sospeso e, se esiste tale
  // operazione, il processo potrebbe comunque non essere in grado di uscire correttamente
  // fino al suo completamento.
  stream.push(null);
  stream.read(0);
}, 100);
```
Se `autoClose` è false, allora il descrittore di file non verrà chiuso, anche se si verifica un errore. È responsabilità dell'applicazione chiuderlo e assicurarsi che non vi siano perdite di descrittori di file. Se `autoClose` è impostato su true (comportamento predefinito), su `'error'` o `'end'` il descrittore di file verrà chiuso automaticamente.

`mode` imposta la modalità file (autorizzazione e sticky bit), ma solo se il file è stato creato.

Un esempio per leggere gli ultimi 10 byte di un file lungo 100 byte:

```js [ESM]
import { createReadStream } from 'node:fs';

createReadStream('sample.txt', { start: 90, end: 99 });
```
Se `options` è una stringa, allora specifica la codifica.


### `fs.createWriteStream(path[, options])` {#fscreatewritestreampath-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.0.0, v20.10.0 | L'opzione `flush` è ora supportata. |
| v16.10.0 | L'opzione `fs` non necessita del metodo `open` se è stato fornito un `fd`. |
| v16.10.0 | L'opzione `fs` non necessita del metodo `close` se `autoClose` è `false`. |
| v15.5.0 | Aggiunto il supporto per `AbortSignal`. |
| v15.4.0 | L'opzione `fd` accetta argomenti FileHandle. |
| v14.0.0 | Cambiato il valore predefinito di `emitClose` in `true`. |
| v13.6.0, v12.17.0 | Le opzioni `fs` consentono di sovrascrivere l'implementazione `fs` utilizzata. |
| v12.10.0 | Abilitata l'opzione `emitClose`. |
| v7.6.0 | Il parametro `path` può essere un oggetto WHATWG `URL` che utilizza il protocollo `file:`. |
| v7.0.0 | L'oggetto `options` passato non verrà mai modificato. |
| v5.5.0 | L'opzione `autoClose` è ora supportata. |
| v2.3.0 | L'oggetto `options` passato può essere ora una stringa. |
| v0.1.31 | Aggiunto in: v0.1.31 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `flags` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Vedi [supporto per i `flag` del file system](/it/nodejs/api/fs#file-system-flags). **Predefinito:** `'w'`.
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'utf8'`
    - `fd` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/it/nodejs/api/fs#class-filehandle) **Predefinito:** `null`
    - `mode` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0o666`
    - `autoClose` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `true`
    - `emitClose` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `true`
    - `start` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `fs` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `null`
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `null`
    - `highWaterMark` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `16384`
    - `flush` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, il descrittore di file sottostante viene scaricato prima di chiuderlo. **Predefinito:** `false`.
  
 
- Restituisce: [\<fs.WriteStream\>](/it/nodejs/api/fs#class-fswritestream)

`options` può anche includere un'opzione `start` per consentire la scrittura di dati in una posizione successiva all'inizio del file, i valori consentiti sono nell'intervallo [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. La modifica di un file anziché la sua sostituzione potrebbe richiedere che l'opzione `flags` sia impostata su `r+` anziché sul valore predefinito `w`. L'`encoding` può essere uno qualsiasi di quelli accettati da [\<Buffer\>](/it/nodejs/api/buffer#class-buffer).

Se `autoClose` è impostato su true (comportamento predefinito) su `'error'` o `'finish'`, il descrittore di file verrà chiuso automaticamente. Se `autoClose` è false, il descrittore di file non verrà chiuso, anche in caso di errore. È responsabilità dell'applicazione chiuderlo e assicurarsi che non ci siano perdite di descrittori di file.

Per impostazione predefinita, lo stream emetterà un evento `'close'` dopo essere stato distrutto. Impostare l'opzione `emitClose` su `false` per modificare questo comportamento.

Fornendo l'opzione `fs` è possibile sovrascrivere le corrispondenti implementazioni `fs` per `open`, `write`, `writev` e `close`. Sovrascrivere `write()` senza `writev()` può ridurre le prestazioni poiché alcune ottimizzazioni (`_writev()`) verranno disabilitate. Quando si fornisce l'opzione `fs`, sono richieste sovrascritture per almeno una tra `write` e `writev`. Se non viene fornita alcuna opzione `fd`, è richiesta anche una sovrascrittura per `open`. Se `autoClose` è `true`, è richiesta anche una sovrascrittura per `close`.

Come [\<fs.ReadStream\>](/it/nodejs/api/fs#class-fsreadstream), se `fd` è specificato, [\<fs.WriteStream\>](/it/nodejs/api/fs#class-fswritestream) ignorerà l'argomento `path` e utilizzerà il descrittore di file specificato. Ciò significa che nessun evento `'open'` verrà emesso. `fd` dovrebbe essere bloccante; gli `fd` non bloccanti devono essere passati a [\<net.Socket\>](/it/nodejs/api/net#class-netsocket).

Se `options` è una stringa, specifica l'encoding.


### `fs.exists(path, callback)` {#fsexistspath-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v7.6.0 | Il parametro `path` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v1.0.0 | Deprecato dal: v1.0.0 |
| v0.0.2 | Aggiunto in: v0.0.2 |
:::

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato: Utilizzare invece [`fs.stat()`](/it/nodejs/api/fs#fsstatpath-options-callback) o [`fs.access()`](/it/nodejs/api/fs#fsaccesspath-mode-callback).
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `exists` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 

Verifica se l'elemento nel `path` specificato esiste controllando con il file system. Quindi chiama l'argomento `callback` con true o false:

```js [ESM]
import { exists } from 'node:fs';

exists('/etc/passwd', (e) => {
  console.log(e ? 'it exists' : 'no passwd!');
});
```
**I parametri per questo callback non sono coerenti con altri callback di Node.js.** Normalmente, il primo parametro di un callback di Node.js è un parametro `err`, facoltativamente seguito da altri parametri. Il callback `fs.exists()` ha solo un parametro booleano. Questo è uno dei motivi per cui `fs.access()` è raccomandato al posto di `fs.exists()`.

Se `path` è un collegamento simbolico, viene seguito. Pertanto, se `path` esiste ma punta a un elemento inesistente, il callback riceverà il valore `false`.

Non è raccomandato l'utilizzo di `fs.exists()` per verificare l'esistenza di un file prima di chiamare `fs.open()`, `fs.readFile()` o `fs.writeFile()`. In questo modo si introduce una race condition, poiché altri processi possono modificare lo stato del file tra le due chiamate. Invece, il codice utente dovrebbe aprire/leggere/scrivere il file direttamente e gestire l'errore generato se il file non esiste.

**scrittura (NON RACCOMANDATO)**

```js [ESM]
import { exists, open, close } from 'node:fs';

exists('myfile', (e) => {
  if (e) {
    console.error('myfile already exists');
  } else {
    open('myfile', 'wx', (err, fd) => {
      if (err) throw err;

      try {
        writeMyData(fd);
      } finally {
        close(fd, (err) => {
          if (err) throw err;
        });
      }
    });
  }
});
```
**scrittura (RACCOMANDATO)**

```js [ESM]
import { open, close } from 'node:fs';
open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile already exists');
      return;
    }

    throw err;
  }

  try {
    writeMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
**lettura (NON RACCOMANDATO)**

```js [ESM]
import { open, close, exists } from 'node:fs';

exists('myfile', (e) => {
  if (e) {
    open('myfile', 'r', (err, fd) => {
      if (err) throw err;

      try {
        readMyData(fd);
      } finally {
        close(fd, (err) => {
          if (err) throw err;
        });
      }
    });
  } else {
    console.error('myfile does not exist');
  }
});
```
**lettura (RACCOMANDATO)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile does not exist');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
Gli esempi "non raccomandati" sopra verificano l'esistenza e quindi utilizzano il file; gli esempi "raccomandati" sono migliori perché utilizzano il file direttamente e gestiscono l'errore, se presente.

In generale, verifica l'esistenza di un file solo se il file non verrà utilizzato direttamente, ad esempio quando la sua esistenza è un segnale da un altro processo.


### `fs.fchmod(fd, mode, callback)` {#fsfchmodfd-mode-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Il passaggio di un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Non passarlo genererà un `TypeError` in fase di runtime. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Non passarlo emetterà un avviso di deprecazione con id DEP0013. |
| v0.4.7 | Aggiunto in: v0.4.7 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

 

Imposta i permessi sul file. Nessun argomento, a parte una possibile eccezione, viene fornito al callback di completamento.

Vedere la documentazione POSIX [`fchmod(2)`](http://man7.org/linux/man-pages/man2/fchmod.2) per maggiori dettagli.

### `fs.fchown(fd, uid, gid, callback)` {#fsfchownfd-uid-gid-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Il passaggio di un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Non passarlo genererà un `TypeError` in fase di runtime. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Non passarlo emetterà un avviso di deprecazione con id DEP0013. |
| v0.4.7 | Aggiunto in: v0.4.7 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

 

Imposta il proprietario del file. Nessun argomento, a parte una possibile eccezione, viene fornito al callback di completamento.

Vedere la documentazione POSIX [`fchown(2)`](http://man7.org/linux/man-pages/man2/fchown.2) per maggiori dettagli.


### `fs.fdatasync(fd, callback)` {#fsfdatasyncfd-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Non passarlo genererà un `TypeError` in fase di esecuzione. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Non passarlo emetterà un avviso di deprecazione con l'id DEP0013. |
| v0.1.96 | Aggiunto in: v0.1.96 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Forza tutte le operazioni di I/O attualmente in coda associate al file allo stato di completamento I/O sincronizzato del sistema operativo. Fare riferimento alla documentazione POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2) per i dettagli. Nessun argomento diverso da una possibile eccezione viene fornito al callback di completamento.

### `fs.fstat(fd[, options], callback)` {#fsfstatfd-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v10.5.0 | Accetta un oggetto `options` aggiuntivo per specificare se i valori numerici restituiti devono essere bigint. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Non passarlo genererà un `TypeError` in fase di esecuzione. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Non passarlo emetterà un avviso di deprecazione con l'id DEP0013. |
| v0.1.95 | Aggiunto in: v0.1.95 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se i valori numerici nell'oggetto [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) restituito devono essere `bigint`. **Predefinito:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats)
  
 

Invoca il callback con [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) per il descrittore del file.

Vedere la documentazione POSIX [`fstat(2)`](http://man7.org/linux/man-pages/man2/fstat.2) per maggiori dettagli.


### `fs.fsync(fd, callback)` {#fsfsyncfd-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Non passarlo genererà un `TypeError` a runtime. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Non passarlo emetterà un avviso di deprecazione con id DEP0013. |
| v0.1.96 | Aggiunto in: v0.1.96 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Richiede che tutti i dati per il descrittore di file aperto vengano scaricati sul dispositivo di archiviazione. L'implementazione specifica è specifica del sistema operativo e del dispositivo. Fare riferimento alla documentazione POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2) per maggiori dettagli. Alla callback di completamento non vengono forniti argomenti diversi da una possibile eccezione.

### `fs.ftruncate(fd[, len], callback)` {#fsftruncatefd-len-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Non passarlo genererà un `TypeError` a runtime. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Non passarlo emetterà un avviso di deprecazione con id DEP0013. |
| v0.8.6 | Aggiunto in: v0.8.6 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Tronca il descrittore di file. Alla callback di completamento non vengono forniti argomenti diversi da una possibile eccezione.

Vedere la documentazione POSIX [`ftruncate(2)`](http://man7.org/linux/man-pages/man2/ftruncate.2) per maggiori dettagli.

Se il file a cui fa riferimento il descrittore di file era più grande di `len` byte, nel file verranno mantenuti solo i primi `len` byte.

Ad esempio, il seguente programma conserva solo i primi quattro byte del file:

```js [ESM]
import { open, close, ftruncate } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('temp.txt', 'r+', (err, fd) => {
  if (err) throw err;

  try {
    ftruncate(fd, 4, (err) => {
      closeFd(fd);
      if (err) throw err;
    });
  } catch (err) {
    closeFd(fd);
    if (err) throw err;
  }
});
```
Se il file era precedentemente più corto di `len` byte, viene esteso e la parte estesa viene riempita con byte nulli (`'\0'`):

Se `len` è negativo verrà utilizzato `0`.


### `fs.futimes(fd, atime, mtime, callback)` {#fsfutimesfd-atime-mtime-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Il passaggio di un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Non passarlo genererà un `TypeError` in fase di esecuzione. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Non passarlo emetterà un avviso di deprecazione con ID DEP0013. |
| v4.1.0 | Stringhe numeriche, `NaN` e `Infinity` sono ora specificatori di tempo consentiti. |
| v0.4.2 | Aggiunto in: v0.4.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Modifica i timestamp del file system dell'oggetto a cui fa riferimento il descrittore di file fornito. Vedere [`fs.utimes()`](/it/nodejs/api/fs#fsutimespath-atime-mtime-callback).

### `fs.glob(pattern[, options], callback)` {#fsglobpattern-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.2.0 | Aggiunto il supporto per `withFileTypes` come opzione. |
| v22.0.0 | Aggiunto in: v22.0.0 |
:::

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

-  `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) directory di lavoro corrente. **Predefinito:** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funzione per filtrare file/directory. Restituisce `true` per escludere l'elemento, `false` per includerlo. **Predefinito:** `undefined`.
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se il glob deve restituire i percorsi come Dirents, `false` altrimenti. **Predefinito:** `false`.
  
 
-  `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 
-  Recupera i file che corrispondono al modello specificato.

::: code-group
```js [ESM]
import { glob } from 'node:fs';

glob('**/*.js', (err, matches) => {
  if (err) throw err;
  console.log(matches);
});
```

```js [CJS]
const { glob } = require('node:fs');

glob('**/*.js', (err, matches) => {
  if (err) throw err;
  console.log(matches);
});
```
:::


### `fs.lchmod(path, mode, callback)` {#fslchmodpath-mode-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v16.0.0 | L'errore restituito potrebbe essere un `AggregateError` se viene restituito più di un errore. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Non passarlo genererà un `TypeError` in fase di esecuzione. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Non passarlo emetterà un avviso di deprecazione con ID DEP0013. |
| v0.4.7 | Deprecato da: v0.4.7 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
  
 

Cambia le autorizzazioni su un link simbolico. Nessun argomento oltre a una possibile eccezione viene fornito al callback di completamento.

Questo metodo è implementato solo su macOS.

Vedi la documentazione POSIX [`lchmod(2)`](https://www.freebsd.org/cgi/man.cgi?query=lchmod&sektion=2) per maggiori dettagli.

### `fs.lchown(path, uid, gid, callback)` {#fslchownpath-uid-gid-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v10.6.0 | Questa API non è più deprecata. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Non passarlo genererà un `TypeError` in fase di esecuzione. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Non passarlo emetterà un avviso di deprecazione con ID DEP0013. |
| v0.4.7 | Deprecazione solo documentazione. |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Imposta il proprietario del link simbolico. Nessun argomento oltre a una possibile eccezione viene fornito al callback di completamento.

Vedi la documentazione POSIX [`lchown(2)`](http://man7.org/linux/man-pages/man2/lchown.2) per maggiori dettagli.


### `fs.lutimes(path, atime, mtime, callback)` {#fslutimespath-atime-mtime-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Il passaggio di una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v14.5.0, v12.19.0 | Aggiunto in: v14.5.0, v12.19.0 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Data\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Data\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Modifica i tempi di accesso e modifica di un file nello stesso modo di [`fs.utimes()`](/it/nodejs/api/fs#fsutimespath-atime-mtime-callback), con la differenza che se il percorso si riferisce a un collegamento simbolico, il collegamento non viene dereferenziato: invece, i timestamp del collegamento simbolico stesso vengono modificati.

Nessun argomento oltre a una possibile eccezione viene fornito alla callback di completamento.

### `fs.link(existingPath, newPath, callback)` {#fslinkexistingpath-newpath-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Il passaggio di una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Non passarlo genererà un `TypeError` in fase di esecuzione. |
| v7.6.0 | I parametri `existingPath` e `newPath` possono essere oggetti WHATWG `URL` che utilizzano il protocollo `file:`. Il supporto è attualmente ancora *sperimentale*. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Non passarlo emetterà un avviso di deprecazione con id DEP0013. |
| v0.1.31 | Aggiunto in: v0.1.31 |
:::

- `existingPath` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Crea un nuovo collegamento da `existingPath` a `newPath`. Consulta la documentazione POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) per maggiori dettagli. Nessun argomento oltre a una possibile eccezione viene fornito alla callback di completamento.


### `fs.lstat(path[, options], callback)` {#fslstatpath-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Il passaggio di un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v10.5.0 | Accetta un oggetto `options` aggiuntivo per specificare se i valori numerici restituiti devono essere bigint. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Il mancato passaggio di questo genererà un `TypeError` in fase di esecuzione. |
| v7.6.0 | Il parametro `path` può essere un oggetto WHATWG `URL` che utilizza il protocollo `file:`. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Il mancato passaggio di questo emetterà un avviso di deprecazione con ID DEP0013. |
| v0.1.30 | Aggiunto in: v0.1.30 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se i valori numerici nell'oggetto [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) restituito devono essere `bigint`. **Predefinito:** `false`.


- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats)


Recupera [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) per il collegamento simbolico a cui fa riferimento il percorso. Il callback ottiene due argomenti `(err, stats)` dove `stats` è un oggetto [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats). `lstat()` è identico a `stat()`, tranne per il fatto che se `path` è un collegamento simbolico, viene eseguito lo stat del collegamento stesso, non del file a cui fa riferimento.

Vedi la documentazione POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) per maggiori dettagli.


### `fs.mkdir(path[, options], callback)` {#fsmkdirpath-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora lancia `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v13.11.0, v12.17.0 | In modalità `recursive`, la callback ora riceve il primo percorso creato come argomento. |
| v10.12.0 | Il secondo argomento può ora essere un oggetto `options` con proprietà `recursive` e `mode`. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Non passarlo lancerà un `TypeError` in fase di esecuzione. |
| v7.6.0 | Il parametro `path` può essere un oggetto WHATWG `URL` che utilizza il protocollo `file:`. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Non passarlo emetterà un avviso di deprecazione con id DEP0013. |
| v0.1.8 | Aggiunto in: v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Default:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Non supportato su Windows. **Default:** `0o777`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Presente solo se una directory viene creata con `recursive` impostato su `true`.
  
 

Crea asincronamente una directory.

Alla callback viene fornita una possibile eccezione e, se `recursive` è `true`, il primo percorso di directory creato, `(err[, path])`. `path` può ancora essere `undefined` quando `recursive` è `true`, se non è stata creata alcuna directory (ad esempio, se è stata creata in precedenza).

L'argomento facoltativo `options` può essere un intero che specifica `mode` (permessi e sticky bit), o un oggetto con una proprietà `mode` e una proprietà `recursive` che indica se le directory padre devono essere create. Chiamare `fs.mkdir()` quando `path` è una directory esistente si traduce in un errore solo quando `recursive` è false. Se `recursive` è false e la directory esiste, si verifica un errore `EEXIST`.

```js [ESM]
import { mkdir } from 'node:fs';

// Crea ./tmp/a/apple, indipendentemente dal fatto che ./tmp e ./tmp/a esistano.
mkdir('./tmp/a/apple', { recursive: true }, (err) => {
  if (err) throw err;
});
```
Su Windows, l'utilizzo di `fs.mkdir()` sulla directory root anche con la ricorsione comporterà un errore:

```js [ESM]
import { mkdir } from 'node:fs';

mkdir('/', { recursive: true }, (err) => {
  // => [Error: EPERM: operation not permitted, mkdir 'C:\']
});
```
Vedi la documentazione POSIX [`mkdir(2)`](http://man7.org/linux/man-pages/man2/mkdir.2) per maggiori dettagli.


### `fs.mkdtemp(prefix[, options], callback)` {#fsmkdtempprefix-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.6.0, v18.19.0 | Il parametro `prefix` ora accetta buffer e URL. |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v16.5.0, v14.18.0 | Il parametro `prefix` ora accetta una stringa vuota. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Non passarlo genererà un `TypeError` in fase di esecuzione. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Non passarlo emetterà un avviso di deprecazione con id DEP0013. |
| v6.2.1 | Il parametro `callback` ora è opzionale. |
| v5.10.0 | Aggiunto in: v5.10.0 |
:::

- `prefix` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'utf8'`


- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `directory` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)



Crea una directory temporanea univoca.

Genera sei caratteri casuali da aggiungere dopo un `prefix` obbligatorio per creare una directory temporanea univoca. A causa di incongruenze della piattaforma, evitare i caratteri `X` finali in `prefix`. Alcune piattaforme, in particolare i BSD, possono restituire più di sei caratteri casuali e sostituire i caratteri `X` finali in `prefix` con caratteri casuali.

Il percorso della directory creata viene passato come stringa al secondo parametro del callback.

L'argomento opzionale `options` può essere una stringa che specifica una codifica, o un oggetto con una proprietà `encoding` che specifica la codifica dei caratteri da utilizzare.

```js [ESM]
import { mkdtemp } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

mkdtemp(join(tmpdir(), 'foo-'), (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Stampa: /tmp/foo-itXde2 oppure C:\Users\...\AppData\Local\Temp\foo-itXde2
});
```
Il metodo `fs.mkdtemp()` aggiungerà i sei caratteri selezionati casualmente direttamente alla stringa `prefix`. Ad esempio, dato una directory `/tmp`, se l'intenzione è quella di creare una directory temporanea *all'interno* di `/tmp`, il `prefix` deve terminare con un separatore di percorso specifico della piattaforma (`require('node:path').sep`).

```js [ESM]
import { tmpdir } from 'node:os';
import { mkdtemp } from 'node:fs';

// La directory principale per la nuova directory temporanea
const tmpDir = tmpdir();

// Questo metodo è *ERRATO*:
mkdtemp(tmpDir, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Stampa qualcosa di simile a `/tmpabc123`.
  // Una nuova directory temporanea viene creata nella root del filesystem
  // invece che *all'interno* della directory /tmp.
});

// Questo metodo è *CORRETTO*:
import { sep } from 'node:path';
mkdtemp(`${tmpDir}${sep}`, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Stampa qualcosa di simile a `/tmp/abc123`.
  // Una nuova directory temporanea viene creata all'interno
  // della directory /tmp.
});
```

### `fs.open(path[, flags[, mode]], callback)` {#fsopenpath-flags-mode-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v11.1.0 | L'argomento `flags` ora è opzionale e il valore predefinito è `'r'`. |
| v9.9.0 | I flag `as` e `as+` sono ora supportati. |
| v7.6.0 | Il parametro `path` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v0.0.2 | Aggiunto in: v0.0.2 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Vedi [supporto dei `flags` del file system](/it/nodejs/api/fs#file-system-flags). **Predefinito:** `'r'`.
- `mode` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0o666` (leggibile e scrivibile)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `fd` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Apertura file asincrona. Consulta la documentazione POSIX [`open(2)`](http://man7.org/linux/man-pages/man2/open.2) per maggiori dettagli.

`mode` imposta la modalità del file (permessi e sticky bit), ma solo se il file è stato creato. Su Windows, solo il permesso di scrittura può essere manipolato; vedi [`fs.chmod()`](/it/nodejs/api/fs#fschmodpath-mode-callback).

Il callback riceve due argomenti `(err, fd)`.

Alcuni caratteri (`\< \> : " / \ | ? *`) sono riservati in Windows come documentato da [Denominazione di file, percorsi e spazi dei nomi](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file). In NTFS, se il nome del file contiene i due punti, Node.js aprirà un flusso del file system, come descritto in [questa pagina MSDN](https://docs.microsoft.com/en-us/windows/desktop/FileIO/using-streams).

Anche le funzioni basate su `fs.open()` mostrano questo comportamento: `fs.writeFile()`, `fs.readFile()`, ecc.


### `fs.openAsBlob(path[, options])` {#fsopenasblobpath-options}

**Aggiunto in: v19.8.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un tipo mime opzionale per il blob.


- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si realizza con un [\<Blob\>](/it/nodejs/api/buffer#class-blob) in caso di successo.

Restituisce un [\<Blob\>](/it/nodejs/api/buffer#class-blob) i cui dati sono supportati dal file specificato.

Il file non deve essere modificato dopo la creazione di [\<Blob\>](/it/nodejs/api/buffer#class-blob). Qualsiasi modifica farà sì che la lettura dei dati di [\<Blob\>](/it/nodejs/api/buffer#class-blob) fallisca con un errore `DOMException`. Operazioni stat sincronizzate sul file quando il `Blob` viene creato e prima di ogni lettura per rilevare se i dati del file sono stati modificati sul disco.



::: code-group
```js [ESM]
import { openAsBlob } from 'node:fs';

const blob = await openAsBlob('the.file.txt');
const ab = await blob.arrayBuffer();
blob.stream();
```

```js [CJS]
const { openAsBlob } = require('node:fs');

(async () => {
  const blob = await openAsBlob('the.file.txt');
  const ab = await blob.arrayBuffer();
  blob.stream();
})();
```
:::

### `fs.opendir(path[, options], callback)` {#fsopendirpath-options-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.1.0, v18.17.0 | Aggiunta l'opzione `recursive`. |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v13.1.0, v12.16.0 | È stata introdotta l'opzione `bufferSize`. |
| v12.12.0 | Aggiunto in: v12.12.0 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `'utf8'`
    - `bufferSize` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di voci di directory memorizzate internamente nel buffer durante la lettura dalla directory. Valori più alti portano a prestazioni migliori ma a un maggiore utilizzo della memoria. **Predefinito:** `32`
    - `recursive` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `false`


- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `dir` [\<fs.Dir\>](/it/nodejs/api/fs#class-fsdir)



Apre in modo asincrono una directory. Vedere la documentazione POSIX [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3) per maggiori dettagli.

Crea un [\<fs.Dir\>](/it/nodejs/api/fs#class-fsdir), che contiene tutte le ulteriori funzioni per la lettura e la pulizia della directory.

L'opzione `encoding` imposta la codifica per il `path` durante l'apertura della directory e le successive operazioni di lettura.


### `fs.read(fd, buffer, offset, length, position, callback)` {#fsreadfd-buffer-offset-length-position-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v10.10.0 | Il parametro `buffer` ora può essere qualsiasi `TypedArray` o una `DataView`. |
| v7.4.0 | Il parametro `buffer` ora può essere un `Uint8Array`. |
| v6.0.0 | Il parametro `length` ora può essere `0`. |
| v0.0.2 | Aggiunto in: v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Il buffer in cui verranno scritti i dati.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La posizione in `buffer` in cui scrivere i dati.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte da leggere.
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Specifica da dove iniziare la lettura nel file. Se `position` è `null` o `-1`, i dati verranno letti dalla posizione corrente del file e la posizione del file verrà aggiornata. Se `position` è un numero intero non negativo, la posizione del file rimarrà invariata.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Legge i dati dal file specificato da `fd`.

Il callback riceve i tre argomenti, `(err, bytesRead, buffer)`.

Se il file non viene modificato contemporaneamente, la fine del file viene raggiunta quando il numero di byte letti è zero.

Se questo metodo viene richiamato come sua versione [`util.promisify()`](/it/nodejs/api/util#utilpromisifyoriginal)ed, restituisce una promise per un `Object` con le proprietà `bytesRead` e `buffer`.

Il metodo `fs.read()` legge i dati dal file specificato dal descrittore di file (`fd`). L'argomento `length` indica il numero massimo di byte che Node.js tenterà di leggere dal kernel. Tuttavia, il numero effettivo di byte letti (`bytesRead`) può essere inferiore alla `length` specificata per vari motivi.

Per esempio:

- Se il file è più corto della `length` specificata, `bytesRead` verrà impostato sul numero effettivo di byte letti.
- Se il file incontra EOF (End of File) prima che il buffer possa essere riempito, Node.js leggerà tutti i byte disponibili fino a quando non viene incontrato EOF, e il parametro `bytesRead` nel callback indicherà il numero effettivo di byte letti, che potrebbe essere inferiore alla `length` specificata.
- Se il file si trova su un `filesystem` di rete lento o incontra qualsiasi altro problema durante la lettura, `bytesRead` può essere inferiore alla `length` specificata.

Pertanto, quando si utilizza `fs.read()`, è importante controllare il valore `bytesRead` per determinare quanti byte sono stati effettivamente letti dal file. A seconda della logica dell'applicazione, potrebbe essere necessario gestire i casi in cui `bytesRead` è inferiore alla `length` specificata, ad esempio avvolgendo la chiamata di lettura in un ciclo se è necessario un numero minimo di byte.

Questo comportamento è simile alla funzione POSIX `preadv2`.


### `fs.read(fd[, options], callback)` {#fsreadfd-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.11.0, v12.17.0 | L'oggetto options può essere passato per rendere buffer, offset, length e position opzionali. |
| v13.11.0, v12.17.0 | Aggiunto in: v13.11.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) **Predefinito:** `Buffer.alloc(16384)`
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `null`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)



Simile alla funzione [`fs.read()`](/it/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback), questa versione accetta un oggetto `options` opzionale. Se non viene specificato alcun oggetto `options`, il valore predefinito sarà quello indicato sopra.


### `fs.read(fd, buffer[, options], callback)` {#fsreadfd-buffer-options-callback}

**Aggiunto in: v18.2.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Il buffer in cui verranno scritti i dati.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) **Predefinito:** `null`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)



Simile alla funzione [`fs.read()`](/it/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback), questa versione accetta un oggetto `options` opzionale. Se non viene specificato alcun oggetto `options`, verranno utilizzati i valori predefiniti sopra indicati.

### `fs.readdir(path[, options], callback)` {#fsreaddirpath-options-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.1.0, v18.17.0 | Aggiunta l'opzione `recursive`. |
| v18.0.0 | Il passaggio di una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v10.10.0 | Aggiunta una nuova opzione `withFileTypes`. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Se non viene passato, verrà generato un `TypeError` in fase di esecuzione. |
| v7.6.0 | Il parametro `path` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Se non viene passato, verrà emesso un avviso di deprecazione con ID DEP0013. |
| v6.0.0 | Aggiunto il parametro `options`. |
| v0.1.8 | Aggiunto in: v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, legge il contenuto di una directory in modo ricorsivo. In modalità ricorsiva, elencherà tutti i file, i sottofile e le directory. **Predefinito:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `files` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/it/nodejs/api/buffer#class-buffer) | [\<fs.Dirent[]\>](/it/nodejs/api/fs#class-fsdirent)



Legge il contenuto di una directory. La callback riceve due argomenti `(err, files)` dove `files` è un array dei nomi dei file nella directory esclusi `'.'` e `'..'`.

Vedere la documentazione POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) per maggiori dettagli.

L'argomento `options` opzionale può essere una stringa che specifica una codifica oppure un oggetto con una proprietà `encoding` che specifica la codifica dei caratteri da utilizzare per i nomi file passati alla callback. Se `encoding` è impostato su `'buffer'`, i nomi file restituiti verranno passati come oggetti [\<Buffer\>](/it/nodejs/api/buffer#class-buffer).

Se `options.withFileTypes` è impostato su `true`, l'array `files` conterrà oggetti [\<fs.Dirent\>](/it/nodejs/api/fs#class-fsdirent).


### `fs.readFile(path[, options], callback)` {#fsreadfilepath-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v16.0.0 | L'errore restituito può essere un `AggregateError` se viene restituito più di un errore. |
| v15.2.0, v14.17.0 | L'argomento options può includere un AbortSignal per interrompere una richiesta readFile in corso. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Non passarlo genererà un `TypeError` in fase di runtime. |
| v7.6.0 | Il parametro `path` può essere un oggetto WHATWG `URL` che utilizza il protocollo `file:`. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Non passarlo emetterà un avviso di deprecazione con ID DEP0013. |
| v5.1.0 | Il `callback` verrà sempre chiamato con `null` come parametro `error` in caso di successo. |
| v5.0.0 | Il parametro `path` può essere un descrittore di file ora. |
| v0.1.29 | Aggiunto in: v0.1.29 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) | [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nome file o descrittore di file
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `null`
    - `flag` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Vedi [supporto dei `flag` del file system](/it/nodejs/api/fs#file-system-flags). **Predefinito:** `'r'`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) consente di interrompere una readFile in corso
  
 
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
    - `data` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)
  
 

Legge in modo asincrono l'intero contenuto di un file.

```js [ESM]
import { readFile } from 'node:fs';

readFile('/etc/passwd', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```
Al callback vengono passati due argomenti `(err, data)`, dove `data` è il contenuto del file.

Se non viene specificata alcuna codifica, viene restituito il buffer raw.

Se `options` è una stringa, specifica la codifica:

```js [ESM]
import { readFile } from 'node:fs';

readFile('/etc/passwd', 'utf8', callback);
```
Quando il percorso è una directory, il comportamento di `fs.readFile()` e [`fs.readFileSync()`](/it/nodejs/api/fs#fsreadfilesyncpath-options) è specifico della piattaforma. Su macOS, Linux e Windows, verrà restituito un errore. Su FreeBSD, verrà restituita una rappresentazione del contenuto della directory.

```js [ESM]
import { readFile } from 'node:fs';

// macOS, Linux e Windows
readFile('<directory>', (err, data) => {
  // => [Error: EISDIR: illegal operation on a directory, read <directory>]
});

// FreeBSD
readFile('<directory>', (err, data) => {
  // => null, <data>
});
```
È possibile interrompere una richiesta in corso utilizzando un `AbortSignal`. Se una richiesta viene interrotta, viene chiamato il callback con un `AbortError`:

```js [ESM]
import { readFile } from 'node:fs';

const controller = new AbortController();
const signal = controller.signal;
readFile(fileInfo[0].name, { signal }, (err, buf) => {
  // ...
});
// Quando si desidera interrompere la richiesta
controller.abort();
```
La funzione `fs.readFile()` memorizza nella cache l'intero file. Per ridurre al minimo i costi di memoria, quando possibile, preferire lo streaming tramite `fs.createReadStream()`.

L'interruzione di una richiesta in corso non interrompe le singole richieste del sistema operativo, ma piuttosto il buffering interno eseguito da `fs.readFile`.


#### Descrittori di file {#file-descriptors}

#### Considerazioni sulle prestazioni {#performance-considerations}

Il metodo `fs.readFile()` legge asincronamente il contenuto di un file in memoria un blocco alla volta, consentendo al ciclo di eventi di alternare tra un blocco e l'altro. Ciò consente all'operazione di lettura di avere un impatto minore su altre attività che potrebbero utilizzare il thread pool libuv sottostante, ma significa che ci vorrà più tempo per leggere un file completo in memoria.

L'overhead di lettura aggiuntivo può variare ampiamente su diversi sistemi e dipende dal tipo di file che viene letto. Se il tipo di file non è un file normale (ad esempio una pipe) e Node.js non è in grado di determinare una dimensione effettiva del file, ogni operazione di lettura caricherà 64 KiB di dati. Per i file normali, ogni lettura elaborerà 512 KiB di dati.

Per le applicazioni che richiedono una lettura il più veloce possibile del contenuto dei file, è meglio utilizzare direttamente `fs.read()` e fare in modo che il codice dell'applicazione gestisca la lettura dell'intero contenuto del file.

L'issue di Node.js su GitHub [#25741](https://github.com/nodejs/node/issues/25741) fornisce maggiori informazioni e un'analisi dettagliata sulle prestazioni di `fs.readFile()` per file di diverse dimensioni in diverse versioni di Node.js.

### `fs.readlink(path[, options], callback)` {#fsreadlinkpath-options-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Il parametro `callback` non è più facoltativo. Non passarlo genererà un `TypeError` in fase di esecuzione. |
| v7.6.0 | Il parametro `path` può essere un oggetto WHATWG `URL` utilizzando il protocollo `file:`. |
| v7.0.0 | Il parametro `callback` non è più facoltativo. Non passarlo emetterà un avviso di deprecazione con ID DEP0013. |
| v0.1.31 | Aggiunto in: v0.1.31 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'utf8'`
  
 
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `linkString` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)
  
 

Legge il contenuto del collegamento simbolico a cui fa riferimento `path`. La callback riceve due argomenti `(err, linkString)`.

Vedere la documentazione POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2) per maggiori dettagli.

L'argomento facoltativo `options` può essere una stringa che specifica una codifica, oppure un oggetto con una proprietà `encoding` che specifica la codifica dei caratteri da utilizzare per il percorso del collegamento passato alla callback. Se `encoding` è impostato su `'buffer'`, il percorso del collegamento restituito verrà passato come oggetto [\<Buffer\>](/it/nodejs/api/buffer#class-buffer).


### `fs.readv(fd, buffers[, position], callback)` {#fsreadvfd-buffers-position-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Il passaggio di una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v13.13.0, v12.17.0 | Aggiunto in: v13.13.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)

Legge da un file specificato da `fd` e scrive in un array di `ArrayBufferView`s usando `readv()`.

`position` è l'offset dall'inizio del file da cui i dati devono essere letti. Se `typeof position !== 'number'`, i dati verranno letti dalla posizione corrente.

La callback riceverà tre argomenti: `err`, `bytesRead` e `buffers`. `bytesRead` indica quanti byte sono stati letti dal file.

Se questo metodo viene invocato come la sua versione [`util.promisify()`](/it/nodejs/api/util#utilpromisifyoriginal)ed, restituisce una promise per un `Object` con le proprietà `bytesRead` e `buffers`.

### `fs.realpath(path[, options], callback)` {#fsrealpathpath-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Il passaggio di una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Non passarlo genererà un `TypeError` in fase di esecuzione. |
| v8.0.0 | È stato aggiunto il supporto per la risoluzione di Pipe/Socket. |
| v7.6.0 | Il parametro `path` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Non passarlo emetterà un avviso di deprecazione con ID DEP0013. |
| v6.4.0 | La chiamata a `realpath` ora funziona di nuovo per vari casi limite su Windows. |
| v6.0.0 | Il parametro `cache` è stato rimosso. |
| v0.1.31 | Aggiunto in: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'utf8'`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `resolvedPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Calcola asincronamente il nome del percorso canonico risolvendo `.`, `..` e i collegamenti simbolici.

Un nome di percorso canonico non è necessariamente univoco. I collegamenti fisici e i mount di bind possono esporre un'entità del file system tramite molti nomi di percorso.

Questa funzione si comporta come [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3), con alcune eccezioni:

La `callback` ottiene due argomenti `(err, resolvedPath)`. Può utilizzare `process.cwd` per risolvere i percorsi relativi.

Sono supportati solo i percorsi che possono essere convertiti in stringhe UTF8.

L'argomento opzionale `options` può essere una stringa che specifica una codifica o un oggetto con una proprietà `encoding` che specifica la codifica dei caratteri da utilizzare per il percorso passato alla callback. Se `encoding` è impostato su `'buffer'`, il percorso restituito verrà passato come oggetto [\<Buffer\>](/it/nodejs/api/buffer#class-buffer).

Se `path` si risolve in un socket o una pipe, la funzione restituirà un nome dipendente dal sistema per quell'oggetto.

Un percorso inesistente genera un errore ENOENT. `error.path` è il percorso assoluto del file.


### `fs.realpath.native(path[, options], callback)` {#fsrealpathnativepath-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora lancia `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v9.2.0 | Aggiunto in: v9.2.0 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'utf8'`


- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `resolvedPath` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)



[`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3) asincrono.

Il `callback` riceve due argomenti `(err, resolvedPath)`.

Sono supportati solo i percorsi che possono essere convertiti in stringhe UTF8.

L'argomento facoltativo `options` può essere una stringa che specifica una codifica, o un oggetto con una proprietà `encoding` che specifica la codifica dei caratteri da utilizzare per il percorso passato al callback. Se `encoding` è impostato su `'buffer'`, il percorso restituito verrà passato come oggetto [\<Buffer\>](/it/nodejs/api/buffer#class-buffer).

Su Linux, quando Node.js è collegato a musl libc, il file system procfs deve essere montato su `/proc` affinché questa funzione funzioni. Glibc non ha questa restrizione.

### `fs.rename(oldPath, newPath, callback)` {#fsrenameoldpath-newpath-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora lancia `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Non passarlo genererà un `TypeError` in fase di esecuzione. |
| v7.6.0 | I parametri `oldPath` e `newPath` possono essere oggetti `URL` WHATWG utilizzando il protocollo `file:`. Il supporto è attualmente ancora *sperimentale*. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Non passarlo emetterà un avviso di deprecazione con id DEP0013. |
| v0.0.2 | Aggiunto in: v0.0.2 |
:::

- `oldPath` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)



Rinomina in modo asincrono il file in `oldPath` nel percorso fornito come `newPath`. Nel caso in cui `newPath` esista già, verrà sovrascritto. Se esiste una directory in `newPath`, verrà generato un errore. Nessun argomento oltre a una possibile eccezione viene fornito al callback di completamento.

Vedere anche: [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2).

```js [ESM]
import { rename } from 'node:fs';

rename('oldFile.txt', 'newFile.txt', (err) => {
  if (err) throw err;
  console.log('Rename complete!');
});
```

### `fs.rmdir(path[, options], callback)` {#fsrmdirpath-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Il passaggio di un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v16.0.0 | L'utilizzo di `fs.rmdir(path, { recursive: true })` su un `path` che è un file non è più consentito e produce un errore `ENOENT` su Windows e un errore `ENOTDIR` su POSIX. |
| v16.0.0 | L'utilizzo di `fs.rmdir(path, { recursive: true })` su un `path` che non esiste non è più consentito e produce un errore `ENOENT`. |
| v16.0.0 | L'opzione `recursive` è deprecata, il suo utilizzo attiva un avviso di deprecazione. |
| v14.14.0 | L'opzione `recursive` è deprecata, utilizzare invece `fs.rm`. |
| v13.3.0, v12.16.0 | L'opzione `maxBusyTries` è stata rinominata in `maxRetries` e il suo valore predefinito è 0. L'opzione `emfileWait` è stata rimossa e gli errori `EMFILE` utilizzano la stessa logica di ripetizione degli altri errori. L'opzione `retryDelay` è ora supportata. Gli errori `ENFILE` vengono ora ritentati. |
| v12.10.0 | Le opzioni `recursive`, `maxBusyTries` e `emfileWait` sono ora supportate. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Il mancato passaggio genererà un `TypeError` in fase di esecuzione. |
| v7.6.0 | I parametri `path` possono essere un oggetto WHATWG `URL` che utilizza il protocollo `file:`. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Il mancato passaggio emetterà un avviso di deprecazione con ID DEP0013. |
| v0.0.2 | Aggiunto in: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se si verifica un errore `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` o `EPERM`, Node.js riprova l'operazione con un'attesa di backoff lineare di `retryDelay` millisecondi più lunga ad ogni tentativo. Questa opzione rappresenta il numero di tentativi. Questa opzione viene ignorata se l'opzione `recursive` non è `true`. **Predefinito:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, esegue una rimozione ricorsiva della directory. In modalità ricorsiva, le operazioni vengono riprovate in caso di errore. **Predefinito:** `false`. **Deprecata.**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La quantità di tempo in millisecondi da attendere tra i tentativi. Questa opzione viene ignorata se l'opzione `recursive` non è `true`. **Predefinito:** `100`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)


Asincrono [`rmdir(2)`](http://man7.org/linux/man-pages/man2/rmdir.2). Nessun argomento oltre a una possibile eccezione viene fornito al callback di completamento.

L'utilizzo di `fs.rmdir()` su un file (non una directory) produce un errore `ENOENT` su Windows e un errore `ENOTDIR` su POSIX.

Per ottenere un comportamento simile al comando Unix `rm -rf`, utilizzare [`fs.rm()`](/it/nodejs/api/fs#fsrmpath-options-callback) con le opzioni `{ recursive: true, force: true }`.


### `fs.rm(path[, options], callback)` {#fsrmpath-options-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.3.0, v16.14.0 | Il parametro `path` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v14.14.0 | Aggiunto in: v14.14.0 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `force` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, le eccezioni verranno ignorate se `path` non esiste. **Predefinito:** `false`.
    - `maxRetries` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se viene rilevato un errore `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` o `EPERM`, Node.js riproverà l'operazione con un'attesa di backoff lineare di `retryDelay` millisecondi più lunga ad ogni tentativo. Questa opzione rappresenta il numero di tentativi. Questa opzione viene ignorata se l'opzione `recursive` non è `true`. **Predefinito:** `0`.
    - `recursive` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, esegue una rimozione ricorsiva. In modalità ricorsiva, le operazioni vengono riprovate in caso di errore. **Predefinito:** `false`.
    - `retryDelay` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La quantità di tempo in millisecondi da attendere tra i tentativi. Questa opzione viene ignorata se l'opzione `recursive` non è `true`. **Predefinito:** `100`.
  
 
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Rimuove asincronamente file e directory (sul modello dell'utility standard POSIX `rm`). Nessun argomento diverso da una possibile eccezione viene fornito al callback di completamento.


### `fs.stat(path[, options], callback)` {#fsstatpath-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v10.5.0 | Accetta un oggetto `options` aggiuntivo per specificare se i valori numerici restituiti devono essere bigint. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Non passarlo genererà un `TypeError` in fase di esecuzione. |
| v7.6.0 | Il parametro `path` può essere un oggetto WHATWG `URL` utilizzando il protocollo `file:`. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Non passarlo emetterà un avviso di deprecazione con ID DEP0013. |
| v0.0.2 | Aggiunto in: v0.0.2 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se i valori numerici nell'oggetto [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) restituito devono essere `bigint`. **Predefinito:** `false`.


- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats)


Asincrono [`stat(2)`](http://man7.org/linux/man-pages/man2/stat.2). La callback ottiene due argomenti `(err, stats)` dove `stats` è un oggetto [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats).

In caso di errore, `err.code` sarà uno dei [Errori di Sistema Comuni](/it/nodejs/api/errors#common-system-errors).

[`fs.stat()`](/it/nodejs/api/fs#fsstatpath-options-callback) segue i collegamenti simbolici. Usa [`fs.lstat()`](/it/nodejs/api/fs#fslstatpath-options-callback) per esaminare i collegamenti stessi.

Non è consigliabile utilizzare `fs.stat()` per verificare l'esistenza di un file prima di chiamare `fs.open()`, `fs.readFile()` o `fs.writeFile()`. Invece, il codice utente dovrebbe aprire/leggere/scrivere il file direttamente e gestire l'errore generato se il file non è disponibile.

Per verificare se un file esiste senza manipolarlo successivamente, si consiglia [`fs.access()`](/it/nodejs/api/fs#fsaccesspath-mode-callback).

Ad esempio, data la seguente struttura di directory:

```text [TEXT]
- txtDir
-- file.txt
- app.js
```
Il prossimo programma controllerà le statistiche dei percorsi forniti:

```js [ESM]
import { stat } from 'node:fs';

const pathsToCheck = ['./txtDir', './txtDir/file.txt'];

for (let i = 0; i < pathsToCheck.length; i++) {
  stat(pathsToCheck[i], (err, stats) => {
    console.log(stats.isDirectory());
    console.log(stats);
  });
}
```
L'output risultante sarà simile a:

```bash [BASH]
true
Stats {
  dev: 16777220,
  mode: 16877,
  nlink: 3,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214262,
  size: 96,
  blocks: 0,
  atimeMs: 1561174653071.963,
  mtimeMs: 1561174614583.3518,
  ctimeMs: 1561174626623.5366,
  birthtimeMs: 1561174126937.2893,
  atime: 2019-06-22T03:37:33.072Z,
  mtime: 2019-06-22T03:36:54.583Z,
  ctime: 2019-06-22T03:37:06.624Z,
  birthtime: 2019-06-22T03:28:46.937Z
}
false
Stats {
  dev: 16777220,
  mode: 33188,
  nlink: 1,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214074,
  size: 8,
  blocks: 8,
  atimeMs: 1561174616618.8555,
  mtimeMs: 1561174614584,
  ctimeMs: 1561174614583.8145,
  birthtimeMs: 1561174007710.7478,
  atime: 2019-06-22T03:36:56.619Z,
  mtime: 2019-06-22T03:36:54.584Z,
  ctime: 2019-06-22T03:36:54.584Z,
  birthtime: 2019-06-22T03:26:47.711Z
}
```

### `fs.statfs(path[, options], callback)` {#fsstatfspath-options-callback}

**Aggiunto in: v19.6.0, v18.15.0**

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se i valori numerici nell'oggetto [\<fs.StatFs\>](/it/nodejs/api/fs#class-fsstatfs) restituito devono essere `bigint`. **Predefinito:** `false`.


- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.StatFs\>](/it/nodejs/api/fs#class-fsstatfs)



Asincrono [`statfs(2)`](http://man7.org/linux/man-pages/man2/statfs.2). Restituisce informazioni sul file system montato che contiene `path`. La callback riceve due argomenti `(err, stats)` dove `stats` è un oggetto [\<fs.StatFs\>](/it/nodejs/api/fs#class-fsstatfs).

In caso di errore, `err.code` sarà uno tra gli [Errori di sistema comuni](/it/nodejs/api/errors#common-system-errors).

### `fs.symlink(target, path[, type], callback)` {#fssymlinktarget-path-type-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v12.0.0 | Se l'argomento `type` viene lasciato indefinito, Node rileverà automaticamente il tipo di `target` e selezionerà automaticamente `dir` o `file`. |
| v7.6.0 | I parametri `target` e `path` possono essere oggetti WHATWG `URL` utilizzando il protocollo `file:`. Il supporto è attualmente ancora *sperimentale*. |
| v0.1.31 | Aggiunto in: v0.1.31 |
:::

- `target` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `type` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `null`
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)



Crea il collegamento chiamato `path` che punta a `target`. Nessun argomento diverso da una possibile eccezione viene fornito alla callback di completamento.

Vedere la documentazione POSIX [`symlink(2)`](http://man7.org/linux/man-pages/man2/symlink.2) per maggiori dettagli.

L'argomento `type` è disponibile solo su Windows e ignorato su altre piattaforme. Può essere impostato su `'dir'`, `'file'` o `'junction'`. Se l'argomento `type` è `null`, Node.js rileverà automaticamente il tipo di `target` e utilizzerà `'file'` o `'dir'`. Se `target` non esiste, verrà utilizzato `'file'`. I junction point di Windows richiedono che il percorso di destinazione sia assoluto. Quando si utilizza `'junction'`, l'argomento `target` verrà automaticamente normalizzato al percorso assoluto. I junction point sui volumi NTFS possono puntare solo a directory.

I target relativi sono relativi alla directory principale del collegamento.

```js [ESM]
import { symlink } from 'node:fs';

symlink('./mew', './mewtwo', callback);
```
L'esempio sopra crea un collegamento simbolico `mewtwo` che punta a `mew` nella stessa directory:

```bash [BASH]
$ tree .
.
├── mew
└── mewtwo -> ./mew
```

### `fs.truncate(path[, len], callback)` {#fstruncatepath-len-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Il passaggio di una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v16.0.0 | L'errore restituito potrebbe essere un `AggregateError` se vengono restituiti più errori. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Il mancato passaggio genererà un `TypeError` in fase di esecuzione. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Il mancato passaggio emetterà un avviso di deprecazione con ID DEP0013. |
| v0.8.6 | Aggiunto in: v0.8.6 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0`
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)

Tronca il file. Alla callback di completamento non vengono forniti argomenti diversi da una possibile eccezione. Come primo argomento può essere passato anche un descrittore di file. In questo caso, viene chiamato `fs.ftruncate()`.

::: code-group
```js [ESM]
import { truncate } from 'node:fs';
// Supponendo che 'path/file.txt' sia un file normale.
truncate('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt è stato troncato');
});
```

```js [CJS]
const { truncate } = require('node:fs');
// Supponendo che 'path/file.txt' sia un file normale.
truncate('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt è stato troncato');
});
```
:::

Il passaggio di un descrittore di file è deprecato e potrebbe comportare la generazione di un errore in futuro.

Consulta la documentazione POSIX [`truncate(2)`](http://man7.org/linux/man-pages/man2/truncate.2) per maggiori dettagli.


### `fs.unlink(path, callback)` {#fsunlinkpath-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Non passarlo genererà un `TypeError` in fase di esecuzione. |
| v7.6.0 | Il parametro `path` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Non passarlo emetterà un avviso di deprecazione con l'ID DEP0013. |
| v0.0.2 | Aggiunto in: v0.0.2 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Rimuove asincronamente un file o un collegamento simbolico. Nessun argomento oltre a una possibile eccezione viene fornito al callback di completamento.

```js [ESM]
import { unlink } from 'node:fs';
// Supponendo che 'path/file.txt' sia un file normale.
unlink('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt è stato eliminato');
});
```

`fs.unlink()` non funzionerà su una directory, vuota o meno. Per rimuovere una directory, utilizzare [`fs.rmdir()`](/it/nodejs/api/fs#fsrmdirpath-options-callback).

Vedere la documentazione POSIX [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2) per maggiori dettagli.

### `fs.unwatchFile(filename[, listener])` {#fsunwatchfilefilename-listener}

**Aggiunto in: v0.1.31**

- `filename` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `listener` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Opzionale, un listener precedentemente allegato utilizzando `fs.watchFile()`

Smetti di monitorare le modifiche su `filename`. Se `listener` è specificato, viene rimosso solo quel particolare listener. Altrimenti, *tutti* i listener vengono rimossi, interrompendo di fatto il monitoraggio di `filename`.

Chiamare `fs.unwatchFile()` con un nome file che non viene monitorato è un no-op, non un errore.

L'utilizzo di [`fs.watch()`](/it/nodejs/api/fs#fswatchfilename-options-listener) è più efficiente di `fs.watchFile()` e `fs.unwatchFile()`. `fs.watch()` dovrebbe essere utilizzato invece di `fs.watchFile()` e `fs.unwatchFile()` quando possibile.


### `fs.utimes(path, atime, mtime, callback)` {#fsutimespath-atime-mtime-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Non passarlo genererà un `TypeError` in fase di runtime. |
| v8.0.0 | `NaN`, `Infinity` e `-Infinity` non sono più specificatori di tempo validi. |
| v7.6.0 | Il parametro `path` può essere un oggetto WHATWG `URL` che utilizza il protocollo `file:`. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Non passarlo emetterà un avviso di deprecazione con ID DEP0013. |
| v4.1.0 | Le stringhe numeriche, `NaN` e `Infinity` sono ora specificatori di tempo consentiti. |
| v0.4.2 | Aggiunto in: v0.4.2 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Modifica i timestamp del file system dell'oggetto a cui fa riferimento `path`.

Gli argomenti `atime` e `mtime` seguono queste regole:

- I valori possono essere numeri che rappresentano l'ora Unix epoch in secondi, `Date` o una stringa numerica come `'123456789.0'`.
- Se il valore non può essere convertito in un numero, o è `NaN`, `Infinity` o `-Infinity`, verrà generato un `Error`.


### `fs.watch(filename[, options][, listener])` {#fswatchfilename-options-listener}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.1.0 | Aggiunto il supporto ricorsivo per Linux, AIX e IBMi. |
| v15.9.0, v14.17.0 | Aggiunto il supporto per la chiusura del watcher con un AbortSignal. |
| v7.6.0 | Il parametro `filename` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v7.0.0 | L'oggetto `options` passato non verrà mai modificato. |
| v0.5.10 | Aggiunto in: v0.5.10 |
:::

- `filename` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se il processo deve continuare a essere eseguito finché i file vengono osservati. **Predefinito:** `true`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se tutte le sottodirectory devono essere osservate o solo la directory corrente. Questo si applica quando viene specificata una directory e solo su piattaforme supportate (vedere [avvertenze](/it/nodejs/api/fs#caveats)). **Predefinito:** `false`.
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Specifica la codifica dei caratteri da utilizzare per il nome file passato al listener. **Predefinito:** `'utf8'`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) consente di chiudere il watcher con un AbortSignal.


- `listener` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) **Predefinito:** `undefined`
    - `eventType` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)


- Restituisce: [\<fs.FSWatcher\>](/it/nodejs/api/fs#class-fsfswatcher)

Osserva le modifiche su `filename`, dove `filename` è un file o una directory.

Il secondo argomento è opzionale. Se `options` viene fornito come stringa, specifica la `encoding`. Altrimenti `options` deve essere passato come oggetto.

Il callback del listener riceve due argomenti `(eventType, filename)`. `eventType` è `'rename'` o `'change'` e `filename` è il nome del file che ha attivato l'evento.

Sulla maggior parte delle piattaforme, `'rename'` viene emesso ogni volta che un nome file appare o scompare nella directory.

Il callback del listener è collegato all'evento `'change'` generato da [\<fs.FSWatcher\>](/it/nodejs/api/fs#class-fsfswatcher), ma non è la stessa cosa del valore `'change'` di `eventType`.

Se viene passato un `signal`, l'interruzione del corrispondente AbortController chiuderà il [\<fs.FSWatcher\>](/it/nodejs/api/fs#class-fsfswatcher) restituito.


#### Avvertenze {#caveats}

L'API `fs.watch` non è coerente al 100% tra le diverse piattaforme e non è disponibile in alcune situazioni.

Su Windows, non verranno emessi eventi se la directory osservata viene spostata o rinominata. Viene segnalato un errore `EPERM` quando la directory osservata viene eliminata.

##### Disponibilità {#availability}

Questa funzionalità dipende dal sistema operativo sottostante che fornisce un modo per essere avvisati delle modifiche al file system.

- Sui sistemi Linux, questo utilizza [`inotify(7)`](https://man7.org/linux/man-pages/man7/inotify.7).
- Sui sistemi BSD, questo utilizza [`kqueue(2)`](https://www.freebsd.org/cgi/man.cgi?query=kqueue&sektion=2).
- Su macOS, questo utilizza [`kqueue(2)`](https://www.freebsd.org/cgi/man.cgi?query=kqueue&sektion=2) per i file e [`FSEvents`](https://developer.apple.com/documentation/coreservices/file_system_events) per le directory.
- Sui sistemi SunOS (inclusi Solaris e SmartOS), questo utilizza [`event ports`](https://illumos.org/man/port_create).
- Sui sistemi Windows, questa funzionalità dipende da [`ReadDirectoryChangesW`](https://docs.microsoft.com/en-us/windows/desktop/api/winbase/nf-winbase-readdirectorychangesw).
- Sui sistemi AIX, questa funzionalità dipende da [`AHAFS`](https://developer.ibm.com/articles/au-aix_event_infrastructure/), che deve essere abilitato.
- Sui sistemi IBM i, questa funzionalità non è supportata.

Se la funzionalità sottostante non è disponibile per qualche motivo, allora `fs.watch()` non sarà in grado di funzionare e potrebbe generare un'eccezione. Ad esempio, l'osservazione di file o directory può essere inaffidabile e, in alcuni casi, impossibile, sui file system di rete (NFS, SMB, ecc.) o sui file system host quando si utilizza software di virtualizzazione come Vagrant o Docker.

È ancora possibile utilizzare `fs.watchFile()`, che utilizza il polling stat, ma questo metodo è più lento e meno affidabile.

##### Inodes {#inodes}

Sui sistemi Linux e macOS, `fs.watch()` risolve il percorso in un [inode](https://en.wikipedia.org/wiki/Inode) e osserva l'inode. Se il percorso osservato viene eliminato e ricreato, gli viene assegnato un nuovo inode. L'osservazione emetterà un evento per l'eliminazione, ma continuerà a osservare l'inode *originale*. Gli eventi per il nuovo inode non verranno emessi. Questo è il comportamento previsto.

I file AIX conservano lo stesso inode per tutta la durata di un file. Il salvataggio e la chiusura di un file osservato su AIX comporteranno due notifiche (una per l'aggiunta di nuovi contenuti e una per la troncamento).


##### Argomento filename {#filename-argument}

Fornire l'argomento `filename` nella callback è supportato solo su Linux, macOS, Windows e AIX. Anche sulle piattaforme supportate, non è sempre garantito che `filename` venga fornito. Pertanto, non dare per scontato che l'argomento `filename` sia sempre fornito nella callback e prevedere una logica di fallback nel caso in cui sia `null`.

```js [ESM]
import { watch } from 'node:fs';
watch('somedir', (eventType, filename) => {
  console.log(`event type is: ${eventType}`);
  if (filename) {
    console.log(`filename provided: ${filename}`);
  } else {
    console.log('filename not provided');
  }
});
```
### `fs.watchFile(filename[, options], listener)` {#fswatchfilefilename-options-listener}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.5.0 | L'opzione `bigint` è ora supportata. |
| v7.6.0 | Il parametro `filename` può essere un oggetto WHATWG `URL` che utilizza il protocollo `file:`. |
| v0.1.31 | Aggiunto in: v0.1.31 |
:::

- `filename` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `false`
    - `persistent` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `true`
    - `interval` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `5007`
  
 
- `listener` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `current` [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats)
    - `previous` [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats)
  
 
- Restituisce: [\<fs.StatWatcher\>](/it/nodejs/api/fs#class-fsstatwatcher)

Osserva le modifiche su `filename`. La callback `listener` verrà chiamata ogni volta che si accede al file.

L'argomento `options` può essere omesso. Se fornito, dovrebbe essere un oggetto. L'oggetto `options` può contenere un booleano denominato `persistent` che indica se il processo deve continuare a essere eseguito finché i file sono sotto osservazione. L'oggetto `options` può specificare una proprietà `interval` che indica la frequenza con cui il target deve essere sottoposto a polling in millisecondi.

Il `listener` riceve due argomenti, l'oggetto stat corrente e l'oggetto stat precedente:

```js [ESM]
import { watchFile } from 'node:fs';

watchFile('message.text', (curr, prev) => {
  console.log(`the current mtime is: ${curr.mtime}`);
  console.log(`the previous mtime was: ${prev.mtime}`);
});
```
Questi oggetti stat sono istanze di `fs.Stat`. Se l'opzione `bigint` è `true`, i valori numerici in questi oggetti sono specificati come `BigInt`.

Per essere avvisati quando il file è stato modificato, non solo quando vi si è acceduto, è necessario confrontare `curr.mtimeMs` e `prev.mtimeMs`.

Quando un'operazione `fs.watchFile` genera un errore `ENOENT`, invocherà il listener una volta, con tutti i campi azzerati (o, per le date, l'Epoch Unix). Se il file viene creato in seguito, il listener verrà richiamato, con gli oggetti stat più recenti. Questo è un cambiamento nella funzionalità dalla v0.10.

L'utilizzo di [`fs.watch()`](/it/nodejs/api/fs#fswatchfilename-options-listener) è più efficiente di `fs.watchFile` e `fs.unwatchFile`. `fs.watch` dovrebbe essere utilizzato al posto di `fs.watchFile` e `fs.unwatchFile` quando possibile.

Quando un file osservato da `fs.watchFile()` scompare e riappare, il contenuto di `previous` nel secondo evento di callback (la riapparizione del file) sarà lo stesso del contenuto di `previous` nel primo evento di callback (la sua scomparsa).

Questo accade quando:

- il file viene eliminato, seguito da un ripristino
- il file viene rinominato e quindi rinominato una seconda volta con il suo nome originale


### `fs.write(fd, buffer, offset[, length[, position]], callback)` {#fswritefd-buffer-offset-length-position-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v14.0.0 | Il parametro `buffer` non forzerà più l'input non supportato a stringhe. |
| v10.10.0 | Il parametro `buffer` ora può essere qualsiasi `TypedArray` o una `DataView`. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Non passarlo genererà un `TypeError` in fase di esecuzione. |
| v7.4.0 | Il parametro `buffer` ora può essere un `Uint8Array`. |
| v7.2.0 | I parametri `offset` e `length` ora sono opzionali. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Non passarlo emetterà un avviso di deprecazione con id DEP0013. |
| v0.0.2 | Aggiunto in: v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

Scrive `buffer` nel file specificato da `fd`.

`offset` determina la parte del buffer da scrivere e `length` è un numero intero che specifica il numero di byte da scrivere.

`position` si riferisce all'offset dall'inizio del file in cui questi dati devono essere scritti. Se `typeof position !== 'number'`, i dati verranno scritti nella posizione corrente. Vedi [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2).

Il callback riceverà tre argomenti `(err, bytesWritten, buffer)` dove `bytesWritten` specifica quanti *byte* sono stati scritti da `buffer`.

Se questo metodo viene richiamato come sua versione [`util.promisify()`](/it/nodejs/api/util#utilpromisifyoriginal)ed, restituisce una promise per un `Object` con le proprietà `bytesWritten` e `buffer`.

Non è sicuro utilizzare `fs.write()` più volte sullo stesso file senza attendere il callback. Per questo scenario, si consiglia [`fs.createWriteStream()`](/it/nodejs/api/fs#fscreatewritestreampath-options).

Su Linux, le scritture posizionali non funzionano quando il file viene aperto in modalità append. Il kernel ignora l'argomento position e aggiunge sempre i dati alla fine del file.


### `fs.write(fd, buffer[, options], callback)` {#fswritefd-buffer-options-callback}

**Aggiunto in: v18.3.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `null`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
  
 

Scrive `buffer` nel file specificato da `fd`.

Simile alla funzione `fs.write` di cui sopra, questa versione accetta un oggetto `options` opzionale. Se non viene specificato alcun oggetto `options`, verrà impostato di default con i valori di cui sopra.

### `fs.write(fd, string[, position[, encoding]], callback)` {#fswritefd-string-position-encoding-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Passare al parametro `string` un oggetto con una funzione `toString` propria non è più supportato. |
| v17.8.0 | Passare al parametro `string` un oggetto con una funzione `toString` propria è deprecato. |
| v14.12.0 | Il parametro `string` stringherà un oggetto con una funzione `toString` esplicita. |
| v14.0.0 | Il parametro `string` non forzerà più l'input non supportato alle stringhe. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Non passarlo genererà un `TypeError` in fase di esecuzione. |
| v7.2.0 | Il parametro `position` ora è opzionale. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Non passarlo emetterà un avviso di deprecazione con ID DEP0013. |
| v0.11.5 | Aggiunto in: v0.11.5 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `written` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

Scrive `string` nel file specificato da `fd`. Se `string` non è una stringa, viene generata un'eccezione.

`position` si riferisce all'offset dall'inizio del file in cui devono essere scritti questi dati. Se `typeof position !== 'number'`, i dati verranno scritti nella posizione corrente. Vedi [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2).

`encoding` è la codifica di stringa prevista.

La callback riceverà gli argomenti `(err, written, string)` dove `written` specifica quanti *byte* la stringa passata richiedeva di essere scritta. I byte scritti non sono necessariamente gli stessi dei caratteri stringa scritti. Vedi [`Buffer.byteLength`](/it/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding).

Non è sicuro utilizzare `fs.write()` più volte sullo stesso file senza attendere la callback. Per questo scenario, si consiglia [`fs.createWriteStream()`](/it/nodejs/api/fs#fscreatewritestreampath-options).

Su Linux, le scritture posizionali non funzionano quando il file è aperto in modalità di aggiunta. Il kernel ignora l'argomento posizione e aggiunge sempre i dati alla fine del file.

Su Windows, se il descrittore del file è connesso alla console (ad esempio `fd == 1` o `stdout`), una stringa contenente caratteri non ASCII non verrà visualizzata correttamente per impostazione predefinita, indipendentemente dalla codifica utilizzata. È possibile configurare la console per visualizzare correttamente UTF-8 modificando la tabella codici attiva con il comando `chcp 65001`. Consulta la documentazione di [chcp](https://ss64.com/nt/chcp) per maggiori dettagli.


### `fs.writeFile(file, data[, options], callback)` {#fswritefilefile-data-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.0.0, v20.10.0 | L'opzione `flush` è ora supportata. |
| v19.0.0 | Passare al parametro `string` un oggetto con una funzione `toString` di proprietà non è più supportato. |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v17.8.0 | Passare al parametro `string` un oggetto con una funzione `toString` di proprietà è deprecato. |
| v16.0.0 | L'errore restituito potrebbe essere un `AggregateError` se viene restituito più di un errore. |
| v15.2.0, v14.17.0 | L'argomento options può includere un AbortSignal per interrompere una richiesta writeFile in corso. |
| v14.12.0 | Il parametro `data` trasformerà in stringa un oggetto con una funzione `toString` esplicita. |
| v14.0.0 | Il parametro `data` non forzerà più l'input non supportato in stringhe. |
| v10.10.0 | Il parametro `data` ora può essere qualsiasi `TypedArray` o `DataView`. |
| v10.0.0 | Il parametro `callback` non è più opzionale. Non passarlo genererà un `TypeError` in fase di runtime. |
| v7.4.0 | Il parametro `data` ora può essere un `Uint8Array`. |
| v7.0.0 | Il parametro `callback` non è più opzionale. Non passarlo emetterà un avviso di deprecazione con ID DEP0013. |
| v5.0.0 | Il parametro `file` ora può essere un descrittore di file. |
| v0.1.29 | Aggiunto in: v0.1.29 |
:::

- `file` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) | [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nome file o descrittore di file
- `data` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `'utf8'`
    - `mode` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0o666`
    - `flag` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Vedi [supporto dei `flag` del file system](/it/nodejs/api/fs#file-system-flags). **Predefinito:** `'w'`.
    - `flush` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se tutti i dati vengono scritti correttamente nel file e `flush` è `true`, viene utilizzato `fs.fsync()` per scaricare i dati. **Predefinito:** `false`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) consente di interrompere un writeFile in corso

- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)

Quando `file` è un nome file, scrive in modo asincrono i dati nel file, sostituendo il file se esiste già. `data` può essere una stringa o un buffer.

Quando `file` è un descrittore di file, il comportamento è simile alla chiamata diretta di `fs.write()` (che è consigliata). Vedi le note seguenti sull'utilizzo di un descrittore di file.

L'opzione `encoding` viene ignorata se `data` è un buffer.

L'opzione `mode` influisce solo sul file appena creato. Vedi [`fs.open()`](/it/nodejs/api/fs#fsopenpath-flags-mode-callback) per maggiori dettagli.

```js [ESM]
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
```
Se `options` è una stringa, specifica la codifica:

```js [ESM]
import { writeFile } from 'node:fs';

writeFile('message.txt', 'Hello Node.js', 'utf8', callback);
```
Non è sicuro utilizzare `fs.writeFile()` più volte sullo stesso file senza attendere il callback. Per questo scenario, si consiglia [`fs.createWriteStream()`](/it/nodejs/api/fs#fscreatewritestreampath-options).

Similmente a `fs.readFile` - `fs.writeFile` è un metodo di convenienza che esegue internamente più chiamate `write` per scrivere il buffer passato ad esso. Per codice sensibile alle prestazioni, si consiglia di utilizzare [`fs.createWriteStream()`](/it/nodejs/api/fs#fscreatewritestreampath-options).

È possibile utilizzare un [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) per annullare un `fs.writeFile()`. L'annullamento è "il meglio che si può fare" ed è probabile che venga scritta ancora una certa quantità di dati.

```js [ESM]
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const controller = new AbortController();
const { signal } = controller;
const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, { signal }, (err) => {
  // When a request is aborted - the callback is called with an AbortError
});
// When the request should be aborted
controller.abort();
```
L'interruzione di una richiesta in corso non interrompe le singole richieste del sistema operativo, ma piuttosto il buffering interno eseguito da `fs.writeFile`.


#### Utilizzo di `fs.writeFile()` con descrittori di file {#using-fswritefile-with-file-descriptors}

Quando `file` è un descrittore di file, il comportamento è quasi identico alla chiamata diretta di `fs.write()` come:

```js [ESM]
import { write } from 'node:fs';
import { Buffer } from 'node:buffer';

write(fd, Buffer.from(data, options.encoding), callback);
```
La differenza rispetto alla chiamata diretta di `fs.write()` è che in alcune condizioni insolite, `fs.write()` potrebbe scrivere solo una parte del buffer e potrebbe essere necessario riprovare a scrivere i dati rimanenti, mentre `fs.writeFile()` riprova fino a quando i dati non sono interamente scritti (o si verifica un errore).

Le implicazioni di ciò sono una fonte comune di confusione. Nel caso del descrittore di file, il file non viene sostituito! I dati non vengono necessariamente scritti all'inizio del file e i dati originali del file possono rimanere prima e/o dopo i dati appena scritti.

Ad esempio, se `fs.writeFile()` viene chiamato due volte di seguito, prima per scrivere la stringa `'Hello'`, poi per scrivere la stringa `', World'`, il file conterrebbe `'Hello, World'` e potrebbe contenere alcuni dei dati originali del file (a seconda delle dimensioni del file originale e della posizione del descrittore di file). Se fosse stato utilizzato un nome file anziché un descrittore, sarebbe stato garantito che il file contenesse solo `', World'`.

### `fs.writev(fd, buffers[, position], callback)` {#fswritevfd-buffers-position-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v12.9.0 | Aggiunto in: v12.9.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
  
 

Scrive un array di `ArrayBufferView` nel file specificato da `fd` usando `writev()`.

`position` è l'offset dall'inizio del file in cui devono essere scritti questi dati. Se `typeof position !== 'number'`, i dati verranno scritti nella posizione corrente.

Il callback riceverà tre argomenti: `err`, `bytesWritten` e `buffers`. `bytesWritten` indica quanti byte sono stati scritti da `buffers`.

Se questo metodo è [`util.promisify()`](/it/nodejs/api/util#utilpromisifyoriginal)ed, restituisce una promise per un `Object` con proprietà `bytesWritten` e `buffers`.

Non è sicuro utilizzare `fs.writev()` più volte sullo stesso file senza attendere il callback. Per questo scenario, utilizzare [`fs.createWriteStream()`](/it/nodejs/api/fs#fscreatewritestreampath-options).

Su Linux, le scritture posizionali non funzionano quando il file viene aperto in modalità append. Il kernel ignora l'argomento position e aggiunge sempre i dati alla fine del file.


## API Sincrone {#synchronous-api}

Le API sincrone eseguono tutte le operazioni in modo sincrono, bloccando il ciclo di eventi fino a quando l'operazione non viene completata o fallisce.

### `fs.accessSync(path[, mode])` {#fsaccesssyncpath-mode}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v7.6.0 | Il parametro `path` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v0.11.15 | Aggiunta in: v0.11.15 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `fs.constants.F_OK`

Verifica in modo sincrono le autorizzazioni di un utente per il file o la directory specificati da `path`. L'argomento `mode` è un numero intero opzionale che specifica i controlli di accessibilità da eseguire. `mode` deve essere il valore `fs.constants.F_OK` o una maschera composta dall'OR bit a bit di uno qualsiasi tra `fs.constants.R_OK`, `fs.constants.W_OK` e `fs.constants.X_OK` (ad es. `fs.constants.W_OK | fs.constants.R_OK`). Controlla [Costanti di accesso ai file](/it/nodejs/api/fs#file-access-constants) per i possibili valori di `mode`.

Se uno qualsiasi dei controlli di accessibilità fallisce, verrà generato un `Error`. Altrimenti, il metodo restituirà `undefined`.

```js [ESM]
import { accessSync, constants } from 'node:fs';

try {
  accessSync('etc/passwd', constants.R_OK | constants.W_OK);
  console.log('può leggere/scrivere');
} catch (err) {
  console.error('nessun accesso!');
}
```
### `fs.appendFileSync(path, data[, options])` {#fsappendfilesyncpath-data-options}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.1.0, v20.10.0 | L'opzione `flush` è ora supportata. |
| v7.0.0 | L'oggetto `options` passato non verrà mai modificato. |
| v5.0.0 | Il parametro `file` può ora essere un descrittore di file. |
| v0.6.7 | Aggiunta in: v0.6.7 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) | [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nome file o descrittore di file
- `data` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `'utf8'`
    - `mode` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0o666`
    - `flag` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Vedi [supporto dei `flag` del file system](/it/nodejs/api/fs#file-system-flags). **Predefinito:** `'a'`.
    - `flush` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, il descrittore di file sottostante viene scaricato prima di essere chiuso. **Predefinito:** `false`.
  
 

Aggiunge in modo sincrono i dati a un file, creando il file se non esiste ancora. `data` può essere una stringa o un [\<Buffer\>](/it/nodejs/api/buffer#class-buffer).

L'opzione `mode` influisce solo sul file appena creato. Vedi [`fs.open()`](/it/nodejs/api/fs#fsopenpath-flags-mode-callback) per maggiori dettagli.

```js [ESM]
import { appendFileSync } from 'node:fs';

try {
  appendFileSync('message.txt', 'data to append');
  console.log('I "dati da aggiungere" sono stati aggiunti al file!');
} catch (err) {
  /* Gestisci l'errore */
}
```
Se `options` è una stringa, allora specifica la codifica:

```js [ESM]
import { appendFileSync } from 'node:fs';

appendFileSync('message.txt', 'data to append', 'utf8');
```
Il `path` può essere specificato come un descrittore di file numerico che è stato aperto per l'aggiunta (usando `fs.open()` o `fs.openSync()`). Il descrittore di file non verrà chiuso automaticamente.

```js [ESM]
import { openSync, closeSync, appendFileSync } from 'node:fs';

let fd;

try {
  fd = openSync('message.txt', 'a');
  appendFileSync(fd, 'data to append', 'utf8');
} catch (err) {
  /* Gestisci l'errore */
} finally {
  if (fd !== undefined)
    closeSync(fd);
}
```

### `fs.chmodSync(path, mode)` {#fschmodsyncpath-mode}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v7.6.0 | Il parametro `path` può essere un oggetto `URL` WHATWG utilizzando il protocollo `file:`. |
| v0.6.7 | Aggiunto in: v0.6.7 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Per informazioni dettagliate, consulta la documentazione della versione asincrona di questa API: [`fs.chmod()`](/it/nodejs/api/fs#fschmodpath-mode-callback).

Vedi la documentazione POSIX [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2) per maggiori dettagli.

### `fs.chownSync(path, uid, gid)` {#fschownsyncpath-uid-gid}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v7.6.0 | Il parametro `path` può essere un oggetto `URL` WHATWG utilizzando il protocollo `file:`. |
| v0.1.97 | Aggiunto in: v0.1.97 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Cambia in modo sincrono il proprietario e il gruppo di un file. Restituisce `undefined`. Questa è la versione sincrona di [`fs.chown()`](/it/nodejs/api/fs#fschownpath-uid-gid-callback).

Vedi la documentazione POSIX [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2) per maggiori dettagli.

### `fs.closeSync(fd)` {#fsclosesyncfd}

**Aggiunto in: v0.1.21**

- `fd` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Chiude il descrittore del file. Restituisce `undefined`.

La chiamata a `fs.closeSync()` su qualsiasi descrittore di file (`fd`) che è attualmente in uso tramite qualsiasi altra operazione `fs` può portare a un comportamento non definito.

Vedi la documentazione POSIX [`close(2)`](http://man7.org/linux/man-pages/man2/close.2) per maggiori dettagli.


### `fs.copyFileSync(src, dest[, mode])` {#fscopyfilesyncsrc-dest-mode}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.0.0 | Modificato l'argomento `flags` in `mode` e imposta una validazione del tipo più rigorosa. |
| v8.5.0 | Aggiunto in: v8.5.0 |
:::

- `src` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) nome del file sorgente da copiare
- `dest` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) nome del file di destinazione dell'operazione di copia
- `mode` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) modificatori per l'operazione di copia. **Predefinito:** `0`.

Copia sincrona da `src` a `dest`. Per impostazione predefinita, `dest` viene sovrascritto se esiste già. Restituisce `undefined`. Node.js non offre garanzie sull'atomicità dell'operazione di copia. Se si verifica un errore dopo che il file di destinazione è stato aperto per la scrittura, Node.js tenterà di rimuovere la destinazione.

`mode` è un numero intero opzionale che specifica il comportamento dell'operazione di copia. È possibile creare una maschera costituita dall'OR bit a bit di due o più valori (ad es. `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`).

- `fs.constants.COPYFILE_EXCL`: L'operazione di copia avrà esito negativo se `dest` esiste già.
- `fs.constants.COPYFILE_FICLONE`: L'operazione di copia tenterà di creare un reflink copy-on-write. Se la piattaforma non supporta copy-on-write, viene utilizzato un meccanismo di copia di fallback.
- `fs.constants.COPYFILE_FICLONE_FORCE`: L'operazione di copia tenterà di creare un reflink copy-on-write. Se la piattaforma non supporta copy-on-write, l'operazione avrà esito negativo.

```js [ESM]
import { copyFileSync, constants } from 'node:fs';

// destination.txt verrà creato o sovrascritto per impostazione predefinita.
copyFileSync('source.txt', 'destination.txt');
console.log('source.txt è stato copiato in destination.txt');

// Utilizzando COPYFILE_EXCL, l'operazione fallirà se destination.txt esiste.
copyFileSync('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
```

### `fs.cpSync(src, dest[, options])` {#fscpsyncsrc-dest-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.3.0 | Questa API non è più sperimentale. |
| v20.1.0, v18.17.0 | Accetta un'opzione `mode` aggiuntiva per specificare il comportamento di copia come l'argomento `mode` di `fs.copyFile()`. |
| v17.6.0, v16.15.0 | Accetta un'opzione `verbatimSymlinks` aggiuntiva per specificare se eseguire la risoluzione del percorso per i collegamenti simbolici. |
| v16.7.0 | Aggiunta in: v16.7.0 |
:::

- `src` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) percorso di origine da copiare.
- `dest` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) percorso di destinazione in cui copiare.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) dereferenzia i collegamenti simbolici. **Predefinito:** `false`.
    - `errorOnExist` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) quando `force` è `false` e la destinazione esiste, genera un errore. **Predefinito:** `false`.
    - `filter` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funzione per filtrare i file/directory copiati. Restituisce `true` per copiare l'elemento, `false` per ignorarlo. Quando si ignora una directory, anche tutto il suo contenuto verrà saltato. **Predefinito:** `undefined`
    - `src` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) percorso di origine da copiare.
    - `dest` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) percorso di destinazione in cui copiare.
    - Restituisce: [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Qualsiasi valore non `Promise` che possa essere forzato a `boolean`.
  
 
    - `force` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) sovrascrive il file o la directory esistente. L'operazione di copia ignorerà gli errori se si imposta questo valore su false e la destinazione esiste. Utilizzare l'opzione `errorOnExist` per modificare questo comportamento. **Predefinito:** `true`.
    - `mode` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) modificatori per l'operazione di copia. **Predefinito:** `0`. Vedere il flag `mode` di [`fs.copyFileSync()`](/it/nodejs/api/fs#fscopyfilesyncsrc-dest-mode).
    - `preserveTimestamps` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true` i timestamp da `src` verranno conservati. **Predefinito:** `false`.
    - `recursive` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) copia le directory in modo ricorsivo **Predefinito:** `false`
    - `verbatimSymlinks` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, la risoluzione del percorso per i collegamenti simbolici verrà saltata. **Predefinito:** `false`
  
 

Copia in modo sincrono l'intera struttura di directory da `src` a `dest`, incluse sottodirectory e file.

Quando si copia una directory in un'altra directory, i caratteri jolly non sono supportati e il comportamento è simile a `cp dir1/ dir2/`.


### `fs.existsSync(path)` {#fsexistssyncpath}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v7.6.0 | Il parametro `path` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v0.1.21 | Aggiunto in: v0.1.21 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- Restituisce: [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il percorso esiste, `false` altrimenti.

Per informazioni dettagliate, vedere la documentazione della versione asincrona di questa API: [`fs.exists()`](/it/nodejs/api/fs#fsexistspath-callback).

`fs.exists()` è deprecato, ma `fs.existsSync()` non lo è. Il parametro `callback` per `fs.exists()` accetta parametri che sono incoerenti con altre callback di Node.js. `fs.existsSync()` non utilizza una callback.

```js [ESM]
import { existsSync } from 'node:fs';

if (existsSync('/etc/passwd'))
  console.log('Il percorso esiste.');
```
### `fs.fchmodSync(fd, mode)` {#fsfchmodsyncfd-mode}

**Aggiunto in: v0.4.7**

- `fd` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `mode` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Imposta le autorizzazioni sul file. Restituisce `undefined`.

Vedere la documentazione POSIX [`fchmod(2)`](http://man7.org/linux/man-pages/man2/fchmod.2) per maggiori dettagli.

### `fs.fchownSync(fd, uid, gid)` {#fsfchownsyncfd-uid-gid}

**Aggiunto in: v0.4.7**

- `fd` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `uid` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID utente del nuovo proprietario del file.
- `gid` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID gruppo del nuovo gruppo del file.

Imposta il proprietario del file. Restituisce `undefined`.

Vedere la documentazione POSIX [`fchown(2)`](http://man7.org/linux/man-pages/man2/fchown.2) per maggiori dettagli.


### `fs.fdatasyncSync(fd)` {#fsfdatasyncsyncfd}

**Aggiunto in: v0.1.96**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Forza tutte le operazioni di I/O attualmente in coda associate al file allo stato di completamento I/O sincronizzato del sistema operativo. Fare riferimento alla documentazione POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2) per i dettagli. Restituisce `undefined`.

### `fs.fstatSync(fd[, options])` {#fsfstatsyncfd-options}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.5.0 | Accetta un oggetto `options` aggiuntivo per specificare se i valori numerici restituiti devono essere bigint. |
| v0.1.95 | Aggiunto in: v0.1.95 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se i valori numerici nell'oggetto [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) restituito devono essere `bigint`. **Predefinito:** `false`.
  
 
- Restituisce: [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats)

Recupera [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) per il descrittore di file.

Per maggiori dettagli, vedere la documentazione POSIX [`fstat(2)`](http://man7.org/linux/man-pages/man2/fstat.2).

### `fs.fsyncSync(fd)` {#fsfsyncsyncfd}

**Aggiunto in: v0.1.96**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Richiede che tutti i dati per il descrittore di file aperto vengano scaricati sul dispositivo di archiviazione. L'implementazione specifica dipende dal sistema operativo e dal dispositivo. Fare riferimento alla documentazione POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2) per maggiori dettagli. Restituisce `undefined`.

### `fs.ftruncateSync(fd[, len])` {#fsftruncatesyncfd-len}

**Aggiunto in: v0.8.6**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0`

Tronca il descrittore di file. Restituisce `undefined`.

Per informazioni dettagliate, vedere la documentazione della versione asincrona di questa API: [`fs.ftruncate()`](/it/nodejs/api/fs#fsftruncatefd-len-callback).


### `fs.futimesSync(fd, atime, mtime)` {#fsfutimessyncfd-atime-mtime}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v4.1.0 | Stringhe numeriche, `NaN` e `Infinity` sono ora consentiti come specificatori di tempo. |
| v0.4.2 | Aggiunto in: v0.4.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Versione sincrona di [`fs.futimes()`](/it/nodejs/api/fs#fsfutimesfd-atime-mtime-callback). Restituisce `undefined`.

### `fs.globSync(pattern[, options])` {#fsglobsyncpattern-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.2.0 | Aggiunto il supporto per `withFileTypes` come opzione. |
| v22.0.0 | Aggiunto in: v22.0.0 |
:::

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) directory di lavoro corrente. **Predefinito:** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funzione per filtrare file/directory. Restituisce `true` per escludere l'elemento, `false` per includerlo. **Predefinito:** `undefined`.
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se il glob deve restituire i percorsi come Dirent, `false` altrimenti. **Predefinito:** `false`.

- Restituisce: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) percorsi dei file che corrispondono al pattern.

::: code-group
```js [ESM]
import { globSync } from 'node:fs';

console.log(globSync('**/*.js'));
```

```js [CJS]
const { globSync } = require('node:fs');

console.log(globSync('**/*.js'));
```
:::


### `fs.lchmodSync(path, mode)` {#fslchmodsyncpath-mode}

**Deprecato a partire da: v0.4.7**

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Modifica le autorizzazioni su un link simbolico. Restituisce `undefined`.

Questo metodo è implementato solo su macOS.

Vedere la documentazione POSIX [`lchmod(2)`](https://www.freebsd.org/cgi/man.cgi?query=lchmod&sektion=2) per maggiori dettagli.

### `fs.lchownSync(path, uid, gid)` {#fslchownsyncpath-uid-gid}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.6.0 | Questa API non è più deprecata. |
| v0.4.7 | Deprecazione solo documentale. |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID utente del nuovo proprietario del file.
- `gid` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID gruppo del nuovo gruppo del file.

Imposta il proprietario per il percorso. Restituisce `undefined`.

Vedere la documentazione POSIX [`lchown(2)`](http://man7.org/linux/man-pages/man2/lchown.2) per maggiori dettagli.

### `fs.lutimesSync(path, atime, mtime)` {#fslutimessyncpath-atime-mtime}

**Aggiunto in: v14.5.0, v12.19.0**

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Data\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Data\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Modifica i timestamp del file system del link simbolico a cui fa riferimento `path`. Restituisce `undefined` o genera un'eccezione quando i parametri non sono corretti o l'operazione fallisce. Questa è la versione sincrona di [`fs.lutimes()`](/it/nodejs/api/fs#fslutimespath-atime-mtime-callback).


### `fs.linkSync(existingPath, newPath)` {#fslinksyncexistingpath-newpath}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v7.6.0 | I parametri `existingPath` e `newPath` possono essere oggetti WHATWG `URL` che utilizzano il protocollo `file:`. Il supporto è attualmente ancora *sperimentale*. |
| v0.1.31 | Aggiunto in: v0.1.31 |
:::

- `existingPath` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)

Crea un nuovo collegamento da `existingPath` a `newPath`. Vedere la documentazione POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) per maggiori dettagli. Restituisce `undefined`.

### `fs.lstatSync(path[, options])` {#fslstatsyncpath-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.3.0, v14.17.0 | Accetta un'opzione `throwIfNoEntry` per specificare se deve essere generata un'eccezione se la voce non esiste. |
| v10.5.0 | Accetta un oggetto `options` aggiuntivo per specificare se i valori numerici restituiti devono essere bigint. |
| v7.6.0 | Il parametro `path` può essere un oggetto WHATWG `URL` che utilizza il protocollo `file:`. |
| v0.1.30 | Aggiunto in: v0.1.30 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se i valori numerici nell'oggetto [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) restituito devono essere `bigint`. **Predefinito:** `false`.
    - `throwIfNoEntry` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se verrà generata un'eccezione se non esiste alcuna voce del file system, invece di restituire `undefined`. **Predefinito:** `true`.

- Restituisce: [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats)

Recupera [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) per il collegamento simbolico a cui fa riferimento `path`.

Vedere la documentazione POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) per maggiori dettagli.


### `fs.mkdirSync(path[, options])` {#fsmkdirsyncpath-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.11.0, v12.17.0 | In modalità `recursive`, ora viene restituito il primo percorso creato. |
| v10.12.0 | Il secondo argomento può ora essere un oggetto `options` con le proprietà `recursive` e `mode`. |
| v7.6.0 | Il parametro `path` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v0.1.21 | Aggiunto in: v0.1.21 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `recursive` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `false`
    - `mode` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Non supportato su Windows. **Predefinito:** `0o777`.
  
 
- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Crea una directory in modo sincrono. Restituisce `undefined`, o se `recursive` è `true`, il primo percorso della directory creato. Questa è la versione sincrona di [`fs.mkdir()`](/it/nodejs/api/fs#fsmkdirpath-options-callback).

Vedere la documentazione POSIX [`mkdir(2)`](http://man7.org/linux/man-pages/man2/mkdir.2) per maggiori dettagli.

### `fs.mkdtempSync(prefix[, options])` {#fsmkdtempsyncprefix-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.6.0, v18.19.0 | Il parametro `prefix` ora accetta buffer e URL. |
| v16.5.0, v14.18.0 | Il parametro `prefix` ora accetta una stringa vuota. |
| v5.10.0 | Aggiunto in: v5.10.0 |
:::

- `prefix` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'utf8'`
  
 
- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce il percorso della directory creata.

Per informazioni dettagliate, consultare la documentazione della versione asincrona di questa API: [`fs.mkdtemp()`](/it/nodejs/api/fs#fsmkdtempprefix-options-callback).

L'argomento facoltativo `options` può essere una stringa che specifica una codifica, oppure un oggetto con una proprietà `encoding` che specifica la codifica dei caratteri da utilizzare.


### `fs.opendirSync(path[, options])` {#fsopendirsyncpath-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.1.0, v18.17.0 | Aggiunta l'opzione `recursive`. |
| v13.1.0, v12.16.0 | Introdotta l'opzione `bufferSize`. |
| v12.12.0 | Aggiunto in: v12.12.0 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `'utf8'`
    - `bufferSize` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero di voci di directory che vengono memorizzate internamente nel buffer durante la lettura dalla directory. Valori più alti portano a prestazioni migliori ma a un maggiore utilizzo della memoria. **Predefinito:** `32`
    - `recursive` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `false`


- Restituisce: [\<fs.Dir\>](/it/nodejs/api/fs#class-fsdir)

Apre una directory in modo sincrono. Vedere [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3).

Crea un [\<fs.Dir\>](/it/nodejs/api/fs#class-fsdir), che contiene tutte le ulteriori funzioni per la lettura e la pulizia della directory.

L'opzione `encoding` imposta la codifica per il `path` durante l'apertura della directory e le successive operazioni di lettura.

### `fs.openSync(path[, flags[, mode]])` {#fsopensyncpath-flags-mode}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.1.0 | L'argomento `flags` è ora opzionale e il valore predefinito è `'r'`. |
| v9.9.0 | Sono ora supportati i flag `as` e `as+`. |
| v7.6.0 | Il parametro `path` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v0.1.21 | Aggiunto in: v0.1.21 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `'r'`. Vedere [supporto dei `flag` del file system](/it/nodejs/api/fs#file-system-flags).
- `mode` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0o666`
- Restituisce: [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Restituisce un numero intero che rappresenta il descrittore del file.

Per informazioni dettagliate, vedere la documentazione della versione asincrona di questa API: [`fs.open()`](/it/nodejs/api/fs#fsopenpath-flags-mode-callback).


### `fs.readdirSync(path[, options])` {#fsreaddirsyncpath-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.1.0, v18.17.0 | Aggiunta l'opzione `recursive`. |
| v10.10.0 | Aggiunta la nuova opzione `withFileTypes`. |
| v7.6.0 | Il parametro `path` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v0.1.21 | Aggiunto in: v0.1.21 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'utf8'`
    - `withFileTypes` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `false`
    - `recursive` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, legge il contenuto di una directory in modo ricorsivo. In modalità ricorsiva, elencherà tutti i file, i sottofile e le directory. **Predefinito:** `false`.


- Restituisce: [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/it/nodejs/api/buffer#class-buffer) | [\<fs.Dirent[]\>](/it/nodejs/api/fs#class-fsdirent)

Legge il contenuto della directory.

Vedere la documentazione POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) per maggiori dettagli.

L'argomento opzionale `options` può essere una stringa che specifica una codifica, oppure un oggetto con una proprietà `encoding` che specifica la codifica dei caratteri da utilizzare per i nomi file restituiti. Se `encoding` è impostato su `'buffer'`, i nomi file restituiti verranno passati come oggetti [\<Buffer\>](/it/nodejs/api/buffer#class-buffer).

Se `options.withFileTypes` è impostato su `true`, il risultato conterrà oggetti [\<fs.Dirent\>](/it/nodejs/api/fs#class-fsdirent).


### `fs.readFileSync(path[, options])` {#fsreadfilesyncpath-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v7.6.0 | Il parametro `path` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v5.0.0 | Il parametro `path` ora può essere un descrittore di file. |
| v0.1.8 | Aggiunto in: v0.1.8 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nome del file o descrittore del file
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `null`
    - `flag` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Vedi [supporto dei `flag` del file system](/it/nodejs/api/fs#file-system-flags). **Predefinito:** `'r'`.

- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Restituisce il contenuto del `path`.

Per informazioni dettagliate, vedere la documentazione della versione asincrona di questa API: [`fs.readFile()`](/it/nodejs/api/fs#fsreadfilepath-options-callback).

Se l'opzione `encoding` è specificata, questa funzione restituisce una stringa. Altrimenti restituisce un buffer.

Simile a [`fs.readFile()`](/it/nodejs/api/fs#fsreadfilepath-options-callback), quando il path è una directory, il comportamento di `fs.readFileSync()` è specifico della piattaforma.

```js [ESM]
import { readFileSync } from 'node:fs';

// macOS, Linux e Windows
readFileSync('<directory>');
// => [Error: EISDIR: illegal operation on a directory, read <directory>]

// FreeBSD
readFileSync('<directory>'); // => <data>
```

### `fs.readlinkSync(path[, options])` {#fsreadlinksyncpath-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v7.6.0 | Il parametro `path` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v0.1.31 | Aggiunto in: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'utf8'`


- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Restituisce il valore stringa del link simbolico.

Per maggiori dettagli, vedere la documentazione POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2).

L'argomento opzionale `options` può essere una stringa che specifica una codifica, oppure un oggetto con una proprietà `encoding` che specifica la codifica dei caratteri da utilizzare per il percorso del link restituito. Se `encoding` è impostato su `'buffer'`, il percorso del link restituito verrà passato come oggetto [\<Buffer\>](/it/nodejs/api/buffer#class-buffer).

### `fs.readSync(fd, buffer, offset, length[, position])` {#fsreadsyncfd-buffer-offset-length-position}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.10.0 | Il parametro `buffer` ora può essere qualsiasi `TypedArray` o `DataView`. |
| v6.0.0 | Il parametro `length` ora può essere `0`. |
| v0.1.21 | Aggiunto in: v0.1.21 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `null`
- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Restituisce il numero di `bytesRead`.

Per informazioni dettagliate, vedere la documentazione della versione asincrona di questa API: [`fs.read()`](/it/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback).


### `fs.readSync(fd, buffer[, options])` {#fsreadsyncfd-buffer-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.13.0, v12.17.0 | L'oggetto options può essere passato per rendere offset, length e position opzionali. |
| v13.13.0, v12.17.0 | Aggiunto in: v13.13.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `null`


- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Restituisce il numero di `bytesRead`.

Simile alla funzione `fs.readSync` sopra, questa versione accetta un oggetto `options` opzionale. Se non viene specificato alcun oggetto `options`, verranno utilizzati i valori predefiniti sopra indicati.

Per informazioni dettagliate, consultare la documentazione della versione asincrona di questa API: [`fs.read()`](/it/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback).

### `fs.readvSync(fd, buffers[, position])` {#fsreadvsyncfd-buffers-position}

**Aggiunto in: v13.13.0, v12.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `null`
- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte letti.

Per informazioni dettagliate, consultare la documentazione della versione asincrona di questa API: [`fs.readv()`](/it/nodejs/api/fs#fsreadvfd-buffers-position-callback).


### `fs.realpathSync(path[, options])` {#fsrealpathsyncpath-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.0.0 | È stato aggiunto il supporto per la risoluzione di Pipe/Socket. |
| v7.6.0 | Il parametro `path` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v6.4.0 | La chiamata a `realpathSync` ora funziona di nuovo per vari casi limite su Windows. |
| v6.0.0 | Il parametro `cache` è stato rimosso. |
| v0.1.31 | Aggiunto in: v0.1.31 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'utf8'`
  
 
- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Restituisce il nome del percorso risolto.

Per informazioni dettagliate, consulta la documentazione della versione asincrona di questa API: [`fs.realpath()`](/it/nodejs/api/fs#fsrealpathpath-options-callback).

### `fs.realpathSync.native(path[, options])` {#fsrealpathsyncnativepath-options}

**Aggiunto in: v9.2.0**

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'utf8'`
  
 
- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

[`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3) sincrono.

Sono supportati solo i percorsi che possono essere convertiti in stringhe UTF8.

L'argomento opzionale `options` può essere una stringa che specifica una codifica o un oggetto con una proprietà `encoding` che specifica la codifica dei caratteri da utilizzare per il percorso restituito. Se `encoding` è impostato su `'buffer'`, il percorso restituito verrà passato come oggetto [\<Buffer\>](/it/nodejs/api/buffer#class-buffer).

Su Linux, quando Node.js è collegato a musl libc, il file system procfs deve essere montato su `/proc` affinché questa funzione funzioni. Glibc non ha questa restrizione.


### `fs.renameSync(oldPath, newPath)` {#fsrenamesyncoldpath-newpath}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v7.6.0 | I parametri `oldPath` e `newPath` possono essere oggetti `URL` WHATWG utilizzando il protocollo `file:`. Il supporto è attualmente ancora *sperimentale*. |
| v0.1.21 | Aggiunta in: v0.1.21 |
:::

- `oldPath` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)

Rinomina il file da `oldPath` a `newPath`. Restituisce `undefined`.

Per maggiori dettagli, consultare la documentazione POSIX [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2).

### `fs.rmdirSync(path[, options])` {#fsrmdirsyncpath-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.0.0 | L'utilizzo di `fs.rmdirSync(path, { recursive: true })` su un `path` che è un file non è più consentito e genera un errore `ENOENT` su Windows e un errore `ENOTDIR` su POSIX. |
| v16.0.0 | L'utilizzo di `fs.rmdirSync(path, { recursive: true })` su un `path` che non esiste non è più consentito e genera un errore `ENOENT`. |
| v16.0.0 | L'opzione `recursive` è deprecata, il suo utilizzo attiva un avviso di deprecazione. |
| v14.14.0 | L'opzione `recursive` è deprecata, utilizzare invece `fs.rmSync`. |
| v13.3.0, v12.16.0 | L'opzione `maxBusyTries` è stata rinominata in `maxRetries` e il suo valore predefinito è 0. L'opzione `emfileWait` è stata rimossa e gli errori `EMFILE` utilizzano la stessa logica di ripetizione degli altri errori. L'opzione `retryDelay` è ora supportata. Gli errori `ENFILE` vengono ora riprovati. |
| v12.10.0 | Le opzioni `recursive`, `maxBusyTries` e `emfileWait` sono ora supportate. |
| v7.6.0 | I parametri `path` possono essere un oggetto `URL` WHATWG utilizzando il protocollo `file:`. |
| v0.1.21 | Aggiunta in: v0.1.21 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se si verifica un errore `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` o `EPERM`, Node.js riprova l'operazione con un backoff lineare in attesa di `retryDelay` millisecondi in più ad ogni tentativo. Questa opzione rappresenta il numero di tentativi. Questa opzione viene ignorata se l'opzione `recursive` non è `true`. **Predefinito:** `0`.
    - `recursive` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, esegue una rimozione ricorsiva della directory. In modalità ricorsiva, le operazioni vengono riprovate in caso di errore. **Predefinito:** `false`. **Deprecata.**
    - `retryDelay` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La quantità di tempo in millisecondi da attendere tra i tentativi. Questa opzione viene ignorata se l'opzione `recursive` non è `true`. **Predefinito:** `100`.

[`rmdir(2)`](http://man7.org/linux/man-pages/man2/rmdir.2) sincrono. Restituisce `undefined`.

L'utilizzo di `fs.rmdirSync()` su un file (non una directory) genera un errore `ENOENT` su Windows e un errore `ENOTDIR` su POSIX.

Per ottenere un comportamento simile al comando Unix `rm -rf`, utilizzare [`fs.rmSync()`](/it/nodejs/api/fs#fsrmsyncpath-options) con le opzioni `{ recursive: true, force: true }`.


### `fs.rmSync(path[, options])` {#fsrmsyncpath-options}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.3.0, v16.14.0 | Il parametro `path` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v14.14.0 | Aggiunta in: v14.14.0 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, le eccezioni verranno ignorate se `path` non esiste. **Predefinito:** `false`.
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se si verifica un errore `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` o `EPERM`, Node.js riproverà l'operazione con un'attesa di backoff lineare di `retryDelay` millisecondi più lunga a ogni tentativo. Questa opzione rappresenta il numero di tentativi. Questa opzione viene ignorata se l'opzione `recursive` non è `true`. **Predefinito:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, esegue una rimozione ricorsiva della directory. In modalità ricorsiva le operazioni vengono riprovate in caso di errore. **Predefinito:** `false`.
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La quantità di tempo in millisecondi da attendere tra i tentativi. Questa opzione viene ignorata se l'opzione `recursive` non è `true`. **Predefinito:** `100`.
  
 

Rimuove sincronicamente file e directory (modellato sull'utility standard POSIX `rm`). Restituisce `undefined`.

### `fs.statSync(path[, options])` {#fsstatsyncpath-options}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.3.0, v14.17.0 | Accetta un'opzione `throwIfNoEntry` per specificare se deve essere generata un'eccezione se la voce non esiste. |
| v10.5.0 | Accetta un oggetto `options` aggiuntivo per specificare se i valori numerici restituiti devono essere bigint. |
| v7.6.0 | Il parametro `path` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v0.1.21 | Aggiunta in: v0.1.21 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se i valori numerici nell'oggetto [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) restituito devono essere `bigint`. **Predefinito:** `false`.
    - `throwIfNoEntry` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se verrà generata un'eccezione se non esiste alcuna voce del file system, anziché restituire `undefined`. **Predefinito:** `true`.
  
 
- Restituisce: [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats)

Recupera [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) per il percorso.


### `fs.statfsSync(path[, options])` {#fsstatfssyncpath-options}

**Aggiunto in: v19.6.0, v18.15.0**

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se i valori numerici nell'oggetto [\<fs.StatFs\>](/it/nodejs/api/fs#class-fsstatfs) restituito devono essere `bigint`. **Predefinito:** `false`.


- Restituisce: [\<fs.StatFs\>](/it/nodejs/api/fs#class-fsstatfs)

[`statfs(2)`](http://man7.org/linux/man-pages/man2/statfs.2) sincrono. Restituisce informazioni sul file system montato che contiene `path`.

In caso di errore, `err.code` sarà uno dei [Errori di sistema comuni](/it/nodejs/api/errors#common-system-errors).

### `fs.symlinkSync(target, path[, type])` {#fssymlinksynctarget-path-type}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.0.0 | Se l'argomento `type` viene lasciato indefinito, Node rileverà automaticamente il tipo di `target` e selezionerà automaticamente `dir` o `file`. |
| v7.6.0 | I parametri `target` e `path` possono essere oggetti `URL` WHATWG che utilizzano il protocollo `file:`. Il supporto è attualmente ancora *sperimentale*. |
| v0.1.31 | Aggiunto in: v0.1.31 |
:::

- `target` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `type` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `null`

Restituisce `undefined`.

Per informazioni dettagliate, consultare la documentazione della versione asincrona di questa API: [`fs.symlink()`](/it/nodejs/api/fs#fssymlinktarget-path-type-callback).


### `fs.truncateSync(path[, len])` {#fstruncatesyncpath-len}

**Aggiunto in: v0.8.6**

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `len` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0`

Tronca il file. Restituisce `undefined`. Un descrittore di file può anche essere passato come primo argomento. In questo caso, viene chiamato `fs.ftruncateSync()`.

Il passaggio di un descrittore di file è deprecato e potrebbe causare la generazione di un errore in futuro.

### `fs.unlinkSync(path)` {#fsunlinksyncpath}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v7.6.0 | Il parametro `path` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v0.1.21 | Aggiunto in: v0.1.21 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)

[`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2) sincrono. Restituisce `undefined`.

### `fs.utimesSync(path, atime, mtime)` {#fsutimessyncpath-atime-mtime}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.0.0 | `NaN`, `Infinity` e `-Infinity` non sono più specificatori di tempo validi. |
| v7.6.0 | Il parametro `path` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v4.1.0 | Stringhe numeriche, `NaN` e `Infinity` sono ora specificatori di tempo consentiti. |
| v0.4.2 | Aggiunto in: v0.4.2 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Data\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Data\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Restituisce `undefined`.

Per informazioni dettagliate, consultare la documentazione della versione asincrona di questa API: [`fs.utimes()`](/it/nodejs/api/fs#fsutimespath-atime-mtime-callback).


### `fs.writeFileSync(file, data[, options])` {#fswritefilesyncfile-data-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.0.0, v20.10.0 | L'opzione `flush` è ora supportata. |
| v19.0.0 | Passare al parametro `data` un oggetto con una funzione `toString` propria non è più supportato. |
| v17.8.0 | Passare al parametro `data` un oggetto con una funzione `toString` propria è deprecato. |
| v14.12.0 | Il parametro `data` trasformerà in stringa un oggetto con una funzione `toString` esplicita. |
| v14.0.0 | Il parametro `data` non forzerà più l'input non supportato in stringhe. |
| v10.10.0 | Il parametro `data` ora può essere qualsiasi `TypedArray` o `DataView`. |
| v7.4.0 | Il parametro `data` ora può essere un `Uint8Array`. |
| v5.0.0 | Il parametro `file` ora può essere un descrittore di file. |
| v0.1.29 | Aggiunto in: v0.1.29 |
:::

- `file` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nome file o descrittore di file
- `data` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0o666`
    - `flag` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Vedi [supporto dei `flag` del file system](/it/nodejs/api/fs#file-system-flags). **Predefinito:** `'w'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se tutti i dati vengono scritti correttamente nel file e `flush` è `true`, viene utilizzato `fs.fsyncSync()` per scaricare i dati.

Restituisce `undefined`.

L'opzione `mode` influisce solo sul file appena creato. Vedi [`fs.open()`](/it/nodejs/api/fs#fsopenpath-flags-mode-callback) per maggiori dettagli.

Per informazioni dettagliate, vedere la documentazione della versione asincrona di questa API: [`fs.writeFile()`](/it/nodejs/api/fs#fswritefilefile-data-options-callback).


### `fs.writeSync(fd, buffer, offset[, length[, position]])` {#fswritesyncfd-buffer-offset-length-position}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.0.0 | Il parametro `buffer` non forzerà più l'input non supportato in stringhe. |
| v10.10.0 | Il parametro `buffer` ora può essere qualsiasi `TypedArray` o `DataView`. |
| v7.4.0 | Il parametro `buffer` ora può essere un `Uint8Array`. |
| v7.2.0 | I parametri `offset` e `length` ora sono opzionali. |
| v0.1.21 | Aggiunto in: v0.1.21 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `null`
- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte scritti.

Per informazioni dettagliate, consultare la documentazione della versione asincrona di questa API: [`fs.write(fd, buffer...)`](/it/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback).

### `fs.writeSync(fd, buffer[, options])` {#fswritesyncfd-buffer-options}

**Aggiunto in: v18.3.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `null`
  
 
- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte scritti.

Per informazioni dettagliate, consultare la documentazione della versione asincrona di questa API: [`fs.write(fd, buffer...)`](/it/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback).


### `fs.writeSync(fd, string[, position[, encoding]])` {#fswritesyncfd-string-position-encoding}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.0.0 | Il parametro `string` non forzerà più l'input non supportato a stringhe. |
| v7.2.0 | Il parametro `position` ora è opzionale. |
| v0.11.5 | Aggiunto in: v0.11.5 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'utf8'`
- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte scritti.

Per informazioni dettagliate, consulta la documentazione della versione asincrona di questa API: [`fs.write(fd, string...)`](/it/nodejs/api/fs#fswritefd-string-position-encoding-callback).

### `fs.writevSync(fd, buffers[, position])` {#fswritevsyncfd-buffers-position}

**Aggiunto in: v12.9.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predefinito:** `null`
- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte scritti.

Per informazioni dettagliate, consulta la documentazione della versione asincrona di questa API: [`fs.writev()`](/it/nodejs/api/fs#fswritevfd-buffers-position-callback).

## Oggetti comuni {#common-objects}

Gli oggetti comuni sono condivisi da tutte le varianti dell'API del file system (promise, callback e sincrone).


### Classe: `fs.Dir` {#class-fsdir}

**Aggiunto in: v12.12.0**

Una classe che rappresenta un flusso di directory.

Creata da [`fs.opendir()`](/it/nodejs/api/fs#fsopendirpath-options-callback), [`fs.opendirSync()`](/it/nodejs/api/fs#fsopendirsyncpath-options), o [`fsPromises.opendir()`](/it/nodejs/api/fs#fspromisesopendirpath-options).

```js [ESM]
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name);
} catch (err) {
  console.error(err);
}
```
Quando si utilizza l'iteratore async, l'oggetto [\<fs.Dir\>](/it/nodejs/api/fs#class-fsdir) verrà chiuso automaticamente dopo l'uscita dell'iteratore.

#### `dir.close()` {#dirclose}

**Aggiunto in: v12.12.0**

- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Chiude asincronamente l'handle della risorsa sottostante della directory. Le letture successive comporteranno errori.

Viene restituita una promise che verrà soddisfatta dopo che la risorsa è stata chiusa.

#### `dir.close(callback)` {#dirclosecallback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v12.12.0 | Aggiunto in: v12.12.0 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Chiude asincronamente l'handle della risorsa sottostante della directory. Le letture successive comporteranno errori.

La `callback` verrà chiamata dopo che l'handle della risorsa è stato chiuso.

#### `dir.closeSync()` {#dirclosesync}

**Aggiunto in: v12.12.0**

Chiude in modo sincronizzato l'handle della risorsa sottostante della directory. Le letture successive comporteranno errori.

#### `dir.path` {#dirpath}

**Aggiunto in: v12.12.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il percorso di sola lettura di questa directory come è stato fornito a [`fs.opendir()`](/it/nodejs/api/fs#fsopendirpath-options-callback), [`fs.opendirSync()`](/it/nodejs/api/fs#fsopendirsyncpath-options), o [`fsPromises.opendir()`](/it/nodejs/api/fs#fspromisesopendirpath-options).


#### `dir.read()` {#dirread}

**Aggiunto in: v12.12.0**

- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si adempie con un [\<fs.Dirent\>](/it/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Legge asincronamente la successiva voce di directory tramite [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) come un [\<fs.Dirent\>](/it/nodejs/api/fs#class-fsdirent).

Viene restituita una promise che verrà adempiuta con un [\<fs.Dirent\>](/it/nodejs/api/fs#class-fsdirent), o `null` se non ci sono altre voci di directory da leggere.

Le voci di directory restituite da questa funzione non sono in un ordine particolare, così come fornite dai meccanismi di directory sottostanti del sistema operativo. Le voci aggiunte o rimosse durante l'iterazione sulla directory potrebbero non essere incluse nei risultati dell'iterazione.

#### `dir.read(callback)` {#dirreadcallback}

**Aggiunto in: v12.12.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `dirent` [\<fs.Dirent\>](/it/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
  
 

Legge asincronamente la successiva voce di directory tramite [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) come un [\<fs.Dirent\>](/it/nodejs/api/fs#class-fsdirent).

Una volta completata la lettura, la `callback` verrà chiamata con un [\<fs.Dirent\>](/it/nodejs/api/fs#class-fsdirent), o `null` se non ci sono altre voci di directory da leggere.

Le voci di directory restituite da questa funzione non sono in un ordine particolare, così come fornite dai meccanismi di directory sottostanti del sistema operativo. Le voci aggiunte o rimosse durante l'iterazione sulla directory potrebbero non essere incluse nei risultati dell'iterazione.

#### `dir.readSync()` {#dirreadsync}

**Aggiunto in: v12.12.0**

- Restituisce: [\<fs.Dirent\>](/it/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Legge in modo sincrono la successiva voce di directory come un [\<fs.Dirent\>](/it/nodejs/api/fs#class-fsdirent). Vedere la documentazione POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) per maggiori dettagli.

Se non ci sono altre voci di directory da leggere, verrà restituito `null`.

Le voci di directory restituite da questa funzione non sono in un ordine particolare, così come fornite dai meccanismi di directory sottostanti del sistema operativo. Le voci aggiunte o rimosse durante l'iterazione sulla directory potrebbero non essere incluse nei risultati dell'iterazione.


#### `dir[Symbol.asyncIterator]()` {#dirsymbolasynciterator}

**Aggiunto in: v12.12.0**

- Restituisce: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) Un AsyncIterator di [\<fs.Dirent\>](/it/nodejs/api/fs#class-fsdirent)

Itera asincronamente sulla directory finché tutte le voci non sono state lette. Fare riferimento alla documentazione POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) per maggiori dettagli.

Le voci restituite dall'iteratore asincrono sono sempre un [\<fs.Dirent\>](/it/nodejs/api/fs#class-fsdirent). Il caso `null` di `dir.read()` viene gestito internamente.

Vedere [\<fs.Dir\>](/it/nodejs/api/fs#class-fsdir) per un esempio.

Le voci di directory restituite da questo iteratore non sono in un ordine particolare come fornito dai meccanismi di directory sottostanti del sistema operativo. Le voci aggiunte o rimosse durante l'iterazione sulla directory potrebbero non essere incluse nei risultati dell'iterazione.

### Classe: `fs.Dirent` {#class-fsdirent}

**Aggiunto in: v10.10.0**

Una rappresentazione di una voce di directory, che può essere un file o una sottodirectory all'interno della directory, come restituito dalla lettura da un [\<fs.Dir\>](/it/nodejs/api/fs#class-fsdir). La voce di directory è una combinazione dei nomi dei file e delle coppie di tipi di file.

Inoltre, quando [`fs.readdir()`](/it/nodejs/api/fs#fsreaddirpath-options-callback) o [`fs.readdirSync()`](/it/nodejs/api/fs#fsreaddirsyncpath-options) viene chiamato con l'opzione `withFileTypes` impostata su `true`, l'array risultante viene riempito con oggetti [\<fs.Dirent\>](/it/nodejs/api/fs#class-fsdirent), invece di stringhe o [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)s.

#### `dirent.isBlockDevice()` {#direntisblockdevice}

**Aggiunto in: v10.10.0**

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se l'oggetto [\<fs.Dirent\>](/it/nodejs/api/fs#class-fsdirent) descrive un dispositivo a blocchi.

#### `dirent.isCharacterDevice()` {#direntischaracterdevice}

**Aggiunto in: v10.10.0**

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se l'oggetto [\<fs.Dirent\>](/it/nodejs/api/fs#class-fsdirent) descrive un dispositivo a caratteri.


#### `dirent.isDirectory()` {#direntisdirectory}

**Aggiunto in: v10.10.0**

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se l'oggetto [\<fs.Dirent\>](/it/nodejs/api/fs#class-fsdirent) descrive una directory del file system.

#### `dirent.isFIFO()` {#direntisfifo}

**Aggiunto in: v10.10.0**

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se l'oggetto [\<fs.Dirent\>](/it/nodejs/api/fs#class-fsdirent) descrive una pipe first-in-first-out (FIFO).

#### `dirent.isFile()` {#direntisfile}

**Aggiunto in: v10.10.0**

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se l'oggetto [\<fs.Dirent\>](/it/nodejs/api/fs#class-fsdirent) descrive un file normale.

#### `dirent.isSocket()` {#direntissocket}

**Aggiunto in: v10.10.0**

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se l'oggetto [\<fs.Dirent\>](/it/nodejs/api/fs#class-fsdirent) descrive un socket.

#### `dirent.isSymbolicLink()` {#direntissymboliclink}

**Aggiunto in: v10.10.0**

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se l'oggetto [\<fs.Dirent\>](/it/nodejs/api/fs#class-fsdirent) descrive un collegamento simbolico.

#### `dirent.name` {#direntname}

**Aggiunto in: v10.10.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Il nome del file a cui si riferisce questo oggetto [\<fs.Dirent\>](/it/nodejs/api/fs#class-fsdirent). Il tipo di questo valore è determinato da `options.encoding` passato a [`fs.readdir()`](/it/nodejs/api/fs#fsreaddirpath-options-callback) o [`fs.readdirSync()`](/it/nodejs/api/fs#fsreaddirsyncpath-options).

#### `dirent.parentPath` {#direntparentpath}

**Aggiunto in: v21.4.0, v20.12.0, v18.20.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il percorso della directory principale del file a cui si riferisce questo oggetto [\<fs.Dirent\>](/it/nodejs/api/fs#class-fsdirent).


#### `dirent.path` {#direntpath}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.2.0 | La proprietà non è più di sola lettura. |
| v23.0.0 | L'accesso a questa proprietà emette un avviso. Ora è di sola lettura. |
| v21.5.0, v20.12.0, v18.20.0 | Deprecato da: v21.5.0, v20.12.0, v18.20.0 |
| v20.1.0, v18.17.0 | Aggiunto in: v20.1.0, v18.17.0 |
:::

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato: Utilizzare [`dirent.parentPath`](/it/nodejs/api/fs#direntparentpath) invece.
:::

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Alias per `dirent.parentPath`.

### Classe: `fs.FSWatcher` {#class-fsfswatcher}

**Aggiunto in: v0.5.8**

- Estende [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter)

Una chiamata di successo al metodo [`fs.watch()`](/it/nodejs/api/fs#fswatchfilename-options-listener) restituirà un nuovo oggetto [\<fs.FSWatcher\>](/it/nodejs/api/fs#class-fsfswatcher).

Tutti gli oggetti [\<fs.FSWatcher\>](/it/nodejs/api/fs#class-fsfswatcher) emettono un evento `'change'` ogni volta che un file specifico osservato viene modificato.

#### Evento: `'change'` {#event-change}

**Aggiunto in: v0.5.8**

- `eventType` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il tipo di evento di modifica che si è verificato
- `filename` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Il nome del file che è stato modificato (se rilevante/disponibile)

Emesso quando qualcosa cambia in una directory o file osservato. Vedere maggiori dettagli in [`fs.watch()`](/it/nodejs/api/fs#fswatchfilename-options-listener).

L'argomento `filename` potrebbe non essere fornito a seconda del supporto del sistema operativo. Se `filename` è fornito, verrà fornito come [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) se `fs.watch()` viene chiamato con la sua opzione `encoding` impostata su `'buffer'`, altrimenti `filename` sarà una stringa UTF-8.

```js [ESM]
import { watch } from 'node:fs';
// Esempio quando gestito tramite il listener fs.watch()
watch('./tmp', { encoding: 'buffer' }, (eventType, filename) => {
  if (filename) {
    console.log(filename);
    // Stampa: <Buffer ...>
  }
});
```

#### Evento: `'close'` {#event-close_1}

**Aggiunto in: v10.0.0**

Emesso quando il watcher smette di monitorare i cambiamenti. L'oggetto [\<fs.FSWatcher\>](/it/nodejs/api/fs#class-fsfswatcher) chiuso non è più utilizzabile nell'event handler.

#### Evento: `'error'` {#event-error}

**Aggiunto in: v0.5.8**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emesso quando si verifica un errore durante il monitoraggio del file. L'oggetto [\<fs.FSWatcher\>](/it/nodejs/api/fs#class-fsfswatcher) in errore non è più utilizzabile nell'event handler.

#### `watcher.close()` {#watcherclose}

**Aggiunto in: v0.5.8**

Interrompe il monitoraggio delle modifiche sul dato [\<fs.FSWatcher\>](/it/nodejs/api/fs#class-fsfswatcher). Una volta interrotto, l'oggetto [\<fs.FSWatcher\>](/it/nodejs/api/fs#class-fsfswatcher) non è più utilizzabile.

#### `watcher.ref()` {#watcherref}

**Aggiunto in: v14.3.0, v12.20.0**

- Restituisce: [\<fs.FSWatcher\>](/it/nodejs/api/fs#class-fsfswatcher)

Quando viene chiamato, richiede che il ciclo di eventi di Node.js *non* termini finché il [\<fs.FSWatcher\>](/it/nodejs/api/fs#class-fsfswatcher) è attivo. Chiamare `watcher.ref()` più volte non avrà alcun effetto.

Per impostazione predefinita, tutti gli oggetti [\<fs.FSWatcher\>](/it/nodejs/api/fs#class-fsfswatcher) sono "ref'ed", rendendo normalmente non necessario chiamare `watcher.ref()` a meno che `watcher.unref()` non sia stato chiamato in precedenza.

#### `watcher.unref()` {#watcherunref}

**Aggiunto in: v14.3.0, v12.20.0**

- Restituisce: [\<fs.FSWatcher\>](/it/nodejs/api/fs#class-fsfswatcher)

Quando viene chiamato, l'oggetto [\<fs.FSWatcher\>](/it/nodejs/api/fs#class-fsfswatcher) attivo non richiederà che il ciclo di eventi di Node.js rimanga attivo. Se non ci sono altre attività che mantengono in esecuzione il ciclo di eventi, il processo potrebbe terminare prima che venga richiamato il callback dell'oggetto [\<fs.FSWatcher\>](/it/nodejs/api/fs#class-fsfswatcher). Chiamare `watcher.unref()` più volte non avrà alcun effetto.

### Classe: `fs.StatWatcher` {#class-fsstatwatcher}

**Aggiunto in: v14.3.0, v12.20.0**

- Estende [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter)

Una chiamata riuscita al metodo `fs.watchFile()` restituirà un nuovo oggetto [\<fs.StatWatcher\>](/it/nodejs/api/fs#class-fsstatwatcher).

#### `watcher.ref()` {#watcherref_1}

**Aggiunto in: v14.3.0, v12.20.0**

- Restituisce: [\<fs.StatWatcher\>](/it/nodejs/api/fs#class-fsstatwatcher)

Quando viene chiamato, richiede che il ciclo di eventi di Node.js *non* termini finché il [\<fs.StatWatcher\>](/it/nodejs/api/fs#class-fsstatwatcher) è attivo. Chiamare `watcher.ref()` più volte non avrà alcun effetto.

Per impostazione predefinita, tutti gli oggetti [\<fs.StatWatcher\>](/it/nodejs/api/fs#class-fsstatwatcher) sono "ref'ed", rendendo normalmente non necessario chiamare `watcher.ref()` a meno che `watcher.unref()` non sia stato chiamato in precedenza.


#### `watcher.unref()` {#watcherunref_1}

**Aggiunto in: v14.3.0, v12.20.0**

- Restituisce: [\<fs.StatWatcher\>](/it/nodejs/api/fs#class-fsstatwatcher)

Quando chiamato, l'oggetto [\<fs.StatWatcher\>](/it/nodejs/api/fs#class-fsstatwatcher) attivo non richiederà che il ciclo di eventi di Node.js rimanga attivo. Se non ci sono altre attività che mantengono in esecuzione il ciclo di eventi, il processo potrebbe terminare prima che venga invocato il callback dell'oggetto [\<fs.StatWatcher\>](/it/nodejs/api/fs#class-fsstatwatcher). Chiamare `watcher.unref()` più volte non avrà alcun effetto.

### Classe: `fs.ReadStream` {#class-fsreadstream}

**Aggiunto in: v0.1.93**

- Estende: [\<stream.Readable\>](/it/nodejs/api/stream#class-streamreadable)

Le istanze di [\<fs.ReadStream\>](/it/nodejs/api/fs#class-fsreadstream) vengono create e restituite utilizzando la funzione [`fs.createReadStream()`](/it/nodejs/api/fs#fscreatereadstreampath-options).

#### Evento: `'close'` {#event-close_2}

**Aggiunto in: v0.1.93**

Emesso quando il descrittore di file sottostante di [\<fs.ReadStream\>](/it/nodejs/api/fs#class-fsreadstream) è stato chiuso.

#### Evento: `'open'` {#event-open}

**Aggiunto in: v0.1.93**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Descrittore di file intero utilizzato da [\<fs.ReadStream\>](/it/nodejs/api/fs#class-fsreadstream).

Emesso quando il descrittore di file di [\<fs.ReadStream\>](/it/nodejs/api/fs#class-fsreadstream) è stato aperto.

#### Evento: `'ready'` {#event-ready}

**Aggiunto in: v9.11.0**

Emesso quando [\<fs.ReadStream\>](/it/nodejs/api/fs#class-fsreadstream) è pronto per essere utilizzato.

Viene attivato immediatamente dopo `'open'`.

#### `readStream.bytesRead` {#readstreambytesread}

**Aggiunto in: v6.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il numero di byte che sono stati letti finora.

#### `readStream.path` {#readstreampath}

**Aggiunto in: v0.1.93**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Il percorso del file da cui il flusso sta leggendo, come specificato nel primo argomento di `fs.createReadStream()`. Se `path` viene passato come stringa, allora `readStream.path` sarà una stringa. Se `path` viene passato come [\<Buffer\>](/it/nodejs/api/buffer#class-buffer), allora `readStream.path` sarà un [\<Buffer\>](/it/nodejs/api/buffer#class-buffer). Se viene specificato `fd`, allora `readStream.path` sarà `undefined`.


#### `readStream.pending` {#readstreampending}

**Aggiunto in: v11.2.0, v10.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Questa proprietà è `true` se il file sottostante non è ancora stato aperto, ovvero prima che venga emesso l'evento `'ready'`.

### Classe: `fs.Stats` {#class-fsstats}

::: info [Cronologia]
| Versione     | Modifiche                                     |
| :----------- | :-------------------------------------------- |
| v22.0.0, v20.13.0 | Il costruttore pubblico è deprecato.       |
| v8.1.0       | Aggiunti i tempi come numeri.                |
| v0.1.21      | Aggiunto in: v0.1.21                        |
:::

Un oggetto [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) fornisce informazioni su un file.

Gli oggetti restituiti da [`fs.stat()`](/it/nodejs/api/fs#fsstatpath-options-callback), [`fs.lstat()`](/it/nodejs/api/fs#fslstatpath-options-callback), [`fs.fstat()`](/it/nodejs/api/fs#fsfstatfd-options-callback) e le loro controparti sincrone sono di questo tipo. Se `bigint` nelle `options` passate a questi metodi è true, i valori numerici saranno `bigint` anziché `number` e l'oggetto conterrà proprietà aggiuntive con precisione in nanosecondi con il suffisso `Ns`. Gli oggetti `Stat` non devono essere creati direttamente utilizzando la parola chiave `new`.

```bash [BASH]
Stats {
  dev: 2114,
  ino: 48064969,
  mode: 33188,
  nlink: 1,
  uid: 85,
  gid: 100,
  rdev: 0,
  size: 527,
  blksize: 4096,
  blocks: 8,
  atimeMs: 1318289051000.1,
  mtimeMs: 1318289051000.1,
  ctimeMs: 1318289051000.1,
  birthtimeMs: 1318289051000.1,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
```
Versione `bigint`:

```bash [BASH]
BigIntStats {
  dev: 2114n,
  ino: 48064969n,
  mode: 33188n,
  nlink: 1n,
  uid: 85n,
  gid: 100n,
  rdev: 0n,
  size: 527n,
  blksize: 4096n,
  blocks: 8n,
  atimeMs: 1318289051000n,
  mtimeMs: 1318289051000n,
  ctimeMs: 1318289051000n,
  birthtimeMs: 1318289051000n,
  atimeNs: 1318289051000000000n,
  mtimeNs: 1318289051000000000n,
  ctimeNs: 1318289051000000000n,
  birthtimeNs: 1318289051000000000n,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
```

#### `stats.isBlockDevice()` {#statsisblockdevice}

**Aggiunto in: v0.1.10**

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se l'oggetto [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) descrive un dispositivo a blocchi.

#### `stats.isCharacterDevice()` {#statsischaracterdevice}

**Aggiunto in: v0.1.10**

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se l'oggetto [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) descrive un dispositivo a caratteri.

#### `stats.isDirectory()` {#statsisdirectory}

**Aggiunto in: v0.1.10**

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se l'oggetto [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) descrive una directory del file system.

Se l'oggetto [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) è stato ottenuto chiamando [`fs.lstat()`](/it/nodejs/api/fs#fslstatpath-options-callback) su un link simbolico che si risolve in una directory, questo metodo restituirà `false`. Questo perché [`fs.lstat()`](/it/nodejs/api/fs#fslstatpath-options-callback) restituisce informazioni su un link simbolico stesso e non sul percorso in cui si risolve.

#### `stats.isFIFO()` {#statsisfifo}

**Aggiunto in: v0.1.10**

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se l'oggetto [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) descrive una pipe first-in-first-out (FIFO).

#### `stats.isFile()` {#statsisfile}

**Aggiunto in: v0.1.10**

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se l'oggetto [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) descrive un file normale.

#### `stats.isSocket()` {#statsissocket}

**Aggiunto in: v0.1.10**

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se l'oggetto [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) descrive un socket.

#### `stats.isSymbolicLink()` {#statsissymboliclink}

**Aggiunto in: v0.1.10**

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se l'oggetto [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) descrive un collegamento simbolico.

Questo metodo è valido solo quando si utilizza [`fs.lstat()`](/it/nodejs/api/fs#fslstatpath-options-callback).


#### `stats.dev` {#statsdev}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

L'identificatore numerico del dispositivo contenente il file.

#### `stats.ino` {#statsino}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Il numero "Inode" specifico del file system per il file.

#### `stats.mode` {#statsmode}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Un campo di bit che descrive il tipo di file e la modalità.

#### `stats.nlink` {#statsnlink}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Il numero di hard-link esistenti per il file.

#### `stats.uid` {#statsuid}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

L'identificatore numerico dell'utente proprietario del file (POSIX).

#### `stats.gid` {#statsgid}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

L'identificatore numerico del gruppo proprietario del file (POSIX).

#### `stats.rdev` {#statsrdev}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Un identificatore numerico del dispositivo se il file rappresenta un dispositivo.

#### `stats.size` {#statssize}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

La dimensione del file in byte.

Se il file system sottostante non supporta l'ottenimento delle dimensioni del file, questo sarà `0`.


#### `stats.blksize` {#statsblksize}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

La dimensione del blocco del file system per le operazioni di i/o.

#### `stats.blocks` {#statsblocks}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Il numero di blocchi allocati per questo file.

#### `stats.atimeMs` {#statsatimems}

**Aggiunto in: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Il timestamp che indica l'ultima volta che è stato effettuato l'accesso a questo file, espresso in millisecondi dall'epoca POSIX.

#### `stats.mtimeMs` {#statsmtimems}

**Aggiunto in: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Il timestamp che indica l'ultima volta che questo file è stato modificato, espresso in millisecondi dall'epoca POSIX.

#### `stats.ctimeMs` {#statsctimems}

**Aggiunto in: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Il timestamp che indica l'ultima volta che lo stato del file è stato modificato, espresso in millisecondi dall'epoca POSIX.

#### `stats.birthtimeMs` {#statsbirthtimems}

**Aggiunto in: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Il timestamp che indica l'ora di creazione di questo file, espresso in millisecondi dall'epoca POSIX.

#### `stats.atimeNs` {#statsatimens}

**Aggiunto in: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Presente solo quando `bigint: true` viene passato nel metodo che genera l'oggetto. Il timestamp che indica l'ultima volta che è stato effettuato l'accesso a questo file, espresso in nanosecondi dall'epoca POSIX.


#### `stats.mtimeNs` {#statsmtimens}

**Aggiunto in: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Presente solo quando `bigint: true` viene passato al metodo che genera l'oggetto. Il timestamp che indica l'ultima volta che questo file è stato modificato espresso in nanosecondi dall'Epoch POSIX.

#### `stats.ctimeNs` {#statsctimens}

**Aggiunto in: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Presente solo quando `bigint: true` viene passato al metodo che genera l'oggetto. Il timestamp che indica l'ultima volta che lo stato del file è stato modificato espresso in nanosecondi dall'Epoch POSIX.

#### `stats.birthtimeNs` {#statsbirthtimens}

**Aggiunto in: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Presente solo quando `bigint: true` viene passato al metodo che genera l'oggetto. Il timestamp che indica l'ora di creazione di questo file espresso in nanosecondi dall'Epoch POSIX.

#### `stats.atime` {#statsatime}

**Aggiunto in: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Il timestamp che indica l'ultima volta che è stato eseguito l'accesso a questo file.

#### `stats.mtime` {#statsmtime}

**Aggiunto in: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Il timestamp che indica l'ultima volta che questo file è stato modificato.

#### `stats.ctime` {#statsctime}

**Aggiunto in: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Il timestamp che indica l'ultima volta che lo stato del file è stato modificato.

#### `stats.birthtime` {#statsbirthtime}

**Aggiunto in: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Il timestamp che indica l'ora di creazione di questo file.

#### Valori temporali Stat {#stat-time-values}

Le proprietà `atimeMs`, `mtimeMs`, `ctimeMs`, `birthtimeMs` sono valori numerici che contengono i tempi corrispondenti in millisecondi. La loro precisione è specifica della piattaforma. Quando `bigint: true` viene passato al metodo che genera l'oggetto, le proprietà saranno [bigint](https://tc39.github.io/proposal-bigint), altrimenti saranno [numeri](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type).

Le proprietà `atimeNs`, `mtimeNs`, `ctimeNs`, `birthtimeNs` sono [bigint](https://tc39.github.io/proposal-bigint) che contengono i tempi corrispondenti in nanosecondi. Sono presenti solo quando `bigint: true` viene passato al metodo che genera l'oggetto. La loro precisione è specifica della piattaforma.

`atime`, `mtime`, `ctime` e `birthtime` sono rappresentazioni alternative degli orari vari dell'oggetto [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date). I valori `Date` e numerici non sono collegati. L'assegnazione di un nuovo valore numerico o la modifica del valore `Date` non si rifletterà nella rappresentazione alternativa corrispondente.

Gli orari nell'oggetto stat hanno la seguente semantica:

- `atime` "Tempo di accesso": tempo in cui sono stati consultati per l'ultima volta i dati del file. Modificato dalle chiamate di sistema [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2), [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2) e [`read(2)`](http://man7.org/linux/man-pages/man2/read.2).
- `mtime` "Tempo modificato": tempo in cui i dati del file sono stati modificati l'ultima volta. Modificato dalle chiamate di sistema [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2), [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2) e [`write(2)`](http://man7.org/linux/man-pages/man2/write.2).
- `ctime` "Tempo di modifica": tempo in cui lo stato del file è stato modificato l'ultima volta (modifica dei dati inode). Modificato dalle chiamate di sistema [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2), [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2), [`link(2)`](http://man7.org/linux/man-pages/man2/link.2), [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2), [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2), [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2), [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2), [`read(2)`](http://man7.org/linux/man-pages/man2/read.2) e [`write(2)`](http://man7.org/linux/man-pages/man2/write.2).
- `birthtime` "Ora di nascita": ora di creazione del file. Impostato una volta quando il file viene creato. Sui file system in cui l'ora di nascita non è disponibile, questo campo può invece contenere `ctime` o `1970-01-01T00:00Z` (ovvero, timestamp Unix epoch `0`). Questo valore può essere maggiore di `atime` o `mtime` in questo caso. Su Darwin e altre varianti FreeBSD, impostato anche se `atime` è impostato esplicitamente su un valore precedente all'attuale `birthtime` utilizzando la chiamata di sistema [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2).

Prima di Node.js 0.12, `ctime` conteneva `birthtime` sui sistemi Windows. A partire dalla versione 0.12, `ctime` non è "tempo di creazione" e, sui sistemi Unix, non lo è mai stato.


### Classe: `fs.StatFs` {#class-fsstatfs}

**Aggiunto in: v19.6.0, v18.15.0**

Fornisce informazioni su un file system montato.

Gli oggetti restituiti da [`fs.statfs()`](/it/nodejs/api/fs#fsstatfspath-options-callback) e dalla sua controparte sincrona sono di questo tipo. Se `bigint` nelle `options` passate a questi metodi è `true`, i valori numerici saranno `bigint` invece di `number`.

```bash [BASH]
StatFs {
  type: 1397114950,
  bsize: 4096,
  blocks: 121938943,
  bfree: 61058895,
  bavail: 61058895,
  files: 999,
  ffree: 1000000
}
```
Versione `bigint`:

```bash [BASH]
StatFs {
  type: 1397114950n,
  bsize: 4096n,
  blocks: 121938943n,
  bfree: 61058895n,
  bavail: 61058895n,
  files: 999n,
  ffree: 1000000n
}
```
#### `statfs.bavail` {#statfsbavail}

**Aggiunto in: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Blocchi liberi disponibili per gli utenti non privilegiati.

#### `statfs.bfree` {#statfsbfree}

**Aggiunto in: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Blocchi liberi nel file system.

#### `statfs.blocks` {#statfsblocks}

**Aggiunto in: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Blocchi di dati totali nel file system.

#### `statfs.bsize` {#statfsbsize}

**Aggiunto in: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Dimensione ottimale del blocco di trasferimento.

#### `statfs.ffree` {#statfsffree}

**Aggiunto in: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Nodi file liberi nel file system.


#### `statfs.files` {#statfsfiles}

**Aggiunto in: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Nodi file totali nel file system.

#### `statfs.type` {#statfstype}

**Aggiunto in: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Tipo di file system.

### Classe: `fs.WriteStream` {#class-fswritestream}

**Aggiunto in: v0.1.93**

- Estende [\<stream.Writable\>](/it/nodejs/api/stream#class-streamwritable)

Le istanze di [\<fs.WriteStream\>](/it/nodejs/api/fs#class-fswritestream) sono create e restituite usando la funzione [`fs.createWriteStream()`](/it/nodejs/api/fs#fscreatewritestreampath-options).

#### Evento: `'close'` {#event-close_3}

**Aggiunto in: v0.1.93**

Emesso quando il descrittore di file sottostante di [\<fs.WriteStream\>](/it/nodejs/api/fs#class-fswritestream) è stato chiuso.

#### Evento: `'open'` {#event-open_1}

**Aggiunto in: v0.1.93**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Descrittore di file intero utilizzato da [\<fs.WriteStream\>](/it/nodejs/api/fs#class-fswritestream).

Emesso quando il file di [\<fs.WriteStream\>](/it/nodejs/api/fs#class-fswritestream) è aperto.

#### Evento: `'ready'` {#event-ready_1}

**Aggiunto in: v9.11.0**

Emesso quando [\<fs.WriteStream\>](/it/nodejs/api/fs#class-fswritestream) è pronto per essere utilizzato.

Si attiva immediatamente dopo `'open'`.

#### `writeStream.bytesWritten` {#writestreambyteswritten}

**Aggiunto in: v0.4.7**

Il numero di byte scritti finora. Non include i dati ancora in coda per la scrittura.

#### `writeStream.close([callback])` {#writestreamclosecallback}

**Aggiunto in: v0.9.4**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Chiude `writeStream`. Accetta facoltativamente un callback che verrà eseguito una volta che `writeStream` è chiuso.


#### `writeStream.path` {#writestreampath}

**Aggiunto in: v0.1.93**

Il percorso del file in cui lo stream sta scrivendo, come specificato nel primo argomento di [`fs.createWriteStream()`](/it/nodejs/api/fs#fscreatewritestreampath-options). Se `path` viene passato come stringa, allora `writeStream.path` sarà una stringa. Se `path` viene passato come [\<Buffer\>](/it/nodejs/api/buffer#class-buffer), allora `writeStream.path` sarà un [\<Buffer\>](/it/nodejs/api/buffer#class-buffer).

#### `writeStream.pending` {#writestreampending}

**Aggiunto in: v11.2.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Questa proprietà è `true` se il file sottostante non è stato ancora aperto, ovvero prima che venga emesso l'evento `'ready'`.

### `fs.constants` {#fsconstants}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Restituisce un oggetto contenente costanti comunemente usate per le operazioni del file system.

#### Costanti FS {#fs-constants}

Le seguenti costanti sono esportate da `fs.constants` e `fsPromises.constants`.

Non tutte le costanti saranno disponibili su ogni sistema operativo; questo è particolarmente importante per Windows, dove molte delle definizioni specifiche POSIX non sono disponibili. Per applicazioni portabili si raccomanda di verificarne la presenza prima dell'uso.

Per usare più di una costante, usa l'operatore OR bitwise `|`.

Esempio:

```js [ESM]
import { open, constants } from 'node:fs';

const {
  O_RDWR,
  O_CREAT,
  O_EXCL,
} = constants;

open('/path/to/my/file', O_RDWR | O_CREAT | O_EXCL, (err, fd) => {
  // ...
});
```
##### Costanti di accesso ai file {#file-access-constants}

Le seguenti costanti sono pensate per essere usate come parametro `mode` passato a [`fsPromises.access()`](/it/nodejs/api/fs#fspromisesaccesspath-mode), [`fs.access()`](/it/nodejs/api/fs#fsaccesspath-mode-callback) e [`fs.accessSync()`](/it/nodejs/api/fs#fsaccesssyncpath-mode).

| Costante | Descrizione |
| --- | --- |
| `F_OK` | Flag che indica che il file è visibile al processo chiamante.      Questo è utile per determinare se un file esiste, ma non dice nulla      sui permessi `rwx`. Predefinito se non viene specificata alcuna modalità. |
| `R_OK` | Flag che indica che il file può essere letto dal processo chiamante. |
| `W_OK` | Flag che indica che il file può essere scritto dal processo chiamante. |
| `X_OK` | Flag che indica che il file può essere eseguito dal processo chiamante. Questo non ha effetto su Windows (si comporterà come `fs.constants.F_OK`). |
Le definizioni sono disponibili anche su Windows.


##### Costanti di copia file {#file-copy-constants}

Le seguenti costanti sono pensate per essere utilizzate con [`fs.copyFile()`](/it/nodejs/api/fs#fscopyfilesrc-dest-mode-callback).

| Costante | Descrizione |
| --- | --- |
| `COPYFILE_EXCL` | Se presente, l'operazione di copia fallirà con un errore se il percorso di destinazione esiste già. |
| `COPYFILE_FICLONE` | Se presente, l'operazione di copia tenterà di creare un reflink copy-on-write. Se la piattaforma sottostante non supporta copy-on-write, viene utilizzato un meccanismo di copia di fallback. |
| `COPYFILE_FICLONE_FORCE` | Se presente, l'operazione di copia tenterà di creare un reflink copy-on-write. Se la piattaforma sottostante non supporta copy-on-write, l'operazione fallirà con un errore. |
Le definizioni sono disponibili anche su Windows.

##### Costanti di apertura file {#file-open-constants}

Le seguenti costanti sono pensate per essere utilizzate con `fs.open()`.

| Costante | Descrizione |
| --- | --- |
| `O_RDONLY` | Flag che indica di aprire un file per l'accesso in sola lettura. |
| `O_WRONLY` | Flag che indica di aprire un file per l'accesso in sola scrittura. |
| `O_RDWR` | Flag che indica di aprire un file per l'accesso in lettura-scrittura. |
| `O_CREAT` | Flag che indica di creare il file se non esiste già. |
| `O_EXCL` | Flag che indica che l'apertura di un file deve fallire se il flag `O_CREAT` è impostato e il file esiste già. |
| `O_NOCTTY` | Flag che indica che se il percorso identifica un dispositivo terminale, l'apertura del percorso non deve far sì che quel terminale diventi il terminale di controllo per il processo (se il processo non ne ha già uno). |
| `O_TRUNC` | Flag che indica che se il file esiste ed è un file regolare e il file viene aperto correttamente per l'accesso in scrittura, la sua lunghezza deve essere troncata a zero. |
| `O_APPEND` | Flag che indica che i dati verranno aggiunti alla fine del file. |
| `O_DIRECTORY` | Flag che indica che l'apertura deve fallire se il percorso non è una directory. |
| `O_NOATIME` | Flag che indica che gli accessi in lettura al file system non comporteranno più un aggiornamento delle informazioni `atime` associate al file. Questo flag è disponibile solo sui sistemi operativi Linux. |
| `O_NOFOLLOW` | Flag che indica che l'apertura deve fallire se il percorso è un link simbolico. |
| `O_SYNC` | Flag che indica che il file viene aperto per I/O sincronizzato con operazioni di scrittura in attesa dell'integrità del file. |
| `O_DSYNC` | Flag che indica che il file viene aperto per I/O sincronizzato con operazioni di scrittura in attesa dell'integrità dei dati. |
| `O_SYMLINK` | Flag che indica di aprire il link simbolico stesso piuttosto che la risorsa a cui punta. |
| `O_DIRECT` | Quando impostato, verrà fatto un tentativo per ridurre al minimo gli effetti di memorizzazione nella cache dell'I/O del file. |
| `O_NONBLOCK` | Flag che indica di aprire il file in modalità non bloccante quando possibile. |
| `UV_FS_O_FILEMAP` | Quando impostato, viene utilizzata una mappatura file in memoria per accedere al file. Questo flag è disponibile solo sui sistemi operativi Windows. Su altri sistemi operativi, questo flag viene ignorato. |
Su Windows, sono disponibili solo `O_APPEND`, `O_CREAT`, `O_EXCL`, `O_RDONLY`, `O_RDWR`, `O_TRUNC`, `O_WRONLY` e `UV_FS_O_FILEMAP`.


##### Costanti del tipo di file {#file-type-constants}

Le seguenti costanti sono intese per l'uso con la proprietà `mode` dell'oggetto [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) per determinare il tipo di un file.

| Costante | Descrizione |
| --- | --- |
| `S_IFMT` | Maschera di bit utilizzata per estrarre il codice del tipo di file. |
| `S_IFREG` | Costante del tipo di file per un file normale. |
| `S_IFDIR` | Costante del tipo di file per una directory. |
| `S_IFCHR` | Costante del tipo di file per un file di dispositivo orientato ai caratteri. |
| `S_IFBLK` | Costante del tipo di file per un file di dispositivo orientato a blocchi. |
| `S_IFIFO` | Costante del tipo di file per una FIFO/pipe. |
| `S_IFLNK` | Costante del tipo di file per un collegamento simbolico. |
| `S_IFSOCK` | Costante del tipo di file per un socket. |
Su Windows, sono disponibili solo `S_IFCHR`, `S_IFDIR`, `S_IFLNK`, `S_IFMT` e `S_IFREG`.

##### Costanti della modalità file {#file-mode-constants}

Le seguenti costanti sono intese per l'uso con la proprietà `mode` dell'oggetto [\<fs.Stats\>](/it/nodejs/api/fs#class-fsstats) per determinare i permessi di accesso per un file.

| Costante | Descrizione |
| --- | --- |
| `S_IRWXU` | Modalità file che indica leggibilità, scrivibilità ed eseguibilità da parte del proprietario. |
| `S_IRUSR` | Modalità file che indica leggibilità da parte del proprietario. |
| `S_IWUSR` | Modalità file che indica scrivibilità da parte del proprietario. |
| `S_IXUSR` | Modalità file che indica eseguibilità da parte del proprietario. |
| `S_IRWXG` | Modalità file che indica leggibilità, scrivibilità ed eseguibilità da parte del gruppo. |
| `S_IRGRP` | Modalità file che indica leggibilità da parte del gruppo. |
| `S_IWGRP` | Modalità file che indica scrivibilità da parte del gruppo. |
| `S_IXGRP` | Modalità file che indica eseguibilità da parte del gruppo. |
| `S_IRWXO` | Modalità file che indica leggibilità, scrivibilità ed eseguibilità da parte di altri. |
| `S_IROTH` | Modalità file che indica leggibilità da parte di altri. |
| `S_IWOTH` | Modalità file che indica scrivibilità da parte di altri. |
| `S_IXOTH` | Modalità file che indica eseguibilità da parte di altri. |
Su Windows, sono disponibili solo `S_IRUSR` e `S_IWUSR`.

## Note {#notes}

### Ordinamento delle operazioni basate su callback e promise {#ordering-of-callback-and-promise-based-operations}

Poiché vengono eseguite in modo asincrono dal pool di thread sottostante, non vi è alcun ordinamento garantito quando si utilizzano i metodi basati su callback o promise.

Ad esempio, quanto segue è soggetto a errori perché l'operazione `fs.stat()` potrebbe essere completata prima dell'operazione `fs.rename()`:

```js [ESM]
const fs = require('node:fs');

fs.rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  console.log('rinominato completato');
});
fs.stat('/tmp/world', (err, stats) => {
  if (err) throw err;
  console.log(`stats: ${JSON.stringify(stats)}`);
});
```
È importante ordinare correttamente le operazioni attendendo i risultati di una prima di invocare l'altra:



::: code-group
```js [ESM]
import { rename, stat } from 'node:fs/promises';

const oldPath = '/tmp/hello';
const newPath = '/tmp/world';

try {
  await rename(oldPath, newPath);
  const stats = await stat(newPath);
  console.log(`stats: ${JSON.stringify(stats)}`);
} catch (error) {
  console.error('c'è stato un errore:', error.message);
}
```

```js [CJS]
const { rename, stat } = require('node:fs/promises');

(async function(oldPath, newPath) {
  try {
    await rename(oldPath, newPath);
    const stats = await stat(newPath);
    console.log(`stats: ${JSON.stringify(stats)}`);
  } catch (error) {
    console.error('c'è stato un errore:', error.message);
  }
})('/tmp/hello', '/tmp/world');
```
:::

Oppure, quando si utilizzano le API di callback, sposta la chiamata `fs.stat()` nel callback dell'operazione `fs.rename()`:



::: code-group
```js [ESM]
import { rename, stat } from 'node:fs';

rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  stat('/tmp/world', (err, stats) => {
    if (err) throw err;
    console.log(`stats: ${JSON.stringify(stats)}`);
  });
});
```

```js [CJS]
const { rename, stat } = require('node:fs/promises');

rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  stat('/tmp/world', (err, stats) => {
    if (err) throw err;
    console.log(`stats: ${JSON.stringify(stats)}`);
  });
});
```
:::


### Percorsi dei file {#file-paths}

La maggior parte delle operazioni `fs` accettano percorsi di file che possono essere specificati sotto forma di stringa, un [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) o un oggetto [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) utilizzando il protocollo `file:`.

#### Percorsi stringa {#string-paths}

I percorsi stringa vengono interpretati come sequenze di caratteri UTF-8 che identificano il nome del file assoluto o relativo. I percorsi relativi verranno risolti rispetto alla directory di lavoro corrente come determinato chiamando `process.cwd()`.

Esempio di utilizzo di un percorso assoluto su POSIX:

```js [ESM]
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('/open/some/file.txt', 'r');
  // Fai qualcosa con il file
} finally {
  await fd?.close();
}
```
Esempio di utilizzo di un percorso relativo su POSIX (relativo a `process.cwd()`):

```js [ESM]
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('file.txt', 'r');
  // Fai qualcosa con il file
} finally {
  await fd?.close();
}
```
#### Percorsi URL file {#file-url-paths}

**Aggiunto in: v7.6.0**

Per la maggior parte delle funzioni del modulo `node:fs`, l'argomento `path` o `filename` può essere passato come un oggetto [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) utilizzando il protocollo `file:`.

```js [ESM]
import { readFileSync } from 'node:fs';

readFileSync(new URL('file:///tmp/hello'));
```
Gli URL `file:` sono sempre percorsi assoluti.

##### Considerazioni specifiche della piattaforma {#platform-specific-considerations}

Su Windows, gli [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) `file:` con un nome host si convertono in percorsi UNC, mentre gli [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) `file:` con lettere di unità si convertono in percorsi assoluti locali. Gli [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) `file:` senza nome host e senza lettera di unità risulteranno in un errore:

```js [ESM]
import { readFileSync } from 'node:fs';
// Su Windows:

// - Gli URL file WHATWG con hostname si convertono in percorsi UNC
// file://hostname/p/a/t/h/file => \\hostname\p\a\t\h\file
readFileSync(new URL('file://hostname/p/a/t/h/file'));

// - Gli URL file WHATWG con lettere di unità si convertono in percorsi assoluti
// file:///C:/tmp/hello => C:\tmp\hello
readFileSync(new URL('file:///C:/tmp/hello'));

// - Gli URL file WHATWG senza hostname devono avere lettere di unità
readFileSync(new URL('file:///notdriveletter/p/a/t/h/file'));
readFileSync(new URL('file:///c/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must be absolute
```
Gli [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) `file:` con lettere di unità devono usare `:` come separatore subito dopo la lettera di unità. L'uso di un altro separatore comporterà un errore.

Su tutte le altre piattaforme, gli [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) `file:` con un nome host non sono supportati e comporteranno un errore:

```js [ESM]
import { readFileSync } from 'node:fs';
// Su altre piattaforme:

// - Gli URL file WHATWG con hostname non sono supportati
// file://hostname/p/a/t/h/file => throw!
readFileSync(new URL('file://hostname/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH]: must be absolute

// - Gli URL file WHATWG si convertono in percorsi assoluti
// file:///tmp/hello => /tmp/hello
readFileSync(new URL('file:///tmp/hello'));
```
Un [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) `file:` con caratteri slash codificati comporterà un errore su tutte le piattaforme:

```js [ESM]
import { readFileSync } from 'node:fs';

// Su Windows
readFileSync(new URL('file:///C:/p/a/t/h/%2F'));
readFileSync(new URL('file:///C:/p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded
\ or / characters */

// Su POSIX
readFileSync(new URL('file:///p/a/t/h/%2F'));
readFileSync(new URL('file:///p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded
/ characters */
```
Su Windows, gli [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) `file:` con backslash codificato comporterà un errore:

```js [ESM]
import { readFileSync } from 'node:fs';

// Su Windows
readFileSync(new URL('file:///C:/path/%5C'));
readFileSync(new URL('file:///C:/path/%5c'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded
\ or / characters */
```

#### Percorsi dei buffer {#buffer-paths}

I percorsi specificati utilizzando un [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) sono utili principalmente su determinati sistemi operativi POSIX che trattano i percorsi dei file come sequenze di byte opache. Su tali sistemi, è possibile che un singolo percorso di file contenga sottosequenze che utilizzano più codifiche di caratteri. Come con i percorsi stringa, i percorsi [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) possono essere relativi o assoluti:

Esempio di utilizzo di un percorso assoluto su POSIX:

```js [ESM]
import { open } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

let fd;
try {
  fd = await open(Buffer.from('/open/some/file.txt'), 'r');
  // Fai qualcosa con il file
} finally {
  await fd?.close();
}
```
#### Directory di lavoro per unità su Windows {#per-drive-working-directories-on-windows}

Su Windows, Node.js segue il concetto di directory di lavoro per unità. Questo comportamento può essere osservato quando si utilizza un percorso di unità senza una barra rovesciata. Ad esempio, `fs.readdirSync('C:\\')` può potenzialmente restituire un risultato diverso da `fs.readdirSync('C:')`. Per ulteriori informazioni, vedere [questa pagina MSDN](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#fully-qualified-vs-relative-paths).

### Descrittori di file {#file-descriptors_1}

Sui sistemi POSIX, per ogni processo, il kernel gestisce una tabella di file e risorse attualmente aperti. A ogni file aperto viene assegnato un semplice identificatore numerico chiamato *descrittore di file*. A livello di sistema, tutte le operazioni del file system utilizzano questi descrittori di file per identificare e tracciare ogni file specifico. I sistemi Windows utilizzano un meccanismo diverso ma concettualmente simile per tracciare le risorse. Per semplificare le cose per gli utenti, Node.js astrae le differenze tra i sistemi operativi e assegna a tutti i file aperti un descrittore di file numerico.

I metodi `fs.open()` basato su callback e `fs.openSync()` sincrono aprono un file e allocano un nuovo descrittore di file. Una volta allocato, il descrittore di file può essere utilizzato per leggere dati da, scrivere dati su o richiedere informazioni sul file.

I sistemi operativi limitano il numero di descrittori di file che possono essere aperti in un dato momento, quindi è fondamentale chiudere il descrittore al termine delle operazioni. In caso contrario, si verificherà una perdita di memoria che alla fine causerà l'arresto anomalo di un'applicazione.

```js [ESM]
import { open, close, fstat } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('/open/some/file.txt', 'r', (err, fd) => {
  if (err) throw err;
  try {
    fstat(fd, (err, stat) => {
      if (err) {
        closeFd(fd);
        throw err;
      }

      // use stat

      closeFd(fd);
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
});
```
Le API basate su promise utilizzano un oggetto [\<FileHandle\>](/it/nodejs/api/fs#class-filehandle) al posto del descrittore di file numerico. Questi oggetti sono gestiti meglio dal sistema per garantire che le risorse non vengano perse. Tuttavia, è comunque necessario che vengano chiusi al termine delle operazioni:

```js [ESM]
import { open } from 'node:fs/promises';

let file;
try {
  file = await open('/open/some/file.txt', 'r');
  const stat = await file.stat();
  // use stat
} finally {
  await file.close();
}
```

### Utilizzo del threadpool {#threadpool-usage}

Tutte le API del file system basate su callback e promise (ad eccezione di `fs.FSWatcher()`) utilizzano il threadpool di libuv. Questo può avere implicazioni prestazionali sorprendenti e negative per alcune applicazioni. Consulta la documentazione [`UV_THREADPOOL_SIZE`](/it/nodejs/api/cli#uv_threadpool_sizesize) per maggiori informazioni.

### Flag del file system {#file-system-flags}

I seguenti flag sono disponibili ovunque l'opzione `flag` accetti una stringa.

-  `'a'`: Apri il file per l'aggiunta. Il file viene creato se non esiste.
-  `'ax'`: Come `'a'` ma fallisce se il percorso esiste.
-  `'a+'`: Apri il file per la lettura e l'aggiunta. Il file viene creato se non esiste.
-  `'ax+'`: Come `'a+'` ma fallisce se il percorso esiste.
-  `'as'`: Apri il file per l'aggiunta in modalità sincrona. Il file viene creato se non esiste.
-  `'as+'`: Apri il file per la lettura e l'aggiunta in modalità sincrona. Il file viene creato se non esiste.
-  `'r'`: Apri il file per la lettura. Si verifica un'eccezione se il file non esiste.
-  `'rs'`: Apri il file per la lettura in modalità sincrona. Si verifica un'eccezione se il file non esiste.
-  `'r+'`: Apri il file per la lettura e la scrittura. Si verifica un'eccezione se il file non esiste.
-  `'rs+'`: Apri il file per la lettura e la scrittura in modalità sincrona. Indica al sistema operativo di bypassare la cache locale del file system. Questo è utile principalmente per aprire file su mount NFS in quanto consente di saltare la cache locale potenzialmente obsoleta. Ha un impatto molto reale sulle prestazioni I/O, quindi l'uso di questo flag non è raccomandato a meno che non sia necessario. Questo non trasforma `fs.open()` o `fsPromises.open()` in una chiamata di blocco sincrona. Se si desidera un'operazione sincrona, è necessario utilizzare qualcosa come `fs.openSync()`.
-  `'w'`: Apri il file per la scrittura. Il file viene creato (se non esiste) o troncato (se esiste).
-  `'wx'`: Come `'w'` ma fallisce se il percorso esiste.
-  `'w+'`: Apri il file per la lettura e la scrittura. Il file viene creato (se non esiste) o troncato (se esiste).
-  `'wx+'`: Come `'w+'` ma fallisce se il percorso esiste.

`flag` può anche essere un numero come documentato da [`open(2)`](http://man7.org/linux/man-pages/man2/open.2); le costanti comunemente usate sono disponibili da `fs.constants`. Su Windows, i flag vengono tradotti nei loro equivalenti ove applicabile, ad esempio `O_WRONLY` in `FILE_GENERIC_WRITE` o `O_EXCL|O_CREAT` in `CREATE_NEW`, come accettato da `CreateFileW`.

Il flag esclusivo `'x'` (flag `O_EXCL` in [`open(2)`](http://man7.org/linux/man-pages/man2/open.2)) fa sì che l'operazione restituisca un errore se il percorso esiste già. Su POSIX, se il percorso è un collegamento simbolico, l'utilizzo di `O_EXCL` restituisce un errore anche se il collegamento punta a un percorso che non esiste. Il flag esclusivo potrebbe non funzionare con i file system di rete.

Su Linux, le scritture posizionali non funzionano quando il file viene aperto in modalità di aggiunta. Il kernel ignora l'argomento della posizione e aggiunge sempre i dati alla fine del file.

La modifica di un file anziché la sua sostituzione potrebbe richiedere che l'opzione `flag` sia impostata su `'r+'` anziché sul valore predefinito `'w'`.

Il comportamento di alcuni flag è specifico della piattaforma. Pertanto, l'apertura di una directory su macOS e Linux con il flag `'a+'`, come nell'esempio seguente, restituirà un errore. Al contrario, su Windows e FreeBSD, verrà restituito un descrittore di file o un `FileHandle`.

```js [ESM]
// macOS e Linux
fs.open('<directory>', 'a+', (err, fd) => {
  // => [Error: EISDIR: illegal operation on a directory, open <directory>]
});

// Windows e FreeBSD
fs.open('<directory>', 'a+', (err, fd) => {
  // => null, <fd>
});
```
Su Windows, l'apertura di un file nascosto esistente utilizzando il flag `'w'` (tramite `fs.open()`, `fs.writeFile()` o `fsPromises.open()`) fallirà con `EPERM`. I file nascosti esistenti possono essere aperti per la scrittura con il flag `'r+'`.

Una chiamata a `fs.ftruncate()` o `filehandle.truncate()` può essere utilizzata per reimpostare il contenuto del file.

