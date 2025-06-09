---
title: Node.js의 HTTP 처리 이해
description: Node.js에서 HTTP 요청을 처리하는 방법에 대한 포괄적인 가이드입니다. 서버 생성, 요청 및 응답 처리, 라우팅 및 오류 처리 등을 다룹니다.
head:
  - - meta
    - name: og:title
      content: Node.js의 HTTP 처리 이해 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js에서 HTTP 요청을 처리하는 방법에 대한 포괄적인 가이드입니다. 서버 생성, 요청 및 응답 처리, 라우팅 및 오류 처리 등을 다룹니다.
  - - meta
    - name: twitter:title
      content: Node.js의 HTTP 처리 이해 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js에서 HTTP 요청을 처리하는 방법에 대한 포괄적인 가이드입니다. 서버 생성, 요청 및 응답 처리, 라우팅 및 오류 처리 등을 다룹니다.
---


# HTTP 트랜잭션의 구조

이 가이드의 목적은 Node.js HTTP 처리 과정에 대한 견고한 이해를 전달하는 것입니다. 우리는 당신이 언어 또는 프로그래밍 환경에 관계없이 HTTP 요청이 어떻게 작동하는지에 대한 일반적인 의미를 알고 있다고 가정합니다. 또한 Node.js EventEmitters 및 Streams에 대한 약간의 친숙함도 가정합니다. 익숙하지 않다면 각 API 문서들을 빠르게 읽어보는 것이 좋습니다.

## 서버 생성

모든 노드 웹 서버 애플리케이션은 어느 시점에서 웹 서버 객체를 생성해야 합니다. 이는 `createServer`를 사용하여 수행됩니다.

```javascript
const http = require('node:http');
const server = http.createServer((request, response) => {
    // 마법이 여기서 일어납니다!
});
```

`createServer`에 전달되는 함수는 해당 서버에 대해 이루어진 모든 HTTP 요청에 대해 한 번씩 호출되므로 요청 핸들러라고 합니다. 실제로 `createServer`에서 반환된 Server 객체는 EventEmitter이며 여기서 우리는 서버 객체를 생성한 다음 나중에 리스너를 추가하는 것에 대한 약식 표현입니다.

```javascript
const server = http.createServer();
server.on('request', (request, response) => {
    // 같은 종류의 마법이 여기서 일어납니다!
});
```

HTTP 요청이 서버에 도달하면 Node는 트랜잭션, 요청 및 응답을 처리하기 위한 몇 가지 편리한 객체를 사용하여 요청 핸들러 함수를 호출합니다. 곧 이에 대해 다룰 것입니다. 실제로 요청을 처리하기 위해 서버 객체에서 `listen` 메서드를 호출해야 합니다. 대부분의 경우 `listen`에 전달해야 할 것은 서버가 수신할 포트 번호뿐입니다. 다른 옵션도 있으므로 API 참조를 참조하십시오.

## 메서드, URL 및 헤더

요청을 처리할 때 가장 먼저 해야 할 일은 메서드와 URL을 확인하여 적절한 조치를 취하는 것입니다. Node.js는 요청 객체에 편리한 속성을 배치하여 이를 비교적 쉽게 만듭니다.

```javascript
const { method, url } = request;
```

요청 객체는 `IncomingMessage`의 인스턴스입니다. 여기서 메서드는 항상 일반적인 HTTP 메서드/동사입니다. URL은 서버, 프로토콜 또는 포트가 없는 전체 URL입니다. 일반적인 URL의 경우 이는 세 번째 슬래시 이후 및 슬래시를 포함한 모든 것을 의미합니다.

헤더도 멀리 떨어져 있지 않습니다. 헤더는 `headers`라는 요청의 자체 객체에 있습니다.

```javascript
const { headers } = request;
const userAgent = headers['user-agent'];
```

여기서 모든 헤더는 클라이언트가 실제로 보낸 방식에 관계없이 소문자로만 표현된다는 점에 유의하는 것이 중요합니다. 이렇게 하면 어떤 목적이든 헤더를 구문 분석하는 작업이 단순화됩니다.

일부 헤더가 반복되면 헤더에 따라 해당 값이 덮어쓰여지거나 쉼표로 구분된 문자열로 함께 결합됩니다. 경우에 따라 이것이 문제가 될 수 있으므로 `rawHeaders`도 사용할 수 있습니다.


## 요청 본문

POST 또는 PUT 요청을 수신할 때 요청 본문은 애플리케이션에 중요할 수 있습니다. 본문 데이터에 접근하는 것은 요청 헤더에 접근하는 것보다 약간 더 복잡합니다. 핸들러에 전달되는 요청 객체는 `ReadableStream` 인터페이스를 구현합니다. 이 스트림은 다른 스트림과 마찬가지로 수신 대기하거나 다른 곳으로 파이프할 수 있습니다. 스트림의 `'data'` 및 `'end'` 이벤트를 수신하여 스트림에서 데이터를 바로 가져올 수 있습니다.

각 `'data'` 이벤트에서 방출되는 청크는 `Buffer`입니다. 문자열 데이터가 될 것이라는 것을 알고 있다면 데이터를 배열에 수집한 다음 `'end'`에서 연결하고 문자열화하는 것이 가장 좋습니다.

```javascript
let body = [];
request.on('data', chunk => {
    body.push(chunk);
});
request.on('end', () => {
    body = Buffer.concat(body).toString();
    // 이 시점에서 'body'에는 전체 요청 본문이 문자열로 저장되어 있습니다.
});
```
::: tip NOTE
이것은 약간 지루해 보일 수 있으며 많은 경우에 그렇습니다. 다행히 npm에는 `concat-stream` 및 `body`와 같은 모듈이 있어 이러한 로직의 일부를 숨기는 데 도움이 될 수 있습니다. 그 길로 가기 전에 무슨 일이 일어나고 있는지 잘 이해하는 것이 중요하며, 그것이 바로 여러분이 여기에 있는 이유입니다!
:::

## 오류에 대한 간단한 내용

요청 객체는 `ReadableStream`이므로 `EventEmitter`이기도 하며 오류가 발생하면 그와 같이 동작합니다.

요청 스트림의 오류는 스트림에서 `'error'` 이벤트를 방출하여 나타납니다. 해당 이벤트에 대한 리스너가 없으면 오류가 발생하여 Node.js 프로그램이 충돌할 수 있습니다. 따라서 HTTP 오류 응답을 보내는 것이 가장 좋더라도 요청 스트림에 `'error'` 리스너를 추가해야 합니다. (자세한 내용은 나중에 설명합니다.)

```javascript
request.on('error', err => {
    // 오류 메시지 및 스택 추적이 stderr에 인쇄됩니다.
    console.error(err.stack);
});
```

다른 추상화 및 도구와 같은 [이러한 오류를 처리하는](/ko/nodejs/api/errors) 다른 방법도 있지만 오류는 발생할 수 있으며 발생한다는 점을 항상 인식하고 처리해야 합니다.


## 지금까지 우리가 얻은 것

현재까지 서버를 생성하고 요청에서 메서드, URL, 헤더 및 본문을 가져오는 방법을 다루었습니다. 이 모든 것을 합치면 다음과 같이 보일 수 있습니다.

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request.on('error', err => console.error(err));
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', () => {
        body = Buffer.concat(body).toString();
        // 이 시점에서 헤더, 메서드, URL 및 본문이 있으므로 이제
        // 이 요청에 응답하기 위해 필요한 모든 작업을 수행할 수 있습니다.
    });
});

.listen(8080); // 이 서버를 활성화하고 8080 포트에서 수신합니다.
```

이 예제를 실행하면 요청을 받을 수 있지만 응답할 수는 없습니다. 실제로 웹 브라우저에서 이 예제를 실행하면 클라이언트로 다시 전송되는 내용이 없으므로 요청 시간이 초과됩니다.

지금까지 `ServerResponse`의 인스턴스인 응답 객체에 대해서는 전혀 다루지 않았습니다. 이는 `WritableStream`입니다. 여기에는 클라이언트에 데이터를 다시 보내는 데 유용한 많은 메서드가 포함되어 있습니다. 다음으로 이에 대해 다룰 것입니다.

## HTTP 상태 코드

설정하지 않으면 응답의 HTTP 상태 코드는 항상 200입니다. 물론 모든 HTTP 응답이 이에 해당하는 것은 아니며 어느 시점에는 다른 상태 코드를 보내고 싶을 것입니다. 이렇게 하려면 `statusCode` 속성을 설정할 수 있습니다.

```javascript
response.statusCode = 404; // 클라이언트에게 리소스를 찾을 수 없음을 알립니다.
```

곧 보게 되겠지만 이에 대한 몇 가지 다른 바로 가기가 있습니다.

## 응답 헤더 설정

헤더는 `setHeader`라는 편리한 메서드를 통해 설정됩니다.

```javascript
response.setHeader('Content-Type', 'application/json');
response.setHeader('X-Powered-By', 'bacon');
```

응답에 헤더를 설정할 때 해당 이름에 대소문자를 구분하지 않습니다. 헤더를 반복적으로 설정하면 설정한 마지막 값이 전송되는 값입니다.


## 명시적으로 헤더 데이터 보내기

지금까지 논의한 헤더 및 상태 코드 설정 방법은 "암시적 헤더"를 사용하고 있다고 가정합니다. 즉, 본문 데이터를 보내기 시작하기 전에 노드가 올바른 시간에 헤더를 보내도록 계산하고 있습니다.

원하는 경우 응답 스트림에 명시적으로 헤더를 쓸 수 있습니다. 이를 위해 상태 코드와 헤더를 스트림에 쓰는 `writeHead`라는 메서드가 있습니다.

## 명시적으로 헤더 데이터 보내기

```javascript
response.writeHead(200, {
    'Content-Type': 'application/json',
    'X-Powered-By': 'bacon',
});
```

헤더를 설정했으면(암시적으로든 명시적으로든) 응답 데이터를 보낼 준비가 된 것입니다.

## 응답 본문 보내기

응답 객체는 `WritableStream`이므로 클라이언트에 응답 본문을 쓰는 것은 일반적인 스트림 메서드를 사용하는 것과 같습니다.

```javascript
response.write('<html>');
response.write('<body>');
response.write('<h1>Hello, World!</h1>');
response.write('</body>');
response.write('</html>');
response.end();
```

스트림의 `end` 함수는 스트림의 마지막 데이터로 보낼 선택적 데이터를 가져올 수도 있으므로 위의 예제를 다음과 같이 단순화할 수 있습니다.

```javascript
response.end('<html><body><h1>hello,world!</h1></body></html>');
```

::: tip NOTE
본문 데이터를 쓰기 전에 상태 및 헤더를 설정하는 것이 중요합니다. 이는 HTTP 응답에서 헤더가 본문 앞에 나오기 때문에 이치에 맞습니다.
:::

## 오류에 대한 또 다른 빠른 사항

응답 스트림은 'error' 이벤트도 발생시킬 수 있으며, 언젠가는 이를 처리해야 합니다. 요청 스트림 오류에 대한 모든 조언은 여기에도 적용됩니다.

## 모두 모으기

이제 HTTP 응답을 만드는 방법을 배웠으므로 모두 모아 보겠습니다. 이전 예제를 기반으로 사용자가 보낸 모든 데이터를 다시 보내는 서버를 만들 것입니다. `JSON.stringify`를 사용하여 해당 데이터를 JSON으로 포맷합니다.

```javascript
const http = require('node:http');
http
  .createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request
      .on('error', err => {
        console.error(err);
      })
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();
        // 새로운 내용 시작
        response.on('error', err => {
          console.error(err);
        });
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        // 참고: 위의 두 줄은 다음 한 줄로 바꿀 수 있습니다.
        // response.writeHead(200, {'Content-Type': 'application/json'})
        const responseBody = { headers, method, url, body };
        response.write(JSON.stringify(responseBody));
        response.end();
        // 참고: 위의 두 줄은 다음 한 줄로 바꿀 수 있습니다.
        // response.end(JSON.stringify(responseBody))
        // 새로운 내용 끝
      });
  })
  .listen(8080);
```

## EchoServer 예제

간단한 에코 서버를 만들기 위해 이전 예제를 단순화해 보겠습니다. 이 서버는 요청에서 수신된 데이터를 응답으로 다시 전송합니다. 이전과 마찬가지로 요청 스트림에서 데이터를 가져와서 해당 데이터를 응답 스트림에 쓰기만 하면 됩니다.

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    let body = [];
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', () => {
        body = Buffer.concat(body).toString();
        response.end(body);
    });
});

.listen(8080);
```

이제 이것을 조정해 보겠습니다. 다음과 같은 조건에서만 에코를 보내려고 합니다.
- 요청 메서드가 POST입니다.
- URL이 /echo입니다.

다른 경우에는 단순히 404로 응답하려고 합니다.

```javascript
const http = require('node:http');
http
  .createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/echo') {
      let body = [];
      request
        .on('data', chunk => {
          body.push(chunk);
        })
        .on('end', () => {
          body = Buffer.concat(body).toString();
          response.end(body);
        });
    } else {
      response.statusCode = 404;
      response.end();
    }
  })
  .listen(8080);
```

::: tip NOTE
이러한 방식으로 URL을 확인하여 일종의 "라우팅"을 수행하고 있습니다. 다른 형태의 라우팅은 `switch` 문처럼 간단할 수도 있고 `express`와 같은 전체 프레임워크처럼 복잡할 수도 있습니다. 라우팅만 수행하는 것을 찾고 있다면 `router`를 사용해 보십시오.
:::

좋습니다! 이제 이것을 단순화해 보겠습니다. 요청 객체는 `ReadableStream`이고 응답 객체는 `WritableStream`이라는 것을 기억하십시오. 즉, `pipe`를 사용하여 한쪽에서 다른쪽으로 데이터를 보낼 수 있습니다. 이것이 바로 에코 서버에 원하는 것입니다!

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/echo') {
        request.pipe(response);
    } else {
        response.statusCode = 404;
        response.end();
    }
})
.listen(8080);
```

스트림 만세!

하지만 아직 끝나지 않았습니다. 이 가이드에서 여러 번 언급했듯이 오류가 발생할 수 있으며 이러한 오류를 처리해야 합니다.

요청 스트림에서 오류를 처리하려면 오류를 `stderr`에 기록하고 `잘못된 요청`을 나타내는 400 상태 코드를 보냅니다. 하지만 실제 응용 프로그램에서는 오류를 검사하여 올바른 상태 코드와 메시지가 무엇인지 파악해야 합니다. 오류와 관련해서는 일반적으로 [오류 문서](/ko/nodejs/api/errors)를 참조해야 합니다.

응답에서는 오류를 `stderr`에 기록하기만 합니다.

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    request.on('error', err => {
        console.error(err);
        response.statusCode = 400;
        response.end();
    });
    response.on('error', err => {
        console.error(err);
    });
    if (request.method === 'POST' && request.url === '/echo') {
        request.pipe(response);
    } else {
        response.statusCode = 404;
        response.end();
    }
})
.listen(8080);
```

이제 HTTP 요청 처리의 기본 사항 대부분을 다루었습니다. 이 시점에서 다음을 수행할 수 있어야 합니다.
- `request` 처리기 함수를 사용하여 HTTP 서버를 인스턴스화하고 포트에서 수신하도록 합니다.
- `request` 객체에서 헤더, URL, 메서드 및 본문 데이터를 가져옵니다.
- URL 및/또는 `request` 객체의 기타 데이터를 기반으로 라우팅 결정을 내립니다.
- `response` 객체를 통해 헤더, HTTP 상태 코드 및 본문 데이터를 보냅니다.
- `request` 객체에서 응답 객체로 데이터를 파이프합니다.
- `request` 및 `response` 스트림 모두에서 스트림 오류를 처리합니다.

이러한 기본 사항을 통해 많은 일반적인 사용 사례에 대한 Node.js HTTP 서버를 구성할 수 있습니다. 이러한 API는 다른 많은 기능을 제공하므로 [`EventEmitters`](/ko/nodejs/api/events), [`Streams`](/ko/nodejs/api/stream) 및 [`HTTP`](/ko/nodejs/api/http)에 대한 API 문서를 반드시 읽어 보십시오.

