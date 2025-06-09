---
title: Emititore di eventi Node.js
description: Scopri l'emittitore di eventi Node.js, uno strumento potente per gestire gli eventi nelle tue applicazioni server-side.
head:
  - - meta
    - name: og:title
      content: Emititore di eventi Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri l'emittitore di eventi Node.js, uno strumento potente per gestire gli eventi nelle tue applicazioni server-side.
  - - meta
    - name: twitter:title
      content: Emititore di eventi Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri l'emittitore di eventi Node.js, uno strumento potente per gestire gli eventi nelle tue applicazioni server-side.
---


# L'Emitter di Eventi di Node.js

Se hai lavorato con JavaScript nel browser, sai quanto dell'interazione dell'utente viene gestita tramite eventi: clic del mouse, pressione dei tasti della tastiera, reazione ai movimenti del mouse e così via.

Sul lato backend, Node.js ci offre la possibilità di costruire un sistema simile usando il **[modulo events](/it/nodejs/api/events)**.

Questo modulo, in particolare, offre la classe EventEmitter, che useremo per gestire i nostri eventi.

Si inizializza usando

```js
import EventEmitter from 'node:events';
const eventEmitter = new EventEmitter();
```

Questo oggetto espone, tra molti altri, i metodi `on` e `emit`.

- `emit` viene utilizzato per attivare un evento
- `on` viene utilizzato per aggiungere una funzione di callback che verrà eseguita quando l'evento viene attivato

Ad esempio, creiamo un evento `start` e, a titolo di esempio, reagiamo ad esso semplicemente scrivendo sulla console:

```js
eventEmitter.on('start', () => {
  console.log('iniziato');
});
```

Quando eseguiamo

```js
eventEmitter.emit('start');
```

la funzione di gestione dell'evento viene attivata e otteniamo il log nella console.

Puoi passare argomenti al gestore di eventi passandoli come argomenti aggiuntivi a `emit()`:

```js
eventEmitter.on('start', number => {
  console.log(`iniziato ${number}`);
});
eventEmitter.emit('start', 23);
```

Argomenti multipli:

```js
eventEmitter.on('start', (start, end) => {
  console.log(`iniziato da ${start} a ${end}`);
});
eventEmitter.emit('start', 1, 100);
```

L'oggetto EventEmitter espone anche diversi altri metodi per interagire con gli eventi, come

- `once()`: aggiunge un listener una tantum
- `removeListener()` / `off()`: rimuove un listener di eventi da un evento
- `removeAllListeners()`: rimuove tutti i listener per un evento

Puoi leggere di più su questi metodi nella [documentazione del modulo events](/it/nodejs/api/events).

