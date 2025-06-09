---
title: Documentación de la API de Proceso de Node.js
description: Documentación detallada sobre el módulo de proceso de Node.js, cubriendo la gestión de procesos, variables de entorno, señales y más.
head:
  - - meta
    - name: og:title
      content: Documentación de la API de Proceso de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Documentación detallada sobre el módulo de proceso de Node.js, cubriendo la gestión de procesos, variables de entorno, señales y más.
  - - meta
    - name: twitter:title
      content: Documentación de la API de Proceso de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Documentación detallada sobre el módulo de proceso de Node.js, cubriendo la gestión de procesos, variables de entorno, señales y más.
---


# Proceso {#process}

**Código fuente:** [lib/process.js](https://github.com/nodejs/node/blob/v23.5.0/lib/process.js)

El objeto `process` proporciona información sobre, y control sobre, el proceso actual de Node.js.



::: code-group
```js [ESM]
import process from 'node:process';
```

```js [CJS]
const process = require('node:process');
```
:::

## Eventos del Proceso {#process-events}

El objeto `process` es una instancia de [`EventEmitter`](/es/nodejs/api/events#class-eventemitter).

### Evento: `'beforeExit'` {#event-beforeexit}

**Añadido en: v0.11.12**

El evento `'beforeExit'` se emite cuando Node.js vacía su bucle de eventos y no tiene trabajo adicional para programar. Normalmente, el proceso de Node.js se cerrará cuando no haya trabajo programado, pero un listener registrado en el evento `'beforeExit'` puede hacer llamadas asíncronas, y por lo tanto hacer que el proceso de Node.js continúe.

La función de callback del listener se invoca con el valor de [`process.exitCode`](/es/nodejs/api/process#processexitcode_1) pasado como el único argumento.

El evento `'beforeExit'` *no* se emite para condiciones que causan la terminación explícita, como llamar a [`process.exit()`](/es/nodejs/api/process#processexitcode) o excepciones no capturadas.

El `'beforeExit'` *no* debe usarse como una alternativa al evento `'exit'` a menos que la intención sea programar trabajo adicional.



::: code-group
```js [ESM]
import process from 'node:process';

process.on('beforeExit', (code) => {
  console.log('Evento beforeExit del proceso con código: ', code);
});

process.on('exit', (code) => {
  console.log('Evento exit del proceso con código: ', code);
});

console.log('Este mensaje se muestra primero.');

// Prints:
// Este mensaje se muestra primero.
// Evento beforeExit del proceso con código: 0
// Evento exit del proceso con código: 0
```

```js [CJS]
const process = require('node:process');

process.on('beforeExit', (code) => {
  console.log('Evento beforeExit del proceso con código: ', code);
});

process.on('exit', (code) => {
  console.log('Evento exit del proceso con código: ', code);
});

console.log('Este mensaje se muestra primero.');

// Prints:
// Este mensaje se muestra primero.
// Evento beforeExit del proceso con código: 0
// Evento exit del proceso con código: 0
```
:::


### Evento: `'disconnect'` {#event-disconnect}

**Añadido en: v0.7.7**

Si el proceso de Node.js se genera con un canal IPC (ver la documentación de [Proceso Hijo](/es/nodejs/api/child_process) y [Cluster](/es/nodejs/api/cluster)), el evento `'disconnect'` se emitirá cuando el canal IPC se cierre.

### Evento: `'exit'` {#event-exit}

**Añadido en: v0.1.7**

- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El evento `'exit'` se emite cuando el proceso de Node.js está a punto de finalizar como resultado de:

- El método `process.exit()` que se llama explícitamente;
- El bucle de eventos de Node.js ya no tiene trabajo adicional que realizar.

No hay forma de evitar la salida del bucle de eventos en este punto, y una vez que todos los listeners de `'exit'` hayan terminado de ejecutarse, el proceso de Node.js terminará.

La función de callback del listener se invoca con el código de salida especificado ya sea por la propiedad [`process.exitCode`](/es/nodejs/api/process#processexitcode_1) o el argumento `exitCode` pasado al método [`process.exit()`](/es/nodejs/api/process#processexitcode).

::: code-group
```js [ESM]
import process from 'node:process';

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
```

```js [CJS]
const process = require('node:process');

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
```
:::

Las funciones de escucha **deben** realizar únicamente operaciones **síncronas**. El proceso de Node.js saldrá inmediatamente después de llamar a los listeners del evento `'exit'`, lo que provocará que cualquier trabajo adicional aún en cola en el bucle de eventos se abandone. En el siguiente ejemplo, por ejemplo, el timeout nunca ocurrirá:

::: code-group
```js [ESM]
import process from 'node:process';

process.on('exit', (code) => {
  setTimeout(() => {
    console.log('This will not run');
  }, 0);
});
```

```js [CJS]
const process = require('node:process');

process.on('exit', (code) => {
  setTimeout(() => {
    console.log('This will not run');
  }, 0);
});
```
:::


### Evento: `'message'` {#event-message}

**Añadido en: v0.5.10**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) un objeto JSON analizado o un valor primitivo serializable.
- `sendHandle` [\<net.Server\>](/es/nodejs/api/net#class-netserver) | [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) un objeto [`net.Server`](/es/nodejs/api/net#class-netserver) o [`net.Socket`](/es/nodejs/api/net#class-netsocket), o indefinido.

Si el proceso Node.js se genera con un canal IPC (consulte la documentación de [Proceso hijo](/es/nodejs/api/child_process) y [Cluster](/es/nodejs/api/cluster)), el evento `'message'` se emite cada vez que un proceso padre envía un mensaje utilizando [`childprocess.send()`](/es/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) y el proceso hijo lo recibe.

El mensaje pasa por la serialización y el análisis. El mensaje resultante podría no ser el mismo que el que se envió originalmente.

Si la opción `serialization` se estableció en `advanced` al generar el proceso, el argumento `message` puede contener datos que JSON no puede representar. Consulte [Serialización avanzada para `child_process`](/es/nodejs/api/child_process#advanced-serialization) para obtener más detalles.

### Evento: `'multipleResolves'` {#event-multipleresolves}

**Añadido en: v10.12.0**

**Obsoleto desde: v17.6.0, v16.15.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El tipo de resolución. Uno de `'resolve'` o `'reject'`.
- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) La promesa que se resolvió o rechazó más de una vez.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) El valor con el que la promesa se resolvió o rechazó después de la resolución original.

El evento `'multipleResolves'` se emite cada vez que una `Promise` ha sido:

- Resuelta más de una vez.
- Rechazada más de una vez.
- Rechazada después de resolverse.
- Resuelta después de rechazarse.

Esto es útil para rastrear posibles errores en una aplicación mientras se usa el constructor `Promise`, ya que las resoluciones múltiples se tragan silenciosamente. Sin embargo, la ocurrencia de este evento no indica necesariamente un error. Por ejemplo, [`Promise.race()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) puede desencadenar un evento `'multipleResolves'`.

Debido a la poca fiabilidad del evento en casos como el ejemplo [`Promise.race()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) anterior, se ha declarado obsoleto.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('multipleResolves', (type, promise, reason) => {
  console.error(type, promise, reason);
  setImmediate(() => process.exit(1));
});

async function main() {
  try {
    return await new Promise((resolve, reject) => {
      resolve('First call');
      resolve('Swallowed resolve');
      reject(new Error('Swallowed reject'));
    });
  } catch {
    throw new Error('Failed');
  }
}

main().then(console.log);
// resolve: Promise { 'First call' } 'Swallowed resolve'
// reject: Promise { 'First call' } Error: Swallowed reject
//     at Promise (*)
//     at new Promise (<anonymous>)
//     at main (*)
// First call
```

```js [CJS]
const process = require('node:process');

process.on('multipleResolves', (type, promise, reason) => {
  console.error(type, promise, reason);
  setImmediate(() => process.exit(1));
});

async function main() {
  try {
    return await new Promise((resolve, reject) => {
      resolve('First call');
      resolve('Swallowed resolve');
      reject(new Error('Swallowed reject'));
    });
  } catch {
    throw new Error('Failed');
  }
}

main().then(console.log);
// resolve: Promise { 'First call' } 'Swallowed resolve'
// reject: Promise { 'First call' } Error: Swallowed reject
//     at Promise (*)
//     at new Promise (<anonymous>)
//     at main (*)
// First call
```
:::


### Evento: `'rejectionHandled'` {#event-rejectionhandled}

**Agregado en: v1.4.1**

- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) La promesa gestionada tardíamente.

El evento `'rejectionHandled'` se emite siempre que una `Promise` ha sido rechazada y se le adjuntó un controlador de errores (usando [`promise.catch()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch), por ejemplo) más tarde que un turno del bucle de eventos de Node.js.

El objeto `Promise` se habría emitido previamente en un evento `'unhandledRejection'`, pero durante el curso del procesamiento obtuvo un controlador de rechazo.

No existe la noción de un nivel superior para una cadena `Promise` en la que los rechazos siempre puedan ser gestionados. Siendo inherentemente asíncrono por naturaleza, un rechazo de `Promise` puede ser gestionado en un momento futuro, posiblemente mucho más tarde que el turno del bucle de eventos que toma para que se emita el evento `'unhandledRejection'`.

Otra forma de expresar esto es que, a diferencia del código síncrono donde hay una lista cada vez mayor de excepciones no controladas, con las Promesas puede haber una lista creciente y decreciente de rechazos no controlados.

En el código síncrono, el evento `'uncaughtException'` se emite cuando la lista de excepciones no controladas crece.

En el código asíncrono, el evento `'unhandledRejection'` se emite cuando la lista de rechazos no controlados crece, y el evento `'rejectionHandled'` se emite cuando la lista de rechazos no controlados se reduce.

::: code-group
```js [ESM]
import process from 'node:process';

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});
```

```js [CJS]
const process = require('node:process');

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});
```
:::

En este ejemplo, el `Map` de `unhandledRejections` crecerá y disminuirá con el tiempo, reflejando los rechazos que comienzan sin ser gestionados y luego se gestionan. Es posible registrar tales errores en un registro de errores, ya sea periódicamente (lo cual es probablemente lo mejor para aplicaciones de larga duración) o al salir del proceso (lo cual es probablemente lo más conveniente para los scripts).


### Evento: `'workerMessage'` {#event-workermessage}

**Agregado en: v22.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Un valor transmitido utilizando [`postMessageToThread()`](/es/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout).
- `source` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El ID del hilo de trabajo transmisor o `0` para el hilo principal.

El evento `'workerMessage'` se emite para cualquier mensaje entrante enviado por la otra parte utilizando [`postMessageToThread()`](/es/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout).

### Evento: `'uncaughtException'` {#event-uncaughtexception}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.0.0, v10.17.0 | Se añadió el argumento `origin`. |
| v0.1.18 | Agregado en: v0.1.18 |
:::

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) La excepción no capturada.
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Indica si la excepción se origina en un rechazo no manejado o en un error síncrono. Puede ser `'uncaughtException'` o `'unhandledRejection'`. El último se usa cuando ocurre una excepción en un contexto asíncrono basado en `Promise` (o si se rechaza una `Promise`) y la bandera [`--unhandled-rejections`](/es/nodejs/api/cli#--unhandled-rejectionsmode) se establece en `strict` o `throw` (que es el valor predeterminado) y el rechazo no se maneja, o cuando ocurre un rechazo durante la fase de carga estática del módulo ES del punto de entrada de la línea de comandos.

El evento `'uncaughtException'` se emite cuando una excepción de JavaScript no capturada llega hasta el bucle de eventos. De forma predeterminada, Node.js maneja tales excepciones imprimiendo el seguimiento de la pila en `stderr` y saliendo con el código 1, anulando cualquier [`process.exitCode`](/es/nodejs/api/process#processexitcode_1) establecido previamente. Añadir un manejador para el evento `'uncaughtException'` anula este comportamiento predeterminado. Alternativamente, cambie el [`process.exitCode`](/es/nodejs/api/process#processexitcode_1) en el manejador `'uncaughtException'` que resultará en que el proceso salga con el código de salida proporcionado. De lo contrario, en presencia de tal manejador el proceso saldrá con 0.



::: code-group
```js [ESM]
import process from 'node:process';
import fs from 'node:fs';

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}\n`,
  );
});

setTimeout(() => {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('This will not run.');
```

```js [CJS]
const process = require('node:process');
const fs = require('node:fs');

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}\n`,
  );
});

setTimeout(() => {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('This will not run.');
```
:::

Es posible monitorear los eventos `'uncaughtException'` sin anular el comportamiento predeterminado para salir del proceso instalando un escuchador `'uncaughtExceptionMonitor'`.


#### Advertencia: Uso correcto de `'uncaughtException'` {#warning-using-uncaughtexception-correctly}

`'uncaughtException'` es un mecanismo burdo para el manejo de excepciones que se pretende utilizar solo como último recurso. El evento *no debe* utilizarse como equivalente a `On Error Resume Next`. Las excepciones no controladas inherentemente significan que una aplicación se encuentra en un estado indefinido. Intentar reanudar el código de la aplicación sin recuperarse adecuadamente de la excepción puede causar problemas adicionales imprevistos e impredecibles.

Las excepciones lanzadas desde dentro del controlador de eventos no serán capturadas. En cambio, el proceso saldrá con un código de salida distinto de cero y se imprimirá el seguimiento de la pila. Esto es para evitar la recursión infinita.

Intentar reanudar normalmente después de una excepción no controlada puede ser similar a desenchufar el cable de alimentación al actualizar una computadora. Nueve de cada diez veces, no pasa nada. Pero la décima vez, el sistema se corrompe.

El uso correcto de `'uncaughtException'` es realizar una limpieza síncrona de los recursos asignados (por ejemplo, descriptores de archivos, controladores, etc.) antes de cerrar el proceso. **No es seguro reanudar el funcionamiento normal después de
<code>'uncaughtException'</code>.**

Para reiniciar una aplicación bloqueada de una manera más confiable, ya sea que se emita `'uncaughtException'` o no, se debe emplear un monitor externo en un proceso separado para detectar fallas de la aplicación y recuperarse o reiniciarse según sea necesario.

### Evento: `'uncaughtExceptionMonitor'` {#event-uncaughtexceptionmonitor}

**Añadido en: v13.7.0, v12.17.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) La excepción no controlada.
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Indica si la excepción se origina en un rechazo no controlado o en errores síncronos. Puede ser `'uncaughtException'` o `'unhandledRejection'`. El último se utiliza cuando ocurre una excepción en un contexto asíncrono basado en `Promise` (o si se rechaza una `Promise`) y la bandera [`--unhandled-rejections`](/es/nodejs/api/cli#--unhandled-rejectionsmode) se establece en `strict` o `throw` (que es el valor predeterminado) y el rechazo no se maneja, o cuando ocurre un rechazo durante la fase de carga estática del módulo ES del punto de entrada de la línea de comandos.

El evento `'uncaughtExceptionMonitor'` se emite antes de que se emita un evento `'uncaughtException'` o se llame a un hook instalado a través de [`process.setUncaughtExceptionCaptureCallback()`](/es/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn).

La instalación de un listener `'uncaughtExceptionMonitor'` no cambia el comportamiento una vez que se emite un evento `'uncaughtException'`. El proceso seguirá fallando si no se instala ningún listener `'uncaughtException'`.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('uncaughtExceptionMonitor', (err, origin) => {
  MyMonitoringTool.logSync(err, origin);
});

// Intencionalmente causa una excepción, pero no la captures.
nonexistentFunc();
// Aún bloquea Node.js
```

```js [CJS]
const process = require('node:process');

process.on('uncaughtExceptionMonitor', (err, origin) => {
  MyMonitoringTool.logSync(err, origin);
});

// Intencionalmente causa una excepción, pero no la captures.
nonexistentFunc();
// Aún bloquea Node.js
```
:::


### Evento: `'unhandledRejection'` {#event-unhandledrejection}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v7.0.0 | No manejar los rechazos de `Promise` está obsoleto. |
| v6.6.0 | Los rechazos de `Promise` no manejados ahora emitirán una advertencia del proceso. |
| v1.4.1 | Agregado en: v1.4.1 |
:::

- `reason` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) El objeto con el cual la promesa fue rechazada (típicamente un objeto [`Error`](/es/nodejs/api/errors#class-error)).
- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) La promesa rechazada.

El evento `'unhandledRejection'` se emite cada vez que una `Promise` es rechazada y no se adjunta ningún controlador de errores a la promesa dentro de un turno del bucle de eventos. Cuando se programa con Promesas, las excepciones se encapsulan como "promesas rechazadas". Los rechazos se pueden capturar y manejar utilizando [`promise.catch()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) y se propagan a través de una cadena de `Promise`. El evento `'unhandledRejection'` es útil para detectar y rastrear las promesas que fueron rechazadas y cuyos rechazos aún no han sido manejados.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('unhandledRejection', (reason, promise) => {
  console.log('Rechazo no manejado en:', promise, 'razón:', reason);
  // Registro específico de la aplicación, lanzamiento de un error u otra lógica aquí
});

somePromise.then((res) => {
  return reportToUser(JSON.pasre(res)); // Note el error tipográfico (`pasre`)
}); // Sin `.catch()` o `.then()`
```

```js [CJS]
const process = require('node:process');

process.on('unhandledRejection', (reason, promise) => {
  console.log('Rechazo no manejado en:', promise, 'razón:', reason);
  // Registro específico de la aplicación, lanzamiento de un error u otra lógica aquí
});

somePromise.then((res) => {
  return reportToUser(JSON.pasre(res)); // Note el error tipográfico (`pasre`)
}); // Sin `.catch()` o `.then()`
```
:::

Lo siguiente también activará la emisión del evento `'unhandledRejection'`:

::: code-group
```js [ESM]
import process from 'node:process';

function SomeResource() {
  // Inicialmente establecer el estado cargado a una promesa rechazada
  this.loaded = Promise.reject(new Error('¡Recurso aún no cargado!'));
}

const resource = new SomeResource();
// no .catch o .then en resource.loaded durante al menos un turno
```

```js [CJS]
const process = require('node:process');

function SomeResource() {
  // Inicialmente establecer el estado cargado a una promesa rechazada
  this.loaded = Promise.reject(new Error('¡Recurso aún no cargado!'));
}

const resource = new SomeResource();
// no .catch o .then en resource.loaded durante al menos un turno
```
:::

En este ejemplo, es posible rastrear el rechazo como un error del desarrollador, como sería el caso normalmente para otros eventos `'unhandledRejection'`. Para abordar tales fallas, se puede adjuntar un controlador [`.catch(() =\> { })`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) no operativo a `resource.loaded`, lo que evitaría que se emitiera el evento `'unhandledRejection'`.


### Evento: `'warning'` {#event-warning}

**Añadido en: v6.0.0**

- `warning` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Las propiedades clave de la advertencia son:
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre de la advertencia. **Predeterminado:** `'Warning'`.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una descripción proporcionada por el sistema de la advertencia.
    - `stack` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un seguimiento de la pila hasta la ubicación en el código donde se emitió la advertencia.

El evento `'warning'` se emite cada vez que Node.js emite una advertencia de proceso.

Una advertencia de proceso es similar a un error en el sentido de que describe condiciones excepcionales que se están señalando a la atención del usuario. Sin embargo, las advertencias no forman parte del flujo normal de manejo de errores de Node.js y JavaScript. Node.js puede emitir advertencias siempre que detecte malas prácticas de codificación que podrían conducir a un rendimiento subóptimo de la aplicación, errores o vulnerabilidades de seguridad.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);    // Imprime el nombre de la advertencia
  console.warn(warning.message); // Imprime el mensaje de la advertencia
  console.warn(warning.stack);   // Imprime el seguimiento de la pila
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);    // Imprime el nombre de la advertencia
  console.warn(warning.message); // Imprime el mensaje de la advertencia
  console.warn(warning.stack);   // Imprime el seguimiento de la pila
});
```
:::

De forma predeterminada, Node.js imprimirá las advertencias del proceso en `stderr`. La opción de línea de comandos `--no-warnings` se puede usar para suprimir la salida predeterminada de la consola, pero el evento `'warning'` aún será emitido por el objeto `process`. Actualmente, no es posible suprimir tipos de advertencia específicos que no sean las advertencias de obsolescencia. Para suprimir las advertencias de obsolescencia, consulte el indicador [`--no-deprecation`](/es/nodejs/api/cli#--no-deprecation).

El siguiente ejemplo ilustra la advertencia que se imprime en `stderr` cuando se han añadido demasiados listeners a un evento:

```bash [BASH]
$ node
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> (node:38638) MaxListenersExceededWarning: Possible EventEmitter memory leak
detected. 2 foo listeners added. Use emitter.setMaxListeners() to increase limit
```
Por el contrario, el siguiente ejemplo desactiva la salida de advertencia predeterminada y añade un controlador personalizado al evento `'warning'`:

```bash [BASH]
$ node --no-warnings
> const p = process.on('warning', (warning) => console.warn('Do not do that!'));
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> Do not do that!
```
La opción de línea de comandos `--trace-warnings` se puede usar para que la salida predeterminada de la consola para las advertencias incluya el seguimiento de la pila completo de la advertencia.

El lanzamiento de Node.js usando el indicador de línea de comandos `--throw-deprecation` provocará que las advertencias de obsolescencia personalizadas se lancen como excepciones.

El uso del indicador de línea de comandos `--trace-deprecation` hará que la obsolescencia personalizada se imprima en `stderr` junto con el seguimiento de la pila.

El uso del indicador de línea de comandos `--no-deprecation` suprimirá todos los informes de la obsolescencia personalizada.

Los indicadores de línea de comandos `*-deprecation` solo afectan a las advertencias que usan el nombre `'DeprecationWarning'`.


#### Emisión de advertencias personalizadas {#emitting-custom-warnings}

Consulta el método [`process.emitWarning()`](/es/nodejs/api/process#processemitwarningwarning-type-code-ctor) para emitir advertencias personalizadas o específicas de la aplicación.

#### Nombres de advertencia de Node.js {#nodejs-warning-names}

No existen directrices estrictas para los tipos de advertencia (identificados por la propiedad `name`) emitidos por Node.js. Se pueden agregar nuevos tipos de advertencias en cualquier momento. Algunos de los tipos de advertencia más comunes incluyen:

- `'DeprecationWarning'` - Indica el uso de una API o característica en desuso de Node.js. Tales advertencias deben incluir una propiedad `'code'` que identifique el [código de obsolescencia](/es/nodejs/api/deprecations).
- `'ExperimentalWarning'` - Indica el uso de una API o característica experimental de Node.js. Dichas características deben usarse con precaución, ya que pueden cambiar en cualquier momento y no están sujetas a las mismas políticas estrictas de versionado semántico y soporte a largo plazo que las características admitidas.
- `'MaxListenersExceededWarning'` - Indica que se han registrado demasiados listeners para un evento dado en un `EventEmitter` o un `EventTarget`. Esto es a menudo una indicación de una fuga de memoria.
- `'TimeoutOverflowWarning'` - Indica que se ha proporcionado un valor numérico que no cabe dentro de un entero de 32 bits con signo a las funciones `setTimeout()` o `setInterval()`.
- `'TimeoutNegativeWarning'` - Indica que se ha proporcionado un número negativo a las funciones `setTimeout()` o `setInterval()`.
- `'TimeoutNaNWarning'` - Indica que se ha proporcionado un valor que no es un número a las funciones `setTimeout()` o `setInterval()`.
- `'UnsupportedWarning'` - Indica el uso de una opción o característica no compatible que se ignorará en lugar de tratarse como un error. Un ejemplo es el uso del mensaje de estado de la respuesta HTTP al usar la API de compatibilidad HTTP/2.

### Evento: `'worker'` {#event-worker}

**Agregado en: v16.2.0, v14.18.0**

- `worker` [\<Worker\>](/es/nodejs/api/worker_threads#class-worker) El [\<Worker\>](/es/nodejs/api/worker_threads#class-worker) que fue creado.

El evento `'worker'` se emite después de que se ha creado un nuevo hilo [\<Worker\>](/es/nodejs/api/worker_threads#class-worker).


### Eventos de señal {#signal-events}

Los eventos de señal se emitirán cuando el proceso de Node.js reciba una señal. Consulta [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7) para obtener una lista de nombres de señal POSIX estándar como `'SIGINT'`, `'SIGHUP'`, etc.

Las señales no están disponibles en los hilos [`Worker`](/es/nodejs/api/worker_threads#class-worker).

El controlador de señales recibirá el nombre de la señal (`'SIGINT'`, `'SIGTERM'`, etc.) como primer argumento.

El nombre de cada evento será el nombre común en mayúsculas de la señal (por ejemplo, `'SIGINT'` para las señales `SIGINT`).

::: code-group
```js [ESM]
import process from 'node:process';

// Comienza a leer desde stdin para que el proceso no se cierre.
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('Received SIGINT. Press Control-D to exit.');
});

// Usando una única función para manejar múltiples señales
function handle(signal) {
  console.log(`Received ${signal}`);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
```

```js [CJS]
const process = require('node:process');

// Comienza a leer desde stdin para que el proceso no se cierre.
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('Received SIGINT. Press Control-D to exit.');
});

// Usando una única función para manejar múltiples señales
function handle(signal) {
  console.log(`Received ${signal}`);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
```
:::

- `'SIGUSR1'` está reservado por Node.js para iniciar el [depurador](/es/nodejs/api/debugger). Es posible instalar un detector, pero hacerlo podría interferir con el depurador.
- `'SIGTERM'` y `'SIGINT'` tienen controladores predeterminados en plataformas que no son Windows que restablecen el modo de terminal antes de salir con el código `128 + número de señal`. Si una de estas señales tiene un detector instalado, su comportamiento predeterminado se eliminará (Node.js ya no saldrá).
- `'SIGPIPE'` se ignora de forma predeterminada. Puede tener un detector instalado.
- `'SIGHUP'` se genera en Windows cuando se cierra la ventana de la consola y en otras plataformas en varias condiciones similares. Consulta [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7). Puede tener un detector instalado, sin embargo, Windows terminará Node.js incondicionalmente unos 10 segundos después. En plataformas que no son Windows, el comportamiento predeterminado de `SIGHUP` es terminar Node.js, pero una vez que se ha instalado un detector, su comportamiento predeterminado se eliminará.
- `'SIGTERM'` no es compatible con Windows, se puede escuchar.
- `'SIGINT'` desde la terminal es compatible con todas las plataformas y, por lo general, se puede generar con + (aunque esto puede ser configurable). No se genera cuando el [modo raw de terminal](/es/nodejs/api/tty#readstreamsetrawmodemode) está habilitado y se usa +.
- `'SIGBREAK'` se entrega en Windows cuando se presiona + . En plataformas que no son Windows, se puede escuchar, pero no hay forma de enviarlo o generarlo.
- `'SIGWINCH'` se entrega cuando se ha redimensionado la consola. En Windows, esto solo sucederá al escribir en la consola cuando se está moviendo el cursor o cuando se usa un tty legible en modo raw.
- `'SIGKILL'` no puede tener un detector instalado, terminará incondicionalmente Node.js en todas las plataformas.
- `'SIGSTOP'` no puede tener un detector instalado.
- `'SIGBUS'`, `'SIGFPE'`, `'SIGSEGV'` y `'SIGILL'`, cuando no se generan artificialmente mediante [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2), inherentemente dejan el proceso en un estado desde el cual no es seguro llamar a los detectores JS. Hacerlo podría hacer que el proceso deje de responder.
- `0` se puede enviar para probar la existencia de un proceso, no tiene ningún efecto si el proceso existe, pero generará un error si el proceso no existe.

Windows no es compatible con las señales, por lo que no tiene un equivalente a la terminación por señal, pero Node.js ofrece cierta emulación con [`process.kill()`](/es/nodejs/api/process#processkillpid-signal) y [`subprocess.kill()`](/es/nodejs/api/child_process#subprocesskillsignal):

- El envío de `SIGINT`, `SIGTERM` y `SIGKILL` provocará la terminación incondicional del proceso de destino y, posteriormente, el subproceso informará que el proceso se terminó mediante una señal.
- El envío de la señal `0` se puede utilizar como una forma independiente de la plataforma para probar la existencia de un proceso.


## `process.abort()` {#processabort}

**Agregada en: v0.7.0**

El método `process.abort()` causa que el proceso de Node.js termine inmediatamente y genere un archivo *core*.

Esta característica no está disponible en hilos [`Worker`](/es/nodejs/api/worker_threads#class-worker).

## `process.allowedNodeEnvironmentFlags` {#processallowednodeenvironmentflags}

**Agregada en: v10.10.0**

- [\<Set\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Set)

La propiedad `process.allowedNodeEnvironmentFlags` es un `Set` especial de solo lectura de flags permitidas dentro de la variable de entorno [`NODE_OPTIONS`](/es/nodejs/api/cli#node_optionsoptions).

`process.allowedNodeEnvironmentFlags` extiende `Set`, pero sobreescribe `Set.prototype.has` para reconocer varias representaciones de flags posibles. `process.allowedNodeEnvironmentFlags.has()` retornará `true` en los siguientes casos:

- Los flags pueden omitir guiones iniciales simples (`-`) o dobles (`--`); ej., `inspect-brk` para `--inspect-brk`, o `r` para `-r`.
- Los flags pasados a V8 (como se listan en `--v8-options`) pueden reemplazar uno o más guiones *no iniciales* por un guion bajo, o viceversa; ej., `--perf_basic_prof`, `--perf-basic-prof`, `--perf_basic-prof`, etc.
- Los flags pueden contener uno o más caracteres de igual (`=`); todos los caracteres después e incluyendo el primer igual serán ignorados; ej., `--stack-trace-limit=100`.
- Los flags *deben* estar permitidas dentro de [`NODE_OPTIONS`](/es/nodejs/api/cli#node_optionsoptions).

Al iterar sobre `process.allowedNodeEnvironmentFlags`, las flags aparecerán solo *una vez*; cada una comenzará con uno o más guiones. Las flags pasadas a V8 contendrán guiones bajos en lugar de guiones no iniciales:

::: code-group
```js [ESM]
import { allowedNodeEnvironmentFlags } from 'node:process';

allowedNodeEnvironmentFlags.forEach((flag) => {
  // -r
  // --inspect-brk
  // --abort_on_uncaught_exception
  // ...
});
```

```js [CJS]
const { allowedNodeEnvironmentFlags } = require('node:process');

allowedNodeEnvironmentFlags.forEach((flag) => {
  // -r
  // --inspect-brk
  // --abort_on_uncaught_exception
  // ...
});
```
:::

Los métodos `add()`, `clear()`, y `delete()` de `process.allowedNodeEnvironmentFlags` no hacen nada, y fallarán silenciosamente.

Si Node.js fue compilado *sin* soporte de [`NODE_OPTIONS`](/es/nodejs/api/cli#node_optionsoptions) (mostrado en [`process.config`](/es/nodejs/api/process#processconfig)), `process.allowedNodeEnvironmentFlags` contendrá lo que *habría sido* permitido.


## `process.arch` {#processarch}

**Añadido en: v0.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La arquitectura de CPU del sistema operativo para la que se compiló el binario de Node.js. Los valores posibles son: `'arm'`, `'arm64'`, `'ia32'`, `'loong64'`, `'mips'`, `'mipsel'`, `'ppc'`, `'ppc64'`, `'riscv64'`, `'s390'`, `'s390x'` y `'x64'`.

::: code-group
```js [ESM]
import { arch } from 'node:process';

console.log(`Esta arquitectura de procesador es ${arch}`);
```

```js [CJS]
const { arch } = require('node:process');

console.log(`Esta arquitectura de procesador es ${arch}`);
```
:::

## `process.argv` {#processargv}

**Añadido en: v0.1.27**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propiedad `process.argv` devuelve un array que contiene los argumentos de la línea de comandos pasados cuando se inició el proceso de Node.js. El primer elemento será [`process.execPath`](/es/nodejs/api/process#processexecpath). Consulte `process.argv0` si se necesita acceder al valor original de `argv[0]`. El segundo elemento será la ruta al archivo JavaScript que se está ejecutando. Los elementos restantes serán cualquier argumento adicional de la línea de comandos.

Por ejemplo, asumiendo el siguiente script para `process-args.js`:

::: code-group
```js [ESM]
import { argv } from 'node:process';

// print process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```

```js [CJS]
const { argv } = require('node:process');

// print process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```
:::

Lanzando el proceso de Node.js como:

```bash [BASH]
node process-args.js one two=three four
```
Generaría la salida:

```text [TEXT]
0: /usr/local/bin/node
1: /Users/mjr/work/node/process-args.js
2: one
3: two=three
4: four
```
## `process.argv0` {#processargv0}

**Añadido en: v6.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propiedad `process.argv0` almacena una copia de solo lectura del valor original de `argv[0]` pasado cuando se inicia Node.js.

```bash [BASH]
$ bash -c 'exec -a customArgv0 ./node'
> process.argv[0]
'/Volumes/code/external/node/out/Release/node'
> process.argv0
'customArgv0'
```

## `process.channel` {#processchannel}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.0.0 | El objeto ya no expone accidentalmente enlaces nativos de C++. |
| v7.1.0 | Añadido en: v7.1.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Si el proceso de Node.js se generó con un canal IPC (consulte la documentación de [Proceso Hijo](/es/nodejs/api/child_process)), la propiedad `process.channel` es una referencia al canal IPC. Si no existe ningún canal IPC, esta propiedad es `undefined`.

### `process.channel.ref()` {#processchannelref}

**Añadido en: v7.1.0**

Este método hace que el canal IPC mantenga el bucle de eventos del proceso en ejecución si se ha llamado a `.unref()` antes.

Por lo general, esto se gestiona mediante el número de listeners `'disconnect'` y `'message'` en el objeto `process`. Sin embargo, este método se puede utilizar para solicitar explícitamente un comportamiento específico.

### `process.channel.unref()` {#processchannelunref}

**Añadido en: v7.1.0**

Este método hace que el canal IPC no mantenga el bucle de eventos del proceso en ejecución y le permite finalizar incluso mientras el canal está abierto.

Por lo general, esto se gestiona mediante el número de listeners `'disconnect'` y `'message'` en el objeto `process`. Sin embargo, este método se puede utilizar para solicitar explícitamente un comportamiento específico.

## `process.chdir(directory)` {#processchdirdirectory}

**Añadido en: v0.1.17**

- `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El método `process.chdir()` cambia el directorio de trabajo actual del proceso de Node.js o lanza una excepción si no se puede hacer (por ejemplo, si el `directory` especificado no existe).

::: code-group
```js [ESM]
import { chdir, cwd } from 'node:process';

console.log(`Directorio de inicio: ${cwd()}`);
try {
  chdir('/tmp');
  console.log(`Nuevo directorio: ${cwd()}`);
} catch (err) {
  console.error(`chdir: ${err}`);
}
```

```js [CJS]
const { chdir, cwd } = require('node:process');

console.log(`Directorio de inicio: ${cwd()}`);
try {
  chdir('/tmp');
  console.log(`Nuevo directorio: ${cwd()}`);
} catch (err) {
  console.error(`chdir: ${err}`);
}
```
:::

Esta característica no está disponible en hilos [`Worker`](/es/nodejs/api/worker_threads#class-worker).


## `process.config` {#processconfig}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | El objeto `process.config` ahora está congelado. |
| v16.0.0 | La modificación de process.config ha sido desaprobada. |
| v0.7.7 | Añadido en: v0.7.7 |
:::

- [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La propiedad `process.config` devuelve un `Objeto` congelado que contiene la representación en JavaScript de las opciones de configuración utilizadas para compilar el ejecutable actual de Node.js. Esto es lo mismo que el archivo `config.gypi` que se produjo al ejecutar el script `./configure`.

Un ejemplo de la posible salida se ve así:

```js [ESM]
{
  target_defaults:
   { cflags: [],
     default_configuration: 'Release',
     defines: [],
     include_dirs: [],
     libraries: [] },
  variables:
   {
     host_arch: 'x64',
     napi_build_version: 5,
     node_install_npm: 'true',
     node_prefix: '',
     node_shared_cares: 'false',
     node_shared_http_parser: 'false',
     node_shared_libuv: 'false',
     node_shared_zlib: 'false',
     node_use_openssl: 'true',
     node_shared_openssl: 'false',
     target_arch: 'x64',
     v8_use_snapshot: 1
   }
}
```
## `process.connected` {#processconnected}

**Añadido en: v0.7.2**

- [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Si el proceso de Node.js se genera con un canal IPC (ver la documentación de [Proceso Hijo](/es/nodejs/api/child_process) y [Cluster](/es/nodejs/api/cluster)), la propiedad `process.connected` devolverá `true` siempre que el canal IPC esté conectado y devolverá `false` después de que se llame a `process.disconnect()`.

Una vez que `process.connected` es `false`, ya no es posible enviar mensajes a través del canal IPC usando `process.send()`.

## `process.constrainedMemory()` {#processconstrainedmemory}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.0.0, v20.13.0 | Valor de retorno alineado con `uv_get_constrained_memory`. |
| v19.6.0, v18.15.0 | Añadido en: v19.6.0, v18.15.0 |
:::

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Obtiene la cantidad de memoria disponible para el proceso (en bytes) según los límites impuestos por el sistema operativo. Si no existe tal restricción, o la restricción es desconocida, se devuelve `0`.

Consulte [`uv_get_constrained_memory`](https://docs.libuv.org/en/v1.x/misc#c.uv_get_constrained_memory) para obtener más información.


## `process.availableMemory()` {#processavailablememory}

**Agregado en: v22.0.0, v20.13.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Obtiene la cantidad de memoria libre que todavía está disponible para el proceso (en bytes).

Consulte [`uv_get_available_memory`](https://docs.libuv.org/en/v1.x/misc#c.uv_get_available_memory) para obtener más información.

## `process.cpuUsage([previousValue])` {#processcpuusagepreviousvalue}

**Agregado en: v6.1.0**

- `previousValue` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un valor de retorno anterior de la llamada a `process.cpuUsage()`
- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `user` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `system` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El método `process.cpuUsage()` devuelve el uso del tiempo de CPU del usuario y del sistema del proceso actual, en un objeto con las propiedades `user` y `system`, cuyos valores son valores en microsegundos (millonésima de segundo). Estos valores miden el tiempo dedicado al código de usuario y al código del sistema respectivamente, y pueden terminar siendo mayores que el tiempo transcurrido real si varios núcleos de CPU están realizando trabajo para este proceso.

El resultado de una llamada anterior a `process.cpuUsage()` se puede pasar como argumento a la función para obtener una lectura de diferencia.

::: code-group
```js [ESM]
import { cpuUsage } from 'node:process';

const startUsage = cpuUsage();
// { user: 38579, system: 6986 }

// spin the CPU for 500 milliseconds
const now = Date.now();
while (Date.now() - now < 500);

console.log(cpuUsage(startUsage));
// { user: 514883, system: 11226 }
```

```js [CJS]
const { cpuUsage } = require('node:process');

const startUsage = cpuUsage();
// { user: 38579, system: 6986 }

// spin the CPU for 500 milliseconds
const now = Date.now();
while (Date.now() - now < 500);

console.log(cpuUsage(startUsage));
// { user: 514883, system: 11226 }
```
:::


## `process.cwd()` {#processcwd}

**Agregado en: v0.1.8**

- Regresa: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El método `process.cwd()` regresa el directorio de trabajo actual del proceso de Node.js.

::: code-group
```js [ESM]
import { cwd } from 'node:process';

console.log(`Directorio actual: ${cwd()}`);
```

```js [CJS]
const { cwd } = require('node:process');

console.log(`Directorio actual: ${cwd()}`);
```
:::

## `process.debugPort` {#processdebugport}

**Agregado en: v0.7.2**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El puerto utilizado por el depurador de Node.js cuando está activado.

::: code-group
```js [ESM]
import process from 'node:process';

process.debugPort = 5858;
```

```js [CJS]
const process = require('node:process');

process.debugPort = 5858;
```
:::

## `process.disconnect()` {#processdisconnect}

**Agregado en: v0.7.2**

Si el proceso de Node.js se genera con un canal IPC (vea la documentación de [Proceso Hijo](/es/nodejs/api/child_process) y [Cluster](/es/nodejs/api/cluster)), el método `process.disconnect()` cerrará el canal IPC al proceso padre, permitiendo que el proceso hijo salga con gracia una vez que no haya otras conexiones que lo mantengan vivo.

El efecto de llamar a `process.disconnect()` es el mismo que llamar a [`ChildProcess.disconnect()`](/es/nodejs/api/child_process#subprocessdisconnect) desde el proceso padre.

Si el proceso de Node.js no se generó con un canal IPC, `process.disconnect()` será `undefined`.

## `process.dlopen(module, filename[, flags])` {#processdlopenmodule-filename-flags}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.0.0 | Se agregó soporte para el argumento `flags`. |
| v0.1.16 | Agregado en: v0.1.16 |
:::

- `module` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `flags` [\<os.constants.dlopen\>](/es/nodejs/api/os#dlopen-constants) **Predeterminado:** `os.constants.dlopen.RTLD_LAZY`

El método `process.dlopen()` permite cargar dinámicamente objetos compartidos. Es utilizado principalmente por `require()` para cargar complementos de C++, y no debe ser utilizado directamente, excepto en casos especiales. En otras palabras, [`require()`](/es/nodejs/api/globals#require) debe preferirse sobre `process.dlopen()` a menos que haya razones específicas, tales como flags dlopen personalizados o la carga desde módulos ES.

El argumento `flags` es un entero que permite especificar el comportamiento dlopen. Consulte la documentación de [`os.constants.dlopen`](/es/nodejs/api/os#dlopen-constants) para más detalles.

Un requisito importante al llamar a `process.dlopen()` es que la instancia `module` debe ser pasada. Las funciones exportadas por el complemento C++ son entonces accesibles vía `module.exports`.

El ejemplo a continuación muestra cómo cargar un complemento de C++, llamado `local.node`, que exporta una función `foo`. Todos los símbolos se cargan antes de que la llamada regrese, pasando la constante `RTLD_NOW`. En este ejemplo, se asume que la constante está disponible.

::: code-group
```js [ESM]
import { dlopen } from 'node:process';
import { constants } from 'node:os';
import { fileURLToPath } from 'node:url';

const module = { exports: {} };
dlopen(module, fileURLToPath(new URL('local.node', import.meta.url)),
       constants.dlopen.RTLD_NOW);
module.exports.foo();
```

```js [CJS]
const { dlopen } = require('node:process');
const { constants } = require('node:os');
const { join } = require('node:path');

const module = { exports: {} };
dlopen(module, join(__dirname, 'local.node'), constants.dlopen.RTLD_NOW);
module.exports.foo();
```
:::


## `process.emitWarning(warning[, options])` {#processemitwarningwarning-options}

**Añadido en: v8.0.0**

- `warning` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) La advertencia a emitir.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Cuando `warning` es un `String`, `type` es el nombre a usar para el *tipo* de advertencia que se emite. **Predeterminado:** `'Warning'`.
    - `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un identificador único para la instancia de advertencia que se emite.
    - `ctor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Cuando `warning` es un `String`, `ctor` es una función opcional que se usa para limitar el seguimiento de la pila generado. **Predeterminado:** `process.emitWarning`.
    - `detail` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Texto adicional para incluir con el error.

El método `process.emitWarning()` se puede usar para emitir advertencias de proceso personalizadas o específicas de la aplicación. Estas se pueden escuchar agregando un controlador al evento [`'warning'`](/es/nodejs/api/process#event-warning).

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Emitir una advertencia con un código y detalles adicionales.
emitWarning('¡Algo sucedió!', {
  code: 'MY_WARNING',
  detail: 'Esta es información adicional',
});
// Emite:
// (node:56338) [MY_WARNING] Warning: ¡Algo sucedió!
// Esta es información adicional
```

```js [CJS]
const { emitWarning } = require('node:process');

// Emitir una advertencia con un código y detalles adicionales.
emitWarning('¡Algo sucedió!', {
  code: 'MY_WARNING',
  detail: 'Esta es información adicional',
});
// Emite:
// (node:56338) [MY_WARNING] Warning: ¡Algo sucedió!
// Esta es información adicional
```
:::

En este ejemplo, `process.emitWarning()` genera internamente un objeto `Error` y lo pasa al controlador [`'warning'`](/es/nodejs/api/process#event-warning).

::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);    // 'Warning'
  console.warn(warning.message); // '¡Algo sucedió!'
  console.warn(warning.code);    // 'MY_WARNING'
  console.warn(warning.stack);   // Seguimiento de la pila
  console.warn(warning.detail);  // 'Esta es información adicional'
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);    // 'Warning'
  console.warn(warning.message); // '¡Algo sucedió!'
  console.warn(warning.code);    // 'MY_WARNING'
  console.warn(warning.stack);   // Seguimiento de la pila
  console.warn(warning.detail);  // 'Esta es información adicional'
});
```
:::

Si `warning` se pasa como un objeto `Error`, se ignora el argumento `options`.


## `process.emitWarning(warning[, type[, code]][, ctor])` {#processemitwarningwarning-type-code-ctor}

**Agregado en: v6.0.0**

- `warning` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) La advertencia a emitir.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Cuando `warning` es una `String`, `type` es el nombre a usar para el *tipo* de advertencia que se está emitiendo. **Predeterminado:** `'Warning'`.
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un identificador único para la instancia de advertencia que se está emitiendo.
- `ctor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Cuando `warning` es una `String`, `ctor` es una función opcional utilizada para limitar el seguimiento de la pila generado. **Predeterminado:** `process.emitWarning`.

El método `process.emitWarning()` se puede usar para emitir advertencias de proceso personalizadas o específicas de la aplicación. Estas se pueden escuchar agregando un controlador al evento [`'warning'`](/es/nodejs/api/process#event-warning).

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Emitir una advertencia usando una string.
emitWarning('¡Algo pasó!');
// Emite: (node: 56338) Warning: ¡Algo pasó!
```

```js [CJS]
const { emitWarning } = require('node:process');

// Emitir una advertencia usando una string.
emitWarning('¡Algo pasó!');
// Emite: (node: 56338) Warning: ¡Algo pasó!
```
:::

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Emitir una advertencia usando una string y un tipo.
emitWarning('¡Algo pasó!', 'AdvertenciaPersonalizada');
// Emite: (node:56338) AdvertenciaPersonalizada: ¡Algo pasó!
```

```js [CJS]
const { emitWarning } = require('node:process');

// Emitir una advertencia usando una string y un tipo.
emitWarning('¡Algo pasó!', 'AdvertenciaPersonalizada');
// Emite: (node:56338) AdvertenciaPersonalizada: ¡Algo pasó!
```
:::

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

emitWarning('¡Algo pasó!', 'AdvertenciaPersonalizada', 'WARN001');
// Emite: (node:56338) [WARN001] AdvertenciaPersonalizada: ¡Algo pasó!
```

```js [CJS]
const { emitWarning } = require('node:process');

process.emitWarning('¡Algo pasó!', 'AdvertenciaPersonalizada', 'WARN001');
// Emite: (node:56338) [WARN001] AdvertenciaPersonalizada: ¡Algo pasó!
```
:::

En cada uno de los ejemplos anteriores, un objeto `Error` es generado internamente por `process.emitWarning()` y pasado a través del controlador [`'warning'`](/es/nodejs/api/process#event-warning).

::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.code);
  console.warn(warning.stack);
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.code);
  console.warn(warning.stack);
});
```
:::

Si `warning` se pasa como un objeto `Error`, se pasará al controlador de eventos `'warning'` sin modificar (y los argumentos opcionales `type`, `code` y `ctor` se ignorarán):

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Emitir una advertencia usando un objeto Error.
const myWarning = new Error('¡Algo pasó!');
// Usar la propiedad name de Error para especificar el nombre del tipo
myWarning.name = 'AdvertenciaPersonalizada';
myWarning.code = 'WARN001';

emitWarning(myWarning);
// Emite: (node:56338) [WARN001] AdvertenciaPersonalizada: ¡Algo pasó!
```

```js [CJS]
const { emitWarning } = require('node:process');

// Emitir una advertencia usando un objeto Error.
const myWarning = new Error('¡Algo pasó!');
// Usar la propiedad name de Error para especificar el nombre del tipo
myWarning.name = 'AdvertenciaPersonalizada';
myWarning.code = 'WARN001';

emitWarning(myWarning);
// Emite: (node:56338) [WARN001] AdvertenciaPersonalizada: ¡Algo pasó!
```
:::

Se lanza un `TypeError` si `warning` es algo distinto de una string o un objeto `Error`.

Si bien las advertencias de proceso usan objetos `Error`, el mecanismo de advertencia de proceso **no** es un reemplazo para los mecanismos normales de manejo de errores.

El siguiente manejo adicional se implementa si el `type` de advertencia es `'DeprecationWarning'`:

- Si se utiliza el indicador de línea de comandos `--throw-deprecation`, la advertencia de obsolescencia se lanza como una excepción en lugar de emitirse como un evento.
- Si se utiliza el indicador de línea de comandos `--no-deprecation`, la advertencia de obsolescencia se suprime.
- Si se utiliza el indicador de línea de comandos `--trace-deprecation`, la advertencia de obsolescencia se imprime en `stderr` junto con el seguimiento de pila completo.


### Evitar advertencias duplicadas {#avoiding-duplicate-warnings}

Como práctica recomendada, las advertencias solo deben emitirse una vez por proceso. Para hacerlo, coloque el `emitWarning()` detrás de un booleano.

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

function emitMyWarning() {
  if (!emitMyWarning.warned) {
    emitMyWarning.warned = true;
    emitWarning('Only warn once!');
  }
}
emitMyWarning();
// Emits: (node: 56339) Warning: Only warn once!
emitMyWarning();
// Emits nothing
```

```js [CJS]
const { emitWarning } = require('node:process');

function emitMyWarning() {
  if (!emitMyWarning.warned) {
    emitMyWarning.warned = true;
    emitWarning('Only warn once!');
  }
}
emitMyWarning();
// Emits: (node: 56339) Warning: Only warn once!
emitMyWarning();
// Emits nothing
```
:::

## `process.env` {#processenv}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v11.14.0 | Los hilos de trabajo ahora usarán una copia del `process.env` del hilo principal de forma predeterminada, configurable a través de la opción `env` del constructor `Worker`. |
| v10.0.0 | La conversión implícita del valor de la variable a cadena está obsoleta. |
| v0.1.27 | Añadido en: v0.1.27 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La propiedad `process.env` devuelve un objeto que contiene el entorno del usuario. Consulte [`environ(7)`](http://man7.org/linux/man-pages/man7/environ.7).

Un ejemplo de este objeto se vería así:

```js [ESM]
{
  TERM: 'xterm-256color',
  SHELL: '/usr/local/bin/bash',
  USER: 'maciej',
  PATH: '~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin',
  PWD: '/Users/maciej',
  EDITOR: 'vim',
  SHLVL: '1',
  HOME: '/Users/maciej',
  LOGNAME: 'maciej',
  _: '/usr/local/bin/node'
}
```
Es posible modificar este objeto, pero tales modificaciones no se reflejarán fuera del proceso de Node.js, o (a menos que se solicite explícitamente) a otros hilos [`Worker`](/es/nodejs/api/worker_threads#class-worker). En otras palabras, el siguiente ejemplo no funcionaría:

```bash [BASH]
node -e 'process.env.foo = "bar"' && echo $foo
```
Mientras que lo siguiente sí:

::: code-group
```js [ESM]
import { env } from 'node:process';

env.foo = 'bar';
console.log(env.foo);
```

```js [CJS]
const { env } = require('node:process');

env.foo = 'bar';
console.log(env.foo);
```
:::

Asignar una propiedad a `process.env` convertirá implícitamente el valor a una cadena. **Este comportamiento está obsoleto.** Las futuras versiones de Node.js pueden arrojar un error cuando el valor no sea una cadena, un número o un booleano.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.test = null;
console.log(env.test);
// => 'null'
env.test = undefined;
console.log(env.test);
// => 'undefined'
```

```js [CJS]
const { env } = require('node:process');

env.test = null;
console.log(env.test);
// => 'null'
env.test = undefined;
console.log(env.test);
// => 'undefined'
```
:::

Use `delete` para eliminar una propiedad de `process.env`.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.TEST = 1;
delete env.TEST;
console.log(env.TEST);
// => undefined
```

```js [CJS]
const { env } = require('node:process');

env.TEST = 1;
delete env.TEST;
console.log(env.TEST);
// => undefined
```
:::

En los sistemas operativos Windows, las variables de entorno no distinguen entre mayúsculas y minúsculas.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.TEST = 1;
console.log(env.test);
// => 1
```

```js [CJS]
const { env } = require('node:process');

env.TEST = 1;
console.log(env.test);
// => 1
```
:::

A menos que se especifique explícitamente al crear una instancia de [`Worker`](/es/nodejs/api/worker_threads#class-worker), cada hilo [`Worker`](/es/nodejs/api/worker_threads#class-worker) tiene su propia copia de `process.env`, basada en el `process.env` de su hilo principal, o en lo que se haya especificado como la opción `env` para el constructor [`Worker`](/es/nodejs/api/worker_threads#class-worker). Los cambios en `process.env` no serán visibles entre los hilos [`Worker`](/es/nodejs/api/worker_threads#class-worker), y solo el hilo principal puede realizar cambios que sean visibles para el sistema operativo o para los complementos nativos. En Windows, una copia de `process.env` en una instancia de [`Worker`](/es/nodejs/api/worker_threads#class-worker) opera de forma que distingue entre mayúsculas y minúsculas, a diferencia del hilo principal.


## `process.execArgv` {#processexecargv}

**Agregado en: v0.7.7**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propiedad `process.execArgv` devuelve el conjunto de opciones de línea de comandos específicas de Node.js que se pasaron cuando se inició el proceso de Node.js. Estas opciones no aparecen en el array devuelto por la propiedad [`process.argv`](/es/nodejs/api/process#processargv) y no incluyen el ejecutable de Node.js, el nombre del script ni ninguna opción que siga al nombre del script. Estas opciones son útiles para generar procesos secundarios con el mismo entorno de ejecución que el padre.

```bash [BASH]
node --icu-data-dir=./foo --require ./bar.js script.js --version
```
Resulta en `process.execArgv`:

```json [JSON]
["--icu-data-dir=./foo", "--require", "./bar.js"]
```
Y `process.argv`:

```js [ESM]
['/usr/local/bin/node', 'script.js', '--version']
```
Consulta el constructor [`Worker`](/es/nodejs/api/worker_threads#new-workerfilename-options) para obtener el comportamiento detallado de los hilos de worker con esta propiedad.

## `process.execPath` {#processexecpath}

**Agregado en: v0.1.100**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propiedad `process.execPath` devuelve la ruta absoluta del ejecutable que inició el proceso de Node.js. Los enlaces simbólicos, si los hay, se resuelven.

```js [ESM]
'/usr/local/bin/node'
```
## `process.exit([code])` {#processexitcode}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.0.0 | Solo acepta un código de tipo número, o de tipo string si representa un entero. |
| v0.1.13 | Agregado en: v0.1.13 |
:::

- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El código de salida. Para el tipo string, solo se permiten cadenas de enteros (por ejemplo, '1'). **Predeterminado:** `0`.

El método `process.exit()` indica a Node.js que termine el proceso de forma síncrona con un estado de salida de `code`. Si se omite `code`, exit usa el código 'success' `0` o el valor de `process.exitCode` si se ha establecido. Node.js no terminará hasta que se llamen todos los listeners del evento [`'exit'`](/es/nodejs/api/process#event-exit).

Para salir con un código de 'failure':

::: code-group
```js [ESM]
import { exit } from 'node:process';

exit(1);
```

```js [CJS]
const { exit } = require('node:process');

exit(1);
```
:::

El shell que ejecutó Node.js debería ver el código de salida como `1`.

Llamar a `process.exit()` forzará al proceso a salir lo más rápido posible, incluso si todavía hay operaciones asíncronas pendientes que aún no se han completado por completo, incluidas las operaciones de E/S a `process.stdout` y `process.stderr`.

En la mayoría de las situaciones, en realidad no es necesario llamar a `process.exit()` explícitamente. El proceso de Node.js saldrá por sí solo *si no hay trabajo adicional pendiente* en el bucle de eventos. La propiedad `process.exitCode` se puede configurar para indicar al proceso qué código de salida usar cuando el proceso sale normalmente.

Por ejemplo, el siguiente ejemplo ilustra un *mal uso* del método `process.exit()` que podría conducir a que los datos impresos en stdout se trunquen y se pierdan:

::: code-group
```js [ESM]
import { exit } from 'node:process';

// Este es un ejemplo de lo que *no* se debe hacer:
if (someConditionNotMet()) {
  printUsageToStdout();
  exit(1);
}
```

```js [CJS]
const { exit } = require('node:process');

// Este es un ejemplo de lo que *no* se debe hacer:
if (someConditionNotMet()) {
  printUsageToStdout();
  exit(1);
}
```
:::

La razón por la que esto es problemático es porque las escrituras en `process.stdout` en Node.js a veces son *asíncronas* y pueden ocurrir en múltiples ticks del bucle de eventos de Node.js. Sin embargo, llamar a `process.exit()` fuerza al proceso a salir *antes* de que se puedan realizar esas escrituras adicionales a `stdout`.

En lugar de llamar a `process.exit()` directamente, el código *debería* establecer el `process.exitCode` y permitir que el proceso salga naturalmente evitando programar cualquier trabajo adicional para el bucle de eventos:

::: code-group
```js [ESM]
import process from 'node:process';

// Cómo establecer correctamente el código de salida mientras se permite
// que el proceso salga normalmente.
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
```

```js [CJS]
const process = require('node:process');

// Cómo establecer correctamente el código de salida mientras se permite
// que el proceso salga normalmente.
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
```
:::

Si es necesario terminar el proceso de Node.js debido a una condición de error, lanzar un error *no capturado* y permitir que el proceso termine en consecuencia es más seguro que llamar a `process.exit()`.

En los hilos [`Worker`](/es/nodejs/api/worker_threads#class-worker), esta función detiene el hilo actual en lugar del proceso actual.


## `process.exitCode` {#processexitcode_1}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v20.0.0 | Solo acepta un código de tipo número, o de tipo string si representa un entero. |
| v0.11.8 | Añadido en: v0.11.8 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El código de salida. Para el tipo string, solo se permiten strings de enteros (p. ej., '1'). **Predeterminado:** `undefined`.

Un número que será el código de salida del proceso, cuando el proceso finalice correctamente o se finalice a través de [`process.exit()`](/es/nodejs/api/process#processexitcode) sin especificar un código.

Especificar un código para [`process.exit(code)`](/es/nodejs/api/process#processexitcode) anulará cualquier configuración anterior de `process.exitCode`.

## `process.features.cached_builtins` {#processfeaturescached_builtins}

**Añadido en: v12.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Un valor booleano que es `true` si la compilación actual de Node.js está almacenando en caché los módulos incorporados.

## `process.features.debug` {#processfeaturesdebug}

**Añadido en: v0.5.5**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Un valor booleano que es `true` si la compilación actual de Node.js es una compilación de depuración.

## `process.features.inspector` {#processfeaturesinspector}

**Añadido en: v11.10.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Un valor booleano que es `true` si la compilación actual de Node.js incluye el inspector.

## `process.features.ipv6` {#processfeaturesipv6}

**Añadido en: v0.5.3**

**Obsoleto desde: v23.4.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto. Esta propiedad siempre es verdadera y cualquier verificación basada en ella es redundante.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Un valor booleano que es `true` si la compilación actual de Node.js incluye soporte para IPv6.

Dado que todas las compilaciones de Node.js tienen soporte para IPv6, este valor siempre es `true`.


## `process.features.require_module` {#processfeaturesrequire_module}

**Agregado en: v23.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Un valor booleano que es `true` si la compilación actual de Node.js soporta [cargar módulos ECMAScript usando `require()` ](/es/nodejs/api/modules#loading-ecmascript-modules-using-require).

## `process.features.tls` {#processfeaturestls}

**Agregado en: v0.5.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Un valor booleano que es `true` si la compilación actual de Node.js incluye soporte para TLS.

## `process.features.tls_alpn` {#processfeaturestls_alpn}

**Agregado en: v4.8.0**

**Obsoleto desde: v23.4.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto. Utilice `process.features.tls` en su lugar.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Un valor booleano que es `true` si la compilación actual de Node.js incluye soporte para ALPN en TLS.

En Node.js 11.0.0 y versiones posteriores, las dependencias de OpenSSL ofrecen soporte incondicional para ALPN. Por lo tanto, este valor es idéntico al de `process.features.tls`.

## `process.features.tls_ocsp` {#processfeaturestls_ocsp}

**Agregado en: v0.11.13**

**Obsoleto desde: v23.4.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto. Utilice `process.features.tls` en su lugar.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Un valor booleano que es `true` si la compilación actual de Node.js incluye soporte para OCSP en TLS.

En Node.js 11.0.0 y versiones posteriores, las dependencias de OpenSSL ofrecen soporte incondicional para OCSP. Por lo tanto, este valor es idéntico al de `process.features.tls`.

## `process.features.tls_sni` {#processfeaturestls_sni}

**Agregado en: v0.5.3**

**Obsoleto desde: v23.4.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto. Utilice `process.features.tls` en su lugar.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Un valor booleano que es `true` si la compilación actual de Node.js incluye soporte para SNI en TLS.

En Node.js 11.0.0 y versiones posteriores, las dependencias de OpenSSL ofrecen soporte incondicional para SNI. Por lo tanto, este valor es idéntico al de `process.features.tls`.


## `process.features.typescript` {#processfeaturestypescript}

**Añadido en: v23.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo activo
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Un valor que es `"strip"` si Node.js se ejecuta con `--experimental-strip-types`, `"transform"` si Node.js se ejecuta con `--experimental-transform-types`, y `false` en caso contrario.

## `process.features.uv` {#processfeaturesuv}

**Añadido en: v0.5.3**

**Obsoleto desde: v23.4.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto. Esta propiedad siempre es verdadera, y cualquier comprobación basada en ella es redundante.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Un valor booleano que es `true` si la compilación actual de Node.js incluye soporte para libuv.

Dado que no es posible compilar Node.js sin libuv, este valor siempre es `true`.

## `process.finalization.register(ref, callback)` {#processfinalizationregisterref-callback}

**Añadido en: v22.5.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo Activo
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La referencia al recurso que se está rastreando.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función de callback que se llamará cuando el recurso se finalice.
    - `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La referencia al recurso que se está rastreando.
    - `event` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El evento que activó la finalización. El valor predeterminado es 'exit'.
  
 

Esta función registra una función de callback que se llamará cuando el proceso emita el evento `exit` si el objeto `ref` no fue recolectado por el recolector de basura. Si el objeto `ref` fue recolectado por el recolector de basura antes de que se emita el evento `exit`, la función de callback se eliminará del registro de finalización, y no se llamará en la salida del proceso.

Dentro de la función de callback puedes liberar los recursos asignados por el objeto `ref`. Ten en cuenta que todas las limitaciones aplicadas al evento `beforeExit` también se aplican a la función `callback`, esto significa que existe la posibilidad de que la función de callback no se llame bajo circunstancias especiales.

La idea de esta función es ayudarte a liberar recursos cuando el proceso comienza a salir, pero también permitir que el objeto sea recolectado por el recolector de basura si ya no se está utilizando.

Por ejemplo: puedes registrar un objeto que contiene un búfer, quieres asegurarte de que el búfer se libere cuando el proceso salga, pero si el objeto es recolectado por el recolector de basura antes de que el proceso salga, ya no necesitamos liberar el búfer, por lo que en este caso simplemente eliminamos la función de callback del registro de finalización.



::: code-group
```js [CJS]
const { finalization } = require('node:process');

// Por favor, asegúrate de que la función pasada a finalization.register()
// no cree un cierre en torno a objetos innecesarios.
function onFinalize(obj, event) {
  // Puedes hacer lo que quieras con el objeto
  obj.dispose();
}

function setup() {
  // Este objeto puede ser recolectado por el recolector de basura de forma segura,
  // y la función de apagado resultante no se llamará.
  // No hay fugas.
  const myDisposableObject = {
    dispose() {
      // Libera tus recursos de forma síncrona
    },
  };

  finalization.register(myDisposableObject, onFinalize);
}

setup();
```

```js [ESM]
import { finalization } from 'node:process';

// Por favor, asegúrate de que la función pasada a finalization.register()
// no cree un cierre en torno a objetos innecesarios.
function onFinalize(obj, event) {
  // Puedes hacer lo que quieras con el objeto
  obj.dispose();
}

function setup() {
  // Este objeto puede ser recolectado por el recolector de basura de forma segura,
  // y la función de apagado resultante no se llamará.
  // No hay fugas.
  const myDisposableObject = {
    dispose() {
      // Libera tus recursos de forma síncrona
    },
  };

  finalization.register(myDisposableObject, onFinalize);
}

setup();
```
:::

El código anterior se basa en los siguientes supuestos:

- Se evitan las funciones flecha
- Se recomienda que las funciones regulares estén dentro del contexto global (raíz)

Las funciones regulares *podrían* hacer referencia al contexto donde vive `obj`, haciendo que `obj` no sea recolectable por el recolector de basura.

Las funciones flecha mantendrán el contexto anterior. Considera, por ejemplo:

```js [ESM]
class Test {
  constructor() {
    finalization.register(this, (ref) => ref.dispose());

    // Incluso algo como esto está altamente desaconsejado
    // finalization.register(this, () => this.dispose());
  }
  dispose() {}
}
```
Es muy poco probable (no imposible) que este objeto sea recolectado por el recolector de basura, pero si no lo es, `dispose` se llamará cuando se llame a `process.exit`.

Ten cuidado y evita confiar en esta característica para la eliminación de recursos críticos, ya que no se garantiza que la función de callback se llame en todas las circunstancias.


## `process.finalization.registerBeforeExit(ref, callback)` {#processfinalizationregisterbeforeexitref-callback}

**Agregado en: v22.5.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo Activo
:::

- `ref` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La referencia al recurso que se está rastreando.
- `callback` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función de callback que se llamará cuando se finalice el recurso.
    - `ref` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La referencia al recurso que se está rastreando.
    - `event` [\<cadena\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El evento que activó la finalización. Por defecto es 'beforeExit'.

Esta función se comporta exactamente igual que `register`, excepto que la callback se llamará cuando el proceso emita el evento `beforeExit` si el objeto `ref` no fue recolectado por el recolector de basura.

Tenga en cuenta que todas las limitaciones aplicadas al evento `beforeExit` también se aplican a la función `callback`, esto significa que existe la posibilidad de que la callback no se llame bajo circunstancias especiales.

## `process.finalization.unregister(ref)` {#processfinalizationunregisterref}

**Agregado en: v22.5.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo Activo
:::

- `ref` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La referencia al recurso que se registró previamente.

Esta función elimina el registro del objeto del registro de finalización, por lo que la callback ya no se llamará.

::: code-group
```js [CJS]
const { finalization } = require('node:process');

// Por favor, asegúrese de que la función pasada a finalization.register()
// no cree un cierre alrededor de objetos innecesarios.
function onFinalize(obj, event) {
  // Puedes hacer lo que quieras con el objeto
  obj.dispose();
}

function setup() {
  // Este objeto puede ser recogido con seguridad por el recolector de basura,
  // y la función de cierre resultante no se llamará.
  // No hay fugas.
  const myDisposableObject = {
    dispose() {
      // Libere sus recursos de forma síncrona
    },
  };

  finalization.register(myDisposableObject, onFinalize);

  // Hacer algo

  myDisposableObject.dispose();
  finalization.unregister(myDisposableObject);
}

setup();
```

```js [ESM]
import { finalization } from 'node:process';

// Por favor, asegúrese de que la función pasada a finalization.register()
// no cree un cierre alrededor de objetos innecesarios.
function onFinalize(obj, event) {
  // Puedes hacer lo que quieras con el objeto
  obj.dispose();
}

function setup() {
  // Este objeto puede ser recogido con seguridad por el recolector de basura,
  // y la función de cierre resultante no se llamará.
  // No hay fugas.
  const myDisposableObject = {
    dispose() {
      // Libere sus recursos de forma síncrona
    },
  };

  // Por favor, asegúrese de que la función pasada a finalization.register()
  // no cree un cierre alrededor de objetos innecesarios.
  function onFinalize(obj, event) {
    // Puedes hacer lo que quieras con el objeto
    obj.dispose();
  }

  finalization.register(myDisposableObject, onFinalize);

  // Hacer algo

  myDisposableObject.dispose();
  finalization.unregister(myDisposableObject);
}

setup();
```
:::


## `process.getActiveResourcesInfo()` {#processgetactiveresourcesinfo}

**Agregado en: v17.3.0, v16.14.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- Regresa: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El método `process.getActiveResourcesInfo()` devuelve un array de strings que contiene los tipos de recursos activos que actualmente mantienen vivo el bucle de eventos.

::: code-group
```js [ESM]
import { getActiveResourcesInfo } from 'node:process';
import { setTimeout } from 'node:timers';

console.log('Before:', getActiveResourcesInfo());
setTimeout(() => {}, 1000);
console.log('After:', getActiveResourcesInfo());
// Prints:
//   Before: [ 'CloseReq', 'TTYWrap', 'TTYWrap', 'TTYWrap' ]
//   After: [ 'CloseReq', 'TTYWrap', 'TTYWrap', 'TTYWrap', 'Timeout' ]
```

```js [CJS]
const { getActiveResourcesInfo } = require('node:process');
const { setTimeout } = require('node:timers');

console.log('Before:', getActiveResourcesInfo());
setTimeout(() => {}, 1000);
console.log('After:', getActiveResourcesInfo());
// Prints:
//   Before: [ 'TTYWrap', 'TTYWrap', 'TTYWrap' ]
//   After: [ 'TTYWrap', 'TTYWrap', 'TTYWrap', 'Timeout' ]
```
:::

## `process.getBuiltinModule(id)` {#processgetbuiltinmoduleid}

**Agregado en: v22.3.0, v20.16.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ID del módulo incorporado que se solicita.
- Regresa: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`process.getBuiltinModule(id)` proporciona una forma de cargar módulos incorporados en una función disponible globalmente. Los módulos ES que necesitan admitir otros entornos pueden usarlo para cargar condicionalmente un módulo incorporado de Node.js cuando se ejecuta en Node.js, sin tener que lidiar con el error de resolución que puede generar `import` en un entorno que no es de Node.js o tener que usar `import()` dinámico que convierte el módulo en un módulo asíncrono o convierte una API síncrona en una asíncrona.

```js [ESM]
if (globalThis.process?.getBuiltinModule) {
  // Run in Node.js, use the Node.js fs module.
  const fs = globalThis.process.getBuiltinModule('fs');
  // If `require()` is needed to load user-modules, use createRequire()
  const module = globalThis.process.getBuiltinModule('module');
  const require = module.createRequire(import.meta.url);
  const foo = require('foo');
}
```
Si `id` especifica un módulo incorporado disponible en el proceso Node.js actual, el método `process.getBuiltinModule(id)` devuelve el módulo incorporado correspondiente. Si `id` no corresponde a ningún módulo incorporado, se devuelve `undefined`.

`process.getBuiltinModule(id)` acepta ID de módulos incorporados que son reconocidos por [`module.isBuiltin(id)`](/es/nodejs/api/module#moduleisbuiltinmodulename). Algunos módulos incorporados deben cargarse con el prefijo `node:`, consulte [módulos incorporados con prefijo `node:` obligatorio](/es/nodejs/api/modules#built-in-modules-with-mandatory-node-prefix). Las referencias devueltas por `process.getBuiltinModule(id)` siempre apuntan al módulo incorporado correspondiente a `id` incluso si los usuarios modifican [`require.cache`](/es/nodejs/api/modules#requirecache) para que `require(id)` devuelva otra cosa.


## `process.getegid()` {#processgetegid}

**Añadido en: v2.0.0**

El método `process.getegid()` devuelve la identidad numérica efectiva del grupo del proceso Node.js. (Véase [`getegid(2)`](http://man7.org/linux/man-pages/man2/getegid.2).)

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getegid) {
  console.log(`Gid actual: ${process.getegid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getegid) {
  console.log(`Gid actual: ${process.getegid()}`);
}
```
:::

Esta función solo está disponible en plataformas POSIX (es decir, no Windows ni Android).

## `process.geteuid()` {#processgeteuid}

**Añadido en: v2.0.0**

- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

El método `process.geteuid()` devuelve la identidad numérica efectiva del usuario del proceso. (Véase [`geteuid(2)`](http://man7.org/linux/man-pages/man2/geteuid.2).)

::: code-group
```js [ESM]
import process from 'node:process';

if (process.geteuid) {
  console.log(`Uid actual: ${process.geteuid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.geteuid) {
  console.log(`Uid actual: ${process.geteuid()}`);
}
```
:::

Esta función solo está disponible en plataformas POSIX (es decir, no Windows ni Android).

## `process.getgid()` {#processgetgid}

**Añadido en: v0.1.31**

- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

El método `process.getgid()` devuelve la identidad numérica del grupo del proceso. (Véase [`getgid(2)`](http://man7.org/linux/man-pages/man2/getgid.2).)

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgid) {
  console.log(`Gid actual: ${process.getgid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getgid) {
  console.log(`Gid actual: ${process.getgid()}`);
}
```
:::

Esta función solo está disponible en plataformas POSIX (es decir, no Windows ni Android).

## `process.getgroups()` {#processgetgroups}

**Añadido en: v0.9.4**

- Devuelve: [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El método `process.getgroups()` devuelve un array con los IDs de grupo suplementarios. POSIX deja sin especificar si el ID de grupo efectivo está incluido, pero Node.js asegura que siempre lo esté.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgroups) {
  console.log(process.getgroups()); // [ 16, 21, 297 ]
}
```

```js [CJS]
const process = require('node:process');

if (process.getgroups) {
  console.log(process.getgroups()); // [ 16, 21, 297 ]
}
```
:::

Esta función solo está disponible en plataformas POSIX (es decir, no Windows ni Android).


## `process.getuid()` {#processgetuid}

**Añadido en: v0.1.28**

- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El método `process.getuid()` devuelve la identidad numérica de usuario del proceso. (Ver [`getuid(2)`](http://man7.org/linux/man-pages/man2/getuid.2).)

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getuid) {
  console.log(`UID actual: ${process.getuid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getuid) {
  console.log(`UID actual: ${process.getuid()}`);
}
```
:::

Esta función solo está disponible en plataformas POSIX (es decir, no Windows o Android).

## `process.hasUncaughtExceptionCaptureCallback()` {#processhasuncaughtexceptioncapturecallback}

**Añadido en: v9.3.0**

- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Indica si se ha establecido una retrollamada usando [`process.setUncaughtExceptionCaptureCallback()`](/es/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn).

## `process.hrtime([time])` {#processhrtimetime}

**Añadido en: v0.7.6**

::: info [Estable: 3 - Obsoleto]
[Estable: 3](/es/nodejs/api/documentation#stability-index) [Estabilidad: 3](/es/nodejs/api/documentation#stability-index) - Obsoleto. Utilice [`process.hrtime.bigint()`](/es/nodejs/api/process#processhrtimebigint) en su lugar.
:::

- `time` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El resultado de una llamada anterior a `process.hrtime()`
- Devuelve: [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Esta es la versión heredada de [`process.hrtime.bigint()`](/es/nodejs/api/process#processhrtimebigint) antes de que `bigint` se introdujera en JavaScript.

El método `process.hrtime()` devuelve el tiempo real de alta resolución actual en un `Array` de tuplas `[segundos, nanosegundos]`, donde `nanosegundos` es la parte restante del tiempo real que no se puede representar en precisión de segundos.

`time` es un parámetro opcional que debe ser el resultado de una llamada anterior a `process.hrtime()` para diferenciarlo con la hora actual. Si el parámetro pasado no es un `Array` de tuplas, se lanzará un `TypeError`. Pasar un array definido por el usuario en lugar del resultado de una llamada anterior a `process.hrtime()` conducirá a un comportamiento indefinido.

Estos tiempos son relativos a un tiempo arbitrario en el pasado, y no están relacionados con la hora del día y, por lo tanto, no están sujetos a la desviación del reloj. El uso principal es para medir el rendimiento entre intervalos:

::: code-group
```js [ESM]
import { hrtime } from 'node:process';

const NS_POR_SEC = 1e9;
const time = hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = hrtime(time);
  // [ 1, 552 ]

  console.log(`El benchmark tomó ${diff[0] * NS_POR_SEC + diff[1]} nanosegundos`);
  // El benchmark tomó 1000000552 nanosegundos
}, 1000);
```

```js [CJS]
const { hrtime } = require('node:process');

const NS_POR_SEC = 1e9;
const time = hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = hrtime(time);
  // [ 1, 552 ]

  console.log(`El benchmark tomó ${diff[0] * NS_POR_SEC + diff[1]} nanosegundos`);
  // El benchmark tomó 1000000552 nanosegundos
}, 1000);
```
:::

## `process.hrtime.bigint()` {#processhrtimebigint}

**Agregado en: v10.7.0**

- Devuelve: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

La versión `bigint` del método [`process.hrtime()`](/es/nodejs/api/process#processhrtimetime) que devuelve el tiempo real de alta resolución actual en nanosegundos como un `bigint`.

A diferencia de [`process.hrtime()`](/es/nodejs/api/process#processhrtimetime), no soporta un argumento `time` adicional ya que la diferencia puede calcularse directamente restando los dos `bigint`s.

::: code-group
```js [ESM]
import { hrtime } from 'node:process';

const start = hrtime.bigint();
// 191051479007711n

setTimeout(() => {
  const end = hrtime.bigint();
  // 191052633396993n

  console.log(`Benchmark took ${end - start} nanoseconds`);
  // Benchmark took 1154389282 nanoseconds
}, 1000);
```

```js [CJS]
const { hrtime } = require('node:process');

const start = hrtime.bigint();
// 191051479007711n

setTimeout(() => {
  const end = hrtime.bigint();
  // 191052633396993n

  console.log(`Benchmark took ${end - start} nanoseconds`);
  // Benchmark took 1154389282 nanoseconds
}, 1000);
```
:::

## `process.initgroups(user, extraGroup)` {#processinitgroupsuser-extragroup}

**Agregado en: v0.9.4**

- `user` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El nombre de usuario o identificador numérico.
- `extraGroup` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un nombre de grupo o identificador numérico.

El método `process.initgroups()` lee el archivo `/etc/group` e inicializa la lista de acceso al grupo, utilizando todos los grupos de los que el usuario es miembro. Esta es una operación privilegiada que requiere que el proceso de Node.js tenga acceso `root` o la capacidad `CAP_SETGID`.

Tenga cuidado al abandonar privilegios:

::: code-group
```js [ESM]
import { getgroups, initgroups, setgid } from 'node:process';

console.log(getgroups());         // [ 0 ]
initgroups('nodeuser', 1000);     // switch user
console.log(getgroups());         // [ 27, 30, 46, 1000, 0 ]
setgid(1000);                     // drop root gid
console.log(getgroups());         // [ 27, 30, 46, 1000 ]
```

```js [CJS]
const { getgroups, initgroups, setgid } = require('node:process');

console.log(getgroups());         // [ 0 ]
initgroups('nodeuser', 1000);     // switch user
console.log(getgroups());         // [ 27, 30, 46, 1000, 0 ]
setgid(1000);                     // drop root gid
console.log(getgroups());         // [ 27, 30, 46, 1000 ]
```
:::

Esta función solo está disponible en plataformas POSIX (es decir, no Windows o Android). Esta característica no está disponible en hilos [`Worker`](/es/nodejs/api/worker_threads#class-worker).


## `process.kill(pid[, signal])` {#processkillpid-signal}

**Agregado en: v0.0.6**

- `pid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un ID de proceso
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La señal para enviar, ya sea como una cadena o un número. **Predeterminado:** `'SIGTERM'`.

El método `process.kill()` envía la `señal` al proceso identificado por `pid`.

Los nombres de las señales son cadenas como `'SIGINT'` o `'SIGHUP'`. Consulte [Eventos de señal](/es/nodejs/api/process#signal-events) y [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) para obtener más información.

Este método lanzará un error si el `pid` de destino no existe. Como caso especial, se puede usar una señal de `0` para probar la existencia de un proceso. Las plataformas Windows lanzarán un error si el `pid` se usa para finalizar un grupo de procesos.

Aunque el nombre de esta función es `process.kill()`, en realidad es solo un remitente de señales, como la llamada al sistema `kill`. La señal enviada puede hacer algo más que finalizar el proceso de destino.

::: code-group
```js [ESM]
import process, { kill } from 'node:process';

process.on('SIGHUP', () => {
  console.log('Recibí la señal SIGHUP.');
});

setTimeout(() => {
  console.log('Saliendo.');
  process.exit(0);
}, 100);

kill(process.pid, 'SIGHUP');
```

```js [CJS]
const process = require('node:process');

process.on('SIGHUP', () => {
  console.log('Recibí la señal SIGHUP.');
});

setTimeout(() => {
  console.log('Saliendo.');
  process.exit(0);
}, 100);

process.kill(process.pid, 'SIGHUP');
```
:::

Cuando un proceso de Node.js recibe `SIGUSR1`, Node.js iniciará el depurador. Consulte [Eventos de señal](/es/nodejs/api/process#signal-events).

## `process.loadEnvFile(path)` {#processloadenvfilepath}

**Agregado en: v21.7.0, v20.12.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) 1 - Desarrollo activo
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type). **Predeterminado:** `'./.env'`

Carga el archivo `.env` en `process.env`. El uso de `NODE_OPTIONS` en el archivo `.env` no tendrá ningún efecto en Node.js.

::: code-group
```js [CJS]
const { loadEnvFile } = require('node:process');
loadEnvFile();
```

```js [ESM]
import { loadEnvFile } from 'node:process';
loadEnvFile();
```
:::


## `process.mainModule` {#processmainmodule}

**Añadido en: v0.1.17**

**Obsoleto desde: v14.0.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Use [`require.main`](/es/nodejs/api/modules#accessing-the-main-module) en su lugar.
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La propiedad `process.mainModule` proporciona una forma alternativa de recuperar [`require.main`](/es/nodejs/api/modules#accessing-the-main-module). La diferencia es que si el módulo principal cambia en tiempo de ejecución, [`require.main`](/es/nodejs/api/modules#accessing-the-main-module) aún puede referirse al módulo principal original en los módulos que se requirieron antes de que ocurriera el cambio. Generalmente, es seguro asumir que los dos se refieren al mismo módulo.

Al igual que con [`require.main`](/es/nodejs/api/modules#accessing-the-main-module), `process.mainModule` será `undefined` si no hay un script de entrada.

## `process.memoryUsage()` {#processmemoryusage}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.9.0, v12.17.0 | Se agregó `arrayBuffers` al objeto devuelto. |
| v7.2.0 | Se agregó `external` al objeto devuelto. |
| v0.1.16 | Añadido en: v0.1.16 |
:::

- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rss` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `heapTotal` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `heapUsed` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `external` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `arrayBuffers` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

Devuelve un objeto que describe el uso de memoria del proceso Node.js medido en bytes.



::: code-group
```js [ESM]
import { memoryUsage } from 'node:process';

console.log(memoryUsage());
// Prints:
// {
//  rss: 4935680,
//  heapTotal: 1826816,
//  heapUsed: 650472,
//  external: 49879,
//  arrayBuffers: 9386
// }
```

```js [CJS]
const { memoryUsage } = require('node:process');

console.log(memoryUsage());
// Prints:
// {
//  rss: 4935680,
//  heapTotal: 1826816,
//  heapUsed: 650472,
//  external: 49879,
//  arrayBuffers: 9386
// }
```
:::

- `heapTotal` y `heapUsed` se refieren al uso de memoria de V8.
- `external` se refiere al uso de memoria de objetos C++ enlazados a objetos JavaScript gestionados por V8.
- `rss`, Resident Set Size, es la cantidad de espacio ocupado en el dispositivo de memoria principal (que es un subconjunto de la memoria total asignada) para el proceso, incluidos todos los objetos y el código C++ y JavaScript.
- `arrayBuffers` se refiere a la memoria asignada para `ArrayBuffer`s y `SharedArrayBuffer`s, incluidos todos los [`Buffer`](/es/nodejs/api/buffer)s de Node.js. Esto también se incluye en el valor `external`. Cuando Node.js se utiliza como una biblioteca incrustada, este valor puede ser `0` porque las asignaciones para `ArrayBuffer`s pueden no ser rastreadas en ese caso.

Cuando se utilizan hilos [`Worker`](/es/nodejs/api/worker_threads#class-worker), `rss` será un valor que es válido para todo el proceso, mientras que los otros campos sólo se referirán al hilo actual.

El método `process.memoryUsage()` itera sobre cada página para recopilar información sobre el uso de la memoria, lo que podría ser lento dependiendo de las asignaciones de memoria del programa.


## `process.memoryUsage.rss()` {#processmemoryusagerss}

**Añadido en: v15.6.0, v14.18.0**

- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El método `process.memoryUsage.rss()` devuelve un entero que representa el tamaño del conjunto residente (RSS) en bytes.

El Tamaño del Conjunto Residente, es la cantidad de espacio ocupado en el dispositivo de memoria principal (que es un subconjunto de la memoria total asignada) para el proceso, incluyendo todos los objetos y el código C++ y JavaScript.

Este es el mismo valor que la propiedad `rss` proporcionada por `process.memoryUsage()` pero `process.memoryUsage.rss()` es más rápido.

::: code-group
```js [ESM]
import { memoryUsage } from 'node:process';

console.log(memoryUsage.rss());
// 35655680
```

```js [CJS]
const { memoryUsage } = require('node:process');

console.log(memoryUsage.rss());
// 35655680
```
:::

## `process.nextTick(callback[, ...args])` {#processnexttickcallback-args}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.7.0, v20.18.0 | Se cambió la estabilidad a Legacy. |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v1.8.1 | Ahora se admiten argumentos adicionales después de `callback`. |
| v0.1.26 | Añadido en: v0.1.26 |
:::

::: info [Estable: 3 - Legacy]
[Estable: 3](/es/nodejs/api/documentation#stability-index) [Estabilidad: 3](/es/nodejs/api/documentation#stability-index) - Legacy: Use [`queueMicrotask()`](/es/nodejs/api/globals#queuemicrotaskcallback) en su lugar.
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Argumentos adicionales para pasar al invocar la `callback`

`process.nextTick()` agrega `callback` a la "cola del próximo ciclo". Esta cola se vacía por completo después de que la operación actual en la pila de JavaScript se ejecuta hasta completarse y antes de que se permita que el bucle de eventos continúe. Es posible crear un bucle infinito si uno llamara recursivamente a `process.nextTick()`. Consulte la guía del [Bucle de Eventos](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick#understanding-processnexttick) para obtener más información.

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

console.log('start');
nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// nextTick callback
```

```js [CJS]
const { nextTick } = require('node:process');

console.log('start');
nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// nextTick callback
```
:::

Esto es importante al desarrollar APIs para dar a los usuarios la oportunidad de asignar controladores de eventos *después* de que un objeto ha sido construido pero antes de que ocurra cualquier E/S:

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

function MyThing(options) {
  this.setupOptions(options);

  nextTick(() => {
    this.startDoingStuff();
  });
}

const thing = new MyThing();
thing.getReadyForStuff();

// thing.startDoingStuff() se llama ahora, no antes.
```

```js [CJS]
const { nextTick } = require('node:process');

function MyThing(options) {
  this.setupOptions(options);

  nextTick(() => {
    this.startDoingStuff();
  });
}

const thing = new MyThing();
thing.getReadyForStuff();

// thing.startDoingStuff() se llama ahora, no antes.
```
:::

Es muy importante que las APIs sean 100% síncronas o 100% asíncronas. Considere este ejemplo:

```js [ESM]
// ¡ADVERTENCIA! ¡NO UTILIZAR! ¡PELIGRO INSEGURO MALO!
function maybeSync(arg, cb) {
  if (arg) {
    cb();
    return;
  }

  fs.stat('file', cb);
}
```
Esta API es peligrosa porque en el siguiente caso:

```js [ESM]
const maybeTrue = Math.random() > 0.5;

maybeSync(maybeTrue, () => {
  foo();
});

bar();
```
No está claro si se llamará primero a `foo()` o a `bar()`.

El siguiente enfoque es mucho mejor:

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

function definitelyAsync(arg, cb) {
  if (arg) {
    nextTick(cb);
    return;
  }

  fs.stat('file', cb);
}
```

```js [CJS]
const { nextTick } = require('node:process');

function definitelyAsync(arg, cb) {
  if (arg) {
    nextTick(cb);
    return;
  }

  fs.stat('file', cb);
}
```
:::


### Cuándo usar `queueMicrotask()` vs. `process.nextTick()` {#when-to-use-queuemicrotask-vs-processnexttick}

La API [`queueMicrotask()`](/es/nodejs/api/globals#queuemicrotaskcallback) es una alternativa a `process.nextTick()` que también aplaza la ejecución de una función usando la misma cola de microtareas que se usa para ejecutar los manejadores then, catch y finally de las promesas resueltas. Dentro de Node.js, cada vez que se vacía la "cola del siguiente ciclo", la cola de microtareas se vacía inmediatamente después.

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

Promise.resolve().then(() => console.log(2));
queueMicrotask(() => console.log(3));
nextTick(() => console.log(1));
// Output:
// 1
// 2
// 3
```

```js [CJS]
const { nextTick } = require('node:process');

Promise.resolve().then(() => console.log(2));
queueMicrotask(() => console.log(3));
nextTick(() => console.log(1));
// Output:
// 1
// 2
// 3
```
:::

Para *la mayoría* de los casos de uso del espacio de usuario, la API `queueMicrotask()` proporciona un mecanismo portátil y confiable para aplazar la ejecución que funciona en múltiples entornos de plataforma JavaScript y debería preferirse a `process.nextTick()`. En escenarios simples, `queueMicrotask()` puede ser un reemplazo directo para `process.nextTick()`.

```js [ESM]
console.log('start');
queueMicrotask(() => {
  console.log('microtask callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// microtask callback
```
Una diferencia notable entre las dos API es que `process.nextTick()` permite especificar valores adicionales que se pasarán como argumentos a la función aplazada cuando se llame. Lograr el mismo resultado con `queueMicrotask()` requiere usar un closure o una función enlazada:

```js [ESM]
function deferred(a, b) {
  console.log('microtask', a + b);
}

console.log('start');
queueMicrotask(deferred.bind(undefined, 1, 2));
console.log('scheduled');
// Output:
// start
// scheduled
// microtask 3
```
Existen diferencias menores en la forma en que se manejan los errores generados dentro de la cola del siguiente ciclo y la cola de microtareas. Los errores lanzados dentro de una devolución de llamada de microtarea en cola deben manejarse dentro de la devolución de llamada en cola cuando sea posible. Si no lo son, el controlador de eventos `process.on('uncaughtException')` se puede usar para capturar y manejar los errores.

En caso de duda, a menos que se necesiten las capacidades específicas de `process.nextTick()`, use `queueMicrotask()`.


## `process.noDeprecation` {#processnodeprecation}

**Agregado en: v0.8.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La propiedad `process.noDeprecation` indica si el indicador `--no-deprecation` está establecido en el proceso Node.js actual. Consulte la documentación para el [`evento 'warning'`](/es/nodejs/api/process#event-warning) y el [`método emitWarning()`](/es/nodejs/api/process#processemitwarningwarning-type-code-ctor) para obtener más información sobre el comportamiento de este indicador.

## `process.permission` {#processpermission}

**Agregado en: v20.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Esta API está disponible a través del indicador [`--permission`](/es/nodejs/api/cli#--permission).

`process.permission` es un objeto cuyos métodos se utilizan para gestionar los permisos para el proceso actual. Documentación adicional está disponible en el [Modelo de Permisos](/es/nodejs/api/permissions#permission-model).

### `process.permission.has(scope[, reference])` {#processpermissionhasscope-reference}

**Agregado en: v20.0.0**

- `scope` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `reference` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Verifica que el proceso pueda acceder al alcance y la referencia dados. Si no se proporciona ninguna referencia, se asume un alcance global, por ejemplo, `process.permission.has('fs.read')` verificará si el proceso tiene TODOS los permisos de lectura del sistema de archivos.

La referencia tiene un significado basado en el alcance proporcionado. Por ejemplo, la referencia cuando el alcance es el Sistema de Archivos significa archivos y carpetas.

Los alcances disponibles son:

- `fs` - Todo el sistema de archivos
- `fs.read` - Operaciones de lectura del sistema de archivos
- `fs.write` - Operaciones de escritura del sistema de archivos
- `child` - Operaciones de generación de procesos secundarios
- `worker` - Operación de generación de hilos de trabajo

```js [ESM]
// Comprueba si el proceso tiene permiso para leer el archivo README
process.permission.has('fs.read', './README.md');
// Comprueba si el proceso tiene operaciones de permiso de lectura
process.permission.has('fs.read');
```


## `process.pid` {#processpid}

**Agregado en: v0.1.15**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La propiedad `process.pid` devuelve el PID del proceso.

::: code-group
```js [ESM]
import { pid } from 'node:process';

console.log(`Este proceso es pid ${pid}`);
```

```js [CJS]
const { pid } = require('node:process');

console.log(`Este proceso es pid ${pid}`);
```
:::

## `process.platform` {#processplatform}

**Agregado en: v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propiedad `process.platform` devuelve una cadena que identifica la plataforma del sistema operativo para la que se compiló el binario de Node.js.

Actualmente, los valores posibles son:

- `'aix'`
- `'darwin'`
- `'freebsd'`
- `'linux'`
- `'openbsd'`
- `'sunos'`
- `'win32'`

::: code-group
```js [ESM]
import { platform } from 'node:process';

console.log(`Esta plataforma es ${platform}`);
```

```js [CJS]
const { platform } = require('node:process');

console.log(`Esta plataforma es ${platform}`);
```
:::

El valor `'android'` también se puede devolver si Node.js está construido en el sistema operativo Android. Sin embargo, el soporte de Android en Node.js [es experimental](https://github.com/nodejs/node/blob/HEAD/BUILDING.md#android).

## `process.ppid` {#processppid}

**Agregado en: v9.2.0, v8.10.0, v6.13.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La propiedad `process.ppid` devuelve el PID del padre del proceso actual.

::: code-group
```js [ESM]
import { ppid } from 'node:process';

console.log(`El proceso padre es pid ${ppid}`);
```

```js [CJS]
const { ppid } = require('node:process');

console.log(`El proceso padre es pid ${ppid}`);
```
:::

## `process.release` {#processrelease}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v4.2.0 | La propiedad `lts` ahora es compatible. |
| v3.0.0 | Agregado en: v3.0.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La propiedad `process.release` devuelve un `Object` que contiene metadatos relacionados con la versión actual, incluidas las URL del archivo tarball de origen y el archivo tarball de solo encabezados.

`process.release` contiene las siguientes propiedades:

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un valor que siempre será `'node'`.
- `sourceUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) una URL absoluta que apunta a un archivo *<code>.tar.gz</code>* que contiene el código fuente de la versión actual.
- `headersUrl`[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) una URL absoluta que apunta a un archivo *<code>.tar.gz</code>* que contiene solo los archivos de encabezado de origen para la versión actual. Este archivo es significativamente más pequeño que el archivo de origen completo y se puede utilizar para compilar complementos nativos de Node.js.
- `libUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) una URL absoluta que apunta a un archivo *<code>node.lib</code>* que coincide con la arquitectura y la versión de la versión actual. Este archivo se utiliza para compilar complementos nativos de Node.js. *Esta propiedad solo está presente en las compilaciones de Windows de Node.js y faltará en todas las demás plataformas.*
- `lts` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) una etiqueta de cadena que identifica la etiqueta [LTS](https://github.com/nodejs/Release) para esta versión. Esta propiedad solo existe para las versiones LTS y es `undefined` para todos los demás tipos de versiones, incluidas las versiones *Current*. Los valores válidos incluyen los nombres en código de la versión LTS (incluidos los que ya no son compatibles).
    - `'Fermium'` para la línea 14.x LTS que comienza con 14.15.0.
    - `'Gallium'` para la línea 16.x LTS que comienza con 16.13.0.
    - `'Hydrogen'` para la línea 18.x LTS que comienza con 18.12.0. Para otros nombres en clave de la versión LTS, consulte [Archivo de registro de cambios de Node.js](https://github.com/nodejs/node/blob/HEAD/doc/changelogs/CHANGELOG_ARCHIVE.md)

```js [ESM]
{
  name: 'node',
  lts: 'Hydrogen',
  sourceUrl: 'https://nodejs.org/download/release/v18.12.0/node-v18.12.0.tar.gz',
  headersUrl: 'https://nodejs.org/download/release/v18.12.0/node-v18.12.0-headers.tar.gz',
  libUrl: 'https://nodejs.org/download/release/v18.12.0/win-x64/node.lib'
}
```
En las compilaciones personalizadas de versiones no publicadas del árbol de origen, solo puede estar presente la propiedad `name`. No se debe confiar en que existan las propiedades adicionales.


## `process.report` {#processreport}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.12.0, v12.17.0 | Esta API ya no es experimental. |
| v11.8.0 | Añadido en: v11.8.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.report` es un objeto cuyos métodos se utilizan para generar informes de diagnóstico para el proceso actual. Documentación adicional está disponible en la [documentación de informes](/es/nodejs/api/report).

### `process.report.compact` {#processreportcompact}

**Añadido en: v13.12.0, v12.17.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Escribe los informes en un formato compacto, JSON de una sola línea, más fácilmente consumible por los sistemas de procesamiento de registros que el formato predeterminado de varias líneas diseñado para el consumo humano.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`¿Los informes son compactos? ${report.compact}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`¿Los informes son compactos? ${report.compact}`);
```
:::

### `process.report.directory` {#processreportdirectory}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.12.0, v12.17.0 | Esta API ya no es experimental. |
| v11.12.0 | Añadido en: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Directorio donde se escribe el informe. El valor predeterminado es la cadena vacía, lo que indica que los informes se escriben en el directorio de trabajo actual del proceso de Node.js.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`El directorio de informes es ${report.directory}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`El directorio de informes es ${report.directory}`);
```
:::

### `process.report.filename` {#processreportfilename}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.12.0, v12.17.0 | Esta API ya no es experimental. |
| v11.12.0 | Añadido en: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Nombre de archivo donde se escribe el informe. Si se establece en la cadena vacía, el nombre del archivo de salida estará compuesto por una marca de tiempo, PID y número de secuencia. El valor predeterminado es la cadena vacía.

Si el valor de `process.report.filename` se establece en `'stdout'` o `'stderr'`, el informe se escribe en el stdout o stderr del proceso respectivamente.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`El nombre de archivo del informe es ${report.filename}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`El nombre de archivo del informe es ${report.filename}`);
```
:::


### `process.report.getReport([err])` {#processreportgetreporterr}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.12.0, v12.17.0 | Esta API ya no es experimental. |
| v11.8.0 | Añadido en: v11.8.0 |
:::

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Un error personalizado utilizado para informar del stack de JavaScript.
- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Devuelve una representación de Objeto JavaScript de un informe de diagnóstico para el proceso en ejecución. El stack trace de JavaScript del informe se toma de `err`, si está presente.

::: code-group
```js [ESM]
import { report } from 'node:process';
import util from 'node:util';

const data = report.getReport();
console.log(data.header.nodejsVersion);

// Similar to process.report.writeReport()
import fs from 'node:fs';
fs.writeFileSync('my-report.log', util.inspect(data), 'utf8');
```

```js [CJS]
const { report } = require('node:process');
const util = require('node:util';

const data = report.getReport();
console.log(data.header.nodejsVersion);

// Similar to process.report.writeReport()
const fs = require('node:fs');
fs.writeFileSync('my-report.log', util.inspect(data), 'utf8');
```
:::

Hay documentación adicional disponible en la [documentación del informe](/es/nodejs/api/report).

### `process.report.reportOnFatalError` {#processreportreportonfatalerror}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0, v14.17.0 | Esta API ya no es experimental. |
| v11.12.0 | Añadido en: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Si es `true`, se genera un informe de diagnóstico sobre errores fatales, como errores de falta de memoria o aserciones fallidas de C++.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Report on fatal error: ${report.reportOnFatalError}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Report on fatal error: ${report.reportOnFatalError}`);
```
:::


### `process.report.reportOnSignal` {#processreportreportonsignal}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.12.0, v12.17.0 | Esta API ya no es experimental. |
| v11.12.0 | Añadido en: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Si es `true`, se genera un informe de diagnóstico cuando el proceso recibe la señal especificada por `process.report.signal`.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Informe sobre la señal: ${report.reportOnSignal}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Informe sobre la señal: ${report.reportOnSignal}`);
```
:::

### `process.report.reportOnUncaughtException` {#processreportreportonuncaughtexception}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.12.0, v12.17.0 | Esta API ya no es experimental. |
| v11.12.0 | Añadido en: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Si es `true`, se genera un informe de diagnóstico sobre la excepción no detectada.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Informe sobre la excepción: ${report.reportOnUncaughtException}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Informe sobre la excepción: ${report.reportOnUncaughtException}`);
```
:::

### `process.report.excludeEnv` {#processreportexcludeenv}

**Añadido en: v23.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Si es `true`, se genera un informe de diagnóstico sin las variables de entorno.

### `process.report.signal` {#processreportsignal}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.12.0, v12.17.0 | Esta API ya no es experimental. |
| v11.12.0 | Añadido en: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La señal utilizada para activar la creación de un informe de diagnóstico. El valor predeterminado es `'SIGUSR2'`.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Señal de informe: ${report.signal}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Señal de informe: ${report.signal}`);
```
:::


### `process.report.writeReport([filename][, err])` {#processreportwritereportfilename-err}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.12.0, v12.17.0 | Esta API ya no es experimental. |
| v11.8.0 | Añadido en: v11.8.0 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre del archivo donde se escribe el informe. Esto debería ser una ruta relativa, que se añadirá al directorio especificado en `process.report.directory`, o el directorio de trabajo actual del proceso Node.js, si no se especifica.
- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Un error personalizado utilizado para informar de la pila de JavaScript.
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Devuelve el nombre del archivo del informe generado.

Escribe un informe de diagnóstico en un archivo. Si no se proporciona `filename`, el nombre de archivo predeterminado incluye la fecha, la hora, el PID y un número de secuencia. El seguimiento de pila de JavaScript del informe se toma de `err`, si está presente.

Si el valor de `filename` se establece en `'stdout'` o `'stderr'`, el informe se escribe en stdout o stderr del proceso respectivamente.

::: code-group
```js [ESM]
import { report } from 'node:process';

report.writeReport();
```

```js [CJS]
const { report } = require('node:process');

report.writeReport();
```
:::

Documentación adicional disponible en la [documentación del informe](/es/nodejs/api/report).

## `process.resourceUsage()` {#processresourceusage}

**Añadido en: v12.6.0**

- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) el uso de recursos para el proceso actual. Todos estos valores provienen de la llamada `uv_getrusage` que devuelve una [`uv_rusage_t` struct](https://docs.libuv.org/en/v1.x/misc#c.uv_rusage_t).
    - `userCPUTime` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) se asigna a `ru_utime` calculado en microsegundos. Es el mismo valor que [`process.cpuUsage().user`](/es/nodejs/api/process#processcpuusagepreviousvalue).
    - `systemCPUTime` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) se asigna a `ru_stime` calculado en microsegundos. Es el mismo valor que [`process.cpuUsage().system`](/es/nodejs/api/process#processcpuusagepreviousvalue).
    - `maxRSS` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) se asigna a `ru_maxrss` que es el tamaño máximo del conjunto residente utilizado en kilobytes.
    - `sharedMemorySize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) se asigna a `ru_ixrss` pero no es compatible con ninguna plataforma.
    - `unsharedDataSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) se asigna a `ru_idrss` pero no es compatible con ninguna plataforma.
    - `unsharedStackSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) se asigna a `ru_isrss` pero no es compatible con ninguna plataforma.
    - `minorPageFault` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) se asigna a `ru_minflt` que es el número de errores de página menores para el proceso, consulte [este artículo para obtener más detalles](https://en.wikipedia.org/wiki/Page_fault#Minor).
    - `majorPageFault` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) se asigna a `ru_majflt` que es el número de errores de página mayores para el proceso, consulte [este artículo para obtener más detalles](https://en.wikipedia.org/wiki/Page_fault#Major). Este campo no es compatible con Windows.
    - `swappedOut` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) se asigna a `ru_nswap` pero no es compatible con ninguna plataforma.
    - `fsRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) se asigna a `ru_inblock` que es el número de veces que el sistema de archivos tuvo que realizar la entrada.
    - `fsWrite` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) se asigna a `ru_oublock` que es el número de veces que el sistema de archivos tuvo que realizar la salida.
    - `ipcSent` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) se asigna a `ru_msgsnd` pero no es compatible con ninguna plataforma.
    - `ipcReceived` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) se asigna a `ru_msgrcv` pero no es compatible con ninguna plataforma.
    - `signalsCount` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) se asigna a `ru_nsignals` pero no es compatible con ninguna plataforma.
    - `voluntaryContextSwitches` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) se asigna a `ru_nvcsw` que es el número de veces que un cambio de contexto de la CPU resultó debido a que un proceso renunció voluntariamente al procesador antes de que se completara su porción de tiempo (generalmente para esperar la disponibilidad de un recurso). Este campo no es compatible con Windows.
    - `involuntaryContextSwitches` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) se asigna a `ru_nivcsw` que es el número de veces que un cambio de contexto de la CPU resultó debido a que un proceso de mayor prioridad se volvió ejecutable o porque el proceso actual excedió su porción de tiempo. Este campo no es compatible con Windows.

::: code-group
```js [ESM]
import { resourceUsage } from 'node:process';

console.log(resourceUsage());
/*
  Will output:
  {
    userCPUTime: 82872,
    systemCPUTime: 4143,
    maxRSS: 33164,
    sharedMemorySize: 0,
    unsharedDataSize: 0,
    unsharedStackSize: 0,
    minorPageFault: 2469,
    majorPageFault: 0,
    swappedOut: 0,
    fsRead: 0,
    fsWrite: 8,
    ipcSent: 0,
    ipcReceived: 0,
    signalsCount: 0,
    voluntaryContextSwitches: 79,
    involuntaryContextSwitches: 1
  }
*/
```

```js [CJS]
const { resourceUsage } = require('node:process');

console.log(resourceUsage());
/*
  Will output:
  {
    userCPUTime: 82872,
    systemCPUTime: 4143,
    maxRSS: 33164,
    sharedMemorySize: 0,
    unsharedDataSize: 0,
    unsharedStackSize: 0,
    minorPageFault: 2469,
    majorPageFault: 0,
    swappedOut: 0,
    fsRead: 0,
    fsWrite: 8,
    ipcSent: 0,
    ipcReceived: 0,
    signalsCount: 0,
    voluntaryContextSwitches: 79,
    involuntaryContextSwitches: 1
  }
*/
```
:::

## `process.send(message[, sendHandle[, options]][, callback])` {#processsendmessage-sendhandle-options-callback}

**Agregado en: v0.5.9**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<net.Server\>](/es/nodejs/api/net#class-netserver) | [\<net.Socket\>](/es/nodejs/api/net#class-netsocket)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) usado para parametrizar el envío de ciertos tipos de manejadores. `options` soporta las siguientes propiedades:
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Un valor que puede ser utilizado cuando se pasan instancias de `net.Socket`. Cuando es `true`, el socket se mantiene abierto en el proceso de envío. **Predeterminado:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Si Node.js es generado con un canal IPC, el método `process.send()` puede ser usado para enviar mensajes al proceso padre. Los mensajes serán recibidos como un evento [`'message'`](/es/nodejs/api/child_process#event-message) en el objeto [`ChildProcess`](/es/nodejs/api/child_process#class-childprocess) del padre.

Si Node.js no fue generado con un canal IPC, `process.send` será `undefined`.

El mensaje pasa por serialización y análisis. El mensaje resultante podría no ser el mismo que el que se envió originalmente.

## `process.setegid(id)` {#processsetegidid}

**Agregado en: v2.0.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un nombre o ID de grupo

El método `process.setegid()` establece la identidad de grupo efectiva del proceso. (Ver [`setegid(2)`](http://man7.org/linux/man-pages/man2/setegid.2).) El `id` puede ser pasado como un ID numérico o un string con el nombre del grupo. Si se especifica un nombre de grupo, este método se bloquea mientras resuelve el ID numérico asociado.



::: code-group
```js [ESM]
import process from 'node:process';

if (process.getegid && process.setegid) {
  console.log(`Current gid: ${process.getegid()}`);
  try {
    process.setegid(501);
    console.log(`New gid: ${process.getegid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getegid && process.setegid) {
  console.log(`Current gid: ${process.getegid()}`);
  try {
    process.setegid(501);
    console.log(`New gid: ${process.getegid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```
:::

Esta función solo está disponible en plataformas POSIX (es decir, no Windows o Android). Esta característica no está disponible en hilos [`Worker`](/es/nodejs/api/worker_threads#class-worker).


## `process.seteuid(id)` {#processseteuidid}

**Agregado en: v2.0.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un nombre de usuario o ID

El método `process.seteuid()` establece la identidad de usuario efectiva del proceso. (Véase [`seteuid(2)`](http://man7.org/linux/man-pages/man2/seteuid.2).) El `id` puede ser pasado como un ID numérico o como una cadena de texto con el nombre de usuario. Si se especifica un nombre de usuario, el método se bloquea mientras resuelve el ID numérico asociado.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.geteuid && process.seteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
  try {
    process.seteuid(501);
    console.log(`New uid: ${process.geteuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.geteuid && process.seteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
  try {
    process.seteuid(501);
    console.log(`New uid: ${process.geteuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```
:::

Esta función solo está disponible en plataformas POSIX (es decir, no en Windows o Android). Esta característica no está disponible en hilos [`Worker`](/es/nodejs/api/worker_threads#class-worker).

## `process.setgid(id)` {#processsetgidid}

**Agregado en: v0.1.31**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El nombre o ID del grupo

El método `process.setgid()` establece la identidad de grupo del proceso. (Véase [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2).) El `id` puede ser pasado como un ID numérico o como una cadena de texto con el nombre del grupo. Si se especifica un nombre de grupo, este método se bloquea mientras resuelve el ID numérico asociado.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgid && process.setgid) {
  console.log(`Current gid: ${process.getgid()}`);
  try {
    process.setgid(501);
    console.log(`New gid: ${process.getgid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getgid && process.setgid) {
  console.log(`Current gid: ${process.getgid()}`);
  try {
    process.setgid(501);
    console.log(`New gid: ${process.getgid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```
:::

Esta función solo está disponible en plataformas POSIX (es decir, no en Windows o Android). Esta característica no está disponible en hilos [`Worker`](/es/nodejs/api/worker_threads#class-worker).


## `process.setgroups(groups)` {#processsetgroupsgroups}

**Agregado en: v0.9.4**

- `groups` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El método `process.setgroups()` establece los IDs de grupo suplementarios para el proceso de Node.js. Esta es una operación privilegiada que requiere que el proceso de Node.js tenga `root` o la capacidad `CAP_SETGID`.

El array `groups` puede contener IDs de grupo numéricos, nombres de grupo o ambos.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgroups && process.setgroups) {
  try {
    process.setgroups([501]);
    console.log(process.getgroups()); // nuevos grupos
  } catch (err) {
    console.error(`Error al establecer los grupos: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getgroups && process.setgroups) {
  try {
    process.setgroups([501]);
    console.log(process.getgroups()); // nuevos grupos
  } catch (err) {
    console.error(`Error al establecer los grupos: ${err}`);
  }
}
```
:::

Esta función solo está disponible en plataformas POSIX (es decir, no Windows o Android). Esta característica no está disponible en hilos [`Worker`](/es/nodejs/api/worker_threads#class-worker).

## `process.setuid(id)` {#processsetuidid}

**Agregado en: v0.1.28**

- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El método `process.setuid(id)` establece la identidad de usuario del proceso. (Ver [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2).) El `id` puede pasarse como un ID numérico o como una cadena de nombre de usuario. Si se especifica un nombre de usuario, el método se bloquea mientras se resuelve el ID numérico asociado.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getuid && process.setuid) {
  console.log(`UID actual: ${process.getuid()}`);
  try {
    process.setuid(501);
    console.log(`Nuevo UID: ${process.getuid()}`);
  } catch (err) {
    console.error(`Error al establecer el UID: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getuid && process.setuid) {
  console.log(`UID actual: ${process.getuid()}`);
  try {
    process.setuid(501);
    console.log(`Nuevo UID: ${process.getuid()}`);
  } catch (err) {
    console.error(`Error al establecer el UID: ${err}`);
  }
}
```
:::

Esta función solo está disponible en plataformas POSIX (es decir, no Windows o Android). Esta característica no está disponible en hilos [`Worker`](/es/nodejs/api/worker_threads#class-worker).


## `process.setSourceMapsEnabled(val)` {#processsetsourcemapsenabledval}

**Agregado en: v16.6.0, v14.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `val` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Esta función habilita o deshabilita el soporte de [Source Map v3](https://sourcemaps.info/spec) para los seguimientos de pila.

Proporciona las mismas características que ejecutar el proceso de Node.js con las opciones de línea de comandos `--enable-source-maps`.

Solo los mapas fuente en archivos JavaScript que se cargan después de que se hayan habilitado los mapas fuente se analizarán y cargarán.

## `process.setUncaughtExceptionCaptureCallback(fn)` {#processsetuncaughtexceptioncapturecallbackfn}

**Agregado en: v9.3.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

La función `process.setUncaughtExceptionCaptureCallback()` establece una función que se invocará cuando ocurra una excepción no capturada, que recibirá el valor de la excepción como su primer argumento.

Si se establece tal función, el evento [`'uncaughtException'`](/es/nodejs/api/process#event-uncaughtexception) no se emitirá. Si `--abort-on-uncaught-exception` se pasó desde la línea de comandos o se estableció a través de [`v8.setFlagsFromString()`](/es/nodejs/api/v8#v8setflagsfromstringflags), el proceso no se abortará. Las acciones configuradas para llevarse a cabo en las excepciones, como las generaciones de informes, también se verán afectadas.

Para anular el establecimiento de la función de captura, se puede utilizar `process.setUncaughtExceptionCaptureCallback(null)`. Llamar a este método con un argumento que no sea `null` mientras se establece otra función de captura arrojará un error.

El uso de esta función es mutuamente excluyente con el uso del módulo incorporado [`domain`](/es/nodejs/api/domain) obsoleto.

## `process.sourceMapsEnabled` {#processsourcemapsenabled}

**Agregado en: v20.7.0, v18.19.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La propiedad `process.sourceMapsEnabled` devuelve si el soporte de [Source Map v3](https://sourcemaps.info/spec) para los seguimientos de pila está habilitado.


## `process.stderr` {#processstderr}

- [\<Stream\>](/es/nodejs/api/stream#stream)

La propiedad `process.stderr` devuelve un flujo conectado a `stderr` (fd `2`). Es un [`net.Socket`](/es/nodejs/api/net#class-netsocket) (que es un flujo [Duplex](/es/nodejs/api/stream#duplex-and-transform-streams)) a menos que fd `2` se refiera a un archivo, en cuyo caso es un flujo [Writable](/es/nodejs/api/stream#writable-streams).

`process.stderr` difiere de otros flujos de Node.js en aspectos importantes. Consulte la [nota sobre E/S de proceso](/es/nodejs/api/process#a-note-on-process-io) para obtener más información.

### `process.stderr.fd` {#processstderrfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Esta propiedad se refiere al valor del descriptor de archivo subyacente de `process.stderr`. El valor está fijado en `2`. En los hilos [`Worker`](/es/nodejs/api/worker_threads#class-worker), este campo no existe.

## `process.stdin` {#processstdin}

- [\<Stream\>](/es/nodejs/api/stream#stream)

La propiedad `process.stdin` devuelve un flujo conectado a `stdin` (fd `0`). Es un [`net.Socket`](/es/nodejs/api/net#class-netsocket) (que es un flujo [Duplex](/es/nodejs/api/stream#duplex-and-transform-streams)) a menos que fd `0` se refiera a un archivo, en cuyo caso es un flujo [Readable](/es/nodejs/api/stream#readable-streams).

Para obtener detalles sobre cómo leer desde `stdin`, consulte [`readable.read()`](/es/nodejs/api/stream#readablereadsize).

Como flujo [Duplex](/es/nodejs/api/stream#duplex-and-transform-streams), `process.stdin` también se puede usar en modo "antiguo" que es compatible con scripts escritos para Node.js anteriores a la versión v0.10. Para obtener más información, consulte [Compatibilidad con versiones anteriores de Node.js](/es/nodejs/api/stream#compatibility-with-older-nodejs-versions).

En el modo de flujos "antiguo", el flujo `stdin` está pausado de forma predeterminada, por lo que se debe llamar a `process.stdin.resume()` para leer desde él. Tenga en cuenta también que llamar a `process.stdin.resume()` en sí mismo cambiaría el flujo al modo "antiguo".

### `process.stdin.fd` {#processstdinfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Esta propiedad se refiere al valor del descriptor de archivo subyacente de `process.stdin`. El valor está fijado en `0`. En los hilos [`Worker`](/es/nodejs/api/worker_threads#class-worker), este campo no existe.


## `process.stdout` {#processstdout}

- [\<Stream\>](/es/nodejs/api/stream#stream)

La propiedad `process.stdout` devuelve un flujo conectado a `stdout` (fd `1`). Es un [`net.Socket`](/es/nodejs/api/net#class-netsocket) (que es un flujo [Duplex](/es/nodejs/api/stream#duplex-and-transform-streams)) a menos que fd `1` se refiera a un archivo, en cuyo caso es un flujo [Writable](/es/nodejs/api/stream#writable-streams).

Por ejemplo, para copiar `process.stdin` a `process.stdout`:

::: code-group
```js [ESM]
import { stdin, stdout } from 'node:process';

stdin.pipe(stdout);
```

```js [CJS]
const { stdin, stdout } = require('node:process');

stdin.pipe(stdout);
```
:::

`process.stdout` difiere de otros flujos de Node.js en aspectos importantes. Consulta [nota sobre E/S de proceso](/es/nodejs/api/process#a-note-on-process-io) para obtener más información.

### `process.stdout.fd` {#processstdoutfd}

- [\<number\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Number_type)

Esta propiedad se refiere al valor del descriptor de archivo subyacente de `process.stdout`. El valor está fijado en `1`. En los hilos [`Worker`](/es/nodejs/api/worker_threads#class-worker), este campo no existe.

### Una nota sobre E/S de proceso {#a-note-on-process-i/o}

`process.stdout` y `process.stderr` difieren de otros flujos de Node.js en aspectos importantes:

Estos comportamientos se deben en parte a razones históricas, ya que cambiarlos crearía incompatibilidad con versiones anteriores, pero también son esperados por algunos usuarios.

Las escrituras síncronas evitan problemas como la salida escrita con `console.log()` o `console.error()` que se entrelaza inesperadamente, o no se escribe en absoluto si se llama a `process.exit()` antes de que se complete una escritura asíncrona. Consulta [`process.exit()`](/es/nodejs/api/process#processexitcode) para obtener más información.

*<strong>Advertencia</strong>*: Las escrituras síncronas bloquean el bucle de eventos hasta que se completa la escritura. Esto puede ser casi instantáneo en el caso de la salida a un archivo, pero bajo una alta carga del sistema, las tuberías que no se leen en el extremo receptor, o con terminales o sistemas de archivos lentos, es posible que el bucle de eventos se bloquee con la suficiente frecuencia y durante el tiempo suficiente para tener graves impactos negativos en el rendimiento. Esto puede no ser un problema cuando se escribe en una sesión de terminal interactiva, pero ten esto especialmente en cuenta cuando realices registros de producción en los flujos de salida del proceso.

Para comprobar si un flujo está conectado a un contexto [TTY](/es/nodejs/api/tty#tty), comprueba la propiedad `isTTY`.

Por ejemplo:

```bash [BASH]
$ node -p "Boolean(process.stdin.isTTY)"
true
$ echo "foo" | node -p "Boolean(process.stdin.isTTY)"
false
$ node -p "Boolean(process.stdout.isTTY)"
true
$ node -p "Boolean(process.stdout.isTTY)" | cat
false
```
Consulta la documentación de [TTY](/es/nodejs/api/tty#tty) para obtener más información.


## `process.throwDeprecation` {#processthrowdeprecation}

**Agregado en: v0.9.12**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

El valor inicial de `process.throwDeprecation` indica si el indicador `--throw-deprecation` está establecido en el proceso actual de Node.js. `process.throwDeprecation` es mutable, por lo que el hecho de que las advertencias de obsolescencia resulten o no en errores puede modificarse en tiempo de ejecución. Consulte la documentación para el [`'warning'` event](/es/nodejs/api/process#event-warning) y el [`emitWarning()` method](/es/nodejs/api/process#processemitwarningwarning-type-code-ctor) para obtener más información.

```bash [BASH]
$ node --throw-deprecation -p "process.throwDeprecation"
true
$ node -p "process.throwDeprecation"
undefined
$ node
> process.emitWarning('test', 'DeprecationWarning');
undefined
> (node:26598) DeprecationWarning: test
> process.throwDeprecation = true;
true
> process.emitWarning('test', 'DeprecationWarning');
Thrown:
[DeprecationWarning: test] { name: 'DeprecationWarning' }
```
## `process.title` {#processtitle}

**Agregado en: v0.1.104**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propiedad `process.title` devuelve el título del proceso actual (es decir, devuelve el valor actual de `ps`). Asignar un nuevo valor a `process.title` modifica el valor actual de `ps`.

Cuando se asigna un nuevo valor, diferentes plataformas impondrán diferentes restricciones de longitud máxima en el título. Por lo general, tales restricciones son bastante limitadas. Por ejemplo, en Linux y macOS, `process.title` está limitado al tamaño del nombre binario más la longitud de los argumentos de la línea de comandos porque establecer `process.title` sobrescribe la memoria `argv` del proceso. Node.js v0.8 permitía cadenas de título de proceso más largas al sobrescribir también la memoria `environ`, pero eso era potencialmente inseguro y confuso en algunos casos (bastante oscuros).

Asignar un valor a `process.title` podría no resultar en una etiqueta precisa dentro de las aplicaciones de administración de procesos como macOS Activity Monitor o Windows Services Manager.


## `process.traceDeprecation` {#processtracedeprecation}

**Agregado en: v0.8.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La propiedad `process.traceDeprecation` indica si el indicador `--trace-deprecation` está establecido en el proceso actual de Node.js. Consulte la documentación para el [`evento 'warning'`](/es/nodejs/api/process#event-warning) y el [`método emitWarning()`](/es/nodejs/api/process#processemitwarningwarning-type-code-ctor) para obtener más información sobre el comportamiento de este indicador.

## `process.umask()` {#processumask}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.0.0, v12.19.0 | Llamar a `process.umask()` sin argumentos está obsoleto. |
| v0.1.19 | Agregado en: v0.1.19 |
:::

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto. Llamar a `process.umask()` sin ningún argumento hace que la máscara umask de todo el proceso se escriba dos veces. Esto introduce una condición de carrera entre los hilos y es una vulnerabilidad de seguridad potencial. No hay ninguna API alternativa segura y multiplataforma.
:::

`process.umask()` devuelve la máscara de creación de modo de archivo del proceso de Node.js. Los procesos hijos heredan la máscara del proceso padre.

## `process.umask(mask)` {#processumaskmask}

**Agregado en: v0.1.19**

- `mask` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.umask(mask)` establece la máscara de creación de modo de archivo del proceso de Node.js. Los procesos hijos heredan la máscara del proceso padre. Devuelve la máscara anterior.



::: code-group
```js [ESM]
import { umask } from 'node:process';

const newmask = 0o022;
const oldmask = umask(newmask);
console.log(
  `Changed umask from ${oldmask.toString(8)} to ${newmask.toString(8)}`,
);
```

```js [CJS]
const { umask } = require('node:process');

const newmask = 0o022;
const oldmask = umask(newmask);
console.log(
  `Changed umask from ${oldmask.toString(8)} to ${newmask.toString(8)}`,
);
```
:::

En los hilos [`Worker`](/es/nodejs/api/worker_threads#class-worker), `process.umask(mask)` lanzará una excepción.


## `process.uptime()` {#processuptime}

**Agregado en: v0.5.0**

- Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

El método `process.uptime()` devuelve el número de segundos que el proceso actual de Node.js ha estado en ejecución.

El valor de retorno incluye fracciones de segundo. Utilice `Math.floor()` para obtener segundos enteros.

## `process.version` {#processversion}

**Agregado en: v0.1.3**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propiedad `process.version` contiene la cadena de versión de Node.js.

::: code-group
```js [ESM]
import { version } from 'node:process';

console.log(`Versión: ${version}`);
// Version: v14.8.0
```

```js [CJS]
const { version } = require('node:process');

console.log(`Versión: ${version}`);
// Version: v14.8.0
```
:::

Para obtener la cadena de versión sin la *v* inicial, utilice `process.versions.node`.

## `process.versions` {#processversions}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.0.0 | La propiedad `v8` ahora incluye un sufijo específico de Node.js. |
| v4.2.0 | Ahora se admite la propiedad `icu`. |
| v0.2.0 | Agregado en: v0.2.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La propiedad `process.versions` devuelve un objeto que enumera las cadenas de versión de Node.js y sus dependencias. `process.versions.modules` indica la versión ABI actual, que aumenta cada vez que cambia una API de C++. Node.js se negará a cargar módulos que se compilaron con una versión ABI de módulo diferente.

::: code-group
```js [ESM]
import { versions } from 'node:process';

console.log(versions);
```

```js [CJS]
const { versions } = require('node:process');

console.log(versions);
```
:::

Generará un objeto similar a:

```bash [BASH]
{ node: '23.0.0',
  acorn: '8.11.3',
  ada: '2.7.8',
  ares: '1.28.1',
  base64: '0.5.2',
  brotli: '1.1.0',
  cjs_module_lexer: '1.2.2',
  cldr: '45.0',
  icu: '75.1',
  llhttp: '9.2.1',
  modules: '127',
  napi: '9',
  nghttp2: '1.61.0',
  nghttp3: '0.7.0',
  ngtcp2: '1.3.0',
  openssl: '3.0.13+quic',
  simdjson: '3.8.0',
  simdutf: '5.2.4',
  sqlite: '3.46.0',
  tz: '2024a',
  undici: '6.13.0',
  unicode: '15.1',
  uv: '1.48.0',
  uvwasi: '0.0.20',
  v8: '12.4.254.14-node.11',
  zlib: '1.3.0.1-motley-7d77fb7' }
```


## Códigos de salida {#exit-codes}

Node.js normalmente saldrá con un código de estado `0` cuando no haya más operaciones asíncronas pendientes. Los siguientes códigos de estado se utilizan en otros casos:

- `1` **Excepción Fatal No Capturada**: Hubo una excepción no capturada, y no fue manejada por un dominio o un controlador de eventos [`'uncaughtException'`](/es/nodejs/api/process#event-uncaughtexception).
- `2`: Sin usar (reservado por Bash para uso indebido incorporado)
- `3` **Error Interno de Análisis de JavaScript**: El código fuente de JavaScript interno en el proceso de bootstrapping de Node.js causó un error de análisis. Esto es extremadamente raro, y generalmente solo puede suceder durante el desarrollo del propio Node.js.
- `4` **Fallo Interno de Evaluación de JavaScript**: El código fuente de JavaScript interno en el proceso de bootstrapping de Node.js no devolvió un valor de función cuando se evaluó. Esto es extremadamente raro, y generalmente solo puede suceder durante el desarrollo del propio Node.js.
- `5` **Error Fatal**: Hubo un error fatal irrecuperable en V8. Normalmente se imprimirá un mensaje en stderr con el prefijo `FATAL ERROR`.
- `6` **Manejador Interno de Excepciones No Funcional**: Hubo una excepción no capturada, pero la función interna de manejo de excepciones fatales de alguna manera se estableció como no funcional, y no pudo ser llamada.
- `7` **Fallo en Tiempo de Ejecución del Manejador Interno de Excepciones**: Hubo una excepción no capturada, y la propia función interna de manejo de excepciones fatales lanzó un error al intentar manejarla. Esto puede suceder, por ejemplo, si un controlador [`'uncaughtException'`](/es/nodejs/api/process#event-uncaughtexception) o `domain.on('error')` lanza un error.
- `8`: Sin usar. En versiones anteriores de Node.js, el código de salida 8 a veces indicaba una excepción no capturada.
- `9` **Argumento No Válido**: Se especificó una opción desconocida, o se proporcionó una opción que requería un valor sin un valor.
- `10` **Fallo Interno en Tiempo de Ejecución de JavaScript**: El código fuente de JavaScript interno en el proceso de bootstrapping de Node.js lanzó un error cuando se llamó a la función de bootstrapping. Esto es extremadamente raro, y generalmente solo puede suceder durante el desarrollo del propio Node.js.
- `12` **Argumento de Depuración No Válido**: Las opciones `--inspect` y/o `--inspect-brk` se establecieron, pero el número de puerto elegido no era válido o no estaba disponible.
- `13` **Await de Nivel Superior No Resuelto**: `await` se usó fuera de una función en el código de nivel superior, pero la `Promise` pasada nunca se resolvió.
- `14` **Fallo de Instantánea**: Node.js se inició para construir una instantánea de inicio de V8 y falló porque no se cumplieron ciertos requisitos del estado de la aplicación.
- `\>128` **Salidas de Señal**: Si Node.js recibe una señal fatal como `SIGKILL` o `SIGHUP`, entonces su código de salida será `128` más el valor del código de la señal. Esta es una práctica estándar de POSIX, ya que los códigos de salida se definen como enteros de 7 bits, y las salidas de señal establecen el bit de orden superior, y luego contienen el valor del código de la señal. Por ejemplo, la señal `SIGABRT` tiene el valor `6`, por lo que el código de salida esperado será `128` + `6`, o `134`.

