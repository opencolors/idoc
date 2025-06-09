---
title: Node.js con WebAssembly
description: WebAssembly es un lenguaje ensamblador de alto rendimiento que se puede compilar desde varios lenguajes, incluyendo C/C++, Rust y AssemblyScript. Node.js proporciona las API necesarias a través del objeto WebAssembly global para comunicarse con WebAssembly.
head:
  - - meta
    - name: og:title
      content: Node.js con WebAssembly | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: WebAssembly es un lenguaje ensamblador de alto rendimiento que se puede compilar desde varios lenguajes, incluyendo C/C++, Rust y AssemblyScript. Node.js proporciona las API necesarias a través del objeto WebAssembly global para comunicarse con WebAssembly.
  - - meta
    - name: twitter:title
      content: Node.js con WebAssembly | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: WebAssembly es un lenguaje ensamblador de alto rendimiento que se puede compilar desde varios lenguajes, incluyendo C/C++, Rust y AssemblyScript. Node.js proporciona las API necesarias a través del objeto WebAssembly global para comunicarse con WebAssembly.
---


# Node.js con WebAssembly

[WebAssembly](https://webassembly.org/) es un lenguaje de tipo ensamblador de alto rendimiento que se puede compilar desde varios lenguajes, incluidos C/C++, Rust y AssemblyScript. ¡Actualmente, es compatible con Chrome, Firefox, Safari, Edge y Node.js!

La especificación de WebAssembly detalla dos formatos de archivo, un formato binario llamado Módulo WebAssembly con una extensión `.wasm` y la representación de texto correspondiente llamada formato de texto WebAssembly con una extensión `.wat`.

## Conceptos clave

- Módulo: un binario WebAssembly compilado, es decir, un archivo `.wasm`.
- Memoria: un ArrayBuffer redimensionable.
- Tabla: una matriz tipada redimensionable de referencias no almacenadas en la memoria.
- Instancia: una instancia de un módulo con su memoria, tabla y variables.

Para usar WebAssembly, necesita un archivo binario `.wasm` y un conjunto de API para comunicarse con WebAssembly. Node.js proporciona las API necesarias a través del objeto global `WebAssembly`.

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

## Generando módulos WebAssembly

Existen varios métodos disponibles para generar archivos binarios WebAssembly, que incluyen:

- Escribir WebAssembly (`.wat`) a mano y convertirlo a formato binario utilizando herramientas como [wabt](https://github.com/WebAssembly/wabt).
- Usar [emscripten](https://github.com/emscripten-core/emscripten) con una aplicación C/C++
- Usar [wasm-pack](https://github.com/rustwasm/wasm-pack) con una aplicación Rust
- Usar [AssemblyScript](https://github.com/AssemblyScript/assemblyscript) si prefiere una experiencia similar a TypeScript

::: tip
**Algunas de estas herramientas generan no solo el archivo binario, sino también el código JavaScript "glue" y los archivos HTML correspondientes para ejecutarse en el navegador.**
:::

## Cómo usarlo

Una vez que tenga un módulo WebAssembly, puede usar el objeto `WebAssembly` de Node.js para instanciarlo.

```javascript
const fs = require('node:fs')
const wasmBuffer = fs.readFileSync('/path/to/add.wasm')
WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  // La función exportada vive en instance.exports
  const { add } = wasmModule.instance.exports
  const sum = add(5, 6)
  console.log(sum) // Imprime: 11
})
```


## Interacción con el SO

Los módulos de WebAssembly no pueden acceder directamente a la funcionalidad del SO por sí mismos. Se puede utilizar una herramienta de terceros, [Wasmtime](https://github.com/bytecodealliance/wasmtime), para acceder a esta funcionalidad. `Wasmtime` utiliza la API [WASI](https://github.com/WebAssembly/WASI) para acceder a la funcionalidad del SO.

## Recursos

- [Información general sobre WebAssembly](https://webassembly.org/)
- [Documentos MDN](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [Escribir WebAssembly a mano](https://webassembly.github.io/spec/core/text/index.html)

