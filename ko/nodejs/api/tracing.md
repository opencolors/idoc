---
title: Node.js 추적 이벤트
description: Node.js 추적 이벤트 API를 사용하여 성능 프로파일링 및 디버깅하는 방법에 대한 문서.
head:
  - - meta
    - name: og:title
      content: Node.js 추적 이벤트 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 추적 이벤트 API를 사용하여 성능 프로파일링 및 디버깅하는 방법에 대한 문서.
  - - meta
    - name: twitter:title
      content: Node.js 추적 이벤트 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 추적 이벤트 API를 사용하여 성능 프로파일링 및 디버깅하는 방법에 대한 문서.
---


# 추적 이벤트 {#trace-events}

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

**소스 코드:** [lib/trace_events.js](https://github.com/nodejs/node/blob/v23.5.0/lib/trace_events.js)

`node:trace_events` 모듈은 V8, Node.js 코어, 그리고 사용자 공간 코드에서 생성된 추적 정보를 중앙 집중화하는 메커니즘을 제공합니다.

추적은 `--trace-event-categories` 명령줄 플래그를 사용하거나 `node:trace_events` 모듈을 사용하여 활성화할 수 있습니다. `--trace-event-categories` 플래그는 쉼표로 구분된 카테고리 이름 목록을 받습니다.

사용 가능한 카테고리는 다음과 같습니다:

- `node`: 빈 자리 표시자입니다.
- `node.async_hooks`: 자세한 [`async_hooks`](/ko/nodejs/api/async_hooks) 추적 데이터 캡처를 활성화합니다. [`async_hooks`](/ko/nodejs/api/async_hooks) 이벤트는 고유한 `asyncId`와 특별한 `triggerId` `triggerAsyncId` 속성을 갖습니다.
- `node.bootstrap`: Node.js 부트스트랩 마일스톤 캡처를 활성화합니다.
- `node.console`: `console.time()` 및 `console.count()` 출력 캡처를 활성화합니다.
- `node.threadpoolwork.sync`: `blob`, `zlib`, `crypto` 및 `node_api`와 같은 스레드 풀 동기 작업에 대한 추적 데이터 캡처를 활성화합니다.
- `node.threadpoolwork.async`: `blob`, `zlib`, `crypto` 및 `node_api`와 같은 스레드 풀 비동기 작업에 대한 추적 데이터 캡처를 활성화합니다.
- `node.dns.native`: DNS 쿼리에 대한 추적 데이터 캡처를 활성화합니다.
- `node.net.native`: 네트워크에 대한 추적 데이터 캡처를 활성화합니다.
- `node.environment`: Node.js 환경 마일스톤 캡처를 활성화합니다.
- `node.fs.sync`: 파일 시스템 동기 메서드에 대한 추적 데이터 캡처를 활성화합니다.
- `node.fs_dir.sync`: 파일 시스템 동기 디렉터리 메서드에 대한 추적 데이터 캡처를 활성화합니다.
- `node.fs.async`: 파일 시스템 비동기 메서드에 대한 추적 데이터 캡처를 활성화합니다.
- `node.fs_dir.async`: 파일 시스템 비동기 디렉터리 메서드에 대한 추적 데이터 캡처를 활성화합니다.
- `node.perf`: [Performance API](/ko/nodejs/api/perf_hooks) 측정 캡처를 활성화합니다.
    - `node.perf.usertiming`: Performance API User Timing 측정 및 마크만 캡처를 활성화합니다.
    - `node.perf.timerify`: Performance API timerify 측정만 캡처를 활성화합니다.

- `node.promises.rejections`: 처리되지 않은 Promise 거부 및 거부 후 처리에 대한 추적 데이터 추적 캡처를 활성화합니다.
- `node.vm.script`: `node:vm` 모듈의 `runInNewContext()`, `runInContext()`, 및 `runInThisContext()` 메서드에 대한 추적 데이터 캡처를 활성화합니다.
- `v8`: [V8](/ko/nodejs/api/v8) 이벤트는 GC, 컴파일, 그리고 실행과 관련됩니다.
- `node.http`: http 요청 / 응답에 대한 추적 데이터 캡처를 활성화합니다.
- `node.module_timer`: CJS 모듈 로딩에 대한 추적 데이터 캡처를 활성화합니다.

기본적으로 `node`, `node.async_hooks`, 그리고 `v8` 카테고리가 활성화됩니다.

```bash [BASH]
node --trace-event-categories v8,node,node.async_hooks server.js
```
이전 버전의 Node.js에서는 추적 이벤트를 활성화하기 위해 `--trace-events-enabled` 플래그를 사용해야 했습니다. 이 요구 사항은 제거되었습니다. 그러나 `--trace-events-enabled` 플래그는 여전히 사용될 *수 있으며*, 기본적으로 `node`, `node.async_hooks`, 그리고 `v8` 추적 이벤트 카테고리를 활성화합니다.

```bash [BASH]
node --trace-events-enabled

# 다음과 같습니다. {#is-equivalent-to}

node --trace-event-categories v8,node,node.async_hooks
```
또는 `node:trace_events` 모듈을 사용하여 추적 이벤트를 활성화할 수 있습니다:

```js [ESM]
const trace_events = require('node:trace_events');
const tracing = trace_events.createTracing({ categories: ['node.perf'] });
tracing.enable();  // 'node.perf' 카테고리에 대한 추적 이벤트 캡처 활성화

// 작업 수행

tracing.disable();  // 'node.perf' 카테고리에 대한 추적 이벤트 캡처 비활성화
```
추적을 활성화한 상태로 Node.js를 실행하면 Chrome의 [`chrome://tracing`](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) 탭에서 열 수 있는 로그 파일이 생성됩니다.

로깅 파일은 기본적으로 `node_trace.${rotation}.log`라고 하며, `${rotation}`은 증가하는 로그 회전 ID입니다. 파일 경로 패턴은 `${rotation}` 및 `${pid}`를 지원하는 템플릿 문자열을 허용하는 `--trace-event-file-pattern`으로 지정할 수 있습니다:

```bash [BASH]
node --trace-event-categories v8 --trace-event-file-pattern '${pid}-${rotation}.log' server.js
```
`SIGINT`, `SIGTERM` 또는 `SIGBREAK`와 같은 신호 이벤트 이후에 로그 파일이 올바르게 생성되도록 하려면 코드에 다음과 같은 적절한 처리기가 있는지 확인하십시오:

```js [ESM]
process.on('SIGINT', function onSigint() {
  console.info('Received SIGINT.');
  process.exit(130);  // 또는 OS 및 신호에 따라 해당 종료 코드
});
```
추적 시스템은 `process.hrtime()`에서 사용되는 것과 동일한 시간 소스를 사용합니다. 그러나 추적 이벤트 타임스탬프는 마이크로초 단위로 표현되는 반면 `process.hrtime()`은 나노초를 반환합니다.

이 모듈의 기능은 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 스레드에서는 사용할 수 없습니다.


## `node:trace_events` 모듈 {#the-nodetrace_events-module}

**추가된 버전: v10.0.0**

### `Tracing` 객체 {#tracing-object}

**추가된 버전: v10.0.0**

`Tracing` 객체는 특정 카테고리 집합에 대한 추적을 활성화하거나 비활성화하는 데 사용됩니다. 인스턴스는 `trace_events.createTracing()` 메서드를 사용하여 생성됩니다.

생성될 때 `Tracing` 객체는 비활성화됩니다. `tracing.enable()` 메서드를 호출하면 카테고리가 활성화된 추적 이벤트 카테고리 집합에 추가됩니다. `tracing.disable()`을 호출하면 활성화된 추적 이벤트 카테고리 집합에서 카테고리가 제거됩니다.

#### `tracing.categories` {#tracingcategories}

**추가된 버전: v10.0.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이 `Tracing` 객체가 다루는 추적 이벤트 카테고리의 쉼표로 구분된 목록입니다.

#### `tracing.disable()` {#tracingdisable}

**추가된 버전: v10.0.0**

이 `Tracing` 객체를 비활성화합니다.

다른 활성화된 `Tracing` 객체에서 다루지 *않고* `--trace-event-categories` 플래그로 지정되지 *않은* 추적 이벤트 카테고리만 비활성화됩니다.

```js [ESM]
const trace_events = require('node:trace_events');
const t1 = trace_events.createTracing({ categories: ['node', 'v8'] });
const t2 = trace_events.createTracing({ categories: ['node.perf', 'node'] });
t1.enable();
t2.enable();

// 'node,node.perf,v8'을(를) 출력합니다.
console.log(trace_events.getEnabledCategories());

t2.disable(); // 'node.perf' 카테고리 방출만 비활성화합니다.

// 'node,v8'을(를) 출력합니다.
console.log(trace_events.getEnabledCategories());
```
#### `tracing.enable()` {#tracingenable}

**추가된 버전: v10.0.0**

`Tracing` 객체가 다루는 카테고리 집합에 대해 이 `Tracing` 객체를 활성화합니다.

#### `tracing.enabled` {#tracingenabled}

**추가된 버전: v10.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `Tracing` 객체가 활성화된 경우에만 `true`입니다.

### `trace_events.createTracing(options)` {#trace_eventscreatetracingoptions}

**추가된 버전: v10.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `categories` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 추적 카테고리 이름의 배열입니다. 배열에 포함된 값은 가능한 경우 문자열로 강제 변환됩니다. 값을 강제 변환할 수 없으면 오류가 발생합니다.
  
 
- 반환: [\<Tracing\>](/ko/nodejs/api/tracing#tracing-object).

주어진 `categories` 집합에 대한 `Tracing` 객체를 생성하고 반환합니다.

```js [ESM]
const trace_events = require('node:trace_events');
const categories = ['node.perf', 'node.async_hooks'];
const tracing = trace_events.createTracing({ categories });
tracing.enable();
// do stuff
tracing.disable();
```

### `trace_events.getEnabledCategories()` {#trace_eventsgetenabledcategories}

**Added in: v10.0.0**

- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

현재 활성화된 모든 추적 이벤트 범주의 쉼표로 구분된 목록을 반환합니다. 현재 활성화된 추적 이벤트 범주 집합은 현재 활성화된 모든 `Tracing` 객체의 *합집합*과 `--trace-event-categories` 플래그를 사용하여 활성화된 모든 범주에 의해 결정됩니다.

아래의 `test.js` 파일이 주어졌을 때, `node --trace-event-categories node.perf test.js` 명령은 콘솔에 `'node.async_hooks,node.perf'`를 출력합니다.

```js [ESM]
const trace_events = require('node:trace_events');
const t1 = trace_events.createTracing({ categories: ['node.async_hooks'] });
const t2 = trace_events.createTracing({ categories: ['node.perf'] });
const t3 = trace_events.createTracing({ categories: ['v8'] });

t1.enable();
t2.enable();

console.log(trace_events.getEnabledCategories());
```
## 예시 {#examples}

### Inspector를 통해 추적 이벤트 데이터 수집 {#collect-trace-events-data-by-inspector}

```js [ESM]
'use strict';

const { Session } = require('node:inspector');
const session = new Session();
session.connect();

function post(message, data) {
  return new Promise((resolve, reject) => {
    session.post(message, data, (err, result) => {
      if (err)
        reject(new Error(JSON.stringify(err)));
      else
        resolve(result);
    });
  });
}

async function collect() {
  const data = [];
  session.on('NodeTracing.dataCollected', (chunk) => data.push(chunk));
  session.on('NodeTracing.tracingComplete', () => {
    // done
  });
  const traceConfig = { includedCategories: ['v8'] };
  await post('NodeTracing.start', { traceConfig });
  // do something
  setTimeout(() => {
    post('NodeTracing.stop').then(() => {
      session.disconnect();
      console.log(data);
    });
  }, 1000);
}

collect();
```
