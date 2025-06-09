---
title: Node.js 문서 - 클러스터
description: Node.js의 클러스터 모듈을 사용하여 서버 포트를 공유하는 자식 프로세스를 생성하여 애플리케이션의 성능과 확장성을 향상시키는 방법을 배웁니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - 클러스터 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 클러스터 모듈을 사용하여 서버 포트를 공유하는 자식 프로세스를 생성하여 애플리케이션의 성능과 확장성을 향상시키는 방법을 배웁니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - 클러스터 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 클러스터 모듈을 사용하여 서버 포트를 공유하는 자식 프로세스를 생성하여 애플리케이션의 성능과 확장성을 향상시키는 방법을 배웁니다.
---


# 클러스터 {#cluster}

::: tip [안정성: 2 - 안정됨]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정됨
:::

**소스 코드:** [lib/cluster.js](https://github.com/nodejs/node/blob/v23.5.0/lib/cluster.js)

Node.js 프로세스 클러스터를 사용하면 애플리케이션 스레드 간에 워크로드를 분산할 수 있는 Node.js 인스턴스를 여러 개 실행할 수 있습니다. 프로세스 격리가 필요하지 않은 경우 [`worker_threads`](/ko/nodejs/api/worker_threads) 모듈을 대신 사용하세요. 이 모듈을 사용하면 단일 Node.js 인스턴스 내에서 여러 애플리케이션 스레드를 실행할 수 있습니다.

클러스터 모듈을 사용하면 서버 포트를 공유하는 자식 프로세스를 쉽게 만들 수 있습니다.

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```

```js [CJS]
const cluster = require('node:cluster');
const http = require('node:http');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```
:::

이제 Node.js를 실행하면 작업자 간에 포트 8000을 공유합니다.

```bash [BASH]
$ node server.js
Primary 3596 is running
Worker 4324 started
Worker 4520 started
Worker 6056 started
Worker 5644 started
```
Windows에서는 아직 작업자에서 명명된 파이프 서버를 설정할 수 없습니다.


## 작동 방식 {#how-it-works}

워커 프로세스는 [`child_process.fork()`](/ko/nodejs/api/child_process#child_processforkmodulepath-args-options) 메서드를 사용하여 생성되므로 IPC를 통해 부모와 통신하고 서버 핸들을 앞뒤로 전달할 수 있습니다.

클러스터 모듈은 들어오는 연결을 분산하는 두 가지 방법을 지원합니다.

첫 번째 방법(Windows를 제외한 모든 플랫폼에서 기본값)은 라운드 로빈 방식입니다. 여기서 기본 프로세스는 포트에서 수신하고 새 연결을 수락한 다음 워커 프로세스에 과부하를 주지 않도록 내장된 스마트 기능과 함께 라운드 로빈 방식으로 분산합니다.

두 번째 방법은 기본 프로세스가 수신 소켓을 만들고 관심 있는 워커에게 보내는 것입니다. 그러면 워커가 들어오는 연결을 직접 수락합니다.

두 번째 방법은 이론적으로 최고의 성능을 제공해야 합니다. 그러나 실제로는 운영 체제 스케줄러의 변동성으로 인해 분산이 매우 불균형해지는 경향이 있습니다. 전체 8개 프로세스 중에서 단 2개의 프로세스에서 모든 연결의 70% 이상이 끝나는 로드가 관찰되었습니다.

`server.listen()`은 대부분의 작업을 기본 프로세스에 넘겨주기 때문에 일반 Node.js 프로세스와 클러스터 워커 간의 동작이 다른 세 가지 경우가 있습니다.

Node.js는 라우팅 로직을 제공하지 않습니다. 따라서 세션 및 로그인과 같은 항목에 대한 메모리 내 데이터 개체에 너무 많이 의존하지 않도록 애플리케이션을 설계하는 것이 중요합니다.

워커는 모두 별도의 프로세스이므로 다른 워커에 영향을 주지 않고 프로그램의 필요에 따라 종료되거나 다시 생성될 수 있습니다. 일부 워커가 여전히 살아있는 한 서버는 계속 연결을 수락합니다. 살아있는 워커가 없으면 기존 연결이 끊어지고 새 연결이 거부됩니다. 그러나 Node.js는 자동으로 워커 수를 관리하지 않습니다. 자체 요구 사항에 따라 워커 풀을 관리하는 것은 애플리케이션의 책임입니다.

`node:cluster` 모듈의 주요 사용 사례는 네트워킹이지만 워커 프로세스가 필요한 다른 사용 사례에도 사용할 수 있습니다.


## 클래스: `Worker` {#class-worker}

**추가된 버전: v0.7.0**

- 확장: [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter)

`Worker` 객체는 워커에 대한 모든 공개 정보와 메서드를 포함합니다. 주 프로세스에서는 `cluster.workers`를 사용하여 가져올 수 있습니다. 워커에서는 `cluster.worker`를 사용하여 가져올 수 있습니다.

### 이벤트: `'disconnect'` {#event-disconnect}

**추가된 버전: v0.7.7**

`cluster.on('disconnect')` 이벤트와 유사하지만, 이 워커에만 해당됩니다.

```js [ESM]
cluster.fork().on('disconnect', () => {
  // 워커가 연결 해제되었습니다.
});
```
### 이벤트: `'error'` {#event-error}

**추가된 버전: v0.7.3**

이 이벤트는 [`child_process.fork()`](/ko/nodejs/api/child_process#child_processforkmodulepath-args-options)에서 제공하는 이벤트와 동일합니다.

워커 내에서 `process.on('error')`를 사용할 수도 있습니다.

### 이벤트: `'exit'` {#event-exit}

**추가된 버전: v0.11.2**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 정상적으로 종료된 경우의 종료 코드입니다.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 프로세스가 강제 종료된 원인이 된 시그널의 이름입니다 (예: `'SIGHUP'`).

`cluster.on('exit')` 이벤트와 유사하지만, 이 워커에만 해당됩니다.

::: code-group
```js [ESM]
import cluster from 'node:cluster';

if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.on('exit', (code, signal) => {
    if (signal) {
      console.log(`worker was killed by signal: ${signal}`);
    } else if (code !== 0) {
      console.log(`worker exited with error code: ${code}`);
    } else {
      console.log('worker success!');
    }
  });
}
```

```js [CJS]
const cluster = require('node:cluster');

if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.on('exit', (code, signal) => {
    if (signal) {
      console.log(`worker was killed by signal: ${signal}`);
    } else if (code !== 0) {
      console.log(`worker exited with error code: ${code}`);
    } else {
      console.log('worker success!');
    }
  });
}
```
:::

### 이벤트: `'listening'` {#event-listening}

**추가된 버전: v0.7.0**

- `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`cluster.on('listening')` 이벤트와 유사하지만, 이 워커에만 해당됩니다.

::: code-group
```js [ESM]
cluster.fork().on('listening', (address) => {
  // 워커가 리스닝 중입니다.
});
```

```js [CJS]
cluster.fork().on('listening', (address) => {
  // 워커가 리스닝 중입니다.
});
```
:::

워커에서는 발생하지 않습니다.


### 이벤트: `'message'` {#event-message}

**추가된 버전: v0.7.0**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `handle` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`cluster`의 `'message'` 이벤트와 유사하지만, 이 워커에만 해당됩니다.

워커 내에서 `process.on('message')`를 사용할 수도 있습니다.

[`process` 이벤트: `'message'`](/ko/nodejs/api/process#event-message)를 참조하세요.

다음은 메시지 시스템을 사용하는 예입니다. 워커가 수신한 HTTP 요청 수를 주 프로세스에서 셉니다.

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

if (cluster.isPrimary) {

  // http 요청 추적
  let numReqs = 0;
  setInterval(() => {
    console.log(`numReqs = ${numReqs}`);
  }, 1000);

  // 요청 수 세기
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'notifyRequest') {
      numReqs += 1;
    }
  }

  // 워커를 시작하고 notifyRequest를 포함하는 메시지를 수신 대기합니다.
  const numCPUs = availableParallelism();
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', messageHandler);
  }

} else {

  // 워커 프로세스에는 http 서버가 있습니다.
  http.Server((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');

    // 요청에 대해 주 프로세스에 알립니다.
    process.send({ cmd: 'notifyRequest' });
  }).listen(8000);
}
```

```js [CJS]
const cluster = require('node:cluster');
const http = require('node:http');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

if (cluster.isPrimary) {

  // http 요청 추적
  let numReqs = 0;
  setInterval(() => {
    console.log(`numReqs = ${numReqs}`);
  }, 1000);

  // 요청 수 세기
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'notifyRequest') {
      numReqs += 1;
    }
  }

  // 워커를 시작하고 notifyRequest를 포함하는 메시지를 수신 대기합니다.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', messageHandler);
  }

} else {

  // 워커 프로세스에는 http 서버가 있습니다.
  http.Server((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');

    // 요청에 대해 주 프로세스에 알립니다.
    process.send({ cmd: 'notifyRequest' });
  }).listen(8000);
}
```
:::


### 이벤트: `'online'` {#event-online}

**추가된 버전: v0.7.0**

`cluster.on('online')` 이벤트와 유사하지만, 이 워커에 특화되어 있습니다.

```js [ESM]
cluster.fork().on('online', () => {
  // 워커가 온라인 상태입니다.
});
```
워커에서는 발생하지 않습니다.

### `worker.disconnect()` {#workerdisconnect}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v7.3.0 | 이제 이 메서드는 `worker`에 대한 참조를 반환합니다. |
| v0.7.7 | 추가된 버전: v0.7.7 |
:::

- 반환: [\<cluster.Worker\>](/ko/nodejs/api/cluster#class-worker) `worker`에 대한 참조입니다.

워커에서 이 함수는 모든 서버를 닫고 해당 서버에서 `'close'` 이벤트를 기다린 다음 IPC 채널을 연결 해제합니다.

프라이머리에서 내부 메시지가 워커로 전송되어 스스로 `.disconnect()`를 호출하게 합니다.

`.exitedAfterDisconnect`를 설정하게 합니다.

서버가 닫히면 더 이상 새 연결을 수락하지 않지만 다른 리스닝 워커가 연결을 수락할 수 있습니다. 기존 연결은 평소와 같이 닫을 수 있습니다. 더 이상 연결이 없으면 [`server.close()`](/ko/nodejs/api/net#event-close)를 참조하십시오. 워커에 대한 IPC 채널이 닫혀서 정상적으로 종료될 수 있습니다.

위 내용은 *서버* 연결에만 적용되며 클라이언트 연결은 워커에 의해 자동으로 닫히지 않으며 연결 해제는 종료하기 전에 닫히기를 기다리지 않습니다.

워커에서 `process.disconnect`가 존재하지만 이 함수가 아닙니다. 이는 [`disconnect()`](/ko/nodejs/api/child_process#subprocessdisconnect)입니다.

수명이 긴 서버 연결이 워커의 연결 해제를 차단할 수 있으므로 메시지를 보내서 애플리케이션 특정 작업을 수행하여 닫는 것이 유용할 수 있습니다. 또한 일정 시간이 지난 후 `'disconnect'` 이벤트가 발생하지 않은 경우 워커를 강제 종료하는 시간 초과를 구현하는 것도 유용할 수 있습니다.

```js [ESM]
if (cluster.isPrimary) {
  const worker = cluster.fork();
  let timeout;

  worker.on('listening', (address) => {
    worker.send('shutdown');
    worker.disconnect();
    timeout = setTimeout(() => {
      worker.kill();
    }, 2000);
  });

  worker.on('disconnect', () => {
    clearTimeout(timeout);
  });

} else if (cluster.isWorker) {
  const net = require('node:net');
  const server = net.createServer((socket) => {
    // 연결이 끝나지 않음
  });

  server.listen(8000);

  process.on('message', (msg) => {
    if (msg === 'shutdown') {
      // 서버에 대한 연결을 정상적으로 닫기 시작합니다.
    }
  });
}
```

### `worker.exitedAfterDisconnect` {#workerexitedafterdisconnect}

**Added in: v6.0.0**

- [\<boolean\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Boolean_type)

이 속성은 워커가 `.disconnect()`로 인해 종료된 경우 `true`입니다. 워커가 다른 방식으로 종료된 경우 `false`입니다. 워커가 종료되지 않은 경우 `undefined`입니다.

boolean [`worker.exitedAfterDisconnect`](/ko/nodejs/api/cluster#workerexitedafterdisconnect)를 사용하면 자발적인 종료와 우발적인 종료를 구별할 수 있으며, 주 프로세스는 이 값을 기반으로 워커를 다시 생성하지 않도록 선택할 수 있습니다.

```js [ESM]
cluster.on('exit', (worker, code, signal) => {
  if (worker.exitedAfterDisconnect === true) {
    console.log('아, 자발적인 종료였네 – 걱정할 필요 없어');
  }
});

// 워커 종료
worker.kill();
```
### `worker.id` {#workerid}

**Added in: v0.8.0**

- [\<integer\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Number_type)

각 새 워커에는 고유한 ID가 부여되며, 이 ID는 `id`에 저장됩니다.

워커가 활성 상태인 동안 이것은 `cluster.workers`에서 워커를 인덱싱하는 키입니다.

### `worker.isConnected()` {#workerisconnected}

**Added in: v0.11.14**

이 함수는 워커가 IPC 채널을 통해 주 프로세스에 연결되어 있으면 `true`를 반환하고, 그렇지 않으면 `false`를 반환합니다. 워커는 생성된 후 주 프로세스에 연결됩니다. `'disconnect'` 이벤트가 발생한 후 연결이 끊어집니다.

### `worker.isDead()` {#workerisdead}

**Added in: v0.11.14**

이 함수는 워커 프로세스가 종료되었는지 여부(`종료`되었거나 `시그널`을 받은 경우)에 따라 `true`를 반환합니다. 그렇지 않으면 `false`를 반환합니다.

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // 워커 포크.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('fork', (worker) => {
    console.log('worker is dead:', worker.isDead());
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log('worker is dead:', worker.isDead());
  });
} else {
  // 워커는 TCP 연결을 공유할 수 있습니다. 이 경우 HTTP 서버입니다.
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Current process\n ${process.pid}`);
    process.kill(process.pid);
  }).listen(8000);
}
```

```js [CJS]
const cluster = require('node:cluster');
const http = require('node:http');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // 워커 포크.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('fork', (worker) => {
    console.log('worker is dead:', worker.isDead());
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log('worker is dead:', worker.isDead());
  });
} else {
  // 워커는 TCP 연결을 공유할 수 있습니다. 이 경우 HTTP 서버입니다.
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Current process\n ${process.pid}`);
    process.kill(process.pid);
  }).listen(8000);
}
```
:::


### `worker.kill([signal])` {#workerkillsignal}

**추가된 버전: v0.9.12**

- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 워커 프로세스에 보낼 종료 신호의 이름입니다. **기본값:** `'SIGTERM'`

이 함수는 워커를 종료합니다. 기본 워커에서는 `worker.process` 연결을 끊고, 연결이 끊어지면 `signal`을 사용하여 종료합니다. 워커에서는 `signal`을 사용하여 프로세스를 종료합니다.

`kill()` 함수는 정상적인 연결 해제를 기다리지 않고 워커 프로세스를 종료하며, `worker.process.kill()`과 동일한 동작을 합니다.

이 메서드는 이전 버전과의 호환성을 위해 `worker.destroy()`로 별칭이 지정되었습니다.

워커에서 `process.kill()`이 존재하지만, 이 함수가 아니라 [`kill()`](/ko/nodejs/api/process#processkillpid-signal)입니다.

### `worker.process` {#workerprocess}

**추가된 버전: v0.7.0**

- [\<ChildProcess\>](/ko/nodejs/api/child_process#class-childprocess)

모든 워커는 [`child_process.fork()`](/ko/nodejs/api/child_process#child_processforkmodulepath-args-options)를 사용하여 생성되며, 이 함수에서 반환된 객체는 `.process`로 저장됩니다. 워커에서는 전역 `process`가 저장됩니다.

참고: [자식 프로세스 모듈](/ko/nodejs/api/child_process#child_processforkmodulepath-args-options).

워커는 `process`에서 `'disconnect'` 이벤트가 발생하고 `.exitedAfterDisconnect`가 `true`가 아니면 `process.exit(0)`을 호출합니다. 이는 실수로 인한 연결 해제를 방지합니다.

### `worker.send(message[, sendHandle[, options]][, callback])` {#workersendmessage-sendhandle-options-callback}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v4.0.0 | 이제 `callback` 매개변수가 지원됩니다. |
| v0.7.0 | 추가된 버전: v0.7.0 |
:::

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<Handle\>](/ko/nodejs/api/net#serverlistenhandle-backlog-callback)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `options` 인수는 특정 유형의 핸들 전송을 매개변수화하는 데 사용되는 객체입니다. `options`는 다음 속성을 지원합니다.
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `net.Socket` 인스턴스를 전달할 때 사용할 수 있는 값입니다. `true`이면 소켓이 전송 프로세스에서 열린 상태로 유지됩니다. **기본값:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환 값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

선택적으로 핸들과 함께 워커 또는 기본에 메시지를 보냅니다.

기본에서는 특정 워커에게 메시지를 보냅니다. 이는 [`ChildProcess.send()`](/ko/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback)와 동일합니다.

워커에서는 기본에 메시지를 보냅니다. 이는 `process.send()`와 동일합니다.

다음 예제는 기본에서 오는 모든 메시지를 다시 에코합니다.

```js [ESM]
if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.send('hi there');

} else if (cluster.isWorker) {
  process.on('message', (msg) => {
    process.send(msg);
  });
}
```

## 이벤트: `'disconnect'` {#event-disconnect_1}

**추가된 버전: v0.7.9**

- `worker` [\<cluster.Worker\>](/ko/nodejs/api/cluster#class-worker)

워커 IPC 채널 연결이 끊어진 후 발생합니다. 이는 워커가 정상적으로 종료되거나, 강제 종료되거나, 수동으로 연결이 끊어질 때 발생할 수 있습니다 (`worker.disconnect()` 사용 등).

`'disconnect'` 및 `'exit'` 이벤트 사이에 지연이 있을 수 있습니다. 이러한 이벤트는 프로세스가 정리 작업에 갇혀 있는지 또는 장기 연결이 있는지 감지하는 데 사용할 수 있습니다.

```js [ESM]
cluster.on('disconnect', (worker) => {
  console.log(`워커 #${worker.id}의 연결이 끊어졌습니다`);
});
```
## 이벤트: `'exit'` {#event-exit_1}

**추가된 버전: v0.7.9**

- `worker` [\<cluster.Worker\>](/ko/nodejs/api/cluster#class-worker)
- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 정상적으로 종료된 경우 종료 코드입니다.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 프로세스를 강제 종료시킨 신호의 이름입니다 (예: `'SIGHUP'`).

워커가 종료되면 클러스터 모듈은 `'exit'` 이벤트를 발생시킵니다.

이는 [`.fork()`](/ko/nodejs/api/cluster#clusterforkenv)를 다시 호출하여 워커를 다시 시작하는 데 사용할 수 있습니다.

```js [ESM]
cluster.on('exit', (worker, code, signal) => {
  console.log('워커 %d가 (%s) 종료되었습니다. 다시 시작합니다...',
              worker.process.pid, signal || code);
  cluster.fork();
});
```
[`child_process` 이벤트: `'exit'`](/ko/nodejs/api/child_process#event-exit)를 참조하세요.

## 이벤트: `'fork'` {#event-fork}

**추가된 버전: v0.7.0**

- `worker` [\<cluster.Worker\>](/ko/nodejs/api/cluster#class-worker)

새 워커가 포크되면 클러스터 모듈은 `'fork'` 이벤트를 발생시킵니다. 이는 워커 활동을 기록하고 사용자 지정 시간 초과를 만드는 데 사용할 수 있습니다.

```js [ESM]
const timeouts = [];
function errorMsg() {
  console.error('연결에 문제가 있는 것 같습니다...');
}

cluster.on('fork', (worker) => {
  timeouts[worker.id] = setTimeout(errorMsg, 2000);
});
cluster.on('listening', (worker, address) => {
  clearTimeout(timeouts[worker.id]);
});
cluster.on('exit', (worker, code, signal) => {
  clearTimeout(timeouts[worker.id]);
  errorMsg();
});
```

## Event: `'listening'` {#event-listening_1}

**Added in: v0.7.0**

- `worker` [\<cluster.Worker\>](/ko/nodejs/api/cluster#class-worker)
- `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

워커에서 `listen()`을 호출한 후, 서버에서 `'listening'` 이벤트가 발생하면, 프라이머리의 `cluster`에서도 `'listening'` 이벤트가 발생합니다.

이벤트 핸들러는 두 개의 인수로 실행됩니다. `worker`는 워커 객체를 포함하고, `address` 객체는 다음과 같은 연결 속성을 포함합니다: `address`, `port`, 그리고 `addressType`. 이는 워커가 둘 이상의 주소에서 리스닝하고 있을 때 매우 유용합니다.

```js [ESM]
cluster.on('listening', (worker, address) => {
  console.log(
    `워커가 ${address.address}:${address.port}에 연결되었습니다.`);
});
```
`addressType`은 다음 중 하나입니다:

- `4` (TCPv4)
- `6` (TCPv6)
- `-1` (Unix 도메인 소켓)
- `'udp4'` 또는 `'udp6'` (UDPv4 또는 UDPv6)

## Event: `'message'` {#event-message_1}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v6.0.0 | 이제 `worker` 매개변수가 전달됩니다. 자세한 내용은 아래를 참조하세요. |
| v2.5.0 | 추가됨: v2.5.0 |
:::

- `worker` [\<cluster.Worker\>](/ko/nodejs/api/cluster#class-worker)
- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `handle` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

클러스터 프라이머리가 워커로부터 메시지를 수신할 때 발생합니다.

[`child_process` 이벤트: `'message'`](/ko/nodejs/api/child_process#event-message)를 참조하세요.

## Event: `'online'` {#event-online_1}

**Added in: v0.7.0**

- `worker` [\<cluster.Worker\>](/ko/nodejs/api/cluster#class-worker)

새 워커를 포크한 후, 워커는 온라인 메시지로 응답해야 합니다. 프라이머리가 온라인 메시지를 수신하면 이 이벤트를 발생시킵니다. `'fork'`와 `'online'`의 차이점은 fork는 프라이머리가 워커를 포크할 때 발생하고, `'online'`은 워커가 실행 중일 때 발생한다는 것입니다.

```js [ESM]
cluster.on('online', (worker) => {
  console.log('야호, 워커가 포크된 후 응답했습니다.');
});
```

## Event: `'setup'` {#event-setup}

**추가된 버전: v0.7.1**

- `settings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[`.setupPrimary()`](/ko/nodejs/api/cluster#clustersetupprimarysettings)가 호출될 때마다 발생합니다.

`settings` 객체는 [`.setupPrimary()`](/ko/nodejs/api/cluster#clustersetupprimarysettings)가 호출될 당시의 `cluster.settings` 객체이며 단일 틱에서 [`.setupPrimary()`](/ko/nodejs/api/cluster#clustersetupprimarysettings)에 대한 여러 호출이 이루어질 수 있으므로 참고용일 뿐입니다.

정확성이 중요한 경우 `cluster.settings`를 사용하십시오.

## `cluster.disconnect([callback])` {#clusterdisconnectcallback}

**추가된 버전: v0.7.7**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 모든 워커의 연결이 끊어지고 핸들이 닫힐 때 호출됩니다.

`cluster.workers`의 각 워커에서 `.disconnect()`를 호출합니다.

연결이 끊어지면 모든 내부 핸들이 닫혀 다른 이벤트가 대기 중이 아닌 경우 기본 프로세스가 정상적으로 종료될 수 있습니다.

이 메서드는 완료되면 호출될 선택적 콜백 인수를 사용합니다.

기본 프로세스에서만 호출할 수 있습니다.

## `cluster.fork([env])` {#clusterforkenv}

**추가된 버전: v0.6.0**

- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 워커 프로세스 환경에 추가할 키/값 쌍입니다.
- 반환값: [\<cluster.Worker\>](/ko/nodejs/api/cluster#class-worker)

새 워커 프로세스를 생성합니다.

기본 프로세스에서만 호출할 수 있습니다.

## `cluster.isMaster` {#clusterismaster}

**추가된 버전: v0.8.1**

**지원 중단된 버전: v16.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ko/nodejs/api/documentation#stability-index) [Stability: 0](/ko/nodejs/api/documentation#stability-index) - 지원 중단됨
:::

[`cluster.isPrimary`](/ko/nodejs/api/cluster#clusterisprimary)의 지원 중단된 별칭입니다.

## `cluster.isPrimary` {#clusterisprimary}

**추가된 버전: v16.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

프로세스가 기본 프로세스인 경우 true입니다. 이는 `process.env.NODE_UNIQUE_ID`에 의해 결정됩니다. `process.env.NODE_UNIQUE_ID`가 정의되지 않은 경우 `isPrimary`는 `true`입니다.


## `cluster.isWorker` {#clusterisworker}

**Added in: v0.6.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

프로세스가 프라이머리가 아닌 경우 true입니다 (`cluster.isPrimary`의 부정입니다).

## `cluster.schedulingPolicy` {#clusterschedulingpolicy}

**Added in: v0.11.2**

스케줄링 정책은 라운드 로빈의 경우 `cluster.SCHED_RR`이거나 운영 체제에 맡기려면 `cluster.SCHED_NONE`입니다. 이는 전역 설정이며 첫 번째 워커가 생성되거나 [`.setupPrimary()`](/ko/nodejs/api/cluster#clustersetupprimarysettings)가 호출되면 (둘 중 먼저 발생하는 시점) 사실상 고정됩니다.

`SCHED_RR`은 Windows를 제외한 모든 운영 체제에서 기본값입니다. Windows는 libuv가 큰 성능 저하 없이 IOCP 핸들을 효과적으로 배포할 수 있게 되면 `SCHED_RR`로 변경됩니다.

`cluster.schedulingPolicy`는 `NODE_CLUSTER_SCHED_POLICY` 환경 변수를 통해 설정할 수도 있습니다. 유효한 값은 `'rr'` 및 `'none'`입니다.

## `cluster.settings` {#clustersettings}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.2.0, v12.16.0 | 이제 `serialization` 옵션이 지원됩니다. |
| v9.5.0 | 이제 `cwd` 옵션이 지원됩니다. |
| v9.4.0 | 이제 `windowsHide` 옵션이 지원됩니다. |
| v8.2.0 | 이제 `inspectPort` 옵션이 지원됩니다. |
| v6.4.0 | 이제 `stdio` 옵션이 지원됩니다. |
| v0.7.1 | Added in: v0.7.1 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Node.js 실행 파일에 전달되는 문자열 인수 목록입니다. **기본값:** `process.execArgv`.
    - `exec` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 워커 파일의 파일 경로입니다. **기본값:** `process.argv[1]`.
    - `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 워커에 전달되는 문자열 인수입니다. **기본값:** `process.argv.slice(2)`.
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 워커 프로세스의 현재 작업 디렉터리입니다. **기본값:** `undefined` (부모 프로세스에서 상속).
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 프로세스 간 메시지 전송에 사용되는 직렬화 종류를 지정합니다. 가능한 값은 `'json'` 및 `'advanced'`입니다. 자세한 내용은 [`child_process`에 대한 고급 직렬화](/ko/nodejs/api/child_process#advanced-serialization)를 참조하세요. **기본값:** `false`.
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 출력을 부모의 stdio로 보낼지 여부입니다. **기본값:** `false`.
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 포크된 프로세스의 stdio를 구성합니다. 클러스터 모듈은 IPC에 의존하여 작동하므로 이 구성에는 `'ipc'` 항목이 포함되어야 합니다. 이 옵션이 제공되면 `silent`를 재정의합니다. [`child_process.spawn()`](/ko/nodejs/api/child_process#child_processspawncommand-args-options)의 [`stdio`](/ko/nodejs/api/child_process#optionsstdio)를 참조하세요.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스의 사용자 ID를 설정합니다. ([`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2) 참조).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스의 그룹 ID를 설정합니다. ([`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2) 참조).
    - `inspectPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 워커의 검사기 포트를 설정합니다. 이는 숫자이거나 인수를 사용하지 않고 숫자를 반환하는 함수일 수 있습니다. 기본적으로 각 워커는 프라이머리의 `process.debugPort`에서 증가된 자체 포트를 가져옵니다.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 일반적으로 Windows 시스템에서 생성되는 포크된 프로세스 콘솔 창을 숨깁니다. **기본값:** `false`.
  
 

[`.setupPrimary()`](/ko/nodejs/api/cluster#clustersetupprimarysettings) (또는 [`.fork()`](/ko/nodejs/api/cluster#clusterforkenv))를 호출한 후 이 설정 객체에는 기본값을 포함한 설정이 포함됩니다.

이 객체는 수동으로 변경하거나 설정하기 위한 것이 아닙니다.


## `cluster.setupMaster([settings])` {#clustersetupmastersettings}

::: info [History]
| Version | Changes |
| --- | --- |
| v16.0.0 | Deprecated since: v16.0.0 |
| v6.4.0 | The `stdio` option is supported now. |
| v0.7.1 | Added in: v0.7.1 |
:::

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ko/nodejs/api/documentation#stability-index) [Stability: 0](/ko/nodejs/api/documentation#stability-index) - 사용 중단됨
:::

[`.setupPrimary()`](/ko/nodejs/api/cluster#clustersetupprimarysettings)의 사용 중단된 별칭입니다.

## `cluster.setupPrimary([settings])` {#clustersetupprimarysettings}

**Added in: v16.0.0**

- `settings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`cluster.settings`](/ko/nodejs/api/cluster#clustersettings)을(를) 참조하십시오.

`setupPrimary`는 기본 'fork' 동작을 변경하는 데 사용됩니다. 한 번 호출되면 설정이 `cluster.settings`에 나타납니다.

설정 변경 사항은 [`.fork()`](/ko/nodejs/api/cluster#clusterforkenv)에 대한 향후 호출에만 영향을 미치며 이미 실행 중인 작업자에는 영향을 주지 않습니다.

`.setupPrimary()`를 통해 설정할 수 없는 작업자의 유일한 속성은 [`.fork()`](/ko/nodejs/api/cluster#clusterforkenv)에 전달되는 `env`입니다.

위의 기본값은 첫 번째 호출에만 적용됩니다. 이후 호출에 대한 기본값은 `cluster.setupPrimary()`가 호출될 때의 현재 값입니다.

::: code-group
```js [ESM]
import cluster from 'node:cluster';

cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'https'],
  silent: true,
});
cluster.fork(); // https 작업자
cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'http'],
});
cluster.fork(); // http 작업자
```

```js [CJS]
const cluster = require('node:cluster');

cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'https'],
  silent: true,
});
cluster.fork(); // https 작업자
cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'http'],
});
cluster.fork(); // http 작업자
```
:::

이것은 기본 프로세스에서만 호출할 수 있습니다.

## `cluster.worker` {#clusterworker}

**Added in: v0.7.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

현재 작업자 객체에 대한 참조입니다. 기본 프로세스에서는 사용할 수 없습니다.

::: code-group
```js [ESM]
import cluster from 'node:cluster';

if (cluster.isPrimary) {
  console.log('나는 기본 프로세스입니다.');
  cluster.fork();
  cluster.fork();
} else if (cluster.isWorker) {
  console.log(`나는 작업자 #${cluster.worker.id}입니다.`);
}
```

```js [CJS]
const cluster = require('node:cluster');

if (cluster.isPrimary) {
  console.log('나는 기본 프로세스입니다.');
  cluster.fork();
  cluster.fork();
} else if (cluster.isWorker) {
  console.log(`나는 작업자 #${cluster.worker.id}입니다.`);
}
```
:::


## `cluster.workers` {#clusterworkers}

**Added in: v0.7.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

활성 워커 객체를 저장하는 해시이며, `id` 필드를 키로 사용합니다. 이를 통해 모든 워커를 쉽게 반복할 수 있습니다. 프라이머리 프로세스에서만 사용할 수 있습니다.

워커는 연결이 끊어지고 *종료된* 후에 `cluster.workers`에서 제거됩니다. 이 두 이벤트 간의 순서는 미리 결정할 수 없습니다. 그러나 `cluster.workers` 목록에서 제거되는 것은 마지막 `'disconnect'` 또는 `'exit'` 이벤트가 발생하기 전에 보장됩니다.

::: code-group
```js [ESM]
import cluster from 'node:cluster';

for (const worker of Object.values(cluster.workers)) {
  worker.send('big announcement to all workers');
}
```

```js [CJS]
const cluster = require('node:cluster');

for (const worker of Object.values(cluster.workers)) {
  worker.send('big announcement to all workers');
}
```
:::

