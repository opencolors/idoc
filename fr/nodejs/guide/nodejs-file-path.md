---
title: Chemins de fichiers Node.js
description: Découvrez les chemins de fichiers dans Node.js, notamment les chemins de fichiers système, le module `path` et comment extraire des informations à partir des chemins.
head:
  - - meta
    - name: og:title
      content: Chemins de fichiers Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez les chemins de fichiers dans Node.js, notamment les chemins de fichiers système, le module `path` et comment extraire des informations à partir des chemins.
  - - meta
    - name: twitter:title
      content: Chemins de fichiers Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez les chemins de fichiers dans Node.js, notamment les chemins de fichiers système, le module `path` et comment extraire des informations à partir des chemins.
---


# Chemins de fichiers Node.js

## Chemins de fichiers système

Chaque fichier du système a un chemin. Sous Linux et macOS, un chemin peut ressembler à : `/users/joe/file.txt`

tandis que les ordinateurs Windows ont une structure différente telle que : `C:\users\joe\file.txt`

Vous devez faire attention lorsque vous utilisez des chemins dans vos applications, car cette différence doit être prise en compte.

## Utilisation du module `path`

Vous incluez ce module dans vos fichiers en utilisant :

```javascript
const path = require('node:path')
```

et vous pouvez commencer à utiliser ses méthodes.

## Extraire des informations d'un chemin

Étant donné un chemin, vous pouvez en extraire des informations à l'aide de ces méthodes :

- `dirname` : récupère le dossier parent d'un fichier
- `basename` : récupère la partie nom de fichier
- `extname` : récupère l'extension de fichier

### Exemple

::: code-group

```javascript [CJS]
const path = require('node:path')
const notes = '/users/joe/notes.txt'

path.dirname(notes) // /users/joe
path.extname(notes) // .txt
```

```javascript [MJS]
import path from 'node:path'
const notes = '/users/joe/notes.txt'

path.dirname(notes) // /users/joe
path.extname(notes) // .txt
```

:::

Vous pouvez obtenir le nom de fichier sans l'extension en spécifiant un deuxième argument à `basename` :

```javascript
path.basename(notes, path.extname(notes)) // notes
```

## Travailler avec des chemins

Vous pouvez joindre deux ou plusieurs parties d'un chemin en utilisant `path.join()` :

```javascript
path.join('/users', 'joe', 'file.txt') // /users/joe/file.txt
```

Vous pouvez obtenir le calcul du chemin absolu d'un chemin relatif en utilisant `path.resolve()` :

```javascript
path.resolve('joe.txt') // /Users/joe/joe.txt si exécuté depuis mon dossier personnel
path.resolve('tmp', 'joe.txt') // /Users/joe/tmp/joe.txt si exécuté depuis mon dossier personnel
```

Dans ce cas, Node.js ajoutera simplement `/joe.txt` au répertoire de travail actuel. Si vous spécifiez un deuxième paramètre comme dossier, `resolve` utilisera le premier comme base pour le second.

Si le premier paramètre commence par une barre oblique, cela signifie qu'il s'agit d'un chemin absolu :

```javascript
path.resolve('/etc', 'joe.txt') // /etc/joe.txt
```

`path.normalize()` est une autre fonction utile qui tentera de calculer le chemin réel lorsqu'il contient des spécificateurs relatifs comme `.` ou `..`, ou des doubles barres obliques :

```javascript
path.normalize('/users/joe/../test.txt') // /users/test.txt
```

Ni `resolve` ni `normalize` ne vérifieront si le chemin existe. Ils calculent simplement un chemin basé sur les informations qu'ils ont obtenues.

