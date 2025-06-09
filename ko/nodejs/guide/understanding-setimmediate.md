---
title: Node.js 의 setImmediate() 이해
description: Node.js 의 setImmediate() 의 동작을 알아보고, setTimeout(), process.nextTick(), Promise.then() 과의 차이점, 이벤트 루프와 큐との 상호작용에 대해 학습합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 의 setImmediate() 이해 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 의 setImmediate() 의 동작을 알아보고, setTimeout(), process.nextTick(), Promise.then() 과의 차이점, 이벤트 루프와 큐との 상호작용에 대해 학습합니다.
  - - meta
    - name: twitter:title
      content: Node.js 의 setImmediate() 이해 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 의 setImmediate() 의 동작을 알아보고, setTimeout(), process.nextTick(), Promise.then() 과의 차이점, 이벤트 루프와 큐との 상호작용에 대해 학습합니다.
---


# `setImmediate()` 이해하기

비동기적으로 코드를 실행하되 최대한 빨리 실행하고 싶을 때 Node.js에서 제공하는 `setImmediate()` 함수를 사용하는 것이 한 가지 방법입니다.

```js
setImmediate(() => {
    // do something
})
```

`setImmediate()` 인수로 전달된 모든 함수는 이벤트 루프의 다음 반복에서 실행되는 콜백입니다.

`setImmediate()`는 `setTimeout(() => {}, 0)`(0ms 제한 시간을 전달)과 `process.nextTick()` 및 `Promise.then()`과 어떻게 다를까요?

`process.nextTick()`에 전달된 함수는 현재 작업이 끝난 후 이벤트 루프의 현재 반복에서 실행됩니다. 즉, 항상 `setTimeout` 및 `setImmediate`보다 먼저 실행됩니다.

0ms 지연이 있는 `setTimeout()` 콜백은 `setImmediate()`와 매우 유사합니다. 실행 순서는 여러 요인에 따라 달라지지만 둘 다 이벤트 루프의 다음 반복에서 실행됩니다.

`process.nextTick` 콜백은 **process.nextTick 큐**에 추가됩니다. `Promise.then()` 콜백은 프로미스 **마이크로태스크 큐**에 추가됩니다. `setTimeout`, `setImmediate` 콜백은 **매크로태스크 큐**에 추가됩니다.

이벤트 루프는 먼저 **process.nextTick 큐**의 태스크를 실행한 다음 **프로미스 마이크로태스크 큐**를 실행하고 마지막으로 `setTimeout` 또는 `setImmediate` **매크로태스크 큐**를 실행합니다.

다음은 `setImmediate()`, `process.nextTick()` 및 `Promise.then()` 간의 순서를 보여주는 예입니다.

```js
const baz = () => console.log('baz');
const foo = () => console.log('foo');
const zoo = () => console.log('zoo');
const start = () => {
  console.log('start');
  setImmediate(baz);
  new Promise((resolve, reject) => {
    resolve('bar');
  }).then(resolve => {
    console.log(resolve);
    process.nextTick(zoo);
  });
  process.nextTick(foo);
};
start();
// start foo bar zoo baz
```

이 코드는 먼저 `start()`를 호출한 다음 **process.nextTick 큐**에서 `foo()`를 호출합니다. 그런 다음 **프로미스 마이크로태스크 큐**를 처리하여 bar를 출력하고 동시에 **process.nextTick 큐**에 `zoo()`를 추가합니다. 그런 다음 방금 추가된 `zoo()`를 호출합니다. 마지막으로 **매크로태스크 큐**의 `baz()`가 호출됩니다.

위에서 언급한 원칙은 CommonJS의 경우에 해당하지만 ES 모듈(예: `mjs` 파일)에서는 실행 순서가 다를 수 있습니다.

```js
// start bar foo zoo baz
```

이는 로드되는 ES 모듈이 비동기 작업으로 래핑되기 때문에 전체 스크립트가 실제로 이미 `promises microtask queue`에 있기 때문입니다. 따라서 프로미스가 즉시 해결되면 해당 콜백이 `microtask queue`에 추가됩니다. Node.js는 다른 큐로 이동하기 전까지 큐를 지우려고 시도하므로 bar가 먼저 출력되는 것을 볼 수 있습니다.

