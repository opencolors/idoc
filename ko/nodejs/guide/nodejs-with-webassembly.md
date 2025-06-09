---
title: Node.js with WebAssembly
description: WebAssembly 는 C/C++, Rust, AssemblyScript 등 다양한 언어로 컴파일 할 수 있는 고성능 어셈블리어이다. Node.js 는 WebAssembly 객체를 통해 WebAssembly 와 통신하기 위해 필요한 API 를 제공한다.
head:
  - - meta
    - name: og:title
      content: Node.js with WebAssembly | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: WebAssembly 는 C/C++, Rust, AssemblyScript 등 다양한 언어로 컴파일 할 수 있는 고성능 어셈블리어이다. Node.js 는 WebAssembly 객체를 통해 WebAssembly 와 통신하기 위해 필요한 API 를 제공한다.
  - - meta
    - name: twitter:title
      content: Node.js with WebAssembly | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: WebAssembly 는 C/C++, Rust, AssemblyScript 등 다양한 언어로 컴파일 할 수 있는 고성능 어셈블리어이다. Node.js 는 WebAssembly 객체를 통해 WebAssembly 와 통신하기 위해 필요한 API 를 제공한다.
---


# WebAssembly를 사용한 Node.js

[WebAssembly](https://webassembly.org/)는 C/C++, Rust, AssemblyScript 등 다양한 언어에서 컴파일할 수 있는 고성능 어셈블리 유사 언어입니다. 현재 Chrome, Firefox, Safari, Edge 및 Node.js에서 지원됩니다!

WebAssembly 사양은 `.wasm` 확장자를 가진 WebAssembly 모듈이라는 바이너리 형식과 `.wat` 확장자를 가진 WebAssembly 텍스트 형식이라는 해당 텍스트 표현의 두 가지 파일 형식을 자세히 설명합니다.

## 주요 개념

- 모듈 - 컴파일된 WebAssembly 바이너리, 즉 `.wasm` 파일입니다.
- 메모리 - 크기 조정이 가능한 ArrayBuffer입니다.
- 테이블 - 메모리에 저장되지 않은 크기 조정이 가능한 참조 형식 배열입니다.
- 인스턴스 - 메모리, 테이블 및 변수를 포함하는 모듈의 인스턴스화입니다.

WebAssembly를 사용하려면 `.wasm` 바이너리 파일과 WebAssembly와 통신하기 위한 API 세트가 필요합니다. Node.js는 전역 `WebAssembly` 객체를 통해 필요한 API를 제공합니다.

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

## WebAssembly 모듈 생성

다음과 같은 WebAssembly 바이너리 파일을 생성하는 데 사용할 수 있는 여러 가지 방법이 있습니다.

- WebAssembly(`.wat`)를 직접 작성하고 [wabt](https://github.com/WebAssembly/wabt)와 같은 도구를 사용하여 바이너리 형식으로 변환합니다.
- C/C++ 응용 프로그램과 함께 [emscripten](https://github.com/emscripten-core/emscripten) 사용
- Rust 응용 프로그램과 함께 [wasm-pack](https://github.com/rustwasm/wasm-pack) 사용
- TypeScript와 같은 환경을 선호하는 경우 [AssemblyScript](https://github.com/AssemblyScript/assemblyscript) 사용

::: tip
**이러한 도구 중 일부는 바이너리 파일뿐만 아니라 브라우저에서 실행할 수 있는 JavaScript "글루" 코드 및 해당 HTML 파일도 생성합니다.**
:::

## 사용 방법

WebAssembly 모듈이 있으면 Node.js `WebAssembly` 객체를 사용하여 인스턴스화할 수 있습니다.

```javascript
const fs = require('node:fs')
const wasmBuffer = fs.readFileSync('/path/to/add.wasm')
WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  // 내보낸 함수는 instance.exports 아래에 있습니다.
  const { add } = wasmModule.instance.exports
  const sum = add(5, 6)
  console.log(sum) // 출력: 11
})
```


## OS와 상호 작용

WebAssembly 모듈은 자체적으로 OS 기능에 직접 액세스할 수 없습니다. 타사 도구인 [Wasmtime](https://github.com/bytecodealliance/wasmtime)을 사용하여 이 기능에 액세스할 수 있습니다. `Wasmtime`은 [WASI](https://github.com/WebAssembly/WASI) API를 사용하여 OS 기능에 액세스합니다.

## 참고 자료

- [일반 WebAssembly 정보](https://webassembly.org/)
- [MDN 문서](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [WebAssembly 직접 작성](https://webassembly.github.io/spec/core/text/index.html)

