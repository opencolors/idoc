---
title: Documentación de Node.js - Zlib
description: El módulo zlib en Node.js proporciona funcionalidades de compresión utilizando los algoritmos Gzip, Deflate/Inflate y Brotli. Incluye métodos síncronos y asíncronos para comprimir y descomprimir datos, junto con varias opciones para personalizar el comportamiento de la compresión.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - Zlib | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: El módulo zlib en Node.js proporciona funcionalidades de compresión utilizando los algoritmos Gzip, Deflate/Inflate y Brotli. Incluye métodos síncronos y asíncronos para comprimir y descomprimir datos, junto con varias opciones para personalizar el comportamiento de la compresión.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - Zlib | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: El módulo zlib en Node.js proporciona funcionalidades de compresión utilizando los algoritmos Gzip, Deflate/Inflate y Brotli. Incluye métodos síncronos y asíncronos para comprimir y descomprimir datos, junto con varias opciones para personalizar el comportamiento de la compresión.
---


# Zlib {#zlib}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código Fuente:** [lib/zlib.js](https://github.com/nodejs/node/blob/v23.5.0/lib/zlib.js)

El módulo `node:zlib` proporciona funcionalidad de compresión implementada utilizando Gzip, Deflate/Inflate y Brotli.

Para acceder a él:

::: code-group
```js [ESM]
import os from 'node:zlib';
```

```js [CJS]
const zlib = require('node:zlib');
```
:::

La compresión y descompresión se construyen alrededor de la [API de Streams](/es/nodejs/api/stream) de Node.js.

La compresión o descompresión de un stream (como un archivo) se puede lograr canalizando el stream de origen a través de un stream `Transform` de `zlib` a un stream de destino:

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';
import process from 'node:process';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream';

const gzip = createGzip();
const source = createReadStream('input.txt');
const destination = createWriteStream('input.txt.gz');

pipeline(source, gzip, destination, (err) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
});
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');
const process = require('node:process');
const { createGzip } = require('node:zlib');
const { pipeline } = require('node:stream');

const gzip = createGzip();
const source = createReadStream('input.txt');
const destination = createWriteStream('input.txt.gz');

pipeline(source, gzip, destination, (err) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
});
```
:::

O, usando la API `pipeline` basada en promesas:

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';
import process from 'node:process';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

async function do_gzip(input, output) {
  const gzip = createGzip();
  const source = createReadStream(input);
  const destination = createWriteStream(output);
  await pipeline(source, gzip, destination);
}

await do_gzip('input.txt', 'input.txt.gz');
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');
const process = require('node:process');
const { createGzip } = require('node:zlib');
const { pipeline } = require('node:stream/promises');

async function do_gzip(input, output) {
  const gzip = createGzip();
  const source = createReadStream(input);
  const destination = createWriteStream(output);
  await pipeline(source, gzip, destination);
}

do_gzip('input.txt', 'input.txt.gz')
  .catch((err) => {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  });
```
:::

También es posible comprimir o descomprimir datos en un solo paso:

::: code-group
```js [ESM]
import process from 'node:process';
import { Buffer } from 'node:buffer';
import { deflate, unzip } from 'node:zlib';

const input = '.................................';
deflate(input, (err, buffer) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString('base64'));
});

const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
unzip(buffer, (err, buffer) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString());
});

// Or, Promisified

import { promisify } from 'node:util';
const do_unzip = promisify(unzip);

const unzippedBuffer = await do_unzip(buffer);
console.log(unzippedBuffer.toString());
```

```js [CJS]
const { deflate, unzip } = require('node:zlib');

const input = '.................................';
deflate(input, (err, buffer) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString('base64'));
});

const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
unzip(buffer, (err, buffer) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString());
});

// Or, Promisified

const { promisify } = require('node:util');
const do_unzip = promisify(unzip);

do_unzip(buffer)
  .then((buf) => console.log(buf.toString()))
  .catch((err) => {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  });
```
:::

## Uso del grupo de hilos y consideraciones de rendimiento {#threadpool-usage-and-performance-considerations}

Todas las API de `zlib`, excepto aquellas que son explícitamente síncronas, utilizan el grupo de hilos interno de Node.js. Esto puede llevar a efectos sorprendentes y limitaciones de rendimiento en algunas aplicaciones.

Crear y usar un gran número de objetos zlib simultáneamente puede causar una fragmentación significativa de la memoria.

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import { Buffer } from 'node:buffer';

const payload = Buffer.from('This is some data');

// ADVERTENCIA: ¡NO HAGA ESTO!
for (let i = 0; i < 30000; ++i) {
  zlib.deflate(payload, (err, buffer) => {});
}
```

```js [CJS]
const zlib = require('node:zlib');

const payload = Buffer.from('This is some data');

// ADVERTENCIA: ¡NO HAGA ESTO!
for (let i = 0; i < 30000; ++i) {
  zlib.deflate(payload, (err, buffer) => {});
}
```
:::

En el ejemplo anterior, se crean 30,000 instancias de deflate concurrentemente. Debido a cómo algunos sistemas operativos manejan la asignación y desasignación de memoria, esto puede llevar a una fragmentación significativa de la memoria.

Se recomienda encarecidamente que los resultados de las operaciones de compresión se almacenen en caché para evitar la duplicación de esfuerzos.

## Comprimiendo solicitudes y respuestas HTTP {#compressing-http-requests-and-responses}

El módulo `node:zlib` se puede utilizar para implementar soporte para los mecanismos de codificación de contenido `gzip`, `deflate` y `br` definidos por [HTTP](https://tools.ietf.org/html/rfc7230#section-4.2).

La cabecera HTTP [`Accept-Encoding`](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14#sec14.3) se utiliza dentro de una petición HTTP para identificar las codificaciones de compresión aceptadas por el cliente. La cabecera [`Content-Encoding`](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14#sec14.11) se utiliza para identificar las codificaciones de compresión realmente aplicadas a un mensaje.

Los ejemplos que se dan a continuación están drásticamente simplificados para mostrar el concepto básico. El uso de la codificación `zlib` puede ser costoso, y los resultados deben ser almacenados en caché. Vea [Ajuste del uso de memoria](/es/nodejs/api/zlib#memory-usage-tuning) para más información sobre las contrapartidas de velocidad/memoria/compresión involucradas en el uso de `zlib`.

::: code-group
```js [ESM]
// Client request example
import fs from 'node:fs';
import zlib from 'node:zlib';
import http from 'node:http';
import process from 'node:process';
import { pipeline } from 'node:stream';

const request = http.get({ host: 'example.com',
                           path: '/',
                           port: 80,
                           headers: { 'Accept-Encoding': 'br,gzip,deflate' } });
request.on('response', (response) => {
  const output = fs.createWriteStream('example.com_index.html');

  const onError = (err) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
  };

  switch (response.headers['content-encoding']) {
    case 'br':
      pipeline(response, zlib.createBrotliDecompress(), output, onError);
      break;
    // Or, just use zlib.createUnzip() to handle both of the following cases:
    case 'gzip':
      pipeline(response, zlib.createGunzip(), output, onError);
      break;
    case 'deflate':
      pipeline(response, zlib.createInflate(), output, onError);
      break;
    default:
      pipeline(response, output, onError);
      break;
  }
});
```

```js [CJS]
// Client request example
const zlib = require('node:zlib');
const http = require('node:http');
const fs = require('node:fs');
const { pipeline } = require('node:stream');

const request = http.get({ host: 'example.com',
                           path: '/',
                           port: 80,
                           headers: { 'Accept-Encoding': 'br,gzip,deflate' } });
request.on('response', (response) => {
  const output = fs.createWriteStream('example.com_index.html');

  const onError = (err) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
  };

  switch (response.headers['content-encoding']) {
    case 'br':
      pipeline(response, zlib.createBrotliDecompress(), output, onError);
      break;
    // Or, just use zlib.createUnzip() to handle both of the following cases:
    case 'gzip':
      pipeline(response, zlib.createGunzip(), output, onError);
      break;
    case 'deflate':
      pipeline(response, zlib.createInflate(), output, onError);
      break;
    default:
      pipeline(response, output, onError);
      break;
  }
});
```
:::

::: code-group
```js [ESM]
// server example
// Running a gzip operation on every request is quite expensive.
// It would be much more efficient to cache the compressed buffer.
import zlib from 'node:zlib';
import http from 'node:http';
import fs from 'node:fs';
import { pipeline } from 'node:stream';

http.createServer((request, response) => {
  const raw = fs.createReadStream('index.html');
  // Store both a compressed and an uncompressed version of the resource.
  response.setHeader('Vary', 'Accept-Encoding');
  const acceptEncoding = request.headers['accept-encoding'] || '';

  const onError = (err) => {
    if (err) {
      // If an error occurs, there's not much we can do because
      // the server has already sent the 200 response code and
      // some amount of data has already been sent to the client.
      // The best we can do is terminate the response immediately
      // and log the error.
      response.end();
      console.error('An error occurred:', err);
    }
  };

  // Note: This is not a conformant accept-encoding parser.
  // See https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
  if (/\bdeflate\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'deflate' });
    pipeline(raw, zlib.createDeflate(), response, onError);
  } else if (/\bgzip\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'gzip' });
    pipeline(raw, zlib.createGzip(), response, onError);
  } else if (/\bbr\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'br' });
    pipeline(raw, zlib.createBrotliCompress(), response, onError);
  } else {
    response.writeHead(200, {});
    pipeline(raw, response, onError);
  }
}).listen(1337);
```

```js [CJS]
// server example
// Running a gzip operation on every request is quite expensive.
// It would be much more efficient to cache the compressed buffer.
const zlib = require('node:zlib');
const http = require('node:http');
const fs = require('node:fs');
const { pipeline } = require('node:stream');

http.createServer((request, response) => {
  const raw = fs.createReadStream('index.html');
  // Store both a compressed and an uncompressed version of the resource.
  response.setHeader('Vary', 'Accept-Encoding');
  const acceptEncoding = request.headers['accept-encoding'] || '';

  const onError = (err) => {
    if (err) {
      // If an error occurs, there's not much we can do because
      // the server has already sent the 200 response code and
      // some amount of data has already been sent to the client.
      // The best we can do is terminate the response immediately
      // and log the error.
      response.end();
      console.error('An error occurred:', err);
    }
  };

  // Note: This is not a conformant accept-encoding parser.
  // See https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
  if (/\bdeflate\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'deflate' });
    pipeline(raw, zlib.createDeflate(), response, onError);
  } else if (/\bgzip\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'gzip' });
    pipeline(raw, zlib.createGzip(), response, onError);
  } else if (/\bbr\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'br' });
    pipeline(raw, zlib.createBrotliCompress(), response, onError);
  } else {
    response.writeHead(200, {});
    pipeline(raw, response, onError);
  }
}).listen(1337);
```
:::

Por defecto, los métodos `zlib` lanzarán un error al descomprimir datos truncados. Sin embargo, si se sabe que los datos están incompletos, o se desea inspeccionar sólo el principio de un archivo comprimido, es posible suprimir el manejo de errores por defecto cambiando el método de vaciado que se utiliza para descomprimir el último trozo de datos de entrada:

```js [ESM]
// This is a truncated version of the buffer from the above examples
const buffer = Buffer.from('eJzT0yMA', 'base64');

zlib.unzip(
  buffer,
  // For Brotli, the equivalent is zlib.constants.BROTLI_OPERATION_FLUSH.
  { finishFlush: zlib.constants.Z_SYNC_FLUSH },
  (err, buffer) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
    console.log(buffer.toString());
  });
```
Esto no cambiará el comportamiento en otras situaciones de lanzamiento de errores, por ejemplo, cuando los datos de entrada tienen un formato inválido. Usando este método, no será posible determinar si la entrada terminó prematuramente o carece de las comprobaciones de integridad, haciendo necesario comprobar manualmente que el resultado descomprimido es válido.


## Ajuste del uso de memoria {#memory-usage-tuning}

### Para flujos basados en zlib {#for-zlib-based-streams}

Desde `zlib/zconf.h`, modificado para el uso de Node.js:

Los requisitos de memoria para deflate son (en bytes):

```js [ESM]
(1 << (windowBits + 2)) + (1 << (memLevel + 9))
```
Es decir: 128K para `windowBits` = 15 + 128K para `memLevel` = 8 (valores predeterminados) más unos pocos kilobytes para objetos pequeños.

Por ejemplo, para reducir los requisitos de memoria predeterminados de 256K a 128K, las opciones deben establecerse en:

```js [ESM]
const options = { windowBits: 14, memLevel: 7 };
```
Sin embargo, esto generalmente degradará la compresión.

Los requisitos de memoria para inflate son (en bytes) `1 \<\< windowBits`. Es decir, 32K para `windowBits` = 15 (valor predeterminado) más unos pocos kilobytes para objetos pequeños.

Esto se suma a un único búfer de salida interno de tamaño `chunkSize`, que por defecto es 16K.

La velocidad de la compresión `zlib` se ve afectada de manera más dramática por la configuración `level`. Un nivel más alto resultará en una mejor compresión, pero tardará más en completarse. Un nivel más bajo resultará en menos compresión, pero será mucho más rápido.

En general, las opciones de mayor uso de memoria significarán que Node.js tiene que hacer menos llamadas a `zlib` porque podrá procesar más datos en cada operación `write`. Por lo tanto, este es otro factor que afecta la velocidad, a costa del uso de memoria.

### Para flujos basados en Brotli {#for-brotli-based-streams}

Existen equivalentes a las opciones de zlib para flujos basados en Brotli, aunque estas opciones tienen rangos diferentes a las de zlib:

- La opción `level` de zlib coincide con la opción `BROTLI_PARAM_QUALITY` de Brotli.
- La opción `windowBits` de zlib coincide con la opción `BROTLI_PARAM_LGWIN` de Brotli.

Consulte [abajo](/es/nodejs/api/zlib#brotli-constants) para obtener más detalles sobre las opciones específicas de Brotli.

## Vaciado {#flushing}

Llamar a [`.flush()`](/es/nodejs/api/zlib#zlibflushkind-callback) en un flujo de compresión hará que `zlib` devuelva la mayor cantidad de salida posible en ese momento. Esto puede tener un costo en la calidad de la compresión, pero puede ser útil cuando los datos deben estar disponibles lo antes posible.

En el siguiente ejemplo, `flush()` se usa para escribir una respuesta HTTP parcial comprimida al cliente:

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import http from 'node:http';
import { pipeline } from 'node:stream';

http.createServer((request, response) => {
  // En aras de la simplicidad, se omiten las comprobaciones de Accept-Encoding.
  response.writeHead(200, { 'content-encoding': 'gzip' });
  const output = zlib.createGzip();
  let i;

  pipeline(output, response, (err) => {
    if (err) {
      // Si ocurre un error, no hay mucho que podamos hacer porque
      // el servidor ya ha enviado el código de respuesta 200 y
      // ya se ha enviado una cierta cantidad de datos al cliente.
      // Lo mejor que podemos hacer es terminar la respuesta inmediatamente
      // y registrar el error.
      clearInterval(i);
      response.end();
      console.error('An error occurred:', err);
    }
  });

  i = setInterval(() => {
    output.write(`The current time is ${Date()}\n`, () => {
      // Los datos se han pasado a zlib, pero el algoritmo de compresión puede
      // haber decidido almacenar en búfer los datos para una compresión más eficiente.
      // Llamar a .flush() hará que los datos estén disponibles tan pronto como el cliente
      // esté listo para recibirlos.
      output.flush();
    });
  }, 1000);
}).listen(1337);
```

```js [CJS]
const zlib = require('node:zlib');
const http = require('node:http');
const { pipeline } = require('node:stream');

http.createServer((request, response) => {
  // En aras de la simplicidad, se omiten las comprobaciones de Accept-Encoding.
  response.writeHead(200, { 'content-encoding': 'gzip' });
  const output = zlib.createGzip();
  let i;

  pipeline(output, response, (err) => {
    if (err) {
      // Si ocurre un error, no hay mucho que podamos hacer porque
      // el servidor ya ha enviado el código de respuesta 200 y
      // ya se ha enviado una cierta cantidad de datos al cliente.
      // Lo mejor que podemos hacer es terminar la respuesta inmediatamente
      // y registrar el error.
      clearInterval(i);
      response.end();
      console.error('An error occurred:', err);
    }
  });

  i = setInterval(() => {
    output.write(`The current time is ${Date()}\n`, () => {
      // Los datos se han pasado a zlib, pero el algoritmo de compresión puede
      // haber decidido almacenar en búfer los datos para una compresión más eficiente.
      // Llamar a .flush() hará que los datos estén disponibles tan pronto como el cliente
      // esté listo para recibirlos.
      output.flush();
    });
  }, 1000);
}).listen(1337);
```
:::


## Constantes {#constants}

**Agregado en: v0.5.8**

### Constantes zlib {#zlib-constants}

Todas las constantes definidas en `zlib.h` también están definidas en `require('node:zlib').constants`. En el curso normal de las operaciones, no será necesario utilizar estas constantes. Están documentadas para que su presencia no sea sorprendente. Esta sección se toma casi directamente de la [documentación de zlib](https://zlib.net/manual#Constants).

Anteriormente, las constantes estaban disponibles directamente desde `require('node:zlib')`, por ejemplo `zlib.Z_NO_FLUSH`. Acceder a las constantes directamente desde el módulo todavía es posible, pero está obsoleto.

Valores de vaciado permitidos.

- `zlib.constants.Z_NO_FLUSH`
- `zlib.constants.Z_PARTIAL_FLUSH`
- `zlib.constants.Z_SYNC_FLUSH`
- `zlib.constants.Z_FULL_FLUSH`
- `zlib.constants.Z_FINISH`
- `zlib.constants.Z_BLOCK`
- `zlib.constants.Z_TREES`

Códigos de retorno para las funciones de compresión/descompresión. Los valores negativos son errores, los valores positivos se utilizan para eventos especiales pero normales.

- `zlib.constants.Z_OK`
- `zlib.constants.Z_STREAM_END`
- `zlib.constants.Z_NEED_DICT`
- `zlib.constants.Z_ERRNO`
- `zlib.constants.Z_STREAM_ERROR`
- `zlib.constants.Z_DATA_ERROR`
- `zlib.constants.Z_MEM_ERROR`
- `zlib.constants.Z_BUF_ERROR`
- `zlib.constants.Z_VERSION_ERROR`

Niveles de compresión.

- `zlib.constants.Z_NO_COMPRESSION`
- `zlib.constants.Z_BEST_SPEED`
- `zlib.constants.Z_BEST_COMPRESSION`
- `zlib.constants.Z_DEFAULT_COMPRESSION`

Estrategia de compresión.

- `zlib.constants.Z_FILTERED`
- `zlib.constants.Z_HUFFMAN_ONLY`
- `zlib.constants.Z_RLE`
- `zlib.constants.Z_FIXED`
- `zlib.constants.Z_DEFAULT_STRATEGY`

### Constantes Brotli {#brotli-constants}

**Agregado en: v11.7.0, v10.16.0**

Hay varias opciones y otras constantes disponibles para los flujos basados en Brotli:

#### Operaciones de vaciado {#flush-operations}

Los siguientes valores son operaciones de vaciado válidas para los flujos basados en Brotli:

- `zlib.constants.BROTLI_OPERATION_PROCESS` (predeterminado para todas las operaciones)
- `zlib.constants.BROTLI_OPERATION_FLUSH` (predeterminado al llamar a `.flush()`)
- `zlib.constants.BROTLI_OPERATION_FINISH` (predeterminado para el último fragmento)
- `zlib.constants.BROTLI_OPERATION_EMIT_METADATA`
    - Esta operación en particular puede ser difícil de usar en un contexto de Node.js, ya que la capa de transmisión dificulta saber qué datos terminarán en este marco. Además, actualmente no hay forma de consumir estos datos a través de la API de Node.js.


#### Opciones del compresor {#compressor-options}

Hay varias opciones que se pueden configurar en los codificadores Brotli, que afectan la eficiencia y la velocidad de la compresión. Tanto las claves como los valores se pueden acceder como propiedades del objeto `zlib.constants`.

Las opciones más importantes son:

- `BROTLI_PARAM_MODE`
    - `BROTLI_MODE_GENERIC` (predeterminado)
    - `BROTLI_MODE_TEXT`, ajustado para texto UTF-8
    - `BROTLI_MODE_FONT`, ajustado para fuentes WOFF 2.0
  
 
- `BROTLI_PARAM_QUALITY`
    - Varía desde `BROTLI_MIN_QUALITY` hasta `BROTLI_MAX_QUALITY`, con un valor predeterminado de `BROTLI_DEFAULT_QUALITY`.
  
 
- `BROTLI_PARAM_SIZE_HINT`
    - Valor entero que representa el tamaño de entrada esperado; el valor predeterminado es `0` para un tamaño de entrada desconocido.
  
 

Las siguientes banderas se pueden configurar para un control avanzado sobre el algoritmo de compresión y el ajuste del uso de la memoria:

- `BROTLI_PARAM_LGWIN`
    - Varía desde `BROTLI_MIN_WINDOW_BITS` hasta `BROTLI_MAX_WINDOW_BITS`, con un valor predeterminado de `BROTLI_DEFAULT_WINDOW`, o hasta `BROTLI_LARGE_MAX_WINDOW_BITS` si se establece la bandera `BROTLI_PARAM_LARGE_WINDOW`.
  
 
- `BROTLI_PARAM_LGBLOCK`
    - Varía desde `BROTLI_MIN_INPUT_BLOCK_BITS` hasta `BROTLI_MAX_INPUT_BLOCK_BITS`.
  
 
- `BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING`
    - Bandera booleana que disminuye la relación de compresión en favor de la velocidad de descompresión.
  
 
- `BROTLI_PARAM_LARGE_WINDOW`
    - Bandera booleana que habilita el modo "Large Window Brotli" (no compatible con el formato Brotli estandarizado en [RFC 7932](https://www.rfc-editor.org/rfc/rfc7932.txt)).
  
 
- `BROTLI_PARAM_NPOSTFIX`
    - Varía desde `0` hasta `BROTLI_MAX_NPOSTFIX`.
  
 
- `BROTLI_PARAM_NDIRECT`
    - Varía desde `0` hasta `15 \<\< NPOSTFIX` en pasos de `1 \<\< NPOSTFIX`.
  
 

#### Opciones del descompresor {#decompressor-options}

Estas opciones avanzadas están disponibles para controlar la descompresión:

- `BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION`
    - Bandera booleana que afecta los patrones internos de asignación de memoria.
  
 
- `BROTLI_DECODER_PARAM_LARGE_WINDOW`
    - Bandera booleana que habilita el modo "Large Window Brotli" (no compatible con el formato Brotli estandarizado en [RFC 7932](https://www.rfc-editor.org/rfc/rfc7932.txt)).


## Clase: `Options` {#class-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.5.0, v12.19.0 | Ahora se admite la opción `maxOutputLength`. |
| v9.4.0 | La opción `dictionary` puede ser un `ArrayBuffer`. |
| v8.0.0 | La opción `dictionary` ahora puede ser un `Uint8Array`. |
| v5.11.0 | Ahora se admite la opción `finishFlush`. |
| v0.11.1 | Añadido en: v0.11.1 |
:::

Cada clase basada en zlib toma un objeto `options`. No se requieren opciones.

Algunas opciones solo son relevantes al comprimir y las clases de descompresión las ignoran.

- `flush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `zlib.constants.Z_NO_FLUSH`
- `finishFlush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `zlib.constants.Z_FINISH`
- `chunkSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `16 * 1024`
- `windowBits` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `level` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (solo compresión)
- `memLevel` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (solo compresión)
- `strategy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (solo compresión)
- `dictionary` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) (solo deflate/inflate, diccionario vacío de forma predeterminada)
- `info` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) (Si es `true`, devuelve un objeto con `buffer` y `engine`.)
- `maxOutputLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Limita el tamaño de salida al usar [métodos de conveniencia](/es/nodejs/api/zlib#convenience-methods). **Predeterminado:** [`buffer.kMaxLength`](/es/nodejs/api/buffer#bufferkmaxlength)

Consulte la documentación de [`deflateInit2` e `inflateInit2`](https://zlib.net/manual#Advanced) para obtener más información.


## Clase: `BrotliOptions` {#class-brotlioptions}

::: info [Historial]
| Versión | Cambios |
|---|---|
| v14.5.0, v12.19.0 | La opción `maxOutputLength` ahora es compatible. |
| v11.7.0 | Agregado en: v11.7.0 |
:::

Cada clase basada en Brotli toma un objeto `options`. Todas las opciones son opcionales.

- `flush` [\<entero\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `zlib.constants.BROTLI_OPERATION_PROCESS`
- `finishFlush` [\<entero\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `zlib.constants.BROTLI_OPERATION_FINISH`
- `chunkSize` [\<entero\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `16 * 1024`
- `params` [\<Objeto\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object) Objeto clave-valor que contiene [parámetros Brotli](/es/nodejs/api/zlib#brotli-constants) indexados.
- `maxOutputLength` [\<entero\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type) Limita el tamaño de la salida cuando se utilizan [métodos de conveniencia](/es/nodejs/api/zlib#convenience-methods). **Predeterminado:** [`buffer.kMaxLength`](/es/nodejs/api/buffer#bufferkmaxlength)

Por ejemplo:

```js [ESM]
const stream = zlib.createBrotliCompress({
  chunkSize: 32 * 1024,
  params: {
    [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
    [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
    [zlib.constants.BROTLI_PARAM_SIZE_HINT]: fs.statSync(inputFile).size,
  },
});
```
## Clase: `zlib.BrotliCompress` {#class-zlibbrotlicompress}

**Agregado en: v11.7.0, v10.16.0**

Comprime datos usando el algoritmo Brotli.

## Clase: `zlib.BrotliDecompress` {#class-zlibbrotlidecompress}

**Agregado en: v11.7.0, v10.16.0**

Descomprime datos usando el algoritmo Brotli.

## Clase: `zlib.Deflate` {#class-zlibdeflate}

**Agregado en: v0.5.8**

Comprime datos usando deflate.

## Clase: `zlib.DeflateRaw` {#class-zlibdeflateraw}

**Agregado en: v0.5.8**

Comprime datos usando deflate, y no agrega un encabezado `zlib`.

## Clase: `zlib.Gunzip` {#class-zlibgunzip}

::: info [Historial]
| Versión | Cambios |
|---|---|
| v6.0.0 | La basura final al final del flujo de entrada ahora resultará en un evento `'error'`. |
| v5.9.0 | Ahora se admiten varios miembros de archivos gzip concatenados. |
| v5.0.0 | Un flujo de entrada truncado ahora resultará en un evento `'error'`. |
| v0.5.8 | Agregado en: v0.5.8 |
:::

Descomprime un flujo gzip.


## Clase: `zlib.Gzip` {#class-zlibgzip}

**Agregada en: v0.5.8**

Comprime datos utilizando gzip.

## Clase: `zlib.Inflate` {#class-zlibinflate}


::: info [Historial]
| Versión | Cambios |
|---|---|
| v5.0.0 | Un flujo de entrada truncado ahora resultará en un evento `'error'`. |
| v0.5.8 | Agregada en: v0.5.8 |
:::

Descomprime un flujo deflate.

## Clase: `zlib.InflateRaw` {#class-zlibinflateraw}


::: info [Historial]
| Versión | Cambios |
|---|---|
| v6.8.0 | Los diccionarios personalizados ahora son compatibles con `InflateRaw`. |
| v5.0.0 | Un flujo de entrada truncado ahora resultará en un evento `'error'`. |
| v0.5.8 | Agregada en: v0.5.8 |
:::

Descomprime un flujo deflate sin formato.

## Clase: `zlib.Unzip` {#class-zlibunzip}

**Agregada en: v0.5.8**

Descomprime un flujo comprimido con Gzip o Deflate detectando automáticamente el encabezado.

## Clase: `zlib.ZlibBase` {#class-zlibzlibbase}


::: info [Historial]
| Versión | Cambios |
|---|---|
| v11.7.0, v10.16.0 | El nombre de esta clase se cambió de `Zlib` a `ZlibBase`. |
| v0.5.8 | Agregada en: v0.5.8 |
:::

No exportada por el módulo `node:zlib`. Se documenta aquí porque es la clase base de las clases de compresor/descompresor.

Esta clase hereda de [`stream.Transform`](/es/nodejs/api/stream#class-streamtransform), lo que permite que los objetos `node:zlib` se utilicen en tuberías y operaciones de flujo similares.

### `zlib.bytesWritten` {#zlibbyteswritten}

**Agregada en: v10.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La propiedad `zlib.bytesWritten` especifica el número de bytes escritos en el motor, antes de que los bytes se procesen (comprimidos o descomprimidos, según corresponda a la clase derivada).

### `zlib.crc32(data[, value])` {#zlibcrc32data-value}

**Agregada en: v22.2.0, v20.15.0**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Cuando `data` es una cadena, se codificará como UTF-8 antes de usarse para el cálculo.
- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un valor inicial opcional. Debe ser un entero sin signo de 32 bits. **Predeterminado:** `0`
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un entero sin signo de 32 bits que contiene la suma de comprobación.

Calcula una suma de comprobación de [Comprobación de Redundancia Cíclica](https://en.wikipedia.org/wiki/Cyclic_redundancy_check) de 32 bits de `data`. Si se especifica `value`, se usa como el valor inicial de la suma de comprobación; de lo contrario, se usa 0 como el valor inicial.

El algoritmo CRC está diseñado para calcular sumas de comprobación y detectar errores en la transmisión de datos. No es adecuado para la autenticación criptográfica.

Para ser coherente con otras API, si los `data` son una cadena, se codificará con UTF-8 antes de usarse para el cálculo. Si los usuarios solo usan Node.js para calcular y hacer coincidir las sumas de comprobación, esto funciona bien con otras API que usan la codificación UTF-8 de forma predeterminada.

Algunas bibliotecas de JavaScript de terceros calculan la suma de comprobación en una cadena basada en `str.charCodeAt()` para que se pueda ejecutar en los navegadores. Si los usuarios quieren hacer coincidir la suma de comprobación calculada con este tipo de biblioteca en el navegador, es mejor usar la misma biblioteca en Node.js si también se ejecuta en Node.js. Si los usuarios tienen que usar `zlib.crc32()` para hacer coincidir la suma de comprobación producida por dicha biblioteca de terceros:



::: code-group
```js [ESM]
import zlib from 'node:zlib';
import { Buffer } from 'node:buffer';

let crc = zlib.crc32('hello');  // 907060870
crc = zlib.crc32('world', crc);  // 4192936109

crc = zlib.crc32(Buffer.from('hello', 'utf16le'));  // 1427272415
crc = zlib.crc32(Buffer.from('world', 'utf16le'), crc);  // 4150509955
```

```js [CJS]
const zlib = require('node:zlib');
const { Buffer } = require('node:buffer');

let crc = zlib.crc32('hello');  // 907060870
crc = zlib.crc32('world', crc);  // 4192936109

crc = zlib.crc32(Buffer.from('hello', 'utf16le'));  // 1427272415
crc = zlib.crc32(Buffer.from('world', 'utf16le'), crc);  // 4150509955
```
:::


### `zlib.close([callback])` {#zlibclosecallback}

**Agregado en: v0.9.4**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Cierra el manejador subyacente.

### `zlib.flush([kind, ]callback)` {#zlibflushkind-callback}

**Agregado en: v0.5.8**

- `kind` **Predeterminado:** `zlib.constants.Z_FULL_FLUSH` para flujos basados en zlib, `zlib.constants.BROTLI_OPERATION_FLUSH` para flujos basados en Brotli.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Vacía los datos pendientes. No llame a esto frívolamente, las descargas prematuras impactan negativamente en la eficacia del algoritmo de compresión.

Llamar a esto sólo vacía los datos del estado interno de `zlib`, y no realiza ningún tipo de vaciado en el nivel de los flujos. Más bien, se comporta como una llamada normal a `.write()`, es decir, se pondrá en cola detrás de otras escrituras pendientes y sólo producirá salida cuando los datos se estén leyendo del flujo.

### `zlib.params(level, strategy, callback)` {#zlibparamslevel-strategy-callback}

**Agregado en: v0.11.4**

- `level` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `strategy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Esta función sólo está disponible para flujos basados en zlib, es decir, no Brotli.

Actualiza dinámicamente el nivel de compresión y la estrategia de compresión. Sólo aplicable al algoritmo deflate.

### `zlib.reset()` {#zlibreset}

**Agregado en: v0.7.0**

Restablece el compresor/descompresor a los valores predeterminados de fábrica. Sólo aplicable a los algoritmos inflate y deflate.

## `zlib.constants` {#zlibconstants}

**Agregado en: v7.0.0**

Proporciona un objeto que enumera las constantes relacionadas con Zlib.

## `zlib.createBrotliCompress([options])` {#zlibcreatebrotlicompressoptions}

**Agregado en: v11.7.0, v10.16.0**

- `options` [\<opciones de brotli\>](/es/nodejs/api/zlib#class-brotlioptions)

Crea y devuelve un nuevo objeto [`BrotliCompress`](/es/nodejs/api/zlib#class-zlibbrotlicompress).


## `zlib.createBrotliDecompress([options])` {#zlibcreatebrotlidecompressoptions}

**Agregado en: v11.7.0, v10.16.0**

- `options` [\<opciones de brotli\>](/es/nodejs/api/zlib#class-brotlioptions)

Crea y devuelve un nuevo objeto [`BrotliDecompress`](/es/nodejs/api/zlib#class-zlibbrotlidecompress).

## `zlib.createDeflate([options])` {#zlibcreatedeflateoptions}

**Agregado en: v0.5.8**

- `options` [\<opciones de zlib\>](/es/nodejs/api/zlib#class-options)

Crea y devuelve un nuevo objeto [`Deflate`](/es/nodejs/api/zlib#class-zlibdeflate).

## `zlib.createDeflateRaw([options])` {#zlibcreatedeflaterawoptions}

**Agregado en: v0.5.8**

- `options` [\<opciones de zlib\>](/es/nodejs/api/zlib#class-options)

Crea y devuelve un nuevo objeto [`DeflateRaw`](/es/nodejs/api/zlib#class-zlibdeflateraw).

Una actualización de zlib de 1.2.8 a 1.2.11 cambió el comportamiento cuando `windowBits` se establece en 8 para los flujos deflate sin formato. zlib establecería automáticamente `windowBits` en 9 si inicialmente se establecía en 8. Las versiones más nuevas de zlib lanzarán una excepción, por lo que Node.js restauró el comportamiento original de actualizar un valor de 8 a 9, ya que pasar `windowBits = 9` a zlib en realidad resulta en un flujo comprimido que utiliza efectivamente una ventana de 8 bits solamente.

## `zlib.createGunzip([options])` {#zlibcreategunzipoptions}

**Agregado en: v0.5.8**

- `options` [\<opciones de zlib\>](/es/nodejs/api/zlib#class-options)

Crea y devuelve un nuevo objeto [`Gunzip`](/es/nodejs/api/zlib#class-zlibgunzip).

## `zlib.createGzip([options])` {#zlibcreategzipoptions}

**Agregado en: v0.5.8**

- `options` [\<opciones de zlib\>](/es/nodejs/api/zlib#class-options)

Crea y devuelve un nuevo objeto [`Gzip`](/es/nodejs/api/zlib#class-zlibgzip). Consulte [ejemplo](/es/nodejs/api/zlib#zlib).

## `zlib.createInflate([options])` {#zlibcreateinflateoptions}

**Agregado en: v0.5.8**

- `options` [\<opciones de zlib\>](/es/nodejs/api/zlib#class-options)

Crea y devuelve un nuevo objeto [`Inflate`](/es/nodejs/api/zlib#class-zlibinflate).

## `zlib.createInflateRaw([options])` {#zlibcreateinflaterawoptions}

**Agregado en: v0.5.8**

- `options` [\<opciones de zlib\>](/es/nodejs/api/zlib#class-options)

Crea y devuelve un nuevo objeto [`InflateRaw`](/es/nodejs/api/zlib#class-zlibinflateraw).

## `zlib.createUnzip([options])` {#zlibcreateunzipoptions}

**Agregado en: v0.5.8**

- `options` [\<opciones de zlib\>](/es/nodejs/api/zlib#class-options)

Crea y devuelve un nuevo objeto [`Unzip`](/es/nodejs/api/zlib#class-zlibunzip).


## Métodos de conveniencia {#convenience-methods}

Todos estos toman un [`Buffer`](/es/nodejs/api/buffer#class-buffer), [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView), [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) o string como primer argumento, un segundo argumento opcional para suministrar opciones a las clases `zlib` y llamará al callback suministrado con `callback(error, result)`.

Cada método tiene una contraparte `*Sync`, que acepta los mismos argumentos, pero sin un callback.

### `zlib.brotliCompress(buffer[, options], callback)` {#zlibbrotlicompressbuffer-options-callback}

**Agregado en: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli options\>](/es/nodejs/api/zlib#class-brotlioptions)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.brotliCompressSync(buffer[, options])` {#zlibbrotlicompresssyncbuffer-options}

**Agregado en: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli options\>](/es/nodejs/api/zlib#class-brotlioptions)

Comprime un fragmento de datos con [`BrotliCompress`](/es/nodejs/api/zlib#class-zlibbrotlicompress).


### `zlib.brotliDecompress(buffer[, options], callback)` {#zlibbrotlidecompressbuffer-options-callback}

**Agregado en: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opciones de brotli\>](/es/nodejs/api/zlib#class-brotlioptions)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.brotliDecompressSync(buffer[, options])` {#zlibbrotlidecompresssyncbuffer-options}

**Agregado en: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opciones de brotli\>](/es/nodejs/api/zlib#class-brotlioptions)

Descomprime un fragmento de datos con [`BrotliDecompress`](/es/nodejs/api/zlib#class-zlibbrotlidecompress).

### `zlib.deflate(buffer[, options], callback)` {#zlibdeflatebuffer-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.4.0 | El parámetro `buffer` puede ser un `ArrayBuffer`. |
| v8.0.0 | El parámetro `buffer` puede ser cualquier `TypedArray` o `DataView`. |
| v8.0.0 | El parámetro `buffer` ahora puede ser un `Uint8Array`. |
| v0.6.0 | Agregado en: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opciones de zlib\>](/es/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.deflateSync(buffer[, options])` {#zlibdeflatesyncbuffer-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.4.0 | El parámetro `buffer` puede ser un `ArrayBuffer`. |
| v8.0.0 | El parámetro `buffer` puede ser cualquier `TypedArray` o `DataView`. |
| v8.0.0 | El parámetro `buffer` ahora puede ser un `Uint8Array`. |
| v0.11.12 | Añadido en: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opciones de zlib\>](/es/nodejs/api/zlib#class-options)

Comprime un fragmento de datos con [`Deflate`](/es/nodejs/api/zlib#class-zlibdeflate).

### `zlib.deflateRaw(buffer[, options], callback)` {#zlibdeflaterawbuffer-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v8.0.0 | El parámetro `buffer` puede ser cualquier `TypedArray` o `DataView`. |
| v8.0.0 | El parámetro `buffer` ahora puede ser un `Uint8Array`. |
| v0.6.0 | Añadido en: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opciones de zlib\>](/es/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.deflateRawSync(buffer[, options])` {#zlibdeflaterawsyncbuffer-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.4.0 | El parámetro `buffer` puede ser un `ArrayBuffer`. |
| v8.0.0 | El parámetro `buffer` puede ser cualquier `TypedArray` o `DataView`. |
| v8.0.0 | El parámetro `buffer` ahora puede ser un `Uint8Array`. |
| v0.11.12 | Añadido en: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opciones de zlib\>](/es/nodejs/api/zlib#class-options)

Comprime un fragmento de datos con [`DeflateRaw`](/es/nodejs/api/zlib#class-zlibdeflateraw).


### `zlib.gunzip(buffer[, options], callback)` {#zlibgunzipbuffer-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.4.0 | El parámetro `buffer` puede ser un `ArrayBuffer`. |
| v8.0.0 | El parámetro `buffer` puede ser cualquier `TypedArray` o `DataView`. |
| v8.0.0 | El parámetro `buffer` ahora puede ser un `Uint8Array`. |
| v0.6.0 | Añadido en: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opciones zlib\>](/es/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.gunzipSync(buffer[, options])` {#zlibgunzipsyncbuffer-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.4.0 | El parámetro `buffer` puede ser un `ArrayBuffer`. |
| v8.0.0 | El parámetro `buffer` puede ser cualquier `TypedArray` o `DataView`. |
| v8.0.0 | El parámetro `buffer` ahora puede ser un `Uint8Array`. |
| v0.11.12 | Añadido en: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opciones zlib\>](/es/nodejs/api/zlib#class-options)

Descomprime un fragmento de datos con [`Gunzip`](/es/nodejs/api/zlib#class-zlibgunzip).

### `zlib.gzip(buffer[, options], callback)` {#zlibgzipbuffer-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.4.0 | El parámetro `buffer` puede ser un `ArrayBuffer`. |
| v8.0.0 | El parámetro `buffer` puede ser cualquier `TypedArray` o `DataView`. |
| v8.0.0 | El parámetro `buffer` ahora puede ser un `Uint8Array`. |
| v0.6.0 | Añadido en: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opciones zlib\>](/es/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.gzipSync(buffer[, options])` {#zlibgzipsyncbuffer-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.4.0 | El parámetro `buffer` puede ser un `ArrayBuffer`. |
| v8.0.0 | El parámetro `buffer` puede ser cualquier `TypedArray` o `DataView`. |
| v8.0.0 | El parámetro `buffer` ahora puede ser un `Uint8Array`. |
| v0.11.12 | Agregado en: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/es/nodejs/api/zlib#class-options)

Comprime un fragmento de datos con [`Gzip`](/es/nodejs/api/zlib#class-zlibgzip).

### `zlib.inflate(buffer[, options], callback)` {#zlibinflatebuffer-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.4.0 | El parámetro `buffer` puede ser un `ArrayBuffer`. |
| v8.0.0 | El parámetro `buffer` puede ser cualquier `TypedArray` o `DataView`. |
| v8.0.0 | El parámetro `buffer` ahora puede ser un `Uint8Array`. |
| v0.6.0 | Agregado en: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/es/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.inflateSync(buffer[, options])` {#zlibinflatesyncbuffer-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.4.0 | El parámetro `buffer` puede ser un `ArrayBuffer`. |
| v8.0.0 | El parámetro `buffer` puede ser cualquier `TypedArray` o `DataView`. |
| v8.0.0 | El parámetro `buffer` ahora puede ser un `Uint8Array`. |
| v0.11.12 | Agregado en: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/es/nodejs/api/zlib#class-options)

Descomprime un fragmento de datos con [`Inflate`](/es/nodejs/api/zlib#class-zlibinflate).


### `zlib.inflateRaw(buffer[, options], callback)` {#zlibinflaterawbuffer-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.4.0 | El parámetro `buffer` puede ser un `ArrayBuffer`. |
| v8.0.0 | El parámetro `buffer` puede ser cualquier `TypedArray` o `DataView`. |
| v8.0.0 | El parámetro `buffer` ahora puede ser un `Uint8Array`. |
| v0.6.0 | Añadido en: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opciones de zlib\>](/es/nodejs/api/zlib#class-options)
- `callback` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.inflateRawSync(buffer[, options])` {#zlibinflaterawsyncbuffer-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.4.0 | El parámetro `buffer` puede ser un `ArrayBuffer`. |
| v8.0.0 | El parámetro `buffer` puede ser cualquier `TypedArray` o `DataView`. |
| v8.0.0 | El parámetro `buffer` ahora puede ser un `Uint8Array`. |
| v0.11.12 | Añadido en: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opciones de zlib\>](/es/nodejs/api/zlib#class-options)

Descomprime un fragmento de datos con [`InflateRaw`](/es/nodejs/api/zlib#class-zlibinflateraw).

### `zlib.unzip(buffer[, options], callback)` {#zlibunzipbuffer-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.4.0 | El parámetro `buffer` puede ser un `ArrayBuffer`. |
| v8.0.0 | El parámetro `buffer` puede ser cualquier `TypedArray` o `DataView`. |
| v8.0.0 | El parámetro `buffer` ahora puede ser un `Uint8Array`. |
| v0.6.0 | Añadido en: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opciones de zlib\>](/es/nodejs/api/zlib#class-options)
- `callback` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.unzipSync(buffer[, options])` {#zlibunzipsyncbuffer-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.4.0 | El parámetro `buffer` puede ser un `ArrayBuffer`. |
| v8.0.0 | El parámetro `buffer` puede ser cualquier `TypedArray` o `DataView`. |
| v8.0.0 | El parámetro `buffer` ahora puede ser un `Uint8Array`. |
| v0.11.12 | Añadido en: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/es/nodejs/api/zlib#class-options)

Descomprime un fragmento de datos con [`Unzip`](/es/nodejs/api/zlib#class-zlibunzip).

