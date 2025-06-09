---
title: Node.js 문서 - 도메인 모듈
description: Node.js의 도메인 모듈은 비동기 코드에서 오류와 예외를 처리하는 방법을 제공하여, 오류 관리와 정리 작업을 더 견고하게 만듭니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - 도메인 모듈 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 도메인 모듈은 비동기 코드에서 오류와 예외를 처리하는 방법을 제공하여, 오류 관리와 정리 작업을 더 견고하게 만듭니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - 도메인 모듈 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 도메인 모듈은 비동기 코드에서 오류와 예외를 처리하는 방법을 제공하여, 오류 관리와 정리 작업을 더 견고하게 만듭니다.
---


# Domain {#domain}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v8.8.0 | VM 컨텍스트에서 생성된 `Promise`는 더 이상 `.domain` 속성을 갖지 않습니다. 그러나 해당 핸들러는 여전히 적절한 도메인에서 실행되며, 메인 컨텍스트에서 생성된 `Promise`는 여전히 `.domain` 속성을 갖습니다. |
| v8.0.0 | `Promise`에 대한 핸들러는 이제 체인의 첫 번째 promise가 생성된 도메인에서 호출됩니다. |
| v1.4.2 | 사용 중단됨: v1.4.2 |
:::

::: danger [안정성: 0 - 사용 중단됨]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 사용 중단됨
:::

**소스 코드:** [lib/domain.js](https://github.com/nodejs/node/blob/v23.5.0/lib/domain.js)

**이 모듈은 사용 중단 예정입니다.** 대체 API가 확정되면 이 모듈은 완전히 사용 중단될 것입니다. 대부분의 개발자는 이 모듈을 사용할 필요가 **없습니다**. 도메인이 제공하는 기능이 반드시 필요한 사용자는 당분간은 이를 사용할 수 있지만, 향후 다른 솔루션으로 마이그레이션해야 할 것입니다.

도메인은 여러 개의 서로 다른 IO 작업을 단일 그룹으로 처리하는 방법을 제공합니다. 도메인에 등록된 이벤트 이미터 또는 콜백 중 하나가 `'error'` 이벤트를 발생시키거나 오류를 throw하면 프로그램이 오류 코드로 즉시 종료되거나 `process.on('uncaughtException')` 핸들러에서 오류 컨텍스트를 잃는 대신 도메인 객체에 알림이 전송됩니다.

## 경고: 오류를 무시하지 마십시오! {#warning-dont-ignore-errors!}

도메인 오류 핸들러는 오류 발생 시 프로세스를 종료하는 것을 대체하지 않습니다.

JavaScript에서 [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw)가 작동하는 방식의 특성상 참조 누수 또는 다른 종류의 정의되지 않은 불안정한 상태를 만들지 않고 안전하게 "중단된 위치에서 다시 시작"할 수 있는 방법은 거의 없습니다.

throw된 오류에 대응하는 가장 안전한 방법은 프로세스를 종료하는 것입니다. 물론 일반적인 웹 서버에서는 열려 있는 연결이 많을 수 있으며, 다른 사람에 의해 오류가 트리거되었다는 이유로 갑자기 연결을 종료하는 것은 합리적이지 않습니다.

더 나은 접근 방식은 오류를 트리거한 요청에 오류 응답을 보내고, 다른 요청은 정상적인 시간 내에 완료하도록 하고, 해당 작업자에서 새 요청 수신을 중단하는 것입니다.

이러한 방식으로 `domain` 사용은 클러스터 모듈과 밀접하게 관련되어 있습니다. 기본 프로세스는 작업자에서 오류가 발생하면 새 작업자를 포크할 수 있기 때문입니다. 여러 시스템으로 확장되는 Node.js 프로그램의 경우 종료 프록시 또는 서비스 레지스트리는 실패를 기록하고 그에 따라 대응할 수 있습니다.

예를 들어 다음과 같은 경우는 좋지 않습니다.

```js [ESM]
// XXX 경고! 나쁜 생각입니다!

const d = require('node:domain').create();
d.on('error', (er) => {
  // 오류가 프로세스를 충돌시키지는 않지만, 그보다 더 나쁩니다!
  // 갑작스러운 프로세스 재시작을 방지했지만, 이런 일이 발생하면 많은 리소스가 누수됩니다.
  // 이는 process.on('uncaughtException')보다 나을 것이 없습니다!
  console.log(`오류, 하지만 어쩔 수 없죠 ${er.message}`);
});
d.run(() => {
  require('node:http').createServer((req, res) => {
    handleRequest(req, res);
  }).listen(PORT);
});
```
도메인의 컨텍스트와 프로그램을 여러 작업자 프로세스로 분리하는 복원력을 활용하여 더 적절하게 대응하고 훨씬 더 안전하게 오류를 처리할 수 있습니다.

```js [ESM]
// 훨씬 더 좋습니다!

const cluster = require('node:cluster');
const PORT = +process.env.PORT || 1337;

if (cluster.isPrimary) {
  // 더 현실적인 시나리오에서는 작업자가 2개 이상일 수 있으며,
  // 기본 프로세스와 작업자를 동일한 파일에 넣지 않을 수도 있습니다.
  //
  // 로깅에 대해 좀 더 멋을 부리고 DoS 공격 및 기타 잘못된 동작을 방지하는 데
  // 필요한 사용자 지정 논리를 구현할 수도 있습니다.
  //
  // 클러스터 설명서의 옵션을 참조하십시오.
  //
  // 중요한 것은 기본 프로세스가 작업을 거의 수행하지 않아
  // 예기치 않은 오류에 대한 복원력이 높아진다는 것입니다.

  cluster.fork();
  cluster.fork();

  cluster.on('disconnect', (worker) => {
    console.error('연결 끊김!');
    cluster.fork();
  });

} else {
  // 작업자
  //
  // 여기에 버그를 넣습니다!

  const domain = require('node:domain');

  // 요청을 처리하기 위해 작업자 프로세스를 사용하는 방법에 대한 자세한 내용은
  // 클러스터 설명서를 참조하십시오. 작동 방식, 주의 사항 등

  const server = require('node:http').createServer((req, res) => {
    const d = domain.create();
    d.on('error', (er) => {
      console.error(`오류 ${er.stack}`);

      // 위험한 영역에 있습니다!
      // 정의상 예기치 않은 일이 발생했습니다.
      // 아마도 우리가 원하지 않았던 일일 것입니다.
      // 이제 무슨 일이든 일어날 수 있습니다! 매우 조심하십시오!

      try {
        // 30초 이내에 종료해야 합니다.
        const killtimer = setTimeout(() => {
          process.exit(1);
        }, 30000);
        // 하지만 프로세스를 그 때문에 계속 열어두지 마십시오!
        killtimer.unref();

        // 새 요청 수신을 중단합니다.
        server.close();

        // 기본 프로세스에 우리가 종료되었음을 알립니다.
        // 이렇게 하면 클러스터 기본 프로세스에서 'disconnect'가 트리거되고
        // 새 작업자가 포크됩니다.
        cluster.worker.disconnect();

        // 문제를 트리거한 요청에 오류를 보내려고 시도합니다.
        res.statusCode = 500;
        res.setHeader('content-type', 'text/plain');
        res.end('이런, 문제가 발생했습니다!\n');
      } catch (er2) {
        // 아, 이 시점에서는 할 수 있는 일이 많지 않습니다.
        console.error(`500을 보내는 중 오류 발생! ${er2.stack}`);
      }
    });

    // req 및 res는 이 도메인이 존재하기 전에 생성되었으므로
    // 명시적으로 추가해야 합니다.
    // 아래의 암시적 바인딩과 명시적 바인딩에 대한 설명을 참조하십시오.
    d.add(req);
    d.add(res);

    // 이제 도메인에서 핸들러 함수를 실행합니다.
    d.run(() => {
      handleRequest(req, res);
    });
  });
  server.listen(PORT);
}

// 이 부분은 중요하지 않습니다. 라우팅 예제일 뿐입니다.
// 여기에 멋진 애플리케이션 논리를 넣으십시오.
function handleRequest(req, res) {
  switch (req.url) {
    case '/error':
      // 일부 비동기 작업을 수행한 다음...
      setTimeout(() => {
        // 앗!
        flerb.bark();
      }, timeout);
      break;
    default:
      res.end('ok');
  }
}
```

## `Error` 객체에 추가되는 사항 {#additions-to-error-objects}

`Error` 객체가 도메인을 통해 라우팅될 때마다 몇 가지 추가 필드가 추가됩니다.

- `error.domain`: 오류를 처음 처리한 도메인입니다.
- `error.domainEmitter`: 오류 객체와 함께 `'error'` 이벤트를 발생시킨 이벤트 이미터입니다.
- `error.domainBound`: 도메인에 바인딩되어 첫 번째 인수로 오류를 전달받은 콜백 함수입니다.
- `error.domainThrown`: 오류가 throw되었는지, 발생되었는지 또는 바인딩된 콜백 함수에 전달되었는지 여부를 나타내는 부울입니다.

## 암시적 바인딩 {#implicit-binding}

도메인이 사용 중인 경우, 모든 **새로운** `EventEmitter` 객체(스트림 객체, 요청, 응답 등 포함)는 생성 시점에 활성 도메인에 암시적으로 바인딩됩니다.

또한 `fs.open()` 또는 콜백을 취하는 다른 메서드와 같이 하위 수준 이벤트 루프 요청에 전달되는 콜백은 자동으로 활성 도메인에 바인딩됩니다. throw되면 도메인이 오류를 catch합니다.

과도한 메모리 사용을 방지하기 위해 `Domain` 객체 자체는 활성 도메인의 자식으로 암시적으로 추가되지 않습니다. 만약 그렇다면 요청 및 응답 객체가 적절하게 가비지 수집되는 것을 방지하기가 너무 쉬울 것입니다.

`Domain` 객체를 상위 `Domain`의 자식으로 중첩하려면 명시적으로 추가해야 합니다.

암시적 바인딩은 throw된 오류와 `'error'` 이벤트를 `Domain`의 `'error'` 이벤트로 라우팅하지만 `EventEmitter`를 `Domain`에 등록하지 않습니다. 암시적 바인딩은 throw된 오류와 `'error'` 이벤트만 처리합니다.

## 명시적 바인딩 {#explicit-binding}

때로는 사용 중인 도메인이 특정 이벤트 이미터에 사용되어야 하는 도메인이 아닐 수 있습니다. 또는 이벤트 이미터가 한 도메인의 컨텍스트에서 생성되었지만 대신 다른 도메인에 바인딩되어야 할 수 있습니다.

예를 들어 HTTP 서버에 사용 중인 도메인이 하나 있을 수 있지만 각 요청에 대해 별도의 도메인을 사용하고 싶을 수 있습니다.

명시적 바인딩을 통해 가능합니다.

```js [ESM]
// 서버에 대한 최상위 도메인 생성
const domain = require('node:domain');
const http = require('node:http');
const serverDomain = domain.create();

serverDomain.run(() => {
  // 서버가 serverDomain 범위 내에서 생성됨
  http.createServer((req, res) => {
    // req 및 res도 serverDomain 범위 내에서 생성됨
    // 그러나 각 요청에 대해 별도의 도메인을 사용하는 것이 좋습니다.
    // 먼저 생성하고 req 및 res를 추가합니다.
    const reqd = domain.create();
    reqd.add(req);
    reqd.add(res);
    reqd.on('error', (er) => {
      console.error('Error', er, req.url);
      try {
        res.writeHead(500);
        res.end('Error occurred, sorry.');
      } catch (er2) {
        console.error('Error sending 500', er2, req.url);
      }
    });
  }).listen(1337);
});
```

## `domain.create()` {#domaincreate}

- 반환: [\<Domain\>](/ko/nodejs/api/domain#class-domain)

## 클래스: `Domain` {#class-domain}

- 확장: [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter)

`Domain` 클래스는 오류 및 포착되지 않은 예외를 활성 `Domain` 객체로 라우팅하는 기능을 캡슐화합니다.

포착하는 오류를 처리하려면 `'error'` 이벤트를 수신하십시오.

### `domain.members` {#domainmembers}

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

도메인에 명시적으로 추가된 타이머 및 이벤트 이미터의 배열입니다.

### `domain.add(emitter)` {#domainaddemitter}

- `emitter` [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter) | [\<Timer\>](/ko/nodejs/api/timers#timers) 도메인에 추가할 이미터 또는 타이머

이미터를 도메인에 명시적으로 추가합니다. 이미터에 의해 호출된 이벤트 핸들러가 오류를 발생시키거나 이미터가 `'error'` 이벤트를 발생시키는 경우, 암시적 바인딩과 마찬가지로 도메인의 `'error'` 이벤트로 라우팅됩니다.

이는 [`setInterval()`](/ko/nodejs/api/timers#setintervalcallback-delay-args) 및 [`setTimeout()`](/ko/nodejs/api/timers#settimeoutcallback-delay-args)에서 반환된 타이머에도 적용됩니다. 콜백 함수가 오류를 발생시키면 도메인 `'error'` 핸들러에 의해 포착됩니다.

Timer 또는 `EventEmitter`가 이미 도메인에 바인딩된 경우 해당 도메인에서 제거되고 대신 이 도메인에 바인딩됩니다.

### `domain.bind(callback)` {#domainbindcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 콜백 함수
- 반환: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 바인딩된 함수

반환된 함수는 제공된 콜백 함수를 래핑합니다. 반환된 함수가 호출될 때 발생하는 모든 오류는 도메인의 `'error'` 이벤트로 라우팅됩니다.

```js [ESM]
const d = domain.create();

function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.bind((er, data) => {
    // 이 오류가 발생하면 도메인에도 전달됩니다.
    return cb(er, data ? JSON.parse(data) : null);
  }));
}

d.on('error', (er) => {
  // 어딘가에서 오류가 발생했습니다. 지금 오류를 발생시키면 일반적인 줄 번호와 스택 메시지로 프로그램이 중단됩니다.
});
```

### `domain.enter()` {#domainenter}

`enter()` 메서드는 활성 도메인을 설정하기 위해 `run()`, `bind()`, `intercept()` 메서드에서 사용되는 배관입니다. 이는 `domain.active`와 `process.domain`을 도메인으로 설정하고, 도메인 모듈에서 관리하는 도메인 스택에 도메인을 암묵적으로 푸시합니다 (도메인 스택에 대한 자세한 내용은 [`domain.exit()`](/ko/nodejs/api/domain#domainexit) 참조). `enter()` 호출은 도메인에 바인딩된 비동기 호출 및 I/O 작업 체인의 시작을 구분합니다.

`enter()`를 호출하면 활성 도메인만 변경되고 도메인 자체는 변경되지 않습니다. `enter()` 및 `exit()`는 단일 도메인에서 임의의 횟수로 호출할 수 있습니다.

### `domain.exit()` {#domainexit}

`exit()` 메서드는 현재 도메인을 종료하고 도메인 스택에서 팝합니다. 실행이 다른 비동기 호출 체인의 컨텍스트로 전환될 때는 항상 현재 도메인이 종료되었는지 확인하는 것이 중요합니다. `exit()` 호출은 도메인에 바인딩된 비동기 호출 및 I/O 작업 체인의 종료 또는 중단을 구분합니다.

현재 실행 컨텍스트에 여러 개의 중첩된 도메인이 바인딩되어 있는 경우 `exit()`는 이 도메인 내에 중첩된 모든 도메인을 종료합니다.

`exit()`를 호출하면 활성 도메인만 변경되고 도메인 자체는 변경되지 않습니다. `enter()` 및 `exit()`는 단일 도메인에서 임의의 횟수로 호출할 수 있습니다.

### `domain.intercept(callback)` {#domaininterceptcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 콜백 함수
- 반환: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 인터셉트된 함수

이 메서드는 [`domain.bind(callback)`](/ko/nodejs/api/domain#domainbindcallback)과 거의 동일합니다. 그러나 던져진 오류를 포착하는 것 외에도 함수에 대한 첫 번째 인수로 전송된 [`Error`](/ko/nodejs/api/errors#class-error) 객체도 가로챕니다.

이러한 방식으로 일반적인 `if (err) return callback(err);` 패턴을 단일 위치에서 단일 오류 처리기로 대체할 수 있습니다.

```js [ESM]
const d = domain.create();

function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.intercept((data) => {
    // 참고: 첫 번째 인수는 'Error' 인수로 간주되어
    // 도메인에서 가로채기 때문에 콜백에 전달되지 않습니다.

    // 이것이 던져지면 도메인에도 전달되므로
    // 오류 처리 로직을 프로그램 전체에서 반복하는 대신
    // 도메인의 'error' 이벤트로 옮길 수 있습니다.
    return cb(null, JSON.parse(data));
  }));
}

d.on('error', (er) => {
  // 어딘가에서 오류가 발생했습니다. 지금 던지면 일반적인 줄 번호와 스택 메시지로 프로그램이 충돌합니다.
});
```

### `domain.remove(emitter)` {#domainremoveemitter}

- `emitter` [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter) | [\<Timer\>](/ko/nodejs/api/timers#timers) 도메인에서 제거할 emitter 또는 타이머

[`domain.add(emitter)`](/ko/nodejs/api/domain#domainaddemitter)의 반대입니다. 지정된 emitter에서 도메인 처리를 제거합니다.

### `domain.run(fn[, ...args])` {#domainrunfn-args}

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

도메인의 컨텍스트에서 제공된 함수를 실행하여 해당 컨텍스트에서 생성된 모든 이벤트 이미터, 타이머 및 로우 레벨 요청을 암시적으로 바인딩합니다. 선택적으로 인수를 함수에 전달할 수 있습니다.

이는 도메인을 사용하는 가장 기본적인 방법입니다.

```js [ESM]
const domain = require('node:domain');
const fs = require('node:fs');
const d = domain.create();
d.on('error', (er) => {
  console.error('Caught error!', er);
});
d.run(() => {
  process.nextTick(() => {
    setTimeout(() => { // 다양한 비동기 작업 시뮬레이션
      fs.open('non-existent file', 'r', (er, fd) => {
        if (er) throw er;
        // 계속 진행...
      });
    }, 100);
  });
});
```
이 예제에서는 프로그램이 충돌하는 대신 `d.on('error')` 핸들러가 트리거됩니다.

## 도메인 및 프로미스 {#domains-and-promises}

Node.js 8.0.0부터 프로미스의 핸들러는 `.then()` 또는 `.catch()` 호출 자체가 이루어진 도메인 내에서 실행됩니다.

```js [ESM]
const d1 = domain.create();
const d2 = domain.create();

let p;
d1.run(() => {
  p = Promise.resolve(42);
});

d2.run(() => {
  p.then((v) => {
    // d2에서 실행
  });
});
```
[`domain.bind(callback)`](/ko/nodejs/api/domain#domainbindcallback)을 사용하여 콜백을 특정 도메인에 바인딩할 수 있습니다.

```js [ESM]
const d1 = domain.create();
const d2 = domain.create();

let p;
d1.run(() => {
  p = Promise.resolve(42);
});

d2.run(() => {
  p.then(p.domain.bind((v) => {
    // d1에서 실행
  }));
});
```
도메인은 프로미스의 오류 처리 메커니즘을 방해하지 않습니다. 즉, 처리되지 않은 `Promise` 거부에 대해 `'error'` 이벤트가 발생하지 않습니다.

