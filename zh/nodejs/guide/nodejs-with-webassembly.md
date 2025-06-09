---
title: Node.js 与 WebAssembly
description: WebAssembly 是一种高性能的类汇编语言，可以从各种语言编译，包括 C/C++、Rust 和 AssemblyScript。Node.js 通过全局 WebAssembly 对象提供必要的 API 与 WebAssembly 通信。
head:
  - - meta
    - name: og:title
      content: Node.js 与 WebAssembly | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: WebAssembly 是一种高性能的类汇编语言，可以从各种语言编译，包括 C/C++、Rust 和 AssemblyScript。Node.js 通过全局 WebAssembly 对象提供必要的 API 与 WebAssembly 通信。
  - - meta
    - name: twitter:title
      content: Node.js 与 WebAssembly | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: WebAssembly 是一种高性能的类汇编语言，可以从各种语言编译，包括 C/C++、Rust 和 AssemblyScript。Node.js 通过全局 WebAssembly 对象提供必要的 API 与 WebAssembly 通信。
---


# Node.js 与 WebAssembly

[WebAssembly](https://webassembly.org/) 是一种高性能的、类似汇编的语言，可以从各种语言编译而来，包括 C/C++、Rust 和 AssemblyScript。目前，它已被 Chrome、Firefox、Safari、Edge 和 Node.js 所支持！

WebAssembly 规范详细说明了两种文件格式：一种是二进制格式，称为 WebAssembly 模块，带有 `.wasm` 扩展名；另一种是相应的文本表示形式，称为 WebAssembly 文本格式，带有 `.wat` 扩展名。

## 关键概念

- Module（模块）- 一个已编译的 WebAssembly 二进制文件，即一个 `.wasm` 文件。
- Memory（内存）- 一个可调整大小的 ArrayBuffer。
- Table（表）- 一个可调整大小的类型化引用数组，不存储在 Memory 中。
- Instance（实例）- 一个 Module 的实例化，包含其 Memory、Table 和变量。

为了使用 WebAssembly，你需要一个 `.wasm` 二进制文件和一组用于与 WebAssembly 通信的 API。Node.js 通过全局 `WebAssembly` 对象提供了必要的 API。

```javascript
console.log(WebAssembly)
/*
Object [WebAssembly] {
  compile: [Function: compile],
  validate: [Function: validate],
  instantiate: [Function: instantiate]
}
*/
```

## 生成 WebAssembly 模块

有多种方法可以生成 WebAssembly 二进制文件，包括：

- 手动编写 WebAssembly (`.wat`) 并使用 [wabt](https://github.com/WebAssembly/wabt) 等工具将其转换为二进制格式。
- 将 [emscripten](https://github.com/emscripten-core/emscripten) 与 C/C++ 应用程序一起使用
- 将 [wasm-pack](https://github.com/rustwasm/wasm-pack) 与 Rust 应用程序一起使用
- 如果你更喜欢类似 TypeScript 的体验，可以使用 [AssemblyScript](https://github.com/AssemblyScript/assemblyscript)

::: tip
**其中一些工具不仅生成二进制文件，还生成 JavaScript "胶水" 代码和相应的 HTML 文件，以便在浏览器中运行。**
:::

## 如何使用它

一旦你拥有了一个 WebAssembly 模块，你就可以使用 Node.js 的 `WebAssembly` 对象来实例化它。

```javascript
const fs = require('node:fs')
const wasmBuffer = fs.readFileSync('/path/to/add.wasm')
WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  // 导出的函数存在于 instance.exports 下
  const { add } = wasmModule.instance.exports
  const sum = add(5, 6)
  console.log(sum) // 输出: 11
})
```

## 与操作系统交互

WebAssembly 模块本身无法直接访问操作系统功能。第三方工具 [Wasmtime](https://github.com/bytecodealliance/wasmtime) 可用于访问此功能。`Wasmtime` 利用 [WASI](https://github.com/WebAssembly/WASI) API 来访问操作系统功能。

## 资源

- [WebAssembly 通用信息](https://webassembly.org/)
- [MDN 文档](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [手动编写 WebAssembly](https://webassembly.github.io/spec/core/text/index.html)

