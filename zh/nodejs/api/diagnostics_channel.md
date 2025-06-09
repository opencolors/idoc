---
title: Node.js 诊断通道
description: Node.js 中的诊断通道模块提供了一个 API，用于创建、发布和订阅诊断信息的命名通道，以实现更好的应用监控和调试。
head:
  - - meta
    - name: og:title
      content: Node.js 诊断通道 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 中的诊断通道模块提供了一个 API，用于创建、发布和订阅诊断信息的命名通道，以实现更好的应用监控和调试。
  - - meta
    - name: twitter:title
      content: Node.js 诊断通道 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 中的诊断通道模块提供了一个 API，用于创建、发布和订阅诊断信息的命名通道，以实现更好的应用监控和调试。
---


# 诊断通道 {#diagnostics-channel}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.2.0, v18.13.0 | `diagnostics_channel` 现在是稳定的。 |
| v15.1.0, v14.17.0 | 添加于: v15.1.0, v14.17.0 |
:::

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源代码:** [lib/diagnostics_channel.js](https://github.com/nodejs/node/blob/v23.5.0/lib/diagnostics_channel.js)

`node:diagnostics_channel` 模块提供了一个 API 来创建命名通道，以报告用于诊断目的的任意消息数据。

可以使用以下方法访问它：

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
```
:::

模块编写者打算报告诊断消息，将创建一个或多个顶级通道来报告消息。 也可以在运行时获取通道，但不鼓励这样做，因为它会增加额外的开销。 可以为了方便起见导出通道，但只要知道名称，就可以在任何地方获取它。

如果您希望您的模块生成诊断数据供其他人使用，建议您包含有关使用哪些命名通道以及消息数据形状的文档。 通道名称通常应包含模块名称，以避免与其他模块的数据发生冲突。

## 公共 API {#public-api}

### 概述 {#overview}

以下是公共 API 的简单概述。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

// 获取可重用的通道对象
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // 接收到的数据
}

// 订阅通道
diagnostics_channel.subscribe('my-channel', onMessage);

// 检查通道是否具有活动的订阅者
if (channel.hasSubscribers) {
  // 将数据发布到通道
  channel.publish({
    some: 'data',
  });
}

// 取消订阅通道
diagnostics_channel.unsubscribe('my-channel', onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

// 获取可重用的通道对象
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // 接收到的数据
}

// 订阅通道
diagnostics_channel.subscribe('my-channel', onMessage);

// 检查通道是否具有活动的订阅者
if (channel.hasSubscribers) {
  // 将数据发布到通道
  channel.publish({
    some: 'data',
  });
}

// 取消订阅通道
diagnostics_channel.unsubscribe('my-channel', onMessage);
```
:::


#### `diagnostics_channel.hasSubscribers(name)` {#diagnostics_channelhassubscribersname}

**新增于: v15.1.0, v14.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 通道名称
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 是否有活跃的订阅者

检查指定名称的通道是否有活跃的订阅者。 如果要发送的消息准备起来可能开销很大，这将很有帮助。

此 API 是可选的，但在尝试从对性能非常敏感的代码发布消息时很有用。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // 有订阅者，准备并发布消息
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // 有订阅者，准备并发布消息
}
```
:::

#### `diagnostics_channel.channel(name)` {#diagnostics_channelchannelname}

**新增于: v15.1.0, v14.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 通道名称
- 返回: [\<Channel\>](/zh/nodejs/api/diagnostics_channel#class-channel) 指定名称的通道对象

对于任何想要发布到指定名称的通道的人来说，这是主要的入口点。 它生成一个通道对象，该对象经过优化，可以尽可能减少发布时的开销。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');
```
:::

#### `diagnostics_channel.subscribe(name, onMessage)` {#diagnostics_channelsubscribename-onmessage}

**新增于: v18.7.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 通道名称
- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 接收通道消息的处理函数
    - `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 消息数据
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 通道的名称
  
 

注册消息处理函数以订阅此通道。 每当向通道发布消息时，将同步运行此消息处理函数。 消息处理函数中抛出的任何错误都将触发 [`'uncaughtException'`](/zh/nodejs/api/process#event-uncaughtexception)。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // 接收到数据
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // 接收到数据
});
```
:::


#### `diagnostics_channel.unsubscribe(name, onMessage)` {#diagnostics_channelunsubscribename-onmessage}

**添加于: v18.7.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 通道名称
- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 要移除的先前订阅的处理程序
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果找到处理程序，则为 `true`，否则为 `false`。

移除之前使用 [`diagnostics_channel.subscribe(name, onMessage)`](/zh/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage) 注册到此通道的消息处理程序。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

function onMessage(message, name) {
  // 接收到的数据
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

function onMessage(message, name) {
  // 接收到的数据
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
```
:::

#### `diagnostics_channel.tracingChannel(nameOrChannels)` {#diagnostics_channeltracingchannelnameorchannels}

**添加于: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性的
:::

- `nameOrChannels` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<TracingChannel\>](/zh/nodejs/api/diagnostics_channel#class-tracingchannel) 通道名称或包含所有 [TracingChannel Channels](/zh/nodejs/api/diagnostics_channel#tracingchannel-channels) 的对象
- 返回: [\<TracingChannel\>](/zh/nodejs/api/diagnostics_channel#class-tracingchannel) 用于跟踪的通道集合

为给定的 [TracingChannel Channels](/zh/nodejs/api/diagnostics_channel#tracingchannel-channels) 创建一个 [`TracingChannel`](/zh/nodejs/api/diagnostics_channel#class-tracingchannel) 包装器。 如果给定一个名称，则将以 `tracing:${name}:${eventType}` 的形式创建相应的跟踪通道，其中 `eventType` 对应于 [TracingChannel Channels](/zh/nodejs/api/diagnostics_channel#tracingchannel-channels) 的类型。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// or...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// or...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
```
:::


### 类: `Channel` {#class-channel}

**加入版本: v15.1.0, v14.17.0**

`Channel` 类表示数据管道中的一个独立的命名通道。 它用于跟踪订阅者，并在有订阅者存在时发布消息。 它作为一个单独的对象存在，以避免在发布时进行通道查找，从而实现非常快的发布速度，并允许大量使用，同时产生非常小的成本。 通道使用 [`diagnostics_channel.channel(name)`](/zh/nodejs/api/diagnostics_channel#diagnostics_channelchannelname) 创建，不支持直接使用 `new Channel(name)` 构造通道。

#### `channel.hasSubscribers` {#channelhassubscribers}

**加入版本: v15.1.0, v14.17.0**

- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 是否有活动的订阅者

检查此通道是否有活动的订阅者。 如果您要发送的消息准备起来可能很昂贵，这将很有帮助。

此 API 是可选的，但在尝试从对性能非常敏感的代码中发布消息时很有用。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // 有订阅者，准备并发布消息
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // 有订阅者，准备并发布消息
}
```
:::

#### `channel.publish(message)` {#channelpublishmessage}

**加入版本: v15.1.0, v14.17.0**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 要发送给通道订阅者的消息

向通道的任何订阅者发布消息。 这将同步触发消息处理程序，因此它们将在同一上下文中执行。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
```
:::


#### `channel.subscribe(onMessage)` {#channelsubscribeonmessage}

**添加于: v15.1.0, v14.17.0**

**已弃用自: v18.7.0, v16.17.0**

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用: 请使用 [`diagnostics_channel.subscribe(name, onMessage)`](/zh/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage)
:::

- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 接收频道消息的处理函数
    - `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 消息数据
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 频道名称

注册一个消息处理函数，以订阅此频道。 每当有消息发布到该频道时，将同步运行此消息处理函数。 消息处理函数中抛出的任何错误都将触发 [`'uncaughtException'`](/zh/nodejs/api/process#event-uncaughtexception)。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // 接收到的数据
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // 接收到的数据
});
```
:::

#### `channel.unsubscribe(onMessage)` {#channelunsubscribeonmessage}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.7.0, v16.17.0 | 自此版本起已弃用: v18.7.0, v16.17.0 |
| v17.1.0, v16.14.0, v14.19.0 | 添加了返回值。 已添加到没有订阅者的频道。 |
| v15.1.0, v14.17.0 | 添加于: v15.1.0, v14.17.0 |
:::

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用: 请使用 [`diagnostics_channel.unsubscribe(name, onMessage)`](/zh/nodejs/api/diagnostics_channel#diagnostics_channelunsubscribename-onmessage)
:::

- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 要移除的先前订阅的处理函数
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果找到该处理函数，则返回 `true`；否则返回 `false`。

移除先前使用 [`channel.subscribe(onMessage)`](/zh/nodejs/api/diagnostics_channel#channelsubscribeonmessage) 注册到此频道的消息处理函数。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // 接收到的数据
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // 接收到的数据
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
```
:::


#### `channel.bindStore(store[, transform])` {#channelbindstorestore-transform}

**新增于: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `store` [\<AsyncLocalStorage\>](/zh/nodejs/api/async_context#class-asynclocalstorage) 要绑定上下文数据的存储
- `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 在设置存储上下文之前转换上下文数据

当调用 [`channel.runStores(context, ...)`](/zh/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) 时，给定的上下文数据将应用于绑定到该通道的任何存储。 如果存储已经绑定，则先前的 `transform` 函数将被新的函数替换。 可以省略 `transform` 函数以将给定的上下文数据直接设置为上下文。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
```
:::

#### `channel.unbindStore(store)` {#channelunbindstorestore}

**新增于: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `store` [\<AsyncLocalStorage\>](/zh/nodejs/api/async_context#class-asynclocalstorage) 要从通道解绑的存储。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果找到存储，则为 `true`，否则为 `false`。

删除先前使用 [`channel.bindStore(store)`](/zh/nodejs/api/diagnostics_channel#channelbindstorestore-transform) 注册到此通道的消息处理程序。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
```
:::


#### `channel.runStores(context, fn[, thisArg[, ...args]])` {#channelrunstorescontext-fn-thisarg-args}

**新增于: v19.9.0, v18.19.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `context` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 要发送给订阅者并绑定到存储的消息
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 要在进入的存储上下文中运行的处理函数
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 用于函数调用的接收器。
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 传递给该函数的可选参数。

将给定的数据应用到绑定到通道的任何 AsyncLocalStorage 实例，持续给定的函数执行时间，然后在该数据应用于存储的范围内发布到通道。

如果为 [`channel.bindStore(store)`](/zh/nodejs/api/diagnostics_channel#channelbindstorestore-transform) 提供了一个转换函数，它将被应用于转换消息数据，然后该数据将成为存储的上下文值。 在需要上下文链接的情况下，可以从转换函数中访问先前的存储上下文。

应用于存储的上下文应可在任何从给定的函数开始执行的异步代码中访问，但是，在某些情况下可能会发生[上下文丢失](/zh/nodejs/api/async_context#troubleshooting-context-loss)。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
```
:::


### 类：`TracingChannel` {#class-tracingchannel}

**新增于: v19.9.0, v18.19.0**

::: warning [稳定度: 1 - 实验]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验
:::

类 `TracingChannel` 是一组 [TracingChannel 通道](/zh/nodejs/api/diagnostics_channel#tracingchannel-channels) 的集合，这些通道共同表达一个可追踪的动作。 它用于形式化和简化为追踪应用程序流生成事件的过程。 [`diagnostics_channel.tracingChannel()`](/zh/nodejs/api/diagnostics_channel#diagnostics_channeltracingchannelnameorchannels) 用于构造 `TracingChannel`。 与 `Channel` 一样，建议在文件的顶层创建和重用单个 `TracingChannel`，而不是动态创建它们。

#### `tracingChannel.subscribe(subscribers)` {#tracingchannelsubscribesubscribers}

**新增于: v19.9.0, v18.19.0**

::: warning [稳定度: 1 - 实验]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验
:::

- `subscribers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 一组 [TracingChannel 通道](/zh/nodejs/api/diagnostics_channel#tracingchannel-channels) 订阅者
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`start` 事件](/zh/nodejs/api/diagnostics_channel#startevent) 订阅者
    - `end` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`end` 事件](/zh/nodejs/api/diagnostics_channel#endevent) 订阅者
    - `asyncStart` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`asyncStart` 事件](/zh/nodejs/api/diagnostics_channel#asyncstartevent) 订阅者
    - `asyncEnd` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`asyncEnd` 事件](/zh/nodejs/api/diagnostics_channel#asyncendevent) 订阅者
    - `error` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`error` 事件](/zh/nodejs/api/diagnostics_channel#errorevent) 订阅者
  
 

辅助函数，用于将一组函数订阅到相应的通道。 这与在每个通道上单独调用 [`channel.subscribe(onMessage)`](/zh/nodejs/api/diagnostics_channel#channelsubscribeonmessage) 相同。



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // 处理 start 消息
  },
  end(message) {
    // 处理 end 消息
  },
  asyncStart(message) {
    // 处理 asyncStart 消息
  },
  asyncEnd(message) {
    // 处理 asyncEnd 消息
  },
  error(message) {
    // 处理 error 消息
  },
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // 处理 start 消息
  },
  end(message) {
    // 处理 end 消息
  },
  asyncStart(message) {
    // 处理 asyncStart 消息
  },
  asyncEnd(message) {
    // 处理 asyncEnd 消息
  },
  error(message) {
    // 处理 error 消息
  },
});
```
:::


#### `tracingChannel.unsubscribe(subscribers)` {#tracingchannelunsubscribesubscribers}

**新增于: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性的
:::

- `subscribers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [TracingChannel 通道](/zh/nodejs/api/diagnostics_channel#tracingchannel-channels) 订阅者的集合
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`start` 事件](/zh/nodejs/api/diagnostics_channel#startevent) 订阅者
    - `end` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`end` 事件](/zh/nodejs/api/diagnostics_channel#endevent) 订阅者
    - `asyncStart` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`asyncStart` 事件](/zh/nodejs/api/diagnostics_channel#asyncstartevent) 订阅者
    - `asyncEnd` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`asyncEnd` 事件](/zh/nodejs/api/diagnostics_channel#asyncendevent) 订阅者
    - `error` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`error` 事件](/zh/nodejs/api/diagnostics_channel#errorevent) 订阅者
  
 
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果所有处理程序都已成功取消订阅，则为 `true`，否则为 `false`。

用于从相应通道取消订阅函数集合的辅助函数。 这与分别在每个通道上调用 [`channel.unsubscribe(onMessage)`](/zh/nodejs/api/diagnostics_channel#channelunsubscribeonmessage) 相同。



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // 处理 start 消息
  },
  end(message) {
    // 处理 end 消息
  },
  asyncStart(message) {
    // 处理 asyncStart 消息
  },
  asyncEnd(message) {
    // 处理 asyncEnd 消息
  },
  error(message) {
    // 处理 error 消息
  },
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // 处理 start 消息
  },
  end(message) {
    // 处理 end 消息
  },
  asyncStart(message) {
    // 处理 asyncStart 消息
  },
  asyncEnd(message) {
    // 处理 asyncEnd 消息
  },
  error(message) {
    // 处理 error 消息
  },
});
```
:::


#### `tracingChannel.traceSync(fn[, context[, thisArg[, ...args]]])` {#tracingchanneltracesyncfn-context-thisarg-args}

**新增于: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 要包装跟踪的函数
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 用于关联事件的共享对象
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 用于函数调用的接收者
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 传递给函数的可选参数
- 返回: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 给定函数的返回值

跟踪一个同步函数调用。 这将始终在执行前后生成一个 [`start` 事件](/zh/nodejs/api/diagnostics_channel#startevent) 和一个 [`end` 事件](/zh/nodejs/api/diagnostics_channel#endevent)，如果给定的函数抛出错误，可能会生成一个 [`error` 事件](/zh/nodejs/api/diagnostics_channel#errorevent)。 这将使用 `start` 通道上的 [`channel.runStores(context, ...)`](/zh/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) 运行给定的函数，这确保了所有事件都应将任何绑定的存储设置为匹配此跟踪上下文。

为了确保只形成正确的跟踪图，只有在开始跟踪之前存在订阅者时，才会发布事件。 在跟踪开始后添加的订阅将不会收到来自该跟踪的未来事件，只会看到未来的跟踪。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // 做一些事情
}, {
  some: 'thing',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // 做一些事情
}, {
  some: 'thing',
});
```
:::


#### `tracingChannel.tracePromise(fn[, context[, thisArg[, ...args]]])` {#tracingchanneltracepromisefn-context-thisarg-args}

**Added in: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 要包装跟踪的返回 Promise 的函数
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 用于关联跟踪事件的共享对象
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 用于函数调用的接收者
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 传递给函数的可选参数
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 从给定函数返回的 Promise 链式调用

跟踪返回 Promise 的函数调用。 这将始终在函数执行的同步部分周围生成一个 [`start` 事件](/zh/nodejs/api/diagnostics_channel#startevent) 和一个 [`end` 事件](/zh/nodejs/api/diagnostics_channel#endevent)，并且当到达 Promise 继续时，将生成一个 [`asyncStart` 事件](/zh/nodejs/api/diagnostics_channel#asyncstartevent) 和一个 [`asyncEnd` 事件](/zh/nodejs/api/diagnostics_channel#asyncendevent)。 如果给定函数抛出错误或返回的 Promise 拒绝，它也可能产生一个 [`error` 事件](/zh/nodejs/api/diagnostics_channel#errorevent)。 这将使用 [`channel.runStores(context, ...)`](/zh/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) 在 `start` 通道上运行给定的函数，这确保所有事件都应将任何绑定的存储设置为匹配此跟踪上下文。

为了确保只形成正确的跟踪图，只有在开始跟踪之前存在订阅者的情况下才会发布事件。 在跟踪开始后添加的订阅将不会收到来自该跟踪的未来事件，只会看到未来的跟踪。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
```
:::


#### `tracingChannel.traceCallback(fn[, position[, context[, thisArg[, ...args]]]])` {#tracingchanneltracecallbackfn-position-context-thisarg-args}

**新增于: v19.9.0, v18.19.0**

::: warning [稳定度: 1 - 实验]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验
:::

- `fn` [\<Function\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function) 使用函数的回调，围绕其包装一个追踪
- `position` [\<number\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Number_type) 预期回调的从零开始的参数位置（如果传递 `undefined`，则默认为最后一个参数）
- `context` [\<Object\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object) 用于关联追踪事件的共享对象（如果传递 `undefined`，则默认为 `{}`）
- `thisArg` [\<any\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Data_types) 用于函数调用的接收者
- `...args` [\<any\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Data_types) 传递给函数的参数（必须包含回调）
- 返回: [\<any\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Data_types) 给定函数的返回值

追踪接收回调的函数调用。 预期回调遵循通常使用的第一个参数作为错误的约定。 这将始终在函数执行的同步部分周围生成一个 [`start` 事件](/zh/nodejs/api/diagnostics_channel#startevent) 和 [`end` 事件](/zh/nodejs/api/diagnostics_channel#endevent)，并且将在回调执行周围生成一个 [`asyncStart` 事件](/zh/nodejs/api/diagnostics_channel#asyncstartevent) 和 [`asyncEnd` 事件](/zh/nodejs/api/diagnostics_channel#asyncendevent)。 如果给定的函数抛出异常或者传递给回调的第一个参数已设置，它也可能产生一个 [`error` 事件](/zh/nodejs/api/diagnostics_channel#errorevent)。 这将使用 [`channel.runStores(context, ...)`](/zh/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) 在 `start` 通道上运行给定的函数，这确保了所有事件都应具有任何绑定存储，设置为匹配此追踪上下文。

为了确保仅形成正确的追踪图，只有在追踪开始之前存在订阅者时才会发布事件。 在追踪开始后添加的订阅将不会收到来自该追踪的未来事件，只会看到未来的追踪。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // 做一些事情
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // 做一些事情
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
```
:::

回调也将使用 [`channel.runStores(context, ...)`](/zh/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) 运行，这在某些情况下启用了上下文丢失恢复。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// start 通道将初始存储数据设置为某些内容
// 并将该存储数据值存储在追踪上下文对象上
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// 然后 asyncStart 可以从它之前存储的数据中恢复
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// start 通道将初始存储数据设置为某些内容
// 并将该存储数据值存储在追踪上下文对象上
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// 然后 asyncStart 可以从它之前存储的数据中恢复
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
```
:::


#### `tracingChannel.hasSubscribers` {#tracingchannelhassubscribers}

**添加于: v22.0.0, v20.13.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果任何一个单独的通道有订阅者则返回 `true`，否则返回 `false`。

这是一个在 [`TracingChannel`](/zh/nodejs/api/diagnostics_channel#class-tracingchannel) 实例上可用的辅助方法，用于检查任何 [TracingChannel 通道](/zh/nodejs/api/diagnostics_channel#tracingchannel-channels) 是否有订阅者。 如果其中任何一个通道至少有一个订阅者，则返回 `true`，否则返回 `false`。

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Do something
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Do something
}
```
:::

### TracingChannel 通道 {#tracingchannel-channels}

TracingChannel 是几个 diagnostics_channel 的集合，代表单个可跟踪操作的执行生命周期中的特定点。 该行为分为五个 diagnostics_channel，包括 `start`、`end`、`asyncStart`、`asyncEnd` 和 `error`。 单个可跟踪操作将在所有事件之间共享相同的事件对象，这对于通过 weakmap 管理关联非常有用。

当任务“完成”时，这些事件对象将使用 `result` 或 `error` 值进行扩展。 在同步任务的情况下，`result` 将是返回值，而 `error` 将是该函数抛出的任何内容。 对于基于回调的异步函数，`result` 将是回调的第二个参数，而 `error` 将是在 `end` 事件中可见的抛出错误，或者是 `asyncStart` 或 `asyncEnd` 事件中的第一个回调参数。

为了确保只形成正确的跟踪图，只有在开始跟踪之前存在订阅者的情况下，才应发布事件。 在跟踪开始后添加的订阅不应接收来自该跟踪的未来事件，只会看到未来的跟踪。

跟踪通道应遵循以下命名模式：

- `tracing:module.class.method:start` 或 `tracing:module.function:start`
- `tracing:module.class.method:end` 或 `tracing:module.function:end`
- `tracing:module.class.method:asyncStart` 或 `tracing:module.function:asyncStart`
- `tracing:module.class.method:asyncEnd` 或 `tracing:module.function:asyncEnd`
- `tracing:module.class.method:error` 或 `tracing:module.function:error`


#### `start(event)` {#startevent}

- 名称: `tracing:${name}:start`

`start` 事件表示函数被调用的时刻。此时，事件数据可能包含函数参数或函数执行开始时可用的任何其他信息。

#### `end(event)` {#endevent}

- 名称: `tracing:${name}:end`

`end` 事件表示函数调用返回值的时刻。对于异步函数，这指的是 Promise 返回的时刻，而不是函数本身在内部执行 return 语句的时刻。此时，如果被追踪的函数是同步的，则 `result` 字段将被设置为函数的返回值。或者，可能会存在 `error` 字段来表示任何抛出的错误。

建议专门监听 `error` 事件来追踪错误，因为一个可追踪的操作可能会产生多个错误。例如，一个失败的异步任务可能在同步部分任务抛出错误之前就已经在内部启动。

#### `asyncStart(event)` {#asyncstartevent}

- 名称: `tracing:${name}:asyncStart`

`asyncStart` 事件表示可追踪函数的回调或延续被执行的时刻。此时，回调参数等信息可能是可用的，或者其他表达操作“结果”的任何信息。

对于基于回调的函数，回调的第一个参数将被赋值给 `error` 字段，如果它不是 `undefined` 或 `null` 的话，并且第二个参数将被赋值给 `result` 字段。

对于 Promise， `resolve` 路径的参数将被赋值给 `result` ， `reject` 路径的参数将被赋值给 `error`。

建议专门监听 `error` 事件来追踪错误，因为一个可追踪的操作可能会产生多个错误。例如，一个失败的异步任务可能在同步部分任务抛出错误之前就已经在内部启动。

#### `asyncEnd(event)` {#asyncendevent}

- 名称: `tracing:${name}:asyncEnd`

`asyncEnd` 事件表示异步函数的回调返回的时刻。在 `asyncStart` 事件之后，事件数据不太可能发生变化，但是查看回调完成的时刻可能是有用的。


#### `error(event)` {#errorevent}

- 名称: `tracing:${name}:error`

`error` 事件表示可追踪函数同步或异步产生的任何错误。如果在被追踪函数的同步部分抛出错误，该错误将被赋值给事件的 `error` 字段，并触发 `error` 事件。如果通过回调或 Promise rejection 异步接收到错误，它也会被赋值给事件的 `error` 字段，并触发 `error` 事件。

单个可追踪函数调用可能会多次产生错误，因此在消费此事件时应考虑这一点。例如，如果内部触发了另一个异步任务，该任务失败，然后函数的同步部分抛出错误，则会发出两个 `error` 事件，一个用于同步错误，一个用于异步错误。

### 内置通道 {#built-in-channels}

::: warning [稳定: 1 - 实验性]
[稳定: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

虽然 diagnostics_channel API 现在被认为是稳定的，但当前可用的内置通道并非如此。每个通道必须单独声明为稳定。

#### HTTP {#http}

`http.client.request.created`

- `request` [\<http.ClientRequest\>](/zh/nodejs/api/http#class-httpclientrequest)

当客户端创建请求对象时发出。与 `http.client.request.start` 不同，此事件在请求发送之前发出。

`http.client.request.start`

- `request` [\<http.ClientRequest\>](/zh/nodejs/api/http#class-httpclientrequest)

当客户端开始请求时发出。

`http.client.request.error`

- `request` [\<http.ClientRequest\>](/zh/nodejs/api/http#class-httpclientrequest)
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

当客户端请求期间发生错误时发出。

`http.client.response.finish`

- `request` [\<http.ClientRequest\>](/zh/nodejs/api/http#class-httpclientrequest)
- `response` [\<http.IncomingMessage\>](/zh/nodejs/api/http#class-httpincomingmessage)

当客户端收到响应时发出。

`http.server.request.start`

- `request` [\<http.IncomingMessage\>](/zh/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/zh/nodejs/api/http#class-httpserverresponse)
- `socket` [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket)
- `server` [\<http.Server\>](/zh/nodejs/api/http#class-httpserver)

当服务器收到请求时发出。

`http.server.response.created`

- `request` [\<http.IncomingMessage\>](/zh/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/zh/nodejs/api/http#class-httpserverresponse)

当服务器创建响应时发出。该事件在发送响应之前发出。

`http.server.response.finish`

- `request` [\<http.IncomingMessage\>](/zh/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/zh/nodejs/api/http#class-httpserverresponse)
- `socket` [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket)
- `server` [\<http.Server\>](/zh/nodejs/api/http#class-httpserver)

当服务器发送响应时发出。


#### 模块 {#modules}

`module.require.start`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 包含以下属性
    - `id` - 传递给 `require()` 的参数。模块名。
    - `parentFilename` - 尝试 require(id) 的模块名。
  
 

在 `require()` 执行时触发。参见 [`start` event](/zh/nodejs/api/diagnostics_channel#startevent)。

`module.require.end`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 包含以下属性
    - `id` - 传递给 `require()` 的参数。模块名。
    - `parentFilename` - 尝试 require(id) 的模块名。
  
 

在 `require()` 调用返回时触发。参见 [`end` event](/zh/nodejs/api/diagnostics_channel#endevent)。

`module.require.error`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 包含以下属性
    - `id` - 传递给 `require()` 的参数。模块名。
    - `parentFilename` - 尝试 require(id) 的模块名。
  
 
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

在 `require()` 抛出错误时触发。参见 [`error` event](/zh/nodejs/api/diagnostics_channel#errorevent)。

`module.import.asyncStart`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 包含以下属性
    - `id` - 传递给 `import()` 的参数。模块名。
    - `parentURL` - 尝试 import(id) 的模块的 URL 对象。
  
 

在 `import()` 被调用时触发。参见 [`asyncStart` event](/zh/nodejs/api/diagnostics_channel#asyncstartevent)。

`module.import.asyncEnd`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 包含以下属性
    - `id` - 传递给 `import()` 的参数。模块名。
    - `parentURL` - 尝试 import(id) 的模块的 URL 对象。
  
 

在 `import()` 完成时触发。参见 [`asyncEnd` event](/zh/nodejs/api/diagnostics_channel#asyncendevent)。

`module.import.error`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 包含以下属性
    - `id` - 传递给 `import()` 的参数。模块名。
    - `parentURL` - 尝试 import(id) 的模块的 URL 对象。
  
 
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

在 `import()` 抛出错误时触发。参见 [`error` event](/zh/nodejs/api/diagnostics_channel#errorevent)。


#### NET {#net}

`net.client.socket`

- `socket` [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket)

当创建一个新的 TCP 或管道客户端套接字时触发。

`net.server.socket`

- `socket` [\<net.Socket\>](/zh/nodejs/api/net#class-netsocket)

当接收到一个新的 TCP 或管道连接时触发。

`tracing:net.server.listen:asyncStart`

- `server` [\<net.Server\>](/zh/nodejs/api/net#class-netserver)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

当 [`net.Server.listen()`](/zh/nodejs/api/net#serverlisten) 被调用时触发，在端口或管道实际建立之前。

`tracing:net.server.listen:asyncEnd`

- `server` [\<net.Server\>](/zh/nodejs/api/net#class-netserver)

当 [`net.Server.listen()`](/zh/nodejs/api/net#serverlisten) 完成，并且服务器准备好接受连接时触发。

`tracing:net.server.listen:error`

- `server` [\<net.Server\>](/zh/nodejs/api/net#class-netserver)
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

当 [`net.Server.listen()`](/zh/nodejs/api/net#serverlisten) 返回一个错误时触发。

#### UDP {#udp}

`udp.socket`

- `socket` [\<dgram.Socket\>](/zh/nodejs/api/dgram#class-dgramsocket)

当创建一个新的 UDP 套接字时触发。

#### Process {#process}

**新增于: v16.18.0**

`child_process`

- `process` [\<ChildProcess\>](/zh/nodejs/api/child_process#class-childprocess)

当创建一个新的进程时触发。

#### Worker Thread {#worker-thread}

**新增于: v16.18.0**

`worker_threads`

- `worker` [`Worker`](/zh/nodejs/api/worker_threads#class-worker)

当创建一个新的线程时触发。

