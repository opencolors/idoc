---
title: JavaScript-Timer - setTimeout und setInterval
description: Erfahren Sie, wie Sie JavaScript-Timer verwenden, um die Ausführung von Funktionen zu verzögern und Aufgaben mit setTimeout und setInterval zu planen.
head:
  - - meta
    - name: og:title
      content: JavaScript-Timer - setTimeout und setInterval | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie JavaScript-Timer verwenden, um die Ausführung von Funktionen zu verzögern und Aufgaben mit setTimeout und setInterval zu planen.
  - - meta
    - name: twitter:title
      content: JavaScript-Timer - setTimeout und setInterval | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie JavaScript-Timer verwenden, um die Ausführung von Funktionen zu verzögern und Aufgaben mit setTimeout und setInterval zu planen.
---


# JavaScript-Timer entdecken

### `setTimeout()`

Beim Schreiben von JavaScript-Code möchten Sie möglicherweise die Ausführung einer Funktion verzögern.

Das ist die Aufgabe von `setTimeout`. Sie geben eine Callback-Funktion an, die später ausgeführt werden soll, und einen Wert, der angibt, wie viel später sie ausgeführt werden soll, in Millisekunden:

```js
setTimeout(() => {
  // wird nach 2 Sekunden ausgeführt
}, 2000);
setTimeout(() => {
  // wird nach 50 Millisekunden ausgeführt
}, 50);
```

Diese Syntax definiert eine neue Funktion. Sie können jede beliebige andere Funktion darin aufrufen oder den Namen einer vorhandenen Funktion und eine Reihe von Parametern übergeben:

```js
const myFunction = (firstParam, secondParam) => {
  // irgendetwas tun
};
// wird nach 2 Sekunden ausgeführt
setTimeout(myFunction, 2000, firstParam, secondParam);
```

`setTimeout` gibt die Timer-ID zurück. Diese wird im Allgemeinen nicht verwendet, aber Sie können diese ID speichern und löschen, wenn Sie die Ausführung dieser geplanten Funktion löschen möchten:

```js
const id = setTimeout(() => {
  // sollte nach 2 Sekunden ausgeführt werden
}, 2000);
// Ich habe es mir anders überlegt
clearTimeout(id);
```

## Null-Verzögerung

Wenn Sie die Timeout-Verzögerung auf 0 setzen, wird die Callback-Funktion so schnell wie möglich ausgeführt, jedoch nach der aktuellen Funktionsausführung:

```js
setTimeout(() => {
  console.log('after ');
}, 0);
console.log(' before ');
```

Dieser Code gibt Folgendes aus:

```bash
before
after
```

Dies ist besonders nützlich, um zu vermeiden, dass die CPU bei rechenintensiven Aufgaben blockiert wird, und um andere Funktionen ausführen zu lassen, während eine aufwendige Berechnung durchgeführt wird, indem Funktionen im Scheduler in die Warteschlange gestellt werden.

::: tip
Einige Browser (IE und Edge) implementieren eine `setImmediate()`-Methode, die genau die gleiche Funktionalität bietet, die aber nicht standardmäßig ist und [in anderen Browsern nicht verfügbar ist](https://caniuse.com/#feat=setimmediate). Aber es ist eine Standardfunktion in Node.js.
:::

### `setInterval()`

`setInterval` ist eine Funktion, die `setTimeout` ähnelt, mit einem Unterschied: Anstatt die Callback-Funktion einmal auszuführen, wird sie immer wieder ausgeführt, in dem von Ihnen angegebenen Zeitintervall (in Millisekunden):

```js
setInterval(() => {
  // wird alle 2 Sekunden ausgeführt
}, 2000);
```

Die obige Funktion wird alle 2 Sekunden ausgeführt, es sei denn, Sie weisen sie an, mit `clearInterval` anzuhalten, indem Sie ihr die Intervall-ID übergeben, die `setInterval` zurückgegeben hat:

```js
const id = setInterval(() => {
  // wird alle 2 Sekunden ausgeführt
}, 2000);
// Ich habe es mir anders überlegt
clearInterval(id);
```

Es ist üblich, `clearInterval` innerhalb der `setInterval`-Callback-Funktion aufzurufen, damit diese automatisch feststellen kann, ob sie erneut ausgeführt oder gestoppt werden soll. Beispielsweise führt dieser Code etwas aus, es sei denn, App.somethingIWait hat den Wert arrived:


## Rekursives setTimeout

`setInterval` startet eine Funktion alle n Millisekunden, ohne Rücksicht darauf zu nehmen, wann eine Funktion ihre Ausführung beendet hat.

Wenn eine Funktion immer die gleiche Zeit benötigt, ist alles in Ordnung.

Vielleicht benötigt die Funktion je nach Netzwerkbedingungen unterschiedliche Ausführungszeiten.

Und vielleicht überschneidet sich eine lange Ausführung mit der nächsten.

Um dies zu vermeiden, können Sie ein rekursives setTimeout planen, das aufgerufen wird, wenn die Callback-Funktion abgeschlossen ist:

```js
const myFunction = () => {
  // do something
  setTimeout(myFunction, 1000);
};
setTimeout(myFunction, 1000);
```

`setTimeout` und `setInterval` sind in Node.js über das [Timers-Modul](/de/nodejs/api/timers) verfügbar.

Node.js bietet auch `setImmediate()`, was der Verwendung von `setTimeout(() => {}, 0)` entspricht und hauptsächlich für die Arbeit mit dem Node.js Event Loop verwendet wird.

