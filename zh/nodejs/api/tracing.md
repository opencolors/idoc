---
title: Node.js 跟踪事件
description: 关于如何使用 Node.js 跟踪事件 API 进行性能分析和调试的文档。
head:
  - - meta
    - name: og:title
      content: Node.js 跟踪事件 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 关于如何使用 Node.js 跟踪事件 API 进行性能分析和调试的文档。
  - - meta
    - name: twitter:title
      content: Node.js 跟踪事件 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 关于如何使用 Node.js 跟踪事件 API 进行性能分析和调试的文档。
---


# Trace events {#trace-events}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

**源码:** [lib/trace_events.js](https://github.com/nodejs/node/blob/v23.5.0/lib/trace_events.js)

`node:trace_events` 模块提供了一种机制来集中由 V8、Node.js 核心和用户空间代码生成的跟踪信息。

可以使用 `--trace-event-categories` 命令行标志或使用 `node:trace_events` 模块启用跟踪。`--trace-event-categories` 标志接受以逗号分隔的类别名称列表。

可用的类别包括：

- `node`: 一个空的占位符。
- `node.async_hooks`: 启用捕获详细的 [`async_hooks`](/zh/nodejs/api/async_hooks) 跟踪数据。[`async_hooks`](/zh/nodejs/api/async_hooks) 事件具有唯一的 `asyncId` 和特殊的 `triggerId` `triggerAsyncId` 属性。
- `node.bootstrap`: 启用捕获 Node.js 启动里程碑。
- `node.console`: 启用捕获 `console.time()` 和 `console.count()` 输出。
- `node.threadpoolwork.sync`: 启用捕获线程池同步操作的跟踪数据，例如 `blob`、`zlib`、`crypto` 和 `node_api`。
- `node.threadpoolwork.async`: 启用捕获线程池异步操作的跟踪数据，例如 `blob`、`zlib`、`crypto` 和 `node_api`。
- `node.dns.native`: 启用捕获 DNS 查询的跟踪数据。
- `node.net.native`: 启用捕获网络的跟踪数据。
- `node.environment`: 启用捕获 Node.js 环境里程碑。
- `node.fs.sync`: 启用捕获文件系统同步方法的跟踪数据。
- `node.fs_dir.sync`: 启用捕获文件系统同步目录方法的跟踪数据。
- `node.fs.async`: 启用捕获文件系统异步方法的跟踪数据。
- `node.fs_dir.async`: 启用捕获文件系统异步目录方法的跟踪数据。
- `node.perf`: 启用捕获 [Performance API](/zh/nodejs/api/perf_hooks) 测量。
    - `node.perf.usertiming`: 启用仅捕获 Performance API 用户计时测量和标记。
    - `node.perf.timerify`: 启用仅捕获 Performance API timerify 测量。

- `node.promises.rejections`: 启用捕获跟踪未处理的 Promise 拒绝和处理后的拒绝数量的跟踪数据。
- `node.vm.script`: 启用捕获 `node:vm` 模块的 `runInNewContext()`、`runInContext()` 和 `runInThisContext()` 方法的跟踪数据。
- `v8`: [V8](/zh/nodejs/api/v8) 事件与 GC、编译和执行相关。
- `node.http`: 启用捕获 http 请求/响应的跟踪数据。
- `node.module_timer`: 启用捕获 CJS 模块加载的跟踪数据。

默认情况下，启用 `node`、`node.async_hooks` 和 `v8` 类别。

```bash [BASH]
node --trace-event-categories v8,node,node.async_hooks server.js
```
先前版本的 Node.js 需要使用 `--trace-events-enabled` 标志来启用跟踪事件。 此要求已删除。 但是，仍然可以使用 `--trace-events-enabled` 标志，并且默认情况下将启用 `node`、`node.async_hooks` 和 `v8` 跟踪事件类别。

```bash [BASH]
node --trace-events-enabled

# 等价于 {#is-equivalent-to}

node --trace-event-categories v8,node,node.async_hooks
```
或者，可以使用 `node:trace_events` 模块启用跟踪事件：

```js [ESM]
const trace_events = require('node:trace_events');
const tracing = trace_events.createTracing({ categories: ['node.perf'] });
tracing.enable();  // 启用 'node.perf' 类别的跟踪事件捕获

// 做一些工作

tracing.disable();  // 禁用 'node.perf' 类别的跟踪事件捕获
```
启用跟踪后运行 Node.js 将生成日志文件，可以在 Chrome 的 [`chrome://tracing`](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) 标签中打开。

默认情况下，日志文件称为 `node_trace.${rotation}.log`，其中 `${rotation}` 是一个递增的日志轮换 ID。 文件路径模式可以使用 `--trace-event-file-pattern` 指定，它接受支持 `${rotation}` 和 `${pid}` 的模板字符串：

```bash [BASH]
node --trace-event-categories v8 --trace-event-file-pattern '${pid}-${rotation}.log' server.js
```
为了保证在 `SIGINT`、`SIGTERM` 或 `SIGBREAK` 等信号事件之后正确生成日志文件，请确保在代码中具有适当的处理程序，例如：

```js [ESM]
process.on('SIGINT', function onSigint() {
  console.info('Received SIGINT.');
  process.exit(130);  // 或取决于操作系统和信号的适用退出代码
});
```
跟踪系统使用与 `process.hrtime()` 相同的时间源。 但是，trace-event 时间戳以微秒表示，这与返回纳秒的 `process.hrtime()` 不同。

此模块中的功能在 [`Worker`](/zh/nodejs/api/worker_threads#class-worker) 线程中不可用。


## `node:trace_events` 模块 {#the-nodetrace_events-module}

**已加入版本：v10.0.0**

### `Tracing` 对象 {#tracing-object}

**已加入版本：v10.0.0**

`Tracing` 对象用于启用或禁用特定类别集合的追踪。实例使用 `trace_events.createTracing()` 方法创建。

创建时，`Tracing` 对象被禁用。调用 `tracing.enable()` 方法会将类别添加到已启用追踪事件类别的集合中。调用 `tracing.disable()` 会将类别从已启用追踪事件类别的集合中移除。

#### `tracing.categories` {#tracingcategories}

**已加入版本：v10.0.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

一个逗号分隔的字符串列表，其中包含此 `Tracing` 对象所涵盖的追踪事件类别。

#### `tracing.disable()` {#tracingdisable}

**已加入版本：v10.0.0**

禁用此 `Tracing` 对象。

只有*未*被其他已启用的 `Tracing` 对象覆盖并且*未*被 `--trace-event-categories` 标志指定的追踪事件类别才会被禁用。

```js [ESM]
const trace_events = require('node:trace_events');
const t1 = trace_events.createTracing({ categories: ['node', 'v8'] });
const t2 = trace_events.createTracing({ categories: ['node.perf', 'node'] });
t1.enable();
t2.enable();

// 打印 'node,node.perf,v8'
console.log(trace_events.getEnabledCategories());

t2.disable(); // 将只禁用 'node.perf' 类别的发出

// 打印 'node,v8'
console.log(trace_events.getEnabledCategories());
```
#### `tracing.enable()` {#tracingenable}

**已加入版本：v10.0.0**

为此 `Tracing` 对象启用了它所涵盖的类别集合的追踪。

#### `tracing.enabled` {#tracingenabled}

**已加入版本：v10.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 只有在 `Tracing` 对象被启用时才为 `true`。

### `trace_events.createTracing(options)` {#trace_eventscreatetracingoptions}

**已加入版本：v10.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `categories` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 追踪类别名称的数组。数组中包含的值在可能的情况下会被强制转换为字符串。如果该值无法被强制转换，则会抛出一个错误。


- 返回: [\<Tracing\>](/zh/nodejs/api/tracing#tracing-object).

为给定的 `categories` 集合创建并返回一个 `Tracing` 对象。

```js [ESM]
const trace_events = require('node:trace_events');
const categories = ['node.perf', 'node.async_hooks'];
const tracing = trace_events.createTracing({ categories });
tracing.enable();
// 执行一些操作
tracing.disable();
```

### `trace_events.getEnabledCategories()` {#trace_eventsgetenabledcategories}

**新增于: v10.0.0**

- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回所有当前已启用的追踪事件类别，以逗号分隔的列表。 当前已启用的追踪事件类别集合由所有当前已启用的 `Tracing` 对象以及使用 `--trace-event-categories` 标志启用的任何类别的*并集*决定。

给定下面的文件 `test.js`，命令 `node --trace-event-categories node.perf test.js` 将会向控制台打印 `'node.async_hooks,node.perf'`。

```js [ESM]
const trace_events = require('node:trace_events');
const t1 = trace_events.createTracing({ categories: ['node.async_hooks'] });
const t2 = trace_events.createTracing({ categories: ['node.perf'] });
const t3 = trace_events.createTracing({ categories: ['v8'] });

t1.enable();
t2.enable();

console.log(trace_events.getEnabledCategories());
```
## 示例 {#examples}

### 通过检查器收集追踪事件数据 {#collect-trace-events-data-by-inspector}

```js [ESM]
'use strict';

const { Session } = require('node:inspector');
const session = new Session();
session.connect();

function post(message, data) {
  return new Promise((resolve, reject) => {
    session.post(message, data, (err, result) => {
      if (err)
        reject(new Error(JSON.stringify(err)));
      else
        resolve(result);
    });
  });
}

async function collect() {
  const data = [];
  session.on('NodeTracing.dataCollected', (chunk) => data.push(chunk));
  session.on('NodeTracing.tracingComplete', () => {
    // 完成
  });
  const traceConfig = { includedCategories: ['v8'] };
  await post('NodeTracing.start', { traceConfig });
  // 做一些事情
  setTimeout(() => {
    post('NodeTracing.stop').then(() => {
      session.disconnect();
      console.log(data);
    });
  }, 1000);
}

collect();
```
