---
title: Node.js com WebAssembly
description: WebAssembly é uma linguagem de montagem de alto desempenho que pode ser compilada a partir de vários idiomas, incluindo C/C++, Rust e AssemblyScript. O Node.js fornece as APIs necessárias por meio do objeto WebAssembly global para se comunicar com WebAssembly.
head:
  - - meta
    - name: og:title
      content: Node.js com WebAssembly | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: WebAssembly é uma linguagem de montagem de alto desempenho que pode ser compilada a partir de vários idiomas, incluindo C/C++, Rust e AssemblyScript. O Node.js fornece as APIs necessárias por meio do objeto WebAssembly global para se comunicar com WebAssembly.
  - - meta
    - name: twitter:title
      content: Node.js com WebAssembly | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: WebAssembly é uma linguagem de montagem de alto desempenho que pode ser compilada a partir de vários idiomas, incluindo C/C++, Rust e AssemblyScript. O Node.js fornece as APIs necessárias por meio do objeto WebAssembly global para se comunicar com WebAssembly.
---


# Node.js com WebAssembly

[WebAssembly](https://webassembly.org/) é uma linguagem de baixo nível de desempenho semelhante a assembly que pode ser compilada a partir de várias linguagens, incluindo C/C++, Rust e AssemblyScript. Atualmente, é suportado por Chrome, Firefox, Safari, Edge e Node.js!

A especificação do WebAssembly detalha dois formatos de arquivo, um formato binário chamado Módulo WebAssembly com uma extensão `.wasm` e a representação de texto correspondente chamada formato de texto WebAssembly com uma extensão `.wat`.

## Conceitos-chave

- Module - Um binário WebAssembly compilado, ou seja, um arquivo `.wasm`.
- Memory - Um ArrayBuffer redimensionável.
- Table - Uma array tipada redimensionável de referências não armazenadas em Memory.
- Instance - Uma instanciação de um Módulo com sua Memory, Table e variáveis.

Para usar o WebAssembly, você precisa de um arquivo binário `.wasm` e um conjunto de APIs para se comunicar com o WebAssembly. O Node.js fornece as APIs necessárias através do objeto global `WebAssembly`.

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

## Gerando Módulos WebAssembly

Existem vários métodos disponíveis para gerar arquivos binários WebAssembly, incluindo:

- Escrever WebAssembly (`.wat`) manualmente e converter para formato binário usando ferramentas como [wabt](https://github.com/WebAssembly/wabt).
- Usar [emscripten](https://github.com/emscripten-core/emscripten) com uma aplicação C/C++
- Usar [wasm-pack](https://github.com/rustwasm/wasm-pack) com uma aplicação Rust
- Usar [AssemblyScript](https://github.com/AssemblyScript/assemblyscript) se você preferir uma experiência semelhante ao TypeScript

::: tip
**Algumas dessas ferramentas geram não apenas o arquivo binário, mas também o código JavaScript "glue" e os arquivos HTML correspondentes para serem executados no navegador.**
:::

## Como usar

Depois de ter um módulo WebAssembly, você pode usar o objeto `WebAssembly` do Node.js para instanciá-lo.

```javascript
const fs = require('node:fs')
const wasmBuffer = fs.readFileSync('/path/to/add.wasm')
WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  // Funções exportadas vivem sob instance.exports
  const { add } = wasmModule.instance.exports
  const sum = add(5, 6)
  console.log(sum) // Outputs: 11
})
```


## Interagindo com o SO

Módulos WebAssembly não podem acessar diretamente a funcionalidade do SO por conta própria. Uma ferramenta de terceiros [Wasmtime](https://github.com/bytecodealliance/wasmtime) pode ser usada para acessar essa funcionalidade. `Wasmtime` utiliza a API [WASI](https://github.com/WebAssembly/WASI) para acessar a funcionalidade do SO.

## Recursos

- [Informações Gerais sobre WebAssembly](https://webassembly.org/)
- [Documentos MDN](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [Escreva WebAssembly manualmente](https://webassembly.github.io/spec/core/text/index.html)

