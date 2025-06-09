---
title: Node.js with WebAssembly
description: WebAssembly は、高パフォーマンスのアセンブリ言語で、C/C++、Rust、AssemblyScript などのさまざまな言語からコンパイルできます。Node.js は、WebAssembly オブジェクトを介して WebAssembly と通信するために必要な API を提供します。
head:
  - - meta
    - name: og:title
      content: Node.js with WebAssembly | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: WebAssembly は、高パフォーマンスのアセンブリ言語で、C/C++、Rust、AssemblyScript などのさまざまな言語からコンパイルできます。Node.js は、WebAssembly オブジェクトを介して WebAssembly と通信するために必要な API を提供します。
  - - meta
    - name: twitter:title
      content: Node.js with WebAssembly | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: WebAssembly は、高パフォーマンスのアセンブリ言語で、C/C++、Rust、AssemblyScript などのさまざまな言語からコンパイルできます。Node.js は、WebAssembly オブジェクトを介して WebAssembly と通信するために必要な API を提供します。
---


# WebAssemblyを使ったNode.js

[WebAssembly](https://webassembly.org/) は、C/C++、Rust、AssemblyScriptなど、様々な言語からコンパイルできる高性能なアセンブリのような言語です。現在、Chrome、Firefox、Safari、Edge、そしてNode.jsでサポートされています!

WebAssemblyの仕様では、2つのファイル形式が詳細に定められています。`.wasm`という拡張子を持つWebAssemblyモジュールと呼ばれるバイナリ形式と、`.wat`という拡張子を持つWebAssemblyテキスト形式と呼ばれる対応するテキスト表現です。

## 主要な概念

- Module - コンパイルされたWebAssemblyバイナリ、つまり `.wasm` ファイル。
- Memory - サイズ変更可能なArrayBuffer。
- Table - Memoryに格納されていない参照のサイズ変更可能な型付き配列。
- Instance - Memory、Table、および変数を持つModuleのインスタンス化。

WebAssemblyを使用するには、`.wasm`バイナリファイルとWebAssemblyと通信するためのAPIのセットが必要です。Node.jsは、グローバルな`WebAssembly`オブジェクトを通じて必要なAPIを提供します。

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

## WebAssemblyモジュールの生成

WebAssemblyバイナリファイルを生成するには、次のようないくつかの方法があります。

- WebAssembly (`.wat`)を手書きし、[wabt](https://github.com/WebAssembly/wabt)などのツールを使用してバイナリ形式に変換する。
- C/C++アプリケーションで[emscripten](https://github.com/emscripten-core/emscripten)を使用する。
- Rustアプリケーションで[wasm-pack](https://github.com/rustwasm/wasm-pack)を使用する。
- TypeScriptのようなエクスペリエンスを好む場合は、[AssemblyScript](https://github.com/AssemblyScript/assemblyscript)を使用する。

::: tip
**これらのツールの中には、バイナリファイルだけでなく、ブラウザで実行するためのJavaScriptの「グルー」コードと対応するHTMLファイルも生成するものがあります。**
:::

## 使い方

WebAssemblyモジュールを入手したら、Node.jsの`WebAssembly`オブジェクトを使用してインスタンス化できます。

```javascript
const fs = require('node:fs')
const wasmBuffer = fs.readFileSync('/path/to/add.wasm')
WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  // エクスポートされた関数は instance.exports の下に存在します
  const { add } = wasmModule.instance.exports
  const sum = add(5, 6)
  console.log(sum) // 出力: 11
})
```


## OS とのやり取り

WebAssembly モジュールは、単独では OS の機能に直接アクセスできません。サードパーティ製のツールである [Wasmtime](https://github.com/bytecodealliance/wasmtime) を使用すると、この機能にアクセスできます。 `Wasmtime` は、OS の機能にアクセスするために [WASI](https://github.com/WebAssembly/WASI) API を利用します。

## 参考資料

- [WebAssembly の一般的な情報](https://webassembly.org/)
- [MDN ドキュメント](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [WebAssembly を手書きする](https://webassembly.github.io/spec/core/text/index.html)

