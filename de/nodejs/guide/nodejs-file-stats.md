---
title: Node.js-Dateistatistiken
description: Erfahren Sie, wie Sie Node.js verwenden können, um Dateidetails mithilfe der stat()-Methode des fs-Moduls zu überprüfen, einschließlich Dateityp, Größe usw.
head:
  - - meta
    - name: og:title
      content: Node.js-Dateistatistiken | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie Node.js verwenden können, um Dateidetails mithilfe der stat()-Methode des fs-Moduls zu überprüfen, einschließlich Dateityp, Größe usw.
  - - meta
    - name: twitter:title
      content: Node.js-Dateistatistiken | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie Node.js verwenden können, um Dateidetails mithilfe der stat()-Methode des fs-Moduls zu überprüfen, einschließlich Dateityp, Größe usw.
---


# Node.js-Datei-Statistiken

Jede Datei verfügt über eine Reihe von Details, die wir mit Node.js untersuchen können. Insbesondere mit der `stat()`-Methode, die vom [fs-Modul](/de/nodejs/api/fs) bereitgestellt wird.

Sie rufen sie auf, indem Sie einen Dateipfad übergeben, und sobald Node.js die Dateidetails abruft, ruft es die Callback-Funktion auf, die Sie übergeben, mit 2 Parametern: einer Fehlermeldung und den Datei-Statistiken:

```js
import fs from 'node:fs'
fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err)
  }
  // wir haben Zugriff auf die Datei-Statistiken in `stats`
})
```

Node.js bietet auch eine synchrone Methode, die den Thread blockiert, bis die Datei-Statistiken bereit sind:

```js
import fs from 'node:fs'
try {
  const stats = fs.statSync('/Users/joe/test.txt')
} catch (err) {
  console.error(err)
}
```

Die Dateiinformationen sind in der Variable `stats` enthalten. Welche Art von Informationen können wir mit den Statistiken extrahieren?

**Eine Menge, einschließlich:**

- ob die Datei ein Verzeichnis oder eine Datei ist, mit `stats.isFile()` und `stats.isDirectory()`
- ob die Datei ein symbolischer Link ist, mit `stats.isSymbolicLink()`
- die Dateigröße in Bytes mit `stats.size`.

Es gibt noch andere erweiterte Methoden, aber der Großteil dessen, was Sie in Ihrer täglichen Programmierung verwenden werden, ist dies.

```js
import fs from 'node:fs'
fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err)
    return
  }
  stats.isFile() // true
  stats.isDirectory() // false
  stats.isSymbolicLink() // false
  stats.size // 1024000 //= 1MB
})
```

Sie können auch die Promise-basierte `fsPromises.stat()`-Methode verwenden, die vom `fs/promises`-Modul angeboten wird, wenn Sie möchten:

```js
import fs from 'node:fs/promises'
try {
  const stats = await fs.stat('/Users/joe/test.txt')
  stats.isFile() // true
  stats.isDirectory() // false
  stats.isSymbolicLink() // false
  stats.size // 1024000 //= 1MB
} catch (err) {
  console.log(err)
}
```

Weitere Informationen über das fs-Modul finden Sie in der Dokumentation zum [Dateisystemmodul](/de/nodejs/api/fs).

