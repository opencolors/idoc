---
title: Node.js 문서 - 이벤트
description: Node.js의 이벤트 모듈을 탐색하세요. 이벤트 기반 프로그래밍을 통해 비동기 작업을 처리하는 방법을 제공합니다. 이벤트 발생기, 리스너, 그리고 이벤트를 효과적으로 관리하는 방법에 대해 배웁니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - 이벤트 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 이벤트 모듈을 탐색하세요. 이벤트 기반 프로그래밍을 통해 비동기 작업을 처리하는 방법을 제공합니다. 이벤트 발생기, 리스너, 그리고 이벤트를 효과적으로 관리하는 방법에 대해 배웁니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - 이벤트 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 이벤트 모듈을 탐색하세요. 이벤트 기반 프로그래밍을 통해 비동기 작업을 처리하는 방법을 제공합니다. 이벤트 발생기, 리스너, 그리고 이벤트를 효과적으로 관리하는 방법에 대해 배웁니다.
---


# 이벤트 {#events}

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

**소스 코드:** [lib/events.js](https://github.com/nodejs/node/blob/v23.5.0/lib/events.js)

대부분의 Node.js 핵심 API는 특정 종류의 객체("이벤트 발생기"라고 함)가 명명된 이벤트를 발생시켜 `Function` 객체("리스너")가 호출되도록 하는 관용적인 비동기 이벤트 중심 아키텍처를 기반으로 구축되었습니다.

예를 들어: [`net.Server`](/ko/nodejs/api/net#class-netserver) 객체는 피어가 연결될 때마다 이벤트를 발생시킵니다. [`fs.ReadStream`](/ko/nodejs/api/fs#class-fsreadstream)은 파일이 열릴 때 이벤트를 발생시킵니다. [스트림](/ko/nodejs/api/stream)은 읽을 수 있는 데이터가 있을 때마다 이벤트를 발생시킵니다.

이벤트를 발생시키는 모든 객체는 `EventEmitter` 클래스의 인스턴스입니다. 이러한 객체는 객체가 발생시키는 명명된 이벤트에 하나 이상의 함수를 연결할 수 있는 `eventEmitter.on()` 함수를 제공합니다. 일반적으로 이벤트 이름은 카멜 케이스 문자열이지만 유효한 JavaScript 속성 키를 사용할 수 있습니다.

`EventEmitter` 객체가 이벤트를 발생시키면 해당 특정 이벤트에 연결된 모든 함수가 *동기적*으로 호출됩니다. 호출된 리스너가 반환하는 모든 값은 *무시*되고 삭제됩니다.

다음 예제는 단일 리스너가 있는 간단한 `EventEmitter` 인스턴스를 보여줍니다. `eventEmitter.on()` 메서드는 리스너를 등록하는 데 사용되고, `eventEmitter.emit()` 메서드는 이벤트를 트리거하는 데 사용됩니다.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('이벤트가 발생했습니다!');
});
myEmitter.emit('event');
```

```js [CJS]
const EventEmitter = require('node:events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('이벤트가 발생했습니다!');
});
myEmitter.emit('event');
```
:::

## 리스너에 인수 및 `this` 전달하기 {#passing-arguments-and-this-to-listeners}

`eventEmitter.emit()` 메서드를 사용하면 임의의 인수 집합을 리스너 함수에 전달할 수 있습니다. 일반 리스너 함수가 호출될 때 표준 `this` 키워드는 리스너가 연결된 `EventEmitter` 인스턴스를 참조하도록 의도적으로 설정됩니다.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // 출력:
  //   a b MyEmitter {
  //     _events: [Object: null prototype] { event: [Function (anonymous)] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined,
  //     [Symbol(shapeMode)]: false,
  //     [Symbol(kCapture)]: false
  //   } true
});
myEmitter.emit('event', 'a', 'b');
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // 출력:
  //   a b MyEmitter {
  //     _events: [Object: null prototype] { event: [Function (anonymous)] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined,
  //     [Symbol(shapeMode)]: false,
  //     [Symbol(kCapture)]: false
  //   } true
});
myEmitter.emit('event', 'a', 'b');
```
:::

ES6 화살표 함수를 리스너로 사용할 수 있지만, 이 경우 `this` 키워드는 더 이상 `EventEmitter` 인스턴스를 참조하지 않습니다.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // 출력: a b undefined
});
myEmitter.emit('event', 'a', 'b');
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // 출력: a b {}
});
myEmitter.emit('event', 'a', 'b');
```
:::


## 비동기 vs. 동기 {#asynchronous-vs-synchronous}

`EventEmitter`는 등록된 순서대로 모든 리스너를 동기적으로 호출합니다. 이는 이벤트의 적절한 순서를 보장하고 경쟁 조건 및 논리적 오류를 방지하는 데 도움이 됩니다. 적절한 경우 리스너 함수는 `setImmediate()` 또는 `process.nextTick()` 메서드를 사용하여 비동기 작동 모드로 전환할 수 있습니다.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('this happens asynchronously');
  });
});
myEmitter.emit('event', 'a', 'b');
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('this happens asynchronously');
  });
});
myEmitter.emit('event', 'a', 'b');
```
:::

## 이벤트를 한 번만 처리하기 {#handling-events-only-once}

`eventEmitter.on()` 메서드를 사용하여 리스너를 등록하면 명명된 이벤트가 발생할 *때마다* 해당 리스너가 호출됩니다.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Prints: 2
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Prints: 2
```
:::

`eventEmitter.once()` 메서드를 사용하면 특정 이벤트에 대해 최대 한 번 호출되는 리스너를 등록할 수 있습니다. 이벤트가 발생하면 리스너가 등록 해제되고 *그 후* 호출됩니다.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Ignored
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Ignored
```
:::


## 오류 이벤트 {#error-events}

`EventEmitter` 인스턴스 내에서 오류가 발생하면 일반적으로 `'error'` 이벤트가 발생합니다. 이러한 이벤트는 Node.js 내에서 특별한 경우로 취급됩니다.

`EventEmitter`에 `'error'` 이벤트에 대해 등록된 리스너가 하나 이상 *없는* 상태에서 `'error'` 이벤트가 발생하면 오류가 발생하고 스택 추적이 출력되며 Node.js 프로세스가 종료됩니다.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// Node.js를 던지고 충돌시킵니다.
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// Node.js를 던지고 충돌시킵니다.
```
:::

Node.js 프로세스가 충돌하는 것을 방지하기 위해 [`domain`](/ko/nodejs/api/domain) 모듈을 사용할 수 있습니다. (그러나 `node:domain` 모듈은 더 이상 사용되지 않습니다.)

가장 좋은 방법은 항상 `'error'` 이벤트에 대한 리스너를 추가하는 것입니다.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// 출력: whoops! there was an error
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// 출력: whoops! there was an error
```
:::

기호 `events.errorMonitor`를 사용하여 리스너를 설치하여 발생된 오류를 소비하지 않고도 `'error'` 이벤트를 모니터링할 수 있습니다.

::: code-group
```js [ESM]
import { EventEmitter, errorMonitor } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// 여전히 Node.js를 던지고 충돌시킵니다.
```

```js [CJS]
const { EventEmitter, errorMonitor } = require('node:events');

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// 여전히 Node.js를 던지고 충돌시킵니다.
```
:::


## 프로미스 거부 캡처 {#capture-rejections-of-promises}

이벤트 핸들러와 함께 `async` 함수를 사용하면 예외가 발생할 경우 처리되지 않은 거부로 이어질 수 있기 때문에 문제가 됩니다.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();
ee.on('something', async (value) => {
  throw new Error('kaboom');
});
```

```js [CJS]
const EventEmitter = require('node:events');
const ee = new EventEmitter();
ee.on('something', async (value) => {
  throw new Error('kaboom');
});
```
:::

`EventEmitter` 생성자의 `captureRejections` 옵션 또는 전역 설정은 `Promise`에 `.then(undefined, handler)` 핸들러를 설치하여 이 동작을 변경합니다. 이 핸들러는 예외를 비동기적으로 [`Symbol.for('nodejs.rejection')`](/ko/nodejs/api/events#emittersymbolfornodejsrejectionerr-eventname-args) 메서드(있는 경우) 또는 [`'error'`](/ko/nodejs/api/events#error-events) 이벤트 핸들러(없는 경우)로 라우팅합니다.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const ee1 = new EventEmitter({ captureRejections: true });
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);

const ee2 = new EventEmitter({ captureRejections: true });
ee2.on('something', async (value) => {
  throw new Error('kaboom');
});

ee2[Symbol.for('nodejs.rejection')] = console.log;
```

```js [CJS]
const EventEmitter = require('node:events');
const ee1 = new EventEmitter({ captureRejections: true });
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);

const ee2 = new EventEmitter({ captureRejections: true });
ee2.on('something', async (value) => {
  throw new Error('kaboom');
});

ee2[Symbol.for('nodejs.rejection')] = console.log;
```
:::

`events.captureRejections = true`로 설정하면 `EventEmitter`의 모든 새 인스턴스에 대한 기본값이 변경됩니다.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

EventEmitter.captureRejections = true;
const ee1 = new EventEmitter();
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);
```

```js [CJS]
const events = require('node:events');
events.captureRejections = true;
const ee1 = new events.EventEmitter();
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);
```
:::

`captureRejections` 동작으로 생성된 `'error'` 이벤트에는 무한 오류 루프를 방지하기 위한 catch 핸들러가 없습니다. 따라서 **<code>async</code> 함수를 <code>'error'</code> 이벤트 핸들러로 사용하지 않는 것이 좋습니다**.


## 클래스: `EventEmitter` {#class-eventemitter}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.4.0, v12.16.0 | captureRejections 옵션 추가. |
| v0.1.26 | 추가됨: v0.1.26 |
:::

`EventEmitter` 클래스는 `node:events` 모듈에 의해 정의되고 노출됩니다.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
```

```js [CJS]
const EventEmitter = require('node:events');
```
:::

모든 `EventEmitter`는 새 리스너가 추가될 때 `'newListener'` 이벤트를 발생시키고 기존 리스너가 제거될 때 `'removeListener'` 이벤트를 발생시킵니다.

다음 옵션을 지원합니다.

- `captureRejections` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) [프로미스 거부의 자동 캡처](/ko/nodejs/api/events#capture-rejections-of-promises)를 활성화합니다. **기본값:** `false`.

### 이벤트: `'newListener'` {#event-newlistener}

**추가됨: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 수신 대기 중인 이벤트 이름
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 이벤트 핸들러 함수

`EventEmitter` 인스턴스는 리스너가 내부 리스너 배열에 추가되기 *전에* 자체 `'newListener'` 이벤트를 발생시킵니다.

`'newListener'` 이벤트에 등록된 리스너는 이벤트 이름과 추가될 리스너에 대한 참조를 전달받습니다.

이벤트가 리스너를 추가하기 전에 트리거된다는 사실은 미묘하지만 중요한 부작용을 갖습니다. `'newListener'` 콜백 *내에서* 동일한 `name`에 등록된 *추가* 리스너는 추가될 프로세스에 있는 리스너 *앞에* 삽입됩니다.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// 영원히 루프하지 않도록 한 번만 수행하십시오.
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // 앞에 새 리스너 삽입
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// Prints:
//   B
//   A
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// 영원히 루프하지 않도록 한 번만 수행하십시오.
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // 앞에 새 리스너 삽입
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// Prints:
//   B
//   A
```
:::


### Event: `'removeListener'` {#event-removelistener}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v6.1.0, v4.7.0 | `.once()`를 사용하여 첨부된 리스너의 경우, `listener` 인수는 이제 원래의 리스너 함수를 산출합니다. |
| v0.9.3 | 추가됨: v0.9.3 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 이벤트 이름
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 이벤트 핸들러 함수

`'removeListener'` 이벤트는 `listener`가 제거된 *후에* 발생합니다.

### `emitter.addListener(eventName, listener)` {#emitteraddlistenereventname-listener}

**추가됨: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

`emitter.on(eventName, listener)`의 별칭.

### `emitter.emit(eventName[, ...args])` {#emitteremiteventname-args}

**추가됨: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`eventName`이라는 이벤트에 등록된 각 리스너를 등록된 순서대로 동기적으로 호출하며, 제공된 인수를 각 리스너에 전달합니다.

이벤트에 리스너가 있으면 `true`를 반환하고, 그렇지 않으면 `false`를 반환합니다.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```

```js [CJS]
const EventEmitter = require('node:events');
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```
:::


### `emitter.eventNames()` {#emittereventnames}

**추가된 버전: v6.0.0**

- 반환값: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

emitter가 리스너를 등록한 이벤트 목록을 배열로 반환합니다. 배열의 값은 문자열 또는 `Symbol`입니다.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```

```js [CJS]
const EventEmitter = require('node:events');

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```
:::

### `emitter.getMaxListeners()` {#emittergetmaxlisteners}

**추가된 버전: v1.0.0**

- 반환값: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`EventEmitter`의 현재 최대 리스너 값을 반환합니다. 이 값은 [`emitter.setMaxListeners(n)`](/ko/nodejs/api/events#emittersetmaxlistenersn)에 의해 설정되거나 기본값인 [`events.defaultMaxListeners`](/ko/nodejs/api/events#eventsdefaultmaxlisteners)를 사용합니다.

### `emitter.listenerCount(eventName[, listener])` {#emitterlistenercounteventname-listener}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v19.8.0, v18.16.0 | `listener` 인수가 추가되었습니다. |
| v3.2.0 | 추가된 버전: v3.2.0 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 수신 대기 중인 이벤트 이름
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 이벤트 핸들러 함수
- 반환값: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`eventName`이라는 이벤트를 수신 대기하는 리스너 수를 반환합니다. `listener`가 제공되면 이벤트의 리스너 목록에서 해당 리스너가 몇 번 발견되는지 반환합니다.


### `emitter.listeners(eventName)` {#emitterlistenerseventname}

::: info [기록]
| 버전    | 변경 사항                                                                               |
| :------- | :--------------------------------------------------------------------------------------- |
| v7.0.0   | `.once()`를 사용하여 연결된 리스너의 경우 이제 래퍼 함수 대신 원래 리스너를 반환합니다. |
| v0.1.26  | 추가됨: v0.1.26                                                                        |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- 반환: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

`eventName`이라는 이벤트에 대한 리스너 배열의 복사본을 반환합니다.

```js [ESM]
server.on('connection', (stream) => {
  console.log('누군가 연결되었습니다!');
});
console.log(util.inspect(server.listeners('connection')));
// 출력: [ [Function] ]
```
### `emitter.off(eventName, listener)` {#emitteroffeventname-listener}

**추가됨: v10.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter)

[`emitter.removeListener()`](/ko/nodejs/api/events#emitterremovelistenereventname-listener)의 별칭입니다.

### `emitter.on(eventName, listener)` {#emitteroneventname-listener}

**추가됨: v0.1.101**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 이벤트의 이름입니다.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 콜백 함수입니다.
- 반환: [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter)

`listener` 함수를 `eventName`이라는 이벤트에 대한 리스너 배열의 끝에 추가합니다. `listener`가 이미 추가되었는지 확인하는 검사는 수행되지 않습니다. 동일한 `eventName`과 `listener` 조합을 전달하는 여러 호출은 `listener`가 추가되고 여러 번 호출되는 결과를 낳습니다.

```js [ESM]
server.on('connection', (stream) => {
  console.log('누군가 연결되었습니다!');
});
```
호출을 체인으로 연결할 수 있도록 `EventEmitter`에 대한 참조를 반환합니다.

기본적으로 이벤트 리스너는 추가된 순서대로 호출됩니다. `emitter.prependListener()` 메서드를 사용하여 리스너 배열의 시작 부분에 이벤트 리스너를 추가할 수 있습니다.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// 출력:
//   b
//   a
```

```js [CJS]
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// 출력:
//   b
//   a
```
:::


### `emitter.once(eventName, listener)` {#emitteronceeventname-listener}

**Added in: v0.3.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 이벤트 이름.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 콜백 함수.
- Returns: [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter)

`eventName`이라는 이름의 이벤트에 대해 **일회성** `listener` 함수를 추가합니다. 다음에 `eventName`이 트리거되면 이 리스너는 제거된 다음 호출됩니다.

```js [ESM]
server.once('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

호출을 연결할 수 있도록 `EventEmitter`에 대한 참조를 반환합니다.

기본적으로 이벤트 리스너는 추가된 순서대로 호출됩니다. `emitter.prependOnceListener()` 메서드를 사용하여 이벤트 리스너를 리스너 배열의 시작 부분에 추가하는 대안으로 사용할 수 있습니다.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

```js [CJS]
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```
:::

### `emitter.prependListener(eventName, listener)` {#emitterprependlistenereventname-listener}

**Added in: v6.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 이벤트 이름.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 콜백 함수.
- Returns: [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter)

`eventName`이라는 이름의 이벤트에 대한 리스너 배열의 *시작 부분*에 `listener` 함수를 추가합니다. `listener`가 이미 추가되었는지 확인하기 위한 검사는 수행되지 않습니다. 동일한 `eventName` 및 `listener` 조합을 전달하는 여러 호출은 `listener`가 여러 번 추가되고 호출되게 합니다.

```js [ESM]
server.prependListener('connection', (stream) => {
  console.log('someone connected!');
});
```

호출을 연결할 수 있도록 `EventEmitter`에 대한 참조를 반환합니다.


### `emitter.prependOnceListener(eventName, listener)` {#emitterprependoncelistenereventname-listener}

**Added in: v6.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 이벤트 이름.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 콜백 함수
- 반환: [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter)

`eventName`이라는 이벤트에 대해 **일회성** `listener` 함수를 리스너 배열의 *시작 부분*에 추가합니다. 다음에 `eventName`이 트리거되면 이 리스너는 제거된 다음 호출됩니다.

```js [ESM]
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```
`EventEmitter`에 대한 참조를 반환하므로 호출을 연결할 수 있습니다.

### `emitter.removeAllListeners([eventName])` {#emitterremovealllistenerseventname}

**Added in: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- 반환: [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter)

모든 리스너 또는 지정된 `eventName`의 리스너를 제거합니다.

코드를 다른 곳에서 추가한 리스너, 특히 `EventEmitter` 인스턴스가 다른 컴포넌트나 모듈(예: 소켓 또는 파일 스트림)에 의해 생성된 경우 제거하는 것은 좋지 않은 방법입니다.

`EventEmitter`에 대한 참조를 반환하므로 호출을 연결할 수 있습니다.

### `emitter.removeListener(eventName, listener)` {#emitterremovelistenereventname-listener}

**Added in: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter)

`eventName`이라는 이벤트에 대한 리스너 배열에서 지정된 `listener`를 제거합니다.

```js [ESM]
const callback = (stream) => {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```
`removeListener()`는 리스너 배열에서 최대 하나의 리스너 인스턴스를 제거합니다. 지정된 `eventName`에 대해 단일 리스너가 리스너 배열에 여러 번 추가된 경우 각 인스턴스를 제거하려면 `removeListener()`를 여러 번 호출해야 합니다.

이벤트가 발생하면 발생 시점에 연결된 모든 리스너가 순서대로 호출됩니다. 이는 `removeListener()` 또는 `removeAllListeners()` 호출이 발생 *후* 마지막 리스너 실행 *전*에 발생하면 진행 중인 `emit()`에서 제거되지 않음을 의미합니다. 후속 이벤트는 예상대로 작동합니다.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA는 리스너 callbackB를 제거하지만 여전히 호출됩니다.
// emit 시 내부 리스너 배열 [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB가 이제 제거되었습니다.
// 내부 리스너 배열 [callbackA]
myEmitter.emit('event');
// Prints:
//   A
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA는 리스너 callbackB를 제거하지만 여전히 호출됩니다.
// emit 시 내부 리스너 배열 [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB가 이제 제거되었습니다.
// 내부 리스너 배열 [callbackA]
myEmitter.emit('event');
// Prints:
//   A
```
:::

리스너는 내부 배열을 사용하여 관리되므로 이를 호출하면 제거되는 리스너 *뒤에* 등록된 리스너의 위치 인덱스가 변경됩니다. 이는 리스너가 호출되는 순서에는 영향을 미치지 않지만 `emitter.listeners()` 메서드에서 반환된 리스너 배열의 복사본을 다시 만들어야 함을 의미합니다.

단일 함수가 단일 이벤트에 대해 여러 번 핸들러로 추가된 경우(아래 예와 같이) `removeListener()`는 가장 최근에 추가된 인스턴스를 제거합니다. 이 예에서는 `once('ping')` 리스너가 제거됩니다.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```

```js [CJS]
const EventEmitter = require('node:events');
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```
:::

`EventEmitter`에 대한 참조를 반환하므로 호출을 연결할 수 있습니다.


### `emitter.setMaxListeners(n)` {#emittersetmaxlistenersn}

**추가된 버전: v0.3.5**

- `n` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 반환: [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter)

기본적으로 `EventEmitter`는 특정 이벤트에 대해 `10`개 이상의 리스너가 추가되면 경고를 표시합니다. 이는 메모리 누수를 찾는 데 도움이 되는 유용한 기본값입니다. `emitter.setMaxListeners()` 메서드를 사용하면 이 특정 `EventEmitter` 인스턴스에 대한 제한을 수정할 수 있습니다. 값을 `Infinity` (또는 `0`)로 설정하여 무제한의 리스너를 나타낼 수 있습니다.

`EventEmitter`에 대한 참조를 반환하여 호출을 연결할 수 있습니다.

### `emitter.rawListeners(eventName)` {#emitterrawlistenerseventname}

**추가된 버전: v9.4.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- 반환: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

`.once()`로 생성된 래퍼를 포함하여 `eventName`이라는 이벤트에 대한 리스너 배열의 복사본을 반환합니다.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// 위에서 바인딩된 원래 리스너를 포함하는 `listener` 속성을 가진 함수 `onceWrapper`가 있는 새 배열을 반환합니다.
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// 콘솔에 "log once"를 기록하고 `once` 이벤트를 바인딩 해제하지 않습니다.
logFnWrapper.listener();

// 콘솔에 "log once"를 기록하고 리스너를 제거합니다.
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// 위에서 `.on()`으로 바인딩된 단일 함수가 있는 새 배열을 반환합니다.
const newListeners = emitter.rawListeners('log');

// "log persistently"를 두 번 기록합니다.
newListeners[0]();
emitter.emit('log');
```

```js [CJS]
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// 위에서 바인딩된 원래 리스너를 포함하는 `listener` 속성을 가진 함수 `onceWrapper`가 있는 새 배열을 반환합니다.
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// 콘솔에 "log once"를 기록하고 `once` 이벤트를 바인딩 해제하지 않습니다.
logFnWrapper.listener();

// 콘솔에 "log once"를 기록하고 리스너를 제거합니다.
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// 위에서 `.on()`으로 바인딩된 단일 함수가 있는 새 배열을 반환합니다.
const newListeners = emitter.rawListeners('log');

// "log persistently"를 두 번 기록합니다.
newListeners[0]();
emitter.emit('log');
```
:::


### `emitter[Symbol.for('nodejs.rejection')](err, eventName[, ...args])` {#emittersymbolfornodejsrejectionerr-eventname-args}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v17.4.0, v16.14.0 | 더 이상 실험적이지 않습니다. |
| v13.4.0, v12.16.0 | 추가됨: v13.4.0, v12.16.0 |
:::

- `err` 오류
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`Symbol.for('nodejs.rejection')` 메서드는 이벤트를 발생시키는 동안 Promise 거부가 발생하고 이미터에서 [`captureRejections`](/ko/nodejs/api/events#capture-rejections-of-promises)가 활성화된 경우에 호출됩니다. `Symbol.for('nodejs.rejection')` 대신 [`events.captureRejectionSymbol`](/ko/nodejs/api/events#eventscapturerejectionsymbol)을 사용할 수 있습니다.

::: code-group
```js [ESM]
import { EventEmitter, captureRejectionSymbol } from 'node:events';

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('rejection happened for', event, 'with', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Tear the resource down here.
  }
}
```

```js [CJS]
const { EventEmitter, captureRejectionSymbol } = require('node:events');

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('rejection happened for', event, 'with', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Tear the resource down here.
  }
}
```
:::

## `events.defaultMaxListeners` {#eventsdefaultmaxlisteners}

**추가됨: v0.11.2**

기본적으로 단일 이벤트에 대해 최대 `10`개의 리스너를 등록할 수 있습니다. 이 제한은 [`emitter.setMaxListeners(n)`](/ko/nodejs/api/events#emittersetmaxlistenersn) 메서드를 사용하여 개별 `EventEmitter` 인스턴스에 대해 변경할 수 있습니다. *모든* `EventEmitter` 인스턴스의 기본값을 변경하려면 `events.defaultMaxListeners` 속성을 사용할 수 있습니다. 이 값이 양수가 아니면 `RangeError`가 발생합니다.

`events.defaultMaxListeners`를 설정할 때는 변경 사항이 변경되기 전에 생성된 인스턴스를 포함하여 *모든* `EventEmitter` 인스턴스에 영향을 미치므로 주의하십시오. 그러나 [`emitter.setMaxListeners(n)`](/ko/nodejs/api/events#emittersetmaxlistenersn)을 호출하는 것은 여전히 `events.defaultMaxListeners`보다 우선합니다.

이것은 엄격한 제한이 아닙니다. `EventEmitter` 인스턴스는 더 많은 리스너를 추가할 수 있지만 "가능한 EventEmitter 메모리 누수"가 감지되었음을 나타내는 추적 경고를 stderr로 출력합니다. 단일 `EventEmitter`의 경우 `emitter.getMaxListeners()` 및 `emitter.setMaxListeners()` 메서드를 사용하여 이 경고를 일시적으로 피할 수 있습니다.

`defaultMaxListeners`는 `AbortSignal` 인스턴스에 영향을 주지 않습니다. 여전히 [`emitter.setMaxListeners(n)`](/ko/nodejs/api/events#emittersetmaxlistenersn)을 사용하여 개별 `AbortSignal` 인스턴스에 대한 경고 제한을 설정할 수 있지만 기본적으로 `AbortSignal` 인스턴스는 경고하지 않습니다.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // do stuff
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```

```js [CJS]
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // do stuff
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```
:::

[`--trace-warnings`](/ko/nodejs/api/cli#--trace-warnings) 명령줄 플래그를 사용하여 이러한 경고에 대한 스택 추적을 표시할 수 있습니다.

발생된 경고는 [`process.on('warning')`](/ko/nodejs/api/process#event-warning)을 사용하여 검사할 수 있으며 이벤트 이미터 인스턴스, 이벤트 이름 및 연결된 리스너 수를 나타내는 추가 `emitter`, `type` 및 `count` 속성을 갖습니다. 해당 `name` 속성은 `'MaxListenersExceededWarning'`으로 설정됩니다.


## `events.errorMonitor` {#eventserrormonitor}

**Added in: v13.6.0, v12.17.0**

이 심볼은 오직 `'error'` 이벤트만 모니터링하기 위한 리스너를 설치하는 데 사용됩니다. 이 심볼을 사용하여 설치된 리스너는 일반 `'error'` 리스너가 호출되기 전에 호출됩니다.

이 심볼을 사용하여 리스너를 설치해도 `'error'` 이벤트가 발생한 후 동작이 변경되지 않습니다. 따라서 일반 `'error'` 리스너가 설치되지 않은 경우 프로세스는 계속 충돌합니다.

## `events.getEventListeners(emitterOrTarget, eventName)` {#eventsgeteventlistenersemitterortarget-eventname}

**Added in: v15.2.0, v14.17.0**

- `emitterOrTarget` [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter) | [\<EventTarget\>](/ko/nodejs/api/events#class-eventtarget)
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- Returns: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

`eventName`이라는 이벤트에 대한 리스너 배열의 복사본을 반환합니다.

`EventEmitter`의 경우, 이는 emitter에서 `.listeners`를 호출하는 것과 정확히 동일하게 동작합니다.

`EventTarget`의 경우, 이는 이벤트 타겟에 대한 이벤트 리스너를 가져오는 유일한 방법입니다. 이는 디버깅 및 진단 목적에 유용합니다.

::: code-group
```js [ESM]
import { getEventListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
```

```js [CJS]
const { getEventListeners, EventEmitter } = require('node:events');

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
```
:::


## `events.getMaxListeners(emitterOrTarget)` {#eventsgetmaxlistenersemitterortarget}

**Added in: v19.9.0, v18.17.0**

- `emitterOrTarget` [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter) | [\<EventTarget\>](/ko/nodejs/api/events#class-eventtarget)
- Returns: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

현재 설정된 최대 리스너 수를 반환합니다.

`EventEmitter`의 경우 이는 이벤트를 발생시키는 데서 `.getMaxListeners`를 호출하는 것과 정확히 동일하게 작동합니다.

`EventTarget`의 경우 이는 이벤트 대상에 대한 최대 이벤트 리스너를 가져오는 유일한 방법입니다. 단일 EventTarget의 이벤트 핸들러 수가 설정된 최대값을 초과하면 EventTarget이 경고를 출력합니다.

::: code-group
```js [ESM]
import { getMaxListeners, setMaxListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
```

```js [CJS]
const { getMaxListeners, setMaxListeners, EventEmitter } = require('node:events');

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
```
:::

## `events.once(emitter, name[, options])` {#eventsonceemitter-name-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v15.0.0 | `signal` 옵션이 이제 지원됩니다. |
| v11.13.0, v10.16.0 | Added in: v11.13.0, v10.16.0 |
:::

- `emitter` [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter)
- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 이벤트를 기다리는 것을 취소하는 데 사용할 수 있습니다.
  
 
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

`EventEmitter`가 주어진 이벤트를 발생시키거나 대기하는 동안 `EventEmitter`가 `'error'`를 발생시키면 거부되는 `Promise`를 생성합니다. `Promise`는 주어진 이벤트로 내보내진 모든 인수의 배열로 확인됩니다.

이 메서드는 의도적으로 일반적이며 특수한 `'error'` 이벤트 의미 체계가 없고 `'error'` 이벤트를 수신하지 않는 웹 플랫폼 [EventTarget](https://dom.spec.whatwg.org/#interface-eventtarget) 인터페이스와 함께 작동합니다.

::: code-group
```js [ESM]
import { once, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

process.nextTick(() => {
  ee.emit('myevent', 42);
});

const [value] = await once(ee, 'myevent');
console.log(value);

const err = new Error('kaboom');
process.nextTick(() => {
  ee.emit('error', err);
});

try {
  await once(ee, 'myevent');
} catch (err) {
  console.error('error happened', err);
}
```

```js [CJS]
const { once, EventEmitter } = require('node:events');

async function run() {
  const ee = new EventEmitter();

  process.nextTick(() => {
    ee.emit('myevent', 42);
  });

  const [value] = await once(ee, 'myevent');
  console.log(value);

  const err = new Error('kaboom');
  process.nextTick(() => {
    ee.emit('error', err);
  });

  try {
    await once(ee, 'myevent');
  } catch (err) {
    console.error('error happened', err);
  }
}

run();
```
:::

`'error'` 이벤트의 특별한 처리는 `events.once()`가 다른 이벤트를 기다리는 데 사용되는 경우에만 사용됩니다. `events.once()`가 '`error'` 이벤트 자체를 기다리는 데 사용되는 경우 특별한 처리 없이 다른 종류의 이벤트로 취급됩니다.

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```
:::

[\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal)은 이벤트를 기다리는 것을 취소하는 데 사용할 수 있습니다.

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Prints: Waiting for the event was canceled!
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Prints: Waiting for the event was canceled!
```
:::


### `process.nextTick()`에서 발생한 여러 이벤트 대기 {#awaiting-multiple-events-emitted-on-processnexttick}

`process.nextTick()` 작업의 동일한 배치에서 발생하거나 여러 이벤트가 동기적으로 발생할 때 `events.once()` 함수를 사용하여 여러 이벤트를 대기할 때 주목할 가치가 있는 가장자리 사례가 있습니다. 특히, `process.nextTick()` 큐는 `Promise` 마이크로태스크 큐보다 먼저 비워지고 `EventEmitter`는 모든 이벤트를 동기적으로 발생시키기 때문에 `events.once()`가 이벤트를 놓칠 수 있습니다.

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';
import process from 'node:process';

const myEE = new EventEmitter();

async function foo() {
  await once(myEE, 'bar');
  console.log('bar');

  // 'foo' 이벤트는 Promise가 생성되기 전에 이미 발생했으므로 이 Promise는 절대 해결되지 않습니다.
  await once(myEE, 'foo');
  console.log('foo');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const myEE = new EventEmitter();

async function foo() {
  await once(myEE, 'bar');
  console.log('bar');

  // 'foo' 이벤트는 Promise가 생성되기 전에 이미 발생했으므로 이 Promise는 절대 해결되지 않습니다.
  await once(myEE, 'foo');
  console.log('foo');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```
:::

두 이벤트 모두를 포착하려면 각 Promise를 대기하기 *전에* 생성하면 `Promise.all()`, `Promise.race()` 또는 `Promise.allSettled()`를 사용할 수 있습니다.

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';
import process from 'node:process';

const myEE = new EventEmitter();

async function foo() {
  await Promise.all([once(myEE, 'bar'), once(myEE, 'foo')]);
  console.log('foo', 'bar');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const myEE = new EventEmitter();

async function foo() {
  await Promise.all([once(myEE, 'bar'), once(myEE, 'foo')]);
  console.log('foo', 'bar');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```
:::


## `events.captureRejections` {#eventscapturerejections}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v17.4.0, v16.14.0 | 더 이상 실험적이지 않습니다. |
| v13.4.0, v12.16.0 | 추가됨: v13.4.0, v12.16.0 |
:::

값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

모든 새로운 `EventEmitter` 객체에서 기본 `captureRejections` 옵션을 변경합니다.

## `events.captureRejectionSymbol` {#eventscapturerejectionsymbol}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v17.4.0, v16.14.0 | 더 이상 실험적이지 않습니다. |
| v13.4.0, v12.16.0 | 추가됨: v13.4.0, v12.16.0 |
:::

값: `Symbol.for('nodejs.rejection')`

사용자 정의 [거부 핸들러](/ko/nodejs/api/events#emittersymbolfornodejsrejectionerr-eventname-args)를 작성하는 방법을 참조하십시오.

## `events.listenerCount(emitter, eventName)` {#eventslistenercountemitter-eventname}

**추가됨: v0.9.12**

**다음 버전부터 지원 중단됨: v3.2.0**

::: danger [안정성: 0 - 지원 중단]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 지원 중단: 대신 [`emitter.listenerCount()`](/ko/nodejs/api/events#emitterlistenercounteventname-listener)를 사용하십시오.
:::

- `emitter` [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter) 쿼리할 이미터
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 이벤트 이름

지정된 `emitter`에 등록된 지정된 `eventName`에 대한 리스너 수를 반환하는 클래스 메서드입니다.

::: code-group
```js [ESM]
import { EventEmitter, listenerCount } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Prints: 2
```

```js [CJS]
const { EventEmitter, listenerCount } = require('node:events');

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Prints: 2
```
:::


## `events.on(emitter, eventName[, options])` {#eventsonemitter-eventname-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.0.0, v20.13.0 | 일관성을 위해 `highWaterMark` 및 `lowWaterMark` 옵션 지원. 이전 옵션도 계속 지원됩니다. |
| v20.0.0 | 이제 `close`, `highWatermark` 및 `lowWatermark` 옵션이 지원됩니다. |
| v13.6.0, v12.16.0 | 추가됨: v13.6.0, v12.16.0 |
:::

- `emitter` [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter)
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 수신 대기 중인 이벤트의 이름
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 이벤트를 기다리는 것을 취소하는 데 사용할 수 있습니다.
    - `close` - [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 반복을 종료할 이벤트 이름입니다.
    - `highWaterMark` - [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `Number.MAX_SAFE_INTEGER` 높은 워터마크입니다. 버퍼링되는 이벤트의 크기가 이보다 높을 때마다 이미터가 일시 중지됩니다. `pause()` 및 `resume()` 메서드를 구현하는 이미터에서만 지원됩니다.
    - `lowWaterMark` - [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `1` 낮은 워터마크입니다. 버퍼링되는 이벤트의 크기가 이보다 낮을 때마다 이미터가 다시 시작됩니다. `pause()` 및 `resume()` 메서드를 구현하는 이미터에서만 지원됩니다.


- 반환: `emitter`에서 발생한 `eventName` 이벤트를 반복하는 [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)

::: code-group
```js [ESM]
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

// 나중에 내보내기
process.nextTick(() => {
  ee.emit('foo', 'bar');
  ee.emit('foo', 42);
});

for await (const event of on(ee, 'foo')) {
  // 이 내부 블록의 실행은 동기적이며 한 번에 하나의 이벤트를 처리합니다 (await 사용 시에도).
  // 동시 실행이 필요한 경우에는 사용하지 마십시오.
  console.log(event); // ['bar'] [42] 출력
}
// 여기에는 도달할 수 없습니다.
```

```js [CJS]
const { on, EventEmitter } = require('node:events');

(async () => {
  const ee = new EventEmitter();

  // 나중에 내보내기
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo')) {
    // 이 내부 블록의 실행은 동기적이며 한 번에 하나의 이벤트를 처리합니다 (await 사용 시에도).
    // 동시 실행이 필요한 경우에는 사용하지 마십시오.
    console.log(event); // ['bar'] [42] 출력
  }
  // 여기에는 도달할 수 없습니다.
})();
```
:::

`eventName` 이벤트를 반복하는 `AsyncIterator`를 반환합니다. `EventEmitter`가 `'error'`를 내보내면 예외를 throw합니다. 루프를 종료할 때 모든 리스너를 제거합니다. 각 반복에서 반환되는 `value`는 내보낸 이벤트 인수로 구성된 배열입니다.

[\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal)을 사용하여 이벤트 대기를 취소할 수 있습니다.

::: code-group
```js [ESM]
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // 나중에 내보내기
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // 이 내부 블록의 실행은 동기적이며 한 번에 하나의 이벤트를 처리합니다 (await 사용 시에도).
    // 동시 실행이 필요한 경우에는 사용하지 마십시오.
    console.log(event); // ['bar'] [42] 출력
  }
  // 여기에는 도달할 수 없습니다.
})();

process.nextTick(() => ac.abort());
```

```js [CJS]
const { on, EventEmitter } = require('node:events');

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // 나중에 내보내기
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // 이 내부 블록의 실행은 동기적이며 한 번에 하나의 이벤트를 처리합니다 (await 사용 시에도).
    // 동시 실행이 필요한 경우에는 사용하지 마십시오.
    console.log(event); // ['bar'] [42] 출력
  }
  // 여기에는 도달할 수 없습니다.
})();

process.nextTick(() => ac.abort());
```
:::


## `events.setMaxListeners(n[, ...eventTargets])` {#eventssetmaxlistenersn-eventtargets}

**Added in: v15.4.0**

- `n` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 음수가 아닌 숫자입니다. `EventTarget` 이벤트당 최대 리스너 수입니다.
- `...eventsTargets` [\<EventTarget[]\>](/ko/nodejs/api/events#class-eventtarget) | [\<EventEmitter[]\>](/ko/nodejs/api/events#class-eventemitter) 0개 이상의 [\<EventTarget\>](/ko/nodejs/api/events#class-eventtarget) 또는 [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter) 인스턴스입니다. 지정되지 않은 경우, `n`은 새로 생성된 모든 [\<EventTarget\>](/ko/nodejs/api/events#class-eventtarget) 및 [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter) 객체의 기본 최대값으로 설정됩니다.

::: code-group
```js [ESM]
import { setMaxListeners, EventEmitter } from 'node:events';

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```

```js [CJS]
const {
  setMaxListeners,
  EventEmitter,
} = require('node:events');

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```
:::

## `events.addAbortListener(signal, listener)` {#eventsaddabortlistenersignal-listener}

**Added in: v20.5.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ko/nodejs/api/events#event-listener)
- 반환값: [\<Disposable\>](https://tc39.es/proposal-explicit-resource-management/#sec-disposable-interface) `abort` 리스너를 제거하는 Disposable입니다.

제공된 `signal`에서 `abort` 이벤트를 한 번 리슨합니다.

Abort 신호에서 `abort` 이벤트를 리슨하는 것은 안전하지 않으며 신호를 가진 다른 제3자가 [`e.stopImmediatePropagation()`](/ko/nodejs/api/events#eventstopimmediatepropagation)을 호출할 수 있으므로 리소스 누수로 이어질 수 있습니다. 안타깝게도 Node.js는 웹 표준을 위반하므로 이를 변경할 수 없습니다. 또한 원래 API는 리스너 제거를 잊어버리기 쉽습니다.

이 API를 사용하면 `stopImmediatePropagation`이 리스너 실행을 방지하지 않도록 이벤트를 리슨하여 이러한 두 가지 문제를 해결하여 Node.js API에서 `AbortSignal`을 안전하게 사용할 수 있습니다.

더 쉽게 구독을 취소할 수 있도록 disposable을 반환합니다.

::: code-group
```js [CJS]
const { addAbortListener } = require('node:events');

function example(signal) {
  let disposable;
  try {
    signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
    disposable = addAbortListener(signal, (e) => {
      // Do something when signal is aborted.
    });
  } finally {
    disposable?.[Symbol.dispose]();
  }
}
```

```js [ESM]
import { addAbortListener } from 'node:events';

function example(signal) {
  let disposable;
  try {
    signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
    disposable = addAbortListener(signal, (e) => {
      // Do something when signal is aborted.
    });
  } finally {
    disposable?.[Symbol.dispose]();
  }
}
```
:::


## 클래스: `events.EventEmitterAsyncResource extends EventEmitter` {#class-eventseventemitterasyncresource-extends-eventemitter}

**추가됨: v17.4.0, v16.14.0**

수동 비동기 추적이 필요한 `EventEmitter`에 대해 `EventEmitter`를 [\<AsyncResource\>](/ko/nodejs/api/async_hooks#class-asyncresource)와 통합합니다. 특히, `events.EventEmitterAsyncResource` 인스턴스에서 발생하는 모든 이벤트는 해당 [비동기 컨텍스트](/ko/nodejs/api/async_context) 내에서 실행됩니다.

::: code-group
```js [ESM]
import { EventEmitterAsyncResource, EventEmitter } from 'node:events';
import { notStrictEqual, strictEqual } from 'node:assert';
import { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

// 비동기 추적 도구는 이를 'Q'로 식별합니다.
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// 'foo' 리스너는 EventEmitters 비동기 컨텍스트에서 실행됩니다.
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// 비동기 컨텍스트를 추적하지 않는 일반 EventEmitters의 'foo' 리스너는 emit()과 동일한 비동기 컨텍스트에서 실행됩니다.
ee2.on('foo', () => {
  notStrictEqual(executionAsyncId(), ee2.asyncId);
  notStrictEqual(triggerAsyncId(), ee2.triggerAsyncId);
});

Promise.resolve().then(() => {
  ee1.emit('foo');
  ee2.emit('foo');
});
```

```js [CJS]
const { EventEmitterAsyncResource, EventEmitter } = require('node:events');
const { notStrictEqual, strictEqual } = require('node:assert');
const { executionAsyncId, triggerAsyncId } = require('node:async_hooks');

// 비동기 추적 도구는 이를 'Q'로 식별합니다.
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// 'foo' 리스너는 EventEmitters 비동기 컨텍스트에서 실행됩니다.
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// 비동기 컨텍스트를 추적하지 않는 일반 EventEmitters의 'foo' 리스너는 emit()과 동일한 비동기 컨텍스트에서 실행됩니다.
ee2.on('foo', () => {
  notStrictEqual(executionAsyncId(), ee2.asyncId);
  notStrictEqual(triggerAsyncId(), ee2.triggerAsyncId);
});

Promise.resolve().then(() => {
  ee1.emit('foo');
  ee2.emit('foo');
});
```
:::

`EventEmitterAsyncResource` 클래스는 `EventEmitter` 및 `AsyncResource` 자체와 동일한 메서드를 가지며 동일한 옵션을 사용합니다.


### `new events.EventEmitterAsyncResource([options])` {#new-eventseventemitterasyncresourceoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `captureRejections` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) [프로미스 거부의 자동 캡처](/ko/nodejs/api/events#capture-rejections-of-promises)를 활성화합니다. **기본값:** `false`.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 비동기 이벤트의 유형입니다. **기본값:** [`new.target.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target).
    - `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 비동기 이벤트를 생성한 실행 컨텍스트의 ID입니다. **기본값:** `executionAsyncId()`.
    - `requireManualDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`로 설정되면 객체가 가비지 수집될 때 `emitDestroy`를 비활성화합니다. 리소스의 `asyncId`가 검색되고 민감한 API의 `emitDestroy`가 이를 사용하여 호출되는 경우가 아니라면 일반적으로 이를 설정할 필요가 없습니다(수동으로 `emitDestroy`를 호출하는 경우에도). `false`로 설정하면 가비지 수집 시 `emitDestroy` 호출은 활성 `destroy` 후크가 하나 이상 있는 경우에만 발생합니다. **기본값:** `false`.
  
 

### `eventemitterasyncresource.asyncId` {#eventemitterasyncresourceasyncid}

- 유형: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 리소스에 할당된 고유한 `asyncId`입니다.

### `eventemitterasyncresource.asyncResource` {#eventemitterasyncresourceasyncresource}

- 유형: 기본 [\<AsyncResource\>](/ko/nodejs/api/async_hooks#class-asyncresource)입니다.

반환된 `AsyncResource` 객체에는 이 `EventEmitterAsyncResource`에 대한 참조를 제공하는 추가 `eventEmitter` 속성이 있습니다.

### `eventemitterasyncresource.emitDestroy()` {#eventemitterasyncresourceemitdestroy}

모든 `destroy` 후크를 호출합니다. 이는 한 번만 호출되어야 합니다. 두 번 이상 호출하면 오류가 발생합니다. 이는 **수동으로** 호출해야 합니다. 리소스가 GC에 의해 수집되도록 방치되면 `destroy` 후크가 호출되지 않습니다.


### `eventemitterasyncresource.triggerAsyncId` {#eventemitterasyncresourcetriggerasyncid}

- 유형: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `AsyncResource` 생성자에 전달되는 것과 동일한 `triggerAsyncId`입니다.

## `EventTarget` 및 `Event` API {#eventtarget-and-event-api}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.0.0 | EventTarget 오류 처리 변경. |
| v15.4.0 | 더 이상 실험적이지 않음. |
| v15.0.0 | `EventTarget` 및 `Event` 클래스가 이제 전역으로 사용 가능합니다. |
| v14.5.0 | 추가됨: v14.5.0 |
:::

`EventTarget` 및 `Event` 객체는 일부 Node.js 핵심 API에서 노출되는 [`EventTarget` Web API](https://dom.spec.whatwg.org/#eventtarget)의 Node.js 특정 구현입니다.

```js [ESM]
const target = new EventTarget();

target.addEventListener('foo', (event) => {
  console.log('foo 이벤트 발생!');
});
```
### Node.js `EventTarget` vs. DOM `EventTarget` {#nodejs-eventtarget-vs-dom-eventtarget}

Node.js `EventTarget`과 [`EventTarget` Web API](https://dom.spec.whatwg.org/#eventtarget) 사이에는 두 가지 중요한 차이점이 있습니다.

### `NodeEventTarget` vs. `EventEmitter` {#nodeeventtarget-vs-eventemitter}

`NodeEventTarget` 객체는 특정 상황에서 `EventEmitter`를 밀접하게 *에뮬레이트*할 수 있도록 `EventEmitter` API의 수정된 하위 집합을 구현합니다. `NodeEventTarget`은 `EventEmitter`의 인스턴스가 *아니며* 대부분의 경우 `EventEmitter` 대신 사용할 수 없습니다.

### 이벤트 리스너 {#event-listener}

이벤트 `type`에 대해 등록된 이벤트 리스너는 JavaScript 함수이거나 값이 함수인 `handleEvent` 속성을 가진 객체일 수 있습니다.

두 경우 모두, 핸들러 함수는 `eventTarget.dispatchEvent()` 함수에 전달된 `event` 인수로 호출됩니다.

비동기 함수는 이벤트 리스너로 사용할 수 있습니다. 비동기 핸들러 함수가 거부되면 거부가 캡처되어 [`EventTarget` 오류 처리](/ko/nodejs/api/events#eventtarget-error-handling)에 설명된 대로 처리됩니다.

하나의 핸들러 함수에서 발생한 오류는 다른 핸들러가 호출되는 것을 방지하지 않습니다.

핸들러 함수의 반환 값은 무시됩니다.

핸들러는 항상 추가된 순서대로 호출됩니다.

핸들러 함수는 `event` 객체를 변경할 수 있습니다.

```js [ESM]
function handler1(event) {
  console.log(event.type);  // 'foo' 출력
  event.a = 1;
}

async function handler2(event) {
  console.log(event.type);  // 'foo' 출력
  console.log(event.a);  // 1 출력
}

const handler3 = {
  handleEvent(event) {
    console.log(event.type);  // 'foo' 출력
  },
};

const handler4 = {
  async handleEvent(event) {
    console.log(event.type);  // 'foo' 출력
  },
};

const target = new EventTarget();

target.addEventListener('foo', handler1);
target.addEventListener('foo', handler2);
target.addEventListener('foo', handler3);
target.addEventListener('foo', handler4, { once: true });
```

### `EventTarget` 오류 처리 {#eventtarget-error-handling}

등록된 이벤트 리스너가 예외를 던지거나 (또는 거부하는 Promise를 반환하는 경우) 기본적으로 오류는 `process.nextTick()`에서 처리되지 않은 예외로 처리됩니다. 즉, `EventTarget`의 처리되지 않은 예외는 기본적으로 Node.js 프로세스를 종료합니다.

이벤트 리스너 내에서 예외를 던져도 다른 등록된 핸들러의 호출이 중단되지는 *않습니다*.

`EventTarget`은 `EventEmitter`와 같은 `'error'` 유형 이벤트에 대한 특별한 기본 처리를 구현하지 않습니다.

현재 오류는 `process.on('uncaughtException')`에 도달하기 전에 먼저 `process.on('error')` 이벤트로 전달됩니다. 이 동작은 더 이상 사용되지 않으며 향후 릴리스에서 `EventTarget`을 다른 Node.js API와 정렬하도록 변경됩니다. `process.on('error')` 이벤트에 의존하는 모든 코드는 새로운 동작에 맞춰야 합니다.

### 클래스: `Event` {#class-event}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | `Event` 클래스를 이제 전역 객체를 통해 사용할 수 있습니다. |
| v14.5.0 | 추가됨: v14.5.0 |
:::

`Event` 객체는 [`Event` Web API](https://dom.spec.whatwg.org/#event)의 적용입니다. 인스턴스는 Node.js에서 내부적으로 생성됩니다.

#### `event.bubbles` {#eventbubbles}

**추가됨: v14.5.0**

- 유형: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 항상 `false`를 반환합니다.

이것은 Node.js에서 사용되지 않으며 완전성을 위해 제공됩니다.

#### `event.cancelBubble` {#eventcancelbubble}

**추가됨: v14.5.0**

::: info [안정성: 3 - 레거시]
[안정성: 3](/ko/nodejs/api/documentation#stability-index) [안정성: 3](/ko/nodejs/api/documentation#stability-index) - 레거시: 대신 [`event.stopPropagation()`](/ko/nodejs/api/events#eventstoppropagation)을 사용하세요.
:::

- 유형: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`true`로 설정된 경우 `event.stopPropagation()`의 별칭입니다. 이것은 Node.js에서 사용되지 않으며 완전성을 위해 제공됩니다.

#### `event.cancelable` {#eventcancelable}

**추가됨: v14.5.0**

- 유형: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `cancelable` 옵션으로 이벤트가 생성된 경우 true입니다.


#### `event.composed` {#eventcomposed}

**Added in: v14.5.0**

- Type: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 항상 `false`를 반환합니다.

Node.js에서는 사용되지 않으며 완전성을 위해 제공됩니다.

#### `event.composedPath()` {#eventcomposedpath}

**Added in: v14.5.0**

현재 `EventTarget`을 유일한 항목으로 포함하는 배열을 반환하거나, 이벤트가 디스패치되지 않는 경우 빈 배열을 반환합니다. Node.js에서는 사용되지 않으며 완전성을 위해 제공됩니다.

#### `event.currentTarget` {#eventcurrenttarget}

**Added in: v14.5.0**

- Type: [\<EventTarget\>](/ko/nodejs/api/events#class-eventtarget) 이벤트를 디스패치하는 `EventTarget`입니다.

`event.target`의 별칭입니다.

#### `event.defaultPrevented` {#eventdefaultprevented}

**Added in: v14.5.0**

- Type: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`cancelable`이 `true`이고 `event.preventDefault()`가 호출된 경우 `true`입니다.

#### `event.eventPhase` {#eventeventphase}

**Added in: v14.5.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이벤트가 디스패치되지 않는 동안에는 `0`을 반환하고, 디스패치되는 동안에는 `2`를 반환합니다.

Node.js에서는 사용되지 않으며 완전성을 위해 제공됩니다.

#### `event.initEvent(type[, bubbles[, cancelable]])` {#eventiniteventtype-bubbles-cancelable}

**Added in: v19.5.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/ko/nodejs/api/documentation#stability-index) [Stability: 3](/ko/nodejs/api/documentation#stability-index) - Legacy: WHATWG 사양에서는 더 이상 사용되지 않는 것으로 간주하며 사용자는 전혀 사용해서는 안 됩니다.
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `bubbles` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `cancelable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

이벤트 생성자와 중복되며 `composed`를 설정할 수 없습니다. Node.js에서는 사용되지 않으며 완전성을 위해 제공됩니다.

#### `event.isTrusted` {#eventistrusted}

**Added in: v14.5.0**

- Type: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) `"abort"` 이벤트는 `isTrusted`가 `true`로 설정된 상태로 발생합니다. 다른 모든 경우의 값은 `false`입니다.


#### `event.preventDefault()` {#eventpreventdefault}

**Added in: v14.5.0**

`cancelable`이 `true`인 경우 `defaultPrevented` 속성을 `true`로 설정합니다.

#### `event.returnValue` {#eventreturnvalue}

**Added in: v14.5.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/ko/nodejs/api/documentation#stability-index) [Stability: 3](/ko/nodejs/api/documentation#stability-index) - 레거시: 대신 [`event.defaultPrevented`](/ko/nodejs/api/events#eventdefaultprevented)를 사용하세요.
:::

- Type: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 이벤트가 취소되지 않은 경우 True입니다.

`event.returnValue`의 값은 항상 `event.defaultPrevented`의 반대입니다. 이는 Node.js에서 사용되지 않으며 순전히 완전성을 위해 제공됩니다.

#### `event.srcElement` {#eventsrcelement}

**Added in: v14.5.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/ko/nodejs/api/documentation#stability-index) [Stable: 3](/ko/nodejs/api/documentation#stability-index) - 레거시: 대신 [`event.target`](/ko/nodejs/api/events#eventtarget)을 사용하세요.
:::

- Type: [\<EventTarget\>](/ko/nodejs/api/events#class-eventtarget) 이벤트를 디스패치하는 `EventTarget`입니다.

`event.target`의 별칭입니다.

#### `event.stopImmediatePropagation()` {#eventstopimmediatepropagation}

**Added in: v14.5.0**

현재 이벤트 리스너가 완료된 후 이벤트 리스너의 호출을 중지합니다.

#### `event.stopPropagation()` {#eventstoppropagation}

**Added in: v14.5.0**

이는 Node.js에서 사용되지 않으며 순전히 완전성을 위해 제공됩니다.

#### `event.target` {#eventtarget}

**Added in: v14.5.0**

- Type: [\<EventTarget\>](/ko/nodejs/api/events#class-eventtarget) 이벤트를 디스패치하는 `EventTarget`입니다.

#### `event.timeStamp` {#eventtimestamp}

**Added in: v14.5.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`Event` 객체가 생성된 밀리초 타임스탬프입니다.

#### `event.type` {#eventtype}

**Added in: v14.5.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이벤트 유형 식별자입니다.

### Class: `EventTarget` {#class-eventtarget}

::: info [History]
| Version | Changes |
| --- | --- |
| v15.0.0 | 이제 전역 객체를 통해 `EventTarget` 클래스를 사용할 수 있습니다. |
| v14.5.0 | Added in: v14.5.0 |
:::


#### `eventTarget.addEventListener(type, listener[, options])` {#eventtargetaddeventlistenertype-listener-options}

::: info [기록]
| 버전 | 변경사항 |
|---|---|
| v15.4.0 | `signal` 옵션에 대한 지원을 추가합니다. |
| v14.5.0 | 추가됨: v14.5.0 |
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ko/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `once` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면, 리스너는 처음 호출될 때 자동으로 제거됩니다. **기본값:** `false`.
  - `passive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면, 리스너가 `Event` 객체의 `preventDefault()` 메서드를 호출하지 않을 것이라는 힌트 역할을 합니다. **기본값:** `false`.
  - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Node.js에서 직접 사용되지는 않습니다. API 완전성을 위해 추가되었습니다. **기본값:** `false`.
  - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 지정된 AbortSignal 객체의 `abort()` 메서드가 호출되면 리스너가 제거됩니다.

`type` 이벤트에 대한 새로운 핸들러를 추가합니다. 주어진 `listener`는 `type`과 `capture` 옵션 값 당 한 번만 추가됩니다.

`once` 옵션이 `true`이면, `listener`는 다음에 `type` 이벤트가 디스패치된 후 제거됩니다.

`capture` 옵션은 `EventTarget` 사양에 따라 등록된 이벤트 리스너를 추적하는 것 외에는 Node.js에서 어떤 기능적인 방식으로도 사용되지 않습니다. 특히, `capture` 옵션은 `listener`를 등록할 때 키의 일부로 사용됩니다. 개별 `listener`는 `capture = false`로 한 번, `capture = true`로 한 번 추가될 수 있습니다.

```js [ESM]
function handler(event) {}

const target = new EventTarget();
target.addEventListener('foo', handler, { capture: true });  // 첫 번째
target.addEventListener('foo', handler, { capture: false }); // 두 번째

// 핸들러의 두 번째 인스턴스를 제거합니다.
target.removeEventListener('foo', handler);

// 핸들러의 첫 번째 인스턴스를 제거합니다.
target.removeEventListener('foo', handler, { capture: true });
```

#### `eventTarget.dispatchEvent(event)` {#eventtargetdispatcheventevent}

**Added in: v14.5.0**

- `event` [\<Event\>](/ko/nodejs/api/events#class-event)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 이벤트의 `cancelable` 속성 값이 false이거나 `preventDefault()` 메서드가 호출되지 않은 경우 `true`, 그렇지 않으면 `false`입니다.

`event`를 `event.type`에 대한 핸들러 목록으로 디스패치합니다.

등록된 이벤트 리스너는 등록된 순서대로 동기적으로 호출됩니다.

#### `eventTarget.removeEventListener(type, listener[, options])` {#eventtargetremoveeventlistenertype-listener-options}

**Added in: v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ko/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 

이벤트 `type`에 대한 핸들러 목록에서 `listener`를 제거합니다.

### Class: `CustomEvent` {#class-customevent}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 더 이상 실험적이지 않습니다. |
| v22.1.0, v20.13.0 | CustomEvent가 이제 안정화되었습니다. |
| v19.0.0 | 더 이상 `--experimental-global-customevent` CLI 플래그 뒤에 있지 않습니다. |
| v18.7.0, v16.17.0 | 추가됨: v18.7.0, v16.17.0 |
:::

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

- 확장: [\<Event\>](/ko/nodejs/api/events#class-event)

`CustomEvent` 객체는 [`CustomEvent` Web API](https://dom.spec.whatwg.org/#customevent)의 적응입니다. 인스턴스는 Node.js에 의해 내부적으로 생성됩니다.

#### `event.detail` {#eventdetail}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.1.0, v20.13.0 | CustomEvent가 이제 안정화되었습니다. |
| v18.7.0, v16.17.0 | 추가됨: v18.7.0, v16.17.0 |
:::

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

- 유형: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 초기화할 때 전달된 사용자 지정 데이터를 반환합니다.

읽기 전용.


### 클래스: `NodeEventTarget` {#class-nodeeventtarget}

**추가된 버전: v14.5.0**

- 확장: [\<EventTarget\>](/ko/nodejs/api/events#class-eventtarget)

`NodeEventTarget`은 `EventEmitter` API의 하위 집합을 에뮬레이트하는 Node.js 전용 `EventTarget` 확장입니다.

#### `nodeEventTarget.addListener(type, listener)` {#nodeeventtargetaddlistenertype-listener}

**추가된 버전: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ko/nodejs/api/events#event-listener) 
-  반환: [\<EventTarget\>](/ko/nodejs/api/events#class-eventtarget) `this`

`EventEmitter` API와 동일한 기능을 에뮬레이트하는 `EventTarget` 클래스에 대한 Node.js 전용 확장입니다. `addListener()`와 `addEventListener()`의 유일한 차이점은 `addListener()`가 `EventTarget`에 대한 참조를 반환한다는 것입니다.

#### `nodeEventTarget.emit(type, arg)` {#nodeeventtargetemittype-arg}

**추가된 버전: v15.2.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `arg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `type`에 대해 등록된 이벤트 리스너가 존재하면 `true`, 그렇지 않으면 `false`입니다.

`type`에 대한 핸들러 목록에 `arg`를 디스패치하는 `EventTarget` 클래스에 대한 Node.js 전용 확장입니다.

#### `nodeEventTarget.eventNames()` {#nodeeventtargeteventnames}

**추가된 버전: v14.5.0**

- 반환: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이벤트 리스너가 등록된 이벤트 `type` 이름의 배열을 반환하는 `EventTarget` 클래스에 대한 Node.js 전용 확장입니다.

#### `nodeEventTarget.listenerCount(type)` {#nodeeventtargetlistenercounttype}

**추가된 버전: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
-  반환: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 

`type`에 대해 등록된 이벤트 리스너의 수를 반환하는 `EventTarget` 클래스에 대한 Node.js 전용 확장입니다.


#### `nodeEventTarget.setMaxListeners(n)` {#nodeeventtargetsetmaxlistenersn}

**Added in: v14.5.0**

- `n` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js 특정 `EventTarget` 클래스 확장으로, 최대 이벤트 리스너 수를 `n`으로 설정합니다.

#### `nodeEventTarget.getMaxListeners()` {#nodeeventtargetgetmaxlisteners}

**Added in: v14.5.0**

- 반환값: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js 특정 `EventTarget` 클래스 확장으로, 최대 이벤트 리스너 수를 반환합니다.

#### `nodeEventTarget.off(type, listener[, options])` {#nodeeventtargetofftype-listener-options}

**Added in: v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ko/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)


- 반환값: [\<EventTarget\>](/ko/nodejs/api/events#class-eventtarget) this

Node.js 특정 `eventTarget.removeEventListener()`의 별칭입니다.

#### `nodeEventTarget.on(type, listener)` {#nodeeventtargetontype-listener}

**Added in: v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ko/nodejs/api/events#event-listener)
- 반환값: [\<EventTarget\>](/ko/nodejs/api/events#class-eventtarget) this

Node.js 특정 `eventTarget.addEventListener()`의 별칭입니다.

#### `nodeEventTarget.once(type, listener)` {#nodeeventtargetoncetype-listener}

**Added in: v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ko/nodejs/api/events#event-listener)
- 반환값: [\<EventTarget\>](/ko/nodejs/api/events#class-eventtarget) this

Node.js 특정 `EventTarget` 클래스 확장으로, 주어진 이벤트 `type`에 대해 `once` 리스너를 추가합니다. 이는 `once` 옵션을 `true`로 설정하여 `on`을 호출하는 것과 같습니다.


#### `nodeEventTarget.removeAllListeners([type])` {#nodeeventtargetremovealllistenerstype}

**추가된 버전: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  반환: [\<EventTarget\>](/ko/nodejs/api/events#class-eventtarget) this

Node.js 전용 `EventTarget` 클래스 확장입니다. `type`이 지정되면 `type`에 등록된 모든 리스너를 제거하고, 그렇지 않으면 등록된 모든 리스너를 제거합니다.

#### `nodeEventTarget.removeListener(type, listener[, options])` {#nodeeventtargetremovelistenertype-listener-options}

**추가된 버전: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ko/nodejs/api/events#event-listener)
-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 
-  반환: [\<EventTarget\>](/ko/nodejs/api/events#class-eventtarget) this

주어진 `type`에 대한 `listener`를 제거하는 Node.js 전용 `EventTarget` 클래스 확장입니다. `removeListener()`와 `removeEventListener()`의 유일한 차이점은 `removeListener()`가 `EventTarget`에 대한 참조를 반환한다는 것입니다.

