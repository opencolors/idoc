---
title: Documentazione Node.js - Eventi
description: Esplora il modulo Eventi in Node.js, che offre un modo per gestire operazioni asincrone attraverso la programmazione basata su eventi. Scopri di più sugli emettitori di eventi, gli ascoltatori e come gestire efficacemente gli eventi.
head:
  - - meta
    - name: og:title
      content: Documentazione Node.js - Eventi | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esplora il modulo Eventi in Node.js, che offre un modo per gestire operazioni asincrone attraverso la programmazione basata su eventi. Scopri di più sugli emettitori di eventi, gli ascoltatori e come gestire efficacemente gli eventi.
  - - meta
    - name: twitter:title
      content: Documentazione Node.js - Eventi | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esplora il modulo Eventi in Node.js, che offre un modo per gestire operazioni asincrone attraverso la programmazione basata su eventi. Scopri di più sugli emettitori di eventi, gli ascoltatori e come gestire efficacemente gli eventi.
---


# Eventi {#events}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/events.js](https://github.com/nodejs/node/blob/v23.5.0/lib/events.js)

Gran parte dell'API principale di Node.js è costruita attorno a un'architettura asincrona idiomatica guidata dagli eventi in cui determinati tipi di oggetti (chiamati "emettitori") emettono eventi denominati che fanno sì che gli oggetti `Function` ("listener") vengano chiamati.

Ad esempio: un oggetto [`net.Server`](/it/nodejs/api/net#class-netserver) emette un evento ogni volta che un peer si connette ad esso; un [`fs.ReadStream`](/it/nodejs/api/fs#class-fsreadstream) emette un evento quando il file viene aperto; uno [stream](/it/nodejs/api/stream) emette un evento ogni volta che i dati sono disponibili per essere letti.

Tutti gli oggetti che emettono eventi sono istanze della classe `EventEmitter`. Questi oggetti espongono una funzione `eventEmitter.on()` che consente di collegare una o più funzioni a eventi denominati emessi dall'oggetto. In genere, i nomi degli eventi sono stringhe in camel-case, ma è possibile utilizzare qualsiasi chiave di proprietà JavaScript valida.

Quando l'oggetto `EventEmitter` emette un evento, tutte le funzioni collegate a quello specifico evento vengono chiamate *sincronamente*. Tutti i valori restituiti dai listener chiamati vengono *ignorati* e scartati.

L'esempio seguente mostra una semplice istanza `EventEmitter` con un singolo listener. Il metodo `eventEmitter.on()` viene utilizzato per registrare i listener, mentre il metodo `eventEmitter.emit()` viene utilizzato per attivare l'evento.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
myEmitter.emit('event');
```

```js [CJS]
const EventEmitter = require('node:events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
myEmitter.emit('event');
```
:::

## Passaggio di argomenti e `this` ai listener {#passing-arguments-and-this-to-listeners}

Il metodo `eventEmitter.emit()` consente di passare un set arbitrario di argomenti alle funzioni listener. Tieni presente che quando viene chiamata una normale funzione listener, la parola chiave standard `this` viene intenzionalmente impostata per fare riferimento all'istanza `EventEmitter` a cui è collegato il listener.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // Prints:
  //   a b MyEmitter {
  //     _events: [Object: null prototype] { event: [Function (anonymous)] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined,
  //     [Symbol(shapeMode)]: false,
  //     [Symbol(kCapture)]: false
  //   } true
});
myEmitter.emit('event', 'a', 'b');
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // Prints:
  //   a b MyEmitter {
  //     _events: [Object: null prototype] { event: [Function (anonymous)] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined,
  //     [Symbol(shapeMode)]: false,
  //     [Symbol(kCapture)]: false
  //   } true
});
myEmitter.emit('event', 'a', 'b');
```
:::

È possibile utilizzare le Funzioni Arrow ES6 come listener, tuttavia, quando si fa ciò, la parola chiave `this` non farà più riferimento all'istanza `EventEmitter`:

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // Prints: a b undefined
});
myEmitter.emit('event', 'a', 'b');
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // Prints: a b {}
});
myEmitter.emit('event', 'a', 'b');
```
:::

## Asincrono vs. sincrono {#asynchronous-vs-synchronous}

L'`EventEmitter` chiama tutti i listener in modo sincrono nell'ordine in cui sono stati registrati. Questo garantisce la corretta sequenza degli eventi e aiuta a evitare race condition ed errori logici. Quando appropriato, le funzioni listener possono passare a una modalità di funzionamento asincrona utilizzando i metodi `setImmediate()` o `process.nextTick()`:

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('questo accade in modo asincrono');
  });
});
myEmitter.emit('event', 'a', 'b');
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('questo accade in modo asincrono');
  });
});
myEmitter.emit('event', 'a', 'b');
```
:::

## Gestire gli eventi una sola volta {#handling-events-only-once}

Quando un listener è registrato utilizzando il metodo `eventEmitter.on()`, quel listener viene invocato *ogni volta* che l'evento denominato viene emesso.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Prints: 2
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Prints: 2
```
:::

Utilizzando il metodo `eventEmitter.once()`, è possibile registrare un listener che viene chiamato al massimo una volta per un particolare evento. Una volta che l'evento viene emesso, il listener viene deregistrato e *poi* chiamato.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Ignored
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Ignored
```
:::


## Eventi di errore {#error-events}

Quando si verifica un errore all'interno di un'istanza di `EventEmitter`, l'azione tipica è l'emissione di un evento `'error'`. Questi sono trattati come casi speciali all'interno di Node.js.

Se un `EventEmitter` *non* ha almeno un listener registrato per l'evento `'error'`, e viene emesso un evento `'error'`, l'errore viene lanciato, viene stampato uno stack trace e il processo Node.js si chiude.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// Lancia un'eccezione e arresta Node.js
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// Lancia un'eccezione e arresta Node.js
```
:::

Per proteggersi dall'arresto anomalo del processo Node.js, è possibile utilizzare il modulo [`domain`](/it/nodejs/api/domain). (Si noti, tuttavia, che il modulo `node:domain` è deprecato.)

Come buona pratica, i listener devono sempre essere aggiunti per gli eventi `'error'`.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// Stampa: whoops! there was an error
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// Stampa: whoops! there was an error
```
:::

È possibile monitorare gli eventi `'error'` senza consumare l'errore emesso installando un listener usando il simbolo `events.errorMonitor`.

::: code-group
```js [ESM]
import { EventEmitter, errorMonitor } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// Lancia ancora un'eccezione e arresta Node.js
```

```js [CJS]
const { EventEmitter, errorMonitor } = require('node:events');

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// Lancia ancora un'eccezione e arresta Node.js
```
:::


## Catturare i rifiuti delle promesse {#capture-rejections-of-promises}

L'uso di funzioni `async` con gestori di eventi è problematico, perché può portare a un rifiuto non gestito in caso di eccezione lanciata:

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();
ee.on('something', async (value) => {
  throw new Error('kaboom');
});
```

```js [CJS]
const EventEmitter = require('node:events');
const ee = new EventEmitter();
ee.on('something', async (value) => {
  throw new Error('kaboom');
});
```
:::

L'opzione `captureRejections` nel costruttore `EventEmitter` o l'impostazione globale modificano questo comportamento, installando un gestore `.then(undefined, handler)` sulla `Promise`. Questo gestore indirizza l'eccezione in modo asincrono al metodo [`Symbol.for('nodejs.rejection')`](/it/nodejs/api/events#emittersymbolfornodejsrejectionerr-eventname-args) se presente, o al gestore di eventi [`'error'`](/it/nodejs/api/events#error-events) se non presente.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const ee1 = new EventEmitter({ captureRejections: true });
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);

const ee2 = new EventEmitter({ captureRejections: true });
ee2.on('something', async (value) => {
  throw new Error('kaboom');
});

ee2[Symbol.for('nodejs.rejection')] = console.log;
```

```js [CJS]
const EventEmitter = require('node:events');
const ee1 = new EventEmitter({ captureRejections: true });
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);

const ee2 = new EventEmitter({ captureRejections: true });
ee2.on('something', async (value) => {
  throw new Error('kaboom');
});

ee2[Symbol.for('nodejs.rejection')] = console.log;
```
:::

Impostare `events.captureRejections = true` cambierà il valore predefinito per tutte le nuove istanze di `EventEmitter`.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

EventEmitter.captureRejections = true;
const ee1 = new EventEmitter();
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);
```

```js [CJS]
const events = require('node:events');
events.captureRejections = true;
const ee1 = new events.EventEmitter();
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);
```
:::

Gli eventi `'error'` che vengono generati dal comportamento `captureRejections` non hanno un gestore catch per evitare loop di errore infiniti: la raccomandazione è di **non usare funzioni <code>async</code> come gestori di eventi <code>'error'</code>**.


## Classe: `EventEmitter` {#class-eventemitter}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.4.0, v12.16.0 | Aggiunta l'opzione captureRejections. |
| v0.1.26 | Aggiunta in: v0.1.26 |
:::

La classe `EventEmitter` è definita ed esposta dal modulo `node:events`:

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
```

```js [CJS]
const EventEmitter = require('node:events');
```
:::

Tutti gli `EventEmitter` emettono l'evento `'newListener'` quando vengono aggiunti nuovi listener e `'removeListener'` quando i listener esistenti vengono rimossi.

Supporta la seguente opzione:

- `captureRejections` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Abilita [l'acquisizione automatica del rifiuto della promessa](/it/nodejs/api/events#capture-rejections-of-promises). **Predefinito:** `false`.

### Evento: `'newListener'` {#event-newlistener}

**Aggiunto in: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Il nome dell'evento in ascolto
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione handler dell'evento

L'istanza `EventEmitter` emetterà il proprio evento `'newListener'` *prima* che un listener venga aggiunto al suo array interno di listener.

Ai listener registrati per l'evento `'newListener'` vengono passati il nome dell'evento e un riferimento al listener che viene aggiunto.

Il fatto che l'evento venga attivato prima di aggiungere il listener ha un effetto collaterale sottile ma importante: qualsiasi listener *aggiuntivo* registrato allo stesso `name` *all'interno* del callback `'newListener'` viene inserito *prima* del listener che è in fase di aggiunta.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// Fallo solo una volta in modo da non andare in loop all'infinito
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // Inserisci un nuovo listener davanti
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// Stampa:
//   B
//   A
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// Fallo solo una volta in modo da non andare in loop all'infinito
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // Inserisci un nuovo listener davanti
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// Stampa:
//   B
//   A
```
:::


### Evento: `'removeListener'` {#event-removelistener}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.1.0, v4.7.0 | Per i listener collegati tramite `.once()`, l'argomento `listener` ora restituisce la funzione listener originale. |
| v0.9.3 | Aggiunto in: v0.9.3 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Il nome dell'evento
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione di gestione dell'evento

L'evento `'removeListener'` viene emesso *dopo* che il `listener` è stato rimosso.

### `emitter.addListener(eventName, listener)` {#emitteraddlistenereventname-listener}

**Aggiunto in: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Alias per `emitter.on(eventName, listener)`.

### `emitter.emit(eventName[, ...args])` {#emitteremiteventname-args}

**Aggiunto in: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Chiama in modo sincrono ciascuno dei listener registrati per l'evento denominato `eventName`, nell'ordine in cui sono stati registrati, passando a ciascuno gli argomenti forniti.

Restituisce `true` se l'evento aveva dei listener, `false` altrimenti.



::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEmitter = new EventEmitter();

// Primo listener
myEmitter.on('event', function firstListener() {
  console.log('Ciao! primo listener');
});
// Secondo listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`evento con parametri ${arg1}, ${arg2} nel secondo listener`);
});
// Terzo listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`evento con parametri ${parameters} nel terzo listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Ciao! primo listener
// evento con parametri 1, 2 nel secondo listener
// evento con parametri 1, 2, 3, 4, 5 nel terzo listener
```

```js [CJS]
const EventEmitter = require('node:events');
const myEmitter = new EventEmitter();

// Primo listener
myEmitter.on('event', function firstListener() {
  console.log('Ciao! primo listener');
});
// Secondo listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`evento con parametri ${arg1}, ${arg2} nel secondo listener`);
});
// Terzo listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`evento con parametri ${parameters} nel terzo listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Ciao! primo listener
// evento con parametri 1, 2 nel secondo listener
// evento con parametri 1, 2, 3, 4, 5 nel terzo listener
```
:::


### `emitter.eventNames()` {#emittereventnames}

**Aggiunto in: v6.0.0**

- Restituisce: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

Restituisce un array elencando gli eventi per i quali l'emettitore ha registrato dei listener. I valori nell'array sono stringhe o `Symbol`.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```

```js [CJS]
const EventEmitter = require('node:events');

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```
:::

### `emitter.getMaxListeners()` {#emittergetmaxlisteners}

**Aggiunto in: v1.0.0**

- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Restituisce il valore massimo attuale del listener per `EventEmitter` che è impostato da [`emitter.setMaxListeners(n)`](/it/nodejs/api/events#emittersetmaxlistenersn) o predefinito a [`events.defaultMaxListeners`](/it/nodejs/api/events#eventsdefaultmaxlisteners).

### `emitter.listenerCount(eventName[, listener])` {#emitterlistenercounteventname-listener}

::: info [Cronologia]
| Versione | Modifiche |
|---|---|
| v19.8.0, v18.16.0 | Aggiunto l'argomento `listener`. |
| v3.2.0 | Aggiunto in: v3.2.0 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Il nome dell'evento in ascolto
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione di gestione dell'evento
- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Restituisce il numero di listener in ascolto dell'evento denominato `eventName`. Se viene fornito `listener`, restituirà quante volte il listener viene trovato nell'elenco dei listener dell'evento.


### `emitter.listeners(eventName)` {#emitterlistenerseventname}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v7.0.0 | Per i listener collegati tramite `.once()` ora restituisce i listener originali invece delle funzioni wrapper. |
| v0.1.26 | Aggiunto in: v0.1.26 |
:::

- `eventName` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<simbolo\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- Restituisce: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Restituisce una copia dell'array di listener per l'evento denominato `eventName`.

```js [ESM]
server.on('connection', (stream) => {
  console.log('qualcuno si è connesso!');
});
console.log(util.inspect(server.listeners('connection')));
// Stampa: [ [Function] ]
```
### `emitter.off(eventName, listener)` {#emitteroffeventname-listener}

**Aggiunto in: v10.0.0**

- `eventName` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<simbolo\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter)

Alias per [`emitter.removeListener()`](/it/nodejs/api/events#emitterremovelistenereventname-listener).

### `emitter.on(eventName, listener)` {#emitteroneventname-listener}

**Aggiunto in: v0.1.101**

- `eventName` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<simbolo\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Il nome dell'evento.
- `listener` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione di callback
- Restituisce: [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter)

Aggiunge la funzione `listener` alla fine dell'array dei listener per l'evento denominato `eventName`. Non vengono effettuati controlli per vedere se il `listener` è già stato aggiunto. Più chiamate che passano la stessa combinazione di `eventName` e `listener` comporteranno l'aggiunta del `listener` e la sua chiamata più volte.

```js [ESM]
server.on('connection', (stream) => {
  console.log('qualcuno si è connesso!');
});
```
Restituisce un riferimento all'`EventEmitter`, in modo che le chiamate possano essere concatenate.

Per impostazione predefinita, i listener degli eventi vengono richiamati nell'ordine in cui vengono aggiunti. Il metodo `emitter.prependListener()` può essere utilizzato in alternativa per aggiungere il listener dell'evento all'inizio dell'array dei listener.



::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Stampa:
//   b
//   a
```

```js [CJS]
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Stampa:
//   b
//   a
```
:::


### `emitter.once(eventName, listener)` {#emitteronceeventname-listener}

**Aggiunto in: v0.3.0**

- `eventName` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<simbolo\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Il nome dell'evento.
- `listener` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione di callback
- Restituisce: [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter)

Aggiunge una funzione `listener` **una tantum** per l'evento chiamato `eventName`. La prossima volta che `eventName` viene attivato, questo listener viene rimosso e quindi invocato.

```js [ESM]
server.once('connection', (stream) => {
  console.log('Ah, abbiamo il nostro primo utente!');
});
```
Restituisce un riferimento a `EventEmitter`, in modo che le chiamate possano essere concatenate.

Per impostazione predefinita, i listener di eventi vengono invocati nell'ordine in cui vengono aggiunti. Il metodo `emitter.prependOnceListener()` può essere utilizzato come alternativa per aggiungere il listener di eventi all'inizio dell'array dei listener.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Stampa:
//   b
//   a
```

```js [CJS]
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Stampa:
//   b
//   a
```
:::

### `emitter.prependListener(eventName, listener)` {#emitterprependlistenereventname-listener}

**Aggiunto in: v6.0.0**

- `eventName` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<simbolo\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Il nome dell'evento.
- `listener` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione di callback
- Restituisce: [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter)

Aggiunge la funzione `listener` all'inizio dell'array di listener per l'evento chiamato `eventName`. Non vengono eseguiti controlli per verificare se il `listener` è già stato aggiunto. Più chiamate che passano la stessa combinazione di `eventName` e `listener` comporteranno l'aggiunta e la chiamata del `listener` più volte.

```js [ESM]
server.prependListener('connection', (stream) => {
  console.log('qualcuno si è connesso!');
});
```
Restituisce un riferimento a `EventEmitter`, in modo che le chiamate possano essere concatenate.


### `emitter.prependOnceListener(eventName, listener)` {#emitterprependoncelistenereventname-listener}

**Aggiunto in: v6.0.0**

- `eventName` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<simbolo\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Il nome dell'evento.
- `listener` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione di callback
- Restituisce: [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter)

Aggiunge una funzione `listener` **una-tantum** per l'evento denominato `eventName` all'inizio dell'array dei listener. La prossima volta che `eventName` viene attivato, questo listener viene rimosso, e quindi invocato.

```js [ESM]
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, abbiamo il nostro primo utente!');
});
```
Restituisce un riferimento all'`EventEmitter`, in modo che le chiamate possano essere concatenate.

### `emitter.removeAllListeners([eventName])` {#emitterremovealllistenerseventname}

**Aggiunto in: v0.1.26**

- `eventName` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<simbolo\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- Restituisce: [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter)

Rimuove tutti i listener, o quelli dello specifico `eventName`.

È una cattiva pratica rimuovere i listener aggiunti altrove nel codice, in particolare quando l'istanza di `EventEmitter` è stata creata da qualche altro componente o modulo (ad esempio socket o flussi di file).

Restituisce un riferimento all'`EventEmitter`, in modo che le chiamate possano essere concatenate.

### `emitter.removeListener(eventName, listener)` {#emitterremovelistenereventname-listener}

**Aggiunto in: v0.1.26**

- `eventName` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<simbolo\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter)

Rimuove lo specifico `listener` dall'array dei listener per l'evento denominato `eventName`.

```js [ESM]
const callback = (stream) => {
  console.log('qualcuno si è connesso!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```
`removeListener()` rimuoverà, al massimo, un'istanza di un listener dall'array dei listener. Se un qualsiasi singolo listener è stato aggiunto più volte all'array dei listener per lo specifico `eventName`, allora `removeListener()` deve essere chiamato più volte per rimuovere ciascuna istanza.

Una volta che un evento viene emesso, tutti i listener ad esso collegati al momento dell'emissione vengono chiamati in ordine. Ciò implica che qualsiasi chiamata a `removeListener()` o `removeAllListeners()` *dopo* l'emissione e *prima* che l'ultimo listener termini l'esecuzione non li rimuoverà da `emit()` in corso. Gli eventi successivi si comportano come previsto.



::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA rimuove il listener callbackB ma verrà comunque chiamato.
// Array di listener interno al momento dell'emissione [callbackA, callbackB]
myEmitter.emit('event');
// Stampa:
//   A
//   B

// callbackB è ora rimosso.
// Array di listener interno [callbackA]
myEmitter.emit('event');
// Stampa:
//   A
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA rimuove il listener callbackB ma verrà comunque chiamato.
// Array di listener interno al momento dell'emissione [callbackA, callbackB]
myEmitter.emit('event');
// Stampa:
//   A
//   B

// callbackB è ora rimosso.
// Array di listener interno [callbackA]
myEmitter.emit('event');
// Stampa:
//   A
```
:::

Poiché i listener vengono gestiti utilizzando un array interno, chiamare questo cambierà gli indici di posizione di qualsiasi listener registrato *dopo* il listener che viene rimosso. Ciò non influirà sull'ordine in cui vengono chiamati i listener, ma significa che qualsiasi copia dell'array dei listener come restituito dal metodo `emitter.listeners()` dovrà essere ricreata.

Quando una singola funzione è stata aggiunta come gestore più volte per un singolo evento (come nell'esempio seguente), `removeListener()` rimuoverà l'istanza aggiunta più di recente. Nell'esempio viene rimosso il listener `once('ping')`:



::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```

```js [CJS]
const EventEmitter = require('node:events');
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```
:::

Restituisce un riferimento all'`EventEmitter`, in modo che le chiamate possano essere concatenate.


### `emitter.setMaxListeners(n)` {#emittersetmaxlistenersn}

**Aggiunto in: v0.3.5**

- `n` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Restituisce: [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter)

Per impostazione predefinita, gli `EventEmitter` stamperanno un avviso se vengono aggiunti più di `10` listener per un evento specifico. Questo è un valore predefinito utile che aiuta a trovare perdite di memoria. Il metodo `emitter.setMaxListeners()` consente di modificare il limite per questa specifica istanza di `EventEmitter`. Il valore può essere impostato su `Infinity` (o `0`) per indicare un numero illimitato di listener.

Restituisce un riferimento all'`EventEmitter`, in modo che le chiamate possano essere concatenate.

### `emitter.rawListeners(eventName)` {#emitterrawlistenerseventname}

**Aggiunto in: v9.4.0**

- `eventName` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<simbolo\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- Restituisce: [\<Funzione[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Restituisce una copia dell'array di listener per l'evento denominato `eventName`, inclusi eventuali wrapper (come quelli creati da `.once()`).

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Restituisce un nuovo Array con una funzione `onceWrapper` che ha una proprietà
// `listener` che contiene il listener originale associato sopra
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Registra "log once" sulla console e non scollega l'evento `once`
logFnWrapper.listener();

// Registra "log once" sulla console e rimuove il listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Restituirà un nuovo Array con una singola funzione associata da `.on()` sopra
const newListeners = emitter.rawListeners('log');

// Registra "log persistently" due volte
newListeners[0]();
emitter.emit('log');
```

```js [CJS]
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Restituisce un nuovo Array con una funzione `onceWrapper` che ha una proprietà
// `listener` che contiene il listener originale associato sopra
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Registra "log once" sulla console e non scollega l'evento `once`
logFnWrapper.listener();

// Registra "log once" sulla console e rimuove il listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Restituirà un nuovo Array con una singola funzione associata da `.on()` sopra
const newListeners = emitter.rawListeners('log');

// Registra "log persistently" due volte
newListeners[0]();
emitter.emit('log');
```
:::


### `emitter[Symbol.for('nodejs.rejection')](err, eventName[, ...args])` {#emittersymbolfornodejsrejectionerr-eventname-args}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.4.0, v16.14.0 | Non più sperimentale. |
| v13.4.0, v12.16.0 | Aggiunto in: v13.4.0, v12.16.0 |
:::

- `err` Errore
- `eventName` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<simbolo\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `...args` [\<qualsiasi\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Il metodo `Symbol.for('nodejs.rejection')` viene chiamato nel caso in cui si verifichi un rifiuto di una promise durante l'emissione di un evento e [`captureRejections`](/it/nodejs/api/events#capture-rejections-of-promises) sia abilitato sull'emettitore. È possibile utilizzare [`events.captureRejectionSymbol`](/it/nodejs/api/events#eventscapturerejectionsymbol) al posto di `Symbol.for('nodejs.rejection')`.

::: code-group
```js [ESM]
import { EventEmitter, captureRejectionSymbol } from 'node:events';

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('si è verificato un rifiuto per', event, 'con', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Abbattere la risorsa qui.
  }
}
```

```js [CJS]
const { EventEmitter, captureRejectionSymbol } = require('node:events');

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('si è verificato un rifiuto per', event, 'con', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Abbattere la risorsa qui.
  }
}
```
:::

## `events.defaultMaxListeners` {#eventsdefaultmaxlisteners}

**Aggiunto in: v0.11.2**

Per impostazione predefinita, è possibile registrare un massimo di `10` listener per un singolo evento. Questo limite può essere modificato per le singole istanze di `EventEmitter` utilizzando il metodo [`emitter.setMaxListeners(n)`](/it/nodejs/api/events#emittersetmaxlistenersn). Per modificare il valore predefinito per *tutte* le istanze di `EventEmitter`, è possibile utilizzare la proprietà `events.defaultMaxListeners`. Se questo valore non è un numero positivo, viene generato un `RangeError`.

Prestare attenzione quando si imposta `events.defaultMaxListeners` perché la modifica influisce su *tutte* le istanze di `EventEmitter`, comprese quelle create prima che la modifica venga apportata. Tuttavia, la chiamata a [`emitter.setMaxListeners(n)`](/it/nodejs/api/events#emittersetmaxlistenersn) ha comunque la precedenza su `events.defaultMaxListeners`.

Questo non è un limite rigido. L'istanza di `EventEmitter` consentirà l'aggiunta di più listener, ma emetterà un avviso di traccia su stderr indicando che è stata rilevata una "possibile perdita di memoria di EventEmitter". Per qualsiasi singolo `EventEmitter`, i metodi `emitter.getMaxListeners()` e `emitter.setMaxListeners()` possono essere utilizzati per evitare temporaneamente questo avviso:

`defaultMaxListeners` non ha effetto sulle istanze di `AbortSignal`. Sebbene sia ancora possibile utilizzare [`emitter.setMaxListeners(n)`](/it/nodejs/api/events#emittersetmaxlistenersn) per impostare un limite di avviso per le singole istanze di `AbortSignal`, per impostazione predefinita le istanze di `AbortSignal` non avviseranno.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // fare qualcosa
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```

```js [CJS]
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // fare qualcosa
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```
:::

Il flag della riga di comando [`--trace-warnings`](/it/nodejs/api/cli#--trace-warnings) può essere utilizzato per visualizzare la traccia dello stack per tali avvisi.

L'avviso emesso può essere ispezionato con [`process.on('warning')`](/it/nodejs/api/process#event-warning) e avrà le proprietà aggiuntive `emitter`, `type` e `count`, che si riferiscono rispettivamente all'istanza dell'emettitore di eventi, al nome dell'evento e al numero di listener collegati. La sua proprietà `name` è impostata su `'MaxListenersExceededWarning'`.


## `events.errorMonitor` {#eventserrormonitor}

**Aggiunto in: v13.6.0, v12.17.0**

Questo simbolo deve essere utilizzato per installare un listener solo per il monitoraggio degli eventi `'error'`. I listener installati utilizzando questo simbolo vengono chiamati prima dei normali listener `'error'`.

L'installazione di un listener tramite questo simbolo non modifica il comportamento una volta emesso un evento `'error'`. Pertanto, il processo si arresterà comunque in modo anomalo se non è installato alcun listener `'error'` regolare.

## `events.getEventListeners(emitterOrTarget, eventName)` {#eventsgeteventlistenersemitterortarget-eventname}

**Aggiunto in: v15.2.0, v14.17.0**

- `emitterOrTarget` [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter) | [\<EventTarget\>](/it/nodejs/api/events#class-eventtarget)
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- Restituisce: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Restituisce una copia dell'array di listener per l'evento denominato `eventName`.

Per `EventEmitter` si comporta esattamente come chiamare `.listeners` sull'emitter.

Per `EventTarget` questo è l'unico modo per ottenere i listener dell'evento per il target dell'evento. Questo è utile per il debug e la diagnostica.

::: code-group
```js [ESM]
import { getEventListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
```

```js [CJS]
const { getEventListeners, EventEmitter } = require('node:events');

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
```
:::


## `events.getMaxListeners(emitterOrTarget)` {#eventsgetmaxlistenersemitterortarget}

**Aggiunto in: v19.9.0, v18.17.0**

- `emitterOrTarget` [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter) | [\<EventTarget\>](/it/nodejs/api/events#class-eventtarget)
- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Restituisce la quantità massima di listener attualmente impostata.

Per gli `EventEmitter`, questo si comporta esattamente come chiamare `.getMaxListeners` sull'emitter.

Per gli `EventTarget`, questo è l'unico modo per ottenere il numero massimo di listener di eventi per l'event target. Se il numero di gestori di eventi su un singolo EventTarget supera il massimo impostato, l'EventTarget stamperà un avviso.

::: code-group
```js [ESM]
import { getMaxListeners, setMaxListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
```

```js [CJS]
const { getMaxListeners, setMaxListeners, EventEmitter } = require('node:events');

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
```
:::

## `events.once(emitter, name[, options])` {#eventsonceemitter-name-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | L'opzione `signal` è ora supportata. |
| v11.13.0, v10.16.0 | Aggiunto in: v11.13.0, v10.16.0 |
:::

- `emitter` [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter)
- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Può essere utilizzato per annullare l'attesa per l'evento.
  
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Crea una `Promise` che viene soddisfatta quando l'`EventEmitter` emette l'evento specificato o che viene rifiutata se l'`EventEmitter` emette `'error'` durante l'attesa. La `Promise` si risolverà con un array di tutti gli argomenti emessi all'evento specificato.

Questo metodo è intenzionalmente generico e funziona con l'interfaccia [EventTarget](https://dom.spec.whatwg.org/#interface-eventtarget) della piattaforma web, che non ha una semantica speciale per l'evento `'error'` e non ascolta l'evento `'error'`.

::: code-group
```js [ESM]
import { once, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

process.nextTick(() => {
  ee.emit('myevent', 42);
});

const [value] = await once(ee, 'myevent');
console.log(value);

const err = new Error('kaboom');
process.nextTick(() => {
  ee.emit('error', err);
});

try {
  await once(ee, 'myevent');
} catch (err) {
  console.error('error happened', err);
}
```

```js [CJS]
const { once, EventEmitter } = require('node:events');

async function run() {
  const ee = new EventEmitter();

  process.nextTick(() => {
    ee.emit('myevent', 42);
  });

  const [value] = await once(ee, 'myevent');
  console.log(value);

  const err = new Error('kaboom');
  process.nextTick(() => {
    ee.emit('error', err);
  });

  try {
    await once(ee, 'myevent');
  } catch (err) {
    console.error('error happened', err);
  }
}

run();
```
:::

La gestione speciale dell'evento `'error'` viene utilizzata solo quando `events.once()` viene utilizzato per attendere un altro evento. Se `events.once()` viene utilizzato per attendere l'evento '`error`' stesso, allora viene trattato come qualsiasi altro tipo di evento senza una gestione speciale:

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```
:::

Un [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) può essere utilizzato per annullare l'attesa per l'evento:

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Prints: Waiting for the event was canceled!
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Prints: Waiting for the event was canceled!
```
:::


### Attesa di molteplici eventi emessi su `process.nextTick()` {#awaiting-multiple-events-emitted-on-processnexttick}

Esiste un caso limite degno di nota quando si utilizza la funzione `events.once()` per attendere più eventi emessi nello stesso batch di operazioni `process.nextTick()`, o ogni volta che più eventi vengono emessi in modo sincrono. In particolare, poiché la coda `process.nextTick()` viene svuotata prima della coda dei microtask `Promise`, e poiché `EventEmitter` emette tutti gli eventi in modo sincrono, è possibile che `events.once()` perda un evento.

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';
import process from 'node:process';

const myEE = new EventEmitter();

async function foo() {
  await once(myEE, 'bar');
  console.log('bar');

  // Questa Promise non si risolverà mai perché l'evento 'foo' sarà
  // già stato emesso prima che la Promise venga creata.
  await once(myEE, 'foo');
  console.log('foo');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const myEE = new EventEmitter();

async function foo() {
  await once(myEE, 'bar');
  console.log('bar');

  // Questa Promise non si risolverà mai perché l'evento 'foo' sarà
  // già stato emesso prima che la Promise venga creata.
  await once(myEE, 'foo');
  console.log('foo');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```
:::

Per intercettare entrambi gli eventi, crea ciascuna delle Promise *prima* di attenderne una qualsiasi, quindi diventa possibile utilizzare `Promise.all()`, `Promise.race()` o `Promise.allSettled()`:

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';
import process from 'node:process';

const myEE = new EventEmitter();

async function foo() {
  await Promise.all([once(myEE, 'bar'), once(myEE, 'foo')]);
  console.log('foo', 'bar');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const myEE = new EventEmitter();

async function foo() {
  await Promise.all([once(myEE, 'bar'), once(myEE, 'foo')]);
  console.log('foo', 'bar');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```
:::


## `events.captureRejections` {#eventscapturerejections}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.4.0, v16.14.0 | Non più sperimentale. |
| v13.4.0, v12.16.0 | Aggiunto in: v13.4.0, v12.16.0 |
:::

Valore: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Cambia l'opzione predefinita `captureRejections` su tutti i nuovi oggetti `EventEmitter`.

## `events.captureRejectionSymbol` {#eventscapturerejectionsymbol}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.4.0, v16.14.0 | Non più sperimentale. |
| v13.4.0, v12.16.0 | Aggiunto in: v13.4.0, v12.16.0 |
:::

Valore: `Symbol.for('nodejs.rejection')`

Vedi come scrivere un [gestore di reiezione](/it/nodejs/api/events#emittersymbolfornodejsrejectionerr-eventname-args) personalizzato.

## `events.listenerCount(emitter, eventName)` {#eventslistenercountemitter-eventname}

**Aggiunto in: v0.9.12**

**Deprecato dal: v3.2.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato: Utilizza invece [`emitter.listenerCount()`](/it/nodejs/api/events#emitterlistenercounteventname-listener).
:::

- `emitter` [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter) L'emettitore da interrogare
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Il nome dell'evento

Un metodo di classe che restituisce il numero di listener per l'`eventName` dato registrato sull'`emitter` dato.

::: code-group
```js [ESM]
import { EventEmitter, listenerCount } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Prints: 2
```

```js [CJS]
const { EventEmitter, listenerCount } = require('node:events');

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Prints: 2
```
:::


## `events.on(emitter, eventName[, options])` {#eventsonemitter-eventname-options}

::: info [Cronologia]
| Versione | Modifiche                                                                                                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| v22.0.0, v20.13.0 | Supporta le opzioni `highWaterMark` e `lowWaterMark`, per coerenza. Le vecchie opzioni sono ancora supportate.                                                                                               |
| v20.0.0 | Le opzioni `close`, `highWatermark` e `lowWatermark` sono ora supportate.                                                                                                              |
| v13.6.0, v12.16.0 | Aggiunto in: v13.6.0, v12.16.0                                                                                                                                     |
:::

- `emitter` [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter)
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Il nome dell'evento in ascolto
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Può essere usato per annullare gli eventi in attesa.
    - `close` - [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nomi di eventi che termineranno l'iterazione.
    - `highWaterMark` - [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `Number.MAX_SAFE_INTEGER` Il limite massimo. L'emettitore viene messo in pausa ogni volta che la dimensione degli eventi in buffer è superiore a questo valore. Supportato solo sugli emettitori che implementano i metodi `pause()` e `resume()`.
    - `lowWaterMark` - [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `1` Il limite inferiore. L'emettitore viene ripreso ogni volta che la dimensione degli eventi in buffer è inferiore a questo valore. Supportato solo sugli emettitori che implementano i metodi `pause()` e `resume()`.


- Restituisce: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) che itera sugli eventi `eventName` emessi dall'`emitter`

::: code-group
```js [ESM]
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

// Emetti più tardi
process.nextTick(() => {
  ee.emit('foo', 'bar');
  ee.emit('foo', 42);
});

for await (const event of on(ee, 'foo')) {
  // L'esecuzione di questo blocco interno è sincrona ed elabora
  // un evento alla volta (anche con await). Non usare
  // se è richiesta l'esecuzione concorrente.
  console.log(event); // stampa ['bar'] [42]
}
// Irraggiungibile qui
```

```js [CJS]
const { on, EventEmitter } = require('node:events');

(async () => {
  const ee = new EventEmitter();

  // Emetti più tardi
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo')) {
    // L'esecuzione di questo blocco interno è sincrona ed elabora
    // un evento alla volta (anche con await). Non usare
    // se è richiesta l'esecuzione concorrente.
    console.log(event); // stampa ['bar'] [42]
  }
  // Irraggiungibile qui
})();
```
:::

Restituisce un `AsyncIterator` che itera sugli eventi `eventName`. Verrà generata un'eccezione se l'`EventEmitter` emette `'error'`. Rimuove tutti i listener quando si esce dal loop. Il `value` restituito da ogni iterazione è un array composto dagli argomenti dell'evento emesso.

Un [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) può essere utilizzato per annullare l'attesa degli eventi:

::: code-group
```js [ESM]
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Emetti più tardi
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // L'esecuzione di questo blocco interno è sincrona ed elabora
    // un evento alla volta (anche con await). Non usare
    // se è richiesta l'esecuzione concorrente.
    console.log(event); // stampa ['bar'] [42]
  }
  // Irraggiungibile qui
})();

process.nextTick(() => ac.abort());
```

```js [CJS]
const { on, EventEmitter } = require('node:events');

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Emetti più tardi
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // L'esecuzione di questo blocco interno è sincrona ed elabora
    // un evento alla volta (anche con await). Non usare
    // se è richiesta l'esecuzione concorrente.
    console.log(event); // stampa ['bar'] [42]
  }
  // Irraggiungibile qui
})();

process.nextTick(() => ac.abort());
```
:::


## `events.setMaxListeners(n[, ...eventTargets])` {#eventssetmaxlistenersn-eventtargets}

**Aggiunto in: v15.4.0**

- `n` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un numero non negativo. Il numero massimo di listener per evento `EventTarget`.
- `...eventsTargets` [\<EventTarget[]\>](/it/nodejs/api/events#class-eventtarget) | [\<EventEmitter[]\>](/it/nodejs/api/events#class-eventemitter) Zero o più istanze di [\<EventTarget\>](/it/nodejs/api/events#class-eventtarget) o [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter). Se non ne vengono specificate, `n` viene impostato come valore massimo predefinito per tutti gli oggetti [\<EventTarget\>](/it/nodejs/api/events#class-eventtarget) e [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter) appena creati.

::: code-group
```js [ESM]
import { setMaxListeners, EventEmitter } from 'node:events';

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```

```js [CJS]
const {
  setMaxListeners,
  EventEmitter,
} = require('node:events');

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```
:::

## `events.addAbortListener(signal, listener)` {#eventsaddabortlistenersignal-listener}

**Aggiunto in: v20.5.0, v18.18.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/it/nodejs/api/events#event-listener)
- Restituisce: [\<Disposable\>](https://tc39.es/proposal-explicit-resource-management/#sec-disposable-interface) Un Disposable che rimuove il listener `abort`.

Ascolta una volta l'evento `abort` sul `signal` fornito.

Ascoltare l'evento `abort` sui segnali di interruzione non è sicuro e può portare a perdite di risorse poiché un'altra terza parte con il segnale può chiamare [`e.stopImmediatePropagation()`](/it/nodejs/api/events#eventstopimmediatepropagation). Sfortunatamente Node.js non può cambiarlo poiché violerebbe lo standard web. Inoltre, l'API originale rende facile dimenticare di rimuovere i listener.

Questa API consente di utilizzare in modo sicuro gli `AbortSignal` nelle API di Node.js risolvendo questi due problemi ascoltando l'evento in modo tale che `stopImmediatePropagation` non impedisca l'esecuzione del listener.

Restituisce un disposable in modo che possa essere disiscritta più facilmente.

::: code-group
```js [CJS]
const { addAbortListener } = require('node:events');

function example(signal) {
  let disposable;
  try {
    signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
    disposable = addAbortListener(signal, (e) => {
      // Do something when signal is aborted.
    });
  } finally {
    disposable?.[Symbol.dispose]();
  }
}
```

```js [ESM]
import { addAbortListener } from 'node:events';

function example(signal) {
  let disposable;
  try {
    signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
    disposable = addAbortListener(signal, (e) => {
      // Do something when signal is aborted.
    });
  } finally {
    disposable?.[Symbol.dispose]();
  }
}
```
:::


## Classe: `events.EventEmitterAsyncResource extends EventEmitter` {#class-eventseventemitterasyncresource-extends-eventemitter}

**Aggiunto in: v17.4.0, v16.14.0**

Integra `EventEmitter` con [\<AsyncResource\>](/it/nodejs/api/async_hooks#class-asyncresource) per `EventEmitter` che richiedono il tracciamento asincrono manuale. Nello specifico, tutti gli eventi emessi dalle istanze di `events.EventEmitterAsyncResource` verranno eseguiti all'interno del suo [contesto asincrono](/it/nodejs/api/async_context).

::: code-group
```js [ESM]
import { EventEmitterAsyncResource, EventEmitter } from 'node:events';
import { notStrictEqual, strictEqual } from 'node:assert';
import { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

// Gli strumenti di tracciamento asincrono lo identificheranno come 'Q'.
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// I listener 'foo' verranno eseguiti nel contesto asincrono degli EventEmitter.
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// I listener 'foo' su EventEmitter ordinari che non tracciano il contesto
// asincrono, tuttavia, vengono eseguiti nello stesso contesto asincrono di emit().
ee2.on('foo', () => {
  notStrictEqual(executionAsyncId(), ee2.asyncId);
  notStrictEqual(triggerAsyncId(), ee2.triggerAsyncId);
});

Promise.resolve().then(() => {
  ee1.emit('foo');
  ee2.emit('foo');
});
```

```js [CJS]
const { EventEmitterAsyncResource, EventEmitter } = require('node:events');
const { notStrictEqual, strictEqual } = require('node:assert');
const { executionAsyncId, triggerAsyncId } = require('node:async_hooks');

// Gli strumenti di tracciamento asincrono lo identificheranno come 'Q'.
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// I listener 'foo' verranno eseguiti nel contesto asincrono degli EventEmitter.
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// I listener 'foo' su EventEmitter ordinari che non tracciano il contesto
// asincrono, tuttavia, vengono eseguiti nello stesso contesto asincrono di emit().
ee2.on('foo', () => {
  notStrictEqual(executionAsyncId(), ee2.asyncId);
  notStrictEqual(triggerAsyncId(), ee2.triggerAsyncId);
});

Promise.resolve().then(() => {
  ee1.emit('foo');
  ee2.emit('foo');
});
```
:::

La classe `EventEmitterAsyncResource` ha gli stessi metodi e accetta le stesse opzioni di `EventEmitter` e `AsyncResource` stessi.


### `new events.EventEmitterAsyncResource([options])` {#new-eventseventemitterasyncresourceoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `captureRejections` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Abilita [l'acquisizione automatica del rifiuto delle promise](/it/nodejs/api/events#capture-rejections-of-promises). **Predefinito:** `false`.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il tipo di evento asincrono. **Predefinito:** [`new.target.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target).
    - `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID del contesto di esecuzione che ha creato questo evento asincrono. **Predefinito:** `executionAsyncId()`.
    - `requireManualDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su `true`, disabilita `emitDestroy` quando l'oggetto viene raccolto dal Garbage Collector. Di solito non è necessario impostarlo (anche se `emitDestroy` viene chiamato manualmente), a meno che l'`asyncId` della risorsa non venga recuperato e venga chiamata la `emitDestroy` dell'API sensibile con esso. Quando impostato su `false`, la chiamata `emitDestroy` sul Garbage Collection avverrà solo se è presente almeno un hook `destroy` attivo. **Predefinito:** `false`.
  
 

### `eventemitterasyncresource.asyncId` {#eventemitterasyncresourceasyncid}

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'`asyncId` univoco assegnato alla risorsa.

### `eventemitterasyncresource.asyncResource` {#eventemitterasyncresourceasyncresource}

- Tipo: [\<AsyncResource\>](/it/nodejs/api/async_hooks#class-asyncresource) sottostante.

L'oggetto `AsyncResource` restituito ha una proprietà `eventEmitter` aggiuntiva che fornisce un riferimento a questo `EventEmitterAsyncResource`.

### `eventemitterasyncresource.emitDestroy()` {#eventemitterasyncresourceemitdestroy}

Chiama tutti gli hook `destroy`. Questo dovrebbe essere chiamato solo una volta. Verrà generato un errore se viene chiamato più di una volta. Questo **deve** essere chiamato manualmente. Se la risorsa viene lasciata alla raccolta da parte del GC, gli hook `destroy` non verranno mai chiamati.


### `eventemitterasyncresource.triggerAsyncId` {#eventemitterasyncresourcetriggerasyncid}

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Lo stesso `triggerAsyncId` passato al costruttore di `AsyncResource`.

## API `EventTarget` ed `Event` {#eventtarget-and-event-api}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.0.0 | Gestione degli errori di EventTarget modificata. |
| v15.4.0 | Non più sperimentale. |
| v15.0.0 | Le classi `EventTarget` ed `Event` sono ora disponibili come globali. |
| v14.5.0 | Aggiunto in: v14.5.0 |
:::

Gli oggetti `EventTarget` ed `Event` sono un'implementazione specifica di Node.js della [`EventTarget` Web API](https://dom.spec.whatwg.org/#eventtarget) che sono esposti da alcune API principali di Node.js.

```js [ESM]
const target = new EventTarget();

target.addEventListener('foo', (event) => {
  console.log('evento foo accaduto!');
});
```
### `EventTarget` di Node.js contro `EventTarget` DOM {#nodejs-eventtarget-vs-dom-eventtarget}

Ci sono due differenze fondamentali tra `EventTarget` di Node.js e la [`EventTarget` Web API](https://dom.spec.whatwg.org/#eventtarget):

### `NodeEventTarget` contro `EventEmitter` {#nodeeventtarget-vs-eventemitter}

L'oggetto `NodeEventTarget` implementa un sottoinsieme modificato dell'API `EventEmitter` che gli consente di *emulare* da vicino un `EventEmitter` in determinate situazioni. Un `NodeEventTarget` *non* è un'istanza di `EventEmitter` e non può essere utilizzato al posto di un `EventEmitter` nella maggior parte dei casi.

### Listener di eventi {#event-listener}

I listener di eventi registrati per un `type` di evento possono essere funzioni JavaScript o oggetti con una proprietà `handleEvent` il cui valore è una funzione.

In entrambi i casi, la funzione handler viene invocata con l'argomento `event` passato alla funzione `eventTarget.dispatchEvent()`.

Le funzioni asincrone possono essere utilizzate come listener di eventi. Se una funzione handler asincrona viene rifiutata, il rifiuto viene acquisito e gestito come descritto in [gestione degli errori di `EventTarget`](/it/nodejs/api/events#eventtarget-error-handling).

Un errore generato da una funzione handler non impedisce l'invocazione degli altri handler.

Il valore restituito di una funzione handler viene ignorato.

Gli handler vengono sempre invocati nell'ordine in cui sono stati aggiunti.

Le funzioni handler possono mutare l'oggetto `event`.

```js [ESM]
function handler1(event) {
  console.log(event.type);  // Stampa 'foo'
  event.a = 1;
}

async function handler2(event) {
  console.log(event.type);  // Stampa 'foo'
  console.log(event.a);  // Stampa 1
}

const handler3 = {
  handleEvent(event) {
    console.log(event.type);  // Stampa 'foo'
  },
};

const handler4 = {
  async handleEvent(event) {
    console.log(event.type);  // Stampa 'foo'
  },
};

const target = new EventTarget();

target.addEventListener('foo', handler1);
target.addEventListener('foo', handler2);
target.addEventListener('foo', handler3);
target.addEventListener('foo', handler4, { once: true });
```

### Gestione degli errori in `EventTarget` {#eventtarget-error-handling}

Quando un listener di eventi registrato genera un'eccezione (o restituisce una Promise che viene rifiutata), per impostazione predefinita l'errore viene trattato come un'eccezione non gestita su `process.nextTick()`. Ciò significa che le eccezioni non gestite in `EventTarget` termineranno il processo di Node.js per impostazione predefinita.

Generare un'eccezione all'interno di un listener di eventi *non* impedirà l'invocazione degli altri handler registrati.

`EventTarget` non implementa alcuna gestione predefinita speciale per gli eventi di tipo `'error'` come `EventEmitter`.

Attualmente, gli errori vengono prima inoltrati all'evento `process.on('error')` prima di raggiungere `process.on('uncaughtException')`. Questo comportamento è deprecato e cambierà in una versione futura per allineare `EventTarget` con altre API di Node.js. Qualsiasi codice che si basa sull'evento `process.on('error')` deve essere allineato al nuovo comportamento.

### Classe: `Event` {#class-event}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | La classe `Event` è ora disponibile tramite l'oggetto globale. |
| v14.5.0 | Aggiunta in: v14.5.0 |
:::

L'oggetto `Event` è un adattamento della [`Event` Web API](https://dom.spec.whatwg.org/#event). Le istanze vengono create internamente da Node.js.

#### `event.bubbles` {#eventbubbles}

**Aggiunta in: v14.5.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Restituisce sempre `false`.

Questo non viene utilizzato in Node.js ed è fornito puramente per completezza.

#### `event.cancelBubble` {#eventcancelbubble}

**Aggiunta in: v14.5.0**

::: info [Stabile: 3 - Legacy]
[Stabile: 3](/it/nodejs/api/documentation#stability-index) [Stabilità: 3](/it/nodejs/api/documentation#stability-index) - Legacy: utilizzare [`event.stopPropagation()`](/it/nodejs/api/events#eventstoppropagation) invece.
:::

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Alias per `event.stopPropagation()` se impostato su `true`. Questo non viene utilizzato in Node.js ed è fornito puramente per completezza.

#### `event.cancelable` {#eventcancelable}

**Aggiunta in: v14.5.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) True se l'evento è stato creato con l'opzione `cancelable`.


#### `event.composed` {#eventcomposed}

**Aggiunto in: v14.5.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Restituisce sempre `false`.

Questo non è utilizzato in Node.js ed è fornito puramente per completezza.

#### `event.composedPath()` {#eventcomposedpath}

**Aggiunto in: v14.5.0**

Restituisce un array contenente l'`EventTarget` corrente come unica voce o vuoto se l'evento non viene distribuito. Questo non è utilizzato in Node.js ed è fornito puramente per completezza.

#### `event.currentTarget` {#eventcurrenttarget}

**Aggiunto in: v14.5.0**

- Tipo: [\<EventTarget\>](/it/nodejs/api/events#class-eventtarget) L'`EventTarget` che distribuisce l'evento.

Alias per `event.target`.

#### `event.defaultPrevented` {#eventdefaultprevented}

**Aggiunto in: v14.5.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

È `true` se `cancelable` è `true` e `event.preventDefault()` è stato chiamato.

#### `event.eventPhase` {#eventeventphase}

**Aggiunto in: v14.5.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Restituisce `0` mentre un evento non viene distribuito, `2` mentre viene distribuito.

Questo non è utilizzato in Node.js ed è fornito puramente per completezza.

#### `event.initEvent(type[, bubbles[, cancelable]])` {#eventiniteventtype-bubbles-cancelable}

**Aggiunto in: v19.5.0**

::: info [Stabile: 3 - Legacy]
[Stabile: 3](/it/nodejs/api/documentation#stability-index) [Stabilità: 3](/it/nodejs/api/documentation#stability-index) - Legacy: La specifica WHATWG lo considera deprecato e gli utenti non dovrebbero usarlo affatto.
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `bubbles` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `cancelable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ridondante con i costruttori di eventi e incapace di impostare `composed`. Questo non è utilizzato in Node.js ed è fornito puramente per completezza.

#### `event.isTrusted` {#eventistrusted}

**Aggiunto in: v14.5.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

L'evento `"abort"` di [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) viene emesso con `isTrusted` impostato su `true`. Il valore è `false` in tutti gli altri casi.


#### `event.preventDefault()` {#eventpreventdefault}

**Aggiunto in: v14.5.0**

Imposta la proprietà `defaultPrevented` su `true` se `cancelable` è `true`.

#### `event.returnValue` {#eventreturnvalue}

**Aggiunto in: v14.5.0**

::: info [Stabile: 3 - Legacy]
[Stabile: 3](/it/nodejs/api/documentation#stability-index) [Stabilità: 3](/it/nodejs/api/documentation#stability-index) - Legacy: Utilizzare invece [`event.defaultPrevented`](/it/nodejs/api/events#eventdefaultprevented).
:::

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) True se l'evento non è stato annullato.

Il valore di `event.returnValue` è sempre l'opposto di `event.defaultPrevented`. Questo non viene utilizzato in Node.js ed è fornito puramente a scopo di completezza.

#### `event.srcElement` {#eventsrcelement}

**Aggiunto in: v14.5.0**

::: info [Stabile: 3 - Legacy]
[Stabile: 3](/it/nodejs/api/documentation#stability-index) [Stabilità: 3](/it/nodejs/api/documentation#stability-index) - Legacy: Utilizzare invece [`event.target`](/it/nodejs/api/events#eventtarget).
:::

- Tipo: [\<EventTarget\>](/it/nodejs/api/events#class-eventtarget) L'`EventTarget` che distribuisce l'evento.

Alias per `event.target`.

#### `event.stopImmediatePropagation()` {#eventstopimmediatepropagation}

**Aggiunto in: v14.5.0**

Interrompe l'invocazione dei listener di eventi dopo che quello corrente è stato completato.

#### `event.stopPropagation()` {#eventstoppropagation}

**Aggiunto in: v14.5.0**

Questo non viene utilizzato in Node.js ed è fornito puramente a scopo di completezza.

#### `event.target` {#eventtarget}

**Aggiunto in: v14.5.0**

- Tipo: [\<EventTarget\>](/it/nodejs/api/events#class-eventtarget) L'`EventTarget` che distribuisce l'evento.

#### `event.timeStamp` {#eventtimestamp}

**Aggiunto in: v14.5.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Il timestamp in millisecondi quando è stato creato l'oggetto `Event`.

#### `event.type` {#eventtype}

**Aggiunto in: v14.5.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

L'identificatore del tipo di evento.

### Classe: `EventTarget` {#class-eventtarget}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | La classe `EventTarget` è ora disponibile tramite l'oggetto globale. |
| v14.5.0 | Aggiunto in: v14.5.0 |
:::


#### `eventTarget.addEventListener(type, listener[, options])` {#eventtargetaddeventlistenertype-listener-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.4.0 | Aggiunto il supporto per l'opzione `signal`. |
| v14.5.0 | Aggiunto in: v14.5.0 |
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/it/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `once` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, il listener viene rimosso automaticamente quando viene invocato per la prima volta. **Predefinito:** `false`.
    - `passive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, serve come suggerimento che il listener non chiamerà il metodo `preventDefault()` dell'oggetto `Event`. **Predefinito:** `false`.
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Non utilizzato direttamente da Node.js. Aggiunto per completezza dell'API. **Predefinito:** `false`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Il listener verrà rimosso quando viene chiamato il metodo `abort()` dell'oggetto AbortSignal specificato.
  
 

Aggiunge un nuovo gestore per l'evento `type`. Qualsiasi `listener` specificato viene aggiunto solo una volta per `type` e per valore dell'opzione `capture`.

Se l'opzione `once` è `true`, il `listener` viene rimosso dopo la prossima volta che viene inviato un evento `type`.

L'opzione `capture` non viene utilizzata da Node.js in alcun modo funzionale se non per tracciare i listener di eventi registrati secondo le specifiche `EventTarget`. Nello specifico, l'opzione `capture` viene utilizzata come parte della chiave durante la registrazione di un `listener`. Qualsiasi singolo `listener` può essere aggiunto una volta con `capture = false` e una volta con `capture = true`.

```js [ESM]
function handler(event) {}

const target = new EventTarget();
target.addEventListener('foo', handler, { capture: true });  // first
target.addEventListener('foo', handler, { capture: false }); // second

// Rimuove la seconda istanza di handler
target.removeEventListener('foo', handler);

// Rimuove la prima istanza di handler
target.removeEventListener('foo', handler, { capture: true });
```

#### `eventTarget.dispatchEvent(event)` {#eventtargetdispatcheventevent}

**Aggiunto in: v14.5.0**

- `event` [\<Event\>](/it/nodejs/api/events#class-event)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se il valore dell'attributo `cancelable` dell'evento è false o il suo metodo `preventDefault()` non è stato invocato, altrimenti `false`.

Inoltra l'`event` all'elenco di gestori per `event.type`.

I listener di eventi registrati vengono invocati sincronicamente nell'ordine in cui sono stati registrati.

#### `eventTarget.removeEventListener(type, listener[, options])` {#eventtargetremoveeventlistenertype-listener-options}

**Aggiunto in: v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/it/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 

Rimuove il `listener` dall'elenco dei gestori per l'`type` dell'evento.

### Classe: `CustomEvent` {#class-customevent}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Non più sperimentale. |
| v22.1.0, v20.13.0 | CustomEvent è ora stabile. |
| v19.0.0 | Non più dietro il flag CLI `--experimental-global-customevent`. |
| v18.7.0, v16.17.0 | Aggiunto in: v18.7.0, v16.17.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

- Estende: [\<Event\>](/it/nodejs/api/events#class-event)

L'oggetto `CustomEvent` è un adattamento della [`CustomEvent` Web API](https://dom.spec.whatwg.org/#customevent). Le istanze vengono create internamente da Node.js.

#### `event.detail` {#eventdetail}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.1.0, v20.13.0 | CustomEvent è ora stabile. |
| v18.7.0, v16.17.0 | Aggiunto in: v18.7.0, v16.17.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

- Tipo: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Restituisce dati personalizzati passati durante l'inizializzazione.

Sola lettura.


### Classe: `NodeEventTarget` {#class-nodeeventtarget}

**Aggiunto in: v14.5.0**

- Estende: [\<EventTarget\>](/it/nodejs/api/events#class-eventtarget)

`NodeEventTarget` è un'estensione specifica di Node.js per `EventTarget` che emula un sottoinsieme dell'API `EventEmitter`.

#### `nodeEventTarget.addListener(type, listener)` {#nodeeventtargetaddlistenertype-listener}

**Aggiunto in: v14.5.0**

-  `type` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  `listener` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/it/nodejs/api/events#event-listener)
-  Restituisce: [\<EventTarget\>](/it/nodejs/api/events#class-eventtarget) questo

Estensione specifica di Node.js alla classe `EventTarget` che emula l'equivalente API `EventEmitter`. L'unica differenza tra `addListener()` e `addEventListener()` è che `addListener()` restituirà un riferimento a `EventTarget`.

#### `nodeEventTarget.emit(type, arg)` {#nodeeventtargetemittype-arg}

**Aggiunto in: v15.2.0**

- `type` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `arg` [\<qualsiasi\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se esistono listener di eventi registrati per il `type`, altrimenti `false`.

Estensione specifica di Node.js alla classe `EventTarget` che invia l'`arg` all'elenco di gestori per `type`.

#### `nodeEventTarget.eventNames()` {#nodeeventtargeteventnames}

**Aggiunto in: v14.5.0**

- Restituisce: [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Estensione specifica di Node.js alla classe `EventTarget` che restituisce un array di nomi `type` di eventi per i quali sono registrati i listener di eventi.

#### `nodeEventTarget.listenerCount(type)` {#nodeeventtargetlistenercounttype}

**Aggiunto in: v14.5.0**

-  `type` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  Restituisce: [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Estensione specifica di Node.js alla classe `EventTarget` che restituisce il numero di listener di eventi registrati per il `type`.


#### `nodeEventTarget.setMaxListeners(n)` {#nodeeventtargetsetmaxlistenersn}

**Aggiunto in: v14.5.0**

- `n` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Estensione specifica di Node.js alla classe `EventTarget` che imposta il numero massimo di listener di eventi come `n`.

#### `nodeEventTarget.getMaxListeners()` {#nodeeventtargetgetmaxlisteners}

**Aggiunto in: v14.5.0**

- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Estensione specifica di Node.js alla classe `EventTarget` che restituisce il numero massimo di listener di eventi.

#### `nodeEventTarget.off(type, listener[, options])` {#nodeeventtargetofftype-listener-options}

**Aggiunto in: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/it/nodejs/api/events#event-listener)
-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)


-  Restituisce: [\<EventTarget\>](/it/nodejs/api/events#class-eventtarget) this

Alias specifico di Node.js per `eventTarget.removeEventListener()`.

#### `nodeEventTarget.on(type, listener)` {#nodeeventtargetontype-listener}

**Aggiunto in: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/it/nodejs/api/events#event-listener)
-  Restituisce: [\<EventTarget\>](/it/nodejs/api/events#class-eventtarget) this

Alias specifico di Node.js per `eventTarget.addEventListener()`.

#### `nodeEventTarget.once(type, listener)` {#nodeeventtargetoncetype-listener}

**Aggiunto in: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/it/nodejs/api/events#event-listener)
-  Restituisce: [\<EventTarget\>](/it/nodejs/api/events#class-eventtarget) this

Estensione specifica di Node.js alla classe `EventTarget` che aggiunge un listener `once` per il dato `type` di evento. Questo è equivalente a chiamare `on` con l'opzione `once` impostata su `true`.


#### `nodeEventTarget.removeAllListeners([type])` {#nodeeventtargetremovealllistenerstype}

**Aggiunto in: v14.5.0**

- `type` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<EventTarget\>](/it/nodejs/api/events#class-eventtarget) this

Estensione specifica di Node.js alla classe `EventTarget`. Se `type` è specificato, rimuove tutti i listener registrati per `type`, altrimenti rimuove tutti i listener registrati.

#### `nodeEventTarget.removeListener(type, listener[, options])` {#nodeeventtargetremovelistenertype-listener-options}

**Aggiunto in: v14.5.0**

- `type` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/it/nodejs/api/events#event-listener)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `capture` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)


- Restituisce: [\<EventTarget\>](/it/nodejs/api/events#class-eventtarget) this

Estensione specifica di Node.js alla classe `EventTarget` che rimuove il `listener` per il dato `type`. L'unica differenza tra `removeListener()` e `removeEventListener()` è che `removeListener()` restituirà un riferimento a `EventTarget`.

