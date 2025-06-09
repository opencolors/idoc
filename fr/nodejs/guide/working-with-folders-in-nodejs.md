---
title: Travailler avec des dossiers dans Node.js
description: Apprenez à travailler avec des dossiers dans Node.js en utilisant le module fs, notamment pour vérifier si un dossier existe, créer un nouveau dossier, lire le contenu d'un répertoire, renommer un dossier et supprimer un dossier.
head:
  - - meta
    - name: og:title
      content: Travailler avec des dossiers dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Apprenez à travailler avec des dossiers dans Node.js en utilisant le module fs, notamment pour vérifier si un dossier existe, créer un nouveau dossier, lire le contenu d'un répertoire, renommer un dossier et supprimer un dossier.
  - - meta
    - name: twitter:title
      content: Travailler avec des dossiers dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Apprenez à travailler avec des dossiers dans Node.js en utilisant le module fs, notamment pour vérifier si un dossier existe, créer un nouveau dossier, lire le contenu d'un répertoire, renommer un dossier et supprimer un dossier.
---


# Travailler avec des dossiers dans Node.js

Le module cœur `fs` de Node.js fournit de nombreuses méthodes pratiques que vous pouvez utiliser pour travailler avec des dossiers.

## Vérifier si un dossier existe

Utilisez `fs.access()` (et sa contrepartie basée sur les promesses `fsPromises.access()`) pour vérifier si le dossier existe et si Node.js peut y accéder avec ses autorisations.
```javascript
const fs = require('node:fs');

try {
  await fs.promises.access('/Users/joe');
} catch (err) {
  throw err;
}
```

## Créer un nouveau dossier

Utilisez `fs.mkdir()` ou `fs.mkdirSync()` ou `fsPromises.mkdir()` pour créer un nouveau dossier.
```javascript
const fs = require('node:fs');
const folderName = '/Users/joe/test';

try {
  fs.mkdirSync(folderName);
} catch (err) {
  console.error(err);
}
```

## Lire le contenu d'un répertoire

Utilisez `fs.readdir()` ou `fs.readdirSync()` ou `fsPromises.readdir()` pour lire le contenu d'un répertoire.

Ce code lit le contenu d'un dossier, à la fois les fichiers et les sous-dossiers, et renvoie leur chemin relatif :
```javascript
const fs = require('node:fs');
const folderPath = '/Users/joe';
fs.readdirSync(folderPath).map(fileName => {
  return path.join(folderPath, fileName);
});
```

Vous pouvez obtenir le chemin complet :
```javascript
fs.readdirSync(folderPath)
  .map(fileName => path.join(folderPath, fileName));
```

Vous pouvez également filtrer les résultats pour ne renvoyer que les fichiers, à l'exclusion des dossiers :
```javascript
const fs = require('node:fs');
const isFile = fileName => !fileName.includes(path.sep);

fs.readdirSync(folderPath)
  .map(fileName => path.join(folderPath, fileName))
  .filter(isFile);
```

## Renommer un dossier

Utilisez `fs.rename()` ou `fs.renameSync()` ou `fsPromises.rename()` pour renommer un dossier. Le premier paramètre est le chemin d'accès actuel, le second le nouveau chemin d'accès :
```javascript
const fs = require('node:fs');
fs.rename('/Users/joe', '/Users/roger', err => {
  if (err) {
    console.error(err);
  }
});
```

`fs.renameSync()` est la version synchrone :
```javascript
const fs = require('node:fs');
try {
  fs.renameSync('/Users/joe', '/Users/roger');
} catch (err) {
  console.error(err);
}
```

`fsPromises.rename()` est la version basée sur les promesses :
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


## Supprimer un dossier

Utilisez `fs.rmdir()` ou `fs.rmdirSync()` ou `fsPromises.rmdir()` pour supprimer un dossier.
```javascript
const fs = require('node:fs');
fs.rmdir(dir, err => {
  if (err) {
    throw err;
  }
  console.log(`${dir} est supprimé !`);
});
```

Pour supprimer un dossier qui contient des éléments, utilisez `fs.rm()` avec l'option `{ recursive: true }` pour supprimer récursivement le contenu.

`{ recursive: true, force: true }` permet d'ignorer les exceptions si le dossier n'existe pas.
```javascript
const fs = require('node:fs');
fs.rm(dir, { recursive: true, force: true }, err => {
  if (err) {
    throw err;
  }
  console.log(`${dir} est supprimé !`);
});
```

