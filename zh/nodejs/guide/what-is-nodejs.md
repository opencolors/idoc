---
title: Node.js 介绍
description: Node.js 是一个开源、跨平台的 JavaScript 运行时环境，允许开发者在服务器端运行 JavaScript，提供高性能和可扩展性。
head:
  - - meta
    - name: og:title
      content: Node.js 介绍 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 是一个开源、跨平台的 JavaScript 运行时环境，允许开发者在服务器端运行 JavaScript，提供高性能和可扩展性。
  - - meta
    - name: twitter:title
      content: Node.js 介绍 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 是一个开源、跨平台的 JavaScript 运行时环境，允许开发者在服务器端运行 JavaScript，提供高性能和可扩展性。
---


# Node.js 简介

Node.js 是一个开源且跨平台的 JavaScript 运行时环境。 它几乎适用于任何类型的项目，是一个流行的工具！

Node.js 在浏览器之外运行 V8 JavaScript 引擎，也就是 Google Chrome 的核心。 这使得 Node.js 具有非常高的性能。

Node.js 应用程序在单个进程中运行，而不会为每个请求创建一个新线程。 Node.js 在其标准库中提供了一组异步 I/O 原语，以防止 JavaScript 代码阻塞。 通常，Node.js 中的库使用非阻塞范例编写，使得阻塞行为成为例外而不是常态。

当 Node.js 执行 I/O 操作时，例如从网络读取、访问数据库或文件系统，Node.js 不会阻塞线程并浪费 CPU 周期等待，而是在响应返回时恢复操作。

这使得 Node.js 能够在单个服务器上处理数千个并发连接，而不会引入管理线程并发的负担，而线程并发可能是 bug 的一个重要来源。

Node.js 具有独特的优势，因为数百万为浏览器编写 JavaScript 的前端开发人员现在除了客户端代码之外，还能够编写服务器端代码，而无需学习一种完全不同的语言。

在 Node.js 中，可以毫无问题地使用新的 ECMAScript 标准，因为您不必等待所有用户更新他们的浏览器 - 您可以通过更改 Node.js 版本来决定使用哪个 ECMAScript 版本，并且还可以通过使用标志运行 Node.js 来启用特定的实验性功能。

## 一个 Node.js 应用程序示例

最常见的 Node.js Hello World 示例是一个 Web 服务器：

```js
import { createServer } from 'node:http'
const hostname = '127.0.0.1'
const port = 3000
const server = createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World')
})
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
```

要运行此代码片段，请将其另存为 `server.js` 文件，然后在终端中运行 `node server.js`。 如果您使用代码的 mjs 版本，则应将其另存为 `server.mjs` 文件，然后在终端中运行 `node server.mjs`。

此代码首先包含 Node.js 的 [http 模块](/zh/nodejs/api/http)。

Node.js 有一个很棒的 [标准库](/zh/nodejs/api/synopsis)，包括对网络的一流支持。

`http` 的 `createServer()` 方法创建一个新的 HTTP 服务器并返回它。

服务器设置为侦听指定的端口和主机名。 当服务器准备就绪时，将调用回调函数，在本例中，它会通知我们服务器正在运行。

每当收到新请求时，都会调用 [request 事件](/zh/nodejs/api/http)，从而提供两个对象：一个请求（一个 `http.IncomingMessage` 对象）和一个响应（一个 `http.ServerResponse` 对象）。

这两个对象对于处理 HTTP 调用至关重要。

第一个对象提供请求详细信息。 在这个简单的例子中，没有使用它，但是您可以访问请求头和请求数据。

第二个对象用于将数据返回给调用者。

在本例中：

```js
res.setHeader('Content-Type', 'text/plain')
```

我们将 statusCode 属性设置为 200，以指示响应成功。

我们设置 Content-Type 标头：

```js
res.setHeader('Content-Type', 'text/plain')
```

然后我们关闭响应，并将内容作为参数添加到 `end()` 中：

```js
res.end('Hello World')
```

这将把响应发送给客户端。

