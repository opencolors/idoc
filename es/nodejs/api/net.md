---
title: Documentación de Node.js - Red
description: El módulo 'net' en Node.js proporciona una API de red asincrónica para crear servidores y clientes TCP o IPC basados en flujos. Incluye métodos para crear conexiones, servidores y manejar operaciones de socket.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - Red | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: El módulo 'net' en Node.js proporciona una API de red asincrónica para crear servidores y clientes TCP o IPC basados en flujos. Incluye métodos para crear conexiones, servidores y manejar operaciones de socket.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - Red | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: El módulo 'net' en Node.js proporciona una API de red asincrónica para crear servidores y clientes TCP o IPC basados en flujos. Incluye métodos para crear conexiones, servidores y manejar operaciones de socket.
---


# Net {#net}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código Fuente:** [lib/net.js](https://github.com/nodejs/node/blob/v23.5.0/lib/net.js)

El módulo `node:net` proporciona una API de red asíncrona para crear servidores TCP basados en flujos o [IPC](/es/nodejs/api/net#ipc-support) ([`net.createServer()`](/es/nodejs/api/net#netcreateserveroptions-connectionlistener)) y clientes ([`net.createConnection()`](/es/nodejs/api/net#netcreateconnection)).

Se puede acceder utilizando:

::: code-group
```js [ESM]
import net from 'node:net';
```

```js [CJS]
const net = require('node:net');
```
:::

## Soporte IPC {#ipc-support}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.8.0 | Soporte para enlazar a la ruta del socket de dominio Unix abstracto como `\0abstract`. Podemos enlazar '\0' para Node.js `\< v20.4.0`. |
:::

El módulo `node:net` admite IPC con named pipes en Windows y sockets de dominio Unix en otros sistemas operativos.

### Identificación de rutas para conexiones IPC {#identifying-paths-for-ipc-connections}

[`net.connect()`](/es/nodejs/api/net#netconnect), [`net.createConnection()`](/es/nodejs/api/net#netcreateconnection), [`server.listen()`](/es/nodejs/api/net#serverlisten) y [`socket.connect()`](/es/nodejs/api/net#socketconnect) toman un parámetro `path` para identificar los puntos finales de IPC.

En Unix, el dominio local también se conoce como dominio Unix. La ruta es un nombre de ruta del sistema de archivos. Arrojará un error cuando la longitud del nombre de ruta sea mayor que la longitud de `sizeof(sockaddr_un.sun_path)`. Los valores típicos son 107 bytes en Linux y 103 bytes en macOS. Si una abstracción de API de Node.js crea el socket de dominio Unix, también desenlazará el socket de dominio Unix. Por ejemplo, [`net.createServer()`](/es/nodejs/api/net#netcreateserveroptions-connectionlistener) puede crear un socket de dominio Unix y [`server.close()`](/es/nodejs/api/net#serverclosecallback) lo desenlazará. Pero si un usuario crea el socket de dominio Unix fuera de estas abstracciones, el usuario deberá eliminarlo. Lo mismo se aplica cuando una API de Node.js crea un socket de dominio Unix pero el programa falla. En resumen, un socket de dominio Unix será visible en el sistema de archivos y persistirá hasta que se desenlace. En Linux, puede usar el socket abstracto de Unix agregando `\0` al principio de la ruta, como `\0abstract`. La ruta al socket abstracto de Unix no es visible en el sistema de archivos y desaparecerá automáticamente cuando se cierren todas las referencias abiertas al socket.

En Windows, el dominio local se implementa mediante un named pipe. La ruta *debe* referirse a una entrada en `\\?\pipe\` o `\\.\pipe\`. Se permite cualquier carácter, pero este último puede realizar algún procesamiento de nombres de pipes, como resolver secuencias `..`. A pesar de cómo podría parecer, el espacio de nombres del pipe es plano. Los pipes *no persistirán*. Se eliminan cuando se cierra la última referencia a ellos. A diferencia de los sockets de dominio Unix, Windows cerrará y eliminará el pipe cuando el proceso propietario finalice.

El escape de cadenas de JavaScript requiere que las rutas se especifiquen con un escape de barra invertida adicional como:

```js [ESM]
net.createServer().listen(
  path.join('\\\\?\\pipe', process.cwd(), 'myctl'));
```

## Clase: `net.BlockList` {#class-netblocklist}

**Agregada en: v15.0.0, v14.18.0**

El objeto `BlockList` se puede utilizar con algunas API de red para especificar reglas para deshabilitar el acceso entrante o saliente a direcciones IP, rangos de IP o subredes IP específicas.

### `blockList.addAddress(address[, type])` {#blocklistaddaddressaddress-type}

**Agregada en: v15.0.0, v14.18.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/es/nodejs/api/net#class-netsocketaddress) Una dirección IPv4 o IPv6.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ya sea `'ipv4'` o `'ipv6'`. **Predeterminado:** `'ipv4'`.

Agrega una regla para bloquear la dirección IP dada.

### `blockList.addRange(start, end[, type])` {#blocklistaddrangestart-end-type}

**Agregada en: v15.0.0, v14.18.0**

- `start` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/es/nodejs/api/net#class-netsocketaddress) La dirección IPv4 o IPv6 inicial en el rango.
- `end` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/es/nodejs/api/net#class-netsocketaddress) La dirección IPv4 o IPv6 final en el rango.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ya sea `'ipv4'` o `'ipv6'`. **Predeterminado:** `'ipv4'`.

Agrega una regla para bloquear un rango de direcciones IP desde `start` (inclusivo) hasta `end` (inclusivo).

### `blockList.addSubnet(net, prefix[, type])` {#blocklistaddsubnetnet-prefix-type}

**Agregada en: v15.0.0, v14.18.0**

- `net` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/es/nodejs/api/net#class-netsocketaddress) La dirección de red IPv4 o IPv6.
- `prefix` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bits del prefijo CIDR. Para IPv4, este debe ser un valor entre `0` y `32`. Para IPv6, este debe estar entre `0` y `128`.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ya sea `'ipv4'` o `'ipv6'`. **Predeterminado:** `'ipv4'`.

Agrega una regla para bloquear un rango de direcciones IP especificadas como una máscara de subred.


### `blockList.check(address[, type])` {#blocklistcheckaddress-type}

**Agregado en: v15.0.0, v14.18.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/es/nodejs/api/net#class-netsocketaddress) La dirección IP para verificar
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ya sea `'ipv4'` o `'ipv6'`. **Predeterminado:** `'ipv4'`.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si la dirección IP dada coincide con alguna de las reglas agregadas a la `BlockList`.

```js [ESM]
const blockList = new net.BlockList();
blockList.addAddress('123.123.123.123');
blockList.addRange('10.0.0.1', '10.0.0.10');
blockList.addSubnet('8592:757c:efae:4e45::', 64, 'ipv6');

console.log(blockList.check('123.123.123.123'));  // Imprime: true
console.log(blockList.check('10.0.0.3'));  // Imprime: true
console.log(blockList.check('222.111.111.222'));  // Imprime: false

// La notación IPv6 para direcciones IPv4 funciona:
console.log(blockList.check('::ffff:7b7b:7b7b', 'ipv6')); // Imprime: true
console.log(blockList.check('::ffff:123.123.123.123', 'ipv6')); // Imprime: true
```
### `blockList.rules` {#blocklistrules}

**Agregado en: v15.0.0, v14.18.0**

- Tipo: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La lista de reglas añadidas a la lista de bloqueo.

### `BlockList.isBlockList(value)` {#blocklistisblocklistvalue}

**Agregado en: v23.4.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Cualquier valor JS
- Devuelve `true` si el `value` es un `net.BlockList`.

## Clase: `net.SocketAddress` {#class-netsocketaddress}

**Agregado en: v15.14.0, v14.18.0**

### `new net.SocketAddress([options])` {#new-netsocketaddressoptions}

**Agregado en: v15.14.0, v14.18.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La dirección de red como una cadena IPv4 o IPv6. **Predeterminado**: `'127.0.0.1'` si `family` es `'ipv4'`; `'::'` si `family` es `'ipv6'`.
    - `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uno de `'ipv4'` o `'ipv6'`. **Predeterminado**: `'ipv4'`.
    - `flowlabel` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Una etiqueta de flujo IPv6 utilizada solo si `family` es `'ipv6'`.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un puerto IP.


### `socketaddress.address` {#socketaddressaddress}

**Agregado en: v15.14.0, v14.18.0**

- Tipo [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### `socketaddress.family` {#socketaddressfamily}

**Agregado en: v15.14.0, v14.18.0**

- Tipo [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ya sea `'ipv4'` o `'ipv6'`.

### `socketaddress.flowlabel` {#socketaddressflowlabel}

**Agregado en: v15.14.0, v14.18.0**

- Tipo [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### `socketaddress.port` {#socketaddressport}

**Agregado en: v15.14.0, v14.18.0**

- Tipo [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### `SocketAddress.parse(input)` {#socketaddressparseinput}

**Agregado en: v23.4.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una cadena de entrada que contiene una dirección IP y un puerto opcional, por ejemplo, `123.1.2.3:1234` o `[1::1]:1234`.
- Devuelve: [\<net.SocketAddress\>](/es/nodejs/api/net#class-netsocketaddress) Devuelve un `SocketAddress` si el análisis fue exitoso. De lo contrario, devuelve `undefined`.

## Clase: `net.Server` {#class-netserver}

**Agregado en: v0.1.90**

- Extiende: [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter)

Esta clase se utiliza para crear un servidor TCP o [IPC](/es/nodejs/api/net#ipc-support).

### `new net.Server([options][, connectionListener])` {#new-netserveroptions-connectionlistener}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ver [`net.createServer([options][, connectionListener])`](/es/nodejs/api/net#netcreateserveroptions-connectionlistener).
- `connectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se establece automáticamente como un listener para el evento [`'connection'`](/es/nodejs/api/net#event-connection).
- Devuelve: [\<net.Server\>](/es/nodejs/api/net#class-netserver)

`net.Server` es un [`EventEmitter`](/es/nodejs/api/events#class-eventemitter) con los siguientes eventos:

### Evento: `'close'` {#event-close}

**Agregado en: v0.5.0**

Se emite cuando el servidor se cierra. Si existen conexiones, este evento no se emite hasta que todas las conexiones hayan finalizado.


### Evento: `'connection'` {#event-connection}

**Agregado en: v0.1.90**

- [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) El objeto de conexión

Emitido cuando se realiza una nueva conexión. `socket` es una instancia de `net.Socket`.

### Evento: `'error'` {#event-error}

**Agregado en: v0.1.90**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emitido cuando ocurre un error. A diferencia de [`net.Socket`](/es/nodejs/api/net#class-netsocket), el evento [`'close'`](/es/nodejs/api/net#event-close) **no** se emitirá directamente después de este evento a menos que se llame manualmente a [`server.close()`](/es/nodejs/api/net#serverclosecallback). Consulte el ejemplo en la discusión de [`server.listen()`](/es/nodejs/api/net#serverlisten).

### Evento: `'listening'` {#event-listening}

**Agregado en: v0.1.90**

Emitido cuando el servidor se ha enlazado después de llamar a [`server.listen()`](/es/nodejs/api/net#serverlisten).

### Evento: `'drop'` {#event-drop}

**Agregado en: v18.6.0, v16.17.0**

Cuando el número de conexiones alcanza el umbral de `server.maxConnections`, el servidor descartará nuevas conexiones y emitirá el evento `'drop'` en su lugar. Si es un servidor TCP, el argumento es el siguiente, de lo contrario el argumento es `undefined`.

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El argumento pasado al escuchador de eventos.
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Dirección local.
    - `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Puerto local.
    - `localFamily` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Familia local.
    - `remoteAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Dirección remota.
    - `remotePort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Puerto remoto.
    - `remoteFamily` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Familia de IP remota. `'IPv4'` o `'IPv6'`.


### `server.address()` {#serveraddress}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.4.0 | La propiedad `family` ahora devuelve una cadena en lugar de un número. |
| v18.0.0 | La propiedad `family` ahora devuelve un número en lugar de una cadena. |
| v0.1.90 | Añadido en: v0.1.90 |
:::

- Devuelve: [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<cadena\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<nulo\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Devuelve la `dirección` enlazada, el nombre de la `family` de la dirección y el `puerto` del servidor tal como lo informa el sistema operativo si está escuchando en un socket IP (útil para averiguar qué puerto se asignó al obtener una dirección asignada por el sistema operativo): `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`.

Para un servidor que escucha en una tubería o socket de dominio Unix, el nombre se devuelve como una cadena.

```js [ESM]
const server = net.createServer((socket) => {
  socket.end('adiós\n');
}).on('error', (err) => {
  // Manejar errores aquí.
  throw err;
});

// Tomar un puerto arbitrario no utilizado.
server.listen(() => {
  console.log('servidor abierto en', server.address());
});
```
`server.address()` devuelve `null` antes de que se haya emitido el evento `'listening'` o después de llamar a `server.close()`.

### `server.close([callback])` {#serverclosecallback}

**Añadido en: v0.1.90**

- `callback` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se llama cuando se cierra el servidor.
- Devuelve: [\<net.Server\>](/es/nodejs/api/net#class-netserver)

Impide que el servidor acepte nuevas conexiones y mantiene las conexiones existentes. Esta función es asíncrona, el servidor finalmente se cierra cuando todas las conexiones finalizan y el servidor emite un evento [`'close'`](/es/nodejs/api/net#event-close). La `callback` opcional se llamará una vez que se produzca el evento `'close'`. A diferencia de ese evento, se llamará con un `Error` como su único argumento si el servidor no estaba abierto cuando se cerró.


### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Agregado en: v20.5.0, v18.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Llama a [`server.close()`](/es/nodejs/api/net#serverclosecallback) y devuelve una promesa que se cumple cuando el servidor se ha cerrado.

### `server.getConnections(callback)` {#servergetconnectionscallback}

**Agregado en: v0.9.7**

- `callback` [\<Función\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<net.Server\>](/es/nodejs/api/net#class-netserver)

Obtiene de forma asíncrona el número de conexiones simultáneas en el servidor. Funciona cuando los sockets se enviaron a forks.

El callback debe tomar dos argumentos `err` y `count`.

### `server.listen()` {#serverlisten}

Inicia un servidor que escucha las conexiones. Un `net.Server` puede ser un servidor TCP o un servidor [IPC](/es/nodejs/api/net#ipc-support) dependiendo de lo que escuche.

Posibles firmas:

- [`server.listen(handle[, backlog][, callback])`](/es/nodejs/api/net#serverlistenhandle-backlog-callback)
- [`server.listen(options[, callback])`](/es/nodejs/api/net#serverlistenoptions-callback)
- [`server.listen(path[, backlog][, callback])`](/es/nodejs/api/net#serverlistenpath-backlog-callback) para servidores [IPC](/es/nodejs/api/net#ipc-support)
- [`server.listen([port[, host[, backlog]]][, callback])`](/es/nodejs/api/net#serverlistenport-host-backlog-callback) para servidores TCP

Esta función es asíncrona. Cuando el servidor comienza a escuchar, se emitirá el evento [`'listening'`](/es/nodejs/api/net#event-listening). El último parámetro `callback` se añadirá como listener para el evento [`'listening'`](/es/nodejs/api/net#event-listening).

Todos los métodos `listen()` pueden tomar un parámetro `backlog` para especificar la longitud máxima de la cola de conexiones pendientes. La longitud real será determinada por el SO a través de ajustes sysctl como `tcp_max_syn_backlog` y `somaxconn` en Linux. El valor predeterminado de este parámetro es 511 (no 512).

Todos los [`net.Socket`](/es/nodejs/api/net#class-netsocket) se establecen en `SO_REUSEADDR` (ver [`socket(7)`](https://man7.org/linux/man-pages/man7/socket.7) para más detalles).

El método `server.listen()` puede ser llamado de nuevo si y sólo si hubo un error durante la primera llamada a `server.listen()` o `server.close()` ha sido llamado. De lo contrario, se lanzará un error `ERR_SERVER_ALREADY_LISTEN`.

Uno de los errores más comunes que se producen al escuchar es `EADDRINUSE`. Esto ocurre cuando otro servidor ya está escuchando en el `port`/`path`/`handle` solicitado. Una forma de manejar esto sería reintentar después de un cierto tiempo:

```js [ESM]
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error('Dirección en uso, reintentando...');
    setTimeout(() => {
      server.close();
      server.listen(PORT, HOST);
    }, 1000);
  }
});
```

#### `server.listen(handle[, backlog][, callback])` {#serverlistenhandle-backlog-callback}

**Agregado en: v0.5.10**

- `handle` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parámetro común de las funciones [`server.listen()`](/es/nodejs/api/net#serverlisten)
- `callback` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<net.Server\>](/es/nodejs/api/net#class-netserver)

Inicia un servidor que escucha las conexiones en un `handle` dado que ya se ha enlazado a un puerto, un socket de dominio Unix o una tubería con nombre de Windows.

El objeto `handle` puede ser un servidor, un socket (cualquier cosa con un miembro `_handle` subyacente) o un objeto con un miembro `fd` que sea un descriptor de archivo válido.

La escucha en un descriptor de archivo no es compatible con Windows.

#### `server.listen(options[, callback])` {#serverlistenoptions-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.1.0 | Se admite la opción `reusePort`. |
| v15.6.0 | Se añadió la compatibilidad con AbortSignal. |
| v11.4.0 | Se admite la opción `ipv6Only`. |
| v0.11.14 | Agregado en: v0.11.14 |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Obligatorio. Admite las siguientes propiedades:
    - `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parámetro común de las funciones [`server.listen()`](/es/nodejs/api/net#serverlisten).
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `false`
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `ipv6Only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Para los servidores TCP, establecer `ipv6Only` en `true` desactivará la compatibilidad con doble pila, es decir, enlazar con el host `::` no hará que `0.0.0.0` se enlace. **Predeterminado:** `false`.
    - `reusePort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Para los servidores TCP, establecer `reusePort` en `true` permite que varios sockets en el mismo host se enlacen al mismo puerto. El sistema operativo distribuye las conexiones entrantes a los sockets de escucha. Esta opción solo está disponible en algunas plataformas, como Linux 3.9+, DragonFlyBSD 3.6+, FreeBSD 12.0+, Solaris 11.4 y AIX 7.2.5+. **Predeterminado:** `false`.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se ignorará si se especifica `port`. Véase [Identificación de rutas para conexiones IPC](/es/nodejs/api/net#identifying-paths-for-ipc-connections).
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `readableAll` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Para los servidores IPC, hace que la tubería sea legible para todos los usuarios. **Predeterminado:** `false`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Un AbortSignal que se puede utilizar para cerrar un servidor de escucha.
    - `writableAll` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Para los servidores IPC, hace que la tubería se pueda escribir para todos los usuarios. **Predeterminado:** `false`.


- `callback` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) funciones.
- Devuelve: [\<net.Server\>](/es/nodejs/api/net#class-netserver)

Si se especifica `port`, se comporta de la misma manera que [`server.listen([port[, host[, backlog]]][, callback])`](/es/nodejs/api/net#serverlistenport-host-backlog-callback). De lo contrario, si se especifica `path`, se comporta de la misma manera que [`server.listen(path[, backlog][, callback])`](/es/nodejs/api/net#serverlistenpath-backlog-callback). Si no se especifica ninguno de ellos, se producirá un error.

Si `exclusive` es `false` (predeterminado), entonces los workers del clúster utilizarán el mismo handle subyacente, lo que permitirá que se compartan las tareas de gestión de la conexión. Cuando `exclusive` es `true`, el handle no se comparte y el intento de compartir el puerto provoca un error. A continuación se muestra un ejemplo de escucha en un puerto exclusivo.

```js [ESM]
server.listen({
  host: 'localhost',
  port: 80,
  exclusive: true,
});
```
Cuando `exclusive` es `true` y el handle subyacente se comparte, es posible que varios workers consulten un handle con diferentes backlogs. En este caso, se utilizará el primer `backlog` pasado al proceso maestro.

El inicio de un servidor IPC como root puede hacer que la ruta del servidor sea inaccesible para los usuarios sin privilegios. El uso de `readableAll` y `writableAll` hará que el servidor sea accesible para todos los usuarios.

Si la opción `signal` está habilitada, llamar a `.abort()` en el `AbortController` correspondiente es similar a llamar a `.close()` en el servidor:

```js [ESM]
const controller = new AbortController();
server.listen({
  host: 'localhost',
  port: 80,
  signal: controller.signal,
});
// Más tarde, cuando quieras cerrar el servidor.
controller.abort();
```

#### `server.listen(path[, backlog][, callback])` {#serverlistenpath-backlog-callback}

**Añadido en: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ruta que el servidor debe escuchar. Consulte [Identificación de rutas para conexiones IPC](/es/nodejs/api/net#identifying-paths-for-ipc-connections).
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parámetro común de las funciones [`server.listen()`](/es/nodejs/api/net#serverlisten).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function).
- Devuelve: [\<net.Server\>](/es/nodejs/api/net#class-netserver)

Inicia un servidor [IPC](/es/nodejs/api/net#ipc-support) escuchando conexiones en la `ruta` dada.

#### `server.listen([port[, host[, backlog]]][, callback])` {#serverlistenport-host-backlog-callback}

**Añadido en: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parámetro común de las funciones [`server.listen()`](/es/nodejs/api/net#serverlisten).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function).
- Devuelve: [\<net.Server\>](/es/nodejs/api/net#class-netserver)

Inicia un servidor TCP escuchando conexiones en el `puerto` y `host` dados.

Si se omite `port` o es 0, el sistema operativo asignará un puerto no utilizado arbitrario, que se puede recuperar usando `server.address().port` después de que se haya emitido el evento [`'listening'`](/es/nodejs/api/net#event-listening).

Si se omite `host`, el servidor aceptará conexiones en la [dirección IPv6 no especificada](https://en.wikipedia.org/wiki/IPv6_address#Unspecified_address) (`::`) cuando IPv6 esté disponible, o la [dirección IPv4 no especificada](https://en.wikipedia.org/wiki/0.0.0.0) (`0.0.0.0`) de lo contrario.

En la mayoría de los sistemas operativos, escuchar la [dirección IPv6 no especificada](https://en.wikipedia.org/wiki/IPv6_address#Unspecified_address) (`::`) puede hacer que `net.Server` también escuche la [dirección IPv4 no especificada](https://en.wikipedia.org/wiki/0.0.0.0) (`0.0.0.0`).


### `server.listening` {#serverlistening}

**Agregado en: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si el servidor está escuchando o no las conexiones.

### `server.maxConnections` {#servermaxconnections}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.0.0 | Establecer `maxConnections` a `0` descarta todas las conexiones entrantes. Anteriormente, se interpretaba como `Infinity`. |
| v0.2.0 | Agregado en: v0.2.0 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Cuando el número de conexiones alcanza el umbral de `server.maxConnections`:

No se recomienda utilizar esta opción una vez que un socket ha sido enviado a un hijo con [`child_process.fork()`](/es/nodejs/api/child_process#child_processforkmodulepath-args-options).

### `server.dropMaxConnection` {#serverdropmaxconnection}

**Agregado en: v23.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Establezca esta propiedad en `true` para comenzar a cerrar las conexiones una vez que el número de conexiones alcance el umbral de [`server.maxConnections`][]. Esta configuración solo es efectiva en modo clúster.

### `server.ref()` {#serverref}

**Agregado en: v0.9.1**

- Devuelve: [\<net.Server\>](/es/nodejs/api/net#class-netserver)

Opuesto a `unref()`, llamar a `ref()` en un servidor previamente `unref` *no* permitirá que el programa se cierre si es el único servidor que queda (el comportamiento predeterminado). Si el servidor está `ref`do, llamar a `ref()` nuevamente no tendrá ningún efecto.

### `server.unref()` {#serverunref}

**Agregado en: v0.9.1**

- Devuelve: [\<net.Server\>](/es/nodejs/api/net#class-netserver)

Llamar a `unref()` en un servidor permitirá que el programa se cierre si este es el único servidor activo en el sistema de eventos. Si el servidor ya está `unref`do, llamar a `unref()` nuevamente no tendrá ningún efecto.

## Clase: `net.Socket` {#class-netsocket}

**Agregado en: v0.3.4**

- Extiende: [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)

Esta clase es una abstracción de un socket TCP o un punto final de [IPC](/es/nodejs/api/net#ipc-support) de transmisión (utiliza tuberías con nombre en Windows y sockets de dominio Unix en otros casos). También es un [`EventEmitter`](/es/nodejs/api/events#class-eventemitter).

Un `net.Socket` puede ser creado por el usuario y utilizado directamente para interactuar con un servidor. Por ejemplo, es retornado por [`net.createConnection()`](/es/nodejs/api/net#netcreateconnection), por lo que el usuario puede utilizarlo para hablar con el servidor.

También puede ser creado por Node.js y pasado al usuario cuando se recibe una conexión. Por ejemplo, se pasa a los listeners de un evento [`'connection'`](/es/nodejs/api/net#event-connection) emitido en un [`net.Server`](/es/nodejs/api/net#class-netserver), por lo que el usuario puede utilizarlo para interactuar con el cliente.


### `new net.Socket([options])` {#new-netsocketoptions}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.14.0 | Se agregó soporte para AbortSignal. |
| v12.10.0 | Se agregó la opción `onread`. |
| v0.3.4 | Agregado en: v0.3.4 |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Las opciones disponibles son:
    - `allowHalfOpen` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en `false`, el socket finalizará automáticamente el lado de escritura cuando finalice el lado de lectura. Consulte [`net.createServer()`](/es/nodejs/api/net#netcreateserveroptions-connectionlistener) y el evento [`'end'`](/es/nodejs/api/net#event-end) para obtener más detalles. **Predeterminado:** `false`.
    - `fd` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si se especifica, envuelve un socket existente con el descriptor de archivo dado, de lo contrario, se creará un nuevo socket.
    - `onread` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Si se especifica, los datos entrantes se almacenan en un único `buffer` y se pasan al `callback` proporcionado cuando llegan datos al socket. Esto hará que la funcionalidad de transmisión no proporcione ningún dato. El socket emitirá eventos como `'error'`, `'end'` y `'close'` como de costumbre. Los métodos como `pause()` y `resume()` también se comportarán como se espera.
    - `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Ya sea un fragmento de memoria reutilizable para usar para almacenar datos entrantes o una función que devuelve tal.
    - `callback` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Esta función se llama para cada fragmento de datos entrantes. Se le pasan dos argumentos: el número de bytes escritos en `buffer` y una referencia a `buffer`. Devuelve `false` desde esta función para `pause()` implícitamente el socket. Esta función se ejecutará en el contexto global.

    - `readable` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Permite lecturas en el socket cuando se pasa un `fd`, de lo contrario se ignora. **Predeterminado:** `false`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Una señal de Abort que se puede usar para destruir el socket.
    - `writable` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Permite escrituras en el socket cuando se pasa un `fd`, de lo contrario se ignora. **Predeterminado:** `false`.

- Devuelve: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket)

Crea un nuevo objeto socket.

El socket recién creado puede ser un socket TCP o un punto final [IPC](/es/nodejs/api/net#ipc-support) de transmisión, según a qué se [`connect()`](/es/nodejs/api/net#socketconnect).


### Evento: `'close'` {#event-close_1}

**Añadido en: v0.1.90**

- `hadError` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si el socket tuvo un error de transmisión.

Emitido una vez que el socket está completamente cerrado. El argumento `hadError` es un booleano que indica si el socket se cerró debido a un error de transmisión.

### Evento: `'connect'` {#event-connect}

**Añadido en: v0.1.90**

Emitido cuando una conexión de socket se establece correctamente. Véase [`net.createConnection()`](/es/nodejs/api/net#netcreateconnection).

### Evento: `'connectionAttempt'` {#event-connectionattempt}

**Añadido en: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La IP a la que el socket está intentando conectarse.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El puerto al que el socket está intentando conectarse.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La familia de la IP. Puede ser `6` para IPv6 o `4` para IPv4.

Emitido cuando se inicia un nuevo intento de conexión. Esto puede emitirse varias veces si el algoritmo de selección automática de familia está habilitado en [`socket.connect(options)`](/es/nodejs/api/net#socketconnectoptions-connectlistener).

### Evento: `'connectionAttemptFailed'` {#event-connectionattemptfailed}

**Añadido en: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La IP a la que el socket intentó conectarse.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El puerto al que el socket intentó conectarse.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La familia de la IP. Puede ser `6` para IPv6 o `4` para IPv4.
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) El error asociado al fallo.

Emitido cuando un intento de conexión falló. Esto puede emitirse varias veces si el algoritmo de selección automática de familia está habilitado en [`socket.connect(options)`](/es/nodejs/api/net#socketconnectoptions-connectlistener).


### Evento: `'connectionAttemptTimeout'` {#event-connectionattempttimeout}

**Añadido en: v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La IP a la que el socket intentó conectarse.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El puerto al que el socket intentó conectarse.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La familia de la IP. Puede ser `6` para IPv6 o `4` para IPv4.

Emitido cuando un intento de conexión se agota. Esto solo se emite (y puede emitirse varias veces) si el algoritmo de selección automática de familia está habilitado en [`socket.connect(options)`](/es/nodejs/api/net#socketconnectoptions-connectlistener).

### Evento: `'data'` {#event-data}

**Añadido en: v0.1.90**

- [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Emitido cuando se reciben datos. El argumento `data` será un `Buffer` o `String`. La codificación de los datos se establece mediante [`socket.setEncoding()`](/es/nodejs/api/net#socketsetencodingencoding).

Los datos se perderán si no hay ningún escucha cuando un `Socket` emite un evento `'data'`.

### Evento: `'drain'` {#event-drain}

**Añadido en: v0.1.90**

Emitido cuando el búfer de escritura se vacía. Se puede utilizar para regular las subidas.

Véase también: los valores de retorno de `socket.write()`.

### Evento: `'end'` {#event-end}

**Añadido en: v0.1.90**

Emitido cuando el otro extremo del socket señala el final de la transmisión, terminando así el lado legible del socket.

Por defecto (`allowHalfOpen` es `false`), el socket enviará un paquete de fin de transmisión de vuelta y destruirá su descriptor de archivo una vez que haya escrito su cola de escritura pendiente. Sin embargo, si `allowHalfOpen` está establecido en `true`, el socket no [`end()`](/es/nodejs/api/net#socketenddata-encoding-callback) automáticamente su lado grabable, permitiendo al usuario escribir cantidades arbitrarias de datos. El usuario debe llamar a [`end()`](/es/nodejs/api/net#socketenddata-encoding-callback) explícitamente para cerrar la conexión (es decir, enviando un paquete FIN de vuelta).


### Evento: `'error'` {#event-error_1}

**Añadido en: v0.1.90**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emitido cuando ocurre un error. El evento `'close'` será llamado directamente después de este evento.

### Evento: `'lookup'` {#event-lookup}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v5.10.0 | El parámetro `host` ahora es compatible. |
| v0.11.3 | Añadido en: v0.11.3 |
:::

Emitido después de resolver el nombre de host, pero antes de conectarse. No aplicable a los sockets Unix.

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) El objeto de error. Véase [`dns.lookup()`](/es/nodejs/api/dns#dnslookuphostname-options-callback).
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La dirección IP.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) El tipo de dirección. Véase [`dns.lookup()`](/es/nodejs/api/dns#dnslookuphostname-options-callback).
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre de host.

### Evento: `'ready'` {#event-ready}

**Añadido en: v9.11.0**

Emitido cuando un socket está listo para ser usado.

Disparado inmediatamente después de `'connect'`.

### Evento: `'timeout'` {#event-timeout}

**Añadido en: v0.1.90**

Emitido si el socket se agota por inactividad. Esto es solo para notificar que el socket ha estado inactivo. El usuario debe cerrar manualmente la conexión.

Véase también: [`socket.setTimeout()`](/es/nodejs/api/net#socketsettimeouttimeout-callback).

### `socket.address()` {#socketaddress}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.4.0 | La propiedad `family` ahora devuelve una cadena en lugar de un número. |
| v18.0.0 | La propiedad `family` ahora devuelve un número en lugar de una cadena. |
| v0.1.90 | Añadido en: v0.1.90 |
:::

- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Devuelve la `address` enlazada, el nombre de la `family` de la dirección y el `port` del socket tal como lo informa el sistema operativo: `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`


### `socket.autoSelectFamilyAttemptedAddresses` {#socketautoselectfamilyattemptedaddresses}

**Añadido en: v19.4.0, v18.18.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Esta propiedad solo está presente si el algoritmo de autoselección de familia está habilitado en [`socket.connect(options)`](/es/nodejs/api/net#socketconnectoptions-connectlistener) y es un array de las direcciones que se han intentado.

Cada dirección es una cadena en la forma de `$IP:$PUERTO`. Si la conexión fue exitosa, entonces la última dirección es a la que el socket está conectado actualmente.

### `socket.bufferSize` {#socketbuffersize}

**Añadido en: v0.3.8**

**Obsoleto desde: v14.6.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Use [`writable.writableLength`](/es/nodejs/api/stream#writablewritablelength) en su lugar.
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Esta propiedad muestra el número de caracteres almacenados en búfer para escribir. El búfer puede contener cadenas cuya longitud después de la codificación aún no se conoce. Por lo tanto, este número es solo una aproximación del número de bytes en el búfer.

`net.Socket` tiene la propiedad de que `socket.write()` siempre funciona. Esto es para ayudar a los usuarios a ponerse en marcha rápidamente. El ordenador no siempre puede seguir el ritmo de la cantidad de datos que se escriben en un socket. La conexión de red simplemente podría ser demasiado lenta. Node.js internamente pondrá en cola los datos escritos en un socket y los enviará a través del cable cuando sea posible.

La consecuencia de este almacenamiento en búfer interno es que la memoria puede crecer. Los usuarios que experimenten un `bufferSize` grande o creciente deben intentar "reducir" los flujos de datos en su programa con [`socket.pause()`](/es/nodejs/api/net#socketpause) y [`socket.resume()`](/es/nodejs/api/net#socketresume).

### `socket.bytesRead` {#socketbytesread}

**Añadido en: v0.5.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La cantidad de bytes recibidos.


### `socket.bytesWritten` {#socketbyteswritten}

**Añadido en: v0.5.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La cantidad de bytes enviados.

### `socket.connect()` {#socketconnect}

Inicia una conexión en un socket dado.

Posibles firmas:

- [`socket.connect(options[, connectListener])`](/es/nodejs/api/net#socketconnectoptions-connectlistener)
- [`socket.connect(path[, connectListener])`](/es/nodejs/api/net#socketconnectpath-connectlistener) para conexiones [IPC](/es/nodejs/api/net#ipc-support).
- [`socket.connect(port[, host][, connectListener])`](/es/nodejs/api/net#socketconnectport-host-connectlistener) para conexiones TCP.
- Devuelve: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) El propio socket.

Esta función es asíncrona. Cuando se establece la conexión, se emitirá el evento [`'connect'`](/es/nodejs/api/net#event-connect). Si hay un problema al conectar, en lugar de un evento [`'connect'`](/es/nodejs/api/net#event-connect), se emitirá un evento [`'error'`](/es/nodejs/api/net#event-error_1) con el error pasado al listener [`'error'`](/es/nodejs/api/net#event-error_1). El último parámetro `connectListener`, si se proporciona, se agregará como listener para el evento [`'connect'`](/es/nodejs/api/net#event-connect) **una vez**.

Esta función solo debe usarse para volver a conectar un socket después de que se haya emitido `'close'` o, de lo contrario, puede provocar un comportamiento indefinido.

#### `socket.connect(options[, connectListener])` {#socketconnectoptions-connectlistener}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.4.0 | El valor predeterminado para la opción autoSelectFamily se puede cambiar en tiempo de ejecución utilizando `setDefaultAutoSelectFamily` o mediante la opción de línea de comandos `--enable-network-family-autoselection`. |
| v20.0.0, v18.18.0 | El valor predeterminado para la opción autoSelectFamily ahora es verdadero. El indicador CLI `--enable-network-family-autoselection` ha sido renombrado a `--network-family-autoselection`. El nombre antiguo ahora es un alias, pero se desaconseja. |
| v19.3.0, v18.13.0 | Se agregó la opción `autoSelectFamily`. |
| v17.7.0, v16.15.0 | Ahora se admiten las opciones `noDelay`, `keepAlive` y `keepAliveInitialDelay`. |
| v6.0.0 | La opción `hints` ahora tiene el valor predeterminado `0` en todos los casos. Anteriormente, en ausencia de la opción `family`, el valor predeterminado era `dns.ADDRCONFIG | dns.V4MAPPED`. |
| v5.11.0 | Ahora se admite la opción `hints`. |
| v0.1.90 | Añadido en: v0.1.90 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Parámetro común de los métodos [`socket.connect()`](/es/nodejs/api/net#socketconnect). Se agregará como listener para el evento [`'connect'`](/es/nodejs/api/net#event-connect) una vez.
- Devuelve: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) El propio socket.

Inicia una conexión en un socket dado. Normalmente este método no es necesario, el socket debe crearse y abrirse con [`net.createConnection()`](/es/nodejs/api/net#netcreateconnection). Utilice esto solo cuando implemente un Socket personalizado.

Para conexiones TCP, las `options` disponibles son:

- `autoSelectFamily` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): Si se establece en `true`, habilita un algoritmo de autodetección de familia que implementa de manera flexible la sección 5 de [RFC 8305](https://www.rfc-editor.org/rfc/rfc8305.txt). La opción `all` pasada a lookup se establece en `true` y los sockets intentan conectarse a todas las direcciones IPv6 e IPv4 obtenidas, en secuencia, hasta que se establece una conexión. Primero se intenta la primera dirección AAAA devuelta, luego la primera dirección A devuelta, luego la segunda dirección AAAA devuelta, y así sucesivamente. A cada intento de conexión (pero al último) se le da la cantidad de tiempo especificada por la opción `autoSelectFamilyAttemptTimeout` antes de que se agote el tiempo y se intente la siguiente dirección. Se ignora si la opción `family` no es `0` o si se establece `localAddress`. Los errores de conexión no se emiten si al menos una conexión tiene éxito. Si todos los intentos de conexión fallan, se emite un único `AggregateError` con todos los intentos fallidos. **Predeterminado:** [`net.getDefaultAutoSelectFamily()`](/es/nodejs/api/net#netgetdefaultautoselectfamily).
- `autoSelectFamilyAttemptTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): La cantidad de tiempo en milisegundos que se espera a que finalice un intento de conexión antes de intentar la siguiente dirección cuando se utiliza la opción `autoSelectFamily`. Si se establece en un entero positivo menor que `10`, se utilizará el valor `10` en su lugar. **Predeterminado:** [`net.getDefaultAutoSelectFamilyAttemptTimeout()`](/es/nodejs/api/net#netgetdefaultautoselectfamilyattempttimeout).
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): Versión de la pila IP. Debe ser `4`, `6` o `0`. El valor `0` indica que se permiten tanto direcciones IPv4 como IPv6. **Predeterminado:** `0`.
- `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Opcional [`dns.lookup()` sugerencias](/es/nodejs/api/dns#supported-getaddrinfo-flags).
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host al que debe conectarse el socket. **Predeterminado:** `'localhost'`.
- `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en `true`, habilita la funcionalidad keep-alive en el socket inmediatamente después de que se establece la conexión, de manera similar a lo que se hace en [`socket.setKeepAlive()`](/es/nodejs/api/net#socketsetkeepaliveenable-initialdelay). **Predeterminado:** `false`.
- `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si se establece en un número positivo, establece el retraso inicial antes de que se envíe la primera sonda keepalive en un socket inactivo. **Predeterminado:** `0`.
- `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Dirección local desde la que debe conectarse el socket.
- `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Puerto local desde el que debe conectarse el socket.
- `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Función de búsqueda personalizada. **Predeterminado:** [`dns.lookup()`](/es/nodejs/api/dns#dnslookuphostname-options-callback).
- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en `true`, deshabilita el uso del algoritmo de Nagle inmediatamente después de que se establece el socket. **Predeterminado:** `false`.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Requerido. Puerto al que debe conectarse el socket.
- `blockList` [\<net.BlockList\>](/es/nodejs/api/net#class-netblocklist) `blockList` se puede utilizar para deshabilitar el acceso de salida a direcciones IP, rangos de IP o subredes IP específicas.

Para conexiones [IPC](/es/nodejs/api/net#ipc-support), las `options` disponibles son:

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Requerido. Ruta a la que debe conectarse el cliente. Consulte [Identificación de rutas para conexiones IPC](/es/nodejs/api/net#identifying-paths-for-ipc-connections). Si se proporciona, se ignoran las opciones específicas de TCP anteriores.


#### `socket.connect(path[, connectListener])` {#socketconnectpath-connectlistener}

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ruta a la que el cliente debe conectarse. Consulte [Identificación de rutas para conexiones IPC](/es/nodejs/api/net#identifying-paths-for-ipc-connections).
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Parámetro común de los métodos [`socket.connect()`](/es/nodejs/api/net#socketconnect). Se agregará como un listener para el evento [`'connect'`](/es/nodejs/api/net#event-connect) una vez.
- Devuelve: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) El propio socket.

Inicia una conexión [IPC](/es/nodejs/api/net#ipc-support) en el socket dado.

Alias de [`socket.connect(options[, connectListener])`](/es/nodejs/api/net#socketconnectoptions-connectlistener) llamado con `{ path: path }` como `options`.

#### `socket.connect(port[, host][, connectListener])` {#socketconnectport-host-connectlistener}

**Agregado en: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Puerto al que el cliente debe conectarse.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host al que el cliente debe conectarse.
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Parámetro común de los métodos [`socket.connect()`](/es/nodejs/api/net#socketconnect). Se agregará como un listener para el evento [`'connect'`](/es/nodejs/api/net#event-connect) una vez.
- Devuelve: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) El propio socket.

Inicia una conexión TCP en el socket dado.

Alias de [`socket.connect(options[, connectListener])`](/es/nodejs/api/net#socketconnectoptions-connectlistener) llamado con `{port: port, host: host}` como `options`.

### `socket.connecting` {#socketconnecting}

**Agregado en: v6.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Si es `true`, se llamó a [`socket.connect(options[, connectListener])`](/es/nodejs/api/net#socketconnectoptions-connectlistener) y aún no ha terminado. Permanecerá como `true` hasta que el socket se conecte, luego se establece en `false` y se emite el evento `'connect'`. Tenga en cuenta que el callback [`socket.connect(options[, connectListener])`](/es/nodejs/api/net#socketconnectoptions-connectlistener) es un listener para el evento `'connect'`.


### `socket.destroy([error])` {#socketdestroyerror}

**Agregado en: v0.1.90**

- `error` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Devuelve: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket)

Garantiza que no se produzca más actividad de E/S en este socket. Destruye el stream y cierra la conexión.

Consulte [`writable.destroy()`](/es/nodejs/api/stream#writabledestroyerror) para obtener más detalles.

### `socket.destroyed` {#socketdestroyed}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si la conexión está destruida o no. Una vez que se destruye una conexión, no se pueden transferir más datos a través de ella.

Consulte [`writable.destroyed`](/es/nodejs/api/stream#writabledestroyed) para obtener más detalles.

### `socket.destroySoon()` {#socketdestroysoon}

**Agregado en: v0.3.4**

Destruye el socket después de que se hayan escrito todos los datos. Si el evento `'finish'` ya se ha emitido, el socket se destruye inmediatamente. Si el socket aún se puede escribir, llama implícitamente a `socket.end()`.

### `socket.end([data[, encoding]][, callback])` {#socketenddata-encoding-callback}

**Agregado en: v0.1.90**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Solo se utiliza cuando los datos son `string`. **Predeterminado:** `'utf8'`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback opcional para cuando el socket haya terminado.
- Devuelve: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) El propio socket.

Cierra el socket a la mitad. Es decir, envía un paquete FIN. Es posible que el servidor aún envíe algunos datos.

Consulte [`writable.end()`](/es/nodejs/api/stream#writableendchunk-encoding-callback) para obtener más detalles.

### `socket.localAddress` {#socketlocaladdress}

**Agregado en: v0.9.6**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La representación en string de la dirección IP local a la que se está conectando el cliente remoto. Por ejemplo, en un servidor que escucha en `'0.0.0.0'`, si un cliente se conecta en `'192.168.1.1'`, el valor de `socket.localAddress` sería `'192.168.1.1'`.


### `socket.localPort` {#socketlocalport}

**Agregado en: v0.9.6**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La representación numérica del puerto local. Por ejemplo, `80` o `21`.

### `socket.localFamily` {#socketlocalfamily}

**Agregado en: v18.8.0, v16.18.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La representación en cadena de la familia IP local. `'IPv4'` o `'IPv6'`.

### `socket.pause()` {#socketpause}

- Devuelve: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) El propio socket.

Pausa la lectura de datos. Es decir, los eventos [`'data'`](/es/nodejs/api/net#event-data) no se emitirán. Útil para reducir la velocidad de una carga.

### `socket.pending` {#socketpending}

**Agregado en: v11.2.0, v10.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Esto es `true` si el socket aún no está conectado, ya sea porque aún no se ha llamado a `.connect()` o porque todavía está en proceso de conexión (ver [`socket.connecting`](/es/nodejs/api/net#socketconnecting)).

### `socket.ref()` {#socketref}

**Agregado en: v0.9.1**

- Devuelve: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) El propio socket.

Opuesto a `unref()`, llamar a `ref()` en un socket previamente `unref` *no* permitirá que el programa se cierre si es el único socket que queda (el comportamiento predeterminado). Si el socket está `ref`ed, llamar a `ref` nuevamente no tendrá ningún efecto.

### `socket.remoteAddress` {#socketremoteaddress}

**Agregado en: v0.5.10**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La representación en cadena de la dirección IP remota. Por ejemplo, `'74.125.127.100'` o `'2001:4860:a005::68'`. El valor puede ser `undefined` si el socket se destruye (por ejemplo, si el cliente se desconecta).

### `socket.remoteFamily` {#socketremotefamily}

**Agregado en: v0.11.14**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La representación en cadena de la familia IP remota. `'IPv4'` o `'IPv6'`. El valor puede ser `undefined` si el socket se destruye (por ejemplo, si el cliente se desconecta).


### `socket.remotePort` {#socketremoteport}

**Agregado en: v0.5.10**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La representación numérica del puerto remoto. Por ejemplo, `80` o `21`. El valor puede ser `undefined` si el socket se destruye (por ejemplo, si el cliente se desconecta).

### `socket.resetAndDestroy()` {#socketresetanddestroy}

**Agregado en: v18.3.0, v16.17.0**

- Devuelve: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket)

Cierra la conexión TCP enviando un paquete RST y destruye el stream. Si este socket TCP está en estado de conexión, enviará un paquete RST y destruirá este socket TCP una vez que esté conectado. De lo contrario, llamará a `socket.destroy` con un Error `ERR_SOCKET_CLOSED`. Si este no es un socket TCP (por ejemplo, una tubería), llamar a este método lanzará inmediatamente un Error `ERR_INVALID_HANDLE_TYPE`.

### `socket.resume()` {#socketresume}

- Devuelve: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) El propio socket.

Reanuda la lectura después de una llamada a [`socket.pause()`](/es/nodejs/api/net#socketpause).

### `socket.setEncoding([encoding])` {#socketsetencodingencoding}

**Agregado en: v0.1.90**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) El propio socket.

Establece la codificación para el socket como un [Readable Stream](/es/nodejs/api/stream#class-streamreadable). Consulte [`readable.setEncoding()`](/es/nodejs/api/stream#readablesetencodingencoding) para obtener más información.

### `socket.setKeepAlive([enable][, initialDelay])` {#socketsetkeepaliveenable-initialdelay}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.12.0, v12.17.0 | Se agregaron nuevos valores predeterminados para las opciones de socket `TCP_KEEPCNT` y `TCP_KEEPINTVL`. |
| v0.1.92 | Agregado en: v0.1.92 |
:::

- `enable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `false`
- `initialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0`
- Devuelve: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) El propio socket.

Habilita/deshabilita la funcionalidad keep-alive y, opcionalmente, establece el retraso inicial antes de que se envíe la primera sonda keepalive en un socket inactivo.

Establece `initialDelay` (en milisegundos) para establecer el retraso entre el último paquete de datos recibido y la primera sonda keepalive. Establecer `0` para `initialDelay` dejará el valor sin cambios con respecto a la configuración predeterminada (o anterior).

Habilitar la funcionalidad keep-alive establecerá las siguientes opciones de socket:

- `SO_KEEPALIVE=1`
- `TCP_KEEPIDLE=initialDelay`
- `TCP_KEEPCNT=10`
- `TCP_KEEPINTVL=1`


### `socket.setNoDelay([noDelay])` {#socketsetnodelaynodelay}

**Agregado en: v0.1.90**

- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `true`
- Devuelve: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) El socket en sí.

Activa/desactiva el uso del algoritmo de Nagle.

Cuando se crea una conexión TCP, tendrá habilitado el algoritmo de Nagle.

El algoritmo de Nagle retrasa los datos antes de enviarlos a través de la red. Intenta optimizar el rendimiento a expensas de la latencia.

Pasar `true` para `noDelay` o no pasar un argumento desactivará el algoritmo de Nagle para el socket. Pasar `false` para `noDelay` activará el algoritmo de Nagle.

### `socket.setTimeout(timeout[, callback])` {#socketsettimeouttimeout-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una callback inválida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v0.1.90 | Agregado en: v0.1.90 |
:::

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) El socket en sí.

Establece el socket para que se agote el tiempo de espera después de `timeout` milisegundos de inactividad en el socket. Por defecto, `net.Socket` no tiene un tiempo de espera.

Cuando se activa un tiempo de espera de inactividad, el socket recibirá un evento [`'timeout'`](/es/nodejs/api/net#event-timeout), pero la conexión no se interrumpirá. El usuario debe llamar manualmente a [`socket.end()`](/es/nodejs/api/net#socketenddata-encoding-callback) o [`socket.destroy()`](/es/nodejs/api/net#socketdestroyerror) para finalizar la conexión.

```js [ESM]
socket.setTimeout(3000);
socket.on('timeout', () => {
  console.log('tiempo de espera del socket');
  socket.end();
});
```
Si `timeout` es 0, entonces el tiempo de espera de inactividad existente se deshabilita.

El parámetro opcional `callback` se agregará como un listener de una sola vez para el evento [`'timeout'`](/es/nodejs/api/net#event-timeout).


### `socket.timeout` {#sockettimeout}

**Agregado en: v10.7.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

El tiempo de espera del socket en milisegundos según lo establecido por [`socket.setTimeout()`](/es/nodejs/api/net#socketsettimeouttimeout-callback). Es `undefined` si no se ha establecido un tiempo de espera.

### `socket.unref()` {#socketunref}

**Agregado en: v0.9.1**

- Devuelve: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) El propio socket.

Llamar a `unref()` en un socket permitirá que el programa se cierre si este es el único socket activo en el sistema de eventos. Si el socket ya está `unref`ed, llamar a `unref()` nuevamente no tendrá ningún efecto.

### `socket.write(data[, encoding][, callback])` {#socketwritedata-encoding-callback}

**Agregado en: v0.1.90**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Solo se usa cuando los datos son `string`. **Predeterminado:** `utf8`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Envía datos en el socket. El segundo parámetro especifica la codificación en el caso de una cadena. El valor predeterminado es la codificación UTF8.

Devuelve `true` si todos los datos se vaciaron correctamente al búfer del kernel. Devuelve `false` si la totalidad o parte de los datos se pusieron en cola en la memoria del usuario. Se emitirá [`'drain'`](/es/nodejs/api/net#event-drain) cuando el búfer esté nuevamente libre.

El parámetro opcional `callback` se ejecutará cuando los datos finalmente se escriban, lo que puede no ser de inmediato.

Consulte el método [`write()`](/es/nodejs/api/stream#writablewritechunk-encoding-callback) del flujo `Writable` para obtener más información.


### `socket.readyState` {#socketreadystate}

**Añadido en: v0.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Esta propiedad representa el estado de la conexión como una cadena.

- Si el flujo se está conectando, `socket.readyState` es `opening`.
- Si el flujo es legible y escribible, es `open`.
- Si el flujo es legible y no escribible, es `readOnly`.
- Si el flujo no es legible ni escribible, es `writeOnly`.

## `net.connect()` {#netconnect}

Alias de [`net.createConnection()`](/es/nodejs/api/net#netcreateconnection).

Posibles firmas:

- [`net.connect(options[, connectListener])`](/es/nodejs/api/net#netconnectoptions-connectlistener)
- [`net.connect(path[, connectListener])`](/es/nodejs/api/net#netconnectpath-connectlistener) para conexiones [IPC](/es/nodejs/api/net#ipc-support).
- [`net.connect(port[, host][, connectListener])`](/es/nodejs/api/net#netconnectport-host-connectlistener) para conexiones TCP.

### `net.connect(options[, connectListener])` {#netconnectoptions-connectlistener}

**Añadido en: v0.7.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket)

Alias de [`net.createConnection(options[, connectListener])`](/es/nodejs/api/net#netcreateconnectionoptions-connectlistener).

### `net.connect(path[, connectListener])` {#netconnectpath-connectlistener}

**Añadido en: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket)

Alias de [`net.createConnection(path[, connectListener])`](/es/nodejs/api/net#netcreateconnectionpath-connectlistener).

### `net.connect(port[, host][, connectListener])` {#netconnectport-host-connectlistener}

**Añadido en: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket)

Alias de [`net.createConnection(port[, host][, connectListener])`](/es/nodejs/api/net#netcreateconnectionport-host-connectlistener).


## `net.createConnection()` {#netcreateconnection}

Una función de fábrica que crea un nuevo [`net.Socket`](/es/nodejs/api/net#class-netsocket), inicia inmediatamente la conexión con [`socket.connect()`](/es/nodejs/api/net#socketconnect) y luego devuelve el `net.Socket` que inicia la conexión.

Cuando se establece la conexión, se emitirá un evento [`'connect'`](/es/nodejs/api/net#event-connect) en el socket devuelto. El último parámetro `connectListener`, si se proporciona, se agregará como un detector para el evento [`'connect'`](/es/nodejs/api/net#event-connect) **una vez**.

Posibles firmas:

- [`net.createConnection(options[, connectListener])`](/es/nodejs/api/net#netcreateconnectionoptions-connectlistener)
- [`net.createConnection(path[, connectListener])`](/es/nodejs/api/net#netcreateconnectionpath-connectlistener) para conexiones [IPC](/es/nodejs/api/net#ipc-support).
- [`net.createConnection(port[, host][, connectListener])`](/es/nodejs/api/net#netcreateconnectionport-host-connectlistener) para conexiones TCP.

La función [`net.connect()`](/es/nodejs/api/net#netconnect) es un alias de esta función.

### `net.createConnection(options[, connectListener])` {#netcreateconnectionoptions-connectlistener}

**Agregado en: v0.1.90**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Requerido. Se pasará tanto a la llamada [`new net.Socket([options])`](/es/nodejs/api/net#new-netsocketoptions) como al método [`socket.connect(options[, connectListener])`](/es/nodejs/api/net#socketconnectoptions-connectlistener).
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Parámetro común de las funciones [`net.createConnection()`](/es/nodejs/api/net#netcreateconnection). Si se proporciona, se agregará como un detector para el evento [`'connect'`](/es/nodejs/api/net#event-connect) en el socket devuelto una vez.
- Devuelve: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) El socket recién creado que se utiliza para iniciar la conexión.

Para ver las opciones disponibles, consulte [`new net.Socket([options])`](/es/nodejs/api/net#new-netsocketoptions) y [`socket.connect(options[, connectListener])`](/es/nodejs/api/net#socketconnectoptions-connectlistener).

Opciones adicionales:

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si se establece, se utilizará para llamar a [`socket.setTimeout(timeout)`](/es/nodejs/api/net#socketsettimeouttimeout-callback) después de que se cree el socket, pero antes de que inicie la conexión.

El siguiente es un ejemplo de un cliente del servidor de eco descrito en la sección [`net.createServer()`](/es/nodejs/api/net#netcreateserveroptions-connectionlistener):

::: code-group
```js [ESM]
import net from 'node:net';
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' listener.
  console.log('connected to server!');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
```

```js [CJS]
const net = require('node:net');
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' listener.
  console.log('connected to server!');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
```
:::

Para conectarse al socket `/tmp/echo.sock`:

```js [ESM]
const client = net.createConnection({ path: '/tmp/echo.sock' });
```
El siguiente es un ejemplo de un cliente que utiliza la opción `port` y `onread`. En este caso, la opción `onread` solo se utilizará para llamar a `new net.Socket([options])` y la opción `port` se utilizará para llamar a `socket.connect(options[, connectListener])`.

::: code-group
```js [ESM]
import net from 'node:net';
import { Buffer } from 'node:buffer';
net.createConnection({
  port: 8124,
  onread: {
    // Reuses a 4KiB Buffer for every read from the socket.
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // Received data is available in `buf` from 0 to `nread`.
      console.log(buf.toString('utf8', 0, nread));
    },
  },
});
```

```js [CJS]
const net = require('node:net');
net.createConnection({
  port: 8124,
  onread: {
    // Reuses a 4KiB Buffer for every read from the socket.
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // Received data is available in `buf` from 0 to `nread`.
      console.log(buf.toString('utf8', 0, nread));
    },
  },
});
```
:::

### `net.createConnection(path[, connectListener])` {#netcreateconnectionpath-connectlistener}

**Agregado en: v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ruta a la que el socket debe conectarse. Se pasará a [`socket.connect(path[, connectListener])`](/es/nodejs/api/net#socketconnectpath-connectlistener). Consulte [Identificación de rutas para conexiones IPC](/es/nodejs/api/net#identifying-paths-for-ipc-connections).
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Parámetro común de las funciones [`net.createConnection()`](/es/nodejs/api/net#netcreateconnection), un listener "once" para el evento `'connect'` en el socket de inicio. Se pasará a [`socket.connect(path[, connectListener])`](/es/nodejs/api/net#socketconnectpath-connectlistener).
- Devuelve: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) El socket recién creado utilizado para iniciar la conexión.

Inicia una conexión [IPC](/es/nodejs/api/net#ipc-support).

Esta función crea un nuevo [`net.Socket`](/es/nodejs/api/net#class-netsocket) con todas las opciones establecidas de forma predeterminada, inicia inmediatamente la conexión con [`socket.connect(path[, connectListener])`](/es/nodejs/api/net#socketconnectpath-connectlistener) y luego devuelve el `net.Socket` que inicia la conexión.

### `net.createConnection(port[, host][, connectListener])` {#netcreateconnectionport-host-connectlistener}

**Agregado en: v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Puerto al que el socket debe conectarse. Se pasará a [`socket.connect(port[, host][, connectListener])`](/es/nodejs/api/net#socketconnectport-host-connectlistener).
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host al que el socket debe conectarse. Se pasará a [`socket.connect(port[, host][, connectListener])`](/es/nodejs/api/net#socketconnectport-host-connectlistener). **Predeterminado:** `'localhost'`.
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Parámetro común de las funciones [`net.createConnection()`](/es/nodejs/api/net#netcreateconnection), un listener "once" para el evento `'connect'` en el socket de inicio. Se pasará a [`socket.connect(port[, host][, connectListener])`](/es/nodejs/api/net#socketconnectport-host-connectlistener).
- Devuelve: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) El socket recién creado utilizado para iniciar la conexión.

Inicia una conexión TCP.

Esta función crea un nuevo [`net.Socket`](/es/nodejs/api/net#class-netsocket) con todas las opciones establecidas de forma predeterminada, inicia inmediatamente la conexión con [`socket.connect(port[, host][, connectListener])`](/es/nodejs/api/net#socketconnectport-host-connectlistener) y luego devuelve el `net.Socket` que inicia la conexión.


## `net.createServer([options][, connectionListener])` {#netcreateserveroptions-connectionlistener}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.1.0, v18.17.0 | La opción `highWaterMark` ahora es compatible. |
| v17.7.0, v16.15.0 | Las opciones `noDelay`, `keepAlive` y `keepAliveInitialDelay` ahora son compatibles. |
| v0.5.0 | Añadido en: v0.5.0 |
:::

-  `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `allowHalfOpen` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en `false`, entonces el socket finalizará automáticamente el lado de escritura cuando finalice el lado de lectura. **Predeterminado:** `false`.
    - `highWaterMark` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Opcionalmente, anula `readableHighWaterMark` y `writableHighWaterMark` de todos los [`net.Socket`](/es/nodejs/api/net#class-netsocket)s. **Predeterminado:** Ver [`stream.getDefaultHighWaterMark()`](/es/nodejs/api/stream#streamgetdefaulthighwatermarkobjectmode).
    - `keepAlive` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en `true`, habilita la funcionalidad keep-alive en el socket inmediatamente después de que se recibe una nueva conexión entrante, de forma similar a lo que se hace en [`socket.setKeepAlive()`](/es/nodejs/api/net#socketsetkeepaliveenable-initialdelay). **Predeterminado:** `false`.
    - `keepAliveInitialDelay` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si se establece en un número positivo, establece el retraso inicial antes de que se envíe la primera sonda keepalive en un socket inactivo. **Predeterminado:** `0`.
    - `noDelay` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en `true`, deshabilita el uso del algoritmo de Nagle inmediatamente después de que se recibe una nueva conexión entrante. **Predeterminado:** `false`.
    - `pauseOnConnect` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si el socket debe pausarse en las conexiones entrantes. **Predeterminado:** `false`.
    - `blockList` [\<net.BlockList\>](/es/nodejs/api/net#class-netblocklist) `blockList` se puede utilizar para deshabilitar el acceso entrante a direcciones IP, rangos de IP o subredes IP específicas. Esto no funciona si el servidor está detrás de un proxy inverso, NAT, etc. porque la dirección comprobada con la lista de bloqueo es la dirección del proxy o la especificada por el NAT.
  
 
-  `connectionListener` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se establece automáticamente como un listener para el evento [`'connection'`](/es/nodejs/api/net#event-connection). 
-  Devuelve: [\<net.Server\>](/es/nodejs/api/net#class-netserver) 

Crea un nuevo servidor TCP o [IPC](/es/nodejs/api/net#ipc-support).

Si `allowHalfOpen` está establecido en `true`, cuando el otro extremo del socket señala el final de la transmisión, el servidor solo enviará de vuelta el final de la transmisión cuando se llame explícitamente a [`socket.end()`](/es/nodejs/api/net#socketenddata-encoding-callback). Por ejemplo, en el contexto de TCP, cuando se recibe un paquete FIN, se envía un paquete FIN de vuelta solo cuando se llama explícitamente a [`socket.end()`](/es/nodejs/api/net#socketenddata-encoding-callback). Hasta entonces, la conexión está medio cerrada (no legible pero aún grabable). Ver el evento [`'end'`](/es/nodejs/api/net#event-end) y [RFC 1122](https://tools.ietf.org/html/rfc1122) (sección 4.2.2.13) para más información.

Si `pauseOnConnect` está establecido en `true`, entonces el socket asociado con cada conexión entrante se pausará y no se leerán datos de su identificador. Esto permite que las conexiones se pasen entre procesos sin que el proceso original lea ningún dato. Para comenzar a leer datos de un socket pausado, llama a [`socket.resume()`](/es/nodejs/api/net#socketresume).

El servidor puede ser un servidor TCP o un servidor [IPC](/es/nodejs/api/net#ipc-support), dependiendo de a qué [`listen()`](/es/nodejs/api/net#serverlisten) lo haga.

Aquí hay un ejemplo de un servidor de eco TCP que escucha las conexiones en el puerto 8124:

::: code-group
```js [ESM]
import net from 'node:net';
const server = net.createServer((c) => {
  // 'connection' listener.
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});
```

```js [CJS]
const net = require('node:net');
const server = net.createServer((c) => {
  // 'connection' listener.
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});
```
:::

Pruébalo usando `telnet`:

```bash [BASH]
telnet localhost 8124
```
Para escuchar en el socket `/tmp/echo.sock`:

```js [ESM]
server.listen('/tmp/echo.sock', () => {
  console.log('server bound');
});
```
Usa `nc` para conectarte a un servidor de socket de dominio Unix:

```bash [BASH]
nc -U /tmp/echo.sock
```

## `net.getDefaultAutoSelectFamily()` {#netgetdefaultautoselectfamily}

**Agregado en: v19.4.0**

Obtiene el valor predeterminado actual de la opción `autoSelectFamily` de [`socket.connect(options)`](/es/nodejs/api/net#socketconnectoptions-connectlistener). El valor predeterminado inicial es `true`, a menos que se proporcione la opción de línea de comandos `--no-network-family-autoselection`.

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) El valor predeterminado actual de la opción `autoSelectFamily`.

## `net.setDefaultAutoSelectFamily(value)` {#netsetdefaultautoselectfamilyvalue}

**Agregado en: v19.4.0**

Establece el valor predeterminado de la opción `autoSelectFamily` de [`socket.connect(options)`](/es/nodejs/api/net#socketconnectoptions-connectlistener).

- `value` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) El nuevo valor predeterminado. El valor predeterminado inicial es `true`, a menos que se proporcione la opción de línea de comandos `--no-network-family-autoselection`.

## `net.getDefaultAutoSelectFamilyAttemptTimeout()` {#netgetdefaultautoselectfamilyattempttimeout}

**Agregado en: v19.8.0, v18.18.0**

Obtiene el valor predeterminado actual de la opción `autoSelectFamilyAttemptTimeout` de [`socket.connect(options)`](/es/nodejs/api/net#socketconnectoptions-connectlistener). El valor predeterminado inicial es `250` o el valor especificado a través de la opción de línea de comandos `--network-family-autoselection-attempt-timeout`.

- Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El valor predeterminado actual de la opción `autoSelectFamilyAttemptTimeout`.

## `net.setDefaultAutoSelectFamilyAttemptTimeout(value)` {#netsetdefaultautoselectfamilyattempttimeoutvalue}

**Agregado en: v19.8.0, v18.18.0**

Establece el valor predeterminado de la opción `autoSelectFamilyAttemptTimeout` de [`socket.connect(options)`](/es/nodejs/api/net#socketconnectoptions-connectlistener).

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El nuevo valor predeterminado, que debe ser un número positivo. Si el número es menor que `10`, se utiliza el valor `10` en su lugar. El valor predeterminado inicial es `250` o el valor especificado a través de la opción de línea de comandos `--network-family-autoselection-attempt-timeout`.


## `net.isIP(input)` {#netisipinput}

**Agregado en: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Regresa: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Regresa `6` si `input` es una dirección IPv6. Regresa `4` si `input` es una dirección IPv4 en [notación decimal punteada](https://en.wikipedia.org/wiki/Dot-decimal_notation) sin ceros iniciales. De lo contrario, regresa `0`.

```js [ESM]
net.isIP('::1'); // regresa 6
net.isIP('127.0.0.1'); // regresa 4
net.isIP('127.000.000.001'); // regresa 0
net.isIP('127.0.0.1/24'); // regresa 0
net.isIP('fhqwhgads'); // regresa 0
```
## `net.isIPv4(input)` {#netisipv4input}

**Agregado en: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Regresa: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Regresa `true` si `input` es una dirección IPv4 en [notación decimal punteada](https://en.wikipedia.org/wiki/Dot-decimal_notation) sin ceros iniciales. De lo contrario, regresa `false`.

```js [ESM]
net.isIPv4('127.0.0.1'); // regresa true
net.isIPv4('127.000.000.001'); // regresa false
net.isIPv4('127.0.0.1/24'); // regresa false
net.isIPv4('fhqwhgads'); // regresa false
```
## `net.isIPv6(input)` {#netisipv6input}

**Agregado en: v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Regresa: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Regresa `true` si `input` es una dirección IPv6. De lo contrario, regresa `false`.

```js [ESM]
net.isIPv6('::1'); // regresa true
net.isIPv6('fhqwhgads'); // regresa false
```

