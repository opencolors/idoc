---
title: Node.js 타이머 API 문서
description: Node.js의 타이머 모듈은 미래의 특정 시점에 함수를 호출하기 위한 기능을 제공합니다. 여기에는 setTimeout, setInterval, setImmediate 등의 메서드와 그에 상응하는 클리어 메서드, 그리고 이벤트 루프의 다음 반복에서 코드를 실행하기 위한 process.nextTick이 포함됩니다.
head:
  - - meta
    - name: og:title
      content: Node.js 타이머 API 문서 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 타이머 모듈은 미래의 특정 시점에 함수를 호출하기 위한 기능을 제공합니다. 여기에는 setTimeout, setInterval, setImmediate 등의 메서드와 그에 상응하는 클리어 메서드, 그리고 이벤트 루프의 다음 반복에서 코드를 실행하기 위한 process.nextTick이 포함됩니다.
  - - meta
    - name: twitter:title
      content: Node.js 타이머 API 문서 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 타이머 모듈은 미래의 특정 시점에 함수를 호출하기 위한 기능을 제공합니다. 여기에는 setTimeout, setInterval, setImmediate 등의 메서드와 그에 상응하는 클리어 메서드, 그리고 이벤트 루프의 다음 반복에서 코드를 실행하기 위한 process.nextTick이 포함됩니다.
---


# 타이머 {#timers}

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

**소스 코드:** [lib/timers.js](https://github.com/nodejs/node/blob/v23.5.0/lib/timers.js)

`timer` 모듈은 특정 시점에 호출될 함수를 예약하기 위한 전역 API를 제공합니다. 타이머 함수는 전역이므로 API를 사용하기 위해 `require('node:timers')`를 호출할 필요가 없습니다.

Node.js 내의 타이머 함수는 웹 브라우저에서 제공하는 타이머 API와 유사한 API를 구현하지만 Node.js [이벤트 루프](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout)를 기반으로 구축된 다른 내부 구현을 사용합니다.

## 클래스: `Immediate` {#class-immediate}

이 객체는 내부적으로 생성되며 [`setImmediate()`](/ko/nodejs/api/timers#setimmediatecallback-args)에서 반환됩니다. 예약된 작업을 취소하기 위해 [`clearImmediate()`](/ko/nodejs/api/timers#clearimmediateimmediate)에 전달할 수 있습니다.

기본적으로 즉시 실행이 예약되면 Node.js 이벤트 루프는 즉시 실행이 활성 상태인 동안 계속 실행됩니다. [`setImmediate()`](/ko/nodejs/api/timers#setimmediatecallback-args)에서 반환된 `Immediate` 객체는 이 기본 동작을 제어하는 데 사용할 수 있는 `immediate.ref()` 및 `immediate.unref()` 함수를 모두 내보냅니다.

### `immediate.hasRef()` {#immediatehasref}

**추가된 버전: v11.0.0**

- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

true이면 `Immediate` 객체는 Node.js 이벤트 루프를 활성 상태로 유지합니다.

### `immediate.ref()` {#immediateref}

**추가된 버전: v9.7.0**

- 반환: [\<Immediate\>](/ko/nodejs/api/timers#class-immediate) `immediate`에 대한 참조

호출되면 `Immediate`가 활성 상태인 동안 Node.js 이벤트 루프가 종료 *되지 않도록* 요청합니다. `immediate.ref()`를 여러 번 호출해도 아무런 효과가 없습니다.

기본적으로 모든 `Immediate` 객체는 "참조됨"이므로 이전에 `immediate.unref()`가 호출되지 않은 경우 일반적으로 `immediate.ref()`를 호출할 필요가 없습니다.


### `immediate.unref()` {#immediateunref}

**Added in: v9.7.0**

- 반환: [\<Immediate\>](/ko/nodejs/api/timers#class-immediate) `immediate`에 대한 참조

호출되면 활성 `Immediate` 객체는 Node.js 이벤트 루프가 활성 상태를 유지하는 데 필요하지 않습니다. 이벤트 루프를 계속 실행하는 다른 활동이 없으면 `Immediate` 객체의 콜백이 호출되기 전에 프로세스가 종료될 수 있습니다. `immediate.unref()`를 여러 번 호출해도 아무런 효과가 없습니다.

### `immediate[Symbol.dispose]()` {#immediatesymboldispose}

**Added in: v20.5.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

immediate를 취소합니다. 이는 `clearImmediate()`를 호출하는 것과 유사합니다.

## 클래스: `Timeout` {#class-timeout}

이 객체는 내부적으로 생성되며 [`setTimeout()`](/ko/nodejs/api/timers#settimeoutcallback-delay-args) 및 [`setInterval()`](/ko/nodejs/api/timers#setintervalcallback-delay-args)에서 반환됩니다. 예약된 작업을 취소하기 위해 [`clearTimeout()`](/ko/nodejs/api/timers#cleartimeouttimeout) 또는 [`clearInterval()`](/ko/nodejs/api/timers#clearintervaltimeout)에 전달할 수 있습니다.

기본적으로 [`setTimeout()`](/ko/nodejs/api/timers#settimeoutcallback-delay-args) 또는 [`setInterval()`](/ko/nodejs/api/timers#setintervalcallback-delay-args)을 사용하여 타이머가 예약되면 타이머가 활성 상태인 동안 Node.js 이벤트 루프는 계속 실행됩니다. 이러한 함수에서 반환된 각 `Timeout` 객체는 이 기본 동작을 제어하는 데 사용할 수 있는 `timeout.ref()` 및 `timeout.unref()` 함수를 모두 내보냅니다.

### `timeout.close()` {#timeoutclose}

**Added in: v0.9.1**

::: info [Stable: 3 - Legacy]
[Stable: 3](/ko/nodejs/api/documentation#stability-index) [Stability: 3](/ko/nodejs/api/documentation#stability-index) - 레거시: 대신 [`clearTimeout()`](/ko/nodejs/api/timers#cleartimeouttimeout)을 사용하십시오.
:::

- 반환: [\<Timeout\>](/ko/nodejs/api/timers#class-timeout) `timeout`에 대한 참조

타임아웃을 취소합니다.

### `timeout.hasRef()` {#timeouthasref}

**Added in: v11.0.0**

- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

true이면 `Timeout` 객체가 Node.js 이벤트 루프를 활성 상태로 유지합니다.


### `timeout.ref()` {#timeoutref}

**추가된 버전: v0.9.1**

- 반환값: [\<Timeout\>](/ko/nodejs/api/timers#class-timeout) `timeout`에 대한 참조

호출되면 `Timeout`이 활성 상태인 동안 Node.js 이벤트 루프가 종료되지 않도록 요청합니다. `timeout.ref()`를 여러 번 호출해도 아무런 효과가 없습니다.

기본적으로 모든 `Timeout` 객체는 "ref'ed" 상태이므로 이전에 `timeout.unref()`를 호출하지 않은 경우 일반적으로 `timeout.ref()`를 호출할 필요가 없습니다.

### `timeout.refresh()` {#timeoutrefresh}

**추가된 버전: v10.2.0**

- 반환값: [\<Timeout\>](/ko/nodejs/api/timers#class-timeout) `timeout`에 대한 참조

타이머의 시작 시간을 현재 시간으로 설정하고, 타이머가 현재 시간에 맞게 조정된 이전 지정된 기간에 콜백을 호출하도록 다시 예약합니다. 이는 새 JavaScript 객체를 할당하지 않고 타이머를 새로 고치는 데 유용합니다.

콜백을 이미 호출한 타이머에서 이 기능을 사용하면 타이머가 다시 활성화됩니다.

### `timeout.unref()` {#timeoutunref}

**추가된 버전: v0.9.1**

- 반환값: [\<Timeout\>](/ko/nodejs/api/timers#class-timeout) `timeout`에 대한 참조

호출되면 활성 `Timeout` 객체는 Node.js 이벤트 루프가 활성 상태를 유지하는 데 필요하지 않습니다. 이벤트 루프를 계속 실행하는 다른 활동이 없으면 `Timeout` 객체의 콜백이 호출되기 전에 프로세스가 종료될 수 있습니다. `timeout.unref()`를 여러 번 호출해도 아무런 효과가 없습니다.

### `timeout[Symbol.toPrimitive]()` {#timeoutsymboltoprimitive}

**추가된 버전: v14.9.0, v12.19.0**

- 반환값: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 `timeout`을 참조하는 데 사용할 수 있는 숫자

`Timeout`을 원시 값으로 강제 변환합니다. 원시 값은 `Timeout`을 지우는 데 사용할 수 있습니다. 원시 값은 타임아웃이 생성된 동일한 스레드에서만 사용할 수 있습니다. 따라서 [`worker_threads`](/ko/nodejs/api/worker_threads)에서 사용하려면 먼저 올바른 스레드로 전달해야 합니다. 이를 통해 브라우저 `setTimeout()` 및 `setInterval()` 구현과의 호환성이 향상됩니다.

### `timeout[Symbol.dispose]()` {#timeoutsymboldispose}

**추가된 버전: v20.5.0, v18.18.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

타임아웃을 취소합니다.


## 타이머 스케줄링 {#scheduling-timers}

Node.js의 타이머는 특정 시간이 지난 후 주어진 함수를 호출하는 내부 구조입니다. 타이머의 함수가 호출되는 시점은 타이머를 생성하는 데 사용된 메서드와 Node.js 이벤트 루프가 수행 중인 다른 작업에 따라 다릅니다.

### `setImmediate(callback[, ...args])` {#setimmediatecallback-args}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE` 오류가 발생합니다. |
| v0.9.1 | 추가됨: v0.9.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Node.js [이벤트 루프](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout)의 이번 턴이 끝날 때 호출할 함수입니다.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `callback`이 호출될 때 전달할 선택적 인수입니다.
- 반환값: [`clearImmediate()`](/ko/nodejs/api/timers#clearimmediateimmediate)와 함께 사용할 [\<Immediate\>](/ko/nodejs/api/timers#class-immediate)

I/O 이벤트 콜백 후 `callback`의 "즉시" 실행을 예약합니다.

`setImmediate()`에 대한 여러 호출이 이루어지면 `callback` 함수는 생성된 순서대로 실행되도록 대기열에 추가됩니다. 전체 콜백 대기열은 모든 이벤트 루프 반복에서 처리됩니다. 실행 중인 콜백 내부에서 즉시 타이머가 대기열에 추가되면 해당 타이머는 다음 이벤트 루프 반복까지 트리거되지 않습니다.

`callback`이 함수가 아니면 [`TypeError`](/ko/nodejs/api/errors#class-typeerror)가 발생합니다.

이 메서드에는 [`timersPromises.setImmediate()`](/ko/nodejs/api/timers#timerspromisessetimmediatevalue-options)를 사용하여 사용할 수 있는 Promise에 대한 사용자 정의 변형이 있습니다.

### `setInterval(callback[, delay[, ...args]])` {#setintervalcallback-delay-args}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE` 오류가 발생합니다. |
| v0.0.1 | 추가됨: v0.0.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 타이머가 경과하면 호출할 함수입니다.
- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `callback`을 호출하기 전에 대기할 시간(밀리초)입니다. **기본값:** `1`.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `callback`이 호출될 때 전달할 선택적 인수입니다.
- 반환값: [`clearInterval()`](/ko/nodejs/api/timers#clearintervaltimeout)와 함께 사용할 [\<Timeout\>](/ko/nodejs/api/timers#class-timeout)

`delay` 밀리초마다 `callback`의 반복 실행을 예약합니다.

`delay`가 `2147483647`보다 크거나 `1`보다 작거나 `NaN`이면 `delay`가 `1`로 설정됩니다. 정수가 아닌 지연은 정수로 잘립니다.

`callback`이 함수가 아니면 [`TypeError`](/ko/nodejs/api/errors#class-typeerror)가 발생합니다.

이 메서드에는 [`timersPromises.setInterval()`](/ko/nodejs/api/timers#timerspromisessetintervaldelay-value-options)를 사용하여 사용할 수 있는 Promise에 대한 사용자 정의 변형이 있습니다.


### `setTimeout(callback[, delay[, ...args]])` {#settimeoutcallback-delay-args}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`을 던집니다. |
| v0.0.1 | v0.0.1에 추가됨 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 타이머가 경과되면 호출할 함수입니다.
- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `callback`을 호출하기 전에 대기할 시간(밀리초)입니다. **기본값:** `1`.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `callback`이 호출될 때 전달할 선택적 인수입니다.
- 반환: [`clearTimeout()`](/ko/nodejs/api/timers#cleartimeouttimeout)에 사용할 [\<Timeout\>](/ko/nodejs/api/timers#class-timeout)

`delay` 밀리초 후에 일회성 `callback` 실행을 예약합니다.

`callback`은 정확히 `delay` 밀리초 내에 호출되지 않을 수 있습니다. Node.js는 콜백이 실행되는 정확한 시간 또는 순서에 대해 보장하지 않습니다. 콜백은 지정된 시간에 최대한 가깝게 호출됩니다.

`delay`가 `2147483647`보다 크거나 `1`보다 작거나 `NaN`이면 `delay`는 `1`로 설정됩니다. 정수가 아닌 지연은 정수로 잘립니다.

`callback`이 함수가 아니면 [`TypeError`](/ko/nodejs/api/errors#class-typeerror)가 발생합니다.

이 메서드에는 [`timersPromises.setTimeout()`](/ko/nodejs/api/timers#timerspromisessettimeoutdelay-value-options)를 사용하여 사용할 수 있는 프로미스에 대한 사용자 지정 변형이 있습니다.

## 타이머 취소 {#cancelling-timers}

[`setImmediate()`](/ko/nodejs/api/timers#setimmediatecallback-args), [`setInterval()`](/ko/nodejs/api/timers#setintervalcallback-delay-args) 및 [`setTimeout()`](/ko/nodejs/api/timers#settimeoutcallback-delay-args) 메서드는 각각 예약된 타이머를 나타내는 객체를 반환합니다. 이러한 객체를 사용하여 타이머를 취소하고 트리거되지 않도록 할 수 있습니다.

[`setImmediate()`](/ko/nodejs/api/timers#setimmediatecallback-args) 및 [`setTimeout()`](/ko/nodejs/api/timers#settimeoutcallback-delay-args)의 프로미스화된 변형의 경우 [`AbortController`](/ko/nodejs/api/globals#class-abortcontroller)를 사용하여 타이머를 취소할 수 있습니다. 취소되면 반환된 Promise는 `'AbortError'`와 함께 거부됩니다.

`setImmediate()`의 경우:

::: code-group
```js [ESM]
import { setImmediate as setImmediatePromise } from 'node:timers/promises';

const ac = new AbortController();
const signal = ac.signal;

// Promise를 `await`하지 않으므로 `ac.abort()`가 동시에 호출됩니다.
setImmediatePromise('foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The immediate was aborted');
  });

ac.abort();
```

```js [CJS]
const { setImmediate: setImmediatePromise } = require('node:timers/promises');

const ac = new AbortController();
const signal = ac.signal;

setImmediatePromise('foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The immediate was aborted');
  });

ac.abort();
```
:::

`setTimeout()`의 경우:

::: code-group
```js [ESM]
import { setTimeout as setTimeoutPromise } from 'node:timers/promises';

const ac = new AbortController();
const signal = ac.signal;

// Promise를 `await`하지 않으므로 `ac.abort()`가 동시에 호출됩니다.
setTimeoutPromise(1000, 'foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The timeout was aborted');
  });

ac.abort();
```

```js [CJS]
const { setTimeout: setTimeoutPromise } = require('node:timers/promises');

const ac = new AbortController();
const signal = ac.signal;

setTimeoutPromise(1000, 'foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The timeout was aborted');
  });

ac.abort();
```
:::


### `clearImmediate(immediate)` {#clearimmediateimmediate}

**추가된 버전: v0.9.1**

- `immediate` [\<Immediate\>](/ko/nodejs/api/timers#class-immediate) [`setImmediate()`](/ko/nodejs/api/timers#setimmediatecallback-args)에서 반환된 `Immediate` 객체입니다.

[`setImmediate()`](/ko/nodejs/api/timers#setimmediatecallback-args)에서 생성된 `Immediate` 객체를 취소합니다.

### `clearInterval(timeout)` {#clearintervaltimeout}

**추가된 버전: v0.0.1**

- `timeout` [\<Timeout\>](/ko/nodejs/api/timers#class-timeout) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`setInterval()`](/ko/nodejs/api/timers#setintervalcallback-delay-args)에서 반환된 `Timeout` 객체 또는 문자열이나 숫자로 된 `Timeout` 객체의 [기본](/ko/nodejs/api/timers#timeoutsymboltoprimitive)입니다.

[`setInterval()`](/ko/nodejs/api/timers#setintervalcallback-delay-args)에서 생성된 `Timeout` 객체를 취소합니다.

### `clearTimeout(timeout)` {#cleartimeouttimeout}

**추가된 버전: v0.0.1**

- `timeout` [\<Timeout\>](/ko/nodejs/api/timers#class-timeout) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`setTimeout()`](/ko/nodejs/api/timers#settimeoutcallback-delay-args)에서 반환된 `Timeout` 객체 또는 문자열이나 숫자로 된 `Timeout` 객체의 [기본](/ko/nodejs/api/timers#timeoutsymboltoprimitive)입니다.

[`setTimeout()`](/ko/nodejs/api/timers#settimeoutcallback-delay-args)에서 생성된 `Timeout` 객체를 취소합니다.

## 타이머 프로미스 API {#timers-promises-api}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.0.0 | 실험적 단계에서 졸업 |
| v15.0.0 | 추가된 버전: v15.0.0 |
:::

`timers/promises` API는 `Promise` 객체를 반환하는 타이머 함수 세트를 제공합니다. API는 `require('node:timers/promises')`를 통해 접근할 수 있습니다.

::: code-group
```js [ESM]
import {
  setTimeout,
  setImmediate,
  setInterval,
} from 'node:timers/promises';
```

```js [CJS]
const {
  setTimeout,
  setImmediate,
  setInterval,
} = require('node:timers/promises');
```
:::


### `timersPromises.setTimeout([delay[, value[, options]]])` {#timerspromisessettimeoutdelay-value-options}

**Added in: v15.0.0**

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프라미스가 이행되기 전에 기다릴 밀리초 단위의 시간입니다. **기본값:** `1`.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 프라미스가 이행될 때 사용될 값입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 예약된 `Timeout`이 Node.js 이벤트 루프가 활성 상태로 유지되도록 요구하지 않아야 함을 나타내려면 `false`로 설정합니다. **기본값:** `true`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 예약된 `Timeout`을 취소하는 데 사용할 수 있는 선택적 `AbortSignal`입니다.
  
 



::: code-group
```js [ESM]
import {
  setTimeout,
} from 'node:timers/promises';

const res = await setTimeout(100, 'result');

console.log(res);  // 'result' 출력
```

```js [CJS]
const {
  setTimeout,
} = require('node:timers/promises');

setTimeout(100, 'result').then((res) => {
  console.log(res);  // 'result' 출력
});
```
:::

### `timersPromises.setImmediate([value[, options]])` {#timerspromisessetimmediatevalue-options}

**Added in: v15.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 프라미스가 이행될 때 사용될 값입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 예약된 `Immediate`가 Node.js 이벤트 루프가 활성 상태로 유지되도록 요구하지 않아야 함을 나타내려면 `false`로 설정합니다. **기본값:** `true`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 예약된 `Immediate`를 취소하는 데 사용할 수 있는 선택적 `AbortSignal`입니다.
  
 



::: code-group
```js [ESM]
import {
  setImmediate,
} from 'node:timers/promises';

const res = await setImmediate('result');

console.log(res);  // 'result' 출력
```

```js [CJS]
const {
  setImmediate,
} = require('node:timers/promises');

setImmediate('result').then((res) => {
  console.log(res);  // 'result' 출력
});
```
:::


### `timersPromises.setInterval([delay[, value[, options]]])` {#timerspromisessetintervaldelay-value-options}

**Added in: v15.9.0**

`delay` ms 간격으로 값을 생성하는 비동기 이터레이터를 반환합니다. `ref`가 `true`인 경우 이벤트 루프를 활성 상태로 유지하려면 비동기 이터레이터의 `next()`를 명시적으로 또는 암시적으로 호출해야 합니다.

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 반복 간에 대기할 밀리초 수입니다. **기본값:** `1`.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 이터레이터가 반환하는 값입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 반복 간에 예약된 `Timeout`이 Node.js 이벤트 루프가 활성 상태를 유지하도록 요구하지 않아야 함을 나타내려면 `false`로 설정합니다. **기본값:** `true`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 작업 간에 예약된 `Timeout`을 취소하는 데 사용할 수 있는 선택적 `AbortSignal`입니다.
  
 

::: code-group
```js [ESM]
import {
  setInterval,
} from 'node:timers/promises';

const interval = 100;
for await (const startTime of setInterval(interval, Date.now())) {
  const now = Date.now();
  console.log(now);
  if ((now - startTime) > 1000)
    break;
}
console.log(Date.now());
```

```js [CJS]
const {
  setInterval,
} = require('node:timers/promises');
const interval = 100;

(async function() {
  for await (const startTime of setInterval(interval, Date.now())) {
    const now = Date.now();
    console.log(now);
    if ((now - startTime) > 1000)
      break;
  }
  console.log(Date.now());
})();
```
:::

### `timersPromises.scheduler.wait(delay[, options])` {#timerspromisesschedulerwaitdelay-options}

**Added in: v17.3.0, v16.14.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로미스가 해결되기 전에 대기할 밀리초 수입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 예약된 `Timeout`이 Node.js 이벤트 루프가 활성 상태를 유지하도록 요구하지 않아야 함을 나타내려면 `false`로 설정합니다. **기본값:** `true`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 대기를 취소하는 데 사용할 수 있는 선택적 `AbortSignal`입니다.
  
 
- 반환값: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

표준 웹 플랫폼 API로 개발 중인 [Scheduling APIs](https://github.com/WICG/scheduling-apis) 초안 사양에 의해 정의된 실험적 API입니다.

`timersPromises.scheduler.wait(delay, options)`를 호출하는 것은 `timersPromises.setTimeout(delay, undefined, options)`를 호출하는 것과 같습니다.

```js [ESM]
import { scheduler } from 'node:timers/promises';

await scheduler.wait(1000); // 계속하기 전에 1초 동안 기다립니다.
```

### `timersPromises.scheduler.yield()` {#timerspromisesscheduleryield}

**추가된 버전: v17.3.0, v16.14.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

[Scheduling APIs](https://github.com/WICG/scheduling-apis) 초안 명세에 의해 정의된 실험적인 API로, 표준 웹 플랫폼 API로 개발 중입니다.

`timersPromises.scheduler.yield()`를 호출하는 것은 인자 없이 `timersPromises.setImmediate()`를 호출하는 것과 같습니다.

