---
title: Node.js mit WebAssembly
description: WebAssembly ist eine Hochleistungs-Assembler-Sprache, die aus verschiedenen Sprachen kompiliert werden kann, darunter C/C++, Rust und AssemblyScript. Node.js stellt die erforderlichen APIs über das globale WebAssembly-Objekt zur Verfügung, um mit WebAssembly zu kommunizieren.
head:
  - - meta
    - name: og:title
      content: Node.js mit WebAssembly | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: WebAssembly ist eine Hochleistungs-Assembler-Sprache, die aus verschiedenen Sprachen kompiliert werden kann, darunter C/C++, Rust und AssemblyScript. Node.js stellt die erforderlichen APIs über das globale WebAssembly-Objekt zur Verfügung, um mit WebAssembly zu kommunizieren.
  - - meta
    - name: twitter:title
      content: Node.js mit WebAssembly | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: WebAssembly ist eine Hochleistungs-Assembler-Sprache, die aus verschiedenen Sprachen kompiliert werden kann, darunter C/C++, Rust und AssemblyScript. Node.js stellt die erforderlichen APIs über das globale WebAssembly-Objekt zur Verfügung, um mit WebAssembly zu kommunizieren.
---


# Node.js mit WebAssembly

[WebAssembly](https://webassembly.org/) ist eine leistungsstarke, assemblerähnliche Sprache, die aus verschiedenen Sprachen kompiliert werden kann, darunter C/C++, Rust und AssemblyScript. Derzeit wird sie von Chrome, Firefox, Safari, Edge und Node.js unterstützt!

Die WebAssembly-Spezifikation beschreibt zwei Dateiformate, ein binäres Format namens WebAssembly-Modul mit der Erweiterung `.wasm` und eine entsprechende Textdarstellung namens WebAssembly-Textformat mit der Erweiterung `.wat`.

## Wichtige Konzepte

- Modul - Eine kompilierte WebAssembly-Binärdatei, d. h. eine `.wasm`-Datei.
- Speicher - Ein ArrayBuffer mit variabler Größe.
- Tabelle - Ein Typed Array mit variabler Größe von Referenzen, die nicht im Speicher gespeichert sind.
- Instanz - Eine Instanziierung eines Moduls mit seinem Speicher, seiner Tabelle und seinen Variablen.

Um WebAssembly zu verwenden, benötigen Sie eine `.wasm`-Binärdatei und eine Reihe von APIs zur Kommunikation mit WebAssembly. Node.js stellt die notwendigen APIs über das globale `WebAssembly`-Objekt bereit.

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

## Generieren von WebAssembly-Modulen

Es gibt verschiedene Methoden zum Generieren von WebAssembly-Binärdateien, darunter:

- Schreiben von WebAssembly (`.wat`) von Hand und Konvertieren in das Binärformat mithilfe von Tools wie [wabt](https://github.com/WebAssembly/wabt).
- Verwenden von [emscripten](https://github.com/emscripten-core/emscripten) mit einer C/C++-Anwendung
- Verwenden von [wasm-pack](https://github.com/rustwasm/wasm-pack) mit einer Rust-Anwendung
- Verwenden von [AssemblyScript](https://github.com/AssemblyScript/assemblyscript), wenn Sie eine TypeScript-ähnliche Erfahrung bevorzugen

::: tip
**Einige dieser Tools generieren nicht nur die Binärdatei, sondern auch den JavaScript-"Glue"-Code und die entsprechenden HTML-Dateien zur Ausführung im Browser.**
:::

## Wie man es benutzt

Sobald Sie ein WebAssembly-Modul haben, können Sie das Node.js `WebAssembly`-Objekt verwenden, um es zu instanziieren.

```javascript
const fs = require('node:fs')
const wasmBuffer = fs.readFileSync('/path/to/add.wasm')
WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  // Exportierte Funktionen befinden sich unter instance.exports
  const { add } = wasmModule.instance.exports
  const sum = add(5, 6)
  console.log(sum) // Gibt aus: 11
})
```


## Interaktion mit dem Betriebssystem

WebAssembly-Module können nicht direkt auf Betriebssystemfunktionen zugreifen. Ein Drittanbieter-Tool [Wasmtime](https://github.com/bytecodealliance/wasmtime) kann verwendet werden, um auf diese Funktionalität zuzugreifen. `Wasmtime` nutzt die [WASI](https://github.com/WebAssembly/WASI) API, um auf die Betriebssystemfunktionalität zuzugreifen.

## Ressourcen

- [Allgemeine WebAssembly-Informationen](https://webassembly.org/)
- [MDN-Dokumente](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [WebAssembly von Hand schreiben](https://webassembly.github.io/spec/core/text/index.html)

