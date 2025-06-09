---
title: Node.js 中的阻塞和非阻塞
description: 本文解释了 Node.js 中阻塞和非阻塞调用的区别，包括对事件循环和并发性的影响。
head:
  - - meta
    - name: og:title
      content: Node.js 中的阻塞和非阻塞 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 本文解释了 Node.js 中阻塞和非阻塞调用的区别，包括对事件循环和并发性的影响。
  - - meta
    - name: twitter:title
      content: Node.js 中的阻塞和非阻塞 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 本文解释了 Node.js 中阻塞和非阻塞调用的区别，包括对事件循环和并发性的影响。
---


# 阻塞与非阻塞概述

本概述涵盖了 Node.js 中阻塞和非阻塞调用的区别。本概述将涉及事件循环和 libuv，但不需要事先了解这些主题。假定读者对 JavaScript 语言和 Node.js [回调模式](/zh/nodejs/guide/javascript-asynchronous-programming-and-callbacks) 有基本的了解。

::: info
“I/O”主要指与系统磁盘和网络交互，由 [libuv](https://libuv.org/) 支持。
:::

## 阻塞

**阻塞**是指 Node.js 进程中其他 JavaScript 代码的执行必须等到非 JavaScript 操作完成后才能继续。发生这种情况是因为在 **阻塞** 操作发生时，事件循环无法继续运行 JavaScript。

在 Node.js 中，由于 CPU 密集型而不是等待非 JavaScript 操作（如 I/O）而表现出性能不佳的 JavaScript 通常不被称为 **阻塞**。Node.js 标准库中使用 libuv 的同步方法是最常用的 **阻塞** 操作。原生模块也可能具有 **阻塞** 方法。

Node.js 标准库中的所有 I/O 方法都提供异步版本，这些版本是 **非阻塞** 的，并接受回调函数。某些方法还具有 **阻塞** 的对应方法，其名称以 `Sync` 结尾。

## 代码比较

**阻塞** 方法以**同步**方式执行，**非阻塞** 方法以**异步**方式执行。

以文件系统模块为例，这是一个 **同步** 文件读取：

```js
const fs = require('node:fs')
const data = fs.readFileSync('/file.md') // 在读取文件之前在此处阻塞
```

这是一个等效的 **异步** 示例：

```js
const fs = require('node:fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
})
```

第一个示例看起来比第二个示例更简单，但缺点是第二行会 **阻塞** 任何其他 JavaScript 代码的执行，直到整个文件被读取完毕。请注意，在同步版本中，如果抛出错误，则需要捕获该错误，否则进程将崩溃。在异步版本中，由作者决定是否应该抛出错误，如所示。

让我们稍微扩展一下我们的示例：

```js
const fs = require('node:fs')
const data = fs.readFileSync('/file.md') // 在读取文件之前在此处阻塞
console.log(data)
moreWork() // 将在 console.log 之后运行
```

这是一个类似但不等效的异步示例：

```js
const fs = require('node:fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
  console.log(data)
})
moreWork() // 将在 console.log 之前运行
```

在上面的第一个示例中，`console.log` 将在 `moreWork()` 之前调用。在第二个示例中，`fs.readFile()` 是 **非阻塞** 的，因此 JavaScript 代码可以继续执行，并且 `moreWork()` 将首先被调用。能够在不等待文件读取完成的情况下运行 `moreWork()` 是一个关键的设计选择，可以实现更高的吞吐量。


## 并发和吞吐量

Node.js 中的 JavaScript 执行是单线程的，因此并发指的是事件循环在完成其他工作后执行 JavaScript 回调函数的能力。 任何期望以并发方式运行的代码都必须允许事件循环在发生非 JavaScript 操作（如 I/O）时继续运行。

例如，让我们考虑这样一种情况：Web 服务器的每个请求需要 50 毫秒才能完成，其中 45 毫秒是可以异步完成的数据库 I/O。 选择非阻塞异步操作可以为每个请求释放 45 毫秒来处理其他请求。 仅仅通过选择使用非阻塞方法而不是阻塞方法，这是一个容量上的显著差异。

事件循环不同于许多其他语言中的模型，在这些模型中，可能会创建额外的线程来处理并发工作。

## 混合使用阻塞和非阻塞代码的危险

在处理 I/O 时，应该避免一些模式。 让我们看一个例子：

```js
const fs = require('node:fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
  console.log(data)
})
fs.unlinkSync('/file.md')
```

在上面的例子中，`fs.unlinkSync()` 很可能在 `fs.readFile()` 之前运行，这会在实际读取 `file.md` 之前将其删除。 一个更好的写法是完全非阻塞的，并且保证以正确的顺序执行：

```js
const fs = require('node:fs')
fs.readFile('/file.md', (readFileErr, data) => {
  if (readFileErr) throw readFileErr
  console.log(data)
  fs.unlink('/file.md', unlinkErr => {
    if (unlinkErr) throw unlinkErr
  })
})
```

上面在 `fs.readFile()` 的回调中放置了一个对 `fs.unlink()` 的**非阻塞**调用，这保证了操作的正确顺序。

