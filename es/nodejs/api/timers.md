---
title: Documentación de la API de Temporizadores de Node.js
description: El módulo de Temporizadores de Node.js proporciona funciones para programar la ejecución de funciones en un momento futuro. Incluye métodos como setTimeout, setInterval, setImmediate y sus contrapartes de limpieza, además de process.nextTick para ejecutar código en la siguiente iteración del bucle de eventos.
head:
  - - meta
    - name: og:title
      content: Documentación de la API de Temporizadores de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: El módulo de Temporizadores de Node.js proporciona funciones para programar la ejecución de funciones en un momento futuro. Incluye métodos como setTimeout, setInterval, setImmediate y sus contrapartes de limpieza, además de process.nextTick para ejecutar código en la siguiente iteración del bucle de eventos.
  - - meta
    - name: twitter:title
      content: Documentación de la API de Temporizadores de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: El módulo de Temporizadores de Node.js proporciona funciones para programar la ejecución de funciones en un momento futuro. Incluye métodos como setTimeout, setInterval, setImmediate y sus contrapartes de limpieza, además de process.nextTick para ejecutar código en la siguiente iteración del bucle de eventos.
---


# Temporizadores {#timers}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código fuente:** [lib/timers.js](https://github.com/nodejs/node/blob/v23.5.0/lib/timers.js)

El módulo `timer` expone una API global para programar funciones que se llamarán en algún momento futuro. Dado que las funciones del temporizador son globales, no es necesario llamar a `require('node:timers')` para usar la API.

Las funciones del temporizador dentro de Node.js implementan una API similar a la API de temporizadores proporcionada por los navegadores web, pero utilizan una implementación interna diferente que se basa en el [Bucle de eventos](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout) de Node.js.

## Clase: `Immediate` {#class-immediate}

Este objeto se crea internamente y se devuelve desde [`setImmediate()`](/es/nodejs/api/timers#setimmediatecallback-args). Se puede pasar a [`clearImmediate()`](/es/nodejs/api/timers#clearimmediateimmediate) para cancelar las acciones programadas.

De forma predeterminada, cuando se programa un inmediato, el bucle de eventos de Node.js seguirá ejecutándose mientras el inmediato esté activo. El objeto `Immediate` devuelto por [`setImmediate()`](/es/nodejs/api/timers#setimmediatecallback-args) exporta las funciones `immediate.ref()` e `immediate.unref()` que se pueden usar para controlar este comportamiento predeterminado.

### `immediate.hasRef()` {#immediatehasref}

**Agregado en: v11.0.0**

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Si es verdadero, el objeto `Immediate` mantendrá activo el bucle de eventos de Node.js.

### `immediate.ref()` {#immediateref}

**Agregado en: v9.7.0**

- Devuelve: [\<Immediate\>](/es/nodejs/api/timers#class-immediate) una referencia a `immediate`

Cuando se llama, solicita que el bucle de eventos de Node.js *no* salga mientras el `Immediate` esté activo. Llamar a `immediate.ref()` varias veces no tendrá ningún efecto.

De forma predeterminada, todos los objetos `Immediate` son "ref'ed", lo que hace que normalmente sea innecesario llamar a `immediate.ref()` a menos que se haya llamado previamente a `immediate.unref()`.


### `immediate.unref()` {#immediateunref}

**Agregado en: v9.7.0**

- Devuelve: [\<Immediate\>](/es/nodejs/api/timers#class-immediate) una referencia a `immediate`

Cuando se llama, el objeto `Immediate` activo no requerirá que el bucle de eventos de Node.js permanezca activo. Si no hay otra actividad que mantenga el bucle de eventos en funcionamiento, el proceso puede salir antes de que se invoque la retrollamada del objeto `Immediate`. Llamar a `immediate.unref()` varias veces no tendrá ningún efecto.

### `immediate[Symbol.dispose]()` {#immediatesymboldispose}

**Agregado en: v20.5.0, v18.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Cancela el inmediato. Esto es similar a llamar a `clearImmediate()`.

## Clase: `Timeout` {#class-timeout}

Este objeto se crea internamente y se devuelve desde [`setTimeout()`](/es/nodejs/api/timers#settimeoutcallback-delay-args) y [`setInterval()`](/es/nodejs/api/timers#setintervalcallback-delay-args). Se puede pasar a [`clearTimeout()`](/es/nodejs/api/timers#cleartimeouttimeout) o [`clearInterval()`](/es/nodejs/api/timers#clearintervaltimeout) para cancelar las acciones programadas.

De forma predeterminada, cuando se programa un temporizador usando [`setTimeout()`](/es/nodejs/api/timers#settimeoutcallback-delay-args) o [`setInterval()`](/es/nodejs/api/timers#setintervalcallback-delay-args), el bucle de eventos de Node.js continuará ejecutándose siempre que el temporizador esté activo. Cada uno de los objetos `Timeout` devueltos por estas funciones exporta las funciones `timeout.ref()` y `timeout.unref()` que se pueden usar para controlar este comportamiento predeterminado.

### `timeout.close()` {#timeoutclose}

**Agregado en: v0.9.1**

::: info [Estable: 3 - Legado]
[Estable: 3](/es/nodejs/api/documentation#stability-index) [Estabilidad: 3](/es/nodejs/api/documentation#stability-index) - Legado: Use [`clearTimeout()`](/es/nodejs/api/timers#cleartimeouttimeout) en su lugar.
:::

- Devuelve: [\<Timeout\>](/es/nodejs/api/timers#class-timeout) una referencia a `timeout`

Cancela el tiempo de espera.

### `timeout.hasRef()` {#timeouthasref}

**Agregado en: v11.0.0**

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Si es verdadero, el objeto `Timeout` mantendrá activo el bucle de eventos de Node.js.


### `timeout.ref()` {#timeoutref}

**Agregado en: v0.9.1**

- Devuelve: [\<Timeout\>](/es/nodejs/api/timers#class-timeout) una referencia a `timeout`

Cuando se llama, solicita que el bucle de eventos de Node.js *no* se cierre mientras el `Timeout` esté activo. Llamar a `timeout.ref()` varias veces no tendrá ningún efecto.

De forma predeterminada, todos los objetos `Timeout` están "referenciados", por lo que normalmente no es necesario llamar a `timeout.ref()` a menos que se haya llamado previamente a `timeout.unref()`.

### `timeout.refresh()` {#timeoutrefresh}

**Agregado en: v10.2.0**

- Devuelve: [\<Timeout\>](/es/nodejs/api/timers#class-timeout) una referencia a `timeout`

Establece la hora de inicio del temporizador a la hora actual y reprograma el temporizador para que llame a su callback a la duración especificada anteriormente ajustada a la hora actual. Esto es útil para actualizar un temporizador sin asignar un nuevo objeto JavaScript.

Usar esto en un temporizador que ya ha llamado a su callback reactivará el temporizador.

### `timeout.unref()` {#timeoutunref}

**Agregado en: v0.9.1**

- Devuelve: [\<Timeout\>](/es/nodejs/api/timers#class-timeout) una referencia a `timeout`

Cuando se llama, el objeto `Timeout` activo no requerirá que el bucle de eventos de Node.js permanezca activo. Si no hay otra actividad que mantenga el bucle de eventos en ejecución, el proceso puede salir antes de que se invoque el callback del objeto `Timeout`. Llamar a `timeout.unref()` varias veces no tendrá ningún efecto.

### `timeout[Symbol.toPrimitive]()` {#timeoutsymboltoprimitive}

**Agregado en: v14.9.0, v12.19.0**

- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) un número que se puede usar para hacer referencia a este `timeout`

Convierte un `Timeout` a un primitivo. El primitivo se puede usar para borrar el `Timeout`. El primitivo solo se puede usar en el mismo hilo donde se creó el timeout. Por lo tanto, para usarlo a través de [`worker_threads`](/es/nodejs/api/worker_threads), primero debe pasarse al hilo correcto. Esto permite una compatibilidad mejorada con las implementaciones de `setTimeout()` y `setInterval()` del navegador.

### `timeout[Symbol.dispose]()` {#timeoutsymboldispose}

**Agregado en: v20.5.0, v18.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Cancela el timeout.


## Programación de temporizadores {#scheduling-timers}

Un temporizador en Node.js es una construcción interna que llama a una función dada después de un cierto período de tiempo. El momento en que se llama a la función de un temporizador varía dependiendo del método que se utilizó para crear el temporizador y del trabajo que esté realizando el bucle de eventos de Node.js.

### `setImmediate(callback[, ...args])` {#setimmediatecallback-args}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v0.9.1 | Añadido en: v0.9.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función a llamar al final de este turno del [Bucle de Eventos](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout) de Node.js
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Argumentos opcionales para pasar cuando se llama a la `callback`.
- Devuelve: [\<Immediate\>](/es/nodejs/api/timers#class-immediate) para su uso con [`clearImmediate()`](/es/nodejs/api/timers#clearimmediateimmediate)

Programa la ejecución "inmediata" de la `callback` después de las devoluciones de llamada de los eventos de E/S.

Cuando se realizan varias llamadas a `setImmediate()`, las funciones `callback` se ponen en cola para su ejecución en el orden en que se crean. Toda la cola de devoluciones de llamada se procesa en cada iteración del bucle de eventos. Si se pone en cola un temporizador inmediato desde dentro de una devolución de llamada en ejecución, ese temporizador no se activará hasta la siguiente iteración del bucle de eventos.

Si `callback` no es una función, se lanzará un [`TypeError`](/es/nodejs/api/errors#class-typeerror).

Este método tiene una variante personalizada para promesas que está disponible mediante [`timersPromises.setImmediate()`](/es/nodejs/api/timers#timerspromisessetimmediatevalue-options).

### `setInterval(callback[, delay[, ...args]])` {#setintervalcallback-delay-args}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v0.0.1 | Añadido en: v0.0.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función a llamar cuando transcurre el temporizador.
- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de milisegundos que se deben esperar antes de llamar a la `callback`. **Predeterminado:** `1`.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Argumentos opcionales para pasar cuando se llama a la `callback`.
- Devuelve: [\<Timeout\>](/es/nodejs/api/timers#class-timeout) para su uso con [`clearInterval()`](/es/nodejs/api/timers#clearintervaltimeout)

Programa la ejecución repetida de `callback` cada `delay` milisegundos.

Cuando `delay` es mayor que `2147483647` o menor que `1` o `NaN`, el `delay` se establecerá en `1`. Los retrasos no enteros se truncan a un entero.

Si `callback` no es una función, se lanzará un [`TypeError`](/es/nodejs/api/errors#class-typeerror).

Este método tiene una variante personalizada para promesas que está disponible mediante [`timersPromises.setInterval()`](/es/nodejs/api/timers#timerspromisessetintervaldelay-value-options).


### `setTimeout(callback[, delay[, ...args]])` {#settimeoutcallback-delay-args}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una función callback inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v0.0.1 | Añadido en: v0.0.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función que se llamará cuando expire el temporizador.
- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de milisegundos que se esperarán antes de llamar al `callback`. **Predeterminado:** `1`.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Argumentos opcionales para pasar cuando se llama al `callback`.
- Devuelve: [\<Timeout\>](/es/nodejs/api/timers#class-timeout) para usar con [`clearTimeout()`](/es/nodejs/api/timers#cleartimeouttimeout)

Programa la ejecución de una `callback` única después de `delay` milisegundos.

Es probable que el `callback` no se invoque precisamente en `delay` milisegundos. Node.js no ofrece garantías sobre el momento exacto en que se activarán las callbacks, ni sobre su orden. El callback se llamará lo más cerca posible del tiempo especificado.

Cuando `delay` es mayor que `2147483647` o menor que `1` o `NaN`, `delay` se establecerá en `1`. Los retrasos no enteros se truncan a un entero.

Si `callback` no es una función, se lanzará un [`TypeError`](/es/nodejs/api/errors#class-typeerror).

Este método tiene una variante personalizada para promesas que está disponible mediante [`timersPromises.setTimeout()`](/es/nodejs/api/timers#timerspromisessettimeoutdelay-value-options).

## Cancelación de temporizadores {#cancelling-timers}

Los métodos [`setImmediate()`](/es/nodejs/api/timers#setimmediatecallback-args), [`setInterval()`](/es/nodejs/api/timers#setintervalcallback-delay-args) y [`setTimeout()`](/es/nodejs/api/timers#settimeoutcallback-delay-args) devuelven cada uno objetos que representan los temporizadores programados. Estos se pueden utilizar para cancelar el temporizador y evitar que se active.

Para las variantes promesificadas de [`setImmediate()`](/es/nodejs/api/timers#setimmediatecallback-args) y [`setTimeout()`](/es/nodejs/api/timers#settimeoutcallback-delay-args), se puede utilizar un [`AbortController`](/es/nodejs/api/globals#class-abortcontroller) para cancelar el temporizador. Cuando se cancela, las promesas devueltas se rechazarán con un `'AbortError'`.

Para `setImmediate()`:



::: code-group
```js [ESM]
import { setImmediate as setImmediatePromise } from 'node:timers/promises';

const ac = new AbortController();
const signal = ac.signal;

// No `await` la promesa para que se llame a `ac.abort()` simultáneamente.
setImmediatePromise('foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The immediate was aborted');
  });

ac.abort();
```

```js [CJS]
const { setImmediate: setImmediatePromise } = require('node:timers/promises');

const ac = new AbortController();
const signal = ac.signal;

setImmediatePromise('foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The immediate was aborted');
  });

ac.abort();
```
:::

Para `setTimeout()`:



::: code-group
```js [ESM]
import { setTimeout as setTimeoutPromise } from 'node:timers/promises';

const ac = new AbortController();
const signal = ac.signal;

// No `await` la promesa para que se llame a `ac.abort()` simultáneamente.
setTimeoutPromise(1000, 'foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The timeout was aborted');
  });

ac.abort();
```

```js [CJS]
const { setTimeout: setTimeoutPromise } = require('node:timers/promises');

const ac = new AbortController();
const signal = ac.signal;

setTimeoutPromise(1000, 'foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The timeout was aborted');
  });

ac.abort();
```
:::


### `clearImmediate(immediate)` {#clearimmediateimmediate}

**Agregado en: v0.9.1**

- `immediate` [\<Immediate\>](/es/nodejs/api/timers#class-immediate) Un objeto `Immediate` como el devuelto por [`setImmediate()`](/es/nodejs/api/timers#setimmediatecallback-args).

Cancela un objeto `Immediate` creado por [`setImmediate()`](/es/nodejs/api/timers#setimmediatecallback-args).

### `clearInterval(timeout)` {#clearintervaltimeout}

**Agregado en: v0.0.1**

- `timeout` [\<Timeout\>](/es/nodejs/api/timers#class-timeout) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un objeto `Timeout` como el devuelto por [`setInterval()`](/es/nodejs/api/timers#setintervalcallback-delay-args) o la [primitiva](/es/nodejs/api/timers#timeoutsymboltoprimitive) del objeto `Timeout` como una cadena o un número.

Cancela un objeto `Timeout` creado por [`setInterval()`](/es/nodejs/api/timers#setintervalcallback-delay-args).

### `clearTimeout(timeout)` {#cleartimeouttimeout}

**Agregado en: v0.0.1**

- `timeout` [\<Timeout\>](/es/nodejs/api/timers#class-timeout) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un objeto `Timeout` como el devuelto por [`setTimeout()`](/es/nodejs/api/timers#settimeoutcallback-delay-args) o la [primitiva](/es/nodejs/api/timers#timeoutsymboltoprimitive) del objeto `Timeout` como una cadena o un número.

Cancela un objeto `Timeout` creado por [`setTimeout()`](/es/nodejs/api/timers#settimeoutcallback-delay-args).

## API de Promesas de Timers {#timers-promises-api}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.0.0 | Pasó de experimental. |
| v15.0.0 | Agregado en: v15.0.0 |
:::

La API de `timers/promises` proporciona un conjunto alternativo de funciones de temporizador que devuelven objetos `Promise`. Se puede acceder a la API a través de `require('node:timers/promises')`.

::: code-group
```js [ESM]
import {
  setTimeout,
  setImmediate,
  setInterval,
} from 'node:timers/promises';
```

```js [CJS]
const {
  setTimeout,
  setImmediate,
  setInterval,
} = require('node:timers/promises');
```
:::


### `timersPromises.setTimeout([delay[, value[, options]]])` {#timerspromisessettimeoutdelay-value-options}

**Agregado en: v15.0.0**

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de milisegundos a esperar antes de cumplir la promesa. **Predeterminado:** `1`.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Un valor con el que se cumple la promesa.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Establecer en `false` para indicar que el `Timeout` programado no debería requerir que el bucle de eventos de Node.js permanezca activo. **Predeterminado:** `true`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Un `AbortSignal` opcional que se puede usar para cancelar el `Timeout` programado.




::: code-group
```js [ESM]
import {
  setTimeout,
} from 'node:timers/promises';

const res = await setTimeout(100, 'result');

console.log(res);  // Prints 'result'
```

```js [CJS]
const {
  setTimeout,
} = require('node:timers/promises');

setTimeout(100, 'result').then((res) => {
  console.log(res);  // Prints 'result'
});
```
:::

### `timersPromises.setImmediate([value[, options]])` {#timerspromisessetimmediatevalue-options}

**Agregado en: v15.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Un valor con el que se cumple la promesa.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Establecer en `false` para indicar que el `Immediate` programado no debería requerir que el bucle de eventos de Node.js permanezca activo. **Predeterminado:** `true`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Un `AbortSignal` opcional que se puede usar para cancelar el `Immediate` programado.




::: code-group
```js [ESM]
import {
  setImmediate,
} from 'node:timers/promises';

const res = await setImmediate('result');

console.log(res);  // Prints 'result'
```

```js [CJS]
const {
  setImmediate,
} = require('node:timers/promises');

setImmediate('result').then((res) => {
  console.log(res);  // Prints 'result'
});
```
:::


### `timersPromises.setInterval([delay[, value[, options]]])` {#timerspromisessetintervaldelay-value-options}

**Agregado en: v15.9.0**

Devuelve un iterador asíncrono que genera valores en un intervalo de `delay` ms. Si `ref` es `true`, necesita llamar a `next()` del iterador asíncrono explícita o implícitamente para mantener vivo el bucle de eventos.

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de milisegundos a esperar entre iteraciones. **Predeterminado:** `1`.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Un valor con el que el iterador regresa.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Establecer a `false` para indicar que el `Timeout` programado entre iteraciones no debería requerir que el bucle de eventos de Node.js permanezca activo. **Predeterminado:** `true`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Una `AbortSignal` opcional que puede usarse para cancelar el `Timeout` programado entre operaciones.

::: code-group
```js [ESM]
import {
  setInterval,
} from 'node:timers/promises';

const interval = 100;
for await (const startTime of setInterval(interval, Date.now())) {
  const now = Date.now();
  console.log(now);
  if ((now - startTime) > 1000)
    break;
}
console.log(Date.now());
```

```js [CJS]
const {
  setInterval,
} = require('node:timers/promises');
const interval = 100;

(async function() {
  for await (const startTime of setInterval(interval, Date.now())) {
    const now = Date.now();
    console.log(now);
    if ((now - startTime) > 1000)
      break;
  }
  console.log(Date.now());
})();
```
:::

### `timersPromises.scheduler.wait(delay[, options])` {#timerspromisesschedulerwaitdelay-options}

**Agregado en: v17.3.0, v16.14.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de milisegundos a esperar antes de resolver la promesa.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Establecer a `false` para indicar que el `Timeout` programado no debería requerir que el bucle de eventos de Node.js permanezca activo. **Predeterminado:** `true`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Una `AbortSignal` opcional que puede usarse para cancelar la espera.

- Regresa: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Una API experimental definida por la especificación borrador de las [Scheduling APIs](https://github.com/WICG/scheduling-apis) que se está desarrollando como una API de plataforma web estándar.

Llamar a `timersPromises.scheduler.wait(delay, options)` es equivalente a llamar a `timersPromises.setTimeout(delay, undefined, options)`.

```js [ESM]
import { scheduler } from 'node:timers/promises';

await scheduler.wait(1000); // Esperar un segundo antes de continuar
```

### `timersPromises.scheduler.yield()` {#timerspromisesscheduleryield}

**Agregado en: v17.3.0, v16.14.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Una API experimental definida por el borrador de la especificación de las [Scheduling APIs](https://github.com/WICG/scheduling-apis) que se está desarrollando como una API estándar de la plataforma web.

Llamar a `timersPromises.scheduler.yield()` es equivalente a llamar a `timersPromises.setImmediate()` sin argumentos.

