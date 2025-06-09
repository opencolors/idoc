---
title: El motor JavaScript V8
description: V8 es el motor JavaScript que impulsa Google Chrome, ejecutando el código JavaScript y proporcionando un entorno de ejecución. Es independiente del navegador y ha permitido el auge de Node.js, impulsando el código del lado del servidor y las aplicaciones de escritorio.
head:
  - - meta
    - name: og:title
      content: El motor JavaScript V8 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: V8 es el motor JavaScript que impulsa Google Chrome, ejecutando el código JavaScript y proporcionando un entorno de ejecución. Es independiente del navegador y ha permitido el auge de Node.js, impulsando el código del lado del servidor y las aplicaciones de escritorio.
  - - meta
    - name: twitter:title
      content: El motor JavaScript V8 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: V8 es el motor JavaScript que impulsa Google Chrome, ejecutando el código JavaScript y proporcionando un entorno de ejecución. Es independiente del navegador y ha permitido el auge de Node.js, impulsando el código del lado del servidor y las aplicaciones de escritorio.
---


# El motor de JavaScript V8

V8 es el nombre del motor de JavaScript que impulsa Google Chrome. Es lo que toma nuestro JavaScript y lo ejecuta mientras navegamos con Chrome.

V8 es el motor de JavaScript, es decir, analiza y ejecuta el código JavaScript. El DOM y las otras API de la plataforma web (todos conforman el entorno de ejecución) son proporcionados por el navegador.

Lo interesante es que el motor de JavaScript es independiente del navegador en el que se aloja. Esta característica clave permitió el auge de Node.js. V8 fue elegido como el motor que impulsaría Node.js en 2009, y a medida que la popularidad de Node.js explotó, V8 se convirtió en el motor que ahora impulsa una increíble cantidad de código del lado del servidor escrito en JavaScript.

El ecosistema de Node.js es enorme y gracias a V8, que también impulsa aplicaciones de escritorio, con proyectos como Electron.

## Otros motores de JS

Otros navegadores tienen su propio motor de JavaScript:

+ `SpiderMonkey` (Firefox)
+ `JavaScriptCore` (también llamado `Nitro`) (Safari)
+ Edge se basó originalmente en `Chakra`, pero más recientemente se ha reconstruido utilizando Chromium y el motor V8.

Y muchos otros también existen.

Todos estos motores implementan el [estándar ECMA ES-262](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/), también llamado ECMAScript, el estándar utilizado por JavaScript.

## La búsqueda del rendimiento

V8 está escrito en C++ y se mejora continuamente. Es portátil y se ejecuta en Mac, Windows, Linux y varios otros sistemas.

En esta introducción a V8, ignoraremos los detalles de implementación de V8: se pueden encontrar en sitios más autorizados (por ejemplo, el [sitio oficial de V8](https://v8.dev/)), y cambian con el tiempo, a menudo radicalmente.

V8 está en constante evolución, al igual que los otros motores de JavaScript, para acelerar la Web y el ecosistema de Node.js.

En la web, hay una carrera por el rendimiento que se ha estado llevando a cabo durante años, y nosotros (como usuarios y desarrolladores) nos beneficiamos mucho de esta competencia porque obtenemos máquinas más rápidas y optimizadas año tras año.


## Compilación

Generalmente se considera a JavaScript como un lenguaje interpretado, pero los motores de JavaScript modernos ya no solo interpretan JavaScript, sino que lo compilan.

Esto ha estado sucediendo desde 2009, cuando el compilador de JavaScript SpiderMonkey se agregó a Firefox 3.5, y todos siguieron esta idea.

JavaScript se compila internamente con V8 mediante la compilación Just-In-Time (JIT) para acelerar la ejecución.

Esto podría parecer contradictorio, pero desde la introducción de Google Maps en 2004, JavaScript ha evolucionado de un lenguaje que generalmente ejecutaba unas pocas docenas de líneas de código a aplicaciones completas con miles o cientos de miles de líneas que se ejecutan en el navegador.

Nuestras aplicaciones ahora pueden ejecutarse durante horas dentro de un navegador, en lugar de ser solo unas pocas reglas de validación de formularios o scripts simples.

En este nuevo mundo, compilar JavaScript tiene mucho sentido porque, si bien podría llevar un poco más tener el JavaScript listo, una vez hecho, será mucho más eficiente que el código puramente interpretado.

