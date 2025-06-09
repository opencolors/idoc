---
title: Percorsi file Node.js
description: Scopri i percorsi file in Node.js, inclusi i percorsi file di sistema, il modulo `path` e come estrarre informazioni dai percorsi.
head:
  - - meta
    - name: og:title
      content: Percorsi file Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri i percorsi file in Node.js, inclusi i percorsi file di sistema, il modulo `path` e come estrarre informazioni dai percorsi.
  - - meta
    - name: twitter:title
      content: Percorsi file Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri i percorsi file in Node.js, inclusi i percorsi file di sistema, il modulo `path` e come estrarre informazioni dai percorsi.
---


# Percorsi File in Node.js

## Percorsi File di Sistema

Ogni file nel sistema ha un percorso. Su Linux e macOS, un percorso potrebbe assomigliare a: `/users/joe/file.txt`

mentre i computer Windows hanno una struttura diversa come: `C:\users\joe\file.txt`

Devi prestare attenzione quando usi i percorsi nelle tue applicazioni, poiché questa differenza deve essere presa in considerazione.

## Usare il Modulo `path`

Includi questo modulo nei tuoi file usando:

```javascript
const path = require('node:path')
```

e puoi iniziare a usare i suoi metodi.

## Ottenere Informazioni da un Percorso

Dato un percorso, puoi estrarre informazioni da esso usando questi metodi:

- `dirname`: ottiene la cartella principale di un file
- `basename`: ottiene la parte del nome file
- `extname`: ottiene l'estensione del file

### Esempio

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

Puoi ottenere il nome del file senza l'estensione specificando un secondo argomento a `basename`:

```javascript
path.basename(notes, path.extname(notes)) // notes
```

## Lavorare con i Percorsi

Puoi unire due o più parti di un percorso usando `path.join()`:

```javascript
path.join('/users', 'joe', 'file.txt') // /users/joe/file.txt
```

Puoi ottenere il calcolo del percorso assoluto di un percorso relativo usando `path.resolve()`:

```javascript
path.resolve('joe.txt') // /Users/joe/joe.txt se eseguito dalla mia cartella home
path.resolve('tmp', 'joe.txt') // /Users/joe/tmp/joe.txt se eseguito dalla mia cartella home
```

In questo caso, Node.js aggiungerà semplicemente `/joe.txt` alla directory di lavoro corrente. Se specifichi un secondo parametro come cartella, `resolve` userà il primo come base per il secondo.

Se il primo parametro inizia con una barra, significa che è un percorso assoluto:

```javascript
path.resolve('/etc', 'joe.txt') // /etc/joe.txt
```

`path.normalize()` è un'altra funzione utile che cercherà di calcolare il percorso effettivo quando contiene specificatori relativi come `.` o `..`, o doppie barre:

```javascript
path.normalize('/users/joe/../test.txt') // /users/test.txt
```

Né `resolve` né `normalize` verificheranno se il percorso esiste. Calcolano semplicemente un percorso in base alle informazioni che hanno ricevuto.

