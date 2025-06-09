---
title: Node.js 废弃功能
description: 本页面记录了Node.js中已废弃的功能，提供了如何更新代码以避免使用过时的API和实践的指导。
head:
  - - meta
    - name: og:title
      content: Node.js 废弃功能 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 本页面记录了Node.js中已废弃的功能，提供了如何更新代码以避免使用过时的API和实践的指导。
  - - meta
    - name: twitter:title
      content: Node.js 废弃功能 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 本页面记录了Node.js中已废弃的功能，提供了如何更新代码以避免使用过时的API和实践的指导。
---


# 已弃用的 API {#deprecated-apis}

Node.js API 可能会因以下任何原因而被弃用：

- 使用该 API 不安全。
- 存在改进的替代 API。
- 预计在未来的主要版本中会对 API 进行重大更改。

Node.js 使用四种类型的弃用：

- 仅文档
- 应用程序（仅限非 `node_modules` 代码）
- 运行时（所有代码）
- 生命周期结束

仅文档弃用是指仅在 Node.js API 文档中表达的弃用。这些在运行 Node.js 时不会产生任何副作用。某些仅文档弃用会在使用 [`--pending-deprecation`](/zh/nodejs/api/cli#--pending-deprecation) 标志（或其替代方案 `NODE_PENDING_DEPRECATION=1` 环境变量）启动时触发运行时警告，类似于下面的运行时弃用。[已弃用的 API 列表](/zh/nodejs/api/deprecations#list-of-deprecated-apis) 中明确标记了支持该标志的仅文档弃用。

仅针对非 `node_modules` 代码的应用程序弃用，默认情况下，会生成一个进程警告，该警告会在首次在非从 `node_modules` 加载的代码中使用已弃用的 API 时打印到 `stderr`。当使用 [`--throw-deprecation`](/zh/nodejs/api/cli#--throw-deprecation) 命令行标志时，运行时弃用会导致抛出错误。当使用 [`--pending-deprecation`](/zh/nodejs/api/cli#--pending-deprecation) 时，也会为从 `node_modules` 加载的代码发出警告。

针对所有代码的运行时弃用类似于针对非 `node_modules` 代码的运行时弃用，不同之处在于它还会为从 `node_modules` 加载的代码发出警告。

当功能已从或即将从 Node.js 中移除时，会使用生命周期结束弃用。

## 撤销弃用 {#revoking-deprecations}

有时，API 的弃用可能会被撤销。在这种情况下，本文档将更新与该决定相关的信息。但是，弃用标识符不会被修改。

## 已弃用的 API 列表 {#list-of-deprecated-apis}

### DEP0001: `http.OutgoingMessage.prototype.flush` {#dep0001-httpoutgoingmessageprototypeflush}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.0.0 | 生命周期结束。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v1.6.0 | 运行时弃用。 |
:::

类型：生命周期结束

`OutgoingMessage.prototype.flush()` 已被移除。请使用 `OutgoingMessage.prototype.flushHeaders()` 代替。


### DEP0002: `require('_linklist')` {#dep0002-require_linklist}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v8.0.0 | 已终止生命周期。 |
| v6.12.0 | 已分配一个弃用代码。 |
| v5.0.0 | 运行时弃用。 |
:::

类型：已终止生命周期

`_linklist` 模块已弃用。请使用用户空间替代方案。

### DEP0003: `_writableState.buffer` {#dep0003-_writablestatebuffer}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v14.0.0 | 已终止生命周期。 |
| v6.12.0, v4.8.6 | 已分配一个弃用代码。 |
| v0.11.15 | 运行时弃用。 |
:::

类型：已终止生命周期

`_writableState.buffer` 已移除。请使用 `_writableState.getBuffer()` 代替。

### DEP0004: `CryptoStream.prototype.readyState` {#dep0004-cryptostreamprototypereadystate}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 已终止生命周期。 |
| v6.12.0, v4.8.6 | 已分配一个弃用代码。 |
| v0.4.0 | 仅文档弃用。 |
:::

类型：已终止生命周期

`CryptoStream.prototype.readyState` 属性已移除。

### DEP0005: `Buffer()` 构造函数 {#dep0005-buffer-constructor}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 运行时弃用。 |
| v6.12.0 | 已分配一个弃用代码。 |
| v6.0.0 | 仅文档弃用。 |
:::

类型：应用程序（仅限非 `node_modules` 代码）

由于 API 可用性问题可能导致意外的安全问题，`Buffer()` 函数和 `new Buffer()` 构造函数已被弃用。

作为替代方案，请使用以下方法之一来构造 `Buffer` 对象：

- [`Buffer.alloc(size[, fill[, encoding]])`](/zh/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding)：创建一个具有*初始化*内存的 `Buffer`。
- [`Buffer.allocUnsafe(size)`](/zh/nodejs/api/buffer#static-method-bufferallocunsafesize)：创建一个具有*未初始化*内存的 `Buffer`。
- [`Buffer.allocUnsafeSlow(size)`](/zh/nodejs/api/buffer#static-method-bufferallocunsafeslowsize)：创建一个具有*未初始化*内存的 `Buffer`。
- [`Buffer.from(array)`](/zh/nodejs/api/buffer#static-method-bufferfromarray)：创建一个 `Buffer`，其中包含 `array` 的副本。
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/zh/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) - 创建一个 `Buffer`，它包装给定的 `arrayBuffer`。
- [`Buffer.from(buffer)`](/zh/nodejs/api/buffer#static-method-bufferfrombuffer)：创建一个复制 `buffer` 的 `Buffer`。
- [`Buffer.from(string[, encoding])`](/zh/nodejs/api/buffer#static-method-bufferfromstring-encoding)：创建一个复制 `string` 的 `Buffer`。

如果没有 `--pending-deprecation`，则运行时警告仅在 `node_modules` 之外的代码中才会出现。 这意味着不会为依赖项中 `Buffer()` 的使用发出弃用警告。 使用 `--pending-deprecation` 时，无论 `Buffer()` 的使用发生在何处，都会产生运行时警告。


### DEP0006: `child_process` `options.customFds` {#dep0006-child_process-optionscustomfds}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.0.0 | 已停止使用。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v0.11.14 | 运行时弃用。 |
| v0.5.10 | 仅文档弃用。 |
:::

类型：已停止使用

在 [`child_process`](/zh/nodejs/api/child_process) 模块的 `spawn()`、`fork()` 和 `exec()` 方法中，`options.customFds` 选项已被弃用。应该使用 `options.stdio` 选项代替。

### DEP0007: 将 `cluster` `worker.suicide` 替换为 `worker.exitedAfterDisconnect` {#dep0007-replace-cluster-workersuicide-with-workerexitedafterdisconnect}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v9.0.0 | 已停止使用。 |
| v7.0.0 | 运行时弃用。 |
| v6.12.0 | 已分配弃用代码。 |
| v6.0.0 | 仅文档弃用。 |
:::

类型：已停止使用

在 Node.js `cluster` 的早期版本中，一个名为 `suicide` 的布尔属性被添加到 `Worker` 对象中。此属性的目的是提供有关 `Worker` 实例如何以及为何退出的指示。在 Node.js 6.0.0 中，旧属性已被弃用，并被新的 [`worker.exitedAfterDisconnect`](/zh/nodejs/api/cluster#workerexitedafterdisconnect) 属性替换。旧属性名称未能准确描述实际语义，并且不必要地带有情感色彩。

### DEP0008: `require('node:constants')` {#dep0008-requirenodeconstants}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v6.12.0 | 已分配弃用代码。 |
| v6.3.0 | 仅文档弃用。 |
:::

类型：仅文档

`node:constants` 模块已被弃用。当需要访问与特定 Node.js 内置模块相关的常量时，开发者应改为参考相关模块公开的 `constants` 属性。例如，`require('node:fs').constants` 和 `require('node:os').constants`。

### DEP0009: 不带摘要的 `crypto.pbkdf2` {#dep0009-cryptopbkdf2-without-digest}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.0.0 | 已停止使用（对于 `digest === null`）。 |
| v11.0.0 | 运行时弃用（对于 `digest === null`）。 |
| v8.0.0 | 已停止使用（对于 `digest === undefined`）。 |
| v6.12.0 | 已分配弃用代码。 |
| v6.0.0 | 运行时弃用（对于 `digest === undefined`）。 |
:::

类型：已停止使用

在 Node.js 6.0 中，不指定摘要的情况下使用 [`crypto.pbkdf2()`](/zh/nodejs/api/crypto#cryptopbkdf2password-salt-iterations-keylen-digest-callback) API 已被弃用，因为该方法默认使用不推荐的 `'SHA1'` 摘要。之前，会打印弃用警告。从 Node.js 8.0.0 开始，如果将 `digest` 设置为 `undefined` 调用 `crypto.pbkdf2()` 或 `crypto.pbkdf2Sync()` 将抛出一个 `TypeError`。

从 Node.js v11.0.0 开始，将 `digest` 设置为 `null` 调用这些函数会打印弃用警告，以便与 `digest` 为 `undefined` 时的行为保持一致。

但是，现在传递 `undefined` 或 `null` 都会抛出一个 `TypeError`。


### DEP0010: `crypto.createCredentials` {#dep0010-cryptocreatecredentials}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v11.0.0 | 已终止生命周期。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v0.11.13 | 运行时弃用。 |
:::

类型: 已终止生命周期

`crypto.createCredentials()` API 已被移除。请使用 [`tls.createSecureContext()`](/zh/nodejs/api/tls#tlscreatesecurecontextoptions) 代替。

### DEP0011: `crypto.Credentials` {#dep0011-cryptocredentials}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v11.0.0 | 已终止生命周期。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v0.11.13 | 运行时弃用。 |
:::

类型: 已终止生命周期

`crypto.Credentials` 类已被移除。请使用 [`tls.SecureContext`](/zh/nodejs/api/tls#tlscreatesecurecontextoptions) 代替。

### DEP0012: `Domain.dispose` {#dep0012-domaindispose}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v9.0.0 | 已终止生命周期。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v0.11.7 | 运行时弃用。 |
:::

类型: 已终止生命周期

`Domain.dispose()` 已被移除。请改为通过在域上设置的错误事件处理程序显式地从失败的 I/O 操作中恢复。

### DEP0013: `fs` 没有回调的异步函数 {#dep0013-fs-asynchronous-function-without-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 已终止生命周期。 |
| v7.0.0 | 运行时弃用。 |
:::

类型: 已终止生命周期

从 Node.js 10.0.0 开始，调用没有回调的异步函数会抛出一个 `TypeError`。参见 [https://github.com/nodejs/node/pull/12562](https://github.com/nodejs/node/pull/12562)。

### DEP0014: `fs.read` 遗留的 String 接口 {#dep0014-fsread-legacy-string-interface}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v8.0.0 | 已终止生命周期。 |
| v6.0.0 | 运行时弃用。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v0.1.96 | 仅文档弃用。 |
:::

类型: 已终止生命周期

遗留的 [`fs.read()`](/zh/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback) `String` 接口已被弃用。请使用文档中提到的 `Buffer` API 代替。

### DEP0015: `fs.readSync` 遗留的 String 接口 {#dep0015-fsreadsync-legacy-string-interface}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v8.0.0 | 已终止生命周期。 |
| v6.0.0 | 运行时弃用。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v0.1.96 | 仅文档弃用。 |
:::

类型: 已终止生命周期

遗留的 [`fs.readSync()`](/zh/nodejs/api/fs#fsreadsyncfd-buffer-offset-length-position) `String` 接口已被弃用。请使用文档中提到的 `Buffer` API 代替。


### DEP0016: `GLOBAL`/`root` {#dep0016-global/root}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.0.0 | 已终止生命周期。 |
| v6.12.0 | 已分配弃用代码。 |
| v6.0.0 | 运行时弃用。 |
:::

类型：已终止生命周期

`GLOBAL` 和 `root` 作为 `global` 属性的别名，已在 Node.js 6.0.0 中被弃用，并且已被移除。

### DEP0017: `Intl.v8BreakIterator` {#dep0017-intlv8breakiterator}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v9.0.0 | 已终止生命周期。 |
| v7.0.0 | 运行时弃用。 |
:::

类型：已终止生命周期

`Intl.v8BreakIterator` 是一个非标准扩展，已被移除。 参阅 [`Intl.Segmenter`](https://github.com/tc39/proposal-intl-segmenter)。

### DEP0018: 未处理的 Promise 拒绝 {#dep0018-unhandled-promise-rejections}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | 已终止生命周期。 |
| v7.0.0 | 运行时弃用。 |
:::

类型：已终止生命周期

未处理的 Promise 拒绝已被弃用。 默认情况下，未处理的 Promise 拒绝会终止 Node.js 进程，并返回一个非零退出码。 要更改 Node.js 处理未处理拒绝的方式，请使用 [`--unhandled-rejections`](/zh/nodejs/api/cli#--unhandled-rejectionsmode) 命令行选项。

### DEP0019: `require('.')` 解析到目录外部 {#dep0019-require-resolved-outside-directory}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.0.0 | 已移除功能。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v1.8.1 | 运行时弃用。 |
:::

类型：已终止生命周期

在某些情况下，`require('.')` 可能会解析到包目录之外。 此行为已被移除。

### DEP0020: `Server.connections` {#dep0020-serverconnections}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | Server.connections 已被移除。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v0.9.7 | 运行时弃用。 |
:::

类型：已终止生命周期

`Server.connections` 属性已在 Node.js v0.9.7 中被弃用，并且已被移除。 请使用 [`Server.getConnections()`](/zh/nodejs/api/net#servergetconnectionscallback) 方法代替。

### DEP0021: `Server.listenFD` {#dep0021-serverlistenfd}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.0.0 | 已终止生命周期。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v0.7.12 | 运行时弃用。 |
:::

类型：已终止生命周期

`Server.listenFD()` 方法已被弃用并移除。 请使用 [`Server.listen({fd: \<number\>})`](/zh/nodejs/api/net#serverlistenhandle-backlog-callback) 代替。


### DEP0022: `os.tmpDir()` {#dep0022-ostmpdir}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v14.0.0 | 已停止使用。 |
| v7.0.0 | 运行时弃用。 |
:::

类型: 已停止使用

`os.tmpDir()` API 在 Node.js 7.0.0 中被弃用，并且已被移除。请使用 [`os.tmpdir()`](/zh/nodejs/api/os#ostmpdir) 代替。

### DEP0023: `os.getNetworkInterfaces()` {#dep0023-osgetnetworkinterfaces}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v12.0.0 | 已停止使用。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v0.6.0 | 运行时弃用。 |
:::

类型: 已停止使用

`os.getNetworkInterfaces()` 方法已被弃用。请使用 [`os.networkInterfaces()`](/zh/nodejs/api/os#osnetworkinterfaces) 方法代替。

### DEP0024: `REPLServer.prototype.convertToContext()` {#dep0024-replserverprototypeconverttocontext}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v9.0.0 | 已停止使用。 |
| v7.0.0 | 运行时弃用。 |
:::

类型: 已停止使用

`REPLServer.prototype.convertToContext()` API 已被移除。

### DEP0025: `require('node:sys')` {#dep0025-requirenodesys}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v1.0.0 | 运行时弃用。 |
:::

类型: 运行时

`node:sys` 模块已被弃用。请使用 [`util`](/zh/nodejs/api/util) 模块代替。

### DEP0026: `util.print()` {#dep0026-utilprint}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v12.0.0 | 已停止使用。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v0.11.3 | 运行时弃用。 |
:::

类型: 已停止使用

`util.print()` 已被移除。请使用 [`console.log()`](/zh/nodejs/api/console#consolelogdata-args) 代替。

### DEP0027: `util.puts()` {#dep0027-utilputs}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v12.0.0 | 已停止使用。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v0.11.3 | 运行时弃用。 |
:::

类型: 已停止使用

`util.puts()` 已被移除。请使用 [`console.log()`](/zh/nodejs/api/console#consolelogdata-args) 代替。

### DEP0028: `util.debug()` {#dep0028-utildebug}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v12.0.0 | 已停止使用。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v0.11.3 | 运行时弃用。 |
:::

类型: 已停止使用

`util.debug()` 已被移除。请使用 [`console.error()`](/zh/nodejs/api/console#consoleerrordata-args) 代替。


### DEP0029: `util.error()` {#dep0029-utilerror}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v12.0.0 | 已终止。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v0.11.3 | 运行时弃用。 |
:::

类型：已终止

`util.error()` 已被移除。请使用 [`console.error()`](/zh/nodejs/api/console#consoleerrordata-args) 代替。

### DEP0030: `SlowBuffer` {#dep0030-slowbuffer}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v6.12.0 | 已分配弃用代码。 |
| v6.0.0 | 仅文档弃用。 |
:::

类型：仅文档

[`SlowBuffer`](/zh/nodejs/api/buffer#class-slowbuffer) 类已被弃用。请使用 [`Buffer.allocUnsafeSlow(size)`](/zh/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) 代替。

### DEP0031: `ecdh.setPublicKey()` {#dep0031-ecdhsetpublickey}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v6.12.0 | 已分配弃用代码。 |
| v5.2.0 | 仅文档弃用。 |
:::

类型：仅文档

[`ecdh.setPublicKey()`](/zh/nodejs/api/crypto#ecdhsetpublickeypublickey-encoding) 方法已被弃用，因为它包含在 API 中没有用处。

### DEP0032: `node:domain` 模块 {#dep0032-nodedomain-module}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v1.4.2 | 仅文档弃用。 |
:::

类型：仅文档

[`domain`](/zh/nodejs/api/domain) 模块已被弃用，不应使用。

### DEP0033: `EventEmitter.listenerCount()` {#dep0033-eventemitterlistenercount}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v3.2.0 | 仅文档弃用。 |
:::

类型：仅文档

[`events.listenerCount(emitter, eventName)`](/zh/nodejs/api/events#eventslistenercountemitter-eventname) API 已被弃用。请使用 [`emitter.listenerCount(eventName)`](/zh/nodejs/api/events#emitterlistenercounteventname-listener) 代替。

### DEP0034: `fs.exists(path, callback)` {#dep0034-fsexistspath-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v1.0.0 | 仅文档弃用。 |
:::

类型：仅文档

[`fs.exists(path, callback)`](/zh/nodejs/api/fs#fsexistspath-callback) API 已被弃用。请使用 [`fs.stat()`](/zh/nodejs/api/fs#fsstatpath-options-callback) 或 [`fs.access()`](/zh/nodejs/api/fs#fsaccesspath-mode-callback) 代替。


### DEP0035: `fs.lchmod(path, mode, callback)` {#dep0035-fslchmodpath-mode-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v0.4.7 | 仅文档弃用。 |
:::

类型：仅文档

[`fs.lchmod(path, mode, callback)`](/zh/nodejs/api/fs#fslchmodpath-mode-callback) API 已弃用。

### DEP0036: `fs.lchmodSync(path, mode)` {#dep0036-fslchmodsyncpath-mode}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v0.4.7 | 仅文档弃用。 |
:::

类型：仅文档

[`fs.lchmodSync(path, mode)`](/zh/nodejs/api/fs#fslchmodsyncpath-mode) API 已弃用。

### DEP0037: `fs.lchown(path, uid, gid, callback)` {#dep0037-fslchownpath-uid-gid-callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.6.0 | 撤销弃用。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v0.4.7 | 仅文档弃用。 |
:::

类型：撤销弃用

[`fs.lchown(path, uid, gid, callback)`](/zh/nodejs/api/fs#fslchownpath-uid-gid-callback) API 已被弃用。 撤销了弃用，因为 libuv 中添加了必需的支持 API。

### DEP0038: `fs.lchownSync(path, uid, gid)` {#dep0038-fslchownsyncpath-uid-gid}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.6.0 | 撤销弃用。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v0.4.7 | 仅文档弃用。 |
:::

类型：撤销弃用

[`fs.lchownSync(path, uid, gid)`](/zh/nodejs/api/fs#fslchownsyncpath-uid-gid) API 已被弃用。 撤销了弃用，因为 libuv 中添加了必需的支持 API。

### DEP0039: `require.extensions` {#dep0039-requireextensions}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v0.10.6 | 仅文档弃用。 |
:::

类型：仅文档

[`require.extensions`](/zh/nodejs/api/modules#requireextensions) 属性已弃用。

### DEP0040: `node:punycode` 模块 {#dep0040-nodepunycode-module}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v21.0.0 | 运行时弃用。 |
| v16.6.0 | 增加了对 `--pending-deprecation` 的支持。 |
| v7.0.0 | 仅文档弃用。 |
:::

类型：运行时

[`punycode`](/zh/nodejs/api/punycode) 模块已弃用。 请使用用户态的替代方案。


### DEP0041: `NODE_REPL_HISTORY_FILE` 环境变量 {#dep0041-node_repl_history_file-environment-variable}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 寿终正寝。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v3.0.0 | 仅文档弃用。 |
:::

类型：寿终正寝

`NODE_REPL_HISTORY_FILE` 环境变量已被移除。请使用 `NODE_REPL_HISTORY` 代替。

### DEP0042: `tls.CryptoStream` {#dep0042-tlscryptostream}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 寿终正寝。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v0.11.3 | 仅文档弃用。 |
:::

类型：寿终正寝

[`tls.CryptoStream`](/zh/nodejs/api/tls#class-tlscryptostream) 类已被移除。请使用 [`tls.TLSSocket`](/zh/nodejs/api/tls#class-tlstlssocket) 代替。

### DEP0043: `tls.SecurePair` {#dep0043-tlssecurepair}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v8.0.0 | 运行时弃用。 |
| v6.12.0 | 已分配弃用代码。 |
| v6.0.0 | 仅文档弃用。 |
| v0.11.15 | 撤销弃用。 |
| v0.11.3 | 运行时弃用。 |
:::

类型：仅文档

[`tls.SecurePair`](/zh/nodejs/api/tls#class-tlssecurepair) 类已弃用。请使用 [`tls.TLSSocket`](/zh/nodejs/api/tls#class-tlstlssocket) 代替。

### DEP0044: `util.isArray()` {#dep0044-utilisarray}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.0.0 | 运行时弃用。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v4.0.0, v3.3.1 | 仅文档弃用。 |
:::

类型：运行时

[`util.isArray()`](/zh/nodejs/api/util#utilisarrayobject) API 已弃用。请使用 `Array.isArray()` 代替。

### DEP0045: `util.isBoolean()` {#dep0045-utilisboolean}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 寿终正寝弃用。 |
| v22.0.0 | 运行时弃用。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v4.0.0, v3.3.1 | 仅文档弃用。 |
:::

类型：寿终正寝

`util.isBoolean()` API 已被移除。请使用 `typeof arg === 'boolean'` 代替。

### DEP0046: `util.isBuffer()` {#dep0046-utilisbuffer}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 寿终正寝弃用。 |
| v22.0.0 | 运行时弃用。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v4.0.0, v3.3.1 | 仅文档弃用。 |
:::

类型：寿终正寝

`util.isBuffer()` API 已被移除。请使用 [`Buffer.isBuffer()`](/zh/nodejs/api/buffer#static-method-bufferisbufferobj) 代替。


### DEP0047: `util.isDate()` {#dep0047-utilisdate}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 生命周期结束弃用。 |
| v22.0.0 | 运行时弃用。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v4.0.0, v3.3.1 | 仅文档弃用。 |
:::

类型：生命周期结束

`util.isDate()` API 已被移除。请使用 `arg instanceof Date` 代替。

### DEP0048: `util.isError()` {#dep0048-utiliserror}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 生命周期结束弃用。 |
| v22.0.0 | 运行时弃用。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v4.0.0, v3.3.1 | 仅文档弃用。 |
:::

类型：生命周期结束

`util.isError()` API 已被移除。请使用 `Object.prototype.toString(arg) === '[object Error]' || arg instanceof Error` 代替。

### DEP0049: `util.isFunction()` {#dep0049-utilisfunction}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 生命周期结束弃用。 |
| v22.0.0 | 运行时弃用。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v4.0.0, v3.3.1 | 仅文档弃用。 |
:::

类型：生命周期结束

`util.isFunction()` API 已被移除。请使用 `typeof arg === 'function'` 代替。

### DEP0050: `util.isNull()` {#dep0050-utilisnull}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 生命周期结束弃用。 |
| v22.0.0 | 运行时弃用。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v4.0.0, v3.3.1 | 仅文档弃用。 |
:::

类型：生命周期结束

`util.isNull()` API 已被移除。请使用 `arg === null` 代替。

### DEP0051: `util.isNullOrUndefined()` {#dep0051-utilisnullorundefined}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 生命周期结束弃用。 |
| v22.0.0 | 运行时弃用。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v4.0.0, v3.3.1 | 仅文档弃用。 |
:::

类型：生命周期结束

`util.isNullOrUndefined()` API 已被移除。请使用 `arg === null || arg === undefined` 代替。


### DEP0052: `util.isNumber()` {#dep0052-utilisnumber}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 停止使用弃用。 |
| v22.0.0 | 运行时弃用。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v4.0.0, v3.3.1 | 仅文档弃用。 |
:::

类型：停止使用

`util.isNumber()` API 已被移除。请使用 `typeof arg === 'number'` 代替。

### DEP0053: `util.isObject()` {#dep0053-utilisobject}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 停止使用弃用。 |
| v22.0.0 | 运行时弃用。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v4.0.0, v3.3.1 | 仅文档弃用。 |
:::

类型：停止使用

`util.isObject()` API 已被移除。请使用 `arg && typeof arg === 'object'` 代替。

### DEP0054: `util.isPrimitive()` {#dep0054-utilisprimitive}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 停止使用弃用。 |
| v22.0.0 | 运行时弃用。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v4.0.0, v3.3.1 | 仅文档弃用。 |
:::

类型：停止使用

`util.isPrimitive()` API 已被移除。请使用 `arg === null || (typeof arg !=='object' && typeof arg !== 'function')` 代替。

### DEP0055: `util.isRegExp()` {#dep0055-utilisregexp}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 停止使用弃用。 |
| v22.0.0 | 运行时弃用。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v4.0.0, v3.3.1 | 仅文档弃用。 |
:::

类型：停止使用

`util.isRegExp()` API 已被移除。请使用 `arg instanceof RegExp` 代替。

### DEP0056: `util.isString()` {#dep0056-utilisstring}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 停止使用弃用。 |
| v22.0.0 | 运行时弃用。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v4.0.0, v3.3.1 | 仅文档弃用。 |
:::

类型：停止使用

`util.isString()` API 已被移除。请使用 `typeof arg === 'string'` 代替。


### DEP0057: `util.isSymbol()` {#dep0057-utilissymbol}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 已停止使用。 |
| v22.0.0 | 运行时弃用。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v4.0.0, v3.3.1 | 仅文档弃用。 |
:::

类型：已停止使用

`util.isSymbol()` API 已被移除。请使用 `typeof arg === 'symbol'` 代替。

### DEP0058: `util.isUndefined()` {#dep0058-utilisundefined}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 已停止使用。 |
| v22.0.0 | 运行时弃用。 |
| v6.12.0, v4.8.6 | 已分配弃用代码。 |
| v4.0.0, v3.3.1 | 仅文档弃用。 |
:::

类型：已停止使用

`util.isUndefined()` API 已被移除。请使用 `arg === undefined` 代替。

### DEP0059: `util.log()` {#dep0059-utillog}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 已停止使用。 |
| v22.0.0 | 运行时弃用。 |
| v6.12.0 | 已分配弃用代码。 |
| v6.0.0 | 仅文档弃用。 |
:::

类型：已停止使用

`util.log()` API 已被移除，因为它是一个未维护的遗留 API，由于意外暴露给用户空间。 相反，请根据您的具体需求考虑以下替代方案：

- **第三方日志库**
- **使用 <code>console.log(new Date().toLocaleString(), message)</code>**

通过采用这些替代方案之一，您可以从 `util.log()` 过渡，并选择一种符合您的应用程序的特定需求和复杂性的日志记录策略。

### DEP0060: `util._extend()` {#dep0060-util_extend}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.0.0 | 运行时弃用。 |
| v6.12.0 | 已分配弃用代码。 |
| v6.0.0 | 仅文档弃用。 |
:::

类型：运行时

[`util._extend()`](/zh/nodejs/api/util#util_extendtarget-source) API 已弃用，因为它是一个未维护的遗留 API，由于意外暴露给用户空间。 请使用 `target = Object.assign(target, source)` 代替。


### DEP0061: `fs.SyncWriteStream` {#dep0061-fssyncwritestream}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v11.0.0 | 已停止使用。 |
| v8.0.0 | 运行时弃用。 |
| v7.0.0 | 仅文档弃用。 |
:::

类型：已停止使用

`fs.SyncWriteStream` 类从未打算作为公开可访问的 API，现已删除。没有可替代的 API。请使用用户空间的替代方案。

### DEP0062: `node --debug` {#dep0062-node---debug}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.0.0 | 已停止使用。 |
| v8.0.0 | 运行时弃用。 |
:::

类型：已停止使用

`--debug` 激活了传统的 V8 调试器接口，该接口已从 V8 5.8 开始删除。它被 Inspector 替代，Inspector 通过 `--inspect` 激活。

### DEP0063: `ServerResponse.prototype.writeHeader()` {#dep0063-serverresponseprototypewriteheader}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v8.0.0 | 仅文档弃用。 |
:::

类型：仅文档

`node:http` 模块的 `ServerResponse.prototype.writeHeader()` API 已弃用。请使用 `ServerResponse.prototype.writeHead()` 代替。

`ServerResponse.prototype.writeHeader()` 方法从未作为官方支持的 API 记录在案。

### DEP0064: `tls.createSecurePair()` {#dep0064-tlscreatesecurepair}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v8.0.0 | 运行时弃用。 |
| v6.12.0 | 已分配弃用代码。 |
| v6.0.0 | 仅文档弃用。 |
| v0.11.15 | 撤销弃用。 |
| v0.11.3 | 运行时弃用。 |
:::

类型：运行时

`tls.createSecurePair()` API 在 Node.js 0.11.3 的文档中已弃用。用户应使用 `tls.Socket` 代替。

### DEP0065: `repl.REPL_MODE_MAGIC` 和 `NODE_REPL_MODE=magic` {#dep0065-replrepl_mode_magic-and-node_repl_mode=magic}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 已停止使用。 |
| v8.0.0 | 仅文档弃用。 |
:::

类型：已停止使用

`node:repl` 模块的 `REPL_MODE_MAGIC` 常量（用于 `replMode` 选项）已被删除。自从 Node.js 6.0.0 导入 V8 5.0 以来，它的行为在功能上与 `REPL_MODE_SLOPPY` 相同。请使用 `REPL_MODE_SLOPPY` 代替。

`NODE_REPL_MODE` 环境变量用于设置交互式 `node` 会话的底层 `replMode`。它的值 `magic` 也被删除。请使用 `sloppy` 代替。


### DEP0066: `OutgoingMessage.prototype._headers, OutgoingMessage.prototype._headerNames` {#dep0066-outgoingmessageprototype_headers-outgoingmessageprototype_headernames}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.0.0 | 运行时弃用。 |
| v8.0.0 | 仅文档弃用。 |
:::

类型: 运行时

`node:http` 模块的 `OutgoingMessage.prototype._headers` 和 `OutgoingMessage.prototype._headerNames` 属性已被弃用。请使用公共方法（例如 `OutgoingMessage.prototype.getHeader()`、`OutgoingMessage.prototype.getHeaders()`、`OutgoingMessage.prototype.getHeaderNames()`、`OutgoingMessage.prototype.getRawHeaderNames()`、`OutgoingMessage.prototype.hasHeader()`、`OutgoingMessage.prototype.removeHeader()`、`OutgoingMessage.prototype.setHeader()`）来处理传出标头。

`OutgoingMessage.prototype._headers` 和 `OutgoingMessage.prototype._headerNames` 属性从未被记录为官方支持的属性。

### DEP0067: `OutgoingMessage.prototype._renderHeaders` {#dep0067-outgoingmessageprototype_renderheaders}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v8.0.0 | 仅文档弃用。 |
:::

类型: 仅文档

`node:http` 模块的 `OutgoingMessage.prototype._renderHeaders()` API 已被弃用。

`OutgoingMessage.prototype._renderHeaders` 属性从未被记录为官方支持的 API。

### DEP0068: `node debug` {#dep0068-node-debug}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | 遗留的 `node debug` 命令已被移除。 |
| v8.0.0 | 运行时弃用。 |
:::

类型: 已终止

`node debug` 对应于遗留的 CLI 调试器，它已被基于 V8 检查器的 CLI 调试器替换，该调试器可通过 `node inspect` 获得。

### DEP0069: `vm.runInDebugContext(string)` {#dep0069-vmrunindebugcontextstring}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 已终止。 |
| v9.0.0 | 运行时弃用。 |
| v8.0.0 | 仅文档弃用。 |
:::

类型: 已终止

DebugContext 已在 V8 中移除，并且在 Node.js 10+ 中不可用。

DebugContext 是一个实验性的 API。

### DEP0070: `async_hooks.currentId()` {#dep0070-async_hookscurrentid}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v9.0.0 | 已终止。 |
| v8.2.0 | 运行时弃用。 |
:::

类型: 已终止

`async_hooks.currentId()` 为了清晰起见，已重命名为 `async_hooks.executionAsyncId()`。

此更改是在 `async_hooks` 是实验性 API 时进行的。


### DEP0071: `async_hooks.triggerId()` {#dep0071-async_hookstriggerid}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v9.0.0 | 已终止生命周期。 |
| v8.2.0 | 运行时弃用。 |
:::

类型：已终止生命周期

`async_hooks.triggerId()` 为了清晰起见，已重命名为 `async_hooks.triggerAsyncId()`。

此更改是在 `async_hooks` 还是实验性 API 时进行的。

### DEP0072: `async_hooks.AsyncResource.triggerId()` {#dep0072-async_hooksasyncresourcetriggerid}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v9.0.0 | 已终止生命周期。 |
| v8.2.0 | 运行时弃用。 |
:::

类型：已终止生命周期

`async_hooks.AsyncResource.triggerId()` 为了清晰起见，已重命名为 `async_hooks.AsyncResource.triggerAsyncId()`。

此更改是在 `async_hooks` 还是实验性 API 时进行的。

### DEP0073: `net.Server` 的多个内部属性 {#dep0073-several-internal-properties-of-netserver}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 已终止生命周期。 |
| v9.0.0 | 运行时弃用。 |
:::

类型：已终止生命周期

访问 `net.Server` 实例的几个名称不当的内部、未记录的属性已被弃用。

由于原始 API 未被记录，并且对于非内部代码通常没有用处，因此没有提供替代 API。

### DEP0074: `REPLServer.bufferedCommand` {#dep0074-replserverbufferedcommand}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | 已终止生命周期。 |
| v9.0.0 | 运行时弃用。 |
:::

类型：已终止生命周期

`REPLServer.bufferedCommand` 属性已被弃用，建议使用 [`REPLServer.clearBufferedCommand()`](/zh/nodejs/api/repl#replserverclearbufferedcommand)。

### DEP0075: `REPLServer.parseREPLKeyword()` {#dep0075-replserverparsereplkeyword}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | 已终止生命周期。 |
| v9.0.0 | 运行时弃用。 |
:::

类型：已终止生命周期

`REPLServer.parseREPLKeyword()` 已从用户区可见性中移除。

### DEP0076: `tls.parseCertString()` {#dep0076-tlsparsecertstring}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 已终止生命周期。 |
| v9.0.0 | 运行时弃用。 |
| v8.6.0 | 仅文档弃用。 |
:::

类型：已终止生命周期

`tls.parseCertString()` 是一个简单的解析助手，由于错误而公开。 虽然它应该解析证书主题和颁发者字符串，但它从未正确处理多值相对区分名称。

本文档的早期版本建议使用 `querystring.parse()` 作为 `tls.parseCertString()` 的替代方法。 但是，`querystring.parse()` 也无法正确处理所有证书主题，因此不应使用。


### DEP0077: `Module._debug()` {#dep0077-module_debug}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v9.0.0 | 运行时弃用。 |
:::

类型：运行时

`Module._debug()` 已弃用。

`Module._debug()` 函数从未被正式记录为受支持的 API。

### DEP0078: `REPLServer.turnOffEditorMode()` {#dep0078-replserverturnoffeditormode}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | 寿命终止。 |
| v9.0.0 | 运行时弃用。 |
:::

类型：寿命终止

`REPLServer.turnOffEditorMode()` 已从用户态可见性中移除。

### DEP0079: 通过 `.inspect()` 在对象上自定义检查函数 {#dep0079-custom-inspection-function-on-objects-via-inspect}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v11.0.0 | 寿命终止。 |
| v10.0.0 | 运行时弃用。 |
| v8.7.0 | 仅文档弃用。 |
:::

类型：寿命终止

使用对象上名为 `inspect` 的属性来为 [`util.inspect()`](/zh/nodejs/api/util#utilinspectobject-options) 指定自定义检查函数已被弃用。 请改用 [`util.inspect.custom`](/zh/nodejs/api/util#utilinspectcustom)。 为了与 6.4.0 之前的 Node.js 版本向后兼容，可以同时指定两者。

### DEP0080: `path._makeLong()` {#dep0080-path_makelong}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v9.0.0 | 仅文档弃用。 |
:::

类型：仅文档

内部 `path._makeLong()` 并非供公共使用。 但是，用户态模块发现它很有用。 内部 API 已被弃用，并替换为相同的公共 `path.toNamespacedPath()` 方法。

### DEP0081: 使用文件描述符的 `fs.truncate()` {#dep0081-fstruncate-using-a-file-descriptor}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v9.0.0 | 运行时弃用。 |
:::

类型：运行时

使用文件描述符的 `fs.truncate()` `fs.truncateSync()` 用法已被弃用。 请使用 `fs.ftruncate()` 或 `fs.ftruncateSync()` 来处理文件描述符。

### DEP0082: `REPLServer.prototype.memory()` {#dep0082-replserverprototypememory}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | 寿命终止。 |
| v9.0.0 | 运行时弃用。 |
:::

类型：寿命终止

`REPLServer.prototype.memory()` 仅对 `REPLServer` 本身的内部机制是必需的。 不要使用此函数。


### DEP0083：通过将 `ecdhCurve` 设置为 `false` 来禁用 ECDH {#dep0083-disabling-ecdh-by-setting-ecdhcurve-to-false}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 寿命终止。 |
| v9.2.0 | 运行时弃用。 |
:::

类型：寿命终止。

`tls.createSecureContext()` 和 `tls.TLSSocket` 的 `ecdhCurve` 选项可以设置为 `false`，仅在服务器上完全禁用 ECDH。 为了迁移到 OpenSSL 1.1.0 并与客户端保持一致，此模式已被弃用，现在不受支持。 请改用 `ciphers` 参数。

### DEP0084：要求捆绑的内部依赖项 {#dep0084-requiring-bundled-internal-dependencies}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.0.0 | 此功能已被移除。 |
| v10.0.0 | 运行时弃用。 |
:::

类型：寿命终止

自 Node.js 4.4.0 和 5.2.0 版本以来，一些仅供内部使用的模块通过 `require()` 错误地暴露给用户代码。 这些模块是：

- `v8/tools/codemap`
- `v8/tools/consarray`
- `v8/tools/csvparser`
- `v8/tools/logreader`
- `v8/tools/profile_view`
- `v8/tools/profile`
- `v8/tools/SourceMap`
- `v8/tools/splaytree`
- `v8/tools/tickprocessor-driver`
- `v8/tools/tickprocessor`
- `node-inspect/lib/_inspect` (从 7.6.0 开始)
- `node-inspect/lib/internal/inspect_client` (从 7.6.0 开始)
- `node-inspect/lib/internal/inspect_repl` (从 7.6.0 开始)

`v8/*` 模块没有任何导出，如果未以特定顺序导入，实际上会抛出错误。 因此，通过 `require()` 导入它们几乎没有合法的用例。

另一方面，`node-inspect` 可以通过包管理器在本地安装，因为它以相同的名称发布在 npm 注册表上。 如果这样做，则无需修改源代码。

### DEP0085：AsyncHooks 敏感 API {#dep0085-asynchooks-sensitive-api}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 寿命终止。 |
| v9.4.0, v8.10.0 | 运行时弃用。 |
:::

类型：寿命终止

AsyncHooks 敏感 API 从未被记录，并且存在各种小问题。 请改用 `AsyncResource` API。 参见 [https://github.com/nodejs/node/issues/15572](https://github.com/nodejs/node/issues/15572)。


### DEP0086: 移除 `runInAsyncIdScope` {#dep0086-remove-runinasyncidscope}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 已停止使用。 |
| v9.4.0, v8.10.0 | 运行时弃用。 |
:::

类型：已停止使用

`runInAsyncIdScope` 不会触发 `'before'` 或 `'after'` 事件，因此可能导致很多问题。 请参阅 [https://github.com/nodejs/node/issues/14328](https://github.com/nodejs/node/issues/14328)。

### DEP0089: `require('node:assert')` {#dep0089-requirenodeassert}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v12.8.0 | 撤销弃用。 |
| v9.9.0, v8.13.0 | 仅文档弃用。 |
:::

类型：撤销弃用

不建议直接导入 assert，因为公开的函数使用宽松的相等性检查。 该弃用已被撤销，因为不鼓励使用 `node:assert` 模块，并且该弃用导致开发人员的困惑。

### DEP0090: 无效的 GCM 身份验证标记长度 {#dep0090-invalid-gcm-authentication-tag-lengths}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v11.0.0 | 已停止使用。 |
| v10.0.0 | 运行时弃用。 |
:::

类型：已停止使用

Node.js 过去支持 OpenSSL 在调用 [`decipher.setAuthTag()`](/zh/nodejs/api/crypto#deciphersetauthtagbuffer-encoding) 时接受的所有 GCM 身份验证标记长度。 从 Node.js v11.0.0 开始，仅允许 128、120、112、104、96、64 和 32 位的身份验证标记长度。 根据 [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf)，其他长度的身份验证标记无效。

### DEP0091: `crypto.DEFAULT_ENCODING` {#dep0091-cryptodefault_encoding}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v20.0.0 | 已停止使用。 |
| v10.0.0 | 运行时弃用。 |
:::

类型：已停止使用

`crypto.DEFAULT_ENCODING` 属性仅存在于与 0.9.3 之前的 Node.js 版本的兼容性，并且已被删除。

### DEP0092: 绑定到 `module.exports` 的顶层 `this` {#dep0092-top-level-this-bound-to-moduleexports}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 仅文档弃用。 |
:::

类型：仅文档

不推荐将属性分配给顶层 `this` 作为 `module.exports` 的替代方法。 开发人员应使用 `exports` 或 `module.exports`。


### DEP0093: `crypto.fips` 已弃用，并被替换 {#dep0093-cryptofips-is-deprecated-and-replaced}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 运行时弃用。 |
| v10.0.0 | 仅文档弃用。 |
:::

类型: 运行时

[`crypto.fips`](/zh/nodejs/api/crypto#cryptofips) 属性已弃用。请改用 `crypto.setFips()` 和 `crypto.getFips()`。

### DEP0094: 使用带有多个参数的 `assert.fail()` {#dep0094-using-assertfail-with-more-than-one-argument}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 运行时弃用。 |
:::

类型: 运行时

使用带有多个参数的 `assert.fail()` 已弃用。请使用只有一个参数的 `assert.fail()` 或使用不同的 `node:assert` 模块方法。

### DEP0095: `timers.enroll()` {#dep0095-timersenroll}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 运行时弃用。 |
:::

类型: 运行时

`timers.enroll()` 已弃用。请改用公开文档化的 [`setTimeout()`](/zh/nodejs/api/timers#settimeoutcallback-delay-args) 或 [`setInterval()`](/zh/nodejs/api/timers#setintervalcallback-delay-args)。

### DEP0096: `timers.unenroll()` {#dep0096-timersunenroll}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 运行时弃用。 |
:::

类型: 运行时

`timers.unenroll()` 已弃用。请改用公开文档化的 [`clearTimeout()`](/zh/nodejs/api/timers#cleartimeouttimeout) 或 [`clearInterval()`](/zh/nodejs/api/timers#clearintervaltimeout)。

### DEP0097: 带有 `domain` 属性的 `MakeCallback` {#dep0097-makecallback-with-domain-property}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 运行时弃用。 |
:::

类型: 运行时

将 `domain` 属性添加到 `MakeCallback` 以携带上下文的用户，应开始使用 `MakeCallback` 或 `CallbackScope` 的 `async_context` 变体，或高级 `AsyncResource` 类。

### DEP0098: AsyncHooks 嵌入器 `AsyncResource.emitBefore` 和 `AsyncResource.emitAfter` API {#dep0098-asynchooks-embedder-asyncresourceemitbefore-and-asyncresourceemitafter-apis}


::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v12.0.0 | 已停止维护。 |
| v10.0.0, v9.6.0, v8.12.0 | 运行时弃用。 |
:::

类型: 已停止维护

AsyncHooks 提供的嵌入式 API 公开了 `.emitBefore()` 和 `.emitAfter()` 方法，这些方法很容易被错误地使用，从而导致无法恢复的错误。

请改用 [`asyncResource.runInAsyncScope()`](/zh/nodejs/api/async_context#asyncresourceruninasyncscopefn-thisarg-args) API，它提供了一种更安全、更方便的替代方案。 请参阅 [https://github.com/nodejs/node/pull/18513](https://github.com/nodejs/node/pull/18513)。


### DEP0099: 异步上下文感知缺失的 `node::MakeCallback` C++ API {#dep0099-async-context-unaware-nodemakecallback-c-apis}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 编译时弃用。 |
:::

类型：编译时

提供给原生插件的某些版本的 `node::MakeCallback` API 已被弃用。请使用接受 `async_context` 参数的 API 版本。

### DEP0100: `process.assert()` {#dep0100-processassert}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 寿命终止。 |
| v10.0.0 | 运行时弃用。 |
| v0.3.7 | 仅文档弃用。 |
:::

类型：寿命终止

`process.assert()` 已弃用。请改用 [`assert`](/zh/nodejs/api/assert) 模块。

这从来都不是一个有文档记录的功能。

### DEP0101: `--with-lttng` {#dep0101---with-lttng}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 寿命终止。 |
:::

类型：寿命终止

`--with-lttng` 编译时选项已被移除。

### DEP0102: 在 `Buffer#(read|write)` 操作中使用 `noAssert` {#dep0102-using-noassert-in-bufferread|write-operations}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 寿命终止。 |
:::

类型：寿命终止

使用 `noAssert` 参数不再具有任何功能。所有输入都会被验证，无论 `noAssert` 的值如何。跳过验证可能会导致难以发现的错误和崩溃。

### DEP0103: `process.binding('util').is[...]` 类型检查 {#dep0103-processbindingutilis-typechecks}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.9.0 | 被 [DEP0111](/zh/nodejs/api/deprecations#DEP0111) 取代。 |
| v10.0.0 | 仅文档弃用。 |
:::

类型：仅文档（支持 [`--pending-deprecation`](/zh/nodejs/api/cli#--pending-deprecation)）

通常应避免使用 `process.binding()`。特别是类型检查方法可以使用 [`util.types`](/zh/nodejs/api/util#utiltypes) 代替。

此弃用已被 `process.binding()` API 的弃用 ([DEP0111](/zh/nodejs/api/deprecations#DEP0111)) 取代。

### DEP0104: `process.env` 字符串强制转换 {#dep0104-processenv-string-coercion}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 仅文档弃用。 |
:::

类型：仅文档（支持 [`--pending-deprecation`](/zh/nodejs/api/cli#--pending-deprecation)）

当将非字符串属性分配给 [`process.env`](/zh/nodejs/api/process#processenv) 时，分配的值会被隐式转换为字符串。如果分配的值不是字符串、布尔值或数字，则此行为已被弃用。将来，此类赋值可能会导致抛出错误。请在将属性分配给 `process.env` 之前将其转换为字符串。


### DEP0105: `decipher.finaltol` {#dep0105-decipherfinaltol}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v11.0.0 | 寿命终止。 |
| v10.0.0 | 运行时弃用。 |
:::

类型：寿命终止

`decipher.finaltol()` 从未被记录，并且是 [`decipher.final()`](/zh/nodejs/api/crypto#decipherfinaloutputencoding) 的别名。 此 API 已被移除，建议改用 [`decipher.final()`](/zh/nodejs/api/crypto#decipherfinaloutputencoding)。

### DEP0106: `crypto.createCipher` 和 `crypto.createDecipher` {#dep0106-cryptocreatecipher-and-cryptocreatedecipher}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.0.0 | 寿命终止。 |
| v11.0.0 | 运行时弃用。 |
| v10.0.0 | 仅文档弃用。 |
:::

类型：寿命终止

`crypto.createCipher()` 和 `crypto.createDecipher()` 已被移除，因为它们使用弱密钥派生函数（没有盐的 MD5）和静态初始化向量。 建议使用带有随机盐的 [`crypto.pbkdf2()`](/zh/nodejs/api/crypto#cryptopbkdf2password-salt-iterations-keylen-digest-callback) 或 [`crypto.scrypt()`](/zh/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) 派生密钥，并使用 [`crypto.createCipheriv()`](/zh/nodejs/api/crypto#cryptocreatecipherivalgorithm-key-iv-options) 和 [`crypto.createDecipheriv()`](/zh/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) 来获取 [`Cipher`](/zh/nodejs/api/crypto#class-cipher) 和 [`Decipher`](/zh/nodejs/api/crypto#class-decipher) 对象。

### DEP0107: `tls.convertNPNProtocols()` {#dep0107-tlsconvertnpnprotocols}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v11.0.0 | 寿命终止。 |
| v10.0.0 | 运行时弃用。 |
:::

类型：寿命终止

这是一个未记录的辅助函数，不打算在 Node.js 核心之外使用，并且已被移除的 NPN（下一代协议协商）支持所取代。

### DEP0108: `zlib.bytesRead` {#dep0108-zlibbytesread}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 寿命终止。 |
| v11.0.0 | 运行时弃用。 |
| v10.0.0 | 仅文档弃用。 |
:::

类型：寿命终止

已弃用的 [`zlib.bytesWritten`](/zh/nodejs/api/zlib#zlibbyteswritten) 别名。 最初选择这个名称是因为将该值解释为引擎读取的字节数也是有意义的，但这与 Node.js 中以这些名称公开值的其他流不一致。


### DEP0109：`http`、`https` 和 `tls` 支持无效 URL {#dep0109-http-https-and-tls-support-for-invalid-urls}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v16.0.0 | 终止生命周期。 |
| v11.0.0 | 运行时弃用。 |
:::

类型：终止生命周期

一些先前支持的（但严格来说无效的）URL 通过 [`http.request()`](/zh/nodejs/api/http#httprequestoptions-callback)、[`http.get()`](/zh/nodejs/api/http#httpgetoptions-callback)、[`https.request()`](/zh/nodejs/api/https#httpsrequestoptions-callback)、[`https.get()`](/zh/nodejs/api/https#httpgetoptions-callback) 和 [`tls.checkServerIdentity()`](/zh/nodejs/api/tls#tlscheckserveridentityhostname-cert) API 接受，因为这些 API 被旧版 `url.parse()` API 接受。 上述 API 现在使用 WHATWG URL 解析器，该解析器要求 URL 必须严格有效。 传递无效 URL 已被弃用，并且未来将移除支持。

### DEP0110：`vm.Script` 缓存数据 {#dep0110-vmscript-cached-data}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.6.0 | 仅文档弃用。 |
:::

类型：仅文档

`produceCachedData` 选项已弃用。 请改用 [`script.createCachedData()`](/zh/nodejs/api/vm#scriptcreatecacheddata)。

### DEP0111：`process.binding()` {#dep0111-processbinding}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v11.12.0 | 添加了对 `--pending-deprecation` 的支持。 |
| v10.9.0 | 仅文档弃用。 |
:::

类型：仅文档（支持 [`--pending-deprecation`](/zh/nodejs/api/cli#--pending-deprecation)）

`process.binding()` 仅供 Node.js 内部代码使用。

虽然 `process.binding()` 通常尚未达到终止生命周期状态，但在启用[权限模型](/zh/nodejs/api/permissions#permission-model)时不可用。

### DEP0112：`dgram` 私有 API {#dep0112-dgram-private-apis}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v11.0.0 | 运行时弃用。 |
:::

类型：运行时

`node:dgram` 模块以前包含几个 API，这些 API 从未打算在 Node.js 核心之外访问：`Socket.prototype._handle`、`Socket.prototype._receiving`、`Socket.prototype._bindState`、`Socket.prototype._queue`、`Socket.prototype._reuseAddr`、`Socket.prototype._healthCheck()`、`Socket.prototype._stopReceiving()` 和 `dgram._createSocketHandle()`。


### DEP0113: `Cipher.setAuthTag()`, `Decipher.getAuthTag()` {#dep0113-ciphersetauthtag-deciphergetauthtag}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.0.0 | 已停止使用。 |
| v11.0.0 | 运行时弃用。 |
:::

类型：已停止使用

`Cipher.setAuthTag()` 和 `Decipher.getAuthTag()` 不再可用。 它们从未被记录，并且在调用时会抛出错误。

### DEP0114: `crypto._toBuf()` {#dep0114-crypto_tobuf}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.0.0 | 已停止使用。 |
| v11.0.0 | 运行时弃用。 |
:::

类型：已停止使用

`crypto._toBuf()` 函数并非设计为供 Node.js 核心之外的模块使用，因此已被删除。

### DEP0115: `crypto.prng()`, `crypto.pseudoRandomBytes()`, `crypto.rng()` {#dep0115-cryptoprng-cryptopseudorandombytes-cryptorng}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v11.0.0 | 添加了仅文档弃用，并支持 `--pending-deprecation`。 |
:::

类型：仅文档（支持 [`--pending-deprecation`](/zh/nodejs/api/cli#--pending-deprecation)）

在 Node.js 的最新版本中，[`crypto.randomBytes()`](/zh/nodejs/api/crypto#cryptorandombytessize-callback) 和 `crypto.pseudoRandomBytes()` 之间没有区别。 后者已弃用，同时弃用的还有未记录的别名 `crypto.prng()` 和 `crypto.rng()`，建议使用 [`crypto.randomBytes()`](/zh/nodejs/api/crypto#cryptorandombytessize-callback)，并可能在未来的版本中删除。

### DEP0116: 遗留 URL API {#dep0116-legacy-url-api}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0, v18.13.0 | `url.parse()` 在 DEP0169 中再次被弃用。 |
| v15.13.0, v14.17.0 | 撤销弃用。 状态更改为“遗留”。 |
| v11.0.0 | 仅文档弃用。 |
:::

类型：撤销弃用

[遗留 URL API](/zh/nodejs/api/url#legacy-url-api) 已弃用。 这包括 [`url.format()`](/zh/nodejs/api/url#urlformaturlobject), [`url.parse()`](/zh/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost), [`url.resolve()`](/zh/nodejs/api/url#urlresolvefrom-to), 和 [遗留 `urlObject`](/zh/nodejs/api/url#legacy-urlobject)。 请改用 [WHATWG URL API](/zh/nodejs/api/url#the-whatwg-url-api)。


### DEP0117: Native crypto handles {#dep0117-native-crypto-handles}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.0.0 | 已终止。 |
| v11.0.0 | 运行时弃用。 |
:::

类型: 已终止

之前版本的 Node.js 通过 `Cipher`、`Decipher`、`DiffieHellman`、`DiffieHellmanGroup`、`ECDH`、`Hash`、`Hmac`、`Sign` 和 `Verify` 类的 `_handle` 属性暴露了内部原生对象的句柄。 `_handle` 属性已被删除，因为不正确地使用原生对象可能会导致应用程序崩溃。

### DEP0118: 对虚值主机名支持 `dns.lookup()` {#dep0118-dnslookup-support-for-a-falsy-host-name}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v11.0.0 | 运行时弃用。 |
:::

类型: 运行时

由于向后兼容性，以前版本的 Node.js 支持带有虚值主机名的 `dns.lookup()`，例如 `dns.lookup(false)`。 此行为未记录，并且被认为在真实世界的应用程序中未使用。 在未来版本的 Node.js 中，这将变成一个错误。

### DEP0119: `process.binding('uv').errname()` 私有 API {#dep0119-processbindinguverrname-private-api}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v11.0.0 | 仅文档弃用。 |
:::

类型: 仅文档（支持 [`--pending-deprecation`](/zh/nodejs/api/cli#--pending-deprecation)）

`process.binding('uv').errname()` 已弃用。 请改用 [`util.getSystemErrorName()`](/zh/nodejs/api/util#utilgetsystemerrornameerr)。

### DEP0120: Windows 性能计数器支持 {#dep0120-windows-performance-counter-support}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.0.0 | 已终止。 |
| v11.0.0 | 运行时弃用。 |
:::

类型: 已终止

Windows 性能计数器支持已从 Node.js 中删除。 未记录的 `COUNTER_NET_SERVER_CONNECTION()`、`COUNTER_NET_SERVER_CONNECTION_CLOSE()`、`COUNTER_HTTP_SERVER_REQUEST()`、`COUNTER_HTTP_SERVER_RESPONSE()`、`COUNTER_HTTP_CLIENT_REQUEST()` 和 `COUNTER_HTTP_CLIENT_RESPONSE()` 函数已被弃用。

### DEP0121: `net._setSimultaneousAccepts()` {#dep0121-net_setsimultaneousaccepts}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.0.0 | 运行时弃用。 |
:::

类型: 运行时

未记录的 `net._setSimultaneousAccepts()` 函数最初用于在使用 Windows 上的 `node:child_process` 和 `node:cluster` 模块时进行调试和性能调整。 该函数通常没有用，将被删除。 参见此处的讨论：[https://github.com/nodejs/node/issues/18391](https://github.com/nodejs/node/issues/18391)


### DEP0122: `tls` `Server.prototype.setOptions()` {#dep0122-tls-serverprototypesetoptions}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.0.0 | 运行时弃用。 |
:::

类型：运行时

请使用 `Server.prototype.setSecureContext()` 代替。

### DEP0123: 将 TLS ServerName 设置为 IP 地址 {#dep0123-setting-the-tls-servername-to-an-ip-address}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.0.0 | 运行时弃用。 |
:::

类型：运行时

[RFC 6066](https://tools.ietf.org/html/rfc6066#section-3) 不允许将 TLS ServerName 设置为 IP 地址。 这将在未来的版本中被忽略。

### DEP0124: 使用 `REPLServer.rli` {#dep0124-using-replserverrli}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | 已停止使用。 |
| v12.0.0 | 运行时弃用。 |
:::

类型：已停止使用

此属性是对实例本身的引用。

### DEP0125: `require('node:_stream_wrap')` {#dep0125-requirenode_stream_wrap}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.0.0 | 运行时弃用。 |
:::

类型：运行时

`node:_stream_wrap` 模块已弃用。

### DEP0126: `timers.active()` {#dep0126-timersactive}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v11.14.0 | 运行时弃用。 |
:::

类型：运行时

先前未公开的 `timers.active()` 已弃用。 请改用公开文档的 [`timeout.refresh()`](/zh/nodejs/api/timers#timeoutrefresh)。 如果需要重新引用超时，则可以使用 [`timeout.ref()`](/zh/nodejs/api/timers#timeoutref)，自 Node.js 10 以来不会影响性能。

### DEP0127: `timers._unrefActive()` {#dep0127-timers_unrefactive}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v11.14.0 | 运行时弃用。 |
:::

类型：运行时

先前未公开且“私有”的 `timers._unrefActive()` 已弃用。 请改用公开文档的 [`timeout.refresh()`](/zh/nodejs/api/timers#timeoutrefresh)。 如果需要取消引用超时，则可以使用 [`timeout.unref()`](/zh/nodejs/api/timers#timeoutunref)，自 Node.js 10 以来不会影响性能。

### DEP0128: 具有无效 `main` 条目和 `index.js` 文件的模块 {#dep0128-modules-with-an-invalid-main-entry-and-an-indexjs-file}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v16.0.0 | 运行时弃用。 |
| v12.0.0 | 仅文档。 |
:::

类型：运行时

具有无效 `main` 条目（例如，`./does-not-exist.js`）并且在顶层目录中也有 `index.js` 文件的模块将解析 `index.js` 文件。 这已被弃用，并且将在未来的 Node.js 版本中抛出错误。


### DEP0129: `ChildProcess._channel` {#dep0129-childprocess_channel}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.0.0 | 运行时弃用。 |
| v11.14.0 | 仅文档。 |
:::

类型: 运行时

`spawn()` 和类似函数返回的子进程对象的 `_channel` 属性不供公共使用。请改用 `ChildProcess.channel`。

### DEP0130: `Module.createRequireFromPath()` {#dep0130-modulecreaterequirefrompath}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v16.0.0 | 已停止使用。 |
| v13.0.0 | 运行时弃用。 |
| v12.2.0 | 仅文档。 |
:::

类型: 已停止使用

请改用 [`module.createRequire()`](/zh/nodejs/api/module#modulecreaterequirefilename)。

### DEP0131: 遗留 HTTP 解析器 {#dep0131-legacy-http-parser}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.0.0 | 此功能已被移除。 |
| v12.22.0 | 运行时弃用。 |
| v12.3.0 | 仅文档。 |
:::

类型: 已停止使用

Node.js 12.0.0 之前的版本默认使用的遗留 HTTP 解析器已被弃用，并在 v13.0.0 中被移除。 在 v13.0.0 之前，可以使用 `--http-parser=legacy` 命令行标志恢复为使用遗留解析器。

### DEP0132: 带有回调的 `worker.terminate()` {#dep0132-workerterminate-with-callback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.5.0 | 运行时弃用。 |
:::

类型: 运行时

将回调传递给 [`worker.terminate()`](/zh/nodejs/api/worker_threads#workerterminate) 已被弃用。 请改用返回的 `Promise`，或 worker 的 `'exit'` 事件的监听器。

### DEP0133: `http` `connection` {#dep0133-http-connection}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.12.0 | 仅文档弃用。 |
:::

类型: 仅文档

优先使用 [`response.socket`](/zh/nodejs/api/http#responsesocket) 而不是 [`response.connection`](/zh/nodejs/api/http#responseconnection)，以及 [`request.socket`](/zh/nodejs/api/http#requestsocket) 而不是 [`request.connection`](/zh/nodejs/api/http#requestconnection)。

### DEP0134: `process._tickCallback` {#dep0134-process_tickcallback}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v12.12.0 | 仅文档弃用。 |
:::

类型: 仅文档（支持 [`--pending-deprecation`](/zh/nodejs/api/cli#--pending-deprecation)）

`process._tickCallback` 属性从未作为正式支持的 API 记录在案。


### DEP0135: `WriteStream.open()` 和 `ReadStream.open()` 是内部 API {#dep0135-writestreamopen-and-readstreamopen-are-internal}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.0.0 | 运行时弃用。 |
:::

类型：运行时

[`WriteStream.open()`](/zh/nodejs/api/fs#class-fswritestream) 和 [`ReadStream.open()`](/zh/nodejs/api/fs#class-fsreadstream) 是未文档化的内部 API，在用户空间中使用没有意义。文件流应始终通过其对应的工厂方法 [`fs.createWriteStream()`](/zh/nodejs/api/fs#fscreatewritestreampath-options) 和 [`fs.createReadStream()`](/zh/nodejs/api/fs#fscreatereadstreampath-options)) 或通过在选项中传递文件描述符来打开。

### DEP0136: `http` `finished` {#dep0136-http-finished}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.4.0, v12.16.0 | 仅文档弃用。 |
:::

类型：仅文档

[`response.finished`](/zh/nodejs/api/http#responsefinished) 指示是否已调用 [`response.end()`](/zh/nodejs/api/http#responseenddata-encoding-callback)，而不是是否已发出 `'finish'` 并且底层数据已刷新。

请相应地使用 [`response.writableFinished`](/zh/nodejs/api/http#responsewritablefinished) 或 [`response.writableEnded`](/zh/nodejs/api/http#responsewritableended) 以避免歧义。

为了保持现有行为，`response.finished` 应替换为 `response.writableEnded`。

### DEP0137: 在垃圾回收时关闭 fs.FileHandle {#dep0137-closing-fsfilehandle-on-garbage-collection}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.0.0 | 运行时弃用。 |
:::

类型：运行时

允许在垃圾回收时关闭 [`fs.FileHandle`](/zh/nodejs/api/fs#class-filehandle) 对象已被弃用。将来，这样做可能会导致抛出一个错误，该错误将终止该进程。

请确保在不再需要 `fs.FileHandle` 时，使用 `FileHandle.prototype.close()` 显式关闭所有 `fs.FileHandle` 对象：

```js [ESM]
const fsPromises = require('node:fs').promises;
async function openAndClose() {
  let filehandle;
  try {
    filehandle = await fsPromises.open('thefile.txt', 'r');
  } finally {
    if (filehandle !== undefined)
      await filehandle.close();
  }
}
```

### DEP0138: `process.mainModule` {#dep0138-processmainmodule}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.0.0 | 仅文档弃用。 |
:::

类型: 仅文档

[`process.mainModule`](/zh/nodejs/api/process#processmainmodule) 是一个仅 CommonJS 的特性，而 `process` 全局对象与非 CommonJS 环境共享。不支持在 ECMAScript 模块中使用它。

建议使用 [`require.main`](/zh/nodejs/api/modules#accessing-the-main-module) 代替它，因为它具有相同的作用并且仅在 CommonJS 环境中可用。

### DEP0139: 无参数的 `process.umask()` {#dep0139-processumask-with-no-arguments}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.0.0, v12.19.0 | 仅文档弃用。 |
:::

类型: 仅文档

不带参数调用 `process.umask()` 会导致进程范围内的 umask 被写入两次。 这会在线程之间引入竞争条件，并且存在潜在的安全漏洞。 没有安全的、跨平台的替代 API。

### DEP0140: 使用 `request.destroy()` 代替 `request.abort()` {#dep0140-use-requestdestroy-instead-of-requestabort}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.1.0, v13.14.0 | 仅文档弃用。 |
:::

类型: 仅文档

使用 [`request.destroy()`](/zh/nodejs/api/http#requestdestroyerror) 代替 [`request.abort()`](/zh/nodejs/api/http#requestabort)。

### DEP0141: `repl.inputStream` 和 `repl.outputStream` {#dep0141-replinputstream-and-reploutputstream}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.3.0 | 仅文档（支持 [`--pending-deprecation`][]）。 |
:::

类型: 仅文档（支持 [`--pending-deprecation`](/zh/nodejs/api/cli#--pending-deprecation)）

`node:repl` 模块导出了输入和输出流两次。 使用 `.input` 代替 `.inputStream`，使用 `.output` 代替 `.outputStream`。

### DEP0142: `repl._builtinLibs` {#dep0142-repl_builtinlibs}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.3.0 | 仅文档。 |
:::

类型: 仅文档

`node:repl` 模块导出一个 `_builtinLibs` 属性，其中包含一个内置模块的数组。 到目前为止，它是不完整的，最好依赖 `require('node:module').builtinModules`。


### DEP0143: `Transform._transformState` {#dep0143-transform_transformstate}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v14.5.0 | 运行时弃用。 |
:::

类型：运行时 `Transform._transformState` 将在未来的版本中移除，因为它不再需要，这是由于实现的简化。

### DEP0144: `module.parent` {#dep0144-moduleparent}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v14.6.0, v12.19.0 | 仅文档弃用。 |
:::

类型：仅文档（支持 [`--pending-deprecation`](/zh/nodejs/api/cli#--pending-deprecation)）

CommonJS 模块可以使用 `module.parent` 访问第一个需要它的模块。此功能已弃用，因为它在存在 ECMAScript 模块时无法一致地工作，并且因为它给出了 CommonJS 模块图的不准确表示。

一些模块使用它来检查它们是否是当前进程的入口点。相反，建议比较 `require.main` 和 `module`：

```js [ESM]
if (require.main === module) {
  // 仅当当前文件是入口点时才运行的代码段。
}
```
当查找需要当前 CommonJS 模块的模块时，可以使用 `require.cache` 和 `module.children`：

```js [ESM]
const moduleParents = Object.values(require.cache)
  .filter((m) => m.children.includes(module));
```
### DEP0145: `socket.bufferSize` {#dep0145-socketbuffersize}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v14.6.0 | 仅文档弃用。 |
:::

类型：仅文档

[`socket.bufferSize`](/zh/nodejs/api/net#socketbuffersize) 只是 [`writable.writableLength`](/zh/nodejs/api/stream#writablewritablelength) 的别名。

### DEP0146: `new crypto.Certificate()` {#dep0146-new-cryptocertificate}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v14.9.0 | 仅文档弃用。 |
:::

类型：仅文档

[`crypto.Certificate()` 构造函数](/zh/nodejs/api/crypto#legacy-api) 已弃用。请改用 [`crypto.Certificate()` 的静态方法](/zh/nodejs/api/crypto#class-certificate)。

### DEP0147: `fs.rmdir(path, { recursive: true })` {#dep0147-fsrmdirpath-{-recursive-true-}}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v16.0.0 | 运行时弃用。 |
| v15.0.0 | 运行时弃用宽松行为。 |
| v14.14.0 | 仅文档弃用。 |
:::

类型：运行时

在未来版本的 Node.js 中，`recursive` 选项将被 `fs.rmdir`、`fs.rmdirSync` 和 `fs.promises.rmdir` 忽略。

请改用 `fs.rm(path, { recursive: true, force: true })`、`fs.rmSync(path, { recursive: true, force: true })` 或 `fs.promises.rm(path, { recursive: true, force: true })`。


### DEP0148: `"exports"` 中的文件夹映射（尾部的 `"/"`） {#dep0148-folder-mappings-in-"exports"-trailing-"/"}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v17.0.0 | 寿命终止。 |
| v16.0.0 | 运行时弃用。 |
| v15.1.0 | 运行时弃用自引用导入。 |
| v14.13.0 | 仅文档弃用。 |
:::

类型：运行时

在[子路径导出](/zh/nodejs/api/packages#subpath-exports)或[子路径导入](/zh/nodejs/api/packages#subpath-imports)字段中使用尾部的 `"/"` 定义子路径文件夹映射已被弃用。 请改用[子路径模式](/zh/nodejs/api/packages#subpath-patterns)。

### DEP0149: `http.IncomingMessage#connection` {#dep0149-httpincomingmessageconnection}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v16.0.0 | 仅文档弃用。 |
:::

类型：仅文档。

建议使用 [`message.socket`](/zh/nodejs/api/http#messagesocket) 代替 [`message.connection`](/zh/nodejs/api/http#messageconnection)。

### DEP0150: 更改 `process.config` 的值 {#dep0150-changing-the-value-of-processconfig}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 寿命终止。 |
| v16.0.0 | 运行时弃用。 |
:::

类型：寿命终止

`process.config` 属性提供对 Node.js 编译时设置的访问。 但是，该属性是可变的，因此容易被篡改。 在未来的 Node.js 版本中，更改该值的能力将被移除。

### DEP0151: 主索引查找和扩展搜索 {#dep0151-main-index-lookup-and-extension-searching}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v16.0.0 | 运行时弃用。 |
| v15.8.0, v14.18.0 | 带有 `--pending-deprecation` 支持的仅文档弃用。 |
:::

类型：运行时

以前，`index.js` 和扩展名搜索查找适用于 `import 'pkg'` 主入口点解析，即使在解析 ES 模块时也是如此。

在此弃用之后，所有 ES 模块主入口点解析都需要一个明确的[`"exports"` 或 `"main"` 条目](/zh/nodejs/api/packages#main-entry-point-export)，并带有确切的文件扩展名。

### DEP0152: 扩展 PerformanceEntry 属性 {#dep0152-extension-performanceentry-properties}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v16.0.0 | 运行时弃用。 |
:::

类型：运行时

`'gc'`、`'http2'` 和 `'http'` [\<PerformanceEntry\>](/zh/nodejs/api/perf_hooks#class-performanceentry) 对象类型具有分配给它们的附加属性，这些属性提供附加信息。 这些属性现在可以在 `PerformanceEntry` 对象的标准 `detail` 属性中找到。 现有的访问器已被弃用，不应再使用。


### DEP0153: `dns.lookup` 和 `dnsPromises.lookup` 选项类型强制转换 {#dep0153-dnslookup-and-dnspromiseslookup-options-type-coercion}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 寿命终止。 |
| v17.0.0 | 运行时弃用。 |
| v16.8.0 | 仅文档弃用。 |
:::

类型: 寿命终止

在 [`dns.lookup()`](/zh/nodejs/api/dns#dnslookuphostname-options-callback) 和 [`dnsPromises.lookup()`](/zh/nodejs/api/dns#dnspromiseslookuphostname-options) 中，对 `family` 选项使用非 nullish 的非整数值，对 `hints` 选项使用非 nullish 的非数值，对 `all` 选项使用非 nullish 的非布尔值，或对 `verbatim` 选项使用非 nullish 的非布尔值，会抛出 `ERR_INVALID_ARG_TYPE` 错误。

### DEP0154: RSA-PSS 生成密钥对选项 {#dep0154-rsa-pss-generate-key-pair-options}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.0.0 | 运行时弃用。 |
| v16.10.0 | 仅文档弃用。 |
:::

类型: 运行时

`'hash'` 和 `'mgf1Hash'` 选项已替换为 `'hashAlgorithm'` 和 `'mgf1HashAlgorithm'`。

### DEP0155: 模式说明符解析中的尾部斜杠 {#dep0155-trailing-slashes-in-pattern-specifier-resolutions}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v17.0.0 | 运行时弃用。 |
| v16.10.0 | 仅文档弃用，支持 `--pending-deprecation`。 |
:::

类型: 运行时

对于包 `"exports"` 和 `"imports"` 模式解析，以 `"/"` 结尾的说明符（如 `import 'pkg/x/'`）的重新映射已被弃用。

### DEP0156: `http` 中的 `.aborted` 属性和 `'abort'`、`'aborted'` 事件 {#dep0156-aborted-property-and-abort-aborted-event-in-http}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v17.0.0, v16.12.0 | 仅文档弃用。 |
:::

类型: 仅文档

改用 [\<Stream\>](/zh/nodejs/api/stream#stream) API，因为 [`http.ClientRequest`](/zh/nodejs/api/http#class-httpclientrequest)、[`http.ServerResponse`](/zh/nodejs/api/http#class-httpserverresponse) 和 [`http.IncomingMessage`](/zh/nodejs/api/http#class-httpincomingmessage) 都是基于流的。 检查 `stream.destroyed` 而不是 `.aborted` 属性，并监听 `'close'` 而不是 `'abort'`、`'aborted'` 事件。

`.aborted` 属性和 `'abort'` 事件仅用于检测 `.abort()` 调用。 对于提前关闭请求，使用 Stream `.destroy([error])`，然后检查 `.destroyed` 属性和 `'close'` 事件应具有相同的效果。 接收端还应检查 [`http.IncomingMessage`](/zh/nodejs/api/http#class-httpincomingmessage) 上的 [`readable.readableEnded`](/zh/nodejs/api/stream#readablereadableended) 值，以了解它是中止还是正常销毁。


### DEP0157: 流中的 Thenable 支持 {#dep0157-thenable-support-in-streams}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 已停止使用。 |
| v17.2.0, v16.14.0 | 仅文档弃用。 |
:::

类型：已停止使用

Node.js 流的一个未公开的特性是支持在实现方法中使用 thenable。 这现在已被弃用，请改用回调，并避免将异步函数用于流实现方法。

此特性导致用户遇到意外问题，即用户以回调方式实现函数，但使用例如 async 方法，这将导致错误，因为混合 promise 和回调语义是无效的。

```js [ESM]
const w = new Writable({
  async final(callback) {
    await someOp();
    callback();
  },
});
```
### DEP0158: `buffer.slice(start, end)` {#dep0158-bufferslicestart-end}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v17.5.0, v16.15.0 | 仅文档弃用。 |
:::

类型：仅文档

此方法已被弃用，因为它与 `Uint8Array.prototype.slice()` 不兼容，而后者是 `Buffer` 的超类。

请改用 [`buffer.subarray`](/zh/nodejs/api/buffer#bufsubarraystart-end)，它的作用相同。

### DEP0159: `ERR_INVALID_CALLBACK` {#dep0159-err_invalid_callback}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 已停止使用。 |
:::

类型：已停止使用

由于为值类型验证添加了更多混淆，因此已删除此错误代码。

### DEP0160: `process.on('multipleResolves', handler)` {#dep0160-processonmultipleresolves-handler}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.0.0 | 运行时弃用。 |
| v17.6.0, v16.15.0 | 仅文档弃用。 |
:::

类型：运行时。

此事件已被弃用，因为它不适用于 V8 promise 组合器，这降低了它的实用性。

### DEP0161: `process._getActiveRequests()` 和 `process._getActiveHandles()` {#dep0161-process_getactiverequests-and-process_getactivehandles}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v17.6.0, v16.15.0 | 仅文档弃用。 |
:::

类型：仅文档

`process._getActiveHandles()` 和 `process._getActiveRequests()` 函数并非供公共使用，可能会在未来的版本中删除。

使用 [`process.getActiveResourcesInfo()`](/zh/nodejs/api/process#processgetactiveresourcesinfo) 获取活动资源类型的列表，而不是实际的引用。


### DEP0162: `fs.write()`, `fs.writeFileSync()` 强制转换为字符串 {#dep0162-fswrite-fswritefilesync-coercion-to-string}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 生命周期结束。 |
| v18.0.0 | 运行时弃用。 |
| v17.8.0, v16.15.0 | 仅文档弃用。 |
:::

类型：生命周期结束

将具有自有 `toString` 属性的对象隐式强制转换为字符串，并作为第二个参数传递给 [`fs.write()`](/zh/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback)，[`fs.writeFile()`](/zh/nodejs/api/fs#fswritefilefile-data-options-callback)，[`fs.appendFile()`](/zh/nodejs/api/fs#fsappendfilepath-data-options-callback)，[`fs.writeFileSync()`](/zh/nodejs/api/fs#fswritefilesyncfile-data-options) 和 [`fs.appendFileSync()`](/zh/nodejs/api/fs#fsappendfilesyncpath-data-options) 已弃用。 将它们转换为原始字符串。

### DEP0163: `channel.subscribe(onMessage)`, `channel.unsubscribe(onMessage)` {#dep0163-channelsubscribeonmessage-channelunsubscribeonmessage}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v18.7.0, v16.17.0 | 仅文档弃用。 |
:::

类型：仅文档

这些方法已被弃用，因为它们可以以一种无法保持通道引用足够长的时间来接收事件的方式使用。

请改用 [`diagnostics_channel.subscribe(name, onMessage)`](/zh/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage) 或 [`diagnostics_channel.unsubscribe(name, onMessage)`](/zh/nodejs/api/diagnostics_channel#diagnostics_channelunsubscribename-onmessage)，它们的功能相同。

### DEP0164: `process.exit(code)`, `process.exitCode` 强制转换为整数 {#dep0164-processexitcode-processexitcode-coercion-to-integer}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v20.0.0 | 生命周期结束。 |
| v19.0.0 | 运行时弃用。 |
| v18.10.0, v16.18.0 | `process.exitCode` 整数强制转换的仅文档弃用。 |
| v18.7.0, v16.17.0 | `process.exit(code)` 整数强制转换的仅文档弃用。 |
:::

类型：生命周期结束

除 `undefined`、`null`、整数数字和整数字符串（例如，`'1'`）之外的值，不建议用作 [`process.exit()`](/zh/nodejs/api/process#processexitcode) 中 `code` 参数的值和赋值给 [`process.exitCode`](/zh/nodejs/api/process#processexitcode_1) 的值。


### DEP0165: `--trace-atomics-wait` {#dep0165---trace-atomics-wait}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 已停止使用。 |
| v22.0.0 | 运行时弃用。 |
| v18.8.0, v16.18.0 | 仅文档弃用。 |
:::

类型：已停止使用

`--trace-atomics-wait` 标志已被移除，因为它使用了 V8 钩子 `SetAtomicsWaitCallback`，该钩子将在未来的 V8 版本中被移除。

### DEP0166: imports 和 exports 目标中的双斜杠 {#dep0166-double-slashes-in-imports-and-exports-targets}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 运行时弃用。 |
| v18.10.0 | 仅文档弃用，支持 `--pending-deprecation`。 |
:::

类型：运行时

包 imports 和 exports 目标映射到包含双斜杠（*"/"* 或 *"\"*）的路径已被弃用，并且在未来的版本中将会因解析验证错误而失败。同样的弃用也适用于以斜杠开头或结尾的模式匹配。

### DEP0167: 弱 `DiffieHellmanGroup` 实例 (`modp1`, `modp2`, `modp5`) {#dep0167-weak-diffiehellmangroup-instances-modp1-modp2-modp5}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.10.0, v16.18.0 | 仅文档弃用。 |
:::

类型：仅文档

众所周知的 MODP 组 `modp1`、`modp2` 和 `modp5` 已被弃用，因为它们对于实际攻击来说并不安全。 有关详细信息，请参见 [RFC 8247 Section 2.4](https://www.rfc-editor.org/rfc/rfc8247#section-2.4)。

这些组可能会在 Node.js 的未来版本中被移除。 依赖于这些组的应用程序应该评估使用更强的 MODP 组来代替。

### DEP0168: Node-API 回调中未处理的异常 {#dep0168-unhandled-exception-in-node-api-callbacks}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.3.0, v16.17.0 | 运行时弃用。 |
:::

类型：运行时

现在不推荐隐式抑制 Node-API 回调中未捕获的异常。

设置标志 [`--force-node-api-uncaught-exceptions-policy`](/zh/nodejs/api/cli#--force-node-api-uncaught-exceptions-policy) 以强制 Node.js 在异常未在 Node-API 回调中处理时发出 [`'uncaughtException'`](/zh/nodejs/api/process#event-uncaughtexception) 事件。


### DEP0169: 不安全的 url.parse() {#dep0169-insecure-urlparse}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.9.0, v18.17.0 | 增加了对 `--pending-deprecation` 的支持。 |
| v19.0.0, v18.13.0 | 仅文档弃用。 |
:::

类型：仅文档（支持 [`--pending-deprecation`](/zh/nodejs/api/cli#--pending-deprecation)）

[`url.parse()`](/zh/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) 的行为未标准化，并且容易出错，这些错误具有安全隐患。 请改用 [WHATWG URL API](/zh/nodejs/api/url#the-whatwg-url-api)。 CVE 不会针对 `url.parse()` 漏洞发布。

### DEP0170: 使用 `url.parse()` 时的无效端口 {#dep0170-invalid-port-when-using-urlparse}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.0.0 | 运行时弃用。 |
| v19.2.0, v18.13.0 | 仅文档弃用。 |
:::

类型：运行时

[`url.parse()`](/zh/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) 接受带有非数字端口的 URL。 此行为可能会导致使用意外输入进行主机名欺骗。 这些 URL 将在 Node.js 的未来版本中抛出错误，因为 [WHATWG URL API](/zh/nodejs/api/url#the-whatwg-url-api) 已经这样做了。

### DEP0171: `http.IncomingMessage` 标头和尾部的设置器 {#dep0171-setters-for-httpincomingmessage-headers-and-trailers}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v19.3.0, v18.13.0 | 仅文档弃用。 |
:::

类型：仅文档

在 Node.js 的未来版本中，[`message.headers`](/zh/nodejs/api/http#messageheaders)、[`message.headersDistinct`](/zh/nodejs/api/http#messageheadersdistinct)、[`message.trailers`](/zh/nodejs/api/http#messagetrailers) 和 [`message.trailersDistinct`](/zh/nodejs/api/http#messagetrailersdistinct) 将为只读。

### DEP0172: 绑定到 `AsyncResource` 函数的 `asyncResource` 属性 {#dep0172-the-asyncresource-property-of-asyncresource-bound-functions}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.0.0 | 运行时弃用。 |
:::

类型：运行时

在 Node.js 的未来版本中，当函数绑定到 `AsyncResource` 时，将不再添加 `asyncResource` 属性。

### DEP0173: `assert.CallTracker` 类 {#dep0173-the-assertcalltracker-class}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.1.0 | 仅文档弃用。 |
:::

类型：仅文档

在 Node.js 的未来版本中，[`assert.CallTracker`](/zh/nodejs/api/assert#class-assertcalltracker) 将被删除。 考虑使用替代方案，例如 [`mock`](/zh/nodejs/api/test#mocking) 辅助函数。


### DEP0174：在返回 `Promise` 的函数上调用 `promisify` {#dep0174-calling-promisify-on-a-function-that-returns-a-promise}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v21.0.0 | 运行时弃用。 |
| v20.8.0 | 仅文档弃用。 |
:::

类型：运行时

在返回一个函数的 [`util.promisify`](/zh/nodejs/api/util#utilpromisifyoriginal) 上调用

### DEP0175: `util.toUSVString` {#dep0175-utiltousvstring}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.8.0 | 仅文档弃用。 |
:::

类型：仅文档

[`util.toUSVString()`](/zh/nodejs/api/util#utiltousvstringstring) API 已弃用。 请改用 [`String.prototype.toWellFormed`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toWellFormed)。

### DEP0176: `fs.F_OK`、`fs.R_OK`、`fs.W_OK`、`fs.X_OK` {#dep0176-fsf_ok-fsr_ok-fsw_ok-fsx_ok}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.8.0 | 仅文档弃用。 |
:::

类型：仅文档

直接在 `node:fs` 上公开的 `F_OK`、`R_OK`、`W_OK` 和 `X_OK` getter 已弃用。 请从 `fs.constants` 或 `fs.promises.constants` 中获取它们。

### DEP0177: `util.types.isWebAssemblyCompiledModule` {#dep0177-utiltypesiswebassemblycompiledmodule}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v21.7.0, v20.12.0 | 已终止使用。 |
| v21.3.0, v20.11.0 | 已分配弃用代码。 |
| v14.0.0 | 仅文档弃用。 |
:::

类型：已终止使用

`util.types.isWebAssemblyCompiledModule` API 已被移除。 请改用 `value instanceof WebAssembly.Module`。

### DEP0178: `dirent.path` {#dep0178-direntpath}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 运行时弃用。 |
| v21.5.0, v20.12.0, v18.20.0 | 仅文档弃用。 |
:::

类型：运行时

[`dirent.path`](/zh/nodejs/api/fs#direntpath) 因其在发布线中缺乏一致性而被弃用。 请改用 [`dirent.parentPath`](/zh/nodejs/api/fs#direntparentpath)。

### DEP0179: `Hash` 构造函数 {#dep0179-hash-constructor}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.0.0 | 运行时弃用。 |
| v21.5.0, v20.12.0 | 仅文档弃用。 |
:::

类型：运行时

由于 `Hash` 类是内部类，不打算公开使用，因此直接使用 `Hash()` 或 `new Hash()` 调用 `Hash` 类已被弃用。 请使用 [`crypto.createHash()`](/zh/nodejs/api/crypto#cryptocreatehashalgorithm-options) 方法创建 Hash 实例。


### DEP0180: `fs.Stats` 构造函数 {#dep0180-fsstats-constructor}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.0.0 | 运行时弃用。 |
| v20.13.0 | 仅文档弃用。 |
:::

类型: 运行时

直接使用 `Stats()` 或 `new Stats()` 调用 `fs.Stats` 类已被弃用，因为它是一个内部实现，不适合公开使用。

### DEP0181: `Hmac` 构造函数 {#dep0181-hmac-constructor}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.0.0 | 运行时弃用。 |
| v20.13.0 | 仅文档弃用。 |
:::

类型: 运行时

直接使用 `Hmac()` 或 `new Hmac()` 调用 `Hmac` 类已被弃用，因为它是一个内部实现，不适合公开使用。 请使用 [`crypto.createHmac()`](/zh/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) 方法来创建 Hmac 实例。

### DEP0182: 没有显式 `authTagLength` 的短 GCM 身份验证标签 {#dep0182-short-gcm-authentication-tags-without-explicit-authtaglength}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 运行时弃用。 |
| v20.13.0 | 仅文档弃用。 |
:::

类型: 运行时

打算使用比默认身份验证标签长度短的身份验证标签的应用程序必须将 [`crypto.createDecipheriv()`](/zh/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) 函数的 `authTagLength` 选项设置为适当的长度。

对于 GCM 模式下的密码，[`decipher.setAuthTag()`](/zh/nodejs/api/crypto#deciphersetauthtagbuffer-encoding) 函数接受任何有效长度的身份验证标签（参见 [DEP0090](/zh/nodejs/api/deprecations#DEP0090)）。 为了更好地与 [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf) 的建议保持一致，此行为已被弃用。

### DEP0183: 基于 OpenSSL 引擎的 API {#dep0183-openssl-engine-based-apis}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.4.0, v20.16.0 | 仅文档弃用。 |
:::

类型: 仅文档

OpenSSL 3 已经弃用了对自定义引擎的支持，并建议切换到其新的提供程序模型。 `https.request()` 的 `clientCertEngine` 选项、[`tls.createSecureContext()`](/zh/nodejs/api/tls#tlscreatesecurecontextoptions) 和 [`tls.createServer()`](/zh/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)；[`tls.createSecureContext()`](/zh/nodejs/api/tls#tlscreatesecurecontextoptions) 的 `privateKeyEngine` 和 `privateKeyIdentifier`；以及 [`crypto.setEngine()`](/zh/nodejs/api/crypto#cryptosetengineengine-flags) 都依赖于 OpenSSL 的此功能。


### DEP0184: 不使用 `new` 实例化 `node:zlib` 类 {#dep0184-instantiating-nodezlib-classes-without-new}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.9.0, v20.18.0 | 仅文档弃用。 |
:::

类型：仅文档

不使用 `new` 限定符实例化由 `node:zlib` 模块导出的类已被弃用。建议使用 `new` 限定符。这适用于所有 Zlib 类，例如 `Deflate`、`DeflateRaw`、`Gunzip`、`Inflate`、`InflateRaw`、`Unzip` 和 `Zlib`。

### DEP0185: 不使用 `new` 实例化 `node:repl` 类 {#dep0185-instantiating-noderepl-classes-without-new}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.9.0, v20.18.0 | 仅文档弃用。 |
:::

类型：仅文档

不使用 `new` 限定符实例化由 `node:repl` 模块导出的类已被弃用。建议使用 `new` 限定符。这适用于所有 REPL 类，包括 `REPLServer` 和 `Recoverable`。

### DEP0187: 将无效的参数类型传递给 `fs.existsSync` {#dep0187-passing-invalid-argument-types-to-fsexistssync}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.4.0 | 仅文档。 |
:::

类型：仅文档

传递不支持的参数类型已被弃用，并且在未来的版本中，将抛出一个错误，而不是返回 `false`。

### DEP0188: `process.features.ipv6` 和 `process.features.uv` {#dep0188-processfeaturesipv6-and-processfeaturesuv}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.4.0 | 仅文档弃用。 |
:::

类型：仅文档

这些属性始终为 `true`。任何基于这些属性的检查都是多余的。

### DEP0189: `process.features.tls_*` {#dep0189-processfeaturestls_*}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.4.0 | 仅文档弃用。 |
:::

类型：仅文档

`process.features.tls_alpn`、`process.features.tls_ocsp` 和 `process.features.tls_sni` 已被弃用，因为它们的值保证与 `process.features.tls` 的值相同。

