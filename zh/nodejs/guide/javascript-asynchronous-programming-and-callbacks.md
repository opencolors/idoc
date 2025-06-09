---
title: JavaScript 异步编程和回调函数
description: JavaScript 默认是同步的，但它可以通过回调函数处理异步操作。回调函数是作为参数传递给其他函数，并在特定事件发生时执行的函数。
head:
  - - meta
    - name: og:title
      content: JavaScript 异步编程和回调函数 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: JavaScript 默认是同步的，但它可以通过回调函数处理异步操作。回调函数是作为参数传递给其他函数，并在特定事件发生时执行的函数。
  - - meta
    - name: twitter:title
      content: JavaScript 异步编程和回调函数 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: JavaScript 默认是同步的，但它可以通过回调函数处理异步操作。回调函数是作为参数传递给其他函数，并在特定事件发生时执行的函数。
---


# JavaScript 异步编程和回调

## 编程语言中的异步性
计算机在设计上是异步的。

异步意味着事情可以独立于主程序流程发生。

在当前的消费级计算机中，每个程序运行一个特定的时间片，然后停止执行，让另一个程序继续执行。这个过程循环进行得非常快，以至于无法注意到。我们认为我们的计算机同时运行多个程序，但这是一种错觉（在多处理器机器上除外）。

程序内部使用中断，中断是一种发送给处理器的信号，以引起系统的注意。

现在我们不深入探讨其内部原理，只需记住程序异步并暂停执行直到需要引起注意，同时允许计算机执行其他操作是很正常的。当程序等待来自网络的响应时，它不能停止处理器，直到请求完成。

通常，编程语言是同步的，有些编程语言提供了一种在语言中或通过库管理异步性的方法。C、Java、C#、PHP、Go、Ruby、Swift 和 Python 默认都是同步的。其中一些通过使用线程、生成新进程来处理异步操作。

## JavaScript
JavaScript 默认是**同步的**并且是单线程的。这意味着代码无法创建新线程并并行运行。

代码行按顺序一个接一个地执行，例如：

```js
const a = 1;
const b = 2;
const c = a * b;
console.log(c);
doSomething();
```

但是 JavaScript 诞生于浏览器中，它最初的主要工作是响应用户操作，例如 `onClick`、`onMouseOver`、`onChange`、`onSubmit` 等等。它如何使用同步编程模型来实现这一点？

答案在于它的环境。**浏览器**提供了一种通过提供一组可以处理此类功能的 API 来实现此目的的方法。

最近，Node.js 引入了一个非阻塞 I/O 环境，以将这个概念扩展到文件访问、网络调用等等。


## 回调
你无法预知用户何时会点击按钮。因此，你需要为 click 事件定义一个事件处理程序。此事件处理程序接受一个函数，该函数将在事件触发时被调用：

```js
document.getElementById('button').addEventListener('click', () => {
  // 项目被点击
});
```

这就是所谓的**回调**。

回调是一个简单的函数，它作为值传递给另一个函数，并且只会在事件发生时执行。我们可以这样做是因为 JavaScript 具有头等函数，可以将其分配给变量并传递给其他函数（称为**高阶函数**）。

通常的做法是将所有客户端代码包装在 **window** 对象上的 **load** 事件监听器中，该监听器仅在页面准备就绪时运行回调函数：

```js
window.addEventListener('load', () => {
  // 窗口已加载
  // 做你想做的事
});
```

回调无处不在，不仅仅是在 DOM 事件中。

一个常见的例子是使用定时器：

```js
setTimeout(() => {
  // 2 秒后运行
}, 2000);
```

XHR 请求也接受回调，在此示例中，通过将一个函数分配给一个属性，该函数将在特定事件发生时被调用（在本例中，是请求的状态发生变化）：

```js
const xhr = new XMLHttpRequest();
xhr.onreadystatechange = () => {
  if (xhr.readyState === 4) {
    xhr.status === 200 ? console.log(xhr.responseText) : console.error('error');
  }
};
xhr.open('GET', 'https://yoursite.com');
xhr.send();
```

## 回调中的错误处理
如何在回调中处理错误？一种非常常见的策略是使用 Node.js 采用的策略：任何回调函数中的第一个参数都是错误对象：error-first callbacks（错误优先回调）。

如果没有错误，则该对象为 null。 如果存在错误，则它包含错误的某些描述和其他信息。

```js
const fs = require('node:fs');
fs.readFile('/file.json', (err, data) => {
  if (err) {
    // 处理错误
    console.log(err);
    return;
  }
  // 没有错误，处理数据
  console.log(data);
});
```


## 回调的问题
回调在简单情况下非常有用！

然而，每个回调都会增加一层嵌套，当您有大量回调时，代码会很快变得复杂：

```js
window.addEventListener('load', () => {
  document.getElementById('button').addEventListener('click', () => {
    setTimeout(() => {
      items.forEach(item => {
        // 你的代码
      });
    }, 2000);
  });
});
```

这只是一个简单的 4 层代码，但我见过更多层嵌套的代码，这并不有趣。

我们如何解决这个问题？

## 回调的替代方案
从 ES6 开始，JavaScript 引入了一些特性来帮助我们处理异步代码，而无需使用回调：`Promises` (ES6) 和 `Async/Await` (ES2017)。

