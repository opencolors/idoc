---
title: Node.js con WebAssembly
description: WebAssembly è un linguaggio assembly ad alte prestazioni che può essere compilato da vari linguaggi, tra cui C/C++, Rust e AssemblyScript. Node.js fornisce le API necessarie tramite l'oggetto WebAssembly globale per comunicare con WebAssembly.
head:
  - - meta
    - name: og:title
      content: Node.js con WebAssembly | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: WebAssembly è un linguaggio assembly ad alte prestazioni che può essere compilato da vari linguaggi, tra cui C/C++, Rust e AssemblyScript. Node.js fornisce le API necessarie tramite l'oggetto WebAssembly globale per comunicare con WebAssembly.
  - - meta
    - name: twitter:title
      content: Node.js con WebAssembly | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: WebAssembly è un linguaggio assembly ad alte prestazioni che può essere compilato da vari linguaggi, tra cui C/C++, Rust e AssemblyScript. Node.js fornisce le API necessarie tramite l'oggetto WebAssembly globale per comunicare con WebAssembly.
---


# Node.js con WebAssembly

[WebAssembly](https://webassembly.org/) è un linguaggio simile all'assembly ad alte prestazioni che può essere compilato da vari linguaggi, tra cui C/C++, Rust e AssemblyScript. Attualmente, è supportato da Chrome, Firefox, Safari, Edge e Node.js!

La specifica WebAssembly descrive in dettaglio due formati di file, un formato binario chiamato Modulo WebAssembly con estensione `.wasm` e la corrispondente rappresentazione testuale chiamata formato testo WebAssembly con estensione `.wat`.

## Concetti chiave

- Module - Un binario WebAssembly compilato, ad esempio un file `.wasm`.
- Memory - Un ArrayBuffer ridimensionabile.
- Table - Un array tipizzato ridimensionabile di riferimenti non memorizzati in Memory.
- Instance - Un'istanza di un Modulo con la sua Memory, Table e variabili.

Per utilizzare WebAssembly, è necessario un file binario `.wasm` e un set di API per comunicare con WebAssembly. Node.js fornisce le API necessarie tramite l'oggetto globale `WebAssembly`.

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

## Generazione di moduli WebAssembly

Sono disponibili diversi metodi per generare file binari WebAssembly, tra cui:

- Scrivere WebAssembly (`.wat`) a mano e convertire in formato binario utilizzando strumenti come [wabt](https://github.com/WebAssembly/wabt).
- Utilizzo di [emscripten](https://github.com/emscripten-core/emscripten) con un'applicazione C/C++
- Utilizzo di [wasm-pack](https://github.com/rustwasm/wasm-pack) con un'applicazione Rust
- Utilizzo di [AssemblyScript](https://github.com/AssemblyScript/assemblyscript) se preferisci un'esperienza simile a TypeScript

::: tip
**Alcuni di questi strumenti generano non solo il file binario, ma anche il codice "glue" JavaScript e i corrispondenti file HTML per l'esecuzione nel browser.**
:::

## Come usarlo

Una volta che hai un modulo WebAssembly, puoi utilizzare l'oggetto `WebAssembly` di Node.js per istanziarlo.

```javascript
const fs = require('node:fs')
const wasmBuffer = fs.readFileSync('/path/to/add.wasm')
WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  // La funzione esportata risiede in instance.exports
  const { add } = wasmModule.instance.exports
  const sum = add(5, 6)
  console.log(sum) // Output: 11
})
```


## Interazione con il Sistema Operativo

I moduli WebAssembly non possono accedere direttamente alle funzionalità del sistema operativo da soli. Uno strumento di terze parti, [Wasmtime](https://github.com/bytecodealliance/wasmtime), può essere utilizzato per accedere a questa funzionalità. `Wasmtime` utilizza l'API [WASI](https://github.com/WebAssembly/WASI) per accedere alle funzionalità del sistema operativo.

## Risorse

- [Informazioni generali su WebAssembly](https://webassembly.org/)
- [Documenti MDN](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [Scrivere WebAssembly a mano](https://webassembly.github.io/spec/core/text/index.html)

