---
title: Node.js 프로세스 API 문서
description: Node.js 프로세스 모듈에 대한 상세한 문서로, 프로세스 관리, 환경 변수, 신호 등을 다룹니다.
head:
  - - meta
    - name: og:title
      content: Node.js 프로세스 API 문서 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 프로세스 모듈에 대한 상세한 문서로, 프로세스 관리, 환경 변수, 신호 등을 다룹니다.
  - - meta
    - name: twitter:title
      content: Node.js 프로세스 API 문서 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 프로세스 모듈에 대한 상세한 문서로, 프로세스 관리, 환경 변수, 신호 등을 다룹니다.
---


# 프로세스 {#process}

**소스 코드:** [lib/process.js](https://github.com/nodejs/node/blob/v23.5.0/lib/process.js)

`process` 객체는 현재 Node.js 프로세스에 대한 정보와 제어를 제공합니다.

::: code-group
```js [ESM]
import process from 'node:process';
```

```js [CJS]
const process = require('node:process');
```
:::

## 프로세스 이벤트 {#process-events}

`process` 객체는 [`EventEmitter`](/ko/nodejs/api/events#class-eventemitter)의 인스턴스입니다.

### 이벤트: `'beforeExit'` {#event-beforeexit}

**추가된 버전: v0.11.12**

`'beforeExit'` 이벤트는 Node.js가 이벤트 루프를 비우고 예약할 추가 작업이 없을 때 발생합니다. 일반적으로 Node.js 프로세스는 예약된 작업이 없으면 종료되지만, `'beforeExit'` 이벤트에 등록된 리스너는 비동기 호출을 수행하여 Node.js 프로세스가 계속되도록 할 수 있습니다.

리스너 콜백 함수는 [`process.exitCode`](/ko/nodejs/api/process#processexitcode_1)의 값이 유일한 인수로 전달되어 호출됩니다.

`'beforeExit'` 이벤트는 [`process.exit()`](/ko/nodejs/api/process#processexitcode) 호출 또는 잡히지 않은 예외와 같이 명시적인 종료를 유발하는 조건에서는 발생하지 *않습니다*.

`'beforeExit'`는 추가 작업을 예약하려는 의도가 없는 한 `'exit'` 이벤트의 대안으로 사용해서는 *안 됩니다*.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});

console.log('This message is displayed first.');

// Prints:
// This message is displayed first.
// Process beforeExit event with code: 0
// Process exit event with code: 0
```

```js [CJS]
const process = require('node:process');

process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});

console.log('This message is displayed first.');

// Prints:
// This message is displayed first.
// Process beforeExit event with code: 0
// Process exit event with code: 0
```
:::


### 이벤트: `'disconnect'` {#event-disconnect}

**추가된 버전: v0.7.7**

Node.js 프로세스가 IPC 채널과 함께 스폰된 경우 ( [Child Process](/ko/nodejs/api/child_process) 및 [Cluster](/ko/nodejs/api/cluster) 문서 참조), IPC 채널이 닫힐 때 `'disconnect'` 이벤트가 발생합니다.

### 이벤트: `'exit'` {#event-exit}

**추가된 버전: v0.1.7**

- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`'exit'` 이벤트는 다음 중 하나의 결과로 Node.js 프로세스가 종료될 때 발생합니다.

- `process.exit()` 메서드가 명시적으로 호출된 경우;
- Node.js 이벤트 루프가 더 이상 수행할 추가 작업이 없는 경우.

이 시점에서 이벤트 루프의 종료를 막을 방법은 없으며, 모든 `'exit'` 리스너가 실행을 완료하면 Node.js 프로세스가 종료됩니다.

리스너 콜백 함수는 [`process.exitCode`](/ko/nodejs/api/process#processexitcode_1) 속성 또는 [`process.exit()`](/ko/nodejs/api/process#processexitcode) 메서드에 전달된 `exitCode` 인수로 지정된 종료 코드로 호출됩니다.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
```

```js [CJS]
const process = require('node:process');

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
```
:::

리스너 함수는 **반드시** **동기** 작업만 수행해야 합니다. Node.js 프로세스는 `'exit'` 이벤트 리스너를 호출한 직후에 종료되어 이벤트 루프에 여전히 대기 중인 추가 작업을 포기하게 됩니다. 예를 들어 다음 예제에서는 타임아웃이 발생하지 않습니다.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('exit', (code) => {
  setTimeout(() => {
    console.log('This will not run');
  }, 0);
});
```

```js [CJS]
const process = require('node:process');

process.on('exit', (code) => {
  setTimeout(() => {
    console.log('This will not run');
  }, 0);
});
```
:::


### Event: `'message'` {#event-message}

**추가된 버전: v0.5.10**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 구문 분석된 JSON 객체 또는 직렬화 가능한 원시 값.
- `sendHandle` [\<net.Server\>](/ko/nodejs/api/net#class-netserver) | [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) [`net.Server`](/ko/nodejs/api/net#class-netserver) 또는 [`net.Socket`](/ko/nodejs/api/net#class-netsocket) 객체 또는 정의되지 않음.

Node.js 프로세스가 IPC 채널과 함께 생성된 경우 ([자식 프로세스](/ko/nodejs/api/child_process) 및 [클러스터](/ko/nodejs/api/cluster) 문서 참조), `'message'` 이벤트는 [`childprocess.send()`](/ko/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback)를 사용하여 부모 프로세스에서 보낸 메시지가 자식 프로세스에 의해 수신될 때마다 발생합니다.

메시지는 직렬화 및 구문 분석을 거칩니다. 결과 메시지는 원래 보낸 메시지와 동일하지 않을 수 있습니다.

프로세스를 생성할 때 `serialization` 옵션이 `advanced`로 설정된 경우 `message` 인수는 JSON이 나타낼 수 없는 데이터를 포함할 수 있습니다. 자세한 내용은 [`child_process`에 대한 고급 직렬화](/ko/nodejs/api/child_process#advanced-serialization)를 참조하십시오.

### Event: `'multipleResolves'` {#event-multipleresolves}

**추가된 버전: v10.12.0**

**지원 중단된 버전: v17.6.0, v16.15.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ko/nodejs/api/documentation#stability-index) [Stability: 0](/ko/nodejs/api/documentation#stability-index) - 지원 중단됨
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 확인 유형. `'resolve'` 또는 `'reject'` 중 하나입니다.
- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 두 번 이상 확인되거나 거부된 프로미스입니다.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 원래 확인 후 프로미스가 확인되거나 거부된 값입니다.

`'multipleResolves'` 이벤트는 `Promise`가 다음 중 하나일 때마다 발생합니다.

- 두 번 이상 확인됨.
- 두 번 이상 거부됨.
- 확인 후 거부됨.
- 거부 후 확인됨.

이는 다중 확인이 자동으로 무시되므로 `Promise` 생성자를 사용하는 동안 애플리케이션의 잠재적인 오류를 추적하는 데 유용합니다. 그러나 이 이벤트의 발생이 반드시 오류를 나타내는 것은 아닙니다. 예를 들어, [`Promise.race()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)는 `'multipleResolves'` 이벤트를 트리거할 수 있습니다.

위의 [`Promise.race()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) 예와 같은 경우 이벤트의 신뢰성이 떨어지기 때문에 지원이 중단되었습니다.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('multipleResolves', (type, promise, reason) => {
  console.error(type, promise, reason);
  setImmediate(() => process.exit(1));
});

async function main() {
  try {
    return await new Promise((resolve, reject) => {
      resolve('First call');
      resolve('Swallowed resolve');
      reject(new Error('Swallowed reject'));
    });
  } catch {
    throw new Error('Failed');
  }
}

main().then(console.log);
// resolve: Promise { 'First call' } 'Swallowed resolve'
// reject: Promise { 'First call' } Error: Swallowed reject
//     at Promise (*)
//     at new Promise (<anonymous>)
//     at main (*)
// First call
```

```js [CJS]
const process = require('node:process');

process.on('multipleResolves', (type, promise, reason) => {
  console.error(type, promise, reason);
  setImmediate(() => process.exit(1));
});

async function main() {
  try {
    return await new Promise((resolve, reject) => {
      resolve('First call');
      resolve('Swallowed resolve');
      reject(new Error('Swallowed reject'));
    });
  } catch {
    throw new Error('Failed');
  }
}

main().then(console.log);
// resolve: Promise { 'First call' } 'Swallowed resolve'
// reject: Promise { 'First call' } Error: Swallowed reject
//     at Promise (*)
//     at new Promise (<anonymous>)
//     at main (*)
// First call
```
:::


### 이벤트: `'rejectionHandled'` {#event-rejectionhandled}

**추가된 버전: v1.4.1**

- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 늦게 처리된 프로미스.

`'rejectionHandled'` 이벤트는 `Promise`가 거부되었고 Node.js 이벤트 루프의 한 턴보다 늦게 (예를 들어 [`promise.catch()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)를 사용하여) 오류 처리기가 연결될 때마다 발생합니다.

`Promise` 객체는 이전에 `'unhandledRejection'` 이벤트에서 발생했지만 처리 과정에서 거부 처리기를 얻었습니다.

거부가 항상 처리될 수 있는 `Promise` 체인의 최상위 레벨이라는 개념은 없습니다. 본질적으로 비동기적이기 때문에 `Promise` 거부는 미래 시점에서, 아마도 `'unhandledRejection'` 이벤트가 발생하는 이벤트 루프 턴보다 훨씬 나중에 처리될 수 있습니다.

이를 다르게 표현하면, 처리되지 않은 예외 목록이 계속 증가하는 동기 코드와 달리 Promise는 처리되지 않은 거부 목록이 증가했다가 줄어들 수 있습니다.

동기 코드에서는 처리되지 않은 예외 목록이 증가하면 `'uncaughtException'` 이벤트가 발생합니다.

비동기 코드에서는 처리되지 않은 거부 목록이 증가하면 `'unhandledRejection'` 이벤트가 발생하고, 처리되지 않은 거부 목록이 줄어들면 `'rejectionHandled'` 이벤트가 발생합니다.

::: code-group
```js [ESM]
import process from 'node:process';

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});
```

```js [CJS]
const process = require('node:process');

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});
```
:::

이 예제에서 `unhandledRejections` `Map`은 시간이 지남에 따라 증가하고 감소하며 처리되지 않은 상태로 시작했다가 처리되는 거부를 반영합니다. 이러한 오류를 오류 로그에 주기적으로 (장기 실행 애플리케이션에 가장 적합할 수 있음) 또는 프로세스 종료 시 (스크립트에 가장 편리할 수 있음) 기록할 수 있습니다.


### 이벤트: `'workerMessage'` {#event-workermessage}

**다음 버전에서 추가됨: v22.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) [`postMessageToThread()`](/ko/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout)를 사용하여 전송된 값입니다.
- `source` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 전송하는 워커 스레드 ID이거나 메인 스레드의 경우 `0`입니다.

`'workerMessage'` 이벤트는 [`postMessageToThread()`](/ko/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout)를 사용하여 상대방이 보낸 모든 수신 메시지에 대해 발생합니다.

### 이벤트: `'uncaughtException'` {#event-uncaughtexception}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.0.0, v10.17.0 | `origin` 인수가 추가되었습니다. |
| v0.1.18 | 다음 버전에서 추가됨: v0.1.18 |
:::

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 잡히지 않은 예외입니다.
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 예외가 처리되지 않은 거부 또는 동기식 오류에서 발생하는지 여부를 나타냅니다. `'uncaughtException'` 또는 `'unhandledRejection'`일 수 있습니다. 후자는 `Promise` 기반 비동기 컨텍스트에서 예외가 발생하거나 (`Promise`가 거부된 경우) [`--unhandled-rejections`](/ko/nodejs/api/cli#--unhandled-rejectionsmode) 플래그가 `strict` 또는 `throw`(기본값)로 설정되고 거부가 처리되지 않았거나 명령줄 진입점의 ES 모듈 정적 로딩 단계에서 거부가 발생할 때 사용됩니다.

`'uncaughtException'` 이벤트는 잡히지 않은 JavaScript 예외가 이벤트 루프까지 버블링될 때 발생합니다. 기본적으로 Node.js는 이러한 예외를 처리하기 위해 스택 추적을 `stderr`에 출력하고 이전에 설정된 [`process.exitCode`](/ko/nodejs/api/process#processexitcode_1)를 덮어쓰면서 코드 1로 종료합니다. `'uncaughtException'` 이벤트에 대한 처리기를 추가하면 이 기본 동작이 덮어쓰여집니다. 또는 `'uncaughtException'` 처리기에서 [`process.exitCode`](/ko/nodejs/api/process#processexitcode_1)를 변경하면 프로세스가 제공된 종료 코드로 종료됩니다. 그렇지 않으면 이러한 처리기가 있는 경우 프로세스는 0으로 종료됩니다.

::: code-group
```js [ESM]
import process from 'node:process';
import fs from 'node:fs';

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}\n`,
  );
});

setTimeout(() => {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('This will not run.');
```

```js [CJS]
const process = require('node:process');
const fs = require('node:fs');

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}\n`,
  );
});

setTimeout(() => {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('This will not run.');
```
:::

`'uncaughtExceptionMonitor'` 리스너를 설치하여 프로세스 종료의 기본 동작을 덮어쓰지 않고 `'uncaughtException'` 이벤트를 모니터링할 수 있습니다.


#### 경고: `'uncaughtException'` 올바르게 사용하기 {#warning-using-uncaughtexception-correctly}

`'uncaughtException'`은 예외 처리를 위한 조잡한 메커니즘으로 최후의 수단으로만 사용해야 합니다. 이 이벤트는 `On Error Resume Next`와 동일한 것으로 *사용해서는 안 됩니다*. 처리되지 않은 예외는 본질적으로 애플리케이션이 정의되지 않은 상태에 있음을 의미합니다. 예외에서 적절하게 복구하지 않고 애플리케이션 코드를 재개하려고 하면 추가적인 예측 불가능한 문제가 발생할 수 있습니다.

이벤트 핸들러 내에서 발생하는 예외는 잡히지 않습니다. 대신 프로세스는 0이 아닌 종료 코드로 종료되고 스택 추적이 출력됩니다. 이는 무한 재귀를 방지하기 위함입니다.

처리되지 않은 예외 후 정상적으로 재개하려고 시도하는 것은 컴퓨터를 업그레이드할 때 전원 코드를 뽑는 것과 유사할 수 있습니다. 열 번 중 아홉 번은 아무 일도 일어나지 않습니다. 그러나 열 번째에는 시스템이 손상됩니다.

`'uncaughtException'`의 올바른 사용법은 프로세스를 종료하기 전에 할당된 리소스(예: 파일 설명자, 핸들 등)를 동기적으로 정리하는 것입니다. **<code>'uncaughtException'</code> 이후에 정상적인 작동을 재개하는 것은 안전하지 않습니다.**

`'uncaughtException'`이 발생하든 발생하지 않든, 충돌된 애플리케이션을 보다 안정적인 방법으로 다시 시작하려면 별도의 프로세스에서 외부 모니터를 사용하여 애플리케이션 오류를 감지하고 필요에 따라 복구하거나 다시 시작해야 합니다.

### 이벤트: `'uncaughtExceptionMonitor'` {#event-uncaughtexceptionmonitor}

**다음 버전에서 추가됨: v13.7.0, v12.17.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 잡히지 않은 예외.
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 예외가 처리되지 않은 거부에서 발생했는지 아니면 동기식 오류에서 발생했는지 나타냅니다. `'uncaughtException'` 또는 `'unhandledRejection'`일 수 있습니다. 후자는 `Promise` 기반 비동기 컨텍스트에서 예외가 발생하거나 (`Promise`가 거부된 경우) [`--unhandled-rejections`](/ko/nodejs/api/cli#--unhandled-rejectionsmode) 플래그가 `strict` 또는 `throw`(기본값)로 설정되고 거부가 처리되지 않거나 명령줄 진입점의 ES 모듈 정적 로딩 단계 중에 거부가 발생하는 경우에 사용됩니다.

`'uncaughtExceptionMonitor'` 이벤트는 `'uncaughtException'` 이벤트가 발생하거나 [`process.setUncaughtExceptionCaptureCallback()`](/ko/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn)을 통해 설치된 훅이 호출되기 전에 발생합니다.

`'uncaughtExceptionMonitor'` 리스너를 설치해도 `'uncaughtException'` 이벤트가 발생한 후의 동작은 변경되지 않습니다. `'uncaughtException'` 리스너가 설치되지 않으면 프로세스가 여전히 충돌합니다.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('uncaughtExceptionMonitor', (err, origin) => {
  MyMonitoringTool.logSync(err, origin);
});

// 의도적으로 예외를 발생시키지만 잡지 않습니다.
nonexistentFunc();
// 여전히 Node.js가 충돌합니다.
```

```js [CJS]
const process = require('node:process');

process.on('uncaughtExceptionMonitor', (err, origin) => {
  MyMonitoringTool.logSync(err, origin);
});

// 의도적으로 예외를 발생시키지만 잡지 않습니다.
nonexistentFunc();
// 여전히 Node.js가 충돌합니다.
```
:::


### 이벤트: `'unhandledRejection'` {#event-unhandledrejection}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v7.0.0 | `Promise` 거부를 처리하지 않는 것은 더 이상 사용되지 않습니다. |
| v6.6.0 | 처리되지 않은 `Promise` 거부는 이제 프로세스 경고를 발생시킵니다. |
| v1.4.1 | 추가됨: v1.4.1 |
:::

- `reason` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 프로미스가 거부된 객체(일반적으로 [`Error`](/ko/nodejs/api/errors#class-error) 객체).
- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 거부된 프로미스.

`'unhandledRejection'` 이벤트는 `Promise`가 거부되고 이벤트 루프의 턴 내에 프로미스에 오류 핸들러가 연결되지 않을 때마다 발생합니다. Promises로 프로그래밍할 때 예외는 "거부된 프로미스"로 캡슐화됩니다. 거부는 [`promise.catch()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)를 사용하여 catch 및 처리할 수 있으며 `Promise` 체인을 통해 전파됩니다. `'unhandledRejection'` 이벤트는 거부가 아직 처리되지 않은 거부된 프로미스를 감지하고 추적하는 데 유용합니다.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // 애플리케이션 특정 로깅, 오류 발생 또는 기타 로직
});

somePromise.then((res) => {
  return reportToUser(JSON.pasre(res)); // 오타 (`pasre`)에 유의하십시오.
}); // `.catch()` 또는 `.then()` 없음
```

```js [CJS]
const process = require('node:process');

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // 애플리케이션 특정 로깅, 오류 발생 또는 기타 로직
});

somePromise.then((res) => {
  return reportToUser(JSON.pasre(res)); // 오타 (`pasre`)에 유의하십시오.
}); // `.catch()` 또는 `.then()` 없음
```
:::

다음은 또한 `'unhandledRejection'` 이벤트가 발생하도록 트리거합니다.

::: code-group
```js [ESM]
import process from 'node:process';

function SomeResource() {
  // 처음에는 로드된 상태를 거부된 프로미스로 설정합니다.
  this.loaded = Promise.reject(new Error('Resource not yet loaded!'));
}

const resource = new SomeResource();
// 적어도 한 턴 동안 resource.loaded에 .catch 또는 .then 없음
```

```js [CJS]
const process = require('node:process');

function SomeResource() {
  // 처음에는 로드된 상태를 거부된 프로미스로 설정합니다.
  this.loaded = Promise.reject(new Error('Resource not yet loaded!'));
}

const resource = new SomeResource();
// 적어도 한 턴 동안 resource.loaded에 .catch 또는 .then 없음
```
:::

이 예제에서는 다른 `'unhandledRejection'` 이벤트의 경우와 마찬가지로 개발자 오류로 거부를 추적할 수 있습니다. 이러한 오류를 해결하기 위해 비 작동 [`.catch(() =\> { })`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) 핸들러를 `resource.loaded`에 연결하여 `'unhandledRejection'` 이벤트가 발생하지 않도록 할 수 있습니다.


### 이벤트: `'warning'` {#event-warning}

**추가된 버전: v6.0.0**

- `warning` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 경고의 주요 속성은 다음과 같습니다:
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 경고의 이름. **기본값:** `'Warning'`.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 시스템에서 제공하는 경고 설명.
    - `stack` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 경고가 발생한 코드 위치에 대한 스택 추적.
  
 

`'warning'` 이벤트는 Node.js가 프로세스 경고를 발생시킬 때마다 발생합니다.

프로세스 경고는 사용자에게 알리는 예외적인 조건을 설명한다는 점에서 오류와 유사합니다. 그러나 경고는 일반적인 Node.js 및 JavaScript 오류 처리 흐름의 일부가 아닙니다. Node.js는 최적이 아닌 애플리케이션 성능, 버그 또는 보안 취약점으로 이어질 수 있는 잘못된 코딩 관행을 감지할 때마다 경고를 발생시킬 수 있습니다.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);    // 경고 이름 출력
  console.warn(warning.message); // 경고 메시지 출력
  console.warn(warning.stack);   // 스택 추적 출력
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);    // 경고 이름 출력
  console.warn(warning.message); // 경고 메시지 출력
  console.warn(warning.stack);   // 스택 추적 출력
});
```
:::

기본적으로 Node.js는 프로세스 경고를 `stderr`에 출력합니다. `--no-warnings` 명령줄 옵션을 사용하여 기본 콘솔 출력을 억제할 수 있지만 `'warning'` 이벤트는 여전히 `process` 객체에 의해 발생합니다. 현재는 더 이상 사용되지 않는 경고 이외의 특정 경고 유형을 억제할 수 없습니다. 더 이상 사용되지 않는 경고를 억제하려면 [`--no-deprecation`](/ko/nodejs/api/cli#--no-deprecation) 플래그를 확인하십시오.

다음 예제는 이벤트에 너무 많은 리스너가 추가되었을 때 `stderr`에 출력되는 경고를 보여줍니다.

```bash [BASH]
$ node
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> (node:38638) MaxListenersExceededWarning: Possible EventEmitter memory leak
detected. 2 foo listeners added. Use emitter.setMaxListeners() to increase limit
```
대조적으로, 다음 예제는 기본 경고 출력을 끄고 `'warning'` 이벤트에 대한 사용자 정의 핸들러를 추가합니다.

```bash [BASH]
$ node --no-warnings
> const p = process.on('warning', (warning) => console.warn('Do not do that!'));
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> Do not do that!
```
`--trace-warnings` 명령줄 옵션을 사용하여 경고에 대한 기본 콘솔 출력에 경고의 전체 스택 추적을 포함할 수 있습니다.

`--throw-deprecation` 명령줄 플래그를 사용하여 Node.js를 시작하면 사용자 정의 더 이상 사용되지 않는 경고가 예외로 발생합니다.

`--trace-deprecation` 명령줄 플래그를 사용하면 사용자 정의 폐기가 스택 추적과 함께 `stderr`에 출력됩니다.

`--no-deprecation` 명령줄 플래그를 사용하면 사용자 정의 폐기의 모든 보고가 억제됩니다.

`*-deprecation` 명령줄 플래그는 `'DeprecationWarning'` 이름을 사용하는 경고에만 영향을 줍니다.


#### 사용자 지정 경고 발생 {#emitting-custom-warnings}

사용자 지정 또는 애플리케이션 관련 경고를 발행하려면 [`process.emitWarning()`](/ko/nodejs/api/process#processemitwarningwarning-type-code-ctor) 메서드를 참조하세요.

#### Node.js 경고 이름 {#nodejs-warning-names}

Node.js에서 발행하는 경고 유형(`name` 속성으로 식별됨)에 대한 엄격한 지침은 없습니다. 새로운 유형의 경고는 언제든지 추가될 수 있습니다. 가장 일반적인 경고 유형은 다음과 같습니다.

- `'DeprecationWarning'` - 더 이상 사용되지 않는 Node.js API 또는 기능의 사용을 나타냅니다. 이러한 경고에는 [더 이상 사용되지 않는 코드](/ko/nodejs/api/deprecations)를 식별하는 `'code'` 속성이 포함되어야 합니다.
- `'ExperimentalWarning'` - 실험적인 Node.js API 또는 기능의 사용을 나타냅니다. 이러한 기능은 언제든지 변경될 수 있으며 지원되는 기능과 동일한 엄격한 의미론적 버전 관리 및 장기 지원 정책이 적용되지 않으므로 주의해서 사용해야 합니다.
- `'MaxListenersExceededWarning'` - 주어진 이벤트에 대해 `EventEmitter` 또는 `EventTarget`에 너무 많은 리스너가 등록되었음을 나타냅니다. 이는 종종 메모리 누수의 징후입니다.
- `'TimeoutOverflowWarning'` - 32비트 부호 있는 정수에 맞지 않는 숫자 값이 `setTimeout()` 또는 `setInterval()` 함수에 제공되었음을 나타냅니다.
- `'TimeoutNegativeWarning'` - 음수가 `setTimeout()` 또는 `setInterval()` 함수에 제공되었음을 나타냅니다.
- `'TimeoutNaNWarning'` - 숫자가 아닌 값이 `setTimeout()` 또는 `setInterval()` 함수에 제공되었음을 나타냅니다.
- `'UnsupportedWarning'` - 오류로 처리되지 않고 무시될 지원되지 않는 옵션 또는 기능의 사용을 나타냅니다. 한 가지 예는 HTTP/2 호환성 API를 사용할 때 HTTP 응답 상태 메시지를 사용하는 것입니다.

### 이벤트: `'worker'` {#event-worker}

**추가된 버전: v16.2.0, v14.18.0**

- `worker` [\<Worker\>](/ko/nodejs/api/worker_threads#class-worker) 생성된 [\<Worker\>](/ko/nodejs/api/worker_threads#class-worker)입니다.

`'worker'` 이벤트는 새로운 [\<Worker\>](/ko/nodejs/api/worker_threads#class-worker) 스레드가 생성된 후에 발생합니다.


### 시그널 이벤트 {#signal-events}

Node.js 프로세스가 시그널을 수신하면 시그널 이벤트가 발생합니다. `'SIGINT'`, `'SIGHUP'` 등과 같은 표준 POSIX 시그널 이름 목록은 [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7)을 참조하십시오.

시그널은 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 스레드에서는 사용할 수 없습니다.

시그널 처리기는 시그널의 이름(`'SIGINT'`, `'SIGTERM'` 등)을 첫 번째 인수로 받습니다.

각 이벤트의 이름은 시그널의 일반적인 대문자 이름입니다 (예: `SIGINT` 시그널의 경우 `'SIGINT'`).

::: code-group
```js [ESM]
import process from 'node:process';

// 프로세스가 종료되지 않도록 stdin에서 읽기를 시작합니다.
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('SIGINT를 수신했습니다. 종료하려면 Control-D를 누르십시오.');
});

// 여러 시그널을 처리하기 위해 단일 함수 사용
function handle(signal) {
  console.log(`Received ${signal}`);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
```

```js [CJS]
const process = require('node:process');

// 프로세스가 종료되지 않도록 stdin에서 읽기를 시작합니다.
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('SIGINT를 수신했습니다. 종료하려면 Control-D를 누르십시오.');
});

// 여러 시그널을 처리하기 위해 단일 함수 사용
function handle(signal) {
  console.log(`Received ${signal}`);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
```
:::

- `'SIGUSR1'`은 Node.js에서 [디버거](/ko/nodejs/api/debugger)를 시작하기 위해 예약되어 있습니다. 리스너를 설치할 수 있지만 그렇게 하면 디버거를 방해할 수 있습니다.
- `'SIGTERM'` 및 `'SIGINT'`는 Windows가 아닌 플랫폼에서 코드가 `128 + signal number`로 종료되기 전에 터미널 모드를 재설정하는 기본 처리기를 갖습니다. 이러한 시그널 중 하나에 리스너가 설치되어 있으면 기본 동작이 제거됩니다 (Node.js는 더 이상 종료되지 않음).
- `'SIGPIPE'`는 기본적으로 무시됩니다. 리스너를 설치할 수 있습니다.
- `'SIGHUP'`은 콘솔 창이 닫힐 때 Windows에서 생성되고 다른 플랫폼에서는 유사한 다양한 조건에서 생성됩니다. [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7)을 참조하십시오. 리스너를 설치할 수 있지만 약 10 초 후에 Windows에 의해 Node.js가 무조건 종료됩니다. Windows가 아닌 플랫폼에서 `SIGHUP`의 기본 동작은 Node.js를 종료하는 것이지만 리스너가 설치되면 기본 동작이 제거됩니다.
- `'SIGTERM'`은 Windows에서 지원되지 않지만 수신할 수 있습니다.
- 터미널의 `'SIGINT'`는 모든 플랫폼에서 지원되며 일반적으로 + 로 생성할 수 있습니다 (구성 가능할 수 있음). [터미널 raw 모드](/ko/nodejs/api/tty#readstreamsetrawmodemode)가 활성화되고 + 가 사용될 때는 생성되지 않습니다.
- `'SIGBREAK'`는 + 가 눌러지면 Windows에서 전달됩니다. Windows가 아닌 플랫폼에서는 수신할 수 있지만 보내거나 생성할 방법이 없습니다.
- `'SIGWINCH'`는 콘솔 크기가 조정되면 전달됩니다. Windows에서는 커서가 이동 중일 때 콘솔에 쓰거나 raw 모드에서 읽을 수 있는 tty가 사용되는 경우에만 발생합니다.
- `'SIGKILL'`은 리스너를 설치할 수 없으며 모든 플랫폼에서 Node.js를 무조건 종료합니다.
- `'SIGSTOP'`은 리스너를 설치할 수 없습니다.
- [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2)를 사용하여 인위적으로 발생시키지 않은 경우 `'SIGBUS'`, `'SIGFPE'`, `'SIGSEGV'` 및 `'SIGILL'`은 본질적으로 JS 리스너를 호출하는 것이 안전하지 않은 상태로 프로세스를 남깁니다. 그렇게 하면 프로세스가 응답하지 않을 수 있습니다.
- `0`은 프로세스의 존재 여부를 테스트하기 위해 보낼 수 있으며 프로세스가 존재하는 경우 아무런 효과가 없지만 프로세스가 존재하지 않으면 오류가 발생합니다.

Windows는 시그널을 지원하지 않으므로 시그널에 의한 종료에 해당하는 것이 없지만 Node.js는 [`process.kill()`](/ko/nodejs/api/process#processkillpid-signal) 및 [`subprocess.kill()`](/ko/nodejs/api/child_process#subprocesskillsignal)을 사용하여 일부 에뮬레이션을 제공합니다.

- `SIGINT`, `SIGTERM` 및 `SIGKILL`을 보내면 대상 프로세스가 무조건 종료되고 나중에 하위 프로세스는 프로세스가 시그널에 의해 종료되었다고 보고합니다.
- 시그널 `0`을 보내는 것은 프로세스의 존재 여부를 테스트하는 플랫폼 독립적인 방법으로 사용할 수 있습니다.


## `process.abort()` {#processabort}

**Added in: v0.7.0**

`process.abort()` 메서드는 Node.js 프로세스를 즉시 종료하고 코어 파일을 생성합니다.

이 기능은 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 스레드에서는 사용할 수 없습니다.

## `process.allowedNodeEnvironmentFlags` {#processallowednodeenvironmentflags}

**Added in: v10.10.0**

- [\<Set\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)

`process.allowedNodeEnvironmentFlags` 속성은 [`NODE_OPTIONS`](/ko/nodejs/api/cli#node_optionsoptions) 환경 변수 내에서 허용되는 특수하고 읽기 전용인 `Set`입니다.

`process.allowedNodeEnvironmentFlags`는 `Set`을 확장하지만, 몇 가지 가능한 플래그 표현을 인식하도록 `Set.prototype.has`를 재정의합니다. `process.allowedNodeEnvironmentFlags.has()`는 다음의 경우에 `true`를 반환합니다.

- 플래그는 선행 단일(`-`) 또는 이중(`--`) 대시를 생략할 수 있습니다. 예: `--inspect-brk`의 경우 `inspect-brk`, `-r`의 경우 `r`.
- V8로 전달되는 플래그(`--v8-options`에 나열됨)는 하나 이상의 *선행하지 않는* 대시를 밑줄로 바꾸거나 그 반대로 바꿀 수 있습니다. 예: `--perf_basic_prof`, `--perf-basic-prof`, `--perf_basic-prof` 등.
- 플래그는 하나 이상의 등호(`=`) 문자를 포함할 수 있습니다. 첫 번째 등호를 포함한 이후의 모든 문자는 무시됩니다. 예: `--stack-trace-limit=100`.
- 플래그는 [`NODE_OPTIONS`](/ko/nodejs/api/cli#node_optionsoptions) 내에서 허용 *되어야* 합니다.

`process.allowedNodeEnvironmentFlags`를 반복할 때 플래그는 *한 번만* 나타납니다. 각 플래그는 하나 이상의 대시로 시작합니다. V8로 전달되는 플래그는 선행하지 않는 대시 대신 밑줄을 포함합니다.

::: code-group
```js [ESM]
import { allowedNodeEnvironmentFlags } from 'node:process';

allowedNodeEnvironmentFlags.forEach((flag) => {
  // -r
  // --inspect-brk
  // --abort_on_uncaught_exception
  // ...
});
```

```js [CJS]
const { allowedNodeEnvironmentFlags } = require('node:process');

allowedNodeEnvironmentFlags.forEach((flag) => {
  // -r
  // --inspect-brk
  // --abort_on_uncaught_exception
  // ...
});
```
:::

`process.allowedNodeEnvironmentFlags`의 `add()`, `clear()`, `delete()` 메서드는 아무 작업도 수행하지 않으며, 오류 없이 실패합니다.

Node.js가 [`NODE_OPTIONS`](/ko/nodejs/api/cli#node_optionsoptions) 지원 *없이* 컴파일된 경우( [`process.config`](/ko/nodejs/api/process#processconfig)에 표시됨), `process.allowedNodeEnvironmentFlags`는 *허용되었을* 내용을 포함합니다.


## `process.arch` {#processarch}

**Added in: v0.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Node.js 바이너리가 컴파일된 운영 체제 CPU 아키텍처입니다. 가능한 값은 `'arm'`, `'arm64'`, `'ia32'`, `'loong64'`, `'mips'`, `'mipsel'`, `'ppc'`, `'ppc64'`, `'riscv64'`, `'s390'`, `'s390x'`, 및 `'x64'`입니다.

::: code-group
```js [ESM]
import { arch } from 'node:process';

console.log(`이 프로세서 아키텍처는 ${arch}입니다.`);
```

```js [CJS]
const { arch } = require('node:process');

console.log(`이 프로세서 아키텍처는 ${arch}입니다.`);
```
:::

## `process.argv` {#processargv}

**Added in: v0.1.27**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.argv` 속성은 Node.js 프로세스가 시작될 때 전달된 명령줄 인수를 포함하는 배열을 반환합니다. 첫 번째 요소는 [`process.execPath`](/ko/nodejs/api/process#processexecpath)가 됩니다. `argv[0]`의 원래 값에 액세스해야 하는 경우 `process.argv0`을 참조하십시오. 두 번째 요소는 실행 중인 JavaScript 파일의 경로가 됩니다. 나머지 요소는 추가 명령줄 인수가 됩니다.

예를 들어, `process-args.js`에 대한 다음 스크립트를 가정합니다.

::: code-group
```js [ESM]
import { argv } from 'node:process';

// print process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```

```js [CJS]
const { argv } = require('node:process');

// print process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```
:::

Node.js 프로세스를 다음과 같이 시작합니다.

```bash [BASH]
node process-args.js one two=three four
```
다음과 같은 출력이 생성됩니다.

```text [TEXT]
0: /usr/local/bin/node
1: /Users/mjr/work/node/process-args.js
2: one
3: two=three
4: four
```
## `process.argv0` {#processargv0}

**Added in: v6.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.argv0` 속성은 Node.js가 시작될 때 전달된 `argv[0]`의 원래 값의 읽기 전용 복사본을 저장합니다.

```bash [BASH]
$ bash -c 'exec -a customArgv0 ./node'
> process.argv[0]
'/Volumes/code/external/node/out/Release/node'
> process.argv0
'customArgv0'
```

## `process.channel` {#processchannel}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.0.0 | 이제 객체가 실수로 네이티브 C++ 바인딩을 노출하지 않습니다. |
| v7.1.0 | 추가됨: v7.1.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Node.js 프로세스가 IPC 채널과 함께 생성된 경우([자식 프로세스](/ko/nodejs/api/child_process) 문서 참조), `process.channel` 속성은 IPC 채널에 대한 참조입니다. IPC 채널이 존재하지 않으면 이 속성은 `undefined`입니다.

### `process.channel.ref()` {#processchannelref}

**추가됨: v7.1.0**

이 메서드는 `.unref()`가 이전에 호출된 경우 IPC 채널이 프로세스의 이벤트 루프를 계속 실행하도록 합니다.

일반적으로 이는 `process` 객체의 `'disconnect'` 및 `'message'` 리스너의 수를 통해 관리됩니다. 그러나 이 메서드를 사용하여 특정 동작을 명시적으로 요청할 수 있습니다.

### `process.channel.unref()` {#processchannelunref}

**추가됨: v7.1.0**

이 메서드는 IPC 채널이 프로세스의 이벤트 루프를 계속 실행하지 않도록 하고 채널이 열려 있는 동안에도 완료되도록 합니다.

일반적으로 이는 `process` 객체의 `'disconnect'` 및 `'message'` 리스너의 수를 통해 관리됩니다. 그러나 이 메서드를 사용하여 특정 동작을 명시적으로 요청할 수 있습니다.

## `process.chdir(directory)` {#processchdirdirectory}

**추가됨: v0.1.17**

- `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.chdir()` 메서드는 Node.js 프로세스의 현재 작업 디렉터리를 변경하거나, 그렇게 하는 데 실패하면 예외를 발생시킵니다(예: 지정된 `directory`가 존재하지 않는 경우).

::: code-group
```js [ESM]
import { chdir, cwd } from 'node:process';

console.log(`Starting directory: ${cwd()}`);
try {
  chdir('/tmp');
  console.log(`New directory: ${cwd()}`);
} catch (err) {
  console.error(`chdir: ${err}`);
}
```

```js [CJS]
const { chdir, cwd } = require('node:process');

console.log(`Starting directory: ${cwd()}`);
try {
  chdir('/tmp');
  console.log(`New directory: ${cwd()}`);
} catch (err) {
  console.error(`chdir: ${err}`);
}
```
:::

이 기능은 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 스레드에서 사용할 수 없습니다.


## `process.config` {#processconfig}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | `process.config` 객체가 이제 고정되었습니다. |
| v16.0.0 | process.config 수정이 더 이상 사용되지 않습니다. |
| v0.7.7 | 추가됨: v0.7.7 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.config` 속성은 현재 Node.js 실행 파일을 컴파일하는 데 사용된 구성 옵션의 JavaScript 표현을 포함하는 고정된 `Object`를 반환합니다. 이는 `./configure` 스크립트를 실행할 때 생성된 `config.gypi` 파일과 동일합니다.

가능한 출력 예는 다음과 같습니다.

```js [ESM]
{
  target_defaults:
   { cflags: [],
     default_configuration: 'Release',
     defines: [],
     include_dirs: [],
     libraries: [] },
  variables:
   {
     host_arch: 'x64',
     napi_build_version: 5,
     node_install_npm: 'true',
     node_prefix: '',
     node_shared_cares: 'false',
     node_shared_http_parser: 'false',
     node_shared_libuv: 'false',
     node_shared_zlib: 'false',
     node_use_openssl: 'true',
     node_shared_openssl: 'false',
     target_arch: 'x64',
     v8_use_snapshot: 1
   }
}
```
## `process.connected` {#processconnected}

**추가됨: v0.7.2**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Node.js 프로세스가 IPC 채널로 생성된 경우([자식 프로세스](/ko/nodejs/api/child_process) 및 [클러스터](/ko/nodejs/api/cluster) 문서 참조), `process.connected` 속성은 IPC 채널이 연결되어 있는 동안 `true`를 반환하고 `process.disconnect()`가 호출된 후에는 `false`를 반환합니다.

`process.connected`가 `false`가 되면 `process.send()`를 사용하여 IPC 채널을 통해 메시지를 더 이상 보낼 수 없습니다.

## `process.constrainedMemory()` {#processconstrainedmemory}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.0.0, v20.13.0 | 반환 값을 `uv_get_constrained_memory`와 정렬했습니다. |
| v19.6.0, v18.15.0 | 추가됨: v19.6.0, v18.15.0 |
:::

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

OS에서 부과한 제한에 따라 프로세스에 사용 가능한 메모리 양(바이트)을 가져옵니다. 이러한 제약 조건이 없거나 제약 조건이 알려지지 않은 경우 `0`이 반환됩니다.

자세한 내용은 [`uv_get_constrained_memory`](https://docs.libuv.org/en/v1.x/misc#c.uv_get_constrained_memory)를 참조하십시오.


## `process.availableMemory()` {#processavailablememory}

**Added in: v22.0.0, v20.13.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - Experimental
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

프로세스가 사용할 수 있는 여유 메모리 양을 바이트 단위로 가져옵니다.

자세한 내용은 [`uv_get_available_memory`](https://docs.libuv.org/en/v1.x/misc#c.uv_get_available_memory)를 참조하십시오.

## `process.cpuUsage([previousValue])` {#processcpuusagepreviousvalue}

**Added in: v6.1.0**

- `previousValue` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `process.cpuUsage()`를 호출하여 얻은 이전 반환 값
- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `user` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `system` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

`process.cpuUsage()` 메서드는 현재 프로세스의 사용자 및 시스템 CPU 시간 사용량을 반환합니다. 반환 값은 `user` 및 `system` 속성을 가진 객체이며, 각 속성의 값은 마이크로초 단위(1초의 백만분의 일)입니다. 이러한 값은 각각 사용자 및 시스템 코드에서 소요된 시간을 측정하며, 여러 CPU 코어가 이 프로세스에 대한 작업을 수행하는 경우 실제 경과 시간보다 클 수 있습니다.

`process.cpuUsage()`에 대한 이전 호출의 결과를 인수로 전달하여 차이 값을 얻을 수 있습니다.

::: code-group
```js [ESM]
import { cpuUsage } from 'node:process';

const startUsage = cpuUsage();
// { user: 38579, system: 6986 }

// spin the CPU for 500 milliseconds
const now = Date.now();
while (Date.now() - now < 500);

console.log(cpuUsage(startUsage));
// { user: 514883, system: 11226 }
```

```js [CJS]
const { cpuUsage } = require('node:process');

const startUsage = cpuUsage();
// { user: 38579, system: 6986 }

// spin the CPU for 500 milliseconds
const now = Date.now();
while (Date.now() - now < 500);

console.log(cpuUsage(startUsage));
// { user: 514883, system: 11226 }
```
:::


## `process.cwd()` {#processcwd}

**Added in: v0.1.8**

- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.cwd()` 메서드는 Node.js 프로세스의 현재 작업 디렉터리를 반환합니다.

::: code-group
```js [ESM]
import { cwd } from 'node:process';

console.log(`Current directory: ${cwd()}`);
```

```js [CJS]
const { cwd } = require('node:process');

console.log(`Current directory: ${cwd()}`);
```
:::

## `process.debugPort` {#processdebugport}

**Added in: v0.7.2**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js 디버거가 활성화되었을 때 사용하는 포트입니다.

::: code-group
```js [ESM]
import process from 'node:process';

process.debugPort = 5858;
```

```js [CJS]
const process = require('node:process');

process.debugPort = 5858;
```
:::

## `process.disconnect()` {#processdisconnect}

**Added in: v0.7.2**

Node.js 프로세스가 IPC 채널을 사용하여 생성된 경우([자식 프로세스](/ko/nodejs/api/child_process) 및 [클러스터](/ko/nodejs/api/cluster) 설명서 참조), `process.disconnect()` 메서드는 부모 프로세스에 대한 IPC 채널을 닫아 다른 연결이 유지되지 않는 한 자식 프로세스가 정상적으로 종료되도록 합니다.

`process.disconnect()`를 호출하는 효과는 부모 프로세스에서 [`ChildProcess.disconnect()`](/ko/nodejs/api/child_process#subprocessdisconnect)를 호출하는 것과 같습니다.

Node.js 프로세스가 IPC 채널로 생성되지 않은 경우 `process.disconnect()`는 `undefined`가 됩니다.

## `process.dlopen(module, filename[, flags])` {#processdlopenmodule-filename-flags}

::: info [History]
| Version | Changes |
| --- | --- |
| v9.0.0 | `flags` 인수에 대한 지원이 추가되었습니다. |
| v0.1.16 | Added in: v0.1.16 |
:::

- `module` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `flags` [\<os.constants.dlopen\>](/ko/nodejs/api/os#dlopen-constants) **기본값:** `os.constants.dlopen.RTLD_LAZY`

`process.dlopen()` 메서드를 사용하면 공유 객체를 동적으로 로드할 수 있습니다. 이는 주로 C++ 애드온을 로드하기 위해 `require()`에서 사용되며 특수한 경우가 아니면 직접 사용해서는 안 됩니다. 즉, 사용자 정의 dlopen 플래그 또는 ES 모듈에서 로드하는 것과 같은 특정 이유가 없는 한 [`require()`](/ko/nodejs/api/globals#require)를 `process.dlopen()`보다 우선적으로 사용해야 합니다.

`flags` 인수는 dlopen 동작을 지정할 수 있는 정수입니다. 자세한 내용은 [`os.constants.dlopen`](/ko/nodejs/api/os#dlopen-constants) 설명서를 참조하세요.

`process.dlopen()`을 호출할 때 중요한 요구 사항은 `module` 인스턴스를 전달해야 한다는 것입니다. C++ 애드온에서 내보낸 함수는 `module.exports`를 통해 액세스할 수 있습니다.

아래 예제에서는 `foo` 함수를 내보내는 `local.node`라는 C++ 애드온을 로드하는 방법을 보여줍니다. `RTLD_NOW` 상수를 전달하여 호출이 반환되기 전에 모든 기호가 로드됩니다. 이 예제에서는 상수를 사용할 수 있다고 가정합니다.

::: code-group
```js [ESM]
import { dlopen } from 'node:process';
import { constants } from 'node:os';
import { fileURLToPath } from 'node:url';

const module = { exports: {} };
dlopen(module, fileURLToPath(new URL('local.node', import.meta.url)),
       constants.dlopen.RTLD_NOW);
module.exports.foo();
```

```js [CJS]
const { dlopen } = require('node:process');
const { constants } = require('node:os');
const { join } = require('node:path');

const module = { exports: {} };
dlopen(module, join(__dirname, 'local.node'), constants.dlopen.RTLD_NOW);
module.exports.foo();
```
:::


## `process.emitWarning(warning[, options])` {#processemitwarningwarning-options}

**추가된 버전: v8.0.0**

- `warning` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 발생할 경고.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `warning`이 `String`일 때, `type`은 발생되는 경고의 *유형*에 사용할 이름입니다. **기본값:** `'Warning'`.
    - `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 발생되는 경고 인스턴스에 대한 고유 식별자입니다.
    - `ctor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `warning`이 `String`일 때, `ctor`은 생성된 스택 추적을 제한하는 데 사용되는 선택적 함수입니다. **기본값:** `process.emitWarning`.
    - `detail` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 오류와 함께 포함할 추가 텍스트입니다.

`process.emitWarning()` 메서드는 사용자 지정 또는 애플리케이션 특정 프로세스 경고를 발생시키는 데 사용할 수 있습니다. 이러한 경고는 [`'warning'`](/ko/nodejs/api/process#event-warning) 이벤트에 핸들러를 추가하여 수신할 수 있습니다.

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// 코드 및 추가 세부 정보와 함께 경고를 발생시킵니다.
emitWarning('Something happened!', {
  code: 'MY_WARNING',
  detail: 'This is some additional information',
});
// Emits:
// (node:56338) [MY_WARNING] Warning: Something happened!
// This is some additional information
```

```js [CJS]
const { emitWarning } = require('node:process');

// 코드 및 추가 세부 정보와 함께 경고를 발생시킵니다.
emitWarning('Something happened!', {
  code: 'MY_WARNING',
  detail: 'This is some additional information',
});
// Emits:
// (node:56338) [MY_WARNING] Warning: Something happened!
// This is some additional information
```
:::

이 예제에서 `Error` 객체는 `process.emitWarning()`에 의해 내부적으로 생성되어 [`'warning'`](/ko/nodejs/api/process#event-warning) 핸들러로 전달됩니다.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);    // 'Warning'
  console.warn(warning.message); // 'Something happened!'
  console.warn(warning.code);    // 'MY_WARNING'
  console.warn(warning.stack);   // 스택 추적
  console.warn(warning.detail);  // 'This is some additional information'
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);    // 'Warning'
  console.warn(warning.message); // 'Something happened!'
  console.warn(warning.code);    // 'MY_WARNING'
  console.warn(warning.stack);   // 스택 추적
  console.warn(warning.detail);  // 'This is some additional information'
});
```
:::

`warning`이 `Error` 객체로 전달되면 `options` 인수는 무시됩니다.


## `process.emitWarning(warning[, type[, code]][, ctor])` {#processemitwarningwarning-type-code-ctor}

**다음 버전부터 추가됨: v6.0.0**

- `warning` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 발생시킬 경고.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `warning`이 `String`일 때, `type`은 발생되는 경고의 *type*에 사용할 이름입니다. **기본값:** `'Warning'`.
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 발생되는 경고 인스턴스에 대한 고유 식별자.
- `ctor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `warning`이 `String`일 때, `ctor`은 생성된 스택 추적을 제한하는 데 사용되는 선택적 함수입니다. **기본값:** `process.emitWarning`.

`process.emitWarning()` 메서드를 사용하여 사용자 정의 또는 애플리케이션 특정 프로세스 경고를 발생시킬 수 있습니다. [`'warning'`](/ko/nodejs/api/process#event-warning) 이벤트에 핸들러를 추가하여 이를 수신할 수 있습니다.

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// 문자열을 사용하여 경고를 발생시킵니다.
emitWarning('Something happened!');
// Emits: (node: 56338) Warning: Something happened!
```

```js [CJS]
const { emitWarning } = require('node:process');

// 문자열을 사용하여 경고를 발생시킵니다.
emitWarning('Something happened!');
// Emits: (node: 56338) Warning: Something happened!
```
:::

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// 문자열과 유형을 사용하여 경고를 발생시킵니다.
emitWarning('Something Happened!', 'CustomWarning');
// Emits: (node:56338) CustomWarning: Something Happened!
```

```js [CJS]
const { emitWarning } = require('node:process');

// 문자열과 유형을 사용하여 경고를 발생시킵니다.
emitWarning('Something Happened!', 'CustomWarning');
// Emits: (node:56338) CustomWarning: Something Happened!
```
:::

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

emitWarning('Something happened!', 'CustomWarning', 'WARN001');
// Emits: (node:56338) [WARN001] CustomWarning: Something happened!
```

```js [CJS]
const { emitWarning } = require('node:process');

process.emitWarning('Something happened!', 'CustomWarning', 'WARN001');
// Emits: (node:56338) [WARN001] CustomWarning: Something happened!
```
:::

이전 예제 각각에서 `Error` 객체는 `process.emitWarning()`에 의해 내부적으로 생성되어 [`'warning'`](/ko/nodejs/api/process#event-warning) 핸들러로 전달됩니다.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.code);
  console.warn(warning.stack);
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.code);
  console.warn(warning.stack);
});
```
:::

`warning`이 `Error` 객체로 전달되면 수정되지 않고 `'warning'` 이벤트 핸들러로 전달됩니다 (선택적 `type`, `code` 및 `ctor` 인수는 무시됨).

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Error 객체를 사용하여 경고를 발생시킵니다.
const myWarning = new Error('Something happened!');
// Error name 속성을 사용하여 유형 이름을 지정합니다.
myWarning.name = 'CustomWarning';
myWarning.code = 'WARN001';

emitWarning(myWarning);
// Emits: (node:56338) [WARN001] CustomWarning: Something happened!
```

```js [CJS]
const { emitWarning } = require('node:process');

// Error 객체를 사용하여 경고를 발생시킵니다.
const myWarning = new Error('Something happened!');
// Error name 속성을 사용하여 유형 이름을 지정합니다.
myWarning.name = 'CustomWarning';
myWarning.code = 'WARN001';

emitWarning(myWarning);
// Emits: (node:56338) [WARN001] CustomWarning: Something happened!
```
:::

`warning`이 문자열 또는 `Error` 객체가 아닌 경우 `TypeError`가 발생합니다.

프로세스 경고는 `Error` 객체를 사용하지만 프로세스 경고 메커니즘은 일반적인 오류 처리 메커니즘을 대체하지 **않습니다**.

경고 `type`이 `'DeprecationWarning'`인 경우 다음과 같은 추가 처리가 구현됩니다.

- `--throw-deprecation` 명령줄 플래그를 사용하면 더 이상 사용되지 않는 경고가 이벤트로 발생되는 대신 예외로 발생합니다.
- `--no-deprecation` 명령줄 플래그를 사용하면 더 이상 사용되지 않는 경고가 억제됩니다.
- `--trace-deprecation` 명령줄 플래그를 사용하면 더 이상 사용되지 않는 경고가 전체 스택 추적과 함께 `stderr`에 출력됩니다.


### 중복 경고 방지 {#avoiding-duplicate-warnings}

가장 좋은 방법은 프로세스당 경고가 한 번만 발생하도록 하는 것입니다. 이를 위해 `emitWarning()`을 불리언 뒤에 배치합니다.

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

function emitMyWarning() {
  if (!emitMyWarning.warned) {
    emitMyWarning.warned = true;
    emitWarning('Only warn once!');
  }
}
emitMyWarning();
// Emits: (node: 56339) Warning: Only warn once!
emitMyWarning();
// Emits nothing
```

```js [CJS]
const { emitWarning } = require('node:process');

function emitMyWarning() {
  if (!emitMyWarning.warned) {
    emitMyWarning.warned = true;
    emitWarning('Only warn once!');
  }
}
emitMyWarning();
// Emits: (node: 56339) Warning: Only warn once!
emitMyWarning();
// Emits nothing
```
:::

## `process.env` {#processenv}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v11.14.0 | 이제 작업자 스레드는 기본적으로 부모 스레드의 `process.env` 복사본을 사용하며, 이는 `Worker` 생성자의 `env` 옵션을 통해 구성할 수 있습니다. |
| v10.0.0 | 변수 값을 문자열로 암시적으로 변환하는 것은 더 이상 사용되지 않습니다. |
| v0.1.27 | 추가됨: v0.1.27 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.env` 속성은 사용자 환경을 포함하는 객체를 반환합니다. [`environ(7)`](http://man7.org/linux/man-pages/man7/environ.7)을 참조하십시오.

이 객체의 예는 다음과 같습니다.

```js [ESM]
{
  TERM: 'xterm-256color',
  SHELL: '/usr/local/bin/bash',
  USER: 'maciej',
  PATH: '~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin',
  PWD: '/Users/maciej',
  EDITOR: 'vim',
  SHLVL: '1',
  HOME: '/Users/maciej',
  LOGNAME: 'maciej',
  _: '/usr/local/bin/node'
}
```
이 객체를 수정할 수 있지만, 이러한 수정은 Node.js 프로세스 외부 또는 (명시적으로 요청하지 않는 한) 다른 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 스레드에 반영되지 않습니다. 즉, 다음 예제는 작동하지 않습니다.

```bash [BASH]
node -e 'process.env.foo = "bar"' && echo $foo
```
다음은 작동합니다.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.foo = 'bar';
console.log(env.foo);
```

```js [CJS]
const { env } = require('node:process');

env.foo = 'bar';
console.log(env.foo);
```
:::

`process.env`에 속성을 할당하면 값이 암시적으로 문자열로 변환됩니다. **이 동작은 더 이상 사용되지 않습니다.** Node.js의 향후 버전에서는 값이 문자열, 숫자 또는 불리언이 아닌 경우 오류가 발생할 수 있습니다.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.test = null;
console.log(env.test);
// => 'null'
env.test = undefined;
console.log(env.test);
// => 'undefined'
```

```js [CJS]
const { env } = require('node:process');

env.test = null;
console.log(env.test);
// => 'null'
env.test = undefined;
console.log(env.test);
// => 'undefined'
```
:::

`process.env`에서 속성을 삭제하려면 `delete`를 사용하십시오.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.TEST = 1;
delete env.TEST;
console.log(env.TEST);
// => undefined
```

```js [CJS]
const { env } = require('node:process');

env.TEST = 1;
delete env.TEST;
console.log(env.TEST);
// => undefined
```
:::

Windows 운영 체제에서는 환경 변수가 대소문자를 구분하지 않습니다.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.TEST = 1;
console.log(env.test);
// => 1
```

```js [CJS]
const { env } = require('node:process');

env.TEST = 1;
console.log(env.test);
// => 1
```
:::

[`Worker`](/ko/nodejs/api/worker_threads#class-worker) 인스턴스를 생성할 때 명시적으로 지정하지 않는 한, 각 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 스레드는 부모 스레드의 `process.env` 또는 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 생성자에 대한 `env` 옵션으로 지정된 내용을 기반으로 자체 `process.env` 복사본을 갖습니다. `process.env`에 대한 변경 사항은 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 스레드 간에 표시되지 않으며, 주 스레드만 운영 체제 또는 네이티브 애드온에 표시되는 변경 사항을 만들 수 있습니다. Windows에서는 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 인스턴스의 `process.env` 복사본이 주 스레드와 달리 대소문자를 구분하여 작동합니다.


## `process.execArgv` {#processexecargv}

**Added in: v0.7.7**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.execArgv` 속성은 Node.js 프로세스가 시작될 때 전달된 Node.js 특정 명령줄 옵션 집합을 반환합니다. 이러한 옵션은 [`process.argv`](/ko/nodejs/api/process#processargv) 속성에서 반환된 배열에 나타나지 않으며 Node.js 실행 파일, 스크립트 이름 또는 스크립트 이름 뒤에 오는 옵션을 포함하지 않습니다. 이러한 옵션은 부모와 동일한 실행 환경에서 자식 프로세스를 생성하는 데 유용합니다.

```bash [BASH]
node --icu-data-dir=./foo --require ./bar.js script.js --version
```
`process.execArgv`의 결과:

```json [JSON]
["--icu-data-dir=./foo", "--require", "./bar.js"]
```
그리고 `process.argv`:

```js [ESM]
['/usr/local/bin/node', 'script.js', '--version']
```
이 속성을 사용하는 워커 스레드의 자세한 동작은 [`Worker` 생성자](/ko/nodejs/api/worker_threads#new-workerfilename-options)를 참조하세요.

## `process.execPath` {#processexecpath}

**Added in: v0.1.100**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.execPath` 속성은 Node.js 프로세스를 시작한 실행 파일의 절대 경로 이름을 반환합니다. 심볼릭 링크가 있는 경우 확인됩니다.

```js [ESM]
'/usr/local/bin/node'
```
## `process.exit([code])` {#processexitcode}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.0.0 | number 타입 또는 정수를 나타내는 문자열 타입의 코드만 허용합니다. |
| v0.1.13 | Added in: v0.1.13 |
:::

- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 종료 코드. 문자열 타입의 경우 정수 문자열(예: '1')만 허용됩니다. **기본값:** `0`.

`process.exit()` 메서드는 Node.js에게 `code` 종료 상태로 프로세스를 동기적으로 종료하도록 지시합니다. `code`가 생략되면 종료는 '성공' 코드 `0` 또는 `process.exitCode`가 설정된 경우 해당 값을 사용합니다. Node.js는 모든 [`'exit'`](/ko/nodejs/api/process#event-exit) 이벤트 리스너가 호출될 때까지 종료되지 않습니다.

'실패' 코드로 종료하려면:

::: code-group
```js [ESM]
import { exit } from 'node:process';

exit(1);
```

```js [CJS]
const { exit } = require('node:process');

exit(1);
```
:::

Node.js를 실행한 셸은 종료 코드를 `1`로 인식해야 합니다.

`process.exit()`를 호출하면 `process.stdout` 및 `process.stderr`에 대한 I/O 작업을 포함하여 아직 완전히 완료되지 않은 보류 중인 비동기 작업이 있더라도 프로세스가 가능한 한 빨리 종료됩니다.

대부분의 경우 `process.exit()`를 명시적으로 호출할 필요가 없습니다. Node.js 프로세스는 이벤트 루프에 *추가 작업이 보류 중이지 않은 경우* 자동으로 종료됩니다. `process.exitCode` 속성을 설정하여 프로세스가 정상적으로 종료될 때 사용할 종료 코드를 프로세스에 알릴 수 있습니다.

예를 들어 다음 예제는 stdout에 인쇄된 데이터가 잘리고 손실될 수 있는 `process.exit()` 메서드의 *잘못된 사용*을 보여줍니다.

::: code-group
```js [ESM]
import { exit } from 'node:process';

// 이것은 *하지 말아야 할* 예입니다:
if (someConditionNotMet()) {
  printUsageToStdout();
  exit(1);
}
```

```js [CJS]
const { exit } = require('node:process');

// 이것은 *하지 말아야 할* 예입니다:
if (someConditionNotMet()) {
  printUsageToStdout();
  exit(1);
}
```
:::

이것이 문제가 되는 이유는 Node.js에서 `process.stdout`에 대한 쓰기가 때때로 *비동기적*이며 Node.js 이벤트 루프의 여러 틱에 걸쳐 발생할 수 있기 때문입니다. 그러나 `process.exit()`를 호출하면 `stdout`에 대한 추가 쓰기가 수행되기 *전에* 프로세스가 종료됩니다.

`process.exit()`를 직접 호출하는 대신 코드는 `process.exitCode`를 설정하고 이벤트 루프에 대한 추가 작업을 예약하지 않도록 하여 프로세스가 자연스럽게 종료되도록 *해야 합니다*:

::: code-group
```js [ESM]
import process from 'node:process';

// 프로세스가 정상적으로 종료되도록 하면서
// 종료 코드를 올바르게 설정하는 방법입니다.
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
```

```js [CJS]
const process = require('node:process');

// 프로세스가 정상적으로 종료되도록 하면서
// 종료 코드를 올바르게 설정하는 방법입니다.
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
```
:::

오류 조건으로 인해 Node.js 프로세스를 종료해야 하는 경우 *처리되지 않은* 오류를 발생시키고 프로세스가 그에 따라 종료되도록 하는 것이 `process.exit()`를 호출하는 것보다 안전합니다.

[`Worker`](/ko/nodejs/api/worker_threads#class-worker) 스레드에서 이 함수는 현재 프로세스 대신 현재 스레드를 중지합니다.


## `process.exitCode` {#processexitcode_1}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.0.0 | 숫자 타입의 코드만 허용하고, 정수를 나타내는 경우 문자열 타입의 코드만 허용합니다. |
| v0.11.8 | 추가됨: v0.11.8 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 종료 코드. 문자열 타입의 경우 정수 문자열(예: '1')만 허용됩니다. **기본값:** `undefined`.

프로세스가 정상적으로 종료되거나 코드를 지정하지 않고 [`process.exit()`](/ko/nodejs/api/process#processexitcode)를 통해 종료될 때 프로세스 종료 코드가 될 숫자입니다.

[`process.exit(code)`](/ko/nodejs/api/process#processexitcode)에 코드를 지정하면 `process.exitCode`의 이전 설정이 무시됩니다.

## `process.features.cached_builtins` {#processfeaturescached_builtins}

**추가됨: v12.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

현재 Node.js 빌드가 내장 모듈을 캐싱하는 경우 `true`인 부울 값입니다.

## `process.features.debug` {#processfeaturesdebug}

**추가됨: v0.5.5**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

현재 Node.js 빌드가 디버그 빌드인 경우 `true`인 부울 값입니다.

## `process.features.inspector` {#processfeaturesinspector}

**추가됨: v11.10.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

현재 Node.js 빌드에 검사기가 포함된 경우 `true`인 부울 값입니다.

## `process.features.ipv6` {#processfeaturesipv6}

**추가됨: v0.5.3**

**더 이상 사용되지 않음: v23.4.0**

::: danger [안정성: 0 - 더 이상 사용되지 않음]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 더 이상 사용되지 않습니다. 이 속성은 항상 true이며 이를 기반으로 한 모든 검사는 불필요합니다.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

현재 Node.js 빌드에 IPv6 지원이 포함된 경우 `true`인 부울 값입니다.

모든 Node.js 빌드는 IPv6를 지원하므로 이 값은 항상 `true`입니다.


## `process.features.require_module` {#processfeaturesrequire_module}

**추가된 버전: v23.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

현재 Node.js 빌드가 [`require()`를 사용하여 ECMAScript 모듈 로드](/ko/nodejs/api/modules#loading-ecmascript-modules-using-require)를 지원하는 경우 `true`인 부울 값입니다.

## `process.features.tls` {#processfeaturestls}

**추가된 버전: v0.5.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

현재 Node.js 빌드에 TLS 지원이 포함된 경우 `true`인 부울 값입니다.

## `process.features.tls_alpn` {#processfeaturestls_alpn}

**추가된 버전: v4.8.0**

**지원 중단: v23.4.0 이후**

::: danger [안정성: 0 - 지원 중단됨]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 지원 중단됨. `process.features.tls`를 대신 사용하십시오.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

현재 Node.js 빌드에 TLS에서 ALPN에 대한 지원이 포함된 경우 `true`인 부울 값입니다.

Node.js 11.0.0 이상 버전에서는 OpenSSL 종속성이 무조건 ALPN 지원을 제공합니다. 따라서 이 값은 `process.features.tls`의 값과 동일합니다.

## `process.features.tls_ocsp` {#processfeaturestls_ocsp}

**추가된 버전: v0.11.13**

**지원 중단: v23.4.0 이후**

::: danger [안정성: 0 - 지원 중단됨]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 지원 중단됨. `process.features.tls`를 대신 사용하십시오.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

현재 Node.js 빌드에 TLS에서 OCSP에 대한 지원이 포함된 경우 `true`인 부울 값입니다.

Node.js 11.0.0 이상 버전에서는 OpenSSL 종속성이 무조건 OCSP 지원을 제공합니다. 따라서 이 값은 `process.features.tls`의 값과 동일합니다.

## `process.features.tls_sni` {#processfeaturestls_sni}

**추가된 버전: v0.5.3**

**지원 중단: v23.4.0 이후**

::: danger [안정성: 0 - 지원 중단됨]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 지원 중단됨. `process.features.tls`를 대신 사용하십시오.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

현재 Node.js 빌드에 TLS에서 SNI에 대한 지원이 포함된 경우 `true`인 부울 값입니다.

Node.js 11.0.0 이상 버전에서는 OpenSSL 종속성이 무조건 SNI 지원을 제공합니다. 따라서 이 값은 `process.features.tls`의 값과 동일합니다.


## `process.features.typescript` {#processfeaturestypescript}

**Added in: v23.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Node.js가 `--experimental-strip-types`로 실행되면 `"strip"`, Node.js가 `--experimental-transform-types`로 실행되면 `"transform"`, 그렇지 않으면 `false`인 값입니다.

## `process.features.uv` {#processfeaturesuv}

**Added in: v0.5.3**

**Deprecated since: v23.4.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ko/nodejs/api/documentation#stability-index) [Stability: 0](/ko/nodejs/api/documentation#stability-index) - 사용 중단됨. 이 속성은 항상 true이며, 이를 기반으로 한 모든 검사는 중복됩니다.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

현재 Node.js 빌드에 libuv 지원이 포함되어 있으면 `true`인 부울 값입니다.

libuv 없이 Node.js를 빌드하는 것은 불가능하므로 이 값은 항상 `true`입니다.

## `process.finalization.register(ref, callback)` {#processfinalizationregisterref-callback}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 추적 중인 리소스에 대한 참조입니다.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 리소스가 완료될 때 호출될 콜백 함수입니다.
    - `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 추적 중인 리소스에 대한 참조입니다.
    - `event` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 완료를 트리거한 이벤트입니다. 기본값은 'exit'입니다.

이 함수는 `ref` 객체가 가비지 수집되지 않은 경우 프로세스가 `exit` 이벤트를 내보낼 때 호출될 콜백을 등록합니다. 객체 `ref`가 `exit` 이벤트가 발생하기 전에 가비지 수집되면 콜백은 완료 레지스트리에서 제거되고 프로세스 종료 시 호출되지 않습니다.

콜백 내부에서 `ref` 객체에 의해 할당된 리소스를 해제할 수 있습니다. `beforeExit` 이벤트에 적용되는 모든 제한 사항이 `callback` 함수에도 적용된다는 점에 유의해야 합니다. 즉, 특수한 상황에서는 콜백이 호출되지 않을 가능성이 있습니다.

이 함수의 아이디어는 프로세스 종료가 시작될 때 리소스를 해제하는 데 도움이 되는 동시에 더 이상 사용되지 않으면 객체를 가비지 수집되도록 하는 것입니다.

예: 버퍼를 포함하는 객체를 등록할 수 있습니다. 프로세스가 종료될 때 해당 버퍼가 릴리스되었는지 확인하고 싶지만 프로세스 종료 전에 객체가 가비지 수집되면 더 이상 버퍼를 릴리스할 필요가 없습니다. 이 경우 완료 레지스트리에서 콜백을 제거하기만 하면 됩니다.

::: code-group
```js [CJS]
const { finalization } = require('node:process');

// finalization.register()에 전달된 함수가 불필요한 객체 주위에 클로저를 생성하지 않도록 하십시오.
function onFinalize(obj, event) {
  // 객체로 원하는 작업을 수행할 수 있습니다.
  obj.dispose();
}

function setup() {
  // 이 객체는 안전하게 가비지 수집될 수 있으며,
  // 결과 종료 함수는 호출되지 않습니다.
  // 누출이 없습니다.
  const myDisposableObject = {
    dispose() {
      // 리소스를 동기적으로 해제합니다.
    },
  };

  finalization.register(myDisposableObject, onFinalize);
}

setup();
```

```js [ESM]
import { finalization } from 'node:process';

// finalization.register()에 전달된 함수가 불필요한 객체 주위에 클로저를 생성하지 않도록 하십시오.
function onFinalize(obj, event) {
  // 객체로 원하는 작업을 수행할 수 있습니다.
  obj.dispose();
}

function setup() {
  // 이 객체는 안전하게 가비지 수집될 수 있으며,
  // 결과 종료 함수는 호출되지 않습니다.
  // 누출이 없습니다.
  const myDisposableObject = {
    dispose() {
      // 리소스를 동기적으로 해제합니다.
    },
  };

  finalization.register(myDisposableObject, onFinalize);
}

setup();
```
:::

위의 코드는 다음 가정을 기반으로 합니다.

- 화살표 함수는 피합니다.
- 일반 함수는 전역 컨텍스트(루트) 내에 있는 것이 좋습니다.

일반 함수는 `obj`가 존재하는 컨텍스트를 참조할 *수* 있으므로 `obj`가 가비지 수집되지 않도록 할 수 있습니다.

화살표 함수는 이전 컨텍스트를 유지합니다. 예를 들어 다음을 고려하십시오.

```js [ESM]
class Test {
  constructor() {
    finalization.register(this, (ref) => ref.dispose());

    // 다음과 같은 것조차도 매우 권장되지 않습니다.
    // finalization.register(this, () => this.dispose());
  }
  dispose() {}
}
```
이 객체가 가비지 수집될 가능성은 매우 낮지만(불가능하지 않음), 그렇지 않은 경우 `process.exit`가 호출될 때 `dispose`가 호출됩니다.

콜백이 모든 상황에서 호출된다는 보장이 없으므로 중요한 리소스의 삭제를 위해 이 기능에 의존하는 것을 피하십시오.


## `process.finalization.registerBeforeExit(ref, callback)` {#processfinalizationregisterbeforeexitref-callback}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 추적 중인 리소스에 대한 참조입니다.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 리소스가 완료될 때 호출될 콜백 함수입니다.
    - `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 추적 중인 리소스에 대한 참조입니다.
    - `event` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 완료를 트리거한 이벤트입니다. 기본값은 'beforeExit'입니다.
  
 

이 함수는 `register`와 정확히 동일하게 동작하지만, `ref` 객체가 가비지 수집되지 않은 경우 프로세스가 `beforeExit` 이벤트를 발생시킬 때 콜백이 호출됩니다.

`beforeExit` 이벤트에 적용되는 모든 제한 사항이 `callback` 함수에도 적용된다는 점에 유의하십시오. 즉, 특별한 상황에서는 콜백이 호출되지 않을 가능성이 있습니다.

## `process.finalization.unregister(ref)` {#processfinalizationunregisterref}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 이전에 등록된 리소스에 대한 참조입니다.

이 함수는 완료 레지스트리에서 객체의 등록을 제거하므로 콜백이 더 이상 호출되지 않습니다.



::: code-group
```js [CJS]
const { finalization } = require('node:process');

// finalization.register()에 전달된 함수가 불필요한 객체를 둘러싼 클로저를 생성하지 않도록 하십시오.
function onFinalize(obj, event) {
  // 객체로 원하는 작업을 수행할 수 있습니다.
  obj.dispose();
}

function setup() {
  // 이 객체는 안전하게 가비지 수집될 수 있으며,
  // 결과적으로 종료 함수는 호출되지 않습니다.
  // 누수는 없습니다.
  const myDisposableObject = {
    dispose() {
      // 리소스를 동기적으로 해제합니다.
    },
  };

  finalization.register(myDisposableObject, onFinalize);

  // 무언가를 수행합니다.

  myDisposableObject.dispose();
  finalization.unregister(myDisposableObject);
}

setup();
```

```js [ESM]
import { finalization } from 'node:process';

// finalization.register()에 전달된 함수가 불필요한 객체를 둘러싼 클로저를 생성하지 않도록 하십시오.
function onFinalize(obj, event) {
  // 객체로 원하는 작업을 수행할 수 있습니다.
  obj.dispose();
}

function setup() {
  // 이 객체는 안전하게 가비지 수집될 수 있으며,
  // 결과적으로 종료 함수는 호출되지 않습니다.
  // 누수는 없습니다.
  const myDisposableObject = {
    dispose() {
      // 리소스를 동기적으로 해제합니다.
    },
  };

  // finalization.register()에 전달된 함수가 불필요한 객체를 둘러싼 클로저를 생성하지 않도록 하십시오.
  function onFinalize(obj, event) {
    // 객체로 원하는 작업을 수행할 수 있습니다.
    obj.dispose();
  }

  finalization.register(myDisposableObject, onFinalize);

  // 무언가를 수행합니다.

  myDisposableObject.dispose();
  finalization.unregister(myDisposableObject);
}

setup();
```
:::


## `process.getActiveResourcesInfo()` {#processgetactiveresourcesinfo}

**Added in: v17.3.0, v16.14.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- 반환값: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.getActiveResourcesInfo()` 메서드는 현재 이벤트 루프를 유지하는 활성 리소스 유형을 포함하는 문자열 배열을 반환합니다.

::: code-group
```js [ESM]
import { getActiveResourcesInfo } from 'node:process';
import { setTimeout } from 'node:timers';

console.log('Before:', getActiveResourcesInfo());
setTimeout(() => {}, 1000);
console.log('After:', getActiveResourcesInfo());
// Prints:
//   Before: [ 'CloseReq', 'TTYWrap', 'TTYWrap', 'TTYWrap' ]
//   After: [ 'CloseReq', 'TTYWrap', 'TTYWrap', 'TTYWrap', 'Timeout' ]
```

```js [CJS]
const { getActiveResourcesInfo } = require('node:process');
const { setTimeout } = require('node:timers';

console.log('Before:', getActiveResourcesInfo());
setTimeout(() => {}, 1000);
console.log('After:', getActiveResourcesInfo());
// Prints:
//   Before: [ 'TTYWrap', 'TTYWrap', 'TTYWrap' ]
//   After: [ 'TTYWrap', 'TTYWrap', 'TTYWrap', 'Timeout' ]
```
:::

## `process.getBuiltinModule(id)` {#processgetbuiltinmoduleid}

**Added in: v22.3.0, v20.16.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 요청된 내장 모듈의 ID입니다.
- 반환값: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`process.getBuiltinModule(id)`는 전역적으로 사용 가능한 함수에서 내장 모듈을 로드하는 방법을 제공합니다. 다른 환경을 지원해야 하는 ES 모듈은 이를 사용하여 Node.js에서 실행될 때 조건부로 Node.js 내장 모듈을 로드할 수 있습니다. Node.js가 아닌 환경에서 `import`에 의해 발생할 수 있는 해결 오류를 처리하거나 모듈을 비동기 모듈로 바꾸거나 동기 API를 비동기로 바꾸는 동적 `import()`를 사용하지 않아도 됩니다.

```js [ESM]
if (globalThis.process?.getBuiltinModule) {
  // Node.js에서 실행 중, Node.js fs 모듈을 사용합니다.
  const fs = globalThis.process.getBuiltinModule('fs');
  // 사용자 모듈을 로드하는 데 `require()`가 필요한 경우 createRequire()를 사용합니다.
  const module = globalThis.process.getBuiltinModule('module');
  const require = module.createRequire(import.meta.url);
  const foo = require('foo');
}
```

`id`가 현재 Node.js 프로세스에서 사용 가능한 내장 모듈을 지정하는 경우 `process.getBuiltinModule(id)` 메서드는 해당 내장 모듈을 반환합니다. `id`가 내장 모듈에 해당하지 않으면 `undefined`가 반환됩니다.

`process.getBuiltinModule(id)`는 [`module.isBuiltin(id)`](/ko/nodejs/api/module#moduleisbuiltinmodulename)에 의해 인식되는 내장 모듈 ID를 허용합니다. 일부 내장 모듈은 `node:` 접두사를 사용하여 로드해야 합니다. [필수 `node:` 접두사가 있는 내장 모듈](/ko/nodejs/api/modules#built-in-modules-with-mandatory-node-prefix)을 참조하세요. `process.getBuiltinModule(id)`에서 반환된 참조는 사용자가 [`require.cache`](/ko/nodejs/api/modules#requirecache)를 수정하여 `require(id)`가 다른 것을 반환하더라도 항상 `id`에 해당하는 내장 모듈을 가리킵니다.


## `process.getegid()` {#processgetegid}

**Added in: v2.0.0**

`process.getegid()` 메서드는 Node.js 프로세스의 숫자 유효 그룹 ID를 반환합니다. ([`getegid(2)`](http://man7.org/linux/man-pages/man2/getegid.2)를 참조하세요.)

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getegid) {
  console.log(`Current gid: ${process.getegid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getegid) {
  console.log(`Current gid: ${process.getegid()}`);
}
```
:::

이 함수는 POSIX 플랫폼에서만 사용할 수 있습니다 (예: Windows 또는 Android 아님).

## `process.geteuid()` {#processgeteuid}

**Added in: v2.0.0**

- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.geteuid()` 메서드는 프로세스의 숫자 유효 사용자 ID를 반환합니다. ([`geteuid(2)`](http://man7.org/linux/man-pages/man2/geteuid.2)를 참조하세요.)

::: code-group
```js [ESM]
import process from 'node:process';

if (process.geteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.geteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
}
```
:::

이 함수는 POSIX 플랫폼에서만 사용할 수 있습니다 (예: Windows 또는 Android 아님).

## `process.getgid()` {#processgetgid}

**Added in: v0.1.31**

- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.getgid()` 메서드는 프로세스의 숫자 그룹 ID를 반환합니다. ([`getgid(2)`](http://man7.org/linux/man-pages/man2/getgid.2)를 참조하세요.)

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgid) {
  console.log(`Current gid: ${process.getgid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getgid) {
  console.log(`Current gid: ${process.getgid()}`);
}
```
:::

이 함수는 POSIX 플랫폼에서만 사용할 수 있습니다 (예: Windows 또는 Android 아님).

## `process.getgroups()` {#processgetgroups}

**Added in: v0.9.4**

- Returns: [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.getgroups()` 메서드는 보조 그룹 ID가 있는 배열을 반환합니다. POSIX는 유효 그룹 ID가 포함되어 있는지 명시하지 않지만 Node.js는 항상 포함되도록 보장합니다.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgroups) {
  console.log(process.getgroups()); // [ 16, 21, 297 ]
}
```

```js [CJS]
const process = require('node:process');

if (process.getgroups) {
  console.log(process.getgroups()); // [ 16, 21, 297 ]
}
```
:::

이 함수는 POSIX 플랫폼에서만 사용할 수 있습니다 (예: Windows 또는 Android 아님).


## `process.getuid()` {#processgetuid}

**Added in: v0.1.28**

- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.getuid()` 메서드는 프로세스의 숫자 사용자 ID를 반환합니다. ([`getuid(2)`](http://man7.org/linux/man-pages/man2/getuid.2) 참고)

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getuid) {
  console.log(`Current uid: ${process.getuid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getuid) {
  console.log(`Current uid: ${process.getuid()}`);
}
```
:::

이 함수는 POSIX 플랫폼(즉, Windows 또는 Android가 아닌 플랫폼)에서만 사용할 수 있습니다.

## `process.hasUncaughtExceptionCaptureCallback()` {#processhasuncaughtexceptioncapturecallback}

**Added in: v9.3.0**

- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`process.setUncaughtExceptionCaptureCallback()`](/ko/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn)을 사용하여 콜백이 설정되었는지 여부를 나타냅니다.

## `process.hrtime([time])` {#processhrtimetime}

**Added in: v0.7.6**

::: info [Stable: 3 - Legacy]
[Stable: 3](/ko/nodejs/api/documentation#stability-index) [안정성: 3](/ko/nodejs/api/documentation#stability-index) - 레거시. 대신 [`process.hrtime.bigint()`](/ko/nodejs/api/process#processhrtimebigint)를 사용하세요.
:::

- `time` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `process.hrtime()`에 대한 이전 호출의 결과
- 반환: [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

이것은 JavaScript에 `bigint`가 도입되기 전의 [`process.hrtime.bigint()`](/ko/nodejs/api/process#processhrtimebigint)의 레거시 버전입니다.

`process.hrtime()` 메서드는 현재 고해상도 실시간을 `[seconds, nanoseconds]` 튜플 `Array`로 반환합니다. 여기서 `nanoseconds`는 초 정밀도로 표현할 수 없는 실시간의 나머지 부분입니다.

`time`은 선택적 매개변수이며 현재 시간과 차이를 계산하기 위해 이전 `process.hrtime()` 호출의 결과여야 합니다. 전달된 매개변수가 튜플 `Array`가 아니면 `TypeError`가 발생합니다. 이전 `process.hrtime()` 호출 결과 대신 사용자 정의 배열을 전달하면 정의되지 않은 동작이 발생합니다.

이러한 시간은 과거의 임의 시간에 상대적이며 하루 중 시간과 관련이 없으므로 클럭 드리프트의 영향을 받지 않습니다. 주요 용도는 간격 사이의 성능을 측정하는 것입니다.

::: code-group
```js [ESM]
import { hrtime } from 'node:process';

const NS_PER_SEC = 1e9;
const time = hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = hrtime(time);
  // [ 1, 552 ]

  console.log(`Benchmark took ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds`);
  // Benchmark took 1000000552 nanoseconds
}, 1000);
```

```js [CJS]
const { hrtime } = require('node:process');

const NS_PER_SEC = 1e9;
const time = hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = hrtime(time);
  // [ 1, 552 ]

  console.log(`Benchmark took ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds`);
  // Benchmark took 1000000552 nanoseconds
}, 1000);
```
:::


## `process.hrtime.bigint()` {#processhrtimebigint}

**Added in: v10.7.0**

- 반환값: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

`bigint` 버전의 [`process.hrtime()`](/ko/nodejs/api/process#processhrtimetime) 메서드는 현재 고해상도 실제 시간을 나노초 단위의 `bigint`로 반환합니다.

[`process.hrtime()`](/ko/nodejs/api/process#processhrtimetime)와는 달리, 두 `bigint`의 차이를 직접 계산할 수 있으므로 추가 `time` 인수를 지원하지 않습니다.

::: code-group
```js [ESM]
import { hrtime } from 'node:process';

const start = hrtime.bigint();
// 191051479007711n

setTimeout(() => {
  const end = hrtime.bigint();
  // 191052633396993n

  console.log(`Benchmark took ${end - start} nanoseconds`);
  // Benchmark took 1154389282 nanoseconds
}, 1000);
```

```js [CJS]
const { hrtime } = require('node:process');

const start = hrtime.bigint();
// 191051479007711n

setTimeout(() => {
  const end = hrtime.bigint();
  // 191052633396993n

  console.log(`Benchmark took ${end - start} nanoseconds`);
  // Benchmark took 1154389282 nanoseconds
}, 1000);
```
:::

## `process.initgroups(user, extraGroup)` {#processinitgroupsuser-extragroup}

**Added in: v0.9.4**

- `user` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 사용자 이름 또는 숫자 식별자.
- `extraGroup` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 그룹 이름 또는 숫자 식별자.

`process.initgroups()` 메서드는 `/etc/group` 파일을 읽고 사용자가 멤버인 모든 그룹을 사용하여 그룹 액세스 목록을 초기화합니다. 이는 Node.js 프로세스가 `root` 액세스 권한 또는 `CAP_SETGID` 기능이 있어야 하는 권한 있는 작업입니다.

권한을 삭제할 때는 주의하십시오.

::: code-group
```js [ESM]
import { getgroups, initgroups, setgid } from 'node:process';

console.log(getgroups());         // [ 0 ]
initgroups('nodeuser', 1000);     // switch user
console.log(getgroups());         // [ 27, 30, 46, 1000, 0 ]
setgid(1000);                     // drop root gid
console.log(getgroups());         // [ 27, 30, 46, 1000 ]
```

```js [CJS]
const { getgroups, initgroups, setgid } = require('node:process');

console.log(getgroups());         // [ 0 ]
initgroups('nodeuser', 1000);     // switch user
console.log(getgroups());         // [ 27, 30, 46, 1000, 0 ]
setgid(1000);                     // drop root gid
console.log(getgroups());         // [ 27, 30, 46, 1000 ]
```
:::

이 함수는 POSIX 플랫폼(예: Windows 또는 Android가 아님)에서만 사용할 수 있습니다. 이 기능은 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 스레드에서 사용할 수 없습니다.


## `process.kill(pid[, signal])` {#processkillpid-signal}

**Added in: v0.0.6**

- `pid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스 ID
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 보낼 신호, 문자열 또는 숫자로 지정합니다. **기본값:** `'SIGTERM'`.

`process.kill()` 메서드는 `pid`로 식별되는 프로세스에 `signal`을 보냅니다.

신호 이름은 `'SIGINT'` 또는 `'SIGHUP'`와 같은 문자열입니다. 자세한 내용은 [신호 이벤트](/ko/nodejs/api/process#signal-events) 및 [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2)를 참조하세요.

대상 `pid`가 존재하지 않으면 이 메서드는 오류를 발생시킵니다. 특별한 경우로, `0`의 신호를 사용하여 프로세스의 존재 여부를 테스트할 수 있습니다. Windows 플랫폼은 `pid`가 프로세스 그룹을 종료하는 데 사용되면 오류를 발생시킵니다.

이 함수의 이름이 `process.kill()`임에도 불구하고, 실제로는 `kill` 시스템 호출과 같이 신호 전송기일 뿐입니다. 전송된 신호는 대상 프로세스를 종료하는 것 외에 다른 작업을 수행할 수도 있습니다.

::: code-group
```js [ESM]
import process, { kill } from 'node:process';

process.on('SIGHUP', () => {
  console.log('Got SIGHUP signal.');
});

setTimeout(() => {
  console.log('Exiting.');
  process.exit(0);
}, 100);

kill(process.pid, 'SIGHUP');
```

```js [CJS]
const process = require('node:process');

process.on('SIGHUP', () => {
  console.log('Got SIGHUP signal.');
});

setTimeout(() => {
  console.log('Exiting.');
  process.exit(0);
}, 100);

process.kill(process.pid, 'SIGHUP');
```
:::

Node.js 프로세스가 `SIGUSR1`을 수신하면 Node.js는 디버거를 시작합니다. [신호 이벤트](/ko/nodejs/api/process#signal-events)를 참조하세요.

## `process.loadEnvFile(path)` {#processloadenvfilepath}

**Added in: v21.7.0, v20.12.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type). **기본값:** `'./.env'`

`.env` 파일을 `process.env`에 로드합니다. `.env` 파일에서 `NODE_OPTIONS`을 사용해도 Node.js에 아무런 영향을 미치지 않습니다.

::: code-group
```js [CJS]
const { loadEnvFile } = require('node:process');
loadEnvFile();
```

```js [ESM]
import { loadEnvFile } from 'node:process';
loadEnvFile();
```
:::


## `process.mainModule` {#processmainmodule}

**Added in: v0.1.17**

**Deprecated since: v14.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - Deprecated: [`require.main`](/ko/nodejs/api/modules#accessing-the-main-module)을 대신 사용하세요.
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.mainModule` 속성은 [`require.main`](/ko/nodejs/api/modules#accessing-the-main-module)을 검색하는 대체 방법을 제공합니다. 차이점은 런타임에 메인 모듈이 변경될 경우, [`require.main`](/ko/nodejs/api/modules#accessing-the-main-module)이 변경이 발생하기 전에 require된 모듈에서 원래 메인 모듈을 계속 참조할 수 있다는 것입니다. 일반적으로 둘 다 동일한 모듈을 참조한다고 가정하는 것이 안전합니다.

[`require.main`](/ko/nodejs/api/modules#accessing-the-main-module)과 마찬가지로, 엔트리 스크립트가 없으면 `process.mainModule`은 `undefined`가 됩니다.

## `process.memoryUsage()` {#processmemoryusage}


::: info [History]
| Version | Changes |
| --- | --- |
| v13.9.0, v12.17.0 | 반환된 객체에 `arrayBuffers`가 추가되었습니다. |
| v7.2.0 | 반환된 객체에 `external`이 추가되었습니다. |
| v0.1.16 | Added in: v0.1.16 |
:::

- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `rss` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `heapTotal` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `heapUsed` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `external` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `arrayBuffers` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

Node.js 프로세스의 메모리 사용량을 바이트 단위로 설명하는 객체를 반환합니다.



::: code-group
```js [ESM]
import { memoryUsage } from 'node:process';

console.log(memoryUsage());
// Prints:
// {
//  rss: 4935680,
//  heapTotal: 1826816,
//  heapUsed: 650472,
//  external: 49879,
//  arrayBuffers: 9386
// }
```

```js [CJS]
const { memoryUsage } = require('node:process');

console.log(memoryUsage());
// Prints:
// {
//  rss: 4935680,
//  heapTotal: 1826816,
//  heapUsed: 650472,
//  external: 49879,
//  arrayBuffers: 9386
// }
```
:::

- `heapTotal` 및 `heapUsed`는 V8의 메모리 사용량을 나타냅니다.
- `external`은 V8에서 관리하는 JavaScript 객체에 바인딩된 C++ 객체의 메모리 사용량을 나타냅니다.
- `rss` (Resident Set Size)는 프로세스에 할당된 총 메모리의 하위 집합인 메인 메모리 장치에서 점유하는 공간의 양이며, 모든 C++ 및 JavaScript 객체 및 코드를 포함합니다.
- `arrayBuffers`는 모든 Node.js [`Buffer`](/ko/nodejs/api/buffer)를 포함하여 `ArrayBuffer` 및 `SharedArrayBuffer`에 할당된 메모리를 나타냅니다. 이것은 `external` 값에도 포함됩니다. Node.js가 임베디드 라이브러리로 사용되는 경우, `ArrayBuffer` 할당이 추적되지 않을 수 있으므로 이 값은 `0`일 수 있습니다.

[`Worker`](/ko/nodejs/api/worker_threads#class-worker) 스레드를 사용하는 경우, `rss`는 전체 프로세스에 유효한 값이지만 다른 필드는 현재 스레드만 참조합니다.

`process.memoryUsage()` 메서드는 각 페이지를 반복하여 메모리 사용량에 대한 정보를 수집하므로 프로그램 메모리 할당에 따라 느릴 수 있습니다.


## `process.memoryUsage.rss()` {#processmemoryusagerss}

**추가된 버전: v15.6.0, v14.18.0**

- 반환: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.memoryUsage.rss()` 메서드는 Resident Set Size(RSS)를 바이트 단위로 나타내는 정수를 반환합니다.

Resident Set Size는 프로세스를 위해 할당된 총 메모리의 하위 집합인 주 메모리 장치에 점유된 공간의 양이며, 모든 C++ 및 JavaScript 객체와 코드를 포함합니다.

이는 `process.memoryUsage()`에서 제공하는 `rss` 속성과 동일한 값이지만 `process.memoryUsage.rss()`가 더 빠릅니다.

::: code-group
```js [ESM]
import { memoryUsage } from 'node:process';

console.log(memoryUsage.rss());
// 35655680
```

```js [CJS]
const { memoryUsage } = require('node:process');

console.log(memoryUsage.rss());
// 35655680
```
:::

## `process.nextTick(callback[, ...args])` {#processnexttickcallback-args}

::: info [히스토리]
| 버전 | 변경 사항 |
|---|---|
| v22.7.0, v20.18.0 | 안정성이 Legacy로 변경되었습니다. |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v1.8.1 | `callback` 뒤에 추가 인수가 지원됩니다. |
| v0.1.26 | 추가된 버전: v0.1.26 |
:::

::: info [안정성: 3 - 레거시]
[안정성: 3](/ko/nodejs/api/documentation#stability-index) [안정성: 3](/ko/nodejs/api/documentation#stability-index) - 레거시: 대신 [`queueMicrotask()`](/ko/nodejs/api/globals#queuemicrotaskcallback)를 사용하세요.
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `callback`을 호출할 때 전달할 추가 인수

`process.nextTick()`은 "다음 틱 큐"에 `callback`을 추가합니다. 이 큐는 JavaScript 스택의 현재 작업이 완료될 때까지 완전히 비워진 후 이벤트 루프가 계속 진행됩니다. `process.nextTick()`을 재귀적으로 호출하면 무한 루프가 발생할 수 있습니다. 자세한 내용은 [이벤트 루프](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick#understanding-processnexttick) 가이드를 참조하세요.

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

console.log('start');
nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// nextTick callback
```

```js [CJS]
const { nextTick } = require('node:process');

console.log('start');
nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// nextTick callback
```
:::

이는 객체가 생성된 *후* 이벤트 핸들러를 할당할 수 있는 기회를 사용자에게 제공하기 위해 API를 개발할 때 중요합니다.

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

function MyThing(options) {
  this.setupOptions(options);

  nextTick(() => {
    this.startDoingStuff();
  });
}

const thing = new MyThing();
thing.getReadyForStuff();

// thing.startDoingStuff()가 호출되는 시점은 지금이며, 이전이 아닙니다.
```

```js [CJS]
const { nextTick } = require('node:process');

function MyThing(options) {
  this.setupOptions(options);

  nextTick(() => {
    this.startDoingStuff();
  });
}

const thing = new MyThing();
thing.getReadyForStuff();

// thing.startDoingStuff()가 호출되는 시점은 지금이며, 이전이 아닙니다.
```
:::

API는 100% 동기적이거나 100% 비동기적이어야 합니다. 다음 예를 고려해 보세요.

```js [ESM]
// 경고! 사용하지 마세요! 위험합니다!
function maybeSync(arg, cb) {
  if (arg) {
    cb();
    return;
  }

  fs.stat('file', cb);
}
```
이 API는 다음과 같은 경우에 위험합니다.

```js [ESM]
const maybeTrue = Math.random() > 0.5;

maybeSync(maybeTrue, () => {
  foo();
});

bar();
```
`foo()` 또는 `bar()`가 먼저 호출될지 명확하지 않습니다.

다음 접근 방식이 훨씬 좋습니다.

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

function definitelyAsync(arg, cb) {
  if (arg) {
    nextTick(cb);
    return;
  }

  fs.stat('file', cb);
}
```

```js [CJS]
const { nextTick } = require('node:process');

function definitelyAsync(arg, cb) {
  if (arg) {
    nextTick(cb);
    return;
  }

  fs.stat('file', cb);
}
```
:::


### `queueMicrotask()` 대 `process.nextTick()` 사용 시기 {#when-to-use-queuemicrotask-vs-processnexttick}

[`queueMicrotask()`](/ko/nodejs/api/globals#queuemicrotaskcallback) API는 `process.nextTick()`의 대안이며, 해결된 프라미스의 then, catch 및 finally 핸들러를 실행하는 데 사용되는 동일한 마이크로태스크 큐를 사용하여 함수의 실행을 지연시킵니다. Node.js 내에서 "다음 틱 큐"가 비워질 때마다 마이크로태스크 큐가 바로 뒤따라 비워집니다.

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

Promise.resolve().then(() => console.log(2));
queueMicrotask(() => console.log(3));
nextTick(() => console.log(1));
// 출력:
// 1
// 2
// 3
```

```js [CJS]
const { nextTick } = require('node:process');

Promise.resolve().then(() => console.log(2));
queueMicrotask(() => console.log(3));
nextTick(() => console.log(1));
// 출력:
// 1
// 2
// 3
```
:::

대부분의 사용자 영역 사용 사례에서 `queueMicrotask()` API는 여러 JavaScript 플랫폼 환경에서 작동하는 실행 지연을 위한 이식 가능하고 안정적인 메커니즘을 제공하며 `process.nextTick()`보다 선호되어야 합니다. 간단한 시나리오에서 `queueMicrotask()`는 `process.nextTick()`의 드롭인 대체물이 될 수 있습니다.

```js [ESM]
console.log('시작');
queueMicrotask(() => {
  console.log('마이크로태스크 콜백');
});
console.log('예약됨');
// 출력:
// 시작
// 예약됨
// 마이크로태스크 콜백
```
두 API의 주목할 만한 차이점 중 하나는 `process.nextTick()`이 호출될 때 지연된 함수에 인수로 전달될 추가 값을 지정할 수 있다는 것입니다. `queueMicrotask()`로 동일한 결과를 얻으려면 클로저 또는 바운드 함수를 사용해야 합니다.

```js [ESM]
function deferred(a, b) {
  console.log('마이크로태스크', a + b);
}

console.log('시작');
queueMicrotask(deferred.bind(undefined, 1, 2));
console.log('예약됨');
// 출력:
// 시작
// 예약됨
// 마이크로태스크 3
```
다음 틱 큐와 마이크로태스크 큐 내에서 발생하는 오류를 처리하는 방식에 약간의 차이가 있습니다. 큐에 대기된 마이크로태스크 콜백 내에서 발생한 오류는 가능한 경우 큐에 대기된 콜백 내에서 처리해야 합니다. 그렇지 않은 경우 `process.on('uncaughtException')` 이벤트 핸들러를 사용하여 오류를 캡처하고 처리할 수 있습니다.

확실하지 않은 경우 `process.nextTick()`의 특정 기능이 필요하지 않으면 `queueMicrotask()`를 사용하십시오.


## `process.noDeprecation` {#processnodeprecation}

**추가된 버전: v0.8.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`process.noDeprecation` 속성은 현재 Node.js 프로세스에 `--no-deprecation` 플래그가 설정되어 있는지 여부를 나타냅니다. 이 플래그의 동작에 대한 자세한 내용은 [`'warning'` 이벤트](/ko/nodejs/api/process#event-warning) 및 [`emitWarning()` 메서드](/ko/nodejs/api/process#processemitwarningwarning-type-code-ctor)에 대한 문서를 참조하십시오.

## `process.permission` {#processpermission}

**추가된 버전: v20.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

이 API는 [`--permission`](/ko/nodejs/api/cli#--permission) 플래그를 통해 사용할 수 있습니다.

`process.permission`은 현재 프로세스의 권한을 관리하는 데 사용되는 메서드를 가진 객체입니다. 추가 문서는 [권한 모델](/ko/nodejs/api/permissions#permission-model)에서 확인할 수 있습니다.

### `process.permission.has(scope[, reference])` {#processpermissionhasscope-reference}

**추가된 버전: v20.0.0**

- `scope` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `reference` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

프로세스가 주어진 스코프와 참조에 액세스할 수 있는지 확인합니다. 참조가 제공되지 않으면 전역 스코프가 가정됩니다. 예를 들어, `process.permission.has('fs.read')`는 프로세스에 모든 파일 시스템 읽기 권한이 있는지 확인합니다.

참조는 제공된 스코프에 따라 의미가 있습니다. 예를 들어, 스코프가 파일 시스템일 때 참조는 파일 및 폴더를 의미합니다.

사용 가능한 스코프는 다음과 같습니다.

- `fs` - 모든 파일 시스템
- `fs.read` - 파일 시스템 읽기 작업
- `fs.write` - 파일 시스템 쓰기 작업
- `child` - 자식 프로세스 생성 작업
- `worker` - 워커 스레드 생성 작업

```js [ESM]
// 프로세스가 README 파일을 읽을 수 있는 권한이 있는지 확인합니다.
process.permission.has('fs.read', './README.md');
// 프로세스에 읽기 권한 작업이 있는지 확인합니다.
process.permission.has('fs.read');
```

## `process.pid` {#processpid}

**Added in: v0.1.15**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.pid` 속성은 프로세스의 PID를 반환합니다.

::: code-group
```js [ESM]
import { pid } from 'node:process';

console.log(`이 프로세스는 pid ${pid}입니다.`);
```

```js [CJS]
const { pid } = require('node:process');

console.log(`이 프로세스는 pid ${pid}입니다.`);
```
:::

## `process.platform` {#processplatform}

**Added in: v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.platform` 속성은 Node.js 바이너리가 컴파일된 운영 체제 플랫폼을 식별하는 문자열을 반환합니다.

현재 가능한 값은 다음과 같습니다:

- `'aix'`
- `'darwin'`
- `'freebsd'`
- `'linux'`
- `'openbsd'`
- `'sunos'`
- `'win32'`

::: code-group
```js [ESM]
import { platform } from 'node:process';

console.log(`이 플랫폼은 ${platform}입니다.`);
```

```js [CJS]
const { platform } = require('node:process');

console.log(`이 플랫폼은 ${platform}입니다.`);
```
:::

Node.js가 Android 운영 체제에서 빌드된 경우 `'android'` 값이 반환될 수도 있습니다. 그러나 Node.js의 Android 지원은 [실험적](https://github.com/nodejs/node/blob/HEAD/BUILDING.md#android)입니다.

## `process.ppid` {#processppid}

**Added in: v9.2.0, v8.10.0, v6.13.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.ppid` 속성은 현재 프로세스의 부모 프로세스 PID를 반환합니다.

::: code-group
```js [ESM]
import { ppid } from 'node:process';

console.log(`부모 프로세스는 pid ${ppid}입니다.`);
```

```js [CJS]
const { ppid } = require('node:process');

console.log(`부모 프로세스는 pid ${ppid}입니다.`);
```
:::

## `process.release` {#processrelease}

::: info [History]
| Version | Changes |
| --- | --- |
| v4.2.0 | `lts` 속성이 이제 지원됩니다. |
| v3.0.0 | Added in: v3.0.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.release` 속성은 소스 tarball 및 헤더 전용 tarball에 대한 URL을 포함하여 현재 릴리스와 관련된 메타데이터가 포함된 `Object`를 반환합니다.

`process.release`는 다음 속성을 포함합니다:

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 항상 `'node'` 값이 됩니다.
- `sourceUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 현재 릴리스의 소스 코드가 포함된 *<code>.tar.gz</code>* 파일을 가리키는 절대 URL입니다.
- `headersUrl`[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 현재 릴리스의 소스 헤더 파일만 포함된 *<code>.tar.gz</code>* 파일을 가리키는 절대 URL입니다. 이 파일은 전체 소스 파일보다 훨씬 작으며 Node.js 네이티브 애드온을 컴파일하는 데 사용할 수 있습니다.
- `libUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 현재 릴리스의 아키텍처 및 버전에 일치하는 *<code>node.lib</code>* 파일을 가리키는 절대 URL입니다. 이 파일은 Node.js 네이티브 애드온을 컴파일하는 데 사용됩니다. *이 속성은 Node.js의 Windows 빌드에만 존재하며 다른 모든 플랫폼에서는 누락됩니다.*
- `lts` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 이 릴리스의 [LTS](https://github.com/nodejs/Release) 레이블을 식별하는 문자열 레이블입니다. 이 속성은 LTS 릴리스에만 존재하며 *Current* 릴리스를 포함한 다른 모든 릴리스 유형에 대해 `undefined`입니다. 유효한 값에는 더 이상 지원되지 않는 LTS 릴리스 코드 이름을 포함하여 LTS 릴리스 코드 이름이 포함됩니다.
    - 14.15.0부터 시작하는 14.x LTS 라인의 경우 `'Fermium'`입니다.
    - 16.13.0부터 시작하는 16.x LTS 라인의 경우 `'Gallium'`입니다.
    - 18.12.0부터 시작하는 18.x LTS 라인의 경우 `'Hydrogen'`입니다. 다른 LTS 릴리스 코드 이름은 [Node.js 변경 로그 아카이브](https://github.com/nodejs/node/blob/HEAD/doc/changelogs/CHANGELOG_ARCHIVE.md)를 참조하십시오.

```js [ESM]
{
  name: 'node',
  lts: 'Hydrogen',
  sourceUrl: 'https://nodejs.org/download/release/v18.12.0/node-v18.12.0.tar.gz',
  headersUrl: 'https://nodejs.org/download/release/v18.12.0/node-v18.12.0-headers.tar.gz',
  libUrl: 'https://nodejs.org/download/release/v18.12.0/win-x64/node.lib'
}
```
소스 트리의 비 릴리스 버전에서 사용자 정의 빌드의 경우 `name` 속성만 존재할 수 있습니다. 추가 속성이 존재하는 것으로 간주해서는 안 됩니다.


## `process.report` {#processreport}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v13.12.0, v12.17.0 | 이 API는 더 이상 실험적이지 않습니다. |
| v11.8.0 | 추가됨: v11.8.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.report`는 현재 프로세스에 대한 진단 보고서를 생성하는 데 사용되는 메서드를 가진 객체입니다. 추가 문서는 [보고서 문서](/ko/nodejs/api/report)에서 확인할 수 있습니다.

### `process.report.compact` {#processreportcompact}

**추가됨: v13.12.0, v12.17.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

보고서를 사람이 소비하도록 설계된 기본 다중 행 형식보다 로그 처리 시스템에서 더 쉽게 소비할 수 있는 압축 형식의 단일 행 JSON으로 작성합니다.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`보고서가 압축되었습니까? ${report.compact}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`보고서가 압축되었습니까? ${report.compact}`);
```
:::

### `process.report.directory` {#processreportdirectory}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v13.12.0, v12.17.0 | 이 API는 더 이상 실험적이지 않습니다. |
| v11.12.0 | 추가됨: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

보고서가 작성되는 디렉터리입니다. 기본값은 빈 문자열이며, 이는 보고서가 Node.js 프로세스의 현재 작업 디렉터리에 작성됨을 나타냅니다.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`보고서 디렉터리는 ${report.directory}입니다.`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`보고서 디렉터리는 ${report.directory}입니다.`);
```
:::

### `process.report.filename` {#processreportfilename}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v13.12.0, v12.17.0 | 이 API는 더 이상 실험적이지 않습니다. |
| v11.12.0 | 추가됨: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

보고서가 작성되는 파일 이름입니다. 빈 문자열로 설정하면 출력 파일 이름은 타임스탬프, PID 및 시퀀스 번호로 구성됩니다. 기본값은 빈 문자열입니다.

`process.report.filename`의 값이 `'stdout'` 또는 `'stderr'`로 설정되면 보고서는 각각 프로세스의 stdout 또는 stderr에 기록됩니다.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`보고서 파일 이름은 ${report.filename}입니다.`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`보고서 파일 이름은 ${report.filename}입니다.`);
```
:::


### `process.report.getReport([err])` {#processreportgetreporterr}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v13.12.0, v12.17.0 | 이 API는 더 이상 실험적이지 않습니다. |
| v11.8.0 | 추가됨: v11.8.0 |
:::

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) JavaScript 스택을 보고하는 데 사용되는 사용자 정의 오류입니다.
- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

실행 중인 프로세스에 대한 진단 보고서의 JavaScript 객체 표현을 반환합니다. 보고서의 JavaScript 스택 추적은 있는 경우 `err`에서 가져옵니다.

::: code-group
```js [ESM]
import { report } from 'node:process';
import util from 'node:util';

const data = report.getReport();
console.log(data.header.nodejsVersion);

// process.report.writeReport()와 유사합니다.
import fs from 'node:fs';
fs.writeFileSync('my-report.log', util.inspect(data), 'utf8');
```

```js [CJS]
const { report } = require('node:process');
const util = require('node:util');

const data = report.getReport();
console.log(data.header.nodejsVersion);

// process.report.writeReport()와 유사합니다.
const fs = require('node:fs');
fs.writeFileSync('my-report.log', util.inspect(data), 'utf8');
```
:::

추가 문서는 [보고서 문서](/ko/nodejs/api/report)에서 확인할 수 있습니다.

### `process.report.reportOnFatalError` {#processreportreportonfatalerror}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0, v14.17.0 | 이 API는 더 이상 실험적이지 않습니다. |
| v11.12.0 | 추가됨: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`true`이면 메모리 부족 오류 또는 C++ 어설션 실패와 같은 치명적인 오류에 대한 진단 보고서가 생성됩니다.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`치명적인 오류 보고서: ${report.reportOnFatalError}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`치명적인 오류 보고서: ${report.reportOnFatalError}`);
```
:::


### `process.report.reportOnSignal` {#processreportreportonsignal}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.12.0, v12.17.0 | 이 API는 더 이상 실험적이지 않습니다. |
| v11.12.0 | 추가됨: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`true`인 경우 프로세스가 `process.report.signal`에 지정된 신호를 수신할 때 진단 보고서가 생성됩니다.



::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Report on signal: ${report.reportOnSignal}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Report on signal: ${report.reportOnSignal}`);
```
:::

### `process.report.reportOnUncaughtException` {#processreportreportonuncaughtexception}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.12.0, v12.17.0 | 이 API는 더 이상 실험적이지 않습니다. |
| v11.12.0 | 추가됨: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`true`인 경우, 잡히지 않은 예외에서 진단 보고서가 생성됩니다.



::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Report on exception: ${report.reportOnUncaughtException}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Report on exception: ${report.reportOnUncaughtException}`);
```
:::

### `process.report.excludeEnv` {#processreportexcludeenv}

**추가됨: v23.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`true`인 경우 환경 변수 없이 진단 보고서가 생성됩니다.

### `process.report.signal` {#processreportsignal}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.12.0, v12.17.0 | 이 API는 더 이상 실험적이지 않습니다. |
| v11.12.0 | 추가됨: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

진단 보고서 생성을 트리거하는 데 사용되는 신호입니다. 기본값은 `'SIGUSR2'`입니다.



::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Report signal: ${report.signal}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Report signal: ${report.signal}`);
```
:::


### `process.report.writeReport([filename][, err])` {#processreportwritereportfilename-err}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.12.0, v12.17.0 | 이 API는 더 이상 실험적이지 않습니다. |
| v11.8.0 | v11.8.0에 추가됨 |
:::

-  `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 보고서가 쓰여질 파일의 이름. 이는 `process.report.directory`에 지정된 디렉터리 또는 지정되지 않은 경우 Node.js 프로세스의 현재 작업 디렉터리에 추가될 상대 경로여야 합니다.
-  `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) JavaScript 스택을 보고하는 데 사용되는 사용자 지정 오류입니다.
-  반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 생성된 보고서의 파일 이름을 반환합니다.

진단 보고서를 파일에 씁니다. `filename`이 제공되지 않으면 기본 파일 이름에는 날짜, 시간, PID 및 시퀀스 번호가 포함됩니다. 보고서의 JavaScript 스택 추적은 존재하는 경우 `err`에서 가져옵니다.

`filename` 값이 `'stdout'` 또는 `'stderr'`로 설정되면 보고서는 각각 프로세스의 stdout 또는 stderr에 쓰여집니다.

::: code-group
```js [ESM]
import { report } from 'node:process';

report.writeReport();
```

```js [CJS]
const { report } = require('node:process');

report.writeReport();
```
:::

자세한 설명서는 [보고서 설명서](/ko/nodejs/api/report)에서 확인할 수 있습니다.

## `process.resourceUsage()` {#processresourceusage}

**추가됨: v12.6.0**

- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 현재 프로세스의 리소스 사용량입니다. 이러한 모든 값은 [`uv_rusage_t` 구조체](https://docs.libuv.org/en/v1.x/misc#c.uv_rusage_t)를 반환하는 `uv_getrusage` 호출에서 가져온 것입니다.
    - `userCPUTime` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 마이크로초 단위로 계산된 `ru_utime`에 매핑됩니다. 이는 [`process.cpuUsage().user`](/ko/nodejs/api/process#processcpuusagepreviousvalue)와 동일한 값입니다.
    - `systemCPUTime` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 마이크로초 단위로 계산된 `ru_stime`에 매핑됩니다. 이는 [`process.cpuUsage().system`](/ko/nodejs/api/process#processcpuusagepreviousvalue)과 동일한 값입니다.
    - `maxRSS` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 킬로바이트 단위로 사용된 최대 상주 집합 크기인 `ru_maxrss`에 매핑됩니다.
    - `sharedMemorySize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `ru_ixrss`에 매핑되지만 어떤 플랫폼에서도 지원되지 않습니다.
    - `unsharedDataSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `ru_idrss`에 매핑되지만 어떤 플랫폼에서도 지원되지 않습니다.
    - `unsharedStackSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `ru_isrss`에 매핑되지만 어떤 플랫폼에서도 지원되지 않습니다.
    - `minorPageFault` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스의 마이너 페이지 폴트 수인 `ru_minflt`에 매핑됩니다. 자세한 내용은 [이 문서](https://en.wikipedia.org/wiki/Page_fault#Minor)를 참조하십시오.
    - `majorPageFault` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스의 메이저 페이지 폴트 수인 `ru_majflt`에 매핑됩니다. 자세한 내용은 [이 문서](https://en.wikipedia.org/wiki/Page_fault#Major)를 참조하십시오. 이 필드는 Windows에서 지원되지 않습니다.
    - `swappedOut` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `ru_nswap`에 매핑되지만 어떤 플랫폼에서도 지원되지 않습니다.
    - `fsRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 파일 시스템이 입력을 수행해야 했던 횟수인 `ru_inblock`에 매핑됩니다.
    - `fsWrite` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 파일 시스템이 출력을 수행해야 했던 횟수인 `ru_oublock`에 매핑됩니다.
    - `ipcSent` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `ru_msgsnd`에 매핑되지만 어떤 플랫폼에서도 지원되지 않습니다.
    - `ipcReceived` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `ru_msgrcv`에 매핑되지만 어떤 플랫폼에서도 지원되지 않습니다.
    - `signalsCount` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `ru_nsignals`에 매핑되지만 어떤 플랫폼에서도 지원되지 않습니다.
    - `voluntaryContextSwitches` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스가 시간 조각이 완료되기 전에 프로세서를 자발적으로 포기하여 (일반적으로 리소스 가용성을 기다리기 위해) CPU 컨텍스트 전환이 발생한 횟수인 `ru_nvcsw`에 매핑됩니다. 이 필드는 Windows에서 지원되지 않습니다.
    - `involuntaryContextSwitches` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 우선 순위가 더 높은 프로세스가 실행 가능하게 되거나 현재 프로세스가 시간 조각을 초과하여 CPU 컨텍스트 전환이 발생한 횟수인 `ru_nivcsw`에 매핑됩니다. 이 필드는 Windows에서 지원되지 않습니다.
  
 



::: code-group
```js [ESM]
import { resourceUsage } from 'node:process';

console.log(resourceUsage());
/*
  출력 결과:
  {
    userCPUTime: 82872,
    systemCPUTime: 4143,
    maxRSS: 33164,
    sharedMemorySize: 0,
    unsharedDataSize: 0,
    unsharedStackSize: 0,
    minorPageFault: 2469,
    majorPageFault: 0,
    swappedOut: 0,
    fsRead: 0,
    fsWrite: 8,
    ipcSent: 0,
    ipcReceived: 0,
    signalsCount: 0,
    voluntaryContextSwitches: 79,
    involuntaryContextSwitches: 1
  }
*/
```

```js [CJS]
const { resourceUsage } = require('node:process');

console.log(resourceUsage());
/*
  출력 결과:
  {
    userCPUTime: 82872,
    systemCPUTime: 4143,
    maxRSS: 33164,
    sharedMemorySize: 0,
    unsharedDataSize: 0,
    unsharedStackSize: 0,
    minorPageFault: 2469,
    majorPageFault: 0,
    swappedOut: 0,
    fsRead: 0,
    fsWrite: 8,
    ipcSent: 0,
    ipcReceived: 0,
    signalsCount: 0,
    voluntaryContextSwitches: 79,
    involuntaryContextSwitches: 1
  }
*/
```
:::


## `process.send(message[, sendHandle[, options]][, callback])` {#processsendmessage-sendhandle-options-callback}

**추가된 버전: v0.5.9**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<net.Server\>](/ko/nodejs/api/net#class-netserver) | [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 특정 유형의 핸들 전송을 매개변수화하는 데 사용됩니다. `options`는 다음 속성을 지원합니다:
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `net.Socket` 인스턴스를 전달할 때 사용할 수 있는 값입니다. `true`이면 소켓이 전송 프로세스에서 열린 상태로 유지됩니다. **기본값:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Node.js가 IPC 채널로 생성된 경우 `process.send()` 메서드를 사용하여 부모 프로세스로 메시지를 보낼 수 있습니다. 메시지는 부모의 [`ChildProcess`](/ko/nodejs/api/child_process#class-childprocess) 객체에서 [`'message'`](/ko/nodejs/api/child_process#event-message) 이벤트로 수신됩니다.

Node.js가 IPC 채널로 생성되지 않은 경우 `process.send`는 `undefined`가 됩니다.

메시지는 직렬화 및 파싱을 거칩니다. 결과 메시지는 원래 보낸 메시지와 동일하지 않을 수 있습니다.

## `process.setegid(id)` {#processsetegidid}

**추가된 버전: v2.0.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 그룹 이름 또는 ID

`process.setegid()` 메서드는 프로세스의 유효 그룹 ID를 설정합니다. ([`setegid(2)`](http://man7.org/linux/man-pages/man2/setegid.2) 참조.) `id`는 숫자 ID 또는 그룹 이름 문자열로 전달될 수 있습니다. 그룹 이름이 지정되면 이 메서드는 연결된 숫자 ID를 확인하는 동안 차단됩니다.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getegid && process.setegid) {
  console.log(`Current gid: ${process.getegid()}`);
  try {
    process.setegid(501);
    console.log(`New gid: ${process.getegid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getegid && process.setegid) {
  console.log(`Current gid: ${process.getegid()}`);
  try {
    process.setegid(501);
    console.log(`New gid: ${process.getegid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```
:::

이 함수는 POSIX 플랫폼(예: Windows 또는 Android)에서만 사용할 수 있습니다. 이 기능은 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 스레드에서는 사용할 수 없습니다.


## `process.seteuid(id)` {#processseteuidid}

**추가된 버전: v2.0.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 사용자 이름 또는 ID

`process.seteuid()` 메서드는 프로세스의 유효 사용자 ID를 설정합니다. ([`seteuid(2)`](http://man7.org/linux/man-pages/man2/seteuid.2) 참조). `id`는 숫자 ID 또는 사용자 이름 문자열로 전달할 수 있습니다. 사용자 이름이 지정된 경우, 이 메서드는 관련된 숫자 ID를 확인하는 동안 차단됩니다.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.geteuid && process.seteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
  try {
    process.seteuid(501);
    console.log(`New uid: ${process.geteuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.geteuid && process.seteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
  try {
    process.seteuid(501);
    console.log(`New uid: ${process.geteuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```
:::

이 함수는 POSIX 플랫폼(즉, Windows 또는 Android가 아님)에서만 사용할 수 있습니다. 이 기능은 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 스레드에서는 사용할 수 없습니다.

## `process.setgid(id)` {#processsetgidid}

**추가된 버전: v0.1.31**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 그룹 이름 또는 ID

`process.setgid()` 메서드는 프로세스의 그룹 ID를 설정합니다. ([`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2) 참조). `id`는 숫자 ID 또는 그룹 이름 문자열로 전달할 수 있습니다. 그룹 이름이 지정된 경우, 이 메서드는 관련된 숫자 ID를 확인하는 동안 차단됩니다.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgid && process.setgid) {
  console.log(`Current gid: ${process.getgid()}`);
  try {
    process.setgid(501);
    console.log(`New gid: ${process.getgid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getgid && process.setgid) {
  console.log(`Current gid: ${process.getgid()}`);
  try {
    process.setgid(501);
    console.log(`New gid: ${process.getgid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```
:::

이 함수는 POSIX 플랫폼(즉, Windows 또는 Android가 아님)에서만 사용할 수 있습니다. 이 기능은 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 스레드에서는 사용할 수 없습니다.


## `process.setgroups(groups)` {#processsetgroupsgroups}

**Added in: v0.9.4**

- `groups` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.setgroups()` 메서드는 Node.js 프로세스의 추가 그룹 ID를 설정합니다. 이 작업은 권한이 필요한 작업이며 Node.js 프로세스가 `root`이거나 `CAP_SETGID` 권한을 가지고 있어야 합니다.

`groups` 배열은 숫자 그룹 ID, 그룹 이름 또는 둘 다를 포함할 수 있습니다.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgroups && process.setgroups) {
  try {
    process.setgroups([501]);
    console.log(process.getgroups()); // new groups
  } catch (err) {
    console.error(`Failed to set groups: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getgroups && process.setgroups) {
  try {
    process.setgroups([501]);
    console.log(process.getgroups()); // new groups
  } catch (err) {
    console.error(`Failed to set groups: ${err}`);
  }
}
```
:::

이 함수는 POSIX 플랫폼 (예: Windows 또는 Android가 아님)에서만 사용할 수 있습니다. 이 기능은 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 스레드에서는 사용할 수 없습니다.

## `process.setuid(id)` {#processsetuidid}

**Added in: v0.1.28**

- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.setuid(id)` 메서드는 프로세스의 사용자 ID를 설정합니다. ([`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2) 참조). `id`는 숫자 ID 또는 사용자 이름 문자열로 전달될 수 있습니다. 사용자 이름이 지정되면 메서드는 관련된 숫자 ID를 확인하는 동안 차단됩니다.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getuid && process.setuid) {
  console.log(`Current uid: ${process.getuid()}`);
  try {
    process.setuid(501);
    console.log(`New uid: ${process.getuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getuid && process.setuid) {
  console.log(`Current uid: ${process.getuid()}`);
  try {
    process.setuid(501);
    console.log(`New uid: ${process.getuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```
:::

이 함수는 POSIX 플랫폼 (예: Windows 또는 Android가 아님)에서만 사용할 수 있습니다. 이 기능은 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 스레드에서는 사용할 수 없습니다.


## `process.setSourceMapsEnabled(val)` {#processsetsourcemapsenabledval}

**Added in: v16.6.0, v14.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - Experimental
:::

- `val` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

이 함수는 스택 추적에 대한 [Source Map v3](https://sourcemaps.info/spec) 지원을 활성화하거나 비활성화합니다.

명령줄 옵션 `--enable-source-maps`로 Node.js 프로세스를 시작하는 것과 동일한 기능을 제공합니다.

소스 맵이 활성화된 후에 로드된 JavaScript 파일의 소스 맵만 구문 분석되고 로드됩니다.

## `process.setUncaughtExceptionCaptureCallback(fn)` {#processsetuncaughtexceptioncapturecallbackfn}

**Added in: v9.3.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

`process.setUncaughtExceptionCaptureCallback()` 함수는 잡히지 않은 예외가 발생할 때 호출될 함수를 설정합니다. 이 함수는 예외 값 자체를 첫 번째 인수로 받습니다.

이러한 함수가 설정되면 [`'uncaughtException'`](/ko/nodejs/api/process#event-uncaughtexception) 이벤트가 발생하지 않습니다. `--abort-on-uncaught-exception`이 명령줄에서 전달되었거나 [`v8.setFlagsFromString()`](/ko/nodejs/api/v8#v8setflagsfromstringflags)을 통해 설정된 경우 프로세스는 중단되지 않습니다. 보고서 생성과 같이 예외 발생 시 수행하도록 구성된 작업도 영향을 받습니다.

캡처 함수를 해제하려면 `process.setUncaughtExceptionCaptureCallback(null)`을 사용할 수 있습니다. 다른 캡처 함수가 설정된 상태에서 `null`이 아닌 인수로 이 메서드를 호출하면 오류가 발생합니다.

이 함수를 사용하는 것은 더 이상 사용되지 않는 [`domain`](/ko/nodejs/api/domain) 내장 모듈을 사용하는 것과 상호 배타적입니다.

## `process.sourceMapsEnabled` {#processsourcemapsenabled}

**Added in: v20.7.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - Experimental
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`process.sourceMapsEnabled` 속성은 스택 추적에 대한 [Source Map v3](https://sourcemaps.info/spec) 지원이 활성화되어 있는지 여부를 반환합니다.


## `process.stderr` {#processstderr}

- [\<Stream\>](/ko/nodejs/api/stream#stream)

`process.stderr` 속성은 `stderr`(fd `2`)에 연결된 스트림을 반환합니다. 이는 fd `2`가 파일을 참조하지 않는 한 [`net.Socket`](/ko/nodejs/api/net#class-netsocket) ([Duplex](/ko/nodejs/api/stream#duplex-and-transform-streams) 스트림)입니다. fd `2`가 파일을 참조하는 경우 이는 [Writable](/ko/nodejs/api/stream#writable-streams) 스트림입니다.

`process.stderr`는 중요한 방식으로 다른 Node.js 스트림과 다릅니다. 자세한 내용은 [프로세스 I/O에 대한 참고 사항](/ko/nodejs/api/process#a-note-on-process-io)을 참조하세요.

### `process.stderr.fd` {#processstderrfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

이 속성은 `process.stderr`의 기본 파일 디스크립터 값을 나타냅니다. 값은 `2`로 고정됩니다. [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 스레드에서는 이 필드가 존재하지 않습니다.

## `process.stdin` {#processstdin}

- [\<Stream\>](/ko/nodejs/api/stream#stream)

`process.stdin` 속성은 `stdin`(fd `0`)에 연결된 스트림을 반환합니다. 이는 fd `0`이 파일을 참조하지 않는 한 [`net.Socket`](/ko/nodejs/api/net#class-netsocket) ([Duplex](/ko/nodejs/api/stream#duplex-and-transform-streams) 스트림)입니다. fd `0`이 파일을 참조하는 경우 이는 [Readable](/ko/nodejs/api/stream#readable-streams) 스트림입니다.

`stdin`에서 읽는 방법에 대한 자세한 내용은 [`readable.read()`](/ko/nodejs/api/stream#readablereadsize)를 참조하세요.

[Duplex](/ko/nodejs/api/stream#duplex-and-transform-streams) 스트림으로서 `process.stdin`은 v0.10 이전의 Node.js용으로 작성된 스크립트와 호환되는 "구형" 모드에서도 사용할 수 있습니다. 자세한 내용은 [스트림 호환성](/ko/nodejs/api/stream#compatibility-with-older-nodejs-versions)을 참조하세요.

"구형" 스트림 모드에서 `stdin` 스트림은 기본적으로 일시 중지되므로 스트림에서 읽으려면 `process.stdin.resume()`을 호출해야 합니다. `process.stdin.resume()`을 호출하면 스트림이 "구형" 모드로 전환됩니다.

### `process.stdin.fd` {#processstdinfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

이 속성은 `process.stdin`의 기본 파일 디스크립터 값을 나타냅니다. 값은 `0`으로 고정됩니다. [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 스레드에서는 이 필드가 존재하지 않습니다.


## `process.stdout` {#processstdout}

- [\<Stream\>](/ko/nodejs/api/stream#stream)

`process.stdout` 속성은 `stdout`(fd `1`)에 연결된 스트림을 반환합니다. fd `1`이 파일을 참조하지 않는 한 [`net.Socket`](/ko/nodejs/api/net#class-netsocket)입니다 (이는 [Duplex](/ko/nodejs/api/stream#duplex-and-transform-streams) 스트림임). 이 경우 [Writable](/ko/nodejs/api/stream#writable-streams) 스트림입니다.

예를 들어 `process.stdin`을 `process.stdout`으로 복사하려면:

::: code-group
```js [ESM]
import { stdin, stdout } from 'node:process';

stdin.pipe(stdout);
```

```js [CJS]
const { stdin, stdout } = require('node:process');

stdin.pipe(stdout);
```
:::

`process.stdout`은 다른 Node.js 스트림과 중요한 면에서 다릅니다. 자세한 내용은 [프로세스 I/O에 대한 참고 사항](/ko/nodejs/api/process#a-note-on-process-io)을 참조하세요.

### `process.stdout.fd` {#processstdoutfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

이 속성은 `process.stdout`의 기본 파일 디스크립터 값을 나타냅니다. 값은 `1`로 고정됩니다. [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 스레드에는 이 필드가 존재하지 않습니다.

### 프로세스 I/O에 대한 참고 사항 {#a-note-on-process-i/o}

`process.stdout` 및 `process.stderr`는 다른 Node.js 스트림과 중요한 면에서 다릅니다.

이러한 동작은 부분적으로는 역사적인 이유 때문이며, 이를 변경하면 이전 버전과의 호환성이 깨지지만 일부 사용자가 예상하는 동작이기도 합니다.

동기 쓰기는 `console.log()` 또는 `console.error()`로 작성된 출력이 예기치 않게 인터리브되거나 비동기 쓰기가 완료되기 전에 `process.exit()`가 호출되면 전혀 작성되지 않는 등의 문제를 방지합니다. 자세한 내용은 [`process.exit()`](/ko/nodejs/api/process#processexitcode)를 참조하세요.

*<strong>경고</strong>*: 동기 쓰기는 쓰기가 완료될 때까지 이벤트 루프를 차단합니다. 이는 파일에 출력하는 경우 즉각적일 수 있지만 시스템 부하가 높거나 수신 측에서 읽지 않는 파이프 또는 느린 터미널이나 파일 시스템에서는 이벤트 루프가 자주 그리고 충분히 오랫동안 차단되어 심각한 부정적인 성능 영향을 미칠 수 있습니다. 이는 대화형 터미널 세션에 쓰는 경우에는 문제가 되지 않을 수 있지만, 프로세스 출력 스트림에 프로덕션 로깅을 수행할 때는 특히 주의하십시오.

스트림이 [TTY](/ko/nodejs/api/tty#tty) 컨텍스트에 연결되어 있는지 확인하려면 `isTTY` 속성을 확인하세요.

예를 들어:

```bash [BASH]
$ node -p "Boolean(process.stdin.isTTY)"
true
$ echo "foo" | node -p "Boolean(process.stdin.isTTY)"
false
$ node -p "Boolean(process.stdout.isTTY)"
true
$ node -p "Boolean(process.stdout.isTTY)" | cat
false
```
자세한 내용은 [TTY](/ko/nodejs/api/tty#tty) 문서를 참조하세요.


## `process.throwDeprecation` {#processthrowdeprecation}

**Added in: v0.9.12**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`process.throwDeprecation`의 초기 값은 현재 Node.js 프로세스에 `--throw-deprecation` 플래그가 설정되었는지 여부를 나타냅니다. `process.throwDeprecation`은 변경 가능하므로 더 이상 사용되지 않는 경고가 오류를 발생시키는지 여부는 런타임에 변경될 수 있습니다. 자세한 내용은 [`'warning'` 이벤트](/ko/nodejs/api/process#event-warning) 및 [`emitWarning()` 메서드](/ko/nodejs/api/process#processemitwarningwarning-type-code-ctor)에 대한 문서를 참조하십시오.

```bash [BASH]
$ node --throw-deprecation -p "process.throwDeprecation"
true
$ node -p "process.throwDeprecation"
undefined
$ node
> process.emitWarning('test', 'DeprecationWarning');
undefined
> (node:26598) DeprecationWarning: test
> process.throwDeprecation = true;
true
> process.emitWarning('test', 'DeprecationWarning');
Thrown:
[DeprecationWarning: test] { name: 'DeprecationWarning' }
```
## `process.title` {#processtitle}

**Added in: v0.1.104**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.title` 속성은 현재 프로세스 제목(즉, `ps`의 현재 값을 반환)을 반환합니다. `process.title`에 새 값을 할당하면 `ps`의 현재 값이 수정됩니다.

새 값을 할당할 때 플랫폼에 따라 제목에 대한 최대 길이 제한이 다르게 적용됩니다. 일반적으로 이러한 제한은 매우 제한적입니다. 예를 들어 Linux 및 macOS에서 `process.title`은 이진 이름의 크기에 명령줄 인수의 길이를 더한 크기로 제한됩니다. `process.title`을 설정하면 프로세스의 `argv` 메모리를 덮어쓰기 때문입니다. Node.js v0.8에서는 `environ` 메모리도 덮어써서 더 긴 프로세스 제목 문자열을 허용했지만 일부 ( 다소 모호한) 경우에 잠재적으로 안전하지 않고 혼란스러웠습니다.

`process.title`에 값을 할당해도 macOS Activity Monitor 또는 Windows 서비스 관리자와 같은 프로세스 관리자 애플리케이션 내에서 정확한 레이블이 생성되지 않을 수 있습니다.


## `process.traceDeprecation` {#processtracedeprecation}

**Added in: v0.8.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`process.traceDeprecation` 속성은 현재 Node.js 프로세스에서 `--trace-deprecation` 플래그가 설정되었는지 여부를 나타냅니다. 이 플래그의 동작에 대한 자세한 내용은 [`'warning'` 이벤트](/ko/nodejs/api/process#event-warning) 및 [`emitWarning()` 메서드](/ko/nodejs/api/process#processemitwarningwarning-type-code-ctor)에 대한 문서를 참조하십시오.

## `process.umask()` {#processumask}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.0.0, v12.19.0 | 인자 없이 `process.umask()`를 호출하는 것은 더 이상 사용되지 않습니다. |
| v0.1.19 | Added in: v0.1.19 |
:::

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ko/nodejs/api/documentation#stability-index) [Stability: 0](/ko/nodejs/api/documentation#stability-index) - 더 이상 사용되지 않습니다. 인자 없이 `process.umask()`를 호출하면 프로세스 전체 umask가 두 번 기록됩니다. 이렇게 하면 스레드 간에 경쟁 조건이 발생하고 잠재적인 보안 취약점이 생깁니다. 안전한 교차 플랫폼 대체 API는 없습니다.
:::

`process.umask()`는 Node.js 프로세스의 파일 모드 생성 마스크를 반환합니다. 자식 프로세스는 부모 프로세스로부터 마스크를 상속받습니다.

## `process.umask(mask)` {#processumaskmask}

**Added in: v0.1.19**

- `mask` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.umask(mask)`는 Node.js 프로세스의 파일 모드 생성 마스크를 설정합니다. 자식 프로세스는 부모 프로세스로부터 마스크를 상속받습니다. 이전 마스크를 반환합니다.



::: code-group
```js [ESM]
import { umask } from 'node:process';

const newmask = 0o022;
const oldmask = umask(newmask);
console.log(
  `Changed umask from ${oldmask.toString(8)} to ${newmask.toString(8)}`,
);
```

```js [CJS]
const { umask } = require('node:process');

const newmask = 0o022;
const oldmask = umask(newmask);
console.log(
  `Changed umask from ${oldmask.toString(8)} to ${newmask.toString(8)}`,
);
```
:::

[`Worker`](/ko/nodejs/api/worker_threads#class-worker) 스레드에서 `process.umask(mask)`는 예외를 발생시킵니다.


## `process.uptime()` {#processuptime}

**Added in: v0.5.0**

- Returns: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.uptime()` 메서드는 현재 Node.js 프로세스가 실행된 시간을 초 단위로 반환합니다.

반환 값에는 소수점 이하 초가 포함됩니다. 정수 초를 얻으려면 `Math.floor()`를 사용하세요.

## `process.version` {#processversion}

**Added in: v0.1.3**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`process.version` 속성에는 Node.js 버전 문자열이 포함되어 있습니다.

::: code-group
```js [ESM]
import { version } from 'node:process';

console.log(`Version: ${version}`);
// Version: v14.8.0
```

```js [CJS]
const { version } = require('node:process');

console.log(`Version: ${version}`);
// Version: v14.8.0
```
:::

앞에 붙는 *v* 없이 버전 문자열을 얻으려면 `process.versions.node`를 사용하세요.

## `process.versions` {#processversions}

::: info [History]
| Version | Changes |
| --- | --- |
| v9.0.0 | 이제 `v8` 속성에 Node.js 특정 접미사가 포함됩니다. |
| v4.2.0 | 이제 `icu` 속성이 지원됩니다. |
| v0.2.0 | Added in: v0.2.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.versions` 속성은 Node.js 및 해당 종속성의 버전 문자열 목록이 있는 객체를 반환합니다. `process.versions.modules`는 현재 ABI 버전을 나타내며, C++ API가 변경될 때마다 증가합니다. Node.js는 다른 모듈 ABI 버전을 기준으로 컴파일된 모듈 로드를 거부합니다.

::: code-group
```js [ESM]
import { versions } from 'node:process';

console.log(versions);
```

```js [CJS]
const { versions } = require('node:process');

console.log(versions);
```
:::

다음과 유사한 객체를 생성합니다.

```bash [BASH]
{ node: '23.0.0',
  acorn: '8.11.3',
  ada: '2.7.8',
  ares: '1.28.1',
  base64: '0.5.2',
  brotli: '1.1.0',
  cjs_module_lexer: '1.2.2',
  cldr: '45.0',
  icu: '75.1',
  llhttp: '9.2.1',
  modules: '127',
  napi: '9',
  nghttp2: '1.61.0',
  nghttp3: '0.7.0',
  ngtcp2: '1.3.0',
  openssl: '3.0.13+quic',
  simdjson: '3.8.0',
  simdutf: '5.2.4',
  sqlite: '3.46.0',
  tz: '2024a',
  undici: '6.13.0',
  unicode: '15.1',
  uv: '1.48.0',
  uvwasi: '0.0.20',
  v8: '12.4.254.14-node.11',
  zlib: '1.3.0.1-motley-7d77fb7' }
```

## 종료 코드 {#exit-codes}

Node.js는 일반적으로 더 이상 보류 중인 비동기 작업이 없을 때 `0` 상태 코드로 종료됩니다. 다음 상태 코드는 다른 경우에 사용됩니다.

- `1` **잡히지 않은 치명적인 예외**: 잡히지 않은 예외가 발생했으며 도메인 또는 [`'uncaughtException'`](/ko/nodejs/api/process#event-uncaughtexception) 이벤트 처리기로 처리되지 않았습니다.
- `2`: 사용되지 않음 (Bash에서 내장 오용을 위해 예약됨)
- `3` **내부 JavaScript 파싱 오류**: Node.js 부트스트래핑 프로세스 내부의 JavaScript 소스 코드에서 파싱 오류가 발생했습니다. 이는 매우 드물며 일반적으로 Node.js 자체 개발 중에만 발생할 수 있습니다.
- `4` **내부 JavaScript 평가 실패**: Node.js 부트스트래핑 프로세스 내부의 JavaScript 소스 코드가 평가될 때 함수 값을 반환하지 못했습니다. 이는 매우 드물며 일반적으로 Node.js 자체 개발 중에만 발생할 수 있습니다.
- `5` **치명적인 오류**: V8에서 복구할 수 없는 치명적인 오류가 발생했습니다. 일반적으로 `FATAL ERROR` 접두사와 함께 stderr에 메시지가 출력됩니다.
- `6` **함수가 아닌 내부 예외 처리기**: 잡히지 않은 예외가 발생했지만 내부 치명적인 예외 처리기 함수가 어떤 이유로 함수가 아닌 것으로 설정되어 호출할 수 없었습니다.
- `7` **내부 예외 처리기 런타임 실패**: 잡히지 않은 예외가 발생했으며 내부 치명적인 예외 처리기 함수 자체가 처리하려고 시도하는 동안 오류를 발생시켰습니다. 예를 들어 [`'uncaughtException'`](/ko/nodejs/api/process#event-uncaughtexception) 또는 `domain.on('error')` 처리기가 오류를 발생시키는 경우에 발생할 수 있습니다.
- `8`: 사용되지 않음. 이전 버전의 Node.js에서 종료 코드 8은 잡히지 않은 예외를 나타내는 경우가 있었습니다.
- `9` **잘못된 인수**: 알 수 없는 옵션이 지정되었거나 값을 요구하는 옵션이 값 없이 제공되었습니다.
- `10` **내부 JavaScript 런타임 실패**: Node.js 부트스트래핑 프로세스 내부의 JavaScript 소스 코드가 부트스트래핑 함수가 호출될 때 오류를 발생시켰습니다. 이는 매우 드물며 일반적으로 Node.js 자체 개발 중에만 발생할 수 있습니다.
- `12` **잘못된 디버그 인수**: `--inspect` 및/또는 `--inspect-brk` 옵션이 설정되었지만 선택한 포트 번호가 유효하지 않거나 사용할 수 없습니다.
- `13` **해결되지 않은 최상위 Await**: `await`이 최상위 코드의 함수 외부에서 사용되었지만 전달된 `Promise`가 해결되지 않았습니다.
- `14` **스냅샷 실패**: Node.js가 V8 시작 스냅샷을 빌드하기 위해 시작되었지만 애플리케이션 상태의 특정 요구 사항이 충족되지 않아 실패했습니다.
- `\>128` **신호 종료**: Node.js가 `SIGKILL` 또는 `SIGHUP`과 같은 치명적인 신호를 수신하면 종료 코드는 `128` 더하기 신호 코드의 값이 됩니다. 이는 종료 코드가 7비트 정수로 정의되고 신호 종료가 상위 비트를 설정한 다음 신호 코드의 값을 포함하기 때문에 표준 POSIX 방식입니다. 예를 들어 신호 `SIGABRT`의 값은 `6`이므로 예상되는 종료 코드는 `128` + `6` 또는 `134`가 됩니다.

