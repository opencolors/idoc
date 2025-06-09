---
title: Documentación de Buffer de Node.js
description: La documentación de Buffer de Node.js ofrece información detallada sobre cómo trabajar con datos binarios en Node.js, incluyendo la creación, manipulación y conversión de buffers.
head:
  - - meta
    - name: og:title
      content: Documentación de Buffer de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La documentación de Buffer de Node.js ofrece información detallada sobre cómo trabajar con datos binarios en Node.js, incluyendo la creación, manipulación y conversión de buffers.
  - - meta
    - name: twitter:title
      content: Documentación de Buffer de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La documentación de Buffer de Node.js ofrece información detallada sobre cómo trabajar con datos binarios en Node.js, incluyendo la creación, manipulación y conversión de buffers.
---


# Buffer {#buffer}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código fuente:** [lib/buffer.js](https://github.com/nodejs/node/blob/v23.5.0/lib/buffer.js)

Los objetos `Buffer` se utilizan para representar una secuencia de bytes de longitud fija. Muchas API de Node.js admiten `Buffer`s.

La clase `Buffer` es una subclase de la clase [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) de JavaScript y la extiende con métodos que cubren casos de uso adicionales. Las API de Node.js aceptan [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)s simples donde también se admiten `Buffer`s.

Si bien la clase `Buffer` está disponible dentro del alcance global, aún se recomienda hacer referencia explícitamente a ella a través de una declaración de importación o require.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Crea un Buffer lleno de ceros de longitud 10.
const buf1 = Buffer.alloc(10);

// Crea un Buffer de longitud 10,
// lleno de bytes que tienen todos el valor `1`.
const buf2 = Buffer.alloc(10, 1);

// Crea un buffer no inicializado de longitud 10.
// Esto es más rápido que llamar a Buffer.alloc() pero la instancia de Buffer
// devuelta podría contener datos antiguos que deben ser
// sobrescritos utilizando fill(), write() u otras funciones que llenan el
// contenido del Buffer.
const buf3 = Buffer.allocUnsafe(10);

// Crea un Buffer que contiene los bytes [1, 2, 3].
const buf4 = Buffer.from([1, 2, 3]);

// Crea un Buffer que contiene los bytes [1, 1, 1, 1]: las entradas
// se truncan todas usando `(value & 255)` para encajar en el rango 0–255.
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// Crea un Buffer que contiene los bytes codificados en UTF-8 para la cadena 'tést':
// [0x74, 0xc3, 0xa9, 0x73, 0x74] (en notación hexadecimal)
// [116, 195, 169, 115, 116] (en notación decimal)
const buf6 = Buffer.from('tést');

// Crea un Buffer que contiene los bytes Latin-1 [0x74, 0xe9, 0x73, 0x74].
const buf7 = Buffer.from('tést', 'latin1');
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Crea un Buffer lleno de ceros de longitud 10.
const buf1 = Buffer.alloc(10);

// Crea un Buffer de longitud 10,
// lleno de bytes que tienen todos el valor `1`.
const buf2 = Buffer.alloc(10, 1);

// Crea un buffer no inicializado de longitud 10.
// Esto es más rápido que llamar a Buffer.alloc() pero la instancia de Buffer
// devuelta podría contener datos antiguos que deben ser
// sobrescritos utilizando fill(), write() u otras funciones que llenan el
// contenido del Buffer.
const buf3 = Buffer.allocUnsafe(10);

// Crea un Buffer que contiene los bytes [1, 2, 3].
const buf4 = Buffer.from([1, 2, 3]);

// Crea un Buffer que contiene los bytes [1, 1, 1, 1]: las entradas
// se truncan todas usando `(value & 255)` para encajar en el rango 0–255.
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// Crea un Buffer que contiene los bytes codificados en UTF-8 para la cadena 'tést':
// [0x74, 0xc3, 0xa9, 0x73, 0x74] (en notación hexadecimal)
// [116, 195, 169, 115, 116] (en notación decimal)
const buf6 = Buffer.from('tést');

// Crea un Buffer que contiene los bytes Latin-1 [0x74, 0xe9, 0x73, 0x74].
const buf7 = Buffer.from('tést', 'latin1');
```
:::


## Buffers y codificaciones de caracteres {#buffers-and-character-encodings}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.7.0, v14.18.0 | Se introdujo la codificación `base64url`. |
| v6.4.0 | Se introdujo `latin1` como un alias para `binary`. |
| v5.0.0 | Se eliminaron las codificaciones `raw` y `raws` obsoletas. |
:::

Al convertir entre `Buffer`s y strings, se puede especificar una codificación de caracteres. Si no se especifica ninguna codificación de caracteres, se utilizará UTF-8 como valor predeterminado.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('hello world', 'utf8');

console.log(buf.toString('hex'));
// Imprime: 68656c6c6f20776f726c64
console.log(buf.toString('base64'));
// Imprime: aGVsbG8gd29ybGQ=

console.log(Buffer.from('fhqwhgads', 'utf8'));
// Imprime: <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from('fhqwhgads', 'utf16le'));
// Imprime: <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('hello world', 'utf8');

console.log(buf.toString('hex'));
// Imprime: 68656c6c6f20776f726c64
console.log(buf.toString('base64'));
// Imprime: aGVsbG8gd29ybGQ=

console.log(Buffer.from('fhqwhgads', 'utf8'));
// Imprime: <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from('fhqwhgads', 'utf16le'));
// Imprime: <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>
```
:::

Los buffers de Node.js aceptan todas las variaciones de mayúsculas y minúsculas de las strings de codificación que reciben. Por ejemplo, UTF-8 se puede especificar como `'utf8'`, `'UTF8'` o `'uTf8'`.

Las codificaciones de caracteres actualmente admitidas por Node.js son las siguientes:

- `'utf8'` (alias: `'utf-8'`): Caracteres Unicode codificados multibyte. Muchas páginas web y otros formatos de documento utilizan [UTF-8](https://en.wikipedia.org/wiki/UTF-8). Esta es la codificación de caracteres predeterminada. Al decodificar un `Buffer` en un string que no contiene exclusivamente datos UTF-8 válidos, el carácter de reemplazo Unicode `U+FFFD` � se utilizará para representar esos errores.
- `'utf16le'` (alias: `'utf-16le'`): Caracteres Unicode codificados multibyte. A diferencia de `'utf8'`, cada carácter en el string se codificará utilizando 2 o 4 bytes. Node.js solo admite la variante [little-endian](https://en.wikipedia.org/wiki/Endianness) de [UTF-16](https://en.wikipedia.org/wiki/UTF-16).
- `'latin1'`: Latin-1 significa [ISO-8859-1](https://en.wikipedia.org/wiki/ISO-8859-1). Esta codificación de caracteres solo admite los caracteres Unicode de `U+0000` a `U+00FF`. Cada carácter se codifica utilizando un solo byte. Los caracteres que no encajan en ese rango se truncan y se asignan a caracteres en ese rango.

Convertir un `Buffer` en un string utilizando uno de los anteriores se conoce como decodificación, y convertir un string en un `Buffer` se conoce como codificación.

Node.js también admite las siguientes codificaciones de binario a texto. Para las codificaciones de binario a texto, la convención de nomenclatura se invierte: convertir un `Buffer` en un string normalmente se conoce como codificación, y convertir un string en un `Buffer` como decodificación.

- `'base64'`: Codificación [Base64](https://en.wikipedia.org/wiki/Base64). Al crear un `Buffer` a partir de un string, esta codificación también aceptará correctamente el "Alfabeto seguro para URL y nombres de archivo" como se especifica en [RFC 4648, Sección 5](https://tools.ietf.org/html/rfc4648#section-5). Los caracteres de espacio en blanco como espacios, tabulaciones y nuevas líneas contenidos dentro del string codificado en base64 se ignoran.
- `'base64url'`: Codificación [base64url](https://tools.ietf.org/html/rfc4648#section-5) como se especifica en [RFC 4648, Sección 5](https://tools.ietf.org/html/rfc4648#section-5). Al crear un `Buffer` a partir de un string, esta codificación también aceptará correctamente strings codificados en base64 regulares. Al codificar un `Buffer` en un string, esta codificación omitirá el relleno.
- `'hex'`: Codifica cada byte como dos caracteres hexadecimales. Puede ocurrir el truncamiento de datos al decodificar strings que no consisten exclusivamente en un número par de caracteres hexadecimales. Vea abajo un ejemplo.

También se admiten las siguientes codificaciones de caracteres heredadas:

- `'ascii'`: Solo para datos [ASCII](https://en.wikipedia.org/wiki/ASCII) de 7 bits. Al codificar un string en un `Buffer`, esto es equivalente a utilizar `'latin1'`. Al decodificar un `Buffer` en un string, utilizar esta codificación además desactivará el bit más alto de cada byte antes de decodificar como `'latin1'`. Generalmente, no debería haber ninguna razón para utilizar esta codificación, ya que `'utf8'` (o, si se sabe que los datos son siempre solo ASCII, `'latin1'`) será una mejor opción al codificar o decodificar texto solo ASCII. Solo se proporciona para la compatibilidad heredada.
- `'binary'`: Alias para `'latin1'`. El nombre de esta codificación puede ser muy engañoso, ya que todas las codificaciones enumeradas aquí convierten entre strings y datos binarios. Para convertir entre strings y `Buffer`s, normalmente `'utf8'` es la opción correcta.
- `'ucs2'`, `'ucs-2'`: Alias de `'utf16le'`. UCS-2 solía referirse a una variante de UTF-16 que no admitía caracteres que tenían puntos de código mayores que U+FFFF. En Node.js, estos puntos de código siempre son compatibles.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

Buffer.from('1ag123', 'hex');
// Imprime <Buffer 1a>, datos truncados cuando se encuentra el primer valor no hexadecimal
// ('g').

Buffer.from('1a7', 'hex');
// Imprime <Buffer 1a>, datos truncados cuando los datos terminan en un solo dígito ('7').

Buffer.from('1634', 'hex');
// Imprime <Buffer 16 34>, todos los datos representados.
```

```js [CJS]
const { Buffer } = require('node:buffer');

Buffer.from('1ag123', 'hex');
// Imprime <Buffer 1a>, datos truncados cuando se encuentra el primer valor no hexadecimal
// ('g').

Buffer.from('1a7', 'hex');
// Imprime <Buffer 1a>, datos truncados cuando los datos terminan en un solo dígito ('7').

Buffer.from('1634', 'hex');
// Imprime <Buffer 16 34>, todos los datos representados.
```
:::

Los navegadores web modernos siguen el [Estándar de codificación WHATWG](https://encoding.spec.whatwg.org/) que alias tanto `'latin1'` como `'ISO-8859-1'` a `'win-1252'`. Esto significa que al hacer algo como `http.get()`, si el charset devuelto es uno de los que figuran en la especificación WHATWG, es posible que el servidor realmente haya devuelto datos codificados en `'win-1252'`, y el uso de la codificación `'latin1'` puede decodificar incorrectamente los caracteres.


## Buffers y TypedArrays {#buffers-and-typedarrays}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v3.0.0 | La clase `Buffer` ahora hereda de `Uint8Array`. |
:::

Las instancias de `Buffer` también son instancias de JavaScript [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) y [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray). Todos los métodos de [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) están disponibles en `Buffer`s. Sin embargo, existen sutiles incompatibilidades entre la API de `Buffer` y la API de [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).

En particular:

- Mientras que [`TypedArray.prototype.slice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/slice) crea una copia de parte del `TypedArray`, [`Buffer.prototype.slice()`](/es/nodejs/api/buffer#bufslicestart-end) crea una vista sobre el `Buffer` existente sin copiar. Este comportamiento puede ser sorprendente, y solo existe por compatibilidad heredada. [`TypedArray.prototype.subarray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray) se puede utilizar para lograr el comportamiento de [`Buffer.prototype.slice()`](/es/nodejs/api/buffer#bufslicestart-end) tanto en `Buffer`s como en otros `TypedArray`s y debería ser preferido.
- [`buf.toString()`](/es/nodejs/api/buffer#buftostringencoding-start-end) es incompatible con su equivalente en `TypedArray`.
- Varios métodos, por ejemplo, [`buf.indexOf()`](/es/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding), admiten argumentos adicionales.

Hay dos formas de crear nuevas instancias de [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) a partir de un `Buffer`:

- Pasar un `Buffer` a un constructor [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) copiará el contenido del `Buffer`, interpretado como una matriz de enteros, y no como una secuencia de bytes del tipo de destino.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);
const uint32array = new Uint32Array(buf);

console.log(uint32array);

// Prints: Uint32Array(4) [ 1, 2, 3, 4 ]
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);
const uint32array = new Uint32Array(buf);

console.log(uint32array);

// Prints: Uint32Array(4) [ 1, 2, 3, 4 ]
```
:::

- Pasar el [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) subyacente del `Buffer` creará un [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) que comparte su memoria con el `Buffer`.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('hello', 'utf16le');
const uint16array = new Uint16Array(
  buf.buffer,
  buf.byteOffset,
  buf.length / Uint16Array.BYTES_PER_ELEMENT);

console.log(uint16array);

// Prints: Uint16Array(5) [ 104, 101, 108, 108, 111 ]
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('hello', 'utf16le');
const uint16array = new Uint16Array(
  buf.buffer,
  buf.byteOffset,
  buf.length / Uint16Array.BYTES_PER_ELEMENT);

console.log(uint16array);

// Prints: Uint16Array(5) [ 104, 101, 108, 108, 111 ]
```
:::

Es posible crear un nuevo `Buffer` que comparta la misma memoria asignada que una instancia de [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) utilizando la propiedad `.buffer` del objeto `TypedArray` de la misma manera. [`Buffer.from()`](/es/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) se comporta como `new Uint8Array()` en este contexto.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Copies the contents of `arr`.
const buf1 = Buffer.from(arr);

// Shares memory with `arr`.
const buf2 = Buffer.from(arr.buffer);

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 a0 0f>

arr[1] = 6000;

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 70 17>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Copies the contents of `arr`.
const buf1 = Buffer.from(arr);

// Shares memory with `arr`.
const buf2 = Buffer.from(arr.buffer);

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 a0 0f>

arr[1] = 6000;

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 70 17>
```
:::

Cuando se crea un `Buffer` utilizando el `.buffer` de un [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), es posible utilizar solo una porción del [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) subyacente pasando los parámetros `byteOffset` y `length`.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(20);
const buf = Buffer.from(arr.buffer, 0, 16);

console.log(buf.length);
// Prints: 16
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(20);
const buf = Buffer.from(arr.buffer, 0, 16);

console.log(buf.length);
// Prints: 16
```
:::

`Buffer.from()` y [`TypedArray.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/from) tienen firmas e implementaciones diferentes. Específicamente, las variantes de [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) aceptan un segundo argumento que es una función de mapeo que se invoca en cada elemento de la matriz tipada:

- `TypedArray.from(source[, mapFn[, thisArg]])`

El método `Buffer.from()`, sin embargo, no admite el uso de una función de mapeo:

- [`Buffer.from(array)`](/es/nodejs/api/buffer#static-method-bufferfromarray)
- [`Buffer.from(buffer)`](/es/nodejs/api/buffer#static-method-bufferfrombuffer)
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/es/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length)
- [`Buffer.from(string[, encoding])`](/es/nodejs/api/buffer#static-method-bufferfromstring-encoding)


## Buffers e iteración {#buffers-and-iteration}

Las instancias de `Buffer` se pueden iterar usando la sintaxis `for..of`:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3]);

for (const b of buf) {
  console.log(b);
}
// Prints:
//   1
//   2
//   3
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3]);

for (const b of buf) {
  console.log(b);
}
// Prints:
//   1
//   2
//   3
```
:::

Además, los métodos [`buf.values()`](/es/nodejs/api/buffer#bufvalues), [`buf.keys()`](/es/nodejs/api/buffer#bufkeys) y [`buf.entries()`](/es/nodejs/api/buffer#bufentries) se pueden utilizar para crear iteradores.

## Clase: `Blob` {#class-blob}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0, v16.17.0 | Ya no es experimental. |
| v15.7.0, v14.18.0 | Añadido en: v15.7.0, v14.18.0 |
:::

Un [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) encapsula datos sin procesar e inmutables que se pueden compartir de forma segura entre múltiples hilos de trabajo.

### `new buffer.Blob([sources[, options]])` {#new-bufferblobsources-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.7.0 | Se agregó la opción estándar `endings` para reemplazar los finales de línea y se eliminó la opción no estándar `encoding`. |
| v15.7.0, v14.18.0 | Añadido en: v15.7.0, v14.18.0 |
:::

- `sources` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Blob[]\>](/es/nodejs/api/buffer#class-blob) Una matriz de objetos string, [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) o [\<Blob\>](/es/nodejs/api/buffer#class-blob), o cualquier combinación de tales objetos, que se almacenarán dentro del `Blob`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endings` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uno de `'transparent'` o `'native'`. Cuando se establece en `'native'`, los finales de línea en las partes de la fuente de cadena se convertirán al final de línea nativo de la plataforma según lo especificado por `require('node:os').EOL`.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El tipo de contenido Blob. La intención es que `type` transmita el tipo de medio MIME de los datos, sin embargo, no se realiza ninguna validación del formato del tipo.

Crea un nuevo objeto `Blob` que contiene una concatenación de las fuentes dadas.

Las fuentes [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) y [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) se copian en el 'Blob' y, por lo tanto, se pueden modificar de forma segura después de que se crea el 'Blob'.

Las fuentes de cadena se codifican como secuencias de bytes UTF-8 y se copian en el Blob. Los pares suplentes no coincidentes dentro de cada parte de la cadena se reemplazarán con caracteres de reemplazo Unicode U+FFFD.


### `blob.arrayBuffer()` {#blobarraybuffer}

**Añadido en: v15.7.0, v14.18.0**

- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Devuelve una promesa que se cumple con un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) que contiene una copia de los datos del `Blob`.

#### `blob.bytes()` {#blobbytes}

**Añadido en: v22.3.0, v20.16.0**

El método `blob.bytes()` devuelve el byte del objeto `Blob` como una `Promise\<Uint8Array\>`.

```js [ESM]
const blob = new Blob(['hello']);
blob.bytes().then((bytes) => {
  console.log(bytes); // Outputs: Uint8Array(5) [ 104, 101, 108, 108, 111 ]
});
```
### `blob.size` {#blobsize}

**Añadido en: v15.7.0, v14.18.0**

El tamaño total del `Blob` en bytes.

### `blob.slice([start[, end[, type]]])` {#blobslicestart-end-type}

**Añadido en: v15.7.0, v14.18.0**

- `start` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El índice inicial.
- `end` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El índice final.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El tipo de contenido para el nuevo `Blob`.

Crea y devuelve un nuevo `Blob` que contiene un subconjunto de los datos de este objeto `Blob`. El `Blob` original no se modifica.

### `blob.stream()` {#blobstream}

**Añadido en: v16.7.0**

- Devuelve: [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream)

Devuelve un nuevo `ReadableStream` que permite leer el contenido del `Blob`.

### `blob.text()` {#blobtext}

**Añadido en: v15.7.0, v14.18.0**

- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Devuelve una promesa que se cumple con el contenido del `Blob` decodificado como una cadena UTF-8.

### `blob.type` {#blobtype}

**Añadido en: v15.7.0, v14.18.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El tipo de contenido del `Blob`.


### Objetos `Blob` y `MessageChannel` {#blob-objects-and-messagechannel}

Una vez que se crea un objeto [\<Blob\>](/es/nodejs/api/buffer#class-blob), se puede enviar a través de `MessagePort` a múltiples destinos sin transferir o copiar inmediatamente los datos. Los datos contenidos en el `Blob` se copian solo cuando se llaman a los métodos `arrayBuffer()` o `text()`.

::: code-group
```js [ESM]
import { Blob } from 'node:buffer';
import { setTimeout as delay } from 'node:timers/promises';

const blob = new Blob(['hello there']);

const mc1 = new MessageChannel();
const mc2 = new MessageChannel();

mc1.port1.onmessage = async ({ data }) => {
  console.log(await data.arrayBuffer());
  mc1.port1.close();
};

mc2.port1.onmessage = async ({ data }) => {
  await delay(1000);
  console.log(await data.arrayBuffer());
  mc2.port1.close();
};

mc1.port2.postMessage(blob);
mc2.port2.postMessage(blob);

// The Blob is still usable after posting.
blob.text().then(console.log);
```

```js [CJS]
const { Blob } = require('node:buffer');
const { setTimeout: delay } = require('node:timers/promises');

const blob = new Blob(['hello there']);

const mc1 = new MessageChannel();
const mc2 = new MessageChannel();

mc1.port1.onmessage = async ({ data }) => {
  console.log(await data.arrayBuffer());
  mc1.port1.close();
};

mc2.port1.onmessage = async ({ data }) => {
  await delay(1000);
  console.log(await data.arrayBuffer());
  mc2.port1.close();
};

mc1.port2.postMessage(blob);
mc2.port2.postMessage(blob);

// The Blob is still usable after posting.
blob.text().then(console.log);
```
:::

## Clase: `Buffer` {#class-buffer}

La clase `Buffer` es un tipo global para tratar directamente con datos binarios. Se puede construir de varias maneras.

### Método estático: `Buffer.alloc(size[, fill[, encoding]])` {#static-method-bufferallocsize-fill-encoding}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.0.0 | Lanza ERR_INVALID_ARG_TYPE o ERR_OUT_OF_RANGE en lugar de ERR_INVALID_ARG_VALUE para argumentos de entrada no válidos. |
| v15.0.0 | Lanza ERR_INVALID_ARG_VALUE en lugar de ERR_INVALID_OPT_VALUE para argumentos de entrada no válidos. |
| v10.0.0 | Intentar rellenar un búfer de longitud distinta de cero con un búfer de longitud cero desencadena una excepción. |
| v10.0.0 | Especificar una cadena no válida para `fill` desencadena una excepción. |
| v8.9.3 | Especificar una cadena no válida para `fill` ahora resulta en un búfer relleno con ceros. |
| v5.10.0 | Añadido en: v5.10.0 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longitud deseada del nuevo `Buffer`.
- `fill` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un valor para pre-rellenar el nuevo `Buffer`. **Predeterminado:** `0`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si `fill` es una cadena, esta es su codificación. **Predeterminado:** `'utf8'`.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Asigna un nuevo `Buffer` de `size` bytes. Si `fill` es `undefined`, el `Buffer` se rellenará con ceros.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(5);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(5);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00>
```
:::

Si `size` es mayor que [`buffer.constants.MAX_LENGTH`](/es/nodejs/api/buffer#bufferconstantsmax_length) o menor que 0, se lanza [`ERR_OUT_OF_RANGE`](/es/nodejs/api/errors#err_out_of_range).

Si se especifica `fill`, el `Buffer` asignado se inicializará llamando a [`buf.fill(fill)`](/es/nodejs/api/buffer#buffillvalue-offset-end-encoding).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(5, 'a');

console.log(buf);
// Prints: <Buffer 61 61 61 61 61>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(5, 'a');

console.log(buf);
// Prints: <Buffer 61 61 61 61 61>
```
:::

Si se especifican tanto `fill` como `encoding`, el `Buffer` asignado se inicializará llamando a [`buf.fill(fill, encoding)`](/es/nodejs/api/buffer#buffillvalue-offset-end-encoding).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(11, 'aGVsbG8gd29ybGQ=', 'base64');

console.log(buf);
// Prints: <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(11, 'aGVsbG8gd29ybGQ=', 'base64');

console.log(buf);
// Prints: <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
```
:::

Llamar a [`Buffer.alloc()`](/es/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) puede ser mensurablemente más lento que la alternativa [`Buffer.allocUnsafe()`](/es/nodejs/api/buffer#static-method-bufferallocunsafesize), pero asegura que el contenido de la instancia `Buffer` recién creada nunca contendrá datos sensibles de asignaciones anteriores, incluidos los datos que podrían no haber sido asignados para `Buffer`s.

Se lanzará un `TypeError` si `size` no es un número.


### Método estático: `Buffer.allocUnsafe(size)` {#static-method-bufferallocunsafesize}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.0.0 | Lanza ERR_INVALID_ARG_TYPE o ERR_OUT_OF_RANGE en lugar de ERR_INVALID_ARG_VALUE para argumentos de entrada inválidos. |
| v15.0.0 | Lanza ERR_INVALID_ARG_VALUE en lugar de ERR_INVALID_OPT_VALUE para argumentos de entrada inválidos. |
| v7.0.0 | Pasar un `size` negativo ahora lanzará un error. |
| v5.10.0 | Añadido en: v5.10.0 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longitud deseada del nuevo `Buffer`.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Asigna un nuevo `Buffer` de `size` bytes. Si `size` es mayor que [`buffer.constants.MAX_LENGTH`](/es/nodejs/api/buffer#bufferconstantsmax_length) o menor que 0, se lanza [`ERR_OUT_OF_RANGE`](/es/nodejs/api/errors#err_out_of_range).

La memoria subyacente para las instancias de `Buffer` creadas de esta manera *no está inicializada*. El contenido del `Buffer` recién creado es desconocido y *puede contener datos confidenciales*. Use [`Buffer.alloc()`](/es/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) en su lugar para inicializar las instancias de `Buffer` con ceros.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(10);

console.log(buf);
// Imprime (el contenido puede variar): <Buffer a0 8b 28 3f 01 00 00 00 50 32>

buf.fill(0);

console.log(buf);
// Imprime: <Buffer 00 00 00 00 00 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(10);

console.log(buf);
// Imprime (el contenido puede variar): <Buffer a0 8b 28 3f 01 00 00 00 50 32>

buf.fill(0);

console.log(buf);
// Imprime: <Buffer 00 00 00 00 00 00 00 00 00 00>
```
:::

Se lanzará un `TypeError` si `size` no es un número.

El módulo `Buffer` pre-asigna una instancia interna de `Buffer` de tamaño [`Buffer.poolSize`](/es/nodejs/api/buffer#class-property-bufferpoolsize) que se utiliza como un pool para la asignación rápida de nuevas instancias de `Buffer` creadas usando [`Buffer.allocUnsafe()`](/es/nodejs/api/buffer#static-method-bufferallocunsafesize), [`Buffer.from(array)`](/es/nodejs/api/buffer#static-method-bufferfromarray), [`Buffer.from(string)`](/es/nodejs/api/buffer#static-method-bufferfromstring-encoding), y [`Buffer.concat()`](/es/nodejs/api/buffer#static-method-bufferconcatlist-totallength) solo cuando `size` es menor que `Buffer.poolSize \>\>\> 1` (parte entera de [`Buffer.poolSize`](/es/nodejs/api/buffer#class-property-bufferpoolsize) dividido por dos).

El uso de este pool de memoria interno pre-asignado es una diferencia clave entre llamar a `Buffer.alloc(size, fill)` vs. `Buffer.allocUnsafe(size).fill(fill)`. Específicamente, `Buffer.alloc(size, fill)` *nunca* usará el pool interno de `Buffer`, mientras que `Buffer.allocUnsafe(size).fill(fill)` *usará* el pool interno de `Buffer` si `size` es menor o igual a la mitad de [`Buffer.poolSize`](/es/nodejs/api/buffer#class-property-bufferpoolsize). La diferencia es sutil pero puede ser importante cuando una aplicación requiere el rendimiento adicional que proporciona [`Buffer.allocUnsafe()`](/es/nodejs/api/buffer#static-method-bufferallocunsafesize).


### Método estático: `Buffer.allocUnsafeSlow(size)` {#static-method-bufferallocunsafeslowsize}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.0.0 | Lanza ERR_INVALID_ARG_TYPE o ERR_OUT_OF_RANGE en lugar de ERR_INVALID_ARG_VALUE para argumentos de entrada no válidos. |
| v15.0.0 | Lanza ERR_INVALID_ARG_VALUE en lugar de ERR_INVALID_OPT_VALUE para argumentos de entrada no válidos. |
| v5.12.0 | Añadido en: v5.12.0 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longitud deseada del nuevo `Buffer`.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Asigna un nuevo `Buffer` de `size` bytes. Si `size` es mayor que [`buffer.constants.MAX_LENGTH`](/es/nodejs/api/buffer#bufferconstantsmax_length) o menor que 0, se lanza [`ERR_OUT_OF_RANGE`](/es/nodejs/api/errors#err_out_of_range). Se crea un `Buffer` de longitud cero si `size` es 0.

La memoria subyacente para las instancias de `Buffer` creadas de esta manera *no se inicializa*. El contenido del `Buffer` recién creado es desconocido y *puede contener datos confidenciales*. Utilice [`buf.fill(0)`](/es/nodejs/api/buffer#buffillvalue-offset-end-encoding) para inicializar dichas instancias de `Buffer` con ceros.

Cuando se utiliza [`Buffer.allocUnsafe()`](/es/nodejs/api/buffer#static-method-bufferallocunsafesize) para asignar nuevas instancias de `Buffer`, las asignaciones inferiores a `Buffer.poolSize \>\>\> 1` (4KiB cuando se utiliza el poolSize predeterminado) se extraen de un único `Buffer` preasignado. Esto permite a las aplicaciones evitar la sobrecarga de la recolección de basura que supone la creación de muchas instancias de `Buffer` asignadas individualmente. Este enfoque mejora tanto el rendimiento como el uso de la memoria al eliminar la necesidad de rastrear y limpiar tantos objetos `ArrayBuffer` individuales.

Sin embargo, en el caso de que un desarrollador necesite retener un pequeño fragmento de memoria de un pool durante un tiempo indeterminado, puede ser apropiado crear una instancia de `Buffer` no agrupada utilizando `Buffer.allocUnsafeSlow()` y, a continuación, copiar los bits relevantes.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Need to keep around a few small chunks of memory.
const store = [];

socket.on('readable', () => {
  let data;
  while (null !== (data = readable.read())) {
    // Allocate for retained data.
    const sb = Buffer.allocUnsafeSlow(10);

    // Copy the data into the new allocation.
    data.copy(sb, 0, 0, 10);

    store.push(sb);
  }
});
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Need to keep around a few small chunks of memory.
const store = [];

socket.on('readable', () => {
  let data;
  while (null !== (data = readable.read())) {
    // Allocate for retained data.
    const sb = Buffer.allocUnsafeSlow(10);

    // Copy the data into the new allocation.
    data.copy(sb, 0, 0, 10);

    store.push(sb);
  }
});
```
:::

Se lanzará un `TypeError` si `size` no es un número.


### Método estático: `Buffer.byteLength(string[, encoding])` {#static-method-bufferbytelengthstring-encoding}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v7.0.0 | Pasar una entrada no válida ahora arrojará un error. |
| v5.10.0 | El parámetro `string` ahora puede ser cualquier `TypedArray`, `DataView` o `ArrayBuffer`. |
| v0.1.90 | Añadido en: v0.1.90 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) Un valor para calcular la longitud de.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si `string` es una cadena, esta es su codificación. **Predeterminado:** `'utf8'`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes contenidos dentro de `string`.

Devuelve la longitud en bytes de una cadena cuando se codifica utilizando `encoding`. Esto no es lo mismo que [`String.prototype.length`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length), que no tiene en cuenta la codificación que se utiliza para convertir la cadena en bytes.

Para `'base64'`, `'base64url'` y `'hex'`, esta función asume una entrada válida. Para cadenas que contienen datos no codificados en base64/hexadecimal (por ejemplo, espacios en blanco), el valor de retorno puede ser mayor que la longitud de un `Buffer` creado a partir de la cadena.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} characters, ` +
            `${Buffer.byteLength(str, 'utf8')} bytes`);
// Prints: ½ + ¼ = ¾: 9 characters, 12 bytes
```

```js [CJS]
const { Buffer } = require('node:buffer');

const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} characters, ` +
            `${Buffer.byteLength(str, 'utf8')} bytes`);
// Prints: ½ + ¼ = ¾: 9 characters, 12 bytes
```
:::

Cuando `string` es un `Buffer`/[`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)/[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)/[`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)/ [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), se devuelve la longitud en bytes según lo informado por `.byteLength`.


### Método estático: `Buffer.compare(buf1, buf2)` {#static-method-buffercomparebuf1-buf2}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v8.0.0 | Los argumentos ahora pueden ser `Uint8Array`s. |
| v0.11.13 | Añadido en: v0.11.13 |
:::

- `buf1` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `buf2` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ya sea `-1`, `0` o `1`, dependiendo del resultado de la comparación. Consulte [`buf.compare()`](/es/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend) para obtener más detalles.

Compara `buf1` con `buf2`, normalmente con el propósito de ordenar arrays de instancias de `Buffer`. Esto es equivalente a llamar a [`buf1.compare(buf2)`](/es/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// Imprime: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (Este resultado es igual a: [buf2, buf1].)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// Imprime: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (Este resultado es igual a: [buf2, buf1].)
```
:::

### Método estático: `Buffer.concat(list[, totalLength])` {#static-method-bufferconcatlist-totallength}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v8.0.0 | Los elementos de `list` ahora pueden ser `Uint8Array`s. |
| v0.7.11 | Añadido en: v0.7.11 |
:::

- `list` [\<Buffer[]\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Lista de instancias de `Buffer` o [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) a concatenar.
- `totalLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Longitud total de las instancias de `Buffer` en `list` cuando se concatenan.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Devuelve un nuevo `Buffer` que es el resultado de concatenar todas las instancias de `Buffer` en la `list`.

Si la lista no tiene elementos, o si el `totalLength` es 0, entonces se devuelve un nuevo `Buffer` de longitud cero.

Si no se proporciona `totalLength`, se calcula a partir de las instancias de `Buffer` en `list` sumando sus longitudes.

Si se proporciona `totalLength`, se convierte en un entero sin signo. Si la longitud combinada de los `Buffer`s en `list` excede `totalLength`, el resultado se trunca a `totalLength`. Si la longitud combinada de los `Buffer`s en `list` es menor que `totalLength`, el espacio restante se rellena con ceros.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Crea un solo `Buffer` a partir de una lista de tres instancias de `Buffer`.

const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// Imprime: 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

console.log(bufA);
// Imprime: <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// Imprime: 42
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Crea un solo `Buffer` a partir de una lista de tres instancias de `Buffer`.

const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// Imprime: 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

console.log(bufA);
// Imprime: <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// Imprime: 42
```
:::

`Buffer.concat()` también puede usar el pool interno de `Buffer` como lo hace [`Buffer.allocUnsafe()`](/es/nodejs/api/buffer#static-method-bufferallocunsafesize).


### Método estático: `Buffer.copyBytesFrom(view[, offset[, length]])` {#static-method-buffercopybytesfromview-offset-length}

**Agregado en: v19.8.0, v18.16.0**

- `view` [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) El [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) a copiar.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El desplazamiento inicial dentro de `view`. **Predeterminado**: `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de elementos de `view` a copiar. **Predeterminado:** `view.length - offset`.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Copia la memoria subyacente de `view` en un nuevo `Buffer`.

```js [ESM]
const u16 = new Uint16Array([0, 0xffff]);
const buf = Buffer.copyBytesFrom(u16, 1, 1);
u16[1] = 0;
console.log(buf.length); // 2
console.log(buf[0]); // 255
console.log(buf[1]); // 255
```
### Método estático: `Buffer.from(array)` {#static-method-bufferfromarray}

**Agregado en: v5.10.0**

- `array` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Asigna un nuevo `Buffer` usando una `array` de bytes en el rango `0` – `255`. Las entradas de array fuera de ese rango se truncarán para que quepan en él.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Crea un nuevo Buffer que contiene los bytes UTF-8 de la cadena 'buffer'.
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Crea un nuevo Buffer que contiene los bytes UTF-8 de la cadena 'buffer'.
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```
:::

Si `array` es un objeto similar a `Array` (es decir, uno con una propiedad `length` de tipo `number`), se trata como si fuera un array, a menos que sea un `Buffer` o un `Uint8Array`. Esto significa que todas las demás variantes de `TypedArray` se tratan como un `Array`. Para crear un `Buffer` a partir de los bytes que respaldan un `TypedArray`, use [`Buffer.copyBytesFrom()`](/es/nodejs/api/buffer#static-method-buffercopybytesfromview-offset-length).

Se lanzará un `TypeError` si `array` no es un `Array` u otro tipo apropiado para las variantes de `Buffer.from()`.

`Buffer.from(array)` y [`Buffer.from(string)`](/es/nodejs/api/buffer#static-method-bufferfromstring-encoding) también pueden usar el pool interno de `Buffer` como lo hace [`Buffer.allocUnsafe()`](/es/nodejs/api/buffer#static-method-bufferallocunsafesize).


### Método estático: `Buffer.from(arrayBuffer[, byteOffset[, length]])` {#static-method-bufferfromarraybuffer-byteoffset-length}

**Agregado en: v5.10.0**

- `arrayBuffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) Un [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), por ejemplo, la propiedad `.buffer` de un [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Índice del primer byte para exponer. **Predeterminado:** `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes para exponer. **Predeterminado:** `arrayBuffer.byteLength - byteOffset`.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Esto crea una vista del [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) sin copiar la memoria subyacente. Por ejemplo, cuando se pasa una referencia a la propiedad `.buffer` de una instancia de [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), el `Buffer` recién creado compartirá la misma memoria asignada que el `ArrayBuffer` subyacente de [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Shares memory with `arr`.
const buf = Buffer.from(arr.buffer);

console.log(buf);
// Prints: <Buffer 88 13 a0 0f>

// Changing the original Uint16Array changes the Buffer also.
arr[1] = 6000;

console.log(buf);
// Prints: <Buffer 88 13 70 17>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Shares memory with `arr`.
const buf = Buffer.from(arr.buffer);

console.log(buf);
// Prints: <Buffer 88 13 a0 0f>

// Changing the original Uint16Array changes the Buffer also.
arr[1] = 6000;

console.log(buf);
// Prints: <Buffer 88 13 70 17>
```
:::

Los argumentos opcionales `byteOffset` y `length` especifican un rango de memoria dentro de `arrayBuffer` que será compartido por el `Buffer`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const ab = new ArrayBuffer(10);
const buf = Buffer.from(ab, 0, 2);

console.log(buf.length);
// Prints: 2
```

```js [CJS]
const { Buffer } = require('node:buffer');

const ab = new ArrayBuffer(10);
const buf = Buffer.from(ab, 0, 2);

console.log(buf.length);
// Prints: 2
```
:::

Se lanzará un `TypeError` si `arrayBuffer` no es un [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) o un [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) u otro tipo apropiado para las variantes de `Buffer.from()`.

Es importante recordar que un `ArrayBuffer` de respaldo puede cubrir un rango de memoria que se extiende más allá de los límites de una vista de `TypedArray`. Un nuevo `Buffer` creado usando la propiedad `buffer` de un `TypedArray` puede extenderse más allá del rango del `TypedArray`:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arrA = Uint8Array.from([0x63, 0x64, 0x65, 0x66]); // 4 elements
const arrB = new Uint8Array(arrA.buffer, 1, 2); // 2 elements
console.log(arrA.buffer === arrB.buffer); // true

const buf = Buffer.from(arrB.buffer);
console.log(buf);
// Prints: <Buffer 63 64 65 66>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arrA = Uint8Array.from([0x63, 0x64, 0x65, 0x66]); // 4 elements
const arrB = new Uint8Array(arrA.buffer, 1, 2); // 2 elements
console.log(arrA.buffer === arrB.buffer); // true

const buf = Buffer.from(arrB.buffer);
console.log(buf);
// Prints: <Buffer 63 64 65 66>
```
:::


### Método estático: `Buffer.from(buffer)` {#static-method-bufferfrombuffer}

**Agregado en: v5.10.0**

- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Un `Buffer` o [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) existente desde el cual copiar los datos.
- Regresa: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Copia los datos del `buffer` pasado a una nueva instancia de `Buffer`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('buffer');
const buf2 = Buffer.from(buf1);

buf1[0] = 0x61;

console.log(buf1.toString());
// Imprime: auffer
console.log(buf2.toString());
// Imprime: buffer
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('buffer');
const buf2 = Buffer.from(buf1);

buf1[0] = 0x61;

console.log(buf1.toString());
// Imprime: auffer
console.log(buf2.toString());
// Imprime: buffer
```
:::

Se lanzará un `TypeError` si `buffer` no es un `Buffer` u otro tipo apropiado para las variantes de `Buffer.from()`.

### Método estático: `Buffer.from(object[, offsetOrEncoding[, length]])` {#static-method-bufferfromobject-offsetorencoding-length}

**Agregado en: v8.2.0**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objeto que soporta `Symbol.toPrimitive` o `valueOf()`.
- `offsetOrEncoding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un desplazamiento de byte o una codificación.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Una longitud.
- Regresa: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Para los objetos cuya función `valueOf()` devuelve un valor no estrictamente igual a `object`, regresa `Buffer.from(object.valueOf(), offsetOrEncoding, length)`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from(new String('this is a test'));
// Imprime: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from(new String('this is a test'));
// Imprime: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```
:::

Para objetos que soportan `Symbol.toPrimitive`, regresa `Buffer.from(object[Symbol.toPrimitive]('string'), offsetOrEncoding)`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

class Foo {
  [Symbol.toPrimitive]() {
    return 'this is a test';
  }
}

const buf = Buffer.from(new Foo(), 'utf8');
// Imprime: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```

```js [CJS]
const { Buffer } = require('node:buffer');

class Foo {
  [Symbol.toPrimitive]() {
    return 'this is a test';
  }
}

const buf = Buffer.from(new Foo(), 'utf8');
// Imprime: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```
:::

Se lanzará un `TypeError` si `object` no tiene los métodos mencionados o no es de otro tipo apropiado para las variantes de `Buffer.from()`.


### Método estático: `Buffer.from(string[, encoding])` {#static-method-bufferfromstring-encoding}

**Agregado en: v5.10.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una cadena para codificar.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codificación de `string`. **Predeterminado:** `'utf8'`.
- Regresa: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Crea un nuevo `Buffer` que contiene `string`. El parámetro `encoding` identifica la codificación de caracteres que se usará al convertir `string` en bytes.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('this is a tést');
const buf2 = Buffer.from('7468697320697320612074c3a97374', 'hex');

console.log(buf1.toString());
// Imprime: this is a tést
console.log(buf2.toString());
// Imprime: this is a tést
console.log(buf1.toString('latin1'));
// Imprime: this is a tÃ©st
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('this is a tést');
const buf2 = Buffer.from('7468697320697320612074c3a97374', 'hex');

console.log(buf1.toString());
// Imprime: this is a tést
console.log(buf2.toString());
// Imprime: this is a tést
console.log(buf1.toString('latin1'));
// Imprime: this is a tÃ©st
```
:::

Se lanzará un `TypeError` si `string` no es una cadena u otro tipo apropiado para las variantes de `Buffer.from()`.

[`Buffer.from(string)`](/es/nodejs/api/buffer#static-method-bufferfromstring-encoding) también puede usar el pool interno de `Buffer` como lo hace [`Buffer.allocUnsafe()`](/es/nodejs/api/buffer#static-method-bufferallocunsafesize).

### Método estático: `Buffer.isBuffer(obj)` {#static-method-bufferisbufferobj}

**Agregado en: v0.1.101**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Regresa: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Regresa `true` si `obj` es un `Buffer`, `false` en caso contrario.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

Buffer.isBuffer(Buffer.alloc(10)); // true
Buffer.isBuffer(Buffer.from('foo')); // true
Buffer.isBuffer('a string'); // false
Buffer.isBuffer([]); // false
Buffer.isBuffer(new Uint8Array(1024)); // false
```

```js [CJS]
const { Buffer } = require('node:buffer');

Buffer.isBuffer(Buffer.alloc(10)); // true
Buffer.isBuffer(Buffer.from('foo')); // true
Buffer.isBuffer('a string'); // false
Buffer.isBuffer([]); // false
Buffer.isBuffer(new Uint8Array(1024)); // false
```
:::


### Método estático: `Buffer.isEncoding(encoding)` {#static-method-bufferisencodingencoding}

**Agregado en: v0.9.1**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un nombre de codificación de caracteres para verificar.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si `encoding` es el nombre de una codificación de caracteres soportada, o `false` en caso contrario.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

console.log(Buffer.isEncoding('utf8'));
// Imprime: true

console.log(Buffer.isEncoding('hex'));
// Imprime: true

console.log(Buffer.isEncoding('utf/8'));
// Imprime: false

console.log(Buffer.isEncoding(''));
// Imprime: false
```

```js [CJS]
const { Buffer } = require('node:buffer');

console.log(Buffer.isEncoding('utf8'));
// Imprime: true

console.log(Buffer.isEncoding('hex'));
// Imprime: true

console.log(Buffer.isEncoding('utf/8'));
// Imprime: false

console.log(Buffer.isEncoding(''));
// Imprime: false
```
:::

### Propiedad de clase: `Buffer.poolSize` {#class-property-bufferpoolsize}

**Agregado en: v0.11.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `8192`

Este es el tamaño (en bytes) de las instancias internas de `Buffer` preasignadas que se utilizan para la agrupación. Este valor puede ser modificado.

### `buf[index]` {#bufindex}

- `index` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El operador de índice `[index]` puede ser utilizado para obtener y establecer el octeto en la posición `index` en `buf`. Los valores se refieren a bytes individuales, por lo que el rango de valores legales está entre `0x00` y `0xFF` (hexadecimal) o `0` y `255` (decimal).

Este operador se hereda de `Uint8Array`, por lo que su comportamiento en el acceso fuera de los límites es el mismo que `Uint8Array`. En otras palabras, `buf[index]` devuelve `undefined` cuando `index` es negativo o mayor o igual que `buf.length`, y `buf[index] = value` no modifica el búfer si `index` es negativo o `\>= buf.length`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Copiar una cadena ASCII en un `Buffer` un byte a la vez.
// (Esto sólo funciona para cadenas ASCII. En general, se debe usar
// `Buffer.from()` para realizar esta conversión.)

const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('utf8'));
// Imprime: Node.js
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Copiar una cadena ASCII en un `Buffer` un byte a la vez.
// (Esto sólo funciona para cadenas ASCII. En general, se debe usar
// `Buffer.from()` para realizar esta conversión.)

const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('utf8'));
// Imprime: Node.js
```
:::


### `buf.buffer` {#bufbuffer}

- [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) El objeto `ArrayBuffer` subyacente en el que se basa este objeto `Buffer`.

No se garantiza que este `ArrayBuffer` corresponda exactamente al `Buffer` original. Consulte las notas sobre `buf.byteOffset` para obtener más detalles.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arrayBuffer = new ArrayBuffer(16);
const buffer = Buffer.from(arrayBuffer);

console.log(buffer.buffer === arrayBuffer);
// Imprime: true
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arrayBuffer = new ArrayBuffer(16);
const buffer = Buffer.from(arrayBuffer);

console.log(buffer.buffer === arrayBuffer);
// Imprime: true
```
:::

### `buf.byteOffset` {#bufbyteoffset}

- [\<entero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El `byteOffset` del objeto `ArrayBuffer` subyacente del `Buffer`.

Al establecer `byteOffset` en `Buffer.from(ArrayBuffer, byteOffset, length)`, o a veces al asignar un `Buffer` más pequeño que `Buffer.poolSize`, el búfer no comienza desde un desplazamiento cero en el `ArrayBuffer` subyacente.

Esto puede causar problemas al acceder al `ArrayBuffer` subyacente directamente mediante `buf.buffer`, ya que otras partes del `ArrayBuffer` pueden no estar relacionadas con el objeto `Buffer` en sí.

Un problema común al crear un objeto `TypedArray` que comparte su memoria con un `Buffer` es que, en este caso, es necesario especificar el `byteOffset` correctamente:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Crea un búfer más pequeño que `Buffer.poolSize`.
const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// Al convertir el Node.js Buffer a un Int8Array, utiliza el byteOffset
// para referirte solo a la parte de `nodeBuffer.buffer` que contiene la memoria
// para `nodeBuffer`.
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Crea un búfer más pequeño que `Buffer.poolSize`.
const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// Al convertir el Node.js Buffer a un Int8Array, utiliza el byteOffset
// para referirte solo a la parte de `nodeBuffer.buffer` que contiene la memoria
// para `nodeBuffer`.
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
```
:::


### `buf.compare(target[, targetStart[, targetEnd[, sourceStart[, sourceEnd]]]])` {#bufcomparetarget-targetstart-targetend-sourcestart-sourceend}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v8.0.0 | El parámetro `target` ahora puede ser un `Uint8Array`. |
| v5.11.0 | Ahora se admiten parámetros adicionales para especificar desplazamientos. |
| v0.11.13 | Añadido en: v0.11.13 |
:::

- `target` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Un `Buffer` o [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) con el que comparar `buf`.
- `targetStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El desplazamiento dentro de `target` donde comenzar la comparación. **Predeterminado:** `0`.
- `targetEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El desplazamiento dentro de `target` donde finalizar la comparación (no inclusivo). **Predeterminado:** `target.length`.
- `sourceStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El desplazamiento dentro de `buf` donde comenzar la comparación. **Predeterminado:** `0`.
- `sourceEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El desplazamiento dentro de `buf` donde finalizar la comparación (no inclusivo). **Predeterminado:** [`buf.length`](/es/nodejs/api/buffer#buflength).
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Compara `buf` con `target` y devuelve un número que indica si `buf` está antes, después o es igual que `target` en el orden de clasificación. La comparación se basa en la secuencia real de bytes en cada `Buffer`.

- Se devuelve `0` si `target` es igual que `buf`
- Se devuelve `1` si `target` debe ir *antes* que `buf` cuando se ordena.
- Se devuelve `-1` si `target` debe ir *después* que `buf` cuando se ordena.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('BCD');
const buf3 = Buffer.from('ABCD');

console.log(buf1.compare(buf1));
// Prints: 0
console.log(buf1.compare(buf2));
// Prints: -1
console.log(buf1.compare(buf3));
// Prints: -1
console.log(buf2.compare(buf1));
// Prints: 1
console.log(buf2.compare(buf3));
// Prints: 1
console.log([buf1, buf2, buf3].sort(Buffer.compare));
// Prints: [ <Buffer 41 42 43>, <Buffer 41 42 43 44>, <Buffer 42 43 44> ]
// (This result is equal to: [buf1, buf3, buf2].)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('BCD');
const buf3 = Buffer.from('ABCD');

console.log(buf1.compare(buf1));
// Prints: 0
console.log(buf1.compare(buf2));
// Prints: -1
console.log(buf1.compare(buf3));
// Prints: -1
console.log(buf2.compare(buf1));
// Prints: 1
console.log(buf2.compare(buf3));
// Prints: 1
console.log([buf1, buf2, buf3].sort(Buffer.compare));
// Prints: [ <Buffer 41 42 43>, <Buffer 41 42 43 44>, <Buffer 42 43 44> ]
// (This result is equal to: [buf1, buf3, buf2].)
```
:::

Los argumentos opcionales `targetStart`, `targetEnd`, `sourceStart` y `sourceEnd` se pueden utilizar para limitar la comparación a rangos específicos dentro de `target` y `buf`, respectivamente.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const buf2 = Buffer.from([5, 6, 7, 8, 9, 1, 2, 3, 4]);

console.log(buf1.compare(buf2, 5, 9, 0, 4));
// Prints: 0
console.log(buf1.compare(buf2, 0, 6, 4));
// Prints: -1
console.log(buf1.compare(buf2, 5, 6, 5));
// Prints: 1
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const buf2 = Buffer.from([5, 6, 7, 8, 9, 1, 2, 3, 4]);

console.log(buf1.compare(buf2, 5, 9, 0, 4));
// Prints: 0
console.log(buf1.compare(buf2, 0, 6, 4));
// Prints: -1
console.log(buf1.compare(buf2, 5, 6, 5));
// Prints: 1
```
:::

Se lanza [`ERR_OUT_OF_RANGE`](/es/nodejs/api/errors#err_out_of_range) si `targetStart \< 0`, `sourceStart \< 0`, `targetEnd \> target.byteLength` o `sourceEnd \> source.byteLength`.


### `buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])` {#bufcopytarget-targetstart-sourcestart-sourceend}

**Añadido en: v0.1.90**

- `target` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Un `Buffer` o [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) en el que copiar.
- `targetStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El desplazamiento dentro de `target` en el que empezar a escribir. **Predeterminado:** `0`.
- `sourceStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El desplazamiento dentro de `buf` desde el que empezar a copiar. **Predeterminado:** `0`.
- `sourceEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El desplazamiento dentro de `buf` en el que dejar de copiar (no inclusivo). **Predeterminado:** [`buf.length`](/es/nodejs/api/buffer#buflength).
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes copiados.

Copia datos de una región de `buf` a una región en `target`, incluso si la región de memoria `target` se superpone con `buf`.

[`TypedArray.prototype.set()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/set) realiza la misma operación, y está disponible para todos los TypedArrays, incluyendo los `Buffer`s de Node.js, aunque toma diferentes argumentos de función.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Create two `Buffer` instances.
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf1[i] = i + 97;
}

// Copy `buf1` bytes 16 through 19 into `buf2` starting at byte 8 of `buf2`.
buf1.copy(buf2, 8, 16, 20);
// This is equivalent to:
// buf2.set(buf1.subarray(16, 20), 8);

console.log(buf2.toString('ascii', 0, 25));
// Prints: !!!!!!!!qrst!!!!!!!!!!!!!
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Create two `Buffer` instances.
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf1[i] = i + 97;
}

// Copy `buf1` bytes 16 through 19 into `buf2` starting at byte 8 of `buf2`.
buf1.copy(buf2, 8, 16, 20);
// This is equivalent to:
// buf2.set(buf1.subarray(16, 20), 8);

console.log(buf2.toString('ascii', 0, 25));
// Prints: !!!!!!!!qrst!!!!!!!!!!!!!
```
:::

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Create a `Buffer` and copy data from one region to an overlapping region
// within the same `Buffer`.

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// Prints: efghijghijklmnopqrstuvwxyz
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Create a `Buffer` and copy data from one region to an overlapping region
// within the same `Buffer`.

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// Prints: efghijghijklmnopqrstuvwxyz
```
:::


### `buf.entries()` {#bufentries}

**Añadido en: v1.1.0**

- Devuelve: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Crea y devuelve un [iterador](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) de pares `[index, byte]` del contenido de `buf`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Registra todo el contenido de un 'Buffer'.

const buf = Buffer.from('buffer');

for (const pair of buf.entries()) {
  console.log(pair);
}
// Imprime:
//   [0, 98]
//   [1, 117]
//   [2, 102]
//   [3, 102]
//   [4, 101]
//   [5, 114]
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Registra todo el contenido de un 'Buffer'.

const buf = Buffer.from('buffer');

for (const pair of buf.entries()) {
  console.log(pair);
}
// Imprime:
//   [0, 98]
//   [1, 117]
//   [2, 102]
//   [3, 102]
//   [4, 101]
//   [5, 114]
```
:::

### `buf.equals(otherBuffer)` {#bufequalsotherbuffer}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v8.0.0 | Los argumentos ahora pueden ser `Uint8Array`s. |
| v0.11.13 | Añadido en: v0.11.13 |
:::

- `otherBuffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Un `Buffer` o [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) con el que comparar `buf`.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si tanto `buf` como `otherBuffer` tienen exactamente los mismos bytes, `false` en caso contrario. Equivalente a [`buf.compare(otherBuffer) === 0`](/es/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// Imprime: true
console.log(buf1.equals(buf3));
// Imprime: false
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// Imprime: true
console.log(buf1.equals(buf3));
// Imprime: false
```
:::


### `buf.fill(value[, offset[, end]][, encoding])` {#buffillvalue-offset-end-encoding}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v11.0.0 | Lanza `ERR_OUT_OF_RANGE` en lugar de `ERR_INDEX_OUT_OF_RANGE`. |
| v10.0.0 | Los valores `end` negativos lanzan un error `ERR_INDEX_OUT_OF_RANGE`. |
| v10.0.0 | Intentar llenar un búfer de longitud no nula con un búfer de longitud cero desencadena una excepción. |
| v10.0.0 | Especificar una cadena no válida para `value` desencadena una excepción. |
| v5.7.0 | El parámetro `encoding` ahora es compatible. |
| v0.5.0 | Añadido en: v0.5.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El valor con el que llenar `buf`. Un valor vacío (cadena, Uint8Array, Buffer) se coacciona a `0`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes que se omitirán antes de empezar a llenar `buf`. **Predeterminado:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dónde detener el llenado de `buf` (no inclusivo). **Predeterminado:** [`buf.length`](/es/nodejs/api/buffer#buflength).
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codificación para `value` si `value` es una cadena. **Predeterminado:** `'utf8'`.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) Una referencia a `buf`.

Llena `buf` con el `value` especificado. Si no se proporcionan `offset` y `end`, se llenará todo `buf`:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Llenar un `Buffer` con el carácter ASCII 'h'.

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// Imprime: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// Llenar un búfer con una cadena vacía
const c = Buffer.allocUnsafe(5).fill('');

console.log(c.fill(''));
// Imprime: <Buffer 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Llenar un `Buffer` con el carácter ASCII 'h'.

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// Imprime: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// Llenar un búfer con una cadena vacía
const c = Buffer.allocUnsafe(5).fill('');

console.log(c.fill(''));
// Imprime: <Buffer 00 00 00 00 00>
```
:::

`value` se coacciona a un valor `uint32` si no es una cadena, un `Buffer` o un entero. Si el entero resultante es mayor que `255` (decimal), `buf` se llenará con `value & 255`.

Si la escritura final de una operación `fill()` cae sobre un carácter multibyte, solo se escriben en `buf` los bytes de ese carácter que quepan:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Llenar un `Buffer` con un carácter que ocupa dos bytes en UTF-8.

console.log(Buffer.allocUnsafe(5).fill('\u0222'));
// Imprime: <Buffer c8 a2 c8 a2 c8>
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Llenar un `Buffer` con un carácter que ocupa dos bytes en UTF-8.

console.log(Buffer.allocUnsafe(5).fill('\u0222'));
// Imprime: <Buffer c8 a2 c8 a2 c8>
```
:::

Si `value` contiene caracteres no válidos, se trunca; si no quedan datos de relleno válidos, se lanza una excepción:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(5);

console.log(buf.fill('a'));
// Imprime: <Buffer 61 61 61 61 61>
console.log(buf.fill('aazz', 'hex'));
// Imprime: <Buffer aa aa aa aa aa>
console.log(buf.fill('zz', 'hex'));
// Lanza una excepción.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(5);

console.log(buf.fill('a'));
// Imprime: <Buffer 61 61 61 61 61>
console.log(buf.fill('aazz', 'hex'));
// Imprime: <Buffer aa aa aa aa aa>
console.log(buf.fill('zz', 'hex'));
// Lanza una excepción.
```
:::


### `buf.includes(value[, byteOffset][, encoding])` {#bufincludesvalue-byteoffset-encoding}

**Añadido en: v5.3.0**

- `value` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type) Qué buscar.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type) Dónde comenzar a buscar en `buf`. Si es negativo, el desplazamiento se calcula desde el final de `buf`. **Predeterminado:** `0`.
- `encoding` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) Si `value` es una cadena, esta es su codificación. **Predeterminado:** `'utf8'`.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si se encontró `value` en `buf`, `false` en caso contrario.

Equivalente a [`buf.indexOf() !== -1`](/es/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this is a buffer');

console.log(buf.includes('this'));
// Prints: true
console.log(buf.includes('is'));
// Prints: true
console.log(buf.includes(Buffer.from('a buffer')));
// Prints: true
console.log(buf.includes(97));
// Prints: true (97 es el valor ASCII decimal para 'a')
console.log(buf.includes(Buffer.from('a buffer example')));
// Prints: false
console.log(buf.includes(Buffer.from('a buffer example').slice(0, 8)));
// Prints: true
console.log(buf.includes('this', 4));
// Prints: false
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this is a buffer');

console.log(buf.includes('this'));
// Prints: true
console.log(buf.includes('is'));
// Prints: true
console.log(buf.includes(Buffer.from('a buffer')));
// Prints: true
console.log(buf.includes(97));
// Prints: true (97 es el valor ASCII decimal para 'a')
console.log(buf.includes(Buffer.from('a buffer example')));
// Prints: false
console.log(buf.includes(Buffer.from('a buffer example').slice(0, 8)));
// Prints: true
console.log(buf.includes('this', 4));
// Prints: false
```
:::


### `buf.indexOf(value[, byteOffset][, encoding])` {#bufindexofvalue-byteoffset-encoding}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v8.0.0 | El `value` ahora puede ser un `Uint8Array`. |
| v5.7.0, v4.4.0 | Cuando se pasa `encoding`, el parámetro `byteOffset` ya no es obligatorio. |
| v1.5.0 | Añadido en: v1.5.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Qué buscar.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dónde comenzar la búsqueda en `buf`. Si es negativo, el offset se calcula desde el final de `buf`. **Predeterminado:** `0`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si `value` es una cadena, esta es la codificación utilizada para determinar la representación binaria de la cadena que se buscará en `buf`. **Predeterminado:** `'utf8'`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El índice de la primera aparición de `value` en `buf`, o `-1` si `buf` no contiene `value`.

Si `value` es:

- una cadena, `value` se interpreta de acuerdo con la codificación de caracteres en `encoding`.
- un `Buffer` o [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), `value` se utilizará en su totalidad. Para comparar un `Buffer` parcial, use [`buf.subarray`](/es/nodejs/api/buffer#bufsubarraystart-end).
- un número, `value` se interpretará como un valor entero sin signo de 8 bits entre `0` y `255`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this is a buffer');

console.log(buf.indexOf('this'));
// Prints: 0
console.log(buf.indexOf('is'));
// Prints: 2
console.log(buf.indexOf(Buffer.from('a buffer')));
// Prints: 8
console.log(buf.indexOf(97));
// Prints: 8 (97 is the decimal ASCII value for 'a')
console.log(buf.indexOf(Buffer.from('a buffer example')));
// Prints: -1
console.log(buf.indexOf(Buffer.from('a buffer example').slice(0, 8)));
// Prints: 8

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.indexOf('\u03a3', 0, 'utf16le'));
// Prints: 4
console.log(utf16Buffer.indexOf('\u03a3', -4, 'utf16le'));
// Prints: 6
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this is a buffer');

console.log(buf.indexOf('this'));
// Prints: 0
console.log(buf.indexOf('is'));
// Prints: 2
console.log(buf.indexOf(Buffer.from('a buffer')));
// Prints: 8
console.log(buf.indexOf(97));
// Prints: 8 (97 is the decimal ASCII value for 'a')
console.log(buf.indexOf(Buffer.from('a buffer example')));
// Prints: -1
console.log(buf.indexOf(Buffer.from('a buffer example').slice(0, 8)));
// Prints: 8

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.indexOf('\u03a3', 0, 'utf16le'));
// Prints: 4
console.log(utf16Buffer.indexOf('\u03a3', -4, 'utf16le'));
// Prints: 6
```
:::

Si `value` no es una cadena, un número o un `Buffer`, este método lanzará un `TypeError`. Si `value` es un número, se convertirá en un valor de byte válido, un entero entre 0 y 255.

Si `byteOffset` no es un número, se convertirá a un número. Si el resultado de la coerción es `NaN` o `0`, se buscará en todo el buffer. Este comportamiento coincide con [`String.prototype.indexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.indexOf(99.9));
console.log(b.indexOf(256 + 99));

// Passing a byteOffset that coerces to NaN or 0.
// Prints: 1, searching the whole buffer.
console.log(b.indexOf('b', undefined));
console.log(b.indexOf('b', {}));
console.log(b.indexOf('b', null));
console.log(b.indexOf('b', []));
```

```js [CJS]
const { Buffer } = require('node:buffer');

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.indexOf(99.9));
console.log(b.indexOf(256 + 99));

// Passing a byteOffset that coerces to NaN or 0.
// Prints: 1, searching the whole buffer.
console.log(b.indexOf('b', undefined));
console.log(b.indexOf('b', {}));
console.log(b.indexOf('b', null));
console.log(b.indexOf('b', []));
```
:::

Si `value` es una cadena vacía o un `Buffer` vacío y `byteOffset` es menor que `buf.length`, se devolverá `byteOffset`. Si `value` está vacío y `byteOffset` es al menos `buf.length`, se devolverá `buf.length`.


### `buf.keys()` {#bufkeys}

**Agregado en: v1.1.0**

- Devuelve: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Crea y devuelve un [iterador](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) de las claves (índices) de `buf`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

for (const key of buf.keys()) {
  console.log(key);
}
// Imprime:
//   0
//   1
//   2
//   3
//   4
//   5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

for (const key of buf.keys()) {
  console.log(key);
}
// Imprime:
//   0
//   1
//   2
//   3
//   4
//   5
```
:::

### `buf.lastIndexOf(value[, byteOffset][, encoding])` {#buflastindexofvalue-byteoffset-encoding}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v8.0.0 | El `value` ahora puede ser un `Uint8Array`. |
| v6.0.0 | Agregado en: v6.0.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Qué buscar.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dónde comenzar la búsqueda en `buf`. Si es negativo, el offset se calcula desde el final de `buf`. **Predeterminado:** `buf.length - 1`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si `value` es una cadena, esta es la codificación utilizada para determinar la representación binaria de la cadena que se buscará en `buf`. **Predeterminado:** `'utf8'`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El índice de la última aparición de `value` en `buf`, o `-1` si `buf` no contiene `value`.

Idéntico a [`buf.indexOf()`](/es/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding), excepto que se encuentra la última aparición de `value` en lugar de la primera.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this buffer is a buffer');

console.log(buf.lastIndexOf('this'));
// Imprime: 0
console.log(buf.lastIndexOf('buffer'));
// Imprime: 17
console.log(buf.lastIndexOf(Buffer.from('buffer')));
// Imprime: 17
console.log(buf.lastIndexOf(97));
// Imprime: 15 (97 es el valor ASCII decimal para 'a')
console.log(buf.lastIndexOf(Buffer.from('yolo')));
// Imprime: -1
console.log(buf.lastIndexOf('buffer', 5));
// Imprime: 5
console.log(buf.lastIndexOf('buffer', 4));
// Imprime: -1

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.lastIndexOf('\u03a3', undefined, 'utf16le'));
// Imprime: 6
console.log(utf16Buffer.lastIndexOf('\u03a3', -5, 'utf16le'));
// Imprime: 4
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this buffer is a buffer');

console.log(buf.lastIndexOf('this'));
// Imprime: 0
console.log(buf.lastIndexOf('buffer'));
// Imprime: 17
console.log(buf.lastIndexOf(Buffer.from('buffer')));
// Imprime: 17
console.log(buf.lastIndexOf(97));
// Imprime: 15 (97 es el valor ASCII decimal para 'a')
console.log(buf.lastIndexOf(Buffer.from('yolo')));
// Imprime: -1
console.log(buf.lastIndexOf('buffer', 5));
// Imprime: 5
console.log(buf.lastIndexOf('buffer', 4));
// Imprime: -1

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.lastIndexOf('\u03a3', undefined, 'utf16le'));
// Imprime: 6
console.log(utf16Buffer.lastIndexOf('\u03a3', -5, 'utf16le'));
// Imprime: 4
```
:::

Si `value` no es una cadena, un número o un `Buffer`, este método arrojará un `TypeError`. Si `value` es un número, se convertirá a un valor de byte válido, un entero entre 0 y 255.

Si `byteOffset` no es un número, se convertirá a un número. Cualquier argumento que se convierta a `NaN`, como `{}` o `undefined`, buscará en todo el búfer. Este comportamiento coincide con [`String.prototype.lastIndexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.lastIndexOf(99.9));
console.log(b.lastIndexOf(256 + 99));

// Passing a byteOffset that coerces to NaN.
// Prints: 1, searching the whole buffer.
console.log(b.lastIndexOf('b', undefined));
console.log(b.lastIndexOf('b', {}));

// Passing a byteOffset that coerces to 0.
// Prints: -1, equivalent to passing 0.
console.log(b.lastIndexOf('b', null));
console.log(b.lastIndexOf('b', []));
```

```js [CJS]
const { Buffer } = require('node:buffer');

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.lastIndexOf(99.9));
console.log(b.lastIndexOf(256 + 99));

// Passing a byteOffset that coerces to NaN.
// Prints: 1, searching the whole buffer.
console.log(b.lastIndexOf('b', undefined));
console.log(b.lastIndexOf('b', {}));

// Passing a byteOffset that coerces to 0.
// Prints: -1, equivalent to passing 0.
console.log(b.lastIndexOf('b', null));
console.log(b.lastIndexOf('b', []));
```
:::

Si `value` es una cadena vacía o un `Buffer` vacío, se devolverá `byteOffset`.


### `buf.length` {#buflength}

**Añadido en: v0.1.90**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Devuelve el número de bytes en `buf`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Crea un `Buffer` y escribe una cadena más corta usando UTF-8.

const buf = Buffer.alloc(1234);

console.log(buf.length);
// Imprime: 1234

buf.write('some string', 0, 'utf8');

console.log(buf.length);
// Imprime: 1234
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Crea un `Buffer` y escribe una cadena más corta usando UTF-8.

const buf = Buffer.alloc(1234);

console.log(buf.length);
// Imprime: 1234

buf.write('some string', 0, 'utf8');

console.log(buf.length);
// Imprime: 1234
```
:::

### `buf.parent` {#bufparent}

**Obsoleto desde: v8.0.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Utilice [`buf.buffer`](/es/nodejs/api/buffer#bufbuffer) en su lugar.
:::

La propiedad `buf.parent` es un alias obsoleto para `buf.buffer`.

### `buf.readBigInt64BE([offset])` {#bufreadbigint64beoffset}

**Añadido en: v12.0.0, v10.20.0**

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes para omitir antes de empezar a leer. Debe satisfacer: `0 \<= offset \<= buf.length - 8`. **Predeterminado:** `0`.
- Devuelve: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Lee un entero de 64 bits con signo y orden de bytes big-endian de `buf` en el `offset` especificado.

Los enteros leídos de un `Buffer` se interpretan como valores con signo en complemento a dos.

### `buf.readBigInt64LE([offset])` {#bufreadbigint64leoffset}

**Añadido en: v12.0.0, v10.20.0**

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes para omitir antes de empezar a leer. Debe satisfacer: `0 \<= offset \<= buf.length - 8`. **Predeterminado:** `0`.
- Devuelve: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Lee un entero de 64 bits con signo y orden de bytes little-endian de `buf` en el `offset` especificado.

Los enteros leídos de un `Buffer` se interpretan como valores con signo en complemento a dos.


### `buf.readBigUInt64BE([offset])` {#bufreadbiguint64beoffset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.10.0, v12.19.0 | Esta función también está disponible como `buf.readBigUint64BE()`. |
| v12.0.0, v10.20.0 | Añadido en: v12.0.0, v10.20.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a omitir antes de empezar a leer. Debe satisfacer: `0 \<= offset \<= buf.length - 8`. **Predeterminado:** `0`.
- Devuelve: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Lee un entero de 64 bits sin signo, en formato big-endian desde `buf` en el `offset` especificado.

Esta función también está disponible bajo el alias `readBigUint64BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64BE(0));
// Imprime: 4294967295n
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64BE(0));
// Imprime: 4294967295n
```
:::

### `buf.readBigUInt64LE([offset])` {#bufreadbiguint64leoffset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.10.0, v12.19.0 | Esta función también está disponible como `buf.readBigUint64LE()`. |
| v12.0.0, v10.20.0 | Añadido en: v12.0.0, v10.20.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a omitir antes de empezar a leer. Debe satisfacer: `0 \<= offset \<= buf.length - 8`. **Predeterminado:** `0`.
- Devuelve: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Lee un entero de 64 bits sin signo, en formato little-endian desde `buf` en el `offset` especificado.

Esta función también está disponible bajo el alias `readBigUint64LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64LE(0));
// Imprime: 18446744069414584320n
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64LE(0));
// Imprime: 18446744069414584320n
```
:::


### `buf.readDoubleBE([offset])` {#bufreaddoublebeoffset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset a `uint32`. |
| v0.11.15 | Añadido en: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a omitir antes de comenzar a leer. Debe satisfacer `0 \<= offset \<= buf.length - 8`. **Predeterminado:** `0`.
- Regresa: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lee un doble de 64 bits, big-endian desde `buf` en el `offset` especificado.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleBE(0));
// Imprime: 8.20788039913184e-304
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleBE(0));
// Imprime: 8.20788039913184e-304
```
:::

### `buf.readDoubleLE([offset])` {#bufreaddoubleleoffset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset a `uint32`. |
| v0.11.15 | Añadido en: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a omitir antes de comenzar a leer. Debe satisfacer `0 \<= offset \<= buf.length - 8`. **Predeterminado:** `0`.
- Regresa: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lee un doble de 64 bits, little-endian desde `buf` en el `offset` especificado.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleLE(0));
// Imprime: 5.447603722011605e-270
console.log(buf.readDoubleLE(1));
// Lanza ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleLE(0));
// Imprime: 5.447603722011605e-270
console.log(buf.readDoubleLE(1));
// Lanza ERR_OUT_OF_RANGE.
```
:::


### `buf.readFloatBE([offset])` {#bufreadfloatbeoffset}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset a `uint32`. |
| v0.11.15 | Agregado en: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes para omitir antes de comenzar a leer. Debe satisfacer `0 \<= offset \<= buf.length - 4`. **Predeterminado:** `0`.
- Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lee un float de 32 bits, big-endian desde `buf` en el `offset` especificado.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatBE(0));
// Imprime: 2.387939260590663e-38
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatBE(0));
// Imprime: 2.387939260590663e-38
```
:::

### `buf.readFloatLE([offset])` {#bufreadfloatleoffset}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset a `uint32`. |
| v0.11.15 | Agregado en: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes para omitir antes de comenzar a leer. Debe satisfacer `0 \<= offset \<= buf.length - 4`. **Predeterminado:** `0`.
- Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lee un float de 32 bits, little-endian desde `buf` en el `offset` especificado.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatLE(0));
// Imprime: 1.539989614439558e-36
console.log(buf.readFloatLE(1));
// Lanza ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatLE(0));
// Imprime: 1.539989614439558e-36
console.log(buf.readFloatLE(1));
// Lanza ERR_OUT_OF_RANGE.
```
:::


### `buf.readInt8([offset])` {#bufreadint8offset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset a `uint32`. |
| v0.5.0 | Añadido en: v0.5.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes que se omitirán antes de comenzar a leer. Debe satisfacer `0 \<= offset \<= buf.length - 1`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lee un entero de 8 bits con signo de `buf` en el `offset` especificado.

Los enteros leídos de un `Buffer` se interpretan como valores con signo en complemento a dos.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([-1, 5]);

console.log(buf.readInt8(0));
// Imprime: -1
console.log(buf.readInt8(1));
// Imprime: 5
console.log(buf.readInt8(2));
// Lanza ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([-1, 5]);

console.log(buf.readInt8(0));
// Imprime: -1
console.log(buf.readInt8(1));
// Imprime: 5
console.log(buf.readInt8(2));
// Lanza ERR_OUT_OF_RANGE.
```
:::

### `buf.readInt16BE([offset])` {#bufreadint16beoffset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset a `uint32`. |
| v0.5.5 | Añadido en: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes que se omitirán antes de comenzar a leer. Debe satisfacer `0 \<= offset \<= buf.length - 2`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lee un entero de 16 bits con signo y en formato big-endian de `buf` en el `offset` especificado.

Los enteros leídos de un `Buffer` se interpretan como valores con signo en complemento a dos.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16BE(0));
// Imprime: 5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16BE(0));
// Imprime: 5
```
:::


### `buf.readInt16LE([offset])` {#bufreadint16leoffset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset a `uint32`. |
| v0.5.5 | Añadido en: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes que se omitirán antes de comenzar a leer. Debe satisfacer `0 \<= offset \<= buf.length - 2`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lee un entero de 16 bits con signo y little-endian desde `buf` en el `offset` especificado.

Los enteros leídos de un `Buffer` se interpretan como valores con signo de complemento a dos.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16LE(0));
// Imprime: 1280
console.log(buf.readInt16LE(1));
// Lanza ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16LE(0));
// Imprime: 1280
console.log(buf.readInt16LE(1));
// Lanza ERR_OUT_OF_RANGE.
```
:::

### `buf.readInt32BE([offset])` {#bufreadint32beoffset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset a `uint32`. |
| v0.5.5 | Añadido en: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes que se omitirán antes de comenzar a leer. Debe satisfacer `0 \<= offset \<= buf.length - 4`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lee un entero de 32 bits con signo y big-endian desde `buf` en el `offset` especificado.

Los enteros leídos de un `Buffer` se interpretan como valores con signo de complemento a dos.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32BE(0));
// Imprime: 5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32BE(0));
// Imprime: 5
```
:::


### `buf.readInt32LE([offset])` {#bufreadint32leoffset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset a `uint32`. |
| v0.5.5 | Añadido en: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes que se omitirán antes de comenzar a leer. Debe satisfacer `0 \<= offset \<= buf.length - 4`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lee un entero de 32 bits con signo y little-endian de `buf` en el `offset` especificado.

Los enteros leídos de un `Buffer` se interpretan como valores con signo en complemento a dos.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32LE(0));
// Imprime: 83886080
console.log(buf.readInt32LE(1));
// Lanza ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32LE(0));
// Imprime: 83886080
console.log(buf.readInt32LE(1));
// Lanza ERR_OUT_OF_RANGE.
```
:::

### `buf.readIntBE(offset, byteLength)` {#bufreadintbeoffset-bytelength}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset y `byteLength` a `uint32`. |
| v0.11.15 | Añadido en: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes que se omitirán antes de comenzar a leer. Debe satisfacer `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a leer. Debe satisfacer `0 \< byteLength \<= 6`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lee un número de bytes `byteLength` de `buf` en el `offset` especificado e interpreta el resultado como un valor con signo big-endian en complemento a dos que admite hasta 48 bits de precisión.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntBE(0, 6).toString(16));
// Imprime: 1234567890ab
console.log(buf.readIntBE(1, 6).toString(16));
// Lanza ERR_OUT_OF_RANGE.
console.log(buf.readIntBE(1, 0).toString(16));
// Lanza ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntBE(0, 6).toString(16));
// Imprime: 1234567890ab
console.log(buf.readIntBE(1, 6).toString(16));
// Lanza ERR_OUT_OF_RANGE.
console.log(buf.readIntBE(1, 0).toString(16));
// Lanza ERR_OUT_OF_RANGE.
```
:::


### `buf.readIntLE(offset, byteLength)` {#bufreadintleoffset-bytelength}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset y `byteLength` a `uint32`. |
| v0.11.15 | Añadido en: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a omitir antes de empezar a leer. Debe satisfacer `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a leer. Debe satisfacer `0 \< byteLength \<= 6`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lee `byteLength` número de bytes desde `buf` en el `offset` especificado e interpreta el resultado como un valor con signo en complemento a dos little-endian que admite hasta 48 bits de precisión.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntLE(0, 6).toString(16));
// Prints: -546f87a9cbee
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntLE(0, 6).toString(16));
// Prints: -546f87a9cbee
```
:::

### `buf.readUInt8([offset])` {#bufreaduint8offset}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v14.9.0, v12.19.0 | Esta función también está disponible como `buf.readUint8()`. |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset a `uint32`. |
| v0.5.0 | Añadido en: v0.5.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a omitir antes de empezar a leer. Debe satisfacer `0 \<= offset \<= buf.length - 1`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lee un entero sin signo de 8 bits desde `buf` en el `offset` especificado.

Esta función también está disponible bajo el alias `readUint8`.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, -2]);

console.log(buf.readUInt8(0));
// Prints: 1
console.log(buf.readUInt8(1));
// Prints: 254
console.log(buf.readUInt8(2));
// Lanza ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, -2]);

console.log(buf.readUInt8(0));
// Prints: 1
console.log(buf.readUInt8(1));
// Prints: 254
console.log(buf.readUInt8(2));
// Lanza ERR_OUT_OF_RANGE.
```
:::


### `buf.readUInt16BE([offset])` {#bufreaduint16beoffset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.9.0, v12.19.0 | Esta función también está disponible como `buf.readUint16BE()`. |
| v10.0.0 | Se eliminaron `noAssert` y la coerción implícita del offset a `uint32`. |
| v0.5.5 | Agregado en: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a omitir antes de comenzar a leer. Debe satisfacer `0 \<= offset \<= buf.length - 2`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lee un entero sin signo de 16 bits en formato big-endian de `buf` en el `offset` especificado.

Esta función también está disponible bajo el alias `readUint16BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16BE(0).toString(16));
// Imprime: 1234
console.log(buf.readUInt16BE(1).toString(16));
// Imprime: 3456
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16BE(0).toString(16));
// Imprime: 1234
console.log(buf.readUInt16BE(1).toString(16));
// Imprime: 3456
```
:::

### `buf.readUInt16LE([offset])` {#bufreaduint16leoffset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.9.0, v12.19.0 | Esta función también está disponible como `buf.readUint16LE()`. |
| v10.0.0 | Se eliminaron `noAssert` y la coerción implícita del offset a `uint32`. |
| v0.5.5 | Agregado en: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a omitir antes de comenzar a leer. Debe satisfacer `0 \<= offset \<= buf.length - 2`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lee un entero sin signo de 16 bits en formato little-endian de `buf` en el `offset` especificado.

Esta función también está disponible bajo el alias `readUint16LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16LE(0).toString(16));
// Imprime: 3412
console.log(buf.readUInt16LE(1).toString(16));
// Imprime: 5634
console.log(buf.readUInt16LE(2).toString(16));
// Lanza ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16LE(0).toString(16));
// Imprime: 3412
console.log(buf.readUInt16LE(1).toString(16));
// Imprime: 5634
console.log(buf.readUInt16LE(2).toString(16));
// Lanza ERR_OUT_OF_RANGE.
```
:::


### `buf.readUInt32BE([offset])` {#bufreaduint32beoffset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.9.0, v12.19.0 | Esta función también está disponible como `buf.readUint32BE()`. |
| v10.0.0 | Se eliminó `noAssert` y ya no se realiza la coerción implícita del offset a `uint32`. |
| v0.5.5 | Añadido en: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes que se omitirán antes de comenzar a leer. Debe satisfacer `0 \<= offset \<= buf.length - 4`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lee un entero de 32 bits sin signo, en formato big-endian desde `buf` en el `offset` especificado.

Esta función también está disponible bajo el alias `readUint32BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32BE(0).toString(16));
// Imprime: 12345678
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32BE(0).toString(16));
// Imprime: 12345678
```
:::

### `buf.readUInt32LE([offset])` {#bufreaduint32leoffset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.9.0, v12.19.0 | Esta función también está disponible como `buf.readUint32LE()`. |
| v10.0.0 | Se eliminó `noAssert` y ya no se realiza la coerción implícita del offset a `uint32`. |
| v0.5.5 | Añadido en: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes que se omitirán antes de comenzar a leer. Debe satisfacer `0 \<= offset \<= buf.length - 4`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lee un entero de 32 bits sin signo, en formato little-endian desde `buf` en el `offset` especificado.

Esta función también está disponible bajo el alias `readUint32LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32LE(0).toString(16));
// Imprime: 78563412
console.log(buf.readUInt32LE(1).toString(16));
// Lanza ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32LE(0).toString(16));
// Imprime: 78563412
console.log(buf.readUInt32LE(1).toString(16));
// Lanza ERR_OUT_OF_RANGE.
```
:::


### `buf.readUIntBE(offset, byteLength)` {#bufreaduintbeoffset-bytelength}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.9.0, v12.19.0 | Esta función también está disponible como `buf.readUintBE()`. |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset y `byteLength` a `uint32`. |
| v0.11.15 | Añadido en: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a omitir antes de comenzar a leer. Debe satisfacer `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a leer. Debe satisfacer `0 \< byteLength \<= 6`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lee un número de `byteLength` bytes de `buf` en el `offset` especificado e interpreta el resultado como un entero sin signo big-endian que admite hasta 48 bits de precisión.

Esta función también está disponible bajo el alias `readUintBE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntBE(0, 6).toString(16));
// Imprime: 1234567890ab
console.log(buf.readUIntBE(1, 6).toString(16));
// Lanza ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntBE(0, 6).toString(16));
// Imprime: 1234567890ab
console.log(buf.readUIntBE(1, 6).toString(16));
// Lanza ERR_OUT_OF_RANGE.
```
:::

### `buf.readUIntLE(offset, byteLength)` {#bufreaduintleoffset-bytelength}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.9.0, v12.19.0 | Esta función también está disponible como `buf.readUintLE()`. |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset y `byteLength` a `uint32`. |
| v0.11.15 | Añadido en: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a omitir antes de comenzar a leer. Debe satisfacer `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a leer. Debe satisfacer `0 \< byteLength \<= 6`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lee un número de `byteLength` bytes de `buf` en el `offset` especificado e interpreta el resultado como un entero sin signo, little-endian que admite hasta 48 bits de precisión.

Esta función también está disponible bajo el alias `readUintLE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntLE(0, 6).toString(16));
// Imprime: ab9078563412
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntLE(0, 6).toString(16));
// Imprime: ab9078563412
```
:::


### `buf.subarray([inicio[, fin]])` {#bufsubarraystart-end}

**Añadido en: v3.0.0**

- `inicio` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dónde comenzará el nuevo `Buffer`. **Predeterminado:** `0`.
- `fin` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dónde finalizará el nuevo `Buffer` (no inclusivo). **Predeterminado:** [`buf.length`](/es/nodejs/api/buffer#buflength).
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Devuelve un nuevo `Buffer` que hace referencia a la misma memoria que el original, pero desplazado y recortado por los índices `inicio` y `fin`.

Especificar `fin` mayor que [`buf.length`](/es/nodejs/api/buffer#buflength) devolverá el mismo resultado que `fin` igual a [`buf.length`](/es/nodejs/api/buffer#buflength).

Este método se hereda de [`TypedArray.prototype.subarray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray).

Modificar la nueva porción de `Buffer` modificará la memoria en el `Buffer` original porque la memoria asignada de los dos objetos se superpone.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Crea un `Buffer` con el alfabeto ASCII, toma una porción y modifica un byte
// del `Buffer` original.

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 es el valor ASCII decimal para 'a'.
  buf1[i] = i + 97;
}

const buf2 = buf1.subarray(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// Imprime: abc

buf1[0] = 33;

console.log(buf2.toString('ascii', 0, buf2.length));
// Imprime: !bc
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Crea un `Buffer` con el alfabeto ASCII, toma una porción y modifica un byte
// del `Buffer` original.

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 es el valor ASCII decimal para 'a'.
  buf1[i] = i + 97;
}

const buf2 = buf1.subarray(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// Imprime: abc

buf1[0] = 33;

console.log(buf2.toString('ascii', 0, buf2.length));
// Imprime: !bc
```
:::

Especificar índices negativos hace que la porción se genere en relación con el final de `buf` en lugar del principio.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// Imprime: buffe
// (Equivalente a buf.subarray(0, 5).)

console.log(buf.subarray(-6, -2).toString());
// Imprime: buff
// (Equivalente a buf.subarray(0, 4).)

console.log(buf.subarray(-5, -2).toString());
// Imprime: uff
// (Equivalente a buf.subarray(1, 4).)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// Imprime: buffe
// (Equivalente a buf.subarray(0, 5).)

console.log(buf.subarray(-6, -2).toString());
// Imprime: buff
// (Equivalente a buf.subarray(0, 4).)

console.log(buf.subarray(-5, -2).toString());
// Imprime: uff
// (Equivalente a buf.subarray(1, 4).)
```
:::


### `buf.slice([start[, end]])` {#bufslicestart-end}

::: info [Historial]
| Versión | Cambios |
|---|---|
| v17.5.0, v16.15.0 | El método buf.slice() ha sido desaprobado. |
| v7.0.0 | Todos los offsets ahora son coaccionados a enteros antes de realizar cualquier cálculo con ellos. |
| v7.1.0, v6.9.2 | La coacción de los offsets a enteros ahora maneja correctamente los valores fuera del rango de enteros de 32 bits. |
| v0.3.0 | Agregado en: v0.3.0 |
:::

- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Donde el nuevo `Buffer` comenzará. **Predeterminado:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Donde el nuevo `Buffer` terminará (no inclusivo). **Predeterminado:** [`buf.length`](/es/nodejs/api/buffer#buflength).
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Use [`buf.subarray`](/es/nodejs/api/buffer#bufsubarraystart-end) en su lugar.
:::

Devuelve un nuevo `Buffer` que hace referencia a la misma memoria que el original, pero desplazado y recortado por los índices `start` y `end`.

Este método no es compatible con `Uint8Array.prototype.slice()`, que es una superclase de `Buffer`. Para copiar la porción, use `Uint8Array.prototype.slice()`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// Imprime: cuffer

console.log(buf.toString());
// Imprime: buffer

// Con buf.slice(), el buffer original se modifica.
const notReallyCopiedBuf = buf.slice();
notReallyCopiedBuf[0]++;
console.log(notReallyCopiedBuf.toString());
// Imprime: cuffer
console.log(buf.toString());
// También imprime: cuffer (!)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// Imprime: cuffer

console.log(buf.toString());
// Imprime: buffer

// Con buf.slice(), el buffer original se modifica.
const notReallyCopiedBuf = buf.slice();
notReallyCopiedBuf[0]++;
console.log(notReallyCopiedBuf.toString());
// Imprime: cuffer
console.log(buf.toString());
// También imprime: cuffer (!)
```
:::


### `buf.swap16()` {#bufswap16}

**Agregado en: v5.10.0**

- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) Una referencia a `buf`.

Interpreta `buf` como un array de enteros sin signo de 16 bits e intercambia el orden de los bytes *en el lugar*. Lanza [`ERR_INVALID_BUFFER_SIZE`](/es/nodejs/api/errors#err_invalid_buffer_size) si [`buf.length`](/es/nodejs/api/buffer#buflength) no es un múltiplo de 2.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap16();

console.log(buf1);
// Prints: <Buffer 02 01 04 03 06 05 08 07>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap16();
// Lanza ERR_INVALID_BUFFER_SIZE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap16();

console.log(buf1);
// Prints: <Buffer 02 01 04 03 06 05 08 07>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap16();
// Lanza ERR_INVALID_BUFFER_SIZE.
```
:::

Un uso conveniente de `buf.swap16()` es realizar una conversión rápida en el lugar entre UTF-16 little-endian y UTF-16 big-endian:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('This is little-endian UTF-16', 'utf16le');
buf.swap16(); // Convert to big-endian UTF-16 text.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('This is little-endian UTF-16', 'utf16le');
buf.swap16(); // Convert to big-endian UTF-16 text.
```
:::

### `buf.swap32()` {#bufswap32}

**Agregado en: v5.10.0**

- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) Una referencia a `buf`.

Interpreta `buf` como un array de enteros sin signo de 32 bits e intercambia el orden de los bytes *en el lugar*. Lanza [`ERR_INVALID_BUFFER_SIZE`](/es/nodejs/api/errors#err_invalid_buffer_size) si [`buf.length`](/es/nodejs/api/buffer#buflength) no es un múltiplo de 4.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap32();

console.log(buf1);
// Prints: <Buffer 04 03 02 01 08 07 06 05>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap32();
// Lanza ERR_INVALID_BUFFER_SIZE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap32();

console.log(buf1);
// Prints: <Buffer 04 03 02 01 08 07 06 05>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap32();
// Lanza ERR_INVALID_BUFFER_SIZE.
```
:::

### `buf.swap64()` {#bufswap64}

**Agregado en: v6.3.0**

- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) Una referencia a `buf`.

Interpreta `buf` como un arreglo de números de 64 bits e intercambia el orden de bytes *in-place*. Lanza [`ERR_INVALID_BUFFER_SIZE`](/es/nodejs/api/errors#err_invalid_buffer_size) si [`buf.length`](/es/nodejs/api/buffer#buflength) no es un múltiplo de 8.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap64();

console.log(buf1);
// Prints: <Buffer 08 07 06 05 04 03 02 01>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap64();
// Throws ERR_INVALID_BUFFER_SIZE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap64();

console.log(buf1);
// Prints: <Buffer 08 07 06 05 04 03 02 01>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap64();
// Throws ERR_INVALID_BUFFER_SIZE.
```
:::

### `buf.toJSON()` {#buftojson}

**Agregado en: v0.9.2**

- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Devuelve una representación JSON de `buf`. [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) llama implícitamente a esta función al convertir en cadena una instancia de `Buffer`.

`Buffer.from()` acepta objetos en el formato devuelto por este método. En particular, `Buffer.from(buf.toJSON())` funciona como `Buffer.from(buf)`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
const json = JSON.stringify(buf);

console.log(json);
// Prints: {"type":"Buffer","data":[1,2,3,4,5]}

const copy = JSON.parse(json, (key, value) => {
  return value && value.type === 'Buffer' ?
    Buffer.from(value) :
    value;
});

console.log(copy);
// Prints: <Buffer 01 02 03 04 05>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
const json = JSON.stringify(buf);

console.log(json);
// Prints: {"type":"Buffer","data":[1,2,3,4,5]}

const copy = JSON.parse(json, (key, value) => {
  return value && value.type === 'Buffer' ?
    Buffer.from(value) :
    value;
});

console.log(copy);
// Prints: <Buffer 01 02 03 04 05>
```
:::


### `buf.toString([encoding[, start[, end]]])` {#buftostringencoding-start-end}

**Agregado en: v0.1.90**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codificación de caracteres a utilizar. **Predeterminado:** `'utf8'`.
- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El desplazamiento de byte para comenzar a decodificar. **Predeterminado:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El desplazamiento de byte para detener la decodificación (no inclusivo). **Predeterminado:** [`buf.length`](/es/nodejs/api/buffer#buflength).
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Decodifica `buf` a una cadena según la codificación de caracteres especificada en `encoding`. Se pueden pasar `start` y `end` para decodificar solo un subconjunto de `buf`.

Si `encoding` es `'utf8'` y una secuencia de bytes en la entrada no es UTF-8 válida, entonces cada byte no válido se reemplaza con el carácter de reemplazo `U+FFFD`.

La longitud máxima de una instancia de cadena (en unidades de código UTF-16) está disponible como [`buffer.constants.MAX_STRING_LENGTH`](/es/nodejs/api/buffer#bufferconstantsmax_string_length).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf1[i] = i + 97;
}

console.log(buf1.toString('utf8'));
// Prints: abcdefghijklmnopqrstuvwxyz
console.log(buf1.toString('utf8', 0, 5));
// Prints: abcde

const buf2 = Buffer.from('tést');

console.log(buf2.toString('hex'));
// Prints: 74c3a97374
console.log(buf2.toString('utf8', 0, 3));
// Prints: té
console.log(buf2.toString(undefined, 0, 3));
// Prints: té
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf1[i] = i + 97;
}

console.log(buf1.toString('utf8'));
// Prints: abcdefghijklmnopqrstuvwxyz
console.log(buf1.toString('utf8', 0, 5));
// Prints: abcde

const buf2 = Buffer.from('tést');

console.log(buf2.toString('hex'));
// Prints: 74c3a97374
console.log(buf2.toString('utf8', 0, 3));
// Prints: té
console.log(buf2.toString(undefined, 0, 3));
// Prints: té
```
:::


### `buf.values()` {#bufvalues}

**Agregado en: v1.1.0**

- Devuelve: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Crea y devuelve un [iterador](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) para los valores de `buf` (bytes). Esta función se llama automáticamente cuando se utiliza un `Buffer` en una declaración `for..of`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

for (const value of buf.values()) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114

for (const value of buf) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

for (const value of buf.values()) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114

for (const value of buf) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114
```
:::

### `buf.write(string[, offset[, length]][, encoding])` {#bufwritestring-offset-length-encoding}

**Agregado en: v0.1.90**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) String a escribir en `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a omitir antes de empezar a escribir `string`. **Predeterminado:** `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número máximo de bytes a escribir (los bytes escritos no superarán `buf.length - offset`). **Predeterminado:** `buf.length - offset`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codificación de caracteres de `string`. **Predeterminado:** `'utf8'`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes escritos.

Escribe `string` en `buf` en `offset` según la codificación de caracteres en `encoding`. El parámetro `length` es el número de bytes a escribir. Si `buf` no contenía suficiente espacio para encajar toda la string, solo se escribirá parte de `string`. Sin embargo, no se escribirán caracteres codificados parcialmente.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(256);

const len = buf.write('\u00bd + \u00bc = \u00be', 0);

console.log(`${len} bytes: ${buf.toString('utf8', 0, len)}`);
// Prints: 12 bytes: ½ + ¼ = ¾

const buffer = Buffer.alloc(10);

const length = buffer.write('abcd', 8);

console.log(`${length} bytes: ${buffer.toString('utf8', 8, 10)}`);
// Prints: 2 bytes : ab
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(256);

const len = buf.write('\u00bd + \u00bc = \u00be', 0);

console.log(`${len} bytes: ${buf.toString('utf8', 0, len)}`);
// Prints: 12 bytes: ½ + ¼ = ¾

const buffer = Buffer.alloc(10);

const length = buffer.write('abcd', 8);

console.log(`${length} bytes: ${buffer.toString('utf8', 8, 10)}`);
// Prints: 2 bytes : ab
```
:::


### `buf.writeBigInt64BE(value[, offset])` {#bufwritebigint64bevalue-offset}

**Agregado en: v12.0.0, v10.20.0**

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Número que se escribirá en `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes para omitir antes de comenzar a escribir. Debe satisfacer: `0 \<= offset \<= buf.length - 8`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` más el número de bytes escritos.

Escribe `value` en `buf` en el `offset` especificado como big-endian.

`value` se interpreta y se escribe como un entero con signo de complemento a dos.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64BE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04 05 06 07 08>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64BE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04 05 06 07 08>
```
:::

### `buf.writeBigInt64LE(value[, offset])` {#bufwritebigint64levalue-offset}

**Agregado en: v12.0.0, v10.20.0**

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Número que se escribirá en `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes para omitir antes de comenzar a escribir. Debe satisfacer: `0 \<= offset \<= buf.length - 8`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` más el número de bytes escritos.

Escribe `value` en `buf` en el `offset` especificado como little-endian.

`value` se interpreta y se escribe como un entero con signo de complemento a dos.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64LE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05 04 03 02 01>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64LE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05 04 03 02 01>
```
:::


### `buf.writeBigUInt64BE(value[, offset])` {#bufwritebiguint64bevalue-offset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.10.0, v12.19.0 | Esta función también está disponible como `buf.writeBigUint64BE()`. |
| v12.0.0, v10.20.0 | Añadido en: v12.0.0, v10.20.0 |
:::

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Número que se escribirá en `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes que se omitirán antes de comenzar a escribir. Debe satisfacer: `0 \<= offset \<= buf.length - 8`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` más el número de bytes escritos.

Escribe `value` en `buf` en el `offset` especificado como big-endian.

Esta función también está disponible bajo el alias `writeBigUint64BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64BE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de ca fa fe ca ce fa de>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64BE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de ca fa fe ca ce fa de>
```
:::

### `buf.writeBigUInt64LE(value[, offset])` {#bufwritebiguint64levalue-offset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.10.0, v12.19.0 | Esta función también está disponible como `buf.writeBigUint64LE()`. |
| v12.0.0, v10.20.0 | Añadido en: v12.0.0, v10.20.0 |
:::

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Número que se escribirá en `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes que se omitirán antes de comenzar a escribir. Debe satisfacer: `0 \<= offset \<= buf.length - 8`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` más el número de bytes escritos.

Escribe `value` en `buf` en el `offset` especificado como little-endian.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64LE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de fa ce ca fe fa ca de>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64LE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de fa ce ca fe fa ca de>
```
:::

Esta función también está disponible bajo el alias `writeBigUint64LE`.


### `buf.writeDoubleBE(value[, offset])` {#bufwritedoublebevalue-offset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset a `uint32`. |
| v0.11.15 | Añadido en: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito en `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a saltar antes de comenzar a escribir. Debe satisfacer `0 \<= offset \<= buf.length - 8`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` más el número de bytes escritos.

Escribe `value` en `buf` en el `offset` especificado como big-endian. El `value` debe ser un número de JavaScript. El comportamiento es indefinido cuando `value` es algo que no sea un número de JavaScript.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleBE(123.456, 0);

console.log(buf);
// Prints: <Buffer 40 5e dd 2f 1a 9f be 77>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleBE(123.456, 0);

console.log(buf);
// Prints: <Buffer 40 5e dd 2f 1a 9f be 77>
```
:::

### `buf.writeDoubleLE(value[, offset])` {#bufwritedoublelevalue-offset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset a `uint32`. |
| v0.11.15 | Añadido en: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito en `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a saltar antes de comenzar a escribir. Debe satisfacer `0 \<= offset \<= buf.length - 8`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` más el número de bytes escritos.

Escribe `value` en `buf` en el `offset` especificado como little-endian. El `value` debe ser un número de JavaScript. El comportamiento es indefinido cuando `value` es algo que no sea un número de JavaScript.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleLE(123.456, 0);

console.log(buf);
// Prints: <Buffer 77 be 9f 1a 2f dd 5e 40>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleLE(123.456, 0);

console.log(buf);
// Prints: <Buffer 77 be 9f 1a 2f dd 5e 40>
```
:::


### `buf.writeFloatBE(value[, offset])` {#bufwritefloatbevalue-offset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset a `uint32`. |
| v0.11.15 | Añadido en: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número que se escribirá en `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes que se omitirán antes de comenzar a escribir. Debe satisfacer `0 \<= offset \<= buf.length - 4`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` más el número de bytes escritos.

Escribe `value` en `buf` en el `offset` especificado como big-endian. El comportamiento no está definido cuando `value` es algo distinto de un número de JavaScript.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeFloatBE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer 4f 4a fe bb>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeFloatBE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer 4f 4a fe bb>
```
:::

### `buf.writeFloatLE(value[, offset])` {#bufwritefloatlevalue-offset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset a `uint32`. |
| v0.11.15 | Añadido en: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número que se escribirá en `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes que se omitirán antes de comenzar a escribir. Debe satisfacer `0 \<= offset \<= buf.length - 4`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` más el número de bytes escritos.

Escribe `value` en `buf` en el `offset` especificado como little-endian. El comportamiento no está definido cuando `value` es algo distinto de un número de JavaScript.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeFloatLE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer bb fe 4a 4f>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeFloatLE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer bb fe 4a 4f>
```
:::


### `buf.writeInt8(value[, offset])` {#bufwriteint8value-offset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del desplazamiento a `uint32`. |
| v0.5.0 | Añadido en: v0.5.0 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número que se va a escribir en `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes que se van a omitir antes de comenzar a escribir. Debe satisfacer `0 \<= offset \<= buf.length - 1`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` más el número de bytes escritos.

Escribe `value` en `buf` en el `offset` especificado. `value` debe ser un entero de 8 bits con signo válido. El comportamiento no está definido cuando `value` es algo que no sea un entero de 8 bits con signo.

`value` se interpreta y se escribe como un entero con signo en complemento a dos.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt8(2, 0);
buf.writeInt8(-2, 1);

console.log(buf);
// Prints: <Buffer 02 fe>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt8(2, 0);
buf.writeInt8(-2, 1);

console.log(buf);
// Prints: <Buffer 02 fe>
```
:::

### `buf.writeInt16BE(value[, offset])` {#bufwriteint16bevalue-offset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del desplazamiento a `uint32`. |
| v0.5.5 | Añadido en: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número que se va a escribir en `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes que se van a omitir antes de comenzar a escribir. Debe satisfacer `0 \<= offset \<= buf.length - 2`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` más el número de bytes escritos.

Escribe `value` en `buf` en el `offset` especificado como big-endian. `value` debe ser un entero de 16 bits con signo válido. El comportamiento no está definido cuando `value` es algo que no sea un entero de 16 bits con signo.

`value` se interpreta y se escribe como un entero con signo en complemento a dos.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt16BE(0x0102, 0);

console.log(buf);
// Prints: <Buffer 01 02>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt16BE(0x0102, 0);

console.log(buf);
// Prints: <Buffer 01 02>
```
:::


### `buf.writeInt16LE(value[, offset])` {#bufwriteint16levalue-offset}

::: info [Historial]
| Versión | Cambios |
|---|---|
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset a `uint32`. |
| v0.5.5 | Añadido en: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito en `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a omitir antes de comenzar a escribir. Debe satisfacer `0 \<= offset \<= buf.length - 2`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` más el número de bytes escritos.

Escribe `value` en `buf` en el `offset` especificado como little-endian. El `value` debe ser un entero de 16 bits con signo válido. El comportamiento no está definido cuando `value` es algo distinto a un entero de 16 bits con signo.

El `value` se interpreta y se escribe como un entero con signo de complemento a dos.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt16LE(0x0304, 0);

console.log(buf);
// Prints: <Buffer 04 03>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt16LE(0x0304, 0);

console.log(buf);
// Prints: <Buffer 04 03>
```
:::

### `buf.writeInt32BE(value[, offset])` {#bufwriteint32bevalue-offset}

::: info [Historial]
| Versión | Cambios |
|---|---|
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset a `uint32`. |
| v0.5.5 | Añadido en: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito en `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a omitir antes de comenzar a escribir. Debe satisfacer `0 \<= offset \<= buf.length - 4`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` más el número de bytes escritos.

Escribe `value` en `buf` en el `offset` especificado como big-endian. El `value` debe ser un entero de 32 bits con signo válido. El comportamiento no está definido cuando `value` es algo distinto a un entero de 32 bits con signo.

El `value` se interpreta y se escribe como un entero con signo de complemento a dos.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeInt32BE(0x01020304, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeInt32BE(0x01020304, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04>
```
:::


### `buf.writeInt32LE(value[, offset])` {#bufwriteint32levalue-offset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Se eliminaron `noAssert` y la conversión implícita del offset a `uint32`. |
| v0.5.5 | Añadido en: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número que se escribirá en `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a omitir antes de comenzar a escribir. Debe satisfacer `0 \<= offset \<= buf.length - 4`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` más el número de bytes escritos.

Escribe `value` en `buf` en el `offset` especificado como little-endian. El `value` debe ser un entero de 32 bits con signo válido. El comportamiento no está definido cuando `value` es algo que no sea un entero de 32 bits con signo.

El `value` se interpreta y se escribe como un entero con signo de complemento a dos.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeInt32LE(0x05060708, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeInt32LE(0x05060708, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05>
```
:::

### `buf.writeIntBE(value, offset, byteLength)` {#bufwriteintbevalue-offset-bytelength}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Se eliminaron `noAssert` y la conversión implícita del offset y `byteLength` a `uint32`. |
| v0.11.15 | Añadido en: v0.11.15 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número que se escribirá en `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a omitir antes de comenzar a escribir. Debe satisfacer `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a escribir. Debe satisfacer `0 \< byteLength \<= 6`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` más el número de bytes escritos.

Escribe `byteLength` bytes de `value` en `buf` en el `offset` especificado como big-endian. Soporta hasta 48 bits de precisión. El comportamiento no está definido cuando `value` es algo que no sea un entero con signo.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```
:::


### `buf.writeIntLE(value, offset, byteLength)` {#bufwriteintlevalue-offset-bytelength}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Se eliminó `noAssert` y ya no se realiza coerción implícita del offset y `byteLength` a `uint32`. |
| v0.11.15 | Añadido en: v0.11.15 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito en `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a saltar antes de comenzar a escribir. Debe satisfacer `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a escribir. Debe satisfacer `0 \< byteLength \<= 6`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` más el número de bytes escritos.

Escribe `byteLength` bytes de `value` en `buf` en el `offset` especificado como little-endian. Soporta hasta 48 bits de precisión. El comportamiento no está definido cuando `value` es algo diferente a un entero con signo.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```
:::

### `buf.writeUInt8(value[, offset])` {#bufwriteuint8value-offset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.9.0, v12.19.0 | Esta función también está disponible como `buf.writeUint8()`. |
| v10.0.0 | Se eliminó `noAssert` y ya no se realiza coerción implícita del offset a `uint32`. |
| v0.5.0 | Añadido en: v0.5.0 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito en `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a saltar antes de comenzar a escribir. Debe satisfacer `0 \<= offset \<= buf.length - 1`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` más el número de bytes escritos.

Escribe `value` a `buf` en el `offset` especificado. `value` debe ser un entero sin signo de 8 bits válido. El comportamiento no está definido cuando `value` es algo diferente a un entero sin signo de 8 bits.

Esta función también está disponible bajo el alias `writeUint8`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt8(0x3, 0);
buf.writeUInt8(0x4, 1);
buf.writeUInt8(0x23, 2);
buf.writeUInt8(0x42, 3);

console.log(buf);
// Prints: <Buffer 03 04 23 42>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt8(0x3, 0);
buf.writeUInt8(0x4, 1);
buf.writeUInt8(0x23, 2);
buf.writeUInt8(0x42, 3);

console.log(buf);
// Prints: <Buffer 03 04 23 42>
```
:::


### `buf.writeUInt16BE(value[, offset])` {#bufwriteuint16bevalue-offset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.9.0, v12.19.0 | Esta función también está disponible como `buf.writeUint16BE()`. |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset a `uint32`. |
| v0.5.5 | Añadido en: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número que se escribirá en `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes que se omitirán antes de empezar a escribir. Debe satisfacer `0 \<= offset \<= buf.length - 2`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` más el número de bytes escritos.

Escribe `value` en `buf` en el `offset` especificado como big-endian. El `value` debe ser un entero sin signo de 16 bits válido. El comportamiento no está definido cuando `value` es algo que no sea un entero sin signo de 16 bits.

Esta función también está disponible bajo el alias `writeUint16BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16BE(0xdead, 0);
buf.writeUInt16BE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer de ad be ef>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16BE(0xdead, 0);
buf.writeUInt16BE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer de ad be ef>
```
:::

### `buf.writeUInt16LE(value[, offset])` {#bufwriteuint16levalue-offset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.9.0, v12.19.0 | Esta función también está disponible como `buf.writeUint16LE()`. |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset a `uint32`. |
| v0.5.5 | Añadido en: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número que se escribirá en `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes que se omitirán antes de empezar a escribir. Debe satisfacer `0 \<= offset \<= buf.length - 2`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` más el número de bytes escritos.

Escribe `value` en `buf` en el `offset` especificado como little-endian. El `value` debe ser un entero sin signo de 16 bits válido. El comportamiento no está definido cuando `value` es algo que no sea un entero sin signo de 16 bits.

Esta función también está disponible bajo el alias `writeUint16LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16LE(0xdead, 0);
buf.writeUInt16LE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer ad de ef be>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16LE(0xdead, 0);
buf.writeUInt16LE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer ad de ef be>
```
:::


### `buf.writeUInt32BE(value[, offset])` {#bufwriteuint32bevalue-offset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.9.0, v12.19.0 | Esta función también está disponible como `buf.writeUint32BE()`. |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset a `uint32`. |
| v0.5.5 | Añadido en: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número que se escribirá en `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a omitir antes de empezar a escribir. Debe satisfacer `0 \<= offset \<= buf.length - 4`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` más el número de bytes escritos.

Escribe `value` en `buf` en el `offset` especificado como big-endian. El `value` debe ser un entero de 32 bits sin signo válido. El comportamiento no está definido cuando `value` es algo distinto a un entero de 32 bits sin signo.

Esta función también está disponible con el alias `writeUint32BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32BE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer fe ed fa ce>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32BE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer fe ed fa ce>
```
:::

### `buf.writeUInt32LE(value[, offset])` {#bufwriteuint32levalue-offset}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.9.0, v12.19.0 | Esta función también está disponible como `buf.writeUint32LE()`. |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset a `uint32`. |
| v0.5.5 | Añadido en: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número que se escribirá en `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a omitir antes de empezar a escribir. Debe satisfacer `0 \<= offset \<= buf.length - 4`. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` más el número de bytes escritos.

Escribe `value` en `buf` en el `offset` especificado como little-endian. El `value` debe ser un entero de 32 bits sin signo válido. El comportamiento no está definido cuando `value` es algo distinto a un entero de 32 bits sin signo.

Esta función también está disponible con el alias `writeUint32LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32LE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer ce fa ed fe>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32LE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer ce fa ed fe>
```
:::


### `buf.writeUIntBE(value, offset, byteLength)` {#bufwriteuintbevalue-offset-bytelength}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v14.9.0, v12.19.0 | Esta función también está disponible como `buf.writeUintBE()`. |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset y `byteLength` a `uint32`. |
| v0.5.5 | Añadido en: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito en `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a omitir antes de empezar a escribir. Debe satisfacer `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a escribir. Debe satisfacer `0 \< byteLength \<= 6`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` más el número de bytes escritos.

Escribe `byteLength` bytes de `value` en `buf` en el `offset` especificado como big-endian. Soporta hasta 48 bits de precisión. El comportamiento es indefinido cuando `value` es algo diferente a un entero sin signo.

Esta función también está disponible bajo el alias `writeUintBE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeUIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeUIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```
:::

### `buf.writeUIntLE(value, offset, byteLength)` {#bufwriteuintlevalue-offset-bytelength}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v14.9.0, v12.19.0 | Esta función también está disponible como `buf.writeUintLE()`. |
| v10.0.0 | Se eliminó `noAssert` y ya no hay coerción implícita del offset y `byteLength` a `uint32`. |
| v0.5.5 | Añadido en: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número a ser escrito en `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a omitir antes de empezar a escribir. Debe satisfacer `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a escribir. Debe satisfacer `0 \< byteLength \<= 6`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` más el número de bytes escritos.

Escribe `byteLength` bytes de `value` en `buf` en el `offset` especificado como little-endian. Soporta hasta 48 bits de precisión. El comportamiento es indefinido cuando `value` es algo diferente a un entero sin signo.

Esta función también está disponible bajo el alias `writeUintLE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeUIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeUIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```
:::


### `new Buffer(array)` {#new-bufferarray}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Llamar a este constructor emite una advertencia de obsolescencia cuando se ejecuta desde código fuera del directorio `node_modules`. |
| v7.2.1 | Llamar a este constructor ya no emite una advertencia de obsolescencia. |
| v7.0.0 | Llamar a este constructor ahora emite una advertencia de obsolescencia. |
| v6.0.0 | Obsoleto desde: v6.0.0 |
:::

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Utilice [`Buffer.from(array)`](/es/nodejs/api/buffer#static-method-bufferfromarray) en su lugar.
:::

- `array` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un array de bytes para copiar desde.

Vea [`Buffer.from(array)`](/es/nodejs/api/buffer#static-method-bufferfromarray).

### `new Buffer(arrayBuffer[, byteOffset[, length]])` {#new-bufferarraybuffer-byteoffset-length}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Llamar a este constructor emite una advertencia de obsolescencia cuando se ejecuta desde código fuera del directorio `node_modules`. |
| v7.2.1 | Llamar a este constructor ya no emite una advertencia de obsolescencia. |
| v7.0.0 | Llamar a este constructor ahora emite una advertencia de obsolescencia. |
| v6.0.0 | Los parámetros `byteOffset` y `length` ahora son compatibles. |
| v6.0.0 | Obsoleto desde: v6.0.0 |
| v3.0.0 | Agregado en: v3.0.0 |
:::

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Utilice [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/es/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) en su lugar.
:::

- `arrayBuffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) Un [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) o la propiedad `.buffer` de un [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Índice del primer byte a exponer. **Predeterminado:** `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de bytes a exponer. **Predeterminado:** `arrayBuffer.byteLength - byteOffset`.

Vea [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/es/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length).


### `new Buffer(buffer)` {#new-bufferbuffer}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Llamar a este constructor emite una advertencia de obsolescencia cuando se ejecuta desde código fuera del directorio `node_modules`. |
| v7.2.1 | Llamar a este constructor ya no emite una advertencia de obsolescencia. |
| v7.0.0 | Llamar a este constructor ahora emite una advertencia de obsolescencia. |
| v6.0.0 | Obsoleto desde: v6.0.0 |
:::

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Utilice [`Buffer.from(buffer)`](/es/nodejs/api/buffer#static-method-bufferfrombuffer) en su lugar.
:::

- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Un `Buffer` existente o [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) desde donde copiar datos.

Ver [`Buffer.from(buffer)`](/es/nodejs/api/buffer#static-method-bufferfrombuffer).

### `new Buffer(size)` {#new-buffersize}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Llamar a este constructor emite una advertencia de obsolescencia cuando se ejecuta desde código fuera del directorio `node_modules`. |
| v8.0.0 | `new Buffer(size)` devolverá la memoria llena de ceros de forma predeterminada. |
| v7.2.1 | Llamar a este constructor ya no emite una advertencia de obsolescencia. |
| v7.0.0 | Llamar a este constructor ahora emite una advertencia de obsolescencia. |
| v6.0.0 | Obsoleto desde: v6.0.0 |
:::

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Utilice [`Buffer.alloc()`](/es/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) en su lugar (ver también [`Buffer.allocUnsafe()`](/es/nodejs/api/buffer#static-method-bufferallocunsafesize)).
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longitud deseada del nuevo `Buffer`.

Ver [`Buffer.alloc()`](/es/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) y [`Buffer.allocUnsafe()`](/es/nodejs/api/buffer#static-method-bufferallocunsafesize). Esta variante del constructor es equivalente a [`Buffer.alloc()`](/es/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding).


### `new Buffer(string[, encoding])` {#new-bufferstring-encoding}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Llamar a este constructor emite una advertencia de obsolescencia cuando se ejecuta desde código fuera del directorio `node_modules`. |
| v7.2.1 | Llamar a este constructor ya no emite una advertencia de obsolescencia. |
| v7.0.0 | Llamar a este constructor ahora emite una advertencia de obsolescencia. |
| v6.0.0 | Obsoleto desde: v6.0.0 |
:::

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Use [`Buffer.from(string[, encoding])`](/es/nodejs/api/buffer#static-method-bufferfromstring-encoding) en su lugar.
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Cadena para codificar.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codificación de `string`. **Predeterminado:** `'utf8'`.

Vea [`Buffer.from(string[, encoding])`](/es/nodejs/api/buffer#static-method-bufferfromstring-encoding).

## Clase: `File` {#class-file}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Hace que las instancias de File sean clonables. |
| v20.0.0 | Ya no es experimental. |
| v19.2.0, v18.13.0 | Agregado en: v19.2.0, v18.13.0 |
:::

- Extiende: [\<Blob\>](/es/nodejs/api/buffer#class-blob)

Un [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) proporciona información sobre archivos.

### `new buffer.File(sources, fileName[, options])` {#new-bufferfilesources-filename-options}

**Agregado en: v19.2.0, v18.13.0**

- `sources` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Blob[]\>](/es/nodejs/api/buffer#class-blob) | [\<File[]\>](/es/nodejs/api/buffer#class-file) Un array de objetos string, [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView), [\<File\>](/es/nodejs/api/buffer#class-file), o [\<Blob\>](/es/nodejs/api/buffer#class-blob), o cualquier mezcla de tales objetos, que se almacenarán dentro del `File`.
- `fileName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre del archivo.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endings` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uno de `'transparent'` o `'native'`. Cuando se establece en `'native'`, los finales de línea en las partes de origen de cadena se convertirán al final de línea nativo de la plataforma según lo especificado por `require('node:os').EOL`.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El tipo de contenido del archivo.
    - `lastModified` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La fecha de la última modificación del archivo. **Predeterminado:** `Date.now()`.


### `file.name` {#filename}

**Añadido en: v19.2.0, v18.13.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El nombre del `File`.

### `file.lastModified` {#filelastmodified}

**Añadido en: v19.2.0, v18.13.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La fecha de última modificación del `File`.

## APIs del módulo `node:buffer` {#nodebuffer-module-apis}

Si bien, el objeto `Buffer` está disponible globalmente, existen APIs adicionales relacionadas con `Buffer` que solo están disponibles a través del módulo `node:buffer` al que se accede usando `require('node:buffer')`.

### `buffer.atob(data)` {#bufferatobdata}

**Añadido en: v15.13.0, v14.17.0**

::: info [Estable: 3 - Legado]
[Estable: 3](/es/nodejs/api/documentation#stability-index) [Estabilidad: 3](/es/nodejs/api/documentation#stability-index) - Legado. Use `Buffer.from(data, 'base64')` en su lugar.
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) La cadena de entrada codificada en Base64.

Decodifica una cadena de datos codificada en Base64 en bytes y codifica esos bytes en una cadena utilizando Latin-1 (ISO-8859-1).

Los `data` pueden ser cualquier valor de JavaScript que se pueda convertir en una cadena.

**Esta función solo se proporciona para compatibilidad con las API de la plataforma web heredada
y nunca debe usarse en código nuevo, porque usan cadenas para representar
datos binarios y son anteriores a la introducción de matrices tipadas en JavaScript.
Para el código que se ejecuta utilizando las API de Node.js, la conversión entre cadenas codificadas en base64
y los datos binarios deben realizarse utilizando <code>Buffer.from(str, 'base64')</code> y
<code>buf.toString('base64')</code>.**

### `buffer.btoa(data)` {#bufferbtoadata}

**Añadido en: v15.13.0, v14.17.0**

::: info [Estable: 3 - Legado]
[Estable: 3](/es/nodejs/api/documentation#stability-index) [Estabilidad: 3](/es/nodejs/api/documentation#stability-index) - Legado. Use `buf.toString('base64')` en su lugar.
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Una cadena ASCII (Latin1).

Decodifica una cadena en bytes usando Latin-1 (ISO-8859) y codifica esos bytes en una cadena usando Base64.

Los `data` pueden ser cualquier valor de JavaScript que se pueda convertir en una cadena.

**Esta función solo se proporciona para compatibilidad con las API de la plataforma web heredada
y nunca debe usarse en código nuevo, porque usan cadenas para representar
datos binarios y son anteriores a la introducción de matrices tipadas en JavaScript.
Para el código que se ejecuta utilizando las API de Node.js, la conversión entre cadenas codificadas en base64
y los datos binarios deben realizarse utilizando <code>Buffer.from(str, 'base64')</code> y
<code>buf.toString('base64')</code>.**


### `buffer.isAscii(input)` {#bufferisasciiinput}

**Agregado en: v19.6.0, v18.15.0**

- input [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) La entrada para validar.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Esta función devuelve `true` si `input` contiene solo datos válidos codificados en ASCII, incluyendo el caso en que `input` esté vacío.

Lanza un error si la `input` es un búfer de matriz desasociado.

### `buffer.isUtf8(input)` {#bufferisutf8input}

**Agregado en: v19.4.0, v18.14.0**

- input [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) La entrada para validar.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Esta función devuelve `true` si `input` contiene solo datos válidos codificados en UTF-8, incluyendo el caso en que `input` esté vacío.

Lanza un error si la `input` es un búfer de matriz desasociado.

### `buffer.INSPECT_MAX_BYTES` {#bufferinspect_max_bytes}

**Agregado en: v0.5.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `50`

Devuelve el número máximo de bytes que se devolverán cuando se llame a `buf.inspect()`. Esto puede ser sobrescrito por los módulos de usuario. Consulte [`util.inspect()`](/es/nodejs/api/util#utilinspectobject-options) para obtener más detalles sobre el comportamiento de `buf.inspect()`.

### `buffer.kMaxLength` {#bufferkmaxlength}

**Agregado en: v3.0.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El tamaño más grande permitido para una sola instancia de `Buffer`.

Un alias para [`buffer.constants.MAX_LENGTH`](/es/nodejs/api/buffer#bufferconstantsmax_length).

### `buffer.kStringMaxLength` {#bufferkstringmaxlength}

**Agregado en: v3.0.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longitud más grande permitida para una sola instancia de `string`.

Un alias para [`buffer.constants.MAX_STRING_LENGTH`](/es/nodejs/api/buffer#bufferconstantsmax_string_length).


### `buffer.resolveObjectURL(id)` {#bufferresolveobjecturlid}

**Agregado en: v16.7.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una cadena URL `'blob:nodedata:...` devuelta por una llamada anterior a `URL.createObjectURL()`.
- Devuelve: [\<Blob\>](/es/nodejs/api/buffer#class-blob)

Resuelve un `'blob:nodedata:...'` un objeto [\<Blob\>](/es/nodejs/api/buffer#class-blob) asociado registrado usando una llamada anterior a `URL.createObjectURL()`.

### `buffer.transcode(source, fromEnc, toEnc)` {#buffertranscodesource-fromenc-toenc}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v8.0.0 | El parámetro `source` ahora puede ser un `Uint8Array`. |
| v7.1.0 | Agregado en: v7.1.0 |
:::

- `source` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Una instancia de `Buffer` o `Uint8Array`.
- `fromEnc` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codificación actual.
- `toEnc` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codificación de destino.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Recodifica la instancia dada de `Buffer` o `Uint8Array` de una codificación de caracteres a otra. Devuelve una nueva instancia de `Buffer`.

Lanza un error si `fromEnc` o `toEnc` especifican codificaciones de caracteres no válidas o si la conversión de `fromEnc` a `toEnc` no está permitida.

Las codificaciones admitidas por `buffer.transcode()` son: `'ascii'`, `'utf8'`, `'utf16le'`, `'ucs2'`, `'latin1'` y `'binary'`.

El proceso de transcodificación utilizará caracteres de sustitución si una secuencia de bytes dada no puede representarse adecuadamente en la codificación de destino. Por ejemplo:

::: code-group
```js [ESM]
import { Buffer, transcode } from 'node:buffer';

const newBuf = transcode(Buffer.from('€'), 'utf8', 'ascii');
console.log(newBuf.toString('ascii'));
// Prints: '?'
```

```js [CJS]
const { Buffer, transcode } = require('node:buffer');

const newBuf = transcode(Buffer.from('€'), 'utf8', 'ascii');
console.log(newBuf.toString('ascii'));
// Prints: '?'
```
:::

Debido a que el signo del Euro (`€`) no se puede representar en US-ASCII, se reemplaza con `?` en el `Buffer` transcodificado.


### Clase: `SlowBuffer` {#class-slowbuffer}

**Obsoleto desde: v6.0.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Utilice [`Buffer.allocUnsafeSlow()`](/es/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) en su lugar.
:::

Consulte [`Buffer.allocUnsafeSlow()`](/es/nodejs/api/buffer#static-method-bufferallocunsafeslowsize). Esto nunca fue una clase en el sentido de que el constructor siempre devolvía una instancia de `Buffer`, en lugar de una instancia de `SlowBuffer`.

#### `new SlowBuffer(size)` {#new-slowbuffersize}

**Obsoleto desde: v6.0.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Utilice [`Buffer.allocUnsafeSlow()`](/es/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) en su lugar.
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longitud deseada del nuevo `SlowBuffer`.

Consulte [`Buffer.allocUnsafeSlow()`](/es/nodejs/api/buffer#static-method-bufferallocunsafeslowsize).

### Constantes de Buffer {#buffer-constants}

**Agregado en: v8.2.0**

#### `buffer.constants.MAX_LENGTH` {#bufferconstantsmax_length}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.0.0 | El valor se cambia a 2<sup>32</sup> - 1 en arquitecturas de 64 bits. |
| v15.0.0 | El valor se cambia a 2<sup>31</sup> en arquitecturas de 64 bits. |
| v14.0.0 | El valor se cambia de 2<sup>32</sup> - 1 a 2<sup>31</sup> - 1 en arquitecturas de 64 bits. |
| v8.2.0 | Agregado en: v8.2.0 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El tamaño más grande permitido para una sola instancia de `Buffer`.

En arquitecturas de 32 bits, este valor es actualmente 2<sup>31</sup> - 1 (aproximadamente 1 GiB).

En arquitecturas de 64 bits, este valor es actualmente 2<sup>53</sup> - 1 (aproximadamente 8 PiB).

Refleja [`v8::TypedArray::kMaxLength`](https://v8.github.io/api/head/classv8_1_1TypedArray#a54a48f4373da0850663c4393d843b9b0) internamente.

Este valor también está disponible como [`buffer.kMaxLength`](/es/nodejs/api/buffer#bufferkmaxlength).

#### `buffer.constants.MAX_STRING_LENGTH` {#bufferconstantsmax_string_length}

**Agregado en: v8.2.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longitud más grande permitida para una sola instancia de `string`.

Representa la `longitud` más grande que una primitiva `string` puede tener, contada en unidades de código UTF-16.

Este valor puede depender del motor JS que se esté utilizando.


## `Buffer.from()`, `Buffer.alloc()` y `Buffer.allocUnsafe()` {#bufferfrom-bufferalloc-and-bufferallocunsafe}

En versiones de Node.js anteriores a la 6.0.0, las instancias de `Buffer` se creaban usando la función constructora `Buffer`, que asigna el `Buffer` devuelto de manera diferente según los argumentos proporcionados:

- Pasar un número como primer argumento a `Buffer()` (por ejemplo, `new Buffer(10)`) asigna un nuevo objeto `Buffer` del tamaño especificado. Antes de Node.js 8.0.0, la memoria asignada para tales instancias de `Buffer` *no* se inicializa y *puede contener datos confidenciales*. Tales instancias de `Buffer` *deben* inicializarse posteriormente usando [`buf.fill(0)`](/es/nodejs/api/buffer#buffillvalue-offset-end-encoding) o escribiendo en todo el `Buffer` antes de leer datos del `Buffer`. Si bien este comportamiento es *intencional* para mejorar el rendimiento, la experiencia de desarrollo ha demostrado que se requiere una distinción más explícita entre la creación de un `Buffer` rápido pero no inicializado y la creación de un `Buffer` más lento pero más seguro. Desde Node.js 8.0.0, `Buffer(num)` y `new Buffer(num)` devuelven un `Buffer` con memoria inicializada.
- Pasar una cadena, un array o un `Buffer` como primer argumento copia los datos del objeto pasado al `Buffer`.
- Pasar un [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) o un [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) devuelve un `Buffer` que comparte la memoria asignada con el array buffer dado.

Debido a que el comportamiento de `new Buffer()` es diferente según el tipo del primer argumento, se pueden introducir inadvertidamente problemas de seguridad y confiabilidad en las aplicaciones cuando no se realiza la validación de argumentos o la inicialización de `Buffer`.

Por ejemplo, si un atacante puede hacer que una aplicación reciba un número donde se espera una cadena, la aplicación puede llamar a `new Buffer(100)` en lugar de `new Buffer("100")`, lo que lleva a asignar un buffer de 100 bytes en lugar de asignar un buffer de 3 bytes con el contenido `"100"`. Esto es comúnmente posible usando llamadas a la API JSON. Dado que JSON distingue entre tipos numéricos y de cadena, permite la inyección de números donde una aplicación escrita de manera ingenua que no valida suficientemente su entrada podría esperar recibir siempre una cadena. Antes de Node.js 8.0.0, el buffer de 100 bytes podría contener datos preexistentes arbitrarios en la memoria, por lo que podría usarse para exponer secretos en la memoria a un atacante remoto. Desde Node.js 8.0.0, la exposición de la memoria no puede ocurrir porque los datos se rellenan con ceros. Sin embargo, otros ataques aún son posibles, como causar la asignación de buffers muy grandes por parte del servidor, lo que lleva a la degradación del rendimiento o al bloqueo por agotamiento de la memoria.

Para hacer que la creación de instancias de `Buffer` sea más confiable y menos propensa a errores, las diversas formas del constructor `new Buffer()` han sido **desaprobadas** y reemplazadas por los métodos separados `Buffer.from()`, [`Buffer.alloc()`](/es/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) y [`Buffer.allocUnsafe()`](/es/nodejs/api/buffer#static-method-bufferallocunsafesize).

*Los desarrolladores deben migrar todos los usos existentes de los constructores <code>new Buffer()</code>
a una de estas nuevas API.*

- [`Buffer.from(array)`](/es/nodejs/api/buffer#static-method-bufferfromarray) devuelve un nuevo `Buffer` que *contiene una copia* de los octetos proporcionados.
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/es/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) devuelve un nuevo `Buffer` que *comparte la misma memoria asignada* que el [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) dado.
- [`Buffer.from(buffer)`](/es/nodejs/api/buffer#static-method-bufferfrombuffer) devuelve un nuevo `Buffer` que *contiene una copia* del contenido del `Buffer` dado.
- [`Buffer.from(string[, encoding])`](/es/nodejs/api/buffer#static-method-bufferfromstring-encoding) devuelve un nuevo `Buffer` que *contiene una copia* de la cadena proporcionada.
- [`Buffer.alloc(size[, fill[, encoding]])`](/es/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) devuelve un nuevo `Buffer` inicializado del tamaño especificado. Este método es más lento que [`Buffer.allocUnsafe(size)`](/es/nodejs/api/buffer#static-method-bufferallocunsafesize) pero garantiza que las instancias de `Buffer` recién creadas nunca contengan datos antiguos que sean potencialmente confidenciales. Se lanzará un `TypeError` si `size` no es un número.
- [`Buffer.allocUnsafe(size)`](/es/nodejs/api/buffer#static-method-bufferallocunsafesize) y [`Buffer.allocUnsafeSlow(size)`](/es/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) cada uno devuelve un nuevo `Buffer` no inicializado del `size` especificado. Debido a que el `Buffer` no está inicializado, el segmento de memoria asignado puede contener datos antiguos que sean potencialmente confidenciales.

Las instancias de `Buffer` devueltas por [`Buffer.allocUnsafe()`](/es/nodejs/api/buffer#static-method-bufferallocunsafesize), [`Buffer.from(string)`](/es/nodejs/api/buffer#static-method-bufferfromstring-encoding), [`Buffer.concat()`](/es/nodejs/api/buffer#static-method-bufferconcatlist-totallength) y [`Buffer.from(array)`](/es/nodejs/api/buffer#static-method-bufferfromarray) *pueden* asignarse fuera de un pool de memoria interno compartido si `size` es menor o igual a la mitad de [`Buffer.poolSize`](/es/nodejs/api/buffer#class-property-bufferpoolsize). Las instancias devueltas por [`Buffer.allocUnsafeSlow()`](/es/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) *nunca* usan el pool de memoria interno compartido.


### La opción de línea de comandos `--zero-fill-buffers` {#the---zero-fill-buffers-command-line-option}

**Añadido en: v5.10.0**

Node.js puede iniciarse usando la opción de línea de comandos `--zero-fill-buffers` para que todas las instancias `Buffer` recién asignadas se llenen con ceros al crearse de forma predeterminada. Sin la opción, los búferes creados con [`Buffer.allocUnsafe()`](/es/nodejs/api/buffer#static-method-bufferallocunsafesize), [`Buffer.allocUnsafeSlow()`](/es/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) y `new SlowBuffer(size)` no se rellenan con ceros. El uso de esta bandera puede tener un impacto negativo medible en el rendimiento. Utilice la opción `--zero-fill-buffers` solo cuando sea necesario para garantizar que las instancias `Buffer` recién asignadas no puedan contener datos antiguos que puedan ser confidenciales.

```bash [BASH]
$ node --zero-fill-buffers
> Buffer.allocUnsafe(5);
<Buffer 00 00 00 00 00>
```
### ¿Qué hace que `Buffer.allocUnsafe()` y `Buffer.allocUnsafeSlow()` sean "inseguros"? {#what-makes-bufferallocunsafe-and-bufferallocunsafeslow-"unsafe"?}

Al llamar a [`Buffer.allocUnsafe()`](/es/nodejs/api/buffer#static-method-bufferallocunsafesize) y [`Buffer.allocUnsafeSlow()`](/es/nodejs/api/buffer#static-method-bufferallocunsafeslowsize), el segmento de memoria asignado *no está inicializado* (no se rellena con ceros). Si bien este diseño hace que la asignación de memoria sea bastante rápida, el segmento de memoria asignado puede contener datos antiguos que pueden ser confidenciales. El uso de un `Buffer` creado por [`Buffer.allocUnsafe()`](/es/nodejs/api/buffer#static-method-bufferallocunsafesize) sin sobrescribir *completamente* la memoria puede permitir que estos datos antiguos se filtren cuando se lee la memoria `Buffer`.

Si bien existen claras ventajas de rendimiento al utilizar [`Buffer.allocUnsafe()`](/es/nodejs/api/buffer#static-method-bufferallocunsafesize), se *debe* tener mucho cuidado para evitar la introducción de vulnerabilidades de seguridad en una aplicación.

