---
title: Blockieren und Nicht-Blockieren in Node.js
description: Dieser Artikel erläutert den Unterschied zwischen blockierenden und nicht blockierenden Aufrufen in Node.js, einschließlich ihrer Auswirkungen auf den Ereignisloop und die Konkurrenz.
head:
  - - meta
    - name: og:title
      content: Blockieren und Nicht-Blockieren in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Dieser Artikel erläutert den Unterschied zwischen blockierenden und nicht blockierenden Aufrufen in Node.js, einschließlich ihrer Auswirkungen auf den Ereignisloop und die Konkurrenz.
  - - meta
    - name: twitter:title
      content: Blockieren und Nicht-Blockieren in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Dieser Artikel erläutert den Unterschied zwischen blockierenden und nicht blockierenden Aufrufen in Node.js, einschließlich ihrer Auswirkungen auf den Ereignisloop und die Konkurrenz.
---


# Überblick über blockierende vs. nicht blockierende Aufrufe

Dieser Überblick behandelt den Unterschied zwischen blockierenden und nicht blockierenden Aufrufen in Node.js. Dieser Überblick bezieht sich auf die Event-Loop und libuv, aber Vorkenntnisse dieser Themen sind nicht erforderlich. Es wird davon ausgegangen, dass die Leser ein grundlegendes Verständnis der JavaScript-Sprache und des Node.js [Callback-Musters](/de/nodejs/guide/javascript-asynchronous-programming-and-callbacks) haben.

::: info
"I/O" bezieht sich hauptsächlich auf die Interaktion mit der Festplatte und dem Netzwerk des Systems, die von [libuv](https://libuv.org/) unterstützt wird.
:::

## Blockierend

**Blockierend** bedeutet, dass die Ausführung von zusätzlichem JavaScript im Node.js-Prozess warten muss, bis eine Nicht-JavaScript-Operation abgeschlossen ist. Dies geschieht, weil die Event-Loop JavaScript nicht weiter ausführen kann, während eine **blockierende** Operation stattfindet.

In Node.js wird JavaScript, das aufgrund seiner CPU-Intensität eine schlechte Leistung aufweist, anstatt auf eine Nicht-JavaScript-Operation wie I/O zu warten, typischerweise nicht als **blockierend** bezeichnet. Synchrone Methoden in der Node.js-Standardbibliothek, die libuv verwenden, sind die am häufigsten verwendeten **blockierenden** Operationen. Native Module können auch **blockierende** Methoden haben.

Alle I/O-Methoden in der Node.js-Standardbibliothek bieten asynchrone Versionen, die **nicht blockierend** sind und Callback-Funktionen akzeptieren. Einige Methoden haben auch **blockierende** Gegenstücke, deren Namen mit `Sync` enden.

## Code-Vergleich

**Blockierende** Methoden werden **synchron** und **nicht blockierende** Methoden werden **asynchron** ausgeführt.

Am Beispiel des File System-Moduls ist dies ein **synchroner** Dateilesevorgang:

```js
const fs = require('node:fs')
const data = fs.readFileSync('/file.md') // blockiert hier, bis die Datei gelesen ist
```

Und hier ist ein entsprechendes **asynchrones** Beispiel:

```js
const fs = require('node:fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
})
```

Das erste Beispiel erscheint einfacher als das zweite, hat aber den Nachteil, dass die zweite Zeile die Ausführung von zusätzlichem JavaScript **blockiert**, bis die gesamte Datei gelesen ist. Beachten Sie, dass in der synchronen Version ein Fehler abgefangen werden muss, da der Prozess sonst abstürzt. In der asynchronen Version liegt es im Ermessen des Autors, ob ein Fehler wie gezeigt ausgelöst werden soll.

Erweitern wir unser Beispiel ein wenig:

```js
const fs = require('node:fs')
const data = fs.readFileSync('/file.md') // blockiert hier, bis die Datei gelesen ist
console.log(data)
moreWork() // wird nach console.log ausgeführt
```

Und hier ist ein ähnliches, aber nicht gleichwertiges asynchrones Beispiel:

```js
const fs = require('node:fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
  console.log(data)
})
moreWork() // wird vor console.log ausgeführt
```

Im ersten Beispiel oben wird `console.log` vor `moreWork()` aufgerufen. Im zweiten Beispiel ist `fs.readFile()` **nicht blockierend**, sodass die JavaScript-Ausführung fortgesetzt werden kann und `moreWork()` zuerst aufgerufen wird. Die Möglichkeit, `moreWork()` auszuführen, ohne auf den Abschluss des Dateilesevorgangs zu warten, ist eine wichtige Designentscheidung, die einen höheren Durchsatz ermöglicht.


## Nebenläufigkeit und Durchsatz

Die JavaScript-Ausführung in Node.js ist Single-Threaded, daher bezieht sich Nebenläufigkeit auf die Fähigkeit der Event-Loop, JavaScript-Callback-Funktionen auszuführen, nachdem andere Arbeiten abgeschlossen wurden. Jeder Code, der voraussichtlich nebenläufig ausgeführt wird, muss es der Event-Loop ermöglichen, weiterzulaufen, während nicht-JavaScript-Operationen wie I/O stattfinden.

Betrachten wir beispielsweise einen Fall, in dem jede Anfrage an einen Webserver 50 ms dauert und 45 ms dieser 50 ms Datenbank-I/O sind, die asynchron ausgeführt werden können. Die Wahl nicht-blockierender asynchroner Operationen gibt diese 45 ms pro Anfrage frei, um andere Anfragen zu bearbeiten. Dies ist ein signifikanter Unterschied in der Kapazität, nur durch die Wahl nicht-blockierender Methoden anstelle von blockierenden Methoden.

Die Event-Loop unterscheidet sich von Modellen in vielen anderen Sprachen, in denen möglicherweise zusätzliche Threads erstellt werden, um nebenläufige Arbeit zu verarbeiten.

## Gefahren des Mischens von blockierendem und nicht-blockierendem Code

Es gibt einige Muster, die bei der Arbeit mit I/O vermieden werden sollten. Betrachten wir ein Beispiel:

```js
const fs = require('node:fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
  console.log(data)
})
fs.unlinkSync('/file.md')
```

Im obigen Beispiel wird `fs.unlinkSync()` wahrscheinlich vor `fs.readFile()` ausgeführt, wodurch `file.md` gelöscht würde, bevor es tatsächlich gelesen wird. Eine bessere Möglichkeit, dies zu schreiben, die vollständig nicht-blockierend ist und garantiert in der richtigen Reihenfolge ausgeführt wird, ist:

```js
const fs = require('node:fs')
fs.readFile('/file.md', (readFileErr, data) => {
  if (readFileErr) throw readFileErr
  console.log(data)
  fs.unlink('/file.md', unlinkErr => {
    if (unlinkErr) throw unlinkErr
  })
})
```

Das Obige platziert einen **nicht-blockierenden** Aufruf von `fs.unlink()` innerhalb des Callbacks von `fs.readFile()`, was die korrekte Reihenfolge der Operationen garantiert.

