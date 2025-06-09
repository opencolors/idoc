---
title: V8 JavaScript 引擎
description: V8 是 Google Chrome 的 JavaScript 引擎，执行 JavaScript 代码并提供运行时环境。它独立于浏览器并促进了 Node.js 的发展，支持服务器端代码和桌面应用程序。
head:
  - - meta
    - name: og:title
      content: V8 JavaScript 引擎 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: V8 是 Google Chrome 的 JavaScript 引擎，执行 JavaScript 代码并提供运行时环境。它独立于浏览器并促进了 Node.js 的发展，支持服务器端代码和桌面应用程序。
  - - meta
    - name: twitter:title
      content: V8 JavaScript 引擎 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: V8 是 Google Chrome 的 JavaScript 引擎，执行 JavaScript 代码并提供运行时环境。它独立于浏览器并促进了 Node.js 的发展，支持服务器端代码和桌面应用程序。
---


# V8 JavaScript 引擎

V8 是为 Google Chrome 提供支持的 JavaScript 引擎的名称。 它是在使用 Chrome 浏览时，获取我们的 JavaScript 并执行它的东西。

V8 是 JavaScript 引擎，即它解析并执行 JavaScript 代码。 DOM 和其他的 Web 平台 API（它们都构成了运行时环境）是由浏览器提供的。

最酷的是，JavaScript 引擎独立于它所托管的浏览器。 这个关键特性促成了 Node.js 的崛起。 V8 被选为 2009 年为 Node.js 提供支持的引擎，并且随着 Node.js 的普及，V8 现在成为为大量用 JavaScript 编写的服务器端代码提供支持的引擎。

Node.js 生态系统非常庞大，并且得益于 V8，它也通过像 Electron 这样的项目为桌面应用程序提供支持。

## 其他 JS 引擎

其他浏览器有它们自己的 JavaScript 引擎：

+ `SpiderMonkey` (Firefox)
+ `JavaScriptCore`(也称为 `Nitro`) (Safari)
+ Edge 最初基于 `Chakra`，但最近已使用 Chromium 和 V8 引擎进行了重建。

还有许多其他的引擎存在。

所有这些引擎都实现了 [ECMA ES-262 标准](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/)，也称为 ECMAScript，JavaScript 使用的标准。

## 追求性能

V8 是用 C++ 编写的，并且在不断改进。 它是可移植的，可以在 Mac、Windows、Linux 和其他几个系统上运行。

在这个 V8 介绍中，我们将忽略 V8 的实现细节：它们可以在更权威的网站（例如 [V8 官方网站](https://v8.dev/)）上找到，并且随着时间的推移，它们会发生变化，通常是根本性的变化。

V8 总是在不断发展，就像周围的其他 JavaScript 引擎一样，以加速 Web 和 Node.js 生态系统。

在 Web 上，已经进行了多年的性能竞赛，并且我们（作为用户和开发人员）从这种竞争中受益匪浅，因为我们每年都会获得更快和更优化的机器。


## 编译

通常认为 JavaScript 是一种解释型语言，但现代 JavaScript 引擎不再仅仅解释 JavaScript，而是编译它。

这种情况从 2009 年开始出现，当时 SpiderMonkey JavaScript 编译器被添加到 Firefox 3.5 中，之后大家都遵循了这个思路。

JavaScript 在内部通过 V8 使用即时 (JIT) 编译进行编译，以加快执行速度。

这可能看起来违反直觉，但自从 2004 年 Google Maps 推出以来，JavaScript 已经从一种通常执行几十行代码的语言发展成为在浏览器中运行数千甚至数十万行代码的完整应用程序。

我们的应用程序现在可以在浏览器中运行数小时，而不仅仅是一些表单验证规则或简单的脚本。

在这个新的世界里，编译 JavaScript 变得非常有意义，因为虽然让 JavaScript 准备就绪可能需要更多的时间，但一旦完成，它的性能将比纯粹的解释代码高得多。

