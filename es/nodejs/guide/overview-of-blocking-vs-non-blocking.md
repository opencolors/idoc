---
title: Bloqueo y no bloqueo en Node.js
description: Este artículo explica la diferencia entre las llamadas bloqueantes y no bloqueantes en Node.js, incluyendo su impacto en el ciclo de eventos y la concurrencia.
head:
  - - meta
    - name: og:title
      content: Bloqueo y no bloqueo en Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Este artículo explica la diferencia entre las llamadas bloqueantes y no bloqueantes en Node.js, incluyendo su impacto en el ciclo de eventos y la concurrencia.
  - - meta
    - name: twitter:title
      content: Bloqueo y no bloqueo en Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Este artículo explica la diferencia entre las llamadas bloqueantes y no bloqueantes en Node.js, incluyendo su impacto en el ciclo de eventos y la concurrencia.
---


# Descripción general del bloqueo frente al no bloqueo

Esta descripción general cubre la diferencia entre las llamadas de bloqueo y no bloqueo en Node.js. Esta descripción general se referirá al bucle de eventos y libuv, pero no se requieren conocimientos previos de esos temas. Se supone que los lectores tienen una comprensión básica del lenguaje JavaScript y el [patrón de callback](/es/nodejs/guide/javascript-asynchronous-programming-and-callbacks) de Node.js.

::: info
"E/S" se refiere principalmente a la interacción con el disco y la red del sistema compatibles con [libuv](https://libuv.org/).
:::

## Bloqueo

**Bloqueo** es cuando la ejecución de JavaScript adicional en el proceso de Node.js debe esperar hasta que se complete una operación que no es de JavaScript. Esto sucede porque el bucle de eventos no puede seguir ejecutando JavaScript mientras se está produciendo una operación de **bloqueo**.

En Node.js, el JavaScript que exhibe un rendimiento deficiente debido a que requiere mucha CPU en lugar de esperar una operación que no es de JavaScript, como E/S, normalmente no se denomina **bloqueo**. Los métodos síncronos en la biblioteca estándar de Node.js que usan libuv son las operaciones de **bloqueo** más utilizadas. Los módulos nativos también pueden tener métodos de **bloqueo**.

Todos los métodos de E/S en la biblioteca estándar de Node.js proporcionan versiones asíncronas, que son **no bloqueantes**, y aceptan funciones de devolución de llamada. Algunos métodos también tienen contrapartes de **bloqueo**, que tienen nombres que terminan con `Sync`.

## Comparación de código

Los métodos de **bloqueo** se ejecutan **síncronamente** y los métodos **no bloqueantes** se ejecutan **asíncronamente**.

Usando el módulo del sistema de archivos como ejemplo, esta es una lectura de archivos **síncrona**:

```js
const fs = require('node:fs')
const data = fs.readFileSync('/file.md') // se bloquea aquí hasta que se lee el archivo
```

Y aquí hay un ejemplo **asíncrono** equivalente:

```js
const fs = require('node:fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
})
```

El primer ejemplo parece más simple que el segundo, pero tiene la desventaja de que la segunda línea **bloquea** la ejecución de cualquier JavaScript adicional hasta que se lea todo el archivo. Tenga en cuenta que en la versión síncrona, si se lanza un error, deberá ser detectado o el proceso fallará. En la versión asíncrona, depende del autor decidir si se debe lanzar un error como se muestra.

Ampliemos un poco nuestro ejemplo:

```js
const fs = require('node:fs')
const data = fs.readFileSync('/file.md') // se bloquea aquí hasta que se lee el archivo
console.log(data)
moreWork() // se ejecutará después de console.log
```

Y aquí hay un ejemplo asíncrono similar, pero no equivalente:

```js
const fs = require('node:fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
  console.log(data)
})
moreWork() // se ejecutará antes de console.log
```

En el primer ejemplo anterior, se llamará a `console.log` antes de `moreWork()`. En el segundo ejemplo, `fs.readFile()` es **no bloqueante**, por lo que la ejecución de JavaScript puede continuar y `moreWork()` se llamará primero. La capacidad de ejecutar `moreWork()` sin esperar a que se complete la lectura del archivo es una opción de diseño clave que permite un mayor rendimiento.


## Concurrencia y Rendimiento

La ejecución de JavaScript en Node.js es de un solo hilo, por lo que la concurrencia se refiere a la capacidad del bucle de eventos para ejecutar funciones de callback de JavaScript después de completar otro trabajo. Cualquier código que se espera que se ejecute de manera concurrente debe permitir que el bucle de eventos continúe ejecutándose mientras se producen operaciones que no son de JavaScript, como E/S.

Como ejemplo, consideremos un caso en el que cada solicitud a un servidor web tarda 50 ms en completarse y 45 ms de esos 50 ms son E/S de la base de datos que se pueden realizar de forma asíncrona. Elegir operaciones asíncronas no bloqueantes libera esos 45 ms por solicitud para manejar otras solicitudes. Esta es una diferencia significativa en la capacidad simplemente por elegir usar métodos no bloqueantes en lugar de métodos bloqueantes.

El bucle de eventos es diferente a los modelos en muchos otros lenguajes donde se pueden crear hilos adicionales para manejar el trabajo concurrente.

## Peligros de Mezclar Código Bloqueante y No Bloqueante

Hay algunos patrones que se deben evitar al tratar con E/S. Veamos un ejemplo:

```js
const fs = require('node:fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
  console.log(data)
})
fs.unlinkSync('/file.md')
```

En el ejemplo anterior, es probable que `fs.unlinkSync()` se ejecute antes de `fs.readFile()`, lo que eliminaría `file.md` antes de que se lea realmente. Una mejor manera de escribir esto, que es completamente no bloqueante y garantiza que se ejecute en el orden correcto es:

```js
const fs = require('node:fs')
fs.readFile('/file.md', (readFileErr, data) => {
  if (readFileErr) throw readFileErr
  console.log(data)
  fs.unlink('/file.md', unlinkErr => {
    if (unlinkErr) throw unlinkErr
  })
})
```

Lo anterior coloca una llamada **no bloqueante** a `fs.unlink()` dentro de la función de callback de `fs.readFile()`, lo que garantiza el orden correcto de las operaciones.

