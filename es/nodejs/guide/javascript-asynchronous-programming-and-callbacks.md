---
title: Programación asincrónica de JavaScript y callbacks
description: JavaScript es sincrónico por defecto, pero puede manejar operaciones asíncronas a través de callbacks, que son funciones pasadas como argumentos a otras funciones y ejecutadas cuando se produce un evento específico.
head:
  - - meta
    - name: og:title
      content: Programación asincrónica de JavaScript y callbacks | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: JavaScript es sincrónico por defecto, pero puede manejar operaciones asíncronas a través de callbacks, que son funciones pasadas como argumentos a otras funciones y ejecutadas cuando se produce un evento específico.
  - - meta
    - name: twitter:title
      content: Programación asincrónica de JavaScript y callbacks | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: JavaScript es sincrónico por defecto, pero puede manejar operaciones asíncronas a través de callbacks, que son funciones pasadas como argumentos a otras funciones y ejecutadas cuando se produce un evento específico.
---


# Programación Asíncrona y Callbacks en JavaScript

## Asincronía en Lenguajes de Programación
Las computadoras son asíncronas por diseño.

Asíncrono significa que las cosas pueden suceder independientemente del flujo principal del programa.

En las computadoras de consumo actuales, cada programa se ejecuta durante un intervalo de tiempo específico y luego detiene su ejecución para permitir que otro programa continúe su ejecución. Esto se ejecuta en un ciclo tan rápido que es imposible notarlo. Pensamos que nuestras computadoras ejecutan muchos programas simultáneamente, pero esto es una ilusión (excepto en máquinas multiprocesador).

Internamente, los programas utilizan interrupciones, una señal que se emite al procesador para llamar la atención del sistema.

No entremos en los detalles internos de esto ahora, pero tenga en cuenta que es normal que los programas sean asíncronos y detengan su ejecución hasta que necesiten atención, lo que permite a la computadora ejecutar otras cosas mientras tanto. Cuando un programa está esperando una respuesta de la red, no puede detener el procesador hasta que finalice la solicitud.

Normalmente, los lenguajes de programación son síncronos y algunos proporcionan una forma de gestionar la asincronía en el lenguaje o a través de bibliotecas. C, Java, C#, PHP, Go, Ruby, Swift y Python son todos síncronos por defecto. Algunos de ellos manejan las operaciones asíncronas utilizando hilos, generando un nuevo proceso.

## JavaScript
JavaScript es **síncrono** por defecto y es de un solo hilo. Esto significa que el código no puede crear nuevos hilos y ejecutarse en paralelo.

Las líneas de código se ejecutan en serie, una tras otra, por ejemplo:

```js
const a = 1;
const b = 2;
const c = a * b;
console.log(c);
doSomething();
```

Pero JavaScript nació dentro del navegador, su principal trabajo, al principio, era responder a las acciones del usuario, como `onClick`, `onMouseOver`, `onChange`, `onSubmit`, etc. ¿Cómo podría hacer esto con un modelo de programación síncrono?

La respuesta estaba en su entorno. El **navegador** proporciona una forma de hacerlo proporcionando un conjunto de API que pueden manejar este tipo de funcionalidad.

Más recientemente, Node.js introdujo un entorno de E/S no bloqueante para extender este concepto al acceso a archivos, llamadas de red, etc.


## Callbacks
No puedes saber cuándo un usuario va a hacer clic en un botón. Por lo tanto, defines un manejador de eventos para el evento click. Este manejador de eventos acepta una función, que se llamará cuando se active el evento:

```js
document.getElementById('button').addEventListener('click', () => {
  // item clicked
});
```

Esto es lo que se conoce como **callback**.

Un callback es una función simple que se pasa como un valor a otra función, y solo se ejecutará cuando ocurra el evento. Podemos hacer esto porque JavaScript tiene funciones de primera clase, que se pueden asignar a variables y pasar a otras funciones (llamadas **funciones de orden superior**)

Es común envolver todo el código del cliente en un listener de eventos **load** en el objeto **window**, que ejecuta la función callback solo cuando la página está lista:

```js
window.addEventListener('load', () => {
  // window loaded
  // do what you want
});
```

Los callbacks se utilizan en todas partes, no solo en los eventos DOM.

Un ejemplo común es mediante el uso de temporizadores:

```js
setTimeout(() => {
  // runs after 2 seconds
}, 2000);
```

Las solicitudes XHR también aceptan un callback, en este ejemplo asignando una función a una propiedad que se llamará cuando ocurra un evento particular (en este caso, el estado de la solicitud cambia):

```js
const xhr = new XMLHttpRequest();
xhr.onreadystatechange = () => {
  if (xhr.readyState === 4) {
    xhr.status === 200 ? console.log(xhr.responseText) : console.error('error');
  }
};
xhr.open('GET', 'https://yoursite.com');
xhr.send();
```

## Manejo de errores en callbacks
¿Cómo se manejan los errores con los callbacks? Una estrategia muy común es usar lo que adoptó Node.js: el primer parámetro en cualquier función callback es el objeto de error: callbacks con error primero

Si no hay error, el objeto es null. Si hay un error, contiene alguna descripción del error y otra información.

```js
const fs = require('node:fs');
fs.readFile('/file.json', (err, data) => {
  if (err) {
    // handle error
    console.log(err);
    return;
  }
  // no errors, process data
  console.log(data);
});
```


## El problema con los callbacks
Los callbacks son geniales para casos sencillos!

Sin embargo, cada callback añade un nivel de anidamiento, y cuando tienes muchos callbacks, el código empieza a complicarse muy rápido:

```js
window.addEventListener('load', () => {
  document.getElementById('button').addEventListener('click', () => {
    setTimeout(() => {
      items.forEach(item => {
        // tu código aquí
      });
    }, 2000);
  });
});
```

Este es solo un código simple de 4 niveles, pero he visto muchos más niveles de anidamiento y no es divertido.

¿Cómo resolvemos esto?

## Alternativas a los callbacks
Comenzando con ES6, JavaScript introdujo varias características que nos ayudan con el código asíncrono que no implican el uso de callbacks: `Promises` (ES6) y `Async/Await` (ES2017).

