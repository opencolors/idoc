---
title: Documentación de Node.js - dgram
description: El módulo dgram proporciona una implementación de sockets de datagramas UDP, permitiendo la creación de aplicaciones cliente y servidor que pueden enviar y recibir paquetes de datagramas.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - dgram | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: El módulo dgram proporciona una implementación de sockets de datagramas UDP, permitiendo la creación de aplicaciones cliente y servidor que pueden enviar y recibir paquetes de datagramas.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - dgram | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: El módulo dgram proporciona una implementación de sockets de datagramas UDP, permitiendo la creación de aplicaciones cliente y servidor que pueden enviar y recibir paquetes de datagramas.
---


# Sockets UDP/datagrama {#udp/datagram-sockets}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código fuente:** [lib/dgram.js](https://github.com/nodejs/node/blob/v23.5.0/lib/dgram.js)

El módulo `node:dgram` proporciona una implementación de sockets de datagramas UDP.

::: code-group
```js [ESM]
import dgram from 'node:dgram';

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`error del servidor:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`el servidor recibió: ${msg} de ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`servidor escuchando ${address.address}:${address.port}`);
});

server.bind(41234);
// Imprime: servidor escuchando 0.0.0.0:41234
```

```js [CJS]
const dgram = require('node:dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`error del servidor:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`el servidor recibió: ${msg} de ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`servidor escuchando ${address.address}:${address.port}`);
});

server.bind(41234);
// Imprime: servidor escuchando 0.0.0.0:41234
```
:::

## Clase: `dgram.Socket` {#class-dgramsocket}

**Agregado en: v0.1.99**

- Extiende: [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter)

Encapsula la funcionalidad de datagrama.

Las nuevas instancias de `dgram.Socket` se crean utilizando [`dgram.createSocket()`](/es/nodejs/api/dgram#dgramcreatesocketoptions-callback). La palabra clave `new` no debe usarse para crear instancias de `dgram.Socket`.

### Evento: `'close'` {#event-close}

**Agregado en: v0.1.99**

El evento `'close'` se emite después de que un socket se cierra con [`close()`](/es/nodejs/api/dgram#socketclosecallback). Una vez activado, no se emitirán nuevos eventos `'message'` en este socket.

### Evento: `'connect'` {#event-connect}

**Agregado en: v12.0.0**

El evento `'connect'` se emite después de que un socket se asocia a una dirección remota como resultado de una llamada exitosa a [`connect()`](/es/nodejs/api/dgram#socketconnectport-address-callback).


### Evento: `'error'` {#event-error}

**Añadido en: v0.1.99**

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

El evento `'error'` se emite cuando ocurre cualquier error. La función de controlador de eventos recibe un único objeto `Error`.

### Evento: `'listening'` {#event-listening}

**Añadido en: v0.1.99**

El evento `'listening'` se emite una vez que el `dgram.Socket` es direccionable y puede recibir datos. Esto ocurre explícitamente con `socket.bind()` o implícitamente la primera vez que se envían datos utilizando `socket.send()`. Hasta que el `dgram.Socket` esté escuchando, los recursos subyacentes del sistema no existen y las llamadas como `socket.address()` y `socket.setTTL()` fallarán.

### Evento: `'message'` {#event-message}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.4.0 | La propiedad `family` ahora devuelve una cadena en lugar de un número. |
| v18.0.0 | La propiedad `family` ahora devuelve un número en lugar de una cadena. |
| v0.1.99 | Añadido en: v0.1.99 |
:::

El evento `'message'` se emite cuando un nuevo datagrama está disponible en un socket. La función de controlador de eventos recibe dos argumentos: `msg` y `rinfo`.

- `msg` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) El mensaje.
- `rinfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Información de la dirección remota.
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La dirección del remitente.
    - `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La familia de direcciones (`'IPv4'` o `'IPv6'`).
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El puerto del remitente.
    - `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El tamaño del mensaje.



Si la dirección de origen del paquete entrante es una dirección IPv6 link-local, el nombre de la interfaz se añade a la `address`. Por ejemplo, un paquete recibido en la interfaz `en0` podría tener el campo de dirección establecido en `'fe80::2618:1234:ab11:3b9c%en0'`, donde `'%en0'` es el nombre de la interfaz como un sufijo de ID de zona.


### `socket.addMembership(multicastAddress[, multicastInterface])` {#socketaddmembershipmulticastaddress-multicastinterface}

**Añadido en: v0.6.9**

- `multicastAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Le indica al kernel que se una a un grupo multicast en la `multicastAddress` y `multicastInterface` dadas utilizando la opción de socket `IP_ADD_MEMBERSHIP`. Si el argumento `multicastInterface` no se especifica, el sistema operativo elegirá una interfaz y agregará la membresía a ella. Para agregar membresía a cada interfaz disponible, llame a `addMembership` varias veces, una vez por interfaz.

Cuando se llama en un socket no vinculado, este método se vinculará implícitamente a un puerto aleatorio, escuchando en todas las interfaces.

Cuando se comparte un socket UDP entre varios workers de `cluster`, la función `socket.addMembership()` debe llamarse solo una vez o se producirá un error `EADDRINUSE`:

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import dgram from 'node:dgram';

if (cluster.isPrimary) {
  cluster.fork(); // Funciona ok.
  cluster.fork(); // Falla con EADDRINUSE.
} else {
  const s = dgram.createSocket('udp4');
  s.bind(1234, () => {
    s.addMembership('224.0.0.114');
  });
}
```

```js [CJS]
const cluster = require('node:cluster');
const dgram = require('node:dgram');

if (cluster.isPrimary) {
  cluster.fork(); // Funciona ok.
  cluster.fork(); // Falla con EADDRINUSE.
} else {
  const s = dgram.createSocket('udp4');
  s.bind(1234, () => {
    s.addMembership('224.0.0.114');
  });
}
```
:::

### `socket.addSourceSpecificMembership(sourceAddress, groupAddress[, multicastInterface])` {#socketaddsourcespecificmembershipsourceaddress-groupaddress-multicastinterface}

**Añadido en: v13.1.0, v12.16.0**

- `sourceAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `groupAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Le indica al kernel que se una a un canal multicast específico de la fuente en la `sourceAddress` y `groupAddress` dadas, utilizando la `multicastInterface` con la opción de socket `IP_ADD_SOURCE_MEMBERSHIP`. Si el argumento `multicastInterface` no se especifica, el sistema operativo elegirá una interfaz y agregará la membresía a ella. Para agregar membresía a cada interfaz disponible, llame a `socket.addSourceSpecificMembership()` varias veces, una vez por interfaz.

Cuando se llama en un socket no vinculado, este método se vinculará implícitamente a un puerto aleatorio, escuchando en todas las interfaces.


### `socket.address()` {#socketaddress}

**Agregado en: v0.1.99**

- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Devuelve un objeto que contiene la información de la dirección de un socket. Para los sockets UDP, este objeto contendrá las propiedades `address`, `family` y `port`.

Este método lanza `EBADF` si se llama en un socket no enlazado.

### `socket.bind([port][, address][, callback])` {#socketbindport-address-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v0.9.1 | El método se cambió a un modelo de ejecución asíncrono. El código heredado necesitaría ser cambiado para pasar una función de callback a la llamada del método. |
| v0.1.99 | Agregado en: v0.1.99 |
:::

- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) sin parámetros. Se llama cuando el enlace está completo.

Para los sockets UDP, hace que el `dgram.Socket` escuche mensajes de datagramas en un `port` nombrado y una `address` opcional. Si `port` no se especifica o es `0`, el sistema operativo intentará enlazar a un puerto aleatorio. Si `address` no se especifica, el sistema operativo intentará escuchar en todas las direcciones. Una vez que el enlace se completa, se emite un evento `'listening'` y se llama a la función `callback` opcional.

Especificar tanto un listener de eventos `'listening'` como pasar un `callback` al método `socket.bind()` no es dañino pero no es muy útil.

Un socket de datagramas enlazado mantiene el proceso de Node.js en ejecución para recibir mensajes de datagramas.

Si el enlace falla, se genera un evento `'error'`. En casos raros (por ejemplo, intentar enlazar con un socket cerrado), se puede lanzar un [`Error`](/es/nodejs/api/errors#class-error).

Ejemplo de un servidor UDP escuchando en el puerto 41234:

::: code-group
```js [ESM]
import dgram from 'node:dgram';

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
// Prints: server listening 0.0.0.0:41234
```

```js [CJS]
const dgram = require('node:dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
// Prints: server listening 0.0.0.0:41234
```
:::


### `socket.bind(options[, callback])` {#socketbindoptions-callback}

**Agregado en: v0.11.14**

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Requerido. Admite las siguientes propiedades:
    - `port` [\<entero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `fd` [\<entero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


- `callback` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Para los sockets UDP, hace que el `dgram.Socket` escuche mensajes de datagramas en un `port` nombrado y una `address` opcional que se pasan como propiedades de un objeto `options` que se pasa como primer argumento. Si no se especifica `port` o es `0`, el sistema operativo intentará enlazarse a un puerto aleatorio. Si no se especifica `address`, el sistema operativo intentará escuchar en todas las direcciones. Una vez que se completa el enlace, se emite un evento `'listening'` y se llama a la función `callback` opcional.

El objeto `options` puede contener una propiedad `fd`. Cuando se establece un `fd` mayor que `0`, se envolverá alrededor de un socket existente con el descriptor de archivo dado. En este caso, las propiedades de `port` y `address` se ignorarán.

Especificar tanto un listener de eventos `'listening'` como pasar un `callback` al método `socket.bind()` no es dañino pero no es muy útil.

El objeto `options` puede contener una propiedad `exclusive` adicional que se utiliza al usar objetos `dgram.Socket` con el módulo [`cluster`](/es/nodejs/api/cluster). Cuando `exclusive` se establece en `false` (el valor predeterminado), los trabajadores del clúster utilizarán el mismo identificador de socket subyacente, lo que permitirá que se compartan las tareas de gestión de conexiones. Sin embargo, cuando `exclusive` es `true`, el identificador no se comparte y el intento de compartir el puerto da como resultado un error. Crear un `dgram.Socket` con la opción `reusePort` establecida en `true` hace que `exclusive` siempre sea `true` cuando se llama a `socket.bind()`.

Un socket de datagrama enlazado mantiene el proceso de Node.js en ejecución para recibir mensajes de datagrama.

Si falla el enlace, se genera un evento `'error'`. En casos raros (por ejemplo, intentar enlazar con un socket cerrado), se puede arrojar un [`Error`](/es/nodejs/api/errors#class-error).

A continuación, se muestra un ejemplo de socket que escucha en un puerto exclusivo.

```js [ESM]
socket.bind({
  address: 'localhost',
  port: 8000,
  exclusive: true,
});
```

### `socket.close([callback])` {#socketclosecallback}

**Agregado en: v0.1.99**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se llama cuando el socket se ha cerrado.

Cierra el socket subyacente y deja de escuchar datos en él. Si se proporciona un callback, se agrega como un listener para el evento [`'close'`](/es/nodejs/api/dgram#event-close).

### `socket[Symbol.asyncDispose]()` {#socketsymbolasyncdispose}

**Agregado en: v20.5.0, v18.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Llama a [`socket.close()`](/es/nodejs/api/dgram#socketclosecallback) y devuelve una promesa que se cumple cuando el socket se ha cerrado.

### `socket.connect(port[, address][, callback])` {#socketconnectport-address-callback}

**Agregado en: v12.0.0**

- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se llama cuando la conexión se completa o en caso de error.

Asocia el `dgram.Socket` a una dirección y puerto remotos. Cada mensaje enviado por este controlador se envía automáticamente a ese destino. Además, el socket solo recibirá mensajes de ese par remoto. Intentar llamar a `connect()` en un socket ya conectado resultará en una excepción [`ERR_SOCKET_DGRAM_IS_CONNECTED`](/es/nodejs/api/errors#err_socket_dgram_is_connected). Si no se proporciona `address`, se utilizará `'127.0.0.1'` (para sockets `udp4`) o `'::1'` (para sockets `udp6`) de forma predeterminada. Una vez que se completa la conexión, se emite un evento `'connect'` y se llama a la función `callback` opcional. En caso de fallo, se llama al `callback` o, en su defecto, se emite un evento `'error'`.

### `socket.disconnect()` {#socketdisconnect}

**Agregado en: v12.0.0**

Una función síncrona que desasocia un `dgram.Socket` conectado de su dirección remota. Intentar llamar a `disconnect()` en un socket no enlazado o ya desconectado resultará en una excepción [`ERR_SOCKET_DGRAM_NOT_CONNECTED`](/es/nodejs/api/errors#err_socket_dgram_not_connected).


### `socket.dropMembership(multicastAddress[, multicastInterface])` {#socketdropmembershipmulticastaddress-multicastinterface}

**Agregado en: v0.6.9**

- `multicastAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Indica al kernel que abandone un grupo de multidifusión en `multicastAddress` utilizando la opción de socket `IP_DROP_MEMBERSHIP`. El kernel llama automáticamente a este método cuando se cierra el socket o finaliza el proceso, por lo que la mayoría de las aplicaciones nunca tendrán motivos para llamar a este.

Si no se especifica `multicastInterface`, el sistema operativo intentará abandonar la membresía en todas las interfaces válidas.

### `socket.dropSourceSpecificMembership(sourceAddress, groupAddress[, multicastInterface])` {#socketdropsourcespecificmembershipsourceaddress-groupaddress-multicastinterface}

**Agregado en: v13.1.0, v12.16.0**

- `sourceAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `groupAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Indica al kernel que abandone un canal de multidifusión específico de origen en la `sourceAddress` y `groupAddress` dadas utilizando la opción de socket `IP_DROP_SOURCE_MEMBERSHIP`. El kernel llama automáticamente a este método cuando se cierra el socket o finaliza el proceso, por lo que la mayoría de las aplicaciones nunca tendrán motivos para llamar a este.

Si no se especifica `multicastInterface`, el sistema operativo intentará abandonar la membresía en todas las interfaces válidas.

### `socket.getRecvBufferSize()` {#socketgetrecvbuffersize}

**Agregado en: v8.7.0**

- Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) el tamaño del búfer de recepción del socket `SO_RCVBUF` en bytes.

Este método arroja [`ERR_SOCKET_BUFFER_SIZE`](/es/nodejs/api/errors#err_socket_buffer_size) si se llama en un socket no vinculado.

### `socket.getSendBufferSize()` {#socketgetsendbuffersize}

**Agregado en: v8.7.0**

- Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) el tamaño del búfer de envío del socket `SO_SNDBUF` en bytes.

Este método arroja [`ERR_SOCKET_BUFFER_SIZE`](/es/nodejs/api/errors#err_socket_buffer_size) si se llama en un socket no vinculado.


### `socket.getSendQueueSize()` {#socketgetsendqueuesize}

**Añadido en: v18.8.0, v16.19.0**

- Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes en cola para enviar.

### `socket.getSendQueueCount()` {#socketgetsendqueuecount}

**Añadido en: v18.8.0, v16.19.0**

- Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de solicitudes de envío actualmente en la cola esperando ser procesadas.

### `socket.ref()` {#socketref}

**Añadido en: v0.9.1**

- Devuelve: [\<dgram.Socket\>](/es/nodejs/api/dgram#class-dgramsocket)

Por defecto, vincular un socket hará que bloquee la salida del proceso de Node.js mientras el socket esté abierto. El método `socket.unref()` puede usarse para excluir el socket del conteo de referencias que mantiene activo el proceso de Node.js. El método `socket.ref()` añade el socket de nuevo al conteo de referencias y restaura el comportamiento predeterminado.

Llamar a `socket.ref()` varias veces no tendrá ningún efecto adicional.

El método `socket.ref()` devuelve una referencia al socket para que las llamadas puedan ser encadenadas.

### `socket.remoteAddress()` {#socketremoteaddress}

**Añadido en: v12.0.0**

- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Devuelve un objeto que contiene la `address`, la `family`, y el `port` del punto final remoto. Este método lanza una excepción [`ERR_SOCKET_DGRAM_NOT_CONNECTED`](/es/nodejs/api/errors#err_socket_dgram_not_connected) si el socket no está conectado.

### `socket.send(msg[, offset, length][, port][, address][, callback])` {#socketsendmsg-offset-length-port-address-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.0.0 | El parámetro `address` ahora solo acepta un `string`, `null` o `undefined`. |
| v14.5.0, v12.19.0 | El parámetro `msg` ahora puede ser cualquier `TypedArray` o `DataView`. |
| v12.0.0 | Se agregó soporte para enviar datos en sockets conectados. |
| v8.0.0 | El parámetro `msg` ahora puede ser un `Uint8Array`. |
| v8.0.0 | El parámetro `address` ahora siempre es opcional. |
| v6.0.0 | Si tiene éxito, se llamará a `callback` con un argumento `error` de `null` en lugar de `0`. |
| v5.7.0 | El parámetro `msg` ahora puede ser un array. Además, los parámetros `offset` y `length` ahora son opcionales. |
| v0.1.99 | Añadido en: v0.1.99 |
:::

- `msg` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Mensaje que se va a enviar.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Offset en el buffer donde comienza el mensaje.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes en el mensaje.
- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Puerto de destino.
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre de host o dirección IP de destino.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se llama cuando el mensaje ha sido enviado.

Transmite un datagrama en el socket. Para los sockets sin conexión, se debe especificar el `port` y la `address` de destino. Los sockets conectados, por otro lado, usarán su punto final remoto asociado, por lo que los argumentos `port` y `address` no deben establecerse.

El argumento `msg` contiene el mensaje que se va a enviar. Dependiendo de su tipo, se puede aplicar un comportamiento diferente. Si `msg` es un `Buffer`, cualquier `TypedArray` o un `DataView`, el `offset` y la `length` especifican el offset dentro del `Buffer` donde comienza el mensaje y el número de bytes en el mensaje, respectivamente. Si `msg` es un `String`, entonces se convierte automáticamente a un `Buffer` con codificación `'utf8'`. Con mensajes que contienen caracteres multibyte, `offset` y `length` se calcularán con respecto a la [longitud en bytes](/es/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding) y no a la posición del carácter. Si `msg` es un array, `offset` y `length` no deben especificarse.

El argumento `address` es una cadena. Si el valor de `address` es un nombre de host, se utilizará DNS para resolver la dirección del host. Si no se proporciona `address` o es nulo, `'127.0.0.1'` (para sockets `udp4`) o `'::1'` (para sockets `udp6`) se utilizará por defecto.

Si el socket no ha sido previamente vinculado con una llamada a `bind`, el socket se asigna un número de puerto aleatorio y se vincula a la dirección "todas las interfaces" (`'0.0.0.0'` para sockets `udp4`, `'::0'` para sockets `udp6`.)

Se puede especificar una función `callback` opcional como una forma de informar errores de DNS o para determinar cuándo es seguro reutilizar el objeto `buf`. Las búsquedas de DNS retrasan el tiempo de envío durante al menos un ciclo del bucle de eventos de Node.js.

La única manera de saber con seguridad que el datagrama ha sido enviado es usando una `callback`. Si ocurre un error y se da una `callback`, el error se pasará como el primer argumento a la `callback`. Si no se proporciona una `callback`, el error se emite como un evento `'error'` en el objeto `socket`.

El offset y la length son opcionales, pero *ambos* deben establecerse si se utiliza alguno de ellos. Solo se admiten cuando el primer argumento es un `Buffer`, un `TypedArray` o un `DataView`.

Este método lanza [`ERR_SOCKET_BAD_PORT`](/es/nodejs/api/errors#err_socket_bad_port) si se llama en un socket no vinculado.

Ejemplo de envío de un paquete UDP a un puerto en `localhost`:

::: code-group
```js [ESM]
import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.send(message, 41234, 'localhost', (err) => {
  client.close();
});
```

```js [CJS]
const dgram = require('node:dgram');
const { Buffer } = require('node:buffer');

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.send(message, 41234, 'localhost', (err) => {
  client.close();
});
```
:::

Ejemplo de envío de un paquete UDP compuesto de múltiples buffers a un puerto en `127.0.0.1`:

::: code-group
```js [ESM]
import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('Some ');
const buf2 = Buffer.from('bytes');
const client = dgram.createSocket('udp4');
client.send([buf1, buf2], 41234, (err) => {
  client.close();
});
```

```js [CJS]
const dgram = require('node:dgram');
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('Some ');
const buf2 = Buffer.from('bytes');
const client = dgram.createSocket('udp4');
client.send([buf1, buf2], 41234, (err) => {
  client.close();
});
```
:::

El envío de múltiples buffers puede ser más rápido o más lento dependiendo de la aplicación y el sistema operativo. Ejecute benchmarks para determinar la estrategia óptima caso por caso. Sin embargo, en términos generales, el envío de múltiples buffers es más rápido.

Ejemplo de envío de un paquete UDP usando un socket conectado a un puerto en `localhost`:

::: code-group
```js [ESM]
import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.connect(41234, 'localhost', (err) => {
  client.send(message, (err) => {
    client.close();
  });
});
```

```js [CJS]
const dgram = require('node:dgram');
const { Buffer } = require('node:buffer');

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.connect(41234, 'localhost', (err) => {
  client.send(message, (err) => {
    client.close();
  });
});
```
:::


#### Nota sobre el tamaño de los datagramas UDP {#note-about-udp-datagram-size}

El tamaño máximo de un datagrama IPv4/v6 depende de la `MTU` (Unidad de Transmisión Máxima) y del tamaño del campo `Longitud de la Carga Útil`.

- El campo `Longitud de la Carga Útil` tiene un ancho de 16 bits, lo que significa que una carga útil normal no puede exceder los 64K octetos, incluyendo la cabecera de internet y los datos (65,507 bytes = 65,535 − 8 bytes de cabecera UDP − 20 bytes de cabecera IP); esto es generalmente cierto para las interfaces de bucle invertido, pero tales mensajes de datagramas largos son imprácticos para la mayoría de los hosts y redes.
- La `MTU` es el tamaño más grande que una tecnología de capa de enlace dada puede soportar para los mensajes de datagramas. Para cualquier enlace, IPv4 exige una `MTU` mínima de 68 octetos, mientras que la `MTU` recomendada para IPv4 es de 576 (típicamente recomendada como la `MTU` para aplicaciones de tipo dial-up), ya sea que lleguen completas o en fragmentos. Para IPv6, la `MTU` mínima es de 1280 octetos. Sin embargo, el tamaño mínimo obligatorio del búfer de reensamblaje de fragmentos es de 1500 octetos. El valor de 68 octetos es muy pequeño, ya que la mayoría de las tecnologías de capa de enlace actuales, como Ethernet, tienen una `MTU` mínima de 1500.

Es imposible saber de antemano la MTU de cada enlace a través del cual podría viajar un paquete. Enviar un datagrama mayor que la `MTU` del receptor no funcionará porque el paquete se descartará silenciosamente sin informar a la fuente que los datos no llegaron a su destinatario previsto.

### `socket.setBroadcast(flag)` {#socketsetbroadcastflag}

**Añadido en: v0.6.9**

- `flag` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Establece o borra la opción de socket `SO_BROADCAST`. Cuando se establece en `true`, los paquetes UDP pueden ser enviados a la dirección de broadcast de una interfaz local.

Este método lanza `EBADF` si se llama a un socket no enlazado.

### `socket.setMulticastInterface(multicastInterface)` {#socketsetmulticastinterfacemulticastinterface}

**Añadido en: v8.6.0**

- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

*Todas las referencias al alcance en esta sección se refieren a
<a href="https://en.wikipedia.org/wiki/IPv6_address#Scoped_literal_IPv6_addresses">Índices de Zona IPv6</a>, que están definidos por <a href="https://tools.ietf.org/html/rfc4007">RFC 4007</a>. En forma de cadena, una IP
con un índice de alcance se escribe como <code>'IP%scope'</code> donde scope es un nombre de interfaz
o número de interfaz.*

Establece la interfaz de multidifusión saliente predeterminada del socket a una interfaz elegida o de vuelta a la selección de interfaz del sistema. La `multicastInterface` debe ser una representación de cadena válida de una IP de la familia del socket.

Para sockets IPv4, esta debe ser la IP configurada para la interfaz física deseada. Todos los paquetes enviados a multidifusión en el socket serán enviados en la interfaz determinada por el uso exitoso más reciente de esta llamada.

Para sockets IPv6, `multicastInterface` debe incluir un alcance para indicar la interfaz como en los ejemplos que siguen. En IPv6, las llamadas `send` individuales también pueden usar un alcance explícito en las direcciones, por lo que solo los paquetes enviados a una dirección de multidifusión sin especificar un alcance explícito se ven afectados por el uso exitoso más reciente de esta llamada.

Este método lanza `EBADF` si se llama a un socket no enlazado.


#### Ejemplo: Interfaz de multidifusión saliente IPv6 {#example-ipv6-outgoing-multicast-interface}

En la mayoría de los sistemas, donde el formato de ámbito utiliza el nombre de la interfaz:

```js [ESM]
const socket = dgram.createSocket('udp6');

socket.bind(1234, () => {
  socket.setMulticastInterface('::%eth1');
});
```
En Windows, donde el formato de ámbito utiliza un número de interfaz:

```js [ESM]
const socket = dgram.createSocket('udp6');

socket.bind(1234, () => {
  socket.setMulticastInterface('::%2');
});
```
#### Ejemplo: Interfaz de multidifusión saliente IPv4 {#example-ipv4-outgoing-multicast-interface}

Todos los sistemas utilizan una IP del host en la interfaz física deseada:

```js [ESM]
const socket = dgram.createSocket('udp4');

socket.bind(1234, () => {
  socket.setMulticastInterface('10.0.0.2');
});
```
#### Resultados de la llamada {#call-results}

Una llamada en un socket que no está listo para enviar o que ya no está abierto puede lanzar un [`Error`](/es/nodejs/api/errors#class-error) de tipo *Not running*.

Si `multicastInterface` no se puede analizar en una IP, se lanza un [`System Error`](/es/nodejs/api/errors#class-systemerror) de tipo *EINVAL*.

En IPv4, si `multicastInterface` es una dirección válida pero no coincide con ninguna interfaz, o si la dirección no coincide con la familia, se lanza un [`System Error`](/es/nodejs/api/errors#class-systemerror) como `EADDRNOTAVAIL` o `EPROTONOSUP`.

En IPv6, la mayoría de los errores al especificar u omitir el ámbito harán que el socket continúe utilizando (o volviendo a) la selección de interfaz predeterminada del sistema.

La dirección ANY de la familia de direcciones de un socket (IPv4 `'0.0.0.0'` o IPv6 `'::'`) se puede utilizar para devolver el control de la interfaz saliente predeterminada de los sockets al sistema para futuros paquetes de multidifusión.

### `socket.setMulticastLoopback(flag)` {#socketsetmulticastloopbackflag}

**Agregado en: v0.3.8**

- `flag` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Establece o borra la opción de socket `IP_MULTICAST_LOOP`. Cuando se establece en `true`, los paquetes de multidifusión también se recibirán en la interfaz local.

Este método lanza `EBADF` si se llama en un socket no vinculado.

### `socket.setMulticastTTL(ttl)` {#socketsetmulticastttlttl}

**Agregado en: v0.3.8**

- `ttl` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Establece la opción de socket `IP_MULTICAST_TTL`. Si bien TTL generalmente significa "Tiempo de vida", en este contexto especifica el número de saltos IP que un paquete puede viajar, específicamente para el tráfico de multidifusión. Cada enrutador o puerta de enlace que reenvía un paquete disminuye el TTL. Si el TTL se reduce a 0 por un enrutador, no se reenviará.

El argumento `ttl` puede estar entre 0 y 255. El valor predeterminado en la mayoría de los sistemas es `1`.

Este método lanza `EBADF` si se llama en un socket no vinculado.


### `socket.setRecvBufferSize(tamaño)` {#socketsetrecvbuffersizesize}

**Agregado en: v8.7.0**

- `tamaño` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Establece la opción de socket `SO_RCVBUF`. Establece el búfer de recepción máximo del socket en bytes.

Este método lanza [`ERR_SOCKET_BUFFER_SIZE`](/es/nodejs/api/errors#err_socket_buffer_size) si se llama en un socket no vinculado.

### `socket.setSendBufferSize(tamaño)` {#socketsetsendbuffersizesize}

**Agregado en: v8.7.0**

- `tamaño` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Establece la opción de socket `SO_SNDBUF`. Establece el búfer de envío máximo del socket en bytes.

Este método lanza [`ERR_SOCKET_BUFFER_SIZE`](/es/nodejs/api/errors#err_socket_buffer_size) si se llama en un socket no vinculado.

### `socket.setTTL(ttl)` {#socketsetttlttl}

**Agregado en: v0.1.101**

- `ttl` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Establece la opción de socket `IP_TTL`. Si bien TTL generalmente significa "Tiempo de vida", en este contexto especifica el número de saltos IP que un paquete puede viajar. Cada router o gateway que reenvía un paquete disminuye el TTL. Si el TTL se reduce a 0 por un router, no se reenviará. Los valores de TTL cambiantes se realizan típicamente para las pruebas de red o cuando se realiza multidifusión.

El argumento `ttl` puede estar entre 1 y 255. El valor por defecto en la mayoría de los sistemas es 64.

Este método lanza `EBADF` si se llama en un socket no vinculado.

### `socket.unref()` {#socketunref}

**Agregado en: v0.9.1**

- Devuelve: [\<dgram.Socket\>](/es/nodejs/api/dgram#class-dgramsocket)

Por defecto, vincular un socket hará que bloquee la salida del proceso Node.js mientras el socket esté abierto. El método `socket.unref()` se puede utilizar para excluir el socket del conteo de referencias que mantiene activo el proceso Node.js, permitiendo que el proceso se cierre incluso si el socket todavía está escuchando.

Llamar a `socket.unref()` varias veces no tendrá ningún efecto adicional.

El método `socket.unref()` devuelve una referencia al socket para que las llamadas puedan ser encadenadas.


## Funciones del módulo `node:dgram` {#nodedgram-module-functions}

### `dgram.createSocket(options[, callback])` {#dgramcreatesocketoptions-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.1.0 | Se admite la opción `reusePort`. |
| v15.8.0 | Se añadió soporte para AbortSignal. |
| v11.4.0 | Se admite la opción `ipv6Only`. |
| v8.7.0 | Ahora se admiten las opciones `recvBufferSize` y `sendBufferSize`. |
| v8.6.0 | Se admite la opción `lookup`. |
| v0.11.13 | Añadido en: v0.11.13 |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Las opciones disponibles son:
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La familia del socket. Debe ser `'udp4'` o `'udp6'`. Obligatorio.
    - `reuseAddr` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, [`socket.bind()`](/es/nodejs/api/dgram#socketbindport-address-callback) reutilizará la dirección, incluso si otro proceso ya ha enlazado un socket en ella, pero solo un socket puede recibir los datos. **Predeterminado:** `false`.
    - `reusePort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, [`socket.bind()`](/es/nodejs/api/dgram#socketbindport-address-callback) reutilizará el puerto, incluso si otro proceso ya ha enlazado un socket en él. Los datagramas entrantes se distribuyen a los sockets de escucha. La opción solo está disponible en algunas plataformas, como Linux 3.9+, DragonFlyBSD 3.6+, FreeBSD 12.0+, Solaris 11.4 y AIX 7.2.5+. En plataformas no compatibles, esta opción genera un error cuando se enlaza el socket. **Predeterminado:** `false`.
    - `ipv6Only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Establecer `ipv6Only` a `true` desactivará el soporte de doble pila, es decir, enlazar a la dirección `::` no hará que `0.0.0.0` se enlace. **Predeterminado:** `false`.
    - `recvBufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el valor del socket `SO_RCVBUF`.
    - `sendBufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece el valor del socket `SO_SNDBUF`.
    - `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Función de búsqueda personalizada. **Predeterminado:** [`dns.lookup()`](/es/nodejs/api/dns#dnslookuphostname-options-callback).
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Un AbortSignal que se puede utilizar para cerrar un socket.
    - `receiveBlockList` [\<net.BlockList\>](/es/nodejs/api/net#class-netblocklist) `receiveBlockList` se puede utilizar para descartar datagramas entrantes a direcciones IP específicas, rangos de IP o subredes IP. Esto no funciona si el servidor está detrás de un proxy inverso, NAT, etc., porque la dirección verificada en la lista de bloqueo es la dirección del proxy o la especificada por el NAT.
    - `sendBlockList` [\<net.BlockList\>](/es/nodejs/api/net#class-netblocklist) `sendBlockList` se puede utilizar para deshabilitar el acceso saliente a direcciones IP específicas, rangos de IP o subredes IP.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se adjunta como un listener para los eventos `'message'`. Opcional.
- Devuelve: [\<dgram.Socket\>](/es/nodejs/api/dgram#class-dgramsocket)

Crea un objeto `dgram.Socket`. Una vez que se crea el socket, llamar a [`socket.bind()`](/es/nodejs/api/dgram#socketbindport-address-callback) indicará al socket que comience a escuchar los mensajes de datagramas. Cuando `address` y `port` no se pasan a [`socket.bind()`](/es/nodejs/api/dgram#socketbindport-address-callback), el método enlazará el socket a la dirección "todas las interfaces" en un puerto aleatorio (hace lo correcto tanto para los sockets `udp4` como para los `udp6`). La dirección y el puerto enlazados se pueden recuperar utilizando [`socket.address().address`](/es/nodejs/api/dgram#socketaddress) y [`socket.address().port`](/es/nodejs/api/dgram#socketaddress).

Si la opción `signal` está habilitada, llamar a `.abort()` en el `AbortController` correspondiente es similar a llamar a `.close()` en el socket:

```js [ESM]
const controller = new AbortController();
const { signal } = controller;
const server = dgram.createSocket({ type: 'udp4', signal });
server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});
// Later, when you want to close the server.
controller.abort();
```

### `dgram.createSocket(type[, callback])` {#dgramcreatesockettype-callback}

**Agregado en: v0.1.99**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ya sea `'udp4'` o `'udp6'`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Adjuntada como un oyente a los eventos `'message'`.
- Devuelve: [\<dgram.Socket\>](/es/nodejs/api/dgram#class-dgramsocket)

Crea un objeto `dgram.Socket` del `type` especificado.

Una vez que se crea el socket, llamar a [`socket.bind()`](/es/nodejs/api/dgram#socketbindport-address-callback) indicará al socket que comience a escuchar mensajes de datagramas. Cuando `address` y `port` no se pasan a [`socket.bind()`](/es/nodejs/api/dgram#socketbindport-address-callback), el método vinculará el socket a la dirección de "todas las interfaces" en un puerto aleatorio (hace lo correcto tanto para los sockets `udp4` como para los `udp6`). La dirección y el puerto vinculados se pueden recuperar utilizando [`socket.address().address`](/es/nodejs/api/dgram#socketaddress) y [`socket.address().port`](/es/nodejs/api/dgram#socketaddress).

