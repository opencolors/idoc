---
title: Documentación del módulo HTTP de Node.js
description: La documentación oficial del módulo HTTP de Node.js, que detalla cómo crear servidores y clientes HTTP, manejar solicitudes y respuestas, y gestionar varios métodos y encabezados HTTP.
head:
  - - meta
    - name: og:title
      content: Documentación del módulo HTTP de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La documentación oficial del módulo HTTP de Node.js, que detalla cómo crear servidores y clientes HTTP, manejar solicitudes y respuestas, y gestionar varios métodos y encabezados HTTP.
  - - meta
    - name: twitter:title
      content: Documentación del módulo HTTP de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La documentación oficial del módulo HTTP de Node.js, que detalla cómo crear servidores y clientes HTTP, manejar solicitudes y respuestas, y gestionar varios métodos y encabezados HTTP.
---


# HTTP {#http}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código fuente:** [lib/http.js](https://github.com/nodejs/node/blob/v23.5.0/lib/http.js)

Este módulo, que contiene tanto un cliente como un servidor, se puede importar a través de `require('node:http')` (CommonJS) o `import * as http from 'node:http'` (módulo ES).

Las interfaces HTTP en Node.js están diseñadas para admitir muchas características del protocolo que tradicionalmente han sido difíciles de usar. En particular, mensajes grandes, posiblemente codificados en fragmentos. La interfaz tiene cuidado de no almacenar en búfer solicitudes o respuestas completas, por lo que el usuario puede transmitir datos.

Los encabezados de los mensajes HTTP se representan mediante un objeto como este:

```json [JSON]
{ "content-length": "123",
  "content-type": "text/plain",
  "connection": "keep-alive",
  "host": "example.com",
  "accept": "*/*" }
```
Las claves están en minúsculas. Los valores no se modifican.

Para admitir todo el espectro de posibles aplicaciones HTTP, la API HTTP de Node.js es de muy bajo nivel. Solo se ocupa del manejo de flujos y el análisis de mensajes. Analiza un mensaje en encabezados y cuerpo, pero no analiza los encabezados o el cuerpo reales.

Consulte [`message.headers`](/es/nodejs/api/http#messageheaders) para obtener detalles sobre cómo se manejan los encabezados duplicados.

Los encabezados sin procesar tal como se recibieron se conservan en la propiedad `rawHeaders`, que es una matriz de `[key, value, key2, value2, ...]`. Por ejemplo, el objeto de encabezado de mensaje anterior podría tener una lista `rawHeaders` como la siguiente:

```js [ESM]
[ 'ConTent-Length', '123456',
  'content-LENGTH', '123',
  'content-type', 'text/plain',
  'CONNECTION', 'keep-alive',
  'Host', 'example.com',
  'accepT', '*/*' ]
```
## Clase: `http.Agent` {#class-httpagent}

**Agregado en: v0.3.4**

Un `Agent` es responsable de administrar la persistencia y la reutilización de la conexión para los clientes HTTP. Mantiene una cola de solicitudes pendientes para un host y un puerto determinados, reutilizando una única conexión de socket para cada uno hasta que la cola esté vacía, momento en el que el socket se destruye o se coloca en un grupo donde se guarda para que se vuelva a utilizar para las solicitudes al mismo host y puerto. Si se destruye o se agrupa depende de la [opción](/es/nodejs/api/http#new-agentoptions) `keepAlive`.

Las conexiones agrupadas tienen TCP Keep-Alive habilitado para ellas, pero los servidores aún pueden cerrar las conexiones inactivas, en cuyo caso se eliminarán del grupo y se realizará una nueva conexión cuando se realice una nueva solicitud HTTP para ese host y puerto. Los servidores también pueden negarse a permitir múltiples solicitudes a través de la misma conexión, en cuyo caso la conexión deberá rehacerse para cada solicitud y no se podrá agrupar. El `Agent` seguirá realizando las solicitudes a ese servidor, pero cada una se producirá a través de una nueva conexión.

Cuando el cliente o el servidor cierra una conexión, se elimina del grupo. Cualquier socket no utilizado en el grupo se desreferenciará para no mantener el proceso de Node.js en ejecución cuando no haya solicitudes pendientes. (consulte [`socket.unref()`](/es/nodejs/api/net#socketunref)).

Es una buena práctica [`destroy()`](/es/nodejs/api/http#agentdestroy) una instancia de `Agent` cuando ya no está en uso, porque los sockets no utilizados consumen recursos del sistema operativo.

Los sockets se eliminan de un agente cuando el socket emite un evento `'close'` o un evento `'agentRemove'`. Cuando se pretende mantener una solicitud HTTP abierta durante mucho tiempo sin mantenerla en el agente, se puede hacer algo como lo siguiente:

```js [ESM]
http.get(options, (res) => {
  // Do stuff
}).on('socket', (socket) => {
  socket.emit('agentRemove');
});
```
Un agente también se puede utilizar para una solicitud individual. Al proporcionar `{agent: false}` como una opción para las funciones `http.get()` o `http.request()`, se utilizará un `Agent` de un solo uso con las opciones predeterminadas para la conexión del cliente.

`agent:false`:

```js [ESM]
http.get({
  hostname: 'localhost',
  port: 80,
  path: '/',
  agent: false,  // Create a new agent just for this one request
}, (res) => {
  // Do stuff with response
});
```

### `new Agent([options])` {#new-agentoptions}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.6.0, v14.17.0 | Cambia la programación predeterminada de 'fifo' a 'lifo'. |
| v14.5.0, v12.20.0 | Agrega la opción `scheduling` para especificar la estrategia de programación de socket libre. |
| v14.5.0, v12.19.0 | Agrega la opción `maxTotalSockets` al constructor del agente. |
| v0.3.4 | Agregado en: v0.3.4 |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Conjunto de opciones configurables para establecer en el agente. Puede tener los siguientes campos:
    - `keepAlive` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Mantener los sockets incluso cuando no haya solicitudes pendientes, para que puedan usarse para futuras solicitudes sin tener que restablecer una conexión TCP. No debe confundirse con el valor `keep-alive` del encabezado `Connection`. El encabezado `Connection: keep-alive` siempre se envía cuando se usa un agente, excepto cuando el encabezado `Connection` se especifica explícitamente o cuando las opciones `keepAlive` y `maxSockets` se establecen respectivamente en `false` e `Infinity`, en cuyo caso se usará `Connection: close`. **Predeterminado:** `false`.
    - `keepAliveMsecs` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Cuando se usa la opción `keepAlive`, especifica el [retraso inicial](/es/nodejs/api/net#socketsetkeepaliveenable-initialdelay) para los paquetes TCP Keep-Alive. Se ignora cuando la opción `keepAlive` es `false` o `undefined`. **Predeterminado:** `1000`.
    - `maxSockets` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número máximo de sockets permitidos por host. Si el mismo host abre varias conexiones simultáneas, cada solicitud usará un nuevo socket hasta que se alcance el valor `maxSockets`. Si el host intenta abrir más conexiones que `maxSockets`, las solicitudes adicionales entrarán en una cola de solicitudes pendientes y entrarán en estado de conexión activa cuando finalice una conexión existente. Esto asegura que haya como máximo `maxSockets` conexiones activas en cualquier momento, desde un host determinado. **Predeterminado:** `Infinity`.
    - `maxTotalSockets` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número máximo de sockets permitidos para todos los hosts en total. Cada solicitud usará un nuevo socket hasta que se alcance el máximo. **Predeterminado:** `Infinity`.
    - `maxFreeSockets` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número máximo de sockets por host para dejar abiertos en un estado libre. Solo relevante si `keepAlive` está establecido en `true`. **Predeterminado:** `256`.
    - `scheduling` [\<cadena\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Estrategia de programación para aplicar al elegir el siguiente socket libre para usar. Puede ser `'fifo'` o `'lifo'`. La principal diferencia entre las dos estrategias de programación es que `'lifo'` selecciona el socket usado más recientemente, mientras que `'fifo'` selecciona el socket usado menos recientemente. En caso de una baja tasa de solicitudes por segundo, la programación `'lifo'` reducirá el riesgo de elegir un socket que podría haber sido cerrado por el servidor debido a la inactividad. En caso de una alta tasa de solicitudes por segundo, la programación `'fifo'` maximizará el número de sockets abiertos, mientras que la programación `'lifo'` lo mantendrá lo más bajo posible. **Predeterminado:** `'lifo'`.
    - `timeout` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tiempo de espera del socket en milisegundos. Esto establecerá el tiempo de espera cuando se cree el socket.

`options` en [`socket.connect()`](/es/nodejs/api/net#socketconnectoptions-connectlistener) también son compatibles.

Para configurar cualquiera de ellos, se debe crear una instancia personalizada de [`http.Agent`](/es/nodejs/api/http#class-httpagent).

::: code-group
```js [ESM]
import { Agent, request } from 'node:http';
const keepAliveAgent = new Agent({ keepAlive: true });
options.agent = keepAliveAgent;
request(options, onResponseCallback);
```

```js [CJS]
const http = require('node:http');
const keepAliveAgent = new http.Agent({ keepAlive: true });
options.agent = keepAliveAgent;
http.request(options, onResponseCallback);
```
:::


### `agent.createConnection(options[, callback])` {#agentcreateconnectionoptions-callback}

**Agregado en: v0.11.4**

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones que contienen detalles de la conexión. Consulte [`net.createConnection()`](/es/nodejs/api/net#netcreateconnectionoptions-connectlistener) para ver el formato de las opciones.
- `callback` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Función de callback que recibe el socket creado
- Devuelve: [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)

Produce un socket/stream para ser usado para peticiones HTTP.

Por defecto, esta función es la misma que [`net.createConnection()`](/es/nodejs/api/net#netcreateconnectionoptions-connectlistener). Sin embargo, los agentes personalizados pueden anular este método en caso de que se desee una mayor flexibilidad.

Un socket/stream puede ser suministrado de una de estas dos maneras: retornando el socket/stream desde esta función, o pasando el socket/stream a `callback`.

Se garantiza que este método retornará una instancia de la clase [\<net.Socket\>](/es/nodejs/api/net#class-netsocket), una subclase de [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex), a menos que el usuario especifique un tipo de socket diferente a [\<net.Socket\>](/es/nodejs/api/net#class-netsocket).

`callback` tiene una firma de `(err, stream)`.

### `agent.keepSocketAlive(socket)` {#agentkeepsocketalivesocket}

**Agregado en: v8.1.0**

- `socket` [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)

Llamado cuando `socket` es separado de una petición y podría ser persistido por el `Agente`. El comportamiento por defecto es:

```js [ESM]
socket.setKeepAlive(true, this.keepAliveMsecs);
socket.unref();
return true;
```
Este método puede ser anulado por una subclase `Agent` particular. Si este método retorna un valor falsy, el socket será destruido en lugar de persistirlo para su uso con la siguiente petición.

El argumento `socket` puede ser una instancia de [\<net.Socket\>](/es/nodejs/api/net#class-netsocket), una subclase de [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex).

### `agent.reuseSocket(socket, request)` {#agentreusesocketsocket-request}

**Agregado en: v8.1.0**

- `socket` [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)
- `request` [\<http.ClientRequest\>](/es/nodejs/api/http#class-httpclientrequest)

Llamado cuando `socket` se adjunta a `request` después de ser persistido debido a las opciones de keep-alive. El comportamiento por defecto es:

```js [ESM]
socket.ref();
```
Este método puede ser anulado por una subclase `Agent` particular.

El argumento `socket` puede ser una instancia de [\<net.Socket\>](/es/nodejs/api/net#class-netsocket), una subclase de [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex).


### `agent.destroy()` {#agentdestroy}

**Agregado en: v0.11.4**

Destruye cualquier socket que esté actualmente en uso por el agente.

Por lo general, no es necesario hacer esto. Sin embargo, si se utiliza un agente con `keepAlive` habilitado, es mejor cerrar explícitamente el agente cuando ya no sea necesario. De lo contrario, los sockets podrían permanecer abiertos durante bastante tiempo antes de que el servidor los termine.

### `agent.freeSockets` {#agentfreesockets}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.0.0 | La propiedad ahora tiene un prototipo `null`. |
| v0.11.4 | Agregado en: v0.11.4 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Un objeto que contiene arreglos de sockets que actualmente esperan ser utilizados por el agente cuando `keepAlive` está habilitado. No modificar.

Los sockets en la lista `freeSockets` se destruirán automáticamente y se eliminarán del arreglo en `'timeout'`.

### `agent.getName([options])` {#agentgetnameoptions}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.7.0, v16.15.0 | El parámetro `options` ahora es opcional. |
| v0.11.4 | Agregado en: v0.11.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un conjunto de opciones que proporcionan información para la generación de nombres
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un nombre de dominio o dirección IP del servidor al que se emitirá la solicitud.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Puerto del servidor remoto
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Interfaz local para enlazar para conexiones de red al emitir la solicitud
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Debe ser 4 o 6 si esto no es igual a `undefined`.
  
 
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtiene un nombre único para un conjunto de opciones de solicitud, para determinar si una conexión puede ser reutilizada. Para un agente HTTP, esto devuelve `host:port:localAddress` o `host:port:localAddress:family`. Para un agente HTTPS, el nombre incluye el CA, el certificado, los cifrados y otras opciones específicas de HTTPS/TLS que determinan la reutilización del socket.


### `agent.maxFreeSockets` {#agentmaxfreesockets}

**Agregado en: v0.11.7**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Por defecto, establecido en 256. Para agentes con `keepAlive` habilitado, esto establece el número máximo de sockets que se dejarán abiertos en estado libre.

### `agent.maxSockets` {#agentmaxsockets}

**Agregado en: v0.3.6**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Por defecto, establecido en `Infinity`. Determina cuántos sockets concurrentes puede tener abiertos el agente por origen. El origen es el valor devuelto de [`agent.getName()`](/es/nodejs/api/http#agentgetnameoptions).

### `agent.maxTotalSockets` {#agentmaxtotalsockets}

**Agregado en: v14.5.0, v12.19.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Por defecto, establecido en `Infinity`. Determina cuántos sockets concurrentes puede tener abiertos el agente. A diferencia de `maxSockets`, este parámetro se aplica a todos los orígenes.

### `agent.requests` {#agentrequests}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.0.0 | La propiedad ahora tiene un prototipo `null`. |
| v0.5.9 | Agregado en: v0.5.9 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Un objeto que contiene colas de solicitudes que aún no se han asignado a los sockets. No modificar.

### `agent.sockets` {#agentsockets}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.0.0 | La propiedad ahora tiene un prototipo `null`. |
| v0.3.6 | Agregado en: v0.3.6 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Un objeto que contiene matrices de sockets actualmente en uso por el agente. No modificar.

## Clase: `http.ClientRequest` {#class-httpclientrequest}

**Agregado en: v0.1.17**

- Extiende: [\<http.OutgoingMessage\>](/es/nodejs/api/http#class-httpoutgoingmessage)

Este objeto se crea internamente y se devuelve desde [`http.request()`](/es/nodejs/api/http#httprequestoptions-callback). Representa una solicitud *en curso* cuyo encabezado ya se ha puesto en cola. El encabezado aún es mutable utilizando la API [`setHeader(name, value)`](/es/nodejs/api/http#requestsetheadername-value), [`getHeader(name)`](/es/nodejs/api/http#requestgetheadername), [`removeHeader(name)`](/es/nodejs/api/http#requestremoveheadername). El encabezado real se enviará junto con el primer fragmento de datos o al llamar a [`request.end()`](/es/nodejs/api/http#requestenddata-encoding-callback).

Para obtener la respuesta, agregue un detector para [`'response'`](/es/nodejs/api/http#event-response) al objeto de solicitud. [`'response'`](/es/nodejs/api/http#event-response) se emitirá desde el objeto de solicitud cuando se hayan recibido los encabezados de respuesta. El evento [`'response'`](/es/nodejs/api/http#event-response) se ejecuta con un argumento que es una instancia de [`http.IncomingMessage`](/es/nodejs/api/http#class-httpincomingmessage).

Durante el evento [`'response'`](/es/nodejs/api/http#event-response), se pueden agregar detectores al objeto de respuesta; particularmente para escuchar el evento `'data'`.

Si no se agrega ningún controlador de [`'response'`](/es/nodejs/api/http#event-response), la respuesta se descartará por completo. Sin embargo, si se agrega un controlador de eventos [`'response'`](/es/nodejs/api/http#event-response), los datos del objeto de respuesta **deben** consumirse, ya sea llamando a `response.read()` cada vez que haya un evento `'readable'`, o agregando un controlador `'data'`, o llamando al método `.resume()`. Hasta que se consuman los datos, el evento `'end'` no se activará. Además, hasta que se lean los datos, consumirá memoria que eventualmente puede conducir a un error de "proceso sin memoria".

Para compatibilidad con versiones anteriores, `res` solo emitirá `'error'` si hay un detector de `'error'` registrado.

Establezca el encabezado `Content-Length` para limitar el tamaño del cuerpo de la respuesta. Si [`response.strictContentLength`](/es/nodejs/api/http#responsestrictcontentlength) se establece en `true`, la falta de coincidencia del valor del encabezado `Content-Length` provocará que se lance un `Error`, identificado por `code:` [`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`](/es/nodejs/api/errors#err_http_content_length_mismatch).

El valor de `Content-Length` debe estar en bytes, no en caracteres. Utilice [`Buffer.byteLength()`](/es/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding) para determinar la longitud del cuerpo en bytes.


### Evento: `'abort'` {#event-abort}

**Añadido en: v1.4.1**

**Obsoleto desde: v17.0.0, v16.12.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto. En su lugar, escuche el evento `'close'`.
:::

Se emite cuando el cliente ha abortado la solicitud. Este evento solo se emite en la primera llamada a `abort()`.

### Evento: `'close'` {#event-close}

**Añadido en: v0.5.4**

Indica que la solicitud se ha completado o que su conexión subyacente ha finalizado prematuramente (antes de que se complete la respuesta).

### Evento: `'connect'` {#event-connect}

**Añadido en: v0.7.0**

- `response` [\<http.IncomingMessage\>](/es/nodejs/api/http#class-httpincomingmessage)
- `socket` [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)
- `head` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Se emite cada vez que un servidor responde a una solicitud con un método `CONNECT`. Si no se está escuchando este evento, las conexiones de los clientes que reciban un método `CONNECT` se cerrarán.

Se garantiza que a este evento se le pasará una instancia de la clase [\<net.Socket\>](/es/nodejs/api/net#class-netsocket), una subclase de [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex), a menos que el usuario especifique un tipo de socket diferente a [\<net.Socket\>](/es/nodejs/api/net#class-netsocket).

Un par cliente y servidor que demuestran cómo escuchar el evento `'connect'`:

::: code-group
```js [ESM]
import { createServer, request } from 'node:http';
import { connect } from 'node:net';
import { URL } from 'node:url';

// Create an HTTP tunneling proxy
const proxy = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // Connect to an origin server
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// Now that proxy is running
proxy.listen(1337, '127.0.0.1', () => {

  // Make a request to a tunneling proxy
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80',
  };

  const req = request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('got connected!');

    // Make a request over an HTTP tunnel
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
```

```js [CJS]
const http = require('node:http');
const net = require('node:net');
const { URL } = require('node:url');

// Create an HTTP tunneling proxy
const proxy = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // Connect to an origin server
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = net.connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// Now that proxy is running
proxy.listen(1337, '127.0.0.1', () => {

  // Make a request to a tunneling proxy
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80',
  };

  const req = http.request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('got connected!');

    // Make a request over an HTTP tunnel
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
```
:::


### Evento: `'continue'` {#event-continue}

**Añadido en: v0.3.2**

Emitido cuando el servidor envía una respuesta HTTP '100 Continue', normalmente porque la solicitud contenía 'Expect: 100-continue'. Esta es una instrucción para que el cliente envíe el cuerpo de la solicitud.

### Evento: `'finish'` {#event-finish}

**Añadido en: v0.3.6**

Emitido cuando la solicitud ha sido enviada. Más específicamente, este evento se emite cuando el último segmento de las cabeceras y el cuerpo de la respuesta han sido entregados al sistema operativo para su transmisión a través de la red. No implica que el servidor haya recibido nada todavía.

### Evento: `'information'` {#event-information}

**Añadido en: v10.0.0**

- `info` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `httpVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `httpVersionMajor` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `httpVersionMinor` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `statusCode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rawHeaders` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

Emitido cuando el servidor envía una respuesta intermedia 1xx (excluyendo la actualización 101). Los listeners de este evento recibirán un objeto que contiene la versión HTTP, el código de estado, el mensaje de estado, el objeto de cabeceras clave-valor y un array con los nombres de las cabeceras raw seguidos de sus respectivos valores.



::: code-group
```js [ESM]
import { request } from 'node:http';

const options = {
  host: '127.0.0.1',
  port: 8080,
  path: '/length_request',
};

// Make a request
const req = request(options);
req.end();

req.on('information', (info) => {
  console.log(`Got information prior to main response: ${info.statusCode}`);
});
```

```js [CJS]
const http = require('node:http');

const options = {
  host: '127.0.0.1',
  port: 8080,
  path: '/length_request',
};

// Make a request
const req = http.request(options);
req.end();

req.on('information', (info) => {
  console.log(`Got information prior to main response: ${info.statusCode}`);
});
```
:::

Los estados de actualización 101 no activan este evento debido a su ruptura con la cadena tradicional de solicitud/respuesta HTTP, como los web sockets, las actualizaciones TLS in situ o HTTP 2.0. Para recibir notificaciones de los avisos de actualización 101, escuche el evento [`'upgrade'`](/es/nodejs/api/http#event-upgrade) en su lugar.


### Evento: `'response'` {#event-response}

**Añadido en: v0.1.0**

- `response` [\<http.IncomingMessage\>](/es/nodejs/api/http#class-httpincomingmessage)

Se emite cuando se recibe una respuesta a esta solicitud. Este evento se emite solo una vez.

### Evento: `'socket'` {#event-socket}

**Añadido en: v0.5.3**

- `socket` [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)

Se garantiza que este evento recibirá una instancia de la clase [\<net.Socket\>](/es/nodejs/api/net#class-netsocket), una subclase de [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex), a menos que el usuario especifique un tipo de socket diferente a [\<net.Socket\>](/es/nodejs/api/net#class-netsocket).

### Evento: `'timeout'` {#event-timeout}

**Añadido en: v0.7.8**

Se emite cuando el socket subyacente se agota por inactividad. Esto solo notifica que el socket ha estado inactivo. La solicitud debe destruirse manualmente.

Ver también: [`request.setTimeout()`](/es/nodejs/api/http#requestsettimeouttimeout-callback).

### Evento: `'upgrade'` {#event-upgrade}

**Añadido en: v0.1.94**

- `response` [\<http.IncomingMessage\>](/es/nodejs/api/http#class-httpincomingmessage)
- `socket` [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)
- `head` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Se emite cada vez que un servidor responde a una solicitud con una actualización. Si no se está escuchando este evento y el código de estado de la respuesta es 101 Switching Protocols, los clientes que reciban un encabezado de actualización tendrán sus conexiones cerradas.

Se garantiza que este evento recibirá una instancia de la clase [\<net.Socket\>](/es/nodejs/api/net#class-netsocket), una subclase de [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex), a menos que el usuario especifique un tipo de socket diferente a [\<net.Socket\>](/es/nodejs/api/net#class-netsocket).

Un par cliente-servidor que demuestra cómo escuchar el evento `'upgrade'`.

::: code-group
```js [ESM]
import http from 'node:http';
import process from 'node:process';

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
server.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  socket.pipe(socket); // echo back
});

// Now that server is running
server.listen(1337, '127.0.0.1', () => {

  // make a request
  const options = {
    port: 1337,
    host: '127.0.0.1',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
    },
  };

  const req = http.request(options);
  req.end();

  req.on('upgrade', (res, socket, upgradeHead) => {
    console.log('got upgraded!');
    socket.end();
    process.exit(0);
  });
});
```

```js [CJS]
const http = require('node:http');

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
server.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  socket.pipe(socket); // echo back
});

// Now that server is running
server.listen(1337, '127.0.0.1', () => {

  // make a request
  const options = {
    port: 1337,
    host: '127.0.0.1',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
    },
  };

  const req = http.request(options);
  req.end();

  req.on('upgrade', (res, socket, upgradeHead) => {
    console.log('got upgraded!');
    socket.end();
    process.exit(0);
  });
});
```
:::


### `request.abort()` {#requestabort}

**Añadido en: v0.3.8**

**Obsoleto desde: v14.1.0, v13.14.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Use [`request.destroy()`](/es/nodejs/api/http#requestdestroyerror) en su lugar.
:::

Marca la solicitud como abortada. Al llamar a esto, se descartarán los datos restantes en la respuesta y se destruirá el socket.

### `request.aborted` {#requestaborted}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.0.0, v16.12.0 | Obsoleto desde: v17.0.0, v16.12.0 |
| v11.0.0 | La propiedad `aborted` ya no es un número de marca de tiempo. |
| v0.11.14 | Añadido en: v0.11.14 |
:::

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto. Compruebe [`request.destroyed`](/es/nodejs/api/http#requestdestroyed) en su lugar.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La propiedad `request.aborted` será `true` si la solicitud ha sido abortada.

### `request.connection` {#requestconnection}

**Añadido en: v0.3.0**

**Obsoleto desde: v13.0.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto. Use [`request.socket`](/es/nodejs/api/http#requestsocket).
:::

- [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)

Vea [`request.socket`](/es/nodejs/api/http#requestsocket).

### `request.cork()` {#requestcork}

**Añadido en: v13.2.0, v12.16.0**

Vea [`writable.cork()`](/es/nodejs/api/stream#writablecork).

### `request.end([data[, encoding]][, callback])` {#requestenddata-encoding-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | El parámetro `data` ahora puede ser un `Uint8Array`. |
| v10.0.0 | Este método ahora devuelve una referencia a `ClientRequest`. |
| v0.1.90 | Añadido en: v0.1.90 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Finaliza el envío de la solicitud. Si alguna parte del cuerpo no se ha enviado, la enviará al flujo. Si la solicitud está fragmentada, esto enviará el `'0\r\n\r\n'` de terminación.

Si se especifica `data`, es equivalente a llamar a [`request.write(data, encoding)`](/es/nodejs/api/http#requestwritechunk-encoding-callback) seguido de `request.end(callback)`.

Si se especifica `callback`, se llamará cuando el flujo de solicitud haya finalizado.


### `request.destroy([error])` {#requestdestroyerror}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.5.0 | La función devuelve `this` para consistencia con otros streams Readable. |
| v0.3.0 | Añadido en: v0.3.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Opcional, un error para emitir con el evento `'error'`.
- Devuelve: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Destruye la solicitud. Opcionalmente emite un evento `'error'`, y emite un evento `'close'`. Llamar a esto causará que los datos restantes en la respuesta se descarten y el socket se destruya.

Véase [`writable.destroy()`](/es/nodejs/api/stream#writabledestroyerror) para más detalles.

#### `request.destroyed` {#requestdestroyed}

**Agregado en: v14.1.0, v13.14.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Es `true` después de que se haya llamado a [`request.destroy()`](/es/nodejs/api/http#requestdestroyerror).

Véase [`writable.destroyed`](/es/nodejs/api/stream#writabledestroyed) para más detalles.

### `request.finished` {#requestfinished}

**Agregado en: v0.0.1**

**Obsoleto desde: v13.4.0, v12.16.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto. Use [`request.writableEnded`](/es/nodejs/api/http#requestwritableended).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La propiedad `request.finished` será `true` si se ha llamado a [`request.end()`](/es/nodejs/api/http#requestenddata-encoding-callback). Se llamará automáticamente a `request.end()` si la solicitud se inició a través de [`http.get()`](/es/nodejs/api/http#httpgetoptions-callback).

### `request.flushHeaders()` {#requestflushheaders}

**Agregado en: v1.6.0**

Descarga los encabezados de la solicitud.

Por razones de eficiencia, Node.js normalmente almacena en búfer los encabezados de la solicitud hasta que se llama a `request.end()` o se escribe el primer fragmento de datos de la solicitud. Luego intenta empaquetar los encabezados de la solicitud y los datos en un solo paquete TCP.

Eso es usualmente deseado (ahorra un viaje de ida y vuelta TCP), pero no cuando los primeros datos no se envían hasta posiblemente mucho más tarde. `request.flushHeaders()` omite la optimización e inicia la solicitud.


### `request.getHeader(name)` {#requestgetheadername}

**Agregado en: v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Lee un encabezado en la solicitud. El nombre no distingue entre mayúsculas y minúsculas. El tipo del valor de retorno depende de los argumentos proporcionados a [`request.setHeader()`](/es/nodejs/api/http#requestsetheadername-value).

```js [ESM]
request.setHeader('content-type', 'text/html');
request.setHeader('Content-Length', Buffer.byteLength(body));
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
const contentType = request.getHeader('Content-Type');
// 'contentType' es 'text/html'
const contentLength = request.getHeader('Content-Length');
// 'contentLength' es de tipo number
const cookie = request.getHeader('Cookie');
// 'cookie' es de tipo string[]
```
### `request.getHeaderNames()` {#requestgetheadernames}

**Agregado en: v7.7.0**

- Devuelve: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve una matriz que contiene los nombres únicos de los encabezados salientes actuales. Todos los nombres de encabezado están en minúsculas.

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getHeaderNames();
// headerNames === ['foo', 'cookie']
```
### `request.getHeaders()` {#requestgetheaders}

**Agregado en: v7.7.0**

- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Devuelve una copia superficial de los encabezados salientes actuales. Dado que se utiliza una copia superficial, los valores de la matriz pueden mutarse sin llamadas adicionales a varios métodos del módulo http relacionados con el encabezado. Las claves del objeto devuelto son los nombres de los encabezados y los valores son los valores de los encabezados respectivos. Todos los nombres de encabezado están en minúsculas.

El objeto devuelto por el método `request.getHeaders()` *no* hereda prototípicamente de JavaScript `Object`. Esto significa que los métodos típicos de `Object` como `obj.toString()`, `obj.hasOwnProperty()` y otros no están definidos y *no funcionarán*.

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headers = request.getHeaders();
// headers === { foo: 'bar', 'cookie': ['foo=bar', 'bar=baz'] }
```

### `request.getRawHeaderNames()` {#requestgetrawheadernames}

**Añadido en: v15.13.0, v14.17.0**

- Devuelve: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve un array que contiene los nombres únicos de los encabezados sin procesar de salida actuales. Los nombres de los encabezados se devuelven con el uso de mayúsculas y minúsculas exacto que se ha establecido.

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getRawHeaderNames();
// headerNames === ['Foo', 'Set-Cookie']
```
### `request.hasHeader(name)` {#requesthasheadername}

**Añadido en: v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el encabezado identificado por `name` está establecido actualmente en los encabezados de salida. La coincidencia del nombre del encabezado no distingue entre mayúsculas y minúsculas.

```js [ESM]
const hasContentType = request.hasHeader('content-type');
```
### `request.maxHeadersCount` {#requestmaxheaderscount}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `2000`

Limita el número máximo de encabezados de respuesta. Si se establece en 0, no se aplicará ningún límite.

### `request.path` {#requestpath}

**Añadido en: v0.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La ruta de la solicitud.

### `request.method` {#requestmethod}

**Añadido en: v0.1.97**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El método de la solicitud.

### `request.host` {#requesthost}

**Añadido en: v14.5.0, v12.19.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El host de la solicitud.

### `request.protocol` {#requestprotocol}

**Añadido en: v14.5.0, v12.19.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El protocolo de la solicitud.

### `request.removeHeader(name)` {#requestremoveheadername}

**Añadido en: v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Elimina un encabezado que ya está definido en el objeto de encabezados.

```js [ESM]
request.removeHeader('Content-Type');
```

### `request.reusedSocket` {#requestreusedsocket}

**Añadido en: v13.0.0, v12.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si la solicitud se envía a través de un socket reutilizado.

Al enviar una solicitud a través de un agente con keep-alive habilitado, el socket subyacente podría reutilizarse. Pero si el servidor cierra la conexión en un momento desafortunado, el cliente puede encontrarse con un error 'ECONNRESET'.

::: code-group
```js [ESM]
import http from 'node:http';

// El servidor tiene un tiempo de espera de keep-alive de 5 segundos de forma predeterminada
http
  .createServer((req, res) => {
    res.write('hello\n');
    res.end();
  })
  .listen(3000);

setInterval(() => {
  // Adaptando un agente keep-alive
  http.get('http://localhost:3000', { agent }, (res) => {
    res.on('data', (data) => {
      // No hacer nada
    });
  });
}, 5000); // Enviando la solicitud en un intervalo de 5 segundos para que sea fácil alcanzar el tiempo de espera de inactividad
```

```js [CJS]
const http = require('node:http');

// El servidor tiene un tiempo de espera de keep-alive de 5 segundos de forma predeterminada
http
  .createServer((req, res) => {
    res.write('hello\n');
    res.end();
  })
  .listen(3000);

setInterval(() => {
  // Adaptando un agente keep-alive
  http.get('http://localhost:3000', { agent }, (res) => {
    res.on('data', (data) => {
      // No hacer nada
    });
  });
}, 5000); // Enviando la solicitud en un intervalo de 5 segundos para que sea fácil alcanzar el tiempo de espera de inactividad
```
:::

Al marcar una solicitud como si reutilizara o no el socket, podemos realizar un reintento automático de error basándonos en ello.

::: code-group
```js [ESM]
import http from 'node:http';
const agent = new http.Agent({ keepAlive: true });

function retriableRequest() {
  const req = http
    .get('http://localhost:3000', { agent }, (res) => {
      // ...
    })
    .on('error', (err) => {
      // Comprobar si es necesario reintentar
      if (req.reusedSocket && err.code === 'ECONNRESET') {
        retriableRequest();
      }
    });
}

retriableRequest();
```

```js [CJS]
const http = require('node:http');
const agent = new http.Agent({ keepAlive: true });

function retriableRequest() {
  const req = http
    .get('http://localhost:3000', { agent }, (res) => {
      // ...
    })
    .on('error', (err) => {
      // Comprobar si es necesario reintentar
      if (req.reusedSocket && err.code === 'ECONNRESET') {
        retriableRequest();
      }
    });
}

retriableRequest();
```
:::


### `request.setHeader(name, value)` {#requestsetheadername-value}

**Agregada en: v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Establece un único valor de encabezado para el objeto de encabezados. Si este encabezado ya existe en los encabezados que se van a enviar, su valor será reemplazado. Utilice una matriz de strings aquí para enviar múltiples encabezados con el mismo nombre. Los valores que no sean strings se almacenarán sin modificaciones. Por lo tanto, [`request.getHeader()`](/es/nodejs/api/http#requestgetheadername) puede devolver valores que no sean strings. Sin embargo, los valores que no sean strings se convertirán a strings para la transmisión de red.

```js [ESM]
request.setHeader('Content-Type', 'application/json');
```
o

```js [ESM]
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
```
Cuando el valor es un string, se lanzará una excepción si contiene caracteres fuera de la codificación `latin1`.

Si necesita pasar caracteres UTF-8 en el valor, codifique el valor utilizando el estándar [RFC 8187](https://www.rfc-editor.org/rfc/rfc8187.txt).

```js [ESM]
const filename = 'Rock 🎵.txt';
request.setHeader('Content-Disposition', `attachment; filename*=utf-8''${encodeURIComponent(filename)}`);
```
### `request.setNoDelay([noDelay])` {#requestsetnodelaynodelay}

**Agregada en: v0.5.9**

- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Una vez que un socket es asignado a esta solicitud y está conectado, se llamará a [`socket.setNoDelay()`](/es/nodejs/api/net#socketsetnodelaynodelay).

### `request.setSocketKeepAlive([enable][, initialDelay])` {#requestsetsocketkeepaliveenable-initialdelay}

**Agregada en: v0.5.9**

- `enable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `initialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Una vez que un socket es asignado a esta solicitud y está conectado, se llamará a [`socket.setKeepAlive()`](/es/nodejs/api/net#socketsetkeepaliveenable-initialdelay).


### `request.setTimeout(timeout[, callback])` {#requestsettimeouttimeout-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.0.0 | Establecer consistentemente el tiempo de espera del socket sólo cuando el socket se conecta. |
| v0.5.9 | Añadido en: v0.5.9 |
:::

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Milisegundos antes de que una solicitud exceda el tiempo de espera.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Función opcional que se llama cuando se produce un tiempo de espera. Es lo mismo que vincularse al evento `'timeout'`.
- Devuelve: [\<http.ClientRequest\>](/es/nodejs/api/http#class-httpclientrequest)

Una vez que se asigna un socket a esta solicitud y está conectado, se llamará a [`socket.setTimeout()`](/es/nodejs/api/net#socketsettimeouttimeout-callback).

### `request.socket` {#requestsocket}

**Añadido en: v0.3.0**

- [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)

Referencia al socket subyacente. Por lo general, los usuarios no querrán acceder a esta propiedad. En particular, el socket no emitirá eventos `'readable'` debido a la forma en que el analizador de protocolo se adjunta al socket.

::: code-group
```js [ESM]
import http from 'node:http';
const options = {
  host: 'www.google.com',
};
const req = http.get(options);
req.end();
req.once('response', (res) => {
  const ip = req.socket.localAddress;
  const port = req.socket.localPort;
  console.log(`Your IP address is ${ip} and your source port is ${port}.`);
  // Consume response object
});
```

```js [CJS]
const http = require('node:http');
const options = {
  host: 'www.google.com',
};
const req = http.get(options);
req.end();
req.once('response', (res) => {
  const ip = req.socket.localAddress;
  const port = req.socket.localPort;
  console.log(`Your IP address is ${ip} and your source port is ${port}.`);
  // Consume response object
});
```
:::

Se garantiza que esta propiedad es una instancia de la clase [\<net.Socket\>](/es/nodejs/api/net#class-netsocket), una subclase de [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex), a menos que el usuario especifique un tipo de socket diferente a [\<net.Socket\>](/es/nodejs/api/net#class-netsocket).


### `request.uncork()` {#requestuncork}

**Agregado en: v13.2.0, v12.16.0**

Consulte [`writable.uncork()`](/es/nodejs/api/stream#writableuncork).

### `request.writableEnded` {#requestwritableended}

**Agregado en: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Es `true` después de que se haya llamado a [`request.end()`](/es/nodejs/api/http#requestenddata-encoding-callback). Esta propiedad no indica si los datos se han vaciado; para ello, utilice [`request.writableFinished`](/es/nodejs/api/http#requestwritablefinished) en su lugar.

### `request.writableFinished` {#requestwritablefinished}

**Agregado en: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Es `true` si todos los datos se han vaciado al sistema subyacente, inmediatamente antes de que se emita el evento [`'finish'`](/es/nodejs/api/http#event-finish).

### `request.write(chunk[, encoding][, callback])` {#requestwritechunk-encoding-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | El parámetro `chunk` ahora puede ser un `Uint8Array`. |
| v0.1.29 | Agregado en: v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Envía un fragmento del cuerpo. Este método se puede llamar varias veces. Si no se establece `Content-Length`, los datos se codificarán automáticamente en la codificación de transferencia fragmentada HTTP, para que el servidor sepa cuándo terminan los datos. Se agrega el encabezado `Transfer-Encoding: chunked`. Es necesario llamar a [`request.end()`](/es/nodejs/api/http#requestenddata-encoding-callback) para finalizar el envío de la solicitud.

El argumento `encoding` es opcional y solo se aplica cuando `chunk` es una cadena. El valor predeterminado es `'utf8'`.

El argumento `callback` es opcional y se llamará cuando se vacíe este fragmento de datos, pero solo si el fragmento no está vacío.

Devuelve `true` si todos los datos se vaciaron correctamente en el búfer del kernel. Devuelve `false` si todos o parte de los datos se pusieron en cola en la memoria del usuario. Se emitirá `'drain'` cuando el búfer vuelva a estar libre.

Cuando se llama a la función `write` con una cadena o búfer vacío, no hace nada y espera más entradas.


## Clase: `http.Server` {#class-httpserver}

**Agregado en: v0.1.17**

- Extiende: [\<net.Server\>](/es/nodejs/api/net#class-netserver)

### Evento: `'checkContinue'` {#event-checkcontinue}

**Agregado en: v0.3.0**

- `request` [\<http.IncomingMessage\>](/es/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/es/nodejs/api/http#class-httpserverresponse)

Se emite cada vez que se recibe una solicitud con un `Expect: 100-continue` HTTP. Si no se está escuchando este evento, el servidor responderá automáticamente con un `100 Continue` según corresponda.

El manejo de este evento implica llamar a [`response.writeContinue()`](/es/nodejs/api/http#responsewritecontinue) si el cliente debe continuar enviando el cuerpo de la solicitud, o generar una respuesta HTTP apropiada (por ejemplo, 400 Bad Request) si el cliente no debe continuar enviando el cuerpo de la solicitud.

Cuando este evento se emite y se maneja, el evento [`'request'`](/es/nodejs/api/http#event-request) no se emitirá.

### Evento: `'checkExpectation'` {#event-checkexpectation}

**Agregado en: v5.5.0**

- `request` [\<http.IncomingMessage\>](/es/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/es/nodejs/api/http#class-httpserverresponse)

Se emite cada vez que se recibe una solicitud con un encabezado HTTP `Expect`, donde el valor no es `100-continue`. Si no se está escuchando este evento, el servidor responderá automáticamente con un `417 Expectation Failed` según corresponda.

Cuando este evento se emite y se maneja, el evento [`'request'`](/es/nodejs/api/http#event-request) no se emitirá.

### Evento: `'clientError'` {#event-clienterror}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.0.0 | El comportamiento predeterminado devolverá un 431 Request Header Fields Too Large si se produce un error HPE_HEADER_OVERFLOW. |
| v9.4.0 | El `rawPacket` es el búfer actual que acaba de analizar. Agregar este búfer al objeto de error del evento `'clientError'` es para que los desarrolladores puedan registrar el paquete roto. |
| v6.0.0 | La acción predeterminada de llamar a `.destroy()` en el `socket` ya no se llevará a cabo si hay listeners adjuntos para `'clientError'`. |
| v0.1.94 | Agregado en: v0.1.94 |
:::

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `socket` [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)

Si una conexión de cliente emite un evento `'error'`, se reenviará aquí. El listener de este evento es responsable de cerrar/destruir el socket subyacente. Por ejemplo, uno podría desear cerrar más elegantemente el socket con una respuesta HTTP personalizada en lugar de interrumpir abruptamente la conexión. El socket **debe cerrarse o destruirse** antes de que termine el listener.

Se garantiza que este evento recibirá una instancia de la clase [\<net.Socket\>](/es/nodejs/api/net#class-netsocket), una subclase de [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex), a menos que el usuario especifique un tipo de socket diferente a [\<net.Socket\>](/es/nodejs/api/net#class-netsocket).

El comportamiento predeterminado es intentar cerrar el socket con un HTTP '400 Bad Request', o un HTTP '431 Request Header Fields Too Large' en el caso de un error [`HPE_HEADER_OVERFLOW`](/es/nodejs/api/errors#hpe_header_overflow). Si el socket no es grabable o los encabezados del [`http.ServerResponse`](/es/nodejs/api/http#class-httpserverresponse) adjunto actual se han enviado, se destruye inmediatamente.

`socket` es el objeto [`net.Socket`](/es/nodejs/api/net#class-netsocket) del que se originó el error.



::: code-group
```js [ESM]
import http from 'node:http';

const server = http.createServer((req, res) => {
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);
```

```js [CJS]
const http = require('node:http');

const server = http.createServer((req, res) => {
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);
```
:::

Cuando ocurre el evento `'clientError'`, no hay un objeto `request` o `response`, por lo que cualquier respuesta HTTP enviada, incluidos los encabezados de respuesta y la carga útil, *debe* escribirse directamente en el objeto `socket`. Se debe tener cuidado para asegurar que la respuesta sea un mensaje de respuesta HTTP con el formato adecuado.

`err` es una instancia de `Error` con dos columnas adicionales:

- `bytesParsed`: el recuento de bytes del paquete de solicitud que Node.js puede haber analizado correctamente;
- `rawPacket`: el paquete raw de la solicitud actual.

En algunos casos, el cliente ya ha recibido la respuesta y/o el socket ya ha sido destruido, como en el caso de los errores `ECONNRESET`. Antes de intentar enviar datos al socket, es mejor comprobar si todavía se puede escribir.

```js [ESM]
server.on('clientError', (err, socket) => {
  if (err.code === 'ECONNRESET' || !socket.writable) {
    return;
  }

  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
```

### Evento: `'close'` {#event-close_1}

**Añadido en: v0.1.4**

Se emite cuando el servidor se cierra.

### Evento: `'connect'` {#event-connect_1}

**Añadido en: v0.7.0**

- `request` [\<http.IncomingMessage\>](/es/nodejs/api/http#class-httpincomingmessage) Argumentos para la solicitud HTTP, como en el evento [`'request'`](/es/nodejs/api/http#event-request)
- `socket` [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex) Socket de red entre el servidor y el cliente
- `head` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) El primer paquete del flujo de tunelización (puede estar vacío)

Se emite cada vez que un cliente solicita un método HTTP `CONNECT`. Si no se escucha este evento, las conexiones de los clientes que soliciten un método `CONNECT` se cerrarán.

Se garantiza que este evento recibirá una instancia de la clase [\<net.Socket\>](/es/nodejs/api/net#class-netsocket), una subclase de [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex), a menos que el usuario especifique un tipo de socket diferente a [\<net.Socket\>](/es/nodejs/api/net#class-netsocket).

Después de que se emita este evento, el socket de la solicitud no tendrá un listener de eventos `'data'`, lo que significa que deberá estar vinculado para poder manejar los datos enviados al servidor en ese socket.

### Evento: `'connection'` {#event-connection}

**Añadido en: v0.1.0**

- `socket` [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)

Este evento se emite cuando se establece un nuevo flujo TCP. `socket` es típicamente un objeto de tipo [`net.Socket`](/es/nodejs/api/net#class-netsocket). Generalmente, los usuarios no querrán acceder a este evento. En particular, el socket no emitirá eventos `'readable'` debido a cómo el analizador de protocolo se adjunta al socket. También se puede acceder al `socket` en `request.socket`.

Este evento también puede ser emitido explícitamente por los usuarios para inyectar conexiones en el servidor HTTP. En ese caso, se puede pasar cualquier flujo [`Duplex`](/es/nodejs/api/stream#class-streamduplex).

Si se llama a `socket.setTimeout()` aquí, el tiempo de espera se reemplazará con `server.keepAliveTimeout` cuando el socket haya atendido una solicitud (si `server.keepAliveTimeout` no es cero).

Se garantiza que este evento recibirá una instancia de la clase [\<net.Socket\>](/es/nodejs/api/net#class-netsocket), una subclase de [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex), a menos que el usuario especifique un tipo de socket diferente a [\<net.Socket\>](/es/nodejs/api/net#class-netsocket).


### Evento: `'dropRequest'` {#event-droprequest}

**Agregado en: v18.7.0, v16.17.0**

- `request` [\<http.IncomingMessage\>](/es/nodejs/api/http#class-httpincomingmessage) Argumentos para la solicitud HTTP, tal como están en el evento [`'request'`](/es/nodejs/api/http#event-request)
- `socket` [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex) Socket de red entre el servidor y el cliente

Cuando el número de solicitudes en un socket alcanza el umbral de `server.maxRequestsPerSocket`, el servidor descartará nuevas solicitudes y emitirá el evento `'dropRequest'` en su lugar, y luego enviará `503` al cliente.

### Evento: `'request'` {#event-request}

**Agregado en: v0.1.0**

- `request` [\<http.IncomingMessage\>](/es/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/es/nodejs/api/http#class-httpserverresponse)

Emitido cada vez que hay una solicitud. Puede haber varias solicitudes por conexión (en el caso de conexiones HTTP Keep-Alive).

### Evento: `'upgrade'` {#event-upgrade_1}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | No escuchar este evento ya no causa que el socket se destruya si un cliente envía un encabezado Upgrade. |
| v0.1.94 | Agregado en: v0.1.94 |
:::

- `request` [\<http.IncomingMessage\>](/es/nodejs/api/http#class-httpincomingmessage) Argumentos para la solicitud HTTP, tal como están en el evento [`'request'`](/es/nodejs/api/http#event-request)
- `socket` [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex) Socket de red entre el servidor y el cliente
- `head` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) El primer paquete del stream actualizado (puede estar vacío)

Emitido cada vez que un cliente solicita una actualización HTTP. Escuchar este evento es opcional y los clientes no pueden insistir en un cambio de protocolo.

Después de que se emite este evento, el socket de la solicitud no tendrá un listener de evento `'data'`, lo que significa que deberá estar vinculado para manejar los datos enviados al servidor en ese socket.

Se garantiza que este evento recibirá una instancia de la clase [\<net.Socket\>](/es/nodejs/api/net#class-netsocket), una subclase de [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex), a menos que el usuario especifique un tipo de socket diferente a [\<net.Socket\>](/es/nodejs/api/net#class-netsocket).


### `server.close([callback])` {#serverclosecallback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | El método cierra las conexiones inactivas antes de regresar. |
| v0.1.90 | Añadido en: v0.1.90 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Impide que el servidor acepte nuevas conexiones y cierra todas las conexiones conectadas a este servidor que no están enviando una solicitud o esperando una respuesta. Consulte [`net.Server.close()`](/es/nodejs/api/net#serverclosecallback).

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: '¡Hola Mundo!',
  }));
});

server.listen(8000);
// Cierra el servidor después de 10 segundos
setTimeout(() => {
  server.close(() => {
    console.log('el servidor en el puerto 8000 se cerró correctamente');
  });
}, 10000);
```
### `server.closeAllConnections()` {#servercloseallconnections}

**Añadido en: v18.2.0**

Cierra todas las conexiones HTTP(S) establecidas conectadas a este servidor, incluidas las conexiones activas conectadas a este servidor que están enviando una solicitud o esperando una respuesta. Esto *no* destruye los sockets actualizados a un protocolo diferente, como WebSocket o HTTP/2.

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: '¡Hola Mundo!',
  }));
});

server.listen(8000);
// Cierra el servidor después de 10 segundos
setTimeout(() => {
  server.close(() => {
    console.log('el servidor en el puerto 8000 se cerró correctamente');
  });
  // Cierra todas las conexiones, asegurando que el servidor se cierre correctamente
  server.closeAllConnections();
}, 10000);
```
### `server.closeIdleConnections()` {#servercloseidleconnections}

**Añadido en: v18.2.0**

Cierra todas las conexiones conectadas a este servidor que no están enviando una solicitud o esperando una respuesta.

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: '¡Hola Mundo!',
  }));
});

server.listen(8000);
// Cierra el servidor después de 10 segundos
setTimeout(() => {
  server.close(() => {
    console.log('el servidor en el puerto 8000 se cerró correctamente');
  });
  // Cierra las conexiones inactivas, como las conexiones keep-alive. El servidor se cerrará
  // una vez que se terminen las conexiones activas restantes
  server.closeIdleConnections();
}, 10000);
```

### `server.headersTimeout` {#serverheaderstimeout}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.4.0, v18.14.0 | Ahora el valor predeterminado se establece en el mínimo entre 60000 (60 segundos) o `requestTimeout`. |
| v11.3.0, v10.14.0 | Añadido en: v11.3.0, v10.14.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** El mínimo entre [`server.requestTimeout`](/es/nodejs/api/http#serverrequesttimeout) o `60000`.

Limita la cantidad de tiempo que el analizador esperará para recibir los encabezados HTTP completos.

Si el tiempo de espera expira, el servidor responde con el estado 408 sin reenviar la solicitud al listener de la solicitud y luego cierra la conexión.

Debe establecerse en un valor distinto de cero (por ejemplo, 120 segundos) para protegerse contra posibles ataques de denegación de servicio en caso de que el servidor se implemente sin un proxy inverso delante.

### `server.listen()` {#serverlisten}

Inicia el servidor HTTP escuchando las conexiones. Este método es idéntico a [`server.listen()`](/es/nodejs/api/net#serverlisten) de [`net.Server`](/es/nodejs/api/net#class-netserver).

### `server.listening` {#serverlistening}

**Añadido en: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si el servidor está escuchando o no las conexiones.

### `server.maxHeadersCount` {#servermaxheaderscount}

**Añadido en: v0.7.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `2000`

Limita el recuento máximo de encabezados entrantes. Si se establece en 0, no se aplicará ningún límite.

### `server.requestTimeout` {#serverrequesttimeout}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | El tiempo de espera predeterminado de la solicitud cambió de sin tiempo de espera a 300 s (5 minutos). |
| v14.11.0 | Añadido en: v14.11.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `300000`

Establece el valor de tiempo de espera en milisegundos para recibir la solicitud completa del cliente.

Si el tiempo de espera expira, el servidor responde con el estado 408 sin reenviar la solicitud al listener de la solicitud y luego cierra la conexión.

Debe establecerse en un valor distinto de cero (por ejemplo, 120 segundos) para protegerse contra posibles ataques de denegación de servicio en caso de que el servidor se implemente sin un proxy inverso delante.


### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.0.0 | El tiempo de espera predeterminado cambió de 120s a 0 (sin tiempo de espera). |
| v0.9.12 | Añadido en: v0.9.12 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** 0 (sin tiempo de espera)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<http.Server\>](/es/nodejs/api/http#class-httpserver)

Establece el valor de tiempo de espera para los sockets y emite un evento `'timeout'` en el objeto Server, pasando el socket como un argumento, si ocurre un tiempo de espera.

Si hay un listener de evento `'timeout'` en el objeto Server, entonces se llamará con el socket con tiempo de espera como argumento.

Por defecto, el Server no agota el tiempo de espera de los sockets. Sin embargo, si se asigna una callback al evento `'timeout'` del Server, los tiempos de espera deben manejarse explícitamente.

### `server.maxRequestsPerSocket` {#servermaxrequestspersocket}

**Añadido en: v16.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Solicitudes por socket. **Predeterminado:** 0 (sin límite)

El número máximo de solicitudes que un socket puede manejar antes de cerrar la conexión keep-alive.

Un valor de `0` deshabilitará el límite.

Cuando se alcanza el límite, establecerá el valor del encabezado `Connection` en `close`, pero en realidad no cerrará la conexión; las solicitudes posteriores enviadas después de que se alcance el límite obtendrán `503 Service Unavailable` como respuesta.

### `server.timeout` {#servertimeout}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.0.0 | El tiempo de espera predeterminado cambió de 120s a 0 (sin tiempo de espera). |
| v0.9.12 | Añadido en: v0.9.12 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tiempo de espera en milisegundos. **Predeterminado:** 0 (sin tiempo de espera)

El número de milisegundos de inactividad antes de que se presuma que un socket ha agotado el tiempo de espera.

Un valor de `0` deshabilitará el comportamiento de tiempo de espera en las conexiones entrantes.

La lógica de tiempo de espera del socket se configura en la conexión, por lo que cambiar este valor solo afecta a las nuevas conexiones al servidor, no a las conexiones existentes.


### `server.keepAliveTimeout` {#serverkeepalivetimeout}

**Agregado en: v8.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tiempo de espera en milisegundos. **Predeterminado:** `5000` (5 segundos).

La cantidad de milisegundos de inactividad que un servidor necesita esperar para recibir datos entrantes adicionales, después de que haya terminado de escribir la última respuesta, antes de que se destruya un socket. Si el servidor recibe nuevos datos antes de que se active el tiempo de espera keep-alive, restablecerá el tiempo de espera de inactividad regular, es decir, [`server.timeout`](/es/nodejs/api/http#servertimeout).

Un valor de `0` desactivará el comportamiento de tiempo de espera keep-alive en las conexiones entrantes. Un valor de `0` hace que el servidor http se comporte de manera similar a las versiones de Node.js anteriores a la 8.0.0, que no tenían un tiempo de espera keep-alive.

La lógica de tiempo de espera del socket se configura en la conexión, por lo que cambiar este valor solo afecta a las nuevas conexiones al servidor, no a las conexiones existentes.

### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Agregado en: v20.4.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Llama a [`server.close()`](/es/nodejs/api/http#serverclosecallback) y devuelve una promesa que se cumple cuando el servidor se ha cerrado.

## Clase: `http.ServerResponse` {#class-httpserverresponse}

**Agregado en: v0.1.17**

- Extiende: [\<http.OutgoingMessage\>](/es/nodejs/api/http#class-httpoutgoingmessage)

Este objeto se crea internamente mediante un servidor HTTP, no por el usuario. Se pasa como el segundo parámetro al evento [`'request'`](/es/nodejs/api/http#event-request).

### Evento: `'close'` {#event-close_2}

**Agregado en: v0.6.7**

Indica que la respuesta se ha completado o que su conexión subyacente se ha terminado prematuramente (antes de que se complete la respuesta).

### Evento: `'finish'` {#event-finish_1}

**Agregado en: v0.3.6**

Se emite cuando se ha enviado la respuesta. Más concretamente, este evento se emite cuando el último segmento de los encabezados y el cuerpo de la respuesta se han entregado al sistema operativo para su transmisión a través de la red. No implica que el cliente haya recibido nada todavía.


### `response.addTrailers(headers)` {#responseaddtrailersheaders}

**Agregado en: v0.3.0**

- `headers` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Este método agrega encabezados finales HTTP (un encabezado pero al final del mensaje) a la respuesta.

Los trailers **solo** se emitirán si se usa la codificación fragmentada para la respuesta; si no lo es (p. ej., si la solicitud era HTTP/1.0), se descartarán silenciosamente.

HTTP requiere que el encabezado `Trailer` se envíe para emitir trailers, con una lista de los campos de encabezado en su valor. Por ejemplo:

```js [ESM]
response.writeHead(200, { 'Content-Type': 'text/plain',
                          'Trailer': 'Content-MD5' });
response.write(fileData);
response.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
response.end();
```
Intentar establecer un nombre de campo de encabezado o un valor que contenga caracteres no válidos resultará en un [`TypeError`](/es/nodejs/api/errors#class-typeerror).

### `response.connection` {#responseconnection}

**Agregado en: v0.3.0**

**Obsoleto desde: v13.0.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto. Utilice [`response.socket`](/es/nodejs/api/http#responsesocket).
:::

- [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)

Consulte [`response.socket`](/es/nodejs/api/http#responsesocket).

### `response.cork()` {#responsecork}

**Agregado en: v13.2.0, v12.16.0**

Consulte [`writable.cork()`](/es/nodejs/api/stream#writablecork).

### `response.end([data[, encoding]][, callback])` {#responseenddata-encoding-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | El parámetro `data` ahora puede ser un `Uint8Array`. |
| v10.0.0 | Este método ahora devuelve una referencia a `ServerResponse`. |
| v0.1.90 | Agregado en: v0.1.90 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Este método le indica al servidor que se han enviado todos los encabezados y el cuerpo de la respuesta; ese servidor debe considerar este mensaje como completo. El método, `response.end()`, DEBE llamarse en cada respuesta.

Si se especifica `data`, tiene un efecto similar a llamar a [`response.write(data, encoding)`](/es/nodejs/api/http#responsewritechunk-encoding-callback) seguido de `response.end(callback)`.

Si se especifica `callback`, se llamará cuando finalice el flujo de respuesta.


### `response.finished` {#responsefinished}

**Agregada en: v0.0.2**

**Obsoleta desde: v13.4.0, v12.16.0**

::: danger [Estable: 0 - Obsoleta]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleta. Usar [`response.writableEnded`](/es/nodejs/api/http#responsewritableended).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La propiedad `response.finished` será `true` si se ha llamado a [`response.end()`](/es/nodejs/api/http#responseenddata-encoding-callback).

### `response.flushHeaders()` {#responseflushheaders}

**Agregada en: v1.6.0**

Vacía los encabezados de la respuesta. Ver también: [`request.flushHeaders()`](/es/nodejs/api/http#requestflushheaders).

### `response.getHeader(name)` {#responsegetheadername}

**Agregada en: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Lee un encabezado que ya se ha puesto en cola pero no se ha enviado al cliente. El nombre no distingue entre mayúsculas y minúsculas. El tipo del valor de retorno depende de los argumentos proporcionados a [`response.setHeader()`](/es/nodejs/api/http#responsesetheadername-value).

```js [ESM]
response.setHeader('Content-Type', 'text/html');
response.setHeader('Content-Length', Buffer.byteLength(body));
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
const contentType = response.getHeader('content-type');
// contentType es 'text/html'
const contentLength = response.getHeader('Content-Length');
// contentLength es de tipo número
const setCookie = response.getHeader('set-cookie');
// setCookie es de tipo string[]
```
### `response.getHeaderNames()` {#responsegetheadernames}

**Agregada en: v7.7.0**

- Devuelve: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve un arreglo que contiene los nombres únicos de los encabezados salientes actuales. Todos los nombres de los encabezados están en minúsculas.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```

### `response.getHeaders()` {#responsegetheaders}

**Agregado en: v7.7.0**

- Regresa: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Regresa una copia superficial de los encabezados salientes actuales. Dado que se utiliza una copia superficial, los valores del array se pueden modificar sin llamadas adicionales a varios métodos del módulo http relacionados con el encabezado. Las claves del objeto devuelto son los nombres de los encabezados y los valores son los valores de los encabezados respectivos. Todos los nombres de los encabezados están en minúsculas.

El objeto devuelto por el método `response.getHeaders()` *no* hereda prototípicamente del `Object` de JavaScript. Esto significa que los métodos típicos de `Object` como `obj.toString()`, `obj.hasOwnProperty()` y otros no están definidos y *no funcionarán*.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
### `response.hasHeader(name)` {#responsehasheadername}

**Agregado en: v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Regresa: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Regresa `true` si el encabezado identificado por `name` está actualmente configurado en los encabezados salientes. La coincidencia del nombre del encabezado no distingue entre mayúsculas y minúsculas.

```js [ESM]
const hasContentType = response.hasHeader('content-type');
```
### `response.headersSent` {#responseheaderssent}

**Agregado en: v0.9.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Booleano (de solo lectura). Verdadero si los encabezados fueron enviados, falso en caso contrario.

### `response.removeHeader(name)` {#responseremoveheadername}

**Agregado en: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Remueve un encabezado que está en cola para envío implícito.

```js [ESM]
response.removeHeader('Content-Encoding');
```
### `response.req` {#responsereq}

**Agregado en: v15.7.0**

- [\<http.IncomingMessage\>](/es/nodejs/api/http#class-httpincomingmessage)

Una referencia al objeto `request` HTTP original.


### `response.sendDate` {#responsesenddate}

**Añadido en: v0.7.5**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Cuando es verdadero, el encabezado Date se generará y enviará automáticamente en la respuesta si aún no está presente en los encabezados. El valor predeterminado es verdadero.

Esto solo debe desactivarse para las pruebas; HTTP requiere el encabezado Date en las respuestas.

### `response.setHeader(name, value)` {#responsesetheadername-value}

**Añadido en: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: [\<http.ServerResponse\>](/es/nodejs/api/http#class-httpserverresponse)

Devuelve el objeto de respuesta.

Establece un solo valor de encabezado para los encabezados implícitos. Si este encabezado ya existe en los encabezados que se van a enviar, su valor será reemplazado. Use una matriz de cadenas aquí para enviar múltiples encabezados con el mismo nombre. Los valores que no sean cadenas se almacenarán sin modificación. Por lo tanto, [`response.getHeader()`](/es/nodejs/api/http#responsegetheadername) puede devolver valores que no sean cadenas. Sin embargo, los valores que no sean cadenas se convertirán en cadenas para la transmisión de red. Se devuelve el mismo objeto de respuesta a la persona que llama, para permitir el encadenamiento de llamadas.

```js [ESM]
response.setHeader('Content-Type', 'text/html');
```
o

```js [ESM]
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```
Intentar establecer un nombre de campo de encabezado o un valor que contenga caracteres no válidos provocará que se lance un [`TypeError`](/es/nodejs/api/errors#class-typeerror).

Cuando los encabezados se han establecido con [`response.setHeader()`](/es/nodejs/api/http#responsesetheadername-value), se fusionarán con cualquier encabezado que se pase a [`response.writeHead()`](/es/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers), con los encabezados que se pasen a [`response.writeHead()`](/es/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) teniendo prioridad.

```js [ESM]
// Devuelve content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```
Si se llama al método [`response.writeHead()`](/es/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) y no se ha llamado a este método, escribirá directamente los valores de encabezado suministrados en el canal de red sin almacenamiento en caché interno, y [`response.getHeader()`](/es/nodejs/api/http#responsegetheadername) en el encabezado no dará el resultado esperado. Si se desea el llenado progresivo de encabezados con potencial recuperación y modificación futuras, use [`response.setHeader()`](/es/nodejs/api/http#responsesetheadername-value) en lugar de [`response.writeHead()`](/es/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers).


### `response.setTimeout(msecs[, callback])` {#responsesettimeoutmsecs-callback}

**Añadido en: v0.9.12**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<http.ServerResponse\>](/es/nodejs/api/http#class-httpserverresponse)

Establece el valor de timeout del Socket a `msecs`. Si se proporciona una callback, entonces se añade como un listener al evento `'timeout'` en el objeto de respuesta.

Si no se añade ningún listener `'timeout'` a la petición, la respuesta o el servidor, entonces los sockets se destruyen cuando se agota el tiempo de espera. Si se asigna un controlador a los eventos `'timeout'` de la petición, la respuesta o el servidor, los sockets con tiempo de espera agotado deben manejarse explícitamente.

### `response.socket` {#responsesocket}

**Añadido en: v0.3.0**

- [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)

Referencia al socket subyacente. Por lo general, los usuarios no querrán acceder a esta propiedad. En particular, el socket no emitirá eventos `'readable'` debido a cómo el analizador de protocolo se adjunta al socket. Después de `response.end()`, la propiedad se establece en nulo.

::: code-group
```js [ESM]
import http from 'node:http';
const server = http.createServer((req, res) => {
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```

```js [CJS]
const http = require('node:http');
const server = http.createServer((req, res) => {
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```
:::

Se garantiza que esta propiedad es una instancia de la clase [\<net.Socket\>](/es/nodejs/api/net#class-netsocket), una subclase de [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex), a menos que el usuario haya especificado un tipo de socket distinto de [\<net.Socket\>](/es/nodejs/api/net#class-netsocket).

### `response.statusCode` {#responsestatuscode}

**Añadido en: v0.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `200`

Cuando se utilizan cabeceras implícitas (sin llamar a [`response.writeHead()`](/es/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) explícitamente), esta propiedad controla el código de estado que se enviará al cliente cuando se vacíen las cabeceras.

```js [ESM]
response.statusCode = 404;
```
Después de que la cabecera de respuesta se haya enviado al cliente, esta propiedad indica el código de estado que se envió.


### `response.statusMessage` {#responsestatusmessage}

**Agregado en: v0.11.8**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Cuando se utilizan encabezados implícitos (no se llama a [`response.writeHead()`](/es/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) explícitamente), esta propiedad controla el mensaje de estado que se enviará al cliente cuando se vacíen los encabezados. Si esto se deja como `undefined`, se utilizará el mensaje estándar para el código de estado.

```js [ESM]
response.statusMessage = 'No encontrado';
```
Después de que el encabezado de respuesta se haya enviado al cliente, esta propiedad indica el mensaje de estado que se envió.

### `response.strictContentLength` {#responsestrictcontentlength}

**Agregado en: v18.10.0, v16.18.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `false`

Si se establece en `true`, Node.js verificará si el valor del encabezado `Content-Length` y el tamaño del cuerpo, en bytes, son iguales. Si el valor del encabezado `Content-Length` no coincide, se generará un `Error`, identificado por `code:` [`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`](/es/nodejs/api/errors#err_http_content_length_mismatch).

### `response.uncork()` {#responseuncork}

**Agregado en: v13.2.0, v12.16.0**

Ver [`writable.uncork()`](/es/nodejs/api/stream#writableuncork).

### `response.writableEnded` {#responsewritableended}

**Agregado en: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Es `true` después de que se haya llamado a [`response.end()`](/es/nodejs/api/http#responseenddata-encoding-callback). Esta propiedad no indica si los datos se han vaciado, para ello utilice [`response.writableFinished`](/es/nodejs/api/http#responsewritablefinished) en su lugar.

### `response.writableFinished` {#responsewritablefinished}

**Agregado en: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Es `true` si todos los datos se han vaciado al sistema subyacente, inmediatamente antes de que se emita el evento [`'finish'`](/es/nodejs/api/http#event-finish).

### `response.write(chunk[, encoding][, callback])` {#responsewritechunk-encoding-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | El parámetro `chunk` ahora puede ser un `Uint8Array`. |
| v0.1.29 | Agregado en: v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Si se llama a este método y no se ha llamado a [`response.writeHead()`](/es/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers), cambiará al modo de encabezado implícito y vaciará los encabezados implícitos.

Esto envía un fragmento del cuerpo de la respuesta. Este método puede llamarse varias veces para proporcionar partes sucesivas del cuerpo.

Si `rejectNonStandardBodyWrites` se establece en true en `createServer`, entonces no se permite escribir en el cuerpo cuando el método de solicitud o el estado de la respuesta no admiten contenido. Si se intenta escribir en el cuerpo para una solicitud HEAD o como parte de una respuesta `204` o `304`, se genera un `Error` síncrono con el código `ERR_HTTP_BODY_NOT_ALLOWED`.

`chunk` puede ser una cadena o un búfer. Si `chunk` es una cadena, el segundo parámetro especifica cómo codificarla en un flujo de bytes. Se llamará a `callback` cuando se vacíe este fragmento de datos.

Este es el cuerpo HTTP sin procesar y no tiene nada que ver con las codificaciones de cuerpo de varias partes de nivel superior que se puedan utilizar.

La primera vez que se llama a [`response.write()`](/es/nodejs/api/http#responsewritechunk-encoding-callback), enviará la información del encabezado almacenada en búfer y el primer fragmento del cuerpo al cliente. La segunda vez que se llama a [`response.write()`](/es/nodejs/api/http#responsewritechunk-encoding-callback), Node.js asume que los datos se transmitirán y envía los nuevos datos por separado. Es decir, la respuesta se almacena en búfer hasta el primer fragmento del cuerpo.

Devuelve `true` si todos los datos se vaciaron correctamente en el búfer del kernel. Devuelve `false` si todos o parte de los datos se pusieron en cola en la memoria del usuario. Se emitirá `'drain'` cuando el búfer esté libre de nuevo.


### `response.writeContinue()` {#responsewritecontinue}

**Agregado en: v0.3.0**

Envía un mensaje HTTP/1.1 100 Continue al cliente, indicando que el cuerpo de la solicitud debe ser enviado. Consulta el evento [`'checkContinue'`](/es/nodejs/api/http#event-checkcontinue) en `Server`.

### `response.writeEarlyHints(hints[, callback])` {#responsewriteearlyhintshints-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.11.0 | Permite pasar sugerencias como un objeto. |
| v18.11.0 | Agregado en: v18.11.0 |
:::

- `hints` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Envía un mensaje HTTP/1.1 103 Early Hints al cliente con un encabezado Link, indicando que el agente de usuario puede precargar/preconectar los recursos enlazados. `hints` es un objeto que contiene los valores de los encabezados que se enviarán con el mensaje de sugerencias tempranas. El argumento opcional `callback` se llamará cuando se haya escrito el mensaje de respuesta.

**Ejemplo**

```js [ESM]
const earlyHintsLink = '</styles.css>; rel=preload; as=style';
response.writeEarlyHints({
  'link': earlyHintsLink,
});

const earlyHintsLinks = [
  '</styles.css>; rel=preload; as=style',
  '</scripts.js>; rel=preload; as=script',
];
response.writeEarlyHints({
  'link': earlyHintsLinks,
  'x-trace-id': 'id for diagnostics',
});

const earlyHintsCallback = () => console.log('early hints message sent');
response.writeEarlyHints({
  'link': earlyHintsLinks,
}, earlyHintsCallback);
```
### `response.writeHead(statusCode[, statusMessage][, headers])` {#responsewriteheadstatuscode-statusmessage-headers}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.14.0 | Permite pasar encabezados como un array. |
| v11.10.0, v10.17.0 | Devuelve `this` desde `writeHead()` para permitir el encadenamiento con `end()`. |
| v5.11.0, v4.4.5 | Se lanza un `RangeError` si `statusCode` no es un número en el rango `[100, 999]`. |
| v0.1.30 | Agregado en: v0.1.30 |
:::

- `statusCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- Devuelve: [\<http.ServerResponse\>](/es/nodejs/api/http#class-httpserverresponse)

Envía un encabezado de respuesta a la solicitud. El código de estado es un código de estado HTTP de 3 dígitos, como `404`. El último argumento, `headers`, son los encabezados de respuesta. Opcionalmente, se puede dar un `statusMessage` legible por humanos como segundo argumento.

`headers` puede ser un `Array` donde las claves y los valores están en la misma lista. *No* es una lista de tuplas. Por lo tanto, los desplazamientos con números pares son valores de clave y los desplazamientos con números impares son los valores asociados. El array está en el mismo formato que `request.rawHeaders`.

Devuelve una referencia a `ServerResponse`, para que se puedan encadenar las llamadas.

```js [ESM]
const body = 'hello world';
response
  .writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain',
  })
  .end(body);
```
Este método solo debe llamarse una vez en un mensaje y debe llamarse antes de que se llame a [`response.end()`](/es/nodejs/api/http#responseenddata-encoding-callback).

Si se llama a [`response.write()`](/es/nodejs/api/http#responsewritechunk-encoding-callback) o [`response.end()`](/es/nodejs/api/http#responseenddata-encoding-callback) antes de llamar a este, se calcularán los encabezados implícitos/mutables y se llamará a esta función.

Cuando los encabezados se han establecido con [`response.setHeader()`](/es/nodejs/api/http#responsesetheadername-value), se combinarán con cualquier encabezado pasado a [`response.writeHead()`](/es/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers), con los encabezados pasados a [`response.writeHead()`](/es/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) que tienen prioridad.

Si se llama a este método y no se ha llamado a [`response.setHeader()`](/es/nodejs/api/http#responsesetheadername-value), escribirá directamente los valores de encabezado suministrados en el canal de red sin almacenamiento en caché interno, y el [`response.getHeader()`](/es/nodejs/api/http#responsegetheadername) en el encabezado no dará el resultado esperado. Si se desea el llenado progresivo de encabezados con posible recuperación y modificación futuras, utilice [`response.setHeader()`](/es/nodejs/api/http#responsesetheadername-value) en su lugar.

```js [ESM]
// Devuelve content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```
`Content-Length` se lee en bytes, no en caracteres. Utilice [`Buffer.byteLength()`](/es/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding) para determinar la longitud del cuerpo en bytes. Node.js comprobará si `Content-Length` y la longitud del cuerpo que se ha transmitido son iguales o no.

Intentar establecer un nombre de campo de encabezado o un valor que contenga caracteres no válidos dará como resultado que se lance un [`Error`][].


### `response.writeProcessing()` {#responsewriteprocessing}

**Agregado en: v10.0.0**

Envía un mensaje HTTP/1.1 102 Processing al cliente, indicando que el cuerpo de la solicitud debe ser enviado.

## Clase: `http.IncomingMessage` {#class-httpincomingmessage}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.5.0 | El valor de `destroyed` devuelve `true` después de que los datos entrantes son consumidos. |
| v13.1.0, v12.16.0 | El valor de `readableHighWaterMark` refleja el del socket. |
| v0.1.17 | Agregado en: v0.1.17 |
:::

- Extiende: [\<stream.Readable\>](/es/nodejs/api/stream#class-streamreadable)

Un objeto `IncomingMessage` es creado por [`http.Server`](/es/nodejs/api/http#class-httpserver) o [`http.ClientRequest`](/es/nodejs/api/http#class-httpclientrequest) y pasado como el primer argumento al evento [`'request'`](/es/nodejs/api/http#event-request) y [`'response'`](/es/nodejs/api/http#event-response) respectivamente. Puede ser usado para acceder al estado de la respuesta, las cabeceras y los datos.

A diferencia de su valor `socket` que es una subclase de [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex), el `IncomingMessage` en sí mismo extiende [\<stream.Readable\>](/es/nodejs/api/stream#class-streamreadable) y se crea por separado para analizar y emitir las cabeceras HTTP entrantes y la carga útil, ya que el socket subyacente puede ser reutilizado varias veces en caso de keep-alive.

### Evento: `'aborted'` {#event-aborted}

**Agregado en: v0.3.8**

**Obsoleto desde: v17.0.0, v16.12.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto. Escuchar el evento `'close'` en su lugar.
:::

Emitido cuando la solicitud ha sido abortada.

### Evento: `'close'` {#event-close_3}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.0.0 | El evento close ahora se emite cuando la solicitud se ha completado y no cuando se cierra el socket subyacente. |
| v0.4.2 | Agregado en: v0.4.2 |
:::

Emitido cuando la solicitud ha sido completada.

### `message.aborted` {#messageaborted}

**Agregado en: v10.1.0**

**Obsoleto desde: v17.0.0, v16.12.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto. Compruebe `message.destroyed` desde [\<stream.Readable\>](/es/nodejs/api/stream#class-streamreadable).
:::

- [\<boolean\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Boolean_type)

La propiedad `message.aborted` será `true` si la solicitud ha sido abortada.


### `message.complete` {#messagecomplete}

**Añadido en: v0.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La propiedad `message.complete` será `true` si se ha recibido un mensaje HTTP completo y se ha analizado correctamente.

Esta propiedad es particularmente útil como un medio para determinar si un cliente o servidor transmitió completamente un mensaje antes de que se terminara una conexión:

```js [ESM]
const req = http.request({
  host: '127.0.0.1',
  port: 8080,
  method: 'POST',
}, (res) => {
  res.resume();
  res.on('end', () => {
    if (!res.complete)
      console.error(
        'La conexión se terminó mientras el mensaje todavía se estaba enviando');
  });
});
```
### `message.connection` {#messageconnection}

**Añadido en: v0.1.90**

**Obsoleto desde: v16.0.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto. Use [`message.socket`](/es/nodejs/api/http#messagesocket).
:::

Alias para [`message.socket`](/es/nodejs/api/http#messagesocket).

### `message.destroy([error])` {#messagedestroyerror}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.5.0, v12.19.0 | La función devuelve `this` para mantener la coherencia con otros streams legibles. |
| v0.3.0 | Añadido en: v0.3.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- Devuelve: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Llama a `destroy()` en el socket que recibió el `IncomingMessage`. Si se proporciona `error`, se emite un evento `'error'` en el socket y `error` se pasa como argumento a cualquier listener en el evento.

### `message.headers` {#messageheaders}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.5.0, v18.14.0 | La opción `joinDuplicateHeaders` en las funciones `http.request()` y `http.createServer()` garantiza que los encabezados duplicados no se descarten, sino que se combinen utilizando un separador de comas, de acuerdo con la Sección 5.3 de RFC 9110. |
| v15.1.0 | `message.headers` ahora se calcula de forma perezosa utilizando una propiedad de acceso en el prototipo y ya no es enumerable. |
| v0.1.5 | Añadido en: v0.1.5 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

El objeto de encabezados de solicitud/respuesta.

Pares clave-valor de nombres y valores de encabezado. Los nombres de los encabezados están en minúsculas.

```js [ESM]
// Imprime algo como:
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
```
Los duplicados en los encabezados raw se gestionan de las siguientes maneras, dependiendo del nombre del encabezado:

- Los duplicados de `age`, `authorization`, `content-length`, `content-type`, `etag`, `expires`, `from`, `host`, `if-modified-since`, `if-unmodified-since`, `last-modified`, `location`, `max-forwards`, `proxy-authorization`, `referer`, `retry-after`, `server` o `user-agent` se descartan. Para permitir que los valores duplicados de los encabezados listados anteriormente se unan, use la opción `joinDuplicateHeaders` en [`http.request()`](/es/nodejs/api/http#httprequestoptions-callback) y [`http.createServer()`](/es/nodejs/api/http#httpcreateserveroptions-requestlistener). Consulte la Sección 5.3 de RFC 9110 para obtener más información.
- `set-cookie` es siempre un array. Los duplicados se añaden al array.
- Para encabezados `cookie` duplicados, los valores se unen con `; `.
- Para todos los demás encabezados, los valores se unen con `, `.


### `message.headersDistinct` {#messageheadersdistinct}

**Agregado en: v18.3.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Similar a [`message.headers`](/es/nodejs/api/http#messageheaders), pero no hay lógica de unión y los valores son siempre arreglos de cadenas, incluso para los encabezados recibidos solo una vez.

```js [ESM]
// Imprime algo como:
//
// { 'user-agent': ['curl/7.22.0'],
//   host: ['127.0.0.1:8000'],
//   accept: ['*/*'] }
console.log(request.headersDistinct);
```
### `message.httpVersion` {#messagehttpversion}

**Agregado en: v0.1.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

En el caso de una solicitud de servidor, la versión HTTP enviada por el cliente. En el caso de una respuesta del cliente, la versión HTTP del servidor al que se conectó. Probablemente `'1.1'` o `'1.0'`.

Además, `message.httpVersionMajor` es el primer entero y `message.httpVersionMinor` es el segundo.

### `message.method` {#messagemethod}

**Agregado en: v0.1.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**Solo válido para la solicitud obtenida de <a href="#class-httpserver"><code>http.Server</code></a>.**

El método de solicitud como una cadena. Solo lectura. Ejemplos: `'GET'`, `'DELETE'`.

### `message.rawHeaders` {#messagerawheaders}

**Agregado en: v0.11.6**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La lista de encabezados sin procesar de la solicitud/respuesta exactamente como se recibieron.

Las claves y los valores están en la misma lista. No es una lista de tuplas. Por lo tanto, los desplazamientos con números pares son valores clave y los desplazamientos con números impares son los valores asociados.

Los nombres de los encabezados no están en minúsculas y los duplicados no se fusionan.

```js [ESM]
// Imprime algo como:
//
// [ 'user-agent',
//   'this is invalid because there can be only one',
//   'User-Agent',
//   'curl/7.22.0',
//   'Host',
//   '127.0.0.1:8000',
//   'ACCEPT',
//   '*/*' ]
console.log(request.rawHeaders);
```
### `message.rawTrailers` {#messagerawtrailers}

**Agregado en: v0.11.6**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Las claves y los valores del tráiler sin procesar de la solicitud/respuesta exactamente como se recibieron. Solo se completa en el evento `'end'`.


### `message.setTimeout(msecs[, callback])` {#messagesettimeoutmsecs-callback}

**Agregado en: v0.5.9**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<http.IncomingMessage\>](/es/nodejs/api/http#class-httpincomingmessage)

Llama a `message.socket.setTimeout(msecs, callback)`.

### `message.socket` {#messagesocket}

**Agregado en: v0.3.0**

- [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)

El objeto [`net.Socket`](/es/nodejs/api/net#class-netsocket) asociado con la conexión.

Con soporte HTTPS, use [`request.socket.getPeerCertificate()`](/es/nodejs/api/tls#tlssocketgetpeercertificatedetailed) para obtener los detalles de autenticación del cliente.

Se garantiza que esta propiedad es una instancia de la clase [\<net.Socket\>](/es/nodejs/api/net#class-netsocket), una subclase de [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex), a menos que el usuario haya especificado un tipo de socket diferente a [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) o se haya anulado internamente.

### `message.statusCode` {#messagestatuscode}

**Agregado en: v0.1.1**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

**Solo válido para la respuesta obtenida de <a href="#class-httpclientrequest"><code>http.ClientRequest</code></a>.**

El código de estado de la respuesta HTTP de 3 dígitos. P. ej. `404`.

### `message.statusMessage` {#messagestatusmessage}

**Agregado en: v0.11.10**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**Solo válido para la respuesta obtenida de <a href="#class-httpclientrequest"><code>http.ClientRequest</code></a>.**

El mensaje de estado de la respuesta HTTP (frase de motivo). P. ej. `OK` o `Internal Server Error`.

### `message.trailers` {#messagetrailers}

**Agregado en: v0.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

El objeto de los tráileres de la solicitud/respuesta. Solo se completa en el evento `'end'`.

### `message.trailersDistinct` {#messagetrailersdistinct}

**Agregado en: v18.3.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Similar a [`message.trailers`](/es/nodejs/api/http#messagetrailers), pero no hay lógica de unión y los valores son siempre arreglos de cadenas, incluso para las cabeceras recibidas solo una vez. Solo se completa en el evento `'end'`.


### `message.url` {#messageurl}

**Agregado en: v0.1.90**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**Solo válido para solicitudes obtenidas de <a href="#class-httpserver"><code>http.Server</code></a>.**

Cadena de URL de la solicitud. Esta contiene solo la URL que está presente en la solicitud HTTP real. Considere la siguiente solicitud:

GET /status?name=ryan HTTP/1.1
Accept: text/plain
```
Para analizar la URL en sus partes:

```js [ESM]
new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`);
```
Cuando `request.url` es `'/status?name=ryan'` y `process.env.HOST` no está definido:

```bash [BASH]
$ node
> new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`);
URL {
  href: 'http://localhost/status?name=ryan',
  origin: 'http://localhost',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'localhost',
  hostname: 'localhost',
  port: '',
  pathname: '/status',
  search: '?name=ryan',
  searchParams: URLSearchParams { 'name' => 'ryan' },
  hash: ''
}
```
Asegúrese de establecer `process.env.HOST` al nombre de host del servidor o considere reemplazar esta parte por completo. Si utiliza `req.headers.host`, asegúrese de que se utilice la validación adecuada, ya que los clientes pueden especificar un encabezado `Host` personalizado.

## Clase: `http.OutgoingMessage` {#class-httpoutgoingmessage}

**Agregado en: v0.1.17**

- Extiende: [\<Stream\>](/es/nodejs/api/stream#stream)

Esta clase sirve como la clase padre de [`http.ClientRequest`](/es/nodejs/api/http#class-httpclientrequest) y [`http.ServerResponse`](/es/nodejs/api/http#class-httpserverresponse). Es un mensaje abstracto saliente desde la perspectiva de los participantes de una transacción HTTP.

### Evento: `'drain'` {#event-drain}

**Agregado en: v0.3.6**

Emitido cuando el búfer del mensaje vuelve a estar libre.

### Evento: `'finish'` {#event-finish_2}

**Agregado en: v0.1.17**

Emitido cuando la transmisión se completa con éxito.

### Evento: `'prefinish'` {#event-prefinish}

**Agregado en: v0.11.6**

Emitido después de que se llama a `outgoingMessage.end()`. Cuando se emite el evento, todos los datos han sido procesados, pero no necesariamente completamente vaciados.


### `outgoingMessage.addTrailers(headers)` {#outgoingmessageaddtrailersheaders}

**Agregado en: v0.3.0**

- `headers` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Agrega tráilers HTTP (cabeceras pero al final del mensaje) al mensaje.

Los tráilers **solo** se emitirán si el mensaje está codificado por fragmentos. Si no, los tráilers se descartarán silenciosamente.

HTTP requiere que se envíe la cabecera `Trailer` para emitir tráilers, con una lista de nombres de campos de cabecera en su valor, por ejemplo:

```js [ESM]
message.writeHead(200, { 'Content-Type': 'text/plain',
                         'Trailer': 'Content-MD5' });
message.write(fileData);
message.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
message.end();
```
Intentar establecer un nombre o valor de campo de cabecera que contenga caracteres no válidos provocará que se lance un `TypeError`.

### `outgoingMessage.appendHeader(name, value)` {#outgoingmessageappendheadername-value}

**Agregado en: v18.3.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre de la cabecera
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Valor de la cabecera
- Devuelve: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Añade un único valor de cabecera al objeto de cabecera.

Si el valor es un array, esto es equivalente a llamar a este método varias veces.

Si no había valores anteriores para la cabecera, esto es equivalente a llamar a [`outgoingMessage.setHeader(name, value)`](/es/nodejs/api/http#outgoingmessagesetheadername-value).

Dependiendo del valor de `options.uniqueHeaders` cuando se creó la petición del cliente o el servidor, esto terminará en que la cabecera se envíe varias veces o una sola vez con los valores unidos usando `; `.

### `outgoingMessage.connection` {#outgoingmessageconnection}

**Agregado en: v0.3.0**

**Obsoleto desde: v15.12.0, v14.17.1**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Use [`outgoingMessage.socket`](/es/nodejs/api/http#outgoingmessagesocket) en su lugar.
:::

Alias de [`outgoingMessage.socket`](/es/nodejs/api/http#outgoingmessagesocket).


### `outgoingMessage.cork()` {#outgoingmessagecork}

**Agregado en: v13.2.0, v12.16.0**

Ver [`writable.cork()`](/es/nodejs/api/stream#writablecork).

### `outgoingMessage.destroy([error])` {#outgoingmessagedestroyerror}

**Agregado en: v0.3.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Opcional, un error para emitir con el evento `error`
- Devuelve: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Destruye el mensaje. Una vez que un socket está asociado con el mensaje y está conectado, ese socket también será destruido.

### `outgoingMessage.end(chunk[, encoding][, callback])` {#outgoingmessageendchunk-encoding-callback}


::: info [Historial]
| Versión | Cambios |
|---|---|
| v15.0.0 | El parámetro `chunk` ahora puede ser un `Uint8Array`. |
| v0.11.6 | agrega el argumento `callback`. |
| v0.1.90 | Agregado en: v0.1.90 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Opcional, **Predeterminado**: `utf8`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Opcional
- Devuelve: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Finaliza el mensaje saliente. Si alguna parte del cuerpo no se ha enviado, la enviará al sistema subyacente. Si el mensaje está fragmentado, enviará el fragmento de terminación `0\r\n\r\n` y enviará los trailers (si los hay).

Si se especifica `chunk`, es equivalente a llamar a `outgoingMessage.write(chunk, encoding)`, seguido de `outgoingMessage.end(callback)`.

Si se proporciona `callback`, se llamará cuando el mensaje haya terminado (equivalente a un listener del evento `'finish'`).

### `outgoingMessage.flushHeaders()` {#outgoingmessageflushheaders}

**Agregado en: v1.6.0**

Descarga los encabezados del mensaje.

Por razones de eficiencia, Node.js normalmente almacena en búfer los encabezados del mensaje hasta que se llama a `outgoingMessage.end()` o se escribe el primer fragmento de datos del mensaje. Luego intenta empaquetar los encabezados y los datos en un solo paquete TCP.

Por lo general, es deseable (ahorra un viaje de ida y vuelta TCP), pero no cuando los primeros datos no se envían hasta mucho más tarde. `outgoingMessage.flushHeaders()` omite la optimización e inicia el mensaje.


### `outgoingMessage.getHeader(name)` {#outgoingmessagegetheadername}

**Agregado en: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre del encabezado
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Obtiene el valor del encabezado HTTP con el nombre dado. Si ese encabezado no está establecido, el valor devuelto será `undefined`.

### `outgoingMessage.getHeaderNames()` {#outgoingmessagegetheadernames}

**Agregado en: v7.7.0**

- Devuelve: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve un arreglo que contiene los nombres únicos de los encabezados salientes actuales. Todos los nombres están en minúsculas.

### `outgoingMessage.getHeaders()` {#outgoingmessagegetheaders}

**Agregado en: v7.7.0**

- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Devuelve una copia superficial de los encabezados salientes actuales. Debido a que se utiliza una copia superficial, los valores del arreglo se pueden modificar sin llamadas adicionales a varios métodos del módulo HTTP relacionados con los encabezados. Las claves del objeto devuelto son los nombres de los encabezados y los valores son los valores de los encabezados respectivos. Todos los nombres de los encabezados están en minúsculas.

El objeto devuelto por el método `outgoingMessage.getHeaders()` no hereda prototípicamente de JavaScript `Object`. Esto significa que los métodos típicos de `Object` como `obj.toString()`, `obj.hasOwnProperty()` y otros no están definidos y no funcionarán.

```js [ESM]
outgoingMessage.setHeader('Foo', 'bar');
outgoingMessage.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = outgoingMessage.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
### `outgoingMessage.hasHeader(name)` {#outgoingmessagehasheadername}

**Agregado en: v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el encabezado identificado por `name` está actualmente establecido en los encabezados salientes. El nombre del encabezado no distingue entre mayúsculas y minúsculas.

```js [ESM]
const hasContentType = outgoingMessage.hasHeader('content-type');
```

### `outgoingMessage.headersSent` {#outgoingmessageheaderssent}

**Agregado en: v0.9.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

De solo lectura. `true` si las cabeceras fueron enviadas, de lo contrario `false`.

### `outgoingMessage.pipe()` {#outgoingmessagepipe}

**Agregado en: v9.0.0**

Sobrescribe el método `stream.pipe()` heredado de la clase `Stream` heredada que es la clase padre de `http.OutgoingMessage`.

Llamar a este método lanzará un `Error` porque `outgoingMessage` es un flujo de solo escritura.

### `outgoingMessage.removeHeader(name)` {#outgoingmessageremoveheadername}

**Agregado en: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre de la cabecera

Elimina una cabecera que está en cola para ser enviada implícitamente.

```js [ESM]
outgoingMessage.removeHeader('Content-Encoding');
```
### `outgoingMessage.setHeader(name, value)` {#outgoingmessagesetheadername-value}

**Agregado en: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre de la cabecera
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Valor de la cabecera
- Devuelve: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Establece un único valor de cabecera. Si la cabecera ya existe en las cabeceras que se van a enviar, su valor será reemplazado. Utilice un array de strings para enviar múltiples cabeceras con el mismo nombre.

### `outgoingMessage.setHeaders(headers)` {#outgoingmessagesetheadersheaders}

**Agregado en: v19.6.0, v18.15.0**

- `headers` [\<Headers\>](https://developer.mozilla.org/en-US/docs/Web/API/Headers) | [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- Devuelve: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Establece múltiples valores de cabecera para cabeceras implícitas. `headers` debe ser una instancia de [`Headers`](/es/nodejs/api/globals#class-headers) o `Map`, si una cabecera ya existe en las cabeceras que se van a enviar, su valor será reemplazado.

```js [ESM]
const headers = new Headers({ foo: 'bar' });
outgoingMessage.setHeaders(headers);
```
o

```js [ESM]
const headers = new Map([['foo', 'bar']]);
outgoingMessage.setHeaders(headers);
```
Cuando las cabeceras han sido establecidas con [`outgoingMessage.setHeaders()`](/es/nodejs/api/http#outgoingmessagesetheadersheaders), serán fusionadas con cualquier cabecera pasada a [`response.writeHead()`](/es/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers), con las cabeceras pasadas a [`response.writeHead()`](/es/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) teniendo prioridad.

```js [ESM]
// Devuelve content-type = text/plain
const server = http.createServer((req, res) => {
  const headers = new Headers({ 'Content-Type': 'text/html' });
  res.setHeaders(headers);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```

### `outgoingMessage.setTimeout(msesc[, callback])` {#outgoingmessagesettimeoutmsesc-callback}

**Agregado en: v0.9.12**

- `msesc` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Función opcional que se llamará cuando ocurra un tiempo de espera. Lo mismo que vincularse al evento `timeout`.
- Devuelve: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Una vez que un socket está asociado con el mensaje y está conectado, se llamará a [`socket.setTimeout()`](/es/nodejs/api/net#socketsettimeouttimeout-callback) con `msecs` como primer parámetro.

### `outgoingMessage.socket` {#outgoingmessagesocket}

**Agregado en: v0.3.0**

- [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)

Referencia al socket subyacente. Por lo general, los usuarios no querrán acceder a esta propiedad.

Después de llamar a `outgoingMessage.end()`, esta propiedad se establecerá en nulo.

### `outgoingMessage.uncork()` {#outgoingmessageuncork}

**Agregado en: v13.2.0, v12.16.0**

Ver [`writable.uncork()`](/es/nodejs/api/stream#writableuncork)

### `outgoingMessage.writableCorked` {#outgoingmessagewritablecorked}

**Agregado en: v13.2.0, v12.16.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El número de veces que se ha llamado a `outgoingMessage.cork()`.

### `outgoingMessage.writableEnded` {#outgoingmessagewritableended}

**Agregado en: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Es `true` si se ha llamado a `outgoingMessage.end()`. Esta propiedad no indica si los datos se han vaciado. Para ese propósito, use `message.writableFinished` en su lugar.

### `outgoingMessage.writableFinished` {#outgoingmessagewritablefinished}

**Agregado en: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Es `true` si todos los datos se han vaciado al sistema subyacente.

### `outgoingMessage.writableHighWaterMark` {#outgoingmessagewritablehighwatermark}

**Agregado en: v12.9.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El `highWaterMark` del socket subyacente si está asignado. De lo contrario, el nivel de búfer predeterminado cuando [`writable.write()`](/es/nodejs/api/stream#writablewritechunk-encoding-callback) comienza a devolver falso (`16384`).


### `outgoingMessage.writableLength` {#outgoingmessagewritablelength}

**Añadido en: v12.9.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El número de bytes almacenados en búfer.

### `outgoingMessage.writableObjectMode` {#outgoingmessagewritableobjectmode}

**Añadido en: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Siempre `false`.

### `outgoingMessage.write(chunk[, encoding][, callback])` {#outgoingmessagewritechunk-encoding-callback}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | El parámetro `chunk` ahora puede ser un `Uint8Array`. |
| v0.11.6 | Se añadió el argumento `callback`. |
| v0.1.29 | Añadido en: v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado**: `utf8`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Envía un fragmento del cuerpo. Este método puede ser llamado varias veces.

El argumento `encoding` solo es relevante cuando `chunk` es una cadena. El valor predeterminado es `'utf8'`.

El argumento `callback` es opcional y se llamará cuando se vacíe este fragmento de datos.

Devuelve `true` si todos los datos se vaciaron correctamente en el búfer del kernel. Devuelve `false` si todos o parte de los datos se pusieron en cola en la memoria del usuario. El evento `'drain'` se emitirá cuando el búfer esté libre de nuevo.

## `http.METHODS` {#httpmethods}

**Añadido en: v0.11.8**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Una lista de los métodos HTTP que son soportados por el analizador.

## `http.STATUS_CODES` {#httpstatus_codes}

**Añadido en: v0.1.22**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Una colección de todos los códigos de estado de respuesta HTTP estándar y la breve descripción de cada uno. Por ejemplo, `http.STATUS_CODES[404] === 'Not Found'`.


## `http.createServer([options][, requestListener])` {#httpcreateserveroptions-requestlistener}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.1.0, v18.17.0 | Ahora se soporta la opción `highWaterMark`. |
| v18.0.0 | Ahora se soportan las opciones `requestTimeout`, `headersTimeout`, `keepAliveTimeout` y `connectionsCheckingInterval`. |
| v18.0.0 | La opción `noDelay` ahora tiene el valor predeterminado `true`. |
| v17.7.0, v16.15.0 | Ahora se soportan las opciones `noDelay`, `keepAlive` y `keepAliveInitialDelay`. |
| v13.3.0 | Ahora se soporta la opción `maxHeaderSize`. |
| v13.8.0, v12.15.0, v10.19.0 | Ahora se soporta la opción `insecureHTTPParser`. |
| v9.6.0, v8.12.0 | Ahora se soporta el argumento `options`. |
| v0.1.13 | Añadido en: v0.1.13 |
:::

-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `connectionsCheckingInterval`: Establece el valor del intervalo en milisegundos para verificar el tiempo de espera de la solicitud y los encabezados en solicitudes incompletas. **Predeterminado:** `30000`.
    - `headersTimeout`: Establece el valor de tiempo de espera en milisegundos para recibir los encabezados HTTP completos del cliente. Consulta [`server.headersTimeout`](/es/nodejs/api/http#serverheaderstimeout) para obtener más información. **Predeterminado:** `60000`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Opcionalmente, anula todos los `readableHighWaterMark` y `writableHighWaterMark` de los `socket`s. Esto afecta la propiedad `highWaterMark` tanto de `IncomingMessage` como de `ServerResponse`. **Predeterminado:** Consulta [`stream.getDefaultHighWaterMark()`](/es/nodejs/api/stream#streamgetdefaulthighwatermarkobjectmode).
    - `insecureHTTPParser` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en `true`, utilizará un analizador HTTP con indicadores de indulgencia habilitados. Se debe evitar el uso del analizador inseguro. Consulta [`--insecure-http-parser`](/es/nodejs/api/cli#--insecure-http-parser) para obtener más información. **Predeterminado:** `false`.
    - `IncomingMessage` [\<http.IncomingMessage\>](/es/nodejs/api/http#class-httpincomingmessage) Especifica la clase `IncomingMessage` que se utilizará. Útil para extender el `IncomingMessage` original. **Predeterminado:** `IncomingMessage`.
    - `joinDuplicateHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en `true`, esta opción permite unir los valores de la línea de campo de varios encabezados en una solicitud con una coma (`, `) en lugar de descartar los duplicados. Para obtener más información, consulta [`message.headers`](/es/nodejs/api/http#messageheaders). **Predeterminado:** `false`.
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en `true`, habilita la funcionalidad keep-alive en el socket inmediatamente después de que se recibe una nueva conexión entrante, de forma similar a lo que se hace en [`socket.setKeepAlive([enable][, initialDelay])`][`socket.setKeepAlive(enable, initialDelay)`]. **Predeterminado:** `false`.
    - `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si se establece en un número positivo, establece el retraso inicial antes de que se envíe la primera sonda keepalive en un socket inactivo. **Predeterminado:** `0`.
    - `keepAliveTimeout`: El número de milisegundos de inactividad que un servidor necesita esperar para obtener datos entrantes adicionales, después de que haya terminado de escribir la última respuesta, antes de que se destruya un socket. Consulta [`server.keepAliveTimeout`](/es/nodejs/api/http#serverkeepalivetimeout) para obtener más información. **Predeterminado:** `5000`.
    - `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Opcionalmente, anula el valor de [`--max-http-header-size`](/es/nodejs/api/cli#--max-http-header-sizesize) para las solicitudes recibidas por este servidor, es decir, la longitud máxima de los encabezados de solicitud en bytes. **Predeterminado:** 16384 (16 KiB).
    - `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en `true`, desactiva el uso del algoritmo de Nagle inmediatamente después de que se recibe una nueva conexión entrante. **Predeterminado:** `true`.
    - `requestTimeout`: Establece el valor de tiempo de espera en milisegundos para recibir la solicitud completa del cliente. Consulta [`server.requestTimeout`](/es/nodejs/api/http#serverrequesttimeout) para obtener más información. **Predeterminado:** `300000`.
    - `requireHostHeader` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en `true`, obliga al servidor a responder con un código de estado 400 (Solicitud incorrecta) a cualquier mensaje de solicitud HTTP/1.1 que carezca de un encabezado Host (como lo exige la especificación). **Predeterminado:** `true`.
    - `ServerResponse` [\<http.ServerResponse\>](/es/nodejs/api/http#class-httpserverresponse) Especifica la clase `ServerResponse` que se utilizará. Útil para extender el `ServerResponse` original. **Predeterminado:** `ServerResponse`.
    - `uniqueHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Una lista de encabezados de respuesta que deben enviarse solo una vez. Si el valor del encabezado es una matriz, los elementos se unirán usando `; `.
    - `rejectNonStandardBodyWrites` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en `true`, se produce un error al escribir en una respuesta HTTP que no tiene un cuerpo. **Predeterminado:** `false`.
  
 
-  `requestListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
-  Devuelve: [\<http.Server\>](/es/nodejs/api/http#class-httpserver) 

Devuelve una nueva instancia de [`http.Server`](/es/nodejs/api/http#class-httpserver).

`requestListener` es una función que se agrega automáticamente al evento [`'request'`](/es/nodejs/api/http#event-request).



::: code-group
```js [ESM]
import http from 'node:http';

// Create a local server to receive data from
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

```js [CJS]
const http = require('node:http');

// Create a local server to receive data from
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```
:::



::: code-group
```js [ESM]
import http from 'node:http';

// Create a local server to receive data from
const server = http.createServer();

// Listen to the request event
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

```js [CJS]
const http = require('node:http');

// Create a local server to receive data from
const server = http.createServer();

// Listen to the request event
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```
:::


## `http.get(options[, callback])` {#httpgetoptions-callback}

## `http.get(url[, options][, callback])` {#httpgeturl-options-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.9.0 | El parámetro `url` ahora se puede pasar junto con un objeto `options` separado. |
| v7.5.0 | El parámetro `options` puede ser un objeto `URL` de WHATWG. |
| v0.3.6 | Agregado en: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Acepta las mismas `options` que [`http.request()`](/es/nodejs/api/http#httprequestoptions-callback), con el método establecido en GET por defecto.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<http.ClientRequest\>](/es/nodejs/api/http#class-httpclientrequest)

Dado que la mayoría de las solicitudes son solicitudes GET sin cuerpos, Node.js proporciona este método de conveniencia. La única diferencia entre este método y [`http.request()`](/es/nodejs/api/http#httprequestoptions-callback) es que establece el método en GET por defecto y llama a `req.end()` automáticamente. La función de retrollamada debe encargarse de consumir los datos de respuesta por las razones indicadas en la sección [`http.ClientRequest`](/es/nodejs/api/http#class-httpclientrequest).

Se invoca la `callback` con un único argumento que es una instancia de [`http.IncomingMessage`](/es/nodejs/api/http#class-httpincomingmessage).

Ejemplo de obtención de JSON:

```js [ESM]
http.get('http://localhost:8000/', (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  // Cualquier código de estado 2xx indica una respuesta exitosa, pero
  // aquí solo estamos comprobando el 200.
  if (statusCode !== 200) {
    error = new Error('Solicitud fallida.\n' +
                      `Código de estado: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Tipo de contenido no válido.\n' +
                      `Se esperaba application/json pero se recibió ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // Consume datos de respuesta para liberar memoria
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Se produjo un error: ${e.message}`);
});

// Crear un servidor local para recibir datos de
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: '¡Hola Mundo!',
  }));
});

server.listen(8000);
```

## `http.globalAgent` {#httpglobalagent}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | El agente ahora usa HTTP Keep-Alive y un timeout de 5 segundos por defecto. |
| v0.5.9 | Añadido en: v0.5.9 |
:::

- [\<http.Agent\>](/es/nodejs/api/http#class-httpagent)

Instancia global de `Agent` que se utiliza como valor predeterminado para todas las solicitudes de cliente HTTP. Difiere de una configuración de `Agent` predeterminada al tener `keepAlive` habilitado y un `timeout` de 5 segundos.

## `http.maxHeaderSize` {#httpmaxheadersize}

**Añadido en: v11.6.0, v10.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Propiedad de sólo lectura que especifica el tamaño máximo permitido de las cabeceras HTTP en bytes. El valor predeterminado es 16 KiB. Configurable usando la opción CLI [`--max-http-header-size`](/es/nodejs/api/cli#--max-http-header-sizesize).

Esto se puede anular para los servidores y las solicitudes del cliente pasando la opción `maxHeaderSize`.

## `http.request(options[, callback])` {#httprequestoptions-callback}

## `http.request(url[, options][, callback])` {#httprequesturl-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.7.0, v14.18.0 | Al utilizar un objeto `URL`, el nombre de usuario y la contraseña analizados ahora se decodificarán correctamente en URI. |
| v15.3.0, v14.17.0 | Es posible abortar una solicitud con una AbortSignal. |
| v13.3.0 | La opción `maxHeaderSize` ahora es compatible. |
| v13.8.0, v12.15.0, v10.19.0 | La opción `insecureHTTPParser` ahora es compatible. |
| v10.9.0 | El parámetro `url` ahora se puede pasar junto con un objeto `options` separado. |
| v7.5.0 | El parámetro `options` puede ser un objeto WHATWG `URL`. |
| v0.3.6 | Añadido en: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `agent` [\<http.Agent\>](/es/nodejs/api/http#class-httpagent) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Controla el comportamiento de [`Agent`](/es/nodejs/api/http#class-httpagent). Valores posibles:
    - `undefined` (predeterminado): usa [`http.globalAgent`](/es/nodejs/api/http#httpglobalagent) para este host y puerto.
    - Objeto `Agent`: usa explícitamente el `Agent` pasado.
    - `false`: hace que se use un nuevo `Agent` con los valores predeterminados.

    - `auth` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Autenticación básica (`'usuario:contraseña'`) para calcular una cabecera de Autorización.
    - `createConnection` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función que produce un socket/stream para usar en la solicitud cuando no se usa la opción `agent`. Esto se puede usar para evitar la creación de una clase `Agent` personalizada sólo para anular la función `createConnection` predeterminada. Consulte [`agent.createConnection()`](/es/nodejs/api/http#agentcreateconnectionoptions-callback) para obtener más detalles. Cualquier stream [`Duplex`](/es/nodejs/api/stream#class-streamduplex) es un valor de retorno válido.
    - `defaultPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Puerto predeterminado para el protocolo. **Predeterminado:** `agent.defaultPort` si se usa un `Agent`, de lo contrario `undefined`.
    - `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Familia de direcciones IP a usar al resolver `host` o `hostname`. Los valores válidos son `4` o `6`. Cuando no se especifica, se usarán tanto IP v4 como v6.
    - `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objeto que contiene las cabeceras de la solicitud.
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`dns.lookup()` sugerencias](/es/nodejs/api/dns#supported-getaddrinfo-flags) opcionales.
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un nombre de dominio o dirección IP del servidor al que se emitirá la solicitud. **Predeterminado:** `'localhost'`.
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Alias para `host`. Para admitir [`url.parse()`](/es/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost), se usará `hostname` si se especifican tanto `host` como `hostname`.
    - `insecureHTTPParser` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en `true`, usará un analizador HTTP con las flags de indulgencia habilitadas. Se debe evitar el uso del analizador inseguro. Consulte [`--insecure-http-parser`](/es/nodejs/api/cli#--insecure-http-parser) para obtener más información. **Predeterminado:** `false`
    - `joinDuplicateHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Une los valores de la línea de campo de varias cabeceras en una solicitud con `, ` en lugar de descartar los duplicados. Consulte [`message.headers`](/es/nodejs/api/http#messageheaders) para obtener más información. **Predeterminado:** `false`.
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Interfaz local para enlazar para conexiones de red.
    - `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Puerto local desde el que conectarse.
    - `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Función de búsqueda personalizada. **Predeterminado:** [`dns.lookup()`](/es/nodejs/api/dns#dnslookuphostname-options-callback).
    - `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anula opcionalmente el valor de [`--max-http-header-size`](/es/nodejs/api/cli#--max-http-header-sizesize) (la longitud máxima de las cabeceras de respuesta en bytes) para las respuestas recibidas del servidor. **Predeterminado:** 16384 (16 KiB).
    - `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una cadena que especifica el método de solicitud HTTP. **Predeterminado:** `'GET'`.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ruta de la solicitud. Debe incluir la cadena de consulta si la hay. P. ej. `'/index.html?page=12'`. Se lanza una excepción cuando la ruta de la solicitud contiene caracteres ilegales. Actualmente, sólo se rechazan los espacios, pero eso puede cambiar en el futuro. **Predeterminado:** `'/'`.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Puerto del servidor remoto. **Predeterminado:** `defaultPort` si está establecido, de lo contrario `80`.
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Protocolo a usar. **Predeterminado:** `'http:'`.
    - `setDefaultHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): Especifica si se deben agregar o no automáticamente las cabeceras predeterminadas como `Connection`, `Content-Length`, `Transfer-Encoding` y `Host`. Si se establece en `false`, entonces todas las cabeceras necesarias deben agregarse manualmente. El valor predeterminado es `true`.
    - `setHost` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): Especifica si se debe agregar o no automáticamente la cabecera `Host`. Si se proporciona, esto anula `setDefaultHeaders`. El valor predeterminado es `true`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal): Una AbortSignal que se puede usar para abortar una solicitud en curso.
    - `socketPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Socket de dominio Unix. No se puede usar si se especifica uno de `host` o `port`, ya que esos especifican un Socket TCP.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): Un número que especifica el timeout del socket en milisegundos. Esto establecerá el timeout antes de que el socket esté conectado.
    - `uniqueHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Una lista de cabeceras de solicitud que deben enviarse sólo una vez. Si el valor de la cabecera es un array, los elementos se unirán usando `; `.

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<http.ClientRequest\>](/es/nodejs/api/http#class-httpclientrequest)

También se admiten `options` en [`socket.connect()`](/es/nodejs/api/net#socketconnectoptions-connectlistener).

Node.js mantiene varias conexiones por servidor para realizar solicitudes HTTP. Esta función permite emitir solicitudes de forma transparente.

`url` puede ser una cadena o un objeto [`URL`](/es/nodejs/api/url#the-whatwg-url-api). Si `url` es una cadena, se analiza automáticamente con [`new URL()`](/es/nodejs/api/url#new-urlinput-base). Si es un objeto [`URL`](/es/nodejs/api/url#the-whatwg-url-api), se convertirá automáticamente en un objeto `options` ordinario.

Si se especifican tanto `url` como `options`, los objetos se fusionan, con las propiedades `options` teniendo prioridad.

El parámetro `callback` opcional se agregará como un listener único para el evento [`'response'`](/es/nodejs/api/http#event-response).

`http.request()` devuelve una instancia de la clase [`http.ClientRequest`](/es/nodejs/api/http#class-httpclientrequest). La instancia `ClientRequest` es un stream grabable. Si uno necesita subir un archivo con una solicitud POST, entonces escriba en el objeto `ClientRequest`.

::: code-group
```js [ESM]
import http from 'node:http';
import { Buffer } from 'node:buffer';

const postData = JSON.stringify({
  'msg': 'Hello World!',
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
```

```js [CJS]
const http = require('node:http');

const postData = JSON.stringify({
  'msg': 'Hello World!',
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
```
:::

En el ejemplo se llamó a `req.end()`. Con `http.request()` siempre se debe llamar a `req.end()` para indicar el final de la solicitud, incluso si no se están escribiendo datos en el cuerpo de la solicitud.

Si se encuentra algún error durante la solicitud (ya sea con la resolución DNS, errores de nivel TCP o errores de análisis HTTP reales) se emite un evento `'error'` en el objeto de solicitud devuelto. Como con todos los eventos `'error'`, si no se registran listeners, el error se lanzará.

Hay algunas cabeceras especiales que deben tenerse en cuenta.

- Enviar un 'Connection: keep-alive' notificará a Node.js que la conexión con el servidor debe persistir hasta la siguiente solicitud.
- Enviar una cabecera 'Content-Length' desactivará la codificación fragmentada predeterminada.
- Enviar una cabecera 'Expect' enviará inmediatamente las cabeceras de la solicitud. Por lo general, al enviar 'Expect: 100-continue', se deben establecer tanto un timeout como un listener para el evento `'continue'`. Consulte RFC 2616 Sección 8.2.3 para obtener más información.
- Enviar una cabecera de Autorización anulará el uso de la opción `auth` para calcular la autenticación básica.

Ejemplo usando una [`URL`](/es/nodejs/api/url#the-whatwg-url-api) como `options`:

```js [ESM]
const options = new URL('http://abc:');

const req = http.request(options, (res) => {
  // ...
});
```
En una solicitud exitosa, los siguientes eventos se emitirán en el siguiente orden:

- `'socket'`
- `'response'`
    - `'data'` cualquier número de veces, en el objeto `res` (`'data'` no se emitirá en absoluto si el cuerpo de la respuesta está vacío, por ejemplo, en la mayoría de las redirecciones)
    - `'end'` en el objeto `res`

- `'close'`

En el caso de un error de conexión, se emitirán los siguientes eventos:

- `'socket'`
- `'error'`
- `'close'`

En el caso de un cierre de conexión prematuro antes de que se reciba la respuesta, se emitirán los siguientes eventos en el siguiente orden:

- `'socket'`
- `'error'` con un error con el mensaje `'Error: socket hang up'` y el código `'ECONNRESET'`
- `'close'`

En el caso de un cierre de conexión prematuro después de que se reciba la respuesta, se emitirán los siguientes eventos en el siguiente orden:

- `'socket'`
- `'response'`
    - `'data'` cualquier número de veces, en el objeto `res`

- (conexión cerrada aquí)
- `'aborted'` en el objeto `res`
- `'close'`
- `'error'` en el objeto `res` con un error con el mensaje `'Error: aborted'` y el código `'ECONNRESET'`
- `'close'` en el objeto `res`

Si se llama a `req.destroy()` antes de que se asigne un socket, se emitirán los siguientes eventos en el siguiente orden:

- (se llama a `req.destroy()` aquí)
- `'error'` con un error con el mensaje `'Error: socket hang up'` y el código `'ECONNRESET'`, o el error con el que se llamó a `req.destroy()`
- `'close'`

Si se llama a `req.destroy()` antes de que la conexión tenga éxito, se emitirán los siguientes eventos en el siguiente orden:

- `'socket'`
- (se llama a `req.destroy()` aquí)
- `'error'` con un error con el mensaje `'Error: socket hang up'` y el código `'ECONNRESET'`, o el error con el que se llamó a `req.destroy()`
- `'close'`

Si se llama a `req.destroy()` después de que se reciba la respuesta, se emitirán los siguientes eventos en el siguiente orden:

- `'socket'`
- `'response'`
    - `'data'` cualquier número de veces, en el objeto `res`

- (se llama a `req.destroy()` aquí)
- `'aborted'` en el objeto `res`
- `'close'`
- `'error'` en el objeto `res` con un error con el mensaje `'Error: aborted'` y el código `'ECONNRESET'`, o el error con el que se llamó a `req.destroy()`
- `'close'` en el objeto `res`

Si se llama a `req.abort()` antes de que se asigne un socket, se emitirán los siguientes eventos en el siguiente orden:

- (se llama a `req.abort()` aquí)
- `'abort'`
- `'close'`

Si se llama a `req.abort()` antes de que la conexión tenga éxito, se emitirán los siguientes eventos en el siguiente orden:

- `'socket'`
- (se llama a `req.abort()` aquí)
- `'abort'`
- `'error'` con un error con el mensaje `'Error: socket hang up'` y el código `'ECONNRESET'`
- `'close'`

Si se llama a `req.abort()` después de que se reciba la respuesta, se emitirán los siguientes eventos en el siguiente orden:

- `'socket'`
- `'response'`
    - `'data'` cualquier número de veces, en el objeto `res`

- (se llama a `req.abort()` aquí)
- `'abort'`
- `'aborted'` en el objeto `res`
- `'error'` en el objeto `res` con un error con el mensaje `'Error: aborted'` y el código `'ECONNRESET'`.
- `'close'`
- `'close'` en el objeto `res`

Establecer la opción `timeout` o usar la función `setTimeout()` no abortará la solicitud ni hará nada más que agregar un evento `'timeout'`.

Pasar una `AbortSignal` y luego llamar a `abort()` en el `AbortController` correspondiente se comportará de la misma manera que llamar a `.destroy()` en la solicitud. Específicamente, el evento `'error'` se emitirá con un error con el mensaje `'AbortError: The operation was aborted'`, el código `'ABORT_ERR'` y la `cause`, si se proporcionó uno.


## `http.validateHeaderName(name[, label])` {#httpvalidateheadernamename-label}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.5.0, v18.14.0 | Se añade el parámetro `label`. |
| v14.3.0 | Añadido en: v14.3.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Etiqueta para el mensaje de error. **Predeterminado:** `'Nombre del encabezado'`.

Realiza las validaciones de bajo nivel en el `name` proporcionado que se realizan cuando se llama a `res.setHeader(name, value)`.

Pasar un valor ilegal como `name` dará como resultado un [`TypeError`](/es/nodejs/api/errors#class-typeerror) que se lanza, identificado por `code: 'ERR_INVALID_HTTP_TOKEN'`.

No es necesario utilizar este método antes de pasar encabezados a una solicitud o respuesta HTTP. El módulo HTTP validará automáticamente dichos encabezados.

Ejemplo:

::: code-group
```js [ESM]
import { validateHeaderName } from 'node:http';

try {
  validateHeaderName('');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code); // --> 'ERR_INVALID_HTTP_TOKEN'
  console.error(err.message); // --> 'Header name must be a valid HTTP token [""]'
}
```

```js [CJS]
const { validateHeaderName } = require('node:http');

try {
  validateHeaderName('');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code); // --> 'ERR_INVALID_HTTP_TOKEN'
  console.error(err.message); // --> 'Header name must be a valid HTTP token [""]'
}
```
:::

## `http.validateHeaderValue(name, value)` {#httpvalidateheadervaluename-value}

**Añadido en: v14.3.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Realiza las validaciones de bajo nivel en el `value` proporcionado que se realizan cuando se llama a `res.setHeader(name, value)`.

Pasar un valor ilegal como `value` dará como resultado un [`TypeError`](/es/nodejs/api/errors#class-typeerror) que se lanza.

- El error de valor indefinido se identifica con `code: 'ERR_HTTP_INVALID_HEADER_VALUE'`.
- El error de carácter de valor no válido se identifica con `code: 'ERR_INVALID_CHAR'`.

No es necesario utilizar este método antes de pasar encabezados a una solicitud o respuesta HTTP. El módulo HTTP validará automáticamente dichos encabezados.

Ejemplos:

::: code-group
```js [ESM]
import { validateHeaderValue } from 'node:http';

try {
  validateHeaderValue('x-my-header', undefined);
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_HTTP_INVALID_HEADER_VALUE'); // --> true
  console.error(err.message); // --> 'Invalid value "undefined" for header "x-my-header"'
}

try {
  validateHeaderValue('x-my-header', 'oʊmɪɡə');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_INVALID_CHAR'); // --> true
  console.error(err.message); // --> 'Invalid character in header content ["x-my-header"]'
}
```

```js [CJS]
const { validateHeaderValue } = require('node:http');

try {
  validateHeaderValue('x-my-header', undefined);
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_HTTP_INVALID_HEADER_VALUE'); // --> true
  console.error(err.message); // --> 'Invalid value "undefined" for header "x-my-header"'
}

try {
  validateHeaderValue('x-my-header', 'oʊmɪɡə');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_INVALID_CHAR'); // --> true
  console.error(err.message); // --> 'Invalid character in header content ["x-my-header"]'
}
```
:::


## `http.setMaxIdleHTTPParsers(max)` {#httpsetmaxidlehttpparsersmax}

**Agregado en: v18.8.0, v16.18.0**

- `max` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `1000`.

Establece el número máximo de analizadores HTTP inactivos.

## `WebSocket` {#websocket}

**Agregado en: v22.5.0**

Una implementación compatible con el navegador de [`WebSocket`](/es/nodejs/api/http#websocket).

