---
title: Salida a la línea de comandos con Node.js
description: Node.js proporciona un módulo de consola con varios métodos para interactuar con la línea de comandos, incluyendo registro, conteo, temporización, etc.
head:
  - - meta
    - name: og:title
      content: Salida a la línea de comandos con Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js proporciona un módulo de consola con varios métodos para interactuar con la línea de comandos, incluyendo registro, conteo, temporización, etc.
  - - meta
    - name: twitter:title
      content: Salida a la línea de comandos con Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js proporciona un módulo de consola con varios métodos para interactuar con la línea de comandos, incluyendo registro, conteo, temporización, etc.
---


# Salida a la línea de comandos usando Node.js

Salida básica usando el módulo console
Node.js proporciona un módulo `console` que ofrece muchísimas formas muy útiles de interactuar con la línea de comandos. Es básicamente el mismo objeto `console` que encuentras en el navegador.

El método más básico y más utilizado es `console.log()`, que imprime la cadena que le pasas a la consola. Si pasas un objeto, lo renderizará como una cadena.

Puedes pasar múltiples variables a `console.log`, por ejemplo:
```javascript
const x = 'x';
const y = 'y';
console.log(x, y);
```

También podemos formatear frases bonitas pasando variables y un especificador de formato. Por ejemplo:
```javascript
console.log('Mi %s tiene %d orejas', 'gato', 2);
```

- %s formatea una variable como una cadena
- %d formatea una variable como un número
- %i formatea una variable como su parte entera únicamente
- %o formatea una variable como un objeto
Ejemplo:
```javascript
console.log('%o', Number);
```
## Limpiar la consola

`console.clear()` limpia la consola (el comportamiento puede depender de la consola utilizada).

## Contar elementos

`console.count()` es un método útil.
Toma este código:
```javascript
const x = 1;
const y = 2;
const z = 3;
console.count('El valor de x es '+x+' y ha sido verificado... ¿cuántas veces?');
console.count('El valor de x es'+x+'y ha sido verificado... ¿cuántas veces?');
console.count('El valor de y es'+y+'y ha sido verificado... ¿cuántas veces?');
```

Lo que sucede es que `console.count()` contará el número de veces que se imprime una cadena e imprimirá el conteo al lado:

Puedes simplemente contar manzanas y naranjas:

```javascript
const oranges = ['orange', 'orange'];
const apples = ['just one apple'];
oranges.forEach(fruit => console.count(fruit));
apples.forEach(fruit => console.count(fruit));
```

## Reiniciar el conteo

El método `console.countReset()` reinicia el contador utilizado con `console.count()`.

Usaremos el ejemplo de manzanas y naranjas para demostrar esto.

```javascript
const oranges = ['orange', 'orange'];
const apples = ['just one apple'];
oranges.forEach(fruit => console.count(fruit));
apples.forEach(fruit => console.count(fruit));
console.countReset('orange');
oranges.forEach(fruit => console.count(fruit));
```


## Imprimir el rastreo de la pila

Puede haber casos en los que sea útil imprimir el rastreo de la pila de llamadas de una función, tal vez para responder a la pregunta de cómo llegaste a esa parte del código.

Puedes hacerlo usando `console.trace()`:

```javascript
const function2 = () => console.trace();
const function1 = () => function2();
function1();
```

Esto imprimirá el rastreo de la pila. Esto es lo que se imprime si intentamos esto en el REPL de Node.js:

```bash
Trace
at function2 (repl:1:33)
at function1 (rep1:1:25)
at rep1:1:1
at ContextifyScript.Script.xunInThisContext (vm.js:44:33)
at REPLServer.defaultEval(repl.js:239:29)
at bound (domain.js:301:14)
at REPLServer.xunBound [as eval](domain.js:314:12)
at REPLServer.onLine (repl.js:440:10)
at emitone (events.js:120:20)
at REPLServer.emit (events.js:210:7)
```

## Calcular el tiempo empleado

Puedes calcular fácilmente cuánto tiempo tarda en ejecutarse una función, utilizando `time()` y `timeEnd()`.

```javascript
const doSomething = () => console.log('test');
const measureDoingSomething = () => {
    console.time('doSomething()');
    // do something, and measure the time it takes
    doSomething();
    console.timeEnd('doSomething()');
};
measureDoingSomething();
```

### stdout y stderr

Como vimos, `console.log` es excelente para imprimir mensajes en la consola. Esto es lo que se llama la salida estándar, o stdout.

`console.error` imprime en el flujo stderr.

No aparecerá en la consola, pero aparecerá en el registro de errores.

## Colorear la salida

Puedes colorear la salida de tu texto en la consola usando secuencias de escape. Una secuencia de escape es un conjunto de caracteres que identifica un color.

Ejemplo:

```javascript
console.log('x1b[33ms/x1b[0m', 'hi!');
```

Puedes probar eso en el REPL de Node.js, e imprimirá ¡hola! en amarillo.

Sin embargo, esta es la forma de bajo nivel de hacer esto. La forma más sencilla de colorear la salida de la consola es usar una librería. Chalk es una de esas librerías, y además de colorear, también ayuda con otras facilidades de estilo, como hacer que el texto sea negrita, cursiva o subrayado.

Se instala con `npm install chalk`, luego puedes usarlo:

```javascript
const chalk = require('chalk');
console.log(chalk.yellow('hi!'));
```

Usar `chalk.yellow` es mucho más conveniente que tratar de recordar los códigos de escape, y el código es mucho más legible.

Consulta el enlace del proyecto publicado arriba para obtener más ejemplos de uso.


## Crear una barra de progreso

`progress` es un paquete increíble para crear una barra de progreso en la consola. Instálalo usando `npm install progress`.

Este fragmento crea una barra de progreso de 10 pasos, y cada 100ms se completa un paso. Cuando la barra se completa, limpiamos el intervalo:

```javascript
const ProgressBar = require('progress');
const bar = new ProgressBar(':bar', { total: 10 });
const timer = setInterval(() => {
    bar.tick();
    if (bar.complete) {
        clearInterval(timer);
    }
}, 100);
```
