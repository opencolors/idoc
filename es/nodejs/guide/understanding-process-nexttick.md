---
title: Entendiendo process.nextTick() en Node.js
description: Aprende cómo funciona process.nextTick() en Node.js y cómo se diferencia de setImmediate() y setTimeout(). Entiende el ciclo de eventos y cómo usar nextTick() para ejecutar código de manera asíncrona.
head:
  - - meta
    - name: og:title
      content: Entendiendo process.nextTick() en Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprende cómo funciona process.nextTick() en Node.js y cómo se diferencia de setImmediate() y setTimeout(). Entiende el ciclo de eventos y cómo usar nextTick() para ejecutar código de manera asíncrona.
  - - meta
    - name: twitter:title
      content: Entendiendo process.nextTick() en Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprende cómo funciona process.nextTick() en Node.js y cómo se diferencia de setImmediate() y setTimeout(). Entiende el ciclo de eventos y cómo usar nextTick() para ejecutar código de manera asíncrona.
---


# Entendiendo `process.nextTick()`

Al intentar entender el bucle de eventos de Node.js, una parte importante de este es `process.nextTick()`. Cada vez que el bucle de eventos realiza un viaje completo, lo llamamos un *tick*.

Cuando pasamos una función a `process.nextTick()`, instruimos al motor para que invoque esta función al final de la operación actual, antes de que comience el siguiente *tick* del bucle de eventos:

```js
process.nextTick(() => {
  // hacer algo
})
```

El bucle de eventos está ocupado procesando el código de la función actual. Cuando esta operación termina, el motor JS ejecuta todas las funciones pasadas a las llamadas `nextTick` durante esa operación.

Es la forma en que podemos indicarle al motor JS que procese una función de forma asíncrona (después de la función actual), pero lo antes posible, no ponerla en cola.

Llamar a `setTimeout(() => {}, 0)` ejecutará la función al final del próximo *tick*, mucho más tarde que cuando se usa `nextTick()` que prioriza la llamada y la ejecuta justo antes del comienzo del próximo *tick*.

Usa `nextTick()` cuando quieras asegurarte de que en la siguiente iteración del bucle de eventos ese código ya se haya ejecutado.

## Un ejemplo del orden de los eventos:

```js
console.log('Hola => número 1')
setImmediate(() => {
  console.log('Ejecutándose antes del timeout => número 3')
})
setTimeout(() => {
  console.log('El timeout ejecutándose al final => número 4')
}, 0)
process.nextTick(() => {
  console.log('Ejecutándose en el próximo tick => número 2')
})
```

## Ejemplo de salida:

```bash
Hola => número 1
Ejecutándose en el próximo tick => número 2
Ejecutándose antes del timeout => número 3
El timeout ejecutándose al final => número 4
```

La salida exacta puede diferir de una ejecución a otra.

