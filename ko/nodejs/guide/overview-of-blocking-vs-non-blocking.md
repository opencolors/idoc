---
title: Node.js의 블로킹과 논블로킹
description: 이 문서에서는 Node.js의 블로킹과 논블로킹 호출의 차이를 설명하며, 이벤트 루프와 동시성에 대한 영향도 포함합니다.
head:
  - - meta
    - name: og:title
      content: Node.js의 블로킹과 논블로킹 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 이 문서에서는 Node.js의 블로킹과 논블로킹 호출의 차이를 설명하며, 이벤트 루프와 동시성에 대한 영향도 포함합니다.
  - - meta
    - name: twitter:title
      content: Node.js의 블로킹과 논블로킹 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 이 문서에서는 Node.js의 블로킹과 논블로킹 호출의 차이를 설명하며, 이벤트 루프와 동시성에 대한 영향도 포함합니다.
---


# 블로킹 vs 논블로킹 개요

이 개요는 Node.js에서 블로킹 호출과 논블로킹 호출의 차이점을 다룹니다. 이 개요에서는 이벤트 루프와 libuv를 언급하지만 해당 주제에 대한 사전 지식은 필요하지 않습니다. 독자는 JavaScript 언어와 Node.js [콜백 패턴](/ko/nodejs/guide/javascript-asynchronous-programming-and-callbacks)에 대한 기본적인 이해를 가지고 있다고 가정합니다.

::: info
"I/O"는 주로 [libuv](https://libuv.org/)에서 지원하는 시스템의 디스크 및 네트워크와의 상호 작용을 나타냅니다.
:::

## 블로킹

**블로킹**은 Node.js 프로세스에서 추가 JavaScript 실행이 비 JavaScript 작업이 완료될 때까지 기다려야 하는 경우입니다. 이는 **블로킹** 작업이 진행되는 동안 이벤트 루프가 JavaScript 실행을 계속할 수 없기 때문에 발생합니다.

Node.js에서 I/O와 같은 비 JavaScript 작업을 기다리는 것보다 CPU 집약적이어서 성능이 저하되는 JavaScript는 일반적으로 **블로킹**이라고 하지 않습니다. libuv를 사용하는 Node.js 표준 라이브러리의 동기 메서드는 가장 일반적으로 사용되는 **블로킹** 작업입니다. 네이티브 모듈에도 **블로킹** 메서드가 있을 수 있습니다.

Node.js 표준 라이브러리의 모든 I/O 메서드는 **논블로킹**이고 콜백 함수를 허용하는 비동기 버전을 제공합니다. 일부 메서드에는 `Sync`로 끝나는 이름을 가진 **블로킹** 대응 메서드도 있습니다.

## 코드 비교

**블로킹** 메서드는 **동기적**으로 실행되고 **논블로킹** 메서드는 **비동기적**으로 실행됩니다.

파일 시스템 모듈을 예로 들어, 다음은 **동기적** 파일 읽기입니다.

```js
const fs = require('node:fs')
const data = fs.readFileSync('/file.md') // 파일이 읽힐 때까지 여기서 블로킹
```

다음은 동일한 **비동기적** 예입니다.

```js
const fs = require('node:fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
})
```

첫 번째 예는 두 번째 예보다 간단해 보이지만 전체 파일을 읽을 때까지 두 번째 줄이 추가 JavaScript 실행을 **블로킹**한다는 단점이 있습니다. 동기 버전에서 오류가 발생하면 catch해야 프로세스가 충돌하지 않습니다. 비동기 버전에서는 표시된 대로 오류를 발생시킬지 여부를 작성자가 결정합니다.

예를 조금 더 확장해 보겠습니다.

```js
const fs = require('node:fs')
const data = fs.readFileSync('/file.md') // 파일이 읽힐 때까지 여기서 블로킹
console.log(data)
moreWork() // console.log 이후에 실행됩니다.
```

다음은 유사하지만 동일하지 않은 비동기 예입니다.

```js
const fs = require('node:fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
  console.log(data)
})
moreWork() // console.log 이전에 실행됩니다.
```

위의 첫 번째 예에서는 `console.log`가 `moreWork()` 이전에 호출됩니다. 두 번째 예에서는 `fs.readFile()`이 **논블로킹**이므로 JavaScript 실행이 계속될 수 있고 `moreWork()`가 먼저 호출됩니다. 파일 읽기가 완료될 때까지 기다리지 않고 `moreWork()`를 실행할 수 있는 기능은 더 높은 처리량을 가능하게 하는 핵심 설계 선택입니다.


## 동시성과 처리량

Node.js에서의 JavaScript 실행은 단일 스레드이므로, 동시성은 다른 작업을 완료한 후 JavaScript 콜백 함수를 실행하는 이벤트 루프의 능력을 의미합니다. 동시적으로 실행될 것으로 예상되는 코드는 I/O와 같은 비 JavaScript 작업이 발생하는 동안 이벤트 루프가 계속 실행되도록 허용해야 합니다.

예를 들어, 웹 서버에 대한 각 요청을 완료하는 데 50ms가 걸리고 해당 50ms 중 45ms가 비동기적으로 수행할 수 있는 데이터베이스 I/O인 경우를 고려해 보겠습니다. 논블로킹 비동기 작업을 선택하면 요청당 45ms를 확보하여 다른 요청을 처리할 수 있습니다. 이는 블로킹 메서드 대신 논블로킹 메서드를 사용하는 것만으로도 용량에 큰 차이가 있습니다.

이벤트 루프는 동시 작업을 처리하기 위해 추가 스레드를 생성할 수 있는 다른 많은 언어의 모델과는 다릅니다.

## 블로킹 코드와 논블로킹 코드 혼합의 위험성

I/O를 처리할 때 피해야 할 몇 가지 패턴이 있습니다. 예를 들어 보겠습니다.

```js
const fs = require('node:fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
  console.log(data)
})
fs.unlinkSync('/file.md')
```

위의 예에서 `fs.unlinkSync()`는 `fs.readFile()`보다 먼저 실행될 가능성이 높으며, 이는 실제로 읽기 전에 `file.md`를 삭제합니다. 이를 완전히 논블로킹 방식으로 작성하고 올바른 순서로 실행되도록 보장하는 더 나은 방법은 다음과 같습니다.

```js
const fs = require('node:fs')
fs.readFile('/file.md', (readFileErr, data) => {
  if (readFileErr) throw readFileErr
  console.log(data)
  fs.unlink('/file.md', unlinkErr => {
    if (unlinkErr) throw unlinkErr
  })
})
```

위의 코드는 `fs.readFile()`의 콜백 내에 `fs.unlink()`에 대한 **논블로킹** 호출을 배치하여 작업의 올바른 순서를 보장합니다.

