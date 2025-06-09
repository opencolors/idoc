---
title: Hilos de Trabajo de Node.js
description: Documentación sobre cómo usar hilos de trabajo en Node.js para aprovechar el multithreading para tareas intensivas en CPU, ofreciendo una visión general de la clase Worker, la comunicación entre hilos y ejemplos de uso.
head:
  - - meta
    - name: og:title
      content: Hilos de Trabajo de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Documentación sobre cómo usar hilos de trabajo en Node.js para aprovechar el multithreading para tareas intensivas en CPU, ofreciendo una visión general de la clase Worker, la comunicación entre hilos y ejemplos de uso.
  - - meta
    - name: twitter:title
      content: Hilos de Trabajo de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Documentación sobre cómo usar hilos de trabajo en Node.js para aprovechar el multithreading para tareas intensivas en CPU, ofreciendo una visión general de la clase Worker, la comunicación entre hilos y ejemplos de uso.
---


# Hilos de trabajo (Worker threads) {#worker-threads}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código fuente:** [lib/worker_threads.js](https://github.com/nodejs/node/blob/v23.5.0/lib/worker_threads.js)

El módulo `node:worker_threads` permite el uso de hilos que ejecutan JavaScript en paralelo. Para acceder a él:

```js [ESM]
const worker = require('node:worker_threads');
```
Los Workers (hilos) son útiles para realizar operaciones de JavaScript que consumen muchos recursos de CPU. No ayudan mucho con el trabajo intensivo de E/S. Las operaciones de E/S asíncronas integradas de Node.js son más eficientes de lo que pueden ser los Workers.

A diferencia de `child_process` o `cluster`, `worker_threads` pueden compartir memoria. Lo hacen transfiriendo instancias de `ArrayBuffer` o compartiendo instancias de `SharedArrayBuffer`.

```js [ESM]
const {
  Worker, isMainThread, parentPort, workerData,
} = require('node:worker_threads');

if (isMainThread) {
  module.exports = function parseJSAsync(script) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: script,
      });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  };
} else {
  const { parse } = require('some-js-parsing-library');
  const script = workerData;
  parentPort.postMessage(parse(script));
}
```
El ejemplo anterior genera un hilo de Worker para cada llamada a `parseJSAsync()`. En la práctica, utilice un pool de Workers para este tipo de tareas. De lo contrario, la sobrecarga de la creación de Workers probablemente superaría su beneficio.

Al implementar un pool de workers, utilice la API [`AsyncResource`](/es/nodejs/api/async_hooks#class-asyncresource) para informar a las herramientas de diagnóstico (por ejemplo, para proporcionar trazas de pila asíncronas) sobre la correlación entre las tareas y sus resultados. Consulte ["Usando `AsyncResource` para un pool de hilos `Worker`"](/es/nodejs/api/async_context#using-asyncresource-for-a-worker-thread-pool) en la documentación de `async_hooks` para ver una implementación de ejemplo.

Los hilos de trabajo heredan las opciones no específicas del proceso de forma predeterminada. Consulte [`Opciones del constructor Worker`](/es/nodejs/api/worker_threads#new-workerfilename-options) para saber cómo personalizar las opciones del hilo de trabajo, específicamente las opciones `argv` y `execArgv`.


## `worker.getEnvironmentData(key)` {#workergetenvironmentdatakey}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.5.0, v16.15.0 | Ya no es experimental. |
| v15.12.0, v14.18.0 | Añadido en: v15.12.0, v14.18.0 |
:::

- `key` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Cualquier valor de JavaScript arbitrario y clonable que pueda ser usado como una clave [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
- Devuelve: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Dentro de un hilo de trabajo, `worker.getEnvironmentData()` devuelve un clon de los datos pasados a `worker.setEnvironmentData()` del hilo de creación. Cada nuevo `Worker` recibe su propia copia de los datos del entorno automáticamente.

```js [ESM]
const {
  Worker,
  isMainThread,
  setEnvironmentData,
  getEnvironmentData,
} = require('node:worker_threads');

if (isMainThread) {
  setEnvironmentData('Hello', 'World!');
  const worker = new Worker(__filename);
} else {
  console.log(getEnvironmentData('Hello'));  // Imprime 'World!'.
}
```
## `worker.isMainThread` {#workerismainthread}

**Añadido en: v10.5.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Es `true` si este código no se está ejecutando dentro de un hilo [`Worker`](/es/nodejs/api/worker_threads#class-worker).

```js [ESM]
const { Worker, isMainThread } = require('node:worker_threads');

if (isMainThread) {
  // Esto vuelve a cargar el archivo actual dentro de una instancia Worker.
  new Worker(__filename);
} else {
  console.log('Inside Worker!');
  console.log(isMainThread);  // Imprime 'false'.
}
```
## `worker.markAsUntransferable(object)` {#workermarkasuntransferableobject}

**Añadido en: v14.5.0, v12.19.0**

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Cualquier valor de JavaScript arbitrario.

Marca un objeto como no transferible. Si `object` aparece en la lista de transferencia de una llamada [`port.postMessage()`](/es/nodejs/api/worker_threads#portpostmessagevalue-transferlist), se lanza un error. Esto es una operación nula si `object` es un valor primitivo.

En particular, esto tiene sentido para objetos que pueden ser clonados, en lugar de transferidos, y que son utilizados por otros objetos en el lado remitente. Por ejemplo, Node.js marca los `ArrayBuffer`s que utiliza para su [`Buffer` pool](/es/nodejs/api/buffer#static-method-bufferallocunsafesize) con esto.

Esta operación no se puede deshacer.

```js [ESM]
const { MessageChannel, markAsUntransferable } = require('node:worker_threads');

const pooledBuffer = new ArrayBuffer(8);
const typedArray1 = new Uint8Array(pooledBuffer);
const typedArray2 = new Float64Array(pooledBuffer);

markAsUntransferable(pooledBuffer);

const { port1 } = new MessageChannel();
try {
  // Esto lanzará un error, porque pooledBuffer no es transferible.
  port1.postMessage(typedArray1, [ typedArray1.buffer ]);
} catch (error) {
  // error.name === 'DataCloneError'
}

// La siguiente línea imprime el contenido de typedArray1 -- todavía posee
// su memoria y no ha sido transferido. Sin
// `markAsUntransferable()`, esto imprimiría un Uint8Array vacío y la
// llamada a postMessage habría tenido éxito.
// typedArray2 también está intacto.
console.log(typedArray1);
console.log(typedArray2);
```
No existe un equivalente a esta API en los navegadores.


## `worker.isMarkedAsUntransferable(object)` {#workerismarkedasuntransferableobject}

**Añadido en: v21.0.0**

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Cualquier valor de JavaScript.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Comprueba si un objeto está marcado como no transferible con [`markAsUntransferable()`](/es/nodejs/api/worker_threads#workermarkasuntransferableobject).

```js [ESM]
const { markAsUntransferable, isMarkedAsUntransferable } = require('node:worker_threads');

const pooledBuffer = new ArrayBuffer(8);
markAsUntransferable(pooledBuffer);

isMarkedAsUntransferable(pooledBuffer);  // Devuelve true.
```
No existe un equivalente a esta API en los navegadores.

## `worker.markAsUncloneable(object)` {#workermarkasuncloneableobject}

**Añadido en: v23.0.0**

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Cualquier valor arbitrario de JavaScript.

Marca un objeto como no clonable. Si `object` se utiliza como [`message`](/es/nodejs/api/worker_threads#event-message) en una llamada a [`port.postMessage()`](/es/nodejs/api/worker_threads#portpostmessagevalue-transferlist), se lanza un error. Esto no tiene efecto si `object` es un valor primitivo.

Esto no tiene ningún efecto en `ArrayBuffer`, ni en ningún objeto similar a `Buffer`.

Esta operación no se puede deshacer.

```js [ESM]
const { markAsUncloneable } = require('node:worker_threads');

const anyObject = { foo: 'bar' };
markAsUncloneable(anyObject);
const { port1 } = new MessageChannel();
try {
  // Esto lanzará un error, porque anyObject no es clonable.
  port1.postMessage(anyObject);
} catch (error) {
  // error.name === 'DataCloneError'
}
```
No existe un equivalente a esta API en los navegadores.

## `worker.moveMessagePortToContext(port, contextifiedSandbox)` {#workermovemessageporttocontextport-contextifiedsandbox}

**Añadido en: v11.13.0**

- `port` [\<MessagePort\>](/es/nodejs/api/worker_threads#class-messageport) El puerto de mensaje a transferir.
- `contextifiedSandbox` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objeto [contextificado](/es/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) como el devuelto por el método `vm.createContext()`.
- Devuelve: [\<MessagePort\>](/es/nodejs/api/worker_threads#class-messageport)

Transfiere un `MessagePort` a un [`vm`](/es/nodejs/api/vm) Context diferente. El objeto `port` original se vuelve inutilizable y la instancia `MessagePort` devuelta lo reemplaza.

El `MessagePort` devuelto es un objeto en el contexto de destino y hereda de su clase global `Object`. Los objetos pasados al escuchador [`port.onmessage()`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/onmessage) también se crean en el contexto de destino y heredan de su clase global `Object`.

Sin embargo, el `MessagePort` creado ya no hereda de [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget), y solo [`port.onmessage()`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/onmessage) se puede usar para recibir eventos usándolo.


## `worker.parentPort` {#workerparentport}

**Agregado en: v10.5.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<MessagePort\>](/es/nodejs/api/worker_threads#class-messageport)

Si este hilo es un [`Worker`](/es/nodejs/api/worker_threads#class-worker), este es un [`MessagePort`](/es/nodejs/api/worker_threads#class-messageport) que permite la comunicación con el hilo padre. Los mensajes enviados utilizando `parentPort.postMessage()` están disponibles en el hilo padre utilizando `worker.on('message')`, y los mensajes enviados desde el hilo padre utilizando `worker.postMessage()` están disponibles en este hilo utilizando `parentPort.on('message')`.

```js [ESM]
const { Worker, isMainThread, parentPort } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.once('message', (message) => {
    console.log(message);  // Imprime '¡Hola, mundo!'.
  });
  worker.postMessage('¡Hola, mundo!');
} else {
  // Cuando se recibe un mensaje del hilo padre, lo devuelve:
  parentPort.once('message', (message) => {
    parentPort.postMessage(message);
  });
}
```
## `worker.postMessageToThread(threadId, value[, transferList][, timeout])` {#workerpostmessagetothreadthreadid-value-transferlist-timeout}

**Agregado en: v22.5.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo activo
:::

- `threadId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El ID del hilo de destino. Si el ID del hilo no es válido, se lanzará un error [`ERR_WORKER_MESSAGING_FAILED`](/es/nodejs/api/errors#err_worker_messaging_failed). Si el ID del hilo de destino es el ID del hilo actual, se lanzará un error [`ERR_WORKER_MESSAGING_SAME_THREAD`](/es/nodejs/api/errors#err_worker_messaging_same_thread).
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) El valor para enviar.
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Si se pasan uno o más objetos tipo `MessagePort` en `value`, se requiere un `transferList` para esos elementos o se lanza [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/es/nodejs/api/errors#err_missing_message_port_in_transfer_list). Consulte [`port.postMessage()`](/es/nodejs/api/worker_threads#portpostmessagevalue-transferlist) para obtener más información.
- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tiempo para esperar a que el mensaje se entregue en milisegundos. De forma predeterminada es `undefined`, lo que significa esperar para siempre. Si la operación agota el tiempo de espera, se lanza un error [`ERR_WORKER_MESSAGING_TIMEOUT`](/es/nodejs/api/errors#err_worker_messaging_timeout).
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Una promesa que se cumple si el mensaje fue procesado con éxito por el hilo de destino.

Envía un valor a otro worker, identificado por su ID de hilo.

Si el hilo de destino no tiene un listener para el evento `workerMessage`, entonces la operación lanzará un error [`ERR_WORKER_MESSAGING_FAILED`](/es/nodejs/api/errors#err_worker_messaging_failed).

Si el hilo de destino lanzó un error al procesar el evento `workerMessage`, entonces la operación lanzará un error [`ERR_WORKER_MESSAGING_ERRORED`](/es/nodejs/api/errors#err_worker_messaging_errored).

Este método debe usarse cuando el hilo de destino no es el padre o hijo directo del hilo actual. Si los dos hilos son padre-hijos, use [`require('node:worker_threads').parentPort.postMessage()`](/es/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) y [`worker.postMessage()`](/es/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) para permitir que los hilos se comuniquen.

El ejemplo a continuación muestra el uso de `postMessageToThread`: crea 10 hilos anidados, el último intentará comunicarse con el hilo principal.

::: code-group
```js [ESM]
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import {
  postMessageToThread,
  threadId,
  workerData,
  Worker,
} from 'node:worker_threads';

const channel = new BroadcastChannel('sync');
const level = workerData?.level ?? 0;

if (level < 10) {
  const worker = new Worker(fileURLToPath(import.meta.url), {
    workerData: { level: level + 1 },
  });
}

if (level === 0) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    postMessageToThread(source, { message: 'pong' });
  });
} else if (level === 10) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    channel.postMessage('done');
    channel.close();
  });

  await postMessageToThread(0, { message: 'ping' });
}

channel.onmessage = channel.close;
```

```js [CJS]
const {
  postMessageToThread,
  threadId,
  workerData,
  Worker,
} = require('node:worker_threads');

const channel = new BroadcastChannel('sync');
const level = workerData?.level ?? 0;

if (level < 10) {
  const worker = new Worker(__filename, {
    workerData: { level: level + 1 },
  });
}

if (level === 0) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    postMessageToThread(source, { message: 'pong' });
  });
} else if (level === 10) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    channel.postMessage('done');
    channel.close();
  });

  postMessageToThread(0, { message: 'ping' });
}

channel.onmessage = channel.close;
```
:::


## `worker.receiveMessageOnPort(port)` {#workerreceivemessageonportport}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.12.0 | El argumento `port` ahora también puede referirse a un `BroadcastChannel`. |
| v12.3.0 | Añadido en: v12.3.0 |
:::

- `port` [\<MessagePort\>](/es/nodejs/api/worker_threads#class-messageport) | [\<BroadcastChannel\>](/es/nodejs/api/worker_threads#class-broadcastchannel-extends-eventtarget)
- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Recibe un solo mensaje de un `MessagePort` dado. Si no hay ningún mensaje disponible, se devuelve `undefined`, de lo contrario, un objeto con una sola propiedad `message` que contiene la carga útil del mensaje, correspondiente al mensaje más antiguo en la cola del `MessagePort`.

```js [ESM]
const { MessageChannel, receiveMessageOnPort } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();
port1.postMessage({ hello: 'world' });

console.log(receiveMessageOnPort(port2));
// Imprime: { message: { hello: 'world' } }
console.log(receiveMessageOnPort(port2));
// Imprime: undefined
```
Cuando se utiliza esta función, no se emite ningún evento `'message'` y no se invoca el listener `onmessage`.

## `worker.resourceLimits` {#workerresourcelimits}

**Añadido en: v13.2.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Proporciona el conjunto de restricciones de recursos del motor JS dentro de este hilo Worker. Si la opción `resourceLimits` se pasó al constructor [`Worker`](/es/nodejs/api/worker_threads#class-worker), esto coincide con sus valores.

Si esto se utiliza en el hilo principal, su valor es un objeto vacío.


## `worker.SHARE_ENV` {#workershare_env}

**Agregado en: v11.14.0**

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)

Un valor especial que se puede pasar como la opción `env` del constructor [`Worker`](/es/nodejs/api/worker_threads#class-worker), para indicar que el hilo actual y el hilo Worker deben compartir acceso de lectura y escritura al mismo conjunto de variables de entorno.

```js [ESM]
const { Worker, SHARE_ENV } = require('node:worker_threads');
new Worker('process.env.SET_IN_WORKER = "foo"', { eval: true, env: SHARE_ENV })
  .on('exit', () => {
    console.log(process.env.SET_IN_WORKER);  // Imprime 'foo'.
  });
```
## `worker.setEnvironmentData(key[, value])` {#workersetenvironmentdatakey-value}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.5.0, v16.15.0 | Ya no es experimental. |
| v15.12.0, v14.18.0 | Agregado en: v15.12.0, v14.18.0 |
:::

- `key` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Cualquier valor JavaScript arbitrario y clonable que pueda usarse como una clave de [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Cualquier valor JavaScript arbitrario y clonable que se clonará y pasará automáticamente a todas las nuevas instancias de `Worker`. Si `value` se pasa como `undefined`, cualquier valor establecido previamente para la `key` se eliminará.

La API `worker.setEnvironmentData()` establece el contenido de `worker.getEnvironmentData()` en el hilo actual y en todas las nuevas instancias de `Worker` generadas desde el contexto actual.

## `worker.threadId` {#workerthreadid}

**Agregado en: v10.5.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Un identificador entero para el hilo actual. En el objeto de trabajo correspondiente (si lo hay), está disponible como [`worker.threadId`](/es/nodejs/api/worker_threads#workerthreadid_1). Este valor es único para cada instancia de [`Worker`](/es/nodejs/api/worker_threads#class-worker) dentro de un único proceso.


## `worker.workerData` {#workerworkerdata}

**Agregado en: v10.5.0**

Un valor arbitrario de JavaScript que contiene un clon de los datos pasados al constructor `Worker` de este hilo.

Los datos se clonan como si se utilizara [`postMessage()`](/es/nodejs/api/worker_threads#portpostmessagevalue-transferlist), de acuerdo con el [algoritmo de clonación estructurada de HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm).

```js [ESM]
const { Worker, isMainThread, workerData } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename, { workerData: 'Hello, world!' });
} else {
  console.log(workerData);  // Imprime 'Hello, world!'.
}
```
## Clase: `BroadcastChannel extends EventTarget` {#class-broadcastchannel-extends-eventtarget}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Ya no es experimental. |
| v15.4.0 | Agregado en: v15.4.0 |
:::

Las instancias de `BroadcastChannel` permiten la comunicación asíncrona de uno a muchos con todas las demás instancias de `BroadcastChannel` vinculadas al mismo nombre de canal.

```js [ESM]
'use strict';

const {
  isMainThread,
  BroadcastChannel,
  Worker,
} = require('node:worker_threads');

const bc = new BroadcastChannel('hello');

if (isMainThread) {
  let c = 0;
  bc.onmessage = (event) => {
    console.log(event.data);
    if (++c === 10) bc.close();
  };
  for (let n = 0; n < 10; n++)
    new Worker(__filename);
} else {
  bc.postMessage('hello from every worker');
  bc.close();
}
```
### `new BroadcastChannel(name)` {#new-broadcastchannelname}

**Agregado en: v15.4.0**

- `name` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) El nombre del canal al que conectarse. Se permite cualquier valor de JavaScript que se pueda convertir en una cadena usando ``${name}``.

### `broadcastChannel.close()` {#broadcastchannelclose}

**Agregado en: v15.4.0**

Cierra la conexión `BroadcastChannel`.

### `broadcastChannel.onmessage` {#broadcastchannelonmessage}

**Agregado en: v15.4.0**

- Tipo: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se invoca con un solo argumento `MessageEvent` cuando se recibe un mensaje.


### `broadcastChannel.onmessageerror` {#broadcastchannelonmessageerror}

**Agregado en: v15.4.0**

- Tipo: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se invoca cuando un mensaje recibido no puede ser deserializado.

### `broadcastChannel.postMessage(message)` {#broadcastchannelpostmessagemessage}

**Agregado en: v15.4.0**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Cualquier valor de JavaScript que se pueda clonar.

### `broadcastChannel.ref()` {#broadcastchannelref}

**Agregado en: v15.4.0**

Opuesto a `unref()`. Llamar a `ref()` en un BroadcastChannel previamente `unref()`ed *no* permite que el programa se cierre si es el único controlador activo que queda (el comportamiento predeterminado). Si el puerto está `ref()`ed, llamar a `ref()` de nuevo no tiene ningún efecto.

### `broadcastChannel.unref()` {#broadcastchannelunref}

**Agregado en: v15.4.0**

Llamar a `unref()` en un BroadcastChannel permite que el hilo se cierre si este es el único controlador activo en el sistema de eventos. Si el BroadcastChannel ya está `unref()`ed, llamar a `unref()` de nuevo no tiene ningún efecto.

## Clase: `MessageChannel` {#class-messagechannel}

**Agregado en: v10.5.0**

Las instancias de la clase `worker.MessageChannel` representan un canal de comunicación bidireccional asíncrono. `MessageChannel` no tiene métodos propios. `new MessageChannel()` produce un objeto con propiedades `port1` y `port2`, que hacen referencia a instancias de [`MessagePort`](/es/nodejs/api/worker_threads#class-messageport) enlazadas.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');

const { port1, port2 } = new MessageChannel();
port1.on('message', (message) => console.log('received', message));
port2.postMessage({ foo: 'bar' });
// Imprime: received { foo: 'bar' } desde el listener `port1.on('message')`
```
## Clase: `MessagePort` {#class-messageport}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.7.0 | Esta clase ahora hereda de `EventTarget` en lugar de `EventEmitter`. |
| v10.5.0 | Agregado en: v10.5.0 |
:::

- Extiende: [\<EventTarget\>](/es/nodejs/api/events#class-eventtarget)

Las instancias de la clase `worker.MessagePort` representan un extremo de un canal de comunicación bidireccional asíncrono. Se puede utilizar para transferir datos estructurados, regiones de memoria y otros `MessagePort`s entre diferentes [`Worker`](/es/nodejs/api/worker_threads#class-worker)s.

Esta implementación coincide con [`MessagePort`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort)s del navegador.


### Evento: `'close'` {#event-close}

**Añadido en: v10.5.0**

El evento `'close'` se emite una vez que cualquiera de los lados del canal se ha desconectado.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

// Imprime:
//   foobar
//   ¡cerrado!
port2.on('message', (message) => console.log(message));
port2.on('close', () => console.log('¡cerrado!'));

port1.postMessage('foobar');
port1.close();
```
### Evento: `'message'` {#event-message}

**Añadido en: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) El valor transmitido

El evento `'message'` se emite para cualquier mensaje entrante, que contiene la entrada clonada de [`port.postMessage()`](/es/nodejs/api/worker_threads#portpostmessagevalue-transferlist).

Los listeners de este evento reciben un clon del parámetro `value` tal como se pasa a `postMessage()` y ningún argumento adicional.

### Evento: `'messageerror'` {#event-messageerror}

**Añadido en: v14.5.0, v12.19.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Un objeto Error

El evento `'messageerror'` se emite cuando falla la deserialización de un mensaje.

Actualmente, este evento se emite cuando se produce un error al instanciar el objeto JS publicado en el extremo receptor. Estas situaciones son raras, pero pueden ocurrir, por ejemplo, cuando ciertos objetos API de Node.js se reciben en un `vm.Context` (donde las API de Node.js no están disponibles actualmente).

### `port.close()` {#portclose}

**Añadido en: v10.5.0**

Desactiva el envío posterior de mensajes a ambos lados de la conexión. Este método se puede llamar cuando no se vaya a producir más comunicación a través de este `MessagePort`.

El [`evento 'close'`](/es/nodejs/api/worker_threads#event-close) se emite en ambas instancias de `MessagePort` que forman parte del canal.

### `port.postMessage(value[, transferList])` {#portpostmessagevalue-transferlist}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.0.0 | Se lanza un error cuando hay un objeto no transferible en la lista de transferencia. |
| v15.6.0 | Se añadió `X509Certificate` a la lista de tipos clonables. |
| v15.0.0 | Se añadió `CryptoKey` a la lista de tipos clonables. |
| v15.14.0, v14.18.0 | Se añadió 'BlockList' a la lista de tipos clonables. |
| v15.9.0, v14.18.0 | Se añadieron tipos 'Histogram' a la lista de tipos clonables. |
| v14.5.0, v12.19.0 | Se añadió `KeyObject` a la lista de tipos clonables. |
| v14.5.0, v12.19.0 | Se añadió `FileHandle` a la lista de tipos transferibles. |
| v10.5.0 | Añadido en: v10.5.0 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Envía un valor de JavaScript al lado receptor de este canal. `value` se transfiere de una manera que es compatible con el [algoritmo de clonación estructurada HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm).

En particular, las diferencias significativas con `JSON` son:

- `value` puede contener referencias circulares.
- `value` puede contener instancias de tipos JS integrados como `RegExp`s, `BigInt`s, `Map`s, `Set`s, etc.
- `value` puede contener matrices tipadas, tanto utilizando `ArrayBuffer`s como `SharedArrayBuffer`s.
- `value` puede contener instancias de [`WebAssembly.Module`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module).
- `value` no puede contener objetos nativos (respaldados por C++) que no sean:
    - [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)s,
    - [\<FileHandle\>](/es/nodejs/api/fs#class-filehandle)s,
    - [\<Histogram\>](/es/nodejs/api/perf_hooks#class-histogram)s,
    - [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject)s,
    - [\<MessagePort\>](/es/nodejs/api/worker_threads#class-messageport)s,
    - [\<net.BlockList\>](/es/nodejs/api/net#class-netblocklist)s,
    - [\<net.SocketAddress\>](/es/nodejs/api/net#class-netsocketaddress)es,
    - [\<X509Certificate\>](/es/nodejs/api/crypto#class-x509certificate)s.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => console.log(message));

const circularData = {};
circularData.foo = circularData;
// Imprime: { foo: [Circular] }
port2.postMessage(circularData);
```
`transferList` puede ser una lista de objetos [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`MessagePort`](/es/nodejs/api/worker_threads#class-messageport) y [`FileHandle`](/es/nodejs/api/fs#class-filehandle). Después de la transferencia, ya no son utilizables en el lado remitente del canal (incluso si no están contenidos en `value`). A diferencia de los [procesos secundarios](/es/nodejs/api/child_process), actualmente no se admite la transferencia de handles como sockets de red.

Si `value` contiene instancias de [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), se puede acceder a ellas desde cualquier hilo. No se pueden enumerar en `transferList`.

`value` todavía puede contener instancias de `ArrayBuffer` que no están en `transferList`; en ese caso, la memoria subyacente se copia en lugar de moverse.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => console.log(message));

const uint8Array = new Uint8Array([ 1, 2, 3, 4 ]);
// Esto publica una copia de `uint8Array`:
port2.postMessage(uint8Array);
// Esto no copia los datos, pero hace que `uint8Array` sea inutilizable:
port2.postMessage(uint8Array, [ uint8Array.buffer ]);

// La memoria para el `sharedUint8Array` es accesible tanto desde el
// original como de la copia recibida por `.on('message')`:
const sharedUint8Array = new Uint8Array(new SharedArrayBuffer(4));
port2.postMessage(sharedUint8Array);

// Esto transfiere un puerto de mensajes recién creado al receptor.
// Esto se puede utilizar, por ejemplo, para crear canales de comunicación entre
// múltiples hilos `Worker` que son hijos del mismo hilo padre.
const otherChannel = new MessageChannel();
port2.postMessage({ port: otherChannel.port1 }, [ otherChannel.port1 ]);
```
El objeto de mensaje se clona inmediatamente y se puede modificar después de la publicación sin tener efectos secundarios.

Para obtener más información sobre los mecanismos de serialización y deserialización detrás de esta API, consulte la [API de serialización del módulo `node:v8`](/es/nodejs/api/v8#serialization-api).


#### Consideraciones al transferir TypedArrays y Buffers {#considerations-when-transferring-typedarrays-and-buffers}

Todas las instancias de `TypedArray` y `Buffer` son vistas sobre un `ArrayBuffer` subyacente. Es decir, es el `ArrayBuffer` el que realmente almacena los datos brutos, mientras que los objetos `TypedArray` y `Buffer` proporcionan una forma de ver y manipular los datos. Es posible y común que se creen múltiples vistas sobre la misma instancia de `ArrayBuffer`. Se debe tener mucho cuidado al usar una lista de transferencia para transferir un `ArrayBuffer`, ya que hacerlo hace que todas las instancias de `TypedArray` y `Buffer` que comparten el mismo `ArrayBuffer` se vuelvan inutilizables.

```js [ESM]
const ab = new ArrayBuffer(10);

const u1 = new Uint8Array(ab);
const u2 = new Uint16Array(ab);

console.log(u2.length);  // prints 5

port.postMessage(u1, [u1.buffer]);

console.log(u2.length);  // prints 0
```
Para las instancias de `Buffer`, específicamente, si el `ArrayBuffer` subyacente se puede transferir o clonar depende completamente de cómo se crearon las instancias, lo que a menudo no se puede determinar de manera confiable.

Un `ArrayBuffer` puede marcarse con [`markAsUntransferable()`](/es/nodejs/api/worker_threads#workermarkasuntransferableobject) para indicar que siempre debe clonarse y nunca transferirse.

Dependiendo de cómo se creó una instancia de `Buffer`, puede o no ser propietaria de su `ArrayBuffer` subyacente. Un `ArrayBuffer` no debe transferirse a menos que se sepa que la instancia de `Buffer` es propietaria de él. En particular, para los `Buffer` creados a partir del pool interno de `Buffer` (usando, por ejemplo, `Buffer.from()` o `Buffer.allocUnsafe()`), transferirlos no es posible y siempre se clonan, lo que envía una copia de todo el pool de `Buffer`. Este comportamiento puede conllevar un mayor uso de memoria no deseado y posibles problemas de seguridad.

Consulte [`Buffer.allocUnsafe()`](/es/nodejs/api/buffer#static-method-bufferallocunsafesize) para obtener más detalles sobre el pooling de `Buffer`.

Los `ArrayBuffer` para las instancias de `Buffer` creadas usando `Buffer.alloc()` o `Buffer.allocUnsafeSlow()` siempre se pueden transferir, pero hacerlo inutiliza todas las demás vistas existentes de esos `ArrayBuffer`.


#### Consideraciones al clonar objetos con prototipos, clases y accesores {#considerations-when-cloning-objects-with-prototypes-classes-and-accessors}

Debido a que la clonación de objetos utiliza el [algoritmo de clonación estructurada HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm), las propiedades no enumerables, los accesores de propiedades y los prototipos de objetos no se conservan. En particular, los objetos [`Buffer`](/es/nodejs/api/buffer) se leerán como [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)s simples en el lado receptor, y las instancias de clases JavaScript se clonarán como objetos JavaScript simples.

```js [ESM]
const b = Symbol('b');

class Foo {
  #a = 1;
  constructor() {
    this[b] = 2;
    this.c = 3;
  }

  get d() { return 4; }
}

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => console.log(data);

port2.postMessage(new Foo());

// Prints: { c: 3 }
```
Esta limitación se extiende a muchos objetos incorporados, como el objeto global `URL`:

```js [ESM]
const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => console.log(data);

port2.postMessage(new URL('https://example.org'));

// Prints: { }
```
### `port.hasRef()` {#porthasref}

**Agregado en: v18.1.0, v16.17.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Si es verdadero, el objeto `MessagePort` mantendrá activo el bucle de eventos de Node.js.

### `port.ref()` {#portref}

**Agregado en: v10.5.0**

Opuesto de `unref()`. Llamar a `ref()` en un puerto previamente `unref()`ed *no* permite que el programa salga si es el único controlador activo restante (el comportamiento predeterminado). Si el puerto está `ref()`ed, llamar a `ref()` nuevamente no tiene ningún efecto.

Si los listeners se adjuntan o eliminan usando `.on('message')`, el puerto se `ref()`ed y `unref()`ed automáticamente dependiendo de si existen listeners para el evento.


### `port.start()` {#portstart}

**Agregado en: v10.5.0**

Comienza a recibir mensajes en este `MessagePort`. Cuando se usa este puerto como un emisor de eventos, esto se llama automáticamente una vez que se adjuntan los listeners `'message'`.

Este método existe para la paridad con la API Web `MessagePort`. En Node.js, solo es útil para ignorar mensajes cuando no hay un listener de eventos presente. Node.js también difiere en su manejo de `.onmessage`. Establecerlo llama automáticamente a `.start()`, pero desactivarlo permite que los mensajes se pongan en cola hasta que se establezca un nuevo controlador o se descarte el puerto.

### `port.unref()` {#portunref}

**Agregado en: v10.5.0**

Llamar a `unref()` en un puerto permite que el hilo se cierre si este es el único controlador activo en el sistema de eventos. Si el puerto ya está `unref()`ed, llamar a `unref()` nuevamente no tiene ningún efecto.

Si los listeners se adjuntan o eliminan usando `.on('message')`, el puerto se `ref()`ed y `unref()`ed automáticamente dependiendo de si existen listeners para el evento.

## Clase: `Worker` {#class-worker}

**Agregado en: v10.5.0**

- Extiende: [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter)

La clase `Worker` representa un hilo de ejecución de JavaScript independiente. La mayoría de las API de Node.js están disponibles dentro de él.

Las diferencias notables dentro de un entorno Worker son:

- Los streams [`process.stdin`](/es/nodejs/api/process#processstdin), [`process.stdout`](/es/nodejs/api/process#processstdout) y [`process.stderr`](/es/nodejs/api/process#processstderr) pueden ser redirigidos por el hilo principal.
- La propiedad [`require('node:worker_threads').isMainThread`](/es/nodejs/api/worker_threads#workerismainthread) se establece en `false`.
- El puerto de mensajes [`require('node:worker_threads').parentPort`](/es/nodejs/api/worker_threads#workerparentport) está disponible.
- [`process.exit()`](/es/nodejs/api/process#processexitcode) no detiene todo el programa, solo el hilo único, y [`process.abort()`](/es/nodejs/api/process#processabort) no está disponible.
- [`process.chdir()`](/es/nodejs/api/process#processchdirdirectory) y los métodos `process` que establecen identificadores de grupo o usuario no están disponibles.
- [`process.env`](/es/nodejs/api/process#processenv) es una copia de las variables de entorno del hilo principal, a menos que se especifique lo contrario. Los cambios en una copia no son visibles en otros hilos y no son visibles para los complementos nativos (a menos que [`worker.SHARE_ENV`](/es/nodejs/api/worker_threads#workershare_env) se pase como la opción `env` al constructor [`Worker`](/es/nodejs/api/worker_threads#class-worker)). En Windows, a diferencia del hilo principal, una copia de las variables de entorno funciona de manera sensible a mayúsculas y minúsculas.
- [`process.title`](/es/nodejs/api/process#processtitle) no se puede modificar.
- Las señales no se entregan a través de [`process.on('...')`](/es/nodejs/api/process#signal-events).
- La ejecución puede detenerse en cualquier momento como resultado de la invocación de [`worker.terminate()`](/es/nodejs/api/worker_threads#workerterminate).
- Los canales IPC de los procesos padre no son accesibles.
- El módulo [`trace_events`](/es/nodejs/api/tracing) no es compatible.
- Los complementos nativos solo se pueden cargar desde múltiples hilos si cumplen [ciertas condiciones](/es/nodejs/api/addons#worker-support).

Es posible crear instancias de `Worker` dentro de otros `Worker`s.

Al igual que los [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) y el [`node:cluster` module](/es/nodejs/api/cluster), la comunicación bidireccional se puede lograr a través del paso de mensajes entre hilos. Internamente, un `Worker` tiene un par incorporado de [`MessagePort`](/es/nodejs/api/worker_threads#class-messageport)s que ya están asociados entre sí cuando se crea el `Worker`. Si bien el objeto `MessagePort` en el lado principal no está directamente expuesto, sus funcionalidades se exponen a través de [`worker.postMessage()`](/es/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) y el evento [`worker.on('message')`](/es/nodejs/api/worker_threads#event-message_1) en el objeto `Worker` para el hilo principal.

Para crear canales de mensajería personalizados (lo que se recomienda en lugar de usar el canal global predeterminado porque facilita la separación de preocupaciones), los usuarios pueden crear un objeto `MessageChannel` en cualquier hilo y pasar uno de los `MessagePort`s en ese `MessageChannel` al otro hilo a través de un canal preexistente, como el global.

Consulte [`port.postMessage()`](/es/nodejs/api/worker_threads#portpostmessagevalue-transferlist) para obtener más información sobre cómo se pasan los mensajes y qué tipo de valores de JavaScript se pueden transportar con éxito a través de la barrera del hilo.

```js [ESM]
const assert = require('node:assert');
const {
  Worker, MessageChannel, MessagePort, isMainThread, parentPort,
} = require('node:worker_threads');
if (isMainThread) {
  const worker = new Worker(__filename);
  const subChannel = new MessageChannel();
  worker.postMessage({ hereIsYourPort: subChannel.port1 }, [subChannel.port1]);
  subChannel.port2.on('message', (value) => {
    console.log('received:', value);
  });
} else {
  parentPort.once('message', (value) => {
    assert(value.hereIsYourPort instanceof MessagePort);
    value.hereIsYourPort.postMessage('the worker is sending this');
    value.hereIsYourPort.close();
  });
}
```

### `new Worker(filename[, options])` {#new-workerfilename-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.8.0, v18.16.0 | Se agregó soporte para una opción `name`, que permite agregar un nombre al título del worker para depuración. |
| v14.9.0 | El parámetro `filename` puede ser un objeto `URL` WHATWG que usa el protocolo `data:`. |
| v14.9.0 | La opción `trackUnmanagedFds` se estableció en `true` de forma predeterminada. |
| v14.6.0, v12.19.0 | Se introdujo la opción `trackUnmanagedFds`. |
| v13.13.0, v12.17.0 | Se introdujo la opción `transferList`. |
| v13.12.0, v12.17.0 | El parámetro `filename` puede ser un objeto `URL` WHATWG que usa el protocolo `file:`. |
| v13.4.0, v12.16.0 | Se introdujo la opción `argv`. |
| v13.2.0, v12.16.0 | Se introdujo la opción `resourceLimits`. |
| v10.5.0 | Se agregó en: v10.5.0 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) La ruta al script principal o módulo del Worker. Debe ser una ruta absoluta o una ruta relativa (es decir, relativa al directorio de trabajo actual) que comience con `./` o `../`, o un objeto `URL` WHATWG que use el protocolo `file:` o `data:`. Cuando se usa una [`data:` URL](https://developer.mozilla.org/es/docs/Web/HTTP/Basics_of_HTTP/Data_URIs), los datos se interpretan según el tipo MIME usando el [cargador de módulos ECMAScript](/es/nodejs/api/esm#data-imports). Si `options.eval` es `true`, esto es una cadena que contiene código JavaScript en lugar de una ruta.
- `options` [\<Object\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `argv` [\<any[]\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Data_types) Lista de argumentos que se convertirían en cadena y se agregarían a `process.argv` en el worker. Esto es principalmente similar a `workerData`, pero los valores están disponibles en el `process.argv` global como si se pasaran como opciones de CLI al script.
    - `env` [\<Object\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object) Si se establece, especifica el valor inicial de `process.env` dentro del hilo Worker. Como valor especial, se puede usar [`worker.SHARE_ENV`](/es/nodejs/api/worker_threads#workershare_env) para especificar que el hilo principal y el hilo secundario deben compartir sus variables de entorno; en ese caso, los cambios en el objeto `process.env` de un hilo también afectan al otro hilo. **Predeterminado:** `process.env`.
    - `eval` [\<boolean\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true` y el primer argumento es una `string`, interpreta el primer argumento al constructor como un script que se ejecuta una vez que el worker está en línea.
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) Lista de opciones de CLI de node pasadas al worker. Las opciones de V8 (como `--max-old-space-size`) y las opciones que afectan el proceso (como `--title`) no son compatibles. Si se establece, esto se proporciona como [`process.execArgv`](/es/nodejs/api/process#processexecargv) dentro del worker. De forma predeterminada, las opciones se heredan del hilo principal.
    - `stdin` [\<boolean\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Boolean_type) Si esto se establece en `true`, entonces `worker.stdin` proporciona un flujo de escritura cuyo contenido aparece como `process.stdin` dentro del Worker. De forma predeterminada, no se proporcionan datos.
    - `stdout` [\<boolean\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Boolean_type) Si esto se establece en `true`, entonces `worker.stdout` no se canaliza automáticamente a `process.stdout` en el padre.
    - `stderr` [\<boolean\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Boolean_type) Si esto se establece en `true`, entonces `worker.stderr` no se canaliza automáticamente a `process.stderr` en el padre.
    - `workerData` [\<any\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Data_types) Cualquier valor de JavaScript que se clona y se pone a disposición como [`require('node:worker_threads').workerData`](/es/nodejs/api/worker_threads#workerworkerdata). La clonación se produce como se describe en el [algoritmo de clonación estructurada HTML](https://developer.mozilla.org/es/docs/Web/API/Web_Workers_API/Structured_clone_algorithm), y se produce un error si el objeto no se puede clonar (por ejemplo, porque contiene `function`s).
    - `trackUnmanagedFds` [\<boolean\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Boolean_type) Si esto se establece en `true`, entonces el Worker rastrea los descriptores de archivo sin administrar gestionados a través de [`fs.open()`](/es/nodejs/api/fs#fsopenpath-flags-mode-callback) y [`fs.close()`](/es/nodejs/api/fs#fsclosefd-callback), y los cierra cuando el Worker sale, de forma similar a otros recursos como sockets de red o descriptores de archivo gestionados a través de la API [`FileHandle`](/es/nodejs/api/fs#class-filehandle). Esta opción se hereda automáticamente de todos los `Worker`s anidados. **Predeterminado:** `true`.
    - `transferList` [\<Object[]\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object) Si se pasan uno o más objetos similares a `MessagePort` en `workerData`, se requiere una `transferList` para esos elementos o se lanza [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/es/nodejs/api/errors#err_missing_message_port_in_transfer_list). Consulte [`port.postMessage()`](/es/nodejs/api/worker_threads#portpostmessagevalue-transferlist) para obtener más información.
    - `resourceLimits` [\<Object\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object) Un conjunto opcional de límites de recursos para la nueva instancia del motor JS. Alcanzar estos límites conduce a la finalización de la instancia `Worker`. Estos límites solo afectan al motor JS, y a ningún dato externo, incluyendo ningún `ArrayBuffer`. Incluso si se establecen estos límites, el proceso aún puede abortar si encuentra una situación global de falta de memoria. 
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type) El tamaño máximo del montón principal en MB. Si se establece el argumento de la línea de comandos [`--max-old-space-size`](/es/nodejs/api/cli#--max-old-space-sizesize-in-mib), este valor se anula.
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type) El tamaño máximo de un espacio de montón para objetos creados recientemente. Si se establece el argumento de la línea de comandos [`--max-semi-space-size`](/es/nodejs/api/cli#--max-semi-space-sizesize-in-mib), este valor se anula.
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type) El tamaño de un rango de memoria preasignado utilizado para el código generado.
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type) El tamaño máximo de pila predeterminado para el hilo. Los valores pequeños pueden conducir a instancias de Worker inutilizables. **Predeterminado:** `4`.
  
 
    - `name` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) Un `name` opcional que se agregará al título del worker para fines de depuración/identificación, haciendo que el título final sea `[worker ${id}] ${name}`. **Predeterminado:** `''`.
  
 


### Evento: `'error'` {#event-error}

**Añadido en: v10.5.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

El evento `'error'` se emite si el hilo de trabajo lanza una excepción no capturada. En ese caso, el trabajador se termina.

### Evento: `'exit'` {#event-exit}

**Añadido en: v10.5.0**

- `exitCode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El evento `'exit'` se emite una vez que el trabajador se ha detenido. Si el trabajador salió llamando a [`process.exit()`](/es/nodejs/api/process#processexitcode), el parámetro `exitCode` es el código de salida pasado. Si el trabajador fue terminado, el parámetro `exitCode` es `1`.

Este es el evento final emitido por cualquier instancia de `Worker`.

### Evento: `'message'` {#event-message_1}

**Añadido en: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) El valor transmitido

El evento `'message'` se emite cuando el hilo de trabajo ha invocado [`require('node:worker_threads').parentPort.postMessage()`](/es/nodejs/api/worker_threads#workerpostmessagevalue-transferlist). Consulte el evento [`port.on('message')`](/es/nodejs/api/worker_threads#event-message) para obtener más detalles.

Todos los mensajes enviados desde el hilo de trabajo se emiten antes de que se emita el [`'exit'` event](/es/nodejs/api/worker_threads#event-exit) en el objeto `Worker`.

### Evento: `'messageerror'` {#event-messageerror_1}

**Añadido en: v14.5.0, v12.19.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Un objeto Error

El evento `'messageerror'` se emite cuando falla la deserialización de un mensaje.

### Evento: `'online'` {#event-online}

**Añadido en: v10.5.0**

El evento `'online'` se emite cuando el hilo de trabajo ha comenzado a ejecutar código JavaScript.

### `worker.getHeapSnapshot([options])` {#workergetheapsnapshotoptions}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.1.0 | Soporte para opciones para configurar la instantánea de montón. |
| v13.9.0, v12.17.0 | Añadido en: v13.9.0, v12.17.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exposeInternals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es verdadero, expone los internos en la instantánea de montón. **Predeterminado:** `false`.
    - `exposeNumericValues` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es verdadero, expone valores numéricos en campos artificiales. **Predeterminado:** `false`.


- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Una promesa para un flujo Readable que contiene una instantánea de montón V8

Devuelve un flujo legible para una instantánea V8 del estado actual del Worker. Consulte [`v8.getHeapSnapshot()`](/es/nodejs/api/v8#v8getheapsnapshotoptions) para obtener más detalles.

Si el hilo de Worker ya no se está ejecutando, lo que puede ocurrir antes de que se emita el evento [`'exit'` event](/es/nodejs/api/worker_threads#event-exit), la `Promise` devuelta se rechaza inmediatamente con un error [`ERR_WORKER_NOT_RUNNING`](/es/nodejs/api/errors#err_worker_not_running).


### `worker.performance` {#workerperformance}

**Agregado en: v15.1.0, v14.17.0, v12.22.0**

Un objeto que se puede usar para consultar información de rendimiento de una instancia de worker. Similar a [`perf_hooks.performance`](/es/nodejs/api/perf_hooks#perf_hooksperformance).

#### `performance.eventLoopUtilization([utilization1[, utilization2]])` {#performanceeventlooputilizationutilization1-utilization2}

**Agregado en: v15.1.0, v14.17.0, v12.22.0**

- `utilization1` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El resultado de una llamada anterior a `eventLoopUtilization()`.
- `utilization2` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El resultado de una llamada anterior a `eventLoopUtilization()` anterior a `utilization1`.
- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `active` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La misma llamada que [`perf_hooks` `eventLoopUtilization()`](/es/nodejs/api/perf_hooks#performanceeventlooputilizationutilization1-utilization2), excepto que se devuelven los valores de la instancia del worker.

Una diferencia es que, a diferencia del hilo principal, el bootstrapping dentro de un worker se realiza dentro del bucle de eventos. Por lo tanto, la utilización del bucle de eventos está disponible inmediatamente una vez que el script del worker comienza la ejecución.

Un tiempo `idle` que no aumenta no indica que el worker está atascado en el bootstrap. Los siguientes ejemplos muestran cómo toda la vida útil del worker nunca acumula tiempo `idle`, pero aún puede procesar mensajes.

```js [ESM]
const { Worker, isMainThread, parentPort } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  setInterval(() => {
    worker.postMessage('hi');
    console.log(worker.performance.eventLoopUtilization());
  }, 100).unref();
  return;
}

parentPort.on('message', () => console.log('msg')).unref();
(function r(n) {
  if (--n < 0) return;
  const t = Date.now();
  while (Date.now() - t < 300);
  setImmediate(r, n);
})(10);
```
La utilización del bucle de eventos de un worker está disponible solo después de que se emite el evento [`'online'` ](/es/nodejs/api/worker_threads#event-online), y si se llama antes de esto, o después del evento [`'exit'` ](/es/nodejs/api/worker_threads#event-exit), entonces todas las propiedades tienen el valor de `0`.


### `worker.postMessage(value[, transferList])` {#workerpostmessagevalue-transferlist}

**Añadido en: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Envía un mensaje al worker que se recibe a través de [`require('node:worker_threads').parentPort.on('message')`](/es/nodejs/api/worker_threads#event-message). Consulte [`port.postMessage()`](/es/nodejs/api/worker_threads#portpostmessagevalue-transferlist) para obtener más detalles.

### `worker.ref()` {#workerref}

**Añadido en: v10.5.0**

Opuesto a `unref()`, llamar a `ref()` en un worker previamente `unref()`ed *no* permite que el programa se cierre si es el único controlador activo que queda (el comportamiento predeterminado). Si el worker es `ref()`ed, llamar a `ref()` de nuevo no tiene ningún efecto.

### `worker.resourceLimits` {#workerresourcelimits_1}

**Añadido en: v13.2.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

Proporciona el conjunto de restricciones de recursos del motor JS para este hilo de Worker. Si la opción `resourceLimits` se pasó al constructor [`Worker`](/es/nodejs/api/worker_threads#class-worker), esto coincide con sus valores.

Si el worker se ha detenido, el valor de retorno es un objeto vacío.

### `worker.stderr` {#workerstderr}

**Añadido en: v10.5.0**

- [\<stream.Readable\>](/es/nodejs/api/stream#class-streamreadable)

Este es un flujo legible que contiene datos escritos en [`process.stderr`](/es/nodejs/api/process#processstderr) dentro del hilo del worker. Si `stderr: true` no se pasó al constructor [`Worker`](/es/nodejs/api/worker_threads#class-worker), entonces los datos se canalizan al flujo [`process.stderr`](/es/nodejs/api/process#processstderr) del hilo principal.


### `worker.stdin` {#workerstdin}

**Agregado en: v10.5.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<stream.Writable\>](/es/nodejs/api/stream#class-streamwritable)

Si se pasó `stdin: true` al constructor [`Worker`](/es/nodejs/api/worker_threads#class-worker), este es un flujo de escritura. Los datos escritos en este flujo estarán disponibles en el hilo del trabajador como [`process.stdin`](/es/nodejs/api/process#processstdin).

### `worker.stdout` {#workerstdout}

**Agregado en: v10.5.0**

- [\<stream.Readable\>](/es/nodejs/api/stream#class-streamreadable)

Este es un flujo de lectura que contiene datos escritos en [`process.stdout`](/es/nodejs/api/process#processstdout) dentro del hilo del trabajador. Si `stdout: true` no se pasó al constructor [`Worker`](/es/nodejs/api/worker_threads#class-worker), entonces los datos se canalizan al flujo [`process.stdout`](/es/nodejs/api/process#processstdout) del hilo principal.

### `worker.terminate()` {#workerterminate}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.5.0 | Esta función ahora devuelve una Promise. Pasar una función de callback está en desuso, y fue inútil hasta esta versión, ya que el Worker se terminaba de forma síncrona. Terminar ahora es una operación totalmente asíncrona. |
| v10.5.0 | Agregado en: v10.5.0 |
:::

- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Detiene toda la ejecución de JavaScript en el hilo del trabajador lo antes posible. Devuelve una Promise para el código de salida que se cumple cuando se emite el [`'exit'` event](/es/nodejs/api/worker_threads#event-exit).

### `worker.threadId` {#workerthreadid_1}

**Agregado en: v10.5.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Un identificador entero para el hilo referenciado. Dentro del hilo del trabajador, está disponible como [`require('node:worker_threads').threadId`](/es/nodejs/api/worker_threads#workerthreadid). Este valor es único para cada instancia de `Worker` dentro de un solo proceso.

### `worker.unref()` {#workerunref}

**Agregado en: v10.5.0**

Llamar a `unref()` en un trabajador permite que el hilo se cierre si este es el único controlador activo en el sistema de eventos. Si el trabajador ya está `unref()`ed, llamar a `unref()` nuevamente no tiene ningún efecto.


## Notas {#notes}

### Bloqueo síncrono de stdio {#synchronous-blocking-of-stdio}

Los `Worker`s utilizan el paso de mensajes a través de [\<MessagePort\>](/es/nodejs/api/worker_threads#class-messageport) para implementar las interacciones con `stdio`. Esto significa que la salida de `stdio` originada en un `Worker` puede ser bloqueada por código síncrono en el extremo receptor que esté bloqueando el bucle de eventos de Node.js.

::: code-group
```js [ESM]
import {
  Worker,
  isMainThread,
} from 'node:worker_threads';

if (isMainThread) {
  new Worker(new URL(import.meta.url));
  for (let n = 0; n < 1e10; n++) {
    // Bucle para simular trabajo.
  }
} else {
  // Esta salida será bloqueada por el bucle for en el hilo principal.
  console.log('foo');
}
```

```js [CJS]
'use strict';

const {
  Worker,
  isMainThread,
} = require('node:worker_threads');

if (isMainThread) {
  new Worker(__filename);
  for (let n = 0; n < 1e10; n++) {
    // Bucle para simular trabajo.
  }
} else {
  // Esta salida será bloqueada por el bucle for en el hilo principal.
  console.log('foo');
}
```
:::

### Lanzamiento de hilos de trabajo desde scripts de precarga {#launching-worker-threads-from-preload-scripts}

Tenga cuidado al lanzar hilos de trabajo desde scripts de precarga (scripts cargados y ejecutados utilizando el indicador de línea de comandos `-r`). A menos que la opción `execArgv` esté explícitamente establecida, los nuevos hilos de Worker heredan automáticamente los indicadores de línea de comandos del proceso en ejecución y precargarán los mismos scripts de precarga que el hilo principal. Si el script de precarga lanza incondicionalmente un hilo de trabajo, cada hilo generado generará otro hasta que la aplicación falle.

