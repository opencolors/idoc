---
title: Node.js 与浏览器的差异
description: 了解 Node.js 与浏览器在生态系统、环境控制和模块系统方面的主要区别。
head:
  - - meta
    - name: og:title
      content: Node.js 与浏览器的差异 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解 Node.js 与浏览器在生态系统、环境控制和模块系统方面的主要区别。
  - - meta
    - name: twitter:title
      content: Node.js 与浏览器的差异 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解 Node.js 与浏览器在生态系统、环境控制和模块系统方面的主要区别。
---


# Node.js 与浏览器的区别

浏览器和 Node.js 都使用 JavaScript 作为编程语言。构建在浏览器中运行的应用程序与构建 Node.js 应用程序完全不同。尽管都是 JavaScript，但一些关键差异使体验截然不同。

从广泛使用 JavaScript 的前端开发人员的角度来看，Node.js 应用程序带来了一个巨大的优势：可以使用单一语言来编写所有内容——前端和后端——的舒适性。

你有一个巨大的机会，因为我们知道全面、深入地学习一门编程语言是多么困难，并且通过使用同一种语言来执行你在 Web 上的所有工作——客户端和服务器端，你处于独特的优势地位。

::: tip
改变的是生态系统。
:::

在浏览器中，大多数时候你都在与 DOM 或其他 Web 平台 API（如 Cookies）进行交互。当然，这些在 Node.js 中不存在。你没有 `document`、`window` 和浏览器提供的所有其他对象。

而在浏览器中，我们没有 Node.js 通过其模块提供的所有优秀 API，例如文件系统访问功能。

另一个很大的区别是，在 Node.js 中，你可以控制环境。除非你正在构建一个任何人都可以部署在任何地方的开源应用程序，否则你知道你将在哪个版本的 Node.js 上运行该应用程序。与浏览器环境相比，你无法选择你的访问者将使用什么浏览器，这非常方便。

这意味着你可以编写 Node.js 版本支持的所有现代 ES2015+ JavaScript。由于 JavaScript 的发展速度如此之快，但浏览器升级可能有点慢，因此有时在 Web 上你只能使用较旧的 JavaScript / ECMAScript 版本。你可以使用 Babel 来转换你的代码，使其在发布到浏览器之前与 ES5 兼容，但在 Node.js 中，你不需要这样做。

另一个区别是，Node.js 同时支持 CommonJS 和 ES 模块系统（自 Node.js v12 起），而在浏览器中，我们开始看到 ES 模块标准的实现。

实际上，这意味着你可以在 Node.js 中同时使用 `require()` 和 `import`，而在浏览器中，你仅限于 `import`。

