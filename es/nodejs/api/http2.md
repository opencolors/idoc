---
title: Documentación de Node.js - HTTP/2
description: Esta página ofrece documentación completa sobre el módulo HTTP/2 en Node.js, detallando su API, uso y ejemplos para implementar servidores y clientes HTTP/2.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - HTTP/2 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esta página ofrece documentación completa sobre el módulo HTTP/2 en Node.js, detallando su API, uso y ejemplos para implementar servidores y clientes HTTP/2.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - HTTP/2 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esta página ofrece documentación completa sobre el módulo HTTP/2 en Node.js, detallando su API, uso y ejemplos para implementar servidores y clientes HTTP/2.
---


# HTTP/2 {#http/2}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | Ahora se pueden enviar/recibir solicitudes con el encabezado `host` (con o sin `:authority`). |
| v15.3.0, v14.17.0 | Es posible abortar una solicitud con una AbortSignal. |
| v10.10.0 | HTTP/2 ahora es Estable. Anteriormente, había sido Experimental. |
| v8.4.0 | Añadido en: v8.4.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código fuente:** [lib/http2.js](https://github.com/nodejs/node/blob/v23.5.0/lib/http2.js)

El módulo `node:http2` proporciona una implementación del protocolo [HTTP/2](https://tools.ietf.org/html/rfc7540). Se puede acceder a él usando:

```js [ESM]
const http2 = require('node:http2');
```
## Determinando si el soporte de crypto no está disponible {#determining-if-crypto-support-is-unavailable}

Es posible que Node.js se construya sin incluir soporte para el módulo `node:crypto`. En tales casos, intentar `import` desde `node:http2` o llamar a `require('node:http2')` resultará en un error.

Cuando se usa CommonJS, el error lanzado se puede detectar usando try/catch:

```js [CJS]
let http2;
try {
  http2 = require('node:http2');
} catch (err) {
  console.error('¡el soporte de http2 está deshabilitado!');
}
```
Cuando se usa la palabra clave léxica ESM `import`, el error solo se puede detectar si se registra un controlador para `process.on('uncaughtException')` *antes* de que se intente cargar el módulo (usando, por ejemplo, un módulo de precarga).

Cuando se usa ESM, si existe la posibilidad de que el código se ejecute en una compilación de Node.js donde el soporte de crypto no está habilitado, considere usar la función [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) en lugar de la palabra clave léxica `import`:

```js [ESM]
let http2;
try {
  http2 = await import('node:http2');
} catch (err) {
  console.error('¡el soporte de http2 está deshabilitado!');
}
```
## API Central {#core-api}

La API Central proporciona una interfaz de bajo nivel diseñada específicamente en torno al soporte de las características del protocolo HTTP/2. Específicamente *no* está diseñada para la compatibilidad con la API del módulo [HTTP/1](/es/nodejs/api/http) existente. Sin embargo, la [API de Compatibilidad](/es/nodejs/api/http2#compatibility-api) sí lo está.

La API Central de `http2` es mucho más simétrica entre el cliente y el servidor que la API de `http`. Por ejemplo, la mayoría de los eventos, como `'error'`, `'connect'` y `'stream'`, pueden ser emitidos por el código del lado del cliente o por el código del lado del servidor.


### Ejemplo del lado del servidor {#server-side-example}

Lo siguiente ilustra un servidor HTTP/2 simple usando la API Core. Dado que no se conocen navegadores que soporten [HTTP/2 sin encriptar](https://http2.github.io/faq/#does-http2-require-encryption), el uso de [`http2.createSecureServer()`](/es/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) es necesario al comunicarse con clientes de navegador.

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const server = createSecureServer({
  key: readFileSync('localhost-privkey.pem'),
  cert: readFileSync('localhost-cert.pem'),
});

server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createSecureServer({
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem'),
});
server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```
:::

Para generar el certificado y la clave para este ejemplo, ejecute:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout localhost-privkey.pem -out localhost-cert.pem
```
### Ejemplo del lado del cliente {#client-side-example}

Lo siguiente ilustra un cliente HTTP/2:

::: code-group
```js [ESM]
import { connect } from 'node:http2';
import { readFileSync } from 'node:fs';

const client = connect('https://localhost:8443', {
  ca: readFileSync('localhost-cert.pem'),
});
client.on('error', (err) => console.error(err));

const req = client.request({ ':path': '/' });

req.on('response', (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }
});

req.setEncoding('utf8');
let data = '';
req.on('data', (chunk) => { data += chunk; });
req.on('end', () => {
  console.log(`\n${data}`);
  client.close();
});
req.end();
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const client = http2.connect('https://localhost:8443', {
  ca: fs.readFileSync('localhost-cert.pem'),
});
client.on('error', (err) => console.error(err));

const req = client.request({ ':path': '/' });

req.on('response', (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }
});

req.setEncoding('utf8');
let data = '';
req.on('data', (chunk) => { data += chunk; });
req.on('end', () => {
  console.log(`\n${data}`);
  client.close();
});
req.end();
```
:::


### Clase: `Http2Session` {#class-http2session}

**Agregada en: v8.4.0**

- Extiende: [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter)

Las instancias de la clase `http2.Http2Session` representan una sesión de comunicaciones activa entre un cliente y un servidor HTTP/2. Las instancias de esta clase *no* están diseñadas para ser construidas directamente por el código del usuario.

Cada instancia de `Http2Session` exhibirá comportamientos ligeramente diferentes dependiendo de si está operando como un servidor o como un cliente. La propiedad `http2session.type` puede ser utilizada para determinar el modo en el que una `Http2Session` está operando. En el lado del servidor, el código del usuario raramente tendrá la ocasión de trabajar directamente con el objeto `Http2Session`, con la mayoría de las acciones típicamente tomadas a través de interacciones con los objetos `Http2Server` o `Http2Stream`.

El código del usuario no creará instancias de `Http2Session` directamente. Las instancias de `Http2Session` del lado del servidor son creadas por la instancia de `Http2Server` cuando una nueva conexión HTTP/2 es recibida. Las instancias de `Http2Session` del lado del cliente son creadas utilizando el método `http2.connect()`.

#### `Http2Session` y sockets {#http2session-and-sockets}

Cada instancia de `Http2Session` está asociada con exactamente un [`net.Socket`](/es/nodejs/api/net#class-netsocket) o [`tls.TLSSocket`](/es/nodejs/api/tls#class-tlstlssocket) cuando es creada. Cuando tanto el `Socket` como el `Http2Session` son destruidos, ambos serán destruidos.

Debido a los requisitos específicos de serialización y procesamiento impuestos por el protocolo HTTP/2, no se recomienda que el código del usuario lea datos o escriba datos a una instancia de `Socket` vinculada a un `Http2Session`. Hacerlo puede poner la sesión HTTP/2 en un estado indeterminado causando que la sesión y el socket se vuelvan inutilizables.

Una vez que un `Socket` ha sido vinculado a un `Http2Session`, el código del usuario debe confiar únicamente en la API del `Http2Session`.

#### Evento: `'close'` {#event-close}

**Agregada en: v8.4.0**

El evento `'close'` se emite una vez que el `Http2Session` ha sido destruido. Su listener no espera ningún argumento.

#### Evento: `'connect'` {#event-connect}

**Agregada en: v8.4.0**

- `session` [\<Http2Session\>](/es/nodejs/api/http2#class-http2session)
- `socket` [\<net.Socket\>](/es/nodejs/api/net#class-netsocket)

El evento `'connect'` se emite una vez que el `Http2Session` ha sido conectado exitosamente al par remoto y la comunicación puede comenzar.

El código del usuario típicamente no escuchará este evento directamente.


#### Evento: `'error'` {#event-error}

**Añadido en: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

El evento `'error'` se emite cuando ocurre un error durante el procesamiento de una `Http2Session`.

#### Evento: `'frameError'` {#event-frameerror}

**Añadido en: v8.4.0**

- `type` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El tipo de frame.
- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El código de error.
- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El id del stream (o `0` si el frame no está asociado con un stream).

El evento `'frameError'` se emite cuando ocurre un error al intentar enviar un frame en la sesión. Si el frame que no se pudo enviar está asociado con un `Http2Stream` específico, se intenta emitir un evento `'frameError'` en el `Http2Stream`.

Si el evento `'frameError'` está asociado con un stream, el stream se cerrará y destruirá inmediatamente después del evento `'frameError'`. Si el evento no está asociado con un stream, la `Http2Session` se cerrará inmediatamente después del evento `'frameError'`.

#### Evento: `'goaway'` {#event-goaway}

**Añadido en: v8.4.0**

- `errorCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El código de error HTTP/2 especificado en el frame `GOAWAY`.
- `lastStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El ID del último stream que el peer remoto procesó con éxito (o `0` si no se especifica ningún ID).
- `opaqueData` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) Si se incluyeron datos opacos adicionales en el frame `GOAWAY`, se pasará una instancia de `Buffer` que contiene esos datos.

El evento `'goaway'` se emite cuando se recibe un frame `GOAWAY`.

La instancia de `Http2Session` se cerrará automáticamente cuando se emita el evento `'goaway'`.


#### Event: `'localSettings'` {#event-localsettings}

**Añadido en: v8.4.0**

- `settings` [\<Objeto de Configuración HTTP/2\>](/es/nodejs/api/http2#settings-object) Una copia del frame `SETTINGS` recibido.

El evento `'localSettings'` se emite cuando se ha recibido un frame `SETTINGS` de confirmación.

Cuando se utiliza `http2session.settings()` para enviar nuevas configuraciones, las configuraciones modificadas no surten efecto hasta que se emite el evento `'localSettings'`.

```js [ESM]
session.settings({ enablePush: false });

session.on('localSettings', (settings) => {
  /* Utilice las nuevas configuraciones */
});
```
#### Event: `'ping'` {#event-ping}

**Añadido en: v10.12.0**

- `payload` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) La carga útil de 8 bytes del frame `PING`.

El evento `'ping'` se emite cada vez que se recibe un frame `PING` del par conectado.

#### Event: `'remoteSettings'` {#event-remotesettings}

**Añadido en: v8.4.0**

- `settings` [\<Objeto de Configuración HTTP/2\>](/es/nodejs/api/http2#settings-object) Una copia del frame `SETTINGS` recibido.

El evento `'remoteSettings'` se emite cuando se recibe un nuevo frame `SETTINGS` del par conectado.

```js [ESM]
session.on('remoteSettings', (settings) => {
  /* Utilice las nuevas configuraciones */
});
```
#### Event: `'stream'` {#event-stream}

**Añadido en: v8.4.0**

- `stream` [\<Http2Stream\>](/es/nodejs/api/http2#class-http2stream) Una referencia al stream
- `headers` [\<Objeto de Cabeceras HTTP/2\>](/es/nodejs/api/http2#headers-object) Un objeto que describe las cabeceras
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Los flags numéricos asociados
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array que contiene los nombres de las cabeceras sin procesar seguidos de sus respectivos valores.

El evento `'stream'` se emite cuando se crea un nuevo `Http2Stream`.

```js [ESM]
session.on('stream', (stream, headers, flags) => {
  const method = headers[':method'];
  const path = headers[':path'];
  // ...
  stream.respond({
    ':status': 200,
    'content-type': 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```
En el lado del servidor, el código del usuario normalmente no escuchará este evento directamente, y en su lugar registrará un controlador para el evento `'stream'` emitido por las instancias `net.Server` o `tls.Server` devueltas por `http2.createServer()` y `http2.createSecureServer()`, respectivamente, como en el siguiente ejemplo:

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

// Create an unencrypted HTTP/2 server
const server = createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.on('error', (error) => console.error(error));
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```

```js [CJS]
const http2 = require('node:http2');

// Create an unencrypted HTTP/2 server
const server = http2.createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.on('error', (error) => console.error(error));
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```
:::

Aunque los streams HTTP/2 y los sockets de red no están en una correspondencia 1:1, un error de red destruirá cada stream individual y debe ser manejado en el nivel del stream, como se muestra arriba.


#### Evento: `'timeout'` {#event-timeout}

**Agregado en: v8.4.0**

Después de usar el método `http2session.setTimeout()` para establecer el período de tiempo de espera para esta `Http2Session`, se emite el evento `'timeout'` si no hay actividad en la `Http2Session` después de la cantidad configurada de milisegundos. Su receptor no espera ningún argumento.

```js [ESM]
session.setTimeout(2000);
session.on('timeout', () => { /* .. */ });
```
#### `http2session.alpnProtocol` {#http2sessionalpnprotocol}

**Agregado en: v9.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

El valor será `undefined` si la `Http2Session` aún no está conectada a un socket, `h2c` si la `Http2Session` no está conectada a un `TLSSocket`, o devolverá el valor de la propiedad `alpnProtocol` del `TLSSocket` conectado.

#### `http2session.close([callback])` {#http2sessionclosecallback}

**Agregado en: v9.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Cierra con elegancia la `Http2Session`, permitiendo que cualquier flujo existente se complete por sí solo e impidiendo la creación de nuevas instancias de `Http2Stream`. Una vez cerrada, se *podría* llamar a `http2session.destroy()` si no hay instancias de `Http2Stream` abiertas.

Si se especifica, la función `callback` se registra como un controlador para el evento `'close'`.

#### `http2session.closed` {#http2sessionclosed}

**Agregado en: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Será `true` si esta instancia de `Http2Session` se ha cerrado, de lo contrario, `false`.

#### `http2session.connecting` {#http2sessionconnecting}

**Agregado en: v10.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Será `true` si esta instancia de `Http2Session` aún se está conectando, se establecerá en `false` antes de emitir el evento `connect` y/o llamar al callback de `http2.connect`.

#### `http2session.destroy([error][, code])` {#http2sessiondestroyerror-code}

**Agregado en: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Un objeto `Error` si la `Http2Session` se está destruyendo debido a un error.
- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El código de error HTTP/2 para enviar en el frame `GOAWAY` final. Si no se especifica, y `error` no está indefinido, el valor predeterminado es `INTERNAL_ERROR`, de lo contrario, el valor predeterminado es `NO_ERROR`.

Termina inmediatamente la `Http2Session` y el `net.Socket` o `tls.TLSSocket` asociado.

Una vez destruida, la `Http2Session` emitirá el evento `'close'`. Si `error` no está indefinido, se emitirá un evento `'error'` inmediatamente antes del evento `'close'`.

Si quedan `Http2Streams` abiertos asociados con la `Http2Session`, también se destruirán.


#### `http2session.destroyed` {#http2sessiondestroyed}

**Agregado en: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Será `true` si esta instancia de `Http2Session` ha sido destruida y no debe usarse más, de lo contrario, `false`.

#### `http2session.encrypted` {#http2sessionencrypted}

**Agregado en: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

El valor es `undefined` si el socket de la sesión `Http2Session` aún no se ha conectado, `true` si `Http2Session` está conectado con un `TLSSocket` y `false` si `Http2Session` está conectado a cualquier otro tipo de socket o flujo.

#### `http2session.goaway([code[, lastStreamID[, opaqueData]]])` {#http2sessiongoawaycode-laststreamid-opaquedata}

**Agregado en: v9.4.0**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un código de error HTTP/2
- `lastStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El ID numérico del último `Http2Stream` procesado
- `opaqueData` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Una instancia `TypedArray` o `DataView` que contiene datos adicionales que se transportarán dentro del marco `GOAWAY`.

Transmite un marco `GOAWAY` al par conectado *sin* cerrar el `Http2Session`.

#### `http2session.localSettings` {#http2sessionlocalsettings}

**Agregado en: v8.4.0**

- [\<HTTP/2 Settings Object\>](/es/nodejs/api/http2#settings-object)

Un objeto sin prototipo que describe la configuración local actual de este `Http2Session`. La configuración local es local a *esta* instancia de `Http2Session`.

#### `http2session.originSet` {#http2sessionoriginset}

**Agregado en: v9.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Si el `Http2Session` está conectado a un `TLSSocket`, la propiedad `originSet` devolverá un `Array` de orígenes para los cuales el `Http2Session` puede considerarse autoritativo.

La propiedad `originSet` solo está disponible cuando se usa una conexión TLS segura.


#### `http2session.pendingSettingsAck` {#http2sessionpendingsettingsack}

**Agregado en: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Indica si la `Http2Session` está actualmente esperando el acuse de recibo de un marco `SETTINGS` enviado. Será `true` después de llamar al método `http2session.settings()`. Será `false` una vez que todos los marcos `SETTINGS` enviados hayan sido reconocidos.

#### `http2session.ping([payload, ]callback)` {#http2sessionpingpayload-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v8.9.3 | Agregado en: v8.9.3 |
:::

- `payload` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Carga útil de ping opcional.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Envía un marco `PING` al par HTTP/2 conectado. Se debe proporcionar una función `callback`. El método devolverá `true` si el `PING` se envió, `false` en caso contrario.

El número máximo de pings pendientes (no reconocidos) está determinado por la opción de configuración `maxOutstandingPings`. El máximo predeterminado es 10.

Si se proporciona, la `payload` debe ser un `Buffer`, `TypedArray` o `DataView` que contenga 8 bytes de datos que se transmitirán con el `PING` y se devolverán con el acuse de recibo del ping.

La devolución de llamada se invocará con tres argumentos: un argumento de error que será `null` si el `PING` se reconoció correctamente, un argumento de `duration` que informa el número de milisegundos transcurridos desde que se envió el ping y se recibió el acuse de recibo, y un `Buffer` que contiene la `payload` `PING` de 8 bytes.

```js [ESM]
session.ping(Buffer.from('abcdefgh'), (err, duration, payload) => {
  if (!err) {
    console.log(`Ping acknowledged in ${duration} milliseconds`);
    console.log(`With payload '${payload.toString()}'`);
  }
});
```
Si no se especifica el argumento `payload`, la carga útil predeterminada será la marca de tiempo de 64 bits (little endian) que marca el inicio de la duración del `PING`.


#### `http2session.ref()` {#http2sessionref}

**Agregado en: v9.4.0**

Llama a [`ref()`](/es/nodejs/api/net#socketref) en la instancia [`net.Socket`](/es/nodejs/api/net#class-netsocket) subyacente de esta `Http2Session`.

#### `http2session.remoteSettings` {#http2sessionremotesettings}

**Agregado en: v8.4.0**

- [\<Objeto de Configuración HTTP/2\>](/es/nodejs/api/http2#settings-object)

Un objeto sin prototipo que describe la configuración remota actual de esta `Http2Session`. La configuración remota es establecida por el par HTTP/2 *conectado*.

#### `http2session.setLocalWindowSize(windowSize)` {#http2sessionsetlocalwindowsizewindowsize}

**Agregado en: v15.3.0, v14.18.0**

- `windowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Establece el tamaño de la ventana del punto final local. El `windowSize` es el tamaño total de la ventana a establecer, no el delta.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

const server = createServer();
const expectedWindowSize = 2 ** 20;
server.on('session', (session) => {

  // Establece el tamaño de la ventana local a 2 ** 20
  session.setLocalWindowSize(expectedWindowSize);
});
```

```js [CJS]
const http2 = require('node:http2');

const server = http2.createServer();
const expectedWindowSize = 2 ** 20;
server.on('session', (session) => {

  // Establece el tamaño de la ventana local a 2 ** 20
  session.setLocalWindowSize(expectedWindowSize);
});
```
:::

Para los clientes http2, el evento apropiado es `'connect'` o `'remoteSettings'`.

#### `http2session.setTimeout(msecs, callback)` {#http2sessionsettimeoutmsecs-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Agregado en: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Se utiliza para establecer una función de devolución de llamada que se llama cuando no hay actividad en `Http2Session` después de `msecs` milisegundos. La `callback` dada se registra como un listener en el evento `'timeout'`.


#### `http2session.socket` {#http2sessionsocket}

**Agregado en: v8.4.0**

- [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/es/nodejs/api/tls#class-tlstlssocket)

Devuelve un objeto `Proxy` que actúa como un `net.Socket` (o `tls.TLSSocket`) pero limita los métodos disponibles a los que son seguros de usar con HTTP/2.

`destroy`, `emit`, `end`, `pause`, `read`, `resume` y `write` lanzarán un error con el código `ERR_HTTP2_NO_SOCKET_MANIPULATION`. Consulta [`Http2Session` y Sockets](/es/nodejs/api/http2#http2session-and-sockets) para obtener más información.

El método `setTimeout` se llamará en este `Http2Session`.

Todas las demás interacciones se dirigirán directamente al socket.

#### `http2session.state` {#http2sessionstate}

**Agregado en: v8.4.0**

Proporciona información diversa sobre el estado actual de la `Http2Session`.

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `effectiveLocalWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El tamaño actual de la ventana de control de flujo local (recepción) para la `Http2Session`.
    - `effectiveRecvDataLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número actual de bytes que se han recibido desde la última `WINDOW_UPDATE` de control de flujo.
    - `nextStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El identificador numérico que se utilizará la próxima vez que esta `Http2Session` cree un nuevo `Http2Stream`.
    - `localWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes que el par remoto puede enviar sin recibir una `WINDOW_UPDATE`.
    - `lastProcStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El ID numérico del `Http2Stream` para el cual se recibió más recientemente un marco `HEADERS` o `DATA`.
    - `remoteWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes que esta `Http2Session` puede enviar sin recibir una `WINDOW_UPDATE`.
    - `outboundQueueSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de marcos actualmente dentro de la cola de salida para esta `Http2Session`.
    - `deflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El tamaño actual en bytes de la tabla de estado de compresión de encabezado saliente.
    - `inflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El tamaño actual en bytes de la tabla de estado de compresión de encabezado entrante.


Un objeto que describe el estado actual de esta `Http2Session`.


#### `http2session.settings([settings][, callback])` {#http2sessionsettingssettings-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una callback inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Añadido en: v8.4.0 |
:::

- `settings` [\<Objeto de configuración HTTP/2\>](/es/nodejs/api/http2#settings-object)
- `callback` [\<Función\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback que es llamada una vez que la sesión está conectada o inmediatamente si la sesión ya está conectada.
    - `err` [\<Error\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<null\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Null_type)
    - `settings` [\<Objeto de configuración HTTP/2\>](/es/nodejs/api/http2#settings-object) El objeto `settings` actualizado.
    - `duration` [\<entero\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type)

Actualiza la configuración local actual para esta `Http2Session` y envía un nuevo marco `SETTINGS` al par HTTP/2 conectado.

Una vez llamado, la propiedad `http2session.pendingSettingsAck` será `true` mientras la sesión está esperando que el par remoto reconozca la nueva configuración.

La nueva configuración no entrará en vigor hasta que se reciba el acuse de recibo `SETTINGS` y se emita el evento `'localSettings'`. Es posible enviar múltiples marcos `SETTINGS` mientras el acuse de recibo todavía está pendiente.

#### `http2session.type` {#http2sessiontype}

**Añadido en: v8.4.0**

- [\<número\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type)

El `http2session.type` será igual a `http2.constants.NGHTTP2_SESSION_SERVER` si esta instancia de `Http2Session` es un servidor, y `http2.constants.NGHTTP2_SESSION_CLIENT` si la instancia es un cliente.

#### `http2session.unref()` {#http2sessionunref}

**Añadido en: v9.4.0**

Llama a [`unref()`](/es/nodejs/api/net#socketunref) en el [`net.Socket`](/es/nodejs/api/net#class-netsocket) subyacente de esta instancia de `Http2Session`.


### Clase: `ServerHttp2Session` {#class-serverhttp2session}

**Agregado en: v8.4.0**

- Extiende: [\<Http2Session\>](/es/nodejs/api/http2#class-http2session)

#### `serverhttp2session.altsvc(alt, originOrStream)` {#serverhttp2sessionaltsvcalt-originorstream}

**Agregado en: v9.4.0**

- `alt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una descripción de la configuración del servicio alternativo tal como se define en [RFC 7838](https://tools.ietf.org/html/rfc7838).
- `originOrStream` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ya sea una cadena URL que especifique el origen (o un `Object` con una propiedad `origin`) o el identificador numérico de un `Http2Stream` activo tal como lo da la propiedad `http2stream.id`.

Envía un marco `ALTSVC` (como se define en [RFC 7838](https://tools.ietf.org/html/rfc7838)) al cliente conectado.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

const server = createServer();
server.on('session', (session) => {
  // Establecer altsvc para el origen https://example.org:80
  session.altsvc('h2=":8000"', 'https://example.org:80');
});

server.on('stream', (stream) => {
  // Establecer altsvc para un flujo específico
  stream.session.altsvc('h2=":8000"', stream.id);
});
```

```js [CJS]
const http2 = require('node:http2');

const server = http2.createServer();
server.on('session', (session) => {
  // Establecer altsvc para el origen https://example.org:80
  session.altsvc('h2=":8000"', 'https://example.org:80');
});

server.on('stream', (stream) => {
  // Establecer altsvc para un flujo específico
  stream.session.altsvc('h2=":8000"', stream.id);
});
```
:::

El envío de un marco `ALTSVC` con un ID de flujo específico indica que el servicio alternativo está asociado con el origen del `Http2Stream` dado.

La cadena `alt` y de origen *deben* contener solo bytes ASCII y se interpretan estrictamente como una secuencia de bytes ASCII. El valor especial `'clear'` se puede pasar para borrar cualquier servicio alternativo establecido previamente para un dominio dado.

Cuando se pasa una cadena para el argumento `originOrStream`, se analizará como una URL y se derivará el origen. Por ejemplo, el origen para la URL HTTP `'https://example.org/foo/bar'` es la cadena ASCII `'https://example.org'`. Se producirá un error si la cadena dada no se puede analizar como una URL o si no se puede derivar un origen válido.

Un objeto `URL`, o cualquier objeto con una propiedad `origin`, se puede pasar como `originOrStream`, en cuyo caso se utilizará el valor de la propiedad `origin`. El valor de la propiedad `origin` *debe* ser un origen ASCII serializado correctamente.


#### Especificando servicios alternativos {#specifying-alternative-services}

El formato del parámetro `alt` está estrictamente definido por [RFC 7838](https://tools.ietf.org/html/rfc7838) como una cadena ASCII que contiene una lista delimitada por comas de protocolos "alternativos" asociados a un host y puerto específicos.

Por ejemplo, el valor `'h2="example.org:81"'` indica que el protocolo HTTP/2 está disponible en el host `'example.org'` en el puerto TCP/IP 81. El host y el puerto *deben* estar contenidos dentro de los caracteres de comillas (`"`).

Se pueden especificar múltiples alternativas, por ejemplo: `'h2="example.org:81", h2=":82"'`.

El identificador de protocolo (`'h2'` en los ejemplos) puede ser cualquier [ID de protocolo ALPN](https://www.iana.org/assignments/tls-extensiontype-values/tls-extensiontype-values.xhtml#alpn-protocol-ids) válido.

La sintaxis de estos valores no es validada por la implementación de Node.js y se transmiten tal como las proporciona el usuario o las recibe el par.

#### `serverhttp2session.origin(...origins)` {#serverhttp2sessionoriginorigins}

**Agregado en: v10.12.0**

- `origins` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Una o más cadenas URL pasadas como argumentos separados.

Envía un marco `ORIGIN` (como se define en [RFC 8336](https://tools.ietf.org/html/rfc8336)) al cliente conectado para anunciar el conjunto de orígenes para los que el servidor es capaz de proporcionar respuestas autorizadas.

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
const options = getSecureOptionsSomehow();
const server = createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
server.on('session', (session) => {
  session.origin('https://example.com', 'https://example.org');
});
```

```js [CJS]
const http2 = require('node:http2');
const options = getSecureOptionsSomehow();
const server = http2.createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
server.on('session', (session) => {
  session.origin('https://example.com', 'https://example.org');
});
```
:::

Cuando se pasa una cadena como `origin`, se analizará como una URL y se derivará el origen. Por ejemplo, el origen para la URL HTTP `'https://example.org/foo/bar'` es la cadena ASCII `'https://example.org'`. Se producirá un error si la cadena dada no se puede analizar como una URL o si no se puede derivar un origen válido.

Un objeto `URL`, o cualquier objeto con una propiedad `origin`, puede pasarse como `origin`, en cuyo caso se utilizará el valor de la propiedad `origin`. El valor de la propiedad `origin` *debe* ser un origen ASCII serializado correctamente.

Alternativamente, la opción `origins` se puede usar al crear un nuevo servidor HTTP/2 usando el método `http2.createSecureServer()`:

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
const options = getSecureOptionsSomehow();
options.origins = ['https://example.com', 'https://example.org'];
const server = createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
```

```js [CJS]
const http2 = require('node:http2');
const options = getSecureOptionsSomehow();
options.origins = ['https://example.com', 'https://example.org'];
const server = http2.createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
```
:::


### Clase: `ClientHttp2Session` {#class-clienthttp2session}

**Agregado en: v8.4.0**

- Extiende: [\<Http2Session\>](/es/nodejs/api/http2#class-http2session)

#### Evento: `'altsvc'` {#event-altsvc}

**Agregado en: v9.4.0**

- `alt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `streamId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El evento `'altsvc'` se emite cada vez que el cliente recibe un marco `ALTSVC`. El evento se emite con el valor `ALTSVC`, el origen y el ID de flujo. Si no se proporciona ningún `origin` en el marco `ALTSVC`, `origin` será una cadena vacía.

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://example.org');

client.on('altsvc', (alt, origin, streamId) => {
  console.log(alt);
  console.log(origin);
  console.log(streamId);
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://example.org');

client.on('altsvc', (alt, origin, streamId) => {
  console.log(alt);
  console.log(origin);
  console.log(streamId);
});
```
:::

#### Evento: `'origin'` {#event-origin}

**Agregado en: v10.12.0**

- `origins` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El evento `'origin'` se emite cada vez que el cliente recibe un marco `ORIGIN`. El evento se emite con una matriz de cadenas `origin`. El `http2session.originSet` se actualizará para incluir los orígenes recibidos.

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://example.org');

client.on('origin', (origins) => {
  for (let n = 0; n < origins.length; n++)
    console.log(origins[n]);
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://example.org');

client.on('origin', (origins) => {
  for (let n = 0; n < origins.length; n++)
    console.log(origins[n]);
});
```
:::

El evento `'origin'` solo se emite cuando se utiliza una conexión TLS segura.


#### `clienthttp2session.request(headers[, options])` {#clienthttp2sessionrequestheaders-options}

**Añadido en: v8.4.0**

-  `headers` [\<Objeto de encabezados HTTP/2\>](/es/nodejs/api/http2#headers-object)
-  `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si el lado *writable* de `Http2Stream` debe cerrarse inicialmente, como cuando se envía una solicitud `GET` que no debe esperar un cuerpo de carga útil.
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true` y `parent` identifica una Stream padre, la stream creada se convierte en la única dependencia directa del padre, con todos los demás dependientes existentes convertidos en dependientes de la stream recién creada. **Predeterminado:** `false`.
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el identificador numérico de una stream de la que depende la stream recién creada.
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica la dependencia relativa de una stream en relación con otras streams con el mismo `parent`. El valor es un número entre `1` y `256` (inclusive).
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, el `Http2Stream` emitirá el evento `'wantTrailers'` después de que se haya enviado el marco `DATA` final.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Una AbortSignal que se puede utilizar para abortar una solicitud en curso.


-  Devuelve: [\<ClientHttp2Stream\>](/es/nodejs/api/http2#class-clienthttp2stream)

Solo para instancias de `Http2Session` de cliente HTTP/2, `http2session.request()` crea y devuelve una instancia de `Http2Stream` que se puede utilizar para enviar una solicitud HTTP/2 al servidor conectado.

Cuando se crea por primera vez un `ClientHttp2Session`, es posible que el socket aún no esté conectado. Si se llama a `clienthttp2session.request()` durante este tiempo, la solicitud real se diferirá hasta que el socket esté listo para funcionar. Si la `session` se cierra antes de que se ejecute la solicitud real, se lanza un `ERR_HTTP2_GOAWAY_SESSION`.

Este método solo está disponible si `http2session.type` es igual a `http2.constants.NGHTTP2_SESSION_CLIENT`.



::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';
const clientSession = connect('https://localhost:1234');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
} = constants;

const req = clientSession.request({ [HTTP2_HEADER_PATH]: '/' });
req.on('response', (headers) => {
  console.log(headers[HTTP2_HEADER_STATUS]);
  req.on('data', (chunk) => { /* .. */ });
  req.on('end', () => { /* .. */ });
});
```

```js [CJS]
const http2 = require('node:http2');
const clientSession = http2.connect('https://localhost:1234');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
} = http2.constants;

const req = clientSession.request({ [HTTP2_HEADER_PATH]: '/' });
req.on('response', (headers) => {
  console.log(headers[HTTP2_HEADER_STATUS]);
  req.on('data', (chunk) => { /* .. */ });
  req.on('end', () => { /* .. */ });
});
```
:::

Cuando se establece la opción `options.waitForTrailers`, el evento `'wantTrailers'` se emite inmediatamente después de poner en cola el último fragmento de datos de carga útil que se enviará. A continuación, se puede llamar al método `http2stream.sendTrailers()` para enviar encabezados finales al peer.

Cuando se establece `options.waitForTrailers`, el `Http2Stream` no se cerrará automáticamente cuando se transmita el marco `DATA` final. El código de usuario debe llamar a `http2stream.sendTrailers()` o `http2stream.close()` para cerrar el `Http2Stream`.

Cuando `options.signal` se establece con un `AbortSignal` y luego se llama a `abort` en el `AbortController` correspondiente, la solicitud emitirá un evento `'error'` con un error `AbortError`.

Los pseudo-encabezados `:method` y `:path` no se especifican dentro de `headers`, por lo que respectivamente se establecen de forma predeterminada en:

- `:method` = `'GET'`
- `:path` = `/`


### Clase: `Http2Stream` {#class-http2stream}

**Agregado en: v8.4.0**

- Extiende: [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)

Cada instancia de la clase `Http2Stream` representa un flujo de comunicaciones HTTP/2 bidireccional sobre una instancia de `Http2Session`. Cualquier `Http2Session` individual puede tener hasta 2-1 instancias de `Http2Stream` durante su vida útil.

El código de usuario no construirá instancias de `Http2Stream` directamente. Más bien, estas son creadas, gestionadas y proporcionadas al código de usuario a través de la instancia de `Http2Session`. En el servidor, las instancias de `Http2Stream` se crean ya sea en respuesta a una solicitud HTTP entrante (y se entregan al código de usuario a través del evento `'stream'`), o en respuesta a una llamada al método `http2stream.pushStream()`. En el cliente, las instancias de `Http2Stream` se crean y se devuelven cuando se llama al método `http2session.request()`, o en respuesta a un evento `'push'` entrante.

La clase `Http2Stream` es una base para las clases [`ServerHttp2Stream`](/es/nodejs/api/http2#class-serverhttp2stream) y [`ClientHttp2Stream`](/es/nodejs/api/http2#class-clienthttp2stream), cada una de las cuales se utiliza específicamente por el lado del Servidor o del Cliente, respectivamente.

Todas las instancias de `Http2Stream` son flujos [`Duplex`](/es/nodejs/api/stream#class-streamduplex). El lado `Writable` de `Duplex` se utiliza para enviar datos al par conectado, mientras que el lado `Readable` se utiliza para recibir datos enviados por el par conectado.

La codificación de caracteres de texto predeterminada para un `Http2Stream` es UTF-8. Cuando se utiliza un `Http2Stream` para enviar texto, utilice la cabecera `'content-type'` para establecer la codificación de caracteres.

```js [ESM]
stream.respond({
  'content-type': 'text/html; charset=utf-8',
  ':status': 200,
});
```
#### Ciclo de vida de `Http2Stream` {#http2stream-lifecycle}

##### Creación {#creation}

En el lado del servidor, las instancias de [`ServerHttp2Stream`](/es/nodejs/api/http2#class-serverhttp2stream) se crean ya sea cuando:

- Se recibe un nuevo marco `HEADERS` HTTP/2 con un ID de flujo no utilizado previamente;
- Se llama al método `http2stream.pushStream()`.

En el lado del cliente, las instancias de [`ClientHttp2Stream`](/es/nodejs/api/http2#class-clienthttp2stream) se crean cuando se llama al método `http2session.request()`.

En el cliente, la instancia `Http2Stream` devuelta por `http2session.request()` puede no estar inmediatamente lista para su uso si la `Http2Session` principal aún no se ha establecido por completo. En tales casos, las operaciones llamadas en el `Http2Stream` se almacenarán en búfer hasta que se emita el evento `'ready'`. El código de usuario rara vez, o nunca, necesita manejar el evento `'ready'` directamente. El estado listo de un `Http2Stream` puede determinarse comprobando el valor de `http2stream.id`. Si el valor es `undefined`, el flujo aún no está listo para su uso.


##### Destrucción {#destruction}

Todas las instancias de [`Http2Stream`](/es/nodejs/api/http2#class-http2stream) se destruyen cuando:

- El par conectado recibe un frame `RST_STREAM` para el stream, y (solo para streams de cliente) los datos pendientes han sido leídos.
- Se llama al método `http2stream.close()`, y (solo para streams de cliente) los datos pendientes han sido leídos.
- Se llaman los métodos `http2stream.destroy()` o `http2session.destroy()`.

Cuando se destruye una instancia de `Http2Stream`, se intentará enviar un frame `RST_STREAM` al par conectado.

Cuando se destruye la instancia de `Http2Stream`, se emitirá el evento `'close'`. Debido a que `Http2Stream` es una instancia de `stream.Duplex`, el evento `'end'` también se emitirá si los datos del stream están fluyendo actualmente. El evento `'error'` también puede emitirse si se llamó a `http2stream.destroy()` con un `Error` pasado como primer argumento.

Después de que `Http2Stream` ha sido destruido, la propiedad `http2stream.destroyed` será `true` y la propiedad `http2stream.rstCode` especificará el código de error `RST_STREAM`. La instancia de `Http2Stream` ya no es utilizable una vez destruida.

#### Evento: `'aborted'` {#event-aborted}

**Agregado en: v8.4.0**

El evento `'aborted'` se emite cada vez que una instancia de `Http2Stream` se aborta de forma anormal en mitad de la comunicación. Su listener no espera ningún argumento.

El evento `'aborted'` solo se emitirá si el lado de escritura de `Http2Stream` no ha finalizado.

#### Evento: `'close'` {#event-close_1}

**Agregado en: v8.4.0**

El evento `'close'` se emite cuando se destruye el `Http2Stream`. Una vez que se emite este evento, la instancia de `Http2Stream` ya no es utilizable.

El código de error HTTP/2 utilizado al cerrar el stream se puede recuperar utilizando la propiedad `http2stream.rstCode`. Si el código es cualquier valor que no sea `NGHTTP2_NO_ERROR` (`0`), también se habrá emitido un evento `'error'`.

#### Evento: `'error'` {#event-error_1}

**Agregado en: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

El evento `'error'` se emite cuando ocurre un error durante el procesamiento de un `Http2Stream`.


#### Evento: `'frameError'` {#event-frameerror_1}

**Añadido en: v8.4.0**

- `type` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El tipo de marco.
- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El código de error.
- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El ID del flujo (o `0` si el marco no está asociado a un flujo).

El evento `'frameError'` se emite cuando ocurre un error al intentar enviar un marco. Cuando se invoca, la función de controlador recibirá un argumento entero que identifica el tipo de marco y un argumento entero que identifica el código de error. La instancia `Http2Stream` se destruirá inmediatamente después de que se emita el evento `'frameError'`.

#### Evento: `'ready'` {#event-ready}

**Añadido en: v8.4.0**

El evento `'ready'` se emite cuando el `Http2Stream` se ha abierto, se le ha asignado un `id` y se puede utilizar. El listener no espera ningún argumento.

#### Evento: `'timeout'` {#event-timeout_1}

**Añadido en: v8.4.0**

El evento `'timeout'` se emite después de que no se recibe ninguna actividad para este `Http2Stream` dentro del número de milisegundos establecido utilizando `http2stream.setTimeout()`. Su listener no espera ningún argumento.

#### Evento: `'trailers'` {#event-trailers}

**Añadido en: v8.4.0**

- `headers` [\<Objeto de Encabezados HTTP/2\>](/es/nodejs/api/http2#headers-object) Un objeto que describe los encabezados
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Los flags numéricos asociados

El evento `'trailers'` se emite cuando se recibe un bloque de encabezados asociado con campos de encabezado finales. La función callback del listener recibe el [Objeto de Encabezados HTTP/2](/es/nodejs/api/http2#headers-object) y los flags asociados con los encabezados.

Este evento podría no emitirse si se llama a `http2stream.end()` antes de que se reciban los trailers y los datos entrantes no se estén leyendo o escuchando.

```js [ESM]
stream.on('trailers', (headers, flags) => {
  console.log(headers);
});
```


#### Evento: `'wantTrailers'` {#event-wanttrailers}

**Añadido en: v10.0.0**

El evento `'wantTrailers'` se emite cuando el `Http2Stream` ha puesto en cola el marco `DATA` final para ser enviado en un marco y el `Http2Stream` está listo para enviar encabezados finales. Al iniciar una solicitud o respuesta, la opción `waitForTrailers` debe establecerse para que se emita este evento.

#### `http2stream.aborted` {#http2streamaborted}

**Añadido en: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Establecido en `true` si la instancia `Http2Stream` se abortó anormalmente. Cuando se establece, el evento `'aborted'` se habrá emitido.

#### `http2stream.bufferSize` {#http2streambuffersize}

**Añadido en: v11.2.0, v10.16.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Esta propiedad muestra el número de caracteres actualmente almacenados en búfer para ser escritos. Vea [`net.Socket.bufferSize`](/es/nodejs/api/net#socketbuffersize) para más detalles.

#### `http2stream.close(code[, callback])` {#http2streamclosecode-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar un callback inválido al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Añadido en: v8.4.0 |
:::

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Entero sin signo de 32 bits que identifica el código de error. **Predeterminado:** `http2.constants.NGHTTP2_NO_ERROR` (`0x00`).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función opcional registrada para escuchar el evento `'close'`.

Cierra la instancia `Http2Stream` enviando un marco `RST_STREAM` al par HTTP/2 conectado.

#### `http2stream.closed` {#http2streamclosed}

**Añadido en: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Establecido en `true` si la instancia `Http2Stream` ha sido cerrada.

#### `http2stream.destroyed` {#http2streamdestroyed}

**Añadido en: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Establecido en `true` si la instancia `Http2Stream` ha sido destruida y ya no es utilizable.


#### `http2stream.endAfterHeaders` {#http2streamendafterheaders}

**Agregado en: v10.11.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Establecido en `true` si el indicador `END_STREAM` se estableció en el marco HEADERS de la solicitud o respuesta recibida, lo que indica que no se deben recibir datos adicionales y se cerrará el lado legible de `Http2Stream`.

#### `http2stream.id` {#http2streamid}

**Agregado en: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

El identificador de flujo numérico de esta instancia de `Http2Stream`. Establecido en `undefined` si el identificador de flujo aún no se ha asignado.

#### `http2stream.pending` {#http2streampending}

**Agregado en: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Establecido en `true` si a la instancia de `Http2Stream` aún no se le ha asignado un identificador de flujo numérico.

#### `http2stream.priority(options)` {#http2streampriorityoptions}

**Agregado en: v8.4.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true` y `parent` identifica un Stream padre, este flujo se convierte en la única dependencia directa del padre, y todos los demás dependientes existentes se convierten en dependientes de este flujo. **Predeterminado:** `false`.
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el identificador numérico de un flujo del que depende este flujo.
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica la dependencia relativa de un flujo en relación con otros flujos con el mismo `parent`. El valor es un número entre `1` y `256` (inclusive).
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, cambia la prioridad localmente sin enviar un marco `PRIORITY` al par conectado.
  
 

Actualiza la prioridad para esta instancia de `Http2Stream`.


#### `http2stream.rstCode` {#http2streamrstcode}

**Agregado en: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Establecido al [código de error](/es/nodejs/api/http2#error-codes-for-rst_stream-and-goaway) `RST_STREAM` reportado cuando el `Http2Stream` se destruye después de recibir un marco `RST_STREAM` del par conectado, llamar a `http2stream.close()` o `http2stream.destroy()`. Será `undefined` si el `Http2Stream` no se ha cerrado.

#### `http2stream.sentHeaders` {#http2streamsentheaders}

**Agregado en: v9.5.0**

- [\<Objeto de Encabezados HTTP/2\>](/es/nodejs/api/http2#headers-object)

Un objeto que contiene los encabezados salientes enviados para este `Http2Stream`.

#### `http2stream.sentInfoHeaders` {#http2streamsentinfoheaders}

**Agregado en: v9.5.0**

- [\<Objeto de Encabezados HTTP/2[]\>](/es/nodejs/api/http2#headers-object)

Un arreglo de objetos que contiene los encabezados informativos (adicionales) salientes enviados para este `Http2Stream`.

#### `http2stream.sentTrailers` {#http2streamsenttrailers}

**Agregado en: v9.5.0**

- [\<Objeto de Encabezados HTTP/2\>](/es/nodejs/api/http2#headers-object)

Un objeto que contiene los trailers salientes enviados para este `HttpStream`.

#### `http2stream.session` {#http2streamsession}

**Agregado en: v8.4.0**

- [\<Http2Session\>](/es/nodejs/api/http2#class-http2session)

Una referencia a la instancia `Http2Session` que posee este `Http2Stream`. El valor será `undefined` después de que se destruya la instancia `Http2Stream`.

#### `http2stream.setTimeout(msecs, callback)` {#http2streamsettimeoutmsecs-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Agregado en: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)



::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';
const client = connect('http://example.org:8000');
const { NGHTTP2_CANCEL } = constants;
const req = client.request({ ':path': '/' });

// Cancelar el flujo si no hay actividad después de 5 segundos
req.setTimeout(5000, () => req.close(NGHTTP2_CANCEL));
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('http://example.org:8000');
const { NGHTTP2_CANCEL } = http2.constants;
const req = client.request({ ':path': '/' });

// Cancelar el flujo si no hay actividad después de 5 segundos
req.setTimeout(5000, () => req.close(NGHTTP2_CANCEL));
```
:::


#### `http2stream.state` {#http2streamstate}

**Agregado en: v8.4.0**

Proporciona información diversa sobre el estado actual del `Http2Stream`.

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `localWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes que el par conectado puede enviar para este `Http2Stream` sin recibir un `WINDOW_UPDATE`.
    - `state` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un flag que indica el estado actual de bajo nivel del `Http2Stream` según lo determinado por `nghttp2`.
    - `localClose` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `1` si este `Http2Stream` se ha cerrado localmente.
    - `remoteClose` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `1` si este `Http2Stream` se ha cerrado de forma remota.
    - `sumDependencyWeight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El peso de la suma de todas las instancias de `Http2Stream` que dependen de este `Http2Stream` como se especifica utilizando fotogramas `PRIORITY`.
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El peso de prioridad de este `Http2Stream`.

Un estado actual de este `Http2Stream`.

#### `http2stream.sendTrailers(headers)` {#http2streamsendtrailersheaders}

**Agregado en: v10.0.0**

- `headers` [\<Objeto de Cabeceras HTTP/2\>](/es/nodejs/api/http2#headers-object)

Envía un fotograma `HEADERS` de cola al par HTTP/2 conectado. Este método hará que el `Http2Stream` se cierre inmediatamente y solo debe llamarse después de que se haya emitido el evento `'wantTrailers'`. Al enviar una solicitud o enviar una respuesta, la opción `options.waitForTrailers` debe establecerse para mantener el `Http2Stream` abierto después del fotograma `DATA` final para que se puedan enviar los trailers.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond(undefined, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ xyz: 'abc' });
  });
  stream.end('Hello World');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond(undefined, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ xyz: 'abc' });
  });
  stream.end('Hello World');
});
```
:::

La especificación HTTP/1 prohíbe que los trailers contengan campos de pseudo-cabecera HTTP/2 (por ejemplo, `':method'`, `':path'`, etc.).


### Clase: `ClientHttp2Stream` {#class-clienthttp2stream}

**Agregado en: v8.4.0**

- Extiende [\<Http2Stream\>](/es/nodejs/api/http2#class-http2stream)

La clase `ClientHttp2Stream` es una extensión de `Http2Stream` que se usa exclusivamente en clientes HTTP/2. Las instancias de `Http2Stream` en el cliente proporcionan eventos como `'response'` y `'push'` que solo son relevantes en el cliente.

#### Evento: `'continue'` {#event-continue}

**Agregado en: v8.5.0**

Se emite cuando el servidor envía un estado `100 Continue`, generalmente porque la solicitud contenía `Expect: 100-continue`. Esta es una instrucción de que el cliente debe enviar el cuerpo de la solicitud.

#### Evento: `'headers'` {#event-headers}

**Agregado en: v8.4.0**

- `headers` [\<Objeto de encabezados HTTP/2\>](/es/nodejs/api/http2#headers-object)
- `flags` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El evento `'headers'` se emite cuando se recibe un bloque adicional de encabezados para un flujo, como cuando se recibe un bloque de encabezados informativos `1xx`. La función de retorno de llamada del listener recibe el [Objeto de encabezados HTTP/2](/es/nodejs/api/http2#headers-object) y las flags asociadas con los encabezados.

```js [ESM]
stream.on('headers', (headers, flags) => {
  console.log(headers);
});
```
#### Evento: `'push'` {#event-push}

**Agregado en: v8.4.0**

- `headers` [\<Objeto de encabezados HTTP/2\>](/es/nodejs/api/http2#headers-object)
- `flags` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El evento `'push'` se emite cuando se reciben los encabezados de respuesta para un flujo Server Push. La función de retorno de llamada del listener recibe el [Objeto de encabezados HTTP/2](/es/nodejs/api/http2#headers-object) y las flags asociadas con los encabezados.

```js [ESM]
stream.on('push', (headers, flags) => {
  console.log(headers);
});
```
#### Evento: `'response'` {#event-response}

**Agregado en: v8.4.0**

- `headers` [\<Objeto de encabezados HTTP/2\>](/es/nodejs/api/http2#headers-object)
- `flags` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El evento `'response'` se emite cuando se ha recibido un frame `HEADERS` de respuesta para este flujo desde el servidor HTTP/2 conectado. Se invoca al listener con dos argumentos: un `Object` que contiene el [Objeto de encabezados HTTP/2](/es/nodejs/api/http2#headers-object) recibido y las flags asociadas con los encabezados.



::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://localhost');
const req = client.request({ ':path': '/' });
req.on('response', (headers, flags) => {
  console.log(headers[':status']);
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://localhost');
const req = client.request({ ':path': '/' });
req.on('response', (headers, flags) => {
  console.log(headers[':status']);
});
```
:::


### Clase: `ServerHttp2Stream` {#class-serverhttp2stream}

**Agregada en: v8.4.0**

- Extiende: [\<Http2Stream\>](/es/nodejs/api/http2#class-http2stream)

La clase `ServerHttp2Stream` es una extensión de [`Http2Stream`](/es/nodejs/api/http2#class-http2stream) que se utiliza exclusivamente en servidores HTTP/2. Las instancias de `Http2Stream` en el servidor proporcionan métodos adicionales como `http2stream.pushStream()` y `http2stream.respond()` que solo son relevantes en el servidor.

#### `http2stream.additionalHeaders(headers)` {#http2streamadditionalheadersheaders}

**Agregada en: v8.4.0**

- `headers` [\<Objeto de encabezados HTTP/2\>](/es/nodejs/api/http2#headers-object)

Envía un marco `HEADERS` informativo adicional al par HTTP/2 conectado.

#### `http2stream.headersSent` {#http2streamheaderssent}

**Agregada en: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Boolean_type)

Verdadero si se enviaron los encabezados, falso en caso contrario (solo lectura).

#### `http2stream.pushAllowed` {#http2streampushallowed}

**Agregada en: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Boolean_type)

Propiedad de solo lectura asignada al indicador `SETTINGS_ENABLE_PUSH` del marco `SETTINGS` más reciente del cliente remoto. Será `true` si el par remoto acepta streams push, `false` en caso contrario. La configuración es la misma para cada `Http2Stream` en la misma `Http2Session`.

#### `http2stream.pushStream(headers[, options], callback)` {#http2streampushstreamheaders-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar un callback no válido al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Agregada en: v8.4.0 |
:::

- `headers` [\<Objeto de encabezados HTTP/2\>](/es/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `exclusive` [\<boolean\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true` y `parent` identifica un Stream padre, el stream creado se convierte en la única dependencia directa del padre, con todos los demás dependientes existentes convertidos en dependientes del stream recién creado. **Predeterminado:** `false`.
  - `parent` [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type) Especifica el identificador numérico de un stream del que depende el stream recién creado.

- `callback` [\<Function\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback que se llama una vez que se ha iniciado el stream push.
  - `err` [\<Error\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Error)
  - `pushStream` [\<ServerHttp2Stream\>](/es/nodejs/api/http2#class-serverhttp2stream) El objeto `pushStream` devuelto.
  - `headers` [\<Objeto de encabezados HTTP/2\>](/es/nodejs/api/http2#headers-object) Objeto de encabezados con el que se inició el `pushStream`.

Inicia un stream push. Se invoca al callback con la nueva instancia de `Http2Stream` creada para el stream push que se pasa como segundo argumento, o un `Error` que se pasa como primer argumento.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.pushStream({ ':path': '/' }, (err, pushStream, headers) => {
    if (err) throw err;
    pushStream.respond({ ':status': 200 });
    pushStream.end('some pushed data');
  });
  stream.end('some data');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.pushStream({ ':path': '/' }, (err, pushStream, headers) => {
    if (err) throw err;
    pushStream.respond({ ':status': 200 });
    pushStream.end('some pushed data');
  });
  stream.end('some data');
});
```
:::

No se permite establecer el peso de un stream push en el marco `HEADERS`. Pase un valor `weight` a `http2stream.priority` con la opción `silent` establecida en `true` para habilitar el equilibrio de ancho de banda del lado del servidor entre streams concurrentes.

No se permite llamar a `http2stream.pushStream()` desde dentro de un stream push y se producirá un error.


#### `http2stream.respond([headers[, options]])` {#http2streamrespondheaders-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.5.0, v12.19.0 | Permite establecer explícitamente los encabezados de fecha. |
| v8.4.0 | Agregado en: v8.4.0 |
:::

- `headers` [\<Objeto de Encabezados HTTP/2\>](/es/nodejs/api/http2#headers-object)
- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Establecer en `true` para indicar que la respuesta no incluirá datos de carga útil.
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, el `Http2Stream` emitirá el evento `'wantTrailers'` después de que se haya enviado el último frame `DATA`.
  
 



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.end('some data');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.end('some data');
});
```
:::

Inicia una respuesta. Cuando la opción `options.waitForTrailers` está establecida, el evento `'wantTrailers'` se emitirá inmediatamente después de poner en cola el último fragmento de datos de carga útil que se enviará. El método `http2stream.sendTrailers()` se puede utilizar entonces para enviar campos de encabezado finales al peer.

Cuando `options.waitForTrailers` está establecido, el `Http2Stream` no se cerrará automáticamente cuando se transmita el frame `DATA` final. El código del usuario debe llamar a `http2stream.sendTrailers()` o a `http2stream.close()` para cerrar el `Http2Stream`.



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 }, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
  stream.end('some data');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 }, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
  stream.end('some data');
});
```
:::


#### `http2stream.respondWithFD(fd[, headers[, options]])` {#http2streamrespondwithfdfd-headers-options}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.5.0, v12.19.0 | Permite establecer explícitamente los encabezados de fecha. |
| v12.12.0 | La opción `fd` ahora puede ser un `FileHandle`. |
| v10.0.0 | Ahora se admite cualquier descriptor de archivo legible, no necesariamente para un archivo regular. |
| v8.4.0 | Agregado en: v8.4.0 |
:::

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/es/nodejs/api/fs#class-filehandle) Un descriptor de archivo legible.
- `headers` [\<Objeto de Encabezados HTTP/2\>](/es/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `statCheck` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, el `Http2Stream` emitirá el evento `'wantTrailers'` después de que se haya enviado el último fotograma `DATA`.
    - `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La posición de desplazamiento en la que se empezará a leer.
    - `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La cantidad de datos del fd que se enviarán.
  
 

Inicia una respuesta cuyos datos se leen del descriptor de archivo dado. No se realiza ninguna validación en el descriptor de archivo dado. Si se produce un error al intentar leer datos utilizando el descriptor de archivo, el `Http2Stream` se cerrará utilizando un fotograma `RST_STREAM` utilizando el código `INTERNAL_ERROR` estándar.

Cuando se utiliza, la interfaz `Duplex` del objeto `Http2Stream` se cerrará automáticamente.



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
import { openSync, fstatSync, closeSync } from 'node:fs';

const server = createServer();
server.on('stream', (stream) => {
  const fd = openSync('/some/file', 'r');

  const stat = fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers);
  stream.on('close', () => closeSync(fd));
});
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createServer();
server.on('stream', (stream) => {
  const fd = fs.openSync('/some/file', 'r');

  const stat = fs.fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers);
  stream.on('close', () => fs.closeSync(fd));
});
```
:::

La función opcional `options.statCheck` puede especificarse para dar al código de usuario la oportunidad de establecer encabezados de contenido adicionales basados en los detalles `fs.Stat` del fd dado. Si se proporciona la función `statCheck`, el método `http2stream.respondWithFD()` realizará una llamada `fs.fstat()` para recopilar detalles sobre el descriptor de archivo proporcionado.

Las opciones `offset` y `length` pueden utilizarse para limitar la respuesta a un subconjunto de rango específico. Esto puede utilizarse, por ejemplo, para admitir solicitudes de rango HTTP.

El descriptor de archivo o `FileHandle` no se cierra cuando se cierra la secuencia, por lo que deberá cerrarse manualmente una vez que ya no sea necesario. No se admite el uso concurrente del mismo descriptor de archivo para varias secuencias y puede provocar la pérdida de datos. Se admite la reutilización de un descriptor de archivo después de que una secuencia haya finalizado.

Cuando se establece la opción `options.waitForTrailers`, el evento `'wantTrailers'` se emitirá inmediatamente después de poner en cola el último fragmento de datos de carga útil que se enviará. El método `http2stream.sendTrailers()` puede utilizarse entonces para enviar campos de encabezado finales al par.

Cuando se establece `options.waitForTrailers`, el `Http2Stream` no se cerrará automáticamente cuando se transmita el fotograma `DATA` final. El código de usuario *debe* llamar a `http2stream.sendTrailers()` o `http2stream.close()` para cerrar el `Http2Stream`.



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
import { openSync, fstatSync, closeSync } from 'node:fs';

const server = createServer();
server.on('stream', (stream) => {
  const fd = openSync('/some/file', 'r');

  const stat = fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });

  stream.on('close', () => closeSync(fd));
});
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createServer();
server.on('stream', (stream) => {
  const fd = fs.openSync('/some/file', 'r');

  const stat = fs.fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });

  stream.on('close', () => fs.closeSync(fd));
});
```
:::


#### `http2stream.respondWithFile(path[, headers[, options]])` {#http2streamrespondwithfilepath-headers-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.5.0, v12.19.0 | Permite establecer explícitamente los encabezados de fecha. |
| v10.0.0 | Ahora se admite cualquier archivo legible, no necesariamente un archivo regular. |
| v8.4.0 | Añadido en: v8.4.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `headers` [\<Objeto de encabezados HTTP/2\>](/es/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `statCheck` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `onError` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Función de callback invocada en caso de error antes de enviar.
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, el `Http2Stream` emitirá el evento `'wantTrailers'` después de que se haya enviado el marco `DATA` final.
    - `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La posición de desplazamiento en la que comenzar a leer.
    - `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La cantidad de datos del fd para enviar.
  
 

Envía un archivo regular como respuesta. El `path` debe especificar un archivo regular o se emitirá un evento `'error'` en el objeto `Http2Stream`.

Cuando se usa, la interfaz `Duplex` del objeto `Http2Stream` se cerrará automáticamente.

La función opcional `options.statCheck` se puede especificar para dar al código de usuario la oportunidad de establecer encabezados de contenido adicionales basados en los detalles de `fs.Stat` del archivo dado:

Si ocurre un error al intentar leer los datos del archivo, el `Http2Stream` se cerrará usando un marco `RST_STREAM` usando el código `INTERNAL_ERROR` estándar. Si el callback `onError` está definido, entonces será llamado. De lo contrario, el stream será destruido.

Ejemplo usando una ruta de archivo:



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    headers['last-modified'] = stat.mtime.toUTCString();
  }

  function onError(err) {
    // stream.respond() puede lanzar si el stream ha sido destruido por
    // el otro lado.
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ ':status': 404 });
      } else {
        stream.respond({ ':status': 500 });
      }
    } catch (err) {
      // Realizar el manejo real de errores.
      console.error(err);
    }
    stream.end();
  }

  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck, onError });
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    headers['last-modified'] = stat.mtime.toUTCString();
  }

  function onError(err) {
    // stream.respond() puede lanzar si el stream ha sido destruido por
    // el otro lado.
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ ':status': 404 });
      } else {
        stream.respond({ ':status': 500 });
      }
    } catch (err) {
      // Realizar el manejo real de errores.
      console.error(err);
    }
    stream.end();
  }

  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck, onError });
});
```
:::

La función `options.statCheck` también se puede utilizar para cancelar la operación de envío devolviendo `false`. Por ejemplo, una solicitud condicional puede verificar los resultados de stat para determinar si el archivo ha sido modificado para devolver una respuesta `304` apropiada:



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    // Comprobar el stat aquí...
    stream.respond({ ':status': 304 });
    return false; // Cancelar la operación de envío
  }
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck });
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    // Comprobar el stat aquí...
    stream.respond({ ':status': 304 });
    return false; // Cancelar la operación de envío
  }
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck });
});
```
:::

El campo de encabezado `content-length` se establecerá automáticamente.

Las opciones `offset` y `length` se pueden usar para limitar la respuesta a un subconjunto de rango específico. Esto se puede usar, por ejemplo, para admitir solicitudes de rango HTTP.

La función `options.onError` también se puede usar para manejar todos los errores que podrían ocurrir antes de que se inicie la entrega del archivo. El comportamiento predeterminado es destruir el stream.

Cuando se establece la opción `options.waitForTrailers`, el evento `'wantTrailers'` se emitirá inmediatamente después de poner en cola el último fragmento de datos de carga útil que se enviará. El método `http2stream.sendTrailers()` se puede usar luego para enviar campos de encabezado finales al par.

Cuando se establece `options.waitForTrailers`, el `Http2Stream` no se cerrará automáticamente cuando se transmita el marco `DATA` final. El código de usuario debe llamar a `http2stream.sendTrailers()` o `http2stream.close()` para cerrar el `Http2Stream`.



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
});
```
:::


### Clase: `Http2Server` {#class-http2server}

**Añadido en: v8.4.0**

- Extiende: [\<net.Server\>](/es/nodejs/api/net#class-netserver)

Las instancias de `Http2Server` se crean utilizando la función `http2.createServer()`. La clase `Http2Server` no se exporta directamente por el módulo `node:http2`.

#### Evento: `'checkContinue'` {#event-checkcontinue}

**Añadido en: v8.5.0**

- `request` [\<http2.Http2ServerRequest\>](/es/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/es/nodejs/api/http2#class-http2http2serverresponse)

Si se registra un listener [`'request'`](/es/nodejs/api/http2#event-request) o [`http2.createServer()`](/es/nodejs/api/http2#http2createserveroptions-onrequesthandler) recibe una función de callback, el evento `'checkContinue'` se emite cada vez que se recibe una solicitud con un HTTP `Expect: 100-continue`. Si este evento no se escucha, el servidor responderá automáticamente con un estado `100 Continue` según corresponda.

El manejo de este evento implica llamar a [`response.writeContinue()`](/es/nodejs/api/http2#responsewritecontinue) si el cliente debe continuar enviando el cuerpo de la solicitud, o generar una respuesta HTTP apropiada (por ejemplo, 400 Bad Request) si el cliente no debe continuar enviando el cuerpo de la solicitud.

Cuando este evento se emite y se maneja, el evento [`'request'`](/es/nodejs/api/http2#event-request) no se emitirá.

#### Evento: `'connection'` {#event-connection}

**Añadido en: v8.4.0**

- `socket` [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)

Este evento se emite cuando se establece un nuevo stream TCP. `socket` es típicamente un objeto de tipo [`net.Socket`](/es/nodejs/api/net#class-netsocket). Por lo general, los usuarios no querrán acceder a este evento.

Este evento también puede ser emitido explícitamente por los usuarios para inyectar conexiones en el servidor HTTP. En ese caso, cualquier stream [`Duplex`](/es/nodejs/api/stream#class-streamduplex) puede ser pasado.

#### Evento: `'request'` {#event-request}

**Añadido en: v8.4.0**

- `request` [\<http2.Http2ServerRequest\>](/es/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/es/nodejs/api/http2#class-http2http2serverresponse)

Emitido cada vez que hay una solicitud. Puede haber múltiples solicitudes por sesión. Vea la [API de Compatibilidad](/es/nodejs/api/http2#compatibility-api).


#### Evento: `'session'` {#event-session}

**Añadido en: v8.4.0**

- `session` [\<ServerHttp2Session\>](/es/nodejs/api/http2#class-serverhttp2session)

El evento `'session'` se emite cuando una nueva `Http2Session` es creada por el `Http2Server`.

#### Evento: `'sessionError'` {#event-sessionerror}

**Añadido en: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `session` [\<ServerHttp2Session\>](/es/nodejs/api/http2#class-serverhttp2session)

El evento `'sessionError'` se emite cuando un evento `'error'` es emitido por un objeto `Http2Session` asociado con el `Http2Server`.

#### Evento: `'stream'` {#event-stream_1}

**Añadido en: v8.4.0**

- `stream` [\<Http2Stream\>](/es/nodejs/api/http2#class-http2stream) Una referencia al flujo
- `headers` [\<Objeto de Cabeceras HTTP/2\>](/es/nodejs/api/http2#headers-object) Un objeto que describe las cabeceras
- `flags` [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type) Las banderas numéricas asociadas
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array que contiene los nombres de las cabeceras sin procesar seguidos por sus respectivos valores.

El evento `'stream'` se emite cuando un evento `'stream'` ha sido emitido por una `Http2Session` asociada con el servidor.

Véase también el evento `'stream'` de [`Http2Session`](/es/nodejs/api/http2#event-stream).

::: code-group
```js [ESM]
import { createServer, constants } from 'node:http2';
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = constants;

const server = createServer();
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```

```js [CJS]
const http2 = require('node:http2');
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = http2.constants;

const server = http2.createServer();
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```
:::


#### Evento: `'timeout'` {#event-timeout_2}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.0.0 | El tiempo de espera predeterminado cambió de 120s a 0 (sin tiempo de espera). |
| v8.4.0 | Añadido en: v8.4.0 |
:::

El evento `'timeout'` se emite cuando no hay actividad en el Servidor durante un número determinado de milisegundos establecido mediante `http2server.setTimeout()`. **Predeterminado:** 0 (sin tiempo de espera)

#### `server.close([callback])` {#serverclosecallback}

**Añadido en: v8.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Impide que el servidor establezca nuevas sesiones. Esto no evita que se creen nuevos flujos de solicitud debido a la naturaleza persistente de las sesiones HTTP/2. Para cerrar el servidor correctamente, llame a [`http2session.close()`](/es/nodejs/api/http2#http2sessionclosecallback) en todas las sesiones activas.

Si se proporciona `callback`, no se invoca hasta que todas las sesiones activas se hayan cerrado, aunque el servidor ya haya dejado de permitir nuevas sesiones. Consulte [`net.Server.close()`](/es/nodejs/api/net#serverclosecallback) para obtener más detalles.

#### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Añadido en: v20.4.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Llama a [`server.close()`](/es/nodejs/api/http2#serverclosecallback) y devuelve una promesa que se cumple cuando el servidor se ha cerrado.

#### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una callback inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v13.0.0 | El tiempo de espera predeterminado cambió de 120s a 0 (sin tiempo de espera). |
| v8.4.0 | Añadido en: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** 0 (sin tiempo de espera)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<Http2Server\>](/es/nodejs/api/http2#class-http2server)

Se utiliza para establecer el valor de tiempo de espera para las solicitudes del servidor http2, y establece una función de callback que se llama cuando no hay actividad en el `Http2Server` después de `msecs` milisegundos.

La callback dada se registra como un listener en el evento `'timeout'`.

En caso de que `callback` no sea una función, se lanzará un nuevo error `ERR_INVALID_ARG_TYPE`.


#### `server.timeout` {#servertimeout}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v13.0.0 | El timeout predeterminado cambió de 120s a 0 (sin timeout). |
| v8.4.0 | Añadido en: v8.4.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Timeout en milisegundos. **Predeterminado:** 0 (sin timeout)

El número de milisegundos de inactividad antes de que se asuma que un socket ha excedido el tiempo de espera.

Un valor de `0` deshabilitará el comportamiento de timeout en las conexiones entrantes.

La lógica de timeout del socket se configura en la conexión, por lo que cambiar este valor solo afecta a las nuevas conexiones al servidor, no a las conexiones existentes.

#### `server.updateSettings([settings])` {#serverupdatesettingssettings}

**Añadido en: v15.1.0, v14.17.0**

- `settings` [\<Objeto de configuración HTTP/2\>](/es/nodejs/api/http2#settings-object)

Se utiliza para actualizar el servidor con la configuración proporcionada.

Lanza `ERR_HTTP2_INVALID_SETTING_VALUE` para valores de `settings` no válidos.

Lanza `ERR_INVALID_ARG_TYPE` para un argumento `settings` no válido.

### Clase: `Http2SecureServer` {#class-http2secureserver}

**Añadido en: v8.4.0**

- Extiende: [\<tls.Server\>](/es/nodejs/api/tls#class-tlsserver)

Las instancias de `Http2SecureServer` se crean utilizando la función `http2.createSecureServer()`. La clase `Http2SecureServer` no se exporta directamente mediante el módulo `node:http2`.

#### Evento: `'checkContinue'` {#event-checkcontinue_1}

**Añadido en: v8.5.0**

- `request` [\<http2.Http2ServerRequest\>](/es/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/es/nodejs/api/http2#class-http2http2serverresponse)

Si se registra un listener de [`'request'`](/es/nodejs/api/http2#event-request) o [`http2.createSecureServer()`](/es/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) recibe una función de callback, el evento `'checkContinue'` se emite cada vez que se recibe una solicitud con un `Expect: 100-continue` HTTP. Si no se escucha este evento, el servidor responderá automáticamente con un estado `100 Continue` según corresponda.

Manejar este evento implica llamar a [`response.writeContinue()`](/es/nodejs/api/http2#responsewritecontinue) si el cliente debe continuar enviando el cuerpo de la solicitud, o generar una respuesta HTTP apropiada (por ejemplo, 400 Bad Request) si el cliente no debe continuar enviando el cuerpo de la solicitud.

Cuando este evento se emite y se maneja, el evento [`'request'`](/es/nodejs/api/http2#event-request) no se emitirá.


#### Event: `'connection'` {#event-connection_1}

**Agregado en: v8.4.0**

- `socket` [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)

Este evento se emite cuando se establece un nuevo flujo TCP, antes de que comience el handshake TLS. `socket` es típicamente un objeto de tipo [`net.Socket`](/es/nodejs/api/net#class-netsocket). Por lo general, los usuarios no querrán acceder a este evento.

Este evento también puede ser emitido explícitamente por los usuarios para inyectar conexiones en el servidor HTTP. En ese caso, cualquier flujo [`Duplex`](/es/nodejs/api/stream#class-streamduplex) puede ser pasado.

#### Event: `'request'` {#event-request_1}

**Agregado en: v8.4.0**

- `request` [\<http2.Http2ServerRequest\>](/es/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/es/nodejs/api/http2#class-http2http2serverresponse)

Emitido cada vez que hay una solicitud. Puede haber múltiples solicitudes por sesión. Véase la [API de Compatibilidad](/es/nodejs/api/http2#compatibility-api).

#### Event: `'session'` {#event-session_1}

**Agregado en: v8.4.0**

- `session` [\<ServerHttp2Session\>](/es/nodejs/api/http2#class-serverhttp2session)

El evento `'session'` se emite cuando un nuevo `Http2Session` es creado por el `Http2SecureServer`.

#### Event: `'sessionError'` {#event-sessionerror_1}

**Agregado en: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `session` [\<ServerHttp2Session\>](/es/nodejs/api/http2#class-serverhttp2session)

El evento `'sessionError'` se emite cuando un evento `'error'` es emitido por un objeto `Http2Session` asociado con el `Http2SecureServer`.

#### Event: `'stream'` {#event-stream_2}

**Agregado en: v8.4.0**

- `stream` [\<Http2Stream\>](/es/nodejs/api/http2#class-http2stream) Una referencia al flujo
- `headers` [\<HTTP/2 Headers Object\>](/es/nodejs/api/http2#headers-object) Un objeto que describe las cabeceras
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Los flags numéricos asociados
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array que contiene los nombres de las cabeceras sin procesar seguidos por sus respectivos valores.

El evento `'stream'` se emite cuando un evento `'stream'` ha sido emitido por un `Http2Session` asociado con el servidor.

Véase también el evento `'stream'` de [`Http2Session`](/es/nodejs/api/http2#event-stream).



::: code-group
```js [ESM]
import { createSecureServer, constants } from 'node:http2';
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = constants;

const options = getOptionsSomehow();

const server = createSecureServer(options);
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```

```js [CJS]
const http2 = require('node:http2');
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = http2.constants;

const options = getOptionsSomehow();

const server = http2.createSecureServer(options);
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```
:::


#### Evento: `'timeout'` {#event-timeout_3}

**Agregado en: v8.4.0**

El evento `'timeout'` se emite cuando no hay actividad en el Servidor durante un número determinado de milisegundos establecido usando `http2secureServer.setTimeout()`. **Predeterminado:** 2 minutos.

#### Evento: `'unknownProtocol'` {#event-unknownprotocol}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este evento solo se emitirá si el cliente no transmitió una extensión ALPN durante el protocolo de enlace TLS. |
| v8.4.0 | Agregado en: v8.4.0 |
:::

- `socket` [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)

El evento `'unknownProtocol'` se emite cuando un cliente que se conecta no puede negociar un protocolo permitido (es decir, HTTP/2 o HTTP/1.1). El controlador de eventos recibe el socket para su manejo. Si no hay un listener registrado para este evento, la conexión finaliza. Se puede especificar un timeout utilizando la opción `'unknownProtocolTimeout'` pasada a [`http2.createSecureServer()`](/es/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler).

En versiones anteriores de Node.js, este evento se emitía si `allowHTTP1` es `false` y, durante el protocolo de enlace TLS, el cliente no envía una extensión ALPN o envía una extensión ALPN que no incluye HTTP/2 (`h2`). Las versiones más nuevas de Node.js solo emiten este evento si `allowHTTP1` es `false` y el cliente no envía una extensión ALPN. Si el cliente envía una extensión ALPN que no incluye HTTP/2 (o HTTP/1.1 si `allowHTTP1` es `true`), el protocolo de enlace TLS fallará y no se establecerá ninguna conexión segura.

Consulta la [API de compatibilidad](/es/nodejs/api/http2#compatibility-api).

#### `server.close([callback])` {#serverclosecallback_1}

**Agregado en: v8.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Impide que el servidor establezca nuevas sesiones. Esto no evita que se creen nuevos streams de solicitud debido a la naturaleza persistente de las sesiones HTTP/2. Para cerrar correctamente el servidor, llama a [`http2session.close()`](/es/nodejs/api/http2#http2sessionclosecallback) en todas las sesiones activas.

Si se proporciona `callback`, no se invoca hasta que se hayan cerrado todas las sesiones activas, aunque el servidor ya haya dejado de permitir nuevas sesiones. Consulta [`tls.Server.close()`](/es/nodejs/api/tls#serverclosecallback) para obtener más detalles.


#### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback_1}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una callback inválida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Añadido en: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `120000` (2 minutos)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<Http2SecureServer\>](/es/nodejs/api/http2#class-http2secureserver)

Se utiliza para establecer el valor de tiempo de espera para las solicitudes de servidor seguro http2 y establece una función de callback que se llama cuando no hay actividad en el `Http2SecureServer` después de `msecs` milisegundos.

La callback dada se registra como un listener en el evento `'timeout'`.

En caso de que `callback` no sea una función, se lanzará un nuevo error `ERR_INVALID_ARG_TYPE`.

#### `server.timeout` {#servertimeout_1}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.0.0 | El tiempo de espera predeterminado cambió de 120s a 0 (sin tiempo de espera). |
| v8.4.0 | Añadido en: v8.4.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tiempo de espera en milisegundos. **Predeterminado:** 0 (sin tiempo de espera)

El número de milisegundos de inactividad antes de que se asuma que un socket ha excedido el tiempo de espera.

Un valor de `0` desactivará el comportamiento de tiempo de espera en las conexiones entrantes.

La lógica de tiempo de espera del socket se configura en la conexión, por lo que cambiar este valor solo afecta a las nuevas conexiones al servidor, no a las conexiones existentes.

#### `server.updateSettings([settings])` {#serverupdatesettingssettings_1}

**Añadido en: v15.1.0, v14.17.0**

- `settings` [\<Objeto de Configuración HTTP/2\>](/es/nodejs/api/http2#settings-object)

Se utiliza para actualizar el servidor con la configuración proporcionada.

Lanza `ERR_HTTP2_INVALID_SETTING_VALUE` para valores de `settings` no válidos.

Lanza `ERR_INVALID_ARG_TYPE` para un argumento `settings` no válido.

### `http2.createServer([options][, onRequestHandler])` {#http2createserveroptions-onrequesthandler}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Se añadieron `streamResetBurst` y `streamResetRate`. |
| v13.0.0 | `PADDING_STRATEGY_CALLBACK` se ha hecho equivalente a proporcionar `PADDING_STRATEGY_ALIGNED` y `selectPadding` se ha eliminado. |
| v13.3.0, v12.16.0 | Se añadió la opción `maxSessionRejectedStreams` con un valor predeterminado de 100. |
| v13.3.0, v12.16.0 | Se añadió la opción `maxSessionInvalidFrames` con un valor predeterminado de 1000. |
| v12.4.0 | El parámetro `options` ahora admite las opciones de `net.createServer()`. |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | Se añadió la opción `unknownProtocolTimeout` con un valor predeterminado de 10000. |
| v14.4.0, v12.18.0, v10.21.0 | Se añadió la opción `maxSettings` con un valor predeterminado de 32. |
| v9.6.0 | Se añadió la opción `Http1IncomingMessage` y `Http1ServerResponse`. |
| v8.9.3 | Se añadió la opción `maxOutstandingPings` con un límite predeterminado de 10. |
| v8.9.3 | Se añadió la opción `maxHeaderListPairs` con un límite predeterminado de 128 pares de headers. |
| v8.4.0 | Añadido en: v8.4.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el tamaño máximo de la tabla dinámica para desinflar los campos de header. **Predeterminado:** `4Kib`.
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el número máximo de entradas de configuración por frame `SETTINGS`. El valor mínimo permitido es `1`. **Predeterminado:** `32`.
    - `maxSessionMemory`[\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece la memoria máxima que se permite utilizar a la `Http2Session`. El valor se expresa en términos de número de megabytes, p. ej. `1` equivale a 1 megabyte. El valor mínimo permitido es `1`. Este es un límite basado en crédito, las `Http2Stream` existentes pueden hacer que se exceda este límite, pero las nuevas instancias de `Http2Stream` serán rechazadas mientras se exceda este límite. El número actual de sesiones de `Http2Stream`, el uso actual de memoria de las tablas de compresión de header, los datos actuales en cola para ser enviados y los frames `PING` y `SETTINGS` no reconocidos se cuentan para el límite actual. **Predeterminado:** `10`.
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el número máximo de entradas de header. Esto es similar a [`server.maxHeadersCount`](/es/nodejs/api/http#servermaxheaderscount) o [`request.maxHeadersCount`](/es/nodejs/api/http#requestmaxheaderscount) en el módulo `node:http`. El valor mínimo es `4`. **Predeterminado:** `128`.
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el número máximo de pings pendientes, no reconocidos. **Predeterminado:** `10`.
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el tamaño máximo permitido para un bloque serializado y comprimido de headers. Los intentos de enviar headers que excedan este límite resultarán en la emisión de un evento `'frameError'` y el stream se cerrará y destruirá. Si bien esto establece el tamaño máximo permitido para todo el bloque de headers, `nghttp2` (la biblioteca interna http2) tiene un límite de `65536` para cada par clave/valor descomprimido.
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La estrategia utilizada para determinar la cantidad de padding a utilizar para los frames `HEADERS` y `DATA`. **Predeterminado:** `http2.constants.PADDING_STRATEGY_NONE`. El valor puede ser uno de:
        - `http2.constants.PADDING_STRATEGY_NONE`: No se aplica ningún padding.
        - `http2.constants.PADDING_STRATEGY_MAX`: Se aplica la cantidad máxima de padding, determinada por la implementación interna.
        - `http2.constants.PADDING_STRATEGY_ALIGNED`: Intenta aplicar suficiente padding para asegurar que la longitud total del frame, incluido el header de 9 bytes, sea un múltiplo de 8. Para cada frame, hay un número máximo permitido de bytes de padding que se determina por el estado y la configuración actuales del control de flujo. Si este máximo es menor que la cantidad calculada necesaria para asegurar la alineación, se utiliza el máximo y la longitud total del frame no está necesariamente alineada a 8 bytes.

    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el número máximo de streams concurrentes para el peer remoto como si se hubiera recibido un frame `SETTINGS`. Se sobrescribirá si el peer remoto establece su propio valor para `maxConcurrentStreams`. **Predeterminado:** `100`.
    - `maxSessionInvalidFrames` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el número máximo de frames no válidos que se tolerarán antes de que se cierre la sesión. **Predeterminado:** `1000`.
    - `maxSessionRejectedStreams` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el número máximo de streams rechazados en la creación que se tolerarán antes de que se cierre la sesión. Cada rechazo está asociado con un error `NGHTTP2_ENHANCE_YOUR_CALM` que debería indicar al peer que no abra más streams, por lo tanto, continuar abriendo streams se considera una señal de un peer que se comporta mal. **Predeterminado:** `100`.
    - `settings` [\<Objeto de Configuración HTTP/2\>](/es/nodejs/api/http2#settings-object) La configuración inicial para enviar al peer remoto al conectar.
    - `streamResetBurst` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) y `streamResetRate` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el límite de velocidad para el restablecimiento de stream entrante (frame RST_STREAM). Ambas configuraciones deben establecerse para tener algún efecto y, por defecto, son 1000 y 33 respectivamente.
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) La array de valores enteros determina los tipos de configuración, que se incluyen en la propiedad `CustomSettings` de los `remoteSettings` recibidos. Consulte la propiedad `CustomSettings` del objeto `Http2Settings` para obtener más información sobre los tipos de configuración permitidos.
    - `Http1IncomingMessage` [\<http.IncomingMessage\>](/es/nodejs/api/http#class-httpincomingmessage) Especifica la clase `IncomingMessage` que se utilizará para el fallback de HTTP/1. Útil para extender el `http.IncomingMessage` original. **Predeterminado:** `http.IncomingMessage`.
    - `Http1ServerResponse` [\<http.ServerResponse\>](/es/nodejs/api/http#class-httpserverresponse) Especifica la clase `ServerResponse` que se utilizará para el fallback de HTTP/1. Útil para extender el `http.ServerResponse` original. **Predeterminado:** `http.ServerResponse`.
    - `Http2ServerRequest` [\<http2.Http2ServerRequest\>](/es/nodejs/api/http2#class-http2http2serverrequest) Especifica la clase `Http2ServerRequest` que se utilizará. Útil para extender el `Http2ServerRequest` original. **Predeterminado:** `Http2ServerRequest`.
    - `Http2ServerResponse` [\<http2.Http2ServerResponse\>](/es/nodejs/api/http2#class-http2http2serverresponse) Especifica la clase `Http2ServerResponse` que se utilizará. Útil para extender el `Http2ServerResponse` original. **Predeterminado:** `Http2ServerResponse`.
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica un tiempo de espera en milisegundos que un servidor debe esperar cuando se emite un [`'unknownProtocol'`](/es/nodejs/api/http2#event-unknownprotocol). Si el socket no ha sido destruido para ese momento, el servidor lo destruirá. **Predeterminado:** `10000`.
    - ...: Se puede proporcionar cualquier opción de [`net.createServer()`](/es/nodejs/api/net#netcreateserveroptions-connectionlistener).

- `onRequestHandler` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Véase [API de compatibilidad](/es/nodejs/api/http2#compatibility-api)
- Devuelve: [\<Http2Server\>](/es/nodejs/api/http2#class-http2server)

Devuelve una instancia de `net.Server` que crea y gestiona instancias de `Http2Session`.

Dado que no se conocen navegadores que admitan [HTTP/2 no cifrado](https://http2.github.io/faq/#does-http2-require-encryption), el uso de [`http2.createSecureServer()`](/es/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) es necesario cuando se comunica con clientes de navegador.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

// Crear un servidor HTTP/2 no cifrado.
// Dado que no se conocen navegadores que admitan
// HTTP/2 no cifrado, el uso de `createSecureServer()`
// es necesario cuando se comunica con clientes de navegador.
const server = createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```

```js [CJS]
const http2 = require('node:http2');

// Crear un servidor HTTP/2 no cifrado.
// Dado que no se conocen navegadores que admitan
// HTTP/2 no cifrado, el uso de `http2.createSecureServer()`
// es necesario cuando se comunica con clientes de navegador.
const server = http2.createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```
:::


### `http2.createSecureServer(options[, onRequestHandler])` {#http2createsecureserveroptions-onrequesthandler}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.0.0 | `PADDING_STRATEGY_CALLBACK` se ha hecho equivalente a proporcionar `PADDING_STRATEGY_ALIGNED` y se ha eliminado `selectPadding`. |
| v13.3.0, v12.16.0 | Se añadió la opción `maxSessionRejectedStreams` con un valor predeterminado de 100. |
| v13.3.0, v12.16.0 | Se añadió la opción `maxSessionInvalidFrames` con un valor predeterminado de 1000. |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | Se añadió la opción `unknownProtocolTimeout` con un valor predeterminado de 10000. |
| v14.4.0, v12.18.0, v10.21.0 | Se añadió la opción `maxSettings` con un valor predeterminado de 32. |
| v10.12.0 | Se añadió la opción `origins` para enviar automáticamente un marco `ORIGIN` al inicio de `Http2Session`. |
| v8.9.3 | Se añadió la opción `maxOutstandingPings` con un límite predeterminado de 10. |
| v8.9.3 | Se añadió la opción `maxHeaderListPairs` con un límite predeterminado de 128 pares de encabezado. |
| v8.4.0 | Añadido en: v8.4.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHTTP1` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Las conexiones de cliente entrantes que no admiten HTTP/2 se degradarán a HTTP/1.x cuando se establezca en `true`. Consulte el evento [`'unknownProtocol'`](/es/nodejs/api/http2#event-unknownprotocol). Consulte [negociación ALPN](/es/nodejs/api/http2#alpn-negotiation). **Predeterminado:** `false`.
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el tamaño máximo de tabla dinámica para desinflar campos de encabezado. **Predeterminado:** `4Kib`.
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el número máximo de entradas de configuración por marco `SETTINGS`. El valor mínimo permitido es `1`. **Predeterminado:** `32`.
    - `maxSessionMemory`[\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece la memoria máxima que se permite usar a la `Http2Session`. El valor se expresa en términos de número de megabytes, p. ej., `1` equivale a 1 megabyte. El valor mínimo permitido es `1`. Este es un límite basado en créditos; las `Http2Stream` existentes pueden hacer que se exceda este límite, pero las nuevas instancias de `Http2Stream` se rechazarán mientras se exceda este límite. El número actual de sesiones de `Http2Stream`, el uso actual de memoria de las tablas de compresión de encabezado, los datos actuales en cola para ser enviados y los marcos `PING` y `SETTINGS` no reconocidos se cuentan para el límite actual. **Predeterminado:** `10`.
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el número máximo de entradas de encabezado. Esto es similar a [`server.maxHeadersCount`](/es/nodejs/api/http#servermaxheaderscount) o [`request.maxHeadersCount`](/es/nodejs/api/http#requestmaxheaderscount) en el módulo `node:http`. El valor mínimo es `4`. **Predeterminado:** `128`.
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el número máximo de pings pendientes no reconocidos. **Predeterminado:** `10`.
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el tamaño máximo permitido para un bloque serializado y comprimido de encabezados. Los intentos de enviar encabezados que excedan este límite provocarán que se emita un evento `'frameError'` y que el stream se cierre y destruya.
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Estrategia utilizada para determinar la cantidad de relleno a utilizar para los marcos `HEADERS` y `DATA`. **Predeterminado:** `http2.constants.PADDING_STRATEGY_NONE`. El valor puede ser uno de los siguientes:
    - `http2.constants.PADDING_STRATEGY_NONE`: No se aplica ningún relleno.
    - `http2.constants.PADDING_STRATEGY_MAX`: Se aplica la cantidad máxima de relleno, determinada por la implementación interna.
    - `http2.constants.PADDING_STRATEGY_ALIGNED`: Intenta aplicar suficiente relleno para garantizar que la longitud total del marco, incluido el encabezado de 9 bytes, sea un múltiplo de 8. Para cada marco, existe un número máximo permitido de bytes de relleno que se determina por el estado y la configuración actuales del control de flujo. Si este máximo es menor que la cantidad calculada necesaria para garantizar la alineación, se utiliza el máximo y la longitud total del marco no se alinea necesariamente a 8 bytes.


    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el número máximo de streams simultáneos para el peer remoto como si se hubiera recibido un marco `SETTINGS`. Se anulará si el peer remoto establece su propio valor para `maxConcurrentStreams`. **Predeterminado:** `100`.
    - `maxSessionInvalidFrames` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el número máximo de marcos no válidos que se tolerarán antes de que se cierre la sesión. **Predeterminado:** `1000`.
    - `maxSessionRejectedStreams` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el número máximo de streams rechazados al crearse que se tolerarán antes de que se cierre la sesión. Cada rechazo se asocia con un error `NGHTTP2_ENHANCE_YOUR_CALM` que debería indicar al peer que no abra más streams; por lo tanto, continuar abriendo streams se considera un signo de un peer que se comporta mal. **Predeterminado:** `100`.
    - `settings` [\<Objeto de configuración HTTP/2\>](/es/nodejs/api/http2#settings-object) La configuración inicial para enviar al peer remoto al establecer la conexión.
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) La matriz de valores enteros determina los tipos de configuración, que se incluyen en la propiedad `customSettings` de la configuración remota recibida. Consulte la propiedad `customSettings` del objeto `Http2Settings` para obtener más información sobre los tipos de configuración permitidos.
    - ...: Se pueden proporcionar todas las opciones de [`tls.createServer()`](/es/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener). Para los servidores, las opciones de identidad (`pfx` o `key`/`cert`) generalmente son necesarias.
    - `origins` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una matriz de cadenas de origen para enviar dentro de un marco `ORIGIN` inmediatamente después de la creación de un nuevo `Http2Session` de servidor.
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica un tiempo de espera en milisegundos que un servidor debe esperar cuando se emite un evento [`'unknownProtocol'`](/es/nodejs/api/http2#event-unknownprotocol). Si el socket no ha sido destruido para ese momento, el servidor lo destruirá. **Predeterminado:** `10000`.


- `onRequestHandler` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Consulte [API de compatibilidad](/es/nodejs/api/http2#compatibility-api)
- Devuelve: [\<Http2SecureServer\>](/es/nodejs/api/http2#class-http2secureserver)

Devuelve una instancia de `tls.Server` que crea y gestiona instancias de `Http2Session`.



::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),
};

// Create a secure HTTP/2 server
const server = createSecureServer(options);

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const options = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem'),
};

// Create a secure HTTP/2 server
const server = http2.createSecureServer(options);

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```
:::


### `http2.connect(authority[, options][, listener])` {#http2connectauthority-options-listener}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.0.0 | `PADDING_STRATEGY_CALLBACK` se ha hecho equivalente a proporcionar `PADDING_STRATEGY_ALIGNED` y `selectPadding` se ha eliminado. |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | Se agregó la opción `unknownProtocolTimeout` con un valor predeterminado de 10000. |
| v14.4.0, v12.18.0, v10.21.0 | Se agregó la opción `maxSettings` con un valor predeterminado de 32. |
| v8.9.3 | Se agregó la opción `maxOutstandingPings` con un límite predeterminado de 10. |
| v8.9.3 | Se agregó la opción `maxHeaderListPairs` con un límite predeterminado de 128 pares de encabezado. |
| v8.4.0 | Agregado en: v8.4.0 |
:::

- `authority` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) El servidor HTTP/2 remoto al que conectarse. Esto debe tener la forma de una URL mínima y válida con el prefijo `http://` o `https://`, el nombre de host y el puerto IP (si se usa un puerto no predeterminado). La información del usuario (ID de usuario y contraseña), la ruta, la cadena de consulta y los detalles del fragmento en la URL se ignorarán.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el tamaño máximo de la tabla dinámica para desinflar los campos de encabezado. **Predeterminado:** `4Kib`.
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el número máximo de entradas de configuración por fotograma `SETTINGS`. El valor mínimo permitido es `1`. **Predeterminado:** `32`.
    - `maxSessionMemory` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece la memoria máxima que se permite usar a la `Http2Session`. El valor se expresa en términos de número de megabytes, p. ej., `1` equivale a 1 megabyte. El valor mínimo permitido es `1`. Este es un límite basado en créditos, las `Http2Stream` existentes pueden provocar que se exceda este límite, pero las nuevas instancias de `Http2Stream` se rechazarán mientras se exceda este límite. El número actual de sesiones de `Http2Stream`, el uso actual de memoria de las tablas de compresión de encabezados, los datos actuales en cola para ser enviados y los fotogramas `PING` y `SETTINGS` no reconocidos se cuentan para el límite actual. **Predeterminado:** `10`.
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el número máximo de entradas de encabezado. Esto es similar a [`server.maxHeadersCount`](/es/nodejs/api/http#servermaxheaderscount) o [`request.maxHeadersCount`](/es/nodejs/api/http#requestmaxheaderscount) en el módulo `node:http`. El valor mínimo es `1`. **Predeterminado:** `128`.
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el número máximo de pings pendientes, no reconocidos. **Predeterminado:** `10`.
    - `maxReservedRemoteStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el número máximo de transmisiones push reservadas que el cliente aceptará en un momento dado. Una vez que el número actual de transmisiones push reservadas actualmente excede este límite, las nuevas transmisiones push enviadas por el servidor se rechazarán automáticamente. El valor mínimo permitido es 0. El valor máximo permitido es 2-1. Un valor negativo establece esta opción en el valor máximo permitido. **Predeterminado:** `200`.
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el tamaño máximo permitido para un bloque de encabezados serializado y comprimido. Los intentos de enviar encabezados que excedan este límite provocarán que se emita un evento `'frameError'` y que la transmisión se cierre y destruya.
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Estrategia utilizada para determinar la cantidad de relleno a utilizar para los fotogramas `HEADERS` y `DATA`. **Predeterminado:** `http2.constants.PADDING_STRATEGY_NONE`. El valor puede ser uno de:
    - `http2.constants.PADDING_STRATEGY_NONE`: No se aplica ningún relleno.
    - `http2.constants.PADDING_STRATEGY_MAX`: Se aplica la cantidad máxima de relleno, determinada por la implementación interna.
    - `http2.constants.PADDING_STRATEGY_ALIGNED`: Intenta aplicar suficiente relleno para asegurar que la longitud total del fotograma, incluyendo la cabecera de 9 bytes, sea un múltiplo de 8. Para cada fotograma, hay un número máximo permitido de bytes de relleno que está determinado por el estado actual de control de flujo y la configuración. Si este máximo es menor que la cantidad calculada necesaria para asegurar la alineación, se utiliza el máximo y la longitud total del fotograma no está necesariamente alineada a 8 bytes.


    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el número máximo de transmisiones simultáneas para el par remoto como si se hubiera recibido un fotograma `SETTINGS`. Se anulará si el par remoto establece su propio valor para `maxConcurrentStreams`. **Predeterminado:** `100`.
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El protocolo para conectarse, si no se establece en la `authority`. El valor puede ser `'http:'` o `'https:'`. **Predeterminado:** `'https:'`
    - `settings` [\<Objeto de configuración HTTP/2\>](/es/nodejs/api/http2#settings-object) La configuración inicial para enviar al par remoto al conectarse.
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) La matriz de valores enteros determina los tipos de configuración, que se incluyen en la propiedad `CustomSettings` de las remoteSettings recibidas. Consulte la propiedad `CustomSettings` del objeto `Http2Settings` para obtener más información sobre los tipos de configuración permitidos.
    - `createConnection` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una devolución de llamada opcional que recibe la instancia `URL` pasada a `connect` y el objeto `options`, y devuelve cualquier flujo [`Duplex`](/es/nodejs/api/stream#class-streamduplex) que se utilizará como la conexión para esta sesión.
    - ...: Se pueden proporcionar las opciones [`net.connect()`](/es/nodejs/api/net#netconnect) o [`tls.connect()`](/es/nodejs/api/tls#tlsconnectoptions-callback).
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica un tiempo de espera en milisegundos que un servidor debe esperar cuando se emite un evento [`'unknownProtocol'`](/es/nodejs/api/http2#event-unknownprotocol). Si el socket no ha sido destruido para entonces, el servidor lo destruirá. **Predeterminado:** `10000`.


- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se registrará como un listener único del evento [`'connect'`](/es/nodejs/api/http2#event-connect).
- Devuelve: [\<ClientHttp2Session\>](/es/nodejs/api/http2#class-clienthttp2session)

Devuelve una instancia de `ClientHttp2Session`.

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://localhost:1234');

/* Use the client */

client.close();
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://localhost:1234');

/* Use the client */

client.close();
```
:::


### `http2.constants` {#http2constants}

**Agregado en: v8.4.0**

#### Códigos de error para `RST_STREAM` y `GOAWAY` {#error-codes-for-rst_stream-and-goaway}

| Valor | Nombre | Constante |
| --- | --- | --- |
| `0x00` | Sin error | `http2.constants.NGHTTP2_NO_ERROR` |
| `0x01` | Error de protocolo | `http2.constants.NGHTTP2_PROTOCOL_ERROR` |
| `0x02` | Error interno | `http2.constants.NGHTTP2_INTERNAL_ERROR` |
| `0x03` | Error de control de flujo | `http2.constants.NGHTTP2_FLOW_CONTROL_ERROR` |
| `0x04` | Tiempo de espera de configuración | `http2.constants.NGHTTP2_SETTINGS_TIMEOUT` |
| `0x05` | Flujo cerrado | `http2.constants.NGHTTP2_STREAM_CLOSED` |
| `0x06` | Error de tamaño de fotograma | `http2.constants.NGHTTP2_FRAME_SIZE_ERROR` |
| `0x07` | Flujo rechazado | `http2.constants.NGHTTP2_REFUSED_STREAM` |
| `0x08` | Cancelar | `http2.constants.NGHTTP2_CANCEL` |
| `0x09` | Error de compresión | `http2.constants.NGHTTP2_COMPRESSION_ERROR` |
| `0x0a` | Error de conexión | `http2.constants.NGHTTP2_CONNECT_ERROR` |
| `0x0b` | Modera tu calma | `http2.constants.NGHTTP2_ENHANCE_YOUR_CALM` |
| `0x0c` | Seguridad inadecuada | `http2.constants.NGHTTP2_INADEQUATE_SECURITY` |
| `0x0d` | HTTP/1.1 requerido | `http2.constants.NGHTTP2_HTTP_1_1_REQUIRED` |
El evento `'timeout'` se emite cuando no hay actividad en el Servidor durante un número determinado de milisegundos establecidos mediante `http2server.setTimeout()`.

### `http2.getDefaultSettings()` {#http2getdefaultsettings}

**Agregado en: v8.4.0**

- Devuelve: [\<Objeto de configuración HTTP/2\>](/es/nodejs/api/http2#settings-object)

Devuelve un objeto que contiene la configuración predeterminada para una instancia de `Http2Session`. Este método devuelve una nueva instancia de objeto cada vez que se llama, por lo que las instancias devueltas se pueden modificar de forma segura para su uso.

### `http2.getPackedSettings([settings])` {#http2getpackedsettingssettings}

**Agregado en: v8.4.0**

- `settings` [\<Objeto de configuración HTTP/2\>](/es/nodejs/api/http2#settings-object)
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Devuelve una instancia de `Buffer` que contiene la representación serializada de la configuración HTTP/2 dada, como se especifica en la especificación [HTTP/2](https://tools.ietf.org/html/rfc7540). Esto está destinado a ser utilizado con el campo de encabezado `HTTP2-Settings`.

::: code-group
```js [ESM]
import { getPackedSettings } from 'node:http2';

const packed = getPackedSettings({ enablePush: false });

console.log(packed.toString('base64'));
// Prints: AAIAAAAA
```

```js [CJS]
const http2 = require('node:http2');

const packed = http2.getPackedSettings({ enablePush: false });

console.log(packed.toString('base64'));
// Prints: AAIAAAAA
```
:::


### `http2.getUnpackedSettings(buf)` {#http2getunpackedsettingsbuf}

**Agregado en: v8.4.0**

- `buf` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) La configuración empaquetada.
- Devuelve: [\<Objeto de Configuración HTTP/2\>](/es/nodejs/api/http2#settings-object)

Devuelve un [Objeto de Configuración HTTP/2](/es/nodejs/api/http2#settings-object) que contiene la configuración deserializada del `Buffer` dado, tal como lo generó `http2.getPackedSettings()`.

### `http2.performServerHandshake(socket[, options])` {#http2performserverhandshakesocket-options}

**Agregado en: v21.7.0, v20.12.0**

- `socket` [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - ...: Se puede proporcionar cualquier opción de [`http2.createServer()`](/es/nodejs/api/http2#http2createserveroptions-onrequesthandler).


- Devuelve: [\<ServerHttp2Session\>](/es/nodejs/api/http2#class-serverhttp2session)

Crea una sesión de servidor HTTP/2 a partir de un socket existente.

### `http2.sensitiveHeaders` {#http2sensitiveheaders}

**Agregado en: v15.0.0, v14.18.0**

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)

Este símbolo se puede establecer como una propiedad en el objeto de encabezados HTTP/2 con un valor de matriz para proporcionar una lista de encabezados considerados confidenciales. Consulte [Encabezados confidenciales](/es/nodejs/api/http2#sensitive-headers) para obtener más detalles.

### Objeto de encabezados {#headers-object}

Los encabezados se representan como propiedades propias en objetos JavaScript. Las claves de propiedad se serializarán en minúsculas. Los valores de las propiedades deben ser cadenas (si no lo son, se convertirán en cadenas) o una `Array` de cadenas (para enviar más de un valor por campo de encabezado).

```js [ESM]
const headers = {
  ':status': '200',
  'content-type': 'text-plain',
  'ABC': ['has', 'more', 'than', 'one', 'value'],
};

stream.respond(headers);
```
Los objetos de encabezado pasados a las funciones de devolución de llamada tendrán un prototipo `null`. Esto significa que los métodos normales de objetos JavaScript como `Object.prototype.toString()` y `Object.prototype.hasOwnProperty()` no funcionarán.

Para los encabezados entrantes:

- El encabezado `:status` se convierte en `number`.
- Los duplicados de `:status`, `:method`, `:authority`, `:scheme`, `:path`, `:protocol`, `age`, `authorization`, `access-control-allow-credentials`, `access-control-max-age`, `access-control-request-method`, `content-encoding`, `content-language`, `content-length`, `content-location`, `content-md5`, `content-range`, `content-type`, `date`, `dnt`, `etag`, `expires`, `from`, `host`, `if-match`, `if-modified-since`, `if-none-match`, `if-range`, `if-unmodified-since`, `last-modified`, `location`, `max-forwards`, `proxy-authorization`, `range`, `referer`,`retry-after`, `tk`, `upgrade-insecure-requests`, `user-agent` o `x-content-type-options` se descartan.
- `set-cookie` es siempre una matriz. Los duplicados se agregan a la matriz.
- Para encabezados `cookie` duplicados, los valores se unen con '; '.
- Para todos los demás encabezados, los valores se unen con ', '.



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream, headers) => {
  console.log(headers[':path']);
  console.log(headers.ABC);
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream, headers) => {
  console.log(headers[':path']);
  console.log(headers.ABC);
});
```
:::


#### Encabezados sensibles {#sensitive-headers}

Los encabezados HTTP2 se pueden marcar como sensibles, lo que significa que el algoritmo de compresión de encabezados HTTP/2 nunca los indexará. Esto puede tener sentido para los valores de encabezado con baja entropía y que pueden considerarse valiosos para un atacante, por ejemplo, `Cookie` o `Authorization`. Para lograr esto, agregue el nombre del encabezado a la propiedad `[http2.sensitiveHeaders]` como un array:

```js [ESM]
const headers = {
  ':status': '200',
  'content-type': 'text-plain',
  'cookie': 'some-cookie',
  'other-sensitive-header': 'very secret data',
  [http2.sensitiveHeaders]: ['cookie', 'other-sensitive-header'],
};

stream.respond(headers);
```
Para algunos encabezados, como `Authorization` y los encabezados `Cookie` cortos, este flag se establece automáticamente.

Esta propiedad también se establece para los encabezados recibidos. Contendrá los nombres de todos los encabezados marcados como sensibles, incluidos los marcados automáticamente.

### Objeto de configuración {#settings-object}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.12.0 | La configuración de `maxConcurrentStreams` es más estricta. |
| v8.9.3 | La configuración de `maxHeaderListSize` ahora se aplica estrictamente. |
| v8.4.0 | Agregado en: v8.4.0 |
:::

Las API `http2.getDefaultSettings()`, `http2.getPackedSettings()`, `http2.createServer()`, `http2.createSecureServer()`, `http2session.settings()`, `http2session.localSettings` y `http2session.remoteSettings` devuelven o reciben como entrada un objeto que define la configuración de un objeto `Http2Session`. Estos objetos son objetos JavaScript ordinarios que contienen las siguientes propiedades.

- `headerTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el número máximo de bytes utilizados para la compresión de encabezados. El valor mínimo permitido es 0. El valor máximo permitido es 2-1. **Predeterminado:** `4096`.
- `enablePush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Especifica `true` si se van a permitir los flujos de inserción HTTP/2 en las instancias de `Http2Session`. **Predeterminado:** `true`.
- `initialWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el tamaño inicial de la ventana del *remitente* en bytes para el control de flujo a nivel de flujo. El valor mínimo permitido es 0. El valor máximo permitido es 2-1. **Predeterminado:** `65535`.
- `maxFrameSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el tamaño en bytes de la carga útil de marco más grande. El valor mínimo permitido es 16,384. El valor máximo permitido es 2-1. **Predeterminado:** `16384`.
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el número máximo de flujos concurrentes permitidos en una `Http2Session`. No hay ningún valor predeterminado, lo que implica que, al menos teóricamente, se pueden abrir 2-1 flujos simultáneamente en cualquier momento en una `Http2Session`. El valor mínimo es 0. El valor máximo permitido es 2-1. **Predeterminado:** `4294967295`.
- `maxHeaderListSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el tamaño máximo (octetos sin comprimir) de la lista de encabezados que se aceptará. El valor mínimo permitido es 0. El valor máximo permitido es 2-1. **Predeterminado:** `65535`.
- `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias para `maxHeaderListSize`.
- `enableConnectProtocol`[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Especifica `true` si se va a habilitar el "Protocolo de conexión extendida" definido por [RFC 8441](https://tools.ietf.org/html/rfc8441). Esta configuración solo es significativa si la envía el servidor. Una vez que la configuración de `enableConnectProtocol` se ha habilitado para una `Http2Session` dada, no se puede deshabilitar. **Predeterminado:** `false`.
- `customSettings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Especifica configuraciones adicionales, aún no implementadas en node y las bibliotecas subyacentes. La clave del objeto define el valor numérico del tipo de configuración (como se define en el registro "HTTP/2 SETTINGS" establecido por [RFC 7540]) y los valores el valor numérico real de la configuración. El tipo de configuración debe ser un entero en el rango de 1 a 2^16-1. No debe ser un tipo de configuración que ya maneje node, es decir, actualmente debe ser mayor que 6, aunque no es un error. Los valores deben ser enteros sin signo en el rango de 0 a 2^32-1. Actualmente, se admite un máximo de hasta 10 configuraciones personalizadas. Solo se admite para enviar SETTINGS o para recibir valores de configuración especificados en las opciones `remoteCustomSettings` del objeto servidor o cliente. No mezcle el mecanismo `customSettings` para una identificación de configuración con interfaces para la configuración manejada de forma nativa, en caso de que una configuración se vuelva compatible de forma nativa en una futura versión de node.

Todas las propiedades adicionales en el objeto de configuración se ignoran.


### Manejo de errores {#error-handling}

Existen varios tipos de condiciones de error que pueden surgir al usar el módulo `node:http2`:

Los errores de validación ocurren cuando se pasa un argumento, opción o valor de configuración incorrecto. Estos siempre se informarán mediante un `throw` síncrono.

Los errores de estado ocurren cuando se intenta realizar una acción en un momento incorrecto (por ejemplo, intentar enviar datos en un flujo después de que se haya cerrado). Estos se informarán mediante un `throw` síncrono o mediante un evento `'error'` en los objetos `Http2Stream`, `Http2Session` o HTTP/2 Server, dependiendo de dónde y cuándo ocurra el error.

Los errores internos ocurren cuando una sesión HTTP/2 falla inesperadamente. Estos se informarán a través de un evento `'error'` en los objetos `Http2Session` o HTTP/2 Server.

Los errores de protocolo ocurren cuando se violan varias restricciones del protocolo HTTP/2. Estos se informarán mediante un `throw` síncrono o mediante un evento `'error'` en los objetos `Http2Stream`, `Http2Session` o HTTP/2 Server, dependiendo de dónde y cuándo ocurra el error.

### Manejo de caracteres no válidos en nombres y valores de encabezado {#invalid-character-handling-in-header-names-and-values}

La implementación de HTTP/2 aplica un manejo más estricto de los caracteres no válidos en los nombres y valores de los encabezados HTTP que la implementación de HTTP/1.

Los nombres de los campos de encabezado *no distinguen entre mayúsculas y minúsculas* y se transmiten por el cable estrictamente como cadenas en minúsculas. La API proporcionada por Node.js permite que los nombres de los encabezados se establezcan como cadenas en mayúsculas y minúsculas (por ejemplo, `Content-Type`) pero los convertirá a minúsculas (por ejemplo, `content-type`) al transmitirlos.

Los nombres de los campos de encabezado *deben contener solamente* uno o más de los siguientes caracteres ASCII: `a`-`z`, `A`-`Z`, `0`-`9`, `!`, `#`, `$`, `%`, `&`, `'`, `*`, `+`, `-`, `.`, `^`, `_`, ``` (backtick), `|` y `~`.

El uso de caracteres no válidos dentro de un nombre de campo de encabezado HTTP hará que el flujo se cierre y se informe un error de protocolo.

Los valores de los campos de encabezado se manejan con más indulgencia, pero *no deben* contener caracteres de nueva línea o retorno de carro y *deben* limitarse a los caracteres US-ASCII, según los requisitos de la especificación HTTP.


### Transmitir flujos en el cliente {#push-streams-on-the-client}

Para recibir flujos transmitidos en el cliente, establezca un escuchador para el evento `'stream'` en la `ClientHttp2Session`:

::: code-group
```js [ESM]
import { connect } from 'node:http2';

const client = connect('http://localhost');

client.on('stream', (pushedStream, requestHeaders) => {
  pushedStream.on('push', (responseHeaders) => {
    // Procesar encabezados de respuesta
  });
  pushedStream.on('data', (chunk) => { /* manejar datos transmitidos */ });
});

const req = client.request({ ':path': '/' });
```

```js [CJS]
const http2 = require('node:http2');

const client = http2.connect('http://localhost');

client.on('stream', (pushedStream, requestHeaders) => {
  pushedStream.on('push', (responseHeaders) => {
    // Procesar encabezados de respuesta
  });
  pushedStream.on('data', (chunk) => { /* manejar datos transmitidos */ });
});

const req = client.request({ ':path': '/' });
```
:::

### Soporte del método `CONNECT` {#supporting-the-connect-method}

El método `CONNECT` se utiliza para permitir que un servidor HTTP/2 se utilice como proxy para conexiones TCP/IP.

Un servidor TCP simple:

::: code-group
```js [ESM]
import { createServer } from 'node:net';

const server = createServer((socket) => {
  let name = '';
  socket.setEncoding('utf8');
  socket.on('data', (chunk) => name += chunk);
  socket.on('end', () => socket.end(`hello ${name}`));
});

server.listen(8000);
```

```js [CJS]
const net = require('node:net');

const server = net.createServer((socket) => {
  let name = '';
  socket.setEncoding('utf8');
  socket.on('data', (chunk) => name += chunk);
  socket.on('end', () => socket.end(`hello ${name}`));
});

server.listen(8000);
```
:::

Un proxy HTTP/2 CONNECT:

::: code-group
```js [ESM]
import { createServer, constants } from 'node:http2';
const { NGHTTP2_REFUSED_STREAM, NGHTTP2_CONNECT_ERROR } = constants;
import { connect } from 'node:net';

const proxy = createServer();
proxy.on('stream', (stream, headers) => {
  if (headers[':method'] !== 'CONNECT') {
    // Solo aceptar solicitudes CONNECT
    stream.close(NGHTTP2_REFUSED_STREAM);
    return;
  }
  const auth = new URL(`tcp://${headers[':authority']}`);
  // Es una muy buena idea verificar que el nombre de host y el puerto sean
  // cosas a las que este proxy debería conectarse.
  const socket = connect(auth.port, auth.hostname, () => {
    stream.respond();
    socket.pipe(stream);
    stream.pipe(socket);
  });
  socket.on('error', (error) => {
    stream.close(NGHTTP2_CONNECT_ERROR);
  });
});

proxy.listen(8001);
```

```js [CJS]
const http2 = require('node:http2');
const { NGHTTP2_REFUSED_STREAM } = http2.constants;
const net = require('node:net');

const proxy = http2.createServer();
proxy.on('stream', (stream, headers) => {
  if (headers[':method'] !== 'CONNECT') {
    // Solo aceptar solicitudes CONNECT
    stream.close(NGHTTP2_REFUSED_STREAM);
    return;
  }
  const auth = new URL(`tcp://${headers[':authority']}`);
  // Es una muy buena idea verificar que el nombre de host y el puerto sean
  // cosas a las que este proxy debería conectarse.
  const socket = net.connect(auth.port, auth.hostname, () => {
    stream.respond();
    socket.pipe(stream);
    stream.pipe(socket);
  });
  socket.on('error', (error) => {
    stream.close(http2.constants.NGHTTP2_CONNECT_ERROR);
  });
});

proxy.listen(8001);
```
:::

Un cliente HTTP/2 CONNECT:

::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';

const client = connect('http://localhost:8001');

// No debe especificar los encabezados ':path' y ':scheme'
// para solicitudes CONNECT o se producirá un error.
const req = client.request({
  ':method': 'CONNECT',
  ':authority': 'localhost:8000',
});

req.on('response', (headers) => {
  console.log(headers[constants.HTTP2_HEADER_STATUS]);
});
let data = '';
req.setEncoding('utf8');
req.on('data', (chunk) => data += chunk);
req.on('end', () => {
  console.log(`The server says: ${data}`);
  client.close();
});
req.end('Jane');
```

```js [CJS]
const http2 = require('node:http2');

const client = http2.connect('http://localhost:8001');

// No debe especificar los encabezados ':path' y ':scheme'
// para solicitudes CONNECT o se producirá un error.
const req = client.request({
  ':method': 'CONNECT',
  ':authority': 'localhost:8000',
});

req.on('response', (headers) => {
  console.log(headers[http2.constants.HTTP2_HEADER_STATUS]);
});
let data = '';
req.setEncoding('utf8');
req.on('data', (chunk) => data += chunk);
req.on('end', () => {
  console.log(`The server says: ${data}`);
  client.close();
});
req.end('Jane');
```
:::


### El protocolo `CONNECT` extendido {#the-extended-connect-protocol}

[RFC 8441](https://tools.ietf.org/html/rfc8441) define una extensión del "Protocolo CONNECT Extendido" para HTTP/2 que puede utilizarse para iniciar el uso de un `Http2Stream` utilizando el método `CONNECT` como un túnel para otros protocolos de comunicación (como WebSockets).

El uso del Protocolo CONNECT Extendido está habilitado por los servidores HTTP/2 mediante el uso de la configuración `enableConnectProtocol`:

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const settings = { enableConnectProtocol: true };
const server = createServer({ settings });
```

```js [CJS]
const http2 = require('node:http2');
const settings = { enableConnectProtocol: true };
const server = http2.createServer({ settings });
```
:::

Una vez que el cliente recibe el marco `SETTINGS` del servidor que indica que se puede utilizar el CONNECT extendido, puede enviar solicitudes `CONNECT` que utilicen el pseudo-encabezado HTTP/2 `':protocol'`:

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('http://localhost:8080');
client.on('remoteSettings', (settings) => {
  if (settings.enableConnectProtocol) {
    const req = client.request({ ':method': 'CONNECT', ':protocol': 'foo' });
    // ...
  }
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('http://localhost:8080');
client.on('remoteSettings', (settings) => {
  if (settings.enableConnectProtocol) {
    const req = client.request({ ':method': 'CONNECT', ':protocol': 'foo' });
    // ...
  }
});
```
:::

## API de compatibilidad {#compatibility-api}

El objetivo de la API de compatibilidad es proporcionar una experiencia de desarrollador similar a HTTP/1 al usar HTTP/2, haciendo posible desarrollar aplicaciones que admitan tanto [HTTP/1](/es/nodejs/api/http) como HTTP/2. Esta API se dirige solo a la **API pública** de [HTTP/1](/es/nodejs/api/http). Sin embargo, muchos módulos utilizan métodos o estados internos, y *estos no son compatibles* ya que es una implementación completamente diferente.

El siguiente ejemplo crea un servidor HTTP/2 utilizando la API de compatibilidad:

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```
:::

Para crear un servidor mixto [HTTPS](/es/nodejs/api/https) y HTTP/2, consulte la sección de [negociación ALPN](/es/nodejs/api/http2#alpn-negotiation). No se admite la actualización desde servidores HTTP/1 no TLS.

La API de compatibilidad con HTTP/2 se compone de [`Http2ServerRequest`](/es/nodejs/api/http2#class-http2http2serverrequest) y [`Http2ServerResponse`](/es/nodejs/api/http2#class-http2http2serverresponse). Su objetivo es la compatibilidad de la API con HTTP/1, pero no ocultan las diferencias entre los protocolos. Como ejemplo, se ignora el mensaje de estado para los códigos HTTP.


### Negociación ALPN {#alpn-negotiation}

La negociación ALPN permite soportar tanto [HTTPS](/es/nodejs/api/https) como HTTP/2 sobre el mismo socket. Los objetos `req` y `res` pueden ser HTTP/1 o HTTP/2, y una aplicación **debe** restringirse a la API pública de [HTTP/1](/es/nodejs/api/http), y detectar si es posible usar las características más avanzadas de HTTP/2.

El siguiente ejemplo crea un servidor que soporta ambos protocolos:

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const cert = readFileSync('./cert.pem');
const key = readFileSync('./key.pem');

const server = createSecureServer(
  { cert, key, allowHTTP1: true },
  onRequest,
).listen(8000);

function onRequest(req, res) {
  // Detecta si es una petición HTTPS o HTTP/2
  const { socket: { alpnProtocol } } = req.httpVersion === '2.0' ?
    req.stream.session : req;
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({
    alpnProtocol,
    httpVersion: req.httpVersion,
  }));
}
```

```js [CJS]
const { createSecureServer } = require('node:http2');
const { readFileSync } = require('node:fs');

const cert = readFileSync('./cert.pem');
const key = readFileSync('./key.pem');

const server = createSecureServer(
  { cert, key, allowHTTP1: true },
  onRequest,
).listen(4443);

function onRequest(req, res) {
  // Detecta si es una petición HTTPS o HTTP/2
  const { socket: { alpnProtocol } } = req.httpVersion === '2.0' ?
    req.stream.session : req;
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({
    alpnProtocol,
    httpVersion: req.httpVersion,
  }));
}
```
:::

El evento `'request'` funciona de forma idéntica tanto en [HTTPS](/es/nodejs/api/https) como en HTTP/2.

### Clase: `http2.Http2ServerRequest` {#class-http2http2serverrequest}

**Agregado en: v8.4.0**

- Extiende: [\<stream.Readable\>](/es/nodejs/api/stream#class-streamreadable)

Un objeto `Http2ServerRequest` es creado por [`http2.Server`](/es/nodejs/api/http2#class-http2server) o [`http2.SecureServer`](/es/nodejs/api/http2#class-http2secureserver) y pasado como el primer argumento al evento [`'request'`](/es/nodejs/api/http2#event-request). Puede ser usado para acceder al estado, las cabeceras y los datos de una petición.


#### Evento: `'aborted'` {#event-aborted_1}

**Añadido en: v8.4.0**

El evento `'aborted'` se emite siempre que una instancia de `Http2ServerRequest` se aborta anormalmente a mitad de la comunicación.

El evento `'aborted'` solo se emitirá si el lado de escritura de `Http2ServerRequest` no ha finalizado.

#### Evento: `'close'` {#event-close_2}

**Añadido en: v8.4.0**

Indica que el [`Http2Stream`](/es/nodejs/api/http2#class-http2stream) subyacente se cerró. Al igual que `'end'`, este evento ocurre solo una vez por respuesta.

#### `request.aborted` {#requestaborted}

**Añadido en: v10.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La propiedad `request.aborted` será `true` si la solicitud ha sido abortada.

#### `request.authority` {#requestauthority}

**Añadido en: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El campo de pseudoencabezado de autoridad de la solicitud. Debido a que HTTP/2 permite que las solicitudes establezcan `:authority` u `host`, este valor se deriva de `req.headers[':authority']` si está presente. De lo contrario, se deriva de `req.headers['host']`.

#### `request.complete` {#requestcomplete}

**Añadido en: v12.10.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La propiedad `request.complete` será `true` si la solicitud se ha completado, abortado o destruido.

#### `request.connection` {#requestconnection}

**Añadido en: v8.4.0**

**Obsoleto desde: v13.0.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto. Use [`request.socket`](/es/nodejs/api/http2#requestsocket).
:::

- [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/es/nodejs/api/tls#class-tlstlssocket)

Ver [`request.socket`](/es/nodejs/api/http2#requestsocket).

#### `request.destroy([error])` {#requestdestroyerror}

**Añadido en: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Llama a `destroy()` en el [`Http2Stream`](/es/nodejs/api/http2#class-http2stream) que recibió el [`Http2ServerRequest`](/es/nodejs/api/http2#class-http2http2serverrequest). Si se proporciona `error`, se emite un evento `'error'` y `error` se pasa como argumento a cualquier oyente en el evento.

No hace nada si el stream ya fue destruido.


#### `request.headers` {#requestheaders}

**Agregado en: v8.4.0**

- [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

El objeto de encabezados de petición/respuesta.

Pares clave-valor de nombres y valores de encabezado. Los nombres de encabezado están en minúsculas.

```js [ESM]
// Imprime algo como:
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
```
Vea [Objeto de encabezados HTTP/2](/es/nodejs/api/http2#headers-object).

En HTTP/2, la ruta de la petición, el nombre de host, el protocolo y el método se representan como encabezados especiales con el prefijo del carácter `:` (por ejemplo, `':path'`). Estos encabezados especiales se incluirán en el objeto `request.headers`. Se debe tener cuidado de no modificar inadvertidamente estos encabezados especiales, ya que pueden producirse errores. Por ejemplo, la eliminación de todos los encabezados de la petición provocará errores:

```js [ESM]
removeAllHeaders(request.headers);
assert(request.url);   // Falla porque el encabezado :path ha sido eliminado
```
#### `request.httpVersion` {#requesthttpversion}

**Agregado en: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

En el caso de la petición del servidor, la versión HTTP enviada por el cliente. En el caso de la respuesta del cliente, la versión HTTP del servidor conectado. Regresa `'2.0'`.

También `message.httpVersionMajor` es el primer entero y `message.httpVersionMinor` es el segundo.

#### `request.method` {#requestmethod}

**Agregado en: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El método de solicitud como una cadena. De sólo lectura. Ejemplos: `'GET'`, `'DELETE'`.

#### `request.rawHeaders` {#requestrawheaders}

**Agregado en: v8.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La lista de encabezados de petición/respuesta sin procesar exactamente como se recibieron.

Las claves y los valores están en la misma lista. No es *no* una lista de tuplas. Por lo tanto, los desplazamientos de numeración par son valores de clave, y los desplazamientos de numeración impar son los valores asociados.

Los nombres de los encabezados no se convierten a minúsculas y los duplicados no se fusionan.

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

#### `request.rawTrailers` {#requestrawtrailers}

**Agregado en: v8.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Las claves y los valores de los tráilers de solicitud/respuesta sin procesar tal como se recibieron. Solo se completa en el evento `'end'`.

#### `request.scheme` {#requestscheme}

**Agregado en: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El campo pseudo-encabezado del esquema de solicitud que indica la porción del esquema de la URL de destino.

#### `request.setTimeout(msecs, callback)` {#requestsettimeoutmsecs-callback}

**Agregado en: v8.4.0**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<http2.Http2ServerRequest\>](/es/nodejs/api/http2#class-http2http2serverrequest)

Establece el valor de tiempo de espera del [`Http2Stream`](/es/nodejs/api/http2#class-http2stream) a `msecs`. Si se proporciona una función de retrollamada, se agrega como un listener en el evento `'timeout'` en el objeto de respuesta.

Si no se agrega un listener `'timeout'` a la solicitud, la respuesta o el servidor, los [`Http2Stream`](/es/nodejs/api/http2#class-http2stream) se destruyen cuando se agota el tiempo de espera. Si se asigna un controlador a los eventos `'timeout'` de la solicitud, la respuesta o el servidor, los sockets con tiempo de espera agotado deben manejarse explícitamente.

#### `request.socket` {#requestsocket}

**Agregado en: v8.4.0**

- [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/es/nodejs/api/tls#class-tlstlssocket)

Devuelve un objeto `Proxy` que actúa como un `net.Socket` (o `tls.TLSSocket`) pero aplica captadores (getters), establecedores (setters) y métodos basados en la lógica de HTTP/2.

Las propiedades `destroyed`, `readable` y `writable` se recuperarán y establecerán en `request.stream`.

Los métodos `destroy`, `emit`, `end`, `on` y `once` se llamarán en `request.stream`.

El método `setTimeout` se llamará en `request.stream.session`.

`pause`, `read`, `resume` y `write` lanzarán un error con el código `ERR_HTTP2_NO_SOCKET_MANIPULATION`. Consulte [`Http2Session` y Sockets](/es/nodejs/api/http2#http2session-and-sockets) para obtener más información.

Todas las demás interacciones se enrutarán directamente al socket. Con soporte TLS, use [`request.socket.getPeerCertificate()`](/es/nodejs/api/tls#tlssocketgetpeercertificatedetailed) para obtener los detalles de autenticación del cliente.


#### `request.stream` {#requeststream}

**Agregado en: v8.4.0**

- [\<Http2Stream\>](/es/nodejs/api/http2#class-http2stream)

El objeto [`Http2Stream`](/es/nodejs/api/http2#class-http2stream) que respalda la solicitud.

#### `request.trailers` {#requesttrailers}

**Agregado en: v8.4.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

El objeto de encabezados finales de solicitud/respuesta. Solo se completa en el evento `'end'`.

#### `request.url` {#requesturl}

**Agregado en: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Cadena de URL de la solicitud. Esto contiene solo la URL que está presente en la solicitud HTTP real. Si la solicitud es:

GET /status?name=ryan HTTP/1.1
Accept: text/plain
```
Entonces `request.url` será:

```js [ESM]
'/status?name=ryan'
```
Para analizar la URL en sus partes, se puede usar `new URL()`:

```bash [BASH]
$ node
> new URL('/status?name=ryan', 'http://example.com')
URL {
  href: 'http://example.com/status?name=ryan',
  origin: 'http://example.com',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'example.com',
  hostname: 'example.com',
  port: '',
  pathname: '/status',
  search: '?name=ryan',
  searchParams: URLSearchParams { 'name' => 'ryan' },
  hash: ''
}
```
### Clase: `http2.Http2ServerResponse` {#class-http2http2serverresponse}

**Agregado en: v8.4.0**

- Extiende: [\<Stream\>](/es/nodejs/api/stream#stream)

Este objeto es creado internamente por un servidor HTTP, no por el usuario. Se pasa como el segundo parámetro al evento [`'request'`](/es/nodejs/api/http2#event-request).

#### Evento: `'close'` {#event-close_3}

**Agregado en: v8.4.0**

Indica que el [`Http2Stream`](/es/nodejs/api/http2#class-http2stream) subyacente fue terminado antes de que se llamara a [`response.end()`](/es/nodejs/api/http2#responseenddata-encoding-callback) o pudiera vaciarse.

#### Evento: `'finish'` {#event-finish}

**Agregado en: v8.4.0**

Se emite cuando se ha enviado la respuesta. Más específicamente, este evento se emite cuando el último segmento de los encabezados y el cuerpo de la respuesta se han entregado a la multiplexación HTTP/2 para su transmisión a través de la red. No implica que el cliente haya recibido nada todavía.

Después de este evento, no se emitirán más eventos en el objeto de respuesta.


#### `response.addTrailers(headers)` {#responseaddtrailersheaders}

**Agregado en: v8.4.0**

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Este método agrega encabezados finales HTTP (un encabezado pero al final del mensaje) a la respuesta.

Intentar establecer un nombre de campo de encabezado o un valor que contenga caracteres no válidos resultará en el lanzamiento de un [`TypeError`](/es/nodejs/api/errors#class-typeerror).

#### `response.appendHeader(name, value)` {#responseappendheadername-value}

**Agregado en: v21.7.0, v20.12.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Agrega un solo valor de encabezado al objeto de encabezado.

Si el valor es un array, esto es equivalente a llamar a este método varias veces.

Si no había valores previos para el encabezado, esto es equivalente a llamar a [`response.setHeader()`](/es/nodejs/api/http2#responsesetheadername-value).

Intentar establecer un nombre de campo de encabezado o un valor que contenga caracteres no válidos resultará en el lanzamiento de un [`TypeError`](/es/nodejs/api/errors#class-typeerror).

```js [ESM]
// Devuelve los encabezados incluyendo "set-cookie: a" y "set-cookie: b"
const server = http2.createServer((req, res) => {
  res.setHeader('set-cookie', 'a');
  res.appendHeader('set-cookie', 'b');
  res.writeHead(200);
  res.end('ok');
});
```
#### `response.connection` {#responseconnection}

**Agregado en: v8.4.0**

**Obsoleto desde: v13.0.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto. Use [`response.socket`](/es/nodejs/api/http2#responsesocket).
:::

- [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/es/nodejs/api/tls#class-tlstlssocket)

Ver [`response.socket`](/es/nodejs/api/http2#responsesocket).

#### `response.createPushResponse(headers, callback)` {#responsecreatepushresponseheaders-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una función de callback no válida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Agregado en: v8.4.0 |
:::

- `headers` [\<Objeto de Encabezados HTTP/2\>](/es/nodejs/api/http2#headers-object) Un objeto que describe los encabezados
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se llama una vez que `http2stream.pushStream()` finaliza, o bien cuando el intento de crear el `Http2Stream` push ha fallado o ha sido rechazado, o el estado de `Http2ServerRequest` se cierra antes de llamar al método `http2stream.pushStream()`
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `res` [\<http2.Http2ServerResponse\>](/es/nodejs/api/http2#class-http2http2serverresponse) El objeto `Http2ServerResponse` recién creado
  
 

Llama a [`http2stream.pushStream()`](/es/nodejs/api/http2#http2streampushstreamheaders-options-callback) con los encabezados dados, y envuelve el [`Http2Stream`](/es/nodejs/api/http2#class-http2stream) dado en un `Http2ServerResponse` recién creado como el parámetro de callback si tiene éxito. Cuando `Http2ServerRequest` se cierra, se llama al callback con un error `ERR_HTTP2_INVALID_STREAM`.


#### `response.end([data[, encoding]][, callback])` {#responseenddata-encoding-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Este método ahora devuelve una referencia a `ServerResponse`. |
| v8.4.0 | Añadido en: v8.4.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Este método indica al servidor que todas las cabeceras de respuesta y el cuerpo han sido enviados; que el servidor debe considerar este mensaje como completo. El método `response.end()` DEBE ser llamado en cada respuesta.

Si se especifica `data`, es equivalente a llamar a [`response.write(data, encoding)`](/es/nodejs/api/http#responsewritechunk-encoding-callback) seguido de `response.end(callback)`.

Si se especifica `callback`, se llamará cuando el flujo de respuesta haya terminado.

#### `response.finished` {#responsefinished}

**Añadido en: v8.4.0**

**Obsoleto desde: v13.4.0, v12.16.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto. Utilice [`response.writableEnded`](/es/nodejs/api/http2#responsewritableended).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Valor booleano que indica si la respuesta ha finalizado. Comienza como `false`. Después de que [`response.end()`](/es/nodejs/api/http2#responseenddata-encoding-callback) se ejecute, el valor será `true`.

#### `response.getHeader(name)` {#responsegetheadername}

**Añadido en: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Lee una cabecera que ya ha sido encolada pero no enviada al cliente. El nombre no distingue entre mayúsculas y minúsculas.

```js [ESM]
const contentType = response.getHeader('content-type');
```

#### `response.getHeaderNames()` {#responsegetheadernames}

**Agregada en: v8.4.0**

- Devuelve: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve un array que contiene los nombres únicos de los encabezados salientes actuales. Todos los nombres de los encabezados están en minúsculas.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```
#### `response.getHeaders()` {#responsegetheaders}

**Agregada en: v8.4.0**

- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Devuelve una copia superficial de los encabezados salientes actuales. Dado que se utiliza una copia superficial, los valores de los arrays se pueden modificar sin llamadas adicionales a varios métodos del módulo http relacionados con los encabezados. Las claves del objeto devuelto son los nombres de los encabezados y los valores son los valores de los encabezados respectivos. Todos los nombres de los encabezados están en minúsculas.

El objeto devuelto por el método `response.getHeaders()` *no* hereda prototípicamente de JavaScript `Object`. Esto significa que los métodos típicos de `Object`, como `obj.toString()`, `obj.hasOwnProperty()` y otros, no están definidos y *no funcionarán*.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
#### `response.hasHeader(name)` {#responsehasheadername}

**Agregada en: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el encabezado identificado por `name` está actualmente establecido en los encabezados salientes. La coincidencia del nombre del encabezado no distingue entre mayúsculas y minúsculas.

```js [ESM]
const hasContentType = response.hasHeader('content-type');
```
#### `response.headersSent` {#responseheaderssent}

**Agregada en: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Verdadero si se enviaron los encabezados, falso en caso contrario (solo lectura).


#### `response.removeHeader(name)` {#responseremoveheadername}

**Agregado en: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Elimina un encabezado que se ha puesto en cola para su envío implícito.

```js [ESM]
response.removeHeader('Content-Encoding');
```
#### `response.req` {#responsereq}

**Agregado en: v15.7.0**

- [\<http2.Http2ServerRequest\>](/es/nodejs/api/http2#class-http2http2serverrequest)

Una referencia al objeto `request` HTTP2 original.

#### `response.sendDate` {#responsesenddate}

**Agregado en: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Cuando es verdadero, el encabezado Date se generará y se enviará automáticamente en la respuesta si aún no está presente en los encabezados. El valor predeterminado es verdadero.

Esto solo debe deshabilitarse para las pruebas; HTTP requiere el encabezado Date en las respuestas.

#### `response.setHeader(name, value)` {#responsesetheadername-value}

**Agregado en: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Establece un valor de encabezado único para los encabezados implícitos. Si este encabezado ya existe en los encabezados que se van a enviar, su valor será reemplazado. Use una matriz de cadenas aquí para enviar varios encabezados con el mismo nombre.

```js [ESM]
response.setHeader('Content-Type', 'text/html; charset=utf-8');
```
o

```js [ESM]
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```
Intentar establecer un nombre o valor de campo de encabezado que contenga caracteres no válidos dará como resultado un [`TypeError`](/es/nodejs/api/errors#class-typeerror).

Cuando los encabezados se han establecido con [`response.setHeader()`](/es/nodejs/api/http2#responsesetheadername-value), se combinarán con los encabezados pasados a [`response.writeHead()`](/es/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers), y se dará prioridad a los encabezados pasados a [`response.writeHead()`](/es/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers).

```js [ESM]
// Devuelve content-type = text/plain
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```

#### `response.setTimeout(msecs[, callback])` {#responsesettimeoutmsecs-callback}

**Añadido en: v8.4.0**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<http2.Http2ServerResponse\>](/es/nodejs/api/http2#class-http2http2serverresponse)

Establece el valor de tiempo de espera del [`Http2Stream`](/es/nodejs/api/http2#class-http2http2stream) a `msecs`. Si se proporciona una función de callback, entonces se añade como un listener en el evento `'timeout'` en el objeto de respuesta.

Si no se añade ningún listener `'timeout'` a la solicitud, la respuesta o el servidor, entonces los [`Http2Stream`](/es/nodejs/api/http2#class-http2http2stream)s se destruyen cuando se agota el tiempo de espera. Si se asigna un controlador a los eventos `'timeout'` de la solicitud, la respuesta o el servidor, los sockets con tiempo de espera agotado deben manejarse explícitamente.

#### `response.socket` {#responsesocket}

**Añadido en: v8.4.0**

- [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/es/nodejs/api/tls#class-tlstlssocket)

Devuelve un objeto `Proxy` que actúa como un `net.Socket` (o `tls.TLSSocket`) pero aplica getters, setters y métodos basados en la lógica de HTTP/2.

Las propiedades `destroyed`, `readable` y `writable` se recuperarán y establecerán en `response.stream`.

Los métodos `destroy`, `emit`, `end`, `on` y `once` se llamarán en `response.stream`.

El método `setTimeout` se llamará en `response.stream.session`.

`pause`, `read`, `resume` y `write` lanzarán un error con el código `ERR_HTTP2_NO_SOCKET_MANIPULATION`. Vea [`Http2Session` y Sockets](/es/nodejs/api/http2#http2session-and-sockets) para más información.

Todas las demás interacciones se enrutarán directamente al socket.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  const port = req.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  const port = req.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```
:::


#### `response.statusCode` {#responsestatuscode}

**Agregado en: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Cuando se usan encabezados implícitos (sin llamar a [`response.writeHead()`](/es/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) explícitamente), esta propiedad controla el código de estado que se enviará al cliente cuando se vacíen los encabezados.

```js [ESM]
response.statusCode = 404;
```
Después de que el encabezado de la respuesta se haya enviado al cliente, esta propiedad indica el código de estado que se envió.

#### `response.statusMessage` {#responsestatusmessage}

**Agregado en: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El mensaje de estado no es compatible con HTTP/2 (RFC 7540 8.1.2.4). Devuelve una cadena vacía.

#### `response.stream` {#responsestream}

**Agregado en: v8.4.0**

- [\<Http2Stream\>](/es/nodejs/api/http2#class-http2stream)

El objeto [`Http2Stream`](/es/nodejs/api/http2#class-http2stream) que respalda la respuesta.

#### `response.writableEnded` {#responsewritableended}

**Agregado en: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Es `true` después de que se haya llamado a [`response.end()`](/es/nodejs/api/http2#responseenddata-encoding-callback). Esta propiedad no indica si los datos se han vaciado, para esto use [`writable.writableFinished`](/es/nodejs/api/stream#writablewritablefinished) en su lugar.

#### `response.write(chunk[, encoding][, callback])` {#responsewritechunk-encoding-callback}

**Agregado en: v8.4.0**

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Si se llama a este método y no se ha llamado a [`response.writeHead()`](/es/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers), cambiará al modo de encabezado implícito y vaciará los encabezados implícitos.

Esto envía un fragmento del cuerpo de la respuesta. Este método se puede llamar varias veces para proporcionar partes sucesivas del cuerpo.

En el módulo `node:http`, el cuerpo de la respuesta se omite cuando la solicitud es una solicitud HEAD. Del mismo modo, las respuestas `204` y `304` *no deben* incluir un cuerpo de mensaje.

`chunk` puede ser una cadena o un búfer. Si `chunk` es una cadena, el segundo parámetro especifica cómo codificarla en un flujo de bytes. De forma predeterminada, la `encoding` es `'utf8'`. Se llamará a `callback` cuando se vacíe este fragmento de datos.

Este es el cuerpo HTTP sin procesar y no tiene nada que ver con las codificaciones de cuerpo de varias partes de nivel superior que se puedan usar.

La primera vez que se llama a [`response.write()`](/es/nodejs/api/http2#responsewritechunk-encoding-callback), enviará la información del encabezado almacenada en búfer y el primer fragmento del cuerpo al cliente. La segunda vez que se llama a [`response.write()`](/es/nodejs/api/http2#responsewritechunk-encoding-callback), Node.js asume que los datos se transmitirán y envía los nuevos datos por separado. Es decir, la respuesta se almacena en búfer hasta el primer fragmento del cuerpo.

Devuelve `true` si todos los datos se vaciaron correctamente en el búfer del kernel. Devuelve `false` si todos o parte de los datos se pusieron en cola en la memoria del usuario. Se emitirá `'drain'` cuando el búfer esté libre nuevamente.


#### `response.writeContinue()` {#responsewritecontinue}

**Agregado en: v8.4.0**

Envía un estado `100 Continue` al cliente, indicando que el cuerpo de la solicitud debe ser enviado. Consulte el evento [`'checkContinue'`](/es/nodejs/api/http2#event-checkcontinue) en `Http2Server` y `Http2SecureServer`.

#### `response.writeEarlyHints(hints)` {#responsewriteearlyhintshints}

**Agregado en: v18.11.0**

- `hints` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Envía un estado `103 Early Hints` al cliente con un encabezado Link, indicando que el agente de usuario puede precargar/preconectar los recursos enlazados. `hints` es un objeto que contiene los valores de los encabezados que se enviarán con el mensaje de sugerencias tempranas.

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
});
```
#### `response.writeHead(statusCode[, statusMessage][, headers])` {#responsewriteheadstatuscode-statusmessage-headers}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v11.10.0, v10.17.0 | Devuelve `this` desde `writeHead()` para permitir el encadenamiento con `end()`. |
| v8.4.0 | Agregado en: v8.4.0 |
:::

- `statusCode` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `headers` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- Devuelve: [\<http2.Http2ServerResponse\>](/es/nodejs/api/http2#class-http2http2serverresponse)

Envía un encabezado de respuesta a la solicitud. El código de estado es un código de estado HTTP de 3 dígitos, como `404`. El último argumento, `headers`, son los encabezados de respuesta.

Devuelve una referencia a `Http2ServerResponse`, para que las llamadas puedan ser encadenadas.

Para compatibilidad con [HTTP/1](/es/nodejs/api/http), un `statusMessage` legible por humanos puede ser pasado como el segundo argumento. Sin embargo, debido a que `statusMessage` no tiene significado dentro de HTTP/2, el argumento no tendrá ningún efecto y se emitirá una advertencia de proceso.

```js [ESM]
const body = 'hello world';
response.writeHead(200, {
  'Content-Length': Buffer.byteLength(body),
  'Content-Type': 'text/plain; charset=utf-8',
});
```
`Content-Length` se da en bytes, no en caracteres. La API `Buffer.byteLength()` puede utilizarse para determinar el número de bytes en una codificación dada. En los mensajes de salida, Node.js no comprueba si Content-Length y la longitud del cuerpo que se transmite son iguales o no. Sin embargo, al recibir mensajes, Node.js rechazará automáticamente los mensajes cuando `Content-Length` no coincida con el tamaño real de la carga útil.

Este método puede ser llamado como máximo una vez en un mensaje antes de que se llame a [`response.end()`](/es/nodejs/api/http2#responseenddata-encoding-callback).

Si se llaman a [`response.write()`](/es/nodejs/api/http2#responsewritechunk-encoding-callback) o [`response.end()`](/es/nodejs/api/http2#responseenddata-encoding-callback) antes de llamar a esto, los encabezados implícitos/mutables serán calculados y llamarán a esta función.

Cuando los encabezados han sido establecidos con [`response.setHeader()`](/es/nodejs/api/http2#responsesetheadername-value), se fusionarán con cualquier encabezado pasado a [`response.writeHead()`](/es/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers), dando precedencia a los encabezados pasados a [`response.writeHead()`](/es/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers).

```js [ESM]
// Devuelve content-type = text/plain
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```
Intentar establecer un nombre o valor de campo de encabezado que contenga caracteres inválidos resultará en que se lance un [`TypeError`](/es/nodejs/api/errors#class-typeerror).


## Recopilación de métricas de rendimiento de HTTP/2 {#collecting-http/2-performance-metrics}

La API de [Observador de Rendimiento](/es/nodejs/api/perf_hooks) se puede utilizar para recopilar métricas de rendimiento básicas para cada instancia de `Http2Session` e `Http2Stream`.

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(entry.entryType);  // Imprime 'http2'
  if (entry.name === 'Http2Session') {
    // La entrada contiene estadísticas sobre la Http2Session
  } else if (entry.name === 'Http2Stream') {
    // La entrada contiene estadísticas sobre el Http2Stream
  }
});
obs.observe({ entryTypes: ['http2'] });
```

```js [CJS]
const { PerformanceObserver } = require('node:perf_hooks');

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(entry.entryType);  // Imprime 'http2'
  if (entry.name === 'Http2Session') {
    // La entrada contiene estadísticas sobre la Http2Session
  } else if (entry.name === 'Http2Stream') {
    // La entrada contiene estadísticas sobre el Http2Stream
  }
});
obs.observe({ entryTypes: ['http2'] });
```
:::

La propiedad `entryType` de `PerformanceEntry` será igual a `'http2'`.

La propiedad `name` de `PerformanceEntry` será igual a `'Http2Stream'` o `'Http2Session'`.

Si `name` es igual a `Http2Stream`, la `PerformanceEntry` contendrá las siguientes propiedades adicionales:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes de trama `DATA` recibidos para este `Http2Stream`.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes de trama `DATA` enviados para este `Http2Stream`.
- `id` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El identificador del `Http2Stream` asociado
- `timeToFirstByte` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de milisegundos transcurridos entre el `startTime` de `PerformanceEntry` y la recepción del primer fotograma `DATA`.
- `timeToFirstByteSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de milisegundos transcurridos entre el `startTime` de `PerformanceEntry` y el envío del primer fotograma `DATA`.
- `timeToFirstHeader` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de milisegundos transcurridos entre el `startTime` de `PerformanceEntry` y la recepción de la primera cabecera.

Si `name` es igual a `Http2Session`, la `PerformanceEntry` contendrá las siguientes propiedades adicionales:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes recibidos para esta `Http2Session`.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes enviados para esta `Http2Session`.
- `framesReceived` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de tramas HTTP/2 recibidas por la `Http2Session`.
- `framesSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de tramas HTTP/2 enviadas por la `Http2Session`.
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número máximo de flujos abiertos simultáneamente durante la vida útil de la `Http2Session`.
- `pingRTT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de milisegundos transcurridos desde la transmisión de un fotograma `PING` y la recepción de su reconocimiento. Solo presente si se ha enviado un fotograma `PING` en la `Http2Session`.
- `streamAverageDuration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La duración promedio (en milisegundos) para todas las instancias de `Http2Stream`.
- `streamCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de instancias de `Http2Stream` procesadas por la `Http2Session`.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ya sea `'server'` o `'client'` para identificar el tipo de `Http2Session`.


## Nota sobre `:authority` y `host` {#note-on-authority-and-host}

HTTP/2 requiere que las solicitudes tengan el pseudo-header `:authority` o el header `host`. Preferir `:authority` al construir una solicitud HTTP/2 directamente, y `host` al convertir desde HTTP/1 (en proxies, por ejemplo).

La API de compatibilidad recurre a `host` si `:authority` no está presente. Consulte [`request.authority`](/es/nodejs/api/http2#requestauthority) para obtener más información. Sin embargo, si no utiliza la API de compatibilidad (o utiliza `req.headers` directamente), debe implementar cualquier comportamiento de respaldo usted mismo.

