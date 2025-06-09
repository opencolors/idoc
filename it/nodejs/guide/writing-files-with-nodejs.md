---
title: Aggiungere contenuto a un file in Node.js
description: Scopri come aggiungere contenuto a un file in Node.js utilizzando i metodi fs.appendFile() e fs.appendFileSync(), con esempi e frammenti di codice.
head:
  - - meta
    - name: og:title
      content: Aggiungere contenuto a un file in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come aggiungere contenuto a un file in Node.js utilizzando i metodi fs.appendFile() e fs.appendFileSync(), con esempi e frammenti di codice.
  - - meta
    - name: twitter:title
      content: Aggiungere contenuto a un file in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come aggiungere contenuto a un file in Node.js utilizzando i metodi fs.appendFile() e fs.appendFileSync(), con esempi e frammenti di codice.
---


# Scrivere file con Node.js

## Scrivere un file

Il modo più semplice per scrivere su file in Node.js è utilizzare l'API `fs.writeFile()`.

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

### Scrivere un file in modo sincrono

In alternativa, puoi utilizzare la versione sincrona `fs.writeFileSync`:

```javascript
const fs = require('node:fs')
const content = 'Some content!'

try {
  fs.writeFileSync('/Users/joe/test.txt', content)
} catch (err) {
  console.error(err)
}
```

Puoi anche utilizzare il metodo `fsPromises.writeFile()` basato su promise offerto dal modulo `fs/promises`:

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

Per impostazione predefinita, questa API sostituirà il contenuto del file se esiste già.

Puoi modificare l'impostazione predefinita specificando un flag:

```javascript
fs.writeFile('/Users/joe/test.txt', content, { flag: 'a+' }, err => [])
```

I flag che probabilmente utilizzerai sono:
| Flag | Descrizione | Il file viene creato se non esiste |
| --- | --- | --- |
| `r+` | Questo flag apre il file per la lettura e la scrittura | :x: |
| `w+` | Questo flag apre il file per la lettura e la scrittura e posiziona anche lo stream all'inizio del file | :white_check_mark: |
| `a` | Questo flag apre il file per la scrittura e posiziona anche lo stream alla fine del file | :white_check_mark: |
| `a+` | Questo stream apre il file per la lettura e la scrittura e posiziona anche lo stream alla fine del file | :white_check_mark: |

Puoi trovare maggiori informazioni sui flag nella documentazione di fs.

## Aggiungere contenuto a un file

Aggiungere contenuto ai file è utile quando non si desidera sovrascrivere un file con nuovi contenuti, ma piuttosto aggiungerli.


### Esempi

Un metodo utile per aggiungere contenuto alla fine di un file è `fs.appendFile()` (e la sua controparte `fs.appendFileSync()`):

```javascript
const fs = require('node:fs')
const content = 'Some content!'

fs.appendFile('file_log', content, err => {
  if (err) {
    console.error(err)
  } else {
    // fatto!
  }
})
```

### Esempio con Promise

Ecco un esempio di `fsPromises.appendFile()`:

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

