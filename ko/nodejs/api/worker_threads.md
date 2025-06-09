---
title: Node.js 워커 스레드
description: Node.js에서 워커 스레드를 사용하여 CPU 집약적인 작업을 위한 멀티스레딩을 활용하는 방법에 대한 문서. Worker 클래스의 개요, 스레드 간 통신 및 사용 예제를 제공합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 워커 스레드 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js에서 워커 스레드를 사용하여 CPU 집약적인 작업을 위한 멀티스레딩을 활용하는 방법에 대한 문서. Worker 클래스의 개요, 스레드 간 통신 및 사용 예제를 제공합니다.
  - - meta
    - name: twitter:title
      content: Node.js 워커 스레드 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js에서 워커 스레드를 사용하여 CPU 집약적인 작업을 위한 멀티스레딩을 활용하는 방법에 대한 문서. Worker 클래스의 개요, 스레드 간 통신 및 사용 예제를 제공합니다.
---


# 워커 스레드 {#worker-threads}

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

**소스 코드:** [lib/worker_threads.js](https://github.com/nodejs/node/blob/v23.5.0/lib/worker_threads.js)

`node:worker_threads` 모듈은 JavaScript를 병렬로 실행하는 스레드를 사용할 수 있도록 합니다. 액세스하려면:

```js [ESM]
const worker = require('node:worker_threads');
```

워커(스레드)는 CPU 집약적인 JavaScript 연산을 수행하는 데 유용합니다. I/O 집약적인 작업에는 그다지 도움이 되지 않습니다. Node.js 내장 비동기 I/O 연산이 워커보다 효율적입니다.

`child_process` 또는 `cluster`와 달리 `worker_threads`는 메모리를 공유할 수 있습니다. `ArrayBuffer` 인스턴스를 전송하거나 `SharedArrayBuffer` 인스턴스를 공유하여 이를 수행합니다.

```js [ESM]
const {
  Worker, isMainThread, parentPort, workerData,
} = require('node:worker_threads');

if (isMainThread) {
  module.exports = function parseJSAsync(script) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: script,
      });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`워커가 종료 코드 ${code}로 중단되었습니다.`));
      });
    });
  };
} else {
  const { parse } = require('some-js-parsing-library');
  const script = workerData;
  parentPort.postMessage(parse(script));
}
```

위의 예제는 각 `parseJSAsync()` 호출에 대해 워커 스레드를 생성합니다. 실제로 이러한 종류의 작업에는 워커 풀을 사용하십시오. 그렇지 않으면 워커 생성의 오버헤드가 이점보다 클 가능성이 큽니다.

워커 풀을 구현할 때 [`AsyncResource`](/ko/nodejs/api/async_hooks#class-asyncresource) API를 사용하여 진단 도구(예: 비동기 스택 추적 제공)에 작업과 결과 간의 상관 관계를 알리십시오. 예제 구현은 `async_hooks` 문서의 ["`AsyncResource`을 `Worker` 스레드 풀에 사용하기"](/ko/nodejs/api/async_context#using-asyncresource-for-a-worker-thread-pool)를 참조하십시오.

워커 스레드는 기본적으로 프로세스에 특정하지 않은 옵션을 상속합니다. 워커 스레드 옵션, 특히 `argv` 및 `execArgv` 옵션을 사용자 지정하는 방법을 알아보려면 [`Worker 생성자 옵션`](/ko/nodejs/api/worker_threads#new-workerfilename-options)을 참조하십시오.


## `worker.getEnvironmentData(key)` {#workergetenvironmentdatakey}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v17.5.0, v16.15.0 | 더 이상 실험적이지 않음. |
| v15.12.0, v14.18.0 | 추가됨: v15.12.0, v14.18.0 |
:::

- `key` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 키로 사용할 수 있는 임의의 복제 가능한 JavaScript 값.
- 반환: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

워커 스레드 내에서 `worker.getEnvironmentData()`는 스폰 스레드의 `worker.setEnvironmentData()`에 전달된 데이터의 복제본을 반환합니다. 모든 새로운 `Worker`는 환경 데이터의 자체 복사본을 자동으로 받습니다.

```js [ESM]
const {
  Worker,
  isMainThread,
  setEnvironmentData,
  getEnvironmentData,
} = require('node:worker_threads');

if (isMainThread) {
  setEnvironmentData('Hello', 'World!');
  const worker = new Worker(__filename);
} else {
  console.log(getEnvironmentData('Hello'));  // 'World!'를 출력합니다.
}
```
## `worker.isMainThread` {#workerismainthread}

**추가됨: v10.5.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

이 코드가 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 스레드 내에서 실행되고 있지 않으면 `true`입니다.

```js [ESM]
const { Worker, isMainThread } = require('node:worker_threads');

if (isMainThread) {
  // 이 코드는 현재 파일을 Worker 인스턴스 내에서 다시 로드합니다.
  new Worker(__filename);
} else {
  console.log('Inside Worker!');
  console.log(isMainThread);  // 'false'를 출력합니다.
}
```
## `worker.markAsUntransferable(object)` {#workermarkasuntransferableobject}

**추가됨: v14.5.0, v12.19.0**

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 임의의 JavaScript 값.

객체를 전송 불가능한 것으로 표시합니다. `object`가 [`port.postMessage()`](/ko/nodejs/api/worker_threads#portpostmessagevalue-transferlist) 호출의 전송 목록에 나타나면 오류가 발생합니다. `object`가 기본값인 경우 이는 아무 작업도 수행하지 않습니다.

특히, 이는 전송하는 대신 복제할 수 있고 전송 측의 다른 객체에서 사용되는 객체에 적합합니다. 예를 들어 Node.js는 [`Buffer` 풀](/ko/nodejs/api/buffer#static-method-bufferallocunsafesize)에 사용하는 `ArrayBuffer`를 이것으로 표시합니다.

이 작업은 되돌릴 수 없습니다.

```js [ESM]
const { MessageChannel, markAsUntransferable } = require('node:worker_threads');

const pooledBuffer = new ArrayBuffer(8);
const typedArray1 = new Uint8Array(pooledBuffer);
const typedArray2 = new Float64Array(pooledBuffer);

markAsUntransferable(pooledBuffer);

const { port1 } = new MessageChannel();
try {
  // pooledBuffer는 전송할 수 없으므로 오류가 발생합니다.
  port1.postMessage(typedArray1, [ typedArray1.buffer ]);
} catch (error) {
  // error.name === 'DataCloneError'
}

// 다음 줄은 typedArray1의 내용을 출력합니다. 여전히 메모리를 소유하고 있으며
// 전송되지 않았습니다. `markAsUntransferable()`이 없으면 빈 Uint8Array를 출력하고
// postMessage 호출이 성공했을 것입니다.
// typedArray2도 그대로입니다.
console.log(typedArray1);
console.log(typedArray2);
```
브라우저에는 이 API에 해당하는 것이 없습니다.


## `worker.isMarkedAsUntransferable(object)` {#workerismarkedasuntransferableobject}

**Added in: v21.0.0**

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 모든 JavaScript 값.
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

객체가 [`markAsUntransferable()`](/ko/nodejs/api/worker_threads#workermarkasuntransferableobject)을 사용하여 전송 불가능으로 표시되었는지 확인합니다.

```js [ESM]
const { markAsUntransferable, isMarkedAsUntransferable } = require('node:worker_threads');

const pooledBuffer = new ArrayBuffer(8);
markAsUntransferable(pooledBuffer);

isMarkedAsUntransferable(pooledBuffer);  // true를 반환합니다.
```
브라우저에는 이 API와 동일한 기능이 없습니다.

## `worker.markAsUncloneable(object)` {#workermarkasuncloneableobject}

**Added in: v23.0.0**

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 임의의 JavaScript 값.

객체를 복제 불가능으로 표시합니다. `object`가 [`port.postMessage()`](/ko/nodejs/api/worker_threads#portpostmessagevalue-transferlist) 호출에서 [`message`](/ko/nodejs/api/worker_threads#event-message)로 사용되면 오류가 발생합니다. `object`가 기본값이면 아무 작업도 수행되지 않습니다.

이는 `ArrayBuffer` 또는 `Buffer`와 유사한 객체에는 영향을 미치지 않습니다.

이 작업은 되돌릴 수 없습니다.

```js [ESM]
const { markAsUncloneable } = require('node:worker_threads');

const anyObject = { foo: 'bar' };
markAsUncloneable(anyObject);
const { port1 } = new MessageChannel();
try {
  // anyObject는 복제할 수 없으므로 오류가 발생합니다.
  port1.postMessage(anyObject);
} catch (error) {
  // error.name === 'DataCloneError'
}
```
브라우저에는 이 API와 동일한 기능이 없습니다.

## `worker.moveMessagePortToContext(port, contextifiedSandbox)` {#workermovemessageporttocontextport-contextifiedsandbox}

**Added in: v11.13.0**

-  `port` [\<MessagePort\>](/ko/nodejs/api/worker_threads#class-messageport) 전송할 메시지 포트입니다.
-  `contextifiedSandbox` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `vm.createContext()` 메서드에서 반환된 [contextified](/ko/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) 객체입니다.
-  반환: [\<MessagePort\>](/ko/nodejs/api/worker_threads#class-messageport)

`MessagePort`를 다른 [`vm`](/ko/nodejs/api/vm) Context로 전송합니다. 원래 `port` 객체는 사용할 수 없게 되고 반환된 `MessagePort` 인스턴스가 대신 사용됩니다.

반환된 `MessagePort`는 대상 컨텍스트의 객체이며 해당 전역 `Object` 클래스에서 상속됩니다. [`port.onmessage()`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/onmessage) 리스너로 전달된 객체도 대상 컨텍스트에서 생성되고 해당 전역 `Object` 클래스에서 상속됩니다.

그러나 생성된 `MessagePort`는 더 이상 [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)에서 상속되지 않으며 [`port.onmessage()`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/onmessage)만 사용하여 이벤트를 수신할 수 있습니다.


## `worker.parentPort` {#workerparentport}

**Added in: v10.5.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<MessagePort\>](/ko/nodejs/api/worker_threads#class-messageport)

이 스레드가 [`Worker`](/ko/nodejs/api/worker_threads#class-worker)인 경우, 이는 부모 스레드와의 통신을 허용하는 [`MessagePort`](/ko/nodejs/api/worker_threads#class-messageport)입니다. `parentPort.postMessage()`를 사용하여 보낸 메시지는 `worker.on('message')`를 사용하여 부모 스레드에서 사용할 수 있으며, `worker.postMessage()`를 사용하여 부모 스레드에서 보낸 메시지는 `parentPort.on('message')`를 사용하여 이 스레드에서 사용할 수 있습니다.

```js [ESM]
const { Worker, isMainThread, parentPort } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.once('message', (message) => {
    console.log(message);  // 'Hello, world!'를 출력합니다.
  });
  worker.postMessage('Hello, world!');
} else {
  // 부모 스레드에서 메시지를 받으면 다시 보냅니다.
  parentPort.once('message', (message) => {
    parentPort.postMessage(message);
  });
}
```
## `worker.postMessageToThread(threadId, value[, transferList][, timeout])` {#workerpostmessagetothreadthreadid-value-transferlist-timeout}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::

- `threadId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 대상 스레드 ID입니다. 스레드 ID가 유효하지 않으면 [`ERR_WORKER_MESSAGING_FAILED`](/ko/nodejs/api/errors#err_worker_messaging_failed) 오류가 발생합니다. 대상 스레드 ID가 현재 스레드 ID인 경우 [`ERR_WORKER_MESSAGING_SAME_THREAD`](/ko/nodejs/api/errors#err_worker_messaging_same_thread) 오류가 발생합니다.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 보낼 값입니다.
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 하나 이상의 `MessagePort`와 유사한 객체가 `value`에 전달되면 해당 항목에 대해 `transferList`가 필요하거나 [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/ko/nodejs/api/errors#err_missing_message_port_in_transfer_list)가 발생합니다. 자세한 내용은 [`port.postMessage()`](/ko/nodejs/api/worker_threads#portpostmessagevalue-transferlist)를 참조하십시오.
- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 메시지가 전달될 때까지 기다리는 시간(밀리초)입니다. 기본적으로 `undefined`이며, 이는 무한정 기다리는 것을 의미합니다. 작업 시간이 초과되면 [`ERR_WORKER_MESSAGING_TIMEOUT`](/ko/nodejs/api/errors#err_worker_messaging_timeout) 오류가 발생합니다.
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 메시지가 대상 스레드에서 성공적으로 처리된 경우 이행되는 프로미스입니다.

스레드 ID로 식별되는 다른 워커에게 값을 보냅니다.

대상 스레드에 `workerMessage` 이벤트에 대한 리스너가 없으면 작업에서 [`ERR_WORKER_MESSAGING_FAILED`](/ko/nodejs/api/errors#err_worker_messaging_failed) 오류가 발생합니다.

대상 스레드가 `workerMessage` 이벤트를 처리하는 동안 오류를 발생시키면 작업에서 [`ERR_WORKER_MESSAGING_ERRORED`](/ko/nodejs/api/errors#err_worker_messaging_errored) 오류가 발생합니다.

이 메서드는 대상 스레드가 현재 스레드의 직접적인 부모 또는 자식이 아닌 경우에 사용해야 합니다. 두 스레드가 부모-자식 관계인 경우 [`require('node:worker_threads').parentPort.postMessage()`](/ko/nodejs/api/worker_threads#workerpostmessagevalue-transferlist)와 [`worker.postMessage()`](/ko/nodejs/api/worker_threads#workerpostmessagevalue-transferlist)를 사용하여 스레드가 통신하도록 합니다.

아래 예제는 `postMessageToThread`의 사용법을 보여줍니다. 10개의 중첩된 스레드를 생성하고 마지막 스레드는 메인 스레드와 통신을 시도합니다.

::: code-group
```js [ESM]
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import {
  postMessageToThread,
  threadId,
  workerData,
  Worker,
} from 'node:worker_threads';

const channel = new BroadcastChannel('sync');
const level = workerData?.level ?? 0;

if (level < 10) {
  const worker = new Worker(fileURLToPath(import.meta.url), {
    workerData: { level: level + 1 },
  });
}

if (level === 0) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    postMessageToThread(source, { message: 'pong' });
  });
} else if (level === 10) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    channel.postMessage('done');
    channel.close();
  });

  await postMessageToThread(0, { message: 'ping' });
}

channel.onmessage = channel.close;
```

```js [CJS]
const {
  postMessageToThread,
  threadId,
  workerData,
  Worker,
} = require('node:worker_threads');

const channel = new BroadcastChannel('sync');
const level = workerData?.level ?? 0;

if (level < 10) {
  const worker = new Worker(__filename, {
    workerData: { level: level + 1 },
  });
}

if (level === 0) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    postMessageToThread(source, { message: 'pong' });
  });
} else if (level === 10) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    channel.postMessage('done');
    channel.close();
  });

  postMessageToThread(0, { message: 'ping' });
}

channel.onmessage = channel.close;
```
:::


## `worker.receiveMessageOnPort(port)` {#workerreceivemessageonportport}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.12.0 | 이제 port 인수가 `BroadcastChannel`을 참조할 수도 있습니다. |
| v12.3.0 | v12.3.0에서 추가됨 |
:::

-  `port` [\<MessagePort\>](/ko/nodejs/api/worker_threads#class-messageport) | [\<BroadcastChannel\>](/ko/nodejs/api/worker_threads#class-broadcastchannel-extends-eventtarget) 
-  반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 

지정된 `MessagePort`에서 단일 메시지를 받습니다. 메시지가 없으면 `undefined`가 반환되고, 그렇지 않으면 `MessagePort`의 큐에서 가장 오래된 메시지에 해당하는 메시지 페이로드를 포함하는 단일 `message` 속성을 가진 객체가 반환됩니다.

```js [ESM]
const { MessageChannel, receiveMessageOnPort } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();
port1.postMessage({ hello: 'world' });

console.log(receiveMessageOnPort(port2));
// 출력: { message: { hello: 'world' } }
console.log(receiveMessageOnPort(port2));
// 출력: undefined
```
이 함수를 사용하면 `'message'` 이벤트가 발생하지 않고 `onmessage` 리스너가 호출되지 않습니다.

## `worker.resourceLimits` {#workerresourcelimits}

**추가된 버전: v13.2.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

이 Worker 스레드 내의 JS 엔진 리소스 제약 조건 집합을 제공합니다. `resourceLimits` 옵션이 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 생성자에 전달된 경우 해당 값과 일치합니다.

이것이 메인 스레드에서 사용되는 경우, 그 값은 빈 객체입니다.


## `worker.SHARE_ENV` {#workershare_env}

**추가된 버전: v11.14.0**

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)

현재 스레드와 워커 스레드가 동일한 환경 변수 집합에 대한 읽기 및 쓰기 액세스를 공유해야 함을 나타내기 위해 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 생성자의 `env` 옵션으로 전달될 수 있는 특수 값입니다.

```js [ESM]
const { Worker, SHARE_ENV } = require('node:worker_threads');
new Worker('process.env.SET_IN_WORKER = "foo"', { eval: true, env: SHARE_ENV })
  .on('exit', () => {
    console.log(process.env.SET_IN_WORKER);  // 'foo'를 출력합니다.
  });
```
## `worker.setEnvironmentData(key[, value])` {#workersetenvironmentdatakey-value}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v17.5.0, v16.15.0 | 더 이상 실험적이지 않습니다. |
| v15.12.0, v14.18.0 | 추가된 버전: v15.12.0, v14.18.0 |
:::

- `key` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 키로 사용될 수 있는 임의의 복제 가능한 JavaScript 값입니다.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 임의의 복제 가능한 JavaScript 값으로 복제되어 모든 새로운 `Worker` 인스턴스에 자동으로 전달됩니다. `value`가 `undefined`로 전달되면 `key`에 대해 이전에 설정된 모든 값이 삭제됩니다.

`worker.setEnvironmentData()` API는 현재 스레드 및 현재 컨텍스트에서 생성된 모든 새로운 `Worker` 인스턴스에서 `worker.getEnvironmentData()`의 내용을 설정합니다.

## `worker.threadId` {#workerthreadid}

**추가된 버전: v10.5.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

현재 스레드의 정수 식별자입니다. 해당 워커 객체(있는 경우)에서 [`worker.threadId`](/ko/nodejs/api/worker_threads#workerthreadid_1)로 사용할 수 있습니다. 이 값은 단일 프로세스 내의 각 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 인스턴스에 대해 고유합니다.


## `worker.workerData` {#workerworkerdata}

**Added in: v10.5.0**

이 스레드의 `Worker` 생성자에 전달된 데이터의 복제본을 포함하는 임의의 JavaScript 값입니다.

데이터는 [HTML 구조 복제 알고리즘](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)에 따라 [`postMessage()`](/ko/nodejs/api/worker_threads#portpostmessagevalue-transferlist)를 사용하는 것처럼 복제됩니다.

```js [ESM]
const { Worker, isMainThread, workerData } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename, { workerData: 'Hello, world!' });
} else {
  console.log(workerData);  // 'Hello, world!'를 출력합니다.
}
```
## 클래스: `BroadcastChannel extends EventTarget` {#class-broadcastchannel-extends-eventtarget}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 더 이상 실험적이지 않습니다. |
| v15.4.0 | 추가됨: v15.4.0 |
:::

`BroadcastChannel`의 인스턴스를 사용하면 동일한 채널 이름에 바인딩된 다른 모든 `BroadcastChannel` 인스턴스와 비동기식 일대다 통신을 할 수 있습니다.

```js [ESM]
'use strict';

const {
  isMainThread,
  BroadcastChannel,
  Worker,
} = require('node:worker_threads');

const bc = new BroadcastChannel('hello');

if (isMainThread) {
  let c = 0;
  bc.onmessage = (event) => {
    console.log(event.data);
    if (++c === 10) bc.close();
  };
  for (let n = 0; n < 10; n++)
    new Worker(__filename);
} else {
  bc.postMessage('hello from every worker');
  bc.close();
}
```
### `new BroadcastChannel(name)` {#new-broadcastchannelname}

**Added in: v15.4.0**

- `name` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 연결할 채널의 이름입니다. ``${name}``을 사용하여 문자열로 변환할 수 있는 JavaScript 값은 모두 허용됩니다.

### `broadcastChannel.close()` {#broadcastchannelclose}

**Added in: v15.4.0**

`BroadcastChannel` 연결을 닫습니다.

### `broadcastChannel.onmessage` {#broadcastchannelonmessage}

**Added in: v15.4.0**

- 유형: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 메시지가 수신될 때 단일 `MessageEvent` 인수로 호출됩니다.


### `broadcastChannel.onmessageerror` {#broadcastchannelonmessageerror}

**추가된 버전: v15.4.0**

- 유형: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 수신된 메시지를 역직렬화할 수 없을 때 호출됩니다.

### `broadcastChannel.postMessage(message)` {#broadcastchannelpostmessagemessage}

**추가된 버전: v15.4.0**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 복제 가능한 모든 JavaScript 값.

### `broadcastChannel.ref()` {#broadcastchannelref}

**추가된 버전: v15.4.0**

`unref()`의 반대입니다. 이전에 `unref()`된 BroadcastChannel에서 `ref()`를 호출해도 활성 핸들이 하나만 남아 있으면 프로그램이 종료되지 않습니다 (기본 동작). 포트가 `ref()`된 경우 `ref()`를 다시 호출해도 아무런 효과가 없습니다.

### `broadcastChannel.unref()` {#broadcastchannelunref}

**추가된 버전: v15.4.0**

BroadcastChannel에서 `unref()`를 호출하면 이벤트 시스템에 활성 핸들이 하나만 있는 경우 스레드가 종료될 수 있습니다. BroadcastChannel이 이미 `unref()`된 경우 `unref()`를 다시 호출해도 아무런 효과가 없습니다.

## 클래스: `MessageChannel` {#class-messagechannel}

**추가된 버전: v10.5.0**

`worker.MessageChannel` 클래스의 인스턴스는 비동기 양방향 통신 채널을 나타냅니다. `MessageChannel` 자체에는 메서드가 없습니다. `new MessageChannel()`은 연결된 [`MessagePort`](/ko/nodejs/api/worker_threads#class-messageport) 인스턴스를 참조하는 `port1` 및 `port2` 속성이 있는 객체를 생성합니다.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');

const { port1, port2 } = new MessageChannel();
port1.on('message', (message) => console.log('received', message));
port2.postMessage({ foo: 'bar' });
// `port1.on('message')` 리스너에서: received { foo: 'bar' }가 출력됩니다.
```
## 클래스: `MessagePort` {#class-messageport}


::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v14.7.0 | 이 클래스는 이제 `EventEmitter`가 아닌 `EventTarget`에서 상속됩니다. |
| v10.5.0 | 추가된 버전: v10.5.0 |
:::

- 확장: [\<EventTarget\>](/ko/nodejs/api/events#class-eventtarget)

`worker.MessagePort` 클래스의 인스턴스는 비동기 양방향 통신 채널의 한쪽 끝을 나타냅니다. 구조화된 데이터, 메모리 영역 및 기타 `MessagePort`를 다른 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 간에 전송하는 데 사용할 수 있습니다.

이 구현은 [브라우저 `MessagePort`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort)와 일치합니다.


### 이벤트: `'close'` {#event-close}

**추가된 버전: v10.5.0**

채널의 한쪽 연결이 끊어지면 `'close'` 이벤트가 발생합니다.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

// 출력:
//   foobar
//   closed!
port2.on('message', (message) => console.log(message));
port2.on('close', () => console.log('closed!'));

port1.postMessage('foobar');
port1.close();
```
### 이벤트: `'message'` {#event-message}

**추가된 버전: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Data_types) 전송된 값

`'message'` 이벤트는 [`port.postMessage()`](/ko/nodejs/api/worker_threads#portpostmessagevalue-transferlist)의 복제된 입력을 포함하는 모든 들어오는 메시지에 대해 발생합니다.

이 이벤트의 리스너는 `postMessage()`에 전달된 `value` 매개변수의 복제본을 받으며 추가 인수는 받지 않습니다.

### 이벤트: `'messageerror'` {#event-messageerror}

**추가된 버전: v14.5.0, v12.19.0**

- `error` [\<Error\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Error) Error 객체

메시지 역직렬화에 실패하면 `'messageerror'` 이벤트가 발생합니다.

현재 이 이벤트는 게시된 JS 객체를 수신측에서 인스턴스화하는 동안 오류가 발생할 때 발생합니다. 이러한 상황은 드물지만 특정 Node.js API 객체가 `vm.Context`에서 수신될 때 발생할 수 있습니다 (현재 Node.js API를 사용할 수 없는 경우).

### `port.close()` {#portclose}

**추가된 버전: v10.5.0**

연결의 양쪽에서 더 이상 메시지를 보낼 수 없도록 비활성화합니다. 이 메서드는 이 `MessagePort`를 통해 더 이상 통신이 발생하지 않을 때 호출할 수 있습니다.

채널의 일부인 두 `MessagePort` 인스턴스 모두에서 [`'close'` 이벤트](/ko/nodejs/api/worker_threads#event-close)가 발생합니다.

### `port.postMessage(value[, transferList])` {#portpostmessagevalue-transferlist}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v21.0.0 | 전송 불가능한 객체가 전송 목록에 있으면 오류가 발생합니다. |
| v15.6.0 | 복제 가능한 유형 목록에 `X509Certificate`를 추가했습니다. |
| v15.0.0 | 복제 가능한 유형 목록에 `CryptoKey`를 추가했습니다. |
| v15.14.0, v14.18.0 | 복제 가능한 유형 목록에 'BlockList'를 추가했습니다. |
| v15.9.0, v14.18.0 | 복제 가능한 유형 목록에 'Histogram' 유형을 추가했습니다. |
| v14.5.0, v12.19.0 | 복제 가능한 유형 목록에 `KeyObject`를 추가했습니다. |
| v14.5.0, v12.19.0 | 전송 가능한 유형 목록에 `FileHandle`을 추가했습니다. |
| v10.5.0 | 추가된 버전: v10.5.0 |
:::

- `value` [\<any\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Data_types)
- `transferList` [\<Object[]\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object)

JavaScript 값을 이 채널의 수신측으로 보냅니다. `value`는 [HTML 구조화된 복제 알고리즘](https://developer.mozilla.org/ko/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)과 호환되는 방식으로 전송됩니다.

특히, `JSON`과의 중요한 차이점은 다음과 같습니다.

- `value`는 순환 참조를 포함할 수 있습니다.
- `value`는 `RegExp`, `BigInt`, `Map`, `Set` 등과 같은 기본 제공 JS 유형의 인스턴스를 포함할 수 있습니다.
- `value`는 `ArrayBuffer`와 `SharedArrayBuffer`를 모두 사용하여 유형화된 배열을 포함할 수 있습니다.
- `value`는 [`WebAssembly.Module`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module) 인스턴스를 포함할 수 있습니다.
- `value`는 다음을 제외한 네이티브 (C++ 기반) 객체를 포함할 수 없습니다.
    - [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)s,
    - [\<FileHandle\>](/ko/nodejs/api/fs#class-filehandle)s,
    - [\<Histogram\>](/ko/nodejs/api/perf_hooks#class-histogram)s,
    - [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject)s,
    - [\<MessagePort\>](/ko/nodejs/api/worker_threads#class-messageport)s,
    - [\<net.BlockList\>](/ko/nodejs/api/net#class-netblocklist)s,
    - [\<net.SocketAddress\>](/ko/nodejs/api/net#class-netsocketaddress)es,
    - [\<X509Certificate\>](/ko/nodejs/api/crypto#class-x509certificate)s.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => console.log(message));

const circularData = {};
circularData.foo = circularData;
// 출력: { foo: [Circular] }
port2.postMessage(circularData);
```
`transferList`는 [`ArrayBuffer`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`MessagePort`](/ko/nodejs/api/worker_threads#class-messageport) 및 [`FileHandle`](/ko/nodejs/api/fs#class-filehandle) 객체의 목록일 수 있습니다. 전송 후에는 `value`에 포함되어 있지 않더라도 채널의 보내는 쪽에서 더 이상 사용할 수 없습니다. [자식 프로세스](/ko/nodejs/api/child_process)와 달리 네트워크 소켓과 같은 핸들 전송은 현재 지원되지 않습니다.

`value`에 [`SharedArrayBuffer`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 인스턴스가 포함되어 있는 경우 해당 인스턴스는 어느 스레드에서나 액세스할 수 있습니다. `transferList`에 나열할 수 없습니다.

`value`는 `transferList`에 없는 `ArrayBuffer` 인스턴스를 여전히 포함할 수 있습니다. 이 경우 기본 메모리는 이동되는 것이 아니라 복사됩니다.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => console.log(message));

const uint8Array = new Uint8Array([ 1, 2, 3, 4 ]);
// 이는 `uint8Array`의 복사본을 게시합니다.
port2.postMessage(uint8Array);
// 이는 데이터를 복사하지 않지만 `uint8Array`를 사용할 수 없게 만듭니다.
port2.postMessage(uint8Array, [ uint8Array.buffer ]);

// `sharedUint8Array`의 메모리는 `.on('message')`로 받은 원본과 복사본 모두에서 액세스할 수 있습니다.
const sharedUint8Array = new Uint8Array(new SharedArrayBuffer(4));
port2.postMessage(sharedUint8Array);

// 이는 새로 생성된 메시지 포트를 수신자에게 전송합니다.
// 예를 들어, 동일한 부모 스레드의 자식인 여러 `Worker` 스레드 간에 통신 채널을 만드는 데 사용할 수 있습니다.
const otherChannel = new MessageChannel();
port2.postMessage({ port: otherChannel.port1 }, [ otherChannel.port1 ]);
```
메시지 객체는 즉시 복제되며 게시 후 부작용 없이 수정할 수 있습니다.

이 API의 직렬화 및 역직렬화 메커니즘에 대한 자세한 내용은 [`node:v8` 모듈의 직렬화 API](/ko/nodejs/api/v8#serialization-api)를 참조하십시오.


#### TypedArray 및 Buffer 전송 시 고려 사항 {#considerations-when-transferring-typedarrays-and-buffers}

모든 `TypedArray` 및 `Buffer` 인스턴스는 기본 `ArrayBuffer`에 대한 뷰입니다. 즉, 원시 데이터를 실제로 저장하는 것은 `ArrayBuffer`이고, `TypedArray` 및 `Buffer` 객체는 데이터를 보고 조작하는 방법을 제공합니다. 동일한 `ArrayBuffer` 인스턴스에 대해 여러 뷰를 만드는 것이 가능하며 일반적입니다. 전송 목록을 사용하여 `ArrayBuffer`를 전송할 때는 주의해야 합니다. 그렇게 하면 동일한 `ArrayBuffer`를 공유하는 모든 `TypedArray` 및 `Buffer` 인스턴스를 사용할 수 없게 됩니다.

```js [ESM]
const ab = new ArrayBuffer(10);

const u1 = new Uint8Array(ab);
const u2 = new Uint16Array(ab);

console.log(u2.length);  // 5 출력

port.postMessage(u1, [u1.buffer]);

console.log(u2.length);  // 0 출력
```
특히 `Buffer` 인스턴스의 경우, 기본 `ArrayBuffer`를 전송하거나 복제할 수 있는지 여부는 인스턴스가 생성된 방식에 따라 다르며, 이는 종종 안정적으로 결정할 수 없습니다.

`ArrayBuffer`는 항상 복제되어야 하고 전송되어서는 안 된다는 것을 나타내기 위해 [`markAsUntransferable()`](/ko/nodejs/api/worker_threads#workermarkasuntransferableobject)로 표시될 수 있습니다.

`Buffer` 인스턴스가 생성된 방식에 따라 기본 `ArrayBuffer`를 소유할 수도 있고 소유하지 않을 수도 있습니다. `Buffer` 인스턴스가 해당 `ArrayBuffer`를 소유하는 것으로 알려진 경우에만 `ArrayBuffer`를 전송해야 합니다. 특히 내부 `Buffer` 풀에서 생성된 `Buffer`의 경우(예: `Buffer.from()` 또는 `Buffer.allocUnsafe()` 사용), 이를 전송하는 것은 불가능하며 항상 복제되어 전체 `Buffer` 풀의 복사본을 보냅니다. 이러한 동작은 의도치 않은 더 높은 메모리 사용량 및 가능한 보안 문제를 야기할 수 있습니다.

`Buffer` 풀링에 대한 자세한 내용은 [`Buffer.allocUnsafe()`](/ko/nodejs/api/buffer#static-method-bufferallocunsafesize)를 참조하십시오.

`Buffer.alloc()` 또는 `Buffer.allocUnsafeSlow()`를 사용하여 생성된 `Buffer` 인스턴스의 `ArrayBuffer`는 항상 전송할 수 있지만, 그렇게 하면 해당 `ArrayBuffer`의 다른 기존 뷰를 모두 사용할 수 없게 됩니다.


#### 프로토타입, 클래스 및 접근자가 있는 객체를 복제할 때 고려 사항 {#considerations-when-cloning-objects-with-prototypes-classes-and-accessors}

객체 복제는 [HTML 구조화된 복제 알고리즘](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)을 사용하므로 열거할 수 없는 속성, 속성 접근자 및 객체 프로토타입은 보존되지 않습니다. 특히 [`Buffer`](/ko/nodejs/api/buffer) 객체는 수신 측에서 일반 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)로 읽히고 JavaScript 클래스의 인스턴스는 일반 JavaScript 객체로 복제됩니다.

```js [ESM]
const b = Symbol('b');

class Foo {
  #a = 1;
  constructor() {
    this[b] = 2;
    this.c = 3;
  }

  get d() { return 4; }
}

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => console.log(data);

port2.postMessage(new Foo());

// Prints: { c: 3 }
```
이 제한은 전역 `URL` 객체와 같은 많은 내장 객체로 확장됩니다.

```js [ESM]
const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => console.log(data);

port2.postMessage(new URL('https://example.org'));

// Prints: { }
```
### `port.hasRef()` {#porthasref}

**추가된 버전: v18.1.0, v16.17.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

true이면 `MessagePort` 객체는 Node.js 이벤트 루프를 활성 상태로 유지합니다.

### `port.ref()` {#portref}

**추가된 버전: v10.5.0**

`unref()`의 반대입니다. 이전에 `unref()`된 포트에서 `ref()`를 호출해도 유일하게 활성 핸들로 남아 있는 경우 프로그램이 종료되지 않습니다(기본 동작). 포트가 `ref()`된 경우 `ref()`를 다시 호출해도 아무런 효과가 없습니다.

`.on('message')`를 사용하여 리스너가 연결되거나 제거되면 이벤트에 대한 리스너가 있는지 여부에 따라 포트가 자동으로 `ref()`되고 `unref()`됩니다.


### `port.start()` {#portstart}

**추가된 버전: v10.5.0**

이 `MessagePort`에서 메시지 수신을 시작합니다. 이 포트를 이벤트 이미터로 사용하는 경우 `'message'` 리스너가 연결되면 자동으로 호출됩니다.

이 메서드는 웹 `MessagePort` API와의 패리티를 위해 존재합니다. Node.js에서는 이벤트 리스너가 없을 때 메시지를 무시하는 데만 유용합니다. Node.js는 `.onmessage` 처리에서도 차이가 있습니다. 이를 설정하면 자동으로 `.start()`가 호출되지만, 설정 해제하면 새 핸들러가 설정되거나 포트가 삭제될 때까지 메시지가 대기열에 쌓입니다.

### `port.unref()` {#portunref}

**추가된 버전: v10.5.0**

포트에서 `unref()`를 호출하면 이벤트 시스템에서 활성 핸들이 이것뿐인 경우 스레드가 종료될 수 있습니다. 포트가 이미 `unref()`된 경우 `unref()`를 다시 호출해도 아무런 효과가 없습니다.

`.on('message')`를 사용하여 리스너가 연결되거나 제거되면 이벤트에 대한 리스너의 존재 여부에 따라 포트가 자동으로 `ref()`되고 `unref()`됩니다.

## 클래스: `Worker` {#class-worker}

**추가된 버전: v10.5.0**

- 확장: [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter)

`Worker` 클래스는 독립적인 JavaScript 실행 스레드를 나타냅니다. 대부분의 Node.js API를 내부에서 사용할 수 있습니다.

Worker 환경 내부의 주목할 만한 차이점은 다음과 같습니다.

- [`process.stdin`](/ko/nodejs/api/process#processstdin), [`process.stdout`](/ko/nodejs/api/process#processstdout) 및 [`process.stderr`](/ko/nodejs/api/process#processstderr) 스트림은 부모 스레드에 의해 리디렉션될 수 있습니다.
- [`require('node:worker_threads').isMainThread`](/ko/nodejs/api/worker_threads#workerismainthread) 속성은 `false`로 설정됩니다.
- [`require('node:worker_threads').parentPort`](/ko/nodejs/api/worker_threads#workerparentport) 메시지 포트를 사용할 수 있습니다.
- [`process.exit()`](/ko/nodejs/api/process#processexitcode)는 전체 프로그램을 중지하지 않고 단일 스레드만 중지하며, [`process.abort()`](/ko/nodejs/api/process#processabort)는 사용할 수 없습니다.
- [`process.chdir()`](/ko/nodejs/api/process#processchdirdirectory) 및 그룹 또는 사용자 ID를 설정하는 `process` 메서드는 사용할 수 없습니다.
- [`process.env`](/ko/nodejs/api/process#processenv)는 달리 지정되지 않은 경우 부모 스레드의 환경 변수 복사본입니다. 한 복사본에 대한 변경 사항은 다른 스레드에서 볼 수 없으며, 네이티브 애드온에서도 볼 수 없습니다([`worker.SHARE_ENV`](/ko/nodejs/api/worker_threads#workershare_env)가 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 생성자에 `env` 옵션으로 전달되지 않는 한). Windows에서는 주 스레드와 달리 환경 변수 복사본이 대소문자를 구분하여 작동합니다.
- [`process.title`](/ko/nodejs/api/process#processtitle)은 수정할 수 없습니다.
- 신호는 [`process.on('...')`](/ko/nodejs/api/process#signal-events)을 통해 전달되지 않습니다.
- [`worker.terminate()`](/ko/nodejs/api/worker_threads#workerterminate)가 호출된 결과로 실행이 언제든지 중지될 수 있습니다.
- 부모 프로세스의 IPC 채널에 액세스할 수 없습니다.
- [`trace_events`](/ko/nodejs/api/tracing) 모듈은 지원되지 않습니다.
- 네이티브 애드온은 [특정 조건](/ko/nodejs/api/addons#worker-support)을 충족하는 경우에만 여러 스레드에서 로드할 수 있습니다.

다른 `Worker` 내부에서 `Worker` 인스턴스를 만드는 것이 가능합니다.

[웹 워커](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) 및 [`node:cluster` 모듈](/ko/nodejs/api/cluster)과 마찬가지로 스레드 간 메시지 전달을 통해 양방향 통신을 달성할 수 있습니다. 내부적으로 `Worker`는 `Worker`가 생성될 때 이미 서로 연결된 내장 [`MessagePort`](/ko/nodejs/api/worker_threads#class-messageport) 쌍을 가지고 있습니다. 부모 쪽의 `MessagePort` 객체는 직접 노출되지 않지만, 해당 기능은 [`worker.postMessage()`](/ko/nodejs/api/worker_threads#workerpostmessagevalue-transferlist)와 부모 스레드의 `Worker` 객체에 대한 [`worker.on('message')`](/ko/nodejs/api/worker_threads#event-message_1) 이벤트를 통해 노출됩니다.

사용자 정의 메시징 채널을 만들려면 (기본 전역 채널을 사용하는 것보다 관심사 분리를 용이하게 하므로 권장됨) 사용자는 어느 스레드에서든 `MessageChannel` 객체를 만들고 `MessageChannel`의 `MessagePort` 중 하나를 글로벌 채널과 같은 기존 채널을 통해 다른 스레드로 전달할 수 있습니다.

메시지 전달 방법과 스레드 장벽을 통해 성공적으로 전송할 수 있는 JavaScript 값의 종류에 대한 자세한 내용은 [`port.postMessage()`](/ko/nodejs/api/worker_threads#portpostmessagevalue-transferlist)를 참조하십시오.

```js [ESM]
const assert = require('node:assert');
const {
  Worker, MessageChannel, MessagePort, isMainThread, parentPort,
} = require('node:worker_threads');
if (isMainThread) {
  const worker = new Worker(__filename);
  const subChannel = new MessageChannel();
  worker.postMessage({ hereIsYourPort: subChannel.port1 }, [subChannel.port1]);
  subChannel.port2.on('message', (value) => {
    console.log('received:', value);
  });
} else {
  parentPort.once('message', (value) => {
    assert(value.hereIsYourPort instanceof MessagePort);
    value.hereIsYourPort.postMessage('the worker is sending this');
    value.hereIsYourPort.close();
  });
}
```

### `new Worker(filename[, options])` {#new-workerfilename-options}

::: info [History]
| Version | Changes |
| --- | --- |
| v19.8.0, v18.16.0 | 디버깅을 위해 작업자 제목에 이름을 추가할 수 있는 `name` 옵션에 대한 지원이 추가되었습니다. |
| v14.9.0 | `filename` 매개변수는 `data:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. |
| v14.9.0 | `trackUnmanagedFds` 옵션이 기본적으로 `true`로 설정되었습니다. |
| v14.6.0, v12.19.0 | `trackUnmanagedFds` 옵션이 도입되었습니다. |
| v13.13.0, v12.17.0 | `transferList` 옵션이 도입되었습니다. |
| v13.12.0, v12.17.0 | `filename` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. |
| v13.4.0, v12.16.0 | `argv` 옵션이 도입되었습니다. |
| v13.2.0, v12.16.0 | `resourceLimits` 옵션이 도입되었습니다. |
| v10.5.0 | Added in: v10.5.0 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 작업자의 메인 스크립트 또는 모듈에 대한 경로입니다. 절대 경로 또는 `./` 또는 `../`로 시작하는 상대 경로(즉, 현재 작업 디렉터리 기준)이거나 `file:` 또는 `data:` 프로토콜을 사용하는 WHATWG `URL` 객체여야 합니다. [`data:` URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)을 사용하는 경우 데이터는 [ECMAScript 모듈 로더](/ko/nodejs/api/esm#data-imports)를 사용하여 MIME 유형에 따라 해석됩니다. `options.eval`이 `true`인 경우 이것은 경로가 아닌 JavaScript 코드를 포함하는 문자열입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `argv` [\<any[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 작업자에서 문자열화되어 `process.argv`에 추가되는 인수 목록입니다. 이는 `workerData`와 거의 유사하지만 값은 스크립트에 CLI 옵션으로 전달된 것처럼 전역 `process.argv`에서 사용할 수 있습니다.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 설정된 경우 작업자 스레드 내부의 `process.env`의 초기 값을 지정합니다. 특수 값으로, 부모 스레드와 자식 스레드가 환경 변수를 공유해야 함을 지정하기 위해 [`worker.SHARE_ENV`](/ko/nodejs/api/worker_threads#workershare_env)를 사용할 수 있습니다. 이 경우 한 스레드의 `process.env` 객체에 대한 변경 사항은 다른 스레드에도 영향을 미칩니다. **기본값:** `process.env`.
    - `eval` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이고 첫 번째 인수가 `string`인 경우 생성자에 대한 첫 번째 인수를 작업자가 온라인 상태가 되면 한 번 실행되는 스크립트로 해석합니다.
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 작업자에게 전달되는 노드 CLI 옵션 목록입니다. `--max-old-space-size`와 같은 V8 옵션과 `--title`과 같이 프로세스에 영향을 미치는 옵션은 지원되지 않습니다. 설정된 경우 작업자 내부에서 [`process.execArgv`](/ko/nodejs/api/process#processexecargv)로 제공됩니다. 기본적으로 옵션은 부모 스레드에서 상속됩니다.
    - `stdin` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 이것이 `true`로 설정되면 `worker.stdin`은 작업자 내부에서 `process.stdin`으로 표시되는 내용을 포함하는 쓰기 가능한 스트림을 제공합니다. 기본적으로 데이터는 제공되지 않습니다.
    - `stdout` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 이것이 `true`로 설정되면 `worker.stdout`은 부모에서 `process.stdout`으로 자동 파이프되지 않습니다.
    - `stderr` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 이것이 `true`로 설정되면 `worker.stderr`은 부모에서 `process.stderr`으로 자동 파이프되지 않습니다.
    - `workerData` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 복제되어 [`require('node:worker_threads').workerData`](/ko/nodejs/api/worker_threads#workerworkerdata)로 사용할 수 있는 모든 JavaScript 값입니다. 복제는 [HTML 구조적 복제 알고리즘](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)에 설명된 대로 발생하며 객체를 복제할 수 없는 경우(예: `function`을 포함하기 때문에) 오류가 발생합니다.
    - `trackUnmanagedFds` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 이것이 `true`로 설정되면 작업자는 [`fs.open()`](/ko/nodejs/api/fs#fsopenpath-flags-mode-callback) 및 [`fs.close()`](/ko/nodejs/api/fs#fsclosefd-callback)를 통해 관리되는 원시 파일 설명자를 추적하고 네트워크 소켓 또는 [`FileHandle`](/ko/nodejs/api/fs#class-filehandle) API를 통해 관리되는 파일 설명자와 같은 다른 리소스와 유사하게 작업자가 종료될 때 닫습니다. 이 옵션은 모든 중첩된 `Worker`에 의해 자동으로 상속됩니다. **기본값:** `true`.
    - `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 하나 이상의 `MessagePort`와 유사한 객체가 `workerData`에 전달되는 경우 해당 항목에 대해 `transferList`가 필요하거나 [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/ko/nodejs/api/errors#err_missing_message_port_in_transfer_list)가 발생합니다. 자세한 내용은 [`port.postMessage()`](/ko/nodejs/api/worker_threads#portpostmessagevalue-transferlist)를 참조하십시오.
    - `resourceLimits` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 새 JS 엔진 인스턴스에 대한 선택적 리소스 제한 세트입니다. 이러한 제한에 도달하면 `Worker` 인스턴스가 종료됩니다. 이러한 제한은 JS 엔진에만 영향을 미치며 `ArrayBuffer`를 포함한 외부 데이터에는 영향을 미치지 않습니다. 이러한 제한이 설정되어 있어도 전역 메모리 부족 상황이 발생하면 프로세스가 중단될 수 있습니다.
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 메인 힙의 최대 크기(MB)입니다. 명령줄 인수 [`--max-old-space-size`](/ko/nodejs/api/cli#--max-old-space-sizesize-in-mib)가 설정되면 이 설정이 재정의됩니다.
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 최근에 생성된 객체를 위한 힙 공간의 최대 크기입니다. 명령줄 인수 [`--max-semi-space-size`](/ko/nodejs/api/cli#--max-semi-space-sizesize-in-mib)가 설정되면 이 설정이 재정의됩니다.
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 생성된 코드에 사용되는 사전 할당된 메모리 범위의 크기입니다.
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 스레드의 기본 최대 스택 크기입니다. 작은 값은 사용할 수 없는 Worker 인스턴스로 이어질 수 있습니다. **기본값:** `4`.
  
 
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 디버깅/식별 목적으로 작업자 제목에 추가할 선택적 `name`으로, 최종 제목은 `[worker ${id}] ${name}`이 됩니다. **기본값:** `''`.
  
 


### 이벤트: `'error'` {#event-error}

**추가된 버전: v10.5.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

워커 스레드가 잡히지 않은 예외를 던지면 `'error'` 이벤트가 발생합니다. 이 경우 워커는 종료됩니다.

### 이벤트: `'exit'` {#event-exit}

**추가된 버전: v10.5.0**

- `exitCode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

워커가 중지되면 `'exit'` 이벤트가 발생합니다. 워커가 [`process.exit()`](/ko/nodejs/api/process#processexitcode)를 호출하여 종료된 경우 `exitCode` 매개변수는 전달된 종료 코드입니다. 워커가 종료된 경우 `exitCode` 매개변수는 `1`입니다.

이것은 모든 `Worker` 인스턴스에서 발생하는 마지막 이벤트입니다.

### 이벤트: `'message'` {#event-message_1}

**추가된 버전: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 전송된 값

워커 스레드가 [`require('node:worker_threads').parentPort.postMessage()`](/ko/nodejs/api/worker_threads#workerpostmessagevalue-transferlist)를 호출했을 때 `'message'` 이벤트가 발생합니다. 자세한 내용은 [`port.on('message')`](/ko/nodejs/api/worker_threads#event-message) 이벤트를 참조하세요.

워커 스레드에서 보낸 모든 메시지는 `Worker` 객체에서 [`'exit'` 이벤트](/ko/nodejs/api/worker_threads#event-exit)가 발생하기 전에 발생합니다.

### 이벤트: `'messageerror'` {#event-messageerror_1}

**추가된 버전: v14.5.0, v12.19.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 에러 객체

메시지 역직렬화에 실패하면 `'messageerror'` 이벤트가 발생합니다.

### 이벤트: `'online'` {#event-online}

**추가된 버전: v10.5.0**

워커 스레드가 JavaScript 코드 실행을 시작하면 `'online'` 이벤트가 발생합니다.

### `worker.getHeapSnapshot([options])` {#workergetheapsnapshotoptions}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.1.0 | 힙 스냅샷을 구성하는 옵션을 지원합니다. |
| v13.9.0, v12.17.0 | 추가된 버전: v13.9.0, v12.17.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exposeInternals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) true이면 힙 스냅샷에 내부를 노출합니다. **기본값:** `false`.
    - `exposeNumericValues` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) true이면 인공 필드에 숫자 값을 노출합니다. **기본값:** `false`.


- 반환값: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) V8 힙 스냅샷을 포함하는 Readable Stream에 대한 Promise

Worker의 현재 상태에 대한 V8 스냅샷에 대한 읽기 가능한 스트림을 반환합니다. 자세한 내용은 [`v8.getHeapSnapshot()`](/ko/nodejs/api/v8#v8getheapsnapshotoptions)를 참조하세요.

[`'exit'` 이벤트](/ko/nodejs/api/worker_threads#event-exit)가 발생하기 전에 발생할 수 있는 Worker 스레드가 더 이상 실행되고 있지 않으면 반환된 `Promise`는 [`ERR_WORKER_NOT_RUNNING`](/ko/nodejs/api/errors#err_worker_not_running) 오류와 함께 즉시 거부됩니다.


### `worker.performance` {#workerperformance}

**추가된 버전: v15.1.0, v14.17.0, v12.22.0**

worker 인스턴스에서 성능 정보를 쿼리하는 데 사용할 수 있는 객체입니다. [`perf_hooks.performance`](/ko/nodejs/api/perf_hooks#perf_hooksperformance)와 유사합니다.

#### `performance.eventLoopUtilization([utilization1[, utilization2]])` {#performanceeventlooputilizationutilization1-utilization2}

**추가된 버전: v15.1.0, v14.17.0, v12.22.0**

- `utilization1` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `eventLoopUtilization()`에 대한 이전 호출의 결과입니다.
- `utilization2` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `utilization1` 이전의 `eventLoopUtilization()`에 대한 이전 호출의 결과입니다.
- 반환값: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `active` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

[`perf_hooks` `eventLoopUtilization()`](/ko/nodejs/api/perf_hooks#performanceeventlooputilizationutilization1-utilization2)과 동일한 호출이지만 worker 인스턴스의 값이 반환됩니다.

한 가지 차이점은 메인 스레드와 달리 worker 내의 부트스트래핑이 이벤트 루프 내에서 수행된다는 것입니다. 따라서 worker의 스크립트 실행이 시작되면 이벤트 루프 활용률을 즉시 사용할 수 있습니다.

증가하지 않는 `idle` 시간은 worker가 부트스트랩에 갇혀 있음을 나타내지 않습니다. 다음 예제는 worker의 전체 수명이 `idle` 시간을 누적하지 않지만 여전히 메시지를 처리할 수 있는 방법을 보여줍니다.

```js [ESM]
const { Worker, isMainThread, parentPort } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  setInterval(() => {
    worker.postMessage('hi');
    console.log(worker.performance.eventLoopUtilization());
  }, 100).unref();
  return;
}

parentPort.on('message', () => console.log('msg')).unref();
(function r(n) {
  if (--n < 0) return;
  const t = Date.now();
  while (Date.now() - t < 300);
  setImmediate(r, n);
})(10);
```
worker의 이벤트 루프 활용률은 [`'online'` 이벤트](/ko/nodejs/api/worker_threads#event-online)가 발생한 후에만 사용할 수 있으며, 이 이벤트 이전이나 [`'exit'` 이벤트](/ko/nodejs/api/worker_threads#event-exit) 이후에 호출되면 모든 속성의 값은 `0`입니다.


### `worker.postMessage(value[, transferList])` {#workerpostmessagevalue-transferlist}

**추가된 버전: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[`require('node:worker_threads').parentPort.on('message')`](/ko/nodejs/api/worker_threads#event-message)를 통해 수신되는 워커에게 메시지를 보냅니다. 자세한 내용은 [`port.postMessage()`](/ko/nodejs/api/worker_threads#portpostmessagevalue-transferlist)를 참조하십시오.

### `worker.ref()` {#workerref}

**추가된 버전: v10.5.0**

`unref()`의 반대입니다. 이전에 `unref()`된 워커에서 `ref()`를 호출하면 활성 핸들만 남아 있는 경우 프로그램이 종료되지 않습니다(기본 동작). 워커가 `ref()`된 경우 `ref()`를 다시 호출해도 아무런 효과가 없습니다.

### `worker.resourceLimits` {#workerresourcelimits_1}

**추가된 버전: v13.2.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

이 Worker 스레드에 대한 JS 엔진 리소스 제약 조건 세트를 제공합니다. `resourceLimits` 옵션이 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 생성자에 전달된 경우 해당 값과 일치합니다.

워커가 중지된 경우 반환 값은 빈 객체입니다.

### `worker.stderr` {#workerstderr}

**추가된 버전: v10.5.0**

- [\<stream.Readable\>](/ko/nodejs/api/stream#class-streamreadable)

이는 워커 스레드 내부의 [`process.stderr`](/ko/nodejs/api/process#processstderr)에 기록된 데이터를 포함하는 읽기 가능한 스트림입니다. `stderr: true`가 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 생성자에 전달되지 않은 경우 데이터는 상위 스레드의 [`process.stderr`](/ko/nodejs/api/process#processstderr) 스트림으로 파이프됩니다.


### `worker.stdin` {#workerstdin}

**Added in: v10.5.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<stream.Writable\>](/ko/nodejs/api/stream#class-streamwritable)

`stdin: true`가 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 생성자에 전달된 경우, 이것은 쓰기 가능한 스트림입니다. 이 스트림에 쓰여진 데이터는 워커 스레드에서 [`process.stdin`](/ko/nodejs/api/process#processstdin)으로 사용할 수 있습니다.

### `worker.stdout` {#workerstdout}

**Added in: v10.5.0**

- [\<stream.Readable\>](/ko/nodejs/api/stream#class-streamreadable)

이것은 워커 스레드 내부의 [`process.stdout`](/ko/nodejs/api/process#processstdout)에 쓰여진 데이터를 포함하는 읽기 가능한 스트림입니다. `stdout: true`가 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 생성자에 전달되지 않은 경우, 데이터는 부모 스레드의 [`process.stdout`](/ko/nodejs/api/process#processstdout) 스트림으로 파이프됩니다.

### `worker.terminate()` {#workerterminate}


::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v12.5.0 | 이제 이 함수는 Promise를 반환합니다. 콜백을 전달하는 것은 더 이상 사용되지 않으며, Worker가 실제로 동기적으로 종료되었기 때문에 이 버전까지는 쓸모가 없었습니다. 종료는 이제 완전히 비동기 작업입니다. |
| v10.5.0 | Added in: v10.5.0 |
:::

- 반환 값: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

워커 스레드에서 가능한 한 빨리 모든 JavaScript 실행을 중단합니다. [`'exit' 이벤트`](/ko/nodejs/api/worker_threads#event-exit)가 발생하면 완료되는 종료 코드에 대한 Promise를 반환합니다.

### `worker.threadId` {#workerthreadid_1}

**Added in: v10.5.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

참조된 스레드의 정수 식별자입니다. 워커 스레드 내부에서, [`require('node:worker_threads').threadId`](/ko/nodejs/api/worker_threads#workerthreadid)로 사용할 수 있습니다. 이 값은 단일 프로세스 내의 각 `Worker` 인스턴스에 대해 고유합니다.

### `worker.unref()` {#workerunref}

**Added in: v10.5.0**

워커에서 `unref()`를 호출하면 이벤트 시스템에서 활성 핸들이 이것뿐인 경우 스레드가 종료될 수 있습니다. 워커가 이미 `unref()`된 경우 `unref()`를 다시 호출해도 아무런 효과가 없습니다.


## 참고 사항 {#notes}

### stdio의 동기적 차단 {#synchronous-blocking-of-stdio}

`Worker`는 [\<MessagePort\>](/ko/nodejs/api/worker_threads#class-messageport)를 통해 메시지 전달을 활용하여 `stdio`와의 상호 작용을 구현합니다. 이는 `Worker`에서 발생하는 `stdio` 출력이 Node.js 이벤트 루프를 차단하는 수신측의 동기적 코드에 의해 차단될 수 있음을 의미합니다.

::: code-group
```js [ESM]
import {
  Worker,
  isMainThread,
} from 'node:worker_threads';

if (isMainThread) {
  new Worker(new URL(import.meta.url));
  for (let n = 0; n < 1e10; n++) {
    // 작업을 시뮬레이션하기 위한 루프입니다.
  }
} else {
  // 이 출력은 메인 스레드의 for 루프에 의해 차단됩니다.
  console.log('foo');
}
```

```js [CJS]
'use strict';

const {
  Worker,
  isMainThread,
} = require('node:worker_threads');

if (isMainThread) {
  new Worker(__filename);
  for (let n = 0; n < 1e10; n++) {
    // 작업을 시뮬레이션하기 위한 루프입니다.
  }
} else {
  // 이 출력은 메인 스레드의 for 루프에 의해 차단됩니다.
  console.log('foo');
}
```
:::

### 프리로드 스크립트에서 워커 스레드 시작하기 {#launching-worker-threads-from-preload-scripts}

프리로드 스크립트( `-r` 명령줄 플래그를 사용하여 로드 및 실행되는 스크립트)에서 워커 스레드를 시작할 때 주의하십시오. `execArgv` 옵션을 명시적으로 설정하지 않으면 새 워커 스레드는 실행 중인 프로세스의 명령줄 플래그를 자동으로 상속하고 메인 스레드와 동일한 프리로드 스크립트를 프리로드합니다. 프리로드 스크립트가 무조건적으로 워커 스레드를 시작하면 스폰된 모든 스레드는 애플리케이션이 충돌할 때까지 다른 스레드를 스폰합니다.

