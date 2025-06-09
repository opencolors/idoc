---
title: Node.js 定时器 API 文档
description: Node.js 的定时器模块提供了在未来某个时间点调用函数的功能。这包括 setTimeout、setInterval、setImmediate 等方法及其清除对应的方法，以及在事件循环的下一次迭代中执行代码的 process.nextTick。
head:
  - - meta
    - name: og:title
      content: Node.js 定时器 API 文档 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 的定时器模块提供了在未来某个时间点调用函数的功能。这包括 setTimeout、setInterval、setImmediate 等方法及其清除对应的方法，以及在事件循环的下一次迭代中执行代码的 process.nextTick。
  - - meta
    - name: twitter:title
      content: Node.js 定时器 API 文档 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 的定时器模块提供了在未来某个时间点调用函数的功能。这包括 setTimeout、setInterval、setImmediate 等方法及其清除对应的方法，以及在事件循环的下一次迭代中执行代码的 process.nextTick。
---


# 定时器 {#timers}

::: tip [稳定度：2 - 稳定]
[稳定度：2](/zh/nodejs/api/documentation#stability-index) [稳定度：2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源代码：** [lib/timers.js](https://github.com/nodejs/node/blob/v23.5.0/lib/timers.js)

`timer` 模块公开了一个全局 API，用于调度在未来的某个时间点调用的函数。由于定时器函数是全局的，因此无需调用 `require('node:timers')` 即可使用该 API。

Node.js 中的定时器函数实现了与 Web 浏览器提供的定时器 API 类似的 API，但使用不同的内部实现，该实现围绕 Node.js [事件循环](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout) 构建。

## 类：`Immediate` {#class-immediate}

此对象在内部创建，并从 [`setImmediate()`](/zh/nodejs/api/timers#setimmediatecallback-args) 返回。它可以传递给 [`clearImmediate()`](/zh/nodejs/api/timers#clearimmediateimmediate)，以便取消计划的操作。

默认情况下，当调度 immediate 时，只要 immediate 处于活动状态，Node.js 事件循环就会继续运行。由 [`setImmediate()`](/zh/nodejs/api/timers#setimmediatecallback-args) 返回的 `Immediate` 对象导出 `immediate.ref()` 和 `immediate.unref()` 函数，可用于控制此默认行为。

### `immediate.hasRef()` {#immediatehasref}

**已添加：v11.0.0**

- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果为 true，则 `Immediate` 对象将保持 Node.js 事件循环处于活动状态。

### `immediate.ref()` {#immediateref}

**已添加：v9.7.0**

- 返回: [\<Immediate\>](/zh/nodejs/api/timers#class-immediate) 对 `immediate` 的引用

调用时，请求 Node.js 事件循环*不要*退出，只要 `Immediate` 处于活动状态。多次调用 `immediate.ref()` 不会有任何影响。

默认情况下，所有 `Immediate` 对象都“ref'ed”，因此通常不需要调用 `immediate.ref()`，除非之前已调用 `immediate.unref()`。


### `immediate.unref()` {#immediateunref}

**新增于: v9.7.0**

- 返回值: [\<Immediate\>](/zh/nodejs/api/timers#class-immediate) `immediate` 的引用

调用后，活动的 `Immediate` 对象将不再要求 Node.js 事件循环保持活动状态。 如果没有其他活动保持事件循环运行，则进程可能会在 `Immediate` 对象的回调被调用之前退出。 多次调用 `immediate.unref()` 不会产生任何影响。

### `immediate[Symbol.dispose]()` {#immediatesymboldispose}

**新增于: v20.5.0, v18.18.0**

::: warning [稳定性: 1 - 实验性]
[稳定性: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

取消 immediate。 这类似于调用 `clearImmediate()`。

## 类: `Timeout` {#class-timeout}

此对象在内部创建，并从 [`setTimeout()`](/zh/nodejs/api/timers#settimeoutcallback-delay-args) 和 [`setInterval()`](/zh/nodejs/api/timers#setintervalcallback-delay-args) 返回。 它可以传递给 [`clearTimeout()`](/zh/nodejs/api/timers#cleartimeouttimeout) 或 [`clearInterval()`](/zh/nodejs/api/timers#clearintervaltimeout) 以取消计划的操作。

默认情况下，当使用 [`setTimeout()`](/zh/nodejs/api/timers#settimeoutcallback-delay-args) 或 [`setInterval()`](/zh/nodejs/api/timers#setintervalcallback-delay-args) 安排定时器时，只要定时器处于活动状态，Node.js 事件循环就会继续运行。 这些函数返回的每个 `Timeout` 对象都导出 `timeout.ref()` 和 `timeout.unref()` 函数，可用于控制此默认行为。

### `timeout.close()` {#timeoutclose}

**新增于: v0.9.1**

::: info [稳定性: 3 - 遗留]
[稳定性: 3](/zh/nodejs/api/documentation#stability-index) [稳定性: 3](/zh/nodejs/api/documentation#stability-index) - 遗留：请改用 [`clearTimeout()`](/zh/nodejs/api/timers#cleartimeouttimeout)。
:::

- 返回值: [\<Timeout\>](/zh/nodejs/api/timers#class-timeout) `timeout` 的引用

取消超时。

### `timeout.hasRef()` {#timeouthasref}

**新增于: v11.0.0**

- 返回值: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果为 true，则 `Timeout` 对象将保持 Node.js 事件循环处于活动状态。


### `timeout.ref()` {#timeoutref}

**新增于: v0.9.1**

- 返回: [\<Timeout\>](/zh/nodejs/api/timers#class-timeout) `timeout` 的一个引用

调用后，会请求 Node.js 事件循环在 `Timeout` 处于活动状态时*不*退出。 多次调用 `timeout.ref()` 不会产生任何影响。

默认情况下，所有 `Timeout` 对象都是 "ref'ed"，因此通常没有必要调用 `timeout.ref()`，除非之前调用过 `timeout.unref()`。

### `timeout.refresh()` {#timeoutrefresh}

**新增于: v10.2.0**

- 返回: [\<Timeout\>](/zh/nodejs/api/timers#class-timeout) `timeout` 的一个引用

将定时器的开始时间设置为当前时间，并重新安排定时器，使其在先前指定的持续时间（调整为当前时间）后调用其回调。 这对于刷新计时器而无需分配新的 JavaScript 对象很有用。

在已经调用其回调的计时器上使用此方法将重新激活计时器。

### `timeout.unref()` {#timeoutunref}

**新增于: v0.9.1**

- 返回: [\<Timeout\>](/zh/nodejs/api/timers#class-timeout) `timeout` 的一个引用

调用后，活动的 `Timeout` 对象将不需要 Node.js 事件循环保持活动状态。 如果没有其他活动使事件循环保持运行，则进程可能会在调用 `Timeout` 对象的回调之前退出。 多次调用 `timeout.unref()` 不会产生任何影响。

### `timeout[Symbol.toPrimitive]()` {#timeoutsymboltoprimitive}

**新增于: v14.9.0, v12.19.0**

- 返回: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 可用于引用此 `timeout` 的数字

将 `Timeout` 强制转换为原始类型。 该原始类型可用于清除 `Timeout`。 原始类型只能在创建超时的同一线程中使用。 因此，要在 [`worker_threads`](/zh/nodejs/api/worker_threads) 中使用它，必须首先将其传递到正确的线程。 这增强了与浏览器 `setTimeout()` 和 `setInterval()` 实现的兼容性。

### `timeout[Symbol.dispose]()` {#timeoutsymboldispose}

**新增于: v20.5.0, v18.18.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

取消 timeout。


## 调度定时器 {#scheduling-timers}

Node.js 中的定时器是一个内部构造，它会在一定时间后调用给定的函数。调用定时器函数的时间取决于创建定时器时使用的方法以及 Node.js 事件循环正在执行的其他工作。

### `setImmediate(callback[, ...args])` {#setimmediatecallback-args}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v0.9.1 | 添加于：v0.9.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 在此 Node.js [事件循环](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout)的回合结束时要调用的函数
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 调用 `callback` 时要传递的可选参数。
- 返回：[\<Immediate\>](/zh/nodejs/api/timers#class-immediate)，用于 [`clearImmediate()`](/zh/nodejs/api/timers#clearimmediateimmediate)

在 I/O 事件的回调之后，安排 `callback` 的“立即”执行。

当多次调用 `setImmediate()` 时，`callback` 函数会按照创建的顺序排队以供执行。 整个回调队列在每个事件循环迭代中都会被处理。 如果从正在执行的回调内部将立即定时器排队，则该定时器将不会被触发，直到下一个事件循环迭代。

如果 `callback` 不是函数，则会抛出 [`TypeError`](/zh/nodejs/api/errors#class-typeerror)。

此方法具有用于 Promise 的自定义变体，可使用 [`timersPromises.setImmediate()`](/zh/nodejs/api/timers#timerspromisessetimmediatevalue-options)。

### `setInterval(callback[, delay[, ...args]])` {#setintervalcallback-delay-args}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 现在，将无效的回调传递给 `callback` 参数会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v0.0.1 | 添加于：v0.0.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 定时器到期时要调用的函数。
- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在调用 `callback` 之前要等待的毫秒数。 **默认值:** `1`。
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 调用 `callback` 时要传递的可选参数。
- 返回：[\<Timeout\>](/zh/nodejs/api/timers#class-timeout)，用于 [`clearInterval()`](/zh/nodejs/api/timers#clearintervaltimeout)

安排每 `delay` 毫秒重复执行 `callback`。

当 `delay` 大于 `2147483647` 或小于 `1` 或 `NaN` 时，`delay` 将设置为 `1`。 非整数延迟将被截断为整数。

如果 `callback` 不是函数，则会抛出 [`TypeError`](/zh/nodejs/api/errors#class-typeerror)。

此方法具有用于 Promise 的自定义变体，可使用 [`timersPromises.setInterval()`](/zh/nodejs/api/timers#timerspromisessetintervaldelay-value-options)。


### `setTimeout(callback[, delay[, ...args]])` {#settimeoutcallback-delay-args}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 将无效的回调函数传递给 `callback` 参数现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v0.0.1 | 添加于: v0.0.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 定时器到期时要调用的函数。
- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 调用 `callback` 之前要等待的毫秒数。**默认:** `1`。
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 调用 `callback` 时要传递的可选参数。
- 返回: [\<Timeout\>](/zh/nodejs/api/timers#class-timeout) 用于 [`clearTimeout()`](/zh/nodejs/api/timers#cleartimeouttimeout)

在 `delay` 毫秒后调度一次性 `callback` 的执行。

`callback` 很可能不会在精确的 `delay` 毫秒内被调用。 Node.js 不保证回调触发的确切时间，也不保证它们的顺序。 回调函数将在尽可能接近指定时间的时间被调用。

当 `delay` 大于 `2147483647` 或小于 `1` 或 `NaN` 时，`delay` 将被设置为 `1`。 非整数延迟将被截断为整数。

如果 `callback` 不是一个函数，将抛出一个 [`TypeError`](/zh/nodejs/api/errors#class-typeerror)。

此方法有一个自定义的 Promise 变体，可使用 [`timersPromises.setTimeout()`](/zh/nodejs/api/timers#timerspromisessettimeoutdelay-value-options) 。

## 取消定时器 {#cancelling-timers}

[`setImmediate()`](/zh/nodejs/api/timers#setimmediatecallback-args), [`setInterval()`](/zh/nodejs/api/timers#setintervalcallback-delay-args), 和 [`setTimeout()`](/zh/nodejs/api/timers#settimeoutcallback-delay-args) 方法各自返回表示已调度定时器的对象。 这些可以用于取消定时器并防止它被触发。

对于 [`setImmediate()`](/zh/nodejs/api/timers#setimmediatecallback-args) 和 [`setTimeout()`](/zh/nodejs/api/timers#settimeoutcallback-delay-args) 的 Promise 版本，可以使用 [`AbortController`](/zh/nodejs/api/globals#class-abortcontroller) 来取消定时器。 取消后，返回的 Promise 将被 `'AbortError'` 拒绝。

对于 `setImmediate()`:

::: code-group
```js [ESM]
import { setImmediate as setImmediatePromise } from 'node:timers/promises';

const ac = new AbortController();
const signal = ac.signal;

// 我们不 `await` 该 Promise，因此 `ac.abort()` 是并发调用的。
setImmediatePromise('foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The immediate was aborted');
  });

ac.abort();
```

```js [CJS]
const { setImmediate: setImmediatePromise } = require('node:timers/promises');

const ac = new AbortController();
const signal = ac.signal;

setImmediatePromise('foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The immediate was aborted');
  });

ac.abort();
```
:::

对于 `setTimeout()`:

::: code-group
```js [ESM]
import { setTimeout as setTimeoutPromise } from 'node:timers/promises';

const ac = new AbortController();
const signal = ac.signal;

// 我们不 `await` 该 Promise，因此 `ac.abort()` 是并发调用的。
setTimeoutPromise(1000, 'foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The timeout was aborted');
  });

ac.abort();
```

```js [CJS]
const { setTimeout: setTimeoutPromise } = require('node:timers/promises');

const ac = new AbortController();
const signal = ac.signal;

setTimeoutPromise(1000, 'foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The timeout was aborted');
  });

ac.abort();
```
:::


### `clearImmediate(immediate)` {#clearimmediateimmediate}

**Added in: v0.9.1**

- `immediate` [\<Immediate\>](/zh/nodejs/api/timers#class-immediate) 由 [`setImmediate()`](/zh/nodejs/api/timers#setimmediatecallback-args) 返回的 `Immediate` 对象。

取消由 [`setImmediate()`](/zh/nodejs/api/timers#setimmediatecallback-args) 创建的 `Immediate` 对象。

### `clearInterval(timeout)` {#clearintervaltimeout}

**Added in: v0.0.1**

- `timeout` [\<Timeout\>](/zh/nodejs/api/timers#class-timeout) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 由 [`setInterval()`](/zh/nodejs/api/timers#setintervalcallback-delay-args) 返回的 `Timeout` 对象，或者 `Timeout` 对象的 [原始值](/zh/nodejs/api/timers#timeoutsymboltoprimitive) （作为字符串或数字）。

取消由 [`setInterval()`](/zh/nodejs/api/timers#setintervalcallback-delay-args) 创建的 `Timeout` 对象。

### `clearTimeout(timeout)` {#cleartimeouttimeout}

**Added in: v0.0.1**

- `timeout` [\<Timeout\>](/zh/nodejs/api/timers#class-timeout) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 由 [`setTimeout()`](/zh/nodejs/api/timers#settimeoutcallback-delay-args) 返回的 `Timeout` 对象，或者 `Timeout` 对象的 [原始值](/zh/nodejs/api/timers#timeoutsymboltoprimitive) （作为字符串或数字）。

取消由 [`setTimeout()`](/zh/nodejs/api/timers#settimeoutcallback-delay-args) 创建的 `Timeout` 对象。

## Timers Promises API {#timers-promises-api}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v16.0.0 | 从实验性毕业。 |
| v15.0.0 | 添加于: v15.0.0 |
:::

`timers/promises` API 提供了一组返回 `Promise` 对象的定时器函数。 该 API 可以通过 `require('node:timers/promises')` 访问。

::: code-group
```js [ESM]
import {
  setTimeout,
  setImmediate,
  setInterval,
} from 'node:timers/promises';
```

```js [CJS]
const {
  setTimeout,
  setImmediate,
  setInterval,
} = require('node:timers/promises');
```
:::


### `timersPromises.setTimeout([delay[, value[, options]]])` {#timerspromisessettimeoutdelay-value-options}

**新增于: v15.0.0**

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在兑现 Promise 之前等待的毫秒数。 **默认值:** `1`。
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Promise 兑现的值。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 设置为 `false` 以表明计划的 `Timeout` 不应要求 Node.js 事件循环保持活动状态。 **默认值:** `true`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 可用于取消计划的 `Timeout` 的可选 `AbortSignal`。
  
 



::: code-group
```js [ESM]
import {
  setTimeout,
} from 'node:timers/promises';

const res = await setTimeout(100, 'result');

console.log(res);  // 打印 'result'
```

```js [CJS]
const {
  setTimeout,
} = require('node:timers/promises');

setTimeout(100, 'result').then((res) => {
  console.log(res);  // 打印 'result'
});
```
:::

### `timersPromises.setImmediate([value[, options]])` {#timerspromisessetimmediatevalue-options}

**新增于: v15.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Promise 兑现的值。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 设置为 `false` 以表明计划的 `Immediate` 不应要求 Node.js 事件循环保持活动状态。 **默认值:** `true`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 可用于取消计划的 `Immediate` 的可选 `AbortSignal`。
  
 



::: code-group
```js [ESM]
import {
  setImmediate,
} from 'node:timers/promises';

const res = await setImmediate('result');

console.log(res);  // 打印 'result'
```

```js [CJS]
const {
  setImmediate,
} = require('node:timers/promises');

setImmediate('result').then((res) => {
  console.log(res);  // 打印 'result'
});
```
:::


### `timersPromises.setInterval([delay[, value[, options]]])` {#timerspromisessetintervaldelay-value-options}

**新增于: v15.9.0**

返回一个异步迭代器，该迭代器以 `delay` 毫秒的间隔生成值。 如果 `ref` 为 `true`，则需要显式或隐式地调用异步迭代器的 `next()` 以保持事件循环处于活动状态。

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 迭代之间等待的毫秒数。 **默认值:** `1`。
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 迭代器返回的值。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 设置为 `false` 以指示迭代之间计划的 `Timeout` 不应要求 Node.js 事件循环保持活动状态。 **默认值:** `true`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 可用于取消操作之间计划的 `Timeout` 的可选 `AbortSignal`。

::: code-group
```js [ESM]
import {
  setInterval,
} from 'node:timers/promises';

const interval = 100;
for await (const startTime of setInterval(interval, Date.now())) {
  const now = Date.now();
  console.log(now);
  if ((now - startTime) > 1000)
    break;
}
console.log(Date.now());
```

```js [CJS]
const {
  setInterval,
} = require('node:timers/promises');
const interval = 100;

(async function() {
  for await (const startTime of setInterval(interval, Date.now())) {
    const now = Date.now();
    console.log(now);
    if ((now - startTime) > 1000)
      break;
  }
  console.log(Date.now());
})();
```
:::

### `timersPromises.scheduler.wait(delay[, options])` {#timerspromisesschedulerwaitdelay-options}

**新增于: v17.3.0, v16.14.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性的
:::

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在 Promise 解析之前等待的毫秒数。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 设置为 `false` 以指示计划的 `Timeout` 不应要求 Node.js 事件循环保持活动状态。 **默认值:** `true`。
    - `signal` [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal) 可用于取消等待的可选 `AbortSignal`。

- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

一个实验性的 API，由正在开发为标准 Web Platform API 的[调度 API](https://github.com/WICG/scheduling-apis) 草案规范定义。

调用 `timersPromises.scheduler.wait(delay, options)` 等效于调用 `timersPromises.setTimeout(delay, undefined, options)`。

```js [ESM]
import { scheduler } from 'node:timers/promises';

await scheduler.wait(1000); // 继续之前等待一秒钟
```

### `timersPromises.scheduler.yield()` {#timerspromisesscheduleryield}

**新增于: v17.3.0, v16.14.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- 返回: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

一个实验性的 API，由 [Scheduling APIs](https://github.com/WICG/scheduling-apis) 草案规范定义，该规范正被开发为标准的 Web 平台 API。

调用 `timersPromises.scheduler.yield()` 等同于调用不带参数的 `timersPromises.setImmediate()`。

