---
title: Blocchi e non blocchi in Node.js
description: Questo articolo spiega la differenza tra le chiamate bloccanti e non bloccanti in Node.js, inclusi i loro effetti sul ciclo degli eventi e sulla concorrenza.
head:
  - - meta
    - name: og:title
      content: Blocchi e non blocchi in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Questo articolo spiega la differenza tra le chiamate bloccanti e non bloccanti in Node.js, inclusi i loro effetti sul ciclo degli eventi e sulla concorrenza.
  - - meta
    - name: twitter:title
      content: Blocchi e non blocchi in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Questo articolo spiega la differenza tra le chiamate bloccanti e non bloccanti in Node.js, inclusi i loro effetti sul ciclo degli eventi e sulla concorrenza.
---


# Panoramica di Blocking vs Non-Blocking

Questa panoramica illustra la differenza tra chiamate blocking e non-blocking in Node.js. Questa panoramica farà riferimento all'event loop e a libuv, ma non è richiesta alcuna conoscenza preliminare di questi argomenti. Si presume che i lettori abbiano una comprensione di base del linguaggio JavaScript e del [callback pattern](/it/nodejs/guide/javascript-asynchronous-programming-and-callbacks) di Node.js.

::: info
"I/O" si riferisce principalmente all'interazione con il disco e la rete del sistema supportati da [libuv](https://libuv.org/).
:::

## Blocking

**Blocking** significa che l'esecuzione di ulteriore JavaScript nel processo Node.js deve attendere fino al completamento di un'operazione non-JavaScript. Ciò accade perché l'event loop non è in grado di continuare a eseguire JavaScript mentre è in corso un'operazione **blocking**.

In Node.js, JavaScript che mostra prestazioni scadenti a causa dell'intensità della CPU anziché dell'attesa di un'operazione non-JavaScript, come I/O, non è in genere definito come **blocking**. I metodi sincroni nella libreria standard di Node.js che utilizzano libuv sono le operazioni **blocking** più comunemente utilizzate. Anche i moduli nativi possono avere metodi **blocking**.

Tutti i metodi I/O nella libreria standard di Node.js forniscono versioni asincrone, che sono **non-blocking**, e accettano funzioni di callback. Alcuni metodi hanno anche controparti **blocking**, i cui nomi terminano con `Sync`.

## Confronto tra Codice

I metodi **blocking** vengono eseguiti in modo **sincrono** e i metodi **non-blocking** vengono eseguiti in modo **asincrono**.

Utilizzando il modulo File System come esempio, questo è una lettura di file **sincrona**:

```js
const fs = require('node:fs')
const data = fs.readFileSync('/file.md') // si blocca qui fino a quando il file non viene letto
```

E qui c'è un esempio **asincrono** equivalente:

```js
const fs = require('node:fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
})
```

Il primo esempio sembra più semplice del secondo, ma ha lo svantaggio che la seconda riga **blocca** l'esecuzione di qualsiasi JavaScript aggiuntivo fino a quando l'intero file non viene letto. Si noti che nella versione sincrona, se viene generato un errore, dovrà essere intercettato o il processo si arresterà in modo anomalo. Nella versione asincrona, spetta all'autore decidere se un errore debba essere generato come mostrato.

Espandiamo un po' il nostro esempio:

```js
const fs = require('node:fs')
const data = fs.readFileSync('/file.md') // si blocca qui fino a quando il file non viene letto
console.log(data)
moreWork() // verrà eseguito dopo console.log
```

Ed ecco un esempio asincrono simile, ma non equivalente:

```js
const fs = require('node:fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
  console.log(data)
})
moreWork() // verrà eseguito prima di console.log
```

Nel primo esempio sopra, `console.log` verrà chiamato prima di `moreWork()`. Nel secondo esempio, `fs.readFile()` è **non-blocking**, quindi l'esecuzione di JavaScript può continuare e `moreWork()` verrà chiamato per primo. La possibilità di eseguire `moreWork()` senza attendere il completamento della lettura del file è una scelta di progettazione fondamentale che consente una maggiore produttività.


## Concorrenza e Throughput

L'esecuzione di JavaScript in Node.js è single-threaded, quindi la concorrenza si riferisce alla capacità del ciclo degli eventi di eseguire funzioni di callback JavaScript dopo aver completato altro lavoro. Qualsiasi codice che si prevede venga eseguito in modo concorrente deve consentire al ciclo degli eventi di continuare a funzionare mentre sono in corso operazioni non-JavaScript, come I/O.

Ad esempio, consideriamo un caso in cui ogni richiesta a un server web impiega 50ms per essere completata e 45ms di quei 50ms sono I/O del database che possono essere eseguiti in modo asincrono. La scelta di operazioni asincrone non bloccanti libera quei 45ms per richiesta per gestire altre richieste. Questa è una differenza significativa nella capacità semplicemente scegliendo di utilizzare metodi non bloccanti anziché metodi bloccanti.

Il ciclo degli eventi è diverso dai modelli in molti altri linguaggi in cui è possibile creare thread aggiuntivi per gestire il lavoro concorrente.

## Pericoli di mescolare codice bloccante e non bloccante

Ci sono alcuni modelli che dovrebbero essere evitati quando si ha a che fare con I/O. Vediamo un esempio:

```js
const fs = require('node:fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
  console.log(data)
})
fs.unlinkSync('/file.md')
```

Nell'esempio precedente, è probabile che `fs.unlinkSync()` venga eseguito prima di `fs.readFile()`, il che eliminerebbe `file.md` prima che venga effettivamente letto. Un modo migliore per scrivere questo, che è completamente non bloccante e garantito per essere eseguito nell'ordine corretto è:

```js
const fs = require('node:fs')
fs.readFile('/file.md', (readFileErr, data) => {
  if (readFileErr) throw readFileErr
  console.log(data)
  fs.unlink('/file.md', unlinkErr => {
    if (unlinkErr) throw unlinkErr
  })
})
```

Quanto sopra inserisce una chiamata **non bloccante** a `fs.unlink()` all'interno della callback di `fs.readFile()` che garantisce l'ordine corretto delle operazioni.

