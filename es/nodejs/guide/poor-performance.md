---
title: Optimización del rendimiento de Node.js
description: Aprenda a analizar un proceso de Node.js para identificar cuellos de botella de rendimiento y optimizar el código para una mejor eficiencia y experiencia del usuario.
head:
  - - meta
    - name: og:title
      content: Optimización del rendimiento de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda a analizar un proceso de Node.js para identificar cuellos de botella de rendimiento y optimizar el código para una mejor eficiencia y experiencia del usuario.
  - - meta
    - name: twitter:title
      content: Optimización del rendimiento de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda a analizar un proceso de Node.js para identificar cuellos de botella de rendimiento y optimizar el código para una mejor eficiencia y experiencia del usuario.
---


# Rendimiento Deficiente
En este documento puedes aprender sobre cómo perfilar un proceso de Node.js.

## Mi aplicación tiene un rendimiento deficiente

### Síntomas

La latencia de mi aplicación es alta y ya he confirmado que el cuello de botella no son mis dependencias, como bases de datos y servicios descendentes. Por lo tanto, sospecho que mi aplicación dedica un tiempo considerable a ejecutar código o procesar información.

Estás satisfecho con el rendimiento general de tu aplicación, pero te gustaría entender qué parte de nuestra aplicación se puede mejorar para que se ejecute más rápido o de forma más eficiente. Puede ser útil cuando queremos mejorar la experiencia del usuario o ahorrar costes de computación.

### Depuración
En este caso de uso, estamos interesados en las partes del código que utilizan más ciclos de CPU que las demás. Cuando hacemos esto localmente, normalmente intentamos optimizar nuestro código. [Usar el V8 Sampling Profiler](/es/nodejs/guide/profiling-nodejs-applications) puede ayudarnos a hacerlo.

