---
title: Ouvrir des fichiers dans Node.js
description: Découvrez comment ouvrir des fichiers dans Node.js en utilisant le module fs, y compris les méthodes synchrones et asynchrones, ainsi que les approches basées sur les promesses.
head:
  - - meta
    - name: og:title
      content: Ouvrir des fichiers dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez comment ouvrir des fichiers dans Node.js en utilisant le module fs, y compris les méthodes synchrones et asynchrones, ainsi que les approches basées sur les promesses.
  - - meta
    - name: twitter:title
      content: Ouvrir des fichiers dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez comment ouvrir des fichiers dans Node.js en utilisant le module fs, y compris les méthodes synchrones et asynchrones, ainsi que les approches basées sur les promesses.
---


# Travailler avec les descripteurs de fichiers dans Node.js

Avant de pouvoir interagir avec un fichier présent dans votre système de fichiers, vous devez obtenir un descripteur de fichier. Un descripteur de fichier est une référence à un fichier ouvert, un nombre (fd) renvoyé par l'ouverture du fichier à l'aide de la méthode `open()` proposée par le module `fs`. Ce nombre (fd) identifie de manière unique un fichier ouvert dans le système d'exploitation.

## Ouvrir des fichiers

### CommonJS (CJS)

```javascript
const fs = require('node:fs');
fs.open('/Users/joe/test.txt', 'r', (err, fd) => {
  // fd est notre descripteur de fichier
});
```

Remarquez le `'r'` que nous avons utilisé comme deuxième paramètre de l'appel `fs.open()`. Cet indicateur signifie que nous ouvrons le fichier en lecture. Les autres indicateurs que vous utiliserez couramment sont :

| Indicateur | Description                                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| `'w+'`     | Cet indicateur ouvre le fichier en lecture et en écriture. Il positionne le flux au début du fichier.     |
| `'a+'`     | Cet indicateur ouvre le fichier en lecture et en écriture et positionne également le flux à la fin du fichier. |

Vous pouvez également ouvrir le fichier en utilisant la méthode `fs.openSync`, qui renvoie le descripteur de fichier au lieu de le fournir dans un rappel :

```javascript
const fs = require('node:fs');

try {
  const fd = fs.openSync('/Users/joe/test.txt', 'r');
} catch (err) {
  console.error(err);
}
```

## Effectuer des opérations

Une fois que vous avez obtenu le descripteur de fichier de la manière que vous avez choisie, vous pouvez effectuer toutes les opérations qui le nécessitent, comme appeler `fs.close()` et de nombreuses autres opérations qui interagissent avec le système de fichiers.

## Utilisation de fsPromises

Vous pouvez également ouvrir le fichier en utilisant la méthode `fsPromises.open` basée sur les promesses proposée par le module `fs/promises`. Le module `fs/promises` est disponible uniquement à partir de Node.js v14. Avant la v14, après la v10, vous pouvez utiliser `require('fs').promises` à la place. Avant la v10, après la v8, vous pouvez utiliser `util.promisify` pour convertir les méthodes `fs` en méthodes basées sur des promesses.

### ES Modules (MJS)

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

## Exemple d'utilisation de util.promisify

Voici un exemple d'utilisation de `util.promisify` pour convertir `fs.open` en une fonction basée sur une promesse :

```javascript
const fs = require('node:fs');
const util = require('node:util');

const open = util.promisify(fs.open);

open('test.txt', 'r')
  .then((fd) => {
    // Utiliser le descripteur de fichier
  })
  .catch((err) => {
    // Gérer l'erreur
  });
```

Pour plus de détails sur le module `fs/promises`, veuillez consulter la [documentation de l'API fs/promises](/fr/nodejs/api/fs#promises).

