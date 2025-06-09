---
title: Comprendere setImmediate() in Node.js
description: Scopri come funziona setImmediate() in Node.js, le sue differenze con setTimeout(), process.nextTick() e Promise.then(), e come interagisce con il ciclo degli eventi e le code.
head:
  - - meta
    - name: og:title
      content: Comprendere setImmediate() in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come funziona setImmediate() in Node.js, le sue differenze con setTimeout(), process.nextTick() e Promise.then(), e come interagisce con il ciclo degli eventi e le code.
  - - meta
    - name: twitter:title
      content: Comprendere setImmediate() in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come funziona setImmediate() in Node.js, le sue differenze con setTimeout(), process.nextTick() e Promise.then(), e come interagisce con il ciclo degli eventi e le code.
---


# Comprendere `setImmediate()`

Quando si desidera eseguire un frammento di codice in modo asincrono, ma il prima possibile, un'opzione è quella di utilizzare la funzione `setImmediate()` fornita da Node.js:

```js
setImmediate(() => {
    // fare qualcosa
})
```

Qualsiasi funzione passata come argomento di `setImmediate()` è una callback che viene eseguita nella prossima iterazione del ciclo di eventi.

In cosa `setImmediate()` è diverso da `setTimeout(() => {}, 0)` (passando un timeout di 0 ms) e da `process.nextTick()` e `Promise.then()`?

Una funzione passata a `process.nextTick()` verrà eseguita nell'iterazione corrente del ciclo di eventi, dopo la fine dell'operazione corrente. Ciò significa che verrà sempre eseguita prima di `setTimeout` e `setImmediate`.

Una callback di `setTimeout()` con un ritardo di 0 ms è molto simile a `setImmediate()`. L'ordine di esecuzione dipenderà da vari fattori, ma entrambi verranno eseguiti nella prossima iterazione del ciclo di eventi.

Una callback di `process.nextTick` viene aggiunta alla **coda process.nextTick**. Una callback di `Promise.then()` viene aggiunta alla **coda di microtask delle promise**. Una callback di `setTimeout`, `setImmediate` viene aggiunta alla **coda di macrotask**.

Il ciclo di eventi esegue prima le attività nella **coda process.nextTick**, quindi esegue la **coda di microtask delle promise** e quindi esegue la **coda di macrotask** di `setTimeout` o `setImmediate`.

Ecco un esempio per mostrare l'ordine tra `setImmediate()`, `process.nextTick()` e `Promise.then()`:

```js
const baz = () => console.log('baz');
const foo = () => console.log('foo');
const zoo = () => console.log('zoo');
const start = () => {
  console.log('start');
  setImmediate(baz);
  new Promise((resolve, reject) => {
    resolve('bar');
  }).then(resolve => {
    console.log(resolve);
    process.nextTick(zoo);
  });
  process.nextTick(foo);
};
start();
// start foo bar zoo baz
```

Questo codice chiamerà prima `start()`, quindi chiamerà `foo()` nella **coda process.nextTick**. Successivamente, gestirà la **coda di microtask delle promise**, che stampa bar e aggiunge `zoo()` nella **coda process.nextTick** contemporaneamente. Quindi chiamerà `zoo()` che è stato appena aggiunto. Alla fine, viene chiamato `baz()` nella **coda di macrotask**.

Il principio sopra menzionato vale nei casi CommonJS, ma tieni presente che nei moduli ES, ad es. file `mjs`, l'ordine di esecuzione sarà diverso:

```js
// start bar foo zoo baz
```

Questo perché il modulo ES in fase di caricamento è racchiuso come un'operazione asincrona e quindi l'intero script è già nella **coda di microtask delle promise**. Quindi, quando la promise viene risolta immediatamente, la sua callback viene aggiunta alla **coda di microtask**. Node.js tenterà di svuotare la coda prima di passare a qualsiasi altra coda e quindi vedrai che stampa prima bar.

