---
title: Node.js Prozess-API-Dokumentation
description: Detaillierte Dokumentation über das Node.js Prozessmodul, das Prozessverwaltung, Umgebungsvariablen, Signale und mehr abdeckt.
head:
  - - meta
    - name: og:title
      content: Node.js Prozess-API-Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Detaillierte Dokumentation über das Node.js Prozessmodul, das Prozessverwaltung, Umgebungsvariablen, Signale und mehr abdeckt.
  - - meta
    - name: twitter:title
      content: Node.js Prozess-API-Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Detaillierte Dokumentation über das Node.js Prozessmodul, das Prozessverwaltung, Umgebungsvariablen, Signale und mehr abdeckt.
---


# Prozess {#process}

**Quellcode:** [lib/process.js](https://github.com/nodejs/node/blob/v23.5.0/lib/process.js)

Das `process`-Objekt liefert Informationen über den aktuellen Node.js-Prozess und ermöglicht dessen Steuerung.

::: code-group
```js [ESM]
import process from 'node:process';
```

```js [CJS]
const process = require('node:process');
```
:::

## Prozess-Ereignisse {#process-events}

Das `process`-Objekt ist eine Instanz von [`EventEmitter`](/de/nodejs/api/events#class-eventemitter).

### Ereignis: `'beforeExit'` {#event-beforeexit}

**Hinzugefügt in: v0.11.12**

Das `'beforeExit'`-Ereignis wird ausgelöst, wenn Node.js seine Ereignisschleife leert und keine zusätzliche Arbeit mehr einzuplanen hat. Normalerweise beendet sich der Node.js-Prozess, wenn keine Arbeit mehr eingeplant ist, aber ein Listener, der für das `'beforeExit'`-Ereignis registriert ist, kann asynchrone Aufrufe durchführen und dadurch bewirken, dass der Node.js-Prozess fortgesetzt wird.

Die Listener-Callback-Funktion wird mit dem Wert von [`process.exitCode`](/de/nodejs/api/process#processexitcode_1) aufgerufen, der als einziges Argument übergeben wird.

Das `'beforeExit'`-Ereignis wird *nicht* für Bedingungen ausgelöst, die eine explizite Beendigung verursachen, wie z. B. der Aufruf von [`process.exit()`](/de/nodejs/api/process#processexitcode) oder nicht abgefangene Ausnahmen.

Das `'beforeExit'`-Ereignis sollte *nicht* als Alternative zum `'exit'`-Ereignis verwendet werden, es sei denn, es ist beabsichtigt, zusätzliche Arbeit einzuplanen.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('beforeExit', (code) => {
  console.log('Prozess beforeExit Ereignis mit Code: ', code);
});

process.on('exit', (code) => {
  console.log('Prozess Exit Ereignis mit Code: ', code);
});

console.log('Diese Nachricht wird zuerst angezeigt.');

// Prints:
// Diese Nachricht wird zuerst angezeigt.
// Prozess beforeExit Ereignis mit Code: 0
// Prozess Exit Ereignis mit Code: 0
```

```js [CJS]
const process = require('node:process');

process.on('beforeExit', (code) => {
  console.log('Prozess beforeExit Ereignis mit Code: ', code);
});

process.on('exit', (code) => {
  console.log('Prozess Exit Ereignis mit Code: ', code);
});

console.log('Diese Nachricht wird zuerst angezeigt.');

// Prints:
// Diese Nachricht wird zuerst angezeigt.
// Prozess beforeExit Ereignis mit Code: 0
// Prozess Exit Ereignis mit Code: 0
```
:::


### Ereignis: `'disconnect'` {#event-disconnect}

**Hinzugefügt in: v0.7.7**

Wenn der Node.js-Prozess mit einem IPC-Kanal gestartet wird (siehe die Dokumentation zu [Child Process](/de/nodejs/api/child_process) und [Cluster](/de/nodejs/api/cluster)), wird das `'disconnect'`-Ereignis ausgelöst, wenn der IPC-Kanal geschlossen wird.

### Ereignis: `'exit'` {#event-exit}

**Hinzugefügt in: v0.1.7**

- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Das `'exit'`-Ereignis wird ausgelöst, wenn der Node.js-Prozess beendet werden soll, entweder als Ergebnis von:

- Der explizite Aufruf der `process.exit()`-Methode;
- Die Node.js-Event-Loop hat keine zusätzliche Arbeit mehr zu erledigen.

Es gibt keine Möglichkeit, die Beendigung der Event-Loop an dieser Stelle zu verhindern, und sobald alle `'exit'`-Listener ihre Ausführung beendet haben, wird der Node.js-Prozess beendet.

Die Listener-Callback-Funktion wird mit dem Exit-Code aufgerufen, der entweder durch die Eigenschaft [`process.exitCode`](/de/nodejs/api/process#processexitcode_1) oder das Argument `exitCode`, das an die Methode [`process.exit()`](/de/nodejs/api/process#processexitcode) übergeben wird, angegeben wird.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('exit', (code) => {
  console.log(`Wird mit Code beendet: ${code}`);
});
```

```js [CJS]
const process = require('node:process');

process.on('exit', (code) => {
  console.log(`Wird mit Code beendet: ${code}`);
});
```
:::

Listener-Funktionen **dürfen** nur **synchrone** Operationen ausführen. Der Node.js-Prozess wird sofort nach dem Aufruf der `'exit'`-Ereignis-Listener beendet, wodurch alle zusätzlichen Arbeiten, die noch in der Event-Loop in der Warteschlange stehen, abgebrochen werden. Im folgenden Beispiel wird beispielsweise das Timeout nie auftreten:

::: code-group
```js [ESM]
import process from 'node:process';

process.on('exit', (code) => {
  setTimeout(() => {
    console.log('Dies wird nicht ausgeführt');
  }, 0);
});
```

```js [CJS]
const process = require('node:process');

process.on('exit', (code) => {
  setTimeout(() => {
    console.log('Dies wird nicht ausgeführt');
  }, 0);
});
```
:::


### Ereignis: `'message'` {#event-message}

**Hinzugefügt in: v0.5.10**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) ein geparstes JSON-Objekt oder ein serialisierbarer primitiver Wert.
- `sendHandle` [\<net.Server\>](/de/nodejs/api/net#class-netserver) | [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) ein [`net.Server`](/de/nodejs/api/net#class-netserver)- oder [`net.Socket`](/de/nodejs/api/net#class-netsocket)-Objekt oder undefiniert.

Wenn der Node.js-Prozess mit einem IPC-Kanal gestartet wird (siehe die Dokumentation zu [Child Process](/de/nodejs/api/child_process) und [Cluster](/de/nodejs/api/cluster)), wird das `'message'`-Ereignis ausgelöst, wenn eine Nachricht, die von einem übergeordneten Prozess mit [`childprocess.send()`](/de/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) gesendet wurde, vom Kindprozess empfangen wird.

Die Nachricht durchläuft Serialisierung und Parsen. Die resultierende Nachricht ist möglicherweise nicht identisch mit der ursprünglich gesendeten.

Wenn die Option `serialization` beim Starten des Prozesses auf `advanced` gesetzt wurde, kann das Argument `message` Daten enthalten, die JSON nicht darstellen kann. Weitere Informationen finden Sie unter [Erweiterte Serialisierung für `child_process`](/de/nodejs/api/child_process#advanced-serialization).

### Ereignis: `'multipleResolves'` {#event-multipleresolves}

**Hinzugefügt in: v10.12.0**

**Veraltet seit: v17.6.0, v16.15.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/de/nodejs/api/documentation#stability-index) [Stability: 0](/de/nodejs/api/documentation#stability-index) - Veraltet
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Auflösungstyp. Einer von `'resolve'` oder `'reject'`.
- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Das Promise, das mehr als einmal aufgelöst oder abgelehnt wurde.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Der Wert, mit dem das Promise nach der ursprünglichen Auflösung entweder aufgelöst oder abgelehnt wurde.

Das Ereignis `'multipleResolves'` wird immer dann ausgelöst, wenn ein `Promise` entweder:

- Mehr als einmal aufgelöst wurde.
- Mehr als einmal abgelehnt wurde.
- Nach der Auflösung abgelehnt wurde.
- Nach der Ablehnung aufgelöst wurde.

Dies ist nützlich, um potenzielle Fehler in einer Anwendung bei Verwendung des `Promise`-Konstruktors zu verfolgen, da mehrfache Auflösungen stillschweigend verschluckt werden. Das Auftreten dieses Ereignisses deutet jedoch nicht unbedingt auf einen Fehler hin. Beispielsweise kann [`Promise.race()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) ein `'multipleResolves'`-Ereignis auslösen.

Aufgrund der Unzuverlässigkeit des Ereignisses in Fällen wie dem obigen [`Promise.race()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)-Beispiel wurde es als veraltet markiert.



::: code-group
```js [ESM]
import process from 'node:process';

process.on('multipleResolves', (type, promise, reason) => {
  console.error(type, promise, reason);
  setImmediate(() => process.exit(1));
});

async function main() {
  try {
    return await new Promise((resolve, reject) => {
      resolve('First call');
      resolve('Swallowed resolve');
      reject(new Error('Swallowed reject'));
    });
  } catch {
    throw new Error('Failed');
  }
}

main().then(console.log);
// resolve: Promise { 'First call' } 'Swallowed resolve'
// reject: Promise { 'First call' } Error: Swallowed reject
//     at Promise (*)
//     at new Promise (<anonymous>)
//     at main (*)
// First call
```

```js [CJS]
const process = require('node:process');

process.on('multipleResolves', (type, promise, reason) => {
  console.error(type, promise, reason);
  setImmediate(() => process.exit(1));
});

async function main() {
  try {
    return await new Promise((resolve, reject) => {
      resolve('First call');
      resolve('Swallowed resolve');
      reject(new Error('Swallowed reject'));
    });
  } catch {
    throw new Error('Failed');
  }
}

main().then(console.log);
// resolve: Promise { 'First call' } 'Swallowed resolve'
// reject: Promise { 'First call' } Error: Swallowed reject
//     at Promise (*)
//     at new Promise (<anonymous>)
//     at main (*)
// First call
```
:::


### Ereignis: `'rejectionHandled'` {#event-rejectionhandled}

**Hinzugefügt in: v1.4.1**

- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Das nachträglich behandelte Promise.

Das Ereignis `'rejectionHandled'` wird immer dann ausgelöst, wenn ein `Promise` abgewiesen wurde und ein Fehlerhandler (z. B. mit [`promise.catch()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)) später als eine Runde der Node.js-Ereignisschleife daran angehängt wurde.

Das `Promise`-Objekt wäre zuvor in einem `'unhandledRejection'`-Ereignis ausgegeben worden, hat aber im Laufe der Verarbeitung einen Ablehnungs-Handler erhalten.

Es gibt keine Vorstellung von einer obersten Ebene für eine `Promise`-Kette, auf der Ablehnungen immer behandelt werden können. Da eine `Promise`-Ablehnung von Natur aus asynchron ist, kann sie zu einem späteren Zeitpunkt behandelt werden, möglicherweise viel später als die Ereignisschleifenrunde, die benötigt wird, um das `'unhandledRejection'`-Ereignis auszulösen.

Eine andere Möglichkeit, dies auszudrücken, ist, dass es im Gegensatz zu synchronem Code, in dem es eine ständig wachsende Liste unbehandelter Ausnahmen gibt, bei Promises eine wachsende und schrumpfende Liste unbehandelter Ablehnungen geben kann.

In synchronem Code wird das `'uncaughtException'`-Ereignis ausgelöst, wenn die Liste unbehandelter Ausnahmen wächst.

In asynchronem Code wird das `'unhandledRejection'`-Ereignis ausgelöst, wenn die Liste unbehandelter Ablehnungen wächst, und das `'rejectionHandled'`-Ereignis wird ausgelöst, wenn die Liste unbehandelter Ablehnungen schrumpft.

::: code-group
```js [ESM]
import process from 'node:process';

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});
```

```js [CJS]
const process = require('node:process');

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});
```
:::

In diesem Beispiel wächst und schrumpft die `unhandledRejections`-`Map` im Laufe der Zeit und spiegelt Ablehnungen wider, die unbehandelt beginnen und dann behandelt werden. Es ist möglich, solche Fehler in einem Fehlerprotokoll zu erfassen, entweder periodisch (was wahrscheinlich am besten für lang laufende Anwendungen ist) oder beim Beenden des Prozesses (was wahrscheinlich am bequemsten für Skripte ist).


### Event: `'workerMessage'` {#event-workermessage}

**Hinzugefügt in: v22.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Ein Wert, der mit [`postMessageToThread()`](/de/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) übertragen wurde.
- `source` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die ID des sendenden Worker-Threads oder `0` für den Haupt-Thread.

Das `'workerMessage'`-Ereignis wird für jede eingehende Nachricht ausgelöst, die von der anderen Partei mithilfe von [`postMessageToThread()`](/de/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) gesendet wird.

### Event: `'uncaughtException'` {#event-uncaughtexception}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.0.0, v10.17.0 | Das Argument `origin` wurde hinzugefügt. |
| v0.1.18 | Hinzugefügt in: v0.1.18 |
:::

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Die unbehandelte Ausnahme.
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Gibt an, ob die Ausnahme von einer unbehandelten Ablehnung oder von einem synchronen Fehler stammt. Kann entweder `'uncaughtException'` oder `'unhandledRejection'` sein. Letzteres wird verwendet, wenn eine Ausnahme in einem `Promise`-basierten asynchronen Kontext auftritt (oder wenn eine `Promise` abgelehnt wird) und das Flag [`--unhandled-rejections`](/de/nodejs/api/cli#--unhandled-rejectionsmode) auf `strict` oder `throw` gesetzt ist (was die Standardeinstellung ist) und die Ablehnung nicht behandelt wird, oder wenn eine Ablehnung während der statischen Ladephase des ES-Moduls des Befehlszeileneinstiegspunkts auftritt.

Das `'uncaughtException'`-Ereignis wird ausgelöst, wenn eine unbehandelte JavaScript-Ausnahme bis zurück zur Ereignisschleife gelangt. Standardmäßig behandelt Node.js solche Ausnahmen, indem es den Stack-Trace auf `stderr` ausgibt und mit Code 1 beendet wird, wobei jeder zuvor festgelegte [`process.exitCode`](/de/nodejs/api/process#processexitcode_1) überschrieben wird. Das Hinzufügen eines Handlers für das `'uncaughtException'`-Ereignis überschreibt dieses Standardverhalten. Alternativ kann man den [`process.exitCode`](/de/nodejs/api/process#processexitcode_1) im `'uncaughtException'`-Handler ändern, was dazu führt, dass der Prozess mit dem angegebenen Exit-Code beendet wird. Andernfalls wird der Prozess in Anwesenheit eines solchen Handlers mit 0 beendet.



::: code-group
```js [ESM]
import process from 'node:process';
import fs from 'node:fs';

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}\n`,
  );
});

setTimeout(() => {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('This will not run.');
```

```js [CJS]
const process = require('node:process');
const fs = require('node:fs');

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}\n`,
  );
});

setTimeout(() => {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('This will not run.');
```
:::

Es ist möglich, `'uncaughtException'`-Ereignisse zu überwachen, ohne das Standardverhalten zum Beenden des Prozesses zu überschreiben, indem ein `'uncaughtExceptionMonitor'`-Listener installiert wird.


#### Warnung: `'uncaughtException'` korrekt verwenden {#warning-using-uncaughtexception-correctly}

`'uncaughtException'` ist ein grober Mechanismus zur Ausnahmebehandlung, der nur als letztes Mittel verwendet werden sollte. Das Ereignis *sollte nicht* als Äquivalent zu `On Error Resume Next` verwendet werden. Unbehandelte Ausnahmen bedeuten grundsätzlich, dass sich eine Anwendung in einem undefinierten Zustand befindet. Der Versuch, den Anwendungscode fortzusetzen, ohne sich ordnungsgemäß von der Ausnahme erholt zu haben, kann zu zusätzlichen unvorhergesehenen und unvorhersehbaren Problemen führen.

Ausnahmen, die innerhalb des Ereignishandlers ausgelöst werden, werden nicht abgefangen. Stattdessen wird der Prozess mit einem Exit-Code ungleich Null beendet und der Stack-Trace wird ausgegeben. Dies dient zur Vermeidung unendlicher Rekursion.

Der Versuch, nach einer nicht abgefangenen Ausnahme normal fortzufahren, kann mit dem Ziehen des Netzsteckers beim Aktualisieren eines Computers verglichen werden. Neun von zehn Mal passiert nichts. Aber beim zehnten Mal wird das System beschädigt.

Die korrekte Verwendung von `'uncaughtException'` besteht darin, eine synchrone Bereinigung zugewiesener Ressourcen (z. B. Dateideskriptoren, Handles usw.) durchzuführen, bevor der Prozess heruntergefahren wird. **Es ist nicht sicher, den normalen Betrieb nach
<code>'uncaughtException'</code> fortzusetzen.**

Um eine abgestürzte Anwendung zuverlässiger neu zu starten, unabhängig davon, ob `'uncaughtException'` ausgelöst wird oder nicht, sollte ein externer Monitor in einem separaten Prozess eingesetzt werden, um Anwendungsfehler zu erkennen und bei Bedarf wiederherzustellen oder neu zu starten.

### Ereignis: `'uncaughtExceptionMonitor'` {#event-uncaughtexceptionmonitor}

**Hinzugefügt in: v13.7.0, v12.17.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Die nicht abgefangene Ausnahme.
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Gibt an, ob die Ausnahme von einer unbehandelten Ablehnung oder von synchronen Fehlern stammt. Kann entweder `'uncaughtException'` oder `'unhandledRejection'` sein. Letzteres wird verwendet, wenn eine Ausnahme in einem `Promise`-basierten asynchronen Kontext auftritt (oder wenn ein `Promise` abgelehnt wird) und das Flag [`--unhandled-rejections`](/de/nodejs/api/cli#--unhandled-rejectionsmode) auf `strict` oder `throw` (was die Standardeinstellung ist) gesetzt ist und die Ablehnung nicht behandelt wird, oder wenn eine Ablehnung während der statischen Ladephase des ES-Moduls des Befehlszeileneinstiegspunkts auftritt.

Das Ereignis `'uncaughtExceptionMonitor'` wird ausgelöst, bevor ein `'uncaughtException'`-Ereignis ausgelöst wird oder ein Hook, der über [`process.setUncaughtExceptionCaptureCallback()`](/de/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) installiert wurde, aufgerufen wird.

Die Installation eines `'uncaughtExceptionMonitor'`-Listeners ändert das Verhalten nicht, sobald ein `'uncaughtException'`-Ereignis ausgelöst wird. Der Prozess stürzt weiterhin ab, wenn kein `'uncaughtException'`-Listener installiert ist.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('uncaughtExceptionMonitor', (err, origin) => {
  MyMonitoringTool.logSync(err, origin);
});

// Verursacht absichtlich eine Ausnahme, fängt sie aber nicht ab.
nonexistentFunc();
// Stürzt Node.js immer noch ab
```

```js [CJS]
const process = require('node:process');

process.on('uncaughtExceptionMonitor', (err, origin) => {
  MyMonitoringTool.logSync(err, origin);
});

// Verursacht absichtlich eine Ausnahme, fängt sie aber nicht ab.
nonexistentFunc();
// Stürzt Node.js immer noch ab
```
:::


### Ereignis: `'unhandledRejection'` {#event-unhandledrejection}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v7.0.0 | Das Nicht-Behandeln von `Promise`-Ablehnungen ist veraltet. |
| v6.6.0 | Unbehandelte `Promise`-Ablehnungen geben nun eine Prozesswarnung aus. |
| v1.4.1 | Hinzugefügt in: v1.4.1 |
:::

- `reason` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Das Objekt, mit dem das Promise abgelehnt wurde (typischerweise ein [`Error`](/de/nodejs/api/errors#class-error)-Objekt).
- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Das abgelehnte Promise.

Das Ereignis `'unhandledRejection'` wird immer dann ausgelöst, wenn ein `Promise` abgelehnt wird und innerhalb einer Runde der Ereignisschleife kein Fehlerhandler an das Promise angehängt ist. Bei der Programmierung mit Promises werden Ausnahmen als "abgelehnte Promises" gekapselt. Ablehnungen können mit [`promise.catch()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) abgefangen und behandelt werden und werden durch eine `Promise`-Kette weitergegeben. Das Ereignis `'unhandledRejection'` ist nützlich, um Promises zu erkennen und zu verfolgen, die abgelehnt wurden und deren Ablehnungen noch nicht behandelt wurden.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unbehandelte Ablehnung bei:', promise, 'Grund:', reason);
  // Anwendungsspezifische Protokollierung, Auslösen eines Fehlers oder andere Logik hier
});

somePromise.then((res) => {
  return reportToUser(JSON.pasre(res)); // Beachten Sie den Tippfehler (`pasre`)
}); // Kein `.catch()` oder `.then()`
```

```js [CJS]
const process = require('node:process');

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unbehandelte Ablehnung bei:', promise, 'Grund:', reason);
  // Anwendungsspezifische Protokollierung, Auslösen eines Fehlers oder andere Logik hier
});

somePromise.then((res) => {
  return reportToUser(JSON.pasre(res)); // Beachten Sie den Tippfehler (`pasre`)
}); // Kein `.catch()` oder `.then()`
```
:::

Das Folgende wird auch das Auslösen des Ereignisses `'unhandledRejection'` auslösen:

::: code-group
```js [ESM]
import process from 'node:process';

function SomeResource() {
  // Setzen Sie den geladenen Status zunächst auf ein abgelehntes Promise
  this.loaded = Promise.reject(new Error('Ressource noch nicht geladen!'));
}

const resource = new SomeResource();
// Kein .catch oder .then auf resource.loaded für mindestens eine Runde
```

```js [CJS]
const process = require('node:process');

function SomeResource() {
  // Setzen Sie den geladenen Status zunächst auf ein abgelehntes Promise
  this.loaded = Promise.reject(new Error('Ressource noch nicht geladen!'));
}

const resource = new SomeResource();
// Kein .catch oder .then auf resource.loaded für mindestens eine Runde
```
:::

In diesem Beispielfall ist es möglich, die Ablehnung als Entwicklerfehler zu verfolgen, wie es typischerweise bei anderen `'unhandledRejection'`-Ereignissen der Fall wäre. Um solche Fehler zu beheben, kann ein nicht-operativer [`.catch(() =\> { })`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)-Handler an `resource.loaded` angehängt werden, was das Auslösen des `'unhandledRejection'`-Ereignisses verhindern würde.


### Ereignis: `'warning'` {#event-warning}

**Hinzugefügt in: v6.0.0**

- `warning` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Wichtige Eigenschaften der Warnung sind:
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Name der Warnung. **Standard:** `'Warning'`.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine vom System bereitgestellte Beschreibung der Warnung.
    - `stack` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein Stack-Trace zum Ort im Code, an dem die Warnung ausgegeben wurde.

Das Ereignis `'warning'` wird ausgelöst, wenn Node.js eine Prozesswarnung ausgibt.

Eine Prozesswarnung ähnelt einem Fehler insofern, als sie außergewöhnliche Bedingungen beschreibt, die dem Benutzer zur Kenntnis gebracht werden. Warnungen sind jedoch nicht Teil des normalen Node.js- und JavaScript-Fehlerbehandlungsablaufs. Node.js kann Warnungen ausgeben, wenn es schlechte Programmierpraktiken erkennt, die zu suboptimaler Anwendungsleistung, Fehlern oder Sicherheitslücken führen könnten.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);    // Den Namen der Warnung ausgeben
  console.warn(warning.message); // Die Warnmeldung ausgeben
  console.warn(warning.stack);   // Den Stack-Trace ausgeben
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);    // Den Namen der Warnung ausgeben
  console.warn(warning.message); // Die Warnmeldung ausgeben
  console.warn(warning.stack);   // Den Stack-Trace ausgeben
});
```
:::

Standardmäßig gibt Node.js Prozesswarnungen auf `stderr` aus. Die Befehlszeilenoption `--no-warnings` kann verwendet werden, um die Standard-Konsolenausgabe zu unterdrücken, aber das Ereignis `'warning'` wird weiterhin vom `process`-Objekt ausgelöst. Derzeit ist es nicht möglich, bestimmte Warnungstypen außer Veraltungswarnungen zu unterdrücken. Um Veraltungswarnungen zu unterdrücken, überprüfen Sie das Flag [`--no-deprecation`](/de/nodejs/api/cli#--no-deprecation).

Das folgende Beispiel veranschaulicht die Warnung, die auf `stderr` ausgegeben wird, wenn zu viele Listener zu einem Ereignis hinzugefügt wurden:

```bash [BASH]
$ node
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> (node:38638) MaxListenersExceededWarning: Possible EventEmitter memory leak
detected. 2 foo listeners added. Use emitter.setMaxListeners() to increase limit
```
Im Gegensatz dazu schaltet das folgende Beispiel die Standard-Warnungsausgabe ab und fügt einen benutzerdefinierten Handler zum Ereignis `'warning'` hinzu:

```bash [BASH]
$ node --no-warnings
> const p = process.on('warning', (warning) => console.warn('Do not do that!'));
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> Do not do that!
```
Die Befehlszeilenoption `--trace-warnings` kann verwendet werden, um die Standard-Konsolenausgabe für Warnungen um den vollständigen Stack-Trace der Warnung zu erweitern.

Das Starten von Node.js mit dem Befehlszeilenflag `--throw-deprecation` führt dazu, dass benutzerdefinierte Veraltungswarnungen als Ausnahmen ausgelöst werden.

Die Verwendung des Befehlszeilenflags `--trace-deprecation` bewirkt, dass die benutzerdefinierte Veraltung zusammen mit dem Stack-Trace auf `stderr` ausgegeben wird.

Die Verwendung des Befehlszeilenflags `--no-deprecation` unterdrückt alle Meldungen der benutzerdefinierten Veraltung.

Die Befehlszeilenflags `*-deprecation` wirken sich nur auf Warnungen aus, die den Namen `'DeprecationWarning'` verwenden.


#### Benutzerdefinierte Warnungen ausgeben {#emitting-custom-warnings}

Siehe die [`process.emitWarning()`](/de/nodejs/api/process#processemitwarningwarning-type-code-ctor)-Methode zum Ausgeben benutzerdefinierter oder anwendungsspezifischer Warnungen.

#### Node.js-Warnungsnamen {#nodejs-warning-names}

Es gibt keine strengen Richtlinien für Warnungstypen (wie durch die Eigenschaft `name` identifiziert), die von Node.js ausgegeben werden. Neue Arten von Warnungen können jederzeit hinzugefügt werden. Einige der am häufigsten vorkommenden Warnungstypen sind:

- `'DeprecationWarning'` - Gibt die Verwendung einer veralteten Node.js-API oder -Funktion an. Solche Warnungen müssen eine Eigenschaft `'code'` enthalten, die den [Veraltungscode](/de/nodejs/api/deprecations) identifiziert.
- `'ExperimentalWarning'` - Gibt die Verwendung einer experimentellen Node.js-API oder -Funktion an. Solche Funktionen müssen mit Vorsicht verwendet werden, da sie sich jederzeit ändern können und nicht denselben strengen Semantic-Versioning- und langfristigen Supportrichtlinien unterliegen wie unterstützte Funktionen.
- `'MaxListenersExceededWarning'` - Gibt an, dass zu viele Listener für ein bestimmtes Ereignis entweder auf einem `EventEmitter` oder einem `EventTarget` registriert wurden. Dies ist oft ein Hinweis auf ein Speicherleck.
- `'TimeoutOverflowWarning'` - Gibt an, dass ein numerischer Wert, der nicht in eine 32-Bit-Ganzzahl mit Vorzeichen passt, entweder an die Funktionen `setTimeout()` oder `setInterval()` übergeben wurde.
- `'TimeoutNegativeWarning'` - Gibt an, dass eine negative Zahl entweder an die Funktionen `setTimeout()` oder `setInterval()` übergeben wurde.
- `'TimeoutNaNWarning'` - Gibt an, dass ein Wert, der keine Zahl ist, entweder an die Funktionen `setTimeout()` oder `setInterval()` übergeben wurde.
- `'UnsupportedWarning'` - Gibt die Verwendung einer nicht unterstützten Option oder Funktion an, die ignoriert und nicht als Fehler behandelt wird. Ein Beispiel ist die Verwendung der HTTP-Antwortstatusmeldung bei Verwendung der HTTP/2-Kompatibilitäts-API.

### Ereignis: `'worker'` {#event-worker}

**Hinzugefügt in: v16.2.0, v14.18.0**

- `worker` [\<Worker\>](/de/nodejs/api/worker_threads#class-worker) Der erstellte [\<Worker\>](/de/nodejs/api/worker_threads#class-worker).

Das `'worker'`-Ereignis wird ausgelöst, nachdem ein neuer [\<Worker\>](/de/nodejs/api/worker_threads#class-worker)-Thread erstellt wurde.


### Signalereignisse {#signal-events}

Signalereignisse werden ausgelöst, wenn der Node.js-Prozess ein Signal empfängt. Bitte beachten Sie [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7) für eine Auflistung der standardmäßigen POSIX-Signalnamen wie `'SIGINT'`, `'SIGHUP'` usw.

Signale sind in [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Threads nicht verfügbar.

Der Signalhandler erhält den Namen des Signals (`'SIGINT'`, `'SIGTERM'`, usw.) als erstes Argument.

Der Name jedes Ereignisses ist der übliche Name in Großbuchstaben für das Signal (z. B. `'SIGINT'` für `SIGINT`-Signale).

::: code-group
```js [ESM]
import process from 'node:process';

// Beginne mit dem Lesen von stdin, damit der Prozess nicht beendet wird.
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('Received SIGINT. Press Control-D to exit.');
});

// Verwenden einer einzelnen Funktion zur Behandlung mehrerer Signale
function handle(signal) {
  console.log(`Received ${signal}`);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
```

```js [CJS]
const process = require('node:process');

// Beginne mit dem Lesen von stdin, damit der Prozess nicht beendet wird.
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('Received SIGINT. Press Control-D to exit.');
});

// Verwenden einer einzelnen Funktion zur Behandlung mehrerer Signale
function handle(signal) {
  console.log(`Received ${signal}`);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
```
:::

- `'SIGUSR1'` ist von Node.js reserviert, um den [Debugger](/de/nodejs/api/debugger) zu starten. Es ist möglich, einen Listener zu installieren, aber dies kann den Debugger beeinträchtigen.
- `'SIGTERM'` und `'SIGINT'` haben Standardhandler auf Nicht-Windows-Plattformen, die den Terminalmodus zurücksetzen, bevor sie mit dem Code `128 + Signalnummer` beendet werden. Wenn eines dieser Signale einen installierten Listener hat, wird sein Standardverhalten entfernt (Node.js wird nicht mehr beendet).
- `'SIGPIPE'` wird standardmäßig ignoriert. Es kann ein Listener installiert werden.
- `'SIGHUP'` wird unter Windows generiert, wenn das Konsolenfenster geschlossen wird, und auf anderen Plattformen unter verschiedenen ähnlichen Bedingungen. Siehe [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7). Es kann ein Listener installiert werden, aber Node.js wird von Windows etwa 10 Sekunden später bedingungslos beendet. Auf Nicht-Windows-Plattformen ist das Standardverhalten von `SIGHUP` die Beendigung von Node.js, aber sobald ein Listener installiert wurde, wird sein Standardverhalten entfernt.
- `'SIGTERM'` wird unter Windows nicht unterstützt, es kann aber darauf gehört werden.
- `'SIGINT'` vom Terminal wird auf allen Plattformen unterstützt und kann normalerweise mit + generiert werden (dies kann jedoch konfigurierbar sein). Es wird nicht generiert, wenn der [Terminal-Raw-Modus](/de/nodejs/api/tty#readstreamsetrawmodemode) aktiviert ist und + verwendet wird.
- `'SIGBREAK'` wird unter Windows gesendet, wenn + gedrückt wird. Auf Nicht-Windows-Plattformen kann darauf gehört werden, aber es gibt keine Möglichkeit, es zu senden oder zu generieren.
- `'SIGWINCH'` wird gesendet, wenn die Konsolengröße geändert wurde. Unter Windows geschieht dies nur beim Schreiben in die Konsole, wenn der Cursor bewegt wird, oder wenn ein lesbares TTY im Raw-Modus verwendet wird.
- `'SIGKILL'` kann keinen Listener installiert haben, es wird Node.js auf allen Plattformen bedingungslos beenden.
- `'SIGSTOP'` kann keinen Listener installiert haben.
- `'SIGBUS'`, `'SIGFPE'`, `'SIGSEGV'` und `'SIGILL'`, wenn sie nicht künstlich mit [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) ausgelöst werden, versetzen den Prozess von Natur aus in einen Zustand, in dem es nicht sicher ist, JS-Listener aufzurufen. Dies kann dazu führen, dass der Prozess nicht mehr reagiert.
- `0` kann gesendet werden, um die Existenz eines Prozesses zu testen. Es hat keine Auswirkung, wenn der Prozess existiert, wirft aber einen Fehler, wenn der Prozess nicht existiert.

Windows unterstützt keine Signale und hat daher kein Äquivalent zur Beendigung durch ein Signal, aber Node.js bietet eine gewisse Emulation mit [`process.kill()`](/de/nodejs/api/process#processkillpid-signal) und [`subprocess.kill()`](/de/nodejs/api/child_process#subprocesskillsignal):

- Das Senden von `SIGINT`, `SIGTERM` und `SIGKILL` führt zur bedingungslosen Beendigung des Zielprozesses, und danach meldet der Subprozess, dass der Prozess durch ein Signal beendet wurde.
- Das Senden des Signals `0` kann als plattformunabhängige Möglichkeit verwendet werden, um die Existenz eines Prozesses zu testen.


## `process.abort()` {#processabort}

**Hinzugefügt in: v0.7.0**

Die Methode `process.abort()` bewirkt, dass der Node.js-Prozess sofort beendet wird und eine Core-Datei generiert.

Diese Funktion ist in [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Threads nicht verfügbar.

## `process.allowedNodeEnvironmentFlags` {#processallowednodeenvironmentflags}

**Hinzugefügt in: v10.10.0**

- [\<Set\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)

Die Eigenschaft `process.allowedNodeEnvironmentFlags` ist ein spezielles, schreibgeschütztes `Set` von Flags, die in der Umgebungsvariable [`NODE_OPTIONS`](/de/nodejs/api/cli#node_optionsoptions) zulässig sind.

`process.allowedNodeEnvironmentFlags` erweitert `Set`, überschreibt aber `Set.prototype.has`, um mehrere verschiedene mögliche Flag-Darstellungen zu erkennen. `process.allowedNodeEnvironmentFlags.has()` gibt in den folgenden Fällen `true` zurück:

- Flags können vorangestellte einzelne (`-`) oder doppelte (`--`) Striche weglassen; z. B. `inspect-brk` für `--inspect-brk` oder `r` für `-r`.
- Flags, die an V8 weitergegeben werden (wie in `--v8-options` aufgeführt), können einen oder mehrere *nicht-führende* Striche durch einen Unterstrich ersetzen oder umgekehrt; z. B. `--perf_basic_prof`, `--perf-basic-prof`, `--perf_basic-prof` usw.
- Flags können ein oder mehrere Gleichheitszeichen (`=`) enthalten; alle Zeichen nach und einschließlich des ersten Gleichheitszeichens werden ignoriert; z. B. `--stack-trace-limit=100`.
- Flags *müssen* innerhalb von [`NODE_OPTIONS`](/de/nodejs/api/cli#node_optionsoptions) zulässig sein.

Beim Iterieren über `process.allowedNodeEnvironmentFlags` werden Flags nur *einmal* angezeigt; jedes beginnt mit einem oder mehreren Strichen. An V8 weitergegebene Flags enthalten Unterstriche anstelle von nicht-führenden Strichen:

::: code-group
```js [ESM]
import { allowedNodeEnvironmentFlags } from 'node:process';

allowedNodeEnvironmentFlags.forEach((flag) => {
  // -r
  // --inspect-brk
  // --abort_on_uncaught_exception
  // ...
});
```

```js [CJS]
const { allowedNodeEnvironmentFlags } = require('node:process');

allowedNodeEnvironmentFlags.forEach((flag) => {
  // -r
  // --inspect-brk
  // --abort_on_uncaught_exception
  // ...
});
```
:::

Die Methoden `add()`, `clear()` und `delete()` von `process.allowedNodeEnvironmentFlags` bewirken nichts und schlagen stillschweigend fehl.

Wenn Node.js *ohne* [`NODE_OPTIONS`](/de/nodejs/api/cli#node_optionsoptions)-Unterstützung kompiliert wurde (angezeigt in [`process.config`](/de/nodejs/api/process#processconfig)), enthält `process.allowedNodeEnvironmentFlags` das, was *wäre* zulässig gewesen.


## `process.arch` {#processarch}

**Hinzugefügt in: v0.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die CPU-Architektur des Betriebssystems, für die die Node.js-Binärdatei kompiliert wurde. Mögliche Werte sind: `'arm'`, `'arm64'`, `'ia32'`, `'loong64'`, `'mips'`, `'mipsel'`, `'ppc'`, `'ppc64'`, `'riscv64'`, `'s390'`, `'s390x'` und `'x64'`.

::: code-group
```js [ESM]
import { arch } from 'node:process';

console.log(`Die Prozessorarchitektur ist ${arch}`);
```

```js [CJS]
const { arch } = require('node:process');

console.log(`Die Prozessorarchitektur ist ${arch}`);
```
:::

## `process.argv` {#processargv}

**Hinzugefügt in: v0.1.27**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Eigenschaft `process.argv` gibt ein Array zurück, das die Befehlszeilenargumente enthält, die beim Starten des Node.js-Prozesses übergeben wurden. Das erste Element ist [`process.execPath`](/de/nodejs/api/process#processexecpath). Siehe `process.argv0`, wenn Zugriff auf den Originalwert von `argv[0]` benötigt wird. Das zweite Element ist der Pfad zu der ausgeführten JavaScript-Datei. Die restlichen Elemente sind alle zusätzlichen Befehlszeilenargumente.

Angenommen, das folgende Skript für `process-args.js`:

::: code-group
```js [ESM]
import { argv } from 'node:process';

// print process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```

```js [CJS]
const { argv } = require('node:process');

// print process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```
:::

Starten des Node.js-Prozesses als:

```bash [BASH]
node process-args.js one two=three four
```
Würde die folgende Ausgabe erzeugen:

```text [TEXT]
0: /usr/local/bin/node
1: /Users/mjr/work/node/process-args.js
2: one
3: two=three
4: four
```
## `process.argv0` {#processargv0}

**Hinzugefügt in: v6.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Eigenschaft `process.argv0` speichert eine schreibgeschützte Kopie des ursprünglichen Werts von `argv[0]`, der beim Starten von Node.js übergeben wurde.

```bash [BASH]
$ bash -c 'exec -a customArgv0 ./node'
> process.argv[0]
'/Volumes/code/external/node/out/Release/node'
> process.argv0
'customArgv0'
```

## `process.channel` {#processchannel}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.0.0 | Das Objekt legt nicht mehr versehentlich native C++-Bindungen offen. |
| v7.1.0 | Hinzugefügt in: v7.1.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Wenn der Node.js-Prozess mit einem IPC-Kanal gestartet wurde (siehe die [Child Process](/de/nodejs/api/child_process)-Dokumentation), ist die Eigenschaft `process.channel` eine Referenz auf den IPC-Kanal. Wenn kein IPC-Kanal vorhanden ist, ist diese Eigenschaft `undefined`.

### `process.channel.ref()` {#processchannelref}

**Hinzugefügt in: v7.1.0**

Diese Methode sorgt dafür, dass der IPC-Kanal die Event-Loop des Prozesses am Laufen hält, wenn zuvor `.unref()` aufgerufen wurde.

Typischerweise wird dies über die Anzahl der `'disconnect'`- und `'message'`-Listener auf dem `process`-Objekt verwaltet. Diese Methode kann jedoch verwendet werden, um explizit ein bestimmtes Verhalten anzufordern.

### `process.channel.unref()` {#processchannelunref}

**Hinzugefügt in: v7.1.0**

Diese Methode sorgt dafür, dass der IPC-Kanal die Event-Loop des Prozesses nicht am Laufen hält und lässt ihn auch dann beenden, wenn der Kanal geöffnet ist.

Typischerweise wird dies über die Anzahl der `'disconnect'`- und `'message'`-Listener auf dem `process`-Objekt verwaltet. Diese Methode kann jedoch verwendet werden, um explizit ein bestimmtes Verhalten anzufordern.

## `process.chdir(directory)` {#processchdirdirectory}

**Hinzugefügt in: v0.1.17**

- `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Methode `process.chdir()` ändert das aktuelle Arbeitsverzeichnis des Node.js-Prozesses oder wirft eine Ausnahme, wenn dies fehlschlägt (z. B. wenn das angegebene `directory` nicht existiert).

::: code-group
```js [ESM]
import { chdir, cwd } from 'node:process';

console.log(`Startverzeichnis: ${cwd()}`);
try {
  chdir('/tmp');
  console.log(`Neues Verzeichnis: ${cwd()}`);
} catch (err) {
  console.error(`chdir: ${err}`);
}
```

```js [CJS]
const { chdir, cwd } = require('node:process');

console.log(`Startverzeichnis: ${cwd()}`);
try {
  chdir('/tmp');
  console.log(`Neues Verzeichnis: ${cwd()}`);
} catch (err) {
  console.error(`chdir: ${err}`);
}
```
:::

Diese Funktion ist in [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Threads nicht verfügbar.


## `process.config` {#processconfig}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Das `process.config`-Objekt ist jetzt eingefroren. |
| v16.0.0 | Das Modifizieren von process.config ist veraltet. |
| v0.7.7 | Hinzugefügt in: v0.7.7 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Die Eigenschaft `process.config` gibt ein eingefrorenes `Object` zurück, das die JavaScript-Darstellung der Konfigurationsoptionen enthält, die zum Kompilieren der aktuellen Node.js-Executable verwendet wurden. Dies entspricht der Datei `config.gypi`, die beim Ausführen des Skripts `./configure` erstellt wurde.

Ein Beispiel für die mögliche Ausgabe sieht wie folgt aus:

```js [ESM]
{
  target_defaults:
   { cflags: [],
     default_configuration: 'Release',
     defines: [],
     include_dirs: [],
     libraries: [] },
  variables:
   {
     host_arch: 'x64',
     napi_build_version: 5,
     node_install_npm: 'true',
     node_prefix: '',
     node_shared_cares: 'false',
     node_shared_http_parser: 'false',
     node_shared_libuv: 'false',
     node_shared_zlib: 'false',
     node_use_openssl: 'true',
     node_shared_openssl: 'false',
     target_arch: 'x64',
     v8_use_snapshot: 1
   }
}
```
## `process.connected` {#processconnected}

**Hinzugefügt in: v0.7.2**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wenn der Node.js-Prozess mit einem IPC-Kanal erzeugt wird (siehe die Dokumentation zu [Child Process](/de/nodejs/api/child_process) und [Cluster](/de/nodejs/api/cluster)), gibt die Eigenschaft `process.connected` `true` zurück, solange der IPC-Kanal verbunden ist, und `false`, nachdem `process.disconnect()` aufgerufen wurde.

Sobald `process.connected` `false` ist, ist es nicht mehr möglich, Nachrichten über den IPC-Kanal mit `process.send()` zu senden.

## `process.constrainedMemory()` {#processconstrainedmemory}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.0.0, v20.13.0 | Rückgabewert an `uv_get_constrained_memory` ausgerichtet. |
| v19.6.0, v18.15.0 | Hinzugefügt in: v19.6.0, v18.15.0 |
:::

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Ermittelt die Menge an Speicher, die dem Prozess basierend auf den vom Betriebssystem auferlegten Beschränkungen zur Verfügung steht (in Byte). Wenn es keine solche Beschränkung gibt oder die Beschränkung unbekannt ist, wird `0` zurückgegeben.

Weitere Informationen finden Sie unter [`uv_get_constrained_memory`](https://docs.libuv.org/en/v1.x/misc#c.uv_get_constrained_memory).


## `process.availableMemory()` {#processavailablememory}

**Hinzugefügt in: v22.0.0, v20.13.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Ermittelt die Menge an freiem Speicher, die dem Prozess noch zur Verfügung steht (in Byte).

Weitere Informationen finden Sie unter [`uv_get_available_memory`](https://docs.libuv.org/en/v1.x/misc#c.uv_get_available_memory).

## `process.cpuUsage([previousValue])` {#processcpuusagepreviousvalue}

**Hinzugefügt in: v6.1.0**

- `previousValue` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein vorheriger Rückgabewert vom Aufruf von `process.cpuUsage()`
- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `user` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `system` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Methode `process.cpuUsage()` gibt die User- und System-CPU-Zeitnutzung des aktuellen Prozesses zurück, in einem Objekt mit den Eigenschaften `user` und `system`, deren Werte Mikrosekundenwerte sind (Millionstel einer Sekunde). Diese Werte messen die Zeit, die im User- bzw. Systemcode verbracht wurde, und können größer sein als die tatsächlich verstrichene Zeit, wenn mehrere CPU-Kerne Arbeit für diesen Prozess verrichten.

Das Ergebnis eines vorherigen Aufrufs von `process.cpuUsage()` kann als Argument an die Funktion übergeben werden, um eine Differenzmessung zu erhalten.

::: code-group
```js [ESM]
import { cpuUsage } from 'node:process';

const startUsage = cpuUsage();
// { user: 38579, system: 6986 }

// die CPU für 500 Millisekunden auslasten
const now = Date.now();
while (Date.now() - now < 500);

console.log(cpuUsage(startUsage));
// { user: 514883, system: 11226 }
```

```js [CJS]
const { cpuUsage } = require('node:process');

const startUsage = cpuUsage();
// { user: 38579, system: 6986 }

// die CPU für 500 Millisekunden auslasten
const now = Date.now();
while (Date.now() - now < 500);

console.log(cpuUsage(startUsage));
// { user: 514883, system: 11226 }
```
:::


## `process.cwd()` {#processcwd}

**Hinzugefügt in: v0.1.8**

- Rückgabe: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die `process.cwd()`-Methode gibt das aktuelle Arbeitsverzeichnis des Node.js-Prozesses zurück.

::: code-group
```js [ESM]
import { cwd } from 'node:process';

console.log(`Aktuelles Verzeichnis: ${cwd()}`);
```

```js [CJS]
const { cwd } = require('node:process');

console.log(`Aktuelles Verzeichnis: ${cwd()}`);
```
:::

## `process.debugPort` {#processdebugport}

**Hinzugefügt in: v0.7.2**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Der Port, der vom Node.js-Debugger verwendet wird, wenn er aktiviert ist.

::: code-group
```js [ESM]
import process from 'node:process';

process.debugPort = 5858;
```

```js [CJS]
const process = require('node:process');

process.debugPort = 5858;
```
:::

## `process.disconnect()` {#processdisconnect}

**Hinzugefügt in: v0.7.2**

Wenn der Node.js-Prozess mit einem IPC-Kanal gestartet wird (siehe die Dokumentation zu [Child Process](/de/nodejs/api/child_process) und [Cluster](/de/nodejs/api/cluster)), schließt die `process.disconnect()`-Methode den IPC-Kanal zum übergeordneten Prozess, sodass der untergeordnete Prozess ordnungsgemäß beendet werden kann, sobald keine anderen Verbindungen mehr bestehen, die ihn am Leben erhalten.

Der Effekt des Aufrufs von `process.disconnect()` ist derselbe wie der Aufruf von [`ChildProcess.disconnect()`](/de/nodejs/api/child_process#subprocessdisconnect) vom übergeordneten Prozess aus.

Wenn der Node.js-Prozess nicht mit einem IPC-Kanal gestartet wurde, ist `process.disconnect()` `undefined`.

## `process.dlopen(module, filename[, flags])` {#processdlopenmodule-filename-flags}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v9.0.0 | Unterstützung für das `flags`-Argument hinzugefügt. |
| v0.1.16 | Hinzugefügt in: v0.1.16 |
:::

- `module` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `flags` [\<os.constants.dlopen\>](/de/nodejs/api/os#dlopen-constants) **Standard:** `os.constants.dlopen.RTLD_LAZY`

Die `process.dlopen()`-Methode ermöglicht das dynamische Laden von gemeinsam genutzten Objekten. Sie wird hauptsächlich von `require()` verwendet, um C++-Addons zu laden, und sollte nur in Sonderfällen direkt verwendet werden. Mit anderen Worten, [`require()`](/de/nodejs/api/globals#require) sollte gegenüber `process.dlopen()` bevorzugt werden, es sei denn, es gibt bestimmte Gründe wie z. B. benutzerdefinierte dlopen-Flags oder das Laden von ES-Modulen.

Das `flags`-Argument ist eine Ganzzahl, mit der das dlopen-Verhalten festgelegt werden kann. Siehe die Dokumentation [`os.constants.dlopen`](/de/nodejs/api/os#dlopen-constants) für Details.

Eine wichtige Voraussetzung beim Aufruf von `process.dlopen()` ist, dass die `module`-Instanz übergeben werden muss. Funktionen, die vom C++-Addon exportiert werden, sind dann über `module.exports` zugänglich.

Das folgende Beispiel zeigt, wie ein C++-Addon namens `local.node` geladen wird, das eine `foo`-Funktion exportiert. Alle Symbole werden geladen, bevor der Aufruf zurückkehrt, indem die Konstante `RTLD_NOW` übergeben wird. In diesem Beispiel wird davon ausgegangen, dass die Konstante verfügbar ist.

::: code-group
```js [ESM]
import { dlopen } from 'node:process';
import { constants } from 'node:os';
import { fileURLToPath } from 'node:url';

const module = { exports: {} };
dlopen(module, fileURLToPath(new URL('local.node', import.meta.url)),
       constants.dlopen.RTLD_NOW);
module.exports.foo();
```

```js [CJS]
const { dlopen } = require('node:process');
const { constants } = require('node:os');
const { join } = require('node:path');

const module = { exports: {} };
dlopen(module, join(__dirname, 'local.node'), constants.dlopen.RTLD_NOW);
module.exports.foo();
```
:::


## `process.emitWarning(warning[, options])` {#processemitwarningwarning-options}

**Hinzugefügt in: v8.0.0**

- `warning` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Die auszugebende Warnung.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn `warning` ein `String` ist, ist `type` der Name, der für den *Typ* der ausgegebenen Warnung verwendet werden soll. **Standard:** `'Warning'`.
    - `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine eindeutige Kennung für die ausgegebene Warnungsinstanz.
    - `ctor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wenn `warning` ein `String` ist, ist `ctor` eine optionale Funktion, die verwendet wird, um den generierten Stack-Trace zu begrenzen. **Standard:** `process.emitWarning`.
    - `detail` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Zusätzlicher Text, der in die Fehlermeldung aufgenommen werden soll.
  
 

Die Methode `process.emitWarning()` kann verwendet werden, um benutzerdefinierte oder anwendungsspezifische Prozesswarnungen auszugeben. Diese können abgehört werden, indem ein Handler zum [`'warning'`](/de/nodejs/api/process#event-warning)-Ereignis hinzugefügt wird.



::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Eine Warnung mit einem Code und zusätzlichen Details ausgeben.
emitWarning('Etwas ist passiert!', {
  code: 'MEINE_WARNUNG',
  detail: 'Dies sind einige zusätzliche Informationen',
});
// Gibt aus:
// (node:56338) [MEINE_WARNUNG] Warning: Etwas ist passiert!
// Dies sind einige zusätzliche Informationen
```

```js [CJS]
const { emitWarning } = require('node:process');

// Eine Warnung mit einem Code und zusätzlichen Details ausgeben.
emitWarning('Etwas ist passiert!', {
  code: 'MEINE_WARNUNG',
  detail: 'Dies sind einige zusätzliche Informationen',
});
// Gibt aus:
// (node:56338) [MEINE_WARNUNG] Warning: Etwas ist passiert!
// Dies sind einige zusätzliche Informationen
```
:::

In diesem Beispiel wird intern von `process.emitWarning()` ein `Error`-Objekt generiert und an den [`'warning'`](/de/nodejs/api/process#event-warning)-Handler übergeben.



::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);    // 'Warning'
  console.warn(warning.message); // 'Etwas ist passiert!'
  console.warn(warning.code);    // 'MEINE_WARNUNG'
  console.warn(warning.stack);   // Stack-Trace
  console.warn(warning.detail);  // 'Dies sind einige zusätzliche Informationen'
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);    // 'Warning'
  console.warn(warning.message); // 'Etwas ist passiert!'
  console.warn(warning.code);    // 'MEINE_WARNUNG'
  console.warn(warning.stack);   // Stack-Trace
  console.warn(warning.detail);  // 'Dies sind einige zusätzliche Informationen'
});
```
:::

Wenn `warning` als `Error`-Objekt übergeben wird, wird das `options`-Argument ignoriert.


## `process.emitWarning(warning[, type[, code]][, ctor])` {#processemitwarningwarning-type-code-ctor}

**Hinzugefügt in: v6.0.0**

- `warning` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Die auszugebende Warnung.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn `warning` ein `String` ist, ist `type` der Name, der für den *Typ* der ausgegebenen Warnung verwendet werden soll. **Standard:** `'Warning'`.
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine eindeutige Kennung für die ausgegebene Warnungsinstanz.
- `ctor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wenn `warning` ein `String` ist, ist `ctor` eine optionale Funktion, die verwendet wird, um den generierten Stack-Trace zu begrenzen. **Standard:** `process.emitWarning`.

Die Methode `process.emitWarning()` kann verwendet werden, um benutzerdefinierte oder anwendungsspezifische Prozesswarnungen auszugeben. Diese können abgefangen werden, indem ein Handler zum [`'warning'`](/de/nodejs/api/process#event-warning)-Ereignis hinzugefügt wird.

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Eine Warnung mithilfe einer Zeichenkette ausgeben.
emitWarning('Something happened!');
// Gibt aus: (node: 56338) Warning: Something happened!
```

```js [CJS]
const { emitWarning } = require('node:process');

// Eine Warnung mithilfe einer Zeichenkette ausgeben.
emitWarning('Something happened!');
// Gibt aus: (node: 56338) Warning: Something happened!
```
:::

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Eine Warnung mithilfe einer Zeichenkette und eines Typs ausgeben.
emitWarning('Something Happened!', 'CustomWarning');
// Gibt aus: (node:56338) CustomWarning: Something Happened!
```

```js [CJS]
const { emitWarning } = require('node:process');

// Eine Warnung mithilfe einer Zeichenkette und eines Typs ausgeben.
emitWarning('Something Happened!', 'CustomWarning');
// Gibt aus: (node:56338) CustomWarning: Something Happened!
```
:::

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

emitWarning('Something happened!', 'CustomWarning', 'WARN001');
// Gibt aus: (node:56338) [WARN001] CustomWarning: Something happened!
```

```js [CJS]
const { emitWarning } = require('node:process');

process.emitWarning('Something happened!', 'CustomWarning', 'WARN001');
// Gibt aus: (node:56338) [WARN001] CustomWarning: Something happened!
```
:::

In jedem der vorherigen Beispiele wird intern ein `Error`-Objekt von `process.emitWarning()` generiert und an den [`'warning'`](/de/nodejs/api/process#event-warning)-Handler übergeben.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.code);
  console.warn(warning.stack);
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.code);
  console.warn(warning.stack);
});
```
:::

Wenn `warning` als ein `Error`-Objekt übergeben wird, wird es unverändert an den `'warning'`-Ereignishandler übergeben (und die optionalen Argumente `type`, `code` und `ctor` werden ignoriert):

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Eine Warnung mithilfe eines Error-Objekts ausgeben.
const myWarning = new Error('Something happened!');
// Verwenden Sie die Error-Name-Eigenschaft, um den Typnamen anzugeben
myWarning.name = 'CustomWarning';
myWarning.code = 'WARN001';

emitWarning(myWarning);
// Gibt aus: (node:56338) [WARN001] CustomWarning: Something happened!
```

```js [CJS]
const { emitWarning } = require('node:process');

// Eine Warnung mithilfe eines Error-Objekts ausgeben.
const myWarning = new Error('Something happened!');
// Verwenden Sie die Error-Name-Eigenschaft, um den Typnamen anzugeben
myWarning.name = 'CustomWarning';
myWarning.code = 'WARN001';

emitWarning(myWarning);
// Gibt aus: (node:56338) [WARN001] CustomWarning: Something happened!
```
:::

Ein `TypeError` wird geworfen, wenn `warning` etwas anderes als eine Zeichenkette oder ein `Error`-Objekt ist.

Obwohl Prozesswarnungen `Error`-Objekte verwenden, ist der Prozesswarnmechanismus **kein** Ersatz für normale Fehlerbehandlungsmechanismen.

Die folgende zusätzliche Behandlung wird implementiert, wenn der Warnungstyp `'DeprecationWarning'` ist:

- Wenn das Kommandozeilen-Flag `--throw-deprecation` verwendet wird, wird die Veraltungswarnung als Ausnahme ausgelöst, anstatt als Ereignis ausgegeben zu werden.
- Wenn das Kommandozeilen-Flag `--no-deprecation` verwendet wird, wird die Veraltungswarnung unterdrückt.
- Wenn das Kommandozeilen-Flag `--trace-deprecation` verwendet wird, wird die Veraltungswarnung zusammen mit dem vollständigen Stack-Trace auf `stderr` ausgegeben.


### Vermeidung doppelter Warnungen {#avoiding-duplicate-warnings}

Als bewährte Methode sollten Warnungen nur einmal pro Prozess ausgegeben werden. Platzieren Sie dazu `emitWarning()` hinter einem booleschen Wert.

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

function emitMyWarning() {
  if (!emitMyWarning.warned) {
    emitMyWarning.warned = true;
    emitWarning('Only warn once!');
  }
}
emitMyWarning();
// Emits: (node: 56339) Warning: Only warn once!
emitMyWarning();
// Emits nothing
```

```js [CJS]
const { emitWarning } = require('node:process');

function emitMyWarning() {
  if (!emitMyWarning.warned) {
    emitMyWarning.warned = true;
    emitWarning('Only warn once!');
  }
}
emitMyWarning();
// Emits: (node: 56339) Warning: Only warn once!
emitMyWarning();
// Emits nothing
```
:::

## `process.env` {#processenv}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v11.14.0 | Worker-Threads verwenden jetzt standardmäßig eine Kopie von `process.env` des übergeordneten Threads, die über die Option `env` des `Worker`-Konstruktors konfigurierbar ist. |
| v10.0.0 | Implizite Konvertierung des Variablenwerts in einen String ist veraltet. |
| v0.1.27 | Hinzugefügt in: v0.1.27 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Die Eigenschaft `process.env` gibt ein Objekt zurück, das die Benutzerumgebung enthält. Siehe [`environ(7)`](http://man7.org/linux/man-pages/man7/environ.7).

Ein Beispiel für dieses Objekt sieht wie folgt aus:

```js [ESM]
{
  TERM: 'xterm-256color',
  SHELL: '/usr/local/bin/bash',
  USER: 'maciej',
  PATH: '~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin',
  PWD: '/Users/maciej',
  EDITOR: 'vim',
  SHLVL: '1',
  HOME: '/Users/maciej',
  LOGNAME: 'maciej',
  _: '/usr/local/bin/node'
}
```
Es ist möglich, dieses Objekt zu ändern, aber solche Änderungen werden sich nicht außerhalb des Node.js-Prozesses oder (sofern nicht explizit angefordert) auf andere [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Threads auswirken. Mit anderen Worten, das folgende Beispiel würde nicht funktionieren:

```bash [BASH]
node -e 'process.env.foo = "bar"' && echo $foo
```
Während Folgendes funktionieren wird:

::: code-group
```js [ESM]
import { env } from 'node:process';

env.foo = 'bar';
console.log(env.foo);
```

```js [CJS]
const { env } = require('node:process');

env.foo = 'bar';
console.log(env.foo);
```
:::

Das Zuweisen einer Eigenschaft zu `process.env` konvertiert den Wert implizit in einen String. **Dieses Verhalten ist veraltet.** Zukünftige Versionen von Node.js können einen Fehler auslösen, wenn der Wert kein String, keine Zahl oder kein boolescher Wert ist.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.test = null;
console.log(env.test);
// => 'null'
env.test = undefined;
console.log(env.test);
// => 'undefined'
```

```js [CJS]
const { env } = require('node:process');

env.test = null;
console.log(env.test);
// => 'null'
env.test = undefined;
console.log(env.test);
// => 'undefined'
```
:::

Verwenden Sie `delete`, um eine Eigenschaft aus `process.env` zu löschen.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.TEST = 1;
delete env.TEST;
console.log(env.TEST);
// => undefined
```

```js [CJS]
const { env } = require('node:process');

env.TEST = 1;
delete env.TEST;
console.log(env.TEST);
// => undefined
```
:::

Unter Windows-Betriebssystemen wird bei Umgebungsvariablen die Groß-/Kleinschreibung nicht beachtet.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.TEST = 1;
console.log(env.test);
// => 1
```

```js [CJS]
const { env } = require('node:process');

env.TEST = 1;
console.log(env.test);
// => 1
```
:::

Sofern nicht explizit beim Erstellen einer [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Instanz angegeben, verfügt jeder [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Thread über eine eigene Kopie von `process.env`, die auf `process.env` des übergeordneten Threads oder auf dem basiert, was als `env`-Option für den [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Konstruktor angegeben wurde. Änderungen an `process.env` sind nicht über [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Threads hinweg sichtbar, und nur der Hauptthread kann Änderungen vornehmen, die für das Betriebssystem oder für native Add-Ons sichtbar sind. Unter Windows verhält sich eine Kopie von `process.env` auf einer [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Instanz im Gegensatz zum Hauptthread fallabhängig.


## `process.execArgv` {#processexecargv}

**Hinzugefügt in: v0.7.7**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Eigenschaft `process.execArgv` gibt die Menge der Node.js-spezifischen Befehlszeilenoptionen zurück, die beim Starten des Node.js-Prozesses übergeben wurden. Diese Optionen erscheinen nicht in dem Array, das von der Eigenschaft [`process.argv`](/de/nodejs/api/process#processargv) zurückgegeben wird, und beinhalten nicht die Node.js-Executable, den Namen des Skripts oder Optionen, die dem Skriptnamen folgen. Diese Optionen sind nützlich, um Kindprozesse mit der gleichen Ausführungsumgebung wie das Elternteil zu erzeugen.

```bash [BASH]
node --icu-data-dir=./foo --require ./bar.js script.js --version
```
Ergibt in `process.execArgv`:

```json [JSON]
["--icu-data-dir=./foo", "--require", "./bar.js"]
```
Und `process.argv`:

```js [ESM]
['/usr/local/bin/node', 'script.js', '--version']
```
Siehe [`Worker` constructor](/de/nodejs/api/worker_threads#new-workerfilename-options) für das detaillierte Verhalten von Worker-Threads mit dieser Eigenschaft.

## `process.execPath` {#processexecpath}

**Hinzugefügt in: v0.1.100**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Eigenschaft `process.execPath` gibt den absoluten Pfadnamen der ausführbaren Datei zurück, die den Node.js-Prozess gestartet hat. Symbolische Links werden, falls vorhanden, aufgelöst.

```js [ESM]
'/usr/local/bin/node'
```
## `process.exit([code])` {#processexitcode}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.0.0 | Akzeptiert nur einen Code vom Typ number oder vom Typ string, wenn er eine ganze Zahl darstellt. |
| v0.1.13 | Hinzugefügt in: v0.1.13 |
:::

- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Der Exit-Code. Für den String-Typ sind nur Integer-Strings (z. B. '1') zulässig. **Standard:** `0`.

Die Methode `process.exit()` weist Node.js an, den Prozess synchron mit einem Exit-Status von `code` zu beenden. Wenn `code` weggelassen wird, verwendet exit entweder den 'success'-Code `0` oder den Wert von `process.exitCode`, falls dieser gesetzt wurde. Node.js wird erst beendet, wenn alle [`'exit'`](/de/nodejs/api/process#event-exit)-Event-Listener aufgerufen wurden.

Um mit einem 'failure'-Code zu beenden:

::: code-group
```js [ESM]
import { exit } from 'node:process';

exit(1);
```

```js [CJS]
const { exit } = require('node:process');

exit(1);
```
:::

Die Shell, die Node.js ausgeführt hat, sollte den Exit-Code als `1` sehen.

Der Aufruf von `process.exit()` zwingt den Prozess, so schnell wie möglich zu beenden, auch wenn noch asynchrone Operationen ausstehen, die noch nicht vollständig abgeschlossen sind, einschließlich I/O-Operationen zu `process.stdout` und `process.stderr`.

In den meisten Situationen ist es nicht wirklich notwendig, `process.exit()` explizit aufzurufen. Der Node.js-Prozess wird von selbst beendet, *wenn keine zusätzliche Arbeit in der Event-Loop aussteht*. Die Eigenschaft `process.exitCode` kann gesetzt werden, um dem Prozess mitzuteilen, welchen Exit-Code er verwenden soll, wenn der Prozess ordnungsgemäß beendet wird.

Das folgende Beispiel veranschaulicht beispielsweise einen *Missbrauch* der Methode `process.exit()`, der dazu führen könnte, dass Daten, die in stdout ausgegeben werden, abgeschnitten werden und verloren gehen:

::: code-group
```js [ESM]
import { exit } from 'node:process';

// Dies ist ein Beispiel dafür, was *nicht* getan werden sollte:
if (someConditionNotMet()) {
  printUsageToStdout();
  exit(1);
}
```

```js [CJS]
const { exit } = require('node:process');

// Dies ist ein Beispiel dafür, was *nicht* getan werden sollte:
if (someConditionNotMet()) {
  printUsageToStdout();
  exit(1);
}
```
:::

Der Grund dafür, dass dies problematisch ist, liegt darin, dass Schreibvorgänge nach `process.stdout` in Node.js manchmal *asynchron* sind und über mehrere Ticks der Node.js-Event-Loop erfolgen können. Der Aufruf von `process.exit()` zwingt den Prozess jedoch, *bevor* diese zusätzlichen Schreibvorgänge nach `stdout` ausgeführt werden können.

Anstatt `process.exit()` direkt aufzurufen, *sollte* der Code `process.exitCode` setzen und dem Prozess erlauben, sich auf natürliche Weise zu beenden, indem er keine zusätzliche Arbeit für die Event-Loop einplant:

::: code-group
```js [ESM]
import process from 'node:process';

// So setzen Sie den Exit-Code richtig, während
// der Prozess sich ordnungsgemäß beenden kann.
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
```

```js [CJS]
const process = require('node:process');

// So setzen Sie den Exit-Code richtig, während
// der Prozess sich ordnungsgemäß beenden kann.
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
```
:::

Wenn es notwendig ist, den Node.js-Prozess aufgrund einer Fehlersituation zu beenden, ist das Auslösen eines *unbehandelten* Fehlers und das entsprechende Beenden des Prozesses sicherer als der Aufruf von `process.exit()`.

In [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Threads stoppt diese Funktion den aktuellen Thread anstelle des aktuellen Prozesses.


## `process.exitCode` {#processexitcode_1}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.0.0 | Akzeptiert nur einen Code vom Typ Zahl oder vom Typ Zeichenkette, wenn er eine Ganzzahl darstellt. |
| v0.11.8 | Hinzugefügt in: v0.11.8 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Der Exit-Code. Für den Zeichenkettentyp sind nur ganzzahlige Zeichenketten (z. B. "1") zulässig. **Standard:** `undefined`.

Eine Zahl, die der Prozess-Exit-Code sein wird, wenn der Prozess entweder ordnungsgemäß beendet wird oder über [`process.exit()`](/de/nodejs/api/process#processexitcode) ohne Angabe eines Codes beendet wird.

Die Angabe eines Codes für [`process.exit(code)`](/de/nodejs/api/process#processexitcode) überschreibt jede vorherige Einstellung von `process.exitCode`.

## `process.features.cached_builtins` {#processfeaturescached_builtins}

**Hinzugefügt in: v12.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ein boolescher Wert, der `true` ist, wenn der aktuelle Node.js-Build integrierte Module zwischenspeichert.

## `process.features.debug` {#processfeaturesdebug}

**Hinzugefügt in: v0.5.5**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ein boolescher Wert, der `true` ist, wenn der aktuelle Node.js-Build ein Debug-Build ist.

## `process.features.inspector` {#processfeaturesinspector}

**Hinzugefügt in: v11.10.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ein boolescher Wert, der `true` ist, wenn der aktuelle Node.js-Build den Inspektor enthält.

## `process.features.ipv6` {#processfeaturesipv6}

**Hinzugefügt in: v0.5.3**

**Veraltet seit: v23.4.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet. Diese Eigenschaft ist immer wahr, und alle darauf basierenden Prüfungen sind überflüssig.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ein boolescher Wert, der `true` ist, wenn der aktuelle Node.js-Build die Unterstützung für IPv6 enthält.

Da alle Node.js-Builds IPv6-Unterstützung haben, ist dieser Wert immer `true`.


## `process.features.require_module` {#processfeaturesrequire_module}

**Hinzugefügt in: v23.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ein boolescher Wert, der `true` ist, wenn der aktuelle Node.js-Build das [Laden von ECMAScript-Modulen mit `require()` unterstützt](/de/nodejs/api/modules#loading-ecmascript-modules-using-require).

## `process.features.tls` {#processfeaturestls}

**Hinzugefügt in: v0.5.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ein boolescher Wert, der `true` ist, wenn der aktuelle Node.js-Build Unterstützung für TLS enthält.

## `process.features.tls_alpn` {#processfeaturestls_alpn}

**Hinzugefügt in: v4.8.0**

**Veraltet seit: v23.4.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet. Verwenden Sie stattdessen `process.features.tls`.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ein boolescher Wert, der `true` ist, wenn der aktuelle Node.js-Build Unterstützung für ALPN in TLS enthält.

In Node.js 11.0.0 und späteren Versionen bieten die OpenSSL-Abhängigkeiten bedingungslose ALPN-Unterstützung. Dieser Wert ist daher identisch mit dem von `process.features.tls`.

## `process.features.tls_ocsp` {#processfeaturestls_ocsp}

**Hinzugefügt in: v0.11.13**

**Veraltet seit: v23.4.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet. Verwenden Sie stattdessen `process.features.tls`.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ein boolescher Wert, der `true` ist, wenn der aktuelle Node.js-Build Unterstützung für OCSP in TLS enthält.

In Node.js 11.0.0 und späteren Versionen bieten die OpenSSL-Abhängigkeiten bedingungslose OCSP-Unterstützung. Dieser Wert ist daher identisch mit dem von `process.features.tls`.

## `process.features.tls_sni` {#processfeaturestls_sni}

**Hinzugefügt in: v0.5.3**

**Veraltet seit: v23.4.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet. Verwenden Sie stattdessen `process.features.tls`.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ein boolescher Wert, der `true` ist, wenn der aktuelle Node.js-Build Unterstützung für SNI in TLS enthält.

In Node.js 11.0.0 und späteren Versionen bieten die OpenSSL-Abhängigkeiten bedingungslose SNI-Unterstützung. Dieser Wert ist daher identisch mit dem von `process.features.tls`.


## `process.features.typescript` {#processfeaturestypescript}

**Hinzugefügt in: v23.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ein Wert, der `"strip"` ist, wenn Node.js mit `--experimental-strip-types` ausgeführt wird, `"transform"` wenn Node.js mit `--experimental-transform-types` ausgeführt wird und andernfalls `false`.

## `process.features.uv` {#processfeaturesuv}

**Hinzugefügt in: v0.5.3**

**Veraltet seit: v23.4.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet. Diese Eigenschaft ist immer wahr, und alle darauf basierenden Prüfungen sind redundant.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ein boolescher Wert, der `true` ist, wenn der aktuelle Node.js-Build Unterstützung für libuv enthält.

Da es nicht möglich ist, Node.js ohne libuv zu erstellen, ist dieser Wert immer `true`.

## `process.finalization.register(ref, callback)` {#processfinalizationregisterref-callback}

**Hinzugefügt in: v22.5.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Referenz auf die Ressource, die verfolgt wird.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Callback-Funktion, die aufgerufen werden soll, wenn die Ressource finalisiert wird.
    - `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Referenz auf die Ressource, die verfolgt wird.
    - `event` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Das Ereignis, das die Finalisierung ausgelöst hat. Standardwert ist 'exit'.



Diese Funktion registriert einen Callback, der aufgerufen wird, wenn der Prozess das `exit`-Ereignis ausgibt, falls das `ref`-Objekt nicht durch Garbage Collection bereinigt wurde. Wenn das Objekt `ref` vor dem Ausgeben des `exit`-Ereignisses durch Garbage Collection bereinigt wurde, wird der Callback aus der Finalisierungsregistrierung entfernt und nicht beim Beenden des Prozesses aufgerufen.

Innerhalb des Callbacks können Sie die vom `ref`-Objekt zugewiesenen Ressourcen freigeben. Beachten Sie, dass alle für das `beforeExit`-Ereignis geltenden Einschränkungen auch für die `callback`-Funktion gelten. Dies bedeutet, dass es unter besonderen Umständen möglich ist, dass der Callback nicht aufgerufen wird.

Die Idee dieser Funktion ist, Ihnen dabei zu helfen, Ressourcen freizugeben, wenn der Prozess mit dem Beenden beginnt, aber auch zuzulassen, dass das Objekt durch Garbage Collection bereinigt wird, wenn es nicht mehr verwendet wird.

Beispiel: Sie können ein Objekt registrieren, das einen Puffer enthält. Sie möchten sicherstellen, dass der Puffer freigegeben wird, wenn der Prozess beendet wird. Wenn das Objekt jedoch vor dem Beenden des Prozesses durch Garbage Collection bereinigt wird, müssen wir den Puffer nicht mehr freigeben. In diesem Fall entfernen wir den Callback einfach aus der Finalisierungsregistrierung.



::: code-group
```js [CJS]
const { finalization } = require('node:process');

// Bitte stellen Sie sicher, dass die an finalization.register() übergebene Funktion
// keine Closure um unnötige Objekte erzeugt.
function onFinalize(obj, event) {
  // Sie können mit dem Objekt tun, was Sie wollen
  obj.dispose();
}

function setup() {
  // Dieses Objekt kann sicher durch Garbage Collection bereinigt werden,
  // und die resultierende Shutdown-Funktion wird nicht aufgerufen.
  // Es gibt keine Lecks.
  const myDisposableObject = {
    dispose() {
      // Geben Sie Ihre Ressourcen synchron frei
    },
  };

  finalization.register(myDisposableObject, onFinalize);
}

setup();
```

```js [ESM]
import { finalization } from 'node:process';

// Bitte stellen Sie sicher, dass die an finalization.register() übergebene Funktion
// keine Closure um unnötige Objekte erzeugt.
function onFinalize(obj, event) {
  // Sie können mit dem Objekt tun, was Sie wollen
  obj.dispose();
}

function setup() {
  // Dieses Objekt kann sicher durch Garbage Collection bereinigt werden,
  // und die resultierende Shutdown-Funktion wird nicht aufgerufen.
  // Es gibt keine Lecks.
  const myDisposableObject = {
    dispose() {
      // Geben Sie Ihre Ressourcen synchron frei
    },
  };

  finalization.register(myDisposableObject, onFinalize);
}

setup();
```
:::

Der obige Code basiert auf den folgenden Annahmen:

- Arrow-Funktionen werden vermieden
- Reguläre Funktionen werden empfohlen, sich im globalen Kontext (Root) zu befinden

Reguläre Funktionen *könnten* auf den Kontext verweisen, in dem sich das `obj` befindet, wodurch das `obj` nicht durch Garbage Collection bereinigt werden kann.

Arrow-Funktionen halten den vorherigen Kontext. Betrachten Sie zum Beispiel:

```js [ESM]
class Test {
  constructor() {
    finalization.register(this, (ref) => ref.dispose());

    // Sogar so etwas wird dringend abgeraten
    // finalization.register(this, () => this.dispose());
  }
  dispose() {}
}
```
Es ist sehr unwahrscheinlich (nicht unmöglich), dass dieses Objekt durch Garbage Collection bereinigt wird, aber wenn nicht, wird `dispose` aufgerufen, wenn `process.exit` aufgerufen wird.

Seien Sie vorsichtig und vermeiden Sie es, sich auf diese Funktion zur Freigabe kritischer Ressourcen zu verlassen, da nicht garantiert werden kann, dass der Callback unter allen Umständen aufgerufen wird.


## `process.finalization.registerBeforeExit(ref, callback)` {#processfinalizationregisterbeforeexitref-callback}

**Hinzugefügt in: v22.5.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Referenz auf die Ressource, die verfolgt wird.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Callback-Funktion, die aufgerufen wird, wenn die Ressource finalisiert wird.
    - `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Referenz auf die Ressource, die verfolgt wird.
    - `event` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Das Ereignis, das die Finalisierung ausgelöst hat. Standardmäßig 'beforeExit'.



Diese Funktion verhält sich genau wie `register`, außer dass der Callback aufgerufen wird, wenn der Prozess das `beforeExit`-Ereignis ausgibt, falls das `ref`-Objekt nicht durch Garbage Collection freigegeben wurde.

Beachten Sie, dass alle Einschränkungen, die für das `beforeExit`-Ereignis gelten, auch für die `callback`-Funktion gelten. Dies bedeutet, dass es möglich ist, dass der Callback unter besonderen Umständen nicht aufgerufen wird.

## `process.finalization.unregister(ref)` {#processfinalizationunregisterref}

**Hinzugefügt in: v22.5.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Referenz auf die Ressource, die zuvor registriert wurde.

Diese Funktion entfernt die Registrierung des Objekts aus der Finalisierungsregistrierung, sodass der Callback nicht mehr aufgerufen wird.



::: code-group
```js [CJS]
const { finalization } = require('node:process');

// Bitte stellen Sie sicher, dass die an finalization.register() übergebene Funktion
// keine Closure um unnötige Objekte erzeugt.
function onFinalize(obj, event) {
  // Sie können mit dem Objekt tun, was Sie wollen
  obj.dispose();
}

function setup() {
  // Dieses Objekt kann sicher durch Garbage Collection freigegeben werden,
  // und die resultierende Shutdown-Funktion wird nicht aufgerufen.
  // Es gibt keine Lecks.
  const myDisposableObject = {
    dispose() {
      // Geben Sie Ihre Ressourcen synchron frei
    },
  };

  finalization.register(myDisposableObject, onFinalize);

  // Etwas tun

  myDisposableObject.dispose();
  finalization.unregister(myDisposableObject);
}

setup();
```

```js [ESM]
import { finalization } from 'node:process';

// Bitte stellen Sie sicher, dass die an finalization.register() übergebene Funktion
// keine Closure um unnötige Objekte erzeugt.
function onFinalize(obj, event) {
  // Sie können mit dem Objekt tun, was Sie wollen
  obj.dispose();
}

function setup() {
  // Dieses Objekt kann sicher durch Garbage Collection freigegeben werden,
  // und die resultierende Shutdown-Funktion wird nicht aufgerufen.
  // Es gibt keine Lecks.
  const myDisposableObject = {
    dispose() {
      // Geben Sie Ihre Ressourcen synchron frei
    },
  };

  // Bitte stellen Sie sicher, dass die an finalization.register() übergebene Funktion
  // keine Closure um unnötige Objekte erzeugt.
  function onFinalize(obj, event) {
    // Sie können mit dem Objekt tun, was Sie wollen
    obj.dispose();
  }

  finalization.register(myDisposableObject, onFinalize);

  // Etwas tun

  myDisposableObject.dispose();
  finalization.unregister(myDisposableObject);
}

setup();
```
:::


## `process.getActiveResourcesInfo()` {#processgetactiveresourcesinfo}

**Hinzugefügt in: v17.3.0, v16.14.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- Gibt zurück: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Methode `process.getActiveResourcesInfo()` gibt ein Array von Zeichenketten zurück, das die Typen der aktiven Ressourcen enthält, die derzeit die Event-Loop am Leben erhalten.

::: code-group
```js [ESM]
import { getActiveResourcesInfo } from 'node:process';
import { setTimeout } from 'node:timers';

console.log('Vorher:', getActiveResourcesInfo());
setTimeout(() => {}, 1000);
console.log('Nachher:', getActiveResourcesInfo());
// Gibt aus:
//   Vorher: [ 'CloseReq', 'TTYWrap', 'TTYWrap', 'TTYWrap' ]
//   Nachher: [ 'CloseReq', 'TTYWrap', 'TTYWrap', 'TTYWrap', 'Timeout' ]
```

```js [CJS]
const { getActiveResourcesInfo } = require('node:process');
const { setTimeout } = require('node:timers');

console.log('Vorher:', getActiveResourcesInfo());
setTimeout(() => {}, 1000);
console.log('Nachher:', getActiveResourcesInfo());
// Gibt aus:
//   Vorher: [ 'TTYWrap', 'TTYWrap', 'TTYWrap' ]
//   Nachher: [ 'TTYWrap', 'TTYWrap', 'TTYWrap', 'Timeout' ]
```
:::

## `process.getBuiltinModule(id)` {#processgetbuiltinmoduleid}

**Hinzugefügt in: v22.3.0, v20.16.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ID des angeforderten eingebauten Moduls.
- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`process.getBuiltinModule(id)` bietet eine Möglichkeit, eingebaute Module in einer global verfügbaren Funktion zu laden. ES-Module, die andere Umgebungen unterstützen müssen, können es verwenden, um ein Node.js-Built-in bedingt zu laden, wenn es in Node.js ausgeführt wird, ohne sich mit dem Auflösungsfehler auseinandersetzen zu müssen, der von `import` in einer Nicht-Node.js-Umgebung ausgelöst werden kann, oder dynamisches `import()` verwenden zu müssen, was entweder das Modul in ein asynchrones Modul verwandelt oder eine synchrone API in eine asynchrone verwandelt.

```js [ESM]
if (globalThis.process?.getBuiltinModule) {
  // In Node.js ausführen, das Node.js fs-Modul verwenden.
  const fs = globalThis.process.getBuiltinModule('fs');
  // Wenn `require()` zum Laden von Benutzermodulen benötigt wird, verwenden Sie createRequire()
  const module = globalThis.process.getBuiltinModule('module');
  const require = module.createRequire(import.meta.url);
  const foo = require('foo');
}
```
Wenn `id` ein eingebautes Modul angibt, das im aktuellen Node.js-Prozess verfügbar ist, gibt die Methode `process.getBuiltinModule(id)` das entsprechende eingebaute Modul zurück. Wenn `id` keinem eingebauten Modul entspricht, wird `undefined` zurückgegeben.

`process.getBuiltinModule(id)` akzeptiert Built-in-Modul-IDs, die von [`module.isBuiltin(id)`](/de/nodejs/api/module#moduleisbuiltinmodulename) erkannt werden. Einige eingebaute Module müssen mit dem Präfix `node:` geladen werden, siehe [Eingebaute Module mit obligatorischem `node:` Präfix](/de/nodejs/api/modules#built-in-modules-with-mandatory-node-prefix). Die von `process.getBuiltinModule(id)` zurückgegebenen Referenzen verweisen immer auf das eingebaute Modul, das `id` entspricht, auch wenn Benutzer [`require.cache`](/de/nodejs/api/modules#requirecache) so ändern, dass `require(id)` etwas anderes zurückgibt.


## `process.getegid()` {#processgetegid}

**Hinzugefügt in: v2.0.0**

Die Methode `process.getegid()` gibt die numerische effektive Gruppenkennung des Node.js-Prozesses zurück. (Siehe [`getegid(2)`](http://man7.org/linux/man-pages/man2/getegid.2).)



::: code-group
```js [ESM]
import process from 'node:process';

if (process.getegid) {
  console.log(`Aktuelle GID: ${process.getegid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getegid) {
  console.log(`Aktuelle GID: ${process.getegid()}`);
}
```
:::

Diese Funktion ist nur auf POSIX-Plattformen verfügbar (d. h. nicht unter Windows oder Android).

## `process.geteuid()` {#processgeteuid}

**Hinzugefügt in: v2.0.0**

- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Die Methode `process.geteuid()` gibt die numerische effektive Benutzerkennung des Prozesses zurück. (Siehe [`geteuid(2)`](http://man7.org/linux/man-pages/man2/geteuid.2).)



::: code-group
```js [ESM]
import process from 'node:process';

if (process.geteuid) {
  console.log(`Aktuelle UID: ${process.geteuid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.geteuid) {
  console.log(`Aktuelle UID: ${process.geteuid()}`);
}
```
:::

Diese Funktion ist nur auf POSIX-Plattformen verfügbar (d. h. nicht unter Windows oder Android).

## `process.getgid()` {#processgetgid}

**Hinzugefügt in: v0.1.31**

- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Die Methode `process.getgid()` gibt die numerische Gruppenkennung des Prozesses zurück. (Siehe [`getgid(2)`](http://man7.org/linux/man-pages/man2/getgid.2).)



::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgid) {
  console.log(`Aktuelle GID: ${process.getgid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getgid) {
  console.log(`Aktuelle GID: ${process.getgid()}`);
}
```
:::

Diese Funktion ist nur auf POSIX-Plattformen verfügbar (d. h. nicht unter Windows oder Android).

## `process.getgroups()` {#processgetgroups}

**Hinzugefügt in: v0.9.4**

- Gibt zurück: [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Methode `process.getgroups()` gibt ein Array mit den zusätzlichen Gruppen-IDs zurück. POSIX lässt offen, ob die effektive Gruppen-ID enthalten ist, aber Node.js stellt sicher, dass dies immer der Fall ist.



::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgroups) {
  console.log(process.getgroups()); // [ 16, 21, 297 ]
}
```

```js [CJS]
const process = require('node:process');

if (process.getgroups) {
  console.log(process.getgroups()); // [ 16, 21, 297 ]
}
```
:::

Diese Funktion ist nur auf POSIX-Plattformen verfügbar (d. h. nicht unter Windows oder Android).


## `process.getuid()` {#processgetuid}

**Hinzugefügt in: v0.1.28**

- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Methode `process.getuid()` gibt die numerische Benutzerkennung des Prozesses zurück. (Siehe [`getuid(2)`](http://man7.org/linux/man-pages/man2/getuid.2).)

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getuid) {
  console.log(`Aktuelle UID: ${process.getuid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getuid) {
  console.log(`Aktuelle UID: ${process.getuid()}`);
}
```
:::

Diese Funktion ist nur auf POSIX-Plattformen verfügbar (d. h. nicht unter Windows oder Android).

## `process.hasUncaughtExceptionCaptureCallback()` {#processhasuncaughtexceptioncapturecallback}

**Hinzugefügt in: v9.3.0**

- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt an, ob ein Callback mit [`process.setUncaughtExceptionCaptureCallback()`](/de/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) gesetzt wurde.

## `process.hrtime([time])` {#processhrtimetime}

**Hinzugefügt in: v0.7.6**

::: info [Stabil: 3 - Legacy]
[Stabil: 3](/de/nodejs/api/documentation#stability-index) [Stabilität: 3](/de/nodejs/api/documentation#stability-index) - Legacy. Verwenden Sie stattdessen [`process.hrtime.bigint()`](/de/nodejs/api/process#processhrtimebigint).
:::

- `time` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Das Ergebnis eines vorherigen Aufrufs von `process.hrtime()`
- Gibt zurück: [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Dies ist die Legacy-Version von [`process.hrtime.bigint()`](/de/nodejs/api/process#processhrtimebigint), bevor `bigint` in JavaScript eingeführt wurde.

Die Methode `process.hrtime()` gibt die aktuelle hochauflösende Echtzeit in einem `[Sekunden, Nanosekunden]`-Tupel `Array` zurück, wobei `Nanosekunden` der verbleibende Teil der Echtzeit ist, der nicht in Sekundengenauigkeit dargestellt werden kann.

`time` ist ein optionaler Parameter, der das Ergebnis eines vorherigen `process.hrtime()`-Aufrufs sein muss, um die Differenz zur aktuellen Zeit zu ermitteln. Wenn der übergebene Parameter kein Tupel `Array` ist, wird ein `TypeError` ausgelöst. Die Übergabe eines benutzerdefinierten Arrays anstelle des Ergebnisses eines vorherigen Aufrufs von `process.hrtime()` führt zu undefiniertem Verhalten.

Diese Zeiten beziehen sich auf einen beliebigen Zeitpunkt in der Vergangenheit und stehen nicht im Zusammenhang mit der Tageszeit und sind daher keiner Taktverschiebung unterworfen. Die primäre Verwendung dient zur Messung der Leistung zwischen Intervallen:

::: code-group
```js [ESM]
import { hrtime } from 'node:process';

const NS_PER_SEC = 1e9;
const time = hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = hrtime(time);
  // [ 1, 552 ]

  console.log(`Benchmark dauerte ${diff[0] * NS_PER_SEC + diff[1]} Nanosekunden`);
  // Benchmark dauerte 1000000552 Nanosekunden
}, 1000);
```

```js [CJS]
const { hrtime } = require('node:process');

const NS_PER_SEC = 1e9;
const time = hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = hrtime(time);
  // [ 1, 552 ]

  console.log(`Benchmark dauerte ${diff[0] * NS_PER_SEC + diff[1]} Nanosekunden`);
  // Benchmark dauerte 1000000552 Nanosekunden
}, 1000);
```
:::


## `process.hrtime.bigint()` {#processhrtimebigint}

**Hinzugefügt in: v10.7.0**

- Rückgabe: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Die `bigint`-Version der [`process.hrtime()`](/de/nodejs/api/process#processhrtimetime)-Methode, die die aktuelle hochauflösende Echtzeit in Nanosekunden als `bigint` zurückgibt.

Im Gegensatz zu [`process.hrtime()`](/de/nodejs/api/process#processhrtimetime) unterstützt sie kein zusätzliches `time`-Argument, da die Differenz einfach direkt durch Subtraktion der beiden `bigint`s berechnet werden kann.

::: code-group
```js [ESM]
import { hrtime } from 'node:process';

const start = hrtime.bigint();
// 191051479007711n

setTimeout(() => {
  const end = hrtime.bigint();
  // 191052633396993n

  console.log(`Benchmark took ${end - start} nanoseconds`);
  // Benchmark took 1154389282 nanoseconds
}, 1000);
```

```js [CJS]
const { hrtime } = require('node:process');

const start = hrtime.bigint();
// 191051479007711n

setTimeout(() => {
  const end = hrtime.bigint();
  // 191052633396993n

  console.log(`Benchmark took ${end - start} nanoseconds`);
  // Benchmark took 1154389282 nanoseconds
}, 1000);
```
:::

## `process.initgroups(user, extraGroup)` {#processinitgroupsuser-extragroup}

**Hinzugefügt in: v0.9.4**

- `user` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Benutzername oder die numerische Kennung.
- `extraGroup` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ein Gruppenname oder eine numerische Kennung.

Die `process.initgroups()`-Methode liest die `/etc/group`-Datei und initialisiert die Gruppenzugriffsliste, wobei alle Gruppen verwendet werden, deren Mitglied der Benutzer ist. Dies ist eine privilegierte Operation, die erfordert, dass der Node.js-Prozess entweder `root`-Zugriff oder die `CAP_SETGID`-Funktion hat.

Seien Sie vorsichtig, wenn Sie Berechtigungen entfernen:

::: code-group
```js [ESM]
import { getgroups, initgroups, setgid } from 'node:process';

console.log(getgroups());         // [ 0 ]
initgroups('nodeuser', 1000);     // switch user
console.log(getgroups());         // [ 27, 30, 46, 1000, 0 ]
setgid(1000);                     // drop root gid
console.log(getgroups());         // [ 27, 30, 46, 1000 ]
```

```js [CJS]
const { getgroups, initgroups, setgid } = require('node:process');

console.log(getgroups());         // [ 0 ]
initgroups('nodeuser', 1000);     // switch user
console.log(getgroups());         // [ 27, 30, 46, 1000, 0 ]
setgid(1000);                     // drop root gid
console.log(getgroups());         // [ 27, 30, 46, 1000 ]
```
:::

Diese Funktion ist nur auf POSIX-Plattformen verfügbar (d. h. nicht unter Windows oder Android). Dieses Feature ist in [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Threads nicht verfügbar.


## `process.kill(pid[, signal])` {#processkillpid-signal}

**Hinzugefügt in: v0.0.6**

- `pid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Eine Prozess-ID
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Das zu sendende Signal, entweder als Zeichenkette oder Zahl. **Standard:** `'SIGTERM'`.

Die Methode `process.kill()` sendet das `signal` an den durch `pid` identifizierten Prozess.

Signalnamen sind Zeichenketten wie `'SIGINT'` oder `'SIGHUP'`. Siehe [Signalereignisse](/de/nodejs/api/process#signal-events) und [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) für weitere Informationen.

Diese Methode wirft einen Fehler, wenn die Ziel-`pid` nicht existiert. Als Sonderfall kann ein Signal von `0` verwendet werden, um die Existenz eines Prozesses zu testen. Windows-Plattformen werfen einen Fehler, wenn die `pid` verwendet wird, um eine Prozessgruppe zu beenden.

Obwohl der Name dieser Funktion `process.kill()` ist, ist sie eigentlich nur ein Signalsender, wie der Systemaufruf `kill`. Das gesendete Signal kann etwas anderes bewirken als den Zielprozess zu beenden.

::: code-group
```js [ESM]
import process, { kill } from 'node:process';

process.on('SIGHUP', () => {
  console.log('Got SIGHUP signal.');
});

setTimeout(() => {
  console.log('Exiting.');
  process.exit(0);
}, 100);

kill(process.pid, 'SIGHUP');
```

```js [CJS]
const process = require('node:process');

process.on('SIGHUP', () => {
  console.log('Got SIGHUP signal.');
});

setTimeout(() => {
  console.log('Exiting.');
  process.exit(0);
}, 100);

process.kill(process.pid, 'SIGHUP');
```
:::

Wenn ein Node.js-Prozess `SIGUSR1` empfängt, startet Node.js den Debugger. Siehe [Signalereignisse](/de/nodejs/api/process#signal-events).

## `process.loadEnvFile(path)` {#processloadenvfilepath}

**Hinzugefügt in: v21.7.0, v20.12.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type). **Standard:** `'./.env'`

Lädt die `.env`-Datei in `process.env`. Die Verwendung von `NODE_OPTIONS` in der `.env`-Datei hat keine Auswirkungen auf Node.js.

::: code-group
```js [CJS]
const { loadEnvFile } = require('node:process');
loadEnvFile();
```

```js [ESM]
import { loadEnvFile } from 'node:process';
loadEnvFile();
```
:::


## `process.mainModule` {#processmainmodule}

**Hinzugefügt in: v0.1.17**

**Veraltet seit: v14.0.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen [`require.main`](/de/nodejs/api/modules#accessing-the-main-module).
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Die Eigenschaft `process.mainModule` bietet eine alternative Möglichkeit, [`require.main`](/de/nodejs/api/modules#accessing-the-main-module) abzurufen. Der Unterschied besteht darin, dass, wenn sich das Hauptmodul zur Laufzeit ändert, [`require.main`](/de/nodejs/api/modules#accessing-the-main-module) möglicherweise noch auf das ursprüngliche Hauptmodul in Modulen verweist, die vor der Änderung erforderlich waren. Im Allgemeinen kann man davon ausgehen, dass sich die beiden auf dasselbe Modul beziehen.

Wie bei [`require.main`](/de/nodejs/api/modules#accessing-the-main-module) ist `process.mainModule` `undefined`, wenn kein Einstiegsskript vorhanden ist.

## `process.memoryUsage()` {#processmemoryusage}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v13.9.0, v12.17.0 | `arrayBuffers` zum zurückgegebenen Objekt hinzugefügt. |
| v7.2.0 | `external` zum zurückgegebenen Objekt hinzugefügt. |
| v0.1.16 | Hinzugefügt in: v0.1.16 |
:::

- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `rss` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `heapTotal` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `heapUsed` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `external` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `arrayBuffers` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

Gibt ein Objekt zurück, das die Speichernutzung des Node.js-Prozesses in Bytes misst.



::: code-group
```js [ESM]
import { memoryUsage } from 'node:process';

console.log(memoryUsage());
// Gibt aus:
// {
//  rss: 4935680,
//  heapTotal: 1826816,
//  heapUsed: 650472,
//  external: 49879,
//  arrayBuffers: 9386
// }
```

```js [CJS]
const { memoryUsage } = require('node:process');

console.log(memoryUsage());
// Gibt aus:
// {
//  rss: 4935680,
//  heapTotal: 1826816,
//  heapUsed: 650472,
//  external: 49879,
//  arrayBuffers: 9386
// }
```
:::

- `heapTotal` und `heapUsed` beziehen sich auf die Speichernutzung von V8.
- `external` bezieht sich auf die Speichernutzung von C++-Objekten, die an von V8 verwaltete JavaScript-Objekte gebunden sind.
- `rss`, Resident Set Size, ist der Speicherplatz, der im Hauptspeichergerät (d. h. eine Teilmenge des insgesamt zugewiesenen Speichers) für den Prozess belegt ist, einschließlich aller C++- und JavaScript-Objekte und -Codes.
- `arrayBuffers` bezieht sich auf den für `ArrayBuffer`s und `SharedArrayBuffer`s zugewiesenen Speicher, einschließlich aller Node.js [`Buffer`](/de/nodejs/api/buffer)s. Dieser ist auch im Wert `external` enthalten. Wenn Node.js als eingebettete Bibliothek verwendet wird, kann dieser Wert `0` sein, da Zuweisungen für `ArrayBuffer`s in diesem Fall möglicherweise nicht verfolgt werden.

Bei Verwendung von [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Threads ist `rss` ein Wert, der für den gesamten Prozess gültig ist, während sich die anderen Felder nur auf den aktuellen Thread beziehen.

Die Methode `process.memoryUsage()` iteriert über jede Seite, um Informationen über die Speichernutzung zu sammeln, was je nach Speicherzuweisungen des Programms langsam sein kann.


## `process.memoryUsage.rss()` {#processmemoryusagerss}

**Hinzugefügt in: v15.6.0, v14.18.0**

- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die `process.memoryUsage.rss()`-Methode gibt eine Ganzzahl zurück, die die Resident Set Size (RSS) in Bytes darstellt.

Die Resident Set Size ist die Menge an Speicherplatz, die im Hauptspeichergerät (d. h. einer Teilmenge des gesamten zugewiesenen Speichers) für den Prozess belegt ist, einschließlich aller C++- und JavaScript-Objekte und -Codes.

Dies ist der gleiche Wert wie die `rss`-Eigenschaft, die von `process.memoryUsage()` bereitgestellt wird, aber `process.memoryUsage.rss()` ist schneller.

::: code-group
```js [ESM]
import { memoryUsage } from 'node:process';

console.log(memoryUsage.rss());
// 35655680
```

```js [CJS]
const { memoryUsage } = require('node:process');

console.log(memoryUsage.rss());
// 35655680
```
:::

## `process.nextTick(callback[, ...args])` {#processnexttickcallback-args}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.7.0, v20.18.0 | Stabilität auf Legacy geändert. |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das Argument `callback` wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v1.8.1 | Zusätzliche Argumente nach `callback` werden jetzt unterstützt. |
| v0.1.26 | Hinzugefügt in: v0.1.26 |
:::

::: info [Stabil: 3 - Legacy]
[Stabil: 3](/de/nodejs/api/documentation#stability-index) [Stabilität: 3](/de/nodejs/api/documentation#stability-index) - Legacy: Verwenden Sie stattdessen [`queueMicrotask()`](/de/nodejs/api/globals#queuemicrotaskcallback).
:::

- `callback` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Zusätzliche Argumente, die beim Aufrufen von `callback` übergeben werden sollen

`process.nextTick()` fügt `callback` zur "Next-Tick-Queue" hinzu. Diese Warteschlange wird vollständig geleert, nachdem die aktuelle Operation im JavaScript-Stack abgeschlossen ist und bevor die Ereignisschleife fortgesetzt werden darf. Es ist möglich, eine Endlosschleife zu erstellen, wenn man rekursiv `process.nextTick()` aufrufen würde. Weitere Hintergrundinformationen finden Sie im [Event Loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick#understanding-processnexttick)-Leitfaden.

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

console.log('start');
nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// nextTick callback
```

```js [CJS]
const { nextTick } = require('node:process');

console.log('start');
nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// nextTick callback
```
:::

Dies ist wichtig bei der Entwicklung von APIs, um Benutzern die Möglichkeit zu geben, Event-Handler *nachdem* ein Objekt konstruiert wurde, aber bevor I/O stattgefunden hat, zuzuweisen:

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

function MyThing(options) {
  this.setupOptions(options);

  nextTick(() => {
    this.startDoingStuff();
  });
}

const thing = new MyThing();
thing.getReadyForStuff();

// thing.startDoingStuff() wird jetzt aufgerufen, nicht vorher.
```

```js [CJS]
const { nextTick } = require('node:process');

function MyThing(options) {
  this.setupOptions(options);

  nextTick(() => {
    this.startDoingStuff();
  });
}

const thing = new MyThing();
thing.getReadyForStuff();

// thing.startDoingStuff() wird jetzt aufgerufen, nicht vorher.
```
:::

Es ist sehr wichtig, dass APIs entweder zu 100 % synchron oder zu 100 % asynchron sind. Betrachten Sie dieses Beispiel:

```js [ESM]
// WARNUNG!  NICHT VERWENDEN!  SCHLECHTE UNSICHERE GEFAHR!
function maybeSync(arg, cb) {
  if (arg) {
    cb();
    return;
  }

  fs.stat('file', cb);
}
```
Diese API ist gefährlich, weil in folgendem Fall:

```js [ESM]
const maybeTrue = Math.random() > 0.5;

maybeSync(maybeTrue, () => {
  foo();
});

bar();
```
Es ist nicht klar, ob `foo()` oder `bar()` zuerst aufgerufen wird.

Der folgende Ansatz ist viel besser:

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

function definitelyAsync(arg, cb) {
  if (arg) {
    nextTick(cb);
    return;
  }

  fs.stat('file', cb);
}
```

```js [CJS]
const { nextTick } = require('node:process');

function definitelyAsync(arg, cb) {
  if (arg) {
    nextTick(cb);
    return;
  }

  fs.stat('file', cb);
}
```
:::


### Wann `queueMicrotask()` vs. `process.nextTick()` verwenden? {#when-to-use-queuemicrotask-vs-processnexttick}

Die [`queueMicrotask()`](/de/nodejs/api/globals#queuemicrotaskcallback)-API ist eine Alternative zu `process.nextTick()`, die ebenfalls die Ausführung einer Funktion mit derselben Microtask-Queue verzögert, die zur Ausführung der then-, catch- und finally-Handler aufgelöster Promises verwendet wird. Innerhalb von Node.js wird jedes Mal, wenn die "Next Tick Queue" geleert wird, die Microtask-Queue unmittelbar danach geleert.

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

Promise.resolve().then(() => console.log(2));
queueMicrotask(() => console.log(3));
nextTick(() => console.log(1));
// Ausgabe:
// 1
// 2
// 3
```

```js [CJS]
const { nextTick } = require('node:process');

Promise.resolve().then(() => console.log(2));
queueMicrotask(() => console.log(3));
nextTick(() => console.log(1));
// Ausgabe:
// 1
// 2
// 3
```
:::

Für *die meisten* Userland-Anwendungsfälle bietet die `queueMicrotask()`-API einen portablen und zuverlässigen Mechanismus zur Verzögerung der Ausführung, der in verschiedenen JavaScript-Plattformumgebungen funktioniert und gegenüber `process.nextTick()` bevorzugt werden sollte. In einfachen Szenarien kann `queueMicrotask()` ein direkter Ersatz für `process.nextTick()` sein.

```js [ESM]
console.log('start');
queueMicrotask(() => {
  console.log('microtask callback');
});
console.log('scheduled');
// Ausgabe:
// start
// scheduled
// microtask callback
```
Ein bemerkenswerter Unterschied zwischen den beiden APIs besteht darin, dass `process.nextTick()` die Angabe zusätzlicher Werte ermöglicht, die als Argumente an die verzögerte Funktion übergeben werden, wenn sie aufgerufen wird. Um das gleiche Ergebnis mit `queueMicrotask()` zu erzielen, ist entweder eine Closure oder eine gebundene Funktion erforderlich:

```js [ESM]
function deferred(a, b) {
  console.log('microtask', a + b);
}

console.log('start');
queueMicrotask(deferred.bind(undefined, 1, 2));
console.log('scheduled');
// Ausgabe:
// start
// scheduled
// microtask 3
```
Es gibt geringfügige Unterschiede in der Art und Weise, wie Fehler behandelt werden, die innerhalb der Next Tick Queue und der Microtask Queue auftreten. Fehler, die innerhalb eines in der Warteschlange befindlichen Microtask-Callbacks ausgelöst werden, sollten nach Möglichkeit innerhalb des in der Warteschlange befindlichen Callbacks behandelt werden. Wenn dies nicht der Fall ist, kann der `process.on('uncaughtException')`-Event-Handler verwendet werden, um die Fehler zu erfassen und zu behandeln.

Im Zweifelsfall verwenden Sie `queueMicrotask()`, es sei denn, die spezifischen Funktionen von `process.nextTick()` werden benötigt.


## `process.noDeprecation` {#processnodeprecation}

**Hinzugefügt in: v0.8.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Die Eigenschaft `process.noDeprecation` gibt an, ob das Flag `--no-deprecation` für den aktuellen Node.js-Prozess gesetzt ist. Weitere Informationen zum Verhalten dieses Flags finden Sie in der Dokumentation zum [`'warning'` Event](/de/nodejs/api/process#event-warning) und zur [`emitWarning()` Methode](/de/nodejs/api/process#processemitwarningwarning-type-code-ctor).

## `process.permission` {#processpermission}

**Hinzugefügt in: v20.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Diese API ist über das Flag [`--permission`](/de/nodejs/api/cli#--permission) verfügbar.

`process.permission` ist ein Objekt, dessen Methoden verwendet werden, um Berechtigungen für den aktuellen Prozess zu verwalten. Zusätzliche Dokumentation ist im [Berechtigungsmodell](/de/nodejs/api/permissions#permission-model) verfügbar.

### `process.permission.has(scope[, reference])` {#processpermissionhasscope-reference}

**Hinzugefügt in: v20.0.0**

- `scope` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `reference` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Überprüft, ob der Prozess auf den angegebenen Scope und die angegebene Referenz zugreifen kann. Wenn keine Referenz angegeben wird, wird ein globaler Scope angenommen, z. B. prüft `process.permission.has('fs.read')`, ob der Prozess über ALLE Dateisystem-Leseberechtigungen verfügt.

Die Referenz hat eine Bedeutung basierend auf dem angegebenen Scope. Wenn der Scope beispielsweise Dateisystem ist, bedeutet die Referenz Dateien und Ordner.

Die verfügbaren Scopes sind:

- `fs` - Gesamtes Dateisystem
- `fs.read` - Dateisystem-Leseoperationen
- `fs.write` - Dateisystem-Schreiboperationen
- `child` - Operationen zum Erzeugen von Child-Prozessen
- `worker` - Operationen zum Erzeugen von Worker-Threads

```js [ESM]
// Überprüfen, ob der Prozess die Berechtigung hat, die README-Datei zu lesen
process.permission.has('fs.read', './README.md');
// Überprüfen, ob der Prozess über Leseberechtigungen verfügt
process.permission.has('fs.read');
```

## `process.pid` {#processpid}

**Hinzugefügt in: v0.1.15**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Eigenschaft `process.pid` gibt die PID des Prozesses zurück.



::: code-group
```js [ESM]
import { pid } from 'node:process';

console.log(`Dieser Prozess hat die PID ${pid}`);
```

```js [CJS]
const { pid } = require('node:process');

console.log(`Dieser Prozess hat die PID ${pid}`);
```
:::

## `process.platform` {#processplatform}

**Hinzugefügt in: v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Eigenschaft `process.platform` gibt eine Zeichenkette zurück, die die Betriebssystemplattform identifiziert, für die die Node.js-Binärdatei kompiliert wurde.

Aktuell mögliche Werte sind:

- `'aix'`
- `'darwin'`
- `'freebsd'`
- `'linux'`
- `'openbsd'`
- `'sunos'`
- `'win32'`



::: code-group
```js [ESM]
import { platform } from 'node:process';

console.log(`Diese Plattform ist ${platform}`);
```

```js [CJS]
const { platform } = require('node:process');

console.log(`Diese Plattform ist ${platform}`);
```
:::

Der Wert `'android'` kann auch zurückgegeben werden, wenn Node.js auf dem Android-Betriebssystem aufgebaut ist. Die Android-Unterstützung in Node.js [ist jedoch experimentell](https://github.com/nodejs/node/blob/HEAD/BUILDING.md#android).

## `process.ppid` {#processppid}

**Hinzugefügt in: v9.2.0, v8.10.0, v6.13.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Eigenschaft `process.ppid` gibt die PID des Elternprozesses des aktuellen Prozesses zurück.



::: code-group
```js [ESM]
import { ppid } from 'node:process';

console.log(`Der Elternprozess hat die PID ${ppid}`);
```

```js [CJS]
const { ppid } = require('node:process');

console.log(`Der Elternprozess hat die PID ${ppid}`);
```
:::

## `process.release` {#processrelease}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v4.2.0 | Die Eigenschaft `lts` wird jetzt unterstützt. |
| v3.0.0 | Hinzugefügt in: v3.0.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Die Eigenschaft `process.release` gibt ein `Object` zurück, das Metadaten zur aktuellen Version enthält, einschließlich URLs für die Source-Tarball-Datei und die Header-Only-Tarball-Datei.

`process.release` enthält die folgenden Eigenschaften:

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein Wert, der immer `'node'` ist.
- `sourceUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) eine absolute URL, die auf eine *<code>.tar.gz</code>*-Datei verweist, die den Quellcode der aktuellen Version enthält.
- `headersUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) eine absolute URL, die auf eine *<code>.tar.gz</code>*-Datei verweist, die nur die Quellheaderdateien für die aktuelle Version enthält. Diese Datei ist wesentlich kleiner als die vollständige Quelldatei und kann zum Kompilieren von nativen Node.js-Add-ons verwendet werden.
- `libUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) eine absolute URL, die auf eine *<code>node.lib</code>*-Datei verweist, die der Architektur und Version der aktuellen Version entspricht. Diese Datei wird zum Kompilieren von nativen Node.js-Add-ons verwendet. *Diese Eigenschaft ist nur in
Windows-Builds von Node.js vorhanden und fehlt auf allen anderen Plattformen.*
- `lts` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) eine Zeichenkettenbezeichnung, die die [LTS](https://github.com/nodejs/Release)-Bezeichnung für diese Version identifiziert. Diese Eigenschaft existiert nur für LTS-Versionen und ist `undefined` für alle anderen Versionstypen, einschließlich *Current*-Versionen. Gültige Werte sind die Codenamen der LTS-Versionen (einschließlich derer, die nicht mehr unterstützt werden).
    - `'Fermium'` für die 14.x LTS-Linie ab 14.15.0.
    - `'Gallium'` für die 16.x LTS-Linie ab 16.13.0.
    - `'Hydrogen'` für die 18.x LTS-Linie ab 18.12.0. Weitere Codenamen für LTS-Versionen finden Sie im [Node.js Changelog-Archiv](https://github.com/nodejs/node/blob/HEAD/doc/changelogs/CHANGELOG_ARCHIVE.md)
  
 

```js [ESM]
{
  name: 'node',
  lts: 'Hydrogen',
  sourceUrl: 'https://nodejs.org/download/release/v18.12.0/node-v18.12.0.tar.gz',
  headersUrl: 'https://nodejs.org/download/release/v18.12.0/node-v18.12.0-headers.tar.gz',
  libUrl: 'https://nodejs.org/download/release/v18.12.0/win-x64/node.lib'
}
```
In benutzerdefinierten Builds aus Nicht-Release-Versionen des Quellcodebaums ist möglicherweise nur die Eigenschaft `name` vorhanden. Auf das Vorhandensein der zusätzlichen Eigenschaften sollte man sich nicht verlassen.


## `process.report` {#processreport}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v13.12.0, v12.17.0 | Diese API ist nicht mehr experimentell. |
| v11.8.0 | Hinzugefügt in: v11.8.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.report` ist ein Objekt, dessen Methoden verwendet werden, um Diagnoseberichte für den aktuellen Prozess zu erstellen. Zusätzliche Dokumentation ist in der [Berichtsdokumentation](/de/nodejs/api/report) verfügbar.

### `process.report.compact` {#processreportcompact}

**Hinzugefügt in: v13.12.0, v12.17.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Schreibt Berichte in einem kompakten Format, einzeiliges JSON, das von Logverarbeitungssystemen leichter verarbeitet werden kann als das standardmäßige mehrzeilige Format, das für die menschliche Nutzung konzipiert ist.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Sind Berichte kompakt? ${report.compact}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Sind Berichte kompakt? ${report.compact}`);
```
:::

### `process.report.directory` {#processreportdirectory}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v13.12.0, v12.17.0 | Diese API ist nicht mehr experimentell. |
| v11.12.0 | Hinzugefügt in: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Verzeichnis, in dem der Bericht geschrieben wird. Der Standardwert ist eine leere Zeichenkette, die angibt, dass Berichte in das aktuelle Arbeitsverzeichnis des Node.js-Prozesses geschrieben werden.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Berichtsverzeichnis ist ${report.directory}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Berichtsverzeichnis ist ${report.directory}`);
```
:::

### `process.report.filename` {#processreportfilename}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v13.12.0, v12.17.0 | Diese API ist nicht mehr experimentell. |
| v11.12.0 | Hinzugefügt in: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Dateiname, in dem der Bericht geschrieben wird. Wenn er auf die leere Zeichenkette gesetzt ist, besteht der Ausgabedateiname aus einem Zeitstempel, einer PID und einer Sequenznummer. Der Standardwert ist die leere Zeichenkette.

Wenn der Wert von `process.report.filename` auf `'stdout'` oder `'stderr'` gesetzt ist, wird der Bericht in die stdout bzw. stderr des Prozesses geschrieben.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Berichtsdateiname ist ${report.filename}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Berichtsdateiname ist ${report.filename}`);
```
:::


### `process.report.getReport([err])` {#processreportgetreporterr}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v13.12.0, v12.17.0 | Diese API ist nicht mehr experimentell. |
| v11.8.0 | Hinzugefügt in: v11.8.0 |
:::

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Ein benutzerdefinierter Fehler, der zum Melden des JavaScript-Stacks verwendet wird.
- Rückgabe: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Gibt eine JavaScript-Objektdarstellung eines Diagnoseberichts für den laufenden Prozess zurück. Der JavaScript-Stack-Trace des Berichts stammt aus `err`, falls vorhanden.

::: code-group
```js [ESM]
import { report } from 'node:process';
import util from 'node:util';

const data = report.getReport();
console.log(data.header.nodejsVersion);

// Ähnlich wie process.report.writeReport()
import fs from 'node:fs';
fs.writeFileSync('my-report.log', util.inspect(data), 'utf8');
```

```js [CJS]
const { report } = require('node:process');
const util = require('node:util';

const data = report.getReport();
console.log(data.header.nodejsVersion);

// Ähnlich wie process.report.writeReport()
const fs = require('node:fs');
fs.writeFileSync('my-report.log', util.inspect(data), 'utf8');
```
:::

Zusätzliche Dokumentation ist in der [Berichtsdokumentation](/de/nodejs/api/report) verfügbar.

### `process.report.reportOnFatalError` {#processreportreportonfatalerror}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0, v14.17.0 | Diese API ist nicht mehr experimentell. |
| v11.12.0 | Hinzugefügt in: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wenn `true`, wird bei schwerwiegenden Fehlern wie Speicherfehlern oder fehlgeschlagenen C++-Assertionen ein Diagnosebericht erstellt.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Bericht bei schwerwiegendem Fehler: ${report.reportOnFatalError}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Bericht bei schwerwiegendem Fehler: ${report.reportOnFatalError}`);
```
:::


### `process.report.reportOnSignal` {#processreportreportonsignal}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v13.12.0, v12.17.0 | Diese API ist nicht mehr experimentell. |
| v11.12.0 | Hinzugefügt in: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wenn `true`, wird ein Diagnosebericht generiert, wenn der Prozess das durch `process.report.signal` spezifizierte Signal empfängt.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Bericht bei Signal: ${report.reportOnSignal}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Bericht bei Signal: ${report.reportOnSignal}`);
```
:::

### `process.report.reportOnUncaughtException` {#processreportreportonuncaughtexception}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v13.12.0, v12.17.0 | Diese API ist nicht mehr experimentell. |
| v11.12.0 | Hinzugefügt in: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wenn `true`, wird ein Diagnosebericht bei einer unbehandelten Ausnahme generiert.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Bericht bei Ausnahme: ${report.reportOnUncaughtException}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Bericht bei Ausnahme: ${report.reportOnUncaughtException}`);
```
:::

### `process.report.excludeEnv` {#processreportexcludeenv}

**Hinzugefügt in: v23.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wenn `true`, wird ein Diagnosebericht ohne die Umgebungsvariablen generiert.

### `process.report.signal` {#processreportsignal}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v13.12.0, v12.17.0 | Diese API ist nicht mehr experimentell. |
| v11.12.0 | Hinzugefügt in: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Das Signal, das zum Auslösen der Erstellung eines Diagnoseberichts verwendet wird. Standardmäßig `'SIGUSR2'`.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Berichtsignal: ${report.signal}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Berichtsignal: ${report.signal}`);
```
:::


### `process.report.writeReport([filename][, err])` {#processreportwritereportfilename-err}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v13.12.0, v12.17.0 | Diese API ist nicht mehr experimentell. |
| v11.8.0 | Hinzugefügt in: v11.8.0 |
:::

-  `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Name der Datei, in die der Bericht geschrieben wird. Dies sollte ein relativer Pfad sein, der an das in `process.report.directory` angegebene Verzeichnis angehängt wird, oder das aktuelle Arbeitsverzeichnis des Node.js-Prozesses, falls nicht angegeben.
-  `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Ein benutzerdefinierter Fehler, der zum Melden des JavaScript-Stacks verwendet wird.
-  Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Gibt den Dateinamen des generierten Berichts zurück.

Schreibt einen Diagnosebericht in eine Datei. Wenn `filename` nicht angegeben ist, enthält der Standarddateiname Datum, Uhrzeit, PID und eine fortlaufende Nummer. Der JavaScript-Stack-Trace des Berichts wird aus `err` entnommen, falls vorhanden.

Wenn der Wert von `filename` auf `'stdout'` oder `'stderr'` gesetzt ist, wird der Bericht in die Standardausgabe bzw. Standardfehlerausgabe des Prozesses geschrieben.

::: code-group
```js [ESM]
import { report } from 'node:process';

report.writeReport();
```

```js [CJS]
const { report } = require('node:process');

report.writeReport();
```
:::

Zusätzliche Dokumentation finden Sie in der [Berichtsdokumentation](/de/nodejs/api/report).

## `process.resourceUsage()` {#processresourceusage}

**Hinzugefügt in: v12.6.0**

- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) die Ressourcennutzung für den aktuellen Prozess. Alle diese Werte stammen vom `uv_getrusage`-Aufruf, der eine [`uv_rusage_t`-Struktur](https://docs.libuv.org/en/v1.x/misc#c.uv_rusage_t) zurückgibt.
    - `userCPUTime` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) bildet auf `ru_utime` ab, berechnet in Mikrosekunden. Es ist der gleiche Wert wie [`process.cpuUsage().user`](/de/nodejs/api/process#processcpuusagepreviousvalue).
    - `systemCPUTime` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) bildet auf `ru_stime` ab, berechnet in Mikrosekunden. Es ist der gleiche Wert wie [`process.cpuUsage().system`](/de/nodejs/api/process#processcpuusagepreviousvalue).
    - `maxRSS` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) bildet auf `ru_maxrss` ab, was die maximal verwendete Resident Set Size in Kilobyte ist.
    - `sharedMemorySize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) bildet auf `ru_ixrss` ab, wird aber von keiner Plattform unterstützt.
    - `unsharedDataSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) bildet auf `ru_idrss` ab, wird aber von keiner Plattform unterstützt.
    - `unsharedStackSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) bildet auf `ru_isrss` ab, wird aber von keiner Plattform unterstützt.
    - `minorPageFault` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) bildet auf `ru_minflt` ab, was die Anzahl der geringfügigen Seitenfehler für den Prozess ist, siehe [diesen Artikel für weitere Details](https://en.wikipedia.org/wiki/Page_fault#Minor).
    - `majorPageFault` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) bildet auf `ru_majflt` ab, was die Anzahl der schwerwiegenden Seitenfehler für den Prozess ist, siehe [diesen Artikel für weitere Details](https://en.wikipedia.org/wiki/Page_fault#Major). Dieses Feld wird unter Windows nicht unterstützt.
    - `swappedOut` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) bildet auf `ru_nswap` ab, wird aber von keiner Plattform unterstützt.
    - `fsRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) bildet auf `ru_inblock` ab, was die Anzahl der Male ist, die das Dateisystem eine Eingabe ausführen musste.
    - `fsWrite` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) bildet auf `ru_oublock` ab, was die Anzahl der Male ist, die das Dateisystem eine Ausgabe ausführen musste.
    - `ipcSent` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) bildet auf `ru_msgsnd` ab, wird aber von keiner Plattform unterstützt.
    - `ipcReceived` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) bildet auf `ru_msgrcv` ab, wird aber von keiner Plattform unterstützt.
    - `signalsCount` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) bildet auf `ru_nsignals` ab, wird aber von keiner Plattform unterstützt.
    - `voluntaryContextSwitches` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) bildet auf `ru_nvcsw` ab, was die Anzahl der Male ist, die ein CPU-Kontextwechsel aufgrund eines Prozesses erfolgte, der den Prozessor freiwillig aufgab, bevor seine Zeitscheibe abgeschlossen war (normalerweise, um die Verfügbarkeit einer Ressource abzuwarten). Dieses Feld wird unter Windows nicht unterstützt.
    - `involuntaryContextSwitches` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) bildet auf `ru_nivcsw` ab, was die Anzahl der Male ist, die ein CPU-Kontextwechsel aufgrund eines Prozesses mit höherer Priorität erfolgte, der ausführbar wurde, oder weil der aktuelle Prozess seine Zeitscheibe überschritten hat. Dieses Feld wird unter Windows nicht unterstützt.
  
 

::: code-group
```js [ESM]
import { resourceUsage } from 'node:process';

console.log(resourceUsage());
/*
  Will output:
  {
    userCPUTime: 82872,
    systemCPUTime: 4143,
    maxRSS: 33164,
    sharedMemorySize: 0,
    unsharedDataSize: 0,
    unsharedStackSize: 0,
    minorPageFault: 2469,
    majorPageFault: 0,
    swappedOut: 0,
    fsRead: 0,
    fsWrite: 8,
    ipcSent: 0,
    ipcReceived: 0,
    signalsCount: 0,
    voluntaryContextSwitches: 79,
    involuntaryContextSwitches: 1
  }
*/
```

```js [CJS]
const { resourceUsage } = require('node:process');

console.log(resourceUsage());
/*
  Will output:
  {
    userCPUTime: 82872,
    systemCPUTime: 4143,
    maxRSS: 33164,
    sharedMemorySize: 0,
    unsharedDataSize: 0,
    unsharedStackSize: 0,
    minorPageFault: 2469,
    majorPageFault: 0,
    swappedOut: 0,
    fsRead: 0,
    fsWrite: 8,
    ipcSent: 0,
    ipcReceived: 0,
    signalsCount: 0,
    voluntaryContextSwitches: 79,
    involuntaryContextSwitches: 1
  }
*/
```
:::


## `process.send(message[, sendHandle[, options]][, callback])` {#processsendmessage-sendhandle-options-callback}

**Hinzugefügt in: v0.5.9**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<net.Server\>](/de/nodejs/api/net#class-netserver) | [\<net.Socket\>](/de/nodejs/api/net#class-netsocket)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) wird verwendet, um das Senden bestimmter Handle-Typen zu parametrisieren. `options` unterstützt die folgenden Eigenschaften:
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ein Wert, der beim Übergeben von Instanzen von `net.Socket` verwendet werden kann. Wenn `true`, wird der Socket im sendenden Prozess offen gehalten. **Standard:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wenn Node.js mit einem IPC-Kanal erzeugt wurde, kann die Methode `process.send()` verwendet werden, um Nachrichten an den Elternprozess zu senden. Nachrichten werden als [`'message'`](/de/nodejs/api/child_process#event-message)-Ereignis im [`ChildProcess`](/de/nodejs/api/child_process#class-childprocess)-Objekt des Elternprozesses empfangen.

Wenn Node.js nicht mit einem IPC-Kanal erzeugt wurde, ist `process.send` `undefined`.

Die Nachricht durchläuft Serialisierung und Parsen. Die resultierende Nachricht ist möglicherweise nicht identisch mit dem, was ursprünglich gesendet wurde.

## `process.setegid(id)` {#processsetegidid}

**Hinzugefügt in: v2.0.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ein Gruppenname oder eine ID

Die Methode `process.setegid()` setzt die effektive Gruppenidentität des Prozesses. (Siehe [`setegid(2)`](http://man7.org/linux/man-pages/man2/setegid.2).) Die `id` kann entweder als numerische ID oder als Gruppenname-String übergeben werden. Wenn ein Gruppenname angegeben wird, blockiert diese Methode, während die zugehörige numerische ID aufgelöst wird.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getegid && process.setegid) {
  console.log(`Aktuelle gid: ${process.getegid()}`);
  try {
    process.setegid(501);
    console.log(`Neue gid: ${process.getegid()}`);
  } catch (err) {
    console.error(`Fehler beim Setzen der gid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getegid && process.setegid) {
  console.log(`Aktuelle gid: ${process.getegid()}`);
  try {
    process.setegid(501);
    console.log(`Neue gid: ${process.getegid()}`);
  } catch (err) {
    console.error(`Fehler beim Setzen der gid: ${err}`);
  }
}
```
:::

Diese Funktion ist nur auf POSIX-Plattformen verfügbar (d. h. nicht Windows oder Android). Diese Funktion ist in [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Threads nicht verfügbar.


## `process.seteuid(id)` {#processseteuidid}

**Hinzugefügt in: v2.0.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ein Benutzername oder eine ID

Die Methode `process.seteuid()` setzt die effektive Benutzeridentität des Prozesses. (Siehe [`seteuid(2)`](http://man7.org/linux/man-pages/man2/seteuid.2).) Die `id` kann entweder als numerische ID oder als Benutzername übergeben werden. Wenn ein Benutzername angegeben wird, blockiert die Methode, während die zugehörige numerische ID aufgelöst wird.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.geteuid && process.seteuid) {
  console.log(`Aktuelle UID: ${process.geteuid()}`);
  try {
    process.seteuid(501);
    console.log(`Neue UID: ${process.geteuid()}`);
  } catch (err) {
    console.error(`Fehler beim Setzen der UID: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.geteuid && process.seteuid) {
  console.log(`Aktuelle UID: ${process.geteuid()}`);
  try {
    process.seteuid(501);
    console.log(`Neue UID: ${process.geteuid()}`);
  } catch (err) {
    console.error(`Fehler beim Setzen der UID: ${err}`);
  }
}
```
:::

Diese Funktion ist nur auf POSIX-Plattformen verfügbar (d. h. nicht Windows oder Android). Diese Funktion ist in [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Threads nicht verfügbar.

## `process.setgid(id)` {#processsetgidid}

**Hinzugefügt in: v0.1.31**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Gruppenname oder die Gruppen-ID

Die Methode `process.setgid()` setzt die Gruppenidentität des Prozesses. (Siehe [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2).) Die `id` kann entweder als numerische ID oder als Gruppenname übergeben werden. Wenn ein Gruppenname angegeben wird, blockiert diese Methode, während die zugehörige numerische ID aufgelöst wird.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgid && process.setgid) {
  console.log(`Aktuelle GID: ${process.getgid()}`);
  try {
    process.setgid(501);
    console.log(`Neue GID: ${process.getgid()}`);
  } catch (err) {
    console.error(`Fehler beim Setzen der GID: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getgid && process.setgid) {
  console.log(`Aktuelle GID: ${process.getgid()}`);
  try {
    process.setgid(501);
    console.log(`Neue GID: ${process.getgid()}`);
  } catch (err) {
    console.error(`Fehler beim Setzen der GID: ${err}`);
  }
}
```
:::

Diese Funktion ist nur auf POSIX-Plattformen verfügbar (d. h. nicht Windows oder Android). Diese Funktion ist in [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Threads nicht verfügbar.


## `process.setgroups(groups)` {#processsetgroupsgroups}

**Hinzugefügt in: v0.9.4**

- `groups` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Methode `process.setgroups()` setzt die zusätzlichen Gruppen-IDs für den Node.js-Prozess. Dies ist ein privilegierter Vorgang, der voraussetzt, dass der Node.js-Prozess `root`-Rechte oder die `CAP_SETGID`-Fähigkeit besitzt.

Das `groups`-Array kann numerische Gruppen-IDs, Gruppennamen oder beides enthalten.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgroups && process.setgroups) {
  try {
    process.setgroups([501]);
    console.log(process.getgroups()); // new groups
  } catch (err) {
    console.error(`Failed to set groups: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getgroups && process.setgroups) {
  try {
    process.setgroups([501]);
    console.log(process.getgroups()); // new groups
  } catch (err) {
    console.error(`Failed to set groups: ${err}`);
  }
}
```
:::

Diese Funktion ist nur auf POSIX-Plattformen verfügbar (d.h. nicht Windows oder Android). Dieses Feature ist in [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Threads nicht verfügbar.

## `process.setuid(id)` {#processsetuidid}

**Hinzugefügt in: v0.1.28**

- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Methode `process.setuid(id)` setzt die Benutzeridentität des Prozesses. (Siehe [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2).) Die `id` kann entweder als numerische ID oder als Benutzername übergeben werden. Wenn ein Benutzername angegeben wird, blockiert die Methode während der Auflösung der zugehörigen numerischen ID.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getuid && process.setuid) {
  console.log(`Current uid: ${process.getuid()}`);
  try {
    process.setuid(501);
    console.log(`New uid: ${process.getuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getuid && process.setuid) {
  console.log(`Current uid: ${process.getuid()}`);
  try {
    process.setuid(501);
    console.log(`New uid: ${process.getuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```
:::

Diese Funktion ist nur auf POSIX-Plattformen verfügbar (d.h. nicht Windows oder Android). Dieses Feature ist in [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Threads nicht verfügbar.


## `process.setSourceMapsEnabled(val)` {#processsetsourcemapsenabledval}

**Hinzugefügt in: v16.6.0, v14.18.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `val` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Diese Funktion aktiviert oder deaktiviert die [Source Map v3](https://sourcemaps.info/spec)-Unterstützung für Stacktraces.

Sie bietet die gleichen Funktionen wie das Starten des Node.js-Prozesses mit den Kommandozeilenoptionen `--enable-source-maps`.

Nur Source Maps in JavaScript-Dateien, die geladen werden, nachdem Source Maps aktiviert wurde, werden geparst und geladen.

## `process.setUncaughtExceptionCaptureCallback(fn)` {#processsetuncaughtexceptioncapturecallbackfn}

**Hinzugefügt in: v9.3.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Die Funktion `process.setUncaughtExceptionCaptureCallback()` setzt eine Funktion, die aufgerufen wird, wenn eine unbehandelte Ausnahme auftritt, die den Ausnahme-Wert selbst als erstes Argument empfängt.

Wenn eine solche Funktion gesetzt ist, wird das [`'uncaughtException'`](/de/nodejs/api/process#event-uncaughtexception)-Ereignis nicht ausgelöst. Wenn `--abort-on-uncaught-exception` von der Befehlszeile übergeben oder über [`v8.setFlagsFromString()`](/de/nodejs/api/v8#v8setflagsfromstringflags) gesetzt wurde, wird der Prozess nicht abgebrochen. Aktionen, die bei Ausnahmen stattfinden sollen, wie z. B. Berichtserstellung, sind ebenfalls betroffen.

Um die Capture-Funktion aufzuheben, kann `process.setUncaughtExceptionCaptureCallback(null)` verwendet werden. Der Aufruf dieser Methode mit einem Nicht-`null`-Argument, während eine andere Capture-Funktion gesetzt ist, wirft einen Fehler.

Die Verwendung dieser Funktion schließt die Verwendung des veralteten integrierten [`domain`](/de/nodejs/api/domain)-Moduls gegenseitig aus.

## `process.sourceMapsEnabled` {#processsourcemapsenabled}

**Hinzugefügt in: v20.7.0, v18.19.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Die Eigenschaft `process.sourceMapsEnabled` gibt zurück, ob die [Source Map v3](https://sourcemaps.info/spec)-Unterstützung für Stacktraces aktiviert ist.


## `process.stderr` {#processstderr}

- [\<Stream\>](/de/nodejs/api/stream#stream)

Die Eigenschaft `process.stderr` gibt einen Stream zurück, der mit `stderr` (fd `2`) verbunden ist. Es ist ein [`net.Socket`](/de/nodejs/api/net#class-netsocket) (welches ein [Duplex](/de/nodejs/api/stream#duplex-and-transform-streams)-Stream ist), es sei denn, fd `2` verweist auf eine Datei, in diesem Fall ist es ein [Writable](/de/nodejs/api/stream#writable-streams)-Stream.

`process.stderr` unterscheidet sich in wichtigen Punkten von anderen Node.js-Streams. Weitere Informationen finden Sie unter [Hinweis zur Prozess-I/O](/de/nodejs/api/process#a-note-on-process-io).

### `process.stderr.fd` {#processstderrfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Diese Eigenschaft bezieht sich auf den Wert des zugrunde liegenden Dateideskriptors von `process.stderr`. Der Wert ist auf `2` festgelegt. In [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Threads existiert dieses Feld nicht.

## `process.stdin` {#processstdin}

- [\<Stream\>](/de/nodejs/api/stream#stream)

Die Eigenschaft `process.stdin` gibt einen Stream zurück, der mit `stdin` (fd `0`) verbunden ist. Es ist ein [`net.Socket`](/de/nodejs/api/net#class-netsocket) (welches ein [Duplex](/de/nodejs/api/stream#duplex-and-transform-streams)-Stream ist), es sei denn, fd `0` verweist auf eine Datei, in diesem Fall ist es ein [Readable](/de/nodejs/api/stream#readable-streams)-Stream.

Details zum Lesen von `stdin` finden Sie unter [`readable.read()`](/de/nodejs/api/stream#readablereadsize).

Als [Duplex](/de/nodejs/api/stream#duplex-and-transform-streams)-Stream kann `process.stdin` auch im "alten" Modus verwendet werden, der mit Skripten kompatibel ist, die für Node.js vor v0.10 geschrieben wurden. Weitere Informationen finden Sie unter [Stream-Kompatibilität](/de/nodejs/api/stream#compatibility-with-older-nodejs-versions).

Im "alten" Stream-Modus ist der `stdin`-Stream standardmäßig pausiert, daher muss man `process.stdin.resume()` aufrufen, um daraus zu lesen. Beachten Sie auch, dass der Aufruf von `process.stdin.resume()` den Stream selbst in den "alten" Modus versetzen würde.

### `process.stdin.fd` {#processstdinfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Diese Eigenschaft bezieht sich auf den Wert des zugrunde liegenden Dateideskriptors von `process.stdin`. Der Wert ist auf `0` festgelegt. In [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Threads existiert dieses Feld nicht.


## `process.stdout` {#processstdout}

- [\<Stream\>](/de/nodejs/api/stream#stream)

Die `process.stdout`-Eigenschaft gibt einen Stream zurück, der mit `stdout` (fd `1`) verbunden ist. Es handelt sich um ein [`net.Socket`](/de/nodejs/api/net#class-netsocket) (das ein [Duplex](/de/nodejs/api/stream#duplex-and-transform-streams)-Stream ist), es sei denn, fd `1` bezieht sich auf eine Datei. In diesem Fall ist es ein [Writable](/de/nodejs/api/stream#writable-streams)-Stream.

Um beispielsweise `process.stdin` nach `process.stdout` zu kopieren:

::: code-group
```js [ESM]
import { stdin, stdout } from 'node:process';

stdin.pipe(stdout);
```

```js [CJS]
const { stdin, stdout } = require('node:process');

stdin.pipe(stdout);
```
:::

`process.stdout` unterscheidet sich in wichtigen Punkten von anderen Node.js-Streams. Weitere Informationen finden Sie unter [Hinweis zur Prozess-E/A](/de/nodejs/api/process#a-note-on-process-io).

### `process.stdout.fd` {#processstdoutfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Diese Eigenschaft bezieht sich auf den Wert des zugrunde liegenden Dateideskriptors von `process.stdout`. Der Wert ist fest auf `1` gesetzt. In [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Threads existiert dieses Feld nicht.

### Ein Hinweis zur Prozess-E/A {#a-note-on-process-i/o}

`process.stdout` und `process.stderr` unterscheiden sich in wichtigen Punkten von anderen Node.js-Streams:

Diese Verhaltensweisen haben zum Teil historische Gründe, da ihre Änderung zu Abwärtsinkompatibilität führen würde, aber sie werden auch von einigen Benutzern erwartet.

Synchrones Schreiben vermeidet Probleme wie z. B. dass Ausgaben, die mit `console.log()` oder `console.error()` geschrieben wurden, unerwartet verschachtelt werden oder überhaupt nicht geschrieben werden, wenn `process.exit()` aufgerufen wird, bevor ein asynchroner Schreibvorgang abgeschlossen ist. Weitere Informationen finden Sie unter [`process.exit()`](/de/nodejs/api/process#processexitcode).

*<strong>Warnung</strong>*: Synchrones Schreiben blockiert die Ereignisschleife, bis der Schreibvorgang abgeschlossen ist. Dies kann im Fall der Ausgabe in eine Datei nahezu augenblicklich erfolgen, aber unter hoher Systemlast, bei Pipes, die am empfangenden Ende nicht gelesen werden, oder bei langsamen Terminals oder Dateisystemen ist es möglich, dass die Ereignisschleife oft genug und lange genug blockiert wird, um erhebliche negative Auswirkungen auf die Leistung zu haben. Dies ist möglicherweise kein Problem, wenn in eine interaktive Terminal-Sitzung geschrieben wird, aber dies sollte besonders bei der Produktionsprotokollierung in die Prozessausgabestreams berücksichtigt werden.

Um zu überprüfen, ob ein Stream mit einem [TTY](/de/nodejs/api/tty#tty)-Kontext verbunden ist, überprüfen Sie die Eigenschaft `isTTY`.

Zum Beispiel:

```bash [BASH]
$ node -p "Boolean(process.stdin.isTTY)"
true
$ echo "foo" | node -p "Boolean(process.stdin.isTTY)"
false
$ node -p "Boolean(process.stdout.isTTY)"
true
$ node -p "Boolean(process.stdout.isTTY)" | cat
false
```
Weitere Informationen finden Sie in der [TTY](/de/nodejs/api/tty#tty)-Dokumentation.


## `process.throwDeprecation` {#processthrowdeprecation}

**Hinzugefügt in: v0.9.12**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Der Initialwert von `process.throwDeprecation` gibt an, ob das Flag `--throw-deprecation` im aktuellen Node.js-Prozess gesetzt ist. `process.throwDeprecation` ist veränderlich, sodass sich zur Laufzeit ändern kann, ob Veraltungswarnungen zu Fehlern führen oder nicht. Weitere Informationen finden Sie in der Dokumentation für das [`'warning'`-Ereignis](/de/nodejs/api/process#event-warning) und die [`emitWarning()`-Methode](/de/nodejs/api/process#processemitwarningwarning-type-code-ctor).

```bash [BASH]
$ node --throw-deprecation -p "process.throwDeprecation"
true
$ node -p "process.throwDeprecation"
undefined
$ node
> process.emitWarning('test', 'DeprecationWarning');
undefined
> (node:26598) DeprecationWarning: test
> process.throwDeprecation = true;
true
> process.emitWarning('test', 'DeprecationWarning');
Thrown:
[DeprecationWarning: test] { name: 'DeprecationWarning' }
```
## `process.title` {#processtitle}

**Hinzugefügt in: v0.1.104**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Eigenschaft `process.title` gibt den aktuellen Prozesstitel zurück (d. h. den aktuellen Wert von `ps`). Das Zuweisen eines neuen Werts zu `process.title` ändert den aktuellen Wert von `ps`.

Wenn ein neuer Wert zugewiesen wird, legen verschiedene Plattformen unterschiedliche maximale Längenbeschränkungen für den Titel fest. Normalerweise sind solche Beschränkungen recht begrenzt. Unter Linux und macOS ist `process.title` beispielsweise auf die Größe des binären Namens plus die Länge der Befehlszeilenargumente beschränkt, da das Setzen von `process.title` den `argv`-Speicher des Prozesses überschreibt. Node.js v0.8 erlaubte längere Prozesstitelstrings, indem auch der `environ`-Speicher überschrieben wurde, aber das war potenziell unsicher und in einigen (eher obskuren) Fällen verwirrend.

Das Zuweisen eines Wertes zu `process.title` führt möglicherweise nicht zu einer genauen Beschriftung in Prozessmanageranwendungen wie macOS Activity Monitor oder Windows Services Manager.


## `process.traceDeprecation` {#processtracedeprecation}

**Hinzugefügt in: v0.8.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Die Eigenschaft `process.traceDeprecation` gibt an, ob das Flag `--trace-deprecation` im aktuellen Node.js-Prozess gesetzt ist. Weitere Informationen zum Verhalten dieses Flags finden Sie in der Dokumentation für das [`'warning'`-Ereignis](/de/nodejs/api/process#event-warning) und die [`emitWarning()`-Methode](/de/nodejs/api/process#processemitwarningwarning-type-code-ctor).

## `process.umask()` {#processumask}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.0.0, v12.19.0 | Der Aufruf von `process.umask()` ohne Argumente ist veraltet. |
| v0.1.19 | Hinzugefügt in: v0.1.19 |
:::

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet. Der Aufruf von `process.umask()` ohne Argument führt dazu, dass die prozessweite umask zweimal geschrieben wird. Dies führt zu einer Race Condition zwischen Threads und stellt eine potenzielle Sicherheitslücke dar. Es gibt keine sichere, plattformübergreifende alternative API.
:::

`process.umask()` gibt die Dateimodus-Erstellungsmaske des Node.js-Prozesses zurück. Kindprozesse erben die Maske vom Elternprozess.

## `process.umask(mask)` {#processumaskmask}

**Hinzugefügt in: v0.1.19**

- `mask` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.umask(mask)` legt die Dateimodus-Erstellungsmaske des Node.js-Prozesses fest. Kindprozesse erben die Maske vom Elternprozess. Gibt die vorherige Maske zurück.

::: code-group
```js [ESM]
import { umask } from 'node:process';

const newmask = 0o022;
const oldmask = umask(newmask);
console.log(
  `Changed umask from ${oldmask.toString(8)} to ${newmask.toString(8)}`,
);
```

```js [CJS]
const { umask } = require('node:process');

const newmask = 0o022;
const oldmask = umask(newmask);
console.log(
  `Changed umask from ${oldmask.toString(8)} to ${newmask.toString(8)}`,
);
```
:::

In [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Threads löst `process.umask(mask)` eine Ausnahme aus.


## `process.uptime()` {#processuptime}

**Hinzugefügt in: v0.5.0**

- Gibt zurück: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die Methode `process.uptime()` gibt die Anzahl der Sekunden zurück, die der aktuelle Node.js-Prozess läuft.

Der Rückgabewert enthält Bruchteile einer Sekunde. Verwenden Sie `Math.floor()`, um ganze Sekunden zu erhalten.

## `process.version` {#processversion}

**Hinzugefügt in: v0.1.3**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Eigenschaft `process.version` enthält die Node.js-Versionszeichenfolge.

::: code-group
```js [ESM]
import { version } from 'node:process';

console.log(`Version: ${version}`);
// Version: v14.8.0
```

```js [CJS]
const { version } = require('node:process');

console.log(`Version: ${version}`);
// Version: v14.8.0
```
:::

Um die Versionszeichenfolge ohne das vorangestellte *v* zu erhalten, verwenden Sie `process.versions.node`.

## `process.versions` {#processversions}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v9.0.0 | Die Eigenschaft `v8` enthält jetzt ein Node.js-spezifisches Suffix. |
| v4.2.0 | Die Eigenschaft `icu` wird jetzt unterstützt. |
| v0.2.0 | Hinzugefügt in: v0.2.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Die Eigenschaft `process.versions` gibt ein Objekt zurück, das die Versionszeichenfolgen von Node.js und seinen Abhängigkeiten auflistet. `process.versions.modules` gibt die aktuelle ABI-Version an, die immer dann erhöht wird, wenn sich eine C++-API ändert. Node.js weigert sich, Module zu laden, die gegen eine andere Modul-ABI-Version kompiliert wurden.

::: code-group
```js [ESM]
import { versions } from 'node:process';

console.log(versions);
```

```js [CJS]
const { versions } = require('node:process');

console.log(versions);
```
:::

Erzeugt ein Objekt ähnlich wie:

```bash [BASH]
{ node: '23.0.0',
  acorn: '8.11.3',
  ada: '2.7.8',
  ares: '1.28.1',
  base64: '0.5.2',
  brotli: '1.1.0',
  cjs_module_lexer: '1.2.2',
  cldr: '45.0',
  icu: '75.1',
  llhttp: '9.2.1',
  modules: '127',
  napi: '9',
  nghttp2: '1.61.0',
  nghttp3: '0.7.0',
  ngtcp2: '1.3.0',
  openssl: '3.0.13+quic',
  simdjson: '3.8.0',
  simdutf: '5.2.4',
  sqlite: '3.46.0',
  tz: '2024a',
  undici: '6.13.0',
  unicode: '15.1',
  uv: '1.48.0',
  uvwasi: '0.0.20',
  v8: '12.4.254.14-node.11',
  zlib: '1.3.0.1-motley-7d77fb7' }
```

## Exit-Codes {#exit-codes}

Node.js beendet sich normalerweise mit dem Statuscode `0`, wenn keine asynchronen Operationen mehr ausstehen. In anderen Fällen werden die folgenden Statuscodes verwendet:

- `1` **Unbehandelte fatale Ausnahme**: Es gab eine unbehandelte Ausnahme, die nicht von einer Domain oder einem [`'uncaughtException'`](/de/nodejs/api/process#event-uncaughtexception)-Ereignis-Handler behandelt wurde.
- `2`: Unbenutzt (von Bash für eingebauten Missbrauch reserviert)
- `3` **Interner JavaScript-Parse-Fehler**: Der interne JavaScript-Quellcode im Node.js-Bootstrapping-Prozess verursachte einen Parse-Fehler. Dies ist äußerst selten und kann in der Regel nur während der Entwicklung von Node.js selbst auftreten.
- `4` **Interne JavaScript-Evaluierungsfehler**: Der interne JavaScript-Quellcode im Node.js-Bootstrapping-Prozess konnte bei der Auswertung keinen Funktionswert zurückgeben. Dies ist äußerst selten und kann in der Regel nur während der Entwicklung von Node.js selbst auftreten.
- `5` **Fataler Fehler**: Es gab einen fatalen, nicht behebaren Fehler in V8. Normalerweise wird eine Meldung mit dem Präfix `FATAL ERROR` in stderr ausgegeben.
- `6` **Nicht-funktionierender interner Ausnahme-Handler**: Es gab eine unbehandelte Ausnahme, aber die interne Funktion für fatale Ausnahmen wurde irgendwie auf einen Nicht-Funktionswert gesetzt und konnte nicht aufgerufen werden.
- `7` **Interner Ausnahme-Handler Laufzeitfehler**: Es gab eine unbehandelte Ausnahme, und die interne Funktion für fatale Ausnahmen selbst hat einen Fehler ausgelöst, als sie versuchte, sie zu behandeln. Dies kann beispielsweise passieren, wenn ein [`'uncaughtException'`](/de/nodejs/api/process#event-uncaughtexception) oder `domain.on('error')`-Handler einen Fehler auslöst.
- `8`: Unbenutzt. In früheren Versionen von Node.js wies der Exit-Code 8 manchmal auf eine unbehandelte Ausnahme hin.
- `9` **Ungültiges Argument**: Entweder wurde eine unbekannte Option angegeben, oder eine Option, die einen Wert erfordert, wurde ohne Wert angegeben.
- `10` **Interner JavaScript-Laufzeitfehler**: Der interne JavaScript-Quellcode im Node.js-Bootstrapping-Prozess hat einen Fehler ausgelöst, als die Bootstrapping-Funktion aufgerufen wurde. Dies ist äußerst selten und kann in der Regel nur während der Entwicklung von Node.js selbst auftreten.
- `12` **Ungültiges Debug-Argument**: Die Optionen `--inspect` und/oder `--inspect-brk` wurden gesetzt, aber die gewählte Portnummer war ungültig oder nicht verfügbar.
- `13` **Unerfülltes Top-Level Await**: `await` wurde außerhalb einer Funktion im Top-Level-Code verwendet, aber das übergebene `Promise` wurde nie erfüllt.
- `14` **Snapshot Fehler**: Node.js wurde gestartet, um einen V8-Start-Snapshot zu erstellen, und dies schlug fehl, da bestimmte Anforderungen an den Zustand der Anwendung nicht erfüllt wurden.
- `\>128` **Signalbeendigungen**: Wenn Node.js ein fatales Signal wie `SIGKILL` oder `SIGHUP` empfängt, ist sein Exit-Code `128` plus der Wert des Signalcodes. Dies ist eine Standard-POSIX-Praxis, da Exit-Codes als 7-Bit-Ganzzahlen definiert sind und Signalbeendigungen das höchstwertige Bit setzen und dann den Wert des Signalcodes enthalten. Beispielsweise hat das Signal `SIGABRT` den Wert `6`, sodass der erwartete Exit-Code `128` + `6` oder `134` beträgt.

