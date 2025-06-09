---
title: Documentación de Node.js - Gancho de Rendimiento
description: Explora la API de ganchos de rendimiento en Node.js, que proporciona acceso a métricas de rendimiento y herramientas para medir el rendimiento de las aplicaciones Node.js.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - Gancho de Rendimiento | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Explora la API de ganchos de rendimiento en Node.js, que proporciona acceso a métricas de rendimiento y herramientas para medir el rendimiento de las aplicaciones Node.js.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - Gancho de Rendimiento | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Explora la API de ganchos de rendimiento en Node.js, que proporciona acceso a métricas de rendimiento y herramientas para medir el rendimiento de las aplicaciones Node.js.
---


# APIs de medición del rendimiento {#performance-measurement-apis}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código fuente:** [lib/perf_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/perf_hooks.js)

Este módulo proporciona una implementación de un subconjunto de las [APIs de rendimiento web](https://w3c.github.io/perf-timing-primer/) del W3C, así como APIs adicionales para mediciones de rendimiento específicas de Node.js.

Node.js admite las siguientes [APIs de rendimiento web](https://w3c.github.io/perf-timing-primer/):

- [Tiempo de alta resolución](https://www.w3.org/TR/hr-time-2)
- [Línea de tiempo de rendimiento](https://w3c.github.io/performance-timeline/)
- [Tiempo de usuario](https://www.w3.org/TR/user-timing/)
- [Tiempo de recursos](https://www.w3.org/TR/resource-timing-2/)



::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration);
  performance.clearMarks();
});
obs.observe({ type: 'measure' });
performance.measure('Start to Now');

performance.mark('A');
doSomeLongRunningProcess(() => {
  performance.measure('A to Now', 'A');

  performance.mark('B');
  performance.measure('A to B', 'A', 'B');
});
```

```js [CJS]
const { PerformanceObserver, performance } = require('node:perf_hooks');

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration);
});
obs.observe({ type: 'measure' });
performance.measure('Start to Now');

performance.mark('A');
(async function doSomeLongRunningProcess() {
  await new Promise((r) => setTimeout(r, 5000));
  performance.measure('A to Now', 'A');

  performance.mark('B');
  performance.measure('A to B', 'A', 'B');
})();
```
:::

## `perf_hooks.performance` {#perf_hooksperformance}

**Agregado en: v8.5.0**

Un objeto que se puede utilizar para recopilar métricas de rendimiento de la instancia actual de Node.js. Es similar a [`window.performance`](https://developer.mozilla.org/en-US/docs/Web/API/Window/performance) en los navegadores.


### `performance.clearMarks([name])` {#performanceclearmarksname}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este método debe llamarse con el objeto `performance` como receptor. |
| v8.5.0 | Añadido en: v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Si no se proporciona `name`, elimina todos los objetos `PerformanceMark` de la línea de tiempo de rendimiento. Si se proporciona `name`, elimina solo la marca nombrada.

### `performance.clearMeasures([name])` {#performanceclearmeasuresname}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este método debe llamarse con el objeto `performance` como receptor. |
| v16.7.0 | Añadido en: v16.7.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Si no se proporciona `name`, elimina todos los objetos `PerformanceMeasure` de la línea de tiempo de rendimiento. Si se proporciona `name`, elimina solo la medida nombrada.

### `performance.clearResourceTimings([name])` {#performanceclearresourcetimingsname}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este método debe llamarse con el objeto `performance` como receptor. |
| v18.2.0, v16.17.0 | Añadido en: v18.2.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Si no se proporciona `name`, elimina todos los objetos `PerformanceResourceTiming` de la línea de tiempo de recursos. Si se proporciona `name`, elimina solo el recurso nombrado.

### `performance.eventLoopUtilization([utilization1[, utilization2]])` {#performanceeventlooputilizationutilization1-utilization2}

**Añadido en: v14.10.0, v12.19.0**

- `utilization1` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El resultado de una llamada anterior a `eventLoopUtilization()`.
- `utilization2` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El resultado de una llamada anterior a `eventLoopUtilization()` anterior a `utilization1`.
- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `active` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El método `eventLoopUtilization()` devuelve un objeto que contiene la duración acumulativa del tiempo que el bucle de eventos ha estado tanto inactivo como activo como un temporizador de milisegundos de alta resolución. El valor de `utilization` es la utilización calculada del bucle de eventos (ELU).

Si el bootstrapping aún no ha terminado en el hilo principal, las propiedades tienen el valor de `0`. La ELU está disponible inmediatamente en los [hilos de Worker](/es/nodejs/api/worker_threads#worker-threads) ya que el bootstrap ocurre dentro del bucle de eventos.

Tanto `utilization1` como `utilization2` son parámetros opcionales.

Si se pasa `utilization1`, entonces se calcula y devuelve el delta entre los tiempos `active` e `idle` de la llamada actual, así como el valor de `utilization` correspondiente (similar a [`process.hrtime()`](/es/nodejs/api/process#processhrtimetime)).

Si se pasan tanto `utilization1` como `utilization2`, entonces el delta se calcula entre los dos argumentos. Esta es una opción de conveniencia porque, a diferencia de [`process.hrtime()`](/es/nodejs/api/process#processhrtimetime), calcular la ELU es más complejo que una sola resta.

La ELU es similar a la utilización de la CPU, excepto que solo mide las estadísticas del bucle de eventos y no el uso de la CPU. Representa el porcentaje de tiempo que el bucle de eventos ha pasado fuera del proveedor de eventos del bucle de eventos (por ejemplo, `epoll_wait`). No se tiene en cuenta ningún otro tiempo de inactividad de la CPU. El siguiente es un ejemplo de cómo un proceso mayormente inactivo tendrá una ELU alta.

::: code-group
```js [ESM]
import { eventLoopUtilization } from 'node:perf_hooks';
import { spawnSync } from 'node:child_process';

setImmediate(() => {
  const elu = eventLoopUtilization();
  spawnSync('sleep', ['5']);
  console.log(eventLoopUtilization(elu).utilization);
});
```

```js [CJS]
'use strict';
const { eventLoopUtilization } = require('node:perf_hooks').performance;
const { spawnSync } = require('node:child_process');

setImmediate(() => {
  const elu = eventLoopUtilization();
  spawnSync('sleep', ['5']);
  console.log(eventLoopUtilization(elu).utilization);
});
```
:::

Aunque la CPU está mayormente inactiva mientras se ejecuta este script, el valor de `utilization` es `1`. Esto se debe a que la llamada a [`child_process.spawnSync()`](/es/nodejs/api/child_process#child_processspawnsynccommand-args-options) bloquea el bucle de eventos para que no continúe.

Pasar un objeto definido por el usuario en lugar del resultado de una llamada anterior a `eventLoopUtilization()` conducirá a un comportamiento indefinido. No se garantiza que los valores de retorno reflejen ningún estado correcto del bucle de eventos.


### `performance.getEntries()` {#performancegetentries}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este método debe llamarse con el objeto `performance` como receptor. |
| v16.7.0 | Añadido en: v16.7.0 |
:::

- Regresa: [\<PerformanceEntry[]\>](/es/nodejs/api/perf_hooks#class-performanceentry)

Regresa una lista de objetos `PerformanceEntry` en orden cronológico con respecto a `performanceEntry.startTime`. Si solo está interesado en entradas de rendimiento de ciertos tipos o que tienen ciertos nombres, consulte `performance.getEntriesByType()` y `performance.getEntriesByName()`.

### `performance.getEntriesByName(name[, type])` {#performancegetentriesbynamename-type}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este método debe llamarse con el objeto `performance` como receptor. |
| v16.7.0 | Añadido en: v16.7.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Regresa: [\<PerformanceEntry[]\>](/es/nodejs/api/perf_hooks#class-performanceentry)

Regresa una lista de objetos `PerformanceEntry` en orden cronológico con respecto a `performanceEntry.startTime` cuyo `performanceEntry.name` es igual a `name`, y opcionalmente, cuyo `performanceEntry.entryType` es igual a `type`.

### `performance.getEntriesByType(type)` {#performancegetentriesbytypetype}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este método debe llamarse con el objeto `performance` como receptor. |
| v16.7.0 | Añadido en: v16.7.0 |
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Regresa: [\<PerformanceEntry[]\>](/es/nodejs/api/perf_hooks#class-performanceentry)

Regresa una lista de objetos `PerformanceEntry` en orden cronológico con respecto a `performanceEntry.startTime` cuyo `performanceEntry.entryType` es igual a `type`.

### `performance.mark(name[, options])` {#performancemarkname-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este método debe llamarse con el objeto `performance` como receptor. El argumento name ya no es opcional. |
| v16.0.0 | Actualizado para cumplir con la especificación User Timing Level 3. |
| v8.5.0 | Añadido en: v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `detail` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Detalle opcional adicional para incluir con la marca.
    - `startTime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Una marca de tiempo opcional que se utilizará como tiempo de marca. **Predeterminado**: `performance.now()`.

Crea una nueva entrada `PerformanceMark` en la línea de tiempo de rendimiento. Una `PerformanceMark` es una subclase de `PerformanceEntry` cuyo `performanceEntry.entryType` siempre es `'mark'` y cuya `performanceEntry.duration` siempre es `0`. Las marcas de rendimiento se utilizan para marcar momentos significativos específicos en la línea de tiempo de rendimiento.

La entrada `PerformanceMark` creada se coloca en la línea de tiempo de rendimiento global y se puede consultar con `performance.getEntries`, `performance.getEntriesByName` y `performance.getEntriesByType`. Cuando se realiza la observación, las entradas deben borrarse manualmente de la línea de tiempo de rendimiento global con `performance.clearMarks`.


### `performance.markResourceTiming(timingInfo, requestedUrl, initiatorType, global, cacheMode, bodyInfo, responseStatus[, deliveryType])` {#performancemarkresourcetimingtiminginfo-requestedurl-initiatortype-global-cachemode-bodyinfo-responsestatus-deliverytype}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.2.0 | Se agregaron los argumentos bodyInfo, responseStatus y deliveryType. |
| v18.2.0, v16.17.0 | Agregado en: v18.2.0, v16.17.0 |
:::

- `timingInfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [Información de tiempo de Fetch](https://fetch.spec.whatwg.org/#fetch-timing-info)
- `requestedUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La URL del recurso
- `initiatorType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre del iniciador, por ejemplo: 'fetch'
- `global` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `cacheMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El modo de caché debe ser una cadena vacía ('') o 'local'
- `bodyInfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [Información del cuerpo de la respuesta de Fetch](https://fetch.spec.whatwg.org/#response-body-info)
- `responseStatus` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El código de estado de la respuesta
- `deliveryType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El tipo de entrega. **Predeterminado:** `''`.

*Esta propiedad es una extensión de Node.js. No está disponible en los navegadores web.*

Crea una nueva entrada `PerformanceResourceTiming` en la línea de tiempo de recursos. Un `PerformanceResourceTiming` es una subclase de `PerformanceEntry` cuyo `performanceEntry.entryType` siempre es `'resource'`. Los recursos de rendimiento se utilizan para marcar momentos en la línea de tiempo de recursos.

La entrada `PerformanceMark` creada se coloca en la línea de tiempo de recursos global y se puede consultar con `performance.getEntries`, `performance.getEntriesByName` y `performance.getEntriesByType`. Cuando se realiza la observación, las entradas deben borrarse manualmente de la línea de tiempo de rendimiento global con `performance.clearResourceTimings`.


### `performance.measure(name[, startMarkOrOptions[, endMark]])` {#performancemeasurename-startmarkoroptions-endmark}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este método debe ser llamado con el objeto `performance` como receptor. |
| v16.0.0 | Actualizado para cumplir con la especificación User Timing Level 3. |
| v13.13.0, v12.16.3 | Hace que los parámetros `startMark` y `endMark` sean opcionales. |
| v8.5.0 | Añadido en: v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `startMarkOrOptions` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opcional.
    - `detail` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Detalle opcional adicional para incluir con la medida.
    - `duration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Duración entre los tiempos de inicio y fin.
    - `end` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Marca de tiempo que se utilizará como hora de finalización, o una cadena que identifique una marca registrada previamente.
    - `start` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Marca de tiempo que se utilizará como hora de inicio, o una cadena que identifique una marca registrada previamente.

- `endMark` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Opcional. Debe omitirse si `startMarkOrOptions` es un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).

Crea una nueva entrada `PerformanceMeasure` en la Línea de tiempo de rendimiento. Un `PerformanceMeasure` es una subclase de `PerformanceEntry` cuyo `performanceEntry.entryType` siempre es `'measure'`, y cuya `performanceEntry.duration` mide el número de milisegundos transcurridos desde `startMark` y `endMark`.

El argumento `startMark` puede identificar cualquier `PerformanceMark` *existente* en la Línea de tiempo de rendimiento, o *puede* identificar cualquiera de las propiedades de marca de tiempo proporcionadas por la clase `PerformanceNodeTiming`. Si el `startMark` nombrado no existe, se produce un error.

El argumento opcional `endMark` debe identificar cualquier `PerformanceMark` *existente* en la Línea de tiempo de rendimiento o cualquiera de las propiedades de marca de tiempo proporcionadas por la clase `PerformanceNodeTiming`. `endMark` será `performance.now()` si no se pasa ningún parámetro, de lo contrario, si el `endMark` nombrado no existe, se producirá un error.

La entrada `PerformanceMeasure` creada se coloca en la Línea de tiempo de rendimiento global y se puede consultar con `performance.getEntries`, `performance.getEntriesByName` y `performance.getEntriesByType`. Cuando se realiza la observación, las entradas deben borrarse manualmente de la Línea de tiempo de rendimiento global con `performance.clearMeasures`.


### `performance.nodeTiming` {#performancenodetiming}

**Agregado en: v8.5.0**

- [\<PerformanceNodeTiming\>](/es/nodejs/api/perf_hooks#class-performancenodetiming)

*Esta propiedad es una extensión de Node.js. No está disponible en los navegadores web.*

Una instancia de la clase `PerformanceNodeTiming` que proporciona métricas de rendimiento para hitos operativos específicos de Node.js.

### `performance.now()` {#performancenow}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este método debe llamarse con el objeto `performance` como receptor. |
| v8.5.0 | Agregado en: v8.5.0 |
:::

- Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Devuelve la marca de tiempo actual de milisegundos de alta resolución, donde 0 representa el inicio del proceso `node` actual.

### `performance.setResourceTimingBufferSize(maxSize)` {#performancesetresourcetimingbuffersizemaxsize}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este método debe llamarse con el objeto `performance` como receptor. |
| v18.8.0 | Agregado en: v18.8.0 |
:::

Establece el tamaño del búfer de tiempo de recursos de rendimiento global al número especificado de objetos de entrada de rendimiento de tipo "recurso".

Por defecto, el tamaño máximo del búfer se establece en 250.

### `performance.timeOrigin` {#performancetimeorigin}

**Agregado en: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El [`timeOrigin`](https://w3c.github.io/hr-time/#dom-performance-timeorigin) especifica la marca de tiempo de milisegundos de alta resolución en la que comenzó el proceso `node` actual, medido en tiempo Unix.

### `performance.timerify(fn[, options])` {#performancetimerifyfn-options}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.0.0 | Se agregó la opción del histograma. |
| v16.0.0 | Se volvió a implementar para usar JavaScript puro y la capacidad de cronometrar funciones asíncronas. |
| v8.5.0 | Agregado en: v8.5.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `histogram` [\<RecordableHistogram\>](/es/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram) Un objeto de histograma creado utilizando `perf_hooks.createHistogram()` que registrará las duraciones de tiempo de ejecución en nanosegundos.
  
 

*Esta propiedad es una extensión de Node.js. No está disponible en los navegadores web.*

Envuelve una función dentro de una nueva función que mide el tiempo de ejecución de la función envuelta. Un `PerformanceObserver` debe estar suscrito al tipo de evento `'function'` para poder acceder a los detalles de temporización.



::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

function someFunction() {
  console.log('hello world');
}

const wrapped = performance.timerify(someFunction);

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration);

  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

// A performance timeline entry will be created
wrapped();
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

function someFunction() {
  console.log('hello world');
}

const wrapped = performance.timerify(someFunction);

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration);

  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

// A performance timeline entry will be created
wrapped();
```
:::

Si la función envuelta devuelve una promesa, se adjuntará un controlador finally a la promesa y la duración se informará una vez que se invoque el controlador finally.


### `performance.toJSON()` {#performancetojson}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este método se debe llamar con el objeto `performance` como receptor. |
| v16.1.0 | Añadido en: v16.1.0 |
:::

Un objeto que es la representación JSON del objeto `performance`. Es similar a [`window.performance.toJSON`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/toJSON) en los navegadores.

#### Evento: `'resourcetimingbufferfull'` {#event-resourcetimingbufferfull}

**Añadido en: v18.8.0**

El evento `'resourcetimingbufferfull'` se dispara cuando el búfer global de tiempo de recursos de rendimiento está lleno. Ajusta el tamaño del búfer de tiempo de recursos con `performance.setResourceTimingBufferSize()` o limpia el búfer con `performance.clearResourceTimings()` en el listener del evento para permitir que se agreguen más entradas al búfer de la línea de tiempo de rendimiento.

## Clase: `PerformanceEntry` {#class-performanceentry}

**Añadido en: v8.5.0**

El constructor de esta clase no está expuesto a los usuarios directamente.

### `performanceEntry.duration` {#performanceentryduration}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este getter de propiedad se debe llamar con el objeto `PerformanceEntry` como receptor. |
| v8.5.0 | Añadido en: v8.5.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El número total de milisegundos transcurridos para esta entrada. Este valor no será significativo para todos los tipos de entrada de rendimiento.

### `performanceEntry.entryType` {#performanceentryentrytype}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este getter de propiedad se debe llamar con el objeto `PerformanceEntry` como receptor. |
| v8.5.0 | Añadido en: v8.5.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El tipo de la entrada de rendimiento. Puede ser uno de los siguientes:

- `'dns'` (solo Node.js)
- `'function'` (solo Node.js)
- `'gc'` (solo Node.js)
- `'http2'` (solo Node.js)
- `'http'` (solo Node.js)
- `'mark'` (disponible en la Web)
- `'measure'` (disponible en la Web)
- `'net'` (solo Node.js)
- `'node'` (solo Node.js)
- `'resource'` (disponible en la Web)


### `performanceEntry.name` {#performanceentryname}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este getter de propiedad debe ser llamado con el objeto `PerformanceEntry` como receptor. |
| v8.5.0 | Añadido en: v8.5.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El nombre de la entrada de rendimiento.

### `performanceEntry.startTime` {#performanceentrystarttime}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este getter de propiedad debe ser llamado con el objeto `PerformanceEntry` como receptor. |
| v8.5.0 | Añadido en: v8.5.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La marca de tiempo en milisegundos de alta resolución que marca el tiempo de inicio de la Entrada de Rendimiento.

## Clase: `PerformanceMark` {#class-performancemark}

**Añadido en: v18.2.0, v16.17.0**

- Extiende: [\<PerformanceEntry\>](/es/nodejs/api/perf_hooks#class-performanceentry)

Expone las marcas creadas a través del método `Performance.mark()`.

### `performanceMark.detail` {#performancemarkdetail}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este getter de propiedad debe ser llamado con el objeto `PerformanceMark` como receptor. |
| v16.0.0 | Añadido en: v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Detalle adicional especificado al crear con el método `Performance.mark()`.

## Clase: `PerformanceMeasure` {#class-performancemeasure}

**Añadido en: v18.2.0, v16.17.0**

- Extiende: [\<PerformanceEntry\>](/es/nodejs/api/perf_hooks#class-performanceentry)

Expone las medidas creadas a través del método `Performance.measure()`.

El constructor de esta clase no está expuesto directamente a los usuarios.

### `performanceMeasure.detail` {#performancemeasuredetail}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este getter de propiedad debe ser llamado con el objeto `PerformanceMeasure` como receptor. |
| v16.0.0 | Añadido en: v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Detalle adicional especificado al crear con el método `Performance.measure()`.


## Clase: `PerformanceNodeEntry` {#class-performancenodeentry}

**Agregado en: v19.0.0**

- Extiende: [\<PerformanceEntry\>](/es/nodejs/api/perf_hooks#class-performanceentry)

*Esta clase es una extensión de Node.js. No está disponible en los navegadores web.*

Proporciona datos de temporización detallados de Node.js.

El constructor de esta clase no se expone directamente a los usuarios.

### `performanceNodeEntry.detail` {#performancenodeentrydetail}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Se debe llamar a este getter de propiedad con el objeto `PerformanceNodeEntry` como receptor. |
| v16.0.0 | Agregado en: v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Detalle adicional específico del `entryType`.

### `performanceNodeEntry.flags` {#performancenodeentryflags}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.0.0 | Obsoleto en tiempo de ejecución. Ahora se movió a la propiedad detail cuando entryType es 'gc'. |
| v13.9.0, v12.17.0 | Agregado en: v13.9.0, v12.17.0 |
:::

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Use `performanceNodeEntry.detail` en su lugar.
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Cuando `performanceEntry.entryType` es igual a `'gc'`, la propiedad `performance.flags` contiene información adicional sobre la operación de recolección de basura. El valor puede ser uno de los siguientes:

- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE`

### `performanceNodeEntry.kind` {#performancenodeentrykind}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.0.0 | Obsoleto en tiempo de ejecución. Ahora se movió a la propiedad detail cuando entryType es 'gc'. |
| v8.5.0 | Agregado en: v8.5.0 |
:::

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Use `performanceNodeEntry.detail` en su lugar.
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Cuando `performanceEntry.entryType` es igual a `'gc'`, la propiedad `performance.kind` identifica el tipo de operación de recolección de basura que se produjo. El valor puede ser uno de los siguientes:

- `perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB`


### Detalles de Recolección de Basura ('gc') {#garbage-collection-gc-details}

Cuando `performanceEntry.type` es igual a `'gc'`, la propiedad `performanceNodeEntry.detail` será un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) con dos propiedades:

- `kind` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Uno de:
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB`
  
 
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Uno de:
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE`
  
 

### Detalles de HTTP ('http') {#http-http-details}

Cuando `performanceEntry.type` es igual a `'http'`, la propiedad `performanceNodeEntry.detail` será un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) que contiene información adicional.

Si `performanceEntry.name` es igual a `HttpClient`, el `detail` contendrá las siguientes propiedades: `req`, `res`. Y la propiedad `req` será un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) que contiene `method`, `url`, `headers`, la propiedad `res` será un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) que contiene `statusCode`, `statusMessage`, `headers`.

Si `performanceEntry.name` es igual a `HttpRequest`, el `detail` contendrá las siguientes propiedades: `req`, `res`. Y la propiedad `req` será un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) que contiene `method`, `url`, `headers`, la propiedad `res` será un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) que contiene `statusCode`, `statusMessage`, `headers`.

Esto podría agregar una sobrecarga de memoria adicional y solo debe usarse con fines de diagnóstico, no debe dejarse activado en producción de forma predeterminada.


### Detalles de HTTP/2 ('http2') {#http/2-http2-details}

Cuando `performanceEntry.type` es igual a `'http2'`, la propiedad `performanceNodeEntry.detail` será un [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) que contiene información de rendimiento adicional.

Si `performanceEntry.name` es igual a `Http2Stream`, el `detail` contendrá las siguientes propiedades:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes de marco `DATA` recibidos para este `Http2Stream`.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes de marco `DATA` enviados para este `Http2Stream`.
- `id` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El identificador del `Http2Stream` asociado.
- `timeToFirstByte` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de milisegundos transcurridos entre el `startTime` de `PerformanceEntry` y la recepción del primer marco `DATA`.
- `timeToFirstByteSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de milisegundos transcurridos entre el `startTime` de `PerformanceEntry` y el envío del primer marco `DATA`.
- `timeToFirstHeader` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de milisegundos transcurridos entre el `startTime` de `PerformanceEntry` y la recepción del primer encabezado.

Si `performanceEntry.name` es igual a `Http2Session`, el `detail` contendrá las siguientes propiedades:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes recibidos para esta `Http2Session`.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes enviados para esta `Http2Session`.
- `framesReceived` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de tramas HTTP/2 recibidas por la `Http2Session`.
- `framesSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de tramas HTTP/2 enviadas por la `Http2Session`.
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número máximo de flujos abiertos concurrentemente durante la vida útil de la `Http2Session`.
- `pingRTT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de milisegundos transcurridos desde la transmisión de una trama `PING` y la recepción de su acuse de recibo. Solo presente si se ha enviado una trama `PING` en la `Http2Session`.
- `streamAverageDuration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La duración promedio (en milisegundos) para todas las instancias de `Http2Stream`.
- `streamCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de instancias de `Http2Stream` procesadas por la `Http2Session`.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ya sea `'server'` o `'client'` para identificar el tipo de `Http2Session`.


### Detalles de Timerify ('function') {#timerify-function-details}

Cuando `performanceEntry.type` es igual a `'function'`, la propiedad `performanceNodeEntry.detail` será un [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) que lista los argumentos de entrada para la función cronometrada.

### Detalles de Net ('net') {#net-net-details}

Cuando `performanceEntry.type` es igual a `'net'`, la propiedad `performanceNodeEntry.detail` será un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) que contiene información adicional.

Si `performanceEntry.name` es igual a `connect`, el `detail` contendrá las siguientes propiedades: `host`, `port`.

### Detalles de DNS ('dns') {#dns-dns-details}

Cuando `performanceEntry.type` es igual a `'dns'`, la propiedad `performanceNodeEntry.detail` será un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) que contiene información adicional.

Si `performanceEntry.name` es igual a `lookup`, el `detail` contendrá las siguientes propiedades: `hostname`, `family`, `hints`, `verbatim`, `addresses`.

Si `performanceEntry.name` es igual a `lookupService`, el `detail` contendrá las siguientes propiedades: `host`, `port`, `hostname`, `service`.

Si `performanceEntry.name` es igual a `queryxxx` o `getHostByAddr`, el `detail` contendrá las siguientes propiedades: `host`, `ttl`, `result`. El valor de `result` es el mismo que el resultado de `queryxxx` o `getHostByAddr`.

## Clase: `PerformanceNodeTiming` {#class-performancenodetiming}

**Añadido en: v8.5.0**

- Extiende: [\<PerformanceEntry\>](/es/nodejs/api/perf_hooks#class-performanceentry)

*Esta propiedad es una extensión de Node.js. No está disponible en los navegadores web.*

Proporciona detalles de tiempo para el propio Node.js. El constructor de esta clase no está expuesto a los usuarios.

### `performanceNodeTiming.bootstrapComplete` {#performancenodetimingbootstrapcomplete}

**Añadido en: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La marca de tiempo de alta resolución en milisegundos en la que el proceso de Node.js completó el bootstrapping. Si el bootstrapping aún no ha terminado, la propiedad tiene el valor de -1.


### `performanceNodeTiming.environment` {#performancenodetimingenvironment}

**Agregado en: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La marca de tiempo de milisegundos de alta resolución en la que se inicializó el entorno de Node.js.

### `performanceNodeTiming.idleTime` {#performancenodetimingidletime}

**Agregado en: v14.10.0, v12.19.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La marca de tiempo de milisegundos de alta resolución de la cantidad de tiempo que el bucle de eventos ha estado inactivo dentro del proveedor de eventos del bucle de eventos (por ejemplo, `epoll_wait`). Esto no tiene en cuenta el uso de la CPU. Si el bucle de eventos aún no ha comenzado (por ejemplo, en el primer ciclo del script principal), la propiedad tiene el valor de 0.

### `performanceNodeTiming.loopExit` {#performancenodetimingloopexit}

**Agregado en: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La marca de tiempo de milisegundos de alta resolución en la que salió el bucle de eventos de Node.js. Si el bucle de eventos aún no ha salido, la propiedad tiene el valor de -1. Solo puede tener un valor distinto de -1 en un controlador del evento [`'exit'`](/es/nodejs/api/process#event-exit).

### `performanceNodeTiming.loopStart` {#performancenodetimingloopstart}

**Agregado en: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La marca de tiempo de milisegundos de alta resolución en la que comenzó el bucle de eventos de Node.js. Si el bucle de eventos aún no ha comenzado (por ejemplo, en el primer ciclo del script principal), la propiedad tiene el valor de -1.

### `performanceNodeTiming.nodeStart` {#performancenodetimingnodestart}

**Agregado en: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La marca de tiempo de milisegundos de alta resolución en la que se inicializó el proceso de Node.js.

### `performanceNodeTiming.uvMetricsInfo` {#performancenodetiminguvmetricsinfo}

**Agregado en: v22.8.0, v20.18.0**

- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `loopCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de iteraciones del bucle de eventos.
    - `events` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de eventos que han sido procesados por el controlador de eventos.
    - `eventsWaiting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de eventos que estaban esperando ser procesados cuando se llamó al proveedor de eventos.

Esto es un envoltorio para la función `uv_metrics_info`. Devuelve el conjunto actual de métricas del bucle de eventos.

Se recomienda utilizar esta propiedad dentro de una función cuya ejecución se programó utilizando `setImmediate` para evitar recopilar métricas antes de finalizar todas las operaciones programadas durante la iteración del bucle actual.

::: code-group
```js [CJS]
const { performance } = require('node:perf_hooks');

setImmediate(() => {
  console.log(performance.nodeTiming.uvMetricsInfo);
});
```

```js [ESM]
import { performance } from 'node:perf_hooks';

setImmediate(() => {
  console.log(performance.nodeTiming.uvMetricsInfo);
});
```
:::


### `performanceNodeTiming.v8Start` {#performancenodetimingv8start}

**Agregado en: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La marca de tiempo de milisegundos de alta resolución en la que se inicializó la plataforma V8.

## Clase: `PerformanceResourceTiming` {#class-performanceresourcetiming}

**Agregado en: v18.2.0, v16.17.0**

- Extiende: [\<PerformanceEntry\>](/es/nodejs/api/perf_hooks#class-performanceentry)

Proporciona datos de tiempo de red detallados sobre la carga de los recursos de una aplicación.

El constructor de esta clase no está expuesto a los usuarios directamente.

### `performanceResourceTiming.workerStart` {#performanceresourcetimingworkerstart}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este getter de propiedad debe ser llamado con el objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Agregado en: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La marca de tiempo de milisegundos de alta resolución inmediatamente antes de enviar la solicitud `fetch`. Si el recurso no es interceptado por un worker, la propiedad siempre devolverá 0.

### `performanceResourceTiming.redirectStart` {#performanceresourcetimingredirectstart}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este getter de propiedad debe ser llamado con el objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Agregado en: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La marca de tiempo de milisegundos de alta resolución que representa la hora de inicio de la búsqueda que inicia la redirección.

### `performanceResourceTiming.redirectEnd` {#performanceresourcetimingredirectend}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este getter de propiedad debe ser llamado con el objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Agregado en: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La marca de tiempo de milisegundos de alta resolución que se creará inmediatamente después de recibir el último byte de la respuesta de la última redirección.


### `performanceResourceTiming.fetchStart` {#performanceresourcetimingfetchstart}

::: info [Historial]
| Versión | Cambios |
|---|---|
| v19.0.0 | Este getter de propiedad debe ser llamado con el objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Añadido en: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La marca de tiempo de milisegundos de alta resolución inmediatamente anterior a que Node.js comience a obtener el recurso.

### `performanceResourceTiming.domainLookupStart` {#performanceresourcetimingdomainlookupstart}

::: info [Historial]
| Versión | Cambios |
|---|---|
| v19.0.0 | Este getter de propiedad debe ser llamado con el objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Añadido en: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La marca de tiempo de milisegundos de alta resolución inmediatamente anterior a que Node.js comience la búsqueda de nombres de dominio para el recurso.

### `performanceResourceTiming.domainLookupEnd` {#performanceresourcetimingdomainlookupend}

::: info [Historial]
| Versión | Cambios |
|---|---|
| v19.0.0 | Este getter de propiedad debe ser llamado con el objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Añadido en: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La marca de tiempo de milisegundos de alta resolución que representa el momento inmediatamente posterior a que Node.js finalizara la búsqueda de nombres de dominio para el recurso.

### `performanceResourceTiming.connectStart` {#performanceresourcetimingconnectstart}

::: info [Historial]
| Versión | Cambios |
|---|---|
| v19.0.0 | Este getter de propiedad debe ser llamado con el objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Añadido en: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La marca de tiempo de milisegundos de alta resolución que representa el momento inmediatamente anterior a que Node.js comience a establecer la conexión con el servidor para recuperar el recurso.


### `performanceResourceTiming.connectEnd` {#performanceresourcetimingconnectend}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este getter de propiedad debe ser llamado con el objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Añadido en: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La marca de tiempo de milisegundos de alta resolución que representa el tiempo inmediatamente después de que Node.js termina de establecer la conexión con el servidor para recuperar el recurso.

### `performanceResourceTiming.secureConnectionStart` {#performanceresourcetimingsecureconnectionstart}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este getter de propiedad debe ser llamado con el objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Añadido en: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La marca de tiempo de milisegundos de alta resolución que representa el tiempo inmediatamente antes de que Node.js comience el proceso de handshake para asegurar la conexión actual.

### `performanceResourceTiming.requestStart` {#performanceresourcetimingrequeststart}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este getter de propiedad debe ser llamado con el objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Añadido en: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La marca de tiempo de milisegundos de alta resolución que representa el tiempo inmediatamente antes de que Node.js reciba el primer byte de la respuesta del servidor.

### `performanceResourceTiming.responseEnd` {#performanceresourcetimingresponseend}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este getter de propiedad debe ser llamado con el objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Añadido en: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La marca de tiempo de milisegundos de alta resolución que representa el tiempo inmediatamente después de que Node.js recibe el último byte del recurso o inmediatamente antes de que se cierre la conexión de transporte, lo que ocurra primero.


### `performanceResourceTiming.transferSize` {#performanceresourcetimingtransfersize}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este getter de propiedad debe llamarse con el objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Agregado en: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Un número que representa el tamaño (en octetos) del recurso obtenido. El tamaño incluye los campos del encabezado de respuesta más el cuerpo de la carga útil de respuesta.

### `performanceResourceTiming.encodedBodySize` {#performanceresourcetimingencodedbodysize}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este getter de propiedad debe llamarse con el objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Agregado en: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Un número que representa el tamaño (en octetos) recibido de la búsqueda (HTTP o caché), del cuerpo de la carga útil, antes de eliminar cualquier codificación de contenido aplicada.

### `performanceResourceTiming.decodedBodySize` {#performanceresourcetimingdecodedbodysize}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este getter de propiedad debe llamarse con el objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Agregado en: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Un número que representa el tamaño (en octetos) recibido de la búsqueda (HTTP o caché), del cuerpo del mensaje, después de eliminar cualquier codificación de contenido aplicada.

### `performanceResourceTiming.toJSON()` {#performanceresourcetimingtojson}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | Este método debe llamarse con el objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Agregado en: v18.2.0, v16.17.0 |
:::

Devuelve un `objeto` que es la representación JSON del objeto `PerformanceResourceTiming`.

## Clase: `PerformanceObserver` {#class-performanceobserver}

**Agregado en: v8.5.0**

### `PerformanceObserver.supportedEntryTypes` {#performanceobserversupportedentrytypes}

**Agregado en: v16.0.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtener tipos admitidos.


### `new PerformanceObserver(callback)` {#new-performanceobservercallback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada inválida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v8.5.0 | Añadido en: v8.5.0 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `list` [\<PerformanceObserverEntryList\>](/es/nodejs/api/perf_hooks#class-performanceobserverentrylist)
    - `observer` [\<PerformanceObserver\>](/es/nodejs/api/perf_hooks#class-performanceobserver)

Los objetos `PerformanceObserver` proporcionan notificaciones cuando se han añadido nuevas instancias de `PerformanceEntry` a la Línea de Tiempo de Rendimiento.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries());

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark'], buffered: true });

performance.mark('test');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries());

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark'], buffered: true });

performance.mark('test');
```
:::

Debido a que las instancias de `PerformanceObserver` introducen su propia sobrecarga de rendimiento adicional, las instancias no deben dejarse suscritas a las notificaciones indefinidamente. Los usuarios deben desconectar los observadores tan pronto como ya no sean necesarios.

La `callback` se invoca cuando un `PerformanceObserver` es notificado acerca de nuevas instancias de `PerformanceEntry`. La devolución de llamada recibe una instancia de `PerformanceObserverEntryList` y una referencia al `PerformanceObserver`.

### `performanceObserver.disconnect()` {#performanceobserverdisconnect}

**Añadido en: v8.5.0**

Desconecta la instancia de `PerformanceObserver` de todas las notificaciones.


### `performanceObserver.observe(options)` {#performanceobserverobserveoptions}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v16.7.0 | Actualizado para cumplir con Performance Timeline Level 2. La opción buffered ha sido añadida de nuevo. |
| v16.0.0 | Actualizado para cumplir con User Timing Level 3. La opción buffered ha sido eliminada. |
| v8.5.0 | Añadido en: v8.5.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un único tipo [\<PerformanceEntry\>](/es/nodejs/api/perf_hooks#class-performanceentry). No debe ser dado si `entryTypes` ya está especificado.
    - `entryTypes` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un array de strings que identifican los tipos de instancias [\<PerformanceEntry\>](/es/nodejs/api/perf_hooks#class-performanceentry) en los que el observador está interesado. Si no se proporciona, se lanzará un error.
    - `buffered` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es true, la función callback del observador es llamada con una lista de entradas globales `PerformanceEntry` almacenadas en búfer. Si es false, sólo las `PerformanceEntry`s creadas después del punto de tiempo son enviadas a la función callback del observador. **Predeterminado:** `false`.

Suscribe la instancia [\<PerformanceObserver\>](/es/nodejs/api/perf_hooks#class-performanceobserver) a notificaciones de nuevas instancias [\<PerformanceEntry\>](/es/nodejs/api/perf_hooks#class-performanceentry) identificadas ya sea por `options.entryTypes` o `options.type`:

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((list, observer) => {
  // Llamado una vez asíncronamente. `list` contiene tres elementos.
});
obs.observe({ type: 'mark' });

for (let n = 0; n < 3; n++)
  performance.mark(`test${n}`);
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((list, observer) => {
  // Llamado una vez asíncronamente. `list` contiene tres elementos.
});
obs.observe({ type: 'mark' });

for (let n = 0; n < 3; n++)
  performance.mark(`test${n}`);
```
:::


### `performanceObserver.takeRecords()` {#performanceobservertakerecords}

**Añadido en: v16.0.0**

- Devuelve: [\<PerformanceEntry[]\>](/es/nodejs/api/perf_hooks#class-performanceentry) Lista actual de entradas almacenadas en el observador de rendimiento, vaciándola.

## Clase: `PerformanceObserverEntryList` {#class-performanceobserverentrylist}

**Añadido en: v8.5.0**

La clase `PerformanceObserverEntryList` se utiliza para proporcionar acceso a las instancias de `PerformanceEntry` pasadas a un `PerformanceObserver`. El constructor de esta clase no está expuesto a los usuarios.

### `performanceObserverEntryList.getEntries()` {#performanceobserverentrylistgetentries}

**Añadido en: v8.5.0**

- Devuelve: [\<PerformanceEntry[]\>](/es/nodejs/api/perf_hooks#class-performanceentry)

Devuelve una lista de objetos `PerformanceEntry` en orden cronológico con respecto a `performanceEntry.startTime`.



::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntries());
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 81.465639,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 81.860064,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntries());
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 81.465639,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 81.860064,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```
:::


### `performanceObserverEntryList.getEntriesByName(name[, type])` {#performanceobserverentrylistgetentriesbynamename-type}

**Agregado en: v8.5.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<PerformanceEntry[]\>](/es/nodejs/api/perf_hooks#class-performanceentry)

Devuelve una lista de objetos `PerformanceEntry` en orden cronológico con respecto a `performanceEntry.startTime` cuyo `performanceEntry.name` es igual a `name` y, opcionalmente, cuyo `performanceEntry.entryType` es igual a `type`.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByName('meow'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 98.545991,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('nope')); // []

  console.log(perfObserverList.getEntriesByName('test', 'mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 63.518931,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('test', 'measure')); // []

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark', 'measure'] });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByName('meow'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 98.545991,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('nope')); // []

  console.log(perfObserverList.getEntriesByName('test', 'mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 63.518931,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('test', 'measure')); // []

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark', 'measure'] });

performance.mark('test');
performance.mark('meow');
```
:::


### `performanceObserverEntryList.getEntriesByType(type)` {#performanceobserverentrylistgetentriesbytypetype}

**Agregado en: v8.5.0**

- `type` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<PerformanceEntry[]\>](/es/nodejs/api/perf_hooks#class-performanceentry)

Devuelve una lista de objetos `PerformanceEntry` en orden cronológico con respecto a `performanceEntry.startTime` cuyo `performanceEntry.entryType` es igual a `type`.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByType('mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 55.897834,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 56.350146,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByType('mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 55.897834,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 56.350146,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```
:::

## `perf_hooks.createHistogram([options])` {#perf_hookscreatehistogramoptions}

**Agregado en: v15.9.0, v14.18.0**

- `options` [\<Object\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `lowest` [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/BigInt) El valor discernible más bajo. Debe ser un valor entero mayor que 0. **Predeterminado:** `1`.
    - `highest` [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/BigInt) El valor registrable más alto. Debe ser un valor entero que sea igual o mayor que dos veces `lowest`. **Predeterminado:** `Number.MAX_SAFE_INTEGER`.
    - `figures` [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type) El número de dígitos de precisión. Debe ser un número entre `1` y `5`. **Predeterminado:** `3`.


- Devuelve: [\<RecordableHistogram\>](/es/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram)

Devuelve un [\<RecordableHistogram\>](/es/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram).


## `perf_hooks.monitorEventLoopDelay([options])` {#perf_hooksmonitoreventloopdelayoptions}

**Agregado en: v11.10.0**

- `options` [\<Object\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `resolution` [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type) La tasa de muestreo en milisegundos. Debe ser mayor que cero. **Predeterminado:** `10`.
  
 
- Devuelve: [\<IntervalHistogram\>](/es/nodejs/api/perf_hooks#class-intervalhistogram-extends-histogram)

*Esta propiedad es una extensión de Node.js. No está disponible en navegadores Web.*

Crea un objeto `IntervalHistogram` que muestrea e informa la demora del bucle de eventos a lo largo del tiempo. Los retrasos se informarán en nanosegundos.

El uso de un temporizador para detectar el retraso aproximado del bucle de eventos funciona porque la ejecución de los temporizadores está ligada específicamente al ciclo de vida del bucle de eventos libuv. Es decir, un retraso en el bucle provocará un retraso en la ejecución del temporizador, y esos retrasos son específicamente lo que esta API está destinada a detectar.

::: code-group
```js [ESM]
import { monitorEventLoopDelay } from 'node:perf_hooks';

const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
// Do something.
h.disable();
console.log(h.min);
console.log(h.max);
console.log(h.mean);
console.log(h.stddev);
console.log(h.percentiles);
console.log(h.percentile(50));
console.log(h.percentile(99));
```

```js [CJS]
const { monitorEventLoopDelay } = require('node:perf_hooks');
const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
// Do something.
h.disable();
console.log(h.min);
console.log(h.max);
console.log(h.mean);
console.log(h.stddev);
console.log(h.percentiles);
console.log(h.percentile(50));
console.log(h.percentile(99));
```
:::

## Clase: `Histogram` {#class-histogram}

**Agregado en: v11.10.0**

### `histogram.count` {#histogramcount}

**Agregado en: v17.4.0, v16.14.0**

- [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type)

El número de muestras registradas por el histograma.

### `histogram.countBigInt` {#histogramcountbigint}

**Agregado en: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

El número de muestras registradas por el histograma.


### `histogram.exceeds` {#histogramexceeds}

**Agregado en: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El número de veces que el retraso del bucle de eventos excedió el umbral máximo de retraso de 1 hora del bucle de eventos.

### `histogram.exceedsBigInt` {#histogramexceedsbigint}

**Agregado en: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

El número de veces que el retraso del bucle de eventos excedió el umbral máximo de retraso de 1 hora del bucle de eventos.

### `histogram.max` {#histogrammax}

**Agregado en: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El retraso máximo registrado del bucle de eventos.

### `histogram.maxBigInt` {#histogrammaxbigint}

**Agregado en: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

El retraso máximo registrado del bucle de eventos.

### `histogram.mean` {#histogrammean}

**Agregado en: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La media de los retrasos registrados del bucle de eventos.

### `histogram.min` {#histogrammin}

**Agregado en: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El retraso mínimo registrado del bucle de eventos.

### `histogram.minBigInt` {#histogramminbigint}

**Agregado en: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

El retraso mínimo registrado del bucle de eventos.

### `histogram.percentile(percentile)` {#histogrampercentilepercentile}

**Agregado en: v11.10.0**

- `percentile` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un valor de percentil en el rango (0, 100].
- Returns: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Devuelve el valor en el percentil dado.

### `histogram.percentileBigInt(percentile)` {#histogrampercentilebigintpercentile}

**Agregado en: v17.4.0, v16.14.0**

- `percentile` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un valor de percentil en el rango (0, 100].
- Returns: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Devuelve el valor en el percentil dado.


### `histogram.percentiles` {#histogrampercentiles}

**Agregado en: v11.10.0**

- [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

Devuelve un objeto `Map` que detalla la distribución de percentiles acumulados.

### `histogram.percentilesBigInt` {#histogrampercentilesbigint}

**Agregado en: v17.4.0, v16.14.0**

- [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

Devuelve un objeto `Map` que detalla la distribución de percentiles acumulados.

### `histogram.reset()` {#histogramreset}

**Agregado en: v11.10.0**

Restablece los datos del histograma recopilados.

### `histogram.stddev` {#histogramstddev}

**Agregado en: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La desviación estándar de los retrasos del bucle de eventos registrados.

## Clase: `IntervalHistogram extends Histogram` {#class-intervalhistogram-extends-histogram}

Un `Histogram` que se actualiza periódicamente en un intervalo dado.

### `histogram.disable()` {#histogramdisable}

**Agregado en: v11.10.0**

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Desactiva el temporizador de intervalo de actualización. Devuelve `true` si el temporizador se detuvo, `false` si ya estaba detenido.

### `histogram.enable()` {#histogramenable}

**Agregado en: v11.10.0**

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Activa el temporizador de intervalo de actualización. Devuelve `true` si el temporizador se inició, `false` si ya estaba iniciado.

### Clonación de un `IntervalHistogram` {#cloning-an-intervalhistogram}

Las instancias de [\<IntervalHistogram\>](/es/nodejs/api/perf_hooks#class-intervalhistogram-extends-histogram) se pueden clonar a través de [\<MessagePort\>](/es/nodejs/api/worker_threads#class-messageport). En el extremo receptor, el histograma se clona como un objeto [\<Histogram\>](/es/nodejs/api/perf_hooks#class-histogram) simple que no implementa los métodos `enable()` y `disable()`.

## Clase: `RecordableHistogram extends Histogram` {#class-recordablehistogram-extends-histogram}

**Agregado en: v15.9.0, v14.18.0**

### `histogram.add(other)` {#histogramaddother}

**Agregado en: v17.4.0, v16.14.0**

- `other` [\<RecordableHistogram\>](/es/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram)

Agrega los valores de `other` a este histograma.


### `histogram.record(val)` {#histogramrecordval}

**Agregado en: v15.9.0, v14.18.0**

- `val` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) La cantidad a registrar en el histograma.

### `histogram.recordDelta()` {#histogramrecorddelta}

**Agregado en: v15.9.0, v14.18.0**

Calcula la cantidad de tiempo (en nanosegundos) que ha pasado desde la llamada anterior a `recordDelta()` y registra esa cantidad en el histograma.

## Ejemplos {#examples}

### Medición de la duración de operaciones asíncronas {#measuring-the-duration-of-async-operations}

El siguiente ejemplo utiliza los [Async Hooks](/es/nodejs/api/async_hooks) y las APIs de Performance para medir la duración real de una operación Timeout (incluida la cantidad de tiempo que tardó en ejecutarse la callback).

::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';
import { performance, PerformanceObserver } from 'node:perf_hooks';

const set = new Set();
const hook = createHook({
  init(id, type) {
    if (type === 'Timeout') {
      performance.mark(`Timeout-${id}-Init`);
      set.add(id);
    }
  },
  destroy(id) {
    if (set.has(id)) {
      set.delete(id);
      performance.mark(`Timeout-${id}-Destroy`);
      performance.measure(`Timeout-${id}`,
                          `Timeout-${id}-Init`,
                          `Timeout-${id}-Destroy`);
    }
  },
});
hook.enable();

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries()[0]);
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['measure'], buffered: true });

setTimeout(() => {}, 1000);
```

```js [CJS]
'use strict';
const async_hooks = require('node:async_hooks');
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const set = new Set();
const hook = async_hooks.createHook({
  init(id, type) {
    if (type === 'Timeout') {
      performance.mark(`Timeout-${id}-Init`);
      set.add(id);
    }
  },
  destroy(id) {
    if (set.has(id)) {
      set.delete(id);
      performance.mark(`Timeout-${id}-Destroy`);
      performance.measure(`Timeout-${id}`,
                          `Timeout-${id}-Init`,
                          `Timeout-${id}-Destroy`);
    }
  },
});
hook.enable();

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries()[0]);
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['measure'], buffered: true });

setTimeout(() => {}, 1000);
```
:::


### Midiendo cuánto tiempo toma cargar las dependencias {#measuring-how-long-it-takes-to-load-dependencies}

El siguiente ejemplo mide la duración de las operaciones `require()` para cargar las dependencias:

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

// Activar el observador
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`import('${entry[0]}')`, entry.duration);
  });
  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'], buffered: true });

const timedImport = performance.timerify(async (module) => {
  return await import(module);
});

await timedImport('some-module');
```

```js [CJS]
'use strict';
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');
const mod = require('node:module');

// Modificar la función require
mod.Module.prototype.require =
  performance.timerify(mod.Module.prototype.require);
require = performance.timerify(require);

// Activar el observador
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`require('${entry[0]}')`, entry.duration);
  });
  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'], buffered: true });

require('some-module');
```
:::

### Midiendo cuánto tiempo toma un viaje de ida y vuelta HTTP {#measuring-how-long-one-http-round-trip-takes}

El siguiente ejemplo se utiliza para rastrear el tiempo que gasta el cliente HTTP (`OutgoingMessage`) y la petición HTTP (`IncomingMessage`). Para el cliente HTTP, significa el intervalo de tiempo entre el inicio de la petición y la recepción de la respuesta, y para la petición HTTP, significa el intervalo de tiempo entre la recepción de la petición y el envío de la respuesta:

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { createServer, get } from 'node:http';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});

obs.observe({ entryTypes: ['http'] });

const PORT = 8080;

createServer((req, res) => {
  res.end('ok');
}).listen(PORT, () => {
  get(`http://127.0.0.1:${PORT}`);
});
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const http = require('node:http');

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});

obs.observe({ entryTypes: ['http'] });

const PORT = 8080;

http.createServer((req, res) => {
  res.end('ok');
}).listen(PORT, () => {
  http.get(`http://127.0.0.1:${PORT}`);
});
```
:::


### Midiendo cuánto tarda el `net.connect` (solo para TCP) cuando la conexión es exitosa {#measuring-how-long-the-netconnect-only-for-tcp-takes-when-the-connection-is-successful}

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { connect, createServer } from 'node:net';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['net'] });
const PORT = 8080;
createServer((socket) => {
  socket.destroy();
}).listen(PORT, () => {
  connect(PORT);
});
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const net = require('node:net');
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['net'] });
const PORT = 8080;
net.createServer((socket) => {
  socket.destroy();
}).listen(PORT, () => {
  net.connect(PORT);
});
```
:::

### Midiendo cuánto tarda el DNS cuando la solicitud es exitosa {#measuring-how-long-the-dns-takes-when-the-request-is-successful}

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { lookup, promises } from 'node:dns';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['dns'] });
lookup('localhost', () => {});
promises.resolve('localhost');
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const dns = require('node:dns');
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['dns'] });
dns.lookup('localhost', () => {});
dns.promises.resolve('localhost');
```
:::

