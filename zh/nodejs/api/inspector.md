---
title: Node.js 检查器模块文档
description: Node.js 的检查器模块提供了一个与 V8 检查器交互的 API，使开发者可以通过连接到检查器协议来调试 Node.js 应用程序。
head:
  - - meta
    - name: og:title
      content: Node.js 检查器模块文档 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 的检查器模块提供了一个与 V8 检查器交互的 API，使开发者可以通过连接到检查器协议来调试 Node.js 应用程序。
  - - meta
    - name: twitter:title
      content: Node.js 检查器模块文档 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 的检查器模块提供了一个与 V8 检查器交互的 API，使开发者可以通过连接到检查器协议来调试 Node.js 应用程序。
---


# Inspector {#inspector}

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源代码:** [lib/inspector.js](https://github.com/nodejs/node/blob/v23.5.0/lib/inspector.js)

`node:inspector` 模块提供了一个与 V8 检查器交互的 API。

可以使用以下方式访问：

::: code-group
```js [ESM]
import * as inspector from 'node:inspector/promises';
```

```js [CJS]
const inspector = require('node:inspector/promises');
```
:::

或者

::: code-group
```js [ESM]
import * as inspector from 'node:inspector';
```

```js [CJS]
const inspector = require('node:inspector');
```
:::

## Promises API {#promises-api}

::: warning [稳定度: 1 - 实验]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验
:::

**加入于: v19.0.0**

### 类: `inspector.Session` {#class-inspectorsession}

- 继承自: [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter)

`inspector.Session` 用于向 V8 检查器后端发送消息并接收消息响应和通知。

#### `new inspector.Session()` {#new-inspectorsession}

**加入于: v8.0.0**

创建 `inspector.Session` 类的新实例。 在可以将消息分派到检查器后端之前，需要通过 [`session.connect()`](/zh/nodejs/api/inspector#sessionconnect) 连接检查器会话。

当使用 `Session` 时，控制台 API 输出的对象不会被释放，除非我们手动执行 `Runtime.DiscardConsoleEntries` 命令。

#### 事件: `'inspectorNotification'` {#event-inspectornotification}

**加入于: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 通知消息对象

当收到来自 V8 检查器的任何通知时发出。

```js [ESM]
session.on('inspectorNotification', (message) => console.log(message.method));
// Debugger.paused
// Debugger.resumed
```

也可以只订阅具有特定方法的通知：


#### 事件: `&lt;inspector-protocol-method&gt;` {#event-&lt;inspector-protocol-method&gt;;}

**添加于: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 通知消息对象

当接收到一个 inspector 通知，且该通知的 method 字段设置为 `\<inspector-protocol-method\>` 值时触发。

以下代码片段在 [`'Debugger.paused'`](https://chromedevtools.github.io/devtools-protocol/v8/Debugger#event-paused) 事件上安装了一个监听器，并在程序执行暂停时（例如，通过断点）打印程序暂停的原因：

```js [ESM]
session.on('Debugger.paused', ({ params }) => {
  console.log(params.hitBreakpoints);
});
// [ '/the/file/that/has/the/breakpoint.js:11:0' ]
```
#### `session.connect()` {#sessionconnect}

**添加于: v8.0.0**

将会话连接到 inspector 后端。

#### `session.connectToMainThread()` {#sessionconnecttomainthread}

**添加于: v12.11.0**

将会话连接到主线程 inspector 后端。 如果此 API 未在 Worker 线程上调用，将抛出异常。

#### `session.disconnect()` {#sessiondisconnect}

**添加于: v8.0.0**

立即关闭会话。 所有待处理的消息回调都将以错误调用。 需要调用 [`session.connect()`](/zh/nodejs/api/inspector#sessionconnect) 才能再次发送消息。 重新连接的会话将丢失所有 inspector 状态，例如启用的代理或配置的断点。

#### `session.post(method[, params])` {#sessionpostmethod-params}

**添加于: v19.0.0**

- `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

将消息发布到 inspector 后端。

```js [ESM]
import { Session } from 'node:inspector/promises';
try {
  const session = new Session();
  session.connect();
  const result = await session.post('Runtime.evaluate', { expression: '2 + 2' });
  console.log(result);
} catch (error) {
  console.error(error);
}
// 输出: { result: { type: 'number', value: 4, description: '4' } }
```

最新版本的 V8 inspector 协议发布在 [Chrome DevTools Protocol Viewer](https://chromedevtools.github.io/devtools-protocol/v8/) 上。

Node.js inspector 支持 V8 声明的所有 Chrome DevTools Protocol 域。 Chrome DevTools Protocol 域提供了一个接口，用于与用于检查应用程序状态和监听运行时事件的运行时代理之一进行交互。


#### 使用示例 {#example-usage}

除了调试器之外，还可以通过 DevTools 协议使用各种 V8 分析器。

##### CPU 分析器 {#cpu-profiler}

以下示例展示了如何使用 [CPU 分析器](https://chromedevtools.github.io/devtools-protocol/v8/Profiler)：

```js [ESM]
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();
session.connect();

await session.post('Profiler.enable');
await session.post('Profiler.start');
// 在此处调用待测量的业务逻辑...

// 稍后...
const { profile } = await session.post('Profiler.stop');

// 将 profile 写入磁盘、上传等。
fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
```
##### 堆分析器 {#heap-profiler}

以下示例展示了如何使用 [堆分析器](https://chromedevtools.github.io/devtools-protocol/v8/HeapProfiler)：

```js [ESM]
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

const result = await session.post('HeapProfiler.takeHeapSnapshot', null);
console.log('HeapProfiler.takeHeapSnapshot done:', result);
session.disconnect();
fs.closeSync(fd);
```
## 回调 API {#callback-api}

### 类: `inspector.Session` {#class-inspectorsession_1}

- 继承自: [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter)

`inspector.Session` 用于将消息分派到 V8 检查器后端，并接收消息响应和通知。

#### `new inspector.Session()` {#new-inspectorsession_1}

**加入于: v8.0.0**

创建 `inspector.Session` 类的新实例。 检查器会话需要在消息可以分派到检查器后端之前通过 [`session.connect()`](/zh/nodejs/api/inspector#sessionconnect) 连接。

当使用 `Session` 时，除非我们手动执行 `Runtime.DiscardConsoleEntries` 命令，否则控制台 API 输出的对象将不会被释放。


#### 事件: `'inspectorNotification'` {#event-inspectornotification_1}

**添加于: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 通知消息对象

当从 V8 检查器收到任何通知时触发。

```js [ESM]
session.on('inspectorNotification', (message) => console.log(message.method));
// Debugger.paused
// Debugger.resumed
```
也可以只订阅具有特定方法的通知：

#### 事件: `&lt;inspector-protocol-method&gt;` {#event-&lt;inspector-protocol-method&gt;;_1}

**添加于: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 通知消息对象

当收到一个检查器通知，并且它的 `method` 字段被设置为 `\<inspector-protocol-method\>` 值时触发。

以下代码片段在 [`'Debugger.paused'`](https://chromedevtools.github.io/devtools-protocol/v8/Debugger#event-paused) 事件上安装了一个监听器，并在程序执行暂停时（例如通过断点）打印程序暂停的原因：

```js [ESM]
session.on('Debugger.paused', ({ params }) => {
  console.log(params.hitBreakpoints);
});
// [ '/the/file/that/has/the/breakpoint.js:11:0' ]
```

#### `session.connect()` {#sessionconnect_1}

**添加于: v8.0.0**

将会话连接到检查器后端。

#### `session.connectToMainThread()` {#sessionconnecttomainthread_1}

**添加于: v12.11.0**

将会话连接到主线程检查器后端。 如果此 API 未在 Worker 线程上调用，则会抛出异常。

#### `session.disconnect()` {#sessiondisconnect_1}

**添加于: v8.0.0**

立即关闭会话。 所有待处理的消息回调都将以错误调用。 需要调用 [`session.connect()`](/zh/nodejs/api/inspector#sessionconnect) 才能再次发送消息。 重新连接的会话将丢失所有检查器状态，例如启用的代理或配置的断点。

#### `session.post(method[, params][, callback])` {#sessionpostmethod-params-callback}

::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v18.0.0 | 现在将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v8.0.0 | 添加于: v8.0.0 |
:::

- `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

向检查器后端发送消息。 当收到响应时，将通知 `callback`。 `callback` 是一个函数，它接受两个可选参数：error 和特定于消息的结果。

```js [ESM]
session.post('Runtime.evaluate', { expression: '2 + 2' },
             (error, { result }) => console.log(result));
// Output: { type: 'number', value: 4, description: '4' }
```

V8 检查器协议的最新版本发布在 [Chrome DevTools Protocol Viewer](https://chromedevtools.github.io/devtools-protocol/v8/) 上。

Node.js 检查器支持 V8 声明的所有 Chrome DevTools Protocol 域。 Chrome DevTools Protocol 域提供了一个接口，用于与用于检查应用程序状态和侦听运行时事件的运行时代理之一进行交互。

当向 V8 发送 `HeapProfiler.takeHeapSnapshot` 或 `HeapProfiler.stopTrackingHeapObjects` 命令时，不能将 `reportProgress` 设置为 `true`。


#### 使用示例 {#example-usage_1}

除了调试器之外，还可以通过 DevTools 协议使用各种 V8 分析器。

##### CPU 分析器 {#cpu-profiler_1}

以下示例展示了如何使用 [CPU 分析器](https://chromedevtools.github.io/devtools-protocol/v8/Profiler)：

```js [ESM]
const inspector = require('node:inspector');
const fs = require('node:fs');
const session = new inspector.Session();
session.connect();

session.post('Profiler.enable', () => {
  session.post('Profiler.start', () => {
    // 在此处调用需要测量的业务逻辑...

    // 一段时间后...
    session.post('Profiler.stop', (err, { profile }) => {
      // 将分析结果写入磁盘、上传等。
      if (!err) {
        fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
      }
    });
  });
});
```
##### 堆分析器 {#heap-profiler_1}

以下示例展示了如何使用 [堆分析器](https://chromedevtools.github.io/devtools-protocol/v8/HeapProfiler)：

```js [ESM]
const inspector = require('node:inspector');
const fs = require('node:fs');
const session = new inspector.Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

session.post('HeapProfiler.takeHeapSnapshot', null, (err, r) => {
  console.log('HeapProfiler.takeHeapSnapshot done:', err, r);
  session.disconnect();
  fs.closeSync(fd);
});
```
## 常用对象 {#common-objects}

### `inspector.close()` {#inspectorclose}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.10.0 | 该 API 在工作线程中公开。 |
| v9.0.0 | 添加于: v9.0.0 |
:::

尝试关闭所有剩余连接，阻塞事件循环直到所有连接都关闭。 一旦所有连接都关闭，则停用检查器。

### `inspector.console` {#inspectorconsole}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 一个将消息发送到远程检查器控制台的对象。

```js [ESM]
require('node:inspector').console.log('a message');
```
检查器控制台与 Node.js 控制台没有 API 对等性。


### `inspector.open([port[, host[, wait]]])` {#inspectoropenport-host-wait}

::: info [历史]
| 版本    | 变更                                                     |
| ------- | -------------------------------------------------------- |
| v20.6.0 | `inspector.open()` 现在返回一个 `Disposable` 对象。      |
:::

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 监听检查器连接的端口。 可选。 **默认值:** 在 CLI 中指定的端口。
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 监听检查器连接的主机。 可选。 **默认值:** 在 CLI 中指定的主机。
- `wait` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 阻塞直到客户端已连接。 可选。 **默认值:** `false`。
- 返回: [\<Disposable\>](https://tc39.es/proposal-explicit-resource-management/#sec-disposable-interface) 一个调用 [`inspector.close()`](/zh/nodejs/api/inspector#inspectorclose) 的 Disposable 对象。

在主机和端口上激活检查器。 相当于 `node --inspect=[[host:]port]`，但可以在节点启动后以编程方式完成。

如果 wait 为 `true`，将阻塞直到客户端连接到检查端口并且流控制已传递给调试器客户端。

有关 `host` 参数的用法，请参阅 [安全警告](/zh/nodejs/api/cli#warning-binding-inspector-to-a-public-ipport-combination-is-insecure)。

### `inspector.url()` {#inspectorurl}

- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

返回活动的检查器的 URL，如果没有则返回 `undefined`。

```bash [BASH]
$ node --inspect -p 'inspector.url()'
Debugger listening on ws://127.0.0.1:9229/166e272e-7a30-4d09-97ce-f1c012b43c34
For help, see: https://nodejs.org/en/docs/inspector
ws://127.0.0.1:9229/166e272e-7a30-4d09-97ce-f1c012b43c34

$ node --inspect=localhost:3000 -p 'inspector.url()'
Debugger listening on ws://localhost:3000/51cf8d0e-3c36-4c59-8efd-54519839e56a
For help, see: https://nodejs.org/en/docs/inspector
ws://localhost:3000/51cf8d0e-3c36-4c59-8efd-54519839e56a

$ node -p 'inspector.url()'
undefined
```

### `inspector.waitForDebugger()` {#inspectorwaitfordebugger}

**新增于: v12.7.0**

阻塞直到客户端（已存在或稍后连接）发送了 `Runtime.runIfWaitingForDebugger` 命令。

如果没有活动的 inspector，将会抛出一个异常。

## 与 DevTools 集成 {#integration-with-devtools}

`node:inspector` 模块提供了一个 API，用于与支持 Chrome DevTools 协议的开发者工具集成。 连接到正在运行的 Node.js 实例的 DevTools 前端可以捕获从该实例发出的协议事件，并相应地显示它们，以方便调试。 以下方法将协议事件广播到所有连接的前端。 传递给方法的 `params` 可以是可选的，具体取决于协议。

```js [ESM]
// `Network.requestWillBeSent` 事件将会被触发。
inspector.Network.requestWillBeSent({
  requestId: 'request-id-1',
  timestamp: Date.now() / 1000,
  wallTime: Date.now(),
  request: {
    url: 'https://nodejs.org/en',
    method: 'GET',
  },
});
```
### `inspector.Network.requestWillBeSent([params])` {#inspectornetworkrequestwillbesentparams}

**新增于: v22.6.0, v20.18.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

此功能仅在启用 `--experimental-network-inspection` 标志时可用。

将 `Network.requestWillBeSent` 事件广播到连接的前端。 此事件表示应用程序即将发送 HTTP 请求。

### `inspector.Network.responseReceived([params])` {#inspectornetworkresponsereceivedparams}

**新增于: v22.6.0, v20.18.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

此功能仅在启用 `--experimental-network-inspection` 标志时可用。

将 `Network.responseReceived` 事件广播到连接的前端。 此事件表示 HTTP 响应可用。


### `inspector.Network.loadingFinished([params])` {#inspectornetworkloadingfinishedparams}

**Added in: v22.6.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [Stability: 1](/zh/nodejs/api/documentation#stability-index) - Experimental
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

此功能仅在启用 `--experimental-network-inspection` 标志后可用。

向连接的前端广播 `Network.loadingFinished` 事件。此事件表明 HTTP 请求已完成加载。

### `inspector.Network.loadingFailed([params])` {#inspectornetworkloadingfailedparams}

**Added in: v22.7.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [Stability: 1](/zh/nodejs/api/documentation#stability-index) - Experimental
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

此功能仅在启用 `--experimental-network-inspection` 标志后可用。

向连接的前端广播 `Network.loadingFailed` 事件。此事件表明 HTTP 请求加载失败。

## 对断点的支持 {#support-of-breakpoints}

Chrome DevTools 协议的 [`Debugger` domain](https://chromedevtools.github.io/devtools-protocol/v8/Debugger) 允许 `inspector.Session` 附加到程序并设置断点以单步执行代码。

但是，应避免使用同线程的 `inspector.Session` 设置断点，该 `inspector.Session` 由 [`session.connect()`](/zh/nodejs/api/inspector#sessionconnect) 连接，因为附加和暂停的程序正是调试器本身。 相反，尝试通过 [`session.connectToMainThread()`](/zh/nodejs/api/inspector#sessionconnecttomainthread) 连接到主线程，并在 worker 线程中设置断点，或者通过 WebSocket 连接与 [Debugger](/zh/nodejs/api/debugger) 程序连接。

