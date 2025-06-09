---
title: Node.js с WebAssembly
description: WebAssembly — высокопроизводительный язык ассемблера, который можно компилировать из различных языков, включая C/C++, Rust и AssemblyScript. Node.js предоставляет необходимые API через глобальный объект WebAssembly для взаимодействия с WebAssembly.
head:
  - - meta
    - name: og:title
      content: Node.js с WebAssembly | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: WebAssembly — высокопроизводительный язык ассемблера, который можно компилировать из различных языков, включая C/C++, Rust и AssemblyScript. Node.js предоставляет необходимые API через глобальный объект WebAssembly для взаимодействия с WebAssembly.
  - - meta
    - name: twitter:title
      content: Node.js с WebAssembly | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: WebAssembly — высокопроизводительный язык ассемблера, который можно компилировать из различных языков, включая C/C++, Rust и AssemblyScript. Node.js предоставляет необходимые API через глобальный объект WebAssembly для взаимодействия с WebAssembly.
---


# Node.js и WebAssembly

[WebAssembly](https://webassembly.org/) - это высокопроизводительный ассемблероподобный язык, который может быть скомпилирован из различных языков, включая C/C++, Rust и AssemblyScript. В настоящее время он поддерживается Chrome, Firefox, Safari, Edge и Node.js!

Спецификация WebAssembly детализирует два формата файлов: двоичный формат, называемый модулем WebAssembly с расширением `.wasm`, и соответствующее текстовое представление, называемое текстовым форматом WebAssembly с расширением `.wat`.

## Ключевые концепции

- Модуль - скомпилированный двоичный файл WebAssembly, т.е. файл `.wasm`.
- Память - ArrayBuffer с изменяемым размером.
- Таблица - типизированный массив ссылок с изменяемым размером, не хранящихся в Памяти.
- Экземпляр - экземпляр Модуля с его Памятью, Таблицей и переменными.

Чтобы использовать WebAssembly, вам нужен двоичный файл `.wasm` и набор API для взаимодействия с WebAssembly. Node.js предоставляет необходимые API через глобальный объект `WebAssembly`.

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

## Генерация модулей WebAssembly

Существует несколько методов для генерации двоичных файлов WebAssembly, включая:

- Написание WebAssembly (`.wat`) вручную и преобразование в двоичный формат с использованием таких инструментов, как [wabt](https://github.com/WebAssembly/wabt).
- Использование [emscripten](https://github.com/emscripten-core/emscripten) с приложением C/C++
- Использование [wasm-pack](https://github.com/rustwasm/wasm-pack) с приложением Rust
- Использование [AssemblyScript](https://github.com/AssemblyScript/assemblyscript), если вы предпочитаете опыт, подобный TypeScript

::: tip
**Некоторые из этих инструментов генерируют не только двоичный файл, но и JavaScript "glue" код и соответствующие HTML-файлы для запуска в браузере.**
:::

## Как это использовать

Как только у вас есть модуль WebAssembly, вы можете использовать объект `WebAssembly` Node.js для его создания экземпляра.

```javascript
const fs = require('node:fs')
const wasmBuffer = fs.readFileSync('/path/to/add.wasm')
WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  // Экспортированная функция находится в instance.exports
  const { add } = wasmModule.instance.exports
  const sum = add(5, 6)
  console.log(sum) // Выводит: 11
})
```


## Взаимодействие с ОС

Модули WebAssembly не могут напрямую получать доступ к функциям ОС самостоятельно. Для доступа к этим функциям можно использовать сторонний инструмент [Wasmtime](https://github.com/bytecodealliance/wasmtime). `Wasmtime` использует API [WASI](https://github.com/WebAssembly/WASI) для доступа к функциям ОС.

## Ресурсы

- [Общая информация о WebAssembly](https://webassembly.org/)
- [Документация MDN](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [Написание WebAssembly вручную](https://webassembly.github.io/spec/core/text/index.html)

