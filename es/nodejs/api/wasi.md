---
title: Documentación de WASI de Node.js
description: Explora la documentación de Node.js para la Interfaz de Sistema WebAssembly (WASI), detallando cómo usar WASI en entornos Node.js, incluyendo APIs para operaciones de sistema de archivos, variables de entorno y más.
head:
  - - meta
    - name: og:title
      content: Documentación de WASI de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Explora la documentación de Node.js para la Interfaz de Sistema WebAssembly (WASI), detallando cómo usar WASI en entornos Node.js, incluyendo APIs para operaciones de sistema de archivos, variables de entorno y más.
  - - meta
    - name: twitter:title
      content: Documentación de WASI de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Explora la documentación de Node.js para la Interfaz de Sistema WebAssembly (WASI), detallando cómo usar WASI en entornos Node.js, incluyendo APIs para operaciones de sistema de archivos, variables de entorno y más.
---


# Interfaz del sistema WebAssembly (WASI) {#webassembly-system-interface-wasi}

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

**El módulo <code>node:wasi</code> no proporciona actualmente las
propiedades de seguridad integrales del sistema de archivos proporcionadas por algunos tiempos de ejecución de WASI.
El soporte completo para el aislamiento seguro del sistema de archivos puede o no implementarse en el
futuro. Mientras tanto, no confíe en él para ejecutar código que no sea de confianza.**

**Código fuente:** [lib/wasi.js](https://github.com/nodejs/node/blob/v23.5.0/lib/wasi.js)

La API WASI proporciona una implementación de la especificación de la [Interfaz del sistema WebAssembly](https://wasi.dev/). WASI brinda a las aplicaciones WebAssembly acceso al sistema operativo subyacente a través de una colección de funciones similares a POSIX.

::: code-group
```js [ESM]
import { readFile } from 'node:fs/promises';
import { WASI } from 'node:wasi';
import { argv, env } from 'node:process';

const wasi = new WASI({
  version: 'preview1',
  args: argv,
  env,
  preopens: {
    '/local': '/some/real/path/that/wasm/can/access',
  },
});

const wasm = await WebAssembly.compile(
  await readFile(new URL('./demo.wasm', import.meta.url)),
);
const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());

wasi.start(instance);
```

```js [CJS]
'use strict';
const { readFile } = require('node:fs/promises');
const { WASI } = require('node:wasi');
const { argv, env } = require('node:process');
const { join } = require('node:path');

const wasi = new WASI({
  version: 'preview1',
  args: argv,
  env,
  preopens: {
    '/local': '/some/real/path/that/wasm/can/access',
  },
});

(async () => {
  const wasm = await WebAssembly.compile(
    await readFile(join(__dirname, 'demo.wasm')),
  );
  const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());

  wasi.start(instance);
})();
```
:::

Para ejecutar el ejemplo anterior, cree un nuevo archivo de formato de texto WebAssembly llamado `demo.wat`:

```text [TEXT]
(module
    ;; Importa la función fd_write de WASI requerida que escribirá los vectores io dados en stdout
    ;; La firma de la función para fd_write es:
    ;; (Descriptor de archivo, *iovs, iovs_len, nwritten) -> Devuelve el número de bytes escritos
    (import "wasi_snapshot_preview1" "fd_write" (func $fd_write (param i32 i32 i32 i32) (result i32)))

    (memory 1)
    (export "memory" (memory 0))

    ;; Escribe 'hola mundo\n' en la memoria con un desplazamiento de 8 bytes
    ;; Tenga en cuenta la nueva línea final que se requiere para que aparezca el texto
    (data (i32.const 8) "hola mundo\n")

    (func $main (export "_start")
        ;; Creando un nuevo vector io dentro de la memoria lineal
        (i32.store (i32.const 0) (i32.const 8))  ;; iov.iov_base - Este es un puntero al inicio de la cadena 'hola mundo\n'
        (i32.store (i32.const 4) (i32.const 12))  ;; iov.iov_len - La longitud de la cadena 'hola mundo\n'

        (call $fd_write
            (i32.const 1) ;; file_descriptor - 1 para stdout
            (i32.const 0) ;; *iovs - El puntero a la matriz iov, que se almacena en la ubicación de memoria 0
            (i32.const 1) ;; iovs_len - Estamos imprimiendo 1 cadena almacenada en un iov - así que uno.
            (i32.const 20) ;; nwritten - Un lugar en la memoria para almacenar el número de bytes escritos
        )
        drop ;; Descarta el número de bytes escritos de la parte superior de la pila
    )
)
```
Utilice [wabt](https://github.com/WebAssembly/wabt) para compilar `.wat` a `.wasm`

```bash [BASH]
wat2wasm demo.wat
```

## Seguridad {#security}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.2.0, v20.11.0 | Aclarar las propiedades de seguridad de WASI. |
| v21.2.0, v20.11.0 | Agregado en: v21.2.0, v20.11.0 |
:::

WASI proporciona un modelo basado en capacidades a través del cual las aplicaciones reciben sus propias capacidades personalizadas `env`, `preopens`, `stdin`, `stdout`, `stderr` y `exit`.

**El modelo de amenazas actual de Node.js no proporciona un sandboxing seguro como el que está presente en algunos runtimes de WASI.**

Si bien las características de capacidad son compatibles, no forman un modelo de seguridad en Node.js. Por ejemplo, el sandboxing del sistema de archivos se puede eludir con varias técnicas. El proyecto está explorando si estas garantías de seguridad podrían agregarse en el futuro.

## Clase: `WASI` {#class-wasi}

**Agregado en: v13.3.0, v12.16.0**

La clase `WASI` proporciona la API de llamada al sistema WASI y métodos de conveniencia adicionales para trabajar con aplicaciones basadas en WASI. Cada instancia de `WASI` representa un entorno distinto.

### `new WASI([options])` {#new-wasioptions}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.1.0 | El valor predeterminado de returnOnExit cambió a true. |
| v20.0.0 | La opción de versión ahora es obligatoria y no tiene un valor predeterminado. |
| v19.8.0 | Se agregó el campo de versión a las opciones. |
| v13.3.0, v12.16.0 | Agregado en: v13.3.0, v12.16.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `args` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array de strings que la aplicación WebAssembly verá como argumentos de línea de comandos. El primer argumento es la ruta virtual al comando WASI en sí. **Predeterminado:** `[]`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objeto similar a `process.env` que la aplicación WebAssembly verá como su entorno. **Predeterminado:** `{}`.
    - `preopens` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Este objeto representa la estructura de directorios local de la aplicación WebAssembly. Las claves string de `preopens` se tratan como directorios dentro del sistema de archivos. Los valores correspondientes en `preopens` son las rutas reales a esos directorios en la máquina host.
    - `returnOnExit` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) De forma predeterminada, cuando las aplicaciones WASI llaman a `__wasi_proc_exit()`, `wasi.start()` regresará con el código de salida especificado en lugar de terminar el proceso. Configurar esta opción en `false` hará que el proceso de Node.js salga con el código de salida especificado en su lugar. **Predeterminado:** `true`.
    - `stdin` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El descriptor de archivo utilizado como entrada estándar en la aplicación WebAssembly. **Predeterminado:** `0`.
    - `stdout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El descriptor de archivo utilizado como salida estándar en la aplicación WebAssembly. **Predeterminado:** `1`.
    - `stderr` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El descriptor de archivo utilizado como error estándar en la aplicación WebAssembly. **Predeterminado:** `2`.
    - `version` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La versión de WASI solicitada. Actualmente, las únicas versiones admitidas son `unstable` y `preview1`. Esta opción es obligatoria.


### `wasi.getImportObject()` {#wasigetimportobject}

**Añadido en: v19.8.0**

Devuelve un objeto de importación que se puede pasar a `WebAssembly.instantiate()` si no se necesitan otras importaciones WASM más allá de las proporcionadas por WASI.

Si la versión `unstable` se pasó al constructor, devolverá:

```json [JSON]
{ wasi_unstable: wasi.wasiImport }
```
Si la versión `preview1` se pasó al constructor o no se especificó ninguna versión, devolverá:

```json [JSON]
{ wasi_snapshot_preview1: wasi.wasiImport }
```
### `wasi.start(instance)` {#wasistartinstance}

**Añadido en: v13.3.0, v12.16.0**

- `instance` [\<WebAssembly.Instance\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)

Intenta comenzar la ejecución de `instance` como un comando WASI invocando su exportación `_start()`. Si `instance` no contiene una exportación `_start()`, o si `instance` contiene una exportación `_initialize()`, entonces se lanza una excepción.

`start()` requiere que `instance` exporte una [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) llamada `memory`. Si `instance` no tiene una exportación `memory`, se lanza una excepción.

Si se llama a `start()` más de una vez, se lanza una excepción.

### `wasi.initialize(instance)` {#wasiinitializeinstance}

**Añadido en: v14.6.0, v12.19.0**

- `instance` [\<WebAssembly.Instance\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)

Intenta inicializar `instance` como un reactor WASI invocando su exportación `_initialize()`, si está presente. Si `instance` contiene una exportación `_start()`, entonces se lanza una excepción.

`initialize()` requiere que `instance` exporte una [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) llamada `memory`. Si `instance` no tiene una exportación `memory`, se lanza una excepción.

Si se llama a `initialize()` más de una vez, se lanza una excepción.

### `wasi.wasiImport` {#wasiwasiimport}

**Añadido en: v13.3.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`wasiImport` es un objeto que implementa la API de llamada al sistema WASI. Este objeto debe pasarse como la importación `wasi_snapshot_preview1` durante la instanciación de un [`WebAssembly.Instance`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance).

