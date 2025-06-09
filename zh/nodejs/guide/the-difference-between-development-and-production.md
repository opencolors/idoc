---
title: Node.js 中开发和生产环境的区别
description: 了解 Node.js 中 NODE_ENV 的作用及其对开发和生产环境的影响。
head:
  - - meta
    - name: og:title
      content: Node.js 中开发和生产环境的区别 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解 Node.js 中 NODE_ENV 的作用及其对开发和生产环境的影响。
  - - meta
    - name: twitter:title
      content: Node.js 中开发和生产环境的区别 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解 Node.js 中 NODE_ENV 的作用及其对开发和生产环境的影响。
---


# Node.js，开发环境和生产环境的区别

`在 Node.js 中，开发环境和生产环境之间没有区别`，也就是说，你不需要应用任何特定的设置来使 Node.js 在生产配置中工作。然而，npm 注册表中的一些库会识别 `NODE_ENV` 变量，并将其默认设置为 `development` 设置。 始终使用 `NODE_ENV=production` 设置运行你的 Node.js。

一种流行的配置应用程序的方法是使用 [十二要素方法](https://12factor.net)。

## Express 中的 NODE_ENV

在非常流行的 [express](https://expressjs.com) 框架中，将 NODE_ENV 设置为 production 通常可以确保：

+ 日志记录保持在最低限度的必要级别
+ 采用更多的缓存级别来优化性能

这通常通过在 shell 中执行命令

```bash
export NODE_ENV=production
```

来完成，但最好将其放入你的 shell 配置文件（例如，使用 Bash shell 的 `.bash_profile`）中，否则，如果系统重新启动，该设置将不会保留。

你还可以通过将环境变量添加到你的应用程序初始化命令前面来应用它：

```bash
NODE_ENV=production node app.js
```

例如，在 Express 应用程序中，你可以使用它来为每个环境设置不同的错误处理程序：

```javascript
if (process.env.NODE_ENV === 'development') {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}
if (process.env.NODE_ENV === 'production') {
  app.use(express.errorHandler());
}
```

例如，[Pug](https://pugjs.org)，[Express.js](https://expressjs.com] 使用的模板库，如果 `NODE_ENV` 未设置为 `production`，则会在调试模式下编译。 Express 视图在开发模式下的每次请求中都会被编译，而在生产模式下则会被缓存。 还有更多例子。

`此环境变量是在外部库中广泛使用的约定，但不是在 Node.js 本身中使用。`

## 为什么 NODE_ENV 被认为是一种反模式？

环境是一个数字平台或系统，工程师可以在其中构建、测试、部署和管理软件产品。 按照惯例，我们的应用程序运行在四个阶段或类型的环境中：

+ 开发
+ 暂存
+ 生产
+ 测试

`NODE_ENV` 的根本问题源于开发人员将优化和软件行为与软件运行的环境结合起来。 结果是如下代码：

```javascript
if (process.env.NODE_ENV === 'development') {
  // ...
}
if (process.env.NODE_ENV === 'staging') {
  // ...
}
if (process.env.NODE_ENV === 'production') {
  // ...
}
if (process.env.NODE_ENV === 'testing') {
  // ...
}
```

虽然这看起来可能无害，但它使生产环境和暂存环境不同，从而使可靠的测试成为不可能。 例如，当 `NODE_ENV` 设置为 `development` 时，测试以及你的产品的功能可能会通过，但在将 `NODE_ENV` 设置为 `production` 时会失败。 因此，将 `NODE_ENV` 设置为 `production` 以外的任何值都被认为是一种反模式。

