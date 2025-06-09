---
title: API de Flujos Web de Node.js
description: Documentación de la API de Flujos Web en Node.js, que detalla cómo trabajar con flujos para el manejo eficiente de datos, incluyendo flujos legibles, escribibles y de transformación.
head:
  - - meta
    - name: og:title
      content: API de Flujos Web de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Documentación de la API de Flujos Web en Node.js, que detalla cómo trabajar con flujos para el manejo eficiente de datos, incluyendo flujos legibles, escribibles y de transformación.
  - - meta
    - name: twitter:title
      content: API de Flujos Web de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Documentación de la API de Flujos Web en Node.js, que detalla cómo trabajar con flujos para el manejo eficiente de datos, incluyendo flujos legibles, escribibles y de transformación.
---


# API de Web Streams {#web-streams-api}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v21.0.0 | Ya no es experimental. |
| v18.0.0 | El uso de esta API ya no emite una advertencia en tiempo de ejecución. |
| v16.5.0 | Agregado en: v16.5.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Una implementación del [Estándar de Streams de WHATWG](https://streams.spec.whatwg.org/).

## Resumen {#overview}

El [Estándar de Streams de WHATWG](https://streams.spec.whatwg.org/) (o "web streams") define una API para manejar datos de streaming. Es similar a la API de [Streams](/es/nodejs/api/stream) de Node.js, pero surgió más tarde y se ha convertido en la API "estándar" para la transmisión de datos en muchos entornos de JavaScript.

Hay tres tipos principales de objetos:

- `ReadableStream` - Representa una fuente de datos de streaming.
- `WritableStream` - Representa un destino para datos de streaming.
- `TransformStream` - Representa un algoritmo para transformar datos de streaming.

### Ejemplo `ReadableStream` {#example-readablestream}

Este ejemplo crea un `ReadableStream` simple que envía la marca de tiempo `performance.now()` actual una vez por segundo para siempre. Un iterable asíncrono se utiliza para leer los datos del stream.

::: code-group
```js [ESM]
import {
  ReadableStream,
} from 'node:stream/web';

import {
  setInterval as every,
} from 'node:timers/promises';

import {
  performance,
} from 'node:perf_hooks';

const SECOND = 1000;

const stream = new ReadableStream({
  async start(controller) {
    for await (const _ of every(SECOND))
      controller.enqueue(performance.now());
  },
});

for await (const value of stream)
  console.log(value);
```

```js [CJS]
const {
  ReadableStream,
} = require('node:stream/web');

const {
  setInterval: every,
} = require('node:timers/promises');

const {
  performance,
} = require('node:perf_hooks');

const SECOND = 1000;

const stream = new ReadableStream({
  async start(controller) {
    for await (const _ of every(SECOND))
      controller.enqueue(performance.now());
  },
});

(async () => {
  for await (const value of stream)
    console.log(value);
})();
```
:::


## API {#api}

### Clase: `ReadableStream` {#class-readablestream}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Esta clase ahora está expuesta en el objeto global. |
| v16.5.0 | Agregado en: v16.5.0 |
:::

#### `new ReadableStream([underlyingSource [, strategy]])` {#new-readablestreamunderlyingsource--strategy}

**Agregado en: v16.5.0**

- `underlyingSource` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `start` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función definida por el usuario que se invoca inmediatamente cuando se crea el `ReadableStream`.
    - `controller` [\<ReadableStreamDefaultController\>](/es/nodejs/api/webstreams#class-readablestreamdefaultcontroller) | [\<ReadableByteStreamController\>](/es/nodejs/api/webstreams#class-readablebytestreamcontroller)
    - Regresa: `undefined` o una promesa resuelta con `undefined`.

 
    - `pull` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función definida por el usuario que se llama repetidamente cuando la cola interna de `ReadableStream` no está llena. La operación puede ser síncrona o asíncrona. Si es asíncrona, la función no se volverá a llamar hasta que se cumpla la promesa previamente devuelta.
    - `controller` [\<ReadableStreamDefaultController\>](/es/nodejs/api/webstreams#class-readablestreamdefaultcontroller) | [\<ReadableByteStreamController\>](/es/nodejs/api/webstreams#class-readablebytestreamcontroller)
    - Regresa: Una promesa resuelta con `undefined`.

 
    - `cancel` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función definida por el usuario que se llama cuando se cancela el `ReadableStream`.
    - `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Regresa: Una promesa resuelta con `undefined`.

 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser `'bytes'` o `undefined`.
    - `autoAllocateChunkSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se utiliza solo cuando `type` es igual a `'bytes'`. Cuando se establece en un valor distinto de cero, se asigna automáticamente un búfer de vista a `ReadableByteStreamController.byobRequest`. Cuando no se establece, se deben usar las colas internas del flujo para transferir datos a través del lector predeterminado `ReadableStreamDefaultReader`.

 
- `strategy` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El tamaño máximo de la cola interna antes de que se aplique la contrapresión.
    - `size` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función definida por el usuario que se utiliza para identificar el tamaño de cada fragmento de datos.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Regresa: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


#### `readableStream.locked` {#readablestreamlocked}

**Añadido en: v16.5.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Establecido en `true` si hay un lector activo para este [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream).

La propiedad `readableStream.locked` es `false` por defecto, y se cambia a `true` mientras haya un lector activo consumiendo los datos del stream.

#### `readableStream.cancel([reason])` {#readablestreamcancelreason}

**Añadido en: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: Una promesa cumplida con `undefined` una vez que la cancelación se ha completado.

#### `readableStream.getReader([options])` {#readablestreamgetreaderoptions}

**Añadido en: v16.5.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'byob'` o `undefined`


- Devuelve: [\<ReadableStreamDefaultReader\>](/es/nodejs/api/webstreams#class-readablestreamdefaultreader) | [\<ReadableStreamBYOBReader\>](/es/nodejs/api/webstreams#class-readablestreambyobreader)



::: code-group
```js [ESM]
import { ReadableStream } from 'node:stream/web';

const stream = new ReadableStream();

const reader = stream.getReader();

console.log(await reader.read());
```

```js [CJS]
const { ReadableStream } = require('node:stream/web');

const stream = new ReadableStream();

const reader = stream.getReader();

reader.read().then(console.log);
```
:::

Causa que `readableStream.locked` sea `true`.

#### `readableStream.pipeThrough(transform[, options])` {#readablestreampipethroughtransform-options}

**Añadido en: v16.5.0**

- `transform` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) El `ReadableStream` al que `transform.writable` enviará los datos potencialmente modificados que recibe de este `ReadableStream`.
    - `writable` [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream) El `WritableStream` al que se escribirán los datos de este `ReadableStream`.


- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preventAbort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, los errores en este `ReadableStream` no causarán que `transform.writable` se aborte.
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, los errores en el destino `transform.writable` no causan que este `ReadableStream` se cancele.
    - `preventClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, cerrar este `ReadableStream` no causa que `transform.writable` se cierre.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Permite que la transferencia de datos se cancele usando un [\<AbortController\>](/es/nodejs/api/globals#class-abortcontroller).


- Devuelve: [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) Desde `transform.readable`.

Conecta este [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) al par de [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) y [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream) proporcionado en el argumento `transform` de tal manera que los datos de este [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) se escriben en `transform.writable`, posiblemente transformados, y luego se envían a `transform.readable`. Una vez que la tubería está configurada, se devuelve `transform.readable`.

Causa que `readableStream.locked` sea `true` mientras la operación de tubería está activa.



::: code-group
```js [ESM]
import {
  ReadableStream,
  TransformStream,
} from 'node:stream/web';

const stream = new ReadableStream({
  start(controller) {
    controller.enqueue('a');
  },
});

const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

const transformedStream = stream.pipeThrough(transform);

for await (const chunk of transformedStream)
  console.log(chunk);
  // Prints: A
```

```js [CJS]
const {
  ReadableStream,
  TransformStream,
} = require('node:stream/web');

const stream = new ReadableStream({
  start(controller) {
    controller.enqueue('a');
  },
});

const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

const transformedStream = stream.pipeThrough(transform);

(async () => {
  for await (const chunk of transformedStream)
    console.log(chunk);
    // Prints: A
})();
```
:::

#### `readableStream.pipeTo(destination[, options])` {#readablestreampipetodestination-options}

**Agregado en: v16.5.0**

- `destination` [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream) Un [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream) al que se escribirán los datos de este `ReadableStream`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preventAbort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, los errores en este `ReadableStream` no causarán que `destination` sea abortado.
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, los errores en el `destination` no causarán que este `ReadableStream` sea cancelado.
    - `preventClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, cerrar este `ReadableStream` no causa que `destination` sea cerrado.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Permite que la transferencia de datos se cancele utilizando un [\<AbortController\>](/es/nodejs/api/globals#class-abortcontroller).

- Devuelve: Una promesa cumplida con `undefined`

Causa que `readableStream.locked` sea `true` mientras la operación de pipe está activa.

#### `readableStream.tee()` {#readablestreamtee}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.10.0, v16.18.0 | Soporte para dividir un flujo de bytes legibles. |
| v16.5.0 | Agregado en: v16.5.0 |
:::

- Devuelve: [\<ReadableStream[]\>](/es/nodejs/api/webstreams#class-readablestream)

Devuelve un par de nuevas instancias [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) a las que se reenviarán los datos de este `ReadableStream`. Cada uno recibirá los mismos datos.

Causa que `readableStream.locked` sea `true`.

#### `readableStream.values([options])` {#readablestreamvaluesoptions}

**Agregado en: v16.5.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, evita que el [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) se cierre cuando el iterador asíncrono termina abruptamente. **Predeterminado**: `false`.

Crea y devuelve un iterador asíncrono utilizable para consumir los datos de este `ReadableStream`.

Causa que `readableStream.locked` sea `true` mientras el iterador asíncrono está activo.

```js [ESM]
import { Buffer } from 'node:buffer';

const stream = new ReadableStream(getSomeSource());

for await (const chunk of stream.values({ preventCancel: true }))
  console.log(Buffer.from(chunk).toString());
```

#### Iteración Asíncrona {#async-iteration}

El objeto [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) admite el protocolo de iterador asíncrono utilizando la sintaxis `for await`.

```js [ESM]
import { Buffer } from 'node:buffer';

const stream = new ReadableStream(getSomeSource());

for await (const chunk of stream)
  console.log(Buffer.from(chunk).toString());
```
El iterador asíncrono consumirá el [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) hasta que termine.

De forma predeterminada, si el iterador asíncrono sale prematuramente (ya sea a través de un `break`, `return` o un `throw`), el [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) se cerrará. Para evitar el cierre automático del [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream), utilice el método `readableStream.values()` para adquirir el iterador asíncrono y establezca la opción `preventCancel` en `true`.

El [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) no debe estar bloqueado (es decir, no debe tener un lector activo existente). Durante la iteración asíncrona, el [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) se bloqueará.

#### Transferencia con `postMessage()` {#transferring-with-postmessage}

Una instancia de [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) se puede transferir utilizando un [\<MessagePort\>](/es/nodejs/api/worker_threads#class-messageport).

```js [ESM]
const stream = new ReadableStream(getReadableSourceSomehow());

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  data.getReader().read().then((chunk) => {
    console.log(chunk);
  });
};

port2.postMessage(stream, [stream]);
```
### `ReadableStream.from(iterable)` {#readablestreamfromiterable}

**Agregado en: v20.6.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) Objeto que implementa el protocolo iterable `Symbol.asyncIterator` o `Symbol.iterator`.

Un método de utilidad que crea un nuevo [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) a partir de un iterable.



::: code-group
```js [ESM]
import { ReadableStream } from 'node:stream/web';

async function* asyncIterableGenerator() {
  yield 'a';
  yield 'b';
  yield 'c';
}

const stream = ReadableStream.from(asyncIterableGenerator());

for await (const chunk of stream)
  console.log(chunk); // Prints: 'a', 'b', 'c'
```

```js [CJS]
const { ReadableStream } = require('node:stream/web');

async function* asyncIterableGenerator() {
  yield 'a';
  yield 'b';
  yield 'c';
}

(async () => {
  const stream = ReadableStream.from(asyncIterableGenerator());

  for await (const chunk of stream)
    console.log(chunk); // Prints: 'a', 'b', 'c'
})();
```
:::


### Clase: `ReadableStreamDefaultReader` {#class-readablestreamdefaultreader}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Esta clase ahora está expuesta en el objeto global. |
| v16.5.0 | Agregado en: v16.5.0 |
:::

De forma predeterminada, al llamar a `readableStream.getReader()` sin argumentos, se devolverá una instancia de `ReadableStreamDefaultReader`. El lector predeterminado trata los fragmentos de datos que se pasan a través del stream como valores opacos, lo que permite que [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) funcione generalmente con cualquier valor de JavaScript.

#### `new ReadableStreamDefaultReader(stream)` {#new-readablestreamdefaultreaderstream}

**Agregado en: v16.5.0**

- `stream` [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream)

Crea un nuevo [\<ReadableStreamDefaultReader\>](/es/nodejs/api/webstreams#class-readablestreamdefaultreader) que está bloqueado al [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) dado.

#### `readableStreamDefaultReader.cancel([reason])` {#readablestreamdefaultreadercancelreason}

**Agregado en: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: Una promesa cumplida con `undefined`.

Cancela el [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) y devuelve una promesa que se cumple cuando el stream subyacente ha sido cancelado.

#### `readableStreamDefaultReader.closed` {#readablestreamdefaultreaderclosed}

**Agregado en: v16.5.0**

- Tipo: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumplida con `undefined` cuando el [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) asociado está cerrado o rechazada si el stream tiene errores o el bloqueo del lector se libera antes de que el stream termine de cerrarse.

#### `readableStreamDefaultReader.read()` {#readablestreamdefaultreaderread}

**Agregado en: v16.5.0**

- Devuelve: Una promesa cumplida con un objeto:
    - `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `done` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Solicita el siguiente fragmento de datos del [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) subyacente y devuelve una promesa que se cumple con los datos una vez que estén disponibles.


#### `readableStreamDefaultReader.releaseLock()` {#readablestreamdefaultreaderreleaselock}

**Agregado en: v16.5.0**

Libera el bloqueo de este lector en el [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) subyacente.

### Clase: `ReadableStreamBYOBReader` {#class-readablestreambyobreader}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Esta clase ahora está expuesta en el objeto global. |
| v16.5.0 | Agregado en: v16.5.0 |
:::

El `ReadableStreamBYOBReader` es un consumidor alternativo para [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream)s orientados a bytes (aquellos que se crean con `underlyingSource.type` establecido igual a `'bytes'` cuando se creó el `ReadableStream`).

`BYOB` es la abreviatura de "bring your own buffer" ("trae tu propio búfer"). Este es un patrón que permite una lectura más eficiente de datos orientados a bytes que evita copias innecesarias.

```js [ESM]
import {
  open,
} from 'node:fs/promises';

import {
  ReadableStream,
} from 'node:stream/web';

import { Buffer } from 'node:buffer';

class Source {
  type = 'bytes';
  autoAllocateChunkSize = 1024;

  async start(controller) {
    this.file = await open(new URL(import.meta.url));
    this.controller = controller;
  }

  async pull(controller) {
    const view = controller.byobRequest?.view;
    const {
      bytesRead,
    } = await this.file.read({
      buffer: view,
      offset: view.byteOffset,
      length: view.byteLength,
    });

    if (bytesRead === 0) {
      await this.file.close();
      this.controller.close();
    }
    controller.byobRequest.respond(bytesRead);
  }
}

const stream = new ReadableStream(new Source());

async function read(stream) {
  const reader = stream.getReader({ mode: 'byob' });

  const chunks = [];
  let result;
  do {
    result = await reader.read(Buffer.alloc(100));
    if (result.value !== undefined)
      chunks.push(Buffer.from(result.value));
  } while (!result.done);

  return Buffer.concat(chunks);
}

const data = await read(stream);
console.log(Buffer.from(data).toString());
```
#### `new ReadableStreamBYOBReader(stream)` {#new-readablestreambyobreaderstream}

**Agregado en: v16.5.0**

- `stream` [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream)

Crea un nuevo `ReadableStreamBYOBReader` que está bloqueado al [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) dado.


#### `readableStreamBYOBReader.cancel([reason])` {#readablestreambyobreadercancelreason}

**Añadido en: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: Una promesa cumplida con `undefined`.

Cancela el [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) y devuelve una promesa que se cumple cuando el flujo subyacente se ha cancelado.

#### `readableStreamBYOBReader.closed` {#readablestreambyobreaderclosed}

**Añadido en: v16.5.0**

- Tipo: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumplida con `undefined` cuando el [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) asociado se cierra o se rechaza si el flujo genera errores o el bloqueo del lector se libera antes de que el flujo termine de cerrarse.

#### `readableStreamBYOBReader.read(view[, options])` {#readablestreambyobreaderreadview-options}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.7.0, v20.17.0 | Se añadió la opción `min`. |
| v16.5.0 | Añadido en: v16.5.0 |
:::

- `view` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `min` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Cuando se establece, la promesa devuelta sólo se cumplirá tan pronto como haya disponible un número `min` de elementos. Cuando no se establece, la promesa se cumple cuando al menos un elemento está disponible.
  
 
- Devuelve: Una promesa cumplida con un objeto: 
    - `value` [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `done` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 

Solicita el siguiente fragmento de datos del [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) subyacente y devuelve una promesa que se cumple con los datos una vez que están disponibles.

No pase una instancia de objeto [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) agrupada en este método. Los objetos `Buffer` agrupados se crean utilizando `Buffer.allocUnsafe()` o `Buffer.from()`, o a menudo son devueltos por varias retrollamadas del módulo `node:fs`. Estos tipos de `Buffer` utilizan un objeto [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) subyacente compartido que contiene todos los datos de todas las instancias de `Buffer` agrupadas. Cuando se pasa un `Buffer`, [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), o [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) a `readableStreamBYOBReader.read()`, el `ArrayBuffer` subyacente de la vista se *separa*, invalidando todas las vistas existentes que puedan existir en ese `ArrayBuffer`. Esto puede tener consecuencias desastrosas para su aplicación.


#### `readableStreamBYOBReader.releaseLock()` {#readablestreambyobreaderreleaselock}

**Agregado en: v16.5.0**

Libera el bloqueo de este lector en el [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) subyacente.

### Clase: `ReadableStreamDefaultController` {#class-readablestreamdefaultcontroller}

**Agregado en: v16.5.0**

Cada [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) tiene un controlador que es responsable del estado interno y la gestión de la cola de la secuencia. El `ReadableStreamDefaultController` es la implementación del controlador predeterminado para `ReadableStream`s que no están orientados a bytes.

#### `readableStreamDefaultController.close()` {#readablestreamdefaultcontrollerclose}

**Agregado en: v16.5.0**

Cierra el [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) al que está asociado este controlador.

#### `readableStreamDefaultController.desiredSize` {#readablestreamdefaultcontrollerdesiredsize}

**Agregado en: v16.5.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Devuelve la cantidad de datos restantes para llenar la cola del [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream).

#### `readableStreamDefaultController.enqueue([chunk])` {#readablestreamdefaultcontrollerenqueuechunk}

**Agregado en: v16.5.0**

- `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Añade un nuevo fragmento de datos a la cola del [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream).

#### `readableStreamDefaultController.error([error])` {#readablestreamdefaultcontrollererrorerror}

**Agregado en: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Señala un error que causa que el [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) falle y se cierre.

### Clase: `ReadableByteStreamController` {#class-readablebytestreamcontroller}

::: info [Historial]
| Versión | Cambios |
|---|---|
| v18.10.0 | Soporte para manejar una solicitud BYOB pull de un lector liberado. |
| v16.5.0 | Agregado en: v16.5.0 |
:::

Cada [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) tiene un controlador que es responsable del estado interno y la gestión de la cola de la secuencia. El `ReadableByteStreamController` es para `ReadableStream`s orientados a bytes.


#### `readableByteStreamController.byobRequest` {#readablebytestreamcontrollerbyobrequest}

**Añadido en: v16.5.0**

- Tipo: [\<ReadableStreamBYOBRequest\>](/es/nodejs/api/webstreams#class-readablestreambyobrequest)

#### `readableByteStreamController.close()` {#readablebytestreamcontrollerclose}

**Añadido en: v16.5.0**

Cierra el [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) al que está asociado este controlador.

#### `readableByteStreamController.desiredSize` {#readablebytestreamcontrollerdesiredsize}

**Añadido en: v16.5.0**

- Tipo: [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type)

Devuelve la cantidad de datos restantes para llenar la cola del [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream).

#### `readableByteStreamController.enqueue(chunk)` {#readablebytestreamcontrollerenqueuechunk}

**Añadido en: v16.5.0**

- `chunk`: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/DataView)

Añade un nuevo fragmento de datos a la cola del [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream).

#### `readableByteStreamController.error([error])` {#readablebytestreamcontrollererrorerror}

**Añadido en: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Data_types)

Señala un error que hace que el [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) falle y se cierre.

### Clase: `ReadableStreamBYOBRequest` {#class-readablestreambyobrequest}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Esta clase ahora está expuesta en el objeto global. |
| v16.5.0 | Añadido en: v16.5.0 |
:::

Cuando se usa `ReadableByteStreamController` en streams orientados a bytes, y cuando se usa `ReadableStreamBYOBReader`, la propiedad `readableByteStreamController.byobRequest` proporciona acceso a una instancia de `ReadableStreamBYOBRequest` que representa la solicitud de lectura actual. El objeto se usa para obtener acceso al `ArrayBuffer`/`TypedArray` que se ha proporcionado para llenar la solicitud de lectura y proporciona métodos para señalar que se han proporcionado los datos.


#### `readableStreamBYOBRequest.respond(bytesWritten)` {#readablestreambyobrequestrespondbyteswritten}

**Añadido en: v16.5.0**

- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Señala que un número `bytesWritten` de bytes se han escrito en `readableStreamBYOBRequest.view`.

#### `readableStreamBYOBRequest.respondWithNewView(view)` {#readablestreambyobrequestrespondwithnewviewview}

**Añadido en: v16.5.0**

- `view` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

Señala que la solicitud se ha cumplido con bytes escritos en un nuevo `Buffer`, `TypedArray` o `DataView`.

#### `readableStreamBYOBRequest.view` {#readablestreambyobrequestview}

**Añadido en: v16.5.0**

- Tipo: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

### Clase: `WritableStream` {#class-writablestream}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Esta clase ahora está expuesta en el objeto global. |
| v16.5.0 | Añadido en: v16.5.0 |
:::

`WritableStream` es un destino al que se envían los datos del stream.

```js [ESM]
import {
  WritableStream,
} from 'node:stream/web';

const stream = new WritableStream({
  write(chunk) {
    console.log(chunk);
  },
});

await stream.getWriter().write('Hello World');
```
#### `new WritableStream([underlyingSink[, strategy]])` {#new-writablestreamunderlyingsink-strategy}

**Añadido en: v16.5.0**

- `underlyingSink` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función definida por el usuario que se invoca inmediatamente cuando se crea `WritableStream`. 
    - `controller` [\<WritableStreamDefaultController\>](/es/nodejs/api/webstreams#class-writablestreamdefaultcontroller)
    - Devuelve: `undefined` o una promesa cumplida con `undefined`.
  
 
    - `write` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función definida por el usuario que se invoca cuando un fragmento de datos se ha escrito en `WritableStream`. 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `controller` [\<WritableStreamDefaultController\>](/es/nodejs/api/webstreams#class-writablestreamdefaultcontroller)
    - Devuelve: Una promesa cumplida con `undefined`.
  
 
    - `close` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función definida por el usuario que se llama cuando se cierra `WritableStream`. 
    - Devuelve: Una promesa cumplida con `undefined`.
  
 
    - `abort` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función definida por el usuario que se llama para cerrar abruptamente `WritableStream`. 
    - `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Devuelve: Una promesa cumplida con `undefined`.
  
 
    - `type` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) La opción `type` está reservada para uso futuro y *debe* ser indefinida.
  
 
- `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El tamaño máximo de la cola interna antes de que se aplique la contrapresión.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función definida por el usuario que se utiliza para identificar el tamaño de cada fragmento de datos. 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  


#### `writableStream.abort([reason])` {#writablestreamabortreason}

**Añadido en: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: Una promesa cumplida con `undefined`.

Termina abruptamente el `WritableStream`. Todas las escrituras en cola serán canceladas y sus promesas asociadas rechazadas.

#### `writableStream.close()` {#writablestreamclose}

**Añadido en: v16.5.0**

- Devuelve: Una promesa cumplida con `undefined`.

Cierra el `WritableStream` cuando no se esperan escrituras adicionales.

#### `writableStream.getWriter()` {#writablestreamgetwriter}

**Añadido en: v16.5.0**

- Devuelve: [\<WritableStreamDefaultWriter\>](/es/nodejs/api/webstreams#class-writablestreamdefaultwriter)

Crea y devuelve una nueva instancia de escritor que se puede utilizar para escribir datos en el `WritableStream`.

#### `writableStream.locked` {#writablestreamlocked}

**Añadido en: v16.5.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La propiedad `writableStream.locked` es `false` por defecto, y se cambia a `true` mientras haya un escritor activo adjunto a este `WritableStream`.

#### Transferencia con postMessage() {#transferring-with-postmessage_1}

Una instancia de [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream) puede ser transferida usando un [\<MessagePort\>](/es/nodejs/api/worker_threads#class-messageport).

```js [ESM]
const stream = new WritableStream(getWritableSinkSomehow());

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  data.getWriter().write('hello');
};

port2.postMessage(stream, [stream]);
```
### Clase: `WritableStreamDefaultWriter` {#class-writablestreamdefaultwriter}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Esta clase ahora está expuesta en el objeto global. |
| v16.5.0 | Añadido en: v16.5.0 |
:::

#### `new WritableStreamDefaultWriter(stream)` {#new-writablestreamdefaultwriterstream}

**Añadido en: v16.5.0**

- `stream` [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream)

Crea un nuevo `WritableStreamDefaultWriter` que está bloqueado al `WritableStream` dado.

#### `writableStreamDefaultWriter.abort([reason])` {#writablestreamdefaultwriterabortreason}

**Añadido en: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: Una promesa cumplida con `undefined`.

Termina abruptamente el `WritableStream`. Todas las escrituras en cola serán canceladas y sus promesas asociadas rechazadas.


#### `writableStreamDefaultWriter.close()` {#writablestreamdefaultwriterclose}

**Agregado en: v16.5.0**

- Devuelve: Una promesa cumplida con `undefined`.

Cierra el `WritableStream` cuando no se esperan escrituras adicionales.

#### `writableStreamDefaultWriter.closed` {#writablestreamdefaultwriterclosed}

**Agregado en: v16.5.0**

- Tipo: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumplida con `undefined` cuando el [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream) asociado se cierra o se rechaza si el flujo tiene errores o el bloqueo del escritor se libera antes de que el flujo termine de cerrarse.

#### `writableStreamDefaultWriter.desiredSize` {#writablestreamdefaultwriterdesiredsize}

**Agregado en: v16.5.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La cantidad de datos necesarios para llenar la cola de [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream).

#### `writableStreamDefaultWriter.ready` {#writablestreamdefaultwriterready}

**Agregado en: v16.5.0**

- Tipo: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumplida con `undefined` cuando el escritor está listo para ser utilizado.

#### `writableStreamDefaultWriter.releaseLock()` {#writablestreamdefaultwriterreleaselock}

**Agregado en: v16.5.0**

Libera el bloqueo de este escritor en el [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) subyacente.

#### `writableStreamDefaultWriter.write([chunk])` {#writablestreamdefaultwriterwritechunk}

**Agregado en: v16.5.0**

- `chunk`: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Devuelve: Una promesa cumplida con `undefined`.

Anexa un nuevo fragmento de datos a la cola de [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream).

### Clase: `WritableStreamDefaultController` {#class-writablestreamdefaultcontroller}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Esta clase ahora está expuesta en el objeto global. |
| v16.5.0 | Agregado en: v16.5.0 |
:::

El `WritableStreamDefaultController` gestiona el estado interno del [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream).

#### `writableStreamDefaultController.error([error])` {#writablestreamdefaultcontrollererrorerror}

**Agregado en: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Llamado por el código de usuario para indicar que se ha producido un error al procesar los datos de `WritableStream`. Cuando se llama, el [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream) se abortará, y las escrituras pendientes se cancelarán.


#### `writableStreamDefaultController.signal` {#writablestreamdefaultcontrollersignal}

- Tipo: [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Un `AbortSignal` que puede ser usado para cancelar operaciones de escritura o cierre pendientes cuando un [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream) es abortado.

### Clase: `TransformStream` {#class-transformstream}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Esta clase ahora está expuesta en el objeto global. |
| v16.5.0 | Agregado en: v16.5.0 |
:::

Un `TransformStream` consiste en un [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) y un [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream) que están conectados de tal manera que los datos escritos en el `WritableStream` son recibidos, y potencialmente transformados, antes de ser empujados a la cola del `ReadableStream`.

```js [ESM]
import {
  TransformStream,
} from 'node:stream/web';

const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

await Promise.all([
  transform.writable.getWriter().write('A'),
  transform.readable.getReader().read(),
]);
```
#### `new TransformStream([transformer[, writableStrategy[, readableStrategy]]])` {#new-transformstreamtransformer-writablestrategy-readablestrategy}

**Agregado en: v16.5.0**

- `transformer` [\<Object\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `start` [\<Function\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función definida por el usuario que se invoca inmediatamente cuando se crea el `TransformStream`. 
    - `controller` [\<TransformStreamDefaultController\>](/es/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - Devuelve: `undefined` o una promesa cumplida con `undefined`
  
 
    - `transform` [\<Function\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función definida por el usuario que recibe, y potencialmente modifica, un fragmento de datos escrito en `transformStream.writable`, antes de reenviarlo a `transformStream.readable`. 
    - `chunk` [\<any\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Data_types)
    - `controller` [\<TransformStreamDefaultController\>](/es/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - Devuelve: Una promesa cumplida con `undefined`.
  
 
    - `flush` [\<Function\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función definida por el usuario que se llama inmediatamente antes de que se cierre el lado grabable del `TransformStream`, lo que indica el final del proceso de transformación. 
    - `controller` [\<TransformStreamDefaultController\>](/es/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - Devuelve: Una promesa cumplida con `undefined`.
  
 
    - `readableType` [\<any\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Data_types) la opción `readableType` está reservada para uso futuro y *debe* ser `undefined`.
    - `writableType` [\<any\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Data_types) la opción `writableType` está reservada para uso futuro y *debe* ser `undefined`.
  
 
- `writableStrategy` [\<Object\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type) El tamaño máximo de la cola interna antes de que se aplique la contrapresión.
    - `size` [\<Function\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función definida por el usuario que se utiliza para identificar el tamaño de cada fragmento de datos. 
    - `chunk` [\<any\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Data_types)
    - Devuelve: [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  
 
- `readableStrategy` [\<Object\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type) El tamaño máximo de la cola interna antes de que se aplique la contrapresión.
    - `size` [\<Function\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función definida por el usuario que se utiliza para identificar el tamaño de cada fragmento de datos. 
    - `chunk` [\<any\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Data_types)
    - Devuelve: [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  


#### `transformStream.readable` {#transformstreamreadable}

**Añadido en: v16.5.0**

- Tipo: [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream)

#### `transformStream.writable` {#transformstreamwritable}

**Añadido en: v16.5.0**

- Tipo: [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream)

#### Transferencia con postMessage() {#transferring-with-postmessage_2}

Se puede transferir una instancia de [\<TransformStream\>](/es/nodejs/api/webstreams#class-transformstream) usando un [\<MessagePort\>](/es/nodejs/api/worker_threads#class-messageport).

```js [ESM]
const stream = new TransformStream();

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  const { writable, readable } = data;
  // ...
};

port2.postMessage(stream, [stream]);
```
### Clase: `TransformStreamDefaultController` {#class-transformstreamdefaultcontroller}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Esta clase ahora está expuesta en el objeto global. |
| v16.5.0 | Añadido en: v16.5.0 |
:::

`TransformStreamDefaultController` gestiona el estado interno de `TransformStream`.

#### `transformStreamDefaultController.desiredSize` {#transformstreamdefaultcontrollerdesiredsize}

**Añadido en: v16.5.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La cantidad de datos necesarios para llenar la cola del lado legible.

#### `transformStreamDefaultController.enqueue([chunk])` {#transformstreamdefaultcontrollerenqueuechunk}

**Añadido en: v16.5.0**

- `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Anexa un fragmento de datos a la cola del lado legible.

#### `transformStreamDefaultController.error([reason])` {#transformstreamdefaultcontrollererrorreason}

**Añadido en: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Señala tanto al lado legible como al lado escribible que se ha producido un error al procesar los datos de transformación, lo que provoca que ambos lados se cierren abruptamente.

#### `transformStreamDefaultController.terminate()` {#transformstreamdefaultcontrollerterminate}

**Añadido en: v16.5.0**

Cierra el lado legible del transporte y hace que el lado escribible se cierre abruptamente con un error.

### Clase: `ByteLengthQueuingStrategy` {#class-bytelengthqueuingstrategy}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Esta clase ahora está expuesta en el objeto global. |
| v16.5.0 | Añadido en: v16.5.0 |
:::


#### `new ByteLengthQueuingStrategy(init)` {#new-bytelengthqueuingstrategyinit}

**Añadido en: v16.5.0**

- `init` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

#### `byteLengthQueuingStrategy.highWaterMark` {#bytelengthqueuingstrategyhighwatermark}

**Añadido en: v16.5.0**

- Tipo: [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### `byteLengthQueuingStrategy.size` {#bytelengthqueuingstrategysize}

**Añadido en: v16.5.0**

- Tipo: [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Devuelve: [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

### Clase: `CountQueuingStrategy` {#class-countqueuingstrategy}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Esta clase ahora se expone en el objeto global. |
| v16.5.0 | Añadido en: v16.5.0 |
:::

#### `new CountQueuingStrategy(init)` {#new-countqueuingstrategyinit}

**Añadido en: v16.5.0**

- `init` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

#### `countQueuingStrategy.highWaterMark` {#countqueuingstrategyhighwatermark}

**Añadido en: v16.5.0**

- Tipo: [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### `countQueuingStrategy.size` {#countqueuingstrategysize}

**Añadido en: v16.5.0**

- Tipo: [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Devuelve: [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

### Clase: `TextEncoderStream` {#class-textencoderstream}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Esta clase ahora se expone en el objeto global. |
| v16.6.0 | Añadido en: v16.6.0 |
:::


#### `new TextEncoderStream()` {#new-textencoderstream}

**Agregado en: v16.6.0**

Crea una nueva instancia de `TextEncoderStream`.

#### `textEncoderStream.encoding` {#textencoderstreamencoding}

**Agregado en: v16.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La codificación admitida por la instancia de `TextEncoderStream`.

#### `textEncoderStream.readable` {#textencoderstreamreadable}

**Agregado en: v16.6.0**

- Tipo: [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream)

#### `textEncoderStream.writable` {#textencoderstreamwritable}

**Agregado en: v16.6.0**

- Tipo: [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream)

### Clase: `TextDecoderStream` {#class-textdecoderstream}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Esta clase ahora está expuesta en el objeto global. |
| v16.6.0 | Agregado en: v16.6.0 |
:::

#### `new TextDecoderStream([encoding[, options]])` {#new-textdecoderstreamencoding-options}

**Agregado en: v16.6.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Identifica la `encoding` que admite esta instancia de `TextDecoder`. **Predeterminado:** `'utf-8'`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `fatal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si los errores de decodificación son fatales.
    - `ignoreBOM` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, el `TextDecoderStream` incluirá la marca de orden de bytes en el resultado decodificado. Cuando es `false`, la marca de orden de bytes se eliminará de la salida. Esta opción solo se usa cuando `encoding` es `'utf-8'`, `'utf-16be'` o `'utf-16le'`. **Predeterminado:** `false`.
  
 

Crea una nueva instancia de `TextDecoderStream`.

#### `textDecoderStream.encoding` {#textdecoderstreamencoding}

**Agregado en: v16.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La codificación admitida por la instancia de `TextDecoderStream`.

#### `textDecoderStream.fatal` {#textdecoderstreamfatal}

**Agregado en: v16.6.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

El valor será `true` si los errores de decodificación provocan que se lance un `TypeError`.


#### `textDecoderStream.ignoreBOM` {#textdecoderstreamignorebom}

**Añadido en: v16.6.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

El valor será `true` si el resultado de la decodificación incluirá la marca de orden de bytes.

#### `textDecoderStream.readable` {#textdecoderstreamreadable}

**Añadido en: v16.6.0**

- Tipo: [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream)

#### `textDecoderStream.writable` {#textdecoderstreamwritable}

**Añadido en: v16.6.0**

- Tipo: [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream)

### Clase: `CompressionStream` {#class-compressionstream}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Esta clase ahora está expuesta en el objeto global. |
| v17.0.0 | Añadido en: v17.0.0 |
:::

#### `new CompressionStream(format)` {#new-compressionstreamformat}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.2.0, v20.12.0 | format ahora acepta el valor `deflate-raw`. |
| v17.0.0 | Añadido en: v17.0.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uno de `'deflate'`, `'deflate-raw'`, o `'gzip'`.

#### `compressionStream.readable` {#compressionstreamreadable}

**Añadido en: v17.0.0**

- Tipo: [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream)

#### `compressionStream.writable` {#compressionstreamwritable}

**Añadido en: v17.0.0**

- Tipo: [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream)

### Clase: `DecompressionStream` {#class-decompressionstream}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Esta clase ahora está expuesta en el objeto global. |
| v17.0.0 | Añadido en: v17.0.0 |
:::

#### `new DecompressionStream(format)` {#new-decompressionstreamformat}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.2.0, v20.12.0 | format ahora acepta el valor `deflate-raw`. |
| v17.0.0 | Añadido en: v17.0.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uno de `'deflate'`, `'deflate-raw'`, o `'gzip'`.

#### `decompressionStream.readable` {#decompressionstreamreadable}

**Añadido en: v17.0.0**

- Tipo: [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream)

#### `decompressionStream.writable` {#decompressionstreamwritable}

**Añadido en: v17.0.0**

- Tipo: [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream)


### Consumidores de utilidades {#utility-consumers}

**Agregado en: v16.7.0**

Las funciones del consumidor de utilidades proporcionan opciones comunes para consumir flujos.

Se accede a ellas usando:

::: code-group
```js [ESM]
import {
  arrayBuffer,
  blob,
  buffer,
  json,
  text,
} from 'node:stream/consumers';
```

```js [CJS]
const {
  arrayBuffer,
  blob,
  buffer,
  json,
  text,
} = require('node:stream/consumers');
```
:::

#### `streamConsumers.arrayBuffer(stream)` {#streamconsumersarraybufferstream}

**Agregado en: v16.7.0**

- `stream` [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/es/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con un `ArrayBuffer` que contiene el contenido completo del flujo.

::: code-group
```js [ESM]
import { arrayBuffer } from 'node:stream/consumers';
import { Readable } from 'node:stream';
import { TextEncoder } from 'node:util';

const encoder = new TextEncoder();
const dataArray = encoder.encode('hello world from consumers!');

const readable = Readable.from(dataArray);
const data = await arrayBuffer(readable);
console.log(`from readable: ${data.byteLength}`);
// Prints: from readable: 76
```

```js [CJS]
const { arrayBuffer } = require('node:stream/consumers');
const { Readable } = require('node:stream');
const { TextEncoder } = require('node:util');

const encoder = new TextEncoder();
const dataArray = encoder.encode('hello world from consumers!');
const readable = Readable.from(dataArray);
arrayBuffer(readable).then((data) => {
  console.log(`from readable: ${data.byteLength}`);
  // Prints: from readable: 76
});
```
:::

#### `streamConsumers.blob(stream)` {#streamconsumersblobstream}

**Agregado en: v16.7.0**

- `stream` [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/es/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con un [\<Blob\>](/es/nodejs/api/buffer#class-blob) que contiene el contenido completo del flujo.

::: code-group
```js [ESM]
import { blob } from 'node:stream/consumers';

const dataBlob = new Blob(['hello world from consumers!']);

const readable = dataBlob.stream();
const data = await blob(readable);
console.log(`from readable: ${data.size}`);
// Prints: from readable: 27
```

```js [CJS]
const { blob } = require('node:stream/consumers');

const dataBlob = new Blob(['hello world from consumers!']);

const readable = dataBlob.stream();
blob(readable).then((data) => {
  console.log(`from readable: ${data.size}`);
  // Prints: from readable: 27
});
```
:::


#### `streamConsumers.buffer(stream)` {#streamconsumersbufferstream}

**Añadido en: v16.7.0**

- `stream` [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/es/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Regresa: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumple con un [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) que contiene el contenido completo del stream.

::: code-group
```js [ESM]
import { buffer } from 'node:stream/consumers';
import { Readable } from 'node:stream';
import { Buffer } from 'node:buffer';

const dataBuffer = Buffer.from('hello world from consumers!');

const readable = Readable.from(dataBuffer);
const data = await buffer(readable);
console.log(`from readable: ${data.length}`);
// Prints: from readable: 27
```

```js [CJS]
const { buffer } = require('node:stream/consumers');
const { Readable } = require('node:stream');
const { Buffer } = require('node:buffer');

const dataBuffer = Buffer.from('hello world from consumers!');

const readable = Readable.from(dataBuffer);
buffer(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Prints: from readable: 27
});
```
:::

#### `streamConsumers.json(stream)` {#streamconsumersjsonstream}

**Añadido en: v16.7.0**

- `stream` [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/es/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Regresa: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumple con el contenido del stream analizado como una cadena codificada en UTF-8 que luego se pasa a través de `JSON.parse()`.

::: code-group
```js [ESM]
import { json } from 'node:stream/consumers';
import { Readable } from 'node:stream';

const items = Array.from(
  {
    length: 100,
  },
  () => ({
    message: 'hello world from consumers!',
  }),
);

const readable = Readable.from(JSON.stringify(items));
const data = await json(readable);
console.log(`from readable: ${data.length}`);
// Prints: from readable: 100
```

```js [CJS]
const { json } = require('node:stream/consumers');
const { Readable } = require('node:stream');

const items = Array.from(
  {
    length: 100,
  },
  () => ({
    message: 'hello world from consumers!',
  }),
);

const readable = Readable.from(JSON.stringify(items));
json(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Prints: from readable: 100
});
```
:::


#### `streamConsumers.text(stream)` {#streamconsumerstextstream}

**Añadido en: v16.7.0**

- `stream` [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/es/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con el contenido del flujo analizado como una cadena codificada en UTF-8.

::: code-group
```js [ESM]
import { text } from 'node:stream/consumers';
import { Readable } from 'node:stream';

const readable = Readable.from('¡Hola mundo desde consumers!');
const data = await text(readable);
console.log(`from readable: ${data.length}`);
// Imprime: from readable: 27
```

```js [CJS]
const { text } = require('node:stream/consumers');
const { Readable } = require('node:stream');

const readable = Readable.from('¡Hola mundo desde consumers!');
text(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Imprime: from readable: 27
});
```
:::

