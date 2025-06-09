---
title: Node.js 문서 - HTTP/2
description: 이 페이지는 Node.js의 HTTP/2 모듈에 대한 포괄적인 문서를 제공하며, API, 사용 방법 및 HTTP/2 서버와 클라이언트 구현 예제를 자세히 설명합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - HTTP/2 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 이 페이지는 Node.js의 HTTP/2 모듈에 대한 포괄적인 문서를 제공하며, API, 사용 방법 및 HTTP/2 서버와 클라이언트 구현 예제를 자세히 설명합니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - HTTP/2 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 이 페이지는 Node.js의 HTTP/2 모듈에 대한 포괄적인 문서를 제공하며, API, 사용 방법 및 HTTP/2 서버와 클라이언트 구현 예제를 자세히 설명합니다.
---


# HTTP/2 {#http/2}

::: info [History]
| Version | Changes |
| --- | --- |
| v15.0.0 | `host` 헤더( `:authority` 유무와 관계없이)를 가진 요청을 보내고 받을 수 있습니다. |
| v15.3.0, v14.17.0 | AbortSignal로 요청을 중단할 수 있습니다. |
| v10.10.0 | HTTP/2가 이제 안정되었습니다. 이전에는 실험적이었습니다. |
| v8.4.0 | 추가됨: v8.4.0 |
:::

::: tip [Stable: 2 - 안정적]
[Stable: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

**소스 코드:** [lib/http2.js](https://github.com/nodejs/node/blob/v23.5.0/lib/http2.js)

`node:http2` 모듈은 [HTTP/2](https://tools.ietf.org/html/rfc7540) 프로토콜의 구현을 제공합니다. 다음과 같이 액세스할 수 있습니다.

```js [ESM]
const http2 = require('node:http2');
```
## 암호화 지원이 불가능한지 확인하기 {#determining-if-crypto-support-is-unavailable}

Node.js는 `node:crypto` 모듈에 대한 지원을 포함하지 않고 빌드될 수 있습니다. 이러한 경우, `node:http2`에서 `import`를 시도하거나 `require('node:http2')`를 호출하면 오류가 발생합니다.

CommonJS를 사용하는 경우, try/catch를 사용하여 발생하는 오류를 잡을 수 있습니다.

```js [CJS]
let http2;
try {
  http2 = require('node:http2');
} catch (err) {
  console.error('http2 지원이 비활성화되었습니다!');
}
```
어휘적 ESM `import` 키워드를 사용하는 경우, 모듈 로드를 시도하기 *전에* `process.on('uncaughtException')`에 대한 핸들러가 등록된 경우에만 오류를 잡을 수 있습니다 (예: preload 모듈 사용).

ESM을 사용하는 경우, 코드가 암호화 지원이 활성화되지 않은 Node.js 빌드에서 실행될 가능성이 있다면, 어휘적 `import` 키워드 대신 [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) 함수를 사용하는 것을 고려하십시오.

```js [ESM]
let http2;
try {
  http2 = await import('node:http2');
} catch (err) {
  console.error('http2 지원이 비활성화되었습니다!');
}
```
## 핵심 API {#core-api}

핵심 API는 HTTP/2 프로토콜 기능을 지원하도록 특별히 설계된 낮은 수준의 인터페이스를 제공합니다. 기존 [HTTP/1](/ko/nodejs/api/http) 모듈 API와의 호환성을 위해 설계되지 *않았습니다*. 그러나 [호환성 API](/ko/nodejs/api/http2#compatibility-api)는 그렇습니다.

`http2` 핵심 API는 `http` API보다 클라이언트와 서버 간에 훨씬 더 대칭적입니다. 예를 들어, `'error'`, `'connect'`, `'stream'`과 같은 대부분의 이벤트는 클라이언트 측 코드 또는 서버 측 코드에서 발생할 수 있습니다.


### 서버 측 예제 {#server-side-example}

다음은 Core API를 사용하는 간단한 HTTP/2 서버를 보여줍니다. [암호화되지 않은 HTTP/2](https://http2.github.io/faq/#does-http2-require-encryption)를 지원하는 것으로 알려진 브라우저가 없으므로 브라우저 클라이언트와 통신할 때는 [`http2.createSecureServer()`](/ko/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler)를 사용해야 합니다.

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const server = createSecureServer({
  key: readFileSync('localhost-privkey.pem'),
  cert: readFileSync('localhost-cert.pem'),
});

server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // stream은 Duplex입니다.
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createSecureServer({
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem'),
});
server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // stream은 Duplex입니다.
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```
:::

이 예제의 인증서와 키를 생성하려면 다음을 실행합니다.

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout localhost-privkey.pem -out localhost-cert.pem
```
### 클라이언트 측 예제 {#client-side-example}

다음은 HTTP/2 클라이언트를 보여줍니다.

::: code-group
```js [ESM]
import { connect } from 'node:http2';
import { readFileSync } from 'node:fs';

const client = connect('https://localhost:8443', {
  ca: readFileSync('localhost-cert.pem'),
});
client.on('error', (err) => console.error(err));

const req = client.request({ ':path': '/' });

req.on('response', (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }
});

req.setEncoding('utf8');
let data = '';
req.on('data', (chunk) => { data += chunk; });
req.on('end', () => {
  console.log(`\n${data}`);
  client.close();
});
req.end();
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const client = http2.connect('https://localhost:8443', {
  ca: fs.readFileSync('localhost-cert.pem'),
});
client.on('error', (err) => console.error(err));

const req = client.request({ ':path': '/' });

req.on('response', (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }
});

req.setEncoding('utf8');
let data = '';
req.on('data', (chunk) => { data += chunk; });
req.on('end', () => {
  console.log(`\n${data}`);
  client.close();
});
req.end();
```
:::


### 클래스: `Http2Session` {#class-http2session}

**추가된 버전: v8.4.0**

- 확장: [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter)

`http2.Http2Session` 클래스의 인스턴스는 HTTP/2 클라이언트와 서버 간의 활성 통신 세션을 나타냅니다. 이 클래스의 인스턴스는 사용자 코드에서 직접 생성하도록 의도되지 않았습니다.

각 `Http2Session` 인스턴스는 서버 또는 클라이언트로 작동하는지에 따라 약간 다른 동작을 보입니다. `http2session.type` 속성을 사용하여 `Http2Session`이 작동하는 모드를 확인할 수 있습니다. 서버 측에서는 사용자 코드가 `Http2Session` 객체를 직접 사용하는 경우가 드물며, 대부분의 작업은 일반적으로 `Http2Server` 또는 `Http2Stream` 객체와의 상호 작용을 통해 수행됩니다.

사용자 코드는 `Http2Session` 인스턴스를 직접 생성하지 않습니다. 서버 측 `Http2Session` 인스턴스는 새로운 HTTP/2 연결이 수신될 때 `Http2Server` 인스턴스에 의해 생성됩니다. 클라이언트 측 `Http2Session` 인스턴스는 `http2.connect()` 메서드를 사용하여 생성됩니다.

#### `Http2Session` 및 소켓 {#http2session-and-sockets}

모든 `Http2Session` 인스턴스는 생성될 때 정확히 하나의 [`net.Socket`](/ko/nodejs/api/net#class-netsocket) 또는 [`tls.TLSSocket`](/ko/nodejs/api/tls#class-tlstlssocket)과 연결됩니다. `Socket` 또는 `Http2Session`이 소멸되면 둘 다 소멸됩니다.

HTTP/2 프로토콜에서 요구하는 특정 직렬화 및 처리 요구 사항으로 인해 사용자 코드가 `Http2Session`에 바인딩된 `Socket` 인스턴스에서 데이터를 읽거나 쓰는 것은 권장되지 않습니다. 그렇게 하면 HTTP/2 세션이 불확실한 상태가 되어 세션과 소켓이 사용할 수 없게 될 수 있습니다.

`Socket`이 `Http2Session`에 바인딩되면 사용자 코드는 `Http2Session`의 API에만 의존해야 합니다.

#### 이벤트: `'close'` {#event-close}

**추가된 버전: v8.4.0**

`'close'` 이벤트는 `Http2Session`이 소멸된 후 한 번 발생합니다. 해당 리스너는 인수를 예상하지 않습니다.

#### 이벤트: `'connect'` {#event-connect}

**추가된 버전: v8.4.0**

- `session` [\<Http2Session\>](/ko/nodejs/api/http2#class-http2session)
- `socket` [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket)

`'connect'` 이벤트는 `Http2Session`이 원격 피어에 성공적으로 연결되어 통신을 시작할 수 있을 때 발생합니다.

사용자 코드는 일반적으로 이 이벤트를 직접 수신하지 않습니다.


#### 이벤트: `'error'` {#event-error}

**추가된 버전: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`'error'` 이벤트는 `Http2Session`을 처리하는 동안 오류가 발생하면 발생합니다.

#### 이벤트: `'frameError'` {#event-frameerror}

**추가된 버전: v8.4.0**

- `type` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프레임 유형.
- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 오류 코드.
- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 스트림 ID (또는 프레임이 스트림과 연결되지 않은 경우 `0`).

`'frameError'` 이벤트는 세션에서 프레임을 보내려고 시도하는 동안 오류가 발생하면 발생합니다. 전송할 수 없는 프레임이 특정 `Http2Stream`과 연결된 경우, `Http2Stream`에서 `'frameError'` 이벤트를 발생시키려고 시도합니다.

`'frameError'` 이벤트가 스트림과 연결된 경우, 스트림은 `'frameError'` 이벤트 직후에 닫히고 제거됩니다. 이벤트가 스트림과 연결되지 않은 경우, `Http2Session`은 `'frameError'` 이벤트 직후에 종료됩니다.

#### 이벤트: `'goaway'` {#event-goaway}

**추가된 버전: v8.4.0**

- `errorCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `GOAWAY` 프레임에 지정된 HTTP/2 오류 코드.
- `lastStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 원격 피어가 성공적으로 처리한 마지막 스트림의 ID (또는 ID가 지정되지 않은 경우 `0`).
- `opaqueData` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) 추가 불투명 데이터가 `GOAWAY` 프레임에 포함된 경우, 해당 데이터를 포함하는 `Buffer` 인스턴스가 전달됩니다.

`'goaway'` 이벤트는 `GOAWAY` 프레임이 수신될 때 발생합니다.

`'goaway'` 이벤트가 발생하면 `Http2Session` 인스턴스가 자동으로 종료됩니다.


#### Event: `'localSettings'` {#event-localsettings}

**Added in: v8.4.0**

- `settings` [\<HTTP/2 Settings Object\>](/ko/nodejs/api/http2#settings-object) 수신된 `SETTINGS` 프레임의 복사본입니다.

`'localSettings'` 이벤트는 승인 `SETTINGS` 프레임이 수신될 때 발생합니다.

새 설정을 제출하기 위해 `http2session.settings()`를 사용하는 경우, 수정된 설정은 `'localSettings'` 이벤트가 발생할 때까지 적용되지 않습니다.

```js [ESM]
session.settings({ enablePush: false });

session.on('localSettings', (settings) => {
  /* 새 설정 사용 */
});
```
#### Event: `'ping'` {#event-ping}

**Added in: v10.12.0**

- `payload` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) `PING` 프레임 8바이트 페이로드

`'ping'` 이벤트는 연결된 피어로부터 `PING` 프레임이 수신될 때마다 발생합니다.

#### Event: `'remoteSettings'` {#event-remotesettings}

**Added in: v8.4.0**

- `settings` [\<HTTP/2 Settings Object\>](/ko/nodejs/api/http2#settings-object) 수신된 `SETTINGS` 프레임의 복사본입니다.

`'remoteSettings'` 이벤트는 연결된 피어로부터 새로운 `SETTINGS` 프레임이 수신될 때 발생합니다.

```js [ESM]
session.on('remoteSettings', (settings) => {
  /* 새 설정 사용 */
});
```
#### Event: `'stream'` {#event-stream}

**Added in: v8.4.0**

- `stream` [\<Http2Stream\>](/ko/nodejs/api/http2#class-http2stream) 스트림에 대한 참조
- `headers` [\<HTTP/2 Headers Object\>](/ko/nodejs/api/http2#headers-object) 헤더를 설명하는 객체
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 관련 숫자 플래그
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 각 값에 이어 원시 헤더 이름을 포함하는 배열입니다.

`'stream'` 이벤트는 새로운 `Http2Stream`이 생성될 때 발생합니다.

```js [ESM]
session.on('stream', (stream, headers, flags) => {
  const method = headers[':method'];
  const path = headers[':path'];
  // ...
  stream.respond({
    ':status': 200,
    'content-type': 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```
서버 측에서 사용자 코드는 일반적으로 이 이벤트를 직접 수신하지 않고, 대신 아래 예와 같이 `http2.createServer()` 및 `http2.createSecureServer()`에서 반환된 `net.Server` 또는 `tls.Server` 인스턴스에서 발생하는 `'stream'` 이벤트에 대한 핸들러를 등록합니다.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

// 암호화되지 않은 HTTP/2 서버 생성
const server = createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.on('error', (error) => console.error(error));
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```

```js [CJS]
const http2 = require('node:http2');

// 암호화되지 않은 HTTP/2 서버 생성
const server = http2.createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.on('error', (error) => console.error(error));
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```
:::

HTTP/2 스트림과 네트워크 소켓이 1:1 대응 관계에 있지는 않지만, 네트워크 오류는 각 개별 스트림을 파괴하므로 위와 같이 스트림 수준에서 처리해야 합니다.


#### 이벤트: `'timeout'` {#event-timeout}

**추가된 버전: v8.4.0**

`http2session.setTimeout()` 메서드를 사용하여 이 `Http2Session`에 대한 타임아웃 기간을 설정한 후, 구성된 밀리초 수 이후에 `Http2Session`에 활동이 없으면 `'timeout'` 이벤트가 발생합니다. 해당 리스너는 어떠한 인수도 기대하지 않습니다.

```js [ESM]
session.setTimeout(2000);
session.on('timeout', () => { /* .. */ });
```
#### `http2session.alpnProtocol` {#http2sessionalpnprotocol}

**추가된 버전: v9.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`Http2Session`이 아직 소켓에 연결되지 않은 경우 `undefined`가 되고, `Http2Session`이 `TLSSocket`에 연결되지 않은 경우 `h2c`가 되며, 연결된 `TLSSocket` 자체의 `alpnProtocol` 속성 값을 반환합니다.

#### `http2session.close([callback])` {#http2sessionclosecallback}

**추가된 버전: v9.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

기존 스트림이 스스로 완료되도록 허용하고 새 `Http2Stream` 인스턴스가 생성되지 않도록 하여 `Http2Session`을 정상적으로 닫습니다. 닫히면 열린 `Http2Stream` 인스턴스가 없는 경우 `http2session.destroy()`가 호출될 *수 있습니다*.

지정된 경우 `callback` 함수는 `'close'` 이벤트에 대한 핸들러로 등록됩니다.

#### `http2session.closed` {#http2sessionclosed}

**추가된 버전: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

이 `Http2Session` 인스턴스가 닫힌 경우 `true`이고, 그렇지 않으면 `false`입니다.

#### `http2session.connecting` {#http2sessionconnecting}

**추가된 버전: v10.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

이 `Http2Session` 인스턴스가 아직 연결 중이면 `true`이고, `connect` 이벤트를 발생시키거나 `http2.connect` 콜백을 호출하기 전에 `false`로 설정됩니다.

#### `http2session.destroy([error][, code])` {#http2sessiondestroyerror-code}

**추가된 버전: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) `Http2Session`이 오류로 인해 파괴되는 경우의 `Error` 객체입니다.
- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 최종 `GOAWAY` 프레임에 보낼 HTTP/2 오류 코드입니다. 지정되지 않고 `error`가 정의되지 않은 경우 기본값은 `INTERNAL_ERROR`이고, 그렇지 않으면 기본값은 `NO_ERROR`입니다.

`Http2Session`과 관련된 `net.Socket` 또는 `tls.TLSSocket`을 즉시 종료합니다.

파괴되면 `Http2Session`은 `'close'` 이벤트를 발생시킵니다. `error`가 정의되지 않은 경우 `'error'` 이벤트는 `'close'` 이벤트 바로 전에 발생합니다.

`Http2Session`과 관련된 열린 `Http2Stream`이 남아 있는 경우 해당 스트림도 파괴됩니다.


#### `http2session.destroyed` {#http2sessiondestroyed}

**추가된 버전: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

이 `Http2Session` 인스턴스가 소멸되어 더 이상 사용해서는 안 되면 `true`이고, 그렇지 않으면 `false`입니다.

#### `http2session.encrypted` {#http2sessionencrypted}

**추가된 버전: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`Http2Session` 세션 소켓이 아직 연결되지 않은 경우 값은 `undefined`이고, `Http2Session`이 `TLSSocket`으로 연결된 경우 `true`이고, `Http2Session`이 다른 종류의 소켓 또는 스트림에 연결된 경우 `false`입니다.

#### `http2session.goaway([code[, lastStreamID[, opaqueData]]])` {#http2sessiongoawaycode-laststreamid-opaquedata}

**추가된 버전: v9.4.0**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) HTTP/2 오류 코드
- `lastStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 마지막으로 처리된 `Http2Stream`의 숫자 ID
- `opaqueData` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) `GOAWAY` 프레임 내에 포함될 추가 데이터를 포함하는 `TypedArray` 또는 `DataView` 인스턴스입니다.

`Http2Session`을 종료 *하지 않고* 연결된 피어에게 `GOAWAY` 프레임을 전송합니다.

#### `http2session.localSettings` {#http2sessionlocalsettings}

**추가된 버전: v8.4.0**

- [\<HTTP/2 설정 객체\>](/ko/nodejs/api/http2#settings-object)

이 `Http2Session`의 현재 로컬 설정을 설명하는 프로토타입 없는 객체입니다. 로컬 설정은 *이* `Http2Session` 인스턴스에 로컬합니다.

#### `http2session.originSet` {#http2sessionoriginset}

**추가된 버전: v9.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`Http2Session`이 `TLSSocket`에 연결된 경우 `originSet` 속성은 `Http2Session`이 권한이 있는 것으로 간주될 수 있는 출처의 `Array`를 반환합니다.

`originSet` 속성은 보안 TLS 연결을 사용할 때만 사용할 수 있습니다.


#### `http2session.pendingSettingsAck` {#http2sessionpendingsettingsack}

**Added in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`Http2Session`이 전송된 `SETTINGS` 프레임의 승인을 현재 기다리고 있는지 여부를 나타냅니다. `http2session.settings()` 메서드를 호출한 후에는 `true`가 됩니다. 전송된 모든 `SETTINGS` 프레임이 승인되면 `false`가 됩니다.

#### `http2session.ping([payload, ]callback)` {#http2sessionpingpayload-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v8.9.3 | Added in: v8.9.3 |
:::

- `payload` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 선택적 ping 페이로드입니다.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

연결된 HTTP/2 피어로 `PING` 프레임을 보냅니다. `callback` 함수를 제공해야 합니다. 이 메서드는 `PING`이 전송된 경우 `true`를 반환하고, 그렇지 않으면 `false`를 반환합니다.

미해결 (승인되지 않은) ping의 최대 수는 `maxOutstandingPings` 구성 옵션에 의해 결정됩니다. 기본 최대값은 10입니다.

제공된 경우 `payload`는 `PING`과 함께 전송되고 ping 승인과 함께 반환될 8바이트 데이터가 포함된 `Buffer`, `TypedArray` 또는 `DataView`여야 합니다.

콜백은 세 개의 인수로 호출됩니다. `PING`이 성공적으로 승인된 경우 `null`이 될 오류 인수, ping이 전송된 이후 승인이 수신될 때까지 경과된 밀리초 수를 보고하는 `duration` 인수, 8바이트 `PING` 페이로드를 포함하는 `Buffer`입니다.

```js [ESM]
session.ping(Buffer.from('abcdefgh'), (err, duration, payload) => {
  if (!err) {
    console.log(`Ping acknowledged in ${duration} milliseconds`);
    console.log(`With payload '${payload.toString()}'`);
  }
});
```
`payload` 인수가 지정되지 않은 경우 기본 페이로드는 `PING` 기간의 시작을 표시하는 64비트 타임스탬프 (리틀 엔디안)가 됩니다.


#### `http2session.ref()` {#http2sessionref}

**추가된 버전: v9.4.0**

이 `Http2Session` 인스턴스의 기본 [`net.Socket`](/ko/nodejs/api/net#class-netsocket)에서 [`ref()`](/ko/nodejs/api/net#socketref)를 호출합니다.

#### `http2session.remoteSettings` {#http2sessionremotesettings}

**추가된 버전: v8.4.0**

- [\<HTTP/2 설정 객체\>](/ko/nodejs/api/http2#settings-object)

이 `Http2Session`의 현재 원격 설정을 설명하는 프로토타입 없는 객체입니다. 원격 설정은 *연결된* HTTP/2 피어에 의해 설정됩니다.

#### `http2session.setLocalWindowSize(windowSize)` {#http2sessionsetlocalwindowsizewindowsize}

**추가된 버전: v15.3.0, v14.18.0**

- `windowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

로컬 엔드포인트의 윈도우 크기를 설정합니다. `windowSize`는 설정할 총 윈도우 크기이며 델타가 아닙니다.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

const server = createServer();
const expectedWindowSize = 2 ** 20;
server.on('session', (session) => {

  // 로컬 윈도우 크기를 2 ** 20으로 설정
  session.setLocalWindowSize(expectedWindowSize);
});
```

```js [CJS]
const http2 = require('node:http2');

const server = http2.createServer();
const expectedWindowSize = 2 ** 20;
server.on('session', (session) => {

  // 로컬 윈도우 크기를 2 ** 20으로 설정
  session.setLocalWindowSize(expectedWindowSize);
});
```
:::

http2 클라이언트의 경우 적절한 이벤트는 `'connect'` 또는 `'remoteSettings'`입니다.

#### `http2session.setTimeout(msecs, callback)` {#http2sessionsettimeoutmsecs-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 잘못된 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v8.4.0 | 추가된 버전: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

`msecs` 밀리초 후에 `Http2Session`에서 활동이 없을 때 호출되는 콜백 함수를 설정하는 데 사용됩니다. 주어진 `callback`은 `'timeout'` 이벤트에 대한 리스너로 등록됩니다.


#### `http2session.socket` {#http2sessionsocket}

**Added in: v8.4.0**

- [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/ko/nodejs/api/tls#class-tlstlssocket)

`net.Socket` (또는 `tls.TLSSocket`) 역할을 하지만 HTTP/2에서 안전하게 사용할 수 있는 메서드로 사용 가능한 메서드를 제한하는 `Proxy` 객체를 반환합니다.

`destroy`, `emit`, `end`, `pause`, `read`, `resume` 및 `write`는 `ERR_HTTP2_NO_SOCKET_MANIPULATION` 코드로 오류를 발생시킵니다. 자세한 내용은 [`Http2Session` 및 소켓](/ko/nodejs/api/http2#http2session-and-sockets)을 참조하십시오.

`setTimeout` 메서드는 이 `Http2Session`에서 호출됩니다.

다른 모든 상호 작용은 소켓으로 직접 라우팅됩니다.

#### `http2session.state` {#http2sessionstate}

**Added in: v8.4.0**

`Http2Session`의 현재 상태에 대한 다양한 정보를 제공합니다.

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `effectiveLocalWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session`의 현재 로컬 (수신) 흐름 제어 윈도우 크기입니다.
    - `effectiveRecvDataLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 마지막 흐름 제어 `WINDOW_UPDATE` 이후 수신된 바이트 수입니다.
    - `nextStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 `Http2Session`에 의해 새 `Http2Stream`이 생성될 때 다음에 사용될 숫자 식별자입니다.
    - `localWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 원격 피어가 `WINDOW_UPDATE`를 받지 않고 보낼 수 있는 바이트 수입니다.
    - `lastProcStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `HEADERS` 또는 `DATA` 프레임이 가장 최근에 수신된 `Http2Stream`의 숫자 ID입니다.
    - `remoteWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 `Http2Session`이 `WINDOW_UPDATE`를 받지 않고 보낼 수 있는 바이트 수입니다.
    - `outboundQueueSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 `Http2Session`의 아웃바운드 큐에 현재 있는 프레임 수입니다.
    - `deflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 아웃바운드 헤더 압축 상태 테이블의 현재 바이트 크기입니다.
    - `inflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 인바운드 헤더 압축 상태 테이블의 현재 바이트 크기입니다.
  
 

이 `Http2Session`의 현재 상태를 설명하는 객체입니다.


#### `http2session.settings([settings][, callback])` {#http2sessionsettingssettings-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 잘못된 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 throw됩니다. |
| v8.4.0 | v8.4.0에 추가됨 |
:::

- `settings` [\<HTTP/2 설정 객체\>](/ko/nodejs/api/http2#settings-object)
- `callback` [\<함수\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 세션이 연결되면 호출되거나 세션이 이미 연결된 경우 즉시 호출되는 콜백입니다.
    - `err` [\<오류\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
    - `settings` [\<HTTP/2 설정 객체\>](/ko/nodejs/api/http2#settings-object) 업데이트된 `settings` 객체입니다.
    - `duration` [\<정수\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

이 `Http2Session`에 대한 현재 로컬 설정을 업데이트하고 연결된 HTTP/2 피어에게 새 `SETTINGS` 프레임을 보냅니다.

호출되면 세션이 새 설정을 승인하기 위해 원격 피어를 기다리는 동안 `http2session.pendingSettingsAck` 속성은 `true`가 됩니다.

새 설정은 `SETTINGS` 승인이 수신되고 `'localSettings'` 이벤트가 발생할 때까지 적용되지 않습니다. 승인이 아직 보류 중인 동안 여러 `SETTINGS` 프레임을 보낼 수 있습니다.

#### `http2session.type` {#http2sessiontype}

**추가된 버전: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

이 `Http2Session` 인스턴스가 서버인 경우 `http2session.type`은 `http2.constants.NGHTTP2_SESSION_SERVER`와 같고, 인스턴스가 클라이언트인 경우 `http2.constants.NGHTTP2_SESSION_CLIENT`와 같습니다.

#### `http2session.unref()` {#http2sessionunref}

**추가된 버전: v9.4.0**

이 `Http2Session` 인스턴스의 기본 [`net.Socket`](/ko/nodejs/api/net#class-netsocket)에서 [`unref()`](/ko/nodejs/api/net#socketunref)를 호출합니다.


### 클래스: `ServerHttp2Session` {#class-serverhttp2session}

**추가된 버전: v8.4.0**

- 확장: [\<Http2Session\>](/ko/nodejs/api/http2#class-http2session)

#### `serverhttp2session.altsvc(alt, originOrStream)` {#serverhttp2sessionaltsvcalt-originorstream}

**추가된 버전: v9.4.0**

- `alt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [RFC 7838](https://tools.ietf.org/html/rfc7838)에 정의된 대체 서비스 구성에 대한 설명입니다.
- `originOrStream` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) origin을 지정하는 URL 문자열(`origin` 속성을 가진 `Object`) 또는 `http2stream.id` 속성에 의해 제공되는 활성 `Http2Stream`의 숫자 식별자입니다.

연결된 클라이언트에 `ALTSVC` 프레임([RFC 7838](https://tools.ietf.org/html/rfc7838)에 정의됨)을 제출합니다.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

const server = createServer();
server.on('session', (session) => {
  // origin https://example.org:80에 대한 altsvc 설정
  session.altsvc('h2=":8000"', 'https://example.org:80');
});

server.on('stream', (stream) => {
  // 특정 스트림에 대한 altsvc 설정
  stream.session.altsvc('h2=":8000"', stream.id);
});
```

```js [CJS]
const http2 = require('node:http2');

const server = http2.createServer();
server.on('session', (session) => {
  // origin https://example.org:80에 대한 altsvc 설정
  session.altsvc('h2=":8000"', 'https://example.org:80');
});

server.on('stream', (stream) => {
  // 특정 스트림에 대한 altsvc 설정
  stream.session.altsvc('h2=":8000"', stream.id);
});
```
:::

특정 스트림 ID로 `ALTSVC` 프레임을 보내는 것은 대체 서비스가 주어진 `Http2Stream`의 origin과 연관되어 있음을 나타냅니다.

`alt` 및 origin 문자열은 *반드시* ASCII 바이트만 포함해야 하며 ASCII 바이트 시퀀스로 엄격하게 해석됩니다. `'clear'`라는 특수 값은 주어진 도메인에 대해 이전에 설정된 대체 서비스를 지우기 위해 전달될 수 있습니다.

문자열이 `originOrStream` 인수로 전달되면 URL로 파싱되고 origin이 파생됩니다. 예를 들어 HTTP URL `'https://example.org/foo/bar'`의 origin은 ASCII 문자열 `'https://example.org'`입니다. 주어진 문자열을 URL로 파싱할 수 없거나 유효한 origin을 파생할 수 없는 경우 오류가 발생합니다.

`URL` 객체 또는 `origin` 속성이 있는 모든 객체를 `originOrStream`으로 전달할 수 있으며, 이 경우 `origin` 속성 값이 사용됩니다. `origin` 속성의 값은 *반드시* 올바르게 직렬화된 ASCII origin이어야 합니다.


#### 대체 서비스 지정 {#specifying-alternative-services}

`alt` 매개변수의 형식은 특정 호스트 및 포트와 관련된 "대체" 프로토콜의 쉼표로 구분된 목록을 포함하는 ASCII 문자열로 [RFC 7838](https://tools.ietf.org/html/rfc7838)에 의해 엄격하게 정의됩니다.

예를 들어 `'h2="example.org:81"'` 값은 HTTP/2 프로토콜이 TCP/IP 포트 81에서 호스트 `'example.org'`에서 사용 가능하다는 것을 나타냅니다. 호스트 및 포트는 반드시 따옴표(`"`) 문자 안에 포함되어야 합니다.

여러 개의 대안을 지정할 수 있습니다(예: `'h2="example.org:81", h2=":82"'`).

프로토콜 식별자(예제의 `'h2'`)는 유효한 [ALPN 프로토콜 ID](https://www.iana.org/assignments/tls-extensiontype-values/tls-extensiontype-values.xhtml#alpn-protocol-ids)일 수 있습니다.

이러한 값의 구문은 Node.js 구현에 의해 유효성이 검사되지 않으며 사용자 또는 피어로부터 제공된 대로 전달됩니다.

#### `serverhttp2session.origin(...origins)` {#serverhttp2sessionoriginorigins}

**추가된 버전: v10.12.0**

- `origins` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 개별 인수로 전달되는 하나 이상의 URL 문자열입니다.

서버가 신뢰할 수 있는 응답을 제공할 수 있는 오리진 세트를 알리기 위해 연결된 클라이언트에 `ORIGIN` 프레임([RFC 8336](https://tools.ietf.org/html/rfc8336)에 정의됨)을 제출합니다.

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
const options = getSecureOptionsSomehow();
const server = createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
server.on('session', (session) => {
  session.origin('https://example.com', 'https://example.org');
});
```

```js [CJS]
const http2 = require('node:http2');
const options = getSecureOptionsSomehow();
const server = http2.createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
server.on('session', (session) => {
  session.origin('https://example.com', 'https://example.org');
});
```
:::

문자열이 `origin`으로 전달되면 URL로 파싱되고 오리진이 파생됩니다. 예를 들어 HTTP URL `'https://example.org/foo/bar'`의 오리진은 ASCII 문자열 `'https://example.org'`입니다. 주어진 문자열을 URL로 파싱할 수 없거나 유효한 오리진을 파생할 수 없는 경우 오류가 발생합니다.

`URL` 객체 또는 `origin` 속성이 있는 객체를 `origin`으로 전달할 수 있으며, 이 경우 `origin` 속성의 값이 사용됩니다. `origin` 속성의 값은 적절하게 직렬화된 ASCII 오리진*이어야 합니다.

또는 `http2.createSecureServer()` 메서드를 사용하여 새 HTTP/2 서버를 만들 때 `origins` 옵션을 사용할 수 있습니다.

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
const options = getSecureOptionsSomehow();
options.origins = ['https://example.com', 'https://example.org'];
const server = createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
```

```js [CJS]
const http2 = require('node:http2');
const options = getSecureOptionsSomehow();
options.origins = ['https://example.com', 'https://example.org'];
const server = http2.createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
```
:::


### 클래스: `ClientHttp2Session` {#class-clienthttp2session}

**추가된 버전: v8.4.0**

- 확장: [\<Http2Session\>](/ko/nodejs/api/http2#class-http2session)

#### 이벤트: `'altsvc'` {#event-altsvc}

**추가된 버전: v9.4.0**

- `alt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `streamId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`'altsvc'` 이벤트는 클라이언트가 `ALTSVC` 프레임을 수신할 때마다 발생합니다. 이 이벤트는 `ALTSVC` 값, origin 및 스트림 ID와 함께 발생합니다. `ALTSVC` 프레임에 `origin`이 제공되지 않으면 `origin`은 빈 문자열이 됩니다.

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://example.org');

client.on('altsvc', (alt, origin, streamId) => {
  console.log(alt);
  console.log(origin);
  console.log(streamId);
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://example.org');

client.on('altsvc', (alt, origin, streamId) => {
  console.log(alt);
  console.log(origin);
  console.log(streamId);
});
```
:::

#### 이벤트: `'origin'` {#event-origin}

**추가된 버전: v10.12.0**

- `origins` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`'origin'` 이벤트는 클라이언트가 `ORIGIN` 프레임을 수신할 때마다 발생합니다. 이 이벤트는 `origin` 문자열의 배열과 함께 발생합니다. `http2session.originSet`은 수신된 origins를 포함하도록 업데이트됩니다.

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://example.org');

client.on('origin', (origins) => {
  for (let n = 0; n < origins.length; n++)
    console.log(origins[n]);
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://example.org');

client.on('origin', (origins) => {
  for (let n = 0; n < origins.length; n++)
    console.log(origins[n]);
});
```
:::

`'origin'` 이벤트는 보안 TLS 연결을 사용할 때만 발생합니다.


#### `clienthttp2session.request(headers[, options])` {#clienthttp2sessionrequestheaders-options}

**Added in: v8.4.0**

- `headers` [\<HTTP/2 헤더 객체\>](/ko/nodejs/api/http2#headers-object)
- `options` [\<객체\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `endStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `Http2Stream`의 *writable* 측이 초기에 닫혀야 하는 경우 `true`입니다. 페이로드 본문을 예상하지 않아야 하는 `GET` 요청을 보낼 때와 같습니다.
  - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이고 `parent`가 부모 스트림을 식별하는 경우 생성된 스트림이 부모의 유일한 직접 종속성이 되고, 다른 모든 기존 종속성은 새로 생성된 스트림의 종속성이 됩니다. **기본값:** `false`.
  - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 새로 생성된 스트림이 의존하는 스트림의 숫자 식별자를 지정합니다.
  - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 동일한 `parent`를 가진 다른 스트림과 관련된 스트림의 상대적 종속성을 지정합니다. 값은 `1`과 `256` 사이의 숫자입니다(포함).
  - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 `Http2Stream`은 마지막 `DATA` 프레임이 전송된 후 `'wantTrailers'` 이벤트를 발생시킵니다.
  - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 진행 중인 요청을 중단하는 데 사용할 수 있는 AbortSignal입니다.

- 반환값: [\<ClientHttp2Stream\>](/ko/nodejs/api/http2#class-clienthttp2stream)

HTTP/2 클라이언트 `Http2Session` 인스턴스에만 해당되며, `http2session.request()`는 연결된 서버에 HTTP/2 요청을 보내는 데 사용할 수 있는 `Http2Stream` 인스턴스를 생성하고 반환합니다.

`ClientHttp2Session`이 처음 생성되면 소켓이 아직 연결되지 않았을 수 있습니다. 이 시간 동안 `clienthttp2session.request()`가 호출되면 실제 요청은 소켓이 준비될 때까지 지연됩니다. 실제 요청이 실행되기 전에 `session`이 닫히면 `ERR_HTTP2_GOAWAY_SESSION`이 발생합니다.

이 메서드는 `http2session.type`이 `http2.constants.NGHTTP2_SESSION_CLIENT`와 같은 경우에만 사용할 수 있습니다.

::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';
const clientSession = connect('https://localhost:1234');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
} = constants;

const req = clientSession.request({ [HTTP2_HEADER_PATH]: '/' });
req.on('response', (headers) => {
  console.log(headers[HTTP2_HEADER_STATUS]);
  req.on('data', (chunk) => { /* .. */ });
  req.on('end', () => { /* .. */ });
});
```

```js [CJS]
const http2 = require('node:http2');
const clientSession = http2.connect('https://localhost:1234');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
} = http2.constants;

const req = clientSession.request({ [HTTP2_HEADER_PATH]: '/' });
req.on('response', (headers) => {
  console.log(headers[HTTP2_HEADER_STATUS]);
  req.on('data', (chunk) => { /* .. */ });
  req.on('end', () => { /* .. */ });
});
```
:::

`options.waitForTrailers` 옵션이 설정되면 보낼 페이로드 데이터의 마지막 청크를 대기열에 넣은 직후에 `'wantTrailers'` 이벤트가 발생합니다. 그런 다음 `http2stream.sendTrailers()` 메서드를 호출하여 후행 헤더를 피어에 보낼 수 있습니다.

`options.waitForTrailers`가 설정되면 최종 `DATA` 프레임이 전송될 때 `Http2Stream`이 자동으로 닫히지 않습니다. 사용자 코드는 `Http2Stream`을 닫으려면 `http2stream.sendTrailers()` 또는 `http2stream.close()`를 호출해야 합니다.

`options.signal`이 `AbortSignal`과 함께 설정되고 해당 `AbortController`에서 `abort`가 호출되면 요청은 `AbortError` 오류와 함께 `'error'` 이벤트를 발생시킵니다.

`:method` 및 `:path` 의사 헤더는 `headers` 내에 지정되지 않으며 각각 다음과 같이 기본값으로 설정됩니다.

- `:method` = `'GET'`
- `:path` = `/`


### 클래스: `Http2Stream` {#class-http2stream}

**추가된 버전: v8.4.0**

- 확장: [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)

`Http2Stream` 클래스의 각 인스턴스는 `Http2Session` 인스턴스를 통해 양방향 HTTP/2 통신 스트림을 나타냅니다. 단일 `Http2Session`은 수명 동안 최대 2-1개의 `Http2Stream` 인스턴스를 가질 수 있습니다.

사용자 코드는 `Http2Stream` 인스턴스를 직접 생성하지 않습니다. 대신, 이는 `Http2Session` 인스턴스를 통해 생성, 관리 및 사용자 코드에 제공됩니다. 서버에서 `Http2Stream` 인스턴스는 들어오는 HTTP 요청에 대한 응답으로 (`'stream'` 이벤트를 통해 사용자 코드에 전달됨) 또는 `http2stream.pushStream()` 메서드 호출에 대한 응답으로 생성됩니다. 클라이언트에서 `Http2Stream` 인스턴스는 `http2session.request()` 메서드가 호출될 때 또는 들어오는 `'push'` 이벤트에 대한 응답으로 생성되어 반환됩니다.

`Http2Stream` 클래스는 [`ServerHttp2Stream`](/ko/nodejs/api/http2#class-serverhttp2stream) 및 [`ClientHttp2Stream`](/ko/nodejs/api/http2#class-clienthttp2stream) 클래스의 기반이며, 각 클래스는 서버 또는 클라이언트 측에서만 사용됩니다.

모든 `Http2Stream` 인스턴스는 [`Duplex`](/ko/nodejs/api/stream#class-streamduplex) 스트림입니다. `Duplex`의 `Writable` 측은 연결된 피어로 데이터를 보내는 데 사용되고, `Readable` 측은 연결된 피어가 보낸 데이터를 받는 데 사용됩니다.

`Http2Stream`의 기본 텍스트 문자 인코딩은 UTF-8입니다. `Http2Stream`을 사용하여 텍스트를 보낼 때는 `'content-type'` 헤더를 사용하여 문자 인코딩을 설정하십시오.

```js [ESM]
stream.respond({
  'content-type': 'text/html; charset=utf-8',
  ':status': 200,
});
```
#### `Http2Stream` 라이프사이클 {#http2stream-lifecycle}

##### 생성 {#creation}

서버 측에서는 [`ServerHttp2Stream`](/ko/nodejs/api/http2#class-serverhttp2stream) 인스턴스가 다음 경우에 생성됩니다.

- 이전에 사용되지 않은 스트림 ID를 가진 새로운 HTTP/2 `HEADERS` 프레임이 수신된 경우
- `http2stream.pushStream()` 메서드가 호출된 경우

클라이언트 측에서는 `http2session.request()` 메서드가 호출될 때 [`ClientHttp2Stream`](/ko/nodejs/api/http2#class-clienthttp2stream) 인스턴스가 생성됩니다.

클라이언트에서 `http2session.request()`에 의해 반환된 `Http2Stream` 인스턴스는 상위 `Http2Session`이 아직 완전히 설정되지 않은 경우 즉시 사용할 준비가 되지 않을 수 있습니다. 이 경우 `Http2Stream`에서 호출된 작업은 `'ready'` 이벤트가 발생할 때까지 버퍼링됩니다. 사용자 코드는 `'ready'` 이벤트를 직접 처리할 필요가 거의 없습니다. `Http2Stream`의 준비 상태는 `http2stream.id` 값을 확인하여 확인할 수 있습니다. 값이 `undefined`이면 스트림은 아직 사용할 준비가 되지 않은 것입니다.


##### 파괴 {#destruction}

모든 [`Http2Stream`](/ko/nodejs/api/http2#class-http2stream) 인스턴스는 다음 경우에 파괴됩니다.

- 스트림에 대한 `RST_STREAM` 프레임이 연결된 피어에 의해 수신되고 (클라이언트 스트림에만 해당) 보류 중인 데이터가 읽혀진 경우.
- `http2stream.close()` 메서드가 호출되고 (클라이언트 스트림에만 해당) 보류 중인 데이터가 읽혀진 경우.
- `http2stream.destroy()` 또는 `http2session.destroy()` 메서드가 호출된 경우.

`Http2Stream` 인스턴스가 파괴되면 연결된 피어에 `RST_STREAM` 프레임을 보내려고 시도합니다.

`Http2Stream` 인스턴스가 파괴되면 `'close'` 이벤트가 발생합니다. `Http2Stream`은 `stream.Duplex`의 인스턴스이므로 스트림 데이터가 현재 흐르고 있는 경우 `'end'` 이벤트도 발생합니다. `http2stream.destroy()`가 첫 번째 인수로 `Error`를 전달하여 호출된 경우 `'error'` 이벤트도 발생할 수 있습니다.

`Http2Stream`이 파괴된 후 `http2stream.destroyed` 속성은 `true`가 되고 `http2stream.rstCode` 속성은 `RST_STREAM` 오류 코드를 지정합니다. `Http2Stream` 인스턴스는 파괴되면 더 이상 사용할 수 없습니다.

#### 이벤트: `'aborted'` {#event-aborted}

**추가된 버전: v8.4.0**

`'aborted'` 이벤트는 `Http2Stream` 인스턴스가 통신 중에 비정상적으로 중단될 때마다 발생합니다. 해당 리스너는 인수를 예상하지 않습니다.

`'aborted'` 이벤트는 `Http2Stream` 쓰기 측면이 종료되지 않은 경우에만 발생합니다.

#### 이벤트: `'close'` {#event-close_1}

**추가된 버전: v8.4.0**

`'close'` 이벤트는 `Http2Stream`이 파괴될 때 발생합니다. 이 이벤트가 발생하면 `Http2Stream` 인스턴스를 더 이상 사용할 수 없습니다.

스트림을 닫을 때 사용된 HTTP/2 오류 코드는 `http2stream.rstCode` 속성을 사용하여 검색할 수 있습니다. 코드가 `NGHTTP2_NO_ERROR` (`0`) 이외의 다른 값인 경우 `'error'` 이벤트도 발생했을 것입니다.

#### 이벤트: `'error'` {#event-error_1}

**추가된 버전: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`'error'` 이벤트는 `Http2Stream` 처리 중에 오류가 발생할 때 발생합니다.


#### 이벤트: `'frameError'` {#event-frameerror_1}

**추가된 버전: v8.4.0**

- `type` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프레임 유형입니다.
- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 오류 코드입니다.
- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 스트림 ID (또는 프레임이 스트림과 연결되지 않은 경우 `0`)입니다.

`'frameError'` 이벤트는 프레임을 보내려고 시도하는 동안 오류가 발생할 때 발생합니다. 호출되면 핸들러 함수는 프레임 유형을 식별하는 정수 인수와 오류 코드를 식별하는 정수 인수를 받습니다. `'frameError'` 이벤트가 발생한 직후에 `Http2Stream` 인스턴스가 소멸됩니다.

#### 이벤트: `'ready'` {#event-ready}

**추가된 버전: v8.4.0**

`'ready'` 이벤트는 `Http2Stream`이 열리고 `id`가 할당되어 사용할 수 있을 때 발생합니다. 리스너는 인수를 예상하지 않습니다.

#### 이벤트: `'timeout'` {#event-timeout_1}

**추가된 버전: v8.4.0**

`'timeout'` 이벤트는 `http2stream.setTimeout()`을 사용하여 설정된 밀리초 내에 이 `Http2Stream`에 대해 활동이 수신되지 않은 후에 발생합니다. 해당 리스너는 인수를 예상하지 않습니다.

#### 이벤트: `'trailers'` {#event-trailers}

**추가된 버전: v8.4.0**

- `headers` [\<HTTP/2 헤더 객체\>](/ko/nodejs/api/http2#headers-object) 헤더를 설명하는 객체입니다.
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 관련된 숫자 플래그입니다.

`'trailers'` 이벤트는 트레일러 헤더 필드와 연결된 헤더 블록이 수신될 때 발생합니다. 리스너 콜백은 [HTTP/2 헤더 객체](/ko/nodejs/api/http2#headers-object) 및 헤더와 관련된 플래그를 전달받습니다.

`http2stream.end()`가 트레일러를 받기 전에 호출되고 들어오는 데이터를 읽거나 수신 대기하지 않는 경우 이 이벤트가 발생하지 않을 수 있습니다.

```js [ESM]
stream.on('trailers', (headers, flags) => {
  console.log(headers);
});
```

#### Event: `'wantTrailers'` {#event-wanttrailers}

**Added in: v10.0.0**

`Http2Stream`이 프레임에서 전송될 최종 `DATA` 프레임을 대기열에 추가했고 `Http2Stream`이 트레일러 헤더를 보낼 준비가 되었을 때 `'wantTrailers'` 이벤트가 발생합니다. 요청 또는 응답을 시작할 때 이 이벤트가 발생하려면 `waitForTrailers` 옵션을 설정해야 합니다.

#### `http2stream.aborted` {#http2streamaborted}

**Added in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`Http2Stream` 인스턴스가 비정상적으로 중단된 경우 `true`로 설정됩니다. 설정되면 `'aborted'` 이벤트가 발생합니다.

#### `http2stream.bufferSize` {#http2streambuffersize}

**Added in: v11.2.0, v10.16.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

이 속성은 현재 쓰기 위해 버퍼링된 문자 수를 보여줍니다. 자세한 내용은 [`net.Socket.bufferSize`](/ko/nodejs/api/net#socketbuffersize)를 참조하십시오.

#### `http2stream.close(code[, callback])` {#http2streamclosecode-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v8.4.0 | Added in: v8.4.0 |
:::

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 오류 코드를 식별하는 부호 없는 32비트 정수입니다. **기본값:** `http2.constants.NGHTTP2_NO_ERROR` (`0x00`).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `'close'` 이벤트를 수신하기 위해 등록된 선택적 함수입니다.

연결된 HTTP/2 피어에 `RST_STREAM` 프레임을 보내 `Http2Stream` 인스턴스를 닫습니다.

#### `http2stream.closed` {#http2streamclosed}

**Added in: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`Http2Stream` 인스턴스가 닫힌 경우 `true`로 설정됩니다.

#### `http2stream.destroyed` {#http2streamdestroyed}

**Added in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`Http2Stream` 인스턴스가 소멸되어 더 이상 사용할 수 없는 경우 `true`로 설정됩니다.


#### `http2stream.endAfterHeaders` {#http2streamendafterheaders}

**Added in: v10.11.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

요청 또는 응답 HEADERS 프레임에서 `END_STREAM` 플래그가 설정된 경우 `true`로 설정됩니다. 이는 추가 데이터를 수신하지 않아야 하며 `Http2Stream`의 읽기 가능한 쪽이 닫힐 것임을 나타냅니다.

#### `http2stream.id` {#http2streamid}

**Added in: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

이 `Http2Stream` 인스턴스의 숫자 스트림 식별자입니다. 스트림 식별자가 아직 할당되지 않은 경우 `undefined`로 설정됩니다.

#### `http2stream.pending` {#http2streampending}

**Added in: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`Http2Stream` 인스턴스에 아직 숫자 스트림 식별자가 할당되지 않은 경우 `true`로 설정됩니다.

#### `http2stream.priority(options)` {#http2streampriorityoptions}

**Added in: v8.4.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이고 `parent`가 부모 스트림을 식별하는 경우, 이 스트림은 부모의 유일한 직접 종속 스트림이 되며, 다른 모든 기존 종속 스트림은 이 스트림의 종속 스트림이 됩니다. **기본값:** `false`.
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 스트림이 종속된 스트림의 숫자 식별자를 지정합니다.
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 동일한 `parent`를 가진 다른 스트림과 관련된 스트림의 상대적 종속성을 지정합니다. 값은 `1`과 `256` 사이의 숫자입니다(경계값 포함).
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 연결된 피어에게 `PRIORITY` 프레임을 보내지 않고 로컬에서 우선 순위를 변경합니다.
  
 

이 `Http2Stream` 인스턴스의 우선 순위를 업데이트합니다.


#### `http2stream.rstCode` {#http2streamrstcode}

**Added in: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`Http2Stream`이 연결된 피어로부터 `RST_STREAM` 프레임을 수신하거나, `http2stream.close()`를 호출하거나, `http2stream.destroy()`를 호출한 후 파괴될 때 보고되는 `RST_STREAM` [오류 코드](/ko/nodejs/api/http2#error-codes-for-rst_stream-and-goaway)로 설정됩니다. `Http2Stream`이 닫히지 않은 경우 `undefined`가 됩니다.

#### `http2stream.sentHeaders` {#http2streamsentheaders}

**Added in: v9.5.0**

- [\<HTTP/2 헤더 객체\>](/ko/nodejs/api/http2#headers-object)

이 `Http2Stream`에 대해 전송된 아웃바운드 헤더를 포함하는 객체입니다.

#### `http2stream.sentInfoHeaders` {#http2streamsentinfoheaders}

**Added in: v9.5.0**

- [\<HTTP/2 헤더 객체 배열\>](/ko/nodejs/api/http2#headers-object)

이 `Http2Stream`에 대해 전송된 아웃바운드 정보 (추가) 헤더를 포함하는 객체의 배열입니다.

#### `http2stream.sentTrailers` {#http2streamsenttrailers}

**Added in: v9.5.0**

- [\<HTTP/2 헤더 객체\>](/ko/nodejs/api/http2#headers-object)

이 `HttpStream`에 대해 전송된 아웃바운드 트레일러를 포함하는 객체입니다.

#### `http2stream.session` {#http2streamsession}

**Added in: v8.4.0**

- [\<Http2Session\>](/ko/nodejs/api/http2#class-http2session)

이 `Http2Stream`을 소유하는 `Http2Session` 인스턴스에 대한 참조입니다. `Http2Stream` 인스턴스가 파괴된 후에는 값이 `undefined`가 됩니다.

#### `http2stream.setTimeout(msecs, callback)` {#http2streamsettimeoutmsecs-callback}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v8.4.0 | Added in: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)



::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';
const client = connect('http://example.org:8000');
const { NGHTTP2_CANCEL } = constants;
const req = client.request({ ':path': '/' });

// 5초 후에 활동이 없으면 스트림을 취소합니다.
req.setTimeout(5000, () => req.close(NGHTTP2_CANCEL));
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('http://example.org:8000');
const { NGHTTP2_CANCEL } = http2.constants;
const req = client.request({ ':path': '/' });

// 5초 후에 활동이 없으면 스트림을 취소합니다.
req.setTimeout(5000, () => req.close(NGHTTP2_CANCEL));
```
:::


#### `http2stream.state` {#http2streamstate}

**Added in: v8.4.0**

`Http2Stream`의 현재 상태에 대한 다양한 정보를 제공합니다.

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `localWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `WINDOW_UPDATE`를 받지 않고 연결된 피어가 이 `Http2Stream`에 대해 보낼 수 있는 바이트 수입니다.
    - `state` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `nghttp2`에 의해 결정된 `Http2Stream`의 로우 레벨 현재 상태를 나타내는 플래그입니다.
    - `localClose` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 `Http2Stream`이 로컬에서 닫혔으면 `1`입니다.
    - `remoteClose` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 `Http2Stream`이 원격에서 닫혔으면 `1`입니다.
    - `sumDependencyWeight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `PRIORITY` 프레임을 사용하여 지정된 대로 이 `Http2Stream`에 종속된 모든 `Http2Stream` 인스턴스의 총 가중치입니다.
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 `Http2Stream`의 우선 순위 가중치입니다.

이 `Http2Stream`의 현재 상태입니다.

#### `http2stream.sendTrailers(headers)` {#http2streamsendtrailersheaders}

**Added in: v10.0.0**

- `headers` [\<HTTP/2 헤더 객체\>](/ko/nodejs/api/http2#headers-object)

연결된 HTTP/2 피어에게 후행 `HEADERS` 프레임을 보냅니다. 이 메서드는 `Http2Stream`을 즉시 닫히게 하고 `'wantTrailers'` 이벤트가 발생한 후에만 호출해야 합니다. 요청을 보내거나 응답을 보낼 때 트레일러를 보낼 수 있도록 최종 `DATA` 프레임 후 `Http2Stream`을 열어 두려면 `options.waitForTrailers` 옵션을 설정해야 합니다.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond(undefined, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ xyz: 'abc' });
  });
  stream.end('Hello World');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond(undefined, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ xyz: 'abc' });
  });
  stream.end('Hello World');
});
```
:::

HTTP/1 사양은 트레일러가 HTTP/2 유사 헤더 필드(예: `':method'`, `':path'` 등)를 포함하는 것을 금지합니다.


### 클래스: `ClientHttp2Stream` {#class-clienthttp2stream}

**추가된 버전: v8.4.0**

- 확장: [\<Http2Stream\>](/ko/nodejs/api/http2#class-http2stream)

`ClientHttp2Stream` 클래스는 HTTP/2 클라이언트에서만 사용되는 `Http2Stream`의 확장입니다. 클라이언트의 `Http2Stream` 인스턴스는 클라이언트에서만 관련된 `'response'` 및 `'push'`와 같은 이벤트를 제공합니다.

#### 이벤트: `'continue'` {#event-continue}

**추가된 버전: v8.5.0**

서버가 `100 Continue` 상태를 보낼 때 발생합니다. 일반적으로 요청에 `Expect: 100-continue`가 포함되어 있기 때문입니다. 이는 클라이언트가 요청 본문을 보내야 함을 나타내는 지침입니다.

#### 이벤트: `'headers'` {#event-headers}

**추가된 버전: v8.4.0**

- `headers` [\<HTTP/2 헤더 객체\>](/ko/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`'headers'` 이벤트는 `1xx` 정보 헤더 블록을 수신하는 경우와 같이 스트림에 대한 추가 헤더 블록이 수신될 때 발생합니다. 리스너 콜백에는 [HTTP/2 헤더 객체](/ko/nodejs/api/http2#headers-object)와 헤더와 관련된 플래그가 전달됩니다.

```js [ESM]
stream.on('headers', (headers, flags) => {
  console.log(headers);
});
```
#### 이벤트: `'push'` {#event-push}

**추가된 버전: v8.4.0**

- `headers` [\<HTTP/2 헤더 객체\>](/ko/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`'push'` 이벤트는 서버 푸시 스트림에 대한 응답 헤더가 수신될 때 발생합니다. 리스너 콜백에는 [HTTP/2 헤더 객체](/ko/nodejs/api/http2#headers-object)와 헤더와 관련된 플래그가 전달됩니다.

```js [ESM]
stream.on('push', (headers, flags) => {
  console.log(headers);
});
```
#### 이벤트: `'response'` {#event-response}

**추가된 버전: v8.4.0**

- `headers` [\<HTTP/2 헤더 객체\>](/ko/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`'response'` 이벤트는 연결된 HTTP/2 서버에서 이 스트림에 대한 응답 `HEADERS` 프레임이 수신될 때 발생합니다. 리스너는 수신된 [HTTP/2 헤더 객체](/ko/nodejs/api/http2#headers-object)를 포함하는 `Object`와 헤더와 관련된 플래그라는 두 개의 인수로 호출됩니다.

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://localhost');
const req = client.request({ ':path': '/' });
req.on('response', (headers, flags) => {
  console.log(headers[':status']);
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://localhost');
const req = client.request({ ':path': '/' });
req.on('response', (headers, flags) => {
  console.log(headers[':status']);
});
```
:::


### 클래스: `ServerHttp2Stream` {#class-serverhttp2stream}

**추가된 버전: v8.4.0**

- 확장: [\<Http2Stream\>](/ko/nodejs/api/http2#class-http2stream)

`ServerHttp2Stream` 클래스는 HTTP/2 서버에서만 사용되는 [\<Http2Stream\>](/ko/nodejs/api/http2#class-http2stream)의 확장입니다. 서버의 `Http2Stream` 인스턴스는 서버에서만 관련된 `http2stream.pushStream()` 및 `http2stream.respond()`와 같은 추가 메서드를 제공합니다.

#### `http2stream.additionalHeaders(headers)` {#http2streamadditionalheadersheaders}

**추가된 버전: v8.4.0**

- `headers` [\<HTTP/2 헤더 객체\>](/ko/nodejs/api/http2#headers-object)

연결된 HTTP/2 피어로 추가 정보 `HEADERS` 프레임을 보냅니다.

#### `http2stream.headersSent` {#http2streamheaderssent}

**추가된 버전: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

헤더가 전송되었으면 true, 그렇지 않으면 false입니다 (읽기 전용).

#### `http2stream.pushAllowed` {#http2streampushallowed}

**추가된 버전: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

원격 클라이언트의 가장 최근 `SETTINGS` 프레임의 `SETTINGS_ENABLE_PUSH` 플래그에 매핑된 읽기 전용 속성입니다. 원격 피어가 푸시 스트림을 수락하면 `true`, 그렇지 않으면 `false`입니다. 설정은 동일한 `Http2Session`의 모든 `Http2Stream`에 대해 동일합니다.

#### `http2stream.pushStream(headers[, options], callback)` {#http2streampushstreamheaders-options-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 이제 `callback` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v8.4.0 | 추가된 버전: v8.4.0 |
:::

- `headers` [\<HTTP/2 헤더 객체\>](/ko/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이고 `parent`가 부모 스트림을 식별하는 경우 생성된 스트림은 부모의 유일한 직접 종속성이 되고 다른 기존 종속성은 새로 생성된 스트림의 종속성이 됩니다. **기본값:** `false`.
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 새로 생성된 스트림이 종속되는 스트림의 숫자 식별자를 지정합니다.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 푸시 스트림이 시작된 후 호출되는 콜백입니다.
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `pushStream` [\<ServerHttp2Stream\>](/ko/nodejs/api/http2#class-serverhttp2stream) 반환된 `pushStream` 객체입니다.
    - `headers` [\<HTTP/2 헤더 객체\>](/ko/nodejs/api/http2#headers-object) `pushStream`이 시작된 헤더 객체입니다.
  
 

푸시 스트림을 시작합니다. 콜백은 푸시 스트림을 위해 생성된 새 `Http2Stream` 인스턴스가 두 번째 인수로 전달되거나 `Error`가 첫 번째 인수로 전달되어 호출됩니다.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.pushStream({ ':path': '/' }, (err, pushStream, headers) => {
    if (err) throw err;
    pushStream.respond({ ':status': 200 });
    pushStream.end('some pushed data');
  });
  stream.end('some data');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.pushStream({ ':path': '/' }, (err, pushStream, headers) => {
    if (err) throw err;
    pushStream.respond({ ':status': 200 });
    pushStream.end('some pushed data');
  });
  stream.end('some data');
});
```
:::

푸시 스트림의 가중치를 설정하는 것은 `HEADERS` 프레임에서 허용되지 않습니다. `silent` 옵션이 `true`로 설정된 `weight` 값을 `http2stream.priority`에 전달하여 동시 스트림 간의 서버 측 대역폭 균형 조정을 활성화합니다.

푸시된 스트림 내에서 `http2stream.pushStream()`을 호출하는 것은 허용되지 않으며 오류가 발생합니다.


#### `http2stream.respond([headers[, options]])` {#http2streamrespondheaders-options}

::: info [내역]
| 버전 | 변경 사항 |
| --- | --- |
| v14.5.0, v12.19.0 | 명시적으로 날짜 헤더를 설정할 수 있습니다. |
| v8.4.0 | 추가됨: v8.4.0 |
:::

- `headers` [\<HTTP/2 헤더 객체\>](/ko/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 응답에 페이로드 데이터가 포함되지 않음을 나타내려면 `true`로 설정합니다.
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 최종 `DATA` 프레임이 전송된 후 `Http2Stream`이 `'wantTrailers'` 이벤트를 발생시킵니다.
  
 



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.end('some data');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.end('some data');
});
```
:::

응답을 시작합니다. `options.waitForTrailers` 옵션이 설정되면 전송될 페이로드 데이터의 마지막 청크를 대기열에 넣은 직후에 `'wantTrailers'` 이벤트가 발생합니다. 그런 다음 `http2stream.sendTrailers()` 메서드를 사용하여 트레일링 헤더 필드를 피어에게 보낼 수 있습니다.

`options.waitForTrailers`가 설정되면 `Http2Stream`은 최종 `DATA` 프레임이 전송될 때 자동으로 닫히지 않습니다. 사용자 코드는 `Http2Stream`을 닫으려면 `http2stream.sendTrailers()` 또는 `http2stream.close()`를 호출해야 합니다.



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 }, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
  stream.end('some data');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 }, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
  stream.end('some data');
});
```
:::


#### `http2stream.respondWithFD(fd[, headers[, options]])` {#http2streamrespondwithfdfd-headers-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.5.0, v12.19.0 | 날짜 헤더를 명시적으로 설정할 수 있도록 허용합니다. |
| v12.12.0 | 이제 `fd` 옵션이 `FileHandle`이 될 수 있습니다. |
| v10.0.0 | 일반 파일이 아니더라도 읽을 수 있는 모든 파일 디스크립터가 이제 지원됩니다. |
| v8.4.0 | v8.4.0에 추가됨 |
:::

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/ko/nodejs/api/fs#class-filehandle) 읽을 수 있는 파일 디스크립터입니다.
- `headers` [\<HTTP/2 헤더 객체\>](/ko/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `statCheck` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우, `Http2Stream`은 최종 `DATA` 프레임이 전송된 후 `'wantTrailers'` 이벤트를 발생시킵니다.
    - `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽기를 시작할 오프셋 위치입니다.
    - `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) fd에서 전송할 데이터의 양입니다.

주어진 파일 디스크립터에서 데이터를 읽는 응답을 시작합니다. 주어진 파일 디스크립터에 대한 유효성 검사는 수행되지 않습니다. 파일 디스크립터를 사용하여 데이터를 읽는 동안 오류가 발생하면 `Http2Stream`은 표준 `INTERNAL_ERROR` 코드를 사용하여 `RST_STREAM` 프레임을 사용하여 닫힙니다.

사용 시 `Http2Stream` 객체의 `Duplex` 인터페이스가 자동으로 닫힙니다.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
import { openSync, fstatSync, closeSync } from 'node:fs';

const server = createServer();
server.on('stream', (stream) => {
  const fd = openSync('/some/file', 'r');

  const stat = fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers);
  stream.on('close', () => closeSync(fd));
});
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createServer();
server.on('stream', (stream) => {
  const fd = fs.openSync('/some/file', 'r');

  const stat = fs.fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers);
  stream.on('close', () => fs.closeSync(fd));
});
```
:::

선택적 `options.statCheck` 함수를 지정하여 사용자 코드가 주어진 fd의 `fs.Stat` 세부 정보를 기반으로 추가 콘텐츠 헤더를 설정할 수 있도록 할 수 있습니다. `statCheck` 함수가 제공되면 `http2stream.respondWithFD()` 메서드는 `fs.fstat()` 호출을 수행하여 제공된 파일 디스크립터에 대한 세부 정보를 수집합니다.

`offset` 및 `length` 옵션을 사용하여 응답을 특정 범위 하위 집합으로 제한할 수 있습니다. 이는 예를 들어 HTTP 범위 요청을 지원하는 데 사용할 수 있습니다.

파일 디스크립터 또는 `FileHandle`은 스트림이 닫힐 때 닫히지 않으므로 더 이상 필요하지 않으면 수동으로 닫아야 합니다. 여러 스트림에 대해 동일한 파일 디스크립터를 동시에 사용하는 것은 지원되지 않으며 데이터 손실이 발생할 수 있습니다. 스트림이 완료된 후 파일 디스크립터를 다시 사용하는 것은 지원됩니다.

`options.waitForTrailers` 옵션이 설정되면 페이로드 데이터의 마지막 청크를 전송하기 위해 대기열에 넣은 직후에 `'wantTrailers'` 이벤트가 발생합니다. 그런 다음 `http2stream.sendTrailers()` 메서드를 사용하여 트레일러 헤더 필드를 피어로 보낼 수 있습니다.

`options.waitForTrailers`가 설정되면 `Http2Stream`은 최종 `DATA` 프레임이 전송될 때 자동으로 닫히지 않습니다. 사용자 코드는 `Http2Stream`을 닫으려면 `http2stream.sendTrailers()` 또는 `http2stream.close()`를 호출 *해야 합니다*.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
import { openSync, fstatSync, closeSync } from 'node:fs';

const server = createServer();
server.on('stream', (stream) => {
  const fd = openSync('/some/file', 'r');

  const stat = fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });

  stream.on('close', () => closeSync(fd));
});
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createServer();
server.on('stream', (stream) => {
  const fd = fs.openSync('/some/file', 'r');

  const stat = fs.fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });

  stream.on('close', () => fs.closeSync(fd));
});
```
:::


#### `http2stream.respondWithFile(path[, headers[, options]])` {#http2streamrespondwithfilepath-headers-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.5.0, v12.19.0 | 날짜 헤더를 명시적으로 설정할 수 있습니다. |
| v10.0.0 | 정규 파일뿐만 아니라 모든 읽을 수 있는 파일이 이제 지원됩니다. |
| v8.4.0 | v8.4.0에서 추가됨 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `headers` [\<HTTP/2 헤더 객체\>](/ko/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `statCheck` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `onError` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 전송 전에 오류가 발생한 경우 호출되는 콜백 함수입니다.
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 `Http2Stream`은 최종 `DATA` 프레임이 전송된 후 `'wantTrailers'` 이벤트를 발생시킵니다.
    - `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 읽기를 시작할 오프셋 위치입니다.
    - `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) fd에서 전송할 데이터의 양입니다.

정규 파일을 응답으로 보냅니다. `path`는 정규 파일을 지정해야 하며, 그렇지 않으면 `'error'` 이벤트가 `Http2Stream` 객체에서 발생합니다.

사용 시 `Http2Stream` 객체의 `Duplex` 인터페이스가 자동으로 닫힙니다.

선택적 `options.statCheck` 함수는 사용자 코드에 주어진 파일의 `fs.Stat` 세부 정보에 따라 추가 콘텐츠 헤더를 설정할 수 있는 기회를 제공하기 위해 지정될 수 있습니다.

파일 데이터를 읽으려고 시도하는 동안 오류가 발생하면 `Http2Stream`은 표준 `INTERNAL_ERROR` 코드를 사용하여 `RST_STREAM` 프레임을 사용하여 닫힙니다. `onError` 콜백이 정의된 경우 호출됩니다. 그렇지 않으면 스트림이 소멸됩니다.

파일 경로를 사용하는 예:

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    headers['last-modified'] = stat.mtime.toUTCString();
  }

  function onError(err) {
    // stream.respond()는 스트림이 상대방에 의해 소멸된 경우 예외를 발생시킬 수 있습니다.
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ ':status': 404 });
      } else {
        stream.respond({ ':status': 500 });
      }
    } catch (err) {
      // 실제 오류 처리 수행.
      console.error(err);
    }
    stream.end();
  }

  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck, onError });
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    headers['last-modified'] = stat.mtime.toUTCString();
  }

  function onError(err) {
    // stream.respond()는 스트림이 상대방에 의해 소멸된 경우 예외를 발생시킬 수 있습니다.
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ ':status': 404 });
      } else {
        stream.respond({ ':status': 500 });
      }
    } catch (err) {
      // 실제 오류 처리 수행.
      console.error(err);
    }
    stream.end();
  }

  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck, onError });
});
```
:::

`options.statCheck` 함수를 사용하여 `false`를 반환하여 전송 작업을 취소할 수도 있습니다. 예를 들어 조건부 요청은 stat 결과를 확인하여 파일이 수정되었는지 확인하여 적절한 `304` 응답을 반환할 수 있습니다.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    // 여기에서 stat을 확인하십시오...
    stream.respond({ ':status': 304 });
    return false; // 전송 작업 취소
  }
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck });
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    // 여기에서 stat을 확인하십시오...
    stream.respond({ ':status': 304 });
    return false; // 전송 작업 취소
  }
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck });
});
```
:::

`content-length` 헤더 필드가 자동으로 설정됩니다.

`offset` 및 `length` 옵션을 사용하여 응답을 특정 범위 하위 집합으로 제한할 수 있습니다. 예를 들어 HTTP Range 요청을 지원하는 데 사용할 수 있습니다.

`options.onError` 함수는 파일 전달이 시작되기 전에 발생할 수 있는 모든 오류를 처리하는 데 사용할 수도 있습니다. 기본 동작은 스트림을 소멸시키는 것입니다.

`options.waitForTrailers` 옵션이 설정되면 전송할 마지막 페이로드 데이터 청크를 대기열에 넣은 직후에 `'wantTrailers'` 이벤트가 발생합니다. 그런 다음 `http2stream.sendTrailers()` 메서드를 사용하여 트레일러 헤더 필드를 피어로 보낼 수 있습니다.

`options.waitForTrailers`가 설정되면 최종 `DATA` 프레임이 전송될 때 `Http2Stream`이 자동으로 닫히지 않습니다. 사용자 코드는 `Http2Stream`을 닫기 위해 `http2stream.sendTrailers()` 또는 `http2stream.close()`를 호출해야 합니다.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
});
```
:::


### 클래스: `Http2Server` {#class-http2server}

**추가된 버전: v8.4.0**

- 확장: [\<net.Server\>](/ko/nodejs/api/net#class-netserver)

`Http2Server`의 인스턴스는 `http2.createServer()` 함수를 사용하여 생성됩니다. `Http2Server` 클래스는 `node:http2` 모듈에 의해 직접적으로 내보내지지 않습니다.

#### 이벤트: `'checkContinue'` {#event-checkcontinue}

**추가된 버전: v8.5.0**

- `request` [\<http2.Http2ServerRequest\>](/ko/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/ko/nodejs/api/http2#class-http2http2serverresponse)

[`'request'`](/ko/nodejs/api/http2#event-request) 리스너가 등록되었거나 [`http2.createServer()`](/ko/nodejs/api/http2#http2createserveroptions-onrequesthandler)에 콜백 함수가 제공된 경우, HTTP `Expect: 100-continue`를 포함하는 요청이 수신될 때마다 `'checkContinue'` 이벤트가 발생합니다. 이 이벤트에 대한 리스너가 없으면 서버는 자동으로 상태 `100 Continue`로 적절하게 응답합니다.

이 이벤트를 처리하는 것은 클라이언트가 요청 본문을 계속 보내야 하는 경우 [`response.writeContinue()`](/ko/nodejs/api/http2#responsewritecontinue)를 호출하거나, 클라이언트가 요청 본문을 계속 보내지 않아야 하는 경우 적절한 HTTP 응답(예: 400 Bad Request)을 생성하는 것을 포함합니다.

이 이벤트가 발생하고 처리되면 [`'request'`](/ko/nodejs/api/http2#event-request) 이벤트는 발생하지 않습니다.

#### 이벤트: `'connection'` {#event-connection}

**추가된 버전: v8.4.0**

- `socket` [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)

이 이벤트는 새로운 TCP 스트림이 설정될 때 발생합니다. `socket`은 일반적으로 [`net.Socket`](/ko/nodejs/api/net#class-netsocket) 타입의 객체입니다. 일반적으로 사용자는 이 이벤트에 접근하고 싶어하지 않을 것입니다.

이 이벤트는 사용자가 HTTP 서버에 연결을 주입하기 위해 명시적으로 발생시킬 수도 있습니다. 이 경우, 모든 [`Duplex`](/ko/nodejs/api/stream#class-streamduplex) 스트림을 전달할 수 있습니다.

#### 이벤트: `'request'` {#event-request}

**추가된 버전: v8.4.0**

- `request` [\<http2.Http2ServerRequest\>](/ko/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/ko/nodejs/api/http2#class-http2http2serverresponse)

요청이 있을 때마다 발생합니다. 세션당 여러 요청이 있을 수 있습니다. [호환성 API](/ko/nodejs/api/http2#compatibility-api)를 참조하십시오.


#### 이벤트: `'session'` {#event-session}

**추가된 버전: v8.4.0**

- `session` [\<ServerHttp2Session\>](/ko/nodejs/api/http2#class-serverhttp2session)

`'session'` 이벤트는 `Http2Server`에 의해 새로운 `Http2Session`이 생성될 때 발생합니다.

#### 이벤트: `'sessionError'` {#event-sessionerror}

**추가된 버전: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `session` [\<ServerHttp2Session\>](/ko/nodejs/api/http2#class-serverhttp2session)

`'sessionError'` 이벤트는 `Http2Server`와 연결된 `Http2Session` 객체에서 `'error'` 이벤트가 발생할 때 발생합니다.

#### 이벤트: `'stream'` {#event-stream_1}

**추가된 버전: v8.4.0**

- `stream` [\<Http2Stream\>](/ko/nodejs/api/http2#class-http2stream) 스트림에 대한 참조
- `headers` [\<HTTP/2 헤더 객체\>](/ko/nodejs/api/http2#headers-object) 헤더를 설명하는 객체
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 관련된 숫자 플래그
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 원시 헤더 이름과 해당 값이 차례로 포함된 배열입니다.

`'stream'` 이벤트는 서버와 연결된 `Http2Session`에서 `'stream'` 이벤트가 발생했을 때 발생합니다.

[`Http2Session`의 `'stream'` 이벤트](/ko/nodejs/api/http2#event-stream)도 참조하세요.

::: code-group
```js [ESM]
import { createServer, constants } from 'node:http2';
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = constants;

const server = createServer();
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```

```js [CJS]
const http2 = require('node:http2');
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = http2.constants;

const server = http2.createServer();
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```
:::


#### Event: `'timeout'` {#event-timeout_2}

::: info [History]
| Version | Changes |
| --- | --- |
| v13.0.0 | 기본 제한 시간이 120초에서 0(제한 시간 없음)으로 변경되었습니다. |
| v8.4.0 | Added in: v8.4.0 |
:::

`'timeout'` 이벤트는 `http2server.setTimeout()`을 사용하여 설정된 밀리초 동안 서버에 활동이 없을 때 발생합니다. **기본값:** 0(제한 시간 없음)

#### `server.close([callback])` {#serverclosecallback}

**Added in: v8.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

서버가 새 세션을 설정하지 못하도록 합니다. 이는 HTTP/2 세션의 지속적인 특성으로 인해 새 요청 스트림이 생성되는 것을 방지하지 않습니다. 서버를 정상적으로 종료하려면 모든 활성 세션에서 [`http2session.close()`](/ko/nodejs/api/http2#http2sessionclosecallback)를 호출하세요.

`callback`이 제공되면 서버가 이미 새 세션을 허용하지 않더라도 모든 활성 세션이 닫힐 때까지 호출되지 않습니다. 자세한 내용은 [`net.Server.close()`](/ko/nodejs/api/net#serverclosecallback)를 참조하세요.

#### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Added in: v20.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

[`server.close()`](/ko/nodejs/api/http2#serverclosecallback)를 호출하고 서버가 닫히면 이행되는 프로미스를 반환합니다.

#### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback` 인수에 잘못된 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v13.0.0 | 기본 제한 시간이 120초에서 0(제한 시간 없음)으로 변경되었습니다. |
| v8.4.0 | Added in: v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** 0(제한 시간 없음)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<Http2Server\>](/ko/nodejs/api/http2#class-http2server)

http2 서버 요청에 대한 제한 시간 값을 설정하는 데 사용되며, `msecs` 밀리초 후에 `Http2Server`에 활동이 없을 때 호출되는 콜백 함수를 설정합니다.

제공된 콜백은 `'timeout'` 이벤트의 리스너로 등록됩니다.

`callback`이 함수가 아닌 경우 새로운 `ERR_INVALID_ARG_TYPE` 오류가 발생합니다.


#### `server.timeout` {#servertimeout}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v13.0.0 | 기본 제한 시간이 120초에서 0(제한 시간 없음)으로 변경되었습니다. |
| v8.4.0 | 추가됨: v8.4.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 밀리초 단위의 제한 시간. **기본값:** 0(제한 시간 없음)

소켓이 시간 초과된 것으로 간주되기 전까지의 비활성 시간(밀리초)입니다.

`0` 값은 들어오는 연결에 대한 제한 시간 동작을 비활성화합니다.

소켓 제한 시간 로직은 연결 시 설정되므로 이 값을 변경해도 기존 연결이 아닌 서버에 대한 새 연결에만 영향을 줍니다.

#### `server.updateSettings([settings])` {#serverupdatesettingssettings}

**추가됨: v15.1.0, v14.17.0**

- `settings` [\<HTTP/2 설정 객체\>](/ko/nodejs/api/http2#settings-object)

제공된 설정으로 서버를 업데이트하는 데 사용됩니다.

잘못된 `settings` 값에 대해 `ERR_HTTP2_INVALID_SETTING_VALUE`를 throw합니다.

잘못된 `settings` 인수에 대해 `ERR_INVALID_ARG_TYPE`을 throw합니다.

### 클래스: `Http2SecureServer` {#class-http2secureserver}

**추가됨: v8.4.0**

- 확장: [\<tls.Server\>](/ko/nodejs/api/tls#class-tlsserver)

`Http2SecureServer` 인스턴스는 `http2.createSecureServer()` 함수를 사용하여 생성됩니다. `Http2SecureServer` 클래스는 `node:http2` 모듈에서 직접 내보내지 않습니다.

#### 이벤트: `'checkContinue'` {#event-checkcontinue_1}

**추가됨: v8.5.0**

- `request` [\<http2.Http2ServerRequest\>](/ko/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/ko/nodejs/api/http2#class-http2http2serverresponse)

[`'request'`](/ko/nodejs/api/http2#event-request) 리스너가 등록되었거나 [`http2.createSecureServer()`](/ko/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler)에 콜백 함수가 제공된 경우 HTTP `Expect: 100-continue`가 포함된 요청이 수신될 때마다 `'checkContinue'` 이벤트가 발생합니다. 이 이벤트를 수신 대기하지 않으면 서버는 적절한 경우 상태 `100 Continue`로 자동 응답합니다.

이 이벤트를 처리하려면 클라이언트가 요청 본문을 계속 보내야 하는 경우 [`response.writeContinue()`](/ko/nodejs/api/http2#responsewritecontinue)를 호출하거나 클라이언트가 요청 본문을 계속 보내지 않아야 하는 경우 적절한 HTTP 응답(예: 400 Bad Request)을 생성해야 합니다.

이 이벤트가 발생하고 처리되면 [`'request'`](/ko/nodejs/api/http2#event-request) 이벤트가 발생하지 않습니다.


#### Event: `'connection'` {#event-connection_1}

**Added in: v8.4.0**

- `socket` [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)

이 이벤트는 TLS 핸드셰이크가 시작되기 전에 새로운 TCP 스트림이 설정될 때 발생합니다. `socket`은 일반적으로 [`net.Socket`](/ko/nodejs/api/net#class-netsocket) 유형의 객체입니다. 일반적으로 사용자는 이 이벤트에 접근할 필요가 없습니다.

이 이벤트는 사용자가 HTTP 서버에 연결을 주입하기 위해 명시적으로 발생시킬 수도 있습니다. 이 경우 모든 [`Duplex`](/ko/nodejs/api/stream#class-streamduplex) 스트림을 전달할 수 있습니다.

#### Event: `'request'` {#event-request_1}

**Added in: v8.4.0**

- `request` [\<http2.Http2ServerRequest\>](/ko/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/ko/nodejs/api/http2#class-http2http2serverresponse)

요청이 있을 때마다 발생합니다. 세션당 여러 요청이 있을 수 있습니다. [호환성 API](/ko/nodejs/api/http2#compatibility-api)를 참조하세요.

#### Event: `'session'` {#event-session_1}

**Added in: v8.4.0**

- `session` [\<ServerHttp2Session\>](/ko/nodejs/api/http2#class-serverhttp2session)

`'session'` 이벤트는 `Http2SecureServer`에 의해 새로운 `Http2Session`이 생성될 때 발생합니다.

#### Event: `'sessionError'` {#event-sessionerror_1}

**Added in: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `session` [\<ServerHttp2Session\>](/ko/nodejs/api/http2#class-serverhttp2session)

`'sessionError'` 이벤트는 `Http2SecureServer`와 연결된 `Http2Session` 객체에서 `'error'` 이벤트가 발생할 때 발생합니다.

#### Event: `'stream'` {#event-stream_2}

**Added in: v8.4.0**

- `stream` [\<Http2Stream\>](/ko/nodejs/api/http2#class-http2stream) 스트림에 대한 참조
- `headers` [\<HTTP/2 헤더 객체\>](/ko/nodejs/api/http2#headers-object) 헤더를 설명하는 객체
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 관련 숫자 플래그
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 원시 헤더 이름과 해당 값을 포함하는 배열입니다.

`'stream'` 이벤트는 서버와 연결된 `Http2Session`에서 `'stream'` 이벤트가 발생했을 때 발생합니다.

[`Http2Session`의 `'stream'` 이벤트](/ko/nodejs/api/http2#event-stream)도 참조하세요.

::: code-group
```js [ESM]
import { createSecureServer, constants } from 'node:http2';
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = constants;

const options = getOptionsSomehow();

const server = createSecureServer(options);
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```

```js [CJS]
const http2 = require('node:http2');
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = http2.constants;

const options = getOptionsSomehow();

const server = http2.createSecureServer(options);
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```
:::


#### Event: `'timeout'` {#event-timeout_3}

**Added in: v8.4.0**

`'timeout'` 이벤트는 `http2secureServer.setTimeout()`을 사용하여 설정한 밀리초 동안 서버에 활동이 없을 때 발생합니다. **기본값:** 2분.

#### Event: `'unknownProtocol'` {#event-unknownprotocol}


::: info [히스토리]
| 버전 | 변경 사항 |
|---|---|
| v19.0.0 | 이 이벤트는 클라이언트가 TLS 핸드셰이크 중에 ALPN 확장을 전송하지 않은 경우에만 발생합니다. |
| v8.4.0 | Added in: v8.4.0 |
:::

- `socket` [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)

`'unknownProtocol'` 이벤트는 연결하는 클라이언트가 허용된 프로토콜(예: HTTP/2 또는 HTTP/1.1)을 협상하지 못할 때 발생합니다. 이벤트 핸들러는 처리를 위해 소켓을 받습니다. 이 이벤트에 대해 등록된 리스너가 없으면 연결이 종료됩니다. [`http2.createSecureServer()`](/ko/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler)에 전달된 `'unknownProtocolTimeout'` 옵션을 사용하여 제한 시간을 지정할 수 있습니다.

이전 버전의 Node.js에서는 `allowHTTP1`이 `false`이고 TLS 핸드셰이크 중에 클라이언트가 ALPN 확장을 보내지 않거나 HTTP/2(`h2`)를 포함하지 않는 ALPN 확장을 보내는 경우 이 이벤트가 발생했습니다. 최신 버전의 Node.js는 `allowHTTP1`이 `false`이고 클라이언트가 ALPN 확장을 보내지 않는 경우에만 이 이벤트를 발생시킵니다. 클라이언트가 HTTP/2(또는 `allowHTTP1`이 `true`인 경우 HTTP/1.1)를 포함하지 않는 ALPN 확장을 보내면 TLS 핸드셰이크가 실패하고 보안 연결이 설정되지 않습니다.

[호환성 API](/ko/nodejs/api/http2#compatibility-api)를 참조하십시오.

#### `server.close([callback])` {#serverclosecallback_1}

**Added in: v8.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

서버가 새로운 세션을 설정하는 것을 중단합니다. 이는 HTTP/2 세션의 지속적인 특성으로 인해 새로운 요청 스트림이 생성되는 것을 방지하지 않습니다. 서버를 정상적으로 종료하려면 활성 세션에서 [`http2session.close()`](/ko/nodejs/api/http2#http2sessionclosecallback)를 호출하십시오.

`callback`이 제공되면 서버가 이미 새로운 세션을 허용하지 않더라도 모든 활성 세션이 닫힐 때까지 호출되지 않습니다. 자세한 내용은 [`tls.Server.close()`](/ko/nodejs/api/tls#serverclosecallback)를 참조하십시오.


#### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback_1}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 유효하지 않은 콜백을 `callback` 인수로 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v8.4.0 | v8.4.0에 추가됨 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `120000` (2분)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<Http2SecureServer\>](/ko/nodejs/api/http2#class-http2secureserver)

http2 보안 서버 요청의 시간 초과 값을 설정하고 `msecs` 밀리초 후에 `Http2SecureServer`에 활동이 없을 때 호출되는 콜백 함수를 설정하는 데 사용됩니다.

제공된 콜백은 `'timeout'` 이벤트의 리스너로 등록됩니다.

`callback`이 함수가 아닌 경우 새로운 `ERR_INVALID_ARG_TYPE` 오류가 발생합니다.

#### `server.timeout` {#servertimeout_1}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.0.0 | 기본 시간 초과가 120초에서 0(시간 초과 없음)으로 변경되었습니다. |
| v8.4.0 | v8.4.0에 추가됨 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 밀리초 단위의 시간 초과. **기본값:** 0 (시간 초과 없음)

소켓이 시간 초과된 것으로 간주되기 전까지의 비활성 밀리초 수입니다.

`0` 값은 들어오는 연결에 대한 시간 초과 동작을 비활성화합니다.

소켓 시간 초과 로직은 연결 시 설정되므로 이 값을 변경하면 기존 연결이 아닌 서버에 대한 새 연결에만 영향을 줍니다.

#### `server.updateSettings([settings])` {#serverupdatesettingssettings_1}

**v15.1.0, v14.17.0에 추가됨**

- `settings` [\<HTTP/2 설정 객체\>](/ko/nodejs/api/http2#settings-object)

제공된 설정으로 서버를 업데이트하는 데 사용됩니다.

유효하지 않은 `settings` 값에 대해 `ERR_HTTP2_INVALID_SETTING_VALUE`를 발생시킵니다.

유효하지 않은 `settings` 인수에 대해 `ERR_INVALID_ARG_TYPE`을 발생시킵니다.

### `http2.createServer([options][, onRequestHandler])` {#http2createserveroptions-onrequesthandler}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | `streamResetBurst` 및 `streamResetRate` 추가. |
| v13.0.0 | `PADDING_STRATEGY_CALLBACK`이 `PADDING_STRATEGY_ALIGNED` 제공과 동일하게 만들어졌고 `selectPadding`이 제거되었습니다. |
| v13.3.0, v12.16.0 | 기본값이 100인 `maxSessionRejectedStreams` 옵션 추가. |
| v13.3.0, v12.16.0 | 기본값이 1000인 `maxSessionInvalidFrames` 옵션 추가. |
| v12.4.0 | 이제 `options` 매개변수가 `net.createServer()` 옵션을 지원합니다. |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | 기본값이 10000인 `unknownProtocolTimeout` 옵션 추가. |
| v14.4.0, v12.18.0, v10.21.0 | 기본값이 32인 `maxSettings` 옵션 추가. |
| v9.6.0 | `Http1IncomingMessage` 및 `Http1ServerResponse` 옵션 추가. |
| v8.9.3 | 기본 제한이 10인 `maxOutstandingPings` 옵션 추가. |
| v8.9.3 | 기본 제한이 128 헤더 쌍인 `maxHeaderListPairs` 옵션 추가. |
| v8.4.0 | v8.4.0에 추가됨 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 헤더 필드를 압축하기 위한 최대 동적 테이블 크기를 설정합니다. **기본값:** `4Kib`.
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `SETTINGS` 프레임당 최대 설정 항목 수를 설정합니다. 허용되는 최소값은 `1`입니다. **기본값:** `32`.
    - `maxSessionMemory`[\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session`이 사용할 수 있는 최대 메모리를 설정합니다. 값은 메가바이트 단위로 표현됩니다(예: `1`은 1메가바이트와 같음). 허용되는 최소값은 `1`입니다. 이는 크레딧 기반 제한이며 기존 `Http2Stream`으로 인해 이 제한이 초과될 수 있지만 이 제한이 초과되는 동안에는 새 `Http2Stream` 인스턴스가 거부됩니다. 현재 `Http2Stream` 세션 수, 헤더 압축 테이블의 현재 메모리 사용량, 보낼 대기 중인 현재 데이터, 승인되지 않은 `PING` 및 `SETTINGS` 프레임이 모두 현재 제한에 포함됩니다. **기본값:** `10`.
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 최대 헤더 항목 수를 설정합니다. 이는 `node:http` 모듈의 [`server.maxHeadersCount`](/ko/nodejs/api/http#servermaxheaderscount) 또는 [`request.maxHeadersCount`](/ko/nodejs/api/http#requestmaxheaderscount)와 유사합니다. 최소값은 `4`입니다. **기본값:** `128`.
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 미해결된 승인되지 않은 핑의 최대 수를 설정합니다. **기본값:** `10`.
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 직렬화된 압축된 헤더 블록에 허용되는 최대 크기를 설정합니다. 이 제한을 초과하는 헤더를 보내려고 하면 `'frameError'` 이벤트가 발생하고 스트림이 닫히고 파괴됩니다. 이는 전체 헤더 블록에 허용되는 최대 크기를 설정하지만 `nghttp2`(내부 http2 라이브러리)는 각 압축 해제된 키/값 쌍에 대해 `65536`의 제한을 가집니다.
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `HEADERS` 및 `DATA` 프레임에 사용할 패딩 양을 결정하는 데 사용되는 전략입니다. **기본값:** `http2.constants.PADDING_STRATEGY_NONE`. 값은 다음 중 하나일 수 있습니다.
    - `http2.constants.PADDING_STRATEGY_NONE`: 패딩이 적용되지 않습니다.
    - `http2.constants.PADDING_STRATEGY_MAX`: 내부 구현에 의해 결정되는 최대 패딩 양이 적용됩니다.
    - `http2.constants.PADDING_STRATEGY_ALIGNED`: 총 프레임 길이(9바이트 헤더 포함)가 8의 배수가 되도록 충분한 패딩을 적용하려고 시도합니다. 각 프레임에 대해 현재 흐름 제어 상태 및 설정에 따라 결정되는 허용되는 최대 패딩 바이트 수가 있습니다. 이 최대값이 정렬을 보장하는 데 필요한 계산된 양보다 작으면 최대값이 사용되고 총 프레임 길이가 반드시 8바이트로 정렬되지는 않습니다.

    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `SETTINGS` 프레임이 수신된 것처럼 원격 피어에 대한 최대 동시 스트림 수를 설정합니다. 원격 피어가 `maxConcurrentStreams`에 대해 자체 값을 설정하면 재정의됩니다. **기본값:** `100`.
    - `maxSessionInvalidFrames` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 세션을 닫기 전에 허용되는 최대 유효하지 않은 프레임 수를 설정합니다. **기본값:** `1000`.
    - `maxSessionRejectedStreams` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 세션을 닫기 전에 허용되는 최대 생성 시 거부된 스트림 수를 설정합니다. 각 거부는 피어에게 더 이상 스트림을 열지 말라고 알리는 `NGHTTP2_ENHANCE_YOUR_CALM` 오류와 관련되어 있으므로 스트림을 계속 여는 것은 피어가 잘못 작동하는 징후로 간주됩니다. **기본값:** `100`.
    - `settings` [\<HTTP/2 설정 객체\>](/ko/nodejs/api/http2#settings-object) 연결 시 원격 피어에 보낼 초기 설정입니다.
    - `streamResetBurst` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 및 `streamResetRate` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 들어오는 스트림 재설정(RST_STREAM 프레임)에 대한 속도 제한을 설정합니다. 효과를 보려면 두 설정 모두 설정해야 하며 기본값은 각각 1000과 33입니다.
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 정수 값의 배열은 수신된 remoteSettings의 `CustomSettings` 속성에 포함된 설정 유형을 결정합니다. 허용되는 설정 유형에 대한 자세한 내용은 `Http2Settings` 객체의 `CustomSettings` 속성을 참조하십시오.
    - `Http1IncomingMessage` [\<http.IncomingMessage\>](/ko/nodejs/api/http#class-httpincomingmessage) HTTP/1 폴백에 사용할 `IncomingMessage` 클래스를 지정합니다. 원래 `http.IncomingMessage`를 확장하는 데 유용합니다. **기본값:** `http.IncomingMessage`.
    - `Http1ServerResponse` [\<http.ServerResponse\>](/ko/nodejs/api/http#class-httpserverresponse) HTTP/1 폴백에 사용할 `ServerResponse` 클래스를 지정합니다. 원래 `http.ServerResponse`를 확장하는 데 유용합니다. **기본값:** `http.ServerResponse`.
    - `Http2ServerRequest` [\<http2.Http2ServerRequest\>](/ko/nodejs/api/http2#class-http2http2serverrequest) 사용할 `Http2ServerRequest` 클래스를 지정합니다. 원래 `Http2ServerRequest`를 확장하는 데 유용합니다. **기본값:** `Http2ServerRequest`.
    - `Http2ServerResponse` [\<http2.Http2ServerResponse\>](/ko/nodejs/api/http2#class-http2http2serverresponse) 사용할 `Http2ServerResponse` 클래스를 지정합니다. 원래 `Http2ServerResponse`를 확장하는 데 유용합니다. **기본값:** `Http2ServerResponse`.
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 서버가 [`'unknownProtocol'`](/ko/nodejs/api/http2#event-unknownprotocol)이 발생했을 때 대기해야 하는 시간 초과(밀리초)를 지정합니다. 그 시간까지 소켓이 파괴되지 않으면 서버가 소켓을 파괴합니다. **기본값:** `10000`.
    - ...: 모든 [`net.createServer()`](/ko/nodejs/api/net#netcreateserveroptions-connectionlistener) 옵션을 제공할 수 있습니다.

- `onRequestHandler` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [호환성 API](/ko/nodejs/api/http2#compatibility-api)를 참조하십시오.
- 반환: [\<Http2Server\>](/ko/nodejs/api/http2#class-http2server)

`Http2Session` 인스턴스를 생성하고 관리하는 `net.Server` 인스턴스를 반환합니다.

[암호화되지 않은 HTTP/2](https://http2.github.io/faq/#does-http2-require-encryption)를 지원하는 것으로 알려진 브라우저가 없으므로 브라우저 클라이언트와 통신할 때는 [`http2.createSecureServer()`](/ko/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler)를 사용해야 합니다.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

// 암호화되지 않은 HTTP/2 서버를 만듭니다.
// 암호화되지 않은 HTTP/2를 지원하는 것으로 알려진 브라우저가 없으므로
// 브라우저 클라이언트와 통신할 때는 `createSecureServer()`를
// 사용해야 합니다.
const server = createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```

```js [CJS]
const http2 = require('node:http2');

// 암호화되지 않은 HTTP/2 서버를 만듭니다.
// 암호화되지 않은 HTTP/2를 지원하는 것으로 알려진 브라우저가 없으므로
// 브라우저 클라이언트와 통신할 때는 `http2.createSecureServer()`를
// 사용해야 합니다.
const server = http2.createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```
:::


### `http2.createSecureServer(options[, onRequestHandler])` {#http2createsecureserveroptions-onrequesthandler}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.0.0 | `PADDING_STRATEGY_CALLBACK`이 `PADDING_STRATEGY_ALIGNED`를 제공하는 것과 동일하게 되었고 `selectPadding`이 제거되었습니다. |
| v13.3.0, v12.16.0 | 기본값이 100인 `maxSessionRejectedStreams` 옵션이 추가되었습니다. |
| v13.3.0, v12.16.0 | 기본값이 1000인 `maxSessionInvalidFrames` 옵션이 추가되었습니다. |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | 기본값이 10000인 `unknownProtocolTimeout` 옵션이 추가되었습니다. |
| v14.4.0, v12.18.0, v10.21.0 | 기본값이 32인 `maxSettings` 옵션이 추가되었습니다. |
| v10.12.0 | `Http2Session` 시작 시 자동으로 `ORIGIN` 프레임을 보내는 `origins` 옵션이 추가되었습니다. |
| v8.9.3 | 기본 제한이 10인 `maxOutstandingPings` 옵션이 추가되었습니다. |
| v8.9.3 | 기본 제한이 128 헤더 쌍인 `maxHeaderListPairs` 옵션이 추가되었습니다. |
| v8.4.0 | 추가됨: v8.4.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHTTP1` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`로 설정하면 HTTP/2를 지원하지 않는 들어오는 클라이언트 연결이 HTTP/1.x로 다운그레이드됩니다. [`'unknownProtocol'`](/ko/nodejs/api/http2#event-unknownprotocol) 이벤트를 참조하세요. [ALPN 협상](/ko/nodejs/api/http2#alpn-negotiation)을 참조하세요. **기본값:** `false`.
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 헤더 필드를 압축하기 위한 최대 동적 테이블 크기를 설정합니다. **기본값:** `4Kib`.
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `SETTINGS` 프레임당 최대 설정 항목 수를 설정합니다. 허용되는 최소값은 `1`입니다. **기본값:** `32`.
    - `maxSessionMemory`[\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session`이 사용할 수 있는 최대 메모리를 설정합니다. 값은 메가바이트 단위로 표현됩니다(예: `1`은 1메가바이트와 같습니다). 허용되는 최소값은 `1`입니다. 이는 크레딧 기반 제한이며, 기존 `Http2Stream`으로 인해 이 제한을 초과할 수 있지만, 이 제한을 초과하는 동안에는 새 `Http2Stream` 인스턴스가 거부됩니다. 현재 `Http2Stream` 세션 수, 헤더 압축 테이블의 현재 메모리 사용량, 전송 대기 중인 현재 데이터, 승인되지 않은 `PING` 및 `SETTINGS` 프레임이 모두 현재 제한에 포함됩니다. **기본값:** `10`.
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 최대 헤더 항목 수를 설정합니다. 이는 `node:http` 모듈의 [`server.maxHeadersCount`](/ko/nodejs/api/http#servermaxheaderscount) 또는 [`request.maxHeadersCount`](/ko/nodejs/api/http#requestmaxheaderscount)와 유사합니다. 최소값은 `4`입니다. **기본값:** `128`.
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 미결제된 미승인 핑의 최대 수를 설정합니다. **기본값:** `10`.
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 직렬화된 압축 헤더 블록에 허용되는 최대 크기를 설정합니다. 이 제한을 초과하는 헤더를 보내려고 하면 `'frameError'` 이벤트가 발생하고 스트림이 닫히고 소멸됩니다.
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `HEADERS` 및 `DATA` 프레임에 사용할 패딩 양을 결정하는 데 사용되는 전략입니다. **기본값:** `http2.constants.PADDING_STRATEGY_NONE`. 값은 다음 중 하나일 수 있습니다.
    - `http2.constants.PADDING_STRATEGY_NONE`: 패딩이 적용되지 않습니다.
    - `http2.constants.PADDING_STRATEGY_MAX`: 내부 구현에 의해 결정된 최대 패딩 양이 적용됩니다.
    - `http2.constants.PADDING_STRATEGY_ALIGNED`: 총 프레임 길이(9바이트 헤더 포함)가 8의 배수가 되도록 충분한 패딩을 적용하려고 시도합니다. 각 프레임에 대해 현재 흐름 제어 상태 및 설정에 따라 결정되는 최대 허용 패딩 바이트 수가 있습니다. 이 최대값이 정렬을 보장하는 데 필요한 계산된 양보다 작으면 최대값이 사용되고 총 프레임 길이가 반드시 8바이트로 정렬되지는 않습니다.

    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `SETTINGS` 프레임을 수신한 것처럼 원격 피어에 대한 최대 동시 스트림 수를 설정합니다. 원격 피어가 `maxConcurrentStreams`에 대한 자체 값을 설정하면 재정의됩니다. **기본값:** `100`.
    - `maxSessionInvalidFrames` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 세션을 닫기 전에 허용되는 최대 잘못된 프레임 수를 설정합니다. **기본값:** `1000`.
    - `maxSessionRejectedStreams` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 세션을 닫기 전에 허용되는 최대 생성 시 거부된 스트림 수를 설정합니다. 각 거부는 피어에게 더 이상 스트림을 열지 말라고 알리는 `NGHTTP2_ENHANCE_YOUR_CALM` 오류와 관련되어 있으므로 스트림을 계속 여는 것은 잘못된 피어의 징후로 간주됩니다. **기본값:** `100`.
    - `settings` [\<HTTP/2 설정 객체\>](/ko/nodejs/api/http2#settings-object) 연결 시 원격 피어에게 보낼 초기 설정입니다.
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 정수 값 배열은 수신된 remoteSettings의 `customSettings` 속성에 포함된 설정 유형을 결정합니다. 허용되는 설정 유형에 대한 자세한 내용은 `Http2Settings` 객체의 `customSettings` 속성을 참조하십시오.
    - ...: 모든 [`tls.createServer()`](/ko/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) 옵션을 제공할 수 있습니다. 서버의 경우 일반적으로 ID 옵션(`pfx` 또는 `key`/`cert`)이 필요합니다.
    - `origins` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 새 서버 `Http2Session` 생성 직후 `ORIGIN` 프레임 내에서 보낼 오리진 문자열 배열입니다.
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`'unknownProtocol'`](/ko/nodejs/api/http2#event-unknownprotocol) 이벤트가 발생했을 때 서버가 대기해야 하는 시간 초과를 밀리초 단위로 지정합니다. 해당 시간까지 소켓이 소멸되지 않은 경우 서버는 소켓을 소멸합니다. **기본값:** `10000`.

- `onRequestHandler` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [호환성 API](/ko/nodejs/api/http2#compatibility-api)를 참조하십시오.
- 반환: [\<Http2SecureServer\>](/ko/nodejs/api/http2#class-http2secureserver)

`Http2Session` 인스턴스를 생성하고 관리하는 `tls.Server` 인스턴스를 반환합니다.

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),
};

// 보안 HTTP/2 서버 생성
const server = createSecureServer(options);

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const options = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem'),
};

// 보안 HTTP/2 서버 생성
const server = http2.createSecureServer(options);

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```
:::


### `http2.connect(authority[, options][, listener])` {#http2connectauthority-options-listener}

::: info [History]
| Version | Changes |
| --- | --- |
| v13.0.0 | `PADDING_STRATEGY_CALLBACK`이 `PADDING_STRATEGY_ALIGNED`를 제공하는 것과 동일하게 만들어졌고 `selectPadding`이 제거되었습니다. |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | 기본값이 10000인 `unknownProtocolTimeout` 옵션이 추가되었습니다. |
| v14.4.0, v12.18.0, v10.21.0 | 기본값이 32인 `maxSettings` 옵션이 추가되었습니다. |
| v8.9.3 | 기본 제한이 10인 `maxOutstandingPings` 옵션이 추가되었습니다. |
| v8.9.3 | 기본 제한이 128 헤더 쌍인 `maxHeaderListPairs` 옵션이 추가되었습니다. |
| v8.4.0 | 추가됨: v8.4.0 |
:::

- `authority` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 연결할 원격 HTTP/2 서버입니다. 이는 `http://` 또는 `https://` 접두사, 호스트 이름 및 IP 포트(기본 포트가 아닌 포트가 사용되는 경우)가 있는 최소한의 유효한 URL 형태여야 합니다. URL의 사용자 정보(사용자 ID 및 비밀번호), 경로, 쿼리 문자열 및 조각 세부 정보는 무시됩니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 헤더 필드를 압축 해제하기 위한 최대 동적 테이블 크기를 설정합니다. **기본값:** `4Kib`.
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `SETTINGS` 프레임당 최대 설정 항목 수를 설정합니다. 허용되는 최소값은 `1`입니다. **기본값:** `32`.
    - `maxSessionMemory`[\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session`이 사용할 수 있는 최대 메모리를 설정합니다. 값은 메가바이트 수로 표현됩니다(예: `1`은 1메가바이트와 같습니다). 허용되는 최소값은 `1`입니다. 이는 크레딧 기반 제한이며, 기존 `Http2Stream`으로 인해 이 제한이 초과될 수 있지만, 이 제한이 초과되는 동안 새 `Http2Stream` 인스턴스는 거부됩니다. 현재 `Http2Stream` 세션 수, 헤더 압축 테이블의 현재 메모리 사용량, 보낼 대기 중인 현재 데이터, 승인되지 않은 `PING` 및 `SETTINGS` 프레임이 모두 현재 제한에 포함됩니다. **기본값:** `10`.
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 최대 헤더 항목 수를 설정합니다. 이는 `node:http` 모듈의 [`server.maxHeadersCount`](/ko/nodejs/api/http#servermaxheaderscount) 또는 [`request.maxHeadersCount`](/ko/nodejs/api/http#requestmaxheaderscount)와 유사합니다. 최소값은 `1`입니다. **기본값:** `128`.
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 미해결된 승인되지 않은 최대 핑 수를 설정합니다. **기본값:** `10`.
    - `maxReservedRemoteStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 클라이언트가 지정된 시간에 허용할 최대 예약 푸시 스트림 수를 설정합니다. 현재 예약된 푸시 스트림 수가 이 제한에 도달하면 서버에서 보낸 새 푸시 스트림이 자동으로 거부됩니다. 허용되는 최소값은 0입니다. 허용되는 최대값은 2-1입니다. 음수 값은 이 옵션을 허용되는 최대값으로 설정합니다. **기본값:** `200`.
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 직렬화된 압축 헤더 블록에 허용되는 최대 크기를 설정합니다. 이 제한을 초과하는 헤더를 보내려고 하면 `'frameError'` 이벤트가 발생하고 스트림이 닫히고 삭제됩니다.
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `HEADERS` 및 `DATA` 프레임에 사용할 패딩 양을 결정하는 데 사용되는 전략입니다. **기본값:** `http2.constants.PADDING_STRATEGY_NONE`. 값은 다음 중 하나일 수 있습니다.
        - `http2.constants.PADDING_STRATEGY_NONE`: 패딩이 적용되지 않습니다.
        - `http2.constants.PADDING_STRATEGY_MAX`: 내부 구현에 의해 결정되는 최대 패딩 양이 적용됩니다.
        - `http2.constants.PADDING_STRATEGY_ALIGNED`: 총 프레임 길이(9바이트 헤더 포함)가 8의 배수가 되도록 충분한 패딩을 적용하려고 시도합니다. 각 프레임에 대해 현재 흐름 제어 상태 및 설정에 따라 결정되는 최대 허용 패딩 바이트 수가 있습니다. 이 최대값이 정렬을 보장하는 데 필요한 계산된 양보다 작으면 최대값이 사용되고 총 프레임 길이가 반드시 8바이트로 정렬되지는 않습니다.

    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `SETTINGS` 프레임이 수신된 것처럼 원격 피어에 대한 최대 동시 스트림 수를 설정합니다. 원격 피어가 `maxConcurrentStreams`에 대해 자체 값을 설정하면 재정의됩니다. **기본값:** `100`.
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `authority`에 설정되지 않은 경우 연결할 프로토콜입니다. 값은 `'http:'` 또는 `'https:'`일 수 있습니다. **기본값:** `'https:'`
    - `settings` [\<HTTP/2 설정 객체\>](/ko/nodejs/api/http2#settings-object) 연결 시 원격 피어에 보낼 초기 설정입니다.
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 정수 값의 배열은 수신된 remoteSettings의 `CustomSettings` 속성에 포함된 설정 유형을 결정합니다. 허용되는 설정 유형에 대한 자세한 내용은 `Http2Settings` 객체의 `CustomSettings` 속성을 참조하십시오.
    - `createConnection` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `connect`에 전달된 `URL` 인스턴스 및 `options` 객체를 수신하고 이 세션에 대한 연결로 사용할 [`Duplex`](/ko/nodejs/api/stream#class-streamduplex) 스트림을 반환하는 선택적 콜백입니다.
    - ...: 모든 [`net.connect()`](/ko/nodejs/api/net#netconnect) 또는 [`tls.connect()`](/ko/nodejs/api/tls#tlsconnectoptions-callback) 옵션을 제공할 수 있습니다.
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`'unknownProtocol'`](/ko/nodejs/api/http2#event-unknownprotocol) 이벤트가 발생했을 때 서버가 대기해야 하는 시간 제한(밀리초)을 지정합니다. 해당 시간까지 소켓이 삭제되지 않으면 서버가 삭제합니다. **기본값:** `10000`.

- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`'connect'`](/ko/nodejs/api/http2#event-connect) 이벤트의 일회성 리스너로 등록됩니다.
- 반환: [\<ClientHttp2Session\>](/ko/nodejs/api/http2#class-clienthttp2session)

`ClientHttp2Session` 인스턴스를 반환합니다.

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://localhost:1234');

/* 클라이언트 사용 */

client.close();
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://localhost:1234');

/* 클라이언트 사용 */

client.close();
```
:::


### `http2.constants` {#http2constants}

**Added in: v8.4.0**

#### `RST_STREAM` 및 `GOAWAY`에 대한 오류 코드 {#error-codes-for-rst_stream-and-goaway}

| 값 | 이름 | 상수 |
| --- | --- | --- |
| `0x00` | 오류 없음 | `http2.constants.NGHTTP2_NO_ERROR` |
| `0x01` | 프로토콜 오류 | `http2.constants.NGHTTP2_PROTOCOL_ERROR` |
| `0x02` | 내부 오류 | `http2.constants.NGHTTP2_INTERNAL_ERROR` |
| `0x03` | 흐름 제어 오류 | `http2.constants.NGHTTP2_FLOW_CONTROL_ERROR` |
| `0x04` | 설정 시간 초과 | `http2.constants.NGHTTP2_SETTINGS_TIMEOUT` |
| `0x05` | 스트림 닫힘 | `http2.constants.NGHTTP2_STREAM_CLOSED` |
| `0x06` | 프레임 크기 오류 | `http2.constants.NGHTTP2_FRAME_SIZE_ERROR` |
| `0x07` | 스트림 거부됨 | `http2.constants.NGHTTP2_REFUSED_STREAM` |
| `0x08` | 취소 | `http2.constants.NGHTTP2_CANCEL` |
| `0x09` | 압축 오류 | `http2.constants.NGHTTP2_COMPRESSION_ERROR` |
| `0x0a` | 연결 오류 | `http2.constants.NGHTTP2_CONNECT_ERROR` |
| `0x0b` | 진정하세요 | `http2.constants.NGHTTP2_ENHANCE_YOUR_CALM` |
| `0x0c` | 부적절한 보안 | `http2.constants.NGHTTP2_INADEQUATE_SECURITY` |
| `0x0d` | HTTP/1.1 필요 | `http2.constants.NGHTTP2_HTTP_1_1_REQUIRED` |
`'timeout'` 이벤트는 `http2server.setTimeout()`을 사용하여 설정한 지정된 밀리초 동안 서버에 활동이 없을 때 발생합니다.

### `http2.getDefaultSettings()` {#http2getdefaultsettings}

**Added in: v8.4.0**

- 반환: [\<HTTP/2 설정 객체\>](/ko/nodejs/api/http2#settings-object)

`Http2Session` 인스턴스에 대한 기본 설정을 포함하는 객체를 반환합니다. 이 메서드는 호출될 때마다 새 객체 인스턴스를 반환하므로 반환된 인스턴스는 안전하게 수정하여 사용할 수 있습니다.

### `http2.getPackedSettings([settings])` {#http2getpackedsettingssettings}

**Added in: v8.4.0**

- `settings` [\<HTTP/2 설정 객체\>](/ko/nodejs/api/http2#settings-object)
- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

[HTTP/2](https://tools.ietf.org/html/rfc7540) 사양에 지정된 대로 지정된 HTTP/2 설정의 직렬화된 표현을 포함하는 `Buffer` 인스턴스를 반환합니다. 이는 `HTTP2-Settings` 헤더 필드와 함께 사용하기 위한 것입니다.

::: code-group
```js [ESM]
import { getPackedSettings } from 'node:http2';

const packed = getPackedSettings({ enablePush: false });

console.log(packed.toString('base64'));
// Prints: AAIAAAAA
```

```js [CJS]
const http2 = require('node:http2');

const packed = http2.getPackedSettings({ enablePush: false });

console.log(packed.toString('base64'));
// Prints: AAIAAAAA
```
:::


### `http2.getUnpackedSettings(buf)` {#http2getunpackedsettingsbuf}

**Added in: v8.4.0**

- `buf` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 압축된 설정입니다.
- Returns: [\<HTTP/2 설정 객체\>](/ko/nodejs/api/http2#settings-object)

`http2.getPackedSettings()`로 생성된 주어진 `Buffer`에서 역직렬화된 설정을 포함하는 [HTTP/2 설정 객체](/ko/nodejs/api/http2#settings-object)를 반환합니다.

### `http2.performServerHandshake(socket[, options])` {#http2performserverhandshakesocket-options}

**Added in: v21.7.0, v20.12.0**

- `socket` [\<stream.Duplex\>](/ko/nodejs/api/stream#class-streamduplex)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - ...: 모든 [`http2.createServer()`](/ko/nodejs/api/http2#http2createserveroptions-onrequesthandler) 옵션을 제공할 수 있습니다.


- Returns: [\<ServerHttp2Session\>](/ko/nodejs/api/http2#class-serverhttp2session)

기존 소켓에서 HTTP/2 서버 세션을 만듭니다.

### `http2.sensitiveHeaders` {#http2sensitiveheaders}

**Added in: v15.0.0, v14.18.0**

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)

이 심볼은 민감하다고 간주되는 헤더 목록을 제공하기 위해 배열 값과 함께 HTTP/2 헤더 객체의 속성으로 설정할 수 있습니다. 자세한 내용은 [민감한 헤더](/ko/nodejs/api/http2#sensitive-headers)를 참조하십시오.

### 헤더 객체 {#headers-object}

헤더는 JavaScript 객체의 자체 속성으로 표현됩니다. 속성 키는 소문자로 직렬화됩니다. 속성 값은 문자열이어야 합니다 (문자열이 아닌 경우 문자열로 강제 변환됨) 또는 문자열의 `Array` (헤더 필드당 둘 이상의 값을 보내기 위해).

```js [ESM]
const headers = {
  ':status': '200',
  'content-type': 'text-plain',
  'ABC': ['has', 'more', 'than', 'one', 'value'],
};

stream.respond(headers);
```
콜백 함수에 전달된 헤더 객체는 `null` 프로토타입을 갖습니다. 이는 `Object.prototype.toString()` 및 `Object.prototype.hasOwnProperty()`와 같은 일반적인 JavaScript 객체 메서드가 작동하지 않음을 의미합니다.

들어오는 헤더의 경우:

- `:status` 헤더는 `number`로 변환됩니다.
- `:status`, `:method`, `:authority`, `:scheme`, `:path`, `:protocol`, `age`, `authorization`, `access-control-allow-credentials`, `access-control-max-age`, `access-control-request-method`, `content-encoding`, `content-language`, `content-length`, `content-location`, `content-md5`, `content-range`, `content-type`, `date`, `dnt`, `etag`, `expires`, `from`, `host`, `if-match`, `if-modified-since`, `if-none-match`, `if-range`, `if-unmodified-since`, `last-modified`, `location`, `max-forwards`, `proxy-authorization`, `range`, `referer`,`retry-after`, `tk`, `upgrade-insecure-requests`, `user-agent` 또는 `x-content-type-options`의 중복은 삭제됩니다.
- `set-cookie`는 항상 배열입니다. 중복은 배열에 추가됩니다.
- 중복된 `cookie` 헤더의 경우 값은 '; '로 결합됩니다.
- 다른 모든 헤더의 경우 값은 ', '로 결합됩니다.



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream, headers) => {
  console.log(headers[':path']);
  console.log(headers.ABC);
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream, headers) => {
  console.log(headers[':path']);
  console.log(headers.ABC);
});
```
:::


#### 민감한 헤더 {#sensitive-headers}

HTTP2 헤더는 민감하다고 표시될 수 있으며, 이는 HTTP/2 헤더 압축 알고리즘이 해당 헤더를 절대 인덱싱하지 않음을 의미합니다. 이는 엔트로피가 낮고 공격자에게 가치가 있다고 여겨질 수 있는 헤더 값(예: `Cookie` 또는 `Authorization`)에 대해 유용할 수 있습니다. 이를 위해 `[http2.sensitiveHeaders]` 속성에 헤더 이름을 배열로 추가합니다.

```js [ESM]
const headers = {
  ':status': '200',
  'content-type': 'text-plain',
  'cookie': 'some-cookie',
  'other-sensitive-header': 'very secret data',
  [http2.sensitiveHeaders]: ['cookie', 'other-sensitive-header'],
};

stream.respond(headers);
```
`Authorization` 및 짧은 `Cookie` 헤더와 같은 일부 헤더의 경우 이 플래그가 자동으로 설정됩니다.

이 속성은 수신된 헤더에 대해서도 설정됩니다. 여기에는 자동으로 표시된 헤더를 포함하여 민감하다고 표시된 모든 헤더의 이름이 포함됩니다.

### 설정 객체 {#settings-object}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v12.12.0 | `maxConcurrentStreams` 설정이 더 엄격해졌습니다. |
| v8.9.3 | `maxHeaderListSize` 설정이 이제 엄격하게 적용됩니다. |
| v8.4.0 | v8.4.0에서 추가됨 |
:::

`http2.getDefaultSettings()`, `http2.getPackedSettings()`, `http2.createServer()`, `http2.createSecureServer()`, `http2session.settings()`, `http2session.localSettings` 및 `http2session.remoteSettings` API는 `Http2Session` 객체에 대한 구성 설정을 정의하는 객체를 반환하거나 입력으로 받습니다. 이러한 객체는 다음 속성을 포함하는 일반적인 JavaScript 객체입니다.

- `headerTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 헤더 압축에 사용되는 최대 바이트 수를 지정합니다. 허용되는 최소값은 0입니다. 허용되는 최대값은 2-1입니다. **기본값:** `4096`.
- `enablePush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) HTTP/2 푸시 스트림이 `Http2Session` 인스턴스에서 허용되는 경우 `true`를 지정합니다. **기본값:** `true`.
- `initialWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 스트림 수준 흐름 제어를 위한 *발신자*의 초기 윈도우 크기(바이트)를 지정합니다. 허용되는 최소값은 0입니다. 허용되는 최대값은 2-1입니다. **기본값:** `65535`.
- `maxFrameSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 가장 큰 프레임 페이로드의 크기(바이트)를 지정합니다. 허용되는 최소값은 16,384입니다. 허용되는 최대값은 2-1입니다. **기본값:** `16384`.
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session`에서 허용되는 최대 동시 스트림 수를 지정합니다. 기본값은 없으며, 이는 적어도 이론적으로 2-1개의 스트림이 `Http2Session`에서 임의의 시간에 동시에 열릴 수 있음을 의미합니다. 최소값은 0입니다. 허용되는 최대값은 2-1입니다. **기본값:** `4294967295`.
- `maxHeaderListSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 허용되는 헤더 목록의 최대 크기(압축되지 않은 옥텟)를 지정합니다. 허용되는 최소값은 0입니다. 허용되는 최대값은 2-1입니다. **기본값:** `65535`.
- `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `maxHeaderListSize`의 별칭입니다.
- `enableConnectProtocol`[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) [RFC 8441](https://tools.ietf.org/html/rfc8441)에 정의된 "확장 연결 프로토콜"을 활성화할지 여부를 지정합니다. 이 설정은 서버에서 보낸 경우에만 의미가 있습니다. 지정된 `Http2Session`에 대해 `enableConnectProtocol` 설정이 활성화되면 비활성화할 수 없습니다. **기본값:** `false`.
- `customSettings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 노드 및 기본 라이브러리에서 아직 구현되지 않은 추가 설정을 지정합니다. 객체의 키는 설정 유형의 숫자 값( [RFC 7540]에 의해 설정된 "HTTP/2 SETTINGS" 레지스트리에 정의됨)을 정의하고, 값은 설정의 실제 숫자 값을 정의합니다. 설정 유형은 1에서 2^16-1 범위의 정수여야 합니다. 노드에서 이미 처리하는 설정 유형이 아니어야 합니다. 즉, 현재는 6보다 커야 하지만 오류는 아닙니다. 값은 0에서 2^32-1 범위의 부호 없는 정수여야 합니다. 현재 최대 10개의 사용자 지정 설정이 지원됩니다. SETTINGS를 보내거나 서버 또는 클라이언트 객체의 `remoteCustomSettings` 옵션에 지정된 설정 값을 수신하는 데만 지원됩니다. 향후 노드 버전에서 설정이 기본적으로 지원되는 경우 기본적으로 처리되는 설정에 대한 인터페이스와 설정 ID에 대한 `customSettings` 메커니즘을 혼합하지 마십시오.

설정 객체의 모든 추가 속성은 무시됩니다.


### 오류 처리 {#error-handling}

`node:http2` 모듈을 사용할 때 발생할 수 있는 여러 유형의 오류 조건이 있습니다.

유효성 검사 오류는 잘못된 인수, 옵션 또는 설정 값이 전달될 때 발생합니다. 이는 항상 동기식 `throw`에 의해 보고됩니다.

상태 오류는 잘못된 시간에 작업을 시도할 때 발생합니다(예: 스트림이 닫힌 후 스트림에서 데이터를 보내려고 시도하는 경우). 이는 오류가 발생하는 시기와 위치에 따라 동기식 `throw`를 사용하거나 `Http2Stream`, `Http2Session` 또는 HTTP/2 Server 객체에서 `'error'` 이벤트를 통해 보고됩니다.

내부 오류는 HTTP/2 세션이 예기치 않게 실패할 때 발생합니다. 이는 `Http2Session` 또는 HTTP/2 Server 객체에서 `'error'` 이벤트를 통해 보고됩니다.

프로토콜 오류는 다양한 HTTP/2 프로토콜 제약 조건이 위반될 때 발생합니다. 이는 오류가 발생하는 시기와 위치에 따라 동기식 `throw`를 사용하거나 `Http2Stream`, `Http2Session` 또는 HTTP/2 Server 객체에서 `'error'` 이벤트를 통해 보고됩니다.

### 헤더 이름 및 값의 잘못된 문자 처리 {#invalid-character-handling-in-header-names-and-values}

HTTP/2 구현은 HTTP 헤더 이름 및 값에서 잘못된 문자를 HTTP/1 구현보다 더 엄격하게 처리합니다.

헤더 필드 이름은 *대소문자를 구분하지 않으며* 유선을 통해 엄격하게 소문자 문자열로 전송됩니다. Node.js에서 제공하는 API를 사용하면 헤더 이름을 혼합 대소문자 문자열(예: `Content-Type`)로 설정할 수 있지만 전송 시 소문자(예: `content-type`)로 변환됩니다.

헤더 필드 이름은 *반드시* 다음 ASCII 문자 중 하나 이상을 포함해야 합니다. `a`-`z`, `A`-`Z`, `0`-`9`, `!`, `#`, `$`, `%`, `&`, `'`, `*`, `+`, `-`, `.`, `^`, `_`, ``` (백틱), `|`, 및 `~`.

HTTP 헤더 필드 이름 내에서 잘못된 문자를 사용하면 스트림이 프로토콜 오류와 함께 닫힙니다.

헤더 필드 값은 더 관대하게 처리되지만 HTTP 사양의 요구 사항에 따라 새 줄 또는 캐리지 리턴 문자를 포함해서는 *안 되며* US-ASCII 문자로 제한되어야 *합니다*.


### 클라이언트에서 푸시 스트림 {#push-streams-on-the-client}

클라이언트에서 푸시된 스트림을 수신하려면 `ClientHttp2Session`에서 `'stream'` 이벤트에 대한 리스너를 설정하십시오.

::: code-group
```js [ESM]
import { connect } from 'node:http2';

const client = connect('http://localhost');

client.on('stream', (pushedStream, requestHeaders) => {
  pushedStream.on('push', (responseHeaders) => {
    // 응답 헤더 처리
  });
  pushedStream.on('data', (chunk) => { /* 푸시된 데이터 처리 */ });
});

const req = client.request({ ':path': '/' });
```

```js [CJS]
const http2 = require('node:http2');

const client = http2.connect('http://localhost');

client.on('stream', (pushedStream, requestHeaders) => {
  pushedStream.on('push', (responseHeaders) => {
    // 응답 헤더 처리
  });
  pushedStream.on('data', (chunk) => { /* 푸시된 데이터 처리 */ });
});

const req = client.request({ ':path': '/' });
```
:::

### `CONNECT` 메서드 지원 {#supporting-the-connect-method}

`CONNECT` 메서드는 HTTP/2 서버가 TCP/IP 연결에 대한 프록시로 사용될 수 있도록 하는 데 사용됩니다.

간단한 TCP 서버:

::: code-group
```js [ESM]
import { createServer } from 'node:net';

const server = createServer((socket) => {
  let name = '';
  socket.setEncoding('utf8');
  socket.on('data', (chunk) => name += chunk);
  socket.on('end', () => socket.end(`hello ${name}`));
});

server.listen(8000);
```

```js [CJS]
const net = require('node:net');

const server = net.createServer((socket) => {
  let name = '';
  socket.setEncoding('utf8');
  socket.on('data', (chunk) => name += chunk);
  socket.on('end', () => socket.end(`hello ${name}`));
});

server.listen(8000);
```
:::

HTTP/2 CONNECT 프록시:

::: code-group
```js [ESM]
import { createServer, constants } from 'node:http2';
const { NGHTTP2_REFUSED_STREAM, NGHTTP2_CONNECT_ERROR } = constants;
import { connect } from 'node:net';

const proxy = createServer();
proxy.on('stream', (stream, headers) => {
  if (headers[':method'] !== 'CONNECT') {
    // CONNECT 요청만 허용
    stream.close(NGHTTP2_REFUSED_STREAM);
    return;
  }
  const auth = new URL(`tcp://${headers[':authority']}`);
  // 호스트 이름과 포트가 이 프록시가 연결해야 하는 것인지 확인하는 것이 좋습니다.
  const socket = connect(auth.port, auth.hostname, () => {
    stream.respond();
    socket.pipe(stream);
    stream.pipe(socket);
  });
  socket.on('error', (error) => {
    stream.close(NGHTTP2_CONNECT_ERROR);
  });
});

proxy.listen(8001);
```

```js [CJS]
const http2 = require('node:http2');
const { NGHTTP2_REFUSED_STREAM } = http2.constants;
const net = require('node:net');

const proxy = http2.createServer();
proxy.on('stream', (stream, headers) => {
  if (headers[':method'] !== 'CONNECT') {
    // CONNECT 요청만 허용
    stream.close(NGHTTP2_REFUSED_STREAM);
    return;
  }
  const auth = new URL(`tcp://${headers[':authority']}`);
  // 호스트 이름과 포트가 이 프록시가 연결해야 하는 것인지 확인하는 것이 좋습니다.
  const socket = net.connect(auth.port, auth.hostname, () => {
    stream.respond();
    socket.pipe(stream);
    stream.pipe(socket);
  });
  socket.on('error', (error) => {
    stream.close(http2.constants.NGHTTP2_CONNECT_ERROR);
  });
});

proxy.listen(8001);
```
:::

HTTP/2 CONNECT 클라이언트:

::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';

const client = connect('http://localhost:8001');

// CONNECT 요청의 경우 ':path' 및 ':scheme' 헤더를 지정하면 안 됩니다.
// 그렇지 않으면 오류가 발생합니다.
const req = client.request({
  ':method': 'CONNECT',
  ':authority': 'localhost:8000',
});

req.on('response', (headers) => {
  console.log(headers[constants.HTTP2_HEADER_STATUS]);
});
let data = '';
req.setEncoding('utf8');
req.on('data', (chunk) => data += chunk);
req.on('end', () => {
  console.log(`The server says: ${data}`);
  client.close();
});
req.end('Jane');
```

```js [CJS]
const http2 = require('node:http2');

const client = http2.connect('http://localhost:8001');

// CONNECT 요청의 경우 ':path' 및 ':scheme' 헤더를 지정하면 안 됩니다.
// 그렇지 않으면 오류가 발생합니다.
const req = client.request({
  ':method': 'CONNECT',
  ':authority': 'localhost:8000',
});

req.on('response', (headers) => {
  console.log(headers[http2.constants.HTTP2_HEADER_STATUS]);
});
let data = '';
req.setEncoding('utf8');
req.on('data', (chunk) => data += chunk);
req.on('end', () => {
  console.log(`The server says: ${data}`);
  client.close();
});
req.end('Jane');
```
:::


### 확장된 `CONNECT` 프로토콜 {#the-extended-connect-protocol}

[RFC 8441](https://tools.ietf.org/html/rfc8441)은 HTTP/2에 대한 "확장된 CONNECT 프로토콜" 확장을 정의하며, 이를 사용하여 다른 통신 프로토콜(예: WebSockets)을 위한 터널로 `CONNECT` 메서드를 사용하여 `Http2Stream`의 사용을 부트스트랩할 수 있습니다.

확장된 CONNECT 프로토콜의 사용은 `enableConnectProtocol` 설정을 사용하여 HTTP/2 서버에서 활성화됩니다.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const settings = { enableConnectProtocol: true };
const server = createServer({ settings });
```

```js [CJS]
const http2 = require('node:http2');
const settings = { enableConnectProtocol: true };
const server = http2.createServer({ settings });
```
:::

클라이언트가 확장된 CONNECT를 사용할 수 있음을 나타내는 서버로부터 `SETTINGS` 프레임을 수신하면 `':protocol'` HTTP/2 의사 헤더를 사용하는 `CONNECT` 요청을 보낼 수 있습니다.

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('http://localhost:8080');
client.on('remoteSettings', (settings) => {
  if (settings.enableConnectProtocol) {
    const req = client.request({ ':method': 'CONNECT', ':protocol': 'foo' });
    // ...
  }
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('http://localhost:8080');
client.on('remoteSettings', (settings) => {
  if (settings.enableConnectProtocol) {
    const req = client.request({ ':method': 'CONNECT', ':protocol': 'foo' });
    // ...
  }
});
```
:::

## 호환성 API {#compatibility-api}

호환성 API는 HTTP/2를 사용할 때 HTTP/1과 유사한 개발자 경험을 제공하여 [HTTP/1](/ko/nodejs/api/http)과 HTTP/2를 모두 지원하는 애플리케이션을 개발할 수 있도록 하는 것을 목표로 합니다. 이 API는 [HTTP/1](/ko/nodejs/api/http)의 **public API**만을 대상으로 합니다. 그러나 많은 모듈이 내부 메서드 또는 상태를 사용하며, 이는 완전히 다른 구현이므로 *지원되지 않습니다*.

다음 예제는 호환성 API를 사용하여 HTTP/2 서버를 만듭니다.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```
:::

혼합된 [HTTPS](/ko/nodejs/api/https) 및 HTTP/2 서버를 만들려면 [ALPN 협상](/ko/nodejs/api/http2#alpn-negotiation) 섹션을 참조하십시오. 비 TLS HTTP/1 서버에서 업그레이드하는 것은 지원되지 않습니다.

HTTP/2 호환성 API는 [`Http2ServerRequest`](/ko/nodejs/api/http2#class-http2http2serverrequest) 및 [`Http2ServerResponse`](/ko/nodejs/api/http2#class-http2http2serverresponse)로 구성됩니다. 이는 HTTP/1과의 API 호환성을 목표로 하지만 프로토콜 간의 차이점을 숨기지 않습니다. 예를 들어 HTTP 코드에 대한 상태 메시지는 무시됩니다.


### ALPN 협상 {#alpn-negotiation}

ALPN 협상을 통해 동일한 소켓에서 [HTTPS](/ko/nodejs/api/https)와 HTTP/2를 모두 지원할 수 있습니다. `req` 및 `res` 객체는 HTTP/1 또는 HTTP/2일 수 있으며, 애플리케이션은 [HTTP/1](/ko/nodejs/api/http)의 공용 API로 제한하고 HTTP/2의 고급 기능을 사용할 수 있는지 감지 **해야 합니다**.

다음 예제는 두 프로토콜을 모두 지원하는 서버를 만듭니다.

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const cert = readFileSync('./cert.pem');
const key = readFileSync('./key.pem');

const server = createSecureServer(
  { cert, key, allowHTTP1: true },
  onRequest,
).listen(8000);

function onRequest(req, res) {
  // HTTPS 요청인지 HTTP/2인지 감지합니다.
  const { socket: { alpnProtocol } } = req.httpVersion === '2.0' ?
    req.stream.session : req;
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({
    alpnProtocol,
    httpVersion: req.httpVersion,
  }));
}
```

```js [CJS]
const { createSecureServer } = require('node:http2');
const { readFileSync } = require('node:fs');

const cert = readFileSync('./cert.pem');
const key = readFileSync('./key.pem');

const server = createSecureServer(
  { cert, key, allowHTTP1: true },
  onRequest,
).listen(4443);

function onRequest(req, res) {
  // HTTPS 요청인지 HTTP/2인지 감지합니다.
  const { socket: { alpnProtocol } } = req.httpVersion === '2.0' ?
    req.stream.session : req;
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({
    alpnProtocol,
    httpVersion: req.httpVersion,
  }));
}
```
:::

`'request'` 이벤트는 [HTTPS](/ko/nodejs/api/https)와 HTTP/2 모두에서 동일하게 작동합니다.

### Class: `http2.Http2ServerRequest` {#class-http2http2serverrequest}

**Added in: v8.4.0**

- Extends: [\<stream.Readable\>](/ko/nodejs/api/stream#class-streamreadable)

`Http2ServerRequest` 객체는 [`http2.Server`](/ko/nodejs/api/http2#class-http2server) 또는 [`http2.SecureServer`](/ko/nodejs/api/http2#class-http2secureserver)에 의해 생성되고 [`'request'`](/ko/nodejs/api/http2#event-request) 이벤트에 대한 첫 번째 인수로 전달됩니다. 요청 상태, 헤더 및 데이터에 액세스하는 데 사용할 수 있습니다.


#### 이벤트: `'aborted'` {#event-aborted_1}

**추가된 버전: v8.4.0**

`'aborted'` 이벤트는 `Http2ServerRequest` 인스턴스가 통신 도중 비정상적으로 중단될 때마다 발생합니다.

`'aborted'` 이벤트는 `Http2ServerRequest` 쓰기 가능한 측면이 종료되지 않은 경우에만 발생합니다.

#### 이벤트: `'close'` {#event-close_2}

**추가된 버전: v8.4.0**

기본 [`Http2Stream`](/ko/nodejs/api/http2#class-http2stream)이 닫혔음을 나타냅니다. `'end'`와 마찬가지로 이 이벤트는 응답당 한 번만 발생합니다.

#### `request.aborted` {#requestaborted}

**추가된 버전: v10.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

요청이 중단된 경우 `request.aborted` 속성이 `true`가 됩니다.

#### `request.authority` {#requestauthority}

**추가된 버전: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

요청 권한 의사 헤더 필드입니다. HTTP/2에서는 요청이 `:authority` 또는 `host`를 설정할 수 있으므로 이 값은 `req.headers[':authority']`가 있는 경우 해당 값에서 파생됩니다. 그렇지 않으면 `req.headers['host']`에서 파생됩니다.

#### `request.complete` {#requestcomplete}

**추가된 버전: v12.10.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

요청이 완료, 중단 또는 파괴된 경우 `request.complete` 속성이 `true`가 됩니다.

#### `request.connection` {#requestconnection}

**추가된 버전: v8.4.0**

**더 이상 사용되지 않음: v13.0.0 이후**

::: danger [안정성: 0 - 더 이상 사용되지 않음]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 더 이상 사용되지 않습니다. [`request.socket`](/ko/nodejs/api/http2#requestsocket)을 사용하세요.
:::

- [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/ko/nodejs/api/tls#class-tlstlssocket)

[`request.socket`](/ko/nodejs/api/http2#requestsocket)을 참조하십시오.

#### `request.destroy([error])` {#requestdestroyerror}

**추가된 버전: v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

[`Http2ServerRequest`](/ko/nodejs/api/http2#class-http2http2serverrequest)를 수신한 [`Http2Stream`](/ko/nodejs/api/http2#class-http2stream)에서 `destroy()`를 호출합니다. `error`가 제공되면 `'error'` 이벤트가 발생하고 `error`가 이벤트의 모든 리스너에 인수로 전달됩니다.

스트림이 이미 파괴된 경우에는 아무 작업도 수행하지 않습니다.


#### `request.headers` {#requestheaders}

**추가됨: v8.4.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

요청/응답 헤더 객체입니다.

헤더 이름 및 값의 키-값 쌍입니다. 헤더 이름은 소문자로 표시됩니다.

```js [ESM]
// 다음과 같이 출력합니다:
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
```
[HTTP/2 헤더 객체](/ko/nodejs/api/http2#headers-object)를 참조하십시오.

HTTP/2에서 요청 경로, 호스트 이름, 프로토콜 및 메서드는 `:` 문자(예: `':path'`)로 시작하는 특수 헤더로 표시됩니다. 이러한 특수 헤더는 `request.headers` 객체에 포함됩니다. 실수로 이러한 특수 헤더를 수정하지 않도록 주의해야 합니다. 그렇지 않으면 오류가 발생할 수 있습니다. 예를 들어 요청에서 모든 헤더를 제거하면 오류가 발생합니다.

```js [ESM]
removeAllHeaders(request.headers);
assert(request.url);   // :path 헤더가 제거되었기 때문에 실패합니다.
```
#### `request.httpVersion` {#requesthttpversion}

**추가됨: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

서버 요청의 경우 클라이언트가 보낸 HTTP 버전입니다. 클라이언트 응답의 경우 연결된 서버의 HTTP 버전입니다. `'2.0'`을 반환합니다.

또한 `message.httpVersionMajor`는 첫 번째 정수이고 `message.httpVersionMinor`는 두 번째 정수입니다.

#### `request.method` {#requestmethod}

**추가됨: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

문자열로 된 요청 메서드입니다. 읽기 전용입니다. 예: `'GET'`, `'DELETE'`.

#### `request.rawHeaders` {#requestrawheaders}

**추가됨: v8.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

수신된 그대로의 원시 요청/응답 헤더 목록입니다.

키와 값은 같은 목록에 있습니다. 튜플 목록이 *아닙니다*. 따라서 짝수 오프셋은 키 값이고 홀수 오프셋은 관련 값입니다.

헤더 이름은 소문자로 변경되지 않고 중복 항목은 병합되지 않습니다.

```js [ESM]
// 다음과 같이 출력합니다:
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

#### `request.rawTrailers` {#requestrawtrailers}

**추가된 버전: v8.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

수신된 그대로의 원시 요청/응답 트레일러 키와 값입니다. `'end'` 이벤트에서만 채워집니다.

#### `request.scheme` {#requestscheme}

**추가된 버전: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

대상 URL의 스키마 부분을 나타내는 요청 스키마 유사 헤더 필드입니다.

#### `request.setTimeout(msecs, callback)` {#requestsettimeoutmsecs-callback}

**추가된 버전: v8.4.0**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<http2.Http2ServerRequest\>](/ko/nodejs/api/http2#class-http2http2serverrequest)

[`Http2Stream`](/ko/nodejs/api/http2#class-http2stream)의 타임아웃 값을 `msecs`로 설정합니다. 콜백이 제공되면 응답 객체의 `'timeout'` 이벤트에 리스너로 추가됩니다.

요청, 응답 또는 서버에 `'timeout'` 리스너가 추가되지 않으면 [`Http2Stream`](/ko/nodejs/api/http2#class-http2stream)은 시간 초과 시 소멸됩니다. 핸들러가 요청, 응답 또는 서버의 `'timeout'` 이벤트에 할당되면 시간 초과된 소켓을 명시적으로 처리해야 합니다.

#### `request.socket` {#requestsocket}

**추가된 버전: v8.4.0**

- [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/ko/nodejs/api/tls#class-tlstlssocket)

`net.Socket`(또는 `tls.TLSSocket`) 역할을 하지만 HTTP/2 로직을 기반으로 게터, 세터 및 메서드를 적용하는 `Proxy` 객체를 반환합니다.

`destroyed`, `readable` 및 `writable` 속성은 `request.stream`에서 검색되어 설정됩니다.

`destroy`, `emit`, `end`, `on` 및 `once` 메서드는 `request.stream`에서 호출됩니다.

`setTimeout` 메서드는 `request.stream.session`에서 호출됩니다.

`pause`, `read`, `resume` 및 `write`는 `ERR_HTTP2_NO_SOCKET_MANIPULATION` 코드로 오류를 발생시킵니다. 자세한 내용은 [`Http2Session` 및 소켓](/ko/nodejs/api/http2#http2session-and-sockets)을 참조하십시오.

다른 모든 상호 작용은 소켓으로 직접 라우팅됩니다. TLS 지원을 통해 [`request.socket.getPeerCertificate()`](/ko/nodejs/api/tls#tlssocketgetpeercertificatedetailed)를 사용하여 클라이언트의 인증 세부 정보를 얻습니다.


#### `request.stream` {#requeststream}

**Added in: v8.4.0**

- [\<Http2Stream\>](/ko/nodejs/api/http2#class-http2stream)

요청을 뒷받침하는 [`Http2Stream`](/ko/nodejs/api/http2#class-http2stream) 객체입니다.

#### `request.trailers` {#requesttrailers}

**Added in: v8.4.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

요청/응답 트레일러 객체입니다. `'end'` 이벤트에서만 채워집니다.

#### `request.url` {#requesturl}

**Added in: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

요청 URL 문자열입니다. 여기에는 실제 HTTP 요청에 있는 URL만 포함됩니다. 요청이 다음과 같은 경우:

GET /status?name=ryan HTTP/1.1
Accept: text/plain
```
그러면 `request.url`은 다음과 같습니다.

```js [ESM]
'/status?name=ryan'
```
URL을 부분별로 구문 분석하려면 `new URL()`을 사용할 수 있습니다.

```bash [BASH]
$ node
> new URL('/status?name=ryan', 'http://example.com')
URL {
  href: 'http://example.com/status?name=ryan',
  origin: 'http://example.com',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'example.com',
  hostname: 'example.com',
  port: '',
  pathname: '/status',
  search: '?name=ryan',
  searchParams: URLSearchParams { 'name' => 'ryan' },
  hash: ''
}
```
### 클래스: `http2.Http2ServerResponse` {#class-http2http2serverresponse}

**Added in: v8.4.0**

- 확장: [\<Stream\>](/ko/nodejs/api/stream#stream)

이 객체는 HTTP 서버에서 내부적으로 생성되며 사용자가 생성하지 않습니다. [`'request'`](/ko/nodejs/api/http2#event-request) 이벤트에 대한 두 번째 매개변수로 전달됩니다.

#### 이벤트: `'close'` {#event-close_3}

**Added in: v8.4.0**

[`response.end()`](/ko/nodejs/api/http2#responseenddata-encoding-callback)가 호출되거나 플러시되기 전에 기본 [`Http2Stream`](/ko/nodejs/api/http2#class-http2stream)이 종료되었음을 나타냅니다.

#### 이벤트: `'finish'` {#event-finish}

**Added in: v8.4.0**

응답이 전송되었을 때 발생합니다. 더 구체적으로 말하면, 이 이벤트는 응답 헤더 및 본문의 마지막 세그먼트가 네트워크를 통해 전송하기 위해 HTTP/2 멀티플렉싱으로 넘겨졌을 때 발생합니다. 클라이언트가 아직 아무것도 수신하지 않았다는 의미는 아닙니다.

이 이벤트 후에는 응답 객체에서 더 이상 이벤트가 발생하지 않습니다.


#### `response.addTrailers(headers)` {#responseaddtrailersheaders}

**Added in: v8.4.0**

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

이 메서드는 HTTP 트레일러 헤더 (메시지 끝에 있는 헤더)를 응답에 추가합니다.

유효하지 않은 문자가 포함된 헤더 필드 이름 또는 값을 설정하려고 하면 [`TypeError`](/ko/nodejs/api/errors#class-typeerror)가 발생합니다.

#### `response.appendHeader(name, value)` {#responseappendheadername-value}

**Added in: v21.7.0, v20.12.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

헤더 객체에 단일 헤더 값을 추가합니다.

값이 배열인 경우, 이 메서드를 여러 번 호출하는 것과 같습니다.

헤더에 대한 이전 값이 없었던 경우, 이는 [`response.setHeader()`](/ko/nodejs/api/http2#responsesetheadername-value)를 호출하는 것과 같습니다.

유효하지 않은 문자가 포함된 헤더 필드 이름 또는 값을 설정하려고 하면 [`TypeError`](/ko/nodejs/api/errors#class-typeerror)가 발생합니다.

```js [ESM]
// "set-cookie: a" 및 "set-cookie: b"를 포함하는 헤더를 반환합니다.
const server = http2.createServer((req, res) => {
  res.setHeader('set-cookie', 'a');
  res.appendHeader('set-cookie', 'b');
  res.writeHead(200);
  res.end('ok');
});
```
#### `response.connection` {#responseconnection}

**Added in: v8.4.0**

**Deprecated since: v13.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ko/nodejs/api/documentation#stability-index) [Stability: 0](/ko/nodejs/api/documentation#stability-index) - 더 이상 사용되지 않습니다. [`response.socket`](/ko/nodejs/api/http2#responsesocket)을 사용하세요.
:::

- [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/ko/nodejs/api/tls#class-tlstlssocket)

[`response.socket`](/ko/nodejs/api/http2#responsesocket)을 참조하세요.

#### `response.createPushResponse(headers, callback)` {#responsecreatepushresponseheaders-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE` 오류가 발생합니다. |
| v8.4.0 | Added in: v8.4.0 |
:::

- `headers` [\<HTTP/2 Headers Object\>](/ko/nodejs/api/http2#headers-object) 헤더를 설명하는 객체
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `http2stream.pushStream()`이 완료되었거나, 푸시된 `Http2Stream`을 생성하려는 시도가 실패 또는 거부되었거나, `http2stream.pushStream()` 메서드를 호출하기 전에 `Http2ServerRequest`의 상태가 닫힌 경우 한 번 호출됩니다.
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `res` [\<http2.Http2ServerResponse\>](/ko/nodejs/api/http2#class-http2http2serverresponse) 새로 생성된 `Http2ServerResponse` 객체
  
 

주어진 헤더로 [`http2stream.pushStream()`](/ko/nodejs/api/http2#http2streampushstreamheaders-options-callback)을 호출하고, 성공하면 주어진 [`Http2Stream`](/ko/nodejs/api/http2#class-http2stream)을 새로 생성된 `Http2ServerResponse`에 콜백 매개변수로 래핑합니다. `Http2ServerRequest`가 닫히면 콜백은 오류 `ERR_HTTP2_INVALID_STREAM`과 함께 호출됩니다.


#### `response.end([data[, encoding]][, callback])` {#responseenddata-encoding-callback}

::: info [내역]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 이제 이 메서드는 `ServerResponse`에 대한 참조를 반환합니다. |
| v8.4.0 | 추가됨: v8.4.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

이 메서드는 모든 응답 헤더와 본문이 전송되었음을 서버에 알립니다. 서버는 이 메시지가 완료된 것으로 간주해야 합니다. 각 응답에서 `response.end()` 메서드를 호출해야 합니다.

`data`가 지정된 경우, 이는 [`response.write(data, encoding)`](/ko/nodejs/api/http#responsewritechunk-encoding-callback)를 호출한 다음 `response.end(callback)`을 호출하는 것과 같습니다.

`callback`이 지정된 경우, 응답 스트림이 완료되면 호출됩니다.

#### `response.finished` {#responsefinished}

**추가됨: v8.4.0**

**더 이상 사용되지 않음: v13.4.0, v12.16.0**

::: danger [안정성: 0 - 더 이상 사용되지 않음]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 더 이상 사용되지 않습니다. [`response.writableEnded`](/ko/nodejs/api/http2#responsewritableended)를 사용하세요.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

응답이 완료되었는지 여부를 나타내는 부울 값입니다. `false`로 시작합니다. [`response.end()`](/ko/nodejs/api/http2#responseenddata-encoding-callback)가 실행된 후 값은 `true`가 됩니다.

#### `response.getHeader(name)` {#responsegetheadername}

**추가됨: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이미 대기열에 있지만 클라이언트로 전송되지 않은 헤더를 읽습니다. 이름은 대소문자를 구분하지 않습니다.

```js [ESM]
const contentType = response.getHeader('content-type');
```

#### `response.getHeaderNames()` {#responsegetheadernames}

**Added in: v8.4.0**

- 반환값: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

현재 나가는 헤더의 고유한 이름이 포함된 배열을 반환합니다. 모든 헤더 이름은 소문자입니다.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```
#### `response.getHeaders()` {#responsegetheaders}

**Added in: v8.4.0**

- 반환값: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

현재 나가는 헤더의 얕은 복사본을 반환합니다. 얕은 복사본이 사용되기 때문에 다양한 헤더 관련 http 모듈 메서드를 추가로 호출하지 않고도 배열 값을 변경할 수 있습니다. 반환된 객체의 키는 헤더 이름이고 값은 해당 헤더 값입니다. 모든 헤더 이름은 소문자입니다.

`response.getHeaders()` 메서드에서 반환된 객체는 JavaScript `Object`에서 프로토타입으로 상속받지 *않습니다*. 즉, `obj.toString()`, `obj.hasOwnProperty()` 등과 같은 일반적인 `Object` 메서드가 정의되지 않으며 *작동하지 않습니다*.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
#### `response.hasHeader(name)` {#responsehasheadername}

**Added in: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`name`으로 식별된 헤더가 현재 나가는 헤더에 설정되어 있으면 `true`를 반환합니다. 헤더 이름 일치는 대소문자를 구분하지 않습니다.

```js [ESM]
const hasContentType = response.hasHeader('content-type');
```
#### `response.headersSent` {#responseheaderssent}

**Added in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

헤더가 전송되었으면 true, 그렇지 않으면 false입니다 (읽기 전용).


#### `response.removeHeader(name)` {#responseremoveheadername}

**Added in: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

암묵적 전송을 위해 대기열에 추가된 헤더를 제거합니다.

```js [ESM]
response.removeHeader('Content-Encoding');
```
#### `response.req` {#responsereq}

**Added in: v15.7.0**

- [\<http2.Http2ServerRequest\>](/ko/nodejs/api/http2#class-http2http2serverrequest)

원래 HTTP2 `request` 객체에 대한 참조입니다.

#### `response.sendDate` {#responsesenddate}

**Added in: v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

true인 경우 헤더에 아직 없는 경우 응답에서 Date 헤더가 자동으로 생성되어 전송됩니다. 기본값은 true입니다.

이것은 테스트 목적으로만 비활성화해야 합니다. HTTP는 응답에 Date 헤더를 요구합니다.

#### `response.setHeader(name, value)` {#responsesetheadername-value}

**Added in: v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

암묵적 헤더에 대한 단일 헤더 값을 설정합니다. 이 헤더가 이미 전송될 헤더에 있는 경우 해당 값이 대체됩니다. 동일한 이름으로 여러 헤더를 보내려면 여기에 문자열 배열을 사용하세요.

```js [ESM]
response.setHeader('Content-Type', 'text/html; charset=utf-8');
```
또는

```js [ESM]
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```
잘못된 문자를 포함하는 헤더 필드 이름 또는 값을 설정하려고 하면 [`TypeError`](/ko/nodejs/api/errors#class-typeerror)가 발생합니다.

헤더가 [`response.setHeader()`](/ko/nodejs/api/http2#responsesetheadername-value)로 설정된 경우 [`response.writeHead()`](/ko/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers)에 전달된 헤더와 병합되며 [`response.writeHead()`](/ko/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers)에 전달된 헤더가 우선됩니다.

```js [ESM]
// content-type = text/plain 반환
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```

#### `response.setTimeout(msecs[, callback])` {#responsesettimeoutmsecs-callback}

**Added in: v8.4.0**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환값: [\<http2.Http2ServerResponse\>](/ko/nodejs/api/http2#class-http2http2serverresponse)

[`Http2Stream`](/ko/nodejs/api/http2#class-http2stream)의 타임아웃 값을 `msecs`로 설정합니다. 콜백이 제공되면 응답 객체의 `'timeout'` 이벤트에 대한 리스너로 추가됩니다.

요청, 응답 또는 서버에 `'timeout'` 리스너가 추가되지 않으면 [`Http2Stream`](/ko/nodejs/api/http2#class-http2stream)은 타임아웃될 때 소멸됩니다. 처리기가 요청, 응답 또는 서버의 `'timeout'` 이벤트에 할당되면 타임아웃된 소켓은 명시적으로 처리해야 합니다.

#### `response.socket` {#responsesocket}

**Added in: v8.4.0**

- [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/ko/nodejs/api/tls#class-tlstlssocket)

`net.Socket` (또는 `tls.TLSSocket`) 역할을 하지만 HTTP/2 로직을 기반으로 getter, setter 및 메서드를 적용하는 `Proxy` 객체를 반환합니다.

`destroyed`, `readable` 및 `writable` 속성은 `response.stream`에서 검색 및 설정됩니다.

`destroy`, `emit`, `end`, `on` 및 `once` 메서드는 `response.stream`에서 호출됩니다.

`setTimeout` 메서드는 `response.stream.session`에서 호출됩니다.

`pause`, `read`, `resume` 및 `write`는 `ERR_HTTP2_NO_SOCKET_MANIPULATION` 코드로 오류를 발생시킵니다. 자세한 내용은 [`Http2Session` 및 소켓](/ko/nodejs/api/http2#http2session-and-sockets)을 참조하세요.

다른 모든 상호 작용은 소켓으로 직접 라우팅됩니다.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  const port = req.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  const port = req.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```
:::


#### `response.statusCode` {#responsestatuscode}

**Added in: v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

암시적 헤더를 사용하는 경우 (명시적으로 [`response.writeHead()`](/ko/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers)를 호출하지 않는 경우), 이 속성은 헤더가 플러시될 때 클라이언트로 전송될 상태 코드를 제어합니다.

```js [ESM]
response.statusCode = 404;
```

응답 헤더가 클라이언트로 전송된 후, 이 속성은 전송된 상태 코드를 나타냅니다.

#### `response.statusMessage` {#responsestatusmessage}

**Added in: v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

상태 메시지는 HTTP/2에서 지원되지 않습니다 (RFC 7540 8.1.2.4). 빈 문자열을 반환합니다.

#### `response.stream` {#responsestream}

**Added in: v8.4.0**

- [\<Http2Stream\>](/ko/nodejs/api/http2#class-http2stream)

응답을 지원하는 [`Http2Stream`](/ko/nodejs/api/http2#class-http2stream) 객체입니다.

#### `response.writableEnded` {#responsewritableended}

**Added in: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`response.end()`](/ko/nodejs/api/http2#responseenddata-encoding-callback)가 호출된 후 `true`입니다. 이 속성은 데이터가 플러시되었는지 여부를 나타내지 않으며, 이를 위해서는 [`writable.writableFinished`](/ko/nodejs/api/stream#writablewritablefinished)를 대신 사용하십시오.

#### `response.write(chunk[, encoding][, callback])` {#responsewritechunk-encoding-callback}

**Added in: v8.4.0**

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

이 메서드가 호출되고 [`response.writeHead()`](/ko/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers)가 호출되지 않은 경우, 암시적 헤더 모드로 전환하고 암시적 헤더를 플러시합니다.

이것은 응답 본문의 chunk를 보냅니다. 이 메서드는 본문의 연속적인 부분을 제공하기 위해 여러 번 호출될 수 있습니다.

`node:http` 모듈에서 요청이 HEAD 요청인 경우 응답 본문은 생략됩니다. 마찬가지로 `204` 및 `304` 응답에는 메시지 본문이 *포함되어서는 안 됩니다*.

`chunk`는 문자열 또는 버퍼일 수 있습니다. `chunk`가 문자열인 경우, 두 번째 매개변수는 바이트 스트림으로 인코딩하는 방법을 지정합니다. 기본적으로 `encoding`은 `'utf8'`입니다. 이 데이터 chunk가 플러시될 때 `callback`이 호출됩니다.

이것은 원시 HTTP 본문이며 사용될 수 있는 더 높은 수준의 멀티파트 본문 인코딩과는 관련이 없습니다.

[`response.write()`](/ko/nodejs/api/http2#responsewritechunk-encoding-callback)가 처음 호출될 때 버퍼링된 헤더 정보와 본문의 첫 번째 chunk를 클라이언트로 보냅니다. [`response.write()`](/ko/nodejs/api/http2#responsewritechunk-encoding-callback)가 두 번째로 호출될 때 Node.js는 데이터가 스트리밍될 것으로 가정하고 새 데이터를 별도로 보냅니다. 즉, 응답은 본문의 첫 번째 chunk까지 버퍼링됩니다.

전체 데이터가 커널 버퍼로 성공적으로 플러시되면 `true`를 반환합니다. 데이터의 전부 또는 일부가 사용자 메모리에 대기열에 있으면 `false`를 반환합니다. 버퍼가 다시 비워지면 `'drain'`이 발생합니다.


#### `response.writeContinue()` {#responsewritecontinue}

**추가된 버전: v8.4.0**

클라이언트에게 `100 Continue` 상태를 보내 요청 본문이 전송되어야 함을 나타냅니다. `Http2Server` 및 `Http2SecureServer`의 [`'checkContinue'`](/ko/nodejs/api/http2#event-checkcontinue) 이벤트를 참조하십시오.

#### `response.writeEarlyHints(hints)` {#responsewriteearlyhintshints}

**추가된 버전: v18.11.0**

- `hints` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

사용자 에이전트가 연결된 리소스를 미리 로드/미리 연결할 수 있음을 나타내는 Link 헤더와 함께 클라이언트에 `103 Early Hints` 상태를 보냅니다. `hints`는 얼리 힌트 메시지와 함께 보낼 헤더 값을 포함하는 객체입니다.

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
});
```
#### `response.writeHead(statusCode[, statusMessage][, headers])` {#responsewriteheadstatuscode-statusmessage-headers}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v11.10.0, v10.17.0 | `end()`와 연결할 수 있도록 `writeHead()`에서 `this`를 반환합니다. |
| v8.4.0 | 추가된 버전: v8.4.0 |
:::

- `statusCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- 반환 값: [\<http2.Http2ServerResponse\>](/ko/nodejs/api/http2#class-http2http2serverresponse)

요청에 대한 응답 헤더를 보냅니다. 상태 코드는 `404`와 같은 3자리 HTTP 상태 코드입니다. 마지막 인수인 `headers`는 응답 헤더입니다.

호출을 연결할 수 있도록 `Http2ServerResponse`에 대한 참조를 반환합니다.

[HTTP/1](/ko/nodejs/api/http)과의 호환성을 위해 사람이 읽을 수 있는 `statusMessage`를 두 번째 인수로 전달할 수 있습니다. 그러나 `statusMessage`는 HTTP/2 내에서 의미가 없으므로 인수는 아무런 영향을 미치지 않으며 프로세스 경고가 발생합니다.

```js [ESM]
const body = 'hello world';
response.writeHead(200, {
  'Content-Length': Buffer.byteLength(body),
  'Content-Type': 'text/plain; charset=utf-8',
});
```
`Content-Length`는 문자가 아닌 바이트 단위로 제공됩니다. `Buffer.byteLength()` API를 사용하여 지정된 인코딩의 바이트 수를 확인할 수 있습니다. 아웃바운드 메시지에서 Node.js는 Content-Length와 전송되는 본문의 길이가 동일한지 여부를 확인하지 않습니다. 그러나 메시지를 수신할 때 Node.js는 `Content-Length`가 실제 페이로드 크기와 일치하지 않으면 자동으로 메시지를 거부합니다.

이 메서드는 [`response.end()`](/ko/nodejs/api/http2#responseenddata-encoding-callback)가 호출되기 전에 메시지에서 최대 한 번 호출할 수 있습니다.

[`response.write()`](/ko/nodejs/api/http2#responsewritechunk-encoding-callback) 또는 [`response.end()`](/ko/nodejs/api/http2#responseenddata-encoding-callback)가 이를 호출하기 전에 호출되면 암시적/변경 가능한 헤더가 계산되어 이 함수를 호출합니다.

헤더가 [`response.setHeader()`](/ko/nodejs/api/http2#responsesetheadername-value)로 설정된 경우 [`response.writeHead()`](/ko/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers)에 전달된 모든 헤더와 병합되며, [`response.writeHead()`](/ko/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers)에 전달된 헤더가 우선적으로 적용됩니다.

```js [ESM]
// content-type = text/plain 반환
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```
유효하지 않은 문자를 포함하는 헤더 필드 이름 또는 값을 설정하려고 하면 [`TypeError`](/ko/nodejs/api/errors#class-typeerror)가 발생합니다.


## HTTP/2 성능 지표 수집하기 {#collecting-http/2-performance-metrics}

[Performance Observer](/ko/nodejs/api/perf_hooks) API를 사용하여 각 `Http2Session` 및 `Http2Stream` 인스턴스에 대한 기본 성능 지표를 수집할 수 있습니다.

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(entry.entryType);  // 'http2' 출력
  if (entry.name === 'Http2Session') {
    // 항목에는 Http2Session에 대한 통계가 포함됩니다.
  } else if (entry.name === 'Http2Stream') {
    // 항목에는 Http2Stream에 대한 통계가 포함됩니다.
  }
});
obs.observe({ entryTypes: ['http2'] });
```

```js [CJS]
const { PerformanceObserver } = require('node:perf_hooks');

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(entry.entryType);  // 'http2' 출력
  if (entry.name === 'Http2Session') {
    // 항목에는 Http2Session에 대한 통계가 포함됩니다.
  } else if (entry.name === 'Http2Stream') {
    // 항목에는 Http2Stream에 대한 통계가 포함됩니다.
  }
});
obs.observe({ entryTypes: ['http2'] });
```
:::

`PerformanceEntry`의 `entryType` 속성은 `'http2'`와 같습니다.

`PerformanceEntry`의 `name` 속성은 `'Http2Stream'` 또는 `'Http2Session'`과 같습니다.

`name`이 `Http2Stream`과 같은 경우, `PerformanceEntry`는 다음 추가 속성을 포함합니다.

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 `Http2Stream`에 대해 수신된 `DATA` 프레임 바이트 수입니다.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 `Http2Stream`에 대해 전송된 `DATA` 프레임 바이트 수입니다.
- `id` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 연결된 `Http2Stream`의 식별자입니다.
- `timeToFirstByte` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `PerformanceEntry` `startTime`과 첫 번째 `DATA` 프레임 수신 사이의 경과 시간(밀리초)입니다.
- `timeToFirstByteSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `PerformanceEntry` `startTime`과 첫 번째 `DATA` 프레임 전송 사이의 경과 시간(밀리초)입니다.
- `timeToFirstHeader` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `PerformanceEntry` `startTime`과 첫 번째 헤더 수신 사이의 경과 시간(밀리초)입니다.

`name`이 `Http2Session`과 같은 경우, `PerformanceEntry`는 다음 추가 속성을 포함합니다.

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 `Http2Session`에 대해 수신된 바이트 수입니다.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 `Http2Session`에 대해 전송된 바이트 수입니다.
- `framesReceived` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session`에서 수신한 HTTP/2 프레임 수입니다.
- `framesSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session`에서 전송한 HTTP/2 프레임 수입니다.
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session`의 수명 동안 동시에 열려 있는 최대 스트림 수입니다.
- `pingRTT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `PING` 프레임 전송과 해당 승인 수신 사이의 경과 시간(밀리초)입니다. `PING` 프레임이 `Http2Session`에서 전송된 경우에만 존재합니다.
- `streamAverageDuration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 모든 `Http2Stream` 인스턴스에 대한 평균 지속 시간(밀리초)입니다.
- `streamCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `Http2Session`에서 처리한 `Http2Stream` 인스턴스 수입니다.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `Http2Session`의 유형을 식별하기 위한 `'server'` 또는 `'client'`입니다.


## `:authority` 및 `host`에 대한 참고 사항 {#note-on-authority-and-host}

HTTP/2는 요청에 `:authority` 가상 헤더 또는 `host` 헤더가 있어야 합니다. HTTP/2 요청을 직접 구성할 때는 `:authority`를 선호하고, HTTP/1에서 변환할 때는 (예: 프록시에서) `host`를 선호합니다.

호환성 API는 `:authority`가 없는 경우 `host`로 대체됩니다. 자세한 내용은 [`request.authority`](/ko/nodejs/api/http2#requestauthority)를 참조하세요. 그러나 호환성 API를 사용하지 않거나 `req.headers`를 직접 사용하는 경우 대체 동작을 직접 구현해야 합니다.

