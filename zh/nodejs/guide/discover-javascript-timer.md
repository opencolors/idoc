---
title: JavaScript 计时器：setTimeout 和 setInterval
description: 了解如何使用 JavaScript 计时器来延迟函数执行和使用 setTimeout 和 setInterval 计划任务。
head:
  - - meta
    - name: og:title
      content: JavaScript 计时器：setTimeout 和 setInterval | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解如何使用 JavaScript 计时器来延迟函数执行和使用 setTimeout 和 setInterval 计划任务。
  - - meta
    - name: twitter:title
      content: JavaScript 计时器：setTimeout 和 setInterval | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解如何使用 JavaScript 计时器来延迟函数执行和使用 setTimeout 和 setInterval 计划任务。
---


# 探索 JavaScript 定时器

### `setTimeout()`

在编写 JavaScript 代码时，您可能希望延迟函数的执行。

这就是 `setTimeout` 的工作。您可以指定一个回调函数稍后执行，并指定一个值（以毫秒为单位）来表示您希望它在多长时间后运行：

```js
setTimeout(() => {
  // 2 秒后运行
}, 2000);
setTimeout(() => {
  // 50 毫秒后运行
}, 50);
```

此语法定义了一个新函数。您可以在其中调用您想要的任何其他函数，或者您可以传递一个现有的函数名称和一组参数：

```js
const myFunction = (firstParam, secondParam) => {
  // 做一些事情
};
// 2 秒后运行
setTimeout(myFunction, 2000, firstParam, secondParam);
```

`setTimeout` 返回计时器 ID。通常不使用它，但您可以存储此 ID，如果想要删除此计划的函数执行，可以清除它：

```js
const id = setTimeout(() => {
  // 应该在 2 秒后运行
}, 2000);
// 我改变主意了
clearTimeout(id);
```

## 零延迟

如果将超时延迟指定为 0，则回调函数将尽快执行，但在当前函数执行之后：

```js
setTimeout(() => {
  console.log('after ');
}, 0);
console.log(' before ');
```

这段代码会打印

```bash
before
after
```

这对于避免在密集任务中阻塞 CPU，并通过在调度程序中排队函数来让其他函数在执行繁重计算时执行特别有用。

::: tip
某些浏览器（IE 和 Edge）实现了一个 `setImmediate()` 方法，该方法执行完全相同的功能，但它不是标准方法，并且 [在其他浏览器上不可用](https://caniuse.com/#feat=setimmediate)。但它是 Node.js 中的一个标准函数。
:::

### `setInterval()`

`setInterval` 是一个类似于 `setTimeout` 的函数，但有一个区别：它不会只运行一次回调函数，而是会在您指定的特定时间间隔（以毫秒为单位）永久运行：

```js
setInterval(() => {
  // 每 2 秒运行一次
}, 2000);
```

上面的函数每 2 秒运行一次，除非您使用 `clearInterval` 告诉它停止，并将 `setInterval` 返回的间隔 ID 传递给它：

```js
const id = setInterval(() => {
  // 每 2 秒运行一次
}, 2000);
// 我改变主意了
clearInterval(id);
```

通常在 `setInterval` 回调函数中调用 `clearInterval`，以让它自动确定是否应该再次运行或停止。例如，此代码运行某些内容，除非 App.somethingIWait 具有已到达的值：


## 递归 setTimeout

`setInterval` 每隔 n 毫秒启动一个函数，而不考虑函数何时完成其执行。

如果一个函数总是花费相同的时间，那就没问题。

也许函数会花费不同的执行时间，这取决于网络状况。

并且可能一次长时间的执行会与下一次重叠。

为了避免这种情况，你可以安排一个递归的 setTimeout，在回调函数完成后被调用：

```js
const myFunction = () => {
  // 做一些事情
  setTimeout(myFunction, 1000);
};
setTimeout(myFunction, 1000);
```

`setTimeout` 和 `setInterval` 在 Node.js 中可用，通过 [Timers 模块](/zh/nodejs/api/timers)。

Node.js 还提供了 `setImmediate()`，它等同于使用 `setTimeout(() => {}, 0)`，主要用于与 Node.js 事件循环一起工作。

