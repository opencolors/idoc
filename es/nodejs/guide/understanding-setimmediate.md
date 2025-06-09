---
title: Entendiendo setImmediate() en Node.js
description: Aprenda cómo funciona setImmediate() en Node.js, sus diferencias con setTimeout(), process.nextTick() y Promise.then(), y cómo interactúa con el bucle de eventos y las colas.
head:
  - - meta
    - name: og:title
      content: Entendiendo setImmediate() en Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda cómo funciona setImmediate() en Node.js, sus diferencias con setTimeout(), process.nextTick() y Promise.then(), y cómo interactúa con el bucle de eventos y las colas.
  - - meta
    - name: twitter:title
      content: Entendiendo setImmediate() en Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda cómo funciona setImmediate() en Node.js, sus diferencias con setTimeout(), process.nextTick() y Promise.then(), y cómo interactúa con el bucle de eventos y las colas.
---


# Entendiendo `setImmediate()`

Cuando deseas ejecutar algún fragmento de código de forma asíncrona, pero lo antes posible, una opción es utilizar la función `setImmediate()` proporcionada por Node.js:

```js
setImmediate(() => {
    // do something
})
```

Cualquier función pasada como argumento de `setImmediate()` es una devolución de llamada que se ejecuta en la siguiente iteración del bucle de eventos.

¿En qué se diferencia `setImmediate()` de `setTimeout(() => {}, 0)` (pasando un tiempo de espera de 0 ms), y de `process.nextTick()` y `Promise.then()`?

Una función pasada a `process.nextTick()` se ejecutará en la iteración actual del bucle de eventos, después de que termine la operación actual. Esto significa que siempre se ejecutará antes que `setTimeout` y `setImmediate`.

Una devolución de llamada `setTimeout()` con un retraso de 0 ms es muy similar a `setImmediate()`. El orden de ejecución dependerá de varios factores, pero ambos se ejecutarán en la siguiente iteración del bucle de eventos.

Una devolución de llamada `process.nextTick` se agrega a la **cola process.nextTick**. Una devolución de llamada `Promise.then()` se agrega a la **cola de microtareas de promesas**. Una devolución de llamada `setTimeout`, `setImmediate` se agrega a la **cola de macrotareas**.

El bucle de eventos ejecuta las tareas en la **cola process.nextTick** primero, y luego ejecuta la **cola de microtareas de promesas**, y luego ejecuta la **cola de macrotareas** `setTimeout` o `setImmediate`.

Aquí hay un ejemplo para mostrar el orden entre `setImmediate()`, `process.nextTick()` y `Promise.then()`:

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

Este código primero llamará a `start()`, luego llamará a `foo()` en la **cola process.nextTick**. Después de eso, manejará la **cola de microtareas de promesas**, que imprime bar y agrega `zoo()` en la **cola process.nextTick** al mismo tiempo. Luego llamará a `zoo()` que se acaba de agregar. Al final, se llama a `baz()` en la **cola de macrotareas**.

El principio antes mencionado se cumple en los casos de CommonJS, pero tenga en cuenta que en los módulos ES, por ejemplo, los archivos `mjs`, el orden de ejecución será diferente:

```js
// start bar foo zoo baz
```

Esto se debe a que el módulo ES que se está cargando se envuelve como una operación asíncrona, y por lo tanto, todo el script ya está en la **cola de microtareas de promesas**. Entonces, cuando la promesa se resuelve inmediatamente, su devolución de llamada se agrega a la **cola de microtareas**. Node.js intentará borrar la cola hasta pasar a cualquier otra cola, y por lo tanto verá que imprime bar primero.

