---
title: Eventos de seguimiento de Node.js
description: Documentación sobre cómo usar la API de eventos de seguimiento de Node.js para el perfilado de rendimiento y la depuración.
head:
  - - meta
    - name: og:title
      content: Eventos de seguimiento de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Documentación sobre cómo usar la API de eventos de seguimiento de Node.js para el perfilado de rendimiento y la depuración.
  - - meta
    - name: twitter:title
      content: Eventos de seguimiento de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Documentación sobre cómo usar la API de eventos de seguimiento de Node.js para el perfilado de rendimiento y la depuración.
---


# Eventos de seguimiento {#trace-events}

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

**Código fuente:** [lib/trace_events.js](https://github.com/nodejs/node/blob/v23.5.0/lib/trace_events.js)

El módulo `node:trace_events` proporciona un mecanismo para centralizar la información de seguimiento generada por V8, el núcleo de Node.js y el código del espacio de usuario.

El seguimiento se puede habilitar con el indicador de línea de comandos `--trace-event-categories` o utilizando el módulo `node:trace_events`. El indicador `--trace-event-categories` acepta una lista de nombres de categorías separados por comas.

Las categorías disponibles son:

- `node`: Un marcador de posición vacío.
- `node.async_hooks`: Habilita la captura de datos de seguimiento detallados de [`async_hooks`](/es/nodejs/api/async_hooks). Los eventos [`async_hooks`](/es/nodejs/api/async_hooks) tienen un `asyncId` único y una propiedad especial `triggerId` `triggerAsyncId`.
- `node.bootstrap`: Habilita la captura de hitos de arranque de Node.js.
- `node.console`: Habilita la captura de la salida de `console.time()` y `console.count()`.
- `node.threadpoolwork.sync`: Habilita la captura de datos de seguimiento para operaciones síncronas del grupo de subprocesos, como `blob`, `zlib`, `crypto` y `node_api`.
- `node.threadpoolwork.async`: Habilita la captura de datos de seguimiento para operaciones asíncronas del grupo de subprocesos, como `blob`, `zlib`, `crypto` y `node_api`.
- `node.dns.native`: Habilita la captura de datos de seguimiento para consultas DNS.
- `node.net.native`: Habilita la captura de datos de seguimiento para la red.
- `node.environment`: Habilita la captura de hitos del entorno de Node.js.
- `node.fs.sync`: Habilita la captura de datos de seguimiento para métodos síncronos del sistema de archivos.
- `node.fs_dir.sync`: Habilita la captura de datos de seguimiento para métodos de directorio síncronos del sistema de archivos.
- `node.fs.async`: Habilita la captura de datos de seguimiento para métodos asíncronos del sistema de archivos.
- `node.fs_dir.async`: Habilita la captura de datos de seguimiento para métodos de directorio asíncronos del sistema de archivos.
- `node.perf`: Habilita la captura de mediciones de la [API de rendimiento](/es/nodejs/api/perf_hooks).
    - `node.perf.usertiming`: Habilita la captura solo de medidas y marcas de tiempo de usuario de la API de rendimiento.
    - `node.perf.timerify`: Habilita la captura solo de medidas de timerify de la API de rendimiento.


- `node.promises.rejections`: Habilita la captura de datos de seguimiento que rastrean el número de rechazos de Promise no manejados y manejados después del rechazo.
- `node.vm.script`: Habilita la captura de datos de seguimiento para los métodos `runInNewContext()`, `runInContext()` y `runInThisContext()` del módulo `node:vm`.
- `v8`: Los eventos [V8](/es/nodejs/api/v8) están relacionados con la recolección de basura, la compilación y la ejecución.
- `node.http`: Habilita la captura de datos de seguimiento para la solicitud/respuesta http.
- `node.module_timer`: Habilita la captura de datos de seguimiento para la carga de módulos CJS.

Por defecto, las categorías `node`, `node.async_hooks` y `v8` están habilitadas.

```bash [BASH]
node --trace-event-categories v8,node,node.async_hooks server.js
```
Las versiones anteriores de Node.js requerían el uso del indicador `--trace-events-enabled` para habilitar los eventos de seguimiento. Este requisito ha sido eliminado. Sin embargo, el indicador `--trace-events-enabled` *aún puede* usarse y habilitará las categorías de eventos de seguimiento `node`, `node.async_hooks` y `v8` de forma predeterminada.

```bash [BASH]
node --trace-events-enabled

# es equivalente a {#is-equivalent-to}

node --trace-event-categories v8,node,node.async_hooks
```
Alternativamente, los eventos de seguimiento se pueden habilitar utilizando el módulo `node:trace_events`:

```js [ESM]
const trace_events = require('node:trace_events');
const tracing = trace_events.createTracing({ categories: ['node.perf'] });
tracing.enable();  // Habilita la captura de eventos de seguimiento para la categoría 'node.perf'

// hacer el trabajo

tracing.disable();  // Deshabilita la captura de eventos de seguimiento para la categoría 'node.perf'
```
Ejecutar Node.js con el seguimiento habilitado producirá archivos de registro que se pueden abrir en la pestaña [`chrome://tracing`](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) de Chrome.

El archivo de registro se llama por defecto `node_trace.${rotation}.log`, donde `${rotation}` es un ID de rotación de registro incremental. El patrón de la ruta del archivo se puede especificar con `--trace-event-file-pattern` que acepta una cadena de plantilla que admite `${rotation}` y `${pid}`:

```bash [BASH]
node --trace-event-categories v8 --trace-event-file-pattern '${pid}-${rotation}.log' server.js
```
Para garantizar que el archivo de registro se genere correctamente después de los eventos de señal como `SIGINT`, `SIGTERM` o `SIGBREAK`, asegúrese de tener los controladores apropiados en su código, como:

```js [ESM]
process.on('SIGINT', function onSigint() {
  console.info('Received SIGINT.');
  process.exit(130);  // O el código de salida aplicable según el sistema operativo y la señal
});
```
El sistema de seguimiento utiliza la misma fuente de tiempo que la utilizada por `process.hrtime()`. Sin embargo, las marcas de tiempo del evento de seguimiento se expresan en microsegundos, a diferencia de `process.hrtime()` que devuelve nanosegundos.

Las características de este módulo no están disponibles en los hilos [`Worker`](/es/nodejs/api/worker_threads#class-worker).


## El módulo `node:trace_events` {#the-nodetrace_events-module}

**Agregado en: v10.0.0**

### Objeto `Tracing` {#tracing-object}

**Agregado en: v10.0.0**

El objeto `Tracing` se utiliza para habilitar o deshabilitar el rastreo de conjuntos de categorías. Las instancias se crean utilizando el método `trace_events.createTracing()`.

Cuando se crea, el objeto `Tracing` está deshabilitado. Al llamar al método `tracing.enable()`, se añaden las categorías al conjunto de categorías de eventos de rastreo habilitadas. Al llamar a `tracing.disable()`, se eliminan las categorías del conjunto de categorías de eventos de rastreo habilitadas.

#### `tracing.categories` {#tracingcategories}

**Agregado en: v10.0.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Una lista separada por comas de las categorías de eventos de rastreo cubiertas por este objeto `Tracing`.

#### `tracing.disable()` {#tracingdisable}

**Agregado en: v10.0.0**

Deshabilita este objeto `Tracing`.

Solo se deshabilitarán las categorías de eventos de rastreo *no* cubiertas por otros objetos `Tracing` habilitados y *no* especificadas por el flag `--trace-event-categories`.

```js [ESM]
const trace_events = require('node:trace_events');
const t1 = trace_events.createTracing({ categories: ['node', 'v8'] });
const t2 = trace_events.createTracing({ categories: ['node.perf', 'node'] });
t1.enable();
t2.enable();

// Imprime 'node,node.perf,v8'
console.log(trace_events.getEnabledCategories());

t2.disable(); // Solo deshabilitará la emisión de la categoría 'node.perf'

// Imprime 'node,v8'
console.log(trace_events.getEnabledCategories());
```
#### `tracing.enable()` {#tracingenable}

**Agregado en: v10.0.0**

Habilita este objeto `Tracing` para el conjunto de categorías cubiertas por el objeto `Tracing`.

#### `tracing.enabled` {#tracingenabled}

**Agregado en: v10.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` solo si el objeto `Tracing` ha sido habilitado.

### `trace_events.createTracing(options)` {#trace_eventscreatetracingoptions}

**Agregado en: v10.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `categories` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un array de nombres de categorías de rastreo. Los valores incluidos en el array se convierten en una cadena cuando es posible. Se lanzará un error si el valor no se puede convertir.


- Devuelve: [\<Tracing\>](/es/nodejs/api/tracing#tracing-object).

Crea y devuelve un objeto `Tracing` para el conjunto dado de `categories`.

```js [ESM]
const trace_events = require('node:trace_events');
const categories = ['node.perf', 'node.async_hooks'];
const tracing = trace_events.createTracing({ categories });
tracing.enable();
// do stuff
tracing.disable();
```

### `trace_events.getEnabledCategories()` {#trace_eventsgetenabledcategories}

**Agregado en: v10.0.0**

- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve una lista separada por comas de todas las categorías de eventos de rastreo actualmente habilitadas. El conjunto actual de categorías de eventos de rastreo habilitadas está determinado por la *unión* de todos los objetos `Tracing` actualmente habilitados y cualquier categoría habilitada utilizando el indicador `--trace-event-categories`.

Dado el archivo `test.js` a continuación, el comando `node --trace-event-categories node.perf test.js` imprimirá `'node.async_hooks,node.perf'` en la consola.

```js [ESM]
const trace_events = require('node:trace_events');
const t1 = trace_events.createTracing({ categories: ['node.async_hooks'] });
const t2 = trace_events.createTracing({ categories: ['node.perf'] });
const t3 = trace_events.createTracing({ categories: ['v8'] });

t1.enable();
t2.enable();

console.log(trace_events.getEnabledCategories());
```
## Ejemplos {#examples}

### Recopilar datos de eventos de rastreo por inspector {#collect-trace-events-data-by-inspector}

```js [ESM]
'use strict';

const { Session } = require('node:inspector');
const session = new Session();
session.connect();

function post(message, data) {
  return new Promise((resolve, reject) => {
    session.post(message, data, (err, result) => {
      if (err)
        reject(new Error(JSON.stringify(err)));
      else
        resolve(result);
    });
  });
}

async function collect() {
  const data = [];
  session.on('NodeTracing.dataCollected', (chunk) => data.push(chunk));
  session.on('NodeTracing.tracingComplete', () => {
    // hecho
  });
  const traceConfig = { includedCategories: ['v8'] };
  await post('NodeTracing.start', { traceConfig });
  // hacer algo
  setTimeout(() => {
    post('NodeTracing.stop').then(() => {
      session.disconnect();
      console.log(data);
    });
  }, 1000);
}

collect();
```

