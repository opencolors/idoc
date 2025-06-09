---
title: Dateien mit Node.js lesen
description: Erfahren Sie, wie Sie Dateien in Node.js mit den Methoden fs.readFile(), fs.readFileSync() und fsPromises.readFile() lesen.
head:
  - - meta
    - name: og:title
      content: Dateien mit Node.js lesen | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie Dateien in Node.js mit den Methoden fs.readFile(), fs.readFileSync() und fsPromises.readFile() lesen.
  - - meta
    - name: twitter:title
      content: Dateien mit Node.js lesen | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie Dateien in Node.js mit den Methoden fs.readFile(), fs.readFileSync() und fsPromises.readFile() lesen.
---


# Dateien mit Node.js lesen

Der einfachste Weg, eine Datei in Node.js zu lesen, ist die Verwendung der Methode `fs.readFile()`, wobei Sie ihr den Dateipfad, die Kodierung und eine Callback-Funktion übergeben, die mit den Dateidaten (und dem Fehler) aufgerufen wird:

```javascript
const fs = require('node:fs')

fs.readFile('/Users/joe/test.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(data)
})
```

Alternativ können Sie die synchrone Version `fs.readFileSync()` verwenden:

```javascript
const fs = require('node:fs')

try {
  const data = fs.readFileSync('/Users/joe/test.txt', 'utf8')
  console.log(data)
} catch (err) {
  console.error(err)
}
```

Sie können auch die Promise-basierte Methode `fsPromises.readFile()` verwenden, die vom Modul `fs/promises` angeboten wird:

```javascript
const fs = require('node:fs/promises')

async function example() {
  try {
    const data = await fs.readFile('/Users/joe/test.txt', { encoding: 'utf8' })
    console.log(data)
  } catch (err) {
    console.log(err)
  }
}

example()
```

Alle drei Methoden, `fs.readFile()`, `fs.readFileSync()` und `fsPromises.readFile()`, lesen den gesamten Inhalt der Datei in den Speicher, bevor sie die Daten zurückgeben.

Dies bedeutet, dass große Dateien einen großen Einfluss auf Ihren Speicherverbrauch und die Ausführungsgeschwindigkeit des Programms haben werden.

In diesem Fall ist es besser, den Dateiinhalt mit Streams zu lesen.

