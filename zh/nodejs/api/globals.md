---
title: Node.js 全局对象
description: 本页面记录了在 Node.js 中可用的全局对象，包括全局变量、函数和类，这些对象无需显式导入即可在任何模块中访问。
head:
  - - meta
    - name: og:title
      content: Node.js 全局对象 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 本页面记录了在 Node.js 中可用的全局对象，包括全局变量、函数和类，这些对象无需显式导入即可在任何模块中访问。
  - - meta
    - name: twitter:title
      content: Node.js 全局对象 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 本页面记录了在 Node.js 中可用的全局对象，包括全局变量、函数和类，这些对象无需显式导入即可在任何模块中访问。
---


# 全局对象 {#global-objects}

这些对象在所有模块中都可用。

以下变量可能看起来是全局的，但实际上不是。它们仅存在于 [CommonJS 模块](/zh/nodejs/api/modules) 的作用域内：

- [`__dirname`](/zh/nodejs/api/modules#__dirname)
- [`__filename`](/zh/nodejs/api/modules#__filename)
- [`exports`](/zh/nodejs/api/modules#exports)
- [`module`](/zh/nodejs/api/modules#module)
- [`require()`](/zh/nodejs/api/modules#requireid)

这里列出的对象是 Node.js 特有的。还有一些 [内置对象](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects) 是 JavaScript 语言本身的一部分，它们也是全局可访问的。

## 类: `AbortController` {#class-abortcontroller}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.4.0 | 不再是实验性的。 |
| v15.0.0, v14.17.0 | 添加于：v15.0.0, v14.17.0 |
:::

一个用于在选定的基于 `Promise` 的 API 中发出取消信号的实用程序类。该 API 基于 Web API [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)。

```js [ESM]
const ac = new AbortController();

ac.signal.addEventListener('abort', () => console.log('Aborted!'),
                           { once: true });

ac.abort();

console.log(ac.signal.aborted);  // 打印 true
```
### `abortController.abort([reason])` {#abortcontrollerabortreason}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v17.2.0, v16.14.0 | 添加了新的可选 reason 参数。 |
| v15.0.0, v14.17.0 | 添加于：v15.0.0, v14.17.0 |
:::

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 一个可选的原因，可以在 `AbortSignal` 的 `reason` 属性上检索。

触发中止信号，导致 `abortController.signal` 发出 `'abort'` 事件。

### `abortController.signal` {#abortcontrollersignal}

**添加于: v15.0.0, v14.17.0**

- 类型: [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal)

### 类: `AbortSignal` {#class-abortsignal}

**添加于: v15.0.0, v14.17.0**

- 继承自: [\<EventTarget\>](/zh/nodejs/api/events#class-eventtarget)

当调用 `abortController.abort()` 方法时，`AbortSignal` 用于通知观察者。


#### 静态方法: `AbortSignal.abort([reason])` {#static-method-abortsignalabortreason}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v17.2.0, v16.14.0 | 添加了新的可选 reason 参数。 |
| v15.12.0, v14.17.0 | 添加于: v15.12.0, v14.17.0 |
:::

- `reason`: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 返回值: [\<AbortSignal\>](/zh/nodejs/api/globals#class-abortsignal)

返回一个已中止的 `AbortSignal`。

#### 静态方法: `AbortSignal.timeout(delay)` {#static-method-abortsignaltimeoutdelay}

**添加于: v17.3.0, v16.14.0**

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在触发 AbortSignal 之前等待的毫秒数。

返回一个新的 `AbortSignal`，它将在 `delay` 毫秒后被中止。

#### 静态方法: `AbortSignal.any(signals)` {#static-method-abortsignalanysignals}

**添加于: v20.3.0, v18.17.0**

- `signals` [\<AbortSignal[]\>](/zh/nodejs/api/globals#class-abortsignal) 用于组合新的 `AbortSignal` 的 `AbortSignal` 数组。

返回一个新的 `AbortSignal`，如果提供的任何信号被中止，它将被中止。 它的 [`abortSignal.reason`](/zh/nodejs/api/globals#abortsignalreason) 将被设置为导致其中止的 `signals` 之一。

#### 事件: `'abort'` {#event-abort}

**添加于: v15.0.0, v14.17.0**

当调用 `abortController.abort()` 方法时，会触发 `'abort'` 事件。 该回调函数会被调用，带有一个对象参数，该对象参数带有一个 `type` 属性，其值为 `'abort'`：

```js [ESM]
const ac = new AbortController();

// 使用 onabort 属性...
ac.signal.onabort = () => console.log('aborted!');

// 或者 EventTarget API...
ac.signal.addEventListener('abort', (event) => {
  console.log(event.type);  // 打印 'abort'
}, { once: true });

ac.abort();
```

与 `AbortSignal` 关联的 `AbortController` 仅触发一次 `'abort'` 事件。 我们建议代码在添加 `'abort'` 事件监听器之前检查 `abortSignal.aborted` 属性是否为 `false`。

附加到 `AbortSignal` 的任何事件监听器都应使用 `{ once: true }` 选项（或者，如果使用 `EventEmitter` API 附加监听器，则使用 `once()` 方法），以确保在处理 `'abort'` 事件后立即删除事件监听器。 如果不这样做，可能会导致内存泄漏。


#### `abortSignal.aborted` {#abortsignalaborted}

**加入于: v15.0.0, v14.17.0**

- 类型: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 当 `AbortController` 被中止后为 True。

#### `abortSignal.onabort` {#abortsignalonabort}

**加入于: v15.0.0, v14.17.0**

- 类型: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

一个可选的回调函数，可以由用户代码设置，以便在 `abortController.abort()` 函数被调用时得到通知。

#### `abortSignal.reason` {#abortsignalreason}

**加入于: v17.2.0, v16.14.0**

- 类型: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

触发 `AbortSignal` 时指定的可选原因。

```js [ESM]
const ac = new AbortController();
ac.abort(new Error('boom!'));
console.log(ac.signal.reason);  // Error: boom!
```
#### `abortSignal.throwIfAborted()` {#abortsignalthrowifaborted}

**加入于: v17.3.0, v16.17.0**

如果 `abortSignal.aborted` 为 `true`，则抛出 `abortSignal.reason`。

## 类: `Blob` {#class-blob}

**加入于: v18.0.0**

请参阅 [\<Blob\>](/zh/nodejs/api/buffer#class-blob)。

## 类: `Buffer` {#class-buffer}

**加入于: v0.1.103**

- [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

用于处理二进制数据。 参阅 [buffer 部分](/zh/nodejs/api/buffer)。

## 类: `ByteLengthQueuingStrategy` {#class-bytelengthqueuingstrategy}

**加入于: v18.0.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性。
:::

一个浏览器兼容的 [`ByteLengthQueuingStrategy`](/zh/nodejs/api/webstreams#class-bytelengthqueuingstrategy) 实现。

## `__dirname` {#__dirname}

这个变量可能看起来是全局的，但实际上不是。 参阅 [`__dirname`](/zh/nodejs/api/modules#__dirname)。

## `__filename` {#__filename}

这个变量可能看起来是全局的，但实际上不是。 参阅 [`__filename`](/zh/nodejs/api/modules#__filename)。

## `atob(data)` {#atobdata}

**加入于: v16.0.0**

::: info [稳定度: 3 - 遗留]
[稳定度: 3](/zh/nodejs/api/documentation#stability-index) [稳定度: 3](/zh/nodejs/api/documentation#stability-index) - 遗留。 请使用 `Buffer.from(data, 'base64')` 代替。
:::

[`buffer.atob()`](/zh/nodejs/api/buffer#bufferatobdata) 的全局别名。


## `BroadcastChannel` {#broadcastchannel}

**添加于: v18.0.0**

请参阅 [\<BroadcastChannel\>](/zh/nodejs/api/worker_threads#class-broadcastchannel-extends-eventtarget)。

## `btoa(data)` {#btoadata}

**添加于: v16.0.0**

::: info [稳定度: 3 - 废弃]
[稳定度: 3](/zh/nodejs/api/documentation#stability-index) [稳定性: 3](/zh/nodejs/api/documentation#stability-index) - 废弃。请改用 `buf.toString('base64')`。
:::

[`buffer.btoa()`](/zh/nodejs/api/buffer#bufferbtoadata) 的全局别名。

## `clearImmediate(immediateObject)` {#clearimmediateimmediateobject}

**添加于: v0.9.1**

[`clearImmediate`](/zh/nodejs/api/timers#clearimmediateimmediate) 在 [timers](/zh/nodejs/api/timers) 部分中描述。

## `clearInterval(intervalObject)` {#clearintervalintervalobject}

**添加于: v0.0.1**

[`clearInterval`](/zh/nodejs/api/timers#clearintervaltimeout) 在 [timers](/zh/nodejs/api/timers) 部分中描述。

## `clearTimeout(timeoutObject)` {#cleartimeouttimeoutobject}

**添加于: v0.0.1**

[`clearTimeout`](/zh/nodejs/api/timers#cleartimeouttimeout) 在 [timers](/zh/nodejs/api/timers) 部分中描述。

## `CloseEvent` {#closeevent}

**添加于: v23.0.0**

`CloseEvent` 类。有关更多详细信息，请参阅 [`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/CloseEvent)。

[`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/CloseEvent) 的浏览器兼容实现。使用 [`--no-experimental-websocket`](/zh/nodejs/api/cli#--no-experimental-websocket) 命令行标志禁用此 API。

## 类: `CompressionStream` {#class-compressionstream}

**添加于: v18.0.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性。
:::

[`CompressionStream`](/zh/nodejs/api/webstreams#class-compressionstream) 的浏览器兼容实现。

## `console` {#console}

**添加于: v0.1.100**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

用于打印到 stdout 和 stderr。请参阅 [`console`](/zh/nodejs/api/console) 部分。

## 类: `CountQueuingStrategy` {#class-countqueuingstrategy}

**添加于: v18.0.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性。
:::

[`CountQueuingStrategy`](/zh/nodejs/api/webstreams#class-countqueuingstrategy) 的浏览器兼容实现。


## `Crypto` {#crypto}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 不再是实验性的。 |
| v19.0.0 | 不再受 `--experimental-global-webcrypto` CLI 标志控制。 |
| v17.6.0, v16.15.0 | 添加于: v17.6.0, v16.15.0 |
:::

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定。
:::

[\<Crypto\>](/zh/nodejs/api/webcrypto#class-crypto) 的浏览器兼容实现。 仅当 Node.js 二进制文件在编译时包含对 `node:crypto` 模块的支持时，此全局变量才可用。

## `crypto` {#crypto_1}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 不再是实验性的。 |
| v19.0.0 | 不再受 `--experimental-global-webcrypto` CLI 标志控制。 |
| v17.6.0, v16.15.0 | 添加于: v17.6.0, v16.15.0 |
:::

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定。
:::

[Web Crypto API](/zh/nodejs/api/webcrypto) 的浏览器兼容实现。

## `CryptoKey` {#cryptokey}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 不再是实验性的。 |
| v19.0.0 | 不再受 `--experimental-global-webcrypto` CLI 标志控制。 |
| v17.6.0, v16.15.0 | 添加于: v17.6.0, v16.15.0 |
:::

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定。
:::

[\<CryptoKey\>](/zh/nodejs/api/webcrypto#class-cryptokey) 的浏览器兼容实现。 仅当 Node.js 二进制文件在编译时包含对 `node:crypto` 模块的支持时，此全局变量才可用。

## `CustomEvent` {#customevent}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 不再是实验性的。 |
| v22.1.0, v20.13.0 | CustomEvent 现在是稳定的。 |
| v19.0.0 | 不再受 `--experimental-global-customevent` CLI 标志控制。 |
| v18.7.0, v16.17.0 | 添加于: v18.7.0, v16.17.0 |
:::

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

[`CustomEvent` Web API](https://dom.spec.whatwg.org/#customevent) 的浏览器兼容实现。


## 类: `DecompressionStream` {#class-decompressionstream}

**添加于: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性的。
:::

一个浏览器兼容的 [`DecompressionStream`](/zh/nodejs/api/webstreams#class-decompressionstream) 实现。

## `Event` {#event}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.4.0 | 不再是实验性的。 |
| v15.0.0 | 添加于: v15.0.0 |
:::

一个浏览器兼容的 `Event` 类实现。 详情请查看 [`EventTarget` 和 `Event` API](/zh/nodejs/api/events#eventtarget-and-event-api)。

## `EventSource` {#eventsource}

**添加于: v22.3.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性的。 使用 [`--experimental-eventsource`](/zh/nodejs/api/cli#--experimental-eventsource) CLI 标志启用此 API。
:::

一个浏览器兼容的 [`EventSource`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) 类实现。

## `EventTarget` {#eventtarget}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.4.0 | 不再是实验性的。 |
| v15.0.0 | 添加于: v15.0.0 |
:::

一个浏览器兼容的 `EventTarget` 类实现。 详情请查看 [`EventTarget` 和 `Event` API](/zh/nodejs/api/events#eventtarget-and-event-api)。

## `exports` {#exports}

这个变量可能看起来是全局的，但实际上不是。 请查看 [`exports`](/zh/nodejs/api/modules#exports)。

## `fetch` {#fetch}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v21.0.0 | 不再是实验性的。 |
| v18.0.0 | 不再需要 `--experimental-fetch` CLI 标志。 |
| v17.5.0, v16.15.0 | 添加于: v17.5.0, v16.15.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定的
:::

一个浏览器兼容的 [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) 函数实现。

## 类: `File` {#class-file}

**添加于: v20.0.0**

请查看 [\<File\>](/zh/nodejs/api/buffer#class-file)。


## 类 `FormData` {#class-formdata}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v21.0.0 | 不再是实验性的。 |
| v18.0.0 | 不再需要 `--experimental-fetch` 命令行标志。 |
| v17.6.0, v16.15.0 | 添加于：v17.6.0, v16.15.0 |
:::

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

一个浏览器兼容的 [\<FormData\>](https://developer.mozilla.org/en-US/docs/Web/API/FormData) 实现。

## `global` {#global}

**添加于: v0.1.27**

::: info [稳定: 3 - 遗留]
[稳定: 3](/zh/nodejs/api/documentation#stability-index) [稳定性: 3](/zh/nodejs/api/documentation#stability-index) - 遗留。请使用 [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) 代替。
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 全局命名空间对象。

在浏览器中，顶层作用域传统上是全局作用域。 这意味着 `var something` 将定义一个新的全局变量，但在 ECMAScript 模块中除外。 在 Node.js 中，情况有所不同。 顶层作用域不是全局作用域；Node.js 模块中的 `var something` 将是该模块的局部变量，无论它是 [CommonJS 模块](/zh/nodejs/api/modules) 还是 [ECMAScript 模块](/zh/nodejs/api/esm)。

## 类 `Headers` {#class-headers}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v21.0.0 | 不再是实验性的。 |
| v18.0.0 | 不再需要 `--experimental-fetch` 命令行标志。 |
| v17.5.0, v16.15.0 | 添加于：v17.5.0, v16.15.0 |
:::

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

一个浏览器兼容的 [\<Headers\>](https://developer.mozilla.org/en-US/docs/Web/API/Headers) 实现。

## `localStorage` {#localstorage}

**添加于: v22.4.0**

::: warning [稳定: 1 - 实验性]
[稳定: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).0 - 早期开发。
:::

一个浏览器兼容的 [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) 实现。 数据以未加密的形式存储在 [`--localstorage-file`](/zh/nodejs/api/cli#--localstorage-filefile) 命令行标志指定的文件中。 可以存储的最大数据量为 10 MB。 不支持在 Web Storage API 之外修改此数据。 使用 [`--experimental-webstorage`](/zh/nodejs/api/cli#--experimental-webstorage) 命令行标志启用此 API。 在服务器环境中使用时，`localStorage` 数据不是按用户或按请求存储的，而是在所有用户和请求之间共享的。


## `MessageChannel` {#messagechannel}

**Added in: v15.0.0**

`MessageChannel` 类。 更多详情请参见 [`MessageChannel`](/zh/nodejs/api/worker_threads#class-messagechannel)。

## `MessageEvent` {#messageevent}

**Added in: v15.0.0**

`MessageEvent` 类。 更多详情请参见 [`MessageEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/MessageEvent)。

## `MessagePort` {#messageport}

**Added in: v15.0.0**

`MessagePort` 类。 更多详情请参见 [`MessagePort`](/zh/nodejs/api/worker_threads#class-messageport)。

## `module` {#module}

这个变量看起来像是全局的，但实际上不是。 更多详情请参见 [`module`](/zh/nodejs/api/modules#module)。

## `Navigator` {#navigator}

**Added in: v21.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).1 - 活跃开发中。 使用 [`--no-experimental-global-navigator`](/zh/nodejs/api/cli#--no-experimental-global-navigator) CLI 标志禁用此 API。
:::

[Navigator API](https://html.spec.whatwg.org/multipage/system-state#the-navigator-object) 的部分实现。

## `navigator` {#navigator_1}

**Added in: v21.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).1 - 活跃开发中。 使用 [`--no-experimental-global-navigator`](/zh/nodejs/api/cli#--no-experimental-global-navigator) CLI 标志禁用此 API。
:::

[`window.navigator`](https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator) 的部分实现。

### `navigator.hardwareConcurrency` {#navigatorhardwareconcurrency}

**Added in: v21.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`navigator.hardwareConcurrency` 只读属性返回当前 Node.js 实例可用的逻辑处理器数量。

```js [ESM]
console.log(`此进程运行在 ${navigator.hardwareConcurrency} 个逻辑处理器上`);
```
### `navigator.language` {#navigatorlanguage}

**Added in: v21.2.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`navigator.language` 只读属性返回一个字符串，表示 Node.js 实例的首选语言。 该语言将由 Node.js 在运行时使用的 ICU 库根据操作系统的默认语言确定。

该值表示在 [RFC 5646](https://www.rfc-editor.org/rfc/rfc5646.txt) 中定义的语言版本。

在没有 ICU 的构建中的回退值为 `'en-US'`。

```js [ESM]
console.log(`Node.js 实例的首选语言具有标签 '${navigator.language}'`);
```

### `navigator.languages` {#navigatorlanguages}

**添加于: v21.2.0**

- {Array

`navigator.languages` 只读属性返回一个字符串数组，表示 Node.js 实例的首选语言。 默认情况下，`navigator.languages` 仅包含 `navigator.language` 的值，该值将由 Node.js 在运行时使用的 ICU 库根据操作系统的默认语言确定。

在没有 ICU 的构建上的回退值为 `['en-US']`。

```js [ESM]
console.log(`首选语言为 '${navigator.languages}'`);
```
### `navigator.platform` {#navigatorplatform}

**添加于: v21.2.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`navigator.platform` 只读属性返回一个字符串，用于标识 Node.js 实例正在运行的平台。

```js [ESM]
console.log(`此进程运行在 ${navigator.platform}`);
```
### `navigator.userAgent` {#navigatoruseragent}

**添加于: v21.1.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`navigator.userAgent` 只读属性返回由运行时名称和主版本号组成的用户代理。

```js [ESM]
console.log(`用户代理是 ${navigator.userAgent}`); // 输出 "Node.js/21"
```
## `PerformanceEntry` {#performanceentry}

**添加于: v19.0.0**

`PerformanceEntry` 类。 更多详情请参阅 [`PerformanceEntry`](/zh/nodejs/api/perf_hooks#class-performanceentry)。

## `PerformanceMark` {#performancemark}

**添加于: v19.0.0**

`PerformanceMark` 类。 更多详情请参阅 [`PerformanceMark`](/zh/nodejs/api/perf_hooks#class-performancemark)。

## `PerformanceMeasure` {#performancemeasure}

**添加于: v19.0.0**

`PerformanceMeasure` 类。 更多详情请参阅 [`PerformanceMeasure`](/zh/nodejs/api/perf_hooks#class-performancemeasure)。

## `PerformanceObserver` {#performanceobserver}

**添加于: v19.0.0**

`PerformanceObserver` 类。 更多详情请参阅 [`PerformanceObserver`](/zh/nodejs/api/perf_hooks#class-performanceobserver)。

## `PerformanceObserverEntryList` {#performanceobserverentrylist}

**添加于: v19.0.0**

`PerformanceObserverEntryList` 类。 更多详情请参阅 [`PerformanceObserverEntryList`](/zh/nodejs/api/perf_hooks#class-performanceobserverentrylist)。


## `PerformanceResourceTiming` {#performanceresourcetiming}

**添加于: v19.0.0**

`PerformanceResourceTiming` 类。 更多详情请参阅 [`PerformanceResourceTiming`](/zh/nodejs/api/perf_hooks#class-performanceresourcetiming)。

## `performance` {#performance}

**添加于: v16.0.0**

[`perf_hooks.performance`](/zh/nodejs/api/perf_hooks#perf_hooksperformance) 对象。

## `process` {#process}

**添加于: v0.1.7**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

进程对象。 参见 [`process` 对象](/zh/nodejs/api/process#process) 章节。

## `queueMicrotask(callback)` {#queuemicrotaskcallback}

**添加于: v11.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 要排队的函数。

`queueMicrotask()` 方法将一个微任务排队以调用 `callback`。 如果 `callback` 抛出异常，则将发出 [`process` 对象](/zh/nodejs/api/process#process) 的 `'uncaughtException'` 事件。

微任务队列由 V8 管理，并且可以使用与由 Node.js 管理的 [`process.nextTick()`](/zh/nodejs/api/process#processnexttickcallback-args) 队列类似的方式来使用。 在 Node.js 事件循环的每一轮中，始终在微任务队列之前处理 `process.nextTick()` 队列。

```js [ESM]
// 在这里，`queueMicrotask()` 用于确保“load”事件始终
// 异步发出，因此具有一致性。 使用
// 这里的 `process.nextTick()` 将导致“load”事件始终在发出
// 在任何其他 promise 作业之前。

DataHandler.prototype.load = async function load(key) {
  const hit = this._cache.get(key);
  if (hit !== undefined) {
    queueMicrotask(() => {
      this.emit('load', hit);
    });
    return;
  }

  const data = await fetchData(key);
  this._cache.set(key, data);
  this.emit('load', data);
};
```
## 类: `ReadableByteStreamController` {#class-readablebytestreamcontroller}

**添加于: v18.0.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性。
:::

[`ReadableByteStreamController`](/zh/nodejs/api/webstreams#class-readablebytestreamcontroller) 的浏览器兼容实现。


## 类: `ReadableStream` {#class-readablestream}

**添加于: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性的。
:::

[`ReadableStream`](/zh/nodejs/api/webstreams#class-readablestream) 的浏览器兼容实现。

## 类: `ReadableStreamBYOBReader` {#class-readablestreambyobreader}

**添加于: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性的。
:::

[`ReadableStreamBYOBReader`](/zh/nodejs/api/webstreams#class-readablestreambyobreader) 的浏览器兼容实现。

## 类: `ReadableStreamBYOBRequest` {#class-readablestreambyobrequest}

**添加于: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性的。
:::

[`ReadableStreamBYOBRequest`](/zh/nodejs/api/webstreams#class-readablestreambyobrequest) 的浏览器兼容实现。

## 类: `ReadableStreamDefaultController` {#class-readablestreamdefaultcontroller}

**添加于: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性的。
:::

[`ReadableStreamDefaultController`](/zh/nodejs/api/webstreams#class-readablestreamdefaultcontroller) 的浏览器兼容实现。

## 类: `ReadableStreamDefaultReader` {#class-readablestreamdefaultreader}

**添加于: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性的。
:::

[`ReadableStreamDefaultReader`](/zh/nodejs/api/webstreams#class-readablestreamdefaultreader) 的浏览器兼容实现。

## `require()` {#require}

此变量可能看起来是全局的，但实际上不是。请参阅 [`require()`](/zh/nodejs/api/modules#requireid)。

## `Response` {#response}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v21.0.0 | 不再是实验性的。 |
| v18.0.0 | 不再需要 `--experimental-fetch` 命令行标志。 |
| v17.5.0, v16.15.0 | 添加于: v17.5.0, v16.15.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定的
:::

[\<Response\>](https://developer.mozilla.org/en-US/docs/Web/API/Response) 的浏览器兼容实现。


## `Request` {#request}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v21.0.0 | 不再是实验性的。 |
| v18.0.0 | 不再需要 `--experimental-fetch` 命令行标志。 |
| v17.5.0, v16.15.0 | 添加于: v17.5.0, v16.15.0 |
:::

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

与浏览器兼容的[\<Request\>](https://developer.mozilla.org/en-US/docs/Web/API/Request)实现。

## `sessionStorage` {#sessionstorage}

**添加于: v22.4.0**

::: warning [稳定: 1 - 实验性]
[稳定: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 早期开发。
:::

与浏览器兼容的[`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)实现。 数据存储在内存中，存储配额为 10 MB。 `sessionStorage` 数据仅在当前运行的进程中持久存在，并且不在工作线程之间共享。

## `setImmediate(callback[, ...args])` {#setimmediatecallback-args}

**添加于: v0.9.1**

[`setImmediate`](/zh/nodejs/api/timers#setimmediatecallback-args)在[定时器](/zh/nodejs/api/timers)章节中描述。

## `setInterval(callback, delay[, ...args])` {#setintervalcallback-delay-args}

**添加于: v0.0.1**

[`setInterval`](/zh/nodejs/api/timers#setintervalcallback-delay-args)在[定时器](/zh/nodejs/api/timers)章节中描述。

## `setTimeout(callback, delay[, ...args])` {#settimeoutcallback-delay-args}

**添加于: v0.0.1**

[`setTimeout`](/zh/nodejs/api/timers#settimeoutcallback-delay-args)在[定时器](/zh/nodejs/api/timers)章节中描述。

## Class: `Storage` {#class-storage}

**添加于: v22.4.0**

::: warning [稳定: 1 - 实验性]
[稳定: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 早期开发。
:::

与浏览器兼容的[`Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Storage)实现。 使用[`--experimental-webstorage`](/zh/nodejs/api/cli#--experimental-webstorage) 命令行标志启用此 API。

## `structuredClone(value[, options])` {#structuredclonevalue-options}

**添加于: v17.0.0**

WHATWG [`structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) 方法。


## `SubtleCrypto` {#subtlecrypto}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 不再受 `--experimental-global-webcrypto` CLI 标志控制。 |
| v17.6.0, v16.15.0 | 添加于：v17.6.0, v16.15.0 |
:::

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定。
:::

[\<SubtleCrypto\>](/zh/nodejs/api/webcrypto#class-subtlecrypto) 的一个浏览器兼容实现。只有在编译 Node.js 二进制文件时包含了对 `node:crypto` 模块的支持，这个全局变量才可用。

## `DOMException` {#domexception}

**添加于: v17.0.0**

WHATWG `DOMException` 类。 更多详情请参阅 [`DOMException`](https://developer.mozilla.org/en-US/docs/Web/API/DOMException)。

## `TextDecoder` {#textdecoder}

**添加于: v11.0.0**

WHATWG `TextDecoder` 类。 请参阅 [`TextDecoder`](/zh/nodejs/api/util#class-utiltextdecoder) 部分。

## 类: `TextDecoderStream` {#class-textdecoderstream}

**添加于: v18.0.0**

::: warning [稳定: 1 - 实验]
[稳定: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验。
:::

[`TextDecoderStream`](/zh/nodejs/api/webstreams#class-textdecoderstream) 的一个浏览器兼容实现。

## `TextEncoder` {#textencoder}

**添加于: v11.0.0**

WHATWG `TextEncoder` 类。 请参阅 [`TextEncoder`](/zh/nodejs/api/util#class-utiltextencoder) 部分。

## 类: `TextEncoderStream` {#class-textencoderstream}

**添加于: v18.0.0**

::: warning [稳定: 1 - 实验]
[稳定: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验。
:::

[`TextEncoderStream`](/zh/nodejs/api/webstreams#class-textencoderstream) 的一个浏览器兼容实现。

## 类: `TransformStream` {#class-transformstream}

**添加于: v18.0.0**

::: warning [稳定: 1 - 实验]
[稳定: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验。
:::

[`TransformStream`](/zh/nodejs/api/webstreams#class-transformstream) 的一个浏览器兼容实现。

## 类: `TransformStreamDefaultController` {#class-transformstreamdefaultcontroller}

**添加于: v18.0.0**

::: warning [稳定: 1 - 实验]
[稳定: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验。
:::

[`TransformStreamDefaultController`](/zh/nodejs/api/webstreams#class-transformstreamdefaultcontroller) 的一个浏览器兼容实现。


## `URL` {#url}

**Added in: v10.0.0**

WHATWG `URL` 类。 请参见 [`URL`](/zh/nodejs/api/url#class-url) 部分。

## `URLSearchParams` {#urlsearchparams}

**Added in: v10.0.0**

WHATWG `URLSearchParams` 类。 请参见 [`URLSearchParams`](/zh/nodejs/api/url#class-urlsearchparams) 部分。

## `WebAssembly` {#webassembly}

**Added in: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

该对象充当所有 W3C [WebAssembly](https://webassembly.org/) 相关功能的命名空间。 有关用法和兼容性，请参见 [Mozilla 开发者网络](https://developer.mozilla.org/en-US/docs/WebAssembly)。

## `WebSocket` {#websocket}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.4.0 | 不再是实验性的。 |
| v22.0.0 | 不再位于 `--experimental-websocket` 命令行标志之后。 |
| v21.0.0, v20.10.0 | Added in: v21.0.0, v20.10.0 |
:::

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定。
:::

与浏览器兼容的 [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) 实现。 使用 [`--no-experimental-websocket`](/zh/nodejs/api/cli#--no-experimental-websocket) 命令行标志禁用此 API。

## 类: `WritableStream` {#class-writablestream}

**Added in: v18.0.0**

::: warning [稳定: 1 - 实验]
[稳定: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验。
:::

与浏览器兼容的 [`WritableStream`](/zh/nodejs/api/webstreams#class-writablestream) 实现。

## 类: `WritableStreamDefaultController` {#class-writablestreamdefaultcontroller}

**Added in: v18.0.0**

::: warning [稳定: 1 - 实验]
[稳定: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验。
:::

与浏览器兼容的 [`WritableStreamDefaultController`](/zh/nodejs/api/webstreams#class-writablestreamdefaultcontroller) 实现。

## 类: `WritableStreamDefaultWriter` {#class-writablestreamdefaultwriter}

**Added in: v18.0.0**

::: warning [稳定: 1 - 实验]
[稳定: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验。
:::

与浏览器兼容的 [`WritableStreamDefaultWriter`](/zh/nodejs/api/webstreams#class-writablestreamdefaultwriter) 实现。

