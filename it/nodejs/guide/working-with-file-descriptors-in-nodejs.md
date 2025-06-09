---
title: Aprire file in Node.js
description: Scopri come aprire file in Node.js utilizzando il modulo fs, inclusi metodi sincroni e asincroni, e approcci basati su promesse.
head:
  - - meta
    - name: og:title
      content: Aprire file in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come aprire file in Node.js utilizzando il modulo fs, inclusi metodi sincroni e asincroni, e approcci basati su promesse.
  - - meta
    - name: twitter:title
      content: Aprire file in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come aprire file in Node.js utilizzando il modulo fs, inclusi metodi sincroni e asincroni, e approcci basati su promesse.
---


# Lavorare con i descrittori di file in Node.js

Prima di poter interagire con un file presente nel tuo filesystem, devi ottenere un descrittore di file. Un descrittore di file è un riferimento a un file aperto, un numero (fd) restituito dall'apertura del file utilizzando il metodo `open()` offerto dal modulo `fs`. Questo numero (fd) identifica univocamente un file aperto nel sistema operativo.

## Apertura dei file

### CommonJS (CJS)

```javascript
const fs = require('node:fs');
fs.open('/Users/joe/test.txt', 'r', (err, fd) => {
  // fd è il nostro descrittore di file
});
```

Nota la `'r'` che abbiamo usato come secondo parametro nella chiamata a `fs.open()`. Questo flag significa che apriamo il file in lettura. Altri flag che userai comunemente sono:

| Flag | Descrizione                                           |
|------|-------------------------------------------------------|
| `'w+'`| Questo flag apre il file in lettura e scrittura. Posiziona lo stream all'inizio del file. |
| `'a+'`| Questo flag apre il file in lettura e scrittura e posiziona anche lo stream alla fine del file. |

Puoi anche aprire il file usando il metodo `fs.openSync`, che restituisce il descrittore di file invece di fornirlo in un callback:

```javascript
const fs = require('node:fs');

try {
  const fd = fs.openSync('/Users/joe/test.txt', 'r');
} catch (err) {
  console.error(err);
}
```

## Esecuzione di operazioni

Una volta ottenuto il descrittore di file nel modo che preferisci, puoi eseguire tutte le operazioni che lo richiedono, come chiamare `fs.close()` e molte altre operazioni che interagiscono con il filesystem.

## Utilizzo di fsPromises

Puoi anche aprire il file utilizzando il metodo `fsPromises.open` basato su promise offerto dal modulo `fs/promises`. Il modulo `fs/promises` è disponibile solo a partire da Node.js v14. Prima della v14, dopo la v10, puoi invece usare `require('fs').promises`. Prima della v10, dopo la v8, puoi usare `util.promisify` per convertire i metodi `fs` in metodi basati su promise.

### Moduli ES (MJS)

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


## Esempio di util.promisify

Ecco un esempio di come usare `util.promisify` per convertire `fs.open` in una funzione basata su promise:

```javascript
const fs = require('node:fs');
const util = require('node:util');

const open = util.promisify(fs.open);

open('test.txt', 'r')
  .then((fd) => {
    // Usa il descrittore del file
  })
  .catch((err) => {
    // Gestisci l'errore
  });
```

Per vedere più dettagli sul modulo `fs/promises`, controlla la [documentazione dell'API fs/promises](/it/nodejs/api/fs#promises).

