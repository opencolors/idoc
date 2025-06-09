---
title: 理解 Node.js 中的 process.nextTick()
description: 了解 Node.js 中 process.nextTick() 的工作原理及其与 setImmediate() 和 setTimeout() 的区别。了解事件循环并学习如何使用 nextTick() 异步执行代码。
head:
  - - meta
    - name: og:title
      content: 理解 Node.js 中的 process.nextTick() | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解 Node.js 中 process.nextTick() 的工作原理及其与 setImmediate() 和 setTimeout() 的区别。了解事件循环并学习如何使用 nextTick() 异步执行代码。
  - - meta
    - name: twitter:title
      content: 理解 Node.js 中的 process.nextTick() | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解 Node.js 中 process.nextTick() 的工作原理及其与 setImmediate() 和 setTimeout() 的区别。了解事件循环并学习如何使用 nextTick() 异步执行代码。
---


# 理解 `process.nextTick()`

当您尝试理解 Node.js 事件循环时，其中一个重要的组成部分是 `process.nextTick()`。事件循环每完整地循环一次，我们称之为一次 tick。

当我们把一个函数传递给 process.nextTick() 时，我们指示引擎在当前操作结束时，在下一个事件循环 tick 开始之前调用此函数：

```js
process.nextTick(() => {
  // 做一些事情
})
```

事件循环正忙于处理当前的函数代码。当此操作结束时，JS 引擎会运行在此操作期间传递给 `nextTick` 调用的所有函数。

这是我们告诉 JS 引擎异步处理函数（在当前函数之后）的一种方式，但要尽快处理，而不是将其放入队列。

调用 `setTimeout(() => {}, 0)` 将在下一个 tick 的末尾执行该函数，比使用 `nextTick()` 要晚得多，`nextTick()` 会优先处理该调用，并在下一个 tick 开始之前执行它。

当您想确保在下一个事件循环迭代中代码已经被执行时，请使用 `nextTick()`。

## 事件顺序示例：

```js
console.log('Hello => number 1')
setImmediate(() => {
  console.log('Running before the timeout => number 3')
})
setTimeout(() => {
  console.log('The timeout running last => number 4')
}, 0)
process.nextTick(() => {
  console.log('Running at next tick => number 2')
})
```

## 示例输出：

```bash
Hello => number 1
Running at next tick => number 2
Running before the timeout => number 3
The timeout running last => number 4
```

确切的输出可能因运行而异。

