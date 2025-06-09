---
title: Aplicaciones ejecutables únicas con Node.js
description: Aprende a crear y gestionar aplicaciones ejecutables únicas con Node.js, incluyendo cómo empaquetar tu aplicación, manejar dependencias y considerar aspectos de seguridad.
head:
  - - meta
    - name: og:title
      content: Aplicaciones ejecutables únicas con Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprende a crear y gestionar aplicaciones ejecutables únicas con Node.js, incluyendo cómo empaquetar tu aplicación, manejar dependencias y considerar aspectos de seguridad.
  - - meta
    - name: twitter:title
      content: Aplicaciones ejecutables únicas con Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprende a crear y gestionar aplicaciones ejecutables únicas con Node.js, incluyendo cómo empaquetar tu aplicación, manejar dependencias y considerar aspectos de seguridad.
---


# Aplicaciones ejecutables únicas {#single-executable-applications}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.6.0 | Se agregó soporte para "useSnapshot". |
| v20.6.0 | Se agregó soporte para "useCodeCache". |
| v19.7.0, v18.16.0 | Agregado en: v19.7.0, v18.16.0 |
:::

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo activo
:::

**Código fuente:** [src/node_sea.cc](https://github.com/nodejs/node/blob/v23.5.0/src/node_sea.cc)

Esta característica permite la distribución de una aplicación Node.js convenientemente a un sistema que no tiene Node.js instalado.

Node.js admite la creación de [aplicaciones ejecutables únicas](https://github.com/nodejs/single-executable) al permitir la inyección de un blob preparado por Node.js, que puede contener un script empaquetado, en el binario `node`. Durante el inicio, el programa comprueba si se ha inyectado algo. Si se encuentra el blob, ejecuta el script en el blob. De lo contrario, Node.js funciona como lo hace normalmente.

La función de aplicación ejecutable única actualmente solo admite la ejecución de un único script incrustado utilizando el sistema de módulos [CommonJS](/es/nodejs/api/modules#modules-commonjs-modules).

Los usuarios pueden crear una aplicación ejecutable única a partir de su script empaquetado con el propio binario `node` y cualquier herramienta que pueda inyectar recursos en el binario.

Aquí están los pasos para crear una aplicación ejecutable única utilizando una de esas herramientas, [postject](https://github.com/nodejs/postject):

## Generando blobs de preparación ejecutables únicos {#generating-single-executable-preparation-blobs}

Los blobs de preparación ejecutables únicos que se inyectan en la aplicación se pueden generar utilizando el flag `--experimental-sea-config` del binario Node.js que se utilizará para construir el ejecutable único. Toma una ruta a un archivo de configuración en formato JSON. Si la ruta que se le pasa no es absoluta, Node.js usará la ruta relativa al directorio de trabajo actual.

La configuración actualmente lee los siguientes campos de nivel superior:

```json [JSON]
{
  "main": "/ruta/a/script/empaquetado.js",
  "output": "/ruta/para/escribir/el/blob/generado.blob",
  "disableExperimentalSEAWarning": true, // Predeterminado: false
  "useSnapshot": false,  // Predeterminado: false
  "useCodeCache": true, // Predeterminado: false
  "assets": {  // Opcional
    "a.dat": "/ruta/a/a.dat",
    "b.txt": "/ruta/a/b.txt"
  }
}
```
Si las rutas no son absolutas, Node.js usará la ruta relativa al directorio de trabajo actual. La versión del binario Node.js utilizada para producir el blob debe ser la misma que aquella en la que se inyectará el blob.

Nota: Cuando se generan SEAs multiplataforma (por ejemplo, generar un SEA para `linux-x64` en `darwin-arm64`), `useCodeCache` y `useSnapshot` deben establecerse en false para evitar la generación de ejecutables incompatibles. Dado que el caché de código y las instantáneas solo se pueden cargar en la misma plataforma donde se compilan, el ejecutable generado podría fallar al inicio al intentar cargar el caché de código o las instantáneas creadas en una plataforma diferente.


### Activos {#assets}

Los usuarios pueden incluir activos añadiendo un diccionario de clave-ruta a la configuración como el campo `assets`. En tiempo de compilación, Node.js leería los activos de las rutas especificadas y los empaquetaría en el blob de preparación. En el ejecutable generado, los usuarios pueden recuperar los activos usando las APIs [`sea.getAsset()`](/es/nodejs/api/single-executable-applications#seagetassetkey-encoding) y [`sea.getAssetAsBlob()`](/es/nodejs/api/single-executable-applications#seagetassetasblobkey-options).

```json [JSON]
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/blob.blob",
  "assets": {
    "a.jpg": "/path/to/a.jpg",
    "b.txt": "/path/to/b.txt"
  }
}
```
La aplicación de un solo ejecutable puede acceder a los activos de la siguiente manera:

```js [CJS]
const { getAsset, getAssetAsBlob, getRawAsset } = require('node:sea');
// Devuelve una copia de los datos en un ArrayBuffer.
const image = getAsset('a.jpg');
// Devuelve una cadena decodificada del activo como UTF8.
const text = getAsset('b.txt', 'utf8');
// Devuelve un Blob que contiene el activo.
const blob = getAssetAsBlob('a.jpg');
// Devuelve un ArrayBuffer que contiene el activo en bruto sin copiar.
const raw = getRawAsset('a.jpg');
```
Consulte la documentación de las APIs [`sea.getAsset()`](/es/nodejs/api/single-executable-applications#seagetassetkey-encoding), [`sea.getAssetAsBlob()`](/es/nodejs/api/single-executable-applications#seagetassetasblobkey-options) y [`sea.getRawAsset()`](/es/nodejs/api/single-executable-applications#seagetrawassetkey) para obtener más información.

### Soporte para instantáneas de inicio {#startup-snapshot-support}

El campo `useSnapshot` se puede utilizar para habilitar el soporte de instantáneas de inicio. En este caso, el script `main` no se ejecutaría cuando se inicie el ejecutable final. En cambio, se ejecutaría cuando el blob de preparación de la aplicación de un solo ejecutable se genere en la máquina de compilación. El blob de preparación generado incluiría entonces una instantánea que capturara los estados inicializados por el script `main`. El ejecutable final con el blob de preparación inyectado deserializaría la instantánea en tiempo de ejecución.

Cuando `useSnapshot` es verdadero, el script principal debe invocar la API [`v8.startupSnapshot.setDeserializeMainFunction()`](/es/nodejs/api/v8#v8startupsnapshotsetdeserializemainfunctioncallback-data) para configurar el código que debe ejecutarse cuando el ejecutable final sea lanzado por los usuarios.

El patrón típico para que una aplicación use instantáneas en una aplicación de un solo ejecutable es:

Las restricciones generales de los scripts de instantáneas de inicio también se aplican al script principal cuando se utiliza para construir una instantánea para la aplicación de un solo ejecutable, y el script principal puede utilizar la [`API v8.startupSnapshot`](/es/nodejs/api/v8#startup-snapshot-api) para adaptarse a estas restricciones. Consulte la [documentación sobre el soporte de instantáneas de inicio en Node.js](/es/nodejs/api/cli#--build-snapshot).


### Soporte de caché de código V8 {#v8-code-cache-support}

Cuando `useCodeCache` se establece en `true` en la configuración, durante la generación del blob de preparación del ejecutable único, Node.js compilará el script `main` para generar la caché de código V8. La caché de código generada formaría parte del blob de preparación y se inyectaría en el ejecutable final. Cuando se inicia la aplicación ejecutable única, en lugar de compilar el script `main` desde cero, Node.js usaría la caché de código para acelerar la compilación y luego ejecutaría el script, lo que mejoraría el rendimiento de inicio.

**Nota:** `import()` no funciona cuando `useCodeCache` es `true`.

## En el script principal inyectado {#in-the-injected-main-script}

### API de aplicación de un solo ejecutable {#single-executable-application-api}

El módulo incorporado `node:sea` permite la interacción con la aplicación de un solo ejecutable desde el script principal de JavaScript incrustado en el ejecutable.

#### `sea.isSea()` {#seaissea}

**Agregado en: v21.7.0, v20.12.0**

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si este script se está ejecutando dentro de una aplicación de un solo ejecutable.

### `sea.getAsset(key[, encoding])` {#seagetassetkey-encoding}

**Agregado en: v21.7.0, v20.12.0**

Este método se puede utilizar para recuperar los activos configurados para ser incluidos en la aplicación de un solo ejecutable en tiempo de compilación. Se genera un error cuando no se encuentra ningún activo coincidente.

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) la clave del activo en el diccionario especificado por el campo `assets` en la configuración de la aplicación de un solo ejecutable.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si se especifica, el activo se decodificará como una cadena. Se acepta cualquier codificación admitida por el `TextDecoder`. Si no se especifica, se devolverá un `ArrayBuffer` que contiene una copia del activo.
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)


### `sea.getAssetAsBlob(key[, options])` {#seagetassetasblobkey-options}

**Añadido en: v21.7.0, v20.12.0**

Similar a [`sea.getAsset()`](/es/nodejs/api/single-executable-applications#seagetassetkey-encoding), pero devuelve el resultado en un [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob). Se produce un error cuando no se puede encontrar ningún activo coincidente.

- `key`  [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) la clave para el activo en el diccionario especificado por el campo `assets` en la configuración de la aplicación de un solo ejecutable.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un tipo mime opcional para el blob.
  
 
- Devuelve: [\<Blob\>](/es/nodejs/api/buffer#class-blob)

### `sea.getRawAsset(key)` {#seagetrawassetkey}

**Añadido en: v21.7.0, v20.12.0**

Este método se puede utilizar para recuperar los activos configurados para ser incluidos en la aplicación de un solo ejecutable en tiempo de compilación. Se produce un error cuando no se puede encontrar ningún activo coincidente.

A diferencia de `sea.getAsset()` o `sea.getAssetAsBlob()`, este método no devuelve una copia. En cambio, devuelve el activo sin procesar incluido dentro del ejecutable.

Por ahora, los usuarios deben evitar escribir en el búfer de matriz devuelto. Si la sección inyectada no está marcada como grabable o no está alineada correctamente, es probable que las escrituras en el búfer de matriz devuelto provoquen un bloqueo.

- `key`  [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) la clave para el activo en el diccionario especificado por el campo `assets` en la configuración de la aplicación de un solo ejecutable.
- Devuelve: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

### `require(id)` en el script principal inyectado no está basado en archivos {#requireid-in-the-injected-main-script-is-not-file-based}

`require()` en el script principal inyectado no es lo mismo que [`require()`](/es/nodejs/api/modules#requireid) disponible para módulos que no están inyectados. Tampoco tiene ninguna de las propiedades que no están inyectadas [`require()`](/es/nodejs/api/modules#requireid) tiene excepto [`require.main`](/es/nodejs/api/modules#accessing-the-main-module). Solo se puede utilizar para cargar módulos integrados. Intentar cargar un módulo que solo se puede encontrar en el sistema de archivos arrojará un error.

En lugar de depender de un `require()` basado en archivos, los usuarios pueden agrupar su aplicación en un archivo JavaScript independiente para inyectar en el ejecutable. Esto también asegura un gráfico de dependencia más determinista.

Sin embargo, si todavía se necesita un `require()` basado en archivos, también se puede lograr:

```js [ESM]
const { createRequire } = require('node:module');
require = createRequire(__filename);
```

### `__filename` y `module.filename` en el script principal inyectado {#__filename-and-modulefilename-in-the-injected-main-script}

Los valores de `__filename` y `module.filename` en el script principal inyectado son iguales a [`process.execPath`](/es/nodejs/api/process#processexecpath).

### `__dirname` en el script principal inyectado {#__dirname-in-the-injected-main-script}

El valor de `__dirname` en el script principal inyectado es igual al nombre del directorio de [`process.execPath`](/es/nodejs/api/process#processexecpath).

## Notas {#notes}

### Proceso de creación de una aplicación ejecutable única {#single-executable-application-creation-process}

Una herramienta destinada a crear una aplicación Node.js ejecutable única debe inyectar el contenido del blob preparado con `--experimental-sea-config"` en:

- un recurso llamado `NODE_SEA_BLOB` si el binario `node` es un archivo [PE](https://en.wikipedia.org/wiki/Portable_Executable)
- una sección llamada `NODE_SEA_BLOB` en el segmento `NODE_SEA` si el binario `node` es un archivo [Mach-O](https://en.wikipedia.org/wiki/Mach-O)
- una nota llamada `NODE_SEA_BLOB` si el binario `node` es un archivo [ELF](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format)

Busque en el binario la cadena [fuse](https://www.electronjs.org/docs/latest/tutorial/fuses) `NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2:0` y cambie el último carácter a `1` para indicar que se ha inyectado un recurso.

### Compatibilidad de plataforma {#platform-support}

La compatibilidad con un solo ejecutable se prueba regularmente en CI solo en las siguientes plataformas:

- Windows
- macOS
- Linux (todas las distribuciones [compatibles con Node.js](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list) excepto Alpine y todas las arquitecturas [compatibles con Node.js](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list) excepto s390x)

Esto se debe a la falta de mejores herramientas para generar ejecutables únicos que se puedan usar para probar esta función en otras plataformas.

Las sugerencias para otras herramientas/flujos de trabajo de inyección de recursos son bienvenidas. Inicie una discusión en [https://github.com/nodejs/single-executable/discussions](https://github.com/nodejs/single-executable/discussions) para ayudarnos a documentarlos.

