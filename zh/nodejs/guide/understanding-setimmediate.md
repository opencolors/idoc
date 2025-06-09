---
title: 理解 Node.js 中的 setImmediate()
description: 了解 Node.js 中 setImmediate() 的工作原理、与 setTimeout()、process.nextTick() 和 Promise.then() 的区别，以及如何与事件循环和队列交互。
head:
  - - meta
    - name: og:title
      content: 理解 Node.js 中的 setImmediate() | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解 Node.js 中 setImmediate() 的工作原理、与 setTimeout()、process.nextTick() 和 Promise.then() 的区别，以及如何与事件循环和队列交互。
  - - meta
    - name: twitter:title
      content: 理解 Node.js 中的 setImmediate() | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解 Node.js 中 setImmediate() 的工作原理、与 setTimeout()、process.nextTick() 和 Promise.then() 的区别，以及如何与事件循环和队列交互。
---


# 理解 `setImmediate()`

当你想异步执行一些代码，并且尽快执行时，一个选择是使用 Node.js 提供的 `setImmediate()` 函数：

```js
setImmediate(() => {
    // 做一些事情
})
```

任何作为 `setImmediate()` 参数传递的函数都是一个回调函数，它会在事件循环的下一次迭代中执行。

`setImmediate()` 与 `setTimeout(() => {}, 0)` (传递一个 0 毫秒的超时时间)，以及 `process.nextTick()` 和 `Promise.then()` 有何不同？

传递给 `process.nextTick()` 的函数将在事件循环的当前迭代中，在当前操作结束后执行。这意味着它总是会在 `setTimeout` 和 `setImmediate` 之前执行。

具有 0 毫秒延迟的 `setTimeout()` 回调函数与 `setImmediate()` 非常相似。执行顺序将取决于各种因素，但它们都将在事件循环的下一次迭代中运行。

`process.nextTick` 回调函数被添加到 **process.nextTick 队列**。`Promise.then()` 回调函数被添加到 promise **微任务队列**。`setTimeout`，`setImmediate` 回调函数被添加到 **宏任务队列**。

事件循环首先执行 **process.nextTick 队列** 中的任务，然后执行 **promise 微任务队列**，最后执行 `setTimeout` 或 `setImmediate` **宏任务队列**。

这是一个展示 `setImmediate()`、`process.nextTick()` 和 `Promise.then()` 之间顺序的例子：

```js
const baz = () => console.log('baz');
const foo = () => console.log('foo');
const zoo = () => console.log('zoo');
const start = () => {
  console.log('start');
  setImmediate(baz);
  new Promise((resolve, reject) => {
    resolve('bar');
  }).then(resolve => {
    console.log(resolve);
    process.nextTick(zoo);
  });
  process.nextTick(foo);
};
start();
// start foo bar zoo baz
```

这段代码首先调用 `start()`，然后在 **process.nextTick 队列** 中调用 `foo()`。之后，它将处理 **promise 微任务队列**，这会打印 bar 并在同时在 **process.nextTick 队列** 中添加 `zoo()`。然后它将调用刚刚添加的 `zoo()`。最后，调用 **宏任务队列** 中的 `baz()`。

上述原则在 CommonJS 情况下是成立的，但请记住在 ES Modules 中，例如 `mjs` 文件，执行顺序将有所不同：

```js
// start bar foo zoo baz
```

这是因为加载的 ES Module 被包装为一个异步操作，因此整个脚本实际上已经在 `promise 微任务队列` 中。所以当 promise 被立即 resolve 时，它的回调会被附加到 `微任务队列`。Node.js 将尝试清除队列，直到移动到任何其他队列，因此你会看到它首先输出 bar。

