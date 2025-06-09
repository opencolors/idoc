---
title: Dokumentation des Node.js Inspector Moduls
description: Das Node.js Inspector Modul bietet eine API zur Interaktion mit dem V8-Inspektor, die es Entwicklern ermöglicht, Node.js-Anwendungen durch Verbindung zum Inspektor-Protokoll zu debuggen.
head:
  - - meta
    - name: og:title
      content: Dokumentation des Node.js Inspector Moduls | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Das Node.js Inspector Modul bietet eine API zur Interaktion mit dem V8-Inspektor, die es Entwicklern ermöglicht, Node.js-Anwendungen durch Verbindung zum Inspektor-Protokoll zu debuggen.
  - - meta
    - name: twitter:title
      content: Dokumentation des Node.js Inspector Moduls | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Das Node.js Inspector Modul bietet eine API zur Interaktion mit dem V8-Inspektor, die es Entwicklern ermöglicht, Node.js-Anwendungen durch Verbindung zum Inspektor-Protokoll zu debuggen.
---


# Inspector {#inspector}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/inspector.js](https://github.com/nodejs/node/blob/v23.5.0/lib/inspector.js)

Das Modul `node:inspector` bietet eine API zur Interaktion mit dem V8 Inspector.

Der Zugriff erfolgt über:

::: code-group
```js [ESM]
import * as inspector from 'node:inspector/promises';
```

```js [CJS]
const inspector = require('node:inspector/promises');
```
:::

oder

::: code-group
```js [ESM]
import * as inspector from 'node:inspector';
```

```js [CJS]
const inspector = require('node:inspector');
```
:::

## Promises API {#promises-api}

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

**Hinzugefügt in: v19.0.0**

### Klasse: `inspector.Session` {#class-inspectorsession}

- Erweitert: [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)

Die `inspector.Session` wird verwendet, um Nachrichten an das V8 Inspector Back-End zu senden und Nachrichtenantworten und Benachrichtigungen zu empfangen.

#### `new inspector.Session()` {#new-inspectorsession}

**Hinzugefügt in: v8.0.0**

Erstellt eine neue Instanz der Klasse `inspector.Session`. Die Inspector-Sitzung muss über [`session.connect()`](/de/nodejs/api/inspector#sessionconnect) verbunden werden, bevor die Nachrichten an das Inspector-Backend gesendet werden können.

Wenn `Session` verwendet wird, wird das von der Console API ausgegebene Objekt erst freigegeben, wenn wir den Befehl `Runtime.DiscardConsoleEntries` manuell ausgeführt haben.

#### Ereignis: `'inspectorNotification'` {#event-inspectornotification}

**Hinzugefügt in: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Das Benachrichtigungsnachrichtenobjekt

Wird ausgegeben, wenn eine Benachrichtigung vom V8 Inspector empfangen wird.

```js [ESM]
session.on('inspectorNotification', (message) => console.log(message.method));
// Debugger.paused
// Debugger.resumed
```
Es ist auch möglich, nur Benachrichtigungen mit einer bestimmten Methode zu abonnieren:


#### Event: `&lt;inspector-protocol-method&gt;`; {#event-&lt;inspector-protocol-method&gt;;}

**Hinzugefügt in: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Das Benachrichtigungsnachrichtenobjekt

Wird ausgelöst, wenn eine Inspector-Benachrichtigung empfangen wird, deren Methodenfeld auf den Wert `\<inspector-protocol-method\>` gesetzt ist.

Der folgende Codeausschnitt installiert einen Listener auf dem [`'Debugger.paused'`](https://chromedevtools.github.io/devtools-protocol/v8/Debugger#event-paused)-Ereignis und gibt den Grund für die Programmaussetzung aus, wann immer die Programmausführung unterbrochen wird (z. B. durch Breakpoints):

```js [ESM]
session.on('Debugger.paused', ({ params }) => {
  console.log(params.hitBreakpoints);
});
// [ '/the/file/that/has/the/breakpoint.js:11:0' ]
```
#### `session.connect()` {#sessionconnect}

**Hinzugefügt in: v8.0.0**

Verbindet eine Sitzung mit dem Inspector-Backend.

#### `session.connectToMainThread()` {#sessionconnecttomainthread}

**Hinzugefügt in: v12.11.0**

Verbindet eine Sitzung mit dem Inspector-Backend des Hauptthreads. Es wird eine Ausnahme ausgelöst, wenn diese API nicht in einem Worker-Thread aufgerufen wurde.

#### `session.disconnect()` {#sessiondisconnect}

**Hinzugefügt in: v8.0.0**

Schließt die Sitzung sofort. Alle ausstehenden Nachrichten-Callbacks werden mit einem Fehler aufgerufen. [`session.connect()`](/de/nodejs/api/inspector#sessionconnect) muss aufgerufen werden, um wieder Nachrichten senden zu können. Eine wiederverbundene Sitzung verliert den gesamten Inspector-Zustand, wie z. B. aktivierte Agents oder konfigurierte Breakpoints.

#### `session.post(method[, params])` {#sessionpostmethod-params}

**Hinzugefügt in: v19.0.0**

- `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Rückgabe: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Sendet eine Nachricht an das Inspector-Backend.

```js [ESM]
import { Session } from 'node:inspector/promises';
try {
  const session = new Session();
  session.connect();
  const result = await session.post('Runtime.evaluate', { expression: '2 + 2' });
  console.log(result);
} catch (error) {
  console.error(error);
}
// Ausgabe: { result: { type: 'number', value: 4, description: '4' } }
```
Die neueste Version des V8 Inspector-Protokolls wird im [Chrome DevTools Protocol Viewer](https://chromedevtools.github.io/devtools-protocol/v8/) veröffentlicht.

Node.js Inspector unterstützt alle Chrome DevTools Protocol-Domänen, die von V8 deklariert werden. Die Chrome DevTools Protocol-Domäne bietet eine Schnittstelle zur Interaktion mit einem der Runtime-Agents, die verwendet werden, um den Anwendungsstatus zu inspizieren und auf die Laufzeitereignisse zu lauschen.


#### Beispielhafte Verwendung {#example-usage}

Abgesehen vom Debugger sind verschiedene V8-Profiler über das DevTools-Protokoll verfügbar.

##### CPU-Profiler {#cpu-profiler}

Hier ist ein Beispiel, das die Verwendung des [CPU-Profilers](https://chromedevtools.github.io/devtools-protocol/v8/Profiler) zeigt:

```js [ESM]
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();
session.connect();

await session.post('Profiler.enable');
await session.post('Profiler.start');
// Hier die Business-Logik unter Messung aufrufen...

// Einige Zeit später...
const { profile } = await session.post('Profiler.stop');

// Profil auf die Festplatte schreiben, hochladen usw.
fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
```
##### Heap-Profiler {#heap-profiler}

Hier ist ein Beispiel, das die Verwendung des [Heap-Profilers](https://chromedevtools.github.io/devtools-protocol/v8/HeapProfiler) zeigt:

```js [ESM]
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

const result = await session.post('HeapProfiler.takeHeapSnapshot', null);
console.log('HeapProfiler.takeHeapSnapshot done:', result);
session.disconnect();
fs.closeSync(fd);
```
## Callback-API {#callback-api}

### Klasse: `inspector.Session` {#class-inspectorsession_1}

- Erweitert: [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)

Die `inspector.Session` wird verwendet, um Nachrichten an das V8-Inspektor-Backend zu senden und Nachrichtenantworten und Benachrichtigungen zu empfangen.

#### `new inspector.Session()` {#new-inspectorsession_1}

**Hinzugefügt in: v8.0.0**

Erstellt eine neue Instanz der Klasse `inspector.Session`. Die Inspektorsitzung muss über [`session.connect()`](/de/nodejs/api/inspector#sessionconnect) verbunden werden, bevor die Nachrichten an das Inspektor-Backend gesendet werden können.

Wenn `Session` verwendet wird, wird das von der Konsolen-API ausgegebene Objekt erst freigegeben, wenn wir manuell den Befehl `Runtime.DiscardConsoleEntries` ausgeführt haben.


#### Event: `'inspectorNotification'` {#event-inspectornotification_1}

**Hinzugefügt in: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Das Benachrichtigungsobjekt

Wird ausgelöst, wenn eine Benachrichtigung vom V8 Inspector empfangen wird.

```js [ESM]
session.on('inspectorNotification', (message) => console.log(message.method));
// Debugger.paused
// Debugger.resumed
```
Es ist auch möglich, nur Benachrichtigungen mit einer bestimmten Methode zu abonnieren:

#### Event: `&lt;inspector-protocol-method&gt;`; {#event-&lt;inspector-protocol-method&gt;;_1}

**Hinzugefügt in: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Das Benachrichtigungsobjekt

Wird ausgelöst, wenn eine Inspector-Benachrichtigung empfangen wird, deren Method-Feld auf den Wert `\<inspector-protocol-method\>` gesetzt ist.

Das folgende Code-Snippet installiert einen Listener für das [`'Debugger.paused'`](https://chromedevtools.github.io/devtools-protocol/v8/Debugger#event-paused) Ereignis und gibt den Grund für die Programmunterbrechung aus, wenn die Programmausführung unterbrochen wird (z. B. durch Breakpoints):

```js [ESM]
session.on('Debugger.paused', ({ params }) => {
  console.log(params.hitBreakpoints);
});
// [ '/the/file/that/has/the/breakpoint.js:11:0' ]
```
#### `session.connect()` {#sessionconnect_1}

**Hinzugefügt in: v8.0.0**

Verbindet eine Sitzung mit dem Inspector-Backend.

#### `session.connectToMainThread()` {#sessionconnecttomainthread_1}

**Hinzugefügt in: v12.11.0**

Verbindet eine Sitzung mit dem Haupt-Thread Inspector Backend. Eine Ausnahme wird ausgelöst, wenn diese API nicht auf einem Worker-Thread aufgerufen wurde.

#### `session.disconnect()` {#sessiondisconnect_1}

**Hinzugefügt in: v8.0.0**

Schließt die Sitzung sofort. Alle ausstehenden Nachrichten-Callbacks werden mit einem Fehler aufgerufen. [`session.connect()`](/de/nodejs/api/inspector#sessionconnect) muss aufgerufen werden, um wieder Nachrichten senden zu können. Eine wiederverbundene Sitzung verliert alle Inspector-Zustände, wie z. B. aktivierte Agents oder konfigurierte Breakpoints.

#### `session.post(method[, params][, callback])` {#sessionpostmethod-params-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v8.0.0 | Hinzugefügt in: v8.0.0 |
:::

- `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Sendet eine Nachricht an das Inspector-Backend. `callback` wird benachrichtigt, wenn eine Antwort empfangen wird. `callback` ist eine Funktion, die zwei optionale Argumente akzeptiert: error und nachrichtenspezifisches Ergebnis.

```js [ESM]
session.post('Runtime.evaluate', { expression: '2 + 2' },
             (error, { result }) => console.log(result));
// Output: { type: 'number', value: 4, description: '4' }
```
Die neueste Version des V8 Inspector-Protokolls ist im [Chrome DevTools Protocol Viewer](https://chromedevtools.github.io/devtools-protocol/v8/) veröffentlicht.

Der Node.js Inspector unterstützt alle Chrome DevTools Protocol-Domänen, die von V8 deklariert werden. Die Chrome DevTools Protocol-Domäne bietet eine Schnittstelle zur Interaktion mit einem der Runtime-Agents, die verwendet werden, um den Anwendungsstatus zu inspizieren und auf die Runtime-Ereignisse zu hören.

Sie können `reportProgress` nicht auf `true` setzen, wenn Sie den Befehl `HeapProfiler.takeHeapSnapshot` oder `HeapProfiler.stopTrackingHeapObjects` an V8 senden.


#### Beispielhafte Verwendung {#example-usage_1}

Abgesehen vom Debugger stehen über das DevTools-Protokoll verschiedene V8-Profiler zur Verfügung.

##### CPU-Profiler {#cpu-profiler_1}

Hier ist ein Beispiel, das die Verwendung des [CPU-Profilers](https://chromedevtools.github.io/devtools-protocol/v8/Profiler) zeigt:

```js [ESM]
const inspector = require('node:inspector');
const fs = require('node:fs');
const session = new inspector.Session();
session.connect();

session.post('Profiler.enable', () => {
  session.post('Profiler.start', () => {
    // Hier die Geschäftslogik unter Messung aufrufen...

    // Etwas später...
    session.post('Profiler.stop', (err, { profile }) => {
      // Profil auf Festplatte schreiben, hochladen usw.
      if (!err) {
        fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
      }
    });
  });
});
```
##### Heap-Profiler {#heap-profiler_1}

Hier ist ein Beispiel, das die Verwendung des [Heap-Profilers](https://chromedevtools.github.io/devtools-protocol/v8/HeapProfiler) zeigt:

```js [ESM]
const inspector = require('node:inspector');
const fs = require('node:fs');
const session = new inspector.Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

session.post('HeapProfiler.takeHeapSnapshot', null, (err, r) => {
  console.log('HeapProfiler.takeHeapSnapshot done:', err, r);
  session.disconnect();
  fs.closeSync(fd);
});
```
## Allgemeine Objekte {#common-objects}

### `inspector.close()` {#inspectorclose}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.10.0 | Die API wird in den Worker-Threads verfügbar gemacht. |
| v9.0.0 | Hinzugefügt in: v9.0.0 |
:::

Versucht, alle verbleibenden Verbindungen zu schließen und blockiert die Ereignisschleife, bis alle geschlossen sind. Sobald alle Verbindungen geschlossen sind, wird der Inspector deaktiviert.

### `inspector.console` {#inspectorconsole}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein Objekt zum Senden von Nachrichten an die Remote-Inspector-Konsole.

```js [ESM]
require('node:inspector').console.log('a message');
```
Die Inspector-Konsole hat keine API-Parität mit der Node.js-Konsole.


### `inspector.open([port[, host[, wait]]])` {#inspectoropenport-host-wait}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.6.0 | inspector.open() gibt jetzt ein `Disposable`-Objekt zurück. |
:::

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Port, auf dem auf Inspector-Verbindungen gewartet werden soll. Optional. **Standard:** was in der CLI angegeben wurde.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host, auf dem auf Inspector-Verbindungen gewartet werden soll. Optional. **Standard:** was in der CLI angegeben wurde.
- `wait` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Blockiert, bis ein Client verbunden ist. Optional. **Standard:** `false`.
- Gibt zurück: [\<Disposable\>](https://tc39.es/proposal-explicit-resource-management/#sec-disposable-interface) Ein Disposable, das [`inspector.close()`](/de/nodejs/api/inspector#inspectorclose) aufruft.

Aktiviert den Inspector auf Host und Port. Äquivalent zu `node --inspect=[[host:]port]`, kann aber programmgesteuert erfolgen, nachdem Node gestartet wurde.

Wenn wait `true` ist, wird blockiert, bis ein Client sich mit dem Inspect-Port verbunden hat und die Ablaufsteuerung an den Debugger-Client übergeben wurde.

Siehe die [Sicherheitswarnung](/de/nodejs/api/cli#warning-binding-inspector-to-a-public-ipport-combination-is-insecure) bezüglich der Verwendung des `host`-Parameters.

### `inspector.url()` {#inspectorurl}

- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Gibt die URL des aktiven Inspectors zurück oder `undefined`, wenn kein Inspector vorhanden ist.

```bash [BASH]
$ node --inspect -p 'inspector.url()'
Debugger listening on ws://127.0.0.1:9229/166e272e-7a30-4d09-97ce-f1c012b43c34
For help, see: https://nodejs.org/en/docs/inspector
ws://127.0.0.1:9229/166e272e-7a30-4d09-97ce-f1c012b43c34

$ node --inspect=localhost:3000 -p 'inspector.url()'
Debugger listening on ws://localhost:3000/51cf8d0e-3c36-4c59-8efd-54519839e56a
For help, see: https://nodejs.org/en/docs/inspector
ws://localhost:3000/51cf8d0e-3c36-4c59-8efd-54519839e56a

$ node -p 'inspector.url()'
undefined
```

### `inspector.waitForDebugger()` {#inspectorwaitfordebugger}

**Hinzugefügt in: v12.7.0**

Blockiert, bis ein Client (bestehender oder später verbundener) den Befehl `Runtime.runIfWaitingForDebugger` gesendet hat.

Es wird eine Ausnahme ausgelöst, wenn kein aktiver Inspektor vorhanden ist.

## Integration mit DevTools {#integration-with-devtools}

Das `node:inspector`-Modul bietet eine API zur Integration mit DevTools, die das Chrome DevTools Protocol unterstützen. DevTools-Frontends, die mit einer laufenden Node.js-Instanz verbunden sind, können Protokollereignisse erfassen, die von der Instanz ausgegeben werden, und sie entsprechend anzeigen, um das Debugging zu erleichtern. Die folgenden Methoden senden ein Protokollereignis an alle verbundenen Frontends. Die an die Methoden übergebenen `params` können optional sein, abhängig vom Protokoll.

```js [ESM]
// Das Ereignis `Network.requestWillBeSent` wird ausgelöst.
inspector.Network.requestWillBeSent({
  requestId: 'request-id-1',
  timestamp: Date.now() / 1000,
  wallTime: Date.now(),
  request: {
    url: 'https://nodejs.org/en',
    method: 'GET',
  },
});
```
### `inspector.Network.requestWillBeSent([params])` {#inspectornetworkrequestwillbesentparams}

**Hinzugefügt in: v22.6.0, v20.18.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Diese Funktion ist nur verfügbar, wenn das Flag `--experimental-network-inspection` aktiviert ist.

Sendet das Ereignis `Network.requestWillBeSent` an verbundene Frontends. Dieses Ereignis zeigt an, dass die Anwendung im Begriff ist, eine HTTP-Anforderung zu senden.

### `inspector.Network.responseReceived([params])` {#inspectornetworkresponsereceivedparams}

**Hinzugefügt in: v22.6.0, v20.18.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Diese Funktion ist nur verfügbar, wenn das Flag `--experimental-network-inspection` aktiviert ist.

Sendet das Ereignis `Network.responseReceived` an verbundene Frontends. Dieses Ereignis zeigt an, dass eine HTTP-Antwort verfügbar ist.


### `inspector.Network.loadingFinished([params])` {#inspectornetworkloadingfinishedparams}

**Hinzugefügt in: v22.6.0, v20.18.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Dieses Feature ist nur mit aktiviertem `--experimental-network-inspection` Flag verfügbar.

Sendet das `Network.loadingFinished` Event an verbundene Frontends. Dieses Event zeigt an, dass das Laden einer HTTP-Anfrage abgeschlossen ist.

### `inspector.Network.loadingFailed([params])` {#inspectornetworkloadingfailedparams}

**Hinzugefügt in: v22.7.0, v20.18.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Dieses Feature ist nur mit aktiviertem `--experimental-network-inspection` Flag verfügbar.

Sendet das `Network.loadingFailed` Event an verbundene Frontends. Dieses Event zeigt an, dass das Laden einer HTTP-Anfrage fehlgeschlagen ist.

## Unterstützung von Haltepunkten {#support-of-breakpoints}

Die Chrome DevTools Protokoll [`Debugger` Domain](https://chromedevtools.github.io/devtools-protocol/v8/Debugger) erlaubt einer `inspector.Session`, sich an ein Programm anzuhängen und Haltepunkte zu setzen, um durch den Code zu gehen.

Allerdings sollte das Setzen von Haltepunkten mit einer Single-Thread `inspector.Session`, die über [`session.connect()`](/de/nodejs/api/inspector#sessionconnect) verbunden ist, vermieden werden, da das Programm, an das angehängt und pausiert wird, genau der Debugger selbst ist. Versuchen Sie stattdessen, sich über [`session.connectToMainThread()`](/de/nodejs/api/inspector#sessionconnecttomainthread) mit dem Haupt-Thread zu verbinden und Haltepunkte in einem Worker-Thread zu setzen, oder verbinden Sie sich mit einem [Debugger](/de/nodejs/api/debugger)-Programm über eine WebSocket-Verbindung.

