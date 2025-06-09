---
title: Node.js Documentation - Asynchronous Context Tracking
description: Learn how to track asynchronous operations in Node.js with the async_hooks module, which provides a way to register callbacks for various asynchronous events.
head:
  - - meta
    - name: og:title
      content: Node.js Documentation - Asynchronous Context Tracking | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Learn how to track asynchronous operations in Node.js with the async_hooks module, which provides a way to register callbacks for various asynchronous events.
  - - meta
    - name: twitter:title
      content: Node.js Documentation - Asynchronous Context Tracking | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Learn how to track asynchronous operations in Node.js with the async_hooks module, which provides a way to register callbacks for various asynchronous events.
---

# Asynchronous context tracking {#asynchronous-context-tracking}

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable
:::

**Source Code:** [lib/async_hooks.js](https://github.com/nodejs/node/blob/v23.8.0/lib/async_hooks.js)

## Introduction {#introduction}

These classes are used to associate state and propagate it throughout callbacks and promise chains. They allow storing data throughout the lifetime of a web request or any other asynchronous duration. It is similar to thread-local storage in other languages.

The `AsyncLocalStorage` and `AsyncResource` classes are part of the `node:async_hooks` module:



::: code-group
```js [ESM]
import { AsyncLocalStorage, AsyncResource } from 'node:async_hooks';
```

```js [CJS]
const { AsyncLocalStorage, AsyncResource } = require('node:async_hooks');
```
:::

## Class: `AsyncLocalStorage` {#class-asynclocalstorage}


::: info [History]
| Version | Changes |
| --- | --- |
| v16.4.0 | AsyncLocalStorage is now Stable. Previously, it had been Experimental. |
| v13.10.0, v12.17.0 | Added in: v13.10.0, v12.17.0 |
:::

This class creates stores that stay coherent through asynchronous operations.

While you can create your own implementation on top of the `node:async_hooks` module, `AsyncLocalStorage` should be preferred as it is a performant and memory safe implementation that involves significant optimizations that are non-obvious to implement.

The following example uses `AsyncLocalStorage` to build a simple logger that assigns IDs to incoming HTTP requests and includes them in messages logged within each request.



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

Each instance of `AsyncLocalStorage` maintains an independent storage context. Multiple instances can safely exist simultaneously without risk of interfering with each other's data.

### `new AsyncLocalStorage()` {#new-asynclocalstorage}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.7.0, v18.16.0 | Removed experimental onPropagate option. |
| v19.2.0, v18.13.0 | Add option onPropagate. |
| v13.10.0, v12.17.0 | Added in: v13.10.0, v12.17.0 |
:::

Creates a new instance of `AsyncLocalStorage`. Store is only provided within a `run()` call or after an `enterWith()` call.

### Static method: `AsyncLocalStorage.bind(fn)` {#static-method-asynclocalstoragebindfn}

**Added in: v19.8.0, v18.16.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) The function to bind to the current execution context.
- Returns: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A new function that calls `fn` within the captured execution context.

Binds the given function to the current execution context.

### Static method: `AsyncLocalStorage.snapshot()` {#static-method-asynclocalstoragesnapshot}

**Added in: v19.8.0, v18.16.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

- Returns: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A new function with the signature `(fn: (...args) : R, ...args) : R`.

Captures the current execution context and returns a function that accepts a function as an argument. Whenever the returned function is called, it calls the function passed to it within the captured context.

```js [ESM]
const asyncLocalStorage = new AsyncLocalStorage();
const runInAsyncScope = asyncLocalStorage.run(123, () => AsyncLocalStorage.snapshot());
const result = asyncLocalStorage.run(321, () => runInAsyncScope(() => asyncLocalStorage.getStore()));
console.log(result);  // returns 123
```
AsyncLocalStorage.snapshot() can replace the use of AsyncResource for simple async context tracking purposes, for example:

```js [ESM]
class Foo {
  #runInAsyncScope = AsyncLocalStorage.snapshot();

  get() { return this.#runInAsyncScope(() => asyncLocalStorage.getStore()); }
}

const foo = asyncLocalStorage.run(123, () => new Foo());
console.log(asyncLocalStorage.run(321, () => foo.get())); // returns 123
```
### `asyncLocalStorage.disable()` {#asynclocalstoragedisable}

**Added in: v13.10.0, v12.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

Disables the instance of `AsyncLocalStorage`. All subsequent calls to `asyncLocalStorage.getStore()` will return `undefined` until `asyncLocalStorage.run()` or `asyncLocalStorage.enterWith()` is called again.

When calling `asyncLocalStorage.disable()`, all current contexts linked to the instance will be exited.

Calling `asyncLocalStorage.disable()` is required before the `asyncLocalStorage` can be garbage collected. This does not apply to stores provided by the `asyncLocalStorage`, as those objects are garbage collected along with the corresponding async resources.

Use this method when the `asyncLocalStorage` is not in use anymore in the current process.

### `asyncLocalStorage.getStore()` {#asynclocalstoragegetstore}

**Added in: v13.10.0, v12.17.0**

- Returns: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Returns the current store. If called outside of an asynchronous context initialized by calling `asyncLocalStorage.run()` or `asyncLocalStorage.enterWith()`, it returns `undefined`.

### `asyncLocalStorage.enterWith(store)` {#asynclocalstorageenterwithstore}

**Added in: v13.11.0, v12.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

- `store` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Transitions into the context for the remainder of the current synchronous execution and then persists the store through any following asynchronous calls.

Example:

```js [ESM]
const store = { id: 1 };
// Replaces previous store with the given store object
asyncLocalStorage.enterWith(store);
asyncLocalStorage.getStore(); // Returns the store object
someAsyncOperation(() => {
  asyncLocalStorage.getStore(); // Returns the same object
});
```
This transition will continue for the *entire* synchronous execution. This means that if, for example, the context is entered within an event handler subsequent event handlers will also run within that context unless specifically bound to another context with an `AsyncResource`. That is why `run()` should be preferred over `enterWith()` unless there are strong reasons to use the latter method.

```js [ESM]
const store = { id: 1 };

emitter.on('my-event', () => {
  asyncLocalStorage.enterWith(store);
});
emitter.on('my-event', () => {
  asyncLocalStorage.getStore(); // Returns the same object
});

asyncLocalStorage.getStore(); // Returns undefined
emitter.emit('my-event');
asyncLocalStorage.getStore(); // Returns the same object
```
### `asyncLocalStorage.run(store, callback[, ...args])` {#asynclocalstoragerunstore-callback-args}

**Added in: v13.10.0, v12.17.0**

- `store` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Runs a function synchronously within a context and returns its return value. The store is not accessible outside of the callback function. The store is accessible to any asynchronous operations created within the callback.

The optional `args` are passed to the callback function.

If the callback function throws an error, the error is thrown by `run()` too. The stacktrace is not impacted by this call and the context is exited.

Example:

```js [ESM]
const store = { id: 2 };
try {
  asyncLocalStorage.run(store, () => {
    asyncLocalStorage.getStore(); // Returns the store object
    setTimeout(() => {
      asyncLocalStorage.getStore(); // Returns the store object
    }, 200);
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // Returns undefined
  // The error will be caught here
}
```
### `asyncLocalStorage.exit(callback[, ...args])` {#asynclocalstorageexitcallback-args}

**Added in: v13.10.0, v12.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Runs a function synchronously outside of a context and returns its return value. The store is not accessible within the callback function or the asynchronous operations created within the callback. Any `getStore()` call done within the callback function will always return `undefined`.

The optional `args` are passed to the callback function.

If the callback function throws an error, the error is thrown by `exit()` too. The stacktrace is not impacted by this call and the context is re-entered.

Example:

```js [ESM]
// Within a call to run
try {
  asyncLocalStorage.getStore(); // Returns the store object or value
  asyncLocalStorage.exit(() => {
    asyncLocalStorage.getStore(); // Returns undefined
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // Returns the same object or value
  // The error will be caught here
}
```
### Usage with `async/await` {#usage-with-async/await}

If, within an async function, only one `await` call is to run within a context, the following pattern should be used:

```js [ESM]
async function fn() {
  await asyncLocalStorage.run(new Map(), () => {
    asyncLocalStorage.getStore().set('key', value);
    return foo(); // The return value of foo will be awaited
  });
}
```
In this example, the store is only available in the callback function and the functions called by `foo`. Outside of `run`, calling `getStore` will return `undefined`.

### Troubleshooting: Context loss {#troubleshooting-context-loss}

In most cases, `AsyncLocalStorage` works without issues. In rare situations, the current store is lost in one of the asynchronous operations.

If your code is callback-based, it is enough to promisify it with [`util.promisify()`](/nodejs/api/util#utilpromisifyoriginal) so it starts working with native promises.

If you need to use a callback-based API or your code assumes a custom thenable implementation, use the [`AsyncResource`](/nodejs/api/async_context#class-asyncresource) class to associate the asynchronous operation with the correct execution context. Find the function call responsible for the context loss by logging the content of `asyncLocalStorage.getStore()` after the calls you suspect are responsible for the loss. When the code logs `undefined`, the last callback called is probably responsible for the context loss.

## Class: `AsyncResource` {#class-asyncresource}


::: info [History]
| Version | Changes |
| --- | --- |
| v16.4.0 | AsyncResource is now Stable. Previously, it had been Experimental. |
:::

The class `AsyncResource` is designed to be extended by the embedder's async resources. Using this, users can easily trigger the lifetime events of their own resources.

The `init` hook will trigger when an `AsyncResource` is instantiated.

The following is an overview of the `AsyncResource` API.



::: code-group
```js [ESM]
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

// AsyncResource() is meant to be extended. Instantiating a
// new AsyncResource() also triggers init. If triggerAsyncId is omitted then
// async_hook.executionAsyncId() is used.
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// Run a function in the execution context of the resource. This will
// * establish the context of the resource
// * trigger the AsyncHooks before callbacks
// * call the provided function `fn` with the supplied arguments
// * trigger the AsyncHooks after callbacks
// * restore the original execution context
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// Call AsyncHooks destroy callbacks.
asyncResource.emitDestroy();

// Return the unique ID assigned to the AsyncResource instance.
asyncResource.asyncId();

// Return the trigger ID for the AsyncResource instance.
asyncResource.triggerAsyncId();
```

```js [CJS]
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

// AsyncResource() is meant to be extended. Instantiating a
// new AsyncResource() also triggers init. If triggerAsyncId is omitted then
// async_hook.executionAsyncId() is used.
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// Run a function in the execution context of the resource. This will
// * establish the context of the resource
// * trigger the AsyncHooks before callbacks
// * call the provided function `fn` with the supplied arguments
// * trigger the AsyncHooks after callbacks
// * restore the original execution context
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// Call AsyncHooks destroy callbacks.
asyncResource.emitDestroy();

// Return the unique ID assigned to the AsyncResource instance.
asyncResource.asyncId();

// Return the trigger ID for the AsyncResource instance.
asyncResource.triggerAsyncId();
```
:::

### `new AsyncResource(type[, options])` {#new-asyncresourcetype-options}

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The type of async event.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The ID of the execution context that created this async event. **Default:** `executionAsyncId()`.
    - `requireManualDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If set to `true`, disables `emitDestroy` when the object is garbage collected. This usually does not need to be set (even if `emitDestroy` is called manually), unless the resource's `asyncId` is retrieved and the sensitive API's `emitDestroy` is called with it. When set to `false`, the `emitDestroy` call on garbage collection will only take place if there is at least one active `destroy` hook. **Default:** `false`.
  
 

Example usage:

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
### Static method: `AsyncResource.bind(fn[, type[, thisArg]])` {#static-method-asyncresourcebindfn-type-thisarg}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.0.0 | The `asyncResource` property added to the bound function has been deprecated and will be removed in a future version. |
| v17.8.0, v16.15.0 | Changed the default when `thisArg` is undefined to use `this` from the caller. |
| v16.0.0 | Added optional thisArg. |
| v14.8.0, v12.19.0 | Added in: v14.8.0, v12.19.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) The function to bind to the current execution context.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) An optional name to associate with the underlying `AsyncResource`.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Binds the given function to the current execution context.

### `asyncResource.bind(fn[, thisArg])` {#asyncresourcebindfn-thisarg}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.0.0 | The `asyncResource` property added to the bound function has been deprecated and will be removed in a future version. |
| v17.8.0, v16.15.0 | Changed the default when `thisArg` is undefined to use `this` from the caller. |
| v16.0.0 | Added optional thisArg. |
| v14.8.0, v12.19.0 | Added in: v14.8.0, v12.19.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) The function to bind to the current `AsyncResource`.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Binds the given function to execute to this `AsyncResource`'s scope.

### `asyncResource.runInAsyncScope(fn[, thisArg, ...args])` {#asyncresourceruninasyncscopefn-thisarg-args}

**Added in: v9.6.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) The function to call in the execution context of this async resource.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) The receiver to be used for the function call.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Optional arguments to pass to the function.

Call the provided function with the provided arguments in the execution context of the async resource. This will establish the context, trigger the AsyncHooks before callbacks, call the function, trigger the AsyncHooks after callbacks, and then restore the original execution context.

### `asyncResource.emitDestroy()` {#asyncresourceemitdestroy}

- Returns: [\<AsyncResource\>](/nodejs/api/async_hooks#class-asyncresource) A reference to `asyncResource`.

Call all `destroy` hooks. This should only ever be called once. An error will be thrown if it is called more than once. This **must** be manually called. If the resource is left to be collected by the GC then the `destroy` hooks will never be called.

### `asyncResource.asyncId()` {#asyncresourceasyncid}

- Returns: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The unique `asyncId` assigned to the resource.

### `asyncResource.triggerAsyncId()` {#asyncresourcetriggerasyncid}

- Returns: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The same `triggerAsyncId` that is passed to the `AsyncResource` constructor.

### Using `AsyncResource` for a `Worker` thread pool {#using-asyncresource-for-a-worker-thread-pool}

The following example shows how to use the `AsyncResource` class to properly provide async tracking for a [`Worker`](/nodejs/api/worker_threads#class-worker) pool. Other resource pools, such as database connection pools, can follow a similar model.

Assuming that the task is adding two numbers, using a file named `task_processor.js` with the following content:



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

a Worker pool around it could use the following structure:



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

Without the explicit tracking added by the `WorkerPoolTaskInfo` objects, it would appear that the callbacks are associated with the individual `Worker` objects. However, the creation of the `Worker`s is not associated with the creation of the tasks and does not provide information about when tasks were scheduled.

This pool could be used as follows:



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

### Integrating `AsyncResource` with `EventEmitter` {#integrating-asyncresource-with-eventemitter}

Event listeners triggered by an [`EventEmitter`](/nodejs/api/events#class-eventemitter) may be run in a different execution context than the one that was active when `eventEmitter.on()` was called.

The following example shows how to use the `AsyncResource` class to properly associate an event listener with the correct execution context. The same approach can be applied to a [`Stream`](/nodejs/api/stream#stream) or a similar event-driven class.



::: code-group
```js [ESM]
import { createServer } from 'node:http';
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

const server = createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    // Execution context is bound to the current outer scope.
  }));
  req.on('close', () => {
    // Execution context is bound to the scope that caused 'close' to emit.
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
  }));
  req.on('close', () => {
    // Execution context is bound to the scope that caused 'close' to emit.
  });
  res.end();
}).listen(3000);
```
:::

