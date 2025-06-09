---
title: Lavorare con le cartelle in Node.js
description: Scopri come lavorare con le cartelle in Node.js utilizzando il modulo fs, compreso il controllo dell'esistenza di una cartella, la creazione di una nuova cartella, la lettura del contenuto di un directory, il rinominare di una cartella e l'eliminazione di una cartella.
head:
  - - meta
    - name: og:title
      content: Lavorare con le cartelle in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come lavorare con le cartelle in Node.js utilizzando il modulo fs, compreso il controllo dell'esistenza di una cartella, la creazione di una nuova cartella, la lettura del contenuto di un directory, il rinominare di una cartella e l'eliminazione di una cartella.
  - - meta
    - name: twitter:title
      content: Lavorare con le cartelle in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come lavorare con le cartelle in Node.js utilizzando il modulo fs, compreso il controllo dell'esistenza di una cartella, la creazione di una nuova cartella, la lettura del contenuto di un directory, il rinominare di una cartella e l'eliminazione di una cartella.
---


# Lavorare con le cartelle in Node.js

Il modulo core `fs` di Node.js fornisce molti metodi utili che puoi usare per lavorare con le cartelle.

## Controllare se una cartella esiste

Usa `fs.access()` (e la sua controparte basata su promise `fsPromises.access()`) per controllare se la cartella esiste e se Node.js può accedervi con le sue autorizzazioni.
```javascript
const fs = require('node:fs');

try {
  await fs.promises.access('/Users/joe');
} catch (err) {
  throw err;
}
```

## Creare una nuova cartella

Usa `fs.mkdir()` o `fs.mkdirSync()` o `fsPromises.mkdir()` per creare una nuova cartella.
```javascript
const fs = require('node:fs');
const folderName = '/Users/joe/test';

try {
  fs.mkdirSync(folderName);
} catch (err) {
  console.error(err);
}
```

## Leggere il contenuto di una directory

Usa `fs.readdir()` o `fs.readdirSync()` o `fsPromises.readdir()` per leggere il contenuto di una directory.

Questo frammento di codice legge il contenuto di una cartella, sia file che sottocartelle, e restituisce il loro percorso relativo:
```javascript
const fs = require('node:fs');
const folderPath = '/Users/joe';
fs.readdirSync(folderPath).map(fileName => {
  return path.join(folderPath, fileName);
});
```

Puoi ottenere il percorso completo:
```javascript
fs.readdirSync(folderPath)
  .map(fileName => path.join(folderPath, fileName));
```

Puoi anche filtrare i risultati per restituire solo i file, escludendo le cartelle:
```javascript
const fs = require('node:fs');
const isFile = fileName => !fileName.includes(path.sep);

fs.readdirSync(folderPath)
  .map(fileName => path.join(folderPath, fileName))
  .filter(isFile);
```

## Rinominare una cartella

Usa `fs.rename()` o `fs.renameSync()` o `fsPromises.rename()` per rinominare una cartella. Il primo parametro è il percorso corrente, il secondo il nuovo percorso:
```javascript
const fs = require('node:fs');
fs.rename('/Users/joe', '/Users/roger', err => {
  if (err) {
    console.error(err);
  }
});
```

`fs.renameSync()` è la versione sincrona:
```javascript
const fs = require('node:fs');
try {
  fs.renameSync('/Users/joe', '/Users/roger');
} catch (err) {
  console.error(err);
}
```

`fsPromises.rename()` è la versione basata su promise:
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


## Rimuovere una cartella

Utilizza `fs.rmdir()` o `fs.rmdirSync()` o `fsPromises.rmdir()` per rimuovere una cartella.
```javascript
const fs = require('node:fs');
fs.rmdir(dir, err => {
  if (err) {
    throw err;
  }
  console.log(`${dir} è stato eliminato!`);
});
```

Per rimuovere una cartella che contiene elementi, utilizza `fs.rm()` con l'opzione `{ recursive: true }` per rimuovere ricorsivamente il contenuto.

`{ recursive: true, force: true }` fa sì che le eccezioni vengano ignorate se la cartella non esiste.
```javascript
const fs = require('node:fs');
fs.rm(dir, { recursive: true, force: true }, err => {
  if (err) {
    throw err;
  }
  console.log(`${dir} è stato eliminato!`);
});
```

