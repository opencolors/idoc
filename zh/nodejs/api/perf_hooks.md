---
title: Node.js 文档 - 性能钩子
description: 了解 Node.js 中的性能钩子 API，它提供了访问性能指标和测量 Node.js 应用程序性能的工具。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 - 性能钩子 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解 Node.js 中的性能钩子 API，它提供了访问性能指标和测量 Node.js 应用程序性能的工具。
  - - meta
    - name: twitter:title
      content: Node.js 文档 - 性能钩子 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解 Node.js 中的性能钩子 API，它提供了访问性能指标和测量 Node.js 应用程序性能的工具。
---


# 性能测量 API {#performance-measurement-apis}

::: tip [Stable: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源代码:** [lib/perf_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/perf_hooks.js)

该模块提供 W3C [Web Performance APIs](https://w3c.github.io/perf-timing-primer/) 的一个子集的实现，以及用于 Node.js 特定性能测量的附加 API。

Node.js 支持以下 [Web Performance APIs](https://w3c.github.io/perf-timing-primer/):

- [高精度时间](https://www.w3.org/TR/hr-time-2)
- [性能时间轴](https://w3c.github.io/performance-timeline/)
- [用户计时](https://www.w3.org/TR/user-timing/)
- [资源计时](https://www.w3.org/TR/resource-timing-2/)

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration);
  performance.clearMarks();
});
obs.observe({ type: 'measure' });
performance.measure('Start to Now');

performance.mark('A');
doSomeLongRunningProcess(() => {
  performance.measure('A to Now', 'A');

  performance.mark('B');
  performance.measure('A to B', 'A', 'B');
});
```

```js [CJS]
const { PerformanceObserver, performance } = require('node:perf_hooks');

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration);
});
obs.observe({ type: 'measure' });
performance.measure('Start to Now');

performance.mark('A');
(async function doSomeLongRunningProcess() {
  await new Promise((r) => setTimeout(r, 5000));
  performance.measure('A to Now', 'A');

  performance.mark('B');
  performance.measure('A to B', 'A', 'B');
})();
```
:::

## `perf_hooks.performance` {#perf_hooksperformance}

**加入于: v8.5.0**

一个可以用来从当前 Node.js 实例收集性能指标的对象。 它类似于浏览器中的 [`window.performance`](https://developer.mozilla.org/en-US/docs/Web/API/Window/performance)。


### `performance.clearMarks([name])` {#performanceclearmarksname}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 这个方法必须以 `performance` 对象作为接收者来调用。 |
| v8.5.0 | 添加于: v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

如果未提供 `name`，则从 Performance Timeline 中移除所有 `PerformanceMark` 对象。 如果提供了 `name`，则仅移除已命名的标记。

### `performance.clearMeasures([name])` {#performanceclearmeasuresname}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 这个方法必须以 `performance` 对象作为接收者来调用。 |
| v16.7.0 | 添加于: v16.7.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

如果未提供 `name`，则从 Performance Timeline 中移除所有 `PerformanceMeasure` 对象。 如果提供了 `name`，则仅移除已命名的测量。

### `performance.clearResourceTimings([name])` {#performanceclearresourcetimingsname}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 这个方法必须以 `performance` 对象作为接收者来调用。 |
| v18.2.0, v16.17.0 | 添加于: v18.2.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

如果未提供 `name`，则从 Resource Timeline 中移除所有 `PerformanceResourceTiming` 对象。 如果提供了 `name`，则仅移除已命名的资源。

### `performance.eventLoopUtilization([utilization1[, utilization2]])` {#performanceeventlooputilizationutilization1-utilization2}

**添加于: v14.10.0, v12.19.0**

- `utilization1` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 先前调用 `eventLoopUtilization()` 的结果。
- `utilization2` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 在 `utilization1` 之前先前调用 `eventLoopUtilization()` 的结果。
- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `active` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`eventLoopUtilization()` 方法返回一个对象，该对象包含事件循环空闲和活跃的累计时长，表示为高精度毫秒计时器。 `utilization` 值是计算出的事件循环利用率 (ELU)。

如果主线程上的引导尚未完成，则这些属性的值为 `0`。[工作线程](/zh/nodejs/api/worker_threads#worker-threads)上的 ELU 立即可用，因为引导发生在事件循环中。

`utilization1` 和 `utilization2` 都是可选参数。

如果传递了 `utilization1`，则计算并返回当前调用的 `active` 和 `idle` 时间之间的增量，以及相应的 `utilization` 值（类似于 [`process.hrtime()`](/zh/nodejs/api/process#processhrtimetime)）。

如果 `utilization1` 和 `utilization2` 都传递了，则计算两个参数之间的增量。 这是一个方便的选项，因为与 [`process.hrtime()`](/zh/nodejs/api/process#processhrtimetime) 不同，计算 ELU 比单个减法更复杂。

ELU 类似于 CPU 利用率，不同之处在于它仅测量事件循环统计信息，而不测量 CPU 使用率。 它表示事件循环在事件循环的事件提供程序（例如 `epoll_wait`）之外花费的时间百分比。 不考虑其他 CPU 空闲时间。 以下是一个主要空闲进程具有高 ELU 的示例。

::: code-group
```js [ESM]
import { eventLoopUtilization } from 'node:perf_hooks';
import { spawnSync } from 'node:child_process';

setImmediate(() => {
  const elu = eventLoopUtilization();
  spawnSync('sleep', ['5']);
  console.log(eventLoopUtilization(elu).utilization);
});
```

```js [CJS]
'use strict';
const { eventLoopUtilization } = require('node:perf_hooks').performance;
const { spawnSync } = require('node:child_process');

setImmediate(() => {
  const elu = eventLoopUtilization();
  spawnSync('sleep', ['5']);
  console.log(eventLoopUtilization(elu).utilization);
});
```
:::

尽管运行此脚本时 CPU 大部分时间处于空闲状态，但 `utilization` 的值为 `1`。 这是因为对 [`child_process.spawnSync()`](/zh/nodejs/api/child_process#child_processspawnsynccommand-args-options) 的调用阻止事件循环继续。

传入用户定义的对象而不是先前调用 `eventLoopUtilization()` 的结果将导致未定义的行为。 不能保证返回值反映事件循环的任何正确状态。


### `performance.getEntries()` {#performancegetentries}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 此方法必须以 `performance` 对象作为接收者来调用。 |
| v16.7.0 | 添加于: v16.7.0 |
:::

- 返回: [\<PerformanceEntry[]\>](/zh/nodejs/api/perf_hooks#class-performanceentry)

返回一个 `PerformanceEntry` 对象列表，这些对象按照 `performanceEntry.startTime` 的时间顺序排列。 如果您只对特定类型或具有特定名称的性能条目感兴趣，请参阅 `performance.getEntriesByType()` 和 `performance.getEntriesByName()`。

### `performance.getEntriesByName(name[, type])` {#performancegetentriesbynamename-type}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 此方法必须以 `performance` 对象作为接收者来调用。 |
| v16.7.0 | 添加于: v16.7.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<PerformanceEntry[]\>](/zh/nodejs/api/perf_hooks#class-performanceentry)

返回一个 `PerformanceEntry` 对象列表，这些对象按照 `performanceEntry.startTime` 的时间顺序排列，并且它们的 `performanceEntry.name` 等于 `name`，并且可以选择性地，它们的 `performanceEntry.entryType` 等于 `type`。

### `performance.getEntriesByType(type)` {#performancegetentriesbytypetype}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 此方法必须以 `performance` 对象作为接收者来调用。 |
| v16.7.0 | 添加于: v16.7.0 |
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<PerformanceEntry[]\>](/zh/nodejs/api/perf_hooks#class-performanceentry)

返回一个 `PerformanceEntry` 对象列表，这些对象按照 `performanceEntry.startTime` 的时间顺序排列，并且它们的 `performanceEntry.entryType` 等于 `type`。

### `performance.mark(name[, options])` {#performancemarkname-options}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 此方法必须以 `performance` 对象作为接收者来调用。 name 参数不再是可选的。 |
| v16.0.0 | 更新为符合 User Timing Level 3 规范。 |
| v8.5.0 | 添加于: v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `detail` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 要包含在标记中的其他可选详细信息。
    - `startTime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 用作标记时间的可选时间戳。 **默认值**: `performance.now()`。



在 Performance Timeline 中创建一个新的 `PerformanceMark` 条目。 `PerformanceMark` 是 `PerformanceEntry` 的一个子类，它的 `performanceEntry.entryType` 总是 `'mark'`，并且它的 `performanceEntry.duration` 总是 `0`。 性能标记用于标记 Performance Timeline 中的特定重要时刻。

创建的 `PerformanceMark` 条目被放入全局 Performance Timeline，并且可以使用 `performance.getEntries`、`performance.getEntriesByName` 和 `performance.getEntriesByType` 查询。 当执行观察时，应该使用 `performance.clearMarks` 从全局 Performance Timeline 手动清除这些条目。


### `performance.markResourceTiming(timingInfo, requestedUrl, initiatorType, global, cacheMode, bodyInfo, responseStatus[, deliveryType])` {#performancemarkresourcetimingtiminginfo-requestedurl-initiatortype-global-cachemode-bodyinfo-responsestatus-deliverytype}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v22.2.0 | 添加了 bodyInfo、responseStatus 和 deliveryType 参数。 |
| v18.2.0, v16.17.0 | 添加于: v18.2.0, v16.17.0 |
:::

- `timingInfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [获取时序信息](https://fetch.spec.whatwg.org/#fetch-timing-info)
- `requestedUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 资源 URL
- `initiatorType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 发起者名称，例如：'fetch'
- `global` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `cacheMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 缓存模式必须是空字符串 ('') 或 'local'
- `bodyInfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [获取响应主体信息](https://fetch.spec.whatwg.org/#response-body-info)
- `responseStatus` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 响应的状态码
- `deliveryType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 交付类型。 **默认值:** `''`。

*此属性是 Node.js 的扩展。 它在 Web 浏览器中不可用。*

在资源时间轴中创建一个新的 `PerformanceResourceTiming` 条目。 `PerformanceResourceTiming` 是 `PerformanceEntry` 的一个子类，其 `performanceEntry.entryType` 始终为 `'resource'`。 性能资源用于标记资源时间轴中的时刻。

创建的 `PerformanceMark` 条目被放入全局资源时间轴，并且可以使用 `performance.getEntries`、`performance.getEntriesByName` 和 `performance.getEntriesByType` 进行查询。 当执行观察时，应该使用 `performance.clearResourceTimings` 从全局性能时间轴手动清除条目。


### `performance.measure(name[, startMarkOrOptions[, endMark]])` {#performancemeasurename-startmarkoroptions-endmark}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 此方法必须以 `performance` 对象作为接收者来调用。 |
| v16.0.0 | 更新为符合用户计时级别 3 规范。 |
| v13.13.0, v12.16.3 | 使 `startMark` 和 `endMark` 参数可选。 |
| v8.5.0 | 添加于: v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `startMarkOrOptions` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 可选。
    - `detail` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 要包含在度量中的其他可选详细信息。
    - `duration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始和结束时间之间的持续时间。
    - `end` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要用作结束时间的时间戳，或标识先前记录的标记的字符串。
    - `start` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要用作开始时间的时间戳，或标识先前记录的标记的字符串。
  
 
- `endMark` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 可选。 如果 `startMarkOrOptions` 是一个 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)，则必须省略。

在性能时间线上创建一个新的 `PerformanceMeasure` 条目。 `PerformanceMeasure` 是 `PerformanceEntry` 的一个子类，它的 `performanceEntry.entryType` 始终是 `'measure'`，并且它的 `performanceEntry.duration` 测量自 `startMark` 和 `endMark` 以来经过的毫秒数。

`startMark` 参数可以标识性能时间线中任何*现有*的 `PerformanceMark`，或者*可以*标识 `PerformanceNodeTiming` 类提供的任何时间戳属性。 如果命名的 `startMark` 不存在，则会抛出一个错误。

可选的 `endMark` 参数必须标识性能时间线中任何*现有*的 `PerformanceMark`，或者 `PerformanceNodeTiming` 类提供的任何时间戳属性。 如果没有传递参数，则 `endMark` 将为 `performance.now()`，否则，如果命名的 `endMark` 不存在，则会抛出一个错误。

创建的 `PerformanceMeasure` 条目被放置在全局性能时间线上，并且可以使用 `performance.getEntries`、`performance.getEntriesByName` 和 `performance.getEntriesByType` 进行查询。 当执行观察时，应该使用 `performance.clearMeasures` 手动从全局性能时间线上清除条目。


### `performance.nodeTiming` {#performancenodetiming}

**添加于: v8.5.0**

- [\<PerformanceNodeTiming\>](/zh/nodejs/api/perf_hooks#class-performancenodetiming)

*此属性是 Node.js 的扩展。它在 Web 浏览器中不可用。*

`PerformanceNodeTiming` 类的一个实例，提供特定 Node.js 操作里程碑的性能指标。

### `performance.now()` {#performancenow}

::: info [历史记录]
| 版本    | 变更                                   |
| ------- | -------------------------------------- |
| v19.0.0 | 此方法必须使用 `performance` 对象作为接收者来调用。 |
| v8.5.0  | 添加于: v8.5.0                          |
:::

- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

返回当前高精度毫秒时间戳，其中 0 表示当前 `node` 进程的开始。

### `performance.setResourceTimingBufferSize(maxSize)` {#performancesetresourcetimingbuffersizemaxsize}

::: info [历史记录]
| 版本    | 变更                  |
| ------- | --------------------- |
| v19.0.0 | 此方法必须使用 `performance` 对象作为接收者来调用。 |
| v18.8.0 | 添加于: v18.8.0        |
:::

将全局性能资源计时缓冲区大小设置为指定数量的 “resource” 类型性能条目对象。

默认情况下，最大缓冲区大小设置为 250。

### `performance.timeOrigin` {#performancetimeorigin}

**添加于: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

[`timeOrigin`](https://w3c.github.io/hr-time/#dom-performance-timeorigin) 指定当前 `node` 进程开始时的高精度毫秒时间戳，以 Unix 时间衡量。

### `performance.timerify(fn[, options])` {#performancetimerifyfn-options}

::: info [历史记录]
| 版本    | 变更                                                               |
| ------- | ------------------------------------------------------------------ |
| v16.0.0 | 添加了 histogram 选项。                                            |
| v16.0.0 | 重新实现为使用纯 JavaScript 并且能够对异步函数进行计时。                |
| v8.5.0  | 添加于: v8.5.0                                                       |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `histogram` [\<RecordableHistogram\>](/zh/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram) 一个使用 `perf_hooks.createHistogram()` 创建的 histogram 对象，将记录以纳秒为单位的运行时长。

*此属性是 Node.js 的扩展。它在 Web 浏览器中不可用。*

将函数包装在一个新的函数中，该函数测量被包装函数的运行时间。 必须将 `PerformanceObserver` 订阅到 `'function'` 事件类型，才能访问计时详细信息。

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

function someFunction() {
  console.log('hello world');
}

const wrapped = performance.timerify(someFunction);

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration);

  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

// 将创建一个性能时间线条目
wrapped();
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

function someFunction() {
  console.log('hello world');
}

const wrapped = performance.timerify(someFunction);

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration);

  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

// 将创建一个性能时间线条目
wrapped();
```
:::

如果包装的函数返回一个 Promise，则将 finally 处理程序附加到该 Promise，并且一旦调用 finally 处理程序，就会报告持续时间。


### `performance.toJSON()` {#performancetojson}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 此方法必须以 `performance` 对象作为接收者调用。 |
| v16.1.0 | 添加于：v16.1.0 |
:::

`performance` 对象的 JSON 表示形式。 它类似于浏览器中的 [`window.performance.toJSON`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/toJSON)。

#### 事件：`'resourcetimingbufferfull'` {#event-resourcetimingbufferfull}

**添加于：v18.8.0**

当全局性能资源计时缓冲区已满时，会触发 `'resourcetimingbufferfull'` 事件。 在事件监听器中使用 `performance.setResourceTimingBufferSize()` 调整资源计时缓冲区大小，或使用 `performance.clearResourceTimings()` 清除缓冲区，以便将更多条目添加到性能时间线缓冲区。

## 类：`PerformanceEntry` {#class-performanceentry}

**添加于：v8.5.0**

此类的构造函数不会直接向用户公开。

### `performanceEntry.duration` {#performanceentryduration}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 此属性的 getter 必须以 `PerformanceEntry` 对象作为接收者调用。 |
| v8.5.0 | 添加于：v8.5.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

此条目经过的总毫秒数。 对于所有性能条目类型，此值可能没有意义。

### `performanceEntry.entryType` {#performanceentryentrytype}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 此属性的 getter 必须以 `PerformanceEntry` 对象作为接收者调用。 |
| v8.5.0 | 添加于：v8.5.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

性能条目的类型。 它可以是以下之一：

- `'dns'` (仅 Node.js)
- `'function'` (仅 Node.js)
- `'gc'` (仅 Node.js)
- `'http2'` (仅 Node.js)
- `'http'` (仅 Node.js)
- `'mark'` (在 Web 上可用)
- `'measure'` (在 Web 上可用)
- `'net'` (仅 Node.js)
- `'node'` (仅 Node.js)
- `'resource'` (在 Web 上可用)


### `performanceEntry.name` {#performanceentryname}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 必须使用 `PerformanceEntry` 对象作为接收者来调用此属性 getter。 |
| v8.5.0 | 添加于：v8.5.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

性能条目的名称。

### `performanceEntry.startTime` {#performanceentrystarttime}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 必须使用 `PerformanceEntry` 对象作为接收者来调用此属性 getter。 |
| v8.5.0 | 添加于：v8.5.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

高分辨率毫秒时间戳，标记性能条目的开始时间。

## 类: `PerformanceMark` {#class-performancemark}

**添加于: v18.2.0, v16.17.0**

- 继承自: [\<PerformanceEntry\>](/zh/nodejs/api/perf_hooks#class-performanceentry)

公开通过 `Performance.mark()` 方法创建的标记。

### `performanceMark.detail` {#performancemarkdetail}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 必须使用 `PerformanceMark` 对象作为接收者来调用此属性 getter。 |
| v16.0.0 | 添加于：v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

使用 `Performance.mark()` 方法创建时指定的其他细节。

## 类: `PerformanceMeasure` {#class-performancemeasure}

**添加于: v18.2.0, v16.17.0**

- 继承自: [\<PerformanceEntry\>](/zh/nodejs/api/perf_hooks#class-performanceentry)

公开通过 `Performance.measure()` 方法创建的度量。

这个类的构造函数不直接向用户公开。

### `performanceMeasure.detail` {#performancemeasuredetail}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 必须使用 `PerformanceMeasure` 对象作为接收者来调用此属性 getter。 |
| v16.0.0 | 添加于：v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

使用 `Performance.measure()` 方法创建时指定的其他细节。


## 类：`PerformanceNodeEntry` {#class-performancenodeentry}

**加入于: v19.0.0**

- 继承自：[\<PerformanceEntry\>](/zh/nodejs/api/perf_hooks#class-performanceentry)

*这个类是 Node.js 的扩展。它在 Web 浏览器中不可用。*

提供详细的 Node.js 定时数据。

这个类的构造函数不直接暴露给用户。

### `performanceNodeEntry.detail` {#performancenodeentrydetail}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 这个属性的 getter 必须用 `PerformanceNodeEntry` 对象作为接收者来调用。 |
| v16.0.0 | 加入于: v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

特定于 `entryType` 的额外细节。

### `performanceNodeEntry.flags` {#performancenodeentryflags}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v16.0.0 | 运行时已弃用。现在当 entryType 为 'gc' 时，已移动到 detail 属性。 |
| v13.9.0, v12.17.0 | 加入于: v13.9.0, v12.17.0 |
:::

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用: 请改用 `performanceNodeEntry.detail`。
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

当 `performanceEntry.entryType` 等于 `'gc'` 时，`performance.flags` 属性包含关于垃圾回收操作的额外信息。该值可能是以下之一：

- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE`

### `performanceNodeEntry.kind` {#performancenodeentrykind}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v16.0.0 | 运行时已弃用。现在当 entryType 为 'gc' 时，已移动到 detail 属性。 |
| v8.5.0 | 加入于: v8.5.0 |
:::

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用: 请改用 `performanceNodeEntry.detail`。
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

当 `performanceEntry.entryType` 等于 `'gc'` 时，`performance.kind` 属性标识发生的垃圾回收操作的类型。该值可能是以下之一：

- `perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB`


### 垃圾回收（'gc'）详情 {#garbage-collection-gc-details}

当 `performanceEntry.type` 等于 `'gc'` 时，`performanceNodeEntry.detail` 属性将是一个包含两个属性的 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)：

- `kind` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 其中之一：
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB`
  
 
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 其中之一：
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE`
  
 

### HTTP ('http') 详情 {#http-http-details}

当 `performanceEntry.type` 等于 `'http'` 时，`performanceNodeEntry.detail` 属性将是一个包含额外信息的 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)。

如果 `performanceEntry.name` 等于 `HttpClient`，则 `detail` 将包含以下属性：`req`、`res`。 并且 `req` 属性将是一个包含 `method`、`url`、`headers` 的 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)，`res` 属性将是一个包含 `statusCode`、`statusMessage`、`headers` 的 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)。

如果 `performanceEntry.name` 等于 `HttpRequest`，则 `detail` 将包含以下属性：`req`、`res`。 并且 `req` 属性将是一个包含 `method`、`url`、`headers` 的 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)，`res` 属性将是一个包含 `statusCode`、`statusMessage`、`headers` 的 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)。

这可能会增加额外的内存开销，应仅用于诊断目的，默认情况下不应在生产环境中启用。


### HTTP/2 ('http2') 详情 {#http/2-http2-details}

当 `performanceEntry.type` 等于 `'http2'` 时，`performanceNodeEntry.detail` 属性将是一个 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)，包含额外的性能信息。

如果 `performanceEntry.name` 等于 `Http2Stream`，则 `detail` 将包含以下属性：

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 为此 `Http2Stream` 接收到的 `DATA` 帧的字节数。
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 为此 `Http2Stream` 发送的 `DATA` 帧的字节数。
- `id` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 关联的 `Http2Stream` 的标识符。
- `timeToFirstByte` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `PerformanceEntry` 的 `startTime` 与接收到第一个 `DATA` 帧之间经过的毫秒数。
- `timeToFirstByteSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `PerformanceEntry` 的 `startTime` 与发送第一个 `DATA` 帧之间经过的毫秒数。
- `timeToFirstHeader` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `PerformanceEntry` 的 `startTime` 与接收到第一个头部之间经过的毫秒数。

如果 `performanceEntry.name` 等于 `Http2Session`，则 `detail` 将包含以下属性：

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 为此 `Http2Session` 接收到的字节数。
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 为此 `Http2Session` 发送的字节数。
- `framesReceived` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session` 接收到的 HTTP/2 帧的数量。
- `framesSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session` 发送的 HTTP/2 帧的数量。
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在 `Http2Session` 的生命周期内同时打开的最大流数。
- `pingRTT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 自 `PING` 帧的传输到接收到其确认之间经过的毫秒数。仅当在 `Http2Session` 上发送了 `PING` 帧时才存在。
- `streamAverageDuration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 所有 `Http2Stream` 实例的平均持续时间（以毫秒为单位）。
- `streamCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session` 处理的 `Http2Stream` 实例的数量。
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'server'` 或 `'client'`，用于标识 `Http2Session` 的类型。


### Timerify ('function') 详情 {#timerify-function-details}

当 `performanceEntry.type` 等于 `'function'` 时，`performanceNodeEntry.detail` 属性将是一个 [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)，列出定时函数的输入参数。

### Net ('net') 详情 {#net-net-details}

当 `performanceEntry.type` 等于 `'net'` 时，`performanceNodeEntry.detail` 属性将是一个 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)，包含其他信息。

如果 `performanceEntry.name` 等于 `connect`，则 `detail` 将包含以下属性：`host`、`port`。

### DNS ('dns') 详情 {#dns-dns-details}

当 `performanceEntry.type` 等于 `'dns'` 时，`performanceNodeEntry.detail` 属性将是一个 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)，包含其他信息。

如果 `performanceEntry.name` 等于 `lookup`，则 `detail` 将包含以下属性：`hostname`、`family`、`hints`、`verbatim`、`addresses`。

如果 `performanceEntry.name` 等于 `lookupService`，则 `detail` 将包含以下属性：`host`、`port`、`hostname`、`service`。

如果 `performanceEntry.name` 等于 `queryxxx` 或 `getHostByAddr`，则 `detail` 将包含以下属性：`host`、`ttl`、`result`。`result` 的值与 `queryxxx` 或 `getHostByAddr` 的结果相同。

## 类: `PerformanceNodeTiming` {#class-performancenodetiming}

**添加于: v8.5.0**

- 继承自: [\<PerformanceEntry\>](/zh/nodejs/api/perf_hooks#class-performanceentry)

*此属性是 Node.js 的扩展。它在 Web 浏览器中不可用。*

为 Node.js 本身提供计时详情。此类的构造函数不对用户公开。

### `performanceNodeTiming.bootstrapComplete` {#performancenodetimingbootstrapcomplete}

**添加于: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js 进程完成引导的高分辨率毫秒时间戳。 如果引导尚未完成，则该属性的值为 -1。


### `performanceNodeTiming.environment` {#performancenodetimingenvironment}

**添加于: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js 环境初始化的毫秒级高精度时间戳。

### `performanceNodeTiming.idleTime` {#performancenodetimingidletime}

**添加于: v14.10.0, v12.19.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

事件循环的事件提供者（例如 `epoll_wait`）中事件循环处于空闲状态的毫秒级高精度时间戳。 这不考虑 CPU 使用率。 如果事件循环尚未启动（例如，在主脚本的第一个滴答中），则该属性的值为 0。

### `performanceNodeTiming.loopExit` {#performancenodetimingloopexit}

**添加于: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js 事件循环退出的毫秒级高精度时间戳。 如果事件循环尚未退出，则该属性的值为 -1。 只有在 [`'exit'`](/zh/nodejs/api/process#event-exit) 事件的处理程序中，它的值才可能不是 -1。

### `performanceNodeTiming.loopStart` {#performancenodetimingloopstart}

**添加于: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js 事件循环开始的毫秒级高精度时间戳。 如果事件循环尚未启动（例如，在主脚本的第一个滴答中），则该属性的值为 -1。

### `performanceNodeTiming.nodeStart` {#performancenodetimingnodestart}

**添加于: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js 进程初始化的毫秒级高精度时间戳。

### `performanceNodeTiming.uvMetricsInfo` {#performancenodetiminguvmetricsinfo}

**添加于: v22.8.0, v20.18.0**

- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `loopCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 事件循环的迭代次数。
    - `events` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 事件处理程序已处理的事件数。
    - `eventsWaiting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 调用事件提供者时，等待处理的事件数。

这是对 `uv_metrics_info` 函数的包装。 它返回当前事件循环指标集。

建议在函数中使用此属性，该函数的执行是使用 `setImmediate` 调度的，以避免在完成当前循环迭代期间调度的所有操作之前收集指标。

::: code-group
```js [CJS]
const { performance } = require('node:perf_hooks');

setImmediate(() => {
  console.log(performance.nodeTiming.uvMetricsInfo);
});
```

```js [ESM]
import { performance } from 'node:perf_hooks';

setImmediate(() => {
  console.log(performance.nodeTiming.uvMetricsInfo);
});
```
:::


### `performanceNodeTiming.v8Start` {#performancenodetimingv8start}

**新增于: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

V8 平台初始化时的高分辨率毫秒时间戳。

## 类: `PerformanceResourceTiming` {#class-performanceresourcetiming}

**新增于: v18.2.0, v16.17.0**

- 继承: [\<PerformanceEntry\>](/zh/nodejs/api/perf_hooks#class-performanceentry)

提供有关应用程序资源加载的详细网络定时数据。

此类构造函数不会直接向用户公开。

### `performanceResourceTiming.workerStart` {#performanceresourcetimingworkerstart}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 此属性的 getter 必须以 `PerformanceResourceTiming` 对象作为接收者来调用。 |
| v18.2.0, v16.17.0 | 新增于: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

紧接在调度 `fetch` 请求之前的高分辨率毫秒时间戳。 如果资源未被 worker 拦截，则该属性将始终返回 0。

### `performanceResourceTiming.redirectStart` {#performanceresourcetimingredirectstart}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 此属性的 getter 必须以 `PerformanceResourceTiming` 对象作为接收者来调用。 |
| v18.2.0, v16.17.0 | 新增于: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

表示启动重定向的 fetch 开始时间的高分辨率毫秒时间戳。

### `performanceResourceTiming.redirectEnd` {#performanceresourcetimingredirectend}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 此属性的 getter 必须以 `PerformanceResourceTiming` 对象作为接收者来调用。 |
| v18.2.0, v16.17.0 | 新增于: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

接收到最后一个重定向的响应的最后一个字节后立即创建的高分辨率毫秒时间戳。


### `performanceResourceTiming.fetchStart` {#performanceresourcetimingfetchstart}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 此属性的 getter 必须以 `PerformanceResourceTiming` 对象作为接收者来调用。 |
| v18.2.0, v16.17.0 | 添加于: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js 开始获取资源之前的高精度毫秒时间戳。

### `performanceResourceTiming.domainLookupStart` {#performanceresourcetimingdomainlookupstart}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 此属性的 getter 必须以 `PerformanceResourceTiming` 对象作为接收者来调用。 |
| v18.2.0, v16.17.0 | 添加于: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js 开始为资源进行域名查找之前的高精度毫秒时间戳。

### `performanceResourceTiming.domainLookupEnd` {#performanceresourcetimingdomainlookupend}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 此属性的 getter 必须以 `PerformanceResourceTiming` 对象作为接收者来调用。 |
| v18.2.0, v16.17.0 | 添加于: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js 完成资源域名查找之后的高精度毫秒时间戳。

### `performanceResourceTiming.connectStart` {#performanceresourcetimingconnectstart}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 此属性的 getter 必须以 `PerformanceResourceTiming` 对象作为接收者来调用。 |
| v18.2.0, v16.17.0 | 添加于: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js 开始建立到服务器的连接以检索资源之前的高精度毫秒时间戳。


### `performanceResourceTiming.connectEnd` {#performanceresourcetimingconnectend}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 此属性的 getter 必须以 `PerformanceResourceTiming` 对象作为接收器来调用。 |
| v18.2.0, v16.17.0 | 添加于: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

高精度毫秒时间戳，表示 Node.js 完成建立与服务器的连接以检索资源后立即的时间。

### `performanceResourceTiming.secureConnectionStart` {#performanceresourcetimingsecureconnectionstart}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 此属性的 getter 必须以 `PerformanceResourceTiming` 对象作为接收器来调用。 |
| v18.2.0, v16.17.0 | 添加于: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

高精度毫秒时间戳，表示 Node.js 启动握手过程以保护当前连接安全之前立即的时间。

### `performanceResourceTiming.requestStart` {#performanceresourcetimingrequeststart}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 此属性的 getter 必须以 `PerformanceResourceTiming` 对象作为接收器来调用。 |
| v18.2.0, v16.17.0 | 添加于: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

高精度毫秒时间戳，表示 Node.js 从服务器接收到响应的第一个字节之前立即的时间。

### `performanceResourceTiming.responseEnd` {#performanceresourcetimingresponseend}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 此属性的 getter 必须以 `PerformanceResourceTiming` 对象作为接收器来调用。 |
| v18.2.0, v16.17.0 | 添加于: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

高精度毫秒时间戳，表示 Node.js 接收到资源的最后一个字节之后立即的时间，或者在传输连接关闭之前立即的时间，以先发生者为准。


### `performanceResourceTiming.transferSize` {#performanceresourcetimingtransfersize}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 必须使用 `PerformanceResourceTiming` 对象作为接收器来调用此属性的 getter。 |
| v18.2.0, v16.17.0 | 添加于: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

一个数字，表示获取的资源的大小（以八位字节为单位）。 该大小包括响应标头字段和响应有效负载主体。

### `performanceResourceTiming.encodedBodySize` {#performanceresourcetimingencodedbodysize}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 必须使用 `PerformanceResourceTiming` 对象作为接收器来调用此属性的 getter。 |
| v18.2.0, v16.17.0 | 添加于: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

一个数字，表示从获取（HTTP 或缓存）接收到的有效负载主体的大小（以八位字节为单位），在删除任何已应用的 content-coding 之前。

### `performanceResourceTiming.decodedBodySize` {#performanceresourcetimingdecodedbodysize}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 必须使用 `PerformanceResourceTiming` 对象作为接收器来调用此属性的 getter。 |
| v18.2.0, v16.17.0 | 添加于: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

一个数字，表示从获取（HTTP 或缓存）接收到的消息主体的大小（以八位字节为单位），在删除任何已应用的 content-coding 之后。

### `performanceResourceTiming.toJSON()` {#performanceresourcetimingtojson}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 必须使用 `PerformanceResourceTiming` 对象作为接收器来调用此方法。 |
| v18.2.0, v16.17.0 | 添加于: v18.2.0, v16.17.0 |
:::

返回一个 `object`，它是 `PerformanceResourceTiming` 对象的 JSON 表示形式

## 类: `PerformanceObserver` {#class-performanceobserver}

**添加于: v8.5.0**

### `PerformanceObserver.supportedEntryTypes` {#performanceobserversupportedentrytypes}

**添加于: v16.0.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

获取支持的类型。


### `new PerformanceObserver(callback)` {#new-performanceobservercallback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 向 `callback` 参数传递无效的回调现在会抛出 `ERR_INVALID_ARG_TYPE` 而不是 `ERR_INVALID_CALLBACK`。 |
| v8.5.0 | 添加于: v8.5.0 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `list` [\<PerformanceObserverEntryList\>](/zh/nodejs/api/perf_hooks#class-performanceobserverentrylist)
    - `observer` [\<PerformanceObserver\>](/zh/nodejs/api/perf_hooks#class-performanceobserver)
  
 

`PerformanceObserver` 对象在新的 `PerformanceEntry` 实例被添加到 Performance Timeline 时提供通知。



::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries());

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark'], buffered: true });

performance.mark('test');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries());

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark'], buffered: true });

performance.mark('test');
```
:::

由于 `PerformanceObserver` 实例引入了其自身额外的性能开销，因此实例不应无限期地订阅通知。 用户应在不再需要观察者时立即断开连接。

当 `PerformanceObserver` 被通知有关新的 `PerformanceEntry` 实例时，将调用 `callback`。 该回调接收一个 `PerformanceObserverEntryList` 实例和一个对 `PerformanceObserver` 的引用。

### `performanceObserver.disconnect()` {#performanceobserverdisconnect}

**添加于: v8.5.0**

将 `PerformanceObserver` 实例从所有通知中断开连接。


### `performanceObserver.observe(options)` {#performanceobserverobserveoptions}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v16.7.0 | 更新以符合 Performance Timeline Level 2。 已重新添加 buffered 选项。 |
| v16.0.0 | 更新以符合 User Timing Level 3。 已删除 buffered 选项。 |
| v8.5.0 | 添加于: v8.5.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 单个 [\<PerformanceEntry\>](/zh/nodejs/api/perf_hooks#class-performanceentry) 类型。 如果已指定 `entryTypes`，则不得给出。
    - `entryTypes` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 一个字符串数组，用于标识观察者感兴趣的 [\<PerformanceEntry\>](/zh/nodejs/api/perf_hooks#class-performanceentry) 实例的类型。 如果未提供，将抛出错误。
    - `buffered` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果为 true，则使用全局 `PerformanceEntry` 缓冲条目的列表调用观察者回调。 如果为 false，则只有在该时间点之后创建的 `PerformanceEntry` 被发送到观察者回调。 **默认值:** `false`。

将 [\<PerformanceObserver\>](/zh/nodejs/api/perf_hooks#class-performanceobserver) 实例订阅到由 `options.entryTypes` 或 `options.type` 标识的新 [\<PerformanceEntry\>](/zh/nodejs/api/perf_hooks#class-performanceentry) 实例的通知：

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((list, observer) => {
  // 异步调用一次。 `list` 包含三个项目。
});
obs.observe({ type: 'mark' });

for (let n = 0; n < 3; n++)
  performance.mark(`test${n}`);
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((list, observer) => {
  // 异步调用一次。 `list` 包含三个项目。
});
obs.observe({ type: 'mark' });

for (let n = 0; n < 3; n++)
  performance.mark(`test${n}`);
```
:::


### `performanceObserver.takeRecords()` {#performanceobservertakerecords}

**加入于: v16.0.0**

- 返回: [\<PerformanceEntry[]\>](/zh/nodejs/api/perf_hooks#class-performanceentry) 返回性能观察器中存储的当前条目列表，并将其清空。

## 类: `PerformanceObserverEntryList` {#class-performanceobserverentrylist}

**加入于: v8.5.0**

`PerformanceObserverEntryList` 类用于提供对传递给 `PerformanceObserver` 的 `PerformanceEntry` 实例的访问。此类的构造函数不对用户公开。

### `performanceObserverEntryList.getEntries()` {#performanceobserverentrylistgetentries}

**加入于: v8.5.0**

- 返回: [\<PerformanceEntry[]\>](/zh/nodejs/api/perf_hooks#class-performanceentry)

返回 `PerformanceEntry` 对象的列表，该列表按 `performanceEntry.startTime` 依时间顺序排列。

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntries());
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 81.465639,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 81.860064,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntries());
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 81.465639,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 81.860064,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```
:::


### `performanceObserverEntryList.getEntriesByName(name[, type])` {#performanceobserverentrylistgetentriesbynamename-type}

**添加于: v8.5.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<PerformanceEntry[]\>](/zh/nodejs/api/perf_hooks#class-performanceentry)

返回一个 `PerformanceEntry` 对象列表，这些对象按照 `performanceEntry.startTime` 的时间顺序排列，并且其 `performanceEntry.name` 等于 `name`，并且（可选地）其 `performanceEntry.entryType` 等于 `type`。

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByName('meow'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 98.545991,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('nope')); // []

  console.log(perfObserverList.getEntriesByName('test', 'mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 63.518931,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('test', 'measure')); // []

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark', 'measure'] });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByName('meow'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 98.545991,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('nope')); // []

  console.log(perfObserverList.getEntriesByName('test', 'mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 63.518931,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('test', 'measure')); // []

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark', 'measure'] });

performance.mark('test');
performance.mark('meow');
```
:::


### `performanceObserverEntryList.getEntriesByType(type)` {#performanceobserverentrylistgetentriesbytypetype}

**添加于: v8.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<PerformanceEntry[]\>](/zh/nodejs/api/perf_hooks#class-performanceentry)

返回一个 `PerformanceEntry` 对象的列表，列表中的对象按 `performanceEntry.startTime` 升序排列，且 `performanceEntry.entryType` 等于 `type`。

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByType('mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 55.897834,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 56.350146,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByType('mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 55.897834,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 56.350146,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```
:::

## `perf_hooks.createHistogram([options])` {#perf_hookscreatehistogramoptions}

**添加于: v15.9.0, v14.18.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `lowest` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 最低可辨识值。必须是大于 0 的整数值。**默认:** `1`。
    - `highest` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 最高可记录值。必须是大于或等于 `lowest` 两倍的整数值。**默认:** `Number.MAX_SAFE_INTEGER`。
    - `figures` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 精度位数。必须是 `1` 到 `5` 之间的数字。**默认:** `3`。
  
 
- 返回: [\<RecordableHistogram\>](/zh/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram)

返回一个 [\<RecordableHistogram\>](/zh/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram)。


## `perf_hooks.monitorEventLoopDelay([options])` {#perf_hooksmonitoreventloopdelayoptions}

**加入于: v11.10.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `resolution` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 采样率，以毫秒为单位。必须大于零。**默认值:** `10`。
  
 
- 返回: [\<IntervalHistogram\>](/zh/nodejs/api/perf_hooks#class-intervalhistogram-extends-histogram)

*此属性是 Node.js 的扩展。它在 Web 浏览器中不可用。*

创建一个 `IntervalHistogram` 对象，该对象对事件循环延迟进行采样并随时间报告。延迟将以纳秒为单位报告。

使用计时器检测近似事件循环延迟之所以有效，是因为计时器的执行与 libuv 事件循环的生命周期密切相关。 也就是说，循环中的延迟会导致计时器执行的延迟，而这些延迟正是此 API 旨在检测的。

::: code-group
```js [ESM]
import { monitorEventLoopDelay } from 'node:perf_hooks';

const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
// 做一些事情。
h.disable();
console.log(h.min);
console.log(h.max);
console.log(h.mean);
console.log(h.stddev);
console.log(h.percentiles);
console.log(h.percentile(50));
console.log(h.percentile(99));
```

```js [CJS]
const { monitorEventLoopDelay } = require('node:perf_hooks');
const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
// 做一些事情。
h.disable();
console.log(h.min);
console.log(h.max);
console.log(h.mean);
console.log(h.stddev);
console.log(h.percentiles);
console.log(h.percentile(50));
console.log(h.percentile(99));
```
:::

## 类: `Histogram` {#class-histogram}

**加入于: v11.10.0**

### `histogram.count` {#histogramcount}

**加入于: v17.4.0, v16.14.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

直方图记录的样本数。

### `histogram.countBigInt` {#histogramcountbigint}

**加入于: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

直方图记录的样本数。


### `histogram.exceeds` {#histogramexceeds}

**加入于: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

事件循环延迟超过最大 1 小时事件循环延迟阈值的次数。

### `histogram.exceedsBigInt` {#histogramexceedsbigint}

**加入于: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

事件循环延迟超过最大 1 小时事件循环延迟阈值的次数。

### `histogram.max` {#histogrammax}

**加入于: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

记录的最大事件循环延迟。

### `histogram.maxBigInt` {#histogrammaxbigint}

**加入于: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

记录的最大事件循环延迟。

### `histogram.mean` {#histogrammean}

**加入于: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

记录的事件循环延迟的平均值。

### `histogram.min` {#histogrammin}

**加入于: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

记录的最小事件循环延迟。

### `histogram.minBigInt` {#histogramminbigint}

**加入于: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

记录的最小事件循环延迟。

### `histogram.percentile(percentile)` {#histogrampercentilepercentile}

**加入于: v11.10.0**

- `percentile` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 一个在 (0, 100] 范围内的百分位数。
- 返回: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

返回给定百分位的值。

### `histogram.percentileBigInt(percentile)` {#histogrampercentilebigintpercentile}

**加入于: v17.4.0, v16.14.0**

- `percentile` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 一个在 (0, 100] 范围内的百分位数。
- 返回: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

返回给定百分位的值。


### `histogram.percentiles` {#histogrampercentiles}

**新增于: v11.10.0**

- [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

返回一个 `Map` 对象，详细描述了累积的百分位数分布。

### `histogram.percentilesBigInt` {#histogrampercentilesbigint}

**新增于: v17.4.0, v16.14.0**

- [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

返回一个 `Map` 对象，详细描述了累积的百分位数分布。

### `histogram.reset()` {#histogramreset}

**新增于: v11.10.0**

重置收集的直方图数据。

### `histogram.stddev` {#histogramstddev}

**新增于: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

记录的事件循环延迟的标准偏差。

## 类: `IntervalHistogram extends Histogram` {#class-intervalhistogram-extends-histogram}

一个 `Histogram`，它按照给定的时间间隔定期更新。

### `histogram.disable()` {#histogramdisable}

**新增于: v11.10.0**

- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

禁用更新间隔计时器。 如果计时器已停止，则返回 `true`，如果已停止，则返回 `false`。

### `histogram.enable()` {#histogramenable}

**新增于: v11.10.0**

- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

启用更新间隔计时器。 如果计时器已启动，则返回 `true`，如果已启动，则返回 `false`。

### 克隆 `IntervalHistogram` {#cloning-an-intervalhistogram}

[\<IntervalHistogram\>](/zh/nodejs/api/perf_hooks#class-intervalhistogram-extends-histogram) 实例可以通过 [\<MessagePort\>](/zh/nodejs/api/worker_threads#class-messageport) 进行克隆。 在接收端，直方图被克隆为一个普通的 [\<Histogram\>](/zh/nodejs/api/perf_hooks#class-histogram) 对象，该对象不实现 `enable()` 和 `disable()` 方法。

## 类: `RecordableHistogram extends Histogram` {#class-recordablehistogram-extends-histogram}

**新增于: v15.9.0, v14.18.0**

### `histogram.add(other)` {#histogramaddother}

**新增于: v17.4.0, v16.14.0**

- `other` [\<RecordableHistogram\>](/zh/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram)

将 `other` 中的值添加到此直方图中。


### `histogram.record(val)` {#histogramrecordval}

**加入于: v15.9.0, v14.18.0**

- `val` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 要记录在直方图中的数量。

### `histogram.recordDelta()` {#histogramrecorddelta}

**加入于: v15.9.0, v14.18.0**

计算自上次调用 `recordDelta()` 以来经过的时间（以纳秒为单位），并将该数量记录在直方图中。

## 例子 {#examples}

### 测量异步操作的持续时间 {#measuring-the-duration-of-async-operations}

以下示例使用 [Async Hooks](/zh/nodejs/api/async_hooks) 和 Performance API 来测量 Timeout 操作的实际持续时间（包括执行回调所花费的时间）。

::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';
import { performance, PerformanceObserver } from 'node:perf_hooks';

const set = new Set();
const hook = createHook({
  init(id, type) {
    if (type === 'Timeout') {
      performance.mark(`Timeout-${id}-Init`);
      set.add(id);
    }
  },
  destroy(id) {
    if (set.has(id)) {
      set.delete(id);
      performance.mark(`Timeout-${id}-Destroy`);
      performance.measure(`Timeout-${id}`,
                          `Timeout-${id}-Init`,
                          `Timeout-${id}-Destroy`);
    }
  },
});
hook.enable();

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries()[0]);
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['measure'], buffered: true });

setTimeout(() => {}, 1000);
```

```js [CJS]
'use strict';
const async_hooks = require('node:async_hooks');
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const set = new Set();
const hook = async_hooks.createHook({
  init(id, type) {
    if (type === 'Timeout') {
      performance.mark(`Timeout-${id}-Init`);
      set.add(id);
    }
  },
  destroy(id) {
    if (set.has(id)) {
      set.delete(id);
      performance.mark(`Timeout-${id}-Destroy`);
      performance.measure(`Timeout-${id}`,
                          `Timeout-${id}-Init`,
                          `Timeout-${id}-Destroy`);
    }
  },
});
hook.enable();

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries()[0]);
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['measure'], buffered: true });

setTimeout(() => {}, 1000);
```
:::


### 测量加载依赖项所需的时间 {#measuring-how-long-it-takes-to-load-dependencies}

以下示例测量 `require()` 操作加载依赖项的持续时间：

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

// 激活观察者
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`import('${entry[0]}')`, entry.duration);
  });
  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'], buffered: true });

const timedImport = performance.timerify(async (module) => {
  return await import(module);
});

await timedImport('some-module');
```

```js [CJS]
'use strict';
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');
const mod = require('node:module');

// Monkey patch the require function
mod.Module.prototype.require =
  performance.timerify(mod.Module.prototype.require);
require = performance.timerify(require);

// 激活观察者
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`require('${entry[0]}')`, entry.duration);
  });
  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'], buffered: true });

require('some-module');
```
:::

### 测量一次 HTTP 往返所需的时间 {#measuring-how-long-one-http-round-trip-takes}

以下示例用于跟踪 HTTP 客户端 (`OutgoingMessage`) 和 HTTP 请求 (`IncomingMessage`) 花费的时间。对于 HTTP 客户端，它意味着启动请求和接收响应之间的时间间隔，对于 HTTP 请求，它意味着接收请求和发送响应之间的时间间隔：

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { createServer, get } from 'node:http';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});

obs.observe({ entryTypes: ['http'] });

const PORT = 8080;

createServer((req, res) => {
  res.end('ok');
}).listen(PORT, () => {
  get(`http://127.0.0.1:${PORT}`);
});
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const http = require('node:http');

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});

obs.observe({ entryTypes: ['http'] });

const PORT = 8080;

http.createServer((req, res) => {
  res.end('ok');
}).listen(PORT, () => {
  http.get(`http://127.0.0.1:${PORT}`);
});
```
:::


### 测量 `net.connect` 花费的时间 (仅适用于 TCP)，当连接成功时 {#measuring-how-long-the-netconnect-only-for-tcp-takes-when-the-connection-is-successful}

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { connect, createServer } from 'node:net';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['net'] });
const PORT = 8080;
createServer((socket) => {
  socket.destroy();
}).listen(PORT, () => {
  connect(PORT);
});
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const net = require('node:net');
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['net'] });
const PORT = 8080;
net.createServer((socket) => {
  socket.destroy();
}).listen(PORT, () => {
  net.connect(PORT);
});
```
:::

### 测量当请求成功时 DNS 花费的时间 {#measuring-how-long-the-dns-takes-when-the-request-is-successful}

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { lookup, promises } from 'node:dns';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['dns'] });
lookup('localhost', () => {});
promises.resolve('localhost');
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const dns = require('node:dns');
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['dns'] });
dns.lookup('localhost', () => {});
dns.promises.resolve('localhost');
```
:::

