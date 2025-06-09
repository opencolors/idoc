---
title: Node.js 进程 API 文档
description: 关于 Node.js 进程模块的详细文档，涵盖进程管理、环境变量、信号等内容。
head:
  - - meta
    - name: og:title
      content: Node.js 进程 API 文档 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 关于 Node.js 进程模块的详细文档，涵盖进程管理、环境变量、信号等内容。
  - - meta
    - name: twitter:title
      content: Node.js 进程 API 文档 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 关于 Node.js 进程模块的详细文档，涵盖进程管理、环境变量、信号等内容。
---


# 进程 {#process}

**源码:** [lib/process.js](https://github.com/nodejs/node/blob/v23.5.0/lib/process.js)

`process` 对象提供有关当前 Node.js 进程的信息和控制。

::: code-group
```js [ESM]
import process from 'node:process';
```

```js [CJS]
const process = require('node:process');
```
:::

## 进程事件 {#process-events}

`process` 对象是 [`EventEmitter`](/zh/nodejs/api/events#class-eventemitter) 的一个实例。

### 事件: `'beforeExit'` {#event-beforeexit}

**新增于: v0.11.12**

当 Node.js 清空其事件循环且没有要调度的其他工作时，会触发 `'beforeExit'` 事件。 通常，当没有要调度的任务时，Node.js 进程将退出，但是在 `'beforeExit'` 事件上注册的侦听器可以进行异步调用，从而导致 Node.js 进程继续。

使用作为唯一参数传递的 [`process.exitCode`](/zh/nodejs/api/process#processexitcode_1) 的值调用侦听器回调函数。

对于导致显式终止的情况，例如调用 [`process.exit()`](/zh/nodejs/api/process#processexitcode) 或未捕获的异常，*不*会触发 `'beforeExit'` 事件。

除非目的是安排其他工作，否则*不*应将 `'beforeExit'` 用作 `'exit'` 事件的替代方法。

::: code-group
```js [ESM]
import process from 'node:process';

process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});

console.log('This message is displayed first.');

// Prints:
// This message is displayed first.
// Process beforeExit event with code: 0
// Process exit event with code: 0
```

```js [CJS]
const process = require('node:process');

process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});

console.log('This message is displayed first.');

// Prints:
// This message is displayed first.
// Process beforeExit event with code: 0
// Process exit event with code: 0
```
:::


### 事件: `'disconnect'` {#event-disconnect}

**加入版本: v0.7.7**

如果 Node.js 进程是通过 IPC 通道派生的（参见 [子进程](/zh/nodejs/api/child_process) 和 [集群](/zh/nodejs/api/cluster) 文档），那么当 IPC 通道关闭时，将会触发 `'disconnect'` 事件。

### 事件: `'exit'` {#event-exit}

**加入版本: v0.1.7**

- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

当 Node.js 进程即将退出时，会触发 `'exit'` 事件，退出原因如下：

- 显式调用了 `process.exit()` 方法；
- Node.js 事件循环不再有任何额外的工作要执行。

此时无法阻止事件循环的退出，一旦所有 `'exit'` 监听器都运行完毕，Node.js 进程将终止。

监听器回调函数会使用 [`process.exitCode`](/zh/nodejs/api/process#processexitcode_1) 属性指定的退出码或传递给 [`process.exit()`](/zh/nodejs/api/process#processexitcode) 方法的 `exitCode` 参数来调用。

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

监听器函数**必须**只执行**同步**操作。 Node.js 进程会在调用 `'exit'` 事件监听器后立即退出，导致事件循环中仍在排队的任何额外工作被放弃。 例如，在以下示例中，超时永远不会发生：

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


### 事件：`'message'` {#event-message}

**加入于：v0.5.10**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 一个已解析的 JSON 对象或一个可序列化的原始值。
- `sendHandle` [\<net.Server\>](/zh/nodejs/api/net#class-netserver) | [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket) 一个 [`net.Server`](/zh/nodejs/api/net#class-netserver) 或 [`net.Socket`](/zh/nodejs/api/net#class-netsocket) 对象，或 undefined。

如果 Node.js 进程是通过 IPC 通道产生的（参见[子进程](/zh/nodejs/api/child_process)和[集群](/zh/nodejs/api/cluster)文档），则每当父进程使用 [`childprocess.send()`](/zh/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) 发送的消息被子进程接收时，就会触发 `'message'` 事件。

消息会经过序列化和解析。 生成的消息可能与最初发送的消息不同。

如果在生成进程时将 `serialization` 选项设置为 `advanced`，则 `message` 参数可以包含 JSON 无法表示的数据。 有关更多详细信息，请参见[子进程的高级序列化](/zh/nodejs/api/child_process#advanced-serialization)。

### 事件：`'multipleResolves'` {#event-multipleresolves}

**加入于：v10.12.0**

**自以下版本弃用：v17.6.0, v16.15.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 解析类型。 `'resolve'` 或 `'reject'` 之一。
- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 解析或拒绝多次的 promise。
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 在原始解析后 promise 被解析或拒绝的值。

每当 `Promise` 具有以下情况时，就会触发 `'multipleResolves'` 事件：

- 解析多次。
- 拒绝多次。
- 在解析后拒绝。
- 在拒绝后解析。

这对于在使用 `Promise` 构造函数时跟踪应用程序中的潜在错误很有用，因为多次解析会被默默地吞噬。 但是，此事件的发生并不一定表示错误。 例如，[`Promise.race()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) 可以触发 `'multipleResolves'` 事件。

由于在诸如上面的 [`Promise.race()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) 示例的情况下事件的不可靠性，因此已将其弃用。

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


### 事件: `'rejectionHandled'` {#event-rejectionhandled}

**新增于: v1.4.1**

- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 后期处理的 Promise。

当 `Promise` 被拒绝，并且在晚于 Node.js 事件循环的一轮之后，为其附加了错误处理程序（例如，使用 [`promise.catch()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)）时，会触发 `'rejectionHandled'` 事件。

`Promise` 对象之前已经在 `'unhandledRejection'` 事件中触发过，但在处理过程中获得了拒绝处理程序。

对于 `Promise` 链，不存在一个顶级概念，可以在该顶级概念中始终处理拒绝。由于其本质上是异步的，因此可以在未来的某个时间点处理 `Promise` 拒绝，该时间点可能比触发 `'unhandledRejection'` 事件的事件循环轮次晚得多。

另一种说法是，与同步代码中未处理异常的列表不断增长不同，对于 Promise，未处理拒绝的列表可能会增长和缩小。

在同步代码中，当未处理异常的列表增长时，会触发 `'uncaughtException'` 事件。

在异步代码中，当未处理拒绝的列表增长时，会触发 `'unhandledRejection'` 事件，而当未处理拒绝的列表缩小时，会触发 `'rejectionHandled'` 事件。

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

在此示例中，`unhandledRejections` `Map` 会随着时间的推移而增长和缩小，反映了开始时未处理然后变为已处理的拒绝。 可以将此类错误记录在错误日志中，无论是定期记录（这可能最适合长时间运行的应用程序）还是在进程退出时记录（这可能最方便脚本）。


### 事件: `'workerMessage'` {#event-workermessage}

**新增于: v22.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 使用 [`postMessageToThread()`](/zh/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) 传输的值。
- `source` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 传输的工作线程 ID，如果是主线程则为 `0`。

每当另一方使用 [`postMessageToThread()`](/zh/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) 发送传入消息时，就会触发 `'workerMessage'` 事件。

### 事件: `'uncaughtException'` {#event-uncaughtexception}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.0.0, v10.17.0 | 添加了 `origin` 参数。 |
| v0.1.18 | 新增于: v0.1.18 |
:::

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 未捕获的异常。
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 指示异常是否源自未处理的拒绝或同步错误。 可以是 `'uncaughtException'` 或 `'unhandledRejection'`。 后者用于在基于 `Promise` 的异步上下文中发生异常时（或者如果 `Promise` 被拒绝）并且 [`--unhandled-rejections`](/zh/nodejs/api/cli#--unhandled-rejectionsmode) 标志设置为 `strict` 或 `throw`（默认值），并且未处理拒绝，或者在命令行入口点的 ES 模块静态加载阶段发生拒绝时。

当未捕获的 JavaScript 异常一路冒泡回事件循环时，会触发 `'uncaughtException'` 事件。 默认情况下，Node.js 通过将堆栈跟踪打印到 `stderr` 并以代码 1 退出来处理此类异常，从而覆盖任何先前设置的 [`process.exitCode`](/zh/nodejs/api/process#processexitcode_1)。 添加 `'uncaughtException'` 事件的处理程序会覆盖此默认行为。 或者，更改 `'uncaughtException'` 处理程序中的 [`process.exitCode`](/zh/nodejs/api/process#processexitcode_1) 将导致进程以提供的退出代码退出。 否则，如果存在此类处理程序，进程将以 0 退出。

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

可以通过安装 `'uncaughtExceptionMonitor'` 监听器来监视 `'uncaughtException'` 事件，而无需覆盖退出进程的默认行为。


#### 警告：正确使用 `'uncaughtException'` {#warning-using-uncaughtexception-correctly}

`'uncaughtException'` 是一种粗略的异常处理机制，仅用作最后的手段。该事件*不应*用作 `On Error Resume Next` 的等效替代。未处理的异常本质上意味着应用程序处于未定义状态。尝试在没有从异常中正确恢复的情况下恢复应用程序代码可能会导致其他无法预见和不可预测的问题。

从事件处理程序内部抛出的异常将不会被捕获。相反，进程将以非零退出代码退出，并打印堆栈跟踪。这是为了避免无限递归。

在未捕获的异常后尝试正常恢复，类似于在升级计算机时拔掉电源线。十次中有九次什么也不会发生。但第十次，系统会损坏。

`'uncaughtException'` 的正确用法是在关闭进程之前执行已分配资源（例如，文件描述符、句柄等）的同步清理。**在 <code>'uncaughtException'</code> 之后恢复正常运行是不安全的。**

要以更可靠的方式重新启动崩溃的应用程序，无论是否发出 `'uncaughtException'`，都应在单独的进程中使用外部监视器来检测应用程序故障并根据需要恢复或重新启动。

### 事件：`'uncaughtExceptionMonitor'` {#event-uncaughtexceptionmonitor}

**添加于：v13.7.0, v12.17.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 未捕获的异常。
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 指示异常是源自未处理的拒绝还是源自同步错误。可以是 `'uncaughtException'` 或 `'unhandledRejection'`。后者用于当异常发生在基于 `Promise` 的异步上下文中（或者当 `Promise` 被拒绝时），并且 [`--unhandled-rejections`](/zh/nodejs/api/cli#--unhandled-rejectionsmode) 标志设置为 `strict` 或 `throw`（这是默认设置）且拒绝未被处理，或者当拒绝发生在命令行入口点的 ES 模块静态加载阶段。

`'uncaughtExceptionMonitor'` 事件在发出 `'uncaughtException'` 事件或通过 [`process.setUncaughtExceptionCaptureCallback()`](/zh/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) 安装钩子之前发出。

安装 `'uncaughtExceptionMonitor'` 监听器不会改变发出 `'uncaughtException'` 事件后的行为。如果没有安装 `'uncaughtException'` 监听器，进程仍然会崩溃。

::: code-group
```js [ESM]
import process from 'node:process';

process.on('uncaughtExceptionMonitor', (err, origin) => {
  MyMonitoringTool.logSync(err, origin);
});

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
// Still crashes Node.js
```

```js [CJS]
const process = require('node:process');

process.on('uncaughtExceptionMonitor', (err, origin) => {
  MyMonitoringTool.logSync(err, origin);
});

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
// Still crashes Node.js
```
:::


### 事件: `'unhandledRejection'` {#event-unhandledrejection}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v7.0.0 | 不处理 `Promise` 拒绝已被弃用。 |
| v6.6.0 | 未处理的 `Promise` 拒绝现在将发出一个进程警告。 |
| v1.4.1 | 添加于: v1.4.1 |
:::

- `reason` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Promise 被拒绝的对象（通常是 [`Error`](/zh/nodejs/api/errors#class-error) 对象）。
- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 被拒绝的 Promise。

每当 `Promise` 被拒绝，且在事件循环的一个回合内没有错误处理程序附加到该 Promise 时，就会发出 `'unhandledRejection'` 事件。 在使用 Promise 编程时，异常被封装为“被拒绝的 Promise”。 可以使用 [`promise.catch()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) 捕获和处理拒绝，并通过 `Promise` 链传播。 `'unhandledRejection'` 事件可用于检测和跟踪被拒绝但其拒绝尚未被处理的 Promise。

::: code-group
```js [ESM]
import process from 'node:process';

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // 此处为应用程序特定的日志记录、抛出错误或其他逻辑
});

somePromise.then((res) => {
  return reportToUser(JSON.pasre(res)); // 注意拼写错误 (`pasre`)
}); // 没有 `.catch()` 或 `.then()`
```

```js [CJS]
const process = require('node:process');

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // 此处为应用程序特定的日志记录、抛出错误或其他逻辑
});

somePromise.then((res) => {
  return reportToUser(JSON.pasre(res)); // 注意拼写错误 (`pasre`)
}); // 没有 `.catch()` 或 `.then()`
```
:::

以下代码也会触发 `'unhandledRejection'` 事件的发出：

::: code-group
```js [ESM]
import process from 'node:process';

function SomeResource() {
  // 最初将加载状态设置为被拒绝的 Promise
  this.loaded = Promise.reject(new Error('Resource not yet loaded!'));
}

const resource = new SomeResource();
// 在至少一个回合内，resource.loaded 上没有 .catch 或 .then
```

```js [CJS]
const process = require('node:process');

function SomeResource() {
  // 最初将加载状态设置为被拒绝的 Promise
  this.loaded = Promise.reject(new Error('Resource not yet loaded!'));
}

const resource = new SomeResource();
// 在至少一个回合内，resource.loaded 上没有 .catch 或 .then
```
:::

在此示例中，可以将拒绝跟踪为开发者错误，这通常是其他 `'unhandledRejection'` 事件的情况。 为了解决此类故障，可以将非操作型的 [`.catch(() =\> { })`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) 处理程序附加到 `resource.loaded`，这将阻止发出 `'unhandledRejection'` 事件。


### 事件：`'warning'` {#event-warning}

**加入于: v6.0.0**

- `warning` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 警告的关键属性是：
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 警告的名称。**默认值:** `'Warning'`。
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 系统提供的警告描述。
    - `stack` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 代码中发出警告的位置的堆栈跟踪。

每当 Node.js 发出进程警告时，就会触发 `'warning'` 事件。

进程警告类似于错误，因为它描述了引起用户注意的异常情况。但是，警告不是常规 Node.js 和 JavaScript 错误处理流程的一部分。当 Node.js 检测到可能导致次优应用程序性能、错误或安全漏洞的不良编码习惯时，它可以发出警告。

::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);    // 打印警告名称
  console.warn(warning.message); // 打印警告消息
  console.warn(warning.stack);   // 打印堆栈跟踪
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);    // 打印警告名称
  console.warn(warning.message); // 打印警告消息
  console.warn(warning.stack);   // 打印堆栈跟踪
});
```
:::

默认情况下，Node.js 会将进程警告打印到 `stderr`。可以使用 `--no-warnings` 命令行选项来禁止默认的控制台输出，但 `process` 对象仍然会发出 `'warning'` 事件。目前，除了弃用警告之外，无法禁止特定的警告类型。要禁止弃用警告，请查看 [`--no-deprecation`](/zh/nodejs/api/cli#--no-deprecation) 标志。

以下示例说明了当事件添加了太多监听器时打印到 `stderr` 的警告：

```bash [BASH]
$ node
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> (node:38638) MaxListenersExceededWarning: Possible EventEmitter memory leak
detected. 2 foo listeners added. Use emitter.setMaxListeners() to increase limit
```
相反，以下示例关闭了默认警告输出，并为 `'warning'` 事件添加了自定义处理程序：

```bash [BASH]
$ node --no-warnings
> const p = process.on('warning', (warning) => console.warn('Do not do that!'));
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> Do not do that!
```
可以使用 `--trace-warnings` 命令行选项，使警告的默认控制台输出包含警告的完整堆栈跟踪。

使用 `--throw-deprecation` 命令行标志启动 Node.js 将导致自定义弃用警告作为异常抛出。

使用 `--trace-deprecation` 命令行标志将导致自定义弃用与堆栈跟踪一起打印到 `stderr`。

使用 `--no-deprecation` 命令行标志将禁止所有自定义弃用的报告。

`*-deprecation` 命令行标志仅影响使用名称 `'DeprecationWarning'` 的警告。


#### 发出自定义警告 {#emitting-custom-warnings}

请参阅 [`process.emitWarning()`](/zh/nodejs/api/process#processemitwarningwarning-type-code-ctor) 方法以发出自定义或特定于应用程序的警告。

#### Node.js 警告名称 {#nodejs-warning-names}

对于 Node.js 发出的警告类型（由 `name` 属性标识），没有严格的指导原则。 随时可以添加新的警告类型。 几种最常见的警告类型包括：

- `'DeprecationWarning'` - 表示使用了已弃用的 Node.js API 或功能。 此类警告必须包含一个 `'code'` 属性，用于标识[弃用代码](/zh/nodejs/api/deprecations)。
- `'ExperimentalWarning'` - 表示使用了实验性的 Node.js API 或功能。 应谨慎使用此类功能，因为它们可能随时更改，并且不受与受支持功能相同的严格语义版本控制和长期支持策略的约束。
- `'MaxListenersExceededWarning'` - 表示在 `EventEmitter` 或 `EventTarget` 上为给定事件注册了太多监听器。 这通常是内存泄漏的迹象。
- `'TimeoutOverflowWarning'` - 表示已将无法容纳在 32 位有符号整数中的数值提供给 `setTimeout()` 或 `setInterval()` 函数。
- `'TimeoutNegativeWarning'` - 表示已将负数提供给 `setTimeout()` 或 `setInterval()` 函数。
- `'TimeoutNaNWarning'` - 表示已将非数字的值提供给 `setTimeout()` 或 `setInterval()` 函数。
- `'UnsupportedWarning'` - 表示使用了不受支持的选项或功能，该选项或功能将被忽略，而不是被视为错误。 一个例子是在使用 HTTP/2 兼容性 API 时使用 HTTP 响应状态消息。

### 事件: `'worker'` {#event-worker}

**Added in: v16.2.0, v14.18.0**

- `worker` [\<Worker\>](/zh/nodejs/api/worker_threads#class-worker) 创建的 [\<Worker\>](/zh/nodejs/api/worker_threads#class-worker)。

在创建新的 [\<Worker\>](/zh/nodejs/api/worker_threads#class-worker) 线程后，会发出 `'worker'` 事件。


### 信号事件 {#signal-events}

当 Node.js 进程收到信号时，会发出信号事件。请参考 [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7) 获取标准 POSIX 信号名称列表，例如 `'SIGINT'`、`'SIGHUP'` 等。

信号在 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 线程中不可用。

信号处理程序将接收信号的名称（`'SIGINT'`、`'SIGTERM'` 等）作为第一个参数。

每个事件的名称将是信号的大写通用名称（例如，`'SIGINT'` 代表 `SIGINT` 信号）。

::: code-group
```js [ESM]
import process from 'node:process';

// 开始从 stdin 读取，以便进程不会退出。
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('Received SIGINT. Press Control-D to exit.');
});

// 使用单个函数来处理多个信号
function handle(signal) {
  console.log(`Received ${signal}`);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
```

```js [CJS]
const process = require('node:process');

// 开始从 stdin 读取，以便进程不会退出。
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('Received SIGINT. Press Control-D to exit.');
});

// 使用单个函数来处理多个信号
function handle(signal) {
  console.log(`Received ${signal}`);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
```
:::

- `'SIGUSR1'` 由 Node.js 保留用于启动[调试器](/zh/nodejs/api/debugger)。可以安装监听器，但这样做可能会干扰调试器。
- `'SIGTERM'` 和 `'SIGINT'` 在非 Windows 平台上具有默认处理程序，这些处理程序会在以代码 `128 + 信号编号` 退出之前重置终端模式。 如果这些信号之一安装了监听器，则其默认行为将被删除（Node.js 将不再退出）。
- 默认情况下会忽略 `'SIGPIPE'`。 可以安装一个监听器。
- 当控制台窗口关闭时，Windows 上会生成 `'SIGHUP'`，而在其他平台上，会在各种类似条件下生成。 请参阅 [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7)。 可以安装监听器，但是 Windows 大约 10 秒后会无条件地终止 Node.js。 在非 Windows 平台上，`SIGHUP` 的默认行为是终止 Node.js，但是一旦安装了监听器，其默认行为将被删除。
- Windows 不支持 `'SIGTERM'`，但可以监听。
- 终端的 `'SIGINT'` 在所有平台上都受支持，通常可以使用 + 生成（尽管这可能是可配置的）。 当启用 [终端原始模式](/zh/nodejs/api/tty#readstreamsetrawmodemode) 并且使用 + 时，不会生成它。
- 当按下 + 时，会在 Windows 上传递 `'SIGBREAK'`。 在非 Windows 平台上，可以监听它，但是没有办法发送或生成它。
- 当控制台调整大小时，会传递 `'SIGWINCH'`。 在 Windows 上，只有在移动光标时写入控制台或在原始模式下使用可读的 tty 时，才会发生这种情况。
- 不能安装 `'SIGKILL'` 的监听器，它将在所有平台上无条件终止 Node.js。
- 不能安装 `'SIGSTOP'` 的监听器。
- `'SIGBUS'`、`'SIGFPE'`、`'SIGSEGV'` 和 `'SIGILL'`，当不使用 [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) 人为引发时，本质上会使进程处于无法安全调用 JS 监听器的状态。 这样做可能会导致进程停止响应。
- 可以发送 `0` 来测试进程是否存在，如果进程存在则没有效果，但如果进程不存在则会抛出错误。

Windows 不支持信号，因此没有与通过信号终止等效的方法，但是 Node.js 通过 [`process.kill()`](/zh/nodejs/api/process#processkillpid-signal) 和 [`subprocess.kill()`](/zh/nodejs/api/child_process#subprocesskillsignal) 提供了一些模拟：

- 发送 `SIGINT`、`SIGTERM` 和 `SIGKILL` 将导致目标进程无条件终止，然后，子进程将报告该进程已通过信号终止。
- 发送信号 `0` 可以用作平台无关的方式来测试进程是否存在。


## `process.abort()` {#processabort}

**新增于: v0.7.0**

`process.abort()` 方法会导致 Node.js 进程立即退出并生成核心文件。

此功能在 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 线程中不可用。

## `process.allowedNodeEnvironmentFlags` {#processallowednodeenvironmentflags}

**新增于: v10.10.0**

- [\<Set\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)

`process.allowedNodeEnvironmentFlags` 属性是一个特殊的只读 `Set`，其中包含 [`NODE_OPTIONS`](/zh/nodejs/api/cli#node_optionsoptions) 环境变量中允许使用的标志。

`process.allowedNodeEnvironmentFlags` 扩展了 `Set`，但覆盖了 `Set.prototype.has` 以识别几种不同的可能标志表示形式。 在以下情况下，`process.allowedNodeEnvironmentFlags.has()` 将返回 `true`：

- 标志可以省略前导的单破折号 (`-`) 或双破折号 (`--`)； 例如，`inspect-brk` 代表 `--inspect-brk`，或 `r` 代表 `-r`。
- 传递给 V8 的标志（如 `--v8-options` 中所列）可以用下划线替换一个或多个*非前导*破折号，反之亦然； 例如，`--perf_basic_prof`、`--perf-basic-prof`、`--perf_basic-prof` 等。
- 标志可以包含一个或多个等号 (`=`) 字符； 第一个等号之后（包括第一个等号）的所有字符都将被忽略； 例如，`--stack-trace-limit=100`。
- 标志*必须*在 [`NODE_OPTIONS`](/zh/nodejs/api/cli#node_optionsoptions) 中允许使用。

当遍历 `process.allowedNodeEnvironmentFlags` 时，标志只会出现*一次*； 每个标志都将以一个或多个破折号开头。 传递给 V8 的标志将包含下划线而不是非前导破折号：

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

`process.allowedNodeEnvironmentFlags` 的 `add()`、`clear()` 和 `delete()` 方法不执行任何操作，并且会静默失败。

如果 Node.js 是在*没有* [`NODE_OPTIONS`](/zh/nodejs/api/cli#node_optionsoptions) 支持的情况下编译的（如 [`process.config`](/zh/nodejs/api/process#processconfig) 中所示），则 `process.allowedNodeEnvironmentFlags` 将包含*本来*允许的内容。


## `process.arch` {#processarch}

**Added in: v0.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Node.js 二进制文件编译时所针对的操作系统 CPU 架构。可能的值有：`'arm'`、`'arm64'`、`'ia32'`、`'loong64'`、`'mips'`、`'mipsel'`、`'ppc'`、`'ppc64'`、`'riscv64'`、`'s390'`、`'s390x'` 和 `'x64'`。

::: code-group
```js [ESM]
import { arch } from 'node:process';

console.log(`This processor architecture is ${arch}`);
```

```js [CJS]
const { arch } = require('node:process');

console.log(`This processor architecture is ${arch}`);
```
:::

## `process.argv` {#processargv}

**Added in: v0.1.27**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.argv` 属性返回一个数组，其中包含启动 Node.js 进程时传递的命令行参数。 第一个元素将是 [`process.execPath`](/zh/nodejs/api/process#processexecpath)。 如果需要访问 `argv[0]` 的原始值，请参阅 `process.argv0`。 第二个元素将是要执行的 JavaScript 文件的路径。 其余元素将是任何附加的命令行参数。

例如，假设以下 `process-args.js` 的脚本：

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

将 Node.js 进程启动为：

```bash [BASH]
node process-args.js one two=three four
```
将生成输出：

```text [TEXT]
0: /usr/local/bin/node
1: /Users/mjr/work/node/process-args.js
2: one
3: two=three
4: four
```
## `process.argv0` {#processargv0}

**Added in: v6.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.argv0` 属性存储 Node.js 启动时传递的 `argv[0]` 原始值的只读副本。

```bash [BASH]
$ bash -c 'exec -a customArgv0 ./node'
> process.argv[0]
'/Volumes/code/external/node/out/Release/node'
> process.argv0
'customArgv0'
```

## `process.channel` {#processchannel}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.0.0 | 该对象不再意外地暴露原生 C++ 绑定。 |
| v7.1.0 | 添加于: v7.1.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

如果 Node.js 进程是通过 IPC 通道生成的（请参阅[子进程](/zh/nodejs/api/child_process)文档），则 `process.channel` 属性是对 IPC 通道的引用。 如果不存在 IPC 通道，则此属性为 `undefined`。

### `process.channel.ref()` {#processchannelref}

**添加于: v7.1.0**

如果之前调用过 `.unref()`，则此方法使 IPC 通道保持进程的事件循环运行。

通常，这是通过 `process` 对象上 `'disconnect'` 和 `'message'` 监听器的数量来管理的。 但是，此方法可用于显式请求特定行为。

### `process.channel.unref()` {#processchannelunref}

**添加于: v7.1.0**

此方法使 IPC 通道不保持进程的事件循环运行，并使其在通道打开时也能完成。

通常，这是通过 `process` 对象上 `'disconnect'` 和 `'message'` 监听器的数量来管理的。 但是，此方法可用于显式请求特定行为。

## `process.chdir(directory)` {#processchdirdirectory}

**添加于: v0.1.17**

- `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.chdir()` 方法更改 Node.js 进程的当前工作目录，如果这样做失败（例如，如果指定的 `directory` 不存在），则抛出异常。

::: code-group
```js [ESM]
import { chdir, cwd } from 'node:process';

console.log(`起始目录: ${cwd()}`);
try {
  chdir('/tmp');
  console.log(`新目录: ${cwd()}`);
} catch (err) {
  console.error(`chdir: ${err}`);
}
```

```js [CJS]
const { chdir, cwd } = require('node:process');

console.log(`起始目录: ${cwd()}`);
try {
  chdir('/tmp');
  console.log(`新目录: ${cwd()}`);
} catch (err) {
  console.error(`chdir: ${err}`);
}
```
:::

此功能在 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 线程中不可用。


## `process.config` {#processconfig}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | `process.config` 对象现在是冻结的。 |
| v16.0.0 | 修改 process.config 已被弃用。 |
| v0.7.7 | 添加于: v0.7.7 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.config` 属性返回一个冻结的 `Object`，其中包含用于编译当前 Node.js 可执行文件的配置选项的 JavaScript 表示形式。 这与运行 `./configure` 脚本时生成的 `config.gypi` 文件相同。

可能输出的示例如下所示：

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

**添加于: v0.7.2**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 Node.js 进程是通过 IPC 通道派生的（请参阅[子进程](/zh/nodejs/api/child_process)和[集群](/zh/nodejs/api/cluster)文档），则只要 IPC 通道已连接，`process.connected` 属性将返回 `true`，并在调用 `process.disconnect()` 后返回 `false`。

一旦 `process.connected` 为 `false`，就无法再使用 `process.send()` 通过 IPC 通道发送消息。

## `process.constrainedMemory()` {#processconstrainedmemory}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.0.0, v20.13.0 | 返回值与 `uv_get_constrained_memory` 对齐。 |
| v19.6.0, v18.15.0 | 添加于: v19.6.0, v18.15.0 |
:::

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

根据操作系统施加的限制，获取进程可用的内存量（以字节为单位）。 如果没有这样的约束，或者约束未知，则返回 `0`。

有关更多信息，请参见 [`uv_get_constrained_memory`](https://docs.libuv.org/en/v1.x/misc#c.uv_get_constrained_memory)。


## `process.availableMemory()` {#processavailablememory}

**Added in: v22.0.0, v20.13.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性的
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

获取进程仍然可用的空闲内存量（以字节为单位）。

有关更多信息，请参见 [`uv_get_available_memory`](https://docs.libuv.org/en/v1.x/misc#c.uv_get_available_memory)。

## `process.cpuUsage([previousValue])` {#processcpuusagepreviousvalue}

**Added in: v6.1.0**

- `previousValue` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 调用 `process.cpuUsage()` 之前的返回值
- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `user` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `system` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)



`process.cpuUsage()` 方法返回当前进程的用户和系统 CPU 时间使用情况，以具有属性 `user` 和 `system` 的对象形式返回，其值是微秒值（百万分之一秒）。 这些值分别测量在用户和系统代码中花费的时间，如果多个 CPU 核心正在为此进程执行工作，则最终可能会大于实际经过的时间。

先前调用 `process.cpuUsage()` 的结果可以作为参数传递给该函数，以获得差异读数。

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

**Added in: v0.1.8**

- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.cwd()` 方法返回 Node.js 进程的当前工作目录。

::: code-group
```js [ESM]
import { cwd } from 'node:process';

console.log(`Current directory: ${cwd()}`);
```

```js [CJS]
const { cwd } = require('node:process');

console.log(`Current directory: ${cwd()}`);
```
:::

## `process.debugPort` {#processdebugport}

**Added in: v0.7.2**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js 调试器启用时使用的端口。

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

**Added in: v0.7.2**

如果 Node.js 进程是通过 IPC 通道衍生的（参见[子进程](/zh/nodejs/api/child_process)和[集群](/zh/nodejs/api/cluster)文档），则 `process.disconnect()` 方法将关闭与父进程的 IPC 通道，允许子进程在没有其他连接保持其存活时正常退出。

调用 `process.disconnect()` 的效果与从父进程调用 [`ChildProcess.disconnect()`](/zh/nodejs/api/child_process#subprocessdisconnect) 相同。

如果 Node.js 进程不是通过 IPC 通道衍生的，则 `process.disconnect()` 将为 `undefined`。

## `process.dlopen(module, filename[, flags])` {#processdlopenmodule-filename-flags}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v9.0.0 | 添加了对 `flags` 参数的支持。 |
| v0.1.16 | Added in: v0.1.16 |
:::

- `module` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `flags` [\<os.constants.dlopen\>](/zh/nodejs/api/os#dlopen-constants) **默认:** `os.constants.dlopen.RTLD_LAZY`

`process.dlopen()` 方法允许动态加载共享对象。 它主要由 `require()` 用于加载 C++ 插件，除非在特殊情况下，否则不应直接使用。 换句话说，除非有特殊原因（例如自定义 dlopen 标志或从 ES 模块加载），否则应优先选择 [`require()`](/zh/nodejs/api/globals#require) 而不是 `process.dlopen()`。

`flags` 参数是一个整数，允许指定 dlopen 行为。 有关详细信息，请参见 [`os.constants.dlopen`](/zh/nodejs/api/os#dlopen-constants) 文档。

调用 `process.dlopen()` 时的一个重要要求是必须传递 `module` 实例。 然后可以通过 `module.exports` 访问 C++ 插件导出的函数。

下面的示例展示了如何加载一个名为 `local.node` 的 C++ 插件，该插件导出一个 `foo` 函数。 通过传递 `RTLD_NOW` 常量，在调用返回之前加载所有符号。 在此示例中，假定该常量可用。

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

**Added in: v8.0.0**

- `warning` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 要发出的警告。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 当 `warning` 是 `String` 时，`type` 是用于发出警告的*类型*的名称。 **默认:** `'Warning'`。
    - `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要发出的警告实例的唯一标识符。
    - `ctor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 当 `warning` 是 `String` 时，`ctor` 是一个可选函数，用于限制生成的堆栈跟踪。 **默认:** `process.emitWarning`。
    - `detail` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要包含在错误中的其他文本。
  
 

`process.emitWarning()` 方法可用于发出自定义或应用程序特定的进程警告。 可以通过将处理程序添加到 [`'warning'`](/zh/nodejs/api/process#event-warning) 事件来侦听这些警告。



::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// 发出带有代码和其他详细信息的警告。
emitWarning('发生了一些事情！', {
  code: 'MY_WARNING',
  detail: '这是一些附加信息',
});
// 发出：
// (node:56338) [MY_WARNING] 警告：发生了一些事情！
// 这是一些附加信息
```

```js [CJS]
const { emitWarning } = require('node:process');

// 发出带有代码和其他详细信息的警告。
emitWarning('发生了一些事情！', {
  code: 'MY_WARNING',
  detail: '这是一些附加信息',
});
// 发出：
// (node:56338) [MY_WARNING] 警告：发生了一些事情！
// 这是一些附加信息
```
:::

在此示例中，`Error` 对象由 `process.emitWarning()` 在内部生成，并通过 [`'warning'`](/zh/nodejs/api/process#event-warning) 处理程序传递。



::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);    // 'Warning'
  console.warn(warning.message); // '发生了一些事情！'
  console.warn(warning.code);    // 'MY_WARNING'
  console.warn(warning.stack);   // 堆栈跟踪
  console.warn(warning.detail);  // '这是一些附加信息'
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);    // 'Warning'
  console.warn(warning.message); // '发生了一些事情！'
  console.warn(warning.code);    // 'MY_WARNING'
  console.warn(warning.stack);   // 堆栈跟踪
  console.warn(warning.detail);  // '这是一些附加信息'
});
```
:::

如果 `warning` 作为 `Error` 对象传递，则忽略 `options` 参数。


## `process.emitWarning(warning[, type[, code]][, ctor])` {#processemitwarningwarning-type-code-ctor}

**Added in: v6.0.0**

- `warning` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 要发出的警告。
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 当 `warning` 是 `String` 时，`type` 是用于发出警告的*类型*的名称。 **默认值:** `'Warning'`。
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要发出的警告实例的唯一标识符。
- `ctor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 当 `warning` 是 `String` 时，`ctor` 是一个可选函数，用于限制生成的堆栈跟踪。 **默认值:** `process.emitWarning`。

`process.emitWarning()` 方法可用于发出自定义或特定于应用程序的进程警告。 可以通过向 [`'warning'`](/zh/nodejs/api/process#event-warning) 事件添加处理程序来侦听这些警告。

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// 使用字符串发出警告。
emitWarning('发生了某些事情!');
// 发出: (node: 56338) Warning: 发生了某些事情!
```

```js [CJS]
const { emitWarning } = require('node:process');

// 使用字符串发出警告。
emitWarning('发生了某些事情!');
// 发出: (node: 56338) Warning: 发生了某些事情!
```
:::

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// 使用字符串和类型发出警告。
emitWarning('发生了某些事情!', 'CustomWarning');
// 发出: (node:56338) CustomWarning: 发生了某些事情!
```

```js [CJS]
const { emitWarning } = require('node:process');

// 使用字符串和类型发出警告。
emitWarning('发生了某些事情!', 'CustomWarning');
// 发出: (node:56338) CustomWarning: 发生了某些事情!
```
:::

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

emitWarning('发生了某些事情!', 'CustomWarning', 'WARN001');
// 发出: (node:56338) [WARN001] CustomWarning: 发生了某些事情!
```

```js [CJS]
const { emitWarning } = require('node:process');

process.emitWarning('发生了某些事情!', 'CustomWarning', 'WARN001');
// 发出: (node:56338) [WARN001] CustomWarning: 发生了某些事情!
```
:::

在前面的每个示例中，`Error` 对象都由 `process.emitWarning()` 在内部生成，并通过 [`'warning'`](/zh/nodejs/api/process#event-warning) 处理程序传递。

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

如果 `warning` 作为 `Error` 对象传递，它将未经修改地传递到 `'warning'` 事件处理程序（并且将忽略可选的 `type`、`code` 和 `ctor` 参数）：

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// 使用 Error 对象发出警告。
const myWarning = new Error('发生了某些事情!');
// 使用 Error name 属性指定类型名称
myWarning.name = 'CustomWarning';
myWarning.code = 'WARN001';

emitWarning(myWarning);
// 发出: (node:56338) [WARN001] CustomWarning: 发生了某些事情!
```

```js [CJS]
const { emitWarning } = require('node:process');

// 使用 Error 对象发出警告。
const myWarning = new Error('发生了某些事情!');
// 使用 Error name 属性指定类型名称
myWarning.name = 'CustomWarning';
myWarning.code = 'WARN001';

emitWarning(myWarning);
// 发出: (node:56338) [WARN001] CustomWarning: 发生了某些事情!
```
:::

如果 `warning` 不是字符串或 `Error` 对象，则会抛出 `TypeError`。

虽然进程警告使用 `Error` 对象，但进程警告机制**不能**替代正常的错误处理机制。

如果警告 `type` 是 `'DeprecationWarning'`，则会实现以下附加处理：

- 如果使用 `--throw-deprecation` 命令行标志，则弃用警告将作为异常抛出，而不是作为事件发出。
- 如果使用 `--no-deprecation` 命令行标志，则会抑制弃用警告。
- 如果使用 `--trace-deprecation` 命令行标志，则弃用警告将与完整的堆栈跟踪一起打印到 `stderr`。


### 避免重复警告 {#avoiding-duplicate-warnings}

作为最佳实践，警告应该每个进程只发出一次。为此，将 `emitWarning()` 放在一个布尔值之后。

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

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v11.14.0 | 工作线程现在默认使用父线程 `process.env` 的副本，可通过 `Worker` 构造函数的 `env` 选项配置。 |
| v10.0.0 | 隐式将变量值转换为字符串已弃用。 |
| v0.1.27 | 添加于: v0.1.27 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.env` 属性返回一个包含用户环境的对象。参见 [`environ(7)`](http://man7.org/linux/man-pages/man7/environ.7)。

此对象的一个示例看起来像：

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
可以修改此对象，但是这些修改不会反映在 Node.js 进程之外，或者（除非明确请求）反映到其他 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 线程。换句话说，以下示例将不起作用：

```bash [BASH]
node -e 'process.env.foo = "bar"' && echo $foo
```
而以下示例将起作用：

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

在 `process.env` 上分配属性将隐式地将值转换为字符串。**此行为已被弃用。** 未来版本的 Node.js 可能会在值不是字符串、数字或布尔值时抛出错误。

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

使用 `delete` 删除 `process.env` 中的属性。

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

在 Windows 操作系统上，环境变量不区分大小写。

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

除非在创建 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 实例时明确指定，否则每个 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 线程都有自己的 `process.env` 副本，该副本基于其父线程的 `process.env`，或者作为 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 构造函数的 `env` 选项指定的内容。 对 `process.env` 的更改在 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 线程之间不可见，只有主线程可以进行对操作系统或本机插件可见的更改。 在 Windows 上，[`Worker`](/zh/nodejs/api/worker_threads#class-worker) 实例上的 `process.env` 副本以区分大小写的方式运行，这与主线程不同。


## `process.execArgv` {#processexecargv}

**Added in: v0.7.7**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.execArgv` 属性返回在启动 Node.js 进程时传递的特定于 Node.js 的命令行选项的集合。 这些选项不会出现在 [`process.argv`](/zh/nodejs/api/process#processargv) 属性返回的数组中，并且不包括 Node.js 可执行文件、脚本名称或脚本名称之后的任何选项。 这些选项对于生成与父进程具有相同执行环境的子进程很有用。

```bash [BASH]
node --icu-data-dir=./foo --require ./bar.js script.js --version
```
结果 `process.execArgv` 为：

```json [JSON]
["--icu-data-dir=./foo", "--require", "./bar.js"]
```
而 `process.argv` 为：

```js [ESM]
['/usr/local/bin/node', 'script.js', '--version']
```
有关工作线程使用此属性的详细行为，请参阅 [`Worker` 构造函数](/zh/nodejs/api/worker_threads#new-workerfilename-options)。

## `process.execPath` {#processexecpath}

**Added in: v0.1.100**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.execPath` 属性返回启动 Node.js 进程的可执行文件的绝对路径名。 符号链接（如果有）会被解析。

```js [ESM]
'/usr/local/bin/node'
```
## `process.exit([code])` {#processexitcode}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.0.0 | 仅接受类型为 number 的 code，或者如果它表示整数则接受类型为 string 的 code。 |
| v0.1.13 | 添加于: v0.1.13 |
:::

- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 退出码。 对于字符串类型，仅允许整数字符串（例如，“1”）。 **默认值:** `0`。

`process.exit()` 方法指示 Node.js 以退出状态 `code` 同步终止进程。 如果省略 `code`，则 exit 使用“成功”代码 `0` 或 `process.exitCode` 的值（如果已设置）。 在调用所有 [`'exit'`](/zh/nodejs/api/process#event-exit) 事件监听器之前，Node.js 不会终止。

要使用“失败”代码退出：

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

执行 Node.js 的 shell 应该将退出代码视为 `1`。

调用 `process.exit()` 将强制进程尽快退出，即使仍有尚未完全完成的异步操作挂起，包括对 `process.stdout` 和 `process.stderr` 的 I/O 操作。

在大多数情况下，实际上没有必要显式调用 `process.exit()`。 如果事件循环中 *没有其他挂起的工作*，Node.js 进程将自行退出。 可以设置 `process.exitCode` 属性来告诉进程在正常退出时使用哪个退出代码。

例如，以下示例说明了 `process.exit()` 方法的 *滥用*，这可能导致打印到 stdout 的数据被截断和丢失：

::: code-group
```js [ESM]
import { exit } from 'node:process';

// 这是一个 *不* 应该做的示例：
if (someConditionNotMet()) {
  printUsageToStdout();
  exit(1);
}
```

```js [CJS]
const { exit } = require('node:process');

// 这是一个 *不* 应该做的示例：
if (someConditionNotMet()) {
  printUsageToStdout();
  exit(1);
}
```
:::

出现问题的原因是 Node.js 中写入 `process.stdout` 的操作有时是 *异步的*，并且可能发生在 Node.js 事件循环的多个周期中。 但是，调用 `process.exit()` 会强制进程在执行对 `stdout` 的其他写入操作 *之前* 退出。

代码 *应该* 设置 `process.exitCode`，并通过避免为事件循环安排任何其他工作来允许进程自然退出，而不是直接调用 `process.exit()`：

::: code-group
```js [ESM]
import process from 'node:process';

// 如何在允许
// 进程正常退出的同时正确设置退出代码。
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
```

```js [CJS]
const process = require('node:process');

// 如何在允许
// 进程正常退出的同时正确设置退出代码。
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
```
:::

如果由于错误情况而必须终止 Node.js 进程，则抛出 *未捕获的* 错误并允许进程相应地终止比调用 `process.exit()` 更安全。

在 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 线程中，此函数停止当前线程而不是当前进程。


## `process.exitCode` {#processexitcode_1}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v20.0.0 | 仅接受数字类型的代码，或者表示整数的字符串类型的代码。 |
| v0.11.8 | 添加于: v0.11.8 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 退出码。对于字符串类型，只允许整数字符串（例如，“1”）。**默认值:** `undefined`。

当进程正常退出，或者通过 [`process.exit()`](/zh/nodejs/api/process#processexitcode) 退出而未指定代码时，将作为进程退出代码的数字。

向 [`process.exit(code)`](/zh/nodejs/api/process#processexitcode) 指定一个代码将覆盖之前对 `process.exitCode` 的任何设置。

## `process.features.cached_builtins` {#processfeaturescached_builtins}

**添加于: v12.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果当前的 Node.js 构建正在缓存内置模块，则为 `true` 的布尔值。

## `process.features.debug` {#processfeaturesdebug}

**添加于: v0.5.5**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果当前的 Node.js 构建是调试构建，则为 `true` 的布尔值。

## `process.features.inspector` {#processfeaturesinspector}

**添加于: v11.10.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果当前的 Node.js 构建包含 inspector，则为 `true` 的布尔值。

## `process.features.ipv6` {#processfeaturesipv6}

**添加于: v0.5.3**

**已弃用: v23.4.0**

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用。 此属性始终为 true，并且任何基于它的检查都是多余的。
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果当前的 Node.js 构建包含对 IPv6 的支持，则为 `true` 的布尔值。

由于所有 Node.js 构建都具有 IPv6 支持，因此此值始终为 `true`。


## `process.features.require_module` {#processfeaturesrequire_module}

**Added in: v23.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

一个布尔值，如果当前的 Node.js 构建支持[使用 `require()` 加载 ECMAScript 模块](/zh/nodejs/api/modules#loading-ecmascript-modules-using-require)，则为 `true`。

## `process.features.tls` {#processfeaturestls}

**Added in: v0.5.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

一个布尔值，如果当前的 Node.js 构建包含对 TLS 的支持，则为 `true`。

## `process.features.tls_alpn` {#processfeaturestls_alpn}

**Added in: v4.8.0**

**Deprecated since: v23.4.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/zh/nodejs/api/documentation#stability-index) [Stability: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用。 请改用 `process.features.tls`。
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

一个布尔值，如果当前的 Node.js 构建包含对 TLS 中 ALPN 的支持，则为 `true`。

在 Node.js 11.0.0 及更高版本中，OpenSSL 依赖项具有无条件的 ALPN 支持。 因此，此值与 `process.features.tls` 的值相同。

## `process.features.tls_ocsp` {#processfeaturestls_ocsp}

**Added in: v0.11.13**

**Deprecated since: v23.4.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/zh/nodejs/api/documentation#stability-index) [Stability: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用。 请改用 `process.features.tls`。
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

一个布尔值，如果当前的 Node.js 构建包含对 TLS 中 OCSP 的支持，则为 `true`。

在 Node.js 11.0.0 及更高版本中，OpenSSL 依赖项具有无条件的 OCSP 支持。 因此，此值与 `process.features.tls` 的值相同。

## `process.features.tls_sni` {#processfeaturestls_sni}

**Added in: v0.5.3**

**Deprecated since: v23.4.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/zh/nodejs/api/documentation#stability-index) [Stability: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用。 请改用 `process.features.tls`。
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

一个布尔值，如果当前的 Node.js 构建包含对 TLS 中 SNI 的支持，则为 `true`。

在 Node.js 11.0.0 及更高版本中，OpenSSL 依赖项具有无条件的 SNI 支持。 因此，此值与 `process.features.tls` 的值相同。


## `process.features.typescript` {#processfeaturestypescript}

**添加于: v23.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

如果 Node.js 运行使用 `--experimental-strip-types`，则值为 `"strip"`；如果 Node.js 运行使用 `--experimental-transform-types`，则值为 `"transform"`；否则为 `false`。

## `process.features.uv` {#processfeaturesuv}

**添加于: v0.5.3**

**自以下版本弃用: v23.4.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用。 此属性始终为 true，任何基于它的检查都是多余的。
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

一个布尔值，如果当前的 Node.js 构建包含对 libuv 的支持，则为 `true`。

由于不可能在没有 libuv 的情况下构建 Node.js，因此此值始终为 `true`。

## `process.finalization.register(ref, callback)` {#processfinalizationregisterref-callback}

**添加于: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 要跟踪的资源的引用。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 资源完成时要调用的回调函数。
    - `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 要跟踪的资源的引用。
    - `event` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 触发完成的事件。 默认为 'exit'。

如果 `ref` 对象未被垃圾回收，则此函数注册一个回调，以便在进程发出 `exit` 事件时调用。 如果对象 `ref` 在发出 `exit` 事件之前被垃圾回收，则回调将从完成注册表中删除，并且不会在进程退出时调用。

在回调内部，您可以释放由 `ref` 对象分配的资源。 请注意，应用于 `beforeExit` 事件的所有限制也适用于 `callback` 函数，这意味着在特殊情况下回调可能不会被调用。

此函数的目的是帮助您在进程开始退出时释放资源，但也允许在不再使用该对象时对其进行垃圾回收。

例如：您可以注册一个包含缓冲区对象，您要确保在进程退出时释放该缓冲区，但如果该对象在进程退出之前被垃圾回收，我们不再需要释放该缓冲区，因此在这种情况下，我们只需从完成注册表中删除回调。

::: code-group
```js [CJS]
const { finalization } = require('node:process');

// 请确保传递给 finalization.register() 的函数
// 不会在不必要的对象周围创建闭包。
function onFinalize(obj, event) {
  // 您可以使用该对象执行任何操作
  obj.dispose();
}

function setup() {
  // 此对象可以安全地进行垃圾回收，
  // 并且不会调用生成的关闭函数。
  // 没有泄漏。
  const myDisposableObject = {
    dispose() {
      // 同步释放您的资源
    },
  };

  finalization.register(myDisposableObject, onFinalize);
}

setup();
```

```js [ESM]
import { finalization } from 'node:process';

// 请确保传递给 finalization.register() 的函数
// 不会在不必要的对象周围创建闭包。
function onFinalize(obj, event) {
  // 您可以使用该对象执行任何操作
  obj.dispose();
}

function setup() {
  // 此对象可以安全地进行垃圾回收，
  // 并且不会调用生成的关闭函数。
  // 没有泄漏。
  const myDisposableObject = {
    dispose() {
      // 同步释放您的资源
    },
  };

  finalization.register(myDisposableObject, onFinalize);
}

setup();
```
:::

上面的代码依赖于以下假设：

- 避免使用箭头函数
- 建议常规函数位于全局上下文（根）中

常规函数 *可能* 引用 `obj` 所在的上下文，从而使 `obj` 不可垃圾回收。

箭头函数将保留先前的上下文。 例如，考虑：

```js [ESM]
class Test {
  constructor() {
    finalization.register(this, (ref) => ref.dispose());

    // 甚至像这样也是非常不鼓励的
    // finalization.register(this, () => this.dispose());
  }
  dispose() {}
}
```
该对象很可能（并非不可能）不会被垃圾回收，但如果没有被垃圾回收，则在调用 `process.exit` 时将调用 `dispose`。

请小心，避免依赖此功能来处理关键资源，因为不能保证在所有情况下都会调用该回调。


## `process.finalization.registerBeforeExit(ref, callback)` {#processfinalizationregisterbeforeexitref-callback}

**已添加: v22.5.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发中
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 被追踪的资源的引用。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 当资源被终结时要调用的回调函数。
    - `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 被追踪的资源的引用。
    - `event` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 触发终结的事件。默认为 'beforeExit'。
  
 

此函数的行为与 `register` 完全相同，除了当 `ref` 对象未被垃圾回收时，回调函数会在进程发出 `beforeExit` 事件时被调用。

请注意，应用于 `beforeExit` 事件的所有限制也适用于 `callback` 函数，这意味着在特殊情况下回调函数可能不会被调用。

## `process.finalization.unregister(ref)` {#processfinalizationunregisterref}

**已添加: v22.5.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发中
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 之前注册的资源的引用。

此函数从终结注册表中删除对象的注册，因此不再调用回调。



::: code-group
```js [CJS]
const { finalization } = require('node:process');

// 请确保传递给 finalization.register() 的函数
// 不会围绕不必要的对象创建闭包。
function onFinalize(obj, event) {
  // 你可以对对象做任何你想做的事
  obj.dispose();
}

function setup() {
  // 此对象可以安全地进行垃圾回收，
  // 并且不会调用生成的关闭函数。
  // 没有内存泄漏。
  const myDisposableObject = {
    dispose() {
      // 同步释放你的资源
    },
  };

  finalization.register(myDisposableObject, onFinalize);

  // 做一些事情

  myDisposableObject.dispose();
  finalization.unregister(myDisposableObject);
}

setup();
```

```js [ESM]
import { finalization } from 'node:process';

// 请确保传递给 finalization.register() 的函数
// 不会围绕不必要的对象创建闭包。
function onFinalize(obj, event) {
  // 你可以对对象做任何你想做的事
  obj.dispose();
}

function setup() {
  // 此对象可以安全地进行垃圾回收，
  // 并且不会调用生成的关闭函数。
  // 没有内存泄漏。
  const myDisposableObject = {
    dispose() {
      // 同步释放你的资源
    },
  };

  // 请确保传递给 finalization.register() 的函数
  // 不会围绕不必要的对象创建闭包。
  function onFinalize(obj, event) {
    // 你可以对对象做任何你想做的事
    obj.dispose();
  }

  finalization.register(myDisposableObject, onFinalize);

  // 做一些事情

  myDisposableObject.dispose();
  finalization.unregister(myDisposableObject);
}

setup();
```
:::


## `process.getActiveResourcesInfo()` {#processgetactiveresourcesinfo}

**添加于: v17.3.0, v16.14.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- 返回: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.getActiveResourcesInfo()` 方法返回一个字符串数组，其中包含当前保持事件循环处于活动状态的活动资源的类型。

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
const { setTimeout } = require('node:timers';

console.log('Before:', getActiveResourcesInfo());
setTimeout(() => {}, 1000);
console.log('After:', getActiveResourcesInfo());
// Prints:
//   Before: [ 'TTYWrap', 'TTYWrap', 'TTYWrap' ]
//   After: [ 'TTYWrap', 'TTYWrap', 'TTYWrap', 'Timeout' ]
```
:::

## `process.getBuiltinModule(id)` {#processgetbuiltinmoduleid}

**添加于: v22.3.0, v20.16.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 所请求的内置模块的 ID。
- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`process.getBuiltinModule(id)` 提供了一种在全局可用函数中加载内置模块的方法。 需要支持其他环境的 ES 模块可以使用它来有条件地加载 Node.js 内置模块，当它在 Node.js 中运行时，而无需处理非 Node.js 环境中 `import` 可能抛出的解析错误，也无需使用动态 `import()`，这会将模块转换为异步模块，或将同步 API 转换为异步 API。

```js [ESM]
if (globalThis.process?.getBuiltinModule) {
  // 在 Node.js 中运行，使用 Node.js fs 模块。
  const fs = globalThis.process.getBuiltinModule('fs');
  // 如果需要 `require()` 来加载用户模块，请使用 createRequire()
  const module = globalThis.process.getBuiltinModule('module');
  const require = module.createRequire(import.meta.url);
  const foo = require('foo');
}
```
如果 `id` 指定当前 Node.js 进程中可用的内置模块，则 `process.getBuiltinModule(id)` 方法返回相应的内置模块。 如果 `id` 不对应于任何内置模块，则返回 `undefined`。

`process.getBuiltinModule(id)` 接受 [`module.isBuiltin(id)`](/zh/nodejs/api/module#moduleisbuiltinmodulename) 识别的内置模块 ID。 某些内置模块必须使用 `node:` 前缀加载，请参阅[带有强制 `node:` 前缀的内置模块](/zh/nodejs/api/modules#built-in-modules-with-mandatory-node-prefix)。 即使使用者修改了 [`require.cache`](/zh/nodejs/api/modules#requirecache) 以便 `require(id)` 返回其他内容，`process.getBuiltinModule(id)` 返回的引用始终指向与 `id` 对应的内置模块。


## `process.getegid()` {#processgetegid}

**Added in: v2.0.0**

`process.getegid()` 方法返回 Node.js 进程的数值有效组标识。(参见 [`getegid(2)`](http://man7.org/linux/man-pages/man2/getegid.2)。)

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getegid) {
  console.log(`Current gid: ${process.getegid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getegid) {
  console.log(`Current gid: ${process.getegid()}`);
}
```
:::

此函数仅在 POSIX 平台（即非 Windows 或 Android）上可用。

## `process.geteuid()` {#processgeteuid}

**Added in: v2.0.0**

- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.geteuid()` 方法返回进程的数值有效用户标识。(参见 [`geteuid(2)`](http://man7.org/linux/man-pages/man2/geteuid.2)。)

::: code-group
```js [ESM]
import process from 'node:process';

if (process.geteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.geteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
}
```
:::

此函数仅在 POSIX 平台（即非 Windows 或 Android）上可用。

## `process.getgid()` {#processgetgid}

**Added in: v0.1.31**

- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.getgid()` 方法返回进程的数值组标识。(参见 [`getgid(2)`](http://man7.org/linux/man-pages/man2/getgid.2)。)

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgid) {
  console.log(`Current gid: ${process.getgid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getgid) {
  console.log(`Current gid: ${process.getgid()}`);
}
```
:::

此函数仅在 POSIX 平台（即非 Windows 或 Android）上可用。

## `process.getgroups()` {#processgetgroups}

**Added in: v0.9.4**

- 返回: [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.getgroups()` 方法返回一个包含补充组 ID 的数组。 POSIX 没有明确指定是否包含有效组 ID，但 Node.js 确保它始终包含。

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

此函数仅在 POSIX 平台（即非 Windows 或 Android）上可用。


## `process.getuid()` {#processgetuid}

**Added in: v0.1.28**

- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.getuid()` 方法返回进程的数字用户标识。(参见 [`getuid(2)`](http://man7.org/linux/man-pages/man2/getuid.2).)。

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getuid) {
  console.log(`Current uid: ${process.getuid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getuid) {
  console.log(`Current uid: ${process.getuid()}`);
}
```
:::

此函数仅在 POSIX 平台上可用（即，不是 Windows 或 Android）。

## `process.hasUncaughtExceptionCaptureCallback()` {#processhasuncaughtexceptioncapturecallback}

**Added in: v9.3.0**

- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

指示是否已使用 [`process.setUncaughtExceptionCaptureCallback()`](/zh/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) 设置回调。

## `process.hrtime([time])` {#processhrtimetime}

**Added in: v0.7.6**

::: info [Stable: 3 - Legacy]
[Stable: 3](/zh/nodejs/api/documentation#stability-index) [稳定性: 3](/zh/nodejs/api/documentation#stability-index) - 已过时。 请改用 [`process.hrtime.bigint()`](/zh/nodejs/api/process#processhrtimebigint)。
:::

- `time` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 先前调用 `process.hrtime()` 的结果
- 返回: [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

这是在 JavaScript 中引入 `bigint` 之前的 [`process.hrtime.bigint()`](/zh/nodejs/api/process#processhrtimebigint) 的旧版本。

`process.hrtime()` 方法在 `[seconds, nanoseconds]` 元组 `Array` 中返回当前高分辨率的实际时间，其中 `nanoseconds` 是无法以秒精度表示的实际时间的剩余部分。

`time` 是一个可选参数，它必须是先前 `process.hrtime()` 调用的结果，以便与当前时间进行比较。 如果传入的参数不是元组 `Array`，则会抛出一个 `TypeError`。 传入用户定义的数组而不是先前调用 `process.hrtime()` 的结果将导致未定义的行为。

这些时间与过去的任意时间相关，与一天中的时间无关，因此不受时钟漂移的影响。 主要用于测量间隔之间的性能：

::: code-group
```js [ESM]
import { hrtime } from 'node:process';

const NS_PER_SEC = 1e9;
const time = hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = hrtime(time);
  // [ 1, 552 ]

  console.log(`Benchmark took ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds`);
  // Benchmark took 1000000552 nanoseconds
}, 1000);
```

```js [CJS]
const { hrtime } = require('node:process');

const NS_PER_SEC = 1e9;
const time = hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = hrtime(time);
  // [ 1, 552 ]

  console.log(`Benchmark took ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds`);
  // Benchmark took 1000000552 nanoseconds
}, 1000);
```
:::


## `process.hrtime.bigint()` {#processhrtimebigint}

**新增于: v10.7.0**

- 返回: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

`bigint` 版本的 [`process.hrtime()`](/zh/nodejs/api/process#processhrtimetime) 方法，以 `bigint` 形式返回当前高精度实时时间（以纳秒为单位）。

与 [`process.hrtime()`](/zh/nodejs/api/process#processhrtimetime) 不同，它不支持额外的 `time` 参数，因为差值可以直接通过两个 `bigint` 相减来计算。

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

**新增于: v0.9.4**

- `user` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 用户名或数字标识符。
- `extraGroup` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 组名或数字标识符。

`process.initgroups()` 方法读取 `/etc/group` 文件并初始化组访问列表，使用用户所属的所有组。 这是一个需要 Node.js 进程具有 `root` 访问权限或 `CAP_SETGID` 功能的特权操作。

降低权限时请小心：

::: code-group
```js [ESM]
import { getgroups, initgroups, setgid } from 'node:process';

console.log(getgroups());         // [ 0 ]
initgroups('nodeuser', 1000);     // 切换用户
console.log(getgroups());         // [ 27, 30, 46, 1000, 0 ]
setgid(1000);                     // 放弃 root gid
console.log(getgroups());         // [ 27, 30, 46, 1000 ]
```

```js [CJS]
const { getgroups, initgroups, setgid } = require('node:process');

console.log(getgroups());         // [ 0 ]
initgroups('nodeuser', 1000);     // 切换用户
console.log(getgroups());         // [ 27, 30, 46, 1000, 0 ]
setgid(1000);                     // 放弃 root gid
console.log(getgroups());         // [ 27, 30, 46, 1000 ]
```
:::

此函数仅在 POSIX 平台（即非 Windows 或 Android）上可用。 此功能在 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 线程中不可用。


## `process.kill(pid[, signal])` {#processkillpid-signal}

**加入于: v0.0.6**

- `pid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 一个进程 ID
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要发送的信号，可以是字符串或数字。**默认值:** `'SIGTERM'`。

`process.kill()` 方法将 `signal` 发送到由 `pid` 标识的进程。

信号名称是字符串，例如 `'SIGINT'` 或 `'SIGHUP'`。 有关更多信息，请参见 [信号事件](/zh/nodejs/api/process#signal-events) 和 [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2)。

如果目标 `pid` 不存在，此方法将抛出错误。 作为一种特殊情况，可以使用信号 `0` 来测试进程是否存在。 如果 `pid` 用于终止进程组，Windows 平台将抛出错误。

即使此函数的名称是 `process.kill()`，但它实际上只是一个信号发送器，就像 `kill` 系统调用一样。 发送的信号可能执行其他操作，而不是终止目标进程。

::: code-group
```js [ESM]
import process, { kill } from 'node:process';

process.on('SIGHUP', () => {
  console.log('Got SIGHUP signal.');
});

setTimeout(() => {
  console.log('Exiting.');
  process.exit(0);
}, 100);

kill(process.pid, 'SIGHUP');
```

```js [CJS]
const process = require('node:process');

process.on('SIGHUP', () => {
  console.log('Got SIGHUP signal.');
});

setTimeout(() => {
  console.log('Exiting.');
  process.exit(0);
}, 100);

process.kill(process.pid, 'SIGHUP');
```
:::

当 Node.js 进程收到 `SIGUSR1` 时，Node.js 将启动调试器。 参见 [信号事件](/zh/nodejs/api/process#signal-events)。

## `process.loadEnvFile(path)` {#processloadenvfilepath}

**加入于: v21.7.0, v20.12.0**

::: warning [稳定: 1 - 实验性]
[稳定: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) | [\<Buffer\>](/zh/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)。 **默认:** `'./.env'`

将 `.env` 文件加载到 `process.env` 中。 在 `.env` 文件中使用 `NODE_OPTIONS` 对 Node.js 没有任何影响。

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

**Added in: v0.1.17**

**Deprecated since: v14.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用：请改用 [`require.main`](/zh/nodejs/api/modules#accessing-the-main-module)。
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.mainModule` 属性提供了一种检索 [`require.main`](/zh/nodejs/api/modules#accessing-the-main-module) 的替代方法。 不同之处在于，如果主模块在运行时发生更改，则 [`require.main`](/zh/nodejs/api/modules#accessing-the-main-module) 仍然可以引用在更改发生之前需要的模块中的原始主模块。 通常，可以安全地假设两者引用的是同一个模块。

与 [`require.main`](/zh/nodejs/api/modules#accessing-the-main-module) 一样，如果没有入口脚本，则 `process.mainModule` 将为 `undefined`。

## `process.memoryUsage()` {#processmemoryusage}

::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v13.9.0, v12.17.0 | 将 `arrayBuffers` 添加到返回的对象。 |
| v7.2.0 | 将 `external` 添加到返回的对象。 |
| v0.1.16 | 添加于：v0.1.16 |
:::

- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rss` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `heapTotal` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `heapUsed` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `external` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `arrayBuffers` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

返回一个对象，描述了 Node.js 进程的内存使用情况，以字节为单位。

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

- `heapTotal` 和 `heapUsed` 指的是 V8 的内存使用情况。
- `external` 指的是绑定到 V8 管理的 JavaScript 对象的 C++ 对象的内存使用情况。
- `rss`，常驻集大小，是进程在主存储设备中占用的空间量（即总分配内存的子集），包括所有 C++ 和 JavaScript 对象和代码。
- `arrayBuffers` 指的是为 `ArrayBuffer` 和 `SharedArrayBuffer` 分配的内存，包括所有 Node.js [`Buffer`](/zh/nodejs/api/buffer)。 这也包含在 `external` 值中。 当 Node.js 用作嵌入式库时，此值可能为 `0`，因为在这种情况下可能无法跟踪 `ArrayBuffer` 的分配。

当使用 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 线程时，`rss` 将是一个对整个进程有效的值，而其他字段将仅指当前线程。

`process.memoryUsage()` 方法迭代每个页面以收集有关内存使用情况的信息，这可能很慢，具体取决于程序内存分配。


## `process.memoryUsage.rss()` {#processmemoryusagerss}

**Added in: v15.6.0, v14.18.0**

- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.memoryUsage.rss()` 方法返回一个整数，表示常驻内存大小 (RSS)，以字节为单位。

常驻内存大小是在主内存设备中为进程占用的空间量（即已分配总内存的子集），包括所有 C++ 和 JavaScript 对象和代码。

这与 `process.memoryUsage()` 提供的 `rss` 属性的值相同，但 `process.memoryUsage.rss()` 更快。

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

::: info [历史记录]
| 版本 | 更改 |
| --- | --- |
| v22.7.0, v20.18.0 | 稳定性已更改为传统。 |
| v18.0.0 | 将无效回调传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v1.8.1 | 现在支持 `callback` 之后的附加参数。 |
| v0.1.26 | 添加于: v0.1.26 |
:::

::: info [稳定度: 3 - 传统]
[稳定度: 3](/zh/nodejs/api/documentation#stability-index) [稳定性: 3](/zh/nodejs/api/documentation#stability-index) - 传统: 请改用 [`queueMicrotask()`](/zh/nodejs/api/globals#queuemicrotaskcallback)。
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 调用 `callback` 时要传递的附加参数

`process.nextTick()` 将 `callback` 添加到“下一次滴答队列”。 此队列在 JavaScript 堆栈上的当前操作运行完成后，并且在允许事件循环继续之前完全耗尽。 如果递归调用 `process.nextTick()`，则可能会创建一个无限循环。 有关更多背景信息，请参阅[事件循环](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick#understanding-processnexttick)指南。

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

这在开发 API 时很重要，以便让用户有机会在对象构造*之后*但在任何 I/O 发生之前分配事件处理程序：

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

// thing.startDoingStuff() 现在被调用，而不是之前。
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

// thing.startDoingStuff() 现在被调用，而不是之前。
```
:::

API 必须 100% 同步或 100% 异步，这一点非常重要。 考虑以下示例：

```js [ESM]
// 警告！ 不要使用！ 糟糕的不安全危害！
function maybeSync(arg, cb) {
  if (arg) {
    cb();
    return;
  }

  fs.stat('file', cb);
}
```
此 API 很危险，因为在以下情况下：

```js [ESM]
const maybeTrue = Math.random() > 0.5;

maybeSync(maybeTrue, () => {
  foo();
});

bar();
```
不清楚 `foo()` 或 `bar()` 哪个先被调用。

以下方法更好：

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


### 何时使用 `queueMicrotask()` vs. `process.nextTick()` {#when-to-use-queuemicrotask-vs-processnexttick}

[`queueMicrotask()`](/zh/nodejs/api/globals#queuemicrotaskcallback) API 是 `process.nextTick()` 的替代方案，它也使用相同的微任务队列来延迟函数的执行，该队列用于执行已解析 Promise 的 then、catch 和 finally 处理程序。在 Node.js 中，每次“下一个 tick 队列”被清空时，微任务队列会立即被清空。

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

对于*大多数*用户态用例，`queueMicrotask()` API 提供了一种可移植且可靠的机制来延迟执行，该机制可以在多个 JavaScript 平台环境中工作，并且应优先于 `process.nextTick()`。 在简单的场景中，`queueMicrotask()` 可以是 `process.nextTick()` 的直接替代品。

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
这两个 API 之间一个值得注意的区别是，`process.nextTick()` 允许指定额外的值，这些值将在调用延迟函数时作为参数传递给它。使用 `queueMicrotask()` 实现相同的结果需要使用闭包或绑定函数：

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
从下一个 tick 队列和微任务队列中引发的错误的处理方式存在细微差异。 从排队的微任务回调中抛出的错误应尽可能在排队的回调中处理。 如果没有，可以使用 `process.on('uncaughtException')` 事件处理程序来捕获和处理错误。

如有疑问，除非需要 `process.nextTick()` 的特定功能，否则请使用 `queueMicrotask()`。


## `process.noDeprecation` {#processnodeprecation}

**Added in: v0.8.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`process.noDeprecation` 属性指示在当前的 Node.js 进程中是否设置了 `--no-deprecation` 标志。 有关此标志行为的更多信息，请参见 [`'warning'` 事件](/zh/nodejs/api/process#event-warning) 和 [`emitWarning()` 方法](/zh/nodejs/api/process#processemitwarningwarning-type-code-ctor) 的文档。

## `process.permission` {#processpermission}

**Added in: v20.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

此 API 可通过 [`--permission`](/zh/nodejs/api/cli#--permission) 标志使用。

`process.permission` 是一个对象，其方法用于管理当前进程的权限。 更多文档可在 [权限模型](/zh/nodejs/api/permissions#permission-model) 中找到。

### `process.permission.has(scope[, reference])` {#processpermissionhasscope-reference}

**Added in: v20.0.0**

- `scope` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `reference` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

验证进程是否能够访问给定的范围和引用。 如果未提供引用，则假定为全局范围，例如，`process.permission.has('fs.read')` 将检查进程是否具有所有文件系统读取权限。

引用具有基于所提供范围的含义。 例如，当范围是文件系统时，引用表示文件和文件夹。

可用的范围是：

- `fs` - 所有文件系统
- `fs.read` - 文件系统读取操作
- `fs.write` - 文件系统写入操作
- `child` - 子进程生成操作
- `worker` - Worker 线程生成操作

```js [ESM]
// 检查进程是否具有读取 README 文件的权限
process.permission.has('fs.read', './README.md');
// 检查进程是否具有读取权限操作
process.permission.has('fs.read');
```

## `process.pid` {#processpid}

**添加于: v0.1.15**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.pid` 属性返回进程的 PID。

::: code-group
```js [ESM]
import { pid } from 'node:process';

console.log(`此进程的 pid 为 ${pid}`);
```

```js [CJS]
const { pid } = require('node:process');

console.log(`此进程的 pid 为 ${pid}`);
```
:::

## `process.platform` {#processplatform}

**添加于: v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.platform` 属性返回一个字符串，标识编译 Node.js 二进制文件的操作系统平台。

目前可能的值为：

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

console.log(`此平台为 ${platform}`);
```

```js [CJS]
const { platform } = require('node:process');

console.log(`此平台为 ${platform}`);
```
:::

如果 Node.js 构建在 Android 操作系统上，也可能返回 `'android'` 值。 但是，Node.js 中的 Android 支持是[实验性的](https://github.com/nodejs/node/blob/HEAD/BUILDING.md#android)。

## `process.ppid` {#processppid}

**添加于: v9.2.0, v8.10.0, v6.13.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.ppid` 属性返回当前进程的父进程的 PID。

::: code-group
```js [ESM]
import { ppid } from 'node:process';

console.log(`父进程的 pid 为 ${ppid}`);
```

```js [CJS]
const { ppid } = require('node:process');

console.log(`父进程的 pid 为 ${ppid}`);
```
:::

## `process.release` {#processrelease}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v4.2.0 | 现在支持 `lts` 属性。 |
| v3.0.0 | 添加于: v3.0.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.release` 属性返回一个 `Object`，其中包含与当前版本相关的元数据，包括源 tarball 和仅标头 tarball 的 URL。

`process.release` 包含以下属性：

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 一个将始终为 `'node'` 的值。
- `sourceUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 指向 *<code>.tar.gz</code>* 文件的绝对 URL，该文件包含当前版本的源代码。
- `headersUrl`[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 指向 *<code>.tar.gz</code>* 文件的绝对 URL，该文件仅包含当前版本的源头文件。 该文件比完整的源文件小得多，可用于编译 Node.js 原生插件。
- `libUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 指向 *<code>node.lib</code>* 文件的绝对 URL，该文件与当前版本的架构和版本匹配。 此文件用于编译 Node.js 原生插件。 *此属性仅存在于 Node.js 的 Windows 构建中，并且将在所有其他平台上缺失。*
- `lts` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 一个字符串标签，用于标识此版本的 [LTS](https://github.com/nodejs/Release) 标签。 此属性仅存在于 LTS 版本中，对于所有其他版本类型（包括 *Current* 版本）为 `undefined`。 有效值包括 LTS 版本的代码名称（包括不再支持的那些）。
    - 对于从 14.15.0 开始的 14.x LTS 产品线，为 `'Fermium'`。
    - 对于从 16.13.0 开始的 16.x LTS 产品线，为 `'Gallium'`。
    - 对于从 18.12.0 开始的 18.x LTS 产品线，为 `'Hydrogen'`。 有关其他 LTS 版本的代码名称，请参阅 [Node.js 变更日志存档](https://github.com/nodejs/node/blob/HEAD/doc/changelogs/CHANGELOG_ARCHIVE.md)。

```js [ESM]
{
  name: 'node',
  lts: 'Hydrogen',
  sourceUrl: 'https://nodejs.org/download/release/v18.12.0/node-v18.12.0.tar.gz',
  headersUrl: 'https://nodejs.org/download/release/v18.12.0/node-v18.12.0-headers.tar.gz',
  libUrl: 'https://nodejs.org/download/release/v18.12.0/win-x64/node.lib'
}
```
在来自源代码树的非发布版本的自定义构建中，可能仅存在 `name` 属性。 不应依赖其他属性的存在。


## `process.report` {#processreport}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v13.12.0, v12.17.0 | 此 API 不再是实验性的。 |
| v11.8.0 | 添加于: v11.8.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.report` 是一个对象，其方法用于为当前进程生成诊断报告。 其他文档可在 [报告文档](/zh/nodejs/api/report) 中找到。

### `process.report.compact` {#processreportcompact}

**添加于: v13.12.0, v12.17.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

以紧凑格式（单行 JSON）写入报告，与专为人类消费而设计的默认多行格式相比，日志处理系统更容易使用。

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`报告是紧凑的吗？${report.compact}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`报告是紧凑的吗？${report.compact}`);
```
:::

### `process.report.directory` {#processreportdirectory}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v13.12.0, v12.17.0 | 此 API 不再是实验性的。 |
| v11.12.0 | 添加于: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

报告写入的目录。 默认值为空字符串，表示报告写入 Node.js 进程的当前工作目录。

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`报告目录是 ${report.directory}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`报告目录是 ${report.directory}`);
```
:::

### `process.report.filename` {#processreportfilename}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v13.12.0, v12.17.0 | 此 API 不再是实验性的。 |
| v11.12.0 | 添加于: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

报告写入的文件名。 如果设置为空字符串，则输出文件名将包含时间戳、PID 和序列号。 默认值为空字符串。

如果 `process.report.filename` 的值设置为 `'stdout'` 或 `'stderr'`，则报告将分别写入进程的 stdout 或 stderr。

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`报告文件名是 ${report.filename}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`报告文件名是 ${report.filename}`);
```
:::


### `process.report.getReport([err])` {#processreportgetreporterr}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v13.12.0, v12.17.0 | 此 API 不再是实验性的。 |
| v11.8.0 | 添加于: v11.8.0 |
:::

- `err` [\<Error\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error) 用于报告 JavaScript 堆栈的自定义错误。
- 返回: [\<Object\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)

返回运行进程的诊断报告的 JavaScript 对象表示形式。 报告的 JavaScript 堆栈跟踪取自 `err`（如果存在）。

::: code-group
```js [ESM]
import { report } from 'node:process';
import util from 'node:util';

const data = report.getReport();
console.log(data.header.nodejsVersion);

// 类似于 process.report.writeReport()
import fs from 'node:fs';
fs.writeFileSync('my-report.log', util.inspect(data), 'utf8');
```

```js [CJS]
const { report } = require('node:process');
const util = require('node:util');

const data = report.getReport();
console.log(data.header.nodejsVersion);

// 类似于 process.report.writeReport()
const fs = require('node:fs');
fs.writeFileSync('my-report.log', util.inspect(data), 'utf8');
```
:::

更多文档可在 [报告文档](/zh/nodejs/api/report) 中找到。

### `process.report.reportOnFatalError` {#processreportreportonfatalerror}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v15.0.0, v14.17.0 | 此 API 不再是实验性的。 |
| v11.12.0 | 添加于: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Boolean_type)

如果为 `true`，则会在致命错误（例如内存不足错误或失败的 C++ 断言）时生成诊断报告。

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

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.12.0, v12.17.0 | 此 API 不再是实验性的。 |
| v11.12.0 | 添加于: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果为 `true`，则当进程接收到由 `process.report.signal` 指定的信号时，会生成诊断报告。

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`信号报告: ${report.reportOnSignal}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`信号报告: ${report.reportOnSignal}`);
```
:::

### `process.report.reportOnUncaughtException` {#processreportreportonuncaughtexception}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.12.0, v12.17.0 | 此 API 不再是实验性的。 |
| v11.12.0 | 添加于: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果为 `true`，则在未捕获的异常时生成诊断报告。

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`异常报告: ${report.reportOnUncaughtException}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`异常报告: ${report.reportOnUncaughtException}`);
```
:::

### `process.report.excludeEnv` {#processreportexcludeenv}

**添加于: v23.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果为 `true`，则生成不包含环境变量的诊断报告。

### `process.report.signal` {#processreportsignal}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.12.0, v12.17.0 | 此 API 不再是实验性的。 |
| v11.12.0 | 添加于: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

用于触发创建诊断报告的信号。 默认为 `'SIGUSR2'`。

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`报告信号: ${report.signal}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`报告信号: ${report.signal}`);
```
:::


### `process.report.writeReport([filename][, err])` {#processreportwritereportfilename-err}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.12.0, v12.17.0 | 此 API 不再是实验性的。 |
| v11.8.0 | 添加于：v11.8.0 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 报告写入的文件名。 这应该是一个相对路径，它将被附加到 `process.report.directory` 中指定的目录，如果未指定，则为 Node.js 进程的当前工作目录。
- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 用于报告 JavaScript 堆栈的自定义错误。
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返回生成的报告的文件名。

将诊断报告写入文件。 如果未提供 `filename`，则默认文件名包括日期、时间、PID 和序列号。 报告的 JavaScript 堆栈跟踪取自 `err`（如果存在）。

如果 `filename` 的值设置为 `'stdout'` 或 `'stderr'`，则报告将分别写入进程的标准输出或标准错误。

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

其他文档可在[报告文档](/zh/nodejs/api/report)中找到。

## `process.resourceUsage()` {#processresourceusage}

**添加于: v12.6.0**

- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 当前进程的资源使用情况。 所有这些值都来自 `uv_getrusage` 调用，该调用返回一个 [`uv_rusage_t` 结构](https://docs.libuv.org/en/v1.x/misc#c.uv_rusage_t)。
    - `userCPUTime` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 映射到以微秒计算的 `ru_utime`。 它与 [`process.cpuUsage().user`](/zh/nodejs/api/process#processcpuusagepreviousvalue) 的值相同。
    - `systemCPUTime` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 映射到以微秒计算的 `ru_stime`。 它与 [`process.cpuUsage().system`](/zh/nodejs/api/process#processcpuusagepreviousvalue) 的值相同。
    - `maxRSS` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 映射到 `ru_maxrss`，它是以千字节为单位使用的最大常驻集大小。
    - `sharedMemorySize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 映射到 `ru_ixrss`，但任何平台都不支持。
    - `unsharedDataSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 映射到 `ru_idrss`，但任何平台都不支持。
    - `unsharedStackSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 映射到 `ru_isrss`，但任何平台都不支持。
    - `minorPageFault` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 映射到 `ru_minflt`，它是进程的次要页面错误数，有关更多详细信息，请参见[本文](https://en.wikipedia.org/wiki/Page_fault#Minor)。
    - `majorPageFault` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 映射到 `ru_majflt`，它是进程的主要页面错误数，有关更多详细信息，请参见[本文](https://en.wikipedia.org/wiki/Page_fault#Major)。 Windows 不支持此字段。
    - `swappedOut` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 映射到 `ru_nswap`，但任何平台都不支持。
    - `fsRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 映射到 `ru_inblock`，它是文件系统必须执行输入的次数。
    - `fsWrite` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 映射到 `ru_oublock`，它是文件系统必须执行输出的次数。
    - `ipcSent` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 映射到 `ru_msgsnd`，但任何平台都不支持。
    - `ipcReceived` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 映射到 `ru_msgrcv`，但任何平台都不支持。
    - `signalsCount` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 映射到 `ru_nsignals`，但任何平台都不支持。
    - `voluntaryContextSwitches` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 映射到 `ru_nvcsw`，它是由于进程在完成其时间片之前自愿放弃处理器（通常是为了等待资源的可用性）而导致的 CPU 上下文切换的次数。 Windows 不支持此字段。
    - `involuntaryContextSwitches` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 映射到 `ru_nivcsw`，它是由于优先级更高的进程变为可运行状态或由于当前进程超过其时间片而导致的 CPU 上下文切换的次数。 Windows 不支持此字段。

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

**Added in: v0.5.9**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<net.Server\>](/zh/nodejs/api/net#class-netserver) | [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 用于参数化某些类型的句柄的发送。`options` 支持以下属性：
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 一个值，可在传递 `net.Socket` 实例时使用。当 `true` 时，套接字在发送进程中保持打开状态。**默认值:** `false`。
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 Node.js 是使用 IPC 通道衍生的，则可以使用 `process.send()` 方法将消息发送到父进程。 消息将作为父进程 [`ChildProcess`](/zh/nodejs/api/child_process#class-childprocess) 对象上的 [`'message'`](/zh/nodejs/api/child_process#event-message) 事件接收。

如果 Node.js 不是使用 IPC 通道衍生的，则 `process.send` 将为 `undefined`。

消息会经过序列化和解析。 生成的消息可能与最初发送的消息不同。

## `process.setegid(id)` {#processsetegidid}

**Added in: v2.0.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 组名或 ID

`process.setegid()` 方法设置进程的有效组标识。（请参见 [`setegid(2)`](http://man7.org/linux/man-pages/man2/setegid.2)。） `id` 可以作为数字 ID 或组名字符串传递。 如果指定了组名，则此方法会阻塞，同时解析关联的数字 ID。

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

此函数仅在 POSIX 平台上可用（即，不是 Windows 或 Android）。 此功能在 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 线程中不可用。


## `process.seteuid(id)` {#processseteuidid}

**新增于: v2.0.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 用户名或 ID

`process.seteuid()` 方法设置进程的有效用户标识。（参见 [`seteuid(2)`](http://man7.org/linux/man-pages/man2/seteuid.2)。）`id` 可以作为数字 ID 或用户名字符串传递。 如果指定了用户名，该方法会阻塞，同时解析关联的数字 ID。

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

此函数仅在 POSIX 平台上可用（即非 Windows 或 Android）。 此功能在 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 线程中不可用。

## `process.setgid(id)` {#processsetgidid}

**新增于: v0.1.31**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 组名或 ID

`process.setgid()` 方法设置进程的组标识。（参见 [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)。）`id` 可以作为数字 ID 或组名字符串传递。 如果指定了组名，则此方法在解析关联的数字 ID 时会阻塞。

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

此函数仅在 POSIX 平台上可用（即非 Windows 或 Android）。 此功能在 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 线程中不可用。


## `process.setgroups(groups)` {#processsetgroupsgroups}

**Added in: v0.9.4**

- `groups` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.setgroups()` 方法为 Node.js 进程设置补充组 ID。这是一个需要 Node.js 进程具有 `root` 或 `CAP_SETGID` 能力的特权操作。

`groups` 数组可以包含数字组 ID、组名或两者都包含。

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgroups && process.setgroups) {
  try {
    process.setgroups([501]);
    console.log(process.getgroups()); // new groups
  } catch (err) {
    console.error(`Failed to set groups: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getgroups && process.setgroups) {
  try {
    process.setgroups([501]);
    console.log(process.getgroups()); // new groups
  } catch (err) {
    console.error(`Failed to set groups: ${err}`);
  }
}
```
:::

此函数仅在 POSIX 平台上可用（即非 Windows 或 Android）。此功能在 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 线程中不可用。

## `process.setuid(id)` {#processsetuidid}

**Added in: v0.1.28**

- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.setuid(id)` 方法设置进程的用户标识。(参见 [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)。) `id` 可以作为数字 ID 或用户名字符串传递。如果指定了用户名，则该方法会在解析关联的数字 ID 时阻塞。

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getuid && process.setuid) {
  console.log(`Current uid: ${process.getuid()}`);
  try {
    process.setuid(501);
    console.log(`New uid: ${process.getuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getuid && process.setuid) {
  console.log(`Current uid: ${process.getuid()}`);
  try {
    process.setuid(501);
    console.log(`New uid: ${process.getuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```
:::

此函数仅在 POSIX 平台上可用（即非 Windows 或 Android）。此功能在 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 线程中不可用。


## `process.setSourceMapsEnabled(val)` {#processsetsourcemapsenabledval}

**新增于: v16.6.0, v14.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `val` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

此函数启用或禁用堆栈跟踪的 [Source Map v3](https://sourcemaps.info/spec) 支持。

它提供的功能与使用命令行选项 `--enable-source-maps` 启动 Node.js 进程相同。

只有在启用 source maps 后加载的 JavaScript 文件中的 source maps 才会被解析和加载。

## `process.setUncaughtExceptionCaptureCallback(fn)` {#processsetuncaughtexceptioncapturecallbackfn}

**新增于: v9.3.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

`process.setUncaughtExceptionCaptureCallback()` 函数设置一个函数，该函数将在发生未捕获的异常时被调用，并将接收异常值本身作为其第一个参数。

如果设置了这样的函数，则不会发出 [`'uncaughtException'`](/zh/nodejs/api/process#event-uncaughtexception) 事件。 如果从命令行传递了 `--abort-on-uncaught-exception` 或通过 [`v8.setFlagsFromString()`](/zh/nodejs/api/v8#v8setflagsfromstringflags) 设置了该选项，则该进程将不会中止。 配置为在异常情况下执行的操作（例如报告生成）也将受到影响。

要取消设置捕获函数，可以使用 `process.setUncaughtExceptionCaptureCallback(null)`。 在设置另一个捕获函数时，使用非 `null` 参数调用此方法将抛出错误。

使用此函数与使用已弃用的 [`domain`](/zh/nodejs/api/domain) 内置模块是互斥的。

## `process.sourceMapsEnabled` {#processsourcemapsenabled}

**新增于: v20.7.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`process.sourceMapsEnabled` 属性返回是否启用了堆栈跟踪的 [Source Map v3](https://sourcemaps.info/spec) 支持。


## `process.stderr` {#processstderr}

- [\<Stream\>](/zh/nodejs/api/stream#stream)

`process.stderr` 属性返回一个连接到 `stderr` (fd `2`) 的流。它是一个 [`net.Socket`](/zh/nodejs/api/net#class-netsocket) (它是一个 [Duplex](/zh/nodejs/api/stream#duplex-and-transform-streams) 流)，除非 fd `2` 指的是一个文件，在这种情况下它是一个 [Writable](/zh/nodejs/api/stream#writable-streams) 流。

`process.stderr` 与其他 Node.js 流在重要方面有所不同。有关更多信息，请参见 [进程 I/O 注释](/zh/nodejs/api/process#a-note-on-process-io)。

### `process.stderr.fd` {#processstderrfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

此属性引用 `process.stderr` 的底层文件描述符的值。该值固定为 `2`。在 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 线程中，此字段不存在。

## `process.stdin` {#processstdin}

- [\<Stream\>](/zh/nodejs/api/stream#stream)

`process.stdin` 属性返回一个连接到 `stdin` (fd `0`) 的流。它是一个 [`net.Socket`](/zh/nodejs/api/net#class-netsocket) (它是一个 [Duplex](/zh/nodejs/api/stream#duplex-and-transform-streams) 流)，除非 fd `0` 指的是一个文件，在这种情况下它是一个 [Readable](/zh/nodejs/api/stream#readable-streams) 流。

有关如何从 `stdin` 读取的详细信息，请参阅 [`readable.read()`](/zh/nodejs/api/stream#readablereadsize)。

作为 [Duplex](/zh/nodejs/api/stream#duplex-and-transform-streams) 流，`process.stdin` 也可以用于与 v0.10 之前的 Node.js 编写的脚本兼容的“旧”模式。有关更多信息，请参见 [Stream 兼容性](/zh/nodejs/api/stream#compatibility-with-older-nodejs-versions)。

在“旧”流模式下，`stdin` 流默认暂停，因此必须调用 `process.stdin.resume()` 才能从中读取。 另请注意，调用 `process.stdin.resume()` 本身会将流切换到“旧”模式。

### `process.stdin.fd` {#processstdinfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

此属性引用 `process.stdin` 的底层文件描述符的值。该值固定为 `0`。在 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 线程中，此字段不存在。


## `process.stdout` {#processstdout}

- [\<Stream\>](/zh/nodejs/api/stream#stream)

`process.stdout` 属性返回一个连接到 `stdout` (fd `1`) 的流。它是一个 [`net.Socket`](/zh/nodejs/api/net#class-netsocket)（它是 [Duplex](/zh/nodejs/api/stream#duplex-and-transform-streams) 流），除非 fd `1` 指向一个文件，在这种情况下它是一个 [Writable](/zh/nodejs/api/stream#writable-streams) 流。

例如，要将 `process.stdin` 复制到 `process.stdout`：

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

`process.stdout` 与其他 Node.js 流在重要方面有所不同。有关更多信息，请参见 [关于进程 I/O 的说明](/zh/nodejs/api/process#a-note-on-process-io)。

### `process.stdout.fd` {#processstdoutfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

此属性引用 `process.stdout` 的底层文件描述符的值。该值固定为 `1`。在 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 线程中，此字段不存在。

### 关于进程 I/O 的说明 {#a-note-on-process-i/o}

`process.stdout` 和 `process.stderr` 与其他 Node.js 流在重要方面有所不同：

这些行为部分是出于历史原因，因为更改它们会造成向后不兼容，但一些用户也期望如此。

同步写入避免了诸如使用 `console.log()` 或 `console.error()` 写入的输出意外交错，或者如果在异步写入完成之前调用 `process.exit()` 则根本不写入的问题。 有关更多信息，请参见 [`process.exit()`](/zh/nodejs/api/process#processexitcode)。

*<strong>警告</strong>*：同步写入会阻塞事件循环，直到写入完成。 在输出到文件的情况下，这可能几乎是瞬间完成的，但在高系统负载下，未在接收端读取的管道或速度较慢的终端或文件系统可能会经常且长时间地阻塞事件循环，从而产生严重的负面性能影响。 这在写入交互式终端会话时可能不是问题，但在将生产日志记录到进程输出流时，请特别注意这一点。

要检查流是否连接到 [TTY](/zh/nodejs/api/tty#tty) 上下文，请检查 `isTTY` 属性。

例如：

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
有关更多信息，请参见 [TTY](/zh/nodejs/api/tty#tty) 文档。


## `process.throwDeprecation` {#processthrowdeprecation}

**Added in: v0.9.12**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`process.throwDeprecation` 的初始值表示当前 Node.js 进程是否设置了 `--throw-deprecation` 标志。`process.throwDeprecation` 是可变的，因此弃用警告是否导致错误可以在运行时更改。有关更多信息，请参见 [`'warning'` 事件](/zh/nodejs/api/process#event-warning) 和 [`emitWarning()` 方法](/zh/nodejs/api/process#processemitwarningwarning-type-code-ctor) 的文档。

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

**Added in: v0.1.104**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.title` 属性返回当前进程标题（即返回 `ps` 的当前值）。 将新值赋给 `process.title` 会修改 `ps` 的当前值。

当分配一个新值时，不同的平台会对标题施加不同的最大长度限制。 通常，这些限制非常有限。 例如，在 Linux 和 macOS 上，`process.title` 被限制为二进制名称的大小加上命令行参数的长度，因为设置 `process.title` 会覆盖进程的 `argv` 内存。 Node.js v0.8 允许更长的进程标题字符串，方法是也覆盖 `environ` 内存，但在某些（相当模糊的）情况下，这可能是不安全的并且令人困惑。

将值赋给 `process.title` 可能不会在进程管理器应用程序（如 macOS 活动监视器或 Windows 服务管理器）中产生准确的标签。


## `process.traceDeprecation` {#processtracedeprecation}

**新增于: v0.8.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`process.traceDeprecation` 属性指示是否在当前的 Node.js 进程中设置了 `--trace-deprecation` 标志。 有关此标志行为的更多信息，请参阅 [`'warning'` 事件](/zh/nodejs/api/process#event-warning) 和 [`emitWarning()` 方法](/zh/nodejs/api/process#processemitwarningwarning-type-code-ctor) 的文档。

## `process.umask()` {#processumask}

::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v14.0.0, v12.19.0 | 不带参数调用 `process.umask()` 已弃用。 |
| v0.1.19 | 新增于: v0.1.19 |
:::

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用。 不带参数调用 `process.umask()` 会导致进程范围内的 umask 被写入两次。 这会在线程之间引入竞争条件，并且是潜在的安全漏洞。 没有安全、跨平台的替代 API。
:::

`process.umask()` 返回 Node.js 进程的文件模式创建掩码。 子进程从父进程继承掩码。

## `process.umask(mask)` {#processumaskmask}

**新增于: v0.1.19**

- `mask` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.umask(mask)` 设置 Node.js 进程的文件模式创建掩码。 子进程从父进程继承掩码。 返回之前的掩码。

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

在 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 线程中，`process.umask(mask)` 将抛出异常。


## `process.uptime()` {#processuptime}

**新增于: v0.5.0**

- 返回值: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.uptime()` 方法返回当前 Node.js 进程已运行的秒数。

返回值包含秒的小数部分。 使用 `Math.floor()` 获取整数秒数。

## `process.version` {#processversion}

**新增于: v0.1.3**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.version` 属性包含 Node.js 版本字符串。

::: code-group
```js [ESM]
import { version } from 'node:process';

console.log(`Version: ${version}`);
// Version: v14.8.0
```

```js [CJS]
const { version } = require('node:process');

console.log(`Version: ${version}`);
// Version: v14.8.0
```
:::

要获取不带前导 *v* 的版本字符串，请使用 `process.versions.node`。

## `process.versions` {#processversions}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v9.0.0 | `v8` 属性现在包含 Node.js 特定的后缀。 |
| v4.2.0 | 现在支持 `icu` 属性。 |
| v0.2.0 | 新增于: v0.2.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.versions` 属性返回一个对象，其中列出了 Node.js 及其依赖项的版本字符串。 `process.versions.modules` 指示当前的 ABI 版本，当 C++ API 更改时，该版本会增加。 Node.js 将拒绝加载针对不同模块 ABI 版本编译的模块。

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

将生成类似于以下内容的对象：

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

## 退出码 {#exit-codes}

通常情况下，当没有更多的异步操作等待处理时，Node.js 会以状态码 `0` 退出。 在其他情况下，会使用以下状态码：

- `1` **未捕获的致命异常**: 存在一个未捕获的异常，并且它没有被域或 [`'uncaughtException'`](/zh/nodejs/api/process#event-uncaughtexception) 事件处理程序处理。
- `2`: 未使用（由 Bash 保留用于内置命令的错误使用）
- `3` **内部 JavaScript 解析错误**: Node.js 引导过程中的内部 JavaScript 源代码导致了解析错误。 这非常罕见，通常只会在 Node.js 自身的开发过程中发生。
- `4` **内部 JavaScript 求值失败**: Node.js 引导过程中的内部 JavaScript 源代码在求值时未能返回函数值。 这非常罕见，通常只会在 Node.js 自身的开发过程中发生。
- `5` **致命错误**: V8 中存在一个无法恢复的致命错误。 通常，一条消息会打印到 stderr，并带有前缀 `FATAL ERROR`。
- `6` **非函数的内部异常处理程序**: 存在一个未捕获的异常，但是内部的致命异常处理函数以某种方式被设置为非函数，因此无法调用。
- `7` **内部异常处理程序运行时失败**: 存在一个未捕获的异常，并且内部的致命异常处理函数本身在尝试处理它时抛出了一个错误。 例如，如果 [`'uncaughtException'`](/zh/nodejs/api/process#event-uncaughtexception) 或 `domain.on('error')` 处理程序抛出一个错误，就会发生这种情况。
- `8`: 未使用。 在以前的 Node.js 版本中，退出码 8 有时表示未捕获的异常。
- `9` **无效的参数**: 要么指定了一个未知的选项，要么提供了一个需要值的选项但没有值。
- `10` **内部 JavaScript 运行时失败**: Node.js 引导过程中的内部 JavaScript 源代码在调用引导函数时抛出了一个错误。 这非常罕见，通常只会在 Node.js 自身的开发过程中发生。
- `12` **无效的调试参数**: 设置了 `--inspect` 和/或 `--inspect-brk` 选项，但所选的端口号无效或不可用。
- `13` **未解决的顶层 Await**: `await` 在顶层代码的函数外部使用，但传递的 `Promise` 从未解决。
- `14` **快照失败**: Node.js 启动以构建 V8 启动快照，但由于应用程序状态的某些要求未满足而失败。
- `\>128` **信号退出**: 如果 Node.js 收到一个致命信号，例如 `SIGKILL` 或 `SIGHUP`，那么它的退出码将是 `128` 加上信号代码的值。 这是一种标准的 POSIX 实践，因为退出码被定义为 7 位整数，并且信号退出设置了高位，然后包含信号代码的值。 例如，信号 `SIGABRT` 的值为 `6`，因此预期的退出码将是 `128` + `6`，即 `134`。

