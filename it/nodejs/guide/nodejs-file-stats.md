---
title: Statistiche dei file di Node.js
description: Scopri come utilizzare Node.js per ispezionare i dettagli dei file utilizzando il metodo stat() del modulo fs, inclusi tipo di file, dimensione, ecc.
head:
  - - meta
    - name: og:title
      content: Statistiche dei file di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come utilizzare Node.js per ispezionare i dettagli dei file utilizzando il metodo stat() del modulo fs, inclusi tipo di file, dimensione, ecc.
  - - meta
    - name: twitter:title
      content: Statistiche dei file di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come utilizzare Node.js per ispezionare i dettagli dei file utilizzando il metodo stat() del modulo fs, inclusi tipo di file, dimensione, ecc.
---


# Statistiche dei file in Node.js

Ogni file viene fornito con una serie di dettagli che possiamo ispezionare utilizzando Node.js. In particolare, utilizzando il metodo `stat()` fornito dal [modulo fs](/it/nodejs/api/fs).

Lo chiami passando un percorso file e, una volta che Node.js ottiene i dettagli del file, chiamerà la funzione di callback che passi, con 2 parametri: un messaggio di errore e le statistiche del file:

```js
import fs from 'node:fs'
fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err)
  }
  // abbiamo accesso alle statistiche del file in `stats`
})
```

Node.js fornisce anche un metodo sincrono, che blocca il thread finché le statistiche del file non sono pronte:

```js
import fs from 'node:fs'
try {
  const stats = fs.statSync('/Users/joe/test.txt')
} catch (err) {
  console.error(err)
}
```

Le informazioni sul file sono incluse nella variabile stats. Che tipo di informazioni possiamo estrarre usando le statistiche?

**Molte, tra cui:**

- se il file è una directory o un file, usando `stats.isFile()` e `stats.isDirectory()`
- se il file è un collegamento simbolico usando `stats.isSymbolicLink()`
- la dimensione del file in byte usando `stats.size`.

Ci sono altri metodi avanzati, ma la maggior parte di ciò che userai nella tua programmazione quotidiana è questo.

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

Puoi anche usare il metodo `fsPromises.stat()` basato su promise offerto dal modulo `fs/promises` se preferisci:

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

Puoi leggere di più sul modulo fs nella documentazione del [modulo del file system](/it/nodejs/api/fs).

