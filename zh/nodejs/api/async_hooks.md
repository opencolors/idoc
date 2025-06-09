---
title: Node.js 文档 - 异步钩子
description: 了解 Node.js 中的异步钩子 API，它提供了一种跟踪 Node.js 应用程序中异步资源生命周期的方法。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 - 异步钩子 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解 Node.js 中的异步钩子 API，它提供了一种跟踪 Node.js 应用程序中异步资源生命周期的方法。
  - - meta
    - name: twitter:title
      content: Node.js 文档 - 异步钩子 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解 Node.js 中的异步钩子 API，它提供了一种跟踪 Node.js 应用程序中异步资源生命周期的方法。
---


# Async hooks {#async-hooks}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性的。 如果可以，请从这个 API 迁移出去。 我们不建议使用 [`createHook`](/zh/nodejs/api/async_hooks#async_hookscreatehookcallbacks)， [`AsyncHook`](/zh/nodejs/api/async_hooks#class-asynchook)，和 [`executionAsyncResource`](/zh/nodejs/api/async_hooks#async_hooksexecutionasyncresource) API，因为它们存在可用性问题、安全风险和性能影响。 异步上下文跟踪用例可以通过稳定的 [`AsyncLocalStorage`](/zh/nodejs/api/async_context#class-asynclocalstorage) API 更好地实现。 如果除了 [`AsyncLocalStorage`](/zh/nodejs/api/async_context#class-asynclocalstorage) 解决的上下文跟踪需求或 [Diagnostics Channel](/zh/nodejs/api/diagnostics_channel) 当前提供的诊断数据之外，你还有 `createHook`、`AsyncHook` 或 `executionAsyncResource` 的用例，请在 [https://github.com/nodejs/node/issues](https://github.com/nodejs/node/issues) 上创建一个 issue，描述你的用例，以便我们可以创建一个更具有针对性的 API。
:::

**源代码:** [lib/async_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/async_hooks.js)

我们强烈建议不要使用 `async_hooks` API。 可以涵盖其大多数用例的其他 API 包括：

- [`AsyncLocalStorage`](/zh/nodejs/api/async_context#class-asynclocalstorage) 跟踪异步上下文
- [`process.getActiveResourcesInfo()`](/zh/nodejs/api/process#processgetactiveresourcesinfo) 跟踪活动资源

`node:async_hooks` 模块提供了一个 API 来跟踪异步资源。 它可以这样访问：

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';
```

```js [CJS]
const async_hooks = require('node:async_hooks');
```
:::

## 术语 {#terminology}

异步资源表示具有关联回调的对象。 此回调可能会被多次调用，例如 `net.createServer()` 中的 `'connection'` 事件，或者像 `fs.open()` 中那样只调用一次。 资源也可以在回调被调用之前关闭。 `AsyncHook` 不会明确区分这些不同的情况，而是将它们表示为抽象概念，即资源。

如果使用了 [`Worker`](/zh/nodejs/api/worker_threads#class-worker)，则每个线程都有一个独立的 `async_hooks` 接口，并且每个线程将使用一组新的异步 ID。


## 概述 {#overview}

以下是公共 API 的简单概述。

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';

// 返回当前执行上下文的 ID。
const eid = async_hooks.executionAsyncId();

// 返回负责触发当前执行范围的回调调用的句柄的 ID。
const tid = async_hooks.triggerAsyncId();

// 创建一个新的 AsyncHook 实例。 所有这些回调都是可选的。
const asyncHook =
    async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// 允许调用此 AsyncHook 实例的回调。 这不是运行构造函数后的隐式操作，必须显式运行才能开始执行回调。
asyncHook.enable();

// 禁用监听新的异步事件。
asyncHook.disable();

//
// 以下是可以传递给 createHook() 的回调。
//

// init() 在对象构造期间被调用。 当此回调运行时，资源可能尚未完成构造。 因此，"asyncId" 引用的资源的所有字段可能尚未填充。
function init(asyncId, type, triggerAsyncId, resource) { }

// before() 在资源的回调被调用之前被调用。 对于句柄（例如 TCPWrap），它可以被调用 0-N 次，对于请求（例如 FSReqCallback），它将被调用 1 次。
function before(asyncId) { }

// after() 在资源的回调完成后立即被调用。
function after(asyncId) { }

// destroy() 在资源被销毁时被调用。
function destroy(asyncId) { }

// promiseResolve() 仅针对 promise 资源调用，当调用传递给 Promise 构造函数的 resolve() 函数时（直接或通过解析 promise 的其他方式）。
function promiseResolve(asyncId) { }
```

```js [CJS]
const async_hooks = require('node:async_hooks');

// 返回当前执行上下文的 ID。
const eid = async_hooks.executionAsyncId();

// 返回负责触发当前执行范围的回调调用的句柄的 ID。
const tid = async_hooks.triggerAsyncId();

// 创建一个新的 AsyncHook 实例。 所有这些回调都是可选的。
const asyncHook =
    async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// 允许调用此 AsyncHook 实例的回调。 这不是运行构造函数后的隐式操作，必须显式运行才能开始执行回调。
asyncHook.enable();

// 禁用监听新的异步事件。
asyncHook.disable();

//
// 以下是可以传递给 createHook() 的回调。
//

// init() 在对象构造期间被调用。 当此回调运行时，资源可能尚未完成构造。 因此，"asyncId" 引用的资源的所有字段可能尚未填充。
function init(asyncId, type, triggerAsyncId, resource) { }

// before() 在资源的回调被调用之前被调用。 对于句柄（例如 TCPWrap），它可以被调用 0-N 次，对于请求（例如 FSReqCallback），它将被调用 1 次。
function before(asyncId) { }

// after() 在资源的回调完成后立即被调用。
function after(asyncId) { }

// destroy() 在资源被销毁时被调用。
function destroy(asyncId) { }

// promiseResolve() 仅针对 promise 资源调用，当调用传递给 Promise 构造函数的 resolve() 函数时（直接或通过解析 promise 的其他方式）。
function promiseResolve(asyncId) { }
```
:::


## `async_hooks.createHook(callbacks)` {#async_hookscreatehookcallbacks}

**Added in: v8.1.0**

- `callbacks` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 要注册的 [钩子回调](/zh/nodejs/api/async_hooks#hook-callbacks)
    - `init` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`init` 回调](/zh/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource)。
    - `before` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`before` 回调](/zh/nodejs/api/async_hooks#beforeasyncid)。
    - `after` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`after` 回调](/zh/nodejs/api/async_hooks#afterasyncid)。
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`destroy` 回调](/zh/nodejs/api/async_hooks#destroyasyncid)。
    - `promiseResolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`promiseResolve` 回调](/zh/nodejs/api/async_hooks#promiseresolveasyncid)。
  
 
- 返回: [\<AsyncHook\>](/zh/nodejs/api/async_hooks#async_hookscreatehookcallbacks) 用于禁用和启用钩子的实例

注册要在每个异步操作的不同生命周期事件中调用的函数。

`init()`/`before()`/`after()`/`destroy()` 回调会在资源的生命周期内的各个异步事件中被调用。

所有回调都是可选的。 例如，如果只需要跟踪资源清理，则只需要传递 `destroy` 回调。 可以传递给 `callbacks` 的所有函数的详细信息在 [钩子回调](/zh/nodejs/api/async_hooks#hook-callbacks) 部分中。

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

回调将通过原型链继承：

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
因为 promise 是异步资源，其生命周期通过 async hooks 机制跟踪，所以 `init()`、`before()`、`after()` 和 `destroy()` 回调*不能*是返回 promise 的异步函数。


### 错误处理 {#error-handling}

如果任何 `AsyncHook` 回调抛出错误，应用程序将打印堆栈跟踪并退出。退出路径与未捕获异常的路径相同，但所有 `'uncaughtException'` 监听器都会被移除，从而强制进程退出。除非应用程序以 `--abort-on-uncaught-exception` 运行，否则 `'exit'` 回调仍然会被调用，在这种情况下，将打印堆栈跟踪并且应用程序退出，留下一个核心文件。

这种错误处理行为的原因是这些回调在对象生命周期中潜在的不稳定点运行，例如在类构造和销毁期间。因此，认为有必要快速停止进程，以防止将来发生意外中止。如果进行全面的分析以确保异常可以遵循正常的控制流而不会产生意外的副作用，则将来可能会对此进行更改。

### 在 `AsyncHook` 回调中打印 {#printing-in-asynchook-callbacks}

由于打印到控制台是一个异步操作，因此 `console.log()` 将导致调用 `AsyncHook` 回调。在 `AsyncHook` 回调函数中使用 `console.log()` 或类似的异步操作将导致无限递归。调试时一个简单的解决方案是使用同步日志记录操作，例如 `fs.writeFileSync(file, msg, flag)`。这将打印到文件，并且不会以递归方式调用 `AsyncHook`，因为它​​是同步的。

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

如果日志记录需要异步操作，则可以使用 `AsyncHook` 本身提供的信息来跟踪导致异步操作的原因。然后，当日志记录本身导致调用 `AsyncHook` 回调时，应跳过日志记录。通过这样做，可以打破原本无限的递归。


## 类: `AsyncHook` {#class-asynchook}

`AsyncHook` 类公开了一个接口，用于跟踪异步操作的生命周期事件。

### `asyncHook.enable()` {#asynchookenable}

- 返回: [\<AsyncHook\>](/zh/nodejs/api/async_hooks#async_hookscreatehookcallbacks) 对 `asyncHook` 的引用。

启用给定 `AsyncHook` 实例的回调。 如果未提供任何回调，则启用操作无效。

`AsyncHook` 实例默认处于禁用状态。 如果应在创建后立即启用 `AsyncHook` 实例，则可以使用以下模式。

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

- 返回: [\<AsyncHook\>](/zh/nodejs/api/async_hooks#async_hookscreatehookcallbacks) 对 `asyncHook` 的引用。

从要执行的 `AsyncHook` 回调的全局池中禁用给定 `AsyncHook` 实例的回调。 禁用钩子后，除非启用，否则不会再次调用该钩子。

为了 API 的一致性，`disable()` 也会返回 `AsyncHook` 实例。

### 钩子回调 {#hook-callbacks}

异步事件生命周期中的关键事件分为四个方面：实例化、调用回调之前/之后以及销毁实例时。

#### `init(asyncId, type, triggerAsyncId, resource)` {#initasyncid-type-triggerasyncid-resource}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 异步资源的唯一 ID。
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 异步资源的类型。
- `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在其执行上下文中创建此异步资源的异步资源的唯一 ID。
- `resource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 对表示异步操作的资源的引用，需要在 *destroy* 期间释放。

当构造一个*可能*发出异步事件的类时调用。 这*并不*意味着实例必须在调用 `destroy` 之前调用 `before`/`after`，只是存在这种可能性。

可以通过执行诸如打开资源，然后在可以使用该资源之前关闭它的操作来观察此行为。 以下代码段演示了这一点。

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

每个新资源都被分配一个 ID，该 ID 在当前 Node.js 实例的范围内是唯一的。


##### `type` {#type}

`type` 是一个字符串，用于标识导致调用 `init` 的资源的类型。通常，它将对应于资源构造函数的名称。

Node.js 本身创建的资源的 `type` 可能会在任何 Node.js 版本中更改。有效值包括 `TLSWRAP`、`TCPWRAP`、`TCPSERVERWRAP`、`GETADDRINFOREQWRAP`、`FSREQCALLBACK`、`Microtask` 和 `Timeout`。检查所使用的 Node.js 版本的源代码以获取完整列表。

此外，[`AsyncResource`](/zh/nodejs/api/async_context#class-asyncresource) 的用户可以创建独立于 Node.js 本身的异步资源。

还有 `PROMISE` 资源类型，用于跟踪 `Promise` 实例以及它们调度的异步工作。

使用公共嵌入器 API 时，用户可以定义自己的 `type`。

可能会发生类型名称冲突。建议嵌入器使用唯一的前缀，例如 npm 包名称，以防止在侦听钩子时发生冲突。

##### `triggerAsyncId` {#triggerasyncid}

`triggerAsyncId` 是导致（或“触发”）新资源初始化并导致 `init` 调用的资源的 `asyncId`。这与仅显示资源 *何时* 创建的 `async_hooks.executionAsyncId()` 不同，而 `triggerAsyncId` 显示资源 *为什么* 创建。

以下是 `triggerAsyncId` 的一个简单演示：

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

使用 `nc localhost 8080` 访问服务器时的输出：

```bash [BASH]
TCPSERVERWRAP(5): trigger: 1 execution: 1
TCPWRAP(7): trigger: 5 execution: 0
```
`TCPSERVERWRAP` 是接收连接的服务器。

`TCPWRAP` 是来自客户端的新连接。建立新连接时，会立即构造 `TCPWrap` 实例。这发生在任何 JavaScript 堆栈之外。（`executionAsyncId()` 为 `0` 意味着它正在从 C++ 执行，并且其上没有 JavaScript 堆栈。）仅凭这些信息，不可能将资源链接在一起，以确定是什么导致了它们的创建，因此 `triggerAsyncId` 的任务是传播哪个资源负责新资源的存在。


##### `resource` {#resource}

`resource` 是一个对象，代表已经初始化的实际异步资源。访问该对象的 API 可以由资源的创建者指定。Node.js 本身创建的资源是内部资源，可能随时更改。因此，没有为这些资源指定 API。

在某些情况下，出于性能原因，资源对象会被重用，因此将其用作 `WeakMap` 中的键或向其添加属性是不安全的。

##### 异步上下文示例 {#asynchronous-context-example}

上下文跟踪用例由稳定的 API [`AsyncLocalStorage`](/zh/nodejs/api/async_context#class-asynclocalstorage) 覆盖。此示例仅说明异步钩子的操作，但 [`AsyncLocalStorage`](/zh/nodejs/api/async_context#class-asynclocalstorage) 更适合此用例。

以下是一个示例，其中包含有关 `before` 和 `after` 调用之间对 `init` 的调用的附加信息，特别是 `listen()` 的回调会是什么样子。输出格式略微复杂，以便更容易看到调用上下文。

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

仅启动服务器的输出：

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

如示例所示，`executionAsyncId()` 和 `execution` 各自指定当前执行上下文的值；该上下文由对 `before` 和 `after` 的调用来划分。

仅使用 `execution` 来绘制资源分配图会导致以下结果：

```bash [BASH]
  root(1)
     ^
     |
TickObject(6)
     ^
     |
 Timeout(7)
```

`TCPSERVERWRAP` 不在此图中，即使它是调用 `console.log()` 的原因。这是因为绑定到没有主机名的端口是一个*同步*操作，但为了保持完全异步的 API，用户的回调被放置在 `process.nextTick()` 中。这就是为什么 `TickObject` 出现在输出中并且是 `.listen()` 回调的“父级”。

该图仅显示资源 *何时* 创建，而不显示 *为什么* 创建，因此要跟踪 *为什么*，请使用 `triggerAsyncId`。这可以用以下图表示：

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

当异步操作启动（例如 TCP 服务器接收到新连接）或完成（例如将数据写入磁盘）时，会调用回调来通知用户。`before` 回调在执行上述回调之前调用。 `asyncId` 是分配给即将执行回调的资源的唯一标识符。

`before` 回调将被调用 0 到 N 次。 如果异步操作被取消，或者例如 TCP 服务器未收到任何连接，则 `before` 回调通常会被调用 0 次。 像 TCP 服务器这样的持久异步资源通常会多次调用 `before` 回调，而像 `fs.open()` 这样的其他操作只会调用一次。

#### `after(asyncId)` {#afterasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

在 `before` 中指定的回调完成后立即调用。

如果在执行回调期间发生未捕获的异常，则 `after` 将在发出 `'uncaughtException'` 事件或运行 `domain` 的处理程序*之后*运行。

#### `destroy(asyncId)` {#destroyasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

在与 `asyncId` 对应的资源被销毁后调用。 它也从嵌入器 API `emitDestroy()` 异步调用。

某些资源依赖垃圾回收进行清理，因此如果引用传递给 `init` 的 `resource` 对象，则 `destroy` 可能永远不会被调用，从而导致应用程序中的内存泄漏。 如果该资源不依赖垃圾回收，则这不是问题。

使用 destroy 钩子会导致额外的开销，因为它允许通过垃圾收集器跟踪 `Promise` 实例。

#### `promiseResolve(asyncId)` {#promiseresolveasyncid}

**添加于: v8.6.0**

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

当调用传递给 `Promise` 构造函数的 `resolve` 函数时调用（无论是直接还是通过其他方式解析 promise）。

`resolve()` 不执行任何可观察的同步工作。

如果 `Promise` 通过承担另一个 `Promise` 的状态来解决，则此时 `Promise` 不一定被 fulfilled 或 rejected 。

```js [ESM]
new Promise((resolve) => resolve(true)).then((a) => {});
```
调用以下回调：

```text [TEXT]
init for PROMISE with id 5, trigger id: 1
  promise resolve 5      # 对应于 resolve(true)
init for PROMISE with id 6, trigger id: 5  # then() 返回的 Promise
  before 6               # 进入 then() 回调
  promise resolve 6      # then() 回调通过返回来解析 promise
  after 6
```

### `async_hooks.executionAsyncResource()` {#async_hooksexecutionasyncresource}

**已加入版本: v13.9.0, v12.17.0**

- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 代表当前执行的资源。 可用于在资源中存储数据。

`executionAsyncResource()` 返回的资源对象通常是带有未公开 API 的 Node.js 内部句柄对象。 使用对象上的任何函数或属性都可能导致应用程序崩溃，应避免使用。

在顶层执行上下文中使用 `executionAsyncResource()` 将返回一个空对象，因为没有句柄或请求对象可以使用，但是拥有一个代表顶层的对象可能会有所帮助。

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

这可以用于实现连续本地存储，而无需使用跟踪 `Map` 来存储元数据：

::: code-group
```js [ESM]
import { createServer } from 'node:http';
import {
  executionAsyncId,
  executionAsyncResource,
  createHook,
} from 'node:async_hooks';
const sym = Symbol('state'); // 私有符号，避免污染

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
const sym = Symbol('state'); // 私有符号，避免污染

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

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v8.2.0 | 从 `currentId` 重命名。 |
| v8.1.0 | 添加于: v8.1.0 |
:::

- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 当前执行上下文的 `asyncId`。 用于跟踪何时调用某个内容。

::: code-group
```js [ESM]
import { executionAsyncId } from 'node:async_hooks';
import fs from 'node:fs';

console.log(executionAsyncId());  // 1 - 引导
const path = '.';
fs.open(path, 'r', (err, fd) => {
  console.log(executionAsyncId());  // 6 - open()
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');
const fs = require('node:fs');

console.log(async_hooks.executionAsyncId());  // 1 - 引导
const path = '.';
fs.open(path, 'r', (err, fd) => {
  console.log(async_hooks.executionAsyncId());  // 6 - open()
});
```
:::

从 `executionAsyncId()` 返回的 ID 与执行时序相关，而不是因果关系（由 `triggerAsyncId()` 涵盖）：

```js [ESM]
const server = net.createServer((conn) => {
  // 返回服务器的 ID，而不是新连接的 ID，因为该
  // 回调在服务器的 MakeCallback() 的执行范围内运行。
  async_hooks.executionAsyncId();

}).listen(port, () => {
  // 返回 TickObject (process.nextTick()) 的 ID，因为所有传递给
  // .listen() 的回调都包含在 nextTick() 中。
  async_hooks.executionAsyncId();
});
```
默认情况下，Promise 上下文可能无法获得精确的 `executionAsyncIds`。 请参阅有关 [promise 执行跟踪](/zh/nodejs/api/async_hooks#promise-execution-tracking)的部分。

### `async_hooks.triggerAsyncId()` {#async_hookstriggerasyncid}

- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 负责调用当前正在执行的回调的资源的 ID。

```js [ESM]
const server = net.createServer((conn) => {
  // 导致（或触发）调用此回调的资源
  // 是新连接的资源。 因此 triggerAsyncId() 的返回值
  // 是 "conn" 的 asyncId。
  async_hooks.triggerAsyncId();

}).listen(port, () => {
  // 即使传递给 .listen() 的所有回调都包含在 nextTick() 中
  // 回调本身存在是因为调用了服务器的 .listen()
  // 已制作。 因此，返回值将是服务器的 ID。
  async_hooks.triggerAsyncId();
});
```
默认情况下，Promise 上下文可能无法获得有效的 `triggerAsyncId`。 请参阅有关 [promise 执行跟踪](/zh/nodejs/api/async_hooks#promise-execution-tracking)的部分。


### `async_hooks.asyncWrapProviders` {#async_hooksasyncwrapproviders}

**新增于: v17.2.0, v16.14.0**

- 返回值: 一个将提供程序类型映射到相应数字 ID 的映射。 此映射包含可能由 `async_hooks.init()` 事件发出的所有事件类型。

此特性抑制了已弃用的 `process.binding('async_wrap').Providers` 的使用。 参见： [DEP0111](/zh/nodejs/api/deprecations#dep0111-processbinding)

## Promise 执行跟踪 {#promise-execution-tracking}

默认情况下，由于 V8 提供的 [promise 自省 API](https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit) 的相对昂贵的特性，Promise 执行不会分配 `asyncId`。 这意味着使用 promise 或 `async`/`await` 的程序默认情况下不会获得正确的 promise 回调上下文的执行和触发器 ID。

::: code-group
```js [ESM]
import { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// 产生:
// eid 1 tid 0
```

```js [CJS]
const { executionAsyncId, triggerAsyncId } = require('node:async_hooks');

Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// 产生:
// eid 1 tid 0
```
:::

请注意，即使存在异步跳转，`then()` 回调也声称已在外部作用域的上下文中执行。 此外，`triggerAsyncId` 值为 `0`，这意味着我们缺少有关导致（触发）`then()` 回调执行的资源的上下文。

通过 `async_hooks.createHook` 安装异步钩子可以启用 promise 执行跟踪：

::: code-group
```js [ESM]
import { createHook, executionAsyncId, triggerAsyncId } from 'node:async_hooks';
createHook({ init() {} }).enable(); // 强制启用 PromiseHooks。
Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// 产生:
// eid 7 tid 6
```

```js [CJS]
const { createHook, executionAsyncId, triggerAsyncId } = require('node:async_hooks');

createHook({ init() {} }).enable(); // 强制启用 PromiseHooks。
Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// 产生:
// eid 7 tid 6
```
:::

在此示例中，添加任何实际的钩子函数都可以启用 promise 的跟踪。 上面的例子中有两个 promise； 由 `Promise.resolve()` 创建的 promise 和由调用 `then()` 返回的 promise。 在上面的例子中，第一个 promise 获得了 `asyncId` `6`，后者获得了 `asyncId` `7`。 在执行 `then()` 回调期间，我们正在具有 `asyncId` `7` 的 promise 的上下文中执行。 此 promise 由异步资源 `6` 触发。

Promise 的另一个微妙之处在于，`before` 和 `after` 回调仅在链式 Promise 上运行。 这意味着并非由 `then()`/`catch()` 创建的 Promise 将不会在其上触发 `before` 和 `after` 回调。 更多详情请参见 V8 [PromiseHooks](https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit) API 的详细信息。


## JavaScript 嵌入器 API {#javascript-embedder-api}

处理自身异步资源（执行 I/O、连接池或管理回调队列等任务）的库开发者可以使用 `AsyncResource` JavaScript API，以便调用所有适当的回调。

### 类: `AsyncResource` {#class-asyncresource}

此类的文档已移动到 [`AsyncResource`](/zh/nodejs/api/async_context#class-asyncresource)。

## 类: `AsyncLocalStorage` {#class-asynclocalstorage}

此类的文档已移动到 [`AsyncLocalStorage`](/zh/nodejs/api/async_context#class-asynclocalstorage)。

