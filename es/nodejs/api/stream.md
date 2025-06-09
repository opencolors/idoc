---
title: Documentación de la API de Stream de Node.js
description: Documentación detallada sobre la API de Stream de Node.js, cubriendo flujos legibles, escribibles, dúplex y de transformación, junto con sus métodos, eventos y ejemplos de uso.
head:
  - - meta
    - name: og:title
      content: Documentación de la API de Stream de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Documentación detallada sobre la API de Stream de Node.js, cubriendo flujos legibles, escribibles, dúplex y de transformación, junto con sus métodos, eventos y ejemplos de uso.
  - - meta
    - name: twitter:title
      content: Documentación de la API de Stream de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Documentación detallada sobre la API de Stream de Node.js, cubriendo flujos legibles, escribibles, dúplex y de transformación, junto con sus métodos, eventos y ejemplos de uso.
---


# Stream {#stream}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código Fuente:** [lib/stream.js](https://github.com/nodejs/node/blob/v23.5.0/lib/stream.js)

Un stream es una interfaz abstracta para trabajar con datos de streaming en Node.js. El módulo `node:stream` proporciona una API para implementar la interfaz de stream.

Hay muchos objetos stream proporcionados por Node.js. Por ejemplo, una [solicitud a un servidor HTTP](/es/nodejs/api/http#class-httpincomingmessage) y [`process.stdout`](/es/nodejs/api/process#processstdout) son ambas instancias de stream.

Los streams pueden ser legibles, grabables o ambos. Todos los streams son instancias de [`EventEmitter`](/es/nodejs/api/events#class-eventemitter).

Para acceder al módulo `node:stream`:

```js [ESM]
const stream = require('node:stream');
```
El módulo `node:stream` es útil para crear nuevos tipos de instancias de stream. Por lo general, no es necesario usar el módulo `node:stream` para consumir streams.

## Organización de este documento {#organization-of-this-document}

Este documento contiene dos secciones principales y una tercera sección para notas. La primera sección explica cómo usar streams existentes dentro de una aplicación. La segunda sección explica cómo crear nuevos tipos de streams.

## Tipos de streams {#types-of-streams}

Hay cuatro tipos de streams fundamentales dentro de Node.js:

- [`Writable`](/es/nodejs/api/stream#class-streamwritable): streams en los que se pueden escribir datos (por ejemplo, [`fs.createWriteStream()`](/es/nodejs/api/fs#fscreatewritestreampath-options)).
- [`Readable`](/es/nodejs/api/stream#class-streamreadable): streams desde los que se pueden leer datos (por ejemplo, [`fs.createReadStream()`](/es/nodejs/api/fs#fscreatereadstreampath-options)).
- [`Duplex`](/es/nodejs/api/stream#class-streamduplex): streams que son tanto `Readable` como `Writable` (por ejemplo, [`net.Socket`](/es/nodejs/api/net#class-netsocket)).
- [`Transform`](/es/nodejs/api/stream#class-streamtransform): streams `Duplex` que pueden modificar o transformar los datos a medida que se escriben y se leen (por ejemplo, [`zlib.createDeflate()`](/es/nodejs/api/zlib#zlibcreatedeflateoptions)).

Además, este módulo incluye las funciones de utilidad [`stream.duplexPair()`](/es/nodejs/api/stream#streamduplexpairoptions), [`stream.pipeline()`](/es/nodejs/api/stream#streampipelinesource-transforms-destination-callback), [`stream.finished()`](/es/nodejs/api/stream#streamfinishedstream-options-callback) [`stream.Readable.from()`](/es/nodejs/api/stream#streamreadablefromiterable-options), y [`stream.addAbortSignal()`](/es/nodejs/api/stream#streamaddabortsignalsignal-stream).


### API de Streams Promises {#streams-promises-api}

**Añadido en: v15.0.0**

La API `stream/promises` proporciona un conjunto alternativo de funciones de utilidad asíncronas para streams que devuelven objetos `Promise` en lugar de usar callbacks. Se puede acceder a la API a través de `require('node:stream/promises')` o `require('node:stream').promises`.

### `stream.pipeline(source[, ...transforms], destination[, options])` {#streampipelinesource-transforms-destination-options}

### `stream.pipeline(streams[, options])` {#streampipelinestreams-options}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v18.0.0, v17.2.0, v16.14.0 | Añade la opción `end`, que se puede establecer en `false` para evitar el cierre automático del stream de destino cuando finaliza el origen. |
| v15.0.0 | Añadido en: v15.0.0 |
:::

- `streams` [\<Stream[]\>](/es/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `source` [\<Stream\>](/es/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `...transforms` [\<Stream\>](/es/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `destination` [\<Stream\>](/es/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones de Pipeline 
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal)
    - `end` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Finaliza el stream de destino cuando finaliza el stream de origen. Los streams de transformación siempre terminan, incluso si este valor es `false`. **Predeterminado:** `true`.
  
 
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple cuando el pipeline está completo.



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function run() {
  await pipeline(
    fs.createReadStream('archive.tar'),
    zlib.createGzip(),
    fs.createWriteStream('archive.tar.gz'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

await pipeline(
  createReadStream('archive.tar'),
  createGzip(),
  createWriteStream('archive.tar.gz'),
);
console.log('Pipeline succeeded.');
```
:::

Para usar una `AbortSignal`, pásala dentro de un objeto de opciones, como último argumento. Cuando se aborta la señal, se llamará a `destroy` en el pipeline subyacente, con un `AbortError`.



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function run() {
  const ac = new AbortController();
  const signal = ac.signal;

  setImmediate(() => ac.abort());
  await pipeline(
    fs.createReadStream('archive.tar'),
    zlib.createGzip(),
    fs.createWriteStream('archive.tar.gz'),
    { signal },
  );
}

run().catch(console.error); // AbortError
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

const ac = new AbortController();
const { signal } = ac;
setImmediate(() => ac.abort());
try {
  await pipeline(
    createReadStream('archive.tar'),
    createGzip(),
    createWriteStream('archive.tar.gz'),
    { signal },
  );
} catch (err) {
  console.error(err); // AbortError
}
```
:::

La API `pipeline` también admite generadores asíncronos:



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  await pipeline(
    fs.createReadStream('lowercase.txt'),
    async function* (source, { signal }) {
      source.setEncoding('utf8');  // Trabajar con strings en lugar de `Buffer`s.
      for await (const chunk of source) {
        yield await processChunk(chunk, { signal });
      }
    },
    fs.createWriteStream('uppercase.txt'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';

await pipeline(
  createReadStream('lowercase.txt'),
  async function* (source, { signal }) {
    source.setEncoding('utf8');  // Trabajar con strings en lugar de `Buffer`s.
    for await (const chunk of source) {
      yield await processChunk(chunk, { signal });
    }
  },
  createWriteStream('uppercase.txt'),
);
console.log('Pipeline succeeded.');
```
:::

Recuerda manejar el argumento `signal` que se pasa al generador asíncrono. Especialmente en el caso de que el generador asíncrono sea la fuente del pipeline (es decir, el primer argumento) o el pipeline nunca se completará.



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  await pipeline(
    async function* ({ signal }) {
      await someLongRunningfn({ signal });
      yield 'asd';
    },
    fs.createWriteStream('uppercase.txt'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import fs from 'node:fs';
await pipeline(
  async function* ({ signal }) {
    await someLongRunningfn({ signal });
    yield 'asd';
  },
  fs.createWriteStream('uppercase.txt'),
);
console.log('Pipeline succeeded.');
```
:::

La API `pipeline` proporciona la [versión callback](/es/nodejs/api/stream#streampipelinesource-transforms-destination-callback):


### `stream.finished(stream[, options])` {#streamfinishedstream-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.5.0, v18.14.0 | Se agregó soporte para `ReadableStream` y `WritableStream`. |
| v19.1.0, v18.13.0 | Se agregó la opción `cleanup`. |
| v15.0.0 | Agregado en: v15.0.0 |
:::

- `stream` [\<Stream\>](/es/nodejs/api/stream#stream) | [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream) Un flujo/flujo web legible y/o grabable.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `error` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `cleanup` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Si es `true`, elimina los listeners registrados por esta función antes de que la promesa se cumpla. **Predeterminado:** `false`.


- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple cuando el flujo ya no es legible o grabable.



::: code-group
```js [CJS]
const { finished } = require('node:stream/promises');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

async function run() {
  await finished(rs);
  console.log('Stream is done reading.');
}

run().catch(console.error);
rs.resume(); // Drain the stream.
```

```js [ESM]
import { finished } from 'node:stream/promises';
import { createReadStream } from 'node:fs';

const rs = createReadStream('archive.tar');

async function run() {
  await finished(rs);
  console.log('Stream is done reading.');
}

run().catch(console.error);
rs.resume(); // Drain the stream.
```
:::

La API `finished` también proporciona una [versión de callback](/es/nodejs/api/stream#streamfinishedstream-options-callback).

`stream.finished()` deja listeners de eventos colgando (en particular `'error'`, `'end'`, `'finish'` y `'close'`) después de que la promesa devuelta se resuelve o se rechaza. La razón de esto es para que los eventos `'error'` inesperados (debido a implementaciones de flujo incorrectas) no causen bloqueos inesperados. Si este es un comportamiento no deseado, entonces `options.cleanup` debe establecerse en `true`:

```js [ESM]
await finished(rs, { cleanup: true });
```

### Modo objeto {#object-mode}

Todos los flujos creados por las API de Node.js operan exclusivamente con cadenas, objetos [\<Buffer\>](/es/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) y [\<DataView\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/DataView):

- `Strings` y `Buffers` son los tipos más comunes utilizados con flujos.
- `TypedArray` y `DataView` te permiten manejar datos binarios con tipos como `Int32Array` o `Uint8Array`. Cuando escribes un TypedArray o DataView a un flujo, Node.js procesa los bytes raw.

Es posible, sin embargo, que las implementaciones de flujo funcionen con otros tipos de valores de JavaScript (con la excepción de `null`, que tiene un propósito especial dentro de los flujos). Dichos flujos se consideran que operan en "modo objeto".

Las instancias de flujo se cambian al modo objeto utilizando la opción `objectMode` cuando se crea el flujo. Intentar cambiar un flujo existente al modo objeto no es seguro.

### Almacenamiento en búfer {#buffering}

Tanto los flujos [`Writable`](/es/nodejs/api/stream#class-streamwritable) como [`Readable`](/es/nodejs/api/stream#class-streamreadable) almacenarán datos en un búfer interno.

La cantidad de datos potencialmente almacenados en el búfer depende de la opción `highWaterMark` que se pasa al constructor del flujo. Para los flujos normales, la opción `highWaterMark` especifica un [número total de bytes](/es/nodejs/api/stream#highwatermark-discrepancy-after-calling-readablesetencoding). Para los flujos que operan en modo objeto, `highWaterMark` especifica un número total de objetos. Para los flujos que operan en cadenas (pero no las decodifican), `highWaterMark` especifica un número total de unidades de código UTF-16.

Los datos se almacenan en búfer en flujos `Readable` cuando la implementación llama a [`stream.push(chunk)`](/es/nodejs/api/stream#readablepushchunk-encoding). Si el consumidor del flujo no llama a [`stream.read()`](/es/nodejs/api/stream#readablereadsize), los datos permanecerán en la cola interna hasta que se consuman.

Una vez que el tamaño total del búfer de lectura interno alcanza el umbral especificado por `highWaterMark`, el flujo dejará temporalmente de leer datos del recurso subyacente hasta que los datos actualmente almacenados en el búfer puedan consumirse (es decir, el flujo dejará de llamar al método interno [`readable._read()`](/es/nodejs/api/stream#readable_readsize) que se utiliza para llenar el búfer de lectura).

Los datos se almacenan en búfer en flujos `Writable` cuando se llama repetidamente al método [`writable.write(chunk)`](/es/nodejs/api/stream#writablewritechunk-encoding-callback). Mientras que el tamaño total del búfer de escritura interno está por debajo del umbral establecido por `highWaterMark`, las llamadas a `writable.write()` devolverán `true`. Una vez que el tamaño del búfer interno alcanza o excede el `highWaterMark`, se devolverá `false`.

Un objetivo clave de la API `stream`, particularmente el método [`stream.pipe()`](/es/nodejs/api/stream#readablepipedestination-options), es limitar el almacenamiento en búfer de datos a niveles aceptables de modo que las fuentes y los destinos de diferentes velocidades no sobrecarguen la memoria disponible.

La opción `highWaterMark` es un umbral, no un límite: dicta la cantidad de datos que un flujo almacena en el búfer antes de que deje de solicitar más datos. No impone una limitación estricta de la memoria en general. Las implementaciones de flujo específicas pueden optar por imponer límites más estrictos, pero hacerlo es opcional.

Debido a que los flujos [`Duplex`](/es/nodejs/api/stream#class-streamduplex) y [`Transform`](/es/nodejs/api/stream#class-streamtransform) son `Readable` y `Writable`, cada uno mantiene *dos* búferes internos separados utilizados para leer y escribir, lo que permite que cada lado opere independientemente del otro mientras mantiene un flujo de datos apropiado y eficiente. Por ejemplo, las instancias [`net.Socket`](/es/nodejs/api/net#class-netsocket) son flujos [`Duplex`](/es/nodejs/api/stream#class-streamduplex) cuyo lado `Readable` permite el consumo de datos recibidos *del* socket y cuyo lado `Writable` permite escribir datos *en* el socket. Debido a que los datos se pueden escribir en el socket a una velocidad más rápida o más lenta que la de recepción de datos, cada lado debe operar (y almacenar en búfer) independientemente del otro.

La mecánica del almacenamiento en búfer interno es un detalle de implementación interno y puede cambiarse en cualquier momento. Sin embargo, para ciertas implementaciones avanzadas, los búferes internos se pueden recuperar utilizando `writable.writableBuffer` o `readable.readableBuffer`. No se recomienda el uso de estas propiedades no documentadas.


## API para consumidores de flujos {#api-for-stream-consumers}

Casi todas las aplicaciones de Node.js, sin importar cuán simples sean, utilizan flujos de alguna manera. El siguiente es un ejemplo del uso de flujos en una aplicación de Node.js que implementa un servidor HTTP:

```js [ESM]
const http = require('node:http');

const server = http.createServer((req, res) => {
  // `req` es un http.IncomingMessage, que es un flujo legible.
  // `res` es un http.ServerResponse, que es un flujo escribible.

  let body = '';
  // Obtén los datos como cadenas utf8.
  // Si no se establece una codificación, se recibirán objetos Buffer.
  req.setEncoding('utf8');

  // Los flujos legibles emiten eventos 'data' una vez que se agrega un oyente.
  req.on('data', (chunk) => {
    body += chunk;
  });

  // El evento 'end' indica que se ha recibido todo el cuerpo.
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      // Escribe algo interesante para el usuario:
      res.write(typeof data);
      res.end();
    } catch (er) {
      // ¡uh oh! ¡json incorrecto!
      res.statusCode = 400;
      return res.end(`error: ${er.message}`);
    }
  });
});

server.listen(1337);

// $ curl localhost:1337 -d "{}"
// object
// $ curl localhost:1337 -d "\"foo\""
// string
// $ curl localhost:1337 -d "not json"
// error: Unexpected token 'o', "not json" is not valid JSON
```
Los flujos [`Writable`](/es/nodejs/api/stream#class-streamwritable) (como `res` en el ejemplo) exponen métodos como `write()` y `end()` que se utilizan para escribir datos en el flujo.

Los flujos [`Readable`](/es/nodejs/api/stream#class-streamreadable) utilizan la API de [`EventEmitter`](/es/nodejs/api/events#class-eventemitter) para notificar al código de la aplicación cuando hay datos disponibles para ser leídos del flujo. Esos datos disponibles se pueden leer del flujo de múltiples maneras.

Tanto los flujos [`Writable`](/es/nodejs/api/stream#class-streamwritable) como los [`Readable`](/es/nodejs/api/stream#class-streamreadable) utilizan la API de [`EventEmitter`](/es/nodejs/api/events#class-eventemitter) de varias maneras para comunicar el estado actual del flujo.

Los flujos [`Duplex`](/es/nodejs/api/stream#class-streamduplex) y [`Transform`](/es/nodejs/api/stream#class-streamtransform) son tanto [`Writable`](/es/nodejs/api/stream#class-streamwritable) como [`Readable`](/es/nodejs/api/stream#class-streamreadable).

Las aplicaciones que escriben o consumen datos de un flujo no están obligadas a implementar las interfaces de flujo directamente y generalmente no tendrán ninguna razón para llamar a `require('node:stream')`.

Los desarrolladores que deseen implementar nuevos tipos de flujos deben consultar la sección [API para implementadores de flujos](/es/nodejs/api/stream#api-for-stream-implementers).


### Streams de escritura {#writable-streams}

Los streams de escritura son una abstracción para un *destino* al que se escriben los datos.

Ejemplos de streams [`Writable`](/es/nodejs/api/stream#class-streamwritable) incluyen:

- [Peticiones HTTP, en el cliente](/es/nodejs/api/http#class-httpclientrequest)
- [Respuestas HTTP, en el servidor](/es/nodejs/api/http#class-httpserverresponse)
- [Streams de escritura fs](/es/nodejs/api/fs#class-fswritestream)
- [Streams zlib](/es/nodejs/api/zlib)
- [Streams crypto](/es/nodejs/api/crypto)
- [Sockets TCP](/es/nodejs/api/net#class-netsocket)
- [stdin de proceso hijo](/es/nodejs/api/child_process#subprocessstdin)
- [`process.stdout`](/es/nodejs/api/process#processstdout), [`process.stderr`](/es/nodejs/api/process#processstderr)

Algunos de estos ejemplos son en realidad streams [`Duplex`](/es/nodejs/api/stream#class-streamduplex) que implementan la interfaz [`Writable`](/es/nodejs/api/stream#class-streamwritable).

Todos los streams [`Writable`](/es/nodejs/api/stream#class-streamwritable) implementan la interfaz definida por la clase `stream.Writable`.

Si bien las instancias específicas de streams [`Writable`](/es/nodejs/api/stream#class-streamwritable) pueden diferir de varias maneras, todos los streams `Writable` siguen el mismo patrón de uso fundamental como se ilustra en el siguiente ejemplo:

```js [ESM]
const myStream = getWritableStreamSomehow();
myStream.write('some data');
myStream.write('some more data');
myStream.end('done writing data');
```
#### Clase: `stream.Writable` {#class-streamwritable}

**Agregado en: v0.9.4**

##### Evento: `'close'` {#event-close}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Agregar opción `emitClose` para especificar si `'close'` se emite en la destrucción. |
| v0.9.4 | Agregado en: v0.9.4 |
:::

El evento `'close'` se emite cuando el stream y cualquiera de sus recursos subyacentes (un descriptor de archivo, por ejemplo) se han cerrado. El evento indica que no se emitirán más eventos y no se producirá más cálculo.

Un stream [`Writable`](/es/nodejs/api/stream#class-streamwritable) siempre emitirá el evento `'close'` si se crea con la opción `emitClose`.

##### Evento: `'drain'` {#event-drain}

**Agregado en: v0.9.4**

Si una llamada a [`stream.write(chunk)`](/es/nodejs/api/stream#writablewritechunk-encoding-callback) devuelve `false`, el evento `'drain'` se emitirá cuando sea apropiado reanudar la escritura de datos en el stream.

```js [ESM]
// Escribir los datos en el stream de escritura suministrado un millón de veces.
// Estar atento a la contrapresión.
function writeOneMillionTimes(writer, data, encoding, callback) {
  let i = 1000000;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        // ¡Última vez!
        writer.write(data, encoding, callback);
      } else {
        // Ver si debemos continuar o esperar.
        // No pasar la devolución de llamada, porque aún no hemos terminado.
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // ¡Tuvo que parar antes de tiempo!
      // Escribir algo más una vez que se drene.
      writer.once('drain', write);
    }
  }
}
```

##### Evento: `'error'` {#event-error}

**Agregado en: v0.9.4**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

El evento `'error'` se emite si ocurre un error al escribir o canalizar datos. La función de retorno del escuchador recibe un único argumento `Error` cuando se llama.

El stream se cierra cuando se emite el evento `'error'` a menos que la opción [`autoDestroy`](/es/nodejs/api/stream#new-streamwritableoptions) se haya establecido en `false` al crear el stream.

Después de `'error'`, no se *deberían* emitir más eventos que `'close'` (incluyendo eventos `'error'`).

##### Evento: `'finish'` {#event-finish}

**Agregado en: v0.9.4**

El evento `'finish'` se emite después de que se haya llamado al método [`stream.end()`](/es/nodejs/api/stream#writableendchunk-encoding-callback), y todos los datos se hayan vaciado al sistema subyacente.

```js [ESM]
const writer = getWritableStreamSomehow();
for (let i = 0; i < 100; i++) {
  writer.write(`hello, #${i}!\n`);
}
writer.on('finish', () => {
  console.log('All writes are now complete.');
});
writer.end('This is the end\n');
```
##### Evento: `'pipe'` {#event-pipe}

**Agregado en: v0.9.4**

- `src` [\<stream.Readable\>](/es/nodejs/api/stream#class-streamreadable) stream de origen que se está canalizando a este writable

El evento `'pipe'` se emite cuando se llama al método [`stream.pipe()`](/es/nodejs/api/stream#readablepipedestination-options) en un stream readable, añadiendo este writable a su conjunto de destinos.

```js [ESM]
const writer = getWritableStreamSomehow();
const reader = getReadableStreamSomehow();
writer.on('pipe', (src) => {
  console.log('Something is piping into the writer.');
  assert.equal(src, reader);
});
reader.pipe(writer);
```
##### Evento: `'unpipe'` {#event-unpipe}

**Agregado en: v0.9.4**

- `src` [\<stream.Readable\>](/es/nodejs/api/stream#class-streamreadable) El stream de origen que [desconectó](/es/nodejs/api/stream#readableunpipedestination) este writable

El evento `'unpipe'` se emite cuando se llama al método [`stream.unpipe()`](/es/nodejs/api/stream#readableunpipedestination) en un stream [`Readable`](/es/nodejs/api/stream#class-streamreadable), eliminando este [`Writable`](/es/nodejs/api/stream#class-streamwritable) de su conjunto de destinos.

Esto también se emite en caso de que este stream [`Writable`](/es/nodejs/api/stream#class-streamwritable) emita un error cuando un stream [`Readable`](/es/nodejs/api/stream#class-streamreadable) se canaliza hacia él.

```js [ESM]
const writer = getWritableStreamSomehow();
const reader = getReadableStreamSomehow();
writer.on('unpipe', (src) => {
  console.log('Something has stopped piping into the writer.');
  assert.equal(src, reader);
});
reader.pipe(writer);
reader.unpipe(writer);
```

##### `writable.cork()` {#writablecork}

**Añadido en: v0.11.2**

El método `writable.cork()` fuerza a que todos los datos escritos se almacenen en búfer en la memoria. Los datos almacenados en el búfer se vaciarán cuando se llamen los métodos [`stream.uncork()`](/es/nodejs/api/stream#writableuncork) o [`stream.end()`](/es/nodejs/api/stream#writableendchunk-encoding-callback).

La intención principal de `writable.cork()` es dar cabida a una situación en la que varios fragmentos pequeños se escriben en el stream en rápida sucesión. En lugar de reenviarlos inmediatamente al destino subyacente, `writable.cork()` almacena en búfer todos los fragmentos hasta que se llama a `writable.uncork()`, lo que los pasará todos a `writable._writev()`, si está presente. Esto evita una situación de bloqueo de cabeza de línea en la que los datos se almacenan en búfer mientras se espera a que se procese el primer fragmento pequeño. Sin embargo, el uso de `writable.cork()` sin implementar `writable._writev()` puede tener un efecto adverso en el rendimiento.

Ver también: [`writable.uncork()`](/es/nodejs/api/stream#writableuncork), [`writable._writev()`](/es/nodejs/api/stream#writable_writevchunks-callback).

##### `writable.destroy([error])` {#writabledestroyerror}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v14.0.0 | Funciona como una operación no válida en un stream que ya ha sido destruido. |
| v8.0.0 | Añadido en: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Opcional, un error a emitir con el evento `'error'`.
- Devuelve: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Destruye el stream. Opcionalmente, emite un evento `'error'` y emite un evento `'close'` (a menos que `emitClose` esté establecido en `false`). Después de esta llamada, el stream de escritura ha finalizado y las llamadas posteriores a `write()` o `end()` provocarán un error `ERR_STREAM_DESTROYED`. Esta es una forma destructiva e inmediata de destruir un stream. Es posible que las llamadas anteriores a `write()` no se hayan agotado y pueden desencadenar un error `ERR_STREAM_DESTROYED`. Utilice `end()` en lugar de destroy si los datos deben vaciarse antes de cerrar, o espere el evento `'drain'` antes de destruir el stream.

```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

const fooErr = new Error('foo error');
myStream.destroy(fooErr);
myStream.on('error', (fooErr) => console.error(fooErr.message)); // foo error
```
```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

myStream.destroy();
myStream.on('error', function wontHappen() {});
```
```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();
myStream.destroy();

myStream.write('foo', (error) => console.error(error.code));
// ERR_STREAM_DESTROYED
```
Una vez que se ha llamado a `destroy()`, cualquier otra llamada será una operación no válida y no se emitirán más errores que los de `_destroy()` como `'error'`.

Los implementadores no deben anular este método, sino implementar [`writable._destroy()`](/es/nodejs/api/stream#writable_destroyerr-callback).


##### `writable.closed` {#writableclosed}

**Añadido en: v18.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Es `true` después de que se haya emitido `'close'`.

##### `writable.destroyed` {#writabledestroyed}

**Añadido en: v8.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Es `true` después de que se haya llamado a [`writable.destroy()`](/es/nodejs/api/stream#writabledestroyerror).

```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

console.log(myStream.destroyed); // false
myStream.destroy();
console.log(myStream.destroyed); // true
```
##### `writable.end([chunk[, encoding]][, callback])` {#writableendchunk-encoding-callback}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v22.0.0, v20.13.0 | El argumento `chunk` ahora puede ser una instancia de `TypedArray` o `DataView`. |
| v15.0.0 | Se invoca la `callback` antes de 'finish' o en caso de error. |
| v14.0.0 | Se invoca la `callback` si se emite 'finish' o 'error'. |
| v10.0.0 | Este método ahora devuelve una referencia a `writable`. |
| v8.0.0 | El argumento `chunk` ahora puede ser una instancia de `Uint8Array`. |
| v0.9.4 | Añadido en: v0.9.4 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Datos opcionales para escribir. Para flujos que no operan en modo de objeto, `chunk` debe ser un [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/es/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) o [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView). Para flujos en modo de objeto, `chunk` puede ser cualquier valor de JavaScript que no sea `null`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codificación si `chunk` es una cadena
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback para cuando el flujo haya terminado.
- Devuelve: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Llamar al método `writable.end()` indica que no se escribirán más datos en [`Writable`](/es/nodejs/api/stream#class-streamwritable). Los argumentos opcionales `chunk` y `encoding` permiten escribir un último fragmento de datos adicional inmediatamente antes de cerrar el flujo.

Llamar al método [`stream.write()`](/es/nodejs/api/stream#writablewritechunk-encoding-callback) después de llamar a [`stream.end()`](/es/nodejs/api/stream#writableendchunk-encoding-callback) generará un error.

```js [ESM]
// Escribe 'hello, ' y luego termina con 'world!'.
const fs = require('node:fs');
const file = fs.createWriteStream('example.txt');
file.write('hello, ');
file.end('world!');
// ¡Ahora no se permite escribir más!
```

##### `writable.setDefaultEncoding(encoding)` {#writablesetdefaultencodingencoding}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.1.0 | Este método ahora devuelve una referencia a `writable`. |
| v0.11.15 | Añadido en: v0.11.15 |
:::

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La nueva codificación predeterminada
- Devuelve: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

El método `writable.setDefaultEncoding()` establece la `encoding` predeterminada para un flujo [`Writable`](/es/nodejs/api/stream#class-streamwritable).

##### `writable.uncork()` {#writableuncork}

**Añadido en: v0.11.2**

El método `writable.uncork()` descarga todos los datos almacenados en búfer desde que se llamó a [`stream.cork()`](/es/nodejs/api/stream#writablecork).

Cuando se utiliza [`writable.cork()`](/es/nodejs/api/stream#writablecork) y `writable.uncork()` para gestionar el almacenamiento en búfer de las escrituras en un flujo, difiera las llamadas a `writable.uncork()` utilizando `process.nextTick()`. Hacerlo permite agrupar todas las llamadas a `writable.write()` que se producen dentro de una fase dada del bucle de eventos de Node.js.

```js [ESM]
stream.cork();
stream.write('some ');
stream.write('data ');
process.nextTick(() => stream.uncork());
```
Si el método [`writable.cork()`](/es/nodejs/api/stream#writablecork) se llama varias veces en un flujo, se debe llamar al mismo número de veces a `writable.uncork()` para descargar los datos almacenados en búfer.

```js [ESM]
stream.cork();
stream.write('some ');
stream.cork();
stream.write('data ');
process.nextTick(() => {
  stream.uncork();
  // Los datos no se descargarán hasta que se llame a uncork() una segunda vez.
  stream.uncork();
});
```
Ver también: [`writable.cork()`](/es/nodejs/api/stream#writablecork).

##### `writable.writable` {#writablewritable}

**Añadido en: v11.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Es `true` si es seguro llamar a [`writable.write()`](/es/nodejs/api/stream#writablewritechunk-encoding-callback), lo que significa que el flujo no ha sido destruido, ha dado error o ha finalizado.

##### `writable.writableAborted` {#writablewritableaborted}

**Añadido en: v18.0.0, v16.17.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve si el flujo fue destruido o dio error antes de emitir `'finish'`.


##### `writable.writableEnded` {#writablewritableended}

**Agregado en: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Es `true` después de que se haya llamado a [`writable.end()`](/es/nodejs/api/stream#writableendchunk-encoding-callback). Esta propiedad no indica si los datos se han vaciado, para esto use [`writable.writableFinished`](/es/nodejs/api/stream#writablewritablefinished) en su lugar.

##### `writable.writableCorked` {#writablewritablecorked}

**Agregado en: v13.2.0, v12.16.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Número de veces que se necesita llamar a [`writable.uncork()`](/es/nodejs/api/stream#writableuncork) para destapar completamente el stream.

##### `writable.errored` {#writableerrored}

**Agregado en: v18.0.0**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Devuelve el error si el stream ha sido destruido con un error.

##### `writable.writableFinished` {#writablewritablefinished}

**Agregado en: v12.6.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se establece en `true` inmediatamente antes de que se emita el evento [`'finish'`](/es/nodejs/api/stream#event-finish).

##### `writable.writableHighWaterMark` {#writablewritablehighwatermark}

**Agregado en: v9.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Devuelve el valor de `highWaterMark` pasado al crear este `Writable`.

##### `writable.writableLength` {#writablewritablelength}

**Agregado en: v9.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Esta propiedad contiene el número de bytes (u objetos) en la cola listos para ser escritos. El valor proporciona datos de introspección con respecto al estado de `highWaterMark`.

##### `writable.writableNeedDrain` {#writablewritableneeddrain}

**Agregado en: v15.2.0, v14.17.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Es `true` si el búfer del stream se ha llenado y el stream emitirá `'drain'`.


##### `writable.writableObjectMode` {#writablewritableobjectmode}

**Añadido en: v12.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Getter para la propiedad `objectMode` de un flujo `Writable` dado.

##### `writable[Symbol.asyncDispose]()` {#writablesymbolasyncdispose}

**Añadido en: v22.4.0, v20.16.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Llama a [`writable.destroy()`](/es/nodejs/api/stream#writabledestroyerror) con un `AbortError` y devuelve una promesa que se cumple cuando el flujo ha terminado.

##### `writable.write(chunk[, encoding][, callback])` {#writablewritechunk-encoding-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.0.0, v20.13.0 | El argumento `chunk` ahora puede ser una instancia de `TypedArray` o `DataView`. |
| v8.0.0 | El argumento `chunk` ahora puede ser una instancia de `Uint8Array`. |
| v6.0.0 | Pasar `null` como parámetro `chunk` siempre se considerará inválido ahora, incluso en modo objeto. |
| v0.9.4 | Añadido en: v0.9.4 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Datos opcionales para escribir. Para flujos que no operan en modo objeto, `chunk` debe ser un [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/es/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) o [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView). Para flujos en modo objeto, `chunk` puede ser cualquier valor de JavaScript que no sea `null`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) La codificación, si `chunk` es una cadena. **Predeterminado:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback para cuando este fragmento de datos se haya vaciado.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` si el flujo desea que el código de llamada espere a que se emita el evento `'drain'` antes de continuar escribiendo datos adicionales; de lo contrario, `true`.

El método `writable.write()` escribe algunos datos en el flujo y llama al `callback` suministrado una vez que los datos se han gestionado por completo. Si se produce un error, se llamará al `callback` con el error como primer argumento. El `callback` se llama de forma asíncrona y antes de que se emita `'error'`.

El valor de retorno es `true` si el búfer interno es menor que el `highWaterMark` configurado cuando se creó el flujo después de admitir `chunk`. Si se devuelve `false`, los intentos posteriores de escribir datos en el flujo deben detenerse hasta que se emita el evento [`'drain'`](/es/nodejs/api/stream#event-drain).

Mientras un flujo no se está vaciando, las llamadas a `write()` almacenarán en búfer `chunk` y devolverán false. Una vez que todos los fragmentos actualmente almacenados en búfer se vacíen (aceptados para la entrega por el sistema operativo), se emitirá el evento `'drain'`. Una vez que `write()` devuelva false, no escriba más fragmentos hasta que se emita el evento `'drain'`. Si bien está permitido llamar a `write()` en un flujo que no se está vaciando, Node.js almacenará en búfer todos los fragmentos escritos hasta que se produzca el uso máximo de memoria, momento en el que se anulará incondicionalmente. Incluso antes de que se anule, el alto uso de memoria provocará un rendimiento deficiente del recolector de basura y un alto RSS (que normalmente no se devuelve al sistema, incluso después de que la memoria ya no sea necesaria). Dado que los sockets TCP pueden no vaciarse nunca si el par remoto no lee los datos, escribir en un socket que no se está vaciando puede conducir a una vulnerabilidad explotable de forma remota.

Escribir datos mientras el flujo no se está vaciando es particularmente problemático para un [`Transform`](/es/nodejs/api/stream#class-streamtransform), porque los flujos `Transform` se pausan de forma predeterminada hasta que se canalizan o se agrega un controlador de eventos `'data'` o `'readable'`.

Si los datos que se van a escribir se pueden generar o recuperar a petición, se recomienda encapsular la lógica en un [`Readable`](/es/nodejs/api/stream#class-streamreadable) y utilizar [`stream.pipe()`](/es/nodejs/api/stream#readablepipedestination-options). Sin embargo, si se prefiere llamar a `write()`, es posible respetar la contrapresión y evitar problemas de memoria utilizando el evento [`'drain'`](/es/nodejs/api/stream#event-drain):

```js [ESM]
function write(data, cb) {
  if (!stream.write(data)) {
    stream.once('drain', cb);
  } else {
    process.nextTick(cb);
  }
}

// Esperar a que se llame a cb antes de realizar cualquier otra escritura.
write('hello', () => {
  console.log('Escritura completada, hacer más escrituras ahora.');
});
```
Un flujo `Writable` en modo objeto siempre ignorará el argumento `encoding`.


### Streams legibles {#readable-streams}

Los streams legibles son una abstracción para una *fuente* desde la cual se consumen datos.

Ejemplos de streams `Readable` incluyen:

- [Respuestas HTTP, en el cliente](/es/nodejs/api/http#class-httpincomingmessage)
- [Peticiones HTTP, en el servidor](/es/nodejs/api/http#class-httpincomingmessage)
- [Streams de lectura fs](/es/nodejs/api/fs#class-fsreadstream)
- [Streams zlib](/es/nodejs/api/zlib)
- [Streams crypto](/es/nodejs/api/crypto)
- [Sockets TCP](/es/nodejs/api/net#class-netsocket)
- [stdout y stderr de procesos hijo](/es/nodejs/api/child_process#subprocessstdout)
- [`process.stdin`](/es/nodejs/api/process#processstdin)

Todos los streams [`Readable`](/es/nodejs/api/stream#class-streamreadable) implementan la interfaz definida por la clase `stream.Readable`.

#### Dos modos de lectura {#two-reading-modes}

Los streams `Readable` operan de manera efectiva en uno de dos modos: flujo y pausa. Estos modos son independientes del [modo objeto](/es/nodejs/api/stream#object-mode). Un stream [`Readable`](/es/nodejs/api/stream#class-streamreadable) puede estar en modo objeto o no, independientemente de si está en modo de flujo o en modo de pausa.

- En el modo de flujo, los datos se leen del sistema subyacente automáticamente y se proporcionan a una aplicación lo más rápido posible utilizando eventos a través de la interfaz [`EventEmitter`](/es/nodejs/api/events#class-eventemitter).
- En el modo de pausa, el método [`stream.read()`](/es/nodejs/api/stream#readablereadsize) debe llamarse explícitamente para leer fragmentos de datos del stream.

Todos los streams [`Readable`](/es/nodejs/api/stream#class-streamreadable) comienzan en modo de pausa, pero se pueden cambiar al modo de flujo de una de las siguientes maneras:

- Agregando un controlador de eventos [`'data'`](/es/nodejs/api/stream#event-data).
- Llamando al método [`stream.resume()`](/es/nodejs/api/stream#readableresume).
- Llamando al método [`stream.pipe()`](/es/nodejs/api/stream#readablepipedestination-options) para enviar los datos a un [`Writable`](/es/nodejs/api/stream#class-streamwritable).

El `Readable` puede volver al modo de pausa utilizando uno de los siguientes métodos:

- Si no hay destinos de pipe, llamando al método [`stream.pause()`](/es/nodejs/api/stream#readablepause).
- Si hay destinos de pipe, eliminando todos los destinos de pipe. Se pueden eliminar varios destinos de pipe llamando al método [`stream.unpipe()`](/es/nodejs/api/stream#readableunpipedestination).

El concepto importante para recordar es que un `Readable` no generará datos hasta que se proporcione un mecanismo para consumir o ignorar esos datos. Si el mecanismo de consumo se deshabilita o se quita, el `Readable` *intentará* dejar de generar los datos.

Por razones de compatibilidad con versiones anteriores, la eliminación de los controladores de eventos [`'data'`](/es/nodejs/api/stream#event-data) **no** pausará automáticamente el stream. Además, si hay destinos canalizados, entonces llamar a [`stream.pause()`](/es/nodejs/api/stream#readablepause) no garantiza que el stream *permanecerá* en pausa una vez que esos destinos se agoten y soliciten más datos.

Si un [`Readable`](/es/nodejs/api/stream#class-streamreadable) se cambia al modo de flujo y no hay consumidores disponibles para manejar los datos, esos datos se perderán. Esto puede ocurrir, por ejemplo, cuando se llama al método `readable.resume()` sin un listener adjunto al evento `'data'`, o cuando se elimina un controlador de eventos `'data'` del stream.

Agregar un controlador de eventos [`'readable'`](/es/nodejs/api/stream#event-readable) automáticamente hace que el stream deje de fluir, y los datos deben consumirse a través de [`readable.read()`](/es/nodejs/api/stream#readablereadsize). Si se elimina el controlador de eventos [`'readable'`](/es/nodejs/api/stream#event-readable), entonces el stream comenzará a fluir de nuevo si hay un controlador de eventos [`'data'`](/es/nodejs/api/stream#event-data).


#### Tres estados {#three-states}

Los "dos modos" de operación para un stream `Readable` son una abstracción simplificada para la gestión de estado interno más complicada que ocurre dentro de la implementación del stream `Readable`.

Específicamente, en cualquier momento dado, cada `Readable` se encuentra en uno de tres estados posibles:

- `readable.readableFlowing === null`
- `readable.readableFlowing === false`
- `readable.readableFlowing === true`

Cuando `readable.readableFlowing` es `null`, no se proporciona ningún mecanismo para consumir los datos del stream. Por lo tanto, el stream no generará datos. Mientras esté en este estado, adjuntar un listener para el evento `'data'`, llamar al método `readable.pipe()` o llamar al método `readable.resume()` cambiará `readable.readableFlowing` a `true`, lo que hará que `Readable` comience a emitir activamente eventos a medida que se generan los datos.

Llamar a `readable.pause()`, `readable.unpipe()` o recibir contrapresión hará que `readable.readableFlowing` se establezca como `false`, deteniendo temporalmente el flujo de eventos, pero *no* deteniendo la generación de datos. Mientras esté en este estado, adjuntar un listener para el evento `'data'` no cambiará `readable.readableFlowing` a `true`.

```js [ESM]
const { PassThrough, Writable } = require('node:stream');
const pass = new PassThrough();
const writable = new Writable();

pass.pipe(writable);
pass.unpipe(writable);
// readableFlowing ahora es falso.

pass.on('data', (chunk) => { console.log(chunk.toString()); });
// readableFlowing sigue siendo falso.
pass.write('ok');  // No emitirá 'data'.
pass.resume();     // Debe llamarse para que el stream emita 'data'.
// readableFlowing ahora es verdadero.
```
Mientras `readable.readableFlowing` es `false`, los datos pueden estar acumulándose dentro del búfer interno del stream.

#### Elija un estilo de API {#choose-one-api-style}

La API del stream `Readable` evolucionó a través de múltiples versiones de Node.js y proporciona múltiples métodos para consumir datos de stream. En general, los desarrolladores deben elegir *uno* de los métodos para consumir datos y *nunca deben* usar múltiples métodos para consumir datos de un solo stream. Específicamente, usar una combinación de `on('data')`, `on('readable')`, `pipe()` o iteradores asíncronos podría conducir a un comportamiento poco intuitivo.


#### Clase: `stream.Readable` {#class-streamreadable}

**Añadida en: v0.9.4**

##### Evento: `'close'` {#event-close_1}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Se agregó la opción `emitClose` para especificar si se emite `'close'` en la destrucción. |
| v0.9.4 | Añadida en: v0.9.4 |
:::

El evento `'close'` se emite cuando el stream y cualquiera de sus recursos subyacentes (un descriptor de archivo, por ejemplo) se han cerrado. El evento indica que no se emitirán más eventos y que no se producirá más cálculo.

Un stream [`Readable`](/es/nodejs/api/stream#class-streamreadable) siempre emitirá el evento `'close'` si se crea con la opción `emitClose`.

##### Evento: `'data'` {#event-data}

**Añadida en: v0.9.4**

- `chunk` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) El fragmento de datos. Para los streams que no operan en modo objeto, el fragmento será una cadena o `Buffer`. Para los streams que están en modo objeto, el fragmento puede ser cualquier valor de JavaScript que no sea `null`.

El evento `'data'` se emite cada vez que el stream cede la propiedad de un fragmento de datos a un consumidor. Esto puede ocurrir siempre que el stream se cambie al modo de flujo llamando a `readable.pipe()`, `readable.resume()` o adjuntando una función de devolución de llamada de escucha al evento `'data'`. El evento `'data'` también se emitirá siempre que se llame al método `readable.read()` y haya un fragmento de datos disponible para ser devuelto.

Adjuntar un detector de eventos `'data'` a un stream que no se haya pausado explícitamente cambiará el stream al modo de flujo. Los datos se pasarán tan pronto como estén disponibles.

La función de devolución de llamada del listener recibirá el fragmento de datos como una cadena si se ha especificado una codificación predeterminada para el stream utilizando el método `readable.setEncoding()`; de lo contrario, los datos se pasarán como un `Buffer`.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Recibidos ${chunk.length} bytes de datos.`);
});
```

##### Evento: `'end'` {#event-end}

**Añadido en: v0.9.4**

El evento `'end'` se emite cuando no hay más datos para consumir desde el stream.

El evento `'end'` **no se emitirá** a menos que los datos se consuman por completo. Esto se puede lograr cambiando el stream al modo de flujo o llamando a [`stream.read()`](/es/nodejs/api/stream#readablereadsize) repetidamente hasta que se hayan consumido todos los datos.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
});
readable.on('end', () => {
  console.log('There will be no more data.');
});
```
##### Evento: `'error'` {#event-error_1}

**Añadido en: v0.9.4**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

El evento `'error'` puede ser emitido por una implementación de `Readable` en cualquier momento. Por lo general, esto puede ocurrir si el stream subyacente no puede generar datos debido a una falla interna subyacente, o cuando una implementación de stream intenta insertar un fragmento de datos no válido.

La función de callback del listener recibirá un solo objeto `Error`.

##### Evento: `'pause'` {#event-pause}

**Añadido en: v0.9.4**

El evento `'pause'` se emite cuando se llama a [`stream.pause()`](/es/nodejs/api/stream#readablepause) y `readableFlowing` no es `false`.

##### Evento: `'readable'` {#event-readable}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | El evento `'readable'` siempre se emite en el siguiente tick después de que se llama a `.push()`. |
| v10.0.0 | Usar `'readable'` requiere llamar a `.read()`. |
| v0.9.4 | Añadido en: v0.9.4 |
:::

El evento `'readable'` se emite cuando hay datos disponibles para ser leídos desde el stream, hasta la marca de agua alta configurada (`state.highWaterMark`). Efectivamente, indica que el stream tiene nueva información dentro del buffer. Si hay datos disponibles dentro de este buffer, se puede llamar a [`stream.read()`](/es/nodejs/api/stream#readablereadsize) para recuperar esos datos. Además, el evento `'readable'` también se puede emitir cuando se ha alcanzado el final del stream.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('readable', function() {
  // There is some data to read now.
  let data;

  while ((data = this.read()) !== null) {
    console.log(data);
  }
});
```
Si se ha alcanzado el final del stream, llamar a [`stream.read()`](/es/nodejs/api/stream#readablereadsize) devolverá `null` y activará el evento `'end'`. Esto también es cierto si nunca hubo datos para leer. Por ejemplo, en el siguiente ejemplo, `foo.txt` es un archivo vacío:

```js [ESM]
const fs = require('node:fs');
const rr = fs.createReadStream('foo.txt');
rr.on('readable', () => {
  console.log(`readable: ${rr.read()}`);
});
rr.on('end', () => {
  console.log('end');
});
```
La salida de ejecutar este script es:

```bash [BASH]
$ node test.js
readable: null
end
```
En algunos casos, adjuntar un listener para el evento `'readable'` hará que se lean algunos datos en un buffer interno.

En general, los mecanismos `readable.pipe()` y el evento `'data'` son más fáciles de entender que el evento `'readable'`. Sin embargo, manejar `'readable'` podría resultar en un mayor rendimiento.

Si tanto `'readable'` como [`'data'`](/es/nodejs/api/stream#event-data) se utilizan al mismo tiempo, `'readable'` tiene prioridad para controlar el flujo, es decir, `'data'` se emitirá solo cuando se llame a [`stream.read()`](/es/nodejs/api/stream#readablereadsize). La propiedad `readableFlowing` se volverá `false`. Si hay listeners de `'data'` cuando se elimina `'readable'`, el stream comenzará a fluir, es decir, los eventos `'data'` se emitirán sin llamar a `.resume()`.


##### Evento: `'resume'` {#event-resume}

**Agregado en: v0.9.4**

El evento `'resume'` se emite cuando se llama a [`stream.resume()`](/es/nodejs/api/stream#readableresume) y `readableFlowing` no es `true`.

##### `readable.destroy([error])` {#readabledestroyerror}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.0.0 | Funciona como una operación no-op en un stream que ya ha sido destruido. |
| v8.0.0 | Agregado en: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Error que se pasará como carga útil en el evento `'error'`
- Devuelve: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Destruye el stream. Opcionalmente, emite un evento `'error'` y emite un evento `'close'` (a menos que `emitClose` esté configurado en `false`). Después de esta llamada, el stream legible liberará cualquier recurso interno y las llamadas posteriores a `push()` se ignorarán.

Una vez que se ha llamado a `destroy()`, cualquier llamada adicional será una operación no-op y no se emitirán más errores que no sean de `_destroy()` como `'error'`.

Los implementadores no deben anular este método, sino implementar [`readable._destroy()`](/es/nodejs/api/stream#readable_destroyerr-callback).

##### `readable.closed` {#readableclosed}

**Agregado en: v18.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Es `true` después de que se haya emitido `'close'`.

##### `readable.destroyed` {#readabledestroyed}

**Agregado en: v8.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Es `true` después de que se haya llamado a [`readable.destroy()`](/es/nodejs/api/stream#readabledestroyerror).

##### `readable.isPaused()` {#readableispaused}

**Agregado en: v0.11.14**

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

El método `readable.isPaused()` devuelve el estado operativo actual de `Readable`. Esto lo utiliza principalmente el mecanismo que subyace al método `readable.pipe()`. En la mayoría de los casos típicos, no habrá ninguna razón para utilizar este método directamente.

```js [ESM]
const readable = new stream.Readable();

readable.isPaused(); // === false
readable.pause();
readable.isPaused(); // === true
readable.resume();
readable.isPaused(); // === false
```


##### `readable.pause()` {#readablepause}

**Agregado en: v0.9.4**

- Devuelve: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

El método `readable.pause()` hará que un stream en modo flujo deje de emitir eventos [`'data'`](/es/nodejs/api/stream#event-data), saliendo del modo flujo. Cualquier dato que esté disponible permanecerá en el búfer interno.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Recibidos ${chunk.length} bytes de datos.`);
  readable.pause();
  console.log('No habrá datos adicionales durante 1 segundo.');
  setTimeout(() => {
    console.log('Ahora los datos comenzarán a fluir de nuevo.');
    readable.resume();
  }, 1000);
});
```
El método `readable.pause()` no tiene ningún efecto si hay un listener de evento `'readable'`.

##### `readable.pipe(destination[, options])` {#readablepipedestination-options}

**Agregado en: v0.9.4**

- `destination` [\<stream.Writable\>](/es/nodejs/api/stream#class-streamwritable) El destino para escribir datos
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones de pipe
    - `end` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Finaliza el escritor cuando el lector termina. **Predeterminado:** `true`.
  
 
- Devuelve: [\<stream.Writable\>](/es/nodejs/api/stream#class-streamwritable) El *destino*, permitiendo una cadena de pipes si es un stream [`Duplex`](/es/nodejs/api/stream#class-streamduplex) o [`Transform`](/es/nodejs/api/stream#class-streamtransform)

El método `readable.pipe()` adjunta un stream [`Writable`](/es/nodejs/api/stream#class-streamwritable) al `readable`, haciendo que cambie automáticamente al modo flujo y envíe todos sus datos al [`Writable`](/es/nodejs/api/stream#class-streamwritable) adjunto. El flujo de datos se gestionará automáticamente para que el stream `Writable` de destino no se vea sobrecargado por un stream `Readable` más rápido.

El siguiente ejemplo canaliza todos los datos de `readable` a un archivo llamado `file.txt`:

```js [ESM]
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// Todos los datos de readable van a 'file.txt'.
readable.pipe(writable);
```
Es posible adjuntar múltiples streams `Writable` a un único stream `Readable`.

El método `readable.pipe()` devuelve una referencia al stream *destino*, lo que permite configurar cadenas de streams canalizados:

```js [ESM]
const fs = require('node:fs');
const zlib = require('node:zlib');
const r = fs.createReadStream('file.txt');
const z = zlib.createGzip();
const w = fs.createWriteStream('file.txt.gz');
r.pipe(z).pipe(w);
```
Por defecto, [`stream.end()`](/es/nodejs/api/stream#writableendchunk-encoding-callback) se llama en el stream `Writable` de destino cuando el stream `Readable` de origen emite [`'end'`](/es/nodejs/api/stream#event-end), de modo que el destino ya no es escribible. Para desactivar este comportamiento predeterminado, la opción `end` se puede pasar como `false`, lo que hace que el stream de destino permanezca abierto:

```js [ESM]
reader.pipe(writer, { end: false });
reader.on('end', () => {
  writer.end('Goodbye\n');
});
```
Una advertencia importante es que si el stream `Readable` emite un error durante el procesamiento, el destino `Writable` *no se cierra* automáticamente. Si se produce un error, será necesario cerrar *manualmente* cada stream para evitar fugas de memoria.

Los streams `Writable` [`process.stderr`](/es/nodejs/api/process#processstderr) y [`process.stdout`](/es/nodejs/api/process#processstdout) nunca se cierran hasta que el proceso de Node.js finaliza, independientemente de las opciones especificadas.


##### `readable.read([size])` {#readablereadsize}

**Agregado en: v0.9.4**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Argumento opcional para especificar cuántos datos leer.
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

El método `readable.read()` lee datos del buffer interno y los devuelve. Si no hay datos disponibles para leer, se devuelve `null`. Por defecto, los datos se devuelven como un objeto `Buffer` a menos que se haya especificado una codificación utilizando el método `readable.setEncoding()` o el stream esté operando en modo objeto.

El argumento opcional `size` especifica un número específico de bytes para leer. Si no hay `size` bytes disponibles para leer, se devolverá `null` *a menos que* el stream haya terminado, en cuyo caso se devolverán todos los datos restantes en el buffer interno.

Si no se especifica el argumento `size`, se devolverán todos los datos contenidos en el buffer interno.

El argumento `size` debe ser menor o igual a 1 GiB.

El método `readable.read()` solo debe llamarse en streams `Readable` que operan en modo pausado. En modo fluido, `readable.read()` se llama automáticamente hasta que el buffer interno esté completamente vacío.

```js [ESM]
const readable = getReadableStreamSomehow();

// 'readable' puede ser activado varias veces a medida que los datos se almacenan en el buffer
readable.on('readable', () => {
  let chunk;
  console.log('Stream es legible (nuevos datos recibidos en buffer)');
  // Usar un bucle para asegurar que leemos todos los datos disponibles actualmente
  while (null !== (chunk = readable.read())) {
    console.log(`Leídos ${chunk.length} bytes de datos...`);
  }
});

// 'end' será activado una vez cuando no haya más datos disponibles
readable.on('end', () => {
  console.log('Se ha alcanzado el final del stream.');
});
```
Cada llamada a `readable.read()` devuelve un fragmento de datos o `null`, lo que indica que no hay más datos para leer en ese momento. Estos fragmentos no se concatenan automáticamente. Debido a que una sola llamada a `read()` no devuelve todos los datos, el uso de un bucle while puede ser necesario para leer continuamente los fragmentos hasta que se recuperen todos los datos. Al leer un archivo grande, `.read()` podría devolver `null` temporalmente, lo que indica que ha consumido todo el contenido almacenado en el buffer, pero puede haber más datos aún por almacenar en el buffer. En tales casos, se emite un nuevo evento `'readable'` una vez que hay más datos en el buffer, y el evento `'end'` indica el final de la transmisión de datos.

Por lo tanto, para leer el contenido completo de un archivo desde un `readable`, es necesario recopilar fragmentos a través de múltiples eventos `'readable'`:

```js [ESM]
const chunks = [];

readable.on('readable', () => {
  let chunk;
  while (null !== (chunk = readable.read())) {
    chunks.push(chunk);
  }
});

readable.on('end', () => {
  const content = chunks.join('');
});
```
Un stream `Readable` en modo objeto siempre devolverá un solo elemento de una llamada a [`readable.read(size)`](/es/nodejs/api/stream#readablereadsize), independientemente del valor del argumento `size`.

Si el método `readable.read()` devuelve un fragmento de datos, también se emitirá un evento `'data'`.

Llamar a [`stream.read([size])`](/es/nodejs/api/stream#readablereadsize) después de que se haya emitido el evento [`'end'`](/es/nodejs/api/stream#event-end) devolverá `null`. No se producirá ningún error en tiempo de ejecución.


##### `readable.readable` {#readablereadable}

**Agregado en: v11.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Es `true` si es seguro llamar a [`readable.read()`](/es/nodejs/api/stream#readablereadsize), lo que significa que el stream no ha sido destruido o emitido `'error'` o `'end'`.

##### `readable.readableAborted` {#readablereadableaborted}

**Agregado en: v16.8.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve si el stream fue destruido o tuvo un error antes de emitir `'end'`.

##### `readable.readableDidRead` {#readablereadabledidread}

**Agregado en: v16.7.0, v14.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve si `'data'` ha sido emitido.

##### `readable.readableEncoding` {#readablereadableencoding}

**Agregado en: v12.7.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Getter para la propiedad `encoding` de un stream `Readable` dado. La propiedad `encoding` se puede establecer utilizando el método [`readable.setEncoding()`](/es/nodejs/api/stream#readablesetencodingencoding).

##### `readable.readableEnded` {#readablereadableended}

**Agregado en: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se convierte en `true` cuando el evento [`'end'`](/es/nodejs/api/stream#event-end) es emitido.

##### `readable.errored` {#readableerrored}

**Agregado en: v18.0.0**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Devuelve el error si el stream ha sido destruido con un error.

##### `readable.readableFlowing` {#readablereadableflowing}

**Agregado en: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Esta propiedad refleja el estado actual de un stream `Readable` como se describe en la sección [Tres estados](/es/nodejs/api/stream#three-states).


##### `readable.readableHighWaterMark` {#readablereadablehighwatermark}

**Agregado en: v9.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Devuelve el valor de `highWaterMark` pasado al crear este `Readable`.

##### `readable.readableLength` {#readablereadablelength}

**Agregado en: v9.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Esta propiedad contiene el número de bytes (u objetos) en la cola listos para ser leídos. El valor proporciona datos de introspección con respecto al estado de `highWaterMark`.

##### `readable.readableObjectMode` {#readablereadableobjectmode}

**Agregado en: v12.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Getter para la propiedad `objectMode` de un stream `Readable` dado.

##### `readable.resume()` {#readableresume}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | `resume()` no tiene efecto si hay un listener de evento `'readable'`. |
| v0.9.4 | Agregado en: v0.9.4 |
:::

- Devuelve: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

El método `readable.resume()` hace que un stream `Readable` explícitamente pausado reanude la emisión de eventos [`'data'`](/es/nodejs/api/stream#event-data), cambiando el stream al modo de flujo.

El método `readable.resume()` se puede utilizar para consumir completamente los datos de un stream sin procesar realmente ninguno de esos datos:

```js [ESM]
getReadableStreamSomehow()
  .resume()
  .on('end', () => {
    console.log('Llegó al final, pero no leyó nada.');
  });
```
El método `readable.resume()` no tiene efecto si hay un listener de evento `'readable'`.

##### `readable.setEncoding(encoding)` {#readablesetencodingencoding}

**Agregado en: v0.9.4**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codificación a utilizar.
- Devuelve: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

El método `readable.setEncoding()` establece la codificación de caracteres para los datos leídos del stream `Readable`.

Por defecto, no se asigna ninguna codificación y los datos del stream se devolverán como objetos `Buffer`. Establecer una codificación hace que los datos del stream se devuelvan como cadenas de la codificación especificada en lugar de como objetos `Buffer`. Por ejemplo, llamar a `readable.setEncoding('utf8')` hará que los datos de salida se interpreten como datos UTF-8 y se pasen como cadenas. Llamar a `readable.setEncoding('hex')` hará que los datos se codifiquen en formato de cadena hexadecimal.

El stream `Readable` manejará correctamente los caracteres multibyte entregados a través del stream que de otro modo se decodificarían incorrectamente si simplemente se extrajeran del stream como objetos `Buffer`.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.setEncoding('utf8');
readable.on('data', (chunk) => {
  assert.equal(typeof chunk, 'string');
  console.log('Obtuve %d caracteres de datos de cadena:', chunk.length);
});
```

##### `readable.unpipe([destination])` {#readableunpipedestination}

**Añadido en: v0.9.4**

- `destination` [\<stream.Writable\>](/es/nodejs/api/stream#class-streamwritable) Stream específico opcional para desconectar.
- Devuelve: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

El método `readable.unpipe()` separa un stream `Writable` adjuntado previamente usando el método [`stream.pipe()`](/es/nodejs/api/stream#readablepipedestination-options).

Si no se especifica `destination`, entonces *todas* las tuberías se separan.

Si se especifica `destination`, pero no se ha configurado ninguna tubería para él, entonces el método no hace nada.

```js [ESM]
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// Todos los datos de readable van a 'file.txt',
// pero solo durante el primer segundo.
readable.pipe(writable);
setTimeout(() => {
  console.log('Dejar de escribir en file.txt.');
  readable.unpipe(writable);
  console.log('Cerrar manualmente el stream de archivo.');
  writable.end();
}, 1000);
```
##### `readable.unshift(chunk[, encoding])` {#readableunshiftchunk-encoding}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.0.0, v20.13.0 | El argumento `chunk` ahora puede ser una instancia de `TypedArray` o `DataView`. |
| v8.0.0 | El argumento `chunk` ahora puede ser una instancia de `Uint8Array`. |
| v0.9.11 | Añadido en: v0.9.11 |
:::

- `chunk` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Fragmento de datos para agregar al principio de la cola de lectura. Para streams que no operan en modo objeto, `chunk` debe ser un [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/es/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) o `null`. Para streams en modo objeto, `chunk` puede ser cualquier valor de JavaScript.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Codificación de fragmentos de string. Debe ser una codificación `Buffer` válida, como `'utf8'` o `'ascii'`.

Pasar `chunk` como `null` señala el final del stream (EOF) y se comporta igual que `readable.push(null)`, después de lo cual no se pueden escribir más datos. La señal EOF se coloca al final del búfer y cualquier dato almacenado en el búfer aún se vaciará.

El método `readable.unshift()` vuelve a insertar un fragmento de datos en el búfer interno. Esto es útil en ciertas situaciones donde un stream está siendo consumido por código que necesita "des-consumir" una cierta cantidad de datos que ha extraído optimísticamente de la fuente, para que los datos puedan ser pasados a otra parte.

El método `stream.unshift(chunk)` no puede ser llamado después de que el evento [`'end'`](/es/nodejs/api/stream#event-end) haya sido emitido o se lanzará un error en tiempo de ejecución.

Los desarrolladores que usan `stream.unshift()` a menudo deberían considerar cambiar a usar un stream [`Transform`](/es/nodejs/api/stream#class-streamtransform) en su lugar. Consulte la sección [API para implementadores de streams](/es/nodejs/api/stream#api-for-stream-implementers) para obtener más información.

```js [ESM]
// Extraer un encabezado delimitado por \n\n.
// Usar unshift() si obtenemos demasiado.
// Llamar al callback con (error, header, stream).
const { StringDecoder } = require('node:string_decoder');
function parseHeader(stream, callback) {
  stream.on('error', callback);
  stream.on('readable', onReadable);
  const decoder = new StringDecoder('utf8');
  let header = '';
  function onReadable() {
    let chunk;
    while (null !== (chunk = stream.read())) {
      const str = decoder.write(chunk);
      if (str.includes('\n\n')) {
        // Se encontró el límite del encabezado.
        const split = str.split(/\n\n/);
        header += split.shift();
        const remaining = split.join('\n\n');
        const buf = Buffer.from(remaining, 'utf8');
        stream.removeListener('error', callback);
        // Eliminar el listener 'readable' antes de usar unshift.
        stream.removeListener('readable', onReadable);
        if (buf.length)
          stream.unshift(buf);
        // Ahora el cuerpo del mensaje puede ser leído desde el stream.
        callback(null, header, stream);
        return;
      }
      // Aún leyendo el encabezado.
      header += str;
    }
  }
}
```
A diferencia de [`stream.push(chunk)`](/es/nodejs/api/stream#readablepushchunk-encoding), `stream.unshift(chunk)` no terminará el proceso de lectura restableciendo el estado de lectura interno del stream. Esto puede causar resultados inesperados si `readable.unshift()` se llama durante una lectura (es decir, desde dentro de una implementación [`stream._read()`](/es/nodejs/api/stream#readable_readsize) en un stream personalizado). Seguir la llamada a `readable.unshift()` con un [`stream.push('')`](/es/nodejs/api/stream#readablepushchunk-encoding) inmediato restablecerá el estado de lectura apropiadamente, sin embargo, es mejor simplemente evitar llamar a `readable.unshift()` mientras se está realizando una lectura.


##### `readable.wrap(stream)` {#readablewrapstream}

**Añadido en: v0.9.4**

- `stream` [\<Stream\>](/es/nodejs/api/stream#stream) Un flujo legible de "estilo antiguo"
- Devuelve: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Antes de Node.js 0.10, los flujos no implementaban la API completa del módulo `node:stream` tal como se define actualmente. (Consulte [Compatibilidad](/es/nodejs/api/stream#compatibility-with-older-nodejs-versions) para obtener más información).

Cuando se utiliza una biblioteca Node.js más antigua que emite eventos [`'data'`](/es/nodejs/api/stream#event-data) y tiene un método [`stream.pause()`](/es/nodejs/api/stream#readablepause) que es solo orientativo, el método `readable.wrap()` se puede utilizar para crear un flujo [`Readable`](/es/nodejs/api/stream#class-streamreadable) que utiliza el flujo antiguo como su fuente de datos.

Rara vez será necesario utilizar `readable.wrap()`, pero el método se ha proporcionado como una conveniencia para interactuar con aplicaciones y bibliotecas Node.js más antiguas.

```js [ESM]
const { OldReader } = require('./old-api-module.js');
const { Readable } = require('node:stream');
const oreader = new OldReader();
const myReader = new Readable().wrap(oreader);

myReader.on('readable', () => {
  myReader.read(); // etc.
});
```
##### `readable[Symbol.asyncIterator]()` {#readablesymbolasynciterator}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v11.14.0 | El soporte de Symbol.asyncIterator ya no es experimental. |
| v10.0.0 | Añadido en: v10.0.0 |
:::

- Devuelve: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) para consumir completamente el flujo.

```js [ESM]
const fs = require('node:fs');

async function print(readable) {
  readable.setEncoding('utf8');
  let data = '';
  for await (const chunk of readable) {
    data += chunk;
  }
  console.log(data);
}

print(fs.createReadStream('file')).catch(console.error);
```
Si el bucle termina con un `break`, `return` o un `throw`, el flujo se destruirá. En otras palabras, iterar sobre un flujo consumirá el flujo por completo. El flujo se leerá en fragmentos de tamaño igual a la opción `highWaterMark`. En el ejemplo de código anterior, los datos estarán en un solo fragmento si el archivo tiene menos de 64 KiB de datos porque no se proporciona ninguna opción `highWaterMark` a [`fs.createReadStream()`](/es/nodejs/api/fs#fscreatereadstreampath-options).


##### `readable[Symbol.asyncDispose]()` {#readablesymbolasyncdispose}

**Añadido en: v20.4.0, v18.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Llama a [`readable.destroy()`](/es/nodejs/api/stream#readabledestroyerror) con un `AbortError` y devuelve una promesa que se cumple cuando el stream finaliza.

##### `readable.compose(stream[, options])` {#readablecomposestream-options}

**Añadido en: v19.1.0, v18.13.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `stream` [\<Stream\>](/es/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) permite destruir el stream si la señal es abortada.
  
 
- Devuelve: [\<Duplex\>](/es/nodejs/api/stream#class-streamduplex) un stream compuesto con el stream `stream`.

```js [ESM]
import { Readable } from 'node:stream';

async function* splitToWords(source) {
  for await (const chunk of source) {
    const words = String(chunk).split(' ');

    for (const word of words) {
      yield word;
    }
  }
}

const wordsStream = Readable.from(['this is', 'compose as operator']).compose(splitToWords);
const words = await wordsStream.toArray();

console.log(words); // prints ['this', 'is', 'compose', 'as', 'operator']
```
Consulte [`stream.compose`](/es/nodejs/api/stream#streamcomposestreams) para obtener más información.

##### `readable.iterator([options])` {#readableiteratoroptions}

**Añadido en: v16.3.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `destroyOnReturn` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando se establece en `false`, llamar a `return` en el iterador asíncrono, o salir de una iteración `for await...of` usando un `break`, `return` o `throw` no destruirá el stream. **Predeterminado:** `true`.
  
 
- Devuelve: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) para consumir el stream.

El iterador creado por este método ofrece a los usuarios la opción de cancelar la destrucción del stream si el bucle `for await...of` se cierra con `return`, `break` o `throw`, o si el iterador debe destruir el stream si el stream emitió un error durante la iteración.

```js [ESM]
const { Readable } = require('node:stream');

async function printIterator(readable) {
  for await (const chunk of readable.iterator({ destroyOnReturn: false })) {
    console.log(chunk); // 1
    break;
  }

  console.log(readable.destroyed); // false

  for await (const chunk of readable.iterator({ destroyOnReturn: false })) {
    console.log(chunk); // Will print 2 and then 3
  }

  console.log(readable.destroyed); // True, stream was totally consumed
}

async function printSymbolAsyncIterator(readable) {
  for await (const chunk of readable) {
    console.log(chunk); // 1
    break;
  }

  console.log(readable.destroyed); // true
}

async function showBoth() {
  await printIterator(Readable.from([1, 2, 3]));
  await printSymbolAsyncIterator(Readable.from([1, 2, 3]));
}

showBoth();
```

##### `readable.map(fn[, options])` {#readablemapfn-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.7.0, v18.19.0 | se añadió `highWaterMark` en las opciones. |
| v17.4.0, v16.14.0 | Añadido en: v17.4.0, v16.14.0 |
:::

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) una función para mapear cada fragmento en el stream.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) un fragmento de datos del stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) abortado si el stream se destruye permitiendo abortar la llamada `fn` anticipadamente.

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) la invocación concurrente máxima de `fn` para llamar en el stream a la vez. **Predeterminado:** `1`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) cuántos elementos almacenar en búfer mientras se espera el consumo del usuario de los elementos mapeados. **Predeterminado:** `concurrency * 2 - 1`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) permite destruir el stream si la señal se aborta.

- Devuelve: [\<Readable\>](/es/nodejs/api/stream#class-streamreadable) un stream mapeado con la función `fn`.

Este método permite mapear sobre el stream. La función `fn` se llamará para cada fragmento en el stream. Si la función `fn` devuelve una promesa, esa promesa será `await` antes de ser pasada al stream de resultados.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// Con un mapeador síncrono.
for await (const chunk of Readable.from([1, 2, 3, 4]).map((x) => x * 2)) {
  console.log(chunk); // 2, 4, 6, 8
}
// Con un mapeador asíncrono, haciendo como máximo 2 consultas a la vez.
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map((domain) => resolver.resolve4(domain), { concurrency: 2 });
for await (const result of dnsResults) {
  console.log(result); // Registra el resultado DNS de resolver.resolve4.
}
```

##### `readable.filter(fn[, options])` {#readablefilterfn-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.7.0, v18.19.0 | se agregó `highWaterMark` en las opciones. |
| v17.4.0, v16.14.0 | Agregado en: v17.4.0, v16.14.0 |
:::

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) una función para filtrar fragmentos del stream.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) un fragmento de datos del stream.
    - `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) abortado si el stream se destruye permitiendo abortar la llamada a `fn` anticipadamente.
  
 
  
 
- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) la invocación concurrente máxima de `fn` a llamar en el stream a la vez. **Predeterminado:** `1`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) cuántos elementos almacenar en el búfer mientras se espera el consumo del usuario de los elementos filtrados. **Predeterminado:** `concurrency * 2 - 1`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) permite destruir el stream si la señal se aborta.
  
 
- Devuelve: [\<Readable\>](/es/nodejs/api/stream#class-streamreadable) un stream filtrado con el predicado `fn`.

Este método permite filtrar el stream. Para cada fragmento en el stream, se llamará a la función `fn` y, si devuelve un valor verdadero, el fragmento se pasará al stream de resultados. Si la función `fn` devuelve una promesa, esa promesa será `await`ed.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// Con un predicado sincrónico.
for await (const chunk of Readable.from([1, 2, 3, 4]).filter((x) => x > 2)) {
  console.log(chunk); // 3, 4
}
// Con un predicado asíncrono, haciendo como máximo 2 consultas a la vez.
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).filter(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address.ttl > 60;
}, { concurrency: 2 });
for await (const result of dnsResults) {
  // Registra dominios con más de 60 segundos en el registro dns resuelto.
  console.log(result);
}
```

##### `readable.forEach(fn[, options])` {#readableforeachfn-options}

**Añadido en: v17.5.0, v16.15.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) una función para llamar en cada fragmento del stream.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) un fragmento de datos del stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) abortado si el stream se destruye permitiendo abortar la llamada a `fn` anticipadamente.




- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) la invocación concurrente máxima de `fn` a llamar en el stream a la vez. **Predeterminado:** `1`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) permite destruir el stream si la señal es abortada.


- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) una promesa para cuando el stream haya terminado.

Este método permite iterar un stream. Por cada fragmento en el stream, la función `fn` será llamada. Si la función `fn` devuelve una promesa - esa promesa será `await`ed.

Este método es diferente de los bucles `for await...of` en que puede procesar opcionalmente fragmentos concurrentemente. Además, una iteración `forEach` solo puede ser detenida habiendo pasado una opción `signal` y abortando el `AbortController` relacionado mientras que `for await...of` puede ser detenido con `break` o `return`. En cualquier caso, el stream será destruido.

Este método es diferente de escuchar al evento [`'data'`](/es/nodejs/api/stream#event-data) en que usa el evento [`readable`](/es/nodejs/api/stream#class-streamreadable) en la maquinaria subyacente y puede limitar el número de llamadas concurrentes a `fn`.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// Con un predicado sincrónico.
for await (const chunk of Readable.from([1, 2, 3, 4]).filter((x) => x > 2)) {
  console.log(chunk); // 3, 4
}
// Con un predicado asíncrono, haciendo como máximo 2 consultas a la vez.
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address;
}, { concurrency: 2 });
await dnsResults.forEach((result) => {
  // Registra el resultado, similar a `for await (const result of dnsResults)`
  console.log(result);
});
console.log('done'); // El stream ha terminado
```

##### `readable.toArray([options])` {#readabletoarrayoptions}

**Añadido en: v17.5.0, v16.15.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) permite cancelar la operación toArray si la señal se aborta.


- Devuelve: [\<Promesa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) una promesa que contiene una matriz con el contenido del flujo.

Este método permite obtener fácilmente el contenido de un flujo.

Como este método lee todo el flujo en la memoria, niega los beneficios de los flujos. Está destinado a la interoperabilidad y la comodidad, no como la forma principal de consumir flujos.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

await Readable.from([1, 2, 3, 4]).toArray(); // [1, 2, 3, 4]

// Realizar consultas DNS simultáneamente usando .map y recolectar
// los resultados en una matriz usando toArray
const dnsResults = await Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address;
}, { concurrency: 2 }).toArray();
```
##### `readable.some(fn[, options])` {#readablesomefn-options}

**Añadido en: v17.5.0, v16.15.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) una función para llamar en cada fragmento del flujo.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) un fragmento de datos del flujo.
    - `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) abortado si se destruye el flujo permitiendo abortar la llamada `fn` anticipadamente.



- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) la invocación concurrente máxima de `fn` para llamar en el flujo a la vez. **Predeterminado:** `1`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) permite destruir el flujo si la señal se aborta.


- Devuelve: [\<Promesa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) una promesa que evalúa a `true` si `fn` devolvió un valor verdadero para al menos uno de los fragmentos.

Este método es similar a `Array.prototype.some` y llama a `fn` en cada fragmento del flujo hasta que el valor de retorno esperado sea `true` (o cualquier valor verdadero). Una vez que una llamada `fn` en un fragmento que esperaba el valor de retorno es verdadero, el flujo se destruye y la promesa se cumple con `true`. Si ninguna de las llamadas `fn` en los fragmentos devuelve un valor verdadero, la promesa se cumple con `false`.

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// Con un predicado síncrono.
await Readable.from([1, 2, 3, 4]).some((x) => x > 2); // true
await Readable.from([1, 2, 3, 4]).some((x) => x < 0); // false

// Con un predicado asíncrono, haciendo como máximo 2 comprobaciones de archivos a la vez.
const anyBigFile = await Readable.from([
  'file1',
  'file2',
  'file3',
]).some(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
console.log(anyBigFile); // `true` si algún archivo en la lista es mayor que 1MB
console.log('done'); // El flujo ha terminado
```

##### `readable.find(fn[, options])` {#readablefindfn-options}

**Agregado en: v17.5.0, v16.17.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) una función para llamar en cada fragmento del stream.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) un fragmento de datos del stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) abortado si el stream es destruido permitiendo abortar la llamada a `fn` anticipadamente.




- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) la invocación concurrente máxima de `fn` para llamar en el stream a la vez. **Predeterminado:** `1`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) permite destruir el stream si la señal es abortada.


- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) una promesa que evalúa al primer fragmento para el cual `fn` evaluó con un valor truthy, o `undefined` si no se encontró ningún elemento.

Este método es similar a `Array.prototype.find` y llama a `fn` en cada fragmento del stream para encontrar un fragmento con un valor truthy para `fn`. Una vez que el valor de retorno esperado de una llamada a `fn` es truthy, el stream es destruido y la promesa se cumple con el valor para el cual `fn` devolvió un valor truthy. Si todas las llamadas a `fn` en los fragmentos devuelven un valor falsy, la promesa se cumple con `undefined`.

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// Con un predicado síncrono.
await Readable.from([1, 2, 3, 4]).find((x) => x > 2); // 3
await Readable.from([1, 2, 3, 4]).find((x) => x > 0); // 1
await Readable.from([1, 2, 3, 4]).find((x) => x > 10); // undefined

// Con un predicado asíncrono, haciendo como máximo 2 comprobaciones de archivos a la vez.
const foundBigFile = await Readable.from([
  'file1',
  'file2',
  'file3',
]).find(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
console.log(foundBigFile); // Nombre de archivo del archivo grande, si algún archivo en la lista es más grande que 1MB
console.log('done'); // El stream ha finalizado
```

##### `readable.every(fn[, options])` {#readableeveryfn-options}

**Agregado en: v17.5.0, v16.15.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) una función a llamar en cada fragmento del flujo.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) un fragmento de datos del flujo.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) abortado si el flujo se destruye, lo que permite abortar la llamada `fn` anticipadamente.

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) el número máximo de invocaciones simultáneas de `fn` para llamar en el flujo a la vez. **Predeterminado:** `1`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) permite destruir el flujo si la señal se aborta.

- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) una promesa que se evalúa como `true` si `fn` devolvió un valor verdadero para todos los fragmentos.

Este método es similar a `Array.prototype.every` y llama a `fn` en cada fragmento del flujo para verificar si todos los valores de retorno esperados son un valor verdadero para `fn`. Una vez que una llamada `fn` en un valor de retorno esperado de un fragmento es falso, el flujo se destruye y la promesa se cumple con `false`. Si todas las llamadas `fn` en los fragmentos devuelven un valor verdadero, la promesa se cumple con `true`.

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// Con un predicado síncrono.
await Readable.from([1, 2, 3, 4]).every((x) => x > 2); // false
await Readable.from([1, 2, 3, 4]).every((x) => x > 0); // true

// Con un predicado asíncrono, haciendo como máximo 2 comprobaciones de archivos a la vez.
const allBigFiles = await Readable.from([
  'file1',
  'file2',
  'file3',
]).every(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
// `true` si todos los archivos de la lista son más grandes que 1MiB
console.log(allBigFiles);
console.log('done'); // El flujo ha terminado
```

##### `readable.flatMap(fn[, options])` {#readableflatmapfn-options}

**Añadido en: v17.5.0, v16.15.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncGeneratorFunction\>](https://tc39.es/proposal-async-iteration/#sec-asyncgeneratorfunction-constructor) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) una función para mapear cada fragmento en el stream.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) un fragmento de datos del stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) abortada si el stream es destruido permitiendo abortar la llamada a `fn` anticipadamente.




- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) la invocación concurrente máxima de `fn` para llamar en el stream a la vez. **Predeterminado:** `1`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) permite destruir el stream si la señal es abortada.


- Devuelve: [\<Readable\>](/es/nodejs/api/stream#class-streamreadable) un stream mapeado de forma plana con la función `fn`.

Este método devuelve un nuevo stream aplicando la retrollamada dada a cada fragmento del stream y luego aplanando el resultado.

Es posible devolver un stream u otro iterable o async iterable desde `fn` y los streams de resultado serán fusionados (aplanados) en el stream devuelto.

```js [ESM]
import { Readable } from 'node:stream';
import { createReadStream } from 'node:fs';

// Con un mapper síncrono.
for await (const chunk of Readable.from([1, 2, 3, 4]).flatMap((x) => [x, x])) {
  console.log(chunk); // 1, 1, 2, 2, 3, 3, 4, 4
}
// Con un mapper asíncrono, combina los contenidos de 4 archivos
const concatResult = Readable.from([
  './1.mjs',
  './2.mjs',
  './3.mjs',
  './4.mjs',
]).flatMap((fileName) => createReadStream(fileName));
for await (const result of concatResult) {
  // Esto contendrá los contenidos (todos los fragmentos) de los 4 archivos
  console.log(result);
}
```

##### `readable.drop(limit[, options])` {#readabledroplimit-options}

**Añadido en: v17.5.0, v16.15.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `limit` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) el número de fragmentos a descartar del readable.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) permite destruir el stream si la señal es abortada.


- Devuelve: [\<Readable\>](/es/nodejs/api/stream#class-streamreadable) un stream con `limit` fragmentos descartados.

Este método devuelve un nuevo stream con los primeros `limit` fragmentos descartados.

```js [ESM]
import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).drop(2).toArray(); // [3, 4]
```
##### `readable.take(limit[, options])` {#readabletakelimit-options}

**Añadido en: v17.5.0, v16.15.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `limit` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) el número de fragmentos a tomar del readable.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) permite destruir el stream si la señal es abortada.


- Devuelve: [\<Readable\>](/es/nodejs/api/stream#class-streamreadable) un stream con `limit` fragmentos tomados.

Este método devuelve un nuevo stream con los primeros `limit` fragmentos.

```js [ESM]
import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).take(2).toArray(); // [1, 2]
```
##### `readable.reduce(fn[, initial[, options]])` {#readablereducefn-initial-options}

**Añadido en: v17.5.0, v16.15.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) una función reductora para llamar sobre cada fragmento en el stream.
    - `previous` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) el valor obtenido de la última llamada a `fn` o el valor `initial` si se especifica o el primer fragmento del stream de lo contrario.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) un fragmento de datos del stream.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) abortado si el stream es destruido permitiendo abortar la llamada `fn` anticipadamente.



- `initial` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) el valor inicial para usar en la reducción.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) permite destruir el stream si la señal es abortada.


- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) una promesa para el valor final de la reducción.

Este método llama a `fn` en cada fragmento del stream en orden, pasándole el resultado del cálculo en el elemento anterior. Devuelve una promesa para el valor final de la reducción.

Si no se proporciona ningún valor `initial`, el primer fragmento del stream se utiliza como valor inicial. Si el stream está vacío, la promesa se rechaza con un `TypeError` con la propiedad de código `ERR_INVALID_ARGS`.

```js [ESM]
import { Readable } from 'node:stream';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const directoryPath = './src';
const filesInDir = await readdir(directoryPath);

const folderSize = await Readable.from(filesInDir)
  .reduce(async (totalSize, file) => {
    const { size } = await stat(join(directoryPath, file));
    return totalSize + size;
  }, 0);

console.log(folderSize);
```
La función reductora itera el stream elemento por elemento, lo que significa que no hay ningún parámetro `concurrency` o paralelismo. Para realizar una `reduce` concurrentemente, puede extraer la función async al método [`readable.map`](/es/nodejs/api/stream#readablemapfn-options).

```js [ESM]
import { Readable } from 'node:stream';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const directoryPath = './src';
const filesInDir = await readdir(directoryPath);

const folderSize = await Readable.from(filesInDir)
  .map((file) => stat(join(directoryPath, file)), { concurrency: 2 })
  .reduce((totalSize, { size }) => totalSize + size, 0);

console.log(folderSize);
```

### Streams dúplex y de transformación {#duplex-and-transform-streams}

#### Clase: `stream.Duplex` {#class-streamduplex}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.8.0 | Las instancias de `Duplex` ahora devuelven `true` al comprobar `instanceof stream.Writable`. |
| v0.9.4 | Agregado en: v0.9.4 |
:::

Los streams dúplex son streams que implementan ambas interfaces, [`Readable`](/es/nodejs/api/stream#class-streamreadable) y [`Writable`](/es/nodejs/api/stream#class-streamwritable).

Ejemplos de streams `Duplex` incluyen:

- [Sockets TCP](/es/nodejs/api/net#class-netsocket)
- [Streams zlib](/es/nodejs/api/zlib)
- [Streams criptográficos](/es/nodejs/api/crypto)

##### `duplex.allowHalfOpen` {#duplexallowhalfopen}

**Agregado en: v0.9.4**

- [\<boolean\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

Si es `false`, entonces el stream finalizará automáticamente el lado de escritura cuando finalice el lado de lectura. Se establece inicialmente mediante la opción del constructor `allowHalfOpen`, que por defecto es `true`.

Esto se puede cambiar manualmente para modificar el comportamiento semiabierto de una instancia de stream `Duplex` existente, pero se debe cambiar antes de que se emita el evento `'end'`.

#### Clase: `stream.Transform` {#class-streamtransform}

**Agregado en: v0.9.4**

Los streams de transformación son streams [`Duplex`](/es/nodejs/api/stream#class-streamduplex) donde la salida está relacionada de alguna manera con la entrada. Como todos los streams [`Duplex`](/es/nodejs/api/stream#class-streamduplex), los streams `Transform` implementan tanto la interfaz [`Readable`](/es/nodejs/api/stream#class-streamreadable) como la [`Writable`](/es/nodejs/api/stream#class-streamwritable).

Ejemplos de streams `Transform` incluyen:

- [Streams zlib](/es/nodejs/api/zlib)
- [Streams criptográficos](/es/nodejs/api/crypto)

##### `transform.destroy([error])` {#transformdestroyerror}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.0.0 | Funciona como una operación no válida en un stream que ya ha sido destruido. |
| v8.0.0 | Agregado en: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Error)
- Devuelve: [\<this\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/this)

Destruye el stream y, opcionalmente, emite un evento `'error'`. Después de esta llamada, el stream de transformación liberaría cualquier recurso interno. Los implementadores no deben sobreescribir este método, sino implementar [`readable._destroy()`](/es/nodejs/api/stream#readable_destroyerr-callback) en su lugar. La implementación predeterminada de `_destroy()` para `Transform` también emite `'close'` a menos que `emitClose` se establezca en falso.

Una vez que se ha llamado a `destroy()`, cualquier llamada posterior será una operación no válida y no se pueden emitir más errores que los de `_destroy()` como `'error'`.


#### `stream.duplexPair([options])` {#streamduplexpairoptions}

**Agregado en: v22.6.0, v20.17.0**

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un valor para pasar a ambos constructores [`Duplex`](/es/nodejs/api/stream#class-streamduplex), para establecer opciones como el almacenamiento en búfer.
- Devuelve: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) de dos instancias de [`Duplex`](/es/nodejs/api/stream#class-streamduplex).

La función de utilidad `duplexPair` devuelve un Array con dos elementos, cada uno siendo un flujo `Duplex` conectado al otro lado:

```js [ESM]
const [ sideA, sideB ] = duplexPair();
```
Lo que se escriba en un flujo se hace legible en el otro. Proporciona un comportamiento análogo a una conexión de red, donde los datos escritos por el cliente se vuelven legibles por el servidor y viceversa.

Los flujos Duplex son simétricos; uno u otro puede usarse sin ninguna diferencia en el comportamiento.

### `stream.finished(stream[, options], callback)` {#streamfinishedstream-options-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.5.0 | Se agregó soporte para `ReadableStream` y `WritableStream`. |
| v15.11.0 | Se agregó la opción `signal`. |
| v14.0.0 | `finished(stream, cb)` esperará el evento `'close'` antes de invocar la retrollamada. La implementación intenta detectar flujos heredados y solo aplica este comportamiento a los flujos que se espera que emitan `'close'`. |
| v14.0.0 | Emitir `'close'` antes de `'end'` en un flujo `Readable` causará un error `ERR_STREAM_PREMATURE_CLOSE`. |
| v14.0.0 | La retrollamada se invocará en flujos que ya hayan terminado antes de la llamada a `finished(stream, cb)`. |
| v10.0.0 | Agregado en: v10.0.0 |
:::

- `stream` [\<Stream\>](/es/nodejs/api/stream#stream) | [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream) Un flujo/flujo web legible y/o grabable.
- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `error` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en `false`, entonces una llamada a `emit('error', err)` no se trata como finalizada. **Predeterminado:** `true`.
    - `readable` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando se establece en `false`, la retrollamada se llamará cuando el flujo termine aunque el flujo aún pueda ser legible. **Predeterminado:** `true`.
    - `writable` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando se establece en `false`, la retrollamada se llamará cuando el flujo termine aunque el flujo aún pueda ser grabable. **Predeterminado:** `true`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) permite abortar la espera a que termine el flujo. El flujo subyacente *no* se abortará si se aborta la señal. La retrollamada se llamará con un `AbortError`. Todos los listeners registrados agregados por esta función también se eliminarán.
  
 
- `callback` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función de retrollamada que toma un argumento de error opcional.
- Devuelve: [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función de limpieza que elimina todos los listeners registrados.

Una función para recibir notificaciones cuando un flujo ya no es legible, grabable o ha experimentado un error o un evento de cierre prematuro.

```js [ESM]
const { finished } = require('node:stream');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

finished(rs, (err) => {
  if (err) {
    console.error('El flujo falló.', err);
  } else {
    console.log('El flujo ha terminado de leer.');
  }
});

rs.resume(); // Drena el flujo.
```
Especialmente útil en escenarios de manejo de errores donde un flujo se destruye prematuramente (como una solicitud HTTP abortada) y no emitirá `'end'` o `'finish'`.

La API `finished` proporciona una [versión de promesa](/es/nodejs/api/stream#streamfinishedstream-options).

`stream.finished()` deja listeners de eventos colgando (en particular `'error'`, `'end'`, `'finish'` y `'close'`) después de que se haya invocado `callback`. La razón de esto es para que los eventos `'error'` inesperados (debido a implementaciones de flujo incorrectas) no causen bloqueos inesperados. Si este es un comportamiento no deseado, entonces la función de limpieza devuelta debe invocarse en la retrollamada:

```js [ESM]
const cleanup = finished(rs, (err) => {
  cleanup();
  // ...
});
```

### `stream.pipeline(source[, ...transforms], destination, callback)` {#streampipelinesource-transforms-destination-callback}

### `stream.pipeline(streams, callback)` {#streampipelinestreams-callback}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v19.7.0, v18.16.0 | Se agregó soporte para webstreams. |
| v18.0.0 | Pasar una callback no válida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v14.0.0 | `pipeline(..., cb)` esperará el evento `'close'` antes de invocar la callback. La implementación intenta detectar streams heredados y solo aplica este comportamiento a los streams que se espera que emitan `'close'`. |
| v13.10.0 | Se agregó soporte para generadores asíncronos. |
| v10.0.0 | Se agregó en: v10.0.0 |
:::

- `streams` [\<Stream[]\>](/es/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream[]\>](/es/nodejs/api/webstreams#class-readablestream) | [\<WritableStream[]\>](/es/nodejs/api/webstreams#class-writablestream) | [\<TransformStream[]\>](/es/nodejs/api/webstreams#class-transformstream)
- `source` [\<Stream\>](/es/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) 
    - Devuelve: [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `...transforms` [\<Stream\>](/es/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<TransformStream\>](/es/nodejs/api/webstreams#class-transformstream) 
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Devuelve: [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `destination` [\<Stream\>](/es/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream) 
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Devuelve: [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se llama cuando la pipeline está completamente terminada. 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `val` Valor resuelto de `Promise` devuelto por `destination`.
  
 
- Devuelve: [\<Stream\>](/es/nodejs/api/stream#stream)

Un método de módulo para canalizar entre streams y generadores reenviando errores y limpiando adecuadamente y proporcionar una callback cuando la pipeline está completa.

```js [ESM]
const { pipeline } = require('node:stream');
const fs = require('node:fs');
const zlib = require('node:zlib');

// Use la API pipeline para canalizar fácilmente una serie de streams
// juntos y recibir una notificación cuando la pipeline esté completamente terminada.

// Una pipeline para comprimir un archivo tar potencialmente enorme de manera eficiente:

pipeline(
  fs.createReadStream('archive.tar'),
  zlib.createGzip(),
  fs.createWriteStream('archive.tar.gz'),
  (err) => {
    if (err) {
      console.error('Pipeline falló.', err);
    } else {
      console.log('Pipeline tuvo éxito.');
    }
  },
);
```
La API `pipeline` proporciona una [versión de promise](/es/nodejs/api/stream#streampipelinesource-transforms-destination-options).

`stream.pipeline()` llamará a `stream.destroy(err)` en todos los streams excepto:

- Streams `Readable` que han emitido `'end'` o `'close'`.
- Streams `Writable` que han emitido `'finish'` o `'close'`.

`stream.pipeline()` deja listeners de eventos colgando en los streams después de que se haya invocado la `callback`. En el caso de la reutilización de streams después de un fallo, esto puede causar fugas de listeners de eventos y errores tragados. Si el último stream es legible, los listeners de eventos colgando se eliminarán para que el último stream se pueda consumir más tarde.

`stream.pipeline()` cierra todos los streams cuando se genera un error. El uso de `IncomingRequest` con `pipeline` podría conducir a un comportamiento inesperado una vez que destruye el socket sin enviar la respuesta esperada. Vea el ejemplo a continuación:

```js [ESM]
const fs = require('node:fs');
const http = require('node:http');
const { pipeline } = require('node:stream');

const server = http.createServer((req, res) => {
  const fileStream = fs.createReadStream('./fileNotExist.txt');
  pipeline(fileStream, res, (err) => {
    if (err) {
      console.log(err); // No such file
      // este mensaje no se puede enviar una vez que `pipeline` ya destruyó el socket
      return res.end('error!!!');
    }
  });
});
```

### `stream.compose(...streams)` {#streamcomposestreams}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.1.0, v20.10.0 | Se agregó soporte para la clase stream. |
| v19.8.0, v18.16.0 | Se agregó soporte para webstreams. |
| v16.9.0 | Agregado en: v16.9.0 |
:::

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - `stream.compose` es experimental.
:::

- `streams` [\<Stream[]\>](/es/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream[]\>](/es/nodejs/api/webstreams#class-readablestream) | [\<WritableStream[]\>](/es/nodejs/api/webstreams#class-writablestream) | [\<TransformStream[]\>](/es/nodejs/api/webstreams#class-transformstream) | [\<Duplex[]\>](/es/nodejs/api/stream#class-streamduplex) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)

Combina dos o más streams en un stream `Duplex` que escribe en el primer stream y lee del último. Cada stream proporcionado se canaliza al siguiente, usando `stream.pipeline`. Si alguno de los streams genera un error, todos se destruyen, incluido el stream `Duplex` exterior.

Debido a que `stream.compose` devuelve un nuevo stream que a su vez puede (y debe) canalizarse a otros streams, permite la composición. En contraste, al pasar streams a `stream.pipeline`, típicamente el primer stream es un stream legible y el último un stream grabable, formando un circuito cerrado.

Si se pasa una `Function`, debe ser un método de fábrica que tome un `source` `Iterable`.

```js [ESM]
import { compose, Transform } from 'node:stream';

const removeSpaces = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, String(chunk).replace(' ', ''));
  },
});

async function* toUpper(source) {
  for await (const chunk of source) {
    yield String(chunk).toUpperCase();
  }
}

let res = '';
for await (const buf of compose(removeSpaces, toUpper).end('hello world')) {
  res += buf;
}

console.log(res); // imprime 'HELLOWORLD'
```
`stream.compose` se puede utilizar para convertir iterables asíncronos, generadores y funciones en streams.

- `AsyncIterable` se convierte en un `Duplex` legible. No puede producir `null`.
- `AsyncGeneratorFunction` se convierte en un `Duplex` de transformación legible/grabable. Debe tomar un `AsyncIterable` de origen como primer parámetro. No puede producir `null`.
- `AsyncFunction` se convierte en un `Duplex` grabable. Debe devolver `null` o `undefined`.

```js [ESM]
import { compose } from 'node:stream';
import { finished } from 'node:stream/promises';

// Convierte AsyncIterable en Duplex legible.
const s1 = compose(async function*() {
  yield 'Hello';
  yield 'World';
}());

// Convierte AsyncGenerator en Duplex de transformación.
const s2 = compose(async function*(source) {
  for await (const chunk of source) {
    yield String(chunk).toUpperCase();
  }
});

let res = '';

// Convierte AsyncFunction en Duplex grabable.
const s3 = compose(async function(source) {
  for await (const chunk of source) {
    res += chunk;
  }
});

await finished(compose(s1, s2, s3));

console.log(res); // imprime 'HELLOWORLD'
```
Ver [`readable.compose(stream)`](/es/nodejs/api/stream#readablecomposestream-options) para `stream.compose` como operador.


### `stream.Readable.from(iterable[, options])` {#streamreadablefromiterable-options}

**Agregado en: v12.3.0, v10.17.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) Objeto que implementa el protocolo iterable `Symbol.asyncIterator` o `Symbol.iterator`. Emite un evento 'error' si se pasa un valor nulo.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones proporcionadas a `new stream.Readable([options])`. Por defecto, `Readable.from()` establecerá `options.objectMode` a `true`, a menos que se opte explícitamente por no hacerlo estableciendo `options.objectMode` a `false`.
- Devuelve: [\<stream.Readable\>](/es/nodejs/api/stream#class-streamreadable)

Un método de utilidad para crear streams legibles a partir de iteradores.

```js [ESM]
const { Readable } = require('node:stream');

async function * generate() {
  yield 'hello';
  yield 'streams';
}

const readable = Readable.from(generate());

readable.on('data', (chunk) => {
  console.log(chunk);
});
```
Llamar a `Readable.from(string)` o `Readable.from(buffer)` no hará que las cadenas o los búferes se iteren para coincidir con la semántica de otros streams por razones de rendimiento.

Si se pasa un objeto `Iterable` que contiene promesas como argumento, podría resultar en un rechazo no manejado.

```js [ESM]
const { Readable } = require('node:stream');

Readable.from([
  new Promise((resolve) => setTimeout(resolve('1'), 1500)),
  new Promise((_, reject) => setTimeout(reject(new Error('2')), 1000)), // Rechazo no manejado
]);
```
### `stream.Readable.fromWeb(readableStream[, options])` {#streamreadablefromwebreadablestream-options}

**Agregado en: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `readableStream` [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal)
  
 
- Devuelve: [\<stream.Readable\>](/es/nodejs/api/stream#class-streamreadable)


### `stream.Readable.isDisturbed(stream)` {#streamreadableisdisturbedstream}

**Agregado en: v16.8.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estable: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `stream` [\<stream.Readable\>](/es/nodejs/api/stream#class-streamreadable) | [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream)
- Devuelve: `boolean`

Devuelve si se ha leído o cancelado el flujo.

### `stream.isErrored(stream)` {#streamiserroredstream}

**Agregado en: v17.3.0, v16.14.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estable: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `stream` [\<Readable\>](/es/nodejs/api/stream#class-streamreadable) | [\<Writable\>](/es/nodejs/api/stream#class-streamwritable) | [\<Duplex\>](/es/nodejs/api/stream#class-streamduplex) | [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream) | [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve si el flujo ha encontrado un error.

### `stream.isReadable(stream)` {#streamisreadablestream}

**Agregado en: v17.4.0, v16.14.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estable: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `stream` [\<Readable\>](/es/nodejs/api/stream#class-streamreadable) | [\<Duplex\>](/es/nodejs/api/stream#class-streamduplex) | [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve si el flujo es legible.

### `stream.Readable.toWeb(streamReadable[, options])` {#streamreadabletowebstreamreadable-options}

**Agregado en: v17.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estable: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `streamReadable` [\<stream.Readable\>](/es/nodejs/api/stream#class-streamreadable)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El tamaño máximo de la cola interna (del `ReadableStream` creado) antes de que se aplique la contrapresión al leer del `stream.Readable` dado. Si no se proporciona ningún valor, se tomará del `stream.Readable` dado.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función que dimensiona el fragmento de datos dado. Si no se proporciona ningún valor, el tamaño será `1` para todos los fragmentos.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)




 



 



- Devuelve: [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream)


### `stream.Writable.fromWeb(writableStream[, options])` {#streamwritablefromwebwritablestream-options}

**Añadido en: v17.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `writableStream` [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal)
  
 
- Devuelve: [\<stream.Writable\>](/es/nodejs/api/stream#class-streamwritable)

### `stream.Writable.toWeb(streamWritable)` {#streamwritabletowebstreamwritable}

**Añadido en: v17.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `streamWritable` [\<stream.Writable\>](/es/nodejs/api/stream#class-streamwritable)
- Devuelve: [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream)

### `stream.Duplex.from(src)` {#streamduplexfromsrc}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.5.0, v18.17.0 | El argumento `src` ahora puede ser un `ReadableStream` o `WritableStream`. |
| v16.8.0 | Añadido en: v16.8.0 |
:::

- `src` [\<Stream\>](/es/nodejs/api/stream#stream) | [\<Blob\>](/es/nodejs/api/buffer#class-blob) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<AsyncGeneratorFunction\>](https://tc39.es/proposal-async-iteration/#sec-asyncgeneratorfunction-constructor) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream)

Un método de utilidad para crear flujos dúplex.

- `Stream` convierte el flujo de escritura en `Duplex` de escritura y el flujo de lectura en `Duplex`.
- `Blob` se convierte en `Duplex` de lectura.
- `string` se convierte en `Duplex` de lectura.
- `ArrayBuffer` se convierte en `Duplex` de lectura.
- `AsyncIterable` se convierte en un `Duplex` de lectura. No puede producir `null`.
- `AsyncGeneratorFunction` se convierte en un `Duplex` de transformación de lectura/escritura. Debe tomar un `AsyncIterable` fuente como primer parámetro. No puede producir `null`.
- `AsyncFunction` se convierte en un `Duplex` de escritura. Debe devolver `null` o `undefined`.
- `Object ({ writable, readable })` convierte `readable` y `writable` en `Stream` y luego los combina en `Duplex` donde el `Duplex` escribirá en el `writable` y leerá del `readable`.
- `Promise` se convierte en `Duplex` de lectura. El valor `null` se ignora.
- `ReadableStream` se convierte en `Duplex` de lectura.
- `WritableStream` se convierte en `Duplex` de escritura.
- Devuelve: [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)

Si se pasa como argumento un objeto `Iterable` que contiene promesas, podría resultar en un rechazo no manejado.

```js [ESM]
const { Duplex } = require('node:stream');

Duplex.from([
  new Promise((resolve) => setTimeout(resolve('1'), 1500)),
  new Promise((_, reject) => setTimeout(reject(new Error('2')), 1000)), // Rechazo no manejado
]);
```

### `stream.Duplex.fromWeb(pair[, options])` {#streamduplexfromwebpair-options}

**Agregado en: v17.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `pair` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream)
    - `writable` [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream)


- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal)


- Devuelve: [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)



::: code-group
```js [ESM]
import { Duplex } from 'node:stream';
import {
  ReadableStream,
  WritableStream,
} from 'node:stream/web';

const readable = new ReadableStream({
  start(controller) {
    controller.enqueue('world');
  },
});

const writable = new WritableStream({
  write(chunk) {
    console.log('writable', chunk);
  },
});

const pair = {
  readable,
  writable,
};
const duplex = Duplex.fromWeb(pair, { encoding: 'utf8', objectMode: true });

duplex.write('hello');

for await (const chunk of duplex) {
  console.log('readable', chunk);
}
```

```js [CJS]
const { Duplex } = require('node:stream');
const {
  ReadableStream,
  WritableStream,
} = require('node:stream/web');

const readable = new ReadableStream({
  start(controller) {
    controller.enqueue('world');
  },
});

const writable = new WritableStream({
  write(chunk) {
    console.log('writable', chunk);
  },
});

const pair = {
  readable,
  writable,
};
const duplex = Duplex.fromWeb(pair, { encoding: 'utf8', objectMode: true });

duplex.write('hello');
duplex.once('readable', () => console.log('readable', duplex.read()));
```
:::


### `stream.Duplex.toWeb(streamDuplex)` {#streamduplextowebstreamduplex}

**Añadido en: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `streamDuplex` [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)
- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream)
    - `writable` [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream)
  
 



::: code-group
```js [ESM]
import { Duplex } from 'node:stream';

const duplex = Duplex({
  objectMode: true,
  read() {
    this.push('world');
    this.push(null);
  },
  write(chunk, encoding, callback) {
    console.log('writable', chunk);
    callback();
  },
});

const { readable, writable } = Duplex.toWeb(duplex);
writable.getWriter().write('hello');

const { value } = await readable.getReader().read();
console.log('readable', value);
```

```js [CJS]
const { Duplex } = require('node:stream');

const duplex = Duplex({
  objectMode: true,
  read() {
    this.push('world');
    this.push(null);
  },
  write(chunk, encoding, callback) {
    console.log('writable', chunk);
    callback();
  },
});

const { readable, writable } = Duplex.toWeb(duplex);
writable.getWriter().write('hello');

readable.getReader().read().then((result) => {
  console.log('readable', result.value);
});
```
:::

### `stream.addAbortSignal(signal, stream)` {#streamaddabortsignalsignal-stream}


::: info [History]
| Versión | Cambios |
| --- | --- |
| v19.7.0, v18.16.0 | Se agregó soporte para `ReadableStream` y `WritableStream`. |
| v15.4.0 | Añadido en: v15.4.0 |
:::

- `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Una señal que representa una posible cancelación
- `stream` [\<Stream\>](/es/nodejs/api/stream#stream) | [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/es/nodejs/api/webstreams#class-writablestream) Un flujo al que adjuntar una señal.

Adjunta una AbortSignal a un flujo de lectura o escritura. Esto permite que el código controle la destrucción del flujo utilizando un `AbortController`.

Llamar a `abort` en el `AbortController` correspondiente al `AbortSignal` pasado se comportará de la misma manera que llamar a `.destroy(new AbortError())` en el flujo, y `controller.error(new AbortError())` para webstreams.

```js [ESM]
const fs = require('node:fs');

const controller = new AbortController();
const read = addAbortSignal(
  controller.signal,
  fs.createReadStream(('object.json')),
);
// Later, abort the operation closing the stream
controller.abort();
```
O usando un `AbortSignal` con un flujo legible como un iterable asíncrono:

```js [ESM]
const controller = new AbortController();
setTimeout(() => controller.abort(), 10_000); // set a timeout
const stream = addAbortSignal(
  controller.signal,
  fs.createReadStream(('object.json')),
);
(async () => {
  try {
    for await (const chunk of stream) {
      await process(chunk);
    }
  } catch (e) {
    if (e.name === 'AbortError') {
      // The operation was cancelled
    } else {
      throw e;
    }
  }
})();
```
O usando un `AbortSignal` con un ReadableStream:

```js [ESM]
const controller = new AbortController();
const rs = new ReadableStream({
  start(controller) {
    controller.enqueue('hello');
    controller.enqueue('world');
    controller.close();
  },
});

addAbortSignal(controller.signal, rs);

finished(rs, (err) => {
  if (err) {
    if (err.name === 'AbortError') {
      // The operation was cancelled
    }
  }
});

const reader = rs.getReader();

reader.read().then(({ value, done }) => {
  console.log(value); // hello
  console.log(done); // false
  controller.abort();
});
```

### `stream.getDefaultHighWaterMark(objectMode)` {#streamgetdefaulthighwatermarkobjectmode}

**Añadido en: v19.9.0, v18.17.0**

- `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Devuelve el highWaterMark predeterminado utilizado por los streams. El valor predeterminado es `65536` (64 KiB), o `16` para `objectMode`.

### `stream.setDefaultHighWaterMark(objectMode, value)` {#streamsetdefaulthighwatermarkobjectmode-value}

**Añadido en: v19.9.0, v18.17.0**

- `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Valor de highWaterMark

Establece el highWaterMark predeterminado utilizado por los streams.

## API para implementadores de streams {#api-for-stream-implementers}

La API del módulo `node:stream` ha sido diseñada para que sea posible implementar fácilmente streams utilizando el modelo de herencia prototípica de JavaScript.

Primero, un desarrollador de streams declararía una nueva clase de JavaScript que extiende una de las cuatro clases de streams básicas (`stream.Writable`, `stream.Readable`, `stream.Duplex` o `stream.Transform`), asegurándose de llamar al constructor de la clase padre apropiada:

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  constructor({ highWaterMark, ...options }) {
    super({ highWaterMark });
    // ...
  }
}
```
Al extender los streams, tenga en cuenta qué opciones puede y debe proporcionar el usuario antes de reenviarlas al constructor base. Por ejemplo, si la implementación hace suposiciones con respecto a las opciones `autoDestroy` y `emitClose`, no permita que el usuario las anule. Sea explícito sobre qué opciones se reenvían en lugar de reenviar implícitamente todas las opciones.

La nueva clase de stream debe implementar entonces uno o más métodos específicos, dependiendo del tipo de stream que se esté creando, como se detalla en la tabla siguiente:

| Caso de uso | Clase | Método(s) a implementar |
| --- | --- | --- |
| Sólo lectura | [`Readable`](/es/nodejs/api/stream#class-streamreadable) | [`_read()`](/es/nodejs/api/stream#readable_readsize) |
| Sólo escritura | [`Writable`](/es/nodejs/api/stream#class-streamwritable) | [`_write()`](/es/nodejs/api/stream#writable_writechunk-encoding-callback)  ,   [`_writev()`](/es/nodejs/api/stream#writable_writevchunks-callback)  ,   [`_final()`](/es/nodejs/api/stream#writable_finalcallback) |
| Lectura y escritura | [`Duplex`](/es/nodejs/api/stream#class-streamduplex) | [`_read()`](/es/nodejs/api/stream#readable_readsize)  ,   [`_write()`](/es/nodejs/api/stream#writable_writechunk-encoding-callback)  ,   [`_writev()`](/es/nodejs/api/stream#writable_writevchunks-callback)  ,   [`_final()`](/es/nodejs/api/stream#writable_finalcallback) |
| Operar sobre los datos escritos, luego leer el resultado | [`Transform`](/es/nodejs/api/stream#class-streamtransform) | [`_transform()`](/es/nodejs/api/stream#transform_transformchunk-encoding-callback)  ,   [`_flush()`](/es/nodejs/api/stream#transform_flushcallback)  ,   [`_final()`](/es/nodejs/api/stream#writable_finalcallback) |
El código de implementación de un stream *nunca* debe llamar a los métodos "públicos" de un stream que están destinados a ser utilizados por los consumidores (como se describe en la sección [API para consumidores de streams](/es/nodejs/api/stream#api-for-stream-consumers)). Hacerlo puede provocar efectos secundarios adversos en el código de la aplicación que consume el stream.

Evite anular métodos públicos como `write()`, `end()`, `cork()`, `uncork()`, `read()` y `destroy()`, o emitir eventos internos como `'error'`, `'data'`, `'end'`, `'finish'` y `'close'` a través de `.emit()`. Hacerlo puede romper los invariantes de stream actuales y futuros, lo que lleva a problemas de comportamiento y/o compatibilidad con otros streams, utilidades de stream y expectativas del usuario.


### Construcción simplificada {#simplified-construction}

**Añadido en: v1.2.0**

Para muchos casos simples, es posible crear un stream sin depender de la herencia. Esto se puede lograr creando directamente instancias de los objetos `stream.Writable`, `stream.Readable`, `stream.Duplex` o `stream.Transform` y pasando los métodos apropiados como opciones del constructor.

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  construct(callback) {
    // Inicializar el estado y cargar recursos...
  },
  write(chunk, encoding, callback) {
    // ...
  },
  destroy() {
    // Liberar recursos...
  },
});
```
### Implementación de un stream de escritura {#implementing-a-writable-stream}

La clase `stream.Writable` se extiende para implementar un stream [`Writable`](/es/nodejs/api/stream#class-streamwritable).

Los streams `Writable` personalizados *deben* llamar al constructor `new stream.Writable([options])` e implementar el método `writable._write()` y/o `writable._writev()`.

#### `new stream.Writable([options])` {#new-streamwritableoptions}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.0.0 | Aumentar el highWaterMark predeterminado. |
| v15.5.0 | Soporte para pasar un AbortSignal. |
| v14.0.0 | Cambiar la opción `autoDestroy` a `true` de forma predeterminada. |
| v11.2.0, v10.16.0 | Agregar la opción `autoDestroy` para automáticamente `destroy()` el stream cuando emite `'finish'` o errores. |
| v10.0.0 | Agregar la opción `emitClose` para especificar si se emite `'close'` al destruir. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nivel de búfer cuando [`stream.write()`](/es/nodejs/api/stream#writablewritechunk-encoding-callback) comienza a devolver `false`. **Predeterminado:** `65536` (64 KiB), o `16` para streams `objectMode`.
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si se deben codificar las `string` pasadas a [`stream.write()`](/es/nodejs/api/stream#writablewritechunk-encoding-callback) en `Buffer`s (con la codificación especificada en la llamada a [`stream.write()`](/es/nodejs/api/stream#writablewritechunk-encoding-callback)) antes de pasarlas a [`stream._write()`](/es/nodejs/api/stream#writable_writechunk-encoding-callback). Otros tipos de datos no se convierten (es decir, los `Buffer`s no se decodifican en `string`s). Establecer en falso evitará que las `string`s se conviertan. **Predeterminado:** `true`.
    - `defaultEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codificación predeterminada que se utiliza cuando no se especifica ninguna codificación como argumento para [`stream.write()`](/es/nodejs/api/stream#writablewritechunk-encoding-callback). **Predeterminado:** `'utf8'`.
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si [`stream.write(anyObj)`](/es/nodejs/api/stream#writablewritechunk-encoding-callback) es una operación válida. Cuando se establece, se hace posible escribir valores de JavaScript que no sean string, [\<Buffer\>](/es/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) o [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) si la implementación del stream lo admite. **Predeterminado:** `false`.
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si el stream debe emitir `'close'` después de haber sido destruido. **Predeterminado:** `true`.
    - `write` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementación para el método [`stream._write()`](/es/nodejs/api/stream#writable_writechunk-encoding-callback).
    - `writev` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementación para el método [`stream._writev()`](/es/nodejs/api/stream#writable_writevchunks-callback).
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementación para el método [`stream._destroy()`](/es/nodejs/api/stream#writable_destroyerr-callback).
    - `final` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementación para el método [`stream._final()`](/es/nodejs/api/stream#writable_finalcallback).
    - `construct` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementación para el método [`stream._construct()`](/es/nodejs/api/stream#writable_constructcallback).
    - `autoDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si este stream debe llamar automáticamente a `.destroy()` sobre sí mismo después de terminar. **Predeterminado:** `true`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Una señal que representa una posible cancelación.

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  constructor(options) {
    // Llama al constructor stream.Writable().
    super(options);
    // ...
  }
}
```
O, cuando se utilizan constructores de estilo pre-ES6:

```js [ESM]
const { Writable } = require('node:stream');
const util = require('node:util');

function MyWritable(options) {
  if (!(this instanceof MyWritable))
    return new MyWritable(options);
  Writable.call(this, options);
}
util.inherits(MyWritable, Writable);
```
O, utilizando el enfoque de constructor simplificado:

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  write(chunk, encoding, callback) {
    // ...
  },
  writev(chunks, callback) {
    // ...
  },
});
```
Llamar a `abort` en el `AbortController` correspondiente al `AbortSignal` pasado se comportará de la misma manera que llamar a `.destroy(new AbortError())` en el stream de escritura.

```js [ESM]
const { Writable } = require('node:stream');

const controller = new AbortController();
const myWritable = new Writable({
  write(chunk, encoding, callback) {
    // ...
  },
  writev(chunks, callback) {
    // ...
  },
  signal: controller.signal,
});
// Más tarde, abortar la operación cerrando el stream
controller.abort();
```

#### `writable._construct(callback)` {#writable_constructcallback}

**Agregado en: v15.0.0**

- `callback` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Llama a esta función (opcionalmente con un argumento de error) cuando el stream haya terminado de inicializarse.

El método `_construct()` NO DEBE ser llamado directamente. Puede ser implementado por clases hijas, y si es así, será llamado solo por los métodos internos de la clase `Writable`.

Esta función opcional se llamará en un tick después de que el constructor del stream haya regresado, retrasando cualquier llamada a `_write()`, `_final()` y `_destroy()` hasta que se llame a `callback`. Esto es útil para inicializar el estado o inicializar asincrónicamente los recursos antes de que se pueda utilizar el stream.

```js [ESM]
const { Writable } = require('node:stream');
const fs = require('node:fs');

class WriteStream extends Writable {
  constructor(filename) {
    super();
    this.filename = filename;
    this.fd = null;
  }
  _construct(callback) {
    fs.open(this.filename, 'w', (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  _write(chunk, encoding, callback) {
    fs.write(this.fd, chunk, callback);
  }
  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}
```
#### `writable._write(chunk, encoding, callback)` {#writable_writechunk-encoding-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.11.0 | _write() es opcional al proporcionar _writev(). |
:::

- `chunk` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) El `Buffer` que se va a escribir, convertido desde el `string` pasado a [`stream.write()`](/es/nodejs/api/stream#writablewritechunk-encoding-callback). Si la opción `decodeStrings` del stream es `false` o el stream está operando en modo objeto, el chunk no se convertirá y será lo que se pasó a [`stream.write()`](/es/nodejs/api/stream#writablewritechunk-encoding-callback).
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si el chunk es un string, entonces `encoding` es la codificación de caracteres de ese string. Si el chunk es un `Buffer`, o si el stream está operando en modo objeto, `encoding` puede ignorarse.
- `callback` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Llama a esta función (opcionalmente con un argumento de error) cuando el procesamiento esté completo para el chunk suministrado.

Todas las implementaciones de streams `Writable` deben proporcionar un método [`writable._write()`](/es/nodejs/api/stream#writable_writechunk-encoding-callback) y/o [`writable._writev()`](/es/nodejs/api/stream#writable_writevchunks-callback) para enviar datos al recurso subyacente.

Los streams [`Transform`](/es/nodejs/api/stream#class-streamtransform) proporcionan su propia implementación de [`writable._write()`](/es/nodejs/api/stream#writable_writechunk-encoding-callback).

Esta función NO DEBE ser llamada directamente por el código de la aplicación. Debe ser implementada por clases hijas, y llamada solo por los métodos internos de la clase `Writable`.

La función `callback` debe ser llamada sincrónicamente dentro de `writable._write()` o asincrónicamente (es decir, un tick diferente) para señalar que la escritura se completó con éxito o falló con un error. El primer argumento pasado al `callback` debe ser el objeto `Error` si la llamada falló o `null` si la escritura tuvo éxito.

Todas las llamadas a `writable.write()` que ocurran entre el momento en que se llama a `writable._write()` y se llama al `callback` harán que los datos escritos se almacenen en búfer. Cuando se invoca el `callback`, el stream puede emitir un evento [`'drain'`](/es/nodejs/api/stream#event-drain). Si una implementación de stream es capaz de procesar varios chunks de datos a la vez, se debe implementar el método `writable._writev()`.

Si la propiedad `decodeStrings` se establece explícitamente en `false` en las opciones del constructor, entonces `chunk` seguirá siendo el mismo objeto que se pasa a `.write()`, y puede ser un string en lugar de un `Buffer`. Esto es para admitir implementaciones que tienen un manejo optimizado para ciertas codificaciones de datos de string. En ese caso, el argumento `encoding` indicará la codificación de caracteres del string. De lo contrario, el argumento `encoding` se puede ignorar de forma segura.

El método `writable._write()` tiene el prefijo de un guion bajo porque es interno a la clase que lo define y nunca debe ser llamado directamente por los programas de usuario.


#### `writable._writev(chunks, callback)` {#writable_writevchunks-callback}

- `chunks` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Los datos que se van a escribir. El valor es un array de [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) que representan cada uno un fragmento de datos discreto a escribir. Las propiedades de estos objetos son:
    - `chunk` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una instancia de buffer o una cadena que contiene los datos que se van a escribir. El `chunk` será una cadena si el `Writable` se creó con la opción `decodeStrings` establecida en `false` y se pasó una cadena a `write()`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codificación de caracteres del `chunk`. Si `chunk` es un `Buffer`, la `encoding` será `'buffer'`.

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función callback (opcionalmente con un argumento de error) que se invocará cuando se complete el procesamiento de los fragmentos suministrados.

Esta función NO DEBE ser llamada directamente por el código de la aplicación. Debe ser implementada por las clases secundarias, y ser llamada sólo por los métodos internos de la clase `Writable`.

El método `writable._writev()` puede ser implementado adicionalmente o alternativamente a `writable._write()` en implementaciones de stream que son capaces de procesar múltiples fragmentos de datos a la vez. Si se implementa y si hay datos en búfer de escrituras anteriores, se llamará a `_writev()` en lugar de a `_write()`.

El método `writable._writev()` está precedido por un guion bajo porque es interno a la clase que lo define, y nunca debe ser llamado directamente por los programas de usuario.

#### `writable._destroy(err, callback)` {#writable_destroyerr-callback}

**Agregado en: v8.0.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Un posible error.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función de callback que toma un argumento de error opcional.

El método `_destroy()` es llamado por [`writable.destroy()`](/es/nodejs/api/stream#writabledestroyerror). Puede ser sobrescrito por las clases secundarias pero **no debe** ser llamado directamente.


#### `writable._final(callback)` {#writable_finalcallback}

**Agregado en: v8.0.0**

- `callback` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Llama a esta función (opcionalmente con un argumento de error) cuando termines de escribir cualquier dato restante.

El método `_final()` **no debe** ser llamado directamente. Puede ser implementado por clases secundarias, y si es así, será llamado solo por los métodos internos de la clase `Writable`.

Esta función opcional será llamada antes de que el stream se cierre, retrasando el evento `'finish'` hasta que `callback` sea llamado. Esto es útil para cerrar recursos o escribir datos almacenados en búfer antes de que un stream termine.

#### Errores durante la escritura {#errors-while-writing}

Los errores que ocurran durante el procesamiento de los métodos [`writable._write()`](/es/nodejs/api/stream#writable_writechunk-encoding-callback), [`writable._writev()`](/es/nodejs/api/stream#writable_writevchunks-callback) y [`writable._final()`](/es/nodejs/api/stream#writable_finalcallback) deben propagarse invocando el callback y pasando el error como el primer argumento. Lanzar un `Error` desde dentro de estos métodos o emitir manualmente un evento `'error'` resulta en un comportamiento indefinido.

Si un stream `Readable` se canaliza en un stream `Writable` cuando `Writable` emite un error, el stream `Readable` se desconectará.

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) {
      callback(new Error('chunk is invalid'));
    } else {
      callback();
    }
  },
});
```
#### Un ejemplo de stream de escritura {#an-example-writable-stream}

Lo siguiente ilustra una implementación bastante simplista (y algo inútil) de un stream `Writable` personalizado. Si bien esta instancia de stream `Writable` específica no tiene ninguna utilidad particular real, el ejemplo ilustra cada uno de los elementos requeridos de una instancia de stream [`Writable`](/es/nodejs/api/stream#class-streamwritable) personalizada:

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  _write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) {
      callback(new Error('chunk is invalid'));
    } else {
      callback();
    }
  }
}
```

#### Decodificando buffers en un stream escribible {#decoding-buffers-in-a-writable-stream}

La decodificación de buffers es una tarea común, por ejemplo, cuando se usan transformadores cuya entrada es una cadena. Este no es un proceso trivial cuando se usa la codificación de caracteres multibyte, como UTF-8. El siguiente ejemplo muestra cómo decodificar cadenas multibyte usando `StringDecoder` y [`Writable`](/es/nodejs/api/stream#class-streamwritable).

```js [ESM]
const { Writable } = require('node:stream');
const { StringDecoder } = require('node:string_decoder');

class StringWritable extends Writable {
  constructor(options) {
    super(options);
    this._decoder = new StringDecoder(options?.defaultEncoding);
    this.data = '';
  }
  _write(chunk, encoding, callback) {
    if (encoding === 'buffer') {
      chunk = this._decoder.write(chunk);
    }
    this.data += chunk;
    callback();
  }
  _final(callback) {
    this.data += this._decoder.end();
    callback();
  }
}

const euro = [[0xE2, 0x82], [0xAC]].map(Buffer.from);
const w = new StringWritable();

w.write('currency: ');
w.write(euro[0]);
w.end(euro[1]);

console.log(w.data); // currency: €
```
### Implementando un stream legible {#implementing-a-readable-stream}

La clase `stream.Readable` se extiende para implementar un stream [`Readable`](/es/nodejs/api/stream#class-streamreadable).

Los streams `Readable` personalizados *deben* llamar al constructor `new stream.Readable([options])` e implementar el método [`readable._read()`](/es/nodejs/api/stream#readable_readsize).

#### `new stream.Readable([options])` {#new-streamreadableoptions}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.0.0 | Aumentar highWaterMark predeterminado. |
| v15.5.0 | Soporte para pasar una AbortSignal. |
| v14.0.0 | Cambiar la opción `autoDestroy` predeterminada a `true`. |
| v11.2.0, v10.16.0 | Agregar la opción `autoDestroy` para `destroy()` automáticamente el stream cuando emite `'end'` o errores. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El máximo [número de bytes](/es/nodejs/api/stream#highwatermark-discrepancy-after-calling-readablesetencoding) para almacenar en el búfer interno antes de dejar de leer del recurso subyacente. **Predeterminado:** `65536` (64 KiB), o `16` para streams `objectMode`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si se especifica, entonces los búferes se decodificarán a cadenas usando la codificación especificada. **Predeterminado:** `null`.
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si este stream debe comportarse como un stream de objetos. Lo que significa que [`stream.read(n)`](/es/nodejs/api/stream#readablereadsize) devuelve un solo valor en lugar de un `Buffer` de tamaño `n`. **Predeterminado:** `false`.
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si el stream debe o no emitir `'close'` después de haber sido destruido. **Predeterminado:** `true`.
    - `read` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementación para el método [`stream._read()`](/es/nodejs/api/stream#readable_readsize).
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementación para el método [`stream._destroy()`](/es/nodejs/api/stream#readable_destroyerr-callback).
    - `construct` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementación para el método [`stream._construct()`](/es/nodejs/api/stream#readable_constructcallback).
    - `autoDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si este stream debe llamar automáticamente a `.destroy()` sobre sí mismo después de terminar. **Predeterminado:** `true`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Una señal que representa una posible cancelación.
  
 

```js [ESM]
const { Readable } = require('node:stream');

class MyReadable extends Readable {
  constructor(options) {
    // Calls the stream.Readable(options) constructor.
    super(options);
    // ...
  }
}
```
O, cuando se usan constructores de estilo pre-ES6:

```js [ESM]
const { Readable } = require('node:stream');
const util = require('node:util');

function MyReadable(options) {
  if (!(this instanceof MyReadable))
    return new MyReadable(options);
  Readable.call(this, options);
}
util.inherits(MyReadable, Readable);
```
O, usando el enfoque de constructor simplificado:

```js [ESM]
const { Readable } = require('node:stream');

const myReadable = new Readable({
  read(size) {
    // ...
  },
});
```
Llamar a `abort` en el `AbortController` correspondiente a la `AbortSignal` pasada se comportará de la misma manera que llamar a `.destroy(new AbortError())` en el readable creado.

```js [ESM]
const { Readable } = require('node:stream');
const controller = new AbortController();
const read = new Readable({
  read(size) {
    // ...
  },
  signal: controller.signal,
});
// Later, abort the operation closing the stream
controller.abort();
```

#### `readable._construct(callback)` {#readable_constructcallback}

**Agregado en: v15.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Llama a esta función (opcionalmente con un argumento de error) cuando el stream haya terminado de inicializarse.

El método `_construct()` NO DEBE ser llamado directamente. Puede ser implementado por clases secundarias, y si es así, será llamado únicamente por los métodos internos de la clase `Readable`.

Esta función opcional será programada en el siguiente tick por el constructor del stream, retrasando cualquier llamada a `_read()` y `_destroy()` hasta que se llame a `callback`. Esto es útil para inicializar el estado o inicializar asíncronamente los recursos antes de que el stream pueda ser utilizado.

```js [ESM]
const { Readable } = require('node:stream');
const fs = require('node:fs');

class ReadStream extends Readable {
  constructor(filename) {
    super();
    this.filename = filename;
    this.fd = null;
  }
  _construct(callback) {
    fs.open(this.filename, (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  _read(n) {
    const buf = Buffer.alloc(n);
    fs.read(this.fd, buf, 0, n, null, (err, bytesRead) => {
      if (err) {
        this.destroy(err);
      } else {
        this.push(bytesRead > 0 ? buf.slice(0, bytesRead) : null);
      }
    });
  }
  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}
```
#### `readable._read(size)` {#readable_readsize}

**Agregado en: v0.9.4**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes para leer de forma asíncrona.

Esta función NO DEBE ser llamada directamente por el código de la aplicación. Debe ser implementada por clases secundarias, y llamada únicamente por los métodos internos de la clase `Readable`.

Todas las implementaciones de streams `Readable` deben proporcionar una implementación del método [`readable._read()`](/es/nodejs/api/stream#readable_readsize) para obtener datos del recurso subyacente.

Cuando se llama a [`readable._read()`](/es/nodejs/api/stream#readable_readsize), si los datos están disponibles desde el recurso, la implementación debe comenzar a insertar esos datos en la cola de lectura utilizando el método [`this.push(dataChunk)`](/es/nodejs/api/stream#readablepushchunk-encoding). Se llamará a `_read()` de nuevo después de cada llamada a [`this.push(dataChunk)`](/es/nodejs/api/stream#readablepushchunk-encoding) una vez que el stream esté listo para aceptar más datos. `_read()` puede continuar leyendo desde el recurso e insertando datos hasta que `readable.push()` devuelva `false`. Sólo cuando se llame a `_read()` de nuevo después de que se haya detenido debe reanudar la inserción de datos adicionales en la cola.

Una vez que el método [`readable._read()`](/es/nodejs/api/stream#readable_readsize) ha sido llamado, no se llamará de nuevo hasta que se inserten más datos a través del método [`readable.push()`](/es/nodejs/api/stream#readablepushchunk-encoding). Los datos vacíos, como los buffers y strings vacíos, no harán que se llame a [`readable._read()`](/es/nodejs/api/stream#readable_readsize).

El argumento `size` es orientativo. Para las implementaciones en las que una "lectura" es una sola operación que devuelve datos, puede utilizar el argumento `size` para determinar la cantidad de datos que se van a obtener. Otras implementaciones pueden ignorar este argumento y simplemente proporcionar datos cuando estén disponibles. No es necesario "esperar" hasta que `size` bytes estén disponibles antes de llamar a [`stream.push(chunk)`](/es/nodejs/api/stream#readablepushchunk-encoding).

El método [`readable._read()`](/es/nodejs/api/stream#readable_readsize) está prefijado con un guion bajo porque es interno a la clase que lo define, y nunca debe ser llamado directamente por los programas de usuario.


#### `readable._destroy(err, callback)` {#readable_destroyerr-callback}

**Agregado en: v8.0.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Un posible error.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función de callback que toma un argumento de error opcional.

El método `_destroy()` es llamado por [`readable.destroy()`](/es/nodejs/api/stream#readabledestroyerror). Puede ser sobrescrito por clases secundarias, pero **no debe** ser llamado directamente.

#### `readable.push(chunk[, encoding])` {#readablepushchunk-encoding}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.0.0, v20.13.0 | El argumento `chunk` ahora puede ser una instancia de `TypedArray` o `DataView`. |
| v8.0.0 | El argumento `chunk` ahora puede ser una instancia de `Uint8Array`. |
:::

- `chunk` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Fragmento de datos para insertar en la cola de lectura. Para streams que no operan en modo objeto, `chunk` debe ser un [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/es/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) o [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView). Para streams en modo objeto, `chunk` puede ser cualquier valor de JavaScript.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Codificación de fragmentos de cadena. Debe ser una codificación `Buffer` válida, como `'utf8'` o `'ascii'`.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si se pueden seguir insertando fragmentos de datos adicionales; `false` en caso contrario.

Cuando `chunk` es un [\<Buffer\>](/es/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) o [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), el `chunk` de datos se añadirá a la cola interna para que los usuarios del stream lo consuman. Pasar `chunk` como `null` indica el final del stream (EOF), después del cual no se pueden escribir más datos.

Cuando el `Readable` está operando en modo pausado, los datos añadidos con `readable.push()` se pueden leer llamando al método [`readable.read()`](/es/nodejs/api/stream#readablereadsize) cuando se emite el evento [`'readable'`](/es/nodejs/api/stream#event-readable).

Cuando el `Readable` está operando en modo fluido, los datos añadidos con `readable.push()` se entregarán emitiendo un evento `'data'`.

El método `readable.push()` está diseñado para ser lo más flexible posible. Por ejemplo, al envolver una fuente de nivel inferior que proporciona alguna forma de mecanismo de pausa/reanudación, y un callback de datos, la fuente de bajo nivel puede ser envuelta por la instancia `Readable` personalizada:

```js [ESM]
// `_source` es un objeto con métodos readStop() y readStart(),
// y un miembro `ondata` que se llama cuando tiene datos, y
// un miembro `onend` que se llama cuando los datos terminan.

class SourceWrapper extends Readable {
  constructor(options) {
    super(options);

    this._source = getLowLevelSourceObject();

    // Cada vez que hay datos, insértelos en el buffer interno.
    this._source.ondata = (chunk) => {
      // Si push() devuelve false, entonces deje de leer de la fuente.
      if (!this.push(chunk))
        this._source.readStop();
    };

    // Cuando la fuente termina, inserte el chunk `null` que indica EOF.
    this._source.onend = () => {
      this.push(null);
    };
  }
  // _read() se llamará cuando el stream quiera extraer más datos.
  // El argumento de tamaño de asesoramiento se ignora en este caso.
  _read(size) {
    this._source.readStart();
  }
}
```
El método `readable.push()` se utiliza para insertar el contenido en el buffer interno. Puede ser impulsado por el método [`readable._read()`](/es/nodejs/api/stream#readable_readsize).

Para los streams que no operan en modo objeto, si el parámetro `chunk` de `readable.push()` es `undefined`, se tratará como una cadena o buffer vacío. Consulte [`readable.push('')`](/es/nodejs/api/stream#readablepush) para obtener más información.


#### Errores durante la lectura {#errors-while-reading}

Los errores que ocurran durante el procesamiento de [`readable._read()`](/es/nodejs/api/stream#readable_readsize) deben propagarse a través del método [`readable.destroy(err)`](/es/nodejs/api/stream#readable_destroyerr-callback). Lanzar un `Error` desde dentro de [`readable._read()`](/es/nodejs/api/stream#readable_readsize) o emitir manualmente un evento `'error'` resulta en un comportamiento indefinido.

```js [ESM]
const { Readable } = require('node:stream');

const myReadable = new Readable({
  read(size) {
    const err = checkSomeErrorCondition();
    if (err) {
      this.destroy(err);
    } else {
      // Do some work.
    }
  },
});
```
#### Un ejemplo de flujo de conteo {#an-example-counting-stream}

El siguiente es un ejemplo básico de un flujo `Readable` que emite los números del 1 al 1,000,000 en orden ascendente y luego finaliza.

```js [ESM]
const { Readable } = require('node:stream');

class Counter extends Readable {
  constructor(opt) {
    super(opt);
    this._max = 1000000;
    this._index = 1;
  }

  _read() {
    const i = this._index++;
    if (i > this._max)
      this.push(null);
    else {
      const str = String(i);
      const buf = Buffer.from(str, 'ascii');
      this.push(buf);
    }
  }
}
```
### Implementación de un flujo dúplex {#implementing-a-duplex-stream}

Un flujo [`Duplex`](/es/nodejs/api/stream#class-streamduplex) es aquel que implementa tanto [`Readable`](/es/nodejs/api/stream#class-streamreadable) como [`Writable`](/es/nodejs/api/stream#class-streamwritable), como una conexión de socket TCP.

Debido a que JavaScript no tiene soporte para la herencia múltiple, la clase `stream.Duplex` se extiende para implementar un flujo [`Duplex`](/es/nodejs/api/stream#class-streamduplex) (en lugar de extender las clases `stream.Readable` *y* `stream.Writable`).

La clase `stream.Duplex` hereda prototípicamente de `stream.Readable` y parasitariamente de `stream.Writable`, pero `instanceof` funcionará correctamente para ambas clases base debido a la anulación de [`Symbol.hasInstance`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance) en `stream.Writable`.

Los flujos `Duplex` personalizados *deben* llamar al constructor `new stream.Duplex([options])` e implementar *tanto* los métodos [`readable._read()`](/es/nodejs/api/stream#readable_readsize) como `writable._write()`.


#### `new stream.Duplex(options)` {#new-streamduplexoptions}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v8.4.0 | Las opciones `readableHighWaterMark` y `writableHighWaterMark` ahora son compatibles. |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Pasado a los constructores `Writable` y `Readable`. También tiene los siguientes campos:
    - `allowHalfOpen` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en `false`, entonces el stream finalizará automáticamente el lado de escritura cuando finalice el lado de lectura. **Predeterminado:** `true`.
    - `readable` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Establece si el `Duplex` debe ser legible. **Predeterminado:** `true`.
    - `writable` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Establece si el `Duplex` debe ser escribible. **Predeterminado:** `true`.
    - `readableObjectMode` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Establece `objectMode` para el lado legible del stream. No tiene efecto si `objectMode` es `true`. **Predeterminado:** `false`.
    - `writableObjectMode` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Establece `objectMode` para el lado escribible del stream. No tiene efecto si `objectMode` es `true`. **Predeterminado:** `false`.
    - `readableHighWaterMark` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece `highWaterMark` para el lado legible del stream. No tiene efecto si se proporciona `highWaterMark`.
    - `writableHighWaterMark` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece `highWaterMark` para el lado escribible del stream. No tiene efecto si se proporciona `highWaterMark`.

```js [ESM]
const { Duplex } = require('node:stream');

class MyDuplex extends Duplex {
  constructor(options) {
    super(options);
    // ...
  }
}
```
O, al usar constructores de estilo pre-ES6:

```js [ESM]
const { Duplex } = require('node:stream');
const util = require('node:util');

function MyDuplex(options) {
  if (!(this instanceof MyDuplex))
    return new MyDuplex(options);
  Duplex.call(this, options);
}
util.inherits(MyDuplex, Duplex);
```
O, usando el enfoque simplificado del constructor:

```js [ESM]
const { Duplex } = require('node:stream');

const myDuplex = new Duplex({
  read(size) {
    // ...
  },
  write(chunk, encoding, callback) {
    // ...
  },
});
```
Cuando se usa pipeline:

```js [ESM]
const { Transform, pipeline } = require('node:stream');
const fs = require('node:fs');

pipeline(
  fs.createReadStream('object.json')
    .setEncoding('utf8'),
  new Transform({
    decodeStrings: false, // Accept string input rather than Buffers
    construct(callback) {
      this.data = '';
      callback();
    },
    transform(chunk, encoding, callback) {
      this.data += chunk;
      callback();
    },
    flush(callback) {
      try {
        // Make sure is valid json.
        JSON.parse(this.data);
        this.push(this.data);
        callback();
      } catch (err) {
        callback(err);
      }
    },
  }),
  fs.createWriteStream('valid-object.json'),
  (err) => {
    if (err) {
      console.error('failed', err);
    } else {
      console.log('completed');
    }
  },
);
```

#### Un ejemplo de stream dúplex {#an-example-duplex-stream}

Lo siguiente ilustra un ejemplo simple de un stream `Duplex` que envuelve un objeto fuente hipotético de nivel inferior al que se pueden escribir datos y del cual se pueden leer datos, aunque utilizando una API que no es compatible con los streams de Node.js. Lo siguiente ilustra un ejemplo simple de un stream `Duplex` que almacena en búfer los datos escritos entrantes a través de la interfaz [`Writable`](/es/nodejs/api/stream#class-streamwritable) que se lee de nuevo a través de la interfaz [`Readable`](/es/nodejs/api/stream#class-streamreadable).

```js [ESM]
const { Duplex } = require('node:stream');
const kSource = Symbol('source');

class MyDuplex extends Duplex {
  constructor(source, options) {
    super(options);
    this[kSource] = source;
  }

  _write(chunk, encoding, callback) {
    // La fuente subyacente solo se ocupa de cadenas.
    if (Buffer.isBuffer(chunk))
      chunk = chunk.toString();
    this[kSource].writeSomeData(chunk);
    callback();
  }

  _read(size) {
    this[kSource].fetchSomeData(size, (data, encoding) => {
      this.push(Buffer.from(data, encoding));
    });
  }
}
```
El aspecto más importante de un stream `Duplex` es que los lados `Readable` y `Writable` operan independientemente el uno del otro a pesar de coexistir dentro de una sola instancia de objeto.

#### Streams dúplex en modo objeto {#object-mode-duplex-streams}

Para los streams `Duplex`, `objectMode` se puede establecer exclusivamente para el lado `Readable` o `Writable` utilizando las opciones `readableObjectMode` y `writableObjectMode` respectivamente.

En el siguiente ejemplo, por ejemplo, se crea un nuevo stream `Transform` (que es un tipo de stream [`Duplex`](/es/nodejs/api/stream#class-streamduplex)) que tiene un lado `Writable` en modo objeto que acepta números de JavaScript que se convierten en cadenas hexadecimales en el lado `Readable`.

```js [ESM]
const { Transform } = require('node:stream');

// Todos los streams Transform también son Streams Duplex.
const myTransform = new Transform({
  writableObjectMode: true,

  transform(chunk, encoding, callback) {
    // Coaccionar el chunk a un número si es necesario.
    chunk |= 0;

    // Transformar el chunk en otra cosa.
    const data = chunk.toString(16);

    // Insertar los datos en la cola de lectura.
    callback(null, '0'.repeat(data.length % 2) + data);
  },
});

myTransform.setEncoding('ascii');
myTransform.on('data', (chunk) => console.log(chunk));

myTransform.write(1);
// Imprime: 01
myTransform.write(10);
// Imprime: 0a
myTransform.write(100);
// Imprime: 64
```

### Implementación de un stream de transformación {#implementing-a-transform-stream}

Un stream [`Transform`](/es/nodejs/api/stream#class-streamtransform) es un stream [`Duplex`](/es/nodejs/api/stream#class-streamduplex) donde la salida se calcula de alguna manera a partir de la entrada. Los ejemplos incluyen streams de [zlib](/es/nodejs/api/zlib) o streams de [crypto](/es/nodejs/api/crypto) que comprimen, encriptan o desencriptan datos.

No es obligatorio que la salida tenga el mismo tamaño que la entrada, el mismo número de fragmentos o que llegue al mismo tiempo. Por ejemplo, un stream `Hash` solo tendrá un único fragmento de salida que se proporciona cuando finaliza la entrada. Un stream `zlib` producirá una salida que es mucho más pequeña o mucho más grande que su entrada.

La clase `stream.Transform` se extiende para implementar un stream [`Transform`](/es/nodejs/api/stream#class-streamtransform).

La clase `stream.Transform` hereda prototípicamente de `stream.Duplex` e implementa sus propias versiones de los métodos `writable._write()` y [`readable._read()`](/es/nodejs/api/stream#readable_readsize). Las implementaciones personalizadas de `Transform` *deben* implementar el método [`transform._transform()`](/es/nodejs/api/stream#transform_transformchunk-encoding-callback) y *también pueden* implementar el método [`transform._flush()`](/es/nodejs/api/stream#transform_flushcallback).

Se debe tener cuidado al usar streams `Transform`, ya que los datos escritos en el stream pueden provocar que el lado `Writable` del stream se pause si la salida en el lado `Readable` no se consume.

#### `new stream.Transform([options])` {#new-streamtransformoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Se pasa a los constructores `Writable` y `Readable`. También tiene los siguientes campos:
    - `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementación para el método [`stream._transform()`](/es/nodejs/api/stream#transform_transformchunk-encoding-callback).
    - `flush` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implementación para el método [`stream._flush()`](/es/nodejs/api/stream#transform_flushcallback).

```js [ESM]
const { Transform } = require('node:stream');

class MyTransform extends Transform {
  constructor(options) {
    super(options);
    // ...
  }
}
```
O, al usar constructores de estilo pre-ES6:

```js [ESM]
const { Transform } = require('node:stream');
const util = require('node:util');

function MyTransform(options) {
  if (!(this instanceof MyTransform))
    return new MyTransform(options);
  Transform.call(this, options);
}
util.inherits(MyTransform, Transform);
```
O, usando el enfoque de constructor simplificado:

```js [ESM]
const { Transform } = require('node:stream');

const myTransform = new Transform({
  transform(chunk, encoding, callback) {
    // ...
  },
});
```

#### Evento: `'end'` {#event-end_1}

El evento [`'end'`](/es/nodejs/api/stream#event-end) proviene de la clase `stream.Readable`. El evento `'end'` se emite después de que se hayan emitido todos los datos, lo que ocurre después de que se haya llamado a la función de retrollamada en [`transform._flush()`](/es/nodejs/api/stream#transform_flushcallback). En caso de error, no se debe emitir `'end'`.

#### Evento: `'finish'` {#event-finish_1}

El evento [`'finish'`](/es/nodejs/api/stream#event-finish) proviene de la clase `stream.Writable`. El evento `'finish'` se emite después de que se llame a [`stream.end()`](/es/nodejs/api/stream#writableendchunk-encoding-callback) y todos los fragmentos hayan sido procesados por [`stream._transform()`](/es/nodejs/api/stream#transform_transformchunk-encoding-callback). En caso de error, no se debe emitir `'finish'`.

#### `transform._flush(callback)` {#transform_flushcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función de retrollamada (opcionalmente con un argumento de error y datos) que se llamará cuando se hayan vaciado los datos restantes.

Esta función NO DEBE ser llamada directamente por el código de la aplicación. Debe ser implementada por las clases secundarias, y llamada sólo por los métodos internos de la clase `Readable`.

En algunos casos, una operación de transformación puede necesitar emitir un bit adicional de datos al final del flujo. Por ejemplo, un flujo de compresión `zlib` almacenará una cantidad de estado interno utilizado para comprimir óptimamente la salida. Sin embargo, cuando el flujo termina, esos datos adicionales deben ser vaciados para que los datos comprimidos estén completos.

Las implementaciones personalizadas de [`Transform`](/es/nodejs/api/stream#class-streamtransform) *pueden* implementar el método `transform._flush()`. Este se llamará cuando no haya más datos escritos para consumir, pero antes de que se emita el evento [`'end'`](/es/nodejs/api/stream#event-end) que indica el final del flujo [`Readable`](/es/nodejs/api/stream#class-streamreadable).

Dentro de la implementación de `transform._flush()`, el método `transform.push()` puede ser llamado cero o más veces, según corresponda. La función `callback` debe ser llamada cuando la operación de vaciado se complete.

El método `transform._flush()` está precedido por un guión bajo porque es interno a la clase que lo define, y nunca debe ser llamado directamente por los programas de usuario.


#### `transform._transform(chunk, encoding, callback)` {#transform_transformchunk-encoding-callback}

- `chunk` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) El `Buffer` que se va a transformar, convertido desde la `string` pasada a [`stream.write()`](/es/nodejs/api/stream#writablewritechunk-encoding-callback). Si la opción `decodeStrings` del flujo es `false` o el flujo está operando en modo de objeto, el chunk no se convertirá y será lo que se haya pasado a [`stream.write()`](/es/nodejs/api/stream#writablewritechunk-encoding-callback).
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si el chunk es una string, entonces este es el tipo de codificación. Si el chunk es un buffer, entonces este es el valor especial `'buffer'`. Ignórelo en ese caso.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función de callback (opcionalmente con un argumento de error y datos) que se llamará después de que el `chunk` suministrado haya sido procesado.

Esta función NO DEBE ser llamada directamente por el código de la aplicación. Debe ser implementada por las clases hijas, y llamada solo por los métodos internos de la clase `Readable`.

Todas las implementaciones de flujo `Transform` deben proporcionar un método `_transform()` para aceptar la entrada y producir la salida. La implementación `transform._transform()` maneja los bytes que se están escribiendo, calcula una salida y luego pasa esa salida a la parte legible usando el método `transform.push()`.

El método `transform.push()` puede ser llamado cero o más veces para generar la salida desde un único chunk de entrada, dependiendo de cuánto se debe emitir como resultado del chunk.

Es posible que no se genere ninguna salida a partir de un chunk dado de datos de entrada.

La función `callback` debe ser llamada solo cuando el chunk actual se consume por completo. El primer argumento pasado al `callback` debe ser un objeto `Error` si ocurrió un error mientras se procesaba la entrada o `null` de lo contrario. Si se pasa un segundo argumento al `callback`, se reenviará al método `transform.push()`, pero solo si el primer argumento es falso. En otras palabras, lo siguiente es equivalente:

```js [ESM]
transform.prototype._transform = function(data, encoding, callback) {
  this.push(data);
  callback();
};

transform.prototype._transform = function(data, encoding, callback) {
  callback(null, data);
};
```
El método `transform._transform()` tiene el prefijo de un guion bajo porque es interno a la clase que lo define, y nunca debe ser llamado directamente por los programas de usuario.

`transform._transform()` nunca se llama en paralelo; los flujos implementan un mecanismo de cola, y para recibir el siguiente chunk, `callback` debe ser llamado, ya sea sincrónica o asincrónicamente.


#### Clase: `stream.PassThrough` {#class-streampassthrough}

La clase `stream.PassThrough` es una implementación trivial de un stream [`Transform`](/es/nodejs/api/stream#class-streamtransform) que simplemente pasa los bytes de entrada a la salida. Su propósito es principalmente para ejemplos y pruebas, pero hay algunos casos de uso donde `stream.PassThrough` es útil como un bloque de construcción para nuevos tipos de streams.

## Notas adicionales {#additional-notes}

### Compatibilidad de los streams con generadores asíncronos e iteradores asíncronos {#streams-compatibility-with-async-generators-and-async-iterators}

Con el soporte de generadores asíncronos e iteradores en JavaScript, los generadores asíncronos son efectivamente una construcción de stream de primer nivel en el lenguaje en este momento.

Algunos casos comunes de interoperabilidad del uso de streams de Node.js con generadores asíncronos e iteradores asíncronos se proporcionan a continuación.

#### Consumo de streams legibles con iteradores asíncronos {#consuming-readable-streams-with-async-iterators}

```js [ESM]
(async function() {
  for await (const chunk of readable) {
    console.log(chunk);
  }
})();
```
Los iteradores asíncronos registran un controlador de errores permanente en el stream para evitar cualquier error no manejado posterior a la destrucción.

#### Creación de streams legibles con generadores asíncronos {#creating-readable-streams-with-async-generators}

Un stream legible de Node.js se puede crear a partir de un generador asíncrono utilizando el método de utilidad `Readable.from()`:

```js [ESM]
const { Readable } = require('node:stream');

const ac = new AbortController();
const signal = ac.signal;

async function * generate() {
  yield 'a';
  await someLongRunningFn({ signal });
  yield 'b';
  yield 'c';
}

const readable = Readable.from(generate());
readable.on('close', () => {
  ac.abort();
});

readable.on('data', (chunk) => {
  console.log(chunk);
});
```
#### Canalización a streams de escritura desde iteradores asíncronos {#piping-to-writable-streams-from-async-iterators}

Al escribir en un stream de escritura desde un iterador asíncrono, asegúrese de un manejo correcto de la contrapresión y los errores. [`stream.pipeline()`](/es/nodejs/api/stream#streampipelinesource-transforms-destination-callback) abstrae el manejo de la contrapresión y los errores relacionados con la contrapresión:

```js [ESM]
const fs = require('node:fs');
const { pipeline } = require('node:stream');
const { pipeline: pipelinePromise } = require('node:stream/promises');

const writable = fs.createWriteStream('./file');

const ac = new AbortController();
const signal = ac.signal;

const iterator = createIterator({ signal });

// Callback Pattern
pipeline(iterator, writable, (err, value) => {
  if (err) {
    console.error(err);
  } else {
    console.log(value, 'value returned');
  }
}).on('close', () => {
  ac.abort();
});

// Promise Pattern
pipelinePromise(iterator, writable)
  .then((value) => {
    console.log(value, 'value returned');
  })
  .catch((err) => {
    console.error(err);
    ac.abort();
  });
```

### Compatibilidad con versiones anteriores de Node.js {#compatibility-with-older-nodejs-versions}

Antes de Node.js 0.10, la interfaz del flujo `Readable` era más simple, pero también menos potente y menos útil.

- En lugar de esperar llamadas al método [`stream.read()`](/es/nodejs/api/stream#readablereadsize), los eventos [`'data'`](/es/nodejs/api/stream#event-data) comenzaban a emitirse inmediatamente. Las aplicaciones que necesitaran realizar alguna cantidad de trabajo para decidir cómo manejar los datos debían almacenar los datos leídos en búferes para que los datos no se perdieran.
- El método [`stream.pause()`](/es/nodejs/api/stream#readablepause) era consultivo, en lugar de garantizado. Esto significaba que todavía era necesario estar preparado para recibir eventos [`'data'`](/es/nodejs/api/stream#event-data) *incluso cuando el flujo estaba en un estado de pausa*.

En Node.js 0.10, se añadió la clase [`Readable`](/es/nodejs/api/stream#class-streamreadable). Para la compatibilidad con versiones anteriores de los programas de Node.js, los flujos `Readable` cambian al "modo de flujo" cuando se añade un controlador de eventos [`'data'`](/es/nodejs/api/stream#event-data), o cuando se llama al método [`stream.resume()`](/es/nodejs/api/stream#readableresume). El efecto es que, incluso cuando no se utilizan el nuevo método [`stream.read()`](/es/nodejs/api/stream#readablereadsize) y el evento [`'readable'`](/es/nodejs/api/stream#event-readable), ya no es necesario preocuparse por la pérdida de fragmentos [`'data'`](/es/nodejs/api/stream#event-data).

Si bien la mayoría de las aplicaciones seguirán funcionando normalmente, esto introduce un caso límite en las siguientes condiciones:

- No se añade ningún listener de eventos [`'data'`](/es/nodejs/api/stream#event-data).
- Nunca se llama al método [`stream.resume()`](/es/nodejs/api/stream#readableresume).
- El flujo no se canaliza a ningún destino de escritura.

Por ejemplo, considere el siguiente código:

```js [ESM]
// ¡ADVERTENCIA! ¡ESTÁ ROTO!
net.createServer((socket) => {

  // Añadimos un listener 'end', pero nunca consumimos los datos.
  socket.on('end', () => {
    // Nunca llegará aquí.
    socket.end('El mensaje fue recibido pero no fue procesado.\n');
  });

}).listen(1337);
```
Antes de Node.js 0.10, los datos del mensaje entrante simplemente se descartaban. Sin embargo, en Node.js 0.10 y posteriores, el socket permanece en pausa para siempre.

La solución en esta situación es llamar al método [`stream.resume()`](/es/nodejs/api/stream#readableresume) para comenzar el flujo de datos:

```js [ESM]
// Solución.
net.createServer((socket) => {
  socket.on('end', () => {
    socket.end('El mensaje fue recibido pero no fue procesado.\n');
  });

  // Inicia el flujo de datos, descartándolo.
  socket.resume();
}).listen(1337);
```
Además de los nuevos flujos `Readable` que cambian al modo de flujo, los flujos de estilo pre-0.10 pueden envolverse en una clase `Readable` utilizando el método [`readable.wrap()`](/es/nodejs/api/stream#readablewrapstream).


### `readable.read(0)` {#readableread0}

Hay algunos casos en los que es necesario activar una actualización de los mecanismos subyacentes del flujo legible, sin consumir realmente ningún dato. En tales casos, es posible llamar a `readable.read(0)`, que siempre devolverá `null`.

Si el búfer de lectura interno está por debajo de `highWaterMark` y el flujo no está leyendo actualmente, entonces llamar a `stream.read(0)` activará una llamada de bajo nivel a [`stream._read()`](/es/nodejs/api/stream#readable_readsize).

Si bien la mayoría de las aplicaciones casi nunca necesitarán hacer esto, existen situaciones dentro de Node.js donde esto se hace, particularmente en el interior de la clase de flujo `Readable`.

### `readable.push('')` {#readablepush}

No se recomienda el uso de `readable.push('')`.

Enviar una [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/es/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) o [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) de byte cero a un flujo que no está en modo objeto tiene un efecto secundario interesante. Debido a que *es* una llamada a [`readable.push()`](/es/nodejs/api/stream#readablepushchunk-encoding), la llamada finalizará el proceso de lectura. Sin embargo, debido a que el argumento es una cadena vacía, no se agregan datos al búfer legible, por lo que no hay nada para que un usuario consuma.

### Discrepancia de `highWaterMark` después de llamar a `readable.setEncoding()` {#highwatermark-discrepancy-after-calling-readablesetencoding}

El uso de `readable.setEncoding()` cambiará el comportamiento de cómo opera `highWaterMark` en modo no objeto.

Normalmente, el tamaño del búfer actual se mide con respecto a `highWaterMark` en *bytes*. Sin embargo, después de llamar a `setEncoding()`, la función de comparación comenzará a medir el tamaño del búfer en *caracteres*.

Esto no es un problema en casos comunes con `latin1` o `ascii`. Pero se aconseja tener en cuenta este comportamiento cuando se trabaja con cadenas que podrían contener caracteres multibyte.

