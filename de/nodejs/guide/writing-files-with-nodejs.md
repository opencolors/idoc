---
title: Inhalt zu einer Datei in Node.js hinzufügen
description: Erfahren Sie, wie Sie Inhalt zu einer Datei in Node.js mithilfe der Methoden fs.appendFile() und fs.appendFileSync() hinzufügen können, mit Beispielen und Codeausschnitten.
head:
  - - meta
    - name: og:title
      content: Inhalt zu einer Datei in Node.js hinzufügen | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie Inhalt zu einer Datei in Node.js mithilfe der Methoden fs.appendFile() und fs.appendFileSync() hinzufügen können, mit Beispielen und Codeausschnitten.
  - - meta
    - name: twitter:title
      content: Inhalt zu einer Datei in Node.js hinzufügen | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie Inhalt zu einer Datei in Node.js mithilfe der Methoden fs.appendFile() und fs.appendFileSync() hinzufügen können, mit Beispielen und Codeausschnitten.
---


# Dateien mit Node.js schreiben

## Eine Datei schreiben

Der einfachste Weg, Dateien in Node.js zu schreiben, ist die Verwendung der `fs.writeFile()`-API.

```javascript
const fs = require('node:fs')
const content = 'Einige Inhalte!'

fs.writeFile('/Users/joe/test.txt', content, err => {
  if (err) {
    console.error(err)
  } else {
    // Datei wurde erfolgreich geschrieben
  }
})
```

### Eine Datei synchron schreiben

Alternativ können Sie die synchrone Version `fs.writeFileSync` verwenden:

```javascript
const fs = require('node:fs')
const content = 'Einige Inhalte!'

try {
  fs.writeFileSync('/Users/joe/test.txt', content)
} catch (err) {
  console.error(err)
}
```

Sie können auch die Promise-basierte `fsPromises.writeFile()`-Methode verwenden, die vom `fs/promises`-Modul angeboten wird:

```javascript
const fs = require('node:fs/promises')
async function example() {
  try {
    const content = 'Einige Inhalte!'
    await fs.writeFile('/Users/joe/test.txt', content)
  } catch (err) {
    console.log(err)
  }
}

example()
```

Standardmäßig ersetzt diese API den Inhalt der Datei, falls diese bereits existiert.

Sie können die Standardeinstellung ändern, indem Sie ein Flag angeben:

```javascript
fs.writeFile('/Users/joe/test.txt', content, { flag: 'a+' }, err => [])
```

Die Flags, die Sie wahrscheinlich verwenden werden, sind:
| Flag | Beschreibung | Datei wird erstellt, falls sie nicht existiert |
| --- | --- | --- |
| `r+` | Dieses Flag öffnet die Datei zum Lesen und Schreiben | :x: |
| `w+` | Dieses Flag öffnet die Datei zum Lesen und Schreiben und positioniert den Stream auch am Anfang der Datei | :white_check_mark: |
| `a` | Dieses Flag öffnet die Datei zum Schreiben und positioniert den Stream auch am Ende der Datei | :white_check_mark: |
| `a+` | Dieser Stream öffnet die Datei zum Lesen und Schreiben und positioniert den Stream auch am Ende der Datei | :white_check_mark: |

Weitere Informationen zu den Flags finden Sie in der fs-Dokumentation.

## Inhalt an eine Datei anhängen

Das Anhängen an Dateien ist nützlich, wenn Sie eine Datei nicht mit neuen Inhalten überschreiben, sondern diese erweitern möchten.


### Beispiele

Eine praktische Methode, um Inhalte an das Ende einer Datei anzuhängen, ist `fs.appendFile()` (und sein Gegenstück `fs.appendFileSync()`):

```javascript
const fs = require('node:fs')
const content = 'Some content!'

fs.appendFile('file_log', content, err => {
  if (err) {
    console.error(err)
  } else {
    // done!
  }
})
```

### Beispiel mit Promises

Hier ist ein `fsPromises.appendFile()` Beispiel:

```javascript
const fs = require('node:fs/promises')
async function example() {
  try {
    const content = 'Some content!'
    await fs.appendFile('/Users/joe/test.txt', content)
  } catch (err) {
    console.log(err)
  }
}

example()
```

