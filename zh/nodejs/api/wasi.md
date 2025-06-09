---
title: Node.js WASI 文档
description: 探索 Node.js 的 WebAssembly 系统接口 (WASI) 文档，详细介绍如何在 Node.js 环境中使用 WASI，包括文件系统操作、环境变量等 API。
head:
  - - meta
    - name: og:title
      content: Node.js WASI 文档 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 探索 Node.js 的 WebAssembly 系统接口 (WASI) 文档，详细介绍如何在 Node.js 环境中使用 WASI，包括文件系统操作、环境变量等 API。
  - - meta
    - name: twitter:title
      content: Node.js WASI 文档 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 探索 Node.js 的 WebAssembly 系统接口 (WASI) 文档，详细介绍如何在 Node.js 环境中使用 WASI，包括文件系统操作、环境变量等 API。
---


# WebAssembly 系统接口 (WASI) {#webassembly-system-interface-wasi}

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

**当前 <code>node:wasi</code> 模块没有提供某些 WASI 运行时提供的全面的文件系统安全特性。
安全文件系统沙箱的完整支持可能会在未来实现，也可能不会实现。
在此期间，请勿依赖它来运行不受信任的代码。**

**源码:** [lib/wasi.js](https://github.com/nodejs/node/blob/v23.5.0/lib/wasi.js)

WASI API 提供了 [WebAssembly 系统接口](https://wasi.dev/) 规范的实现。 WASI 允许 WebAssembly 应用程序通过一系列类似 POSIX 的函数访问底层操作系统。

::: code-group
```js [ESM]
import { readFile } from 'node:fs/promises';
import { WASI } from 'node:wasi';
import { argv, env } from 'node:process';

const wasi = new WASI({
  version: 'preview1',
  args: argv,
  env,
  preopens: {
    '/local': '/some/real/path/that/wasm/can/access',
  },
});

const wasm = await WebAssembly.compile(
  await readFile(new URL('./demo.wasm', import.meta.url)),
);
const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());

wasi.start(instance);
```

```js [CJS]
'use strict';
const { readFile } = require('node:fs/promises');
const { WASI } = require('node:wasi');
const { argv, env } = require('node:process');
const { join } = require('node:path');

const wasi = new WASI({
  version: 'preview1',
  args: argv,
  env,
  preopens: {
    '/local': '/some/real/path/that/wasm/can/access',
  },
});

(async () => {
  const wasm = await WebAssembly.compile(
    await readFile(join(__dirname, 'demo.wasm')),
  );
  const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());

  wasi.start(instance);
})();
```
:::

要运行上面的示例，创建一个名为 `demo.wat` 的新的 WebAssembly 文本格式文件：

```text [TEXT]
(module
    ;; 导入所需的 fd_write WASI 函数，该函数将给定的 io 向量写入 stdout
    ;; fd_write 的函数签名是：
    ;; (文件描述符, *iovs, iovs_len, nwritten) -> 返回写入的字节数
    (import "wasi_snapshot_preview1" "fd_write" (func $fd_write (param i32 i32 i32 i32) (result i32)))

    (memory 1)
    (export "memory" (memory 0))

    ;; 将 'hello world\n' 写入内存，偏移量为 8 字节
    ;; 注意结尾的换行符，这是文本显示所必需的
    (data (i32.const 8) "hello world\n")

    (func $main (export "_start")
        ;; 在线性内存中创建一个新的 io 向量
        (i32.store (i32.const 0) (i32.const 8))  ;; iov.iov_base - 这是指向 'hello world\n' 字符串开头的指针
        (i32.store (i32.const 4) (i32.const 12))  ;; iov.iov_len - 'hello world\n' 字符串的长度

        (call $fd_write
            (i32.const 1) ;; file_descriptor - 1 代表 stdout
            (i32.const 0) ;; *iovs - 指向 iov 数组的指针，该数组存储在内存位置 0
            (i32.const 1) ;; iovs_len - 我们要打印存储在 iov 中的 1 个字符串 - 所以是 1。
            (i32.const 20) ;; nwritten - 内存中存储写入字节数的位置
        )
        drop ;; 从堆栈顶部丢弃写入的字节数
    )
)
```
使用 [wabt](https://github.com/WebAssembly/wabt) 将 `.wat` 编译为 `.wasm`

```bash [BASH]
wat2wasm demo.wat
```

## 安全性 {#security}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v21.2.0, v20.11.0 | 澄清了 WASI 的安全属性。 |
| v21.2.0, v20.11.0 | 添加于: v21.2.0, v20.11.0 |
:::

WASI 提供了一种基于 capability 的模型，通过该模型，应用程序可以获得其自定义的 `env`、`preopens`、`stdin`、`stdout`、`stderr` 和 `exit` capability。

**当前的 Node.js 威胁模型不提供像某些 WASI 运行时中存在的安全沙箱。**

虽然支持 capability 功能，但它们在 Node.js 中并不构成安全模型。例如，文件系统沙箱可以使用各种技术逃逸。该项目正在探索是否可以在未来添加这些安全保证。

## 类: `WASI` {#class-wasi}

**添加于: v13.3.0, v12.16.0**

`WASI` 类提供了 WASI 系统调用 API 以及用于处理基于 WASI 的应用程序的附加便捷方法。每个 `WASI` 实例代表一个不同的环境。

### `new WASI([options])` {#new-wasioptions}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v20.1.0 | returnOnExit 的默认值已更改为 true。 |
| v20.0.0 | version 选项现在是必需的，并且没有默认值。 |
| v19.8.0 | 向 options 添加了 version 字段。 |
| v13.3.0, v12.16.0 | 添加于: v13.3.0, v12.16.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `args` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) WebAssembly 应用程序将看到的一系列字符串作为命令行参数。第一个参数是 WASI 命令本身的虚拟路径。 **默认值:** `[]`。
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 一个类似于 `process.env` 的对象，WebAssembly 应用程序将看到它作为其环境。 **默认值:** `{}`。
    - `preopens` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 此对象表示 WebAssembly 应用程序的本地目录结构。 `preopens` 的字符串键被视为文件系统中的目录。 `preopens` 中相应的值是主机上这些目录的真实路径。
    - `returnOnExit` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 默认情况下，当 WASI 应用程序调用 `__wasi_proc_exit()` 时，`wasi.start()` 将返回指定的退出代码，而不是终止该进程。 将此选项设置为 `false` 将导致 Node.js 进程以指定的退出代码退出。 **默认值:** `true`。
    - `stdin` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在 WebAssembly 应用程序中用作标准输入的文件描述符。 **默认值:** `0`。
    - `stdout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在 WebAssembly 应用程序中用作标准输出的文件描述符。 **默认值:** `1`。
    - `stderr` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 在 WebAssembly 应用程序中用作标准错误的文件描述符。 **默认值:** `2`。
    - `version` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 请求的 WASI 版本。 目前，唯一支持的版本是 `unstable` 和 `preview1`。 此选项是必需的。


### `wasi.getImportObject()` {#wasigetimportobject}

**新增于: v19.8.0**

返回一个导入对象，如果除了 WASI 提供的导入之外不需要其他 WASM 导入，则可以将其传递给 `WebAssembly.instantiate()`。

如果将版本 `unstable` 传递给构造函数，它将返回：

```json [JSON]
{ wasi_unstable: wasi.wasiImport }
```
如果将版本 `preview1` 传递给构造函数，或者未指定版本，它将返回：

```json [JSON]
{ wasi_snapshot_preview1: wasi.wasiImport }
```
### `wasi.start(instance)` {#wasistartinstance}

**新增于: v13.3.0, v12.16.0**

- `instance` [\<WebAssembly.Instance\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)

尝试通过调用其 `_start()` 导出，开始将 `instance` 作为 WASI 命令执行。 如果 `instance` 不包含 `_start()` 导出，或者如果 `instance` 包含 `_initialize()` 导出，则会抛出异常。

`start()` 要求 `instance` 导出一个名为 `memory` 的 [`WebAssembly.Memory`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory)。 如果 `instance` 没有 `memory` 导出，则会抛出异常。

如果多次调用 `start()`，则会抛出异常。

### `wasi.initialize(instance)` {#wasiinitializeinstance}

**新增于: v14.6.0, v12.19.0**

- `instance` [\<WebAssembly.Instance\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)

如果 `instance` 包含 `_initialize()` 导出，尝试通过调用它来将 `instance` 初始化为 WASI reactor。 如果 `instance` 包含 `_start()` 导出，则会抛出异常。

`initialize()` 要求 `instance` 导出一个名为 `memory` 的 [`WebAssembly.Memory`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory)。 如果 `instance` 没有 `memory` 导出，则会抛出异常。

如果多次调用 `initialize()`，则会抛出异常。

### `wasi.wasiImport` {#wasiwasiimport}

**新增于: v13.3.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)

`wasiImport` 是一个实现了 WASI 系统调用 API 的对象。 在实例化 [`WebAssembly.Instance`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance) 期间，应将此对象作为 `wasi_snapshot_preview1` 导入传递。

