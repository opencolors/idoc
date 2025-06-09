---
title: JavaScript 타이머 - setTimeout 및 setInterval
description: JavaScript 타이머를 사용하여 함수 실행을 지연시키고 setTimeout 및 setInterval로 작업을 예약하는 방법을 알아보십시오.
head:
  - - meta
    - name: og:title
      content: JavaScript 타이머 - setTimeout 및 setInterval | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: JavaScript 타이머를 사용하여 함수 실행을 지연시키고 setTimeout 및 setInterval로 작업을 예약하는 방법을 알아보십시오.
  - - meta
    - name: twitter:title
      content: JavaScript 타이머 - setTimeout 및 setInterval | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: JavaScript 타이머를 사용하여 함수 실행을 지연시키고 setTimeout 및 setInterval로 작업을 예약하는 방법을 알아보십시오.
---


# JavaScript 타이머 알아보기

### `setTimeout()`

JavaScript 코드를 작성할 때 함수의 실행을 지연시키고 싶을 수 있습니다.

이것이 바로 `setTimeout`의 역할입니다. 나중에 실행할 콜백 함수와 실행할 시간을 밀리초 단위로 지정합니다.

```js
setTimeout(() => {
  // 2초 후에 실행됩니다.
}, 2000);
setTimeout(() => {
  // 50밀리초 후에 실행됩니다.
}, 50);
```

이 구문은 새 함수를 정의합니다. 원하는 다른 함수를 호출하거나 기존 함수 이름과 매개 변수 집합을 전달할 수 있습니다.

```js
const myFunction = (firstParam, secondParam) => {
  // 무언가를 수행합니다.
};
// 2초 후에 실행됩니다.
setTimeout(myFunction, 2000, firstParam, secondParam);
```

`setTimeout`은 타이머 ID를 반환합니다. 일반적으로 사용되지는 않지만 이 ID를 저장하고 예약된 함수 실행을 삭제하려는 경우 지울 수 있습니다.

```js
const id = setTimeout(() => {
  // 2초 후에 실행되어야 합니다.
}, 2000);
// 마음이 바뀌었습니다.
clearTimeout(id);
```

## 지연 시간 0

시간 초과 지연 시간을 0으로 지정하면 콜백 함수는 가능한 한 빨리 실행되지만 현재 함수 실행 후에 실행됩니다.

```js
setTimeout(() => {
  console.log('after ');
}, 0);
console.log(' before ');
```

이 코드는 다음을 출력합니다.

```bash
before
after
```

이는 특히 집중적인 작업에서 CPU가 차단되는 것을 방지하고 스케줄러에서 함수를 대기열에 넣어 과도한 계산을 수행하는 동안 다른 함수가 실행되도록 하는 데 유용합니다.

::: tip
일부 브라우저(IE 및 Edge)는 이와 똑같은 기능을 수행하는 `setImmediate()` 메서드를 구현하지만 표준이 아니며 [다른 브라우저에서는 사용할 수 없습니다](https://caniuse.com/#feat=setimmediate). 하지만 Node.js에서는 표준 함수입니다.
:::

### `setInterval()`

`setInterval`은 `setTimeout`과 유사한 함수이지만 차이점이 있습니다. 콜백 함수를 한 번 실행하는 대신 지정한 특정 시간 간격(밀리초)으로 영원히 실행합니다.

```js
setInterval(() => {
  // 2초마다 실행됩니다.
}, 2000);
```

위의 함수는 `setInterval`이 반환한 간격 ID를 전달하여 `clearInterval`을 사용하여 중지하도록 지시하지 않는 한 2초마다 실행됩니다.

```js
const id = setInterval(() => {
  // 2초마다 실행됩니다.
}, 2000);
// 마음이 바뀌었습니다.
clearInterval(id);
```

`setInterval` 콜백 함수 내에서 `clearInterval`을 호출하여 다시 실행해야 하는지 또는 중지해야 하는지 자동 결정하도록 하는 것이 일반적입니다. 예를 들어 이 코드는 App.somethingIWait에 값이 도착할 때까지 무언가를 실행합니다.


## 재귀적 setTimeout

`setInterval`은 함수 실행 완료 여부에 관계없이 n 밀리초마다 함수를 시작합니다.

함수가 항상 동일한 시간이 걸린다면 괜찮습니다.

네트워크 환경에 따라 함수 실행 시간이 달라질 수도 있습니다.

그리고 하나의 긴 실행이 다음 실행과 겹칠 수도 있습니다.

이를 방지하기 위해 콜백 함수가 완료되면 호출되도록 재귀적 setTimeout을 예약할 수 있습니다.

```js
const myFunction = () => {
  // 뭔가 하기
  setTimeout(myFunction, 1000);
};
setTimeout(myFunction, 1000);
```

`setTimeout` 및 `setInterval`은 [타이머 모듈](/ko/nodejs/api/timers)을 통해 Node.js에서 사용할 수 있습니다.

Node.js는 또한 `setImmediate()`를 제공합니다. 이는 `setTimeout(() => {}, 0)`을 사용하는 것과 동일하며, 주로 Node.js 이벤트 루프와 함께 사용됩니다.

