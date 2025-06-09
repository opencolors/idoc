---
title: Statistiques de fichiers Node.js
description: Découvrez comment utiliser Node.js pour inspecter les détails des fichiers à l'aide de la méthode stat() du module fs, y compris le type de fichier, la taille, etc.
head:
  - - meta
    - name: og:title
      content: Statistiques de fichiers Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez comment utiliser Node.js pour inspecter les détails des fichiers à l'aide de la méthode stat() du module fs, y compris le type de fichier, la taille, etc.
  - - meta
    - name: twitter:title
      content: Statistiques de fichiers Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez comment utiliser Node.js pour inspecter les détails des fichiers à l'aide de la méthode stat() du module fs, y compris le type de fichier, la taille, etc.
---


# Statistiques de fichier Node.js

Chaque fichier est accompagné d'un ensemble de détails que nous pouvons inspecter à l'aide de Node.js. En particulier, en utilisant la méthode `stat()` fournie par le [module fs](/fr/nodejs/api/fs).

Vous l'appelez en passant un chemin de fichier, et une fois que Node.js obtient les détails du fichier, il appellera la fonction de rappel que vous passez, avec 2 paramètres : un message d'erreur et les statistiques du fichier :

```js
import fs from 'node:fs'
fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err)
  }
  // nous avons accès aux statistiques du fichier dans `stats`
})
```

Node.js fournit également une méthode synchrone, qui bloque le thread jusqu'à ce que les statistiques du fichier soient prêtes :

```js
import fs from 'node:fs'
try {
  const stats = fs.statSync('/Users/joe/test.txt')
} catch (err) {
  console.error(err)
}
```

Les informations du fichier sont incluses dans la variable stats. Quel type d'informations pouvons-nous extraire en utilisant les stats ?

**Beaucoup, y compris :**

- si le fichier est un répertoire ou un fichier, en utilisant `stats.isFile()` et `stats.isDirectory()`
- si le fichier est un lien symbolique en utilisant `stats.isSymbolicLink()`
- la taille du fichier en octets en utilisant `stats.size`.

Il existe d'autres méthodes avancées, mais l'essentiel de ce que vous utiliserez dans votre programmation quotidienne est ceci.

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

Vous pouvez également utiliser la méthode `fsPromises.stat()` basée sur les promesses offerte par le module `fs/promises` si vous le souhaitez :

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

Vous pouvez en savoir plus sur le module fs dans la documentation du [module de système de fichiers](/fr/nodejs/api/fs).

