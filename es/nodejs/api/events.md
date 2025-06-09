---
title: Documentación de Node.js - Eventos
description: Explora el módulo de Eventos en Node.js, que proporciona una forma de manejar operaciones asincrónicas a través de la programación basada en eventos. Aprende sobre emisores de eventos, oyentes y cómo gestionar eventos de manera efectiva.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - Eventos | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Explora el módulo de Eventos en Node.js, que proporciona una forma de manejar operaciones asincrónicas a través de la programación basada en eventos. Aprende sobre emisores de eventos, oyentes y cómo gestionar eventos de manera efectiva.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - Eventos | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Explora el módulo de Eventos en Node.js, que proporciona una forma de manejar operaciones asincrónicas a través de la programación basada en eventos. Aprende sobre emisores de eventos, oyentes y cómo gestionar eventos de manera efectiva.
---


# Eventos {#events}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código Fuente:** [lib/events.js](https://github.com/nodejs/node/blob/v23.5.0/lib/events.js)

Gran parte de la API central de Node.js está construida alrededor de una arquitectura asíncrona idiomática basada en eventos en la que ciertos tipos de objetos (llamados "emisores") emiten eventos nombrados que hacen que se llamen objetos `Function` ("oyentes").

Por ejemplo: un objeto [`net.Server`](/es/nodejs/api/net#class-netserver) emite un evento cada vez que un par se conecta a él; un [`fs.ReadStream`](/es/nodejs/api/fs#class-fsreadstream) emite un evento cuando se abre el archivo; un [stream](/es/nodejs/api/stream) emite un evento cada vez que hay datos disponibles para ser leídos.

Todos los objetos que emiten eventos son instancias de la clase `EventEmitter`. Estos objetos exponen una función `eventEmitter.on()` que permite adjuntar una o más funciones a eventos nombrados emitidos por el objeto. Normalmente, los nombres de los eventos son cadenas en formato camelCase, pero se puede utilizar cualquier clave de propiedad de JavaScript válida.

Cuando el objeto `EventEmitter` emite un evento, todas las funciones adjuntas a ese evento específico se llaman *síncronamente*. Cualquier valor devuelto por los oyentes llamados se *ignora* y se descarta.

El siguiente ejemplo muestra una instancia simple de `EventEmitter` con un solo oyente. El método `eventEmitter.on()` se utiliza para registrar oyentes, mientras que el método `eventEmitter.emit()` se utiliza para activar el evento.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('¡Se produjo un evento!');
});
myEmitter.emit('event');
```

```js [CJS]
const EventEmitter = require('node:events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('¡Se produjo un evento!');
});
myEmitter.emit('event');
```
:::

## Pasar argumentos y `this` a los oyentes {#passing-arguments-and-this-to-listeners}

El método `eventEmitter.emit()` permite pasar un conjunto arbitrario de argumentos a las funciones de escucha. Tenga en cuenta que cuando se llama a una función de escucha ordinaria, la palabra clave estándar `this` se establece intencionalmente para hacer referencia a la instancia de `EventEmitter` a la que está adjunto el oyente.

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

Es posible utilizar Funciones de Flecha ES6 como oyentes, sin embargo, al hacerlo, la palabra clave `this` ya no hará referencia a la instancia `EventEmitter`:

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


## Asíncrono vs. síncrono {#asynchronous-vs-synchronous}

El `EventEmitter` llama a todos los listeners de forma síncrona en el orden en que fueron registrados. Esto asegura la secuenciación adecuada de los eventos y ayuda a evitar condiciones de carrera y errores lógicos. Cuando es apropiado, las funciones de escucha pueden cambiar a un modo de operación asíncrono utilizando los métodos `setImmediate()` o `process.nextTick()`:

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('esto ocurre de forma asíncrona');
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
    console.log('esto ocurre de forma asíncrona');
  });
});
myEmitter.emit('event', 'a', 'b');
```
:::

## Manejo de eventos una sola vez {#handling-events-only-once}

Cuando un listener se registra utilizando el método `eventEmitter.on()`, ese listener se invoca *cada vez* que se emite el evento nombrado.

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

Usando el método `eventEmitter.once()`, es posible registrar un listener que se llama como máximo una vez para un evento en particular. Una vez que se emite el evento, el listener se anula y *luego* se llama.

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


## Eventos de error {#error-events}

Cuando ocurre un error dentro de una instancia de `EventEmitter`, la acción típica es que se emita un evento `'error'`. Estos se tratan como casos especiales dentro de Node.js.

Si un `EventEmitter` *no* tiene al menos un listener registrado para el evento `'error'`, y se emite un evento `'error'`, el error es lanzado, se imprime un stack trace y el proceso de Node.js se cierra.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// Lanza un error y cierra Node.js
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// Lanza un error y cierra Node.js
```
:::

Para evitar que el proceso de Node.js se cierre, se puede usar el módulo [`domain`](/es/nodejs/api/domain). (Sin embargo, ten en cuenta que el módulo `node:domain` está obsoleto).

Como práctica recomendada, siempre se deben agregar listeners para los eventos `'error'`.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// Imprime: whoops! there was an error
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// Imprime: whoops! there was an error
```
:::

Es posible monitorizar los eventos `'error'` sin consumir el error emitido instalando un listener usando el símbolo `events.errorMonitor`.

::: code-group
```js [ESM]
import { EventEmitter, errorMonitor } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// Aún lanza un error y cierra Node.js
```

```js [CJS]
const { EventEmitter, errorMonitor } = require('node:events');

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// Aún lanza un error y cierra Node.js
```
:::


## Capturar rechazos de promesas {#capture-rejections-of-promises}

Usar funciones `async` con controladores de eventos es problemático, porque puede llevar a un rechazo no manejado en caso de una excepción lanzada:

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

La opción `captureRejections` en el constructor `EventEmitter` o el cambio de la configuración global cambian este comportamiento, instalando un controlador `.then(undefined, handler)` en la `Promise`. Este controlador enruta la excepción asíncronamente al método [`Symbol.for('nodejs.rejection')`](/es/nodejs/api/events#emittersymbolfornodejsrejectionerr-eventname-args) si existe uno, o al controlador de eventos [`'error'`](/es/nodejs/api/events#error-events) si no existe ninguno.

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

Establecer `events.captureRejections = true` cambiará el valor predeterminado para todas las nuevas instancias de `EventEmitter`.

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

Los eventos `'error'` que son generados por el comportamiento de `captureRejections` no tienen un controlador catch para evitar bucles de error infinitos: la recomendación es **no usar funciones <code>async</code> como controladores de eventos <code>'error'</code>**.


## Clase: `EventEmitter` {#class-eventemitter}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.4.0, v12.16.0 | Se agregó la opción captureRejections. |
| v0.1.26 | Agregado en: v0.1.26 |
:::

La clase `EventEmitter` está definida y expuesta por el módulo `node:events`:

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
```

```js [CJS]
const EventEmitter = require('node:events');
```
:::

Todos los `EventEmitter` emiten el evento `'newListener'` cuando se agregan nuevos listeners y `'removeListener'` cuando se eliminan listeners existentes.

Admite la siguiente opción:

- `captureRejections` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Habilita la [captura automática del rechazo de promesas](/es/nodejs/api/events#capture-rejections-of-promises). **Predeterminado:** `false`.

### Evento: `'newListener'` {#event-newlistener}

**Agregado en: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) El nombre del evento que se está escuchando
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función del controlador de eventos

La instancia de `EventEmitter` emitirá su propio evento `'newListener'` *antes* de que se agregue un listener a su array interno de listeners.

Los listeners registrados para el evento `'newListener'` reciben el nombre del evento y una referencia al listener que se está agregando.

El hecho de que el evento se active antes de agregar el listener tiene un efecto secundario sutil pero importante: cualquier listener *adicional* registrado con el mismo `name` *dentro* del callback `'newListener'` se inserta *antes* del listener que está en proceso de ser agregado.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// Solo haz esto una vez para no entrar en un bucle infinito
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // Inserta un nuevo listener al frente
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// Imprime:
//   B
//   A
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// Solo haz esto una vez para no entrar en un bucle infinito
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // Inserta un nuevo listener al frente
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// Imprime:
//   B
//   A
```
:::


### Evento: `'removeListener'` {#event-removelistener}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.1.0, v4.7.0 | Para los listeners adjuntos usando `.once()`, el argumento `listener` ahora produce la función listener original. |
| v0.9.3 | Añadido en: v0.9.3 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) El nombre del evento
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función de controlador de eventos

El evento `'removeListener'` se emite *después* de que se elimina el `listener`.

### `emitter.addListener(eventName, listener)` {#emitteraddlistenereventname-listener}

**Añadido en: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Alias para `emitter.on(eventName, listener)`.

### `emitter.emit(eventName[, ...args])` {#emitteremiteventname-args}

**Añadido en: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Llama sincrónicamente a cada uno de los listeners registrados para el evento llamado `eventName`, en el orden en que fueron registrados, pasando los argumentos suministrados a cada uno.

Devuelve `true` si el evento tenía listeners, `false` en caso contrario.

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

**Agregado en: v6.0.0**

- Devuelve: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

Devuelve un array que enumera los eventos para los que el emisor ha registrado listeners. Los valores en el array son strings o `Symbol`s.

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

**Agregado en: v1.0.0**

- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Devuelve el valor máximo actual de listeners para el `EventEmitter` que se establece mediante [`emitter.setMaxListeners(n)`](/es/nodejs/api/events#emittersetmaxlistenersn) o por defecto es [`events.defaultMaxListeners`](/es/nodejs/api/events#eventsdefaultmaxlisteners).

### `emitter.listenerCount(eventName[, listener])` {#emitterlistenercounteventname-listener}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.8.0, v18.16.0 | Se agregó el argumento `listener`. |
| v3.2.0 | Agregado en: v3.2.0 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) El nombre del evento que se está escuchando
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función controlador de eventos
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Devuelve el número de listeners que están escuchando el evento llamado `eventName`. Si se proporciona `listener`, devolverá cuántas veces se encuentra el listener en la lista de listeners del evento.


### `emitter.listeners(eventName)` {#emitterlistenerseventname}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v7.0.0 | Para los listeners adjuntos usando `.once()` ahora devuelve los listeners originales en lugar de las funciones envolventes. |
| v0.1.26 | Añadido en: v0.1.26 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- Devuelve: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Devuelve una copia del array de listeners para el evento llamado `eventName`.

```js [ESM]
server.on('connection', (stream) => {
  console.log('¡alguien se ha conectado!');
});
console.log(util.inspect(server.listeners('connection')));
// Imprime: [ [Function] ]
```
### `emitter.off(eventName, listener)` {#emitteroffeventname-listener}

**Añadido en: v10.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter)

Alias para [`emitter.removeListener()`](/es/nodejs/api/events#emitterremovelistenereventname-listener).

### `emitter.on(eventName, listener)` {#emitteroneventname-listener}

**Añadido en: v0.1.101**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) El nombre del evento.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función de callback
- Devuelve: [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter)

Añade la función `listener` al final del array de listeners para el evento llamado `eventName`. No se realizan comprobaciones para ver si el `listener` ya ha sido añadido. Múltiples llamadas pasando la misma combinación de `eventName` y `listener` resultarán en que el `listener` sea añadido y llamado, múltiples veces.

```js [ESM]
server.on('connection', (stream) => {
  console.log('¡alguien se ha conectado!');
});
```
Devuelve una referencia al `EventEmitter`, para que las llamadas puedan ser encadenadas.

Por defecto, los listeners de eventos son invocados en el orden en que son añadidos. El método `emitter.prependListener()` puede ser utilizado como una alternativa para añadir el listener de evento al principio del array de listeners.



::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Imprime:
//   b
//   a
```

```js [CJS]
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Imprime:
//   b
//   a
```
:::


### `emitter.once(eventName, listener)` {#emitteronceeventname-listener}

**Agregado en: v0.3.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) El nombre del evento.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función de retrollamada
- Regresa: [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter)

Añade una función `listener` **de una sola vez** para el evento llamado `eventName`. La próxima vez que se active `eventName`, este listener se elimina y luego se invoca.

```js [ESM]
server.once('connection', (stream) => {
  console.log('¡Ah, tenemos nuestro primer usuario!');
});
```
Regresa una referencia al `EventEmitter`, para que las llamadas puedan ser encadenadas.

Por defecto, los listener de eventos son invocados en el orden en que son añadidos. El método `emitter.prependOnceListener()` puede ser usado como una alternativa para añadir el listener de eventos al principio del arreglo de listeners.



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

**Agregado en: v6.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) El nombre del evento.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función de retrollamada
- Regresa: [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter)

Añade la función `listener` al *principio* del arreglo de listeners para el evento llamado `eventName`. No se realizan comprobaciones para ver si el `listener` ya ha sido añadido. Múltiples llamadas que pasen la misma combinación de `eventName` y `listener` resultarán en que el `listener` sea añadido y llamado, múltiples veces.

```js [ESM]
server.prependListener('connection', (stream) => {
  console.log('¡Alguien se conectó!');
});
```
Regresa una referencia al `EventEmitter`, para que las llamadas puedan ser encadenadas.


### `emitter.prependOnceListener(eventName, listener)` {#emitterprependoncelistenereventname-listener}

**Añadido en: v6.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) El nombre del evento.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función de callback
- Devuelve: [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter)

Añade una función `listener` de **una sola vez** para el evento llamado `eventName` al *principio* del array de listeners. La próxima vez que se dispare `eventName`, este listener se eliminará y luego se invocará.

```js [ESM]
server.prependOnceListener('connection', (stream) => {
  console.log('¡Ah, tenemos nuestro primer usuario!');
});
```
Devuelve una referencia al `EventEmitter`, para que las llamadas puedan ser encadenadas.

### `emitter.removeAllListeners([eventName])` {#emitterremovealllistenerseventname}

**Añadido en: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- Devuelve: [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter)

Elimina todos los listeners, o aquellos del `eventName` especificado.

Es una mala práctica eliminar listeners añadidos en otra parte del código, particularmente cuando la instancia de `EventEmitter` fue creada por algún otro componente o módulo (ej. sockets o streams de archivos).

Devuelve una referencia al `EventEmitter`, para que las llamadas puedan ser encadenadas.

### `emitter.removeListener(eventName, listener)` {#emitterremovelistenereventname-listener}

**Añadido en: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter)

Elimina el `listener` especificado del array de listeners para el evento llamado `eventName`.

```js [ESM]
const callback = (stream) => {
  console.log('¡alguien se ha conectado!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```
`removeListener()` eliminará, como máximo, una instancia de un listener del array de listeners. Si cualquier listener ha sido añadido múltiples veces al array de listeners para el `eventName` especificado, entonces `removeListener()` debe ser llamado múltiples veces para eliminar cada instancia.

Una vez que un evento es emitido, todos los listeners adjuntos a él en el momento de la emisión son llamados en orden. Esto implica que cualquier llamada a `removeListener()` o `removeAllListeners()` *después* de emitir y *antes* de que el último listener termine su ejecución no los eliminará de `emit()` en progreso. Los eventos subsecuentes se comportan como se espera.

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

// callbackA elimina el listener callbackB pero aún así será llamado.
// Array de listeners interno en el momento de la emisión [callbackA, callbackB]
myEmitter.emit('event');
// Imprime:
//   A
//   B

// callbackB ahora está eliminado.
// Array de listeners interno [callbackA]
myEmitter.emit('event');
// Imprime:
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

// callbackA elimina el listener callbackB pero aún así será llamado.
// Array de listeners interno en el momento de la emisión [callbackA, callbackB]
myEmitter.emit('event');
// Imprime:
//   A
//   B

// callbackB ahora está eliminado.
// Array de listeners interno [callbackA]
myEmitter.emit('event');
// Imprime:
//   A
```
:::

Debido a que los listeners son gestionados utilizando un array interno, llamar a esto cambiará los índices de posición de cualquier listener registrado *después* del listener que está siendo eliminado. Esto no impactará el orden en el que los listeners son llamados, pero significa que cualquier copia del array de listeners como la devuelta por el método `emitter.listeners()` necesitará ser recreada.

Cuando una única función ha sido añadida como un controlador múltiples veces para un único evento (como en el ejemplo de abajo), `removeListener()` eliminará la instancia añadida más recientemente. En el ejemplo, el listener `once('ping')` es eliminado:

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

Devuelve una referencia al `EventEmitter`, para que las llamadas puedan ser encadenadas.


### `emitter.setMaxListeners(n)` {#emittersetmaxlistenersn}

**Agregado en: v0.3.5**

- `n` [\<integer\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type)
- Devuelve: [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter)

Por defecto, los `EventEmitter`s mostrarán una advertencia si se añaden más de `10` listeners para un evento en particular. Este es un valor predeterminado útil que ayuda a encontrar fugas de memoria. El método `emitter.setMaxListeners()` permite modificar el límite para esta instancia específica de `EventEmitter`. El valor puede establecerse en `Infinity` (o `0`) para indicar un número ilimitado de listeners.

Devuelve una referencia al `EventEmitter`, de modo que las llamadas puedan encadenarse.

### `emitter.rawListeners(eventName)` {#emitterrawlistenerseventname}

**Agregado en: v9.4.0**

- `eventName` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Symbol_type)
- Devuelve: [\<Function[]\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function)

Devuelve una copia del array de listeners para el evento llamado `eventName`, incluyendo cualquier envoltorio (como los creados por `.once()`).



::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```

```js [CJS]
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```
:::


### `emitter[Symbol.for('nodejs.rejection')](err, eventName[, ...args])` {#emittersymbolfornodejsrejectionerr-eventname-args}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.4.0, v16.14.0 | Ya no es experimental. |
| v13.4.0, v12.16.0 | Agregado en: v13.4.0, v12.16.0 |
:::

- `err` Error
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

El método `Symbol.for('nodejs.rejection')` se llama en caso de que ocurra un rechazo de promesa al emitir un evento y [`captureRejections`](/es/nodejs/api/events#capture-rejections-of-promises) esté habilitado en el emisor. Es posible usar [`events.captureRejectionSymbol`](/es/nodejs/api/events#eventscapturerejectionsymbol) en lugar de `Symbol.for('nodejs.rejection')`.

::: code-group
```js [ESM]
import { EventEmitter, captureRejectionSymbol } from 'node:events';

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('el rechazo ocurrió para', event, 'con', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Desmonta el recurso aquí.
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
    console.log('el rechazo ocurrió para', event, 'con', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Desmonta el recurso aquí.
  }
}
```
:::

## `events.defaultMaxListeners` {#eventsdefaultmaxlisteners}

**Agregado en: v0.11.2**

Por defecto, se puede registrar un máximo de `10` listeners para cualquier evento individual. Este límite puede ser cambiado para instancias individuales de `EventEmitter` usando el método [`emitter.setMaxListeners(n)`](/es/nodejs/api/events#emittersetmaxlistenersn). Para cambiar el valor por defecto para *todas* las instancias de `EventEmitter`, la propiedad `events.defaultMaxListeners` puede ser utilizada. Si este valor no es un número positivo, se lanza un `RangeError`.

Tenga cuidado al establecer `events.defaultMaxListeners` porque el cambio afecta a *todas* las instancias de `EventEmitter`, incluyendo aquellas creadas antes de que se haga el cambio. Sin embargo, llamar a [`emitter.setMaxListeners(n)`](/es/nodejs/api/events#emittersetmaxlistenersn) todavía tiene precedencia sobre `events.defaultMaxListeners`.

Este no es un límite estricto. La instancia de `EventEmitter` permitirá que se agreguen más listeners, pero emitirá una advertencia de rastreo a stderr indicando que se ha detectado una "posible fuga de memoria de EventEmitter". Para cualquier `EventEmitter` individual, los métodos `emitter.getMaxListeners()` y `emitter.setMaxListeners()` se pueden utilizar para evitar temporalmente esta advertencia:

`defaultMaxListeners` no tiene ningún efecto en las instancias de `AbortSignal`. Si bien todavía es posible utilizar [`emitter.setMaxListeners(n)`](/es/nodejs/api/events#emittersetmaxlistenersn) para establecer un límite de advertencia para instancias individuales de `AbortSignal`, por defecto las instancias de `AbortSignal` no advertirán.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // hacer cosas
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```

```js [CJS]
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // hacer cosas
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```
:::

La flag de línea de comandos [`--trace-warnings`](/es/nodejs/api/cli#--trace-warnings) se puede usar para mostrar el stack trace para tales advertencias.

La advertencia emitida se puede inspeccionar con [`process.on('warning')`](/es/nodejs/api/process#event-warning) y tendrá las propiedades adicionales `emitter`, `type` y `count`, que se refieren a la instancia del emisor de eventos, el nombre del evento y el número de listeners adjuntos, respectivamente. Su propiedad `name` se establece en `'MaxListenersExceededWarning'`.


## `events.errorMonitor` {#eventserrormonitor}

**Agregado en: v13.6.0, v12.17.0**

Este símbolo se usará para instalar un listener solo para monitorear eventos `'error'`. Los listeners instalados usando este símbolo se llaman antes de que se llamen los listeners `'error'` regulares.

Instalar un listener usando este símbolo no cambia el comportamiento una vez que se emite un evento `'error'`. Por lo tanto, el proceso seguirá fallando si no se instala un listener `'error'` regular.

## `events.getEventListeners(emitterOrTarget, eventName)` {#eventsgeteventlistenersemitterortarget-eventname}

**Agregado en: v15.2.0, v14.17.0**

- `emitterOrTarget` [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter) | [\<EventTarget\>](/es/nodejs/api/events#class-eventtarget)
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- Devuelve: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Devuelve una copia del array de listeners para el evento llamado `eventName`.

Para `EventEmitter`s, esto se comporta exactamente igual que llamar a `.listeners` en el emisor.

Para `EventTarget`s, esta es la única forma de obtener los listeners del evento para el objetivo del evento. Esto es útil para fines de depuración y diagnóstico.

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

**Agregado en: v19.9.0, v18.17.0**

- `emitterOrTarget` [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter) | [\<EventTarget\>](/es/nodejs/api/events#class-eventtarget)
- Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Devuelve la cantidad máxima de listeners actualmente establecida.

Para `EventEmitter`s, esto se comporta exactamente igual que llamar a `.getMaxListeners` en el emisor.

Para `EventTarget`s, esta es la única forma de obtener el número máximo de listeners de eventos para el objetivo del evento. Si el número de controladores de eventos en un solo EventTarget supera el máximo establecido, el EventTarget imprimirá una advertencia.

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

::: info [Historial]
| Version | Cambios |
| --- | --- |
| v15.0.0 | La opción `signal` ahora es compatible. |
| v11.13.0, v10.16.0 | Agregado en: v11.13.0, v10.16.0 |
:::

- `emitter` [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter)
- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Se puede utilizar para cancelar la espera del evento.

- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Crea una `Promise` que se cumple cuando el `EventEmitter` emite el evento dado o que se rechaza si el `EventEmitter` emite `'error'` mientras espera. La `Promise` se resolverá con un array de todos los argumentos emitidos al evento dado.

Este método es intencionalmente genérico y funciona con la interfaz [EventTarget](https://dom.spec.whatwg.org/#interface-eventtarget) de la plataforma web, que no tiene semántica especial de evento `'error'` y no escucha el evento `'error'`.

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

El manejo especial del evento `'error'` solo se usa cuando `events.once()` se usa para esperar otro evento. Si `events.once()` se usa para esperar el evento '`error'` en sí, entonces se trata como cualquier otro tipo de evento sin manejo especial:

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

Se puede usar un [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) para cancelar la espera del evento:

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


### Esperando múltiples eventos emitidos en `process.nextTick()` {#awaiting-multiple-events-emitted-on-processnexttick}

Hay un caso límite que vale la pena señalar al usar la función `events.once()` para esperar múltiples eventos emitidos en el mismo lote de operaciones `process.nextTick()`, o siempre que se emitan múltiples eventos sincrónicamente. Específicamente, debido a que la cola `process.nextTick()` se vacía antes que la cola de microtareas `Promise`, y debido a que `EventEmitter` emite todos los eventos sincrónicamente, es posible que `events.once()` pierda un evento.

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';
import process from 'node:process';

const myEE = new EventEmitter();

async function foo() {
  await once(myEE, 'bar');
  console.log('bar');

  // Esta promesa nunca se resolverá porque el evento 'foo' ya se
  // habrá emitido antes de que se cree la promesa.
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

  // Esta promesa nunca se resolverá porque el evento 'foo' ya se
  // habrá emitido antes de que se cree la promesa.
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

Para capturar ambos eventos, cree cada una de las promesas *antes* de esperar cualquiera de ellas, entonces se hace posible usar `Promise.all()`, `Promise.race()`, o `Promise.allSettled()`:

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

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.4.0, v16.14.0 | Ya no es experimental. |
| v13.4.0, v12.16.0 | Añadido en: v13.4.0, v12.16.0 |
:::

Valor: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Cambia la opción `captureRejections` predeterminada en todos los nuevos objetos `EventEmitter`.

## `events.captureRejectionSymbol` {#eventscapturerejectionsymbol}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.4.0, v16.14.0 | Ya no es experimental. |
| v13.4.0, v12.16.0 | Añadido en: v13.4.0, v12.16.0 |
:::

Valor: `Symbol.for('nodejs.rejection')`

Vea cómo escribir un [manejador de rechazo personalizado](/es/nodejs/api/events#emittersymbolfornodejsrejectionerr-eventname-args).

## `events.listenerCount(emitter, eventName)` {#eventslistenercountemitter-eventname}

**Añadido en: v0.9.12**

**Obsoleto desde: v3.2.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Utilice [`emitter.listenerCount()`](/es/nodejs/api/events#emitterlistenercounteventname-listener) en su lugar.
:::

- `emitter` [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter) El emisor a consultar
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) El nombre del evento

Un método de clase que devuelve el número de listeners para el `eventName` dado registrado en el `emitter` dado.

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

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.0.0, v20.13.0 | Soporte para las opciones `highWaterMark` y `lowWaterMark`, para mantener la consistencia. Las opciones antiguas aún son compatibles. |
| v20.0.0 | Las opciones `close`, `highWatermark` y `lowWatermark` ahora son compatibles. |
| v13.6.0, v12.16.0 | Añadido en: v13.6.0, v12.16.0 |
:::

- `emitter` [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter)
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) El nombre del evento que se está escuchando
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Se puede utilizar para cancelar los eventos en espera.
    - `close` - [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombres de eventos que finalizarán la iteración.
    - `highWaterMark` - [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `Number.MAX_SAFE_INTEGER` La marca de agua alta. El emisor se pausa cada vez que el tamaño de los eventos en búfer es superior a esta. Solo se admite en emisores que implementan los métodos `pause()` y `resume()`.
    - `lowWaterMark` - [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `1` La marca de agua baja. El emisor se reanuda cada vez que el tamaño de los eventos en búfer es inferior a esta. Solo se admite en emisores que implementan los métodos `pause()` y `resume()`.

- Devuelve: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) que itera sobre los eventos `eventName` emitidos por el `emitter`

::: code-group
```js [ESM]
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

// Emitir más tarde
process.nextTick(() => {
  ee.emit('foo', 'bar');
  ee.emit('foo', 42);
});

for await (const event of on(ee, 'foo')) {
  // La ejecución de este bloque interno es sincrónica y
  // procesa un evento a la vez (incluso con await). No utilizar
  // si se requiere la ejecución concurrente.
  console.log(event); // imprime ['bar'] [42]
}
// Inalcanzable aquí
```

```js [CJS]
const { on, EventEmitter } = require('node:events');

(async () => {
  const ee = new EventEmitter();

  // Emitir más tarde
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo')) {
    // La ejecución de este bloque interno es sincrónica y
    // procesa un evento a la vez (incluso con await). No utilizar
    // si se requiere la ejecución concurrente.
    console.log(event); // imprime ['bar'] [42]
  }
  // Inalcanzable aquí
})();
```
:::

Devuelve un `AsyncIterator` que itera sobre los eventos `eventName`. Lanzará un error si el `EventEmitter` emite `'error'`. Elimina todos los listeners al salir del bucle. El `value` devuelto por cada iteración es un array compuesto por los argumentos del evento emitido.

Se puede utilizar un [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) para cancelar la espera de eventos:

::: code-group
```js [ESM]
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Emitir más tarde
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // La ejecución de este bloque interno es sincrónica y
    // procesa un evento a la vez (incluso con await). No utilizar
    // si se requiere la ejecución concurrente.
    console.log(event); // imprime ['bar'] [42]
  }
  // Inalcanzable aquí
})();

process.nextTick(() => ac.abort());
```

```js [CJS]
const { on, EventEmitter } = require('node:events');

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Emitir más tarde
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // La ejecución de este bloque interno es sincrónica y
    // procesa un evento a la vez (incluso con await). No utilizar
    // si se requiere la ejecución concurrente.
    console.log(event); // imprime ['bar'] [42]
  }
  // Inalcanzable aquí
})();

process.nextTick(() => ac.abort());
```
:::

## `events.setMaxListeners(n[, ...eventTargets])` {#eventssetmaxlistenersn-eventtargets}

**Agregado en: v15.4.0**

- `n` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un número no negativo. El número máximo de listeners por evento `EventTarget`.
- `...eventsTargets` [\<EventTarget[]\>](/es/nodejs/api/events#class-eventtarget) | [\<EventEmitter[]\>](/es/nodejs/api/events#class-eventemitter) Cero o más instancias de [\<EventTarget\>](/es/nodejs/api/events#class-eventtarget) o [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter). Si no se especifica ninguno, `n` se establece como el máximo predeterminado para todos los objetos [\<EventTarget\>](/es/nodejs/api/events#class-eventtarget) y [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter) recién creados.

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

**Agregado en: v20.5.0, v18.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/es/nodejs/api/events#event-listener)
- Devuelve: [\<Disposable\>](https://tc39.es/proposal-explicit-resource-management/#sec-disposable-interface) Un Disposable que elimina el listener de `abort`.

Escucha una vez el evento `abort` en la `signal` proporcionada.

Escuchar el evento `abort` en las señales de aborto no es seguro y puede provocar fugas de recursos, ya que un tercero con la señal puede llamar a [`e.stopImmediatePropagation()`](/es/nodejs/api/events#eventstopimmediatepropagation). Desafortunadamente, Node.js no puede cambiar esto ya que violaría el estándar web. Además, la API original hace que sea fácil olvidarse de eliminar los listeners.

Esta API permite utilizar de forma segura `AbortSignal` en las API de Node.js al resolver estos dos problemas escuchando el evento de forma que `stopImmediatePropagation` no impida que se ejecute el listener.

Devuelve un disposable para que se pueda cancelar la suscripción más fácilmente.

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


## Clase: `events.EventEmitterAsyncResource extends EventEmitter` {#class-eventseventemitterasyncresource-extends-eventemitter}

**Agregado en: v17.4.0, v16.14.0**

Integra `EventEmitter` con [\<AsyncResource\>](/es/nodejs/api/async_hooks#class-asyncresource) para `EventEmitter`s que requieren seguimiento asíncrono manual. Específicamente, todos los eventos emitidos por instancias de `events.EventEmitterAsyncResource` se ejecutarán dentro de su [contexto asíncrono](/es/nodejs/api/async_context).

::: code-group
```js [ESM]
import { EventEmitterAsyncResource, EventEmitter } from 'node:events';
import { notStrictEqual, strictEqual } from 'node:assert';
import { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

// La herramienta de seguimiento asíncrono identificará esto como 'Q'.
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// Los listeners de 'foo' se ejecutarán en el contexto asíncrono de EventEmitters.
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// Los listeners de 'foo' en EventEmitters ordinarios que no rastrean el contexto
// asíncrono, sin embargo, se ejecutan en el mismo contexto asíncrono que emit().
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

// La herramienta de seguimiento asíncrono identificará esto como 'Q'.
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// Los listeners de 'foo' se ejecutarán en el contexto asíncrono de EventEmitters.
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// Los listeners de 'foo' en EventEmitters ordinarios que no rastrean el contexto
// asíncrono, sin embargo, se ejecutan en el mismo contexto asíncrono que emit().
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

La clase `EventEmitterAsyncResource` tiene los mismos métodos y toma las mismas opciones que `EventEmitter` y `AsyncResource` mismos.


### `new events.EventEmitterAsyncResource([options])` {#new-eventseventemitterasyncresourceoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `captureRejections` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Habilita la [captura automática del rechazo de promesas](/es/nodejs/api/events#capture-rejections-of-promises). **Predeterminado:** `false`.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El tipo de evento asíncrono. **Predeterminado:** [`new.target.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target).
    - `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El ID del contexto de ejecución que creó este evento asíncrono. **Predeterminado:** `executionAsyncId()`.
    - `requireManualDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en `true`, deshabilita `emitDestroy` cuando el objeto es recolectado por el recolector de basura. Por lo general, no es necesario establecer esto (incluso si `emitDestroy` se llama manualmente), a menos que se recupere el `asyncId` del recurso y se llame al sensible API `emitDestroy` con él. Cuando se establece en `false`, la llamada `emitDestroy` en la recolección de basura solo se realizará si hay al menos un enlace `destroy` activo. **Predeterminado:** `false`.

### `eventemitterasyncresource.asyncId` {#eventemitterasyncresourceasyncid}

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El `asyncId` único asignado al recurso.

### `eventemitterasyncresource.asyncResource` {#eventemitterasyncresourceasyncresource}

- Tipo: El [\<AsyncResource\>](/es/nodejs/api/async_hooks#class-asyncresource) subyacente.

El objeto `AsyncResource` devuelto tiene una propiedad `eventEmitter` adicional que proporciona una referencia a este `EventEmitterAsyncResource`.

### `eventemitterasyncresource.emitDestroy()` {#eventemitterasyncresourceemitdestroy}

Llama a todos los enlaces `destroy`. Esto solo debe llamarse una vez. Se producirá un error si se llama más de una vez. Esto **debe** llamarse manualmente. Si el recurso se deja para que lo recoja el GC, entonces los enlaces `destroy` nunca se llamarán.


### `eventemitterasyncresource.triggerAsyncId` {#eventemitterasyncresourcetriggerasyncid}

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El mismo `triggerAsyncId` que se pasa al constructor `AsyncResource`.

## API de `EventTarget` y `Event` {#eventtarget-and-event-api}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.0.0 | se cambió el manejo de errores de EventTarget. |
| v15.4.0 | Ya no es experimental. |
| v15.0.0 | Las clases `EventTarget` y `Event` ahora están disponibles como globales. |
| v14.5.0 | Agregado en: v14.5.0 |
:::

Los objetos `EventTarget` y `Event` son una implementación específica de Node.js de la [`EventTarget` Web API](https://dom.spec.whatwg.org/#eventtarget) que exponen algunas API principales de Node.js.

```js [ESM]
const target = new EventTarget();

target.addEventListener('foo', (event) => {
  console.log('¡ocurrió el evento foo!');
});
```
### `EventTarget` de Node.js vs. `EventTarget` del DOM {#nodejs-eventtarget-vs-dom-eventtarget}

Hay dos diferencias clave entre el `EventTarget` de Node.js y la [`EventTarget` Web API](https://dom.spec.whatwg.org/#eventtarget):

### `NodeEventTarget` vs. `EventEmitter` {#nodeeventtarget-vs-eventemitter}

El objeto `NodeEventTarget` implementa un subconjunto modificado de la API `EventEmitter` que le permite *emular* estrechamente un `EventEmitter` en ciertas situaciones. Un `NodeEventTarget` *no* es una instancia de `EventEmitter` y no se puede utilizar en lugar de un `EventEmitter` en la mayoría de los casos.

### Listener de evento {#event-listener}

Los listeners de evento registrados para un `type` de evento pueden ser funciones de JavaScript u objetos con una propiedad `handleEvent` cuyo valor es una función.

En cualquier caso, la función de controlador se invoca con el argumento `event` pasado a la función `eventTarget.dispatchEvent()`.

Se pueden utilizar funciones asíncronas como listeners de evento. Si una función de controlador asíncrona rechaza, el rechazo se captura y se gestiona como se describe en el [manejo de errores de `EventTarget`](/es/nodejs/api/events#eventtarget-error-handling).

Un error lanzado por una función de controlador no impide que se invoquen los demás controladores.

Se ignora el valor de retorno de una función de controlador.

Los controladores siempre se invocan en el orden en que se agregaron.

Las funciones de controlador pueden mutar el objeto `event`.

```js [ESM]
function handler1(event) {
  console.log(event.type);  // Imprime 'foo'
  event.a = 1;
}

async function handler2(event) {
  console.log(event.type);  // Imprime 'foo'
  console.log(event.a);  // Imprime 1
}

const handler3 = {
  handleEvent(event) {
    console.log(event.type);  // Imprime 'foo'
  },
};

const handler4 = {
  async handleEvent(event) {
    console.log(event.type);  // Imprime 'foo'
  },
};

const target = new EventTarget();

target.addEventListener('foo', handler1);
target.addEventListener('foo', handler2);
target.addEventListener('foo', handler3);
target.addEventListener('foo', handler4, { once: true });
```

### Manejo de errores de `EventTarget` {#eventtarget-error-handling}

Cuando un listener de eventos registrado lanza un error (o retorna una Promesa que es rechazada), por defecto el error es tratado como una excepción no capturada en `process.nextTick()`. Esto significa que las excepciones no capturadas en `EventTarget`s terminarán el proceso de Node.js por defecto.

Lanzar un error dentro de un listener de eventos *no* impedirá que los otros manejadores registrados sean invocados.

El `EventTarget` no implementa ningún manejo predeterminado especial para eventos de tipo `'error'` como `EventEmitter`.

Actualmente, los errores primero se reenvían al evento `process.on('error')` antes de llegar a `process.on('uncaughtException')`. Este comportamiento está obsoleto y cambiará en una versión futura para alinear `EventTarget` con otras API de Node.js. Cualquier código que dependa del evento `process.on('error')` debe alinearse con el nuevo comportamiento.

### Clase: `Event` {#class-event}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | La clase `Event` ahora está disponible a través del objeto global. |
| v14.5.0 | Añadido en: v14.5.0 |
:::

El objeto `Event` es una adaptación de la [`Event` Web API](https://dom.spec.whatwg.org/#event). Las instancias son creadas internamente por Node.js.

#### `event.bubbles` {#eventbubbles}

**Añadido en: v14.5.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Siempre retorna `false`.

Esto no se usa en Node.js y se proporciona puramente para completitud.

#### `event.cancelBubble` {#eventcancelbubble}

**Añadido en: v14.5.0**

::: info [Estable: 3 - Legado]
[Estable: 3](/es/nodejs/api/documentation#stability-index) [Estabilidad: 3](/es/nodejs/api/documentation#stability-index) - Legado: Use [`event.stopPropagation()`](/es/nodejs/api/events#eventstoppropagation) en su lugar.
:::

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Alias para `event.stopPropagation()` si se establece en `true`. Esto no se usa en Node.js y se proporciona puramente para completitud.

#### `event.cancelable` {#eventcancelable}

**Añadido en: v14.5.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Verdadero si el evento fue creado con la opción `cancelable`.


#### `event.composed` {#eventcomposed}

**Añadido en: v14.5.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Siempre devuelve `false`.

Esto no se utiliza en Node.js y se proporciona únicamente para que esté completo.

#### `event.composedPath()` {#eventcomposedpath}

**Añadido en: v14.5.0**

Devuelve un array que contiene el `EventTarget` actual como la única entrada o vacío si el evento no se está despachando. Esto no se utiliza en Node.js y se proporciona únicamente para que esté completo.

#### `event.currentTarget` {#eventcurrenttarget}

**Añadido en: v14.5.0**

- Tipo: [\<EventTarget\>](/es/nodejs/api/events#class-eventtarget) El `EventTarget` que despacha el evento.

Alias para `event.target`.

#### `event.defaultPrevented` {#eventdefaultprevented}

**Añadido en: v14.5.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Es `true` si `cancelable` es `true` y se ha llamado a `event.preventDefault()`.

#### `event.eventPhase` {#eventeventphase}

**Añadido en: v14.5.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Devuelve `0` mientras no se está despachando un evento, `2` mientras se está despachando.

Esto no se utiliza en Node.js y se proporciona únicamente para que esté completo.

#### `event.initEvent(type[, bubbles[, cancelable]])` {#eventiniteventtype-bubbles-cancelable}

**Añadido en: v19.5.0**

::: info [Estable: 3 - Legacy]
[Estable: 3](/es/nodejs/api/documentation#stability-index) [Estabilidad: 3](/es/nodejs/api/documentation#stability-index) - Legacy: La especificación WHATWG lo considera obsoleto y los usuarios no deberían utilizarlo en absoluto.
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `bubbles` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `cancelable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Redundante con los constructores de eventos e incapaz de establecer `composed`. Esto no se utiliza en Node.js y se proporciona únicamente para que esté completo.

#### `event.isTrusted` {#eventistrusted}

**Añadido en: v14.5.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

El evento `"abort"` de [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) se emite con `isTrusted` establecido en `true`. El valor es `false` en todos los demás casos.


#### `event.preventDefault()` {#eventpreventdefault}

**Añadido en: v14.5.0**

Establece la propiedad `defaultPrevented` en `true` si `cancelable` es `true`.

#### `event.returnValue` {#eventreturnvalue}

**Añadido en: v14.5.0**

::: info [Estable: 3 - Legado]
[Estable: 3](/es/nodejs/api/documentation#stability-index) [Estabilidad: 3](/es/nodejs/api/documentation#stability-index) - Legado: Use [`event.defaultPrevented`](/es/nodejs/api/events#eventdefaultprevented) en su lugar.
:::

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Verdadero si el evento no ha sido cancelado.

El valor de `event.returnValue` es siempre lo opuesto a `event.defaultPrevented`. Esto no se usa en Node.js y se proporciona puramente para que esté completo.

#### `event.srcElement` {#eventsrcelement}

**Añadido en: v14.5.0**

::: info [Estable: 3 - Legado]
[Estable: 3](/es/nodejs/api/documentation#stability-index) [Estabilidad: 3](/es/nodejs/api/documentation#stability-index) - Legado: Use [`event.target`](/es/nodejs/api/events#eventtarget) en su lugar.
:::

- Tipo: [\<EventTarget\>](/es/nodejs/api/events#class-eventtarget) El `EventTarget` que despacha el evento.

Alias para `event.target`.

#### `event.stopImmediatePropagation()` {#eventstopimmediatepropagation}

**Añadido en: v14.5.0**

Detiene la invocación de los listeners de eventos después de que el actual se complete.

#### `event.stopPropagation()` {#eventstoppropagation}

**Añadido en: v14.5.0**

Esto no se usa en Node.js y se proporciona puramente para que esté completo.

#### `event.target` {#eventtarget}

**Añadido en: v14.5.0**

- Tipo: [\<EventTarget\>](/es/nodejs/api/events#class-eventtarget) El `EventTarget` que despacha el evento.

#### `event.timeStamp` {#eventtimestamp}

**Añadido en: v14.5.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El timestamp en milisegundos cuando el objeto `Event` fue creado.

#### `event.type` {#eventtype}

**Añadido en: v14.5.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El identificador del tipo de evento.

### Clase: `EventTarget` {#class-eventtarget}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | La clase `EventTarget` ahora está disponible a través del objeto global. |
| v14.5.0 | Añadido en: v14.5.0 |
:::


#### `eventTarget.addEventListener(type, listener[, options])` {#eventtargetaddeventlistenertype-listener-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.4.0 | Se añade soporte para la opción `signal`. |
| v14.5.0 | Añadido en: v14.5.0 |
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/es/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `once` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, el listener se elimina automáticamente la primera vez que se invoca. **Predeterminado:** `false`.
    - `passive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, sirve como una pista de que el listener no llamará al método `preventDefault()` del objeto `Event`. **Predeterminado:** `false`.
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) No es utilizado directamente por Node.js. Se añade para completar la API. **Predeterminado:** `false`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) El listener se eliminará cuando se llame al método `abort()` del objeto AbortSignal dado.

Añade un nuevo controlador para el evento `type`. Cualquier `listener` dado se añade solo una vez por `type` y por valor de la opción `capture`.

Si la opción `once` es `true`, el `listener` se elimina después de la próxima vez que se despache un evento `type`.

La opción `capture` no es utilizada por Node.js de ninguna manera funcional que no sea el seguimiento de los listeners de eventos registrados según la especificación `EventTarget`. Específicamente, la opción `capture` se utiliza como parte de la clave al registrar un `listener`. Cualquier `listener` individual puede añadirse una vez con `capture = false`, y una vez con `capture = true`.

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

**Agregado en: v14.5.0**

- `event` [\<Event\>](/es/nodejs/api/events#class-event)
- Regresa: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si el valor del atributo `cancelable` del evento es falso o no se invocó su método `preventDefault()`, de lo contrario `false`.

Envía el `event` a la lista de manejadores para `event.type`.

Los listeners de eventos registrados se invocan sincrónicamente en el orden en que fueron registrados.

#### `eventTarget.removeEventListener(type, listener[, options])` {#eventtargetremoveeventlistenertype-listener-options}

**Agregado en: v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/es/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

 

Elimina el `listener` de la lista de manejadores para el `type` del evento.

### Clase: `CustomEvent` {#class-customevent}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Ya no es experimental. |
| v22.1.0, v20.13.0 | CustomEvent ahora es estable. |
| v19.0.0 | Ya no está detrás del flag CLI `--experimental-global-customevent`. |
| v18.7.0, v16.17.0 | Agregado en: v18.7.0, v16.17.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

- Extiende: [\<Event\>](/es/nodejs/api/events#class-event)

El objeto `CustomEvent` es una adaptación de la [`CustomEvent` Web API](https://dom.spec.whatwg.org/#customevent). Las instancias se crean internamente por Node.js.

#### `event.detail` {#eventdetail}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.1.0, v20.13.0 | CustomEvent ahora es estable. |
| v18.7.0, v16.17.0 | Agregado en: v18.7.0, v16.17.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

- Tipo: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Regresa datos personalizados pasados al inicializar.

Solo lectura.


### Clase: `NodeEventTarget` {#class-nodeeventtarget}

**Agregado en: v14.5.0**

- Extiende: [\<EventTarget\>](/es/nodejs/api/events#class-eventtarget)

`NodeEventTarget` es una extensión específica de Node.js a `EventTarget` que emula un subconjunto de la API `EventEmitter`.

#### `nodeEventTarget.addListener(type, listener)` {#nodeeventtargetaddlistenertype-listener}

**Agregado en: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/es/nodejs/api/events#event-listener) 
-  Devuelve: [\<EventTarget\>](/es/nodejs/api/events#class-eventtarget) this 

Extensión específica de Node.js a la clase `EventTarget` que emula la API `EventEmitter` equivalente. La única diferencia entre `addListener()` y `addEventListener()` es que `addListener()` devolverá una referencia a `EventTarget`.

#### `nodeEventTarget.emit(type, arg)` {#nodeeventtargetemittype-arg}

**Agregado en: v15.2.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `arg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si existen detectores de eventos registrados para el `type`, de lo contrario `false`.

Extensión específica de Node.js a la clase `EventTarget` que despacha el `arg` a la lista de controladores para `type`.

#### `nodeEventTarget.eventNames()` {#nodeeventtargeteventnames}

**Agregado en: v14.5.0**

- Devuelve: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Extensión específica de Node.js a la clase `EventTarget` que devuelve un array de nombres `type` de evento para los que se registran detectores de eventos.

#### `nodeEventTarget.listenerCount(type)` {#nodeeventtargetlistenercounttype}

**Agregado en: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
-  Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 

Extensión específica de Node.js a la clase `EventTarget` que devuelve el número de detectores de eventos registrados para el `type`.


#### `nodeEventTarget.setMaxListeners(n)` {#nodeeventtargetsetmaxlistenersn}

**Agregado en: v14.5.0**

- `n` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Extensión específica de Node.js para la clase `EventTarget` que establece el número máximo de listeners de eventos como `n`.

#### `nodeEventTarget.getMaxListeners()` {#nodeeventtargetgetmaxlisteners}

**Agregado en: v14.5.0**

- Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Extensión específica de Node.js para la clase `EventTarget` que devuelve el número máximo de listeners de eventos.

#### `nodeEventTarget.off(type, listener[, options])` {#nodeeventtargetofftype-listener-options}

**Agregado en: v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/es/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 
- Devuelve: [\<EventTarget\>](/es/nodejs/api/events#class-eventtarget) this

Alias específico de Node.js para `eventTarget.removeEventListener()`.

#### `nodeEventTarget.on(type, listener)` {#nodeeventtargetontype-listener}

**Agregado en: v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/es/nodejs/api/events#event-listener)
- Devuelve: [\<EventTarget\>](/es/nodejs/api/events#class-eventtarget) this

Alias específico de Node.js para `eventTarget.addEventListener()`.

#### `nodeEventTarget.once(type, listener)` {#nodeeventtargetoncetype-listener}

**Agregado en: v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/es/nodejs/api/events#event-listener)
- Devuelve: [\<EventTarget\>](/es/nodejs/api/events#class-eventtarget) this

Extensión específica de Node.js para la clase `EventTarget` que añade un listener `once` para el `type` de evento dado. Esto es equivalente a llamar a `on` con la opción `once` establecida en `true`.


#### `nodeEventTarget.removeAllListeners([type])` {#nodeeventtargetremovealllistenerstype}

**Agregado en: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
-  Devuelve: [\<EventTarget\>](/es/nodejs/api/events#class-eventtarget) this 

Extensión específica de Node.js para la clase `EventTarget`. Si se especifica `type`, elimina todos los listeners registrados para `type`, de lo contrario, elimina todos los listeners registrados.

#### `nodeEventTarget.removeListener(type, listener[, options])` {#nodeeventtargetremovelistenertype-listener-options}

**Agregado en: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/es/nodejs/api/events#event-listener) 
-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 
-  Devuelve: [\<EventTarget\>](/es/nodejs/api/events#class-eventtarget) this 

Extensión específica de Node.js para la clase `EventTarget` que elimina el `listener` para el `type` dado. La única diferencia entre `removeListener()` y `removeEventListener()` es que `removeListener()` devolverá una referencia a `EventTarget`.

