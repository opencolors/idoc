---
title: Node.js 中的 ECMAScript 2015（ES6）和更高版本
description: Node.js 通过 V8 引擎支持现代 ECMAScript 特性，新特性和改进会及时引入。
head:
  - - meta
    - name: og:title
      content: Node.js 中的 ECMAScript 2015（ES6）和更高版本 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 通过 V8 引擎支持现代 ECMAScript 特性，新特性和改进会及时引入。
  - - meta
    - name: twitter:title
      content: Node.js 中的 ECMAScript 2015（ES6）和更高版本 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 通过 V8 引擎支持现代 ECMAScript 特性，新特性和改进会及时引入。
---


# ECMAScript 2015 (ES6) 及更高版本

Node.js 构建于 [V8](https://v8.dev/) 的现代版本之上。 通过与此引擎的最新版本保持同步，我们确保 [JavaScript ECMA-262 规范](https://tc39.es/ecma262/) 中的新功能及时提供给 Node.js 开发人员，并持续改进性能和稳定性。

所有 ECMAScript 2015 (ES6) 功能分为三个组：`shipping`、`staged` 和 `in progress` 功能：

+ 所有 `shipping` 功能（V8 认为稳定）在 `Node.js 上默认启用`，并且 `不需要` 任何类型的运行时标志。
+ `Staged` 功能（几乎完成但 V8 团队认为不稳定的功能）需要运行时标志：`--harmony`。
+ `In progress` 功能可以通过它们各自的 harmony 标志单独激活，尽管强烈建议不要这样做，除非用于测试目的。 注意：这些标志由 V8 公开，并且可能会在没有任何弃用通知的情况下更改。

## 哪些功能默认随哪个 Node.js 版本一起提供？

网站 [node.green](https://node.green) 基于 kangax 的 compat-table，提供了各种 Node.js 版本中支持的 ECMAScript 功能的出色概述。

## 哪些功能正在进行中？

新功能不断添加到 V8 引擎中。 一般来说，预计它们会在未来的 Node.js 版本中出现，但时间未知。

您可以通过搜索 `--v8-options` 参数来列出每个 Node.js 版本中可用的所有正在进行中的功能。 请注意，这些是 V8 不完整且可能损坏的功能，因此使用风险自负：

```sh
node --v8-options | grep "in progress"
```

## 我的基础设施已设置为利用 --harmony 标志。 我应该删除它吗？

Node.js 上 `--harmony` 标志的当前行为是仅启用 `staged` 功能。 毕竟，它现在是 `--es_staging` 的同义词。 如上所述，这些是已经完成但尚未被认为是稳定的功能。 如果你想安全起见，尤其是在生产环境中，请考虑删除此运行时标志，直到它默认在 V8 上发布，从而在 Node.js 上发布。 如果你保持启用状态，如果 V8 更改其语义以更紧密地遵循标准，你应该为进一步的 Node.js 升级破坏你的代码做好准备。


## 如何找到特定 Node.js 版本附带的 V8 版本？

Node.js 提供了一种简单的方法来列出所有依赖项以及通过 `process` 全局对象附带特定二进制文件的相应版本。对于 V8 引擎，在您的终端中键入以下内容以检索其版本：

```sh
node -p process.versions.v8
```

