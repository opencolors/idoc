---
title: Timer JavaScript - setTimeout e setInterval
description: Scopri come utilizzare i timer JavaScript per ritardare l'esecuzione delle funzioni e pianificare attività con setTimeout e setInterval.
head:
  - - meta
    - name: og:title
      content: Timer JavaScript - setTimeout e setInterval | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come utilizzare i timer JavaScript per ritardare l'esecuzione delle funzioni e pianificare attività con setTimeout e setInterval.
  - - meta
    - name: twitter:title
      content: Timer JavaScript - setTimeout e setInterval | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come utilizzare i timer JavaScript per ritardare l'esecuzione delle funzioni e pianificare attività con setTimeout e setInterval.
---


# Scopri i Timer JavaScript

### `setTimeout()`

Quando scrivi codice JavaScript, potresti voler ritardare l'esecuzione di una funzione.

Questo è il compito di `setTimeout`. Specifichi una funzione di callback da eseguire in seguito, e un valore che esprime quanto dopo vuoi che venga eseguita, in millisecondi:

```js
setTimeout(() => {
  // viene eseguito dopo 2 secondi
}, 2000);
setTimeout(() => {
  // viene eseguito dopo 50 millisecondi
}, 50);
```

Questa sintassi definisce una nuova funzione. Puoi chiamare qualsiasi altra funzione tu voglia lì dentro, oppure puoi passare un nome di funzione esistente e un insieme di parametri:

```js
const myFunction = (firstParam, secondParam) => {
  // fai qualcosa
};
// viene eseguito dopo 2 secondi
setTimeout(myFunction, 2000, firstParam, secondParam);
```

`setTimeout` restituisce l'ID del timer. Questo di solito non viene utilizzato, ma puoi memorizzare questo ID e cancellarlo se vuoi eliminare l'esecuzione di questa funzione pianificata:

```js
const id = setTimeout(() => {
  // dovrebbe essere eseguito dopo 2 secondi
}, 2000);
// Ci ho ripensato
clearTimeout(id);
```

## Ritardo zero

Se specifichi il ritardo di timeout a 0, la funzione di callback verrà eseguita il prima possibile, ma dopo l'esecuzione della funzione corrente:

```js
setTimeout(() => {
  console.log('after ');
}, 0);
console.log(' before ');
```

Questo codice stamperà

```bash
before
after
```

Questo è particolarmente utile per evitare di bloccare la CPU su attività intensive e consentire l'esecuzione di altre funzioni durante l'esecuzione di un calcolo pesante, mettendo in coda le funzioni nello scheduler.

::: tip
Alcuni browser (IE ed Edge) implementano un metodo `setImmediate()` che svolge esattamente la stessa funzionalità, ma non è standard e [non è disponibile su altri browser](https://caniuse.com/#feat=setimmediate). Ma è una funzione standard in Node.js.
:::

### `setInterval()`

`setInterval` è una funzione simile a `setTimeout`, con una differenza: invece di eseguire la funzione di callback una sola volta, la eseguirà per sempre, all'intervallo di tempo specifico che specifichi (in millisecondi):

```js
setInterval(() => {
  // viene eseguito ogni 2 secondi
}, 2000);
```

La funzione sopra viene eseguita ogni 2 secondi a meno che tu non le dica di fermarsi, usando `clearInterval`, passandole l'ID dell'intervallo che `setInterval` ha restituito:

```js
const id = setInterval(() => {
  // viene eseguito ogni 2 secondi
}, 2000);
// Ci ho ripensato
clearInterval(id);
```

È comune chiamare `clearInterval` all'interno della funzione di callback `setInterval`, per permetterle di auto-determinare se deve essere eseguita di nuovo o fermarsi. Ad esempio, questo codice esegue qualcosa a meno che App.somethingIWait non abbia il valore arrived:


## setTimeout Ricorsivo

`setInterval` avvia una funzione ogni n millisecondi, senza alcuna considerazione su quando una funzione ha terminato la sua esecuzione.

Se una funzione impiega sempre la stessa quantità di tempo, va tutto bene.

Forse la funzione richiede tempi di esecuzione diversi, a seconda delle condizioni di rete.

E forse una lunga esecuzione si sovrappone alla successiva.

Per evitare questo, puoi programmare un setTimeout ricorsivo da chiamare quando la funzione di callback termina:

```js
const myFunction = () => {
  // fai qualcosa
  setTimeout(myFunction, 1000);
};
setTimeout(myFunction, 1000);
```

`setTimeout` e `setInterval` sono disponibili in Node.js, tramite il [modulo Timers](/it/nodejs/api/timers).

Node.js fornisce anche `setImmediate()`, che è equivalente all'utilizzo di `setTimeout(() => {}, 0)`, utilizzato principalmente per lavorare con il ciclo di eventi di Node.js.

