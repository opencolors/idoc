---
title: Node.js 单一可执行应用程序
description: 了解如何使用 Node.js 创建和管理单一可执行应用程序，包括如何打包应用程序、管理依赖项以及处理安全性考虑。
head:
  - - meta
    - name: og:title
      content: Node.js 单一可执行应用程序 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解如何使用 Node.js 创建和管理单一可执行应用程序，包括如何打包应用程序、管理依赖项以及处理安全性考虑。
  - - meta
    - name: twitter:title
      content: Node.js 单一可执行应用程序 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解如何使用 Node.js 创建和管理单一可执行应用程序，包括如何打包应用程序、管理依赖项以及处理安全性考虑。
---


# 单一可执行应用程序 {#single-executable-applications}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v20.6.0 | 增加了对 "useSnapshot" 的支持。 |
| v20.6.0 | 增加了对 "useCodeCache" 的支持。 |
| v19.7.0, v18.16.0 | 增加于：v19.7.0, v18.16.0 |
:::

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).1 - 活跃开发中
:::

**源码:** [src/node_sea.cc](https://github.com/nodejs/node/blob/v23.5.0/src/node_sea.cc)

此特性允许方便地将 Node.js 应用程序分发到未安装 Node.js 的系统上。

Node.js 支持创建[单一可执行应用程序](https://github.com/nodejs/single-executable)，方法是允许将 Node.js 准备的 blob（可以包含捆绑的脚本）注入到 `node` 二进制文件中。 在启动期间，程序会检查是否已注入任何内容。 如果找到 blob，它将执行 blob 中的脚本。 否则，Node.js 将像往常一样运行。

单一可执行应用程序功能目前仅支持使用 [CommonJS](/zh/nodejs/api/modules#modules-commonjs-modules) 模块系统运行单个嵌入式脚本。

用户可以使用 `node` 二进制文件本身和任何可以将资源注入到二进制文件中的工具，从其捆绑的脚本创建单一可执行应用程序。

以下是使用其中一种工具 [postject](https://github.com/nodejs/postject) 创建单一可执行应用程序的步骤：

## 生成单一可执行准备 blob {#generating-single-executable-preparation-blobs}

可以使用 Node.js 二进制文件的 `--experimental-sea-config` 标志生成注入到应用程序中的单一可执行准备 blob，该二进制文件将用于构建单一可执行文件。 它接受 JSON 格式的配置文件的路径。 如果传递给它的路径不是绝对路径，Node.js 将使用相对于当前工作目录的路径。

该配置当前读取以下顶级字段：

```json [JSON]
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/blob.blob",
  "disableExperimentalSEAWarning": true, // 默认值: false
  "useSnapshot": false,  // 默认值: false
  "useCodeCache": true, // 默认值: false
  "assets": {  // 可选
    "a.dat": "/path/to/a.dat",
    "b.txt": "/path/to/b.txt"
  }
}
```
如果路径不是绝对路径，Node.js 将使用相对于当前工作目录的路径。 用于生成 blob 的 Node.js 二进制文件的版本必须与将注入 blob 的二进制文件的版本相同。

注意：在生成跨平台 SEA（例如，在 `darwin-arm64` 上生成 `linux-x64` 的 SEA）时，必须将 `useCodeCache` 和 `useSnapshot` 设置为 false，以避免生成不兼容的可执行文件。 由于代码缓存和快照只能在编译它们的同一平台上加载，因此当尝试加载在不同平台上构建的代码缓存或快照时，生成的可执行文件可能会在启动时崩溃。


### 资源 {#assets}

用户可以通过将键-路径字典作为 `assets` 字段添加到配置中来包含资源。在构建时，Node.js 会从指定的路径读取资源，并将它们捆绑到准备好的 blob 中。在生成的执行文件中，用户可以使用 [`sea.getAsset()`](/zh/nodejs/api/single-executable-applications#seagetassetkey-encoding) 和 [`sea.getAssetAsBlob()`](/zh/nodejs/api/single-executable-applications#seagetassetasblobkey-options) API 来检索资源。

```json [JSON]
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/blob.blob",
  "assets": {
    "a.jpg": "/path/to/a.jpg",
    "b.txt": "/path/to/b.txt"
  }
}
```
单执行文件应用程序可以按如下方式访问资源：

```js [CJS]
const { getAsset, getAssetAsBlob, getRawAsset } = require('node:sea');
// 返回 ArrayBuffer 中的数据副本。
const image = getAsset('a.jpg');
// 返回从资源解码为 UTF8 的字符串。
const text = getAsset('b.txt', 'utf8');
// 返回包含资源的 Blob。
const blob = getAssetAsBlob('a.jpg');
// 返回包含原始资源且不复制的 ArrayBuffer。
const raw = getRawAsset('a.jpg');
```
有关更多信息，请参阅 [`sea.getAsset()`](/zh/nodejs/api/single-executable-applications#seagetassetkey-encoding)、[`sea.getAssetAsBlob()`](/zh/nodejs/api/single-executable-applications#seagetassetasblobkey-options) 和 [`sea.getRawAsset()`](/zh/nodejs/api/single-executable-applications#seagetrawassetkey) API 的文档。

### 启动快照支持 {#startup-snapshot-support}

`useSnapshot` 字段可用于启用启动快照支持。在这种情况下，最终的可执行文件启动时不会运行 `main` 脚本。相反，它会在构建机器上生成单执行文件应用程序的准备 blob 时运行。然后，生成的准备 blob 将包含一个快照，捕获由 `main` 脚本初始化的状态。注入了准备 blob 的最终可执行文件将在运行时反序列化该快照。

当 `useSnapshot` 为 true 时，主脚本必须调用 [`v8.startupSnapshot.setDeserializeMainFunction()`](/zh/nodejs/api/v8#v8startupsnapshotsetdeserializemainfunctioncallback-data) API 来配置需要在用户启动最终可执行文件时运行的代码。

应用程序在单执行文件中使用快照的典型模式是：

启动快照脚本的一般约束也适用于用于为单执行文件构建快照的主脚本，并且主脚本可以使用 [`v8.startupSnapshot` API](/zh/nodejs/api/v8#startup-snapshot-api) 来适应这些约束。请参阅 [关于 Node.js 中启动快照支持的文档](/zh/nodejs/api/cli#--build-snapshot)。


### V8 代码缓存支持 {#v8-code-cache-support}

当在配置中将 `useCodeCache` 设置为 `true` 时，在生成单文件可执行程序准备 blob 期间，Node.js 将编译 `main` 脚本以生成 V8 代码缓存。生成的代码缓存将成为准备 blob 的一部分，并被注入到最终的可执行文件中。当单文件可执行应用程序启动时，Node.js 将使用代码缓存来加速编译，而不是从头开始编译 `main` 脚本，然后执行脚本，这将提高启动性能。

**注意：** 当 `useCodeCache` 为 `true` 时，`import()` 不起作用。

## 在注入的 main 脚本中 {#in-the-injected-main-script}

### 单文件可执行应用程序 API {#single-executable-application-api}

`node:sea` 内置模块允许从嵌入到可执行文件中的 JavaScript main 脚本与单文件可执行应用程序进行交互。

#### `sea.isSea()` {#seaissea}

**新增于：v21.7.0, v20.12.0**

- 返回：[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 此脚本是否在单文件可执行应用程序中运行。

### `sea.getAsset(key[, encoding])` {#seagetassetkey-encoding}

**新增于：v21.7.0, v20.12.0**

此方法可用于检索配置为在构建时捆绑到单文件可执行应用程序中的资源。如果找不到匹配的资源，则会抛出一个错误。

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 资源在单文件可执行应用程序配置中的 `assets` 字段指定的字典中的键。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果指定，资源将被解码为字符串。接受 `TextDecoder` 支持的任何编码。如果未指定，将返回一个包含资源副本的 `ArrayBuffer`。
- 返回：[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)


### `sea.getAssetAsBlob(key[, options])` {#seagetassetasblobkey-options}

**新增于: v21.7.0, v20.12.0**

与 [`sea.getAsset()`](/zh/nodejs/api/single-executable-applications#seagetassetkey-encoding) 类似，但以 [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) 的形式返回结果。 当找不到匹配的 asset 时，会抛出一个错误。

- `key`  [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) single-executable application 配置中 `assets` 字段指定的字典中 asset 的键。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) blob 的可选 mime 类型。

- 返回: [\<Blob\>](/zh/nodejs/api/buffer#class-blob)

### `sea.getRawAsset(key)` {#seagetrawassetkey}

**新增于: v21.7.0, v20.12.0**

此方法可用于检索配置为在构建时捆绑到 single-executable application 中的 assets。 当找不到匹配的 asset 时，会抛出一个错误。

与 `sea.getAsset()` 或 `sea.getAssetAsBlob()` 不同，此方法不返回副本。 而是返回可执行文件中捆绑的原始 asset。

目前，用户应避免写入返回的 array buffer。 如果注入的部分未标记为可写或未正确对齐，则写入返回的 array buffer 很可能会导致崩溃。

- `key`  [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) single-executable application 配置中 `assets` 字段指定的字典中 asset 的键。
- 返回: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

### 注入的主脚本中的 `require(id)` 不是基于文件的 {#requireid-in-the-injected-main-script-is-not-file-based}

注入的主脚本中的 `require()` 与非注入模块可用的 [`require()`](/zh/nodejs/api/modules#requireid) 不同。 它也没有非注入 [`require()`](/zh/nodejs/api/modules#requireid) 的任何属性，除了 [`require.main`](/zh/nodejs/api/modules#accessing-the-main-module)。 它只能用于加载内置模块。 尝试加载只能在文件系统中找到的模块将会抛出一个错误。

用户可以将他们的应用程序捆绑到一个独立的 JavaScript 文件中，以便注入到可执行文件中，而不是依赖于基于文件的 `require()`。 这也能确保更具确定性的依赖关系图。

但是，如果仍然需要基于文件的 `require()`，也可以实现：

```js [ESM]
const { createRequire } = require('node:module');
require = createRequire(__filename);
```

### 注入的主脚本中的 `__filename` 和 `module.filename` {#__filename-and-modulefilename-in-the-injected-main-script}

注入的主脚本中的 `__filename` 和 `module.filename` 的值等于 [`process.execPath`](/zh/nodejs/api/process#processexecpath)。

### 注入的主脚本中的 `__dirname` {#__dirname-in-the-injected-main-script}

注入的主脚本中的 `__dirname` 的值等于 [`process.execPath`](/zh/nodejs/api/process#processexecpath) 的目录名。

## 备注 {#notes}

### 单一可执行应用程序创建过程 {#single-executable-application-creation-process}

旨在创建单一可执行 Node.js 应用程序的工具必须将使用 `--experimental-sea-config"` 准备的 blob 的内容注入到：

- 如果 `node` 二进制文件是 [PE](https://en.wikipedia.org/wiki/Portable_Executable) 文件，则注入到名为 `NODE_SEA_BLOB` 的资源中
- 如果 `node` 二进制文件是 [Mach-O](https://en.wikipedia.org/wiki/Mach-O) 文件，则注入到 `NODE_SEA` 段中名为 `NODE_SEA_BLOB` 的节中
- 如果 `node` 二进制文件是 [ELF](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format) 文件，则注入到名为 `NODE_SEA_BLOB` 的 note 中

在二进制文件中搜索 `NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2:0` [fuse](https://www.electronjs.org/docs/latest/tutorial/fuses) 字符串，并将最后一个字符翻转为 `1`，以表明已注入资源。

### 平台支持 {#platform-support}

单一可执行文件支持仅在以下平台上定期在 CI 上进行测试：

- Windows
- macOS
- Linux（[Node.js 支持的](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list)所有发行版，除了 Alpine，以及[Node.js 支持的](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list)所有架构，除了 s390x）

这是由于缺乏更好的工具来生成单一可执行文件，这些文件可用于在其他平台上测试此功能。

欢迎提出关于其他资源注入工具/工作流程的建议。 请在 [https://github.com/nodejs/single-executable/discussions](https://github.com/nodejs/single-executable/discussions) 发起讨论，以帮助我们记录它们。

