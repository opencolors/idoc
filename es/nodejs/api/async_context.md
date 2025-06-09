---
title: Documentación de Node.js - Seguimiento de Contexto Asíncrono
description: Aprende a rastrear operaciones asíncronas en Node.js con el módulo async_hooks, que proporciona una manera de registrar devoluciones de llamada para varios eventos asíncronos.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - Seguimiento de Contexto Asíncrono | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprende a rastrear operaciones asíncronas en Node.js con el módulo async_hooks, que proporciona una manera de registrar devoluciones de llamada para varios eventos asíncronos.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - Seguimiento de Contexto Asíncrono | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprende a rastrear operaciones asíncronas en Node.js con el módulo async_hooks, que proporciona una manera de registrar devoluciones de llamada para varios eventos asíncronos.
---


# Seguimiento del contexto asíncrono {#asynchronous-context-tracking}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código Fuente:** [lib/async_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/async_hooks.js)

## Introducción {#introduction}

Estas clases se utilizan para asociar el estado y propagarlo a través de devoluciones de llamada y cadenas de promesas. Permiten almacenar datos durante toda la vida útil de una solicitud web o cualquier otra duración asíncrona. Es similar al almacenamiento local de hilos en otros lenguajes.

Las clases `AsyncLocalStorage` y `AsyncResource` son parte del módulo `node:async_hooks`:

::: code-group
```js [ESM]
import { AsyncLocalStorage, AsyncResource } from 'node:async_hooks';
```

```js [CJS]
const { AsyncLocalStorage, AsyncResource } = require('node:async_hooks';
```
:::

## Clase: `AsyncLocalStorage` {#class-asynclocalstorage}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.4.0 | AsyncLocalStorage ahora es Estable. Anteriormente, había sido Experimental. |
| v13.10.0, v12.17.0 | Agregado en: v13.10.0, v12.17.0 |
:::

Esta clase crea almacenamientos que se mantienen coherentes a través de operaciones asíncronas.

Si bien puede crear su propia implementación sobre el módulo `node:async_hooks`, se debe preferir `AsyncLocalStorage`, ya que es una implementación de alto rendimiento y segura para la memoria que implica optimizaciones significativas que no son obvias de implementar.

El siguiente ejemplo usa `AsyncLocalStorage` para construir un registrador simple que asigna IDs a las solicitudes HTTP entrantes y las incluye en los mensajes registrados dentro de cada solicitud.

::: code-group
```js [ESM]
import http from 'node:http';
import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg) {
  const id = asyncLocalStorage.getStore();
  console.log(`${id !== undefined ? id : '-'}:`, msg);
}

let idSeq = 0;
http.createServer((req, res) => {
  asyncLocalStorage.run(idSeq++, () => {
    logWithId('start');
    // Imagine any chain of async operations here
    setImmediate(() => {
      logWithId('finish');
      res.end();
    });
  });
}).listen(8080);

http.get('http://localhost:8080');
http.get('http://localhost:8080');
// Prints:
//   0: start
//   1: start
//   0: finish
//   1: finish
```

```js [CJS]
const http = require('node:http');
const { AsyncLocalStorage } = require('node:async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg) {
  const id = asyncLocalStorage.getStore();
  console.log(`${id !== undefined ? id : '-'}:`, msg);
}

let idSeq = 0;
http.createServer((req, res) => {
  asyncLocalStorage.run(idSeq++, () => {
    logWithId('start');
    // Imagine any chain of async operations here
    setImmediate(() => {
      logWithId('finish');
      res.end();
    });
  });
}).listen(8080);

http.get('http://localhost:8080');
http.get('http://localhost:8080');
// Prints:
//   0: start
//   1: start
//   0: finish
//   1: finish
```
:::

Cada instancia de `AsyncLocalStorage` mantiene un contexto de almacenamiento independiente. Pueden existir varias instancias de forma segura simultáneamente sin riesgo de interferir con los datos de las demás.


### `new AsyncLocalStorage()` {#new-asynclocalstorage}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.7.0, v18.16.0 | Se eliminó la opción experimental onPropagate. |
| v19.2.0, v18.13.0 | Se agregó la opción onPropagate. |
| v13.10.0, v12.17.0 | Agregado en: v13.10.0, v12.17.0 |
:::

Crea una nueva instancia de `AsyncLocalStorage`. El almacenamiento solo se proporciona dentro de una llamada a `run()` o después de una llamada a `enterWith()`.

### Método estático: `AsyncLocalStorage.bind(fn)` {#static-method-asynclocalstoragebindfn}

**Agregado en: v19.8.0, v18.16.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función que se va a enlazar al contexto de ejecución actual.
- Devuelve: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una nueva función que llama a `fn` dentro del contexto de ejecución capturado.

Enlaza la función dada al contexto de ejecución actual.

### Método estático: `AsyncLocalStorage.snapshot()` {#static-method-asynclocalstoragesnapshot}

**Agregado en: v19.8.0, v18.16.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- Devuelve: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una nueva función con la firma `(fn: (...args) : R, ...args) : R`.

Captura el contexto de ejecución actual y devuelve una función que acepta una función como argumento. Cada vez que se llama a la función devuelta, llama a la función que se le pasa dentro del contexto capturado.

```js [ESM]
const asyncLocalStorage = new AsyncLocalStorage();
const runInAsyncScope = asyncLocalStorage.run(123, () => AsyncLocalStorage.snapshot());
const result = asyncLocalStorage.run(321, () => runInAsyncScope(() => asyncLocalStorage.getStore()));
console.log(result);  // devuelve 123
```
AsyncLocalStorage.snapshot() puede reemplazar el uso de AsyncResource para fines de seguimiento de contexto asíncrono simples, por ejemplo:

```js [ESM]
class Foo {
  #runInAsyncScope = AsyncLocalStorage.snapshot();

  get() { return this.#runInAsyncScope(() => asyncLocalStorage.getStore()); }
}

const foo = asyncLocalStorage.run(123, () => new Foo());
console.log(asyncLocalStorage.run(321, () => foo.get())); // devuelve 123
```

### `asyncLocalStorage.disable()` {#asynclocalstoragedisable}

**Agregado en: v13.10.0, v12.17.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Deshabilita la instancia de `AsyncLocalStorage`. Todas las llamadas subsiguientes a `asyncLocalStorage.getStore()` devolverán `undefined` hasta que se vuelva a llamar a `asyncLocalStorage.run()` o `asyncLocalStorage.enterWith()`.

Al llamar a `asyncLocalStorage.disable()`, todos los contextos actuales vinculados a la instancia se cerrarán.

Es necesario llamar a `asyncLocalStorage.disable()` antes de que `asyncLocalStorage` pueda ser recolectado por el recolector de basura. Esto no se aplica a los almacenes proporcionados por `asyncLocalStorage`, ya que esos objetos se recolectan junto con los recursos asíncronos correspondientes.

Utilice este método cuando `asyncLocalStorage` ya no se utilice en el proceso actual.

### `asyncLocalStorage.getStore()` {#asynclocalstoragegetstore}

**Agregado en: v13.10.0, v12.17.0**

- Devuelve: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Devuelve el almacén actual. Si se llama fuera de un contexto asíncrono inicializado llamando a `asyncLocalStorage.run()` o `asyncLocalStorage.enterWith()`, devuelve `undefined`.

### `asyncLocalStorage.enterWith(store)` {#asynclocalstorageenterwithstore}

**Agregado en: v13.11.0, v12.17.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `store` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Realiza la transición al contexto durante el resto de la ejecución síncrona actual y, a continuación, persiste el almacén a través de cualquier llamada asíncrona posterior.

Ejemplo:

```js [ESM]
const store = { id: 1 };
// Reemplaza el almacén anterior con el objeto de almacén dado
asyncLocalStorage.enterWith(store);
asyncLocalStorage.getStore(); // Devuelve el objeto de almacén
someAsyncOperation(() => {
  asyncLocalStorage.getStore(); // Devuelve el mismo objeto
});
```
Esta transición continuará durante la *totalidad* de la ejecución síncrona. Esto significa que si, por ejemplo, el contexto se introduce dentro de un controlador de eventos, los controladores de eventos posteriores también se ejecutarán dentro de ese contexto, a menos que estén específicamente vinculados a otro contexto con un `AsyncResource`. Por eso, `run()` debe preferirse a `enterWith()` a menos que existan razones de peso para utilizar este último método.

```js [ESM]
const store = { id: 1 };

emitter.on('my-event', () => {
  asyncLocalStorage.enterWith(store);
});
emitter.on('my-event', () => {
  asyncLocalStorage.getStore(); // Devuelve el mismo objeto
});

asyncLocalStorage.getStore(); // Devuelve undefined
emitter.emit('my-event');
asyncLocalStorage.getStore(); // Devuelve el mismo objeto
```

### `asyncLocalStorage.run(store, callback[, ...args])` {#asynclocalstoragerunstore-callback-args}

**Agregado en: v13.10.0, v12.17.0**

- `store` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Ejecuta una función sincrónicamente dentro de un contexto y devuelve su valor de retorno. No se puede acceder al almacenamiento fuera de la función de retrollamada. El almacenamiento es accesible para cualquier operación asíncrona creada dentro de la retrollamada.

Los `args` opcionales se pasan a la función de retrollamada.

Si la función de retrollamada lanza un error, el error también es lanzado por `run()`. La traza de la pila no se ve afectada por esta llamada y se sale del contexto.

Ejemplo:

```js [ESM]
const store = { id: 2 };
try {
  asyncLocalStorage.run(store, () => {
    asyncLocalStorage.getStore(); // Devuelve el objeto de almacenamiento
    setTimeout(() => {
      asyncLocalStorage.getStore(); // Devuelve el objeto de almacenamiento
    }, 200);
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // Devuelve undefined
  // El error será capturado aquí
}
```
### `asyncLocalStorage.exit(callback[, ...args])` {#asynclocalstorageexitcallback-args}

**Agregado en: v13.10.0, v12.17.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Ejecuta una función sincrónicamente fuera de un contexto y devuelve su valor de retorno. No se puede acceder al almacenamiento dentro de la función de retrollamada ni a las operaciones asíncronas creadas dentro de la retrollamada. Cualquier llamada a `getStore()` realizada dentro de la función de retrollamada siempre devolverá `undefined`.

Los `args` opcionales se pasan a la función de retrollamada.

Si la función de retrollamada lanza un error, el error también es lanzado por `exit()`. La traza de la pila no se ve afectada por esta llamada y se vuelve a entrar en el contexto.

Ejemplo:

```js [ESM]
// Dentro de una llamada a run
try {
  asyncLocalStorage.getStore(); // Devuelve el objeto o valor de almacenamiento
  asyncLocalStorage.exit(() => {
    asyncLocalStorage.getStore(); // Devuelve undefined
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // Devuelve el mismo objeto o valor
  // El error será capturado aquí
}
```

### Uso con `async/await` {#usage-with-async/await}

Si, dentro de una función asíncrona, solo una llamada `await` debe ejecutarse dentro de un contexto, se debe usar el siguiente patrón:

```js [ESM]
async function fn() {
  await asyncLocalStorage.run(new Map(), () => {
    asyncLocalStorage.getStore().set('key', value);
    return foo(); // El valor de retorno de foo será esperado
  });
}
```
En este ejemplo, el almacenamiento solo está disponible en la función de devolución de llamada y las funciones llamadas por `foo`. Fuera de `run`, llamar a `getStore` devolverá `undefined`.

### Solución de problemas: Pérdida de contexto {#troubleshooting-context-loss}

En la mayoría de los casos, `AsyncLocalStorage` funciona sin problemas. En raras ocasiones, el almacenamiento actual se pierde en una de las operaciones asíncronas.

Si tu código está basado en devoluciones de llamada, es suficiente con prometerlo con [`util.promisify()`](/es/nodejs/api/util#utilpromisifyoriginal) para que empiece a funcionar con promesas nativas.

Si necesitas usar una API basada en devoluciones de llamada o tu código asume una implementación thenable personalizada, usa la clase [`AsyncResource`](/es/nodejs/api/async_context#class-asyncresource) para asociar la operación asíncrona con el contexto de ejecución correcto. Encuentra la llamada a la función responsable de la pérdida de contexto registrando el contenido de `asyncLocalStorage.getStore()` después de las llamadas que sospeches que son responsables de la pérdida. Cuando el código registre `undefined`, la última devolución de llamada llamada probablemente sea responsable de la pérdida de contexto.

## Clase: `AsyncResource` {#class-asyncresource}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.4.0 | AsyncResource ahora es Estable. Anteriormente, había sido Experimental. |
:::

La clase `AsyncResource` está diseñada para ser extendida por los recursos asíncronos del incrustador. Usando esto, los usuarios pueden activar fácilmente los eventos de tiempo de vida de sus propios recursos.

El hook `init` se activará cuando se instancie un `AsyncResource`.

La siguiente es una descripción general de la API `AsyncResource`.



::: code-group
```js [ESM]
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

// AsyncResource() está destinado a ser extendido. Instanciar un
// nuevo AsyncResource() también activa init. Si se omite triggerAsyncId, entonces
// se utiliza async_hook.executionAsyncId().
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// Ejecuta una función en el contexto de ejecución del recurso. Esto
// * establecerá el contexto del recurso
// * activará las devoluciones de llamada AsyncHooks before
// * llamará a la función proporcionada `fn` con los argumentos proporcionados
// * activará las devoluciones de llamada AsyncHooks after
// * restaurará el contexto de ejecución original
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// Llama a las devoluciones de llamada AsyncHooks destroy.
asyncResource.emitDestroy();

// Devuelve el ID único asignado a la instancia AsyncResource.
asyncResource.asyncId();

// Devuelve el ID de activación para la instancia AsyncResource.
asyncResource.triggerAsyncId();
```

```js [CJS]
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

// AsyncResource() está destinado a ser extendido. Instanciar un
// nuevo AsyncResource() también activa init. Si se omite triggerAsyncId, entonces
// se utiliza async_hook.executionAsyncId().
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// Ejecuta una función en el contexto de ejecución del recurso. Esto
// * establecerá el contexto del recurso
// * activará las devoluciones de llamada AsyncHooks before
// * llamará a la función proporcionada `fn` con los argumentos proporcionados
// * activará las devoluciones de llamada AsyncHooks after
// * restaurará el contexto de ejecución original
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// Llama a las devoluciones de llamada AsyncHooks destroy.
asyncResource.emitDestroy();

// Devuelve el ID único asignado a la instancia AsyncResource.
asyncResource.asyncId();

// Devuelve el ID de activación para la instancia AsyncResource.
asyncResource.triggerAsyncId();
```
:::


### `new AsyncResource(type[, options])` {#new-asyncresourcetype-options}

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El tipo de evento asíncrono.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El ID del contexto de ejecución que creó este evento asíncrono. **Predeterminado:** `executionAsyncId()`.
    - `requireManualDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en `true`, deshabilita `emitDestroy` cuando el objeto se recolecta como basura. Por lo general, no es necesario establecer esto (incluso si `emitDestroy` se llama manualmente), a menos que se recupere el `asyncId` del recurso y se llame a la API sensible `emitDestroy` con él. Cuando se establece en `false`, la llamada `emitDestroy` en la recolección de basura solo tendrá lugar si hay al menos un gancho `destroy` activo. **Predeterminado:** `false`.
  
 

Ejemplo de uso:

```js [ESM]
class DBQuery extends AsyncResource {
  constructor(db) {
    super('DBQuery');
    this.db = db;
  }

  getInfo(query, callback) {
    this.db.get(query, (err, data) => {
      this.runInAsyncScope(callback, null, err, data);
    });
  }

  close() {
    this.db = null;
    this.emitDestroy();
  }
}
```
### Método estático: `AsyncResource.bind(fn[, type[, thisArg]])` {#static-method-asyncresourcebindfn-type-thisarg}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.0.0 | La propiedad `asyncResource` añadida a la función enlazada ha quedado obsoleta y se eliminará en una versión futura. |
| v17.8.0, v16.15.0 | Se cambió el valor predeterminado cuando `thisArg` no está definido para usar `this` del llamador. |
| v16.0.0 | Se agregó thisArg opcional. |
| v14.8.0, v12.19.0 | Añadido en: v14.8.0, v12.19.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función para vincular al contexto de ejecución actual.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un nombre opcional para asociar con el `AsyncResource` subyacente.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Enlaza la función dada al contexto de ejecución actual.


### `asyncResource.bind(fn[, thisArg])` {#asyncresourcebindfn-thisarg}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v20.0.0 | La propiedad `asyncResource` añadida a la función enlazada ha sido obsoleta y se eliminará en una versión futura. |
| v17.8.0, v16.15.0 | Se cambió el valor predeterminado cuando `thisArg` es indefinido para usar `this` del llamador. |
| v16.0.0 | Se añadió thisArg opcional. |
| v14.8.0, v12.19.0 | Añadido en: v14.8.0, v12.19.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función a enlazar al `AsyncResource` actual.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Enlaza la función dada para que se ejecute en el ámbito de este `AsyncResource`.

### `asyncResource.runInAsyncScope(fn[, thisArg, ...args])` {#asyncresourceruninasyncscopefn-thisarg-args}

**Añadido en: v9.6.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función a llamar en el contexto de ejecución de este recurso asíncrono.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) El receptor a utilizar para la llamada a la función.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Argumentos opcionales para pasar a la función.

Llama a la función proporcionada con los argumentos proporcionados en el contexto de ejecución del recurso asíncrono. Esto establecerá el contexto, activará las devoluciones de llamada AsyncHooks antes, llamará a la función, activará las devoluciones de llamada AsyncHooks después y luego restaurará el contexto de ejecución original.

### `asyncResource.emitDestroy()` {#asyncresourceemitdestroy}

- Devuelve: [\<AsyncResource\>](/es/nodejs/api/async_hooks#class-asyncresource) Una referencia a `asyncResource`.

Llama a todos los hooks `destroy`. Esto solo debe ser llamado una vez. Se lanzará un error si se llama más de una vez. Esto **debe** ser llamado manualmente. Si se deja que el recolector de basura recoja el recurso, entonces los hooks `destroy` nunca serán llamados.


### `asyncResource.asyncId()` {#asyncresourceasyncid}

- Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El `asyncId` único asignado al recurso.

### `asyncResource.triggerAsyncId()` {#asyncresourcetriggerasyncid}

- Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El mismo `triggerAsyncId` que se pasa al constructor `AsyncResource`.

### Usando `AsyncResource` para un pool de hilos `Worker` {#using-asyncresource-for-a-worker-thread-pool}

El siguiente ejemplo muestra cómo usar la clase `AsyncResource` para proporcionar correctamente el seguimiento asíncrono para un pool de [`Worker`](/es/nodejs/api/worker_threads#class-worker). Otros pools de recursos, como los pools de conexión de bases de datos, pueden seguir un modelo similar.

Asumiendo que la tarea es sumar dos números, usando un archivo llamado `task_processor.js` con el siguiente contenido:

::: code-group
```js [ESM]
import { parentPort } from 'node:worker_threads';
parentPort.on('message', (task) => {
  parentPort.postMessage(task.a + task.b);
});
```

```js [CJS]
const { parentPort } = require('node:worker_threads');
parentPort.on('message', (task) => {
  parentPort.postMessage(task.a + task.b);
});
```
:::

Un pool de Workers a su alrededor podría usar la siguiente estructura:

::: code-group
```js [ESM]
import { AsyncResource } from 'node:async_hooks';
import { EventEmitter } from 'node:events';
import { Worker } from 'node:worker_threads';

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

class WorkerPoolTaskInfo extends AsyncResource {
  constructor(callback) {
    super('WorkerPoolTaskInfo');
    this.callback = callback;
  }

  done(err, result) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy();  // `TaskInfo`s are used only once.
  }
}

export default class WorkerPool extends EventEmitter {
  constructor(numThreads) {
    super();
    this.numThreads = numThreads;
    this.workers = [];
    this.freeWorkers = [];
    this.tasks = [];

    for (let i = 0; i < numThreads; i++)
      this.addNewWorker();

    // Any time the kWorkerFreedEvent is emitted, dispatch
    // the next task pending in the queue, if any.
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        const { task, callback } = this.tasks.shift();
        this.runTask(task, callback);
      }
    });
  }

  addNewWorker() {
    const worker = new Worker(new URL('task_processor.js', import.meta.url));
    worker.on('message', (result) => {
      // In case of success: Call the callback that was passed to `runTask`,
      // remove the `TaskInfo` associated with the Worker, and mark it as free
      // again.
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on('error', (err) => {
      // In case of an uncaught exception: Call the callback that was passed to
      // `runTask` with the error.
      if (worker[kTaskInfo])
        worker[kTaskInfo].done(err, null);
      else
        this.emit('error', err);
      // Remove the worker from the list and start a new Worker to replace the
      // current one.
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // No free threads, wait until a worker thread becomes free.
      this.tasks.push({ task, callback });
      return;
    }

    const worker = this.freeWorkers.pop();
    worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
    worker.postMessage(task);
  }

  close() {
    for (const worker of this.workers) worker.terminate();
  }
}
```

```js [CJS]
const { AsyncResource } = require('node:async_hooks');
const { EventEmitter } = require('node:events');
const path = require('node:path');
const { Worker } = require('node:worker_threads');

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

class WorkerPoolTaskInfo extends AsyncResource {
  constructor(callback) {
    super('WorkerPoolTaskInfo');
    this.callback = callback;
  }

  done(err, result) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy();  // `TaskInfo`s are used only once.
  }
}

class WorkerPool extends EventEmitter {
  constructor(numThreads) {
    super();
    this.numThreads = numThreads;
    this.workers = [];
    this.freeWorkers = [];
    this.tasks = [];

    for (let i = 0; i < numThreads; i++)
      this.addNewWorker();

    // Any time the kWorkerFreedEvent is emitted, dispatch
    // the next task pending in the queue, if any.
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        const { task, callback } = this.tasks.shift();
        this.runTask(task, callback);
      }
    });
  }

  addNewWorker() {
    const worker = new Worker(path.resolve(__dirname, 'task_processor.js'));
    worker.on('message', (result) => {
      // In case of success: Call the callback that was passed to `runTask`,
      // remove the `TaskInfo` associated with the Worker, and mark it as free
      // again.
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on('error', (err) => {
      // In case of an uncaught exception: Call the callback that was passed to
      // `runTask` with the error.
      if (worker[kTaskInfo])
        worker[kTaskInfo].done(err, null);
      else
        this.emit('error', err);
      // Remove the worker from the list and start a new Worker to replace the
      // current one.
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // No free threads, wait until a worker thread becomes free.
      this.tasks.push({ task, callback });
      return;
    }

    const worker = this.freeWorkers.pop();
    worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
    worker.postMessage(task);
  }

  close() {
    for (const worker of this.workers) worker.terminate();
  }
}

module.exports = WorkerPool;
```
:::

Sin el seguimiento explícito añadido por los objetos `WorkerPoolTaskInfo`, parecería que las retrollamadas están asociadas con los objetos `Worker` individuales. Sin embargo, la creación de los `Worker` no está asociada con la creación de las tareas y no proporciona información sobre cuándo se programaron las tareas.

Este pool podría usarse de la siguiente manera:

::: code-group
```js [ESM]
import WorkerPool from './worker_pool.js';
import os from 'node:os';

const pool = new WorkerPool(os.availableParallelism());

let finished = 0;
for (let i = 0; i < 10; i++) {
  pool.runTask({ a: 42, b: 100 }, (err, result) => {
    console.log(i, err, result);
    if (++finished === 10)
      pool.close();
  });
}
```

```js [CJS]
const WorkerPool = require('./worker_pool.js');
const os = require('node:os');

const pool = new WorkerPool(os.availableParallelism());

let finished = 0;
for (let i = 0; i < 10; i++) {
  pool.runTask({ a: 42, b: 100 }, (err, result) => {
    console.log(i, err, result);
    if (++finished === 10)
      pool.close();
  });
}
```
:::


### Integración de `AsyncResource` con `EventEmitter` {#integrating-asyncresource-with-eventemitter}

Los listeners de eventos activados por un [`EventEmitter`](/es/nodejs/api/events#class-eventemitter) pueden ejecutarse en un contexto de ejecución diferente al que estaba activo cuando se llamó a `eventEmitter.on()`.

El siguiente ejemplo muestra cómo usar la clase `AsyncResource` para asociar correctamente un listener de eventos con el contexto de ejecución correcto. El mismo enfoque se puede aplicar a un [`Stream`](/es/nodejs/api/stream#stream) o una clase similar basada en eventos.

::: code-group
```js [ESM]
import { createServer } from 'node:http';
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

const server = createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    // Execution context is bound to the current outer scope.
    // El contexto de ejecución está ligado al ámbito externo actual.
  }));
  req.on('close', () => {
    // Execution context is bound to the scope that caused 'close' to emit.
    // El contexto de ejecución está ligado al ámbito que causó la emisión de 'close'.
  });
  res.end();
}).listen(3000);
```

```js [CJS]
const { createServer } = require('node:http');
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

const server = createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    // Execution context is bound to the current outer scope.
    // El contexto de ejecución está ligado al ámbito externo actual.
  }));
  req.on('close', () => {
    // Execution context is bound to the scope that caused 'close' to emit.
    // El contexto de ejecución está ligado al ámbito que causó la emisión de 'close'.
  });
  res.end();
}).listen(3000);
```
:::

