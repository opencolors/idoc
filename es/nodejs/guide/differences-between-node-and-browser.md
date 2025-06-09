---
title: Diferencias entre Node.js y el navegador
description: Descubre las diferencias clave entre la creación de aplicaciones en Node.js y el navegador, incluyendo el ecosistema, el control del entorno y los sistemas de módulos.
head:
  - - meta
    - name: og:title
      content: Diferencias entre Node.js y el navegador | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Descubre las diferencias clave entre la creación de aplicaciones en Node.js y el navegador, incluyendo el ecosistema, el control del entorno y los sistemas de módulos.
  - - meta
    - name: twitter:title
      content: Diferencias entre Node.js y el navegador | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Descubre las diferencias clave entre la creación de aplicaciones en Node.js y el navegador, incluyendo el ecosistema, el control del entorno y los sistemas de módulos.
---


# Diferencias entre Node.js y el navegador

Tanto el navegador como Node.js utilizan JavaScript como su lenguaje de programación. Construir aplicaciones que se ejecutan en el navegador es completamente diferente a construir una aplicación de Node.js. A pesar de que siempre es JavaScript, hay algunas diferencias clave que hacen que la experiencia sea radicalmente diferente.

Desde la perspectiva de un desarrollador frontend que utiliza JavaScript extensamente, las aplicaciones de Node.js traen consigo una gran ventaja: la comodidad de programar todo, el frontend y el backend, en un solo lenguaje.

Tienes una gran oportunidad porque sabemos lo difícil que es aprender un lenguaje de programación de forma completa y profunda, y al utilizar el mismo lenguaje para realizar todo tu trabajo en la web, tanto en el cliente como en el servidor, te encuentras en una posición de ventaja única.

::: tip
Lo que cambia es el ecosistema.
:::

En el navegador, la mayoría de las veces lo que haces es interactuar con el DOM, u otras API de la plataforma web como las cookies. Esas no existen en Node.js, por supuesto. No tienes el `document`, `window` y todos los demás objetos que proporciona el navegador.

Y en el navegador, no tenemos todas las buenas API que Node.js proporciona a través de sus módulos, como la funcionalidad de acceso al sistema de archivos.

Otra gran diferencia es que en Node.js tú controlas el entorno. A menos que estés construyendo una aplicación de código abierto que cualquiera pueda implementar en cualquier lugar, sabes en qué versión de Node.js ejecutarás la aplicación. En comparación con el entorno del navegador, donde no tienes el lujo de elegir qué navegador usarán tus visitantes, esto es muy conveniente.

Esto significa que puedes escribir todo el JavaScript moderno ES2015+ que tu versión de Node.js soporta. Dado que JavaScript se mueve tan rápido, pero los navegadores pueden tardar un poco en actualizarse, a veces en la web estás atascado usando versiones más antiguas de JavaScript/ECMAScript. Puedes usar Babel para transformar tu código para que sea compatible con ES5 antes de enviarlo al navegador, pero en Node.js, no necesitarás eso.

Otra diferencia es que Node.js soporta tanto los sistemas de módulos CommonJS como ES (desde Node.js v12), mientras que en el navegador, estamos empezando a ver que se implementa el estándar de los módulos ES.

En la práctica, esto significa que puedes usar tanto `require()` como `import` en Node.js, mientras que estás limitado a `import` en el navegador.

