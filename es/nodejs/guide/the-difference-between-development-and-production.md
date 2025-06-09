---
title: La diferencia entre desarrollo y producción en Node.js
description: Entender el papel de NODE_ENV en Node.js y su impacto en los entornos de desarrollo y producción.
head:
  - - meta
    - name: og:title
      content: La diferencia entre desarrollo y producción en Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Entender el papel de NODE_ENV en Node.js y su impacto en los entornos de desarrollo y producción.
  - - meta
    - name: twitter:title
      content: La diferencia entre desarrollo y producción en Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Entender el papel de NODE_ENV en Node.js y su impacto en los entornos de desarrollo y producción.
---


# Node.js, la diferencia entre desarrollo y producción

`No hay diferencia entre desarrollo y producción en Node.js`, es decir, no hay configuraciones específicas que debas aplicar para que Node.js funcione en una configuración de producción. Sin embargo, algunas bibliotecas en el registro npm reconocen el uso de la variable `NODE_ENV` y la establecen por defecto en una configuración de `development`. Siempre ejecuta tu Node.js con `NODE_ENV=production` configurado.

Una forma popular de configurar tu aplicación es utilizando la [metodología de los doce factores](https://12factor.net).

## NODE_ENV en Express

En el inmensamente popular framework [express](https://expressjs.com), configurar NODE_ENV a producción generalmente asegura que:

+ el registro se mantenga al mínimo, a un nivel esencial
+ se apliquen más niveles de caché para optimizar el rendimiento

Esto generalmente se hace ejecutando el comando

```bash
export NODE_ENV=production
```

en la shell, pero es mejor colocarlo en tu archivo de configuración de la shell (por ejemplo, `.bash_profile` con la shell Bash) porque de lo contrario la configuración no persiste en caso de reinicio del sistema.

También puedes aplicar la variable de entorno anteponiéndola a tu comando de inicialización de la aplicación:

```bash
NODE_ENV=production node app.js
```

Por ejemplo, en una aplicación Express, puedes usar esto para establecer diferentes manejadores de errores por entorno:

```javascript
if (process.env.NODE_ENV === 'development') {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}
if (process.env.NODE_ENV === 'production') {
  app.use(express.errorHandler());
}
```

Por ejemplo, [Pug](https://pugjs.org), la biblioteca de plantillas utilizada por [Express.js](https://expressjs.com), se compila en modo de depuración si `NODE_ENV` no está establecido en `production`. Las vistas de Express se compilan en cada solicitud en modo de desarrollo, mientras que en producción se almacenan en caché. Hay muchos más ejemplos.

`Esta variable de entorno es una convención ampliamente utilizada en bibliotecas externas, pero no dentro de Node.js en sí.`

## ¿Por qué se considera a NODE_ENV un antipatrón?

Un entorno es una plataforma digital o un sistema donde los ingenieros pueden construir, probar, implementar y administrar productos de software. Convencionalmente, existen cuatro etapas o tipos de entornos donde se ejecuta nuestra aplicación:

+ Desarrollo
+ Staging
+ Producción
+ Pruebas

El problema fundamental de `NODE_ENV` proviene de que los desarrolladores combinan optimizaciones y el comportamiento del software con el entorno en el que se está ejecutando su software. El resultado es código como el siguiente:

```javascript
if (process.env.NODE_ENV === 'development') {
  // ...
}
if (process.env.NODE_ENV === 'staging') {
  // ...
}
if (process.env.NODE_ENV === 'production') {
  // ...
}
if (process.env.NODE_ENV === 'testing') {
  // ...
}
```

Si bien esto puede parecer inofensivo, hace que los entornos de producción y staging sean diferentes, lo que imposibilita las pruebas confiables. Por ejemplo, una prueba y, por lo tanto, una funcionalidad de tu producto podría pasar cuando `NODE_ENV` está establecido en `development`, pero fallar cuando se establece `NODE_ENV` en `production`. Por lo tanto, establecer `NODE_ENV` en cualquier valor que no sea `production` se considera un antipatrón.

