---
title: Verstehen von process.nextTick() in Node.js
description: Erfahren Sie, wie process.nextTick() in Node.js funktioniert und wie es sich von setImmediate() und setTimeout() unterscheidet. Verstehen Sie den Ereignisschleifen und wie Sie nextTick() verwenden können, um Code asynchron auszuführen.
head:
  - - meta
    - name: og:title
      content: Verstehen von process.nextTick() in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie process.nextTick() in Node.js funktioniert und wie es sich von setImmediate() und setTimeout() unterscheidet. Verstehen Sie den Ereignisschleifen und wie Sie nextTick() verwenden können, um Code asynchron auszuführen.
  - - meta
    - name: twitter:title
      content: Verstehen von process.nextTick() in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie process.nextTick() in Node.js funktioniert und wie es sich von setImmediate() und setTimeout() unterscheidet. Verstehen Sie den Ereignisschleifen und wie Sie nextTick() verwenden können, um Code asynchron auszuführen.
---


# `process.nextTick()` verstehen

Beim Verständnis der Node.js Event Loop ist `process.nextTick()` ein wichtiger Bestandteil. Jedes Mal, wenn die Event Loop eine vollständige Runde macht, nennen wir das einen Tick.

Wenn wir eine Funktion an process.nextTick() übergeben, weisen wir die Engine an, diese Funktion am Ende der aktuellen Operation aufzurufen, bevor der nächste Event Loop Tick beginnt:

```js
process.nextTick(() => {
  // etwas tun
})
```

Die Event Loop ist damit beschäftigt, den aktuellen Funktionscode zu verarbeiten. Wenn diese Operation endet, führt die JS-Engine alle Funktionen aus, die während dieser Operation an `nextTick`-Aufrufe übergeben wurden.

Es ist die Art, wie wir der JS-Engine mitteilen können, eine Funktion asynchron (nach der aktuellen Funktion) zu verarbeiten, aber so schnell wie möglich und nicht in die Warteschlange zu stellen.

Der Aufruf von `setTimeout(() => {}, 0)` führt die Funktion am Ende des nächsten Ticks aus, viel später als bei der Verwendung von `nextTick()`, was den Aufruf priorisiert und ihn kurz vor Beginn des nächsten Ticks ausführt.

Verwenden Sie `nextTick()`, wenn Sie sicherstellen möchten, dass der Code in der nächsten Event Loop-Iteration bereits ausgeführt wird.

## Ein Beispiel für die Reihenfolge der Ereignisse:

```js
console.log('Hallo => Nummer 1')
setImmediate(() => {
  console.log('Läuft vor dem Timeout => Nummer 3')
})
setTimeout(() => {
  console.log('Der Timeout läuft zuletzt => Nummer 4')
}, 0)
process.nextTick(() => {
  console.log('Läuft beim nächsten Tick => Nummer 2')
})
```

## Beispielausgabe:

```bash
Hallo => Nummer 1
Läuft beim nächsten Tick => Nummer 2
Läuft vor dem Timeout => Nummer 3
Der Timeout läuft zuletzt => Nummer 4
```

Die genaue Ausgabe kann von Lauf zu Lauf unterschiedlich sein.

