---
title: Node.js 文档 - 异步上下文跟踪
description: 了解如何使用 async_hooks 模块在 Node.js 中跟踪异步操作，该模块提供了一种注册回调以响应各种异步事件的方法。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 - 异步上下文跟踪 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解如何使用 async_hooks 模块在 Node.js 中跟踪异步操作，该模块提供了一种注册回调以响应各种异步事件的方法。
  - - meta
    - name: twitter:title
      content: Node.js 文档 - 异步上下文跟踪 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解如何使用 async_hooks 模块在 Node.js 中跟踪异步操作，该模块提供了一种注册回调以响应各种异步事件的方法。
---


# 异步上下文跟踪 {#asynchronous-context-tracking}

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源码:** [lib/async_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/async_hooks.js)

## 简介 {#introduction}

这些类用于关联状态并在回调和 Promise 链中传播它。它们允许在 Web 请求或任何其他异步持续时间的整个生命周期中存储数据。它类似于其他语言中的线程局部存储。

`AsyncLocalStorage` 和 `AsyncResource` 类是 `node:async_hooks` 模块的一部分：

::: code-group
```js [ESM]
import { AsyncLocalStorage, AsyncResource } from 'node:async_hooks';
```

```js [CJS]
const { AsyncLocalStorage, AsyncResource } = require('node:async_hooks');
```
:::

## 类: `AsyncLocalStorage` {#class-asynclocalstorage}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v16.4.0 | AsyncLocalStorage 现在是稳定的。 以前，它是实验性的。 |
| v13.10.0, v12.17.0 | 添加于：v13.10.0, v12.17.0 |
:::

此类创建的存储在异步操作中保持一致。

虽然您可以在 `node:async_hooks` 模块之上创建自己的实现，但应首选 `AsyncLocalStorage`，因为它是一种高性能且内存安全的实现，涉及大量难以实现的优化。

以下示例使用 `AsyncLocalStorage` 构建一个简单的记录器，该记录器为传入的 HTTP 请求分配 ID，并将其包含在每个请求中记录的消息中。

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

`AsyncLocalStorage` 的每个实例都维护一个独立的存储上下文。 多个实例可以安全地同时存在，而不会有相互干扰数据的风险。


### `new AsyncLocalStorage()` {#new-asynclocalstorage}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.7.0, v18.16.0 | 移除 experimental onPropagate 选项。 |
| v19.2.0, v18.13.0 | 添加选项 onPropagate。 |
| v13.10.0, v12.17.0 | 添加于：v13.10.0, v12.17.0 |
:::

创建一个 `AsyncLocalStorage` 的新实例。存储仅在 `run()` 调用中或 `enterWith()` 调用之后提供。

### 静态方法: `AsyncLocalStorage.bind(fn)` {#static-method-asynclocalstoragebindfn}

**添加于: v19.8.0, v18.16.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 要绑定到当前执行上下文的函数。
- 返回值: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 一个新的函数，它在捕获的执行上下文中调用 `fn`。

将给定的函数绑定到当前的执行上下文。

### 静态方法: `AsyncLocalStorage.snapshot()` {#static-method-asynclocalstoragesnapshot}

**添加于: v19.8.0, v18.16.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- 返回值: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 一个新的函数，其签名为 `(fn: (...args) : R, ...args) : R`。

捕获当前的执行上下文并返回一个函数，该函数接受一个函数作为参数。每当调用返回的函数时，它会在捕获的上下文中调用传递给它的函数。

```js [ESM]
const asyncLocalStorage = new AsyncLocalStorage();
const runInAsyncScope = asyncLocalStorage.run(123, () => AsyncLocalStorage.snapshot());
const result = asyncLocalStorage.run(321, () => runInAsyncScope(() => asyncLocalStorage.getStore()));
console.log(result);  // 返回 123
```
AsyncLocalStorage.snapshot() 可以替代使用 AsyncResource 以用于简单的异步上下文跟踪目的，例如：

```js [ESM]
class Foo {
  #runInAsyncScope = AsyncLocalStorage.snapshot();

  get() { return this.#runInAsyncScope(() => asyncLocalStorage.getStore()); }
}

const foo = asyncLocalStorage.run(123, () => new Foo());
console.log(asyncLocalStorage.run(321, () => foo.get())); // 返回 123
```

### `asyncLocalStorage.disable()` {#asynclocalstoragedisable}

**添加于: v13.10.0, v12.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

禁用 `AsyncLocalStorage` 的实例。 在再次调用 `asyncLocalStorage.run()` 或 `asyncLocalStorage.enterWith()` 之前，所有后续对 `asyncLocalStorage.getStore()` 的调用都将返回 `undefined`。

当调用 `asyncLocalStorage.disable()` 时，所有链接到该实例的当前上下文都将被退出。

在可以对 `asyncLocalStorage` 进行垃圾回收之前，必须调用 `asyncLocalStorage.disable()`。 这不适用于由 `asyncLocalStorage` 提供的存储，因为这些对象会与相应的异步资源一起进行垃圾回收。

当 `asyncLocalStorage` 不再在当前进程中使用时，请使用此方法。

### `asyncLocalStorage.getStore()` {#asynclocalstoragegetstore}

**添加于: v13.10.0, v12.17.0**

- 返回: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

返回当前存储。 如果在通过调用 `asyncLocalStorage.run()` 或 `asyncLocalStorage.enterWith()` 初始化的异步上下文之外调用，则返回 `undefined`。

### `asyncLocalStorage.enterWith(store)` {#asynclocalstorageenterwithstore}

**添加于: v13.11.0, v12.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `store` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

转换到当前同步执行的其余部分的上下文，然后通过任何后续的异步调用来持久化存储。

例子：

```js [ESM]
const store = { id: 1 };
// 用给定的 store 对象替换先前的 store
asyncLocalStorage.enterWith(store);
asyncLocalStorage.getStore(); // 返回 store 对象
someAsyncOperation(() => {
  asyncLocalStorage.getStore(); // 返回相同的对象
});
```

此转换将持续 *整个* 同步执行。 这意味着，例如，如果在事件处理程序中输入上下文，则后续的事件处理程序也将在该上下文中运行，除非使用 `AsyncResource` 专门绑定到另一个上下文。 这就是为什么 `run()` 应该优先于 `enterWith()`，除非有充分的理由使用后一种方法。

```js [ESM]
const store = { id: 1 };

emitter.on('my-event', () => {
  asyncLocalStorage.enterWith(store);
});
emitter.on('my-event', () => {
  asyncLocalStorage.getStore(); // 返回相同的对象
});

asyncLocalStorage.getStore(); // 返回 undefined
emitter.emit('my-event');
asyncLocalStorage.getStore(); // 返回相同的对象
```

### `asyncLocalStorage.run(store, callback[, ...args])` {#asynclocalstoragerunstore-callback-args}

**添加于: v13.10.0, v12.17.0**

- `store` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

在一个上下文中同步运行一个函数，并返回其返回值。 存储在回调函数之外不可访问。 存储可以访问回调中创建的任何异步操作。

可选的 `args` 会传递给回调函数。

如果回调函数抛出错误，`run()` 也会抛出错误。堆栈跟踪不受此调用的影响，并且上下文会退出。

示例:

```js [ESM]
const store = { id: 2 };
try {
  asyncLocalStorage.run(store, () => {
    asyncLocalStorage.getStore(); // 返回存储对象
    setTimeout(() => {
      asyncLocalStorage.getStore(); // 返回存储对象
    }, 200);
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // 返回 undefined
  // 错误将在此处捕获
}
```
### `asyncLocalStorage.exit(callback[, ...args])` {#asynclocalstorageexitcallback-args}

**添加于: v13.10.0, v12.17.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

在一个上下文之外同步运行一个函数，并返回其返回值。 存储在回调函数或回调中创建的异步操作中不可访问。 在回调函数中完成的任何 `getStore()` 调用都将始终返回 `undefined`。

可选的 `args` 会传递给回调函数。

如果回调函数抛出错误，`exit()` 也会抛出错误。堆栈跟踪不受此调用的影响，并且上下文会重新进入。

示例:

```js [ESM]
// 在调用 run 中
try {
  asyncLocalStorage.getStore(); // 返回存储对象或值
  asyncLocalStorage.exit(() => {
    asyncLocalStorage.getStore(); // 返回 undefined
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // 返回相同的对象或值
  // 错误将在此处捕获
}
```

### 与 `async/await` 一起使用 {#usage-with-async/await}

如果在 async 函数中，只有一个 `await` 调用需要在上下文中运行，则应使用以下模式：

```js [ESM]
async function fn() {
  await asyncLocalStorage.run(new Map(), () => {
    asyncLocalStorage.getStore().set('key', value);
    return foo(); // foo 的返回值将被 await
  });
}
```
在这个例子中，store 只在回调函数和 `foo` 调用的函数中可用。在 `run` 之外，调用 `getStore` 将返回 `undefined`。

### 故障排除：上下文丢失 {#troubleshooting-context-loss}

在大多数情况下，`AsyncLocalStorage` 工作正常。在极少数情况下，当前 store 在其中一个异步操作中丢失。

如果您的代码是基于回调的，则使用 [`util.promisify()`](/zh/nodejs/api/util#utilpromisifyoriginal) 将其 Promise 化就足够了，这样它就可以开始使用原生 Promise。

如果需要使用基于回调的 API，或者您的代码假定使用自定义的 thenable 实现，请使用 [`AsyncResource`](/zh/nodejs/api/async_context#class-asyncresource) 类将异步操作与正确的执行上下文相关联。通过在您怀疑导致丢失的调用之后，记录 `asyncLocalStorage.getStore()` 的内容，找到负责上下文丢失的函数调用。当代码记录 `undefined` 时，则上次调用的回调函数可能负责上下文丢失。

## 类：`AsyncResource` {#class-asyncresource}

::: info [历史记录]
| 版本 | 变更内容 |
| --- | --- |
| v16.4.0 | AsyncResource 现在是稳定的。之前，它一直是实验性的。 |
:::

类 `AsyncResource` 旨在由嵌入器的异步资源扩展。使用它，用户可以轻松触发他们自己资源的生命周期事件。

当 `AsyncResource` 被实例化时，将会触发 `init` 钩子。

以下是 `AsyncResource` API 的概述。

::: code-group
```js [ESM]
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

// AsyncResource() 旨在被扩展。实例化一个新的
// AsyncResource() 也会触发 init。如果省略 triggerAsyncId，则
// 使用 async_hook.executionAsyncId()。
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// 在资源的执行上下文中运行一个函数。这将
// * 建立资源的上下文
// * 触发 AsyncHooks before 回调
// * 使用提供的参数调用提供的函数 `fn`
// * 触发 AsyncHooks after 回调
// * 恢复原始执行上下文
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// 调用 AsyncHooks destroy 回调。
asyncResource.emitDestroy();

// 返回分配给 AsyncResource 实例的唯一 ID。
asyncResource.asyncId();

// 返回 AsyncResource 实例的触发 ID。
asyncResource.triggerAsyncId();
```

```js [CJS]
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

// AsyncResource() 旨在被扩展。实例化一个新的
// AsyncResource() 也会触发 init。如果省略 triggerAsyncId，则
// 使用 async_hook.executionAsyncId()。
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// 在资源的执行上下文中运行一个函数。这将
// * 建立资源的上下文
// * 触发 AsyncHooks before 回调
// * 使用提供的参数调用提供的函数 `fn`
// * 触发 AsyncHooks after 回调
// * 恢复原始执行上下文
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// 调用 AsyncHooks destroy 回调。
asyncResource.emitDestroy();

// 返回分配给 AsyncResource 实例的唯一 ID。
asyncResource.asyncId();

// 返回 AsyncResource 实例的触发 ID。
asyncResource.triggerAsyncId();
```
:::


### `new AsyncResource(type[, options])` {#new-asyncresourcetype-options}

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 异步事件的类型。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 创建此异步事件的执行上下文的 ID。**默认:** `executionAsyncId()`。
    - `requireManualDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 `true`，则在对象被垃圾回收时禁用 `emitDestroy`。 通常不需要设置此项（即使手动调用 `emitDestroy`），除非检索了资源的 `asyncId` 并且调用了敏感 API 的 `emitDestroy`。 当设置为 `false` 时，只有在至少有一个活跃的 `destroy` 钩子时，才会进行垃圾回收时对 `emitDestroy` 的调用。 **默认:** `false`。

用法示例：

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
### 静态方法: `AsyncResource.bind(fn[, type[, thisArg]])` {#static-method-asyncresourcebindfn-type-thisarg}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v20.0.0 | 添加到绑定函数的 `asyncResource` 属性已被弃用，并将在未来的版本中移除。 |
| v17.8.0, v16.15.0 | 当 `thisArg` 未定义时，更改了默认值，使用调用者的 `this`。 |
| v16.0.0 | 添加了可选的 thisArg。 |
| v14.8.0, v12.19.0 | 添加于: v14.8.0, v12.19.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 要绑定到当前执行上下文的函数。
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 与底层 `AsyncResource` 关联的可选名称。
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

将给定的函数绑定到当前执行上下文。


### `asyncResource.bind(fn[, thisArg])` {#asyncresourcebindfn-thisarg}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.0.0 | 已弃用绑定函数中添加的 `asyncResource` 属性，并在未来的版本中删除。 |
| v17.8.0, v16.15.0 | 当 `thisArg` 未定义时，将默认值更改为使用调用者的 `this`。 |
| v16.0.0 | 添加了可选的 thisArg。 |
| v14.8.0, v12.19.0 | 添加于：v14.8.0, v12.19.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function) 要绑定到当前 `AsyncResource` 的函数。
- `thisArg` [\<any\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Data_types)

绑定给定的函数，使其在 `AsyncResource` 的作用域内执行。

### `asyncResource.runInAsyncScope(fn[, thisArg, ...args])` {#asyncresourceruninasyncscopefn-thisarg-args}

**添加于: v9.6.0**

- `fn` [\<Function\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function) 在异步资源的执行上下文中调用的函数。
- `thisArg` [\<any\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Data_types) 用于函数调用的接收器。
- `...args` [\<any\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Data_types) 传递给函数的可选参数。

使用提供的参数在异步资源的执行上下文中调用提供的函数。 这将建立上下文，触发 AsyncHooks 之前回调，调用该函数，触发 AsyncHooks 之后回调，然后恢复原始执行上下文。

### `asyncResource.emitDestroy()` {#asyncresourceemitdestroy}

- 返回: [\<AsyncResource\>](/zh/nodejs/api/async_hooks#class-asyncresource) 对 `asyncResource` 的引用。

调用所有 `destroy` 钩子。 这应该只被调用一次。 如果多次调用，将会抛出一个错误。 这**必须**手动调用。 如果资源被 GC 回收，那么 `destroy` 钩子将永远不会被调用。


### `asyncResource.asyncId()` {#asyncresourceasyncid}

- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 分配给资源的唯一 `asyncId`。

### `asyncResource.triggerAsyncId()` {#asyncresourcetriggerasyncid}

- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 传递给 `AsyncResource` 构造函数的相同 `triggerAsyncId`。

### 将 `AsyncResource` 用于 `Worker` 线程池 {#using-asyncresource-for-a-worker-thread-pool}

以下示例展示了如何使用 `AsyncResource` 类来正确地为 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 池提供异步跟踪。其他资源池（如数据库连接池）可以遵循类似的模型。

假设任务是加两个数字，使用一个名为 `task_processor.js` 的文件，内容如下：

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

围绕它的 Worker 池可以使用以下结构：

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
    this.emitDestroy();  // `TaskInfo` 仅使用一次。
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

    // 只要发出 kWorkerFreedEvent，就调度
    // 队列中下一个待处理的任务（如果有）。
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
      // 如果成功：调用传递给 `runTask` 的回调函数，
      // 删除与 Worker 关联的 `TaskInfo`，并将其标记为再次空闲。
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on('error', (err) => {
      // 如果出现未捕获的异常：使用该错误调用传递给
      // `runTask` 的回调。
      if (worker[kTaskInfo])
        worker[kTaskInfo].done(err, null);
      else
        this.emit('error', err);
      // 从列表中删除 worker 并启动一个新的 Worker 以替换
      // 当前的 worker。
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // 没有空闲线程，等待工作线程变为空闲。
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
    this.emitDestroy();  // `TaskInfo` 仅使用一次。
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

    // 只要发出 kWorkerFreedEvent，就调度
    // 队列中下一个待处理的任务（如果有）。
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
      // 如果成功：调用传递给 `runTask` 的回调函数，
      // 删除与 Worker 关联的 `TaskInfo`，并将其标记为再次空闲。
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on('error', (err) => {
      // 如果出现未捕获的异常：使用该错误调用传递给
      // `runTask` 的回调。
      if (worker[kTaskInfo])
        worker[kTaskInfo].done(err, null);
      else
        this.emit('error', err);
      // 从列表中删除 worker 并启动一个新的 Worker 以替换
      // 当前的 worker。
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // 没有空闲线程，等待工作线程变为空闲。
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

如果没有 `WorkerPoolTaskInfo` 对象添加的显式跟踪，回调似乎与各个 `Worker` 对象相关联。 但是，`Worker` 的创建与任务的创建无关，并且不提供有关何时安排任务的信息。

该池可以如下使用：

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


### 将 `AsyncResource` 与 `EventEmitter` 集成 {#integrating-asyncresource-with-eventemitter}

由 [`EventEmitter`](/zh/nodejs/api/events#class-eventemitter) 触发的事件监听器可能在与调用 `eventEmitter.on()` 时激活的执行上下文不同的执行上下文中运行。

以下示例展示了如何使用 `AsyncResource` 类将事件监听器与正确的执行上下文正确关联。同样的方法可以应用于 [`Stream`](/zh/nodejs/api/stream#stream) 或类似的事件驱动类。

::: code-group
```js [ESM]
import { createServer } from 'node:http';
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

const server = createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    // 执行上下文绑定到当前的外部作用域。
  }));
  req.on('close', () => {
    // 执行上下文绑定到导致 'close' 发出的作用域。
  });
  res.end();
}).listen(3000);
```

```js [CJS]
const { createServer } = require('node:http');
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

const server = createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    // 执行上下文绑定到当前的外部作用域。
  }));
  req.on('close', () => {
    // 执行上下文绑定到导致 'close' 发出的作用域。
  });
  res.end();
}).listen(3000);
```
:::

