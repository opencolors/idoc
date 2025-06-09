---
title: Introducción a Node.js
description: Node.js es un entorno de ejecución de JavaScript de código abierto y multiplataforma que permite a los desarrolladores ejecutar JavaScript en el lado del servidor, ofreciendo un alto rendimiento y escalabilidad.
head:
  - - meta
    - name: og:title
      content: Introducción a Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js es un entorno de ejecución de JavaScript de código abierto y multiplataforma que permite a los desarrolladores ejecutar JavaScript en el lado del servidor, ofreciendo un alto rendimiento y escalabilidad.
  - - meta
    - name: twitter:title
      content: Introducción a Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js es un entorno de ejecución de JavaScript de código abierto y multiplataforma que permite a los desarrolladores ejecutar JavaScript en el lado del servidor, ofreciendo un alto rendimiento y escalabilidad.
---


# Introducción a Node.js

Node.js es un entorno de ejecución de JavaScript de código abierto y multiplataforma. ¡Es una herramienta popular para casi cualquier tipo de proyecto!

Node.js ejecuta el motor de JavaScript V8, el núcleo de Google Chrome, fuera del navegador. Esto permite que Node.js sea muy eficiente.

Una aplicación Node.js se ejecuta en un solo proceso, sin crear un nuevo hilo para cada solicitud. Node.js proporciona un conjunto de primitivas de E/S asíncronas en su biblioteca estándar que evitan que el código JavaScript se bloquee y, en general, las bibliotecas en Node.js se escriben utilizando paradigmas sin bloqueo, lo que hace que el comportamiento de bloqueo sea la excepción en lugar de la norma.

Cuando Node.js realiza una operación de E/S, como leer de la red, acceder a una base de datos o al sistema de archivos, en lugar de bloquear el hilo y desperdiciar ciclos de CPU esperando, Node.js reanudará las operaciones cuando se reciba la respuesta.

Esto permite que Node.js maneje miles de conexiones concurrentes con un solo servidor sin introducir la carga de administrar la concurrencia de hilos, lo que podría ser una fuente importante de errores.

Node.js tiene una ventaja única porque millones de desarrolladores frontend que escriben JavaScript para el navegador ahora pueden escribir el código del lado del servidor además del código del lado del cliente sin la necesidad de aprender un lenguaje completamente diferente.

En Node.js, los nuevos estándares de ECMAScript se pueden utilizar sin problemas, ya que no tiene que esperar a que todos sus usuarios actualicen sus navegadores: usted es responsable de decidir qué versión de ECMAScript usar cambiando la versión de Node.js, y también puede habilitar características experimentales específicas ejecutando Node.js con indicadores.

## Un ejemplo de aplicación Node.js

El ejemplo de Hello World más común de Node.js es un servidor web:

```js
import { createServer } from 'node:http'
const hostname = '127.0.0.1'
const port = 3000
const server = createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World')
})
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
```

Para ejecutar este fragmento, guárdelo como un archivo `server.js` y ejecute `node server.js` en su terminal. Si usa la versión mjs del código, debe guardarlo como un archivo `server.mjs` y ejecutar `node server.mjs` en su terminal.

Este código primero incluye el [módulo http](/es/nodejs/api/http) de Node.js.

Node.js tiene una [biblioteca estándar](/es/nodejs/api/synopsis) fantástica, que incluye soporte de primera clase para redes.

El método `createServer()` de `http` crea un nuevo servidor HTTP y lo devuelve.

El servidor está configurado para escuchar en el puerto y nombre de host especificados. Cuando el servidor está listo, se llama a la función de devolución de llamada, en este caso informándonos que el servidor se está ejecutando.

Cada vez que se recibe una nueva solicitud, se llama al [evento de solicitud](/es/nodejs/api/http), proporcionando dos objetos: una solicitud (un objeto `http.IncomingMessage`) y una respuesta (un objeto `http.ServerResponse`).

Esos 2 objetos son esenciales para manejar la llamada HTTP.

El primero proporciona los detalles de la solicitud. En este sencillo ejemplo, esto no se usa, pero podría acceder a los encabezados de la solicitud y los datos de la solicitud.

El segundo se usa para devolver datos a la persona que llama.

En este caso con:

```js
res.setHeader('Content-Type', 'text/plain')
```

establecemos la propiedad statusCode en 200, para indicar una respuesta exitosa.

Establecemos el encabezado Content-Type:

```js
res.setHeader('Content-Type', 'text/plain')
```

y cerramos la respuesta, agregando el contenido como un argumento a `end()`:

```js
res.end('Hello World')
```

Esto enviará la respuesta al cliente.

