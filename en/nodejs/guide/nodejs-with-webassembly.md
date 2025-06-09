---
title: Node.js with WebAssembly
description: WebAssembly is a high-performance assembly-like language that can be compiled from various languages, including C/C++, Rust, and AssemblyScript. Node.js provides the necessary APIs via the global WebAssembly object to communicate with WebAssembly.
head:
  - - meta
    - name: og:title
      content: Node.js with WebAssembly | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: WebAssembly is a high-performance assembly-like language that can be compiled from various languages, including C/C++, Rust, and AssemblyScript. Node.js provides the necessary APIs via the global WebAssembly object to communicate with WebAssembly.
  - - meta
    - name: twitter:title
      content: Node.js with WebAssembly | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: WebAssembly is a high-performance assembly-like language that can be compiled from various languages, including C/C++, Rust, and AssemblyScript. Node.js provides the necessary APIs via the global WebAssembly object to communicate with WebAssembly.
---


# Node.js with WebAssembly

[WebAssembly](https://webassembly.org/) is a high-performance assembly-like language that can be compiled from various languages, including C/C++, Rust, and AssemblyScript. Currently, it is supported by Chrome, Firefox, Safari, Edge, and Node.js!

The WebAssembly specification details two file formats, a binary format called a WebAssembly Module with a `.wasm `extension and corresponding text representation called WebAssembly Text format with a `.wat` extension.

## Key Concepts

- Module - A compiled WebAssembly binary, ie a `.wasm` file.
- Memory - A resizable ArrayBuffer.
- Table - A resizable typed array of references not stored in Memory.
- Instance - An instantiation of a Module with its Memory, Table, and variables.

In order to use WebAssembly, you need a `.wasm `binary file and a set of APIs to communicate with WebAssembly. Node.js provides the necessary APIs via the global `WebAssembly` object.

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

## Generating WebAssembly Modules

There are multiple methods available to generate WebAssembly binary files including:

- Writing WebAssembly (`.wat`) by hand and converting to binary format using tools such as [wabt](https://github.com/WebAssembly/wabt).
- Using [emscripten](https://github.com/emscripten-core/emscripten) with a C/C++ application
- Using [wasm-pack](https://github.com/rustwasm/wasm-pack) with a Rust application
- Using [AssemblyScript](https://github.com/AssemblyScript/assemblyscript) if you prefer a TypeScript-like experience

::: tip
**Some of these tools generate not only the binary file, but the JavaScript "glue" code and corresponding HTML files to run in the browser.**
:::

## How to use it

Once you have a WebAssembly module, you can use the Node.js `WebAssembly` object to instantiate it.

```javascript
const fs = require('node:fs')
const wasmBuffer = fs.readFileSync('/path/to/add.wasm')
WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  // Exported function live under instance.exports
  const { add } = wasmModule.instance.exports
  const sum = add(5, 6)
  console.log(sum) // Outputs: 11
})
```

## Interacting with the OS

WebAssembly modules cannot directly access OS functionality on its own. A third-party tool [Wasmtime](https://github.com/bytecodealliance/wasmtime) can be used to access this functionality. `Wasmtime` utilizes the [WASI](https://github.com/WebAssembly/WASI) API to access the OS functionality.

## Resources

- [General WebAssembly Information](https://webassembly.org/)
- [MDN Docs](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [Write WebAssembly by hand](https://webassembly.github.io/spec/core/text/index.html)
