---
title: Node.js 문서 - 비동기 훅
description: Node.js의 비동기 훅 API를 탐색하세요. 이는 Node.js 애플리케이션에서 비동기 리소스의 수명을 추적하는 방법을 제공합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - 비동기 훅 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 비동기 훅 API를 탐색하세요. 이는 Node.js 애플리케이션에서 비동기 리소스의 수명을 추적하는 방법을 제공합니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - 비동기 훅 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 비동기 훅 API를 탐색하세요. 이는 Node.js 애플리케이션에서 비동기 리소스의 수명을 추적하는 방법을 제공합니다.
---


# 비동기 훅 {#async-hooks}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - 실험적입니다. 가능한 경우 이 API에서 마이그레이션하십시오. [`createHook`](/ko/nodejs/api/async_hooks#async_hookscreatehookcallbacks), [`AsyncHook`](/ko/nodejs/api/async_hooks#class-asynchook) 및 [`executionAsyncResource`](/ko/nodejs/api/async_hooks#async_hooksexecutionasyncresource) API는 사용성 문제, 안전 위험 및 성능 영향을 미치므로 사용하지 않는 것이 좋습니다. 비동기 컨텍스트 추적 사용 사례는 안정적인 [`AsyncLocalStorage`](/ko/nodejs/api/async_context#class-asynclocalstorage) API에서 더 잘 처리됩니다. [`AsyncLocalStorage`](/ko/nodejs/api/async_context#class-asynclocalstorage) 또는 [진단 채널](/ko/nodejs/api/diagnostics_channel)에서 현재 제공하는 진단 데이터로 해결되는 컨텍스트 추적 요구 사항 외에 `createHook`, `AsyncHook` 또는 `executionAsyncResource`에 대한 사용 사례가 있는 경우 [https://github.com/nodejs/node/issues](https://github.com/nodejs/node/issues)에 사용 사례를 설명하는 문제를 열어 더 목적에 맞는 API를 만들 수 있도록 하십시오.
:::

**소스 코드:** [lib/async_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/async_hooks.js)

`async_hooks` API를 사용하지 않는 것이 좋습니다. 대부분의 사용 사례를 다룰 수 있는 다른 API는 다음과 같습니다.

- [`AsyncLocalStorage`](/ko/nodejs/api/async_context#class-asynclocalstorage)는 비동기 컨텍스트를 추적합니다.
- [`process.getActiveResourcesInfo()`](/ko/nodejs/api/process#processgetactiveresourcesinfo)는 활성 리소스를 추적합니다.

`node:async_hooks` 모듈은 비동기 리소스를 추적하는 API를 제공합니다. 다음을 사용하여 액세스할 수 있습니다.

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';
```

```js [CJS]
const async_hooks = require('node:async_hooks');
```
:::

## 용어 {#terminology}

비동기 리소스는 관련된 콜백이 있는 객체를 나타냅니다. 이 콜백은 `net.createServer()`의 `'connection'` 이벤트와 같이 여러 번 호출될 수도 있고 `fs.open()`과 같이 한 번만 호출될 수도 있습니다. 리소스는 콜백이 호출되기 전에 닫힐 수도 있습니다. `AsyncHook`는 이러한 다양한 경우를 명시적으로 구별하지 않지만 리소스라는 추상적 개념으로 나타냅니다.

[`Worker`](/ko/nodejs/api/worker_threads#class-worker)가 사용되는 경우 각 스레드는 독립적인 `async_hooks` 인터페이스를 가지며 각 스레드는 새 비동기 ID 세트를 사용합니다.


## 개요 {#overview}

다음은 공용 API에 대한 간단한 개요입니다.

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';

// 현재 실행 컨텍스트의 ID를 반환합니다.
const eid = async_hooks.executionAsyncId();

// 현재 실행 범위의 콜백을 호출하는 트리거 핸들의 ID를 반환합니다.
const tid = async_hooks.triggerAsyncId();

// 새 AsyncHook 인스턴스를 만듭니다. 이러한 콜백은 모두 선택 사항입니다.
const asyncHook =
    async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// 이 AsyncHook 인스턴스의 콜백이 호출되도록 허용합니다. 이는 생성자를 실행한 후의 암시적
// 작업이 아니며 콜백 실행을 시작하려면 명시적으로 실행해야 합니다.
asyncHook.enable();

// 새 비동기 이벤트에 대한 수신을 비활성화합니다.
asyncHook.disable();

//
// 다음은 createHook()에 전달할 수 있는 콜백입니다.
//

// init()은 객체 생성 중에 호출됩니다. 이 콜백이 실행될 때 리소스 구성이 완료되지 않았을 수 있습니다.
// 따라서 "asyncId"로 참조되는 리소스의 모든 필드가 채워지지 않았을 수 있습니다.
function init(asyncId, type, triggerAsyncId, resource) { }

// before()는 리소스의 콜백이 호출되기 직전에 호출됩니다. 핸들(예: TCPWrap)의 경우 0-N번 호출될 수 있으며,
// 요청(예: FSReqCallback)의 경우 정확히 1번 호출됩니다.
function before(asyncId) { }

// after()는 리소스의 콜백이 완료된 직후에 호출됩니다.
function after(asyncId) { }

// destroy()는 리소스가 소멸될 때 호출됩니다.
function destroy(asyncId) { }

// promiseResolve()는 Promise 생성자에 전달된 resolve() 함수가 호출될 때
// (직접 또는 Promise 해결의 다른 수단을 통해) Promise 리소스에 대해서만 호출됩니다.
function promiseResolve(asyncId) { }
```

```js [CJS]
const async_hooks = require('node:async_hooks');

// 현재 실행 컨텍스트의 ID를 반환합니다.
const eid = async_hooks.executionAsyncId();

// 현재 실행 범위의 콜백을 호출하는 트리거 핸들의 ID를 반환합니다.
const tid = async_hooks.triggerAsyncId();

// 새 AsyncHook 인스턴스를 만듭니다. 이러한 콜백은 모두 선택 사항입니다.
const asyncHook =
    async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// 이 AsyncHook 인스턴스의 콜백이 호출되도록 허용합니다. 이는 생성자를 실행한 후의 암시적
// 작업이 아니며 콜백 실행을 시작하려면 명시적으로 실행해야 합니다.
asyncHook.enable();

// 새 비동기 이벤트에 대한 수신을 비활성화합니다.
asyncHook.disable();

//
// 다음은 createHook()에 전달할 수 있는 콜백입니다.
//

// init()은 객체 생성 중에 호출됩니다. 이 콜백이 실행될 때 리소스 구성이 완료되지 않았을 수 있습니다.
// 따라서 "asyncId"로 참조되는 리소스의 모든 필드가 채워지지 않았을 수 있습니다.
function init(asyncId, type, triggerAsyncId, resource) { }

// before()는 리소스의 콜백이 호출되기 직전에 호출됩니다. 핸들(예: TCPWrap)의 경우 0-N번 호출될 수 있으며,
// 요청(예: FSReqCallback)의 경우 정확히 1번 호출됩니다.
function before(asyncId) { }

// after()는 리소스의 콜백이 완료된 직후에 호출됩니다.
function after(asyncId) { }

// destroy()는 리소스가 소멸될 때 호출됩니다.
function destroy(asyncId) { }

// promiseResolve()는 Promise 생성자에 전달된 resolve() 함수가 호출될 때
// (직접 또는 Promise 해결의 다른 수단을 통해) Promise 리소스에 대해서만 호출됩니다.
function promiseResolve(asyncId) { }
```
:::


## `async_hooks.createHook(callbacks)` {#async_hookscreatehookcallbacks}

**추가된 버전: v8.1.0**

- `callbacks` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 등록할 [Hook 콜백](/ko/nodejs/api/async_hooks#hook-callbacks)
    - `init` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`init` 콜백](/ko/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource).
    - `before` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`before` 콜백](/ko/nodejs/api/async_hooks#beforeasyncid).
    - `after` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`after` 콜백](/ko/nodejs/api/async_hooks#afterasyncid).
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`destroy` 콜백](/ko/nodejs/api/async_hooks#destroyasyncid).
    - `promiseResolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`promiseResolve` 콜백](/ko/nodejs/api/async_hooks#promiseresolveasyncid).
  
 
- 반환: [\<AsyncHook\>](/ko/nodejs/api/async_hooks#async_hookscreatehookcallbacks) 훅을 비활성화하고 활성화하는 데 사용되는 인스턴스

각 비동기 작업의 다양한 수명 주기 이벤트에 대해 호출될 함수를 등록합니다.

리소스 수명 동안 각 비동기 이벤트에 대해 `init()`/`before()`/`after()`/`destroy()` 콜백이 호출됩니다.

모든 콜백은 선택 사항입니다. 예를 들어 리소스 정리만 추적해야 하는 경우 `destroy` 콜백만 전달하면 됩니다. `callbacks`에 전달할 수 있는 모든 함수의 구체적인 내용은 [Hook 콜백](/ko/nodejs/api/async_hooks#hook-callbacks) 섹션에 있습니다.

::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';

const asyncHook = createHook({
  init(asyncId, type, triggerAsyncId, resource) { },
  destroy(asyncId) { },
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');

const asyncHook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) { },
  destroy(asyncId) { },
});
```
:::

콜백은 프로토타입 체인을 통해 상속됩니다.

```js [ESM]
class MyAsyncCallbacks {
  init(asyncId, type, triggerAsyncId, resource) { }
  destroy(asyncId) {}
}

class MyAddedCallbacks extends MyAsyncCallbacks {
  before(asyncId) { }
  after(asyncId) { }
}

const asyncHook = async_hooks.createHook(new MyAddedCallbacks());
```
Promise는 비동기 훅 메커니즘을 통해 수명 주기가 추적되는 비동기 리소스이므로 `init()`, `before()`, `after()`, 및 `destroy()` 콜백은 Promise를 반환하는 비동기 함수 *여서는 안 됩니다*.


### 오류 처리 {#error-handling}

`AsyncHook` 콜백이 예외를 던지면 애플리케이션은 스택 추적을 출력하고 종료됩니다. 종료 경로는 잡히지 않은 예외와 동일하지만 모든 `'uncaughtException'` 리스너가 제거되므로 프로세스가 강제로 종료됩니다. 애플리케이션이 `--abort-on-uncaught-exception`과 함께 실행되지 않는 한 `'exit'` 콜백은 여전히 호출됩니다. 이 경우 스택 추적이 출력되고 애플리케이션이 종료되어 코어 파일이 남습니다.

이러한 오류 처리 동작의 이유는 이러한 콜백이 잠재적으로 휘발성이 강한 객체 수명 주기 지점, 예를 들어 클래스 생성 및 소멸 중에 실행되기 때문입니다. 이 때문에 예외가 의도하지 않은 부작용 없이 정상적인 제어 흐름을 따를 수 있는지 확인하기 위해 포괄적인 분석이 수행되지 않는 한 프로세스를 신속하게 중단하여 향후 의도하지 않은 중단을 방지해야 한다고 간주됩니다. 이는 향후 변경될 수 있습니다.

### `AsyncHook` 콜백에서 출력 {#printing-in-asynchook-callbacks}

콘솔에 출력하는 것은 비동기 작업이므로 `console.log()`는 `AsyncHook` 콜백을 호출합니다. `AsyncHook` 콜백 함수 내에서 `console.log()` 또는 유사한 비동기 작업을 사용하면 무한 재귀가 발생합니다. 디버깅할 때 이 문제를 해결하는 쉬운 방법은 `fs.writeFileSync(file, msg, flag)`와 같은 동기 로깅 작업을 사용하는 것입니다. 이렇게 하면 파일에 출력되고 동기적이므로 `AsyncHook`를 재귀적으로 호출하지 않습니다.

::: code-group
```js [ESM]
import { writeFileSync } from 'node:fs';
import { format } from 'node:util';

function debug(...args) {
  // AsyncHook 콜백 내부에서 디버깅할 때 이와 같은 함수를 사용하십시오.
  writeFileSync('log.out', `${format(...args)}\n`, { flag: 'a' });
}
```

```js [CJS]
const fs = require('node:fs');
const util = require('node:util');

function debug(...args) {
  // AsyncHook 콜백 내부에서 디버깅할 때 이와 같은 함수를 사용하십시오.
  fs.writeFileSync('log.out', `${util.format(...args)}\n`, { flag: 'a' });
}
```
:::

로깅에 비동기 작업이 필요한 경우 `AsyncHook` 자체에서 제공하는 정보를 사용하여 비동기 작업을 유발한 원인을 추적할 수 있습니다. 그런 다음 로깅 자체가 `AsyncHook` 콜백을 호출한 원인인 경우 로깅을 건너뛰어야 합니다. 이렇게 하면 그렇지 않으면 무한 재귀가 중단됩니다.


## 클래스: `AsyncHook` {#class-asynchook}

`AsyncHook` 클래스는 비동기 작업의 수명 주기 이벤트를 추적하기 위한 인터페이스를 제공합니다.

### `asyncHook.enable()` {#asynchookenable}

- 반환: [\<AsyncHook\>](/ko/nodejs/api/async_hooks#async_hookscreatehookcallbacks) `asyncHook`에 대한 참조입니다.

주어진 `AsyncHook` 인스턴스에 대한 콜백을 활성화합니다. 콜백이 제공되지 않으면 활성화는 아무 작업도 수행하지 않습니다.

`AsyncHook` 인스턴스는 기본적으로 비활성화되어 있습니다. `AsyncHook` 인스턴스를 생성 직후에 활성화해야 하는 경우 다음 패턴을 사용할 수 있습니다.

::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';

const hook = createHook(callbacks).enable();
```

```js [CJS]
const async_hooks = require('node:async_hooks');

const hook = async_hooks.createHook(callbacks).enable();
```
:::

### `asyncHook.disable()` {#asynchookdisable}

- 반환: [\<AsyncHook\>](/ko/nodejs/api/async_hooks#async_hookscreatehookcallbacks) `asyncHook`에 대한 참조입니다.

실행될 전역 `AsyncHook` 콜백 풀에서 주어진 `AsyncHook` 인스턴스에 대한 콜백을 비활성화합니다. 후크가 비활성화되면 다시 활성화될 때까지 다시 호출되지 않습니다.

API 일관성을 위해 `disable()`은 `AsyncHook` 인스턴스도 반환합니다.

### 후크 콜백 {#hook-callbacks}

비동기 이벤트 수명 주기의 주요 이벤트는 인스턴스화, 콜백 호출 전/후, 인스턴스가 소멸될 때의 네 가지 영역으로 분류되었습니다.

#### `init(asyncId, type, triggerAsyncId, resource)` {#initasyncid-type-triggerasyncid-resource}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 비동기 리소스에 대한 고유 ID입니다.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 비동기 리소스의 유형입니다.
- `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 비동기 리소스가 생성된 실행 컨텍스트의 비동기 리소스에 대한 고유 ID입니다.
- `resource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 비동기 작업을 나타내는 리소스에 대한 참조로, *destroy* 중에 해제해야 합니다.

비동기 이벤트를 발생시킬 *가능성*이 있는 클래스가 생성될 때 호출됩니다. 이는 인스턴스가 `destroy`가 호출되기 전에 `before`/`after`를 호출해야 함을 *의미하지 않으며* 가능성만 존재함을 의미합니다.

이 동작은 리소스를 열었다가 사용하기 전에 닫는 것과 같이 수행하여 관찰할 수 있습니다. 다음 스니펫은 이를 보여줍니다.

::: code-group
```js [ESM]
import { createServer } from 'node:net';

createServer().listen(function() { this.close(); });
// OR
clearTimeout(setTimeout(() => {}, 10));
```

```js [CJS]
require('node:net').createServer().listen(function() { this.close(); });
// OR
clearTimeout(setTimeout(() => {}, 10));
```
:::

모든 새 리소스에는 현재 Node.js 인스턴스 범위 내에서 고유한 ID가 할당됩니다.


##### `type` {#type}

`type`은 `init`이 호출되도록 만든 리소스의 유형을 식별하는 문자열입니다. 일반적으로 리소스 생성자의 이름에 해당합니다.

Node.js 자체에서 생성된 리소스의 `type`은 모든 Node.js 릴리스에서 변경될 수 있습니다. 유효한 값으로는 `TLSWRAP`, `TCPWRAP`, `TCPSERVERWRAP`, `GETADDRINFOREQWRAP`, `FSREQCALLBACK`, `Microtask` 및 `Timeout`이 있습니다. 전체 목록을 보려면 사용 중인 Node.js 버전의 소스 코드를 검사하십시오.

또한 [`AsyncResource`](/ko/nodejs/api/async_context#class-asyncresource) 사용자는 Node.js 자체와 독립적으로 비동기 리소스를 생성합니다.

`Promise` 인스턴스와 이에 의해 예약된 비동기 작업을 추적하는 데 사용되는 `PROMISE` 리소스 유형도 있습니다.

사용자는 공개 임베더 API를 사용할 때 자신의 `type`을 정의할 수 있습니다.

유형 이름 충돌이 발생할 수 있습니다. 임베더는 후크를 수신할 때 충돌을 방지하기 위해 npm 패키지 이름과 같은 고유한 접두사를 사용하는 것이 좋습니다.

##### `triggerAsyncId` {#triggerasyncid}

`triggerAsyncId`는 새 리소스가 초기화되도록 하고 `init`을 호출하도록 "트리거"한 리소스의 `asyncId`입니다. 이는 리소스가 *언제* 생성되었는지 보여주는 `async_hooks.executionAsyncId()`와는 달리 `triggerAsyncId`는 리소스가 *왜* 생성되었는지 보여줍니다.

다음은 `triggerAsyncId`의 간단한 데모입니다.

::: code-group
```js [ESM]
import { createHook, executionAsyncId } from 'node:async_hooks';
import { stdout } from 'node:process';
import net from 'node:net';
import fs from 'node:fs';

createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = executionAsyncId();
    fs.writeSync(
      stdout.fd,
      `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
}).enable();

net.createServer((conn) => {}).listen(8080);
```

```js [CJS]
const { createHook, executionAsyncId } = require('node:async_hooks');
const { stdout } = require('node:process');
const net = require('node:net';
const fs = require('node:fs');

createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = executionAsyncId();
    fs.writeSync(
      stdout.fd,
      `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
}).enable();

net.createServer((conn) => {}).listen(8080);
```
:::

`nc localhost 8080`으로 서버를 히트할 때의 출력:

```bash [BASH]
TCPSERVERWRAP(5): trigger: 1 execution: 1
TCPWRAP(7): trigger: 5 execution: 0
```
`TCPSERVERWRAP`은 연결을 수신하는 서버입니다.

`TCPWRAP`은 클라이언트로부터의 새 연결입니다. 새 연결이 이루어지면 `TCPWrap` 인스턴스가 즉시 생성됩니다. 이는 모든 JavaScript 스택 외부에서 발생합니다. (`executionAsyncId()`가 `0`이라는 것은 JavaScript 스택이 없는 C++에서 실행되고 있음을 의미합니다.) 해당 정보만으로는 리소스가 생성되도록 만든 측면에서 리소스를 함께 연결할 수 없으므로 `triggerAsyncId`에 새 리소스의 존재에 대한 책임이 있는 리소스를 전파하는 작업이 제공됩니다.


##### `resource` {#resource}

`resource`는 초기화된 실제 비동기 리소스를 나타내는 객체입니다. 객체에 접근하는 API는 리소스 생성자가 지정할 수 있습니다. Node.js 자체에서 생성된 리소스는 내부적이며 언제든지 변경될 수 있습니다. 따라서 이에 대한 API는 지정되지 않습니다.

경우에 따라 리소스 객체는 성능상의 이유로 재사용되므로 `WeakMap`에서 키로 사용하거나 속성을 추가하는 것은 안전하지 않습니다.

##### 비동기 컨텍스트 예제 {#asynchronous-context-example}

컨텍스트 추적 사용 사례는 안정적인 API인 [`AsyncLocalStorage`](/ko/nodejs/api/async_context#class-asynclocalstorage)로 다룹니다. 이 예제는 비동기 훅 작동 방식을 설명할 뿐이지만 [`AsyncLocalStorage`](/ko/nodejs/api/async_context#class-asynclocalstorage)가 이 사용 사례에 더 적합합니다.

다음은 `before` 및 `after` 호출 사이의 `init` 호출에 대한 추가 정보, 특히 `listen()`에 대한 콜백이 어떻게 보이는지에 대한 예입니다. 출력 형식은 호출 컨텍스트를 더 쉽게 볼 수 있도록 약간 더 정교하게 작성되었습니다.

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';
import fs from 'node:fs';
import net from 'node:net';
import { stdout } from 'node:process';
const { fd } = stdout;

let indent = 0;
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    const indentStr = ' '.repeat(indent);
    fs.writeSync(
      fd,
      `${indentStr}${type}(${asyncId}):` +
      ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
  before(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}before:  ${asyncId}\n`);
    indent += 2;
  },
  after(asyncId) {
    indent -= 2;
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}after:  ${asyncId}\n`);
  },
  destroy(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}destroy:  ${asyncId}\n`);
  },
}).enable();

net.createServer(() => {}).listen(8080, () => {
  // Let's wait 10ms before logging the server started.
  setTimeout(() => {
    console.log('>>>', async_hooks.executionAsyncId());
  }, 10);
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');
const fs = require('node:fs');
const net = require('node:net');
const { fd } = process.stdout;

let indent = 0;
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    const indentStr = ' '.repeat(indent);
    fs.writeSync(
      fd,
      `${indentStr}${type}(${asyncId}):` +
      ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
  before(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}before:  ${asyncId}\n`);
    indent += 2;
  },
  after(asyncId) {
    indent -= 2;
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}after:  ${asyncId}\n`);
  },
  destroy(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}destroy:  ${asyncId}\n`);
  },
}).enable();

net.createServer(() => {}).listen(8080, () => {
  // Let's wait 10ms before logging the server started.
  setTimeout(() => {
    console.log('>>>', async_hooks.executionAsyncId());
  }, 10);
});
```
:::

서버만 시작했을 때의 출력:

```bash [BASH]
TCPSERVERWRAP(5): trigger: 1 execution: 1
TickObject(6): trigger: 5 execution: 1
before:  6
  Timeout(7): trigger: 6 execution: 6
after:   6
destroy: 6
before:  7
>>> 7
  TickObject(8): trigger: 7 execution: 7
after:   7
before:  8
after:   8
```
예제에서 볼 수 있듯이 `executionAsyncId()` 및 `execution`은 각각 현재 실행 컨텍스트의 값을 지정합니다. 이는 `before` 및 `after` 호출로 구분됩니다.

`execution`만 사용하여 리소스 할당을 그래프로 나타내면 다음과 같은 결과가 나타납니다.

```bash [BASH]
  root(1)
     ^
     |
TickObject(6)
     ^
     |
 Timeout(7)
```
`TCPSERVERWRAP`은 `console.log()`가 호출된 이유임에도 불구하고 이 그래프의 일부가 아닙니다. 이는 호스트 이름 없이 포트에 바인딩하는 것이 *동기* 작업이지만 완전히 비동기 API를 유지하기 위해 사용자의 콜백이 `process.nextTick()`에 배치되기 때문입니다. 이것이 `TickObject`가 출력에 존재하고 `.listen()` 콜백의 '부모'인 이유입니다.

그래프는 리소스가 *언제* 생성되었는지만 보여주고 *왜* 생성되었는지는 보여주지 않으므로 *왜*를 추적하려면 `triggerAsyncId`를 사용하십시오. 이는 다음 그래프로 나타낼 수 있습니다.

```bash [BASH]
 bootstrap(1)
     |
     ˅
TCPSERVERWRAP(5)
     |
     ˅
 TickObject(6)
     |
     ˅
  Timeout(7)
```

#### `before(asyncId)` {#beforeasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

비동기 작업이 시작되거나 (예: TCP 서버가 새 연결을 수신) 완료될 때 (예: 디스크에 데이터 쓰기) 사용자에게 알리기 위해 콜백이 호출됩니다. `before` 콜백은 해당 콜백이 실행되기 직전에 호출됩니다. `asyncId`는 콜백을 실행하려는 리소스에 할당된 고유 식별자입니다.

`before` 콜백은 0에서 N번 호출됩니다. 비동기 작업이 취소되었거나, 예를 들어 TCP 서버가 연결을 수신하지 않은 경우 `before` 콜백은 일반적으로 0번 호출됩니다. TCP 서버와 같은 영구 비동기 리소스는 일반적으로 `before` 콜백을 여러 번 호출하는 반면 `fs.open()`과 같은 다른 작업은 한 번만 호출합니다.

#### `after(asyncId)` {#afterasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`before`에 지정된 콜백이 완료된 직후에 호출됩니다.

콜백 실행 중에 처리되지 않은 예외가 발생하면 `after`는 `'uncaughtException'` 이벤트가 발생하거나 `domain`의 핸들러가 실행된 *후*에 실행됩니다.

#### `destroy(asyncId)` {#destroyasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`asyncId`에 해당하는 리소스가 삭제된 후에 호출됩니다. 임베더 API `emitDestroy()`에서도 비동기적으로 호출됩니다.

일부 리소스는 정리를 위해 가비지 수집에 의존하므로 `init`에 전달된 `resource` 객체에 대한 참조가 있는 경우 `destroy`가 호출되지 않아 애플리케이션에서 메모리 누수가 발생할 수 있습니다. 리소스가 가비지 수집에 의존하지 않는 경우 이는 문제가 되지 않습니다.

destroy 후크를 사용하면 가비지 수집기를 통해 `Promise` 인스턴스 추적이 활성화되기 때문에 추가 오버헤드가 발생합니다.

#### `promiseResolve(asyncId)` {#promiseresolveasyncid}

**추가된 버전: v8.6.0**

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`Promise` 생성자에 전달된 `resolve` 함수가 호출될 때 (직접 또는 다른 방식으로 프로미스를 해결하는 경우) 호출됩니다.

`resolve()`는 관찰 가능한 동기 작업을 수행하지 않습니다.

`Promise`가 다른 `Promise`의 상태를 가정하여 해결된 경우 이 시점에서 `Promise`가 반드시 이행되거나 거부되는 것은 아닙니다.

```js [ESM]
new Promise((resolve) => resolve(true)).then((a) => {});
```
다음 콜백을 호출합니다.

```text [TEXT]
init for PROMISE with id 5, trigger id: 1
  promise resolve 5      # resolve(true)에 해당
init for PROMISE with id 6, trigger id: 5  # then()에서 반환된 Promise
  before 6               # then() 콜백이 입력됨
  promise resolve 6      # then() 콜백이 반환하여 프로미스를 해결함
  after 6
```

### `async_hooks.executionAsyncResource()` {#async_hooksexecutionasyncresource}

**추가됨: v13.9.0, v12.17.0**

- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 현재 실행을 나타내는 리소스입니다. 리소스 내에 데이터를 저장하는 데 유용합니다.

`executionAsyncResource()`에서 반환된 리소스 객체는 문서화되지 않은 API가 있는 내부 Node.js 핸들 객체인 경우가 가장 많습니다. 객체에서 함수나 속성을 사용하면 애플리케이션이 충돌할 가능성이 높으므로 사용하지 않아야 합니다.

최상위 실행 컨텍스트에서 `executionAsyncResource()`를 사용하면 사용할 핸들 또는 요청 객체가 없으므로 빈 객체가 반환되지만 최상위를 나타내는 객체가 있으면 도움이 될 수 있습니다.

::: code-group
```js [ESM]
import { open } from 'node:fs';
import { executionAsyncId, executionAsyncResource } from 'node:async_hooks';

console.log(executionAsyncId(), executionAsyncResource());  // 1 {}
open(new URL(import.meta.url), 'r', (err, fd) => {
  console.log(executionAsyncId(), executionAsyncResource());  // 7 FSReqWrap
});
```

```js [CJS]
const { open } = require('node:fs');
const { executionAsyncId, executionAsyncResource } = require('node:async_hooks');

console.log(executionAsyncId(), executionAsyncResource());  // 1 {}
open(__filename, 'r', (err, fd) => {
  console.log(executionAsyncId(), executionAsyncResource());  // 7 FSReqWrap
});
```
:::

메타데이터를 저장하기 위해 추적 `Map`을 사용하지 않고 연속 로컬 스토리지를 구현하는 데 사용할 수 있습니다.

::: code-group
```js [ESM]
import { createServer } from 'node:http';
import {
  executionAsyncId,
  executionAsyncResource,
  createHook,
} from 'node:async_hooks';
const sym = Symbol('state'); // 오염을 피하기 위한 개인 심볼

createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = executionAsyncResource();
    if (cr) {
      resource[sym] = cr[sym];
    }
  },
}).enable();

const server = createServer((req, res) => {
  executionAsyncResource()[sym] = { state: req.url };
  setTimeout(function() {
    res.end(JSON.stringify(executionAsyncResource()[sym]));
  }, 100);
}).listen(3000);
```

```js [CJS]
const { createServer } = require('node:http');
const {
  executionAsyncId,
  executionAsyncResource,
  createHook,
} = require('node:async_hooks');
const sym = Symbol('state'); // 오염을 피하기 위한 개인 심볼

createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = executionAsyncResource();
    if (cr) {
      resource[sym] = cr[sym];
    }
  },
}).enable();

const server = createServer((req, res) => {
  executionAsyncResource()[sym] = { state: req.url };
  setTimeout(function() {
    res.end(JSON.stringify(executionAsyncResource()[sym]));
  }, 100);
}).listen(3000);
```
:::


### `async_hooks.executionAsyncId()` {#async_hooksexecutionasyncid}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v8.2.0 | `currentId`에서 이름 변경. |
| v8.1.0 | v8.1.0에 추가됨 |
:::

- 반환: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 현재 실행 컨텍스트의 `asyncId`입니다. 무엇이 호출하는지 추적하는 데 유용합니다.

::: code-group
```js [ESM]
import { executionAsyncId } from 'node:async_hooks';
import fs from 'node:fs';

console.log(executionAsyncId());  // 1 - 부트스트랩
const path = '.';
fs.open(path, 'r', (err, fd) => {
  console.log(executionAsyncId());  // 6 - open()
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');
const fs = require('node:fs');

console.log(async_hooks.executionAsyncId());  // 1 - 부트스트랩
const path = '.';
fs.open(path, 'r', (err, fd) => {
  console.log(async_hooks.executionAsyncId());  // 6 - open()
});
```
:::

`executionAsyncId()`에서 반환된 ID는 인과 관계(이것은 `triggerAsyncId()`에서 다룸)가 아닌 실행 타이밍과 관련이 있습니다.

```js [ESM]
const server = net.createServer((conn) => {
  // 콜백이 서버의 MakeCallback() 실행 범위에서 실행되기 때문에 새로운 연결이 아닌
  // 서버의 ID를 반환합니다.
  async_hooks.executionAsyncId();

}).listen(port, () => {
  // .listen()에 전달된 모든 콜백이 nextTick()에 래핑되었기 때문에
  // TickObject(process.nextTick())의 ID를 반환합니다.
  async_hooks.executionAsyncId();
});
```
기본적으로 Promise 컨텍스트는 정확한 `executionAsyncId`를 얻지 못할 수 있습니다. [프로미스 실행 추적](/ko/nodejs/api/async_hooks#promise-execution-tracking) 섹션을 참조하세요.

### `async_hooks.triggerAsyncId()` {#async_hookstriggerasyncid}

- 반환: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 현재 실행 중인 콜백을 호출하는 데 책임이 있는 리소스의 ID입니다.

```js [ESM]
const server = net.createServer((conn) => {
  // 이 콜백이 호출되도록 야기(또는 트리거)한 리소스는 새로운 연결의 리소스였습니다.
  // 따라서 triggerAsyncId()의 반환 값은 "conn"의 asyncId입니다.
  async_hooks.triggerAsyncId();

}).listen(port, () => {
  // .listen()에 전달된 모든 콜백이 nextTick()에 래핑되었더라도
  // 콜백 자체는 서버의 .listen() 호출이 이루어졌기 때문에 존재합니다.
  // 따라서 반환 값은 서버의 ID입니다.
  async_hooks.triggerAsyncId();
});
```
기본적으로 Promise 컨텍스트는 유효한 `triggerAsyncId`를 얻지 못할 수 있습니다. [프로미스 실행 추적](/ko/nodejs/api/async_hooks#promise-execution-tracking) 섹션을 참조하세요.


### `async_hooks.asyncWrapProviders` {#async_hooksasyncwrapproviders}

**추가된 버전: v17.2.0, v16.14.0**

- 반환: 공급자 유형과 해당하는 숫자 ID의 맵입니다. 이 맵에는 `async_hooks.init()` 이벤트에 의해 발생될 수 있는 모든 이벤트 유형이 포함됩니다.

이 기능은 더 이상 사용되지 않는 `process.binding('async_wrap').Providers`의 사용을 억제합니다. 다음을 참조하십시오: [DEP0111](/ko/nodejs/api/deprecations#dep0111-processbinding)

## Promise 실행 추적 {#promise-execution-tracking}

기본적으로 프로미스 실행에는 V8에서 제공하는 [프로미스 내부 검사 API](https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit)의 상대적으로 비싼 특성 때문에 `asyncId`가 할당되지 않습니다. 즉, 프로미스 또는 `async`/`await`를 사용하는 프로그램은 기본적으로 프로미스 콜백 컨텍스트에 대한 올바른 실행 및 트리거 ID를 얻지 못합니다.

::: code-group
```js [ESM]
import { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 1 tid 0
```

```js [CJS]
const { executionAsyncId, triggerAsyncId } = require('node:async_hooks');

Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 1 tid 0
```
:::

`then()` 콜백은 비동기 홉이 있었음에도 불구하고 외부 범위의 컨텍스트에서 실행되었다고 주장합니다. 또한 `triggerAsyncId` 값은 `0`입니다. 즉, `then()` 콜백이 실행되도록 유발(트리거)한 리소스에 대한 컨텍스트가 누락되었습니다.

`async_hooks.createHook`를 통해 비동기 후크를 설치하면 프로미스 실행 추적이 활성화됩니다.

::: code-group
```js [ESM]
import { createHook, executionAsyncId, triggerAsyncId } from 'node:async_hooks';
createHook({ init() {} }).enable(); // PromiseHooks를 강제로 활성화합니다.
Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 7 tid 6
```

```js [CJS]
const { createHook, executionAsyncId, triggerAsyncId } from 'node:async_hooks';

createHook({ init() {} }).enable(); // PromiseHooks를 강제로 활성화합니다.
Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 7 tid 6
```
:::

이 예제에서는 실제 후크 함수를 추가하면 프로미스 추적이 활성화되었습니다. 위의 예제에는 두 개의 프로미스가 있습니다. `Promise.resolve()`에 의해 생성된 프로미스와 `then()` 호출에 의해 반환된 프로미스입니다. 위 예제에서 첫 번째 프로미스는 `asyncId` `6`을 얻었고 후자는 `asyncId` `7`을 얻었습니다. `then()` 콜백이 실행되는 동안 `asyncId` `7`을 가진 프로미스의 컨텍스트에서 실행됩니다. 이 프로미스는 비동기 리소스 `6`에 의해 트리거되었습니다.

프로미스의 또 다른 미묘한 점은 `before` 및 `after` 콜백이 체인된 프로미스에서만 실행된다는 것입니다. 즉, `then()`/`catch()`에 의해 생성되지 않은 프로미스에는 `before` 및 `after` 콜백이 실행되지 않습니다. 자세한 내용은 V8 [PromiseHooks](https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit) API의 세부 정보를 참조하십시오.


## JavaScript 임베더 API {#javascript-embedder-api}

I/O, 연결 풀링, 또는 콜백 큐 관리와 같은 작업을 수행하는 자체 비동기 리소스를 처리하는 라이브러리 개발자는 모든 적절한 콜백이 호출되도록 `AsyncResource` JavaScript API를 사용할 수 있습니다.

### 클래스: `AsyncResource` {#class-asyncresource}

이 클래스에 대한 문서는 [`AsyncResource`](/ko/nodejs/api/async_context#class-asyncresource)로 이동되었습니다.

## 클래스: `AsyncLocalStorage` {#class-asynclocalstorage}

이 클래스에 대한 문서는 [`AsyncLocalStorage`](/ko/nodejs/api/async_context#class-asynclocalstorage)로 이동되었습니다.

