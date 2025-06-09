---
title: Node.js의 process.nextTick() 이해
description: Node.js의 process.nextTick()의 동작과 setImmediate() 및 setTimeout()과의 차이를 학습합니다. 이벤트 루프와 nextTick()를 사용하여 코드를 비동기적으로 실행하는 방법을 이해합니다.
head:
  - - meta
    - name: og:title
      content: Node.js의 process.nextTick() 이해 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 process.nextTick()의 동작과 setImmediate() 및 setTimeout()과의 차이를 학습합니다. 이벤트 루프와 nextTick()를 사용하여 코드를 비동기적으로 실행하는 방법을 이해합니다.
  - - meta
    - name: twitter:title
      content: Node.js의 process.nextTick() 이해 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 process.nextTick()의 동작과 setImmediate() 및 setTimeout()과의 차이를 학습합니다. 이벤트 루프와 nextTick()를 사용하여 코드를 비동기적으로 실행하는 방법을 이해합니다.
---


# `process.nextTick()` 이해하기

Node.js 이벤트 루프를 이해하려고 할 때 중요한 부분 중 하나는 `process.nextTick()`입니다. 이벤트 루프가 완전히 한 바퀴 도는 것을 틱이라고 부릅니다.

함수를 process.nextTick()에 전달하면 엔진에게 현재 작업이 끝날 때, 다음 이벤트 루프 틱이 시작되기 전에 이 함수를 호출하도록 지시합니다.

```js
process.nextTick(() => {
  // do something
})
```

이벤트 루프는 현재 함수 코드를 처리하느라 바쁩니다. 이 작업이 끝나면 JS 엔진은 해당 작업 중에 `nextTick` 호출에 전달된 모든 함수를 실행합니다.

JS 엔진에게 함수를 비동기적으로 (현재 함수 이후에) 처리하되, 가능한 한 빨리 큐에 넣지 않도록 지시하는 방법입니다.

`setTimeout(() => {}, 0)`을 호출하면 다음 틱이 끝날 때 함수가 실행됩니다. 이는 `nextTick()`을 사용하여 호출을 우선 순위화하고 다음 틱이 시작되기 직전에 실행하는 것보다 훨씬 늦습니다.

다음 이벤트 루프 반복에서 코드가 이미 실행되었는지 확인하고 싶을 때 `nextTick()`을 사용하십시오.

## 이벤트 순서 예시:

```js
console.log('Hello => number 1')
setImmediate(() => {
  console.log('Running before the timeout => number 3')
})
setTimeout(() => {
  console.log('The timeout running last => number 4')
}, 0)
process.nextTick(() => {
  console.log('Running at next tick => number 2')
})
```

## 예시 출력:

```bash
Hello => number 1
Running at next tick => number 2
Running before the timeout => number 3
The timeout running last => number 4
```

정확한 출력은 실행할 때마다 다를 수 있습니다.

