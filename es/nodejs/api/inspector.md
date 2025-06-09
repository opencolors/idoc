---
title: Documentación del Módulo Inspector de Node.js
description: El módulo Inspector de Node.js proporciona una API para interactuar con el inspector V8, permitiendo a los desarrolladores depurar aplicaciones Node.js conectándose al protocolo del inspector.
head:
  - - meta
    - name: og:title
      content: Documentación del Módulo Inspector de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: El módulo Inspector de Node.js proporciona una API para interactuar con el inspector V8, permitiendo a los desarrolladores depurar aplicaciones Node.js conectándose al protocolo del inspector.
  - - meta
    - name: twitter:title
      content: Documentación del Módulo Inspector de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: El módulo Inspector de Node.js proporciona una API para interactuar con el inspector V8, permitiendo a los desarrolladores depurar aplicaciones Node.js conectándose al protocolo del inspector.
---


# Inspector {#inspector}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código Fuente:** [lib/inspector.js](https://github.com/nodejs/node/blob/v23.5.0/lib/inspector.js)

El módulo `node:inspector` proporciona una API para interactuar con el inspector V8.

Se puede acceder usando:

::: code-group
```js [ESM]
import * as inspector from 'node:inspector/promises';
```

```js [CJS]
const inspector = require('node:inspector/promises');
```
:::

o

::: code-group
```js [ESM]
import * as inspector from 'node:inspector';
```

```js [CJS]
const inspector = require('node:inspector');
```
:::

## API de Promesas {#promises-api}

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

**Agregado en: v19.0.0**

### Clase: `inspector.Session` {#class-inspectorsession}

- Extiende: [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter)

`inspector.Session` se utiliza para enviar mensajes al back-end del inspector V8 y recibir respuestas y notificaciones de mensajes.

#### `new inspector.Session()` {#new-inspectorsession}

**Agregado en: v8.0.0**

Cree una nueva instancia de la clase `inspector.Session`. La sesión del inspector debe conectarse a través de [`session.connect()`](/es/nodejs/api/inspector#sessionconnect) antes de que los mensajes puedan enviarse al backend del inspector.

Cuando se utiliza `Session`, el objeto generado por la API de la consola no se liberará, a menos que realicemos manualmente el comando `Runtime.DiscardConsoleEntries`.

#### Evento: `'inspectorNotification'` {#event-inspectornotification}

**Agregado en: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El objeto de mensaje de notificación

Se emite cuando se recibe alguna notificación del Inspector V8.

```js [ESM]
session.on('inspectorNotification', (message) => console.log(message.method));
// Debugger.paused
// Debugger.resumed
```
También es posible suscribirse solo a las notificaciones con un método específico:


#### Evento: `&lt;inspector-protocol-method&gt;`; {#event-&lt;inspector-protocol-method&gt;;}

**Añadido en: v8.0.0**

- [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El objeto del mensaje de notificación

Emitido cuando se recibe una notificación del inspector que tiene su campo de método establecido en el valor `\<inspector-protocol-method\>`.

El siguiente fragmento instala un listener en el evento [`'Debugger.paused'`](https://chromedevtools.github.io/devtools-protocol/v8/Debugger#event-paused), e imprime la razón de la suspensión del programa cada vez que la ejecución del programa se suspende (a través de breakpoints, por ejemplo):

```js [ESM]
session.on('Debugger.paused', ({ params }) => {
  console.log(params.hitBreakpoints);
});
// [ '/the/file/that/has/the/breakpoint.js:11:0' ]
```
#### `session.connect()` {#sessionconnect}

**Añadido en: v8.0.0**

Conecta una sesión al back-end del inspector.

#### `session.connectToMainThread()` {#sessionconnecttomainthread}

**Añadido en: v12.11.0**

Conecta una sesión al back-end del inspector del hilo principal. Se lanzará una excepción si esta API no se llama en un hilo Worker.

#### `session.disconnect()` {#sessiondisconnect}

**Añadido en: v8.0.0**

Cierra inmediatamente la sesión. Todas las devoluciones de llamada de mensajes pendientes se llamarán con un error. Se deberá llamar a [`session.connect()`](/es/nodejs/api/inspector#sessionconnect) para poder volver a enviar mensajes. La sesión reconectada perderá todo el estado del inspector, como los agentes habilitados o los breakpoints configurados.

#### `session.post(method[, params])` {#sessionpostmethod-params}

**Añadido en: v19.0.0**

- `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `params` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Devuelve: [\<Promesa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Envía un mensaje al back-end del inspector.

```js [ESM]
import { Session } from 'node:inspector/promises';
try {
  const session = new Session();
  session.connect();
  const result = await session.post('Runtime.evaluate', { expression: '2 + 2' });
  console.log(result);
} catch (error) {
  console.error(error);
}
// Output: { result: { type: 'number', value: 4, description: '4' } }
```
La última versión del protocolo del inspector V8 se publica en el [Chrome DevTools Protocol Viewer](https://chromedevtools.github.io/devtools-protocol/v8/).

El inspector de Node.js admite todos los dominios del protocolo de Chrome DevTools declarados por V8. El dominio del protocolo de Chrome DevTools proporciona una interfaz para interactuar con uno de los agentes de tiempo de ejecución utilizados para inspeccionar el estado de la aplicación y escuchar los eventos de tiempo de ejecución.


#### Ejemplo de uso {#example-usage}

Aparte del depurador, varios V8 Profilers están disponibles a través del protocolo DevTools.

##### Perfilador de CPU {#cpu-profiler}

Aquí hay un ejemplo que muestra cómo usar el [Perfilador de CPU](https://chromedevtools.github.io/devtools-protocol/v8/Profiler):

```js [ESM]
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();
session.connect();

await session.post('Profiler.enable');
await session.post('Profiler.start');
// Invocar lógica de negocio bajo medición aquí...

// algún tiempo después...
const { profile } = await session.post('Profiler.stop');

// Escribir perfil en disco, subir, etc.
fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
```
##### Perfilador de Heap {#heap-profiler}

Aquí hay un ejemplo que muestra cómo usar el [Perfilador de Heap](https://chromedevtools.github.io/devtools-protocol/v8/HeapProfiler):

```js [ESM]
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

const result = await session.post('HeapProfiler.takeHeapSnapshot', null);
console.log('HeapProfiler.takeHeapSnapshot done:', result);
session.disconnect();
fs.closeSync(fd);
```
## API de Callback {#callback-api}

### Clase: `inspector.Session` {#class-inspectorsession_1}

- Extiende: [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter)

El `inspector.Session` se utiliza para enviar mensajes al back-end del inspector V8 y recibir respuestas y notificaciones de mensajes.

#### `new inspector.Session()` {#new-inspectorsession_1}

**Agregado en: v8.0.0**

Crea una nueva instancia de la clase `inspector.Session`. La sesión del inspector debe estar conectada a través de [`session.connect()`](/es/nodejs/api/inspector#sessionconnect) antes de que los mensajes puedan ser enviados al backend del inspector.

Cuando se utiliza `Session`, el objeto generado por la API de la consola no se liberará, a menos que ejecutemos manualmente el comando `Runtime.DiscardConsoleEntries`.


#### Evento: `'inspectorNotification'` {#event-inspectornotification_1}

**Agregado en: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El objeto del mensaje de notificación

Se emite cuando se recibe cualquier notificación del Inspector V8.

```js [ESM]
session.on('inspectorNotification', (message) => console.log(message.method));
// Debugger.paused
// Debugger.resumed
```
También es posible suscribirse solo a las notificaciones con un método específico:

#### Evento: `&lt;inspector-protocol-method&gt;`; {#event-&lt;inspector-protocol-method&gt;;_1}

**Agregado en: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El objeto del mensaje de notificación

Se emite cuando se recibe una notificación del inspector que tiene su campo de método establecido en el valor `\<inspector-protocol-method\>`.

El siguiente fragmento instala un listener en el evento [`'Debugger.paused'`](https://chromedevtools.github.io/devtools-protocol/v8/Debugger#event-paused), e imprime la razón de la suspensión del programa cada vez que la ejecución del programa se suspende (a través de puntos de interrupción, por ejemplo):

```js [ESM]
session.on('Debugger.paused', ({ params }) => {
  console.log(params.hitBreakpoints);
});
// [ '/the/file/that/has/the/breakpoint.js:11:0' ]
```
#### `session.connect()` {#sessionconnect_1}

**Agregado en: v8.0.0**

Conecta una sesión al back-end del inspector.

#### `session.connectToMainThread()` {#sessionconnecttomainthread_1}

**Agregado en: v12.11.0**

Conecta una sesión al back-end del inspector del hilo principal. Se lanzará una excepción si esta API no se llamó en un hilo Worker.

#### `session.disconnect()` {#sessiondisconnect_1}

**Agregado en: v8.0.0**

Cierra inmediatamente la sesión. Todas las devoluciones de llamada de mensajes pendientes se llamarán con un error. Se deberá llamar a [`session.connect()`](/es/nodejs/api/inspector#sessionconnect) para poder enviar mensajes nuevamente. La sesión reconectada perderá todo el estado del inspector, como los agentes habilitados o los puntos de interrupción configurados.

#### `session.post(method[, params][, callback])` {#sessionpostmethod-params-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v8.0.0 | Agregado en: v8.0.0 |
:::

- `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Publica un mensaje al back-end del inspector. Se notificará a `callback` cuando se reciba una respuesta. `callback` es una función que acepta dos argumentos opcionales: error y resultado específico del mensaje.

```js [ESM]
session.post('Runtime.evaluate', { expression: '2 + 2' },
             (error, { result }) => console.log(result));
// Output: { type: 'number', value: 4, description: '4' }
```
La última versión del protocolo del inspector V8 se publica en el [Chrome DevTools Protocol Viewer](https://chromedevtools.github.io/devtools-protocol/v8/).

El inspector de Node.js admite todos los dominios del protocolo Chrome DevTools declarados por V8. El dominio del protocolo Chrome DevTools proporciona una interfaz para interactuar con uno de los agentes de tiempo de ejecución utilizados para inspeccionar el estado de la aplicación y escuchar los eventos de tiempo de ejecución.

No puede establecer `reportProgress` en `true` al enviar un comando `HeapProfiler.takeHeapSnapshot` o `HeapProfiler.stopTrackingHeapObjects` a V8.


#### Ejemplo de uso {#example-usage_1}

Además del depurador, varios V8 Profilers están disponibles a través del protocolo DevTools.

##### Perfilador de CPU {#cpu-profiler_1}

Aquí hay un ejemplo que muestra cómo usar el [Perfilador de CPU](https://chromedevtools.github.io/devtools-protocol/v8/Profiler):

```js [ESM]
const inspector = require('node:inspector');
const fs = require('node:fs');
const session = new inspector.Session();
session.connect();

session.post('Profiler.enable', () => {
  session.post('Profiler.start', () => {
    // Invoca la lógica de negocio bajo medición aquí...

    // algún tiempo después...
    session.post('Profiler.stop', (err, { profile }) => {
      // Escribe el perfil en el disco, súbelo, etc.
      if (!err) {
        fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
      }
    });
  });
});
```
##### Perfilador de montón {#heap-profiler_1}

Aquí hay un ejemplo que muestra cómo usar el [Perfilador de montón](https://chromedevtools.github.io/devtools-protocol/v8/HeapProfiler):

```js [ESM]
const inspector = require('node:inspector');
const fs = require('node:fs');
const session = new inspector.Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

session.post('HeapProfiler.takeHeapSnapshot', null, (err, r) => {
  console.log('HeapProfiler.takeHeapSnapshot done:', err, r);
  session.disconnect();
  fs.closeSync(fd);
});
```
## Objetos Comunes {#common-objects}

### `inspector.close()` {#inspectorclose}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.10.0 | La API está expuesta en los hilos de trabajo. |
| v9.0.0 | Añadido en: v9.0.0 |
:::

Intenta cerrar todas las conexiones restantes, bloqueando el bucle de eventos hasta que todas estén cerradas. Una vez que todas las conexiones están cerradas, desactiva el inspector.

### `inspector.console` {#inspectorconsole}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objeto para enviar mensajes a la consola remota del inspector.

```js [ESM]
require('node:inspector').console.log('un mensaje');
```
La consola del inspector no tiene paridad de API con la consola de Node.js.


### `inspector.open([port[, host[, wait]]])` {#inspectoropenport-host-wait}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.6.0 | inspector.open() ahora devuelve un objeto `Disposable`. |
:::

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Puerto en el que escuchar las conexiones del inspector. Opcional. **Predeterminado:** lo que se especificó en la CLI.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host en el que escuchar las conexiones del inspector. Opcional. **Predeterminado:** lo que se especificó en la CLI.
- `wait` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Bloquear hasta que un cliente se haya conectado. Opcional. **Predeterminado:** `false`.
- Devuelve: [\<Disposable\>](https://tc39.es/proposal-explicit-resource-management/#sec-disposable-interface) Un Disposable que llama a [`inspector.close()`](/es/nodejs/api/inspector#inspectorclose).

Activa el inspector en el host y el puerto. Equivalente a `node --inspect=[[host:]port]`, pero se puede hacer programáticamente después de que node haya comenzado.

Si wait es `true`, se bloqueará hasta que un cliente se haya conectado al puerto de inspección y el control de flujo se haya pasado al cliente de depuración.

Consulta la [advertencia de seguridad](/es/nodejs/api/cli#warning-binding-inspector-to-a-public-ipport-combination-is-insecure) con respecto al uso del parámetro `host`.

### `inspector.url()` {#inspectorurl}

- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Devuelve la URL del inspector activo, o `undefined` si no hay ninguno.

```bash [BASH]
$ node --inspect -p 'inspector.url()'
Debugger listening on ws://127.0.0.1:9229/166e272e-7a30-4d09-97ce-f1c012b43c34
For help, see: https://nodejs.org/en/docs/inspector
ws://127.0.0.1:9229/166e272e-7a30-4d09-97ce-f1c012b43c34

$ node --inspect=localhost:3000 -p 'inspector.url()'
Debugger listening on ws://localhost:3000/51cf8d0e-3c36-4c59-8efd-54519839e56a
For help, see: https://nodejs.org/en/docs/inspector
ws://localhost:3000/51cf8d0e-3c36-4c59-8efd-54519839e56a

$ node -p 'inspector.url()'
undefined
```

### `inspector.waitForDebugger()` {#inspectorwaitfordebugger}

**Agregado en: v12.7.0**

Se bloquea hasta que un cliente (existente o conectado posteriormente) haya enviado el comando `Runtime.runIfWaitingForDebugger`.

Se lanzará una excepción si no hay un inspector activo.

## Integración con DevTools {#integration-with-devtools}

El módulo `node:inspector` proporciona una API para integrarse con DevTools que admiten el protocolo Chrome DevTools. Los frontends de DevTools conectados a una instancia de Node.js en ejecución pueden capturar eventos de protocolo emitidos desde la instancia y mostrarlos en consecuencia para facilitar la depuración. Los siguientes métodos transmiten un evento de protocolo a todos los frontends conectados. Los `params` pasados a los métodos pueden ser opcionales, dependiendo del protocolo.

```js [ESM]
// Se activará el evento `Network.requestWillBeSent`.
inspector.Network.requestWillBeSent({
  requestId: 'request-id-1',
  timestamp: Date.now() / 1000,
  wallTime: Date.now(),
  request: {
    url: 'https://nodejs.org/en',
    method: 'GET',
  },
});
```
### `inspector.Network.requestWillBeSent([params])` {#inspectornetworkrequestwillbesentparams}

**Agregado en: v22.6.0, v20.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `params` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Esta característica solo está disponible con el indicador `--experimental-network-inspection` habilitado.

Transmite el evento `Network.requestWillBeSent` a los frontends conectados. Este evento indica que la aplicación está a punto de enviar una solicitud HTTP.

### `inspector.Network.responseReceived([params])` {#inspectornetworkresponsereceivedparams}

**Agregado en: v22.6.0, v20.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `params` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Esta característica solo está disponible con el indicador `--experimental-network-inspection` habilitado.

Transmite el evento `Network.responseReceived` a los frontends conectados. Este evento indica que la respuesta HTTP está disponible.


### `inspector.Network.loadingFinished([params])` {#inspectornetworkloadingfinishedparams}

**Añadido en: v22.6.0, v20.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Esta característica solo está disponible con la bandera `--experimental-network-inspection` habilitada.

Emite el evento `Network.loadingFinished` a los frontends conectados. Este evento indica que la carga de la solicitud HTTP ha finalizado.

### `inspector.Network.loadingFailed([params])` {#inspectornetworkloadingfailedparams}

**Añadido en: v22.7.0, v20.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Esta característica solo está disponible con la bandera `--experimental-network-inspection` habilitada.

Emite el evento `Network.loadingFailed` a los frontends conectados. Este evento indica que la carga de la solicitud HTTP ha fallado.

## Soporte de puntos de interrupción {#support-of-breakpoints}

El Protocolo de Chrome DevTools [`Debugger` domain](https://chromedevtools.github.io/devtools-protocol/v8/Debugger) permite que un `inspector.Session` se conecte a un programa y establezca puntos de interrupción para recorrer el código.

Sin embargo, se debe evitar establecer puntos de interrupción con un `inspector.Session` del mismo hilo, que está conectado por [`session.connect()`](/es/nodejs/api/inspector#sessionconnect), ya que el programa al que se adjunta y se pausa es exactamente el depurador en sí. En su lugar, intente conectarse al hilo principal mediante [`session.connectToMainThread()`](/es/nodejs/api/inspector#sessionconnecttomainthread) y establecer puntos de interrupción en un hilo de trabajador, o conéctese con un programa [Debugger](/es/nodejs/api/debugger) a través de una conexión WebSocket.

