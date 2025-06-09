---
title: Documentación de la API del Sistema de Archivos de Node.js
description: Guía completa sobre el módulo de sistema de archivos de Node.js, detallando métodos para operaciones de archivos como leer, escribir, abrir, cerrar, y gestionar permisos y estadísticas de archivos.
head:
  - - meta
    - name: og:title
      content: Documentación de la API del Sistema de Archivos de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Guía completa sobre el módulo de sistema de archivos de Node.js, detallando métodos para operaciones de archivos como leer, escribir, abrir, cerrar, y gestionar permisos y estadísticas de archivos.
  - - meta
    - name: twitter:title
      content: Documentación de la API del Sistema de Archivos de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Guía completa sobre el módulo de sistema de archivos de Node.js, detallando métodos para operaciones de archivos como leer, escribir, abrir, cerrar, y gestionar permisos y estadísticas de archivos.
---


# Sistema de archivos {#file-system}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código fuente:** [lib/fs.js](https://github.com/nodejs/node/blob/v23.5.0/lib/fs.js)

El módulo `node:fs` permite interactuar con el sistema de archivos de una manera modelada sobre las funciones POSIX estándar.

Para usar las API basadas en promesas:

::: code-group
```js [ESM]
import * as fs from 'node:fs/promises';
```

```js [CJS]
const fs = require('node:fs/promises');
```
:::

Para usar las API de devolución de llamada y síncronas:

::: code-group
```js [ESM]
import * as fs from 'node:fs';
```

```js [CJS]
const fs = require('node:fs');
```
:::

Todas las operaciones del sistema de archivos tienen formas síncronas, de devolución de llamada y basadas en promesas, y son accesibles mediante la sintaxis CommonJS y los módulos ES6 (ESM).

## Ejemplo de promesa {#promise-example}

Las operaciones basadas en promesas devuelven una promesa que se cumple cuando se completa la operación asíncrona.

::: code-group
```js [ESM]
import { unlink } from 'node:fs/promises';

try {
  await unlink('/tmp/hello');
  console.log('se eliminó correctamente /tmp/hello');
} catch (error) {
  console.error('hubo un error:', error.message);
}
```

```js [CJS]
const { unlink } = require('node:fs/promises');

(async function(path) {
  try {
    await unlink(path);
    console.log(`se eliminó correctamente ${path}`);
  } catch (error) {
    console.error('hubo un error:', error.message);
  }
})('/tmp/hello');
```
:::

## Ejemplo de devolución de llamada {#callback-example}

La forma de devolución de llamada toma una función de devolución de llamada de finalización como su último argumento e invoca la operación de forma asíncrona. Los argumentos pasados a la devolución de llamada de finalización dependen del método, pero el primer argumento siempre está reservado para una excepción. Si la operación se completa correctamente, entonces el primer argumento es `null` o `undefined`.

::: code-group
```js [ESM]
import { unlink } from 'node:fs';

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('se eliminó correctamente /tmp/hello');
});
```

```js [CJS]
const { unlink } = require('node:fs');

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('se eliminó correctamente /tmp/hello');
});
```
:::

Las versiones basadas en devolución de llamada de las API del módulo `node:fs` son preferibles al uso de las API de promesa cuando se requiere el máximo rendimiento (tanto en términos de tiempo de ejecución como de asignación de memoria).


## Ejemplo Síncrono {#synchronous-example}

Las APIs síncronas bloquean el bucle de eventos de Node.js y la posterior ejecución de JavaScript hasta que la operación se completa. Las excepciones se lanzan inmediatamente y pueden manejarse usando `try…catch`, o pueden permitirse que burbujeen.

::: code-group
```js [ESM]
import { unlinkSync } from 'node:fs';

try {
  unlinkSync('/tmp/hello');
  console.log('se eliminó correctamente /tmp/hello');
} catch (err) {
  // manejar el error
}
```

```js [CJS]
const { unlinkSync } = require('node:fs');

try {
  unlinkSync('/tmp/hello');
  console.log('se eliminó correctamente /tmp/hello');
} catch (err) {
  // manejar el error
}
```
:::

## API de Promesas {#promises-api}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.0.0 | Expuesto como `require('fs/promises')`. |
| v11.14.0, v10.17.0 | Esta API ya no es experimental. |
| v10.1.0 | La API es accesible solo a través de `require('fs').promises`. |
| v10.0.0 | Añadido en: v10.0.0 |
:::

La API `fs/promises` proporciona métodos asíncronos del sistema de archivos que devuelven promesas.

Las APIs de promesas utilizan el pool de hilos subyacente de Node.js para realizar operaciones del sistema de archivos fuera del hilo del bucle de eventos. Estas operaciones no están sincronizadas ni son seguras para hilos. Se debe tener cuidado al realizar múltiples modificaciones concurrentes en el mismo archivo, ya que puede producirse corrupción de datos.

### Clase: `FileHandle` {#class-filehandle}

**Añadido en: v10.0.0**

Un objeto [\<FileHandle\>](/es/nodejs/api/fs#class-filehandle) es un envoltorio de objeto para un descriptor de archivo numérico.

Las instancias del objeto [\<FileHandle\>](/es/nodejs/api/fs#class-filehandle) se crean mediante el método `fsPromises.open()`.

Todos los objetos [\<FileHandle\>](/es/nodejs/api/fs#class-filehandle) son [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter)s.

Si un [\<FileHandle\>](/es/nodejs/api/fs#class-filehandle) no se cierra utilizando el método `filehandle.close()`, intentará cerrar automáticamente el descriptor de archivo y emitirá una advertencia de proceso, ayudando a prevenir fugas de memoria. Por favor, no confíe en este comportamiento porque puede ser poco fiable y es posible que el archivo no se cierre. En su lugar, cierre siempre explícitamente los [\<FileHandle\>](/es/nodejs/api/fs#class-filehandle)s. Node.js puede cambiar este comportamiento en el futuro.


#### Evento: `'close'` {#event-close}

**Agregado en: v15.4.0**

El evento `'close'` se emite cuando el [\<FileHandle\>](/es/nodejs/api/fs#class-filehandle) se ha cerrado y ya no se puede utilizar.

#### `filehandle.appendFile(data[, options])` {#filehandleappendfiledata-options}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.1.0, v20.10.0 | Ahora se admite la opción `flush`. |
| v15.14.0, v14.18.0 | El argumento `data` admite `AsyncIterable`, `Iterable` y `Stream`. |
| v14.0.0 | El parámetro `data` ya no forzará la conversión de entradas no admitidas a cadenas. |
| v10.0.0 | Agregado en: v10.0.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/es/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `'utf8'`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, el descriptor de archivo subyacente se vacía antes de cerrarlo. **Predeterminado:** `false`.
  
 
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con `undefined` si tiene éxito.

Alias de [`filehandle.writeFile()`](/es/nodejs/api/fs#filehandlewritefiledata-options).

Cuando se opera con manejadores de archivos, el modo no se puede cambiar de lo que se estableció con [`fsPromises.open()`](/es/nodejs/api/fs#fspromisesopenpath-flags-mode). Por lo tanto, esto es equivalente a [`filehandle.writeFile()`](/es/nodejs/api/fs#filehandlewritefiledata-options).


#### `filehandle.chmod(mode)` {#filehandlechmodmode}

**Agregado en: v10.0.0**

- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) la máscara de bits del modo de archivo.
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con `undefined` al tener éxito.

Modifica los permisos del archivo. Ver [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2).

#### `filehandle.chown(uid, gid)` {#filehandlechownuid-gid}

**Agregado en: v10.0.0**

- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El ID de usuario del nuevo propietario del archivo.
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El ID de grupo del nuevo grupo del archivo.
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con `undefined` al tener éxito.

Cambia la propiedad del archivo. Un wrapper para [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2).

#### `filehandle.close()` {#filehandleclose}

**Agregado en: v10.0.0**

- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con `undefined` al tener éxito.

Cierra el manejador de archivos después de esperar a que se complete cualquier operación pendiente en el manejador.

```js [ESM]
import { open } from 'node:fs/promises';

let filehandle;
try {
  filehandle = await open('thefile.txt', 'r');
} finally {
  await filehandle?.close();
}
```
#### `filehandle.createReadStream([options])` {#filehandlecreatereadstreamoptions}

**Agregado en: v16.11.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `null`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `64 * 1024`
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) **Predeterminado:** `undefined`
  
 
- Devuelve: [\<fs.ReadStream\>](/es/nodejs/api/fs#class-fsreadstream)

`options` puede incluir valores `start` y `end` para leer un rango de bytes del archivo en lugar de todo el archivo. Tanto `start` como `end` son inclusivos y comienzan a contar en 0, los valores permitidos están en el rango [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. Si se omite `start` o es `undefined`, `filehandle.createReadStream()` lee secuencialmente desde la posición actual del archivo. La `encoding` puede ser cualquiera de las aceptadas por [\<Buffer\>](/es/nodejs/api/buffer#class-buffer).

Si el `FileHandle` apunta a un dispositivo de caracteres que solo admite lecturas bloqueantes (como un teclado o una tarjeta de sonido), las operaciones de lectura no finalizan hasta que los datos estén disponibles. Esto puede evitar que el proceso salga y que el stream se cierre de forma natural.

De forma predeterminada, el stream emitirá un evento `'close'` después de haber sido destruido. Establezca la opción `emitClose` en `false` para cambiar este comportamiento.

```js [ESM]
import { open } from 'node:fs/promises';

const fd = await open('/dev/input/event0');
// Crea un stream desde algún dispositivo de caracteres.
const stream = fd.createReadStream();
setTimeout(() => {
  stream.close(); // Esto puede no cerrar el stream.
  // Marcar artificialmente el final del stream, como si el recurso subyacente hubiera
  // indicado el final del archivo por sí mismo, permite que el stream se cierre.
  // Esto no cancela las operaciones de lectura pendientes, y si hay tal
  // operación, es posible que el proceso aún no pueda salir con éxito
  // hasta que termine.
  stream.push(null);
  stream.read(0);
}, 100);
```
Si `autoClose` es falso, entonces el descriptor de archivo no se cerrará, incluso si hay un error. Es responsabilidad de la aplicación cerrarlo y asegurarse de que no haya fugas de descriptores de archivo. Si `autoClose` está establecido en verdadero (comportamiento predeterminado), en `'error'` o `'end'` el descriptor de archivo se cerrará automáticamente.

Un ejemplo para leer los últimos 10 bytes de un archivo que tiene 100 bytes de longitud:

```js [ESM]
import { open } from 'node:fs/promises';

const fd = await open('sample.txt');
fd.createReadStream({ start: 90, end: 99 });
```

#### `filehandle.createWriteStream([options])` {#filehandlecreatewritestreamoptions}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.0.0, v20.10.0 | Ahora se soporta la opción `flush`. |
| v16.11.0 | Agregado en: v16.11.0 |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<cadena\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'utf8'`
    - `autoClose` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `true`
    - `emitClose` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `true`
    - `start` [\<entero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `highWaterMark` [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `16384`
    - `flush` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, el descriptor de archivo subyacente se vacía antes de cerrarlo. **Predeterminado:** `false`.
  
 
- Devuelve: [\<fs.WriteStream\>](/es/nodejs/api/fs#class-fswritestream)

`options` también puede incluir una opción `start` para permitir escribir datos en alguna posición más allá del comienzo del archivo, los valores permitidos están en el rango [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. Modificar un archivo en lugar de reemplazarlo puede requerir que la opción `flags` `open` se establezca en `r+` en lugar del valor predeterminado `r`. La `encoding` puede ser cualquiera de las aceptadas por [\<Buffer\>](/es/nodejs/api/buffer#class-buffer).

Si `autoClose` se establece en true (comportamiento predeterminado) en `'error'` o `'finish'`, el descriptor de archivo se cerrará automáticamente. Si `autoClose` es false, entonces el descriptor de archivo no se cerrará, incluso si hay un error. Es responsabilidad de la aplicación cerrarlo y asegurarse de que no haya fugas en el descriptor de archivo.

De forma predeterminada, el flujo emitirá un evento `'close'` después de haber sido destruido. Establezca la opción `emitClose` en `false` para cambiar este comportamiento.


#### `filehandle.datasync()` {#filehandledatasync}

**Agregado en: v10.0.0**

- Regresa: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con `undefined` al tener éxito.

Fuerza que todas las operaciones de E/S actualmente en cola asociadas con el archivo pasen al estado de finalización de E/S sincronizada del sistema operativo. Consulte la documentación de POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2) para obtener más detalles.

A diferencia de `filehandle.sync`, este método no vacía los metadatos modificados.

#### `filehandle.fd` {#filehandlefd}

**Agregado en: v10.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El descriptor de archivo numérico gestionado por el objeto [\<FileHandle\>](/es/nodejs/api/fs#class-filehandle).

#### `filehandle.read(buffer, offset, length, position)` {#filehandlereadbuffer-offset-length-position}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.0.0 | Acepta valores bigint como `position`. |
| v10.0.0 | Agregado en: v10.0.0 |
:::

- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un búfer que se llenará con los datos del archivo leído.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La ubicación en el búfer en la que comenzar a llenar. **Predeterminado:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes a leer. **Predeterminado:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) La ubicación donde comenzar a leer datos del archivo. Si es `null` o `-1`, los datos se leerán desde la posición actual del archivo y la posición se actualizará. Si `position` es un entero no negativo, la posición actual del archivo permanecerá sin cambios. **Predeterminado**: `null`
- Regresa: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple al tener éxito con un objeto con dos propiedades:
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes leídos
    - `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Una referencia al argumento `buffer` pasado.

Lee datos del archivo y los almacena en el búfer dado.

Si el archivo no se modifica simultáneamente, se alcanza el final del archivo cuando el número de bytes leídos es cero.


#### `filehandle.read([options])` {#filehandlereadoptions}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.0.0 | Acepta valores bigint como `position`. |
| v13.11.0, v12.17.0 | Añadido en: v13.11.0, v12.17.0 |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un búfer que se llenará con los datos del archivo leído. **Predeterminado:** `Buffer.alloc(16384)`
    - `offset` [\<entero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La ubicación en el búfer en la que se debe comenzar a llenar. **Predeterminado:** `0`
    - `length` [\<entero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes a leer. **Predeterminado:** `buffer.byteLength - offset`
    - `position` [\<entero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) La ubicación desde donde comenzar a leer datos del archivo. Si es `null` o `-1`, los datos se leerán desde la posición actual del archivo y la posición se actualizará. Si `position` es un entero no negativo, la posición actual del archivo permanecerá sin cambios. **Predeterminado**: `null`

- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple al tener éxito con un objeto con dos propiedades:
    - `bytesRead` [\<entero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes leídos
    - `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Una referencia al argumento `buffer` pasado.

Lee datos del archivo y los almacena en el búfer dado.

Si el archivo no se modifica concurrentemente, se llega al final del archivo cuando el número de bytes leídos es cero.


#### `filehandle.read(buffer[, options])` {#filehandlereadbuffer-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.0.0 | Acepta valores bigint como `position`. |
| v18.2.0, v16.17.0 | Agregado en: v18.2.0, v16.17.0 |
:::

- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un buffer que se llenará con los datos del archivo leídos.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La ubicación en el buffer donde comenzar a llenar. **Predeterminado:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes para leer. **Predeterminado:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) La ubicación donde comenzar a leer datos del archivo. Si es `null` o `-1`, los datos se leerán desde la posición actual del archivo y la posición se actualizará. Si `position` es un entero no negativo, la posición actual del archivo permanecerá sin cambios. **Predeterminado**: `null`


- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con éxito con un objeto con dos propiedades:
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes leídos
    - `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Una referencia al argumento `buffer` pasado.



Lee datos del archivo y los almacena en el búfer dado.

Si el archivo no se modifica de forma concurrente, se alcanza el final del archivo cuando el número de bytes leídos es cero.


#### `filehandle.readableWebStream([options])` {#filehandlereadablewebstreamoptions}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.0.0, v18.17.0 | Se agregó la opción para crear un flujo 'bytes'. |
| v17.0.0 | Agregado en: v17.0.0 |
:::

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Si se debe abrir un flujo normal o un flujo `'bytes'`. **Predeterminado:** `undefined`


- Devuelve: [\<ReadableStream\>](/es/nodejs/api/webstreams#class-readablestream)

Devuelve un `ReadableStream` que se puede usar para leer los datos de los archivos.

Se producirá un error si este método se llama más de una vez o si se llama después de que `FileHandle` se cierre o esté cerrando.

::: code-group
```js [ESM]
import {
  open,
} from 'node:fs/promises';

const file = await open('./some/file/to/read');

for await (const chunk of file.readableWebStream())
  console.log(chunk);

await file.close();
```

```js [CJS]
const {
  open,
} = require('node:fs/promises');

(async () => {
  const file = await open('./some/file/to/read');

  for await (const chunk of file.readableWebStream())
    console.log(chunk);

  await file.close();
})();
```
:::

Si bien `ReadableStream` leerá el archivo hasta completarse, no cerrará `FileHandle` automáticamente. El código de usuario aún debe llamar al método `fileHandle.close()`.

#### `filehandle.readFile(options)` {#filehandlereadfileoptions}

**Agregado en: v10.0.0**

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `null`
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) permite abortar un readFile en curso


- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple al leer correctamente con el contenido del archivo. Si no se especifica ninguna codificación (usando `options.encoding`), los datos se devuelven como un objeto [\<Buffer\>](/es/nodejs/api/buffer#class-buffer). De lo contrario, los datos serán una cadena.

Lee de forma asíncrona todo el contenido de un archivo.

Si `options` es una cadena, entonces especifica la `encoding`.

El [\<FileHandle\>](/es/nodejs/api/fs#class-filehandle) tiene que soportar la lectura.

Si se realizan una o más llamadas a `filehandle.read()` en un identificador de archivo y luego se realiza una llamada a `filehandle.readFile()`, los datos se leerán desde la posición actual hasta el final del archivo. No siempre lee desde el principio del archivo.


#### `filehandle.readLines([options])` {#filehandlereadlinesoptions}

**Agregado en: v18.11.0**

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `null`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `64 * 1024`
  
 
- Devuelve: [\<readline.InterfaceConstructor\>](/es/nodejs/api/readline#class-interfaceconstructor)

Método de conveniencia para crear una interfaz `readline` y transmitir sobre el archivo. Ver [`filehandle.createReadStream()`](/es/nodejs/api/fs#filehandlecreatereadstreamoptions) para las opciones.



::: code-group
```js [ESM]
import { open } from 'node:fs/promises';

const file = await open('./some/file/to/read');

for await (const line of file.readLines()) {
  console.log(line);
}
```

```js [CJS]
const { open } = require('node:fs/promises');

(async () => {
  const file = await open('./some/file/to/read');

  for await (const line of file.readLines()) {
    console.log(line);
  }
})();
```
:::

#### `filehandle.readv(buffers[, position])` {#filehandlereadvbuffers-position}

**Agregado en: v13.13.0, v12.17.0**

- `buffers` [\<Buffer[]\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) El desplazamiento desde el principio del archivo desde donde se deben leer los datos. Si `position` no es un `number`, los datos se leerán desde la posición actual. **Predeterminado:** `null`
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con éxito un objeto que contiene dos propiedades:
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) el número de bytes leídos
    - `buffers` [\<Buffer[]\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) propiedad que contiene una referencia a la entrada `buffers`.
  
 

Leer desde un archivo y escribir en una matriz de [\<ArrayBufferView\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)s


#### `filehandle.stat([options])` {#filehandlestatoptions}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.5.0 | Acepta un objeto `options` adicional para especificar si los valores numéricos devueltos deben ser bigint. |
| v10.0.0 | Añadido en: v10.0.0 |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si los valores numéricos del objeto [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) devuelto deben ser `bigint`. **Predeterminado:** `false`.

- Devuelve: [\<Promesa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con un [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) para el archivo.

#### `filehandle.sync()` {#filehandlesync}

**Añadido en: v10.0.0**

- Devuelve: [\<Promesa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con `undefined` en caso de éxito.

Solicita que todos los datos del descriptor de archivo abierto se descarguen al dispositivo de almacenamiento. La implementación específica depende del sistema operativo y del dispositivo. Consulte la documentación de POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2) para obtener más detalles.

#### `filehandle.truncate(len)` {#filehandletruncatelen}

**Añadido en: v10.0.0**

- `len` [\<entero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0`
- Devuelve: [\<Promesa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con `undefined` en caso de éxito.

Trunca el archivo.

Si el archivo era más grande que `len` bytes, solo se conservarán en el archivo los primeros `len` bytes.

El siguiente ejemplo conserva solo los primeros cuatro bytes del archivo:

```js [ESM]
import { open } from 'node:fs/promises';

let filehandle = null;
try {
  filehandle = await open('temp.txt', 'r+');
  await filehandle.truncate(4);
} finally {
  await filehandle?.close();
}
```
Si el archivo previamente era más corto que `len` bytes, se extiende y la parte extendida se rellena con bytes nulos (`'\0'`):

Si `len` es negativo, se utilizará `0`.


#### `filehandle.utimes(atime, mtime)` {#filehandleutimesatime-mtime}

**Añadido en: v10.0.0**

- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- Regresa: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Cambia las marcas de tiempo del sistema de archivos del objeto referenciado por el [\<FileHandle\>](/es/nodejs/api/fs#class-filehandle) luego cumple la promesa sin argumentos tras el éxito.

#### `filehandle.write(buffer, offset[, length[, position]])` {#filehandlewritebuffer-offset-length-position}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.0.0 | El parámetro `buffer` ya no forzará la entrada no admitida a los búferes. |
| v10.0.0 | Añadido en: v10.0.0 |
:::

- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La posición de inicio dentro del `buffer` donde comienzan los datos que se van a escribir.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes de `buffer` para escribir. **Predeterminado:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) El desplazamiento desde el principio del archivo donde se deben escribir los datos de `buffer`. Si `position` no es un `number`, los datos se escribirán en la posición actual. Consulta la documentación de POSIX [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2) para obtener más detalles. **Predeterminado:** `null`
- Regresa: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Escribe `buffer` en el archivo.

La promesa se cumple con un objeto que contiene dos propiedades:

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) el número de bytes escritos
- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) una referencia al `buffer` escrito.

No es seguro utilizar `filehandle.write()` varias veces en el mismo archivo sin esperar a que la promesa se cumpla (o se rechace). Para este escenario, utiliza [`filehandle.createWriteStream()`](/es/nodejs/api/fs#filehandlecreatewritestreamoptions).

En Linux, las escrituras posicionales no funcionan cuando el archivo se abre en modo de anexión. El kernel ignora el argumento de posición y siempre añade los datos al final del archivo.


#### `filehandle.write(buffer[, options])` {#filehandlewritebuffer-options}

**Agregado en: v18.3.0, v16.17.0**

- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `null`


- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Escribe `buffer` en el archivo.

Similar a la función `filehandle.write` anterior, esta versión toma un objeto `options` opcional. Si no se especifica un objeto `options`, tomará los valores predeterminados anteriores.

#### `filehandle.write(string[, position[, encoding]])` {#filehandlewritestring-position-encoding}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.0.0 | El parámetro `string` ya no forzará la entrada no admitida a cadenas. |
| v10.0.0 | Agregado en: v10.0.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) El desplazamiento desde el principio del archivo donde se deben escribir los datos de `string`. Si `position` no es un `number`, los datos se escribirán en la posición actual. Consulta la documentación de POSIX [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2) para obtener más detalles. **Predeterminado:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codificación de cadena esperada. **Predeterminado:** `'utf8'`
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Escribe `string` en el archivo. Si `string` no es una cadena, la promesa se rechaza con un error.

La promesa se cumple con un objeto que contiene dos propiedades:

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) el número de bytes escritos
- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) una referencia a la `string` escrita.

No es seguro usar `filehandle.write()` varias veces en el mismo archivo sin esperar a que se cumpla (o se rechace) la promesa. Para este escenario, utiliza [`filehandle.createWriteStream()`](/es/nodejs/api/fs#filehandlecreatewritestreamoptions).

En Linux, las escrituras posicionales no funcionan cuando el archivo se abre en modo de adición. El kernel ignora el argumento de posición y siempre añade los datos al final del archivo.


#### `filehandle.writeFile(data, options)` {#filehandlewritefiledata-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.14.0, v14.18.0 | El argumento `data` soporta `AsyncIterable`, `Iterable` y `Stream`. |
| v14.0.0 | El parámetro `data` ya no forzará la entrada no soportada a cadenas. |
| v10.0.0 | Añadido en: v10.0.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/es/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) La codificación de caracteres esperada cuando `data` es una cadena. **Predeterminado:** `'utf8'`

- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Escribe datos de forma asíncrona en un archivo, reemplazando el archivo si ya existe. `data` puede ser una cadena, un buffer, un objeto [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) o un objeto [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol). La promesa se cumple sin argumentos en caso de éxito.

Si `options` es una cadena, entonces especifica la `encoding`.

El [\<FileHandle\>](/es/nodejs/api/fs#class-filehandle) tiene que soportar la escritura.

Es inseguro utilizar `filehandle.writeFile()` varias veces en el mismo archivo sin esperar a que la promesa se cumpla (o se rechace).

Si se realizan una o más llamadas a `filehandle.write()` en un descriptor de archivo y luego se realiza una llamada a `filehandle.writeFile()`, los datos se escribirán desde la posición actual hasta el final del archivo. No siempre escribe desde el principio del archivo.


#### `filehandle.writev(buffers[, position])` {#filehandlewritevbuffers-position}

**Añadido en: v12.9.0**

- `buffers` [\<Buffer[]\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) El desplazamiento desde el principio del archivo donde se deben escribir los datos de `buffers`. Si `position` no es un `number`, los datos se escribirán en la posición actual. **Predeterminado:** `null`
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Escribe una matriz de [\<ArrayBufferView\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)s en el archivo.

La promesa se cumple con un objeto que contiene dos propiedades:

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) el número de bytes escritos
- `buffers` [\<Buffer[]\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) una referencia a la entrada `buffers`.

No es seguro llamar a `writev()` varias veces en el mismo archivo sin esperar a que se cumpla (o se rechace) la promesa.

En Linux, las escrituras posicionales no funcionan cuando el archivo se abre en modo de anexión. El kernel ignora el argumento de posición y siempre añade los datos al final del archivo.

#### `filehandle[Symbol.asyncDispose]()` {#filehandlesymbolasyncdispose}

**Añadido en: v20.4.0, v18.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Un alias para `filehandle.close()`.


### `fsPromises.access(path[, mode])` {#fspromisesaccesspath-mode}

**Agregado en: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `fs.constants.F_OK`
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumple con `undefined` si tiene éxito.

Prueba los permisos de un usuario para el archivo o directorio especificado por `path`. El argumento `mode` es un entero opcional que especifica las comprobaciones de accesibilidad que se realizarán. `mode` debe ser el valor `fs.constants.F_OK` o una máscara que consista en el OR bit a bit de cualquiera de `fs.constants.R_OK`, `fs.constants.W_OK` y `fs.constants.X_OK` (por ejemplo, `fs.constants.W_OK | fs.constants.R_OK`). Consulta [Constantes de acceso a archivos](/es/nodejs/api/fs#file-access-constants) para conocer los valores posibles de `mode`.

Si la comprobación de accesibilidad es exitosa, la promesa se cumple sin ningún valor. Si alguna de las comprobaciones de accesibilidad falla, la promesa se rechaza con un objeto [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error). El siguiente ejemplo comprueba si el archivo `/etc/passwd` puede ser leído y escrito por el proceso actual.

```js [ESM]
import { access, constants } from 'node:fs/promises';

try {
  await access('/etc/passwd', constants.R_OK | constants.W_OK);
  console.log('can access');
} catch {
  console.error('cannot access');
}
```
No se recomienda usar `fsPromises.access()` para comprobar la accesibilidad de un archivo antes de llamar a `fsPromises.open()`. Hacerlo introduce una condición de carrera, ya que otros procesos pueden cambiar el estado del archivo entre las dos llamadas. En cambio, el código de usuario debe abrir/leer/escribir el archivo directamente y manejar el error generado si el archivo no es accesible.

### `fsPromises.appendFile(path, data[, options])` {#fspromisesappendfilepath-data-options}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v21.1.0, v20.10.0 | Ahora se admite la opción `flush`. |
| v10.0.0 | Agregado en: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/es/nodejs/api/fs#class-filehandle) nombre de archivo o [\<FileHandle\>](/es/nodejs/api/fs#class-filehandle)
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Consulta [compatibilidad con `flags` del sistema de archivos](/es/nodejs/api/fs#file-system-flags). **Predeterminado:** `'a'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, el descriptor de archivo subyacente se vacía antes de cerrarlo. **Predeterminado:** `false`.
  
 
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumple con `undefined` si tiene éxito.

Agrega datos de forma asíncrona a un archivo, creando el archivo si aún no existe. `data` puede ser una cadena o un [\<Buffer\>](/es/nodejs/api/buffer#class-buffer).

Si `options` es una cadena, entonces especifica la `encoding`.

La opción `mode` solo afecta al archivo recién creado. Consulta [`fs.open()`](/es/nodejs/api/fs#fsopenpath-flags-mode-callback) para obtener más detalles.

El `path` se puede especificar como un [\<FileHandle\>](/es/nodejs/api/fs#class-filehandle) que se ha abierto para agregar (usando `fsPromises.open()`).


### `fsPromises.chmod(path, mode)` {#fspromiseschmodpath-mode}

**Agregado en: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con `undefined` tras el éxito.

Cambia los permisos de un archivo.

### `fsPromises.chown(path, uid, gid)` {#fspromiseschownpath-uid-gid}

**Agregado en: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con `undefined` tras el éxito.

Cambia la propiedad de un archivo.

### `fsPromises.copyFile(src, dest[, mode])` {#fspromisescopyfilesrc-dest-mode}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.0.0 | Se cambió el argumento `flags` a `mode` y se impuso una validación de tipo más estricta. |
| v10.0.0 | Agregado en: v10.0.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) nombre del archivo fuente a copiar
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) nombre del archivo de destino de la operación de copia
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Modificadores opcionales que especifican el comportamiento de la operación de copia. Es posible crear una máscara que consista en el OR bit a bit de dos o más valores (por ejemplo, `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`) **Predeterminado:** `0`.
    - `fs.constants.COPYFILE_EXCL`: La operación de copia fallará si `dest` ya existe.
    - `fs.constants.COPYFILE_FICLONE`: La operación de copia intentará crear un reflink de copia en escritura. Si la plataforma no admite la copia en escritura, se utiliza un mecanismo de copia de reserva.
    - `fs.constants.COPYFILE_FICLONE_FORCE`: La operación de copia intentará crear un reflink de copia en escritura. Si la plataforma no admite la copia en escritura, la operación fallará.
  
 
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con `undefined` tras el éxito.

Copia asíncronamente `src` a `dest`. Por defecto, `dest` se sobrescribe si ya existe.

No se ofrecen garantías sobre la atomicidad de la operación de copia. Si se produce un error después de que el archivo de destino se haya abierto para su escritura, se intentará eliminar el destino.

```js [ESM]
import { copyFile, constants } from 'node:fs/promises';

try {
  await copyFile('source.txt', 'destination.txt');
  console.log('source.txt se copió a destination.txt');
} catch {
  console.error('No se pudo copiar el archivo');
}

// Al usar COPYFILE_EXCL, la operación fallará si destination.txt existe.
try {
  await copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
  console.log('source.txt se copió a destination.txt');
} catch {
  console.error('No se pudo copiar el archivo');
}
```

### `fsPromises.cp(src, dest[, options])` {#fspromisescpsrc-dest-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.3.0 | Esta API ya no es experimental. |
| v20.1.0, v18.17.0 | Acepta una opción `mode` adicional para especificar el comportamiento de copia como el argumento `mode` de `fs.copyFile()`. |
| v17.6.0, v16.15.0 | Acepta una opción `verbatimSymlinks` adicional para especificar si se debe realizar la resolución de la ruta para los enlaces simbólicos. |
| v16.7.0 | Añadido en: v16.7.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) ruta de origen para copiar.
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) ruta de destino para copiar.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) desreferencia los enlaces simbólicos. **Predeterminado:** `false`.
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) cuando `force` es `false` y el destino existe, lanza un error. **Predeterminado:** `false`.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Función para filtrar archivos/directorios copiados. Devuelve `true` para copiar el elemento, `false` para ignorarlo. Al ignorar un directorio, también se omitirá todo su contenido. También puede devolver una `Promise` que se resuelve en `true` o `false` **Predeterminado:** `undefined`.
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ruta de origen para copiar.
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ruta de destino para copiar.
    - Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Un valor que puede ser forzado a `boolean` o una `Promise` que se cumple con dicho valor.

    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) sobrescribe el archivo o directorio existente. La operación de copia ignorará los errores si establece esto en falso y el destino existe. Utilice la opción `errorOnExist` para cambiar este comportamiento. **Predeterminado:** `true`.
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) modificadores para la operación de copia. **Predeterminado:** `0`. Consulte el indicador `mode` de [`fsPromises.copyFile()`](/es/nodejs/api/fs#fspromisescopyfilesrc-dest-mode).
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, se conservarán las marcas de tiempo de `src`. **Predeterminado:** `false`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) copia directorios de forma recursiva **Predeterminado:** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, se omitirá la resolución de la ruta para los enlaces simbólicos. **Predeterminado:** `false`

- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con `undefined` al tener éxito.

Copia asíncronamente toda la estructura de directorios desde `src` a `dest`, incluyendo subdirectorios y archivos.

Al copiar un directorio a otro directorio, los globs no son compatibles y el comportamiento es similar a `cp dir1/ dir2/`.


### `fsPromises.glob(pattern[, options])` {#fspromisesglobpattern-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.2.0 | Se añade soporte para `withFileTypes` como opción. |
| v22.0.0 | Añadido en: v22.0.0 |
:::

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) directorio de trabajo actual. **Predeterminado:** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Función para filtrar archivos/directorios. Devuelve `true` para excluir el elemento, `false` para incluirlo. **Predeterminado:** `undefined`.
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si el glob debe devolver rutas como Dirents, `false` en caso contrario. **Predeterminado:** `false`.
  
 
- Devuelve: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) Un AsyncIterator que produce las rutas de los archivos que coinciden con el patrón.



::: code-group
```js [ESM]
import { glob } from 'node:fs/promises';

for await (const entry of glob('**/*.js'))
  console.log(entry);
```

```js [CJS]
const { glob } = require('node:fs/promises');

(async () => {
  for await (const entry of glob('**/*.js'))
    console.log(entry);
})();
```
:::

### `fsPromises.lchmod(path, mode)` {#fspromiseslchmodpath-mode}

**Obsoleto desde: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con `undefined` al finalizar correctamente.

Cambia los permisos en un enlace simbólico.

Este método solo se implementa en macOS.


### `fsPromises.lchown(path, uid, gid)` {#fspromiseslchownpath-uid-gid}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.6.0 | Esta API ya no está obsoleta. |
| v10.0.0 | Añadido en: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Regresa: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con `undefined` al tener éxito.

Cambia la propiedad en un enlace simbólico.

### `fsPromises.lutimes(path, atime, mtime)` {#fspromiseslutimespath-atime-mtime}

**Añadido en: v14.5.0, v12.19.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- Regresa: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con `undefined` al tener éxito.

Cambia los tiempos de acceso y modificación de un archivo de la misma manera que [`fsPromises.utimes()`](/es/nodejs/api/fs#fspromisesutimespath-atime-mtime), con la diferencia de que si la ruta se refiere a un enlace simbólico, entonces el enlace no se desreferencia: en cambio, se cambian las marcas de tiempo del propio enlace simbólico.


### `fsPromises.link(existingPath, newPath)` {#fspromiseslinkexistingpath-newpath}

**Añadido en: v10.0.0**

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se completa con `undefined` al tener éxito.

Crea un nuevo enlace desde `existingPath` hasta `newPath`. Consulte la documentación de POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) para obtener más detalles.

### `fsPromises.lstat(path[, options])` {#fspromiseslstatpath-options}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.5.0 | Acepta un objeto `options` adicional para especificar si los valores numéricos devueltos deben ser bigint. |
| v10.0.0 | Añadido en: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si los valores numéricos en el objeto [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) devuelto deben ser `bigint`. **Predeterminado:** `false`.
  
 
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se completa con el objeto [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) para el `path` del enlace simbólico dado.

Equivalente a [`fsPromises.stat()`](/es/nodejs/api/fs#fspromisesstatpath-options) a menos que `path` se refiera a un enlace simbólico, en cuyo caso el enlace en sí se estatuye, no el archivo al que se refiere. Consulte el documento POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) para obtener más detalles.


### `fsPromises.mkdir(path[, options])` {#fspromisesmkdirpath-options}

**Añadido en: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) No compatible con Windows. **Predeterminado:** `0o777`.


- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Tras el éxito, se cumple con `undefined` si `recursive` es `false`, o la primera ruta de directorio creada si `recursive` es `true`.

Crea asíncronamente un directorio.

El argumento opcional `options` puede ser un entero que especifique `mode` (permiso y bits pegajosos), o un objeto con una propiedad `mode` y una propiedad `recursive` que indica si se deben crear los directorios padre. Llamar a `fsPromises.mkdir()` cuando `path` es un directorio que existe resulta en un rechazo solo cuando `recursive` es falso.

::: code-group
```js [ESM]
import { mkdir } from 'node:fs/promises';

try {
  const projectFolder = new URL('./test/project/', import.meta.url);
  const createDir = await mkdir(projectFolder, { recursive: true });

  console.log(`created ${createDir}`);
} catch (err) {
  console.error(err.message);
}
```

```js [CJS]
const { mkdir } = require('node:fs/promises');
const { join } = require('node:path');

async function makeDirectory() {
  const projectFolder = join(__dirname, 'test', 'project');
  const dirCreation = await mkdir(projectFolder, { recursive: true });

  console.log(dirCreation);
  return dirCreation;
}

makeDirectory().catch(console.error);
```
:::


### `fsPromises.mkdtemp(prefix[, options])` {#fspromisesmkdtempprefix-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.6.0, v18.19.0 | El parámetro `prefix` ahora acepta buffers y URL. |
| v16.5.0, v14.18.0 | El parámetro `prefix` ahora acepta una cadena vacía. |
| v10.0.0 | Agregado en: v10.0.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'utf8'`


- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con una cadena que contiene la ruta del sistema de archivos del directorio temporal recién creado.

Crea un directorio temporal único. Se genera un nombre de directorio único agregando seis caracteres aleatorios al final del `prefix` proporcionado. Debido a las inconsistencias de la plataforma, evite los caracteres `X` finales en `prefix`. Algunas plataformas, en particular los BSD, pueden devolver más de seis caracteres aleatorios y reemplazar los caracteres `X` finales en `prefix` con caracteres aleatorios.

El argumento opcional `options` puede ser una cadena que especifique una codificación, o un objeto con una propiedad `encoding` que especifique la codificación de caracteres que se va a utilizar.

```js [ESM]
import { mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

try {
  await mkdtemp(join(tmpdir(), 'foo-'));
} catch (err) {
  console.error(err);
}
```
El método `fsPromises.mkdtemp()` agregará los seis caracteres seleccionados aleatoriamente directamente a la cadena `prefix`. Por ejemplo, dado un directorio `/tmp`, si la intención es crear un directorio temporal *dentro* de `/tmp`, el `prefix` debe terminar con un separador de ruta específico de la plataforma (`require('node:path').sep`).


### `fsPromises.open(path, flags[, mode])` {#fspromisesopenpath-flags-mode}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v11.1.0 | El argumento `flags` ahora es opcional y por defecto es `'r'`. |
| v10.0.0 | Añadido en: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type) Véase [soporte de `flags` del sistema de archivos](/es/nodejs/api/fs#file-system-flags). **Predeterminado:** `'r'`.
- `mode` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type) Establece el modo del archivo (permisos y bits adhesivos) si se crea el archivo. **Predeterminado:** `0o666` (legible y escribible)
- Devuelve: [\<Promise\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con un objeto [\<FileHandle\>](/es/nodejs/api/fs#class-filehandle).

Abre un [\<FileHandle\>](/es/nodejs/api/fs#class-filehandle).

Consulte la documentación POSIX [`open(2)`](http://man7.org/linux/man-pages/man2/open.2) para obtener más detalles.

Algunos caracteres (`\< \> : " / \ | ? *`) están reservados en Windows, tal como se documenta en [Asignación de nombres a archivos, rutas de acceso y espacios de nombres](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file). En NTFS, si el nombre de archivo contiene dos puntos, Node.js abrirá un flujo del sistema de archivos, como se describe en [esta página de MSDN](https://docs.microsoft.com/en-us/windows/desktop/FileIO/using-streams).

### `fsPromises.opendir(path[, options])` {#fspromisesopendirpath-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.1.0, v18.17.0 | Se añadió la opción `recursive`. |
| v13.1.0, v12.16.0 | Se introdujo la opción `bufferSize`. |
| v12.12.0 | Añadido en: v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type) Número de entradas de directorio que se almacenan en búfer internamente al leer del directorio. Los valores más altos conducen a un mejor rendimiento, pero a un mayor uso de la memoria. **Predeterminado:** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Boolean_type) `Dir` resuelto será un [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) que contiene todos los subarchivos y directorios. **Predeterminado:** `false`

- Devuelve: [\<Promise\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con un [\<fs.Dir\>](/es/nodejs/api/fs#class-fsdir).

Abre asíncronamente un directorio para el escaneo iterativo. Consulte la documentación de POSIX [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3) para obtener más detalles.

Crea un [\<fs.Dir\>](/es/nodejs/api/fs#class-fsdir), que contiene todas las funciones adicionales para leer y limpiar el directorio.

La opción `encoding` establece la codificación para `path` al abrir el directorio y las operaciones de lectura posteriores.

Ejemplo usando la iteración asíncrona:

```js [ESM]
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name);
} catch (err) {
  console.error(err);
}
```
Cuando se utiliza el iterador asíncrono, el objeto [\<fs.Dir\>](/es/nodejs/api/fs#class-fsdir) se cerrará automáticamente después de que el iterador salga.


### `fsPromises.readdir(path[, options])` {#fspromisesreaddirpath-options}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v20.1.0, v18.17.0 | Se agregó la opción `recursive`. |
| v10.11.0 | Se agregó la nueva opción `withFileTypes`. |
| v10.0.0 | Agregado en: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, lee el contenido de un directorio recursivamente. En modo recursivo, listará todos los archivos, subarchivos y directorios. **Predeterminado:** `false`.


- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con un array de los nombres de los archivos en el directorio excluyendo `'.'` y `'..'`.

Lee el contenido de un directorio.

El argumento opcional `options` puede ser una cadena que especifique una codificación, o un objeto con una propiedad `encoding` que especifique la codificación de caracteres a utilizar para los nombres de archivo. Si la `encoding` se establece en `'buffer'`, los nombres de archivo devueltos se pasarán como objetos [\<Buffer\>](/es/nodejs/api/buffer#class-buffer).

Si `options.withFileTypes` se establece en `true`, el array devuelto contendrá objetos [\<fs.Dirent\>](/es/nodejs/api/fs#class-fsdirent).

```js [ESM]
import { readdir } from 'node:fs/promises';

try {
  const files = await readdir(path);
  for (const file of files)
    console.log(file);
} catch (err) {
  console.error(err);
}
```

### `fsPromises.readFile(path[, options])` {#fspromisesreadfilepath-options}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.2.0, v14.17.0 | El argumento options puede incluir un AbortSignal para abortar una solicitud readFile en curso. |
| v10.0.0 | Añadido en: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/es/nodejs/api/fs#class-filehandle) nombre de archivo o `FileHandle`
- `options` [\<Object\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) Vea el [soporte de los `flags` del sistema de archivos](/es/nodejs/api/fs#file-system-flags). **Predeterminado:** `'r'`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) permite abortar un readFile en curso
  
 
- Devuelve: [\<Promise\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con el contenido del archivo.

Lee asíncronamente todo el contenido de un archivo.

Si no se especifica ninguna codificación (usando `options.encoding`), los datos se devuelven como un objeto [\<Buffer\>](/es/nodejs/api/buffer#class-buffer). De lo contrario, los datos serán una string.

Si `options` es una string, entonces especifica la codificación.

Cuando la `path` es un directorio, el comportamiento de `fsPromises.readFile()` es específico de la plataforma. En macOS, Linux y Windows, la promesa se rechazará con un error. En FreeBSD, se devolverá una representación del contenido del directorio.

Un ejemplo de lectura de un archivo `package.json` ubicado en el mismo directorio del código en ejecución:



::: code-group
```js [ESM]
import { readFile } from 'node:fs/promises';
try {
  const filePath = new URL('./package.json', import.meta.url);
  const contents = await readFile(filePath, { encoding: 'utf8' });
  console.log(contents);
} catch (err) {
  console.error(err.message);
}
```

```js [CJS]
const { readFile } = require('node:fs/promises');
const { resolve } = require('node:path');
async function logFile() {
  try {
    const filePath = resolve('./package.json');
    const contents = await readFile(filePath, { encoding: 'utf8' });
    console.log(contents);
  } catch (err) {
    console.error(err.message);
  }
}
logFile();
```
:::

Es posible abortar un `readFile` en curso usando un [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal). Si se aborta una solicitud, la promesa devuelta se rechaza con un `AbortError`:

```js [ESM]
import { readFile } from 'node:fs/promises';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const promise = readFile(fileName, { signal });

  // Abortar la solicitud antes de que la promesa se resuelva.
  controller.abort();

  await promise;
} catch (err) {
  // Cuando se aborta una solicitud - err es un AbortError
  console.error(err);
}
```
Abortar una solicitud en curso no aborta las solicitudes individuales del sistema operativo, sino el almacenamiento en búfer interno que realiza `fs.readFile`.

Cualquier [\<FileHandle\>](/es/nodejs/api/fs#class-filehandle) especificado debe soportar la lectura.


### `fsPromises.readlink(path[, options])` {#fspromisesreadlinkpath-options}

**Agregado en: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'utf8'`
  
 
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se completa con `linkString` al tener éxito.

Lee el contenido del enlace simbólico al que se refiere `path`. Consulte la documentación POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2) para obtener más detalles. La promesa se cumple con `linkString` al tener éxito.

El argumento opcional `options` puede ser una cadena que especifique una codificación, o un objeto con una propiedad `encoding` que especifique la codificación de caracteres que se utilizará para la ruta del enlace devuelta. Si `encoding` se establece en `'buffer'`, la ruta del enlace devuelta se pasará como un objeto [\<Buffer\>](/es/nodejs/api/buffer#class-buffer).

### `fsPromises.realpath(path[, options])` {#fspromisesrealpathpath-options}

**Agregado en: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'utf8'`
  
 
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se completa con la ruta resuelta al tener éxito.

Determina la ubicación real de `path` utilizando la misma semántica que la función `fs.realpath.native()`.

Solo se admiten las rutas que se pueden convertir a cadenas UTF8.

El argumento opcional `options` puede ser una cadena que especifique una codificación, o un objeto con una propiedad `encoding` que especifique la codificación de caracteres que se utilizará para la ruta. Si `encoding` se establece en `'buffer'`, la ruta devuelta se pasará como un objeto [\<Buffer\>](/es/nodejs/api/buffer#class-buffer).

En Linux, cuando Node.js está vinculado a musl libc, el sistema de archivos procfs debe estar montado en `/proc` para que esta función funcione. Glibc no tiene esta restricción.


### `fsPromises.rename(oldPath, newPath)` {#fspromisesrenameoldpath-newpath}

**Agregado en: v10.0.0**

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con `undefined` al tener éxito.

Renombra `oldPath` a `newPath`.

### `fsPromises.rmdir(path[, options])` {#fspromisesrmdirpath-options}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.0.0 | Usar `fsPromises.rmdir(path, { recursive: true })` en un `path` que es un archivo ya no está permitido y resulta en un error `ENOENT` en Windows y un error `ENOTDIR` en POSIX. |
| v16.0.0 | Usar `fsPromises.rmdir(path, { recursive: true })` en un `path` que no existe ya no está permitido y resulta en un error `ENOENT`. |
| v16.0.0 | La opción `recursive` está obsoleta, usarla desencadena una advertencia de obsolescencia. |
| v14.14.0 | La opción `recursive` está obsoleta, use `fsPromises.rm` en su lugar. |
| v13.3.0, v12.16.0 | La opción `maxBusyTries` se renombró a `maxRetries`, y su valor predeterminado es 0. La opción `emfileWait` se eliminó y los errores `EMFILE` usan la misma lógica de reintento que otros errores. Ahora se admite la opción `retryDelay`. Ahora se reintentan los errores `ENFILE`. |
| v12.10.0 | Ahora se admiten las opciones `recursive`, `maxBusyTries` y `emfileWait`. |
| v10.0.0 | Agregado en: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si se encuentra un error `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` o `EPERM`, Node.js reintenta la operación con una espera de retroceso lineal de `retryDelay` milisegundos más en cada intento. Esta opción representa el número de reintentos. Esta opción se ignora si la opción `recursive` no es `true`. **Predeterminado:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, realice una eliminación de directorio recursiva. En modo recursivo, las operaciones se reintentan en caso de falla. **Predeterminado:** `false`. **Obsoleto.**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La cantidad de tiempo en milisegundos para esperar entre reintentos. Esta opción se ignora si la opción `recursive` no es `true`. **Predeterminado:** `100`.
  
 
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con `undefined` al tener éxito.

Elimina el directorio identificado por `path`.

Usar `fsPromises.rmdir()` en un archivo (no un directorio) da como resultado que la promesa sea rechazada con un error `ENOENT` en Windows y un error `ENOTDIR` en POSIX.

Para obtener un comportamiento similar al comando Unix `rm -rf`, use [`fsPromises.rm()`](/es/nodejs/api/fs#fspromisesrmpath-options) con las opciones `{ recursive: true, force: true }`.


### `fsPromises.rm(path[, options])` {#fspromisesrmpath-options}

**Agregado en: v14.14.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, las excepciones serán ignoradas si `path` no existe. **Predeterminado:** `false`.
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si se encuentra un error `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` o `EPERM`, Node.js reintentará la operación con una espera de retroceso lineal de `retryDelay` milisegundos más larga en cada intento. Esta opción representa el número de reintentos. Esta opción se ignora si la opción `recursive` no es `true`. **Predeterminado:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, realiza una eliminación recursiva del directorio. En el modo recursivo, las operaciones se reintentan en caso de fallo. **Predeterminado:** `false`.
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La cantidad de tiempo en milisegundos que se debe esperar entre reintentos. Esta opción se ignora si la opción `recursive` no es `true`. **Predeterminado:** `100`.


- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con `undefined` tras el éxito.

Elimina archivos y directorios (modelado según la utilidad estándar POSIX `rm`).

### `fsPromises.stat(path[, options])` {#fspromisesstatpath-options}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.5.0 | Acepta un objeto `options` adicional para especificar si los valores numéricos devueltos deben ser bigint. |
| v10.0.0 | Agregado en: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si los valores numéricos en el objeto [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) devuelto deben ser `bigint`. **Predeterminado:** `false`.


- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con el objeto [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) para la `path` dada.


### `fsPromises.statfs(path[, options])` {#fspromisesstatfspath-options}

**Agregado en: v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si los valores numéricos en el objeto [\<fs.StatFs\>](/es/nodejs/api/fs#class-fsstatfs) devuelto deben ser `bigint`. **Predeterminado:** `false`.
  
 
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con el objeto [\<fs.StatFs\>](/es/nodejs/api/fs#class-fsstatfs) para la `path` dada.

### `fsPromises.symlink(target, path[, type])` {#fspromisessymlinktarget-path-type}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Si el argumento `type` es `null` u omitido, Node.js auto detectará el tipo de `target` y seleccionará automáticamente `dir` o `file`. |
| v10.0.0 | Agregado en: v10.0.0 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `null`
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con `undefined` si tiene éxito.

Crea un enlace simbólico.

El argumento `type` solo se usa en plataformas Windows y puede ser uno de `'dir'`, `'file'` o `'junction'`. Si el argumento `type` es `null`, Node.js auto detectará el tipo de `target` y usará `'file'` o `'dir'`. Si el `target` no existe, se usará `'file'`. Los puntos de unión de Windows requieren que la ruta de destino sea absoluta. Al usar `'junction'`, el argumento `target` se normalizará automáticamente a una ruta absoluta. Los puntos de unión en los volúmenes NTFS solo pueden apuntar a directorios.


### `fsPromises.truncate(path[, len])` {#fspromisestruncatepath-len}

**Agregado en: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0`
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con `undefined` al tener éxito.

Trunca (acorta o extiende la longitud) del contenido en `path` a `len` bytes.

### `fsPromises.unlink(path)` {#fspromisesunlinkpath}

**Agregado en: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con `undefined` al tener éxito.

Si `path` se refiere a un enlace simbólico, entonces el enlace se elimina sin afectar el archivo o directorio al que se refiere ese enlace. Si el `path` se refiere a una ruta de archivo que no es un enlace simbólico, el archivo se elimina. Consulte la documentación POSIX [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2) para obtener más detalles.

### `fsPromises.utimes(path, atime, mtime)` {#fspromisesutimespath-atime-mtime}

**Agregado en: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con `undefined` al tener éxito.

Cambia las marcas de tiempo del sistema de archivos del objeto al que hace referencia `path`.

Los argumentos `atime` y `mtime` siguen estas reglas:

- Los valores pueden ser números que representan el tiempo de la época de Unix, `Date`s o una cadena numérica como `'123456789.0'`.
- Si el valor no se puede convertir a un número, o es `NaN`, `Infinity` o `-Infinity`, se lanzará un `Error`.


### `fsPromises.watch(filename[, options])` {#fspromiseswatchfilename-options}

**Agregado en: v15.9.0, v14.18.0**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si el proceso debe continuar ejecutándose mientras se observan los archivos. **Predeterminado:** `true`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si se deben observar todos los subdirectorios, o solo el directorio actual. Esto se aplica cuando se especifica un directorio, y solo en plataformas compatibles (Ver [advertencias](/es/nodejs/api/fs#caveats)). **Predeterminado:** `false`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especifica la codificación de caracteres que se utilizará para el nombre de archivo pasado al listener. **Predeterminado:** `'utf8'`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) Un [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) utilizado para indicar cuándo debe detenerse el observador.


- Devuelve: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) de objetos con las siguientes propiedades:
    - `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El tipo de cambio
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) El nombre del archivo cambiado.



Devuelve un iterador asíncrono que observa los cambios en `filename`, donde `filename` es un archivo o un directorio.

```js [ESM]
const { watch } = require('node:fs/promises');

const ac = new AbortController();
const { signal } = ac;
setTimeout(() => ac.abort(), 10000);

(async () => {
  try {
    const watcher = watch(__filename, { signal });
    for await (const event of watcher)
      console.log(event);
  } catch (err) {
    if (err.name === 'AbortError')
      return;
    throw err;
  }
})();
```
En la mayoría de las plataformas, se emite `'rename'` cada vez que un nombre de archivo aparece o desaparece en el directorio.

Todas las [advertencias](/es/nodejs/api/fs#caveats) para `fs.watch()` también se aplican a `fsPromises.watch()`.


### `fsPromises.writeFile(file, data[, options])` {#fspromiseswritefilefile-data-options}

::: info [Historial]
| Versión | Cambios |
|---|---|
| v21.0.0, v20.10.0 | Ahora se admite la opción `flush`. |
| v15.14.0, v14.18.0 | El argumento `data` admite `AsyncIterable`, `Iterable` y `Stream`. |
| v15.2.0, v14.17.0 | El argumento de opciones puede incluir un AbortSignal para abortar una solicitud de writeFile en curso. |
| v14.0.0 | El parámetro `data` ya no coercerá las entradas no admitidas a cadenas. |
| v10.0.0 | Añadido en: v10.0.0 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/es/nodejs/api/fs#class-filehandle) nombre de archivo o `FileHandle`
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/es/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ver [soporte de `flags` del sistema de archivos](/es/nodejs/api/fs#file-system-flags). **Predeterminado:** `'w'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si todos los datos se escriben correctamente en el archivo, y `flush` es `true`, se usa `filehandle.sync()` para vaciar los datos. **Predeterminado:** `false`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) permite abortar un writeFile en curso
 
- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con `undefined` tras el éxito.

Escribe datos de forma asíncrona en un archivo, reemplazando el archivo si ya existe. `data` puede ser una cadena, un búfer, un [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) o un objeto [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol).

La opción `encoding` se ignora si `data` es un búfer.

Si `options` es una cadena, entonces especifica la codificación.

La opción `mode` solo afecta al archivo recién creado. Consulta [`fs.open()`](/es/nodejs/api/fs#fsopenpath-flags-mode-callback) para obtener más detalles.

Cualquier [\<FileHandle\>](/es/nodejs/api/fs#class-filehandle) especificado debe admitir la escritura.

No es seguro usar `fsPromises.writeFile()` varias veces en el mismo archivo sin esperar a que se resuelva la promesa.

De manera similar a `fsPromises.readFile`, `fsPromises.writeFile` es un método de conveniencia que realiza múltiples llamadas a `write` internamente para escribir el búfer que se le pasa. Para el código sensible al rendimiento, considera usar [`fs.createWriteStream()`](/es/nodejs/api/fs#fscreatewritestreampath-options) o [`filehandle.createWriteStream()`](/es/nodejs/api/fs#filehandlecreatewritestreamoptions).

Es posible usar un [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) para cancelar un `fsPromises.writeFile()`. La cancelación es "el mejor esfuerzo", y es probable que todavía se escriba una cierta cantidad de datos.

```js [ESM]
import { writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const data = new Uint8Array(Buffer.from('Hello Node.js'));
  const promise = writeFile('message.txt', data, { signal });

  // Abortar la solicitud antes de que se resuelva la promesa.
  controller.abort();

  await promise;
} catch (err) {
  // Cuando una solicitud se aborta - err es un AbortError
  console.error(err);
}
```
Abortar una solicitud en curso no aborta las solicitudes individuales del sistema operativo, sino el almacenamiento en búfer interno que realiza `fs.writeFile`.


### `fsPromises.constants` {#fspromisesconstants}

**Añadido en: v18.4.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Devuelve un objeto que contiene constantes de uso común para las operaciones del sistema de archivos. El objeto es el mismo que `fs.constants`. Consulte [Constantes FS](/es/nodejs/api/fs#fs-constants) para obtener más detalles.

## API de Callback {#callback-api}

Las API de callback realizan todas las operaciones de forma asíncrona, sin bloquear el bucle de eventos, y luego invocan una función de callback al finalizar o producirse un error.

Las API de callback utilizan el grupo de subprocesos Node.js subyacente para realizar operaciones del sistema de archivos fuera del subproceso del bucle de eventos. Estas operaciones no están sincronizadas ni son seguras para subprocesos. Se debe tener cuidado al realizar múltiples modificaciones simultáneas en el mismo archivo o puede producirse corrupción de datos.

### `fs.access(path[, mode], callback)` {#fsaccesspath-mode-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.8.0 | Las constantes `fs.F_OK`, `fs.R_OK`, `fs.W_OK` y `fs.X_OK` que estaban presentes directamente en `fs` están obsoletas. |
| v18.0.0 | Pasar un callback no válido al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v7.6.0 | El parámetro `path` puede ser un objeto WHATWG `URL` que utilice el protocolo `file:`. |
| v6.3.0 | Las constantes como `fs.R_OK`, etc. que estaban presentes directamente en `fs` se movieron a `fs.constants` como una obsolescencia suave. Por lo tanto, para Node.js `\< v6.3.0` utilice `fs` para acceder a esas constantes, o haga algo como `(fs.constants || fs).R_OK` para trabajar con todas las versiones. |
| v0.11.15 | Añadido en: v0.11.15 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `fs.constants.F_OK`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Prueba los permisos de un usuario para el archivo o directorio especificado por `path`. El argumento `mode` es un entero opcional que especifica las comprobaciones de accesibilidad que se realizarán. `mode` debe ser el valor `fs.constants.F_OK` o una máscara que consiste en el OR bit a bit de cualquiera de `fs.constants.R_OK`, `fs.constants.W_OK` y `fs.constants.X_OK` (por ejemplo, `fs.constants.W_OK | fs.constants.R_OK`). Consulte [Constantes de acceso a archivos](/es/nodejs/api/fs#file-access-constants) para ver los valores posibles de `mode`.

El argumento final, `callback`, es una función de callback que se invoca con un posible argumento de error. Si alguna de las comprobaciones de accesibilidad falla, el argumento de error será un objeto `Error`. Los siguientes ejemplos comprueban si `package.json` existe y si es legible o escribible.

```js [ESM]
import { access, constants } from 'node:fs';

const file = 'package.json';

// Comprobar si el archivo existe en el directorio actual.
access(file, constants.F_OK, (err) => {
  console.log(`${file} ${err ? 'no existe' : 'existe'}`);
});

// Comprobar si el archivo es legible.
access(file, constants.R_OK, (err) => {
  console.log(`${file} ${err ? 'no es legible' : 'es legible'}`);
});

// Comprobar si el archivo es escribible.
access(file, constants.W_OK, (err) => {
  console.log(`${file} ${err ? 'no es escribible' : 'es escribible'}`);
});

// Comprobar si el archivo es legible y escribible.
access(file, constants.R_OK | constants.W_OK, (err) => {
  console.log(`${file} ${err ? 'no es' : 'es'} legible y escribible`);
});
```

No utilice `fs.access()` para comprobar la accesibilidad de un archivo antes de llamar a `fs.open()`, `fs.readFile()` o `fs.writeFile()`. Hacerlo introduce una condición de carrera, ya que otros procesos pueden cambiar el estado del archivo entre las dos llamadas. En su lugar, el código de usuario debe abrir/leer/escribir el archivo directamente y manejar el error que se produce si el archivo no es accesible.

**write (NO RECOMENDADO)**

```js [ESM]
import { access, open, close } from 'node:fs';

access('myfile', (err) => {
  if (!err) {
    console.error('myfile ya existe');
    return;
  }

  open('myfile', 'wx', (err, fd) => {
    if (err) throw err;

    try {
      writeMyData(fd);
    } finally {
      close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});
```
**write (RECOMENDADO)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile ya existe');
      return;
    }

    throw err;
  }

  try {
    writeMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
**read (NO RECOMENDADO)**

```js [ESM]
import { access, open, close } from 'node:fs';
access('myfile', (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile no existe');
      return;
    }

    throw err;
  }

  open('myfile', 'r', (err, fd) => {
    if (err) throw err;

    try {
      readMyData(fd);
    } finally {
      close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});
```
**read (RECOMENDADO)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile no existe');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
Los ejemplos "no recomendados" anteriores comprueban la accesibilidad y luego utilizan el archivo; los ejemplos "recomendados" son mejores porque utilizan el archivo directamente y manejan el error, si lo hay.

En general, compruebe la accesibilidad de un archivo solo si el archivo no se va a utilizar directamente, por ejemplo, cuando su accesibilidad es una señal de otro proceso.

En Windows, las políticas de control de acceso (ACL) en un directorio pueden limitar el acceso a un archivo o directorio. La función `fs.access()`, sin embargo, no comprueba la ACL y, por lo tanto, puede informar de que una ruta es accesible incluso si la ACL restringe al usuario la lectura o escritura en ella.


### `fs.appendFile(path, data[, options], callback)` {#fsappendfilepath-data-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.1.0, v20.10.0 | La opción `flush` ahora es compatible. |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo lanzará un `TypeError` en tiempo de ejecución. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con el ID DEP0013. |
| v7.0.0 | El objeto `options` pasado nunca será modificado. |
| v5.0.0 | El parámetro `file` ahora puede ser un descriptor de archivo. |
| v0.6.7 | Agregado en: v0.6.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nombre de archivo o descriptor de archivo
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Consulte [soporte de `flags` del sistema de archivos](/es/nodejs/api/fs#file-system-flags). **Predeterminado:** `'a'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, el descriptor de archivo subyacente se vacía antes de cerrarlo. **Predeterminado:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Añade datos de forma asíncrona a un archivo, creando el archivo si aún no existe. `data` puede ser una cadena o un [\<Buffer\>](/es/nodejs/api/buffer#class-buffer).

La opción `mode` solo afecta al archivo recién creado. Consulte [`fs.open()`](/es/nodejs/api/fs#fsopenpath-flags-mode-callback) para obtener más detalles.

```js [ESM]
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});
```
Si `options` es una cadena, entonces especifica la codificación:

```js [ESM]
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', 'utf8', callback);
```
El `path` puede especificarse como un descriptor de archivo numérico que se ha abierto para añadir (usando `fs.open()` o `fs.openSync()`). El descriptor de archivo no se cerrará automáticamente.

```js [ESM]
import { open, close, appendFile } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('message.txt', 'a', (err, fd) => {
  if (err) throw err;

  try {
    appendFile(fd, 'data to append', 'utf8', (err) => {
      closeFd(fd);
      if (err) throw err;
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
});
```

### `fs.chmod(path, mode, callback)` {#fschmodpath-mode-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo arrojará un `TypeError` en tiempo de ejecución. |
| v7.6.0 | El parámetro `path` puede ser un objeto `URL` WHATWG usando el protocolo `file:`. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con el ID DEP0013. |
| v0.1.30 | Agregado en: v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Cambia asíncronamente los permisos de un archivo. No se dan argumentos a la callback de finalización aparte de una posible excepción.

Consulte la documentación de POSIX [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2) para obtener más detalles.

```js [ESM]
import { chmod } from 'node:fs';

chmod('mi_archivo.txt', 0o775, (err) => {
  if (err) throw err;
  console.log('¡Los permisos para el archivo "mi_archivo.txt" han sido cambiados!');
});
```
#### Modos de archivo {#file-modes}

El argumento `mode` utilizado tanto en los métodos `fs.chmod()` como en `fs.chmodSync()` es una máscara de bits numérica creada utilizando un OR lógico de las siguientes constantes:

| Constante | Octal | Descripción |
| --- | --- | --- |
| `fs.constants.S_IRUSR` | `0o400` | leído por el propietario |
| `fs.constants.S_IWUSR` | `0o200` | escrito por el propietario |
| `fs.constants.S_IXUSR` | `0o100` | ejecutar/buscar por el propietario |
| `fs.constants.S_IRGRP` | `0o40` | leído por el grupo |
| `fs.constants.S_IWGRP` | `0o20` | escrito por el grupo |
| `fs.constants.S_IXGRP` | `0o10` | ejecutar/buscar por el grupo |
| `fs.constants.S_IROTH` | `0o4` | leído por otros |
| `fs.constants.S_IWOTH` | `0o2` | escrito por otros |
| `fs.constants.S_IXOTH` | `0o1` | ejecutar/buscar por otros |
Un método más fácil de construir el `mode` es usar una secuencia de tres dígitos octales (por ejemplo, `765`). El dígito más a la izquierda (`7` en el ejemplo) especifica los permisos para el propietario del archivo. El dígito del medio (`6` en el ejemplo) especifica los permisos para el grupo. El dígito más a la derecha (`5` en el ejemplo) especifica los permisos para otros.

| Número | Descripción |
| --- | --- |
| `7` | leer, escribir y ejecutar |
| `6` | leer y escribir |
| `5` | leer y ejecutar |
| `4` | solo lectura |
| `3` | escribir y ejecutar |
| `2` | solo escribir |
| `1` | solo ejecutar |
| `0` | sin permiso |
Por ejemplo, el valor octal `0o765` significa:

- El propietario puede leer, escribir y ejecutar el archivo.
- El grupo puede leer y escribir el archivo.
- Otros pueden leer y ejecutar el archivo.

Cuando se utilizan números brutos donde se esperan modos de archivo, cualquier valor mayor que `0o777` puede resultar en comportamientos específicos de la plataforma que no son compatibles para funcionar de manera consistente. Por lo tanto, constantes como `S_ISVTX`, `S_ISGID` o `S_ISUID` no están expuestas en `fs.constants`.

Advertencias: en Windows solo se puede cambiar el permiso de escritura, y no se implementa la distinción entre los permisos de grupo, propietario u otros.


### `fs.chown(path, uid, gid, callback)` {#fschownpath-uid-gid-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo lanzará un `TypeError` en tiempo de ejecución. |
| v7.6.0 | El parámetro `path` puede ser un objeto `URL` WHATWG usando el protocolo `file:`. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con el id DEP0013. |
| v0.1.97 | Añadido en: v0.1.97 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Cambia de forma asíncrona el propietario y el grupo de un archivo. No se dan argumentos distintos a una posible excepción a la devolución de llamada de finalización.

Consulte la documentación de POSIX [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2) para obtener más detalles.

### `fs.close(fd[, callback])` {#fsclosefd-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v15.9.0, v14.17.0 | Ahora se usa una devolución de llamada predeterminada si no se proporciona una. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo lanzará un `TypeError` en tiempo de ejecución. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con el id DEP0013. |
| v0.0.2 | Añadido en: v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Cierra el descriptor de archivo. No se dan argumentos distintos a una posible excepción a la devolución de llamada de finalización.

Llamar a `fs.close()` en cualquier descriptor de archivo (`fd`) que esté actualmente en uso a través de cualquier otra operación `fs` puede provocar un comportamiento indefinido.

Consulte la documentación de POSIX [`close(2)`](http://man7.org/linux/man-pages/man2/close.2) para obtener más detalles.


### `fs.copyFile(src, dest[, mode], callback)` {#fscopyfilesrc-dest-mode-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar un callback inválido al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v14.0.0 | Se cambió el argumento `flags` a `mode` y se impuso una validación de tipo más estricta. |
| v8.5.0 | Añadido en: v8.5.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) nombre de archivo fuente a copiar
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) nombre de archivo de destino de la operación de copia
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) modificadores para la operación de copia. **Predeterminado:** `0`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Copia `src` a `dest` de forma asíncrona. De forma predeterminada, `dest` se sobrescribe si ya existe. No se proporcionan argumentos a la función de callback, aparte de una posible excepción. Node.js no ofrece garantías sobre la atomicidad de la operación de copia. Si se produce un error después de que el archivo de destino se haya abierto para su escritura, Node.js intentará eliminar el destino.

`mode` es un entero opcional que especifica el comportamiento de la operación de copia. Es posible crear una máscara que consista en el OR bit a bit de dos o más valores (por ejemplo, `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`).

- `fs.constants.COPYFILE_EXCL`: La operación de copia fallará si `dest` ya existe.
- `fs.constants.COPYFILE_FICLONE`: La operación de copia intentará crear una reflink de copia en escritura. Si la plataforma no admite la copia en escritura, se utilizará un mecanismo de copia de reserva.
- `fs.constants.COPYFILE_FICLONE_FORCE`: La operación de copia intentará crear una reflink de copia en escritura. Si la plataforma no admite la copia en escritura, la operación fallará.

```js [ESM]
import { copyFile, constants } from 'node:fs';

function callback(err) {
  if (err) throw err;
  console.log('source.txt fue copiado a destination.txt');
}

// destination.txt se creará o sobrescribirá de forma predeterminada.
copyFile('source.txt', 'destination.txt', callback);

// Al utilizar COPYFILE_EXCL, la operación fallará si destination.txt existe.
copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL, callback);
```

### `fs.cp(src, dest[, options], callback)` {#fscpsrc-dest-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.3.0 | Esta API ya no es experimental. |
| v20.1.0, v18.17.0 | Acepta una opción `mode` adicional para especificar el comportamiento de la copia como el argumento `mode` de `fs.copyFile()`. |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v17.6.0, v16.15.0 | Acepta una opción `verbatimSymlinks` adicional para especificar si se debe realizar la resolución de ruta para los enlaces simbólicos. |
| v16.7.0 | Añadido en: v16.7.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) ruta de origen a copiar.
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) ruta de destino a la que copiar.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) desreferenciar enlaces simbólicos. **Predeterminado:** `false`.
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) cuando `force` es `false` y el destino existe, lanza un error. **Predeterminado:** `false`.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Función para filtrar archivos/directorios copiados. Devuelve `true` para copiar el elemento, `false` para ignorarlo. Al ignorar un directorio, también se omitirá todo su contenido. También puede devolver una `Promise` que se resuelva en `true` o `false` **Predeterminado:** `undefined`.
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ruta de origen a copiar.
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ruta de destino a la que copiar.
    - Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Un valor que se puede convertir a `boolean` o una `Promise` que se cumple con dicho valor.

    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) sobrescribe el archivo o directorio existente. La operación de copia ignorará los errores si establece esto en falso y el destino existe. Utilice la opción `errorOnExist` para cambiar este comportamiento. **Predeterminado:** `true`.
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) modificadores para la operación de copia. **Predeterminado:** `0`. Consulte la bandera `mode` de [`fs.copyFile()`](/es/nodejs/api/fs#fscopyfilesrc-dest-mode-callback).
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, se conservarán las marcas de tiempo de `src`. **Predeterminado:** `false`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) copiar directorios de forma recursiva **Predeterminado:** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, se omitirá la resolución de ruta para los enlaces simbólicos. **Predeterminado:** `false`

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Copia asíncronamente toda la estructura de directorios desde `src` a `dest`, incluidos los subdirectorios y archivos.

Al copiar un directorio a otro directorio, no se admiten globs y el comportamiento es similar a `cp dir1/ dir2/`.


### `fs.createReadStream(path[, options])` {#fscreatereadstreampath-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.10.0 | La opción `fs` no necesita el método `open` si se proporcionó un `fd`. |
| v16.10.0 | La opción `fs` no necesita el método `close` si `autoClose` es `false`. |
| v15.5.0 | Se agregó soporte para `AbortSignal`. |
| v15.4.0 | La opción `fd` acepta argumentos FileHandle. |
| v14.0.0 | Se cambió el valor predeterminado de `emitClose` a `true`. |
| v13.6.0, v12.17.0 | Las opciones `fs` permiten anular la implementación de `fs` utilizada. |
| v12.10.0 | Se habilitó la opción `emitClose`. |
| v11.0.0 | Se impusieron nuevas restricciones en `start` y `end`, lanzando errores más apropiados en los casos en que no podemos manejar razonablemente los valores de entrada. |
| v7.6.0 | El parámetro `path` puede ser un objeto WHATWG `URL` usando el protocolo `file:`. |
| v7.0.0 | El objeto `options` pasado nunca se modificará. |
| v2.3.0 | El objeto `options` pasado ahora puede ser una cadena. |
| v0.1.31 | Agregado en: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ver [soporte de `flags` del sistema de archivos](/es/nodejs/api/fs#file-system-flags). **Predeterminado:** `'r'`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `null`
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/es/nodejs/api/fs#class-filehandle) **Predeterminado:** `null`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0o666`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `64 * 1024`
    - `fs` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `null`
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `null`

- Devuelve: [\<fs.ReadStream\>](/es/nodejs/api/fs#class-fsreadstream)

`options` puede incluir valores de `start` y `end` para leer un rango de bytes del archivo en lugar de todo el archivo. Tanto `start` como `end` son inclusivos y comienzan a contar desde 0, los valores permitidos están en el rango [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. Si se especifica `fd` y se omite `start` o es `undefined`, `fs.createReadStream()` lee secuencialmente desde la posición actual del archivo. El `encoding` puede ser cualquiera de los aceptados por [\<Buffer\>](/es/nodejs/api/buffer#class-buffer).

Si se especifica `fd`, `ReadStream` ignorará el argumento `path` y usará el descriptor de archivo especificado. Esto significa que no se emitirá ningún evento `'open'`. `fd` debe ser bloqueante; los `fd` no bloqueantes deben pasarse a [\<net.Socket\>](/es/nodejs/api/net#class-netsocket).

Si `fd` apunta a un dispositivo de caracteres que solo admite lecturas bloqueantes (como un teclado o una tarjeta de sonido), las operaciones de lectura no finalizan hasta que haya datos disponibles. Esto puede evitar que el proceso salga y que la transmisión se cierre de forma natural.

De forma predeterminada, la transmisión emitirá un evento `'close'` después de haber sido destruida. Establezca la opción `emitClose` en `false` para cambiar este comportamiento.

Al proporcionar la opción `fs`, es posible anular las implementaciones de `fs` correspondientes para `open`, `read` y `close`. Al proporcionar la opción `fs`, se requiere una anulación para `read`. Si no se proporciona ningún `fd`, también se requiere una anulación para `open`. Si `autoClose` es `true`, también se requiere una anulación para `close`.

```js [ESM]
import { createReadStream } from 'node:fs';

// Crea una transmisión desde algún dispositivo de caracteres.
const stream = createReadStream('/dev/input/event0');
setTimeout(() => {
  stream.close(); // Esto puede no cerrar la transmisión.
  // Marcar artificialmente el final de la transmisión, como si el recurso subyacente hubiera
  // indicado el final del archivo por sí mismo, permite que la transmisión se cierre.
  // Esto no cancela las operaciones de lectura pendientes, y si hay tal
  // operación, es posible que el proceso aún no pueda salir correctamente
  // hasta que termine.
  stream.push(null);
  stream.read(0);
}, 100);
```
Si `autoClose` es falso, entonces el descriptor de archivo no se cerrará, incluso si hay un error. Es responsabilidad de la aplicación cerrarlo y asegurarse de que no haya fugas de descriptores de archivo. Si `autoClose` se establece en verdadero (comportamiento predeterminado), en `'error'` o `'end'` el descriptor de archivo se cerrará automáticamente.

`mode` establece el modo de archivo (permisos y bits adhesivos), pero solo si el archivo fue creado.

Un ejemplo para leer los últimos 10 bytes de un archivo que tiene 100 bytes de largo:

```js [ESM]
import { createReadStream } from 'node:fs';

createReadStream('sample.txt', { start: 90, end: 99 });
```
Si `options` es una cadena, entonces especifica la codificación.


### `fs.createWriteStream(path[, options])` {#fscreatewritestreampath-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.0.0, v20.10.0 | Ahora se admite la opción `flush`. |
| v16.10.0 | La opción `fs` no necesita el método `open` si se proporcionó un `fd`. |
| v16.10.0 | La opción `fs` no necesita el método `close` si `autoClose` es `false`. |
| v15.5.0 | Se agrega soporte para `AbortSignal`. |
| v15.4.0 | La opción `fd` acepta argumentos FileHandle. |
| v14.0.0 | Cambia el valor predeterminado de `emitClose` a `true`. |
| v13.6.0, v12.17.0 | Las opciones `fs` permiten anular la implementación `fs` utilizada. |
| v12.10.0 | Habilita la opción `emitClose`. |
| v7.6.0 | El parámetro `path` puede ser un objeto WHATWG `URL` que utilice el protocolo `file:`. |
| v7.0.0 | El objeto `options` pasado nunca se modificará. |
| v5.5.0 | Ahora se admite la opción `autoClose`. |
| v2.3.0 | El objeto `options` pasado ahora puede ser una cadena. |
| v0.1.31 | Agregado en: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Consulte [soporte de `flags` del sistema de archivos](/es/nodejs/api/fs#file-system-flags). **Predeterminado:** `'w'`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'utf8'`
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/es/nodejs/api/fs#class-filehandle) **Predeterminado:** `null`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0o666`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `fs` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `null`
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `null`
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `16384`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, el descriptor de archivo subyacente se vacía antes de cerrarlo. **Predeterminado:** `false`.


- Devuelve: [\<fs.WriteStream\>](/es/nodejs/api/fs#class-fswritestream)

`options` también puede incluir una opción `start` para permitir la escritura de datos en alguna posición posterior al inicio del archivo, los valores permitidos están en el rango [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. Modificar un archivo en lugar de reemplazarlo puede requerir que la opción `flags` se establezca en `r+` en lugar del valor predeterminado `w`. La `encoding` puede ser cualquiera de las aceptadas por [\<Buffer\>](/es/nodejs/api/buffer#class-buffer).

Si `autoClose` se establece en verdadero (comportamiento predeterminado) en `'error'` o `'finish'`, el descriptor de archivo se cerrará automáticamente. Si `autoClose` es falso, entonces el descriptor de archivo no se cerrará, incluso si hay un error. Es responsabilidad de la aplicación cerrarlo y asegurarse de que no haya una fuga de descriptores de archivo.

De forma predeterminada, la secuencia emitirá un evento `'close'` después de que se haya destruido. Establezca la opción `emitClose` en `false` para cambiar este comportamiento.

Al proporcionar la opción `fs`, es posible anular las implementaciones `fs` correspondientes para `open`, `write`, `writev` y `close`. Anular `write()` sin `writev()` puede reducir el rendimiento, ya que se deshabilitarán algunas optimizaciones (`_writev()`). Al proporcionar la opción `fs`, se requieren anulaciones para al menos uno de `write` y `writev`. Si no se proporciona la opción `fd`, también se requiere una anulación para `open`. Si `autoClose` es `true`, también se requiere una anulación para `close`.

Al igual que [\<fs.ReadStream\>](/es/nodejs/api/fs#class-fsreadstream), si se especifica `fd`, [\<fs.WriteStream\>](/es/nodejs/api/fs#class-fswritestream) ignorará el argumento `path` y utilizará el descriptor de archivo especificado. Esto significa que no se emitirá ningún evento `'open'`. `fd` debe ser de bloqueo; los `fd` no bloqueantes deben pasarse a [\<net.Socket\>](/es/nodejs/api/net#class-netsocket).

Si `options` es una cadena, entonces especifica la codificación.


### `fs.exists(path, callback)` {#fsexistspath-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v7.6.0 | El parámetro `path` puede ser un objeto `URL` WHATWG que use el protocolo `file:`. |
| v1.0.0 | Obsoleto desde: v1.0.0 |
| v0.0.2 | Añadido en: v0.0.2 |
:::

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Utilice [`fs.stat()`](/es/nodejs/api/fs#fsstatpath-options-callback) o [`fs.access()`](/es/nodejs/api/fs#fsaccesspath-mode-callback) en su lugar.
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `exists` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 

Comprueba si el elemento en la `path` dada existe o no comprobando con el sistema de archivos. Luego llama al argumento `callback` con verdadero o falso:

```js [ESM]
import { exists } from 'node:fs';

exists('/etc/passwd', (e) => {
  console.log(e ? 'existe' : '¡no existe passwd!');
});
```
**Los parámetros para esta función callback no son consistentes con otras funciones callback de Node.js.** Normalmente, el primer parámetro de una función callback de Node.js es un parámetro `err`, seguido opcionalmente de otros parámetros. La función callback `fs.exists()` solo tiene un parámetro booleano. Esta es una razón por la que se recomienda `fs.access()` en lugar de `fs.exists()`.

Si `path` es un enlace simbólico, se sigue. Por lo tanto, si `path` existe pero apunta a un elemento no existente, la función callback recibirá el valor `false`.

No se recomienda utilizar `fs.exists()` para comprobar la existencia de un archivo antes de llamar a `fs.open()`, `fs.readFile()` o `fs.writeFile()`. Hacerlo introduce una condición de carrera, ya que otros procesos pueden cambiar el estado del archivo entre las dos llamadas. En su lugar, el código del usuario debe abrir/leer/escribir el archivo directamente y manejar el error que se produce si el archivo no existe.

**escribir (NO RECOMENDADO)**

```js [ESM]
import { exists, open, close } from 'node:fs';

exists('myfile', (e) => {
  if (e) {
    console.error('myfile ya existe');
  } else {
    open('myfile', 'wx', (err, fd) => {
      if (err) throw err;

      try {
        writeMyData(fd);
      } finally {
        close(fd, (err) => {
          if (err) throw err;
        });
      }
    });
  }
});
```
**escribir (RECOMENDADO)**

```js [ESM]
import { open, close } from 'node:fs';
open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile ya existe');
      return;
    }

    throw err;
  }

  try {
    writeMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
**leer (NO RECOMENDADO)**

```js [ESM]
import { open, close, exists } from 'node:fs';

exists('myfile', (e) => {
  if (e) {
    open('myfile', 'r', (err, fd) => {
      if (err) throw err;

      try {
        readMyData(fd);
      } finally {
        close(fd, (err) => {
          if (err) throw err;
        });
      }
    });
  } else {
    console.error('myfile no existe');
  }
});
```
**leer (RECOMENDADO)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile no existe');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
Los ejemplos "no recomendados" anteriores comprueban la existencia y luego utilizan el archivo; los ejemplos "recomendados" son mejores porque utilizan el archivo directamente y manejan el error, si lo hay.

En general, compruebe la existencia de un archivo solo si el archivo no se utilizará directamente, por ejemplo, cuando su existencia sea una señal de otro proceso.


### `fs.fchmod(fd, mode, callback)` {#fsfchmodfd-mode-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo lanzará un `TypeError` en tiempo de ejecución. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con el ID DEP0013. |
| v0.4.7 | Agregado en: v0.4.7 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Establece los permisos en el archivo. No se dan argumentos a la devolución de llamada de finalización, aparte de una posible excepción.

Ver la documentación de POSIX [`fchmod(2)`](http://man7.org/linux/man-pages/man2/fchmod.2) para más detalles.

### `fs.fchown(fd, uid, gid, callback)` {#fsfchownfd-uid-gid-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo lanzará un `TypeError` en tiempo de ejecución. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con el ID DEP0013. |
| v0.4.7 | Agregado en: v0.4.7 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Establece el propietario del archivo. No se dan argumentos a la devolución de llamada de finalización, aparte de una posible excepción.

Ver la documentación de POSIX [`fchown(2)`](http://man7.org/linux/man-pages/man2/fchown.2) para más detalles.


### `fs.fdatasync(fd, callback)` {#fsfdatasyncfd-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo arrojará un `TypeError` en tiempo de ejecución. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con el ID DEP0013. |
| v0.1.96 | Añadido en: v0.1.96 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Fuerza que todas las operaciones de E/S actualmente en cola asociadas con el archivo pasen al estado de finalización de E/S sincronizada del sistema operativo. Consulte la documentación POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2) para obtener más detalles. No se proporcionan argumentos a la devolución de llamada de finalización, aparte de una posible excepción.

### `fs.fstat(fd[, options], callback)` {#fsfstatfd-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v10.5.0 | Acepta un objeto `options` adicional para especificar si los valores numéricos devueltos deben ser bigint. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo arrojará un `TypeError` en tiempo de ejecución. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con el ID DEP0013. |
| v0.1.95 | Añadido en: v0.1.95 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si los valores numéricos en el objeto [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) devuelto deben ser `bigint`. **Predeterminado:** `false`.

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats)

Invoca la devolución de llamada con el [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) para el descriptor de archivo.

Consulte la documentación POSIX [`fstat(2)`](http://man7.org/linux/man-pages/man2/fstat.2) para obtener más detalles.


### `fs.fsync(fd, callback)` {#fsfsyncfd-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una callback inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo lanzará un `TypeError` en tiempo de ejecución. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con ID DEP0013. |
| v0.1.96 | Añadido en: v0.1.96 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Solicita que todos los datos del descriptor de archivo abierto se vacíen al dispositivo de almacenamiento. La implementación específica depende del sistema operativo y del dispositivo. Consulte la documentación POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2) para obtener más detalles. No se proporcionan argumentos a la callback de finalización, aparte de una posible excepción.

### `fs.ftruncate(fd[, len], callback)` {#fsftruncatefd-len-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una callback inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo lanzará un `TypeError` en tiempo de ejecución. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con ID DEP0013. |
| v0.8.6 | Añadido en: v0.8.6 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Trunca el descriptor de archivo. No se proporcionan argumentos a la callback de finalización, aparte de una posible excepción.

Consulte la documentación POSIX [`ftruncate(2)`](http://man7.org/linux/man-pages/man2/ftruncate.2) para obtener más detalles.

Si el archivo al que se refiere el descriptor de archivo era mayor que `len` bytes, solo se conservarán los primeros `len` bytes en el archivo.

Por ejemplo, el siguiente programa conserva solo los primeros cuatro bytes del archivo:

```js [ESM]
import { open, close, ftruncate } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('temp.txt', 'r+', (err, fd) => {
  if (err) throw err;

  try {
    ftruncate(fd, 4, (err) => {
      closeFd(fd);
      if (err) throw err;
    });
  } catch (err) {
    closeFd(fd);
    if (err) throw err;
  }
});
```
Si el archivo era anteriormente más corto que `len` bytes, se extiende, y la parte extendida se rellena con bytes nulos (`'\0'`):

Si `len` es negativo, se utilizará `0`.


### `fs.futimes(fd, atime, mtime, callback)` {#fsfutimesfd-atime-mtime-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una callback inválida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo arrojará un `TypeError` en tiempo de ejecución. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con ID DEP0013. |
| v4.1.0 | Ahora se permiten cadenas numéricas, `NaN` e `Infinity` como especificadores de tiempo. |
| v0.4.2 | Añadido en: v0.4.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Cambia las marcas de tiempo del sistema de archivos del objeto al que hace referencia el descriptor de archivo proporcionado. Véase [`fs.utimes()`](/es/nodejs/api/fs#fsutimespath-atime-mtime-callback).

### `fs.glob(pattern[, options], callback)` {#fsglobpattern-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.2.0 | Añadido soporte para `withFileTypes` como una opción. |
| v22.0.0 | Añadido en: v22.0.0 |
:::

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) directorio de trabajo actual. **Predeterminado:** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Función para filtrar archivos/directorios. Devolver `true` para excluir el elemento, `false` para incluirlo. **Predeterminado:** `undefined`.
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si el glob debe devolver las rutas como Dirents, `false` en caso contrario. **Predeterminado:** `false`.

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

- Recupera los archivos que coinciden con el patrón especificado.

::: code-group
```js [ESM]
import { glob } from 'node:fs';

glob('**/*.js', (err, matches) => {
  if (err) throw err;
  console.log(matches);
});
```

```js [CJS]
const { glob } = require('node:fs');

glob('**/*.js', (err, matches) => {
  if (err) throw err;
  console.log(matches);
});
```
:::


### `fs.lchmod(path, mode, callback)` {#fslchmodpath-mode-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una función callback no válida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v16.0.0 | El error devuelto puede ser un `AggregateError` si se devuelve más de un error. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo arrojará un `TypeError` en tiempo de ejecución. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con el ID DEP0013. |
| v0.4.7 | Obsoleto desde: v0.4.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)

Cambia los permisos en un enlace simbólico. No se dan argumentos a la función callback de finalización, aparte de una posible excepción.

Este método solo se implementa en macOS.

Consulte la documentación de POSIX [`lchmod(2)`](https://www.freebsd.org/cgi/man.cgi?query=lchmod&sektion=2) para obtener más detalles.

### `fs.lchown(path, uid, gid, callback)` {#fslchownpath-uid-gid-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una función callback no válida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v10.6.0 | Esta API ya no está obsoleta. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo arrojará un `TypeError` en tiempo de ejecución. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con el ID DEP0013. |
| v0.4.7 | Obsolescencia solo de documentación. |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Establece el propietario del enlace simbólico. No se dan argumentos a la función callback de finalización, aparte de una posible excepción.

Consulte la documentación de POSIX [`lchown(2)`](http://man7.org/linux/man-pages/man2/lchown.2) para obtener más detalles.


### `fs.lutimes(path, atime, mtime, callback)` {#fslutimespath-atime-mtime-callback}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una función callback inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v14.5.0, v12.19.0 | Añadido en: v14.5.0, v12.19.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Cambia los tiempos de acceso y modificación de un archivo de la misma manera que [`fs.utimes()`](/es/nodejs/api/fs#fsutimespath-atime-mtime-callback), con la diferencia de que si la ruta se refiere a un enlace simbólico, entonces el enlace no se desreferencia: en cambio, se cambian las marcas de tiempo del propio enlace simbólico.

No se dan argumentos aparte de una posible excepción a la función callback de finalización.

### `fs.link(existingPath, newPath, callback)` {#fslinkexistingpath-newpath-callback}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una función callback inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo lanzará un `TypeError` en tiempo de ejecución. |
| v7.6.0 | Los parámetros `existingPath` y `newPath` pueden ser objetos WHATWG `URL` usando el protocolo `file:`. El soporte es actualmente *experimental*. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con ID DEP0013. |
| v0.1.31 | Añadido en: v0.1.31 |
:::

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Crea un nuevo enlace desde `existingPath` a `newPath`. Vea la documentación POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) para más detalles. No se dan argumentos aparte de una posible excepción a la función callback de finalización.


### `fs.lstat(path[, options], callback)` {#fslstatpath-options-callback}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una callback inválida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v10.5.0 | Acepta un objeto `options` adicional para especificar si los valores numéricos devueltos deben ser bigint. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo arrojará un `TypeError` en tiempo de ejecución. |
| v7.6.0 | El parámetro `path` puede ser un objeto WHATWG `URL` usando el protocolo `file:`. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con el id DEP0013. |
| v0.1.30 | Añadido en: v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si los valores numéricos en el objeto [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) devuelto deben ser `bigint`. **Predeterminado:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats)
  
 

Recupera el [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) para el enlace simbólico al que se refiere la ruta. La callback obtiene dos argumentos `(err, stats)` donde `stats` es un objeto [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats). `lstat()` es idéntico a `stat()`, excepto que si `path` es un enlace simbólico, entonces el enlace en sí mismo es stat-ed, no el archivo al que se refiere.

Consulte la documentación POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) para obtener más detalles.


### `fs.mkdir(path[, options], callback)` {#fsmkdirpath-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una función de retorno no válida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v13.11.0, v12.17.0 | En el modo `recursive`, la función de retorno ahora recibe la primera ruta creada como argumento. |
| v10.12.0 | El segundo argumento ahora puede ser un objeto `options` con propiedades `recursive` y `mode`. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo lanzará un `TypeError` en tiempo de ejecución. |
| v7.6.0 | El parámetro `path` puede ser un objeto WHATWG `URL` usando el protocolo `file:`. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con el ID DEP0013. |
| v0.1.8 | Añadido en: v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) No soportado en Windows. **Predeterminado:** `0o777`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Presente solo si se crea un directorio con `recursive` establecido en `true`.



Crea un directorio de forma asíncrona.

La función de retorno recibe una posible excepción y, si `recursive` es `true`, la primera ruta de directorio creada, `(err[, path])`. `path` aún puede ser `undefined` cuando `recursive` es `true`, si no se creó ningún directorio (por ejemplo, si se creó previamente).

El argumento opcional `options` puede ser un entero que especifique `mode` (bits de permiso y sticky), o un objeto con una propiedad `mode` y una propiedad `recursive` que indique si se deben crear los directorios padre. Llamar a `fs.mkdir()` cuando `path` es un directorio que existe resulta en un error solo cuando `recursive` es falso. Si `recursive` es falso y el directorio existe, se produce un error `EEXIST`.

```js [ESM]
import { mkdir } from 'node:fs';

// Crea ./tmp/a/apple, independientemente de si existen ./tmp y ./tmp/a.
mkdir('./tmp/a/apple', { recursive: true }, (err) => {
  if (err) throw err;
});
```
En Windows, usar `fs.mkdir()` en el directorio raíz, incluso con recursión, resultará en un error:

```js [ESM]
import { mkdir } from 'node:fs';

mkdir('/', { recursive: true }, (err) => {
  // => [Error: EPERM: operation not permitted, mkdir 'C:\']
});
```
Consulte la documentación POSIX [`mkdir(2)`](http://man7.org/linux/man-pages/man2/mkdir.2) para obtener más detalles.


### `fs.mkdtemp(prefix[, options], callback)` {#fsmkdtempprefix-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.6.0, v18.19.0 | El parámetro `prefix` ahora acepta buffers y URL. |
| v18.0.0 | Pasar una callback no válida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v16.5.0, v14.18.0 | El parámetro `prefix` ahora acepta una cadena vacía. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo lanzará un `TypeError` en tiempo de ejecución. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con id DEP0013. |
| v6.2.1 | El parámetro `callback` ahora es opcional. |
| v5.10.0 | Añadido en: v5.10.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'utf8'`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

Crea un directorio temporal único.

Genera seis caracteres aleatorios para ser añadidos detrás de un `prefix` requerido para crear un directorio temporal único. Debido a inconsistencias de la plataforma, evite los caracteres `X` finales en `prefix`. Algunas plataformas, en particular los BSD, pueden devolver más de seis caracteres aleatorios y reemplazar los caracteres `X` finales en `prefix` con caracteres aleatorios.

La ruta del directorio creado se pasa como una cadena al segundo parámetro de la callback.

El argumento opcional `options` puede ser una cadena que especifique una codificación, o un objeto con una propiedad `encoding` que especifique la codificación de caracteres a utilizar.

```js [ESM]
import { mkdtemp } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

mkdtemp(join(tmpdir(), 'foo-'), (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Imprime: /tmp/foo-itXde2 o C:\Users\...\AppData\Local\Temp\foo-itXde2
});
```
El método `fs.mkdtemp()` añadirá los seis caracteres seleccionados aleatoriamente directamente a la cadena `prefix`. Por ejemplo, dado un directorio `/tmp`, si la intención es crear un directorio temporal *dentro* de `/tmp`, el `prefix` debe terminar con un separador de ruta específico de la plataforma (`require('node:path').sep`).

```js [ESM]
import { tmpdir } from 'node:os';
import { mkdtemp } from 'node:fs';

// El directorio padre para el nuevo directorio temporal
const tmpDir = tmpdir();

// Este método es *INCORRECTO*:
mkdtemp(tmpDir, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Imprimirá algo similar a `/tmpabc123`.
  // Un nuevo directorio temporal se crea en la raíz del sistema de archivos
  // en lugar de *dentro* del directorio /tmp.
});

// Este método es *CORRECTO*:
import { sep } from 'node:path';
mkdtemp(`${tmpDir}${sep}`, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Imprimirá algo similar a `/tmp/abc123`.
  // Un nuevo directorio temporal se crea dentro
  // del directorio /tmp.
});
```

### `fs.open(path[, flags[, mode]], callback)` {#fsopenpath-flags-mode-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar un callback inválido al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v11.1.0 | El argumento `flags` ahora es opcional y por defecto es `'r'`. |
| v9.9.0 | Los flags `as` y `as+` ahora son compatibles. |
| v7.6.0 | El parámetro `path` puede ser un objeto WHATWG `URL` usando el protocolo `file:`. |
| v0.0.2 | Agregado en: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ver [soporte de `flags` del sistema de archivos](/es/nodejs/api/fs#file-system-flags). **Predeterminado:** `'r'`.
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0o666` (lectura y escritura)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Apertura de archivo asíncrona. Consulte la documentación POSIX [`open(2)`](http://man7.org/linux/man-pages/man2/open.2) para obtener más detalles.

`mode` establece el modo de archivo (permiso y bits adhesivos), pero solo si se creó el archivo. En Windows, solo se puede manipular el permiso de escritura; consulte [`fs.chmod()`](/es/nodejs/api/fs#fschmodpath-mode-callback).

El callback recibe dos argumentos `(err, fd)`.

Algunos caracteres (`\< \> : " / \ | ? *`) están reservados en Windows como se documenta en [Nombrar archivos, rutas y espacios de nombres](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file). En NTFS, si el nombre de archivo contiene dos puntos, Node.js abrirá una secuencia del sistema de archivos, como se describe en [esta página de MSDN](https://docs.microsoft.com/en-us/windows/desktop/FileIO/using-streams).

Las funciones basadas en `fs.open()` también exhiben este comportamiento: `fs.writeFile()`, `fs.readFile()`, etc.


### `fs.openAsBlob(path[, options])` {#fsopenasblobpath-options}

**Agregado en: v19.8.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/es/nodejs/api/documentation#stability-index) [Estable: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un tipo MIME opcional para el blob.


- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se completa con un [\<Blob\>](/es/nodejs/api/buffer#class-blob) al tener éxito.

Devuelve un [\<Blob\>](/es/nodejs/api/buffer#class-blob) cuyos datos están respaldados por el archivo dado.

El archivo no debe modificarse después de que se cree el [\<Blob\>](/es/nodejs/api/buffer#class-blob). Cualquier modificación hará que la lectura de los datos de [\<Blob\>](/es/nodejs/api/buffer#class-blob) falle con un error `DOMException`. Operaciones de estado sincrónicas en el archivo cuando se crea el `Blob` y antes de cada lectura para detectar si los datos del archivo se han modificado en el disco.



::: code-group
```js [ESM]
import { openAsBlob } from 'node:fs';

const blob = await openAsBlob('the.file.txt');
const ab = await blob.arrayBuffer();
blob.stream();
```

```js [CJS]
const { openAsBlob } = require('node:fs');

(async () => {
  const blob = await openAsBlob('the.file.txt');
  const ab = await blob.arrayBuffer();
  blob.stream();
})();
```
:::

### `fs.opendir(path[, options], callback)` {#fsopendirpath-options-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.1.0, v18.17.0 | Se agregó la opción `recursive`. |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v13.1.0, v12.16.0 | Se introdujo la opción `bufferSize`. |
| v12.12.0 | Agregado en: v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de entradas de directorio que se almacenan en búfer internamente al leer del directorio. Los valores más altos conducen a un mejor rendimiento pero a un mayor uso de la memoria. **Predeterminado:** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `false`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `dir` [\<fs.Dir\>](/es/nodejs/api/fs#class-fsdir)



Abre un directorio de forma asíncrona. Consulte la documentación de POSIX [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3) para obtener más detalles.

Crea un [\<fs.Dir\>](/es/nodejs/api/fs#class-fsdir), que contiene todas las funciones adicionales para leer y limpiar el directorio.

La opción `encoding` establece la codificación para la `path` al abrir el directorio y las operaciones de lectura posteriores.


### `fs.read(fd, buffer, offset, length, position, callback)` {#fsreadfd-buffer-offset-length-position-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una callback inválida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v10.10.0 | El parámetro `buffer` ahora puede ser cualquier `TypedArray`, o un `DataView`. |
| v7.4.0 | El parámetro `buffer` ahora puede ser un `Uint8Array`. |
| v6.0.0 | El parámetro `length` ahora puede ser `0`. |
| v0.0.2 | Añadido en: v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) El buffer en el que se escribirán los datos.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La posición en `buffer` para escribir los datos.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes a leer.
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Especifica dónde empezar a leer en el archivo. Si `position` es `null` o `-1`, los datos se leerán desde la posición actual del archivo y la posición del archivo se actualizará. Si `position` es un entero no negativo, la posición del archivo no se modificará.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Lee datos del archivo especificado por `fd`.

La callback recibe los tres argumentos, `(err, bytesRead, buffer)`.

Si el archivo no se modifica concurrentemente, se alcanza el final del archivo cuando el número de bytes leídos es cero.

Si este método se invoca como su versión [`util.promisify()`](/es/nodejs/api/util#utilpromisifyoriginal)ed, devuelve una promesa para un `Object` con las propiedades `bytesRead` y `buffer`.

El método `fs.read()` lee datos del archivo especificado por el descriptor de archivo (`fd`). El argumento `length` indica el número máximo de bytes que Node.js intentará leer del kernel. Sin embargo, el número real de bytes leídos (`bytesRead`) puede ser menor que el `length` especificado por varias razones.

Por ejemplo:

- Si el archivo es más corto que el `length` especificado, `bytesRead` se establecerá en el número real de bytes leídos.
- Si el archivo encuentra EOF (Fin de Archivo) antes de que se pueda llenar el buffer, Node.js leerá todos los bytes disponibles hasta que se encuentre EOF, y el parámetro `bytesRead` en la callback indicará el número real de bytes leídos, que puede ser menor que el `length` especificado.
- Si el archivo está en un `filesystem` de red lento o encuentra algún otro problema durante la lectura, `bytesRead` puede ser menor que el `length` especificado.

Por lo tanto, cuando se utiliza `fs.read()`, es importante comprobar el valor de `bytesRead` para determinar cuántos bytes se han leído realmente del archivo. Dependiendo de la lógica de su aplicación, es posible que tenga que manejar los casos en los que `bytesRead` es menor que el `length` especificado, por ejemplo, envolviendo la llamada de lectura en un bucle si necesita una cantidad mínima de bytes.

Este comportamiento es similar a la función POSIX `preadv2`.


### `fs.read(fd[, options], callback)` {#fsreadfd-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.11.0, v12.17.0 | Se puede pasar un objeto de opciones para que el buffer, el offset, la longitud y la posición sean opcionales. |
| v13.11.0, v12.17.0 | Añadido en: v13.11.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) **Predeterminado:** `Buffer.alloc(16384)`
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `null`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)
  
 

Similar a la función [`fs.read()`](/es/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback), esta versión toma un objeto `options` opcional. Si no se especifica ningún objeto `options`, tomará por defecto los valores anteriores.


### `fs.read(fd, buffer[, options], callback)` {#fsreadfd-buffer-options-callback}

**Agregado en: v18.2.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) El búfer en el que se escribirán los datos.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) **Predeterminado:** `null`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)



Similar a la función [`fs.read()`](/es/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback), esta versión toma un objeto `options` opcional. Si no se especifica ningún objeto `options`, tomará por defecto los valores anteriores.

### `fs.readdir(path[, options], callback)` {#fsreaddirpath-options-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.1.0, v18.17.0 | Se agregó la opción `recursive`. |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v10.10.0 | Se agregó la nueva opción `withFileTypes`. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo lanzará un `TypeError` en tiempo de ejecución. |
| v7.6.0 | El parámetro `path` puede ser un objeto WHATWG `URL` utilizando el protocolo `file:`. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con id DEP0013. |
| v6.0.0 | Se agregó el parámetro `options`. |
| v0.1.8 | Agregado en: v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, lee el contenido de un directorio de forma recursiva. En modo recursivo, listará todos los archivos, subarchivos y directorios. **Predeterminado:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `files` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/es/nodejs/api/buffer#class-buffer) | [\<fs.Dirent[]\>](/es/nodejs/api/fs#class-fsdirent)



Lee el contenido de un directorio. La devolución de llamada obtiene dos argumentos `(err, files)` donde `files` es un array de los nombres de los archivos en el directorio excluyendo `'.'` y `'..'`.

Consulte la documentación POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) para obtener más detalles.

El argumento opcional `options` puede ser una cadena que especifique una codificación, o un objeto con una propiedad `encoding` que especifique la codificación de caracteres que se utilizará para los nombres de archivo pasados a la devolución de llamada. Si `encoding` se establece en `'buffer'`, los nombres de archivo devueltos se pasarán como objetos [\<Buffer\>](/es/nodejs/api/buffer#class-buffer).

Si `options.withFileTypes` se establece en `true`, el array `files` contendrá objetos [\<fs.Dirent\>](/es/nodejs/api/fs#class-fsdirent).


### `fs.readFile(path[, options], callback)` {#fsreadfilepath-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una retrollamada inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v16.0.0 | El error devuelto puede ser un `AggregateError` si se devuelve más de un error. |
| v15.2.0, v14.17.0 | El argumento options puede incluir una AbortSignal para abortar una solicitud readFile en curso. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo lanzará un `TypeError` en tiempo de ejecución. |
| v7.6.0 | El parámetro `path` puede ser un objeto WHATWG `URL` que use el protocolo `file:`. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con ID DEP0013. |
| v5.1.0 | Siempre se llamará a `callback` con `null` como el parámetro `error` en caso de éxito. |
| v5.0.0 | El parámetro `path` ahora puede ser un descriptor de archivo. |
| v0.1.29 | Añadido en: v0.1.29 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nombre de archivo o descriptor de archivo
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Consulte [soporte de `flags` del sistema de archivos](/es/nodejs/api/fs#file-system-flags). **Predeterminado:** `'r'`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) permite abortar un readFile en curso

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
    - `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Lee de forma asíncrona el contenido completo de un archivo.

```js [ESM]
import { readFile } from 'node:fs';

readFile('/etc/passwd', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```
A la retrollamada se le pasan dos argumentos `(err, data)`, donde `data` es el contenido del archivo.

Si no se especifica ninguna codificación, se devuelve el búfer sin procesar.

Si `options` es una cadena, especifica la codificación:

```js [ESM]
import { readFile } from 'node:fs';

readFile('/etc/passwd', 'utf8', callback);
```
Cuando la ruta es un directorio, el comportamiento de `fs.readFile()` y [`fs.readFileSync()`](/es/nodejs/api/fs#fsreadfilesyncpath-options) es específico de la plataforma. En macOS, Linux y Windows, se devolverá un error. En FreeBSD, se devolverá una representación del contenido del directorio.

```js [ESM]
import { readFile } from 'node:fs';

// macOS, Linux y Windows
readFile('<directory>', (err, data) => {
  // => [Error: EISDIR: illegal operation on a directory, read <directory>]
});

// FreeBSD
readFile('<directory>', (err, data) => {
  // => null, <data>
});
```
Es posible abortar una solicitud en curso utilizando una `AbortSignal`. Si una solicitud se aborta, se llama a la retrollamada con un `AbortError`:

```js [ESM]
import { readFile } from 'node:fs';

const controller = new AbortController();
const signal = controller.signal;
readFile(fileInfo[0].name, { signal }, (err, buf) => {
  // ...
});
// When you want to abort the request
controller.abort();
```
La función `fs.readFile()` almacena en búfer todo el archivo. Para minimizar los costos de memoria, cuando sea posible, prefiera la transmisión a través de `fs.createReadStream()`.

Abortar una solicitud en curso no aborta las solicitudes individuales del sistema operativo, sino el almacenamiento en búfer interno que realiza `fs.readFile`.


#### Descriptores de archivo {#file-descriptors}

#### Consideraciones de rendimiento {#performance-considerations}

El método `fs.readFile()` lee de forma asíncrona el contenido de un archivo en la memoria, de un fragmento a la vez, lo que permite que el bucle de eventos gire entre cada fragmento. Esto permite que la operación de lectura tenga menos impacto en otra actividad que pueda estar utilizando el grupo de hilos subyacente de libuv, pero significa que tardará más en leer un archivo completo en la memoria.

La sobrecarga de lectura adicional puede variar ampliamente en diferentes sistemas y depende del tipo de archivo que se esté leyendo. Si el tipo de archivo no es un archivo regular (una tubería, por ejemplo) y Node.js no puede determinar un tamaño de archivo real, cada operación de lectura cargará 64 KiB de datos. Para archivos regulares, cada lectura procesará 512 KiB de datos.

Para las aplicaciones que requieren una lectura lo más rápida posible del contenido del archivo, es mejor usar `fs.read()` directamente y que el código de la aplicación administre la lectura del contenido completo del archivo.

El problema de Node.js en GitHub [#25741](https://github.com/nodejs/node/issues/25741) proporciona más información y un análisis detallado sobre el rendimiento de `fs.readFile()` para múltiples tamaños de archivo en diferentes versiones de Node.js.

### `fs.readlink(path[, options], callback)` {#fsreadlinkpath-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo lanzará un `TypeError` en tiempo de ejecución. |
| v7.6.0 | El parámetro `path` puede ser un objeto WHATWG `URL` que usa el protocolo `file:`. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con el id DEP0013. |
| v0.1.31 | Añadido en: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'utf8'`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `linkString` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)



Lee el contenido del enlace simbólico al que se refiere `path`. La devolución de llamada obtiene dos argumentos `(err, linkString)`.

Consulte la documentación de POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2) para obtener más detalles.

El argumento opcional `options` puede ser una cadena que especifique una codificación, o un objeto con una propiedad `encoding` que especifique la codificación de caracteres que se utilizará para la ruta del enlace que se pasa a la devolución de llamada. Si la `encoding` se establece en `'buffer'`, la ruta del enlace devuelta se pasará como un objeto [\<Buffer\>](/es/nodejs/api/buffer#class-buffer).


### `fs.readv(fd, buffers[, position], callback)` {#fsreadvfd-buffers-position-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v13.13.0, v12.17.0 | Añadido en: v13.13.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
  
 

Lee de un archivo especificado por `fd` y escribe en un arreglo de `ArrayBufferView`s usando `readv()`.

`position` es el desplazamiento desde el inicio del archivo desde donde se deben leer los datos. Si `typeof position !== 'number'`, los datos se leerán desde la posición actual.

La devolución de llamada recibirá tres argumentos: `err`, `bytesRead` y `buffers`. `bytesRead` es cuántos bytes se leyeron del archivo.

Si este método se invoca como su versión [`util.promisify()`](/es/nodejs/api/util#utilpromisifyoriginal)ed, devuelve una promesa para un `Object` con las propiedades `bytesRead` y `buffers`.

### `fs.realpath(path[, options], callback)` {#fsrealpathpath-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo lanzará un `TypeError` en tiempo de ejecución. |
| v8.0.0 | Se agregó soporte para resolución de Pipe/Socket. |
| v7.6.0 | El parámetro `path` puede ser un objeto WHATWG `URL` usando el protocolo `file:`. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con el id DEP0013. |
| v6.4.0 | Llamar a `realpath` ahora funciona nuevamente para varios casos extremos en Windows. |
| v6.0.0 | Se eliminó el parámetro `cache`. |
| v0.1.31 | Añadido en: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'utf8'`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `resolvedPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)
  
 

Calcula de forma asíncrona el nombre de ruta canónico resolviendo `.`, `..` y enlaces simbólicos.

Un nombre de ruta canónico no es necesariamente único. Los enlaces duros y los montajes de enlace pueden exponer una entidad del sistema de archivos a través de muchos nombres de ruta.

Esta función se comporta como [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3), con algunas excepciones:

La `callback` obtiene dos argumentos `(err, resolvedPath)`. Puede usar `process.cwd` para resolver rutas relativas.

Solo se admiten las rutas que se pueden convertir a cadenas UTF8.

El argumento opcional `options` puede ser una cadena que especifique una codificación, o un objeto con una propiedad `encoding` que especifique la codificación de caracteres que se utilizará para la ruta pasada a la devolución de llamada. Si la `encoding` se establece en `'buffer'`, la ruta devuelta se pasará como un objeto [\<Buffer\>](/es/nodejs/api/buffer#class-buffer).

Si `path` se resuelve en un socket o una tubería, la función devolverá un nombre dependiente del sistema para ese objeto.

Una ruta que no existe da como resultado un error ENOENT. `error.path` es la ruta de archivo absoluta.


### `fs.realpath.native(path[, options], callback)` {#fsrealpathnativepath-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una función de retorno no válida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v9.2.0 | Añadido en: v9.2.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'utf8'`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `resolvedPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)
  
 

[`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3) asíncrono.

La `callback` (función de retorno) recibe dos argumentos `(err, resolvedPath)`.

Solo se admiten las rutas que se pueden convertir a cadenas UTF8.

El argumento opcional `options` puede ser una cadena que especifique una codificación, o un objeto con una propiedad `encoding` que especifique la codificación de caracteres que se utilizará para la ruta pasada a la función de retorno. Si `encoding` se establece en `'buffer'`, la ruta devuelta se pasará como un objeto [\<Buffer\>](/es/nodejs/api/buffer#class-buffer).

En Linux, cuando Node.js está vinculado a musl libc, el sistema de archivos procfs debe estar montado en `/proc` para que esta función funcione. Glibc no tiene esta restricción.

### `fs.rename(oldPath, newPath, callback)` {#fsrenameoldpath-newpath-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una función de retorno no válida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo lanzará un `TypeError` en tiempo de ejecución. |
| v7.6.0 | Los parámetros `oldPath` y `newPath` pueden ser objetos `URL` de WHATWG que utilicen el protocolo `file:`. Actualmente, la compatibilidad sigue siendo *experimental*. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con el ID DEP0013. |
| v0.0.2 | Añadido en: v0.0.2 |
:::

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Renombra asíncronamente el archivo en `oldPath` a la ruta proporcionada como `newPath`. En el caso de que `newPath` ya exista, se sobrescribirá. Si hay un directorio en `newPath`, se generará un error en su lugar. No se dan argumentos aparte de una posible excepción a la función de retorno de finalización.

Ver también: [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2).

```js [ESM]
import { rename } from 'node:fs';

rename('oldFile.txt', 'newFile.txt', (err) => {
  if (err) throw err;
  console.log('Rename complete!');
});
```

### `fs.rmdir(path[, options], callback)` {#fsrmdirpath-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v16.0.0 | Ya no se permite usar `fs.rmdir(path, { recursive: true })` en un `path` que sea un archivo y resulta en un error `ENOENT` en Windows y un error `ENOTDIR` en POSIX. |
| v16.0.0 | Ya no se permite usar `fs.rmdir(path, { recursive: true })` en un `path` que no existe y resulta en un error `ENOENT`. |
| v16.0.0 | La opción `recursive` está obsoleta, usarla activa una advertencia de obsolescencia. |
| v14.14.0 | La opción `recursive` está obsoleta, use `fs.rm` en su lugar. |
| v13.3.0, v12.16.0 | La opción `maxBusyTries` se ha renombrado a `maxRetries`, y su valor por defecto es 0. La opción `emfileWait` se ha eliminado, y los errores `EMFILE` usan la misma lógica de reintento que otros errores. Ahora se admite la opción `retryDelay`. Ahora se reintentan los errores `ENFILE`. |
| v12.10.0 | Ahora se admiten las opciones `recursive`, `maxBusyTries` y `emfileWait`. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo lanzará un `TypeError` en tiempo de ejecución. |
| v7.6.0 | Los parámetros `path` pueden ser un objeto WHATWG `URL` que utilice el protocolo `file:`. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con el id DEP0013. |
| v0.0.2 | Añadido en: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si se encuentra un error `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` o `EPERM`, Node.js reintenta la operación con una espera de retroceso lineal de `retryDelay` milisegundos más larga en cada intento. Esta opción representa el número de reintentos. Esta opción se ignora si la opción `recursive` no es `true`. **Predeterminado:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, realiza una eliminación recursiva del directorio. En el modo recursivo, las operaciones se reintentan en caso de fallo. **Predeterminado:** `false`. **Obsoleto.**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La cantidad de tiempo en milisegundos que se debe esperar entre reintentos. Esta opción se ignora si la opción `recursive` no es `true`. **Predeterminado:** `100`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

[`rmdir(2)`](http://man7.org/linux/man-pages/man2/rmdir.2) asíncrono. No se dan argumentos a la devolución de llamada de finalización, aparte de una posible excepción.

El uso de `fs.rmdir()` en un archivo (no un directorio) resulta en un error `ENOENT` en Windows y un error `ENOTDIR` en POSIX.

Para obtener un comportamiento similar al comando Unix `rm -rf`, use [`fs.rm()`](/es/nodejs/api/fs#fsrmpath-options-callback) con las opciones `{ recursive: true, force: true }`.


### `fs.rm(path[, options], callback)` {#fsrmpath-options-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.3.0, v16.14.0 | El parámetro `path` puede ser un objeto WHATWG `URL` utilizando el protocolo `file:`. |
| v14.14.0 | Añadido en: v14.14.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, las excepciones serán ignoradas si `path` no existe. **Predeterminado:** `false`.
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si se encuentra un error `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` o `EPERM`, Node.js reintentará la operación con una espera de retroceso lineal de `retryDelay` milisegundos más larga en cada intento. Esta opción representa el número de reintentos. Esta opción se ignora si la opción `recursive` no es `true`. **Predeterminado:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, realiza una eliminación recursiva. En el modo recursivo, las operaciones se reintentan en caso de fallo. **Predeterminado:** `false`.
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La cantidad de tiempo en milisegundos que se espera entre reintentos. Esta opción se ignora si la opción `recursive` no es `true`. **Predeterminado:** `100`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Elimina asíncronamente archivos y directorios (siguiendo el modelo de la utilidad estándar POSIX `rm`). No se dan argumentos aparte de una posible excepción a la callback de finalización.


### `fs.stat(path[, options], callback)` {#fsstatpath-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una función callback no válida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v10.5.0 | Acepta un objeto `options` adicional para especificar si los valores numéricos devueltos deben ser bigint. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo lanzará un `TypeError` en tiempo de ejecución. |
| v7.6.0 | El parámetro `path` puede ser un objeto WHATWG `URL` usando el protocolo `file:`. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con id DEP0013. |
| v0.0.2 | Añadido en: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si los valores numéricos en el objeto [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) devuelto deben ser `bigint`. **Predeterminado:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats)



[`stat(2)`](http://man7.org/linux/man-pages/man2/stat.2) asíncrono. La función callback obtiene dos argumentos `(err, stats)` donde `stats` es un objeto [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats).

En caso de error, el `err.code` será uno de [Errores Comunes del Sistema](/es/nodejs/api/errors#common-system-errors).

[`fs.stat()`](/es/nodejs/api/fs#fsstatpath-options-callback) sigue los enlaces simbólicos. Use [`fs.lstat()`](/es/nodejs/api/fs#fslstatpath-options-callback) para observar los propios enlaces.

No se recomienda usar `fs.stat()` para comprobar la existencia de un archivo antes de llamar a `fs.open()`, `fs.readFile()` o `fs.writeFile()`. En su lugar, el código de usuario debe abrir/leer/escribir el archivo directamente y manejar el error que se produzca si el archivo no está disponible.

Para comprobar si un archivo existe sin manipularlo posteriormente, se recomienda [`fs.access()`](/es/nodejs/api/fs#fsaccesspath-mode-callback).

Por ejemplo, dada la siguiente estructura de directorios:

```text [TEXT]
- txtDir
-- file.txt
- app.js
```
El siguiente programa comprobará las estadísticas de las rutas dadas:

```js [ESM]
import { stat } from 'node:fs';

const pathsToCheck = ['./txtDir', './txtDir/file.txt'];

for (let i = 0; i < pathsToCheck.length; i++) {
  stat(pathsToCheck[i], (err, stats) => {
    console.log(stats.isDirectory());
    console.log(stats);
  });
}
```
La salida resultante se parecerá a:

```bash [BASH]
true
Stats {
  dev: 16777220,
  mode: 16877,
  nlink: 3,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214262,
  size: 96,
  blocks: 0,
  atimeMs: 1561174653071.963,
  mtimeMs: 1561174614583.3518,
  ctimeMs: 1561174626623.5366,
  birthtimeMs: 1561174126937.2893,
  atime: 2019-06-22T03:37:33.072Z,
  mtime: 2019-06-22T03:36:54.583Z,
  ctime: 2019-06-22T03:37:06.624Z,
  birthtime: 2019-06-22T03:28:46.937Z
}
false
Stats {
  dev: 16777220,
  mode: 33188,
  nlink: 1,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214074,
  size: 8,
  blocks: 8,
  atimeMs: 1561174616618.8555,
  mtimeMs: 1561174614584,
  ctimeMs: 1561174614583.8145,
  birthtimeMs: 1561174007710.7478,
  atime: 2019-06-22T03:36:56.619Z,
  mtime: 2019-06-22T03:36:54.584Z,
  ctime: 2019-06-22T03:36:54.584Z,
  birthtime: 2019-06-22T03:26:47.711Z
}
```

### `fs.statfs(path[, options], callback)` {#fsstatfspath-options-callback}

**Añadido en: v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si los valores numéricos en el objeto [\<fs.StatFs\>](/es/nodejs/api/fs#class-fsstatfs) devuelto deberían ser `bigint`. **Predeterminado:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.StatFs\>](/es/nodejs/api/fs#class-fsstatfs)
  
 

[`statfs(2)`](http://man7.org/linux/man-pages/man2/statfs.2) asíncrono. Devuelve información sobre el sistema de archivos montado que contiene `path`. El callback recibe dos argumentos `(err, stats)` donde `stats` es un objeto [\<fs.StatFs\>](/es/nodejs/api/fs#class-fsstatfs).

En caso de error, el `err.code` será uno de [Errores comunes del sistema](/es/nodejs/api/errors#common-system-errors).

### `fs.symlink(target, path[, type], callback)` {#fssymlinktarget-path-type-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar un callback no válido al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v12.0.0 | Si el argumento `type` se deja sin definir, Node detectará automáticamente el tipo `target` y seleccionará automáticamente `dir` o `file`. |
| v7.6.0 | Los parámetros `target` y `path` pueden ser objetos WHATWG `URL` usando el protocolo `file:`. El soporte es actualmente *experimental*. |
| v0.1.31 | Añadido en: v0.1.31 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Crea el enlace llamado `path` que apunta a `target`. No se proporcionan argumentos, aparte de una posible excepción, al callback de finalización.

Consulte la documentación POSIX [`symlink(2)`](http://man7.org/linux/man-pages/man2/symlink.2) para obtener más detalles.

El argumento `type` solo está disponible en Windows y se ignora en otras plataformas. Se puede establecer en `'dir'`, `'file'` o `'junction'`. Si el argumento `type` es `null`, Node.js detectará automáticamente el tipo `target` y utilizará `'file'` o `'dir'`. Si `target` no existe, se utilizará `'file'`. Los puntos de unión de Windows requieren que la ruta de destino sea absoluta. Cuando se usa `'junction'`, el argumento `target` se normalizará automáticamente a la ruta absoluta. Los puntos de unión en volúmenes NTFS solo pueden apuntar a directorios.

Los destinos relativos son relativos al directorio principal del enlace.

```js [ESM]
import { symlink } from 'node:fs';

symlink('./mew', './mewtwo', callback);
```
El ejemplo anterior crea un enlace simbólico `mewtwo` que apunta a `mew` en el mismo directorio:

```bash [BASH]
$ tree .
.
├── mew
└── mewtwo -> ./mew
```

### `fs.truncate(path[, len], callback)` {#fstruncatepath-len-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una función de retrollamada inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v16.0.0 | El error devuelto puede ser un `AggregateError` si se devuelve más de un error. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo lanzará un `TypeError` en tiempo de ejecución. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con el ID DEP0013. |
| v0.8.6 | Añadido en: v0.8.6 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)

 

Trunca el archivo. No se dan argumentos a la retrollamada de finalización aparte de una posible excepción. Un descriptor de archivo también se puede pasar como primer argumento. En este caso, se llama a `fs.ftruncate()`.

::: code-group
```js [ESM]
import { truncate } from 'node:fs';
// Asumiendo que 'path/file.txt' es un archivo regular.
truncate('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt fue truncado');
});
```

```js [CJS]
const { truncate } = require('node:fs');
// Asumiendo que 'path/file.txt' es un archivo regular.
truncate('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt fue truncado');
});
```
:::

Pasar un descriptor de archivo está obsoleto y puede resultar en que se lance un error en el futuro.

Consulte la documentación de POSIX [`truncate(2)`](http://man7.org/linux/man-pages/man2/truncate.2) para obtener más detalles.


### `fs.unlink(path, callback)` {#fsunlinkpath-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una callback inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo lanzará un `TypeError` en tiempo de ejecución. |
| v7.6.0 | El parámetro `path` puede ser un objeto `URL` WHATWG usando el protocolo `file:`. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con el ID DEP0013. |
| v0.0.2 | Añadido en: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Elimina de forma asíncrona un archivo o enlace simbólico. No se dan argumentos a la callback de finalización, aparte de una posible excepción.

```js [ESM]
import { unlink } from 'node:fs';
// Asumiendo que 'path/file.txt' es un archivo regular.
unlink('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt fue borrado');
});
```
`fs.unlink()` no funcionará en un directorio, esté vacío o no. Para eliminar un directorio, utilice [`fs.rmdir()`](/es/nodejs/api/fs#fsrmdirpath-options-callback).

Consulte la documentación de POSIX [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2) para obtener más detalles.

### `fs.unwatchFile(filename[, listener])` {#fsunwatchfilefilename-listener}

**Añadido en: v0.1.31**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Opcional, un listener previamente adjunto usando `fs.watchFile()`

Deja de observar los cambios en `filename`. Si se especifica `listener`, solo se elimina ese listener en particular. De lo contrario, se eliminan *todos* los listeners, deteniendo efectivamente la observación de `filename`.

Llamar a `fs.unwatchFile()` con un nombre de archivo que no se está observando es una operación nula, no un error.

El uso de [`fs.watch()`](/es/nodejs/api/fs#fswatchfilename-options-listener) es más eficiente que `fs.watchFile()` y `fs.unwatchFile()`. `fs.watch()` debería utilizarse en lugar de `fs.watchFile()` y `fs.unwatchFile()` cuando sea posible.


### `fs.utimes(path, atime, mtime, callback)` {#fsutimespath-atime-mtime-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo lanzará un `TypeError` en tiempo de ejecución. |
| v8.0.0 | `NaN`, `Infinity` y `-Infinity` ya no son especificadores de tiempo válidos. |
| v7.6.0 | El parámetro `path` puede ser un objeto WHATWG `URL` usando el protocolo `file:`. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con el ID DEP0013. |
| v4.1.0 | Las cadenas numéricas, `NaN` e `Infinity` ahora son especificadores de tiempo permitidos. |
| v0.4.2 | Añadido en: v0.4.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Cambia las marcas de tiempo del sistema de archivos del objeto referenciado por `path`.

Los argumentos `atime` y `mtime` siguen estas reglas:

- Los valores pueden ser números que representan el tiempo de la época de Unix en segundos, `Date`s o una cadena numérica como `'123456789.0'`.
- Si el valor no se puede convertir a un número, o es `NaN`, `Infinity` o `-Infinity`, se lanzará un `Error`.


### `fs.watch(filename[, options][, listener])` {#fswatchfilename-options-listener}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v19.1.0 | Se agregó soporte recursivo para Linux, AIX e IBMi. |
| v15.9.0, v14.17.0 | Se agregó soporte para cerrar el observador con un AbortSignal. |
| v7.6.0 | El parámetro `filename` puede ser un objeto WHATWG `URL` usando el protocolo `file:`. |
| v7.0.0 | El objeto `options` pasado nunca se modificará. |
| v0.5.10 | Agregado en: v0.5.10 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si el proceso debe continuar ejecutándose mientras se estén observando los archivos. **Predeterminado:** `true`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si se deben observar todos los subdirectorios, o solo el directorio actual. Esto se aplica cuando se especifica un directorio, y solo en plataformas compatibles (Ver [advertencias](/es/nodejs/api/fs#caveats)). **Predeterminado:** `false`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especifica la codificación de caracteres que se utilizará para el nombre de archivo pasado al listener. **Predeterminado:** `'utf8'`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) permite cerrar el observador con un AbortSignal.


- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) **Predeterminado:** `undefined`
    - `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)


- Devuelve: [\<fs.FSWatcher\>](/es/nodejs/api/fs#class-fsfswatcher)

Observa los cambios en `filename`, donde `filename` es un archivo o un directorio.

El segundo argumento es opcional. Si `options` se proporciona como una cadena, especifica la `encoding`. De lo contrario, `options` debe pasarse como un objeto.

La función de callback del listener obtiene dos argumentos `(eventType, filename)`. `eventType` es `'rename'` o `'change'`, y `filename` es el nombre del archivo que desencadenó el evento.

En la mayoría de las plataformas, se emite `'rename'` cada vez que un nombre de archivo aparece o desaparece en el directorio.

La función de callback del listener se adjunta al evento `'change'` disparado por [\<fs.FSWatcher\>](/es/nodejs/api/fs#class-fsfswatcher), pero no es lo mismo que el valor `'change'` de `eventType`.

Si se pasa una `signal`, abortar el AbortController correspondiente cerrará el [\<fs.FSWatcher\>](/es/nodejs/api/fs#class-fsfswatcher) devuelto.


#### Advertencias {#caveats}

La API `fs.watch` no es 100% consistente entre plataformas, y no está disponible en algunas situaciones.

En Windows, no se emitirán eventos si el directorio vigilado se mueve o se renombra. Se informa un error `EPERM` cuando se elimina el directorio vigilado.

##### Disponibilidad {#availability}

Esta característica depende de que el sistema operativo subyacente proporcione una forma de ser notificado de los cambios en el sistema de archivos.

- En sistemas Linux, esto utiliza [`inotify(7)`](https://man7.org/linux/man-pages/man7/inotify.7).
- En sistemas BSD, esto utiliza [`kqueue(2)`](https://www.freebsd.org/cgi/man.cgi?query=kqueue&sektion=2).
- En macOS, esto utiliza [`kqueue(2)`](https://www.freebsd.org/cgi/man.cgi?query=kqueue&sektion=2) para archivos y [`FSEvents`](https://developer.apple.com/documentation/coreservices/file_system_events) para directorios.
- En sistemas SunOS (incluidos Solaris y SmartOS), esto utiliza [`event ports`](https://illumos.org/man/port_create).
- En sistemas Windows, esta característica depende de [`ReadDirectoryChangesW`](https://docs.microsoft.com/en-us/windows/desktop/api/winbase/nf-winbase-readdirectorychangesw).
- En sistemas AIX, esta característica depende de [`AHAFS`](https://developer.ibm.com/articles/au-aix_event_infrastructure/), que debe estar habilitado.
- En sistemas IBM i, esta característica no es compatible.

Si la funcionalidad subyacente no está disponible por alguna razón, entonces `fs.watch()` no podrá funcionar y puede lanzar una excepción. Por ejemplo, la vigilancia de archivos o directorios puede ser poco fiable, y en algunos casos imposible, en sistemas de archivos de red (NFS, SMB, etc.) o en sistemas de archivos de host cuando se utiliza software de virtualización como Vagrant o Docker.

Todavía es posible utilizar `fs.watchFile()`, que utiliza el sondeo de estadísticas, pero este método es más lento y menos fiable.

##### Inodos {#inodes}

En los sistemas Linux y macOS, `fs.watch()` resuelve la ruta a un [inode](https://en.wikipedia.org/wiki/Inode) y vigila el inode. Si la ruta vigilada se elimina y se vuelve a crear, se le asigna un nuevo inode. El vigilador emitirá un evento para la eliminación pero seguirá vigilando el inode *original*. No se emitirán eventos para el nuevo inode. Este es el comportamiento esperado.

Los archivos AIX conservan el mismo inode durante la vida útil de un archivo. Guardar y cerrar un archivo vigilado en AIX dará como resultado dos notificaciones (una para añadir contenido nuevo y otra para el truncamiento).


##### Argumento `filename` {#filename-argument}

Proporcionar el argumento `filename` en la función de retorno solo es compatible con Linux, macOS, Windows y AIX. Incluso en plataformas compatibles, no siempre se garantiza que se proporcione `filename`. Por lo tanto, no asumas que el argumento `filename` siempre se proporciona en la función de retorno y ten alguna lógica de respaldo si es `null`.

```js [ESM]
import { watch } from 'node:fs';
watch('somedir', (eventType, filename) => {
  console.log(`el tipo de evento es: ${eventType}`);
  if (filename) {
    console.log(`nombre de archivo proporcionado: ${filename}`);
  } else {
    console.log('nombre de archivo no proporcionado');
  }
});
```
### `fs.watchFile(filename[, options], listener)` {#fswatchfilefilename-options-listener}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.5.0 | Ahora se admite la opción `bigint`. |
| v7.6.0 | El parámetro `filename` puede ser un objeto WHATWG `URL` usando el protocolo `file:`. |
| v0.1.31 | Añadido en: v0.1.31 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `false`
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `true`
    - `interval` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `5007`
  
 
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `current` [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats)
    - `previous` [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats)
  
 
- Devuelve: [\<fs.StatWatcher\>](/es/nodejs/api/fs#class-fsstatwatcher)

Vigila los cambios en `filename`. La función de retorno `listener` será llamada cada vez que se acceda al archivo.

El argumento `options` puede ser omitido. Si se proporciona, debe ser un objeto. El objeto `options` puede contener un booleano llamado `persistent` que indica si el proceso debe continuar ejecutándose mientras se estén vigilando los archivos. El objeto `options` puede especificar una propiedad `interval` que indica con qué frecuencia se debe sondear el objetivo en milisegundos.

El `listener` recibe dos argumentos, el objeto stat actual y el objeto stat anterior:

```js [ESM]
import { watchFile } from 'node:fs';

watchFile('message.text', (curr, prev) => {
  console.log(`el mtime actual es: ${curr.mtime}`);
  console.log(`el mtime anterior fue: ${prev.mtime}`);
});
```
Estos objetos stat son instancias de `fs.Stat`. Si la opción `bigint` es `true`, los valores numéricos en estos objetos se especifican como `BigInt`s.

Para ser notificado cuando el archivo fue modificado, no solo accedido, es necesario comparar `curr.mtimeMs` y `prev.mtimeMs`.

Cuando una operación `fs.watchFile` resulta en un error `ENOENT`, invocará el listener una vez, con todos los campos a cero (o, para las fechas, la época de Unix). Si el archivo se crea más tarde, se volverá a llamar al listener, con los últimos objetos stat. Este es un cambio en la funcionalidad desde la v0.10.

Usar [`fs.watch()`](/es/nodejs/api/fs#fswatchfilename-options-listener) es más eficiente que `fs.watchFile` y `fs.unwatchFile`. `fs.watch` debe usarse en lugar de `fs.watchFile` y `fs.unwatchFile` cuando sea posible.

Cuando un archivo que está siendo vigilado por `fs.watchFile()` desaparece y reaparece, entonces el contenido de `previous` en el segundo evento de función de retorno (la reaparición del archivo) será el mismo que el contenido de `previous` en el primer evento de función de retorno (su desaparición).

Esto sucede cuando:

- el archivo se elimina, seguido de una restauración
- el archivo se renombra y luego se renombra una segunda vez a su nombre original


### `fs.write(fd, buffer, offset[, length[, position]], callback)` {#fswritefd-buffer-offset-length-position-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una función de retrollamada inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v14.0.0 | El parámetro `buffer` ya no coaccionará entradas no soportadas a cadenas. |
| v10.10.0 | El parámetro `buffer` ahora puede ser cualquier `TypedArray` o una `DataView`. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo lanzará un `TypeError` en tiempo de ejecución. |
| v7.4.0 | El parámetro `buffer` ahora puede ser un `Uint8Array`. |
| v7.2.0 | Los parámetros `offset` y `length` ahora son opcionales. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con el id DEP0013. |
| v0.0.2 | Añadido en: v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

Escribe `buffer` en el archivo especificado por `fd`.

`offset` determina la parte del búfer que se va a escribir, y `length` es un entero que especifica el número de bytes a escribir.

`position` se refiere al desplazamiento desde el principio del archivo donde se deben escribir estos datos. Si `typeof position !== 'number'`, los datos se escribirán en la posición actual. Vea [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2).

La retrollamada recibirá tres argumentos `(err, bytesWritten, buffer)` donde `bytesWritten` especifica cuántos *bytes* se escribieron desde `buffer`.

Si este método se invoca como su versión [`util.promisify()`](/es/nodejs/api/util#utilpromisifyoriginal)ed, devuelve una promesa para un `Object` con las propiedades `bytesWritten` y `buffer`.

No es seguro utilizar `fs.write()` varias veces en el mismo archivo sin esperar a la retrollamada. Para este escenario, se recomienda [`fs.createWriteStream()`](/es/nodejs/api/fs#fscreatewritestreampath-options).

En Linux, las escrituras posicionales no funcionan cuando el archivo se abre en modo de adición. El kernel ignora el argumento de posición y siempre añade los datos al final del archivo.


### `fs.write(fd, buffer[, options], callback)` {#fswritefd-buffer-options-callback}

**Agregado en: v18.3.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `null`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
  
 

Escribe `buffer` en el archivo especificado por `fd`.

Similar a la función `fs.write` anterior, esta versión toma un objeto `options` opcional. Si no se especifica ningún objeto `options`, tomará por defecto los valores anteriores.

### `fs.write(fd, string[, position[, encoding]], callback)` {#fswritefd-string-position-encoding-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Ya no se admite pasar al parámetro `string` un objeto con una función `toString` propia. |
| v17.8.0 | Se ha dejado de utilizar pasar al parámetro `string` un objeto con una función `toString` propia. |
| v14.12.0 | El parámetro `string` convertirá en cadena un objeto con una función `toString` explícita. |
| v14.0.0 | El parámetro `string` ya no forzará la entrada no compatible a cadenas. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo lanzará un `TypeError` en tiempo de ejecución. |
| v7.2.0 | El parámetro `position` ahora es opcional. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con id DEP0013. |
| v0.11.5 | Agregado en: v0.11.5 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `written` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

Escribe `string` en el archivo especificado por `fd`. Si `string` no es una cadena, se lanza una excepción.

`position` se refiere al desplazamiento desde el principio del archivo donde se deben escribir estos datos. Si `typeof position !== 'number'` los datos se escribirán en la posición actual. Consulte [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2).

`encoding` es la codificación de cadena esperada.

La retrollamada recibirá los argumentos `(err, written, string)` donde `written` especifica cuántos *bytes* requirió la cadena pasada para ser escrita. Los bytes escritos no son necesariamente los mismos que los caracteres de cadena escritos. Consulte [`Buffer.byteLength`](/es/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding).

Es inseguro usar `fs.write()` varias veces en el mismo archivo sin esperar la retrollamada. Para este escenario, se recomienda [`fs.createWriteStream()`](/es/nodejs/api/fs#fscreatewritestreampath-options).

En Linux, las escrituras posicionales no funcionan cuando el archivo se abre en modo de adición. El kernel ignora el argumento de posición y siempre agrega los datos al final del archivo.

En Windows, si el descriptor de archivo está conectado a la consola (por ejemplo, `fd == 1` o `stdout`), una cadena que contenga caracteres no ASCII no se representará correctamente de forma predeterminada, independientemente de la codificación utilizada. Es posible configurar la consola para que represente UTF-8 correctamente cambiando la página de códigos activa con el comando `chcp 65001`. Consulte los documentos de [chcp](https://ss64.com/nt/chcp) para obtener más detalles.


### `fs.writeFile(file, data[, options], callback)` {#fswritefilefile-data-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.0.0, v20.10.0 | Ahora se admite la opción `flush`. |
| v19.0.0 | Ya no se admite pasar al parámetro `string` un objeto con una función `toString` propia. |
| v18.0.0 | Pasar un callback no válido al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v17.8.0 | Pasar al parámetro `string` un objeto con una función `toString` propia está obsoleto. |
| v16.0.0 | El error devuelto puede ser un `AggregateError` si se devuelve más de un error. |
| v15.2.0, v14.17.0 | El argumento de opciones puede incluir una AbortSignal para abortar una solicitud de writeFile en curso. |
| v14.12.0 | El parámetro `data` convertirá en string un objeto con una función `toString` explícita. |
| v14.0.0 | El parámetro `data` ya no coercerá entradas no admitidas a strings. |
| v10.10.0 | El parámetro `data` ahora puede ser cualquier `TypedArray` o `DataView`. |
| v10.0.0 | El parámetro `callback` ya no es opcional. No pasarlo lanzará un `TypeError` en tiempo de ejecución. |
| v7.4.0 | El parámetro `data` ahora puede ser un `Uint8Array`. |
| v7.0.0 | El parámetro `callback` ya no es opcional. No pasarlo emitirá una advertencia de obsolescencia con el id DEP0013. |
| v5.0.0 | El parámetro `file` ahora puede ser un descriptor de archivo. |
| v0.1.29 | Añadido en: v0.1.29 |
:::

- `file` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Number) nombre de archivo o descriptor de archivo
- `data` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String) 
    - `encoding` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String) | [\<null\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Null) **Predeterminado:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Number) **Predeterminado:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String) Consulte el [soporte de `flags` del sistema de archivos](/es/nodejs/api/fs#file-system-flags). **Predeterminado:** `'w'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Si todos los datos se escriben correctamente en el archivo, y `flush` es `true`, se utiliza `fs.fsync()` para vaciar los datos. **Predeterminado:** `false`.
    - `signal` [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) permite abortar una writeFile en curso
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
  
 

Cuando `file` es un nombre de archivo, escribe datos de forma asíncrona en el archivo, reemplazando el archivo si ya existe. `data` puede ser una cadena o un búfer.

Cuando `file` es un descriptor de archivo, el comportamiento es similar a llamar a `fs.write()` directamente (lo cual se recomienda). Consulte las notas a continuación sobre el uso de un descriptor de archivo.

La opción `encoding` se ignora si `data` es un búfer.

La opción `mode` solo afecta al archivo recién creado. Consulte [`fs.open()`](/es/nodejs/api/fs#fsopenpath-flags-mode-callback) para obtener más detalles.

```js [ESM]
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
```
Si `options` es una cadena, entonces especifica la codificación:

```js [ESM]
import { writeFile } from 'node:fs';

writeFile('message.txt', 'Hello Node.js', 'utf8', callback);
```
No es seguro usar `fs.writeFile()` varias veces en el mismo archivo sin esperar el callback. Para este escenario, se recomienda [`fs.createWriteStream()`](/es/nodejs/api/fs#fscreatewritestreampath-options).

De manera similar a `fs.readFile` - `fs.writeFile` es un método de conveniencia que realiza múltiples llamadas `write` internamente para escribir el búfer que se le pasa. Para código sensible al rendimiento, considere usar [`fs.createWriteStream()`](/es/nodejs/api/fs#fscreatewritestreampath-options).

Es posible utilizar un [\<AbortSignal\>](/es/nodejs/api/globals#class-abortsignal) para cancelar un `fs.writeFile()`. La cancelación es "el mejor esfuerzo", y es probable que todavía se escriba una cierta cantidad de datos.

```js [ESM]
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const controller = new AbortController();
const { signal } = controller;
const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, { signal }, (err) => {
  // When a request is aborted - the callback is called with an AbortError
});
// When the request should be aborted
controller.abort();
```
Abortar una solicitud en curso no aborta las solicitudes individuales del sistema operativo, sino el almacenamiento en búfer interno que realiza `fs.writeFile`.


#### Usando `fs.writeFile()` con descriptores de archivo {#using-fswritefile-with-file-descriptors}

Cuando `file` es un descriptor de archivo, el comportamiento es casi idéntico a llamar directamente a `fs.write()` como:

```js [ESM]
import { write } from 'node:fs';
import { Buffer } from 'node:buffer';

write(fd, Buffer.from(data, options.encoding), callback);
```
La diferencia con llamar directamente a `fs.write()` es que, en algunas condiciones inusuales, `fs.write()` podría escribir solo una parte del búfer y necesitar reintentarse para escribir los datos restantes, mientras que `fs.writeFile()` reintenta hasta que los datos se escriben por completo (o se produce un error).

Las implicaciones de esto son una fuente común de confusión. En el caso del descriptor de archivo, ¡el archivo no se reemplaza! Los datos no se escriben necesariamente al principio del archivo, y los datos originales del archivo pueden permanecer antes y/o después de los datos recién escritos.

Por ejemplo, si `fs.writeFile()` se llama dos veces seguidas, primero para escribir la cadena `'Hello'`, luego para escribir la cadena `', World'`, el archivo contendría `'Hello, World'`, y podría contener algunos de los datos originales del archivo (dependiendo del tamaño del archivo original y la posición del descriptor de archivo). Si se hubiera usado un nombre de archivo en lugar de un descriptor, se garantizaría que el archivo contenga solo `', World'`.

### `fs.writev(fd, buffers[, position], callback)` {#fswritevfd-buffers-position-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v12.9.0 | Añadido en: v12.9.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
  
 

Escribe una matriz de `ArrayBufferView`s en el archivo especificado por `fd` usando `writev()`.

`position` es el desplazamiento desde el principio del archivo donde se deben escribir estos datos. Si `typeof position !== 'number'`, los datos se escribirán en la posición actual.

La devolución de llamada recibirá tres argumentos: `err`, `bytesWritten` y `buffers`. `bytesWritten` es cuántos bytes se escribieron desde `buffers`.

Si este método es [`util.promisify()`](/es/nodejs/api/util#utilpromisifyoriginal)ed, devuelve una promesa para un `Object` con propiedades `bytesWritten` y `buffers`.

No es seguro usar `fs.writev()` varias veces en el mismo archivo sin esperar la devolución de llamada. Para este escenario, use [`fs.createWriteStream()`](/es/nodejs/api/fs#fscreatewritestreampath-options).

En Linux, las escrituras posicionales no funcionan cuando el archivo se abre en modo de anexión. El kernel ignora el argumento de posición y siempre anexa los datos al final del archivo.


## API Síncrona {#synchronous-api}

Las APIs síncronas realizan todas las operaciones de forma síncrona, bloqueando el bucle de eventos hasta que la operación se completa o falla.

### `fs.accessSync(path[, mode])` {#fsaccesssyncpath-mode}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v7.6.0 | El parámetro `path` puede ser un objeto `URL` WHATWG usando el protocolo `file:`. |
| v0.11.15 | Añadido en: v0.11.15 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `fs.constants.F_OK`

Prueba sincrónicamente los permisos de un usuario para el archivo o directorio especificado por `path`. El argumento `mode` es un entero opcional que especifica las comprobaciones de accesibilidad que se realizarán. `mode` debe ser el valor `fs.constants.F_OK` o una máscara que consista en el OR bit a bit de cualquiera de `fs.constants.R_OK`, `fs.constants.W_OK` y `fs.constants.X_OK` (por ejemplo, `fs.constants.W_OK | fs.constants.R_OK`). Consulte [Constantes de acceso a archivos](/es/nodejs/api/fs#file-access-constants) para conocer los valores posibles de `mode`.

Si alguna de las comprobaciones de accesibilidad falla, se lanzará un `Error`. De lo contrario, el método devolverá `undefined`.

```js [ESM]
import { accessSync, constants } from 'node:fs';

try {
  accessSync('etc/passwd', constants.R_OK | constants.W_OK);
  console.log('puede leer/escribir');
} catch (err) {
  console.error('¡sin acceso!');
}
```
### `fs.appendFileSync(path, data[, options])` {#fsappendfilesyncpath-data-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.1.0, v20.10.0 | Ahora se admite la opción `flush`. |
| v7.0.0 | El objeto `options` pasado nunca será modificado. |
| v5.0.0 | El parámetro `file` ahora puede ser un descriptor de archivo. |
| v0.6.7 | Añadido en: v0.6.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nombre de archivo o descriptor de archivo
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Consulte el [soporte de `flags` del sistema de archivos](/es/nodejs/api/fs#file-system-flags). **Predeterminado:** `'a'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, el descriptor de archivo subyacente se vacía antes de cerrarlo. **Predeterminado:** `false`.

Añade sincrónicamente datos a un archivo, creando el archivo si aún no existe. `data` puede ser una cadena o un [\<Buffer\>](/es/nodejs/api/buffer#class-buffer).

La opción `mode` solo afecta al archivo recién creado. Consulte [`fs.open()`](/es/nodejs/api/fs#fsopenpath-flags-mode-callback) para obtener más detalles.

```js [ESM]
import { appendFileSync } from 'node:fs';

try {
  appendFileSync('message.txt', 'data to append');
  console.log('¡Los "datos a añadir" se añadieron al archivo!');
} catch (err) {
  /* Handle the error */
}
```
Si `options` es una cadena, entonces especifica la codificación:

```js [ESM]
import { appendFileSync } from 'node:fs';

appendFileSync('message.txt', 'data to append', 'utf8');
```
El `path` puede especificarse como un descriptor de archivo numérico que se ha abierto para añadir (usando `fs.open()` o `fs.openSync()`). El descriptor de archivo no se cerrará automáticamente.

```js [ESM]
import { openSync, closeSync, appendFileSync } from 'node:fs';

let fd;

try {
  fd = openSync('message.txt', 'a');
  appendFileSync(fd, 'data to append', 'utf8');
} catch (err) {
  /* Handle the error */
} finally {
  if (fd !== undefined)
    closeSync(fd);
}
```

### `fs.chmodSync(path, mode)` {#fschmodsyncpath-mode}

::: info [Historia]
| Versión | Cambios |
|---|---|
| v7.6.0 | El parámetro `path` puede ser un objeto `URL` WHATWG usando el protocolo `file:`. |
| v0.6.7 | Añadido en: v0.6.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Para obtener información detallada, consulte la documentación de la versión asíncrona de esta API: [`fs.chmod()`](/es/nodejs/api/fs#fschmodpath-mode-callback).

Consulte la documentación POSIX [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2) para obtener más detalles.

### `fs.chownSync(path, uid, gid)` {#fschownsyncpath-uid-gid}

::: info [Historia]
| Versión | Cambios |
|---|---|
| v7.6.0 | El parámetro `path` puede ser un objeto `URL` WHATWG usando el protocolo `file:`. |
| v0.1.97 | Añadido en: v0.1.97 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Cambia sincrónicamente el propietario y el grupo de un archivo. Devuelve `undefined`. Esta es la versión síncrona de [`fs.chown()`](/es/nodejs/api/fs#fschownpath-uid-gid-callback).

Consulte la documentación POSIX [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2) para obtener más detalles.

### `fs.closeSync(fd)` {#fsclosesyncfd}

**Añadido en: v0.1.21**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Cierra el descriptor de archivo. Devuelve `undefined`.

Llamar a `fs.closeSync()` en cualquier descriptor de archivo (`fd`) que esté actualmente en uso a través de cualquier otra operación `fs` puede conducir a un comportamiento indefinido.

Consulte la documentación POSIX [`close(2)`](http://man7.org/linux/man-pages/man2/close.2) para obtener más detalles.


### `fs.copyFileSync(src, dest[, mode])` {#fscopyfilesyncsrc-dest-mode}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.0.0 | Se cambió el argumento `flags` a `mode` y se impuso una validación de tipo más estricta. |
| v8.5.0 | Añadido en: v8.5.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) nombre de archivo fuente para copiar
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) nombre de archivo de destino de la operación de copia
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) modificadores para la operación de copia. **Predeterminado:** `0`.

Copia sincrónicamente `src` a `dest`. De forma predeterminada, `dest` se sobrescribe si ya existe. Devuelve `undefined`. Node.js no ofrece garantías sobre la atomicidad de la operación de copia. Si se produce un error después de que el archivo de destino se haya abierto para su escritura, Node.js intentará eliminar el destino.

`mode` es un entero opcional que especifica el comportamiento de la operación de copia. Es posible crear una máscara que consista en el OR bit a bit de dos o más valores (p. ej., `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`).

- `fs.constants.COPYFILE_EXCL`: La operación de copia fallará si `dest` ya existe.
- `fs.constants.COPYFILE_FICLONE`: La operación de copia intentará crear un reflink de copia en escritura. Si la plataforma no es compatible con la copia en escritura, se utiliza un mecanismo de copia de reserva.
- `fs.constants.COPYFILE_FICLONE_FORCE`: La operación de copia intentará crear un reflink de copia en escritura. Si la plataforma no es compatible con la copia en escritura, la operación fallará.

```js [ESM]
import { copyFileSync, constants } from 'node:fs';

// destination.txt se creará o sobrescribirá de forma predeterminada.
copyFileSync('source.txt', 'destination.txt');
console.log('source.txt se copió a destination.txt');

// Al usar COPYFILE_EXCL, la operación fallará si destination.txt existe.
copyFileSync('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
```

### `fs.cpSync(src, dest[, options])` {#fscpsyncsrc-dest-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.3.0 | Esta API ya no es experimental. |
| v20.1.0, v18.17.0 | Acepta una opción adicional `mode` para especificar el comportamiento de copia como el argumento `mode` de `fs.copyFile()`. |
| v17.6.0, v16.15.0 | Acepta una opción adicional `verbatimSymlinks` para especificar si se debe realizar la resolución de la ruta para los enlaces simbólicos. |
| v16.7.0 | Añadido en: v16.7.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) ruta de origen a copiar.
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) ruta de destino a copiar.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) desreferenciar enlaces simbólicos. **Predeterminado:** `false`.
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) cuando `force` es `false` y el destino existe, lanzar un error. **Predeterminado:** `false`.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Función para filtrar archivos/directorios copiados. Devolver `true` para copiar el elemento, `false` para ignorarlo. Al ignorar un directorio, también se omitirá todo su contenido. **Predeterminado:** `undefined`
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ruta de origen a copiar.
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ruta de destino a copiar.
    - Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cualquier valor no `Promise` que pueda ser coercible a `boolean`.
  
 
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) sobrescribir el archivo o directorio existente. La operación de copia ignorará los errores si establece esto en falso y el destino existe. Use la opción `errorOnExist` para cambiar este comportamiento. **Predeterminado:** `true`.
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) modificadores para la operación de copia. **Predeterminado:** `0`. Véase el indicador `mode` de [`fs.copyFileSync()`](/es/nodejs/api/fs#fscopyfilesyncsrc-dest-mode).
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, se conservarán las marcas de tiempo de `src`. **Predeterminado:** `false`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) copiar directorios de forma recursiva **Predeterminado:** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, se omitirá la resolución de la ruta para los enlaces simbólicos. **Predeterminado:** `false`
  
 

Copia sincrónicamente toda la estructura de directorios de `src` a `dest`, incluidos los subdirectorios y archivos.

Al copiar un directorio a otro directorio, no se admiten globs y el comportamiento es similar a `cp dir1/ dir2/`.


### `fs.existsSync(path)` {#fsexistssyncpath}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v7.6.0 | El parámetro `path` puede ser un objeto `URL` WHATWG usando el protocolo `file:`. |
| v0.1.21 | Añadido en: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si la ruta existe, `false` en caso contrario.

Para información detallada, consulte la documentación de la versión asíncrona de esta API: [`fs.exists()`](/es/nodejs/api/fs#fsexistspath-callback).

`fs.exists()` está obsoleto, pero `fs.existsSync()` no lo está. El parámetro `callback` de `fs.exists()` acepta parámetros que son inconsistentes con otras devoluciones de llamada de Node.js. `fs.existsSync()` no utiliza una devolución de llamada.

```js [ESM]
import { existsSync } from 'node:fs';

if (existsSync('/etc/passwd'))
  console.log('La ruta existe.');
```
### `fs.fchmodSync(fd, mode)` {#fsfchmodsyncfd-mode}

**Añadido en: v0.4.7**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Establece los permisos en el archivo. Devuelve `undefined`.

Consulte la documentación POSIX [`fchmod(2)`](http://man7.org/linux/man-pages/man2/fchmod.2) para obtener más detalles.

### `fs.fchownSync(fd, uid, gid)` {#fsfchownsyncfd-uid-gid}

**Añadido en: v0.4.7**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El ID de usuario del nuevo propietario del archivo.
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El ID de grupo del nuevo grupo del archivo.

Establece el propietario del archivo. Devuelve `undefined`.

Consulte la documentación POSIX [`fchown(2)`](http://man7.org/linux/man-pages/man2/fchown.2) para obtener más detalles.


### `fs.fdatasyncSync(fd)` {#fsfdatasyncsyncfd}

**Agregado en: v0.1.96**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Fuerza todas las operaciones de E/S en cola asociadas con el archivo al estado de finalización de E/S sincronizada del sistema operativo. Consulte la documentación de POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2) para obtener más detalles. Devuelve `undefined`.

### `fs.fstatSync(fd[, options])` {#fsfstatsyncfd-options}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.5.0 | Acepta un objeto `options` adicional para especificar si los valores numéricos devueltos deben ser bigint. |
| v0.1.95 | Agregado en: v0.1.95 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si los valores numéricos en el objeto [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) devuelto deben ser `bigint`. **Predeterminado:** `false`.


- Devuelve: [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats)

Recupera el [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) para el descriptor de archivo.

Consulte la documentación de POSIX [`fstat(2)`](http://man7.org/linux/man-pages/man2/fstat.2) para obtener más detalles.

### `fs.fsyncSync(fd)` {#fsfsyncsyncfd}

**Agregado en: v0.1.96**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Solicita que todos los datos para el descriptor de archivo abierto se vuelquen al dispositivo de almacenamiento. La implementación específica es específica del sistema operativo y del dispositivo. Consulte la documentación de POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2) para obtener más detalles. Devuelve `undefined`.

### `fs.ftruncateSync(fd[, len])` {#fsftruncatesyncfd-len}

**Agregado en: v0.8.6**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0`

Trunca el descriptor de archivo. Devuelve `undefined`.

Para obtener información detallada, consulte la documentación de la versión asíncrona de esta API: [`fs.ftruncate()`](/es/nodejs/api/fs#fsftruncatefd-len-callback).


### `fs.futimesSync(fd, atime, mtime)` {#fsfutimessyncfd-atime-mtime}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v4.1.0 | Las cadenas numéricas, `NaN` e `Infinity` ahora están permitidas como especificadores de tiempo. |
| v0.4.2 | Agregado en: v0.4.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Versión sincrónica de [`fs.futimes()`](/es/nodejs/api/fs#fsfutimesfd-atime-mtime-callback). Devuelve `undefined`.

### `fs.globSync(pattern[, options])` {#fsglobsyncpattern-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.2.0 | Se agregó soporte para `withFileTypes` como una opción. |
| v22.0.0 | Agregado en: v22.0.0 |
:::

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) directorio de trabajo actual. **Default:** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Función para filtrar archivos/directorios. Devuelve `true` para excluir el elemento, `false` para incluirlo. **Default:** `undefined`.
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si el glob debe devolver rutas como Dirents, `false` en caso contrario. **Default:** `false`.

- Returns: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) rutas de los archivos que coinciden con el patrón.

::: code-group
```js [ESM]
import { globSync } from 'node:fs';

console.log(globSync('**/*.js'));
```

```js [CJS]
const { globSync } = require('node:fs');

console.log(globSync('**/*.js'));
```
:::


### `fs.lchmodSync(path, mode)` {#fslchmodsyncpath-mode}

**Obsoleto desde: v0.4.7**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Cambia los permisos en un enlace simbólico. Devuelve `undefined`.

Este método solo está implementado en macOS.

Consulte la documentación POSIX [`lchmod(2)`](https://www.freebsd.org/cgi/man.cgi?query=lchmod&sektion=2) para obtener más detalles.

### `fs.lchownSync(path, uid, gid)` {#fslchownsyncpath-uid-gid}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.6.0 | Esta API ya no está obsoleta. |
| v0.4.7 | Obsolescencia solo en la documentación. |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El ID de usuario del nuevo propietario del archivo.
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El ID de grupo del nuevo grupo del archivo.

Establece el propietario para la ruta. Devuelve `undefined`.

Consulte la documentación POSIX [`lchown(2)`](http://man7.org/linux/man-pages/man2/lchown.2) para obtener más detalles.

### `fs.lutimesSync(path, atime, mtime)` {#fslutimessyncpath-atime-mtime}

**Agregado en: v14.5.0, v12.19.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Cambia las marcas de tiempo del sistema de archivos del enlace simbólico al que hace referencia `path`. Devuelve `undefined` o lanza una excepción cuando los parámetros son incorrectos o la operación falla. Esta es la versión síncrona de [`fs.lutimes()`](/es/nodejs/api/fs#fslutimespath-atime-mtime-callback).


### `fs.linkSync(existingPath, newPath)` {#fslinksyncexistingpath-newpath}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v7.6.0 | Los parámetros `existingPath` y `newPath` pueden ser objetos `URL` WHATWG usando el protocolo `file:`. El soporte es actualmente *experimental*. |
| v0.1.31 | Añadido en: v0.1.31 |
:::

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)

Crea un nuevo enlace desde `existingPath` a `newPath`. Consulte la documentación POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) para obtener más detalles. Devuelve `undefined`.

### `fs.lstatSync(path[, options])` {#fslstatsyncpath-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.3.0, v14.17.0 | Acepta una opción `throwIfNoEntry` para especificar si se debe lanzar una excepción si la entrada no existe. |
| v10.5.0 | Acepta un objeto `options` adicional para especificar si los valores numéricos devueltos deben ser bigint. |
| v7.6.0 | El parámetro `path` puede ser un objeto `URL` WHATWG usando el protocolo `file:`. |
| v0.1.30 | Añadido en: v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si los valores numéricos en el objeto [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) devuelto deben ser `bigint`. **Default:** `false`.
    - `throwIfNoEntry` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se lanzará una excepción si no existe ninguna entrada del sistema de archivos, en lugar de devolver `undefined`. **Default:** `true`.


- Devuelve: [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats)

Recupera el [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) para el enlace simbólico al que se refiere `path`.

Consulte la documentación POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) para obtener más detalles.


### `fs.mkdirSync(path[, options])` {#fsmkdirsyncpath-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.11.0, v12.17.0 | En el modo `recursive`, ahora se devuelve la primera ruta creada. |
| v10.12.0 | El segundo argumento ahora puede ser un objeto `options` con las propiedades `recursive` y `mode`. |
| v7.6.0 | El parámetro `path` puede ser un objeto `URL` WHATWG usando el protocolo `file:`. |
| v0.1.21 | Añadido en: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) No soportado en Windows. **Predeterminado:** `0o777`.
  
 
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Crea un directorio de forma síncrona. Devuelve `undefined`, o si `recursive` es `true`, la primera ruta de directorio creada. Esta es la versión síncrona de [`fs.mkdir()`](/es/nodejs/api/fs#fsmkdirpath-options-callback).

Consulte la documentación POSIX [`mkdir(2)`](http://man7.org/linux/man-pages/man2/mkdir.2) para obtener más detalles.

### `fs.mkdtempSync(prefix[, options])` {#fsmkdtempsyncprefix-options}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.6.0, v18.19.0 | El parámetro `prefix` ahora acepta buffers y URL. |
| v16.5.0, v14.18.0 | El parámetro `prefix` ahora acepta una cadena vacía. |
| v5.10.0 | Añadido en: v5.10.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'utf8'`
  
 
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve la ruta del directorio creado.

Para obtener información detallada, consulte la documentación de la versión asíncrona de esta API: [`fs.mkdtemp()`](/es/nodejs/api/fs#fsmkdtempprefix-options-callback).

El argumento opcional `options` puede ser una cadena que especifique una codificación, o un objeto con una propiedad `encoding` que especifique la codificación de caracteres a utilizar.


### `fs.opendirSync(path[, options])` {#fsopendirsyncpath-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.1.0, v18.17.0 | Se agregó la opción `recursive`. |
| v13.1.0, v12.16.0 | Se introdujo la opción `bufferSize`. |
| v12.12.0 | Agregado en: v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de entradas de directorio que se almacenan en búfer internamente al leer del directorio. Los valores más altos conducen a un mejor rendimiento pero a un mayor uso de memoria. **Predeterminado:** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `false`

- Devuelve: [\<fs.Dir\>](/es/nodejs/api/fs#class-fsdir)

Abre sincrónicamente un directorio. Consulte [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3).

Crea un [\<fs.Dir\>](/es/nodejs/api/fs#class-fsdir), que contiene todas las funciones adicionales para leer y limpiar el directorio.

La opción `encoding` establece la codificación para el `path` al abrir el directorio y las operaciones de lectura posteriores.

### `fs.openSync(path[, flags[, mode]])` {#fsopensyncpath-flags-mode}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v11.1.0 | El argumento `flags` ahora es opcional y su valor predeterminado es `'r'`. |
| v9.9.0 | Ahora se admiten los flags `as` y `as+`. |
| v7.6.0 | El parámetro `path` puede ser un objeto WHATWG `URL` usando el protocolo `file:`. |
| v0.1.21 | Agregado en: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `'r'`. Consulte [soporte de `flags` del sistema de archivos](/es/nodejs/api/fs#file-system-flags).
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0o666`
- Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Devuelve un entero que representa el descriptor de archivo.

Para obtener información detallada, consulte la documentación de la versión asíncrona de esta API: [`fs.open()`](/es/nodejs/api/fs#fsopenpath-flags-mode-callback).


### `fs.readdirSync(path[, options])` {#fsreaddirsyncpath-options}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v20.1.0, v18.17.0 | Se añadió la opción `recursive`. |
| v10.10.0 | Se añadió la nueva opción `withFileTypes`. |
| v7.6.0 | El parámetro `path` puede ser un objeto `URL` WHATWG utilizando el protocolo `file:`. |
| v0.1.21 | Añadido en: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, lee el contenido de un directorio de forma recursiva. En el modo recursivo, listará todos los archivos, subarchivos y directorios. **Predeterminado:** `false`.
  
 
- Devuelve: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/es/nodejs/api/buffer#class-buffer) | [\<fs.Dirent[]\>](/es/nodejs/api/fs#class-fsdirent)

Lee el contenido del directorio.

Consulte la documentación de POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) para obtener más detalles.

El argumento opcional `options` puede ser una cadena que especifique una codificación, o un objeto con una propiedad `encoding` que especifique la codificación de caracteres que se utilizará para los nombres de archivo devueltos. Si la `encoding` se establece en `'buffer'`, los nombres de archivo devueltos se pasarán como objetos [\<Buffer\>](/es/nodejs/api/buffer#class-buffer).

Si `options.withFileTypes` se establece en `true`, el resultado contendrá objetos [\<fs.Dirent\>](/es/nodejs/api/fs#class-fsdirent).


### `fs.readFileSync(path[, options])` {#fsreadfilesyncpath-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v7.6.0 | El parámetro `path` puede ser un objeto `URL` de WHATWG utilizando el protocolo `file:`. |
| v5.0.0 | El parámetro `path` ahora puede ser un descriptor de archivo. |
| v0.1.8 | Añadido en: v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nombre de archivo o descriptor de archivo
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ver [soporte de `flags` del sistema de archivos](/es/nodejs/api/fs#file-system-flags). **Predeterminado:** `'r'`.
  
 
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Devuelve el contenido del `path`.

Para obtener información detallada, consulte la documentación de la versión asíncrona de esta API: [`fs.readFile()`](/es/nodejs/api/fs#fsreadfilepath-options-callback).

Si se especifica la opción `encoding`, esta función devuelve una cadena. De lo contrario, devuelve un buffer.

Similar a [`fs.readFile()`](/es/nodejs/api/fs#fsreadfilepath-options-callback), cuando la ruta es un directorio, el comportamiento de `fs.readFileSync()` es específico de la plataforma.

```js [ESM]
import { readFileSync } from 'node:fs';

// macOS, Linux, y Windows
readFileSync('<directorio>');
// => [Error: EISDIR: operación ilegal en un directorio, read <directorio>]

//  FreeBSD
readFileSync('<directorio>'); // => <data>
```

### `fs.readlinkSync(path[, options])` {#fsreadlinksyncpath-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v7.6.0 | El parámetro `path` puede ser un objeto `URL` WHATWG usando el protocolo `file:`. |
| v0.1.31 | Añadido en: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'utf8'`


- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Devuelve el valor de cadena del enlace simbólico.

Consulte la documentación de POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2) para obtener más detalles.

El argumento opcional `options` puede ser una cadena que especifique una codificación o un objeto con una propiedad `encoding` que especifique la codificación de caracteres que se utilizará para la ruta del enlace devuelto. Si la `encoding` se establece en `'buffer'`, la ruta del enlace devuelto se pasará como un objeto [\<Buffer\>](/es/nodejs/api/buffer#class-buffer).

### `fs.readSync(fd, buffer, offset, length[, position])` {#fsreadsyncfd-buffer-offset-length-position}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.10.0 | El parámetro `buffer` ahora puede ser cualquier `TypedArray` o un `DataView`. |
| v6.0.0 | El parámetro `length` ahora puede ser `0`. |
| v0.1.21 | Añadido en: v0.1.21 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `null`
- Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Devuelve el número de `bytesRead`.

Para obtener información detallada, consulte la documentación de la versión asíncrona de esta API: [`fs.read()`](/es/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback).


### `fs.readSync(fd, buffer[, options])` {#fsreadsyncfd-buffer-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.13.0, v12.17.0 | Se puede pasar un objeto de opciones para que offset, length y position sean opcionales. |
| v13.13.0, v12.17.0 | Añadido en: v13.13.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `null`

- Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Devuelve el número de `bytesRead`.

Similar a la función `fs.readSync` anterior, esta versión toma un objeto `options` opcional. Si no se especifica ningún objeto `options`, se establecerá de forma predeterminada con los valores anteriores.

Para obtener información detallada, consulte la documentación de la versión asíncrona de esta API: [`fs.read()`](/es/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback).

### `fs.readvSync(fd, buffers[, position])` {#fsreadvsyncfd-buffers-position}

**Añadido en: v13.13.0, v12.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `null`
- Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes leídos.

Para obtener información detallada, consulte la documentación de la versión asíncrona de esta API: [`fs.readv()`](/es/nodejs/api/fs#fsreadvfd-buffers-position-callback).


### `fs.realpathSync(path[, options])` {#fsrealpathsyncpath-options}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v8.0.0 | Se añadió soporte para la resolución de Pipe/Socket. |
| v7.6.0 | El parámetro `path` puede ser un objeto `URL` WHATWG usando el protocolo `file:`. |
| v6.4.0 | La llamada a `realpathSync` ahora funciona de nuevo para varios casos límite en Windows. |
| v6.0.0 | Se eliminó el parámetro `cache`. |
| v0.1.31 | Añadido en: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'utf8'`
  
 
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Devuelve el nombre de ruta resuelto.

Para obtener información detallada, consulte la documentación de la versión asíncrona de esta API: [`fs.realpath()`](/es/nodejs/api/fs#fsrealpathpath-options-callback).

### `fs.realpathSync.native(path[, options])` {#fsrealpathsyncnativepath-options}

**Añadido en: v9.2.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'utf8'`
  
 
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

[`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3) sincrónico.

Solo se admiten las rutas que se pueden convertir en cadenas UTF8.

El argumento opcional `options` puede ser una cadena que especifique una codificación o un objeto con una propiedad `encoding` que especifique la codificación de caracteres que se utilizará para la ruta devuelta. Si el `encoding` se establece en `'buffer'`, la ruta devuelta se pasará como un objeto [\<Buffer\>](/es/nodejs/api/buffer#class-buffer).

En Linux, cuando Node.js está vinculado a musl libc, el sistema de archivos procfs debe estar montado en `/proc` para que esta función funcione. Glibc no tiene esta restricción.


### `fs.renameSync(oldPath, newPath)` {#fsrenamesyncoldpath-newpath}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v7.6.0 | Los parámetros `oldPath` y `newPath` pueden ser objetos `URL` WHATWG utilizando el protocolo `file:`. El soporte es actualmente *experimental*. |
| v0.1.21 | Añadido en: v0.1.21 |
:::

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)

Cambia el nombre del archivo de `oldPath` a `newPath`. Regresa `undefined`.

Consulte la documentación POSIX [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2) para obtener más detalles.

### `fs.rmdirSync(path[, options])` {#fsrmdirsyncpath-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.0.0 | Ya no se permite el uso de `fs.rmdirSync(path, { recursive: true })` en una `path` que es un archivo y da como resultado un error `ENOENT` en Windows y un error `ENOTDIR` en POSIX. |
| v16.0.0 | Ya no se permite el uso de `fs.rmdirSync(path, { recursive: true })` en una `path` que no existe y da como resultado un error `ENOENT`. |
| v16.0.0 | La opción `recursive` está obsoleta, usarla desencadena una advertencia de obsolescencia. |
| v14.14.0 | La opción `recursive` está obsoleta, use `fs.rmSync` en su lugar. |
| v13.3.0, v12.16.0 | La opción `maxBusyTries` ha sido renombrada a `maxRetries`, y su valor por defecto es 0. La opción `emfileWait` ha sido eliminada, y los errores `EMFILE` usan la misma lógica de reintento que otros errores. Ahora se soporta la opción `retryDelay`. Ahora se reintentan los errores `ENFILE`. |
| v12.10.0 | Ahora se soportan las opciones `recursive`, `maxBusyTries` y `emfileWait`. |
| v7.6.0 | Los parámetros `path` pueden ser un objeto `URL` WHATWG utilizando el protocolo `file:`. |
| v0.1.21 | Añadido en: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si se encuentra un error `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` o `EPERM`, Node.js reintenta la operación con una espera de retroceso lineal de `retryDelay` milisegundos más larga en cada intento. Esta opción representa el número de reintentos. Esta opción se ignora si la opción `recursive` no es `true`. **Predeterminado:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, realiza una eliminación de directorio recursiva. En el modo recursivo, las operaciones se reintentan en caso de fallo. **Predeterminado:** `false`. **Obsoleto.**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La cantidad de tiempo en milisegundos que se espera entre reintentos. Esta opción se ignora si la opción `recursive` no es `true`. **Predeterminado:** `100`.

[`rmdir(2)`](http://man7.org/linux/man-pages/man2/rmdir.2) Síncrono. Regresa `undefined`.

Usar `fs.rmdirSync()` en un archivo (no un directorio) resulta en un error `ENOENT` en Windows y un error `ENOTDIR` en POSIX.

Para obtener un comportamiento similar al comando Unix `rm -rf`, use [`fs.rmSync()`](/es/nodejs/api/fs#fsrmsyncpath-options) con las opciones `{ recursive: true, force: true }`.


### `fs.rmSync(path[, options])` {#fsrmsyncpath-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.3.0, v16.14.0 | El parámetro `path` puede ser un objeto `URL` WHATWG usando el protocolo `file:`. |
| v14.14.0 | Añadido en: v14.14.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, las excepciones se ignorarán si `path` no existe. **Predeterminado:** `false`.
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si se encuentra un error `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` o `EPERM`, Node.js reintentará la operación con una espera de retroceso lineal de `retryDelay` milisegundos más larga en cada intento. Esta opción representa el número de reintentos. Esta opción se ignora si la opción `recursive` no es `true`. **Predeterminado:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, realiza una eliminación de directorio recursiva. En el modo recursivo, las operaciones se reintentan en caso de fallo. **Predeterminado:** `false`.
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La cantidad de tiempo en milisegundos que se espera entre reintentos. Esta opción se ignora si la opción `recursive` no es `true`. **Predeterminado:** `100`.

Elimina sincrónicamente archivos y directorios (siguiendo el modelo de la utilidad estándar POSIX `rm`). Devuelve `undefined`.

### `fs.statSync(path[, options])` {#fsstatsyncpath-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.3.0, v14.17.0 | Acepta una opción `throwIfNoEntry` para especificar si se debe lanzar una excepción si la entrada no existe. |
| v10.5.0 | Acepta un objeto `options` adicional para especificar si los valores numéricos devueltos deben ser bigint. |
| v7.6.0 | El parámetro `path` puede ser un objeto `URL` WHATWG usando el protocolo `file:`. |
| v0.1.21 | Añadido en: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si los valores numéricos en el objeto [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) devuelto deben ser `bigint`. **Predeterminado:** `false`.
    - `throwIfNoEntry` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si se lanzará una excepción si no existe ninguna entrada del sistema de archivos, en lugar de devolver `undefined`. **Predeterminado:** `true`.

- Devuelve: [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats)

Recupera el [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) para la ruta.


### `fs.statfsSync(path[, options])` {#fsstatfssyncpath-options}

**Añadido en: v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si los valores numéricos en el objeto [\<fs.StatFs\>](/es/nodejs/api/fs#class-fsstatfs) devuelto deben ser `bigint`. **Predeterminado:** `false`.


- Devuelve: [\<fs.StatFs\>](/es/nodejs/api/fs#class-fsstatfs)

[`statfs(2)`](http://man7.org/linux/man-pages/man2/statfs.2) síncrono. Devuelve información sobre el sistema de archivos montado que contiene `path`.

En caso de un error, el `err.code` será uno de los [Errores comunes del sistema](/es/nodejs/api/errors#common-system-errors).

### `fs.symlinkSync(target, path[, type])` {#fssymlinksynctarget-path-type}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.0.0 | Si el argumento `type` se deja sin definir, Node autodectará el tipo de `target` y seleccionará automáticamente `dir` o `file`. |
| v7.6.0 | Los parámetros `target` y `path` pueden ser objetos `URL` WHATWG usando el protocolo `file:`. El soporte todavía es *experimental*. |
| v0.1.31 | Añadido en: v0.1.31 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `null`

Devuelve `undefined`.

Para obtener información detallada, consulte la documentación de la versión asíncrona de esta API: [`fs.symlink()`](/es/nodejs/api/fs#fssymlinktarget-path-type-callback).


### `fs.truncateSync(path[, len])` {#fstruncatesyncpath-len}

**Agregado en: v0.8.6**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0`

Trunca el archivo. Devuelve `undefined`. También se puede pasar un descriptor de archivo como primer argumento. En este caso, se llama a `fs.ftruncateSync()`.

Pasar un descriptor de archivo está obsoleto y puede provocar que se produzca un error en el futuro.

### `fs.unlinkSync(path)` {#fsunlinksyncpath}


::: info [Historial]
| Version | Cambios |
| --- | --- |
| v7.6.0 | El parámetro `path` puede ser un objeto `URL` WHATWG que utiliza el protocolo `file:`. |
| v0.1.21 | Agregado en: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)

[`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2) sincrónico. Devuelve `undefined`.

### `fs.utimesSync(path, atime, mtime)` {#fsutimessyncpath-atime-mtime}


::: info [Historial]
| Version | Cambios |
| --- | --- |
| v8.0.0 | `NaN`, `Infinity` y `-Infinity` ya no son especificadores de tiempo válidos. |
| v7.6.0 | El parámetro `path` puede ser un objeto `URL` WHATWG que utiliza el protocolo `file:`. |
| v4.1.0 | Ahora se permiten cadenas numéricas, `NaN` e `Infinity` como especificadores de tiempo. |
| v0.4.2 | Agregado en: v0.4.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Devuelve `undefined`.

Para obtener información detallada, consulte la documentación de la versión asíncrona de esta API: [`fs.utimes()`](/es/nodejs/api/fs#fsutimespath-atime-mtime-callback).


### `fs.writeFileSync(file, data[, options])` {#fswritefilesyncfile-data-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.0.0, v20.10.0 | Ahora se admite la opción `flush`. |
| v19.0.0 | Ya no se admite pasar al parámetro `data` un objeto con una función `toString` propia. |
| v17.8.0 | Pasar al parámetro `data` un objeto con una función `toString` propia está obsoleto. |
| v14.12.0 | El parámetro `data` convertirá en cadena un objeto con una función `toString` explícita. |
| v14.0.0 | El parámetro `data` ya no forzará la conversión de entradas no admitidas a cadenas. |
| v10.10.0 | El parámetro `data` ahora puede ser cualquier `TypedArray` o un `DataView`. |
| v7.4.0 | El parámetro `data` ahora puede ser un `Uint8Array`. |
| v5.0.0 | El parámetro `file` ahora puede ser un descriptor de archivo. |
| v0.1.29 | Añadido en: v0.1.29 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nombre de archivo o descriptor de archivo
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Consulte el [soporte de `flags` del sistema de archivos](/es/nodejs/api/fs#file-system-flags). **Predeterminado:** `'w'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si todos los datos se escriben correctamente en el archivo y `flush` es `true`, se utiliza `fs.fsyncSync()` para vaciar los datos.

Devuelve `undefined`.

La opción `mode` solo afecta al archivo recién creado. Consulte [`fs.open()`](/es/nodejs/api/fs#fsopenpath-flags-mode-callback) para obtener más detalles.

Para obtener información detallada, consulte la documentación de la versión asíncrona de esta API: [`fs.writeFile()`](/es/nodejs/api/fs#fswritefilefile-data-options-callback).


### `fs.writeSync(fd, buffer, offset[, length[, position]])` {#fswritesyncfd-buffer-offset-length-position}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.0.0 | El parámetro `buffer` ya no forzará la entrada no admitida a cadenas. |
| v10.10.0 | El parámetro `buffer` ahora puede ser cualquier `TypedArray` o `DataView`. |
| v7.4.0 | El parámetro `buffer` ahora puede ser un `Uint8Array`. |
| v7.2.0 | Los parámetros `offset` y `length` ahora son opcionales. |
| v0.1.21 | Añadido en: v0.1.21 |
:::

- `fd` [\<entero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<entero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0`
- `length` [\<entero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `buffer.byteLength - offset`
- `position` [\<entero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `null`
- Devuelve: [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes escritos.

Para obtener información detallada, consulte la documentación de la versión asíncrona de esta API: [`fs.write(fd, buffer...)`](/es/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback).

### `fs.writeSync(fd, buffer[, options])` {#fswritesyncfd-buffer-options}

**Agregado en: v18.3.0, v16.17.0**

- `fd` [\<entero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `offset` [\<entero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0`
    - `length` [\<entero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `buffer.byteLength - offset`
    - `position` [\<entero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `null`
  
 
- Devuelve: [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes escritos.

Para obtener información detallada, consulte la documentación de la versión asíncrona de esta API: [`fs.write(fd, buffer...)`](/es/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback).


### `fs.writeSync(fd, string[, position[, encoding]])` {#fswritesyncfd-string-position-encoding}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.0.0 | El parámetro `string` ya no forzará la entrada no compatible a cadenas. |
| v7.2.0 | El parámetro `position` ahora es opcional. |
| v0.11.5 | Añadido en: v0.11.5 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'utf8'`
- Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes escritos.

Para obtener información detallada, consulte la documentación de la versión asíncrona de esta API: [`fs.write(fd, string...)`](/es/nodejs/api/fs#fswritefd-string-position-encoding-callback).

### `fs.writevSync(fd, buffers[, position])` {#fswritevsyncfd-buffers-position}

**Añadido en: v12.9.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Predeterminado:** `null`
- Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes escritos.

Para obtener información detallada, consulte la documentación de la versión asíncrona de esta API: [`fs.writev()`](/es/nodejs/api/fs#fswritevfd-buffers-position-callback).

## Objetos Comunes {#common-objects}

Los objetos comunes son compartidos por todas las variantes de la API del sistema de archivos (promesa, callback y síncrona).


### Clase: `fs.Dir` {#class-fsdir}

**Añadido en: v12.12.0**

Una clase que representa un flujo de directorio.

Creado por [`fs.opendir()`](/es/nodejs/api/fs#fsopendirpath-options-callback), [`fs.opendirSync()`](/es/nodejs/api/fs#fsopendirsyncpath-options), o [`fsPromises.opendir()`](/es/nodejs/api/fs#fspromisesopendirpath-options).

```js [ESM]
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name);
} catch (err) {
  console.error(err);
}
```
Cuando se utiliza el iterador asíncrono, el objeto [\<fs.Dir\>](/es/nodejs/api/fs#class-fsdir) se cerrará automáticamente después de que salga el iterador.

#### `dir.close()` {#dirclose}

**Añadido en: v12.12.0**

- Devuelve: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Cierra asíncronamente el controlador de recursos subyacente del directorio. Las lecturas posteriores darán como resultado errores.

Se devuelve una promesa que se cumplirá después de que se haya cerrado el recurso.

#### `dir.close(callback)` {#dirclosecallback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una función callback inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v12.12.0 | Añadido en: v12.12.0 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Cierra asíncronamente el controlador de recursos subyacente del directorio. Las lecturas posteriores darán como resultado errores.

Se llamará a la `callback` después de que se haya cerrado el controlador de recursos.

#### `dir.closeSync()` {#dirclosesync}

**Añadido en: v12.12.0**

Cierra sincrónicamente el controlador de recursos subyacente del directorio. Las lecturas posteriores darán como resultado errores.

#### `dir.path` {#dirpath}

**Añadido en: v12.12.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La ruta de solo lectura de este directorio tal como se proporcionó a [`fs.opendir()`](/es/nodejs/api/fs#fsopendirpath-options-callback), [`fs.opendirSync()`](/es/nodejs/api/fs#fsopendirsyncpath-options), o [`fsPromises.opendir()`](/es/nodejs/api/fs#fspromisesopendirpath-options).


#### `dir.read()` {#dirread}

**Agregado en: v12.12.0**

- Regresa: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se cumple con un [\<fs.Dirent\>](/es/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Lee asíncronamente la siguiente entrada de directorio a través de [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) como un [\<fs.Dirent\>](/es/nodejs/api/fs#class-fsdirent).

Se devuelve una promesa que se cumplirá con un [\<fs.Dirent\>](/es/nodejs/api/fs#class-fsdirent), o `null` si no hay más entradas de directorio para leer.

Las entradas de directorio devueltas por esta función no están en un orden particular, tal como las proporcionan los mecanismos de directorio subyacentes del sistema operativo. Las entradas añadidas o eliminadas mientras se itera sobre el directorio podrían no estar incluidas en los resultados de la iteración.

#### `dir.read(callback)` {#dirreadcallback}

**Agregado en: v12.12.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `dirent` [\<fs.Dirent\>](/es/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
  
 

Lee asíncronamente la siguiente entrada de directorio a través de [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) como un [\<fs.Dirent\>](/es/nodejs/api/fs#class-fsdirent).

Una vez completada la lectura, se llamará a la `callback` con un [\<fs.Dirent\>](/es/nodejs/api/fs#class-fsdirent), o `null` si no hay más entradas de directorio para leer.

Las entradas de directorio devueltas por esta función no están en un orden particular, tal como las proporcionan los mecanismos de directorio subyacentes del sistema operativo. Las entradas añadidas o eliminadas mientras se itera sobre el directorio podrían no estar incluidas en los resultados de la iteración.

#### `dir.readSync()` {#dirreadsync}

**Agregado en: v12.12.0**

- Regresa: [\<fs.Dirent\>](/es/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Lee sincrónicamente la siguiente entrada de directorio como un [\<fs.Dirent\>](/es/nodejs/api/fs#class-fsdirent). Consulte la documentación POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) para obtener más detalles.

Si no hay más entradas de directorio para leer, se devolverá `null`.

Las entradas de directorio devueltas por esta función no están en un orden particular, tal como las proporcionan los mecanismos de directorio subyacentes del sistema operativo. Las entradas añadidas o eliminadas mientras se itera sobre el directorio podrían no estar incluidas en los resultados de la iteración.


#### `dir[Symbol.asyncIterator]()` {#dirsymbolasynciterator}

**Agregado en: v12.12.0**

- Devuelve: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) Un AsyncIterator de [\<fs.Dirent\>](/es/nodejs/api/fs#class-fsdirent)

Itera asíncronamente sobre el directorio hasta que se hayan leído todas las entradas. Consulte la documentación de POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) para obtener más detalles.

Las entradas devueltas por el iterador asíncrono son siempre un [\<fs.Dirent\>](/es/nodejs/api/fs#class-fsdirent). El caso `null` de `dir.read()` se maneja internamente.

Consulte [\<fs.Dir\>](/es/nodejs/api/fs#class-fsdir) para ver un ejemplo.

Las entradas del directorio devueltas por este iterador no están en un orden particular, tal como lo proporcionan los mecanismos de directorio subyacentes del sistema operativo. Es posible que las entradas añadidas o eliminadas mientras se itera sobre el directorio no se incluyan en los resultados de la iteración.

### Clase: `fs.Dirent` {#class-fsdirent}

**Agregado en: v10.10.0**

Una representación de una entrada de directorio, que puede ser un archivo o un subdirectorio dentro del directorio, tal como lo devuelve la lectura de un [\<fs.Dir\>](/es/nodejs/api/fs#class-fsdir). La entrada de directorio es una combinación del nombre del archivo y los pares de tipo de archivo.

Además, cuando se llama a [`fs.readdir()`](/es/nodejs/api/fs#fsreaddirpath-options-callback) o [`fs.readdirSync()`](/es/nodejs/api/fs#fsreaddirsyncpath-options) con la opción `withFileTypes` establecida en `true`, la matriz resultante se rellena con objetos [\<fs.Dirent\>](/es/nodejs/api/fs#class-fsdirent), en lugar de cadenas o [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)s.

#### `dirent.isBlockDevice()` {#direntisblockdevice}

**Agregado en: v10.10.0**

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el objeto [\<fs.Dirent\>](/es/nodejs/api/fs#class-fsdirent) describe un dispositivo de bloque.

#### `dirent.isCharacterDevice()` {#direntischaracterdevice}

**Agregado en: v10.10.0**

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el objeto [\<fs.Dirent\>](/es/nodejs/api/fs#class-fsdirent) describe un dispositivo de caracteres.


#### `dirent.isDirectory()` {#direntisdirectory}

**Agregado en: v10.10.0**

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el objeto [\<fs.Dirent\>](/es/nodejs/api/fs#class-fsdirent) describe un directorio del sistema de archivos.

#### `dirent.isFIFO()` {#direntisfifo}

**Agregado en: v10.10.0**

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el objeto [\<fs.Dirent\>](/es/nodejs/api/fs#class-fsdirent) describe una tubería primero en entrar, primero en salir (FIFO).

#### `dirent.isFile()` {#direntisfile}

**Agregado en: v10.10.0**

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el objeto [\<fs.Dirent\>](/es/nodejs/api/fs#class-fsdirent) describe un archivo regular.

#### `dirent.isSocket()` {#direntissocket}

**Agregado en: v10.10.0**

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el objeto [\<fs.Dirent\>](/es/nodejs/api/fs#class-fsdirent) describe un socket.

#### `dirent.isSymbolicLink()` {#direntissymboliclink}

**Agregado en: v10.10.0**

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el objeto [\<fs.Dirent\>](/es/nodejs/api/fs#class-fsdirent) describe un enlace simbólico.

#### `dirent.name` {#direntname}

**Agregado en: v10.10.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

El nombre del archivo al que se refiere este objeto [\<fs.Dirent\>](/es/nodejs/api/fs#class-fsdirent). El tipo de este valor está determinado por `options.encoding` pasado a [`fs.readdir()`](/es/nodejs/api/fs#fsreaddirpath-options-callback) o [`fs.readdirSync()`](/es/nodejs/api/fs#fsreaddirsyncpath-options).

#### `dirent.parentPath` {#direntparentpath}

**Agregado en: v21.4.0, v20.12.0, v18.20.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La ruta al directorio padre del archivo al que se refiere este objeto [\<fs.Dirent\>](/es/nodejs/api/fs#class-fsdirent).


#### `dirent.path` {#direntpath}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.2.0 | La propiedad ya no es de solo lectura. |
| v23.0.0 | Acceder a esta propiedad emite una advertencia. Ahora es de solo lectura. |
| v21.5.0, v20.12.0, v18.20.0 | Obsoleto desde: v21.5.0, v20.12.0, v18.20.0 |
| v20.1.0, v18.17.0 | Agregado en: v20.1.0, v18.17.0 |
:::

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Utilice [`dirent.parentPath`](/es/nodejs/api/fs#direntparentpath) en su lugar.
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Alias para `dirent.parentPath`.

### Clase: `fs.FSWatcher` {#class-fsfswatcher}

**Agregado en: v0.5.8**

- Extiende [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter)

Una llamada exitosa al método [`fs.watch()`](/es/nodejs/api/fs#fswatchfilename-options-listener) devolverá un nuevo objeto [\<fs.FSWatcher\>](/es/nodejs/api/fs#class-fsfswatcher).

Todos los objetos [\<fs.FSWatcher\>](/es/nodejs/api/fs#class-fsfswatcher) emiten un evento `'change'` cada vez que se modifica un archivo vigilado específico.

#### Evento: `'change'` {#event-change}

**Agregado en: v0.5.8**

- `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El tipo de evento de cambio que ha ocurrido
- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) El nombre de archivo que cambió (si es relevante/está disponible)

Emitido cuando algo cambia en un directorio o archivo vigilado. Consulte más detalles en [`fs.watch()`](/es/nodejs/api/fs#fswatchfilename-options-listener).

El argumento `filename` puede no ser proporcionado dependiendo del soporte del sistema operativo. Si se proporciona `filename`, se proporcionará como un [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) si se llama a `fs.watch()` con su opción `encoding` establecida en `'buffer'`, de lo contrario `filename` será una cadena UTF-8.

```js [ESM]
import { watch } from 'node:fs';
// Ejemplo cuando se gestiona a través del listener fs.watch()
watch('./tmp', { encoding: 'buffer' }, (eventType, filename) => {
  if (filename) {
    console.log(filename);
    // Imprime: <Buffer ...>
  }
});
```

#### Evento: `'close'` {#event-close_1}

**Agregado en: v10.0.0**

Se emite cuando el observador deja de observar los cambios. El objeto [\<fs.FSWatcher\>](/es/nodejs/api/fs#class-fsfswatcher) cerrado ya no se puede usar en el controlador de eventos.

#### Evento: `'error'` {#event-error}

**Agregado en: v0.5.8**

- `error` [\<Error\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Error)

Se emite cuando se produce un error al observar el archivo. El objeto [\<fs.FSWatcher\>](/es/nodejs/api/fs#class-fsfswatcher) con errores ya no se puede usar en el controlador de eventos.

#### `watcher.close()` {#watcherclose}

**Agregado en: v0.5.8**

Deja de observar los cambios en el [\<fs.FSWatcher\>](/es/nodejs/api/fs#class-fsfswatcher) dado. Una vez detenido, el objeto [\<fs.FSWatcher\>](/es/nodejs/api/fs#class-fsfswatcher) ya no se puede usar.

#### `watcher.ref()` {#watcherref}

**Agregado en: v14.3.0, v12.20.0**

- Devuelve: [\<fs.FSWatcher\>](/es/nodejs/api/fs#class-fsfswatcher)

Cuando se llama, solicita que el bucle de eventos de Node.js *no* salga mientras el [\<fs.FSWatcher\>](/es/nodejs/api/fs#class-fsfswatcher) esté activo. Llamar a `watcher.ref()` varias veces no tendrá ningún efecto.

De forma predeterminada, todos los objetos [\<fs.FSWatcher\>](/es/nodejs/api/fs#class-fsfswatcher) están "referenciados", por lo que normalmente es innecesario llamar a `watcher.ref()` a menos que se haya llamado a `watcher.unref()` previamente.

#### `watcher.unref()` {#watcherunref}

**Agregado en: v14.3.0, v12.20.0**

- Devuelve: [\<fs.FSWatcher\>](/es/nodejs/api/fs#class-fsfswatcher)

Cuando se llama, el objeto [\<fs.FSWatcher\>](/es/nodejs/api/fs#class-fsfswatcher) activo no requerirá que el bucle de eventos de Node.js permanezca activo. Si no hay otra actividad que mantenga el bucle de eventos en ejecución, el proceso puede salir antes de que se invoque la función de retrollamada del objeto [\<fs.FSWatcher\>](/es/nodejs/api/fs#class-fsfswatcher). Llamar a `watcher.unref()` varias veces no tendrá ningún efecto.

### Clase: `fs.StatWatcher` {#class-fsstatwatcher}

**Agregado en: v14.3.0, v12.20.0**

- Extiende [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter)

Una llamada exitosa al método `fs.watchFile()` devolverá un nuevo objeto [\<fs.StatWatcher\>](/es/nodejs/api/fs#class-fsstatwatcher).

#### `watcher.ref()` {#watcherref_1}

**Agregado en: v14.3.0, v12.20.0**

- Devuelve: [\<fs.StatWatcher\>](/es/nodejs/api/fs#class-fsstatwatcher)

Cuando se llama, solicita que el bucle de eventos de Node.js *no* salga mientras el [\<fs.StatWatcher\>](/es/nodejs/api/fs#class-fsstatwatcher) esté activo. Llamar a `watcher.ref()` varias veces no tendrá ningún efecto.

De forma predeterminada, todos los objetos [\<fs.StatWatcher\>](/es/nodejs/api/fs#class-fsstatwatcher) están "referenciados", por lo que normalmente es innecesario llamar a `watcher.ref()` a menos que se haya llamado a `watcher.unref()` previamente.


#### `watcher.unref()` {#watcherunref_1}

**Agregado en: v14.3.0, v12.20.0**

- Devuelve: [\<fs.StatWatcher\>](/es/nodejs/api/fs#class-fsstatwatcher)

Cuando se llama, el objeto [\<fs.StatWatcher\>](/es/nodejs/api/fs#class-fsstatwatcher) activo no requerirá que el bucle de eventos de Node.js permanezca activo. Si no hay otra actividad que mantenga el bucle de eventos en ejecución, el proceso puede salir antes de que se invoque la función callback del objeto [\<fs.StatWatcher\>](/es/nodejs/api/fs#class-fsstatwatcher). Llamar a `watcher.unref()` varias veces no tendrá ningún efecto.

### Clase: `fs.ReadStream` {#class-fsreadstream}

**Agregado en: v0.1.93**

- Extiende: [\<stream.Readable\>](/es/nodejs/api/stream#class-streamreadable)

Las instancias de [\<fs.ReadStream\>](/es/nodejs/api/fs#class-fsreadstream) se crean y se devuelven utilizando la función [`fs.createReadStream()`](/es/nodejs/api/fs#fscreatereadstreampath-options).

#### Evento: `'close'` {#event-close_2}

**Agregado en: v0.1.93**

Emitido cuando se ha cerrado el descriptor de fichero subyacente de [\<fs.ReadStream\>](/es/nodejs/api/fs#class-fsreadstream).

#### Evento: `'open'` {#event-open}

**Agregado en: v0.1.93**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Descriptor de fichero entero utilizado por [\<fs.ReadStream\>](/es/nodejs/api/fs#class-fsreadstream).

Emitido cuando se ha abierto el descriptor de fichero de [\<fs.ReadStream\>](/es/nodejs/api/fs#class-fsreadstream).

#### Evento: `'ready'` {#event-ready}

**Agregado en: v9.11.0**

Emitido cuando [\<fs.ReadStream\>](/es/nodejs/api/fs#class-fsreadstream) está listo para ser utilizado.

Se dispara inmediatamente después de `'open'`.

#### `readStream.bytesRead` {#readstreambytesread}

**Agregado en: v6.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El número de bytes que se han leído hasta ahora.

#### `readStream.path` {#readstreampath}

**Agregado en: v0.1.93**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

La ruta al fichero desde el que el flujo está leyendo, tal y como se especifica en el primer argumento de `fs.createReadStream()`. Si `path` se pasa como una cadena, entonces `readStream.path` será una cadena. Si `path` se pasa como un [\<Buffer\>](/es/nodejs/api/buffer#class-buffer), entonces `readStream.path` será un [\<Buffer\>](/es/nodejs/api/buffer#class-buffer). Si se especifica `fd`, entonces `readStream.path` será `undefined`.


#### `readStream.pending` {#readstreampending}

**Agregado en: v11.2.0, v10.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Esta propiedad es `true` si el archivo subyacente aún no se ha abierto, es decir, antes de que se emita el evento `'ready'`.

### Clase: `fs.Stats` {#class-fsstats}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v22.0.0, v20.13.0 | El constructor público está obsoleto. |
| v8.1.0 | Se agregaron tiempos como números. |
| v0.1.21 | Agregado en: v0.1.21 |
:::

Un objeto [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) proporciona información sobre un archivo.

Los objetos devueltos por [`fs.stat()`](/es/nodejs/api/fs#fsstatpath-options-callback), [`fs.lstat()`](/es/nodejs/api/fs#fslstatpath-options-callback), [`fs.fstat()`](/es/nodejs/api/fs#fsfstatfd-options-callback) y sus contrapartes síncronas son de este tipo. Si `bigint` en las `opciones` pasadas a esos métodos es verdadero, los valores numéricos serán `bigint` en lugar de `number`, y el objeto contendrá propiedades adicionales con precisión de nanosegundos con el sufijo `Ns`. Los objetos `Stat` no deben crearse directamente utilizando la palabra clave `new`.

```bash [BASH]
Stats {
  dev: 2114,
  ino: 48064969,
  mode: 33188,
  nlink: 1,
  uid: 85,
  gid: 100,
  rdev: 0,
  size: 527,
  blksize: 4096,
  blocks: 8,
  atimeMs: 1318289051000.1,
  mtimeMs: 1318289051000.1,
  ctimeMs: 1318289051000.1,
  birthtimeMs: 1318289051000.1,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
```
Versión `bigint`:

```bash [BASH]
BigIntStats {
  dev: 2114n,
  ino: 48064969n,
  mode: 33188n,
  nlink: 1n,
  uid: 85n,
  gid: 100n,
  rdev: 0n,
  size: 527n,
  blksize: 4096n,
  blocks: 8n,
  atimeMs: 1318289051000n,
  mtimeMs: 1318289051000n,
  ctimeMs: 1318289051000n,
  birthtimeMs: 1318289051000n,
  atimeNs: 1318289051000000000n,
  mtimeNs: 1318289051000000000n,
  ctimeNs: 1318289051000000000n,
  birthtimeNs: 1318289051000000000n,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
```

#### `stats.isBlockDevice()` {#statsisblockdevice}

**Agregado en: v0.1.10**

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el objeto [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) describe un dispositivo de bloque.

#### `stats.isCharacterDevice()` {#statsischaracterdevice}

**Agregado en: v0.1.10**

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el objeto [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) describe un dispositivo de caracteres.

#### `stats.isDirectory()` {#statsisdirectory}

**Agregado en: v0.1.10**

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el objeto [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) describe un directorio del sistema de archivos.

Si el objeto [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) se obtuvo al llamar a [`fs.lstat()`](/es/nodejs/api/fs#fslstatpath-options-callback) en un enlace simbólico que se resuelve en un directorio, este método devolverá `false`. Esto se debe a que [`fs.lstat()`](/es/nodejs/api/fs#fslstatpath-options-callback) devuelve información sobre un enlace simbólico en sí y no sobre la ruta a la que se resuelve.

#### `stats.isFIFO()` {#statsisfifo}

**Agregado en: v0.1.10**

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el objeto [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) describe una tubería primero en entrar, primero en salir (FIFO).

#### `stats.isFile()` {#statsisfile}

**Agregado en: v0.1.10**

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el objeto [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) describe un archivo regular.

#### `stats.isSocket()` {#statsissocket}

**Agregado en: v0.1.10**

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el objeto [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) describe un socket.

#### `stats.isSymbolicLink()` {#statsissymboliclink}

**Agregado en: v0.1.10**

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` si el objeto [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) describe un enlace simbólico.

Este método solo es válido cuando se utiliza [`fs.lstat()`](/es/nodejs/api/fs#fslstatpath-options-callback).


#### `stats.dev` {#statsdev}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

El identificador numérico del dispositivo que contiene el archivo.

#### `stats.ino` {#statsino}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

El número de "Inode" específico del sistema de archivos para el archivo.

#### `stats.mode` {#statsmode}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Un campo de bits que describe el tipo y el modo del archivo.

#### `stats.nlink` {#statsnlink}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

El número de enlaces físicos que existen para el archivo.

#### `stats.uid` {#statsuid}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

El identificador numérico del usuario propietario del archivo (POSIX).

#### `stats.gid` {#statsgid}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

El identificador numérico del grupo propietario del archivo (POSIX).

#### `stats.rdev` {#statsrdev}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Un identificador numérico del dispositivo si el archivo representa un dispositivo.

#### `stats.size` {#statssize}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

El tamaño del archivo en bytes.

Si el sistema de archivos subyacente no admite la obtención del tamaño del archivo, esto será `0`.


#### `stats.blksize` {#statsblksize}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

El tamaño del bloque del sistema de archivos para las operaciones de E/S.

#### `stats.blocks` {#statsblocks}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

El número de bloques asignados para este archivo.

#### `stats.atimeMs` {#statsatimems}

**Añadido en: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

La marca de tiempo que indica la última vez que se accedió a este archivo expresada en milisegundos desde la época POSIX.

#### `stats.mtimeMs` {#statsmtimems}

**Añadido en: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

La marca de tiempo que indica la última vez que se modificó este archivo expresada en milisegundos desde la época POSIX.

#### `stats.ctimeMs` {#statsctimems}

**Añadido en: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

La marca de tiempo que indica la última vez que se cambió el estado del archivo expresada en milisegundos desde la época POSIX.

#### `stats.birthtimeMs` {#statsbirthtimems}

**Añadido en: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

La marca de tiempo que indica la hora de creación de este archivo expresada en milisegundos desde la época POSIX.

#### `stats.atimeNs` {#statsatimens}

**Añadido en: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Solo presente cuando se pasa `bigint: true` al método que genera el objeto. La marca de tiempo que indica la última vez que se accedió a este archivo expresada en nanosegundos desde la época POSIX.


#### `stats.mtimeNs` {#statsmtimens}

**Agregado en: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Solo presente cuando se pasa `bigint: true` al método que genera el objeto. La marca de tiempo que indica la última vez que se modificó este archivo, expresada en nanosegundos desde la Época POSIX.

#### `stats.ctimeNs` {#statsctimens}

**Agregado en: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Solo presente cuando se pasa `bigint: true` al método que genera el objeto. La marca de tiempo que indica la última vez que se cambió el estado del archivo, expresada en nanosegundos desde la Época POSIX.

#### `stats.birthtimeNs` {#statsbirthtimens}

**Agregado en: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Solo presente cuando se pasa `bigint: true` al método que genera el objeto. La marca de tiempo que indica la hora de creación de este archivo, expresada en nanosegundos desde la Época POSIX.

#### `stats.atime` {#statsatime}

**Agregado en: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

La marca de tiempo que indica la última vez que se accedió a este archivo.

#### `stats.mtime` {#statsmtime}

**Agregado en: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

La marca de tiempo que indica la última vez que se modificó este archivo.

#### `stats.ctime` {#statsctime}

**Agregado en: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

La marca de tiempo que indica la última vez que se cambió el estado del archivo.

#### `stats.birthtime` {#statsbirthtime}

**Agregado en: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

La marca de tiempo que indica la hora de creación de este archivo.

#### Valores de tiempo de Stat {#stat-time-values}

Las propiedades `atimeMs`, `mtimeMs`, `ctimeMs`, `birthtimeMs` son valores numéricos que contienen los tiempos correspondientes en milisegundos. Su precisión es específica de la plataforma. Cuando se pasa `bigint: true` al método que genera el objeto, las propiedades serán [bigints](https://tc39.github.io/proposal-bigint), de lo contrario serán [números](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type).

Las propiedades `atimeNs`, `mtimeNs`, `ctimeNs`, `birthtimeNs` son [bigints](https://tc39.github.io/proposal-bigint) que contienen los tiempos correspondientes en nanosegundos. Solo están presentes cuando se pasa `bigint: true` al método que genera el objeto. Su precisión es específica de la plataforma.

`atime`, `mtime`, `ctime` y `birthtime` son representaciones alternativas de objeto [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) de los diversos tiempos. Los valores `Date` y numéricos no están conectados. Asignar un nuevo valor numérico o mutar el valor `Date` no se reflejará en la representación alternativa correspondiente.

Los tiempos en el objeto stat tienen la siguiente semántica:

- `atime` "Tiempo de acceso": Hora en que se accedió por última vez a los datos del archivo. Cambiado por las llamadas al sistema [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2), [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2) y [`read(2)`](http://man7.org/linux/man-pages/man2/read.2).
- `mtime` "Tiempo de modificación": Hora en que se modificaron por última vez los datos del archivo. Cambiado por las llamadas al sistema [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2), [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2) y [`write(2)`](http://man7.org/linux/man-pages/man2/write.2).
- `ctime` "Tiempo de cambio": Hora en que se cambió por última vez el estado del archivo (modificación de datos de inode). Cambiado por las llamadas al sistema [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2), [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2), [`link(2)`](http://man7.org/linux/man-pages/man2/link.2), [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2), [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2), [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2), [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2), [`read(2)`](http://man7.org/linux/man-pages/man2/read.2) y [`write(2)`](http://man7.org/linux/man-pages/man2/write.2).
- `birthtime` "Tiempo de nacimiento": Hora de creación del archivo. Se establece una vez cuando se crea el archivo. En los sistemas de archivos donde el tiempo de nacimiento no está disponible, este campo puede contener el `ctime` o `1970-01-01T00:00Z` (es decir, la marca de tiempo de la época de Unix `0`). En este caso, este valor puede ser mayor que `atime` o `mtime`. En Darwin y otras variantes de FreeBSD, también se establece si el `atime` se establece explícitamente en un valor anterior al `birthtime` actual utilizando la llamada al sistema [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2).

Antes de Node.js 0.12, el `ctime` contenía el `birthtime` en los sistemas Windows. A partir de la versión 0.12, `ctime` no es "tiempo de creación" y, en los sistemas Unix, nunca lo fue.


### Clase: `fs.StatFs` {#class-fsstatfs}

**Agregado en: v19.6.0, v18.15.0**

Proporciona información sobre un sistema de archivos montado.

Los objetos devueltos por [`fs.statfs()`](/es/nodejs/api/fs#fsstatfspath-options-callback) y su contraparte síncrona son de este tipo. Si `bigint` en las `options` pasadas a esos métodos es `true`, los valores numéricos serán `bigint` en lugar de `number`.

```bash [BASH]
StatFs {
  type: 1397114950,
  bsize: 4096,
  blocks: 121938943,
  bfree: 61058895,
  bavail: 61058895,
  files: 999,
  ffree: 1000000
}
```
Versión `bigint`:

```bash [BASH]
StatFs {
  type: 1397114950n,
  bsize: 4096n,
  blocks: 121938943n,
  bfree: 61058895n,
  bavail: 61058895n,
  files: 999n,
  ffree: 1000000n
}
```
#### `statfs.bavail` {#statfsbavail}

**Agregado en: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Bloques libres disponibles para usuarios sin privilegios.

#### `statfs.bfree` {#statfsbfree}

**Agregado en: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Bloques libres en el sistema de archivos.

#### `statfs.blocks` {#statfsblocks}

**Agregado en: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Bloques de datos totales en el sistema de archivos.

#### `statfs.bsize` {#statfsbsize}

**Agregado en: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Tamaño óptimo del bloque de transferencia.

#### `statfs.ffree` {#statfsffree}

**Agregado en: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Nodos de archivo libres en el sistema de archivos.


#### `statfs.files` {#statfsfiles}

**Agregado en: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Nodos de archivos totales en el sistema de archivos.

#### `statfs.type` {#statfstype}

**Agregado en: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Tipo de sistema de archivos.

### Clase: `fs.WriteStream` {#class-fswritestream}

**Agregado en: v0.1.93**

- Extiende [\<stream.Writable\>](/es/nodejs/api/stream#class-streamwritable)

Las instancias de [\<fs.WriteStream\>](/es/nodejs/api/fs#class-fswritestream) se crean y se devuelven utilizando la función [`fs.createWriteStream()`](/es/nodejs/api/fs#fscreatewritestreampath-options).

#### Evento: `'close'` {#event-close_3}

**Agregado en: v0.1.93**

Se emite cuando se ha cerrado el descriptor de archivo subyacente de [\<fs.WriteStream\>](/es/nodejs/api/fs#class-fswritestream).

#### Evento: `'open'` {#event-open_1}

**Agregado en: v0.1.93**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Descriptor de archivo entero utilizado por [\<fs.WriteStream\>](/es/nodejs/api/fs#class-fswritestream).

Se emite cuando se abre el archivo de [\<fs.WriteStream\>](/es/nodejs/api/fs#class-fswritestream).

#### Evento: `'ready'` {#event-ready_1}

**Agregado en: v9.11.0**

Se emite cuando el [\<fs.WriteStream\>](/es/nodejs/api/fs#class-fswritestream) está listo para ser usado.

Se dispara inmediatamente después de `'open'`.

#### `writeStream.bytesWritten` {#writestreambyteswritten}

**Agregado en: v0.4.7**

El número de bytes escritos hasta ahora. No incluye los datos que aún están en cola para ser escritos.

#### `writeStream.close([callback])` {#writestreamclosecallback}

**Agregado en: v0.9.4**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Cierra `writeStream`. Opcionalmente acepta una retrollamada que se ejecutará una vez que se cierre `writeStream`.


#### `writeStream.path` {#writestreampath}

**Agregado en: v0.1.93**

La ruta al archivo al que la transmisión está escribiendo, como se especifica en el primer argumento de [`fs.createWriteStream()`](/es/nodejs/api/fs#fscreatewritestreampath-options). Si `path` se pasa como una cadena, entonces `writeStream.path` será una cadena. Si `path` se pasa como un [\<Buffer\>](/es/nodejs/api/buffer#class-buffer), entonces `writeStream.path` será un [\<Buffer\>](/es/nodejs/api/buffer#class-buffer).

#### `writeStream.pending` {#writestreampending}

**Agregado en: v11.2.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Esta propiedad es `true` si el archivo subyacente aún no se ha abierto, es decir, antes de que se emita el evento `'ready'`.

### `fs.constants` {#fsconstants}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Devuelve un objeto que contiene constantes de uso común para las operaciones del sistema de archivos.

#### Constantes FS {#fs-constants}

Las siguientes constantes son exportadas por `fs.constants` y `fsPromises.constants`.

No todas las constantes estarán disponibles en todos los sistemas operativos; esto es especialmente importante para Windows, donde muchas de las definiciones específicas de POSIX no están disponibles. Para aplicaciones portátiles, se recomienda verificar su presencia antes de usarlas.

Para usar más de una constante, use el operador OR bit a bit `|`.

Ejemplo:

```js [ESM]
import { open, constants } from 'node:fs';

const {
  O_RDWR,
  O_CREAT,
  O_EXCL,
} = constants;

open('/path/to/my/file', O_RDWR | O_CREAT | O_EXCL, (err, fd) => {
  // ...
});
```
##### Constantes de acceso a archivos {#file-access-constants}

Las siguientes constantes están destinadas a ser utilizadas como el parámetro `mode` pasado a [`fsPromises.access()`](/es/nodejs/api/fs#fspromisesaccesspath-mode), [`fs.access()`](/es/nodejs/api/fs#fsaccesspath-mode-callback) y [`fs.accessSync()`](/es/nodejs/api/fs#fsaccesssyncpath-mode).

| Constante | Descripción |
| --- | --- |
| `F_OK` | Indicador que indica que el archivo es visible para el proceso que llama. Esto es útil para determinar si existe un archivo, pero no dice nada sobre los permisos `rwx`. Predeterminado si no se especifica ningún modo. |
| `R_OK` | Indicador que indica que el archivo puede ser leído por el proceso que llama. |
| `W_OK` | Indicador que indica que el archivo puede ser escrito por el proceso que llama. |
| `X_OK` | Indicador que indica que el archivo puede ser ejecutado por el proceso que llama. Esto no tiene ningún efecto en Windows (se comportará como `fs.constants.F_OK`). |
Las definiciones también están disponibles en Windows.


##### Constantes de copia de archivos {#file-copy-constants}

Las siguientes constantes están destinadas para su uso con [`fs.copyFile()`](/es/nodejs/api/fs#fscopyfilesrc-dest-mode-callback).

| Constante | Descripción |
| --- | --- |
| `COPYFILE_EXCL` | Si está presente, la operación de copia fallará con un error si la ruta de destino ya existe. |
| `COPYFILE_FICLONE` | Si está presente, la operación de copia intentará crear un reflink de copia en escritura. Si la plataforma subyacente no admite la copia en escritura, se utiliza un mecanismo de copia de respaldo. |
| `COPYFILE_FICLONE_FORCE` | Si está presente, la operación de copia intentará crear un reflink de copia en escritura. Si la plataforma subyacente no admite la copia en escritura, la operación fallará con un error. |
Las definiciones también están disponibles en Windows.

##### Constantes de apertura de archivos {#file-open-constants}

Las siguientes constantes están destinadas para su uso con `fs.open()`.

| Constante | Descripción |
| --- | --- |
| `O_RDONLY` | Indicador que indica abrir un archivo para acceso de solo lectura. |
| `O_WRONLY` | Indicador que indica abrir un archivo para acceso de solo escritura. |
| `O_RDWR` | Indicador que indica abrir un archivo para acceso de lectura y escritura. |
| `O_CREAT` | Indicador que indica crear el archivo si aún no existe. |
| `O_EXCL` | Indicador que indica que la apertura de un archivo debería fallar si el indicador `O_CREAT` está establecido y el archivo ya existe. |
| `O_NOCTTY` | Indicador que indica que si la ruta identifica un dispositivo de terminal, la apertura de la ruta no causará que ese terminal se convierta en el terminal de control para el proceso (si el proceso aún no tiene uno). |
| `O_TRUNC` | Indicador que indica que si el archivo existe y es un archivo regular, y el archivo se abre correctamente para acceso de escritura, su longitud se truncará a cero. |
| `O_APPEND` | Indicador que indica que los datos se agregarán al final del archivo. |
| `O_DIRECTORY` | Indicador que indica que la apertura debería fallar si la ruta no es un directorio. |
| `O_NOATIME` | Indicador que indica que los accesos de lectura al sistema de archivos ya no resultarán en una actualización de la información `atime` asociada con el archivo. Este indicador está disponible solo en los sistemas operativos Linux. |
| `O_NOFOLLOW` | Indicador que indica que la apertura debería fallar si la ruta es un enlace simbólico. |
| `O_SYNC` | Indicador que indica que el archivo está abierto para E/S sincronizada con operaciones de escritura que esperan la integridad del archivo. |
| `O_DSYNC` | Indicador que indica que el archivo está abierto para E/S sincronizada con operaciones de escritura que esperan la integridad de los datos. |
| `O_SYMLINK` | Indicador para abrir el enlace simbólico en sí en lugar del recurso al que apunta. |
| `O_DIRECT` | Cuando se establece, se intentará minimizar los efectos de almacenamiento en caché de la E/S de archivos. |
| `O_NONBLOCK` | Indicador que indica abrir el archivo en modo no bloqueante cuando sea posible. |
| `UV_FS_O_FILEMAP` | Cuando se establece, se utiliza una asignación de archivos en memoria para acceder al archivo. Este indicador está disponible solo en los sistemas operativos Windows. En otros sistemas operativos, este indicador se ignora. |
En Windows, solo están disponibles `O_APPEND`, `O_CREAT`, `O_EXCL`, `O_RDONLY`, `O_RDWR`, `O_TRUNC`, `O_WRONLY` y `UV_FS_O_FILEMAP`.


##### Constantes de tipo de archivo {#file-type-constants}

Las siguientes constantes están pensadas para ser usadas con la propiedad `mode` del objeto [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) para determinar el tipo de un archivo.

| Constante | Descripción |
| --- | --- |
| `S_IFMT` | Máscara de bits utilizada para extraer el código de tipo de archivo. |
| `S_IFREG` | Constante de tipo de archivo para un archivo regular. |
| `S_IFDIR` | Constante de tipo de archivo para un directorio. |
| `S_IFCHR` | Constante de tipo de archivo para un archivo de dispositivo orientado a caracteres. |
| `S_IFBLK` | Constante de tipo de archivo para un archivo de dispositivo orientado a bloques. |
| `S_IFIFO` | Constante de tipo de archivo para un FIFO/pipe. |
| `S_IFLNK` | Constante de tipo de archivo para un enlace simbólico. |
| `S_IFSOCK` | Constante de tipo de archivo para un socket. |
En Windows, solo están disponibles `S_IFCHR`, `S_IFDIR`, `S_IFLNK`, `S_IFMT` y `S_IFREG`.

##### Constantes de modo de archivo {#file-mode-constants}

Las siguientes constantes están pensadas para ser usadas con la propiedad `mode` del objeto [\<fs.Stats\>](/es/nodejs/api/fs#class-fsstats) para determinar los permisos de acceso para un archivo.

| Constante | Descripción |
| --- | --- |
| `S_IRWXU` | Modo de archivo que indica legible, escribible y ejecutable por el propietario. |
| `S_IRUSR` | Modo de archivo que indica legible por el propietario. |
| `S_IWUSR` | Modo de archivo que indica escribible por el propietario. |
| `S_IXUSR` | Modo de archivo que indica ejecutable por el propietario. |
| `S_IRWXG` | Modo de archivo que indica legible, escribible y ejecutable por el grupo. |
| `S_IRGRP` | Modo de archivo que indica legible por el grupo. |
| `S_IWGRP` | Modo de archivo que indica escribible por el grupo. |
| `S_IXGRP` | Modo de archivo que indica ejecutable por el grupo. |
| `S_IRWXO` | Modo de archivo que indica legible, escribible y ejecutable por otros. |
| `S_IROTH` | Modo de archivo que indica legible por otros. |
| `S_IWOTH` | Modo de archivo que indica escribible por otros. |
| `S_IXOTH` | Modo de archivo que indica ejecutable por otros. |
En Windows, solo están disponibles `S_IRUSR` y `S_IWUSR`.

## Notas {#notes}

### Ordenamiento de operaciones basadas en callback y promesas {#ordering-of-callback-and-promise-based-operations}

Dado que son ejecutadas asíncronamente por el pool de hilos subyacente, no hay un orden garantizado al usar los métodos basados en callback o promesas.

Por ejemplo, lo siguiente es propenso a errores porque la operación `fs.stat()` podría completarse antes de la operación `fs.rename()`:

```js [ESM]
const fs = require('node:fs');

fs.rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  console.log('renamed complete');
});
fs.stat('/tmp/world', (err, stats) => {
  if (err) throw err;
  console.log(`stats: ${JSON.stringify(stats)}`);
});
```
Es importante ordenar correctamente las operaciones esperando los resultados de una antes de invocar la otra:



::: code-group
```js [ESM]
import { rename, stat } from 'node:fs/promises';

const oldPath = '/tmp/hello';
const newPath = '/tmp/world';

try {
  await rename(oldPath, newPath);
  const stats = await stat(newPath);
  console.log(`stats: ${JSON.stringify(stats)}`);
} catch (error) {
  console.error('there was an error:', error.message);
}
```

```js [CJS]
const { rename, stat } = require('node:fs/promises');

(async function(oldPath, newPath) {
  try {
    await rename(oldPath, newPath);
    const stats = await stat(newPath);
    console.log(`stats: ${JSON.stringify(stats)}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})('/tmp/hello', '/tmp/world');
```
:::

O, al usar las API de callback, mueva la llamada a `fs.stat()` al callback de la operación `fs.rename()`:



::: code-group
```js [ESM]
import { rename, stat } from 'node:fs';

rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  stat('/tmp/world', (err, stats) => {
    if (err) throw err;
    console.log(`stats: ${JSON.stringify(stats)}`);
  });
});
```

```js [CJS]
const { rename, stat } = require('node:fs/promises');

rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  stat('/tmp/world', (err, stats) => {
    if (err) throw err;
    console.log(`stats: ${JSON.stringify(stats)}`);
  });
});
```
:::


### Rutas de archivos {#file-paths}

La mayoría de las operaciones de `fs` aceptan rutas de archivo que pueden especificarse en forma de cadena, [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) o un objeto [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) utilizando el protocolo `file:`.

#### Rutas de cadena {#string-paths}

Las rutas de cadena se interpretan como secuencias de caracteres UTF-8 que identifican el nombre de archivo absoluto o relativo. Las rutas relativas se resolverán en relación con el directorio de trabajo actual, determinado llamando a `process.cwd()`.

Ejemplo usando una ruta absoluta en POSIX:

```js [ESM]
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('/open/some/file.txt', 'r');
  // Hacer algo con el archivo
} finally {
  await fd?.close();
}
```
Ejemplo usando una ruta relativa en POSIX (relativa a `process.cwd()`):

```js [ESM]
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('file.txt', 'r');
  // Hacer algo con el archivo
} finally {
  await fd?.close();
}
```
#### Rutas de URL de archivo {#file-url-paths}

**Agregado en: v7.6.0**

Para la mayoría de las funciones del módulo `node:fs`, el argumento `path` o `filename` puede pasarse como un objeto [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) utilizando el protocolo `file:`.

```js [ESM]
import { readFileSync } from 'node:fs';

readFileSync(new URL('file:///tmp/hello'));
```
Las URL `file:` son siempre rutas absolutas.

##### Consideraciones específicas de la plataforma {#platform-specific-considerations}

En Windows, las [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) `file:` con un nombre de host se convierten en rutas UNC, mientras que las [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) `file:` con letras de unidad se convierten en rutas absolutas locales. Las [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) `file:` sin nombre de host y sin letra de unidad provocarán un error:

```js [ESM]
import { readFileSync } from 'node:fs';
// En Windows :

// - Las URL de archivo WHATWG con nombre de host se convierten en ruta UNC
// file://hostname/p/a/t/h/file => \\hostname\p\a\t\h\file
readFileSync(new URL('file://hostname/p/a/t/h/file'));

// - Las URL de archivo WHATWG con letras de unidad se convierten en ruta absoluta
// file:///C:/tmp/hello => C:\tmp\hello
readFileSync(new URL('file:///C:/tmp/hello'));

// - Las URL de archivo WHATWG sin nombre de host deben tener letras de unidad
readFileSync(new URL('file:///notdriveletter/p/a/t/h/file'));
readFileSync(new URL('file:///c/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH]: La ruta de la URL del archivo debe ser absoluta
```
Las [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) `file:` con letras de unidad deben usar `:` como separador justo después de la letra de la unidad. El uso de otro separador provocará un error.

En todas las demás plataformas, las [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) `file:` con un nombre de host no son compatibles y provocarán un error:

```js [ESM]
import { readFileSync } from 'node:fs';
// En otras plataformas:

// - Las URL de archivo WHATWG con nombre de host no son compatibles
// file://hostname/p/a/t/h/file => ¡lanzar!
readFileSync(new URL('file://hostname/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH]: debe ser absoluta

// - Las URL de archivo WHATWG se convierten en ruta absoluta
// file:///tmp/hello => /tmp/hello
readFileSync(new URL('file:///tmp/hello'));
```
Una [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) `file:` que tenga caracteres de barra codificados provocará un error en todas las plataformas:

```js [ESM]
import { readFileSync } from 'node:fs';

// En Windows
readFileSync(new URL('file:///C:/p/a/t/h/%2F'));
readFileSync(new URL('file:///C:/p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: La ruta de la URL del archivo no debe incluir caracteres \ o / codificados */

// En POSIX
readFileSync(new URL('file:///p/a/t/h/%2F'));
readFileSync(new URL('file:///p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: La ruta de la URL del archivo no debe incluir caracteres / codificados */
```
En Windows, las [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) `file:` que tengan una barra invertida codificada provocarán un error:

```js [ESM]
import { readFileSync } from 'node:fs';

// En Windows
readFileSync(new URL('file:///C:/path/%5C'));
readFileSync(new URL('file:///C:/path/%5c'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: La ruta de la URL del archivo no debe incluir caracteres \ o / codificados */
```

#### Rutas de búfer {#buffer-paths}

Las rutas especificadas usando un [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) son útiles principalmente en ciertos sistemas operativos POSIX que tratan las rutas de archivo como secuencias de bytes opacas. En tales sistemas, es posible que una sola ruta de archivo contenga sub-secuencias que usan múltiples codificaciones de caracteres. Al igual que con las rutas de cadena, las rutas [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) pueden ser relativas o absolutas:

Ejemplo usando una ruta absoluta en POSIX:

```js [ESM]
import { open } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

let fd;
try {
  fd = await open(Buffer.from('/open/some/file.txt'), 'r');
  // Hacer algo con el archivo
} finally {
  await fd?.close();
}
```
#### Directorios de trabajo por unidad en Windows {#per-drive-working-directories-on-windows}

En Windows, Node.js sigue el concepto de directorio de trabajo por unidad. Este comportamiento se puede observar cuando se usa una ruta de unidad sin una barra invertida. Por ejemplo, `fs.readdirSync('C:\\')` puede devolver un resultado diferente a `fs.readdirSync('C:')`. Para obtener más información, consulte [esta página de MSDN](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#fully-qualified-vs-relative-paths).

### Descriptores de archivo {#file-descriptors_1}

En los sistemas POSIX, para cada proceso, el kernel mantiene una tabla de archivos y recursos actualmente abiertos. A cada archivo abierto se le asigna un identificador numérico simple llamado *descriptor de archivo*. A nivel de sistema, todas las operaciones del sistema de archivos utilizan estos descriptores de archivo para identificar y rastrear cada archivo específico. Los sistemas Windows utilizan un mecanismo diferente pero conceptualmente similar para rastrear los recursos. Para simplificar las cosas para los usuarios, Node.js abstrae las diferencias entre los sistemas operativos y asigna a todos los archivos abiertos un descriptor de archivo numérico.

Los métodos `fs.open()` basados en callbacks, y `fs.openSync()` síncrono abren un archivo y asignan un nuevo descriptor de archivo. Una vez asignado, el descriptor de archivo puede utilizarse para leer datos, escribir datos o solicitar información sobre el archivo.

Los sistemas operativos limitan el número de descriptores de archivo que pueden estar abiertos en cualquier momento, por lo que es fundamental cerrar el descriptor cuando se completan las operaciones. Si no lo hace, se producirá una fuga de memoria que acabará provocando el fallo de la aplicación.

```js [ESM]
import { open, close, fstat } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('/open/some/file.txt', 'r', (err, fd) => {
  if (err) throw err;
  try {
    fstat(fd, (err, stat) => {
      if (err) {
        closeFd(fd);
        throw err;
      }

      // use stat

      closeFd(fd);
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
});
```
Las APIs basadas en promesas usan un objeto [\<FileHandle\>](/es/nodejs/api/fs#class-filehandle) en lugar del descriptor de archivo numérico. Estos objetos están mejor gestionados por el sistema para garantizar que no se filtren recursos. Sin embargo, sigue siendo necesario cerrarlos cuando se completan las operaciones:

```js [ESM]
import { open } from 'node:fs/promises';

let file;
try {
  file = await open('/open/some/file.txt', 'r');
  const stat = await file.stat();
  // use stat
} finally {
  await file.close();
}
```

### Uso del Threadpool {#threadpool-usage}

Todas las APIs del sistema de archivos basadas en callbacks y promesas (con la excepción de `fs.FSWatcher()`) utilizan el threadpool de libuv. Esto puede tener implicaciones de rendimiento sorprendentes y negativas para algunas aplicaciones. Consulta la documentación de [`UV_THREADPOOL_SIZE`](/es/nodejs/api/cli#uv_threadpool_sizesize) para obtener más información.

### Flags del sistema de archivos {#file-system-flags}

Los siguientes flags están disponibles donde la opción `flag` toma una cadena.

-  `'a'`: Abre el archivo para añadir contenido. El archivo se crea si no existe.
-  `'ax'`: Similar a `'a'` pero falla si la ruta existe.
-  `'a+'`: Abre el archivo para lectura y para añadir contenido. El archivo se crea si no existe.
-  `'ax+'`: Similar a `'a+'` pero falla si la ruta existe.
-  `'as'`: Abre el archivo para añadir contenido en modo síncrono. El archivo se crea si no existe.
-  `'as+'`: Abre el archivo para lectura y para añadir contenido en modo síncrono. El archivo se crea si no existe.
-  `'r'`: Abre el archivo para lectura. Se produce una excepción si el archivo no existe.
-  `'rs'`: Abre el archivo para lectura en modo síncrono. Se produce una excepción si el archivo no existe.
-  `'r+'`: Abre el archivo para lectura y escritura. Se produce una excepción si el archivo no existe.
-  `'rs+'`: Abre el archivo para lectura y escritura en modo síncrono. Indica al sistema operativo que omita la caché local del sistema de archivos. Esto es principalmente útil para abrir archivos en montajes NFS, ya que permite omitir la caché local potencialmente obsoleta. Tiene un impacto muy real en el rendimiento de E/S, por lo que no se recomienda utilizar este flag a menos que sea necesario. Esto no convierte `fs.open()` o `fsPromises.open()` en una llamada de bloqueo síncrona. Si se desea una operación síncrona, se debe utilizar algo como `fs.openSync()`.
-  `'w'`: Abre el archivo para escritura. El archivo se crea (si no existe) o se trunca (si existe).
-  `'wx'`: Similar a `'w'` pero falla si la ruta existe.
-  `'w+'`: Abre el archivo para lectura y escritura. El archivo se crea (si no existe) o se trunca (si existe).
-  `'wx+'`: Similar a `'w+'` pero falla si la ruta existe.

`flag` también puede ser un número como se documenta en [`open(2)`](http://man7.org/linux/man-pages/man2/open.2); las constantes de uso común están disponibles en `fs.constants`. En Windows, los flags se traducen a sus equivalentes cuando corresponde, por ejemplo, `O_WRONLY` a `FILE_GENERIC_WRITE`, o `O_EXCL|O_CREAT` a `CREATE_NEW`, tal como lo acepta `CreateFileW`.

El flag exclusivo `'x'` (flag `O_EXCL` en [`open(2)`](http://man7.org/linux/man-pages/man2/open.2)) hace que la operación devuelva un error si la ruta ya existe. En POSIX, si la ruta es un enlace simbólico, el uso de `O_EXCL` devuelve un error incluso si el enlace es a una ruta que no existe. El flag exclusivo podría no funcionar con los sistemas de archivos de red.

En Linux, las escrituras posicionales no funcionan cuando el archivo se abre en modo de añadido. El kernel ignora el argumento de posición y siempre añade los datos al final del archivo.

Modificar un archivo en lugar de reemplazarlo puede requerir que la opción `flag` se establezca en `'r+'` en lugar del valor predeterminado `'w'`.

El comportamiento de algunos flags es específico de la plataforma. Como tal, abrir un directorio en macOS y Linux con el flag `'a+'`, como en el ejemplo a continuación, devolverá un error. Por el contrario, en Windows y FreeBSD, se devolverá un descriptor de archivo o un `FileHandle`.

```js [ESM]
// macOS y Linux
fs.open('<directory>', 'a+', (err, fd) => {
  // => [Error: EISDIR: illegal operation on a directory, open <directory>]
});

// Windows y FreeBSD
fs.open('<directory>', 'a+', (err, fd) => {
  // => null, <fd>
});
```
En Windows, abrir un archivo oculto existente usando el flag `'w'` (ya sea a través de `fs.open()`, `fs.writeFile()` o `fsPromises.open()`) fallará con `EPERM`. Los archivos ocultos existentes se pueden abrir para escritura con el flag `'r+'`.

Se puede utilizar una llamada a `fs.ftruncate()` o `filehandle.truncate()` para restablecer el contenido del archivo.

