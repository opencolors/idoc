---
title: Node.js 소개
description: Node.js 는 오픈소스, 크로스 플랫폼 JavaScript 런타임 환경으로, 개발자가 서버 측에서 JavaScript 를 실행할 수 있게 해주며, 높은 성능과 확장성을 제공합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 소개 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 는 오픈소스, 크로스 플랫폼 JavaScript 런타임 환경으로, 개발자가 서버 측에서 JavaScript 를 실행할 수 있게 해주며, 높은 성능과 확장성을 제공합니다.
  - - meta
    - name: twitter:title
      content: Node.js 소개 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 는 오픈소스, 크로스 플랫폼 JavaScript 런타임 환경으로, 개발자가 서버 측에서 JavaScript 를 실행할 수 있게 해주며, 높은 성능과 확장성을 제공합니다.
---


# Node.js 소개

Node.js는 오픈 소스 및 크로스 플랫폼 JavaScript 런타임 환경입니다. 거의 모든 종류의 프로젝트에서 인기 있는 도구입니다!

Node.js는 Google Chrome의 핵심인 V8 JavaScript 엔진을 브라우저 외부에서 실행합니다. 이를 통해 Node.js는 매우 뛰어난 성능을 발휘할 수 있습니다.

Node.js 앱은 각 요청에 대해 새 스레드를 생성하지 않고 단일 프로세스에서 실행됩니다. Node.js는 JavaScript 코드가 차단되는 것을 방지하는 비동기 I/O 기본 요소 집합을 표준 라이브러리에서 제공하며 일반적으로 Node.js의 라이브러리는 비차단 패러다임을 사용하여 작성되므로 차단 동작은 규범보다는 예외입니다.

Node.js가 네트워크에서 읽거나 데이터베이스 또는 파일 시스템에 액세스하는 것과 같은 I/O 작업을 수행할 때 스레드를 차단하고 CPU 사이클을 낭비하는 대신 응답이 돌아오면 작업을 다시 시작합니다.

이를 통해 Node.js는 스레드 동시성 관리의 부담을 주지 않고 단일 서버로 수천 개의 동시 연결을 처리할 수 있으며 이는 버그의 중요한 원인이 될 수 있습니다.

Node.js는 브라우저용 JavaScript를 작성하는 수백만 명의 프런트엔드 개발자가 완전히 다른 언어를 배울 필요 없이 클라이언트 측 코드 외에 서버 측 코드를 작성할 수 있기 때문에 고유한 이점이 있습니다.

Node.js에서는 모든 사용자가 브라우저를 업데이트할 때까지 기다릴 필요가 없으므로 새 ECMAScript 표준을 문제 없이 사용할 수 있습니다. Node.js 버전을 변경하여 사용할 ECMAScript 버전을 결정하고 플래그와 함께 Node.js를 실행하여 특정 실험적 기능을 활성화할 수도 있습니다.

## Node.js 애플리케이션 예제

Node.js의 가장 일반적인 Hello World 예제는 웹 서버입니다.

```js
import { createServer } from 'node:http'
const hostname = '127.0.0.1'
const port = 3000
const server = createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World')
})
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
```

이 스니펫을 실행하려면 `server.js` 파일로 저장하고 터미널에서 `node server.js`를 실행합니다. 코드의 mjs 버전을 사용하는 경우 `server.mjs` 파일로 저장하고 터미널에서 `node server.mjs`를 실행해야 합니다.

이 코드는 먼저 Node.js [http 모듈](/ko/nodejs/api/http)을 포함합니다.

Node.js에는 네트워킹을 위한 최고 수준의 지원을 포함하여 환상적인 [표준 라이브러리](/ko/nodejs/api/synopsis)가 있습니다.

`http`의 `createServer()` 메서드는 새 HTTP 서버를 만들고 반환합니다.

서버는 지정된 포트 및 호스트 이름에서 수신하도록 설정됩니다. 서버가 준비되면 콜백 함수가 호출되며 이 경우 서버가 실행 중임을 알려줍니다.

새 요청이 수신될 때마다 [요청 이벤트](/ko/nodejs/api/http)가 호출되어 요청(`http.IncomingMessage` 객체)과 응답(`http.ServerResponse` 객체)의 두 객체를 제공합니다.

이 2개의 객체는 HTTP 호출을 처리하는 데 필수적입니다.

첫 번째는 요청 세부 정보를 제공합니다. 이 간단한 예에서는 사용되지 않지만 요청 헤더 및 요청 데이터에 액세스할 수 있습니다.

두 번째는 호출자에게 데이터를 반환하는 데 사용됩니다.

이 경우:

```js
res.setHeader('Content-Type', 'text/plain')
```

statusCode 속성을 200으로 설정하여 성공적인 응답을 나타냅니다.

Content-Type 헤더를 설정합니다.

```js
res.setHeader('Content-Type', 'text/plain')
```

그리고 응답을 닫고 콘텐츠를 `end()`에 인수로 추가합니다.

```js
res.end('Hello World')
```

이렇게 하면 응답이 클라이언트로 전송됩니다.

