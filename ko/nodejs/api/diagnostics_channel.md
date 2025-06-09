---
title: Node.js 진단 채널
description: Node.js의 진단 채널 모듈은 진단 정보의 명명된 채널을 생성, 게시 및 구독하기 위한 API를 제공하여 애플리케이션의 모니터링과 디버깅을 개선합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 진단 채널 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 진단 채널 모듈은 진단 정보의 명명된 채널을 생성, 게시 및 구독하기 위한 API를 제공하여 애플리케이션의 모니터링과 디버깅을 개선합니다.
  - - meta
    - name: twitter:title
      content: Node.js 진단 채널 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 진단 채널 모듈은 진단 정보의 명명된 채널을 생성, 게시 및 구독하기 위한 API를 제공하여 애플리케이션의 모니터링과 디버깅을 개선합니다.
---


# 진단 채널 {#diagnostics-channel}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.2.0, v18.13.0 | diagnostics_channel이 이제 안정적입니다. |
| v15.1.0, v14.17.0 | 추가됨: v15.1.0, v14.17.0 |
:::

::: tip [안정적: 2 - 안정적]
[안정적: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

**소스 코드:** [lib/diagnostics_channel.js](https://github.com/nodejs/node/blob/v23.5.0/lib/diagnostics_channel.js)

`node:diagnostics_channel` 모듈은 진단 목적으로 임의의 메시지 데이터를 보고하기 위해 명명된 채널을 생성하는 API를 제공합니다.

다음과 같이 액세스할 수 있습니다.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
```
:::

진단 메시지를 보고하려는 모듈 작성자는 메시지를 통해 보고할 하나 이상의 최상위 채널을 생성하는 것이 좋습니다. 채널은 런타임에 획득할 수도 있지만 그렇게 하면 추가 오버헤드가 발생하므로 권장되지 않습니다. 채널은 편의를 위해 내보낼 수 있지만 이름이 알려져 있는 한 어디서든 획득할 수 있습니다.

모듈이 다른 사람이 사용할 진단 데이터를 생성하려는 경우 어떤 명명된 채널이 사용되는지와 메시지 데이터의 모양에 대한 문서를 포함하는 것이 좋습니다. 채널 이름에는 일반적으로 다른 모듈의 데이터와의 충돌을 방지하기 위해 모듈 이름이 포함되어야 합니다.

## 공용 API {#public-api}

### 개요 {#overview}

다음은 공용 API에 대한 간단한 개요입니다.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

// 재사용 가능한 채널 객체 가져오기
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // 데이터 수신됨
}

// 채널 구독
diagnostics_channel.subscribe('my-channel', onMessage);

// 채널에 활성 구독자가 있는지 확인
if (channel.hasSubscribers) {
  // 채널에 데이터 게시
  channel.publish({
    some: 'data',
  });
}

// 채널 구독 취소
diagnostics_channel.unsubscribe('my-channel', onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

// 재사용 가능한 채널 객체 가져오기
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // 데이터 수신됨
}

// 채널 구독
diagnostics_channel.subscribe('my-channel', onMessage);

// 채널에 활성 구독자가 있는지 확인
if (channel.hasSubscribers) {
  // 채널에 데이터 게시
  channel.publish({
    some: 'data',
  });
}

// 채널 구독 취소
diagnostics_channel.unsubscribe('my-channel', onMessage);
```
:::


#### `diagnostics_channel.hasSubscribers(name)` {#diagnostics_channelhassubscribersname}

**Added in: v15.1.0, v14.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 채널 이름
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 활성 구독자가 있는 경우 `true`

이름이 지정된 채널에 활성 구독자가 있는지 확인합니다. 보내려는 메시지를 준비하는 데 비용이 많이 들 수 있는 경우에 유용합니다.

이 API는 선택 사항이지만 성능에 매우 민감한 코드에서 메시지를 게시하려는 경우에 유용합니다.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // There are subscribers, prepare and publish message
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // There are subscribers, prepare and publish message
}
```
:::

#### `diagnostics_channel.channel(name)` {#diagnostics_channelchannelname}

**Added in: v15.1.0, v14.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 채널 이름
- 반환: [\<Channel\>](/ko/nodejs/api/diagnostics_channel#class-channel) 이름이 지정된 채널 객체

이것은 이름이 지정된 채널에 게시하려는 모든 사람을 위한 주요 진입점입니다. 가능한 한 게시 시 오버헤드를 줄이도록 최적화된 채널 객체를 생성합니다.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');
```
:::

#### `diagnostics_channel.subscribe(name, onMessage)` {#diagnostics_channelsubscribename-onmessage}

**Added in: v18.7.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 채널 이름
- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 채널 메시지를 수신할 핸들러
    - `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 메시지 데이터
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 채널 이름
  
 

이 채널을 구독하기 위해 메시지 핸들러를 등록합니다. 이 메시지 핸들러는 채널에 메시지가 게시될 때마다 동기적으로 실행됩니다. 메시지 핸들러에서 발생하는 모든 오류는 [`'uncaughtException'`](/ko/nodejs/api/process#event-uncaughtexception)을 트리거합니다.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // Received data
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // Received data
});
```
:::


#### `diagnostics_channel.unsubscribe(name, onMessage)` {#diagnostics_channelunsubscribename-onmessage}

**추가된 버전: v18.7.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 채널 이름
- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 제거할 이전 구독 핸들러
- 반환값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 핸들러가 발견되면 `true`, 그렇지 않으면 `false`입니다.

[`diagnostics_channel.subscribe(name, onMessage)`](/ko/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage)로 이전에 이 채널에 등록된 메시지 핸들러를 제거합니다.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

function onMessage(message, name) {
  // 수신된 데이터
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

function onMessage(message, name) {
  // 수신된 데이터
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
```
:::

#### `diagnostics_channel.tracingChannel(nameOrChannels)` {#diagnostics_channeltracingchannelnameorchannels}

**추가된 버전: v19.9.0, v18.19.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `nameOrChannels` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<TracingChannel\>](/ko/nodejs/api/diagnostics_channel#class-tracingchannel) 채널 이름 또는 모든 [TracingChannel 채널](/ko/nodejs/api/diagnostics_channel#tracingchannel-channels)을 포함하는 객체
- 반환값: [\<TracingChannel\>](/ko/nodejs/api/diagnostics_channel#class-tracingchannel) 추적할 채널 컬렉션

지정된 [TracingChannel 채널](/ko/nodejs/api/diagnostics_channel#tracingchannel-channels)에 대한 [`TracingChannel`](/ko/nodejs/api/diagnostics_channel#class-tracingchannel) 래퍼를 만듭니다. 이름이 주어지면 해당 추적 채널은 `tracing:${name}:${eventType}` 형식으로 생성됩니다. 여기서 `eventType`는 [TracingChannel 채널](/ko/nodejs/api/diagnostics_channel#tracingchannel-channels)의 유형에 해당합니다.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// 또는...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// 또는...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
```
:::


### 클래스: `Channel` {#class-channel}

**추가된 버전: v15.1.0, v14.17.0**

`Channel` 클래스는 데이터 파이프라인 내의 개별적인 명명된 채널을 나타냅니다. 이는 구독자를 추적하고 구독자가 존재할 때 메시지를 게시하는 데 사용됩니다. 게시 시 채널 조회를 피하기 위해 별도의 객체로 존재하며, 매우 빠른 게시 속도를 가능하게 하고 최소한의 비용으로 많은 사용을 허용합니다. 채널은 [`diagnostics_channel.channel(name)`](/ko/nodejs/api/diagnostics_channel#diagnostics_channelchannelname)으로 생성되며, `new Channel(name)`을 사용하여 직접 채널을 생성하는 것은 지원되지 않습니다.

#### `channel.hasSubscribers` {#channelhassubscribers}

**추가된 버전: v15.1.0, v14.17.0**

- 반환 값: [\<boolean\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Boolean_type) 활성 구독자가 있는지 여부

이 채널에 활성 구독자가 있는지 확인합니다. 보내려는 메시지를 준비하는 데 비용이 많이 들 수 있는 경우에 유용합니다.

이 API는 선택 사항이지만 매우 성능에 민감한 코드에서 메시지를 게시하려고 할 때 유용합니다.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // 구독자가 있으므로 메시지를 준비하고 게시합니다.
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // 구독자가 있으므로 메시지를 준비하고 게시합니다.
}
```
:::

#### `channel.publish(message)` {#channelpublishmessage}

**추가된 버전: v15.1.0, v14.17.0**

- `message` [\<any\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Data_types) 채널 구독자에게 보낼 메시지

채널 구독자에게 메시지를 게시합니다. 이는 메시지 핸들러를 동기적으로 트리거하여 동일한 컨텍스트 내에서 실행되도록 합니다.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
```
:::


#### `channel.subscribe(onMessage)` {#channelsubscribeonmessage}

**Added in: v15.1.0, v14.17.0**

**Deprecated since: v18.7.0, v16.17.0**

::: danger [Stable: 0 - Deprecated]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - Deprecated: [`diagnostics_channel.subscribe(name, onMessage)`](/ko/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage)를 사용하세요.
:::

- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 채널 메시지를 수신할 핸들러
    - `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 메시지 데이터
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 채널 이름
  
 

이 채널을 구독하기 위해 메시지 핸들러를 등록합니다. 이 메시지 핸들러는 메시지가 채널에 게시될 때마다 동기적으로 실행됩니다. 메시지 핸들러에서 발생하는 모든 오류는 [`'uncaughtException'`](/ko/nodejs/api/process#event-uncaughtexception)을 트리거합니다.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // Received data
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // Received data
});
```
:::

#### `channel.unsubscribe(onMessage)` {#channelunsubscribeonmessage}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.7.0, v16.17.0 | Deprecated since: v18.7.0, v16.17.0 |
| v17.1.0, v16.14.0, v14.19.0 | 반환 값 추가. 구독자가 없는 채널에 추가되었습니다. |
| v15.1.0, v14.17.0 | Added in: v15.1.0, v14.17.0 |
:::

::: danger [Stable: 0 - Deprecated]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - Deprecated: [`diagnostics_channel.unsubscribe(name, onMessage)`](/ko/nodejs/api/diagnostics_channel#diagnostics_channelunsubscribename-onmessage)를 사용하세요.
:::

- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 제거할 이전 구독 핸들러
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 핸들러가 발견되면 `true`, 그렇지 않으면 `false`입니다.

[`channel.subscribe(onMessage)`](/ko/nodejs/api/diagnostics_channel#channelsubscribeonmessage)로 이전에 이 채널에 등록된 메시지 핸들러를 제거합니다.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Received data
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Received data
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
```
:::


#### `channel.bindStore(store[, transform])` {#channelbindstorestore-transform}

**Added in: v19.9.0, v18.19.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `store` [\<AsyncLocalStorage\>](/ko/nodejs/api/async_context#class-asynclocalstorage) 컨텍스트 데이터를 바인딩할 저장소
- `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 저장소 컨텍스트를 설정하기 전에 컨텍스트 데이터를 변환합니다.

[`channel.runStores(context, ...)`](/ko/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args)가 호출되면 주어진 컨텍스트 데이터가 채널에 바인딩된 모든 저장소에 적용됩니다. 저장소가 이미 바인딩된 경우 이전 `transform` 함수는 새 함수로 대체됩니다. 주어진 컨텍스트 데이터를 컨텍스트로 직접 설정하기 위해 `transform` 함수를 생략할 수 있습니다.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
```
:::

#### `channel.unbindStore(store)` {#channelunbindstorestore}

**Added in: v19.9.0, v18.19.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `store` [\<AsyncLocalStorage\>](/ko/nodejs/api/async_context#class-asynclocalstorage) 채널에서 바인딩 해제할 저장소입니다.
- 반환값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 저장소를 찾았으면 `true`, 그렇지 않으면 `false`입니다.

[`channel.bindStore(store)`](/ko/nodejs/api/diagnostics_channel#channelbindstorestore-transform)를 사용하여 이 채널에 이전에 등록된 메시지 핸들러를 제거합니다.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
```
:::


#### `channel.runStores(context, fn[, thisArg[, ...args]])` {#channelrunstorescontext-fn-thisarg-args}

**Added in: v19.9.0, v18.19.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `context` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 구독자에게 보내고 스토어에 바인딩할 메시지
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 입력된 스토리지 컨텍스트 내에서 실행할 핸들러
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 함수 호출에 사용할 수신기
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 함수에 전달할 선택적 인수입니다.

지정된 함수 기간 동안 채널에 바인딩된 모든 AsyncLocalStorage 인스턴스에 지정된 데이터를 적용한 다음 해당 데이터의 범위 내에서 채널에 게시하여 스토어에 적용합니다.

변환 함수가 [`channel.bindStore(store)`](/ko/nodejs/api/diagnostics_channel#channelbindstorestore-transform)에 제공된 경우, 스토어에 대한 컨텍스트 값이 되기 전에 메시지 데이터를 변환하는 데 적용됩니다. 컨텍스트 연결이 필요한 경우 이전 스토리지 컨텍스트는 변환 함수 내에서 액세스할 수 있습니다.

스토어에 적용된 컨텍스트는 지정된 함수 중에 시작된 실행에서 계속되는 모든 비동기 코드에서 액세스할 수 있어야 하지만 [컨텍스트 손실](/ko/nodejs/api/async_context#troubleshooting-context-loss)이 발생할 수 있는 상황이 있습니다.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
```
:::


### 클래스: `TracingChannel` {#class-tracingchannel}

**추가된 버전: v19.9.0, v18.19.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

`TracingChannel` 클래스는 추적 가능한 단일 작업을 함께 표현하는 [TracingChannel 채널](/ko/nodejs/api/diagnostics_channel#tracingchannel-channels)의 모음입니다. 애플리케이션 흐름 추적을 위한 이벤트 생성 프로세스를 공식화하고 단순화하는 데 사용됩니다. [`diagnostics_channel.tracingChannel()`](/ko/nodejs/api/diagnostics_channel#diagnostics_channeltracingchannelnameorchannels)은 `TracingChannel`을 구성하는 데 사용됩니다. `Channel`과 마찬가지로 채널을 동적으로 생성하는 대신 파일의 최상위 수준에서 단일 `TracingChannel`을 생성하고 재사용하는 것이 좋습니다.

#### `tracingChannel.subscribe(subscribers)` {#tracingchannelsubscribesubscribers}

**추가된 버전: v19.9.0, v18.19.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `subscribers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [TracingChannel 채널](/ko/nodejs/api/diagnostics_channel#tracingchannel-channels) 구독자 집합
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`start` 이벤트](/ko/nodejs/api/diagnostics_channel#startevent) 구독자
    - `end` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`end` 이벤트](/ko/nodejs/api/diagnostics_channel#endevent) 구독자
    - `asyncStart` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`asyncStart` 이벤트](/ko/nodejs/api/diagnostics_channel#asyncstartevent) 구독자
    - `asyncEnd` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`asyncEnd` 이벤트](/ko/nodejs/api/diagnostics_channel#asyncendevent) 구독자
    - `error` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`error` 이벤트](/ko/nodejs/api/diagnostics_channel#errorevent) 구독자
  
 

해당 채널에 함수 컬렉션을 구독하는 도우미입니다. 이는 각 채널에서 [`channel.subscribe(onMessage)`](/ko/nodejs/api/diagnostics_channel#channelsubscribeonmessage)를 개별적으로 호출하는 것과 같습니다.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // 시작 메시지 처리
  },
  end(message) {
    // 종료 메시지 처리
  },
  asyncStart(message) {
    // asyncStart 메시지 처리
  },
  asyncEnd(message) {
    // asyncEnd 메시지 처리
  },
  error(message) {
    // 오류 메시지 처리
  },
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // 시작 메시지 처리
  },
  end(message) {
    // 종료 메시지 처리
  },
  asyncStart(message) {
    // asyncStart 메시지 처리
  },
  asyncEnd(message) {
    // asyncEnd 메시지 처리
  },
  error(message) {
    // 오류 메시지 처리
  },
});
```
:::


#### `tracingChannel.unsubscribe(subscribers)` {#tracingchannelunsubscribesubscribers}

**다음 버전에서 추가됨: v19.9.0, v18.19.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `subscribers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [TracingChannel 채널](/ko/nodejs/api/diagnostics_channel#tracingchannel-channels) 구독자 세트
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`start` 이벤트](/ko/nodejs/api/diagnostics_channel#startevent) 구독자
    - `end` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`end` 이벤트](/ko/nodejs/api/diagnostics_channel#endevent) 구독자
    - `asyncStart` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`asyncStart` 이벤트](/ko/nodejs/api/diagnostics_channel#asyncstartevent) 구독자
    - `asyncEnd` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`asyncEnd` 이벤트](/ko/nodejs/api/diagnostics_channel#asyncendevent) 구독자
    - `error` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`error` 이벤트](/ko/nodejs/api/diagnostics_channel#errorevent) 구독자
  
 
- 반환값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 모든 핸들러가 성공적으로 구독 취소되면 `true`, 그렇지 않으면 `false`입니다.

해당 채널에서 함수의 컬렉션을 구독 취소하는 데 도움이 됩니다. 이는 각 채널에서 개별적으로 [`channel.unsubscribe(onMessage)`](/ko/nodejs/api/diagnostics_channel#channelunsubscribeonmessage)를 호출하는 것과 같습니다.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```
:::


#### `tracingChannel.traceSync(fn[, context[, thisArg[, ...args]]])` {#tracingchanneltracesyncfn-context-thisarg-args}

**추가된 버전: v19.9.0, v18.19.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 추적을 래핑할 함수
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 이벤트를 통해 상호 연관시킬 공유 객체
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 함수 호출에 사용할 수신기
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 함수에 전달할 선택적 인수
- 반환: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 주어진 함수의 반환 값

동기 함수 호출을 추적합니다. 이는 항상 실행 전후에 [`start` 이벤트](/ko/nodejs/api/diagnostics_channel#startevent) 및 [`end` 이벤트](/ko/nodejs/api/diagnostics_channel#endevent)를 생성하고, 주어진 함수가 오류를 발생시키는 경우 [`error` 이벤트](/ko/nodejs/api/diagnostics_channel#errorevent)를 생성할 수 있습니다. 이는 `start` 채널에서 [`channel.runStores(context, ...)`](/ko/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args)를 사용하여 주어진 함수를 실행하며, 이는 모든 이벤트가 이 추적 컨텍스트와 일치하도록 설정된 바인딩된 저장소를 갖도록 보장합니다.

올바른 추적 그래프만 형성되도록 하려면, 추적을 시작하기 전에 구독자가 있는 경우에만 이벤트가 게시됩니다. 추적이 시작된 후에 추가된 구독은 해당 추적에서 이후 이벤트를 수신하지 않으며, 이후 추적만 볼 수 있습니다.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});
```
:::


#### `tracingChannel.tracePromise(fn[, context[, thisArg[, ...args]]])` {#tracingchanneltracepromisefn-context-thisarg-args}

**Added in: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 트레이스를 래핑할 Promise 반환 함수
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 트레이스 이벤트를 통해 상관 관계를 지정할 공유 객체
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 함수 호출에 사용할 수신기
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 함수에 전달할 선택적 인수
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 주어진 함수에서 반환된 Promise에서 체인됨

Promise 반환 함수 호출을 추적합니다. 이는 항상 함수 실행의 동기 부분 주위에 [`start` 이벤트](/ko/nodejs/api/diagnostics_channel#startevent) 및 [`end` 이벤트](/ko/nodejs/api/diagnostics_channel#endevent)를 생성하고, Promise 연속에 도달하면 [`asyncStart` 이벤트](/ko/nodejs/api/diagnostics_channel#asyncstartevent) 및 [`asyncEnd` 이벤트](/ko/nodejs/api/diagnostics_channel#asyncendevent)를 생성합니다. 또한 주어진 함수가 오류를 throw하거나 반환된 Promise가 거부되면 [`error` 이벤트](/ko/nodejs/api/diagnostics_channel#errorevent)를 생성할 수도 있습니다. 이는 `start` 채널에서 [`channel.runStores(context, ...)`](/ko/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args)를 사용하여 주어진 함수를 실행하여 모든 이벤트가 이 추적 컨텍스트와 일치하도록 설정된 바운드 저장소를 갖도록 합니다.

올바른 추적 그래프만 형성되도록 하기 위해 구독자가 추적을 시작하기 전에 존재하는 경우에만 이벤트가 게시됩니다. 추적이 시작된 후에 추가된 구독은 해당 추적에서 향후 이벤트를 수신하지 않으며, 향후 추적만 볼 수 있습니다.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
```
:::


#### `tracingChannel.traceCallback(fn[, position[, context[, thisArg[, ...args]]]])` {#tracingchanneltracecallbackfn-position-context-thisarg-args}

**다음 버전부터 사용 가능: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `fn` [\<Function\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function) 추적을 래핑하는 함수를 사용하는 콜백
- `position` [\<number\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Number_type) 예상 콜백의 0부터 시작하는 인덱스 위치(`undefined`가 전달되면 마지막 인수가 기본값)
- `context` [\<Object\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object) 추적 이벤트를 통해 상관 관계를 지정할 공유 객체(`undefined`가 전달되면 `{}`가 기본값)
- `thisArg` [\<any\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Data_types) 함수 호출에 사용할 수신자
- `...args` [\<any\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Data_types) 함수에 전달할 인수(콜백 포함해야 함)
- 반환: [\<any\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Data_types) 주어진 함수의 반환 값

콜백을 수신하는 함수 호출을 추적합니다. 콜백은 일반적으로 사용되는 오류를 첫 번째 인수로 사용하는 규칙을 따를 것으로 예상됩니다. 이렇게 하면 함수 실행의 동기식 부분에서 항상 [`start` 이벤트](/ko/nodejs/api/diagnostics_channel#startevent)와 [`end` 이벤트](/ko/nodejs/api/diagnostics_channel#endevent)가 생성되고, 콜백 실행 주변에서 [`asyncStart` 이벤트](/ko/nodejs/api/diagnostics_channel#asyncstartevent)와 [`asyncEnd` 이벤트](/ko/nodejs/api/diagnostics_channel#asyncendevent)가 생성됩니다. 주어진 함수가 예외를 발생시키거나 콜백에 전달된 첫 번째 인수가 설정된 경우 [`error` 이벤트](/ko/nodejs/api/diagnostics_channel#errorevent)가 생성될 수도 있습니다. 이렇게 하면 `start` 채널에서 [`channel.runStores(context, ...)`](/ko/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args)를 사용하여 주어진 함수가 실행되어 모든 이벤트에 이 추적 컨텍스트와 일치하도록 설정된 바인딩된 저장소가 있는지 확인합니다.

올바른 추적 그래프만 생성되도록 하려면 추적을 시작하기 전에 구독자가 있는 경우에만 이벤트가 게시됩니다. 추적이 시작된 후에 추가된 구독은 해당 추적에서 이후 이벤트를 수신하지 않으며, 이후 추적만 표시됩니다.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
```
:::

콜백은 [`channel.runStores(context, ...)`](/ko/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args)와 함께 실행되므로 경우에 따라 컨텍스트 손실 복구가 가능합니다.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// 시작 채널은 초기 저장소 데이터를 어떤 것으로 설정하고
// 해당 저장소 데이터 값을 추적 컨텍스트 객체에 저장합니다.
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// 그런 다음 asyncStart는 이전에 저장한 해당 데이터에서 복원할 수 있습니다.
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// 시작 채널은 초기 저장소 데이터를 어떤 것으로 설정하고
// 해당 저장소 데이터 값을 추적 컨텍스트 객체에 저장합니다.
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// 그런 다음 asyncStart는 이전에 저장한 해당 데이터에서 복원할 수 있습니다.
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
```
:::


#### `tracingChannel.hasSubscribers` {#tracingchannelhassubscribers}

**다음 버전부터 추가됨: v22.0.0, v20.13.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- 반환값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 개별 채널에 구독자가 있으면 `true`, 그렇지 않으면 `false`입니다.

이것은 [TracingChannel 채널](/ko/nodejs/api/diagnostics_channel#tracingchannel-channels)에 구독자가 있는지 확인하기 위해 [`TracingChannel`](/ko/nodejs/api/diagnostics_channel#class-tracingchannel) 인스턴스에서 사용할 수 있는 도우미 메서드입니다. 하나 이상의 구독자가 있으면 `true`가 반환되고, 그렇지 않으면 `false`가 반환됩니다.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Do something
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Do something
}
```
:::

### TracingChannel 채널 {#tracingchannel-channels}

TracingChannel은 단일 추적 가능한 작업의 실행 수명 주기에서 특정 시점을 나타내는 여러 diagnostics_channel의 모음입니다. 동작은 `start`, `end`, `asyncStart`, `asyncEnd` 및 `error`로 구성된 5개의 diagnostics_channel로 나뉩니다. 단일 추적 가능한 작업은 모든 이벤트 간에 동일한 이벤트 객체를 공유합니다. 이는 약한 맵을 통해 상관 관계를 관리하는 데 유용할 수 있습니다.

이러한 이벤트 객체는 작업이 "완료"되면 `result` 또는 `error` 값으로 확장됩니다. 동기 작업의 경우 `result`는 반환 값이 되고 `error`는 함수에서 발생한 모든 것이 됩니다. 콜백 기반 비동기 함수의 경우 `result`는 콜백의 두 번째 인수가 되고 `error`는 `end` 이벤트에서 보이는 던져진 오류이거나 `asyncStart` 또는 `asyncEnd` 이벤트의 첫 번째 콜백 인수입니다.

정확한 추적 그래프만 형성되도록 하려면 추적을 시작하기 전에 구독자가 있는 경우에만 이벤트를 게시해야 합니다. 추적이 시작된 후에 추가된 구독은 해당 추적의 향후 이벤트를 수신하지 않고 향후 추적만 볼 수 있습니다.

추적 채널은 다음 명명 패턴을 따라야 합니다.

- `tracing:module.class.method:start` 또는 `tracing:module.function:start`
- `tracing:module.class.method:end` 또는 `tracing:module.function:end`
- `tracing:module.class.method:asyncStart` 또는 `tracing:module.function:asyncStart`
- `tracing:module.class.method:asyncEnd` 또는 `tracing:module.function:asyncEnd`
- `tracing:module.class.method:error` 또는 `tracing:module.function:error`


#### `start(event)` {#startevent}

- 이름: `tracing:${name}:start`

`start` 이벤트는 함수가 호출되는 시점을 나타냅니다. 이 시점에서 이벤트 데이터는 함수 인수 또는 함수 실행 시작 시점에 사용 가능한 모든 것을 포함할 수 있습니다.

#### `end(event)` {#endevent}

- 이름: `tracing:${name}:end`

`end` 이벤트는 함수 호출이 값을 반환하는 시점을 나타냅니다. 비동기 함수의 경우 이는 함수 자체가 내부적으로 반환문을 만드는 시점이 아니라 반환된 프로미스가 반환되는 시점입니다. 이 시점에서 추적된 함수가 동기식인 경우 `result` 필드는 함수의 반환 값으로 설정됩니다. 또는 `error` 필드가 존재하여 발생한 오류를 나타낼 수 있습니다.

추적 가능한 작업이 여러 오류를 생성할 수 있으므로 오류를 추적하려면 `error` 이벤트를 구체적으로 수신하는 것이 좋습니다. 예를 들어 실패한 비동기 작업은 작업의 동기식 부분이 오류를 발생시키기 전에 내부적으로 시작될 수 있습니다.

#### `asyncStart(event)` {#asyncstartevent}

- 이름: `tracing:${name}:asyncStart`

`asyncStart` 이벤트는 추적 가능한 함수의 콜백 또는 연속이 도달했음을 나타냅니다. 이 시점에서 콜백 인수 또는 작업의 "결과"를 나타내는 다른 모든 것이 사용 가능할 수 있습니다.

콜백 기반 함수의 경우 콜백의 첫 번째 인수는 `undefined` 또는 `null`이 아니면 `error` 필드에 할당되고 두 번째 인수는 `result` 필드에 할당됩니다.

프로미스의 경우 `resolve` 경로에 대한 인수는 `result`에 할당되고 `reject` 경로에 대한 인수는 `error`에 할당됩니다.

추적 가능한 작업이 여러 오류를 생성할 수 있으므로 오류를 추적하려면 `error` 이벤트를 구체적으로 수신하는 것이 좋습니다. 예를 들어 실패한 비동기 작업은 작업의 동기식 부분이 오류를 발생시키기 전에 내부적으로 시작될 수 있습니다.

#### `asyncEnd(event)` {#asyncendevent}

- 이름: `tracing:${name}:asyncEnd`

`asyncEnd` 이벤트는 비동기 함수의 콜백이 반환됨을 나타냅니다. `asyncStart` 이벤트 후에 이벤트 데이터가 변경될 가능성은 낮지만 콜백이 완료되는 시점을 확인하는 데 유용할 수 있습니다.


#### `error(event)` {#errorevent}

- 이름: `tracing:${name}:error`

`error` 이벤트는 추적 가능한 함수에 의해 동기 또는 비동기적으로 생성된 모든 오류를 나타냅니다. 추적된 함수의 동기 부분에서 오류가 발생하면 오류는 이벤트의 `error` 필드에 할당되고 `error` 이벤트가 트리거됩니다. 콜백 또는 프로미스 거부를 통해 비동기적으로 오류가 수신되는 경우에도 오류는 이벤트의 `error` 필드에 할당되고 `error` 이벤트가 트리거됩니다.

단일 추적 가능 함수 호출로 인해 오류가 여러 번 발생할 수 있으므로 이 이벤트를 사용할 때 고려해야 합니다. 예를 들어, 내부적으로 다른 비동기 작업이 트리거되어 실패한 다음 함수의 동기 부분이 오류를 발생시키면 두 개의 `error` 이벤트가 발생합니다. 하나는 동기 오류에 대한 것이고 다른 하나는 비동기 오류에 대한 것입니다.

### 기본 제공 채널 {#built-in-channels}

::: warning [안정적: 1 - 실험적]
[안정적: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

diagnostics_channel API는 현재 안정적인 것으로 간주되지만 현재 사용 가능한 기본 제공 채널은 그렇지 않습니다. 각 채널은 독립적으로 안정적이라고 선언되어야 합니다.

#### HTTP {#http}

`http.client.request.created`

- `request` [\<http.ClientRequest\>](/ko/nodejs/api/http#class-httpclientrequest)

클라이언트가 요청 객체를 생성할 때 발생합니다. `http.client.request.start`와 달리 이 이벤트는 요청이 전송되기 전에 발생합니다.

`http.client.request.start`

- `request` [\<http.ClientRequest\>](/ko/nodejs/api/http#class-httpclientrequest)

클라이언트가 요청을 시작할 때 발생합니다.

`http.client.request.error`

- `request` [\<http.ClientRequest\>](/ko/nodejs/api/http#class-httpclientrequest)
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

클라이언트 요청 중에 오류가 발생할 때 발생합니다.

`http.client.response.finish`

- `request` [\<http.ClientRequest\>](/ko/nodejs/api/http#class-httpclientrequest)
- `response` [\<http.IncomingMessage\>](/ko/nodejs/api/http#class-httpincomingmessage)

클라이언트가 응답을 받을 때 발생합니다.

`http.server.request.start`

- `request` [\<http.IncomingMessage\>](/ko/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/ko/nodejs/api/http#class-httpserverresponse)
- `socket` [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket)
- `server` [\<http.Server\>](/ko/nodejs/api/http#class-httpserver)

서버가 요청을 받을 때 발생합니다.

`http.server.response.created`

- `request` [\<http.IncomingMessage\>](/ko/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/ko/nodejs/api/http#class-httpserverresponse)

서버가 응답을 생성할 때 발생합니다. 이벤트는 응답이 전송되기 전에 발생합니다.

`http.server.response.finish`

- `request` [\<http.IncomingMessage\>](/ko/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/ko/nodejs/api/http#class-httpserverresponse)
- `socket` [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket)
- `server` [\<http.Server\>](/ko/nodejs/api/http#class-httpserver)

서버가 응답을 보낼 때 발생합니다.


#### 모듈 {#modules}

`module.require.start`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 다음 속성을 포함합니다.
    - `id` - `require()`에 전달된 인수. 모듈 이름.
    - `parentFilename` - require(id)를 시도한 모듈의 이름.
  
 

`require()`가 실행될 때 발생합니다. [`start` 이벤트](/ko/nodejs/api/diagnostics_channel#startevent)를 참조하세요.

`module.require.end`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 다음 속성을 포함합니다.
    - `id` - `require()`에 전달된 인수. 모듈 이름.
    - `parentFilename` - require(id)를 시도한 모듈의 이름.
  
 

`require()` 호출이 반환될 때 발생합니다. [`end` 이벤트](/ko/nodejs/api/diagnostics_channel#endevent)를 참조하세요.

`module.require.error`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 다음 속성을 포함합니다.
    - `id` - `require()`에 전달된 인수. 모듈 이름.
    - `parentFilename` - require(id)를 시도한 모듈의 이름.
  
 
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`require()`가 오류를 throw할 때 발생합니다. [`error` 이벤트](/ko/nodejs/api/diagnostics_channel#errorevent)를 참조하세요.

`module.import.asyncStart`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 다음 속성을 포함합니다.
    - `id` - `import()`에 전달된 인수. 모듈 이름.
    - `parentURL` - import(id)를 시도한 모듈의 URL 객체.
  
 

`import()`가 호출될 때 발생합니다. [`asyncStart` 이벤트](/ko/nodejs/api/diagnostics_channel#asyncstartevent)를 참조하세요.

`module.import.asyncEnd`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 다음 속성을 포함합니다.
    - `id` - `import()`에 전달된 인수. 모듈 이름.
    - `parentURL` - import(id)를 시도한 모듈의 URL 객체.
  
 

`import()`가 완료되었을 때 발생합니다. [`asyncEnd` 이벤트](/ko/nodejs/api/diagnostics_channel#asyncendevent)를 참조하세요.

`module.import.error`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 다음 속성을 포함합니다.
    - `id` - `import()`에 전달된 인수. 모듈 이름.
    - `parentURL` - import(id)를 시도한 모듈의 URL 객체.
  
 
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`import()`가 오류를 throw할 때 발생합니다. [`error` 이벤트](/ko/nodejs/api/diagnostics_channel#errorevent)를 참조하세요.


#### NET {#net}

`net.client.socket`

- `socket` [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket)

새로운 TCP 또는 파이프 클라이언트 소켓이 생성될 때 발생합니다.

`net.server.socket`

- `socket` [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket)

새로운 TCP 또는 파이프 연결이 수신될 때 발생합니다.

`tracing:net.server.listen:asyncStart`

- `server` [\<net.Server\>](/ko/nodejs/api/net#class-netserver)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[`net.Server.listen()`](/ko/nodejs/api/net#serverlisten)이 호출될 때, 포트 또는 파이프가 실제로 설정되기 전에 발생합니다.

`tracing:net.server.listen:asyncEnd`

- `server` [\<net.Server\>](/ko/nodejs/api/net#class-netserver)

[`net.Server.listen()`](/ko/nodejs/api/net#serverlisten)이 완료되어 서버가 연결을 수락할 준비가 되었을 때 발생합니다.

`tracing:net.server.listen:error`

- `server` [\<net.Server\>](/ko/nodejs/api/net#class-netserver)
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

[`net.Server.listen()`](/ko/nodejs/api/net#serverlisten)이 오류를 반환할 때 발생합니다.

#### UDP {#udp}

`udp.socket`

- `socket` [\<dgram.Socket\>](/ko/nodejs/api/dgram#class-dgramsocket)

새로운 UDP 소켓이 생성될 때 발생합니다.

#### Process {#process}

**추가된 버전: v16.18.0**

`child_process`

- `process` [\<ChildProcess\>](/ko/nodejs/api/child_process#class-childprocess)

새로운 프로세스가 생성될 때 발생합니다.

#### Worker Thread {#worker-thread}

**추가된 버전: v16.18.0**

`worker_threads`

- `worker` [`Worker`](/ko/nodejs/api/worker_threads#class-worker)

새로운 스레드가 생성될 때 발생합니다.

