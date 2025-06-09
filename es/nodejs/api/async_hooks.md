---
title: Documentación de Node.js - Hooks Asíncronos
description: Explora la API de Hooks Asíncronos en Node.js, que proporciona una manera de rastrear la vida útil de los recursos asíncronos en aplicaciones Node.js.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - Hooks Asíncronos | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Explora la API de Hooks Asíncronos en Node.js, que proporciona una manera de rastrear la vida útil de los recursos asíncronos en aplicaciones Node.js.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - Hooks Asíncronos | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Explora la API de Hooks Asíncronos en Node.js, que proporciona una manera de rastrear la vida útil de los recursos asíncronos en aplicaciones Node.js.
---


# Async hooks {#async-hooks}

::: warning [Stable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental. Por favor, migre fuera de esta API, si puede. No recomendamos el uso de las API [`createHook`](/es/nodejs/api/async_hooks#async_hookscreatehookcallbacks), [`AsyncHook`](/es/nodejs/api/async_hooks#class-asynchook) y [`executionAsyncResource`](/es/nodejs/api/async_hooks#async_hooksexecutionasyncresource) ya que tienen problemas de usabilidad, riesgos de seguridad e implicaciones de rendimiento. Los casos de uso de seguimiento del contexto asíncrono se gestionan mejor con la API estable [`AsyncLocalStorage`](/es/nodejs/api/async_context#class-asynclocalstorage). Si tiene un caso de uso para `createHook`, `AsyncHook` o `executionAsyncResource` más allá de la necesidad de seguimiento del contexto resuelta por [`AsyncLocalStorage`](/es/nodejs/api/async_context#class-asynclocalstorage) o los datos de diagnóstico proporcionados actualmente por [Canal de diagnóstico](/es/nodejs/api/diagnostics_channel), abra un problema en [https://github.com/nodejs/node/issues](https://github.com/nodejs/node/issues) describiendo su caso de uso para que podamos crear una API más centrada en el propósito.
:::

**Código fuente:** [lib/async_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/async_hooks.js)

Desaconsejamos encarecidamente el uso de la API `async_hooks`. Otras API que pueden cubrir la mayoría de sus casos de uso incluyen:

- [`AsyncLocalStorage`](/es/nodejs/api/async_context#class-asynclocalstorage) rastrea el contexto asíncrono
- [`process.getActiveResourcesInfo()`](/es/nodejs/api/process#processgetactiveresourcesinfo) rastrea los recursos activos

El módulo `node:async_hooks` proporciona una API para rastrear recursos asíncronos. Se puede acceder a él usando:

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';
```

```js [CJS]
const async_hooks = require('node:async_hooks');
```
:::

## Terminología {#terminology}

Un recurso asíncrono representa un objeto con una devolución de llamada asociada. Esta devolución de llamada se puede llamar varias veces, como el evento `'connection'` en `net.createServer()`, o solo una vez como en `fs.open()`. Un recurso también se puede cerrar antes de que se llame a la devolución de llamada. `AsyncHook` no distingue explícitamente entre estos diferentes casos, sino que los representará como el concepto abstracto que es un recurso.

Si se utilizan [`Worker`](/es/nodejs/api/worker_threads#class-worker)s, cada hilo tiene una interfaz `async_hooks` independiente, y cada hilo utilizará un nuevo conjunto de ID asíncronos.


## Visión general {#overview}

A continuación se muestra una descripción general simple de la API pública.



::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';

// Return the ID of the current execution context.
const eid = async_hooks.executionAsyncId();

// Return the ID of the handle responsible for triggering the callback of the
// current execution scope to call.
const tid = async_hooks.triggerAsyncId();

// Create a new AsyncHook instance. All of these callbacks are optional.
const asyncHook =
    async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// Allow callbacks of this AsyncHook instance to call. This is not an implicit
// action after running the constructor, and must be explicitly run to begin
// executing callbacks.
asyncHook.enable();

// Disable listening for new asynchronous events.
asyncHook.disable();

//
// The following are the callbacks that can be passed to createHook().
//

// init() is called during object construction. The resource may not have
// completed construction when this callback runs. Therefore, all fields of the
// resource referenced by "asyncId" may not have been populated.
function init(asyncId, type, triggerAsyncId, resource) { }

// before() is called just before the resource's callback is called. It can be
// called 0-N times for handles (such as TCPWrap), and will be called exactly 1
// time for requests (such as FSReqCallback).
function before(asyncId) { }

// after() is called just after the resource's callback has finished.
function after(asyncId) { }

// destroy() is called when the resource is destroyed.
function destroy(asyncId) { }

// promiseResolve() is called only for promise resources, when the
// resolve() function passed to the Promise constructor is invoked
// (either directly or through other means of resolving a promise).
function promiseResolve(asyncId) { }
```

```js [CJS]
const async_hooks = require('node:async_hooks');

// Return the ID of the current execution context.
const eid = async_hooks.executionAsyncId();

// Return the ID of the handle responsible for triggering the callback of the
// current execution scope to call.
const tid = async_hooks.triggerAsyncId();

// Create a new AsyncHook instance. All of these callbacks are optional.
const asyncHook =
    async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// Allow callbacks of this AsyncHook instance to call. This is not an implicit
// action after running the constructor, and must be explicitly run to begin
// executing callbacks.
asyncHook.enable();

// Disable listening for new asynchronous events.
asyncHook.disable();

//
// The following are the callbacks that can be passed to createHook().
//

// init() is called during object construction. The resource may not have
// completed construction when this callback runs. Therefore, all fields of the
// resource referenced by "asyncId" may not have been populated.
function init(asyncId, type, triggerAsyncId, resource) { }

// before() is called just before the resource's callback is called. It can be
// called 0-N times for handles (such as TCPWrap), and will be called exactly 1
// time for requests (such as FSReqCallback).
function before(asyncId) { }

// after() is called just after the resource's callback has finished.
function after(asyncId) { }

// destroy() is called when the resource is destroyed.
function destroy(asyncId) { }

// promiseResolve() is called only for promise resources, when the
// resolve() function passed to the Promise constructor is invoked
// (either directly or through other means of resolving a promise).
function promiseResolve(asyncId) { }
```
:::


## `async_hooks.createHook(callbacks)` {#async_hookscreatehookcallbacks}

**Agregado en: v8.1.0**

- `callbacks` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Los [Callbacks del Hook](/es/nodejs/api/async_hooks#hook-callbacks) para registrar
    - `init` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) El [`callback init`](/es/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource).
    - `before` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) El [`callback before`](/es/nodejs/api/async_hooks#beforeasyncid).
    - `after` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) El [`callback after`](/es/nodejs/api/async_hooks#afterasyncid).
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) El [`callback destroy`](/es/nodejs/api/async_hooks#destroyasyncid).
    - `promiseResolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) El [`callback promiseResolve`](/es/nodejs/api/async_hooks#promiseresolveasyncid).
  
 
- Devuelve: [\<AsyncHook\>](/es/nodejs/api/async_hooks#async_hookscreatehookcallbacks) Instancia utilizada para deshabilitar y habilitar hooks

Registra funciones para ser llamadas para diferentes eventos del ciclo de vida de cada operación asíncrona.

Los callbacks `init()`/`before()`/`after()`/`destroy()` son llamados para el respectivo evento asíncrono durante el ciclo de vida de un recurso.

Todos los callbacks son opcionales. Por ejemplo, si solo es necesario rastrear la limpieza de recursos, entonces solo es necesario pasar el callback `destroy`. Los detalles de todas las funciones que se pueden pasar a `callbacks` están en la sección [Callbacks del Hook](/es/nodejs/api/async_hooks#hook-callbacks).



::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';

const asyncHook = createHook({
  init(asyncId, type, triggerAsyncId, resource) { },
  destroy(asyncId) { },
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');

const asyncHook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) { },
  destroy(asyncId) { },
});
```
:::

Los callbacks serán heredados a través de la cadena de prototipos:

```js [ESM]
class MyAsyncCallbacks {
  init(asyncId, type, triggerAsyncId, resource) { }
  destroy(asyncId) {}
}

class MyAddedCallbacks extends MyAsyncCallbacks {
  before(asyncId) { }
  after(asyncId) { }
}

const asyncHook = async_hooks.createHook(new MyAddedCallbacks());
```
Debido a que las promesas son recursos asíncronos cuyo ciclo de vida se rastrea a través del mecanismo de async hooks, los callbacks `init()`, `before()`, `after()` y `destroy()` *no deben* ser funciones asíncronas que devuelvan promesas.


### Manejo de errores {#error-handling}

Si alguna devolución de llamada de `AsyncHook` lanza un error, la aplicación imprimirá el seguimiento de la pila y se cerrará. La ruta de salida sigue la de una excepción no capturada, pero todos los listeners de `'uncaughtException'` se eliminan, lo que obliga al proceso a cerrarse. Las devoluciones de llamada de `'exit'` seguirán siendo llamadas a menos que la aplicación se ejecute con `--abort-on-uncaught-exception`, en cuyo caso se imprimirá un seguimiento de la pila y la aplicación se cerrará, dejando un archivo central.

La razón de este comportamiento de manejo de errores es que estas devoluciones de llamada se ejecutan en puntos potencialmente volátiles en la vida útil de un objeto, por ejemplo, durante la construcción y destrucción de la clase. Debido a esto, se considera necesario cerrar el proceso rápidamente para evitar una interrupción involuntaria en el futuro. Esto está sujeto a cambios en el futuro si se realiza un análisis exhaustivo para garantizar que una excepción pueda seguir el flujo de control normal sin efectos secundarios involuntarios.

### Imprimir en devoluciones de llamada de `AsyncHook` {#printing-in-asynchook-callbacks}

Debido a que imprimir en la consola es una operación asíncrona, `console.log()` hará que se llamen las devoluciones de llamada de `AsyncHook`. El uso de `console.log()` o operaciones asíncronas similares dentro de una función de devolución de llamada de `AsyncHook` provocará una recursión infinita. Una solución fácil para esto al depurar es usar una operación de registro síncrona como `fs.writeFileSync(file, msg, flag)`. Esto imprimirá en el archivo y no invocará `AsyncHook` recursivamente porque es síncrono.

::: code-group
```js [ESM]
import { writeFileSync } from 'node:fs';
import { format } from 'node:util';

function debug(...args) {
  // Use a function like this one when debugging inside an AsyncHook callback
  writeFileSync('log.out', `${format(...args)}\n`, { flag: 'a' });
}
```

```js [CJS]
const fs = require('node:fs');
const util = require('node:util');

function debug(...args) {
  // Use a function like this one when debugging inside an AsyncHook callback
  fs.writeFileSync('log.out', `${util.format(...args)}\n`, { flag: 'a' });
}
```
:::

Si se necesita una operación asíncrona para el registro, es posible realizar un seguimiento de lo que causó la operación asíncrona utilizando la información proporcionada por el propio `AsyncHook`. El registro debe omitirse cuando fue el propio registro el que provocó que se llamara a la devolución de llamada `AsyncHook`. Al hacer esto, se rompe la recursión infinita.


## Clase: `AsyncHook` {#class-asynchook}

La clase `AsyncHook` expone una interfaz para rastrear eventos del ciclo de vida de las operaciones asíncronas.

### `asyncHook.enable()` {#asynchookenable}

- Devuelve: [\<AsyncHook\>](/es/nodejs/api/async_hooks#async_hookscreatehookcallbacks) Una referencia a `asyncHook`.

Habilita las devoluciones de llamada para una instancia dada de `AsyncHook`. Si no se proporcionan devoluciones de llamada, habilitar es una operación nula.

La instancia de `AsyncHook` está deshabilitada por defecto. Si la instancia de `AsyncHook` debe habilitarse inmediatamente después de la creación, se puede utilizar el siguiente patrón.

::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';

const hook = createHook(callbacks).enable();
```

```js [CJS]
const async_hooks = require('node:async_hooks');

const hook = async_hooks.createHook(callbacks).enable();
```
:::

### `asyncHook.disable()` {#asynchookdisable}

- Devuelve: [\<AsyncHook\>](/es/nodejs/api/async_hooks#async_hookscreatehookcallbacks) Una referencia a `asyncHook`.

Deshabilita las devoluciones de llamada para una instancia dada de `AsyncHook` del grupo global de devoluciones de llamada de `AsyncHook` que se ejecutarán. Una vez que un hook ha sido deshabilitado, no se volverá a llamar hasta que se habilite.

Para la coherencia de la API, `disable()` también devuelve la instancia de `AsyncHook`.

### Devoluciones de llamada del Hook {#hook-callbacks}

Los eventos clave en el ciclo de vida de los eventos asíncronos se han clasificado en cuatro áreas: instanciación, antes/después de que se llame a la devolución de llamada y cuando se destruye la instancia.

#### `init(asyncId, type, triggerAsyncId, resource)` {#initasyncid-type-triggerasyncid-resource}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un ID único para el recurso asíncrono.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El tipo del recurso asíncrono.
- `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El ID único del recurso asíncrono en cuyo contexto de ejecución se creó este recurso asíncrono.
- `resource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Referencia al recurso que representa la operación asíncrona, debe liberarse durante *destroy*.

Se llama cuando se construye una clase que tiene la *posibilidad* de emitir un evento asíncrono. Esto *no* significa que la instancia deba llamar a `before`/`after` antes de que se llame a `destroy`, solo que existe la posibilidad.

Este comportamiento se puede observar haciendo algo como abrir un recurso y luego cerrarlo antes de que se pueda usar el recurso. El siguiente fragmento demuestra esto.

::: code-group
```js [ESM]
import { createServer } from 'node:net';

createServer().listen(function() { this.close(); });
// OR
clearTimeout(setTimeout(() => {}, 10));
```

```js [CJS]
require('node:net').createServer().listen(function() { this.close(); });
// OR
clearTimeout(setTimeout(() => {}, 10));
```
:::

A cada nuevo recurso se le asigna un ID que es único dentro del alcance de la instancia actual de Node.js.


##### `type` {#type}

El `type` es una cadena que identifica el tipo de recurso que provocó la llamada a `init`. Generalmente, corresponderá al nombre del constructor del recurso.

El `type` de los recursos creados por el propio Node.js puede cambiar en cualquier versión de Node.js. Los valores válidos incluyen `TLSWRAP`, `TCPWRAP`, `TCPSERVERWRAP`, `GETADDRINFOREQWRAP`, `FSREQCALLBACK`, `Microtask` y `Timeout`. Inspeccione el código fuente de la versión de Node.js utilizada para obtener la lista completa.

Además, los usuarios de [`AsyncResource`](/es/nodejs/api/async_context#class-asyncresource) crean recursos asíncronos independientemente del propio Node.js.

También existe el tipo de recurso `PROMISE`, que se utiliza para rastrear las instancias de `Promise` y el trabajo asíncrono programado por ellas.

Los usuarios pueden definir su propio `type` cuando utilizan la API pública de inserción.

Es posible que haya colisiones de nombres de tipo. Se anima a los integradores a utilizar prefijos únicos, como el nombre del paquete npm, para evitar colisiones al escuchar los hooks.

##### `triggerAsyncId` {#triggerasyncid}

`triggerAsyncId` es el `asyncId` del recurso que provocó (o "desencadenó") la inicialización del nuevo recurso y que provocó la llamada a `init`. Esto es diferente de `async_hooks.executionAsyncId()` que solo muestra *cuándo* se creó un recurso, mientras que `triggerAsyncId` muestra *por qué* se creó un recurso.

La siguiente es una demostración simple de `triggerAsyncId`:

::: code-group
```js [ESM]
import { createHook, executionAsyncId } from 'node:async_hooks';
import { stdout } from 'node:process';
import net from 'node:net';
import fs from 'node:fs';

createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = executionAsyncId();
    fs.writeSync(
      stdout.fd,
      `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
}).enable();

net.createServer((conn) => {}).listen(8080);
```

```js [CJS]
const { createHook, executionAsyncId } = require('node:async_hooks');
const { stdout } = require('node:process');
const net = require('node:net');
const fs = require('node:fs');

createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = executionAsyncId();
    fs.writeSync(
      stdout.fd,
      `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
}).enable();

net.createServer((conn) => {}).listen(8080);
```
:::

Salida al golpear el servidor con `nc localhost 8080`:

```bash [BASH]
TCPSERVERWRAP(5): trigger: 1 execution: 1
TCPWRAP(7): trigger: 5 execution: 0
```
El `TCPSERVERWRAP` es el servidor que recibe las conexiones.

El `TCPWRAP` es la nueva conexión del cliente. Cuando se realiza una nueva conexión, la instancia `TCPWrap` se construye inmediatamente. Esto sucede fuera de cualquier pila de JavaScript. (Un `executionAsyncId()` de `0` significa que se está ejecutando desde C++ sin ninguna pila de JavaScript por encima). Con solo esa información, sería imposible vincular los recursos en términos de lo que causó su creación, por lo que a `triggerAsyncId` se le da la tarea de propagar qué recurso es responsable de la existencia del nuevo recurso.


##### `resource` {#resource}

`resource` es un objeto que representa el recurso asíncrono real que se ha inicializado. La API para acceder al objeto puede ser especificada por el creador del recurso. Los recursos creados por Node.js en sí mismos son internos y pueden cambiar en cualquier momento. Por lo tanto, no se especifica ninguna API para estos.

En algunos casos, el objeto de recurso se reutiliza por razones de rendimiento, por lo que no es seguro usarlo como clave en un `WeakMap` o agregarle propiedades.

##### Ejemplo de contexto asíncrono {#asynchronous-context-example}

El caso de uso del seguimiento del contexto está cubierto por la API estable [`AsyncLocalStorage`](/es/nodejs/api/async_context#class-asynclocalstorage). Este ejemplo solo ilustra el funcionamiento de los hooks asíncronos, pero [`AsyncLocalStorage`](/es/nodejs/api/async_context#class-asynclocalstorage) se adapta mejor a este caso de uso.

El siguiente es un ejemplo con información adicional sobre las llamadas a `init` entre las llamadas `before` y `after`, específicamente cómo se verá la función de retorno de llamada a `listen()`. El formato de salida es ligeramente más elaborado para que el contexto de llamada sea más fácil de ver.

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';
import fs from 'node:fs';
import net from 'node:net';
import { stdout } from 'node:process';
const { fd } = stdout;

let indent = 0;
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    const indentStr = ' '.repeat(indent);
    fs.writeSync(
      fd,
      `${indentStr}${type}(${asyncId}):` +
      ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
  before(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}before:  ${asyncId}\n`);
    indent += 2;
  },
  after(asyncId) {
    indent -= 2;
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}after:  ${asyncId}\n`);
  },
  destroy(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}destroy:  ${asyncId}\n`);
  },
}).enable();

net.createServer(() => {}).listen(8080, () => {
  // Let's wait 10ms before logging the server started.
  setTimeout(() => {
    console.log('>>>', async_hooks.executionAsyncId());
  }, 10);
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');
const fs = require('node:fs');
const net = require('node:net');
const { fd } = process.stdout;

let indent = 0;
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    const indentStr = ' '.repeat(indent);
    fs.writeSync(
      fd,
      `${indentStr}${type}(${asyncId}):` +
      ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
  before(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}before:  ${asyncId}\n`);
    indent += 2;
  },
  after(asyncId) {
    indent -= 2;
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}after:  ${asyncId}\n`);
  },
  destroy(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}destroy:  ${asyncId}\n`);
  },
}).enable();

net.createServer(() => {}).listen(8080, () => {
  // Let's wait 10ms before logging the server started.
  setTimeout(() => {
    console.log('>>>', async_hooks.executionAsyncId());
  }, 10);
});
```
:::

Salida al solo iniciar el servidor:

```bash [BASH]
TCPSERVERWRAP(5): trigger: 1 execution: 1
TickObject(6): trigger: 5 execution: 1
before:  6
  Timeout(7): trigger: 6 execution: 6
after:   6
destroy: 6
before:  7
>>> 7
  TickObject(8): trigger: 7 execution: 7
after:   7
before:  8
after:   8
```
Como se ilustra en el ejemplo, `executionAsyncId()` y `execution` especifican cada uno el valor del contexto de ejecución actual; que está delineado por las llamadas a `before` y `after`.

Usar solo `execution` para graficar los resultados de la asignación de recursos da como resultado lo siguiente:

```bash [BASH]
  root(1)
     ^
     |
TickObject(6)
     ^
     |
 Timeout(7)
```
El `TCPSERVERWRAP` no es parte de este gráfico, aunque fue la razón por la que se llamó a `console.log()`. Esto se debe a que vincularse a un puerto sin un nombre de host es una operación *síncrona*, pero para mantener una API completamente asíncrona, la función de retorno de llamada del usuario se coloca en un `process.nextTick()`. Por eso `TickObject` está presente en la salida y es un 'padre' para la función de retorno de llamada `.listen()`.

El gráfico solo muestra *cuándo* se creó un recurso, no *por qué*, por lo que para rastrear el *por qué* use `triggerAsyncId`. Que se puede representar con el siguiente gráfico:

```bash [BASH]
 bootstrap(1)
     |
     ˅
TCPSERVERWRAP(5)
     |
     ˅
 TickObject(6)
     |
     ˅
  Timeout(7)
```

#### `before(asyncId)` {#beforeasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Cuando una operación asíncrona se inicia (como un servidor TCP recibiendo una nueva conexión) o se completa (como escribir datos en el disco) se llama a una función callback para notificar al usuario. La función callback `before` se llama justo antes de que dicha función callback sea ejecutada. `asyncId` es el identificador único asignado al recurso que está a punto de ejecutar la función callback.

La función callback `before` será llamada de 0 a N veces. La función callback `before` será llamada típicamente 0 veces si la operación asíncrona fue cancelada o, por ejemplo, si no se reciben conexiones por un servidor TCP. Los recursos asíncronos persistentes como un servidor TCP típicamente llamarán a la función callback `before` múltiples veces, mientras que otras operaciones como `fs.open()` la llamarán solo una vez.

#### `after(asyncId)` {#afterasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Llamada inmediatamente después de que la función callback especificada en `before` se completa.

Si una excepción no capturada ocurre durante la ejecución de la función callback, entonces `after` se ejecutará *después* de que el evento `'uncaughtException'` se emita o un controlador de `domain` se ejecute.

#### `destroy(asyncId)` {#destroyasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Llamada después de que el recurso correspondiente a `asyncId` sea destruido. También es llamada asíncronamente desde la API de incrustación `emitDestroy()`.

Algunos recursos dependen de la recolección de basura para la limpieza, por lo que si se hace una referencia al objeto `resource` pasado a `init` es posible que `destroy` nunca se llame, causando una fuga de memoria en la aplicación. Si el recurso no depende de la recolección de basura, entonces esto no será un problema.

El uso del hook destroy resulta en una sobrecarga adicional porque permite el seguimiento de las instancias de `Promise` a través del recolector de basura.

#### `promiseResolve(asyncId)` {#promiseresolveasyncid}

**Agregado en: v8.6.0**

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Llamada cuando la función `resolve` pasada al constructor `Promise` es invocada (ya sea directamente o a través de otros medios para resolver una promesa).

`resolve()` no realiza ningún trabajo síncrono observable.

La `Promise` no está necesariamente cumplida o rechazada en este punto si la `Promise` fue resuelta asumiendo el estado de otra `Promise`.

```js [ESM]
new Promise((resolve) => resolve(true)).then((a) => {});
```
llama a las siguientes funciones callback:

```text [TEXT]
init para PROMISE con id 5, id del disparador: 1
  resolución de promesa 5      # corresponde a resolve(true)
init para PROMISE con id 6, id del disparador: 5  # la Promise regresada por then()
  before 6               # se ingresa a la función callback then()
  resolución de promesa 6      # la función callback then() resuelve la promesa al regresar
  after 6
```

### `async_hooks.executionAsyncResource()` {#async_hooksexecutionasyncresource}

**Añadido en: v13.9.0, v12.17.0**

- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El recurso que representa la ejecución actual. Útil para almacenar datos dentro del recurso.

Los objetos de recurso devueltos por `executionAsyncResource()` son, con mayor frecuencia, objetos de controlador internos de Node.js con API no documentadas. El uso de cualquier función o propiedad en el objeto probablemente bloqueará su aplicación y debe evitarse.

Usar `executionAsyncResource()` en el contexto de ejecución de nivel superior devolverá un objeto vacío ya que no hay ningún objeto de controlador o solicitud para usar, pero tener un objeto que represente el nivel superior puede ser útil.

::: code-group
```js [ESM]
import { open } from 'node:fs';
import { executionAsyncId, executionAsyncResource } from 'node:async_hooks';

console.log(executionAsyncId(), executionAsyncResource());  // 1 {}
open(new URL(import.meta.url), 'r', (err, fd) => {
  console.log(executionAsyncId(), executionAsyncResource());  // 7 FSReqWrap
});
```

```js [CJS]
const { open } = require('node:fs');
const { executionAsyncId, executionAsyncResource } = require('node:async_hooks');

console.log(executionAsyncId(), executionAsyncResource());  // 1 {}
open(__filename, 'r', (err, fd) => {
  console.log(executionAsyncId(), executionAsyncResource());  // 7 FSReqWrap
});
```
:::

Esto se puede usar para implementar el almacenamiento local de continuación sin el uso de un `Map` de seguimiento para almacenar los metadatos:

::: code-group
```js [ESM]
import { createServer } from 'node:http';
import {
  executionAsyncId,
  executionAsyncResource,
  createHook,
} from 'node:async_hooks';
const sym = Symbol('state'); // Símbolo privado para evitar la contaminación

createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = executionAsyncResource();
    if (cr) {
      resource[sym] = cr[sym];
    }
  },
}).enable();

const server = createServer((req, res) => {
  executionAsyncResource()[sym] = { state: req.url };
  setTimeout(function() {
    res.end(JSON.stringify(executionAsyncResource()[sym]));
  }, 100);
}).listen(3000);
```

```js [CJS]
const { createServer } = require('node:http');
const {
  executionAsyncId,
  executionAsyncResource,
  createHook,
} = require('node:async_hooks');
const sym = Symbol('state'); // Símbolo privado para evitar la contaminación

createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = executionAsyncResource();
    if (cr) {
      resource[sym] = cr[sym];
    }
  },
}).enable();

const server = createServer((req, res) => {
  executionAsyncResource()[sym] = { state: req.url };
  setTimeout(function() {
    res.end(JSON.stringify(executionAsyncResource()[sym]));
  }, 100);
}).listen(3000);
```
:::


### `async_hooks.executionAsyncId()` {#async_hooksexecutionasyncid}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v8.2.0 | Se renombró de `currentId`. |
| v8.1.0 | Añadido en: v8.1.0 |
:::

- Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El `asyncId` del contexto de ejecución actual. Útil para rastrear cuándo algo llama.



::: code-group
```js [ESM]
import { executionAsyncId } from 'node:async_hooks';
import fs from 'node:fs';

console.log(executionAsyncId());  // 1 - bootstrap
const path = '.';
fs.open(path, 'r', (err, fd) => {
  console.log(executionAsyncId());  // 6 - open()
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');
const fs = require('node:fs');

console.log(async_hooks.executionAsyncId());  // 1 - bootstrap
const path = '.';
fs.open(path, 'r', (err, fd) => {
  console.log(async_hooks.executionAsyncId());  // 6 - open()
});
```
:::

El ID devuelto por `executionAsyncId()` está relacionado con el tiempo de ejecución, no con la causalidad (que está cubierta por `triggerAsyncId()`):

```js [ESM]
const server = net.createServer((conn) => {
  // Devuelve el ID del servidor, no de la nueva conexión, porque el
  // callback se ejecuta en el ámbito de ejecución de MakeCallback() del servidor.
  async_hooks.executionAsyncId();

}).listen(port, () => {
  // Devuelve el ID de un TickObject (process.nextTick()) porque todos los
  // callbacks pasados a .listen() están envueltos en un nextTick().
  async_hooks.executionAsyncId();
});
```
Es posible que los contextos de Promise no obtengan `executionAsyncIds` precisos de forma predeterminada. Consulte la sección sobre [seguimiento de la ejecución de promesas](/es/nodejs/api/async_hooks#promise-execution-tracking).

### `async_hooks.triggerAsyncId()` {#async_hookstriggerasyncid}

- Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El ID del recurso responsable de llamar al callback que se está ejecutando actualmente.

```js [ESM]
const server = net.createServer((conn) => {
  // El recurso que causó (o desencadenó) la llamada a este callback
  // fue el de la nueva conexión. Por lo tanto, el valor de retorno de triggerAsyncId()
  // es el asyncId de "conn".
  async_hooks.triggerAsyncId();

}).listen(port, () => {
  // Aunque todos los callbacks pasados a .listen() están envueltos en un nextTick()
  // el callback en sí existe porque se realizó la llamada a .listen() del servidor.
  // Por lo tanto, el valor de retorno sería el ID del servidor.
  async_hooks.triggerAsyncId();
});
```
Es posible que los contextos de Promise no obtengan `triggerAsyncId`s válidos de forma predeterminada. Consulte la sección sobre [seguimiento de la ejecución de promesas](/es/nodejs/api/async_hooks#promise-execution-tracking).


### `async_hooks.asyncWrapProviders` {#async_hooksasyncwrapproviders}

**Añadido en: v17.2.0, v16.14.0**

- Devuelve: Un mapa de tipos de proveedor al ID numérico correspondiente. Este mapa contiene todos los tipos de eventos que pueden ser emitidos por el evento `async_hooks.init()`.

Esta característica suprime el uso obsoleto de `process.binding('async_wrap').Providers`. Ver: [DEP0111](/es/nodejs/api/deprecations#dep0111-processbinding)

## Seguimiento de la ejecución de promesas {#promise-execution-tracking}

De forma predeterminada, a las ejecuciones de promesas no se les asignan `asyncId`s debido a la naturaleza relativamente costosa de la [API de introspección de promesas](https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit) proporcionada por V8. Esto significa que los programas que usan promesas o `async` / `await` no obtendrán identificadores de ejecución y activación correctos para los contextos de devolución de llamada de promesas de forma predeterminada.

::: code-group
```js [ESM]
import { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 1 tid 0
```

```js [CJS]
const { executionAsyncId, triggerAsyncId } = require('node:async_hooks');

Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 1 tid 0
```
:::

Observe que la devolución de llamada `then()` afirma haberse ejecutado en el contexto del ámbito externo, aunque hubo un salto asíncrono involucrado. Además, el valor de `triggerAsyncId` es `0`, lo que significa que nos falta contexto sobre el recurso que causó (activó) la ejecución de la devolución de llamada `then()`.

La instalación de enlaces asíncronos a través de `async_hooks.createHook` habilita el seguimiento de la ejecución de promesas:

::: code-group
```js [ESM]
import { createHook, executionAsyncId, triggerAsyncId } from 'node:async_hooks';
createHook({ init() {} }).enable(); // forces PromiseHooks to be enabled.
Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 7 tid 6
```

```js [CJS]
const { createHook, executionAsyncId, triggerAsyncId } = require('node:async_hooks');

createHook({ init() {} }).enable(); // forces PromiseHooks to be enabled.
Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 7 tid 6
```
:::

En este ejemplo, agregar cualquier función de enlace real habilitó el seguimiento de promesas. Hay dos promesas en el ejemplo anterior; la promesa creada por `Promise.resolve()` y la promesa devuelta por la llamada a `then()`. En el ejemplo anterior, la primera promesa obtuvo el `asyncId` `6` y la última obtuvo el `asyncId` `7`. Durante la ejecución de la devolución de llamada `then()`, estamos ejecutando en el contexto de la promesa con `asyncId` `7`. Esta promesa fue activada por el recurso asíncrono `6`.

Otra sutileza con las promesas es que las devoluciones de llamada `before` y `after` se ejecutan solo en promesas encadenadas. Eso significa que las promesas no creadas por `then()`/`catch()` no tendrán las devoluciones de llamada `before` y `after` activadas en ellas. Para obtener más detalles, consulte los detalles de la API V8 [PromiseHooks](https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit).


## API de incrustación de JavaScript {#javascript-embedder-api}

Los desarrolladores de bibliotecas que gestionan sus propios recursos asíncronos realizando tareas como E/S, agrupación de conexiones o gestión de colas de devolución de llamada pueden utilizar la API de JavaScript `AsyncResource` para que se llamen todas las devoluciones de llamada adecuadas.

### Clase: `AsyncResource` {#class-asyncresource}

La documentación para esta clase se ha movido a [`AsyncResource`](/es/nodejs/api/async_context#class-asyncresource).

## Clase: `AsyncLocalStorage` {#class-asynclocalstorage}

La documentación para esta clase se ha movido a [`AsyncLocalStorage`](/es/nodejs/api/async_context#class-asynclocalstorage).

