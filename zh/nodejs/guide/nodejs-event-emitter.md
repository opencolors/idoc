---
title: Node.js 事件触发器
description: 了解 Node.js 事件触发器，后端应用程序处理事件的强大工具。
head:
  - - meta
    - name: og:title
      content: Node.js 事件触发器 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解 Node.js 事件触发器，后端应用程序处理事件的强大工具。
  - - meta
    - name: twitter:title
      content: Node.js 事件触发器 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解 Node.js 事件触发器，后端应用程序处理事件的强大工具。
---


# Node.js 事件发射器

如果你曾在浏览器中使用 JavaScript，你一定了解用户的交互操作很大一部分是通过事件来处理的：鼠标点击、键盘按键、对鼠标移动做出反应等等。

在后端，Node.js 提供了使用 **[events 模块](/zh/nodejs/api/events)** 构建类似系统的选项。

特别是，该模块提供了 EventEmitter 类，我们将使用它来处理我们的事件。

你可以使用以下方式进行初始化：

```js
import EventEmitter from 'node:events';
const eventEmitter = new EventEmitter();
```

此对象公开了 `on` 和 `emit` 方法，以及许多其他方法。

- `emit` 用于触发一个事件
- `on` 用于添加一个回调函数，该函数将在事件被触发时执行

例如，让我们创建一个 `start` 事件，并提供一个示例，我们通过将其记录到控制台来对此做出反应：

```js
eventEmitter.on('start', () => {
  console.log('started');
});
```

当我们运行

```js
eventEmitter.emit('start');
```

事件处理函数被触发，我们得到控制台日志。

你可以通过将参数作为额外的参数传递给 `emit()` 来将参数传递给事件处理程序：

```js
eventEmitter.on('start', number => {
  console.log(`started ${number}`);
});
eventEmitter.emit('start', 23);
```

多个参数：

```js
eventEmitter.on('start', (start, end) => {
  console.log(`started from ${start} to ${end}`);
});
eventEmitter.emit('start', 1, 100);
```

EventEmitter 对象还公开了其他几种与事件交互的方法，例如

- `once()`：添加一个一次性监听器
- `removeListener()` / `off()`：从事件中删除事件监听器
- `removeAllListeners()`：删除事件的所有监听器

你可以在 [events 模块文档](/zh/nodejs/api/events) 中阅读有关这些方法的更多信息。

