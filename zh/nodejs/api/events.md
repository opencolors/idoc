---
title: Node.js 文档 - 事件
description: 了解 Node.js 中的事件模块，该模块通过事件驱动编程来处理异步操作。学习事件发射器、监听器以及如何有效管理事件。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 - 事件 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解 Node.js 中的事件模块，该模块通过事件驱动编程来处理异步操作。学习事件发射器、监听器以及如何有效管理事件。
  - - meta
    - name: twitter:title
      content: Node.js 文档 - 事件 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解 Node.js 中的事件模块，该模块通过事件驱动编程来处理异步操作。学习事件发射器、监听器以及如何有效管理事件。
---


# 事件 {#events}

::: tip [Stable: 2 - 稳定]
[Stable: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源代码:** [lib/events.js](https://github.com/nodejs/node/blob/v23.5.0/lib/events.js)

Node.js 核心 API 的很大一部分是围绕着一种惯用的异步事件驱动架构构建的，在这种架构中，某些类型的对象（称为“发射器”）会发出命名事件，这些事件会导致 `Function` 对象（“监听器”）被调用。

例如：每当有对等方连接到 [`net.Server`](/zh/nodejs/api/net#class-netserver) 对象时，该对象都会发出一个事件；当文件被打开时，[`fs.ReadStream`](/zh/nodejs/api/fs#class-fsreadstream) 会发出一个事件；当有数据可供读取时，[stream](/zh/nodejs/api/stream) 会发出一个事件。

所有发出事件的对象都是 `EventEmitter` 类的实例。 这些对象公开了一个 `eventEmitter.on()` 函数，该函数允许将一个或多个函数附加到对象发出的命名事件。 通常，事件名称是驼峰式字符串，但可以使用任何有效的 JavaScript 属性键。

当 `EventEmitter` 对象发出事件时，所有附加到该特定事件的函数都会被*同步*调用。 被调用的监听器返回的任何值都将被*忽略*和丢弃。

以下示例显示了一个带有单个监听器的简单 `EventEmitter` 实例。 `eventEmitter.on()` 方法用于注册监听器，而 `eventEmitter.emit()` 方法用于触发事件。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
myEmitter.emit('event');
```

```js [CJS]
const EventEmitter = require('node:events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
myEmitter.emit('event');
```
:::

## 将参数和 `this` 传递给监听器 {#passing-arguments-and-this-to-listeners}

`eventEmitter.emit()` 方法允许将任意一组参数传递给监听器函数。 请记住，当调用普通监听器函数时，标准 `this` 关键字会被有意设置为引用监听器附加到的 `EventEmitter` 实例。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // Prints:
  //   a b MyEmitter {
  //     _events: [Object: null prototype] { event: [Function (anonymous)] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined,
  //     [Symbol(shapeMode)]: false,
  //     [Symbol(kCapture)]: false
  //   } true
});
myEmitter.emit('event', 'a', 'b');
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // Prints:
  //   a b MyEmitter {
  //     _events: [Object: null prototype] { event: [Function (anonymous)] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined,
  //     [Symbol(shapeMode)]: false,
  //     [Symbol(kCapture)]: false
  //   } true
});
myEmitter.emit('event', 'a', 'b');
```
:::

可以使用 ES6 箭头函数作为监听器，但是，这样做时，`this` 关键字将不再引用 `EventEmitter` 实例：

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // Prints: a b undefined
});
myEmitter.emit('event', 'a', 'b');
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // Prints: a b {}
});
myEmitter.emit('event', 'a', 'b');
```
:::


## 异步 vs. 同步 {#asynchronous-vs-synchronous}

`EventEmitter` 以注册的顺序同步地调用所有监听器。这确保了事件的正确排序，并有助于避免竞争条件和逻辑错误。在适当的情况下，监听器函数可以使用 `setImmediate()` 或 `process.nextTick()` 方法切换到异步操作模式：

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('this happens asynchronously');
  });
});
myEmitter.emit('event', 'a', 'b');
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('this happens asynchronously');
  });
});
myEmitter.emit('event', 'a', 'b');
```
:::

## 仅处理一次事件 {#handling-events-only-once}

当使用 `eventEmitter.on()` 方法注册监听器时，每次发出命名的事件时，都会调用该监听器。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Prints: 2
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Prints: 2
```
:::

使用 `eventEmitter.once()` 方法，可以注册一个监听器，该监听器对于特定事件最多被调用一次。一旦发出该事件，监听器将被注销，*然后*被调用。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Ignored
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Ignored
```
:::


## 错误事件 {#error-events}

当 `EventEmitter` 实例中发生错误时，典型的操作是触发一个 `'error'` 事件。 这些事件在 Node.js 中被视为特殊情况。

如果 `EventEmitter` *没有* 至少一个为 `'error'` 事件注册的监听器，并且触发了 `'error'` 事件，则会抛出错误，打印堆栈跟踪，并且 Node.js 进程退出。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// 抛出异常并导致 Node.js 崩溃
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// 抛出异常并导致 Node.js 崩溃
```
:::

为了防止 Node.js 进程崩溃，可以使用 [`domain`](/zh/nodejs/api/domain) 模块。（但请注意，`node:domain` 模块已弃用。）

作为最佳实践，应该始终为 `'error'` 事件添加监听器。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// 打印: whoops! there was an error
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// 打印: whoops! there was an error
```
:::

可以通过使用符号 `events.errorMonitor` 安装监听器来监控 `'error'` 事件，而无需消耗发出的错误。

::: code-group
```js [ESM]
import { EventEmitter, errorMonitor } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// 仍然抛出异常并导致 Node.js 崩溃
```

```js [CJS]
const { EventEmitter, errorMonitor } = require('node:events');

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// 仍然抛出异常并导致 Node.js 崩溃
```
:::


## 捕获 Promise 的拒绝 {#capture-rejections-of-promises}

将 `async` 函数与事件处理程序一起使用是有问题的，因为它可能导致在抛出异常时出现未处理的拒绝：

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();
ee.on('something', async (value) => {
  throw new Error('kaboom');
});
```

```js [CJS]
const EventEmitter = require('node:events');
const ee = new EventEmitter();
ee.on('something', async (value) => {
  throw new Error('kaboom');
});
```
:::

`EventEmitter` 构造函数中的 `captureRejections` 选项或全局设置会更改此行为，在 `Promise` 上安装一个 `.then(undefined, handler)` 处理程序。 此处理程序将异常异步路由到 [`Symbol.for('nodejs.rejection')`](/zh/nodejs/api/events#emittersymbolfornodejsrejectionerr-eventname-args) 方法（如果存在），或者路由到 [`'error'`](/zh/nodejs/api/events#error-events) 事件处理程序（如果不存在）。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const ee1 = new EventEmitter({ captureRejections: true });
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);

const ee2 = new EventEmitter({ captureRejections: true });
ee2.on('something', async (value) => {
  throw new Error('kaboom');
});

ee2[Symbol.for('nodejs.rejection')] = console.log;
```

```js [CJS]
const EventEmitter = require('node:events');
const ee1 = new EventEmitter({ captureRejections: true });
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);

const ee2 = new EventEmitter({ captureRejections: true });
ee2.on('something', async (value) => {
  throw new Error('kaboom');
});

ee2[Symbol.for('nodejs.rejection')] = console.log;
```
:::

设置 `events.captureRejections = true` 将更改所有新的 `EventEmitter` 实例的默认值。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

EventEmitter.captureRejections = true;
const ee1 = new EventEmitter();
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);
```

```js [CJS]
const events = require('node:events');
events.captureRejections = true;
const ee1 = new events.EventEmitter();
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);
```
:::

由 `captureRejections` 行为生成的 `'error'` 事件没有 catch 处理程序以避免无限错误循环：建议**不要使用 <code>async</code> 函数作为 <code>'error'</code> 事件处理程序**。


## 类: `EventEmitter` {#class-eventemitter}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.4.0, v12.16.0 | 添加了 captureRejections 选项。 |
| v0.1.26 | 添加于: v0.1.26 |
:::

`EventEmitter` 类由 `node:events` 模块定义和公开：

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
```

```js [CJS]
const EventEmitter = require('node:events');
```
:::

当添加新的监听器时，所有的 `EventEmitter` 都会触发 `'newListener'` 事件；当移除已存在的监听器时，则触发 `'removeListener'` 事件。

它支持以下选项：

- `captureRejections` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 启用[自动捕获 Promise 拒绝](/zh/nodejs/api/events#capture-rejections-of-promises)。 **默认:** `false`。

### 事件: `'newListener'` {#event-newlistener}

**添加于: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 正在监听的事件的名称
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 事件处理函数

在监听器被添加到其内部监听器数组 *之前*，`EventEmitter` 实例将触发其自身的 `'newListener'` 事件。

为 `'newListener'` 事件注册的监听器会被传递事件名称和对正在添加的监听器的引用。

事件在添加监听器之前触发这一事实有一个微妙但重要的副作用：任何在 `'newListener'` 回调函数 *内部* 注册到相同 `name` 的*附加*监听器都会被插入到正在被添加的监听器 *之前*。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// 只执行一次，这样我们不会永远循环
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // 在前面插入一个新的监听器
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// 打印:
//   B
//   A
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// 只执行一次，这样我们不会永远循环
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // 在前面插入一个新的监听器
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// 打印:
//   B
//   A
```
:::


### 事件: `'removeListener'` {#event-removelistener}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v6.1.0, v4.7.0 | 对于使用 `.once()` 附加的监听器，`listener` 参数现在产生原始的监听器函数。 |
| v0.9.3 | 添加于: v0.9.3 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 事件名称
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 事件处理函数

`'removeListener'` 事件在 `listener` 被移除 *之后* 触发。

### `emitter.addListener(eventName, listener)` {#emitteraddlistenereventname-listener}

**添加于: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

`emitter.on(eventName, listener)` 的别名。

### `emitter.emit(eventName[, ...args])` {#emitteremiteventname-args}

**添加于: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

同步地按注册顺序调用每个注册的 `eventName` 事件的监听器，并将提供的参数传递给每个监听器。

如果事件有监听器，则返回 `true`，否则返回 `false`。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEmitter = new EventEmitter();

// 第一个监听器
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// 第二个监听器
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// 第三个监听器
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// 打印:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```

```js [CJS]
const EventEmitter = require('node:events');
const myEmitter = new EventEmitter();

// 第一个监听器
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// 第二个监听器
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// 第三个监听器
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// 打印:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```
:::


### `emitter.eventNames()` {#emittereventnames}

**新增于: v6.0.0**

- 返回: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

返回一个数组，其中列出了事件触发器已注册监听器的事件。数组中的值是字符串或 `Symbol`。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// 打印: [ 'foo', 'bar', Symbol(symbol) ]
```

```js [CJS]
const EventEmitter = require('node:events');

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// 打印: [ 'foo', 'bar', Symbol(symbol) ]
```
:::

### `emitter.getMaxListeners()` {#emittergetmaxlisteners}

**新增于: v1.0.0**

- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

返回 `EventEmitter` 的当前最大监听器值，该值由 [`emitter.setMaxListeners(n)`](/zh/nodejs/api/events#emittersetmaxlistenersn) 设置，或者默认为 [`events.defaultMaxListeners`](/zh/nodejs/api/events#eventsdefaultmaxlisteners)。

### `emitter.listenerCount(eventName[, listener])` {#emitterlistenercounteventname-listener}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.8.0, v18.16.0 | 添加了 `listener` 参数。 |
| v3.2.0 | 新增于: v3.2.0 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 正在监听的事件的名称
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 事件处理函数
- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

返回正在监听名为 `eventName` 的事件的监听器的数量。 如果提供了 `listener`，它将返回在事件监听器列表中找到监听器的次数。


### `emitter.listeners(eventName)` {#emitterlistenerseventname}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v7.0.0 | 对于使用 `.once()` 附加的监听器，现在返回的是原始监听器，而不是包装函数。 |
| v0.1.26 | 添加于: v0.1.26 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- 返回: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

返回名为 `eventName` 的事件的监听器数组的副本。

```js [ESM]
server.on('connection', (stream) => {
  console.log('有人连接了！');
});
console.log(util.inspect(server.listeners('connection')));
// 打印: [ [Function] ]
```
### `emitter.off(eventName, listener)` {#emitteroffeventname-listener}

**添加于: v10.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter)

[`emitter.removeListener()`](/zh/nodejs/api/events#emitterremovelistenereventname-listener) 的别名。

### `emitter.on(eventName, listener)` {#emitteroneventname-listener}

**添加于: v0.1.101**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 事件的名称。
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 回调函数
- 返回: [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter)

将 `listener` 函数添加到名为 `eventName` 的事件的监听器数组的末尾。 不会检查是否已添加 `listener`。 多次调用传递相同的 `eventName` 和 `listener` 组合将导致 `listener` 被添加和调用多次。

```js [ESM]
server.on('connection', (stream) => {
  console.log('有人连接了！');
});
```
返回对 `EventEmitter` 的引用，以便可以链式调用。

默认情况下，事件监听器按照添加的顺序调用。 `emitter.prependListener()` 方法可以作为替代方法，将事件监听器添加到监听器数组的开头。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// 打印:
//   b
//   a
```

```js [CJS]
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// 打印:
//   b
//   a
```
:::


### `emitter.once(eventName, listener)` {#emitteronceeventname-listener}

**加入于: v0.3.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 事件的名称。
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 回调函数
- 返回: [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter)

为名为 `eventName` 的事件添加一个**一次性** `listener` 函数。 下一次触发 `eventName` 时，此监听器将被删除，然后被调用。

```js [ESM]
server.once('connection', (stream) => {
  console.log('啊，我们有第一个用户了!');
});
```
返回一个对 `EventEmitter` 的引用，以便可以链式调用。

默认情况下，事件监听器按照它们被添加的顺序调用。 `emitter.prependOnceListener()` 方法可以作为替代方法，将事件监听器添加到监听器数组的开头。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

```js [CJS]
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```
:::

### `emitter.prependListener(eventName, listener)` {#emitterprependlistenereventname-listener}

**加入于: v6.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 事件的名称。
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 回调函数
- 返回: [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter)

将 `listener` 函数添加到名为 `eventName` 的事件的监听器数组的*开头*。 不会检查 `listener` 是否已被添加。 多次调用传递相同的 `eventName` 和 `listener` 组合将导致 `listener` 被添加和调用多次。

```js [ESM]
server.prependListener('connection', (stream) => {
  console.log('有人连接了！');
});
```
返回一个对 `EventEmitter` 的引用，以便可以链式调用。


### `emitter.prependOnceListener(eventName, listener)` {#emitterprependoncelistenereventname-listener}

**新增于: v6.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 事件的名称。
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 回调函数
- 返回: [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter)

为名为 `eventName` 的事件添加**一次性** `listener` 函数到监听器数组的*开头*。 下一次触发 `eventName` 时，此监听器将被移除，然后被调用。

```js [ESM]
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

返回 `EventEmitter` 的引用，以便可以链式调用。

### `emitter.removeAllListeners([eventName])` {#emitterremovealllistenerseventname}

**新增于: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- 返回: [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter)

移除所有监听器，或指定 `eventName` 的监听器。

移除代码中其他地方添加的监听器是一种不好的做法，特别是当 `EventEmitter` 实例是由其他组件或模块创建时（例如套接字或文件流）。

返回 `EventEmitter` 的引用，以便可以链式调用。

### `emitter.removeListener(eventName, listener)` {#emitterremovelistenereventname-listener}

**新增于: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 返回: [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter)

从名为 `eventName` 的事件的监听器数组中移除指定的 `listener`。

```js [ESM]
const callback = (stream) => {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```
`removeListener()` 最多会从监听器数组中移除一个监听器实例。 如果任何单个监听器已多次添加到指定 `eventName` 的监听器数组中，则必须多次调用 `removeListener()` 才能移除每个实例。

一旦发出事件，所有在发出时附加到它的监听器都将按顺序调用。 这意味着在发出 *之后* 且在最后一个监听器完成执行 *之前* 的任何 `removeListener()` 或 `removeAllListeners()` 调用都不会将它们从正在进行的 `emit()` 中移除。 后续事件的行为符合预期。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA 移除监听器 callbackB，但它仍然会被调用。
// 发出时的内部监听器数组 [callbackA, callbackB]
myEmitter.emit('event');
// 打印:
//   A
//   B

// callbackB 现在已被移除。
// 内部监听器数组 [callbackA]
myEmitter.emit('event');
// 打印:
//   A
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA 移除监听器 callbackB，但它仍然会被调用。
// 发出时的内部监听器数组 [callbackA, callbackB]
myEmitter.emit('event');
// 打印:
//   A
//   B

// callbackB 现在已被移除。
// 内部监听器数组 [callbackA]
myEmitter.emit('event');
// 打印:
//   A
```
:::

由于监听器是使用内部数组管理的，因此调用此方法将更改在被移除的监听器 *之后* 注册的任何监听器的位置索引。 这不会影响调用监听器的顺序，但这意味着需要重新创建由 `emitter.listeners()` 方法返回的监听器数组的任何副本。

当一个函数已被多次添加为单个事件的处理程序时（如下面的示例所示），`removeListener()` 将移除最近添加的实例。 在该示例中，移除了 `once('ping')` 监听器：

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```

```js [CJS]
const EventEmitter = require('node:events');
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```
:::

返回 `EventEmitter` 的引用，以便可以链式调用。


### `emitter.setMaxListeners(n)` {#emittersetmaxlistenersn}

**加入版本: v0.3.5**

- `n` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 返回: [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter)

默认情况下，如果为特定事件添加了超过 `10` 个监听器，则 `EventEmitter` 会打印警告。 这是一个有用的默认设置，有助于发现内存泄漏。 `emitter.setMaxListeners()` 方法允许为此特定 `EventEmitter` 实例修改限制。 该值可以设置为 `Infinity` (或 `0`)，以指示不限制监听器的数量。

返回对 `EventEmitter` 的引用，以便可以链式调用。

### `emitter.rawListeners(eventName)` {#emitterrawlistenerseventname}

**加入版本: v9.4.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- 返回: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

返回名为 `eventName` 的事件的监听器数组的副本，包括任何包装器（例如 `.once()` 创建的包装器）。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// 返回一个新数组，其中包含一个函数 `onceWrapper`，它具有一个属性
// `listener`，其中包含上面绑定的原始监听器
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// 将 "log once" 记录到控制台，并且不取消绑定 `once` 事件
logFnWrapper.listener();

// 将 "log once" 记录到控制台并删除监听器
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// 将返回一个新数组，其中包含上面由 `.on()` 绑定的单个函数
const newListeners = emitter.rawListeners('log');

// 将 "log persistently" 记录两次
newListeners[0]();
emitter.emit('log');
```

```js [CJS]
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// 返回一个新数组，其中包含一个函数 `onceWrapper`，它具有一个属性
// `listener`，其中包含上面绑定的原始监听器
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// 将 "log once" 记录到控制台，并且不取消绑定 `once` 事件
logFnWrapper.listener();

// 将 "log once" 记录到控制台并删除监听器
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// 将返回一个新数组，其中包含上面由 `.on()` 绑定的单个函数
const newListeners = emitter.rawListeners('log');

// 将 "log persistently" 记录两次
newListeners[0]();
emitter.emit('log');
```
:::


### `emitter[Symbol.for('nodejs.rejection')](err, eventName[, ...args])` {#emittersymbolfornodejsrejectionerr-eventname-args}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v17.4.0, v16.14.0 | 不再是实验性的。 |
| v13.4.0, v12.16.0 | 添加于：v13.4.0, v12.16.0 |
:::

- `err` Error
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

如果在发出事件时发生 promise 拒绝，并且在 emitter 上启用了 [`captureRejections`](/zh/nodejs/api/events#capture-rejections-of-promises)，则会调用 `Symbol.for('nodejs.rejection')` 方法。 可以使用 [`events.captureRejectionSymbol`](/zh/nodejs/api/events#eventscapturerejectionsymbol) 代替 `Symbol.for('nodejs.rejection')`。

::: code-group
```js [ESM]
import { EventEmitter, captureRejectionSymbol } from 'node:events';

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('rejection happened for', event, 'with', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Tear the resource down here.
  }
}
```

```js [CJS]
const { EventEmitter, captureRejectionSymbol } = require('node:events');

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('rejection happened for', event, 'with', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Tear the resource down here.
  }
}
```
:::

## `events.defaultMaxListeners` {#eventsdefaultmaxlisteners}

**添加于: v0.11.2**

默认情况下，对于任何单个事件，最多可以注册 `10` 个监听器。 可以使用 [`emitter.setMaxListeners(n)`](/zh/nodejs/api/events#emittersetmaxlistenersn) 方法为单个 `EventEmitter` 实例更改此限制。 要更改*所有* `EventEmitter` 实例的默认值，可以使用 `events.defaultMaxListeners` 属性。 如果此值不是正数，则抛出 `RangeError`。

设置 `events.defaultMaxListeners` 时要小心，因为更改会影响*所有* `EventEmitter` 实例，包括在进行更改之前创建的实例。 但是，调用 [`emitter.setMaxListeners(n)`](/zh/nodejs/api/events#emittersetmaxlistenersn) 仍然优先于 `events.defaultMaxListeners`。

这不是一个硬性限制。 `EventEmitter` 实例将允许添加更多监听器，但会输出一个跟踪警告到 stderr，指示检测到“可能的 EventEmitter 内存泄漏”。 对于任何单个 `EventEmitter`，可以使用 `emitter.getMaxListeners()` 和 `emitter.setMaxListeners()` 方法来暂时避免此警告：

`defaultMaxListeners` 对 `AbortSignal` 实例没有影响。 虽然仍然可以使用 [`emitter.setMaxListeners(n)`](/zh/nodejs/api/events#emittersetmaxlistenersn) 为单个 `AbortSignal` 实例设置警告限制，但默认情况下 `AbortSignal` 实例不会发出警告。

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // do stuff
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```

```js [CJS]
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // do stuff
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```
:::

可以使用 [`--trace-warnings`](/zh/nodejs/api/cli#--trace-warnings) 命令行标志来显示此类警告的堆栈跟踪。

可以使用 [`process.on('warning')`](/zh/nodejs/api/process#event-warning) 检查发出的警告，并且它将具有额外的 `emitter`、`type` 和 `count` 属性，分别引用事件 emitter 实例、事件的名称和附加的监听器的数量。 它的 `name` 属性设置为 `'MaxListenersExceededWarning'`。


## `events.errorMonitor` {#eventserrormonitor}

**加入于: v13.6.0, v12.17.0**

该符号应用于安装仅用于监听 `'error'` 事件的监听器。 使用此符号安装的监听器会在调用常规 `'error'` 监听器之前被调用。

使用此符号安装监听器不会改变发出 `'error'` 事件后的行为。 因此，如果没有安装常规 `'error'` 监听器，进程仍然会崩溃。

## `events.getEventListeners(emitterOrTarget, eventName)` {#eventsgeteventlistenersemitterortarget-eventname}

**加入于: v15.2.0, v14.17.0**

- `emitterOrTarget` [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter) | [\<EventTarget\>](/zh/nodejs/api/events#class-eventtarget)
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- 返回: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

返回名为 `eventName` 的事件的监听器数组的副本。

对于 `EventEmitter`，此行为与在发射器上调用 `.listeners` 完全相同。

对于 `EventTarget`，这是获取事件目标的事件监听器的唯一方法。 这对于调试和诊断目的很有用。

::: code-group
```js [ESM]
import { getEventListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
```

```js [CJS]
const { getEventListeners, EventEmitter } = require('node:events');

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
```
:::


## `events.getMaxListeners(emitterOrTarget)` {#eventsgetmaxlistenersemitterortarget}

**新增于: v19.9.0, v18.17.0**

- `emitterOrTarget` [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter) | [\<EventTarget\>](/zh/nodejs/api/events#class-eventtarget)
- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

返回当前设置的最大监听器数量。

对于 `EventEmitter`，此行为与在 emitter 上调用 `.getMaxListeners` 完全相同。

对于 `EventTarget`，这是获取事件目标的最大事件监听器的唯一方法。 如果单个 EventTarget 上的事件处理程序的数量超过了设置的最大值，则 EventTarget 将打印警告。

::: code-group
```js [ESM]
import { getMaxListeners, setMaxListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
```

```js [CJS]
const { getMaxListeners, setMaxListeners, EventEmitter } = require('node:events');

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
```
:::

## `events.once(emitter, name[, options])` {#eventsonceemitter-name-options}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | 现在支持 `signal` 选项。 |
| v11.13.0, v10.16.0 | 添加于: v11.13.0, v10.16.0 |
:::

- `emitter` [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter)
- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 可用于取消等待事件。
  
 
- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

创建一个 `Promise`，当 `EventEmitter` 发出给定的事件时，该 `Promise` 会被实现，或者如果在等待时 `EventEmitter` 发出 `'error'`，则该 `Promise` 会被拒绝。 该 `Promise` 将使用发出到给定事件的所有参数的数组来解析。

此方法是有意通用的，并且适用于 Web 平台 [EventTarget](https://dom.spec.whatwg.org/#interface-eventtarget) 接口，该接口没有特殊的 `'error'` 事件语义，并且不监听 `'error'` 事件。

::: code-group
```js [ESM]
import { once, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

process.nextTick(() => {
  ee.emit('myevent', 42);
});

const [value] = await once(ee, 'myevent');
console.log(value);

const err = new Error('kaboom');
process.nextTick(() => {
  ee.emit('error', err);
});

try {
  await once(ee, 'myevent');
} catch (err) {
  console.error('error happened', err);
}
```

```js [CJS]
const { once, EventEmitter } = require('node:events');

async function run() {
  const ee = new EventEmitter();

  process.nextTick(() => {
    ee.emit('myevent', 42);
  });

  const [value] = await once(ee, 'myevent');
  console.log(value);

  const err = new Error('kaboom');
  process.nextTick(() => {
    ee.emit('error', err);
  });

  try {
    await once(ee, 'myevent');
  } catch (err) {
    console.error('error happened', err);
  }
}

run();
```
:::

只有当 `events.once()` 用于等待另一个事件时，才会使用 `'error'` 事件的特殊处理。 如果 `events.once()` 用于等待 '`error'` 事件本身，那么它将被视为任何其他类型的事件，而没有特殊处理：

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```
:::

[\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 可用于取消等待事件：

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Prints: Waiting for the event was canceled!
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Prints: Waiting for the event was canceled!
```
:::


### 等待在 `process.nextTick()` 上触发的多个事件 {#awaiting-multiple-events-emitted-on-processnexttick}

当使用 `events.once()` 函数等待在同一批 `process.nextTick()` 操作中触发的多个事件时，或者每当同步触发多个事件时，需要注意一个边缘情况。具体来说，由于 `process.nextTick()` 队列在 `Promise` 微任务队列之前被清空，并且由于 `EventEmitter` 同步地触发所有事件，因此 `events.once()` 可能会错过一个事件。

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';
import process from 'node:process';

const myEE = new EventEmitter();

async function foo() {
  await once(myEE, 'bar');
  console.log('bar');

  // 这个 Promise 永远不会 resolve，因为 'foo' 事件在 Promise 创建之前就已经触发了。
  await once(myEE, 'foo');
  console.log('foo');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const myEE = new EventEmitter();

async function foo() {
  await once(myEE, 'bar');
  console.log('bar');

  // 这个 Promise 永远不会 resolve，因为 'foo' 事件在 Promise 创建之前就已经触发了。
  await once(myEE, 'foo');
  console.log('foo');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```
:::

要捕获这两个事件，请在等待任何一个事件 *之前* 创建每个 Promise，然后就可以使用 `Promise.all()`、`Promise.race()` 或 `Promise.allSettled()`：

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';
import process from 'node:process';

const myEE = new EventEmitter();

async function foo() {
  await Promise.all([once(myEE, 'bar'), once(myEE, 'foo')]);
  console.log('foo', 'bar');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const myEE = new EventEmitter();

async function foo() {
  await Promise.all([once(myEE, 'bar'), once(myEE, 'foo')]);
  console.log('foo', 'bar');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```
:::


## `events.captureRejections` {#eventscapturerejections}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v17.4.0, v16.14.0 | 不再是实验性的。 |
| v13.4.0, v12.16.0 | 添加于: v13.4.0, v12.16.0 |
:::

值: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

更改所有新 `EventEmitter` 对象上的默认 `captureRejections` 选项。

## `events.captureRejectionSymbol` {#eventscapturerejectionsymbol}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v17.4.0, v16.14.0 | 不再是实验性的。 |
| v13.4.0, v12.16.0 | 添加于: v13.4.0, v12.16.0 |
:::

值: `Symbol.for('nodejs.rejection')`

参见如何编写自定义的 [rejection handler](/zh/nodejs/api/events#emittersymbolfornodejsrejectionerr-eventname-args)。

## `events.listenerCount(emitter, eventName)` {#eventslistenercountemitter-eventname}

**添加于: v0.9.12**

**自: v3.2.0 起已弃用**

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用: 请使用 [`emitter.listenerCount()`](/zh/nodejs/api/events#emitterlistenercounteventname-listener) 代替。
:::

- `emitter` [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter) 要查询的 emitter
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 事件名

一个类方法，返回在给定的 `emitter` 上注册的给定 `eventName` 的监听器的数量。

::: code-group
```js [ESM]
import { EventEmitter, listenerCount } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// 打印: 2
```

```js [CJS]
const { EventEmitter, listenerCount } = require('node:events');

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// 打印: 2
```
:::


## `events.on(emitter, eventName[, options])` {#eventsonemitter-eventname-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.0.0, v20.13.0 | 支持 `highWaterMark` 和 `lowWaterMark` 选项，为了保持一致性。旧选项仍然受支持。 |
| v20.0.0 | 现在支持 `close`、`highWatermark` 和 `lowWatermark` 选项。 |
| v13.6.0, v12.16.0 | 添加于: v13.6.0, v12.16.0 |
:::

- `emitter` [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter)
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 正在监听的事件的名称
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 可用于取消等待事件。
    - `close` - [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 将结束迭代的事件的名称。
    - `highWaterMark` - [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `Number.MAX_SAFE_INTEGER` 高水位线。 每次缓冲事件的大小高于它时，发射器都会暂停。 仅在实现 `pause()` 和 `resume()` 方法的发射器上受支持。
    - `lowWaterMark` - [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **默认值:** `1` 低水位线。 每次缓冲事件的大小低于它时，发射器都会恢复。 仅在实现 `pause()` 和 `resume()` 方法的发射器上受支持。


- 返回: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) 迭代 `emitter` 发出的 `eventName` 事件的异步迭代器。

::: code-group
```js [ESM]
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

// 稍后发出
process.nextTick(() => {
  ee.emit('foo', 'bar');
  ee.emit('foo', 42);
});

for await (const event of on(ee, 'foo')) {
  // 此内部块的执行是同步的，并且一次处理一个事件（即使使用 await）。
  // 如果需要并发执行，请勿使用。
  console.log(event); // 输出 ['bar'] [42]
}
// 此处无法访问
```

```js [CJS]
const { on, EventEmitter } = require('node:events');

(async () => {
  const ee = new EventEmitter();

  // 稍后发出
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo')) {
    // 此内部块的执行是同步的，并且一次处理一个事件（即使使用 await）。
    // 如果需要并发执行，请勿使用。
    console.log(event); // 输出 ['bar'] [42]
  }
  // 此处无法访问
})();
```
:::

返回一个迭代 `eventName` 事件的 `AsyncIterator`。 如果 `EventEmitter` 发出 `'error'`，它将抛出错误。 退出循环时，它会删除所有监听器。 每次迭代返回的 `value` 是一个由发出的事件参数组成的数组。

[\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 可用于取消等待事件：

::: code-group
```js [ESM]
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // 稍后发出
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // 此内部块的执行是同步的，并且一次处理一个事件（即使使用 await）。
    // 如果需要并发执行，请勿使用。
    console.log(event); // 输出 ['bar'] [42]
  }
  // 此处无法访问
})();

process.nextTick(() => ac.abort());
```

```js [CJS]
const { on, EventEmitter } = require('node:events');

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // 稍后发出
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // 此内部块的执行是同步的，并且一次处理一个事件（即使使用 await）。
    // 如果需要并发执行，请勿使用。
    console.log(event); // 输出 ['bar'] [42]
  }
  // 此处无法访问
})();

process.nextTick(() => ac.abort());
```
:::

## `events.setMaxListeners(n[, ...eventTargets])` {#eventssetmaxlistenersn-eventtargets}

**添加于: v15.4.0**

- `n` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 一个非负数。 每个 `EventTarget` 事件的最大监听器数量。
- `...eventsTargets` [\<EventTarget[]\>](/zh/nodejs/api/events#class-eventtarget) | [\<EventEmitter[]\>](/zh/nodejs/api/events#class-eventemitter) 零个或多个 [\<EventTarget\>](/zh/nodejs/api/events#class-eventtarget) 或 [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter) 实例。 如果未指定，则将 `n` 设置为所有新创建的 [\<EventTarget\>](/zh/nodejs/api/events#class-eventtarget) 和 [\<EventEmitter\>](/zh/nodejs/api/events#class-eventemitter) 对象的默认最大值。

::: code-group
```js [ESM]
import { setMaxListeners, EventEmitter } from 'node:events';

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```

```js [CJS]
const {
  setMaxListeners,
  EventEmitter,
} = require('node:events');

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```
:::

## `events.addAbortListener(signal, listener)` {#eventsaddabortlistenersignal-listener}

**添加于: v20.5.0, v18.18.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/zh/nodejs/api/events#event-listener)
- 返回: [\<Disposable\>](https://tc39.es/proposal-explicit-resource-management/#sec-disposable-interface) 一个移除 `abort` 监听器的 Disposable 对象。

监听提供的 `signal` 上的 `abort` 事件一次。

监听中止信号上的 `abort` 事件是不安全的，并且可能导致资源泄漏，因为拥有该信号的另一方可以调用 [`e.stopImmediatePropagation()`](/zh/nodejs/api/events#eventstopimmediatepropagation)。 不幸的是，Node.js 无法更改此行为，因为它会违反 Web 标准。 此外，原始 API 很容易忘记移除监听器。

此 API 通过监听事件的方式解决了这两个问题，即 `stopImmediatePropagation` 不会阻止监听器运行，从而允许在 Node.js API 中安全地使用 `AbortSignal`。

返回一个 disposable 对象，以便更容易地取消订阅。

::: code-group
```js [CJS]
const { addAbortListener } = require('node:events');

function example(signal) {
  let disposable;
  try {
    signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
    disposable = addAbortListener(signal, (e) => {
      // Do something when signal is aborted.
    });
  } finally {
    disposable?.[Symbol.dispose]();
  }
}
```

```js [ESM]
import { addAbortListener } from 'node:events';

function example(signal) {
  let disposable;
  try {
    signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
    disposable = addAbortListener(signal, (e) => {
      // Do something when signal is aborted.
    });
  } finally {
    disposable?.[Symbol.dispose]();
  }
}
```
:::


## 类: `events.EventEmitterAsyncResource extends EventEmitter` {#class-eventseventemitterasyncresource-extends-eventemitter}

**已加入: v17.4.0, v16.14.0**

将 `EventEmitter` 与 [\<AsyncResource\>](/zh/nodejs/api/async_hooks#class-asyncresource) 集成，用于需要手动异步跟踪的 `EventEmitter`。 具体来说，`events.EventEmitterAsyncResource` 实例发出的所有事件将在其 [异步上下文](/zh/nodejs/api/async_context) 中运行。

::: code-group
```js [ESM]
import { EventEmitterAsyncResource, EventEmitter } from 'node:events';
import { notStrictEqual, strictEqual } from 'node:assert';
import { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

// 异步跟踪工具将将其标识为“Q”。
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// “foo”监听器将在 EventEmitters 异步上下文中运行。
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// 但是，普通的 EventEmitter 上未跟踪异步上下文的“foo”监听器，与 emit() 运行在相同的异步上下文中。
ee2.on('foo', () => {
  notStrictEqual(executionAsyncId(), ee2.asyncId);
  notStrictEqual(triggerAsyncId(), ee2.triggerAsyncId);
});

Promise.resolve().then(() => {
  ee1.emit('foo');
  ee2.emit('foo');
});
```

```js [CJS]
const { EventEmitterAsyncResource, EventEmitter } = require('node:events');
const { notStrictEqual, strictEqual } = require('node:assert');
const { executionAsyncId, triggerAsyncId } = require('node:async_hooks');

// 异步跟踪工具将将其标识为“Q”。
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// “foo”监听器将在 EventEmitters 异步上下文中运行。
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// 但是，普通的 EventEmitter 上未跟踪异步上下文的“foo”监听器，与 emit() 运行在相同的异步上下文中。
ee2.on('foo', () => {
  notStrictEqual(executionAsyncId(), ee2.asyncId);
  notStrictEqual(triggerAsyncId(), ee2.triggerAsyncId);
});

Promise.resolve().then(() => {
  ee1.emit('foo');
  ee2.emit('foo');
});
```
:::

`EventEmitterAsyncResource` 类具有与 `EventEmitter` 和 `AsyncResource` 自身相同的方法并采用相同的选项。


### `new events.EventEmitterAsyncResource([options])` {#new-eventseventemitterasyncresourceoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `captureRejections` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 它启用了[自动捕获 Promise 拒绝](/zh/nodejs/api/events#capture-rejections-of-promises)。**默认值:** `false`。
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 异步事件的类型。**默认值:** [`new.target.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target)。
    - `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 创建此异步事件的执行上下文的 ID。**默认值:** `executionAsyncId()`。
    - `requireManualDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果设置为 `true`，则在对象被垃圾回收时禁用 `emitDestroy`。 通常不需要设置此选项（即使手动调用 `emitDestroy`），除非检索了资源的 `asyncId` 并且使用了敏感 API 的 `emitDestroy` 调用它。 当设置为 `false` 时，只有在至少有一个活动的 `destroy` 钩子时，才会进行垃圾回收时的 `emitDestroy` 调用。**默认值:** `false`。
  
 

### `eventemitterasyncresource.asyncId` {#eventemitterasyncresourceasyncid}

- 类型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 分配给资源的唯一 `asyncId`。

### `eventemitterasyncresource.asyncResource` {#eventemitterasyncresourceasyncresource}

- 类型: 底层的 [\<AsyncResource\>](/zh/nodejs/api/async_hooks#class-asyncresource)。

返回的 `AsyncResource` 对象具有一个额外的 `eventEmitter` 属性，该属性提供对该 `EventEmitterAsyncResource` 的引用。

### `eventemitterasyncresource.emitDestroy()` {#eventemitterasyncresourceemitdestroy}

调用所有 `destroy` 钩子。 这应该只调用一次。 如果多次调用，将会抛出一个错误。 这**必须**手动调用。 如果资源被垃圾回收器收集，那么 `destroy` 钩子将永远不会被调用。


### `eventemitterasyncresource.triggerAsyncId` {#eventemitterasyncresourcetriggerasyncid}

- 类型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 与传递给 `AsyncResource` 构造函数的 `triggerAsyncId` 相同。

## `EventTarget` 和 `Event` API {#eventtarget-and-event-api}

::: info [历史记录]
| 版本 | 更改 |
| --- | --- |
| v16.0.0 | 更改了 EventTarget 错误处理。 |
| v15.4.0 | 不再是实验性的。 |
| v15.0.0 | `EventTarget` 和 `Event` 类现在作为全局变量可用。 |
| v14.5.0 | 添加于: v14.5.0 |
:::

`EventTarget` 和 `Event` 对象是 Node.js 特定的 [`EventTarget` Web API](https://dom.spec.whatwg.org/#eventtarget) 实现，由一些 Node.js 核心 API 公开。

```js [ESM]
const target = new EventTarget();

target.addEventListener('foo', (event) => {
  console.log('foo event happened!');
});
```
### Node.js `EventTarget` 与 DOM `EventTarget` {#nodejs-eventtarget-vs-dom-eventtarget}

Node.js `EventTarget` 与 [`EventTarget` Web API](https://dom.spec.whatwg.org/#eventtarget) 之间有两个主要区别：

### `NodeEventTarget` 与 `EventEmitter` {#nodeeventtarget-vs-eventemitter}

`NodeEventTarget` 对象实现 `EventEmitter` API 的一个修改过的子集，这使其能够在某些情况下密切地*模拟* `EventEmitter`。 `NodeEventTarget` *不是* `EventEmitter` 的实例，在大多数情况下不能代替 `EventEmitter` 使用。

### 事件监听器 {#event-listener}

为事件 `type` 注册的事件监听器可以是 JavaScript 函数，也可以是具有 `handleEvent` 属性的对象，该属性的值是一个函数。

在这两种情况下，都会使用传递给 `eventTarget.dispatchEvent()` 函数的 `event` 参数调用处理程序函数。

异步函数可以用作事件监听器。 如果异步处理函数拒绝，则拒绝将被捕获并按照 [`EventTarget` 错误处理](/zh/nodejs/api/events#eventtarget-error-handling) 中所述的方式进行处理。

一个处理程序函数抛出的错误不会阻止调用其他处理程序。

处理程序函数的返回值将被忽略。

处理程序始终按照添加的顺序调用。

处理程序函数可以改变 `event` 对象。

```js [ESM]
function handler1(event) {
  console.log(event.type);  // 打印 'foo'
  event.a = 1;
}

async function handler2(event) {
  console.log(event.type);  // 打印 'foo'
  console.log(event.a);  // 打印 1
}

const handler3 = {
  handleEvent(event) {
    console.log(event.type);  // 打印 'foo'
  },
};

const handler4 = {
  async handleEvent(event) {
    console.log(event.type);  // 打印 'foo'
  },
};

const target = new EventTarget();

target.addEventListener('foo', handler1);
target.addEventListener('foo', handler2);
target.addEventListener('foo', handler3);
target.addEventListener('foo', handler4, { once: true });
```

### `EventTarget` 错误处理 {#eventtarget-error-handling}

当注册的事件监听器抛出错误（或返回一个 rejected 的 Promise）时，默认情况下，该错误会被视为 `process.nextTick()` 上的未捕获异常。这意味着 `EventTarget` 中的未捕获异常默认会终止 Node.js 进程。

在事件监听器中抛出错误 *不会* 阻止其他已注册的处理程序被调用。

`EventTarget` 没有像 `EventEmitter` 那样为 `'error'` 类型事件实现任何特殊的默认处理。

目前，错误首先转发到 `process.on('error')` 事件，然后再到达 `process.on('uncaughtException')`。此行为已被弃用，并将在未来版本中更改，以使 `EventTarget` 与其他 Node.js API 对齐。任何依赖 `process.on('error')` 事件的代码都应与新行为保持一致。

### 类: `Event` {#class-event}

::: info [历史记录]
| 版本     | 变更                                    |
| -------- | ---------------------------------------- |
| v15.0.0  | `Event` 类现在可以通过全局对象访问。      |
| v14.5.0  | 添加于: v14.5.0                          |
:::

`Event` 对象是 [`Event` Web API](https://dom.spec.whatwg.org/#event) 的改编。实例由 Node.js 内部创建。

#### `event.bubbles` {#eventbubbles}

**添加于: v14.5.0**

- 类型: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 始终返回 `false`。

这在 Node.js 中未使用，仅为了完整性而提供。

#### `event.cancelBubble` {#eventcancelbubble}

**添加于: v14.5.0**

::: info [稳定度: 3 - 遗留]
[稳定度: 3](/zh/nodejs/api/documentation#stability-index) [稳定性: 3](/zh/nodejs/api/documentation#stability-index) - 遗留: 请改用 [`event.stopPropagation()`](/zh/nodejs/api/events#eventstoppropagation)。
:::

- 类型: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果设置为 `true`，则为 `event.stopPropagation()` 的别名。这在 Node.js 中未使用，仅为了完整性而提供。

#### `event.cancelable` {#eventcancelable}

**添加于: v14.5.0**

- 类型: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果事件是使用 `cancelable` 选项创建的，则为 True。


#### `event.composed` {#eventcomposed}

**新增于: v14.5.0**

- 类型: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 始终返回 `false`。

这在 Node.js 中未使用，仅为完整性而提供。

#### `event.composedPath()` {#eventcomposedpath}

**新增于: v14.5.0**

返回一个数组，其中包含当前 `EventTarget` 作为唯一条目，如果事件未被分派，则返回空数组。这在 Node.js 中未使用，仅为完整性而提供。

#### `event.currentTarget` {#eventcurrenttarget}

**新增于: v14.5.0**

- 类型: [\<EventTarget\>](/zh/nodejs/api/events#class-eventtarget) 分派事件的 `EventTarget`。

`event.target` 的别名。

#### `event.defaultPrevented` {#eventdefaultprevented}

**新增于: v14.5.0**

- 类型: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 `cancelable` 为 `true` 且 `event.preventDefault()` 已被调用，则为 `true`。

#### `event.eventPhase` {#eventeventphase}

**新增于: v14.5.0**

- 类型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 事件未被分派时返回 `0`，正在被分派时返回 `2`。

这在 Node.js 中未使用，仅为完整性而提供。

#### `event.initEvent(type[, bubbles[, cancelable]])` {#eventiniteventtype-bubbles-cancelable}

**新增于: v19.5.0**

::: info [稳定度: 3 - 遗留]
[稳定度: 3](/zh/nodejs/api/documentation#stability-index) [稳定性: 3](/zh/nodejs/api/documentation#stability-index) - 遗留: WHATWG 规范认为它已弃用，用户不应再使用它。
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `bubbles` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `cancelable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

与事件构造函数冗余，并且无法设置 `composed`。这在 Node.js 中未使用，仅为完整性而提供。

#### `event.isTrusted` {#eventistrusted}

**新增于: v14.5.0**

- 类型: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) `"abort"` 事件在 `isTrusted` 设置为 `true` 时发出。在所有其他情况下，该值为 `false`。


#### `event.preventDefault()` {#eventpreventdefault}

**Added in: v14.5.0**

如果 `cancelable` 为 `true`，则将 `defaultPrevented` 属性设置为 `true`。

#### `event.returnValue` {#eventreturnvalue}

**Added in: v14.5.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/zh/nodejs/api/documentation#stability-index) [Stability: 3](/zh/nodejs/api/documentation#stability-index) - Legacy：请改用 [`event.defaultPrevented`](/zh/nodejs/api/events#eventdefaultprevented)。
:::

- 类型: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果事件未被取消，则为 True。

`event.returnValue` 的值始终与 `event.defaultPrevented` 相反。 这在 Node.js 中不使用，仅为完整性而提供。

#### `event.srcElement` {#eventsrcelement}

**Added in: v14.5.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/zh/nodejs/api/documentation#stability-index) [Stability: 3](/zh/nodejs/api/documentation#stability-index) - Legacy：请改用 [`event.target`](/zh/nodejs/api/events#eventtarget)。
:::

- 类型: [\<EventTarget\>](/zh/nodejs/api/events#class-eventtarget) 分发事件的 `EventTarget`。

`event.target` 的别名。

#### `event.stopImmediatePropagation()` {#eventstopimmediatepropagation}

**Added in: v14.5.0**

在当前事件监听器完成后，停止调用其他事件监听器。

#### `event.stopPropagation()` {#eventstoppropagation}

**Added in: v14.5.0**

这在 Node.js 中不使用，仅为完整性而提供。

#### `event.target` {#eventtarget}

**Added in: v14.5.0**

- 类型: [\<EventTarget\>](/zh/nodejs/api/events#class-eventtarget) 分发事件的 `EventTarget`。

#### `event.timeStamp` {#eventtimestamp}

**Added in: v14.5.0**

- 类型: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

创建 `Event` 对象时的毫秒时间戳。

#### `event.type` {#eventtype}

**Added in: v14.5.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

事件类型标识符。

### 类: `EventTarget` {#class-eventtarget}


::: info [History]
| Version | Changes |
| --- | --- |
| v15.0.0 | The `EventTarget` class is now available through the global object. |
| v14.5.0 | Added in: v14.5.0 |
:::


#### `eventTarget.addEventListener(type, listener[, options])` {#eventtargetaddeventlistenertype-listener-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.4.0 | 添加了对 `signal` 选项的支持。 |
| v14.5.0 | 添加于：v14.5.0 |
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/zh/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `once` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当 `true` 时，侦听器会在首次调用时自动移除。 **默认:** `false`。
    - `passive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当 `true` 时，作为提示，表示侦听器不会调用 `Event` 对象的 `preventDefault()` 方法。 **默认:** `false`。
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 不直接被 Node.js 使用。为了 API 的完整性而添加。**默认:** `false`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 当给定的 AbortSignal 对象的 `abort()` 方法被调用时，侦听器将被移除。

为 `type` 事件添加一个新的处理器。任何给定的 `listener` 仅针对每个 `type` 和每个 `capture` 选项值添加一次。

如果 `once` 选项为 `true`，则在下一次分派 `type` 事件后，将移除 `listener`。

Node.js 不以任何功能方式使用 `capture` 选项，除了根据 `EventTarget` 规范跟踪注册的事件侦听器之外。 具体来说，`capture` 选项在注册 `listener` 时用作键的一部分。 任何单个 `listener` 可以添加一次，`capture = false`，一次 `capture = true`。

```js [ESM]
function handler(event) {}

const target = new EventTarget();
target.addEventListener('foo', handler, { capture: true });  // first
target.addEventListener('foo', handler, { capture: false }); // second

// 移除 handler 的第二个实例
target.removeEventListener('foo', handler);

// 移除 handler 的第一个实例
target.removeEventListener('foo', handler, { capture: true });
```

#### `eventTarget.dispatchEvent(event)` {#eventtargetdispatcheventevent}

**加入于: v14.5.0**

- `event` [\<Event\>](/zh/nodejs/api/events#class-event)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果事件的 `cancelable` 属性值为 false 或者其 `preventDefault()` 方法未被调用，则返回 `true`，否则返回 `false`。

将 `event` 分派到 `event.type` 的处理程序列表。

注册的事件监听器会按照它们注册的顺序同步调用。

#### `eventTarget.removeEventListener(type, listener[, options])` {#eventtargetremoveeventlistenertype-listener-options}

**加入于: v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/zh/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

从事件 `type` 的处理程序列表中移除 `listener`。

### 类: `CustomEvent` {#class-customevent}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 不再是实验性的。 |
| v22.1.0, v20.13.0 | CustomEvent 现在是稳定的。 |
| v19.0.0 | 不再需要 `--experimental-global-customevent` 命令行标志。 |
| v18.7.0, v16.17.0 | 加入于: v18.7.0, v16.17.0 |
:::

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) [稳定度: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

- 继承自: [\<Event\>](/zh/nodejs/api/events#class-event)

`CustomEvent` 对象是 [`CustomEvent` Web API](https://dom.spec.whatwg.org/#customevent) 的改编。 实例由 Node.js 内部创建。

#### `event.detail` {#eventdetail}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.1.0, v20.13.0 | CustomEvent 现在是稳定的。 |
| v18.7.0, v16.17.0 | 加入于: v18.7.0, v16.17.0 |
:::

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) [稳定度: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

- 类型: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 返回初始化时传递的自定义数据。

只读。


### 类: `NodeEventTarget` {#class-nodeeventtarget}

**加入于: v14.5.0**

- 继承: [\<EventTarget\>](/zh/nodejs/api/events#class-eventtarget)

`NodeEventTarget` 是 `EventTarget` 的一个 Node.js 特定的扩展，它模拟了 `EventEmitter` API 的一个子集。

#### `nodeEventTarget.addListener(type, listener)` {#nodeeventtargetaddlistenertype-listener}

**加入于: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/zh/nodejs/api/events#event-listener)
-  返回: [\<EventTarget\>](/zh/nodejs/api/events#class-eventtarget) this

Node.js 特定的 `EventTarget` 类的扩展，模拟了等效的 `EventEmitter` API。 `addListener()` 和 `addEventListener()` 之间唯一的区别是 `addListener()` 将返回对 `EventTarget` 的引用。

#### `nodeEventTarget.emit(type, arg)` {#nodeeventtargetemittype-arg}

**加入于: v15.2.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `arg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果存在为 `type` 注册的事件监听器，则为 `true`，否则为 `false`。

Node.js 特定的 `EventTarget` 类的扩展，它将 `arg` 分派到 `type` 的处理程序列表。

#### `nodeEventTarget.eventNames()` {#nodeeventtargeteventnames}

**加入于: v14.5.0**

- 返回: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Node.js 特定的 `EventTarget` 类的扩展，它返回一个事件 `type` 名称的数组，这些事件名称已注册了事件监听器。

#### `nodeEventTarget.listenerCount(type)` {#nodeeventtargetlistenercounttype}

**加入于: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js 特定的 `EventTarget` 类的扩展，它返回为 `type` 注册的事件监听器的数量。


#### `nodeEventTarget.setMaxListeners(n)` {#nodeeventtargetsetmaxlistenersn}

**新增于: v14.5.0**

- `n` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js 针对 `EventTarget` 类的特定扩展，用于设置最大事件监听器的数量为 `n`。

#### `nodeEventTarget.getMaxListeners()` {#nodeeventtargetgetmaxlisteners}

**新增于: v14.5.0**

- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js 针对 `EventTarget` 类的特定扩展，用于返回最大事件监听器的数量。

#### `nodeEventTarget.off(type, listener[, options])` {#nodeeventtargetofftype-listener-options}

**新增于: v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/zh/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)


- 返回: [\<EventTarget\>](/zh/nodejs/api/events#class-eventtarget) this

Node.js 中 `eventTarget.removeEventListener()` 的特定别名。

#### `nodeEventTarget.on(type, listener)` {#nodeeventtargetontype-listener}

**新增于: v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/zh/nodejs/api/events#event-listener)
- 返回: [\<EventTarget\>](/zh/nodejs/api/events#class-eventtarget) this

Node.js 中 `eventTarget.addEventListener()` 的特定别名。

#### `nodeEventTarget.once(type, listener)` {#nodeeventtargetoncetype-listener}

**新增于: v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/zh/nodejs/api/events#event-listener)
- 返回: [\<EventTarget\>](/zh/nodejs/api/events#class-eventtarget) this

Node.js 针对 `EventTarget` 类的特定扩展，为给定的事件 `type` 添加一个 `once` 监听器。 这等同于调用 `on` 并将 `once` 选项设置为 `true`。


#### `nodeEventTarget.removeAllListeners([type])` {#nodeeventtargetremovealllistenerstype}

**新增于: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  返回: [\<EventTarget\>](/zh/nodejs/api/events#class-eventtarget) `this`

Node.js 对 `EventTarget` 类的特定扩展。 如果指定了 `type`，则删除所有已注册的 `type` 监听器，否则删除所有已注册的监听器。

#### `nodeEventTarget.removeListener(type, listener[, options])` {#nodeeventtargetremovelistenertype-listener-options}

**新增于: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/zh/nodejs/api/events#event-listener)
-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)


-  返回: [\<EventTarget\>](/zh/nodejs/api/events#class-eventtarget) `this`

Node.js 对 `EventTarget` 类的特定扩展，用于删除给定 `type` 的 `listener`。 `removeListener()` 和 `removeEventListener()` 之间的唯一区别在于 `removeListener()` 将返回对 `EventTarget` 的引用。

