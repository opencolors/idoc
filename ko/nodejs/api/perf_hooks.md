---
title: Node.js 문서 - 성능 훅
description: Node.js의 성능 훅 API를 탐색하여 Node.js 애플리케이션의 성능을 측정하기 위한 메트릭과 도구에 접근할 수 있습니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - 성능 훅 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 성능 훅 API를 탐색하여 Node.js 애플리케이션의 성능을 측정하기 위한 메트릭과 도구에 접근할 수 있습니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - 성능 훅 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 성능 훅 API를 탐색하여 Node.js 애플리케이션의 성능을 측정하기 위한 메트릭과 도구에 접근할 수 있습니다.
---


# 성능 측정 API {#performance-measurement-apis}

::: tip [안정됨: 2 - 안정됨]
[안정됨: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정됨
:::

**소스 코드:** [lib/perf_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/perf_hooks.js)

이 모듈은 W3C [웹 성능 API](https://w3c.github.io/perf-timing-primer/)의 하위 집합과 Node.js 특정 성능 측정을 위한 추가 API를 구현합니다.

Node.js는 다음 [웹 성능 API](https://w3c.github.io/perf-timing-primer/)를 지원합니다.

- [고해상도 시간](https://www.w3.org/TR/hr-time-2)
- [성능 타임라인](https://w3c.github.io/performance-timeline/)
- [사용자 타이밍](https://www.w3.org/TR/user-timing/)
- [리소스 타이밍](https://www.w3.org/TR/resource-timing-2/)



::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration);
  performance.clearMarks();
});
obs.observe({ type: 'measure' });
performance.measure('Start to Now');

performance.mark('A');
doSomeLongRunningProcess(() => {
  performance.measure('A to Now', 'A');

  performance.mark('B');
  performance.measure('A to B', 'A', 'B');
});
```

```js [CJS]
const { PerformanceObserver, performance } = require('node:perf_hooks');

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration);
});
obs.observe({ type: 'measure' });
performance.measure('Start to Now');

performance.mark('A');
(async function doSomeLongRunningProcess() {
  await new Promise((r) => setTimeout(r, 5000));
  performance.measure('A to Now', 'A');

  performance.mark('B');
  performance.measure('A to B', 'A', 'B');
})();
```
:::

## `perf_hooks.performance` {#perf_hooksperformance}

**추가됨: v8.5.0**

현재 Node.js 인스턴스에서 성능 메트릭을 수집하는 데 사용할 수 있는 객체입니다. 브라우저의 [`window.performance`](https://developer.mozilla.org/en-US/docs/Web/API/Window/performance)와 유사합니다.


### `performance.clearMarks([name])` {#performanceclearmarksname}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 이 메서드는 `performance` 객체를 수신자로 하여 호출해야 합니다. |
| v8.5.0 | 추가됨: v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`name`이 제공되지 않으면 Performance Timeline에서 모든 `PerformanceMark` 객체를 제거합니다. `name`이 제공되면 명명된 마크만 제거합니다.

### `performance.clearMeasures([name])` {#performanceclearmeasuresname}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 이 메서드는 `performance` 객체를 수신자로 하여 호출해야 합니다. |
| v16.7.0 | 추가됨: v16.7.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`name`이 제공되지 않으면 Performance Timeline에서 모든 `PerformanceMeasure` 객체를 제거합니다. `name`이 제공되면 명명된 측정값만 제거합니다.

### `performance.clearResourceTimings([name])` {#performanceclearresourcetimingsname}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 이 메서드는 `performance` 객체를 수신자로 하여 호출해야 합니다. |
| v18.2.0, v16.17.0 | 추가됨: v18.2.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`name`이 제공되지 않으면 Resource Timeline에서 모든 `PerformanceResourceTiming` 객체를 제거합니다. `name`이 제공되면 명명된 리소스만 제거합니다.

### `performance.eventLoopUtilization([utilization1[, utilization2]])` {#performanceeventlooputilizationutilization1-utilization2}

**추가됨: v14.10.0, v12.19.0**

- `utilization1` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `eventLoopUtilization()`에 대한 이전 호출의 결과입니다.
- `utilization2` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `utilization1` 이전의 `eventLoopUtilization()`에 대한 이전 호출의 결과입니다.
- 반환값: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `active` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`eventLoopUtilization()` 메서드는 이벤트 루프가 고해상도 밀리초 타이머로 유휴 및 활성 상태였던 누적 시간을 포함하는 객체를 반환합니다. `utilization` 값은 계산된 이벤트 루프 사용률(ELU)입니다.

메인 스레드에서 부트스트래핑이 아직 완료되지 않은 경우 속성 값은 `0`입니다. [Worker 스레드](/ko/nodejs/api/worker_threads#worker-threads)에서는 부트스트랩이 이벤트 루프 내에서 발생하므로 ELU를 즉시 사용할 수 있습니다.

`utilization1` 및 `utilization2`는 모두 선택적 매개변수입니다.

`utilization1`이 전달되면 현재 호출의 `active` 및 `idle` 시간 간의 델타와 해당 `utilization` 값이 계산되어 반환됩니다([`process.hrtime()`](/ko/nodejs/api/process#processhrtimetime)과 유사).

`utilization1`과 `utilization2`가 모두 전달되면 두 인수 간의 델타가 계산됩니다. 이는 [`process.hrtime()`](/ko/nodejs/api/process#processhrtimetime)과 달리 ELU 계산이 단일 빼기보다 더 복잡하기 때문에 편리한 옵션입니다.

ELU는 CPU 사용률과 유사하지만 CPU 사용량이 아닌 이벤트 루프 통계만 측정합니다. 이는 이벤트 루프가 이벤트 루프의 이벤트 제공자(예: `epoll_wait`) 외부에서 보낸 시간의 백분율을 나타냅니다. 다른 CPU 유휴 시간은 고려되지 않습니다. 다음은 대부분 유휴 상태인 프로세스가 높은 ELU를 갖는 방법의 예입니다.

::: code-group
```js [ESM]
import { eventLoopUtilization } from 'node:perf_hooks';
import { spawnSync } from 'node:child_process';

setImmediate(() => {
  const elu = eventLoopUtilization();
  spawnSync('sleep', ['5']);
  console.log(eventLoopUtilization(elu).utilization);
});
```

```js [CJS]
'use strict';
const { eventLoopUtilization } = require('node:perf_hooks').performance;
const { spawnSync } = require('node:child_process');

setImmediate(() => {
  const elu = eventLoopUtilization();
  spawnSync('sleep', ['5']);
  console.log(eventLoopUtilization(elu).utilization);
});
```
:::

이 스크립트를 실행하는 동안 CPU가 대부분 유휴 상태이지만 `utilization` 값은 `1`입니다. 이는 [`child_process.spawnSync()`](/ko/nodejs/api/child_process#child_processspawnsynccommand-args-options)에 대한 호출이 이벤트 루프가 진행되지 않도록 차단하기 때문입니다.

`eventLoopUtilization()`에 대한 이전 호출의 결과 대신 사용자 정의 객체를 전달하면 정의되지 않은 동작이 발생합니다. 반환 값은 이벤트 루프의 올바른 상태를 반영하도록 보장되지 않습니다.


### `performance.getEntries()` {#performancegetentries}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 이 메서드는 `performance` 객체를 수신자로 호출해야 합니다. |
| v16.7.0 | 추가됨: v16.7.0 |
:::

- 반환: [\<PerformanceEntry[]\>](/ko/nodejs/api/perf_hooks#class-performanceentry)

`performanceEntry.startTime`을 기준으로 시간순으로 정렬된 `PerformanceEntry` 객체 목록을 반환합니다. 특정 유형의 성능 항목 또는 특정 이름을 가진 성능 항목에만 관심이 있는 경우 `performance.getEntriesByType()` 및 `performance.getEntriesByName()`을 참조하십시오.

### `performance.getEntriesByName(name[, type])` {#performancegetentriesbynamename-type}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 이 메서드는 `performance` 객체를 수신자로 호출해야 합니다. |
| v16.7.0 | 추가됨: v16.7.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<PerformanceEntry[]\>](/ko/nodejs/api/perf_hooks#class-performanceentry)

`performanceEntry.name`이 `name`과 같고 선택적으로 `performanceEntry.entryType`이 `type`과 같은 `PerformanceEntry` 객체 목록을 `performanceEntry.startTime`을 기준으로 시간순으로 정렬하여 반환합니다.

### `performance.getEntriesByType(type)` {#performancegetentriesbytypetype}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 이 메서드는 `performance` 객체를 수신자로 호출해야 합니다. |
| v16.7.0 | 추가됨: v16.7.0 |
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<PerformanceEntry[]\>](/ko/nodejs/api/perf_hooks#class-performanceentry)

`performanceEntry.entryType`이 `type`과 같은 `PerformanceEntry` 객체 목록을 `performanceEntry.startTime`을 기준으로 시간순으로 정렬하여 반환합니다.

### `performance.mark(name[, options])` {#performancemarkname-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 이 메서드는 `performance` 객체를 수신자로 호출해야 합니다. name 인수는 더 이상 선택 사항이 아닙니다. |
| v16.0.0 | User Timing Level 3 사양을 준수하도록 업데이트되었습니다. |
| v8.5.0 | 추가됨: v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `detail` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 마크에 포함할 추가 선택적 세부 정보입니다.
    - `startTime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 마크 시간으로 사용할 선택적 타임스탬프입니다. **기본값**: `performance.now()`.

Performance Timeline에 새로운 `PerformanceMark` 항목을 만듭니다. `PerformanceMark`는 `performanceEntry.entryType`이 항상 `'mark'`이고 `performanceEntry.duration`이 항상 `0`인 `PerformanceEntry`의 서브클래스입니다. 성능 마크는 Performance Timeline에서 특정 중요한 순간을 표시하는 데 사용됩니다.

생성된 `PerformanceMark` 항목은 글로벌 Performance Timeline에 배치되며 `performance.getEntries`, `performance.getEntriesByName` 및 `performance.getEntriesByType`로 쿼리할 수 있습니다. 관찰이 수행되면 `performance.clearMarks`를 사용하여 글로벌 Performance Timeline에서 항목을 수동으로 지워야 합니다.


### `performance.markResourceTiming(timingInfo, requestedUrl, initiatorType, global, cacheMode, bodyInfo, responseStatus[, deliveryType])` {#performancemarkresourcetimingtiminginfo-requestedurl-initiatortype-global-cachemode-bodyinfo-responsestatus-deliverytype}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.2.0 | bodyInfo, responseStatus, 및 deliveryType 인수가 추가되었습니다. |
| v18.2.0, v16.17.0 | 다음 버전에서 추가됨: v18.2.0, v16.17.0 |
:::

- `timingInfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [Fetch Timing Info](https://fetch.spec.whatwg.org/#fetch-timing-info)
- `requestedUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 리소스 URL
- `initiatorType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 초기자 이름, 예: 'fetch'
- `global` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `cacheMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 캐시 모드는 빈 문자열('')이거나 'local'이어야 합니다.
- `bodyInfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [Fetch Response Body Info](https://fetch.spec.whatwg.org/#response-body-info)
- `responseStatus` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 응답의 상태 코드
- `deliveryType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 전송 유형. **기본값:** `''`.

*이 속성은 Node.js에서 확장한 것입니다. 웹 브라우저에서는 사용할 수 없습니다.*

리소스 타임라인에 새로운 `PerformanceResourceTiming` 항목을 만듭니다. `PerformanceResourceTiming`은 `performanceEntry.entryType`이 항상 `'resource'`인 `PerformanceEntry`의 하위 클래스입니다. 성능 리소스는 리소스 타임라인에서 순간을 표시하는 데 사용됩니다.

생성된 `PerformanceMark` 항목은 전역 리소스 타임라인에 배치되며 `performance.getEntries`, `performance.getEntriesByName` 및 `performance.getEntriesByType`를 사용하여 쿼리할 수 있습니다. 관찰이 수행되면 `performance.clearResourceTimings`를 사용하여 전역 성능 타임라인에서 항목을 수동으로 지워야 합니다.


### `performance.measure(name[, startMarkOrOptions[, endMark]])` {#performancemeasurename-startmarkoroptions-endmark}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 이 메서드는 `performance` 객체를 수신자로 호출해야 합니다. |
| v16.0.0 | User Timing Level 3 사양을 준수하도록 업데이트되었습니다. |
| v13.13.0, v12.16.3 | `startMark` 및 `endMark` 매개변수를 선택 사항으로 만듭니다. |
| v8.5.0 | 다음 버전에서 추가됨: v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `startMarkOrOptions` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 선택 사항.
    - `detail` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 측정에 포함할 추가 선택적 세부 정보입니다.
    - `duration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 시작 시간과 종료 시간 사이의 기간입니다.
    - `end` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 종료 시간으로 사용할 타임스탬프 또는 이전에 기록된 마크를 식별하는 문자열입니다.
    - `start` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 시작 시간으로 사용할 타임스탬프 또는 이전에 기록된 마크를 식별하는 문자열입니다.


- `endMark` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 선택 사항. `startMarkOrOptions`가 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)인 경우 생략해야 합니다.

Performance Timeline에 새 `PerformanceMeasure` 항목을 만듭니다. `PerformanceMeasure`는 `performanceEntry.entryType`이 항상 `'measure'`이고 `performanceEntry.duration`이 `startMark`와 `endMark` 이후 경과된 밀리초 수를 측정하는 `PerformanceEntry`의 하위 클래스입니다.

`startMark` 인수는 Performance Timeline에 있는 *기존* `PerformanceMark`를 식별하거나 `PerformanceNodeTiming` 클래스에서 제공하는 타임스탬프 속성을 식별할 *수 있습니다*. 지정된 `startMark`가 존재하지 않으면 오류가 발생합니다.

선택적 `endMark` 인수는 Performance Timeline에 있는 *기존* `PerformanceMark` 또는 `PerformanceNodeTiming` 클래스에서 제공하는 타임스탬프 속성을 식별해야 합니다. 매개변수가 전달되지 않으면 `endMark`는 `performance.now()`가 되고, 그렇지 않으면 지정된 `endMark`가 존재하지 않으면 오류가 발생합니다.

생성된 `PerformanceMeasure` 항목은 전역 Performance Timeline에 배치되며 `performance.getEntries`, `performance.getEntriesByName` 및 `performance.getEntriesByType`로 쿼리할 수 있습니다. 관찰이 수행되면 `performance.clearMeasures`를 사용하여 전역 Performance Timeline에서 항목을 수동으로 지워야 합니다.


### `performance.nodeTiming` {#performancenodetiming}

**Added in: v8.5.0**

- [\<PerformanceNodeTiming\>](/ko/nodejs/api/perf_hooks#class-performancenodetiming)

*이 속성은 Node.js에 의해 확장되었습니다. 웹 브라우저에서는 사용할 수 없습니다.*

특정 Node.js 운영 단계에 대한 성능 메트릭을 제공하는 `PerformanceNodeTiming` 클래스의 인스턴스입니다.

### `performance.now()` {#performancenow}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.0.0 | 이 메서드는 `performance` 객체를 수신자로 사용하여 호출해야 합니다. |
| v8.5.0 | Added in: v8.5.0 |
:::

- 반환: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

현재 고해상도 밀리초 타임스탬프를 반환합니다. 여기서 0은 현재 `node` 프로세스의 시작을 나타냅니다.

### `performance.setResourceTimingBufferSize(maxSize)` {#performancesetresourcetimingbuffersizemaxsize}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.0.0 | 이 메서드는 `performance` 객체를 수신자로 사용하여 호출해야 합니다. |
| v18.8.0 | Added in: v18.8.0 |
:::

전역 성능 리소스 타이밍 버퍼 크기를 지정된 "리소스" 유형 성능 항목 객체 수로 설정합니다.

기본적으로 최대 버퍼 크기는 250으로 설정됩니다.

### `performance.timeOrigin` {#performancetimeorigin}

**Added in: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

[`timeOrigin`](https://w3c.github.io/hr-time/#dom-performance-timeorigin)은 현재 `node` 프로세스가 시작된 고해상도 밀리초 타임스탬프를 Unix 시간으로 측정한 값을 지정합니다.

### `performance.timerify(fn[, options])` {#performancetimerifyfn-options}


::: info [History]
| Version | Changes |
| --- | --- |
| v16.0.0 | 히스토그램 옵션을 추가했습니다. |
| v16.0.0 | 순수 JavaScript를 사용하여 비동기 함수를 시간 측정할 수 있도록 다시 구현했습니다. |
| v8.5.0 | Added in: v8.5.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `histogram` [\<RecordableHistogram\>](/ko/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram) 나노초 단위로 런타임 기간을 기록할 `perf_hooks.createHistogram()`을 사용하여 생성된 히스토그램 객체입니다.
  
 

*이 속성은 Node.js에 의해 확장되었습니다. 웹 브라우저에서는 사용할 수 없습니다.*

래핑된 함수의 실행 시간을 측정하는 새로운 함수 내에 함수를 래핑합니다. 타이밍 세부 정보에 액세스하려면 `PerformanceObserver`가 `'function'` 이벤트 유형을 구독해야 합니다.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

function someFunction() {
  console.log('hello world');
}

const wrapped = performance.timerify(someFunction);

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration);

  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

// A performance timeline entry will be created
wrapped();
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

function someFunction() {
  console.log('hello world');
}

const wrapped = performance.timerify(someFunction);

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration);

  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

// A performance timeline entry will be created
wrapped();
```
:::

래핑된 함수가 프로미스를 반환하는 경우, finally 핸들러가 프로미스에 첨부되고 finally 핸들러가 호출되면 기간이 보고됩니다.


### `performance.toJSON()` {#performancetojson}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v19.0.0 | 이 메서드는 `performance` 객체를 수신자로 사용하여 호출해야 합니다. |
| v16.1.0 | 추가됨: v16.1.0 |
:::

`performance` 객체의 JSON 표현인 객체입니다. 브라우저의 [`window.performance.toJSON`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/toJSON)과 유사합니다.

#### 이벤트: `'resourcetimingbufferfull'` {#event-resourcetimingbufferfull}

**추가됨: v18.8.0**

글로벌 성능 리소스 타이밍 버퍼가 가득 차면 `'resourcetimingbufferfull'` 이벤트가 발생합니다. 성능 타임라인 버퍼에 더 많은 항목을 추가할 수 있도록 이벤트 리스너에서 `performance.setResourceTimingBufferSize()`로 리소스 타이밍 버퍼 크기를 조정하거나 `performance.clearResourceTimings()`로 버퍼를 지웁니다.

## 클래스: `PerformanceEntry` {#class-performanceentry}

**추가됨: v8.5.0**

이 클래스의 생성자는 사용자에게 직접 노출되지 않습니다.

### `performanceEntry.duration` {#performanceentryduration}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v19.0.0 | 이 속성 getter는 `PerformanceEntry` 객체를 수신자로 사용하여 호출해야 합니다. |
| v8.5.0 | 추가됨: v8.5.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

이 항목에 경과된 총 밀리초 수입니다. 이 값은 모든 성능 항목 유형에 대해 의미가 없을 수 있습니다.

### `performanceEntry.entryType` {#performanceentryentrytype}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v19.0.0 | 이 속성 getter는 `PerformanceEntry` 객체를 수신자로 사용하여 호출해야 합니다. |
| v8.5.0 | 추가됨: v8.5.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

성능 항목의 유형입니다. 다음 중 하나일 수 있습니다.

- `'dns'` (Node.js 전용)
- `'function'` (Node.js 전용)
- `'gc'` (Node.js 전용)
- `'http2'` (Node.js 전용)
- `'http'` (Node.js 전용)
- `'mark'` (웹에서 사용 가능)
- `'measure'` (웹에서 사용 가능)
- `'net'` (Node.js 전용)
- `'node'` (Node.js 전용)
- `'resource'` (웹에서 사용 가능)


### `performanceEntry.name` {#performanceentryname}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 이 속성 getter는 `PerformanceEntry` 객체를 수신자로 하여 호출해야 합니다. |
| v8.5.0 | 추가됨: v8.5.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

성능 항목의 이름입니다.

### `performanceEntry.startTime` {#performanceentrystarttime}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 이 속성 getter는 `PerformanceEntry` 객체를 수신자로 하여 호출해야 합니다. |
| v8.5.0 | 추가됨: v8.5.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

성능 항목의 시작 시간을 표시하는 고해상도 밀리초 타임스탬프입니다.

## 클래스: `PerformanceMark` {#class-performancemark}

**추가됨: v18.2.0, v16.17.0**

- 확장: [\<PerformanceEntry\>](/ko/nodejs/api/perf_hooks#class-performanceentry)

`Performance.mark()` 메서드를 통해 생성된 마크를 노출합니다.

### `performanceMark.detail` {#performancemarkdetail}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 이 속성 getter는 `PerformanceMark` 객체를 수신자로 하여 호출해야 합니다. |
| v16.0.0 | 추가됨: v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`Performance.mark()` 메서드로 생성 시 지정된 추가 정보입니다.

## 클래스: `PerformanceMeasure` {#class-performancemeasure}

**추가됨: v18.2.0, v16.17.0**

- 확장: [\<PerformanceEntry\>](/ko/nodejs/api/perf_hooks#class-performanceentry)

`Performance.measure()` 메서드를 통해 생성된 측정을 노출합니다.

이 클래스의 생성자는 사용자에게 직접 노출되지 않습니다.

### `performanceMeasure.detail` {#performancemeasuredetail}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 이 속성 getter는 `PerformanceMeasure` 객체를 수신자로 하여 호출해야 합니다. |
| v16.0.0 | 추가됨: v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`Performance.measure()` 메서드로 생성 시 지정된 추가 정보입니다.


## 클래스: `PerformanceNodeEntry` {#class-performancenodeentry}

**추가된 버전: v19.0.0**

- 확장: [\<PerformanceEntry\>](/ko/nodejs/api/perf_hooks#class-performanceentry)

*이 클래스는 Node.js에 의해 확장되었습니다. 웹 브라우저에서는 사용할 수 없습니다.*

자세한 Node.js 타이밍 데이터를 제공합니다.

이 클래스의 생성자는 사용자에게 직접 노출되지 않습니다.

### `performanceNodeEntry.detail` {#performancenodeentrydetail}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 이 속성 getter는 `PerformanceNodeEntry` 객체를 리시버로 사용하여 호출해야 합니다. |
| v16.0.0 | 추가된 버전: v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`entryType`에 특정한 추가 세부 정보.

### `performanceNodeEntry.flags` {#performancenodeentryflags}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.0.0 | 런타임에서 더 이상 사용되지 않습니다. 이제 entryType이 'gc'인 경우 detail 속성으로 이동되었습니다. |
| v13.9.0, v12.17.0 | 추가된 버전: v13.9.0, v12.17.0 |
:::

::: danger [안정성: 0 - 더 이상 사용되지 않음]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 더 이상 사용되지 않음: 대신 `performanceNodeEntry.detail`을 사용하세요.
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`performanceEntry.entryType`이 `'gc'`와 같을 때, `performance.flags` 속성은 가비지 컬렉션 작업에 대한 추가 정보를 포함합니다. 값은 다음 중 하나일 수 있습니다.

- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE`

### `performanceNodeEntry.kind` {#performancenodeentrykind}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.0.0 | 런타임에서 더 이상 사용되지 않습니다. 이제 entryType이 'gc'인 경우 detail 속성으로 이동되었습니다. |
| v8.5.0 | 추가된 버전: v8.5.0 |
:::

::: danger [안정성: 0 - 더 이상 사용되지 않음]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 더 이상 사용되지 않음: 대신 `performanceNodeEntry.detail`을 사용하세요.
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`performanceEntry.entryType`이 `'gc'`와 같을 때, `performance.kind` 속성은 발생한 가비지 컬렉션 작업의 유형을 식별합니다. 값은 다음 중 하나일 수 있습니다.

- `perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB`


### 가비지 컬렉션('gc') 세부 정보 {#garbage-collection-gc-details}

`performanceEntry.type`이 `'gc'`와 같으면 `performanceNodeEntry.detail` 속성은 두 개의 속성을 가진 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)가 됩니다.

- `kind` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 다음 중 하나:
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB`
  
 
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 다음 중 하나:
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE`
  
 

### HTTP ('http') 세부 정보 {#http-http-details}

`performanceEntry.type`이 `'http'`와 같으면 `performanceNodeEntry.detail` 속성은 추가 정보가 포함된 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)가 됩니다.

`performanceEntry.name`이 `HttpClient`와 같으면 `detail`은 `req`, `res` 속성을 포함합니다. 그리고 `req` 속성은 `method`, `url`, `headers`를 포함하는 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)이고, `res` 속성은 `statusCode`, `statusMessage`, `headers`를 포함하는 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)입니다.

`performanceEntry.name`이 `HttpRequest`와 같으면 `detail`은 `req`, `res` 속성을 포함합니다. 그리고 `req` 속성은 `method`, `url`, `headers`를 포함하는 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)이고, `res` 속성은 `statusCode`, `statusMessage`, `headers`를 포함하는 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)입니다.

이는 추가 메모리 오버헤드를 초래할 수 있으며 기본적으로 프로덕션 환경에서 켜둔 채로 두지 말고 진단 목적으로만 사용해야 합니다.


### HTTP/2 ('http2') 세부 정보 {#http/2-http2-details}

`performanceEntry.type`이 `'http2'`와 같으면, `performanceNodeEntry.detail` 속성은 추가적인 성능 정보를 담고 있는 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)가 됩니다.

`performanceEntry.name`이 `Http2Stream`과 같으면, `detail`은 다음 속성을 포함합니다:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 `Http2Stream`에 대해 수신된 `DATA` 프레임 바이트 수.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 `Http2Stream`에 대해 전송된 `DATA` 프레임 바이트 수.
- `id` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 연결된 `Http2Stream`의 식별자
- `timeToFirstByte` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `PerformanceEntry` `startTime`과 첫 번째 `DATA` 프레임 수신 사이의 경과 시간(밀리초).
- `timeToFirstByteSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `PerformanceEntry` `startTime`과 첫 번째 `DATA` 프레임 전송 사이의 경과 시간(밀리초).
- `timeToFirstHeader` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `PerformanceEntry` `startTime`과 첫 번째 헤더 수신 사이의 경과 시간(밀리초).

`performanceEntry.name`이 `Http2Session`과 같으면, `detail`은 다음 속성을 포함합니다:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 `Http2Session`에 대해 수신된 바이트 수.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 `Http2Session`에 대해 전송된 바이트 수.
- `framesReceived` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session`에 의해 수신된 HTTP/2 프레임 수.
- `framesSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session`에 의해 전송된 HTTP/2 프레임 수.
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session`의 수명 동안 동시에 열려 있는 최대 스트림 수.
- `pingRTT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `PING` 프레임 전송 이후 해당 승인 수신까지의 경과 시간(밀리초). `Http2Session`에서 `PING` 프레임이 전송된 경우에만 존재합니다.
- `streamAverageDuration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 모든 `Http2Stream` 인스턴스의 평균 지속 시간 (밀리초).
- `streamCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session`에 의해 처리된 `Http2Stream` 인스턴스 수.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `Http2Session`의 유형을 식별하기 위해 `'server'` 또는 `'client'` 중 하나.


### Timerify ('function') 세부 정보 {#timerify-function-details}

`performanceEntry.type`이 `'function'`과 같으면 `performanceNodeEntry.detail` 속성은 시간이 지정된 함수에 대한 입력 인수를 나열하는 [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)가 됩니다.

### Net ('net') 세부 정보 {#net-net-details}

`performanceEntry.type`이 `'net'`과 같으면 `performanceNodeEntry.detail` 속성은 추가 정보를 포함하는 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)가 됩니다.

`performanceEntry.name`이 `connect`와 같으면 `detail`에는 `host`, `port` 속성이 포함됩니다.

### DNS ('dns') 세부 정보 {#dns-dns-details}

`performanceEntry.type`이 `'dns'`와 같으면 `performanceNodeEntry.detail` 속성은 추가 정보를 포함하는 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)가 됩니다.

`performanceEntry.name`이 `lookup`과 같으면 `detail`에는 `hostname`, `family`, `hints`, `verbatim`, `addresses` 속성이 포함됩니다.

`performanceEntry.name`이 `lookupService`와 같으면 `detail`에는 `host`, `port`, `hostname`, `service` 속성이 포함됩니다.

`performanceEntry.name`이 `queryxxx` 또는 `getHostByAddr`과 같으면 `detail`에는 `host`, `ttl`, `result` 속성이 포함됩니다. `result`의 값은 `queryxxx` 또는 `getHostByAddr`의 결과와 같습니다.

## 클래스: `PerformanceNodeTiming` {#class-performancenodetiming}

**추가된 버전: v8.5.0**

- 확장: [\<PerformanceEntry\>](/ko/nodejs/api/perf_hooks#class-performanceentry)

*이 속성은 Node.js에 의한 확장입니다. 웹 브라우저에서는 사용할 수 없습니다.*

Node.js 자체에 대한 타이밍 세부 정보를 제공합니다. 이 클래스의 생성자는 사용자에게 노출되지 않습니다.

### `performanceNodeTiming.bootstrapComplete` {#performancenodetimingbootstrapcomplete}

**추가된 버전: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js 프로세스가 부트스트랩을 완료한 시점의 고해상도 밀리초 타임스탬프입니다. 부트스트랩이 아직 완료되지 않은 경우 속성 값은 -1입니다.


### `performanceNodeTiming.environment` {#performancenodetimingenvironment}

**추가된 버전: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js 환경이 초기화된 고해상도 밀리초 타임스탬프입니다.

### `performanceNodeTiming.idleTime` {#performancenodetimingidletime}

**추가된 버전: v14.10.0, v12.19.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

이벤트 루프의 이벤트 공급자(예: `epoll_wait`) 내에서 이벤트 루프가 유휴 상태였던 시간의 고해상도 밀리초 타임스탬프입니다. 이는 CPU 사용량을 고려하지 않습니다. 이벤트 루프가 아직 시작되지 않은 경우(예: 메인 스크립트의 첫 번째 틱에서) 속성 값은 0입니다.

### `performanceNodeTiming.loopExit` {#performancenodetimingloopexit}

**추가된 버전: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js 이벤트 루프가 종료된 고해상도 밀리초 타임스탬프입니다. 이벤트 루프가 아직 종료되지 않은 경우 속성 값은 -1입니다. [`'exit'`](/ko/nodejs/api/process#event-exit) 이벤트의 핸들러에서만 -1이 아닌 값을 가질 수 있습니다.

### `performanceNodeTiming.loopStart` {#performancenodetimingloopstart}

**추가된 버전: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js 이벤트 루프가 시작된 고해상도 밀리초 타임스탬프입니다. 이벤트 루프가 아직 시작되지 않은 경우(예: 메인 스크립트의 첫 번째 틱에서) 속성 값은 -1입니다.

### `performanceNodeTiming.nodeStart` {#performancenodetimingnodestart}

**추가된 버전: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js 프로세스가 초기화된 고해상도 밀리초 타임스탬프입니다.

### `performanceNodeTiming.uvMetricsInfo` {#performancenodetiminguvmetricsinfo}

**추가된 버전: v22.8.0, v20.18.0**

- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `loopCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이벤트 루프 반복 횟수입니다.
    - `events` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이벤트 핸들러에 의해 처리된 이벤트 수입니다.
    - `eventsWaiting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이벤트 공급자가 호출되었을 때 처리되기를 기다리는 이벤트 수입니다.

이것은 `uv_metrics_info` 함수에 대한 래퍼입니다. 현재 이벤트 루프 메트릭 세트를 반환합니다.

현재 루프 반복 중에 예약된 모든 작업이 완료되기 전에 메트릭을 수집하지 않도록 `setImmediate`를 사용하여 예약된 함수 내에서 이 속성을 사용하는 것이 좋습니다.

::: code-group
```js [CJS]
const { performance } = require('node:perf_hooks');

setImmediate(() => {
  console.log(performance.nodeTiming.uvMetricsInfo);
});
```

```js [ESM]
import { performance } from 'node:perf_hooks';

setImmediate(() => {
  console.log(performance.nodeTiming.uvMetricsInfo);
});
```
:::


### `performanceNodeTiming.v8Start` {#performancenodetimingv8start}

**Added in: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

V8 플랫폼이 초기화된 고해상도 밀리초 타임스탬프입니다.

## Class: `PerformanceResourceTiming` {#class-performanceresourcetiming}

**Added in: v18.2.0, v16.17.0**

- 확장: [\<PerformanceEntry\>](/ko/nodejs/api/perf_hooks#class-performanceentry)

애플리케이션 리소스 로드에 대한 자세한 네트워크 타이밍 데이터를 제공합니다.

이 클래스의 생성자는 사용자에게 직접 노출되지 않습니다.

### `performanceResourceTiming.workerStart` {#performanceresourcetimingworkerstart}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 이 속성 getter는 `PerformanceResourceTiming` 객체를 수신자로 사용하여 호출해야 합니다. |
| v18.2.0, v16.17.0 | Added in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`fetch` 요청을 디스패치하기 바로 직전의 고해상도 밀리초 타임스탬프입니다. 리소스가 워커에 의해 가로채이지 않으면 속성은 항상 0을 반환합니다.

### `performanceResourceTiming.redirectStart` {#performanceresourcetimingredirectstart}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 이 속성 getter는 `PerformanceResourceTiming` 객체를 수신자로 사용하여 호출해야 합니다. |
| v18.2.0, v16.17.0 | Added in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

리디렉션을 시작하는 fetch의 시작 시간을 나타내는 고해상도 밀리초 타임스탬프입니다.

### `performanceResourceTiming.redirectEnd` {#performanceresourcetimingredirectend}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 이 속성 getter는 `PerformanceResourceTiming` 객체를 수신자로 사용하여 호출해야 합니다. |
| v18.2.0, v16.17.0 | Added in: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

마지막 리디렉션의 응답의 마지막 바이트를 수신한 직후에 생성되는 고해상도 밀리초 타임스탬프입니다.


### `performanceResourceTiming.fetchStart` {#performanceresourcetimingfetchstart}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.0.0 | 이 속성 getter는 `PerformanceResourceTiming` 객체를 수신자로 하여 호출해야 합니다. |
| v18.2.0, v16.17.0 | 추가됨: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js가 리소스 가져오기를 시작하기 직전의 고해상도 밀리초 타임스탬프입니다.

### `performanceResourceTiming.domainLookupStart` {#performanceresourcetimingdomainlookupstart}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.0.0 | 이 속성 getter는 `PerformanceResourceTiming` 객체를 수신자로 하여 호출해야 합니다. |
| v18.2.0, v16.17.0 | 추가됨: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js가 리소스에 대한 도메인 이름 조회를 시작하기 직전의 고해상도 밀리초 타임스탬프입니다.

### `performanceResourceTiming.domainLookupEnd` {#performanceresourcetimingdomainlookupend}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.0.0 | 이 속성 getter는 `PerformanceResourceTiming` 객체를 수신자로 하여 호출해야 합니다. |
| v18.2.0, v16.17.0 | 추가됨: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js가 리소스에 대한 도메인 이름 조회를 완료한 직후의 시간을 나타내는 고해상도 밀리초 타임스탬프입니다.

### `performanceResourceTiming.connectStart` {#performanceresourcetimingconnectstart}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.0.0 | 이 속성 getter는 `PerformanceResourceTiming` 객체를 수신자로 하여 호출해야 합니다. |
| v18.2.0, v16.17.0 | 추가됨: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js가 리소스를 검색하기 위해 서버에 대한 연결을 설정하기 직전의 시간을 나타내는 고해상도 밀리초 타임스탬프입니다.


### `performanceResourceTiming.connectEnd` {#performanceresourcetimingconnectend}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 이 속성 getter는 `PerformanceResourceTiming` 객체를 수신자로 하여 호출해야 합니다. |
| v18.2.0, v16.17.0 | 추가됨: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js가 리소스를 검색하기 위해 서버에 대한 연결 설정을 완료한 직후의 시간을 나타내는 고해상도 밀리초 타임스탬프입니다.

### `performanceResourceTiming.secureConnectionStart` {#performanceresourcetimingsecureconnectionstart}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 이 속성 getter는 `PerformanceResourceTiming` 객체를 수신자로 하여 호출해야 합니다. |
| v18.2.0, v16.17.0 | 추가됨: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js가 현재 연결을 보호하기 위한 핸드셰이크 프로세스를 시작하기 직전의 시간을 나타내는 고해상도 밀리초 타임스탬프입니다.

### `performanceResourceTiming.requestStart` {#performanceresourcetimingrequeststart}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 이 속성 getter는 `PerformanceResourceTiming` 객체를 수신자로 하여 호출해야 합니다. |
| v18.2.0, v16.17.0 | 추가됨: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js가 서버에서 응답의 첫 번째 바이트를 받기 직전의 시간을 나타내는 고해상도 밀리초 타임스탬프입니다.

### `performanceResourceTiming.responseEnd` {#performanceresourcetimingresponseend}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 이 속성 getter는 `PerformanceResourceTiming` 객체를 수신자로 하여 호출해야 합니다. |
| v18.2.0, v16.17.0 | 추가됨: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Node.js가 리소스의 마지막 바이트를 받은 직후 또는 전송 연결이 닫히기 직전 중 더 빠른 시간을 나타내는 고해상도 밀리초 타임스탬프입니다.


### `performanceResourceTiming.transferSize` {#performanceresourcetimingtransfersize}

::: info [내역]
| 버전 | 변경 사항 |
|---|---|
| v19.0.0 | 이 속성 getter는 `PerformanceResourceTiming` 객체를 수신자로 호출해야 합니다. |
| v18.2.0, v16.17.0 | 추가됨: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

가져온 리소스의 크기(옥텟 단위)를 나타내는 숫자입니다. 크기에는 응답 헤더 필드와 응답 페이로드 본문이 포함됩니다.

### `performanceResourceTiming.encodedBodySize` {#performanceresourcetimingencodedbodysize}

::: info [내역]
| 버전 | 변경 사항 |
|---|---|
| v19.0.0 | 이 속성 getter는 `PerformanceResourceTiming` 객체를 수신자로 호출해야 합니다. |
| v18.2.0, v16.17.0 | 추가됨: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

적용된 콘텐츠 코딩을 제거하기 전 페치(HTTP 또는 캐시)에서 수신한 페이로드 본문의 크기(옥텟 단위)를 나타내는 숫자입니다.

### `performanceResourceTiming.decodedBodySize` {#performanceresourcetimingdecodedbodysize}

::: info [내역]
| 버전 | 변경 사항 |
|---|---|
| v19.0.0 | 이 속성 getter는 `PerformanceResourceTiming` 객체를 수신자로 호출해야 합니다. |
| v18.2.0, v16.17.0 | 추가됨: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

적용된 콘텐츠 코딩을 제거한 후 페치(HTTP 또는 캐시)에서 수신한 메시지 본문의 크기(옥텟 단위)를 나타내는 숫자입니다.

### `performanceResourceTiming.toJSON()` {#performanceresourcetimingtojson}

::: info [내역]
| 버전 | 변경 사항 |
|---|---|
| v19.0.0 | 이 메서드는 `PerformanceResourceTiming` 객체를 수신자로 호출해야 합니다. |
| v18.2.0, v16.17.0 | 추가됨: v18.2.0, v16.17.0 |
:::

`PerformanceResourceTiming` 객체의 JSON 표현인 `object`를 반환합니다.

## 클래스: `PerformanceObserver` {#class-performanceobserver}

**추가됨: v8.5.0**

### `PerformanceObserver.supportedEntryTypes` {#performanceobserversupportedentrytypes}

**추가됨: v16.0.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

지원되는 형식을 가져옵니다.


### `new PerformanceObserver(callback)` {#new-performanceobservercallback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE` 오류가 발생합니다. |
| v8.5.0 | 추가됨: v8.5.0 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `list` [\<PerformanceObserverEntryList\>](/ko/nodejs/api/perf_hooks#class-performanceobserverentrylist)
    - `observer` [\<PerformanceObserver\>](/ko/nodejs/api/perf_hooks#class-performanceobserver)
  
 

`PerformanceObserver` 객체는 새 `PerformanceEntry` 인스턴스가 성능 타임라인에 추가될 때 알림을 제공합니다.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries());

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark'], buffered: true });

performance.mark('test');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries());

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark'], buffered: true });

performance.mark('test');
```
:::

`PerformanceObserver` 인스턴스는 자체적인 추가 성능 오버헤드를 발생시키므로 인스턴스를 알림에 무기한 구독 상태로 두어서는 안 됩니다. 사용자는 더 이상 필요하지 않으면 옵저버 연결을 끊어야 합니다.

`callback`은 새 `PerformanceEntry` 인스턴스에 대해 `PerformanceObserver`가 알림을 받을 때 호출됩니다. 콜백은 `PerformanceObserverEntryList` 인스턴스와 `PerformanceObserver`에 대한 참조를 받습니다.

### `performanceObserver.disconnect()` {#performanceobserverdisconnect}

**추가됨: v8.5.0**

`PerformanceObserver` 인스턴스를 모든 알림에서 연결 해제합니다.


### `performanceObserver.observe(options)` {#performanceobserverobserveoptions}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.7.0 | Performance Timeline Level 2를 준수하도록 업데이트되었습니다. `buffered` 옵션이 다시 추가되었습니다. |
| v16.0.0 | User Timing Level 3을 준수하도록 업데이트되었습니다. `buffered` 옵션이 제거되었습니다. |
| v8.5.0 | 추가됨: v8.5.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 단일 [\<PerformanceEntry\>](/ko/nodejs/api/perf_hooks#class-performanceentry) 유형. `entryTypes`가 이미 지정된 경우 제공하지 않아야 합니다.
    - `entryTypes` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 옵저버가 관심 있는 [\<PerformanceEntry\>](/ko/nodejs/api/perf_hooks#class-performanceentry) 인스턴스의 유형을 식별하는 문자열 배열입니다. 제공되지 않으면 오류가 발생합니다.
    - `buffered` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) true인 경우 옵저버 콜백은 전역 `PerformanceEntry` 버퍼링된 항목 목록과 함께 호출됩니다. false인 경우 해당 시점 이후에 생성된 `PerformanceEntry`만 옵저버 콜백으로 전송됩니다. **기본값:** `false`.

`options.entryTypes` 또는 `options.type`으로 식별된 새로운 [\<PerformanceEntry\>](/ko/nodejs/api/perf_hooks#class-performanceentry) 인스턴스에 대한 알림을 [\<PerformanceObserver\>](/ko/nodejs/api/perf_hooks#class-performanceobserver) 인스턴스가 구독합니다.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((list, observer) => {
  // 비동기적으로 한 번 호출됩니다. `list`에는 세 개의 항목이 있습니다.
});
obs.observe({ type: 'mark' });

for (let n = 0; n < 3; n++)
  performance.mark(`test${n}`);
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((list, observer) => {
  // 비동기적으로 한 번 호출됩니다. `list`에는 세 개의 항목이 있습니다.
});
obs.observe({ type: 'mark' });

for (let n = 0; n < 3; n++)
  performance.mark(`test${n}`);
```
:::


### `performanceObserver.takeRecords()` {#performanceobservertakerecords}

**추가됨: v16.0.0**

- 반환: [\<PerformanceEntry[]\>](/ko/nodejs/api/perf_hooks#class-performanceentry) 성능 옵저버에 저장된 현재 항목 목록을 비웁니다.

## 클래스: `PerformanceObserverEntryList` {#class-performanceobserverentrylist}

**추가됨: v8.5.0**

`PerformanceObserverEntryList` 클래스는 `PerformanceObserver`에 전달된 `PerformanceEntry` 인스턴스에 대한 액세스를 제공하는 데 사용됩니다. 이 클래스의 생성자는 사용자에게 노출되지 않습니다.

### `performanceObserverEntryList.getEntries()` {#performanceobserverentrylistgetentries}

**추가됨: v8.5.0**

- 반환: [\<PerformanceEntry[]\>](/ko/nodejs/api/perf_hooks#class-performanceentry)

`performanceEntry.startTime`을 기준으로 시간 순서대로 `PerformanceEntry` 객체의 목록을 반환합니다.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntries());
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 81.465639,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 81.860064,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntries());
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 81.465639,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 81.860064,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```
:::


### `performanceObserverEntryList.getEntriesByName(name[, type])` {#performanceobserverentrylistgetentriesbynamename-type}

**Added in: v8.5.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<PerformanceEntry[]\>](/ko/nodejs/api/perf_hooks#class-performanceentry)

`performanceEntry.name`이 `name`과 같고 선택적으로 `performanceEntry.entryType`이 `type`과 같은 `PerformanceEntry` 객체의 목록을 `performanceEntry.startTime`을 기준으로 시간 순서대로 반환합니다.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByName('meow'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 98.545991,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('nope')); // []

  console.log(perfObserverList.getEntriesByName('test', 'mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 63.518931,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('test', 'measure')); // []

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark', 'measure'] });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByName('meow'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 98.545991,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('nope')); // []

  console.log(perfObserverList.getEntriesByName('test', 'mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 63.518931,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('test', 'measure')); // []

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark', 'measure'] });

performance.mark('test');
performance.mark('meow');
```
:::


### `performanceObserverEntryList.getEntriesByType(type)` {#performanceobserverentrylistgetentriesbytypetype}

**추가된 버전: v8.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<PerformanceEntry[]\>](/ko/nodejs/api/perf_hooks#class-performanceentry)

`performanceEntry.entryType`이 `type`과 같은 `PerformanceEntry` 객체 목록을 `performanceEntry.startTime`을 기준으로 시간순으로 반환합니다.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByType('mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 55.897834,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 56.350146,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByType('mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 55.897834,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 56.350146,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```
:::

## `perf_hooks.createHistogram([options])` {#perf_hookscreatehistogramoptions}

**추가된 버전: v15.9.0, v14.18.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `lowest` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 가장 낮은 식별 가능한 값. 0보다 큰 정수 값이어야 합니다. **기본값:** `1`.
    - `highest` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 기록 가능한 가장 높은 값. `lowest`의 두 배 이상인 정수 값이어야 합니다. **기본값:** `Number.MAX_SAFE_INTEGER`.
    - `figures` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 정확도 자릿수. `1`과 `5` 사이의 숫자여야 합니다. **기본값:** `3`.


- 반환: [\<RecordableHistogram\>](/ko/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram)

[\<RecordableHistogram\>](/ko/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram)을 반환합니다.


## `perf_hooks.monitorEventLoopDelay([options])` {#perf_hooksmonitoreventloopdelayoptions}

**Added in: v11.10.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `resolution` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 밀리초 단위의 샘플링 속도. 0보다 커야 합니다. **기본값:** `10`.
  
 
- 반환: [\<IntervalHistogram\>](/ko/nodejs/api/perf_hooks#class-intervalhistogram-extends-histogram)

*이 속성은 Node.js의 확장입니다. 웹 브라우저에서는 사용할 수 없습니다.*

시간 경과에 따른 이벤트 루프 지연을 샘플링하고 보고하는 `IntervalHistogram` 객체를 생성합니다. 지연 시간은 나노초 단위로 보고됩니다.

타이머를 사용하여 대략적인 이벤트 루프 지연을 감지하는 이유는 타이머 실행이 libuv 이벤트 루프의 라이프사이클에 구체적으로 연결되어 있기 때문입니다. 즉, 루프의 지연은 타이머 실행의 지연을 유발하고, 이러한 지연이 바로 이 API가 감지하려는 대상입니다.

::: code-group
```js [ESM]
import { monitorEventLoopDelay } from 'node:perf_hooks';

const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
// 뭔가 하기.
h.disable();
console.log(h.min);
console.log(h.max);
console.log(h.mean);
console.log(h.stddev);
console.log(h.percentiles);
console.log(h.percentile(50));
console.log(h.percentile(99));
```

```js [CJS]
const { monitorEventLoopDelay } = require('node:perf_hooks');
const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
// 뭔가 하기.
h.disable();
console.log(h.min);
console.log(h.max);
console.log(h.mean);
console.log(h.stddev);
console.log(h.percentiles);
console.log(h.percentile(50));
console.log(h.percentile(99));
```
:::

## Class: `Histogram` {#class-histogram}

**Added in: v11.10.0**

### `histogram.count` {#histogramcount}

**Added in: v17.4.0, v16.14.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

히스토그램에 기록된 샘플 수입니다.

### `histogram.countBigInt` {#histogramcountbigint}

**Added in: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

히스토그램에 기록된 샘플 수입니다.


### `histogram.exceeds` {#histogramexceeds}

**추가된 버전: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

이벤트 루프 지연이 최대 1시간 이벤트 루프 지연 임계값을 초과한 횟수입니다.

### `histogram.exceedsBigInt` {#histogramexceedsbigint}

**추가된 버전: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

이벤트 루프 지연이 최대 1시간 이벤트 루프 지연 임계값을 초과한 횟수입니다.

### `histogram.max` {#histogrammax}

**추가된 버전: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

기록된 최대 이벤트 루프 지연 시간입니다.

### `histogram.maxBigInt` {#histogrammaxbigint}

**추가된 버전: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

기록된 최대 이벤트 루프 지연 시간입니다.

### `histogram.mean` {#histogrammean}

**추가된 버전: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

기록된 이벤트 루프 지연 시간의 평균입니다.

### `histogram.min` {#histogrammin}

**추가된 버전: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

기록된 최소 이벤트 루프 지연 시간입니다.

### `histogram.minBigInt` {#histogramminbigint}

**추가된 버전: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

기록된 최소 이벤트 루프 지연 시간입니다.

### `histogram.percentile(percentile)` {#histogrampercentilepercentile}

**추가된 버전: v11.10.0**

- `percentile` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 범위 (0, 100]의 백분위수 값입니다.
- 반환: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

지정된 백분위수의 값을 반환합니다.

### `histogram.percentileBigInt(percentile)` {#histogrampercentilebigintpercentile}

**추가된 버전: v17.4.0, v16.14.0**

- `percentile` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 범위 (0, 100]의 백분위수 값입니다.
- 반환: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

지정된 백분위수의 값을 반환합니다.


### `histogram.percentiles` {#histogrampercentiles}

**Added in: v11.10.0**

- [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

누적 백분위 분포를 자세히 설명하는 `Map` 객체를 반환합니다.

### `histogram.percentilesBigInt` {#histogrampercentilesbigint}

**Added in: v17.4.0, v16.14.0**

- [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

누적 백분위 분포를 자세히 설명하는 `Map` 객체를 반환합니다.

### `histogram.reset()` {#histogramreset}

**Added in: v11.10.0**

수집된 히스토그램 데이터를 재설정합니다.

### `histogram.stddev` {#histogramstddev}

**Added in: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

기록된 이벤트 루프 지연의 표준 편차입니다.

## Class: `IntervalHistogram extends Histogram` {#class-intervalhistogram-extends-histogram}

주어진 간격으로 주기적으로 업데이트되는 `Histogram`입니다.

### `histogram.disable()` {#histogramdisable}

**Added in: v11.10.0**

- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

업데이트 간격 타이머를 비활성화합니다. 타이머가 중지되었으면 `true`를 반환하고 이미 중지되었으면 `false`를 반환합니다.

### `histogram.enable()` {#histogramenable}

**Added in: v11.10.0**

- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

업데이트 간격 타이머를 활성화합니다. 타이머가 시작되었으면 `true`를 반환하고 이미 시작되었으면 `false`를 반환합니다.

### `IntervalHistogram` 복제하기 {#cloning-an-intervalhistogram}

[\<IntervalHistogram\>](/ko/nodejs/api/perf_hooks#class-intervalhistogram-extends-histogram) 인스턴스는 [\<MessagePort\>](/ko/nodejs/api/worker_threads#class-messageport)를 통해 복제할 수 있습니다. 수신 측에서 히스토그램은 `enable()` 및 `disable()` 메서드를 구현하지 않는 일반 [\<Histogram\>](/ko/nodejs/api/perf_hooks#class-histogram) 객체로 복제됩니다.

## Class: `RecordableHistogram extends Histogram` {#class-recordablehistogram-extends-histogram}

**Added in: v15.9.0, v14.18.0**

### `histogram.add(other)` {#histogramaddother}

**Added in: v17.4.0, v16.14.0**

- `other` [\<RecordableHistogram\>](/ko/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram)

`other`의 값을 이 히스토그램에 추가합니다.


### `histogram.record(val)` {#histogramrecordval}

**추가된 버전: v15.9.0, v14.18.0**

- `val` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 히스토그램에 기록할 양입니다.

### `histogram.recordDelta()` {#histogramrecorddelta}

**추가된 버전: v15.9.0, v14.18.0**

`recordDelta()`를 마지막으로 호출한 이후 경과된 시간(나노초)을 계산하고 해당 양을 히스토그램에 기록합니다.

## 예시 {#examples}

### 비동기 작업의 지속 시간 측정 {#measuring-the-duration-of-async-operations}

다음 예제는 [Async Hooks](/ko/nodejs/api/async_hooks) 및 Performance API를 사용하여 Timeout 작업의 실제 지속 시간(콜백 실행에 걸린 시간 포함)을 측정합니다.

::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';
import { performance, PerformanceObserver } from 'node:perf_hooks';

const set = new Set();
const hook = createHook({
  init(id, type) {
    if (type === 'Timeout') {
      performance.mark(`Timeout-${id}-Init`);
      set.add(id);
    }
  },
  destroy(id) {
    if (set.has(id)) {
      set.delete(id);
      performance.mark(`Timeout-${id}-Destroy`);
      performance.measure(`Timeout-${id}`,
                          `Timeout-${id}-Init`,
                          `Timeout-${id}-Destroy`);
    }
  },
});
hook.enable();

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries()[0]);
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['measure'], buffered: true });

setTimeout(() => {}, 1000);
```

```js [CJS]
'use strict';
const async_hooks = require('node:async_hooks');
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const set = new Set();
const hook = async_hooks.createHook({
  init(id, type) {
    if (type === 'Timeout') {
      performance.mark(`Timeout-${id}-Init`);
      set.add(id);
    }
  },
  destroy(id) {
    if (set.has(id)) {
      set.delete(id);
      performance.mark(`Timeout-${id}-Destroy`);
      performance.measure(`Timeout-${id}`,
                          `Timeout-${id}-Init`,
                          `Timeout-${id}-Destroy`);
    }
  },
});
hook.enable();

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries()[0]);
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['measure'], buffered: true });

setTimeout(() => {}, 1000);
```
:::


### 종속성을 로드하는 데 걸리는 시간 측정하기 {#measuring-how-long-it-takes-to-load-dependencies}

다음 예제는 종속성을 로드하기 위해 `require()` 작업의 지속 시간을 측정합니다.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

// 관찰자 활성화
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`import('${entry[0]}')`, entry.duration);
  });
  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'], buffered: true });

const timedImport = performance.timerify(async (module) => {
  return await import(module);
});

await timedImport('some-module');
```

```js [CJS]
'use strict';
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');
const mod = require('node:module');

// require 함수 몽키 패치
mod.Module.prototype.require =
  performance.timerify(mod.Module.prototype.require);
require = performance.timerify(require);

// 관찰자 활성화
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`require('${entry[0]}')`, entry.duration);
  });
  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'], buffered: true });

require('some-module');
```
:::

### HTTP 왕복에 걸리는 시간 측정하기 {#measuring-how-long-one-http-round-trip-takes}

다음 예제는 HTTP 클라이언트(`OutgoingMessage`)와 HTTP 요청(`IncomingMessage`)이 소비하는 시간을 추적하는 데 사용됩니다. HTTP 클라이언트의 경우 요청 시작과 응답 수신 사이의 시간 간격을 의미하고, HTTP 요청의 경우 요청 수신과 응답 전송 사이의 시간 간격을 의미합니다.

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { createServer, get } from 'node:http';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});

obs.observe({ entryTypes: ['http'] });

const PORT = 8080;

createServer((req, res) => {
  res.end('ok');
}).listen(PORT, () => {
  get(`http://127.0.0.1:${PORT}`);
});
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const http = require('node:http');

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});

obs.observe({ entryTypes: ['http'] });

const PORT = 8080;

http.createServer((req, res) => {
  res.end('ok');
}).listen(PORT, () => {
  http.get(`http://127.0.0.1:${PORT}`);
});
```
:::


### `net.connect`가 성공했을 때 소요 시간 측정 (TCP에만 해당) {#measuring-how-long-the-netconnect-only-for-tcp-takes-when-the-connection-is-successful}

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { connect, createServer } from 'node:net';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['net'] });
const PORT = 8080;
createServer((socket) => {
  socket.destroy();
}).listen(PORT, () => {
  connect(PORT);
});
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const net = require('node:net');
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['net'] });
const PORT = 8080;
net.createServer((socket) => {
  socket.destroy();
}).listen(PORT, () => {
  net.connect(PORT);
});
```
:::

### 요청이 성공했을 때 DNS 소요 시간 측정 {#measuring-how-long-the-dns-takes-when-the-request-is-successful}

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { lookup, promises } from 'node:dns';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['dns'] });
lookup('localhost', () => {});
promises.resolve('localhost');
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const dns = require('node:dns');
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['dns'] });
dns.lookup('localhost', () => {});
dns.promises.resolve('localhost');
```
:::

