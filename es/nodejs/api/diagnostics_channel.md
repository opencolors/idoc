---
title: Canal de Diagnóstico de Node.js
description: El módulo Canal de Diagnóstico en Node.js proporciona una API para crear, publicar y suscribirse a canales de información de diagnóstico nombrados, permitiendo un mejor monitoreo y depuración de aplicaciones.
head:
  - - meta
    - name: og:title
      content: Canal de Diagnóstico de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: El módulo Canal de Diagnóstico en Node.js proporciona una API para crear, publicar y suscribirse a canales de información de diagnóstico nombrados, permitiendo un mejor monitoreo y depuración de aplicaciones.
  - - meta
    - name: twitter:title
      content: Canal de Diagnóstico de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: El módulo Canal de Diagnóstico en Node.js proporciona una API para crear, publicar y suscribirse a canales de información de diagnóstico nombrados, permitiendo un mejor monitoreo y depuración de aplicaciones.
---


# Canal de Diagnósticos {#diagnostics-channel}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.2.0, v18.13.0 | diagnostics_channel ahora es Estable. |
| v15.1.0, v14.17.0 | Añadido en: v15.1.0, v14.17.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código Fuente:** [lib/diagnostics_channel.js](https://github.com/nodejs/node/blob/v23.5.0/lib/diagnostics_channel.js)

El módulo `node:diagnostics_channel` proporciona una API para crear canales nombrados para reportar datos de mensajes arbitrarios con fines de diagnóstico.

Se puede acceder usando:

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
```
:::

Se pretende que un escritor de módulos que desee reportar mensajes de diagnóstico cree uno o varios canales de nivel superior para reportar mensajes a través de ellos. Los canales también se pueden adquirir en tiempo de ejecución, pero no se recomienda debido a la sobrecarga adicional que esto implica. Los canales se pueden exportar por conveniencia, pero siempre que se conozca el nombre, se puede adquirir en cualquier lugar.

Si tiene la intención de que su módulo produzca datos de diagnóstico para que otros los consuman, se recomienda que incluya documentación de qué canales nombrados se utilizan junto con la forma de los datos del mensaje. Los nombres de los canales generalmente deben incluir el nombre del módulo para evitar colisiones con datos de otros módulos.

## API Pública {#public-api}

### Resumen {#overview}

A continuación, se muestra una descripción general simple de la API pública.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

// Obtener un objeto de canal reutilizable
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Datos recibidos
}

// Suscribirse al canal
diagnostics_channel.subscribe('my-channel', onMessage);

// Comprobar si el canal tiene un suscriptor activo
if (channel.hasSubscribers) {
  // Publicar datos en el canal
  channel.publish({
    some: 'data',
  });
}

// Anular la suscripción del canal
diagnostics_channel.unsubscribe('my-channel', onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

// Obtener un objeto de canal reutilizable
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Datos recibidos
}

// Suscribirse al canal
diagnostics_channel.subscribe('my-channel', onMessage);

// Comprobar si el canal tiene un suscriptor activo
if (channel.hasSubscribers) {
  // Publicar datos en el canal
  channel.publish({
    some: 'data',
  });
}

// Anular la suscripción del canal
diagnostics_channel.unsubscribe('my-channel', onMessage);
```
:::


#### `diagnostics_channel.hasSubscribers(name)` {#diagnostics_channelhassubscribersname}

**Agregado en: v15.1.0, v14.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) El nombre del canal
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si hay suscriptores activos

Comprueba si hay suscriptores activos en el canal con el nombre dado. Esto es útil si el mensaje que quieres enviar podría ser costoso de preparar.

Esta API es opcional pero útil al intentar publicar mensajes desde código sensible al rendimiento.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // There are subscribers, prepare and publish message
  // Hay suscriptores, preparar y publicar el mensaje
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // There are subscribers, prepare and publish message
  // Hay suscriptores, preparar y publicar el mensaje
}
```
:::

#### `diagnostics_channel.channel(name)` {#diagnostics_channelchannelname}

**Agregado en: v15.1.0, v14.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) El nombre del canal
- Devuelve: [\<Channel\>](/es/nodejs/api/diagnostics_channel#class-channel) El objeto de canal con el nombre dado

Este es el punto de entrada principal para cualquiera que quiera publicar en un canal con nombre. Produce un objeto de canal que está optimizado para reducir la sobrecarga en el momento de la publicación tanto como sea posible.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');
```
:::

#### `diagnostics_channel.subscribe(name, onMessage)` {#diagnostics_channelsubscribename-onmessage}

**Agregado en: v18.7.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) El nombre del canal
- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) El controlador para recibir los mensajes del canal
    - `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Los datos del mensaje
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) El nombre del canal
  
 

Registra un manejador de mensajes para suscribirse a este canal. Este manejador de mensajes se ejecutará sincrónicamente cada vez que se publique un mensaje en el canal. Cualquier error lanzado en el manejador de mensajes activará un [`'uncaughtException'`](/es/nodejs/api/process#event-uncaughtexception).

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // Received data
  // Datos recibidos
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // Received data
  // Datos recibidos
});
```
:::


#### `diagnostics_channel.unsubscribe(name, onMessage)` {#diagnostics_channelunsubscribename-onmessage}

**Agregado en: v18.7.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) El nombre del canal
- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) El controlador suscrito anteriormente para eliminar
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si se encontró el controlador, `false` en caso contrario.

Elimina un controlador de mensajes registrado previamente en este canal con [`diagnostics_channel.subscribe(name, onMessage)`](/es/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage).

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

function onMessage(message, name) {
  // Received data
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

function onMessage(message, name) {
  // Received data
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
```
:::

#### `diagnostics_channel.tracingChannel(nameOrChannels)` {#diagnostics_channeltracingchannelnameorchannels}

**Agregado en: v19.9.0, v18.19.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `nameOrChannels` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<TracingChannel\>](/es/nodejs/api/diagnostics_channel#class-tracingchannel) Nombre del canal u objeto que contiene todos los [Canales TracingChannel](/es/nodejs/api/diagnostics_channel#tracingchannel-channels)
- Devuelve: [\<TracingChannel\>](/es/nodejs/api/diagnostics_channel#class-tracingchannel) Colección de canales para rastrear con

Crea un contenedor [`TracingChannel`](/es/nodejs/api/diagnostics_channel#class-tracingchannel) para los [Canales TracingChannel](/es/nodejs/api/diagnostics_channel#tracingchannel-channels) dados. Si se proporciona un nombre, los canales de seguimiento correspondientes se crearán en la forma `tracing:${name}:${eventType}` donde `eventType` corresponde a los tipos de [Canales TracingChannel](/es/nodejs/api/diagnostics_channel#tracingchannel-channels).

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// or...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// or...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:end'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
```
:::


### Clase: `Channel` {#class-channel}

**Agregada en: v15.1.0, v14.17.0**

La clase `Channel` representa un canal con nombre individual dentro de la tubería de datos. Se utiliza para rastrear suscriptores y para publicar mensajes cuando hay suscriptores presentes. Existe como un objeto separado para evitar búsquedas de canales en el momento de la publicación, lo que permite velocidades de publicación muy rápidas y permite un uso intensivo con un costo mínimo. Los canales se crean con [`diagnostics_channel.channel(name)`](/es/nodejs/api/diagnostics_channel#diagnostics_channelchannelname), no se admite la construcción de un canal directamente con `new Channel(name)`.

#### `channel.hasSubscribers` {#channelhassubscribers}

**Agregada en: v15.1.0, v14.17.0**

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si hay suscriptores activos

Verifique si hay suscriptores activos a este canal. Esto es útil si el mensaje que desea enviar puede ser costoso de preparar.

Esta API es opcional pero útil cuando se intenta publicar mensajes desde código muy sensible al rendimiento.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // There are subscribers, prepare and publish message
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // There are subscribers, prepare and publish message
}
```
:::

#### `channel.publish(message)` {#channelpublishmessage}

**Agregada en: v15.1.0, v14.17.0**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) El mensaje para enviar a los suscriptores del canal

Publica un mensaje a cualquier suscriptor del canal. Esto activará los controladores de mensajes sincrónicamente, por lo que se ejecutarán dentro del mismo contexto.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
```
:::


#### `channel.subscribe(onMessage)` {#channelsubscribeonmessage}

**Agregado en: v15.1.0, v14.17.0**

**Obsoleto desde: v18.7.0, v16.17.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Use [`diagnostics_channel.subscribe(name, onMessage)`](/es/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage)
:::

- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) El controlador para recibir mensajes del canal
    - `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Los datos del mensaje
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) El nombre del canal
  
 

Registra un controlador de mensajes para suscribirse a este canal. Este controlador de mensajes se ejecutará sincrónicamente cada vez que se publique un mensaje en el canal. Cualquier error lanzado en el controlador de mensajes activará un [`'uncaughtException'`](/es/nodejs/api/process#event-uncaughtexception).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // Received data
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // Received data
});
```
:::

#### `channel.unsubscribe(onMessage)` {#channelunsubscribeonmessage}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.7.0, v16.17.0 | Obsoleto desde: v18.7.0, v16.17.0 |
| v17.1.0, v16.14.0, v14.19.0 | Se añadió el valor de retorno. Se añadió a los canales sin suscriptores. |
| v15.1.0, v14.17.0 | Agregado en: v15.1.0, v14.17.0 |
:::

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Use [`diagnostics_channel.unsubscribe(name, onMessage)`](/es/nodejs/api/diagnostics_channel#diagnostics_channelunsubscribename-onmessage)
:::

- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) El controlador previamente suscrito para eliminar
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si se encontró el controlador, `false` en caso contrario.

Elimina un controlador de mensajes registrado previamente en este canal con [`channel.subscribe(onMessage)`](/es/nodejs/api/diagnostics_channel#channelsubscribeonmessage).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Received data
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Received data
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
```
:::


#### `channel.bindStore(store[, transform])` {#channelbindstorestore-transform}

**Añadido en: v19.9.0, v18.19.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `store` [\<AsyncLocalStorage\>](/es/nodejs/api/async_context#class-asynclocalstorage) El almacén al cual enlazar los datos de contexto
- `transform` [\<Function\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function) Transforma los datos de contexto antes de establecer el contexto del almacén

Cuando se llama [`channel.runStores(context, ...)`](/es/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args), los datos de contexto dados se aplicarán a cualquier almacén enlazado al canal. Si el almacén ya ha sido enlazado, la función `transform` anterior se reemplazará con la nueva. La función `transform` puede omitirse para establecer los datos de contexto dados directamente como el contexto.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
```
:::

#### `channel.unbindStore(store)` {#channelunbindstorestore}

**Añadido en: v19.9.0, v18.19.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `store` [\<AsyncLocalStorage\>](/es/nodejs/api/async_context#class-asynclocalstorage) El almacén para desenlazar del canal.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si el almacén fue encontrado, `false` en caso contrario.

Remueve un controlador de mensajes registrado previamente a este canal con [`channel.bindStore(store)`](/es/nodejs/api/diagnostics_channel#channelbindstorestore-transform).

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
```
:::


#### `channel.runStores(context, fn[, thisArg[, ...args]])` {#channelrunstorescontext-fn-thisarg-args}

**Agregado en: v19.9.0, v18.19.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `context` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Mensaje para enviar a los suscriptores y enlazar a los almacenes.
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Controlador para ejecutar dentro del contexto de almacenamiento ingresado.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) El receptor que se utilizará para la llamada a la función.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Argumentos opcionales para pasar a la función.

Aplica los datos dados a cualquier instancia de AsyncLocalStorage enlazada al canal durante la duración de la función dada, luego publica en el canal dentro del alcance de esos datos aplicados a los almacenes.

Si se le dio una función de transformación a [`channel.bindStore(store)`](/es/nodejs/api/diagnostics_channel#channelbindstorestore-transform), se aplicará para transformar los datos del mensaje antes de que se convierta en el valor de contexto para el almacén. El contexto de almacenamiento anterior es accesible desde dentro de la función de transformación en los casos en que se requiere la vinculación de contexto.

El contexto aplicado al almacén debería ser accesible en cualquier código asíncrono que continúe desde la ejecución que comenzó durante la función dada, sin embargo, hay algunas situaciones en las que puede ocurrir [pérdida de contexto](/es/nodejs/api/async_context#troubleshooting-context-loss).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
```
:::


### Clase: `TracingChannel` {#class-tracingchannel}

**Agregado en: v19.9.0, v18.19.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

La clase `TracingChannel` es una colección de [Canales TracingChannel](/es/nodejs/api/diagnostics_channel#tracingchannel-channels) que en conjunto expresan una única acción rastreable. Se utiliza para formalizar y simplificar el proceso de producción de eventos para el rastreo del flujo de la aplicación. [`diagnostics_channel.tracingChannel()`](/es/nodejs/api/diagnostics_channel#diagnostics_channeltracingchannelnameorchannels) se utiliza para construir un `TracingChannel`. Al igual que con `Channel`, se recomienda crear y reutilizar un solo `TracingChannel` en el nivel superior del archivo en lugar de crearlos dinámicamente.

#### `tracingChannel.subscribe(subscribers)` {#tracingchannelsubscribesubscribers}

**Agregado en: v19.9.0, v18.19.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `subscribers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Conjunto de suscriptores de [Canales TracingChannel](/es/nodejs/api/diagnostics_channel#tracingchannel-channels)
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) El suscriptor del [`evento start`](/es/nodejs/api/diagnostics_channel#startevent)
    - `end` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) El suscriptor del [`evento end`](/es/nodejs/api/diagnostics_channel#endevent)
    - `asyncStart` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) El suscriptor del [`evento asyncStart`](/es/nodejs/api/diagnostics_channel#asyncstartevent)
    - `asyncEnd` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) El suscriptor del [`evento asyncEnd`](/es/nodejs/api/diagnostics_channel#asyncendevent)
    - `error` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) El suscriptor del [`evento error`](/es/nodejs/api/diagnostics_channel#errorevent)
  
 

Ayudante para suscribir una colección de funciones a los canales correspondientes. Esto es lo mismo que llamar a [`channel.subscribe(onMessage)`](/es/nodejs/api/diagnostics_channel#channelsubscribeonmessage) en cada canal individualmente.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```
:::


#### `tracingChannel.unsubscribe(subscribers)` {#tracingchannelunsubscribesubscribers}

**Agregado en: v19.9.0, v18.19.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `subscribers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Conjunto de suscriptores de [Canales TracingChannel](/es/nodejs/api/diagnostics_channel#tracingchannel-channels)
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) El suscriptor del evento [`start`](/es/nodejs/api/diagnostics_channel#startevent)
    - `end` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) El suscriptor del evento [`end`](/es/nodejs/api/diagnostics_channel#endevent)
    - `asyncStart` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) El suscriptor del evento [`asyncStart`](/es/nodejs/api/diagnostics_channel#asyncstartevent)
    - `asyncEnd` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) El suscriptor del evento [`asyncEnd`](/es/nodejs/api/diagnostics_channel#asyncendevent)
    - `error` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) El suscriptor del evento [`error`](/es/nodejs/api/diagnostics_channel#errorevent)
  
 
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si todos los manejadores fueron desuscritos exitosamente, y `false` de lo contrario.

Ayuda a desuscribir una colección de funciones de los canales correspondientes. Esto es lo mismo que llamar a [`channel.unsubscribe(onMessage)`](/es/nodejs/api/diagnostics_channel#channelunsubscribeonmessage) en cada canal individualmente.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```
:::


#### `tracingChannel.traceSync(fn[, context[, thisArg[, ...args]]])` {#tracingchanneltracesyncfn-context-thisarg-args}

**Agregado en: v19.9.0, v18.19.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Función para envolver un rastreo
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Objeto compartido para correlacionar eventos a través de
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) El receptor que se utilizará para la llamada a la función
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Argumentos opcionales para pasar a la función
- Devuelve: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) El valor de retorno de la función dada

Rastrea una llamada a función síncrona. Esto siempre producirá un evento [`start` event](/es/nodejs/api/diagnostics_channel#startevent) y un [`end` event](/es/nodejs/api/diagnostics_channel#endevent) alrededor de la ejecución y puede producir un [`error` event](/es/nodejs/api/diagnostics_channel#errorevent) si la función dada lanza un error. Esto ejecutará la función dada usando [`channel.runStores(context, ...)`](/es/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) en el canal `start`, lo que garantiza que todos los eventos tengan los almacenes enlazados establecidos para que coincidan con este contexto de rastreo.

Para asegurar que solo se formen gráficos de rastreo correctos, los eventos solo se publicarán si hay suscriptores presentes antes de comenzar el rastreo. Las suscripciones que se agreguen después de que comience el rastreo no recibirán eventos futuros de ese rastreo, solo se verán los rastreos futuros.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});
```
:::


#### `tracingChannel.tracePromise(fn[, context[, thisArg[, ...args]]])` {#tracingchanneltracepromisefn-context-thisarg-args}

**Agregado en: v19.9.0, v18.19.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function) Función que devuelve una promesa para envolver con un rastreo
- `context` [\<Object\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object) Objeto compartido para correlacionar los eventos de rastreo
- `thisArg` [\<any\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Data_types) El receptor que se utilizará para la llamada a la función
- `...args` [\<any\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Data_types) Argumentos opcionales para pasar a la función
- Devuelve: [\<Promise\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise) Encadenado desde la promesa devuelta por la función dada

Rastrea una llamada a una función que devuelve una promesa. Esto siempre producirá un evento [`start` event](/es/nodejs/api/diagnostics_channel#startevent) y un evento [`end` event](/es/nodejs/api/diagnostics_channel#endevent) alrededor de la porción síncrona de la ejecución de la función, y producirá un evento [`asyncStart` event](/es/nodejs/api/diagnostics_channel#asyncstartevent) y un evento [`asyncEnd` event](/es/nodejs/api/diagnostics_channel#asyncendevent) cuando se alcanza una continuación de la promesa. También puede producir un evento [`error` event](/es/nodejs/api/diagnostics_channel#errorevent) si la función dada lanza un error o la promesa devuelta se rechaza. Esto ejecutará la función dada usando [`channel.runStores(context, ...)`](/es/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) en el canal `start`, lo que garantiza que todos los eventos tengan todos los almacenes enlazados configurados para que coincidan con este contexto de rastreo.

Para garantizar que solo se formen gráficos de rastreo correctos, los eventos solo se publicarán si los suscriptores están presentes antes de iniciar el rastreo. Las suscripciones que se agreguen después de que comience el rastreo no recibirán eventos futuros de ese rastreo, solo se verán los rastreos futuros.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
```
:::


#### `tracingChannel.traceCallback(fn[, position[, context[, thisArg[, ...args]]]])` {#tracingchanneltracecallbackfn-position-context-thisarg-args}

**Agregado en: v19.9.0, v18.19.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function) callback usando la función para envolver un rastreo alrededor
- `position` [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type) Posición del argumento con índice cero del callback esperado (por defecto es el último argumento si se pasa `undefined`)
- `context` [\<Object\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object) Objeto compartido para correlacionar eventos de rastreo a través de (por defecto es `{}` si se pasa `undefined`)
- `thisArg` [\<any\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Data_types) El receptor que se utilizará para la llamada a la función
- `...args` [\<any\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Data_types) argumentos para pasar a la función (debe incluir el callback)
- Devuelve: [\<any\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Data_types) El valor de retorno de la función dada

Rastrea una llamada de función que recibe un callback. Se espera que el callback siga la convención de error como primer argumento que se utiliza normalmente. Esto siempre producirá un evento [`start` event](/es/nodejs/api/diagnostics_channel#startevent) y [`end` event](/es/nodejs/api/diagnostics_channel#endevent) alrededor de la porción síncrona de la ejecución de la función, y producirá un evento [`asyncStart` event](/es/nodejs/api/diagnostics_channel#asyncstartevent) y [`asyncEnd` event](/es/nodejs/api/diagnostics_channel#asyncendevent) alrededor de la ejecución del callback. También puede producir un evento [`error` event](/es/nodejs/api/diagnostics_channel#errorevent) si la función dada lanza o si se establece el primer argumento pasado al callback. Esto ejecutará la función dada usando [`channel.runStores(context, ...)`](/es/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) en el canal `start` lo que garantiza que todos los eventos deberían tener cualquier almacén vinculado establecido para que coincida con este contexto de rastreo.

Para garantizar que solo se formen gráficos de rastreo correctos, los eventos solo se publicarán si los suscriptores están presentes antes de iniciar el rastreo. Las suscripciones que se agregan después de que comience el rastreo no recibirán eventos futuros de ese rastreo, solo se verán rastreos futuros.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
```
:::

El callback también se ejecutará con [`channel.runStores(context, ...)`](/es/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) lo que permite la recuperación de la pérdida de contexto en algunos casos.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// The start channel sets the initial store data to something
// and stores that store data value on the trace context object
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// Then asyncStart can restore from that data it stored previously
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// The start channel sets the initial store data to something
// and stores that store data value on the trace context object
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// Then asyncStart can restore from that data it stored previously
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
```
:::


#### `tracingChannel.hasSubscribers` {#tracingchannelhassubscribers}

**Agregado en: v22.0.0, v20.13.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si alguno de los canales individuales tiene un suscriptor, `false` si no.

Este es un método auxiliar disponible en una instancia de [`TracingChannel`](/es/nodejs/api/diagnostics_channel#class-tracingchannel) para comprobar si alguno de los [Canales TracingChannel](/es/nodejs/api/diagnostics_channel#tracingchannel-channels) tiene suscriptores. Se devuelve `true` si alguno de ellos tiene al menos un suscriptor, y `false` en caso contrario.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Do something
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Do something
}
```
:::

### Canales TracingChannel {#tracingchannel-channels}

Un TracingChannel es una colección de varios diagnostics_channels que representan puntos específicos en el ciclo de vida de la ejecución de una sola acción rastreable. El comportamiento se divide en cinco diagnostics_channels que consisten en `start`, `end`, `asyncStart`, `asyncEnd` y `error`. Una sola acción rastreable compartirá el mismo objeto de evento entre todos los eventos, esto puede ser útil para gestionar la correlación a través de un weakmap.

Estos objetos de evento se extenderán con valores `result` o `error` cuando la tarea "se complete". En el caso de una tarea síncrona, el `result` será el valor de retorno y el `error` será cualquier cosa que se lance desde la función. Con las funciones asíncronas basadas en callback, el `result` será el segundo argumento del callback mientras que el `error` será un error lanzado visible en el evento `end` o el primer argumento del callback en cualquiera de los eventos `asyncStart` o `asyncEnd`.

Para asegurar que solo se formen gráficos de rastreo correctos, los eventos solo deben publicarse si hay suscriptores presentes antes de iniciar el rastreo. Las suscripciones que se añadan después de que comience el rastreo no deben recibir eventos futuros de ese rastreo, solo se verán rastreos futuros.

Los canales de rastreo deben seguir un patrón de nombres de:

- `tracing:module.class.method:start` o `tracing:module.function:start`
- `tracing:module.class.method:end` o `tracing:module.function:end`
- `tracing:module.class.method:asyncStart` o `tracing:module.function:asyncStart`
- `tracing:module.class.method:asyncEnd` o `tracing:module.function:asyncEnd`
- `tracing:module.class.method:error` o `tracing:module.function:error`


#### `start(event)` {#startevent}

- Nombre: `tracing:${name}:start`

El evento `start` representa el punto en el que se llama a una función. En este punto, los datos del evento pueden contener argumentos de la función o cualquier otra cosa disponible al comienzo de la ejecución de la función.

#### `end(event)` {#endevent}

- Nombre: `tracing:${name}:end`

El evento `end` representa el punto en el que una llamada a una función devuelve un valor. En el caso de una función asíncrona, esto ocurre cuando se devuelve la promesa, no cuando la función en sí realiza una declaración de retorno internamente. En este punto, si la función rastreada era síncrona, el campo `result` se establecerá en el valor de retorno de la función. Alternativamente, el campo `error` puede estar presente para representar cualquier error lanzado.

Se recomienda escuchar específicamente el evento `error` para rastrear errores, ya que es posible que una acción rastreable produzca múltiples errores. Por ejemplo, una tarea asíncrona que falla puede iniciarse internamente antes de que la parte síncrona de la tarea lance un error.

#### `asyncStart(event)` {#asyncstartevent}

- Nombre: `tracing:${name}:asyncStart`

El evento `asyncStart` representa la devolución de llamada o la continuación de una función rastreable a la que se accede. En este punto, pueden estar disponibles cosas como argumentos de devolución de llamada o cualquier otra cosa que exprese el "resultado" de la acción.

Para las funciones basadas en devoluciones de llamada, el primer argumento de la devolución de llamada se asignará al campo `error`, si no es `undefined` o `null`, y el segundo argumento se asignará al campo `result`.

Para las promesas, el argumento a la ruta `resolve` se asignará a `result` o el argumento a la ruta `reject` se asignará a `error`.

Se recomienda escuchar específicamente el evento `error` para rastrear errores, ya que es posible que una acción rastreable produzca múltiples errores. Por ejemplo, una tarea asíncrona que falla puede iniciarse internamente antes de que la parte síncrona de la tarea lance un error.

#### `asyncEnd(event)` {#asyncendevent}

- Nombre: `tracing:${name}:asyncEnd`

El evento `asyncEnd` representa la devolución de llamada de una función asíncrona que regresa. No es probable que los datos del evento cambien después del evento `asyncStart`, sin embargo, puede ser útil ver el punto donde se completa la devolución de llamada.


#### `error(event)` {#errorevent}

- Nombre: `tracing:${name}:error`

El evento `error` representa cualquier error producido por la función rastreable, ya sea síncrona o asíncronamente. Si se lanza un error en la parte síncrona de la función rastreada, el error se asignará al campo `error` del evento y se activará el evento `error`. Si se recibe un error asíncronamente a través de una devolución de llamada o un rechazo de promesa, también se asignará al campo `error` del evento y se activará el evento `error`.

Es posible que una sola llamada a la función rastreable produzca errores varias veces, por lo que esto debe tenerse en cuenta al consumir este evento. Por ejemplo, si se activa internamente otra tarea asíncrona que falla y luego la parte síncrona de la función lanza un error, se emitirán dos eventos `error`, uno para el error síncrono y otro para el error asíncrono.

### Canales Incorporados {#built-in-channels}

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Si bien la API diagnostics_channel ahora se considera estable, los canales integrados actualmente disponibles no lo son. Cada canal debe declararse estable de forma independiente.

#### HTTP {#http}

`http.client.request.created`

- `request` [\<http.ClientRequest\>](/es/nodejs/api/http#class-httpclientrequest)

Se emite cuando el cliente crea un objeto de solicitud. A diferencia de `http.client.request.start`, este evento se emite antes de que se haya enviado la solicitud.

`http.client.request.start`

- `request` [\<http.ClientRequest\>](/es/nodejs/api/http#class-httpclientrequest)

Se emite cuando el cliente inicia una solicitud.

`http.client.request.error`

- `request` [\<http.ClientRequest\>](/es/nodejs/api/http#class-httpclientrequest)
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Se emite cuando se produce un error durante una solicitud del cliente.

`http.client.response.finish`

- `request` [\<http.ClientRequest\>](/es/nodejs/api/http#class-httpclientrequest)
- `response` [\<http.IncomingMessage\>](/es/nodejs/api/http#class-httpincomingmessage)

Se emite cuando el cliente recibe una respuesta.

`http.server.request.start`

- `request` [\<http.IncomingMessage\>](/es/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/es/nodejs/api/http#class-httpserverresponse)
- `socket` [\<net.Socket\>](/es/nodejs/api/net#class-netsocket)
- `server` [\<http.Server\>](/es/nodejs/api/http#class-httpserver)

Se emite cuando el servidor recibe una solicitud.

`http.server.response.created`

- `request` [\<http.IncomingMessage\>](/es/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/es/nodejs/api/http#class-httpserverresponse)

Se emite cuando el servidor crea una respuesta. El evento se emite antes de que se envíe la respuesta.

`http.server.response.finish`

- `request` [\<http.IncomingMessage\>](/es/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/es/nodejs/api/http#class-httpserverresponse)
- `socket` [\<net.Socket\>](/es/nodejs/api/net#class-netsocket)
- `server` [\<http.Server\>](/es/nodejs/api/http#class-httpserver)

Se emite cuando el servidor envía una respuesta.


#### Módulos {#modules}

`module.require.start`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) que contiene las siguientes propiedades
    - `id` - Argumento pasado a `require()`. Nombre del módulo.
    - `parentFilename` - Nombre del módulo que intentó require(id).
  
 

Emitido cuando se ejecuta `require()`. Consulte el evento [`start` event](/es/nodejs/api/diagnostics_channel#startevent).

`module.require.end`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) que contiene las siguientes propiedades
    - `id` - Argumento pasado a `require()`. Nombre del módulo.
    - `parentFilename` - Nombre del módulo que intentó require(id).
  
 

Emitido cuando una llamada a `require()` regresa. Consulte el evento [`end` event](/es/nodejs/api/diagnostics_channel#endevent).

`module.require.error`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) que contiene las siguientes propiedades
    - `id` - Argumento pasado a `require()`. Nombre del módulo.
    - `parentFilename` - Nombre del módulo que intentó require(id).
  
 
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emitido cuando un `require()` arroja un error. Consulte el evento [`error` event](/es/nodejs/api/diagnostics_channel#errorevent).

`module.import.asyncStart`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) que contiene las siguientes propiedades
    - `id` - Argumento pasado a `import()`. Nombre del módulo.
    - `parentURL` - Objeto URL del módulo que intentó import(id).
  
 

Emitido cuando se invoca `import()`. Consulte el evento [`asyncStart` event](/es/nodejs/api/diagnostics_channel#asyncstartevent).

`module.import.asyncEnd`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) que contiene las siguientes propiedades
    - `id` - Argumento pasado a `import()`. Nombre del módulo.
    - `parentURL` - Objeto URL del módulo que intentó import(id).
  
 

Emitido cuando `import()` ha finalizado. Consulte el evento [`asyncEnd` event](/es/nodejs/api/diagnostics_channel#asyncendevent).

`module.import.error`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) que contiene las siguientes propiedades
    - `id` - Argumento pasado a `import()`. Nombre del módulo.
    - `parentURL` - Objeto URL del módulo que intentó import(id).
  
 
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emitido cuando un `import()` arroja un error. Consulte el evento [`error` event](/es/nodejs/api/diagnostics_channel#errorevent).


#### NET {#net}

`net.client.socket`

- `socket` [\<net.Socket\>](/es/nodejs/api/net#class-netsocket)

Se emite cuando se crea un nuevo socket de cliente TCP o pipe.

`net.server.socket`

- `socket` [\<net.Socket\>](/es/nodejs/api/net#class-netsocket)

Se emite cuando se recibe una nueva conexión TCP o pipe.

`tracing:net.server.listen:asyncStart`

- `server` [\<net.Server\>](/es/nodejs/api/net#class-netserver)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Se emite cuando se invoca [`net.Server.listen()`](/es/nodejs/api/net#serverlisten), antes de que se configure realmente el puerto o el pipe.

`tracing:net.server.listen:asyncEnd`

- `server` [\<net.Server\>](/es/nodejs/api/net#class-netserver)

Se emite cuando [`net.Server.listen()`](/es/nodejs/api/net#serverlisten) se ha completado y, por lo tanto, el servidor está listo para aceptar conexiones.

`tracing:net.server.listen:error`

- `server` [\<net.Server\>](/es/nodejs/api/net#class-netserver)
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Se emite cuando [`net.Server.listen()`](/es/nodejs/api/net#serverlisten) devuelve un error.

#### UDP {#udp}

`udp.socket`

- `socket` [\<dgram.Socket\>](/es/nodejs/api/dgram#class-dgramsocket)

Se emite cuando se crea un nuevo socket UDP.

#### Process {#process}

**Añadido en: v16.18.0**

`child_process`

- `process` [\<ChildProcess\>](/es/nodejs/api/child_process#class-childprocess)

Se emite cuando se crea un nuevo proceso.

#### Worker Thread {#worker-thread}

**Añadido en: v16.18.0**

`worker_threads`

- `worker` [`Worker`](/es/nodejs/api/worker_threads#class-worker)

Se emite cuando se crea un nuevo hilo.

