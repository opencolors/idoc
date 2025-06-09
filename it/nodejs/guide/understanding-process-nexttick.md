---
title: Capire process.nextTick() in Node.js
description: Scopri come funziona process.nextTick() in Node.js e come si differenzia da setImmediate() e setTimeout(). Comprendi il ciclo degli eventi e come utilizzare nextTick() per eseguire codice in modo asincrono.
head:
  - - meta
    - name: og:title
      content: Capire process.nextTick() in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come funziona process.nextTick() in Node.js e come si differenzia da setImmediate() e setTimeout(). Comprendi il ciclo degli eventi e come utilizzare nextTick() per eseguire codice in modo asincrono.
  - - meta
    - name: twitter:title
      content: Capire process.nextTick() in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come funziona process.nextTick() in Node.js e come si differenzia da setImmediate() e setTimeout(). Comprendi il ciclo degli eventi e come utilizzare nextTick() per eseguire codice in modo asincrono.
---


# Comprendere `process.nextTick()`

Mentre cerchi di comprendere l'event loop di Node.js, una parte importante di esso è `process.nextTick()`. Ogni volta che l'event loop fa un giro completo, lo chiamiamo tick.

Quando passiamo una funzione a process.nextTick(), istruiamo l'engine a invocare questa funzione alla fine dell'operazione corrente, prima che inizi il prossimo tick dell'event loop:

```js
process.nextTick(() => {
  // fai qualcosa
})
```

L'event loop è occupato a elaborare il codice della funzione corrente. Quando questa operazione termina, l'engine JS esegue tutte le funzioni passate alle chiamate `nextTick` durante quell'operazione.

È il modo in cui possiamo dire all'engine JS di elaborare una funzione in modo asincrono (dopo la funzione corrente), ma il prima possibile, senza metterla in coda.

Chiamare `setTimeout(() => {}, 0)` eseguirà la funzione alla fine del prossimo tick, molto più tardi rispetto a quando si usa `nextTick()` che dà priorità alla chiamata e la esegue appena prima dell'inizio del prossimo tick.

Usa `nextTick()` quando vuoi assicurarti che nella prossima iterazione dell'event loop quel codice sia già stato eseguito.

## Un esempio dell'ordine degli eventi:

```js
console.log('Ciao => numero 1')
setImmediate(() => {
  console.log('Esecuzione prima del timeout => numero 3')
})
setTimeout(() => {
  console.log('Il timeout in esecuzione per ultimo => numero 4')
}, 0)
process.nextTick(() => {
  console.log('Esecuzione al prossimo tick => numero 2')
})
```

## Output di esempio:

```bash
Ciao => numero 1
Esecuzione al prossimo tick => numero 2
Esecuzione prima del timeout => numero 3
Il timeout in esecuzione per ultimo => numero 4
```

L'output esatto potrebbe differire da un'esecuzione all'altra.

