---
title: Arbeiten mit Verzeichnissen in Node.js
description: Erfahren Sie, wie Sie in Node.js mit Verzeichnissen arbeiten können, indem Sie das fs-Modul verwenden, einschließlich der Überprüfung, ob ein Verzeichnis existiert, der Erstellung eines neuen Verzeichnisses, der Lektüre des Inhalts eines Verzeichnisses, der Umbenennung eines Verzeichnisses und der Löschung eines Verzeichnisses.
head:
  - - meta
    - name: og:title
      content: Arbeiten mit Verzeichnissen in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie in Node.js mit Verzeichnissen arbeiten können, indem Sie das fs-Modul verwenden, einschließlich der Überprüfung, ob ein Verzeichnis existiert, der Erstellung eines neuen Verzeichnisses, der Lektüre des Inhalts eines Verzeichnisses, der Umbenennung eines Verzeichnisses und der Löschung eines Verzeichnisses.
  - - meta
    - name: twitter:title
      content: Arbeiten mit Verzeichnissen in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie in Node.js mit Verzeichnissen arbeiten können, indem Sie das fs-Modul verwenden, einschließlich der Überprüfung, ob ein Verzeichnis existiert, der Erstellung eines neuen Verzeichnisses, der Lektüre des Inhalts eines Verzeichnisses, der Umbenennung eines Verzeichnisses und der Löschung eines Verzeichnisses.
---


# Arbeiten mit Ordnern in Node.js

Das Node.js `fs` Kernmodul bietet viele praktische Methoden, mit denen Sie mit Ordnern arbeiten können.

## Prüfen, ob ein Ordner existiert

Verwenden Sie `fs.access()` (und sein Promise-basiertes Gegenstück `fsPromises.access()`), um zu prüfen, ob der Ordner existiert und Node.js mit seinen Berechtigungen darauf zugreifen kann.
```javascript
const fs = require('node:fs');

try {
  await fs.promises.access('/Users/joe');
} catch (err) {
  throw err;
}
```

## Einen neuen Ordner erstellen

Verwenden Sie `fs.mkdir()` oder `fs.mkdirSync()` oder `fsPromises.mkdir()`, um einen neuen Ordner zu erstellen.
```javascript
const fs = require('node:fs');
const folderName = '/Users/joe/test';

try {
  fs.mkdirSync(folderName);
} catch (err) {
  console.error(err);
}
```

## Den Inhalt eines Verzeichnisses lesen

Verwenden Sie `fs.readdir()` oder `fs.readdirSync()` oder `fsPromises.readdir()`, um den Inhalt eines Verzeichnisses zu lesen.

Dieses Codefragment liest den Inhalt eines Ordners, sowohl Dateien als auch Unterordner, und gibt deren relativen Pfad zurück:
```javascript
const fs = require('node:fs');
const folderPath = '/Users/joe';
fs.readdirSync(folderPath).map(fileName => {
  return path.join(folderPath, fileName);
});
```

Sie können den vollständigen Pfad erhalten:
```javascript
fs.readdirSync(folderPath)
  .map(fileName => path.join(folderPath, fileName));
```

Sie können die Ergebnisse auch filtern, um nur die Dateien zurückzugeben und die Ordner auszuschließen:
```javascript
const fs = require('node:fs');
const isFile = fileName => !fileName.includes(path.sep);

fs.readdirSync(folderPath)
  .map(fileName => path.join(folderPath, fileName))
  .filter(isFile);
```

## Einen Ordner umbenennen

Verwenden Sie `fs.rename()` oder `fs.renameSync()` oder `fsPromises.rename()`, um einen Ordner umzubenennen. Der erste Parameter ist der aktuelle Pfad, der zweite der neue Pfad:
```javascript
const fs = require('node:fs');
fs.rename('/Users/joe', '/Users/roger', err => {
  if (err) {
    console.error(err);
  }
});
```

`fs.renameSync()` ist die synchrone Version:
```javascript
const fs = require('node:fs');
try {
  fs.renameSync('/Users/joe', '/Users/roger');
} catch (err) {
  console.error(err);
}
```

`fsPromises.rename()` ist die Promise-basierte Version:
```javascript
const fs = require('node:fs/promises');
async function example() {
  try {
    await fs.rename('/Users/joe', '/Users/roger');
  } catch (err) {
    console.log(err);
  }
}
example();
```


## Einen Ordner entfernen

Verwenden Sie `fs.rmdir()` oder `fs.rmdirSync()` oder `fsPromises.rmdir()`, um einen Ordner zu entfernen.
```javascript
const fs = require('node:fs');
fs.rmdir(dir, err => {
  if (err) {
    throw err;
  }
  console.log(`${dir} wurde gelöscht!`);
});
```

Um einen Ordner zu entfernen, der Inhalte enthält, verwenden Sie `fs.rm()` mit der Option `{ recursive: true }`, um die Inhalte rekursiv zu entfernen.

`{ recursive: true, force: true }` sorgt dafür, dass Ausnahmen ignoriert werden, wenn der Ordner nicht existiert.
```javascript
const fs = require('node:fs');
fs.rm(dir, { recursive: true, force: true }, err => {
  if (err) {
    throw err;
  }
  console.log(`${dir} wurde gelöscht!`);
});
```
