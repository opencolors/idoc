---
title: Node.js Dateisystem API Dokumentation
description: Umfassender Leitfaden zum Node.js Dateisystemmodul, das Methoden für Dateioperationen wie Lesen, Schreiben, Öffnen, Schließen und das Verwalten von Dateiberechtigungen und -statistiken beschreibt.
head:
  - - meta
    - name: og:title
      content: Node.js Dateisystem API Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Umfassender Leitfaden zum Node.js Dateisystemmodul, das Methoden für Dateioperationen wie Lesen, Schreiben, Öffnen, Schließen und das Verwalten von Dateiberechtigungen und -statistiken beschreibt.
  - - meta
    - name: twitter:title
      content: Node.js Dateisystem API Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Umfassender Leitfaden zum Node.js Dateisystemmodul, das Methoden für Dateioperationen wie Lesen, Schreiben, Öffnen, Schließen und das Verwalten von Dateiberechtigungen und -statistiken beschreibt.
---


# Dateisystem {#file-system}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/fs.js](https://github.com/nodejs/node/blob/v23.5.0/lib/fs.js)

Das Modul `node:fs` ermöglicht die Interaktion mit dem Dateisystem auf eine Weise, die an Standard-POSIX-Funktionen angelehnt ist.

So verwenden Sie die Promise-basierten APIs:

::: code-group
```js [ESM]
import * as fs from 'node:fs/promises';
```

```js [CJS]
const fs = require('node:fs/promises');
```
:::

So verwenden Sie die Callback- und Sync-APIs:

::: code-group
```js [ESM]
import * as fs from 'node:fs';
```

```js [CJS]
const fs = require('node:fs');
```
:::

Alle Dateisystemoperationen haben synchrone, Callback- und Promise-basierte Formen und sind sowohl mit der CommonJS-Syntax als auch mit ES6-Modulen (ESM) zugänglich.

## Promise-Beispiel {#promise-example}

Promise-basierte Operationen geben ein Promise zurück, das erfüllt wird, wenn die asynchrone Operation abgeschlossen ist.

::: code-group
```js [ESM]
import { unlink } from 'node:fs/promises';

try {
  await unlink('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (error) {
  console.error('there was an error:', error.message);
}
```

```js [CJS]
const { unlink } = require('node:fs/promises');

(async function(path) {
  try {
    await unlink(path);
    console.log(`successfully deleted ${path}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})('/tmp/hello');
```
:::

## Callback-Beispiel {#callback-example}

Die Callback-Form nimmt eine Completion-Callback-Funktion als letztes Argument entgegen und ruft die Operation asynchron auf. Die an den Completion-Callback übergebenen Argumente hängen von der Methode ab, aber das erste Argument ist immer für eine Ausnahme reserviert. Wenn die Operation erfolgreich abgeschlossen wurde, ist das erste Argument `null` oder `undefined`.

::: code-group
```js [ESM]
import { unlink } from 'node:fs';

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
```

```js [CJS]
const { unlink } = require('node:fs');

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
```
:::

Die Callback-basierten Versionen der `node:fs`-Modul-APIs sind der Verwendung der Promise-APIs vorzuziehen, wenn maximale Leistung (sowohl in Bezug auf Ausführungszeit als auch auf Speicherbelegung) erforderlich ist.


## Synchrones Beispiel {#synchronous-example}

Die synchronen APIs blockieren die Node.js-Ereignisschleife und die weitere JavaScript-Ausführung, bis die Operation abgeschlossen ist. Ausnahmen werden sofort ausgelöst und können mit `try…catch` behandelt oder nach oben weitergeleitet werden.

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

## Promises API {#promises-api}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v14.0.0 | Als `require('fs/promises')` verfügbar gemacht. |
| v11.14.0, v10.17.0 | Diese API ist nicht mehr experimentell. |
| v10.1.0 | Die API ist nur über `require('fs').promises` zugänglich. |
| v10.0.0 | Hinzugefügt in: v10.0.0 |
:::

Die `fs/promises`-API bietet asynchrone Dateisystemmethoden, die Promises zurückgeben.

Die Promise-APIs verwenden den zugrunde liegenden Node.js-Threadpool, um Dateisystemoperationen außerhalb des Ereignisschleifen-Threads durchzuführen. Diese Operationen sind nicht synchronisiert oder threadsicher. Bei der Durchführung mehrerer gleichzeitiger Änderungen an derselben Datei ist Vorsicht geboten, da es sonst zu Datenbeschädigungen kommen kann.

### Klasse: `FileHandle` {#class-filehandle}

**Hinzugefügt in: v10.0.0**

Ein [\<FileHandle\>](/de/nodejs/api/fs#class-filehandle)-Objekt ist ein Objekt-Wrapper für einen numerischen Dateideskriptor.

Instanzen des [\<FileHandle\>](/de/nodejs/api/fs#class-filehandle)-Objekts werden durch die `fsPromises.open()`-Methode erstellt.

Alle [\<FileHandle\>](/de/nodejs/api/fs#class-filehandle)-Objekte sind [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)s.

Wenn ein [\<FileHandle\>](/de/nodejs/api/fs#class-filehandle) nicht mit der Methode `filehandle.close()` geschlossen wird, wird versucht, den Dateideskriptor automatisch zu schließen und eine Prozesswarnung auszugeben, um Speicherlecks zu vermeiden. Bitte verlassen Sie sich nicht auf dieses Verhalten, da es unzuverlässig sein kann und die Datei möglicherweise nicht geschlossen wird. Schließen Sie stattdessen immer explizit [\<FileHandle\>](/de/nodejs/api/fs#class-filehandle)s. Node.js kann dieses Verhalten in der Zukunft ändern.


#### Ereignis: `'close'` {#event-close}

**Hinzugefügt in: v15.4.0**

Das `'close'`-Ereignis wird ausgelöst, wenn der [\<FileHandle\>](/de/nodejs/api/fs#class-filehandle) geschlossen wurde und nicht mehr verwendet werden kann.

#### `filehandle.appendFile(data[, options])` {#filehandleappendfiledata-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.1.0, v20.10.0 | Die Option `flush` wird jetzt unterstützt. |
| v15.14.0, v14.18.0 | Das Argument `data` unterstützt jetzt `AsyncIterable`, `Iterable` und `Stream`. |
| v14.0.0 | Der Parameter `data` erzwingt nicht länger, dass nicht unterstützte Eingaben in Strings umgewandelt werden. |
| v10.0.0 | Hinzugefügt in: v10.0.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/de/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `'utf8'`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird der zugrunde liegende Dateideskriptor geleert, bevor er geschlossen wird. **Standard:** `false`.
  
 
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird bei Erfolg mit `undefined` aufgelöst.

Alias von [`filehandle.writeFile()`](/de/nodejs/api/fs#filehandlewritefiledata-options).

Beim Arbeiten mit Dateihandles kann der Modus nicht von dem geändert werden, auf den er mit [`fsPromises.open()`](/de/nodejs/api/fs#fspromisesopenpath-flags-mode) gesetzt wurde. Daher ist dies äquivalent zu [`filehandle.writeFile()`](/de/nodejs/api/fs#filehandlewritefiledata-options).


#### `filehandle.chmod(mode)` {#filehandlechmodmode}

**Hinzugefügt in: v10.0.0**

- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Bitmaske des Dateimodus.
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird bei Erfolg mit `undefined` erfüllt.

Ändert die Berechtigungen der Datei. Siehe [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2).

#### `filehandle.chown(uid, gid)` {#filehandlechownuid-gid}

**Hinzugefügt in: v10.0.0**

- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die User-ID des neuen Besitzers der Datei.
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Gruppen-ID der neuen Gruppe der Datei.
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird bei Erfolg mit `undefined` erfüllt.

Ändert den Eigentümer der Datei. Ein Wrapper für [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2).

#### `filehandle.close()` {#filehandleclose}

**Hinzugefügt in: v10.0.0**

- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird bei Erfolg mit `undefined` erfüllt.

Schließt den File Handle, nachdem alle ausstehenden Operationen auf dem Handle abgeschlossen wurden.

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

**Hinzugefügt in: v16.11.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard:** `null`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `64 * 1024`
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) **Standard:** `undefined`


- Gibt zurück: [\<fs.ReadStream\>](/de/nodejs/api/fs#class-fsreadstream)

`options` kann `start`- und `end`-Werte enthalten, um einen Bereich von Bytes aus der Datei anstelle der gesamten Datei zu lesen. Sowohl `start` als auch `end` sind inklusive und beginnen bei 0 zu zählen. Zulässige Werte liegen im Bereich [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. Wenn `start` ausgelassen oder `undefined` ist, liest `filehandle.createReadStream()` sequentiell von der aktuellen Dateiposition. Die `encoding` kann eine derjenigen sein, die von [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) akzeptiert werden.

Wenn der `FileHandle` auf ein Zeichengerät verweist, das nur blockierende Lesevorgänge unterstützt (z. B. Tastatur oder Soundkarte), werden Lesevorgänge erst abgeschlossen, wenn Daten verfügbar sind. Dies kann verhindern, dass der Prozess beendet und der Stream auf natürliche Weise geschlossen wird.

Standardmäßig gibt der Stream ein `'close'`-Ereignis aus, nachdem er zerstört wurde. Setzen Sie die Option `emitClose` auf `false`, um dieses Verhalten zu ändern.

```js [ESM]
import { open } from 'node:fs/promises';

const fd = await open('/dev/input/event0');
// Erstellt einen Stream von einem Zeichengerät.
const stream = fd.createReadStream();
setTimeout(() => {
  stream.close(); // Dies schließt den Stream möglicherweise nicht.
  // Das künstliche Markieren des Endes des Streams, so als ob die zugrunde liegende Ressource
  // selbst das Dateiende angezeigt hätte, ermöglicht das Schließen des Streams.
  // Dies bricht keine ausstehenden Lesevorgänge ab, und wenn ein solcher
  // Vorgang vorhanden ist, kann der Prozess möglicherweise erst dann erfolgreich beendet werden,
  // bis er abgeschlossen ist.
  stream.push(null);
  stream.read(0);
}, 100);
```
Wenn `autoClose` false ist, wird der File Descriptor nicht geschlossen, auch wenn ein Fehler auftritt. Es liegt in der Verantwortung der Anwendung, ihn zu schließen und sicherzustellen, dass kein File Descriptor Leak entsteht. Wenn `autoClose` auf true gesetzt ist (Standardverhalten), wird der File Descriptor bei `'error'` oder `'end'` automatisch geschlossen.

Ein Beispiel zum Lesen der letzten 10 Bytes einer Datei, die 100 Bytes lang ist:

```js [ESM]
import { open } from 'node:fs/promises';

const fd = await open('sample.txt');
fd.createReadStream({ start: 90, end: 99 });
```

#### `filehandle.createWriteStream([options])` {#filehandlecreatewritestreamoptions}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.0.0, v20.10.0 | Die Option `flush` wird jetzt unterstützt. |
| v16.11.0 | Hinzugefügt in: v16.11.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard:** `'utf8'`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `16384`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird der zugrunde liegende File Descriptor vor dem Schließen geleert. **Standard:** `false`.

- Gibt zurück: [\<fs.WriteStream\>](/de/nodejs/api/fs#class-fswritestream)

`options` kann auch eine `start`-Option enthalten, um das Schreiben von Daten an einer Position nach dem Dateianfang zu ermöglichen. Zulässige Werte liegen im Bereich [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. Das Ändern einer Datei anstatt sie zu ersetzen, erfordert möglicherweise, dass die `flags` `open`-Option auf `r+` anstatt auf den Standardwert `r` gesetzt wird. Die `encoding` kann eine derjenigen sein, die von [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) akzeptiert werden.

Wenn `autoClose` auf true gesetzt ist (Standardverhalten), wird der File Descriptor bei `'error'` oder `'finish'` automatisch geschlossen. Wenn `autoClose` false ist, wird der File Descriptor nicht geschlossen, selbst wenn ein Fehler auftritt. Es liegt in der Verantwortung der Anwendung, ihn zu schließen und sicherzustellen, dass kein File Descriptor-Leck auftritt.

Standardmäßig gibt der Stream ein `'close'`-Ereignis aus, nachdem er zerstört wurde. Setzen Sie die Option `emitClose` auf `false`, um dieses Verhalten zu ändern.


#### `filehandle.datasync()` {#filehandledatasync}

**Hinzugefügt in: v10.0.0**

- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird bei Erfolg mit `undefined` erfüllt.

Erzwingt, dass alle aktuell in der Warteschlange stehenden I/O-Operationen, die mit der Datei verbunden sind, in den synchronisierten I/O-Abschlusszustand des Betriebssystems übergehen. Weitere Informationen finden Sie in der POSIX-Dokumentation [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2).

Im Gegensatz zu `filehandle.sync` leert diese Methode keine geänderten Metadaten.

#### `filehandle.fd` {#filehandlefd}

**Hinzugefügt in: v10.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der numerische Dateideskriptor, der vom [\<FileHandle\>](/de/nodejs/api/fs#class-filehandle)-Objekt verwaltet wird.

#### `filehandle.read(buffer, offset, length, position)` {#filehandlereadbuffer-offset-length-position}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.0.0 | Akzeptiert BigInt-Werte als `position`. |
| v10.0.0 | Hinzugefügt in: v10.0.0 |
:::

- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Ein Puffer, der mit den gelesenen Dateidaten gefüllt wird.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Position im Puffer, ab der mit dem Füllen begonnen werden soll. **Standard:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der zu lesenden Bytes. **Standard:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Die Position, ab der mit dem Lesen von Daten aus der Datei begonnen werden soll. Wenn `null` oder `-1`, werden Daten ab der aktuellen Dateiposition gelesen und die Position wird aktualisiert. Wenn `position` eine nicht-negative Ganzzahl ist, bleibt die aktuelle Dateiposition unverändert. **Standard:**: `null`
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird bei Erfolg mit einem Objekt mit zwei Eigenschaften erfüllt:
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der gelesenen Bytes
    - `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Eine Referenz auf das übergebene `buffer`-Argument.

Liest Daten aus der Datei und speichert diese im angegebenen Puffer.

Wenn die Datei nicht gleichzeitig geändert wird, wird das Dateiende erreicht, wenn die Anzahl der gelesenen Bytes Null ist.


#### `filehandle.read([options])` {#filehandlereadoptions}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v21.0.0 | Akzeptiert BigInt-Werte als `position`. |
| v13.11.0, v12.17.0 | Hinzugefügt in: v13.11.0, v12.17.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Ein Puffer, der mit den gelesenen Dateidaten gefüllt wird. **Standard:** `Buffer.alloc(16384)`
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Position im Puffer, an der mit dem Füllen begonnen werden soll. **Standard:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der zu lesenden Bytes. **Standard:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Die Position, an der mit dem Lesen von Daten aus der Datei begonnen werden soll. Wenn `null` oder `-1`, werden Daten von der aktuellen Dateiposition gelesen und die Position wird aktualisiert. Wenn `position` eine nicht-negative ganze Zahl ist, bleibt die aktuelle Dateiposition unverändert. **Standard:**: `null`


- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird bei Erfolg mit einem Objekt mit zwei Eigenschaften erfüllt:
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der gelesenen Bytes
    - `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Eine Referenz auf das übergebene `buffer`-Argument.



Liest Daten aus der Datei und speichert diese im angegebenen Puffer.

Wenn die Datei nicht gleichzeitig geändert wird, wird das Dateiende erreicht, wenn die Anzahl der gelesenen Bytes Null ist.


#### `filehandle.read(buffer[, options])` {#filehandlereadbuffer-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v21.0.0 | Akzeptiert BigInt-Werte als `position`. |
| v18.2.0, v16.17.0 | Hinzugefügt in: v18.2.0, v16.17.0 |
:::

- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Ein Puffer, der mit den gelesenen Dateidaten gefüllt wird.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Position im Puffer, an der mit dem Füllen begonnen werden soll. **Standard:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der zu lesenden Bytes. **Standard:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Die Position, an der mit dem Lesen von Daten aus der Datei begonnen werden soll. Wenn `null` oder `-1`, werden Daten ab der aktuellen Dateiposition gelesen und die Position wird aktualisiert. Wenn `position` eine nicht-negative Ganzzahl ist, bleibt die aktuelle Dateiposition unverändert. **Standard:** `null`

- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird bei Erfolg mit einem Objekt mit zwei Eigenschaften aufgelöst:
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der gelesenen Bytes
    - `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Eine Referenz auf das übergebene `buffer`-Argument.

Liest Daten aus der Datei und speichert diese in dem angegebenen Puffer.

Wenn die Datei nicht gleichzeitig geändert wird, wird das Dateiende erreicht, wenn die Anzahl der gelesenen Bytes Null ist.


#### `filehandle.readableWebStream([options])` {#filehandlereadablewebstreamoptions}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.0.0, v18.17.0 | Option zum Erstellen eines 'bytes'-Streams hinzugefügt. |
| v17.0.0 | Hinzugefügt in: v17.0.0 |
:::

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Ob ein normaler oder ein `'bytes'`-Stream geöffnet werden soll. **Standard:** `undefined`
  
 
-  Gibt zurück: [\<ReadableStream\>](/de/nodejs/api/webstreams#class-readablestream)

Gibt einen `ReadableStream` zurück, der zum Lesen der Dateidaten verwendet werden kann.

Es wird ein Fehler ausgelöst, wenn diese Methode mehr als einmal aufgerufen wird oder nachdem das `FileHandle` geschlossen wird oder sich im Schließvorgang befindet.

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

Obwohl der `ReadableStream` die Datei bis zum Ende liest, wird das `FileHandle` nicht automatisch geschlossen. Der Benutzercode muss weiterhin die Methode `fileHandle.close()` aufrufen.

#### `filehandle.readFile(options)` {#filehandlereadfileoptions}

**Hinzugefügt in: v10.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `null`
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) ermöglicht das Abbrechen eines laufenden readFile
  
 
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird nach erfolgreichem Lesen mit dem Inhalt der Datei erfüllt. Wenn keine Kodierung angegeben wird (unter Verwendung von `options.encoding`), werden die Daten als [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)-Objekt zurückgegeben. Andernfalls sind die Daten eine Zeichenkette.

Liest asynchron den gesamten Inhalt einer Datei.

Wenn `options` eine Zeichenkette ist, dann gibt sie die `encoding` an.

Das [\<FileHandle\>](/de/nodejs/api/fs#class-filehandle) muss das Lesen unterstützen.

Wenn ein oder mehrere `filehandle.read()`-Aufrufe für ein File Handle gemacht werden und dann ein `filehandle.readFile()`-Aufruf erfolgt, werden die Daten von der aktuellen Position bis zum Ende der Datei gelesen. Es wird nicht immer vom Anfang der Datei gelesen.


#### `filehandle.readLines([options])` {#filehandlereadlinesoptions}

**Hinzugefügt in: v18.11.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standardwert:** `null`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standardwert:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standardwert:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standardwert:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standardwert:** `64 * 1024`
  
 
- Gibt zurück: [\<readline.InterfaceConstructor\>](/de/nodejs/api/readline#class-interfaceconstructor)

Komfortmethode zur Erstellung einer `readline`-Schnittstelle und zum Streamen über die Datei. Siehe [`filehandle.createReadStream()`](/de/nodejs/api/fs#filehandlecreatereadstreamoptions) für die Optionen.



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

**Hinzugefügt in: v13.13.0, v12.17.0**

- `buffers` [\<Buffer[]\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Der Offset vom Anfang der Datei, ab dem die Daten gelesen werden sollen. Wenn `position` keine `number` ist, werden die Daten ab der aktuellen Position gelesen. **Standardwert:** `null`
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird bei Erfolg mit einem Objekt erfüllt, das zwei Eigenschaften enthält:
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) die Anzahl der gelesenen Bytes
    - `buffers` [\<Buffer[]\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Eigenschaft, die einen Verweis auf die `buffers`-Eingabe enthält.
  
 

Liest aus einer Datei und schreibt in ein Array von [\<ArrayBufferView\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)s


#### `filehandle.stat([options])` {#filehandlestatoptions}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.5.0 | Akzeptiert ein zusätzliches `options`-Objekt, um anzugeben, ob die zurückgegebenen numerischen Werte BigInt sein sollen. |
| v10.0.0 | Hinzugefügt in: v10.0.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ob die numerischen Werte im zurückgegebenen [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)-Objekt `bigint` sein sollen. **Standard:** `false`.

- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit einem [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats) für die Datei erfüllt.

#### `filehandle.sync()` {#filehandlesync}

**Hinzugefügt in: v10.0.0**

- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird bei Erfolg mit `undefined` erfüllt.

Fordert an, dass alle Daten für den offenen Dateideskriptor auf das Speichergerät geschrieben werden. Die spezifische Implementierung ist betriebssystem- und gerätespezifisch. Weitere Einzelheiten finden Sie in der POSIX-Dokumentation [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2).

#### `filehandle.truncate(len)` {#filehandletruncatelen}

**Hinzugefügt in: v10.0.0**

- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `0`
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird bei Erfolg mit `undefined` erfüllt.

Kürzt die Datei.

Wenn die Datei größer als `len` Bytes war, werden nur die ersten `len` Bytes in der Datei beibehalten.

Das folgende Beispiel behält nur die ersten vier Bytes der Datei:

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
Wenn die Datei zuvor kürzer als `len` Bytes war, wird sie erweitert, und der erweiterte Teil wird mit Null-Bytes (`'\0'`) gefüllt:

Wenn `len` negativ ist, wird `0` verwendet.


#### `filehandle.utimes(atime, mtime)` {#filehandleutimesatime-mtime}

**Hinzugefügt in: v10.0.0**

- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Ändert die Dateisystem-Zeitstempel des Objekts, auf das durch das [\<FileHandle\>](/de/nodejs/api/fs#class-filehandle) verwiesen wird, und erfüllt dann das Promise ohne Argumente nach erfolgreichem Abschluss.

#### `filehandle.write(buffer, offset[, length[, position]])` {#filehandlewritebuffer-offset-length-position}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.0.0 | Der `buffer`-Parameter wandelt nicht länger nicht unterstützte Eingaben in Puffer um. |
| v10.0.0 | Hinzugefügt in: v10.0.0 |
:::

- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Startposition innerhalb von `buffer`, an der die zu schreibenden Daten beginnen.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der zu schreibenden Bytes aus `buffer`. **Standard:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Der Offset vom Anfang der Datei, an dem die Daten aus `buffer` geschrieben werden sollen. Wenn `position` keine `number` ist, werden die Daten an der aktuellen Position geschrieben. Weitere Informationen finden Sie in der POSIX [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2) Dokumentation. **Standard:** `null`
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Schreibt `buffer` in die Datei.

Das Promise wird mit einem Objekt erfüllt, das zwei Eigenschaften enthält:

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) die Anzahl der geschriebenen Bytes
- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) ein Verweis auf den geschriebenen `buffer`.

Es ist unsicher, `filehandle.write()` mehrmals auf derselben Datei zu verwenden, ohne darauf zu warten, dass das Promise erfüllt (oder abgelehnt) wird. Verwenden Sie für dieses Szenario [`filehandle.createWriteStream()`](/de/nodejs/api/fs#filehandlecreatewritestreamoptions).

Unter Linux funktionieren positionelle Schreibvorgänge nicht, wenn die Datei im Anhängemodus geöffnet wird. Der Kernel ignoriert das Positionsargument und hängt die Daten immer an das Ende der Datei an.


#### `filehandle.write(buffer[, options])` {#filehandlewritebuffer-options}

**Hinzugefügt in: v18.3.0, v16.17.0**

- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standardwert:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standardwert:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standardwert:** `null`


- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Schreibt `buffer` in die Datei.

Ähnlich der obigen Funktion `filehandle.write` akzeptiert diese Version ein optionales `options`-Objekt. Wenn kein `options`-Objekt angegeben wird, werden standardmäßig die oben genannten Werte verwendet.

#### `filehandle.write(string[, position[, encoding]])` {#filehandlewritestring-position-encoding}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.0.0 | Der Parameter `string` erzwingt keine nicht unterstützten Eingaben mehr in Strings. |
| v10.0.0 | Hinzugefügt in: v10.0.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Der Offset vom Anfang der Datei, an dem die Daten von `string` geschrieben werden sollen. Wenn `position` keine `number` ist, werden die Daten an der aktuellen Position geschrieben. Weitere Informationen finden Sie in der POSIX-Dokumentation [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2). **Standardwert:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die erwartete String-Kodierung. **Standardwert:** `'utf8'`
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Schreibt `string` in die Datei. Wenn `string` kein String ist, wird das Promise mit einem Fehler abgelehnt.

Das Promise wird mit einem Objekt erfüllt, das zwei Eigenschaften enthält:

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) die Anzahl der geschriebenen Bytes
- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) eine Referenz auf den geschriebenen `string`.

Es ist unsicher, `filehandle.write()` mehrmals auf derselben Datei zu verwenden, ohne auf die Erfüllung (oder Ablehnung) des Promise zu warten. Verwenden Sie für dieses Szenario [`filehandle.createWriteStream()`](/de/nodejs/api/fs#filehandlecreatewritestreamoptions).

Unter Linux funktionieren positionelle Schreibvorgänge nicht, wenn die Datei im Anhängemodus geöffnet wird. Der Kernel ignoriert das Positionsargument und hängt die Daten immer an das Ende der Datei an.


#### `filehandle.writeFile(data, options)` {#filehandlewritefiledata-options}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v15.14.0, v14.18.0 | Das `data`-Argument unterstützt `AsyncIterable`, `Iterable` und `Stream`. |
| v14.0.0 | Der `data`-Parameter zwingt nicht mehr unterstützte Eingaben nicht mehr zu Strings. |
| v10.0.0 | Hinzugefügt in: v10.0.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/de/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Die erwartete Zeichenkodierung, wenn `data` ein String ist. **Standard:** `'utf8'`

- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Schreibt asynchron Daten in eine Datei und ersetzt die Datei, falls sie bereits existiert. `data` kann ein String, ein Buffer, ein [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) oder ein [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol)-Objekt sein. Die Promise wird bei Erfolg ohne Argumente erfüllt.

Wenn `options` ein String ist, dann spezifiziert er die `encoding`.

Das [\<FileHandle\>](/de/nodejs/api/fs#class-filehandle) muss Schreiben unterstützen.

Es ist unsicher, `filehandle.writeFile()` mehrmals auf derselben Datei zu verwenden, ohne darauf zu warten, dass die Promise erfüllt (oder abgelehnt) wird.

Wenn ein oder mehrere `filehandle.write()`-Aufrufe auf einem File-Handle getätigt werden und dann ein `filehandle.writeFile()`-Aufruf erfolgt, werden die Daten von der aktuellen Position bis zum Ende der Datei geschrieben. Es wird nicht immer vom Anfang der Datei geschrieben.


#### `filehandle.writev(buffers[, position])` {#filehandlewritevbuffers-position}

**Hinzugefügt in: v12.9.0**

- `buffers` [\<Buffer[]\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Der Offset vom Anfang der Datei, an dem die Daten aus `buffers` geschrieben werden sollen. Wenn `position` keine `number` ist, werden die Daten an der aktuellen Position geschrieben. **Standard:** `null`
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Schreibt ein Array von [\<ArrayBufferView\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)s in die Datei.

Die Promise wird mit einem Objekt erfüllt, das zwei Eigenschaften enthält:

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der geschriebenen Bytes
- `buffers` [\<Buffer[]\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Eine Referenz auf die Eingabe `buffers`.

Es ist unsicher, `writev()` mehrmals auf derselben Datei aufzurufen, ohne zu warten, bis die Promise erfüllt (oder abgelehnt) wurde.

Unter Linux funktionieren positionelle Schreibvorgänge nicht, wenn die Datei im Anhängemodus geöffnet wird. Der Kernel ignoriert das Positionsargument und hängt die Daten immer an das Ende der Datei an.

#### `filehandle[Symbol.asyncDispose]()` {#filehandlesymbolasyncdispose}

**Hinzugefügt in: v20.4.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Ein Alias für `filehandle.close()`.


### `fsPromises.access(path[, mode])` {#fspromisesaccesspath-mode}

**Hinzugefügt in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standardwert:** `fs.constants.F_OK`
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird bei Erfolg mit `undefined` erfüllt.

Testet die Berechtigungen eines Benutzers für die durch `path` angegebene Datei oder das Verzeichnis. Das Argument `mode` ist eine optionale Ganzzahl, die die durchzuführenden Zugänglichkeitsprüfungen angibt. `mode` sollte entweder der Wert `fs.constants.F_OK` oder eine Maske sein, die aus dem bitweisen ODER von `fs.constants.R_OK`, `fs.constants.W_OK` und `fs.constants.X_OK` besteht (z. B. `fs.constants.W_OK | fs.constants.R_OK`). Informationen zu möglichen Werten für `mode` finden Sie unter [Datei-Zugriffskonstanten](/de/nodejs/api/fs#file-access-constants).

Wenn die Zugänglichkeitsprüfung erfolgreich ist, wird das Promise ohne Wert erfüllt. Wenn eine der Zugänglichkeitsprüfungen fehlschlägt, wird das Promise mit einem [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)-Objekt abgelehnt. Das folgende Beispiel prüft, ob die Datei `/etc/passwd` vom aktuellen Prozess gelesen und geschrieben werden kann.

```js [ESM]
import { access, constants } from 'node:fs/promises';

try {
  await access('/etc/passwd', constants.R_OK | constants.W_OK);
  console.log('can access');
} catch {
  console.error('cannot access');
}
```
Die Verwendung von `fsPromises.access()`, um die Zugänglichkeit einer Datei zu überprüfen, bevor `fsPromises.open()` aufgerufen wird, wird nicht empfohlen. Dies führt zu einer Race Condition, da andere Prozesse den Dateistatus zwischen den beiden Aufrufen ändern können. Stattdessen sollte der Benutzercode die Datei direkt öffnen/lesen/schreiben und den Fehler behandeln, der ausgelöst wird, wenn die Datei nicht zugänglich ist.

### `fsPromises.appendFile(path, data[, options])` {#fspromisesappendfilepath-data-options}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.1.0, v20.10.0 | Die Option `flush` wird jetzt unterstützt. |
| v10.0.0 | Hinzugefügt in: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/de/nodejs/api/fs#class-filehandle) Dateiname oder [\<FileHandle\>](/de/nodejs/api/fs#class-filehandle)
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standardwert:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standardwert:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Siehe [Unterstützung von Datei System `flags`](/de/nodejs/api/fs#file-system-flags). **Standardwert:** `'a'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird der zugrunde liegende Dateideskriptor vor dem Schließen geleert. **Standardwert:** `false`.

- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird bei Erfolg mit `undefined` erfüllt.

Fügt Daten asynchron an eine Datei an und erstellt die Datei, falls sie noch nicht vorhanden ist. `data` kann ein String oder ein [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) sein.

Wenn `options` ein String ist, dann gibt er die `encoding` an.

Die Option `mode` wirkt sich nur auf die neu erstellte Datei aus. Weitere Details finden Sie unter [`fs.open()`](/de/nodejs/api/fs#fsopenpath-flags-mode-callback).

Der `path` kann als [\<FileHandle\>](/de/nodejs/api/fs#class-filehandle) angegeben werden, der zum Anhängen geöffnet wurde (mit `fsPromises.open()`).


### `fsPromises.chmod(path, mode)` {#fspromiseschmodpath-mode}

**Hinzugefügt in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird bei Erfolg mit `undefined` erfüllt.

Ändert die Berechtigungen einer Datei.

### `fsPromises.chown(path, uid, gid)` {#fspromiseschownpath-uid-gid}

**Hinzugefügt in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird bei Erfolg mit `undefined` erfüllt.

Ändert den Besitz einer Datei.

### `fsPromises.copyFile(src, dest[, mode])` {#fspromisescopyfilesrc-dest-mode}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.0.0 | Das Argument `flags` wurde in `mode` geändert und eine strengere Typvalidierung auferlegt. |
| v10.0.0 | Hinzugefügt in: v10.0.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Quelldateiname zum Kopieren
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Zieldateiname des Kopiervorgangs
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Optionale Modifikatoren, die das Verhalten des Kopiervorgangs festlegen. Es ist möglich, eine Maske zu erstellen, die aus dem bitweisen OR von zwei oder mehr Werten besteht (z. B. `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`) **Standard:** `0`.
    - `fs.constants.COPYFILE_EXCL`: Der Kopiervorgang schlägt fehl, wenn `dest` bereits existiert.
    - `fs.constants.COPYFILE_FICLONE`: Der Kopiervorgang versucht, einen Copy-on-Write-Reflink zu erstellen. Wenn die Plattform Copy-on-Write nicht unterstützt, wird ein Fallback-Kopiermechanismus verwendet.
    - `fs.constants.COPYFILE_FICLONE_FORCE`: Der Kopiervorgang versucht, einen Copy-on-Write-Reflink zu erstellen. Wenn die Plattform Copy-on-Write nicht unterstützt, schlägt der Vorgang fehl.


- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird bei Erfolg mit `undefined` erfüllt.

Kopiert asynchron `src` nach `dest`. Standardmäßig wird `dest` überschrieben, falls es bereits existiert.

Es werden keine Garantien für die Atomizität des Kopiervorgangs übernommen. Wenn nach dem Öffnen der Zieldatei zum Schreiben ein Fehler auftritt, wird versucht, das Ziel zu entfernen.

```js [ESM]
import { copyFile, constants } from 'node:fs/promises';

try {
  await copyFile('source.txt', 'destination.txt');
  console.log('source.txt wurde nach destination.txt kopiert');
} catch {
  console.error('Die Datei konnte nicht kopiert werden');
}

// Durch die Verwendung von COPYFILE_EXCL schlägt der Vorgang fehl, wenn destination.txt existiert.
try {
  await copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
  console.log('source.txt wurde nach destination.txt kopiert');
} catch {
  console.error('Die Datei konnte nicht kopiert werden');
}
```

### `fsPromises.cp(src, dest[, options])` {#fspromisescpsrc-dest-options}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v22.3.0 | Diese API ist nicht mehr experimentell. |
| v20.1.0, v18.17.0 | Akzeptiert eine zusätzliche `mode`-Option, um das Kopierverhalten als das `mode`-Argument von `fs.copyFile()` anzugeben. |
| v17.6.0, v16.15.0 | Akzeptiert eine zusätzliche `verbatimSymlinks`-Option, um anzugeben, ob die Pfadauflösung für Symlinks durchgeführt werden soll. |
| v16.7.0 | Hinzugefügt in: v16.7.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Quellpfad zum Kopieren.
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Zielpfad zum Kopieren.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Dereferenzieren von Symlinks. **Standard:** `false`.
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `force` `false` ist und das Ziel existiert, wird ein Fehler ausgelöst. **Standard:** `false`.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funktion zum Filtern kopierter Dateien/Verzeichnisse. Gibt `true` zurück, um das Element zu kopieren, `false`, um es zu ignorieren. Wenn ein Verzeichnis ignoriert wird, wird auch dessen gesamter Inhalt übersprungen. Kann auch ein `Promise` zurückgeben, das zu `true` oder `false` aufgelöst wird. **Standard:** `undefined`.
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Quellpfad zum Kopieren.
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Zielpfad zum Kopieren.
    - Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Ein Wert, der in `boolean` umwandelbar ist, oder ein `Promise`, das mit einem solchen Wert erfüllt wird.

    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Vorhandene Datei oder Verzeichnis überschreiben. Der Kopiervorgang ignoriert Fehler, wenn Sie dies auf false setzen und das Ziel existiert. Verwenden Sie die Option `errorOnExist`, um dieses Verhalten zu ändern. **Standard:** `true`.
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Modifikatoren für den Kopiervorgang. **Standard:** `0`. Siehe `mode`-Flag von [`fsPromises.copyFile()`](/de/nodejs/api/fs#fspromisescopyfilesrc-dest-mode).
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, werden Zeitstempel von `src` beibehalten. **Standard:** `false`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Verzeichnisse rekursiv kopieren. **Standard:** `false`.
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird die Pfadauflösung für Symlinks übersprungen. **Standard:** `false`.

- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird bei Erfolg mit `undefined` erfüllt.

Kopiert asynchron die gesamte Verzeichnisstruktur von `src` nach `dest`, einschließlich Unterverzeichnissen und Dateien.

Beim Kopieren eines Verzeichnisses in ein anderes Verzeichnis werden Globs nicht unterstützt und das Verhalten ähnelt `cp dir1/ dir2/`.


### `fsPromises.glob(pattern[, options])` {#fspromisesglobpattern-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.2.0 | Unterstützung für `withFileTypes` als Option hinzugefügt. |
| v22.0.0 | Hinzugefügt in: v22.0.0 |
:::

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) aktuelles Arbeitsverzeichnis. **Standard:** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funktion zum Herausfiltern von Dateien/Verzeichnissen. Gibt `true` zurück, um das Element auszuschließen, `false`, um es einzuschließen. **Standard:** `undefined`.
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn der Glob Pfade als Dirents zurückgeben soll, `false` andernfalls. **Standard:** `false`.
  
 
- Gibt zurück: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) Ein AsyncIterator, der die Pfade von Dateien liefert, die mit dem Muster übereinstimmen.



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

**Veraltet seit: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird bei Erfolg mit `undefined` aufgelöst.

Ändert die Berechtigungen für einen symbolischen Link.

Diese Methode wird nur unter macOS implementiert.


### `fsPromises.lchown(path, uid, gid)` {#fspromiseslchownpath-uid-gid}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v10.6.0 | Diese API ist nicht mehr als veraltet markiert. |
| v10.0.0 | Hinzugefügt in: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Rückgabe: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird im Erfolgsfall mit `undefined` aufgelöst.

Ändert den Besitzer einer symbolischen Verknüpfung.

### `fsPromises.lutimes(path, atime, mtime)` {#fspromiseslutimespath-atime-mtime}

**Hinzugefügt in: v14.5.0, v12.19.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- Rückgabe: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird im Erfolgsfall mit `undefined` aufgelöst.

Ändert die Zugriffs- und Modifikationszeiten einer Datei auf die gleiche Weise wie [`fsPromises.utimes()`](/de/nodejs/api/fs#fspromisesutimespath-atime-mtime), mit dem Unterschied, dass die Verknüpfung nicht dereferenziert wird, wenn der Pfad auf eine symbolische Verknüpfung verweist: Stattdessen werden die Zeitstempel der symbolischen Verknüpfung selbst geändert.


### `fsPromises.link(existingPath, newPath)` {#fspromiseslinkexistingpath-newpath}

**Hinzugefügt in: v10.0.0**

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- Rückgabe: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  Wird bei Erfolg mit `undefined` erfüllt.

Erstellt einen neuen Link vom `existingPath` zum `newPath`. Weitere Informationen finden Sie in der POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2)-Dokumentation.

### `fsPromises.lstat(path[, options])` {#fspromiseslstatpath-options}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.5.0 | Akzeptiert ein zusätzliches `options`-Objekt, um anzugeben, ob die zurückgegebenen numerischen Werte `bigint` sein sollen. |
| v10.0.0 | Hinzugefügt in: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ob die numerischen Werte im zurückgegebenen [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)-Objekt `bigint` sein sollen. **Standard:** `false`.
  
 
- Rückgabe: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  Wird mit dem [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)-Objekt für den gegebenen symbolischen Link `path` erfüllt.

Entspricht [`fsPromises.stat()`](/de/nodejs/api/fs#fspromisesstatpath-options), es sei denn, `path` bezieht sich auf einen symbolischen Link. In diesem Fall wird der Link selbst stat-ed und nicht die Datei, auf die er verweist. Weitere Informationen finden Sie im POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2)-Dokument.


### `fsPromises.mkdir(path[, options])` {#fspromisesmkdirpath-options}

**Hinzugefügt in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wird unter Windows nicht unterstützt. **Standard:** `0o777`.

- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Bei Erfolg wird `undefined` erfüllt, wenn `recursive` `false` ist, oder der erste erstellte Verzeichnispfad, wenn `recursive` `true` ist.

Erstellt ein Verzeichnis asynchron.

Das optionale Argument `options` kann eine Ganzzahl sein, die `mode` (Berechtigungs- und Sticky-Bits) angibt, oder ein Objekt mit einer `mode`-Eigenschaft und einer `recursive`-Eigenschaft, die angibt, ob übergeordnete Verzeichnisse erstellt werden sollen. Das Aufrufen von `fsPromises.mkdir()`, wenn `path` ein Verzeichnis ist, das bereits existiert, führt nur dann zu einer Ablehnung, wenn `recursive` false ist.

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

::: info [History]
| Version | Changes |
| --- | --- |
| v20.6.0, v18.19.0 | Der `prefix`-Parameter akzeptiert jetzt Puffer und URLs. |
| v16.5.0, v14.18.0 | Der `prefix`-Parameter akzeptiert jetzt eine leere Zeichenkette. |
| v10.0.0 | Hinzugefügt in: v10.0.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standardwert:** `'utf8'`


- Rückgabe: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit einer Zeichenkette erfüllt, die den Dateisystempfad des neu erstellten temporären Verzeichnisses enthält.

Erstellt ein eindeutiges temporäres Verzeichnis. Ein eindeutiger Verzeichnisname wird generiert, indem sechs zufällige Zeichen an das Ende des bereitgestellten `prefix` angehängt werden. Vermeiden Sie aufgrund von Plattforminkonsistenzen nachgestellte `X`-Zeichen in `prefix`. Einige Plattformen, insbesondere die BSDs, können mehr als sechs zufällige Zeichen zurückgeben und nachgestellte `X`-Zeichen in `prefix` durch zufällige Zeichen ersetzen.

Das optionale `options`-Argument kann eine Zeichenkette sein, die eine Kodierung angibt, oder ein Objekt mit einer `encoding`-Eigenschaft, die die zu verwendende Zeichenkodierung angibt.

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
Die Methode `fsPromises.mkdtemp()` hängt die sechs zufällig ausgewählten Zeichen direkt an die Zeichenkette `prefix` an. Wenn z. B. bei einem Verzeichnis `/tmp` beabsichtigt ist, ein temporäres Verzeichnis *innerhalb* von `/tmp` zu erstellen, muss `prefix` mit einem nachgestellten plattformspezifischen Pfadtrennzeichen (`require('node:path').sep`) enden.


### `fsPromises.open(path, flags[, mode])` {#fspromisesopenpath-flags-mode}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v11.1.0 | Das `flags`-Argument ist jetzt optional und hat standardmäßig den Wert `'r'`. |
| v10.0.0 | Hinzugefügt in: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Siehe [Unterstützung von Datei-System `flags`](/de/nodejs/api/fs#file-system-flags). **Standard:** `'r'`.
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Setzt den Dateimodus (Berechtigungs- und Sticky-Bits), wenn die Datei erstellt wird. **Standard:** `0o666` (lesbar und schreibbar)
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit einem [\<FileHandle\>](/de/nodejs/api/fs#class-filehandle)-Objekt erfüllt.

Öffnet ein [\<FileHandle\>](/de/nodejs/api/fs#class-filehandle).

Weitere Informationen finden Sie in der POSIX [`open(2)`](http://man7.org/linux/man-pages/man2/open.2)-Dokumentation.

Einige Zeichen (`\< \> : " / \ | ? *`) sind unter Windows reserviert, wie unter [Benennen von Dateien, Pfaden und Namespaces](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file) dokumentiert. Unter NTFS öffnet Node.js einen Dateisystemstream, wenn der Dateiname einen Doppelpunkt enthält, wie auf [dieser MSDN-Seite](https://docs.microsoft.com/en-us/windows/desktop/FileIO/using-streams) beschrieben.

### `fsPromises.opendir(path[, options])` {#fspromisesopendirpath-options}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v20.1.0, v18.17.0 | `recursive`-Option hinzugefügt. |
| v13.1.0, v12.16.0 | Die `bufferSize`-Option wurde eingeführt. |
| v12.12.0 | Hinzugefügt in: v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Verzeichniseinträge, die beim Lesen aus dem Verzeichnis intern gepuffert werden. Höhere Werte führen zu besserer Leistung, aber höherem Speicherverbrauch. **Standard:** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Aufgelöste `Dir` ist ein [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface), das alle Unterdateien und -verzeichnisse enthält. **Standard:** `false`

- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit einem [\<fs.Dir\>](/de/nodejs/api/fs#class-fsdir) erfüllt.

Öffnet asynchron ein Verzeichnis zum iterativen Scannen. Weitere Informationen finden Sie in der POSIX [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3)-Dokumentation.

Erstellt ein [\<fs.Dir\>](/de/nodejs/api/fs#class-fsdir), das alle weiteren Funktionen zum Lesen aus dem Verzeichnis und zum Bereinigen des Verzeichnisses enthält.

Die Option `encoding` legt die Kodierung für den `path` beim Öffnen des Verzeichnisses und nachfolgenden Lesevorgängen fest.

Beispiel unter Verwendung von asynchroner Iteration:

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
Bei Verwendung des asynchronen Iterators wird das [\<fs.Dir\>](/de/nodejs/api/fs#class-fsdir)-Objekt automatisch geschlossen, nachdem der Iterator beendet wurde.


### `fsPromises.readdir(path[, options])` {#fspromisesreaddirpath-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.1.0, v18.17.0 | `recursive`-Option hinzugefügt. |
| v10.11.0 | Neue Option `withFileTypes` wurde hinzugefügt. |
| v10.0.0 | Hinzugefügt in: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, liest den Inhalt eines Verzeichnisses rekursiv. Im rekursiven Modus werden alle Dateien, Unterdateien und Verzeichnisse aufgelistet. **Standard:** `false`.


- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit einem Array der Namen der Dateien im Verzeichnis ohne `'.'` und `'..'` erfüllt.

Liest den Inhalt eines Verzeichnisses.

Das optionale `options`-Argument kann ein String sein, der eine Kodierung angibt, oder ein Objekt mit einer `encoding`-Eigenschaft, die die Zeichenkodierung für die Dateinamen angibt. Wenn die `encoding` auf `'buffer'` gesetzt ist, werden die zurückgegebenen Dateinamen als [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)-Objekte übergeben.

Wenn `options.withFileTypes` auf `true` gesetzt ist, enthält das zurückgegebene Array [\<fs.Dirent\>](/de/nodejs/api/fs#class-fsdirent)-Objekte.

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

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.2.0, v14.17.0 | Das Argument `options` kann ein AbortSignal enthalten, um eine laufende `readFile`-Anfrage abzubrechen. |
| v10.0.0 | Hinzugefügt in: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/de/nodejs/api/fs#class-filehandle) Dateiname oder `FileHandle`
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Siehe [Unterstützung von Datei-System `flags`](/de/nodejs/api/fs#file-system-flags). **Standard:** `'r'`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) ermöglicht das Abbrechen einer laufenden readFile

- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit dem Inhalt der Datei erfüllt.

Liest asynchron den gesamten Inhalt einer Datei.

Wenn keine Kodierung angegeben wird (mit `options.encoding`), werden die Daten als [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)-Objekt zurückgegeben. Andernfalls sind die Daten eine Zeichenkette.

Wenn `options` eine Zeichenkette ist, gibt sie die Kodierung an.

Wenn der `path` ein Verzeichnis ist, ist das Verhalten von `fsPromises.readFile()` plattformspezifisch. Unter macOS, Linux und Windows wird das Promise mit einem Fehler abgelehnt. Unter FreeBSD wird eine Darstellung des Verzeichnisinhalts zurückgegeben.

Ein Beispiel für das Lesen einer `package.json`-Datei, die sich im selben Verzeichnis wie der laufende Code befindet:

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

Es ist möglich, eine laufende `readFile` mit einem [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) abzubrechen. Wenn eine Anfrage abgebrochen wird, wird das zurückgegebene Promise mit einem `AbortError` abgelehnt:

```js [ESM]
import { readFile } from 'node:fs/promises';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const promise = readFile(fileName, { signal });

  // Abort the request before the promise settles.
  controller.abort();

  await promise;
} catch (err) {
  // When a request is aborted - err is an AbortError
  console.error(err);
}
```
Das Abbrechen einer laufenden Anfrage bricht nicht einzelne Betriebssystemanfragen ab, sondern nur die interne Pufferung, die `fs.readFile` durchführt.

Jeder angegebene [\<FileHandle\>](/de/nodejs/api/fs#class-filehandle) muss das Lesen unterstützen.


### `fsPromises.readlink(path[, options])` {#fspromisesreadlinkpath-options}

**Hinzugefügt in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standardwert:** `'utf8'`


- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird im Erfolgsfall mit dem `linkString` aufgelöst.

Liest den Inhalt des symbolischen Links, auf den `path` verweist. Weitere Details finden Sie in der POSIX-Dokumentation [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2). Das Promise wird im Erfolgsfall mit dem `linkString` aufgelöst.

Das optionale Argument `options` kann eine Zeichenkette sein, die eine Kodierung angibt, oder ein Objekt mit einer Eigenschaft `encoding`, die die zu verwendende Zeichenkodierung für den zurückgegebenen Linkpfad angibt. Wenn `encoding` auf `'buffer'` gesetzt ist, wird der zurückgegebene Linkpfad als ein [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)-Objekt übergeben.

### `fsPromises.realpath(path[, options])` {#fspromisesrealpathpath-options}

**Hinzugefügt in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standardwert:** `'utf8'`


- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird im Erfolgsfall mit dem aufgelösten Pfad aufgelöst.

Bestimmt den tatsächlichen Speicherort von `path` unter Verwendung der gleichen Semantik wie die Funktion `fs.realpath.native()`.

Es werden nur Pfade unterstützt, die in UTF8-Zeichenketten konvertiert werden können.

Das optionale Argument `options` kann eine Zeichenkette sein, die eine Kodierung angibt, oder ein Objekt mit einer Eigenschaft `encoding`, die die für den Pfad zu verwendende Zeichenkodierung angibt. Wenn `encoding` auf `'buffer'` gesetzt ist, wird der zurückgegebene Pfad als ein [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)-Objekt übergeben.

Unter Linux muss das procfs-Dateisystem auf `/proc` gemountet sein, damit diese Funktion funktioniert, wenn Node.js gegen musl libc gelinkt ist. Glibc hat diese Einschränkung nicht.


### `fsPromises.rename(oldPath, newPath)` {#fspromisesrenameoldpath-newpath}

**Hinzugefügt in: v10.0.0**

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- Rückgabe: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird bei Erfolg mit `undefined` aufgelöst.

Benennt `oldPath` in `newPath` um.

### `fsPromises.rmdir(path[, options])` {#fspromisesrmdirpath-options}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.0.0 | Die Verwendung von `fsPromises.rmdir(path, { recursive: true })` auf einem `path`, der eine Datei ist, ist nicht mehr zulässig und führt unter Windows zu einem `ENOENT`-Fehler und unter POSIX zu einem `ENOTDIR`-Fehler. |
| v16.0.0 | Die Verwendung von `fsPromises.rmdir(path, { recursive: true })` auf einem `path`, der nicht existiert, ist nicht mehr zulässig und führt zu einem `ENOENT`-Fehler. |
| v16.0.0 | Die Option `recursive` ist veraltet. Ihre Verwendung löst eine Veraltungswarnung aus. |
| v14.14.0 | Die Option `recursive` ist veraltet. Verwenden Sie stattdessen `fsPromises.rm`. |
| v13.3.0, v12.16.0 | Die Option `maxBusyTries` wird in `maxRetries` umbenannt, und ihr Standardwert ist 0. Die Option `emfileWait` wurde entfernt, und `EMFILE`-Fehler verwenden die gleiche Wiederholungslogik wie andere Fehler. Die Option `retryDelay` wird jetzt unterstützt. `ENFILE`-Fehler werden jetzt wiederholt. |
| v12.10.0 | Die Optionen `recursive`, `maxBusyTries` und `emfileWait` werden jetzt unterstützt. |
| v10.0.0 | Hinzugefügt in: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wenn ein Fehler vom Typ `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` oder `EPERM` auftritt, wiederholt Node.js den Vorgang mit einem linearen Backoff-Warten von `retryDelay` Millisekunden länger bei jedem Versuch. Diese Option stellt die Anzahl der Wiederholungsversuche dar. Diese Option wird ignoriert, wenn die Option `recursive` nicht `true` ist. **Standard:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird eine rekursive Verzeichnisentfernung durchgeführt. Im rekursiven Modus werden Operationen im Fehlerfall wiederholt. **Standard:** `false`. **Veraltet.**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Wartezeit in Millisekunden zwischen den Wiederholungsversuchen. Diese Option wird ignoriert, wenn die Option `recursive` nicht `true` ist. **Standard:** `100`.

- Rückgabe: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird bei Erfolg mit `undefined` aufgelöst.

Entfernt das durch `path` identifizierte Verzeichnis.

Die Verwendung von `fsPromises.rmdir()` auf einer Datei (nicht auf einem Verzeichnis) führt dazu, dass das Promise mit einem `ENOENT`-Fehler unter Windows und einem `ENOTDIR`-Fehler unter POSIX abgelehnt wird.

Um ein Verhalten ähnlich dem Unix-Befehl `rm -rf` zu erzielen, verwenden Sie [`fsPromises.rm()`](/de/nodejs/api/fs#fspromisesrmpath-options) mit den Optionen `{ recursive: true, force: true }`.


### `fsPromises.rm(path[, options])` {#fspromisesrmpath-options}

**Hinzugefügt in: v14.14.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, werden Ausnahmen ignoriert, falls `path` nicht existiert. **Standard:** `false`.
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wenn ein `EBUSY`-, `EMFILE`-, `ENFILE`-, `ENOTEMPTY`- oder `EPERM`-Fehler auftritt, wiederholt Node.js den Vorgang mit einem linearen Backoff-Warteintervall, das bei jedem Versuch um `retryDelay` Millisekunden länger ist. Diese Option stellt die Anzahl der Wiederholungen dar. Diese Option wird ignoriert, wenn die Option `recursive` nicht `true` ist. **Standard:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird eine rekursive Verzeichnisentfernung durchgeführt. Im rekursiven Modus werden Operationen bei Fehlern wiederholt. **Standard:** `false`.
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Zeit in Millisekunden, die zwischen den Wiederholungen gewartet werden soll. Diese Option wird ignoriert, wenn die Option `recursive` nicht `true` ist. **Standard:** `100`.

- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird bei Erfolg mit `undefined` erfüllt.

Entfernt Dateien und Verzeichnisse (nach dem Vorbild des standardmäßigen POSIX-Dienstprogramms `rm`).

### `fsPromises.stat(path[, options])` {#fspromisesstatpath-options}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.5.0 | Akzeptiert ein zusätzliches `options`-Objekt, um anzugeben, ob die zurückgegebenen numerischen Werte Bigint sein sollen. |
| v10.0.0 | Hinzugefügt in: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt an, ob die numerischen Werte im zurückgegebenen [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)-Objekt `bigint` sein sollen. **Standard:** `false`.


- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit dem [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)-Objekt für den angegebenen `path` erfüllt.


### `fsPromises.statfs(path[, options])` {#fspromisesstatfspath-options}

**Hinzugefügt in: v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ob die numerischen Werte im zurückgegebenen [\<fs.StatFs\>](/de/nodejs/api/fs#class-fsstatfs)-Objekt `bigint` sein sollen. **Standard:** `false`.


- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit dem [\<fs.StatFs\>](/de/nodejs/api/fs#class-fsstatfs)-Objekt für den gegebenen `path` erfüllt.

### `fsPromises.symlink(target, path[, type])` {#fspromisessymlinktarget-path-type}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Wenn das Argument `type` `null` ist oder weggelassen wird, erkennt Node.js den Typ `target` automatisch und wählt automatisch `dir` oder `file` aus. |
| v10.0.0 | Hinzugefügt in: v10.0.0 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `null`
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird bei Erfolg mit `undefined` erfüllt.

Erstellt einen symbolischen Link.

Das Argument `type` wird nur auf Windows-Plattformen verwendet und kann entweder `'dir'`, `'file'` oder `'junction'` sein. Wenn das Argument `type` `null` ist, erkennt Node.js den Typ `target` automatisch und verwendet `'file'` oder `'dir'`. Wenn das `target` nicht existiert, wird `'file'` verwendet. Windows Junction Points erfordern, dass der Zielpfad absolut ist. Wenn `'junction'` verwendet wird, wird das Argument `target` automatisch in einen absoluten Pfad normalisiert. Junction Points auf NTFS-Volumes können nur auf Verzeichnisse verweisen.


### `fsPromises.truncate(path[, len])` {#fspromisestruncatepath-len}

**Hinzugefügt in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standardwert:** `0`
- Rückgabe: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird im Erfolgsfall mit `undefined` erfüllt.

Kürzt (verkürzt oder verlängert die Länge) den Inhalt unter `path` auf `len` Bytes.

### `fsPromises.unlink(path)` {#fspromisesunlinkpath}

**Hinzugefügt in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- Rückgabe: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird im Erfolgsfall mit `undefined` erfüllt.

Wenn `path` sich auf einen symbolischen Link bezieht, wird der Link entfernt, ohne die Datei oder das Verzeichnis zu beeinträchtigen, auf die sich dieser Link bezieht. Wenn sich der `path` auf einen Dateipfad bezieht, der kein symbolischer Link ist, wird die Datei gelöscht. Weitere Informationen finden Sie in der POSIX-Dokumentation [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2).

### `fsPromises.utimes(path, atime, mtime)` {#fspromisesutimespath-atime-mtime}

**Hinzugefügt in: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- Rückgabe: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird im Erfolgsfall mit `undefined` erfüllt.

Ändert die Dateisystem-Zeitstempel des Objekts, auf das von `path` verwiesen wird.

Die Argumente `atime` und `mtime` folgen diesen Regeln:

- Werte können entweder Zahlen sein, die die Unix-Epochenzeit darstellen, `Date`s oder eine numerische Zeichenkette wie `'123456789.0'`.
- Wenn der Wert nicht in eine Zahl umgewandelt werden kann oder `NaN`, `Infinity` oder `-Infinity` ist, wird ein `Error` ausgelöst.


### `fsPromises.watch(filename[, options])` {#fspromiseswatchfilename-options}

**Hinzugefügt in: v15.9.0, v14.18.0**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt an, ob der Prozess so lange weiterlaufen soll, wie Dateien überwacht werden. **Standard:** `true`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt an, ob alle Unterverzeichnisse überwacht werden sollen oder nur das aktuelle Verzeichnis. Dies gilt, wenn ein Verzeichnis angegeben ist und nur auf unterstützten Plattformen (siehe [Hinweise](/de/nodejs/api/fs#caveats)). **Standard:** `false`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Gibt die Zeichenkodierung an, die für den an den Listener übergebenen Dateinamen verwendet werden soll. **Standard:** `'utf8'`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ein [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal), das verwendet wird, um zu signalisieren, wann der Watcher stoppen soll.


- Gibt zurück: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) von Objekten mit den Eigenschaften:
    - `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Art der Änderung
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Der Name der geänderten Datei.


Gibt einen Async-Iterator zurück, der auf Änderungen an `filename` überwacht, wobei `filename` entweder eine Datei oder ein Verzeichnis ist.

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
Auf den meisten Plattformen wird `'rename'` ausgegeben, wenn ein Dateiname im Verzeichnis erscheint oder verschwindet.

Alle [Hinweise](/de/nodejs/api/fs#caveats) für `fs.watch()` gelten auch für `fsPromises.watch()`.


### `fsPromises.writeFile(file, data[, options])` {#fspromiseswritefilefile-data-options}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v21.0.0, v20.10.0 | Die Option `flush` wird jetzt unterstützt. |
| v15.14.0, v14.18.0 | Das `data`-Argument unterstützt jetzt `AsyncIterable`, `Iterable` und `Stream`. |
| v15.2.0, v14.17.0 | Das Options-Argument kann ein AbortSignal enthalten, um eine laufende writeFile-Anforderung abzubrechen. |
| v14.0.0 | Der Parameter `data` erzwingt nicht mehr die Umwandlung von nicht unterstützten Eingaben in Zeichenketten. |
| v10.0.0 | Hinzugefügt in: v10.0.0 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/de/nodejs/api/fs#class-filehandle) Dateiname oder `FileHandle`
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/de/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Siehe [Unterstützung von Datei-System-`Flags`](/de/nodejs/api/fs#file-system-flags). **Standard:** `'w'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn alle Daten erfolgreich in die Datei geschrieben wurden und `flush` `true` ist, wird `filehandle.sync()` verwendet, um die Daten zu leeren. **Standard:** `false`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) ermöglicht das Abbrechen einer laufenden writeFile-Operation

- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird im Erfolgsfall mit `undefined` aufgelöst.

Schreibt Daten asynchron in eine Datei und ersetzt die Datei, falls sie bereits existiert. `data` kann eine Zeichenkette, ein Puffer, ein [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) oder ein [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol)-Objekt sein.

Die Option `encoding` wird ignoriert, wenn `data` ein Puffer ist.

Wenn `options` eine Zeichenkette ist, dann gibt sie die Kodierung an.

Die Option `mode` wirkt sich nur auf die neu erstellte Datei aus. Siehe [`fs.open()`](/de/nodejs/api/fs#fsopenpath-flags-mode-callback) für weitere Details.

Jeder angegebene [\<FileHandle\>](/de/nodejs/api/fs#class-filehandle) muss das Schreiben unterstützen.

Es ist unsicher, `fsPromises.writeFile()` mehrmals auf derselben Datei zu verwenden, ohne auf die Erledigung des Promise zu warten.

Ähnlich wie `fsPromises.readFile` ist `fsPromises.writeFile` eine Hilfsmethode, die intern mehrere `write`-Aufrufe ausführt, um den ihr übergebenen Puffer zu schreiben. Für leistungssensiblen Code sollten Sie [`fs.createWriteStream()`](/de/nodejs/api/fs#fscreatewritestreampath-options) oder [`filehandle.createWriteStream()`](/de/nodejs/api/fs#filehandlecreatewritestreamoptions) verwenden.

Es ist möglich, ein [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) zu verwenden, um ein `fsPromises.writeFile()` abzubrechen. Der Abbruch erfolgt nach dem "Best-Effort"-Prinzip, und es werden wahrscheinlich noch einige Daten geschrieben.

```js [ESM]
import { writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const data = new Uint8Array(Buffer.from('Hello Node.js'));
  const promise = writeFile('message.txt', data, { signal });

  // Abort the request before the promise settles.
  controller.abort();

  await promise;
} catch (err) {
  // When a request is aborted - err is an AbortError
  console.error(err);
}
```
Das Abbrechen einer laufenden Anfrage bricht keine einzelnen Betriebssystemanfragen ab, sondern die interne Pufferung, die `fs.writeFile` durchführt.


### `fsPromises.constants` {#fspromisesconstants}

**Hinzugefügt in: v18.4.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Gibt ein Objekt zurück, das häufig verwendete Konstanten für Dateisystemoperationen enthält. Das Objekt ist dasselbe wie `fs.constants`. Weitere Informationen finden Sie unter [FS-Konstanten](/de/nodejs/api/fs#fs-constants).

## Callback-API {#callback-api}

Die Callback-APIs führen alle Operationen asynchron aus, ohne die Event-Schleife zu blockieren, und rufen dann nach Abschluss oder Fehler eine Callback-Funktion auf.

Die Callback-APIs verwenden den zugrunde liegenden Node.js-Threadpool, um Dateisystemoperationen außerhalb des Event-Loop-Threads auszuführen. Diese Operationen sind nicht synchronisiert oder threadsicher. Es ist Vorsicht geboten, wenn mehrere gleichzeitige Änderungen an derselben Datei vorgenommen werden, da es sonst zu Datenbeschädigungen kommen kann.

### `fs.access(path[, mode], callback)` {#fsaccesspath-mode-callback}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v20.8.0 | Die Konstanten `fs.F_OK`, `fs.R_OK`, `fs.W_OK` und `fs.X_OK`, die direkt auf `fs` vorhanden waren, sind veraltet. |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das Argument `callback` wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v7.6.0 | Der Parameter `path` kann ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v6.3.0 | Die Konstanten wie `fs.R_OK` usw., die direkt auf `fs` vorhanden waren, wurden als Soft-Deprecation in `fs.constants` verschoben. Verwenden Sie für Node.js `\< v6.3.0` also `fs`, um auf diese Konstanten zuzugreifen, oder verwenden Sie so etwas wie `(fs.constants || fs).R_OK`, um mit allen Versionen zu arbeiten. |
| v0.11.15 | Hinzugefügt in: v0.11.15 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `fs.constants.F_OK`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Testet die Berechtigungen eines Benutzers für die durch `path` angegebene Datei oder das Verzeichnis. Das Argument `mode` ist eine optionale Ganzzahl, die die auszuführenden Barrierefreiheitsprüfungen angibt. `mode` sollte entweder der Wert `fs.constants.F_OK` oder eine Maske sein, die aus dem bitweisen OR von `fs.constants.R_OK`, `fs.constants.W_OK` und `fs.constants.X_OK` besteht (z. B. `fs.constants.W_OK | fs.constants.R_OK`). Unter [Datei-Zugriffskonstanten](/de/nodejs/api/fs#file-access-constants) finden Sie die möglichen Werte für `mode`.

Das letzte Argument, `callback`, ist eine Callback-Funktion, die mit einem möglichen Fehlerargument aufgerufen wird. Wenn eine der Barrierefreiheitsprüfungen fehlschlägt, ist das Fehlerargument ein `Error`-Objekt. Die folgenden Beispiele prüfen, ob `package.json` vorhanden ist und ob sie lesbar oder schreibbar ist.

```js [ESM]
import { access, constants } from 'node:fs';

const file = 'package.json';

// Überprüfen Sie, ob die Datei im aktuellen Verzeichnis vorhanden ist.
access(file, constants.F_OK, (err) => {
  console.log(`${file} ${err ? 'ist nicht vorhanden' : 'ist vorhanden'}`);
});

// Überprüfen Sie, ob die Datei lesbar ist.
access(file, constants.R_OK, (err) => {
  console.log(`${file} ${err ? 'ist nicht lesbar' : 'ist lesbar'}`);
});

// Überprüfen Sie, ob die Datei beschreibbar ist.
access(file, constants.W_OK, (err) => {
  console.log(`${file} ${err ? 'ist nicht beschreibbar' : 'ist beschreibbar'}`);
});

// Überprüfen Sie, ob die Datei lesbar und beschreibbar ist.
access(file, constants.R_OK | constants.W_OK, (err) => {
  console.log(`${file} ${err ? 'ist nicht' : 'ist'} lesbar und beschreibbar`);
});
```
Verwenden Sie `fs.access()` nicht, um die Barrierefreiheit einer Datei zu überprüfen, bevor Sie `fs.open()`, `fs.readFile()` oder `fs.writeFile()` aufrufen. Dies führt zu einer Race-Condition, da andere Prozesse den Zustand der Datei zwischen den beiden Aufrufen ändern können. Stattdessen sollte der Benutzercode die Datei direkt öffnen/lesen/schreiben und den Fehler behandeln, der ausgelöst wird, wenn die Datei nicht zugänglich ist.

**write (NICHT EMPFOHLEN)**

```js [ESM]
import { access, open, close } from 'node:fs';

access('myfile', (err) => {
  if (!err) {
    console.error('myfile ist bereits vorhanden');
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
**write (EMPFOHLEN)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile ist bereits vorhanden');
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
**read (NICHT EMPFOHLEN)**

```js [ESM]
import { access, open, close } from 'node:fs';
access('myfile', (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile ist nicht vorhanden');
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
**read (EMPFOHLEN)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile ist nicht vorhanden');
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
Die obigen Beispiele "nicht empfohlen" prüfen auf Barrierefreiheit und verwenden dann die Datei; die Beispiele "empfohlen" sind besser, da sie die Datei direkt verwenden und den Fehler gegebenenfalls behandeln.

Im Allgemeinen sollten Sie nur dann auf die Barrierefreiheit einer Datei prüfen, wenn die Datei nicht direkt verwendet wird, z. B. wenn ihre Barrierefreiheit ein Signal von einem anderen Prozess ist.

Unter Windows können Zugriffssteuerungsrichtlinien (ACLs) für ein Verzeichnis den Zugriff auf eine Datei oder ein Verzeichnis einschränken. Die Funktion `fs.access()` überprüft jedoch nicht die ACL und meldet daher möglicherweise, dass ein Pfad zugänglich ist, selbst wenn die ACL den Benutzer daran hindert, ihn zu lesen oder zu beschreiben.


### `fs.appendFile(path, data[, options], callback)` {#fsappendfilepath-data-options-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.1.0, v20.10.0 | Die Option `flush` wird jetzt unterstützt. |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Der Parameter `callback` ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` ausgelöst. |
| v7.0.0 | Der Parameter `callback` ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Deprecation-Warnung mit der ID DEP0013 ausgegeben. |
| v7.0.0 | Das übergebene `options`-Objekt wird niemals geändert. |
| v5.0.0 | Der Parameter `file` kann jetzt ein Dateideskriptor sein. |
| v0.6.7 | Hinzugefügt in: v0.6.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dateiname oder Dateideskriptor
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Siehe [Unterstützung von Datei-System `flags`](/de/nodejs/api/fs#file-system-flags). **Standard:** `'a'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird der zugrunde liegende Dateideskriptor vor dem Schließen geleert. **Standard:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Fügt asynchron Daten an eine Datei an und erstellt die Datei, falls sie noch nicht existiert. `data` kann ein String oder ein [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) sein.

Die Option `mode` wirkt sich nur auf die neu erstellte Datei aus. Weitere Informationen finden Sie unter [`fs.open()`](/de/nodejs/api/fs#fsopenpath-flags-mode-callback).

```js [ESM]
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});
```
Wenn `options` ein String ist, gibt er die Kodierung an:

```js [ESM]
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', 'utf8', callback);
```
Der `path` kann als numerischer Dateideskriptor angegeben werden, der zum Anhängen geöffnet wurde (mit `fs.open()` oder `fs.openSync()`). Der Dateideskriptor wird nicht automatisch geschlossen.

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

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das Argument `callback` wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Der Parameter `callback` ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` ausgelöst. |
| v7.6.0 | Der Parameter `path` kann ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v7.0.0 | Der Parameter `callback` ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Deprecation-Warnung mit der ID DEP0013 ausgegeben. |
| v0.1.30 | Hinzugefügt in: v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Ändert asynchron die Berechtigungen einer Datei. Es werden keine Argumente außer einer möglichen Ausnahme an den Completion-Callback übergeben.

Weitere Informationen finden Sie in der POSIX [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2) Dokumentation.

```js [ESM]
import { chmod } from 'node:fs';

chmod('meine_datei.txt', 0o775, (err) => {
  if (err) throw err;
  console.log('Die Berechtigungen für die Datei "meine_datei.txt" wurden geändert!');
});
```
#### Dateimodus {#file-modes}

Das `mode`-Argument, das sowohl in den Methoden `fs.chmod()` als auch `fs.chmodSync()` verwendet wird, ist eine numerische Bitmaske, die mit einer logischen ODER-Verknüpfung der folgenden Konstanten erstellt wird:

| Konstante | Oktal | Beschreibung |
| --- | --- | --- |
| `fs.constants.S_IRUSR` | `0o400` | Lesen durch Eigentümer |
| `fs.constants.S_IWUSR` | `0o200` | Schreiben durch Eigentümer |
| `fs.constants.S_IXUSR` | `0o100` | Ausführen/Suchen durch Eigentümer |
| `fs.constants.S_IRGRP` | `0o40` | Lesen durch Gruppe |
| `fs.constants.S_IWGRP` | `0o20` | Schreiben durch Gruppe |
| `fs.constants.S_IXGRP` | `0o10` | Ausführen/Suchen durch Gruppe |
| `fs.constants.S_IROTH` | `0o4` | Lesen durch Andere |
| `fs.constants.S_IWOTH` | `0o2` | Schreiben durch Andere |
| `fs.constants.S_IXOTH` | `0o1` | Ausführen/Suchen durch Andere |

Eine einfachere Methode zum Erstellen des `mode` ist die Verwendung einer Folge von drei oktalen Ziffern (z. B. `765`). Die am weitesten links stehende Ziffer (`7` im Beispiel) gibt die Berechtigungen für den Dateibesitzer an. Die mittlere Ziffer (`6` im Beispiel) gibt die Berechtigungen für die Gruppe an. Die am weitesten rechts stehende Ziffer (`5` im Beispiel) gibt die Berechtigungen für Andere an.

| Nummer | Beschreibung |
| --- | --- |
| `7` | Lesen, Schreiben und Ausführen |
| `6` | Lesen und Schreiben |
| `5` | Lesen und Ausführen |
| `4` | Nur Lesen |
| `3` | Schreiben und Ausführen |
| `2` | Nur Schreiben |
| `1` | Nur Ausführen |
| `0` | Keine Berechtigung |

Beispielsweise bedeutet der Oktalwert `0o765`:

- Der Eigentümer darf die Datei lesen, schreiben und ausführen.
- Die Gruppe darf die Datei lesen und schreiben.
- Andere dürfen die Datei lesen und ausführen.

Bei Verwendung von rohen Zahlen, bei denen Dateimodis erwartet werden, kann jeder Wert, der größer als `0o777` ist, zu plattformspezifischem Verhalten führen, dessen konsistente Funktion nicht unterstützt wird. Daher werden Konstanten wie `S_ISVTX`, `S_ISGID` oder `S_ISUID` in `fs.constants` nicht verfügbar gemacht.

Einschränkungen: Unter Windows kann nur die Schreibberechtigung geändert werden, und die Unterscheidung zwischen den Berechtigungen von Gruppe, Eigentümer oder Anderen wird nicht implementiert.


### `fs.chown(path, uid, gid, callback)` {#fschownpath-uid-gid-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Rückrufs an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` ausgelöst. |
| v7.6.0 | Der `path`-Parameter kann ein WHATWG `URL`-Objekt sein, das das `file:`-Protokoll verwendet. |
| v7.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Veraltungswarnung mit der ID DEP0013 ausgegeben. |
| v0.1.97 | Hinzugefügt in: v0.1.97 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Ändert asynchron den Eigentümer und die Gruppe einer Datei. Der Abschluss-Callback erhält keine anderen Argumente als eine mögliche Ausnahme.

Weitere Einzelheiten finden Sie in der POSIX-Dokumentation [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2).

### `fs.close(fd[, callback])` {#fsclosefd-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Rückrufs an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v15.9.0, v14.17.0 | Ein Standard-Callback wird jetzt verwendet, wenn keiner angegeben wird. |
| v10.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` ausgelöst. |
| v7.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Veraltungswarnung mit der ID DEP0013 ausgegeben. |
| v0.0.2 | Hinzugefügt in: v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Schließt den Dateideskriptor. Der Abschluss-Callback erhält keine anderen Argumente als eine mögliche Ausnahme.

Das Aufrufen von `fs.close()` für einen beliebigen Dateideskriptor (`fd`), der gerade durch eine andere `fs`-Operation verwendet wird, kann zu undefiniertem Verhalten führen.

Weitere Einzelheiten finden Sie in der POSIX-Dokumentation [`close(2)`](http://man7.org/linux/man-pages/man2/close.2).


### `fs.copyFile(src, dest[, mode], callback)` {#fscopyfilesrc-dest-mode-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument löst nun `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK` aus. |
| v14.0.0 | Das `flags`-Argument wurde in `mode` geändert und eine strengere Typvalidierung eingeführt. |
| v8.5.0 | Hinzugefügt in: v8.5.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Quelldateiname zum Kopieren
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Zieldateiname des Kopiervorgangs
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Modifikatoren für den Kopiervorgang. **Standard:** `0`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Kopiert `src` asynchron nach `dest`. Standardmäßig wird `dest` überschrieben, falls es bereits existiert. An die Callback-Funktion werden keine anderen Argumente als eine mögliche Ausnahme übergeben. Node.js übernimmt keine Garantie für die Atomarität des Kopiervorgangs. Wenn nach dem Öffnen der Zieldatei zum Schreiben ein Fehler auftritt, versucht Node.js, das Ziel zu entfernen.

`mode` ist eine optionale Ganzzahl, die das Verhalten des Kopiervorgangs angibt. Es ist möglich, eine Maske zu erstellen, die aus der bitweisen ODER-Verknüpfung von zwei oder mehr Werten besteht (z. B. `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`).

- `fs.constants.COPYFILE_EXCL`: Der Kopiervorgang schlägt fehl, wenn `dest` bereits existiert.
- `fs.constants.COPYFILE_FICLONE`: Der Kopiervorgang versucht, einen Copy-on-Write-Reflink zu erstellen. Wenn die Plattform Copy-on-Write nicht unterstützt, wird ein Fallback-Kopiermechanismus verwendet.
- `fs.constants.COPYFILE_FICLONE_FORCE`: Der Kopiervorgang versucht, einen Copy-on-Write-Reflink zu erstellen. Wenn die Plattform Copy-on-Write nicht unterstützt, schlägt der Vorgang fehl.

```js [ESM]
import { copyFile, constants } from 'node:fs';

function callback(err) {
  if (err) throw err;
  console.log('source.txt was copied to destination.txt');
}

// destination.txt wird standardmäßig erstellt oder überschrieben.
copyFile('source.txt', 'destination.txt', callback);

// Durch die Verwendung von COPYFILE_EXCL schlägt der Vorgang fehl, wenn destination.txt existiert.
copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL, callback);
```

### `fs.cp(src, dest[, options], callback)` {#fscpsrc-dest-options-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v22.3.0 | Diese API ist nicht mehr experimentell. |
| v20.1.0, v18.17.0 | Akzeptiert eine zusätzliche `mode`-Option, um das Kopierverhalten als das `mode`-Argument von `fs.copyFile()` anzugeben. |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v17.6.0, v16.15.0 | Akzeptiert eine zusätzliche `verbatimSymlinks`-Option, um anzugeben, ob eine Pfadauflösung für Symlinks durchgeführt werden soll. |
| v16.7.0 | Hinzugefügt in: v16.7.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Quellpfad zum Kopieren.
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Zielpfad zum Kopieren.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Symlinks dereferenzieren. **Standard:** `false`.
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `force` `false` ist und das Ziel existiert, wird ein Fehler ausgelöst. **Standard:** `false`.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funktion zum Filtern kopierter Dateien/Verzeichnisse. Gibt `true` zurück, um das Element zu kopieren, `false`, um es zu ignorieren. Wenn ein Verzeichnis ignoriert wird, werden auch alle seine Inhalte übersprungen. Kann auch eine `Promise` zurückgeben, die zu `true` oder `false` aufgelöst wird. **Standard:** `undefined`.
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Quellpfad zum Kopieren.
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Zielpfad zum Kopieren.
    - Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Ein Wert, der zu `boolean` konvertierbar ist, oder eine `Promise`, die mit einem solchen Wert erfüllt wird.


    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Vorhandene Datei oder Verzeichnis überschreiben. Der Kopiervorgang ignoriert Fehler, wenn Sie dies auf false setzen und das Ziel vorhanden ist. Verwenden Sie die Option `errorOnExist`, um dieses Verhalten zu ändern. **Standard:** `true`.
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Modifikatoren für den Kopiervorgang. **Standard:** `0`. Siehe `mode`-Flag von [`fs.copyFile()`](/de/nodejs/api/fs#fscopyfilesrc-dest-mode-callback).
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, werden Zeitstempel von `src` beibehalten. **Standard:** `false`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Verzeichnisse rekursiv kopieren. **Standard:** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true` wird die Pfadauflösung für Symlinks übersprungen. **Standard:** `false`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)



Kopiert asynchron die gesamte Verzeichnisstruktur von `src` nach `dest`, einschließlich Unterverzeichnisse und Dateien.

Beim Kopieren eines Verzeichnisses in ein anderes Verzeichnis werden keine Globs unterstützt und das Verhalten ähnelt `cp dir1/ dir2/`.


### `fs.createReadStream(path[, options])` {#fscreatereadstreampath-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v16.10.0 | Die `fs`-Option benötigt keine `open`-Methode, wenn ein `fd` bereitgestellt wurde. |
| v16.10.0 | Die `fs`-Option benötigt keine `close`-Methode, wenn `autoClose` auf `false` gesetzt ist. |
| v15.5.0 | Unterstützung für `AbortSignal` hinzugefügt. |
| v15.4.0 | Die `fd`-Option akzeptiert FileHandle-Argumente. |
| v14.0.0 | Standardwert von `emitClose` auf `true` geändert. |
| v13.6.0, v12.17.0 | Die `fs`-Optionen ermöglichen das Überschreiben der verwendeten `fs`-Implementierung. |
| v12.10.0 | `emitClose`-Option aktiviert. |
| v11.0.0 | Neue Beschränkungen für `start` und `end` auferlegt, wobei in Fällen, in denen wir die Eingabewerte nicht angemessen verarbeiten können, geeignetere Fehler geworfen werden. |
| v7.6.0 | Der `path`-Parameter kann ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v7.0.0 | Das übergebene `options`-Objekt wird niemals geändert. |
| v2.3.0 | Das übergebene `options`-Objekt kann jetzt ein String sein. |
| v0.1.31 | Hinzugefügt in: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Siehe [Unterstützung von Datei-System `flags`](/de/nodejs/api/fs#file-system-flags). **Standard:** `'r'`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard:** `null`
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/de/nodejs/api/fs#class-filehandle) **Standard:** `null`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `0o666`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `64 * 1024`
    - `fs` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `null`
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `null`
  
 
- Gibt zurück: [\<fs.ReadStream\>](/de/nodejs/api/fs#class-fsreadstream)

`options` kann `start`- und `end`-Werte enthalten, um einen Bereich von Bytes aus der Datei anstelle der gesamten Datei zu lesen. Sowohl `start` als auch `end` sind inklusive und beginnen bei 0 zu zählen. Zulässige Werte liegen im Bereich [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. Wenn `fd` angegeben ist und `start` ausgelassen oder `undefined` ist, liest `fs.createReadStream()` sequenziell von der aktuellen Dateiposition. Die `encoding` kann eine derjenigen sein, die von [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) akzeptiert werden.

Wenn `fd` angegeben ist, ignoriert `ReadStream` das `path`-Argument und verwendet den angegebenen Dateideskriptor. Dies bedeutet, dass kein `'open'`-Ereignis ausgelöst wird. `fd` sollte blockierend sein; nicht-blockierende `fd`s sollten an [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) übergeben werden.

Wenn `fd` auf ein Zeichengerät verweist, das nur blockierende Lesevorgänge unterstützt (z. B. Tastatur oder Soundkarte), werden Lesevorgänge erst abgeschlossen, wenn Daten verfügbar sind. Dies kann verhindern, dass der Prozess beendet wird und der Stream auf natürliche Weise geschlossen wird.

Standardmäßig gibt der Stream ein `'close'`-Ereignis aus, nachdem er zerstört wurde. Setzen Sie die Option `emitClose` auf `false`, um dieses Verhalten zu ändern.

Durch die Bereitstellung der Option `fs` ist es möglich, die entsprechenden `fs`-Implementierungen für `open`, `read` und `close` zu überschreiben. Wenn die Option `fs` bereitgestellt wird, ist eine Überschreibung für `read` erforderlich. Wenn kein `fd` bereitgestellt wird, ist auch eine Überschreibung für `open` erforderlich. Wenn `autoClose` auf `true` gesetzt ist, ist auch eine Überschreibung für `close` erforderlich.

```js [ESM]
import { createReadStream } from 'node:fs';

// Erstellt einen Stream von einem Zeichengerät.
const stream = createReadStream('/dev/input/event0');
setTimeout(() => {
  stream.close(); // Dies schließt möglicherweise nicht den Stream.
  // Das künstliche Markieren des Stream-Endes, als ob die zugrunde liegende Ressource
  // das Dateiende selbst angezeigt hätte, ermöglicht das Schließen des Streams.
  // Dies bricht keine ausstehenden Leseoperationen ab, und wenn eine solche
  // Operation vorhanden ist, kann der Prozess möglicherweise immer noch nicht erfolgreich beendet werden,
  // bis er abgeschlossen ist.
  stream.push(null);
  stream.read(0);
}, 100);
```
Wenn `autoClose` auf false gesetzt ist, wird der Dateideskriptor nicht geschlossen, auch wenn ein Fehler auftritt. Es liegt in der Verantwortung der Anwendung, ihn zu schließen und sicherzustellen, dass kein Dateideskriptor-Leck auftritt. Wenn `autoClose` auf true gesetzt ist (Standardverhalten), wird der Dateideskriptor bei `'error'` oder `'end'` automatisch geschlossen.

`mode` setzt den Dateimodus (Berechtigungen und Sticky Bits), aber nur, wenn die Datei erstellt wurde.

Ein Beispiel zum Lesen der letzten 10 Bytes einer Datei, die 100 Bytes lang ist:

```js [ESM]
import { createReadStream } from 'node:fs';

createReadStream('sample.txt', { start: 90, end: 99 });
```
Wenn `options` ein String ist, dann gibt er die Kodierung an.


### `fs.createWriteStream(path[, options])` {#fscreatewritestreampath-options}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v21.0.0, v20.10.0 | Die Option `flush` wird jetzt unterstützt. |
| v16.10.0 | Die `fs`-Option benötigt keine `open`-Methode, wenn eine `fd` bereitgestellt wurde. |
| v16.10.0 | Die `fs`-Option benötigt keine `close`-Methode, wenn `autoClose` `false` ist. |
| v15.5.0 | Unterstützung für `AbortSignal` hinzugefügt. |
| v15.4.0 | Die Option `fd` akzeptiert FileHandle-Argumente. |
| v14.0.0 | Ändere `emitClose` Standardwert auf `true`. |
| v13.6.0, v12.17.0 | Die `fs`-Optionen erlauben das Überschreiben der verwendeten `fs`-Implementierung. |
| v12.10.0 | Aktiviere die `emitClose`-Option. |
| v7.6.0 | Der `path`-Parameter kann ein WHATWG `URL`-Objekt sein, das das `file:`-Protokoll verwendet. |
| v7.0.0 | Das übergebene `options`-Objekt wird niemals geändert. |
| v5.5.0 | Die Option `autoClose` wird jetzt unterstützt. |
| v2.3.0 | Das übergebene `options`-Objekt kann jetzt ein String sein. |
| v0.1.31 | Hinzugefügt in: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Siehe [Unterstützung für Dateisystem `flags`](/de/nodejs/api/fs#file-system-flags). **Standard:** `'w'`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard:** `'utf8'`
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/de/nodejs/api/fs#class-filehandle) **Standard:** `null`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `0o666`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `fs` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `null`
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `null`
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `16384`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird der zugrunde liegende Dateideskriptor vor dem Schließen geleert. **Standard:** `false`.

- Returns: [\<fs.WriteStream\>](/de/nodejs/api/fs#class-fswritestream)

`options` kann auch eine `start`-Option enthalten, um das Schreiben von Daten an einer Position nach dem Anfang der Datei zu ermöglichen. Die zulässigen Werte liegen im Bereich [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. Das Ändern einer Datei anstatt sie zu ersetzen, erfordert möglicherweise, dass die Option `flags` auf `r+` anstatt auf den Standardwert `w` gesetzt wird. Die `encoding` kann eine der von [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) akzeptierten sein.

Wenn `autoClose` auf true gesetzt ist (Standardverhalten), wird der Dateideskriptor bei `'error'` oder `'finish'` automatisch geschlossen. Wenn `autoClose` auf false gesetzt ist, wird der Dateideskriptor nicht geschlossen, auch wenn ein Fehler auftritt. Es liegt in der Verantwortung der Anwendung, ihn zu schließen und sicherzustellen, dass kein Dateideskriptor-Leck entsteht.

Standardmäßig gibt der Stream ein `'close'`-Ereignis aus, nachdem er zerstört wurde. Setzen Sie die Option `emitClose` auf `false`, um dieses Verhalten zu ändern.

Durch die Bereitstellung der `fs`-Option ist es möglich, die entsprechenden `fs`-Implementierungen für `open`, `write`, `writev` und `close` zu überschreiben. Das Überschreiben von `write()` ohne `writev()` kann die Leistung beeinträchtigen, da einige Optimierungen (`_writev()`) deaktiviert werden. Wenn die `fs`-Option bereitgestellt wird, sind Überschreibungen für mindestens eine von `write` und `writev` erforderlich. Wenn keine `fd`-Option angegeben wird, ist auch eine Überschreibung für `open` erforderlich. Wenn `autoClose` `true` ist, ist auch eine Überschreibung für `close` erforderlich.

Wie [\<fs.ReadStream\>](/de/nodejs/api/fs#class-fsreadstream) ignoriert [\<fs.WriteStream\>](/de/nodejs/api/fs#class-fswritestream), falls `fd` angegeben ist, das `path`-Argument und verwendet den angegebenen Dateideskriptor. Dies bedeutet, dass kein `'open'`-Ereignis ausgelöst wird. `fd` sollte blockierend sein; nicht-blockierende `fd`s sollten an [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) übergeben werden.

Wenn `options` ein String ist, gibt er die Kodierung an.


### `fs.exists(path, callback)` {#fsexistspath-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Rückrufs an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v7.6.0 | Der Parameter `path` kann ein WHATWG-`URL`-Objekt mit dem `file:`-Protokoll sein. |
| v1.0.0 | Veraltet seit: v1.0.0 |
| v0.0.2 | Hinzugefügt in: v0.0.2 |
:::

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen [`fs.stat()`](/de/nodejs/api/fs#fsstatpath-options-callback) oder [`fs.access()`](/de/nodejs/api/fs#fsaccesspath-mode-callback).
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `exists` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

 

Testet, ob das Element am angegebenen `path` vorhanden ist, indem das Dateisystem überprüft wird. Ruft dann das `callback`-Argument entweder mit true oder false auf:

```js [ESM]
import { exists } from 'node:fs';

exists('/etc/passwd', (e) => {
  console.log(e ? 'it exists' : 'no passwd!');
});
```
**Die Parameter für diesen Rückruf sind nicht konsistent mit anderen Node.js-Rückrufen.** Normalerweise ist der erste Parameter eines Node.js-Rückrufs ein `err`-Parameter, optional gefolgt von anderen Parametern. Der `fs.exists()`-Rückruf hat nur einen booleschen Parameter. Dies ist ein Grund, warum `fs.access()` anstelle von `fs.exists()` empfohlen wird.

Wenn `path` ein symbolischer Link ist, wird er verfolgt. Wenn also `path` existiert, aber auf ein nicht existierendes Element zeigt, empfängt der Rückruf den Wert `false`.

Die Verwendung von `fs.exists()`, um die Existenz einer Datei zu überprüfen, bevor `fs.open()`, `fs.readFile()` oder `fs.writeFile()` aufgerufen werden, wird nicht empfohlen. Dies führt zu einer Race-Condition, da andere Prozesse den Zustand der Datei zwischen den beiden Aufrufen ändern können. Stattdessen sollte der Benutzercode die Datei direkt öffnen/lesen/schreiben und den Fehler behandeln, der ausgelöst wird, wenn die Datei nicht existiert.

**schreiben (NICHT EMPFOHLEN)**

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
**schreiben (EMPFOHLEN)**

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
**lesen (NICHT EMPFOHLEN)**

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
**lesen (EMPFOHLEN)**

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
Die "nicht empfohlenen" Beispiele oben prüfen auf Existenz und verwenden dann die Datei; die "empfohlenen" Beispiele sind besser, da sie die Datei direkt verwenden und den Fehler, falls vorhanden, behandeln.

Im Allgemeinen sollte die Existenz einer Datei nur dann geprüft werden, wenn die Datei nicht direkt verwendet wird, z. B. wenn ihre Existenz ein Signal von einem anderen Prozess ist.


### `fs.fchmod(fd, mode, callback)` {#fsfchmodfd-mode-callback}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Rückrufs an das `callback`-Argument wirft nun `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` ausgelöst. |
| v7.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Deprecation-Warnung mit der ID DEP0013 ausgegeben. |
| v0.4.7 | Hinzugefügt in: v0.4.7 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

 

Setzt die Berechtigungen für die Datei. Dem Completion-Callback werden keine anderen Argumente als eine mögliche Ausnahme übergeben.

Weitere Details finden Sie in der POSIX-Dokumentation [`fchmod(2)`](http://man7.org/linux/man-pages/man2/fchmod.2).

### `fs.fchown(fd, uid, gid, callback)` {#fsfchownfd-uid-gid-callback}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Rückrufs an das `callback`-Argument wirft nun `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` ausgelöst. |
| v7.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Deprecation-Warnung mit der ID DEP0013 ausgegeben. |
| v0.4.7 | Hinzugefügt in: v0.4.7 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

 

Setzt den Eigentümer der Datei. Dem Completion-Callback werden keine anderen Argumente als eine mögliche Ausnahme übergeben.

Weitere Details finden Sie in der POSIX-Dokumentation [`fchown(2)`](http://man7.org/linux/man-pages/man2/fchown.2).


### `fs.fdatasync(fd, callback)` {#fsfdatasyncfd-callback}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` ausgelöst. |
| v7.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Veraltungswarnung mit der ID DEP0013 ausgegeben. |
| v0.1.96 | Hinzugefügt in: v0.1.96 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Erzwingt, dass alle aktuell in der Warteschlange befindlichen E/A-Operationen, die der Datei zugeordnet sind, in den synchronisierten E/A-Abschlusszustand des Betriebssystems überführt werden. Einzelheiten entnehmen Sie bitte der POSIX-Dokumentation [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2). An den Completion-Callback werden keine anderen Argumente als eine mögliche Ausnahme übergeben.

### `fs.fstat(fd[, options], callback)` {#fsfstatfd-options-callback}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v10.5.0 | Akzeptiert ein zusätzliches `options`-Objekt, um anzugeben, ob die zurückgegebenen numerischen Werte bigint sein sollen. |
| v10.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` ausgelöst. |
| v7.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Veraltungswarnung mit der ID DEP0013 ausgegeben. |
| v0.1.95 | Hinzugefügt in: v0.1.95 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ob die numerischen Werte im zurückgegebenen [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)-Objekt `bigint` sein sollen. **Standard:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)
  
 

Ruft den Callback mit den [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats) für den Dateideskriptor auf.

Weitere Informationen finden Sie in der POSIX-Dokumentation [`fstat(2)`](http://man7.org/linux/man-pages/man2/fstat.2).


### `fs.fsync(fd, callback)` {#fsfsyncfd-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Rückrufs an das `callback`-Argument wirft nun `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Der `callback`-Parameter ist nicht mehr optional. Das Nicht-Übergeben löst zur Laufzeit einen `TypeError` aus. |
| v7.0.0 | Der `callback`-Parameter ist nicht mehr optional. Das Nicht-Übergeben gibt eine Deprecation-Warnung mit der ID DEP0013 aus. |
| v0.1.96 | Hinzugefügt in: v0.1.96 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Fordert an, dass alle Daten für den geöffneten Dateideskriptor auf das Speichermedium geschrieben werden. Die spezifische Implementierung ist betriebssystem- und gerätespezifisch. Weitere Informationen finden Sie in der POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2)-Dokumentation. Der Abschluss-Callback erhält keine anderen Argumente als eine mögliche Ausnahme.

### `fs.ftruncate(fd[, len], callback)` {#fsftruncatefd-len-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Rückrufs an das `callback`-Argument wirft nun `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Der `callback`-Parameter ist nicht mehr optional. Das Nicht-Übergeben löst zur Laufzeit einen `TypeError` aus. |
| v7.0.0 | Der `callback`-Parameter ist nicht mehr optional. Das Nicht-Übergeben gibt eine Deprecation-Warnung mit der ID DEP0013 aus. |
| v0.8.6 | Hinzugefügt in: v0.8.6 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `0`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Kürzt den Dateideskriptor. Der Abschluss-Callback erhält keine anderen Argumente als eine mögliche Ausnahme.

Weitere Informationen finden Sie in der POSIX [`ftruncate(2)`](http://man7.org/linux/man-pages/man2/ftruncate.2)-Dokumentation.

Wenn die durch den Dateideskriptor referenzierte Datei größer als `len` Bytes war, werden nur die ersten `len` Bytes in der Datei beibehalten.

Das folgende Programm behält beispielsweise nur die ersten vier Bytes der Datei bei:

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
Wenn die Datei zuvor kürzer als `len` Bytes war, wird sie erweitert und der erweiterte Teil mit Null-Bytes (`'\0'`) gefüllt:

Wenn `len` negativ ist, wird `0` verwendet.


### `fs.futimes(fd, atime, mtime, callback)` {#fsfutimesfd-atime-mtime-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Der Parameter `callback` ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` ausgelöst. |
| v7.0.0 | Der Parameter `callback` ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Deprecation-Warnung mit der ID DEP0013 ausgegeben. |
| v4.1.0 | Numerische Strings, `NaN` und `Infinity` sind jetzt als Zeitspezifizierer zulässig. |
| v0.4.2 | Hinzugefügt in: v0.4.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Ändert die Dateisystem-Zeitstempel des Objekts, auf das durch den bereitgestellten Dateideskriptor verwiesen wird. Siehe [`fs.utimes()`](/de/nodejs/api/fs#fsutimespath-atime-mtime-callback).

### `fs.glob(pattern[, options], callback)` {#fsglobpattern-options-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.2.0 | Unterstützung für `withFileTypes` als Option hinzugefügt. |
| v22.0.0 | Hinzugefügt in: v22.0.0 |
:::

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

-  `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) aktuelles Arbeitsverzeichnis. **Standard:** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funktion zum Herausfiltern von Dateien/Verzeichnissen. Gibt `true` zurück, um das Element auszuschließen, `false`, um es einzuschließen. **Standard:** `undefined`.
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn glob Pfade als Dirents zurückgeben soll, `false` andernfalls. **Standard:** `false`.
  
 
-  `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 
-  Ruft die Dateien ab, die mit dem angegebenen Muster übereinstimmen.

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

::: info [Historie]
| Version  | Änderungen                                                                                                                                |
| :------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| v18.0.0  | Das Übergeben eines ungültigen Rückrufs an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v16.0.0  | Der zurückgegebene Fehler kann ein `AggregateError` sein, wenn mehr als ein Fehler zurückgegeben wird.                                    |
| v10.0.0  | Der Parameter `callback` ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` ausgelöst.               |
| v7.0.0   | Der Parameter `callback` ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Deprecation-Warnung mit der ID DEP0013 ausgegeben. |
| v0.4.7   | Veraltet seit: v0.4.7                                                                                                                        |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
  - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)

Ändert die Berechtigungen für einen symbolischen Link. Dem Abschluss-Callback werden keine anderen Argumente als eine mögliche Ausnahme übergeben.

Diese Methode wird nur unter macOS implementiert.

Weitere Informationen finden Sie in der POSIX-Dokumentation [`lchmod(2)`](https://www.freebsd.org/cgi/man.cgi?query=lchmod&sektion=2).

### `fs.lchown(path, uid, gid, callback)` {#fslchownpath-uid-gid-callback}

::: info [Historie]
| Version  | Änderungen                                                                                                                                |
| :------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| v18.0.0  | Das Übergeben eines ungültigen Rückrufs an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v10.6.0  | Diese API ist nicht mehr veraltet.                                                                                                          |
| v10.0.0  | Der Parameter `callback` ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` ausgelöst.               |
| v7.0.0   | Der Parameter `callback` ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Deprecation-Warnung mit der ID DEP0013 ausgegeben. |
| v0.4.7   | Nur-Dokumentations-Veraltung.                                                                                                                 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
  - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Setzt den Eigentümer des symbolischen Links. Dem Abschluss-Callback werden keine anderen Argumente als eine mögliche Ausnahme übergeben.

Weitere Informationen finden Sie in der POSIX-Dokumentation [`lchown(2)`](http://man7.org/linux/man-pages/man2/lchown.2).


### `fs.lutimes(path, atime, mtime, callback)` {#fslutimespath-atime-mtime-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Rückrufs an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v14.5.0, v12.19.0 | Hinzugefügt in: v14.5.0, v12.19.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Ändert die Zugriffs- und Änderungszeiten einer Datei auf die gleiche Weise wie [`fs.utimes()`](/de/nodejs/api/fs#fsutimespath-atime-mtime-callback), mit dem Unterschied, dass, wenn der Pfad auf einen symbolischen Link verweist, der Link nicht dereferenziert wird: Stattdessen werden die Zeitstempel des symbolischen Links selbst geändert.

Es werden keine anderen Argumente als eine mögliche Ausnahme an den Completion-Callback übergeben.

### `fs.link(existingPath, newPath, callback)` {#fslinkexistingpath-newpath-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Rückrufs an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Der Parameter `callback` ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` geworfen. |
| v7.6.0 | Die Parameter `existingPath` und `newPath` können WHATWG `URL`-Objekte mit dem `file:`-Protokoll sein. Die Unterstützung ist derzeit noch *experimentell*. |
| v7.0.0 | Der Parameter `callback` ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Deprecation-Warnung mit der ID DEP0013 ausgegeben. |
| v0.1.31 | Hinzugefügt in: v0.1.31 |
:::

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Erstellt einen neuen Link von `existingPath` zu `newPath`. Weitere Informationen finden Sie in der POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) Dokumentation. Es werden keine anderen Argumente als eine mögliche Ausnahme an den Completion-Callback übergeben.


### `fs.lstat(path[, options], callback)` {#fslstatpath-options-callback}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v10.5.0 | Akzeptiert ein zusätzliches `options`-Objekt, um anzugeben, ob die zurückgegebenen numerischen Werte `bigint` sein sollen. |
| v10.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` ausgelöst. |
| v7.6.0 | Der `path`-Parameter kann ein WHATWG `URL`-Objekt sein, das das `file:`-Protokoll verwendet. |
| v7.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Deprecation-Warnung mit der ID DEP0013 ausgegeben. |
| v0.1.30 | Hinzugefügt in: v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt an, ob die numerischen Werte im zurückgegebenen [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)-Objekt `bigint` sein sollen. **Standard:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)
  
 

Ruft die [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats) für den symbolischen Link ab, auf den der Pfad verweist. Der Callback erhält zwei Argumente `(err, stats)`, wobei `stats` ein [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)-Objekt ist. `lstat()` ist identisch mit `stat()`, außer dass, wenn `path` ein symbolischer Link ist, der Link selbst stat-ed wird, nicht die Datei, auf die er verweist.

Weitere Informationen finden Sie in der POSIX-Dokumentation [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2).


### `fs.mkdir(path[, options], callback)` {#fsmkdirpath-options-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v13.11.0, v12.17.0 | Im `recursive`-Modus empfängt der Callback jetzt den ersten erstellten Pfad als Argument. |
| v10.12.0 | Das zweite Argument kann jetzt ein `options`-Objekt mit den Eigenschaften `recursive` und `mode` sein. |
| v10.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` ausgelöst. |
| v7.6.0 | Der `path`-Parameter kann ein WHATWG-`URL`-Objekt sein, das das `file:`-Protokoll verwendet. |
| v7.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Deprecation-Warnung mit der ID DEP0013 ausgegeben. |
| v0.1.8 | Hinzugefügt in: v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wird unter Windows nicht unterstützt. **Standard:** `0o777`.

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Nur vorhanden, wenn ein Verzeichnis mit `recursive` auf `true` erstellt wird.

Erstellt asynchron ein Verzeichnis.

Der Callback erhält eine mögliche Ausnahme und, falls `recursive` `true` ist, den ersten erstellten Verzeichnispfad, `(err[, path])`. `path` kann immer noch `undefined` sein, wenn `recursive` `true` ist, wenn kein Verzeichnis erstellt wurde (zum Beispiel, wenn es zuvor erstellt wurde).

Das optionale Argument `options` kann eine Ganzzahl sein, die `mode` (Berechtigungs- und Sticky-Bits) angibt, oder ein Objekt mit einer `mode`-Eigenschaft und einer `recursive`-Eigenschaft, die angibt, ob übergeordnete Verzeichnisse erstellt werden sollen. Das Aufrufen von `fs.mkdir()`, wenn `path` ein Verzeichnis ist, das existiert, führt nur dann zu einem Fehler, wenn `recursive` false ist. Wenn `recursive` false ist und das Verzeichnis existiert, tritt ein `EEXIST`-Fehler auf.

```js [ESM]
import { mkdir } from 'node:fs';

// Erstellt ./tmp/a/apple, unabhängig davon, ob ./tmp und ./tmp/a existieren.
mkdir('./tmp/a/apple', { recursive: true }, (err) => {
  if (err) throw err;
});
```
Unter Windows führt die Verwendung von `fs.mkdir()` im Root-Verzeichnis selbst mit Rekursion zu einem Fehler:

```js [ESM]
import { mkdir } from 'node:fs';

mkdir('/', { recursive: true }, (err) => {
  // => [Error: EPERM: operation not permitted, mkdir 'C:\']
});
```
Weitere Informationen finden Sie in der POSIX-Dokumentation [`mkdir(2)`](http://man7.org/linux/man-pages/man2/mkdir.2).


### `fs.mkdtemp(prefix[, options], callback)` {#fsmkdtempprefix-options-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.6.0, v18.19.0 | Der `prefix`-Parameter akzeptiert jetzt Puffer und URLs. |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v16.5.0, v14.18.0 | Der `prefix`-Parameter akzeptiert jetzt eine leere Zeichenkette. |
| v10.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` ausgelöst. |
| v7.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Deprecation-Warnung mit der ID DEP0013 ausgegeben. |
| v6.2.1 | Der `callback`-Parameter ist jetzt optional. |
| v5.10.0 | Hinzugefügt in: v5.10.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard:** `'utf8'`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

Erstellt ein eindeutiges temporäres Verzeichnis.

Generiert sechs zufällige Zeichen, die hinter einem erforderlichen `prefix` angehängt werden, um ein eindeutiges temporäres Verzeichnis zu erstellen. Vermeiden Sie aufgrund von Plattforminkonsistenzen nachgestellte `X`-Zeichen in `prefix`. Einige Plattformen, insbesondere die BSDs, können mehr als sechs zufällige Zeichen zurückgeben und nachgestellte `X`-Zeichen in `prefix` durch zufällige Zeichen ersetzen.

Der erstellte Verzeichnispfad wird als Zeichenkette an den zweiten Parameter des Callbacks übergeben.

Das optionale `options`-Argument kann eine Zeichenkette sein, die eine Kodierung angibt, oder ein Objekt mit einer `encoding`-Eigenschaft, die die zu verwendende Zeichenkodierung angibt.

```js [ESM]
import { mkdtemp } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

mkdtemp(join(tmpdir(), 'foo-'), (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Gibt aus: /tmp/foo-itXde2 oder C:\Users\...\AppData\Local\Temp\foo-itXde2
});
```
Die Methode `fs.mkdtemp()` hängt die sechs zufällig ausgewählten Zeichen direkt an die `prefix`-Zeichenkette an. Wenn beispielsweise bei einem Verzeichnis `/tmp` die Absicht besteht, ein temporäres Verzeichnis *innerhalb* von `/tmp` zu erstellen, muss `prefix` mit einem nachgestellten plattformspezifischen Pfadtrennzeichen (`require('node:path').sep`) enden.

```js [ESM]
import { tmpdir } from 'node:os';
import { mkdtemp } from 'node:fs';

// Das übergeordnete Verzeichnis für das neue temporäre Verzeichnis
const tmpDir = tmpdir();

// Diese Methode ist *FALSCH*:
mkdtemp(tmpDir, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Gibt etwas Ähnliches wie `/tmpabc123` aus.
  // Ein neues temporäres Verzeichnis wird im Stammverzeichnis des Dateisystems erstellt
  // anstatt *innerhalb* des Verzeichnisses /tmp.
});

// Diese Methode ist *RICHTIG*:
import { sep } from 'node:path';
mkdtemp(`${tmpDir}${sep}`, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Gibt etwas Ähnliches wie `/tmp/abc123` aus.
  // Ein neues temporäres Verzeichnis wird erstellt innerhalb
  // des /tmp-Verzeichnisses.
});
```

### `fs.open(path[, flags[, mode]], callback)` {#fsopenpath-flags-mode-callback}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v11.1.0 | Das `flags`-Argument ist jetzt optional und hat standardmäßig den Wert `'r'`. |
| v9.9.0 | Die `as`- und `as+`-Flags werden jetzt unterstützt. |
| v7.6.0 | Der `path`-Parameter kann ein WHATWG `URL`-Objekt sein, das das `file:`-Protokoll verwendet. |
| v0.0.2 | Hinzugefügt in: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Siehe [Unterstützung von Datei-System `flags`](/de/nodejs/api/fs#file-system-flags). **Standard:** `'r'`.
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `0o666` (lesbar und beschreibbar)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

Asynchrones Öffnen einer Datei. Weitere Details finden Sie in der POSIX [`open(2)`](http://man7.org/linux/man-pages/man2/open.2)-Dokumentation.

`mode` legt den Dateimodus (Berechtigung und Sticky Bits) fest, aber nur, wenn die Datei erstellt wurde. Unter Windows kann nur die Schreibberechtigung manipuliert werden; siehe [`fs.chmod()`](/de/nodejs/api/fs#fschmodpath-mode-callback).

Der Callback erhält zwei Argumente `(err, fd)`.

Einige Zeichen (`\< \> : " / \ | ? *`) sind unter Windows reserviert, wie unter [Benennen von Dateien, Pfaden und Namespaces](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file) dokumentiert. Unter NTFS öffnet Node.js, wenn der Dateiname einen Doppelpunkt enthält, einen Dateisystem-Stream, wie auf [dieser MSDN-Seite](https://docs.microsoft.com/en-us/windows/desktop/FileIO/using-streams) beschrieben.

Funktionen, die auf `fs.open()` basieren, zeigen dieses Verhalten ebenfalls: `fs.writeFile()`, `fs.readFile()` usw.


### `fs.openAsBlob(path[, options])` {#fsopenasblobpath-options}

**Hinzugefügt in: v19.8.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein optionaler MIME-Typ für den Blob.


- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird bei Erfolg mit einem [\<Blob\>](/de/nodejs/api/buffer#class-blob) erfüllt.

Gibt einen [\<Blob\>](/de/nodejs/api/buffer#class-blob) zurück, dessen Daten durch die angegebene Datei gesichert werden.

Die Datei darf nach der Erstellung des [\<Blob\>](/de/nodejs/api/buffer#class-blob) nicht mehr geändert werden. Jegliche Änderungen führen dazu, dass das Lesen der [\<Blob\>](/de/nodejs/api/buffer#class-blob)-Daten mit einem `DOMException`-Fehler fehlschlägt. Synchrone Stat-Operationen an der Datei werden beim Erstellen des `Blob` und vor jedem Lesen durchgeführt, um festzustellen, ob die Dateidaten auf der Festplatte geändert wurden.

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

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.1.0, v18.17.0 | Option `recursive` hinzugefügt. |
| v18.0.0 | Die Übergabe eines ungültigen Rückrufs an das Argument `callback` wirft nun `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v13.1.0, v12.16.0 | Die Option `bufferSize` wurde eingeführt. |
| v12.12.0 | Hinzugefügt in: v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Verzeichniseinträge, die beim Lesen aus dem Verzeichnis intern gepuffert werden. Höhere Werte führen zu einer besseren Leistung, aber zu einem höheren Speicherverbrauch. **Standard:** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `false`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `dir` [\<fs.Dir\>](/de/nodejs/api/fs#class-fsdir)


Öffnet ein Verzeichnis asynchron. Weitere Details finden Sie in der POSIX-Dokumentation [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3).

Erstellt ein [\<fs.Dir\>](/de/nodejs/api/fs#class-fsdir), das alle weiteren Funktionen zum Lesen aus dem Verzeichnis und zum Bereinigen des Verzeichnisses enthält.

Die Option `encoding` legt die Kodierung für den `path` beim Öffnen des Verzeichnisses und bei nachfolgenden Leseoperationen fest.


### `fs.read(fd, buffer, offset, length, position, callback)` {#fsreadfd-buffer-offset-length-position-callback}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft nun `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v10.10.0 | Der Parameter `buffer` kann jetzt ein beliebiges `TypedArray` oder eine `DataView` sein. |
| v7.4.0 | Der Parameter `buffer` kann jetzt ein `Uint8Array` sein. |
| v6.0.0 | Der Parameter `length` kann jetzt `0` sein. |
| v0.0.2 | Hinzugefügt in: v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Der Puffer, in den die Daten geschrieben werden.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Position in `buffer`, in die die Daten geschrieben werden.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der zu lesenden Bytes.
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Gibt an, wo das Lesen in der Datei begonnen werden soll. Wenn `position` `null` oder `-1` ist, werden Daten ab der aktuellen Dateiposition gelesen und die Dateiposition wird aktualisiert. Wenn `position` eine nicht-negative ganze Zahl ist, bleibt die Dateiposition unverändert.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Liest Daten aus der durch `fd` angegebenen Datei.

Der Callback erhält die drei Argumente `(err, bytesRead, buffer)`.

Wenn die Datei nicht gleichzeitig geändert wird, wird das Dateiende erreicht, wenn die Anzahl der gelesenen Bytes Null ist.

Wenn diese Methode als ihre [`util.promisify()`](/de/nodejs/api/util#utilpromisifyoriginal)ed-Version aufgerufen wird, gibt sie eine Promise für ein `Object` mit den Eigenschaften `bytesRead` und `buffer` zurück.

Die `fs.read()`-Methode liest Daten aus der durch den Dateideskriptor (`fd`) angegebenen Datei. Das Argument `length` gibt die maximale Anzahl von Bytes an, die Node.js versucht, vom Kernel zu lesen. Die tatsächliche Anzahl der gelesenen Bytes (`bytesRead`) kann jedoch aus verschiedenen Gründen geringer sein als die angegebene `length`.

Zum Beispiel:

- Wenn die Datei kürzer als die angegebene `length` ist, wird `bytesRead` auf die tatsächliche Anzahl der gelesenen Bytes gesetzt.
- Wenn die Datei EOF (End Of File) erreicht, bevor der Puffer gefüllt werden konnte, liest Node.js alle verfügbaren Bytes bis zum Erreichen von EOF, und der Parameter `bytesRead` im Callback gibt die tatsächliche Anzahl der gelesenen Bytes an, die geringer sein kann als die angegebene `length`.
- Wenn sich die Datei in einem langsamen Netzwerk-`Dateisystem` befindet oder beim Lesen ein anderes Problem auftritt, kann `bytesRead` kleiner sein als die angegebene `length`.

Daher ist es bei der Verwendung von `fs.read()` wichtig, den Wert `bytesRead` zu überprüfen, um festzustellen, wie viele Bytes tatsächlich aus der Datei gelesen wurden. Abhängig von Ihrer Anwendungslogik müssen Sie möglicherweise Fälle behandeln, in denen `bytesRead` kleiner als die angegebene `length` ist, z. B. durch Umschließen des Leseaufrufs in einer Schleife, wenn Sie eine Mindestmenge an Bytes benötigen.

Dieses Verhalten ähnelt der POSIX-Funktion `preadv2`.


### `fs.read(fd[, options], callback)` {#fsreadfd-options-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v13.11.0, v12.17.0 | Das Options-Objekt kann übergeben werden, um Puffer, Offset, Länge und Position optional zu machen. |
| v13.11.0, v12.17.0 | Hinzugefügt in: v13.11.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) **Standard:** `Buffer.alloc(16384)`
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `null`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)



Ähnlich der Funktion [`fs.read()`](/de/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback) akzeptiert diese Version ein optionales `options`-Objekt. Wenn kein `options`-Objekt angegeben ist, werden die obigen Werte standardmäßig verwendet.


### `fs.read(fd, buffer[, options], callback)` {#fsreadfd-buffer-options-callback}

**Hinzugefügt in: v18.2.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Der Puffer, in den die Daten geschrieben werden.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standardwert:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standardwert:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) **Standardwert:** `null`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)



Ähnlich der Funktion [`fs.read()`](/de/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback) verwendet diese Version ein optionales `options`-Objekt. Wenn kein `options`-Objekt angegeben ist, werden standardmäßig die oben genannten Werte verwendet.

### `fs.readdir(path[, options], callback)` {#fsreaddirpath-options-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.1.0, v18.17.0 | `recursive` Option hinzugefügt. |
| v18.0.0 | Die Übergabe eines ungültigen Rückrufs an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v10.10.0 | Neue Option `withFileTypes` wurde hinzugefügt. |
| v10.0.0 | Der Parameter `callback` ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` ausgelöst. |
| v7.6.0 | Der Parameter `path` kann ein WHATWG `URL`-Objekt mit dem Protokoll `file:` sein. |
| v7.0.0 | Der Parameter `callback` ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Veraltungswarnung mit der ID DEP0013 ausgegeben. |
| v6.0.0 | Der Parameter `options` wurde hinzugefügt. |
| v0.1.8 | Hinzugefügt in: v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standardwert:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standardwert:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, liest den Inhalt eines Verzeichnisses rekursiv. Im rekursiven Modus werden alle Dateien, Unterdateien und Verzeichnisse aufgelistet. **Standardwert:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `files` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/de/nodejs/api/buffer#class-buffer) | [\<fs.Dirent[]\>](/de/nodejs/api/fs#class-fsdirent)



Liest den Inhalt eines Verzeichnisses. Der Callback erhält zwei Argumente `(err, files)`, wobei `files` ein Array mit den Namen der Dateien im Verzeichnis ist, wobei `'.'` und `'..'` ausgeschlossen sind.

Weitere Informationen finden Sie in der POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) Dokumentation.

Das optionale Argument `options` kann eine Zeichenkette sein, die eine Kodierung angibt, oder ein Objekt mit einer Eigenschaft `encoding`, die die Zeichenkodierung angibt, die für die an den Callback übergebenen Dateinamen verwendet werden soll. Wenn `encoding` auf `'buffer'` gesetzt ist, werden die zurückgegebenen Dateinamen als [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Objekte übergeben.

Wenn `options.withFileTypes` auf `true` gesetzt ist, enthält das Array `files` [\<fs.Dirent\>](/de/nodejs/api/fs#class-fsdirent) Objekte.


### `fs.readFile(path[, options], callback)` {#fsreadfilepath-options-callback}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v16.0.0 | Der zurückgegebene Fehler kann ein `AggregateError` sein, wenn mehr als ein Fehler zurückgegeben wird. |
| v15.2.0, v14.17.0 | Das Options-Argument kann ein AbortSignal beinhalten, um eine laufende readFile-Anfrage abzubrechen. |
| v10.0.0 | Der `callback`-Parameter ist nicht mehr optional. Das Nicht-Übergeben führt zu einem `TypeError` zur Laufzeit. |
| v7.6.0 | Der `path`-Parameter kann ein WHATWG `URL`-Objekt mit `file:`-Protokoll sein. |
| v7.0.0 | Der `callback`-Parameter ist nicht mehr optional. Das Nicht-Übergeben gibt eine Deprecation-Warnung mit der ID DEP0013 aus. |
| v5.1.0 | Der `callback` wird im Erfolgsfall immer mit `null` als `error`-Parameter aufgerufen. |
| v5.0.0 | Der `path`-Parameter kann jetzt ein Dateideskriptor sein. |
| v0.1.29 | Hinzugefügt in: v0.1.29 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dateiname oder Dateideskriptor
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Siehe [Unterstützung von Datei-System `flags`](/de/nodejs/api/fs#file-system-flags). **Standard:** `'r'`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) ermöglicht das Abbrechen einer laufenden readFile

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
    - `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Liest asynchron den gesamten Inhalt einer Datei.

```js [ESM]
import { readFile } from 'node:fs';

readFile('/etc/passwd', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```
Der Callback erhält zwei Argumente `(err, data)`, wobei `data` der Inhalt der Datei ist.

Wenn keine Kodierung angegeben ist, wird der rohe Puffer zurückgegeben.

Wenn `options` eine Zeichenkette ist, dann gibt sie die Kodierung an:

```js [ESM]
import { readFile } from 'node:fs';

readFile('/etc/passwd', 'utf8', callback);
```
Wenn der Pfad ein Verzeichnis ist, ist das Verhalten von `fs.readFile()` und [`fs.readFileSync()`](/de/nodejs/api/fs#fsreadfilesyncpath-options) plattformspezifisch. Auf macOS, Linux und Windows wird ein Fehler zurückgegeben. Auf FreeBSD wird eine Darstellung des Inhalts des Verzeichnisses zurückgegeben.

```js [ESM]
import { readFile } from 'node:fs';

// macOS, Linux und Windows
readFile('<directory>', (err, data) => {
  // => [Error: EISDIR: illegal operation on a directory, read <directory>]
});

//  FreeBSD
readFile('<directory>', (err, data) => {
  // => null, <data>
});
```
Es ist möglich, eine laufende Anfrage mit einem `AbortSignal` abzubrechen. Wenn eine Anfrage abgebrochen wird, wird der Callback mit einem `AbortError` aufgerufen:

```js [ESM]
import { readFile } from 'node:fs';

const controller = new AbortController();
const signal = controller.signal;
readFile(fileInfo[0].name, { signal }, (err, buf) => {
  // ...
});
// Wenn Sie die Anfrage abbrechen möchten
controller.abort();
```
Die Funktion `fs.readFile()` puffert die gesamte Datei. Um die Speicherkosten zu minimieren, sollte nach Möglichkeit das Streaming über `fs.createReadStream()` bevorzugt werden.

Das Abbrechen einer laufenden Anfrage bricht nicht einzelne Betriebssystemanfragen ab, sondern die interne Pufferung, die `fs.readFile` durchführt.


#### Dateideskriptoren {#file-descriptors}

#### Leistungsüberlegungen {#performance-considerations}

Die Methode `fs.readFile()` liest den Inhalt einer Datei asynchron in den Speicher ein, wobei sie die Daten in Abschnitten verarbeitet und die Ereignisschleife zwischen den einzelnen Abschnitten ablaufen lässt. Dadurch wird die Auswirkung des Lesevorgangs auf andere Aktivitäten, die möglicherweise den zugrunde liegenden libuv-Threadpool nutzen, verringert, aber es dauert länger, eine vollständige Datei in den Speicher zu lesen.

Der zusätzliche Leseaufwand kann auf verschiedenen Systemen stark variieren und hängt vom Typ der zu lesenden Datei ab. Wenn der Dateityp keine reguläre Datei ist (z. B. eine Pipe) und Node.js nicht in der Lage ist, eine tatsächliche Dateigröße zu bestimmen, lädt jeder Lesevorgang 64 KiB Daten. Bei regulären Dateien verarbeitet jeder Lesevorgang 512 KiB Daten.

Für Anwendungen, die ein möglichst schnelles Lesen von Dateiinhalten erfordern, ist es besser, `fs.read()` direkt zu verwenden und den Anwendungs-Code selbst das vollständige Lesen der Dateiinhalte zu verwalten.

Das Node.js GitHub-Issue [#25741](https://github.com/nodejs/node/issues/25741) bietet weitere Informationen und eine detaillierte Analyse der Leistung von `fs.readFile()` für mehrere Dateigrößen in verschiedenen Node.js-Versionen.

### `fs.readlink(path[, options], callback)` {#fsreadlinkpath-options-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` ausgelöst. |
| v7.6.0 | Der `path`-Parameter kann ein WHATWG `URL`-Objekt sein, das das `file:`-Protokoll verwendet. |
| v7.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Veraltungswarnung mit der ID DEP0013 ausgegeben. |
| v0.1.31 | Hinzugefügt in: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard:** `'utf8'`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `linkString` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)
  
 

Liest den Inhalt des symbolischen Links, auf den `path` verweist. Der Callback erhält zwei Argumente `(err, linkString)`.

Weitere Details finden Sie in der POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2)-Dokumentation.

Das optionale `options`-Argument kann eine Zeichenkette sein, die eine Kodierung angibt, oder ein Objekt mit einer `encoding`-Eigenschaft, die die zu verwendende Zeichenkodierung für den an den Callback übergebenen Linkpfad angibt. Wenn die `encoding` auf `'buffer'` gesetzt ist, wird der zurückgegebene Linkpfad als ein [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)-Objekt übergeben.


### `fs.readv(fd, buffers[, position], callback)` {#fsreadvfd-buffers-position-callback}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v13.13.0, v12.17.0 | Hinzugefügt in: v13.13.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)

Liest aus einer durch `fd` angegebenen Datei und schreibt mit `readv()` in ein Array von `ArrayBufferView`s.

`position` ist der Offset vom Anfang der Datei, ab dem Daten gelesen werden sollen. Wenn `typeof position !== 'number'`, werden die Daten ab der aktuellen Position gelesen.

Der Callback erhält drei Argumente: `err`, `bytesRead` und `buffers`. `bytesRead` gibt an, wie viele Bytes aus der Datei gelesen wurden.

Wenn diese Methode als ihre [`util.promisify()`](/de/nodejs/api/util#utilpromisifyoriginal)ed-Version aufgerufen wird, gibt sie eine Promise für ein `Object` mit den Eigenschaften `bytesRead` und `buffers` zurück.

### `fs.realpath(path[, options], callback)` {#fsrealpathpath-options-callback}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` ausgelöst. |
| v8.0.0 | Die Unterstützung für die Auflösung von Pipes/Sockets wurde hinzugefügt. |
| v7.6.0 | Der Parameter `path` kann ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v7.0.0 | Der Parameter `callback` ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Deprecation-Warnung mit der ID DEP0013 ausgegeben. |
| v6.4.0 | Der Aufruf von `realpath` funktioniert nun wieder für verschiedene Sonderfälle unter Windows. |
| v6.0.0 | Der Parameter `cache` wurde entfernt. |
| v0.1.31 | Hinzugefügt in: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard:** `'utf8'`

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `resolvedPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Berechnet asynchron den kanonischen Pfadnamen durch Auflösen von `.`, `..` und symbolischen Links.

Ein kanonischer Pfadname ist nicht unbedingt eindeutig. Hardlinks und Bind-Mounts können eine Dateisystementität über viele Pfadnamen verfügbar machen.

Diese Funktion verhält sich wie [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3), mit einigen Ausnahmen:

Der `callback` erhält zwei Argumente `(err, resolvedPath)`. Kann `process.cwd` verwenden, um relative Pfade aufzulösen.

Es werden nur Pfade unterstützt, die in UTF8-Strings konvertiert werden können.

Das optionale Argument `options` kann ein String sein, der eine Kodierung angibt, oder ein Objekt mit einer `encoding`-Eigenschaft, die die Zeichenkodierung angibt, die für den an den Callback übergebenen Pfad verwendet werden soll. Wenn `encoding` auf `'buffer'` gesetzt ist, wird der zurückgegebene Pfad als ein [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)-Objekt übergeben.

Wenn `path` zu einem Socket oder einer Pipe aufgelöst wird, gibt die Funktion einen systemabhängigen Namen für dieses Objekt zurück.

Ein nicht existierender Pfad führt zu einem ENOENT-Fehler. `error.path` ist der absolute Dateipfad.


### `fs.realpath.native(path[, options], callback)` {#fsrealpathnativepath-options-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v9.2.0 | Hinzugefügt in: v9.2.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard:** `'utf8'`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `resolvedPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)
  
 

Asynchrones [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3).

Der `callback` erhält zwei Argumente `(err, resolvedPath)`.

Es werden nur Pfade unterstützt, die in UTF8-Strings konvertiert werden können.

Das optionale `options`-Argument kann ein String sein, der eine Kodierung angibt, oder ein Objekt mit einer `encoding`-Eigenschaft, die die zu verwendende Zeichenkodierung für den an den Callback übergebenen Pfad angibt. Wenn die `encoding` auf `'buffer'` gesetzt ist, wird der zurückgegebene Pfad als [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)-Objekt übergeben.

Unter Linux muss das procfs-Dateisystem auf `/proc` gemountet sein, damit diese Funktion funktioniert, wenn Node.js gegen musl libc gelinkt ist. Glibc hat diese Einschränkung nicht.

### `fs.rename(oldPath, newPath, callback)` {#fsrenameoldpath-newpath-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` ausgelöst. |
| v7.6.0 | Die Parameter `oldPath` und `newPath` können WHATWG `URL`-Objekte verwenden, die das `file:`-Protokoll verwenden. Die Unterstützung ist derzeit noch *experimentell*. |
| v7.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Deprecation-Warnung mit der ID DEP0013 ausgegeben. |
| v0.0.2 | Hinzugefügt in: v0.0.2 |
:::

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Benennt die Datei unter `oldPath` asynchron in den als `newPath` angegebenen Pfad um. Falls `newPath` bereits existiert, wird es überschrieben. Wenn sich unter `newPath` ein Verzeichnis befindet, wird stattdessen ein Fehler ausgelöst. An den Completion-Callback werden keine anderen Argumente als eine mögliche Ausnahme übergeben.

Siehe auch: [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2).

```js [ESM]
import { rename } from 'node:fs';

rename('oldFile.txt', 'newFile.txt', (err) => {
  if (err) throw err;
  console.log('Rename complete!');
});
```

### `fs.rmdir(path[, options], callback)` {#fsrmdirpath-options-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument wirft nun `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v16.0.0 | Die Verwendung von `fs.rmdir(path, { recursive: true })` auf einem `path`, der eine Datei ist, ist nicht mehr zulässig und führt unter Windows zu einem `ENOENT`-Fehler und unter POSIX zu einem `ENOTDIR`-Fehler. |
| v16.0.0 | Die Verwendung von `fs.rmdir(path, { recursive: true })` auf einem `path`, der nicht existiert, ist nicht mehr zulässig und führt zu einem `ENOENT`-Fehler. |
| v16.0.0 | Die Option `recursive` ist veraltet. Die Verwendung löst eine Veraltungswarnung aus. |
| v14.14.0 | Die Option `recursive` ist veraltet, verwenden Sie stattdessen `fs.rm`. |
| v13.3.0, v12.16.0 | Die Option `maxBusyTries` wurde in `maxRetries` umbenannt und ihr Standardwert ist 0. Die Option `emfileWait` wurde entfernt und `EMFILE`-Fehler verwenden die gleiche Wiederholungslogik wie andere Fehler. Die Option `retryDelay` wird jetzt unterstützt. `ENFILE`-Fehler werden jetzt wiederholt. |
| v12.10.0 | Die Optionen `recursive`, `maxBusyTries` und `emfileWait` werden jetzt unterstützt. |
| v10.0.0 | Der Parameter `callback` ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` ausgelöst. |
| v7.6.0 | Die `path`-Parameter können ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v7.0.0 | Der Parameter `callback` ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Veraltungswarnung mit der ID DEP0013 ausgegeben. |
| v0.0.2 | Hinzugefügt in: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wenn ein `EBUSY`-, `EMFILE`-, `ENFILE`-, `ENOTEMPTY`- oder `EPERM`-Fehler auftritt, wiederholt Node.js den Vorgang mit einer linearen Backoff-Wartezeit von `retryDelay` Millisekunden länger bei jedem Versuch. Diese Option stellt die Anzahl der Wiederholungen dar. Diese Option wird ignoriert, wenn die Option `recursive` nicht `true` ist. **Standard:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, führen Sie eine rekursive Verzeichnisentfernung durch. Im rekursiven Modus werden Operationen bei Fehlern wiederholt. **Standard:** `false`. **Veraltet.**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Wartezeit in Millisekunden zwischen den Wiederholungen. Diese Option wird ignoriert, wenn die Option `recursive` nicht `true` ist. **Standard:** `100`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)



Asynchrones [`rmdir(2)`](http://man7.org/linux/man-pages/man2/rmdir.2). Dem Completion-Callback werden keine anderen Argumente als eine mögliche Exception übergeben.

Die Verwendung von `fs.rmdir()` auf einer Datei (nicht einem Verzeichnis) führt unter Windows zu einem `ENOENT`-Fehler und unter POSIX zu einem `ENOTDIR`-Fehler.

Um ein ähnliches Verhalten wie der Unix-Befehl `rm -rf` zu erzielen, verwenden Sie [`fs.rm()`](/de/nodejs/api/fs#fsrmpath-options-callback) mit den Optionen `{ recursive: true, force: true }`.


### `fs.rm(path[, options], callback)` {#fsrmpath-options-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v17.3.0, v16.14.0 | Der Parameter `path` kann ein WHATWG `URL`-Objekt sein, das das `file:`-Protokoll verwendet. |
| v14.14.0 | Hinzugefügt in: v14.14.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, werden Ausnahmen ignoriert, falls `path` nicht existiert. **Standard:** `false`.
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wenn ein `EBUSY`-, `EMFILE`-, `ENFILE`-, `ENOTEMPTY`- oder `EPERM`-Fehler auftritt, wiederholt Node.js den Vorgang mit einer linearen Backoff-Wartezeit, die bei jedem Versuch um `retryDelay` Millisekunden länger ist. Diese Option stellt die Anzahl der Wiederholungsversuche dar. Diese Option wird ignoriert, wenn die Option `recursive` nicht `true` ist. **Standard:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird eine rekursive Entfernung durchgeführt. Im rekursiven Modus werden Operationen bei einem Fehler wiederholt. **Standard:** `false`.
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Zeit in Millisekunden, die zwischen den Wiederholungsversuchen gewartet werden soll. Diese Option wird ignoriert, wenn die Option `recursive` nicht `true` ist. **Standard:** `100`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)



Entfernt asynchron Dateien und Verzeichnisse (nach dem Vorbild des Standard-POSIX-Dienstprogramms `rm`). Der Abschluss-Callback erhält keine anderen Argumente als eine mögliche Ausnahme.


### `fs.stat(path[, options], callback)` {#fsstatpath-options-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Rückrufs an das `callback`-Argument wirft nun `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v10.5.0 | Akzeptiert ein zusätzliches `options`-Objekt, um anzugeben, ob die zurückgegebenen numerischen Werte `bigint` sein sollen. |
| v10.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` ausgelöst. |
| v7.6.0 | Der `path`-Parameter kann ein WHATWG-`URL`-Objekt mit dem `file:`-Protokoll sein. |
| v7.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Veraltungswarnung mit der ID DEP0013 ausgegeben. |
| v0.0.2 | Hinzugefügt in: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ob die numerischen Werte im zurückgegebenen [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)-Objekt `bigint` sein sollen. **Standard:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)
  
 

Asynchrones [`stat(2)`](http://man7.org/linux/man-pages/man2/stat.2). Der Rückruf erhält zwei Argumente `(err, stats)`, wobei `stats` ein [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)-Objekt ist.

Im Fehlerfall ist `err.code` einer der [Allgemeinen Systemfehler](/de/nodejs/api/errors#common-system-errors).

[`fs.stat()`](/de/nodejs/api/fs#fsstatpath-options-callback) folgt symbolischen Links. Verwenden Sie [`fs.lstat()`](/de/nodejs/api/fs#fslstatpath-options-callback), um die Links selbst zu untersuchen.

Die Verwendung von `fs.stat()`, um vor dem Aufruf von `fs.open()`, `fs.readFile()` oder `fs.writeFile()` zu prüfen, ob eine Datei existiert, wird nicht empfohlen. Stattdessen sollte der Benutzercode die Datei direkt öffnen/lesen/schreiben und den Fehler behandeln, der ausgelöst wird, wenn die Datei nicht verfügbar ist.

Um zu prüfen, ob eine Datei existiert, ohne sie danach zu manipulieren, wird [`fs.access()`](/de/nodejs/api/fs#fsaccesspath-mode-callback) empfohlen.

Zum Beispiel, gegeben die folgende Verzeichnisstruktur:

```text [TEXT]
- txtDir
-- file.txt
- app.js
```
Das nächste Programm prüft die Statistiken der gegebenen Pfade:

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
Die resultierende Ausgabe ähnelt:

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

**Hinzugefügt in: v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ob die numerischen Werte im zurückgegebenen [\<fs.StatFs\>](/de/nodejs/api/fs#class-fsstatfs)-Objekt `bigint` sein sollen. **Standard:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.StatFs\>](/de/nodejs/api/fs#class-fsstatfs)



Asynchrones [`statfs(2)`](http://man7.org/linux/man-pages/man2/statfs.2). Gibt Informationen über das eingebundene Dateisystem zurück, das `path` enthält. Der Callback erhält zwei Argumente `(err, stats)`, wobei `stats` ein [\<fs.StatFs\>](/de/nodejs/api/fs#class-fsstatfs)-Objekt ist.

Im Fehlerfall ist `err.code` einer der [Common System Errors](/de/nodejs/api/errors#common-system-errors).

### `fs.symlink(target, path[, type], callback)` {#fssymlinktarget-path-type-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v12.0.0 | Wenn das `type`-Argument undefiniert gelassen wird, erkennt Node den `target`-Typ automatisch und wählt automatisch `dir` oder `file` aus. |
| v7.6.0 | Die Parameter `target` und `path` können WHATWG `URL`-Objekte verwenden, die das `file:`-Protokoll verwenden. Die Unterstützung ist derzeit noch *experimentell*. |
| v0.1.31 | Hinzugefügt in: v0.1.31 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)



Erstellt den Link namens `path`, der auf `target` zeigt. Dem Abschluss-Callback werden keine anderen Argumente als eine mögliche Ausnahme übergeben.

Weitere Informationen finden Sie in der POSIX-Dokumentation [`symlink(2)`](http://man7.org/linux/man-pages/man2/symlink.2).

Das `type`-Argument ist nur unter Windows verfügbar und wird auf anderen Plattformen ignoriert. Es kann auf `'dir'`, `'file'` oder `'junction'` gesetzt werden. Wenn das `type`-Argument `null` ist, erkennt Node.js den `target`-Typ automatisch und verwendet `'file'` oder `'dir'`. Wenn das `target` nicht existiert, wird `'file'` verwendet. Windows Junction Points erfordern, dass der Zielpfad absolut ist. Bei Verwendung von `'junction'` wird das `target`-Argument automatisch in einen absoluten Pfad normalisiert. Junction Points auf NTFS-Volumes können nur auf Verzeichnisse verweisen.

Relative Ziele sind relativ zum übergeordneten Verzeichnis des Links.

```js [ESM]
import { symlink } from 'node:fs';

symlink('./mew', './mewtwo', callback);
```
Das obige Beispiel erstellt einen symbolischen Link `mewtwo`, der auf `mew` im selben Verzeichnis verweist:

```bash [BASH]
$ tree .
.
├── mew
└── mewtwo -> ./mew
```

### `fs.truncate(path[, len], callback)` {#fstruncatepath-len-callback}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v16.0.0 | Der zurückgegebene Fehler kann ein `AggregateError` sein, wenn mehr als ein Fehler zurückgegeben wird. |
| v10.0.0 | Der Parameter `callback` ist nicht mehr optional. Das Nicht-Übergeben führt zur Laufzeit zu einem `TypeError`. |
| v7.0.0 | Der Parameter `callback` ist nicht mehr optional. Das Nicht-Übergeben gibt eine Deprecation-Warnung mit der ID DEP0013 aus. |
| v0.8.6 | Hinzugefügt in: v0.8.6 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `0`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)

Kürzt die Datei. Es werden keine anderen Argumente als eine mögliche Ausnahme an den Completion-Callback übergeben. Ein File Descriptor kann auch als erstes Argument übergeben werden. In diesem Fall wird `fs.ftruncate()` aufgerufen.

::: code-group
```js [ESM]
import { truncate } from 'node:fs';
// Angenommen, 'path/file.txt' ist eine reguläre Datei.
truncate('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt wurde gekürzt');
});
```

```js [CJS]
const { truncate } = require('node:fs');
// Angenommen, 'path/file.txt' ist eine reguläre Datei.
truncate('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt wurde gekürzt');
});
```
:::

Die Übergabe eines File Descriptors ist veraltet und kann in Zukunft zu einem Fehler führen.

Weitere Informationen finden Sie in der POSIX [`truncate(2)`](http://man7.org/linux/man-pages/man2/truncate.2)-Dokumentation.


### `fs.unlink(path, callback)` {#fsunlinkpath-callback}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` ausgelöst. |
| v7.6.0 | Der `path`-Parameter kann ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v7.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Deprecation-Warnung mit der ID DEP0013 ausgegeben. |
| v0.0.2 | Hinzugefügt in: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Entfernt asynchron eine Datei oder einen symbolischen Link. Es werden keine anderen Argumente als eine mögliche Ausnahme an den Completion-Callback übergeben.

```js [ESM]
import { unlink } from 'node:fs';
// Angenommen, 'path/file.txt' ist eine reguläre Datei.
unlink('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt wurde gelöscht');
});
```
`fs.unlink()` funktioniert nicht auf einem Verzeichnis, leer oder nicht. Um ein Verzeichnis zu entfernen, verwenden Sie [`fs.rmdir()`](/de/nodejs/api/fs#fsrmdirpath-options-callback).

Weitere Informationen finden Sie in der POSIX [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2)-Dokumentation.

### `fs.unwatchFile(filename[, listener])` {#fsunwatchfilefilename-listener}

**Hinzugefügt in: v0.1.31**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Optional, ein Listener, der zuvor mit `fs.watchFile()` angehängt wurde

Beendet die Überwachung von Änderungen an `filename`. Wenn `listener` angegeben ist, wird nur dieser bestimmte Listener entfernt. Andernfalls werden *alle* Listener entfernt, wodurch die Überwachung von `filename` effektiv beendet wird.

Der Aufruf von `fs.unwatchFile()` mit einem Dateinamen, der nicht überwacht wird, ist ein No-Op, kein Fehler.

Die Verwendung von [`fs.watch()`](/de/nodejs/api/fs#fswatchfilename-options-listener) ist effizienter als `fs.watchFile()` und `fs.unwatchFile()`. `fs.watch()` sollte, wenn möglich, anstelle von `fs.watchFile()` und `fs.unwatchFile()` verwendet werden.


### `fs.utimes(path, atime, mtime, callback)` {#fsutimespath-atime-mtime-callback}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das Argument `callback` wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Der Parameter `callback` ist nicht mehr optional. Das Nicht-Übergeben löst zur Laufzeit einen `TypeError` aus. |
| v8.0.0 | `NaN`, `Infinity` und `-Infinity` sind keine gültigen Zeitspezifizierer mehr. |
| v7.6.0 | Der Parameter `path` kann ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v7.0.0 | Der Parameter `callback` ist nicht mehr optional. Das Nicht-Übergeben löst eine Veraltungswarnung mit der ID DEP0013 aus. |
| v4.1.0 | Numerische Zeichenketten, `NaN` und `Infinity` sind jetzt als Zeitspezifizierer zulässig. |
| v0.4.2 | Hinzugefügt in: v0.4.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Ändert die Dateisystem-Zeitstempel des Objekts, auf das durch `path` verwiesen wird.

Die Argumente `atime` und `mtime` folgen diesen Regeln:

- Werte können entweder Zahlen sein, die die Unix-Epochenzeit in Sekunden darstellen, `Date`s oder eine numerische Zeichenkette wie `'123456789.0'`.
- Wenn der Wert nicht in eine Zahl konvertiert werden kann oder `NaN`, `Infinity` oder `-Infinity` ist, wird ein `Error` geworfen.


### `fs.watch(filename[, options][, listener])` {#fswatchfilename-options-listener}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v19.1.0 | Rekursive Unterstützung für Linux, AIX und IBMi hinzugefügt. |
| v15.9.0, v14.17.0 | Unterstützung zum Schließen des Watchers mit einem AbortSignal hinzugefügt. |
| v7.6.0 | Der Parameter `filename` kann ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v7.0.0 | Das übergebene `options`-Objekt wird niemals geändert. |
| v0.5.10 | Hinzugefügt in: v0.5.10 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt an, ob der Prozess weiterhin ausgeführt werden soll, solange Dateien überwacht werden. **Standard:** `true`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt an, ob alle Unterverzeichnisse oder nur das aktuelle Verzeichnis überwacht werden sollen. Dies gilt, wenn ein Verzeichnis angegeben wird, und nur auf unterstützten Plattformen (siehe [Einschränkungen](/de/nodejs/api/fs#einschrankungen)). **Standard:** `false`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Gibt die Zeichencodierung an, die für den an den Listener übergebenen Dateinamen verwendet werden soll. **Standard:** `'utf8'`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) ermöglicht das Schließen des Watchers mit einem AbortSignal.


- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) **Standard:** `undefined`
    - `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)


- Gibt zurück: [\<fs.FSWatcher\>](/de/nodejs/api/fs#class-fsfswatcher)

Überwacht Änderungen an `filename`, wobei `filename` entweder eine Datei oder ein Verzeichnis ist.

Das zweite Argument ist optional. Wenn `options` als String angegeben wird, gibt es die `encoding` an. Andernfalls sollte `options` als Objekt übergeben werden.

Der Listener-Callback erhält zwei Argumente `(eventType, filename)`. `eventType` ist entweder `'rename'` oder `'change'`, und `filename` ist der Name der Datei, die das Ereignis ausgelöst hat.

Auf den meisten Plattformen wird `'rename'` ausgegeben, wenn ein Dateiname im Verzeichnis erscheint oder verschwindet.

Der Listener-Callback ist an das `'change'`-Ereignis angehängt, das von [\<fs.FSWatcher\>](/de/nodejs/api/fs#class-fsfswatcher) ausgelöst wird, aber es ist nicht dasselbe wie der `'change'`-Wert von `eventType`.

Wenn ein `signal` übergeben wird, schließt das Abbrechen des entsprechenden AbortControllers den zurückgegebenen [\<fs.FSWatcher\>](/de/nodejs/api/fs#class-fsfswatcher).


#### Einschränkungen {#caveats}

Die `fs.watch`-API ist nicht auf allen Plattformen zu 100 % konsistent und in einigen Situationen nicht verfügbar.

Unter Windows werden keine Ereignisse ausgelöst, wenn das überwachte Verzeichnis verschoben oder umbenannt wird. Beim Löschen des überwachten Verzeichnisses wird ein `EPERM`-Fehler gemeldet.

##### Verfügbarkeit {#availability}

Diese Funktion hängt davon ab, dass das zugrunde liegende Betriebssystem eine Möglichkeit bietet, über Änderungen im Dateisystem benachrichtigt zu werden.

- Auf Linux-Systemen wird dies mit [`inotify(7)`](https://man7.org/linux/man-pages/man7/inotify.7) realisiert.
- Auf BSD-Systemen wird dies mit [`kqueue(2)`](https://www.freebsd.org/cgi/man.cgi?query=kqueue&sektion=2) realisiert.
- Auf macOS wird dies für Dateien mit [`kqueue(2)`](https://www.freebsd.org/cgi/man.cgi?query=kqueue&sektion=2) und für Verzeichnisse mit [`FSEvents`](https://developer.apple.com/documentation/coreservices/file_system_events) realisiert.
- Auf SunOS-Systemen (einschließlich Solaris und SmartOS) wird dies mit [`event ports`](https://illumos.org/man/port_create) realisiert.
- Auf Windows-Systemen hängt diese Funktion von [`ReadDirectoryChangesW`](https://docs.microsoft.com/en-us/windows/desktop/api/winbase/nf-winbase-readdirectorychangesw) ab.
- Auf AIX-Systemen hängt diese Funktion von [`AHAFS`](https://developer.ibm.com/articles/au-aix_event_infrastructure/) ab, das aktiviert sein muss.
- Auf IBM i-Systemen wird diese Funktion nicht unterstützt.

Wenn die zugrunde liegende Funktionalität aus irgendeinem Grund nicht verfügbar ist, kann `fs.watch()` nicht funktionieren und möglicherweise eine Ausnahme auslösen. Beispielsweise kann die Überwachung von Dateien oder Verzeichnissen in Netzwerkdateisystemen (NFS, SMB usw.) oder Host-Dateisystemen bei Verwendung von Virtualisierungssoftware wie Vagrant oder Docker unzuverlässig und in einigen Fällen unmöglich sein.

Es ist weiterhin möglich, `fs.watchFile()` zu verwenden, das Stat-Polling verwendet, aber diese Methode ist langsamer und weniger zuverlässig.

##### Inodes {#inodes}

Auf Linux- und macOS-Systemen löst `fs.watch()` den Pfad zu einem [Inode](https://en.wikipedia.org/wiki/Inode) auf und überwacht den Inode. Wenn der überwachte Pfad gelöscht und neu erstellt wird, wird ihm ein neuer Inode zugewiesen. Die Überwachung löst ein Ereignis für das Löschen aus, überwacht aber weiterhin den *ursprünglichen* Inode. Ereignisse für den neuen Inode werden nicht ausgelöst. Dies ist das erwartete Verhalten.

AIX-Dateien behalten denselben Inode für die Lebensdauer einer Datei bei. Das Speichern und Schließen einer überwachten Datei unter AIX führt zu zwei Benachrichtigungen (eine für das Hinzufügen von neuem Inhalt und eine für das Kürzen).


##### Filename-Argument {#filename-argument}

Die Angabe des `filename`-Arguments im Callback wird nur unter Linux, macOS, Windows und AIX unterstützt. Selbst auf unterstützten Plattformen ist nicht immer gewährleistet, dass `filename` bereitgestellt wird. Gehen Sie daher nicht davon aus, dass das `filename`-Argument immer im Callback bereitgestellt wird, und haben Sie eine Fallback-Logik, falls es `null` ist.

```js [ESM]
import { watch } from 'node:fs';
watch('somedir', (eventType, filename) => {
  console.log(`Ereignistyp ist: ${eventType}`);
  if (filename) {
    console.log(`Dateiname angegeben: ${filename}`);
  } else {
    console.log('Dateiname nicht angegeben');
  }
});
```
### `fs.watchFile(filename[, options], listener)` {#fswatchfilefilename-options-listener}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.5.0 | Die Option `bigint` wird jetzt unterstützt. |
| v7.6.0 | Der Parameter `filename` kann ein WHATWG `URL`-Objekt sein, das das `file:`-Protokoll verwendet. |
| v0.1.31 | Hinzugefügt in: v0.1.31 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `false`
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `true`
    - `interval` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `5007`
  
 
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `current` [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)
    - `previous` [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)
  
 
- Gibt zurück: [\<fs.StatWatcher\>](/de/nodejs/api/fs#class-fsstatwatcher)

Überwacht Änderungen an `filename`. Der Callback `listener` wird jedes Mal aufgerufen, wenn auf die Datei zugegriffen wird.

Das Argument `options` kann weggelassen werden. Wenn es angegeben wird, sollte es ein Objekt sein. Das Objekt `options` kann einen booleschen Wert namens `persistent` enthalten, der angibt, ob der Prozess weiterhin ausgeführt werden soll, solange Dateien überwacht werden. Das Objekt `options` kann eine `interval`-Eigenschaft angeben, die angibt, wie oft das Ziel in Millisekunden abgefragt werden soll.

Der `listener` erhält zwei Argumente: das aktuelle Stat-Objekt und das vorherige Stat-Objekt:

```js [ESM]
import { watchFile } from 'node:fs';

watchFile('message.text', (curr, prev) => {
  console.log(`die aktuelle mtime ist: ${curr.mtime}`);
  console.log(`die vorherige mtime war: ${prev.mtime}`);
});
```
Diese Stat-Objekte sind Instanzen von `fs.Stat`. Wenn die Option `bigint` `true` ist, werden die numerischen Werte in diesen Objekten als `BigInt`s angegeben.

Um benachrichtigt zu werden, wenn die Datei geändert wurde, und nicht nur darauf zugegriffen wurde, ist es erforderlich, `curr.mtimeMs` und `prev.mtimeMs` zu vergleichen.

Wenn ein `fs.watchFile`-Vorgang zu einem `ENOENT`-Fehler führt, ruft er den Listener einmal auf, wobei alle Felder auf Null gesetzt sind (oder, für Datumsangaben, die Unix-Epoche). Wenn die Datei später erstellt wird, wird der Listener erneut aufgerufen, mit den neuesten Stat-Objekten. Dies ist eine Änderung der Funktionalität seit v0.10.

Die Verwendung von [`fs.watch()`](/de/nodejs/api/fs#fswatchfilename-options-listener) ist effizienter als `fs.watchFile` und `fs.unwatchFile`. `fs.watch` sollte nach Möglichkeit anstelle von `fs.watchFile` und `fs.unwatchFile` verwendet werden.

Wenn eine Datei, die von `fs.watchFile()` überwacht wird, verschwindet und wieder auftaucht, ist der Inhalt von `previous` im zweiten Callback-Ereignis (das Wiederauftauchen der Datei) derselbe wie der Inhalt von `previous` im ersten Callback-Ereignis (ihr Verschwinden).

Dies geschieht, wenn:

- die Datei gelöscht und anschließend wiederhergestellt wird
- die Datei umbenannt und dann ein zweites Mal zurück in ihren ursprünglichen Namen umbenannt wird


### `fs.write(fd, buffer, offset[, length[, position]], callback)` {#fswritefd-buffer-offset-length-position-callback}

::: info [History]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v14.0.0 | Der `buffer`-Parameter erzwingt keine nicht unterstützten Eingaben mehr in Strings. |
| v10.10.0 | Der `buffer`-Parameter kann jetzt ein beliebiger `TypedArray` oder eine `DataView` sein. |
| v10.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` ausgelöst. |
| v7.4.0 | Der `buffer`-Parameter kann jetzt ein `Uint8Array` sein. |
| v7.2.0 | Die Parameter `offset` und `length` sind jetzt optional. |
| v7.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Deprecation-Warnung mit der ID DEP0013 ausgegeben. |
| v0.0.2 | Hinzugefügt in: v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

Schreibt `buffer` in die durch `fd` angegebene Datei.

`offset` bestimmt den Teil des Puffers, der geschrieben werden soll, und `length` ist eine Ganzzahl, die die Anzahl der zu schreibenden Bytes angibt.

`position` bezieht sich auf den Offset vom Anfang der Datei, an dem diese Daten geschrieben werden sollen. Wenn `typeof position !== 'number'`, werden die Daten an der aktuellen Position geschrieben. Siehe [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2).

Der Callback erhält drei Argumente `(err, bytesWritten, buffer)`, wobei `bytesWritten` angibt, wie viele *Bytes* aus `buffer` geschrieben wurden.

Wenn diese Methode als ihre [`util.promisify()`](/de/nodejs/api/util#utilpromisifyoriginal)-Version aufgerufen wird, gibt sie ein Promise für ein `Object` mit den Eigenschaften `bytesWritten` und `buffer` zurück.

Es ist unsicher, `fs.write()` mehrmals auf derselben Datei zu verwenden, ohne auf den Callback zu warten. Für dieses Szenario wird [`fs.createWriteStream()`](/de/nodejs/api/fs#fscreatewritestreampath-options) empfohlen.

Unter Linux funktionieren positionelle Schreibvorgänge nicht, wenn die Datei im Anhangmodus geöffnet wird. Der Kernel ignoriert das Positionsargument und hängt die Daten immer an das Ende der Datei an.


### `fs.write(fd, buffer[, options], callback)` {#fswritefd-buffer-options-callback}

**Hinzugefügt in: v18.3.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standardwert:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standardwert:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standardwert:** `null`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
  
 

Schreibt `buffer` in die durch `fd` angegebene Datei.

Ähnlich der obigen `fs.write`-Funktion akzeptiert diese Version ein optionales `options`-Objekt. Wenn kein `options`-Objekt angegeben ist, werden die obigen Werte standardmäßig verwendet.

### `fs.write(fd, string[, position[, encoding]], callback)` {#fswritefd-string-position-encoding-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Das Übergeben eines Objekts mit einer eigenen `toString`-Funktion an den `string`-Parameter wird nicht mehr unterstützt. |
| v17.8.0 | Das Übergeben eines Objekts mit einer eigenen `toString`-Funktion an den `string`-Parameter ist veraltet. |
| v14.12.0 | Der `string`-Parameter wandelt ein Objekt mit einer expliziten `toString`-Funktion in einen String um. |
| v14.0.0 | Der `string`-Parameter wandelt nicht mehr unterstützte Eingaben nicht mehr in Strings um. |
| v10.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` ausgelöst. |
| v7.2.0 | Der `position`-Parameter ist jetzt optional. |
| v7.0.0 | Der `callback`-Parameter ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Veraltungswarnung mit der ID DEP0013 ausgegeben. |
| v0.11.5 | Hinzugefügt in: v0.11.5 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standardwert:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standardwert:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `written` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

Schreibt `string` in die durch `fd` angegebene Datei. Wenn `string` kein String ist, wird eine Ausnahme ausgelöst.

`position` bezieht sich auf den Offset vom Anfang der Datei, an dem diese Daten geschrieben werden sollen. Wenn `typeof position !== 'number'`, werden die Daten an der aktuellen Position geschrieben. Siehe [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2).

`encoding` ist die erwartete String-Kodierung.

Der Callback empfängt die Argumente `(err, written, string)`, wobei `written` angibt, wie viele *Bytes* der übergebene String zum Schreiben benötigt hat. Die geschriebenen Bytes sind nicht unbedingt dasselbe wie die geschriebenen String-Zeichen. Siehe [`Buffer.byteLength`](/de/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding).

Es ist unsicher, `fs.write()` mehrmals auf derselben Datei zu verwenden, ohne auf den Callback zu warten. Für dieses Szenario wird [`fs.createWriteStream()`](/de/nodejs/api/fs#fscreatewritestreampath-options) empfohlen.

Unter Linux funktionieren positionelle Schreibvorgänge nicht, wenn die Datei im Anhängemodus geöffnet wird. Der Kernel ignoriert das Position-Argument und hängt die Daten immer an das Ende der Datei an.

Unter Windows wird ein String, der Nicht-ASCII-Zeichen enthält, standardmäßig nicht richtig gerendert, wenn der File Descriptor mit der Konsole verbunden ist (z. B. `fd == 1` oder `stdout`), unabhängig von der verwendeten Kodierung. Es ist möglich, die Konsole so zu konfigurieren, dass UTF-8 richtig gerendert wird, indem die aktive Codepage mit dem Befehl `chcp 65001` geändert wird. Weitere Informationen finden Sie in der [chcp](https://ss64.com/nt/chcp)-Dokumentation.


### `fs.writeFile(file, data[, options], callback)` {#fswritefilefile-data-options-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.0.0, v20.10.0 | Die Option `flush` wird jetzt unterstützt. |
| v19.0.0 | Das Übergeben eines Objekts mit einer eigenen `toString`-Funktion an den Parameter `string` wird nicht mehr unterstützt. |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v17.8.0 | Das Übergeben eines Objekts mit einer eigenen `toString`-Funktion an den Parameter `string` ist veraltet. |
| v16.0.0 | Der zurückgegebene Fehler kann ein `AggregateError` sein, wenn mehr als ein Fehler zurückgegeben wird. |
| v15.2.0, v14.17.0 | Das Optionsargument kann ein AbortSignal enthalten, um eine laufende writeFile-Anforderung abzubrechen. |
| v14.12.0 | Der Parameter `data` wandelt ein Objekt mit einer expliziten `toString`-Funktion in einen String um. |
| v14.0.0 | Der Parameter `data` erzwingt nicht mehr, dass nicht unterstützte Eingaben in Strings umgewandelt werden. |
| v10.10.0 | Der Parameter `data` kann jetzt ein beliebiges `TypedArray` oder ein `DataView` sein. |
| v10.0.0 | Der Parameter `callback` ist nicht mehr optional. Wenn er nicht übergeben wird, wird zur Laufzeit ein `TypeError` ausgelöst. |
| v7.4.0 | Der Parameter `data` kann jetzt ein `Uint8Array` sein. |
| v7.0.0 | Der Parameter `callback` ist nicht mehr optional. Wenn er nicht übergeben wird, wird eine Veraltungswarnung mit der ID DEP0013 ausgegeben. |
| v5.0.0 | Der Parameter `file` kann jetzt ein Dateideskriptor sein. |
| v0.1.29 | Hinzugefügt in: v0.1.29 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dateiname oder Dateideskriptor
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Siehe [Unterstützung von Datei-System `flags`](/de/nodejs/api/fs#file-system-flags). **Standard:** `'w'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn alle Daten erfolgreich in die Datei geschrieben wurden und `flush` `true` ist, wird `fs.fsync()` verwendet, um die Daten zu leeren. **Standard:** `false`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) ermöglicht das Abbrechen einer laufenden writeFile-Anforderung


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)


Wenn `file` ein Dateiname ist, schreibt asynchron Daten in die Datei und ersetzt die Datei, falls sie bereits vorhanden ist. `data` kann ein String oder ein Puffer sein.

Wenn `file` ein Dateideskriptor ist, verhält es sich ähnlich wie ein direkter Aufruf von `fs.write()` (was empfohlen wird). Siehe die Hinweise unten zur Verwendung eines Dateideskriptors.

Die Option `encoding` wird ignoriert, wenn `data` ein Puffer ist.

Die Option `mode` wirkt sich nur auf die neu erstellte Datei aus. Weitere Informationen finden Sie unter [`fs.open()`](/de/nodejs/api/fs#fsopenpath-flags-mode-callback).

```js [ESM]
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
```
Wenn `options` ein String ist, gibt er die Kodierung an:

```js [ESM]
import { writeFile } from 'node:fs';

writeFile('message.txt', 'Hello Node.js', 'utf8', callback);
```
Es ist unsicher, `fs.writeFile()` mehrmals auf derselben Datei zu verwenden, ohne auf den Callback zu warten. Für dieses Szenario wird [`fs.createWriteStream()`](/de/nodejs/api/fs#fscreatewritestreampath-options) empfohlen.

Ähnlich wie bei `fs.readFile` ist `fs.writeFile` eine Komfortmethode, die intern mehrere `write`-Aufrufe ausführt, um den ihr übergebenen Puffer zu schreiben. Für leistungssensiblen Code sollten Sie [`fs.createWriteStream()`](/de/nodejs/api/fs#fscreatewritestreampath-options) verwenden.

Es ist möglich, ein [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) zu verwenden, um ein `fs.writeFile()` abzubrechen. Die Abbrechen ist "Best Effort", und es wird wahrscheinlich trotzdem eine gewisse Datenmenge geschrieben.

```js [ESM]
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const controller = new AbortController();
const { signal } = controller;
const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, { signal }, (err) => {
  // Wenn eine Anforderung abgebrochen wird - wird der Callback mit einem AbortError aufgerufen
});
// Wenn die Anforderung abgebrochen werden soll
controller.abort();
```
Das Abbrechen einer laufenden Anforderung bricht nicht einzelne Betriebssystemanforderungen ab, sondern die interne Pufferung, die `fs.writeFile` durchführt.


#### Verwendung von `fs.writeFile()` mit Dateideskriptoren {#using-fswritefile-with-file-descriptors}

Wenn `file` ein Dateideskriptor ist, verhält es sich fast identisch zum direkten Aufruf von `fs.write()` wie folgt:

```js [ESM]
import { write } from 'node:fs';
import { Buffer } from 'node:buffer';

write(fd, Buffer.from(data, options.encoding), callback);
```

Der Unterschied zum direkten Aufruf von `fs.write()` besteht darin, dass unter ungewöhnlichen Bedingungen `fs.write()` möglicherweise nur einen Teil des Puffers schreibt und erneut versucht werden muss, die restlichen Daten zu schreiben, während `fs.writeFile()` so lange wiederholt, bis die Daten vollständig geschrieben sind (oder ein Fehler auftritt).

Die Implikationen davon sind eine häufige Quelle von Verwirrung. Im Fall des Dateideskriptors wird die Datei nicht ersetzt! Die Daten werden nicht unbedingt an den Anfang der Datei geschrieben, und die ursprünglichen Daten der Datei können vor und/oder nach den neu geschriebenen Daten verbleiben.

Wenn beispielsweise `fs.writeFile()` zweimal hintereinander aufgerufen wird, zuerst um die Zeichenkette `'Hallo'` zu schreiben und dann um die Zeichenkette `', Welt'` zu schreiben, würde die Datei `'Hallo, Welt'` enthalten und möglicherweise einen Teil der ursprünglichen Daten der Datei enthalten (abhängig von der Größe der ursprünglichen Datei und der Position des Dateideskriptors). Wenn anstelle eines Deskriptors ein Dateiname verwendet worden wäre, wäre garantiert, dass die Datei nur `', Welt'` enthält.

### `fs.writev(fd, buffers[, position], callback)` {#fswritevfd-buffers-position-callback}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v12.9.0 | Hinzugefügt in: v12.9.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)

Schreibt ein Array von `ArrayBufferView`s in die durch `fd` angegebene Datei unter Verwendung von `writev()`.

`position` ist der Offset vom Anfang der Datei, an dem diese Daten geschrieben werden sollen. Wenn `typeof position !== 'number'`, werden die Daten an der aktuellen Position geschrieben.

Der Callback erhält drei Argumente: `err`, `bytesWritten` und `buffers`. `bytesWritten` gibt an, wie viele Bytes aus `buffers` geschrieben wurden.

Wenn diese Methode [`util.promisify()`](/de/nodejs/api/util#utilpromisifyoriginal)ed ist, gibt sie ein Promise für ein `Object` mit den Eigenschaften `bytesWritten` und `buffers` zurück.

Es ist unsicher, `fs.writev()` mehrmals auf derselben Datei zu verwenden, ohne auf den Callback zu warten. Verwenden Sie für dieses Szenario [`fs.createWriteStream()`](/de/nodejs/api/fs#fscreatewritestreampath-options).

Unter Linux funktionieren positionelle Schreibvorgänge nicht, wenn die Datei im Anhängemodus geöffnet wird. Der Kernel ignoriert das Positionsargument und hängt die Daten immer am Ende der Datei an.


## Synchrone API {#synchronous-api}

Die synchronen APIs führen alle Operationen synchron aus und blockieren die Ereignisschleife, bis die Operation abgeschlossen ist oder fehlschlägt.

### `fs.accessSync(path[, mode])` {#fsaccesssyncpath-mode}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v7.6.0 | Der Parameter `path` kann ein WHATWG `URL`-Objekt sein, das das `file:`-Protokoll verwendet. |
| v0.11.15 | Hinzugefügt in: v0.11.15 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `fs.constants.F_OK`

Testet synchron die Berechtigungen eines Benutzers für die durch `path` angegebene Datei oder das Verzeichnis. Das Argument `mode` ist eine optionale ganze Zahl, die die auszuführenden Zugänglichkeitsprüfungen angibt. `mode` sollte entweder der Wert `fs.constants.F_OK` oder eine Maske sein, die aus dem bitweisen OR von `fs.constants.R_OK`, `fs.constants.W_OK` und `fs.constants.X_OK` besteht (z. B. `fs.constants.W_OK | fs.constants.R_OK`). Siehe [Datei-Zugriffskonstanten](/de/nodejs/api/fs#file-access-constants) für mögliche Werte von `mode`.

Wenn eine der Zugänglichkeitsprüfungen fehlschlägt, wird ein `Error` ausgelöst. Andernfalls gibt die Methode `undefined` zurück.

```js [ESM]
import { accessSync, constants } from 'node:fs';

try {
  accessSync('etc/passwd', constants.R_OK | constants.W_OK);
  console.log('kann lesen/schreiben');
} catch (err) {
  console.error('kein Zugriff!');
}
```
### `fs.appendFileSync(path, data[, options])` {#fsappendfilesyncpath-data-options}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.1.0, v20.10.0 | Die Option `flush` wird jetzt unterstützt. |
| v7.0.0 | Das übergebene `options`-Objekt wird niemals geändert. |
| v5.0.0 | Der Parameter `file` kann jetzt ein Dateideskriptor sein. |
| v0.6.7 | Hinzugefügt in: v0.6.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dateiname oder Dateideskriptor
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Siehe [Unterstützung von Datei-System `flags`](/de/nodejs/api/fs#file-system-flags). **Standard:** `'a'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird der zugrunde liegende Dateideskriptor vor dem Schließen geleert. **Standard:** `false`.



Synchrones Anhängen von Daten an eine Datei, wobei die Datei erstellt wird, falls sie noch nicht existiert. `data` kann ein String oder ein [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) sein.

Die Option `mode` wirkt sich nur auf die neu erstellte Datei aus. Siehe [`fs.open()`](/de/nodejs/api/fs#fsopenpath-flags-mode-callback) für weitere Details.

```js [ESM]
import { appendFileSync } from 'node:fs';

try {
  appendFileSync('message.txt', 'data to append');
  console.log('Die "data to append" wurde an die Datei angehängt!');
} catch (err) {
  /* Handle the error */
}
```
Wenn `options` ein String ist, gibt er die Kodierung an:

```js [ESM]
import { appendFileSync } from 'node:fs';

appendFileSync('message.txt', 'data to append', 'utf8');
```
Der `path` kann als numerischer Dateideskriptor angegeben werden, der zum Anhängen geöffnet wurde (mit `fs.open()` oder `fs.openSync()`). Der Dateideskriptor wird nicht automatisch geschlossen.

```js [ESM]
import { openSync, closeSync, appendFileSync } from 'node:fs';

let fd;

try {
  fd = openSync('message.txt', 'a');
  appendFileSync(fd, 'data to append', 'utf8');
} catch (err) {
  /* Handle the error */
} finally {
  if (fd !== undefined)
    closeSync(fd);
}
```

### `fs.chmodSync(path, mode)` {#fschmodsyncpath-mode}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v7.6.0 | Der Parameter `path` kann ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v0.6.7 | Hinzugefügt in: v0.6.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Detaillierte Informationen finden Sie in der Dokumentation der asynchronen Version dieser API: [`fs.chmod()`](/de/nodejs/api/fs#fschmodpath-mode-callback).

Weitere Informationen finden Sie in der POSIX-Dokumentation [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2).

### `fs.chownSync(path, uid, gid)` {#fschownsyncpath-uid-gid}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v7.6.0 | Der Parameter `path` kann ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v0.1.97 | Hinzugefügt in: v0.1.97 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Ändert synchron den Eigentümer und die Gruppe einer Datei. Gibt `undefined` zurück. Dies ist die synchrone Version von [`fs.chown()`](/de/nodejs/api/fs#fschownpath-uid-gid-callback).

Weitere Informationen finden Sie in der POSIX-Dokumentation [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2).

### `fs.closeSync(fd)` {#fsclosesyncfd}

**Hinzugefügt in: v0.1.21**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Schließt den Dateideskriptor. Gibt `undefined` zurück.

Der Aufruf von `fs.closeSync()` auf einem beliebigen Dateideskriptor (`fd`), der gerade durch eine andere `fs`-Operation verwendet wird, kann zu undefiniertem Verhalten führen.

Weitere Informationen finden Sie in der POSIX-Dokumentation [`close(2)`](http://man7.org/linux/man-pages/man2/close.2).


### `fs.copyFileSync(src, dest[, mode])` {#fscopyfilesyncsrc-dest-mode}

::: info [History]
| Version | Changes |
| --- | --- |
| v14.0.0 | `flags`-Argument wurde in `mode` geändert und eine strengere Typvalidierung erzwungen. |
| v8.5.0 | Hinzugefügt in: v8.5.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Quelldateiname zum Kopieren
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Zieldateiname des Kopiervorgangs
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Modifikatoren für den Kopiervorgang. **Standard:** `0`.

Kopiert `src` synchron nach `dest`. Standardmäßig wird `dest` überschrieben, falls es bereits vorhanden ist. Gibt `undefined` zurück. Node.js übernimmt keine Garantie für die Atomarität des Kopiervorgangs. Wenn nach dem Öffnen der Zieldatei zum Schreiben ein Fehler auftritt, versucht Node.js, das Ziel zu entfernen.

`mode` ist eine optionale Ganzzahl, die das Verhalten des Kopiervorgangs angibt. Es ist möglich, eine Maske zu erstellen, die aus dem bitweisen OR von zwei oder mehr Werten besteht (z. B. `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`).

- `fs.constants.COPYFILE_EXCL`: Der Kopiervorgang schlägt fehl, wenn `dest` bereits vorhanden ist.
- `fs.constants.COPYFILE_FICLONE`: Der Kopiervorgang versucht, einen Copy-on-Write-Reflink zu erstellen. Wenn die Plattform Copy-on-Write nicht unterstützt, wird ein Fallback-Kopiermechanismus verwendet.
- `fs.constants.COPYFILE_FICLONE_FORCE`: Der Kopiervorgang versucht, einen Copy-on-Write-Reflink zu erstellen. Wenn die Plattform Copy-on-Write nicht unterstützt, schlägt der Vorgang fehl.

```js [ESM]
import { copyFileSync, constants } from 'node:fs';

// destination.txt wird standardmäßig erstellt oder überschrieben.
copyFileSync('source.txt', 'destination.txt');
console.log('source.txt wurde nach destination.txt kopiert');

// Durch die Verwendung von COPYFILE_EXCL schlägt der Vorgang fehl, wenn destination.txt vorhanden ist.
copyFileSync('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
```

### `fs.cpSync(src, dest[, options])` {#fscpsyncsrc-dest-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v22.3.0 | Diese API ist nicht mehr experimentell. |
| v20.1.0, v18.17.0 | Akzeptiert eine zusätzliche `mode`-Option, um das Kopierverhalten als das `mode`-Argument von `fs.copyFile()` anzugeben. |
| v17.6.0, v16.15.0 | Akzeptiert eine zusätzliche `verbatimSymlinks`-Option, um anzugeben, ob die Pfadauflösung für Symlinks durchgeführt werden soll. |
| v16.7.0 | Hinzugefügt in: v16.7.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Quellpfad zum Kopieren.
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Zielpfad zum Kopieren.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Dereferenzieren von Symlinks. **Standard:** `false`.
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) wenn `force` `false` ist und das Ziel existiert, einen Fehler auslösen. **Standard:** `false`.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funktion zum Filtern kopierter Dateien/Verzeichnisse. Gibt `true` zurück, um das Element zu kopieren, `false` um es zu ignorieren. Wenn ein Verzeichnis ignoriert wird, wird auch der gesamte Inhalt übersprungen. **Standard:** `undefined`
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Quellpfad zum Kopieren.
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Zielpfad zum Kopieren.
    - Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Jeder Nicht-`Promise`-Wert, der in `boolean` konvertiert werden kann.

    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Vorhandene Datei oder Verzeichnis überschreiben. Der Kopiervorgang ignoriert Fehler, wenn Sie dies auf false setzen und das Ziel existiert. Verwenden Sie die Option `errorOnExist`, um dieses Verhalten zu ändern. **Standard:** `true`.
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Modifikatoren für den Kopiervorgang. **Standard:** `0`. Siehe `mode`-Flag von [`fs.copyFileSync()`](/de/nodejs/api/fs#fscopyfilesyncsrc-dest-mode).
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, werden Zeitstempel von `src` beibehalten. **Standard:** `false`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Verzeichnisse rekursiv kopieren. **Standard:** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird die Pfadauflösung für Symlinks übersprungen. **Standard:** `false`

Kopiert synchron die gesamte Verzeichnisstruktur von `src` nach `dest`, einschließlich Unterverzeichnisse und Dateien.

Beim Kopieren eines Verzeichnisses in ein anderes Verzeichnis werden Globs nicht unterstützt und das Verhalten ähnelt `cp dir1/ dir2/`.


### `fs.existsSync(path)` {#fsexistssyncpath}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v7.6.0 | Der Parameter `path` kann ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v0.1.21 | Hinzugefügt in: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn der Pfad existiert, andernfalls `false`.

Für detaillierte Informationen siehe die Dokumentation der asynchronen Version dieser API: [`fs.exists()`](/de/nodejs/api/fs#fsexistspath-callback).

`fs.exists()` ist veraltet, aber `fs.existsSync()` ist es nicht. Der `callback`-Parameter für `fs.exists()` akzeptiert Parameter, die nicht mit anderen Node.js-Callbacks übereinstimmen. `fs.existsSync()` verwendet keinen Callback.

```js [ESM]
import { existsSync } from 'node:fs';

if (existsSync('/etc/passwd'))
  console.log('Der Pfad existiert.');
```
### `fs.fchmodSync(fd, mode)` {#fsfchmodsyncfd-mode}

**Hinzugefügt in: v0.4.7**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Setzt die Berechtigungen für die Datei. Gibt `undefined` zurück.

Weitere Details finden Sie in der POSIX [`fchmod(2)`](http://man7.org/linux/man-pages/man2/fchmod.2)-Dokumentation.

### `fs.fchownSync(fd, uid, gid)` {#fsfchownsyncfd-uid-gid}

**Hinzugefügt in: v0.4.7**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die User-ID des neuen Besitzers der Datei.
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Gruppen-ID der neuen Gruppe der Datei.

Setzt den Besitzer der Datei. Gibt `undefined` zurück.

Weitere Details finden Sie in der POSIX [`fchown(2)`](http://man7.org/linux/man-pages/man2/fchown.2)-Dokumentation.


### `fs.fdatasyncSync(fd)` {#fsfdatasyncsyncfd}

**Hinzugefügt in: v0.1.96**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Erzwingt, dass alle aktuell in die Warteschlange eingereihten I/O-Operationen, die mit der Datei verbunden sind, in den synchronisierten I/O-Abschlusszustand des Betriebssystems überführt werden. Weitere Informationen finden Sie in der POSIX-Dokumentation [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2). Gibt `undefined` zurück.

### `fs.fstatSync(fd[, options])` {#fsfstatsyncfd-options}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v10.5.0 | Akzeptiert ein zusätzliches `options`-Objekt, um anzugeben, ob die zurückgegebenen numerischen Werte BigInt sein sollen. |
| v0.1.95 | Hinzugefügt in: v0.1.95 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ob die numerischen Werte im zurückgegebenen [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)-Objekt `bigint` sein sollen. **Standard:** `false`.
  
 
- Rückgabe: [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)

Ruft die [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats) für den Dateideskriptor ab.

Weitere Details finden Sie in der POSIX-Dokumentation [`fstat(2)`](http://man7.org/linux/man-pages/man2/fstat.2).

### `fs.fsyncSync(fd)` {#fsfsyncsyncfd}

**Hinzugefügt in: v0.1.96**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Fordert an, dass alle Daten für den geöffneten Dateideskriptor auf das Speichergerät geschrieben werden. Die spezifische Implementierung ist betriebssystem- und gerätespezifisch. Weitere Details finden Sie in der POSIX-Dokumentation [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2). Gibt `undefined` zurück.

### `fs.ftruncateSync(fd[, len])` {#fsftruncatesyncfd-len}

**Hinzugefügt in: v0.8.6**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `0`

Kürzt den Dateideskriptor. Gibt `undefined` zurück.

Detaillierte Informationen finden Sie in der Dokumentation der asynchronen Version dieser API: [`fs.ftruncate()`](/de/nodejs/api/fs#fsftruncatefd-len-callback).


### `fs.futimesSync(fd, atime, mtime)` {#fsfutimessyncfd-atime-mtime}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v4.1.0 | Numerische Zeichenketten, `NaN` und `Infinity` sind jetzt als Zeitspezifizierer erlaubt. |
| v0.4.2 | Hinzugefügt in: v0.4.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Synchrone Version von [`fs.futimes()`](/de/nodejs/api/fs#fsfutimesfd-atime-mtime-callback). Gibt `undefined` zurück.

### `fs.globSync(pattern[, options])` {#fsglobsyncpattern-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.2.0 | Unterstützung für `withFileTypes` als Option hinzugefügt. |
| v22.0.0 | Hinzugefügt in: v22.0.0 |
:::

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Aktuelles Arbeitsverzeichnis. **Standard:** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Funktion zum Herausfiltern von Dateien/Verzeichnissen. Gibt `true` zurück, um das Element auszuschließen, `false`, um es einzubeziehen. **Standard:** `undefined`.
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn der Glob Pfade als Dirents zurückgeben soll, `false` andernfalls. **Standard:** `false`.


- Gibt zurück: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Pfade von Dateien, die dem Muster entsprechen.

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

**Veraltet seit: v0.4.7**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Ändert die Berechtigungen für einen symbolischen Link. Gibt `undefined` zurück.

Diese Methode ist nur unter macOS implementiert.

Weitere Informationen finden Sie in der POSIX [`lchmod(2)`](https://www.freebsd.org/cgi/man.cgi?query=lchmod&sektion=2)-Dokumentation.

### `fs.lchownSync(path, uid, gid)` {#fslchownsyncpath-uid-gid}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.6.0 | Diese API ist nicht mehr veraltet. |
| v0.4.7 | Nur Dokumentation-Veraltung. |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die User-ID des neuen Besitzers der Datei.
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Gruppen-ID der neuen Gruppe der Datei.

Setzt den Eigentümer für den Pfad. Gibt `undefined` zurück.

Weitere Informationen finden Sie in der POSIX [`lchown(2)`](http://man7.org/linux/man-pages/man2/lchown.2)-Dokumentation.

### `fs.lutimesSync(path, atime, mtime)` {#fslutimessyncpath-atime-mtime}

**Hinzugefügt in: v14.5.0, v12.19.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Ändert die Dateisystem-Zeitstempel des symbolischen Links, auf den `path` verweist. Gibt `undefined` zurück oder löst eine Ausnahme aus, wenn Parameter falsch sind oder der Vorgang fehlschlägt. Dies ist die synchrone Version von [`fs.lutimes()`](/de/nodejs/api/fs#fslutimespath-atime-mtime-callback).


### `fs.linkSync(existingPath, newPath)` {#fslinksyncexistingpath-newpath}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v7.6.0 | Die Parameter `existingPath` und `newPath` können WHATWG `URL`-Objekte mit dem `file:`-Protokoll sein. Die Unterstützung ist derzeit noch *experimentell*. |
| v0.1.31 | Hinzugefügt in: v0.1.31 |
:::

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)

Erstellt einen neuen Link von `existingPath` zu `newPath`. Siehe die POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) Dokumentation für weitere Details. Gibt `undefined` zurück.

### `fs.lstatSync(path[, options])` {#fslstatsyncpath-options}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v15.3.0, v14.17.0 | Akzeptiert eine `throwIfNoEntry`-Option, um anzugeben, ob eine Ausnahme ausgelöst werden soll, wenn der Eintrag nicht vorhanden ist. |
| v10.5.0 | Akzeptiert ein zusätzliches `options`-Objekt, um anzugeben, ob die zurückgegebenen numerischen Werte `bigint` sein sollen. |
| v7.6.0 | Der Parameter `path` kann ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v0.1.30 | Hinzugefügt in: v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ob die numerischen Werte im zurückgegebenen [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)-Objekt `bigint` sein sollen. **Standard:** `false`.
    - `throwIfNoEntry` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ob eine Ausnahme ausgelöst wird, wenn kein Dateisystemeintrag vorhanden ist, anstatt `undefined` zurückzugeben. **Standard:** `true`.

- Gibt zurück: [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)

Ruft die [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats) für den symbolischen Link ab, auf den durch `path` verwiesen wird.

Weitere Informationen finden Sie in der POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) Dokumentation.


### `fs.mkdirSync(path[, options])` {#fsmkdirsyncpath-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v13.11.0, v12.17.0 | Im `recursive`-Modus wird jetzt der zuerst erstellte Pfad zurückgegeben. |
| v10.12.0 | Das zweite Argument kann jetzt ein `options`-Objekt mit den Eigenschaften `recursive` und `mode` sein. |
| v7.6.0 | Der Parameter `path` kann ein WHATWG-`URL`-Objekt mit dem `file:`-Protokoll sein. |
| v0.1.21 | Hinzugefügt in: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wird unter Windows nicht unterstützt. **Standard:** `0o777`.


- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Erstellt synchron ein Verzeichnis. Gibt `undefined` zurück, oder wenn `recursive` `true` ist, den Pfad des ersten erstellten Verzeichnisses. Dies ist die synchrone Version von [`fs.mkdir()`](/de/nodejs/api/fs#fsmkdirpath-options-callback).

Weitere Informationen finden Sie in der POSIX-Dokumentation [`mkdir(2)`](http://man7.org/linux/man-pages/man2/mkdir.2).

### `fs.mkdtempSync(prefix[, options])` {#fsmkdtempsyncprefix-options}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.6.0, v18.19.0 | Der Parameter `prefix` akzeptiert jetzt Puffer und URLs. |
| v16.5.0, v14.18.0 | Der Parameter `prefix` akzeptiert jetzt eine leere Zeichenkette. |
| v5.10.0 | Hinzugefügt in: v5.10.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard:** `'utf8'`


- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt den erstellten Verzeichnispfad zurück.

Detaillierte Informationen finden Sie in der Dokumentation der asynchronen Version dieser API: [`fs.mkdtemp()`](/de/nodejs/api/fs#fsmkdtempprefix-options-callback).

Das optionale Argument `options` kann eine Zeichenkette sein, die eine Kodierung angibt, oder ein Objekt mit einer `encoding`-Eigenschaft, die die zu verwendende Zeichenkodierung angibt.


### `fs.opendirSync(path[, options])` {#fsopendirsyncpath-options}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v20.1.0, v18.17.0 | Option `recursive` hinzugefügt. |
| v13.1.0, v12.16.0 | Die Option `bufferSize` wurde eingeführt. |
| v12.12.0 | Hinzugefügt in: v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Verzeichniseinträge, die beim Lesen aus dem Verzeichnis intern gepuffert werden. Höhere Werte führen zu einer besseren Leistung, aber zu einer höheren Speichernutzung. **Standard:** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `false`
  
 
- Gibt zurück: [\<fs.Dir\>](/de/nodejs/api/fs#class-fsdir)

Öffnet synchron ein Verzeichnis. Siehe [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3).

Erstellt ein [\<fs.Dir\>](/de/nodejs/api/fs#class-fsdir), das alle weiteren Funktionen zum Lesen aus dem Verzeichnis und zum Bereinigen des Verzeichnisses enthält.

Die Option `encoding` legt die Kodierung für den `path` beim Öffnen des Verzeichnisses und nachfolgenden Lesevorgängen fest.

### `fs.openSync(path[, flags[, mode]])` {#fsopensyncpath-flags-mode}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v11.1.0 | Das Argument `flags` ist jetzt optional und hat standardmäßig den Wert `'r'`. |
| v9.9.0 | Die Flags `as` und `as+` werden jetzt unterstützt. |
| v7.6.0 | Der Parameter `path` kann ein WHATWG `URL`-Objekt mit `file:`-Protokoll sein. |
| v0.1.21 | Hinzugefügt in: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `'r'`. Siehe [Unterstützung von Dateisystem-`flags`](/de/nodejs/api/fs#file-system-flags).
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `0o666`
- Gibt zurück: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Gibt eine ganze Zahl zurück, die den Dateideskriptor darstellt.

Detaillierte Informationen finden Sie in der Dokumentation der asynchronen Version dieser API: [`fs.open()`](/de/nodejs/api/fs#fsopenpath-flags-mode-callback).


### `fs.readdirSync(path[, options])` {#fsreaddirsyncpath-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.1.0, v18.17.0 | Option `recursive` hinzugefügt. |
| v10.10.0 | Neue Option `withFileTypes` hinzugefügt. |
| v7.6.0 | Der `path`-Parameter kann ein WHATWG `URL`-Objekt sein, das das `file:`-Protokoll verwendet. |
| v0.1.21 | Hinzugefügt in: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, liest den Inhalt eines Verzeichnisses rekursiv. Im rekursiven Modus werden alle Dateien, Unterdateien und Verzeichnisse aufgelistet. **Standard:** `false`.


- Gibt zurück: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/de/nodejs/api/buffer#class-buffer) | [\<fs.Dirent[]\>](/de/nodejs/api/fs#class-fsdirent)

Liest den Inhalt des Verzeichnisses.

Weitere Informationen finden Sie in der POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3)-Dokumentation.

Das optionale `options`-Argument kann eine Zeichenkette sein, die eine Kodierung angibt, oder ein Objekt mit einer `encoding`-Eigenschaft, die die zu verwendende Zeichenkodierung für die zurückgegebenen Dateinamen angibt. Wenn `encoding` auf `'buffer'` gesetzt ist, werden die zurückgegebenen Dateinamen als [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)-Objekte übergeben.

Wenn `options.withFileTypes` auf `true` gesetzt ist, enthält das Ergebnis [\<fs.Dirent\>](/de/nodejs/api/fs#class-fsdirent)-Objekte.


### `fs.readFileSync(path[, options])` {#fsreadfilesyncpath-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v7.6.0 | Der Parameter `path` kann ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v5.0.0 | Der Parameter `path` kann jetzt ein Dateideskriptor sein. |
| v0.1.8 | Hinzugefügt in: v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dateiname oder Dateideskriptor
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Siehe [Unterstützung von Datei-System `flags`](/de/nodejs/api/fs#file-system-flags). **Standard:** `'r'`.


- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Gibt den Inhalt von `path` zurück.

Für detaillierte Informationen siehe die Dokumentation der asynchronen Version dieser API: [`fs.readFile()`](/de/nodejs/api/fs#fsreadfilepath-options-callback).

Wenn die Option `encoding` angegeben ist, gibt diese Funktion einen String zurück. Andernfalls wird ein Puffer zurückgegeben.

Ähnlich wie bei [`fs.readFile()`](/de/nodejs/api/fs#fsreadfilepath-options-callback) ist das Verhalten von `fs.readFileSync()`, wenn der Pfad ein Verzeichnis ist, plattformspezifisch.

```js [ESM]
import { readFileSync } from 'node:fs';

// macOS, Linux und Windows
readFileSync('<directory>');
// => [Error: EISDIR: illegal operation on a directory, read <directory>]

// FreeBSD
readFileSync('<directory>'); // => <data>
```

### `fs.readlinkSync(path[, options])` {#fsreadlinksyncpath-options}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v7.6.0 | Der Parameter `path` kann ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v0.1.31 | Hinzugefügt in: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standardwert:** `'utf8'`

- Rückgabe: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Gibt den String-Wert des symbolischen Links zurück.

Weitere Details finden Sie in der POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2) Dokumentation.

Das optionale `options`-Argument kann ein String sein, der eine Kodierung angibt, oder ein Objekt mit einer `encoding`-Eigenschaft, die die zu verwendende Zeichenkodierung für den zurückgegebenen Linkpfad angibt. Wenn die `encoding` auf `'buffer'` gesetzt ist, wird der zurückgegebene Linkpfad als [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)-Objekt übergeben.

### `fs.readSync(fd, buffer, offset, length[, position])` {#fsreadsyncfd-buffer-offset-length-position}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v10.10.0 | Der Parameter `buffer` kann nun ein beliebiges `TypedArray` oder ein `DataView` sein. |
| v6.0.0 | Der Parameter `length` kann nun `0` sein. |
| v0.1.21 | Hinzugefügt in: v0.1.21 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standardwert:** `null`
- Rückgabe: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Gibt die Anzahl der `bytesRead` zurück.

Detaillierte Informationen finden Sie in der Dokumentation der asynchronen Version dieser API: [`fs.read()`](/de/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback).


### `fs.readSync(fd, buffer[, options])` {#fsreadsyncfd-buffer-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v13.13.0, v12.17.0 | Das Options-Objekt kann übergeben werden, um Offset, Länge und Position optional zu machen. |
| v13.13.0, v12.17.0 | Hinzugefügt in: v13.13.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `null`


- Rückgabe: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Gibt die Anzahl der `bytesRead` zurück.

Ähnlich wie die obige `fs.readSync`-Funktion nimmt diese Version ein optionales `options`-Objekt entgegen. Wenn kein `options`-Objekt angegeben ist, werden die obigen Standardwerte verwendet.

Für detaillierte Informationen siehe die Dokumentation der asynchronen Version dieser API: [`fs.read()`](/de/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback).

### `fs.readvSync(fd, buffers[, position])` {#fsreadvsyncfd-buffers-position}

**Hinzugefügt in: v13.13.0, v12.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `null`
- Rückgabe: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der gelesenen Bytes.

Für detaillierte Informationen siehe die Dokumentation der asynchronen Version dieser API: [`fs.readv()`](/de/nodejs/api/fs#fsreadvfd-buffers-position-callback).


### `fs.realpathSync(path[, options])` {#fsrealpathsyncpath-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v8.0.0 | Pipe/Socket-Auflösungsunterstützung wurde hinzugefügt. |
| v7.6.0 | Der `path`-Parameter kann ein WHATWG `URL`-Objekt sein, das das `file:`-Protokoll verwendet. |
| v6.4.0 | Der Aufruf von `realpathSync` funktioniert nun wieder für verschiedene Sonderfälle unter Windows. |
| v6.0.0 | Der `cache`-Parameter wurde entfernt. |
| v0.1.31 | Hinzugefügt in: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard:** `'utf8'`


- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Gibt den aufgelösten Pfadnamen zurück.

Für detaillierte Informationen siehe die Dokumentation der asynchronen Version dieser API: [`fs.realpath()`](/de/nodejs/api/fs#fsrealpathpath-options-callback).

### `fs.realpathSync.native(path[, options])` {#fsrealpathsyncnativepath-options}

**Hinzugefügt in: v9.2.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard:** `'utf8'`


- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Synchrone [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3).

Es werden nur Pfade unterstützt, die in UTF8-Strings konvertiert werden können.

Das optionale `options`-Argument kann ein String sein, der eine Kodierung angibt, oder ein Objekt mit einer `encoding`-Eigenschaft, die die Zeichenkodierung angibt, die für den zurückgegebenen Pfad verwendet werden soll. Wenn `encoding` auf `'buffer'` gesetzt ist, wird der zurückgegebene Pfad als [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)-Objekt übergeben.

Unter Linux muss das procfs-Dateisystem auf `/proc` gemountet sein, damit diese Funktion funktioniert, wenn Node.js mit musl libc verknüpft ist. Glibc hat diese Einschränkung nicht.


### `fs.renameSync(oldPath, newPath)` {#fsrenamesyncoldpath-newpath}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v7.6.0 | Die Parameter `oldPath` und `newPath` können WHATWG `URL`-Objekte mit dem `file:`-Protokoll sein. Die Unterstützung ist derzeit noch *experimentell*. |
| v0.1.21 | Hinzugefügt in: v0.1.21 |
:::

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)

Benennt die Datei von `oldPath` in `newPath` um. Gibt `undefined` zurück.

Weitere Einzelheiten finden Sie in der POSIX-Dokumentation [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2).

### `fs.rmdirSync(path[, options])` {#fsrmdirsyncpath-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.0.0 | Die Verwendung von `fs.rmdirSync(path, { recursive: true })` auf einem `path`, der eine Datei ist, ist nicht mehr zulässig und führt unter Windows zu einem `ENOENT`-Fehler und unter POSIX zu einem `ENOTDIR`-Fehler. |
| v16.0.0 | Die Verwendung von `fs.rmdirSync(path, { recursive: true })` auf einem `path`, der nicht existiert, ist nicht mehr zulässig und führt zu einem `ENOENT`-Fehler. |
| v16.0.0 | Die Option `recursive` ist veraltet, ihre Verwendung löst eine Veraltungswarnung aus. |
| v14.14.0 | Die Option `recursive` ist veraltet, verwenden Sie stattdessen `fs.rmSync`. |
| v13.3.0, v12.16.0 | Die Option `maxBusyTries` wurde in `maxRetries` umbenannt, und ihr Standardwert ist 0. Die Option `emfileWait` wurde entfernt, und `EMFILE`-Fehler verwenden die gleiche Wiederholungslogik wie andere Fehler. Die Option `retryDelay` wird jetzt unterstützt. `ENFILE`-Fehler werden jetzt wiederholt. |
| v12.10.0 | Die Optionen `recursive`, `maxBusyTries` und `emfileWait` werden jetzt unterstützt. |
| v7.6.0 | Die `path`-Parameter können ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v0.1.21 | Hinzugefügt in: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wenn ein `EBUSY`-, `EMFILE`-, `ENFILE`-, `ENOTEMPTY`- oder `EPERM`-Fehler auftritt, wiederholt Node.js den Vorgang mit einem linearen Backoff-Warten von `retryDelay` Millisekunden länger bei jedem Versuch. Diese Option stellt die Anzahl der Wiederholungen dar. Diese Option wird ignoriert, wenn die Option `recursive` nicht `true` ist. **Standard:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, führen Sie eine rekursive Verzeichnisentfernung durch. Im rekursiven Modus werden Operationen bei einem Fehler wiederholt. **Standard:** `false`. **Veraltet.**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Zeitspanne in Millisekunden, die zwischen den Wiederholungen gewartet werden soll. Diese Option wird ignoriert, wenn die Option `recursive` nicht `true` ist. **Standard:** `100`.
  
 

Synchrone [`rmdir(2)`](http://man7.org/linux/man-pages/man2/rmdir.2). Gibt `undefined` zurück.

Die Verwendung von `fs.rmdirSync()` für eine Datei (nicht für ein Verzeichnis) führt unter Windows zu einem `ENOENT`-Fehler und unter POSIX zu einem `ENOTDIR`-Fehler.

Um ein Verhalten ähnlich dem Unix-Befehl `rm -rf` zu erzielen, verwenden Sie [`fs.rmSync()`](/de/nodejs/api/fs#fsrmsyncpath-options) mit den Optionen `{ recursive: true, force: true }`.


### `fs.rmSync(path[, options])` {#fsrmsyncpath-options}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v17.3.0, v16.14.0 | Der Parameter `path` kann ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v14.14.0 | Hinzugefügt in: v14.14.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, werden Ausnahmen ignoriert, falls `path` nicht existiert. **Standard:** `false`.
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Wenn ein Fehler `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` oder `EPERM` auftritt, wiederholt Node.js den Vorgang mit einer linearen Backoff-Wartezeit, die bei jedem Versuch um `retryDelay` Millisekunden verlängert wird. Diese Option stellt die Anzahl der Wiederholungsversuche dar. Diese Option wird ignoriert, wenn die Option `recursive` nicht `true` ist. **Standard:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird eine rekursive Verzeichnisentfernung durchgeführt. Im rekursiven Modus werden Operationen bei einem Fehler wiederholt. **Standard:** `false`.
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Zeit in Millisekunden, die zwischen den Wiederholungsversuchen gewartet werden soll. Diese Option wird ignoriert, wenn die Option `recursive` nicht `true` ist. **Standard:** `100`.

Entfernt synchron Dateien und Verzeichnisse (modelliert nach dem Standard-POSIX-Dienstprogramm `rm`). Gibt `undefined` zurück.

### `fs.statSync(path[, options])` {#fsstatsyncpath-options}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v15.3.0, v14.17.0 | Akzeptiert die Option `throwIfNoEntry`, um anzugeben, ob eine Ausnahme ausgelöst werden soll, wenn der Eintrag nicht existiert. |
| v10.5.0 | Akzeptiert ein zusätzliches `options`-Objekt, um anzugeben, ob die zurückgegebenen numerischen Werte bigint sein sollen. |
| v7.6.0 | Der Parameter `path` kann ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v0.1.21 | Hinzugefügt in: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ob die numerischen Werte im zurückgegebenen [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)-Objekt `bigint` sein sollen. **Standard:** `false`.
    - `throwIfNoEntry` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ob eine Ausnahme ausgelöst wird, wenn kein Dateisystemeintrag vorhanden ist, anstatt `undefined` zurückzugeben. **Standard:** `true`.

- Gibt zurück: [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)

Ruft die [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats) für den Pfad ab.


### `fs.statfsSync(path[, options])` {#fsstatfssyncpath-options}

**Hinzugefügt in: v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ob die numerischen Werte im zurückgegebenen [\<fs.StatFs\>](/de/nodejs/api/fs#class-fsstatfs)-Objekt `bigint` sein sollen. **Standard:** `false`.


- Gibt zurück: [\<fs.StatFs\>](/de/nodejs/api/fs#class-fsstatfs)

Synchrone [`statfs(2)`](http://man7.org/linux/man-pages/man2/statfs.2). Gibt Informationen über das gemountete Dateisystem zurück, das `path` enthält.

Im Fehlerfall ist `err.code` einer der [Common System Errors](/de/nodejs/api/errors#common-system-errors).

### `fs.symlinkSync(target, path[, type])` {#fssymlinksynctarget-path-type}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.0.0 | Wenn das Argument `type` undefiniert gelassen wird, erkennt Node den `target`-Typ automatisch und wählt automatisch `dir` oder `file` aus. |
| v7.6.0 | Die Parameter `target` und `path` können WHATWG `URL`-Objekte sein, die das `file:`-Protokoll verwenden. Die Unterstützung ist derzeit noch *experimentell*. |
| v0.1.31 | Hinzugefügt in: v0.1.31 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `null`

Gibt `undefined` zurück.

Für detaillierte Informationen siehe die Dokumentation der asynchronen Version dieser API: [`fs.symlink()`](/de/nodejs/api/fs#fssymlinktarget-path-type-callback).


### `fs.truncateSync(path[, len])` {#fstruncatesyncpath-len}

**Hinzugefügt in: v0.8.6**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standardwert:** `0`

Kürzt die Datei. Gibt `undefined` zurück. Ein Dateideskriptor kann auch als erstes Argument übergeben werden. In diesem Fall wird `fs.ftruncateSync()` aufgerufen.

Das Übergeben eines Dateideskriptors ist veraltet und kann in Zukunft zu einem Fehler führen.

### `fs.unlinkSync(path)` {#fsunlinksyncpath}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v7.6.0 | Der Parameter `path` kann ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v0.1.21 | Hinzugefügt in: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)

Synchrones [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2). Gibt `undefined` zurück.

### `fs.utimesSync(path, atime, mtime)` {#fsutimessyncpath-atime-mtime}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v8.0.0 | `NaN`, `Infinity` und `-Infinity` sind keine gültigen Zeitspezifizierer mehr. |
| v7.6.0 | Der Parameter `path` kann ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v4.1.0 | Numerische Zeichenketten, `NaN` und `Infinity` sind jetzt als Zeitspezifizierer erlaubt. |
| v0.4.2 | Hinzugefügt in: v0.4.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Gibt `undefined` zurück.

Für detaillierte Informationen siehe die Dokumentation der asynchronen Version dieser API: [`fs.utimes()`](/de/nodejs/api/fs#fsutimespath-atime-mtime-callback).


### `fs.writeFileSync(file, data[, options])` {#fswritefilesyncfile-data-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.0.0, v20.10.0 | Die Option `flush` wird jetzt unterstützt. |
| v19.0.0 | Die Übergabe eines Objekts mit einer eigenen `toString`-Funktion an den `data`-Parameter wird nicht mehr unterstützt. |
| v17.8.0 | Die Übergabe eines Objekts mit einer eigenen `toString`-Funktion an den `data`-Parameter ist veraltet. |
| v14.12.0 | Der `data`-Parameter wandelt ein Objekt mit einer expliziten `toString`-Funktion in einen String um. |
| v14.0.0 | Der `data`-Parameter wandelt nicht mehr unterstützte Eingaben nicht mehr in Strings um. |
| v10.10.0 | Der `data`-Parameter kann jetzt ein beliebiges `TypedArray` oder ein `DataView` sein. |
| v7.4.0 | Der `data`-Parameter kann jetzt ein `Uint8Array` sein. |
| v5.0.0 | Der `file`-Parameter kann jetzt ein Dateideskriptor sein. |
| v0.1.29 | Hinzugefügt in: v0.1.29 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dateiname oder Dateideskriptor
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Siehe [Unterstützung von Datei-System `flags`](/de/nodejs/api/fs#file-system-flags). **Standard:** `'w'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn alle Daten erfolgreich in die Datei geschrieben wurden und `flush` `true` ist, wird `fs.fsyncSync()` verwendet, um die Daten zu leeren.

Gibt `undefined` zurück.

Die Option `mode` betrifft nur die neu erstellte Datei. Siehe [`fs.open()`](/de/nodejs/api/fs#fsopenpath-flags-mode-callback) für weitere Details.

Detaillierte Informationen finden Sie in der Dokumentation der asynchronen Version dieser API: [`fs.writeFile()`](/de/nodejs/api/fs#fswritefilefile-data-options-callback).


### `fs.writeSync(fd, buffer, offset[, length[, position]])` {#fswritesyncfd-buffer-offset-length-position}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.0.0 | Der Parameter `buffer` erzwingt nicht mehr die Umwandlung von nicht unterstützten Eingaben in Strings. |
| v10.10.0 | Der Parameter `buffer` kann jetzt ein beliebiger `TypedArray` oder eine `DataView` sein. |
| v7.4.0 | Der Parameter `buffer` kann jetzt ein `Uint8Array` sein. |
| v7.2.0 | Die Parameter `offset` und `length` sind jetzt optional. |
| v0.1.21 | Hinzugefügt in: v0.1.21 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standard:** `null`
- Rückgabe: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der geschriebenen Bytes.

Für detaillierte Informationen siehe die Dokumentation der asynchronen Version dieser API: [`fs.write(fd, buffer...)`](/de/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback).

### `fs.writeSync(fd, buffer[, options])` {#fswritesyncfd-buffer-options}

**Hinzugefügt in: v18.3.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `null`


- Rückgabe: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der geschriebenen Bytes.

Für detaillierte Informationen siehe die Dokumentation der asynchronen Version dieser API: [`fs.write(fd, buffer...)`](/de/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback).


### `fs.writeSync(fd, string[, position[, encoding]])` {#fswritesyncfd-string-position-encoding}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.0.0 | Der Parameter `string` erzwingt keine nicht unterstützten Eingaben mehr in Strings. |
| v7.2.0 | Der Parameter `position` ist jetzt optional. |
| v0.11.5 | Hinzugefügt in: v0.11.5 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standardwert:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standardwert:** `'utf8'`
- Rückgabe: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der geschriebenen Bytes.

Für detaillierte Informationen siehe die Dokumentation der asynchronen Version dieser API: [`fs.write(fd, string...)`](/de/nodejs/api/fs#fswritefd-string-position-encoding-callback).

### `fs.writevSync(fd, buffers[, position])` {#fswritevsyncfd-buffers-position}

**Hinzugefügt in: v12.9.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Standardwert:** `null`
- Rückgabe: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der geschriebenen Bytes.

Für detaillierte Informationen siehe die Dokumentation der asynchronen Version dieser API: [`fs.writev()`](/de/nodejs/api/fs#fswritevfd-buffers-position-callback).

## Gemeinsame Objekte {#common-objects}

Die gemeinsamen Objekte werden von allen Varianten der Dateisystem-API gemeinsam genutzt (Promise, Callback und synchron).


### Klasse: `fs.Dir` {#class-fsdir}

**Hinzugefügt in: v12.12.0**

Eine Klasse, die einen Verzeichnis-Stream repräsentiert.

Erstellt von [`fs.opendir()`](/de/nodejs/api/fs#fsopendirpath-options-callback), [`fs.opendirSync()`](/de/nodejs/api/fs#fsopendirsyncpath-options) oder [`fsPromises.opendir()`](/de/nodejs/api/fs#fspromisesopendirpath-options).

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
Bei Verwendung des asynchronen Iterators wird das [\<fs.Dir\>](/de/nodejs/api/fs#class-fsdir)-Objekt automatisch geschlossen, nachdem der Iterator beendet wurde.

#### `dir.close()` {#dirclose}

**Hinzugefügt in: v12.12.0**

- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Schließt asynchron den zugrunde liegenden Ressourcen-Handle des Verzeichnisses. Nachfolgende Leseoperationen führen zu Fehlern.

Es wird ein Promise zurückgegeben, das erfüllt wird, nachdem die Ressource geschlossen wurde.

#### `dir.close(callback)` {#dirclosecallback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Rückrufs an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v12.12.0 | Hinzugefügt in: v12.12.0 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Schließt asynchron den zugrunde liegenden Ressourcen-Handle des Verzeichnisses. Nachfolgende Leseoperationen führen zu Fehlern.

Der `callback` wird aufgerufen, nachdem der Ressourcen-Handle geschlossen wurde.

#### `dir.closeSync()` {#dirclosesync}

**Hinzugefügt in: v12.12.0**

Schließt synchron den zugrunde liegenden Ressourcen-Handle des Verzeichnisses. Nachfolgende Leseoperationen führen zu Fehlern.

#### `dir.path` {#dirpath}

**Hinzugefügt in: v12.12.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Der schreibgeschützte Pfad dieses Verzeichnisses, wie er an [`fs.opendir()`](/de/nodejs/api/fs#fsopendirpath-options-callback), [`fs.opendirSync()`](/de/nodejs/api/fs#fsopendirsyncpath-options) oder [`fsPromises.opendir()`](/de/nodejs/api/fs#fspromisesopendirpath-options) übergeben wurde.


#### `dir.read()` {#dirread}

**Hinzugefügt in: v12.12.0**

- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit einem [\<fs.Dirent\>](/de/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) erfüllt.

Liest asynchron den nächsten Verzeichniseintrag über [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) als [\<fs.Dirent\>](/de/nodejs/api/fs#class-fsdirent).

Es wird ein Promise zurückgegeben, das mit einem [\<fs.Dirent\>](/de/nodejs/api/fs#class-fsdirent) oder `null` erfüllt wird, falls keine weiteren Verzeichniseinträge mehr zum Lesen vorhanden sind.

Die von dieser Funktion zurückgegebenen Verzeichniseinträge sind in keiner bestimmten Reihenfolge, wie sie von den zugrunde liegenden Verzeichnismechanismen des Betriebssystems bereitgestellt werden. Einträge, die während der Iteration über das Verzeichnis hinzugefügt oder entfernt werden, sind möglicherweise nicht in den Iterationsergebnissen enthalten.

#### `dir.read(callback)` {#dirreadcallback}

**Hinzugefügt in: v12.12.0**

- `callback` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Fehler\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `dirent` [\<fs.Dirent\>](/de/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Liest asynchron den nächsten Verzeichniseintrag über [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) als [\<fs.Dirent\>](/de/nodejs/api/fs#class-fsdirent).

Nach Abschluss des Lesevorgangs wird der `callback` mit einem [\<fs.Dirent\>](/de/nodejs/api/fs#class-fsdirent) oder `null` aufgerufen, falls keine weiteren Verzeichniseinträge mehr zum Lesen vorhanden sind.

Die von dieser Funktion zurückgegebenen Verzeichniseinträge sind in keiner bestimmten Reihenfolge, wie sie von den zugrunde liegenden Verzeichnismechanismen des Betriebssystems bereitgestellt werden. Einträge, die während der Iteration über das Verzeichnis hinzugefügt oder entfernt werden, sind möglicherweise nicht in den Iterationsergebnissen enthalten.

#### `dir.readSync()` {#dirreadsync}

**Hinzugefügt in: v12.12.0**

- Gibt zurück: [\<fs.Dirent\>](/de/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Liest synchron den nächsten Verzeichniseintrag als [\<fs.Dirent\>](/de/nodejs/api/fs#class-fsdirent). Weitere Informationen finden Sie in der POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3)-Dokumentation.

Wenn keine weiteren Verzeichniseinträge mehr zum Lesen vorhanden sind, wird `null` zurückgegeben.

Die von dieser Funktion zurückgegebenen Verzeichniseinträge sind in keiner bestimmten Reihenfolge, wie sie von den zugrunde liegenden Verzeichnismechanismen des Betriebssystems bereitgestellt werden. Einträge, die während der Iteration über das Verzeichnis hinzugefügt oder entfernt werden, sind möglicherweise nicht in den Iterationsergebnissen enthalten.


#### `dir[Symbol.asyncIterator]()` {#dirsymbolasynciterator}

**Hinzugefügt in: v12.12.0**

- Gibt zurück: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) Ein AsyncIterator von [\<fs.Dirent\>](/de/nodejs/api/fs#class-fsdirent)

Iteriert asynchron über das Verzeichnis, bis alle Einträge gelesen wurden. Weitere Informationen finden Sie in der POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3)-Dokumentation.

Von dem asynchronen Iterator zurückgegebene Einträge sind immer ein [\<fs.Dirent\>](/de/nodejs/api/fs#class-fsdirent). Der `null`-Fall von `dir.read()` wird intern behandelt.

Ein Beispiel finden Sie unter [\<fs.Dir\>](/de/nodejs/api/fs#class-fsdir).

Die von diesem Iterator zurückgegebenen Verzeichniseinträge sind in keiner bestimmten Reihenfolge, da sie von den zugrunde liegenden Verzeichnismechanismen des Betriebssystems bereitgestellt werden. Einträge, die während der Iteration über das Verzeichnis hinzugefügt oder entfernt werden, sind möglicherweise nicht in den Iterationsergebnissen enthalten.

### Klasse: `fs.Dirent` {#class-fsdirent}

**Hinzugefügt in: v10.10.0**

Eine Darstellung eines Verzeichniseintrags, der eine Datei oder ein Unterverzeichnis innerhalb des Verzeichnisses sein kann, wie er beim Lesen aus einem [\<fs.Dir\>](/de/nodejs/api/fs#class-fsdir) zurückgegeben wird. Der Verzeichniseintrag ist eine Kombination aus den Dateinamen- und Dateityp-Paaren.

Wenn [`fs.readdir()`](/de/nodejs/api/fs#fsreaddirpath-options-callback) oder [`fs.readdirSync()`](/de/nodejs/api/fs#fsreaddirsyncpath-options) mit der Option `withFileTypes` auf `true` aufgerufen wird, wird das resultierende Array mit [\<fs.Dirent\>](/de/nodejs/api/fs#class-fsdirent)-Objekten anstelle von Strings oder [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)s gefüllt.

#### `dirent.isBlockDevice()` {#direntisblockdevice}

**Hinzugefügt in: v10.10.0**

- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn das [\<fs.Dirent\>](/de/nodejs/api/fs#class-fsdirent)-Objekt ein Blockgerät beschreibt.

#### `dirent.isCharacterDevice()` {#direntischaracterdevice}

**Hinzugefügt in: v10.10.0**

- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn das [\<fs.Dirent\>](/de/nodejs/api/fs#class-fsdirent)-Objekt ein Zeichengerät beschreibt.


#### `dirent.isDirectory()` {#direntisdirectory}

**Hinzugefügt in: v10.10.0**

- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn das [\<fs.Dirent\>](/de/nodejs/api/fs#class-fsdirent)-Objekt ein Dateisystemverzeichnis beschreibt.

#### `dirent.isFIFO()` {#direntisfifo}

**Hinzugefügt in: v10.10.0**

- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn das [\<fs.Dirent\>](/de/nodejs/api/fs#class-fsdirent)-Objekt eine First-In-First-Out-Pipe (FIFO) beschreibt.

#### `dirent.isFile()` {#direntisfile}

**Hinzugefügt in: v10.10.0**

- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn das [\<fs.Dirent\>](/de/nodejs/api/fs#class-fsdirent)-Objekt eine reguläre Datei beschreibt.

#### `dirent.isSocket()` {#direntissocket}

**Hinzugefügt in: v10.10.0**

- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn das [\<fs.Dirent\>](/de/nodejs/api/fs#class-fsdirent)-Objekt einen Socket beschreibt.

#### `dirent.isSymbolicLink()` {#direntissymboliclink}

**Hinzugefügt in: v10.10.0**

- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn das [\<fs.Dirent\>](/de/nodejs/api/fs#class-fsdirent)-Objekt einen symbolischen Link beschreibt.

#### `dirent.name` {#direntname}

**Hinzugefügt in: v10.10.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Der Dateiname, auf den sich dieses [\<fs.Dirent\>](/de/nodejs/api/fs#class-fsdirent)-Objekt bezieht. Der Typ dieses Werts wird durch die an [`fs.readdir()`](/de/nodejs/api/fs#fsreaddirpath-options-callback) oder [`fs.readdirSync()`](/de/nodejs/api/fs#fsreaddirsyncpath-options) übergebene `options.encoding` bestimmt.

#### `dirent.parentPath` {#direntparentpath}

**Hinzugefügt in: v21.4.0, v20.12.0, v18.20.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Der Pfad zum übergeordneten Verzeichnis der Datei, auf die sich dieses [\<fs.Dirent\>](/de/nodejs/api/fs#class-fsdirent)-Objekt bezieht.


#### `dirent.path` {#direntpath}

::: info [History]
| Version | Changes |
| --- | --- |
| v23.2.0 | Die Eigenschaft ist nicht mehr schreibgeschützt. |
| v23.0.0 | Der Zugriff auf diese Eigenschaft gibt eine Warnung aus. Sie ist jetzt schreibgeschützt. |
| v21.5.0, v20.12.0, v18.20.0 | Veraltet seit: v21.5.0, v20.12.0, v18.20.0 |
| v20.1.0, v18.17.0 | Hinzugefügt in: v20.1.0, v18.17.0 |
:::

::: danger [Stable: 0 - Veraltet]
[Stable: 0](/de/nodejs/api/documentation#stability-index) [Stability: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen [`dirent.parentPath`](/de/nodejs/api/fs#direntparentpath).
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Alias für `dirent.parentPath`.

### Klasse: `fs.FSWatcher` {#class-fsfswatcher}

**Hinzugefügt in: v0.5.8**

- Erweitert [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)

Ein erfolgreicher Aufruf der Methode [`fs.watch()`](/de/nodejs/api/fs#fswatchfilename-options-listener) gibt ein neues [\<fs.FSWatcher\>](/de/nodejs/api/fs#class-fsfswatcher)-Objekt zurück.

Alle [\<fs.FSWatcher\>](/de/nodejs/api/fs#class-fsfswatcher)-Objekte geben ein `'change'`-Ereignis aus, wenn eine bestimmte überwachte Datei geändert wird.

#### Ereignis: `'change'` {#event-change}

**Hinzugefügt in: v0.5.8**

- `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Art des Änderungsereignisses, das aufgetreten ist.
- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Der Dateiname, der sich geändert hat (falls relevant/verfügbar).

Wird ausgegeben, wenn sich etwas in einem überwachten Verzeichnis oder einer Datei ändert. Weitere Informationen finden Sie unter [`fs.watch()`](/de/nodejs/api/fs#fswatchfilename-options-listener).

Das `filename`-Argument wird möglicherweise nicht bereitgestellt, abhängig von der Unterstützung des Betriebssystems. Wenn `filename` bereitgestellt wird, wird es als [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) bereitgestellt, wenn `fs.watch()` mit der Option `encoding` auf `'buffer'` gesetzt aufgerufen wird, andernfalls ist `filename` eine UTF-8-Zeichenkette.

```js [ESM]
import { watch } from 'node:fs';
// Beispiel für die Behandlung durch den fs.watch()-Listener
watch('./tmp', { encoding: 'buffer' }, (eventType, filename) => {
  if (filename) {
    console.log(filename);
    // Gibt aus: <Buffer ...>
  }
});
```

#### Event: `'close'` {#event-close_1}

**Hinzugefügt in: v10.0.0**

Wird ausgelöst, wenn der Watcher die Überwachung von Änderungen beendet. Das geschlossene [\<fs.FSWatcher\>](/de/nodejs/api/fs#class-fsfswatcher)-Objekt ist im Ereignishandler nicht mehr verwendbar.

#### Event: `'error'` {#event-error}

**Hinzugefügt in: v0.5.8**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Wird ausgelöst, wenn beim Überwachen der Datei ein Fehler auftritt. Das fehlerhafte [\<fs.FSWatcher\>](/de/nodejs/api/fs#class-fsfswatcher)-Objekt ist im Ereignishandler nicht mehr verwendbar.

#### `watcher.close()` {#watcherclose}

**Hinzugefügt in: v0.5.8**

Beendet die Überwachung von Änderungen am gegebenen [\<fs.FSWatcher\>](/de/nodejs/api/fs#class-fsfswatcher). Nach dem Stoppen ist das [\<fs.FSWatcher\>](/de/nodejs/api/fs#class-fsfswatcher)-Objekt nicht mehr verwendbar.

#### `watcher.ref()` {#watcherref}

**Hinzugefügt in: v14.3.0, v12.20.0**

- Gibt zurück: [\<fs.FSWatcher\>](/de/nodejs/api/fs#class-fsfswatcher)

Fordert bei Aufruf an, dass die Node.js-Ereignisschleife *nicht* beendet wird, solange der [\<fs.FSWatcher\>](/de/nodejs/api/fs#class-fsfswatcher) aktiv ist. Das mehrmalige Aufrufen von `watcher.ref()` hat keine Auswirkung.

Standardmäßig sind alle [\<fs.FSWatcher\>](/de/nodejs/api/fs#class-fsfswatcher)-Objekte "ref'ed", wodurch es normalerweise unnötig ist, `watcher.ref()` aufzurufen, es sei denn, `watcher.unref()` wurde zuvor aufgerufen.

#### `watcher.unref()` {#watcherunref}

**Hinzugefügt in: v14.3.0, v12.20.0**

- Gibt zurück: [\<fs.FSWatcher\>](/de/nodejs/api/fs#class-fsfswatcher)

Bei Aufruf erfordert das aktive [\<fs.FSWatcher\>](/de/nodejs/api/fs#class-fsfswatcher)-Objekt nicht, dass die Node.js-Ereignisschleife aktiv bleibt. Wenn keine andere Aktivität die Ereignisschleife am Laufen hält, kann der Prozess beendet werden, bevor der Callback des [\<fs.FSWatcher\>](/de/nodejs/api/fs#class-fsfswatcher)-Objekts aufgerufen wird. Das mehrmalige Aufrufen von `watcher.unref()` hat keine Auswirkung.

### Klasse: `fs.StatWatcher` {#class-fsstatwatcher}

**Hinzugefügt in: v14.3.0, v12.20.0**

- Erweitert [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)

Ein erfolgreicher Aufruf der `fs.watchFile()`-Methode gibt ein neues [\<fs.StatWatcher\>](/de/nodejs/api/fs#class-fsstatwatcher)-Objekt zurück.

#### `watcher.ref()` {#watcherref_1}

**Hinzugefügt in: v14.3.0, v12.20.0**

- Gibt zurück: [\<fs.StatWatcher\>](/de/nodejs/api/fs#class-fsstatwatcher)

Fordert bei Aufruf an, dass die Node.js-Ereignisschleife *nicht* beendet wird, solange der [\<fs.StatWatcher\>](/de/nodejs/api/fs#class-fsstatwatcher) aktiv ist. Das mehrmalige Aufrufen von `watcher.ref()` hat keine Auswirkung.

Standardmäßig sind alle [\<fs.StatWatcher\>](/de/nodejs/api/fs#class-fsstatwatcher)-Objekte "ref'ed", wodurch es normalerweise unnötig ist, `watcher.ref()` aufzurufen, es sei denn, `watcher.unref()` wurde zuvor aufgerufen.


#### `watcher.unref()` {#watcherunref_1}

**Hinzugefügt in: v14.3.0, v12.20.0**

- Gibt zurück: [\<fs.StatWatcher\>](/de/nodejs/api/fs#class-fsstatwatcher)

Wenn aufgerufen, benötigt das aktive [\<fs.StatWatcher\>](/de/nodejs/api/fs#class-fsstatwatcher)-Objekt nicht, dass die Node.js-Ereignisschleife aktiv bleibt. Wenn keine andere Aktivität die Ereignisschleife am Laufen hält, kann der Prozess beendet werden, bevor der Rückruf des [\<fs.StatWatcher\>](/de/nodejs/api/fs#class-fsstatwatcher)-Objekts aufgerufen wird. Das mehrmalige Aufrufen von `watcher.unref()` hat keine Auswirkung.

### Klasse: `fs.ReadStream` {#class-fsreadstream}

**Hinzugefügt in: v0.1.93**

- Erweitert: [\<stream.Readable\>](/de/nodejs/api/stream#class-streamreadable)

Instanzen von [\<fs.ReadStream\>](/de/nodejs/api/fs#class-fsreadstream) werden mit der Funktion [`fs.createReadStream()`](/de/nodejs/api/fs#fscreatereadstreampath-options) erstellt und zurückgegeben.

#### Ereignis: `'close'` {#event-close_2}

**Hinzugefügt in: v0.1.93**

Wird ausgelöst, wenn der zugrunde liegende Dateideskriptor des [\<fs.ReadStream\>](/de/nodejs/api/fs#class-fsreadstream) geschlossen wurde.

#### Ereignis: `'open'` {#event-open}

**Hinzugefügt in: v0.1.93**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Integer-Dateideskriptor, der vom [\<fs.ReadStream\>](/de/nodejs/api/fs#class-fsreadstream) verwendet wird.

Wird ausgelöst, wenn der Dateideskriptor des [\<fs.ReadStream\>](/de/nodejs/api/fs#class-fsreadstream) geöffnet wurde.

#### Ereignis: `'ready'` {#event-ready}

**Hinzugefügt in: v9.11.0**

Wird ausgelöst, wenn der [\<fs.ReadStream\>](/de/nodejs/api/fs#class-fsreadstream) bereit zur Verwendung ist.

Wird unmittelbar nach `'open'` ausgelöst.

#### `readStream.bytesRead` {#readstreambytesread}

**Hinzugefügt in: v6.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Anzahl der Bytes, die bisher gelesen wurden.

#### `readStream.path` {#readstreampath}

**Hinzugefügt in: v0.1.93**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Der Pfad zu der Datei, aus der der Stream liest, wie im ersten Argument von `fs.createReadStream()` angegeben. Wenn `path` als Zeichenfolge übergeben wird, ist `readStream.path` eine Zeichenfolge. Wenn `path` als [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) übergeben wird, ist `readStream.path` ein [\<Buffer\>](/de/nodejs/api/buffer#class-buffer). Wenn `fd` angegeben ist, ist `readStream.path` `undefined`.


#### `readStream.pending` {#readstreampending}

**Hinzugefügt in: v11.2.0, v10.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Diese Eigenschaft ist `true`, wenn die zugrunde liegende Datei noch nicht geöffnet wurde, d. h. bevor das Ereignis `'ready'` ausgelöst wird.

### Klasse: `fs.Stats` {#class-fsstats}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.0.0, v20.13.0 | Der öffentliche Konstruktor ist veraltet. |
| v8.1.0 | Zeiten als Zahlen hinzugefügt. |
| v0.1.21 | Hinzugefügt in: v0.1.21 |
:::

Ein [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)-Objekt liefert Informationen über eine Datei.

Objekte, die von [`fs.stat()`](/de/nodejs/api/fs#fsstatpath-options-callback), [`fs.lstat()`](/de/nodejs/api/fs#fslstatpath-options-callback), [`fs.fstat()`](/de/nodejs/api/fs#fsfstatfd-options-callback) und ihren synchronen Gegenstücken zurückgegeben werden, sind von diesem Typ. Wenn `bigint` in den an diese Methoden übergebenen `options` auf true gesetzt ist, sind die numerischen Werte `bigint` anstelle von `number`, und das Objekt enthält zusätzliche Eigenschaften mit Nanosekunden-Präzision, die mit `Ns` versehen sind. `Stat`-Objekte dürfen nicht direkt mit dem Schlüsselwort `new` erstellt werden.

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
`bigint`-Version:

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

**Hinzugefügt in: v0.1.10**

- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn das [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)-Objekt ein Blockgerät beschreibt.

#### `stats.isCharacterDevice()` {#statsischaracterdevice}

**Hinzugefügt in: v0.1.10**

- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn das [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)-Objekt ein Zeichengerät beschreibt.

#### `stats.isDirectory()` {#statsisdirectory}

**Hinzugefügt in: v0.1.10**

- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn das [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)-Objekt ein Dateisystemverzeichnis beschreibt.

Wenn das [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)-Objekt durch Aufrufen von [`fs.lstat()`](/de/nodejs/api/fs#fslstatpath-options-callback) auf einem symbolischen Link erhalten wurde, der zu einem Verzeichnis aufgelöst wird, gibt diese Methode `false` zurück. Dies liegt daran, dass [`fs.lstat()`](/de/nodejs/api/fs#fslstatpath-options-callback) Informationen über den symbolischen Link selbst zurückgibt und nicht über den Pfad, zu dem er aufgelöst wird.

#### `stats.isFIFO()` {#statsisfifo}

**Hinzugefügt in: v0.1.10**

- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn das [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)-Objekt eine First-In-First-Out (FIFO)-Pipe beschreibt.

#### `stats.isFile()` {#statsisfile}

**Hinzugefügt in: v0.1.10**

- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn das [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)-Objekt eine reguläre Datei beschreibt.

#### `stats.isSocket()` {#statsissocket}

**Hinzugefügt in: v0.1.10**

- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn das [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)-Objekt einen Socket beschreibt.

#### `stats.isSymbolicLink()` {#statsissymboliclink}

**Hinzugefügt in: v0.1.10**

- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` zurück, wenn das [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)-Objekt einen symbolischen Link beschreibt.

Diese Methode ist nur gültig, wenn [`fs.lstat()`](/de/nodejs/api/fs#fslstatpath-options-callback) verwendet wird.


#### `stats.dev` {#statsdev}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Die numerische Kennung des Geräts, das die Datei enthält.

#### `stats.ino` {#statsino}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Die dateisystemspezifische "Inode"-Nummer für die Datei.

#### `stats.mode` {#statsmode}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Ein Bitfeld, das den Dateityp und -modus beschreibt.

#### `stats.nlink` {#statsnlink}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Die Anzahl der Hardlinks, die für die Datei existieren.

#### `stats.uid` {#statsuid}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Die numerische Benutzerkennung des Benutzers, dem die Datei gehört (POSIX).

#### `stats.gid` {#statsgid}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Die numerische Gruppenkennung der Gruppe, der die Datei gehört (POSIX).

#### `stats.rdev` {#statsrdev}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Eine numerische Gerätekennung, wenn die Datei ein Gerät darstellt.

#### `stats.size` {#statssize}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Die Größe der Datei in Bytes.

Wenn das zugrunde liegende Dateisystem das Abrufen der Dateigröße nicht unterstützt, ist dieser Wert `0`.


#### `stats.blksize` {#statsblksize}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Die Blockgröße des Dateisystems für I/O-Operationen.

#### `stats.blocks` {#statsblocks}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Die Anzahl der für diese Datei zugewiesenen Blöcke.

#### `stats.atimeMs` {#statsatimems}

**Hinzugefügt in: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Der Zeitstempel, der den Zeitpunkt des letzten Zugriffs auf diese Datei angibt, ausgedrückt in Millisekunden seit der POSIX-Epoche.

#### `stats.mtimeMs` {#statsmtimems}

**Hinzugefügt in: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Der Zeitstempel, der den Zeitpunkt der letzten Änderung dieser Datei angibt, ausgedrückt in Millisekunden seit der POSIX-Epoche.

#### `stats.ctimeMs` {#statsctimems}

**Hinzugefügt in: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Der Zeitstempel, der den Zeitpunkt der letzten Änderung des Dateistatus angibt, ausgedrückt in Millisekunden seit der POSIX-Epoche.

#### `stats.birthtimeMs` {#statsbirthtimems}

**Hinzugefügt in: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Der Zeitstempel, der den Erstellungszeitpunkt dieser Datei angibt, ausgedrückt in Millisekunden seit der POSIX-Epoche.

#### `stats.atimeNs` {#statsatimens}

**Hinzugefügt in: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Nur vorhanden, wenn `bigint: true` an die Methode übergeben wird, die das Objekt generiert. Der Zeitstempel, der den Zeitpunkt des letzten Zugriffs auf diese Datei angibt, ausgedrückt in Nanosekunden seit der POSIX-Epoche.


#### `stats.mtimeNs` {#statsmtimens}

**Hinzugefügt in: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Nur vorhanden, wenn `bigint: true` an die Methode übergeben wird, die das Objekt erzeugt. Der Zeitstempel, der die letzte Änderung dieser Datei angibt, ausgedrückt in Nanosekunden seit der POSIX-Epoche.

#### `stats.ctimeNs` {#statsctimens}

**Hinzugefügt in: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Nur vorhanden, wenn `bigint: true` an die Methode übergeben wird, die das Objekt erzeugt. Der Zeitstempel, der die letzte Änderung des Dateistatus angibt, ausgedrückt in Nanosekunden seit der POSIX-Epoche.

#### `stats.birthtimeNs` {#statsbirthtimens}

**Hinzugefügt in: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Nur vorhanden, wenn `bigint: true` an die Methode übergeben wird, die das Objekt erzeugt. Der Zeitstempel, der die Erstellungszeit dieser Datei angibt, ausgedrückt in Nanosekunden seit der POSIX-Epoche.

#### `stats.atime` {#statsatime}

**Hinzugefügt in: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Der Zeitstempel, der den letzten Zugriff auf diese Datei angibt.

#### `stats.mtime` {#statsmtime}

**Hinzugefügt in: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Der Zeitstempel, der die letzte Änderung dieser Datei angibt.

#### `stats.ctime` {#statsctime}

**Hinzugefügt in: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Der Zeitstempel, der die letzte Änderung des Dateistatus angibt.

#### `stats.birthtime` {#statsbirthtime}

**Hinzugefügt in: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Der Zeitstempel, der die Erstellungszeit dieser Datei angibt.

#### Stat-Zeitwerte {#stat-time-values}

Die Eigenschaften `atimeMs`, `mtimeMs`, `ctimeMs`, `birthtimeMs` sind numerische Werte, die die entsprechenden Zeiten in Millisekunden enthalten. Ihre Genauigkeit ist plattformspezifisch. Wenn `bigint: true` an die Methode übergeben wird, die das Objekt erzeugt, sind die Eigenschaften [bigints](https://tc39.github.io/proposal-bigint), andernfalls sind sie [numbers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type).

Die Eigenschaften `atimeNs`, `mtimeNs`, `ctimeNs`, `birthtimeNs` sind [bigints](https://tc39.github.io/proposal-bigint), die die entsprechenden Zeiten in Nanosekunden enthalten. Sie sind nur vorhanden, wenn `bigint: true` an die Methode übergeben wird, die das Objekt erzeugt. Ihre Genauigkeit ist plattformspezifisch.

`atime`, `mtime`, `ctime` und `birthtime` sind alternative [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)-Objektdarstellungen der verschiedenen Zeiten. Die `Date`- und Zahlenwerte sind nicht miteinander verbunden. Das Zuweisen eines neuen Zahlenwerts oder das Ändern des `Date`-Werts spiegelt sich nicht in der entsprechenden alternativen Darstellung wider.

Die Zeiten im Stat-Objekt haben die folgende Semantik:

- `atime` "Zugriffszeit" (Access Time): Zeitpunkt des letzten Zugriffs auf die Dateidaten. Geändert durch die Systemaufrufe [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2), [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2) und [`read(2)`](http://man7.org/linux/man-pages/man2/read.2).
- `mtime` "Änderungszeit" (Modified Time): Zeitpunkt der letzten Änderung der Dateidaten. Geändert durch die Systemaufrufe [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2), [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2) und [`write(2)`](http://man7.org/linux/man-pages/man2/write.2).
- `ctime` "Änderungszeit" (Change Time): Zeitpunkt der letzten Änderung des Dateistatus (Inode-Datenänderung). Geändert durch die Systemaufrufe [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2), [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2), [`link(2)`](http://man7.org/linux/man-pages/man2/link.2), [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2), [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2), [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2), [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2), [`read(2)`](http://man7.org/linux/man-pages/man2/read.2) und [`write(2)`](http://man7.org/linux/man-pages/man2/write.2).
- `birthtime` "Erstellungszeit" (Birth Time): Zeitpunkt der Dateierstellung. Wird einmalig beim Erstellen der Datei gesetzt. Auf Dateisystemen, auf denen die Erstellungszeit nicht verfügbar ist, kann dieses Feld stattdessen entweder die `ctime` oder `1970-01-01T00:00Z` (d. h. Unix-Epochen-Zeitstempel `0`) enthalten. In diesem Fall kann dieser Wert größer als `atime` oder `mtime` sein. Auf Darwin und anderen FreeBSD-Varianten wird er auch gesetzt, wenn die `atime` explizit auf einen früheren Wert als die aktuelle `birthtime` gesetzt wird, indem der Systemaufruf [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2) verwendet wird.

Vor Node.js 0.12 enthielt die `ctime` unter Windows-Systemen die `birthtime`. Seit 0.12 ist `ctime` nicht mehr die "Erstellungszeit", und unter Unix-Systemen war sie es nie.


### Klasse: `fs.StatFs` {#class-fsstatfs}

**Hinzugefügt in: v19.6.0, v18.15.0**

Bietet Informationen über ein gemountetes Dateisystem.

Objekte, die von [`fs.statfs()`](/de/nodejs/api/fs#fsstatfspath-options-callback) und seinem synchronen Gegenstück zurückgegeben werden, sind von diesem Typ. Wenn `bigint` in den `options`, die an diese Methoden übergeben werden, `true` ist, sind die numerischen Werte `bigint` anstelle von `number`.

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
`bigint`-Version:

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

**Hinzugefügt in: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Freie Blöcke, die nicht privilegierten Benutzern zur Verfügung stehen.

#### `statfs.bfree` {#statfsbfree}

**Hinzugefügt in: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Freie Blöcke im Dateisystem.

#### `statfs.blocks` {#statfsblocks}

**Hinzugefügt in: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Gesamtzahl der Datenblöcke im Dateisystem.

#### `statfs.bsize` {#statfsbsize}

**Hinzugefügt in: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Optimale Transferblockgröße.

#### `statfs.ffree` {#statfsffree}

**Hinzugefügt in: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Freie Dateiknoten im Dateisystem.


#### `statfs.files` {#statfsfiles}

**Hinzugefügt in: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Gesamtzahl der Dateiknoten im Dateisystem.

#### `statfs.type` {#statfstype}

**Hinzugefügt in: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Typ des Dateisystems.

### Klasse: `fs.WriteStream` {#class-fswritestream}

**Hinzugefügt in: v0.1.93**

- Erweitert [\<stream.Writable\>](/de/nodejs/api/stream#class-streamwritable)

Instanzen von [\<fs.WriteStream\>](/de/nodejs/api/fs#class-fswritestream) werden mit der Funktion [`fs.createWriteStream()`](/de/nodejs/api/fs#fscreatewritestreampath-options) erstellt und zurückgegeben.

#### Ereignis: `'close'` {#event-close_3}

**Hinzugefügt in: v0.1.93**

Wird ausgelöst, wenn der zugrunde liegende Dateideskriptor von [\<fs.WriteStream\>](/de/nodejs/api/fs#class-fswritestream) geschlossen wurde.

#### Ereignis: `'open'` {#event-open_1}

**Hinzugefügt in: v0.1.93**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ganzzahliger Dateideskriptor, der von [\<fs.WriteStream\>](/de/nodejs/api/fs#class-fswritestream) verwendet wird.

Wird ausgelöst, wenn die Datei von [\<fs.WriteStream\>](/de/nodejs/api/fs#class-fswritestream) geöffnet wird.

#### Ereignis: `'ready'` {#event-ready_1}

**Hinzugefügt in: v9.11.0**

Wird ausgelöst, wenn der [\<fs.WriteStream\>](/de/nodejs/api/fs#class-fswritestream) bereit zur Verwendung ist.

Wird direkt nach `'open'` ausgelöst.

#### `writeStream.bytesWritten` {#writestreambyteswritten}

**Hinzugefügt in: v0.4.7**

Die Anzahl der bisher geschriebenen Bytes. Enthält keine Daten, die noch zum Schreiben in die Warteschlange gestellt sind.

#### `writeStream.close([callback])` {#writestreamclosecallback}

**Hinzugefügt in: v0.9.4**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Schließt `writeStream`. Akzeptiert optional einen Callback, der ausgeführt wird, sobald `writeStream` geschlossen ist.


#### `writeStream.path` {#writestreampath}

**Hinzugefügt in: v0.1.93**

Der Pfad zu der Datei, in die der Stream schreibt, wie im ersten Argument von [`fs.createWriteStream()`](/de/nodejs/api/fs#fscreatewritestreampath-options) angegeben. Wenn `path` als String übergeben wird, dann ist `writeStream.path` ein String. Wenn `path` als [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) übergeben wird, dann ist `writeStream.path` ein [\<Buffer\>](/de/nodejs/api/buffer#class-buffer).

#### `writeStream.pending` {#writestreampending}

**Hinzugefügt in: v11.2.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Diese Eigenschaft ist `true`, wenn die zugrunde liegende Datei noch nicht geöffnet wurde, d.h. bevor das `'ready'`-Ereignis ausgelöst wird.

### `fs.constants` {#fsconstants}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Gibt ein Objekt zurück, das häufig verwendete Konstanten für Dateisystemoperationen enthält.

#### FS-Konstanten {#fs-constants}

Die folgenden Konstanten werden von `fs.constants` und `fsPromises.constants` exportiert.

Nicht jede Konstante ist auf jedem Betriebssystem verfügbar; dies ist besonders wichtig für Windows, wo viele der POSIX-spezifischen Definitionen nicht verfügbar sind. Für portable Anwendungen wird empfohlen, vor der Verwendung auf deren Vorhandensein zu prüfen.

Um mehr als eine Konstante zu verwenden, verwenden Sie den bitweisen OR-Operator `|`.

Beispiel:

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
##### Konstanten für Dateizugriff {#file-access-constants}

Die folgenden Konstanten sind für die Verwendung als `mode`-Parameter gedacht, der an [`fsPromises.access()`](/de/nodejs/api/fs#fspromisesaccesspath-mode), [`fs.access()`](/de/nodejs/api/fs#fsaccesspath-mode-callback) und [`fs.accessSync()`](/de/nodejs/api/fs#fsaccesssyncpath-mode) übergeben wird.

| Konstante | Beschreibung |
| --- | --- |
| `F_OK` | Flag, das angibt, dass die Datei für den aufrufenden Prozess sichtbar ist. Dies ist nützlich, um festzustellen, ob eine Datei existiert, sagt aber nichts über `rwx`-Berechtigungen aus. Standard, wenn kein Modus angegeben ist. |
| `R_OK` | Flag, das angibt, dass die Datei vom aufrufenden Prozess gelesen werden kann. |
| `W_OK` | Flag, das angibt, dass die Datei vom aufrufenden Prozess geschrieben werden kann. |
| `X_OK` | Flag, das angibt, dass die Datei vom aufrufenden Prozess ausgeführt werden kann. Dies hat keine Auswirkung unter Windows (verhält sich wie `fs.constants.F_OK`). |
Die Definitionen sind auch unter Windows verfügbar.


##### Dateikopierkonstanten {#file-copy-constants}

Die folgenden Konstanten sind für die Verwendung mit [`fs.copyFile()`](/de/nodejs/api/fs#fscopyfilesrc-dest-mode-callback) gedacht.

| Konstante | Beschreibung |
| --- | --- |
| `COPYFILE_EXCL` | Wenn vorhanden, schlägt der Kopiervorgang mit einem Fehler fehl, wenn der Zielpfad bereits existiert. |
| `COPYFILE_FICLONE` | Wenn vorhanden, versucht der Kopiervorgang, eine Copy-on-Write-Reflink zu erstellen. Wenn die zugrunde liegende Plattform Copy-on-Write nicht unterstützt, wird ein Fallback-Kopiermechanismus verwendet. |
| `COPYFILE_FICLONE_FORCE` | Wenn vorhanden, versucht der Kopiervorgang, eine Copy-on-Write-Reflink zu erstellen. Wenn die zugrunde liegende Plattform Copy-on-Write nicht unterstützt, schlägt der Vorgang mit einem Fehler fehl. |
Die Definitionen sind auch unter Windows verfügbar.

##### Dateiöffnungs-Konstanten {#file-open-constants}

Die folgenden Konstanten sind für die Verwendung mit `fs.open()` gedacht.

| Konstante | Beschreibung |
| --- | --- |
| `O_RDONLY` | Kennzeichen, das angibt, dass eine Datei für den Nur-Lese-Zugriff geöffnet werden soll. |
| `O_WRONLY` | Kennzeichen, das angibt, dass eine Datei für den Nur-Schreib-Zugriff geöffnet werden soll. |
| `O_RDWR` | Kennzeichen, das angibt, dass eine Datei für den Lese- und Schreibzugriff geöffnet werden soll. |
| `O_CREAT` | Kennzeichen, das angibt, dass die Datei erstellt werden soll, falls sie noch nicht vorhanden ist. |
| `O_EXCL` | Kennzeichen, das angibt, dass das Öffnen einer Datei fehlschlagen soll, wenn das Flag `O_CREAT` gesetzt ist und die Datei bereits existiert. |
| `O_NOCTTY` | Kennzeichen, das angibt, dass, falls path ein Terminalgerät identifiziert, das Öffnen des Pfads nicht dazu führen soll, dass dieses Terminal zum steuernden Terminal für den Prozess wird (falls der Prozess noch keins hat). |
| `O_TRUNC` | Kennzeichen, das angibt, dass, falls die Datei existiert und eine reguläre Datei ist und die Datei erfolgreich für den Schreibzugriff geöffnet wird, ihre Länge auf Null gekürzt wird. |
| `O_APPEND` | Kennzeichen, das angibt, dass Daten an das Ende der Datei angehängt werden. |
| `O_DIRECTORY` | Kennzeichen, das angibt, dass das Öffnen fehlschlagen soll, falls der Pfad kein Verzeichnis ist. |
| `O_NOATIME` | Kennzeichen, das angibt, dass Lesezugriffe auf das Dateisystem nicht länger zu einer Aktualisierung der `atime`-Informationen führen, die der Datei zugeordnet sind. Dieses Kennzeichen ist nur unter Linux-Betriebssystemen verfügbar. |
| `O_NOFOLLOW` | Kennzeichen, das angibt, dass das Öffnen fehlschlagen soll, falls der Pfad ein symbolischer Link ist. |
| `O_SYNC` | Kennzeichen, das angibt, dass die Datei für synchronisierte E/A geöffnet wird, wobei Schreiboperationen auf die Dateiintegrität warten. |
| `O_DSYNC` | Kennzeichen, das angibt, dass die Datei für synchronisierte E/A geöffnet wird, wobei Schreiboperationen auf die Datenintegrität warten. |
| `O_SYMLINK` | Kennzeichen, das angibt, den symbolischen Link selbst zu öffnen, anstatt der Ressource, auf die er verweist. |
| `O_DIRECT` | Wenn gesetzt, wird versucht, Caching-Effekte der Datei-E/A zu minimieren. |
| `O_NONBLOCK` | Kennzeichen, das angibt, die Datei nach Möglichkeit im nicht-blockierenden Modus zu öffnen. |
| `UV_FS_O_FILEMAP` | Wenn gesetzt, wird eine Memory File Mapping verwendet, um auf die Datei zuzugreifen. Dieses Kennzeichen ist nur unter Windows-Betriebssystemen verfügbar. Auf anderen Betriebssystemen wird dieses Kennzeichen ignoriert. |
Unter Windows sind nur `O_APPEND`, `O_CREAT`, `O_EXCL`, `O_RDONLY`, `O_RDWR`, `O_TRUNC`, `O_WRONLY` und `UV_FS_O_FILEMAP` verfügbar.


##### Dateitypen-Konstanten {#file-type-constants}

Die folgenden Konstanten sind zur Verwendung mit der `mode`-Eigenschaft des [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)-Objekts vorgesehen, um den Dateityp zu bestimmen.

| Konstante | Beschreibung |
| --- | --- |
| `S_IFMT` | Bitmaske, die zum Extrahieren des Dateitypcodes verwendet wird. |
| `S_IFREG` | Dateitypen-Konstante für eine reguläre Datei. |
| `S_IFDIR` | Dateitypen-Konstante für ein Verzeichnis. |
| `S_IFCHR` | Dateitypen-Konstante für eine zeichenorientierte Gerätedatei. |
| `S_IFBLK` | Dateitypen-Konstante für eine blockorientierte Gerätedatei. |
| `S_IFIFO` | Dateitypen-Konstante für eine FIFO/Pipe. |
| `S_IFLNK` | Dateitypen-Konstante für einen symbolischen Link. |
| `S_IFSOCK` | Dateitypen-Konstante für einen Socket. |
Unter Windows sind nur `S_IFCHR`, `S_IFDIR`, `S_IFLNK`, `S_IFMT` und `S_IFREG` verfügbar.

##### Dateimodus-Konstanten {#file-mode-constants}

Die folgenden Konstanten sind zur Verwendung mit der `mode`-Eigenschaft des [\<fs.Stats\>](/de/nodejs/api/fs#class-fsstats)-Objekts vorgesehen, um die Zugriffsrechte für eine Datei zu bestimmen.

| Konstante | Beschreibung |
| --- | --- |
| `S_IRWXU` | Dateimodus, der das Lesen, Schreiben und Ausführen durch den Eigentümer angibt. |
| `S_IRUSR` | Dateimodus, der das Lesen durch den Eigentümer angibt. |
| `S_IWUSR` | Dateimodus, der das Schreiben durch den Eigentümer angibt. |
| `S_IXUSR` | Dateimodus, der das Ausführen durch den Eigentümer angibt. |
| `S_IRWXG` | Dateimodus, der das Lesen, Schreiben und Ausführen durch die Gruppe angibt. |
| `S_IRGRP` | Dateimodus, der das Lesen durch die Gruppe angibt. |
| `S_IWGRP` | Dateimodus, der das Schreiben durch die Gruppe angibt. |
| `S_IXGRP` | Dateimodus, der das Ausführen durch die Gruppe angibt. |
| `S_IRWXO` | Dateimodus, der das Lesen, Schreiben und Ausführen durch andere angibt. |
| `S_IROTH` | Dateimodus, der das Lesen durch andere angibt. |
| `S_IWOTH` | Dateimodus, der das Schreiben durch andere angibt. |
| `S_IXOTH` | Dateimodus, der das Ausführen durch andere angibt. |
Unter Windows sind nur `S_IRUSR` und `S_IWUSR` verfügbar.

## Hinweise {#notes}

### Reihenfolge von Callback- und Promise-basierten Operationen {#ordering-of-callback-and-promise-based-operations}

Da sie asynchron vom zugrunde liegenden Threadpool ausgeführt werden, gibt es keine garantierte Reihenfolge, wenn entweder die Callback- oder die Promise-basierten Methoden verwendet werden.

Beispielsweise ist das Folgende fehleranfällig, da die `fs.stat()`-Operation abgeschlossen sein könnte, bevor die `fs.rename()`-Operation abgeschlossen ist:

```js [ESM]
const fs = require('node:fs');

fs.rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  console.log('renamed complete');
});
fs.stat('/tmp/world', (err, stats) => {
  if (err) throw err;
  console.log(`stats: ${JSON.stringify(stats)}`);
});
```
Es ist wichtig, die Operationen korrekt zu ordnen, indem man die Ergebnisse der einen abwartet, bevor man die andere aufruft:



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
  console.error('there was an error:', error.message);
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
    console.error('there was an error:', error.message);
  }
})('/tmp/hello', '/tmp/world');
```
:::

Oder verschieben Sie bei Verwendung der Callback-APIs den `fs.stat()`-Aufruf in den Callback der `fs.rename()`-Operation:



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


### Dateipfade {#file-paths}

Die meisten `fs`-Operationen akzeptieren Dateipfade, die in Form einer Zeichenkette, eines [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) oder eines [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)-Objekts mit dem `file:`-Protokoll angegeben werden können.

#### Zeichenkettenpfade {#string-paths}

Zeichenkettenpfade werden als UTF-8-Zeichensequenzen interpretiert, die den absoluten oder relativen Dateinamen identifizieren. Relative Pfade werden relativ zum aktuellen Arbeitsverzeichnis aufgelöst, das durch Aufruf von `process.cwd()` ermittelt wird.

Beispiel für die Verwendung eines absoluten Pfads unter POSIX:

```js [ESM]
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('/open/some/file.txt', 'r');
  // Mache etwas mit der Datei
} finally {
  await fd?.close();
}
```
Beispiel für die Verwendung eines relativen Pfads unter POSIX (relativ zu `process.cwd()`):

```js [ESM]
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('file.txt', 'r');
  // Mache etwas mit der Datei
} finally {
  await fd?.close();
}
```
#### Datei-URL-Pfade {#file-url-paths}

**Hinzugefügt in: v7.6.0**

Für die meisten Funktionen des Moduls `node:fs` kann das Argument `path` oder `filename` als [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)-Objekt unter Verwendung des `file:`-Protokolls übergeben werden.

```js [ESM]
import { readFileSync } from 'node:fs';

readFileSync(new URL('file:///tmp/hello'));
```
`file:`-URLs sind immer absolute Pfade.

##### Plattformspezifische Überlegungen {#platform-specific-considerations}

Unter Windows werden `file:` [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)s mit einem Hostnamen in UNC-Pfade konvertiert, während `file:` [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)s mit Laufwerksbuchstaben in lokale absolute Pfade konvertiert werden. `file:` [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)s ohne Hostnamen und ohne Laufwerksbuchstaben führen zu einem Fehler:

```js [ESM]
import { readFileSync } from 'node:fs';
// Unter Windows :

// - WHATWG-Datei-URLs mit Hostname werden in UNC-Pfade konvertiert
// file://hostname/p/a/t/h/file => \\hostname\p\a\t\h\file
readFileSync(new URL('file://hostname/p/a/t/h/file'));

// - WHATWG-Datei-URLs mit Laufwerksbuchstaben werden in absolute Pfade konvertiert
// file:///C:/tmp/hello => C:\tmp\hello
readFileSync(new URL('file:///C:/tmp/hello'));

// - WHATWG-Datei-URLs ohne Hostname müssen einen Laufwerksbuchstaben haben
readFileSync(new URL('file:///notdriveletter/p/a/t/h/file'));
readFileSync(new URL('file:///c/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must be absolute
```
`file:` [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)s mit Laufwerksbuchstaben müssen `:` als Trennzeichen direkt nach dem Laufwerksbuchstaben verwenden. Die Verwendung eines anderen Trennzeichens führt zu einem Fehler.

Auf allen anderen Plattformen werden `file:` [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api)s mit einem Hostnamen nicht unterstützt und führen zu einem Fehler:

```js [ESM]
import { readFileSync } from 'node:fs';
// Auf anderen Plattformen:

// - WHATWG-Datei-URLs mit Hostname werden nicht unterstützt
// file://hostname/p/a/t/h/file => throw!
readFileSync(new URL('file://hostname/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH]: must be absolute

// - WHATWG-Datei-URLs werden in absolute Pfade konvertiert
// file:///tmp/hello => /tmp/hello
readFileSync(new URL('file:///tmp/hello'));
```
Eine `file:` [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) mit kodierten Schrägstrichzeichen führt auf allen Plattformen zu einem Fehler:

```js [ESM]
import { readFileSync } from 'node:fs';

// Unter Windows
readFileSync(new URL('file:///C:/p/a/t/h/%2F'));
readFileSync(new URL('file:///C:/p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded
\ or / characters */

// Unter POSIX
readFileSync(new URL('file:///p/a/t/h/%2F'));
readFileSync(new URL('file:///p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded
/ characters */
```
Unter Windows führt eine `file:` [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) mit kodiertem Backslash zu einem Fehler:

```js [ESM]
import { readFileSync } from 'node:fs';

// Unter Windows
readFileSync(new URL('file:///C:/path/%5C'));
readFileSync(new URL('file:///C:/path/%5c'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded
\ or / characters */
```

#### Buffer-Pfade {#buffer-paths}

Pfade, die mit einem [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) angegeben werden, sind hauptsächlich auf bestimmten POSIX-Betriebssystemen nützlich, die Dateipfade als undurchsichtige Byte-Sequenzen behandeln. Auf solchen Systemen ist es möglich, dass ein einzelner Dateipfad Subsequenzen enthält, die mehrere Zeichencodierungen verwenden. Wie bei String-Pfaden können [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)-Pfade relativ oder absolut sein:

Beispiel mit einem absoluten Pfad auf POSIX:

```js [ESM]
import { open } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

let fd;
try {
  fd = await open(Buffer.from('/open/some/file.txt'), 'r');
  // Tue etwas mit der Datei
} finally {
  await fd?.close();
}
```
#### Arbeitsverzeichnisse pro Laufwerk unter Windows {#per-drive-working-directories-on-windows}

Unter Windows folgt Node.js dem Konzept der Arbeitsverzeichnisse pro Laufwerk. Dieses Verhalten kann beobachtet werden, wenn ein Laufwerkspfad ohne Backslash verwendet wird. Beispielsweise kann `fs.readdirSync('C:\\')` möglicherweise ein anderes Ergebnis zurückgeben als `fs.readdirSync('C:')`. Weitere Informationen finden Sie auf [dieser MSDN-Seite](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#fully-qualified-vs-relative-paths).

### Dateideskriptoren {#file-descriptors_1}

Auf POSIX-Systemen verwaltet der Kernel für jeden Prozess eine Tabelle der aktuell geöffneten Dateien und Ressourcen. Jeder geöffneten Datei wird eine einfache numerische Kennung zugewiesen, die als *Dateideskriptor* bezeichnet wird. Auf Systemebene verwenden alle Dateisystemoperationen diese Dateideskriptoren, um jede einzelne Datei zu identifizieren und zu verfolgen. Windows-Systeme verwenden einen anderen, aber konzeptionell ähnlichen Mechanismus zur Verfolgung von Ressourcen. Um die Dinge für Benutzer zu vereinfachen, abstrahiert Node.js die Unterschiede zwischen Betriebssystemen und weist allen geöffneten Dateien einen numerischen Dateideskriptor zu.

Die Callback-basierte Methode `fs.open()` und die synchrone Methode `fs.openSync()` öffnen eine Datei und weisen einen neuen Dateideskriptor zu. Sobald der Dateideskriptor zugewiesen wurde, kann er verwendet werden, um Daten aus der Datei zu lesen, Daten in die Datei zu schreiben oder Informationen über die Datei anzufordern.

Betriebssysteme begrenzen die Anzahl der Dateideskriptoren, die gleichzeitig geöffnet sein dürfen. Daher ist es entscheidend, den Deskriptor zu schließen, sobald die Operationen abgeschlossen sind. Andernfalls entsteht ein Speicherleck, das schließlich zum Absturz einer Anwendung führt.

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
Die Promise-basierten APIs verwenden ein [\<FileHandle\>](/de/nodejs/api/fs#class-filehandle)-Objekt anstelle des numerischen Dateideskriptors. Diese Objekte werden vom System besser verwaltet, um sicherzustellen, dass keine Ressourcen verloren gehen. Es ist jedoch weiterhin erforderlich, dass sie geschlossen werden, sobald die Operationen abgeschlossen sind:

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

### Threadpool-Nutzung {#threadpool-usage}

Alle Callback- und Promise-basierten Dateisystem-APIs (mit Ausnahme von `fs.FSWatcher()`) verwenden den Threadpool von libuv. Dies kann überraschende und negative Auswirkungen auf die Leistung einiger Anwendungen haben. Weitere Informationen finden Sie in der Dokumentation zu [`UV_THREADPOOL_SIZE`](/de/nodejs/api/cli#uv_threadpool_sizesize).

### Dateisystem-Flags {#file-system-flags}

Die folgenden Flags sind überall dort verfügbar, wo die Option `flag` eine Zeichenkette akzeptiert.

-  `'a'`: Datei zum Anhängen öffnen. Die Datei wird erstellt, falls sie nicht existiert.
-  `'ax'`: Wie `'a'`, schlägt aber fehl, falls der Pfad existiert.
-  `'a+'`: Datei zum Lesen und Anhängen öffnen. Die Datei wird erstellt, falls sie nicht existiert.
-  `'ax+'`: Wie `'a+'`, schlägt aber fehl, falls der Pfad existiert.
-  `'as'`: Datei zum Anhängen im synchronen Modus öffnen. Die Datei wird erstellt, falls sie nicht existiert.
-  `'as+'`: Datei zum Lesen und Anhängen im synchronen Modus öffnen. Die Datei wird erstellt, falls sie nicht existiert.
-  `'r'`: Datei zum Lesen öffnen. Eine Ausnahme tritt auf, falls die Datei nicht existiert.
-  `'rs'`: Datei zum Lesen im synchronen Modus öffnen. Eine Ausnahme tritt auf, falls die Datei nicht existiert.
-  `'r+'`: Datei zum Lesen und Schreiben öffnen. Eine Ausnahme tritt auf, falls die Datei nicht existiert.
-  `'rs+'`: Datei zum Lesen und Schreiben im synchronen Modus öffnen. Weist das Betriebssystem an, den lokalen Dateisystem-Cache zu umgehen. Dies ist hauptsächlich nützlich für das Öffnen von Dateien auf NFS-Mounts, da so der potenziell veraltete lokale Cache übersprungen werden kann. Dies hat einen sehr realen Einfluss auf die I/O-Leistung, daher wird die Verwendung dieses Flags nur empfohlen, wenn es erforderlich ist. Dies macht `fs.open()` oder `fsPromises.open()` nicht zu einem synchronen, blockierenden Aufruf. Wenn ein synchroner Betrieb gewünscht wird, sollte etwas wie `fs.openSync()` verwendet werden.
-  `'w'`: Datei zum Schreiben öffnen. Die Datei wird erstellt (falls sie nicht existiert) oder abgeschnitten (falls sie existiert).
-  `'wx'`: Wie `'w'`, schlägt aber fehl, falls der Pfad existiert.
-  `'w+'`: Datei zum Lesen und Schreiben öffnen. Die Datei wird erstellt (falls sie nicht existiert) oder abgeschnitten (falls sie existiert).
-  `'wx+'`: Wie `'w+'`, schlägt aber fehl, falls der Pfad existiert.

`flag` kann auch eine Zahl sein, wie in [`open(2)`](http://man7.org/linux/man-pages/man2/open.2) dokumentiert; häufig verwendete Konstanten sind in `fs.constants` verfügbar. Unter Windows werden Flags in ihre entsprechenden Äquivalente übersetzt, z. B. `O_WRONLY` in `FILE_GENERIC_WRITE` oder `O_EXCL|O_CREAT` in `CREATE_NEW`, wie von `CreateFileW` akzeptiert.

Das exklusive Flag `'x'` (das `O_EXCL`-Flag in [`open(2)`](http://man7.org/linux/man-pages/man2/open.2)) bewirkt, dass die Operation einen Fehler zurückgibt, falls der Pfad bereits existiert. Unter POSIX gibt die Verwendung von `O_EXCL` einen Fehler zurück, selbst wenn der Link auf einen nicht existierenden Pfad verweist, falls der Pfad ein symbolischer Link ist. Das exklusive Flag funktioniert möglicherweise nicht mit Netzwerkdateisystemen.

Unter Linux funktionieren positionelle Schreibvorgänge nicht, wenn die Datei im Anhängemodus geöffnet wird. Der Kernel ignoriert das Positionsargument und hängt die Daten immer an das Ende der Datei an.

Das Modifizieren einer Datei anstatt sie zu ersetzen erfordert möglicherweise, dass die Option `flag` auf `'r+'` anstatt auf den Standardwert `'w'` gesetzt wird.

Das Verhalten einiger Flags ist plattformspezifisch. Daher führt das Öffnen eines Verzeichnisses unter macOS und Linux mit dem Flag `'a+'`, wie im folgenden Beispiel, zu einem Fehler. Im Gegensatz dazu wird unter Windows und FreeBSD ein Dateideskriptor oder ein `FileHandle` zurückgegeben.

```js [ESM]
// macOS und Linux
fs.open('<directory>', 'a+', (err, fd) => {
  // => [Error: EISDIR: illegal operation on a directory, open <directory>]
});

// Windows und FreeBSD
fs.open('<directory>', 'a+', (err, fd) => {
  // => null, <fd>
});
```
Unter Windows schlägt das Öffnen einer vorhandenen versteckten Datei mit dem Flag `'w'` fehl (entweder über `fs.open()`, `fs.writeFile()` oder `fsPromises.open()`) und führt zu `EPERM`. Vorhandene versteckte Dateien können mit dem Flag `'r+'` zum Schreiben geöffnet werden.

Ein Aufruf von `fs.ftruncate()` oder `filehandle.truncate()` kann verwendet werden, um den Dateiinhalt zurückzusetzen.

