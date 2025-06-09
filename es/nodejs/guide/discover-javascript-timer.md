---
title: Temporizadores de JavaScript - setTimeout y setInterval
description: Aprenda a utilizar temporizadores de JavaScript para retrasar la ejecución de funciones y programar tareas con setTimeout e setInterval.
head:
  - - meta
    - name: og:title
      content: Temporizadores de JavaScript - setTimeout y setInterval | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda a utilizar temporizadores de JavaScript para retrasar la ejecución de funciones y programar tareas con setTimeout e setInterval.
  - - meta
    - name: twitter:title
      content: Temporizadores de JavaScript - setTimeout y setInterval | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda a utilizar temporizadores de JavaScript para retrasar la ejecución de funciones y programar tareas con setTimeout e setInterval.
---


# Descubre los Temporizadores de JavaScript

### `setTimeout()`

Al escribir código JavaScript, es posible que desees retrasar la ejecución de una función.

Este es el trabajo de `setTimeout`. Especificas una función de callback para que se ejecute más tarde y un valor que expresa cuánto más tarde quieres que se ejecute, en milisegundos:

```js
setTimeout(() => {
  // se ejecuta después de 2 segundos
}, 2000);
setTimeout(() => {
  // se ejecuta después de 50 milisegundos
}, 50);
```

Esta sintaxis define una nueva función. Puedes llamar a cualquier otra función que quieras allí, o puedes pasar un nombre de función existente y un conjunto de parámetros:

```js
const myFunction = (firstParam, secondParam) => {
  // hacer algo
};
// se ejecuta después de 2 segundos
setTimeout(myFunction, 2000, firstParam, secondParam);
```

`setTimeout` devuelve el id del temporizador. Generalmente no se usa, pero puedes almacenar este id y borrarlo si quieres eliminar esta ejecución de función programada:

```js
const id = setTimeout(() => {
  // debería ejecutarse después de 2 segundos
}, 2000);
// Cambié de opinión
clearTimeout(id);
```

## Retraso Cero

Si especificas el retraso del tiempo de espera a 0, la función de callback se ejecutará lo antes posible, pero después de la ejecución de la función actual:

```js
setTimeout(() => {
  console.log('después');
}, 0);
console.log(' antes ');
```

Este código imprimirá

```bash
antes
después
```

Esto es especialmente útil para evitar bloquear la CPU en tareas intensivas y permitir que se ejecuten otras funciones mientras se realiza un cálculo pesado, poniendo en cola las funciones en el planificador.

::: tip
Algunos navegadores (IE y Edge) implementan un método `setImmediate()` que hace exactamente la misma funcionalidad, pero no es estándar y [no está disponible en otros navegadores](https://caniuse.com/#feat=setimmediate). Pero es una función estándar en Node.js.
:::

### `setInterval()`

`setInterval` es una función similar a `setTimeout`, con una diferencia: en lugar de ejecutar la función de callback una vez, la ejecutará para siempre, en el intervalo de tiempo específico que especifiques (en milisegundos):

```js
setInterval(() => {
  // se ejecuta cada 2 segundos
}, 2000);
```

La función anterior se ejecuta cada 2 segundos a menos que le digas que se detenga, usando `clearInterval`, pasándole el id de intervalo que devolvió `setInterval`:

```js
const id = setInterval(() => {
  // se ejecuta cada 2 segundos
}, 2000);
// Cambié de opinión
clearInterval(id);
```

Es común llamar a `clearInterval` dentro de la función de callback `setInterval`, para permitir que se determine automáticamente si debe ejecutarse de nuevo o detenerse. Por ejemplo, este código ejecuta algo a menos que App.somethingIWait tenga el valor arrived:


## setTimeout recursivo

`setInterval` inicia una función cada n milisegundos, sin tener en cuenta cuándo una función ha terminado su ejecución.

Si una función siempre tarda la misma cantidad de tiempo, todo está bien.

Quizás la función tarde diferentes tiempos de ejecución, dependiendo de las condiciones de la red.

Y quizás una ejecución larga se superponga a la siguiente.

Para evitar esto, puedes programar un setTimeout recursivo para que se llame cuando la función de callback termine:

```js
const myFunction = () => {
  // do something
  setTimeout(myFunction, 1000);
};
setTimeout(myFunction, 1000);
```

`setTimeout` y `setInterval` están disponibles en Node.js, a través del [módulo Timers](/es/nodejs/api/timers).

Node.js también proporciona `setImmediate()`, que es equivalente a usar `setTimeout(() => {}, 0)`, utilizado principalmente para trabajar con el Bucle de Eventos de Node.js.

