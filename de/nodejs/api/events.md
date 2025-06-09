---
title: Node.js Dokumentation - Ereignisse
description: Erkunden Sie das Ereignismodul in Node.js, das eine Möglichkeit bietet, asynchrone Operationen durch ereignisgesteuerte Programmierung zu handhaben. Erfahren Sie mehr über Ereignisemitter, Listener und wie man Ereignisse effektiv verwaltet.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - Ereignisse | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erkunden Sie das Ereignismodul in Node.js, das eine Möglichkeit bietet, asynchrone Operationen durch ereignisgesteuerte Programmierung zu handhaben. Erfahren Sie mehr über Ereignisemitter, Listener und wie man Ereignisse effektiv verwaltet.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - Ereignisse | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erkunden Sie das Ereignismodul in Node.js, das eine Möglichkeit bietet, asynchrone Operationen durch ereignisgesteuerte Programmierung zu handhaben. Erfahren Sie mehr über Ereignisemitter, Listener und wie man Ereignisse effektiv verwaltet.
---


# Ereignisse {#events}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/events.js](https://github.com/nodejs/node/blob/v23.5.0/lib/events.js)

Ein Großteil der Node.js-Kern-API basiert auf einer idiomatischen, asynchronen, ereignisgesteuerten Architektur, in der bestimmte Arten von Objekten (sogenannte "Emitter") benannte Ereignisse auslösen, die das Aufrufen von `Function`-Objekten ("Listener") verursachen.

Zum Beispiel: Ein [`net.Server`](/de/nodejs/api/net#class-netserver)-Objekt löst jedes Mal ein Ereignis aus, wenn sich ein Peer damit verbindet; ein [`fs.ReadStream`](/de/nodejs/api/fs#class-fsreadstream) löst ein Ereignis aus, wenn die Datei geöffnet wird; ein [Stream](/de/nodejs/api/stream) löst ein Ereignis aus, wenn Daten zum Lesen verfügbar sind.

Alle Objekte, die Ereignisse auslösen, sind Instanzen der Klasse `EventEmitter`. Diese Objekte stellen eine Funktion `eventEmitter.on()` bereit, mit der eine oder mehrere Funktionen an benannte Ereignisse angehängt werden können, die vom Objekt ausgelöst werden. Typischerweise sind Ereignisnamen Zeichenketten in Camel-Case-Schreibweise, aber es kann jeder gültige JavaScript-Eigenschaftsschlüssel verwendet werden.

Wenn das `EventEmitter`-Objekt ein Ereignis auslöst, werden alle Funktionen, die an dieses bestimmte Ereignis angehängt sind, *synchron* aufgerufen. Alle von den aufgerufenen Listenern zurückgegebenen Werte werden *ignoriert* und verworfen.

Das folgende Beispiel zeigt eine einfache `EventEmitter`-Instanz mit einem einzelnen Listener. Die Methode `eventEmitter.on()` wird verwendet, um Listener zu registrieren, während die Methode `eventEmitter.emit()` verwendet wird, um das Ereignis auszulösen.

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

## Argumente und `this` an Listener übergeben {#passing-arguments-and-this-to-listeners}

Die Methode `eventEmitter.emit()` ermöglicht die Übergabe einer beliebigen Menge von Argumenten an die Listener-Funktionen. Denken Sie daran, dass beim Aufruf einer gewöhnlichen Listener-Funktion das Standard-Keyword `this` absichtlich so gesetzt wird, dass es auf die `EventEmitter`-Instanz verweist, an die der Listener angehängt ist.

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

Es ist möglich, ES6-Pfeilfunktionen als Listener zu verwenden, aber wenn dies der Fall ist, verweist das Schlüsselwort `this` nicht mehr auf die `EventEmitter`-Instanz:

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


## Asynchron vs. synchron {#asynchronous-vs-synchronous}

Der `EventEmitter` ruft alle Listener synchron in der Reihenfolge auf, in der sie registriert wurden. Dies gewährleistet die korrekte Reihenfolge der Ereignisse und hilft, Race-Conditions und Logikfehler zu vermeiden. Bei Bedarf können Listener-Funktionen mit den Methoden `setImmediate()` oder `process.nextTick()` in einen asynchronen Betriebsmodus wechseln:

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('this happens asynchronously');
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
    console.log('this happens asynchronously');
  });
});
myEmitter.emit('event', 'a', 'b');
```
:::

## Ereignisse nur einmal behandeln {#handling-events-only-once}

Wenn ein Listener mit der Methode `eventEmitter.on()` registriert wird, wird dieser Listener *jedes Mal* aufgerufen, wenn das benannte Ereignis ausgelöst wird.

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

Mit der Methode `eventEmitter.once()` ist es möglich, einen Listener zu registrieren, der höchstens einmal für ein bestimmtes Ereignis aufgerufen wird. Sobald das Ereignis ausgelöst wurde, wird der Listener abgemeldet und *dann* aufgerufen.

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


## Fehlerereignisse {#error-events}

Wenn innerhalb einer `EventEmitter`-Instanz ein Fehler auftritt, besteht die typische Aktion darin, ein `'error'`-Ereignis auszugeben. Diese werden in Node.js als Sonderfälle behandelt.

Wenn ein `EventEmitter` *nicht* mindestens einen Listener für das `'error'`-Ereignis registriert hat und ein `'error'`-Ereignis ausgegeben wird, wird der Fehler geworfen, ein Stacktrace wird ausgegeben und der Node.js-Prozess wird beendet.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// Wirft einen Fehler und lässt Node.js abstürzen
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// Wirft einen Fehler und lässt Node.js abstürzen
```
:::

Um das Abstürzen des Node.js-Prozesses zu verhindern, kann das [`domain`](/de/nodejs/api/domain)-Modul verwendet werden. (Beachten Sie jedoch, dass das `node:domain`-Modul als veraltet gilt.)

Als Best Practice sollten immer Listener für die `'error'`-Ereignisse hinzugefügt werden.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('Hoppla! Es gab einen Fehler');
});
myEmitter.emit('error', new Error('whoops!'));
// Gibt aus: Hoppla! Es gab einen Fehler
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('Hoppla! Es gab einen Fehler');
});
myEmitter.emit('error', new Error('whoops!'));
// Gibt aus: Hoppla! Es gab einen Fehler
```
:::

Es ist möglich, `'error'`-Ereignisse zu überwachen, ohne den ausgegebenen Fehler zu verarbeiten, indem ein Listener mit dem Symbol `events.errorMonitor` installiert wird.

::: code-group
```js [ESM]
import { EventEmitter, errorMonitor } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// Wirft immer noch einen Fehler und lässt Node.js abstürzen
```

```js [CJS]
const { EventEmitter, errorMonitor } = require('node:events');

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// Wirft immer noch einen Fehler und lässt Node.js abstürzen
```
:::


## Ablehnungen von Promises abfangen {#capture-rejections-of-promises}

Die Verwendung von `async`-Funktionen mit Event-Handlern ist problematisch, da dies im Falle einer ausgelösten Ausnahme zu einer unbehandelten Ablehnung führen kann:

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

Die Option `captureRejections` im `EventEmitter`-Konstruktor oder die globale Einstellung ändern dieses Verhalten und installieren einen `.then(undefined, handler)`-Handler auf dem `Promise`. Dieser Handler leitet die Ausnahme asynchron an die [`Symbol.for('nodejs.rejection')`](/de/nodejs/api/events#emittersymbolfornodejsrejectionerr-eventname-args)-Methode weiter, falls vorhanden, oder an den [`'error'`](/de/nodejs/api/events#error-events)-Event-Handler, falls keiner vorhanden ist.

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

Wenn `events.captureRejections = true` gesetzt wird, ändert sich die Standardeinstellung für alle neuen Instanzen von `EventEmitter`.

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

Die `'error'`-Events, die durch das `captureRejections`-Verhalten erzeugt werden, haben keinen Catch-Handler, um endlose Fehlerschleifen zu vermeiden: Die Empfehlung lautet, **<code>async</code>-Funktionen nicht als <code>'error'</code>-Event-Handler zu verwenden**.


## Klasse: `EventEmitter` {#class-eventemitter}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v13.4.0, v12.16.0 | Option captureRejections hinzugefügt. |
| v0.1.26 | Hinzugefügt in: v0.1.26 |
:::

Die Klasse `EventEmitter` wird durch das Modul `node:events` definiert und bereitgestellt:

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
```

```js [CJS]
const EventEmitter = require('node:events');
```
:::

Alle `EventEmitter` senden das Ereignis `'newListener'` aus, wenn neue Listener hinzugefügt werden, und `'removeListener'`, wenn vorhandene Listener entfernt werden.

Es unterstützt die folgende Option:

- `captureRejections` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Aktiviert die [automatische Erfassung von Promise-Ablehnungen](/de/nodejs/api/events#capture-rejections-of-promises). **Standard:** `false`.

### Ereignis: `'newListener'` {#event-newlistener}

**Hinzugefügt in: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Der Name des Ereignisses, auf das gewartet wird
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Ereignishandlerfunktion

Die `EventEmitter`-Instanz löst ihr eigenes `'newListener'`-Ereignis *aus, bevor* ein Listener zu ihrem internen Array von Listenern hinzugefügt wird.

Listener, die für das `'newListener'`-Ereignis registriert sind, erhalten den Ereignisnamen und eine Referenz auf den Listener, der hinzugefügt wird.

Die Tatsache, dass das Ereignis vor dem Hinzufügen des Listeners ausgelöst wird, hat einen subtilen, aber wichtigen Nebeneffekt: Alle *zusätzlichen* Listener, die für denselben `name` *innerhalb* des `'newListener'`-Callbacks registriert werden, werden *vor* dem Listener eingefügt, der gerade hinzugefügt wird.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// Nur einmal ausführen, damit wir nicht endlos schleifen
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // Neuen Listener davor einfügen
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// Ausgabe:
//   B
//   A
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// Nur einmal ausführen, damit wir nicht endlos schleifen
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // Neuen Listener davor einfügen
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// Ausgabe:
//   B
//   A
```
:::


### Ereignis: `'removeListener'` {#event-removelistener}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v6.1.0, v4.7.0 | Für Listener, die mit `.once()` angehängt wurden, liefert das `listener`-Argument nun die ursprüngliche Listener-Funktion. |
| v0.9.3 | Hinzugefügt in: v0.9.3 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Der Ereignisname
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Ereignishandlerfunktion

Das Ereignis `'removeListener'` wird *nachdem* der `listener` entfernt wurde, ausgelöst.

### `emitter.addListener(eventName, listener)` {#emitteraddlistenereventname-listener}

**Hinzugefügt in: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Alias für `emitter.on(eventName, listener)`.

### `emitter.emit(eventName[, ...args])` {#emitteremiteventname-args}

**Hinzugefügt in: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ruft synchron jeden der für das Ereignis namens `eventName` registrierten Listener in der Reihenfolge auf, in der sie registriert wurden, und übergibt die bereitgestellten Argumente an jeden einzelnen.

Gibt `true` zurück, wenn das Ereignis Listener hatte, andernfalls `false`.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```

```js [CJS]
const EventEmitter = require('node:events');
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```
:::

### `emitter.eventNames()` {#emittereventnames}

**Hinzugefügt in: v6.0.0**

- Rückgabe: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

Gibt ein Array zurück, das die Ereignisse auflistet, für die der Emitter Listener registriert hat. Die Werte im Array sind Strings oder `Symbol`e.

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

**Hinzugefügt in: v1.0.0**

- Rückgabe: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Gibt den aktuellen maximalen Listener-Wert für den `EventEmitter` zurück, der entweder durch [`emitter.setMaxListeners(n)`](/de/nodejs/api/events#emittersetmaxlistenersn) gesetzt wurde oder standardmäßig auf [`events.defaultMaxListeners`](/de/nodejs/api/events#eventsdefaultmaxlisteners) eingestellt ist.

### `emitter.listenerCount(eventName[, listener])` {#emitterlistenercounteventname-listener}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.8.0, v18.16.0 | Das `listener`-Argument wurde hinzugefügt. |
| v3.2.0 | Hinzugefügt in: v3.2.0 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Der Name des Ereignisses, auf das gewartet wird.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Ereignishandlerfunktion
- Rückgabe: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Gibt die Anzahl der Listener zurück, die auf das Ereignis mit dem Namen `eventName` warten. Wenn `listener` angegeben ist, wird zurückgegeben, wie oft der Listener in der Liste der Listener des Ereignisses gefunden wurde.


### `emitter.listeners(eventName)` {#emitterlistenerseventname}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v7.0.0 | Für Listener, die mit `.once()` hinzugefügt wurden, werden nun die ursprünglichen Listener anstelle von Wrapper-Funktionen zurückgegeben. |
| v0.1.26 | Hinzugefügt in: v0.1.26 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- Gibt zurück: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Gibt eine Kopie des Arrays von Listenern für das Ereignis mit dem Namen `eventName` zurück.

```js [ESM]
server.on('connection', (stream) => {
  console.log('jemand hat sich verbunden!');
});
console.log(util.inspect(server.listeners('connection')));
// Gibt aus: [ [Function] ]
```
### `emitter.off(eventName, listener)` {#emitteroffeventname-listener}

**Hinzugefügt in: v10.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)

Alias für [`emitter.removeListener()`](/de/nodejs/api/events#emitterremovelistenereventname-listener).

### `emitter.on(eventName, listener)` {#emitteroneventname-listener}

**Hinzugefügt in: v0.1.101**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Der Name des Ereignisses.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Callback-Funktion
- Gibt zurück: [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)

Fügt die `listener`-Funktion am Ende des Listener-Arrays für das Ereignis namens `eventName` hinzu. Es wird nicht geprüft, ob der `listener` bereits hinzugefügt wurde. Mehrere Aufrufe, die dieselbe Kombination aus `eventName` und `listener` übergeben, führen dazu, dass der `listener` mehrfach hinzugefügt und aufgerufen wird.

```js [ESM]
server.on('connection', (stream) => {
  console.log('jemand hat sich verbunden!');
});
```
Gibt eine Referenz zum `EventEmitter` zurück, sodass Aufrufe verkettet werden können.

Standardmäßig werden Ereignis-Listener in der Reihenfolge aufgerufen, in der sie hinzugefügt werden. Die Methode `emitter.prependListener()` kann alternativ verwendet werden, um den Ereignis-Listener am Anfang des Listener-Arrays hinzuzufügen.



::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Gibt aus:
//   b
//   a
```

```js [CJS]
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Gibt aus:
//   b
//   a
```
:::


### `emitter.once(eventName, listener)` {#emitteronceeventname-listener}

**Hinzugefügt in: v0.3.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Der Name des Ereignisses.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Callback-Funktion.
- Gibt zurück: [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)

Fügt eine **einmalige** `listener`-Funktion für das Ereignis namens `eventName` hinzu. Das nächste Mal, wenn `eventName` ausgelöst wird, wird dieser Listener entfernt und dann aufgerufen.

```js [ESM]
server.once('connection', (stream) => {
  console.log('Ah, wir haben unseren ersten Benutzer!');
});
```
Gibt eine Referenz zum `EventEmitter` zurück, so dass Aufrufe verkettet werden können.

Standardmäßig werden Event-Listener in der Reihenfolge aufgerufen, in der sie hinzugefügt werden. Die Methode `emitter.prependOnceListener()` kann als Alternative verwendet werden, um den Event-Listener am Anfang des Listener-Arrays hinzuzufügen.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

```js [CJS]
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```
:::

### `emitter.prependListener(eventName, listener)` {#emitterprependlistenereventname-listener}

**Hinzugefügt in: v6.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Der Name des Ereignisses.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Callback-Funktion.
- Gibt zurück: [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)

Fügt die `listener`-Funktion *am Anfang* des Listener-Arrays für das Ereignis namens `eventName` hinzu. Es werden keine Prüfungen durchgeführt, um festzustellen, ob der `listener` bereits hinzugefügt wurde. Mehrere Aufrufe, die die gleiche Kombination aus `eventName` und `listener` übergeben, führen dazu, dass der `listener` mehrfach hinzugefügt und aufgerufen wird.

```js [ESM]
server.prependListener('connection', (stream) => {
  console.log('jemand hat sich verbunden!');
});
```
Gibt eine Referenz zum `EventEmitter` zurück, so dass Aufrufe verkettet werden können.


### `emitter.prependOnceListener(eventName, listener)` {#emitterprependoncelistenereventname-listener}

**Hinzugefügt in: v6.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Der Name des Ereignisses.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Die Callback-Funktion
- Gibt zurück: [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)

Fügt eine **einmalige** `listener`-Funktion für das Ereignis mit dem Namen `eventName` *am Anfang* des Listener-Arrays hinzu. Das nächste Mal, wenn `eventName` ausgelöst wird, wird dieser Listener entfernt und dann aufgerufen.

```js [ESM]
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```
Gibt eine Referenz auf den `EventEmitter` zurück, sodass Aufrufe verkettet werden können.

### `emitter.removeAllListeners([eventName])` {#emitterremovealllistenerseventname}

**Hinzugefügt in: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- Gibt zurück: [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)

Entfernt alle Listener oder die des angegebenen `eventName`.

Es ist schlechte Praxis, Listener zu entfernen, die an anderer Stelle im Code hinzugefügt wurden, insbesondere wenn die `EventEmitter`-Instanz von einer anderen Komponente oder einem anderen Modul erstellt wurde (z. B. Sockets oder File Streams).

Gibt eine Referenz auf den `EventEmitter` zurück, sodass Aufrufe verkettet werden können.

### `emitter.removeListener(eventName, listener)` {#emitterremovelistenereventname-listener}

**Hinzugefügt in: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)

Entfernt den angegebenen `listener` aus dem Listener-Array für das Ereignis mit dem Namen `eventName`.

```js [ESM]
const callback = (stream) => {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```
`removeListener()` entfernt maximal eine Instanz eines Listeners aus dem Listener-Array. Wenn ein einzelner Listener dem Listener-Array für das angegebene `eventName` mehrmals hinzugefügt wurde, muss `removeListener()` mehrmals aufgerufen werden, um jede Instanz zu entfernen.

Sobald ein Ereignis ausgelöst wird, werden alle daran zum Zeitpunkt der Auslösung angehängten Listener der Reihe nach aufgerufen. Dies impliziert, dass alle `removeListener()`- oder `removeAllListeners()`-Aufrufe *nach* dem Auslösen und *vor* dem Ende der Ausführung des letzten Listeners diese nicht von `emit()` in Bearbeitung entfernen. Nachfolgende Ereignisse verhalten sich wie erwartet.

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

// callbackA removes listener callbackB but it will still be called.
// Internal listener array at time of emit [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB is now removed.
// Internal listener array [callbackA]
myEmitter.emit('event');
// Prints:
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

// callbackA removes listener callbackB but it will still be called.
// Internal listener array at time of emit [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB is now removed.
// Internal listener array [callbackA]
myEmitter.emit('event');
// Prints:
//   A
```
:::

Da Listener über ein internes Array verwaltet werden, ändert der Aufruf dieser Funktion die Positionsindizes aller Listener, die *nach* dem zu entfernenden Listener registriert wurden. Dies hat keine Auswirkungen auf die Reihenfolge, in der Listener aufgerufen werden, bedeutet jedoch, dass alle Kopien des Listener-Arrays, wie sie von der Methode `emitter.listeners()` zurückgegeben werden, neu erstellt werden müssen.

Wenn eine einzelne Funktion mehrmals als Handler für ein einzelnes Ereignis hinzugefügt wurde (wie im folgenden Beispiel), entfernt `removeListener()` die zuletzt hinzugefügte Instanz. Im Beispiel wird der `once('ping')`-Listener entfernt:

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

Gibt eine Referenz auf den `EventEmitter` zurück, sodass Aufrufe verkettet werden können.


### `emitter.setMaxListeners(n)` {#emittersetmaxlistenersn}

**Hinzugefügt in: v0.3.5**

- `n` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Gibt zurück: [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)

Standardmäßig geben `EventEmitter`s eine Warnung aus, wenn mehr als `10` Listener für ein bestimmtes Ereignis hinzugefügt werden. Dies ist ein nützlicher Standardwert, der hilft, Speicherlecks zu finden. Die Methode `emitter.setMaxListeners()` ermöglicht es, das Limit für diese spezifische `EventEmitter`-Instanz zu ändern. Der Wert kann auf `Infinity` (oder `0`) gesetzt werden, um eine unbegrenzte Anzahl von Listenern anzugeben.

Gibt eine Referenz zum `EventEmitter` zurück, sodass Aufrufe verkettet werden können.

### `emitter.rawListeners(eventName)` {#emitterrawlistenerseventname}

**Hinzugefügt in: v9.4.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- Gibt zurück: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Gibt eine Kopie des Arrays von Listenern für das Ereignis namens `eventName` zurück, einschließlich aller Wrapper (wie z. B. die von `.once()` erstellten).

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Gibt ein neues Array mit einer Funktion `onceWrapper` zurück, die eine Eigenschaft
// `listener` hat, die den oben gebundenen ursprünglichen Listener enthält
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Protokolliert "log once" in der Konsole und entbindet das `once`-Ereignis nicht
logFnWrapper.listener();

// Protokolliert "log once" in der Konsole und entfernt den Listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Gibt ein neues Array mit einer einzelnen Funktion zurück, die oben durch `.on()` gebunden wurde
const newListeners = emitter.rawListeners('log');

// Protokolliert "log persistently" zweimal
newListeners[0]();
emitter.emit('log');
```

```js [CJS]
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Gibt ein neues Array mit einer Funktion `onceWrapper` zurück, die eine Eigenschaft
// `listener` hat, die den oben gebundenen ursprünglichen Listener enthält
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Protokolliert "log once" in der Konsole und entbindet das `once`-Ereignis nicht
logFnWrapper.listener();

// Protokolliert "log once" in der Konsole und entfernt den Listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Gibt ein neues Array mit einer einzelnen Funktion zurück, die oben durch `.on()` gebunden wurde
const newListeners = emitter.rawListeners('log');

// Protokolliert "log persistently" zweimal
newListeners[0]();
emitter.emit('log');
```
:::


### `emitter[Symbol.for('nodejs.rejection')](err, eventName[, ...args])` {#emittersymbolfornodejsrejectionerr-eventname-args}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v17.4.0, v16.14.0 | Nicht mehr experimentell. |
| v13.4.0, v12.16.0 | Hinzugefügt in: v13.4.0, v12.16.0 |
:::

- `err` Fehler
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Die `Symbol.for('nodejs.rejection')`-Methode wird aufgerufen, wenn eine Promise-Ablehnung auftritt, wenn ein Ereignis ausgelöst wird und [`captureRejections`](/de/nodejs/api/events#capture-rejections-of-promises) auf dem Emitter aktiviert ist. Es ist möglich, [`events.captureRejectionSymbol`](/de/nodejs/api/events#eventscapturerejectionsymbol) anstelle von `Symbol.for('nodejs.rejection')` zu verwenden.



::: code-group
```js [ESM]
import { EventEmitter, captureRejectionSymbol } from 'node:events';

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('rejection happened for', event, 'with', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Tear the resource down here.
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
    console.log('rejection happened for', event, 'with', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Tear the resource down here.
  }
}
```
:::

## `events.defaultMaxListeners` {#eventsdefaultmaxlisteners}

**Hinzugefügt in: v0.11.2**

Standardmäßig können maximal `10` Listener für jedes einzelne Ereignis registriert werden. Dieses Limit kann für einzelne `EventEmitter`-Instanzen mithilfe der Methode [`emitter.setMaxListeners(n)`](/de/nodejs/api/events#emittersetmaxlistenersn) geändert werden. Um den Standardwert für *alle* `EventEmitter`-Instanzen zu ändern, kann die Eigenschaft `events.defaultMaxListeners` verwendet werden. Wenn dieser Wert keine positive Zahl ist, wird ein `RangeError` ausgelöst.

Seien Sie vorsichtig beim Festlegen von `events.defaultMaxListeners`, da die Änderung *alle* `EventEmitter`-Instanzen betrifft, einschließlich derer, die vor der Änderung erstellt wurden. Der Aufruf von [`emitter.setMaxListeners(n)`](/de/nodejs/api/events#emittersetmaxlistenersn) hat jedoch weiterhin Vorrang vor `events.defaultMaxListeners`.

Dies ist keine harte Grenze. Die `EventEmitter`-Instanz erlaubt das Hinzufügen weiterer Listener, gibt aber eine Trace-Warnung an stderr aus, die darauf hinweist, dass ein "möglicher EventEmitter-Memory-Leak" erkannt wurde. Für jeden einzelnen `EventEmitter` können die Methoden `emitter.getMaxListeners()` und `emitter.setMaxListeners()` verwendet werden, um diese Warnung vorübergehend zu vermeiden:

`defaultMaxListeners` hat keine Auswirkung auf `AbortSignal`-Instanzen. Obwohl es immer noch möglich ist, [`emitter.setMaxListeners(n)`](/de/nodejs/api/events#emittersetmaxlistenersn) zu verwenden, um eine Warnungsgrenze für einzelne `AbortSignal`-Instanzen festzulegen, warnen `AbortSignal`-Instanzen standardmäßig nicht.



::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // do stuff
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```

```js [CJS]
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // do stuff
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```
:::

Das Befehlszeilenflag [`--trace-warnings`](/de/nodejs/api/cli#--trace-warnings) kann verwendet werden, um den Stack-Trace für solche Warnungen anzuzeigen.

Die ausgegebene Warnung kann mit [`process.on('warning')`](/de/nodejs/api/process#event-warning) untersucht werden und hat die zusätzlichen Eigenschaften `emitter`, `type` und `count`, die sich auf die Event-Emitter-Instanz, den Namen des Ereignisses bzw. die Anzahl der angehängten Listener beziehen. Die Eigenschaft `name` ist auf `'MaxListenersExceededWarning'` gesetzt.


## `events.errorMonitor` {#eventserrormonitor}

**Hinzugefügt in: v13.6.0, v12.17.0**

Dieses Symbol sollte verwendet werden, um einen Listener nur zur Überwachung von `'error'`-Ereignissen zu installieren. Listener, die mit diesem Symbol installiert werden, werden aufgerufen, bevor die regulären `'error'`-Listener aufgerufen werden.

Die Installation eines Listeners mit diesem Symbol ändert das Verhalten nicht, sobald ein `'error'`-Ereignis ausgelöst wird. Daher stürzt der Prozess weiterhin ab, wenn kein regulärer `'error'`-Listener installiert ist.

## `events.getEventListeners(emitterOrTarget, eventName)` {#eventsgeteventlistenersemitterortarget-eventname}

**Hinzugefügt in: v15.2.0, v14.17.0**

- `emitterOrTarget` [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter) | [\<EventTarget\>](/de/nodejs/api/events#class-eventtarget)
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- Gibt zurück: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Gibt eine Kopie des Arrays von Listenern für das Ereignis mit dem Namen `eventName` zurück.

Für `EventEmitter` verhält sich dies genau so, wie wenn `.listeners` auf dem Emitter aufgerufen wird.

Für `EventTarget` ist dies die einzige Möglichkeit, die Ereignis-Listener für das Ereignis-Ziel zu erhalten. Dies ist nützlich für Debugging- und Diagnosezwecke.

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

**Hinzugefügt in: v19.9.0, v18.17.0**

- `emitterOrTarget` [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter) | [\<EventTarget\>](/de/nodejs/api/events#class-eventtarget)
- Rückgabe: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Gibt die aktuell eingestellte maximale Anzahl von Listenern zurück.

Für `EventEmitter` verhält sich dies genau so, als würde man `.getMaxListeners` auf dem Emitter aufrufen.

Für `EventTarget` ist dies die einzige Möglichkeit, die maximale Anzahl von Event-Listenern für das Event-Ziel zu erhalten. Wenn die Anzahl der Event-Handler für ein einzelnes EventTarget das Maximum überschreitet, gibt das EventTarget eine Warnung aus.

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

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Die Option `signal` wird jetzt unterstützt. |
| v11.13.0, v10.16.0 | Hinzugefügt in: v11.13.0, v10.16.0 |
:::

- `emitter` [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)
- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Kann verwendet werden, um das Warten auf das Ereignis abzubrechen.

- Rückgabe: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Erstellt eine `Promise`, die erfüllt wird, wenn der `EventEmitter` das angegebene Ereignis auslöst, oder die abgelehnt wird, wenn der `EventEmitter` während des Wartens `'error'` auslöst. Die `Promise` wird mit einem Array aller Argumente aufgelöst, die an das angegebene Ereignis ausgegeben werden.

Diese Methode ist absichtlich generisch und funktioniert mit der Webplattform [EventTarget](https://dom.spec.whatwg.org/#interface-eventtarget)-Schnittstelle, die keine spezielle `'error'`-Ereignissemantik hat und nicht auf das `'error'`-Ereignis hört.

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

Die spezielle Behandlung des Ereignisses `'error'` wird nur verwendet, wenn `events.once()` verwendet wird, um auf ein anderes Ereignis zu warten. Wenn `events.once()` verwendet wird, um auf das Ereignis `'error'` selbst zu warten, wird es wie jede andere Art von Ereignis ohne spezielle Behandlung behandelt:

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

Ein [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) kann verwendet werden, um das Warten auf das Ereignis abzubrechen:

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


### Warten auf mehrere Ereignisse, die auf `process.nextTick()` ausgelöst werden {#awaiting-multiple-events-emitted-on-processnexttick}

Es gibt einen Sonderfall, der beachtet werden sollte, wenn die Funktion `events.once()` verwendet wird, um auf mehrere Ereignisse zu warten, die im selben Batch von `process.nextTick()`-Operationen oder immer dann ausgelöst werden, wenn mehrere Ereignisse synchron ausgelöst werden. Da die `process.nextTick()`-Warteschlange vor der `Promise`-Microtask-Warteschlange geleert wird und `EventEmitter` alle Ereignisse synchron auslöst, ist es möglich, dass `events.once()` ein Ereignis verpasst.

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';
import process from 'node:process';

const myEE = new EventEmitter();

async function foo() {
  await once(myEE, 'bar');
  console.log('bar');

  // Dieses Promise wird niemals aufgelöst, da das 'foo'-Ereignis bereits
  // ausgelöst wurde, bevor das Promise erstellt wurde.
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

  // Dieses Promise wird niemals aufgelöst, da das 'foo'-Ereignis bereits
  // ausgelöst wurde, bevor das Promise erstellt wurde.
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

Um beide Ereignisse abzufangen, erstellen Sie jedes der Promises *bevor* Sie auf eines von beiden warten. Dann wird es möglich, `Promise.all()`, `Promise.race()` oder `Promise.allSettled()` zu verwenden:

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

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v17.4.0, v16.14.0 | Nicht mehr experimentell. |
| v13.4.0, v12.16.0 | Hinzugefügt in: v13.4.0, v12.16.0 |
:::

Wert: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ändert die Standardoption `captureRejections` für alle neuen `EventEmitter`-Objekte.

## `events.captureRejectionSymbol` {#eventscapturerejectionsymbol}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v17.4.0, v16.14.0 | Nicht mehr experimentell. |
| v13.4.0, v12.16.0 | Hinzugefügt in: v13.4.0, v12.16.0 |
:::

Wert: `Symbol.for('nodejs.rejection')`

Siehe, wie man einen benutzerdefinierten [Rejection-Handler](/de/nodejs/api/events#emittersymbolfornodejsrejectionerr-eventname-args) schreibt.

## `events.listenerCount(emitter, eventName)` {#eventslistenercountemitter-eventname}

**Hinzugefügt in: v0.9.12**

**Veraltet seit: v3.2.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen [`emitter.listenerCount()`](/de/nodejs/api/events#emitterlistenercounteventname-listener).
:::

- `emitter` [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter) Der abzufragende Emitter
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Der Ereignisname

Eine Klassenmethode, die die Anzahl der Listener für den gegebenen `eventName` zurückgibt, die auf dem gegebenen `emitter` registriert sind.

::: code-group
```js [ESM]
import { EventEmitter, listenerCount } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Gibt aus: 2
```

```js [CJS]
const { EventEmitter, listenerCount } = require('node:events');

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Gibt aus: 2
```
:::


## `events.on(emitter, eventName[, options])` {#eventsonemitter-eventname-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.0.0, v20.13.0 | Unterstützung für `highWaterMark`- und `lowWaterMark`-Optionen, zur Konsistenz. Alte Optionen werden weiterhin unterstützt. |
| v20.0.0 | Die Optionen `close`, `highWatermark` und `lowWatermark` werden jetzt unterstützt. |
| v13.6.0, v12.16.0 | Hinzugefügt in: v13.6.0, v12.16.0 |
:::

- `emitter` [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Der Name des Ereignisses, auf das gewartet wird
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Kann verwendet werden, um das Warten auf Ereignisse abzubrechen.
    - `close` - [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Namen von Ereignissen, die die Iteration beenden.
    - `highWaterMark` - [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `Number.MAX_SAFE_INTEGER` Der High Watermark Wert. Der Emitter wird jedes Mal angehalten, wenn die Größe der gepufferten Ereignisse höher ist als dieser Wert. Wird nur von Emittern unterstützt, die die Methoden `pause()` und `resume()` implementieren.
    - `lowWaterMark` - [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `1` Der Low Watermark Wert. Der Emitter wird jedes Mal fortgesetzt, wenn die Größe der gepufferten Ereignisse niedriger ist als dieser Wert. Wird nur von Emittern unterstützt, die die Methoden `pause()` und `resume()` implementieren.


- Gibt zurück: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface), der `eventName`-Ereignisse iteriert, die vom `emitter` ausgegeben werden

::: code-group
```js [ESM]
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

// Später ausgeben
process.nextTick(() => {
  ee.emit('foo', 'bar');
  ee.emit('foo', 42);
});

for await (const event of on(ee, 'foo')) {
  // Die Ausführung dieses inneren Blocks ist synchron und er
  // verarbeitet jeweils ein Ereignis (auch mit await). Nicht verwenden,
  // wenn eine gleichzeitige Ausführung erforderlich ist.
  console.log(event); // gibt ['bar'] [42] aus
}
// Hier nicht erreichbar
```

```js [CJS]
const { on, EventEmitter } = require('node:events');

(async () => {
  const ee = new EventEmitter();

  // Später ausgeben
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo')) {
    // Die Ausführung dieses inneren Blocks ist synchron und er
    // verarbeitet jeweils ein Ereignis (auch mit await). Nicht verwenden,
    // wenn eine gleichzeitige Ausführung erforderlich ist.
    console.log(event); // gibt ['bar'] [42] aus
  }
  // Hier nicht erreichbar
})();
```
:::

Gibt einen `AsyncIterator` zurück, der `eventName`-Ereignisse iteriert. Es wird ein Fehler ausgegeben, wenn der `EventEmitter` `'error'` ausgibt. Es entfernt alle Listener beim Verlassen der Schleife. Der von jeder Iteration zurückgegebene `value` ist ein Array, das aus den ausgegebenen Ereignisargumenten besteht.

Ein [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) kann verwendet werden, um das Warten auf Ereignisse abzubrechen:

::: code-group
```js [ESM]
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Später ausgeben
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // Die Ausführung dieses inneren Blocks ist synchron und er
    // verarbeitet jeweils ein Ereignis (auch mit await). Nicht verwenden,
    // wenn eine gleichzeitige Ausführung erforderlich ist.
    console.log(event); // gibt ['bar'] [42] aus
  }
  // Hier nicht erreichbar
})();

process.nextTick(() => ac.abort());
```

```js [CJS]
const { on, EventEmitter } = require('node:events');

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Später ausgeben
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // Die Ausführung dieses inneren Blocks ist synchron und er
    // verarbeitet jeweils ein Ereignis (auch mit await). Nicht verwenden,
    // wenn eine gleichzeitige Ausführung erforderlich ist.
    console.log(event); // gibt ['bar'] [42] aus
  }
  // Hier nicht erreichbar
})();

process.nextTick(() => ac.abort());
```
:::


## `events.setMaxListeners(n[, ...eventTargets])` {#eventssetmaxlistenersn-eventtargets}

**Hinzugefügt in: v15.4.0**

- `n` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Eine nicht-negative Zahl. Die maximale Anzahl von Listenern pro `EventTarget`-Ereignis.
- `...eventsTargets` [\<EventTarget[]\>](/de/nodejs/api/events#class-eventtarget) | [\<EventEmitter[]\>](/de/nodejs/api/events#class-eventemitter) Null oder mehr [\<EventTarget\>](/de/nodejs/api/events#class-eventtarget)- oder [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)-Instanzen. Wenn keine angegeben werden, wird `n` als Standardmaximum für alle neu erstellten [\<EventTarget\>](/de/nodejs/api/events#class-eventtarget)- und [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)-Objekte festgelegt.

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

**Hinzugefügt in: v20.5.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/de/nodejs/api/events#event-listener)
- Rückgabe: [\<Disposable\>](https://tc39.es/proposal-explicit-resource-management/#sec-disposable-interface) Ein Disposable, das den `abort`-Listener entfernt.

Hört einmalig auf das `abort`-Ereignis des bereitgestellten `signal`.

Das Abhören des `abort`-Ereignisses auf Abort-Signalen ist unsicher und kann zu Ressourcenlecks führen, da ein anderer Dritter mit dem Signal [`e.stopImmediatePropagation()`](/de/nodejs/api/events#eventstopimmediatepropagation) aufrufen kann. Leider kann Node.js dies nicht ändern, da dies gegen den Webstandard verstoßen würde. Darüber hinaus macht es die ursprüngliche API leicht, das Entfernen von Listenern zu vergessen.

Diese API ermöglicht die sichere Verwendung von `AbortSignal`s in Node.js-APIs, indem diese beiden Probleme gelöst werden, indem das Ereignis so abgehört wird, dass `stopImmediatePropagation` nicht verhindert, dass der Listener ausgeführt wird.

Gibt ein Disposable zurück, damit es leichter abgemeldet werden kann.

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


## Klasse: `events.EventEmitterAsyncResource extends EventEmitter` {#class-eventseventemitterasyncresource-extends-eventemitter}

**Hinzugefügt in: v17.4.0, v16.14.0**

Integriert `EventEmitter` mit [\<AsyncResource\>](/de/nodejs/api/async_hooks#class-asyncresource) für `EventEmitter`, die eine manuelle Async-Verfolgung benötigen. Insbesondere werden alle Ereignisse, die von Instanzen von `events.EventEmitterAsyncResource` emittiert werden, innerhalb ihres [Async-Kontexts](/de/nodejs/api/async_context) ausgeführt.

::: code-group
```js [ESM]
import { EventEmitterAsyncResource, EventEmitter } from 'node:events';
import { notStrictEqual, strictEqual } from 'node:assert';
import { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

// Async-Tracking-Tools identifizieren dies als 'Q'.
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// 'foo'-Listener werden im Async-Kontext des EventEmitters ausgeführt.
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// 'foo'-Listener auf gewöhnlichen EventEmittern, die keinen Async-
// Kontext verfolgen, werden jedoch im selben Async-Kontext wie emit() ausgeführt.
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

// Async-Tracking-Tools identifizieren dies als 'Q'.
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// 'foo'-Listener werden im Async-Kontext des EventEmitters ausgeführt.
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// 'foo'-Listener auf gewöhnlichen EventEmittern, die keinen Async-
// Kontext verfolgen, werden jedoch im selben Async-Kontext wie emit() ausgeführt.
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

Die Klasse `EventEmitterAsyncResource` hat die gleichen Methoden und nimmt die gleichen Optionen wie `EventEmitter` und `AsyncResource` selbst entgegen.


### `new events.EventEmitterAsyncResource([options])` {#new-eventseventemitterasyncresourceoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `captureRejections` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Aktiviert das [automatische Erfassen von Promise-Ablehnungen](/de/nodejs/api/events#capture-rejections-of-promises). **Standard:** `false`.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Typ des asynchronen Ereignisses. **Standard:** [`new.target.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target).
    - `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die ID des Ausführungskontextes, der dieses asynchrone Ereignis erzeugt hat. **Standard:** `executionAsyncId()`.
    - `requireManualDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf `true` gesetzt, deaktiviert `emitDestroy`, wenn das Objekt vom Garbage Collector erfasst wird. Dies muss normalerweise nicht gesetzt werden (auch wenn `emitDestroy` manuell aufgerufen wird), es sei denn, die `asyncId` der Ressource wird abgerufen und die sensible API `emitDestroy` wird damit aufgerufen. Wenn auf `false` gesetzt, erfolgt der `emitDestroy`-Aufruf bei der Garbage Collection nur, wenn mindestens ein aktiver `destroy`-Hook vorhanden ist. **Standard:** `false`.

### `eventemitterasyncresource.asyncId` {#eventemitterasyncresourceasyncid}

- Typ: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die eindeutige `asyncId`, die der Ressource zugewiesen wurde.

### `eventemitterasyncresource.asyncResource` {#eventemitterasyncresourceasyncresource}

- Typ: Die zugrunde liegende [\<AsyncResource\>](/de/nodejs/api/async_hooks#class-asyncresource).

Das zurückgegebene `AsyncResource`-Objekt hat eine zusätzliche `eventEmitter`-Eigenschaft, die einen Verweis auf diese `EventEmitterAsyncResource` bereitstellt.

### `eventemitterasyncresource.emitDestroy()` {#eventemitterasyncresourceemitdestroy}

Ruft alle `destroy`-Hooks auf. Dies sollte nur einmal aufgerufen werden. Es wird ein Fehler geworfen, wenn es mehr als einmal aufgerufen wird. Dies **muss** manuell aufgerufen werden. Wenn die Ressource der GC überlassen wird, werden die `destroy`-Hooks niemals aufgerufen.


### `eventemitterasyncresource.triggerAsyncId` {#eventemitterasyncresourcetriggerasyncid}

- Typ: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die gleiche `triggerAsyncId`, die dem `AsyncResource`-Konstruktor übergeben wird.

## `EventTarget`- und `Event`-API {#eventtarget-and-event-api}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.0.0 | EventTarget-Fehlerbehandlung geändert. |
| v15.4.0 | Nicht mehr experimentell. |
| v15.0.0 | Die Klassen `EventTarget` und `Event` sind jetzt als Globale verfügbar. |
| v14.5.0 | Hinzugefügt in: v14.5.0 |
:::

Die Objekte `EventTarget` und `Event` sind eine Node.js-spezifische Implementierung der [`EventTarget` Web API](https://dom.spec.whatwg.org/#eventtarget), die von einigen Node.js-Kern-APIs bereitgestellt werden.

```js [ESM]
const target = new EventTarget();

target.addEventListener('foo', (event) => {
  console.log('foo event happened!');
});
```
### Node.js `EventTarget` vs. DOM `EventTarget` {#nodejs-eventtarget-vs-dom-eventtarget}

Es gibt zwei Hauptunterschiede zwischen dem Node.js `EventTarget` und der [`EventTarget` Web API](https://dom.spec.whatwg.org/#eventtarget):

### `NodeEventTarget` vs. `EventEmitter` {#nodeeventtarget-vs-eventemitter}

Das `NodeEventTarget`-Objekt implementiert eine modifizierte Teilmenge der `EventEmitter`-API, die es ihm ermöglicht, einen `EventEmitter` in bestimmten Situationen genau zu *emulieren*. Ein `NodeEventTarget` ist *keine* Instanz von `EventEmitter` und kann in den meisten Fällen nicht anstelle eines `EventEmitter` verwendet werden.

### Event-Listener {#event-listener}

Event-Listener, die für einen Event `type` registriert sind, können entweder JavaScript-Funktionen oder Objekte mit einer `handleEvent`-Eigenschaft sein, deren Wert eine Funktion ist.

In jedem Fall wird die Handler-Funktion mit dem `event`-Argument aufgerufen, das der Funktion `eventTarget.dispatchEvent()` übergeben wird.

Asynchrone Funktionen können als Event-Listener verwendet werden. Wenn eine asynchrone Handler-Funktion ablehnt, wird die Ablehnung erfasst und wie in [`EventTarget`-Fehlerbehandlung](/de/nodejs/api/events#eventtarget-error-handling) beschrieben behandelt.

Ein von einer Handler-Funktion ausgelöster Fehler verhindert nicht, dass die anderen Handler aufgerufen werden.

Der Rückgabewert einer Handler-Funktion wird ignoriert.

Handler werden immer in der Reihenfolge aufgerufen, in der sie hinzugefügt wurden.

Handler-Funktionen können das `event`-Objekt mutieren.

```js [ESM]
function handler1(event) {
  console.log(event.type);  // Gibt 'foo' aus
  event.a = 1;
}

async function handler2(event) {
  console.log(event.type);  // Gibt 'foo' aus
  console.log(event.a);  // Gibt 1 aus
}

const handler3 = {
  handleEvent(event) {
    console.log(event.type);  // Gibt 'foo' aus
  },
};

const handler4 = {
  async handleEvent(event) {
    console.log(event.type);  // Gibt 'foo' aus
  },
};

const target = new EventTarget();

target.addEventListener('foo', handler1);
target.addEventListener('foo', handler2);
target.addEventListener('foo', handler3);
target.addEventListener('foo', handler4, { once: true });
```

### Fehlerbehandlung in `EventTarget` {#eventtarget-error-handling}

Wenn ein registrierter Event-Listener eine Ausnahme auslöst (oder ein Promise zurückgibt, das abgelehnt wird), wird der Fehler standardmäßig als unbehandelte Ausnahme in `process.nextTick()` behandelt. Dies bedeutet, dass unbehandelte Ausnahmen in `EventTarget`s standardmäßig den Node.js-Prozess beenden.

Das Auslösen innerhalb eines Event-Listeners verhindert *nicht*, dass die anderen registrierten Handler aufgerufen werden.

Das `EventTarget` implementiert keine spezielle Standardbehandlung für Ereignisse vom Typ `'error'` wie `EventEmitter`.

Derzeit werden Fehler zuerst an das `process.on('error')`-Ereignis weitergeleitet, bevor sie `process.on('uncaughtException')` erreichen. Dieses Verhalten ist veraltet und wird sich in einer zukünftigen Version ändern, um `EventTarget` an andere Node.js-APIs anzugleichen. Jeder Code, der sich auf das `process.on('error')`-Ereignis verlässt, sollte an das neue Verhalten angepasst werden.

### Klasse: `Event` {#class-event}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Die Klasse `Event` ist jetzt über das globale Objekt verfügbar. |
| v14.5.0 | Hinzugefügt in: v14.5.0 |
:::

Das `Event`-Objekt ist eine Adaption der [`Event` Web API](https://dom.spec.whatwg.org/#event). Instanzen werden intern von Node.js erstellt.

#### `event.bubbles` {#eventbubbles}

**Hinzugefügt in: v14.5.0**

- Typ: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt immer `false` zurück.

Dies wird in Node.js nicht verwendet und wird nur der Vollständigkeit halber bereitgestellt.

#### `event.cancelBubble` {#eventcancelbubble}

**Hinzugefügt in: v14.5.0**

::: info [Stabil: 3 - Legacy]
[Stabil: 3](/de/nodejs/api/documentation#stability-index) [Stabilität: 3](/de/nodejs/api/documentation#stability-index) - Legacy: Verwenden Sie stattdessen [`event.stopPropagation()`](/de/nodejs/api/events#eventstoppropagation).
:::

- Typ: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Alias für `event.stopPropagation()`, wenn auf `true` gesetzt. Dies wird in Node.js nicht verwendet und wird nur der Vollständigkeit halber bereitgestellt.

#### `event.cancelable` {#eventcancelable}

**Hinzugefügt in: v14.5.0**

- Typ: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) True, wenn das Ereignis mit der Option `cancelable` erstellt wurde.


#### `event.composed` {#eventcomposed}

**Hinzugefügt in: v14.5.0**

- Typ: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt immer `false` zurück.

Dies wird in Node.js nicht verwendet und dient nur der Vollständigkeit halber.

#### `event.composedPath()` {#eventcomposedpath}

**Hinzugefügt in: v14.5.0**

Gibt ein Array zurück, das das aktuelle `EventTarget` als einzigen Eintrag enthält, oder leer ist, wenn das Ereignis nicht ausgelöst wird. Dies wird in Node.js nicht verwendet und dient nur der Vollständigkeit halber.

#### `event.currentTarget` {#eventcurrenttarget}

**Hinzugefügt in: v14.5.0**

- Typ: [\<EventTarget\>](/de/nodejs/api/events#class-eventtarget) Das `EventTarget`, das das Ereignis auslöst.

Alias für `event.target`.

#### `event.defaultPrevented` {#eventdefaultprevented}

**Hinzugefügt in: v14.5.0**

- Typ: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ist `true`, wenn `cancelable` `true` ist und `event.preventDefault()` aufgerufen wurde.

#### `event.eventPhase` {#eventeventphase}

**Hinzugefügt in: v14.5.0**

- Typ: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt `0` zurück, solange ein Ereignis nicht ausgelöst wird, `2`, solange es ausgelöst wird.

Dies wird in Node.js nicht verwendet und dient nur der Vollständigkeit halber.

#### `event.initEvent(type[, bubbles[, cancelable]])` {#eventiniteventtype-bubbles-cancelable}

**Hinzugefügt in: v19.5.0**

::: info [Stabil: 3 - Legacy]
[Stabil: 3](/de/nodejs/api/documentation#stability-index) [Stabilität: 3](/de/nodejs/api/documentation#stability-index) - Legacy: Die WHATWG-Spezifikation betrachtet sie als veraltet und Benutzer sollten sie überhaupt nicht verwenden.
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `bubbles` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `cancelable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Redundant mit Ereigniskonstruktoren und unfähig, `composed` zu setzen. Dies wird in Node.js nicht verwendet und dient nur der Vollständigkeit halber.

#### `event.isTrusted` {#eventistrusted}

**Hinzugefügt in: v14.5.0**

- Typ: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Das [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) `"abort"`-Ereignis wird mit `isTrusted` auf `true` gesetzt emittiert. In allen anderen Fällen ist der Wert `false`.


#### `event.preventDefault()` {#eventpreventdefault}

**Hinzugefügt in: v14.5.0**

Setzt die Eigenschaft `defaultPrevented` auf `true`, wenn `cancelable` `true` ist.

#### `event.returnValue` {#eventreturnvalue}

**Hinzugefügt in: v14.5.0**

::: info [Stabil: 3 - Legacy]
[Stabil: 3](/de/nodejs/api/documentation#stability-index) [Stabilität: 3](/de/nodejs/api/documentation#stability-index) - Legacy: Verwenden Sie stattdessen [`event.defaultPrevented`](/de/nodejs/api/events#eventdefaultprevented).
:::

- Typ: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) True, wenn das Ereignis nicht abgebrochen wurde.

Der Wert von `event.returnValue` ist immer das Gegenteil von `event.defaultPrevented`. Dies wird in Node.js nicht verwendet und dient lediglich der Vollständigkeit halber.

#### `event.srcElement` {#eventsrcelement}

**Hinzugefügt in: v14.5.0**

::: info [Stabil: 3 - Legacy]
[Stabil: 3](/de/nodejs/api/documentation#stability-index) [Stabilität: 3](/de/nodejs/api/documentation#stability-index) - Legacy: Verwenden Sie stattdessen [`event.target`](/de/nodejs/api/events#eventtarget).
:::

- Typ: [\<EventTarget\>](/de/nodejs/api/events#class-eventtarget) Das `EventTarget`, das das Ereignis auslöst.

Alias für `event.target`.

#### `event.stopImmediatePropagation()` {#eventstopimmediatepropagation}

**Hinzugefügt in: v14.5.0**

Stoppt den Aufruf von Event-Listenern, nachdem der aktuelle abgeschlossen ist.

#### `event.stopPropagation()` {#eventstoppropagation}

**Hinzugefügt in: v14.5.0**

Dies wird in Node.js nicht verwendet und dient lediglich der Vollständigkeit halber.

#### `event.target` {#eventtarget}

**Hinzugefügt in: v14.5.0**

- Typ: [\<EventTarget\>](/de/nodejs/api/events#class-eventtarget) Das `EventTarget`, das das Ereignis auslöst.

#### `event.timeStamp` {#eventtimestamp}

**Hinzugefügt in: v14.5.0**

- Typ: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Der Millisekunden-Zeitstempel, als das `Event`-Objekt erstellt wurde.

#### `event.type` {#eventtype}

**Hinzugefügt in: v14.5.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Ereignistyp-Kennung.

### Klasse: `EventTarget` {#class-eventtarget}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Die Klasse `EventTarget` ist jetzt über das globale Objekt verfügbar. |
| v14.5.0 | Hinzugefügt in: v14.5.0 |
:::


#### `eventTarget.addEventListener(type, listener[, options])` {#eventtargetaddeventlistenertype-listener-options}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.4.0 | Unterstützung für die Option `signal` hinzugefügt. |
| v14.5.0 | Hinzugefügt in: v14.5.0 |
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/de/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `once` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird der Listener automatisch entfernt, wenn er das erste Mal aufgerufen wird. **Standard:** `false`.
    - `passive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, dient dies als Hinweis darauf, dass der Listener nicht die Methode `preventDefault()` des `Event`-Objekts aufrufen wird. **Standard:** `false`.
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wird von Node.js nicht direkt verwendet. Für API-Vollständigkeit hinzugefügt. **Standard:** `false`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Der Listener wird entfernt, wenn die `abort()`-Methode des gegebenen AbortSignal-Objekts aufgerufen wird.
  
 

Fügt einen neuen Handler für das `type`-Ereignis hinzu. Jeder angegebene `listener` wird nur einmal pro `type` und pro `capture`-Optionswert hinzugefügt.

Wenn die Option `once` `true` ist, wird der `listener` entfernt, nachdem ein `type`-Ereignis das nächste Mal ausgelöst wurde.

Die Option `capture` wird von Node.js in keiner funktionalen Weise verwendet, außer zum Verfolgen registrierter Ereignis-Listener gemäß der `EventTarget`-Spezifikation. Insbesondere wird die Option `capture` als Teil des Schlüssels verwendet, wenn ein `listener` registriert wird. Jeder einzelne `listener` kann einmal mit `capture = false` und einmal mit `capture = true` hinzugefügt werden.

```js [ESM]
function handler(event) {}

const target = new EventTarget();
target.addEventListener('foo', handler, { capture: true });  // first
target.addEventListener('foo', handler, { capture: false }); // second

// Removes the second instance of handler
target.removeEventListener('foo', handler);

// Removes the first instance of handler
target.removeEventListener('foo', handler, { capture: true });
```

#### `eventTarget.dispatchEvent(event)` {#eventtargetdispatcheventevent}

**Hinzugefügt in: v14.5.0**

- `event` [\<Event\>](/de/nodejs/api/events#class-event)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn entweder das Attribut `cancelable` des Ereignisses den Wert false hat oder seine Methode `preventDefault()` nicht aufgerufen wurde, andernfalls `false`.

Sendet das `event` an die Liste der Handler für `event.type`.

Die registrierten Event-Listener werden synchron in der Reihenfolge aufgerufen, in der sie registriert wurden.

#### `eventTarget.removeEventListener(type, listener[, options])` {#eventtargetremoveeventlistenertype-listener-options}

**Hinzugefügt in: v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/de/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Entfernt den `listener` aus der Liste der Handler für das Ereignis `type`.

### Klasse: `CustomEvent` {#class-customevent}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | Nicht mehr experimentell. |
| v22.1.0, v20.13.0 | CustomEvent ist jetzt stabil. |
| v19.0.0 | Nicht mehr hinter dem `--experimental-global-customevent` CLI-Flag. |
| v18.7.0, v16.17.0 | Hinzugefügt in: v18.7.0, v16.17.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

- Erweitert: [\<Event\>](/de/nodejs/api/events#class-event)

Das `CustomEvent`-Objekt ist eine Anpassung der [`CustomEvent` Web API](https://dom.spec.whatwg.org/#customevent). Instanzen werden intern von Node.js erstellt.

#### `event.detail` {#eventdetail}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.1.0, v20.13.0 | CustomEvent ist jetzt stabil. |
| v18.7.0, v16.17.0 | Hinzugefügt in: v18.7.0, v16.17.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

- Typ: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Gibt benutzerdefinierte Daten zurück, die bei der Initialisierung übergeben wurden.

Nur-Lesen.


### Klasse: `NodeEventTarget` {#class-nodeeventtarget}

**Hinzugefügt in: v14.5.0**

- Erweitert: [\<EventTarget\>](/de/nodejs/api/events#class-eventtarget)

Das `NodeEventTarget` ist eine Node.js-spezifische Erweiterung zu `EventTarget`, die eine Teilmenge der `EventEmitter`-API emuliert.

#### `nodeEventTarget.addListener(type, listener)` {#nodeeventtargetaddlistenertype-listener}

**Hinzugefügt in: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/de/nodejs/api/events#event-listener) 
-  Gibt zurück: [\<EventTarget\>](/de/nodejs/api/events#class-eventtarget) this 

Node.js-spezifische Erweiterung der Klasse `EventTarget`, die die äquivalente `EventEmitter`-API emuliert. Der einzige Unterschied zwischen `addListener()` und `addEventListener()` besteht darin, dass `addListener()` eine Referenz auf das `EventTarget` zurückgibt.

#### `nodeEventTarget.emit(type, arg)` {#nodeeventtargetemittype-arg}

**Hinzugefügt in: v15.2.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `arg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn Ereignis-Listener für den `type` registriert sind, andernfalls `false`.

Node.js-spezifische Erweiterung der Klasse `EventTarget`, die das `arg` an die Liste der Handler für `type` verteilt.

#### `nodeEventTarget.eventNames()` {#nodeeventtargeteventnames}

**Hinzugefügt in: v14.5.0**

- Gibt zurück: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Node.js-spezifische Erweiterung der Klasse `EventTarget`, die ein Array von Ereignis-`type`-Namen zurückgibt, für die Ereignis-Listener registriert sind.

#### `nodeEventTarget.listenerCount(type)` {#nodeeventtargetlistenercounttype}

**Hinzugefügt in: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
-  Gibt zurück: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 

Node.js-spezifische Erweiterung der Klasse `EventTarget`, die die Anzahl der Ereignis-Listener zurückgibt, die für den `type` registriert sind.


#### `nodeEventTarget.setMaxListeners(n)` {#nodeeventtargetsetmaxlistenersn}

**Hinzugefügt in: v14.5.0**

- `n` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js-spezifische Erweiterung der Klasse `EventTarget`, die die Anzahl der maximalen Event-Listener auf `n` setzt.

#### `nodeEventTarget.getMaxListeners()` {#nodeeventtargetgetmaxlisteners}

**Hinzugefügt in: v14.5.0**

- Gibt zurück: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js-spezifische Erweiterung der Klasse `EventTarget`, die die Anzahl der maximalen Event-Listener zurückgibt.

#### `nodeEventTarget.off(type, listener[, options])` {#nodeeventtargetofftype-listener-options}

**Hinzugefügt in: v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/de/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)


- Gibt zurück: [\<EventTarget\>](/de/nodejs/api/events#class-eventtarget) this

Node.js-spezifischer Alias für `eventTarget.removeEventListener()`.

#### `nodeEventTarget.on(type, listener)` {#nodeeventtargetontype-listener}

**Hinzugefügt in: v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/de/nodejs/api/events#event-listener)
- Gibt zurück: [\<EventTarget\>](/de/nodejs/api/events#class-eventtarget) this

Node.js-spezifischer Alias für `eventTarget.addEventListener()`.

#### `nodeEventTarget.once(type, listener)` {#nodeeventtargetoncetype-listener}

**Hinzugefügt in: v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/de/nodejs/api/events#event-listener)
- Gibt zurück: [\<EventTarget\>](/de/nodejs/api/events#class-eventtarget) this

Node.js-spezifische Erweiterung der Klasse `EventTarget`, die einen `once`-Listener für den angegebenen Event-`type` hinzufügt. Dies entspricht dem Aufruf von `on` mit der Option `once` auf `true` gesetzt.


#### `nodeEventTarget.removeAllListeners([type])` {#nodeeventtargetremovealllistenerstype}

**Hinzugefügt in: v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Rückgabe: [\<EventTarget\>](/de/nodejs/api/events#class-eventtarget) this

Node.js-spezifische Erweiterung der `EventTarget`-Klasse. Wenn `type` angegeben ist, werden alle registrierten Listener für `type` entfernt, andernfalls werden alle registrierten Listener entfernt.

#### `nodeEventTarget.removeListener(type, listener[, options])` {#nodeeventtargetremovelistenertype-listener-options}

**Hinzugefügt in: v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/de/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

- Rückgabe: [\<EventTarget\>](/de/nodejs/api/events#class-eventtarget) this

Node.js-spezifische Erweiterung der `EventTarget`-Klasse, die den `listener` für den gegebenen `type` entfernt. Der einzige Unterschied zwischen `removeListener()` und `removeEventListener()` besteht darin, dass `removeListener()` eine Referenz auf das `EventTarget` zurückgibt.

