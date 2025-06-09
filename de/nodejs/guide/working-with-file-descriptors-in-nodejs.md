---
title: Dateien in Node.js öffnen
description: Erfahren Sie, wie Sie Dateien in Node.js mithilfe des fs-Moduls öffnen, einschließlich synchroner und asynchroner Methoden sowie promisbasierten Ansätzen.
head:
  - - meta
    - name: og:title
      content: Dateien in Node.js öffnen | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie Dateien in Node.js mithilfe des fs-Moduls öffnen, einschließlich synchroner und asynchroner Methoden sowie promisbasierten Ansätzen.
  - - meta
    - name: twitter:title
      content: Dateien in Node.js öffnen | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie Dateien in Node.js mithilfe des fs-Moduls öffnen, einschließlich synchroner und asynchroner Methoden sowie promisbasierten Ansätzen.
---


# Arbeiten mit Dateideskriptoren in Node.js

Bevor Sie mit einer Datei interagieren können, die sich in Ihrem Dateisystem befindet, müssen Sie einen Dateideskriptor erhalten. Ein Dateideskriptor ist eine Referenz auf eine offene Datei, eine Zahl (fd), die durch das Öffnen der Datei mit der Methode `open()` zurückgegeben wird, die vom Modul `fs` angeboten wird. Diese Zahl (fd) identifiziert eindeutig eine offene Datei im Betriebssystem.

## Dateien öffnen

### CommonJS (CJS)

```javascript
const fs = require('node:fs');
fs.open('/Users/joe/test.txt', 'r', (err, fd) => {
  // fd ist unser Dateideskriptor
});
```

Beachten Sie das `'r'`, das wir als zweiten Parameter für den Aufruf von `fs.open()` verwendet haben. Dieses Flag bedeutet, dass wir die Datei zum Lesen öffnen. Andere Flags, die Sie häufig verwenden werden, sind:

| Flag | Beschreibung                                                                       |
|------|------------------------------------------------------------------------------------|
| `'w+'`| Dieses Flag öffnet die Datei zum Lesen und Schreiben. Es positioniert den Stream am Anfang der Datei. |
| `'a+'`| Dieses Flag öffnet die Datei zum Lesen und Schreiben und positioniert den Stream auch am Ende der Datei. |

Sie können die Datei auch mit der Methode `fs.openSync` öffnen, die den Dateideskriptor zurückgibt, anstatt ihn in einem Callback bereitzustellen:

```javascript
const fs = require('node:fs');

try {
  const fd = fs.openSync('/Users/joe/test.txt', 'r');
} catch (err) {
  console.error(err);
}
```

## Operationen ausführen

Sobald Sie den Dateideskriptor auf die von Ihnen gewählte Weise erhalten haben, können Sie alle Operationen ausführen, die ihn erfordern, wie z. B. den Aufruf von `fs.close()` und viele andere Operationen, die mit dem Dateisystem interagieren.

## Verwenden von fsPromises

Sie können die Datei auch mit der Promise-basierten Methode `fsPromises.open` öffnen, die vom Modul `fs/promises` angeboten wird. Das Modul `fs/promises` ist erst ab Node.js v14 verfügbar. Vor v14, nach v10, können Sie stattdessen `require('fs').promises` verwenden. Vor v10, nach v8, können Sie `util.promisify` verwenden, um `fs`-Methoden in Promise-basierte Methoden zu konvertieren.

### ES-Module (MJS)

```javascript
import fs from 'node:fs/promises';

async function run() {
  const fileHandle = await fs.open('example.txt', 'r');
  try {
    filehandle = await fs.open('/Users/joe/test.txt', 'r');
    console.log(filehandle.fd);
    console.log(await filehandle.readFile({ encoding: 'utf8' }));
  } finally {
    await fileHandle.close();
  }
}

run().catch(console.error);
```


## Beispiel für util.promisify

Hier ist ein Beispiel für die Verwendung von `util.promisify`, um `fs.open` in eine Promise-basierte Funktion zu konvertieren:

```javascript
const fs = require('node:fs');
const util = require('node:util');

const open = util.promisify(fs.open);

open('test.txt', 'r')
  .then((fd) => {
    // Dateideskriptor verwenden
  })
  .catch((err) => {
    // Fehler behandeln
  });
```

Um weitere Details zum `fs/promises`-Modul zu sehen, überprüfen Sie bitte die [fs/promises API-Dokumentation](/de/nodejs/api/fs#promises).

