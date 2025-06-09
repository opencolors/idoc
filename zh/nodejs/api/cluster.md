---
title: Node.js 文档 - 集群
description: 了解如何使用 Node.js 的集群模块创建共享服务器端口的子进程，以提高应用程序的性能和可扩展性。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 - 集群 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解如何使用 Node.js 的集群模块创建共享服务器端口的子进程，以提高应用程序的性能和可扩展性。
  - - meta
    - name: twitter:title
      content: Node.js 文档 - 集群 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解如何使用 Node.js 的集群模块创建共享服务器端口的子进程，以提高应用程序的性能和可扩展性。
---


# 集群 {#cluster}

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) [Stability: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源码:** [lib/cluster.js](https://github.com/nodejs/node/blob/v23.5.0/lib/cluster.js)

Node.js 进程的集群可用于运行 Node.js 的多个实例，这些实例可以在其应用程序线程之间分配工作负载。 如果不需要进程隔离，请改用 [`worker_threads`](/zh/nodejs/api/worker_threads) 模块，该模块允许在单个 Node.js 实例中运行多个应用程序线程。

集群模块允许轻松创建共享服务器端口的子进程。

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`主进程 ${process.pid} 正在运行`);

  // 派生工作进程。
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已死亡`);
  });
} else {
  // 工作进程可以共享任何 TCP 连接
  // 在这种情况下，它是一个 HTTP 服务器
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`工作进程 ${process.pid} 已启动`);
}
```

```js [CJS]
const cluster = require('node:cluster');
const http = require('node:http');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

if (cluster.isPrimary) {
  console.log(`主进程 ${process.pid} 正在运行`);

  // 派生工作进程。
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已死亡`);
  });
} else {
  // 工作进程可以共享任何 TCP 连接
  // 在这种情况下，它是一个 HTTP 服务器
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`工作进程 ${process.pid} 已启动`);
}
```
:::

现在运行 Node.js 将在工作进程之间共享端口 8000：

```bash [BASH]
$ node server.js
主进程 3596 正在运行
工作进程 4324 已启动
工作进程 4520 已启动
工作进程 6056 已启动
工作进程 5644 已启动
```
在 Windows 上，尚无法在工作进程中设置命名管道服务器。


## 工作原理 {#how-it-works}

worker 进程使用 [`child_process.fork()`](/zh/nodejs/api/child_process#child_processforkmodulepath-args-options) 方法派生，以便它们可以通过 IPC 与父进程通信并来回传递服务器句柄。

cluster 模块支持两种分配传入连接的方法。

第一种（也是除 Windows 之外的所有平台上的默认方法）是循环法，其中主进程侦听端口，接受新连接，并以循环方式将它们分配给 worker，并内置一些智能方法来避免 worker 进程过载。

第二种方法是主进程创建侦听套接字并将其发送给感兴趣的 worker。 然后，worker 直接接受传入的连接。

从理论上讲，第二种方法应该提供最佳性能。 然而，在实践中，由于操作系统调度器的不确定性，分配往往非常不平衡。 已经观察到，在总共八个进程中，超过 70% 的连接最终都进入了两个进程。

由于 `server.listen()` 将大部分工作移交给主进程，因此在正常 Node.js 进程和集群 worker 之间，有三种情况下的行为有所不同：

Node.js 不提供路由逻辑。 因此，设计应用程序时，不要过度依赖内存中的数据对象（例如会话和登录）非常重要。

由于 worker 都是独立的进程，因此可以根据程序的需要杀死或重新派生它们，而不会影响其他 worker。 只要还有一些 worker 处于活动状态，服务器将继续接受连接。 如果没有 worker 处于活动状态，则现有连接将被丢弃，并且将拒绝新连接。 但是，Node.js 不会自动管理 worker 的数量。 根据自身需求管理 worker 池是应用程序的责任。

尽管 `node:cluster` 模块的主要用例是联网，但它也可以用于需要 worker 进程的其他用例。


## 类: `Worker` {#class-worker}

**加入于: v0.7.0**

- 继承自: [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter)

`Worker` 对象包含有关工作进程的所有公共信息和方法。在主进程中，可以使用 `cluster.workers` 获取。在工作进程中，可以使用 `cluster.worker` 获取。

### 事件: `'disconnect'` {#event-disconnect}

**加入于: v0.7.7**

类似于 `cluster.on('disconnect')` 事件，但特定于此工作进程。

```js [ESM]
cluster.fork().on('disconnect', () => {
  // 工作进程已断开连接
});
```
### 事件: `'error'` {#event-error}

**加入于: v0.7.3**

此事件与 [`child_process.fork()`](/zh/nodejs/api/child_process#child_processforkmodulepath-args-options) 提供的事件相同。

在工作进程中，也可以使用 `process.on('error')`。

### 事件: `'exit'` {#event-exit}

**加入于: v0.11.2**

- `code` [\<number\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Number_type) 退出码，如果正常退出。
- `signal` [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type) 导致进程被终止的信号名称 (例如 `'SIGHUP'`)。

类似于 `cluster.on('exit')` 事件，但特定于此工作进程。

::: code-group
```js [ESM]
import cluster from 'node:cluster';

if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.on('exit', (code, signal) => {
    if (signal) {
      console.log(`worker was killed by signal: ${signal}`);
    } else if (code !== 0) {
      console.log(`worker exited with error code: ${code}`);
    } else {
      console.log('worker success!');
    }
  });
}
```

```js [CJS]
const cluster = require('node:cluster');

if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.on('exit', (code, signal) => {
    if (signal) {
      console.log(`worker was killed by signal: ${signal}`);
    } else if (code !== 0) {
      console.log(`worker exited with error code: ${code}`);
    } else {
      console.log('worker success!');
    }
  });
}
```
:::

### 事件: `'listening'` {#event-listening}

**加入于: v0.7.0**

- `address` [\<Object\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)

类似于 `cluster.on('listening')` 事件，但特定于此工作进程。

::: code-group
```js [ESM]
cluster.fork().on('listening', (address) => {
  // 工作进程正在监听
});
```

```js [CJS]
cluster.fork().on('listening', (address) => {
  // 工作进程正在监听
});
```
:::

它不会在工作进程中发出。


### 事件：`'message'` {#event-message}

**加入于: v0.7.0**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `handle` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

类似于 `cluster` 的 `'message'` 事件，但特定于此工作进程。

在工作进程中，也可以使用 `process.on('message')`。

参见 [`process` 事件：`'message'` ](/zh/nodejs/api/process#event-message)。

这是一个使用消息系统的示例。它在主进程中保持对工作进程接收到的 HTTP 请求数量的计数：

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

if (cluster.isPrimary) {

  // 跟踪 http 请求
  let numReqs = 0;
  setInterval(() => {
    console.log(`numReqs = ${numReqs}`);
  }, 1000);

  // 计数请求
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'notifyRequest') {
      numReqs += 1;
    }
  }

  // 启动工作进程并侦听包含 notifyRequest 的消息
  const numCPUs = availableParallelism();
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', messageHandler);
  }

} else {

  // 工作进程有一个 http 服务器。
  http.Server((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');

    // 通知主进程关于请求
    process.send({ cmd: 'notifyRequest' });
  }).listen(8000);
}
```

```js [CJS]
const cluster = require('node:cluster');
const http = require('node:http');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

if (cluster.isPrimary) {

  // 跟踪 http 请求
  let numReqs = 0;
  setInterval(() => {
    console.log(`numReqs = ${numReqs}`);
  }, 1000);

  // 计数请求
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'notifyRequest') {
      numReqs += 1;
    }
  }

  // 启动工作进程并侦听包含 notifyRequest 的消息
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', messageHandler);
  }

} else {

  // 工作进程有一个 http 服务器。
  http.Server((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');

    // 通知主进程关于请求
    process.send({ cmd: 'notifyRequest' });
  }).listen(8000);
}
```
:::


### 事件: `'online'` {#event-online}

**添加于: v0.7.0**

类似于 `cluster.on('online')` 事件，但特定于此工作进程。

```js [ESM]
cluster.fork().on('online', () => {
  // 工作进程已上线
});
```
它不会在工作进程中触发。

### `worker.disconnect()` {#workerdisconnect}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v7.3.0 | 此方法现在返回对 `worker` 的引用。 |
| v0.7.7 | 添加于: v0.7.7 |
:::

- 返回: [\<cluster.Worker\>](/zh/nodejs/api/cluster#class-worker) 对 `worker` 的引用。

在一个工作进程中，此函数将关闭所有服务器，等待这些服务器上的 `'close'` 事件，然后断开 IPC 通道。

在主进程中，会向工作进程发送一条内部消息，导致它自行调用 `.disconnect()`。

导致 `.exitedAfterDisconnect` 被设置。

在服务器关闭后，它将不再接受新的连接，但连接可能会被任何其他正在监听的工作进程接受。 现有连接将像往常一样被允许关闭。 当不再存在连接时，请参阅 [`server.close()`](/zh/nodejs/api/net#event-close)，到工作进程的 IPC 通道将关闭，使其能够优雅地退出。

以上仅适用于服务器连接，客户端连接不会被工作进程自动关闭，并且断开连接不会等待它们关闭才退出。

在一个工作进程中，`process.disconnect` 存在，但它不是此函数； 它是 [`disconnect()`](/zh/nodejs/api/child_process#subprocessdisconnect)。

因为长时间存在的服务器连接可能会阻止工作进程断开连接，所以发送消息可能很有用，以便可以采取特定于应用程序的操作来关闭它们。 实现一个超时也可能有用，如果在一段时间后未发出 `'disconnect'` 事件，则终止一个工作进程。

```js [ESM]
if (cluster.isPrimary) {
  const worker = cluster.fork();
  let timeout;

  worker.on('listening', (address) => {
    worker.send('shutdown');
    worker.disconnect();
    timeout = setTimeout(() => {
      worker.kill();
    }, 2000);
  });

  worker.on('disconnect', () => {
    clearTimeout(timeout);
  });

} else if (cluster.isWorker) {
  const net = require('node:net');
  const server = net.createServer((socket) => {
    // 连接永不结束
  });

  server.listen(8000);

  process.on('message', (msg) => {
    if (msg === 'shutdown') {
      // 启动任何到服务器连接的优雅关闭
    }
  });
}
```

### `worker.exitedAfterDisconnect` {#workerexitedafterdisconnect}

**新增于: v6.0.0**

- [\<boolean\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Boolean_type)

如果工作进程由于 `.disconnect()` 而退出，则此属性为 `true`。 如果工作进程以任何其他方式退出，则为 `false`。 如果工作进程尚未退出，则为 `undefined`。

布尔值 [`worker.exitedAfterDisconnect`](/zh/nodejs/api/cluster#workerexitedafterdisconnect) 允许区分自愿退出和意外退出，主进程可以选择不基于此值重新生成工作进程。

```js [ESM]
cluster.on('exit', (worker, code, signal) => {
  if (worker.exitedAfterDisconnect === true) {
    console.log('哦，这只是自愿的 - 不用担心');
  }
});

// kill worker
worker.kill();
```
### `worker.id` {#workerid}

**新增于: v0.8.0**

- [\<integer\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Number_type)

每个新的工作进程都会获得自己的唯一 id，此 id 存储在 `id` 中。

当工作进程处于活动状态时，这是在 `cluster.workers` 中对其进行索引的键。

### `worker.isConnected()` {#workerisconnected}

**新增于: v0.11.14**

如果工作进程通过其 IPC 通道连接到其主进程，则此函数返回 `true`，否则返回 `false`。 工作进程在创建后连接到其主进程。 在发出 `'disconnect'` 事件后断开连接。

### `worker.isDead()` {#workerisdead}

**新增于: v0.11.14**

如果工作进程的进程已终止（由于退出或发出信号），则此函数返回 `true`。 否则，它返回 `false`。

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`主进程 ${process.pid} 正在运行`);

  // 衍生工作进程。
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('fork', (worker) => {
    console.log('worker is dead:', worker.isDead());
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log('worker is dead:', worker.isDead());
  });
} else {
  // 工作进程可以共享任何 TCP 连接。 在这种情况下，它是一个 HTTP 服务器。
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`当前进程\n ${process.pid}`);
    process.kill(process.pid);
  }).listen(8000);
}
```

```js [CJS]
const cluster = require('node:cluster');
const http = require('node:http');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

if (cluster.isPrimary) {
  console.log(`主进程 ${process.pid} 正在运行`);

  // 衍生工作进程。
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('fork', (worker) => {
    console.log('worker is dead:', worker.isDead());
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log('worker is dead:', worker.isDead());
  });
} else {
  // 工作进程可以共享任何 TCP 连接。 在这种情况下，它是一个 HTTP 服务器。
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`当前进程\n ${process.pid}`);
    process.kill(process.pid);
  }).listen(8000);
}
```
:::


### `worker.kill([signal])` {#workerkillsignal}

**添加于: v0.9.12**

- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要发送给 worker 进程的终止信号的名称。**默认值:** `'SIGTERM'`

此函数将终止 worker。 在主 worker 中，它通过断开 `worker.process` 的连接来实现这一点，并在断开连接后，使用 `signal` 终止进程。 在 worker 中，它通过使用 `signal` 终止进程来实现这一点。

`kill()` 函数终止 worker 进程，而不等待优雅断开连接，它的行为与 `worker.process.kill()` 相同。

为了向后兼容，此方法别名为 `worker.destroy()`。

在 worker 中，存在 `process.kill()`，但它不是此函数；它是 [`kill()`](/zh/nodejs/api/process#processkillpid-signal)。

### `worker.process` {#workerprocess}

**添加于: v0.7.0**

- [\<ChildProcess\>](/zh/nodejs/api/child_process#class-childprocess)

所有 worker 都是使用 [`child_process.fork()`](/zh/nodejs/api/child_process#child_processforkmodulepath-args-options) 创建的，此函数返回的对象存储为 `.process`。 在 worker 中，全局 `process` 被存储。

参见：[子进程模块](/zh/nodejs/api/child_process#child_processforkmodulepath-args-options)。

如果 `process` 上发生 `'disconnect'` 事件，并且 `.exitedAfterDisconnect` 不是 `true`，则 Worker 将调用 `process.exit(0)`。 这可以防止意外断开连接。

### `worker.send(message[, sendHandle[, options]][, callback])` {#workersendmessage-sendhandle-options-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v4.0.0 | 现在支持 `callback` 参数。 |
| v0.7.0 | 添加于: v0.7.0 |
:::

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<Handle\>](/zh/nodejs/api/net#serverlistenhandle-backlog-callback)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `options` 参数（如果存在）是一个用于参数化某些类型的句柄的发送的对象。 `options` 支持以下属性：
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 一个值，可以在传递 `net.Socket` 的实例时使用。 当为 `true` 时，套接字在发送进程中保持打开状态。 **默认值:** `false`。
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

向 worker 或主进程发送消息，可以选择带句柄。

在主进程中，这会将消息发送到特定的 worker。 它与 [`ChildProcess.send()`](/zh/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) 相同。

在 worker 中，这会将消息发送到主进程。 它与 `process.send()` 相同。

此示例将回显来自主进程的所有消息：

```js [ESM]
if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.send('hi there');

} else if (cluster.isWorker) {
  process.on('message', (msg) => {
    process.send(msg);
  });
}
```

## 事件: `'disconnect'` {#event-disconnect_1}

**加入版本: v0.7.9**

- `worker` [\<cluster.Worker\>](/zh/nodejs/api/cluster#class-worker)

当工作进程的 IPC 通道断开连接后触发。这可能发生在工作进程正常退出、被杀死或手动断开连接时（例如使用 `worker.disconnect()`）。

`'disconnect'` 和 `'exit'` 事件之间可能存在延迟。这些事件可用于检测进程是否卡在清理中或是否存在长期连接。

```js [ESM]
cluster.on('disconnect', (worker) => {
  console.log(`The worker #${worker.id} has disconnected`);
});
```
## 事件: `'exit'` {#event-exit_1}

**加入版本: v0.7.9**

- `worker` [\<cluster.Worker\>](/zh/nodejs/api/cluster#class-worker)
- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 退出码，如果正常退出。
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 导致进程被杀死的信号名称（例如 `'SIGHUP'`）。

当任何工作进程死亡时，cluster 模块将触发 `'exit'` 事件。

可以通过再次调用 [`.fork()`](/zh/nodejs/api/cluster#clusterforkenv) 来使用它来重新启动工作进程。

```js [ESM]
cluster.on('exit', (worker, code, signal) => {
  console.log('worker %d died (%s). restarting...',
              worker.process.pid, signal || code);
  cluster.fork();
});
```
参见 [`child_process` event: `'exit'`](/zh/nodejs/api/child_process#event-exit)。

## 事件: `'fork'` {#event-fork}

**加入版本: v0.7.0**

- `worker` [\<cluster.Worker\>](/zh/nodejs/api/cluster#class-worker)

当一个新的工作进程被 fork 时，cluster 模块将触发一个 `'fork'` 事件。这可以用来记录工作进程的活动，并创建一个自定义的超时。

```js [ESM]
const timeouts = [];
function errorMsg() {
  console.error('Something must be wrong with the connection ...');
}

cluster.on('fork', (worker) => {
  timeouts[worker.id] = setTimeout(errorMsg, 2000);
});
cluster.on('listening', (worker, address) => {
  clearTimeout(timeouts[worker.id]);
});
cluster.on('exit', (worker, code, signal) => {
  clearTimeout(timeouts[worker.id]);
  errorMsg();
});
```

## Event: `'listening'` {#event-listening_1}

**Added in: v0.7.0**

- `worker` [\<cluster.Worker\>](/zh/nodejs/api/cluster#class-worker)
- `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

在从工作进程调用 `listen()` 之后，当 `'listening'` 事件在服务器上发出时，`'listening'` 事件也会在主进程中的 `cluster` 上发出。

事件处理程序使用两个参数执行，`worker` 包含 worker 对象，`address` 对象包含以下连接属性：`address`、`port` 和 `addressType`。 如果工作进程监听多个地址，这将非常有用。

```js [ESM]
cluster.on('listening', (worker, address) => {
  console.log(
    `一个工作进程现在已连接到 ${address.address}:${address.port}`
  );
});
```
`addressType` 是以下之一：

- `4` (TCPv4)
- `6` (TCPv6)
- `-1` (Unix 域套接字)
- `'udp4'` 或 `'udp6'` (UDPv4 或 UDPv6)

## Event: `'message'` {#event-message_1}


::: info [History]
| 版本 | 变更 |
| --- | --- |
| v6.0.0 | 现在传递 `worker` 参数；有关详细信息，请参见下文。 |
| v2.5.0 | Added in: v2.5.0 |
:::

- `worker` [\<cluster.Worker\>](/zh/nodejs/api/cluster#class-worker)
- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `handle` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

当集群主进程收到来自任何工作进程的消息时发出。

参见 [`child_process` event: `'message'`](/zh/nodejs/api/child_process#event-message)。

## Event: `'online'` {#event-online_1}

**Added in: v0.7.0**

- `worker` [\<cluster.Worker\>](/zh/nodejs/api/cluster#class-worker)

在派生一个新的工作进程后，该工作进程应以在线消息响应。 当主进程收到在线消息时，它将发出此事件。 `'fork'` 和 `'online'` 之间的区别在于，当主进程派生一个工作进程时会发出 fork，而当工作进程正在运行时会发出 `'online'`。

```js [ESM]
cluster.on('online', (worker) => {
  console.log('耶，工作进程在派生后响应了');
});
```

## 事件: `'setup'` {#event-setup}

**加入版本: v0.7.1**

- `settings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

每次调用 [`.setupPrimary()`](/zh/nodejs/api/cluster#clustersetupprimarysettings) 时触发。

`settings` 对象是调用 [`.setupPrimary()`](/zh/nodejs/api/cluster#clustersetupprimarysettings) 时的 `cluster.settings` 对象，仅供参考，因为可以在单个 tick 中多次调用 [`.setupPrimary()`](/zh/nodejs/api/cluster#clustersetupprimarysettings)。

如果准确性很重要，请使用 `cluster.settings`。

## `cluster.disconnect([callback])` {#clusterdisconnectcallback}

**加入版本: v0.7.7**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 当所有工作进程断开连接且句柄关闭时调用。

在 `cluster.workers` 中的每个工作进程上调用 `.disconnect()`。

当它们断开连接时，所有内部句柄都将被关闭，如果没有任何其他事件等待，则允许主进程优雅地终止。

该方法接受一个可选的回调参数，该参数将在完成后被调用。

只能从主进程调用此方法。

## `cluster.fork([env])` {#clusterforkenv}

**加入版本: v0.6.0**

- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 要添加到工作进程环境中的键/值对。
- 返回: [\<cluster.Worker\>](/zh/nodejs/api/cluster#class-worker)

产生一个新的工作进程。

只能从主进程调用此方法。

## `cluster.isMaster` {#clusterismaster}

**加入版本: v0.8.1**

**自以下版本起已弃用: v16.0.0**

::: danger [稳定: 0 - 已弃用]
[稳定: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用
:::

已弃用的 [`cluster.isPrimary`](/zh/nodejs/api/cluster#clusterisprimary) 别名。

## `cluster.isPrimary` {#clusterisprimary}

**加入版本: v16.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果进程是主进程，则为真。 这由 `process.env.NODE_UNIQUE_ID` 决定。 如果 `process.env.NODE_UNIQUE_ID` 未定义，则 `isPrimary` 为 `true`。


## `cluster.isWorker` {#clusterisworker}

**新增于: v0.6.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果进程不是主进程则为真（它是 `cluster.isPrimary` 的否定）。

## `cluster.schedulingPolicy` {#clusterschedulingpolicy}

**新增于: v0.11.2**

调度策略，`cluster.SCHED_RR` 表示轮询，`cluster.SCHED_NONE` 表示将其留给操作系统。 这是一个全局设置，一旦生成第一个工作进程，或者调用 [`.setupPrimary()`](/zh/nodejs/api/cluster#clustersetupprimarysettings)（以先到者为准），它就会被有效地冻结。

在除 Windows 之外的所有操作系统上，`SCHED_RR` 是默认设置。 一旦 libuv 能够有效地分配 IOCP 句柄而不会产生巨大的性能损失，Windows 将更改为 `SCHED_RR`。

`cluster.schedulingPolicy` 也可以通过 `NODE_CLUSTER_SCHED_POLICY` 环境变量设置。 有效值为 `'rr'` 和 `'none'`。

## `cluster.settings` {#clustersettings}

::: info [历史记录]
| 版本 | 更改 |
| --- | --- |
| v13.2.0, v12.16.0 | 现在支持 `serialization` 选项。 |
| v9.5.0 | 现在支持 `cwd` 选项。 |
| v9.4.0 | 现在支持 `windowsHide` 选项。 |
| v8.2.0 | 现在支持 `inspectPort` 选项。 |
| v6.4.0 | 现在支持 `stdio` 选项。 |
| v0.7.1 | 新增于: v0.7.1 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 传递给 Node.js 可执行文件的字符串参数列表。 **默认:** `process.execArgv`。
    - `exec` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 工作进程文件的文件路径。 **默认:** `process.argv[1]`。
    - `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 传递给工作进程的字符串参数。 **默认:** `process.argv.slice(2)`。
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 工作进程的当前工作目录。 **默认:** `undefined` (继承自父进程)。
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 指定用于在进程之间发送消息的序列化种类。 可能的值是 `'json'` 和 `'advanced'`。 有关更多详细信息，请参阅[`child_process`](/zh/nodejs/api/child_process#advanced-serialization) 的 [高级序列化]。 **默认:** `false`。
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 是否将输出发送到父进程的 stdio。 **默认:** `false`。
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 配置派生进程的 stdio。 因为 cluster 模块依赖于 IPC 才能运行，所以此配置必须包含一个 `'ipc'` 条目。 如果提供了此选项，它将覆盖 `silent`。 参见 [`child_process.spawn()`](/zh/nodejs/api/child_process#child_processspawncommand-args-options) 的 [`stdio`](/zh/nodejs/api/child_process#optionsstdio)。
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置进程的用户标识。 (参见 [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)。)
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 设置进程的组标识。 (参见 [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)。)
    - `inspectPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 设置工作进程的检查器端口。 这可以是一个数字，也可以是一个不带参数并返回数字的函数。 默认情况下，每个工作进程都有自己的端口，该端口从主进程的 `process.debugPort` 递增。
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 隐藏通常在 Windows 系统上创建的派生进程控制台窗口。 **默认:** `false`。

调用 [`.setupPrimary()`](/zh/nodejs/api/cluster#clustersetupprimarysettings) (或 [`.fork()`](/zh/nodejs/api/cluster#clusterforkenv)) 之后，此设置对象将包含设置，包括默认值。

不应手动更改或设置此对象。


## `cluster.setupMaster([settings])` {#clustersetupmastersettings}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v16.0.0 | 弃用时间：v16.0.0 |
| v6.4.0 | 现在支持 `stdio` 选项。 |
| v0.7.1 | 添加于: v0.7.1 |
:::

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定度: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用
:::

已弃用的别名，指向 [`.setupPrimary()`](/zh/nodejs/api/cluster#clustersetupprimarysettings)。

## `cluster.setupPrimary([settings])` {#clustersetupprimarysettings}

**添加于: v16.0.0**

- `settings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 参见 [`cluster.settings`](/zh/nodejs/api/cluster#clustersettings)。

`setupPrimary` 用于更改默认的 'fork' 行为。 调用后，设置将存在于 `cluster.settings` 中。

任何设置更改只会影响未来对 [`.fork()`](/zh/nodejs/api/cluster#clusterforkenv) 的调用，并且对已在运行的 worker 没有影响。

无法通过 `.setupPrimary()` 设置的 worker 的唯一属性是传递给 [`.fork()`](/zh/nodejs/api/cluster#clusterforkenv) 的 `env`。

上面的默认值仅适用于第一次调用； 稍后调用的默认值是在调用 `cluster.setupPrimary()` 时的当前值。

::: code-group
```js [ESM]
import cluster from 'node:cluster';

cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'https'],
  silent: true,
});
cluster.fork(); // https worker
cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'http'],
});
cluster.fork(); // http worker
```

```js [CJS]
const cluster = require('node:cluster');

cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'https'],
  silent: true,
});
cluster.fork(); // https worker
cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'http'],
});
cluster.fork(); // http worker
```
:::

只能从主进程调用。

## `cluster.worker` {#clusterworker}

**添加于: v0.7.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

当前 worker 对象的引用。 在主进程中不可用。

::: code-group
```js [ESM]
import cluster from 'node:cluster';

if (cluster.isPrimary) {
  console.log('I am primary');
  cluster.fork();
  cluster.fork();
} else if (cluster.isWorker) {
  console.log(`I am worker #${cluster.worker.id}`);
}
```

```js [CJS]
const cluster = require('node:cluster');

if (cluster.isPrimary) {
  console.log('I am primary');
  cluster.fork();
  cluster.fork();
} else if (cluster.isWorker) {
  console.log(`I am worker #${cluster.worker.id}`);
}
```
:::


## `cluster.workers` {#clusterworkers}

**始于: v0.7.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

一个哈希表，存储着活动的 worker 对象，以 `id` 字段为键。 这使得遍历所有 worker 变得容易。 它只在主进程中可用。

一个 worker 会在 worker 断开连接 *并且* 退出后从 `cluster.workers` 中移除。 这两个事件之间的顺序无法预先确定。 但是，可以保证从 `cluster.workers` 列表中移除会在最后一次 `'disconnect'` 或 `'exit'` 事件被触发之前发生。

::: code-group
```js [ESM]
import cluster from 'node:cluster';

for (const worker of Object.values(cluster.workers)) {
  worker.send('向所有 worker 发布重大公告');
}
```

```js [CJS]
const cluster = require('node:cluster');

for (const worker of Object.values(cluster.workers)) {
  worker.send('向所有 worker 发布重大公告');
}
```
:::

