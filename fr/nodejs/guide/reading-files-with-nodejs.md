---
title: Lire des fichiers avec Node.js
description: Découvrez comment lire des fichiers avec Node.js en utilisant les méthodes fs.readFile(), fs.readFileSync() et fsPromises.readFile().
head:
  - - meta
    - name: og:title
      content: Lire des fichiers avec Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez comment lire des fichiers avec Node.js en utilisant les méthodes fs.readFile(), fs.readFileSync() et fsPromises.readFile().
  - - meta
    - name: twitter:title
      content: Lire des fichiers avec Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez comment lire des fichiers avec Node.js en utilisant les méthodes fs.readFile(), fs.readFileSync() et fsPromises.readFile().
---


# Lecture de fichiers avec Node.js

La façon la plus simple de lire un fichier dans Node.js est d'utiliser la méthode `fs.readFile()`, en lui passant le chemin du fichier, l'encodage et une fonction de rappel qui sera appelée avec les données du fichier (et l'erreur) :

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

Alternativement, vous pouvez utiliser la version synchrone `fs.readFileSync()` :

```javascript
const fs = require('node:fs')

try {
  const data = fs.readFileSync('/Users/joe/test.txt', 'utf8')
  console.log(data)
} catch (err) {
  console.error(err)
}
```

Vous pouvez également utiliser la méthode `fsPromises.readFile()` basée sur les promesses offerte par le module `fs/promises` :

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

`fs.readFile()`, `fs.readFileSync()` et `fsPromises.readFile()` lisent tous les trois l'intégralité du contenu du fichier en mémoire avant de renvoyer les données.

Cela signifie que les gros fichiers auront un impact majeur sur votre consommation de mémoire et la vitesse d'exécution du programme.

Dans ce cas, une meilleure option est de lire le contenu du fichier en utilisant des flux.

