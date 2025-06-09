---
title: Node.js HTTP 모듈 문서
description: Node.js의 공식 HTTP 모듈 문서로, HTTP 서버와 클라이언트를 만드는 방법, 요청과 응답을 처리하는 방법, 그리고 다양한 HTTP 메소드와 헤더를 관리하는 방법을 자세히 설명합니다.
head:
  - - meta
    - name: og:title
      content: Node.js HTTP 모듈 문서 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 공식 HTTP 모듈 문서로, HTTP 서버와 클라이언트를 만드는 방법, 요청과 응답을 처리하는 방법, 그리고 다양한 HTTP 메소드와 헤더를 관리하는 방법을 자세히 설명합니다.
  - - meta
    - name: twitter:title
      content: Node.js HTTP 모듈 문서 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 공식 HTTP 모듈 문서로, HTTP 서버와 클라이언트를 만드는 방법, 요청과 응답을 처리하는 방법, 그리고 다양한 HTTP 메소드와 헤더를 관리하는 방법을 자세히 설명합니다.
---


# HTTP {#http}

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

**소스 코드:** [lib/http.js](https://github.com/nodejs/node/blob/v23.5.0/lib/http.js)

이 모듈은 클라이언트와 서버를 모두 포함하며, `require('node:http')` (CommonJS) 또는 `import * as http from 'node:http'` (ES 모듈)을 통해 가져올 수 있습니다.

Node.js의 HTTP 인터페이스는 기존에 사용하기 어려웠던 프로토콜의 많은 기능을 지원하도록 설계되었습니다. 특히 크고 청크 인코딩될 수 있는 메시지를 지원합니다. 이 인터페이스는 전체 요청 또는 응답을 버퍼링하지 않도록 주의하여 사용자가 데이터를 스트리밍할 수 있도록 합니다.

HTTP 메시지 헤더는 다음과 같은 객체로 표현됩니다.

```json [JSON]
{ "content-length": "123",
  "content-type": "text/plain",
  "connection": "keep-alive",
  "host": "example.com",
  "accept": "*/*" }
```
키는 소문자로 표시됩니다. 값은 수정되지 않습니다.

가능한 모든 HTTP 애플리케이션을 지원하기 위해 Node.js HTTP API는 매우 낮은 수준입니다. 스트림 처리 및 메시지 파싱만 처리합니다. 메시지를 헤더와 본문으로 파싱하지만 실제 헤더나 본문을 파싱하지는 않습니다.

중복 헤더 처리 방법에 대한 자세한 내용은 [`message.headers`](/ko/nodejs/api/http#messageheaders)를 참조하십시오.

수신된 원시 헤더는 `rawHeaders` 속성에 유지되며, 이는 `[key, value, key2, value2, ...]`의 배열입니다. 예를 들어 이전 메시지 헤더 객체는 다음과 같은 `rawHeaders` 목록을 가질 수 있습니다.

```js [ESM]
[ 'ConTent-Length', '123456',
  'content-LENGTH', '123',
  'content-type', 'text/plain',
  'CONNECTION', 'keep-alive',
  'Host', 'example.com',
  'accepT', '*/*' ]
```
## 클래스: `http.Agent` {#class-httpagent}

**추가된 버전: v0.3.4**

`Agent`는 HTTP 클라이언트에 대한 연결 유지 및 재사용을 관리하는 역할을 합니다. 주어진 호스트와 포트에 대한 보류 중인 요청의 큐를 유지 관리하고, 큐가 비워질 때까지 각 요청에 대해 단일 소켓 연결을 재사용합니다. 큐가 비워지면 소켓은 제거되거나 동일한 호스트와 포트에 대한 요청에 다시 사용될 수 있도록 풀에 저장됩니다. 제거되는지 풀에 저장되는지는 `keepAlive` [옵션](/ko/nodejs/api/http#new-agentoptions)에 따라 달라집니다.

풀링된 연결은 TCP Keep-Alive가 활성화되어 있지만 서버는 유휴 연결을 닫을 수 있으며, 이 경우 풀에서 제거되고 해당 호스트와 포트에 대한 새 HTTP 요청이 발생하면 새 연결이 생성됩니다. 서버는 동일한 연결을 통해 여러 요청을 허용하지 않을 수도 있으며, 이 경우 각 요청에 대해 연결을 다시 만들어야 하며 풀링할 수 없습니다. `Agent`는 해당 서버에 대한 요청을 계속 수행하지만 각 요청은 새 연결을 통해 발생합니다.

클라이언트 또는 서버에서 연결을 닫으면 풀에서 제거됩니다. 풀의 사용되지 않은 모든 소켓은 unref되어 미해결 요청이 없을 때 Node.js 프로세스가 실행되지 않도록 합니다. (참조: [`socket.unref()`](/ko/nodejs/api/net#socketunref)).

사용하지 않을 때는 `Agent` 인스턴스를 [`destroy()`](/ko/nodejs/api/http#agentdestroy)하는 것이 좋습니다. 사용되지 않은 소켓은 OS 리소스를 소비하기 때문입니다.

소켓은 소켓이 `'close'` 이벤트 또는 `'agentRemove'` 이벤트를 발생시키면 에이전트에서 제거됩니다. 에이전트에 유지하지 않고 하나의 HTTP 요청을 오랫동안 열어 두려는 경우 다음과 같이 할 수 있습니다.

```js [ESM]
http.get(options, (res) => {
  // Do stuff
}).on('socket', (socket) => {
  socket.emit('agentRemove');
});
```
에이전트는 개별 요청에도 사용할 수 있습니다. `http.get()` 또는 `http.request()` 함수에 옵션으로 `{agent: false}`를 제공하면 기본 옵션이 있는 일회성 사용 `Agent`가 클라이언트 연결에 사용됩니다.

`agent:false`:

```js [ESM]
http.get({
  hostname: 'localhost',
  port: 80,
  path: '/',
  agent: false,  // 이 요청에 대해서만 새 에이전트 생성
}, (res) => {
  // 응답으로 작업 수행
});
```

### `new Agent([options])` {#new-agentoptions}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.6.0, v14.17.0 | 기본 스케줄링을 'fifo'에서 'lifo'로 변경합니다. |
| v14.5.0, v12.20.0 | 자유 소켓 스케줄링 전략을 지정하는 `scheduling` 옵션을 추가합니다. |
| v14.5.0, v12.19.0 | 에이전트 생성자에 `maxTotalSockets` 옵션을 추가합니다. |
| v0.3.4 | 추가됨: v0.3.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 에이전트에 설정할 구성 가능한 옵션 세트입니다. 다음 필드를 가질 수 있습니다.
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 미해결 요청이 없더라도 소켓을 유지하여 TCP 연결을 다시 설정하지 않고도 향후 요청에 사용할 수 있도록 합니다. `Connection` 헤더의 `keep-alive` 값과 혼동하지 마십시오. `Connection` 헤더가 명시적으로 지정되거나 `keepAlive` 및 `maxSockets` 옵션이 각각 `false` 및 `Infinity`로 설정된 경우를 제외하고 에이전트를 사용할 때 `Connection: keep-alive` 헤더가 항상 전송됩니다. 이 경우 `Connection: close`가 사용됩니다. **기본값:** `false`.
    - `keepAliveMsecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `keepAlive` 옵션을 사용할 때 TCP Keep-Alive 패킷의 [초기 지연](/ko/nodejs/api/net#socketsetkeepaliveenable-initialdelay)을 지정합니다. `keepAlive` 옵션이 `false` 또는 `undefined`인 경우 무시됩니다. **기본값:** `1000`.
    - `maxSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 호스트당 허용할 최대 소켓 수입니다. 동일한 호스트가 여러 개의 동시 연결을 여는 경우 각 요청은 `maxSockets` 값에 도달할 때까지 새 소켓을 사용합니다. 호스트가 `maxSockets`보다 많은 연결을 열려고 하면 추가 요청이 보류 중인 요청 큐에 들어가고 기존 연결이 종료되면 활성 연결 상태가 됩니다. 이렇게 하면 주어진 호스트에서 특정 시점에 최대 `maxSockets`개의 활성 연결이 있는지 확인합니다. **기본값:** `Infinity`.
    - `maxTotalSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 모든 호스트에 대해 총 허용되는 최대 소켓 수입니다. 각 요청은 최대값에 도달할 때까지 새 소켓을 사용합니다. **기본값:** `Infinity`.
    - `maxFreeSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 유휴 상태로 유지할 호스트당 최대 소켓 수입니다. `keepAlive`가 `true`로 설정된 경우에만 관련됩니다. **기본값:** `256`.
    - `scheduling` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 사용할 다음 자유 소켓을 선택할 때 적용할 스케줄링 전략입니다. `'fifo'` 또는 `'lifo'`일 수 있습니다. 두 스케줄링 전략의 주요 차이점은 `'lifo'`는 가장 최근에 사용한 소켓을 선택하는 반면 `'fifo'`는 가장 최근에 사용하지 않은 소켓을 선택한다는 것입니다. 초당 요청률이 낮은 경우 `'lifo'` 스케줄링은 비활성으로 인해 서버에서 닫았을 수 있는 소켓을 선택할 위험을 줄입니다. 초당 요청률이 높은 경우 `'fifo'` 스케줄링은 열린 소켓 수를 최대화하는 반면 `'lifo'` 스케줄링은 가능한 한 낮게 유지합니다. **기본값:** `'lifo'`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 밀리초 단위의 소켓 시간 초과입니다. 소켓이 생성될 때 시간 초과를 설정합니다.
  
 

[`socket.connect()`](/ko/nodejs/api/net#socketconnectoptions-connectlistener)의 `options`도 지원됩니다.

이러한 항목을 구성하려면 사용자 지정 [`http.Agent`](/ko/nodejs/api/http#class-httpagent) 인스턴스를 만들어야 합니다.



::: code-group
```js [ESM]
import { Agent, request } from 'node:http';
const keepAliveAgent = new Agent({ keepAlive: true });
options.agent = keepAliveAgent;
request(options, onResponseCallback);
```

```js [CJS]
const http = require('node:http');
const keepAliveAgent = new http.Agent({ keepAlive: true });
options.agent = keepAliveAgent;
http.request(options, onResponseCallback);
```
:::


### `agent.createConnection(options[, callback])` {#agentcreateconnectionoptions-callback}

**추가된 버전: v0.11.4**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 연결 세부 정보를 포함하는 옵션입니다. 옵션 형식은 [`net.createConnection()`](/ko/nodejs/api/net#netcreateconnectionoptions-connectlistener)을 확인하세요.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 생성된 소켓을 수신하는 콜백 함수입니다.
- 반환: [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)

HTTP 요청에 사용할 소켓/스트림을 생성합니다.

기본적으로 이 함수는 [`net.createConnection()`](/ko/nodejs/api/net#netcreateconnectionoptions-connectlistener)과 동일합니다. 그러나 사용자 정의 에이전트는 더 큰 유연성이 필요한 경우 이 메서드를 재정의할 수 있습니다.

소켓/스트림은 이 함수에서 소켓/스트림을 반환하거나 소켓/스트림을 `callback`에 전달하는 두 가지 방법 중 하나로 제공할 수 있습니다.

이 메서드는 사용자가 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 이외의 소켓 유형을 지정하지 않는 한, [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)의 하위 클래스인 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 클래스의 인스턴스를 반환합니다.

`callback`의 서명은 `(err, stream)`입니다.

### `agent.keepSocketAlive(socket)` {#agentkeepsocketalivesocket}

**추가된 버전: v8.1.0**

- `socket` [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)

`socket`이 요청에서 분리되어 `Agent`에 의해 유지될 수 있을 때 호출됩니다. 기본 동작은 다음과 같습니다.

```js [ESM]
socket.setKeepAlive(true, this.keepAliveMsecs);
socket.unref();
return true;
```

이 메서드는 특정 `Agent` 하위 클래스에서 재정의할 수 있습니다. 이 메서드가 falsy 값을 반환하면 소켓은 다음 요청에 사용하기 위해 유지하는 대신 파괴됩니다.

`socket` 인수는 [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)의 하위 클래스인 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket)의 인스턴스일 수 있습니다.

### `agent.reuseSocket(socket, request)` {#agentreusesocketsocket-request}

**추가된 버전: v8.1.0**

- `socket` [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)
- `request` [\<http.ClientRequest\>](/ko/nodejs/api/http#class-httpclientrequest)

keep-alive 옵션으로 인해 유지된 후 `socket`이 `request`에 연결될 때 호출됩니다. 기본 동작은 다음과 같습니다.

```js [ESM]
socket.ref();
```

이 메서드는 특정 `Agent` 하위 클래스에서 재정의할 수 있습니다.

`socket` 인수는 [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)의 하위 클래스인 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket)의 인스턴스일 수 있습니다.


### `agent.destroy()` {#agentdestroy}

**추가된 버전: v0.11.4**

에이전트가 현재 사용 중인 모든 소켓을 제거합니다.

일반적으로 이 작업은 필요하지 않습니다. 그러나 `keepAlive`가 활성화된 에이전트를 사용하는 경우 더 이상 필요하지 않을 때 에이전트를 명시적으로 종료하는 것이 가장 좋습니다. 그렇지 않으면 서버가 소켓을 종료하기 전에 소켓이 꽤 오랫동안 열려 있을 수 있습니다.

### `agent.freeSockets` {#agentfreesockets}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.0.0 | 속성에 이제 `null` 프로토타입이 있습니다. |
| v0.11.4 | 추가된 버전: v0.11.4 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`keepAlive`가 활성화된 경우 에이전트가 현재 사용하기를 기다리는 소켓 배열을 포함하는 객체입니다. 수정하지 마세요.

`freeSockets` 목록에 있는 소켓은 `'timeout'` 시 자동으로 제거되고 배열에서 제거됩니다.

### `agent.getName([options])` {#agentgetnameoptions}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v17.7.0, v16.15.0 | 이제 `options` 매개변수는 선택 사항입니다. |
| v0.11.4 | 추가된 버전: v0.11.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 이름 생성에 대한 정보를 제공하는 옵션 집합입니다.
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 요청을 발행할 서버의 도메인 이름 또는 IP 주소입니다.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 원격 서버의 포트입니다.
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 요청을 발행할 때 네트워크 연결을 위해 바인딩할 로컬 인터페이스입니다.
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 값이 `undefined`와 같지 않으면 4 또는 6이어야 합니다.

- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

연결을 재사용할 수 있는지 여부를 결정하기 위해 요청 옵션 집합에 대한 고유한 이름을 가져옵니다. HTTP 에이전트의 경우 이는 `host:port:localAddress` 또는 `host:port:localAddress:family`를 반환합니다. HTTPS 에이전트의 경우 이름에는 소켓 재사용성을 결정하는 CA, 인증서, 암호 및 기타 HTTPS/TLS 관련 옵션이 포함됩니다.


### `agent.maxFreeSockets` {#agentmaxfreesockets}

**추가된 버전: v0.11.7**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

기본적으로 256으로 설정됩니다. `keepAlive`가 활성화된 에이전트의 경우, 이것은 자유 상태로 열린 상태로 유지될 소켓의 최대 수를 설정합니다.

### `agent.maxSockets` {#agentmaxsockets}

**추가된 버전: v0.3.6**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

기본적으로 `Infinity`로 설정됩니다. 에이전트가 원점당 열 수 있는 동시 소켓 수를 결정합니다. 원점은 [`agent.getName()`](/ko/nodejs/api/http#agentgetnameoptions)의 반환 값입니다.

### `agent.maxTotalSockets` {#agentmaxtotalsockets}

**추가된 버전: v14.5.0, v12.19.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

기본적으로 `Infinity`로 설정됩니다. 에이전트가 열 수 있는 동시 소켓 수를 결정합니다. `maxSockets`와 달리 이 매개변수는 모든 원점에 적용됩니다.

### `agent.requests` {#agentrequests}


::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v16.0.0 | 이제 속성에 `null` 프로토타입이 있습니다. |
| v0.5.9 | 추가된 버전: v0.5.9 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

소켓에 아직 할당되지 않은 요청의 큐를 포함하는 객체입니다. 수정하지 마십시오.

### `agent.sockets` {#agentsockets}


::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v16.0.0 | 이제 속성에 `null` 프로토타입이 있습니다. |
| v0.3.6 | 추가된 버전: v0.3.6 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

에이전트가 현재 사용 중인 소켓의 배열을 포함하는 객체입니다. 수정하지 마십시오.

## 클래스: `http.ClientRequest` {#class-httpclientrequest}

**추가된 버전: v0.1.17**

- 확장: [\<http.OutgoingMessage\>](/ko/nodejs/api/http#class-httpoutgoingmessage)

이 객체는 내부적으로 생성되어 [`http.request()`](/ko/nodejs/api/http#httprequestoptions-callback)에서 반환됩니다. 헤더가 이미 큐에 추가된 *진행 중인* 요청을 나타냅니다. 헤더는 [`setHeader(name, value)`](/ko/nodejs/api/http#requestsetheadername-value), [`getHeader(name)`](/ko/nodejs/api/http#requestgetheadername), [`removeHeader(name)`](/ko/nodejs/api/http#requestremoveheadername) API를 사용하여 여전히 변경할 수 있습니다. 실제 헤더는 첫 번째 데이터 청크와 함께 전송되거나 [`request.end()`](/ko/nodejs/api/http#requestenddata-encoding-callback)를 호출할 때 전송됩니다.

응답을 받으려면 요청 객체에 [`'response'`](/ko/nodejs/api/http#event-response)에 대한 리스너를 추가합니다. 응답 헤더가 수신되면 요청 객체에서 [`'response'`](/ko/nodejs/api/http#event-response)가 발생합니다. [`'response'`](/ko/nodejs/api/http#event-response) 이벤트는 [`http.IncomingMessage`](/ko/nodejs/api/http#class-httpincomingmessage)의 인스턴스인 하나의 인수로 실행됩니다.

[`'response'`](/ko/nodejs/api/http#event-response) 이벤트 중에 응답 객체에 리스너를 추가할 수 있습니다. 특히 `'data'` 이벤트를 수신하기 위해 추가할 수 있습니다.

[`'response'`](/ko/nodejs/api/http#event-response) 핸들러가 추가되지 않으면 응답이 완전히 삭제됩니다. 그러나 [`'response'`](/ko/nodejs/api/http#event-response) 이벤트 핸들러가 추가되면 `'readable'` 이벤트가 있을 때마다 `response.read()`를 호출하거나 `'data'` 핸들러를 추가하거나 `.resume()` 메서드를 호출하여 응답 객체의 데이터를 **반드시** 소비해야 합니다. 데이터가 소비될 때까지 `'end'` 이벤트가 발생하지 않습니다. 또한 데이터를 읽을 때까지 메모리를 소비하여 결국 'process out of memory' 오류로 이어질 수 있습니다.

이전 버전과의 호환성을 위해 `res`는 `'error'` 리스너가 등록된 경우에만 `'error'`를 발생시킵니다.

응답 본문 크기를 제한하려면 `Content-Length` 헤더를 설정하십시오. [`response.strictContentLength`](/ko/nodejs/api/http#responsestrictcontentlength)가 `true`로 설정된 경우 `Content-Length` 헤더 값과 일치하지 않으면 `Error`가 발생하며 `code:` [`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`](/ko/nodejs/api/errors#err_http_content_length_mismatch)로 식별됩니다.

`Content-Length` 값은 문자가 아닌 바이트 단위여야 합니다. [`Buffer.byteLength()`](/ko/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding)를 사용하여 바이트 단위로 본문의 길이를 확인하십시오.


### Event: `'abort'` {#event-abort}

**Added in: v1.4.1**

**Deprecated since: v17.0.0, v16.12.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ko/nodejs/api/documentation#stability-index) [Stability: 0](/ko/nodejs/api/documentation#stability-index) - 지원 중단됨. 대신 `'close'` 이벤트를 수신하세요.
:::

클라이언트에서 요청이 중단되었을 때 발생합니다. 이 이벤트는 `abort()`를 처음 호출할 때만 발생합니다.

### Event: `'close'` {#event-close}

**Added in: v0.5.4**

요청이 완료되었거나 기본 연결이 응답 완료 전에 조기에 종료되었음을 나타냅니다.

### Event: `'connect'` {#event-connect}

**Added in: v0.7.0**

- `response` [\<http.IncomingMessage\>](/ko/nodejs/api/http#class-httpincomingmessage)
- `socket` [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)
- `head` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

서버가 `CONNECT` 메서드로 요청에 응답할 때마다 발생합니다. 이 이벤트를 수신하지 않으면 `CONNECT` 메서드를 수신하는 클라이언트는 연결이 종료됩니다.

이 이벤트는 사용자가 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 이외의 소켓 유형을 지정하지 않는 한 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 클래스, [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)의 하위 클래스의 인스턴스가 전달되도록 보장됩니다.

`'connect'` 이벤트를 수신하는 방법을 보여주는 클라이언트 및 서버 쌍:

::: code-group
```js [ESM]
import { createServer, request } from 'node:http';
import { connect } from 'node:net';
import { URL } from 'node:url';

// HTTP 터널링 프록시 생성
const proxy = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // 원본 서버에 연결
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// 프록시 실행 중
proxy.listen(1337, '127.0.0.1', () => {

  // 터널링 프록시에 요청
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80',
  };

  const req = request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('연결되었습니다!');

    // HTTP 터널을 통해 요청
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
```

```js [CJS]
const http = require('node:http');
const net = require('node:net');
const { URL } = require('node:url');

// HTTP 터널링 프록시 생성
const proxy = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // 원본 서버에 연결
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = net.connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// 프록시 실행 중
proxy.listen(1337, '127.0.0.1', () => {

  // 터널링 프록시에 요청
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80',
  };

  const req = http.request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('연결되었습니다!');

    // HTTP 터널을 통해 요청
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
```
:::


### 이벤트: `'continue'` {#event-continue}

**추가된 버전: v0.3.2**

서버가 '100 Continue' HTTP 응답을 보낼 때 발생합니다. 이는 일반적으로 요청에 'Expect: 100-continue'가 포함되어 있기 때문입니다. 이는 클라이언트가 요청 본문을 보내야 한다는 지침입니다.

### 이벤트: `'finish'` {#event-finish}

**추가된 버전: v0.3.6**

요청이 전송되었을 때 발생합니다. 더 구체적으로 말하면, 이 이벤트는 응답 헤더와 본문의 마지막 세그먼트가 네트워크를 통해 전송되도록 운영 체제에 전달되었을 때 발생합니다. 서버가 아직 아무것도 수신했다는 의미는 아닙니다.

### 이벤트: `'information'` {#event-information}

**추가된 버전: v10.0.0**

- `info` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `httpVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `httpVersionMajor` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `httpVersionMinor` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `statusCode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rawHeaders` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

서버가 1xx 중간 응답 (101 업그레이드 제외)을 보낼 때 발생합니다. 이 이벤트의 리스너는 HTTP 버전, 상태 코드, 상태 메시지, 키-값 헤더 객체 및 원시 헤더 이름과 해당 값으로 구성된 배열을 포함하는 객체를 받습니다.

::: code-group
```js [ESM]
import { request } from 'node:http';

const options = {
  host: '127.0.0.1',
  port: 8080,
  path: '/length_request',
};

// Make a request
const req = request(options);
req.end();

req.on('information', (info) => {
  console.log(`Got information prior to main response: ${info.statusCode}`);
});
```

```js [CJS]
const http = require('node:http');

const options = {
  host: '127.0.0.1',
  port: 8080,
  path: '/length_request',
};

// Make a request
const req = http.request(options);
req.end();

req.on('information', (info) => {
  console.log(`Got information prior to main response: ${info.statusCode}`);
});
```
:::

101 업그레이드 상태는 웹 소켓, 인플레이스 TLS 업그레이드 또는 HTTP 2.0과 같은 기존 HTTP 요청/응답 체인에서 벗어나기 때문에 이 이벤트를 발생시키지 않습니다. 101 업그레이드 알림을 받으려면 대신 [`'upgrade'`](/ko/nodejs/api/http#event-upgrade) 이벤트를 수신하십시오.


### 이벤트: `'response'` {#event-response}

**추가된 버전: v0.1.0**

- `response` [\<http.IncomingMessage\>](/ko/nodejs/api/http#class-httpincomingmessage)

이 요청에 대한 응답을 수신할 때 발생합니다. 이 이벤트는 한 번만 발생합니다.

### 이벤트: `'socket'` {#event-socket}

**추가된 버전: v0.5.3**

- `socket` [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)

사용자가 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 이외의 소켓 유형을 지정하지 않는 한, 이 이벤트는 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 클래스의 인스턴스인 [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)의 서브클래스에 전달되도록 보장됩니다.

### 이벤트: `'timeout'` {#event-timeout}

**추가된 버전: v0.7.8**

기본 소켓이 비활성으로 인해 시간 초과될 때 발생합니다. 이는 소켓이 유휴 상태였음을 알리는 것뿐입니다. 요청은 수동으로 파기해야 합니다.

참고: [`request.setTimeout()`](/ko/nodejs/api/http#requestsettimeouttimeout-callback).

### 이벤트: `'upgrade'` {#event-upgrade}

**추가된 버전: v0.1.94**

- `response` [\<http.IncomingMessage\>](/ko/nodejs/api/http#class-httpincomingmessage)
- `socket` [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)
- `head` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

서버가 업그레이드를 통해 요청에 응답할 때마다 발생합니다. 이 이벤트가 수신 대기되지 않고 응답 상태 코드가 101 Switching Protocols인 경우 업그레이드 헤더를 수신하는 클라이언트는 연결이 닫힙니다.

사용자가 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 이외의 소켓 유형을 지정하지 않는 한, 이 이벤트는 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 클래스의 인스턴스인 [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)의 서브클래스에 전달되도록 보장됩니다.

`'upgrade'` 이벤트를 수신 대기하는 방법을 보여주는 클라이언트 서버 쌍입니다.

::: code-group
```js [ESM]
import http from 'node:http';
import process from 'node:process';

// HTTP 서버 생성
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
server.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  socket.pipe(socket); // echo back
});

// 이제 서버가 실행 중입니다.
server.listen(1337, '127.0.0.1', () => {

  // 요청 만들기
  const options = {
    port: 1337,
    host: '127.0.0.1',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
    },
  };

  const req = http.request(options);
  req.end();

  req.on('upgrade', (res, socket, upgradeHead) => {
    console.log('got upgraded!');
    socket.end();
    process.exit(0);
  });
});
```

```js [CJS]
const http = require('node:http');

// HTTP 서버 생성
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
server.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  socket.pipe(socket); // echo back
});

// 이제 서버가 실행 중입니다.
server.listen(1337, '127.0.0.1', () => {

  // 요청 만들기
  const options = {
    port: 1337,
    host: '127.0.0.1',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
    },
  };

  const req = http.request(options);
  req.end();

  req.on('upgrade', (res, socket, upgradeHead) => {
    console.log('got upgraded!');
    socket.end();
    process.exit(0);
  });
});
```
:::


### `request.abort()` {#requestabort}

**추가된 버전: v0.3.8**

**지원 중단된 버전: v14.1.0, v13.14.0**

::: danger [안정성: 0 - 지원 중단됨]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 지원 중단됨: 대신 [`request.destroy()`](/ko/nodejs/api/http#requestdestroyerror)를 사용하세요.
:::

요청을 중단하는 것으로 표시합니다. 이를 호출하면 응답의 나머지 데이터가 삭제되고 소켓이 파괴됩니다.

### `request.aborted` {#requestaborted}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v17.0.0, v16.12.0 | 지원 중단된 버전: v17.0.0, v16.12.0 |
| v11.0.0 | `aborted` 속성이 더 이상 타임스탬프 숫자가 아닙니다. |
| v0.11.14 | 추가된 버전: v0.11.14 |
:::

::: danger [안정성: 0 - 지원 중단됨]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 지원 중단됨. 대신 [`request.destroyed`](/ko/nodejs/api/http#requestdestroyed)를 확인하세요.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

요청이 중단된 경우 `request.aborted` 속성은 `true`가 됩니다.

### `request.connection` {#requestconnection}

**추가된 버전: v0.3.0**

**지원 중단된 버전: v13.0.0**

::: danger [안정성: 0 - 지원 중단됨]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 지원 중단됨. [`request.socket`](/ko/nodejs/api/http#requestsocket)을 사용하세요.
:::

- [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)

[`request.socket`](/ko/nodejs/api/http#requestsocket)을 참조하세요.

### `request.cork()` {#requestcork}

**추가된 버전: v13.2.0, v12.16.0**

[`writable.cork()`](/ko/nodejs/api/stream#writablecork)을 참조하세요.

### `request.end([data[, encoding]][, callback])` {#requestenddata-encoding-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | `data` 매개변수가 이제 `Uint8Array`일 수 있습니다. |
| v10.0.0 | 이제 이 메서드는 `ClientRequest`에 대한 참조를 반환합니다. |
| v0.1.90 | 추가된 버전: v0.1.90 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

요청 전송을 완료합니다. 본문의 일부가 전송되지 않은 경우 스트림으로 플러시됩니다. 요청이 청크된 경우 종료 `'0\r\n\r\n'`이 전송됩니다.

`data`가 지정된 경우 [`request.write(data, encoding)`](/ko/nodejs/api/http#requestwritechunk-encoding-callback)을 호출한 다음 `request.end(callback)`을 호출하는 것과 같습니다.

`callback`이 지정된 경우 요청 스트림이 완료되면 호출됩니다.


### `request.destroy([error])` {#requestdestroyerror}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v14.5.0 | 함수가 다른 Readable 스트림과의 일관성을 위해 `this`를 반환합니다. |
| v0.3.0 | 추가된 버전: v0.3.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 선택 사항. `'error'` 이벤트와 함께 발생할 오류입니다.
- 반환: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

요청을 파괴합니다. 선택적으로 `'error'` 이벤트를 발생시키고 `'close'` 이벤트를 발생시킵니다. 이 함수를 호출하면 응답에 남아있는 데이터가 삭제되고 소켓이 파괴됩니다.

자세한 내용은 [`writable.destroy()`](/ko/nodejs/api/stream#writabledestroyerror)를 참조하세요.

#### `request.destroyed` {#requestdestroyed}

**추가된 버전: v14.1.0, v13.14.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`request.destroy()`](/ko/nodejs/api/http#requestdestroyerror)가 호출된 후 `true`입니다.

자세한 내용은 [`writable.destroyed`](/ko/nodejs/api/stream#writabledestroyed)를 참조하세요.

### `request.finished` {#requestfinished}

**추가된 버전: v0.0.1**

**지원 중단된 버전: v13.4.0, v12.16.0**

::: danger [안정성: 0 - 지원 중단됨]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 지원 중단됨. [`request.writableEnded`](/ko/nodejs/api/http#requestwritableended)를 사용하세요.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`request.end()`](/ko/nodejs/api/http#requestenddata-encoding-callback)가 호출된 경우 `request.finished` 속성은 `true`가 됩니다. 요청이 [`http.get()`](/ko/nodejs/api/http#httpgetoptions-callback)을 통해 시작된 경우 `request.end()`가 자동으로 호출됩니다.

### `request.flushHeaders()` {#requestflushheaders}

**추가된 버전: v1.6.0**

요청 헤더를 플러시합니다.

효율성을 위해 Node.js는 일반적으로 `request.end()`가 호출되거나 요청 데이터의 첫 번째 청크가 작성될 때까지 요청 헤더를 버퍼링합니다. 그런 다음 요청 헤더와 데이터를 단일 TCP 패킷으로 묶으려고 시도합니다.

이는 일반적으로 바람직하지만 (TCP 왕복을 절약합니다), 첫 번째 데이터가 훨씬 나중에 전송될 때에는 그렇지 않습니다. `request.flushHeaders()`는 최적화를 우회하고 요청을 시작합니다.


### `request.getHeader(name)` {#requestgetheadername}

**추가된 버전: v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

요청의 헤더를 읽습니다. 이름은 대소문자를 구분하지 않습니다. 반환 값의 유형은 [`request.setHeader()`](/ko/nodejs/api/http#requestsetheadername-value)에 제공된 인수에 따라 다릅니다.

```js [ESM]
request.setHeader('content-type', 'text/html');
request.setHeader('Content-Length', Buffer.byteLength(body));
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
const contentType = request.getHeader('Content-Type');
// 'contentType'는 'text/html'입니다.
const contentLength = request.getHeader('Content-Length');
// 'contentLength'는 number 유형입니다.
const cookie = request.getHeader('Cookie');
// 'cookie'는 string[] 유형입니다.
```
### `request.getHeaderNames()` {#requestgetheadernames}

**추가된 버전: v7.7.0**

- 반환: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

현재 발신 헤더의 고유한 이름이 포함된 배열을 반환합니다. 모든 헤더 이름은 소문자입니다.

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getHeaderNames();
// headerNames === ['foo', 'cookie']
```
### `request.getHeaders()` {#requestgetheaders}

**추가된 버전: v7.7.0**

- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

현재 발신 헤더의 얕은 복사본을 반환합니다. 얕은 복사본이 사용되기 때문에 다양한 헤더 관련 http 모듈 메서드를 추가로 호출하지 않고도 배열 값을 변경할 수 있습니다. 반환된 객체의 키는 헤더 이름이고 값은 해당 헤더 값입니다. 모든 헤더 이름은 소문자입니다.

`request.getHeaders()` 메서드에서 반환된 객체는 JavaScript `Object`에서 원형적으로 상속 *되지 않습니다*. 즉, `obj.toString()`, `obj.hasOwnProperty()` 등과 같은 일반적인 `Object` 메서드가 정의되지 않았으며 *작동하지 않습니다*.

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headers = request.getHeaders();
// headers === { foo: 'bar', 'cookie': ['foo=bar', 'bar=baz'] }
```

### `request.getRawHeaderNames()` {#requestgetrawheadernames}

**추가된 버전: v15.13.0, v14.17.0**

- 반환값: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

현재 나가는 원시 헤더의 고유한 이름을 포함하는 배열을 반환합니다. 헤더 이름은 정확한 대소문자가 설정된 상태로 반환됩니다.

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getRawHeaderNames();
// headerNames === ['Foo', 'Set-Cookie']
```
### `request.hasHeader(name)` {#requesthasheadername}

**추가된 버전: v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`name`으로 식별되는 헤더가 현재 나가는 헤더에 설정되어 있으면 `true`를 반환합니다. 헤더 이름 일치는 대소문자를 구분하지 않습니다.

```js [ESM]
const hasContentType = request.hasHeader('content-type');
```
### `request.maxHeadersCount` {#requestmaxheaderscount}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `2000`

최대 응답 헤더 수를 제한합니다. 0으로 설정하면 제한이 적용되지 않습니다.

### `request.path` {#requestpath}

**추가된 버전: v0.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 요청 경로입니다.

### `request.method` {#requestmethod}

**추가된 버전: v0.1.97**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 요청 메서드입니다.

### `request.host` {#requesthost}

**추가된 버전: v14.5.0, v12.19.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 요청 호스트입니다.

### `request.protocol` {#requestprotocol}

**추가된 버전: v14.5.0, v12.19.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 요청 프로토콜입니다.

### `request.removeHeader(name)` {#requestremoveheadername}

**추가된 버전: v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

헤더 객체에 이미 정의된 헤더를 제거합니다.

```js [ESM]
request.removeHeader('Content-Type');
```

### `request.reusedSocket` {#requestreusedsocket}

**추가된 버전: v13.0.0, v12.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 요청이 재사용된 소켓을 통해 전송되었는지 여부.

Keep-Alive가 활성화된 에이전트를 통해 요청을 보내는 경우, 기본 소켓이 재사용될 수 있습니다. 그러나 서버가 불행한 시점에 연결을 닫으면 클라이언트는 'ECONNRESET' 오류가 발생할 수 있습니다.

::: code-group
```js [ESM]
import http from 'node:http';

// 서버는 기본적으로 5초의 Keep-Alive 타임아웃을 갖습니다.
http
  .createServer((req, res) => {
    res.write('hello\n');
    res.end();
  })
  .listen(3000);

setInterval(() => {
  // Keep-Alive 에이전트 적용
  http.get('http://localhost:3000', { agent }, (res) => {
    res.on('data', (data) => {
      // 아무것도 하지 않음
    });
  });
}, 5000); // 5초 간격으로 요청을 보내므로 유휴 시간 초과가 발생하기 쉽습니다.
```

```js [CJS]
const http = require('node:http');

// 서버는 기본적으로 5초의 Keep-Alive 타임아웃을 갖습니다.
http
  .createServer((req, res) => {
    res.write('hello\n');
    res.end();
  })
  .listen(3000);

setInterval(() => {
  // Keep-Alive 에이전트 적용
  http.get('http://localhost:3000', { agent }, (res) => {
    res.on('data', (data) => {
      // 아무것도 하지 않음
    });
  });
}, 5000); // 5초 간격으로 요청을 보내므로 유휴 시간 초과가 발생하기 쉽습니다.
```
:::

요청이 소켓을 재사용했는지 여부를 표시함으로써 자동 오류 재시도를 기반으로 할 수 있습니다.

::: code-group
```js [ESM]
import http from 'node:http';
const agent = new http.Agent({ keepAlive: true });

function retriableRequest() {
  const req = http
    .get('http://localhost:3000', { agent }, (res) => {
      // ...
    })
    .on('error', (err) => {
      // 재시도가 필요한지 확인
      if (req.reusedSocket && err.code === 'ECONNRESET') {
        retriableRequest();
      }
    });
}

retriableRequest();
```

```js [CJS]
const http = require('node:http');
const agent = new http.Agent({ keepAlive: true });

function retriableRequest() {
  const req = http
    .get('http://localhost:3000', { agent }, (res) => {
      // ...
    })
    .on('error', (err) => {
      // 재시도가 필요한지 확인
      if (req.reusedSocket && err.code === 'ECONNRESET') {
        retriableRequest();
      }
    });
}

retriableRequest();
```
:::


### `request.setHeader(name, value)` {#requestsetheadername-value}

**추가된 버전: v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

헤더 객체에 대한 단일 헤더 값을 설정합니다. 보내려는 헤더에 이 헤더가 이미 있는 경우 해당 값이 대체됩니다. 여기에 문자열 배열을 사용하여 동일한 이름으로 여러 헤더를 보낼 수 있습니다. 문자열이 아닌 값은 수정 없이 저장됩니다. 따라서 [`request.getHeader()`](/ko/nodejs/api/http#requestgetheadername)는 문자열이 아닌 값을 반환할 수 있습니다. 그러나 문자열이 아닌 값은 네트워크 전송을 위해 문자열로 변환됩니다.

```js [ESM]
request.setHeader('Content-Type', 'application/json');
```
또는

```js [ESM]
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
```
값이 문자열일 때 `latin1` 인코딩 외부의 문자가 포함되어 있으면 예외가 발생합니다.

값에 UTF-8 문자를 전달해야 하는 경우 [RFC 8187](https://www.rfc-editor.org/rfc/rfc8187.txt) 표준을 사용하여 값을 인코딩하십시오.

```js [ESM]
const filename = 'Rock 🎵.txt';
request.setHeader('Content-Disposition', `attachment; filename*=utf-8''${encodeURIComponent(filename)}`);
```
### `request.setNoDelay([noDelay])` {#requestsetnodelaynodelay}

**추가된 버전: v0.5.9**

- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

소켓이 이 요청에 할당되어 연결되면 [`socket.setNoDelay()`](/ko/nodejs/api/net#socketsetnodelaynodelay)가 호출됩니다.

### `request.setSocketKeepAlive([enable][, initialDelay])` {#requestsetsocketkeepaliveenable-initialdelay}

**추가된 버전: v0.5.9**

- `enable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `initialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

소켓이 이 요청에 할당되어 연결되면 [`socket.setKeepAlive()`](/ko/nodejs/api/net#socketsetkeepaliveenable-initialdelay)가 호출됩니다.


### `request.setTimeout(timeout[, callback])` {#requestsettimeouttimeout-callback}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v9.0.0 | 소켓이 연결될 때만 일관되게 소켓 시간 초과를 설정합니다. |
| v0.5.9 | 추가됨: v0.5.9 |
:::

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 요청 시간이 초과되기 전의 밀리초입니다.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 시간 초과가 발생했을 때 호출할 선택적 함수입니다. `'timeout'` 이벤트에 바인딩하는 것과 같습니다.
- 반환: [\<http.ClientRequest\>](/ko/nodejs/api/http#class-httpclientrequest)

소켓이 이 요청에 할당되고 연결되면 [`socket.setTimeout()`](/ko/nodejs/api/net#socketsettimeouttimeout-callback)이 호출됩니다.

### `request.socket` {#requestsocket}

**추가된 버전: v0.3.0**

- [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)

기본 소켓에 대한 참조입니다. 일반적으로 사용자는 이 속성에 액세스하지 않으려고 합니다. 특히 소켓은 프로토콜 파서가 소켓에 연결되는 방식 때문에 `'readable'` 이벤트를 발생시키지 않습니다.

::: code-group
```js [ESM]
import http from 'node:http';
const options = {
  host: 'www.google.com',
};
const req = http.get(options);
req.end();
req.once('response', (res) => {
  const ip = req.socket.localAddress;
  const port = req.socket.localPort;
  console.log(`Your IP address is ${ip} and your source port is ${port}.`);
  // 응답 객체 사용
});
```

```js [CJS]
const http = require('node:http');
const options = {
  host: 'www.google.com',
};
const req = http.get(options);
req.end();
req.once('response', (res) => {
  const ip = req.socket.localAddress;
  const port = req.socket.localPort;
  console.log(`Your IP address is ${ip} and your source port is ${port}.`);
  // 응답 객체 사용
});
```
:::

이 속성은 사용자가 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 이외의 소켓 유형을 지정하지 않는 한 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 클래스, 즉 [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)의 하위 클래스의 인스턴스임이 보장됩니다.


### `request.uncork()` {#requestuncork}

**Added in: v13.2.0, v12.16.0**

[`writable.uncork()`](/ko/nodejs/api/stream#writableuncork)를 참조하세요.

### `request.writableEnded` {#requestwritableended}

**Added in: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`request.end()`](/ko/nodejs/api/http#requestenddata-encoding-callback)가 호출된 후 `true`입니다. 이 속성은 데이터가 플러시되었는지 여부를 나타내지 않으며, 대신 [`request.writableFinished`](/ko/nodejs/api/http#requestwritablefinished)를 사용하세요.

### `request.writableFinished` {#requestwritablefinished}

**Added in: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

모든 데이터가 기본 시스템으로 플러시된 경우 `true`이며, [`'finish'`](/ko/nodejs/api/http#event-finish) 이벤트가 발생하기 직전에 발생합니다.

### `request.write(chunk[, encoding][, callback])` {#requestwritechunk-encoding-callback}


::: info [History]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | 이제 `chunk` 매개변수가 `Uint8Array`일 수 있습니다. |
| v0.1.29 | Added in: v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

본문의 청크를 보냅니다. 이 메서드는 여러 번 호출할 수 있습니다. `Content-Length`가 설정되지 않은 경우 데이터는 HTTP Chunked 전송 인코딩으로 자동 인코딩되므로 서버는 데이터가 끝나는 시점을 알 수 있습니다. `Transfer-Encoding: chunked` 헤더가 추가됩니다. 요청 전송을 마치려면 [`request.end()`](/ko/nodejs/api/http#requestenddata-encoding-callback)를 호출해야 합니다.

`encoding` 인수는 선택 사항이며 `chunk`가 문자열일 때만 적용됩니다. 기본값은 `'utf8'`입니다.

`callback` 인수는 선택 사항이며 데이터 청크가 플러시될 때 호출되지만 청크가 비어 있지 않은 경우에만 호출됩니다.

전체 데이터가 커널 버퍼로 성공적으로 플러시되면 `true`를 반환합니다. 데이터의 전체 또는 일부가 사용자 메모리에 대기 중인 경우 `false`를 반환합니다. 버퍼가 다시 비워지면 `'drain'`이 발생합니다.

`write` 함수가 빈 문자열 또는 버퍼와 함께 호출되면 아무 것도 수행하지 않고 더 많은 입력을 기다립니다.


## 클래스: `http.Server` {#class-httpserver}

**추가된 버전: v0.1.17**

- 확장: [\<net.Server\>](/ko/nodejs/api/net#class-netserver)

### 이벤트: `'checkContinue'` {#event-checkcontinue}

**추가된 버전: v0.3.0**

- `request` [\<http.IncomingMessage\>](/ko/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/ko/nodejs/api/http#class-httpserverresponse)

HTTP `Expect: 100-continue` 헤더가 포함된 요청을 받을 때마다 발생합니다. 이 이벤트에 대한 리스너가 없으면 서버는 자동으로 적절한 `100 Continue` 응답을 보냅니다.

이 이벤트를 처리하려면 클라이언트가 요청 본문을 계속 보내야 하는 경우 [`response.writeContinue()`](/ko/nodejs/api/http#responsewritecontinue)를 호출하고, 클라이언트가 요청 본문을 계속 보내지 않아야 하는 경우 적절한 HTTP 응답(예: 400 Bad Request)을 생성해야 합니다.

이 이벤트가 발생하고 처리되면 [`'request'`](/ko/nodejs/api/http#event-request) 이벤트는 발생하지 않습니다.

### 이벤트: `'checkExpectation'` {#event-checkexpectation}

**추가된 버전: v5.5.0**

- `request` [\<http.IncomingMessage\>](/ko/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/ko/nodejs/api/http#class-httpserverresponse)

HTTP `Expect` 헤더가 포함된 요청을 받을 때마다 발생하며, 이때 값은 `100-continue`가 아닙니다. 이 이벤트에 대한 리스너가 없으면 서버는 자동으로 적절한 `417 Expectation Failed` 응답을 보냅니다.

이 이벤트가 발생하고 처리되면 [`'request'`](/ko/nodejs/api/http#event-request) 이벤트는 발생하지 않습니다.

### 이벤트: `'clientError'` {#event-clienterror}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.0.0 | HPE_HEADER_OVERFLOW 오류가 발생하면 기본 동작은 431 Request Header Fields Too Large를 반환합니다. |
| v9.4.0 | `rawPacket`은 방금 파싱된 현재 버퍼입니다. 이 버퍼를 `'clientError'` 이벤트의 오류 객체에 추가하면 개발자가 깨진 패킷을 기록할 수 있습니다. |
| v6.0.0 | `'clientError'`에 대한 리스너가 연결되어 있으면 `socket`에서 `.destroy()`를 호출하는 기본 동작이 더 이상 발생하지 않습니다. |
| v0.1.94 | 추가된 버전: v0.1.94 |
:::

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `socket` [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)

클라이언트 연결에서 `'error'` 이벤트가 발생하면 이 이벤트로 전달됩니다. 이 이벤트의 리스너는 기본 소켓을 닫거나 파괴하는 역할을 합니다. 예를 들어, 연결을 갑자기 끊는 대신 사용자 정의 HTTP 응답으로 소켓을 더 부드럽게 닫을 수 있습니다. 리스너가 종료되기 전에 소켓을 **닫거나 파괴해야 합니다**.

이 이벤트는 사용자가 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 이외의 소켓 유형을 지정하지 않는 한 [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)의 하위 클래스인 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 클래스의 인스턴스를 전달하도록 보장됩니다.

기본 동작은 HTTP '400 Bad Request' 또는 [`HPE_HEADER_OVERFLOW`](/ko/nodejs/api/errors#hpe_header_overflow) 오류의 경우 HTTP '431 Request Header Fields Too Large'로 소켓을 닫으려고 시도하는 것입니다. 소켓을 쓸 수 없거나 현재 연결된 [`http.ServerResponse`](/ko/nodejs/api/http#class-httpserverresponse)의 헤더가 전송된 경우 즉시 파괴됩니다.

`socket`은 오류가 발생한 [`net.Socket`](/ko/nodejs/api/net#class-netsocket) 객체입니다.

::: code-group
```js [ESM]
import http from 'node:http';

const server = http.createServer((req, res) => {
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);
```

```js [CJS]
const http = require('node:http');

const server = http.createServer((req, res) => {
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);
```
:::

`'clientError'` 이벤트가 발생하면 `request` 또는 `response` 객체가 없으므로 응답 헤더 및 페이로드를 포함한 모든 HTTP 응답은 *반드시* `socket` 객체에 직접 작성해야 합니다. 응답이 올바른 형식의 HTTP 응답 메시지인지 확인해야 합니다.

`err`은 두 개의 추가 열이 있는 `Error` 인스턴스입니다.

- `bytesParsed`: Node.js가 올바르게 파싱했을 수 있는 요청 패킷의 바이트 수입니다.
- `rawPacket`: 현재 요청의 원시 패킷입니다.

경우에 따라 클라이언트가 이미 응답을 받았거나 소켓이 이미 파괴되었을 수 있습니다(예: `ECONNRESET` 오류의 경우). 소켓에 데이터를 보내기 전에 여전히 쓸 수 있는지 확인하는 것이 좋습니다.

```js [ESM]
server.on('clientError', (err, socket) => {
  if (err.code === 'ECONNRESET' || !socket.writable) {
    return;
  }

  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
```

### 이벤트: `'close'` {#event-close_1}

**추가된 버전: v0.1.4**

서버가 닫힐 때 발생합니다.

### 이벤트: `'connect'` {#event-connect_1}

**추가된 버전: v0.7.0**

- `request` [\<http.IncomingMessage\>](/ko/nodejs/api/http#class-httpincomingmessage) [`'request'`](/ko/nodejs/api/http#event-request) 이벤트와 마찬가지로 HTTP 요청에 대한 인자입니다.
- `socket` [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex) 서버와 클라이언트 간의 네트워크 소켓입니다.
- `head` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 터널링 스트림의 첫 번째 패킷입니다 (비어 있을 수 있습니다).

클라이언트가 HTTP `CONNECT` 메서드를 요청할 때마다 발생합니다. 이 이벤트에 대한 리스너가 없으면 `CONNECT` 메서드를 요청하는 클라이언트의 연결이 닫힙니다.

이 이벤트는 사용자가 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 이외의 소켓 유형을 지정하지 않는 한, [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)의 하위 클래스인 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 클래스의 인스턴스가 전달될 것이 보장됩니다.

이 이벤트가 발생한 후 요청의 소켓에는 `'data'` 이벤트 리스너가 없으므로 해당 소켓에서 서버로 전송되는 데이터를 처리하려면 바인딩해야 합니다.

### 이벤트: `'connection'` {#event-connection}

**추가된 버전: v0.1.0**

- `socket` [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)

새로운 TCP 스트림이 설정될 때 이 이벤트가 발생합니다. `socket`은 일반적으로 [`net.Socket`](/ko/nodejs/api/net#class-netsocket) 유형의 객체입니다. 일반적으로 사용자는 이 이벤트에 접근하지 않으려고 할 것입니다. 특히 소켓은 프로토콜 파서가 소켓에 연결되는 방식 때문에 `'readable'` 이벤트를 발생시키지 않습니다. `socket`은 `request.socket`에서도 접근할 수 있습니다.

이 이벤트는 사용자가 HTTP 서버에 연결을 주입하기 위해 명시적으로 발생시킬 수도 있습니다. 이 경우 모든 [`Duplex`](/ko/nodejs/api/stream#class-streamduplex) 스트림을 전달할 수 있습니다.

여기서 `socket.setTimeout()`이 호출되면 소켓이 요청을 처리했을 때 (만약 `server.keepAliveTimeout`이 0이 아닌 경우) 타임아웃이 `server.keepAliveTimeout`으로 대체됩니다.

이 이벤트는 사용자가 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 이외의 소켓 유형을 지정하지 않는 한, [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)의 하위 클래스인 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 클래스의 인스턴스가 전달될 것이 보장됩니다.


### 이벤트: `'dropRequest'` {#event-droprequest}

**추가된 버전: v18.7.0, v16.17.0**

- `request` [\<http.IncomingMessage\>](/ko/nodejs/api/http#class-httpincomingmessage) [`'request'`](/ko/nodejs/api/http#event-request) 이벤트와 마찬가지로 HTTP 요청에 대한 인수입니다.
- `socket` [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex) 서버와 클라이언트 간의 네트워크 소켓입니다.

소켓의 요청 수가 `server.maxRequestsPerSocket` 임계값에 도달하면 서버는 새 요청을 삭제하고 대신 `'dropRequest'` 이벤트를 발생시킨 다음 클라이언트에 `503`을 보냅니다.

### 이벤트: `'request'` {#event-request}

**추가된 버전: v0.1.0**

- `request` [\<http.IncomingMessage\>](/ko/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/ko/nodejs/api/http#class-httpserverresponse)

요청이 있을 때마다 발생합니다. 연결당 여러 요청이 있을 수 있습니다 (HTTP Keep-Alive 연결의 경우).

### 이벤트: `'upgrade'` {#event-upgrade_1}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 클라이언트가 Upgrade 헤더를 보낼 경우 이 이벤트를 수신하지 않아도 더 이상 소켓이 파괴되지 않습니다. |
| v0.1.94 | 추가된 버전: v0.1.94 |
:::

- `request` [\<http.IncomingMessage\>](/ko/nodejs/api/http#class-httpincomingmessage) [`'request'`](/ko/nodejs/api/http#event-request) 이벤트와 마찬가지로 HTTP 요청에 대한 인수입니다.
- `socket` [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex) 서버와 클라이언트 간의 네트워크 소켓입니다.
- `head` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 업그레이드된 스트림의 첫 번째 패킷입니다 (비어 있을 수 있음).

클라이언트가 HTTP 업그레이드를 요청할 때마다 발생합니다. 이 이벤트를 수신하는 것은 선택 사항이며 클라이언트는 프로토콜 변경을 주장할 수 없습니다.

이 이벤트가 발생한 후 요청의 소켓에는 `'data'` 이벤트 리스너가 없으므로 해당 소켓에서 서버로 전송된 데이터를 처리하려면 바인딩해야 합니다.

사용자가 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 이외의 소켓 유형을 지정하지 않는 한, 이 이벤트는 [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)의 하위 클래스인 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 클래스의 인스턴스를 전달하도록 보장됩니다.


### `server.close([callback])` {#serverclosecallback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 이 메서드는 반환하기 전에 유휴 연결을 닫습니다. |
| v0.1.90 | 추가됨: v0.1.90 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

서버가 새 연결을 수락하지 않도록 중지하고 요청을 보내지 않거나 응답을 기다리지 않는 이 서버에 연결된 모든 연결을 닫습니다. [`net.Server.close()`](/ko/nodejs/api/net#serverclosecallback)를 참조하세요.

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// 10초 후에 서버 닫기
setTimeout(() => {
  server.close(() => {
    console.log('서버가 8000 포트에서 성공적으로 닫혔습니다.');
  });
}, 10000);
```
### `server.closeAllConnections()` {#servercloseallconnections}

**추가됨: v18.2.0**

활성 연결을 포함하여 이 서버에 연결된 모든 설정된 HTTP(S) 연결을 닫습니다. 이 서버에 연결되어 요청을 보내거나 응답을 기다리는 중입니다. 이는 WebSocket 또는 HTTP/2와 같은 다른 프로토콜로 업그레이드된 소켓을 제거 *하지 않습니다*.

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// 10초 후에 서버 닫기
setTimeout(() => {
  server.close(() => {
    console.log('서버가 8000 포트에서 성공적으로 닫혔습니다.');
  });
  // 모든 연결을 닫아 서버가 성공적으로 닫히도록 합니다.
  server.closeAllConnections();
}, 10000);
```
### `server.closeIdleConnections()` {#servercloseidleconnections}

**추가됨: v18.2.0**

요청을 보내지 않거나 응답을 기다리지 않는 이 서버에 연결된 모든 연결을 닫습니다.

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// 10초 후에 서버 닫기
setTimeout(() => {
  server.close(() => {
    console.log('서버가 8000 포트에서 성공적으로 닫혔습니다.');
  });
  // 유휴 연결(예: keep-alive 연결)을 닫습니다. 서버는
  // 남은 활성 연결이 종료되면 닫힙니다.
  server.closeIdleConnections();
}, 10000);
```

### `server.headersTimeout` {#serverheaderstimeout}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.4.0, v18.14.0 | 이제 기본값은 60000(60초) 또는 `requestTimeout` 중 더 작은 값으로 설정됩니다. |
| v11.3.0, v10.14.0 | 추가됨: v11.3.0, v10.14.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** [`server.requestTimeout`](/ko/nodejs/api/http#serverrequesttimeout) 또는 `60000` 중 더 작은 값.

파서가 완전한 HTTP 헤더를 수신하기 위해 대기하는 시간을 제한합니다.

시간 초과되면 서버는 요청을 요청 리스너로 전달하지 않고 상태 408로 응답한 다음 연결을 닫습니다.

서버가 앞에 역방향 프록시 없이 배포되는 경우 잠재적인 서비스 거부 공격으로부터 보호하려면 0이 아닌 값(예: 120초)으로 설정해야 합니다.

### `server.listen()` {#serverlisten}

연결을 수신 대기하는 HTTP 서버를 시작합니다. 이 메서드는 [`net.Server`](/ko/nodejs/api/net#class-netserver)의 [`server.listen()`](/ko/nodejs/api/net#serverlisten)과 동일합니다.

### `server.listening` {#serverlistening}

**추가됨: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 서버가 연결을 수신 대기 중인지 여부를 나타냅니다.

### `server.maxHeadersCount` {#servermaxheaderscount}

**추가됨: v0.7.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `2000`

최대 수신 헤더 수를 제한합니다. 0으로 설정하면 제한이 적용되지 않습니다.

### `server.requestTimeout` {#serverrequesttimeout}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 기본 요청 시간 초과가 시간 초과 없음에서 300초(5분)로 변경되었습니다. |
| v14.11.0 | 추가됨: v14.11.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `300000`

클라이언트로부터 전체 요청을 수신하기 위한 시간 초과 값을 밀리초 단위로 설정합니다.

시간 초과되면 서버는 요청을 요청 리스너로 전달하지 않고 상태 408로 응답한 다음 연결을 닫습니다.

서버가 앞에 역방향 프록시 없이 배포되는 경우 잠재적인 서비스 거부 공격으로부터 보호하려면 0이 아닌 값(예: 120초)으로 설정해야 합니다.


### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.0.0 | 기본 제한 시간은 120초에서 0(제한 시간 없음)으로 변경되었습니다. |
| v0.9.12 | v0.9.12에 추가됨 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** 0 (제한 시간 없음)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<http.Server\>](/ko/nodejs/api/http#class-httpserver)

소켓의 제한 시간 값을 설정하고 제한 시간이 발생하면 소켓을 인수로 전달하여 Server 객체에서 `'timeout'` 이벤트를 발생시킵니다.

Server 객체에 `'timeout'` 이벤트 리스너가 있으면 제한 시간이 초과된 소켓을 인수로 호출됩니다.

기본적으로 Server는 소켓 제한 시간을 초과하지 않습니다. 그러나 콜백이 Server의 `'timeout'` 이벤트에 할당되면 제한 시간을 명시적으로 처리해야 합니다.

### `server.maxRequestsPerSocket` {#servermaxrequestspersocket}

**v16.10.0에 추가됨**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 소켓당 요청 수. **기본값:** 0 (제한 없음)

keep alive 연결을 닫기 전에 소켓이 처리할 수 있는 최대 요청 수입니다.

`0` 값은 제한을 비활성화합니다.

제한에 도달하면 `Connection` 헤더 값을 `close`로 설정하지만 실제로 연결을 닫지는 않습니다. 제한에 도달한 후 전송된 후속 요청은 `503 Service Unavailable` 응답을 받습니다.

### `server.timeout` {#servertimeout}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.0.0 | 기본 제한 시간은 120초에서 0(제한 시간 없음)으로 변경되었습니다. |
| v0.9.12 | v0.9.12에 추가됨 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 제한 시간(밀리초)입니다. **기본값:** 0 (제한 시간 없음)

소켓이 시간 초과된 것으로 간주되기 전의 비활성 시간(밀리초)입니다.

`0` 값은 들어오는 연결에 대한 시간 초과 동작을 비활성화합니다.

소켓 시간 초과 로직은 연결 시 설정되므로 이 값을 변경하면 서버에 대한 새 연결에만 영향을 미치고 기존 연결에는 영향을 미치지 않습니다.


### `server.keepAliveTimeout` {#serverkeepalivetimeout}

**Added in: v8.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 밀리초 단위의 시간 초과. **기본값:** `5000` (5초).

서버가 마지막 응답을 작성한 후 소켓이 파괴되기 전에 추가로 들어오는 데이터를 기다려야 하는 비활성 상태의 밀리초 수입니다. 서버가 keep-alive 시간 초과가 발생하기 전에 새 데이터를 받으면 일반적인 비활성 시간 초과(예: [`server.timeout`](/ko/nodejs/api/http#servertimeout))를 재설정합니다.

`0` 값은 들어오는 연결에서 keep-alive 시간 초과 동작을 비활성화합니다. `0` 값은 http 서버가 keep-alive 시간 초과가 없었던 Node.js 8.0.0 이전 버전과 유사하게 동작하도록 만듭니다.

소켓 시간 초과 로직은 연결 시 설정되므로 이 값을 변경하면 기존 연결이 아닌 서버에 대한 새 연결에만 영향을 미칩니다.

### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Added in: v20.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

[`server.close()`](/ko/nodejs/api/http#serverclosecallback)를 호출하고 서버가 닫히면 이행되는 Promise를 반환합니다.

## Class: `http.ServerResponse` {#class-httpserverresponse}

**Added in: v0.1.17**

- Extends: [\<http.OutgoingMessage\>](/ko/nodejs/api/http#class-httpoutgoingmessage)

이 객체는 사용자가 아닌 HTTP 서버에 의해 내부적으로 생성됩니다. [`'request'`](/ko/nodejs/api/http#event-request) 이벤트에 대한 두 번째 매개변수로 전달됩니다.

### Event: `'close'` {#event-close_2}

**Added in: v0.6.7**

응답이 완료되었거나 기본 연결이 응답 완료 전에 조기에 종료되었음을 나타냅니다.

### Event: `'finish'` {#event-finish_1}

**Added in: v0.3.6**

응답이 전송되었을 때 발생합니다. 더 구체적으로 말하면 응답 헤더와 본문의 마지막 세그먼트가 네트워크를 통해 전송하기 위해 운영 체제로 전달되었을 때 이 이벤트가 발생합니다. 클라이언트가 아직 아무것도 수신하지 않았음을 의미하지는 않습니다.


### `response.addTrailers(headers)` {#responseaddtrailersheaders}

**추가된 버전: v0.3.0**

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

이 메서드는 HTTP 트레일링 헤더 (메시지 끝에 있는 헤더)를 응답에 추가합니다.

트레일러는 응답에 청크 인코딩이 사용된 경우에만 방출됩니다. 그렇지 않은 경우 (예: 요청이 HTTP/1.0인 경우) 자동으로 삭제됩니다.

HTTP에서는 트레일러를 방출하기 위해 `Trailer` 헤더를 해당 값에 헤더 필드 목록과 함께 전송해야 합니다. 예:

```js [ESM]
response.writeHead(200, { 'Content-Type': 'text/plain',
                          'Trailer': 'Content-MD5' });
response.write(fileData);
response.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
response.end();
```
잘못된 문자가 포함된 헤더 필드 이름 또는 값을 설정하려고 하면 [`TypeError`](/ko/nodejs/api/errors#class-typeerror)가 발생합니다.

### `response.connection` {#responseconnection}

**추가된 버전: v0.3.0**

**더 이상 사용되지 않음: v13.0.0 이후**

::: danger [안정성: 0 - 더 이상 사용되지 않음]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 더 이상 사용되지 않습니다. [`response.socket`](/ko/nodejs/api/http#responsesocket)을 사용하세요.
:::

- [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)

[`response.socket`](/ko/nodejs/api/http#responsesocket)을 참조하세요.

### `response.cork()` {#responsecork}

**추가된 버전: v13.2.0, v12.16.0**

[`writable.cork()`](/ko/nodejs/api/stream#writablecork)를 참조하세요.

### `response.end([data[, encoding]][, callback])` {#responseenddata-encoding-callback}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | 이제 `data` 매개변수가 `Uint8Array`일 수 있습니다. |
| v10.0.0 | 이제 이 메서드는 `ServerResponse`에 대한 참조를 반환합니다. |
| v0.1.90 | 추가된 버전: v0.1.90 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

이 메서드는 서버에 모든 응답 헤더 및 본문이 전송되었음을 알립니다. 서버는 이 메시지를 완료된 것으로 간주해야 합니다. 각 응답에서 `response.end()` 메서드를 호출해야 합니다.

`data`가 지정된 경우 [`response.write(data, encoding)`](/ko/nodejs/api/http#responsewritechunk-encoding-callback)을 호출한 다음 `response.end(callback)`을 호출하는 것과 효과가 유사합니다.

`callback`이 지정되면 응답 스트림이 완료될 때 호출됩니다.


### `response.finished` {#responsefinished}

**Added in: v0.0.2**

**Deprecated since: v13.4.0, v12.16.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 지원 중단됨. [`response.writableEnded`](/ko/nodejs/api/http#responsewritableended)를 사용하세요.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`response.end()`](/ko/nodejs/api/http#responseenddata-encoding-callback)가 호출된 경우 `response.finished` 속성은 `true`가 됩니다.

### `response.flushHeaders()` {#responseflushheaders}

**Added in: v1.6.0**

응답 헤더를 플러시합니다. 다음도 참조하세요: [`request.flushHeaders()`](/ko/nodejs/api/http#requestflushheaders).

### `response.getHeader(name)` {#responsegetheadername}

**Added in: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

이미 대기열에 있지만 클라이언트로 전송되지 않은 헤더를 읽습니다. 이름은 대소문자를 구분하지 않습니다. 반환 값의 유형은 [`response.setHeader()`](/ko/nodejs/api/http#responsesetheadername-value)에 제공된 인수에 따라 달라집니다.

```js [ESM]
response.setHeader('Content-Type', 'text/html');
response.setHeader('Content-Length', Buffer.byteLength(body));
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
const contentType = response.getHeader('content-type');
// contentType는 'text/html'입니다.
const contentLength = response.getHeader('Content-Length');
// contentLength는 number 유형입니다.
const setCookie = response.getHeader('set-cookie');
// setCookie는 string[] 유형입니다.
```
### `response.getHeaderNames()` {#responsegetheadernames}

**Added in: v7.7.0**

- 반환: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

현재 발신 헤더의 고유한 이름을 포함하는 배열을 반환합니다. 모든 헤더 이름은 소문자입니다.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```

### `response.getHeaders()` {#responsegetheaders}

**Added in: v7.7.0**

- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

현재 보내는 헤더의 얕은 복사본을 반환합니다. 얕은 복사본이 사용되기 때문에 다양한 헤더 관련 http 모듈 메서드에 대한 추가 호출 없이 배열 값을 변경할 수 있습니다. 반환된 객체의 키는 헤더 이름이고 값은 해당 헤더 값입니다. 모든 헤더 이름은 소문자입니다.

`response.getHeaders()` 메서드에서 반환된 객체는 JavaScript `Object`에서 프로토타입적으로 상속받지 *않습니다*. 즉, `obj.toString()`, `obj.hasOwnProperty()` 등과 같은 일반적인 `Object` 메서드는 정의되지 않으며 *작동하지 않습니다*.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
### `response.hasHeader(name)` {#responsehasheadername}

**Added in: v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`name`으로 식별되는 헤더가 현재 보내는 헤더에 설정되어 있으면 `true`를 반환합니다. 헤더 이름 일치는 대소문자를 구분하지 않습니다.

```js [ESM]
const hasContentType = response.hasHeader('content-type');
```
### `response.headersSent` {#responseheaderssent}

**Added in: v0.9.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Boolean (읽기 전용). 헤더가 전송되었으면 true, 그렇지 않으면 false입니다.

### `response.removeHeader(name)` {#responseremoveheadername}

**Added in: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

암시적 전송을 위해 대기 중인 헤더를 제거합니다.

```js [ESM]
response.removeHeader('Content-Encoding');
```
### `response.req` {#responsereq}

**Added in: v15.7.0**

- [\<http.IncomingMessage\>](/ko/nodejs/api/http#class-httpincomingmessage)

원래 HTTP `request` 객체에 대한 참조입니다.


### `response.sendDate` {#responsesenddate}

**추가된 버전: v0.7.5**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

true인 경우, 헤더에 Date 헤더가 아직 없는 경우 응답에서 자동으로 생성되어 전송됩니다. 기본값은 true입니다.

테스트 목적으로만 비활성화해야 합니다. HTTP는 응답에 Date 헤더가 필요합니다.

### `response.setHeader(name, value)` {#responsesetheadername-value}

**추가된 버전: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<http.ServerResponse\>](/ko/nodejs/api/http#class-httpserverresponse)

응답 객체를 반환합니다.

암시적 헤더에 대해 단일 헤더 값을 설정합니다. 이 헤더가 이미 전송될 헤더에 존재하는 경우 해당 값이 대체됩니다. 여기에 문자열 배열을 사용하여 동일한 이름으로 여러 헤더를 보낼 수 있습니다. 문자열이 아닌 값은 수정 없이 저장됩니다. 따라서 [`response.getHeader()`](/ko/nodejs/api/http#responsegetheadername)는 문자열이 아닌 값을 반환할 수 있습니다. 그러나 문자열이 아닌 값은 네트워크 전송을 위해 문자열로 변환됩니다. 호출자가 체이닝 호출을 사용할 수 있도록 동일한 응답 객체가 반환됩니다.

```js [ESM]
response.setHeader('Content-Type', 'text/html');
```
또는

```js [ESM]
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```
잘못된 문자가 포함된 헤더 필드 이름 또는 값을 설정하려고 하면 [`TypeError`](/ko/nodejs/api/errors#class-typeerror)가 발생합니다.

[`response.setHeader()`](/ko/nodejs/api/http#responsesetheadername-value)를 사용하여 헤더가 설정된 경우 [`response.writeHead()`](/ko/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)에 전달된 모든 헤더와 병합되며, [`response.writeHead()`](/ko/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)에 전달된 헤더가 우선 순위를 갖습니다.

```js [ESM]
// content-type = text/plain 반환
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```
[`response.writeHead()`](/ko/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) 메서드가 호출되었고 이 메서드가 호출되지 않은 경우, 내부적으로 캐싱하지 않고 제공된 헤더 값을 네트워크 채널에 직접 쓰며, 해당 헤더에 대한 [`response.getHeader()`](/ko/nodejs/api/http#responsegetheadername)는 예상되는 결과를 생성하지 않습니다. 잠재적인 향후 검색 및 수정과 함께 헤더의 점진적인 채우기를 원하는 경우 [`response.writeHead()`](/ko/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) 대신 [`response.setHeader()`](/ko/nodejs/api/http#responsesetheadername-value)를 사용하십시오.


### `response.setTimeout(msecs[, callback])` {#responsesettimeoutmsecs-callback}

**추가된 버전: v0.9.12**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<http.ServerResponse\>](/ko/nodejs/api/http#class-httpserverresponse)

Socket의 타임아웃 값을 `msecs`로 설정합니다. 콜백이 제공되면 응답 객체의 `'timeout'` 이벤트에 대한 리스너로 추가됩니다.

요청, 응답 또는 서버에 `'timeout'` 리스너가 추가되지 않으면 소켓은 타임아웃될 때 소멸됩니다. 처리기가 요청, 응답 또는 서버의 `'timeout'` 이벤트에 할당되면 타임아웃된 소켓을 명시적으로 처리해야 합니다.

### `response.socket` {#responsesocket}

**추가된 버전: v0.3.0**

- [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)

기본 소켓에 대한 참조입니다. 일반적으로 사용자는 이 속성에 접근하고 싶어하지 않을 것입니다. 특히 소켓은 프로토콜 파서가 소켓에 연결되는 방식 때문에 `'readable'` 이벤트를 발생시키지 않습니다. `response.end()` 후에는 속성이 null이 됩니다.

::: code-group
```js [ESM]
import http from 'node:http';
const server = http.createServer((req, res) => {
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```

```js [CJS]
const http = require('node:http');
const server = http.createServer((req, res) => {
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```
:::

이 속성은 사용자가 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 이외의 소켓 유형을 지정하지 않는 한 [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)의 하위 클래스인 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 클래스의 인스턴스임이 보장됩니다.

### `response.statusCode` {#responsestatuscode}

**추가된 버전: v0.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `200`

암시적 헤더를 사용하는 경우 (명시적으로 [`response.writeHead()`](/ko/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)를 호출하지 않음), 이 속성은 헤더가 플러시될 때 클라이언트로 전송될 상태 코드를 제어합니다.

```js [ESM]
response.statusCode = 404;
```
응답 헤더가 클라이언트로 전송된 후 이 속성은 전송된 상태 코드를 나타냅니다.


### `response.statusMessage` {#responsestatusmessage}

**추가된 버전: v0.11.8**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

암시적 헤더를 사용할 때(명시적으로 [`response.writeHead()`](/ko/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)를 호출하지 않는 경우) 이 속성은 헤더가 플러시될 때 클라이언트로 전송될 상태 메시지를 제어합니다. 이 속성이 `undefined`로 남아 있으면 상태 코드에 대한 표준 메시지가 사용됩니다.

```js [ESM]
response.statusMessage = 'Not found';
```
응답 헤더가 클라이언트로 전송된 후 이 속성은 전송된 상태 메시지를 나타냅니다.

### `response.strictContentLength` {#responsestrictcontentlength}

**추가된 버전: v18.10.0, v16.18.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `false`

`true`로 설정되면 Node.js는 `Content-Length` 헤더 값과 본문의 크기(바이트)가 같은지 확인합니다. `Content-Length` 헤더 값이 일치하지 않으면 `code:` [`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`](/ko/nodejs/api/errors#err_http_content_length_mismatch)로 식별되는 `Error`가 발생합니다.

### `response.uncork()` {#responseuncork}

**추가된 버전: v13.2.0, v12.16.0**

[`writable.uncork()`](/ko/nodejs/api/stream#writableuncork)를 참조하십시오.

### `response.writableEnded` {#responsewritableended}

**추가된 버전: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`response.end()`](/ko/nodejs/api/http#responseenddata-encoding-callback)가 호출된 후 `true`입니다. 이 속성은 데이터가 플러시되었는지 여부를 나타내지 않습니다. 대신 [`response.writableFinished`](/ko/nodejs/api/http#responsewritablefinished)를 사용하십시오.

### `response.writableFinished` {#responsewritablefinished}

**추가된 버전: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

모든 데이터가 기본 시스템으로 플러시된 경우 `true`이며, [`'finish'`](/ko/nodejs/api/http#event-finish) 이벤트가 발생하기 직전에 발생합니다.

### `response.write(chunk[, encoding][, callback])` {#responsewritechunk-encoding-callback}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | 이제 `chunk` 매개변수가 `Uint8Array`일 수 있습니다. |
| v0.1.29 | 추가된 버전: v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

이 메서드가 호출되고 [`response.writeHead()`](/ko/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)가 호출되지 않은 경우 암시적 헤더 모드로 전환되고 암시적 헤더가 플러시됩니다.

이는 응답 본문의 청크를 보냅니다. 이 메서드는 본문의 연속적인 부분을 제공하기 위해 여러 번 호출될 수 있습니다.

`rejectNonStandardBodyWrites`가 `createServer`에서 true로 설정된 경우 요청 메서드 또는 응답 상태가 콘텐츠를 지원하지 않으면 본문에 쓰는 것이 허용되지 않습니다. HEAD 요청에 대한 본문 또는 `204` 또는 `304` 응답의 일부로 본문에 쓰려고 시도하면 코드 `ERR_HTTP_BODY_NOT_ALLOWED`가 있는 동기 `Error`가 발생합니다.

`chunk`는 문자열 또는 버퍼일 수 있습니다. `chunk`가 문자열인 경우 두 번째 매개변수는 바이트 스트림으로 인코딩하는 방법을 지정합니다. 이 데이터 청크가 플러시되면 `callback`이 호출됩니다.

이것은 원시 HTTP 본문이며 사용될 수 있는 상위 수준의 멀티파트 본문 인코딩과는 관련이 없습니다.

[`response.write()`](/ko/nodejs/api/http#responsewritechunk-encoding-callback)가 처음 호출되면 버퍼링된 헤더 정보와 본문의 첫 번째 청크를 클라이언트로 보냅니다. [`response.write()`](/ko/nodejs/api/http#responsewritechunk-encoding-callback)가 두 번째로 호출되면 Node.js는 데이터가 스트리밍될 것으로 가정하고 새 데이터를 별도로 보냅니다. 즉, 응답은 본문의 첫 번째 청크까지 버퍼링됩니다.

전체 데이터가 커널 버퍼로 성공적으로 플러시되면 `true`를 반환합니다. 데이터의 전부 또는 일부가 사용자 메모리에 대기열에 있으면 `false`를 반환합니다. 버퍼가 다시 비워지면 `'drain'`이 발생합니다.


### `response.writeContinue()` {#responsewritecontinue}

**추가된 버전: v0.3.0**

클라이언트에게 HTTP/1.1 100 Continue 메시지를 보내 요청 본문을 보내야 함을 나타냅니다. `Server`의 [`'checkContinue'`](/ko/nodejs/api/http#event-checkcontinue) 이벤트를 참조하십시오.

### `response.writeEarlyHints(hints[, callback])` {#responsewriteearlyhintshints-callback}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.11.0 | 힌트를 객체로 전달할 수 있습니다. |
| v18.11.0 | 추가된 버전: v18.11.0 |
:::

- `hints` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

사용자 에이전트가 연결된 리소스를 미리 로드/미리 연결할 수 있음을 나타내는 Link 헤더와 함께 HTTP/1.1 103 Early Hints 메시지를 클라이언트에 보냅니다. `hints`는 초기 힌트 메시지와 함께 보낼 헤더의 값을 포함하는 객체입니다. 선택적 `callback` 인수는 응답 메시지가 작성될 때 호출됩니다.

**예제**

```js [ESM]
const earlyHintsLink = '</styles.css>; rel=preload; as=style';
response.writeEarlyHints({
  'link': earlyHintsLink,
});

const earlyHintsLinks = [
  '</styles.css>; rel=preload; as=style',
  '</scripts.js>; rel=preload; as=script',
];
response.writeEarlyHints({
  'link': earlyHintsLinks,
  'x-trace-id': 'id for diagnostics',
});

const earlyHintsCallback = () => console.log('early hints message sent');
response.writeEarlyHints({
  'link': earlyHintsLinks,
}, earlyHintsCallback);
```
### `response.writeHead(statusCode[, statusMessage][, headers])` {#responsewriteheadstatuscode-statusmessage-headers}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.14.0 | 헤더를 배열로 전달할 수 있습니다. |
| v11.10.0, v10.17.0 | `end()`와 연결할 수 있도록 `writeHead()`에서 `this`를 반환합니다. |
| v5.11.0, v4.4.5 | `statusCode`가 `[100, 999]` 범위의 숫자가 아니면 `RangeError`가 발생합니다. |
| v0.1.30 | 추가된 버전: v0.1.30 |
:::

- `statusCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- 반환 값: [\<http.ServerResponse\>](/ko/nodejs/api/http#class-httpserverresponse)

요청에 대한 응답 헤더를 보냅니다. 상태 코드는 `404`와 같은 3자리 HTTP 상태 코드입니다. 마지막 인수 `headers`는 응답 헤더입니다. 선택적으로 사람이 읽을 수 있는 `statusMessage`를 두 번째 인수로 제공할 수 있습니다.

`headers`는 키와 값이 동일한 목록에 있는 `Array`일 수 있습니다. 이것은 튜플 목록이 *아닙니다*. 따라서 짝수 오프셋은 키 값이고 홀수 오프셋은 연결된 값입니다. 배열은 `request.rawHeaders`와 동일한 형식입니다.

호출을 연결할 수 있도록 `ServerResponse`에 대한 참조를 반환합니다.

```js [ESM]
const body = 'hello world';
response
  .writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain',
  })
  .end(body);
```
이 메서드는 메시지에서 한 번만 호출해야 하며 [`response.end()`](/ko/nodejs/api/http#responseenddata-encoding-callback)가 호출되기 전에 호출해야 합니다.

[`response.write()`](/ko/nodejs/api/http#responsewritechunk-encoding-callback) 또는 [`response.end()`](/ko/nodejs/api/http#responseenddata-encoding-callback)가 이것을 호출하기 전에 호출되면 암시적/변경 가능한 헤더가 계산되어 이 함수를 호출합니다.

헤더가 [`response.setHeader()`](/ko/nodejs/api/http#responsesetheadername-value)로 설정된 경우 [`response.writeHead()`](/ko/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)에 전달된 헤더와 병합되며 [`response.writeHead()`](/ko/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)에 전달된 헤더가 우선합니다.

이 메서드가 호출되고 [`response.setHeader()`](/ko/nodejs/api/http#responsesetheadername-value)가 호출되지 않은 경우 내부적으로 캐싱하지 않고 제공된 헤더 값을 네트워크 채널에 직접 쓰고 헤더에 대한 [`response.getHeader()`](/ko/nodejs/api/http#responsegetheadername)는 예상되는 결과를 생성하지 않습니다. 잠재적인 향후 검색 및 수정으로 헤더의 점진적인 채우기를 원하는 경우 대신 [`response.setHeader()`](/ko/nodejs/api/http#responsesetheadername-value)를 사용하십시오.

```js [ESM]
// content-type = text/plain 반환
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```
`Content-Length`는 문자가 아닌 바이트 단위로 읽습니다. [`Buffer.byteLength()`](/ko/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding)를 사용하여 본문의 길이를 바이트 단위로 확인하십시오. Node.js는 `Content-Length`와 전송된 본문의 길이가 같은지 여부를 확인합니다.

잘못된 문자가 포함된 헤더 필드 이름 또는 값을 설정하려고 하면 [`Error`][]가 발생합니다.


### `response.writeProcessing()` {#responsewriteprocessing}

**Added in: v10.0.0**

클라이언트에 HTTP/1.1 102 Processing 메시지를 보내 요청 본문이 전송되어야 함을 나타냅니다.

## 클래스: `http.IncomingMessage` {#class-httpincomingmessage}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v15.5.0 | 수신 데이터가 소비된 후 `destroyed` 값이 `true`를 반환합니다. |
| v13.1.0, v12.16.0 | `readableHighWaterMark` 값이 소켓의 값을 반영합니다. |
| v0.1.17 | Added in: v0.1.17 |
:::

- 확장: [\<stream.Readable\>](/ko/nodejs/api/stream#class-streamreadable)

`IncomingMessage` 객체는 [`http.Server`](/ko/nodejs/api/http#class-httpserver) 또는 [`http.ClientRequest`](/ko/nodejs/api/http#class-httpclientrequest)에 의해 생성되고 각각 [`'request'`](/ko/nodejs/api/http#event-request) 및 [`'response'`](/ko/nodejs/api/http#event-response) 이벤트에 대한 첫 번째 인수로 전달됩니다. 응답 상태, 헤더 및 데이터에 액세스하는 데 사용할 수 있습니다.

[\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)의 서브클래스인 해당 `socket` 값과 달리 `IncomingMessage` 자체는 [\<stream.Readable\>](/ko/nodejs/api/stream#class-streamreadable)를 확장하고 기본 소켓이 keep-alive의 경우 여러 번 재사용될 수 있으므로 들어오는 HTTP 헤더 및 페이로드를 구문 분석하고 내보내기 위해 별도로 생성됩니다.

### 이벤트: `'aborted'` {#event-aborted}

**Added in: v0.3.8**

**Deprecated since: v17.0.0, v16.12.0**

::: danger [안정성: 0 - 사용 중단됨]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 사용 중단됨. 대신 `'close'` 이벤트를 수신하세요.
:::

요청이 중단되었을 때 발생합니다.

### 이벤트: `'close'` {#event-close_3}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v16.0.0 | 이제 닫기 이벤트는 기본 소켓이 닫힐 때가 아니라 요청이 완료되었을 때 발생합니다. |
| v0.4.2 | Added in: v0.4.2 |
:::

요청이 완료되었을 때 발생합니다.

### `message.aborted` {#messageaborted}

**Added in: v10.1.0**

**Deprecated since: v17.0.0, v16.12.0**

::: danger [안정성: 0 - 사용 중단됨]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 사용 중단됨. [\<stream.Readable\>](/ko/nodejs/api/stream#class-streamreadable)에서 `message.destroyed`를 확인하세요.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

요청이 중단된 경우 `message.aborted` 속성은 `true`가 됩니다.


### `message.complete` {#messagecomplete}

**추가된 버전: v0.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`message.complete` 속성은 완전한 HTTP 메시지가 수신되어 성공적으로 파싱되었을 경우 `true`가 됩니다.

이 속성은 클라이언트 또는 서버가 연결이 종료되기 전에 메시지를 완전히 전송했는지 여부를 판단하는 데 특히 유용합니다.

```js [ESM]
const req = http.request({
  host: '127.0.0.1',
  port: 8080,
  method: 'POST',
}, (res) => {
  res.resume();
  res.on('end', () => {
    if (!res.complete)
      console.error(
        '메시지가 아직 전송 중인 동안 연결이 종료되었습니다.');
  });
});
```
### `message.connection` {#messageconnection}

**추가된 버전: v0.1.90**

**지원 중단된 버전: v16.0.0**

::: danger [안정성: 0 - 지원 중단됨]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 지원 중단됨. [`message.socket`](/ko/nodejs/api/http#messagesocket)을 사용하세요.
:::

[`message.socket`](/ko/nodejs/api/http#messagesocket)의 별칭입니다.

### `message.destroy([error])` {#messagedestroyerror}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.5.0, v12.19.0 | 함수는 다른 Readable 스트림과의 일관성을 위해 `this`를 반환합니다. |
| v0.3.0 | 추가된 버전: v0.3.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- 반환: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

`IncomingMessage`를 수신한 소켓에서 `destroy()`를 호출합니다. `error`가 제공되면 소켓에서 `'error'` 이벤트가 발생하고 `error`는 이벤트의 모든 리스너에 인수로 전달됩니다.

### `message.headers` {#messageheaders}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.5.0, v18.14.0 | `http.request()` 및 `http.createServer()` 함수의 `joinDuplicateHeaders` 옵션은 중복 헤더가 폐기되지 않고 RFC 9110 섹션 5.3에 따라 쉼표 구분 기호를 사용하여 결합되도록 합니다. |
| v15.1.0 | `message.headers`는 이제 프로토타입의 접근자 속성을 사용하여 지연 계산되며 더 이상 열거할 수 없습니다. |
| v0.1.5 | 추가된 버전: v0.1.5 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

요청/응답 헤더 객체.

헤더 이름과 값의 키-값 쌍입니다. 헤더 이름은 소문자로 되어 있습니다.

```js [ESM]
// 다음과 같이 출력됩니다.
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
```
원시 헤더의 중복은 헤더 이름에 따라 다음과 같은 방식으로 처리됩니다.

- `age`, `authorization`, `content-length`, `content-type`, `etag`, `expires`, `from`, `host`, `if-modified-since`, `if-unmodified-since`, `last-modified`, `location`, `max-forwards`, `proxy-authorization`, `referer`, `retry-after`, `server` 또는 `user-agent`의 중복은 폐기됩니다. 위에 나열된 헤더의 중복 값을 결합하려면 [`http.request()`](/ko/nodejs/api/http#httprequestoptions-callback) 및 [`http.createServer()`](/ko/nodejs/api/http#httpcreateserveroptions-requestlistener)에서 `joinDuplicateHeaders` 옵션을 사용하십시오. 자세한 내용은 RFC 9110 섹션 5.3을 참조하십시오.
- `set-cookie`는 항상 배열입니다. 중복은 배열에 추가됩니다.
- 중복된 `cookie` 헤더의 경우 값은 `; `로 결합됩니다.
- 다른 모든 헤더의 경우 값은 `, `로 결합됩니다.


### `message.headersDistinct` {#messageheadersdistinct}

**추가된 버전: v18.3.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[`message.headers`](/ko/nodejs/api/http#messageheaders)와 유사하지만, 결합 로직이 없으며 값은 한 번만 수신된 헤더에도 항상 문자열 배열입니다.

```js [ESM]
// 다음과 같이 출력됩니다:
//
// { 'user-agent': ['curl/7.22.0'],
//   host: ['127.0.0.1:8000'],
//   accept: ['*/*'] }
console.log(request.headersDistinct);
```
### `message.httpVersion` {#messagehttpversion}

**추가된 버전: v0.1.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

서버 요청의 경우, 클라이언트가 보낸 HTTP 버전입니다. 클라이언트 응답의 경우, 연결된 서버의 HTTP 버전입니다. 아마도 `'1.1'` 또는 `'1.0'`일 것입니다.

또한 `message.httpVersionMajor`는 첫 번째 정수이고 `message.httpVersionMinor`는 두 번째 정수입니다.

### `message.method` {#messagemethod}

**추가된 버전: v0.1.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**<a href="#class-httpserver"><code>http.Server</code></a>에서 얻은 요청에만 유효합니다.**

문자열로 된 요청 메서드입니다. 읽기 전용입니다. 예: `'GET'`, `'DELETE'`.

### `message.rawHeaders` {#messagerawheaders}

**추가된 버전: v0.11.6**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

수신된 그대로의 원시 요청/응답 헤더 목록입니다.

키와 값은 동일한 목록에 있습니다. 튜플 목록이 *아닙니다*. 따라서 짝수 번호 오프셋은 키 값이고, 홀수 번호 오프셋은 관련 값입니다.

헤더 이름은 소문자로 변환되지 않으며 중복 항목은 병합되지 않습니다.

```js [ESM]
// 다음과 같이 출력됩니다:
//
// [ 'user-agent',
//   'this is invalid because there can be only one',
//   'User-Agent',
//   'curl/7.22.0',
//   'Host',
//   '127.0.0.1:8000',
//   'ACCEPT',
//   '*/*' ]
console.log(request.rawHeaders);
```
### `message.rawTrailers` {#messagerawtrailers}

**추가된 버전: v0.11.6**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

수신된 그대로의 원시 요청/응답 트레일러 키와 값입니다. `'end'` 이벤트에서만 채워집니다.


### `message.setTimeout(msecs[, callback])` {#messagesettimeoutmsecs-callback}

**추가된 버전: v0.5.9**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환값: [\<http.IncomingMessage\>](/ko/nodejs/api/http#class-httpincomingmessage)

`message.socket.setTimeout(msecs, callback)`을 호출합니다.

### `message.socket` {#messagesocket}

**추가된 버전: v0.3.0**

- [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)

연결과 관련된 [`net.Socket`](/ko/nodejs/api/net#class-netsocket) 객체입니다.

HTTPS 지원을 사용하면 클라이언트의 인증 정보를 얻기 위해 [`request.socket.getPeerCertificate()`](/ko/nodejs/api/tls#tlssocketgetpeercertificatedetailed)를 사용합니다.

이 속성은 사용자가 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 이외의 소켓 유형을 지정하거나 내부적으로 null로 설정하지 않는 한 항상 [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) 클래스, 즉 [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)의 서브클래스의 인스턴스임이 보장됩니다.

### `message.statusCode` {#messagestatuscode}

**추가된 버전: v0.1.1**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

**<a href="#class-httpclientrequest"><code>http.ClientRequest</code></a>에서 얻은 응답에만 유효합니다.**

3자리 HTTP 응답 상태 코드입니다. 예: `404`.

### `message.statusMessage` {#messagestatusmessage}

**추가된 버전: v0.11.10**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**<a href="#class-httpclientrequest"><code>http.ClientRequest</code></a>에서 얻은 응답에만 유효합니다.**

HTTP 응답 상태 메시지 (이유 구절). 예: `OK` 또는 `Internal Server Error`.

### `message.trailers` {#messagetrailers}

**추가된 버전: v0.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

요청/응답 트레일러 객체입니다. `'end'` 이벤트 시에만 채워집니다.

### `message.trailersDistinct` {#messagetrailersdistinct}

**추가된 버전: v18.3.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[`message.trailers`](/ko/nodejs/api/http#messagetrailers)와 유사하지만 조인 로직이 없고 값은 한 번만 수신된 헤더에도 항상 문자열 배열입니다. `'end'` 이벤트 시에만 채워집니다.


### `message.url` {#messageurl}

**추가된 버전: v0.1.90**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**<a href="#class-httpserver"><code>http.Server</code></a>에서 얻은 요청에 대해서만 유효합니다.**

요청 URL 문자열입니다. 여기에는 실제 HTTP 요청에 있는 URL만 포함됩니다. 다음 요청을 예로 들어보겠습니다.

GET /status?name=ryan HTTP/1.1
Accept: text/plain
```
URL을 해당 부분으로 파싱하려면:

```js [ESM]
new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`);
```
`request.url`이 `'/status?name=ryan'`이고 `process.env.HOST`가 정의되지 않은 경우:

```bash [BASH]
$ node
> new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`);
URL {
  href: 'http://localhost/status?name=ryan',
  origin: 'http://localhost',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'localhost',
  hostname: 'localhost',
  port: '',
  pathname: '/status',
  search: '?name=ryan',
  searchParams: URLSearchParams { 'name' => 'ryan' },
  hash: ''
}
```
`process.env.HOST`를 서버의 호스트 이름으로 설정하거나 이 부분을 완전히 바꾸는 것을 고려하십시오. `req.headers.host`를 사용하는 경우 클라이언트가 사용자 지정 `Host` 헤더를 지정할 수 있으므로 적절한 유효성 검사가 사용되는지 확인하십시오.

## 클래스: `http.OutgoingMessage` {#class-httpoutgoingmessage}

**추가된 버전: v0.1.17**

- 확장: [\<Stream\>](/ko/nodejs/api/stream#stream)

이 클래스는 [`http.ClientRequest`](/ko/nodejs/api/http#class-httpclientrequest) 및 [`http.ServerResponse`](/ko/nodejs/api/http#class-httpserverresponse)의 부모 클래스 역할을 합니다. HTTP 트랜잭션 참가자의 관점에서 추상적인 발신 메시지입니다.

### 이벤트: `'drain'` {#event-drain}

**추가된 버전: v0.3.6**

메시지의 버퍼가 다시 비워지면 발생합니다.

### 이벤트: `'finish'` {#event-finish_2}

**추가된 버전: v0.1.17**

전송이 성공적으로 완료되면 발생합니다.

### 이벤트: `'prefinish'` {#event-prefinish}

**추가된 버전: v0.11.6**

`outgoingMessage.end()`가 호출된 후에 발생합니다. 이벤트가 발생하면 모든 데이터가 처리되었지만 완전히 플러시되지는 않았을 수 있습니다.


### `outgoingMessage.addTrailers(headers)` {#outgoingmessageaddtrailersheaders}

**Added in: v0.3.0**

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

메시지 끝에 HTTP 트레일러(헤더이지만 메시지 끝에 있음)를 추가합니다.

트레일러는 메시지가 청크 인코딩된 경우에만 방출됩니다. 그렇지 않으면 트레일러는 자동으로 삭제됩니다.

HTTP는 트레일러를 방출하기 위해 값에 헤더 필드 이름 목록이 있는 `Trailer` 헤더를 보내야 합니다. 예를 들어 다음과 같습니다.

```js [ESM]
message.writeHead(200, { 'Content-Type': 'text/plain',
                         'Trailer': 'Content-MD5' });
message.write(fileData);
message.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
message.end();
```
유효하지 않은 문자를 포함하는 헤더 필드 이름 또는 값을 설정하려고 하면 `TypeError`가 발생합니다.

### `outgoingMessage.appendHeader(name, value)` {#outgoingmessageappendheadername-value}

**Added in: v18.3.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 헤더 이름
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 헤더 값
- Returns: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

단일 헤더 값을 헤더 객체에 추가합니다.

값이 배열인 경우 이 메서드를 여러 번 호출하는 것과 같습니다.

헤더에 대한 이전 값이 없는 경우 [`outgoingMessage.setHeader(name, value)`](/ko/nodejs/api/http#outgoingmessagesetheadername-value)를 호출하는 것과 같습니다.

클라이언트 요청 또는 서버가 생성될 때 `options.uniqueHeaders`의 값에 따라 헤더가 여러 번 전송되거나 `; `를 사용하여 값이 결합된 상태로 한 번 전송됩니다.

### `outgoingMessage.connection` {#outgoingmessageconnection}

**Added in: v0.3.0**

**Deprecated since: v15.12.0, v14.17.1**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ko/nodejs/api/documentation#stability-index) [Stability: 0](/ko/nodejs/api/documentation#stability-index) - Deprecated: [`outgoingMessage.socket`](/ko/nodejs/api/http#outgoingmessagesocket)을(를) 대신 사용하십시오.
:::

[`outgoingMessage.socket`](/ko/nodejs/api/http#outgoingmessagesocket)의 별칭입니다.


### `outgoingMessage.cork()` {#outgoingmessagecork}

**추가된 버전: v13.2.0, v12.16.0**

[`writable.cork()`](/ko/nodejs/api/stream#writablecork)를 참조하세요.

### `outgoingMessage.destroy([error])` {#outgoingmessagedestroyerror}

**추가된 버전: v0.3.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 선택 사항, `error` 이벤트와 함께 발생시킬 오류
- 반환: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

메시지를 삭제합니다. 소켓이 메시지와 연결되어 연결되면 해당 소켓도 삭제됩니다.

### `outgoingMessage.end(chunk[, encoding][, callback])` {#outgoingmessageendchunk-encoding-callback}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | 이제 `chunk` 매개변수가 `Uint8Array`일 수 있습니다. |
| v0.11.6 | `callback` 인수 추가. |
| v0.1.90 | 추가된 버전: v0.1.90 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 선택 사항, **기본값**: `utf8`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 선택 사항
- 반환: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

발신 메시지를 완료합니다. 본문의 일부가 전송되지 않은 경우 기본 시스템으로 플러시됩니다. 메시지가 청크화된 경우 종료 청크 `0\r\n\r\n`을 보내고 트레일러 (있는 경우)를 보냅니다.

`chunk`가 지정되면 `outgoingMessage.write(chunk, encoding)`를 호출한 다음 `outgoingMessage.end(callback)`를 호출하는 것과 같습니다.

`callback`이 제공되면 메시지가 완료될 때 호출됩니다 ('`finish`' 이벤트의 리스너와 동일).

### `outgoingMessage.flushHeaders()` {#outgoingmessageflushheaders}

**추가된 버전: v1.6.0**

메시지 헤더를 플러시합니다.

효율성을 위해 Node.js는 일반적으로 `outgoingMessage.end()`가 호출되거나 메시지 데이터의 첫 번째 청크가 작성될 때까지 메시지 헤더를 버퍼링합니다. 그런 다음 헤더와 데이터를 단일 TCP 패킷으로 압축하려고 합니다.

일반적으로 바람직하지만 (TCP 왕복을 절약합니다), 첫 번째 데이터가 훨씬 나중에 전송될 때에는 그렇지 않습니다. `outgoingMessage.flushHeaders()`는 최적화를 우회하고 메시지를 시작합니다.


### `outgoingMessage.getHeader(name)` {#outgoingmessagegetheadername}

**Added in: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 헤더 이름
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

지정된 이름의 HTTP 헤더 값을 가져옵니다. 해당 헤더가 설정되지 않은 경우 반환 값은 `undefined`입니다.

### `outgoingMessage.getHeaderNames()` {#outgoingmessagegetheadernames}

**Added in: v7.7.0**

- 반환: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

현재 발신 헤더의 고유한 이름이 포함된 배열을 반환합니다. 모든 이름은 소문자입니다.

### `outgoingMessage.getHeaders()` {#outgoingmessagegetheaders}

**Added in: v7.7.0**

- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

현재 발신 헤더의 얕은 복사본을 반환합니다. 얕은 복사본이 사용되기 때문에 다양한 헤더 관련 HTTP 모듈 메서드를 추가로 호출하지 않고도 배열 값을 변경할 수 있습니다. 반환된 객체의 키는 헤더 이름이고 값은 해당 헤더 값입니다. 모든 헤더 이름은 소문자입니다.

`outgoingMessage.getHeaders()` 메서드에서 반환된 객체는 JavaScript `Object`에서 프로토타입적으로 상속되지 않습니다. 즉, `obj.toString()`, `obj.hasOwnProperty()` 등과 같은 일반적인 `Object` 메서드는 정의되지 않았으며 작동하지 않습니다.

```js [ESM]
outgoingMessage.setHeader('Foo', 'bar');
outgoingMessage.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = outgoingMessage.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
### `outgoingMessage.hasHeader(name)` {#outgoingmessagehasheadername}

**Added in: v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`name`으로 식별되는 헤더가 현재 발신 헤더에 설정되어 있으면 `true`를 반환합니다. 헤더 이름은 대소문자를 구분하지 않습니다.

```js [ESM]
const hasContentType = outgoingMessage.hasHeader('content-type');
```

### `outgoingMessage.headersSent` {#outgoingmessageheaderssent}

**추가된 버전: v0.9.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

읽기 전용. 헤더가 전송되었으면 `true`, 그렇지 않으면 `false`입니다.

### `outgoingMessage.pipe()` {#outgoingmessagepipe}

**추가된 버전: v9.0.0**

`http.OutgoingMessage`의 부모 클래스인 레거시 `Stream` 클래스에서 상속된 `stream.pipe()` 메서드를 오버라이드합니다.

이 메서드를 호출하면 `outgoingMessage`가 쓰기 전용 스트림이기 때문에 `Error`가 발생합니다.

### `outgoingMessage.removeHeader(name)` {#outgoingmessageremoveheadername}

**추가된 버전: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 헤더 이름

암시적 전송을 위해 대기열에 있는 헤더를 제거합니다.

```js [ESM]
outgoingMessage.removeHeader('Content-Encoding');
```
### `outgoingMessage.setHeader(name, value)` {#outgoingmessagesetheadername-value}

**추가된 버전: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 헤더 이름
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 헤더 값
- 반환값: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

단일 헤더 값을 설정합니다. 전송될 헤더에 헤더가 이미 있는 경우 해당 값이 대체됩니다. 문자열 배열을 사용하여 동일한 이름으로 여러 헤더를 보냅니다.

### `outgoingMessage.setHeaders(headers)` {#outgoingmessagesetheadersheaders}

**추가된 버전: v19.6.0, v18.15.0**

- `headers` [\<Headers\>](https://developer.mozilla.org/en-US/docs/Web/API/Headers) | [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- 반환값: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

암시적 헤더에 대한 여러 헤더 값을 설정합니다. `headers`는 [`Headers`](/ko/nodejs/api/globals#class-headers) 또는 `Map`의 인스턴스여야 합니다. 전송될 헤더에 헤더가 이미 있는 경우 해당 값이 대체됩니다.

```js [ESM]
const headers = new Headers({ foo: 'bar' });
outgoingMessage.setHeaders(headers);
```
또는

```js [ESM]
const headers = new Map([['foo', 'bar']]);
outgoingMessage.setHeaders(headers);
```
헤더가 [`outgoingMessage.setHeaders()`](/ko/nodejs/api/http#outgoingmessagesetheadersheaders)로 설정된 경우, 이 헤더는 [`response.writeHead()`](/ko/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)에 전달된 헤더와 병합되며, [`response.writeHead()`](/ko/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)에 전달된 헤더가 우선합니다.

```js [ESM]
// content-type = text/plain 반환
const server = http.createServer((req, res) => {
  const headers = new Headers({ 'Content-Type': 'text/html' });
  res.setHeaders(headers);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```

### `outgoingMessage.setTimeout(msesc[, callback])` {#outgoingmessagesettimeoutmsesc-callback}

**추가된 버전: v0.9.12**

- `msesc` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 선택 사항. 시간 초과가 발생했을 때 호출할 함수. `timeout` 이벤트에 바인딩하는 것과 같습니다.
- 반환값: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

소켓이 메시지와 연결되고 연결되면 [`socket.setTimeout()`](/ko/nodejs/api/net#socketsettimeouttimeout-callback)이 `msecs`를 첫 번째 매개변수로 사용하여 호출됩니다.

### `outgoingMessage.socket` {#outgoingmessagesocket}

**추가된 버전: v0.3.0**

- [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)

기본 소켓에 대한 참조. 일반적으로 사용자는 이 속성에 액세스하지 않습니다.

`outgoingMessage.end()`를 호출한 후 이 속성은 null로 설정됩니다.

### `outgoingMessage.uncork()` {#outgoingmessageuncork}

**추가된 버전: v13.2.0, v12.16.0**

[`writable.uncork()`](/ko/nodejs/api/stream#writableuncork)를 참조하세요.

### `outgoingMessage.writableCorked` {#outgoingmessagewritablecorked}

**추가된 버전: v13.2.0, v12.16.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`outgoingMessage.cork()`가 호출된 횟수입니다.

### `outgoingMessage.writableEnded` {#outgoingmessagewritableended}

**추가된 버전: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`outgoingMessage.end()`가 호출되면 `true`입니다. 이 속성은 데이터가 플러시되었는지 여부를 나타내지 않습니다. 이를 위해서는 대신 `message.writableFinished`를 사용하세요.

### `outgoingMessage.writableFinished` {#outgoingmessagewritablefinished}

**추가된 버전: v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

모든 데이터가 기본 시스템으로 플러시되면 `true`입니다.

### `outgoingMessage.writableHighWaterMark` {#outgoingmessagewritablehighwatermark}

**추가된 버전: v12.9.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

할당된 경우 기본 소켓의 `highWaterMark`입니다. 그렇지 않으면 [`writable.write()`](/ko/nodejs/api/stream#writablewritechunk-encoding-callback)가 false를 반환하기 시작할 때의 기본 버퍼 수준(`16384`)입니다.


### `outgoingMessage.writableLength` {#outgoingmessagewritablelength}

**추가된 버전: v12.9.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

버퍼링된 바이트 수입니다.

### `outgoingMessage.writableObjectMode` {#outgoingmessagewritableobjectmode}

**추가된 버전: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

항상 `false`입니다.

### `outgoingMessage.write(chunk[, encoding][, callback])` {#outgoingmessagewritechunk-encoding-callback}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | `chunk` 매개변수는 이제 `Uint8Array`가 될 수 있습니다. |
| v0.11.6 | `callback` 인수가 추가되었습니다. |
| v0.1.29 | 추가된 버전: v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값**: `utf8`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

본문의 청크를 보냅니다. 이 메서드는 여러 번 호출할 수 있습니다.

`encoding` 인수는 `chunk`가 문자열일 때만 관련이 있습니다. 기본값은 `'utf8'`입니다.

`callback` 인수는 선택 사항이며 이 데이터 청크가 플러시될 때 호출됩니다.

전체 데이터가 커널 버퍼로 성공적으로 플러시되면 `true`를 반환합니다. 데이터의 전부 또는 일부가 사용자 메모리에 대기열에 있으면 `false`를 반환합니다. 버퍼가 다시 비워지면 `'drain'` 이벤트가 발생합니다.

## `http.METHODS` {#httpmethods}

**추가된 버전: v0.11.8**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

파서에서 지원하는 HTTP 메서드 목록입니다.

## `http.STATUS_CODES` {#httpstatus_codes}

**추가된 버전: v0.1.22**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

모든 표준 HTTP 응답 상태 코드와 각 코드에 대한 간략한 설명 모음입니다. 예를 들어 `http.STATUS_CODES[404] === 'Not Found'`입니다.


## `http.createServer([options][, requestListener])` {#httpcreateserveroptions-requestlistener}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v20.1.0, v18.17.0 | `highWaterMark` 옵션이 지원됩니다. |
| v18.0.0 | `requestTimeout`, `headersTimeout`, `keepAliveTimeout` 및 `connectionsCheckingInterval` 옵션이 지원됩니다. |
| v18.0.0 | `noDelay` 옵션의 기본값이 `true`로 변경되었습니다. |
| v17.7.0, v16.15.0 | `noDelay`, `keepAlive` 및 `keepAliveInitialDelay` 옵션이 지원됩니다. |
| v13.3.0 | `maxHeaderSize` 옵션이 지원됩니다. |
| v13.8.0, v12.15.0, v10.19.0 | `insecureHTTPParser` 옵션이 지원됩니다. |
| v9.6.0, v8.12.0 | `options` 인수가 지원됩니다. |
| v0.1.13 | 추가됨: v0.1.13 |
:::

-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `connectionsCheckingInterval`: 완료되지 않은 요청에서 요청 및 헤더 시간 초과를 확인하기 위한 간격 값을 밀리초 단위로 설정합니다. **기본값:** `30000`.
    - `headersTimeout`: 클라이언트로부터 완전한 HTTP 헤더를 수신하는 데 걸리는 시간 초과 값을 밀리초 단위로 설정합니다. 자세한 내용은 [`server.headersTimeout`](/ko/nodejs/api/http#serverheaderstimeout)을 참조하십시오. **기본값:** `60000`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 선택적으로 모든 `socket`의 `readableHighWaterMark` 및 `writableHighWaterMark`를 재정의합니다. 이는 `IncomingMessage` 및 `ServerResponse` 모두의 `highWaterMark` 속성에 영향을 줍니다. **기본값:** [`stream.getDefaultHighWaterMark()`](/ko/nodejs/api/stream#streamgetdefaulthighwatermarkobjectmode)을 참조하십시오.
    - `insecureHTTPParser` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`로 설정하면 관용 플래그가 활성화된 HTTP 파서를 사용합니다. 안전하지 않은 파서를 사용하는 것은 피해야 합니다. 자세한 내용은 [`--insecure-http-parser`](/ko/nodejs/api/cli#--insecure-http-parser)를 참조하십시오. **기본값:** `false`.
    - `IncomingMessage` [\<http.IncomingMessage\>](/ko/nodejs/api/http#class-httpincomingmessage) 사용할 `IncomingMessage` 클래스를 지정합니다. 원래 `IncomingMessage`를 확장하는 데 유용합니다. **기본값:** `IncomingMessage`.
    - `joinDuplicateHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`로 설정하면 이 옵션을 통해 중복을 삭제하는 대신 요청에서 여러 헤더의 필드 줄 값을 쉼표(`, `)로 결합할 수 있습니다. 자세한 내용은 [`message.headers`](/ko/nodejs/api/http#messageheaders)를 참조하십시오. **기본값:** `false`.
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`로 설정하면 새 들어오는 연결이 수신된 직후 소켓에서 keep-alive 기능이 활성화됩니다. 이는 [`socket.setKeepAlive([enable][, initialDelay])`][`socket.setKeepAlive(enable, initialDelay)`]에서 수행되는 것과 유사합니다. **기본값:** `false`.
    - `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 양수로 설정하면 유휴 소켓에서 첫 번째 keepalive 프로브를 보내기 전에 초기 지연 시간을 설정합니다. **기본값:** `0`.
    - `keepAliveTimeout`: 서버가 마지막 응답을 작성한 후 소켓이 소멸되기 전에 추가 들어오는 데이터를 기다려야 하는 비활성 시간(밀리초)입니다. 자세한 내용은 [`server.keepAliveTimeout`](/ko/nodejs/api/http#serverkeepalivetimeout)을 참조하십시오. **기본값:** `5000`.
    - `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 선택적으로 이 서버에서 수신한 요청에 대한 [`--max-http-header-size`](/ko/nodejs/api/cli#--max-http-header-sizesize)의 값(즉, 요청 헤더의 최대 길이(바이트))을 재정의합니다. **기본값:** 16384 (16 KiB).
    - `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`로 설정하면 새 들어오는 연결이 수신된 직후 Nagle 알고리즘의 사용을 비활성화합니다. **기본값:** `true`.
    - `requestTimeout`: 클라이언트로부터 전체 요청을 수신하는 데 걸리는 시간 초과 값을 밀리초 단위로 설정합니다. 자세한 내용은 [`server.requestTimeout`](/ko/nodejs/api/http#serverrequesttimeout)을 참조하십시오. **기본값:** `300000`.
    - `requireHostHeader` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`로 설정하면 사양에 따라 Host 헤더가 없는 모든 HTTP/1.1 요청 메시지에 대해 서버가 400 (잘못된 요청) 상태 코드로 응답하도록 강제합니다. **기본값:** `true`.
    - `ServerResponse` [\<http.ServerResponse\>](/ko/nodejs/api/http#class-httpserverresponse) 사용할 `ServerResponse` 클래스를 지정합니다. 원래 `ServerResponse`를 확장하는 데 유용합니다. **기본값:** `ServerResponse`.
    - `uniqueHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 한 번만 보내야 하는 응답 헤더 목록입니다. 헤더 값이 배열인 경우 항목은 `; `를 사용하여 결합됩니다.
    - `rejectNonStandardBodyWrites` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`로 설정하면 본문이 없는 HTTP 응답에 쓸 때 오류가 발생합니다. **기본값:** `false`.


-  `requestListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
-  반환: [\<http.Server\>](/ko/nodejs/api/http#class-httpserver)

[`http.Server`](/ko/nodejs/api/http#class-httpserver)의 새 인스턴스를 반환합니다.

`requestListener`는 [`'request'`](/ko/nodejs/api/http#event-request) 이벤트에 자동으로 추가되는 함수입니다.

::: code-group
```js [ESM]
import http from 'node:http';

// 데이터를 수신할 로컬 서버 만들기
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

```js [CJS]
const http = require('node:http');

// 데이터를 수신할 로컬 서버 만들기
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```
:::

::: code-group
```js [ESM]
import http from 'node:http';

// 데이터를 수신할 로컬 서버 만들기
const server = http.createServer();

// request 이벤트 수신
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

```js [CJS]
const http = require('node:http');

// 데이터를 수신할 로컬 서버 만들기
const server = http.createServer();

// request 이벤트 수신
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```
:::


## `http.get(options[, callback])` {#httpgetoptions-callback}

## `http.get(url[, options][, callback])` {#httpgeturl-options-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.9.0 | 이제 `url` 매개변수를 별도의 `options` 객체와 함께 전달할 수 있습니다. |
| v7.5.0 | `options` 매개변수는 WHATWG `URL` 객체일 수 있습니다. |
| v0.3.6 | v0.3.6에서 추가됨 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`http.request()`](/ko/nodejs/api/http#httprequestoptions-callback)와 동일한 `options`를 허용하며, method는 기본적으로 GET으로 설정됩니다.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환값: [\<http.ClientRequest\>](/ko/nodejs/api/http#class-httpclientrequest)

대부분의 요청이 본문이 없는 GET 요청이기 때문에 Node.js는 이 편리한 메서드를 제공합니다. 이 메서드와 [`http.request()`](/ko/nodejs/api/http#httprequestoptions-callback)의 유일한 차이점은 기본적으로 메서드를 GET으로 설정하고 `req.end()`를 자동으로 호출한다는 것입니다. 콜백은 [`http.ClientRequest`](/ko/nodejs/api/http#class-httpclientrequest) 섹션에 명시된 이유로 응답 데이터를 소비하도록 주의해야 합니다.

`callback`은 [`http.IncomingMessage`](/ko/nodejs/api/http#class-httpincomingmessage)의 인스턴스인 단일 인수로 호출됩니다.

JSON 가져오기 예제:

```js [ESM]
http.get('http://localhost:8000/', (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  // 모든 2xx 상태 코드는 성공적인 응답을 나타내지만
  // 여기서는 200만 확인합니다.
  if (statusCode !== 200) {
    error = new Error('요청 실패.\n' +
                      `상태 코드: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('잘못된 content-type.\n' +
                      `application/json을 예상했지만 ${contentType}를 받았습니다.`);
  }
  if (error) {
    console.error(error.message);
    // 메모리를 확보하기 위해 응답 데이터를 소비합니다.
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`오류 발생: ${e.message}`);
});

// 데이터를 받을 로컬 서버 생성
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

## `http.globalAgent` {#httpglobalagent}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 에이전트는 이제 기본적으로 HTTP Keep-Alive와 5초 제한 시간을 사용합니다. |
| v0.5.9 | v0.5.9에서 추가됨 |
:::

- [\<http.Agent\>](/ko/nodejs/api/http#class-httpagent)

모든 HTTP 클라이언트 요청에 대한 기본값으로 사용되는 `Agent`의 전역 인스턴스입니다. `keepAlive`가 활성화되어 있고 `timeout`이 5초인 기본 `Agent` 구성과 다릅니다.

## `http.maxHeaderSize` {#httpmaxheadersize}

**추가된 버전: v11.6.0, v10.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

HTTP 헤더에 허용되는 최대 크기를 바이트 단위로 지정하는 읽기 전용 속성입니다. 기본값은 16KiB입니다. [`--max-http-header-size`](/ko/nodejs/api/cli#--max-http-header-sizesize) CLI 옵션을 사용하여 구성할 수 있습니다.

`maxHeaderSize` 옵션을 전달하여 서버 및 클라이언트 요청에 대해 이를 재정의할 수 있습니다.

## `http.request(options[, callback])` {#httprequestoptions-callback}

## `http.request(url[, options][, callback])` {#httprequesturl-options-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.7.0, v14.18.0 | `URL` 객체를 사용하는 경우 구문 분석된 사용자 이름과 비밀번호가 이제 URI로 올바르게 디코딩됩니다. |
| v15.3.0, v14.17.0 | AbortSignal을 사용하여 요청을 중단할 수 있습니다. |
| v13.3.0 | 이제 `maxHeaderSize` 옵션이 지원됩니다. |
| v13.8.0, v12.15.0, v10.19.0 | 이제 `insecureHTTPParser` 옵션이 지원됩니다. |
| v10.9.0 | 이제 `url` 매개변수를 별도의 `options` 객체와 함께 전달할 수 있습니다. |
| v7.5.0 | `options` 매개변수는 WHATWG `URL` 객체일 수 있습니다. |
| v0.3.6 | v0.3.6에서 추가됨 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `agent` [\<http.Agent\>](/ko/nodejs/api/http#class-httpagent) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) [`Agent`](/ko/nodejs/api/http#class-httpagent) 동작을 제어합니다. 가능한 값:
    - `undefined` (기본값): 이 호스트 및 포트에 대해 [`http.globalAgent`](/ko/nodejs/api/http#httpglobalagent)를 사용합니다.
    - `Agent` 객체: 전달된 `Agent`를 명시적으로 사용합니다.
    - `false`: 기본값을 가진 새 `Agent`를 사용합니다.
  
 
    - `auth` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 인증 헤더를 계산하기 위한 기본 인증(`'user:password'`)입니다.
    - `createConnection` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `agent` 옵션을 사용하지 않을 때 요청에 사용할 소켓/스트림을 생성하는 함수입니다. 이것은 기본 `createConnection` 함수를 재정의하기 위해 사용자 정의 `Agent` 클래스를 만드는 것을 피하기 위해 사용될 수 있습니다. 자세한 내용은 [`agent.createConnection()`](/ko/nodejs/api/http#agentcreateconnectionoptions-callback)을 참조하십시오. 모든 [`Duplex`](/ko/nodejs/api/stream#class-streamduplex) 스트림은 유효한 반환 값입니다.
    - `defaultPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로토콜의 기본 포트입니다. **기본값:** `Agent`가 사용되는 경우 `agent.defaultPort`, 그렇지 않으면 `undefined`입니다.
    - `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `host` 또는 `hostname`을 확인할 때 사용할 IP 주소 패밀리입니다. 유효한 값은 `4` 또는 `6`입니다. 지정하지 않으면 IP v4와 v6가 모두 사용됩니다.
    - `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 요청 헤더를 포함하는 객체입니다.
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 선택적 [`dns.lookup()` 힌트](/ko/nodejs/api/dns#supported-getaddrinfo-flags)입니다.
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 요청을 보낼 서버의 도메인 이름 또는 IP 주소입니다. **기본값:** `'localhost'`.
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `host`의 별칭입니다. [`url.parse()`](/ko/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost)를 지원하기 위해 `host`와 `hostname`이 모두 지정된 경우 `hostname`이 사용됩니다.
    - `insecureHTTPParser` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`로 설정하면 관용 플래그가 활성화된 HTTP 파서를 사용합니다. 안전하지 않은 파서를 사용하는 것은 피해야 합니다. 자세한 내용은 [`--insecure-http-parser`](/ko/nodejs/api/cli#--insecure-http-parser)를 참조하십시오. **기본값:** `false`
    - `joinDuplicateHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 중복을 삭제하는 대신 요청에서 여러 헤더의 필드 라인 값을 `, `로 결합합니다. 자세한 내용은 [`message.headers`](/ko/nodejs/api/http#messageheaders)를 참조하십시오. **기본값:** `false`.
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 네트워크 연결에 바인딩할 로컬 인터페이스입니다.
    - `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 연결할 로컬 포트입니다.
    - `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 사용자 정의 조회 함수입니다. **기본값:** [`dns.lookup()`](/ko/nodejs/api/dns#dnslookuphostname-options-callback).
    - `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 서버에서 수신한 응답에 대해 [`--max-http-header-size`](/ko/nodejs/api/cli#--max-http-header-sizesize)(응답 헤더의 최대 길이(바이트)) 값을 선택적으로 재정의합니다. **기본값:** 16384(16KiB).
    - `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) HTTP 요청 메서드를 지정하는 문자열입니다. **기본값:** `'GET'`.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 요청 경로입니다. 쿼리 문자열이 있는 경우 포함해야 합니다. 예: `'/index.html?page=12'`. 요청 경로에 잘못된 문자가 포함된 경우 예외가 발생합니다. 현재는 공백만 거부되지만 나중에 변경될 수 있습니다. **기본값:** `'/'`.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 원격 서버의 포트입니다. **기본값:** 설정된 경우 `defaultPort`, 그렇지 않으면 `80`입니다.
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 사용할 프로토콜입니다. **기본값:** `'http:'`.
    - `setDefaultHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): `Connection`, `Content-Length`, `Transfer-Encoding` 및 `Host`와 같은 기본 헤더를 자동으로 추가할지 여부를 지정합니다. `false`로 설정하면 필요한 모든 헤더를 수동으로 추가해야 합니다. 기본값은 `true`입니다.
    - `setHost` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type): `Host` 헤더를 자동으로 추가할지 여부를 지정합니다. 제공되면 `setDefaultHeaders`를 재정의합니다. 기본값은 `true`입니다.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal): 진행 중인 요청을 중단하는 데 사용할 수 있는 AbortSignal입니다.
    - `socketPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Unix 도메인 소켓입니다. `host` 또는 `port` 중 하나가 지정된 경우 사용할 수 없습니다. TCP 소켓을 지정하기 때문입니다.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type): 소켓 제한 시간을 밀리초 단위로 지정하는 숫자입니다. 이것은 소켓이 연결되기 전에 제한 시간을 설정합니다.
    - `uniqueHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 한 번만 보내야 하는 요청 헤더 목록입니다. 헤더 값이 배열이면 항목이 `; `를 사용하여 결합됩니다.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<http.ClientRequest\>](/ko/nodejs/api/http#class-httpclientrequest)

[`socket.connect()`](/ko/nodejs/api/net#socketconnectoptions-connectlistener)의 `options`도 지원됩니다.

Node.js는 HTTP 요청을 만들기 위해 서버당 여러 연결을 유지 관리합니다. 이 함수를 사용하면 요청을 투명하게 발행할 수 있습니다.

`url`은 문자열 또는 [`URL`](/ko/nodejs/api/url#the-whatwg-url-api) 객체일 수 있습니다. `url`이 문자열인 경우 [`new URL()`](/ko/nodejs/api/url#new-urlinput-base)로 자동으로 구문 분석됩니다. [`URL`](/ko/nodejs/api/url#the-whatwg-url-api) 객체인 경우 자동으로 일반 `options` 객체로 변환됩니다.

`url`과 `options`가 모두 지정된 경우 객체가 병합되고 `options` 속성이 우선 순위를 갖습니다.

선택적 `callback` 매개변수는 [`'response'`](/ko/nodejs/api/http#event-response) 이벤트에 대한 일회성 리스너로 추가됩니다.

`http.request()`는 [`http.ClientRequest`](/ko/nodejs/api/http#class-httpclientrequest) 클래스의 인스턴스를 반환합니다. `ClientRequest` 인스턴스는 쓰기 가능한 스트림입니다. POST 요청으로 파일을 업로드해야 하는 경우 `ClientRequest` 객체에 씁니다.

::: code-group
```js [ESM]
import http from 'node:http';
import { Buffer } from 'node:buffer';

const postData = JSON.stringify({
  'msg': 'Hello World!',
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
```

```js [CJS]
const http = require('node:http');

const postData = JSON.stringify({
  'msg': 'Hello World!',
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
```
:::

예제에서 `req.end()`가 호출되었습니다. `http.request()`를 사용하면 요청 본문에 기록된 데이터가 없더라도 요청의 끝을 나타내기 위해 항상 `req.end()`를 호출해야 합니다.

요청 중에 오류가 발생하면(DNS 확인, TCP 수준 오류 또는 실제 HTTP 구문 분석 오류) 반환된 요청 객체에서 `'error'` 이벤트가 발생합니다. 모든 `'error'` 이벤트와 마찬가지로 리스너가 등록되지 않으면 오류가 throw됩니다.

주의해야 할 몇 가지 특수 헤더가 있습니다.

- 'Connection: keep-alive'를 보내면 Node.js에 서버에 대한 연결이 다음 요청까지 유지되어야 함을 알립니다.
- 'Content-Length' 헤더를 보내면 기본 청크 분할 인코딩이 비활성화됩니다.
- 'Expect' 헤더를 보내면 요청 헤더가 즉시 전송됩니다. 일반적으로 'Expect: 100-continue'를 보낼 때 제한 시간과 `'continue'` 이벤트에 대한 리스너를 모두 설정해야 합니다. 자세한 내용은 RFC 2616 섹션 8.2.3을 참조하십시오.
- Authorization 헤더를 보내면 `auth` 옵션을 사용하여 기본 인증을 계산하는 것을 재정의합니다.

[`URL`](/ko/nodejs/api/url#the-whatwg-url-api)을 `options`로 사용하는 예제:

```js [ESM]
const options = new URL('http://abc:');

const req = http.request(options, (res) => {
  // ...
});
```

성공적인 요청에서 다음 이벤트가 다음 순서로 발생합니다.

- `'socket'`
- `'response'`
    - `res` 객체에서 `'data'`가 여러 번 발생합니다(`'data'`는 응답 본문이 비어 있는 경우(예: 대부분의 리디렉션에서) 전혀 발생하지 않습니다).
    - `res` 객체에서 `'end'`가 발생합니다.
  
 
- `'close'`

연결 오류의 경우 다음 이벤트가 발생합니다.

- `'socket'`
- `'error'`
- `'close'`

응답을 받기 전에 조기에 연결이 닫히는 경우 다음 이벤트가 다음 순서로 발생합니다.

- `'socket'`
- 메시지가 `'Error: socket hang up'`이고 코드가 `'ECONNRESET'`인 오류와 함께 `'error'`가 발생합니다.
- `'close'`

응답을 받은 후 조기에 연결이 닫히는 경우 다음 이벤트가 다음 순서로 발생합니다.

- `'socket'`
- `'response'`
    - `res` 객체에서 `'data'`가 여러 번 발생합니다.
  
 
- (여기서 연결이 닫힙니다)
- `res` 객체에서 `'aborted'`가 발생합니다.
- `'close'`
- 메시지가 `'Error: aborted'`이고 코드가 `'ECONNRESET'`인 오류와 함께 `res` 객체에서 `'error'`가 발생합니다.
- `res` 객체에서 `'close'`가 발생합니다.

소켓이 할당되기 전에 `req.destroy()`가 호출되면 다음 이벤트가 다음 순서로 발생합니다.

- (여기서 `req.destroy()`가 호출됩니다)
- 메시지가 `'Error: socket hang up'`이고 코드가 `'ECONNRESET'`인 오류 또는 `req.destroy()`가 호출된 오류와 함께 `'error'`가 발생합니다.
- `'close'`

연결이 성공하기 전에 `req.destroy()`가 호출되면 다음 이벤트가 다음 순서로 발생합니다.

- `'socket'`
- (여기서 `req.destroy()`가 호출됩니다)
- 메시지가 `'Error: socket hang up'`이고 코드가 `'ECONNRESET'`인 오류 또는 `req.destroy()`가 호출된 오류와 함께 `'error'`가 발생합니다.
- `'close'`

응답을 받은 후 `req.destroy()`가 호출되면 다음 이벤트가 다음 순서로 발생합니다.

- `'socket'`
- `'response'`
    - `res` 객체에서 `'data'`가 여러 번 발생합니다.
  
 
- (여기서 `req.destroy()`가 호출됩니다)
- `res` 객체에서 `'aborted'`가 발생합니다.
- `'close'`
- 메시지가 `'Error: aborted'`이고 코드가 `'ECONNRESET'`인 오류 또는 `req.destroy()`가 호출된 오류와 함께 `res` 객체에서 `'error'`가 발생합니다.
- `res` 객체에서 `'close'`가 발생합니다.

소켓이 할당되기 전에 `req.abort()`가 호출되면 다음 이벤트가 다음 순서로 발생합니다.

- (여기서 `req.abort()`가 호출됩니다)
- `'abort'`
- `'close'`

연결이 성공하기 전에 `req.abort()`가 호출되면 다음 이벤트가 다음 순서로 발생합니다.

- `'socket'`
- (여기서 `req.abort()`가 호출됩니다)
- `'abort'`
- 메시지가 `'Error: socket hang up'`이고 코드가 `'ECONNRESET'`인 오류와 함께 `'error'`가 발생합니다.
- `'close'`

응답을 받은 후 `req.abort()`가 호출되면 다음 이벤트가 다음 순서로 발생합니다.

- `'socket'`
- `'response'`
    - `res` 객체에서 `'data'`가 여러 번 발생합니다.
  
 
- (여기서 `req.abort()`가 호출됩니다)
- `'abort'`
- `res` 객체에서 `'aborted'`가 발생합니다.
- 메시지가 `'Error: aborted'`이고 코드가 `'ECONNRESET'`인 오류와 함께 `res` 객체에서 `'error'`가 발생합니다.
- `'close'`
- `res` 객체에서 `'close'`가 발생합니다.

`timeout` 옵션을 설정하거나 `setTimeout()` 함수를 사용해도 요청이 중단되거나 `'timeout'` 이벤트 추가 외에는 아무 작업도 수행되지 않습니다.

`AbortSignal`을 전달한 다음 해당 `AbortController`에서 `abort()`를 호출하면 요청에서 `.destroy()`를 호출하는 것과 동일하게 동작합니다. 특히 `'error'` 이벤트는 메시지가 `'AbortError: The operation was aborted'`이고 코드가 `'ABORT_ERR'`이며 `원인`이 제공된 경우 오류와 함께 발생합니다.


## `http.validateHeaderName(name[, label])` {#httpvalidateheadernamename-label}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v19.5.0, v18.14.0 | `label` 매개변수가 추가되었습니다. |
| v14.3.0 | 추가됨: v14.3.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 오류 메시지에 대한 레이블. **기본값:** `'Header name'`.

`res.setHeader(name, value)`가 호출될 때 수행되는 제공된 `name`에 대한 하위 수준 유효성 검사를 수행합니다.

유효하지 않은 값을 `name`으로 전달하면 `code: 'ERR_INVALID_HTTP_TOKEN'`으로 식별되는 [`TypeError`](/ko/nodejs/api/errors#class-typeerror)가 발생합니다.

HTTP 요청 또는 응답에 헤더를 전달하기 전에 이 메서드를 사용할 필요는 없습니다. HTTP 모듈은 이러한 헤더의 유효성을 자동으로 검사합니다.

예:

::: code-group
```js [ESM]
import { validateHeaderName } from 'node:http';

try {
  validateHeaderName('');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code); // --> 'ERR_INVALID_HTTP_TOKEN'
  console.error(err.message); // --> 'Header name must be a valid HTTP token [""]'
}
```

```js [CJS]
const { validateHeaderName } = require('node:http');

try {
  validateHeaderName('');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code); // --> 'ERR_INVALID_HTTP_TOKEN'
  console.error(err.message); // --> 'Header name must be a valid HTTP token [""]'
}
```
:::

## `http.validateHeaderValue(name, value)` {#httpvalidateheadervaluename-value}

**추가됨: v14.3.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`res.setHeader(name, value)`가 호출될 때 수행되는 제공된 `value`에 대한 하위 수준 유효성 검사를 수행합니다.

유효하지 않은 값을 `value`로 전달하면 [`TypeError`](/ko/nodejs/api/errors#class-typeerror)가 발생합니다.

- 정의되지 않은 값 오류는 `code: 'ERR_HTTP_INVALID_HEADER_VALUE'`로 식별됩니다.
- 잘못된 값 문자 오류는 `code: 'ERR_INVALID_CHAR'`로 식별됩니다.

HTTP 요청 또는 응답에 헤더를 전달하기 전에 이 메서드를 사용할 필요는 없습니다. HTTP 모듈은 이러한 헤더의 유효성을 자동으로 검사합니다.

예:

::: code-group
```js [ESM]
import { validateHeaderValue } from 'node:http';

try {
  validateHeaderValue('x-my-header', undefined);
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_HTTP_INVALID_HEADER_VALUE'); // --> true
  console.error(err.message); // --> 'Invalid value "undefined" for header "x-my-header"'
}

try {
  validateHeaderValue('x-my-header', 'oʊmɪɡə');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_INVALID_CHAR'); // --> true
  console.error(err.message); // --> 'Invalid character in header content ["x-my-header"]'
}
```

```js [CJS]
const { validateHeaderValue } = require('node:http');

try {
  validateHeaderValue('x-my-header', undefined);
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_HTTP_INVALID_HEADER_VALUE'); // --> true
  console.error(err.message); // --> 'Invalid value "undefined" for header "x-my-header"'
}

try {
  validateHeaderValue('x-my-header', 'oʊmɪɡə');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_INVALID_CHAR'); // --> true
  console.error(err.message); // --> 'Invalid character in header content ["x-my-header"]'
}
```
:::


## `http.setMaxIdleHTTPParsers(max)` {#httpsetmaxidlehttpparsersmax}

**추가된 버전: v18.8.0, v16.18.0**

- `max` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `1000`.

유휴 HTTP 파서의 최대 개수를 설정합니다.

## `WebSocket` {#websocket}

**추가된 버전: v22.5.0**

[`WebSocket`](/ko/nodejs/api/http#websocket)의 브라우저 호환 구현입니다.

