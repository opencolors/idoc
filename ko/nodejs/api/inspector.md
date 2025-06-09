---
title: Node.js 인스펙터 모듈 문서
description: Node.js의 인스펙터 모듈은 V8 인스펙터와 상호작용하기 위한 API를 제공하여 개발자가 인스펙터 프로토콜에 연결하여 Node.js 애플리케이션을 디버깅할 수 있게 합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 인스펙터 모듈 문서 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 인스펙터 모듈은 V8 인스펙터와 상호작용하기 위한 API를 제공하여 개발자가 인스펙터 프로토콜에 연결하여 Node.js 애플리케이션을 디버깅할 수 있게 합니다.
  - - meta
    - name: twitter:title
      content: Node.js 인스펙터 모듈 문서 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 인스펙터 모듈은 V8 인스펙터와 상호작용하기 위한 API를 제공하여 개발자가 인스펙터 프로토콜에 연결하여 Node.js 애플리케이션을 디버깅할 수 있게 합니다.
---


# Inspector {#inspector}

::: tip [안정됨: 2 - 안정됨]
[안정됨: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정됨
:::

**소스 코드:** [lib/inspector.js](https://github.com/nodejs/node/blob/v23.5.0/lib/inspector.js)

`node:inspector` 모듈은 V8 inspector와 상호 작용하기 위한 API를 제공합니다.

다음을 사용하여 액세스할 수 있습니다.

::: code-group
```js [ESM]
import * as inspector from 'node:inspector/promises';
```

```js [CJS]
const inspector = require('node:inspector/promises');
```
:::

또는

::: code-group
```js [ESM]
import * as inspector from 'node:inspector';
```

```js [CJS]
const inspector = require('node:inspector');
```
:::

## Promises API {#promises-api}

::: warning [안정됨: 1 - 실험적]
[안정됨: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

**다음 버전부터 추가됨: v19.0.0**

### 클래스: `inspector.Session` {#class-inspectorsession}

- 확장: [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter)

`inspector.Session`은 V8 inspector 백엔드로 메시지를 디스패치하고 메시지 응답 및 알림을 수신하는 데 사용됩니다.

#### `new inspector.Session()` {#new-inspectorsession}

**다음 버전부터 추가됨: v8.0.0**

`inspector.Session` 클래스의 새 인스턴스를 만듭니다. inspector 세션은 메시지를 inspector 백엔드로 디스패치하기 전에 [`session.connect()`](/ko/nodejs/api/inspector#sessionconnect)를 통해 연결해야 합니다.

`Session`을 사용하는 경우 console API에서 출력된 객체는 `Runtime.DiscardConsoleEntries` 명령을 수동으로 수행하지 않으면 해제되지 않습니다.

#### 이벤트: `'inspectorNotification'` {#event-inspectornotification}

**다음 버전부터 추가됨: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 알림 메시지 객체

V8 Inspector로부터 알림이 수신될 때마다 발생합니다.

```js [ESM]
session.on('inspectorNotification', (message) => console.log(message.method));
// Debugger.paused
// Debugger.resumed
```
특정 메서드가 있는 알림만 구독할 수도 있습니다.


#### 이벤트: `&lt;inspector-protocol-method&gt;`; {#event-&lt;inspector-protocol-method&gt;;}

**추가된 버전: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 알림 메시지 객체

`method` 필드가 `\<inspector-protocol-method\>` 값으로 설정된 검사기 알림을 수신할 때 발생합니다.

다음 스니펫은 [`'Debugger.paused'`](https://chromedevtools.github.io/devtools-protocol/v8/Debugger#event-paused) 이벤트에 대한 리스너를 설치하고 프로그램 실행이 일시 중단될 때마다 (예: 중단점을 통해) 프로그램 일시 중단 이유를 출력합니다.

```js [ESM]
session.on('Debugger.paused', ({ params }) => {
  console.log(params.hitBreakpoints);
});
// [ '/the/file/that/has/the/breakpoint.js:11:0' ]
```
#### `session.connect()` {#sessionconnect}

**추가된 버전: v8.0.0**

세션을 검사기 백엔드에 연결합니다.

#### `session.connectToMainThread()` {#sessionconnecttomainthread}

**추가된 버전: v12.11.0**

세션을 메인 스레드 검사기 백엔드에 연결합니다. 이 API가 Worker 스레드에서 호출되지 않은 경우 예외가 발생합니다.

#### `session.disconnect()` {#sessiondisconnect}

**추가된 버전: v8.0.0**

세션을 즉시 닫습니다. 보류 중인 모든 메시지 콜백은 오류와 함께 호출됩니다. 메시지를 다시 보내려면 [`session.connect()`](/ko/nodejs/api/inspector#sessionconnect)를 호출해야 합니다. 다시 연결된 세션은 활성화된 에이전트 또는 구성된 중단점과 같은 모든 검사기 상태를 잃게 됩니다.

#### `session.post(method[, params])` {#sessionpostmethod-params}

**추가된 버전: v19.0.0**

- `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- 반환값: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

검사기 백엔드에 메시지를 게시합니다.

```js [ESM]
import { Session } from 'node:inspector/promises';
try {
  const session = new Session();
  session.connect();
  const result = await session.post('Runtime.evaluate', { expression: '2 + 2' });
  console.log(result);
} catch (error) {
  console.error(error);
}
// Output: { result: { type: 'number', value: 4, description: '4' } }
```
최신 버전의 V8 검사기 프로토콜은 [Chrome DevTools Protocol Viewer](https://chromedevtools.github.io/devtools-protocol/v8/)에 게시됩니다.

Node.js 검사기는 V8에서 선언한 모든 Chrome DevTools Protocol 도메인을 지원합니다. Chrome DevTools Protocol 도메인은 애플리케이션 상태를 검사하고 런타임 이벤트를 수신하는 데 사용되는 런타임 에이전트 중 하나와 상호 작용하기 위한 인터페이스를 제공합니다.


#### 사용 예시 {#example-usage}

디버거 외에도 다양한 V8 프로파일러를 DevTools 프로토콜을 통해 사용할 수 있습니다.

##### CPU 프로파일러 {#cpu-profiler}

[CPU 프로파일러](https://chromedevtools.github.io/devtools-protocol/v8/Profiler)를 사용하는 방법의 예시입니다.

```js [ESM]
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();
session.connect();

await session.post('Profiler.enable');
await session.post('Profiler.start');
// 측정하려는 비즈니스 로직을 여기에 호출하세요...

// 얼마 후...
const { profile } = await session.post('Profiler.stop');

// 프로필을 디스크에 쓰거나, 업로드하는 등의 작업을 수행하세요.
fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
```
##### 힙 프로파일러 {#heap-profiler}

[힙 프로파일러](https://chromedevtools.github.io/devtools-protocol/v8/HeapProfiler)를 사용하는 방법의 예시입니다.

```js [ESM]
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

const result = await session.post('HeapProfiler.takeHeapSnapshot', null);
console.log('HeapProfiler.takeHeapSnapshot done:', result);
session.disconnect();
fs.closeSync(fd);
```
## 콜백 API {#callback-api}

### 클래스: `inspector.Session` {#class-inspectorsession_1}

- 확장: [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter)

`inspector.Session`은 V8 inspector 백엔드로 메시지를 보내고 메시지 응답 및 알림을 받는 데 사용됩니다.

#### `new inspector.Session()` {#new-inspectorsession_1}

**추가된 버전: v8.0.0**

`inspector.Session` 클래스의 새 인스턴스를 만듭니다. inspector 세션은 inspector 백엔드로 메시지를 보내기 전에 [`session.connect()`](/ko/nodejs/api/inspector#sessionconnect)를 통해 연결해야 합니다.

`Session`을 사용하는 경우 console API에서 출력된 객체는 `Runtime.DiscardConsoleEntries` 명령을 수동으로 수행하지 않으면 해제되지 않습니다.


#### 이벤트: `'inspectorNotification'` {#event-inspectornotification_1}

**추가된 버전: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 알림 메시지 객체

V8 Inspector에서 알림을 받을 때마다 발생합니다.

```js [ESM]
session.on('inspectorNotification', (message) => console.log(message.method));
// Debugger.paused
// Debugger.resumed
```
특정 메서드를 가진 알림만 구독할 수도 있습니다:

#### 이벤트: `&lt;inspector-protocol-method&gt;` {#event-&lt;inspector-protocol-method&gt;;_1}

**추가된 버전: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 알림 메시지 객체

메서드 필드가 `\<inspector-protocol-method\>` 값으로 설정된 인스펙터 알림을 받을 때 발생합니다.

다음 스니펫은 [`'Debugger.paused'`](https://chromedevtools.github.io/devtools-protocol/v8/Debugger#event-paused) 이벤트에 리스너를 설치하고 프로그램 실행이 중단될 때마다 (예: 중단점을 통해) 프로그램 중단 이유를 출력합니다.

```js [ESM]
session.on('Debugger.paused', ({ params }) => {
  console.log(params.hitBreakpoints);
});
// [ '/the/file/that/has/the/breakpoint.js:11:0' ]
```
#### `session.connect()` {#sessionconnect_1}

**추가된 버전: v8.0.0**

세션을 인스펙터 백엔드에 연결합니다.

#### `session.connectToMainThread()` {#sessionconnecttomainthread_1}

**추가된 버전: v12.11.0**

세션을 메인 스레드 인스펙터 백엔드에 연결합니다. 이 API가 Worker 스레드에서 호출되지 않으면 예외가 발생합니다.

#### `session.disconnect()` {#sessiondisconnect_1}

**추가된 버전: v8.0.0**

세션을 즉시 닫습니다. 보류 중인 모든 메시지 콜백이 오류와 함께 호출됩니다. 메시지를 다시 보내려면 [`session.connect()`](/ko/nodejs/api/inspector#sessionconnect)를 호출해야 합니다. 다시 연결된 세션은 활성화된 에이전트 또는 구성된 중단점과 같은 모든 인스펙터 상태를 잃게 됩니다.

#### `session.post(method[, params][, callback])` {#sessionpostmethod-params-callback}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 잘못된 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v8.0.0 | 추가된 버전: v8.0.0 |
:::

- `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

인스펙터 백엔드에 메시지를 게시합니다. 응답을 받으면 `callback`이 알림을 받습니다. `callback`은 오류 및 메시지별 결과의 두 가지 선택적 인수를 허용하는 함수입니다.

```js [ESM]
session.post('Runtime.evaluate', { expression: '2 + 2' },
             (error, { result }) => console.log(result));
// 출력: { type: 'number', value: 4, description: '4' }
```

최신 버전의 V8 인스펙터 프로토콜은 [Chrome DevTools Protocol Viewer](https://chromedevtools.github.io/devtools-protocol/v8/)에 게시됩니다.

Node.js 인스펙터는 V8에서 선언한 모든 Chrome DevTools Protocol 도메인을 지원합니다. Chrome DevTools Protocol 도메인은 애플리케이션 상태를 검사하고 런타임 이벤트를 수신하는 데 사용되는 런타임 에이전트 중 하나와 상호 작용하기 위한 인터페이스를 제공합니다.

V8에 `HeapProfiler.takeHeapSnapshot` 또는 `HeapProfiler.stopTrackingHeapObjects` 명령을 보낼 때 `reportProgress`를 `true`로 설정할 수 없습니다.


#### 사용 예시 {#example-usage_1}

디버거 외에도 DevTools 프로토콜을 통해 다양한 V8 프로파일러를 사용할 수 있습니다.

##### CPU 프로파일러 {#cpu-profiler_1}

다음은 [CPU 프로파일러](https://chromedevtools.github.io/devtools-protocol/v8/Profiler) 사용 방법을 보여주는 예시입니다.

```js [ESM]
const inspector = require('node:inspector');
const fs = require('node:fs');
const session = new inspector.Session();
session.connect();

session.post('Profiler.enable', () => {
  session.post('Profiler.start', () => {
    // 여기서 측정하려는 비즈니스 로직을 호출합니다...

    // 얼마 후...
    session.post('Profiler.stop', (err, { profile }) => {
      // 프로필을 디스크에 쓰거나 업로드하는 등의 작업을 수행합니다.
      if (!err) {
        fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
      }
    });
  });
});
```
##### 힙 프로파일러 {#heap-profiler_1}

다음은 [힙 프로파일러](https://chromedevtools.github.io/devtools-protocol/v8/HeapProfiler) 사용 방법을 보여주는 예시입니다.

```js [ESM]
const inspector = require('node:inspector');
const fs = require('node:fs');
const session = new inspector.Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

session.post('HeapProfiler.takeHeapSnapshot', null, (err, r) => {
  console.log('HeapProfiler.takeHeapSnapshot done:', err, r);
  session.disconnect();
  fs.closeSync(fd);
});
```
## 공통 객체 {#common-objects}

### `inspector.close()` {#inspectorclose}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.10.0 | 워커 스레드에서 API가 노출됩니다. |
| v9.0.0 | 추가됨: v9.0.0 |
:::

남아 있는 모든 연결을 닫으려고 시도하며, 모두 닫힐 때까지 이벤트 루프를 차단합니다. 모든 연결이 닫히면 검사기를 비활성화합니다.

### `inspector.console` {#inspectorconsole}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 원격 검사기 콘솔로 메시지를 보내는 객체입니다.

```js [ESM]
require('node:inspector').console.log('a message');
```
검사기 콘솔은 Node.js 콘솔과 API 패리티가 없습니다.


### `inspector.open([port[, host[, wait]]])` {#inspectoropenport-host-wait}

::: info [내역]
| 버전 | 변경 사항 |
| --- | --- |
| v20.6.0 | inspector.open()은 이제 `Disposable` 객체를 반환합니다. |
:::

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Inspector 연결을 수신할 포트입니다. 선택 사항입니다. **기본값:** CLI에 지정된 값입니다.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Inspector 연결을 수신할 호스트입니다. 선택 사항입니다. **기본값:** CLI에 지정된 값입니다.
- `wait` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 클라이언트가 연결될 때까지 차단합니다. 선택 사항입니다. **기본값:** `false`.
- 반환: [\<Disposable\>](https://tc39.es/proposal-explicit-resource-management/#sec-disposable-interface) [`inspector.close()`](/ko/nodejs/api/inspector#inspectorclose)를 호출하는 Disposable입니다.

호스트와 포트에서 inspector를 활성화합니다. `node --inspect=[[host:]port]`와 동일하지만, node가 시작된 후 프로그래밍 방식으로 수행할 수 있습니다.

wait가 `true`이면 클라이언트가 검사 포트에 연결되고 흐름 제어가 디버거 클라이언트에 전달될 때까지 차단됩니다.

`host` 매개변수 사용과 관련된 [보안 경고](/ko/nodejs/api/cli#warning-binding-inspector-to-a-public-ipport-combination-is-insecure)를 참조하십시오.

### `inspector.url()` {#inspectorurl}

- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

활성 inspector의 URL을 반환하거나, 없는 경우 `undefined`를 반환합니다.

```bash [BASH]
$ node --inspect -p 'inspector.url()'
Debugger listening on ws://127.0.0.1:9229/166e272e-7a30-4d09-97ce-f1c012b43c34
For help, see: https://nodejs.org/en/docs/inspector
ws://127.0.0.1:9229/166e272e-7a30-4d09-97ce-f1c012b43c34

$ node --inspect=localhost:3000 -p 'inspector.url()'
Debugger listening on ws://localhost:3000/51cf8d0e-3c36-4c59-8efd-54519839e56a
For help, see: https://nodejs.org/en/docs/inspector
ws://localhost:3000/51cf8d0e-3c36-4c59-8efd-54519839e56a

$ node -p 'inspector.url()'
undefined
```

### `inspector.waitForDebugger()` {#inspectorwaitfordebugger}

**추가된 버전: v12.7.0**

클라이언트(기존 또는 나중에 연결된)가 `Runtime.runIfWaitingForDebugger` 명령을 보낼 때까지 차단합니다.

활성 검사기가 없으면 예외가 발생합니다.

## DevTools와 통합 {#integration-with-devtools}

`node:inspector` 모듈은 Chrome DevTools Protocol을 지원하는 개발 도구와 통합하기 위한 API를 제공합니다. 실행 중인 Node.js 인스턴스에 연결된 DevTools 프런트엔드는 인스턴스에서 발생하는 프로토콜 이벤트를 캡처하고 디버깅을 용이하게 하기 위해 해당 이벤트들을 표시할 수 있습니다. 다음 메서드는 연결된 모든 프런트엔드에 프로토콜 이벤트를 브로드캐스트합니다. 메서드에 전달되는 `params`는 프로토콜에 따라 선택 사항일 수 있습니다.

```js [ESM]
// `Network.requestWillBeSent` 이벤트가 발생합니다.
inspector.Network.requestWillBeSent({
  requestId: 'request-id-1',
  timestamp: Date.now() / 1000,
  wallTime: Date.now(),
  request: {
    url: 'https://nodejs.org/en',
    method: 'GET',
  },
});
```
### `inspector.Network.requestWillBeSent([params])` {#inspectornetworkrequestwillbesentparams}

**추가된 버전: v22.6.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

이 기능은 `--experimental-network-inspection` 플래그가 활성화된 경우에만 사용할 수 있습니다.

연결된 프런트엔드에 `Network.requestWillBeSent` 이벤트를 브로드캐스트합니다. 이 이벤트는 애플리케이션이 HTTP 요청을 보내려고 함을 나타냅니다.

### `inspector.Network.responseReceived([params])` {#inspectornetworkresponsereceivedparams}

**추가된 버전: v22.6.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

이 기능은 `--experimental-network-inspection` 플래그가 활성화된 경우에만 사용할 수 있습니다.

연결된 프런트엔드에 `Network.responseReceived` 이벤트를 브로드캐스트합니다. 이 이벤트는 HTTP 응답을 사용할 수 있음을 나타냅니다.


### `inspector.Network.loadingFinished([params])` {#inspectornetworkloadingfinishedparams}

**Added in: v22.6.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - Experimental
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

이 기능은 `--experimental-network-inspection` 플래그가 활성화된 경우에만 사용할 수 있습니다.

연결된 프런트엔드에 `Network.loadingFinished` 이벤트를 브로드캐스트합니다. 이 이벤트는 HTTP 요청 로딩이 완료되었음을 나타냅니다.

### `inspector.Network.loadingFailed([params])` {#inspectornetworkloadingfailedparams}

**Added in: v22.7.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - Experimental
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

이 기능은 `--experimental-network-inspection` 플래그가 활성화된 경우에만 사용할 수 있습니다.

연결된 프런트엔드에 `Network.loadingFailed` 이벤트를 브로드캐스트합니다. 이 이벤트는 HTTP 요청 로딩이 실패했음을 나타냅니다.

## 중단점 지원 {#support-of-breakpoints}

Chrome DevTools Protocol [`Debugger` 도메인](https://chromedevtools.github.io/devtools-protocol/v8/Debugger)을 통해 `inspector.Session`은 프로그램에 연결하고 코드를 단계별로 실행하기 위해 중단점을 설정할 수 있습니다.

그러나 [`session.connect()`](/ko/nodejs/api/inspector#sessionconnect)에 의해 연결된 동일 스레드 `inspector.Session`으로 중단점을 설정하는 것은 연결되고 일시 중지된 프로그램이 디버거 자체이므로 피해야 합니다. 대신 [`session.connectToMainThread()`](/ko/nodejs/api/inspector#sessionconnecttomainthread)를 통해 메인 스레드에 연결하고 작업자 스레드에 중단점을 설정하거나 WebSocket 연결을 통해 [Debugger](/ko/nodejs/api/debugger) 프로그램에 연결해 보십시오.

