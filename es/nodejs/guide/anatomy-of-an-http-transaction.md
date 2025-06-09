---
title: Entendiendo el manejo de solicitudes HTTP en Node.js
description: Una guía completa para manejar solicitudes HTTP en Node.js, cubriendo temas como la creación de un servidor, el manejo de solicitudes y respuestas, el enrutamiento y el manejo de errores.
head:
  - - meta
    - name: og:title
      content: Entendiendo el manejo de solicitudes HTTP en Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Una guía completa para manejar solicitudes HTTP en Node.js, cubriendo temas como la creación de un servidor, el manejo de solicitudes y respuestas, el enrutamiento y el manejo de errores.
  - - meta
    - name: twitter:title
      content: Entendiendo el manejo de solicitudes HTTP en Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Una guía completa para manejar solicitudes HTTP en Node.js, cubriendo temas como la creación de un servidor, el manejo de solicitudes y respuestas, el enrutamiento y el manejo de errores.
---


# Anatomía de una Transacción HTTP

El propósito de esta guía es impartir una sólida comprensión del proceso de manejo de HTTP en Node.js. Asumiremos que usted sabe, en un sentido general, cómo funcionan las solicitudes HTTP, independientemente del lenguaje o entorno de programación. También asumiremos cierta familiaridad con los EventEmitters y Streams de Node.js. Si no está muy familiarizado con ellos, vale la pena leer rápidamente la documentación de la API para cada uno de ellos.

## Crear el Servidor

Cualquier aplicación de servidor web de node en algún momento tendrá que crear un objeto de servidor web. Esto se hace usando `createServer`.

```javascript
const http = require('node:http');
const server = http.createServer((request, response) => {
    // ¡aquí sucede la magia!
});
```

La función que se pasa a `createServer` se llama una vez por cada solicitud HTTP que se realiza contra ese servidor, por lo que se llama el manejador de solicitudes. De hecho, el objeto Server devuelto por `createServer` es un EventEmitter, y lo que tenemos aquí es solo una abreviatura para crear un objeto de servidor y luego agregar el listener más tarde.

```javascript
const server = http.createServer();
server.on('request', (request, response) => {
    // ¡el mismo tipo de magia sucede aquí!
});
```

Cuando una solicitud HTTP llega al servidor, node llama a la función de manejador de solicitudes con algunos objetos útiles para lidiar con la transacción, la solicitud y la respuesta. Llegaremos a ellos en breve. Para realmente atender las solicitudes, el método `listen` debe ser llamado en el objeto del servidor. En la mayoría de los casos, todo lo que necesitará pasar a `listen` es el número de puerto en el que desea que el servidor escuche. También hay algunas otras opciones, así que consulte la referencia de la API.

## Método, URL y Cabeceras

Al manejar una solicitud, lo primero que probablemente querrá hacer es observar el método y la URL, para que se puedan tomar las acciones apropiadas. Node.js hace esto relativamente sencillo al colocar propiedades útiles en el objeto de solicitud.

```javascript
const { method, url } = request;
```

El objeto de solicitud es una instancia de `IncomingMessage`. El método aquí siempre será un método/verbo HTTP normal. La URL es la URL completa sin el servidor, protocolo o puerto. Para una URL típica, esto significa todo después e incluyendo la tercera barra inclinada.

Las cabeceras tampoco están lejos. Están en su propio objeto en la solicitud llamado `headers`.

```javascript
const { headers } = request;
const userAgent = headers['user-agent'];
```

Es importante tener en cuenta aquí que todas las cabeceras se representan solo en minúsculas, independientemente de cómo el cliente las haya enviado realmente. Esto simplifica la tarea de analizar las cabeceras para cualquier propósito.

Si algunas cabeceras se repiten, entonces sus valores se sobrescriben o se unen como cadenas separadas por comas, dependiendo de la cabecera. En algunos casos, esto puede ser problemático, por lo que `rawHeaders` también está disponible.


## Cuerpo de la Solicitud

Al recibir una solicitud POST o PUT, el cuerpo de la solicitud podría ser importante para tu aplicación. Acceder a los datos del cuerpo es un poco más complejo que acceder a los encabezados de la solicitud. El objeto de solicitud que se pasa a un manejador implementa la interfaz `ReadableStream`. Este flujo se puede escuchar o canalizar a otra parte al igual que cualquier otro flujo. Podemos obtener los datos directamente del flujo escuchando los eventos `'data'` y `'end'` del flujo.

El fragmento emitido en cada evento `'data'` es un `Buffer`. Si sabes que serán datos de cadena, lo mejor es recopilar los datos en una matriz y luego, en el `'end'`, concatenarlos y convertirlos en cadena.

```javascript
let body = [];
request.on('data', chunk => {
    body.push(chunk);
});
request.on('end', () => {
    body = Buffer.concat(body).toString();
    // en este punto, 'body' tiene todo el cuerpo de la solicitud almacenado en él como una cadena
});
```
::: tip NOTA
Esto puede parecer un poco tedioso y, en muchos casos, lo es. Afortunadamente, existen módulos como `concat-stream` y `body` en npm que pueden ayudar a ocultar parte de esta lógica. ¡Es importante tener una buena comprensión de lo que está sucediendo antes de tomar ese camino, y es por eso que estás aquí!
:::

## Una Cosa Rápida Sobre los Errores

Dado que el objeto de solicitud es un `ReadableStream`, también es un `EventEmitter` y se comporta como tal cuando ocurre un error.

Un error en el flujo de solicitud se presenta emitiendo un evento `'error'` en el flujo. Si no tienes un escuchador para ese evento, el error se lanzará, lo que podría bloquear tu programa Node.js. Por lo tanto, debes agregar un escuchador `'error'` en tus flujos de solicitud, incluso si solo lo registras y continúas tu camino. (Aunque probablemente sea mejor enviar algún tipo de respuesta de error HTTP. Más sobre eso más adelante).

```javascript
request.on('error', err => {
    // Esto imprime el mensaje de error y el seguimiento de la pila en stderr.
    console.error(err.stack);
});
```

Hay otras formas de [manejar estos errores](/es/nodejs/api/errors), como otras abstracciones y herramientas, pero siempre debes ser consciente de que los errores pueden ocurrir y ocurren, y tendrás que lidiar con ellos.


## Lo que tenemos hasta ahora

En este punto, hemos cubierto la creación de un servidor y la obtención del método, la URL, los encabezados y el cuerpo de las solicitudes. Cuando juntamos todo eso, podría verse algo así:

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request.on('error', err => console.error(err));
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', () => {
        body = Buffer.concat(body).toString();
        // En este punto, tenemos los encabezados, el método, la URL y el cuerpo, y ahora podemos
        // hacer lo que necesitemos para responder a esta solicitud.
    });
});

.listen(8080); // Activa este servidor, escuchando en el puerto 8080.
```

Si ejecutamos este ejemplo, podremos recibir solicitudes, pero no responder a ellas. De hecho, si accedes a este ejemplo en un navegador web, tu solicitud se agotará, ya que no se envía nada de vuelta al cliente.

Hasta ahora no hemos tocado el objeto de respuesta en absoluto, que es una instancia de `ServerResponse`, que es un `WritableStream`. Contiene muchos métodos útiles para enviar datos de vuelta al cliente. Lo cubriremos a continuación.

## Código de estado HTTP

Si no te molestas en configurarlo, el código de estado HTTP en una respuesta siempre será 200. Por supuesto, no todas las respuestas HTTP lo justifican, y en algún momento definitivamente querrás enviar un código de estado diferente. Para ello, puedes establecer la propiedad `statusCode`.

```javascript
response.statusCode = 404; // Dile al cliente que no se encontró el recurso.
```

Hay algunos otros atajos para esto, como veremos pronto.

## Establecer encabezados de respuesta

Los encabezados se configuran a través de un método conveniente llamado `setHeader`.

```javascript
response.setHeader('Content-Type', 'application/json');
response.setHeader('X-Powered-By', 'bacon');
```

Al configurar los encabezados en una respuesta, las mayúsculas y minúsculas no importan en sus nombres. Si configuras un encabezado repetidamente, el último valor que establezcas es el valor que se envía.


## Envío explícito de datos de encabezado

Los métodos para establecer los encabezados y el código de estado que ya hemos discutido asumen que estás utilizando "encabezados implícitos". Esto significa que estás contando con que Node envíe los encabezados por ti en el momento correcto antes de que comiences a enviar datos del cuerpo.

Si lo deseas, puedes escribir explícitamente los encabezados en el flujo de respuesta. Para hacer esto, hay un método llamado `writeHead`, que escribe el código de estado y los encabezados en el flujo.

## Envío explícito de datos de encabezado

```javascript
response.writeHead(200, {
    'Content-Type': 'application/json',
    'X-Powered-By': 'bacon',
});
```

Una vez que hayas establecido los encabezados (ya sea implícita o explícitamente), estás listo para comenzar a enviar datos de respuesta.

## Envío del cuerpo de la respuesta

Dado que el objeto de respuesta es un `WritableStream`, escribir un cuerpo de respuesta al cliente es solo una cuestión de usar los métodos de flujo habituales.

```javascript
response.write('<html>');
response.write('<body>');
response.write('<h1>¡Hola, Mundo!</h1>');
response.write('</body>');
response.write('</html>');
response.end();
```

La función `end` en los flujos también puede recibir algunos datos opcionales para enviar como el último fragmento de datos en el flujo, por lo que podemos simplificar el ejemplo anterior de la siguiente manera.

```javascript
response.end('<html><body><h1>¡hola, mundo!</h1></body></html>');
```

::: tip NOTE
Es importante establecer el estado y los encabezados antes de comenzar a escribir fragmentos de datos en el cuerpo. Esto tiene sentido, ya que los encabezados van antes del cuerpo en las respuestas HTTP.
:::

## Otra cosa rápida sobre errores

El flujo de respuesta también puede emitir eventos de 'error', y en algún momento tendrás que lidiar con eso también. Todos los consejos para los errores del flujo de solicitud todavía se aplican aquí.

## Juntándolo todo

Ahora que hemos aprendido sobre cómo crear respuestas HTTP, vamos a juntarlo todo. Basándonos en el ejemplo anterior, vamos a crear un servidor que devuelva todos los datos que nos envió el usuario. Formatearemos esos datos como JSON usando `JSON.stringify`.

```javascript
const http = require('node:http');
http
  .createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request
      .on('error', err => {
        console.error(err);
      })
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();
        // COMIENZO DE COSAS NUEVAS
        response.on('error', err => {
          console.error(err);
        });
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        // Nota: las 2 líneas anteriores podrían reemplazarse con la siguiente:
        // response.writeHead(200, {'Content-Type': 'application/json'})
        const responseBody = { headers, method, url, body };
        response.write(JSON.stringify(responseBody));
        response.end();
        // Nota: las 2 líneas anteriores podrían reemplazarse con la siguiente:
        // response.end(JSON.stringify(responseBody))
        // FIN DE COSAS NUEVAS
      });
  })
  .listen(8080);
```

## Ejemplo de EchoServer

Vamos a simplificar el ejemplo anterior para crear un servidor eco simple, que simplemente envía los datos que recibe en la solicitud de vuelta en la respuesta. Todo lo que necesitamos hacer es tomar los datos del flujo de solicitud y escribir esos datos en el flujo de respuesta, de manera similar a lo que hicimos anteriormente.

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    let body = [];
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', () => {
        body = Buffer.concat(body).toString();
        response.end(body);
    });
});

.listen(8080);
```

Ahora vamos a modificar esto. Queremos enviar un eco solo bajo las siguientes condiciones:
- El método de solicitud es POST.
- La URL es /echo.

En cualquier otro caso, queremos simplemente responder con un 404.

```javascript
const http = require('node:http');
http
  .createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/echo') {
      let body = [];
      request
        .on('data', chunk => {
          body.push(chunk);
        })
        .on('end', () => {
          body = Buffer.concat(body).toString();
          response.end(body);
        });
    } else {
      response.statusCode = 404;
      response.end();
    }
  })
  .listen(8080);
```

::: tip NOTE
Al verificar la URL de esta manera, estamos haciendo una forma de "enrutamiento". Otras formas de enrutamiento pueden ser tan simples como sentencias `switch` o tan complejas como frameworks completos como `express`. Si estás buscando algo que haga enrutamiento y nada más, prueba `router`.
:::

¡Genial! Ahora vamos a intentar simplificar esto. Recuerda, el objeto de solicitud es un `ReadableStream` y el objeto de respuesta es un `WritableStream`. Eso significa que podemos usar `pipe` para dirigir los datos de uno a otro. ¡Eso es exactamente lo que queremos para un servidor eco!

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/echo') {
        request.pipe(response);
    } else {
        response.statusCode = 404;
        response.end();
    }
})
.listen(8080);
```

¡Vivan los streams!

Sin embargo, aún no hemos terminado. Como se mencionó varias veces en esta guía, los errores pueden ocurrir y ocurren, y debemos lidiar con ellos.

Para manejar los errores en el flujo de solicitud, registraremos el error en `stderr` y enviaremos un código de estado 400 para indicar una `Bad Request`. Sin embargo, en una aplicación del mundo real, querríamos inspeccionar el error para averiguar cuál sería el código de estado y el mensaje correctos. Como de costumbre con los errores, debes consultar la [documentación de Error](/es/nodejs/api/errors).

En la respuesta, simplemente registraremos el error en `stderr`.

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    request.on('error', err => {
        console.error(err);
        response.statusCode = 400;
        response.end();
    });
    response.on('error', err => {
        console.error(err);
    });
    if (request.method === 'POST' && request.url === '/echo') {
        request.pipe(response);
    } else {
        response.statusCode = 404;
        response.end();
    }
})
.listen(8080);
```

Ahora hemos cubierto la mayoría de los conceptos básicos del manejo de solicitudes HTTP. En este punto, deberías ser capaz de:
- Instanciar un servidor HTTP con una función de controlador de `request`, y hacer que escuche en un puerto.
- Obtener encabezados, URL, método y datos del cuerpo de los objetos `request`.
- Tomar decisiones de enrutamiento basadas en la URL y/u otros datos en los objetos `request`.
- Enviar encabezados, códigos de estado HTTP y datos del cuerpo a través de objetos `response`.
- Dirigir datos desde objetos `request` y hacia objetos response.
- Manejar errores de flujo tanto en los flujos `request` como `response`.

A partir de estos conceptos básicos, se pueden construir servidores HTTP de Node.js para muchos casos de uso típicos. Hay muchas otras cosas que proporcionan estas API, así que asegúrate de leer la documentación de la API para [`EventEmitters`](/es/nodejs/api/events), [`Streams`](/es/nodejs/api/stream) y [`HTTP`](/es/nodejs/api/http).

