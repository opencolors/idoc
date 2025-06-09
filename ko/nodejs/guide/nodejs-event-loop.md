---
title: Node.js 이벤트 루프 이해
description: 이벤트 루프는 Node.js의 핵심으로 비동기 I/O 연산을 수행할 수 있도록 합니다. 싱글 스레드 루프로, 시스템 커널에 연산을卸载 할 수 있습니다.
head:
  - - meta
    - name: og:title
      content: Node.js 이벤트 루프 이해 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 이벤트 루프는 Node.js의 핵심으로 비동기 I/O 연산을 수행할 수 있도록 합니다. 싱글 스레드 루프로, 시스템 커널에 연산을卸载 할 수 있습니다.
  - - meta
    - name: twitter:title
      content: Node.js 이벤트 루프 이해 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 이벤트 루프는 Node.js의 핵심으로 비동기 I/O 연산을 수행할 수 있도록 합니다. 싱글 스레드 루프로, 시스템 커널에 연산을卸载 할 수 있습니다.
---


# Node.js 이벤트 루프

## 이벤트 루프란 무엇인가?

이벤트 루프는 Node.js가 가능한 경우 시스템 커널에 작업을 오프로드하여 단일 JavaScript 스레드가 기본적으로 사용됨에도 불구하고 논블로킹 I/O 작업을 수행할 수 있도록 하는 것입니다.

대부분의 최신 커널은 다중 스레드이므로 백그라운드에서 실행되는 여러 작업을 처리할 수 있습니다. 이러한 작업 중 하나가 완료되면 커널은 Node.js에 이를 알려 적절한 콜백이 결국 실행될 수 있도록 폴 큐에 추가될 수 있습니다. 이 내용은 이 주제 뒷부분에서 더 자세히 설명합니다.

## 이벤트 루프 설명

Node.js가 시작되면 이벤트 루프를 초기화하고 제공된 입력 스크립트를 처리하거나 (이 문서에서는 다루지 않는) REPL로 드롭하여 비동기 API 호출을 하고, 타이머를 예약하거나, process.nextTick()을 호출한 다음 이벤트 루프 처리를 시작합니다.

다음 다이어그램은 이벤트 루프의 작업 순서에 대한 단순화된 개요를 보여줍니다.

```bash
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

::: tip
각 상자를 이벤트 루프의 "단계"라고 합니다.
:::

각 단계에는 실행할 콜백의 FIFO 큐가 있습니다. 각 단계는 고유한 방식으로 특별하지만 일반적으로 이벤트 루프가 주어진 단계에 들어가면 해당 단계에 특정한 작업을 수행한 다음 큐가 소진되거나 최대 콜백 수가 실행될 때까지 해당 단계의 큐에서 콜백을 실행합니다. 큐가 소진되거나 콜백 제한에 도달하면 이벤트 루프는 다음 단계로 이동합니다.

이러한 작업 중 일부는 더 많은 작업을 예약할 수 있고 **poll** 단계에서 처리되는 새 이벤트는 커널에 의해 큐에 추가되므로 폴 이벤트가 처리되는 동안 폴 이벤트를 큐에 넣을 수 있습니다. 결과적으로 오래 실행되는 콜백은 폴 단계가 타이머 임계값보다 훨씬 오래 실행되도록 할 수 있습니다. 자세한 내용은 타이머 및 폴 섹션을 참조하십시오.

::: tip
Windows와 Unix/Linux 구현 간에 약간의 차이가 있지만 이 데모에서는 중요하지 않습니다. 가장 중요한 부분은 여기에 있습니다. 실제로는 7~8단계가 있지만 Node.js에서 실제로 사용하는 단계는 위에 있는 단계입니다.
:::


## Phases Overview
- **timers**: 이 단계에서는 `setTimeout()` 및 `setInterval()`에 의해 예약된 콜백을 실행합니다.
- **pending callbacks**: 다음 루프 반복으로 연기된 I/O 콜백을 실행합니다.
- **idle, prepare**: 내부적으로만 사용됩니다.
- **poll**: 새로운 I/O 이벤트를 검색하고, I/O 관련 콜백을 실행합니다 (거의 모든 콜백, 종료 콜백, 타이머에 의해 예약된 콜백 및 `setImmediate()`는 제외). 노드는 적절한 경우 여기서 차단됩니다.
- **check**: `setImmediate()` 콜백이 여기서 호출됩니다.
- **close callbacks**: 일부 종료 콜백 (예: `socket.on('close', ...)`).

이벤트 루프의 각 실행 사이에 Node.js는 비동기 I/O 또는 타이머를 기다리고 있는지 확인하고, 없는 경우 깔끔하게 종료합니다.

## Phases in Detail

### timers

타이머는 제공된 콜백이 실행될 수 있는 **정확한** 시간이 아닌 **임계값**을 지정합니다. 타이머 콜백은 지정된 시간이 경과한 후 가능한 한 빨리 예약되어 실행됩니다. 그러나 운영 체제 스케줄링 또는 다른 콜백 실행으로 인해 지연될 수 있습니다.

::: tip
기술적으로는 [poll](/ko/nodejs/guide/nodejs-event-loop#poll) 단계가 타이머 실행 시점을 제어합니다.
:::

예를 들어 100ms 임계값 후에 실행되도록 시간 초과를 예약한 다음 스크립트가 95ms가 걸리는 파일을 비동기적으로 읽기 시작한다고 가정해 보겠습니다.

```js
const fs = require('node:fs');
function someAsyncOperation(callback) {
  // 완료하는 데 95ms가 걸린다고 가정합니다.
  fs.readFile('/path/to/file', callback);
}
const timeoutScheduled = Date.now();
setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;
  console.log(`${delay}ms have passed since I was scheduled`);
}, 100);
// 완료하는 데 95ms가 걸리는 someAsyncOperation을 수행합니다.
someAsyncOperation(() => {
  const startCallback = Date.now();
  // 10ms가 걸리는 작업을 수행합니다...
  while (Date.now() - startCallback < 10) {
    // 아무 것도 하지 않습니다.
  }
});
```

이벤트 루프가 **poll** 단계에 들어가면 빈 큐가 있습니다 (`fs.readFile()`이 완료되지 않음). 따라서 가장 빠른 타이머의 임계값에 도달할 때까지 남은 ms 수를 기다립니다. 95ms가 지나는 동안 `fs.readFile()`은 파일 읽기를 완료하고 완료하는 데 10ms가 걸리는 콜백이 poll 큐에 추가되어 실행됩니다. 콜백이 완료되면 큐에 더 이상 콜백이 없으므로 이벤트 루프는 가장 빠른 타이머의 임계값에 도달했음을 확인한 다음 타이머 단계를 다시 래핑하여 타이머의 콜백을 실행합니다. 이 예에서는 타이머가 예약된 시점과 콜백이 실행되는 시점 사이의 총 지연 시간이 105ms임을 알 수 있습니다.

::: tip
poll 단계가 이벤트 루프를 굶기지 않도록 하기 위해 [libuv](https://libuv.org/) (Node.js 이벤트 루프와 플랫폼의 모든 비동기 동작을 구현하는 C 라이브러리)에는 더 많은 이벤트를 폴링하기 전에 하드 최대값 (시스템에 따라 다름)도 있습니다.
:::


## 보류 중인 콜백
이 단계에서는 TCP 오류 유형과 같은 일부 시스템 작업에 대한 콜백을 실행합니다. 예를 들어 TCP 소켓이 연결을 시도할 때 `ECONNREFUSED`를 수신하면 일부 *nix 시스템은 오류 보고를 기다립니다. 이는 **보류 중인 콜백** 단계에서 실행되도록 대기열에 추가됩니다.

### 폴

**폴** 단계에는 두 가지 주요 기능이 있습니다.

1. I/O를 차단하고 폴링해야 하는 기간을 계산한 다음,
2. **폴** 대기열에서 이벤트를 처리합니다.

이벤트 루프가 **폴** 단계에 들어가고 예약된 타이머가 없으면 다음 두 가지 중 하나가 발생합니다.

- ***폴*** 대기열이 ***비어 있지 않은 경우*** 이벤트 루프는 대기열이 소진되거나 시스템 종속 하드 제한에 도달할 때까지 콜백 대기열을 반복하여 동기적으로 실행합니다.

- ***폴*** 대기열이 ***비어 있는 경우*** 다음 두 가지 중 하나가 더 발생합니다.

    - `setImmediate()`로 스크립트가 예약된 경우 이벤트 루프는 **폴** 단계를 종료하고 예약된 스크립트를 실행하기 위해 확인 단계로 계속 진행합니다.

    - `setImmediate()`로 스크립트가 **예약되지 않은 경우** 이벤트 루프는 콜백이 대기열에 추가될 때까지 기다린 다음 즉시 실행합니다.

**폴** 대기열이 비워지면 이벤트 루프는 *시간 임계값*에 도달한 타이머가 있는지 확인합니다. 하나 이상의 타이머가 준비되면 이벤트 루프는 해당 타이머의 콜백을 실행하기 위해 **타이머** 단계로 다시 래핑됩니다.

### 확인

이 단계에서는 **폴** 단계가 완료된 직후에 콜백을 실행할 수 있습니다. **폴** 단계가 유휴 상태가 되고 `setImmediate()`로 스크립트가 대기열에 추가된 경우 이벤트 루프는 기다리지 않고 확인 단계로 계속 진행될 수 있습니다.

`setImmediate()`는 실제로 이벤트 루프의 별도 단계에서 실행되는 특수 타이머입니다. **폴** 단계가 완료된 후 콜백을 실행하도록 예약하는 libuv API를 사용합니다.

일반적으로 코드가 실행되면 이벤트 루프는 결국 **폴** 단계에 도달하여 들어오는 연결, 요청 등을 기다립니다. 그러나 `setImmediate()`로 콜백이 예약되고 **폴** 단계가 유휴 상태가 되면 **폴** 이벤트를 기다리는 대신 종료되고 **확인** 단계로 계속 진행됩니다.


### close 콜백

소켓 또는 핸들이 갑자기 닫히면 (예: `socket.destroy()`), 이 단계에서 `'close'` 이벤트가 발생합니다. 그렇지 않으면 `process.nextTick()`을 통해 발생합니다.

## `setImmediate()` vs `setTimeout()`

`setImmediate()`와 `setTimeout()`은 유사하지만 호출되는 시점에 따라 다르게 작동합니다.

- `setImmediate()`는 현재 **폴** 단계가 완료되면 스크립트를 실행하도록 설계되었습니다.
- `setTimeout()`은 최소 임계값(ms)이 경과한 후 스크립트를 실행하도록 예약합니다.

타이머가 실행되는 순서는 호출되는 컨텍스트에 따라 다릅니다. 둘 다 메인 모듈 내에서 호출되면 타이밍은 프로세스 성능에 의해 제한됩니다 (이는 시스템에서 실행되는 다른 애플리케이션에 의해 영향을 받을 수 있음).

예를 들어, I/O 사이클 내에 있지 않은 (즉, 메인 모듈) 다음 스크립트를 실행하면 두 타이머가 실행되는 순서는 비결정적이며 프로세스 성능에 의해 제한됩니다.

::: code-group

```js [JS]
// timeout_vs_immediate.js
setTimeout(() => {
  console.log('timeout');
}, 0);
setImmediate(() => {
  console.log('immediate');
});
```

```bash [BASH]
$ node timeout_vs_immediate.js
timeout
immediate
$ node timeout_vs_immediate.js
immediate
timeout
```

:::

그러나 두 호출을 I/O 사이클 내로 이동하면 즉시 콜백이 항상 먼저 실행됩니다.

::: code-group

```js [JS]
// timeout_vs_immediate.js
const fs = require('node:fs');
fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});
```

```bash [BASH]
$ node timeout_vs_immediate.js
immediate
timeout
$ node timeout_vs_immediate.js
immediate
timeout
```

:::

`setTimeout()`에 비해 `setImmediate()`를 사용하는 주요 이점은 I/O 사이클 내에서 예약된 경우 타이머가 얼마나 많이 존재하는지에 관계없이 `setImmediate()`가 항상 모든 타이머보다 먼저 실행된다는 것입니다.


## `process.nextTick()`

### `process.nextTick()` 이해하기

`process.nextTick()`은 비동기 API의 일부임에도 불구하고 다이어그램에 표시되지 않았을 수 있습니다. 이는 `process.nextTick()`이 기술적으로 이벤트 루프의 일부가 아니기 때문입니다. 대신, `nextTickQueue`는 이벤트 루프의 현재 단계에 관계없이 현재 작업이 완료된 후 처리됩니다. 여기서 작업은 기본 C/C++ 핸들러에서 전환하고 실행해야 하는 JavaScript를 처리하는 것으로 정의됩니다.

다이어그램을 다시 살펴보면 특정 단계에서 `process.nextTick()`을 호출할 때마다 `process.nextTick()`에 전달된 모든 콜백은 이벤트 루프가 계속되기 전에 해결됩니다. 이는 재귀적 `process.nextTick()` 호출을 통해 I/O를 "굶주리게"하여 이벤트 루프가 **폴** 단계에 도달하지 못하게 하므로 몇 가지 나쁜 상황을 만들 수 있습니다.

### 왜 허용되는가?

왜 이런 것이 Node.js에 포함되었을까요? 부분적으로는 API가 필요하지 않더라도 항상 비동기적이어야 한다는 설계 철학 때문입니다. 다음 코드 조각을 예로 들어 보겠습니다.

```js
function apiCall(arg, callback) {
  if (typeof arg !== 'string')
    return process.nextTick(
      callback,
      new TypeError('argument should be string')
    );
}
```

이 코드 조각은 인수 검사를 수행하고 올바르지 않으면 오류를 콜백에 전달합니다. API는 비교적 최근에 `process.nextTick()`에 인수를 전달할 수 있도록 업데이트되어 콜백 뒤에 전달된 모든 인수가 콜백에 대한 인수로 전파되도록 하여 함수를 중첩할 필요가 없도록 했습니다.

여기서 하는 일은 사용자의 나머지 코드가 실행되도록 허용한 후에만 사용자에게 오류를 다시 전달하는 것입니다. `process.nextTick()`을 사용하면 `apiCall()`이 항상 사용자의 나머지 코드가 실행된 후, 이벤트 루프가 진행되기 전에 콜백을 실행하도록 보장합니다. 이를 위해 JS 호출 스택이 해제된 다음 제공된 콜백을 즉시 실행하여 사람이 `v8`에서 `RangeError: Maximum call stack size exceeded`에 도달하지 않고 `process.nextTick()`에 대한 재귀 호출을 할 수 있도록 합니다.

이러한 철학은 잠재적으로 문제가 될 수 있는 상황으로 이어질 수 있습니다. 다음 코드 조각을 예로 들어 보겠습니다.

```js
let bar;
// 비동기 시그니처를 갖지만 콜백을 동기적으로 호출합니다.
function someAsyncApiCall(callback) {
  callback();
}
// 콜백은 `someAsyncApiCall`이 완료되기 전에 호출됩니다.
someAsyncApiCall(() => {
  // someAsyncApiCall이 완료되지 않았으므로 bar는 어떤 값도 할당받지 못했습니다.
  console.log('bar', bar); // undefined
});
bar = 1;
```

사용자는 `someAsyncApiCall()`이 비동기 시그니처를 갖도록 정의하지만 실제로 동기적으로 작동합니다. 호출되면 `someAsyncApiCall()`이 실제로 비동기적으로 아무 것도 하지 않기 때문에 `someAsyncApiCall()`에 제공된 콜백은 이벤트 루프의 동일한 단계에서 호출됩니다. 결과적으로 콜백은 스크립트가 완료될 때까지 실행되지 않았기 때문에 아직 범위 내에 해당 변수가 없을 수 있음에도 불구하고 bar를 참조하려고 시도합니다.

콜백을 `process.nextTick()`에 배치하면 스크립트는 여전히 완료될 때까지 실행될 수 있어 콜백이 호출되기 전에 모든 변수, 함수 등이 초기화될 수 있습니다. 또한 이벤트 루프가 계속되지 않도록 하는 장점도 있습니다. 이벤트 루프가 계속되기 전에 사용자에게 오류를 알리는 것이 유용할 수 있습니다. 다음은 `process.nextTick()`을 사용하는 이전 예제입니다.

```js
let bar;
function someAsyncApiCall(callback) {
  process.nextTick(callback);
}
someAsyncApiCall(() => {
  console.log('bar', bar); // 1
});
bar = 1;
```

다음은 또 다른 실제 예제입니다.

```js
const server = net.createServer(() => {}).listen(8080);
server.on('listening', () => {});
```

포트만 전달되면 포트가 즉시 바인딩됩니다. 따라서 `'listening'` 콜백이 즉시 호출될 수 있습니다. 문제는 해당 시점까지 `.on('listening')` 콜백이 설정되지 않았을 수 있다는 것입니다.

이를 해결하기 위해 `'listening'` 이벤트는 스크립트가 완료될 때까지 실행될 수 있도록 `nextTick()`에 큐에 대기됩니다. 이를 통해 사용자는 원하는 이벤트 핸들러를 설정할 수 있습니다.


## `process.nextTick()` vs `setImmediate()`

사용자 입장에서는 유사하지만 이름이 혼동스러운 두 가지 호출이 있습니다.

- `process.nextTick()`은 동일한 단계에서 즉시 실행됩니다.
- `setImmediate()`는 이벤트 루프의 다음 반복 또는 `'tick'`에서 실행됩니다.

본질적으로 이름이 바뀌어야 합니다. `process.nextTick()`은 `setImmediate()`보다 더 즉시 실행되지만, 이는 과거의 유물이며 변경될 가능성은 낮습니다. 이러한 전환은 npm의 패키지 중 상당 부분을 망가뜨릴 것입니다. 매일 더 많은 새로운 모듈이 추가되고 있으며, 이는 기다릴수록 잠재적인 손상이 더 많이 발생한다는 의미입니다. 혼동스럽지만 이름 자체는 변경되지 않습니다.

::: tip
개발자는 모든 경우에 `setImmediate()`를 사용하는 것이 더 이해하기 쉽기 때문에 권장합니다.
:::

## 왜 `process.nextTick()`을 사용해야 할까요?

두 가지 주요 이유가 있습니다.

1. 사용자가 오류를 처리하고, 불필요한 리소스를 정리하거나, 이벤트 루프가 계속되기 전에 요청을 다시 시도할 수 있도록 합니다.

2. 때로는 콜 스택이 풀린 후 이벤트 루프가 계속되기 전에 콜백을 실행해야 할 필요가 있습니다.

한 가지 예는 사용자의 기대에 부응하는 것입니다. 간단한 예:

```js
const server = net.createServer();
server.on('connection', conn => {});
server.listen(8080);
server.on('listening', () => {});
```

`listen()`이 이벤트 루프의 시작 부분에서 실행되지만 수신 콜백이 `setImmediate()`에 배치되었다고 가정합니다. 호스트 이름이 전달되지 않으면 포트 바인딩이 즉시 발생합니다. 이벤트 루프가 진행되려면 폴 단계를 거쳐야 하며, 이는 수신 이벤트 전에 연결 이벤트가 발생할 가능성이 있다는 것을 의미합니다.

또 다른 예는 `EventEmitter`를 확장하고 생성자 내에서 이벤트를 발생시키는 것입니다.

```js
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {
  constructor() {
    super();
    this.emit('event');
  }
}
const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
```

스크립트가 사용자가 해당 이벤트에 콜백을 할당하는 지점까지 처리되지 않았기 때문에 생성자에서 즉시 이벤트를 발생시킬 수 없습니다. 따라서 생성자 자체 내에서 `process.nextTick()`을 사용하여 생성자가 완료된 후 이벤트를 발생시키는 콜백을 설정하여 예상되는 결과를 제공할 수 있습니다.

```js
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {
  constructor() {
    super();
    // 핸들러가 할당되면 이벤트를 발생시키기 위해 nextTick 사용
    process.nextTick(() => {
      this.emit('event');
    });
  }
}
const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
```
