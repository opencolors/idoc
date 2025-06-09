---
title: Verstehen des Node.js-Event-Loops
description: Der Event-Loop ist das Kernstück von Node.js, das die Ausführung von nicht blockierenden I/O-Operationen ermöglicht. Es handelt sich um einen Single-Thread-Loop, der Operationen an den Systemkernel auslagert, wenn dies möglich ist.
head:
  - - meta
    - name: og:title
      content: Verstehen des Node.js-Event-Loops | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Der Event-Loop ist das Kernstück von Node.js, das die Ausführung von nicht blockierenden I/O-Operationen ermöglicht. Es handelt sich um einen Single-Thread-Loop, der Operationen an den Systemkernel auslagert, wenn dies möglich ist.
  - - meta
    - name: twitter:title
      content: Verstehen des Node.js-Event-Loops | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Der Event-Loop ist das Kernstück von Node.js, das die Ausführung von nicht blockierenden I/O-Operationen ermöglicht. Es handelt sich um einen Single-Thread-Loop, der Operationen an den Systemkernel auslagert, wenn dies möglich ist.
---


# Die Node.js Event Loop

## Was ist die Event Loop?

Die Event Loop ermöglicht es Node.js, nicht-blockierende I/O-Operationen durchzuführen - trotz der Tatsache, dass standardmäßig ein einzelner JavaScript-Thread verwendet wird - indem Operationen nach Möglichkeit an den Systemkernel ausgelagert werden.

Da die meisten modernen Kernel Multithreaded sind, können sie mehrere Operationen verarbeiten, die im Hintergrund ausgeführt werden. Wenn eine dieser Operationen abgeschlossen ist, teilt der Kernel Node.js dies mit, sodass der entsprechende Callback der Poll-Queue hinzugefügt werden kann, um schließlich ausgeführt zu werden. Wir werden dies später in diesem Thema genauer erläutern.

## Event Loop erklärt

Wenn Node.js startet, initialisiert es die Event Loop, verarbeitet das bereitgestellte Eingabe-Skript (oder wechselt in die REPL, die in diesem Dokument nicht behandelt wird), das asynchrone API-Aufrufe tätigen, Timer planen oder process.nextTick() aufrufen kann, und beginnt dann mit der Verarbeitung der Event Loop.

Das folgende Diagramm zeigt eine vereinfachte Übersicht über die Reihenfolge der Operationen der Event Loop.

```bash
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

::: tip
Jeder Kasten wird als "Phase" der Event Loop bezeichnet.
:::

Jede Phase hat eine FIFO-Queue von Callbacks, die ausgeführt werden sollen. Während jede Phase auf ihre Weise besonders ist, führt die Event Loop im Allgemeinen, wenn sie in eine bestimmte Phase eintritt, alle Operationen aus, die für diese Phase spezifisch sind, und führt dann Callbacks in der Queue dieser Phase aus, bis die Queue erschöpft ist oder die maximale Anzahl von Callbacks ausgeführt wurde. Wenn die Queue erschöpft ist oder das Callback-Limit erreicht ist, geht die Event Loop zur nächsten Phase über usw.

Da jede dieser Operationen weitere Operationen planen kann und neue Ereignisse, die in der **Poll**-Phase verarbeitet werden, vom Kernel in die Warteschlange gestellt werden, können Poll-Ereignisse in die Warteschlange gestellt werden, während Poll-Ereignisse verarbeitet werden. Infolgedessen können lang laufende Callbacks dazu führen, dass die Poll-Phase viel länger als der Schwellenwert eines Timers läuft. Weitere Informationen finden Sie in den Abschnitten Timer und Poll.

::: tip
Es gibt eine leichte Diskrepanz zwischen der Windows- und der Unix/Linux-Implementierung, aber das ist für diese Demonstration nicht wichtig. Die wichtigsten Teile sind hier. Es gibt tatsächlich sieben oder acht Schritte, aber die, die uns interessieren - die, die Node.js tatsächlich verwendet - sind die oben genannten.
:::


## Phasenübersicht
- **Timer**: Diese Phase führt Callbacks aus, die durch `setTimeout()` und `setInterval()` geplant wurden.
- **Ausstehende Callbacks**: Führt I/O-Callbacks aus, die auf die nächste Schleifeniteration verschoben wurden.
- **Leerlauf, Vorbereitung**: Wird nur intern verwendet.
- **Poll**: Ruft neue I/O-Ereignisse ab; führt I/O-bezogene Callbacks aus (fast alle mit Ausnahme von Close-Callbacks, den durch Timer geplanten und `setImmediate()`); Node blockiert hier, wenn es angebracht ist.
- **Check**: `setImmediate()` Callbacks werden hier aufgerufen.
- **Close-Callbacks**: Einige Close-Callbacks, z. B. `socket.on('close', ...)`.

Zwischen jedem Durchlauf der Ereignisschleife prüft Node.js, ob es auf asynchrone I/O- oder Timer wartet und fährt sauber herunter, wenn keine vorhanden sind.

## Phasen im Detail

### Timer

Ein Timer gibt den **Schwellenwert** an, nach dem ein bereitgestellter Callback ausgeführt werden kann, und nicht den **genauen** Zeitpunkt, zu dem eine Person *möchte, dass er ausgeführt wird*. Timer-Callbacks werden so früh wie möglich ausgeführt, nachdem die angegebene Zeitspanne verstrichen ist. Die Planung durch das Betriebssystem oder die Ausführung anderer Callbacks kann sie jedoch verzögern.

::: tip
Technisch gesehen steuert die [Poll](/de/nodejs/guide/nodejs-event-loop#poll)-Phase, wann Timer ausgeführt werden.
:::

Nehmen wir beispielsweise an, Sie planen einen Timeout zur Ausführung nach einem Schwellenwert von 100 ms, dann beginnt Ihr Skript asynchron eine Datei zu lesen, was 95 ms dauert:

```js
const fs = require('node:fs');
function someAsyncOperation(callback) {
  // Nehmen wir an, dies dauert 95 ms bis zum Abschluss
  fs.readFile('/path/to/file', callback);
}
const timeoutScheduled = Date.now();
setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;
  console.log(`${delay}ms sind vergangen, seit ich geplant wurde`);
}, 100);
// führe someAsyncOperation aus, was 95 ms bis zum Abschluss dauert
someAsyncOperation(() => {
  const startCallback = Date.now();
  // tue etwas, das 10ms dauern wird ...
  while (Date.now() - startCallback < 10) {
    // tue nichts
  }
});
```

Wenn die Ereignisschleife in die **Poll**-Phase eintritt, hat sie eine leere Warteschlange (`fs.readFile()` ist noch nicht abgeschlossen), sodass sie für die Anzahl der ms wartet, die verbleiben, bis der Schwellenwert des frühesten Timers erreicht ist. Während des Wartens vergehen 95 ms, `fs.readFile()` liest die Datei fertig und sein Callback, der 10 ms bis zum Abschluss benötigt, wird der Poll-Warteschlange hinzugefügt und ausgeführt. Wenn der Callback abgeschlossen ist, befinden sich keine weiteren Callbacks in der Warteschlange, sodass die Ereignisschleife feststellt, dass der Schwellenwert des frühesten Timers erreicht wurde, und kehrt dann zur Timer-Phase zurück, um den Callback des Timers auszuführen. In diesem Beispiel sehen Sie, dass die Gesamtverzögerung zwischen der Planung des Timers und der Ausführung seines Callbacks 105 ms beträgt.

::: tip
Um zu verhindern, dass die Poll-Phase die Ereignisschleife aushungert, hat [libuv](https://libuv.org/) (die C-Bibliothek, die die Node.js-Ereignisschleife und alle asynchronen Verhaltensweisen der Plattform implementiert) auch ein hartes Maximum (systemabhängig), bevor sie aufhört, nach weiteren Ereignissen zu suchen.
:::


## Ausstehende Rückrufe
Diese Phase führt Rückrufe für einige Systemoperationen aus, wie z. B. Arten von TCP-Fehlern. Wenn beispielsweise ein TCP-Socket bei dem Versuch, eine Verbindung herzustellen, `ECONNREFUSED` empfängt, möchten einige *nix-Systeme warten, um den Fehler zu melden. Dies wird in die Phase der **ausstehenden Rückrufe** eingereiht, um ausgeführt zu werden.

### Poll

Die **Poll**-Phase hat zwei Hauptfunktionen:

1. Berechnen, wie lange sie blockieren und auf E/A warten soll, und dann
2. Verarbeiten von Ereignissen in der **Poll**-Warteschlange.

Wenn die Ereignisschleife in die **Poll**-Phase eintritt und keine Timer geplant sind, passiert eines von zwei Dingen:

- Wenn die ***Poll***-Warteschlange ***nicht leer ist***, iteriert die Ereignisschleife durch ihre Warteschlange von Rückrufen und führt sie synchron aus, bis entweder die Warteschlange erschöpft ist oder das systemabhängige harte Limit erreicht ist.

- Wenn die ***Poll***-Warteschlange ***leer ist***, passiert eines von zwei weiteren Dingen:

    - Wenn Skripte durch `setImmediate()` geplant wurden, beendet die Ereignisschleife die **Poll**-Phase und fährt mit der Check-Phase fort, um diese geplanten Skripte auszuführen.

    - Wenn Skripte **nicht** durch `setImmediate()` geplant wurden, wartet die Ereignisschleife, bis Rückrufe zur Warteschlange hinzugefügt werden, und führt sie dann sofort aus.

Sobald die **Poll**-Warteschlange leer ist, überprüft die Ereignisschleife Timer, *deren Zeitschwellen* erreicht wurden. Wenn ein oder mehrere Timer bereit sind, wechselt die Ereignisschleife zurück zur **Timer**-Phase, um die Rückrufe dieser Timer auszuführen.

### Check

Diese Phase ermöglicht es einer Person, Rückrufe unmittelbar nach Abschluss der **Poll**-Phase auszuführen. Wenn die **Poll**-Phase in den Leerlauf geht und Skripte mit `setImmediate()` in die Warteschlange gestellt wurden, kann die Ereignisschleife mit der Check-Phase fortfahren, anstatt zu warten.

`setImmediate()` ist eigentlich ein spezieller Timer, der in einer separaten Phase der Ereignisschleife läuft. Er verwendet eine libuv-API, die Rückrufe plant, um sie nach Abschluss der **Poll**-Phase auszuführen.

Im Allgemeinen erreicht die Ereignisschleife schließlich die **Poll**-Phase, in der sie auf eine eingehende Verbindung, Anfrage usw. wartet, während der Code ausgeführt wird. Wenn jedoch ein Rückruf mit `setImmediate()` geplant wurde und die **Poll**-Phase in den Leerlauf geht, wird sie beendet und mit der **Check**-Phase fortgefahren, anstatt auf **Poll**-Ereignisse zu warten.


### Close-Callbacks

Wenn ein Socket oder Handle abrupt geschlossen wird (z. B. `socket.destroy()`), wird das `'close'`-Ereignis in dieser Phase ausgelöst. Andernfalls wird es über `process.nextTick()` ausgelöst.

## `setImmediate()` vs. `setTimeout()`

`setImmediate()` und `setTimeout()` sind ähnlich, verhalten sich aber unterschiedlich, je nachdem, wann sie aufgerufen werden.

- `setImmediate()` ist so konzipiert, dass es ein Skript ausführt, sobald die aktuelle **Poll**-Phase abgeschlossen ist.
- `setTimeout()` plant die Ausführung eines Skripts, nachdem ein Mindestschwellenwert in ms verstrichen ist.

Die Reihenfolge, in der die Timer ausgeführt werden, variiert je nach Kontext, in dem sie aufgerufen werden. Wenn beide innerhalb des Hauptmoduls aufgerufen werden, ist das Timing an die Leistung des Prozesses gebunden (die durch andere auf dem Rechner laufende Anwendungen beeinträchtigt werden kann).

Wenn wir beispielsweise das folgende Skript ausführen, das sich nicht innerhalb eines I/O-Zyklus befindet (d. h. das Hauptmodul), ist die Reihenfolge, in der die beiden Timer ausgeführt werden, nicht deterministisch, da sie an die Leistung des Prozesses gebunden ist:

::: code-group

```js [JS]
// timeout_vs_immediate.js
setTimeout(() => {
  console.log('timeout');
}, 0);
setImmediate(() => {
  console.log('immediate');
});
```

```bash [BASH]
$ node timeout_vs_immediate.js
timeout
immediate
$ node timeout_vs_immediate.js
immediate
timeout
```

:::

Wenn Sie die beiden Aufrufe jedoch in einen I/O-Zyklus verschieben, wird der Immediate-Callback immer zuerst ausgeführt:

::: code-group

```js [JS]
// timeout_vs_immediate.js
const fs = require('node:fs');
fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});
```

```bash [BASH]
$ node timeout_vs_immediate.js
immediate
timeout
$ node timeout_vs_immediate.js
immediate
timeout
```

:::

Der Hauptvorteil der Verwendung von `setImmediate()` gegenüber `setTimeout()` besteht darin, dass `setImmediate()` immer vor allen Timern ausgeführt wird, wenn es innerhalb eines I/O-Zyklus geplant ist, unabhängig davon, wie viele Timer vorhanden sind.


## `process.nextTick()`

### `process.nextTick()` verstehen

Vielleicht ist Ihnen aufgefallen, dass `process.nextTick()` nicht im Diagramm angezeigt wurde, obwohl es Teil der asynchronen API ist. Dies liegt daran, dass `process.nextTick()` technisch gesehen nicht Teil der Event-Loop ist. Stattdessen wird die `nextTickQueue` verarbeitet, nachdem die aktuelle Operation abgeschlossen ist, unabhängig von der aktuellen Phase der Event-Loop. Hier ist eine Operation als Übergang vom zugrunde liegenden C/C++-Handler und der Verarbeitung des auszuführenden JavaScripts definiert.

Wenn wir uns unser Diagramm noch einmal ansehen, werden jedes Mal, wenn Sie `process.nextTick()` in einer bestimmten Phase aufrufen, alle an `process.nextTick()` übergebenen Callbacks aufgelöst, bevor die Event-Loop fortgesetzt wird. Dies kann zu einigen schlechten Situationen führen, da **Sie Ihre I/O "aushungern" können, indem Sie rekursive** `process.nextTick()`-Aufrufe tätigen, was verhindert, dass die Event-Loop die **Poll**-Phase erreicht.

### Warum sollte das erlaubt sein?

Warum sollte so etwas in Node.js enthalten sein? Ein Teil davon ist eine Designphilosophie, bei der eine API immer asynchron sein sollte, auch wenn dies nicht erforderlich ist. Nehmen Sie zum Beispiel diesen Code-Ausschnitt:

```js
function apiCall(arg, callback) {
  if (typeof arg !== 'string')
    return process.nextTick(
      callback,
      new TypeError('argument should be string')
    );
}
```

Der Ausschnitt führt eine Argumentprüfung durch, und wenn sie nicht korrekt ist, wird der Fehler an den Callback übergeben. Die API wurde erst kürzlich aktualisiert, um die Übergabe von Argumenten an `process.nextTick()` zu ermöglichen, sodass alle nach dem Callback übergebenen Argumente als Argumente an den Callback weitergegeben werden können, sodass Sie keine Funktionen verschachteln müssen.

Wir geben einen Fehler an den Benutzer zurück, jedoch erst, nachdem wir dem Rest des Codes des Benutzers die Ausführung erlaubt haben. Durch die Verwendung von `process.nextTick()` garantieren wir, dass `apiCall()` seinen Callback immer nach dem Rest des Codes des Benutzers und bevor die Event-Loop fortgesetzt werden darf, ausführt. Um dies zu erreichen, darf sich der JS-Call-Stack abwickeln und dann sofort den bereitgestellten Callback ausführen, wodurch eine Person rekursive Aufrufe an `process.nextTick()` tätigen kann, ohne einen `RangeError: Maximum call stack size exceeded from v8` zu erreichen.

Diese Philosophie kann zu potenziell problematischen Situationen führen. Nehmen Sie zum Beispiel diesen Ausschnitt:

```js
let bar;
// this has an asynchronous signature, but calls callback synchronously
function someAsyncApiCall(callback) {
  callback();
}
// the callback is called before `someAsyncApiCall` completes.
someAsyncApiCall(() => {
  // since someAsyncApiCall hasn't completed, bar hasn't been assigned any value
  console.log('bar', bar); // undefined
});
bar = 1;
```

Der Benutzer definiert `someAsyncApiCall()` so, dass es eine asynchrone Signatur hat, aber es arbeitet tatsächlich synchron. Wenn es aufgerufen wird, wird der an `someAsyncApiCall()` bereitgestellte Callback in derselben Phase der Event-Loop aufgerufen, da `someAsyncApiCall()` tatsächlich nichts asynchron tut. Infolgedessen versucht der Callback, auf bar zu verweisen, obwohl diese Variable möglicherweise noch nicht im Gültigkeitsbereich liegt, da das Skript noch nicht vollständig ausgeführt werden konnte.

Indem der Callback in ein `process.nextTick()` platziert wird, hat das Skript immer noch die Möglichkeit, vollständig ausgeführt zu werden, wodurch alle Variablen, Funktionen usw. vor dem Aufruf des Callbacks initialisiert werden können. Es hat auch den Vorteil, dass die Event-Loop nicht fortgesetzt werden darf. Es kann für den Benutzer nützlich sein, auf einen Fehler aufmerksam gemacht zu werden, bevor die Event-Loop fortgesetzt werden darf. Hier ist das vorherige Beispiel mit `process.nextTick()`:

```js
let bar;
function someAsyncApiCall(callback) {
  process.nextTick(callback);
}
someAsyncApiCall(() => {
  console.log('bar', bar); // 1
});
bar = 1;
```

Hier ist ein weiteres Beispiel aus der realen Welt:

```js
const server = net.createServer(() => {}).listen(8080);
server.on('listening', () => {});
```

Wenn nur ein Port übergeben wird, wird der Port sofort gebunden. Der `'listening'`-Callback könnte also sofort aufgerufen werden. Das Problem ist, dass der `.on('listening')`-Callback zu diesem Zeitpunkt noch nicht festgelegt wurde.

Um dies zu umgehen, wird das `'listening'`-Ereignis in einem `nextTick()` in die Warteschlange gestellt, damit das Skript vollständig ausgeführt werden kann. Dies ermöglicht dem Benutzer, alle gewünschten Event-Handler festzulegen.


## `process.nextTick()` vs. `setImmediate()`

Wir haben zwei Aufrufe, die für Benutzer in Bezug auf ihre Funktion ähnlich sind, deren Namen aber verwirrend sind.

- `process.nextTick()` wird sofort in derselben Phase ausgeführt.
- `setImmediate()` wird in der folgenden Iteration oder dem folgenden „Tick“ der Ereignisschleife ausgeführt.

Im Wesentlichen sollten die Namen vertauscht werden. `process.nextTick()` wird schneller ausgeführt als `setImmediate()`, aber dies ist ein Artefakt der Vergangenheit, das sich wahrscheinlich nicht ändern wird. Diese Änderung würde einen großen Teil der Pakete auf npm zerstören. Jeden Tag werden neue Module hinzugefügt, was bedeutet, dass jedes Warten mehr potenzielle Fehlerquellen schafft. Obwohl sie verwirrend sind, werden sich die Namen selbst nicht ändern.

::: tip
Wir empfehlen Entwicklern, in allen Fällen `setImmediate()` zu verwenden, da es einfacher zu handhaben ist.
:::

## Warum `process.nextTick()` verwenden?

Es gibt zwei Hauptgründe:

1. Benutzern ermöglichen, Fehler zu behandeln, unnötige Ressourcen zu bereinigen oder die Anfrage erneut zu versuchen, bevor die Ereignisschleife fortgesetzt wird.

2. Manchmal ist es notwendig, einen Callback auszuführen, nachdem der Callstack abgewickelt wurde, aber bevor die Ereignisschleife fortgesetzt wird.

Ein Beispiel ist die Erfüllung der Erwartungen des Benutzers. Einfaches Beispiel:

```js
const server = net.createServer();
server.on('connection', conn => {});
server.listen(8080);
server.on('listening', () => {});
```

Angenommen, `listen()` wird am Anfang der Ereignisschleife ausgeführt, aber der Listening-Callback wird in `setImmediate()` platziert. Sofern kein Hostname übergeben wird, erfolgt die Bindung an den Port sofort. Damit die Ereignisschleife fortgesetzt werden kann, muss sie die Abrufphase erreichen, was bedeutet, dass es eine Wahrscheinlichkeit ungleich Null gibt, dass eine Verbindung empfangen wurde, wodurch das Connection-Ereignis vor dem Listening-Ereignis ausgelöst werden kann.

Ein weiteres Beispiel ist das Erweitern eines `EventEmitter` und das Auslösen eines Ereignisses aus dem Konstruktor heraus:

```js
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {
  constructor() {
    super();
    this.emit('event');
  }
}
const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
```

Sie können ein Ereignis nicht sofort vom Konstruktor aus auslösen, da das Skript noch nicht so weit verarbeitet wurde, dass der Benutzer diesem Ereignis einen Callback zuweist. Innerhalb des Konstruktors selbst können Sie also `process.nextTick()` verwenden, um einen Callback festzulegen, der das Ereignis auslöst, nachdem der Konstruktor abgeschlossen ist, was die erwarteten Ergebnisse liefert:

```js
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {
  constructor() {
    super();
    // use nextTick to emit the event once a handler is assigned
    process.nextTick(() => {
      this.emit('event');
    });
  }
}
const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
```
