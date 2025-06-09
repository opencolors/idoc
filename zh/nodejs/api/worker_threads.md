---
title: Node.js 工作线程
description: 关于如何在 Node.js 中使用工作线程来利用多线程处理 CPU 密集型任务的文档，提供了 Worker 类的概述、线程间通信以及使用示例。
head:
  - - meta
    - name: og:title
      content: Node.js 工作线程 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 关于如何在 Node.js 中使用工作线程来利用多线程处理 CPU 密集型任务的文档，提供了 Worker 类的概述、线程间通信以及使用示例。
  - - meta
    - name: twitter:title
      content: Node.js 工作线程 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 关于如何在 Node.js 中使用工作线程来利用多线程处理 CPU 密集型任务的文档，提供了 Worker 类的概述、线程间通信以及使用示例。
---


# 工作线程 {#worker-threads}

::: tip [稳定度：2 - 稳定]
[稳定度：2](/zh/nodejs/api/documentation#stability-index) [稳定性：2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源码：** [lib/worker_threads.js](https://github.com/nodejs/node/blob/v23.5.0/lib/worker_threads.js)

`node:worker_threads` 模块启用了并行执行 JavaScript 的线程。 要访问它：

```js [ESM]
const worker = require('node:worker_threads');
```

工作线程（线程）对于执行 CPU 密集型 JavaScript 操作很有用。 它们对 I/O 密集型工作没有太大帮助。 Node.js 内置的异步 I/O 操作比工作线程更有效。

与 `child_process` 或 `cluster` 不同，`worker_threads` 可以共享内存。 它们通过传输 `ArrayBuffer` 实例或共享 `SharedArrayBuffer` 实例来实现。

```js [ESM]
const {
  Worker, isMainThread, parentPort, workerData,
} = require('node:worker_threads');

if (isMainThread) {
  module.exports = function parseJSAsync(script) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: script,
      });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  };
} else {
  const { parse } = require('some-js-parsing-library');
  const script = workerData;
  parentPort.postMessage(parse(script));
}
```

上面的例子为每次 `parseJSAsync()` 调用产生一个工作线程。 在实践中，对于这些类型的任务，请使用工作线程池。 否则，创建工作线程的开销可能会超过它们的好处。

在实现工作线程池时，请使用 [`AsyncResource`](/zh/nodejs/api/async_hooks#class-asyncresource) API 来通知诊断工具（例如，提供异步堆栈跟踪）关于任务与其结果之间的关联。 有关示例实现，请参阅 `async_hooks` 文档中的[“为 `Worker` 线程池使用 `AsyncResource`”](/zh/nodejs/api/async_context#using-asyncresource-for-a-worker-thread-pool)。

默认情况下，工作线程会继承非进程特定的选项。 请参阅[`Worker constructor options`](/zh/nodejs/api/worker_threads#new-workerfilename-options) 以了解如何自定义工作线程选项，特别是 `argv` 和 `execArgv` 选项。


## `worker.getEnvironmentData(key)` {#workergetenvironmentdatakey}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v17.5.0, v16.15.0 | 不再是实验性的。 |
| v15.12.0, v14.18.0 | 添加于: v15.12.0, v14.18.0 |
:::

- `key` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 任何可克隆的 JavaScript 值，可以用作 [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 的键。
- 返回: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

在工作线程中，`worker.getEnvironmentData()` 返回传递给生成线程的 `worker.setEnvironmentData()` 的数据的克隆。 每个新的 `Worker` 都会自动收到其自己的环境数据副本。

```js [ESM]
const {
  Worker,
  isMainThread,
  setEnvironmentData,
  getEnvironmentData,
} = require('node:worker_threads');

if (isMainThread) {
  setEnvironmentData('Hello', 'World!');
  const worker = new Worker(__filename);
} else {
  console.log(getEnvironmentData('Hello'));  // 打印 'World!'。
}
```
## `worker.isMainThread` {#workerismainthread}

**添加于: v10.5.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果此代码未在 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 线程中运行，则为 `true`。

```js [ESM]
const { Worker, isMainThread } = require('node:worker_threads');

if (isMainThread) {
  // 这会在 Worker 实例中重新加载当前文件。
  new Worker(__filename);
} else {
  console.log('Inside Worker!');
  console.log(isMainThread);  // 打印 'false'。
}
```
## `worker.markAsUntransferable(object)` {#workermarkasuntransferableobject}

**添加于: v14.5.0, v12.19.0**

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 任何任意的 JavaScript 值。

将对象标记为不可转移。 如果 `object` 出现在 [`port.postMessage()`](/zh/nodejs/api/worker_threads#portpostmessagevalue-transferlist) 调用的传输列表中，则会抛出错误。 如果 `object` 是原始值，则此操作无效。

特别是，这对于可以克隆而不是传输的对象，以及发送方上的其他对象使用的对象有意义。 例如，Node.js 使用此方法标记它用于其 [`Buffer` 池](/zh/nodejs/api/buffer#static-method-bufferallocunsafesize) 的 `ArrayBuffer`。

此操作无法撤消。

```js [ESM]
const { MessageChannel, markAsUntransferable } = require('node:worker_threads');

const pooledBuffer = new ArrayBuffer(8);
const typedArray1 = new Uint8Array(pooledBuffer);
const typedArray2 = new Float64Array(pooledBuffer);

markAsUntransferable(pooledBuffer);

const { port1 } = new MessageChannel();
try {
  // 这将抛出一个错误，因为 pooledBuffer 是不可转移的。
  port1.postMessage(typedArray1, [ typedArray1.buffer ]);
} catch (error) {
  // error.name === 'DataCloneError'
}

// 以下行打印 typedArray1 的内容 -- 它仍然拥有
// 它的内存并且没有被传输。 没有
// `markAsUntransferable()`，这将打印一个空的 Uint8Array 并且
// postMessage 调用将会成功。
// typedArray2 也完好无损。
console.log(typedArray1);
console.log(typedArray2);
```
浏览器中没有与此 API 等效的 API。


## `worker.isMarkedAsUntransferable(object)` {#workerismarkedasuntransferableobject}

**添加于: v21.0.0**

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 任何 JavaScript 值。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

检查一个对象是否被标记为不可转移，使用 [`markAsUntransferable()`](/zh/nodejs/api/worker_threads#workermarkasuntransferableobject)。

```js [ESM]
const { markAsUntransferable, isMarkedAsUntransferable } = require('node:worker_threads');

const pooledBuffer = new ArrayBuffer(8);
markAsUntransferable(pooledBuffer);

isMarkedAsUntransferable(pooledBuffer);  // 返回 true。
```
浏览器中没有与此 API 等效的 API。

## `worker.markAsUncloneable(object)` {#workermarkasuncloneableobject}

**添加于: v23.0.0**

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 任何任意 JavaScript 值。

将对象标记为不可克隆。 如果 `object` 在 [`port.postMessage()`](/zh/nodejs/api/worker_threads#portpostmessagevalue-transferlist) 调用中用作 [`message`](/zh/nodejs/api/worker_threads#event-message)，则会抛出错误。 如果 `object` 是原始值，则这是一个空操作。

这对 `ArrayBuffer` 或任何类似 `Buffer` 的对象没有影响。

此操作无法撤消。

```js [ESM]
const { markAsUncloneable } = require('node:worker_threads');

const anyObject = { foo: 'bar' };
markAsUncloneable(anyObject);
const { port1 } = new MessageChannel();
try {
  // 这将抛出一个错误，因为 anyObject 不可克隆。
  port1.postMessage(anyObject);
} catch (error) {
  // error.name === 'DataCloneError'
}
```
浏览器中没有与此 API 等效的 API。

## `worker.moveMessagePortToContext(port, contextifiedSandbox)` {#workermovemessageporttocontextport-contextifiedsandbox}

**添加于: v11.13.0**

- `port` [\<MessagePort\>](/zh/nodejs/api/worker_threads#class-messageport) 要转移的消息端口。
- `contextifiedSandbox` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 由 `vm.createContext()` 方法返回的[上下文对象](/zh/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)。
- 返回: [\<MessagePort\>](/zh/nodejs/api/worker_threads#class-messageport)

将 `MessagePort` 转移到不同的 [`vm`](/zh/nodejs/api/vm) 上下文。 原始 `port` 对象变为不可用，返回的 `MessagePort` 实例取而代之。

返回的 `MessagePort` 是目标上下文中的一个对象，并继承自它的全局 `Object` 类。 传递给 [`port.onmessage()`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/onmessage) 监听器的对象也在目标上下文中创建，并继承自它的全局 `Object` 类。

但是，创建的 `MessagePort` 不再继承自 [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)，并且只有 [`port.onmessage()`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/onmessage) 可以用于接收事件。


## `worker.parentPort` {#workerparentport}

**Added in: v10.5.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<MessagePort\>](/zh/nodejs/api/worker_threads#class-messageport)

如果此线程是 [`Worker`](/zh/nodejs/api/worker_threads#class-worker)，则这是一个 [`MessagePort`](/zh/nodejs/api/worker_threads#class-messageport)，允许与父线程通信。 使用 `parentPort.postMessage()` 发送的消息在父线程中使用 `worker.on('message')` 可用，并且从父线程使用 `worker.postMessage()` 发送的消息在此线程中使用 `parentPort.on('message')` 可用。

```js [ESM]
const { Worker, isMainThread, parentPort } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.once('message', (message) => {
    console.log(message);  // 打印 'Hello, world!'。
  });
  worker.postMessage('Hello, world!');
} else {
  // 当收到来自父线程的消息时，将其发回：
  parentPort.once('message', (message) => {
    parentPort.postMessage(message);
  });
}
```
## `worker.postMessageToThread(threadId, value[, transferList][, timeout])` {#workerpostmessagetothreadthreadid-value-transferlist-timeout}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发中
:::

- `threadId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 目标线程 ID。 如果线程 ID 无效，将抛出 [`ERR_WORKER_MESSAGING_FAILED`](/zh/nodejs/api/errors#err_worker_messaging_failed) 错误。 如果目标线程 ID 是当前线程 ID，将抛出 [`ERR_WORKER_MESSAGING_SAME_THREAD`](/zh/nodejs/api/errors#err_worker_messaging_same_thread) 错误。
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 要发送的值。
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 如果一个或多个类似 `MessagePort` 的对象在 `value` 中传递，则需要这些项目的 `transferList`，否则会抛出 [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/zh/nodejs/api/errors#err_missing_message_port_in_transfer_list)。 有关更多信息，请参见 [`port.postMessage()`](/zh/nodejs/api/worker_threads#portpostmessagevalue-transferlist)。
- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 等待消息传递的时间（以毫秒为单位）。 默认值为 `undefined`，表示永远等待。 如果操作超时，将抛出 [`ERR_WORKER_MESSAGING_TIMEOUT`](/zh/nodejs/api/errors#err_worker_messaging_timeout) 错误。
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 如果消息被目标线程成功处理，则会实现 Promise。

向另一个 worker 发送一个值，该 worker 由其线程 ID 标识。

如果目标线程没有 `workerMessage` 事件的监听器，则该操作将抛出 [`ERR_WORKER_MESSAGING_FAILED`](/zh/nodejs/api/errors#err_worker_messaging_failed) 错误。

如果目标线程在处理 `workerMessage` 事件时抛出错误，则该操作将抛出 [`ERR_WORKER_MESSAGING_ERRORED`](/zh/nodejs/api/errors#err_worker_messaging_errored) 错误。

当目标线程不是当前线程的直接父级或子级时，应使用此方法。 如果两个线程是父子关系，请使用 [`require('node:worker_threads').parentPort.postMessage()`](/zh/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) 和 [`worker.postMessage()`](/zh/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) 让线程进行通信。

下面的示例演示了 `postMessageToThread` 的使用：它创建了 10 个嵌套线程，最后一个线程将尝试与主线程通信。

::: code-group
```js [ESM]
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import {
  postMessageToThread,
  threadId,
  workerData,
  Worker,
} from 'node:worker_threads';

const channel = new BroadcastChannel('sync');
const level = workerData?.level ?? 0;

if (level < 10) {
  const worker = new Worker(fileURLToPath(import.meta.url), {
    workerData: { level: level + 1 },
  });
}

if (level === 0) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    postMessageToThread(source, { message: 'pong' });
  });
} else if (level === 10) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    channel.postMessage('done');
    channel.close();
  });

  await postMessageToThread(0, { message: 'ping' });
}

channel.onmessage = channel.close;
```

```js [CJS]
const {
  postMessageToThread,
  threadId,
  workerData,
  Worker,
} = require('node:worker_threads');

const channel = new BroadcastChannel('sync');
const level = workerData?.level ?? 0;

if (level < 10) {
  const worker = new Worker(__filename, {
    workerData: { level: level + 1 },
  });
}

if (level === 0) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    postMessageToThread(source, { message: 'pong' });
  });
} else if (level === 10) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    channel.postMessage('done');
    channel.close();
  });

  postMessageToThread(0, { message: 'ping' });
}

channel.onmessage = channel.close;
```
:::


## `worker.receiveMessageOnPort(port)` {#workerreceivemessageonportport}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v15.12.0 | 现在 `port` 参数也可以引用 `BroadcastChannel`。 |
| v12.3.0 | 添加于: v12.3.0 |
:::

-  `port` [\<MessagePort\>](/zh/nodejs/api/worker_threads#class-messageport) | [\<BroadcastChannel\>](/zh/nodejs/api/worker_threads#class-broadcastchannel-extends-eventtarget) 
-  返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 

从给定的 `MessagePort` 接收一条消息。 如果没有消息可用，则返回 `undefined`，否则返回一个具有单个 `message` 属性的对象，该属性包含消息有效载荷，对应于 `MessagePort` 队列中最旧的消息。

```js [ESM]
const { MessageChannel, receiveMessageOnPort } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();
port1.postMessage({ hello: 'world' });

console.log(receiveMessageOnPort(port2));
// 打印: { message: { hello: 'world' } }
console.log(receiveMessageOnPort(port2));
// 打印: undefined
```
当使用此函数时，不会触发 `'message'` 事件，也不会调用 `onmessage` 监听器。

## `worker.resourceLimits` {#workerresourcelimits}

**添加于: v13.2.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

提供此 Worker 线程内的 JS 引擎资源约束集。 如果 `resourceLimits` 选项已传递给 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 构造函数，则它与其值匹配。

如果在主线程中使用，它的值是一个空对象。


## `worker.SHARE_ENV` {#workershare_env}

**添加于: v11.14.0**

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)

一个特殊值，可以作为 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 构造函数的 `env` 选项传递，以指示当前线程和 Worker 线程应共享对同一组环境变量的读写访问权限。

```js [ESM]
const { Worker, SHARE_ENV } = require('node:worker_threads');
new Worker('process.env.SET_IN_WORKER = "foo"', { eval: true, env: SHARE_ENV })
  .on('exit', () => {
    console.log(process.env.SET_IN_WORKER);  // 打印 'foo'。
  });
```
## `worker.setEnvironmentData(key[, value])` {#workersetenvironmentdatakey-value}


::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v17.5.0, v16.15.0 | 不再是实验性的。 |
| v15.12.0, v14.18.0 | 添加于: v15.12.0, v14.18.0 |
:::

- `key` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 任何任意的、可克隆的 JavaScript 值，可以作为 [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 的键使用。
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 任何任意的、可克隆的 JavaScript 值，它将被克隆并自动传递给所有新的 `Worker` 实例。 如果 `value` 作为 `undefined` 传递，则将删除先前为 `key` 设置的任何值。

`worker.setEnvironmentData()` API 设置当前线程和从当前上下文产生的所有新 `Worker` 实例中的 `worker.getEnvironmentData()` 的内容。

## `worker.threadId` {#workerthreadid}

**添加于: v10.5.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

当前线程的整数标识符。 在相应的 worker 对象上（如果有），它可用作 [`worker.threadId`](/zh/nodejs/api/worker_threads#workerthreadid_1)。 此值对于单个进程中的每个 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 实例都是唯一的。


## `worker.workerData` {#workerworkerdata}

**加入版本: v10.5.0**

一个任意的 JavaScript 值，包含传递给此线程的 `Worker` 构造函数的数据的克隆。

该数据会如同使用 [`postMessage()`](/zh/nodejs/api/worker_threads#portpostmessagevalue-transferlist) 一样被克隆，根据 [HTML 结构化克隆算法](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)。

```js [ESM]
const { Worker, isMainThread, workerData } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename, { workerData: 'Hello, world!' });
} else {
  console.log(workerData);  // 打印 'Hello, world!'。
}
```
## 类: `BroadcastChannel extends EventTarget` {#class-broadcastchannel-extends-eventtarget}


::: info [历史记录]
| 版本 | 更改 |
| --- | --- |
| v18.0.0 | 不再是实验性的。 |
| v15.4.0 | 加入版本: v15.4.0 |
:::

`BroadcastChannel` 的实例允许与绑定到同一通道名称的所有其他 `BroadcastChannel` 实例进行异步一对多通信。

```js [ESM]
'use strict';

const {
  isMainThread,
  BroadcastChannel,
  Worker,
} = require('node:worker_threads');

const bc = new BroadcastChannel('hello');

if (isMainThread) {
  let c = 0;
  bc.onmessage = (event) => {
    console.log(event.data);
    if (++c === 10) bc.close();
  };
  for (let n = 0; n < 10; n++)
    new Worker(__filename);
} else {
  bc.postMessage('hello from every worker');
  bc.close();
}
```
### `new BroadcastChannel(name)` {#new-broadcastchannelname}

**加入版本: v15.4.0**

- `name` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 要连接的通道的名称。 允许使用 `${name}` 转换为字符串的任何 JavaScript 值。

### `broadcastChannel.close()` {#broadcastchannelclose}

**加入版本: v15.4.0**

关闭 `BroadcastChannel` 连接。

### `broadcastChannel.onmessage` {#broadcastchannelonmessage}

**加入版本: v15.4.0**

- 类型: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 接收到消息时，使用单个 `MessageEvent` 参数调用。


### `broadcastChannel.onmessageerror` {#broadcastchannelonmessageerror}

**添加于: v15.4.0**

- 类型: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 当接收到的消息无法被反序列化时调用。

### `broadcastChannel.postMessage(message)` {#broadcastchannelpostmessagemessage}

**添加于: v15.4.0**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 任何可克隆的 JavaScript 值。

### `broadcastChannel.ref()` {#broadcastchannelref}

**添加于: v15.4.0**

与 `unref()` 相反。 在先前 `unref()` 过的 BroadcastChannel 上调用 `ref()` 不会使程序在它是剩余的唯一活动句柄时退出（默认行为）。 如果端口被 `ref()` 过，再次调用 `ref()` 无效。

### `broadcastChannel.unref()` {#broadcastchannelunref}

**添加于: v15.4.0**

在 BroadcastChannel 上调用 `unref()` 允许线程在它是事件系统中唯一的活动句柄时退出。 如果 BroadcastChannel 已经 `unref()` 过，再次调用 `unref()` 无效。

## 类: `MessageChannel` {#class-messagechannel}

**添加于: v10.5.0**

`worker.MessageChannel` 类的实例表示一个异步的双向通信通道。 `MessageChannel` 没有自己的方法。 `new MessageChannel()` 产生一个具有 `port1` 和 `port2` 属性的对象，它们指向链接的 [`MessagePort`](/zh/nodejs/api/worker_threads#class-messageport) 实例。

```js [ESM]
const { MessageChannel } = require('node:worker_threads');

const { port1, port2 } = new MessageChannel();
port1.on('message', (message) => console.log('received', message));
port2.postMessage({ foo: 'bar' });
// 打印: received { foo: 'bar' }，来自 `port1.on('message')` 监听器
```
## 类: `MessagePort` {#class-messageport}


::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v14.7.0 | 此类现在继承自 `EventTarget`，而不是继承自 `EventEmitter`。 |
| v10.5.0 | 添加于: v10.5.0 |
:::

- 继承自: [\<EventTarget\>](/zh/nodejs/api/events#class-eventtarget)

`worker.MessagePort` 类的实例表示异步双向通信通道的一端。 它可用于在不同的 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 之间传输结构化数据、内存区域和其他 `MessagePort`。

此实现与 [浏览器 `MessagePort`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort) 匹配。


### 事件: `'close'` {#event-close}

**加入版本: v10.5.0**

当通道的任何一端断开连接时，会触发 `'close'` 事件。

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

// 打印:
//   foobar
//   closed!
port2.on('message', (message) => console.log(message));
port2.on('close', () => console.log('closed!'));

port1.postMessage('foobar');
port1.close();
```
### 事件: `'message'` {#event-message}

**加入版本: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 传输的值

对于任何传入的消息，都会触发 `'message'` 事件，其中包含 [`port.postMessage()`](/zh/nodejs/api/worker_threads#portpostmessagevalue-transferlist) 的克隆输入。

此事件的监听器会接收到传递给 `postMessage()` 的 `value` 参数的克隆，没有其他参数。

### 事件: `'messageerror'` {#event-messageerror}

**加入版本: v14.5.0, v12.19.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 一个 Error 对象

当反序列化消息失败时，会触发 `'messageerror'` 事件。

目前，当在接收端实例化已发布的 JS 对象时发生错误时，会触发此事件。 这种情况很少见，但可能会发生，例如，当在 `vm.Context` 中接收到某些 Node.js API 对象时（目前 Node.js API 不可用）。

### `port.close()` {#portclose}

**加入版本: v10.5.0**

禁用在此连接的任何一端进一步发送消息。 当不再通过此 `MessagePort` 进行通信时，可以调用此方法。

[`'close'` 事件](/zh/nodejs/api/worker_threads#event-close) 在作为通道一部分的两个 `MessagePort` 实例上都会触发。

### `port.postMessage(value[, transferList])` {#portpostmessagevalue-transferlist}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v21.0.0 | 当传输列表中存在不可传输的对象时，会抛出错误。 |
| v15.6.0 | 将 `X509Certificate` 添加到可克隆类型列表中。 |
| v15.0.0 | 将 `CryptoKey` 添加到可克隆类型列表中。 |
| v15.14.0, v14.18.0 | 将 'BlockList' 添加到可克隆类型列表中。 |
| v15.9.0, v14.18.0 | 将 'Histogram' 类型添加到可克隆类型列表中。 |
| v14.5.0, v12.19.0 | 将 `KeyObject` 添加到可克隆类型列表中。 |
| v14.5.0, v12.19.0 | 将 `FileHandle` 添加到可传输类型列表中。 |
| v10.5.0 | 加入版本: v10.5.0 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

将 JavaScript 值发送到此通道的接收端。 `value` 的传输方式与 [HTML 结构化克隆算法](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) 兼容。

特别是，与 `JSON` 的显着区别是：

- `value` 可能包含循环引用。
- `value` 可能包含内置 JS 类型的实例，例如 `RegExp`、`BigInt`、`Map`、`Set` 等。
- `value` 可能包含类型化数组，同时使用 `ArrayBuffer` 和 `SharedArrayBuffer`。
- `value` 可能包含 [`WebAssembly.Module`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module) 实例。
- `value` 可能不包含原生（C++ 支持）对象，除了：
    - [\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey)s，
    - [\<FileHandle\>](/zh/nodejs/api/fs#class-filehandle)s，
    - [\<Histogram\>](/zh/nodejs/api/perf_hooks#class-histogram)s，
    - [\<KeyObject\>](/zh/nodejs/api/crypto#class-keyobject)s，
    - [\<MessagePort\>](/zh/nodejs/api/worker_threads#class-messageport)s，
    - [\<net.BlockList\>](/zh/nodejs/api/net#class-netblocklist)s，
    - [\<net.SocketAddress\>](/zh/nodejs/api/net#class-netsocketaddress)es，
    - [\<X509Certificate\>](/zh/nodejs/api/crypto#class-x509certificate)s。

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => console.log(message));

const circularData = {};
circularData.foo = circularData;
// 打印: { foo: [Circular] }
port2.postMessage(circularData);
```
`transferList` 可以是 [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)、[`MessagePort`](/zh/nodejs/api/worker_threads#class-messageport) 和 [`FileHandle`](/zh/nodejs/api/fs#class-filehandle) 对象的列表。 传输后，它们在通道的发送端不再可用（即使它们不包含在 `value` 中）。 与 [子进程](/zh/nodejs/api/child_process) 不同，目前不支持传输网络套接字等句柄。

如果 `value` 包含 [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 实例，则可以从任一线程访问这些实例。 它们不能在 `transferList` 中列出。

`value` 仍然可以包含不在 `transferList` 中的 `ArrayBuffer` 实例； 在这种情况下，将复制而不是移动底层内存。

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => console.log(message));

const uint8Array = new Uint8Array([ 1, 2, 3, 4 ]);
// 这会发布 `uint8Array` 的副本：
port2.postMessage(uint8Array);
// 这不会复制数据，但会使 `uint8Array` 不可用：
port2.postMessage(uint8Array, [ uint8Array.buffer ]);

// `sharedUint8Array` 的内存可以从原始副本和 `.on('message')` 接收的副本访问：
const sharedUint8Array = new Uint8Array(new SharedArrayBuffer(4));
port2.postMessage(sharedUint8Array);

// 这会将新创建的消息端口传输给接收者。
// 例如，这可用于在作为同一父线程的子线程的多个 `Worker` 线程之间创建通信通道。
const otherChannel = new MessageChannel();
port2.postMessage({ port: otherChannel.port1 }, [ otherChannel.port1 ]);
```
消息对象会立即克隆，并且可以在发布后进行修改，而不会产生副作用。

有关此 API 背后的序列化和反序列化机制的更多信息，请参阅 [`node:v8` 模块的序列化 API](/zh/nodejs/api/v8#serialization-api)。


#### 传输 TypedArray 和 Buffer 时的注意事项 {#considerations-when-transferring-typedarrays-and-buffers}

所有 `TypedArray` 和 `Buffer` 实例都是底层 `ArrayBuffer` 的视图。也就是说，实际上存储原始数据的是 `ArrayBuffer`，而 `TypedArray` 和 `Buffer` 对象提供了一种查看和操作数据的方式。可以并且通常会为同一个 `ArrayBuffer` 实例创建多个视图。使用传输列表传输 `ArrayBuffer` 时必须格外小心，因为这样做会导致共享同一 `ArrayBuffer` 的所有 `TypedArray` 和 `Buffer` 实例变得不可用。

```js [ESM]
const ab = new ArrayBuffer(10);

const u1 = new Uint8Array(ab);
const u2 = new Uint16Array(ab);

console.log(u2.length);  // 打印 5

port.postMessage(u1, [u1.buffer]);

console.log(u2.length);  // 打印 0
```
对于 `Buffer` 实例，具体来说，底层 `ArrayBuffer` 是否可以传输或克隆完全取决于实例的创建方式，而这通常无法可靠地确定。

可以使用 [`markAsUntransferable()`](/zh/nodejs/api/worker_threads#workermarkasuntransferableobject) 标记一个 `ArrayBuffer`，以表明它应该始终被克隆，而永远不被传输。

根据 `Buffer` 实例的创建方式，它可能拥有或不拥有其底层 `ArrayBuffer`。除非已知 `Buffer` 实例拥有 `ArrayBuffer`，否则不得传输 `ArrayBuffer`。特别是，对于从内部 `Buffer` 池创建的 `Buffer`（例如使用 `Buffer.from()` 或 `Buffer.allocUnsafe()`），无法传输它们，并且它们总是被克隆，这将发送整个 `Buffer` 池的副本。这种行为可能会带来意想不到的更高内存使用率和可能的安全问题。

有关 `Buffer` 池的更多详细信息，请参见 [`Buffer.allocUnsafe()`](/zh/nodejs/api/buffer#static-method-bufferallocunsafesize)。

使用 `Buffer.alloc()` 或 `Buffer.allocUnsafeSlow()` 创建的 `Buffer` 实例的 `ArrayBuffer` 始终可以传输，但是这样做会使这些 `ArrayBuffer` 的所有其他现有视图都变得不可用。


#### 克隆带有原型、类和访问器的对象时的注意事项 {#considerations-when-cloning-objects-with-prototypes-classes-and-accessors}

由于对象克隆使用 [HTML 结构化克隆算法](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)，因此非枚举属性、属性访问器和对象原型不会被保留。 特别是，[`Buffer`](/zh/nodejs/api/buffer) 对象将在接收端被读取为纯 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)，并且 JavaScript 类的实例将被克隆为纯 JavaScript 对象。

```js [ESM]
const b = Symbol('b');

class Foo {
  #a = 1;
  constructor() {
    this[b] = 2;
    this.c = 3;
  }

  get d() { return 4; }
}

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => console.log(data);

port2.postMessage(new Foo());

// Prints: { c: 3 }
```
此限制扩展到许多内置对象，例如全局 `URL` 对象：

```js [ESM]
const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => console.log(data);

port2.postMessage(new URL('https://example.org'));

// Prints: { }
```
### `port.hasRef()` {#porthasref}

**新增于: v18.1.0, v16.17.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果为真，则 `MessagePort` 对象将保持 Node.js 事件循环处于活动状态。

### `port.ref()` {#portref}

**新增于: v10.5.0**

与 `unref()` 相反。 如果 `ref()` 过的端口是剩余的唯一活动句柄，则在其上调用 `ref()` *不会* 让程序退出（默认行为）。 如果端口已 `ref()`，则再次调用 `ref()` 无效。

如果使用 `.on('message')` 附加或移除监听器，则端口会根据是否存在该事件的监听器自动进行 `ref()` 和 `unref()`。


### `port.start()` {#portstart}

**Added in: v10.5.0**

开始在此 `MessagePort` 上接收消息。 当将此端口用作事件发射器时，一旦附加了 `'message'` 侦听器，就会自动调用此方法。

此方法的存在是为了与 Web `MessagePort` API 对等。 在 Node.js 中，它仅在没有事件侦听器时忽略消息时才有用。 Node.js 在处理 `.onmessage` 方面也有所不同。 设置它会自动调用 `.start()`，但取消设置它会让消息排队，直到设置新的处理程序或丢弃端口。

### `port.unref()` {#portunref}

**Added in: v10.5.0**

在端口上调用 `unref()` 允许线程在它是事件系统中唯一活跃的句柄时退出。 如果端口已经被 `unref()`，再次调用 `unref()` 没有效果。

如果使用 `.on('message')` 附加或移除侦听器，则端口会根据事件的侦听器是否存在自动 `ref()` 和 `unref()`。

## Class: `Worker` {#class-worker}

**Added in: v10.5.0**

- 继承自: [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter)

`Worker` 类表示一个独立的 JavaScript 执行线程。 大多数 Node.js API 在其中可用。

Worker 环境内部的显着区别是：

- [`process.stdin`](/zh/nodejs/api/process#processstdin)、[`process.stdout`](/zh/nodejs/api/process#processstdout) 和 [`process.stderr`](/zh/nodejs/api/process#processstderr) 流可以由父线程重定向。
- [`require('node:worker_threads').isMainThread`](/zh/nodejs/api/worker_threads#workerismainthread) 属性设置为 `false`。
- [`require('node:worker_threads').parentPort`](/zh/nodejs/api/worker_threads#workerparentport) 消息端口可用。
- [`process.exit()`](/zh/nodejs/api/process#processexitcode) 不会停止整个程序，只会停止单个线程，并且 [`process.abort()`](/zh/nodejs/api/process#processabort) 不可用。
- [`process.chdir()`](/zh/nodejs/api/process#processchdirdirectory) 和设置组或用户 ID 的 `process` 方法不可用。
- [`process.env`](/zh/nodejs/api/process#processenv) 是父线程环境变量的副本，除非另有说明。 对一个副本的更改在其他线程中不可见，并且对本机插件不可见（除非将 [`worker.SHARE_ENV`](/zh/nodejs/api/worker_threads#workershare_env) 作为 `env` 选项传递给 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 构造函数）。 在 Windows 上，与主线程不同，环境变量的副本以区分大小写的方式运行。
- [`process.title`](/zh/nodejs/api/process#processtitle) 无法修改。
- 信号不会通过 [`process.on('...')`](/zh/nodejs/api/process#signal-events) 传递。
- 由于调用了 [`worker.terminate()`](/zh/nodejs/api/worker_threads#workerterminate)，执行可能随时停止。
- 无法访问来自父进程的 IPC 通道。
- 不支持 [`trace_events`](/zh/nodejs/api/tracing) 模块。
- 如果满足[某些条件](/zh/nodejs/api/addons#worker-support)，则只能从多个线程加载本机插件。

可以在其他 `Worker` 中创建 `Worker` 实例。

与 [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) 和 [`node:cluster` 模块](/zh/nodejs/api/cluster) 类似，可以通过线程间消息传递实现双向通信。 在内部，`Worker` 有一对内置的 [`MessagePort`](/zh/nodejs/api/worker_threads#class-messageport)s，它们在创建 `Worker` 时已经彼此关联。 虽然父端的 `MessagePort` 对象未直接公开，但其功能通过 [`worker.postMessage()`](/zh/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) 和 `Worker` 对象上的 [`worker.on('message')`](/zh/nodejs/api/worker_threads#event-message_1) 事件为父线程公开。

要创建自定义消息传递通道（建议使用默认的全局通道，因为它有助于分离关注点），用户可以在任一线程上创建一个 `MessageChannel` 对象，并通过一个预先存在的通道（例如全局通道）将该 `MessageChannel` 上的一个 `MessagePort` 传递给另一个线程。

有关如何传递消息以及哪种 JavaScript 值可以通过线程屏障成功传输的更多信息，请参阅 [`port.postMessage()`](/zh/nodejs/api/worker_threads#portpostmessagevalue-transferlist)。

```js [ESM]
const assert = require('node:assert');
const {
  Worker, MessageChannel, MessagePort, isMainThread, parentPort,
} = require('node:worker_threads');
if (isMainThread) {
  const worker = new Worker(__filename);
  const subChannel = new MessageChannel();
  worker.postMessage({ hereIsYourPort: subChannel.port1 }, [subChannel.port1]);
  subChannel.port2.on('message', (value) => {
    console.log('received:', value);
  });
} else {
  parentPort.once('message', (value) => {
    assert(value.hereIsYourPort instanceof MessagePort);
    value.hereIsYourPort.postMessage('the worker is sending this');
    value.hereIsYourPort.close();
  });
}
```

### `new Worker(filename[, options])` {#new-workerfilename-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.8.0, v18.16.0 | 添加了对 `name` 选项的支持，允许为 worker 标题添加名称以便于调试。 |
| v14.9.0 | `filename` 参数可以是使用 `data:` 协议的 WHATWG `URL` 对象。 |
| v14.9.0 | `trackUnmanagedFds` 选项默认设置为 `true`。 |
| v14.6.0, v12.19.0 | 引入了 `trackUnmanagedFds` 选项。 |
| v13.13.0, v12.17.0 | 引入了 `transferList` 选项。 |
| v13.12.0, v12.17.0 | `filename` 参数可以是使用 `file:` 协议的 WHATWG `URL` 对象。 |
| v13.4.0, v12.16.0 | 引入了 `argv` 选项。 |
| v13.2.0, v12.16.0 | 引入了 `resourceLimits` 选项。 |
| v10.5.0 | 添加于: v10.5.0 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) Worker 主脚本或模块的路径。 必须是绝对路径或相对路径（即相对于当前工作目录的路径），以 `./` 或 `../` 开头，或者是使用 `file:` 或 `data:` 协议的 WHATWG `URL` 对象。 当使用 [`data:` URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) 时，数据会根据 MIME 类型，使用 [ECMAScript 模块加载器](/zh/nodejs/api/esm#data-imports) 进行解释。 如果 `options.eval` 为 `true`，则这是一个包含 JavaScript 代码的字符串，而不是路径。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `argv` [\<any[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 将被字符串化并附加到 worker 中的 `process.argv` 的参数列表。 这与 `workerData` 大致相似，但这些值在全局 `process.argv` 上可用，就像它们作为 CLI 选项传递给脚本一样。
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 如果设置，则指定 Worker 线程内部 `process.env` 的初始值。 作为特殊值，可以使用 [`worker.SHARE_ENV`](/zh/nodejs/api/worker_threads#workershare_env) 来指定父线程和子线程应共享其环境变量； 在这种情况下，对一个线程的 `process.env` 对象所做的更改也会影响另一个线程。 **默认值:** `process.env`。
    - `eval` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 `true` 并且第一个参数是 `string`，则将构造函数的第一个参数解释为在 worker 上线后执行的脚本。
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 传递给 worker 的 node CLI 选项列表。 不支持 V8 选项（例如 `--max-old-space-size`）和影响进程的选项（例如 `--title`）。 如果设置，它会作为 worker 内部的 [`process.execArgv`](/zh/nodejs/api/process#processexecargv) 提供。 默认情况下，选项从父线程继承。
    - `stdin` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 `true`，则 `worker.stdin` 提供一个可写流，其内容在 Worker 内部显示为 `process.stdin`。 默认情况下，不提供任何数据。
    - `stdout` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 `true`，则 `worker.stdout` 不会自动通过管道传输到父进程中的 `process.stdout`。
    - `stderr` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 `true`，则 `worker.stderr` 不会自动通过管道传输到父进程中的 `process.stderr`。
    - `workerData` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 任何 JavaScript 值，该值会被克隆并作为 [`require('node:worker_threads').workerData`](/zh/nodejs/api/worker_threads#workerworkerdata) 提供。 克隆按照 [HTML 结构化克隆算法](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) 中描述的方式进行，如果对象无法克隆（例如，因为它包含 `function`），则会抛出错误。
    - `trackUnmanagedFds` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 `true`，则 Worker 会跟踪通过 [`fs.open()`](/zh/nodejs/api/fs#fsopenpath-flags-mode-callback) 和 [`fs.close()`](/zh/nodejs/api/fs#fsclosefd-callback) 管理的原始文件描述符，并在 Worker 退出时关闭它们，类似于其他资源（如网络套接字或通过 [`FileHandle`](/zh/nodejs/api/fs#class-filehandle) API 管理的文件描述符）。 此选项会自动被所有嵌套的 `Worker` 继承。 **默认值:** `true`。
    - `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 如果一个或多个类似 `MessagePort` 的对象在 `workerData` 中传递，则需要这些项的 `transferList`，否则会抛出 [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/zh/nodejs/api/errors#err_missing_message_port_in_transfer_list)。 有关更多信息，请参阅 [`port.postMessage()`](/zh/nodejs/api/worker_threads#portpostmessagevalue-transferlist)。
    - `resourceLimits` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 新 JS 引擎实例的可选资源限制集。 达到这些限制会导致 `Worker` 实例终止。 这些限制仅影响 JS 引擎，不影响外部数据，包括 `ArrayBuffer`。 即使设置了这些限制，如果进程遇到全局内存不足的情况，它仍然可能中止。
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 主堆的最大大小，以 MB 为单位。 如果设置了命令行参数 [`--max-old-space-size`](/zh/nodejs/api/cli#--max-old-space-sizesize-in-mib)，它会覆盖此设置。
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 最近创建的对象的堆空间的最大大小。 如果设置了命令行参数 [`--max-semi-space-size`](/zh/nodejs/api/cli#--max-semi-space-sizesize-in-mib)，它会覆盖此设置。
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 用于生成代码的预分配内存范围的大小。
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 线程的默认最大堆栈大小。 小值可能会导致 Worker 实例无法使用。 **默认值:** `4`。

    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 一个可选的 `name`，用于附加到 worker 标题，以便于调试/识别，使最终标题为 `[worker ${id}] ${name}`。 **默认值:** `''`。


### 事件: `'error'` {#event-error}

**加入于: v10.5.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

如果工作线程抛出一个未捕获的异常，则会触发 `'error'` 事件。 在这种情况下，工作线程会被终止。

### 事件: `'exit'` {#event-exit}

**加入于: v10.5.0**

- `exitCode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

一旦工作线程停止，就会触发 `'exit'` 事件。 如果工作线程通过调用 [`process.exit()`](/zh/nodejs/api/process#processexitcode) 退出，则 `exitCode` 参数是传递的退出码。 如果工作线程被终止，则 `exitCode` 参数为 `1`。

这是任何 `Worker` 实例发出的最后一个事件。

### 事件: `'message'` {#event-message_1}

**加入于: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 传输的值

当工作线程调用了 [`require('node:worker_threads').parentPort.postMessage()`](/zh/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) 时，会触发 `'message'` 事件。 有关更多详细信息，请参阅 [`port.on('message')`](/zh/nodejs/api/worker_threads#event-message) 事件。

从工作线程发送的所有消息都会在 `Worker` 对象上发出 [`'exit'` 事件](/zh/nodejs/api/worker_threads#event-exit) 之前发出。

### 事件: `'messageerror'` {#event-messageerror_1}

**加入于: v14.5.0, v12.19.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 一个 Error 对象

当反序列化消息失败时，会触发 `'messageerror'` 事件。

### 事件: `'online'` {#event-online}

**加入于: v10.5.0**

当工作线程开始执行 JavaScript 代码时，会触发 `'online'` 事件。

### `worker.getHeapSnapshot([options])` {#workergetheapsnapshotoptions}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.1.0 | 支持 options 以配置堆快照。 |
| v13.9.0, v12.17.0 | 加入于: v13.9.0, v12.17.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exposeInternals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 true，则在堆快照中公开内部信息。 **默认:** `false`。
    - `exposeNumericValues` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 true，则在人工字段中公开数值。 **默认:** `false`。


- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 一个 Promise，用于包含 V8 堆快照的可读流

返回一个可读流，用于 Worker 当前状态的 V8 快照。 有关更多详细信息，请参见 [`v8.getHeapSnapshot()`](/zh/nodejs/api/v8#v8getheapsnapshotoptions)。

如果 Worker 线程不再运行，这可能发生在发出 [`'exit'` 事件](/zh/nodejs/api/worker_threads#event-exit) 之前，则返回的 `Promise` 会立即被拒绝，并显示 [`ERR_WORKER_NOT_RUNNING`](/zh/nodejs/api/errors#err_worker_not_running) 错误。


### `worker.performance` {#workerperformance}

**添加于: v15.1.0, v14.17.0, v12.22.0**

一个对象，可用于从 worker 实例查询性能信息。类似于 [`perf_hooks.performance`](/zh/nodejs/api/perf_hooks#perf_hooksperformance)。

#### `performance.eventLoopUtilization([utilization1[, utilization2]])` {#performanceeventlooputilizationutilization1-utilization2}

**添加于: v15.1.0, v14.17.0, v12.22.0**

- `utilization1` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 先前调用 `eventLoopUtilization()` 的结果。
- `utilization2` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 在 `utilization1` 之前先前调用 `eventLoopUtilization()` 的结果。
- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `active` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

与 [`perf_hooks` `eventLoopUtilization()`](/zh/nodejs/api/perf_hooks#performanceeventlooputilizationutilization1-utilization2) 的调用相同，只是返回 worker 实例的值。

一个不同之处是，与主线程不同，worker 中的引导在事件循环中完成。 因此，一旦 worker 的脚本开始执行，事件循环利用率立即可用。

`idle` 时间不增加并不表示 worker 卡在引导中。 以下示例显示了 worker 的整个生命周期永远不会累积任何 `idle` 时间，但仍然能够处理消息。

```js [ESM]
const { Worker, isMainThread, parentPort } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  setInterval(() => {
    worker.postMessage('hi');
    console.log(worker.performance.eventLoopUtilization());
  }, 100).unref();
  return;
}

parentPort.on('message', () => console.log('msg')).unref();
(function r(n) {
  if (--n < 0) return;
  const t = Date.now();
  while (Date.now() - t < 300);
  setImmediate(r, n);
})(10);
```
只有在发出 [`'online'` 事件](/zh/nodejs/api/worker_threads#event-online) 之后，worker 的事件循环利用率才可用，如果在之前或在 [`'exit'` 事件](/zh/nodejs/api/worker_threads#event-exit) 之后调用，则所有属性的值都为 `0`。


### `worker.postMessage(value[, transferList])` {#workerpostmessagevalue-transferlist}

**新增于: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

向工作线程发送消息，该消息通过 [`require('node:worker_threads').parentPort.on('message')`](/zh/nodejs/api/worker_threads#event-message) 接收。 有关更多详细信息，请参见 [`port.postMessage()`](/zh/nodejs/api/worker_threads#portpostmessagevalue-transferlist)。

### `worker.ref()` {#workerref}

**新增于: v10.5.0**

与 `unref()` 相反，如果 `ref()` 之前在一个 `unref()` 过的工作线程上调用，则当它是唯一处于活动状态的句柄时，*不会*让程序退出（默认行为）。 如果工作线程是 `ref()` 的，则再次调用 `ref()` 没有效果。

### `worker.resourceLimits` {#workerresourcelimits_1}

**新增于: v13.2.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

为该工作线程提供了一组 JS 引擎资源约束。 如果将 `resourceLimits` 选项传递给 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 构造函数，则此值与其值匹配。

如果工作线程已停止，则返回值是一个空对象。

### `worker.stderr` {#workerstderr}

**新增于: v10.5.0**

- [\<stream.Readable\>](/zh/nodejs/api/stream#class-streamreadable)

这是一个可读流，其中包含写入到工作线程内部的 [`process.stderr`](/zh/nodejs/api/process#processstderr) 的数据。 如果没有将 `stderr: true` 传递给 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 构造函数，则数据将被管道传输到父线程的 [`process.stderr`](/zh/nodejs/api/process#processstderr) 流。


### `worker.stdin` {#workerstdin}

**添加于: v10.5.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<stream.Writable\>](/zh/nodejs/api/stream#class-streamwritable)

如果将 `stdin: true` 传递给 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 构造函数，则这是一个可写流。 写入此流的数据将在工作线程中作为 [`process.stdin`](/zh/nodejs/api/process#processstdin) 提供。

### `worker.stdout` {#workerstdout}

**添加于: v10.5.0**

- [\<stream.Readable\>](/zh/nodejs/api/stream#class-streamreadable)

这是一个可读流，其中包含写入工作线程内部的 [`process.stdout`](/zh/nodejs/api/process#processstdout) 的数据。 如果未将 `stdout: true` 传递给 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 构造函数，则会将数据传递到父线程的 [`process.stdout`](/zh/nodejs/api/process#processstdout) 流。

### `worker.terminate()` {#workerterminate}

::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v12.5.0 | 此函数现在返回 Promise。 传递回调已被弃用，并且直到此版本都是无用的，因为 Worker 实际上是同步终止的。 终止现在是一个完全异步的操作。 |
| v10.5.0 | 添加于: v10.5.0 |
:::

- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

尽快停止工作线程中的所有 JavaScript 执行。 返回一个 Promise，该 Promise 在发出 [`'exit'` 事件](/zh/nodejs/api/worker_threads#event-exit) 时解析为退出代码。

### `worker.threadId` {#workerthreadid_1}

**添加于: v10.5.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

被引用线程的整数标识符。 在工作线程内部，它可以作为 [`require('node:worker_threads').threadId`](/zh/nodejs/api/worker_threads#workerthreadid) 使用。 对于单个进程中的每个 `Worker` 实例，此值都是唯一的。

### `worker.unref()` {#workerunref}

**添加于: v10.5.0**

如果这是事件系统中唯一活动的句柄，则在 worker 上调用 `unref()` 允许线程退出。 如果 worker 已经 `unref()`，则再次调用 `unref()` 不会产生任何影响。


## 注释 {#notes}

### stdio 的同步阻塞 {#synchronous-blocking-of-stdio}

`Worker` 通过 [\<MessagePort\>](/zh/nodejs/api/worker_threads#class-messageport) 使用消息传递来实现与 `stdio` 的交互。这意味着来自 `Worker` 的 `stdio` 输出可能被接收端的同步代码阻塞，该代码阻塞了 Node.js 事件循环。

::: code-group
```js [ESM]
import {
  Worker,
  isMainThread,
} from 'node:worker_threads';

if (isMainThread) {
  new Worker(new URL(import.meta.url));
  for (let n = 0; n < 1e10; n++) {
    // 循环以模拟工作。
  }
} else {
  // 此输出将被主线程中的 for 循环阻塞。
  console.log('foo');
}
```

```js [CJS]
'use strict';

const {
  Worker,
  isMainThread,
} = require('node:worker_threads');

if (isMainThread) {
  new Worker(__filename);
  for (let n = 0; n < 1e10; n++) {
    // 循环以模拟工作。
  }
} else {
  // 此输出将被主线程中的 for 循环阻塞。
  console.log('foo');
}
```
:::

### 从预加载脚本启动工作线程 {#launching-worker-threads-from-preload-scripts}

从预加载脚本（使用 `-r` 命令行标志加载和运行的脚本）启动工作线程时请注意。除非显式设置了 `execArgv` 选项，否则新的 Worker 线程会自动继承运行进程中的命令行标志，并将预加载与主线程相同的预加载脚本。如果预加载脚本无条件地启动工作线程，则每个产生的线程都会产生另一个线程，直到应用程序崩溃。

