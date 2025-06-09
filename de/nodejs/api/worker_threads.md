---
title: Node.js Worker-Threads
description: Dokumentation zur Nutzung von Worker-Threads in Node.js, um Multithreading für CPU-intensive Aufgaben zu nutzen, mit einer Übersicht über die Worker-Klasse, Thread-Kommunikation und Nutzungsbeispiele.
head:
  - - meta
    - name: og:title
      content: Node.js Worker-Threads | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Dokumentation zur Nutzung von Worker-Threads in Node.js, um Multithreading für CPU-intensive Aufgaben zu nutzen, mit einer Übersicht über die Worker-Klasse, Thread-Kommunikation und Nutzungsbeispiele.
  - - meta
    - name: twitter:title
      content: Node.js Worker-Threads | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Dokumentation zur Nutzung von Worker-Threads in Node.js, um Multithreading für CPU-intensive Aufgaben zu nutzen, mit einer Übersicht über die Worker-Klasse, Thread-Kommunikation und Nutzungsbeispiele.
---


# Worker-Threads {#worker-threads}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/worker_threads.js](https://github.com/nodejs/node/blob/v23.5.0/lib/worker_threads.js)

Das Modul `node:worker_threads` ermöglicht die Verwendung von Threads, die JavaScript parallel ausführen. Um darauf zuzugreifen:

```js [ESM]
const worker = require('node:worker_threads');
```
Worker (Threads) sind nützlich für die Durchführung von CPU-intensiven JavaScript-Operationen. Sie helfen nicht viel bei E/A-intensiven Arbeiten. Die in Node.js integrierten asynchronen E/A-Operationen sind effizienter als Worker es sein können.

Anders als `child_process` oder `cluster` können `worker_threads` Speicher gemeinsam nutzen. Sie tun dies, indem sie `ArrayBuffer`-Instanzen übertragen oder `SharedArrayBuffer`-Instanzen gemeinsam nutzen.

```js [ESM]
const {
  Worker, isMainThread, parentPort, workerData,
} = require('node:worker_threads');

if (isMainThread) {
  module.exports = function parseJSAsync(script) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: script,
      });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  };
} else {
  const { parse } = require('some-js-parsing-library');
  const script = workerData;
  parentPort.postMessage(parse(script));
}
```
Das obige Beispiel erzeugt für jeden `parseJSAsync()`-Aufruf einen Worker-Thread. In der Praxis sollte man für diese Art von Aufgaben einen Pool von Workern verwenden. Andernfalls würde der Aufwand für die Erstellung von Workern wahrscheinlich ihren Nutzen übersteigen.

Bei der Implementierung eines Worker-Pools verwenden Sie die [`AsyncResource`](/de/nodejs/api/async_hooks#class-asyncresource)-API, um diagnostische Tools (z. B. zur Bereitstellung asynchroner Stacktraces) über die Korrelation zwischen Aufgaben und ihren Ergebnissen zu informieren. Siehe ["Verwenden von `AsyncResource` für einen `Worker`-Thread-Pool"](/de/nodejs/api/async_context#using-asyncresource-for-a-worker-thread-pool) in der `async_hooks`-Dokumentation für eine Beispielimplementierung.

Worker-Threads erben standardmäßig nicht-prozessspezifische Optionen. Informationen zur Anpassung der Worker-Thread-Optionen, insbesondere der Optionen `argv` und `execArgv`, finden Sie unter [`Worker constructor options`](/de/nodejs/api/worker_threads#new-workerfilename-options).


## `worker.getEnvironmentData(key)` {#workergetenvironmentdatakey}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v17.5.0, v16.15.0 | Nicht mehr experimentell. |
| v15.12.0, v14.18.0 | Hinzugefügt in: v15.12.0, v14.18.0 |
:::

- `key` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Beliebiger, klonbarer JavaScript-Wert, der als [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)-Schlüssel verwendet werden kann.
- Gibt zurück: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Innerhalb eines Worker-Threads gibt `worker.getEnvironmentData()` einen Klon der Daten zurück, die an `worker.setEnvironmentData()` des erzeugenden Threads übergeben wurden. Jeder neue `Worker` erhält automatisch eine eigene Kopie der Umgebungsdaten.

```js [ESM]
const {
  Worker,
  isMainThread,
  setEnvironmentData,
  getEnvironmentData,
} = require('node:worker_threads');

if (isMainThread) {
  setEnvironmentData('Hello', 'World!');
  const worker = new Worker(__filename);
} else {
  console.log(getEnvironmentData('Hello'));  // Gibt 'World!' aus.
}
```
## `worker.isMainThread` {#workerismainthread}

**Hinzugefügt in: v10.5.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ist `true`, wenn dieser Code nicht innerhalb eines [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Threads ausgeführt wird.

```js [ESM]
const { Worker, isMainThread } = require('node:worker_threads');

if (isMainThread) {
  // Dies lädt die aktuelle Datei innerhalb einer Worker-Instanz neu.
  new Worker(__filename);
} else {
  console.log('Inside Worker!');
  console.log(isMainThread);  // Gibt 'false' aus.
}
```
## `worker.markAsUntransferable(object)` {#workermarkasuntransferableobject}

**Hinzugefügt in: v14.5.0, v12.19.0**

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Beliebiger JavaScript-Wert.

Markiert ein Objekt als nicht übertragbar. Wenn `object` in der Transferliste eines [`port.postMessage()`](/de/nodejs/api/worker_threads#portpostmessagevalue-transferlist)-Aufrufs vorkommt, wird ein Fehler ausgelöst. Dies ist eine No-Op, wenn `object` ein primitiver Wert ist.

Dies ist insbesondere sinnvoll für Objekte, die eher geklont als übertragen werden können und die von anderen Objekten auf der sendenden Seite verwendet werden. Node.js markiert beispielsweise die `ArrayBuffer`s, die es für seinen [`Buffer`-Pool](/de/nodejs/api/buffer#static-method-bufferallocunsafesize) verwendet, damit.

Diese Operation kann nicht rückgängig gemacht werden.

```js [ESM]
const { MessageChannel, markAsUntransferable } = require('node:worker_threads');

const pooledBuffer = new ArrayBuffer(8);
const typedArray1 = new Uint8Array(pooledBuffer);
const typedArray2 = new Float64Array(pooledBuffer);

markAsUntransferable(pooledBuffer);

const { port1 } = new MessageChannel();
try {
  // Dies wird einen Fehler auslösen, da pooledBuffer nicht übertragbar ist.
  port1.postMessage(typedArray1, [ typedArray1.buffer ]);
} catch (error) {
  // error.name === 'DataCloneError'
}

// Die folgende Zeile gibt den Inhalt von typedArray1 aus -- es besitzt immer noch
// seinen Speicher und wurde nicht übertragen. Ohne
// `markAsUntransferable()` würde dies ein leeres Uint8Array ausgeben und der
// postMessage-Aufruf wäre erfolgreich gewesen.
// typedArray2 ist ebenfalls intakt.
console.log(typedArray1);
console.log(typedArray2);
```
Es gibt kein Äquivalent zu dieser API in Browsern.


## `worker.isMarkedAsUntransferable(object)` {#workerismarkedasuntransferableobject}

**Hinzugefügt in: v21.0.0**

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Ein beliebiger JavaScript-Wert.
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Überprüft, ob ein Objekt mit [`markAsUntransferable()`](/de/nodejs/api/worker_threads#workermarkasuntransferableobject) als nicht übertragbar markiert wurde.

```js [ESM]
const { markAsUntransferable, isMarkedAsUntransferable } = require('node:worker_threads');

const pooledBuffer = new ArrayBuffer(8);
markAsUntransferable(pooledBuffer);

isMarkedAsUntransferable(pooledBuffer);  // Gibt true zurück.
```
Es gibt kein Äquivalent zu dieser API in Browsern.

## `worker.markAsUncloneable(object)` {#workermarkasuncloneableobject}

**Hinzugefügt in: v23.0.0**

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Ein beliebiger JavaScript-Wert.

Markiert ein Objekt als nicht klonbar. Wenn `object` als [`message`](/de/nodejs/api/worker_threads#event-message) in einem [`port.postMessage()`](/de/nodejs/api/worker_threads#portpostmessagevalue-transferlist)-Aufruf verwendet wird, wird ein Fehler ausgelöst. Dies ist ein No-Op, wenn `object` ein primitiver Wert ist.

Dies hat keine Auswirkung auf `ArrayBuffer` oder ähnliche `Buffer`-Objekte.

Diese Operation kann nicht rückgängig gemacht werden.

```js [ESM]
const { markAsUncloneable } = require('node:worker_threads');

const anyObject = { foo: 'bar' };
markAsUncloneable(anyObject);
const { port1 } = new MessageChannel();
try {
  // Dies wirft einen Fehler, da anyObject nicht klonbar ist.
  port1.postMessage(anyObject);
} catch (error) {
  // error.name === 'DataCloneError'
}
```
Es gibt kein Äquivalent zu dieser API in Browsern.

## `worker.moveMessagePortToContext(port, contextifiedSandbox)` {#workermovemessageporttocontextport-contextifiedsandbox}

**Hinzugefügt in: v11.13.0**

-  `port` [\<MessagePort\>](/de/nodejs/api/worker_threads#class-messageport) Der zu übertragende Nachrichten-Port.
-  `contextifiedSandbox` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein [kontextualisiertes](/de/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) Objekt, wie es von der Methode `vm.createContext()` zurückgegeben wird.
-  Rückgabe: [\<MessagePort\>](/de/nodejs/api/worker_threads#class-messageport)

Überträgt einen `MessagePort` in einen anderen [`vm`](/de/nodejs/api/vm)-Kontext. Das ursprüngliche `port`-Objekt wird unbrauchbar gemacht und die zurückgegebene `MessagePort`-Instanz tritt an seine Stelle.

Der zurückgegebene `MessagePort` ist ein Objekt im Zielkontext und erbt von seiner globalen `Object`-Klasse. Objekte, die an den Listener [`port.onmessage()`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/onmessage) übergeben werden, werden ebenfalls im Zielkontext erstellt und erben von seiner globalen `Object`-Klasse.

Der erstellte `MessagePort` erbt jedoch nicht mehr von [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget), und nur [`port.onmessage()`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/onmessage) kann verwendet werden, um Ereignisse zu empfangen.


## `worker.parentPort` {#workerparentport}

**Hinzugefügt in: v10.5.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<MessagePort\>](/de/nodejs/api/worker_threads#class-messageport)

Wenn dieser Thread ein [`Worker`](/de/nodejs/api/worker_threads#class-worker) ist, ist dies ein [`MessagePort`](/de/nodejs/api/worker_threads#class-messageport), der die Kommunikation mit dem übergeordneten Thread ermöglicht. Nachrichten, die mit `parentPort.postMessage()` gesendet werden, sind im übergeordneten Thread mit `worker.on('message')` verfügbar, und Nachrichten, die vom übergeordneten Thread mit `worker.postMessage()` gesendet werden, sind in diesem Thread mit `parentPort.on('message')` verfügbar.

```js [ESM]
const { Worker, isMainThread, parentPort } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.once('message', (message) => {
    console.log(message);  // Gibt 'Hello, world!' aus.
  });
  worker.postMessage('Hello, world!');
} else {
  // Wenn eine Nachricht vom übergeordneten Thread empfangen wird, sende sie zurück:
  parentPort.once('message', (message) => {
    parentPort.postMessage(message);
  });
}
```
## `worker.postMessageToThread(threadId, value[, transferList][, timeout])` {#workerpostmessagetothreadthreadid-value-transferlist-timeout}

**Hinzugefügt in: v22.5.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

- `threadId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Ziel-Thread-ID. Wenn die Thread-ID ungültig ist, wird ein [`ERR_WORKER_MESSAGING_FAILED`](/de/nodejs/api/errors#err_worker_messaging_failed)-Fehler ausgelöst. Wenn die Ziel-Thread-ID die aktuelle Thread-ID ist, wird ein [`ERR_WORKER_MESSAGING_SAME_THREAD`](/de/nodejs/api/errors#err_worker_messaging_same_thread)-Fehler ausgelöst.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Der zu sendende Wert.
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Wenn ein oder mehrere `MessagePort`-ähnliche Objekte in `value` übergeben werden, ist eine `transferList` für diese Elemente erforderlich, andernfalls wird [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/de/nodejs/api/errors#err_missing_message_port_in_transfer_list) ausgelöst. Siehe [`port.postMessage()`](/de/nodejs/api/worker_threads#portpostmessagevalue-transferlist) für weitere Informationen.
- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Zeit, die auf die Zustellung der Nachricht in Millisekunden gewartet werden soll. Standardmäßig ist es `undefined`, was bedeutet, dass unbegrenzt gewartet wird. Wenn die Operation ein Timeout überschreitet, wird ein [`ERR_WORKER_MESSAGING_TIMEOUT`](/de/nodejs/api/errors#err_worker_messaging_timeout)-Fehler ausgelöst.
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Ein Promise, das erfüllt wird, wenn die Nachricht erfolgreich vom Ziel-Thread verarbeitet wurde.

Sendet einen Wert an einen anderen Worker, der durch seine Thread-ID identifiziert wird.

Wenn der Ziel-Thread keinen Listener für das `workerMessage`-Ereignis hat, löst die Operation einen [`ERR_WORKER_MESSAGING_FAILED`](/de/nodejs/api/errors#err_worker_messaging_failed)-Fehler aus.

Wenn der Ziel-Thread während der Verarbeitung des `workerMessage`-Ereignisses einen Fehler auslöst, löst die Operation einen [`ERR_WORKER_MESSAGING_ERRORED`](/de/nodejs/api/errors#err_worker_messaging_errored)-Fehler aus.

Diese Methode sollte verwendet werden, wenn der Ziel-Thread nicht der direkte Eltern- oder Kind-Thread des aktuellen Threads ist. Wenn die beiden Threads Eltern-Kind-Beziehungen haben, verwenden Sie [`require('node:worker_threads').parentPort.postMessage()`](/de/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) und [`worker.postMessage()`](/de/nodejs/api/worker_threads#workerpostmessagevalue-transferlist), um die Threads kommunizieren zu lassen.

Das folgende Beispiel zeigt die Verwendung von `postMessageToThread`: Es erstellt 10 verschachtelte Threads, der letzte wird versuchen, mit dem Hauptthread zu kommunizieren.

::: code-group
```js [ESM]
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import {
  postMessageToThread,
  threadId,
  workerData,
  Worker,
} from 'node:worker_threads';

const channel = new BroadcastChannel('sync');
const level = workerData?.level ?? 0;

if (level < 10) {
  const worker = new Worker(fileURLToPath(import.meta.url), {
    workerData: { level: level + 1 },
  });
}

if (level === 0) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    postMessageToThread(source, { message: 'pong' });
  });
} else if (level === 10) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    channel.postMessage('done');
    channel.close();
  });

  await postMessageToThread(0, { message: 'ping' });
}

channel.onmessage = channel.close;
```

```js [CJS]
const {
  postMessageToThread,
  threadId,
  workerData,
  Worker,
} = require('node:worker_threads');

const channel = new BroadcastChannel('sync');
const level = workerData?.level ?? 0;

if (level < 10) {
  const worker = new Worker(__filename, {
    workerData: { level: level + 1 },
  });
}

if (level === 0) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    postMessageToThread(source, { message: 'pong' });
  });
} else if (level === 10) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    channel.postMessage('done');
    channel.close();
  });

  postMessageToThread(0, { message: 'ping' });
}

channel.onmessage = channel.close;
```
:::


## `worker.receiveMessageOnPort(port)` {#workerreceivemessageonportport}

::: info [History]
| Version | Changes |
| --- | --- |
| v15.12.0 | Das Port-Argument kann jetzt auch auf einen `BroadcastChannel` verweisen. |
| v12.3.0 | Hinzugefügt in: v12.3.0 |
:::

-  `port` [\<MessagePort\>](/de/nodejs/api/worker_threads#class-messageport) | [\<BroadcastChannel\>](/de/nodejs/api/worker_threads#class-broadcastchannel-extends-eventtarget)
-  Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Empfängt eine einzelne Nachricht von einem gegebenen `MessagePort`. Wenn keine Nachricht verfügbar ist, wird `undefined` zurückgegeben, andernfalls ein Objekt mit einer einzelnen `message`-Eigenschaft, die die Nachrichtennutzlast enthält, die der ältesten Nachricht in der Warteschlange des `MessagePort` entspricht.

```js [ESM]
const { MessageChannel, receiveMessageOnPort } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();
port1.postMessage({ hello: 'world' });

console.log(receiveMessageOnPort(port2));
// Gibt aus: { message: { hello: 'world' } }
console.log(receiveMessageOnPort(port2));
// Gibt aus: undefined
```
Wenn diese Funktion verwendet wird, wird kein `'message'`-Ereignis ausgelöst und der `onmessage`-Listener wird nicht aufgerufen.

## `worker.resourceLimits` {#workerresourcelimits}

**Hinzugefügt in: v13.2.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

Stellt die Menge der JS-Engine-Ressourcenbeschränkungen innerhalb dieses Worker-Threads bereit. Wenn die Option `resourceLimits` an den [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Konstruktor übergeben wurde, entspricht dies dessen Werten.

Wenn dies im Haupt-Thread verwendet wird, ist sein Wert ein leeres Objekt.


## `worker.SHARE_ENV` {#workershare_env}

**Hinzugefügt in: v11.14.0**

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)

Ein spezieller Wert, der als `env`-Option des [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Konstruktors übergeben werden kann, um anzugeben, dass der aktuelle Thread und der Worker-Thread Lese- und Schreibzugriff auf denselben Satz von Umgebungsvariablen haben sollen.

```js [ESM]
const { Worker, SHARE_ENV } = require('node:worker_threads');
new Worker('process.env.SET_IN_WORKER = "foo"', { eval: true, env: SHARE_ENV })
  .on('exit', () => {
    console.log(process.env.SET_IN_WORKER);  // Gibt 'foo' aus.
  });
```
## `worker.setEnvironmentData(key[, value])` {#workersetenvironmentdatakey-value}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v17.5.0, v16.15.0 | Nicht mehr experimentell. |
| v15.12.0, v14.18.0 | Hinzugefügt in: v15.12.0, v14.18.0 |
:::

- `key` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Beliebiger, klonbarer JavaScript-Wert, der als [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)-Schlüssel verwendet werden kann.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Beliebiger, klonbarer JavaScript-Wert, der geklont und automatisch an alle neuen `Worker`-Instanzen übergeben wird. Wenn `value` als `undefined` übergeben wird, wird jeder zuvor für den `key` festgelegte Wert gelöscht.

Die `worker.setEnvironmentData()`-API legt den Inhalt von `worker.getEnvironmentData()` im aktuellen Thread und allen neuen `Worker`-Instanzen fest, die aus dem aktuellen Kontext erzeugt werden.

## `worker.threadId` {#workerthreadid}

**Hinzugefügt in: v10.5.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Ein ganzzahliger Identifikator für den aktuellen Thread. Im entsprechenden Worker-Objekt (falls vorhanden) ist er als [`worker.threadId`](/de/nodejs/api/worker_threads#workerthreadid_1) verfügbar. Dieser Wert ist für jede [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Instanz innerhalb eines einzelnen Prozesses eindeutig.


## `worker.workerData` {#workerworkerdata}

**Hinzugefügt in: v10.5.0**

Ein beliebiger JavaScript-Wert, der einen Klon der Daten enthält, die dem `Worker`-Konstruktor dieses Threads übergeben wurden.

Die Daten werden so geklont, als ob sie mit [`postMessage()`](/de/nodejs/api/worker_threads#portpostmessagevalue-transferlist) gemäß dem [HTML-Strukturierter-Klonen-Algorithmus](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) verwendet würden.

```js [ESM]
const { Worker, isMainThread, workerData } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename, { workerData: 'Hallo, Welt!' });
} else {
  console.log(workerData);  // Gibt 'Hallo, Welt!' aus.
}
```
## Klasse: `BroadcastChannel extends EventTarget` {#class-broadcastchannel-extends-eventtarget}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Nicht mehr experimentell. |
| v15.4.0 | Hinzugefügt in: v15.4.0 |
:::

Instanzen von `BroadcastChannel` ermöglichen asynchrone Eins-zu-Viele-Kommunikation mit allen anderen `BroadcastChannel`-Instanzen, die an denselben Kanalnamen gebunden sind.

```js [ESM]
'use strict';

const {
  isMainThread,
  BroadcastChannel,
  Worker,
} = require('node:worker_threads');

const bc = new BroadcastChannel('hello');

if (isMainThread) {
  let c = 0;
  bc.onmessage = (event) => {
    console.log(event.data);
    if (++c === 10) bc.close();
  };
  for (let n = 0; n < 10; n++)
    new Worker(__filename);
} else {
  bc.postMessage('hello from every worker');
  bc.close();
}
```
### `new BroadcastChannel(name)` {#new-broadcastchannelname}

**Hinzugefügt in: v15.4.0**

- `name` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Der Name des Kanals, mit dem eine Verbindung hergestellt werden soll. Jeder JavaScript-Wert, der mit ``${name}`` in einen String konvertiert werden kann, ist zulässig.

### `broadcastChannel.close()` {#broadcastchannelclose}

**Hinzugefügt in: v15.4.0**

Schließt die `BroadcastChannel`-Verbindung.

### `broadcastChannel.onmessage` {#broadcastchannelonmessage}

**Hinzugefügt in: v15.4.0**

- Type: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird mit einem einzelnen `MessageEvent`-Argument aufgerufen, wenn eine Nachricht empfangen wird.


### `broadcastChannel.onmessageerror` {#broadcastchannelonmessageerror}

**Hinzugefügt in: v15.4.0**

- Typ: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird aufgerufen, wenn eine empfangene Nachricht nicht deserialisiert werden kann.

### `broadcastChannel.postMessage(message)` {#broadcastchannelpostmessagemessage}

**Hinzugefügt in: v15.4.0**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Beliebiger klonbarer JavaScript-Wert.

### `broadcastChannel.ref()` {#broadcastchannelref}

**Hinzugefügt in: v15.4.0**

Gegenteil von `unref()`. Das Aufrufen von `ref()` auf einem zuvor `unref()`ed BroadcastChannel führt *nicht* dazu, dass das Programm beendet wird, wenn dies der einzige aktive Handle ist (das Standardverhalten). Wenn der Port `ref()`ed ist, hat ein erneuter Aufruf von `ref()` keine Auswirkung.

### `broadcastChannel.unref()` {#broadcastchannelunref}

**Hinzugefügt in: v15.4.0**

Das Aufrufen von `unref()` auf einem BroadcastChannel ermöglicht es dem Thread, zu beenden, wenn dies der einzige aktive Handle im Ereignissystem ist. Wenn der BroadcastChannel bereits `unref()`ed ist, hat ein erneuter Aufruf von `unref()` keine Auswirkung.

## Klasse: `MessageChannel` {#class-messagechannel}

**Hinzugefügt in: v10.5.0**

Instanzen der Klasse `worker.MessageChannel` stellen einen asynchronen bidirektionalen Kommunikationskanal dar. Die `MessageChannel` hat keine eigenen Methoden. `new MessageChannel()` ergibt ein Objekt mit den Eigenschaften `port1` und `port2`, die sich auf verknüpfte [`MessagePort`](/de/nodejs/api/worker_threads#class-messageport)-Instanzen beziehen.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');

const { port1, port2 } = new MessageChannel();
port1.on('message', (message) => console.log('received', message));
port2.postMessage({ foo: 'bar' });
// Gibt aus: received { foo: 'bar' } vom `port1.on('message')`-Listener
```
## Klasse: `MessagePort` {#class-messageport}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.7.0 | Diese Klasse erbt jetzt von `EventTarget` anstelle von `EventEmitter`. |
| v10.5.0 | Hinzugefügt in: v10.5.0 |
:::

- Erweitert: [\<EventTarget\>](/de/nodejs/api/events#class-eventtarget)

Instanzen der Klasse `worker.MessagePort` stellen ein Ende eines asynchronen, bidirektionalen Kommunikationskanals dar. Es kann verwendet werden, um strukturierte Daten, Speicherbereiche und andere `MessagePort`s zwischen verschiedenen [`Worker`](/de/nodejs/api/worker_threads#class-worker)s zu übertragen.

Diese Implementierung entspricht [Browser `MessagePort`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort)s.


### Event: `'close'` {#event-close}

**Hinzugefügt in: v10.5.0**

Das `'close'`-Ereignis wird ausgelöst, sobald eine Seite des Kanals getrennt wurde.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

// Gibt Folgendes aus:
//   foobar
//   closed!
port2.on('message', (message) => console.log(message));
port2.on('close', () => console.log('closed!'));

port1.postMessage('foobar');
port1.close();
```
### Event: `'message'` {#event-message}

**Hinzugefügt in: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Der übertragene Wert

Das `'message'`-Ereignis wird für jede eingehende Nachricht ausgelöst, die den geklonten Input von [`port.postMessage()`](/de/nodejs/api/worker_threads#portpostmessagevalue-transferlist) enthält.

Listener für dieses Ereignis erhalten einen Klon des `value`-Parameters, wie er an `postMessage()` übergeben wurde, und keine weiteren Argumente.

### Event: `'messageerror'` {#event-messageerror}

**Hinzugefügt in: v14.5.0, v12.19.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Ein Error-Objekt

Das `'messageerror'`-Ereignis wird ausgelöst, wenn die Deserialisierung einer Nachricht fehlgeschlagen ist.

Derzeit wird dieses Ereignis ausgelöst, wenn beim Instanziieren des geposteten JS-Objekts auf der Empfängerseite ein Fehler auftritt. Solche Situationen sind selten, können aber beispielsweise auftreten, wenn bestimmte Node.js-API-Objekte in einem `vm.Context` empfangen werden (wo Node.js-APIs derzeit nicht verfügbar sind).

### `port.close()` {#portclose}

**Hinzugefügt in: v10.5.0**

Deaktiviert das weitere Senden von Nachrichten auf beiden Seiten der Verbindung. Diese Methode kann aufgerufen werden, wenn keine weitere Kommunikation über diesen `MessagePort` stattfindet.

Das Ereignis [`'close'`](/de/nodejs/api/worker_threads#event-close) wird auf beiden `MessagePort`-Instanzen ausgelöst, die Teil des Kanals sind.

### `port.postMessage(value[, transferList])` {#portpostmessagevalue-transferlist}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v21.0.0 | Es wird ein Fehler geworfen, wenn sich ein nicht übertragbares Objekt in der Übertragungsliste befindet. |
| v15.6.0 | `X509Certificate` wurde der Liste der klonbaren Typen hinzugefügt. |
| v15.0.0 | `CryptoKey` wurde der Liste der klonbaren Typen hinzugefügt. |
| v15.14.0, v14.18.0 | 'BlockList' zur Liste der klonbaren Typen hinzugefügt. |
| v15.9.0, v14.18.0 | 'Histogram'-Typen zur Liste der klonbaren Typen hinzugefügt. |
| v14.5.0, v12.19.0 | `KeyObject` wurde der Liste der klonbaren Typen hinzugefügt. |
| v14.5.0, v12.19.0 | `FileHandle` wurde der Liste der übertragbaren Typen hinzugefügt. |
| v10.5.0 | Hinzugefügt in: v10.5.0 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Sendet einen JavaScript-Wert an die empfangende Seite dieses Kanals. `value` wird auf eine Weise übertragen, die mit dem [HTML-Algorithmus für strukturiertes Klonen](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) kompatibel ist.

Insbesondere die wesentlichen Unterschiede zu `JSON` sind:

- `value` kann zirkuläre Referenzen enthalten.
- `value` kann Instanzen von integrierten JS-Typen wie `RegExp`s, `BigInt`s, `Map`s, `Set`s usw. enthalten.
- `value` kann typisierte Arrays enthalten, sowohl unter Verwendung von `ArrayBuffer`s als auch von `SharedArrayBuffer`s.
- `value` kann [`WebAssembly.Module`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module)-Instanzen enthalten.
- `value` darf keine nativen (C++-basierten) Objekte enthalten, außer:
    - [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)s,
    - [\<FileHandle\>](/de/nodejs/api/fs#class-filehandle)s,
    - [\<Histogram\>](/de/nodejs/api/perf_hooks#class-histogram)s,
    - [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject)s,
    - [\<MessagePort\>](/de/nodejs/api/worker_threads#class-messageport)s,
    - [\<net.BlockList\>](/de/nodejs/api/net#class-netblocklist)s,
    - [\<net.SocketAddress\>](/de/nodejs/api/net#class-netsocketaddress)en,
    - [\<X509Certificate\>](/de/nodejs/api/crypto#class-x509certificate)s.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => console.log(message));

const circularData = {};
circularData.foo = circularData;
// Prints: { foo: [Circular] }
port2.postMessage(circularData);
```
`transferList` kann eine Liste von [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)-, [`MessagePort`](/de/nodejs/api/worker_threads#class-messageport)- und [`FileHandle`](/de/nodejs/api/fs#class-filehandle)-Objekten sein. Nach der Übertragung sind sie auf der sendenden Seite des Kanals nicht mehr verwendbar (auch wenn sie nicht in `value` enthalten sind). Anders als bei [Kindprozessen](/de/nodejs/api/child_process) wird das Übertragen von Handles wie Netzwerk-Sockets derzeit nicht unterstützt.

Wenn `value` [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)-Instanzen enthält, sind diese von beiden Threads aus zugänglich. Sie können nicht in `transferList` aufgeführt werden.

`value` kann weiterhin `ArrayBuffer`-Instanzen enthalten, die sich nicht in `transferList` befinden; in diesem Fall wird der zugrunde liegende Speicher kopiert und nicht verschoben.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => console.log(message));

const uint8Array = new Uint8Array([ 1, 2, 3, 4 ]);
// Dies postet eine Kopie von `uint8Array`:
port2.postMessage(uint8Array);
// Dies kopiert keine Daten, sondern macht `uint8Array` unbrauchbar:
port2.postMessage(uint8Array, [ uint8Array.buffer ]);

// Der Speicher für das `sharedUint8Array` ist sowohl vom Original als auch von
// der von `.on('message')` empfangenen Kopie aus zugänglich:
const sharedUint8Array = new Uint8Array(new SharedArrayBuffer(4));
port2.postMessage(sharedUint8Array);

// Dies überträgt einen neu erstellten Message Port an den Empfänger.
// Dies kann beispielsweise verwendet werden, um Kommunikationskanäle zwischen
// mehreren `Worker`-Threads zu erstellen, die Kinder desselben Eltern-Threads sind.
const otherChannel = new MessageChannel();
port2.postMessage({ port: otherChannel.port1 }, [ otherChannel.port1 ]);
```
Das Nachrichtenobjekt wird sofort geklont und kann nach dem Posten ohne Nebenwirkungen geändert werden.

Weitere Informationen zu den Serialisierungs- und Deserialisierungsmechanismen hinter dieser API finden Sie in der [Serialisierungs-API des `node:v8`-Moduls](/de/nodejs/api/v8#serialization-api).


#### Überlegungen beim Übertragen von TypedArrays und Buffers {#considerations-when-transferring-typedarrays-and-buffers}

Alle `TypedArray`- und `Buffer`-Instanzen sind Views über einen zugrunde liegenden `ArrayBuffer`. Das heißt, es ist der `ArrayBuffer`, der tatsächlich die Rohdaten speichert, während die `TypedArray`- und `Buffer`-Objekte eine Möglichkeit bieten, die Daten anzuzeigen und zu bearbeiten. Es ist möglich und üblich, mehrere Views über dieselbe `ArrayBuffer`-Instanz zu erstellen. Bei der Verwendung einer Transferliste zum Übertragen eines `ArrayBuffer` ist große Sorgfalt geboten, da dies dazu führt, dass alle `TypedArray`- und `Buffer`-Instanzen, die sich denselben `ArrayBuffer` teilen, unbrauchbar werden.

```js [ESM]
const ab = new ArrayBuffer(10);

const u1 = new Uint8Array(ab);
const u2 = new Uint16Array(ab);

console.log(u2.length);  // gibt 5 aus

port.postMessage(u1, [u1.buffer]);

console.log(u2.length);  // gibt 0 aus
```
Ob der zugrunde liegende `ArrayBuffer` für `Buffer`-Instanzen speziell übertragen oder geklont werden kann, hängt vollständig davon ab, wie Instanzen erstellt wurden, was oft nicht zuverlässig ermittelt werden kann.

Ein `ArrayBuffer` kann mit [`markAsUntransferable()`](/de/nodejs/api/worker_threads#workermarkasuntransferableobject) gekennzeichnet werden, um anzuzeigen, dass er immer geklont und niemals übertragen werden soll.

Abhängig davon, wie eine `Buffer`-Instanz erstellt wurde, besitzt sie möglicherweise ihren zugrunde liegenden `ArrayBuffer` oder auch nicht. Ein `ArrayBuffer` darf nur dann übertragen werden, wenn bekannt ist, dass die `Buffer`-Instanz ihn besitzt. Insbesondere für `Buffer`s, die aus dem internen `Buffer`-Pool erstellt wurden (z. B. mit `Buffer.from()` oder `Buffer.allocUnsafe()`), ist die Übertragung nicht möglich und sie werden immer geklont, wodurch eine Kopie des gesamten `Buffer`-Pools gesendet wird. Dieses Verhalten kann zu unbeabsichtigt höherem Speicherverbrauch und möglichen Sicherheitsbedenken führen.

Weitere Informationen zur `Buffer`-Pooling finden Sie unter [`Buffer.allocUnsafe()`](/de/nodejs/api/buffer#static-method-bufferallocunsafesize).

Die `ArrayBuffer`s für `Buffer`-Instanzen, die mit `Buffer.alloc()` oder `Buffer.allocUnsafeSlow()` erstellt wurden, können immer übertragen werden, aber dadurch werden alle anderen vorhandenen Views dieser `ArrayBuffer`s unbrauchbar.


#### Überlegungen beim Klonen von Objekten mit Prototypen, Klassen und Accessoren {#considerations-when-cloning-objects-with-prototypes-classes-and-accessors}

Da das Objektklonen den [HTML Structured Clone Algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) verwendet, werden nicht-aufzählbare Eigenschaften, Property Accessoren und Objektprototypen nicht beibehalten. Insbesondere werden [`Buffer`](/de/nodejs/api/buffer)-Objekte auf der Empfängerseite als einfache [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)s gelesen, und Instanzen von JavaScript-Klassen werden als einfache JavaScript-Objekte geklont.

```js [ESM]
const b = Symbol('b');

class Foo {
  #a = 1;
  constructor() {
    this[b] = 2;
    this.c = 3;
  }

  get d() { return 4; }
}

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => console.log(data);

port2.postMessage(new Foo());

// Prints: { c: 3 }
```
Diese Einschränkung gilt auch für viele integrierte Objekte, wie z. B. das globale `URL`-Objekt:

```js [ESM]
const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => console.log(data);

port2.postMessage(new URL('https://example.org'));

// Prints: { }
```
### `port.hasRef()` {#porthasref}

**Hinzugefügt in: v18.1.0, v16.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wenn true, hält das `MessagePort`-Objekt die Node.js-Event-Loop aktiv.

### `port.ref()` {#portref}

**Hinzugefügt in: v10.5.0**

Das Gegenteil von `unref()`. Der Aufruf von `ref()` auf einem zuvor `unref()`ten Port führt *nicht* dazu, dass das Programm beendet wird, wenn es der einzige aktive Handle ist, der noch übrig ist (das Standardverhalten). Wenn der Port `ref()`ed ist, hat ein erneuter Aufruf von `ref()` keine Auswirkung.

Wenn Listener mit `.on('message')` angehängt oder entfernt werden, wird der Port automatisch `ref()`ed und `unref()`ed, je nachdem, ob Listener für das Ereignis vorhanden sind.


### `port.start()` {#portstart}

**Hinzugefügt in: v10.5.0**

Startet den Empfang von Nachrichten an diesem `MessagePort`. Wenn dieser Port als ein Event-Emitter verwendet wird, wird dies automatisch aufgerufen, sobald `'message'`-Listener angehängt werden.

Diese Methode existiert, um die Parität mit der Web `MessagePort` API zu wahren. In Node.js ist sie nur nützlich, um Nachrichten zu ignorieren, wenn kein Event-Listener vorhanden ist. Node.js weicht auch in seiner Handhabung von `.onmessage` ab. Das Setzen von `.onmessage` ruft automatisch `.start()` auf, aber das Aufheben der Setzung lässt Nachrichten in der Warteschlange, bis ein neuer Handler gesetzt oder der Port verworfen wird.

### `port.unref()` {#portunref}

**Hinzugefügt in: v10.5.0**

Das Aufrufen von `unref()` auf einem Port ermöglicht dem Thread den Beenden, wenn dies der einzige aktive Handle im Event-System ist. Wenn der Port bereits `unref()`ed ist, hat das erneute Aufrufen von `unref()` keine Auswirkung.

Wenn Listener mit `.on('message')` angehängt oder entfernt werden, wird der Port automatisch `ref()`ed und `unref()`ed, je nachdem, ob Listener für das Event vorhanden sind.

## Klasse: `Worker` {#class-worker}

**Hinzugefügt in: v10.5.0**

- Erweitert: [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)

Die `Worker`-Klasse repräsentiert einen unabhängigen JavaScript-Ausführungs-Thread. Die meisten Node.js-APIs sind darin verfügbar.

Bemerkenswerte Unterschiede innerhalb einer Worker-Umgebung sind:

- Die Streams [`process.stdin`](/de/nodejs/api/process#processstdin), [`process.stdout`](/de/nodejs/api/process#processstderr) und [`process.stderr`](/de/nodejs/api/process#processstderr) können vom übergeordneten Thread umgeleitet werden.
- Die Eigenschaft [`require('node:worker_threads').isMainThread`](/de/nodejs/api/worker_threads#workerismainthread) ist auf `false` gesetzt.
- Der Nachrichtenport [`require('node:worker_threads').parentPort`](/de/nodejs/api/worker_threads#workerparentport) ist verfügbar.
- [`process.exit()`](/de/nodejs/api/process#processexitcode) stoppt nicht das gesamte Programm, sondern nur den einzelnen Thread, und [`process.abort()`](/de/nodejs/api/process#processabort) ist nicht verfügbar.
- [`process.chdir()`](/de/nodejs/api/process#processchdirdirectory) und `process`-Methoden, die Gruppen- oder Benutzer-IDs setzen, sind nicht verfügbar.
- [`process.env`](/de/nodejs/api/process#processenv) ist eine Kopie der Umgebungsvariablen des übergeordneten Threads, sofern nicht anders angegeben. Änderungen an einer Kopie sind in anderen Threads nicht sichtbar und für native Add-ons nicht sichtbar (es sei denn, [`worker.SHARE_ENV`](/de/nodejs/api/worker_threads#workershare_env) wird als `env`-Option an den [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Konstruktor übergeben). Unter Windows verhält sich eine Kopie der Umgebungsvariablen im Gegensatz zum Hauptthread Groß- und Kleinschreibung.
- [`process.title`](/de/nodejs/api/process#processtitle) kann nicht geändert werden.
- Signale werden nicht über [`process.on('...')`](/de/nodejs/api/process#signal-events) geliefert.
- Die Ausführung kann jederzeit gestoppt werden, wenn [`worker.terminate()`](/de/nodejs/api/worker_threads#workerterminate) aufgerufen wird.
- IPC-Kanäle von übergeordneten Prozessen sind nicht zugänglich.
- Das Modul [`trace_events`](/de/nodejs/api/tracing) wird nicht unterstützt.
- Native Add-ons können nur dann aus mehreren Threads geladen werden, wenn sie [bestimmte Bedingungen](/de/nodejs/api/addons#worker-support) erfüllen.

Das Erstellen von `Worker`-Instanzen innerhalb anderer `Worker` ist möglich.

Wie [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) und das [`node:cluster`-Modul](/de/nodejs/api/cluster) kann eine bidirektionale Kommunikation durch Inter-Thread-Nachrichtenübermittlung erreicht werden. Intern verfügt ein `Worker` über ein eingebautes Paar von [`MessagePort`](/de/nodejs/api/worker_threads#class-messageport)s, die bereits miteinander verbunden sind, wenn der `Worker` erstellt wird. Während das `MessagePort`-Objekt auf der übergeordneten Seite nicht direkt verfügbar gemacht wird, werden seine Funktionalitäten über [`worker.postMessage()`](/de/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) und das [`worker.on('message')`](/de/nodejs/api/worker_threads#event-message_1)-Ereignis auf dem `Worker`-Objekt für den übergeordneten Thread verfügbar gemacht.

Um benutzerdefinierte Messaging-Kanäle zu erstellen (was gegenüber der Verwendung des standardmäßigen globalen Kanals empfohlen wird, da dies die Trennung von Belangen erleichtert), können Benutzer ein `MessageChannel`-Objekt in einem der beiden Threads erstellen und einen der `MessagePort`s auf diesem `MessageChannel` über einen bereits vorhandenen Kanal, z. B. den globalen, an den anderen Thread übergeben.

Siehe [`port.postMessage()`](/de/nodejs/api/worker_threads#portpostmessagevalue-transferlist) für weitere Informationen darüber, wie Nachrichten übergeben werden und welche Art von JavaScript-Werten erfolgreich über die Thread-Grenze transportiert werden können.

```js [ESM]
const assert = require('node:assert');
const {
  Worker, MessageChannel, MessagePort, isMainThread, parentPort,
} = require('node:worker_threads');
if (isMainThread) {
  const worker = new Worker(__filename);
  const subChannel = new MessageChannel();
  worker.postMessage({ hereIsYourPort: subChannel.port1 }, [subChannel.port1]);
  subChannel.port2.on('message', (value) => {
    console.log('received:', value);
  });
} else {
  parentPort.once('message', (value) => {
    assert(value.hereIsYourPort instanceof MessagePort);
    value.hereIsYourPort.postMessage('the worker is sending this');
    value.hereIsYourPort.close();
  });
}
```

### `new Worker(filename[, options])` {#new-workerfilename-options}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v19.8.0, v18.16.0 | Unterstützung für die Option `name` hinzugefügt, die das Hinzufügen eines Namens zum Worker-Titel zur Fehlersuche ermöglicht. |
| v14.9.0 | Der Parameter `filename` kann ein WHATWG `URL`-Objekt mit dem `data:`-Protokoll sein. |
| v14.9.0 | Die Option `trackUnmanagedFds` wurde standardmäßig auf `true` gesetzt. |
| v14.6.0, v12.19.0 | Die Option `trackUnmanagedFds` wurde eingeführt. |
| v13.13.0, v12.17.0 | Die Option `transferList` wurde eingeführt. |
| v13.12.0, v12.17.0 | Der Parameter `filename` kann ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v13.4.0, v12.16.0 | Die Option `argv` wurde eingeführt. |
| v13.2.0, v12.16.0 | Die Option `resourceLimits` wurde eingeführt. |
| v10.5.0 | Hinzugefügt in: v10.5.0 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Der Pfad zum Hauptskript oder -modul des Workers. Muss entweder ein absoluter Pfad oder ein relativer Pfad (d. h. relativ zum aktuellen Arbeitsverzeichnis) sein, der mit `./` oder `../` beginnt, oder ein WHATWG `URL`-Objekt mit dem `file:`- oder `data:`-Protokoll. Bei Verwendung einer [`data:`-URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) werden die Daten basierend auf dem MIME-Typ mit dem [ECMAScript-Modul-Loader](/de/nodejs/api/esm#data-imports) interpretiert. Wenn `options.eval` `true` ist, ist dies ein String, der JavaScript-Code enthält, und kein Pfad.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `argv` [\<any[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Liste der Argumente, die in Strings umgewandelt und an `process.argv` im Worker angehängt werden. Dies ähnelt im Wesentlichen `workerData`, aber die Werte sind im globalen `process.argv` verfügbar, als ob sie als CLI-Optionen an das Skript übergeben würden.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Falls gesetzt, gibt dies den Anfangswert von `process.env` innerhalb des Worker-Threads an. Als Sonderwert kann [`worker.SHARE_ENV`](/de/nodejs/api/worker_threads#workershare_env) verwendet werden, um anzugeben, dass der übergeordnete Thread und der untergeordnete Thread ihre Umgebungsvariablen gemeinsam nutzen sollen; in diesem Fall wirken sich Änderungen am `process.env`-Objekt eines Threads auch auf den anderen Thread aus. **Standard:** `process.env`.
    - `eval` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true` und das erste Argument ein `string` ist, interpretiere das erste Argument des Konstruktors als ein Skript, das ausgeführt wird, sobald der Worker online ist.
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Liste der Node-CLI-Optionen, die an den Worker übergeben werden. V8-Optionen (wie `--max-old-space-size`) und Optionen, die den Prozess beeinflussen (wie `--title`), werden nicht unterstützt. Falls gesetzt, wird dies als [`process.execArgv`](/de/nodejs/api/process#processexecargv) innerhalb des Workers bereitgestellt. Standardmäßig werden Optionen vom übergeordneten Thread übernommen.
    - `stdin` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn dies auf `true` gesetzt ist, bietet `worker.stdin` einen beschreibbaren Stream, dessen Inhalt als `process.stdin` innerhalb des Workers erscheint. Standardmäßig werden keine Daten bereitgestellt.
    - `stdout` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn dies auf `true` gesetzt ist, wird `worker.stdout` nicht automatisch an `process.stdout` im übergeordneten Element weitergeleitet.
    - `stderr` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn dies auf `true` gesetzt ist, wird `worker.stderr` nicht automatisch an `process.stderr` im übergeordneten Element weitergeleitet.
    - `workerData` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Ein beliebiger JavaScript-Wert, der geklont und als [`require('node:worker_threads').workerData`](/de/nodejs/api/worker_threads#workerworkerdata) verfügbar gemacht wird. Das Klonen erfolgt wie im [HTML-Algorithmus zum strukturierten Klonen](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) beschrieben, und es wird ein Fehler ausgelöst, wenn das Objekt nicht geklont werden kann (z. B. weil es `function`s enthält).
    - `trackUnmanagedFds` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn dies auf `true` gesetzt ist, verfolgt der Worker rohe Dateideskriptoren, die über [`fs.open()`](/de/nodejs/api/fs#fsopenpath-flags-mode-callback) und [`fs.close()`](/de/nodejs/api/fs#fsclosefd-callback) verwaltet werden, und schließt sie, wenn der Worker beendet wird, ähnlich wie andere Ressourcen wie Netzwerk-Sockets oder Dateideskriptoren, die über die [`FileHandle`](/de/nodejs/api/fs#class-filehandle)-API verwaltet werden. Diese Option wird automatisch von allen verschachtelten `Worker`s geerbt. **Standard:** `true`.
    - `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Wenn ein oder mehrere `MessagePort`-ähnliche Objekte in `workerData` übergeben werden, ist eine `transferList` für diese Elemente erforderlich, andernfalls wird [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/de/nodejs/api/errors#err_missing_message_port_in_transfer_list) ausgelöst. Weitere Informationen finden Sie unter [`port.postMessage()`](/de/nodejs/api/worker_threads#portpostmessagevalue-transferlist).
    - `resourceLimits` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein optionales Set von Ressourcenbeschränkungen für die neue JS-Engine-Instanz. Das Erreichen dieser Beschränkungen führt zur Beendigung der `Worker`-Instanz. Diese Beschränkungen betreffen nur die JS-Engine und keine externen Daten, einschließlich keiner `ArrayBuffer`s. Selbst wenn diese Beschränkungen festgelegt sind, kann der Prozess dennoch abgebrochen werden, wenn er auf eine globale Situation mit unzureichendem Speicher stößt.
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die maximale Größe des Haupthaufens in MB. Wenn das Befehlszeilenargument [`--max-old-space-size`](/de/nodejs/api/cli#--max-old-space-sizesize-in-mib) festgelegt ist, überschreibt es diese Einstellung.
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die maximale Größe eines Heap-Bereichs für kürzlich erstellte Objekte. Wenn das Befehlszeilenargument [`--max-semi-space-size`](/de/nodejs/api/cli#--max-semi-space-sizesize-in-mib) festgelegt ist, überschreibt es diese Einstellung.
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Größe eines vorab zugewiesenen Speicherbereichs, der für generierten Code verwendet wird.
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die standardmäßige maximale Stackgröße für den Thread. Kleine Werte können zu unbrauchbaren Worker-Instanzen führen. **Standard:** `4`.

    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein optionaler `name`, der dem Worker-Titel zu Debugging-/Identifizierungszwecken angehängt werden soll, wodurch der endgültige Titel als `[worker ${id}] ${name}` lautet. **Standard:** `''`.


### Ereignis: `'error'` {#event-error}

**Hinzugefügt in: v10.5.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Das `'error'`-Ereignis wird ausgelöst, wenn der Worker-Thread eine unbehandelte Ausnahme auslöst. In diesem Fall wird der Worker beendet.

### Ereignis: `'exit'` {#event-exit}

**Hinzugefügt in: v10.5.0**

- `exitCode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Das `'exit'`-Ereignis wird ausgelöst, sobald der Worker angehalten wurde. Wenn der Worker durch Aufrufen von [`process.exit()`](/de/nodejs/api/process#processexitcode) beendet wurde, ist der `exitCode`-Parameter der übergebene Exit-Code. Wenn der Worker beendet wurde, ist der `exitCode`-Parameter `1`.

Dies ist das letzte Ereignis, das von einer `Worker`-Instanz ausgegeben wird.

### Ereignis: `'message'` {#event-message_1}

**Hinzugefügt in: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Der übertragene Wert

Das `'message'`-Ereignis wird ausgelöst, wenn der Worker-Thread [`require('node:worker_threads').parentPort.postMessage()`](/de/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) aufgerufen hat. Weitere Informationen finden Sie im Ereignis [`port.on('message')`](/de/nodejs/api/worker_threads#event-message).

Alle Nachrichten, die vom Worker-Thread gesendet werden, werden ausgegeben, bevor das Ereignis [`'exit'` ](/de/nodejs/api/worker_threads#event-exit) für das `Worker`-Objekt ausgegeben wird.

### Ereignis: `'messageerror'` {#event-messageerror_1}

**Hinzugefügt in: v14.5.0, v12.19.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Ein Error-Objekt

Das `'messageerror'`-Ereignis wird ausgelöst, wenn die Deserialisierung einer Nachricht fehlgeschlagen ist.

### Ereignis: `'online'` {#event-online}

**Hinzugefügt in: v10.5.0**

Das `'online'`-Ereignis wird ausgelöst, wenn der Worker-Thread mit der Ausführung von JavaScript-Code begonnen hat.

### `worker.getHeapSnapshot([options])` {#workergetheapsnapshotoptions}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.1.0 | Unterstützung von Optionen zur Konfiguration des Heap-Snapshots. |
| v13.9.0, v12.17.0 | Hinzugefügt in: v13.9.0, v12.17.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exposeInternals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn true, werden Interna im Heap-Snapshot offengelegt. **Standard:** `false`.
    - `exposeNumericValues` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn true, werden numerische Werte in künstlichen Feldern offengelegt. **Standard:** `false`.

- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Ein Promise für einen lesbaren Stream, der einen V8-Heap-Snapshot enthält

Gibt einen lesbaren Stream für einen V8-Snapshot des aktuellen Zustands des Workers zurück. Weitere Informationen finden Sie unter [`v8.getHeapSnapshot()`](/de/nodejs/api/v8#v8getheapsnapshotoptions).

Wenn der Worker-Thread nicht mehr ausgeführt wird, was vor dem Auslösen des Ereignisses [`'exit'` ](/de/nodejs/api/worker_threads#event-exit) auftreten kann, wird das zurückgegebene `Promise` sofort mit einem [`ERR_WORKER_NOT_RUNNING`](/de/nodejs/api/errors#err_worker_not_running)-Fehler abgelehnt.


### `worker.performance` {#workerperformance}

**Hinzugefügt in: v15.1.0, v14.17.0, v12.22.0**

Ein Objekt, das verwendet werden kann, um Leistungsinformationen von einer Worker-Instanz abzufragen. Ähnlich wie [`perf_hooks.performance`](/de/nodejs/api/perf_hooks#perf_hooksperformance).

#### `performance.eventLoopUtilization([utilization1[, utilization2]])` {#performanceeventlooputilizationutilization1-utilization2}

**Hinzugefügt in: v15.1.0, v14.17.0, v12.22.0**

- `utilization1` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Das Ergebnis eines vorherigen Aufrufs von `eventLoopUtilization()`.
- `utilization2` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Das Ergebnis eines vorherigen Aufrufs von `eventLoopUtilization()` vor `utilization1`.
- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `active` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Der gleiche Aufruf wie [`perf_hooks` `eventLoopUtilization()`](/de/nodejs/api/perf_hooks#performanceeventlooputilizationutilization1-utilization2), mit dem Unterschied, dass die Werte der Worker-Instanz zurückgegeben werden.

Ein Unterschied besteht darin, dass das Bootstrapping in einem Worker, anders als im Haupt-Thread, innerhalb der Event-Loop erfolgt. Die Event-Loop-Auslastung ist also sofort verfügbar, sobald die Ausführung des Worker-Skripts beginnt.

Eine `idle`-Zeit, die sich nicht erhöht, bedeutet nicht, dass der Worker im Bootstrap stecken geblieben ist. Die folgenden Beispiele zeigen, wie die gesamte Lebensdauer des Workers nie `idle`-Zeit ansammelt, aber dennoch in der Lage ist, Nachrichten zu verarbeiten.

```js [ESM]
const { Worker, isMainThread, parentPort } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  setInterval(() => {
    worker.postMessage('hi');
    console.log(worker.performance.eventLoopUtilization());
  }, 100).unref();
  return;
}

parentPort.on('message', () => console.log('msg')).unref();
(function r(n) {
  if (--n < 0) return;
  const t = Date.now();
  while (Date.now() - t < 300);
  setImmediate(r, n);
})(10);
```
Die Event-Loop-Auslastung eines Workers ist erst verfügbar, nachdem das [`'online'` Event](/de/nodejs/api/worker_threads#event-online) ausgelöst wurde. Wenn sie davor oder nach dem [`'exit'` Event](/de/nodejs/api/worker_threads#event-exit) aufgerufen wird, haben alle Eigenschaften den Wert `0`.


### `worker.postMessage(value[, transferList])` {#workerpostmessagevalue-transferlist}

**Hinzugefügt in: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Sendet eine Nachricht an den Worker, die über [`require('node:worker_threads').parentPort.on('message')`](/de/nodejs/api/worker_threads#event-message) empfangen wird. Siehe [`port.postMessage()`](/de/nodejs/api/worker_threads#portpostmessagevalue-transferlist) für weitere Details.

### `worker.ref()` {#workerref}

**Hinzugefügt in: v10.5.0**

Das Gegenteil von `unref()`. Wenn `ref()` auf einem zuvor `unref()`-Worker aufgerufen wird, wird das Programm *nicht* beendet, wenn es der einzig aktive Handle ist (Standardverhalten). Wenn der Worker `ref()` ist, hat ein erneuter Aufruf von `ref()` keine Auswirkung.

### `worker.resourceLimits` {#workerresourcelimits_1}

**Hinzugefügt in: v13.2.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

Bietet die Menge an Ressourcenbeschränkungen der JS-Engine für diesen Worker-Thread. Wenn die Option `resourceLimits` an den [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Konstruktor übergeben wurde, stimmen diese mit seinen Werten überein.

Wenn der Worker angehalten wurde, ist der Rückgabewert ein leeres Objekt.

### `worker.stderr` {#workerstderr}

**Hinzugefügt in: v10.5.0**

- [\<stream.Readable\>](/de/nodejs/api/stream#class-streamreadable)

Dies ist ein lesbarer Stream, der Daten enthält, die in [`process.stderr`](/de/nodejs/api/process#processstderr) innerhalb des Worker-Threads geschrieben wurden. Wenn `stderr: true` nicht an den [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Konstruktor übergeben wurde, werden Daten in den [`process.stderr`](/de/nodejs/api/process#processstderr)-Stream des übergeordneten Threads geleitet.


### `worker.stdin` {#workerstdin}

**Hinzugefügt in: v10.5.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<stream.Writable\>](/de/nodejs/api/stream#class-streamwritable)

Wenn `stdin: true` an den [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Konstruktor übergeben wurde, ist dies ein beschreibbarer Stream. Die in diesen Stream geschriebenen Daten werden im Worker-Thread als [`process.stdin`](/de/nodejs/api/process#processstdin) verfügbar gemacht.

### `worker.stdout` {#workerstdout}

**Hinzugefügt in: v10.5.0**

- [\<stream.Readable\>](/de/nodejs/api/stream#class-streamreadable)

Dies ist ein lesbarer Stream, der Daten enthält, die innerhalb des Worker-Threads in [`process.stdout`](/de/nodejs/api/process#processstdout) geschrieben wurden. Wenn `stdout: true` nicht an den [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Konstruktor übergeben wurde, werden die Daten in den [`process.stdout`](/de/nodejs/api/process#processstdout)-Stream des Eltern-Threads geleitet.

### `worker.terminate()` {#workerterminate}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.5.0 | Diese Funktion gibt jetzt eine Promise zurück. Das Übergeben eines Callbacks ist veraltet und war bis zu dieser Version nutzlos, da der Worker tatsächlich synchron beendet wurde. Das Beenden ist jetzt ein vollständig asynchroner Vorgang. |
| v10.5.0 | Hinzugefügt in: v10.5.0 |
:::

- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Stoppt so schnell wie möglich die gesamte JavaScript-Ausführung im Worker-Thread. Gibt eine Promise für den Exit-Code zurück, die erfüllt wird, wenn das [`'exit'` event](/de/nodejs/api/worker_threads#event-exit) ausgelöst wird.

### `worker.threadId` {#workerthreadid_1}

**Hinzugefügt in: v10.5.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Eine ganzzahlige Kennung für den referenzierten Thread. Innerhalb des Worker-Threads ist sie als [`require('node:worker_threads').threadId`](/de/nodejs/api/worker_threads#workerthreadid) verfügbar. Dieser Wert ist für jede `Worker`-Instanz innerhalb eines einzelnen Prozesses eindeutig.

### `worker.unref()` {#workerunref}

**Hinzugefügt in: v10.5.0**

Das Aufrufen von `unref()` auf einem Worker ermöglicht es dem Thread, zu beenden, wenn dies der einzige aktive Handle im Ereignissystem ist. Wenn der Worker bereits `unref()`ed ist, hat das erneute Aufrufen von `unref()` keine Auswirkung.


## Hinweise {#notes}

### Synchrone Blockierung von stdio {#synchronous-blocking-of-stdio}

`Worker` verwenden Message Passing über [\<MessagePort\>](/de/nodejs/api/worker_threads#class-messageport), um Interaktionen mit `stdio` zu implementieren. Dies bedeutet, dass `stdio`-Ausgabe, die von einem `Worker` stammt, durch synchronen Code am empfangenden Ende blockiert werden kann, der die Node.js-Ereignisschleife blockiert.

::: code-group
```js [ESM]
import {
  Worker,
  isMainThread,
} from 'node:worker_threads';

if (isMainThread) {
  new Worker(new URL(import.meta.url));
  for (let n = 0; n < 1e10; n++) {
    // Looping to simulate work.
  }
} else {
  // This output will be blocked by the for loop in the main thread.
  console.log('foo');
}
```

```js [CJS]
'use strict';

const {
  Worker,
  isMainThread,
} = require('node:worker_threads');

if (isMainThread) {
  new Worker(__filename);
  for (let n = 0; n < 1e10; n++) {
    // Looping to simulate work.
  }
} else {
  // This output will be blocked by the for loop in the main thread.
  console.log('foo');
}
```
:::

### Starten von Worker-Threads aus Preload-Skripten {#launching-worker-threads-from-preload-scripts}

Seien Sie vorsichtig, wenn Sie Worker-Threads aus Preload-Skripten starten (Skripte, die mit dem Befehlszeilenparameter `-r` geladen und ausgeführt werden). Sofern die Option `execArgv` nicht explizit gesetzt ist, erben neue Worker-Threads automatisch die Befehlszeilenparameter des laufenden Prozesses und laden die gleichen Preload-Skripte wie der Haupt-Thread. Wenn das Preload-Skript bedingungslos einen Worker-Thread startet, erzeugt jeder gestartete Thread einen weiteren, bis die Anwendung abstürzt.

