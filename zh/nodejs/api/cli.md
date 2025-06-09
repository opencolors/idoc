---
title: Node.js 命令行选项
description: 本页面提供了 Node.js 中可用的命令行选项的全面指南，详细介绍了如何使用各种标志和参数来配置运行时环境、管理调试以及控制执行行为。
head:
  - - meta
    - name: og:title
      content: Node.js 命令行选项 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 本页面提供了 Node.js 中可用的命令行选项的全面指南，详细介绍了如何使用各种标志和参数来配置运行时环境、管理调试以及控制执行行为。
  - - meta
    - name: twitter:title
      content: Node.js 命令行选项 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 本页面提供了 Node.js 中可用的命令行选项的全面指南，详细介绍了如何使用各种标志和参数来配置运行时环境、管理调试以及控制执行行为。
---


# 命令行 API {#command-line-api}

Node.js 提供了各种 CLI 选项。 这些选项公开了内置调试、执行脚本的多种方式以及其他有用的运行时选项。

要在终端中将此文档视为手册页，请运行 `man node`。

## 概要 {#synopsis}

`node [选项] [V8 选项] [<程序入口点> | -e "script" | -] [--] [参数]`

`node inspect [<程序入口点> | -e "script" | <主机>:<端口>] …`

`node --v8-options`

不带参数执行以启动 [REPL](/zh/nodejs/api/repl)。

有关 `node inspect` 的更多信息，请参阅 [debugger](/zh/nodejs/api/debugger) 文档。

## 程序入口点 {#program-entry-point}

程序入口点是一个类似于说明符的字符串。 如果该字符串不是绝对路径，则将其解析为相对于当前工作目录的相对路径。 然后，该路径由 [CommonJS](/zh/nodejs/api/modules) 模块加载器解析。 如果找不到相应的文件，则会抛出错误。

如果找到文件，则在以下任何条件下，其路径将传递给 [ES 模块加载器](/zh/nodejs/api/packages#modules-loaders)：

- 程序启动时使用的命令行标志强制入口点使用 ECMAScript 模块加载器加载，例如 `--import`。
- 文件具有 `.mjs` 扩展名。
- 该文件没有 `.cjs` 扩展名，并且最近的父 `package.json` 文件包含一个顶级 [`"type"`](/zh/nodejs/api/packages#type) 字段，其值为 `"module"`。

否则，该文件将使用 CommonJS 模块加载器加载。 有关更多详细信息，请参阅 [模块加载器](/zh/nodejs/api/packages#modules-loaders)。

### ECMAScript 模块加载器入口点注意事项 {#ecmascript-modules-loader-entry-point-caveat}

加载时，[ES 模块加载器](/zh/nodejs/api/packages#modules-loaders) 加载程序入口点，`node` 命令将仅接受具有 `.js`、`.mjs` 或 `.cjs` 扩展名的文件作为输入； 并且在启用 [`--experimental-wasm-modules`](/zh/nodejs/api/cli#--experimental-wasm-modules) 时接受具有 `.wasm` 扩展名的文件。

## 选项 {#options}

::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v10.12.0 | 现在也允许使用下划线代替破折号作为 Node.js 选项，以及 V8 选项。 |
:::

所有选项，包括 V8 选项，都允许使用破折号 (`-`) 或下划线 (`_`) 分隔单词。 例如，`--pending-deprecation` 等同于 `--pending_deprecation`。

如果多次传递采用单个值的选项（例如 `--max-http-header-size`），则使用最后传递的值。 命令行中的选项优先于通过 [`NODE_OPTIONS`](/zh/nodejs/api/cli#node_optionsoptions) 环境变量传递的选项。


### `-` {#-}

**加入于: v8.0.0**

stdin 的别名。 类似于其他命令行实用程序中 `-` 的使用，表示脚本从 stdin 读取，其余选项传递给该脚本。

### `--` {#--}

**加入于: v6.11.0**

表示 Node 选项的结束。 将其余参数传递给脚本。 如果在此之前没有提供脚本文件名或 eval/print 脚本，则下一个参数将用作脚本文件名。

### `--abort-on-uncaught-exception` {#--abort-on-uncaught-exception}

**加入于: v0.10.8**

中止而不是退出会导致生成核心文件，以便使用调试器（例如 `lldb`、`gdb` 和 `mdb`）进行事后分析。

如果传递此标志，仍然可以通过 [`process.setUncaughtExceptionCaptureCallback()`](/zh/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn)（以及通过使用使用它的 `node:domain` 模块）将行为设置为不中止。

### `--allow-addons` {#--allow-addons}

**加入于: v21.6.0, v20.12.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index)。1 - 积极开发
:::

当使用[权限模型](/zh/nodejs/api/permissions#permission-model)时，进程默认情况下将无法使用原生插件。 尝试这样做将抛出 `ERR_DLOPEN_DISABLED`，除非用户在启动 Node.js 时显式传递 `--allow-addons` 标志。

示例：

```js [CJS]
// 尝试 require 一个原生插件
require('nodejs-addon-example');
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js
node:internal/modules/cjs/loader:1319
  return process.dlopen(module, path.toNamespacedPath(filename));
                 ^

Error: Cannot load native addon because loading addons is disabled.
    at Module._extensions..node (node:internal/modules/cjs/loader:1319:18)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12)
    at Module.require (node:internal/modules/cjs/loader:1115:19)
    at require (node:internal/modules/helpers:130:18)
    at Object.<anonymous> (/home/index.js:1:15)
    at Module._compile (node:internal/modules/cjs/loader:1233:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1287:10)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12) {
  code: 'ERR_DLOPEN_DISABLED'
}
```

### `--allow-child-process` {#--allow-child-process}

**添加于: v20.0.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发中
:::

当使用[权限模型](/zh/nodejs/api/permissions#permission-model)时，默认情况下，进程将无法生成任何子进程。 尝试这样做会抛出 `ERR_ACCESS_DENIED`，除非用户在启动 Node.js 时显式传递 `--allow-child-process` 标志。

例子：

```js [ESM]
const childProcess = require('node:child_process');
// 尝试绕过权限
childProcess.spawn('node', ['-e', 'require("fs").writeFileSync("/new-file", "example")']);
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js
node:internal/child_process:388
  const err = this._handle.spawn(options);
                           ^
Error: Access to this API has been restricted
    at ChildProcess.spawn (node:internal/child_process:388:28)
    at Object.spawn (node:child_process:723:9)
    at Object.<anonymous> (/home/index.js:3:14)
    at Module._compile (node:internal/modules/cjs/loader:1120:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1174:10)
    at Module.load (node:internal/modules/cjs/loader:998:32)
    at Module._load (node:internal/modules/cjs/loader:839:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'ChildProcess'
}
```
### `--allow-fs-read` {#--allow-fs-read}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.5.0 | 权限模型和 --allow-fs 标志已稳定。 |
| v20.7.0 | 不再允许使用逗号 (`,`) 分隔的路径。 |
| v20.0.0 | 添加于: v20.0.0 |
:::

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) [稳定度: 2](/zh/nodejs/api/documentation#stability-index) - 稳定。
:::

此标志使用[权限模型](/zh/nodejs/api/permissions#permission-model)配置文件系统读取权限。

`--allow-fs-read` 标志的有效参数包括:

- `*` - 允许所有 `FileSystemRead` 操作。
- 可以使用多个 `--allow-fs-read` 标志来允许多个路径。 例如 `--allow-fs-read=/folder1/ --allow-fs-read=/folder1/`

可以在[文件系统权限](/zh/nodejs/api/permissions#file-system-permissions)文档中找到示例。

还需要允许初始化器模块。 考虑以下示例：

```bash [BASH]
$ node --permission index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:23:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FileSystemRead',
  resource: '/Users/rafaelgss/repos/os/node/index.js'
}
```
该进程需要能够访问 `index.js` 模块：

```bash [BASH]
node --permission --allow-fs-read=/path/to/index.js index.js
```

### `--allow-fs-write` {#--allow-fs-write}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.5.0 | 权限模型和 --allow-fs 标志已稳定。 |
| v20.7.0 | 不再允许使用逗号 (`,`) 分隔的路径。 |
| v20.0.0 | 添加于: v20.0.0 |
:::

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) [稳定度: 2](/zh/nodejs/api/documentation#stability-index) - 稳定。
:::

此标志使用 [权限模型](/zh/nodejs/api/permissions#permission-model) 配置文件系统写入权限。

`--allow-fs-write` 标志的有效参数为：

- `*` - 允许所有 `FileSystemWrite` 操作。
- 可以使用多个 `--allow-fs-write` 标志来允许多个路径。 例如 `--allow-fs-write=/folder1/ --allow-fs-write=/folder1/`

不再允许使用逗号 (`,`) 分隔的路径。 当传递带有逗号的单个标志时，将显示警告。

示例可以在 [文件系统权限](/zh/nodejs/api/permissions#file-system-permissions) 文档中找到。

### `--allow-wasi` {#--allow-wasi}

**添加于: v22.3.0, v20.16.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发
:::

当使用 [权限模型](/zh/nodejs/api/permissions#permission-model) 时，默认情况下，该进程将无法创建任何 WASI 实例。 出于安全原因，除非用户在主 Node.js 进程中显式传递标志 `--allow-wasi`，否则该调用将抛出 `ERR_ACCESS_DENIED`。

例子：

```js [ESM]
const { WASI } = require('node:wasi');
// 尝试绕过权限
new WASI({
  version: 'preview1',
  // 尝试挂载整个文件系统
  preopens: {
    '/': '/',
  },
});
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:30:49 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WASI',
}
```
### `--allow-worker` {#--allow-worker}

**添加于: v20.0.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发
:::

当使用 [权限模型](/zh/nodejs/api/permissions#permission-model) 时，默认情况下，该进程将无法创建任何 worker 线程。 出于安全原因，除非用户在主 Node.js 进程中显式传递标志 `--allow-worker`，否则该调用将抛出 `ERR_ACCESS_DENIED`。

例子：

```js [ESM]
const { Worker } = require('node:worker_threads');
// 尝试绕过权限
new Worker(__filename);
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WorkerThreads'
}
```

### `--build-snapshot` {#--build-snapshot}

**添加于: v18.8.0**

::: warning [稳定性: 1 - 实验性]
[稳定性: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

在进程退出时生成快照 blob 并将其写入磁盘，该 blob 稍后可以使用 `--snapshot-blob` 加载。

构建快照时，如果未指定 `--snapshot-blob`，则默认情况下生成的 blob 将被写入当前工作目录中的 `snapshot.blob`。 否则，它将被写入 `--snapshot-blob` 指定的路径。

```bash [BASH]
$ echo "globalThis.foo = 'I am from the snapshot'" > snapshot.js

# 运行 snapshot.js 来初始化应用程序并将应用程序的状态快照到 {#run-snapshotjs-to-initialize-the-application-and-snapshot-the}
# snapshot.blob 中。
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js

$ echo "console.log(globalThis.foo)" > index.js

# 加载生成的快照并从 index.js 启动应用程序。 {#state-of-it-into-snapshotblob}
$ node --snapshot-blob snapshot.blob index.js
I am from the snapshot
```
[`v8.startupSnapshot` API](/zh/nodejs/api/v8#startup-snapshot-api) 可用于在快照构建时指定一个入口点，从而避免了在反序列化时需要额外的入口脚本：

```bash [BASH]
$ echo "require('v8').startupSnapshot.setDeserializeMainFunction(() => console.log('I am from the snapshot'))" > snapshot.js
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js
$ node --snapshot-blob snapshot.blob
I am from the snapshot
```
有关更多信息，请查看 [`v8.startupSnapshot` API](/zh/nodejs/api/v8#startup-snapshot-api) 文档。

目前，对运行时快照的支持是实验性的，体现在：

### `--build-snapshot-config` {#load-the-generated-snapshot-and-start-the-application-from-indexjs}

**添加于: v21.6.0, v20.12.0**

::: warning [稳定性: 1 - 实验性]
[稳定性: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

指定 JSON 配置文件的路径，该文件配置快照创建行为。

目前支持以下选项：

- `builder` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必需。 提供在构建快照之前执行的脚本的名称，就像使用 `builder` 作为主脚本名称传递了 [`--build-snapshot`](/zh/nodejs/api/cli#--build-snapshot) 一样。
- `withoutCodeCache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 可选。 包含代码缓存可以减少在快照中包含的函数的编译上花费的时间，但代价是更大的快照大小，并可能破坏快照的可移植性。

当使用此标志时，在命令行上提供的其他脚本文件将不会被执行，而是被解释为常规命令行参数。


### `-c`, `--check` {#--build-snapshot-config}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v10.0.0 | 现在在检查文件时支持 `--require` 选项。 |
| v5.0.0, v4.2.0 | 添加于: v5.0.0, v4.2.0 |
:::

语法检查脚本而不执行。

### `--completion-bash` {#-c---check}

**添加于: v10.12.0**

打印 Node.js 的可源 bash 补全脚本。

```bash [BASH]
node --completion-bash > node_bash_completion
source node_bash_completion
```
### `-C condition`, `--conditions=condition` {#--completion-bash}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.9.0, v20.18.0 | 该标志不再是实验性的。 |
| v14.9.0, v12.19.0 | 添加于: v14.9.0, v12.19.0 |
:::

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

提供自定义的[条件导出](/zh/nodejs/api/packages#conditional-exports)解析条件。

允许任意数量的自定义字符串条件名称。

默认的 Node.js 条件 `"node"`, `"default"`, `"import"` 和 `"require"` 将始终按定义应用。

例如，要使用 "development" 解析运行模块：

```bash [BASH]
node -C development app.js
```
### `--cpu-prof` {#-c-condition---conditions=condition}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.4.0, v20.16.0 | `--cpu-prof` 标志现在是稳定的。 |
| v12.0.0 | 添加于: v12.0.0 |
:::

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

启动时启动 V8 CPU 分析器，并在退出前将 CPU 配置文件写入磁盘。

如果未指定 `--cpu-prof-dir`，则生成的配置文件将放置在当前工作目录中。

如果未指定 `--cpu-prof-name`，则生成的配置文件将被命名为 `CPU.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.cpuprofile`。

```bash [BASH]
$ node --cpu-prof index.js
$ ls *.cpuprofile
CPU.20190409.202950.15293.0.0.cpuprofile
```
### `--cpu-prof-dir` {#--cpu-prof}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.4.0, v20.16.0 | `--cpu-prof` 标志现在是稳定的。 |
| v12.0.0 | 添加于: v12.0.0 |
:::

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

指定由 `--cpu-prof` 生成的 CPU 配置文件将放置的目录。

默认值由 [`--diagnostic-dir`](/zh/nodejs/api/cli#--diagnostic-dirdirectory) 命令行选项控制。


### `--cpu-prof-interval` {#--cpu-prof-dir}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.4.0, v20.16.0 | `--cpu-prof` 标志现在是稳定的。 |
| v12.2.0 | 添加于: v12.2.0 |
:::

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

指定由 `--cpu-prof` 生成的 CPU 分析文件的采样间隔，单位为微秒。 默认值为 1000 微秒。

### `--cpu-prof-name` {#--cpu-prof-interval}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.4.0, v20.16.0 | `--cpu-prof` 标志现在是稳定的。 |
| v12.0.0 | 添加于: v12.0.0 |
:::

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

指定由 `--cpu-prof` 生成的 CPU 分析文件的文件名。

### `--diagnostic-dir=directory` {#--cpu-prof-name}

设置所有诊断输出文件写入的目录。 默认为当前工作目录。

影响以下各项的默认输出目录：

- [`--cpu-prof-dir`](/zh/nodejs/api/cli#--cpu-prof-dir)
- [`--heap-prof-dir`](/zh/nodejs/api/cli#--heap-prof-dir)
- [`--redirect-warnings`](/zh/nodejs/api/cli#--redirect-warningsfile)

### `--disable-proto=mode` {#--diagnostic-dir=directory}

**添加于: v13.12.0, v12.17.0**

禁用 `Object.prototype.__proto__` 属性。 如果 `mode` 是 `delete`，则该属性将被完全删除。 如果 `mode` 是 `throw`，则访问该属性会抛出一个代码为 `ERR_PROTO_ACCESS` 的异常。

### `--disable-warning=code-or-type` {#--disable-proto=mode}

::: warning [稳定: 1 - 实验性]
[稳定: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 活跃开发中
:::

**添加于: v21.3.0, v20.11.0**

通过 `code` 或 `type` 禁用特定的进程警告。

从 [`process.emitWarning()`](/zh/nodejs/api/process#processemitwarningwarning-options) 发出的警告可能包含 `code` 和 `type`。 此选项将不发出具有匹配 `code` 或 `type` 的警告。

[弃用警告列表](/zh/nodejs/api/deprecations#list-of-deprecated-apis)。

Node.js 核心警告类型为：`DeprecationWarning` 和 `ExperimentalWarning`

例如，以下脚本在使用 `node --disable-warning=DEP0025` 执行时，不会发出 [DEP0025 `require('node:sys')`](/zh/nodejs/api/deprecations#dep0025-requirenodesys)：

::: code-group
```js [ESM]
import sys from 'node:sys';
```

```js [CJS]
const sys = require('node:sys');
```
:::

例如，以下脚本将发出 [DEP0025 `require('node:sys')`](/zh/nodejs/api/deprecations#dep0025-requirenodesys)，但不会发出任何实验性警告（例如 <=v21 中的 [ExperimentalWarning: `vm.measureMemory` is an experimental feature](/zh/nodejs/api/vm#vmmeasurememoryoptions)），当使用 `node --disable-warning=ExperimentalWarning` 执行时：

::: code-group
```js [ESM]
import sys from 'node:sys';
import vm from 'node:vm';

vm.measureMemory();
```

```js [CJS]
const sys = require('node:sys');
const vm = require('node:vm');

vm.measureMemory();
```
:::


### `--disable-wasm-trap-handler` {#--disable-warning=code-or-type}

**添加于: v22.2.0, v20.15.0**

默认情况下，Node.js 启用基于陷阱处理程序的 WebAssembly 边界检查。 因此，V8 不需要在从 WebAssembly 编译的代码中插入内联边界检查，这可以显著加速 WebAssembly 的执行，但此优化需要分配一个大的虚拟内存空间（目前为 10GB）。 如果由于系统配置或硬件限制，Node.js 进程无法访问足够大的虚拟内存地址空间，则用户将无法运行任何涉及在此虚拟内存空间中分配的 WebAssembly，并且会看到内存不足错误。

```bash [BASH]
$ ulimit -v 5000000
$ node -p "new WebAssembly.Memory({ initial: 10, maximum: 100 });"
[eval]:1
new WebAssembly.Memory({ initial: 10, maximum: 100 });
^

RangeError: WebAssembly.Memory(): could not allocate memory
    at [eval]:1:1
    at runScriptInThisContext (node:internal/vm:209:10)
    at node:internal/process/execution:118:14
    at [eval]-wrapper:6:24
    at runScript (node:internal/process/execution:101:62)
    at evalScript (node:internal/process/execution:136:3)
    at node:internal/main/eval_string:49:3

```
`--disable-wasm-trap-handler` 禁用此优化，以便当 Node.js 进程可用的虚拟内存地址空间低于 V8 WebAssembly 内存空间所需的大小时，用户至少可以运行 WebAssembly（性能较差）。

### `--disallow-code-generation-from-strings` {#--disable-wasm-trap-handler}

**添加于: v9.8.0**

使内置的语言特性（如 `eval` 和 `new Function`），从字符串生成代码时抛出异常。 这不会影响 Node.js `node:vm` 模块。

### `--dns-result-order=order` {#--disallow-code-generation-from-strings}


::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v22.1.0, v20.13.0 | 现在支持 `ipv6first`。 |
| v17.0.0 | 将默认值更改为 `verbatim`。 |
| v16.4.0, v14.18.0 | 添加于：v16.4.0, v14.18.0 |
:::

在 [`dns.lookup()`](/zh/nodejs/api/dns#dnslookuphostname-options-callback) 和 [`dnsPromises.lookup()`](/zh/nodejs/api/dns#dnspromiseslookuphostname-options) 中设置 `order` 的默认值。 该值可以是：

- `ipv4first`：将默认 `order` 设置为 `ipv4first`。
- `ipv6first`：将默认 `order` 设置为 `ipv6first`。
- `verbatim`：将默认 `order` 设置为 `verbatim`。

默认值为 `verbatim`，并且 [`dns.setDefaultResultOrder()`](/zh/nodejs/api/dns#dnssetdefaultresultorderorder) 比 `--dns-result-order` 具有更高的优先级。


### `--enable-fips` {#--dns-result-order=order}

**添加于: v6.0.0**

在启动时启用符合 FIPS 标准的加密。（需要 Node.js 基于与 FIPS 兼容的 OpenSSL 构建。）

### `--enable-network-family-autoselection` {#--enable-fips}

**添加于: v18.18.0**

启用家庭自动选择算法，除非连接选项明确禁用它。

### `--enable-source-maps` {#--enable-network-family-autoselection}


::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v15.11.0, v14.18.0 | 此 API 不再是实验性的。 |
| v12.12.0 | 添加于: v12.12.0 |
:::

启用堆栈跟踪的 [Source Map v3](https://sourcemaps.info/spec) 支持。

当使用 transpiler（如 TypeScript）时，应用程序抛出的堆栈跟踪引用的是转换后的代码，而不是原始源代码位置。`--enable-source-maps` 启用 Source Maps 的缓存，并尽最大努力报告与原始源文件相关的堆栈跟踪。

重写 `Error.prepareStackTrace` 可能会阻止 `--enable-source-maps` 修改堆栈跟踪。 在重写函数中调用并返回原始 `Error.prepareStackTrace` 的结果，以使用源映射修改堆栈跟踪。

```js [ESM]
const originalPrepareStackTrace = Error.prepareStackTrace;
Error.prepareStackTrace = (error, trace) => {
  // 修改 error 和 trace，并使用
  // 原始 Error.prepareStackTrace 格式化堆栈跟踪。
  return originalPrepareStackTrace(error, trace);
};
```
请注意，启用源映射可能会在访问 `Error.stack` 时给您的应用程序带来延迟。 如果您在应用程序中经常访问 `Error.stack`，请考虑 `--enable-source-maps` 的性能影响。

### `--entry-url` {#--enable-source-maps}

**添加于: v23.0.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

如果存在，Node.js 会将入口点解释为 URL，而不是路径。

遵循 [ECMAScript 模块](/zh/nodejs/api/esm#modules-ecmascript-modules) 解析规则。

URL 中的任何查询参数或哈希都可以通过 [`import.meta.url`](/zh/nodejs/api/esm#importmetaurl) 访问。

```bash [BASH]
node --entry-url 'file:///path/to/file.js?queryparams=work#and-hashes-too'
node --entry-url --experimental-strip-types 'file.ts?query#hash'
node --entry-url 'data:text/javascript,console.log("Hello")'
```

### `--env-file-if-exists=config` {#--entry-url}

**新增于: v22.9.0**

行为与 [`--env-file`](/zh/nodejs/api/cli#--env-fileconfig) 相同，但如果文件不存在，则不会抛出错误。

### `--env-file=config` {#--env-file-if-exists=config}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发中
:::


::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v21.7.0, v20.12.0 | 添加了对多行值的支持。 |
| v20.6.0 | 新增于: v20.6.0 |
:::

从相对于当前目录的文件加载环境变量，使其可在 `process.env` 上供应用程序使用。 [配置 Node.js 的环境变量](/zh/nodejs/api/cli#environment-variables)，例如 `NODE_OPTIONS`，将被解析和应用。 如果同一个变量在环境和文件中都有定义，则环境中的值优先。

你可以传递多个 `--env-file` 参数。 后续文件会覆盖之前文件中定义的现有变量。

如果文件不存在，则会抛出错误。

```bash [BASH]
node --env-file=.env --env-file=.development.env index.js
```
文件的格式应为每行一个键值对，包含环境变量名和值，用 `=` 分隔：

```text [TEXT]
PORT=3000
```
`#` 后的任何文本都将被视为注释：

```text [TEXT]
# 这是一个注释 {#--env-file=config}
PORT=3000 # 这也是一个注释
```
值可以以以下引号开头和结尾：```, `"` 或 `'`。 它们将从值中省略。

```text [TEXT]
USERNAME="nodejs" # 将得到 `nodejs` 作为值。
```
支持多行值：

```text [TEXT]
MULTI_LINE="THIS IS
A MULTILINE"
# 将得到 `THIS IS\nA MULTILINE` 作为值。 {#this-is-a-comment}
```
关键字 export 在键之前被忽略：

```text [TEXT]
export USERNAME="nodejs" # 将得到 `nodejs` 作为值。
```
如果你想从一个可能不存在的文件中加载环境变量，你可以使用 [`--env-file-if-exists`](/zh/nodejs/api/cli#--env-file-if-existsconfig) 标志代替。


### `-e`, `--eval "script"` {#will-result-in-this-is\na-multiline-as-the-value}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.6.0 | Eval 现在支持实验性的类型剥离。 |
| v5.11.0 | 内置库现在可用作预定义变量。 |
| v0.5.2 | 添加于: v0.5.2 |
:::

将以下参数作为 JavaScript 求值。 REPL 中预定义的模块也可以在 `script` 中使用。

在 Windows 上，使用 `cmd.exe` 时，单引号将无法正常工作，因为它只识别双引号 `"` 用于引用。 在 Powershell 或 Git bash 中，`'` 和 `"` 均可用。

可以通过传递 [`--experimental-strip-types`](/zh/nodejs/api/cli#--experimental-strip-types) 来运行包含内联类型的代码。

### `--experimental-async-context-frame` {#-e---eval-"script"}

**添加于: v22.7.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

启用由 `AsyncContextFrame` 支持的 [`AsyncLocalStorage`](/zh/nodejs/api/async_context#class-asynclocalstorage) 的使用，而不是依赖于 async_hooks 的默认实现。 这个新的模型以非常不同的方式实现，因此在应用程序中上下文数据的流动方式可能存在差异。 因此，目前建议在使用此模型进行生产之前，确保应用程序行为不受此更改的影响。

### `--experimental-eventsource` {#--experimental-async-context-frame}

**添加于: v22.3.0, v20.18.0**

在全局作用域上启用 [EventSource Web API](https://html.spec.whatwg.org/multipage/server-sent-events#server-sent-events) 的公开。

### `--experimental-import-meta-resolve` {#--experimental-eventsource}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.6.0, v18.19.0 | 同步 import.meta.resolve 默认可用，保留该标志以启用先前支持的实验性第二个参数。 |
| v13.9.0, v12.16.2 | 添加于: v13.9.0, v12.16.2 |
:::

启用实验性的 `import.meta.resolve()` 父 URL 支持，允许传递第二个 `parentURL` 参数以进行上下文解析。

先前控制整个 `import.meta.resolve` 功能。


### `--experimental-loader=module` {#--experimental-import-meta-resolve}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v12.11.1 | 此标志已从 `--loader` 重命名为 `--experimental-loader`。 |
| v8.8.0 | 添加于: v8.8.0 |
:::

指定包含导出的[模块自定义钩子](/zh/nodejs/api/module#customization-hooks)的 `module`。`module` 可以是任何被接受为 [`import` 说明符](/zh/nodejs/api/esm#import-specifiers)的字符串。

### `--experimental-network-inspection` {#--experimental-loader=module}

**添加于: v22.6.0, v20.18.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

启用对使用 Chrome DevTools 进行网络检查的实验性支持。

### `--experimental-print-required-tla` {#--experimental-network-inspection}

**添加于: v22.0.0, v20.17.0**

如果 `require()` 的 ES 模块包含顶层 `await`，则此标志允许 Node.js 评估该模块，尝试定位顶层 `await`，并打印它们的位置，以帮助用户找到它们。

### `--experimental-require-module` {#--experimental-print-required-tla}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 现在默认启用。 |
| v22.0.0, v20.17.0 | 添加于: v22.0.0, v20.17.0 |
:::

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 积极开发
:::

支持在 `require()` 中加载同步 ES 模块图。

参见[使用 `require()` 加载 ECMAScript 模块](/zh/nodejs/api/modules#loading-ecmascript-modules-using-require)。

### `--experimental-sea-config` {#--experimental-require-module}

**添加于: v20.0.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

使用此标志生成一个 blob，可以将其注入到 Node.js 二进制文件中，以生成[单个可执行应用程序](/zh/nodejs/api/single-executable-applications)。有关详细信息，请参阅有关[此配置](/zh/nodejs/api/single-executable-applications#generating-single-executable-preparation-blobs)的文档。


### `--experimental-shadow-realm` {#--experimental-sea-config}

**添加于: v19.0.0, v18.13.0**

使用此标志启用 [ShadowRealm](https://github.com/tc39/proposal-shadowrealm) 支持。

### `--experimental-strip-types` {#--experimental-shadow-realm}

**添加于: v22.6.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发中
:::

为 TypeScript 文件启用实验性的类型剥离功能。 更多信息，请参阅 [TypeScript 类型剥离](/zh/nodejs/api/typescript#type-stripping) 文档。

### `--experimental-test-coverage` {#--experimental-strip-types}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.1.0, v18.17.0 | 此选项可以与 `--test` 一起使用。 |
| v19.7.0, v18.15.0 | 添加于: v19.7.0, v18.15.0 |
:::

当与 `node:test` 模块结合使用时，会生成一个代码覆盖率报告，作为测试运行器输出的一部分。 如果没有运行任何测试，则不会生成覆盖率报告。 有关更多详细信息，请参阅有关[从测试中收集代码覆盖率](/zh/nodejs/api/test#collecting-code-coverage)的文档。

### `--experimental-test-isolation=mode` {#--experimental-test-coverage}

**添加于: v22.8.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index).0 - 早期开发中
:::

配置测试运行器中使用的测试隔离的类型。 当 `mode` 是 `'process'` 时，每个测试文件都在一个单独的子进程中运行。 当 `mode` 是 `'none'` 时，所有测试文件都与测试运行器在同一个进程中运行。 默认隔离模式是 `'process'`。 如果不存在 `--test` 标志，则忽略此标志。 有关更多信息，请参阅[测试运行器执行模型](/zh/nodejs/api/test#test-runner-execution-model) 部分。

### `--experimental-test-module-mocks` {#--experimental-test-isolation=mode}

**添加于: v22.3.0, v20.18.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index).0 - 早期开发中
:::

在测试运行器中启用模块模拟。


### `--experimental-transform-types` {#--experimental-test-module-mocks}

**添加于: v22.7.0**

::: warning [稳定性: 1 - 实验性]
[稳定性: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发
:::

启用将仅 TypeScript 语法转换为 JavaScript 代码。 隐含 `--experimental-strip-types` 和 `--enable-source-maps`。

### `--experimental-vm-modules` {#--experimental-transform-types}

**添加于: v9.6.0**

在 `node:vm` 模块中启用实验性 ES 模块支持。

### `--experimental-wasi-unstable-preview1` {#--experimental-vm-modules}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.0.0, v18.17.0 | 此选项不再需要，因为 WASI 默认启用，但仍可以传递。 |
| v13.6.0 | 从 `--experimental-wasi-unstable-preview0` 更改为 `--experimental-wasi-unstable-preview1`。 |
| v13.3.0, v12.16.0 | 添加于: v13.3.0, v12.16.0 |
:::

启用实验性 WebAssembly 系统接口 (WASI) 支持。

### `--experimental-wasm-modules` {#--experimental-wasi-unstable-preview1}

**添加于: v12.3.0**

启用实验性 WebAssembly 模块支持。

### `--experimental-webstorage` {#--experimental-wasm-modules}

**添加于: v22.4.0**

启用实验性 [`Web Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) 支持。

### `--expose-gc` {#--experimental-webstorage}

**添加于: v22.3.0, v20.18.0**

::: warning [稳定性: 1 - 实验性]
[稳定性: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性。 此标志继承自 V8，并且可能会在上游发生更改。
:::

此标志将暴露来自 V8 的 gc 扩展。

```js [ESM]
if (globalThis.gc) {
  globalThis.gc();
}
```
### `--force-context-aware` {#--expose-gc}

**添加于: v12.12.0**

禁用加载非[上下文感知](/zh/nodejs/api/addons#context-aware-addons)的原生插件。

### `--force-fips` {#--force-context-aware}

**添加于: v6.0.0**

在启动时强制执行符合 FIPS 的加密。（无法从脚本代码禁用。）（与 `--enable-fips` 的要求相同。）

### `--force-node-api-uncaught-exceptions-policy` {#--force-fips}

**添加于: v18.3.0, v16.17.0**

在 Node-API 异步回调上强制执行 `uncaughtException` 事件。

为了防止现有插件导致进程崩溃，默认情况下不启用此标志。 未来，将默认启用此标志以强制执行正确的行为。


### `--frozen-intrinsics` {#--force-node-api-uncaught-exceptions-policy}

**添加于: v11.12.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

启用实验性的冻结内建对象，如 `Array` 和 `Object`。

仅支持根上下文。 不保证 `globalThis.Array` 实际上是默认的内建引用。 使用此标志可能会导致代码中断。

为了允许添加 polyfill，[`--require`](/zh/nodejs/api/cli#-r---require-module) 和 [`--import`](/zh/nodejs/api/cli#--importmodule) 都在冻结内建对象之前运行。

### `--heap-prof` {#--frozen-intrinsics}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.4.0, v20.16.0 | `--heap-prof` 标志现在是稳定的。 |
| v12.4.0 | 添加于: v12.4.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

在启动时启动 V8 堆分析器，并在退出前将堆快照写入磁盘。

如果未指定 `--heap-prof-dir`，则生成的快照放置在当前工作目录中。

如果未指定 `--heap-prof-name`，则生成的快照命名为 `Heap.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.heapprofile`。

```bash [BASH]
$ node --heap-prof index.js
$ ls *.heapprofile
Heap.20190409.202950.15293.0.001.heapprofile
```
### `--heap-prof-dir` {#--heap-prof}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.4.0, v20.16.0 | `--heap-prof` 标志现在是稳定的。 |
| v12.4.0 | 添加于: v12.4.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

指定由 `--heap-prof` 生成的堆快照的放置目录。

默认值由 [`--diagnostic-dir`](/zh/nodejs/api/cli#--diagnostic-dirdirectory) 命令行选项控制。

### `--heap-prof-interval` {#--heap-prof-dir}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.4.0, v20.16.0 | `--heap-prof` 标志现在是稳定的。 |
| v12.4.0 | 添加于: v12.4.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

指定由 `--heap-prof` 生成的堆快照的平均采样间隔（以字节为单位）。 默认值为 512 * 1024 字节。


### `--heap-prof-name` {#--heap-prof-interval}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.4.0, v20.16.0 | `--heap-prof` 标志现在是稳定的。 |
| v12.4.0 | 添加于: v12.4.0 |
:::

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

指定由 `--heap-prof` 生成的堆快照文件的文件名。

### `--heapsnapshot-near-heap-limit=max_count` {#--heap-prof-name}

**添加于: v15.1.0, v14.18.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

当 V8 堆使用量接近堆限制时，将 V8 堆快照写入磁盘。 `count` 应该是一个非负整数（在这种情况下，Node.js 将最多写入 `max_count` 个快照到磁盘）。

生成快照时，可能会触发垃圾回收并降低堆使用率。 因此，在 Node.js 实例最终耗尽内存之前，可能会将多个快照写入磁盘。 可以比较这些堆快照，以确定在连续快照拍摄期间分配了哪些对象。 不能保证 Node.js 会精确地将 `max_count` 个快照写入磁盘，但当 `max_count` 大于 `0` 时，它会尽最大努力在 Node.js 实例耗尽内存之前至少生成一个最多 `max_count` 个快照。

生成 V8 快照需要时间和内存（包括 V8 堆管理的内存和 V8 堆之外的本机内存）。 堆越大，需要的资源就越多。 Node.js 将调整 V8 堆以适应额外的 V8 堆内存开销，并尽最大努力避免耗尽进程可用的所有内存。 当进程使用的内存超过系统认为合适的内存时，根据系统配置，该进程可能会被系统突然终止。

```bash [BASH]
$ node --max-old-space-size=100 --heapsnapshot-near-heap-limit=3 index.js
Wrote snapshot to Heap.20200430.100036.49580.0.001.heapsnapshot
Wrote snapshot to Heap.20200430.100037.49580.0.002.heapsnapshot
Wrote snapshot to Heap.20200430.100038.49580.0.003.heapsnapshot

<--- Last few GCs --->

[49580:0x110000000]     4826 ms: Mark-sweep 130.6 (147.8) -> 130.5 (147.8) MB, 27.4 / 0.0 ms  (average mu = 0.126, current mu = 0.034) allocation failure scavenge might not succeed
[49580:0x110000000]     4845 ms: Mark-sweep 130.6 (147.8) -> 130.6 (147.8) MB, 18.8 / 0.0 ms  (average mu = 0.088, current mu = 0.031) allocation failure scavenge might not succeed


<--- JS stacktrace --->

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
....
```

### `--heapsnapshot-signal=signal` {#--heapsnapshot-near-heap-limit=max_count}

**新增于: v12.0.0**

启用一个信号处理程序，该处理程序使 Node.js 进程在接收到指定的信号时写入堆转储。`signal` 必须是有效的信号名称。 默认禁用。

```bash [BASH]
$ node --heapsnapshot-signal=SIGUSR2 index.js &
$ ps aux
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
node         1  5.5  6.1 787252 247004 ?       Ssl  16:43   0:02 node --heapsnapshot-signal=SIGUSR2 index.js
$ kill -USR2 1
$ ls
Heap.20190718.133405.15554.0.001.heapsnapshot
```
### `-h`, `--help` {#--heapsnapshot-signal=signal}

**新增于: v0.1.3**

打印 node 命令行选项。 此选项的输出不如本文档详细。

### `--icu-data-dir=file` {#-h---help}

**新增于: v0.11.15**

指定 ICU 数据加载路径。（覆盖 `NODE_ICU_DATA`。）

### `--import=module` {#--icu-data-dir=file}

**新增于: v19.0.0, v18.18.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

在启动时预加载指定的模块。 如果多次提供该标志，则每个模块将按照它们出现的顺序依次执行，从 [`NODE_OPTIONS`](/zh/nodejs/api/cli#node_optionsoptions) 中提供的模块开始。

遵循 [ECMAScript 模块](/zh/nodejs/api/esm#modules-ecmascript-modules) 解析规则。 使用 [`--require`](/zh/nodejs/api/cli#-r---require-module) 加载 [CommonJS 模块](/zh/nodejs/api/modules)。 使用 `--require` 预加载的模块将在使用 `--import` 预加载的模块之前运行。

模块被预加载到主线程以及任何工作线程、派生的进程或集群进程中。

### `--input-type=type` {#--import=module}

**新增于: v12.0.0**

这配置 Node.js 将 `--eval` 或 `STDIN` 输入解释为 CommonJS 或 ES 模块。 有效值为 `"commonjs"` 或 `"module"`。 默认值为 `"commonjs"`。

REPL 不支持此选项。 将 `--input-type=module` 与 [`--print`](/zh/nodejs/api/cli#-p---print-script) 一起使用将抛出错误，因为 `--print` 不支持 ES 模块语法。


### `--insecure-http-parser` {#--input-type=type}

**添加于: v13.4.0, v12.15.0, v10.19.0**

启用 HTTP 解析器的宽松标志。 这可能会允许与不符合标准的 HTTP 实现互操作。

启用后，解析器将接受以下内容：

- 无效的 HTTP 标头值。
- 无效的 HTTP 版本。
- 允许包含 `Transfer-Encoding` 和 `Content-Length` 标头的消息。
- 当存在 `Connection: close` 时，允许消息后存在额外数据。
- 允许在提供 `chunked` 之后存在额外的传输编码。
- 允许使用 `\n` 作为令牌分隔符，而不是 `\r\n`。
- 允许在块之后不提供 `\r\n`。
- 允许在块大小之后和 `\r\n` 之前存在空格。

以上所有操作都会使您的应用程序容易受到请求走私或中毒攻击。 避免使用此选项。

#### 警告：将检查器绑定到公共 IP:端口 组合是不安全的 {#--insecure-http-parser}

将检查器绑定到具有开放端口的公共 IP（包括 `0.0.0.0`）是不安全的，因为它允许外部主机连接到检查器并执行[远程代码执行](https://www.owasp.org/index.php/Code_Injection) 攻击。

如果指定主机，请确保：

- 该主机无法从公共网络访问。
- 防火墙禁止端口上不需要的连接。

**更具体地说，如果端口（默认情况下为 <code>9229</code>）不受防火墙保护，则 <code>--inspect=0.0.0.0</code> 是不安全的。**

有关更多信息，请参阅[调试安全影响](https://nodejs.org/en/docs/guides/debugging-getting-started/#security-implications)部分。

### `--inspect-brk[=[host:]port]` {#warning-binding-inspector-to-a-public-ipport-combination-is-insecure}

**添加于: v7.6.0**

在 `host:port` 上激活检查器，并在用户脚本开始时中断。 默认 `host:port` 为 `127.0.0.1:9229`。 如果指定端口 `0`，将使用一个随机的可用端口。

有关 Node.js 调试器的更多说明，请参阅 [Node.js 的 V8 检查器集成](/zh/nodejs/api/debugger#v8-inspector-integration-for-nodejs)。

### `--inspect-port=[host:]port` {#--inspect-brk=hostport}

**添加于: v7.6.0**

设置在激活检查器时要使用的 `host:port`。 在通过发送 `SIGUSR1` 信号激活检查器时很有用。

默认主机是 `127.0.0.1`。 如果指定端口 `0`，将使用一个随机的可用端口。

有关 `host` 参数用法的更多信息，请参阅下面的[安全警告](/zh/nodejs/api/cli#warning-binding-inspector-to-a-public-ipport-combination-is-insecure)。


### `--inspect-publish-uid=stderr,http` {#--inspect-port=hostport}

指定检查器 WebSocket URL 暴露方式。

默认情况下，检查器 WebSocket URL 在 stderr 中可用，并且在 `http://host:port/json/list` 上的 `/json/list` 端点下可用。

### `--inspect-wait[=[host:]port]` {#--inspect-publish-uid=stderrhttp}

**新增于: v22.2.0, v20.15.0**

在 `host:port` 上激活检查器，并等待调试器连接。 默认的 `host:port` 是 `127.0.0.1:9229`。 如果指定端口 `0`，则会使用一个随机的可用端口。

有关 Node.js 调试器的更多说明，请参阅 [Node.js 的 V8 检查器集成](/zh/nodejs/api/debugger#v8-inspector-integration-for-nodejs)。

### `--inspect[=[host:]port]` {#--inspect-wait=hostport}

**新增于: v6.3.0**

在 `host:port` 上激活检查器。 默认为 `127.0.0.1:9229`。 如果指定端口 `0`，则会使用一个随机的可用端口。

V8 检查器集成允许诸如 Chrome DevTools 和 IDE 之类的工具来调试和分析 Node.js 实例。 这些工具通过 TCP 端口连接到 Node.js 实例，并使用 [Chrome DevTools 协议](https://chromedevtools.github.io/devtools-protocol/) 进行通信。 有关 Node.js 调试器的更多说明，请参阅 [Node.js 的 V8 检查器集成](/zh/nodejs/api/debugger#v8-inspector-integration-for-nodejs)。

### `-i`, `--interactive` {#--inspect=hostport}

**新增于: v0.7.7**

即使 stdin 看起来不像终端，也打开 REPL。

### `--jitless` {#-i---interactive}

**新增于: v12.0.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性的。 此标志继承自 V8，并且可能会在上游更改。
:::

禁用[可执行内存的运行时分配](https://v8.dev/blog/jitless)。 出于安全原因，某些平台可能需要这样做。 它还可以减少其他平台上的攻击面，但性能影响可能很严重。

### `--localstorage-file=file` {#--jitless}

**新增于: v22.4.0**

用于存储 `localStorage` 数据的文件。 如果该文件不存在，则在首次访问 `localStorage` 时创建该文件。 同一个文件可以在多个 Node.js 进程之间并发共享。 除非使用 `--experimental-webstorage` 标志启动 Node.js，否则此标志不起作用。


### `--max-http-header-size=size` {#--localstorage-file=file}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v13.13.0 | 将 HTTP 标头的最大默认大小从 8 KiB 更改为 16 KiB。 |
| v11.6.0, v10.15.0 | 添加于：v11.6.0, v10.15.0 |
:::

指定 HTTP 标头的最大大小（以字节为单位）。默认为 16 KiB。

### `--napi-modules` {#--max-http-header-size=size}

**添加于: v7.10.0**

此选项不起作用。保留它是为了兼容性。

### `--network-family-autoselection-attempt-timeout` {#--napi-modules}

**添加于: v22.1.0, v20.13.0**

设置网络族自动选择尝试超时时间的默认值。有关更多信息，请参阅 [`net.getDefaultAutoSelectFamilyAttemptTimeout()`](/zh/nodejs/api/net#netgetdefaultautoselectfamilyattempttimeout)。

### `--no-addons` {#--network-family-autoselection-attempt-timeout}

**添加于: v16.10.0, v14.19.0**

禁用 `node-addons` 导出条件以及禁用加载原生插件。 当指定 `--no-addons` 时，调用 `process.dlopen` 或需要原生 C++ 插件将失败并抛出异常。

### `--no-deprecation` {#--no-addons}

**添加于: v0.8.0**

静默弃用警告。

### `--no-experimental-detect-module` {#--no-deprecation}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v22.7.0 | 默认启用语法检测。 |
| v21.1.0, v20.10.0 | 添加于：v21.1.0, v20.10.0 |
:::

禁用使用[语法检测](/zh/nodejs/api/packages#syntax-detection)来确定模块类型。

### `--no-experimental-global-navigator` {#--no-experimental-detect-module}

**添加于: v21.2.0**

::: warning [稳定度: 1 - 实验]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验
:::

禁用在全局作用域上暴露 [Navigator API](/zh/nodejs/api/globals#navigator)。

### `--no-experimental-repl-await` {#--no-experimental-global-navigator}

**添加于: v16.6.0**

使用此标志禁用 REPL 中的顶层 await。

### `--no-experimental-require-module` {#--no-experimental-repl-await}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 现在默认为 false。 |
| v22.0.0, v20.17.0 | 添加于：v22.0.0, v20.17.0 |
:::

::: warning [稳定度: 1 - 实验]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).1 - 活跃开发
:::

禁用在 `require()` 中加载同步 ES 模块图的支持。

请参阅 [使用 `require()` 加载 ECMAScript 模块](/zh/nodejs/api/modules#loading-ecmascript-modules-using-require)。


### `--no-experimental-sqlite` {#--no-experimental-require-module}

::: info [历史记录]
| 版本 | 更改 |
| --- | --- |
| v23.4.0 | SQLite 取消标记，但仍处于实验阶段。 |
| v22.5.0 | 添加于：v22.5.0 |
:::

禁用实验性的 [`node:sqlite`](/zh/nodejs/api/sqlite) 模块。

### `--no-experimental-websocket` {#--no-experimental-sqlite}

**添加于：v22.0.0**

禁止在全局作用域上公开 [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)。

### `--no-extra-info-on-fatal-exception` {#--no-experimental-websocket}

**添加于：v17.0.0**

隐藏导致退出的致命异常的额外信息。

### `--no-force-async-hooks-checks` {#--no-extra-info-on-fatal-exception}

**添加于：v9.0.0**

禁用 `async_hooks` 的运行时检查。当 `async_hooks` 启用时，这些检查仍然会动态启用。

### `--no-global-search-paths` {#--no-force-async-hooks-checks}

**添加于：v16.10.0**

不从全局路径（如 `$HOME/.node_modules` 和 `$NODE_PATH`）搜索模块。

### `--no-network-family-autoselection` {#--no-global-search-paths}

::: info [历史记录]
| 版本 | 更改 |
| --- | --- |
| v20.0.0 | 该标志已从 `--no-enable-network-family-autoselection` 重命名为 `--no-network-family-autoselection`。旧名称仍然可以作为别名使用。 |
| v19.4.0 | 添加于：v19.4.0 |
:::

除非连接选项显式启用，否则禁用族自动选择算法。

### `--no-warnings` {#--no-network-family-autoselection}

**添加于：v6.0.0**

静默所有进程警告（包括弃用）。

### `--node-memory-debug` {#--no-warnings}

**添加于：v15.0.0, v14.18.0**

为 Node.js 内部的内存泄漏启用额外的调试检查。 这通常只对调试 Node.js 本身的开发人员有用。

### `--openssl-config=file` {#--node-memory-debug}

**添加于：v6.9.0**

在启动时加载 OpenSSL 配置文件。 除其他用途外，如果 Node.js 是针对启用 FIPS 的 OpenSSL 构建的，则可以使用此文件来启用符合 FIPS 的加密。

### `--openssl-legacy-provider` {#--openssl-config=file}

**添加于：v17.0.0, v16.17.0**

启用 OpenSSL 3.0 遗留提供程序。 更多信息请参见 [OSSL_PROVIDER-legacy](https://www.openssl.org/docs/man3.0/man7/OSSL_PROVIDER-legacy)。

### `--openssl-shared-config` {#--openssl-legacy-provider}

**添加于：v18.5.0, v16.17.0, v14.21.0**

允许从 OpenSSL 配置文件中读取 OpenSSL 默认配置节 `openssl_conf`。 默认配置文件名为 `openssl.cnf`，但是可以使用环境变量 `OPENSSL_CONF` 或使用命令行选项 `--openssl-config` 更改它。 默认 OpenSSL 配置文件的位置取决于 OpenSSL 如何链接到 Node.js。 共享 OpenSSL 配置可能会产生不必要的含义，建议使用特定于 Node.js 的配置节 `nodejs_conf`，这是不使用此选项时的默认设置。


### `--pending-deprecation` {#--openssl-shared-config}

**添加于: v8.0.0**

发出待定的弃用警告。

待定的弃用通常与运行时弃用相同，但一个值得注意的例外是，它们默认是*关闭*的，并且除非设置了 `--pending-deprecation` 命令行标志或 `NODE_PENDING_DEPRECATION=1` 环境变量，否则不会发出。待定的弃用用于提供一种选择性的“早期警告”机制，开发人员可以利用它来检测已弃用的 API 使用情况。

### `--permission` {#--pending-deprecation}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.5.0 | 权限模型现在是稳定的。 |
| v20.0.0 | 添加于: v20.0.0 |
:::

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定。
:::

为当前进程启用权限模型。启用后，以下权限受到限制：

- 文件系统 - 可通过 [`--allow-fs-read`](/zh/nodejs/api/cli#--allow-fs-read), [`--allow-fs-write`](/zh/nodejs/api/cli#--allow-fs-write) 标志进行管理
- 子进程 - 可通过 [`--allow-child-process`](/zh/nodejs/api/cli#--allow-child-process) 标志进行管理
- 工作线程 - 可通过 [`--allow-worker`](/zh/nodejs/api/cli#--allow-worker) 标志进行管理
- WASI - 可通过 [`--allow-wasi`](/zh/nodejs/api/cli#--allow-wasi) 标志进行管理
- 插件 - 可通过 [`--allow-addons`](/zh/nodejs/api/cli#--allow-addons) 标志进行管理

### `--preserve-symlinks` {#--permission}

**添加于: v6.3.0**

指示模块加载器在解析和缓存模块时保留符号链接。

默认情况下，当 Node.js 从一个符号链接到磁盘上不同位置的路径加载模块时，Node.js 将解除链接并使用模块的实际磁盘“真实路径”作为标识符和根路径来定位其他依赖模块。在大多数情况下，这种默认行为是可以接受的。但是，当使用符号链接的对等依赖项时，如下面的示例所示，如果 `moduleA` 尝试将 `moduleB` 作为对等依赖项 `require` 时，默认行为会导致抛出异常：

```text [TEXT]
{appDir}
 ├── app
 │   ├── index.js
 │   └── node_modules
 │       ├── moduleA -> {appDir}/moduleA
 │       └── moduleB
 │           ├── index.js
 │           └── package.json
 └── moduleA
     ├── index.js
     └── package.json
```
`--preserve-symlinks` 命令行标志指示 Node.js 对模块使用符号链接路径，而不是真实路径，从而允许找到符号链接的对等依赖项。

但是请注意，使用 `--preserve-symlinks` 可能会产生其他副作用。 具体来说，如果符号链接的 *原生* 模块从依赖关系树中的多个位置链接，则可能无法加载（Node.js 会将它们视为两个单独的模块，并尝试多次加载该模块，从而导致抛出异常）。

`--preserve-symlinks` 标志不适用于主模块，这允许 `node --preserve-symlinks node_module/.bin/\<foo\>` 工作。 要对主模块应用相同的行为，也请使用 `--preserve-symlinks-main`。


### `--preserve-symlinks-main` {#--preserve-symlinks}

**新增于: v10.2.0**

指示模块加载器在解析和缓存主模块 (`require.main`) 时保留符号链接。

此标志的存在是为了使主模块可以选择加入与 `--preserve-symlinks` 赋予所有其他导入相同的行为；但是，为了与旧版本的 Node.js 兼容，它们是单独的标志。

`--preserve-symlinks-main` 并不意味着 `--preserve-symlinks`；当不希望在解析相对路径之前跟踪符号链接时，除了 `--preserve-symlinks` 之外，还可以使用 `--preserve-symlinks-main`。

有关更多信息，请参见 [`--preserve-symlinks`](/zh/nodejs/api/cli#--preserve-symlinks)。

### `-p`, `--print "script"` {#--preserve-symlinks-main}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v5.11.0 | 内置库现在可用作预定义变量。 |
| v0.6.4 | 新增于: v0.6.4 |
:::

与 `-e` 相同，但会打印结果。

### `--prof` {#-p---print-"script"}

**新增于: v2.0.0**

生成 V8 分析器输出。

### `--prof-process` {#--prof}

**新增于: v5.2.0**

处理使用 V8 选项 `--prof` 生成的 V8 分析器输出。

### `--redirect-warnings=file` {#--prof-process}

**新增于: v8.0.0**

将进程警告写入给定的文件，而不是打印到 stderr。 如果该文件不存在，则会创建该文件，如果存在，则会追加到该文件。 如果在尝试将警告写入文件时发生错误，则会将警告写入 stderr。

`file` 名称可以是绝对路径。 如果不是，则要写入到的默认目录由 [`--diagnostic-dir`](/zh/nodejs/api/cli#--diagnostic-dirdirectory) 命令行选项控制。

### `--report-compact` {#--redirect-warnings=file}

**新增于: v13.12.0, v12.17.0**

以紧凑的格式（单行 JSON）写入报告，与为人工使用而设计的默认多行格式相比，日志处理系统更容易使用。

### `--report-dir=directory`, `report-directory=directory` {#--report-compact}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v13.12.0, v12.17.0 | 此选项不再是实验性的。 |
| v12.0.0 | 从 `--diagnostic-report-directory` 更改为 `--report-directory`。 |
| v11.8.0 | 新增于: v11.8.0 |
:::

将在其中生成报告的位置。


### `--report-exclude-env` {#--report-dir=directory-report-directory=directory}

**添加于: v23.3.0**

当传递了 `--report-exclude-env` 时，生成的诊断报告将不包含 `environmentVariables` 数据。

### `--report-exclude-network` {#--report-exclude-env}

**添加于: v22.0.0, v20.13.0**

从诊断报告中排除 `header.networkInterfaces`。默认情况下，此项未设置，并且包含网络接口。

### `--report-filename=filename` {#--report-exclude-network}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.12.0, v12.17.0 | 此选项不再是实验性的。 |
| v12.0.0 | 从 `--diagnostic-report-filename` 更改为 `--report-filename`。 |
| v11.8.0 | 添加于: v11.8.0 |
:::

报告将写入的文件名。

如果文件名设置为 `'stdout'` 或 `'stderr'`，报告将分别写入进程的 stdout 或 stderr。

### `--report-on-fatalerror` {#--report-filename=filename}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.0.0, v13.14.0, v12.17.0 | 此选项不再是实验性的。 |
| v12.0.0 | 从 `--diagnostic-report-on-fatalerror` 更改为 `--report-on-fatalerror`。 |
| v11.8.0 | 添加于: v11.8.0 |
:::

允许在导致应用程序终止的致命错误（Node.js 运行时内部的错误，例如内存不足）时触发报告。 有助于检查各种诊断数据元素，例如堆、栈、事件循环状态、资源消耗等，以推断致命错误的原因。

### `--report-on-signal` {#--report-on-fatalerror}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.12.0, v12.17.0 | 此选项不再是实验性的。 |
| v12.0.0 | 从 `--diagnostic-report-on-signal` 更改为 `--report-on-signal`。 |
| v11.8.0 | 添加于: v11.8.0 |
:::

允许在接收到指定的（或预定义的）信号时，生成运行中的 Node.js 进程的报告。 触发报告的信号通过 `--report-signal` 指定。

### `--report-signal=signal` {#--report-on-signal}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.12.0, v12.17.0 | 此选项不再是实验性的。 |
| v12.0.0 | 从 `--diagnostic-report-signal` 更改为 `--report-signal`。 |
| v11.8.0 | 添加于: v11.8.0 |
:::

设置或重置用于生成报告的信号（Windows 上不支持）。 默认信号是 `SIGUSR2`。


### `--report-uncaught-exception` {#--report-signal=signal}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v18.8.0, v16.18.0 | 如果未捕获的异常被处理，则不会生成报告。 |
| v13.12.0, v12.17.0 | 此选项不再是实验性的。 |
| v12.0.0 | 从 `--diagnostic-report-uncaught-exception` 更改为 `--report-uncaught-exception`。 |
| v11.8.0 | 添加于: v11.8.0 |
:::

启用在进程因未捕获的异常而退出时生成报告。 在结合原生堆栈和其他运行时环境数据检查 JavaScript 堆栈时非常有用。

### `-r`, `--require module` {#--report-uncaught-exception}

**添加于: v1.6.0**

在启动时预加载指定的模块。

遵循 `require()` 的模块解析规则。 `module` 可以是文件的路径，也可以是 node 模块名称。

仅支持 CommonJS 模块。 使用 [`--import`](/zh/nodejs/api/cli#--importmodule) 预加载 [ECMAScript 模块](/zh/nodejs/api/esm#modules-ecmascript-modules)。 使用 `--require` 预加载的模块将在使用 `--import` 预加载的模块之前运行。

模块被预加载到主线程以及任何 worker 线程、派生的进程或集群的进程中。

### `--run` {#-r---require-module}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.3.0 | 添加了 NODE_RUN_SCRIPT_NAME 环境变量。 |
| v22.3.0 | 添加了 NODE_RUN_PACKAGE_JSON_PATH 环境变量。 |
| v22.3.0 | 向上遍历到根目录并找到 `package.json` 文件以从中运行命令，并相应地更新 `PATH` 环境变量。 |
| v22.0.0 | 添加于: v22.0.0 |
:::

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) [稳定性：2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

这会从 package.json 的 `"scripts"` 对象运行指定的命令。 如果提供了缺少的 `"command"`，它将列出可用的脚本。

`--run` 将向上遍历到根目录，并找到一个 `package.json` 文件以从中运行命令。

`--run` 将当前目录的每个祖先的 `./node_modules/.bin` 前置到 `PATH`，以便从存在多个 `node_modules` 目录的不同文件夹执行二进制文件（如果 `ancestor-folder/node_modules/.bin` 是一个目录）。

`--run` 在包含相关 `package.json` 的目录中执行命令。

例如，以下命令将运行当前文件夹中 `package.json` 的 `test` 脚本：

```bash [BASH]
$ node --run test
```
您还可以将参数传递给命令。 `--` 之后的任何参数都将附加到脚本：

```bash [BASH]
$ node --run test -- --verbose
```

#### 故意限制 {#--run}

`node --run` 的目的不是要匹配 `npm run` 或其他包管理器的 `run` 命令的行为。Node.js 的实现有意地更加有限，以便专注于最常见用例的最高性能。其他 `run` 实现的一些特性被有意排除在外，包括：

- 除了指定的脚本外，不运行 `pre` 或 `post` 脚本。
- 不定义包管理器特定的环境变量。

#### 环境变量 {#intentional-limitations}

使用 `--run` 运行脚本时，会设置以下环境变量：

- `NODE_RUN_SCRIPT_NAME`: 正在运行的脚本的名称。例如，如果 `--run` 用于运行 `test`，则此变量的值将为 `test`。
- `NODE_RUN_PACKAGE_JSON_PATH`: 正在处理的 `package.json` 的路径。

### `--secure-heap-min=n` {#environment-variables}

**新增于: v15.6.0**

当使用 `--secure-heap` 时，`--secure-heap-min` 标志指定从安全堆进行的最小分配。最小值是 `2`。最大值是 `--secure-heap` 或 `2147483647` 中的较小者。给定的值必须是 2 的幂。

### `--secure-heap=n` {#--secure-heap-min=n}

**新增于: v15.6.0**

初始化一个 `n` 字节的 OpenSSL 安全堆。初始化后，安全堆用于密钥生成和其他操作期间 OpenSSL 中选定类型的分配。例如，这对于防止由于指针溢出或下溢而导致敏感信息泄漏非常有用。

安全堆是固定大小的，无法在运行时调整大小，因此，如果使用它，选择足够大的堆来覆盖所有应用程序用途非常重要。

给定的堆大小必须是 2 的幂。任何小于 2 的值都将禁用安全堆。

默认情况下禁用安全堆。

安全堆在 Windows 上不可用。

有关更多详细信息，请参见 [`CRYPTO_secure_malloc_init`](https://www.openssl.org/docs/man3.0/man3/CRYPTO_secure_malloc_init)。

### `--snapshot-blob=path` {#--secure-heap=n}

**新增于: v18.8.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

与 `--build-snapshot` 一起使用时，`--snapshot-blob` 指定生成快照 blob 写入的路径。如果未指定，则生成的 blob 将写入当前工作目录中的 `snapshot.blob`。

在没有 `--build-snapshot` 的情况下使用时，`--snapshot-blob` 指定用于恢复应用程序状态的 blob 的路径。

加载快照时，Node.js 会检查：

如果它们不匹配，Node.js 将拒绝加载快照并以状态码 1 退出。


### `--test` {#--snapshot-blob=path}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.0.0 | 测试运行器现在稳定。 |
| v19.2.0, v18.13.0 | 测试运行器现在支持在观察模式下运行。 |
| v18.1.0, v16.17.0 | 添加于: v18.1.0, v16.17.0 |
:::

启动 Node.js 命令行测试运行器。此标志不能与 `--watch-path`、`--check`、`--eval`、`--interactive` 或 inspector 结合使用。 有关更多详细信息，请参阅有关[从命令行运行测试](/zh/nodejs/api/test#running-tests-from-the-command-line)的文档。

### `--test-concurrency` {#--test}

**添加于: v21.0.0, v20.10.0, v18.19.0**

测试运行器 CLI 将并发执行的最大测试文件数。 如果 `--experimental-test-isolation` 设置为 `'none'`，则忽略此标志，并且并发度为 1。 否则，并发度默认为 `os.availableParallelism() - 1`。

### `--test-coverage-branches=threshold` {#--test-concurrency}

**添加于: v22.8.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

要求覆盖分支的最小百分比。 如果代码覆盖率未达到指定的阈值，则该进程将以代码 `1` 退出。

### `--test-coverage-exclude` {#--test-coverage-branches=threshold}

**添加于: v22.5.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

使用 glob 模式从代码覆盖率中排除特定文件，该模式可以匹配绝对和相对文件路径。

可以多次指定此选项以排除多个 glob 模式。

如果同时提供 `--test-coverage-exclude` 和 `--test-coverage-include`，则文件必须满足**两个**条件才能包含在覆盖率报告中。

默认情况下，所有匹配的测试文件都将从覆盖率报告中排除。 指定此选项将覆盖默认行为。

### `--test-coverage-functions=threshold` {#--test-coverage-exclude}

**添加于: v22.8.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

要求覆盖函数的最小百分比。 如果代码覆盖率未达到指定的阈值，则该进程将以代码 `1` 退出。


### `--test-coverage-include` {#--test-coverage-functions=threshold}

**添加于: v22.5.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

使用 glob 模式在代码覆盖率中包含特定文件，该模式可以匹配绝对和相对文件路径。

可以多次指定此选项以包含多个 glob 模式。

如果同时提供了 `--test-coverage-exclude` 和 `--test-coverage-include`，则文件必须满足**两者**标准才能包含在覆盖率报告中。

### `--test-coverage-lines=threshold` {#--test-coverage-include}

**添加于: v22.8.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

要求覆盖行的最小百分比。如果代码覆盖率未达到指定的阈值，则进程将以代码 `1` 退出。

### `--test-force-exit` {#--test-coverage-lines=threshold}

**添加于: v22.0.0, v20.14.0**

配置测试运行器，以便在所有已知测试执行完毕后退出进程，即使事件循环原本会保持活动状态。

### `--test-name-pattern` {#--test-force-exit}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.0.0 | 测试运行器现在是稳定的。 |
| v18.11.0 | 添加于: v18.11.0 |
:::

一个正则表达式，用于配置测试运行器仅执行名称与提供的模式匹配的测试。有关更多详细信息，请参见[按名称过滤测试](/zh/nodejs/api/test#filtering-tests-by-name)的文档。

如果同时提供了 `--test-name-pattern` 和 `--test-skip-pattern`，则测试必须满足**两者**要求才能执行。

### `--test-only` {#--test-name-pattern}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.0.0 | 测试运行器现在是稳定的。 |
| v18.0.0, v16.17.0 | 添加于: v18.0.0, v16.17.0 |
:::

配置测试运行器仅执行设置了 `only` 选项的顶级测试。禁用测试隔离时，不需要此标志。

### `--test-reporter` {#--test-only}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.0.0 | 测试运行器现在是稳定的。 |
| v19.6.0, v18.15.0 | 添加于: v19.6.0, v18.15.0 |
:::

运行测试时使用的测试报告器。有关更多详细信息，请参见[测试报告器](/zh/nodejs/api/test#test-reporters)的文档。


### `--test-reporter-destination` {#--test-reporter}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.0.0 | 测试运行器现在是稳定的。 |
| v19.6.0, v18.15.0 | 添加于：v19.6.0, v18.15.0 |
:::

相应测试报告器的目标位置。 有关更多详细信息，请参阅关于[测试报告器](/zh/nodejs/api/test#test-reporters)的文档。

### `--test-shard` {#--test-reporter-destination}

**添加于：v20.5.0, v18.19.0**

要执行的测试套件分片，格式为 `\<index\>/\<total\>`，其中

`index` 是一个正整数，表示分割部分的索引。`total` 是一个正整数，表示分割部分的总数。此命令会将所有测试文件分成 `total` 个相等的部分，并且仅运行那些恰好位于 `index` 部分中的文件。

例如，要将测试套件分成三个部分，请使用以下命令：

```bash [BASH]
node --test --test-shard=1/3
node --test --test-shard=2/3
node --test --test-shard=3/3
```
### `--test-skip-pattern` {#--test-shard}

**添加于：v22.1.0**

一个正则表达式，用于配置测试运行器以跳过名称与提供的模式匹配的测试。 有关更多详细信息，请参阅关于[按名称过滤测试](/zh/nodejs/api/test#filtering-tests-by-name)的文档。

如果同时提供了 `--test-name-pattern` 和 `--test-skip-pattern`，则测试必须满足**两个**要求才能执行。

### `--test-timeout` {#--test-skip-pattern}

**添加于：v21.2.0, v20.11.0**

测试执行将在多少毫秒后失败。 如果未指定，则子测试从其父测试继承此值。 默认值为 `Infinity`。

### `--test-update-snapshots` {#--test-timeout}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.4.0 | 快照测试不再是实验性的。 |
| v22.3.0 | 添加于：v22.3.0 |
:::

重新生成测试运行器用于[快照测试](/zh/nodejs/api/test#snapshot-testing)的快照文件。

### `--throw-deprecation` {#--test-update-snapshots}

**添加于：v0.11.14**

对弃用抛出错误。

### `--title=title` {#--throw-deprecation}

**添加于：v10.7.0**

在启动时设置 `process.title`。

### `--tls-cipher-list=list` {#--title=title}

**添加于：v4.0.0**

指定备用默认 TLS 密码列表。 需要使用加密支持构建 Node.js（默认）。


### `--tls-keylog=file` {#--tls-cipher-list=list}

**新增于: v13.2.0, v12.16.0**

将 TLS 密钥材料记录到文件中。 密钥材料采用 NSS `SSLKEYLOGFILE` 格式，可供软件（例如 Wireshark）用于解密 TLS 流量。

### `--tls-max-v1.2` {#--tls-keylog=file}

**新增于: v12.0.0, v10.20.0**

将 [`tls.DEFAULT_MAX_VERSION`](/zh/nodejs/api/tls#tlsdefault_max_version) 设置为 'TLSv1.2'。 用于禁用对 TLSv1.3 的支持。

### `--tls-max-v1.3` {#--tls-max-v12}

**新增于: v12.0.0**

将默认的 [`tls.DEFAULT_MAX_VERSION`](/zh/nodejs/api/tls#tlsdefault_max_version) 设置为 'TLSv1.3'。 用于启用对 TLSv1.3 的支持。

### `--tls-min-v1.0` {#--tls-max-v13}

**新增于: v12.0.0, v10.20.0**

将默认的 [`tls.DEFAULT_MIN_VERSION`](/zh/nodejs/api/tls#tlsdefault_min_version) 设置为 'TLSv1'。 用于与旧的 TLS 客户端或服务器兼容。

### `--tls-min-v1.1` {#--tls-min-v10}

**新增于: v12.0.0, v10.20.0**

将默认的 [`tls.DEFAULT_MIN_VERSION`](/zh/nodejs/api/tls#tlsdefault_min_version) 设置为 'TLSv1.1'。 用于与旧的 TLS 客户端或服务器兼容。

### `--tls-min-v1.2` {#--tls-min-v11}

**新增于: v12.2.0, v10.20.0**

将默认的 [`tls.DEFAULT_MIN_VERSION`](/zh/nodejs/api/tls#tlsdefault_min_version) 设置为 'TLSv1.2'。 这是 12.x 及更高版本的默认设置，但为了与旧版本的 Node.js 兼容，支持此选项。

### `--tls-min-v1.3` {#--tls-min-v12}

**新增于: v12.0.0**

将默认的 [`tls.DEFAULT_MIN_VERSION`](/zh/nodejs/api/tls#tlsdefault_min_version) 设置为 'TLSv1.3'。 用于禁用对 TLSv1.2 的支持，该协议不如 TLSv1.3 安全。

### `--trace-deprecation` {#--tls-min-v13}

**新增于: v0.8.0**

打印弃用的堆栈跟踪。

### `--trace-env` {#--trace-deprecation}

**新增于: v23.4.0**

将当前 Node.js 实例中对环境变量的任何访问的信息打印到 stderr，包括：

- Node.js 内部执行的环境变量读取。
- 以 `process.env.KEY = "SOME VALUE"` 形式的写入。
- 以 `process.env.KEY` 形式的读取。
- 以 `Object.defineProperty(process.env, 'KEY', {...})` 形式的定义。
- 以 `Object.hasOwn(process.env, 'KEY')`、`process.env.hasOwnProperty('KEY')` 或 `'KEY' in process.env` 形式的查询。
- 以 `delete process.env.KEY` 形式的删除。
- 以 `...process.env` 或 `Object.keys(process.env)` 形式的枚举。

仅打印正在访问的环境变量的名称。 不打印值。

要打印访问的堆栈跟踪，请使用 `--trace-env-js-stack` 和/或 `--trace-env-native-stack`。


### `--trace-env-js-stack` {#--trace-env}

**添加于: v23.4.0**

除了`--trace-env`的作用外，还会打印访问的 JavaScript 堆栈跟踪。

### `--trace-env-native-stack` {#--trace-env-js-stack}

**添加于: v23.4.0**

除了`--trace-env`的作用外，还会打印访问的 native 堆栈跟踪。

### `--trace-event-categories` {#--trace-env-native-stack}

**添加于: v7.7.0**

当使用`--trace-events-enabled`启用跟踪事件跟踪时，应该跟踪的类别（逗号分隔的列表）。

### `--trace-event-file-pattern` {#--trace-event-categories}

**添加于: v9.8.0**

指定跟踪事件数据文件路径的模板字符串，它支持 `${rotation}` 和 `${pid}`。

### `--trace-events-enabled` {#--trace-event-file-pattern}

**添加于: v7.7.0**

启用跟踪事件跟踪信息的收集。

### `--trace-exit` {#--trace-events-enabled}

**添加于: v13.5.0, v12.16.0**

每当主动退出环境时（即调用 `process.exit()`）打印堆栈跟踪。

### `--trace-require-module=mode` {#--trace-exit}

**添加于: v23.5.0**

打印关于[使用 `require()` 加载 ECMAScript 模块](/zh/nodejs/api/modules#loading-ecmascript-modules-using-require)的信息。

当 `mode` 是 `all` 时，打印所有用法。 当 `mode` 是 `no-node-modules` 时，排除来自 `node_modules` 文件夹的用法。

### `--trace-sigint` {#--trace-require-module=mode}

**添加于: v13.9.0, v12.17.0**

在 SIGINT 上打印堆栈跟踪。

### `--trace-sync-io` {#--trace-sigint}

**添加于: v2.1.0**

在事件循环的第一次循环之后检测到同步 I/O 时打印堆栈跟踪。

### `--trace-tls` {#--trace-sync-io}

**添加于: v12.2.0**

将 TLS 数据包跟踪信息打印到 `stderr`。 这可以用于调试 TLS 连接问题。

### `--trace-uncaught` {#--trace-tls}

**添加于: v13.1.0**

为未捕获的异常打印堆栈跟踪； 通常，会打印与 `Error` 的创建相关的堆栈跟踪，而这使得 Node.js 还会打印与抛出值相关的堆栈跟踪（不需要是 `Error` 实例）。

启用此选项可能会对垃圾收集行为产生负面影响。

### `--trace-warnings` {#--trace-uncaught}

**添加于: v6.0.0**

打印进程警告（包括弃用）的堆栈跟踪。


### `--track-heap-objects` {#--trace-warnings}

**添加于: v2.4.0**

跟踪堆快照的堆对象分配。

### `--unhandled-rejections=mode` {#--track-heap-objects}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v15.0.0 | 将默认模式更改为 `throw`。 之前，会发出警告。 |
| v12.0.0, v10.17.0 | 添加于: v12.0.0, v10.17.0 |
:::

使用此标志可以更改发生未处理的拒绝时应该发生的情况。 可以选择以下模式之一：

- `throw`: 发出 [`unhandledRejection`](/zh/nodejs/api/process#event-unhandledrejection)。 如果未设置此钩子，则将未处理的拒绝作为未捕获的异常引发。 这是默认设置。
- `strict`: 将未处理的拒绝作为未捕获的异常引发。 如果异常被处理，则发出 [`unhandledRejection`](/zh/nodejs/api/process#event-unhandledrejection)。
- `warn`: 始终触发警告，无论是否设置了 [`unhandledRejection`](/zh/nodejs/api/process#event-unhandledrejection) 钩子，但不打印弃用警告。
- `warn-with-error-code`: 发出 [`unhandledRejection`](/zh/nodejs/api/process#event-unhandledrejection)。 如果未设置此钩子，则触发警告，并将进程退出代码设置为 1。
- `none`: 静默所有警告。

如果在命令行入口点的 ES 模块静态加载阶段发生拒绝，它将始终将其作为未捕获的异常引发。

### `--use-bundled-ca`, `--use-openssl-ca` {#--unhandled-rejections=mode}

**添加于: v6.11.0**

使用当前 Node.js 版本提供的捆绑 Mozilla CA 存储，或使用 OpenSSL 的默认 CA 存储。 默认存储可在构建时选择。

Node.js 提供的捆绑 CA 存储是 Mozilla CA 存储的快照，该快照在发布时是固定的。 它在所有受支持的平台上都是相同的。

使用 OpenSSL 存储允许对存储进行外部修改。 对于大多数 Linux 和 BSD 发行版，此存储由发行版维护者和系统管理员维护。 OpenSSL CA 存储位置取决于 OpenSSL 库的配置，但可以使用环境变量在运行时更改。

请参阅 `SSL_CERT_DIR` 和 `SSL_CERT_FILE`。


### `--use-largepages=mode` {#--use-bundled-ca---use-openssl-ca}

**添加于: v13.6.0, v12.17.0**

在启动时将 Node.js 静态代码重新映射到大内存页。 如果目标系统支持，这将导致 Node.js 静态代码被移动到 2 MiB 页而不是 4 KiB 页。

以下值对 `mode` 有效：

- `off`: 不会尝试映射。 这是默认值。
- `on`: 如果操作系统支持，将尝试映射。 映射失败将被忽略，并且一条消息将打印到标准错误输出。
- `silent`: 如果操作系统支持，将尝试映射。 映射失败将被忽略，并且不会报告。

### `--v8-options` {#--use-largepages=mode}

**添加于: v0.1.3**

打印 V8 命令行选项。

### `--v8-pool-size=num` {#--v8-options}

**添加于: v5.10.0**

设置 V8 的线程池大小，该线程池将用于分配后台任务。

如果设置为 `0`，则 Node.js 将根据对并行量的估计选择合适的线程池大小。

并行量是指在给定的机器中可以同时执行的计算数量。 一般来说，它与 CPU 的数量相同，但在 VM 或容器等环境中可能会有所不同。

### `-v`, `--version` {#--v8-pool-size=num}

**添加于: v0.1.3**

打印 node 的版本。

### `--watch` {#-v---version}

::: info [历史]
| 版本 | 更改 |
| --- | --- |
| v22.0.0, v20.13.0 | 观察模式现在是稳定的。 |
| v19.2.0, v18.13.0 | 测试运行器现在支持在观察模式下运行。 |
| v18.11.0, v16.19.0 | 添加于: v18.11.0, v16.19.0 |
:::

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

以观察模式启动 Node.js。 在观察模式下，被观察文件的更改会导致 Node.js 进程重新启动。 默认情况下，观察模式将观察入口点和任何必需或导入的模块。 使用 `--watch-path` 指定要观察的路径。

此标志不能与 `--check`、`--eval`、`--interactive` 或 REPL 结合使用。

```bash [BASH]
node --watch index.js
```

### `--watch-path` {#--watch}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v22.0.0, v20.13.0 | 监视模式现在已稳定。 |
| v18.11.0, v16.19.0 | 添加于: v18.11.0, v16.19.0 |
:::

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

以监视模式启动 Node.js 并指定要监视的路径。在监视模式下，监视路径中的更改会导致 Node.js 进程重新启动。这将关闭对必需或导入模块的监视，即使与 `--watch` 结合使用也是如此。

此标志不能与 `--check`、`--eval`、`--interactive`、`--test` 或 REPL 结合使用。

```bash [BASH]
node --watch-path=./src --watch-path=./tests index.js
```
此选项仅在 macOS 和 Windows 上受支持。如果在不支持它的平台上使用该选项，则会抛出 `ERR_FEATURE_UNAVAILABLE_ON_PLATFORM` 异常。

### `--watch-preserve-output` {#--watch-path}

**添加于: v19.3.0, v18.13.0**

禁用在监视模式重新启动进程时清除控制台。

```bash [BASH]
node --watch --watch-preserve-output test.js
```
### `--zero-fill-buffers` {#--watch-preserve-output}

**添加于: v6.0.0**

自动将所有新分配的 [`Buffer`](/zh/nodejs/api/buffer#class-buffer) 和 [`SlowBuffer`](/zh/nodejs/api/buffer#class-slowbuffer) 实例填充为零。

## 环境变量 {#--zero-fill-buffers}

### `FORCE_COLOR=[1, 2, 3]` {#environment-variables_1}

`FORCE_COLOR` 环境变量用于启用 ANSI 彩色输出。该值可以是：

- `1`、`true` 或空字符串 `''` 表示支持 16 色，
- `2` 表示支持 256 色，或
- `3` 表示支持 1600 万色。

当使用 `FORCE_COLOR` 并将其设置为支持的值时，`NO_COLOR` 和 `NODE_DISABLE_COLORS` 环境变量都将被忽略。

任何其他值将导致彩色输出被禁用。

### `NODE_COMPILE_CACHE=dir` {#force_color=1-2-3}

**添加于: v22.1.0**

::: warning [稳定: 1 - 实验性]
[稳定: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发
:::

为 Node.js 实例启用 [模块编译缓存](/zh/nodejs/api/module#module-compile-cache)。 有关详细信息，请参阅 [模块编译缓存](/zh/nodejs/api/module#module-compile-cache) 的文档。


### `NODE_DEBUG=module[,…]` {#node_compile_cache=dir}

**新增于: v0.1.32**

应该打印调试信息的以 `','` 分隔的核心模块列表。

### `NODE_DEBUG_NATIVE=module[,…]` {#node_debug=module}

应该打印调试信息的以 `','` 分隔的核心 C++ 模块列表。

### `NODE_DISABLE_COLORS=1` {#node_debug_native=module}

**新增于: v0.3.0**

设置后，颜色将不会在 REPL 中使用。

### `NODE_DISABLE_COMPILE_CACHE=1` {#node_disable_colors=1}

**新增于: v22.8.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发
:::

禁用 Node.js 实例的 [模块编译缓存](/zh/nodejs/api/module#module-compile-cache)。 有关详细信息，请参阅 [模块编译缓存](/zh/nodejs/api/module#module-compile-cache) 的文档。

### `NODE_EXTRA_CA_CERTS=file` {#node_disable_compile_cache=1}

**新增于: v7.3.0**

设置后，众所周知的 "root" CA（如 VeriSign）将使用 `file` 中的额外证书进行扩展。 该文件应包含一个或多个 PEM 格式的可信证书。 如果文件丢失或格式不正确，将使用 [`process.emitWarning()`](/zh/nodejs/api/process#processemitwarningwarning-options) 发出一条消息（一次），但其他任何错误都将被忽略。

当为 TLS 或 HTTPS 客户端或服务器显式指定 `ca` 选项属性时，既不会使用众所周知的证书，也不会使用额外的证书。

当 `node` 以 setuid root 身份运行或设置了 Linux 文件功能时，将忽略此环境变量。

`NODE_EXTRA_CA_CERTS` 环境变量仅在首次启动 Node.js 进程时读取。 在运行时使用 `process.env.NODE_EXTRA_CA_CERTS` 更改值对当前进程没有影响。

### `NODE_ICU_DATA=file` {#node_extra_ca_certs=file}

**新增于: v0.11.15**

ICU（`Intl` 对象）的数据路径。 当使用 small-icu 支持编译时，将扩展链接的数据。

### `NODE_NO_WARNINGS=1` {#node_icu_data=file}

**新增于: v6.11.0**

当设置为 `1` 时，进程警告将被静音。

### `NODE_OPTIONS=options...` {#node_no_warnings=1}

**新增于: v8.0.0**

一个以空格分隔的命令行选项列表。 `options...` 在命令行选项之前解释，因此命令行选项将在 `options...` 中的任何内容之后覆盖或复合。 如果使用了环境中不允许的选项（例如 `-p` 或脚本文件），Node.js 将退出并显示错误。

如果选项值包含空格，则可以使用双引号对其进行转义：

```bash [BASH]
NODE_OPTIONS='--require "./my path/file.js"'
```
作为命令行选项传递的单例标志将覆盖传递到 `NODE_OPTIONS` 中的相同标志：

```bash [BASH]
# 检查器将在端口 5555 上可用 {#node_options=options}
NODE_OPTIONS='--inspect=localhost:4444' node --inspect=localhost:5555
```
可以多次传递的标志将被视为其 `NODE_OPTIONS` 实例首先传递，然后是其命令行实例：

```bash [BASH]
NODE_OPTIONS='--require "./a.js"' node --require "./b.js"
# 等价于： {#the-inspector-will-be-available-on-port-5555}
node --require "./a.js" --require "./b.js"
```
允许使用的 Node.js 选项在以下列表中。 如果一个选项支持 `--XX` 和 `--no-XX` 变体，则它们都受支持，但列表中仅包含一个。

- `--allow-addons`
- `--allow-child-process`
- `--allow-fs-read`
- `--allow-fs-write`
- `--allow-wasi`
- `--allow-worker`
- `--conditions`, `-C`
- `--diagnostic-dir`
- `--disable-proto`
- `--disable-warning`
- `--disable-wasm-trap-handler`
- `--dns-result-order`
- `--enable-fips`
- `--enable-network-family-autoselection`
- `--enable-source-maps`
- `--entry-url`
- `--experimental-abortcontroller`
- `--experimental-async-context-frame`
- `--experimental-detect-module`
- `--experimental-eventsource`
- `--experimental-import-meta-resolve`
- `--experimental-json-modules`
- `--experimental-loader`
- `--experimental-modules`
- `--experimental-permission`
- `--experimental-print-required-tla`
- `--experimental-require-module`
- `--experimental-shadow-realm`
- `--experimental-specifier-resolution`
- `--experimental-strip-types`
- `--experimental-top-level-await`
- `--experimental-transform-types`
- `--experimental-vm-modules`
- `--experimental-wasi-unstable-preview1`
- `--experimental-wasm-modules`
- `--experimental-webstorage`
- `--force-context-aware`
- `--force-fips`
- `--force-node-api-uncaught-exceptions-policy`
- `--frozen-intrinsics`
- `--heap-prof-dir`
- `--heap-prof-interval`
- `--heap-prof-name`
- `--heap-prof`
- `--heapsnapshot-near-heap-limit`
- `--heapsnapshot-signal`
- `--http-parser`
- `--icu-data-dir`
- `--import`
- `--input-type`
- `--insecure-http-parser`
- `--inspect-brk`
- `--inspect-port`, `--debug-port`
- `--inspect-publish-uid`
- `--inspect-wait`
- `--inspect`
- `--localstorage-file`
- `--max-http-header-size`
- `--napi-modules`
- `--network-family-autoselection-attempt-timeout`
- `--no-addons`
- `--no-deprecation`
- `--no-experimental-global-navigator`
- `--no-experimental-repl-await`
- `--no-experimental-sqlite`
- `--no-experimental-websocket`
- `--no-extra-info-on-fatal-exception`
- `--no-force-async-hooks-checks`
- `--no-global-search-paths`
- `--no-network-family-autoselection`
- `--no-warnings`
- `--node-memory-debug`
- `--openssl-config`
- `--openssl-legacy-provider`
- `--openssl-shared-config`
- `--pending-deprecation`
- `--permission`
- `--preserve-symlinks-main`
- `--preserve-symlinks`
- `--prof-process`
- `--redirect-warnings`
- `--report-compact`
- `--report-dir`, `--report-directory`
- `--report-exclude-env`
- `--report-exclude-network`
- `--report-filename`
- `--report-on-fatalerror`
- `--report-on-signal`
- `--report-signal`
- `--report-uncaught-exception`
- `--require`, `-r`
- `--secure-heap-min`
- `--secure-heap`
- `--snapshot-blob`
- `--test-coverage-branches`
- `--test-coverage-exclude`
- `--test-coverage-functions`
- `--test-coverage-include`
- `--test-coverage-lines`
- `--test-name-pattern`
- `--test-only`
- `--test-reporter-destination`
- `--test-reporter`
- `--test-shard`
- `--test-skip-pattern`
- `--throw-deprecation`
- `--title`
- `--tls-cipher-list`
- `--tls-keylog`
- `--tls-max-v1.2`
- `--tls-max-v1.3`
- `--tls-min-v1.0`
- `--tls-min-v1.1`
- `--tls-min-v1.2`
- `--tls-min-v1.3`
- `--trace-deprecation`
- `--trace-env-js-stack`
- `--trace-env-native-stack`
- `--trace-env`
- `--trace-event-categories`
- `--trace-event-file-pattern`
- `--trace-events-enabled`
- `--trace-exit`
- `--trace-require-module`
- `--trace-sigint`
- `--trace-sync-io`
- `--trace-tls`
- `--trace-uncaught`
- `--trace-warnings`
- `--track-heap-objects`
- `--unhandled-rejections`
- `--use-bundled-ca`
- `--use-largepages`
- `--use-openssl-ca`
- `--v8-pool-size`
- `--watch-path`
- `--watch-preserve-output`
- `--watch`
- `--zero-fill-buffers`

允许使用的 V8 选项有：

- `--abort-on-uncaught-exception`
- `--disallow-code-generation-from-strings`
- `--enable-etw-stack-walking`
- `--expose-gc`
- `--interpreted-frames-native-stack`
- `--jitless`
- `--max-old-space-size`
- `--max-semi-space-size`
- `--perf-basic-prof-only-functions`
- `--perf-basic-prof`
- `--perf-prof-unwinding-info`
- `--perf-prof`
- `--stack-trace-limit`

`--perf-basic-prof-only-functions`、`--perf-basic-prof`、`--perf-prof-unwinding-info` 和 `--perf-prof` 仅在 Linux 上可用。

`--enable-etw-stack-walking` 仅在 Windows 上可用。


### `NODE_PATH=path[:…]` {#is-equivalent-to}

**新增于: v0.1.32**

以 `':'` 分隔的目录列表，会被添加到模块搜索路径的前面。

在 Windows 上，这是一个以 `';'` 分隔的列表。

### `NODE_PENDING_DEPRECATION=1` {#node_path=path}

**新增于: v8.0.0**

当设置为 `1` 时，发出待定弃用警告。

待定弃用通常与运行时弃用相同，但值得注意的是，默认情况下它们是*关闭*的，除非设置了 `--pending-deprecation` 命令行标志或 `NODE_PENDING_DEPRECATION=1` 环境变量，否则不会发出这些警告。待定弃用用于提供一种选择性的“早期预警”机制，开发人员可以利用该机制来检测已弃用的 API 用法。

### `NODE_PENDING_PIPE_INSTANCES=instances` {#node_pending_deprecation=1}

设置管道服务器等待连接时，挂起的管道实例句柄的数量。此设置仅适用于 Windows。

### `NODE_PRESERVE_SYMLINKS=1` {#node_pending_pipe_instances=instances}

**新增于: v7.1.0**

当设置为 `1` 时，指示模块加载器在解析和缓存模块时保留符号链接。

### `NODE_REDIRECT_WARNINGS=file` {#node_preserve_symlinks=1}

**新增于: v8.0.0**

设置后，进程警告将发送到给定的文件，而不是打印到 stderr。如果该文件不存在，则会创建该文件；如果该文件存在，则会追加到该文件。如果在尝试将警告写入文件时发生错误，则会将警告写入 stderr。这等效于使用 `--redirect-warnings=file` 命令行标志。

### `NODE_REPL_EXTERNAL_MODULE=file` {#node_redirect_warnings=file}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.3.0, v20.16.0 | 移除将此环境变量与 kDisableNodeOptionsEnv 一起用于嵌入器的可能性。 |
| v13.0.0, v12.16.0 | 新增于: v13.0.0, v12.16.0 |
:::

Node.js 模块的路径，该模块将加载以代替内置的 REPL。将此值覆盖为空字符串（`''`）将使用内置的 REPL。

### `NODE_REPL_HISTORY=file` {#node_repl_external_module=file}

**新增于: v3.0.0**

用于存储持久 REPL 历史记录的文件的路径。默认路径是 `~/.node_repl_history`，此变量会覆盖该路径。将该值设置为空字符串（`''` 或 `' '`）会禁用持久 REPL 历史记录。


### `NODE_SKIP_PLATFORM_CHECK=value` {#node_repl_history=file}

**加入版本: v14.5.0**

如果 `value` 等于 `'1'`，则在 Node.js 启动期间会跳过对支持平台的检查。 Node.js 可能无法正确执行。 在不支持的平台上遇到的任何问题都不会被修复。

### `NODE_TEST_CONTEXT=value` {#node_skip_platform_check=value}

如果 `value` 等于 `'child'`，测试报告器选项将被覆盖，测试输出将以 TAP 格式发送到 stdout。 如果提供任何其他值，Node.js 不保证所使用的报告器格式或其稳定性。

### `NODE_TLS_REJECT_UNAUTHORIZED=value` {#node_test_context=value}

如果 `value` 等于 `'0'`，则禁用 TLS 连接的证书验证。 这使得 TLS 以及 HTTPS 变得不安全。 强烈建议不要使用此环境变量。

### `NODE_V8_COVERAGE=dir` {#node_tls_reject_unauthorized=value}

设置后，Node.js 将开始将 [V8 JavaScript 代码覆盖率](https://v8project.blogspot.com/2017/12/javascript-code-coverage) 和 [源映射](https://sourcemaps.info/spec) 数据输出到作为参数提供的目录（覆盖率信息以 JSON 格式写入带有 `coverage` 前缀的文件）。

`NODE_V8_COVERAGE` 会自动传播到子进程，从而更容易检测调用 `child_process.spawn()` 系列函数的应用程序。 `NODE_V8_COVERAGE` 可以设置为空字符串，以防止传播。

### `NO_COLOR=<any>` {#node_v8_coverage=dir}

[`NO_COLOR`](https://no-color.org/) 是 `NODE_DISABLE_COLORS` 的别名。 环境变量的值是任意的。

#### 覆盖率输出 {#no_color=&lt;any&gt;}

覆盖率以 [ScriptCoverage](https://chromedevtools.github.io/devtools-protocol/tot/Profiler#type-ScriptCoverage) 对象数组的形式输出，位于顶层键 `result` 上：

```json [JSON]
{
  "result": [
    {
      "scriptId": "67",
      "url": "internal/tty.js",
      "functions": []
    }
  ]
}
```
#### 源代码映射缓存 {#coverage-output}

::: warning [稳定度: 1 - 实验]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验
:::

如果找到，源代码映射数据会附加到 JSON 覆盖率对象顶层键 `source-map-cache` 上。

`source-map-cache` 是一个对象，其键表示从中提取源代码映射的文件，值包括原始源代码映射 URL（在键 `url` 中）、解析的 Source Map v3 信息（在键 `data` 中）和源文件的行长度（在键 `lineLengths` 中）。

```json [JSON]
{
  "result": [
    {
      "scriptId": "68",
      "url": "file:///absolute/path/to/source.js",
      "functions": []
    }
  ],
  "source-map-cache": {
    "file:///absolute/path/to/source.js": {
      "url": "./path-to-map.json",
      "data": {
        "version": 3,
        "sources": [
          "file:///absolute/path/to/original.js"
        ],
        "names": [
          "Foo",
          "console",
          "info"
        ],
        "mappings": "MAAMA,IACJC,YAAaC",
        "sourceRoot": "./"
      },
      "lineLengths": [
        13,
        62,
        38,
        27
      ]
    }
  }
}
```

### `OPENSSL_CONF=file` {#source-map-cache}

**添加于: v6.11.0**

在启动时加载 OpenSSL 配置文件。 除其他用途外，如果 Node.js 使用 `./configure --openssl-fips` 构建，则可以使用它来启用符合 FIPS 标准的加密。

如果使用 [`--openssl-config`](/zh/nodejs/api/cli#--openssl-configfile) 命令行选项，则会忽略环境变量。

### `SSL_CERT_DIR=dir` {#openssl_conf=file}

**添加于: v7.7.0**

如果启用了 `--use-openssl-ca`，则此变量会覆盖并设置 OpenSSL 包含受信任证书的目录。

请注意，除非显式设置子环境，否则任何子进程都将继承此环境变量，并且如果它们使用 OpenSSL，则可能导致它们信任与 node 相同的 CA。

### `SSL_CERT_FILE=file` {#ssl_cert_dir=dir}

**添加于: v7.7.0**

如果启用了 `--use-openssl-ca`，则此变量会覆盖并设置 OpenSSL 包含受信任证书的文件。

请注意，除非显式设置子环境，否则任何子进程都将继承此环境变量，并且如果它们使用 OpenSSL，则可能导致它们信任与 node 相同的 CA。

### `TZ` {#ssl_cert_file=file}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v16.2.0 | 使用 process.env.TZ = 更改 TZ 变量也会更改 Windows 上的时区。 |
| v13.0.0 | 使用 process.env.TZ = 更改 TZ 变量会更改 POSIX 系统上的时区。 |
| v0.0.1 | 添加于: v0.0.1 |
:::

`TZ` 环境变量用于指定时区配置。

虽然 Node.js 不支持其他环境中处理 `TZ` 的各种[方式](https://www.gnu.org/software/libc/manual/html_node/TZ-Variable)，但它支持基本的[时区 ID](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)（例如 `'Etc/UTC'`、`'Europe/Paris'` 或 `'America/New_York'`）。 它可能支持一些其他的缩写或别名，但不建议使用这些缩写或别名，并且不保证有效。

```bash [BASH]
$ TZ=Europe/Dublin node -pe "new Date().toString()"
Wed May 12 2021 20:30:48 GMT+0100 (Irish Standard Time)
```

### `UV_THREADPOOL_SIZE=size` {#tz}

将 libuv 线程池中使用的线程数设置为 `size` 个线程。

Node.js 尽可能使用异步系统 API，但在不存在异步系统 API 的情况下，libuv 的线程池用于基于同步系统 API 创建异步 Node API。使用线程池的 Node.js API 包括：

- 所有 `fs` API，除了文件监视器 API 和那些显式同步的 API
- 异步加密 API，例如 `crypto.pbkdf2()`、`crypto.scrypt()`、`crypto.randomBytes()`、`crypto.randomFill()`、`crypto.generateKeyPair()`
- `dns.lookup()`
- 所有 `zlib` API，除了那些显式同步的 API

由于 libuv 的线程池大小是固定的，这意味着如果由于任何原因这些 API 中的任何一个花费了很长时间，那么在 libuv 线程池中运行的其他（看似无关的）API 将会遇到性能下降。 为了缓解这个问题，一种潜在的解决方案是通过将 `'UV_THREADPOOL_SIZE'` 环境变量设置为大于 `4`（其当前默认值）的值来增加 libuv 线程池的大小。 但是，从进程内部使用 `process.env.UV_THREADPOOL_SIZE=size` 进行设置并不能保证有效，因为线程池会在用户代码运行之前很久就作为运行时初始化的一部分创建。 更多信息请参阅 [libuv 线程池文档](https://docs.libuv.org/en/latest/threadpool)。

## 有用的 V8 选项 {#uv_threadpool_size=size}

V8 有自己的一组 CLI 选项。 提供给 `node` 的任何 V8 CLI 选项都将传递给 V8 进行处理。 V8 的选项*没有稳定性保证*。 V8 团队本身不认为它们是其正式 API 的一部分，并保留随时更改它们的权利。 同样，它们也不在 Node.js 稳定性保证的范围内。 许多 V8 选项仅对 V8 开发人员有意义。 尽管如此，仍有一小部分 V8 选项广泛适用于 Node.js，并且在此处对其进行文档化：

### `--abort-on-uncaught-exception` {#useful-v8-options}


### `--disallow-code-generation-from-strings` {#--abort-on-uncaught-exception_1}

### `--enable-etw-stack-walking` {#--disallow-code-generation-from-strings_1}

### `--expose-gc` {#--enable-etw-stack-walking}

### `--harmony-shadow-realm` {#--expose-gc_1}

### `--interpreted-frames-native-stack` {#--harmony-shadow-realm}

### `--jitless` {#--interpreted-frames-native-stack}

### `--max-old-space-size=SIZE` (单位为MiB) {#--jitless_1}

设置V8的旧内存区域的最大内存大小。当内存消耗接近限制时，V8将花费更多时间进行垃圾回收，以努力释放未使用的内存。

在一台拥有2 GiB内存的机器上，考虑将其设置为1536（1.5 GiB），以便为其他用途留下一些内存并避免交换。

```bash [BASH]
node --max-old-space-size=1536 index.js
```
### `--max-semi-space-size=SIZE` (单位为MiB) {#--max-old-space-size=size-in-mib}

设置V8的[scavenge 垃圾回收器](https://v8.dev/blog/orinoco-parallel-scavenger)的[半空间](https://www.memorymanagement.org/glossary/s#semi.space)的最大大小，单位为MiB（兆字节）。 增加半空间的最大大小可能会提高 Node.js 的吞吐量，但代价是更多的内存消耗。

由于V8堆的年轻代大小是半空间大小的三倍（请参阅 V8 中的 [`YoungGenerationSizeFromSemiSpaceSize`](https://chromium.googlesource.com/v8/v8.git/+/refs/tags/10.3.129/src/heap/heap.cc#328)），因此将半空间增加 1 MiB 适用于三个独立的半空间，并导致堆大小增加 3 MiB。吞吐量改进取决于您的工作负载（请参阅 [#42511](https://github.com/nodejs/node/issues/42511)）。

默认值取决于内存限制。 例如，在内存限制为 512 MiB 的 64 位系统上，半空间的最大大小默认为 1 MiB。 对于最高和包括 2GiB 的内存限制，64 位系统上半空间默认最大大小将小于 16 MiB。

要获得应用程序的最佳配置，您应该在为应用程序运行基准测试时尝试不同的 max-semi-space-size 值。

例如，在 64 位系统上进行基准测试：

```bash [BASH]
for MiB in 16 32 64 128; do
    node --max-semi-space-size=$MiB index.js
done
```

### `--perf-basic-prof` {#--max-semi-space-size=size-in-mib}

### `--perf-basic-prof-only-functions` {#--perf-basic-prof}

### `--perf-prof` {#--perf-basic-prof-only-functions}

### `--perf-prof-unwinding-info` {#--perf-prof}

### `--prof` {#--perf-prof-unwinding-info}

### `--security-revert` {#--prof_1}

### `--stack-trace-limit=limit` {#--security-revert}

在错误的堆栈跟踪中收集的最大堆栈帧数。将其设置为 0 会禁用堆栈跟踪收集。默认值为 10。

```bash [BASH]
node --stack-trace-limit=12 -p -e "Error.stackTraceLimit" # 输出 12
```

