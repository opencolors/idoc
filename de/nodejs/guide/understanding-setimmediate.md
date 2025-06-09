---
title: Verstehen von setImmediate() in Node.js
description: Erfahren Sie, wie setImmediate() in Node.js funktioniert, seine Unterschiede zu setTimeout(), process.nextTick() und Promise.then() und wie es mit dem Ereignisschleife und Warteschlangen interagiert.
head:
  - - meta
    - name: og:title
      content: Verstehen von setImmediate() in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie setImmediate() in Node.js funktioniert, seine Unterschiede zu setTimeout(), process.nextTick() und Promise.then() und wie es mit dem Ereignisschleife und Warteschlangen interagiert.
  - - meta
    - name: twitter:title
      content: Verstehen von setImmediate() in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie setImmediate() in Node.js funktioniert, seine Unterschiede zu setTimeout(), process.nextTick() und Promise.then() und wie es mit dem Ereignisschleife und Warteschlangen interagiert.
---


# `setImmediate()` verstehen

Wenn Sie ein Stück Code asynchron, aber so schnell wie möglich ausführen möchten, ist eine Option die Verwendung der von Node.js bereitgestellten Funktion `setImmediate()`:

```js
setImmediate(() => {
    // etwas tun
})
```

Jede Funktion, die als Argument an `setImmediate()` übergeben wird, ist ein Callback, der in der nächsten Iteration der Event-Loop ausgeführt wird.

Wie unterscheidet sich `setImmediate()` von `setTimeout(() => {}, 0)` (Übergabe eines 0-ms-Timeouts) und von `process.nextTick()` und `Promise.then()`?

Eine an `process.nextTick()` übergebene Funktion wird in der aktuellen Iteration der Event-Loop ausgeführt, nachdem die aktuelle Operation beendet ist. Das bedeutet, dass sie immer vor `setTimeout` und `setImmediate` ausgeführt wird.

Ein `setTimeout()`-Callback mit einer Verzögerung von 0 ms ist `setImmediate()` sehr ähnlich. Die Ausführungsreihenfolge hängt von verschiedenen Faktoren ab, aber beide werden in der nächsten Iteration der Event-Loop ausgeführt.

Ein `process.nextTick`-Callback wird zur **process.nextTick-Warteschlange** hinzugefügt. Ein `Promise.then()`-Callback wird zur **Microtask-Warteschlange** für Promises hinzugefügt. Ein `setTimeout`- oder `setImmediate`-Callback wird zur **Macrotask-Warteschlange** hinzugefügt.

Die Event-Loop führt zuerst Aufgaben in der **process.nextTick-Warteschlange** aus, dann die **Microtask-Warteschlange** für Promises und dann die **Macrotask-Warteschlange** für `setTimeout` oder `setImmediate`.

Hier ist ein Beispiel, um die Reihenfolge zwischen `setImmediate()`, `process.nextTick()` und `Promise.then()` zu zeigen:

```js
const baz = () => console.log('baz');
const foo = () => console.log('foo');
const zoo = () => console.log('zoo');
const start = () => {
  console.log('start');
  setImmediate(baz);
  new Promise((resolve, reject) => {
    resolve('bar');
  }).then(resolve => {
    console.log(resolve);
    process.nextTick(zoo);
  });
  process.nextTick(foo);
};
start();
// start foo bar zoo baz
```

Dieser Code ruft zuerst `start()` auf, dann `foo()` in der **process.nextTick-Warteschlange**. Danach wird die **Microtask-Warteschlange** für Promises behandelt, die bar ausgibt und gleichzeitig `zoo()` in der **process.nextTick-Warteschlange** hinzufügt. Dann wird `zoo()` aufgerufen, das gerade hinzugefügt wurde. Am Ende wird `baz()` in der **Macrotask-Warteschlange** aufgerufen.

Das oben genannte Prinzip gilt in CommonJS-Fällen, aber denken Sie daran, dass in ES-Modulen, z. B. `mjs`-Dateien, die Ausführungsreihenfolge unterschiedlich ist:

```js
// start bar foo zoo baz
```

Dies liegt daran, dass das geladene ES-Modul als asynchrone Operation verpackt ist und somit das gesamte Skript bereits in der **Microtask-Warteschlange** für Promises ist. Wenn das Promise also sofort aufgelöst wird, wird sein Callback an die **Microtask-Warteschlange** angehängt. Node.js wird versuchen, die Warteschlange zu leeren, bevor zu einer anderen Warteschlange übergegangen wird, und daher wird die Ausgabe zuerst bar angezeigt.

