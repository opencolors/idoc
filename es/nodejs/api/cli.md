---
title: Opciones de CLI de Node.js
description: Esta página proporciona una guía completa sobre las opciones de línea de comandos disponibles en Node.js, detallando cómo usar varios indicadores y argumentos para configurar el entorno de ejecución, gestionar la depuración y controlar el comportamiento de ejecución.
head:
  - - meta
    - name: og:title
      content: Opciones de CLI de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esta página proporciona una guía completa sobre las opciones de línea de comandos disponibles en Node.js, detallando cómo usar varios indicadores y argumentos para configurar el entorno de ejecución, gestionar la depuración y controlar el comportamiento de ejecución.
  - - meta
    - name: twitter:title
      content: Opciones de CLI de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esta página proporciona una guía completa sobre las opciones de línea de comandos disponibles en Node.js, detallando cómo usar varios indicadores y argumentos para configurar el entorno de ejecución, gestionar la depuración y controlar el comportamiento de ejecución.
---


# API de línea de comandos {#command-line-api}

Node.js viene con una variedad de opciones de la CLI. Estas opciones exponen la depuración integrada, múltiples formas de ejecutar scripts y otras opciones de tiempo de ejecución útiles.

Para ver esta documentación como una página de manual en una terminal, ejecute `man node`.

## Sinopsis {#synopsis}

`node [opciones] [opciones de V8] [\<punto-de-entrada-del-programa\> | -e "script" | -] [--] [argumentos]`

`node inspect [\<punto-de-entrada-del-programa\> | -e "script" | \<host\>:\<puerto\>] …`

`node --v8-options`

Ejecute sin argumentos para iniciar el [REPL](/es/nodejs/api/repl).

Para obtener más información sobre `node inspect`, consulte la documentación del [depurador](/es/nodejs/api/debugger).

## Punto de entrada del programa {#program-entry-point}

El punto de entrada del programa es una cadena similar a un especificador. Si la cadena no es una ruta absoluta, se resuelve como una ruta relativa desde el directorio de trabajo actual. Esa ruta se resuelve entonces mediante el cargador de módulos [CommonJS](/es/nodejs/api/modules). Si no se encuentra ningún archivo correspondiente, se lanza un error.

Si se encuentra un archivo, su ruta se pasará al [cargador de módulos ES](/es/nodejs/api/packages#modules-loaders) bajo cualquiera de las siguientes condiciones:

- El programa se inició con una bandera de línea de comandos que obliga a que el punto de entrada se cargue con el cargador de módulos ECMAScript, como `--import`.
- El archivo tiene una extensión `.mjs`.
- El archivo no tiene una extensión `.cjs`, y el archivo `package.json` principal más cercano contiene un campo de nivel superior [`"type"`](/es/nodejs/api/packages#type) con un valor de `"module"`.

De lo contrario, el archivo se carga utilizando el cargador de módulos CommonJS. Consulte [Cargadores de módulos](/es/nodejs/api/packages#modules-loaders) para obtener más detalles.

### Advertencia del punto de entrada del cargador de módulos ECMAScript {#ecmascript-modules-loader-entry-point-caveat}

Al cargar, el [cargador de módulos ES](/es/nodejs/api/packages#modules-loaders) carga el punto de entrada del programa, el comando `node` aceptará como entrada solo archivos con extensiones `.js`, `.mjs` o `.cjs`; y con extensiones `.wasm` cuando [`--experimental-wasm-modules`](/es/nodejs/api/cli#--experimental-wasm-modules) está habilitado.

## Opciones {#options}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v10.12.0 | Ahora también se permiten guiones bajos en lugar de guiones para las opciones de Node.js, además de las opciones de V8. |
:::

Todas las opciones, incluidas las opciones de V8, permiten que las palabras se separen tanto por guiones (`-`) como por guiones bajos (`_`). Por ejemplo, `--pending-deprecation` es equivalente a `--pending_deprecation`.

Si una opción que toma un solo valor (como `--max-http-header-size`) se pasa más de una vez, se utiliza el último valor pasado. Las opciones de la línea de comandos tienen prioridad sobre las opciones pasadas a través de la variable de entorno [`NODE_OPTIONS`](/es/nodejs/api/cli#node_optionsoptions).


### `-` {#-}

**Agregada en: v8.0.0**

Alias para stdin. Análogo al uso de `-` en otras utilidades de línea de comandos, lo que significa que el script se lee desde stdin y el resto de las opciones se pasan a ese script.

### `--` {#--}

**Agregada en: v6.11.0**

Indica el final de las opciones de Node. Pasa el resto de los argumentos al script. Si no se proporciona un nombre de archivo de script o un script eval/print antes de esto, entonces el siguiente argumento se utiliza como nombre de archivo de script.

### `--abort-on-uncaught-exception` {#--abort-on-uncaught-exception}

**Agregada en: v0.10.8**

Abortar en lugar de salir hace que se genere un archivo core para el análisis post-mortem utilizando un depurador (como `lldb`, `gdb` y `mdb`).

Si se pasa este indicador, el comportamiento aún se puede configurar para que no se aborte mediante [`process.setUncaughtExceptionCaptureCallback()`](/es/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) (y mediante el uso del módulo `node:domain` que lo usa).

### `--allow-addons` {#--allow-addons}

**Agregada en: v21.6.0, v20.12.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo activo
:::

Cuando se utiliza el [Modelo de Permisos](/es/nodejs/api/permissions#permission-model), el proceso no podrá utilizar complementos nativos de forma predeterminada. Los intentos de hacerlo generarán un `ERR_DLOPEN_DISABLED` a menos que el usuario pase explícitamente el indicador `--allow-addons` al iniciar Node.js.

Ejemplo:

```js [CJS]
// Intenta requerir un complemento nativo
require('nodejs-addon-example');
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js
node:internal/modules/cjs/loader:1319
  return process.dlopen(module, path.toNamespacedPath(filename));
                 ^

Error: Cannot load native addon because loading addons is disabled.
    at Module._extensions..node (node:internal/modules/cjs/loader:1319:18)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12)
    at Module.require (node:internal/modules/cjs/loader:1115:19)
    at require (node:internal/modules/helpers:130:18)
    at Object.<anonymous> (/home/index.js:1:15)
    at Module._compile (node:internal/modules/cjs/loader:1233:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1287:10)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12) {
  code: 'ERR_DLOPEN_DISABLED'
}
```

### `--allow-child-process` {#--allow-child-process}

**Añadido en: v20.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo activo
:::

Al usar el [Modelo de Permisos](/es/nodejs/api/permissions#permission-model), el proceso no podrá generar ningún proceso hijo de forma predeterminada. Los intentos de hacerlo lanzarán un `ERR_ACCESS_DENIED` a menos que el usuario pase explícitamente el flag `--allow-child-process` al iniciar Node.js.

Ejemplo:

```js [ESM]
const childProcess = require('node:child_process');
// Intento de eludir el permiso
childProcess.spawn('node', ['-e', 'require("fs").writeFileSync("/new-file", "example")']);
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js
node:internal/child_process:388
  const err = this._handle.spawn(options);
                           ^
Error: Access to this API has been restricted
    at ChildProcess.spawn (node:internal/child_process:388:28)
    at Object.spawn (node:child_process:723:9)
    at Object.<anonymous> (/home/index.js:3:14)
    at Module._compile (node:internal/modules/cjs/loader:1120:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1174:10)
    at Module.load (node:internal/modules/cjs/loader:998:32)
    at Module._load (node:internal/modules/cjs/loader:839:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'ChildProcess'
}
```
### `--allow-fs-read` {#--allow-fs-read}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.5.0 | El Modelo de Permisos y los flags --allow-fs son estables. |
| v20.7.0 | Las rutas delimitadas por comas (`,`) ya no están permitidas. |
| v20.0.0 | Añadido en: v20.0.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable.
:::

Este flag configura los permisos de lectura del sistema de archivos utilizando el [Modelo de Permisos](/es/nodejs/api/permissions#permission-model).

Los argumentos válidos para el flag `--allow-fs-read` son:

- `*` - Para permitir todas las operaciones de `FileSystemRead`.
- Se pueden permitir múltiples rutas usando múltiples flags `--allow-fs-read`. Ejemplo `--allow-fs-read=/folder1/ --allow-fs-read=/folder1/`

Se pueden encontrar ejemplos en la documentación de [Permisos del Sistema de Archivos](/es/nodejs/api/permissions#file-system-permissions).

También es necesario permitir el módulo inicializador. Considere el siguiente ejemplo:

```bash [BASH]
$ node --permission index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:23:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FileSystemRead',
  resource: '/Users/rafaelgss/repos/os/node/index.js'
}
```
El proceso necesita tener acceso al módulo `index.js`:

```bash [BASH]
node --permission --allow-fs-read=/path/to/index.js index.js
```

### `--allow-fs-write` {#--allow-fs-write}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.5.0 | El modelo de permisos y los flags --allow-fs son estables. |
| v20.7.0 | Las rutas delimitadas por comas (`,`) ya no están permitidas. |
| v20.0.0 | Agregado en: v20.0.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable.
:::

Este flag configura los permisos de escritura del sistema de archivos utilizando el [Modelo de Permisos](/es/nodejs/api/permissions#permission-model).

Los argumentos válidos para el flag `--allow-fs-write` son:

- `*` - Para permitir todas las operaciones `FileSystemWrite`.
- Se pueden permitir múltiples rutas usando múltiples flags `--allow-fs-write`. Ejemplo `--allow-fs-write=/folder1/ --allow-fs-write=/folder1/`

Las rutas delimitadas por comas (`,`) ya no están permitidas. Al pasar un solo flag con una coma, se mostrará una advertencia.

Se pueden encontrar ejemplos en la documentación de [Permisos del Sistema de Archivos](/es/nodejs/api/permissions#file-system-permissions).

### `--allow-wasi` {#--allow-wasi}

**Agregado en: v22.3.0, v20.16.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Desarrollo activo
:::

Cuando se utiliza el [Modelo de Permisos](/es/nodejs/api/permissions#permission-model), el proceso no podrá crear ninguna instancia WASI de forma predeterminada. Por razones de seguridad, la llamada lanzará un `ERR_ACCESS_DENIED` a menos que el usuario pase explícitamente el flag `--allow-wasi` en el proceso principal de Node.js.

Ejemplo:

```js [ESM]
const { WASI } = require('node:wasi');
// Intento de omitir el permiso
new WASI({
  version: 'preview1',
  // Intento de montar todo el sistema de archivos
  preopens: {
    '/': '/',
  },
});
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:30:49 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WASI',
}
```
### `--allow-worker` {#--allow-worker}

**Agregado en: v20.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Desarrollo activo
:::

Cuando se utiliza el [Modelo de Permisos](/es/nodejs/api/permissions#permission-model), el proceso no podrá crear ningún hilo de trabajo de forma predeterminada. Por razones de seguridad, la llamada lanzará un `ERR_ACCESS_DENIED` a menos que el usuario pase explícitamente el flag `--allow-worker` en el proceso principal de Node.js.

Ejemplo:

```js [ESM]
const { Worker } = require('node:worker_threads');
// Intento de omitir el permiso
new Worker(__filename);
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WorkerThreads'
}
```

### `--build-snapshot` {#--build-snapshot}

**Añadido en: v18.8.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Genera un blob de instantánea cuando el proceso finaliza y lo escribe en el disco, que se puede cargar más tarde con `--snapshot-blob`.

Al construir la instantánea, si no se especifica `--snapshot-blob`, el blob generado se escribirá, por defecto, en `snapshot.blob` en el directorio de trabajo actual. De lo contrario, se escribirá en la ruta especificada por `--snapshot-blob`.

```bash [BASH]
$ echo "globalThis.foo = 'Soy de la instantánea'" > snapshot.js

# Ejecute snapshot.js para inicializar la aplicación y hacer una instantánea del {#run-snapshotjs-to-initialize-the-application-and-snapshot-the}
# estado en snapshot.blob.
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js

$ echo "console.log(globalThis.foo)" > index.js

# Cargue la instantánea generada e inicie la aplicación desde index.js. {#state-of-it-into-snapshotblob}
$ node --snapshot-blob snapshot.blob index.js
Soy de la instantánea
```
La API [`v8.startupSnapshot` API](/es/nodejs/api/v8#startup-snapshot-api) se puede utilizar para especificar un punto de entrada en el momento de la creación de la instantánea, evitando así la necesidad de un script de entrada adicional en el momento de la deserialización:

```bash [BASH]
$ echo "require('v8').startupSnapshot.setDeserializeMainFunction(() => console.log('Soy de la instantánea'))" > snapshot.js
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js
$ node --snapshot-blob snapshot.blob
Soy de la instantánea
```
Para obtener más información, consulte la documentación de la [`v8.startupSnapshot` API](/es/nodejs/api/v8#startup-snapshot-api).

Actualmente, el soporte para la instantánea en tiempo de ejecución es experimental en el sentido de que:

### `--build-snapshot-config` {#load-the-generated-snapshot-and-start-the-application-from-indexjs}

**Añadido en: v21.6.0, v20.12.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Especifica la ruta a un archivo de configuración JSON que configura el comportamiento de la creación de instantáneas.

Actualmente se admiten las siguientes opciones:

- `builder` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Requerido. Proporciona el nombre del script que se ejecuta antes de construir la instantánea, como si se hubiera pasado [`--build-snapshot`](/es/nodejs/api/cli#--build-snapshot) con `builder` como nombre del script principal.
- `withoutCodeCache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Opcional. Incluir la caché de código reduce el tiempo dedicado a la compilación de funciones incluidas en la instantánea a expensas de un mayor tamaño de la instantánea y de la posible ruptura de la portabilidad de la instantánea.

Cuando se utiliza este flag, los archivos de script adicionales proporcionados en la línea de comandos no se ejecutarán y en su lugar se interpretarán como argumentos regulares de la línea de comandos.


### `-c`, `--check` {#--build-snapshot-config}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | La opción `--require` ahora es compatible al verificar un archivo. |
| v5.0.0, v4.2.0 | Agregado en: v5.0.0, v4.2.0 |
:::

Verifica la sintaxis del script sin ejecutarlo.

### `--completion-bash` {#-c---check}

**Agregado en: v10.12.0**

Imprime un script de autocompletado bash con código fuente para Node.js.

```bash [BASH]
node --completion-bash > node_bash_completion
source node_bash_completion
```
### `-C condition`, `--conditions=condition` {#--completion-bash}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.9.0, v20.18.0 | El flag ya no es experimental. |
| v14.9.0, v12.19.0 | Agregado en: v14.9.0, v12.19.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Proporciona condiciones de resolución [exportaciones condicionales](/es/nodejs/api/packages#conditional-exports) personalizadas.

Se permite cualquier número de nombres de condición de cadena personalizados.

Las condiciones predeterminadas de Node.js de `"node"`, `"default"`, `"import"` y `"require"` siempre se aplicarán según lo definido.

Por ejemplo, para ejecutar un módulo con resoluciones de "desarrollo":

```bash [BASH]
node -C development app.js
```
### `--cpu-prof` {#-c-condition---conditions=condition}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.4.0, v20.16.0 | Los flags `--cpu-prof` ahora son estables. |
| v12.0.0 | Agregado en: v12.0.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Inicia el generador de perfiles de CPU V8 al inicio y escribe el perfil de CPU en el disco antes de salir.

Si no se especifica `--cpu-prof-dir`, el perfil generado se coloca en el directorio de trabajo actual.

Si no se especifica `--cpu-prof-name`, el perfil generado se denomina `CPU.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.cpuprofile`.

```bash [BASH]
$ node --cpu-prof index.js
$ ls *.cpuprofile
CPU.20190409.202950.15293.0.0.cpuprofile
```
### `--cpu-prof-dir` {#--cpu-prof}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.4.0, v20.16.0 | Los flags `--cpu-prof` ahora son estables. |
| v12.0.0 | Agregado en: v12.0.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Especifica el directorio donde se colocarán los perfiles de CPU generados por `--cpu-prof`.

El valor predeterminado está controlado por la opción de línea de comandos [`--diagnostic-dir`](/es/nodejs/api/cli#--diagnostic-dirdirectory).


### `--cpu-prof-interval` {#--cpu-prof-dir}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.4.0, v20.16.0 | Los flags `--cpu-prof` ahora son estables. |
| v12.2.0 | Añadido en: v12.2.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Especifica el intervalo de muestreo en microsegundos para los perfiles de CPU generados por `--cpu-prof`. El valor por defecto es 1000 microsegundos.

### `--cpu-prof-name` {#--cpu-prof-interval}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.4.0, v20.16.0 | Los flags `--cpu-prof` ahora son estables. |
| v12.0.0 | Añadido en: v12.0.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Especifica el nombre de archivo del perfil de CPU generado por `--cpu-prof`.

### `--diagnostic-dir=directorio` {#--cpu-prof-name}

Establece el directorio en el que se escriben todos los archivos de salida de diagnóstico. El valor por defecto es el directorio de trabajo actual.

Afecta al directorio de salida por defecto de:

- [`--cpu-prof-dir`](/es/nodejs/api/cli#--cpu-prof-dir)
- [`--heap-prof-dir`](/es/nodejs/api/cli#--heap-prof-dir)
- [`--redirect-warnings`](/es/nodejs/api/cli#--redirect-warningsfile)

### `--disable-proto=modo` {#--diagnostic-dir=directory}

**Añadido en: v13.12.0, v12.17.0**

Desactiva la propiedad `Object.prototype.__proto__`. Si `modo` es `delete`, la propiedad se elimina por completo. Si `modo` es `throw`, los accesos a la propiedad lanzan una excepción con el código `ERR_PROTO_ACCESS`.

### `--disable-warning=código-o-tipo` {#--disable-proto=mode}

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Desarrollo activo
:::

**Añadido en: v21.3.0, v20.11.0**

Desactiva advertencias de proceso específicas por `código` o `tipo`.

Las advertencias emitidas desde [`process.emitWarning()`](/es/nodejs/api/process#processemitwarningwarning-options) pueden contener un `código` y un `tipo`. Esta opción no emitirá advertencias que tengan un `código` o `tipo` coincidente.

Lista de [advertencias de obsolescencia](/es/nodejs/api/deprecations#list-of-deprecated-apis).

Los tipos de advertencia del núcleo de Node.js son: `DeprecationWarning` y `ExperimentalWarning`.

Por ejemplo, el siguiente script no emitirá [DEP0025 `require('node:sys')`](/es/nodejs/api/deprecations#dep0025-requirenodesys) cuando se ejecute con `node --disable-warning=DEP0025`:



::: code-group
```js [ESM]
import sys from 'node:sys';
```

```js [CJS]
const sys = require('node:sys');
```
:::

Por ejemplo, el siguiente script emitirá [DEP0025 `require('node:sys')`](/es/nodejs/api/deprecations#dep0025-requirenodesys), pero no ninguna Advertencia Experimental (como [ExperimentalWarning: `vm.measureMemory` es una característica experimental](/es/nodejs/api/vm#vmmeasurememoryoptions) en \<=v21) cuando se ejecute con `node --disable-warning=ExperimentalWarning`:



::: code-group
```js [ESM]
import sys from 'node:sys';
import vm from 'node:vm';

vm.measureMemory();
```

```js [CJS]
const sys = require('node:sys');
const vm = require('node:vm');

vm.measureMemory();
```
:::


### `--disable-wasm-trap-handler` {#--disable-warning=code-or-type}

**Agregado en: v22.2.0, v20.15.0**

De forma predeterminada, Node.js habilita las comprobaciones de límites de WebAssembly basadas en controladores de interrupciones. Como resultado, V8 no necesita insertar comprobaciones de límites en línea en el código compilado desde WebAssembly, lo que puede acelerar significativamente la ejecución de WebAssembly, pero esta optimización requiere la asignación de una gran jaula de memoria virtual (actualmente 10 GB). Si el proceso de Node.js no tiene acceso a un espacio de direcciones de memoria virtual lo suficientemente grande debido a las configuraciones del sistema o las limitaciones de hardware, los usuarios no podrán ejecutar ningún WebAssembly que involucre la asignación en esta jaula de memoria virtual y verán un error de falta de memoria.

```bash [BASH]
$ ulimit -v 5000000
$ node -p "new WebAssembly.Memory({ initial: 10, maximum: 100 });"
[eval]:1
new WebAssembly.Memory({ initial: 10, maximum: 100 });
^

RangeError: WebAssembly.Memory(): could not allocate memory
    at [eval]:1:1
    at runScriptInThisContext (node:internal/vm:209:10)
    at node:internal/process/execution:118:14
    at [eval]-wrapper:6:24
    at runScript (node:internal/process/execution:101:62)
    at evalScript (node:internal/process/execution:136:3)
    at node:internal/main/eval_string:49:3

```
`--disable-wasm-trap-handler` deshabilita esta optimización para que los usuarios al menos puedan ejecutar WebAssembly (con un rendimiento menos óptimo) cuando el espacio de direcciones de memoria virtual disponible para su proceso de Node.js sea menor de lo que necesita la jaula de memoria WebAssembly de V8.

### `--disallow-code-generation-from-strings` {#--disable-wasm-trap-handler}

**Agregado en: v9.8.0**

Hace que las características del lenguaje incorporadas como `eval` y `new Function` que generan código a partir de cadenas lancen una excepción en su lugar. Esto no afecta al módulo `node:vm` de Node.js.

### `--dns-result-order=order` {#--disallow-code-generation-from-strings}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.1.0, v20.13.0 | Ahora se admite `ipv6first`. |
| v17.0.0 | Se cambió el valor predeterminado a `verbatim`. |
| v16.4.0, v14.18.0 | Agregado en: v16.4.0, v14.18.0 |
:::

Establece el valor predeterminado de `order` en [`dns.lookup()`](/es/nodejs/api/dns#dnslookuphostname-options-callback) y [`dnsPromises.lookup()`](/es/nodejs/api/dns#dnspromiseslookuphostname-options). El valor podría ser:

- `ipv4first`: establece `order` predeterminado en `ipv4first`.
- `ipv6first`: establece `order` predeterminado en `ipv6first`.
- `verbatim`: establece `order` predeterminado en `verbatim`.

El valor predeterminado es `verbatim` y [`dns.setDefaultResultOrder()`](/es/nodejs/api/dns#dnssetdefaultresultorderorder) tiene mayor prioridad que `--dns-result-order`.


### `--enable-fips` {#--dns-result-order=order}

**Agregado en: v6.0.0**

Habilita el cifrado compatible con FIPS al inicio. (Requiere que Node.js se compile con OpenSSL compatible con FIPS).

### `--enable-network-family-autoselection` {#--enable-fips}

**Agregado en: v18.18.0**

Habilita el algoritmo de autoselección de familia a menos que las opciones de conexión lo deshabiliten explícitamente.

### `--enable-source-maps` {#--enable-network-family-autoselection}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.11.0, v14.18.0 | Esta API ya no es experimental. |
| v12.12.0 | Agregado en: v12.12.0 |
:::

Habilita la compatibilidad con [Source Map v3](https://sourcemaps.info/spec) para los rastreos de pila.

Cuando se utiliza un transpilador, como TypeScript, los rastreos de pila generados por una aplicación hacen referencia al código transpilado, no a la posición original del código fuente. `--enable-source-maps` habilita el almacenamiento en caché de los mapas de origen y hace todo lo posible para informar los rastreos de pila en relación con el archivo fuente original.

Anular `Error.prepareStackTrace` puede evitar que `--enable-source-maps` modifique el rastreo de pila. Llame y devuelva los resultados del `Error.prepareStackTrace` original en la función de anulación para modificar el rastreo de pila con los mapas de origen.

```js [ESM]
const originalPrepareStackTrace = Error.prepareStackTrace;
Error.prepareStackTrace = (error, trace) => {
  // Modifica el error y el rastreo y formatea el rastreo de pila con
  // el Error.prepareStackTrace original.
  return originalPrepareStackTrace(error, trace);
};
```
Tenga en cuenta que habilitar los mapas de origen puede introducir latencia en su aplicación cuando se accede a `Error.stack`. Si accede a `Error.stack` con frecuencia en su aplicación, tenga en cuenta las implicaciones de rendimiento de `--enable-source-maps`.

### `--entry-url` {#--enable-source-maps}

**Agregado en: v23.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Cuando está presente, Node.js interpretará el punto de entrada como una URL, en lugar de una ruta.

Sigue las reglas de resolución de [módulo ECMAScript](/es/nodejs/api/esm#modules-ecmascript-modules).

Cualquier parámetro de consulta o hash en la URL será accesible a través de [`import.meta.url`](/es/nodejs/api/esm#importmetaurl).

```bash [BASH]
node --entry-url 'file:///path/to/file.js?queryparams=work#and-hashes-too'
node --entry-url --experimental-strip-types 'file.ts?query#hash'
node --entry-url 'data:text/javascript,console.log("Hello")'
```

### `--env-file-if-exists=config` {#--entry-url}

**Añadido en: v22.9.0**

El comportamiento es el mismo que [`--env-file`](/es/nodejs/api/cli#--env-fileconfig), pero no se lanza un error si el archivo no existe.

### `--env-file=config` {#--env-file-if-exists=config}

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo activo
:::


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.7.0, v20.12.0 | Se agrega soporte para valores multilínea. |
| v20.6.0 | Añadido en: v20.6.0 |
:::

Carga variables de entorno desde un archivo relativo al directorio actual, haciéndolas disponibles para las aplicaciones en `process.env`. Las [variables de entorno que configuran Node.js](/es/nodejs/api/cli#environment-variables), como `NODE_OPTIONS`, se analizan y se aplican. Si la misma variable está definida en el entorno y en el archivo, el valor del entorno tiene prioridad.

Puede pasar múltiples argumentos `--env-file`. Los archivos posteriores reemplazan las variables preexistentes definidas en archivos anteriores.

Se lanza un error si el archivo no existe.

```bash [BASH]
node --env-file=.env --env-file=.development.env index.js
```
El formato del archivo debe ser una línea por cada par clave-valor de nombre de variable de entorno y valor separados por `=`:

```text [TEXT]
PORT=3000
```
Cualquier texto después de un `#` se trata como un comentario:

```text [TEXT]
# Esto es un comentario {#--env-file=config}
PORT=3000 # Esto también es un comentario
```
Los valores pueden comenzar y terminar con las siguientes comillas: ```, `"` o `'`. Se omiten de los valores.

```text [TEXT]
USERNAME="nodejs" # resultará en `nodejs` como el valor.
```
Se admiten valores multilínea:

```text [TEXT]
MULTI_LINE="ESTO ES
UNA MULTILÍNEA"
# resultará en `ESTO ES\nUNA MULTILÍNEA` como el valor. {#this-is-a-comment}
```
La palabra clave Export antes de una clave se ignora:

```text [TEXT]
export USERNAME="nodejs" # resultará en `nodejs` como el valor.
```
Si desea cargar variables de entorno desde un archivo que puede que no exista, puede usar el indicador [`--env-file-if-exists`](/es/nodejs/api/cli#--env-file-if-existsconfig) en su lugar.


### `-e`, `--eval "script"` {#will-result-in-this-is\na-multiline-as-the-value}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.6.0 | Eval ahora soporta la eliminación experimental de tipos. |
| v5.11.0 | Las bibliotecas integradas ahora están disponibles como variables predefinidas. |
| v0.5.2 | Añadido en: v0.5.2 |
:::

Evalúa el siguiente argumento como JavaScript. Los módulos que están predefinidos en el REPL también se pueden utilizar en `script`.

En Windows, utilizando `cmd.exe`, una comilla simple no funcionará correctamente porque solo reconoce comillas dobles `"` para entrecomillar. En Powershell o Git bash, tanto `'` como `"` son utilizables.

Es posible ejecutar código que contiene tipos en línea pasando [`--experimental-strip-types`](/es/nodejs/api/cli#--experimental-strip-types).

### `--experimental-async-context-frame` {#-e---eval-"script"}

**Añadido en: v22.7.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Habilita el uso de [`AsyncLocalStorage`](/es/nodejs/api/async_context#class-asynclocalstorage) respaldado por `AsyncContextFrame` en lugar de la implementación predeterminada que se basa en async_hooks. Este nuevo modelo se implementa de manera muy diferente y, por lo tanto, podría tener diferencias en cómo fluyen los datos de contexto dentro de la aplicación. Como tal, actualmente se recomienda asegurarse de que el comportamiento de su aplicación no se vea afectado por este cambio antes de usarlo en producción.

### `--experimental-eventsource` {#--experimental-async-context-frame}

**Añadido en: v22.3.0, v20.18.0**

Habilita la exposición de [EventSource Web API](https://html.spec.whatwg.org/multipage/server-sent-events#server-sent-events) en el ámbito global.

### `--experimental-import-meta-resolve` {#--experimental-eventsource}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.6.0, v18.19.0 | import.meta.resolve síncrono disponible de forma predeterminada, con el indicador retenido para habilitar el segundo argumento experimental como se admitía anteriormente. |
| v13.9.0, v12.16.2 | Añadido en: v13.9.0, v12.16.2 |
:::

Habilita la compatibilidad experimental con la URL principal de `import.meta.resolve()`, que permite pasar un segundo argumento `parentURL` para la resolución contextual.

Anteriormente, controlaba toda la característica `import.meta.resolve`.


### `--experimental-loader=module` {#--experimental-import-meta-resolve}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v12.11.1 | Este flag fue renombrado de `--loader` a `--experimental-loader`. |
| v8.8.0 | Agregado en: v8.8.0 |
:::

Especifica el `module` que contiene los [hooks de personalización de módulos](/es/nodejs/api/module#customization-hooks) exportados. `module` puede ser cualquier cadena aceptada como un [especificador `import`](/es/nodejs/api/esm#import-specifiers).

### `--experimental-network-inspection` {#--experimental-loader=module}

**Agregado en: v22.6.0, v20.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Habilita el soporte experimental para la inspección de la red con Chrome DevTools.

### `--experimental-print-required-tla` {#--experimental-network-inspection}

**Agregado en: v22.0.0, v20.17.0**

Si el módulo ES que se está `require()`'iendo contiene `await` de nivel superior, este flag permite que Node.js evalúe el módulo, intente ubicar los awaits de nivel superior e imprima su ubicación para ayudar a los usuarios a encontrarlos.

### `--experimental-require-module` {#--experimental-print-required-tla}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Ahora es verdadero por defecto. |
| v22.0.0, v20.17.0 | Agregado en: v22.0.0, v20.17.0 |
:::

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Desarrollo Activo
:::

Soporta la carga de un grafo de módulos ES síncrono en `require()`.

Ver [Cargando módulos ECMAScript usando `require()`](/es/nodejs/api/modules#loading-ecmascript-modules-using-require).

### `--experimental-sea-config` {#--experimental-require-module}

**Agregado en: v20.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Use este flag para generar un blob que puede ser inyectado en el binario de Node.js para producir una [aplicación ejecutable única](/es/nodejs/api/single-executable-applications). Consulte la documentación sobre [esta configuración](/es/nodejs/api/single-executable-applications#generating-single-executable-preparation-blobs) para obtener más detalles.


### `--experimental-shadow-realm` {#--experimental-sea-config}

**Agregado en: v19.0.0, v18.13.0**

Use este indicador para habilitar la compatibilidad con [ShadowRealm](https://github.com/tc39/proposal-shadowrealm).

### `--experimental-strip-types` {#--experimental-shadow-realm}

**Agregado en: v22.6.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo activo
:::

Habilita la eliminación experimental de tipos para archivos TypeScript. Para obtener más información, consulte la documentación sobre [eliminación de tipos de TypeScript](/es/nodejs/api/typescript#type-stripping).

### `--experimental-test-coverage` {#--experimental-strip-types}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.1.0, v18.17.0 | Esta opción se puede usar con `--test`. |
| v19.7.0, v18.15.0 | Agregado en: v19.7.0, v18.15.0 |
:::

Cuando se usa junto con el módulo `node:test`, se genera un informe de cobertura de código como parte de la salida del ejecutor de pruebas. Si no se ejecutan pruebas, no se genera un informe de cobertura. Consulte la documentación sobre [recopilación de cobertura de código a partir de pruebas](/es/nodejs/api/test#collecting-code-coverage) para obtener más detalles.

### `--experimental-test-isolation=mode` {#--experimental-test-coverage}

**Agregado en: v22.8.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).0 - Desarrollo temprano
:::

Configura el tipo de aislamiento de prueba utilizado en el ejecutor de pruebas. Cuando `mode` es `'process'`, cada archivo de prueba se ejecuta en un proceso hijo separado. Cuando `mode` es `'none'`, todos los archivos de prueba se ejecutan en el mismo proceso que el ejecutor de pruebas. El modo de aislamiento predeterminado es `'process'`. Este indicador se ignora si el indicador `--test` no está presente. Consulte la sección [modelo de ejecución del ejecutor de pruebas](/es/nodejs/api/test#test-runner-execution-model) para obtener más información.

### `--experimental-test-module-mocks` {#--experimental-test-isolation=mode}

**Agregado en: v22.3.0, v20.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).0 - Desarrollo temprano
:::

Habilita la simulación de módulos en el ejecutor de pruebas.


### `--experimental-transform-types` {#--experimental-test-module-mocks}

**Añadido en: v22.7.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Desarrollo activo
:::

Habilita la transformación de sintaxis exclusiva de TypeScript en código JavaScript. Implica `--experimental-strip-types` y `--enable-source-maps`.

### `--experimental-vm-modules` {#--experimental-transform-types}

**Añadido en: v9.6.0**

Habilita el soporte experimental de módulos ES en el módulo `node:vm`.

### `--experimental-wasi-unstable-preview1` {#--experimental-vm-modules}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.0.0, v18.17.0 | Esta opción ya no es necesaria ya que WASI está habilitado por defecto, pero aún se puede pasar. |
| v13.6.0 | cambió de `--experimental-wasi-unstable-preview0` a `--experimental-wasi-unstable-preview1`. |
| v13.3.0, v12.16.0 | Añadido en: v13.3.0, v12.16.0 |
:::

Habilita el soporte experimental de la Interfaz del Sistema WebAssembly (WASI).

### `--experimental-wasm-modules` {#--experimental-wasi-unstable-preview1}

**Añadido en: v12.3.0**

Habilita el soporte experimental de módulos WebAssembly.

### `--experimental-webstorage` {#--experimental-wasm-modules}

**Añadido en: v22.4.0**

Habilita el soporte experimental de [`Web Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).

### `--expose-gc` {#--experimental-webstorage}

**Añadido en: v22.3.0, v20.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental. Este flag se hereda de V8 y está sujeto a cambios ascendentes.
:::

Este flag expondrá la extensión gc de V8.

```js [ESM]
if (globalThis.gc) {
  globalThis.gc();
}
```
### `--force-context-aware` {#--expose-gc}

**Añadido en: v12.12.0**

Deshabilita la carga de complementos nativos que no son [conscientes del contexto](/es/nodejs/api/addons#context-aware-addons).

### `--force-fips` {#--force-context-aware}

**Añadido en: v6.0.0**

Fuerza el cifrado compatible con FIPS al inicio. (No se puede deshabilitar desde el código del script). (Los mismos requisitos que `--enable-fips`.)

### `--force-node-api-uncaught-exceptions-policy` {#--force-fips}

**Añadido en: v18.3.0, v16.17.0**

Aplica el evento `uncaughtException` en las devoluciones de llamada asíncronas de Node-API.

Para evitar que un complemento existente bloquee el proceso, este flag no está habilitado por defecto. En el futuro, este flag se habilitará por defecto para aplicar el comportamiento correcto.


### `--frozen-intrinsics` {#--force-node-api-uncaught-exceptions-policy}

**Añadido en: v11.12.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Habilita los intrínsecos congelados experimentales como `Array` y `Object`.

Solo se admite el contexto raíz. No hay garantía de que `globalThis.Array` sea realmente la referencia intrínseca predeterminada. El código puede romperse bajo este indicador.

Para permitir que se agreguen polyfills, tanto [`--require`](/es/nodejs/api/cli#-r---require-module) como [`--import`](/es/nodejs/api/cli#--importmodule) se ejecutan antes de congelar los intrínsecos.

### `--heap-prof` {#--frozen-intrinsics}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.4.0, v20.16.0 | Los indicadores `--heap-prof` ahora son estables. |
| v12.4.0 | Añadido en: v12.4.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Inicia el generador de perfiles de montón V8 al inicio y escribe el perfil de montón en el disco antes de salir.

Si no se especifica `--heap-prof-dir`, el perfil generado se coloca en el directorio de trabajo actual.

Si no se especifica `--heap-prof-name`, el perfil generado se llama `Heap.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.heapprofile`.

```bash [BASH]
$ node --heap-prof index.js
$ ls *.heapprofile
Heap.20190409.202950.15293.0.001.heapprofile
```
### `--heap-prof-dir` {#--heap-prof}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.4.0, v20.16.0 | Los indicadores `--heap-prof` ahora son estables. |
| v12.4.0 | Añadido en: v12.4.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Especifica el directorio donde se colocarán los perfiles de montón generados por `--heap-prof`.

El valor predeterminado está controlado por la opción de línea de comandos [`--diagnostic-dir`](/es/nodejs/api/cli#--diagnostic-dirdirectory).

### `--heap-prof-interval` {#--heap-prof-dir}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.4.0, v20.16.0 | Los indicadores `--heap-prof` ahora son estables. |
| v12.4.0 | Añadido en: v12.4.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Especifica el intervalo de muestreo promedio en bytes para los perfiles de montón generados por `--heap-prof`. El valor predeterminado es 512 * 1024 bytes.


### `--heap-prof-name` {#--heap-prof-interval}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.4.0, v20.16.0 | Los flags `--heap-prof` ahora son estables. |
| v12.4.0 | Añadido en: v12.4.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Especifica el nombre del archivo del perfil de montón generado por `--heap-prof`.

### `--heapsnapshot-near-heap-limit=max_count` {#--heap-prof-name}

**Añadido en: v15.1.0, v14.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Escribe una instantánea del montón de V8 en el disco cuando el uso del montón de V8 se acerca al límite del montón. `count` debe ser un entero no negativo (en cuyo caso Node.js no escribirá más de `max_count` instantáneas en el disco).

Cuando se generan instantáneas, se puede activar la recolección de basura y reducir el uso del montón. Por lo tanto, se pueden escribir varias instantáneas en el disco antes de que la instancia de Node.js finalmente se quede sin memoria. Estas instantáneas del montón se pueden comparar para determinar qué objetos se están asignando durante el tiempo en que se toman instantáneas consecutivas. No se garantiza que Node.js escriba exactamente `max_count` instantáneas en el disco, pero hará todo lo posible para generar al menos una y hasta `max_count` instantáneas antes de que la instancia de Node.js se quede sin memoria cuando `max_count` sea mayor que `0`.

Generar instantáneas de V8 requiere tiempo y memoria (tanto memoria gestionada por el montón de V8 como memoria nativa fuera del montón de V8). Cuanto más grande sea el montón, más recursos necesita. Node.js ajustará el montón de V8 para adaptarse a la sobrecarga adicional de memoria del montón de V8 e intentará evitar utilizar toda la memoria disponible para el proceso. Cuando el proceso utiliza más memoria de la que el sistema considera apropiada, el sistema puede finalizar el proceso abruptamente, según la configuración del sistema.

```bash [BASH]
$ node --max-old-space-size=100 --heapsnapshot-near-heap-limit=3 index.js
Wrote snapshot to Heap.20200430.100036.49580.0.001.heapsnapshot
Wrote snapshot to Heap.20200430.100037.49580.0.002.heapsnapshot
Wrote snapshot to Heap.20200430.100038.49580.0.003.heapsnapshot

<--- Last few GCs --->

[49580:0x110000000]     4826 ms: Mark-sweep 130.6 (147.8) -> 130.5 (147.8) MB, 27.4 / 0.0 ms  (average mu = 0.126, current mu = 0.034) allocation failure scavenge might not succeed
[49580:0x110000000]     4845 ms: Mark-sweep 130.6 (147.8) -> 130.6 (147.8) MB, 18.8 / 0.0 ms  (average mu = 0.088, current mu = 0.031) allocation failure scavenge might not succeed


<--- JS stacktrace --->

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
....
```

### `--heapsnapshot-signal=señal` {#--heapsnapshot-near-heap-limit=max_count}

**Agregado en: v12.0.0**

Habilita un controlador de señal que hace que el proceso de Node.js escriba un volcado de memoria cuando se recibe la señal especificada. `señal` debe ser un nombre de señal válido. Deshabilitado por defecto.

```bash [BASH]
$ node --heapsnapshot-signal=SIGUSR2 index.js &
$ ps aux
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
node         1  5.5  6.1 787252 247004 ?       Ssl  16:43   0:02 node --heapsnapshot-signal=SIGUSR2 index.js
$ kill -USR2 1
$ ls
Heap.20190718.133405.15554.0.001.heapsnapshot
```
### `-h`, `--help` {#--heapsnapshot-signal=signal}

**Agregado en: v0.1.3**

Imprime las opciones de la línea de comandos de node. La salida de esta opción es menos detallada que este documento.

### `--icu-data-dir=archivo` {#-h---help}

**Agregado en: v0.11.15**

Especifica la ruta de carga de datos de ICU. (Anula `NODE_ICU_DATA`.)

### `--import=módulo` {#--icu-data-dir=file}

**Agregado en: v19.0.0, v18.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Precarga el módulo especificado al inicio. Si la bandera se proporciona varias veces, cada módulo se ejecutará secuencialmente en el orden en que aparecen, comenzando con los proporcionados en [`NODE_OPTIONS`](/es/nodejs/api/cli#node_optionsoptions).

Sigue las reglas de resolución de [módulos ECMAScript](/es/nodejs/api/esm#modules-ecmascript-modules). Utilice [`--require`](/es/nodejs/api/cli#-r---require-module) para cargar un [módulo CommonJS](/es/nodejs/api/modules). Los módulos precargados con `--require` se ejecutarán antes que los módulos precargados con `--import`.

Los módulos se precargan en el hilo principal, así como en cualquier hilo de trabajador, proceso bifurcado o proceso agrupado.

### `--input-type=tipo` {#--import=module}

**Agregado en: v12.0.0**

Esto configura Node.js para interpretar la entrada `--eval` o `STDIN` como CommonJS o como un módulo ES. Los valores válidos son `"commonjs"` o `"module"`. El valor predeterminado es `"commonjs"`.

El REPL no soporta esta opción. El uso de `--input-type=module` con [`--print`](/es/nodejs/api/cli#-p---print-script) lanzará un error, ya que `--print` no soporta la sintaxis de módulo ES.


### `--insecure-http-parser` {#--input-type=type}

**Agregado en: v13.4.0, v12.15.0, v10.19.0**

Habilita los indicadores de indulgencia en el analizador HTTP. Esto puede permitir la interoperabilidad con implementaciones HTTP no conformes.

Cuando está habilitado, el analizador aceptará lo siguiente:

- Valores de encabezado HTTP no válidos.
- Versiones HTTP no válidas.
- Permitir mensajes que contengan encabezados `Transfer-Encoding` y `Content-Length`.
- Permitir datos adicionales después del mensaje cuando `Connection: close` está presente.
- Permitir codificaciones de transferencia adicionales después de que se haya proporcionado `chunked`.
- Permitir que `\n` se use como separador de tokens en lugar de `\r\n`.
- Permitir que `\r\n` no se proporcione después de un fragmento.
- Permitir que haya espacios después del tamaño de un fragmento y antes de `\r\n`.

Todo lo anterior expondrá su aplicación a un ataque de contrabando o envenenamiento de solicitudes. Evite usar esta opción.

#### Advertencia: vincular el inspector a una combinación pública de IP:puerto es inseguro {#--insecure-http-parser}

Vincular el inspector a una IP pública (incluido `0.0.0.0`) con un puerto abierto es inseguro, ya que permite que hosts externos se conecten al inspector y realicen un ataque de [ejecución remota de código](https://www.owasp.org/index.php/Code_Injection).

Si especifica un host, asegúrese de que:

- No se pueda acceder al host desde redes públicas.
- Un firewall no permite conexiones no deseadas en el puerto.

**Más específicamente, <code>--inspect=0.0.0.0</code> es inseguro si el puerto (<code>9229</code> por
defecto) no está protegido por un firewall.**

Consulte la sección [implicaciones de seguridad de la depuración](https://nodejs.org/en/docs/guides/debugging-getting-started/#security-implications) para obtener más información.

### `--inspect-brk[=[host:]port]` {#warning-binding-inspector-to-a-public-ipport-combination-is-insecure}

**Agregado en: v7.6.0**

Activa el inspector en `host:puerto` e interrumpe al inicio del script del usuario. El `host:puerto` predeterminado es `127.0.0.1:9229`. Si se especifica el puerto `0`, se utilizará un puerto disponible aleatorio.

Consulte [Integración del inspector V8 para Node.js](/es/nodejs/api/debugger#v8-inspector-integration-for-nodejs) para obtener más explicaciones sobre el depurador de Node.js.

### `--inspect-port=[host:]port` {#--inspect-brk=hostport}

**Agregado en: v7.6.0**

Establece el `host:puerto` que se utilizará cuando se active el inspector. Útil cuando se activa el inspector enviando la señal `SIGUSR1`.

El host predeterminado es `127.0.0.1`. Si se especifica el puerto `0`, se utilizará un puerto disponible aleatorio.

Consulte la [advertencia de seguridad](/es/nodejs/api/cli#warning-binding-inspector-to-a-public-ipport-combination-is-insecure) a continuación con respecto al uso del parámetro `host`.


### `--inspect-publish-uid=stderr,http` {#--inspect-port=hostport}

Especifica las formas de exposición de la URL del socket web del inspector.

Por defecto, la URL del websocket del inspector está disponible en stderr y bajo el punto final `/json/list` en `http://host:port/json/list`.

### `--inspect-wait[=[host:]port]` {#--inspect-publish-uid=stderrhttp}

**Agregado en: v22.2.0, v20.15.0**

Activa el inspector en `host:port` y espera a que se adjunte un depurador. El `host:port` predeterminado es `127.0.0..1:9229`. Si se especifica el puerto `0`, se utilizará un puerto disponible aleatorio.

Consulta [Integración del Inspector V8 para Node.js](/es/nodejs/api/debugger#v8-inspector-integration-for-nodejs) para obtener más explicaciones sobre el depurador de Node.js.

### `--inspect[=[host:]port]` {#--inspect-wait=hostport}

**Agregado en: v6.3.0**

Activa el inspector en `host:port`. El valor predeterminado es `127.0.0.1:9229`. Si se especifica el puerto `0`, se utilizará un puerto disponible aleatorio.

La integración del inspector V8 permite que herramientas como Chrome DevTools e IDEs depuren y perfilen instancias de Node.js. Las herramientas se adjuntan a instancias de Node.js a través de un puerto TCP y se comunican utilizando el [Protocolo de herramientas de desarrollo de Chrome](https://chromedevtools.github.io/devtools-protocol/). Consulta [Integración del Inspector V8 para Node.js](/es/nodejs/api/debugger#v8-inspector-integration-for-nodejs) para obtener más explicaciones sobre el depurador de Node.js.

### `-i`, `--interactive` {#--inspect=hostport}

**Agregado en: v0.7.7**

Abre el REPL incluso si stdin no parece ser una terminal.

### `--jitless` {#-i---interactive}

**Agregado en: v12.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental. Este indicador se hereda de V8 y está sujeto a cambios ascendentes.
:::

Deshabilita la [asignación en tiempo de ejecución de memoria ejecutable](https://v8.dev/blog/jitless). Esto puede ser necesario en algunas plataformas por razones de seguridad. También puede reducir la superficie de ataque en otras plataformas, pero el impacto en el rendimiento puede ser grave.

### `--localstorage-file=file` {#--jitless}

**Agregado en: v22.4.0**

El archivo utilizado para almacenar datos de `localStorage`. Si el archivo no existe, se crea la primera vez que se accede a `localStorage`. El mismo archivo se puede compartir entre múltiples procesos de Node.js concurrentemente. Este flag no tiene efecto a menos que Node.js se inicie con el flag `--experimental-webstorage`.


### `--max-http-header-size=size` {#--localstorage-file=file}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.13.0 | Cambia el tamaño máximo predeterminado de los encabezados HTTP de 8 KiB a 16 KiB. |
| v11.6.0, v10.15.0 | Agregado en: v11.6.0, v10.15.0 |
:::

Especifica el tamaño máximo, en bytes, de los encabezados HTTP. El valor predeterminado es 16 KiB.

### `--napi-modules` {#--max-http-header-size=size}

**Agregado en: v7.10.0**

Esta opción no tiene efecto. Se mantiene por compatibilidad.

### `--network-family-autoselection-attempt-timeout` {#--napi-modules}

**Agregado en: v22.1.0, v20.13.0**

Establece el valor predeterminado para el tiempo de espera del intento de autoselección de la familia de red. Para obtener más información, consulte [`net.getDefaultAutoSelectFamilyAttemptTimeout()`](/es/nodejs/api/net#netgetdefaultautoselectfamilyattempttimeout).

### `--no-addons` {#--network-family-autoselection-attempt-timeout}

**Agregado en: v16.10.0, v14.19.0**

Deshabilita la condición de exportación `node-addons` y también deshabilita la carga de complementos nativos. Cuando se especifica `--no-addons`, llamar a `process.dlopen` o requerir un complemento nativo de C++ fallará y arrojará una excepción.

### `--no-deprecation` {#--no-addons}

**Agregado en: v0.8.0**

Silencia las advertencias de obsolescencia.

### `--no-experimental-detect-module` {#--no-deprecation}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.7.0 | La detección de sintaxis está habilitada de forma predeterminada. |
| v21.1.0, v20.10.0 | Agregado en: v21.1.0, v20.10.0 |
:::

Deshabilita el uso de la [detección de sintaxis](/es/nodejs/api/packages#syntax-detection) para determinar el tipo de módulo.

### `--no-experimental-global-navigator` {#--no-experimental-detect-module}

**Agregado en: v21.2.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Deshabilita la exposición de la [API Navigator](/es/nodejs/api/globals#navigator) en el alcance global.

### `--no-experimental-repl-await` {#--no-experimental-global-navigator}

**Agregado en: v16.6.0**

Use esta bandera para deshabilitar top-level await en REPL.

### `--no-experimental-require-module` {#--no-experimental-repl-await}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.0.0 | Ahora esto es falso de forma predeterminada. |
| v22.0.0, v20.17.0 | Agregado en: v22.0.0, v20.17.0 |
:::

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo Activo
:::

Deshabilita el soporte para cargar un grafo de módulos ES síncrono en `require()`.

Consulte [Cargar módulos ECMAScript usando `require()`](/es/nodejs/api/modules#loading-ecmascript-modules-using-require).


### `--no-experimental-sqlite` {#--no-experimental-require-module}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v23.4.0 | SQLite ya no está marcado, pero sigue siendo experimental. |
| v22.5.0 | Añadido en: v22.5.0 |
:::

Desactiva el módulo experimental [`node:sqlite`](/es/nodejs/api/sqlite).

### `--no-experimental-websocket` {#--no-experimental-sqlite}

**Añadido en: v22.0.0**

Desactiva la exposición de [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) en el ámbito global.

### `--no-extra-info-on-fatal-exception` {#--no-experimental-websocket}

**Añadido en: v17.0.0**

Oculta información adicional en una excepción fatal que causa la salida.

### `--no-force-async-hooks-checks` {#--no-extra-info-on-fatal-exception}

**Añadido en: v9.0.0**

Desactiva las comprobaciones en tiempo de ejecución para `async_hooks`. Estas se seguirán habilitando dinámicamente cuando `async_hooks` esté habilitado.

### `--no-global-search-paths` {#--no-force-async-hooks-checks}

**Añadido en: v16.10.0**

No busca módulos en rutas globales como `$HOME/.node_modules` y `$NODE_PATH`.

### `--no-network-family-autoselection` {#--no-global-search-paths}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v20.0.0 | La bandera se renombró de `--no-enable-network-family-autoselection` a `--no-network-family-autoselection`. El nombre antiguo todavía puede funcionar como un alias. |
| v19.4.0 | Añadido en: v19.4.0 |
:::

Desactiva el algoritmo de selección automática de familia a menos que las opciones de conexión lo habiliten explícitamente.

### `--no-warnings` {#--no-network-family-autoselection}

**Añadido en: v6.0.0**

Silencia todas las advertencias del proceso (incluidas las obsolescencias).

### `--node-memory-debug` {#--no-warnings}

**Añadido en: v15.0.0, v14.18.0**

Habilita comprobaciones de depuración adicionales para fugas de memoria en los componentes internos de Node.js. Esto suele ser útil solo para los desarrolladores que depuran Node.js en sí.

### `--openssl-config=file` {#--node-memory-debug}

**Añadido en: v6.9.0**

Carga un archivo de configuración de OpenSSL al inicio. Entre otros usos, esto se puede utilizar para habilitar el cifrado compatible con FIPS si Node.js está construido con OpenSSL habilitado para FIPS.

### `--openssl-legacy-provider` {#--openssl-config=file}

**Añadido en: v17.0.0, v16.17.0**

Habilita el proveedor heredado de OpenSSL 3.0. Para obtener más información, consulte [OSSL_PROVIDER-legacy](https://www.openssl.org/docs/man3.0/man7/OSSL_PROVIDER-legacy).

### `--openssl-shared-config` {#--openssl-legacy-provider}

**Añadido en: v18.5.0, v16.17.0, v14.21.0**

Habilita la sección de configuración predeterminada de OpenSSL, `openssl_conf`, para que se lea del archivo de configuración de OpenSSL. El archivo de configuración predeterminado se llama `openssl.cnf`, pero esto se puede cambiar utilizando la variable de entorno `OPENSSL_CONF`, o utilizando la opción de línea de comandos `--openssl-config`. La ubicación del archivo de configuración predeterminado de OpenSSL depende de cómo OpenSSL esté vinculado a Node.js. Compartir la configuración de OpenSSL puede tener implicaciones no deseadas y se recomienda utilizar una sección de configuración específica para Node.js, que es `nodejs_conf` y es la predeterminada cuando no se utiliza esta opción.


### `--pending-deprecation` {#--openssl-shared-config}

**Agregado en: v8.0.0**

Emite advertencias de obsolescencia pendientes.

Las obsolescencias pendientes son generalmente idénticas a una obsolescencia en tiempo de ejecución con la notable excepción de que están *desactivadas* de forma predeterminada y no se emitirán a menos que se establezca el indicador de línea de comandos `--pending-deprecation` o la variable de entorno `NODE_PENDING_DEPRECATION=1`. Las obsolescencias pendientes se utilizan para proporcionar una especie de mecanismo de "alerta temprana" selectivo que los desarrolladores pueden aprovechar para detectar el uso de API en desuso.

### `--permission` {#--pending-deprecation}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.5.0 | El Modelo de Permisos ahora es estable. |
| v20.0.0 | Agregado en: v20.0.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable.
:::

Habilita el Modelo de Permisos para el proceso actual. Cuando está habilitado, los siguientes permisos están restringidos:

- Sistema de archivos - gestionable a través de los flags [`--allow-fs-read`](/es/nodejs/api/cli#--allow-fs-read), [`--allow-fs-write`](/es/nodejs/api/cli#--allow-fs-write)
- Proceso hijo - gestionable a través del flag [`--allow-child-process`](/es/nodejs/api/cli#--allow-child-process)
- Hilos de trabajo - gestionable a través del flag [`--allow-worker`](/es/nodejs/api/cli#--allow-worker)
- WASI - gestionable a través del flag [`--allow-wasi`](/es/nodejs/api/cli#--allow-wasi)
- Addons - gestionable a través del flag [`--allow-addons`](/es/nodejs/api/cli#--allow-addons)

### `--preserve-symlinks` {#--permission}

**Agregado en: v6.3.0**

Indica al cargador de módulos que conserve los enlaces simbólicos al resolver y almacenar en caché los módulos.

De forma predeterminada, cuando Node.js carga un módulo desde una ruta que está enlazada simbólicamente a una ubicación diferente en el disco, Node.js eliminará la referencia del enlace y utilizará la "ruta real" real del módulo en el disco como identificador y como ruta raíz para ubicar otros módulos de dependencia. En la mayoría de los casos, este comportamiento predeterminado es aceptable. Sin embargo, cuando se utilizan dependencias de pares enlazadas simbólicamente, como se ilustra en el ejemplo a continuación, el comportamiento predeterminado hace que se lance una excepción si `moduleA` intenta requerir `moduleB` como una dependencia de par:

```text [TEXT]
{appDir}
 ├── app
 │   ├── index.js
 │   └── node_modules
 │       ├── moduleA -> {appDir}/moduleA
 │       └── moduleB
 │           ├── index.js
 │           └── package.json
 └── moduleA
     ├── index.js
     └── package.json
```
El flag de línea de comandos `--preserve-symlinks` indica a Node.js que utilice la ruta del enlace simbólico para los módulos en lugar de la ruta real, lo que permite encontrar las dependencias de pares enlazadas simbólicamente.

Tenga en cuenta, sin embargo, que el uso de `--preserve-symlinks` puede tener otros efectos secundarios. Específicamente, los módulos *nativos* enlazados simbólicamente pueden fallar al cargarse si están enlazados desde más de una ubicación en el árbol de dependencias (Node.js los vería como dos módulos separados e intentaría cargar el módulo varias veces, lo que provocaría que se lance una excepción).

El flag `--preserve-symlinks` no se aplica al módulo principal, lo que permite que `node --preserve-symlinks node_module/.bin/\<foo\>` funcione. Para aplicar el mismo comportamiento al módulo principal, utilice también `--preserve-symlinks-main`.


### `--preserve-symlinks-main` {#--preserve-symlinks}

**Agregado en: v10.2.0**

Instruye al cargador de módulos para preservar los enlaces simbólicos al resolver y almacenar en caché el módulo principal (`require.main`).

Este flag existe para que el módulo principal pueda optar por el mismo comportamiento que `--preserve-symlinks` le da a todas las demás importaciones; sin embargo, son flags separados, para la compatibilidad con versiones anteriores de Node.js.

`--preserve-symlinks-main` no implica `--preserve-symlinks`; use `--preserve-symlinks-main` además de `--preserve-symlinks` cuando no sea deseable seguir los enlaces simbólicos antes de resolver las rutas relativas.

Consulte [`--preserve-symlinks`](/es/nodejs/api/cli#--preserve-symlinks) para obtener más información.

### `-p`, `--print "script"` {#--preserve-symlinks-main}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v5.11.0 | Las bibliotecas integradas ahora están disponibles como variables predefinidas. |
| v0.6.4 | Agregado en: v0.6.4 |
:::

Idéntico a `-e` pero imprime el resultado.

### `--prof` {#-p---print-"script"}

**Agregado en: v2.0.0**

Generar la salida del generador de perfiles V8.

### `--prof-process` {#--prof}

**Agregado en: v5.2.0**

Procesar la salida del generador de perfiles V8 generada utilizando la opción V8 `--prof`.

### `--redirect-warnings=file` {#--prof-process}

**Agregado en: v8.0.0**

Escribir las advertencias del proceso en el archivo dado en lugar de imprimirlas en stderr. El archivo se creará si no existe y se agregará al final si ya existe. Si se produce un error al intentar escribir la advertencia en el archivo, la advertencia se escribirá en stderr en su lugar.

El nombre del `file` puede ser una ruta absoluta. Si no lo es, el directorio predeterminado en el que se escribirá está controlado por la opción de línea de comandos [`--diagnostic-dir`](/es/nodejs/api/cli#--diagnostic-dirdirectory).

### `--report-compact` {#--redirect-warnings=file}

**Agregado en: v13.12.0, v12.17.0**

Escribir informes en un formato compacto, JSON de una sola línea, más fácil de consumir por los sistemas de procesamiento de registros que el formato predeterminado de varias líneas diseñado para el consumo humano.

### `--report-dir=directory`, `report-directory=directory` {#--report-compact}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.12.0, v12.17.0 | Esta opción ya no es experimental. |
| v12.0.0 | Cambiado de `--diagnostic-report-directory` a `--report-directory`. |
| v11.8.0 | Agregado en: v11.8.0 |
:::

Ubicación en la que se generará el informe.


### `--report-exclude-env` {#--report-dir=directory-report-directory=directory}

**Añadido en: v23.3.0**

Cuando se pasa `--report-exclude-env`, el informe de diagnóstico generado no contendrá los datos de `environmentVariables`.

### `--report-exclude-network` {#--report-exclude-env}

**Añadido en: v22.0.0, v20.13.0**

Excluye `header.networkInterfaces` del informe de diagnóstico. Por defecto, esto no está configurado y las interfaces de red están incluidas.

### `--report-filename=filename` {#--report-exclude-network}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.12.0, v12.17.0 | Esta opción ya no es experimental. |
| v12.0.0 | cambió de `--diagnostic-report-filename` a `--report-filename`. |
| v11.8.0 | Añadido en: v11.8.0 |
:::

Nombre del archivo en el que se escribirá el informe.

Si el nombre del archivo se establece en `'stdout'` o `'stderr'`, el informe se escribe en stdout o stderr del proceso respectivamente.

### `--report-on-fatalerror` {#--report-filename=filename}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.0.0, v13.14.0, v12.17.0 | Esta opción ya no es experimental. |
| v12.0.0 | cambió de `--diagnostic-report-on-fatalerror` a `--report-on-fatalerror`. |
| v11.8.0 | Añadido en: v11.8.0 |
:::

Permite que el informe se active en errores fatales (errores internos dentro del tiempo de ejecución de Node.js, como falta de memoria) que conducen a la terminación de la aplicación. Útil para inspeccionar varios elementos de datos de diagnóstico, como montón, pila, estado del bucle de eventos, consumo de recursos, etc. para razonar sobre el error fatal.

### `--report-on-signal` {#--report-on-fatalerror}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.12.0, v12.17.0 | Esta opción ya no es experimental. |
| v12.0.0 | cambió de `--diagnostic-report-on-signal` a `--report-on-signal`. |
| v11.8.0 | Añadido en: v11.8.0 |
:::

Permite que se genere un informe al recibir la señal especificada (o predefinida) al proceso de Node.js en ejecución. La señal para activar el informe se especifica a través de `--report-signal`.

### `--report-signal=signal` {#--report-on-signal}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.12.0, v12.17.0 | Esta opción ya no es experimental. |
| v12.0.0 | cambió de `--diagnostic-report-signal` a `--report-signal`. |
| v11.8.0 | Añadido en: v11.8.0 |
:::

Establece o restablece la señal para la generación de informes (no compatible con Windows). La señal predeterminada es `SIGUSR2`.


### `--report-uncaught-exception` {#--report-signal=signal}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v18.8.0, v16.18.0 | El informe no se genera si la excepción no detectada se maneja. |
| v13.12.0, v12.17.0 | Esta opción ya no es experimental. |
| v12.0.0 | cambió de `--diagnostic-report-uncaught-exception` a `--report-uncaught-exception`. |
| v11.8.0 | Añadido en: v11.8.0 |
:::

Habilita la generación de un informe cuando el proceso se cierra debido a una excepción no detectada. Útil para inspeccionar la pila de JavaScript junto con la pila nativa y otros datos del entorno de ejecución.

### `-r`, `--require module` {#--report-uncaught-exception}

**Añadido en: v1.6.0**

Precarga el módulo especificado al inicio.

Sigue las reglas de resolución de módulos de `require()`. `module` puede ser una ruta a un archivo o un nombre de módulo de Node.

Solo se admiten módulos CommonJS. Usa [`--import`](/es/nodejs/api/cli#--importmodule) para precargar un [módulo ECMAScript](/es/nodejs/api/esm#modules-ecmascript-modules). Los módulos precargados con `--require` se ejecutarán antes que los módulos precargados con `--import`.

Los módulos se precargan en el hilo principal, así como en cualquier hilo de trabajador, proceso bifurcado o proceso agrupado.

### `--run` {#-r---require-module}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v22.3.0 | Se añade la variable de entorno NODE_RUN_SCRIPT_NAME. |
| v22.3.0 | Se añade la variable de entorno NODE_RUN_PACKAGE_JSON_PATH. |
| v22.3.0 | Recorre hasta el directorio raíz y encuentra un archivo `package.json` para ejecutar el comando desde allí, y actualiza la variable de entorno `PATH` en consecuencia. |
| v22.0.0 | Añadido en: v22.0.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Esto ejecuta un comando especificado del objeto `"scripts"` de un package.json. Si se proporciona un `"command"` faltante, mostrará los scripts disponibles.

`--run` recorrerá hasta el directorio raíz y encontrará un archivo `package.json` para ejecutar el comando desde allí.

`--run` antepone `./node_modules/.bin` para cada antecesor del directorio actual, al `PATH` para ejecutar los binarios de diferentes carpetas donde hay múltiples directorios `node_modules`, si `ancestor-folder/node_modules/.bin` es un directorio.

`--run` ejecuta el comando en el directorio que contiene el `package.json` relacionado.

Por ejemplo, el siguiente comando ejecutará el script `test` del `package.json` en la carpeta actual:

```bash [BASH]
$ node --run test
```
También puedes pasar argumentos al comando. Cualquier argumento después de `--` se añadirá al script:

```bash [BASH]
$ node --run test -- --verbose
```

#### Limitaciones intencionales {#--run}

`node --run` no está diseñado para coincidir con los comportamientos de `npm run` o de los comandos `run` de otros administradores de paquetes. La implementación de Node.js es intencionalmente más limitada, con el fin de centrarse en el máximo rendimiento para los casos de uso más comunes. Algunas características de otras implementaciones de `run` que se excluyen intencionalmente son:

- Ejecución de scripts `pre` o `post` además del script especificado.
- Definición de variables de entorno específicas del administrador de paquetes.

#### Variables de entorno {#intentional-limitations}

Las siguientes variables de entorno se establecen al ejecutar un script con `--run`:

- `NODE_RUN_SCRIPT_NAME`: El nombre del script que se está ejecutando. Por ejemplo, si `--run` se utiliza para ejecutar `test`, el valor de esta variable será `test`.
- `NODE_RUN_PACKAGE_JSON_PATH`: La ruta al `package.json` que se está procesando.

### `--secure-heap-min=n` {#environment-variables}

**Agregado en: v15.6.0**

Cuando se usa `--secure-heap`, el indicador `--secure-heap-min` especifica la asignación mínima del montón seguro. El valor mínimo es `2`. El valor máximo es el menor de `--secure-heap` o `2147483647`. El valor dado debe ser una potencia de dos.

### `--secure-heap=n` {#--secure-heap-min=n}

**Agregado en: v15.6.0**

Inicializa un montón seguro OpenSSL de `n` bytes. Cuando se inicializa, el montón seguro se utiliza para tipos seleccionados de asignaciones dentro de OpenSSL durante la generación de claves y otras operaciones. Esto es útil, por ejemplo, para evitar que la información confidencial se filtre debido a sobrepasos o desbordamientos de puntero.

El montón seguro tiene un tamaño fijo y no se puede cambiar de tamaño en tiempo de ejecución, por lo que, si se utiliza, es importante seleccionar un montón lo suficientemente grande como para cubrir todos los usos de la aplicación.

El tamaño del montón dado debe ser una potencia de dos. Cualquier valor menor que 2 desactivará el montón seguro.

El montón seguro está desactivado de forma predeterminada.

El montón seguro no está disponible en Windows.

Consulte [`CRYPTO_secure_malloc_init`](https://www.openssl.org/docs/man3.0/man3/CRYPTO_secure_malloc_init) para obtener más detalles.

### `--snapshot-blob=path` {#--secure-heap=n}

**Agregado en: v18.8.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Cuando se usa con `--build-snapshot`, `--snapshot-blob` especifica la ruta donde se escribe el blob de instantánea generado. Si no se especifica, el blob generado se escribe en `snapshot.blob` en el directorio de trabajo actual.

Cuando se usa sin `--build-snapshot`, `--snapshot-blob` especifica la ruta al blob que se utiliza para restaurar el estado de la aplicación.

Al cargar una instantánea, Node.js verifica que:

Si no coinciden, Node.js se niega a cargar la instantánea y sale con el código de estado 1.


### `--test` {#--snapshot-blob=path}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.0.0 | El ejecutor de pruebas ahora es estable. |
| v19.2.0, v18.13.0 | El ejecutor de pruebas ahora admite la ejecución en modo de supervisión. |
| v18.1.0, v16.17.0 | Añadido en: v18.1.0, v16.17.0 |
:::

Inicia el ejecutor de pruebas de la línea de comandos de Node.js. Este indicador no se puede combinar con `--watch-path`, `--check`, `--eval`, `--interactive` o el inspector. Consulte la documentación sobre [ejecución de pruebas desde la línea de comandos](/es/nodejs/api/test#running-tests-from-the-command-line) para obtener más detalles.

### `--test-concurrency` {#--test}

**Añadido en: v21.0.0, v20.10.0, v18.19.0**

El número máximo de archivos de prueba que la CLI del ejecutor de pruebas ejecutará simultáneamente. Si `--experimental-test-isolation` está establecido en `'none'`, este indicador se ignora y la concurrencia es uno. De lo contrario, la concurrencia por defecto es `os.availableParallelism() - 1`.

### `--test-coverage-branches=threshold` {#--test-concurrency}

**Añadido en: v22.8.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Requiere un porcentaje mínimo de ramas cubiertas. Si la cobertura del código no alcanza el umbral especificado, el proceso saldrá con el código `1`.

### `--test-coverage-exclude` {#--test-coverage-branches=threshold}

**Añadido en: v22.5.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Excluye archivos específicos de la cobertura del código utilizando un patrón glob, que puede coincidir tanto con rutas de archivos absolutas como relativas.

Esta opción se puede especificar varias veces para excluir varios patrones glob.

Si se proporcionan tanto `--test-coverage-exclude` como `--test-coverage-include`, los archivos deben cumplir **ambos** criterios para ser incluidos en el informe de cobertura.

De forma predeterminada, todos los archivos de prueba coincidentes se excluyen del informe de cobertura. Especificar esta opción anulará el comportamiento predeterminado.

### `--test-coverage-functions=threshold` {#--test-coverage-exclude}

**Añadido en: v22.8.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Requiere un porcentaje mínimo de funciones cubiertas. Si la cobertura del código no alcanza el umbral especificado, el proceso saldrá con el código `1`.


### `--test-coverage-include` {#--test-coverage-functions=threshold}

**Añadido en: v22.5.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Incluye archivos específicos en la cobertura de código utilizando un patrón glob, que puede coincidir con rutas de archivo absolutas y relativas.

Esta opción se puede especificar varias veces para incluir varios patrones glob.

Si se proporcionan tanto `--test-coverage-exclude` como `--test-coverage-include`, los archivos deben cumplir **ambos** criterios para ser incluidos en el informe de cobertura.

### `--test-coverage-lines=threshold` {#--test-coverage-include}

**Añadido en: v22.8.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Requiere un porcentaje mínimo de líneas cubiertas. Si la cobertura de código no alcanza el umbral especificado, el proceso saldrá con el código `1`.

### `--test-force-exit` {#--test-coverage-lines=threshold}

**Añadido en: v22.0.0, v20.14.0**

Configura el ejecutor de pruebas para salir del proceso una vez que todas las pruebas conocidas hayan terminado de ejecutarse, incluso si el bucle de eventos permaneciera activo de otro modo.

### `--test-name-pattern` {#--test-force-exit}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.0.0 | El ejecutor de pruebas ahora es estable. |
| v18.11.0 | Añadido en: v18.11.0 |
:::

Una expresión regular que configura el ejecutor de pruebas para ejecutar solo las pruebas cuyo nombre coincida con el patrón proporcionado. Consulte la documentación sobre [filtrado de pruebas por nombre](/es/nodejs/api/test#filtering-tests-by-name) para obtener más detalles.

Si se proporcionan tanto `--test-name-pattern` como `--test-skip-pattern`, las pruebas deben satisfacer **ambos** requisitos para poder ejecutarse.

### `--test-only` {#--test-name-pattern}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.0.0 | El ejecutor de pruebas ahora es estable. |
| v18.0.0, v16.17.0 | Añadido en: v18.0.0, v16.17.0 |
:::

Configura el ejecutor de pruebas para ejecutar solo las pruebas de nivel superior que tienen la opción `only` establecida. Esta bandera no es necesaria cuando la prueba de aislamiento está deshabilitada.

### `--test-reporter` {#--test-only}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.0.0 | El ejecutor de pruebas ahora es estable. |
| v19.6.0, v18.15.0 | Añadido en: v19.6.0, v18.15.0 |
:::

Un reportero de pruebas para usar al ejecutar pruebas. Consulte la documentación sobre [reporteros de pruebas](/es/nodejs/api/test#test-reporters) para obtener más detalles.


### `--test-reporter-destination` {#--test-reporter}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.0.0 | El ejecutor de pruebas ahora es estable. |
| v19.6.0, v18.15.0 | Añadido en: v19.6.0, v18.15.0 |
:::

El destino para el correspondiente informador de pruebas. Consulte la documentación sobre [informadores de pruebas](/es/nodejs/api/test#test-reporters) para obtener más detalles.

### `--test-shard` {#--test-reporter-destination}

**Añadido en: v20.5.0, v18.19.0**

Fragmento de la suite de pruebas que se ejecutará en un formato de `\<índice\>/\<total\>`, donde

`índice` es un entero positivo, índice de las partes divididas. `total` es un entero positivo, total de la parte dividida. Este comando dividirá todos los archivos de prueba en `total` partes iguales y solo ejecutará aquellos que estén en una parte de `índice`.

Por ejemplo, para dividir su suite de pruebas en tres partes, use esto:

```bash [BASH]
node --test --test-shard=1/3
node --test --test-shard=2/3
node --test --test-shard=3/3
```
### `--test-skip-pattern` {#--test-shard}

**Añadido en: v22.1.0**

Una expresión regular que configura el ejecutor de pruebas para omitir las pruebas cuyo nombre coincida con el patrón proporcionado. Consulte la documentación sobre [filtrado de pruebas por nombre](/es/nodejs/api/test#filtering-tests-by-name) para obtener más detalles.

Si se suministran tanto `--test-name-pattern` como `--test-skip-pattern`, las pruebas deben satisfacer **ambos** requisitos para poder ejecutarse.

### `--test-timeout` {#--test-skip-pattern}

**Añadido en: v21.2.0, v20.11.0**

Un número de milisegundos después del cual la ejecución de la prueba fallará. Si no se especifica, las subpruebas heredan este valor de su padre. El valor predeterminado es `Infinity`.

### `--test-update-snapshots` {#--test-timeout}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v23.4.0 | Las pruebas de instantáneas ya no son experimentales. |
| v22.3.0 | Añadido en: v22.3.0 |
:::

Regenera los archivos de instantáneas utilizados por el ejecutor de pruebas para las [pruebas de instantáneas](/es/nodejs/api/test#snapshot-testing).

### `--throw-deprecation` {#--test-update-snapshots}

**Añadido en: v0.11.14**

Lanza errores para las obsolescencias.

### `--title=title` {#--throw-deprecation}

**Añadido en: v10.7.0**

Establece `process.title` al inicio.

### `--tls-cipher-list=list` {#--title=title}

**Añadido en: v4.0.0**

Especifica una lista de cifrado TLS predeterminada alternativa. Requiere que Node.js se compile con soporte de criptografía (predeterminado).


### `--tls-keylog=file` {#--tls-cipher-list=list}

**Añadido en: v13.2.0, v12.16.0**

Registra el material de la clave TLS en un archivo. El material de la clave está en formato NSS `SSLKEYLOGFILE` y puede ser utilizado por software (como Wireshark) para descifrar el tráfico TLS.

### `--tls-max-v1.2` {#--tls-keylog=file}

**Añadido en: v12.0.0, v10.20.0**

Establece [`tls.DEFAULT_MAX_VERSION`](/es/nodejs/api/tls#tlsdefault_max_version) a 'TLSv1.2'. Utilícelo para desactivar la compatibilidad con TLSv1.3.

### `--tls-max-v1.3` {#--tls-max-v12}

**Añadido en: v12.0.0**

Establece el valor predeterminado [`tls.DEFAULT_MAX_VERSION`](/es/nodejs/api/tls#tlsdefault_max_version) a 'TLSv1.3'. Utilícelo para activar la compatibilidad con TLSv1.3.

### `--tls-min-v1.0` {#--tls-max-v13}

**Añadido en: v12.0.0, v10.20.0**

Establece el valor predeterminado [`tls.DEFAULT_MIN_VERSION`](/es/nodejs/api/tls#tlsdefault_min_version) a 'TLSv1'. Utilícelo para la compatibilidad con clientes o servidores TLS antiguos.

### `--tls-min-v1.1` {#--tls-min-v10}

**Añadido en: v12.0.0, v10.20.0**

Establece el valor predeterminado [`tls.DEFAULT_MIN_VERSION`](/es/nodejs/api/tls#tlsdefault_min_version) a 'TLSv1.1'. Utilícelo para la compatibilidad con clientes o servidores TLS antiguos.

### `--tls-min-v1.2` {#--tls-min-v11}

**Añadido en: v12.2.0, v10.20.0**

Establece el valor predeterminado [`tls.DEFAULT_MIN_VERSION`](/es/nodejs/api/tls#tlsdefault_min_version) a 'TLSv1.2'. Este es el valor predeterminado para 12.x y versiones posteriores, pero la opción es compatible para la compatibilidad con versiones anteriores de Node.js.

### `--tls-min-v1.3` {#--tls-min-v12}

**Añadido en: v12.0.0**

Establece el valor predeterminado [`tls.DEFAULT_MIN_VERSION`](/es/nodejs/api/tls#tlsdefault_min_version) a 'TLSv1.3'. Utilícelo para desactivar la compatibilidad con TLSv1.2, que no es tan seguro como TLSv1.3.

### `--trace-deprecation` {#--tls-min-v13}

**Añadido en: v0.8.0**

Imprime rastreos de pila para las obsolescencias.

### `--trace-env` {#--trace-deprecation}

**Añadido en: v23.4.0**

Imprime información sobre cualquier acceso a las variables de entorno realizado en la instancia actual de Node.js en stderr, incluyendo:

- Las lecturas de variables de entorno que Node.js realiza internamente.
- Escrituras en la forma de `process.env.KEY = "SOME VALUE"`.
- Lecturas en la forma de `process.env.KEY`.
- Definiciones en la forma de `Object.defineProperty(process.env, 'KEY', {...})`.
- Consultas en la forma de `Object.hasOwn(process.env, 'KEY')`, `process.env.hasOwnProperty('KEY')` o `'KEY' in process.env`.
- Eliminaciones en la forma de `delete process.env.KEY`.
- Enumeraciones en la forma de `...process.env` o `Object.keys(process.env)`.

Sólo se imprimen los nombres de las variables de entorno a las que se accede. Los valores no se imprimen.

Para imprimir el rastreo de la pila del acceso, utilice `--trace-env-js-stack` y/o `--trace-env-native-stack`.


### `--trace-env-js-stack` {#--trace-env}

**Añadido en: v23.4.0**

Además de lo que hace `--trace-env`, esto imprime el rastreo de pila de JavaScript del acceso.

### `--trace-env-native-stack` {#--trace-env-js-stack}

**Añadido en: v23.4.0**

Además de lo que hace `--trace-env`, esto imprime el rastreo de pila nativo del acceso.

### `--trace-event-categories` {#--trace-env-native-stack}

**Añadido en: v7.7.0**

Una lista separada por comas de categorías que deben ser rastreadas cuando el rastreo de eventos está habilitado usando `--trace-events-enabled`.

### `--trace-event-file-pattern` {#--trace-event-categories}

**Añadido en: v9.8.0**

Cadena de plantilla que especifica la ruta del archivo para los datos del evento de rastreo, admite `${rotation}` y `${pid}`.

### `--trace-events-enabled` {#--trace-event-file-pattern}

**Añadido en: v7.7.0**

Habilita la recolección de información de rastreo de eventos.

### `--trace-exit` {#--trace-events-enabled}

**Añadido en: v13.5.0, v12.16.0**

Imprime un rastreo de pila cada vez que un entorno se cierra proactivamente, es decir, invocando `process.exit()`.

### `--trace-require-module=mode` {#--trace-exit}

**Añadido en: v23.5.0**

Imprime información sobre el uso de [Cargando módulos ECMAScript usando `require()`] (/es/nodejs/api/modules#loading-ecmascript-modules-using-require).

Cuando `mode` es `all`, se imprime todo el uso. Cuando `mode` es `no-node-modules`, se excluye el uso de la carpeta `node_modules`.

### `--trace-sigint` {#--trace-require-module=mode}

**Añadido en: v13.9.0, v12.17.0**

Imprime un rastreo de pila en SIGINT.

### `--trace-sync-io` {#--trace-sigint}

**Añadido en: v2.1.0**

Imprime un rastreo de pila cada vez que se detecta E/S síncrona después del primer turno del bucle de eventos.

### `--trace-tls` {#--trace-sync-io}

**Añadido en: v12.2.0**

Imprime información de rastreo de paquetes TLS en `stderr`. Esto puede ser utilizado para depurar problemas de conexión TLS.

### `--trace-uncaught` {#--trace-tls}

**Añadido en: v13.1.0**

Imprime rastreos de pila para excepciones no capturadas; por lo general, se imprime el rastreo de pila asociado con la creación de un `Error`, mientras que esto hace que Node.js también imprima el rastreo de pila asociado con el lanzamiento del valor (que no necesita ser una instancia de `Error`).

Habilitar esta opción puede afectar negativamente el comportamiento de la recolección de basura.

### `--trace-warnings` {#--trace-uncaught}

**Añadido en: v6.0.0**

Imprime rastreos de pila para las advertencias del proceso (incluidas las depreciaciones).


### `--track-heap-objects` {#--trace-warnings}

**Añadido en: v2.4.0**

Realiza un seguimiento de las asignaciones de objetos heap para las instantáneas de heap.

### `--unhandled-rejections=mode` {#--track-heap-objects}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | Cambió el modo predeterminado a `throw`. Anteriormente, se emitía una advertencia. |
| v12.0.0, v10.17.0 | Añadido en: v12.0.0, v10.17.0 |
:::

Usar esta bandera permite cambiar lo que debería ocurrir cuando ocurre un rechazo no gestionado. Se puede elegir uno de los siguientes modos:

- `throw`: Emite [`unhandledRejection`](/es/nodejs/api/process#event-unhandledrejection). Si este gancho no está configurado, eleva el rechazo no gestionado como una excepción no capturada. Este es el valor predeterminado.
- `strict`: Eleva el rechazo no gestionado como una excepción no capturada. Si la excepción se maneja, se emite [`unhandledRejection`](/es/nodejs/api/process#event-unhandledrejection).
- `warn`: Siempre activa una advertencia, sin importar si el gancho [`unhandledRejection`](/es/nodejs/api/process#event-unhandledrejection) está configurado o no, pero no imprime la advertencia de obsolescencia.
- `warn-with-error-code`: Emite [`unhandledRejection`](/es/nodejs/api/process#event-unhandledrejection). Si este gancho no está configurado, activa una advertencia y establece el código de salida del proceso en 1.
- `none`: Silencia todas las advertencias.

Si ocurre un rechazo durante la fase de carga estática del módulo ES del punto de entrada de la línea de comandos, siempre lo elevará como una excepción no capturada.

### `--use-bundled-ca`, `--use-openssl-ca` {#--unhandled-rejections=mode}

**Añadido en: v6.11.0**

Usa el almacén de CA de Mozilla incluido, tal como lo proporciona la versión actual de Node.js, o usa el almacén de CA predeterminado de OpenSSL. El almacén predeterminado se puede seleccionar en tiempo de compilación.

El almacén de CA incluido, tal como lo proporciona Node.js, es una instantánea del almacén de CA de Mozilla que se fija en el momento del lanzamiento. Es idéntico en todas las plataformas compatibles.

Usar el almacén de OpenSSL permite modificaciones externas del almacén. Para la mayoría de las distribuciones de Linux y BSD, este almacén es mantenido por los mantenedores de la distribución y los administradores del sistema. La ubicación del almacén de CA de OpenSSL depende de la configuración de la biblioteca de OpenSSL, pero esto se puede modificar en tiempo de ejecución mediante variables de entorno.

Consulte `SSL_CERT_DIR` y `SSL_CERT_FILE`.


### `--use-largepages=mode` {#--use-bundled-ca---use-openssl-ca}

**Agregado en: v13.6.0, v12.17.0**

Reasigna el código estático de Node.js a páginas de memoria grandes al inicio. Si es compatible con el sistema de destino, esto hará que el código estático de Node.js se mueva a páginas de 2 MiB en lugar de páginas de 4 KiB.

Los siguientes valores son válidos para `mode`:

- `off`: No se intentará ninguna asignación. Este es el valor predeterminado.
- `on`: Si es compatible con el sistema operativo, se intentará la asignación. El fallo al asignar se ignorará y se imprimirá un mensaje en el error estándar.
- `silent`: Si es compatible con el sistema operativo, se intentará la asignación. El fallo al asignar se ignorará y no se informará.

### `--v8-options` {#--use-largepages=mode}

**Agregado en: v0.1.3**

Imprime las opciones de línea de comandos de V8.

### `--v8-pool-size=num` {#--v8-options}

**Agregado en: v5.10.0**

Establece el tamaño del grupo de subprocesos de V8 que se utilizará para asignar trabajos en segundo plano.

Si se establece en `0`, Node.js elegirá un tamaño apropiado del grupo de subprocesos basándose en una estimación de la cantidad de paralelismo.

La cantidad de paralelismo se refiere al número de cálculos que se pueden llevar a cabo simultáneamente en una máquina dada. En general, es lo mismo que la cantidad de CPU, pero puede diferir en entornos como VM o contenedores.

### `-v`, `--version` {#--v8-pool-size=num}

**Agregado en: v0.1.3**

Imprime la versión de node.

### `--watch` {#-v---version}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v22.0.0, v20.13.0 | El modo de vigilancia ahora es estable. |
| v19.2.0, v18.13.0 | El corredor de pruebas ahora admite la ejecución en modo de vigilancia. |
| v18.11.0, v16.19.0 | Agregado en: v18.11.0, v16.19.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Inicia Node.js en modo de vigilancia. Cuando está en modo de vigilancia, los cambios en los archivos vigilados hacen que el proceso de Node.js se reinicie. De forma predeterminada, el modo de vigilancia vigilará el punto de entrada y cualquier módulo requerido o importado. Utilice `--watch-path` para especificar qué rutas vigilar.

Este flag no se puede combinar con `--check`, `--eval`, `--interactive` o el REPL.

```bash [BASH]
node --watch index.js
```


### `--watch-path` {#--watch}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.0.0, v20.13.0 | El modo de observación ahora es estable. |
| v18.11.0, v16.19.0 | Añadido en: v18.11.0, v16.19.0 |
:::

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Inicia Node.js en modo de observación y especifica qué rutas observar. Cuando está en modo de observación, los cambios en las rutas observadas provocan el reinicio del proceso de Node.js. Esto desactivará la observación de los módulos requeridos o importados, incluso cuando se use en combinación con `--watch`.

Este indicador no se puede combinar con `--check`, `--eval`, `--interactive`, `--test` o el REPL.

```bash [BASH]
node --watch-path=./src --watch-path=./tests index.js
```
Esta opción solo se admite en macOS y Windows. Se lanzará una excepción `ERR_FEATURE_UNAVAILABLE_ON_PLATFORM` cuando la opción se use en una plataforma que no la admita.

### `--watch-preserve-output` {#--watch-path}

**Añadido en: v19.3.0, v18.13.0**

Desactiva el borrado de la consola cuando el modo de observación reinicia el proceso.

```bash [BASH]
node --watch --watch-preserve-output test.js
```
### `--zero-fill-buffers` {#--watch-preserve-output}

**Añadido en: v6.0.0**

Rellena automáticamente con ceros todas las instancias recién asignadas de [`Buffer`](/es/nodejs/api/buffer#class-buffer) y [`SlowBuffer`](/es/nodejs/api/buffer#class-slowbuffer).

## Variables de entorno {#--zero-fill-buffers}

### `FORCE_COLOR=[1, 2, 3]` {#environment-variables_1}

La variable de entorno `FORCE_COLOR` se usa para habilitar la salida con colores ANSI. El valor puede ser:

- `1`, `true` o la cadena vacía `''` indican soporte para 16 colores,
- `2` para indicar soporte para 256 colores, o
- `3` para indicar soporte para 16 millones de colores.

Cuando se usa `FORCE_COLOR` y se establece en un valor admitido, se ignoran tanto las variables de entorno `NO_COLOR` como `NODE_DISABLE_COLORS`.

Cualquier otro valor resultará en la desactivación de la salida con colores.

### `NODE_COMPILE_CACHE=dir` {#force_color=1-2-3}

**Añadido en: v22.1.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo Activo
:::

Habilita la [caché de compilación de módulos](/es/nodejs/api/module#module-compile-cache) para la instancia de Node.js. Consulte la documentación de [caché de compilación de módulos](/es/nodejs/api/module#module-compile-cache) para obtener más detalles.


### `NODE_DEBUG=module[,…]` {#node_compile_cache=dir}

**Agregado en: v0.1.32**

Lista separada por `','` de los módulos centrales que deberían imprimir información de depuración.

### `NODE_DEBUG_NATIVE=module[,…]` {#node_debug=module}

Lista separada por `','` de los módulos centrales de C++ que deberían imprimir información de depuración.

### `NODE_DISABLE_COLORS=1` {#node_debug_native=module}

**Agregado en: v0.3.0**

Cuando se establece, los colores no se utilizarán en el REPL.

### `NODE_DISABLE_COMPILE_CACHE=1` {#node_disable_colors=1}

**Agregado en: v22.8.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo Activo
:::

Desactiva la [caché de compilación de módulos](/es/nodejs/api/module#module-compile-cache) para la instancia de Node.js. Consulta la documentación de [caché de compilación de módulos](/es/nodejs/api/module#module-compile-cache) para obtener más detalles.

### `NODE_EXTRA_CA_CERTS=file` {#node_disable_compile_cache=1}

**Agregado en: v7.3.0**

Cuando se establece, las CA "raíz" conocidas (como VeriSign) se extenderán con los certificados adicionales en `file`. El archivo debe constar de uno o más certificados de confianza en formato PEM. Se emitirá un mensaje (una vez) con [`process.emitWarning()`](/es/nodejs/api/process#processemitwarningwarning-options) si el archivo falta o está mal formado, pero cualquier otro error se ignorará.

Ni los certificados conocidos ni los adicionales se utilizan cuando la propiedad de opciones `ca` se especifica explícitamente para un cliente o servidor TLS o HTTPS.

Esta variable de entorno se ignora cuando `node` se ejecuta como setuid root o tiene capacidades de archivo Linux establecidas.

La variable de entorno `NODE_EXTRA_CA_CERTS` solo se lee cuando se inicia el proceso de Node.js por primera vez. Cambiar el valor en tiempo de ejecución usando `process.env.NODE_EXTRA_CA_CERTS` no tiene ningún efecto en el proceso actual.

### `NODE_ICU_DATA=file` {#node_extra_ca_certs=file}

**Agregado en: v0.11.15**

Ruta de datos para los datos ICU (objeto `Intl`). Extenderá los datos vinculados cuando se compile con soporte de small-icu.

### `NODE_NO_WARNINGS=1` {#node_icu_data=file}

**Agregado en: v6.11.0**

Cuando se establece en `1`, las advertencias del proceso se silencian.

### `NODE_OPTIONS=options...` {#node_no_warnings=1}

**Agregado en: v8.0.0**

Una lista de opciones de línea de comandos separadas por espacios. `options...` se interpretan antes de las opciones de línea de comandos, por lo que las opciones de línea de comandos anularán o se combinarán después de cualquier cosa en `options...`. Node.js saldrá con un error si se utiliza una opción que no está permitida en el entorno, como `-p` o un archivo de script.

Si un valor de opción contiene un espacio, se puede escapar usando comillas dobles:

```bash [BASH]
NODE_OPTIONS='--require "./my path/file.js"'
```
Un indicador singleton pasado como una opción de línea de comandos anulará el mismo indicador pasado a `NODE_OPTIONS`:

```bash [BASH]
# El inspector estará disponible en el puerto 5555 {#node_options=options}
NODE_OPTIONS='--inspect=localhost:4444' node --inspect=localhost:5555
```
Un indicador que se puede pasar varias veces se tratará como si sus instancias `NODE_OPTIONS` se pasaran primero, y luego sus instancias de línea de comandos después:

```bash [BASH]
NODE_OPTIONS='--require "./a.js"' node --require "./b.js"
# es equivalente a: {#the-inspector-will-be-available-on-port-5555}
node --require "./a.js" --require "./b.js"
```
Las opciones de Node.js que están permitidas están en la siguiente lista. Si una opción admite ambas variantes --XX y --no-XX, ambas son compatibles, pero solo una se incluye en la lista a continuación.

- `--allow-addons`
- `--allow-child-process`
- `--allow-fs-read`
- `--allow-fs-write`
- `--allow-wasi`
- `--allow-worker`
- `--conditions`, `-C`
- `--diagnostic-dir`
- `--disable-proto`
- `--disable-warning`
- `--disable-wasm-trap-handler`
- `--dns-result-order`
- `--enable-fips`
- `--enable-network-family-autoselection`
- `--enable-source-maps`
- `--entry-url`
- `--experimental-abortcontroller`
- `--experimental-async-context-frame`
- `--experimental-detect-module`
- `--experimental-eventsource`
- `--experimental-import-meta-resolve`
- `--experimental-json-modules`
- `--experimental-loader`
- `--experimental-modules`
- `--experimental-permission`
- `--experimental-print-required-tla`
- `--experimental-require-module`
- `--experimental-shadow-realm`
- `--experimental-specifier-resolution`
- `--experimental-strip-types`
- `--experimental-top-level-await`
- `--experimental-transform-types`
- `--experimental-vm-modules`
- `--experimental-wasi-unstable-preview1`
- `--experimental-wasm-modules`
- `--experimental-webstorage`
- `--force-context-aware`
- `--force-fips`
- `--force-node-api-uncaught-exceptions-policy`
- `--frozen-intrinsics`
- `--heap-prof-dir`
- `--heap-prof-interval`
- `--heap-prof-name`
- `--heap-prof`
- `--heapsnapshot-near-heap-limit`
- `--heapsnapshot-signal`
- `--http-parser`
- `--icu-data-dir`
- `--import`
- `--input-type`
- `--insecure-http-parser`
- `--inspect-brk`
- `--inspect-port`, `--debug-port`
- `--inspect-publish-uid`
- `--inspect-wait`
- `--inspect`
- `--localstorage-file`
- `--max-http-header-size`
- `--napi-modules`
- `--network-family-autoselection-attempt-timeout`
- `--no-addons`
- `--no-deprecation`
- `--no-experimental-global-navigator`
- `--no-experimental-repl-await`
- `--no-experimental-sqlite`
- `--no-experimental-websocket`
- `--no-extra-info-on-fatal-exception`
- `--no-force-async-hooks-checks`
- `--no-global-search-paths`
- `--no-network-family-autoselection`
- `--no-warnings`
- `--node-memory-debug`
- `--openssl-config`
- `--openssl-legacy-provider`
- `--openssl-shared-config`
- `--pending-deprecation`
- `--permission`
- `--preserve-symlinks-main`
- `--preserve-symlinks`
- `--prof-process`
- `--redirect-warnings`
- `--report-compact`
- `--report-dir`, `--report-directory`
- `--report-exclude-env`
- `--report-exclude-network`
- `--report-filename`
- `--report-on-fatalerror`
- `--report-on-signal`
- `--report-signal`
- `--report-uncaught-exception`
- `--require`, `-r`
- `--secure-heap-min`
- `--secure-heap`
- `--snapshot-blob`
- `--test-coverage-branches`
- `--test-coverage-exclude`
- `--test-coverage-functions`
- `--test-coverage-include`
- `--test-coverage-lines`
- `--test-name-pattern`
- `--test-only`
- `--test-reporter-destination`
- `--test-reporter`
- `--test-shard`
- `--test-skip-pattern`
- `--throw-deprecation`
- `--title`
- `--tls-cipher-list`
- `--tls-keylog`
- `--tls-max-v1.2`
- `--tls-max-v1.3`
- `--tls-min-v1.0`
- `--tls-min-v1.1`
- `--tls-min-v1.2`
- `--tls-min-v1.3`
- `--trace-deprecation`
- `--trace-env-js-stack`
- `--trace-env-native-stack`
- `--trace-env`
- `--trace-event-categories`
- `--trace-event-file-pattern`
- `--trace-events-enabled`
- `--trace-exit`
- `--trace-require-module`
- `--trace-sigint`
- `--trace-sync-io`
- `--trace-tls`
- `--trace-uncaught`
- `--trace-warnings`
- `--track-heap-objects`
- `--unhandled-rejections`
- `--use-bundled-ca`
- `--use-largepages`
- `--use-openssl-ca`
- `--v8-pool-size`
- `--watch-path`
- `--watch-preserve-output`
- `--watch`
- `--zero-fill-buffers`

Las opciones de V8 que están permitidas son:

- `--abort-on-uncaught-exception`
- `--disallow-code-generation-from-strings`
- `--enable-etw-stack-walking`
- `--expose-gc`
- `--interpreted-frames-native-stack`
- `--jitless`
- `--max-old-space-size`
- `--max-semi-space-size`
- `--perf-basic-prof-only-functions`
- `--perf-basic-prof`
- `--perf-prof-unwinding-info`
- `--perf-prof`
- `--stack-trace-limit`

`--perf-basic-prof-only-functions`, `--perf-basic-prof`, `--perf-prof-unwinding-info` y `--perf-prof` solo están disponibles en Linux.

`--enable-etw-stack-walking` solo está disponible en Windows.


### `NODE_PATH=ruta[:…]` {#is-equivalent-to}

**Agregado en: v0.1.32**

Lista de directorios separados por `':'` que se anteponen a la ruta de búsqueda de módulos.

En Windows, esta es una lista separada por `';'` en su lugar.

### `NODE_PENDING_DEPRECATION=1` {#node_path=path}

**Agregado en: v8.0.0**

Cuando se establece en `1`, emite advertencias de obsolescencia pendientes.

Las obsolescencias pendientes son generalmente idénticas a una obsolescencia en tiempo de ejecución, con la notable excepción de que están *desactivadas* de forma predeterminada y no se emitirán a menos que se establezca el indicador de línea de comandos `--pending-deprecation` o la variable de entorno `NODE_PENDING_DEPRECATION=1`. Las obsolescencias pendientes se utilizan para proporcionar una especie de mecanismo selectivo de "alerta temprana" que los desarrolladores pueden aprovechar para detectar el uso de API obsoletas.

### `NODE_PENDING_PIPE_INSTANCES=instancias` {#node_pending_deprecation=1}

Establece el número de manejadores de instancias de tubería pendientes cuando el servidor de tuberías está esperando conexiones. Esta configuración se aplica solo a Windows.

### `NODE_PRESERVE_SYMLINKS=1` {#node_pending_pipe_instances=instances}

**Agregado en: v7.1.0**

Cuando se establece en `1`, indica al cargador de módulos que conserve los enlaces simbólicos al resolver y almacenar en caché los módulos.

### `NODE_REDIRECT_WARNINGS=archivo` {#node_preserve_symlinks=1}

**Agregado en: v8.0.0**

Cuando se establece, las advertencias del proceso se emitirán al archivo dado en lugar de imprimirse en stderr. El archivo se creará si no existe y se agregará si existe. Si se produce un error al intentar escribir la advertencia en el archivo, la advertencia se escribirá en stderr en su lugar. Esto es equivalente a usar el indicador de línea de comandos `--redirect-warnings=archivo`.

### `NODE_REPL_EXTERNAL_MODULE=archivo` {#node_redirect_warnings=file}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v22.3.0, v20.16.0 | Eliminar la posibilidad de usar esta variable de entorno con kDisableNodeOptionsEnv para integradores. |
| v13.0.0, v12.16.0 | Agregado en: v13.0.0, v12.16.0 |
:::

Ruta a un módulo de Node.js que se cargará en lugar del REPL incorporado. Si se sobreescribe este valor a una cadena vacía (`''`), se usará el REPL incorporado.

### `NODE_REPL_HISTORY=archivo` {#node_repl_external_module=file}

**Agregado en: v3.0.0**

Ruta al archivo utilizado para almacenar el historial persistente de REPL. La ruta predeterminada es `~/.node_repl_history`, que se reemplaza por esta variable. Establecer el valor en una cadena vacía (`''` o `' '`) desactiva el historial persistente de REPL.


### `NODE_SKIP_PLATFORM_CHECK=valor` {#node_repl_history=file}

**Añadido en: v14.5.0**

Si `valor` es igual a `'1'`, la comprobación de una plataforma compatible se omite durante el inicio de Node.js. Es posible que Node.js no se ejecute correctamente. Cualquier problema encontrado en plataformas no compatibles no será solucionado.

### `NODE_TEST_CONTEXT=valor` {#node_skip_platform_check=value}

Si `valor` es igual a `'child'`, las opciones del reportero de pruebas se sobrescribirán y la salida de la prueba se enviará a stdout en formato TAP. Si se proporciona cualquier otro valor, Node.js no ofrece garantías sobre el formato del reportero utilizado ni su estabilidad.

### `NODE_TLS_REJECT_UNAUTHORIZED=valor` {#node_test_context=value}

Si `valor` es igual a `'0'`, la validación del certificado se desactiva para las conexiones TLS. Esto hace que TLS, y HTTPS por extensión, sean inseguros. Se desaconseja encarecidamente el uso de esta variable de entorno.

### `NODE_V8_COVERAGE=dir` {#node_tls_reject_unauthorized=value}

Cuando se establece, Node.js comenzará a generar datos de [cobertura de código JavaScript V8](https://v8project.blogspot.com/2017/12/javascript-code-coverage) y [Mapa de origen](https://sourcemaps.info/spec) al directorio proporcionado como argumento (la información de cobertura se escribe como JSON en archivos con un prefijo `coverage`).

`NODE_V8_COVERAGE` se propagará automáticamente a los subprocesos, lo que facilitará la instrumentación de las aplicaciones que llaman a la familia de funciones `child_process.spawn()`. `NODE_V8_COVERAGE` se puede establecer en una cadena vacía para evitar la propagación.

### `NO_COLOR=&lt;cualquiera&gt;` {#node_v8_coverage=dir}

[`NO_COLOR`](https://no-color.org/) es un alias para `NODE_DISABLE_COLORS`. El valor de la variable de entorno es arbitrario.

#### Salida de cobertura {#no_color=&lt;any&gt;}

La cobertura se genera como una matriz de objetos [ScriptCoverage](https://chromedevtools.github.io/devtools-protocol/tot/Profiler#type-ScriptCoverage) en la clave de nivel superior `result`:

```json [JSON]
{
  "result": [
    {
      "scriptId": "67",
      "url": "internal/tty.js",
      "functions": []
    }
  ]
}
```
#### Caché de mapa de origen {#coverage-output}

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Si se encuentran, los datos del mapa de origen se adjuntan a la clave de nivel superior `source-map-cache` en el objeto de cobertura JSON.

`source-map-cache` es un objeto con claves que representan los archivos de los que se extrajeron los mapas de origen, y valores que incluyen la URL del mapa de origen sin procesar (en la clave `url`), la información analizada de Source Map v3 (en la clave `data`) y las longitudes de línea del archivo de origen (en la clave `lineLengths`).

```json [JSON]
{
  "result": [
    {
      "scriptId": "68",
      "url": "file:///absolute/path/to/source.js",
      "functions": []
    }
  ],
  "source-map-cache": {
    "file:///absolute/path/to/source.js": {
      "url": "./path-to-map.json",
      "data": {
        "version": 3,
        "sources": [
          "file:///absolute/path/to/original.js"
        ],
        "names": [
          "Foo",
          "console",
          "info"
        ],
        "mappings": "MAAMA,IACJC,YAAaC",
        "sourceRoot": "./"
      },
      "lineLengths": [
        13,
        62,
        38,
        27
      ]
    }
  }
}
```

### `OPENSSL_CONF=archivo` {#source-map-cache}

**Añadido en: v6.11.0**

Carga un archivo de configuración de OpenSSL al inicio. Entre otros usos, esto puede ser utilizado para habilitar criptografía compatible con FIPS si Node.js está construido con `./configure --openssl-fips`.

Si la opción de línea de comandos [`--openssl-config`](/es/nodejs/api/cli#--openssl-configfile) es utilizada, la variable de entorno es ignorada.

### `SSL_CERT_DIR=directorio` {#openssl_conf=file}

**Añadido en: v7.7.0**

Si `--use-openssl-ca` está habilitado, esto anula y establece el directorio de OpenSSL que contiene los certificados de confianza.

Ten en cuenta que, a menos que el entorno hijo esté explícitamente configurado, esta variable de entorno será heredada por cualquier proceso hijo, y si utilizan OpenSSL, puede causar que confíen en las mismas CA que node.

### `SSL_CERT_FILE=archivo` {#ssl_cert_dir=dir}

**Añadido en: v7.7.0**

Si `--use-openssl-ca` está habilitado, esto anula y establece el archivo de OpenSSL que contiene los certificados de confianza.

Ten en cuenta que, a menos que el entorno hijo esté explícitamente configurado, esta variable de entorno será heredada por cualquier proceso hijo, y si utilizan OpenSSL, puede causar que confíen en las mismas CA que node.

### `TZ` {#ssl_cert_file=file}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v16.2.0 | Cambiar la variable TZ usando process.env.TZ = cambia la zona horaria también en Windows. |
| v13.0.0 | Cambiar la variable TZ usando process.env.TZ = cambia la zona horaria en sistemas POSIX. |
| v0.0.1 | Añadido en: v0.0.1 |
:::

La variable de entorno `TZ` se utiliza para especificar la configuración de la zona horaria.

Si bien Node.js no admite todas las diversas [formas en que `TZ` se maneja en otros entornos](https://www.gnu.org/software/libc/manual/html_node/TZ-Variable), sí admite [identificadores de zona horaria](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) básicos (como `'Etc/UTC'`, `'Europe/Paris'` o `'America/New_York'`). Puede admitir algunas otras abreviaturas o alias, pero estos están fuertemente desaconsejados y no están garantizados.

```bash [BASH]
$ TZ=Europe/Dublin node -pe "new Date().toString()"
Wed May 12 2021 20:30:48 GMT+0100 (Irish Standard Time)
```


### `UV_THREADPOOL_SIZE=tamaño` {#tz}

Establece el número de hilos utilizados en el pool de hilos de libuv a `tamaño` hilos.

Las APIs asíncronas del sistema son utilizadas por Node.js siempre que sea posible, pero donde no existen, el pool de hilos de libuv se utiliza para crear APIs de nodo asíncronas basadas en APIs síncronas del sistema. Las APIs de Node.js que utilizan el pool de hilos son:

- todas las APIs `fs`, aparte de las APIs de vigilancia de archivos y aquellas que son explícitamente síncronas
- APIs criptográficas asíncronas como `crypto.pbkdf2()`, `crypto.scrypt()`, `crypto.randomBytes()`, `crypto.randomFill()`, `crypto.generateKeyPair()`
- `dns.lookup()`
- todas las APIs `zlib`, aparte de aquellas que son explícitamente síncronas

Debido a que el pool de hilos de libuv tiene un tamaño fijo, significa que si por alguna razón alguna de estas APIs tarda mucho tiempo, otras APIs (aparentemente no relacionadas) que se ejecutan en el pool de hilos de libuv experimentarán un rendimiento degradado. Para mitigar este problema, una posible solución es aumentar el tamaño del pool de hilos de libuv estableciendo la variable de entorno `'UV_THREADPOOL_SIZE'` a un valor mayor que `4` (su valor predeterminado actual). Sin embargo, establecer esto desde dentro del proceso utilizando `process.env.UV_THREADPOOL_SIZE=tamaño` no está garantizado que funcione, ya que el pool de hilos se habría creado como parte de la inicialización del tiempo de ejecución mucho antes de que se ejecute el código del usuario. Para obtener más información, consulte la [documentación del pool de hilos de libuv](https://docs.libuv.org/en/latest/threadpool).

## Opciones útiles de V8 {#uv_threadpool_size=size}

V8 tiene su propio conjunto de opciones de CLI. Cualquier opción de CLI de V8 que se proporcione a `node` se pasará a V8 para que la gestione. Las opciones de V8 *no tienen garantía de estabilidad*. El propio equipo de V8 no las considera parte de su API formal y se reserva el derecho de cambiarlas en cualquier momento. Del mismo modo, no están cubiertas por las garantías de estabilidad de Node.js. Muchas de las opciones de V8 son de interés sólo para los desarrolladores de V8. A pesar de esto, hay un pequeño conjunto de opciones de V8 que son ampliamente aplicables a Node.js, y están documentadas aquí:

### `--abort-on-uncaught-exception` {#useful-v8-options}


### `--disallow-code-generation-from-strings` {#--abort-on-uncaught-exception_1}

### `--enable-etw-stack-walking` {#--disallow-code-generation-from-strings_1}

### `--expose-gc` {#--enable-etw-stack-walking}

### `--harmony-shadow-realm` {#--expose-gc_1}

### `--interpreted-frames-native-stack` {#--harmony-shadow-realm}

### `--jitless` {#--interpreted-frames-native-stack}

### `--max-old-space-size=SIZE` (en MiB) {#--jitless_1}

Establece el tamaño máximo de memoria de la sección de memoria antigua de V8. A medida que el consumo de memoria se acerca al límite, V8 dedicará más tiempo a la recolección de basura en un esfuerzo por liberar memoria no utilizada.

En una máquina con 2 GiB de memoria, considere establecer esto en 1536 (1.5 GiB) para dejar algo de memoria para otros usos y evitar el intercambio.

```bash [BASH]
node --max-old-space-size=1536 index.js
```
### `--max-semi-space-size=SIZE` (en MiB) {#--max-old-space-size=size-in-mib}

Establece el tamaño máximo del [semi-espacio](https://www.memorymanagement.org/glossary/s#semi.space) para el [recolector de basura de limpieza](https://v8.dev/blog/orinoco-parallel-scavenger) de V8 en MiB (mebibytes). Aumentar el tamaño máximo de un semi-espacio puede mejorar el rendimiento de Node.js a costa de un mayor consumo de memoria.

Dado que el tamaño de la generación joven del montón de V8 es tres veces (ver [`YoungGenerationSizeFromSemiSpaceSize`](https://chromium.googlesource.com/v8/v8.git/+/refs/tags/10.3.129/src/heap/heap.cc#328) en V8) el tamaño del semi-espacio, un aumento de 1 MiB al semi-espacio se aplica a cada uno de los tres semi-espacios individuales y hace que el tamaño del montón aumente en 3 MiB. La mejora del rendimiento depende de su carga de trabajo (ver [#42511](https://github.com/nodejs/node/issues/42511)).

El valor predeterminado depende del límite de memoria. Por ejemplo, en sistemas de 64 bits con un límite de memoria de 512 MiB, el tamaño máximo de un semi-espacio predeterminado es de 1 MiB. Para límites de memoria de hasta 2 GiB inclusive, el tamaño máximo predeterminado de un semi-espacio será inferior a 16 MiB en sistemas de 64 bits.

Para obtener la mejor configuración para su aplicación, debe probar diferentes valores de max-semi-space-size al ejecutar puntos de referencia para su aplicación.

Por ejemplo, punto de referencia en sistemas de 64 bits:

```bash [BASH]
for MiB in 16 32 64 128; do
    node --max-semi-space-size=$MiB index.js
done
```

### `--perf-basic-prof` {#--max-semi-space-size=size-in-mib}

### `--perf-basic-prof-only-functions` {#--perf-basic-prof}

### `--perf-prof` {#--perf-basic-prof-only-functions}

### `--perf-prof-unwinding-info` {#--perf-prof}

### `--prof` {#--perf-prof-unwinding-info}

### `--security-revert` {#--prof_1}

### `--stack-trace-limit=limit` {#--security-revert}

El número máximo de marcos de pila para recolectar en el seguimiento de pila de un error. Establecerlo en 0 deshabilita la recolección del seguimiento de pila. El valor predeterminado es 10.

```bash [BASH]
node --stack-trace-limit=12 -p -e "Error.stackTraceLimit" # imprime 12
```

