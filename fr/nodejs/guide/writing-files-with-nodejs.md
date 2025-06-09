---
title: Ajouter du contenu à un fichier dans Node.js
description: Apprenez à ajouter du contenu à un fichier dans Node.js en utilisant les méthodes fs.appendFile() et fs.appendFileSync(), avec des exemples et des extraits de code.
head:
  - - meta
    - name: og:title
      content: Ajouter du contenu à un fichier dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Apprenez à ajouter du contenu à un fichier dans Node.js en utilisant les méthodes fs.appendFile() et fs.appendFileSync(), avec des exemples et des extraits de code.
  - - meta
    - name: twitter:title
      content: Ajouter du contenu à un fichier dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Apprenez à ajouter du contenu à un fichier dans Node.js en utilisant les méthodes fs.appendFile() et fs.appendFileSync(), avec des exemples et des extraits de code.
---


# Écrire des fichiers avec Node.js

## Écrire un fichier

La façon la plus simple d'écrire dans des fichiers avec Node.js est d'utiliser l'API `fs.writeFile()`.

```javascript
const fs = require('node:fs')
const content = 'Some content!'

fs.writeFile('/Users/joe/test.txt', content, err => {
  if (err) {
    console.error(err)
  } else {
    // file written successfully
  }
})
```

### Écrire un fichier de manière synchrone

Alternativement, vous pouvez utiliser la version synchrone `fs.writeFileSync` :

```javascript
const fs = require('node:fs')
const content = 'Some content!'

try {
  fs.writeFileSync('/Users/joe/test.txt', content)
} catch (err) {
  console.error(err)
}
```

Vous pouvez également utiliser la méthode `fsPromises.writeFile()` basée sur les promesses, offerte par le module `fs/promises` :

```javascript
const fs = require('node:fs/promises')
async function example() {
  try {
    const content = 'Some content!'
    await fs.writeFile('/Users/joe/test.txt', content)
  } catch (err) {
    console.log(err)
  }
}

example()
```

Par défaut, cette API remplacera le contenu du fichier s'il existe déjà.

Vous pouvez modifier le comportement par défaut en spécifiant un drapeau :

```javascript
fs.writeFile('/Users/joe/test.txt', content, { flag: 'a+' }, err => [])
```

Les drapeaux que vous utiliserez probablement sont :
| Drapeau | Description | Le fichier est-il créé s'il n'existe pas ? |
| --- | --- | --- |
| `r+` | Ce drapeau ouvre le fichier en lecture et en écriture | :x: |
| `w+` | Ce drapeau ouvre le fichier en lecture et en écriture et positionne également le flux au début du fichier | :white_check_mark: |
| `a` | Ce drapeau ouvre le fichier en écriture et positionne également le flux à la fin du fichier | :white_check_mark: |
| `a+` | Ce flux ouvre le fichier en lecture et en écriture et positionne également le flux à la fin du fichier | :white_check_mark: |

Vous trouverez plus d'informations sur les drapeaux dans la documentation fs.

## Ajouter du contenu à un fichier

L'ajout à des fichiers est pratique lorsque vous ne voulez pas écraser un fichier avec un nouveau contenu, mais plutôt l'ajouter.


### Exemples

Une méthode pratique pour ajouter du contenu à la fin d'un fichier est `fs.appendFile()` (et son homologue `fs.appendFileSync()`):

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

### Exemple avec des Promesses

Voici un exemple de `fsPromises.appendFile()`:

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

