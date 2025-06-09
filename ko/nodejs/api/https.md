---
title: Node.js 문서 - HTTPS
description: Node.js의 HTTPS 모듈은 TLS/SSL 프로토콜의 구현을 제공하여 안전한 HTTP 연결을 가능하게 합니다. 안전한 서버와 클라이언트를 생성하고, 인증서를 처리하며, 안전한 연결을 관리하는 방법을 포함합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - HTTPS | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 HTTPS 모듈은 TLS/SSL 프로토콜의 구현을 제공하여 안전한 HTTP 연결을 가능하게 합니다. 안전한 서버와 클라이언트를 생성하고, 인증서를 처리하며, 안전한 연결을 관리하는 방법을 포함합니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - HTTPS | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 HTTPS 모듈은 TLS/SSL 프로토콜의 구현을 제공하여 안전한 HTTP 연결을 가능하게 합니다. 안전한 서버와 클라이언트를 생성하고, 인증서를 처리하며, 안전한 연결을 관리하는 방법을 포함합니다.
---


# HTTPS {#https}

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

**소스 코드:** [lib/https.js](https://github.com/nodejs/node/blob/v23.5.0/lib/https.js)

HTTPS는 TLS/SSL을 통한 HTTP 프로토콜입니다. Node.js에서는 이것이 별도의 모듈로 구현됩니다.

## crypto 지원이 불가능한지 확인하기 {#determining-if-crypto-support-is-unavailable}

Node.js는 `node:crypto` 모듈에 대한 지원을 포함하지 않고 빌드될 수 있습니다. 이러한 경우, `https`에서 `import`하거나 `require('node:https')`를 호출하려고 하면 오류가 발생합니다.

CommonJS를 사용하는 경우, try/catch를 사용하여 발생한 오류를 잡을 수 있습니다.

```js [CJS]
let https;
try {
  https = require('node:https');
} catch (err) {
  console.error('https 지원이 비활성화되었습니다!');
}
```
어휘적 ESM `import` 키워드를 사용하는 경우, 모듈을 로드하려는 시도 *전에* `process.on('uncaughtException')`에 대한 핸들러가 등록된 경우에만 오류를 잡을 수 있습니다(예: 프리로드 모듈 사용).

ESM을 사용하는 경우, 코드가 crypto 지원이 활성화되지 않은 Node.js 빌드에서 실행될 가능성이 있다면, 어휘적 `import` 키워드 대신 [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) 함수를 사용하는 것을 고려하십시오.

```js [ESM]
let https;
try {
  https = await import('node:https');
} catch (err) {
  console.error('https 지원이 비활성화되었습니다!');
}
```
## Class: `https.Agent` {#class-httpsagent}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v5.3.0 | TLS 세션 캐싱을 비활성화하기 위해 `0` `maxCachedSessions` 지원. |
| v2.5.0 | TLS 세션 재사용을 위한 `options`에 `maxCachedSessions` 매개변수 추가. |
| v0.4.5 | v0.4.5에 추가됨 |
:::

[`http.Agent`](/ko/nodejs/api/http#class-httpagent)와 유사한 HTTPS용 [`Agent`](/ko/nodejs/api/https#class-httpsagent) 객체입니다. 자세한 내용은 [`https.request()`](/ko/nodejs/api/https#httpsrequestoptions-callback)를 참조하십시오.

### `new Agent([options])` {#new-agentoptions}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.5.0 | 대상 호스트가 IP 주소를 사용하여 지정된 경우 servername을 자동으로 설정하지 않습니다. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 에이전트에 설정할 구성 가능한 옵션 집합입니다. [`http.Agent(options)`](/ko/nodejs/api/http#new-agentoptions)와 동일한 필드를 가질 수 있으며,
    -  `maxCachedSessions` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 최대 TLS 캐시된 세션 수입니다. TLS 세션 캐싱을 비활성화하려면 `0`을 사용하십시오. **기본값:** `100`.
    -  `servername` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 서버에 보낼 [Server Name Indication 확장](https://en.wikipedia.org/wiki/Server_Name_Indication)의 값입니다. 확장을 보내지 않으려면 빈 문자열 `''`을 사용하십시오. **기본값:** 대상 서버가 IP 주소를 사용하여 지정되지 않은 경우 대상 서버의 호스트 이름이며, 이 경우 기본값은 `''`(확장 없음)입니다. TLS 세션 재사용에 대한 자세한 내용은 [`세션 재개`](/ko/nodejs/api/tls#session-resumption)를 참조하십시오.


#### 이벤트: `'keylog'` {#event-keylog}

**추가된 버전: v13.2.0, v12.16.0**

- `line` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) NSS `SSLKEYLOGFILE` 형식의 ASCII 텍스트 라인입니다.
- `tlsSocket` [\<tls.TLSSocket\>](/ko/nodejs/api/tls#class-tlstlssocket) 이 에이전트에서 관리하는 연결에 의해 생성되거나 수신된 `tls.TLSSocket` 인스턴스입니다(일반적으로 핸드셰이크가 완료되기 전이지만 반드시 그런 것은 아님). 이 키잉 자료는 캡처된 TLS 트래픽을 해독할 수 있으므로 디버깅을 위해 저장할 수 있습니다. 각 소켓에 대해 여러 번 발생할 수 있습니다.

일반적인 사용 사례는 수신된 라인을 공통 텍스트 파일에 추가하는 것입니다. 이 파일은 나중에 Wireshark와 같은 소프트웨어에서 트래픽을 해독하는 데 사용됩니다.

```js [ESM]
// ...
https.globalAgent.on('keylog', (line, tlsSocket) => {
  fs.appendFileSync('/tmp/ssl-keys.log', line, { mode: 0o600 });
});
```
## 클래스: `https.Server` {#class-httpsserver}

**추가된 버전: v0.3.4**

- 확장: [\<tls.Server\>](/ko/nodejs/api/tls#class-tlsserver)

자세한 내용은 [`http.Server`](/ko/nodejs/api/http#class-httpserver)를 참조하십시오.

### `server.close([callback])` {#serverclosecallback}

**추가된 버전: v0.1.90**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<https.Server\>](/ko/nodejs/api/https#class-httpsserver)

`node:http` 모듈의 [`server.close()`](/ko/nodejs/api/http#serverclosecallback)를 참조하십시오.

### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**추가된 버전: v20.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

[`server.close()`](/ko/nodejs/api/https#serverclosecallback)를 호출하고 서버가 닫힐 때 충족되는 promise를 반환합니다.

### `server.closeAllConnections()` {#servercloseallconnections}

**추가된 버전: v18.2.0**

`node:http` 모듈의 [`server.closeAllConnections()`](/ko/nodejs/api/http#servercloseallconnections)를 참조하십시오.

### `server.closeIdleConnections()` {#servercloseidleconnections}

**추가된 버전: v18.2.0**

`node:http` 모듈의 [`server.closeIdleConnections()`](/ko/nodejs/api/http#servercloseidleconnections)를 참조하십시오.


### `server.headersTimeout` {#serverheaderstimeout}

**Added in: v11.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `60000`

`node:http` 모듈의 [`server.headersTimeout`](/ko/nodejs/api/http#serverheaderstimeout)을(를) 참조하십시오.

### `server.listen()` {#serverlisten}

암호화된 연결을 수신 대기하는 HTTPS 서버를 시작합니다. 이 메서드는 [`net.Server`](/ko/nodejs/api/net#class-netserver)의 [`server.listen()`](/ko/nodejs/api/net#serverlisten)과 동일합니다.

### `server.maxHeadersCount` {#servermaxheaderscount}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `2000`

`node:http` 모듈의 [`server.maxHeadersCount`](/ko/nodejs/api/http#servermaxheaderscount)을(를) 참조하십시오.

### `server.requestTimeout` {#serverrequesttimeout}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 기본 요청 시간 초과가 시간 초과 없음에서 300초(5분)로 변경되었습니다. |
| v14.11.0 | 추가된 버전: v14.11.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `300000`

`node:http` 모듈의 [`server.requestTimeout`](/ko/nodejs/api/http#serverrequesttimeout)을(를) 참조하십시오.

### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

**Added in: v0.11.2**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `120000` (2분)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환값: [\<https.Server\>](/ko/nodejs/api/https#class-httpsserver)

`node:http` 모듈의 [`server.setTimeout()`](/ko/nodejs/api/http#serversettimeoutmsecs-callback)을(를) 참조하십시오.

### `server.timeout` {#servertimeout}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.0.0 | 기본 시간 초과가 120초에서 0(시간 초과 없음)으로 변경되었습니다. |
| v0.11.2 | 추가된 버전: v0.11.2 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** 0 (시간 초과 없음)

`node:http` 모듈의 [`server.timeout`](/ko/nodejs/api/http#servertimeout)을(를) 참조하십시오.


### `server.keepAliveTimeout` {#serverkeepalivetimeout}

**추가된 버전: v8.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `5000` (5초)

`node:http` 모듈의 [`server.keepAliveTimeout`](/ko/nodejs/api/http#serverkeepalivetimeout)을 참조하십시오.

## `https.createServer([options][, requestListener])` {#httpscreateserveroptions-requestlistener}

**추가된 버전: v0.3.4**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`tls.createServer()`](/ko/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener), [`tls.createSecureContext()`](/ko/nodejs/api/tls#tlscreatesecurecontextoptions) 및 [`http.createServer()`](/ko/nodejs/api/http#httpcreateserveroptions-requestlistener)에서 `options`를 받습니다.
- `requestListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `'request'` 이벤트에 추가할 리스너입니다.
- 반환값: [\<https.Server\>](/ko/nodejs/api/https#class-httpsserver)



::: code-group
```js [ESM]
// curl -k https://localhost:8000/
import { createServer } from 'node:https';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('private-key.pem'),
  cert: readFileSync('certificate.pem'),
};

createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```

```js [CJS]
// curl -k https://localhost:8000/
const https = require('node:https');
const fs = require('node:fs');

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```
:::

또는



::: code-group
```js [ESM]
import { createServer } from 'node:https';
import { readFileSync } from 'node:fs';

const options = {
  pfx: readFileSync('test_cert.pfx'),
  passphrase: 'sample',
};

createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```

```js [CJS]
const https = require('node:https');
const fs = require('node:fs');

const options = {
  pfx: fs.readFileSync('test_cert.pfx'),
  passphrase: 'sample',
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```
:::

이 예제에 대한 인증서와 키를 생성하려면 다음을 실행합니다.

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout private-key.pem -out certificate.pem
```
그런 다음 이 예제에 대한 `pfx` 인증서를 생성하려면 다음을 실행합니다.

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out test_cert.pfx \
  -inkey private-key.pem -in certificate.pem -passout pass:sample
```

## `https.get(options[, callback])` {#httpsgetoptions-callback}

## `https.get(url[, options][, callback])` {#httpsgeturl-options-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v10.9.0 | `url` 매개변수를 별도의 `options` 객체와 함께 전달할 수 있습니다. |
| v7.5.0 | `options` 매개변수는 WHATWG `URL` 객체일 수 있습니다. |
| v0.3.6 | Added in: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 메서드가 기본적으로 GET으로 설정된 [`https.request()`](/ko/nodejs/api/https#httpsrequestoptions-callback)와 동일한 `options`를 허용합니다.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

[`http.get()`](/ko/nodejs/api/http#httpgetoptions-callback)과 유사하지만 HTTPS용입니다.

`options`는 객체, 문자열 또는 [`URL`](/ko/nodejs/api/url#the-whatwg-url-api) 객체일 수 있습니다. `options`가 문자열인 경우 [`new URL()`](/ko/nodejs/api/url#new-urlinput-base)로 자동 구문 분석됩니다. [`URL`](/ko/nodejs/api/url#the-whatwg-url-api) 객체인 경우 자동으로 일반 `options` 객체로 변환됩니다.

::: code-group
```js [ESM]
import { get } from 'node:https';
import process from 'node:process';

get('https://encrypted.google.com/', (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});
```

```js [CJS]
const https = require('node:https');

https.get('https://encrypted.google.com/', (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});
```
:::


## `https.globalAgent` {#httpsglobalagent}

::: info [History]
| Version | Changes |
| --- | --- |
| v19.0.0 | 에이전트는 이제 기본적으로 HTTP Keep-Alive와 5초의 타임아웃을 사용합니다. |
| v0.5.9 | Added in: v0.5.9 |
:::

모든 HTTPS 클라이언트 요청을 위한 [`https.Agent`](/ko/nodejs/api/https#class-httpsagent)의 전역 인스턴스입니다. `keepAlive`가 활성화되고 `timeout`이 5초인 기본 [`https.Agent`](/ko/nodejs/api/https#class-httpsagent) 구성과 다릅니다.

## `https.request(options[, callback])` {#httpsrequestoptions-callback}

## `https.request(url[, options][, callback])` {#httpsrequesturl-options-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v22.4.0, v20.16.0 | `clientCertEngine` 옵션은 OpenSSL 3에서 더 이상 사용되지 않는 OpenSSL의 사용자 정의 엔진 지원에 따라 달라집니다. |
| v16.7.0, v14.18.0 | `URL` 객체를 사용하는 경우 파싱된 사용자 이름과 비밀번호가 이제 올바르게 URI 디코딩됩니다. |
| v14.1.0, v13.14.0 | 이제 `highWaterMark` 옵션이 허용됩니다. |
| v10.9.0 | 이제 `url` 매개변수를 별도의 `options` 객체와 함께 전달할 수 있습니다. |
| v9.3.0 | 이제 `options` 매개변수에 `clientCertEngine`을 포함할 수 있습니다. |
| v7.5.0 | `options` 매개변수는 WHATWG `URL` 객체일 수 있습니다. |
| v0.3.6 | Added in: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 기본값이 약간 다른 [`http.request()`](/ko/nodejs/api/http#httprequestoptions-callback)의 모든 `options`를 허용합니다.
    - `protocol` **기본값:** `'https:'`
    - `port` **기본값:** `443`
    - `agent` **기본값:** `https.globalAgent`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<http.ClientRequest\>](/ko/nodejs/api/http#class-httpclientrequest)

보안 웹 서버에 요청을 합니다.

[`tls.connect()`](/ko/nodejs/api/tls#tlsconnectoptions-callback)의 다음 추가 `options`도 허용됩니다: `ca`, `cert`, `ciphers`, `clientCertEngine` (deprecated), `crl`, `dhparam`, `ecdhCurve`, `honorCipherOrder`, `key`, `passphrase`, `pfx`, `rejectUnauthorized`, `secureOptions`, `secureProtocol`, `servername`, `sessionIdContext`, `highWaterMark`.

`options`는 객체, 문자열 또는 [`URL`](/ko/nodejs/api/url#the-whatwg-url-api) 객체일 수 있습니다. `options`가 문자열인 경우 [`new URL()`](/ko/nodejs/api/url#new-urlinput-base)로 자동 파싱됩니다. [`URL`](/ko/nodejs/api/url#the-whatwg-url-api) 객체인 경우 일반 `options` 객체로 자동 변환됩니다.

`https.request()`는 [`http.ClientRequest`](/ko/nodejs/api/http#class-httpclientrequest) 클래스의 인스턴스를 반환합니다. `ClientRequest` 인스턴스는 쓰기 가능한 스트림입니다. POST 요청으로 파일을 업로드해야 하는 경우 `ClientRequest` 객체에 쓰십시오.

::: code-group
```js [ESM]
import { request } from 'node:https';
import process from 'node:process';

const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
};

const req = request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
```

```js [CJS]
const https = require('node:https');

const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
};

const req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
```
:::

[`tls.connect()`](/ko/nodejs/api/tls#tlsconnectoptions-callback)의 옵션을 사용하는 예시:

```js [ESM]
const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
};
options.agent = new https.Agent(options);

const req = https.request(options, (res) => {
  // ...
});
```
또는 [`Agent`](/ko/nodejs/api/https#class-httpsagent)를 사용하지 않고 연결 풀링을 옵트 아웃하십시오.

```js [ESM]
const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
  agent: false,
};

const req = https.request(options, (res) => {
  // ...
});
```
[`URL`](/ko/nodejs/api/url#the-whatwg-url-api)을 `options`로 사용하는 예시:

```js [ESM]
const options = new URL('https://abc:');

const req = https.request(options, (res) => {
  // ...
});
```
인증서 지문 또는 공개 키(와 유사한 `pin-sha256`)에 고정하는 예시:

::: code-group
```js [ESM]
import { checkServerIdentity } from 'node:tls';
import { Agent, request } from 'node:https';
import { createHash } from 'node:crypto';

function sha256(s) {
  return createHash('sha256').update(s).digest('base64');
}
const options = {
  hostname: 'github.com',
  port: 443,
  path: '/',
  method: 'GET',
  checkServerIdentity: function(host, cert) {
    // Make sure the certificate is issued to the host we are connected to
    const err = checkServerIdentity(host, cert);
    if (err) {
      return err;
    }

    // Pin the public key, similar to HPKP pin-sha256 pinning
    const pubkey256 = 'SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=';
    if (sha256(cert.pubkey) !== pubkey256) {
      const msg = 'Certificate verification error: ' +
        `The public key of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // Pin the exact certificate, rather than the pub key
    const cert256 = 'FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:' +
      '0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65';
    if (cert.fingerprint256 !== cert256) {
      const msg = 'Certificate verification error: ' +
        `The certificate of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // This loop is informational only.
    // Print the certificate and public key fingerprints of all certs in the
    // chain. Its common to pin the public key of the issuer on the public
    // internet, while pinning the public key of the service in sensitive
    // environments.
    let lastprint256;
    do {
      console.log('Subject Common Name:', cert.subject.CN);
      console.log('  Certificate SHA256 fingerprint:', cert.fingerprint256);

      const hash = createHash('sha256');
      console.log('  Public key ping-sha256:', sha256(cert.pubkey));

      lastprint256 = cert.fingerprint256;
      cert = cert.issuerCertificate;
    } while (cert.fingerprint256 !== lastprint256);

  },
};

options.agent = new Agent(options);
const req = request(options, (res) => {
  console.log('All OK. Server matched our pinned cert or public key');
  console.log('statusCode:', res.statusCode);

  res.on('data', (d) => {});
});

req.on('error', (e) => {
  console.error(e.message);
});
req.end();
```

```js [CJS]
const tls = require('node:tls');
const https = require('node:https');
const crypto = require('node:crypto');

function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('base64');
}
const options = {
  hostname: 'github.com',
  port: 443,
  path: '/',
  method: 'GET',
  checkServerIdentity: function(host, cert) {
    // Make sure the certificate is issued to the host we are connected to
    const err = tls.checkServerIdentity(host, cert);
    if (err) {
      return err;
    }

    // Pin the public key, similar to HPKP pin-sha256 pinning
    const pubkey256 = 'SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=';
    if (sha256(cert.pubkey) !== pubkey256) {
      const msg = 'Certificate verification error: ' +
        `The public key of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // Pin the exact certificate, rather than the pub key
    const cert256 = 'FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:' +
      '0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65';
    if (cert.fingerprint256 !== cert256) {
      const msg = 'Certificate verification error: ' +
        `The certificate of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // This loop is informational only.
    // Print the certificate and public key fingerprints of all certs in the
    // chain. Its common to pin the public key of the issuer on the public
    // internet, while pinning the public key of the service in sensitive
    // environments.
    do {
      console.log('Subject Common Name:', cert.subject.CN);
      console.log('  Certificate SHA256 fingerprint:', cert.fingerprint256);

      hash = crypto.createHash('sha256');
      console.log('  Public key ping-sha256:', sha256(cert.pubkey));

      lastprint256 = cert.fingerprint256;
      cert = cert.issuerCertificate;
    } while (cert.fingerprint256 !== lastprint256);

  },
};

options.agent = new https.Agent(options);
const req = https.request(options, (res) => {
  console.log('All OK. Server matched our pinned cert or public key');
  console.log('statusCode:', res.statusCode);

  res.on('data', (d) => {});
});

req.on('error', (e) => {
  console.error(e.message);
});
req.end();
```
:::

예시 출력:

```text [TEXT]
Subject Common Name: github.com
  Certificate SHA256 fingerprint: FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65
  Public key ping-sha256: SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=
Subject Common Name: Sectigo ECC Domain Validation Secure Server CA
  Certificate SHA256 fingerprint: 61:E9:73:75:E9:F6:DA:98:2F:F5:C1:9E:2F:94:E6:6C:4E:35:B6:83:7C:E3:B9:14:D2:24:5C:7F:5F:65:82:5F
  Public key ping-sha256: Eep0p/AsSa9lFUH6KT2UY+9s1Z8v7voAPkQ4fGknZ2g=
Subject Common Name: USERTrust ECC Certification Authority
  Certificate SHA256 fingerprint: A6:CF:64:DB:B4:C8:D5:FD:19:CE:48:89:60:68:DB:03:B5:33:A8:D1:33:6C:62:56:A8:7D:00:CB:B3:DE:F3:EA
  Public key ping-sha256: UJM2FOhG9aTNY0Pg4hgqjNzZ/lQBiMGRxPD5Y2/e0bw=
Subject Common Name: AAA Certificate Services
  Certificate SHA256 fingerprint: D7:A7:A0:FB:5D:7E:27:31:D7:71:E9:48:4E:BC:DE:F7:1D:5F:0C:3E:0A:29:48:78:2B:C8:3E:E0:EA:69:9E:F4
  Public key ping-sha256: vRU+17BDT2iGsXvOi76E7TQMcTLXAqj0+jGPdW7L1vM=
All OK. Server matched our pinned cert or public key
statusCode: 200
```

