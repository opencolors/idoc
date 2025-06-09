---
title: Node.js 文档
description: 探索 Node.js 的全面文档，涵盖 API、模块和使用示例，帮助开发者有效地理解和使用 Node.js。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 探索 Node.js 的全面文档，涵盖 API、模块和使用示例，帮助开发者有效地理解和使用 Node.js。
  - - meta
    - name: twitter:title
      content: Node.js 文档 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 探索 Node.js 的全面文档，涵盖 API、模块和使用示例，帮助开发者有效地理解和使用 Node.js。
---


# 关于此文档 {#about-this-documentation}

欢迎来到 Node.js 的官方 API 参考文档！

Node.js 是一个基于 [V8 JavaScript 引擎](https://v8.dev/) 构建的 JavaScript 运行时。

## 贡献 {#contributing}

请在 [问题跟踪器](https://github.com/nodejs/node/issues/new) 中报告此文档中的错误。 有关如何提交拉取请求的说明，请参阅 [贡献指南](https://github.com/nodejs/node/blob/HEAD/CONTRIBUTING.md)。

## 稳定性指标 {#stability-index}

整个文档中都有关于某个章节稳定性的说明。 一些 API 已经被证明并且被广泛依赖，以至于它们不太可能发生任何变化。 其他的是全新的和实验性的，或者已知是有风险的。

稳定性指标如下：

::: danger [稳定度：0 - 已弃用]
[稳定度：0](/zh/nodejs/api/documentation#stability-index) 稳定度：0 - 已弃用。 该特性可能会发出警告。 不保证向后兼容性。
:::

::: warning [稳定度：1 - 实验性]
[稳定度：1](/zh/nodejs/api/documentation#stability-index) 稳定度：1 - 实验性。 该特性不受 [语义版本控制](https://semver.org/) 规则的约束。 在未来的任何版本中都可能发生不向后兼容的更改或删除。 不建议在生产环境中使用该特性。
:::

::: tip [稳定度：2 - 稳定]
[稳定度：2](/zh/nodejs/api/documentation#stability-index) 稳定度：2 - 稳定。 与 npm 生态系统的兼容性是重中之重。
:::

::: info [稳定度：3 - 遗留]
[稳定度：3](/zh/nodejs/api/documentation#stability-index) 稳定度：3 - 遗留。 尽管此特性不太可能被删除并且仍然受到语义版本控制保证的保护，但它不再被积极维护，并且有其他替代方案可用。
:::

如果遗留特性的使用没有危害，并且它们在 npm 生态系统中被广泛依赖，则这些特性会被标记为遗留而不是被弃用。 遗留特性中发现的错误不太可能被修复。

使用实验性特性时要小心，尤其是在编写库时。 用户可能不知道正在使用实验性特性。 当实验性 API 修改发生时，错误或行为更改可能会让用户感到惊讶。 为了避免意外，实验性特性的使用可能需要命令行标志。 实验性特性也可能会发出 [警告](/zh/nodejs/api/process#event-warning)。


## 稳定性概览 {#stability-overview}

| API | 稳定性 |
| --- | --- |
| [Assert](/zh/nodejs/api/assert) |<div class="custom-block tip"> (2) 稳定 </div>|
| [Async hooks](/zh/nodejs/api/async_hooks) |<div class="custom-block warning"> (1) 实验性 </div>|
| [Asynchronous context tracking](/zh/nodejs/api/async_context) |<div class="custom-block tip"> (2) 稳定 </div>|
| [Buffer](/zh/nodejs/api/buffer) |<div class="custom-block tip"> (2) 稳定 </div>|
| [Child process](/zh/nodejs/api/child_process) |<div class="custom-block tip"> (2) 稳定 </div>|
| [Cluster](/zh/nodejs/api/cluster) |<div class="custom-block tip"> (2) 稳定 </div>|
| [Console](/zh/nodejs/api/console) |<div class="custom-block tip"> (2) 稳定 </div>|
| [Crypto](/zh/nodejs/api/crypto) |<div class="custom-block tip"> (2) 稳定 </div>|
| [Diagnostics Channel](/zh/nodejs/api/diagnostics_channel) |<div class="custom-block tip"> (2) 稳定 </div>|
| [DNS](/zh/nodejs/api/dns) |<div class="custom-block tip"> (2) 稳定 </div>|
| [Domain](/zh/nodejs/api/domain) |<div class="custom-block danger"> (0) 已弃用 </div>|
| [File system](/zh/nodejs/api/fs) |<div class="custom-block tip"> (2) 稳定 </div>|
| [HTTP](/zh/nodejs/api/http) |<div class="custom-block tip"> (2) 稳定 </div>|
| [HTTP/2](/zh/nodejs/api/http2) |<div class="custom-block tip"> (2) 稳定 </div>|
| [HTTPS](/zh/nodejs/api/https) |<div class="custom-block tip"> (2) 稳定 </div>|
| [Inspector](/zh/nodejs/api/inspector) |<div class="custom-block tip"> (2) 稳定 </div>|
| [Modules: `node:module` API](/zh/nodejs/api/module) |<div class="custom-block warning"> (1) .2 - 发布候选版本（异步版本）稳定性：1.1 - 积极开发（同步版本） </div>|
| [Modules: CommonJS modules](/zh/nodejs/api/modules) |<div class="custom-block tip"> (2) 稳定 </div>|
| [Modules: TypeScript](/zh/nodejs/api/typescript) |<div class="custom-block warning"> (1) .1 - 积极开发 </div>|
| [OS](/zh/nodejs/api/os) |<div class="custom-block tip"> (2) 稳定 </div>|
| [Path](/zh/nodejs/api/path) |<div class="custom-block tip"> (2) 稳定 </div>|
| [Performance measurement APIs](/zh/nodejs/api/perf_hooks) |<div class="custom-block tip"> (2) 稳定 </div>|
| [Punycode](/zh/nodejs/api/punycode) |<div class="custom-block danger"> (0) 已弃用 </div>|
| [Query string](/zh/nodejs/api/querystring) |<div class="custom-block tip"> (2) 稳定 </div>|
| [Readline](/zh/nodejs/api/readline) |<div class="custom-block tip"> (2) 稳定 </div>|
| [REPL](/zh/nodejs/api/repl) |<div class="custom-block tip"> (2) 稳定 </div>|
| [Single executable applications](/zh/nodejs/api/single-executable-applications) |<div class="custom-block warning"> (1) .1 - 积极开发 </div>|
| [SQLite](/zh/nodejs/api/sqlite) |<div class="custom-block warning"> (1) .1 - 积极开发。 </div>|
| [Stream](/zh/nodejs/api/stream) |<div class="custom-block tip"> (2) 稳定 </div>|
| [String decoder](/zh/nodejs/api/string_decoder) |<div class="custom-block tip"> (2) 稳定 </div>|
| [Test runner](/zh/nodejs/api/test) |<div class="custom-block tip"> (2) 稳定 </div>|
| [Timers](/zh/nodejs/api/timers) |<div class="custom-block tip"> (2) 稳定 </div>|
| [TLS (SSL)](/zh/nodejs/api/tls) |<div class="custom-block tip"> (2) 稳定 </div>|
| [Trace events](/zh/nodejs/api/tracing) |<div class="custom-block warning"> (1) 实验性 </div>|
| [TTY](/zh/nodejs/api/tty) |<div class="custom-block tip"> (2) 稳定 </div>|
| [UDP/datagram sockets](/zh/nodejs/api/dgram) |<div class="custom-block tip"> (2) 稳定 </div>|
| [URL](/zh/nodejs/api/url) |<div class="custom-block tip"> (2) 稳定 </div>|
| [Util](/zh/nodejs/api/util) |<div class="custom-block tip"> (2) 稳定 </div>|
| [VM (executing JavaScript)](/zh/nodejs/api/vm) |<div class="custom-block tip"> (2) 稳定 </div>|
| [Web Crypto API](/zh/nodejs/api/webcrypto) |<div class="custom-block tip"> (2) 稳定 </div>|
| [Web Streams API](/zh/nodejs/api/webstreams) |<div class="custom-block tip"> (2) 稳定 </div>|
| [WebAssembly System Interface (WASI)](/zh/nodejs/api/wasi) |<div class="custom-block warning"> (1) 实验性 </div>|
| [Worker threads](/zh/nodejs/api/worker_threads) |<div class="custom-block tip"> (2) 稳定 </div>|
| [Zlib](/zh/nodejs/api/zlib) |<div class="custom-block tip"> (2) 稳定 </div>|

## JSON 输出 {#json-output}

**添加于: v0.6.12**

每个 `.html` 文档都有一个对应的 `.json` 文档。这适用于 IDE 和其他使用文档的实用程序。

## 系统调用和 man 手册 {#system-calls-and-man-pages}

封装系统调用的 Node.js 函数会记录这一点。文档链接到相应的 man 手册，其中描述了系统调用的工作方式。

大多数 Unix 系统调用都有 Windows 对应物。 尽管如此，行为差异可能是不可避免的。

