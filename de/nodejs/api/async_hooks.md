---
title: Node.js Dokumentation - Asynchrone Haken
description: Erkunden Sie die API für asynchrone Haken in Node.js, die eine Möglichkeit bietet, die Lebensdauer asynchroner Ressourcen in Node.js-Anwendungen zu verfolgen.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - Asynchrone Haken | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erkunden Sie die API für asynchrone Haken in Node.js, die eine Möglichkeit bietet, die Lebensdauer asynchroner Ressourcen in Node.js-Anwendungen zu verfolgen.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - Asynchrone Haken | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erkunden Sie die API für asynchrone Haken in Node.js, die eine Möglichkeit bietet, die Lebensdauer asynchroner Ressourcen in Node.js-Anwendungen zu verfolgen.
---


# Async Hooks {#async-hooks}

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell. Bitte migrieren Sie von dieser API weg, wenn Sie können. Wir empfehlen die Verwendung der APIs [`createHook`](/de/nodejs/api/async_hooks#async_hookscreatehookcallbacks), [`AsyncHook`](/de/nodejs/api/async_hooks#class-asynchook) und [`executionAsyncResource`](/de/nodejs/api/async_hooks#async_hooksexecutionasyncresource) nicht, da sie Usability-Probleme, Sicherheitsrisiken und Auswirkungen auf die Leistung aufweisen. Anwendungsfälle zur Verfolgung von Async-Kontexten werden besser von der stabilen API [`AsyncLocalStorage`](/de/nodejs/api/async_context#class-asynclocalstorage) bedient. Wenn Sie einen Anwendungsfall für `createHook`, `AsyncHook` oder `executionAsyncResource` haben, der über die Kontextverfolgungsanforderungen hinausgeht, die von [`AsyncLocalStorage`](/de/nodejs/api/async_context#class-asynclocalstorage) oder Diagnosedaten gelöst werden, die derzeit von [Diagnostics Channel](/de/nodejs/api/diagnostics_channel) bereitgestellt werden, öffnen Sie bitte ein Issue unter [https://github.com/nodejs/node/issues](https://github.com/nodejs/node/issues) und beschreiben Sie Ihren Anwendungsfall, damit wir eine zweckmäßigere API erstellen können.
:::

**Quellcode:** [lib/async_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/async_hooks.js)

Wir raten dringend von der Verwendung der `async_hooks`-API ab. Andere APIs, die die meisten ihrer Anwendungsfälle abdecken können, sind:

- [`AsyncLocalStorage`](/de/nodejs/api/async_context#class-asynclocalstorage) verfolgt den Async-Kontext
- [`process.getActiveResourcesInfo()`](/de/nodejs/api/process#processgetactiveresourcesinfo) verfolgt aktive Ressourcen

Das Modul `node:async_hooks` bietet eine API zur Verfolgung asynchroner Ressourcen. Es kann wie folgt aufgerufen werden:

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';
```

```js [CJS]
const async_hooks = require('node:async_hooks');
```
:::

## Terminologie {#terminology}

Eine asynchrone Ressource stellt ein Objekt mit einem zugehörigen Callback dar. Dieser Callback kann mehrmals aufgerufen werden, wie z. B. das Ereignis `'connection'` in `net.createServer()` oder nur einmal wie in `fs.open()`. Eine Ressource kann auch geschlossen werden, bevor der Callback aufgerufen wird. `AsyncHook` unterscheidet nicht explizit zwischen diesen verschiedenen Fällen, sondern stellt sie als das abstrakte Konzept dar, das eine Ressource ist.

Wenn [`Worker`](/de/nodejs/api/worker_threads#class-worker) verwendet werden, hat jeder Thread eine unabhängige `async_hooks`-Schnittstelle, und jeder Thread verwendet einen neuen Satz von Async-IDs.


## Übersicht {#overview}

Es folgt ein einfacher Überblick über die öffentliche API.

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';

// Gibt die ID des aktuellen Ausführungskontexts zurück.
const eid = async_hooks.executionAsyncId();

// Gibt die ID des Handles zurück, das für das Auslösen des Callbacks des
// aktuellen Ausführungsbereichs verantwortlich ist.
const tid = async_hooks.triggerAsyncId();

// Erstellt eine neue AsyncHook-Instanz. Alle diese Callbacks sind optional.
const asyncHook =
    async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// Erlaubt, dass Callbacks dieser AsyncHook-Instanz aufgerufen werden. Dies ist keine implizite
// Aktion nach dem Ausführen des Konstruktors und muss explizit ausgeführt werden, um mit der
// Ausführung von Callbacks zu beginnen.
asyncHook.enable();

// Deaktiviert das Abhören neuer asynchroner Ereignisse.
asyncHook.disable();

//
// Im Folgenden sind die Callbacks aufgeführt, die an createHook() übergeben werden können.
//

// init() wird während der Objekterstellung aufgerufen. Die Ressource hat die
// Erstellung möglicherweise noch nicht abgeschlossen, wenn dieser Callback ausgeführt wird. Daher sind möglicherweise nicht alle Felder der
// Ressource, auf die von "asyncId" verwiesen wird, ausgefüllt.
function init(asyncId, type, triggerAsyncId, resource) { }

// before() wird aufgerufen, kurz bevor der Callback der Ressource aufgerufen wird. Er kann
// 0-N Mal für Handles (wie TCPWrap) aufgerufen werden und wird genau 1
// Mal für Anforderungen (wie FSReqCallback) aufgerufen.
function before(asyncId) { }

// after() wird aufgerufen, kurz nachdem der Callback der Ressource abgeschlossen ist.
function after(asyncId) { }

// destroy() wird aufgerufen, wenn die Ressource zerstört wird.
function destroy(asyncId) { }

// promiseResolve() wird nur für Promise-Ressourcen aufgerufen, wenn die
// resolve()-Funktion, die an den Promise-Konstruktor übergeben wird, aufgerufen wird
// (entweder direkt oder durch andere Mittel zur Auflösung eines Promise).
function promiseResolve(asyncId) { }
```

```js [CJS]
const async_hooks = require('node:async_hooks');

// Gibt die ID des aktuellen Ausführungskontexts zurück.
const eid = async_hooks.executionAsyncId();

// Gibt die ID des Handles zurück, das für das Auslösen des Callbacks des
// aktuellen Ausführungsbereichs verantwortlich ist.
const tid = async_hooks.triggerAsyncId();

// Erstellt eine neue AsyncHook-Instanz. Alle diese Callbacks sind optional.
const asyncHook =
    async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// Erlaubt, dass Callbacks dieser AsyncHook-Instanz aufgerufen werden. Dies ist keine implizite
// Aktion nach dem Ausführen des Konstruktors und muss explizit ausgeführt werden, um mit der
// Ausführung von Callbacks zu beginnen.
asyncHook.enable();

// Deaktiviert das Abhören neuer asynchroner Ereignisse.
asyncHook.disable();

//
// Im Folgenden sind die Callbacks aufgeführt, die an createHook() übergeben werden können.
//

// init() wird während der Objekterstellung aufgerufen. Die Ressource hat die
// Erstellung möglicherweise noch nicht abgeschlossen, wenn dieser Callback ausgeführt wird. Daher sind möglicherweise nicht alle Felder der
// Ressource, auf die von "asyncId" verwiesen wird, ausgefüllt.
function init(asyncId, type, triggerAsyncId, resource) { }

// before() wird aufgerufen, kurz bevor der Callback der Ressource aufgerufen wird. Er kann
// 0-N Mal für Handles (wie TCPWrap) aufgerufen werden und wird genau 1
// Mal für Anforderungen (wie FSReqCallback) aufgerufen.
function before(asyncId) { }

// after() wird aufgerufen, kurz nachdem der Callback der Ressource abgeschlossen ist.
function after(asyncId) { }

// destroy() wird aufgerufen, wenn die Ressource zerstört wird.
function destroy(asyncId) { }

// promiseResolve() wird nur für Promise-Ressourcen aufgerufen, wenn die
// resolve()-Funktion, die an den Promise-Konstruktor übergeben wird, aufgerufen wird
// (entweder direkt oder durch andere Mittel zur Auflösung eines Promise).
function promiseResolve(asyncId) { }
```
:::


## `async_hooks.createHook(callbacks)` {#async_hookscreatehookcallbacks}

**Hinzugefügt in: v8.1.0**

- `callbacks` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Die zu registrierenden [Hook-Callbacks](/de/nodejs/api/async_hooks#hook-callbacks)
    - `init` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Der [`init`-Callback](/de/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource).
    - `before` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Der [`before`-Callback](/de/nodejs/api/async_hooks#beforeasyncid).
    - `after` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Der [`after`-Callback](/de/nodejs/api/async_hooks#afterasyncid).
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Der [`destroy`-Callback](/de/nodejs/api/async_hooks#destroyasyncid).
    - `promiseResolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Der [`promiseResolve`-Callback](/de/nodejs/api/async_hooks#promiseresolveasyncid).
  
 
- Gibt zurück: [\<AsyncHook\>](/de/nodejs/api/async_hooks#async_hookscreatehookcallbacks) Instanz zum Deaktivieren und Aktivieren von Hooks

Registriert Funktionen, die für verschiedene Lebenszyklusereignisse jeder asynchronen Operation aufgerufen werden sollen.

Die Callbacks `init()`/`before()`/`after()`/`destroy()` werden für das jeweilige asynchrone Ereignis während der Lebensdauer einer Ressource aufgerufen.

Alle Callbacks sind optional. Wenn beispielsweise nur die Bereinigung von Ressourcen verfolgt werden muss, muss nur der `destroy`-Callback übergeben werden. Die Besonderheiten aller Funktionen, die an `callbacks` übergeben werden können, finden Sie im Abschnitt [Hook-Callbacks](/de/nodejs/api/async_hooks#hook-callbacks).

::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';

const asyncHook = createHook({
  init(asyncId, type, triggerAsyncId, resource) { },
  destroy(asyncId) { },
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');

const asyncHook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) { },
  destroy(asyncId) { },
});
```
:::

Die Callbacks werden über die Prototypenkette vererbt:

```js [ESM]
class MyAsyncCallbacks {
  init(asyncId, type, triggerAsyncId, resource) { }
  destroy(asyncId) {}
}

class MyAddedCallbacks extends MyAsyncCallbacks {
  before(asyncId) { }
  after(asyncId) { }
}

const asyncHook = async_hooks.createHook(new MyAddedCallbacks());
```
Da Promises asynchrone Ressourcen sind, deren Lebenszyklus über den Async-Hooks-Mechanismus verfolgt wird, *dürfen* die Callbacks `init()`, `before()`, `after()` und `destroy()` keine Async-Funktionen sein, die Promises zurückgeben.


### Fehlerbehandlung {#error-handling}

Wenn irgendein `AsyncHook`-Callback einen Fehler wirft, gibt die Anwendung den Stack Trace aus und beendet sich. Der Beendigungspfad folgt dem einer unbehandelten Ausnahme, aber alle `'uncaughtException'`-Listener werden entfernt, wodurch der Prozess zum Beenden gezwungen wird. Die `'exit'`-Callbacks werden weiterhin aufgerufen, es sei denn, die Anwendung wird mit `--abort-on-uncaught-exception` ausgeführt. In diesem Fall wird ein Stack Trace ausgegeben und die Anwendung beendet sich, wobei eine Core-Datei hinterlassen wird.

Der Grund für dieses Fehlerbehandlungsverhalten ist, dass diese Callbacks potenziell volatile Punkte in der Lebensdauer eines Objekts durchlaufen, z. B. während der Klassenerstellung und -zerstörung. Aus diesem Grund wird es als notwendig erachtet, den Prozess schnell zu beenden, um einen unbeabsichtigten Abbruch in der Zukunft zu verhindern. Dies kann sich in Zukunft ändern, wenn eine umfassende Analyse durchgeführt wird, um sicherzustellen, dass eine Ausnahme dem normalen Kontrollfluss ohne unbeabsichtigte Nebenwirkungen folgen kann.

### Drucken in `AsyncHook`-Callbacks {#printing-in-asynchook-callbacks}

Da das Drucken auf die Konsole ein asynchroner Vorgang ist, führen `console.log()` dazu, dass `AsyncHook`-Callbacks aufgerufen werden. Die Verwendung von `console.log()` oder ähnlichen asynchronen Operationen innerhalb einer `AsyncHook`-Callback-Funktion führt zu einer unendlichen Rekursion. Eine einfache Lösung hierfür beim Debuggen ist die Verwendung einer synchronen Protokollierungsoperation wie `fs.writeFileSync(file, msg, flag)`. Dies druckt in die Datei und ruft `AsyncHook` nicht rekursiv auf, da es synchron ist.

::: code-group
```js [ESM]
import { writeFileSync } from 'node:fs';
import { format } from 'node:util';

function debug(...args) {
  // Verwenden Sie eine Funktion wie diese, wenn Sie innerhalb eines AsyncHook-Callbacks debuggen
  writeFileSync('log.out', `${format(...args)}\n`, { flag: 'a' });
}
```

```js [CJS]
const fs = require('node:fs');
const util = require('node:util');

function debug(...args) {
  // Verwenden Sie eine Funktion wie diese, wenn Sie innerhalb eines AsyncHook-Callbacks debuggen
  fs.writeFileSync('log.out', `${util.format(...args)}\n`, { flag: 'a' });
}
```
:::

Wenn ein asynchroner Vorgang für die Protokollierung benötigt wird, ist es möglich, zu verfolgen, was den asynchronen Vorgang verursacht hat, indem die von `AsyncHook` selbst bereitgestellten Informationen verwendet werden. Die Protokollierung sollte dann übersprungen werden, wenn die Protokollierung selbst die Ursache für den Aufruf des `AsyncHook`-Callbacks war. Auf diese Weise wird die ansonsten unendliche Rekursion unterbrochen.


## Klasse: `AsyncHook` {#class-asynchook}

Die Klasse `AsyncHook` stellt eine Schnittstelle zur Verfolgung von Lebenszyklusereignissen asynchroner Operationen bereit.

### `asyncHook.enable()` {#asynchookenable}

- Rückgabe: [\<AsyncHook\>](/de/nodejs/api/async_hooks#async_hookscreatehookcallbacks) Eine Referenz auf `asyncHook`.

Aktiviert die Rückrufe für eine bestimmte `AsyncHook`-Instanz. Wenn keine Rückrufe bereitgestellt werden, ist die Aktivierung ein No-Op.

Die `AsyncHook`-Instanz ist standardmäßig deaktiviert. Wenn die `AsyncHook`-Instanz unmittelbar nach der Erstellung aktiviert werden soll, kann das folgende Muster verwendet werden.

::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';

const hook = createHook(callbacks).enable();
```

```js [CJS]
const async_hooks = require('node:async_hooks');

const hook = async_hooks.createHook(callbacks).enable();
```
:::

### `asyncHook.disable()` {#asynchookdisable}

- Rückgabe: [\<AsyncHook\>](/de/nodejs/api/async_hooks#async_hookscreatehookcallbacks) Eine Referenz auf `asyncHook`.

Deaktiviert die Rückrufe für eine bestimmte `AsyncHook`-Instanz aus dem globalen Pool der auszuführenden `AsyncHook`-Rückrufe. Sobald ein Hook deaktiviert wurde, wird er erst nach der Aktivierung wieder aufgerufen.

Aus Gründen der API-Konsistenz gibt `disable()` auch die `AsyncHook`-Instanz zurück.

### Hook-Rückrufe {#hook-callbacks}

Schlüsselereignisse im Lebenszyklus asynchroner Ereignisse wurden in vier Bereiche kategorisiert: Instanziierung, vor/nach dem Aufruf des Rückrufs und wenn die Instanz zerstört wird.

#### `init(asyncId, type, triggerAsyncId, resource)` {#initasyncid-type-triggerasyncid-resource}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Eine eindeutige ID für die asynchrone Ressource.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Typ der asynchronen Ressource.
- `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die eindeutige ID der asynchronen Ressource, in deren Ausführungskontext diese asynchrone Ressource erstellt wurde.
- `resource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Referenz auf die Ressource, die die asynchrone Operation darstellt und während *destroy* freigegeben werden muss.

Wird aufgerufen, wenn eine Klasse konstruiert wird, die die *Möglichkeit* hat, ein asynchrones Ereignis auszugeben. Dies *bedeutet nicht*, dass die Instanz vor dem Aufruf von `destroy` `before`/`after` aufrufen muss, sondern nur, dass die Möglichkeit besteht.

Dieses Verhalten kann beobachtet werden, indem man z. B. eine Ressource öffnet und sie dann schließt, bevor die Ressource verwendet werden kann. Der folgende Ausschnitt demonstriert dies.

::: code-group
```js [ESM]
import { createServer } from 'node:net';

createServer().listen(function() { this.close(); });
// OR
clearTimeout(setTimeout(() => {}, 10));
```

```js [CJS]
require('node:net').createServer().listen(function() { this.close(); });
// OR
clearTimeout(setTimeout(() => {}, 10));
```
:::

Jeder neuen Ressource wird eine ID zugewiesen, die im Umfang der aktuellen Node.js-Instanz eindeutig ist.


##### `type` {#type}

Der `type` ist ein String, der den Typ der Ressource identifiziert, die den Aufruf von `init` verursacht hat. Im Allgemeinen entspricht er dem Namen des Konstruktors der Ressource.

Der `type` von Ressourcen, die von Node.js selbst erstellt wurden, kann sich in jeder Node.js-Version ändern. Gültige Werte sind `TLSWRAP`, `TCPWRAP`, `TCPSERVERWRAP`, `GETADDRINFOREQWRAP`, `FSREQCALLBACK`, `Microtask` und `Timeout`. Überprüfen Sie den Quellcode der verwendeten Node.js-Version, um die vollständige Liste zu erhalten.

Darüber hinaus erstellen Benutzer von [`AsyncResource`](/de/nodejs/api/async_context#class-asyncresource) asynchrone Ressourcen unabhängig von Node.js selbst.

Es gibt auch den Ressourcentyp `PROMISE`, der verwendet wird, um `Promise`-Instanzen und asynchrone Arbeit, die von ihnen geplant wird, zu verfolgen.

Benutzer können ihren eigenen `type` definieren, wenn sie die öffentliche Embedder-API verwenden.

Es ist möglich, Namenskollisionen bei Typen zu haben. Embedder werden ermutigt, eindeutige Präfixe zu verwenden, z. B. den Namen des npm-Pakets, um Kollisionen beim Abhören der Hooks zu verhindern.

##### `triggerAsyncId` {#triggerasyncid}

`triggerAsyncId` ist die `asyncId` der Ressource, die die Initialisierung der neuen Ressource verursacht (oder "ausgelöst") und den Aufruf von `init` verursacht hat. Dies unterscheidet sich von `async_hooks.executionAsyncId()`, das nur zeigt, *wann* eine Ressource erstellt wurde, während `triggerAsyncId` zeigt, *warum* eine Ressource erstellt wurde.

Das Folgende ist eine einfache Demonstration von `triggerAsyncId`:

::: code-group
```js [ESM]
import { createHook, executionAsyncId } from 'node:async_hooks';
import { stdout } from 'node:process';
import net from 'node:net';
import fs from 'node:fs';

createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = executionAsyncId();
    fs.writeSync(
      stdout.fd,
      `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
}).enable();

net.createServer((conn) => {}).listen(8080);
```

```js [CJS]
const { createHook, executionAsyncId } = require('node:async_hooks');
const { stdout } = require('node:process');
const net = require('node:net');
const fs = require('node:fs');

createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = executionAsyncId();
    fs.writeSync(
      stdout.fd,
      `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
}).enable();

net.createServer((conn) => {}).listen(8080);
```
:::

Ausgabe beim Aufrufen des Servers mit `nc localhost 8080`:

```bash [BASH]
TCPSERVERWRAP(5): trigger: 1 execution: 1
TCPWRAP(7): trigger: 5 execution: 0
```
Der `TCPSERVERWRAP` ist der Server, der die Verbindungen empfängt.

Der `TCPWRAP` ist die neue Verbindung vom Client. Wenn eine neue Verbindung hergestellt wird, wird die `TCPWrap`-Instanz sofort erstellt. Dies geschieht außerhalb jedes JavaScript-Stacks. (Ein `executionAsyncId()` von `0` bedeutet, dass es von C++ ohne JavaScript-Stack darüber ausgeführt wird.) Mit diesen Informationen allein wäre es unmöglich, Ressourcen in Bezug darauf, was ihre Erstellung verursacht hat, miteinander zu verknüpfen. Daher wird `triggerAsyncId` die Aufgabe übertragen, zu propagieren, welche Ressource für die Existenz der neuen Ressource verantwortlich ist.


##### `resource` {#resource}

`resource` ist ein Objekt, das die tatsächliche asynchrone Ressource darstellt, die initialisiert wurde. Die API für den Zugriff auf das Objekt kann vom Ersteller der Ressource festgelegt werden. Von Node.js selbst erstellte Ressourcen sind intern und können sich jederzeit ändern. Daher ist für diese keine API festgelegt.

In einigen Fällen wird das Ressourcenobjekt aus Performancegründen wiederverwendet. Es ist daher nicht sicher, es als Schlüssel in einem `WeakMap` zu verwenden oder ihm Eigenschaften hinzuzufügen.

##### Beispiel für asynchronen Kontext {#asynchronous-context-example}

Der Anwendungsfall der Kontextverfolgung wird von der stabilen API [`AsyncLocalStorage`](/de/nodejs/api/async_context#class-asynclocalstorage) abgedeckt. Dieses Beispiel veranschaulicht nur die Funktionsweise von Async-Hooks, aber [`AsyncLocalStorage`](/de/nodejs/api/async_context#class-asynclocalstorage) eignet sich besser für diesen Anwendungsfall.

Das Folgende ist ein Beispiel mit zusätzlichen Informationen zu den Aufrufen von `init` zwischen den `before`- und `after`-Aufrufen, insbesondere wie der Callback für `listen()` aussehen wird. Die Ausgabeformatierung ist etwas aufwändiger, um den Aufrufkontext besser sichtbar zu machen.

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';
import fs from 'node:fs';
import net from 'node:net';
import { stdout } from 'node:process';
const { fd } = stdout;

let indent = 0;
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    const indentStr = ' '.repeat(indent);
    fs.writeSync(
      fd,
      `${indentStr}${type}(${asyncId}):` +
      ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
  before(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}before:  ${asyncId}\n`);
    indent += 2;
  },
  after(asyncId) {
    indent -= 2;
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}after:  ${asyncId}\n`);
  },
  destroy(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}destroy:  ${asyncId}\n`);
  },
}).enable();

net.createServer(() => {}).listen(8080, () => {
  // Let's wait 10ms before logging the server started.
  setTimeout(() => {
    console.log('>>>', async_hooks.executionAsyncId());
  }, 10);
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');
const fs = require('node:fs');
const net = require('node:net');
const { fd } = process.stdout;

let indent = 0;
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    const indentStr = ' '.repeat(indent);
    fs.writeSync(
      fd,
      `${indentStr}${type}(${asyncId}):` +
      ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
  before(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}before:  ${asyncId}\n`);
    indent += 2;
  },
  after(asyncId) {
    indent -= 2;
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}after:  ${asyncId}\n`);
  },
  destroy(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}destroy:  ${asyncId}\n`);
  },
}).enable();

net.createServer(() => {}).listen(8080, () => {
  // Let's wait 10ms before logging the server started.
  setTimeout(() => {
    console.log('>>>', async_hooks.executionAsyncId());
  }, 10);
});
```
:::

Ausgabe beim Starten des Servers:

```bash [BASH]
TCPSERVERWRAP(5): trigger: 1 execution: 1
TickObject(6): trigger: 5 execution: 1
before:  6
  Timeout(7): trigger: 6 execution: 6
after:   6
destroy: 6
before:  7
>>> 7
  TickObject(8): trigger: 7 execution: 7
after:   7
before:  8
after:   8
```
Wie im Beispiel veranschaulicht, geben `executionAsyncId()` und `execution` jeweils den Wert des aktuellen Ausführungskontexts an, der durch Aufrufe von `before` und `after` abgegrenzt wird.

Die alleinige Verwendung von `execution` zur grafischen Darstellung der Ressourcenzuordnung führt zu Folgendem:

```bash [BASH]
  root(1)
     ^
     |
TickObject(6)
     ^
     |
 Timeout(7)
```
Der `TCPSERVERWRAP` ist nicht Teil dieses Graphen, obwohl er der Grund für den Aufruf von `console.log()` war. Dies liegt daran, dass die Bindung an einen Port ohne Hostname eine *synchrone* Operation ist, aber um eine vollständig asynchrone API beizubehalten, wird der Callback des Benutzers in ein `process.nextTick()` platziert. Aus diesem Grund ist `TickObject` in der Ausgabe vorhanden und ein "Elternteil" für den `.listen()`-Callback.

Der Graph zeigt nur *wann* eine Ressource erstellt wurde, nicht *warum*. Um das *Warum* zu verfolgen, verwenden Sie `triggerAsyncId`. Dies kann mit dem folgenden Graphen dargestellt werden:

```bash [BASH]
 bootstrap(1)
     |
     ˅
TCPSERVERWRAP(5)
     |
     ˅
 TickObject(6)
     |
     ˅
  Timeout(7)
```

#### `before(asyncId)` {#beforeasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Wenn eine asynchrone Operation initiiert (z. B. ein TCP-Server, der eine neue Verbindung empfängt) oder abgeschlossen wird (z. B. Schreiben von Daten auf die Festplatte), wird eine Callback-Funktion aufgerufen, um den Benutzer zu benachrichtigen. Der `before`-Callback wird kurz vor der Ausführung des genannten Callbacks aufgerufen. `asyncId` ist der eindeutige Bezeichner, der der Ressource zugewiesen wurde, die den Callback ausführen soll.

Der `before`-Callback wird 0 bis N Mal aufgerufen. Der `before`-Callback wird typischerweise 0 Mal aufgerufen, wenn die asynchrone Operation abgebrochen wurde oder z. B. wenn ein TCP-Server keine Verbindungen empfängt. Persistente asynchrone Ressourcen wie ein TCP-Server rufen den `before`-Callback typischerweise mehrmals auf, während andere Operationen wie `fs.open()` ihn nur einmal aufrufen.

#### `after(asyncId)` {#afterasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Wird unmittelbar nach Abschluss des in `before` angegebenen Callbacks aufgerufen.

Wenn während der Ausführung des Callbacks eine nicht abgefangene Ausnahme auftritt, wird `after` *nachdem* das `'uncaughtException'`-Ereignis ausgelöst wurde oder der Handler einer `domain` ausgeführt wurde, ausgeführt.

#### `destroy(asyncId)` {#destroyasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Wird aufgerufen, nachdem die Ressource, die `asyncId` entspricht, zerstört wurde. Sie wird auch asynchron über die Embedder-API `emitDestroy()` aufgerufen.

Einige Ressourcen sind bei der Bereinigung auf die automatische Speicherbereinigung angewiesen. Wenn also ein Verweis auf das `resource`-Objekt erstellt wird, das an `init` übergeben wird, ist es möglich, dass `destroy` nie aufgerufen wird, was zu einem Speicherleck in der Anwendung führt. Wenn die Ressource nicht von der automatischen Speicherbereinigung abhängig ist, stellt dies kein Problem dar.

Die Verwendung des Destroy-Hooks führt zu zusätzlichem Overhead, da er die Verfolgung von `Promise`-Instanzen über die automatische Speicherbereinigung ermöglicht.

#### `promiseResolve(asyncId)` {#promiseresolveasyncid}

**Hinzugefügt in: v8.6.0**

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Wird aufgerufen, wenn die an den `Promise`-Konstruktor übergebene `resolve`-Funktion aufgerufen wird (entweder direkt oder auf andere Weise zur Auflösung eines Promises).

`resolve()` führt keine beobachtbare synchrone Arbeit aus.

Das `Promise` ist zu diesem Zeitpunkt nicht unbedingt erfüllt oder abgelehnt, wenn das `Promise` durch Annahme des Zustands eines anderen `Promise` aufgelöst wurde.

```js [ESM]
new Promise((resolve) => resolve(true)).then((a) => {});
```
ruft die folgenden Callbacks auf:

```text [TEXT]
init für PROMISE mit ID 5, Trigger-ID: 1
  promise resolve 5      # entspricht resolve(true)
init für PROMISE mit ID 6, Trigger-ID: 5  # das von then() zurückgegebene Promise
  before 6               # der then()-Callback wird betreten
  promise resolve 6      # der then()-Callback löst das Promise durch Rückgabe auf
  after 6
```

### `async_hooks.executionAsyncResource()` {#async_hooksexecutionasyncresource}

**Hinzugefügt in: v13.9.0, v12.17.0**

- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Die Ressource, die die aktuelle Ausführung repräsentiert. Nützlich, um Daten innerhalb der Ressource zu speichern.

Ressourcenobjekte, die von `executionAsyncResource()` zurückgegeben werden, sind meistens interne Node.js-Handle-Objekte mit undokumentierten APIs. Die Verwendung von Funktionen oder Eigenschaften des Objekts führt wahrscheinlich zum Absturz Ihrer Anwendung und sollte vermieden werden.

Die Verwendung von `executionAsyncResource()` im Ausführungskontext der obersten Ebene gibt ein leeres Objekt zurück, da kein Handle- oder Request-Objekt verwendet werden kann, aber ein Objekt zu haben, das die oberste Ebene darstellt, kann hilfreich sein.

::: code-group
```js [ESM]
import { open } from 'node:fs';
import { executionAsyncId, executionAsyncResource } from 'node:async_hooks';

console.log(executionAsyncId(), executionAsyncResource());  // 1 {}
open(new URL(import.meta.url), 'r', (err, fd) => {
  console.log(executionAsyncId(), executionAsyncResource());  // 7 FSReqWrap
});
```

```js [CJS]
const { open } = require('node:fs');
const { executionAsyncId, executionAsyncResource } = require('node:async_hooks');

console.log(executionAsyncId(), executionAsyncResource());  // 1 {}
open(__filename, 'r', (err, fd) => {
  console.log(executionAsyncId(), executionAsyncResource());  // 7 FSReqWrap
});
```
:::

Dies kann verwendet werden, um Continuation Local Storage ohne die Verwendung einer Tracking-`Map` zur Speicherung der Metadaten zu implementieren:

::: code-group
```js [ESM]
import { createServer } from 'node:http';
import {
  executionAsyncId,
  executionAsyncResource,
  createHook,
} from 'node:async_hooks';
const sym = Symbol('state'); // Privates Symbol zur Vermeidung von Pollution

createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = executionAsyncResource();
    if (cr) {
      resource[sym] = cr[sym];
    }
  },
}).enable();

const server = createServer((req, res) => {
  executionAsyncResource()[sym] = { state: req.url };
  setTimeout(function() {
    res.end(JSON.stringify(executionAsyncResource()[sym]));
  }, 100);
}).listen(3000);
```

```js [CJS]
const { createServer } = require('node:http');
const {
  executionAsyncId,
  executionAsyncResource,
  createHook,
} = require('node:async_hooks');
const sym = Symbol('state'); // Privates Symbol zur Vermeidung von Pollution

createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = executionAsyncResource();
    if (cr) {
      resource[sym] = cr[sym];
    }
  },
}).enable();

const server = createServer((req, res) => {
  executionAsyncResource()[sym] = { state: req.url };
  setTimeout(function() {
    res.end(JSON.stringify(executionAsyncResource()[sym]));
  }, 100);
}).listen(3000);
```
:::


### `async_hooks.executionAsyncId()` {#async_hooksexecutionasyncid}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v8.2.0 | Umbenannt von `currentId`. |
| v8.1.0 | Hinzugefügt in: v8.1.0 |
:::

- Gibt zurück: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die `asyncId` des aktuellen Ausführungskontexts. Nützlich, um zu verfolgen, wann etwas aufgerufen wird.

::: code-group
```js [ESM]
import { executionAsyncId } from 'node:async_hooks';
import fs from 'node:fs';

console.log(executionAsyncId());  // 1 - Bootstrap
const path = '.';
fs.open(path, 'r', (err, fd) => {
  console.log(executionAsyncId());  // 6 - open()
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');
const fs = require('node:fs');

console.log(async_hooks.executionAsyncId());  // 1 - Bootstrap
const path = '.';
fs.open(path, 'r', (err, fd) => {
  console.log(async_hooks.executionAsyncId());  // 6 - open()
});
```
:::

Die von `executionAsyncId()` zurückgegebene ID bezieht sich auf das Timing der Ausführung, nicht auf die Kausalität (die von `triggerAsyncId()` abgedeckt wird):

```js [ESM]
const server = net.createServer((conn) => {
  // Gibt die ID des Servers zurück, nicht die der neuen Verbindung, da der
  // Callback im Ausführungskontext von MakeCallback() des Servers ausgeführt wird.
  async_hooks.executionAsyncId();

}).listen(port, () => {
  // Gibt die ID eines TickObjects (process.nextTick()) zurück, da alle
  // an .listen() übergebenen Callbacks in einem nextTick() umschlossen sind.
  async_hooks.executionAsyncId();
});
```
Promise-Kontexte erhalten standardmäßig möglicherweise keine präzisen `executionAsyncIds`. Siehe den Abschnitt über [Promise-Ausführungsverfolgung](/de/nodejs/api/async_hooks#promise-execution-tracking).

### `async_hooks.triggerAsyncId()` {#async_hookstriggerasyncid}

- Gibt zurück: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die ID der Ressource, die für den Aufruf des Callbacks verantwortlich ist, der gerade ausgeführt wird.

```js [ESM]
const server = net.createServer((conn) => {
  // Die Ressource, die diesen Callback verursacht (oder ausgelöst) hat,
  // war die der neuen Verbindung. Daher ist der Rückgabewert von triggerAsyncId()
  // die asyncId von "conn".
  async_hooks.triggerAsyncId();

}).listen(port, () => {
  // Obwohl alle an .listen() übergebenen Callbacks in einem nextTick() umschlossen sind,
  // existiert der Callback selbst, weil der Aufruf von .listen() des Servers
  // erfolgt ist. Der Rückgabewert wäre also die ID des Servers.
  async_hooks.triggerAsyncId();
});
```
Promise-Kontexte erhalten standardmäßig möglicherweise keine gültigen `triggerAsyncId`s. Siehe den Abschnitt über [Promise-Ausführungsverfolgung](/de/nodejs/api/async_hooks#promise-execution-tracking).


### `async_hooks.asyncWrapProviders` {#async_hooksasyncwrapproviders}

**Hinzugefügt in: v17.2.0, v16.14.0**

- Gibt zurück: Eine Map von Provider-Typen zu den entsprechenden numerischen IDs. Diese Map enthält alle Ereignistypen, die vom `async_hooks.init()`-Ereignis emittiert werden können.

Dieses Feature unterdrückt die veraltete Verwendung von `process.binding('async_wrap').Providers`. Siehe: [DEP0111](/de/nodejs/api/deprecations#dep0111-processbinding)

## Promise-Ausführungsverfolgung {#promise-execution-tracking}

Standardmäßig werden Promise-Ausführungen keine `asyncId`s zugewiesen, da die [Promise-Introspektions-API](https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit) von V8 relativ teuer ist. Dies bedeutet, dass Programme, die Promises oder `async`/`await` verwenden, standardmäßig keine korrekten Ausführungs- und Trigger-IDs für Promise-Callback-Kontexte erhalten.

::: code-group
```js [ESM]
import { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 1 tid 0
```

```js [CJS]
const { executionAsyncId, triggerAsyncId } = require('node:async_hooks');

Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 1 tid 0
```
:::

Beachten Sie, dass der `then()`-Callback behauptet, im Kontext des äußeren Gültigkeitsbereichs ausgeführt worden zu sein, obwohl ein asynchroner Sprung stattgefunden hat. Der Wert `triggerAsyncId` ist ebenfalls `0`, was bedeutet, dass uns der Kontext der Ressource fehlt, die die Ausführung des `then()`-Callbacks verursacht (ausgelöst) hat.

Die Installation von Async-Hooks über `async_hooks.createHook` ermöglicht die Promise-Ausführungsverfolgung:

::: code-group
```js [ESM]
import { createHook, executionAsyncId, triggerAsyncId } from 'node:async_hooks';
createHook({ init() {} }).enable(); // erzwingt die Aktivierung von PromiseHooks.
Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 7 tid 6
```

```js [CJS]
const { createHook, executionAsyncId, triggerAsyncId } = require('node:async_hooks');

createHook({ init() {} }).enable(); // erzwingt die Aktivierung von PromiseHooks.
Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 7 tid 6
```
:::

In diesem Beispiel ermöglichte das Hinzufügen einer beliebigen Hook-Funktion die Verfolgung von Promises. Es gibt zwei Promises im obigen Beispiel: das Promise, das von `Promise.resolve()` erstellt wurde, und das Promise, das vom Aufruf von `then()` zurückgegeben wurde. Im obigen Beispiel erhielt das erste Promise die `asyncId` `6` und das zweite die `asyncId` `7`. Während der Ausführung des `then()`-Callbacks führen wir ihn im Kontext des Promises mit der `asyncId` `7` aus. Dieses Promise wurde von der asynchronen Ressource `6` ausgelöst.

Eine weitere Feinheit bei Promises ist, dass `before`- und `after`-Callbacks nur auf verketteten Promises ausgeführt werden. Das bedeutet, dass Promises, die nicht von `then()`/`catch()` erstellt wurden, keine `before`- und `after`-Callbacks ausgelöst bekommen. Weitere Informationen finden Sie in den Details der V8 [PromiseHooks](https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit)-API.


## JavaScript-Embedder-API {#javascript-embedder-api}

Bibliotheksentwickler, die ihre eigenen asynchronen Ressourcen verwalten und Aufgaben wie I/O, Connection Pooling oder die Verwaltung von Callback-Queues durchführen, können das `AsyncResource` JavaScript-API verwenden, sodass alle entsprechenden Callbacks aufgerufen werden.

### Klasse: `AsyncResource` {#class-asyncresource}

Die Dokumentation für diese Klasse wurde verschoben nach [`AsyncResource`](/de/nodejs/api/async_context#class-asyncresource).

## Klasse: `AsyncLocalStorage` {#class-asynclocalstorage}

Die Dokumentation für diese Klasse wurde verschoben nach [`AsyncLocalStorage`](/de/nodejs/api/async_context#class-asynclocalstorage).

