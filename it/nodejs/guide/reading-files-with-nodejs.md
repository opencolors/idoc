---
title: Leggere file con Node.js
description: Scopri come leggere file in Node.js utilizzando i metodi fs.readFile(), fs.readFileSync() e fsPromises.readFile().
head:
  - - meta
    - name: og:title
      content: Leggere file con Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come leggere file in Node.js utilizzando i metodi fs.readFile(), fs.readFileSync() e fsPromises.readFile().
  - - meta
    - name: twitter:title
      content: Leggere file con Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come leggere file in Node.js utilizzando i metodi fs.readFile(), fs.readFileSync() e fsPromises.readFile().
---


# Lettura di file con Node.js

Il modo più semplice per leggere un file in Node.js è usare il metodo `fs.readFile()`, passandogli il percorso del file, la codifica e una funzione di callback che verrà chiamata con i dati del file (e l'errore):

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

In alternativa, puoi usare la versione sincrona `fs.readFileSync()`:

```javascript
const fs = require('node:fs')

try {
  const data = fs.readFileSync('/Users/joe/test.txt', 'utf8')
  console.log(data)
} catch (err) {
  console.error(err)
}
```

Puoi anche usare il metodo `fsPromises.readFile()` basato su promise offerto dal modulo `fs/promises`:

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

Tutti e tre `fs.readFile()`, `fs.readFileSync()` e `fsPromises.readFile()` leggono l'intero contenuto del file in memoria prima di restituire i dati.

Questo significa che i file di grandi dimensioni avranno un impatto importante sul consumo di memoria e sulla velocità di esecuzione del programma.

In questo caso, un'opzione migliore è leggere il contenuto del file usando gli stream.

