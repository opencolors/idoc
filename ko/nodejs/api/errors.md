---
title: Node.js 문서 - 오류
description: 이 Node.js 문서의 섹션에서는 오류 클래스, 오류 코드 및 Node.js 애플리케이션에서 오류를 처리하는 방법에 대해 자세히 설명합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - 오류 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 이 Node.js 문서의 섹션에서는 오류 클래스, 오류 코드 및 Node.js 애플리케이션에서 오류를 처리하는 방법에 대해 자세히 설명합니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - 오류 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 이 Node.js 문서의 섹션에서는 오류 클래스, 오류 코드 및 Node.js 애플리케이션에서 오류를 처리하는 방법에 대해 자세히 설명합니다.
---


# 오류 {#errors}

Node.js에서 실행되는 애플리케이션은 일반적으로 네 가지 범주의 오류를 경험합니다.

- [\<EvalError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError), [\<SyntaxError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError), [\<RangeError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError), [\<ReferenceError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError), [\<TypeError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) 및 [\<URIError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError)와 같은 표준 JavaScript 오류.
- 존재하지 않는 파일을 열거나 닫힌 소켓을 통해 데이터를 보내려고 시도하는 것과 같은 기본 운영 체제 제약 조건으로 인해 발생하는 시스템 오류.
- 애플리케이션 코드로 인해 발생하는 사용자 지정 오류.
- `AssertionError`는 Node.js가 발생해서는 안 되는 예외적인 논리 위반을 감지할 때 발생할 수 있는 특수한 종류의 오류입니다. 이러한 오류는 일반적으로 `node:assert` 모듈에서 발생합니다.

Node.js에서 발생하는 모든 JavaScript 및 시스템 오류는 표준 JavaScript [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 클래스에서 상속되거나 해당 클래스의 인스턴스이며 해당 클래스에서 사용할 수 있는 속성을 *최소한* 제공합니다.

## 오류 전파 및 인터셉트 {#error-propagation-and-interception}

Node.js는 애플리케이션이 실행되는 동안 발생하는 오류를 전파하고 처리하는 여러 메커니즘을 지원합니다. 이러한 오류가 보고되고 처리되는 방식은 `Error`의 유형과 호출되는 API 스타일에 따라 완전히 달라집니다.

모든 JavaScript 오류는 표준 JavaScript `throw` 메커니즘을 사용하여 오류를 *즉시* 생성하고 발생시키는 예외로 처리됩니다. 이러한 오류는 JavaScript 언어에서 제공하는 [`try…catch` 구성](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)을 사용하여 처리됩니다.

```js [ESM]
// z가 정의되지 않았기 때문에 ReferenceError와 함께 발생합니다.
try {
  const m = 1;
  const n = m + z;
} catch (err) {
  // 여기에서 오류를 처리합니다.
}
```
JavaScript `throw` 메커니즘을 사용하면 *처리해야* 하는 예외가 발생하거나 Node.js 프로세스가 즉시 종료됩니다.

몇 가지 예외를 제외하고 *동기* API([\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)를 반환하거나 [`fs.readFileSync`](/ko/nodejs/api/fs#fsreadfilesyncpath-options)와 같이 `callback` 함수를 허용하지 않는 모든 차단 메서드)는 `throw`를 사용하여 오류를 보고합니다.

*비동기 API* 내에서 발생하는 오류는 여러 가지 방법으로 보고될 수 있습니다.

- 일부 비동기 메서드는 [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)를 반환합니다. 거부될 수 있다는 점을 항상 고려해야 합니다. 처리되지 않은 Promise 거부에 프로세스가 어떻게 반응하는지에 대한 자세한 내용은 [`--unhandled-rejections`](/ko/nodejs/api/cli#--unhandled-rejectionsmode) 플래그를 참조하십시오.
- `callback` 함수를 허용하는 대부분의 비동기 메서드는 해당 함수의 첫 번째 인수로 전달되는 `Error` 객체를 허용합니다. 해당 첫 번째 인수가 `null`이 아니고 `Error`의 인스턴스인 경우 처리해야 하는 오류가 발생한 것입니다.
- 비동기 메서드가 [`EventEmitter`](/ko/nodejs/api/events#class-eventemitter)인 객체에서 호출되면 오류가 해당 객체의 `'error'` 이벤트로 라우팅될 수 있습니다.
- Node.js API의 일반적인 비동기 메서드 중 일부는 여전히 `throw` 메커니즘을 사용하여 `try…catch`를 사용하여 처리해야 하는 예외를 발생시킬 수 있습니다. 이러한 메서드의 포괄적인 목록은 없습니다. 필요한 적절한 오류 처리 메커니즘을 확인하려면 각 메서드의 문서를 참조하십시오.

`'error'` 이벤트 메커니즘의 사용은 [스트림 기반](/ko/nodejs/api/stream) 및 [이벤트 이미터 기반](/ko/nodejs/api/events#class-eventemitter) API에 가장 일반적이며, 이러한 API는 시간 경과에 따른 일련의 비동기 작업(성공 또는 실패할 수 있는 단일 작업과 반대)을 나타냅니다.

*모든* [`EventEmitter`](/ko/nodejs/api/events#class-eventemitter) 객체의 경우 `'error'` 이벤트 처리기가 제공되지 않으면 오류가 발생하여 Node.js 프로세스가 처리되지 않은 예외를 보고하고 충돌합니다. 단, [`'uncaughtException'`](/ko/nodejs/api/process#event-uncaughtexception) 이벤트에 대한 처리기가 등록되었거나 더 이상 사용되지 않는 [`node:domain`](/ko/nodejs/api/domain) 모듈이 사용된 경우는 예외입니다.

```js [ESM]
const EventEmitter = require('node:events');
const ee = new EventEmitter();

setImmediate(() => {
  // 'error' 이벤트 처리기가 추가되지 않았기 때문에 이 프로세스가 충돌합니다.
  ee.emit('error', new Error('This will crash'));
});
```
이러한 방식으로 생성된 오류는 호출 코드가 이미 종료된 *후에* 발생하므로 `try…catch`를 사용하여 가로챌 수 *없습니다*.

개발자는 각 메서드의 문서를 참조하여 해당 메서드에서 발생하는 오류가 정확히 어떻게 전파되는지 확인해야 합니다.


## 클래스: `Error` {#class-error}

일반적인 JavaScript [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 객체로, 오류가 발생한 특정 상황을 나타내지 않습니다. `Error` 객체는 `Error`가 인스턴스화된 코드의 지점을 자세히 설명하는 "스택 추적"을 캡처하고 오류에 대한 텍스트 설명을 제공할 수 있습니다.

모든 시스템 및 JavaScript 오류를 포함하여 Node.js에서 생성된 모든 오류는 `Error` 클래스의 인스턴스이거나 상속됩니다.

### `new Error(message[, options])` {#new-errormessage-options}

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cause` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 새로 생성된 오류를 발생시킨 오류입니다.

새로운 `Error` 객체를 생성하고 `error.message` 속성을 제공된 텍스트 메시지로 설정합니다. 객체가 `message`로 전달되면 텍스트 메시지는 `String(message)`를 호출하여 생성됩니다. `cause` 옵션이 제공되면 `error.cause` 속성에 할당됩니다. `error.stack` 속성은 `new Error()`가 호출된 코드의 지점을 나타냅니다. 스택 추적은 [V8의 스택 추적 API](https://v8.dev/docs/stack-trace-api)에 따라 다릅니다. 스택 추적은 (a) *동기 코드 실행*의 시작 또는 (b) `Error.stackTraceLimit` 속성에 의해 제공되는 프레임 수 중 더 작은 값까지만 확장됩니다.

### `Error.captureStackTrace(targetObject[, constructorOpt])` {#errorcapturestacktracetargetobject-constructoropt}

- `targetObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `constructorOpt` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

`targetObject`에 `.stack` 속성을 생성합니다. 이 속성에 접근하면 `Error.captureStackTrace()`가 호출된 코드의 위치를 나타내는 문자열을 반환합니다.

```js [ESM]
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // `new Error().stack`과 유사합니다.
```

추적의 첫 번째 줄은 `${myObject.name}: ${myObject.message}`로 시작합니다.

선택적 `constructorOpt` 인수는 함수를 허용합니다. 주어진 경우 `constructorOpt`를 포함하여 `constructorOpt` 위의 모든 프레임이 생성된 스택 추적에서 생략됩니다.

`constructorOpt` 인수는 오류 생성의 구현 세부 정보를 사용자로부터 숨기는 데 유용합니다. 예를 들면 다음과 같습니다.

```js [ESM]
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // 스택 추적을 두 번 계산하는 것을 피하기 위해 스택 추적 없이 오류를 생성합니다.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // 함수 b 위의 스택 추적을 캡처합니다.
  Error.captureStackTrace(error, b); // 함수 c와 b 모두 스택 추적에 포함되지 않습니다.
  throw error;
}

a();
```

### `Error.stackTraceLimit` {#errorstacktracelimit}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`Error.stackTraceLimit` 속성은 스택 추적에 의해 수집되는 스택 프레임 수를 지정합니다(`new Error().stack` 또는 `Error.captureStackTrace(obj)`로 생성된 경우).

기본값은 `10`이지만 유효한 JavaScript 숫자로 설정할 수 있습니다. 변경 사항은 값이 변경 *된 후* 캡처된 모든 스택 추적에 영향을 미칩니다.

숫자가 아닌 값으로 설정하거나 음수로 설정하면 스택 추적이 프레임을 캡처하지 않습니다.

### `error.cause` {#errorcause}

**다음 버전에서 추가됨: v16.9.0**

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

있는 경우 `error.cause` 속성은 `Error`의 기본 원인입니다. 오류를 catch하고 원래 오류에 계속 액세스하기 위해 다른 메시지나 코드로 새 오류를 throw할 때 사용됩니다.

`error.cause` 속성은 일반적으로 `new Error(message, { cause })`를 호출하여 설정됩니다. `cause` 옵션이 제공되지 않으면 생성자에 의해 설정되지 않습니다.

이 속성을 사용하면 오류를 연결할 수 있습니다. `Error` 객체를 직렬화할 때 [`util.inspect()`](/ko/nodejs/api/util#utilinspectobject-options)는 `error.cause`가 설정된 경우 재귀적으로 직렬화합니다.

```js [ESM]
const cause = new Error('The remote HTTP server responded with a 500 status');
const symptom = new Error('The message failed to send', { cause });

console.log(symptom);
// Prints:
//   Error: The message failed to send
//       at REPL2:1:17
//       at Script.runInThisContext (node:vm:130:12)
//       ... 7 lines matching cause stack trace ...
//       at [_line] [as _line] (node:internal/readline/interface:886:18) {
//     [cause]: Error: The remote HTTP server responded with a 500 status
//         at REPL1:1:15
//         at Script.runInThisContext (node:vm:130:12)
//         at REPLServer.defaultEval (node:repl:574:29)
//         at bound (node:domain:426:15)
//         at REPLServer.runBound [as eval] (node:domain:437:12)
//         at REPLServer.onLine (node:repl:902:10)
//         at REPLServer.emit (node:events:549:35)
//         at REPLServer.emit (node:domain:482:12)
//         at [_onLine] [as _onLine] (node:internal/readline/interface:425:12)
//         at [_line] [as _line] (node:internal/readline/interface:886:18)
```

### `error.code` {#errorcode}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.code` 속성은 오류 종류를 식별하는 문자열 레이블입니다. `error.code`는 오류를 식별하는 가장 안정적인 방법입니다. Node.js의 주요 버전 간에만 변경됩니다. 반대로 `error.message` 문자열은 Node.js의 모든 버전 간에 변경될 수 있습니다. 특정 코드에 대한 자세한 내용은 [Node.js 오류 코드](/ko/nodejs/api/errors#nodejs-error-codes)를 참조하세요.

### `error.message` {#errormessage}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.message` 속성은 `new Error(message)`를 호출하여 설정된 오류에 대한 문자열 설명입니다. 생성자에 전달된 `message`는 `Error`의 스택 추적의 첫 번째 줄에도 나타나지만 `Error` 객체가 생성된 후 이 속성을 변경하면 스택 추적의 첫 번째 줄이 변경되지 *않을 수 있습니다* (예: 이 속성이 변경되기 전에 `error.stack`을 읽는 경우).

```js [ESM]
const err = new Error('메시지');
console.error(err.message);
// 출력: 메시지
```
### `error.stack` {#errorstack}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.stack` 속성은 `Error`가 인스턴스화된 코드의 지점을 설명하는 문자열입니다.

```bash [BASH]
Error: 계속 일이 발생합니다!
   at /home/gbusey/file.js:525:2
   at Frobnicator.refrobulate (/home/gbusey/business-logic.js:424:21)
   at Actor.<anonymous> (/home/gbusey/actors.js:400:8)
   at increaseSynergy (/home/gbusey/actors.js:701:6)
```
첫 번째 줄은 `\<오류 클래스 이름\>: \<오류 메시지\>`로 형식이 지정되고, 그 뒤에 일련의 스택 프레임("at "으로 시작하는 각 줄)이 이어집니다. 각 프레임은 오류가 생성된 코드를 이끈 호출 사이트를 설명합니다. V8은 각 함수에 대한 이름(변수 이름, 함수 이름 또는 객체 메서드 이름별)을 표시하려고 시도하지만 적절한 이름을 찾을 수 없는 경우가 있습니다. V8이 함수의 이름을 결정할 수 없는 경우 해당 프레임에 대한 위치 정보만 표시됩니다. 그렇지 않으면 결정된 함수 이름이 괄호 안에 위치 정보와 함께 표시됩니다.

프레임은 JavaScript 함수에 대해서만 생성됩니다. 예를 들어, 실행이 C++ 애드온 함수인 `cheetahify`를 통해 동기적으로 전달되고 이 함수 자체가 JavaScript 함수를 호출하는 경우 `cheetahify` 호출을 나타내는 프레임은 스택 추적에 존재하지 않습니다.

```js [ESM]
const cheetahify = require('./native-binding.node');

function makeFaster() {
  // `cheetahify()`는 speedy를 *동기적으로* 호출합니다.
  cheetahify(function speedy() {
    throw new Error('어 이런!');
  });
}

makeFaster();
// throw됩니다.
//   /home/gbusey/file.js:6
//       throw new Error('어 이런!');
//           ^
//   Error: 어 이런!
//       at speedy (/home/gbusey/file.js:6:11)
//       at makeFaster (/home/gbusey/file.js:5:3)
//       at Object.<anonymous> (/home/gbusey/file.js:10:1)
//       at Module._compile (module.js:456:26)
//       at Object.Module._extensions..js (module.js:474:10)
//       at Module.load (module.js:356:32)
//       at Function.Module._load (module.js:312:12)
//       at Function.Module.runMain (module.js:497:10)
//       at startup (node.js:119:16)
//       at node.js:906:3
```
위치 정보는 다음 중 하나입니다.

- 프레임이 V8 내부의 호출을 나타내는 경우 `native` (예: `[].forEach`).
- 프레임이 Node.js 내부의 호출을 나타내는 경우 `plain-filename.js:line:column`.
- 프레임이 사용자 프로그램(CommonJS 모듈 시스템 사용) 또는 해당 종속성의 호출을 나타내는 경우 `/absolute/path/to/file.js:line:column`.
- 프레임이 사용자 프로그램(ES 모듈 시스템 사용) 또는 해당 종속성의 호출을 나타내는 경우 `\<transport-protocol\>:///url/to/module/file.mjs:line:column`.

스택 추적을 나타내는 문자열은 `error.stack` 속성에 **액세스**할 때 지연 생성됩니다.

스택 추적에서 캡처한 프레임 수는 `Error.stackTraceLimit` 또는 현재 이벤트 루프 틱에서 사용할 수 있는 프레임 수 중 더 작은 값으로 제한됩니다.


## 클래스: `AssertionError` {#class-assertionerror}

- 확장: [\<errors.Error\>](/ko/nodejs/api/errors#class-error)

어설션 실패를 나타냅니다. 자세한 내용은 [`클래스: assert.AssertionError`](/ko/nodejs/api/assert#class-assertassertionerror)를 참조하십시오.

## 클래스: `RangeError` {#class-rangeerror}

- 확장: [\<errors.Error\>](/ko/nodejs/api/errors#class-error)

제공된 인수가 함수에 허용되는 값의 집합 또는 범위 내에 있지 않음을 나타냅니다. 이는 숫자 범위이거나 지정된 함수 매개변수에 대한 옵션 집합 외부인지 여부입니다.

```js [ESM]
require('node:net').connect(-1);
// "RangeError: "port" 옵션은 >= 0 및 < 65536이어야 합니다: -1" 오류 발생
```
Node.js는 인수 유효성 검사의 한 형태로 `RangeError` 인스턴스를 *즉시* 생성하고 발생시킵니다.

## 클래스: `ReferenceError` {#class-referenceerror}

- 확장: [\<errors.Error\>](/ko/nodejs/api/errors#class-error)

정의되지 않은 변수에 접근하려는 시도가 있음을 나타냅니다. 이러한 오류는 일반적으로 코드의 오타 또는 다른 방법으로 손상된 프로그램을 나타냅니다.

클라이언트 코드가 이러한 오류를 생성하고 전파할 수 있지만 실제로는 V8만 그렇게 합니다.

```js [ESM]
doesNotExist;
// ReferenceError 발생, doesNotExist는 이 프로그램의 변수가 아닙니다.
```
애플리케이션이 코드를 동적으로 생성하고 실행하지 않는 한 `ReferenceError` 인스턴스는 코드 또는 종속성의 버그를 나타냅니다.

## 클래스: `SyntaxError` {#class-syntaxerror}

- 확장: [\<errors.Error\>](/ko/nodejs/api/errors#class-error)

프로그램이 유효한 JavaScript가 아님을 나타냅니다. 이러한 오류는 코드 평가의 결과로만 생성되고 전파될 수 있습니다. 코드 평가는 `eval`, `Function`, `require` 또는 [vm](/ko/nodejs/api/vm)의 결과로 발생할 수 있습니다. 이러한 오류는 거의 항상 손상된 프로그램을 나타냅니다.

```js [ESM]
try {
  require('node:vm').runInThisContext('binary ! isNotOk');
} catch (err) {
  // 'err'는 SyntaxError가 됩니다.
}
```
`SyntaxError` 인스턴스는 이를 생성한 컨텍스트에서 복구할 수 없습니다. 다른 컨텍스트에서만 catch할 수 있습니다.

## 클래스: `SystemError` {#class-systemerror}

- 확장: [\<errors.Error\>](/ko/nodejs/api/errors#class-error)

Node.js는 런타임 환경 내에서 예외가 발생할 때 시스템 오류를 생성합니다. 이는 일반적으로 애플리케이션이 운영 체제 제약 조건을 위반할 때 발생합니다. 예를 들어 애플리케이션이 존재하지 않는 파일을 읽으려고 하면 시스템 오류가 발생합니다.

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 존재하는 경우 네트워크 연결에 실패한 주소
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 문자열 오류 코드
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 존재하는 경우 파일 시스템 오류를 보고할 때의 파일 경로 대상
- `errno` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 시스템에서 제공하는 오류 번호
- `info` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 존재하는 경우 오류 조건에 대한 추가 세부 정보
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 시스템에서 제공하는 사람이 읽을 수 있는 오류 설명
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 존재하는 경우 파일 시스템 오류를 보고할 때의 파일 경로
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 존재하는 경우 사용할 수 없는 네트워크 연결 포트
- `syscall` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 오류를 트리거한 시스템 호출의 이름


### `error.address` {#erroraddress}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

있는 경우, `error.address`는 네트워크 연결에 실패한 주소를 설명하는 문자열입니다.

### `error.code` {#errorcode_1}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.code` 속성은 오류 코드를 나타내는 문자열입니다.

### `error.dest` {#errordest}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

있는 경우, `error.dest`는 파일 시스템 오류를 보고할 때의 파일 경로 대상입니다.

### `error.errno` {#errorerrno}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`error.errno` 속성은 [`libuv 오류 처리`](https://docs.libuv.org/en/v1.x/errors)에 정의된 오류 코드에 해당하는 음수입니다.

Windows에서는 시스템에서 제공하는 오류 번호가 libuv에 의해 정규화됩니다.

오류 코드의 문자열 표현을 얻으려면 [`util.getSystemErrorName(error.errno)`](/ko/nodejs/api/util#utilgetsystemerrornameerr)를 사용하십시오.

### `error.info` {#errorinfo}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

있는 경우, `error.info`는 오류 조건에 대한 세부 정보가 있는 객체입니다.

### `error.message` {#errormessage_1}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.message`는 시스템에서 제공하는 사람이 읽을 수 있는 오류 설명입니다.

### `error.path` {#errorpath}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

있는 경우, `error.path`는 관련 없는 잘못된 경로 이름을 포함하는 문자열입니다.

### `error.port` {#errorport}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

있는 경우, `error.port`는 사용할 수 없는 네트워크 연결 포트입니다.

### `error.syscall` {#errorsyscall}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.syscall` 속성은 실패한 [syscall](https://man7.org/linux/man-pages/man2/syscalls.2)을 설명하는 문자열입니다.


### 일반적인 시스템 오류 {#common-system-errors}

다음은 Node.js 프로그램을 작성할 때 흔히 발생하는 시스템 오류 목록입니다. 전체 목록은 [`errno(3) man page`](https://man7.org/linux/man-pages/man3/errno.3)를 참조하십시오.

- `EACCES` (Permission denied): 파일 액세스 권한에 의해 금지된 방식으로 파일에 액세스하려고 시도했습니다.
- `EADDRINUSE` (Address already in use): 로컬 시스템의 다른 서버가 이미 해당 주소를 사용하고 있기 때문에 서버([`net`](/ko/nodejs/api/net), [`http`](/ko/nodejs/api/http) 또는 [`https`](/ko/nodejs/api/https))를 로컬 주소에 바인딩하지 못했습니다.
- `ECONNREFUSED` (Connection refused): 대상 시스템이 활발하게 거부했기 때문에 연결할 수 없습니다. 일반적으로 외부 호스트에서 비활성 상태인 서비스에 연결하려고 시도한 결과입니다.
- `ECONNRESET` (Connection reset by peer): 피어가 강제로 연결을 닫았습니다. 일반적으로 시간 초과 또는 재부팅으로 인해 원격 소켓에서 연결이 끊어진 결과입니다. [`http`](/ko/nodejs/api/http) 및 [`net`](/ko/nodejs/api/net) 모듈을 통해 흔히 발생합니다.
- `EEXIST` (File exists): 대상이 존재하지 않아야 하는 작업의 대상이 기존 파일이었습니다.
- `EISDIR` (Is a directory): 작업에서 파일을 예상했지만 주어진 경로 이름이 디렉터리였습니다.
- `EMFILE` (Too many open files in system): 시스템에서 허용 가능한 최대 [파일 설명자](https://en.wikipedia.org/wiki/File_descriptor) 수에 도달했으며, 하나 이상이 닫힐 때까지 다른 설명자 요청을 충족할 수 없습니다. 특히 프로세스에 대한 파일 설명자 제한이 낮은 시스템(특히 macOS)에서 동시에 여러 파일을 열 때 발생합니다. 낮은 제한을 해결하려면 Node.js 프로세스를 실행할 셸에서 `ulimit -n 2048`을 실행하십시오.
- `ENOENT` (No such file or directory): 지정된 경로 이름의 구성 요소가 존재하지 않음을 나타내기 위해 [`fs`](/ko/nodejs/api/fs) 작업에서 흔히 발생합니다. 주어진 경로로 엔터티(파일 또는 디렉터리)를 찾을 수 없습니다.
- `ENOTDIR` (Not a directory): 주어진 경로 이름의 구성 요소가 존재했지만 예상대로 디렉터리가 아니었습니다. 일반적으로 [`fs.readdir`](/ko/nodejs/api/fs#fsreaddirpath-options-callback)에서 발생합니다.
- `ENOTEMPTY` (Directory not empty): 항목이 있는 디렉터리가 빈 디렉터리가 필요한 작업(일반적으로 [`fs.unlink`](/ko/nodejs/api/fs#fsunlinkpath-callback))의 대상이었습니다.
- `ENOTFOUND` (DNS lookup failed): `EAI_NODATA` 또는 `EAI_NONAME`의 DNS 실패를 나타냅니다. 이것은 표준 POSIX 오류가 아닙니다.
- `EPERM` (Operation not permitted): 권한 상승이 필요한 작업을 수행하려고 시도했습니다.
- `EPIPE` (Broken pipe): 데이터를 읽을 프로세스가 없는 파이프, 소켓 또는 FIFO에 쓰기 작업입니다. [`net`](/ko/nodejs/api/net) 및 [`http`](/ko/nodejs/api/http) 레이어에서 흔히 발생하며, 쓰기 작업이 수행되는 스트림의 원격 측면이 닫혔음을 나타냅니다.
- `ETIMEDOUT` (Operation timed out): 연결된 당사자가 일정 기간 후 적절하게 응답하지 않아 연결 또는 보내기 요청이 실패했습니다. 일반적으로 [`http`](/ko/nodejs/api/http) 또는 [`net`](/ko/nodejs/api/net)에서 발생합니다. 종종 `socket.end()`가 제대로 호출되지 않았다는 신호입니다.


## 클래스: `TypeError` {#class-typeerror}

- [\<errors.Error\>](/ko/nodejs/api/errors#class-error)를 확장합니다.

제공된 인수가 허용 가능한 유형이 아님을 나타냅니다. 예를 들어 문자열을 예상하는 매개변수에 함수를 전달하면 `TypeError`가 됩니다.

```js [ESM]
require('node:url').parse(() => { });
// 문자열을 예상했기 때문에 TypeError를 발생시킵니다.
```
Node.js는 인수 유효성 검사의 한 형태로 `TypeError` 인스턴스를 *즉시* 생성하고 throw합니다.

## 예외와 오류 {#exceptions-vs-errors}

JavaScript 예외는 유효하지 않은 작업의 결과 또는 `throw` 문의 대상으로 throw되는 값입니다. 이러한 값이 `Error`의 인스턴스 또는 `Error`에서 상속된 클래스의 인스턴스일 필요는 없지만 Node.js 또는 JavaScript 런타임에서 throw되는 모든 예외는 `Error`의 인스턴스*입니다*.

일부 예외는 JavaScript 레이어에서 *복구할 수 없습니다*. 이러한 예외는 *항상* Node.js 프로세스를 충돌시킵니다. 예로는 C++ 레이어의 `assert()` 검사 또는 `abort()` 호출이 있습니다.

## OpenSSL 오류 {#openssl-errors}

`crypto` 또는 `tls`에서 발생하는 오류는 `Error` 클래스에 속하며 표준 `.code` 및 `.message` 속성 외에도 일부 추가 OpenSSL 관련 속성을 가질 수 있습니다.

### `error.opensslErrorStack` {#erroropensslerrorstack}

오류가 OpenSSL 라이브러리의 어디에서 발생하는지에 대한 컨텍스트를 제공할 수 있는 오류 배열입니다.

### `error.function` {#errorfunction}

오류가 발생하는 OpenSSL 함수입니다.

### `error.library` {#errorlibrary}

오류가 발생하는 OpenSSL 라이브러리입니다.

### `error.reason` {#errorreason}

오류의 원인을 설명하는 사람이 읽을 수 있는 문자열입니다.

## Node.js 오류 코드 {#nodejs-error-codes}

### `ABORT_ERR` {#abort_err}

**추가됨: v15.0.0**

작업이 중단되었을 때 사용됩니다(일반적으로 `AbortController` 사용).

`AbortSignal`을 사용*하지 않는* API는 일반적으로 이 코드로 오류를 발생시키지 않습니다.

이 코드는 웹 플랫폼의 `AbortError`와의 호환성을 위해 Node.js 오류가 사용하는 일반적인 `ERR_*` 규칙을 사용하지 않습니다.

### `ERR_ACCESS_DENIED` {#err_access_denied}

Node.js가 [권한 모델](/ko/nodejs/api/permissions#permission-model)에 의해 제한된 리소스에 액세스하려고 할 때마다 트리거되는 특별한 유형의 오류입니다.


### `ERR_AMBIGUOUS_ARGUMENT` {#err_ambiguous_argument}

함수 시그니처를 오해할 수 있다는 것을 암시하는 방식으로 함수 인수가 사용되고 있습니다. 이는 `assert.throws(block, message)`의 `message` 매개변수가 `block`에서 던져진 오류 메시지와 일치할 때 `node:assert` 모듈에서 발생합니다. 왜냐하면 해당 사용법은 사용자가 `message`를 `block`이 던지지 않을 경우 `AssertionError`가 표시할 메시지 대신 예상되는 메시지라고 믿는다는 것을 암시하기 때문입니다.

### `ERR_ARG_NOT_ITERABLE` {#err_arg_not_iterable}

반복 가능한 인수(`for...of` 루프에서 작동하는 값)가 필요했지만 Node.js API에 제공되지 않았습니다.

### `ERR_ASSERTION` {#err_assertion}

Node.js가 발생해서는 안 되는 예외적인 논리 위반을 감지할 때마다 트리거될 수 있는 특별한 유형의 오류입니다. 이는 일반적으로 `node:assert` 모듈에 의해 발생합니다.

### `ERR_ASYNC_CALLBACK` {#err_async_callback}

함수가 아닌 것을 `AsyncHooks` 콜백으로 등록하려는 시도가 있었습니다.

### `ERR_ASYNC_TYPE` {#err_async_type}

비동기 리소스의 유형이 유효하지 않았습니다. 사용자는 공개 임베더 API를 사용하는 경우 자체 유형을 정의할 수도 있습니다.

### `ERR_BROTLI_COMPRESSION_FAILED` {#err_brotli_compression_failed}

Brotli 스트림으로 전달된 데이터가 성공적으로 압축되지 않았습니다.

### `ERR_BROTLI_INVALID_PARAM` {#err_brotli_invalid_param}

Brotli 스트림을 구성하는 동안 잘못된 매개변수 키가 전달되었습니다.

### `ERR_BUFFER_CONTEXT_NOT_AVAILABLE` {#err_buffer_context_not_available}

Node.js 인스턴스와 연결되지 않은 JS 엔진 컨텍스트에 있는 동안 애드온 또는 임베더 코드에서 Node.js `Buffer` 인스턴스를 만들려고 시도했습니다. `Buffer` 메서드에 전달된 데이터는 메서드가 반환될 때 해제됩니다.

이 오류가 발생하면 `Buffer` 인스턴스를 만드는 대신 일반 `Uint8Array`를 만드는 것이 가능합니다. 이는 결과 객체의 프로토타입만 다릅니다. `Uint8Array`는 일반적으로 `Buffer`가 있는 모든 Node.js 코어 API에서 허용되며 모든 컨텍스트에서 사용할 수 있습니다.

### `ERR_BUFFER_OUT_OF_BOUNDS` {#err_buffer_out_of_bounds}

`Buffer`의 범위를 벗어난 작업이 시도되었습니다.

### `ERR_BUFFER_TOO_LARGE` {#err_buffer_too_large}

최대 허용 크기보다 큰 `Buffer`를 만들려고 시도했습니다.


### `ERR_CANNOT_WATCH_SIGINT` {#err_cannot_watch_sigint}

Node.js가 `SIGINT` 신호를 감시할 수 없었습니다.

### `ERR_CHILD_CLOSED_BEFORE_REPLY` {#err_child_closed_before_reply}

부모 프로세스가 응답을 받기 전에 자식 프로세스가 종료되었습니다.

### `ERR_CHILD_PROCESS_IPC_REQUIRED` {#err_child_process_ipc_required}

IPC 채널을 지정하지 않고 자식 프로세스를 포크할 때 사용됩니다.

### `ERR_CHILD_PROCESS_STDIO_MAXBUFFER` {#err_child_process_stdio_maxbuffer}

주 프로세스가 자식 프로세스의 STDERR/STDOUT에서 데이터를 읽으려고 할 때 데이터 길이가 `maxBuffer` 옵션보다 긴 경우 사용됩니다.

### `ERR_CLOSED_MESSAGE_PORT` {#err_closed_message_port}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.2.0, v14.17.1 | 오류 메시지가 다시 도입되었습니다. |
| v11.12.0 | 오류 메시지가 제거되었습니다. |
| v10.5.0 | 추가됨: v10.5.0 |
:::

일반적으로 `.close()`가 호출된 후 닫힌 상태의 `MessagePort` 인스턴스를 사용하려는 시도가 있었습니다.

### `ERR_CONSOLE_WRITABLE_STREAM` {#err_console_writable_stream}

`Console`이 `stdout` 스트림 없이 인스턴스화되었거나 `Console`에 쓰기 불가능한 `stdout` 또는 `stderr` 스트림이 있습니다.

### `ERR_CONSTRUCT_CALL_INVALID` {#err_construct_call_invalid}

**추가됨: v12.5.0**

호출할 수 없는 클래스 생성자가 호출되었습니다.

### `ERR_CONSTRUCT_CALL_REQUIRED` {#err_construct_call_required}

클래스에 대한 생성자가 `new` 없이 호출되었습니다.

### `ERR_CONTEXT_NOT_INITIALIZED` {#err_context_not_initialized}

API에 전달된 vm 컨텍스트가 아직 초기화되지 않았습니다. 이는 컨텍스트를 생성하는 동안 오류가 발생하고 (잡히는 경우) 발생할 수 있습니다. 예를 들어 컨텍스트를 생성할 때 할당에 실패하거나 최대 호출 스택 크기에 도달한 경우입니다.

### `ERR_CRYPTO_CUSTOM_ENGINE_NOT_SUPPORTED` {#err_crypto_custom_engine_not_supported}

사용 중인 OpenSSL 버전에 의해 지원되지 않는 OpenSSL 엔진이 요청되었습니다 (예: `clientCertEngine` 또는 `privateKeyEngine` TLS 옵션을 통해). 이는 컴파일 시간 플래그 `OPENSSL_NO_ENGINE` 때문일 가능성이 높습니다.

### `ERR_CRYPTO_ECDH_INVALID_FORMAT` {#err_crypto_ecdh_invalid_format}

`crypto.ECDH()` 클래스 `getPublicKey()` 메서드에 대한 `format` 인수에 잘못된 값이 전달되었습니다.

### `ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY` {#err_crypto_ecdh_invalid_public_key}

`crypto.ECDH()` 클래스 `computeSecret()` 메서드에 대한 `key` 인수에 잘못된 값이 전달되었습니다. 이는 공개 키가 타원 곡선 외부에 있음을 의미합니다.


### `ERR_CRYPTO_ENGINE_UNKNOWN` {#err_crypto_engine_unknown}

잘못된 암호화 엔진 식별자가 [`require('node:crypto').setEngine()`](/ko/nodejs/api/crypto#cryptosetengineengine-flags)에 전달되었습니다.

### `ERR_CRYPTO_FIPS_FORCED` {#err_crypto_fips_forced}

[`--force-fips`](/ko/nodejs/api/cli#--force-fips) 명령줄 인수가 사용되었지만 `node:crypto` 모듈에서 FIPS 모드를 활성화하거나 비활성화하려는 시도가 있었습니다.

### `ERR_CRYPTO_FIPS_UNAVAILABLE` {#err_crypto_fips_unavailable}

FIPS 모드를 활성화하거나 비활성화하려는 시도가 있었지만 FIPS 모드를 사용할 수 없었습니다.

### `ERR_CRYPTO_HASH_FINALIZED` {#err_crypto_hash_finalized}

[`hash.digest()`](/ko/nodejs/api/crypto#hashdigestencoding)가 여러 번 호출되었습니다. `hash.digest()` 메서드는 `Hash` 객체의 인스턴스당 한 번만 호출해야 합니다.

### `ERR_CRYPTO_HASH_UPDATE_FAILED` {#err_crypto_hash_update_failed}

[`hash.update()`](/ko/nodejs/api/crypto#hashupdatedata-inputencoding)가 어떤 이유로든 실패했습니다. 이는 거의 발생하지 않아야 합니다.

### `ERR_CRYPTO_INCOMPATIBLE_KEY` {#err_crypto_incompatible_key}

주어진 암호화 키가 시도된 작업과 호환되지 않습니다.

### `ERR_CRYPTO_INCOMPATIBLE_KEY_OPTIONS` {#err_crypto_incompatible_key_options}

선택한 공개 키 또는 개인 키 인코딩이 다른 옵션과 호환되지 않습니다.

### `ERR_CRYPTO_INITIALIZATION_FAILED` {#err_crypto_initialization_failed}

**추가된 버전: v15.0.0**

암호화 하위 시스템 초기화에 실패했습니다.

### `ERR_CRYPTO_INVALID_AUTH_TAG` {#err_crypto_invalid_auth_tag}

**추가된 버전: v15.0.0**

잘못된 인증 태그가 제공되었습니다.

### `ERR_CRYPTO_INVALID_COUNTER` {#err_crypto_invalid_counter}

**추가된 버전: v15.0.0**

카운터 모드 암호에 대해 잘못된 카운터가 제공되었습니다.

### `ERR_CRYPTO_INVALID_CURVE` {#err_crypto_invalid_curve}

**추가된 버전: v15.0.0**

잘못된 타원 곡선이 제공되었습니다.

### `ERR_CRYPTO_INVALID_DIGEST` {#err_crypto_invalid_digest}

잘못된 [암호화 다이제스트 알고리즘](/ko/nodejs/api/crypto#cryptogethashes)이 지정되었습니다.

### `ERR_CRYPTO_INVALID_IV` {#err_crypto_invalid_iv}

**추가된 버전: v15.0.0**

잘못된 초기화 벡터가 제공되었습니다.

### `ERR_CRYPTO_INVALID_JWK` {#err_crypto_invalid_jwk}

**추가된 버전: v15.0.0**

잘못된 JSON 웹 키가 제공되었습니다.

### `ERR_CRYPTO_INVALID_KEYLEN` {#err_crypto_invalid_keylen}

**추가된 버전: v15.0.0**

잘못된 키 길이가 제공되었습니다.

### `ERR_CRYPTO_INVALID_KEYPAIR` {#err_crypto_invalid_keypair}

**추가된 버전: v15.0.0**

잘못된 키 쌍이 제공되었습니다.

### `ERR_CRYPTO_INVALID_KEYTYPE` {#err_crypto_invalid_keytype}

**추가된 버전: v15.0.0**

잘못된 키 유형이 제공되었습니다.


### `ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE` {#err_crypto_invalid_key_object_type}

제공된 암호 키 객체의 유형이 시도된 작업에 유효하지 않습니다.

### `ERR_CRYPTO_INVALID_MESSAGELEN` {#err_crypto_invalid_messagelen}

**추가된 버전: v15.0.0**

유효하지 않은 메시지 길이가 제공되었습니다.

### `ERR_CRYPTO_INVALID_SCRYPT_PARAMS` {#err_crypto_invalid_scrypt_params}

**추가된 버전: v15.0.0**

하나 이상의 [`crypto.scrypt()`](/ko/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) 또는 [`crypto.scryptSync()`](/ko/nodejs/api/crypto#cryptoscryptsyncpassword-salt-keylen-options) 매개변수가 해당 유효 범위 밖에 있습니다.

### `ERR_CRYPTO_INVALID_STATE` {#err_crypto_invalid_state}

유효하지 않은 상태의 객체에 암호화 메서드가 사용되었습니다. 예를 들어 `cipher.final()`을 호출하기 전에 [`cipher.getAuthTag()`](/ko/nodejs/api/crypto#ciphergetauthtag)를 호출하는 경우입니다.

### `ERR_CRYPTO_INVALID_TAG_LENGTH` {#err_crypto_invalid_tag_length}

**추가된 버전: v15.0.0**

유효하지 않은 인증 태그 길이가 제공되었습니다.

### `ERR_CRYPTO_JOB_INIT_FAILED` {#err_crypto_job_init_failed}

**추가된 버전: v15.0.0**

비동기 암호화 작업의 초기화에 실패했습니다.

### `ERR_CRYPTO_JWK_UNSUPPORTED_CURVE` {#err_crypto_jwk_unsupported_curve}

키의 타원 곡선이 [JSON Web Key Elliptic Curve Registry](https://www.iana.org/assignments/jose/jose.xhtml#web-key-elliptic-curve)에서 사용하도록 등록되지 않았습니다.

### `ERR_CRYPTO_JWK_UNSUPPORTED_KEY_TYPE` {#err_crypto_jwk_unsupported_key_type}

키의 비대칭 키 유형이 [JSON Web Key Types Registry](https://www.iana.org/assignments/jose/jose.xhtml#web-key-types)에서 사용하도록 등록되지 않았습니다.

### `ERR_CRYPTO_OPERATION_FAILED` {#err_crypto_operation_failed}

**추가된 버전: v15.0.0**

암호화 작업이 지정되지 않은 이유로 실패했습니다.

### `ERR_CRYPTO_PBKDF2_ERROR` {#err_crypto_pbkdf2_error}

지정되지 않은 이유로 PBKDF2 알고리즘이 실패했습니다. OpenSSL은 자세한 내용을 제공하지 않으므로 Node.js도 제공하지 않습니다.

### `ERR_CRYPTO_SCRYPT_NOT_SUPPORTED` {#err_crypto_scrypt_not_supported}

Node.js가 `scrypt` 지원 없이 컴파일되었습니다. 공식 릴리스 바이너리에서는 불가능하지만 배포판 빌드를 포함한 사용자 정의 빌드에서는 발생할 수 있습니다.

### `ERR_CRYPTO_SIGN_KEY_REQUIRED` {#err_crypto_sign_key_required}

서명 `key`가 [`sign.sign()`](/ko/nodejs/api/crypto#signsignprivatekey-outputencoding) 메서드에 제공되지 않았습니다.

### `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` {#err_crypto_timing_safe_equal_length}

서로 다른 길이의 `Buffer`, `TypedArray` 또는 `DataView` 인수로 [`crypto.timingSafeEqual()`](/ko/nodejs/api/crypto#cryptotimingsafeequala-b)이 호출되었습니다.


### `ERR_CRYPTO_UNKNOWN_CIPHER` {#err_crypto_unknown_cipher}

알 수 없는 암호가 지정되었습니다.

### `ERR_CRYPTO_UNKNOWN_DH_GROUP` {#err_crypto_unknown_dh_group}

알 수 없는 Diffie-Hellman 그룹 이름이 지정되었습니다. 유효한 그룹 이름 목록은 [`crypto.getDiffieHellman()`](/ko/nodejs/api/crypto#cryptogetdiffiehellmangroupname)을 참조하십시오.

### `ERR_CRYPTO_UNSUPPORTED_OPERATION` {#err_crypto_unsupported_operation}

**추가된 버전: v15.0.0, v14.18.0**

지원되지 않는 암호화 작업을 호출하려는 시도가 있었습니다.

### `ERR_DEBUGGER_ERROR` {#err_debugger_error}

**추가된 버전: v16.4.0, v14.17.4**

[디버거](/ko/nodejs/api/debugger)에서 오류가 발생했습니다.

### `ERR_DEBUGGER_STARTUP_ERROR` {#err_debugger_startup_error}

**추가된 버전: v16.4.0, v14.17.4**

[디버거](/ko/nodejs/api/debugger)가 필요한 호스트/포트가 사용 가능해질 때까지 기다리는 동안 시간 초과되었습니다.

### `ERR_DIR_CLOSED` {#err_dir_closed}

[`fs.Dir`](/ko/nodejs/api/fs#class-fsdir)가 이전에 닫혔습니다.

### `ERR_DIR_CONCURRENT_OPERATION` {#err_dir_concurrent_operation}

**추가된 버전: v14.3.0**

진행 중인 비동기 작업이 있는 [`fs.Dir`](/ko/nodejs/api/fs#class-fsdir)에서 동기 읽기 또는 닫기 호출이 시도되었습니다.

### `ERR_DLOPEN_DISABLED` {#err_dlopen_disabled}

**추가된 버전: v16.10.0, v14.19.0**

네이티브 애드온 로딩이 [`--no-addons`](/ko/nodejs/api/cli#--no-addons)를 사용하여 비활성화되었습니다.

### `ERR_DLOPEN_FAILED` {#err_dlopen_failed}

**추가된 버전: v15.0.0**

`process.dlopen()` 호출이 실패했습니다.

### `ERR_DNS_SET_SERVERS_FAILED` {#err_dns_set_servers_failed}

`c-ares`가 DNS 서버를 설정하지 못했습니다.

### `ERR_DOMAIN_CALLBACK_NOT_AVAILABLE` {#err_domain_callback_not_available}

`node:domain` 모듈은 [`process.setUncaughtExceptionCaptureCallback()`](/ko/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn)이 이전 시점에 호출되었기 때문에 필요한 오류 처리 후크를 설정할 수 없어 사용할 수 없었습니다.

### `ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE` {#err_domain_cannot_set_uncaught_exception_capture}

`node:domain` 모듈이 이전 시점에 로드되었기 때문에 [`process.setUncaughtExceptionCaptureCallback()`](/ko/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn)을 호출할 수 없습니다.

스택 추적은 `node:domain` 모듈이 로드된 시점을 포함하도록 확장됩니다.

### `ERR_DUPLICATE_STARTUP_SNAPSHOT_MAIN_FUNCTION` {#err_duplicate_startup_snapshot_main_function}

[`v8.startupSnapshot.setDeserializeMainFunction()`](/ko/nodejs/api/v8#v8startupsnapshotsetdeserializemainfunctioncallback-data)은 이미 이전에 호출되었기 때문에 호출할 수 없습니다.


### `ERR_ENCODING_INVALID_ENCODED_DATA` {#err_encoding_invalid_encoded_data}

`TextDecoder()` API에 제공된 데이터가 제공된 인코딩에 따라 유효하지 않습니다.

### `ERR_ENCODING_NOT_SUPPORTED` {#err_encoding_not_supported}

`TextDecoder()` API에 제공된 인코딩이 [WHATWG 지원 인코딩](/ko/nodejs/api/util#whatwg-supported-encodings) 중 하나가 아닙니다.

### `ERR_EVAL_ESM_CANNOT_PRINT` {#err_eval_esm_cannot_print}

`--print`는 ESM 입력과 함께 사용할 수 없습니다.

### `ERR_EVENT_RECURSION` {#err_event_recursion}

`EventTarget`에서 이벤트를 재귀적으로 디스패치하려는 시도가 있을 때 발생합니다.

### `ERR_EXECUTION_ENVIRONMENT_NOT_AVAILABLE` {#err_execution_environment_not_available}

JS 실행 컨텍스트가 Node.js 환경과 연결되어 있지 않습니다. 이는 Node.js가 임베디드 라이브러리로 사용되고 JS 엔진에 대한 일부 후크가 제대로 설정되지 않은 경우에 발생할 수 있습니다.

### `ERR_FALSY_VALUE_REJECTION` {#err_falsy_value_rejection}

`util.callbackify()`를 통해 콜백화된 `Promise`가 거짓 값으로 거부되었습니다.

### `ERR_FEATURE_UNAVAILABLE_ON_PLATFORM` {#err_feature_unavailable_on_platform}

**추가된 버전: v14.0.0**

Node.js를 실행 중인 현재 플랫폼에서 사용할 수 없는 기능을 사용하는 경우에 사용됩니다.

### `ERR_FS_CP_DIR_TO_NON_DIR` {#err_fs_cp_dir_to_non_dir}

**추가된 버전: v16.7.0**

[`fs.cp()`](/ko/nodejs/api/fs#fscpsrc-dest-options-callback)를 사용하여 디렉토리를 비 디렉토리(파일, 심볼릭 링크 등)로 복사하려는 시도가 있었습니다.

### `ERR_FS_CP_EEXIST` {#err_fs_cp_eexist}

**추가된 버전: v16.7.0**

`force` 및 `errorOnExist`가 `true`로 설정된 상태에서 [`fs.cp()`](/ko/nodejs/api/fs#fscpsrc-dest-options-callback)를 사용하여 이미 존재하는 파일을 덮어쓰려고 했습니다.

### `ERR_FS_CP_EINVAL` {#err_fs_cp_einval}

**추가된 버전: v16.7.0**

[`fs.cp()`](/ko/nodejs/api/fs#fscpsrc-dest-options-callback)를 사용할 때 `src` 또는 `dest`가 유효하지 않은 경로를 가리켰습니다.

### `ERR_FS_CP_FIFO_PIPE` {#err_fs_cp_fifo_pipe}

**추가된 버전: v16.7.0**

[`fs.cp()`](/ko/nodejs/api/fs#fscpsrc-dest-options-callback)를 사용하여 명명된 파이프를 복사하려는 시도가 있었습니다.

### `ERR_FS_CP_NON_DIR_TO_DIR` {#err_fs_cp_non_dir_to_dir}

**추가된 버전: v16.7.0**

[`fs.cp()`](/ko/nodejs/api/fs#fscpsrc-dest-options-callback)를 사용하여 비 디렉토리(파일, 심볼릭 링크 등)를 디렉토리로 복사하려는 시도가 있었습니다.

### `ERR_FS_CP_SOCKET` {#err_fs_cp_socket}

**추가된 버전: v16.7.0**

[`fs.cp()`](/ko/nodejs/api/fs#fscpsrc-dest-options-callback)를 사용하여 소켓에 복사하려는 시도가 있었습니다.


### `ERR_FS_CP_SYMLINK_TO_SUBDIRECTORY` {#err_fs_cp_symlink_to_subdirectory}

**Added in: v16.7.0**

[`fs.cp()`](/ko/nodejs/api/fs#fscpsrc-dest-options-callback)을 사용할 때 `dest`의 심볼릭 링크가 `src`의 하위 디렉터리를 가리켰습니다.

### `ERR_FS_CP_UNKNOWN` {#err_fs_cp_unknown}

**Added in: v16.7.0**

[`fs.cp()`](/ko/nodejs/api/fs#fscpsrc-dest-options-callback)을 사용하여 알 수 없는 파일 유형으로 복사하려 했습니다.

### `ERR_FS_EISDIR` {#err_fs_eisdir}

경로는 디렉터리입니다.

### `ERR_FS_FILE_TOO_LARGE` {#err_fs_file_too_large}

파일 크기가 `Buffer`의 최대 허용 크기보다 큰 파일을 읽으려고 했습니다.

### `ERR_HTTP2_ALTSVC_INVALID_ORIGIN` {#err_http2_altsvc_invalid_origin}

HTTP/2 ALTSVC 프레임에는 유효한 Origin이 필요합니다.

### `ERR_HTTP2_ALTSVC_LENGTH` {#err_http2_altsvc_length}

HTTP/2 ALTSVC 프레임은 최대 16,382바이트의 페이로드로 제한됩니다.

### `ERR_HTTP2_CONNECT_AUTHORITY` {#err_http2_connect_authority}

`CONNECT` 메서드를 사용하는 HTTP/2 요청의 경우 `:authority` 유사 헤더가 필요합니다.

### `ERR_HTTP2_CONNECT_PATH` {#err_http2_connect_path}

`CONNECT` 메서드를 사용하는 HTTP/2 요청의 경우 `:path` 유사 헤더는 금지됩니다.

### `ERR_HTTP2_CONNECT_SCHEME` {#err_http2_connect_scheme}

`CONNECT` 메서드를 사용하는 HTTP/2 요청의 경우 `:scheme` 유사 헤더는 금지됩니다.

### `ERR_HTTP2_ERROR` {#err_http2_error}

특정되지 않은 HTTP/2 오류가 발생했습니다.

### `ERR_HTTP2_GOAWAY_SESSION` {#err_http2_goaway_session}

연결된 피어로부터 `GOAWAY` 프레임을 수신한 후에는 새 HTTP/2 스트림을 열 수 없습니다.

### `ERR_HTTP2_HEADERS_AFTER_RESPOND` {#err_http2_headers_after_respond}

HTTP/2 응답이 시작된 후 추가 헤더가 지정되었습니다.

### `ERR_HTTP2_HEADERS_SENT` {#err_http2_headers_sent}

여러 응답 헤더를 보내려고 했습니다.

### `ERR_HTTP2_HEADER_SINGLE_VALUE` {#err_http2_header_single_value}

단일 값만 있어야 하는 HTTP/2 헤더 필드에 여러 값이 제공되었습니다.

### `ERR_HTTP2_INFO_STATUS_NOT_ALLOWED` {#err_http2_info_status_not_allowed}

정보 HTTP 상태 코드(`1xx`)는 HTTP/2 응답의 응답 상태 코드로 설정할 수 없습니다.

### `ERR_HTTP2_INVALID_CONNECTION_HEADERS` {#err_http2_invalid_connection_headers}

HTTP/1 연결 특정 헤더는 HTTP/2 요청 및 응답에서 사용할 수 없습니다.

### `ERR_HTTP2_INVALID_HEADER_VALUE` {#err_http2_invalid_header_value}

잘못된 HTTP/2 헤더 값이 지정되었습니다.


### `ERR_HTTP2_INVALID_INFO_STATUS` {#err_http2_invalid_info_status}

유효하지 않은 HTTP 정보 상태 코드가 지정되었습니다. 정보 상태 코드는 `100`에서 `199` 사이의 정수여야 합니다(경계값 포함).

### `ERR_HTTP2_INVALID_ORIGIN` {#err_http2_invalid_origin}

HTTP/2 `ORIGIN` 프레임에는 유효한 출처가 필요합니다.

### `ERR_HTTP2_INVALID_PACKED_SETTINGS_LENGTH` {#err_http2_invalid_packed_settings_length}

`http2.getUnpackedSettings()` API에 전달된 입력 `Buffer` 및 `Uint8Array` 인스턴스의 길이는 6의 배수여야 합니다.

### `ERR_HTTP2_INVALID_PSEUDOHEADER` {#err_http2_invalid_pseudoheader}

유효한 HTTP/2 의사 헤더(`:status`, `:path`, `:authority`, `:scheme`, 및 `:method`)만 사용할 수 있습니다.

### `ERR_HTTP2_INVALID_SESSION` {#err_http2_invalid_session}

이미 소멸된 `Http2Session` 객체에 대해 작업이 수행되었습니다.

### `ERR_HTTP2_INVALID_SETTING_VALUE` {#err_http2_invalid_setting_value}

유효하지 않은 값이 HTTP/2 설정에 지정되었습니다.

### `ERR_HTTP2_INVALID_STREAM` {#err_http2_invalid_stream}

이미 소멸된 스트림에 대해 작업이 수행되었습니다.

### `ERR_HTTP2_MAX_PENDING_SETTINGS_ACK` {#err_http2_max_pending_settings_ack}

HTTP/2 `SETTINGS` 프레임이 연결된 피어에 전송될 때마다 피어는 새로운 `SETTINGS`를 수신하고 적용했다는 확인을 보내야 합니다. 기본적으로 승인되지 않은 `SETTINGS` 프레임의 최대 개수를 언제든지 보낼 수 있습니다. 이 오류 코드는 해당 제한에 도달했을 때 사용됩니다.

### `ERR_HTTP2_NESTED_PUSH` {#err_http2_nested_push}

푸시 스트림 내에서 새 푸시 스트림을 시작하려고 시도했습니다. 중첩된 푸시 스트림은 허용되지 않습니다.

### `ERR_HTTP2_NO_MEM` {#err_http2_no_mem}

`http2session.setLocalWindowSize(windowSize)` API를 사용하는 동안 메모리가 부족합니다.

### `ERR_HTTP2_NO_SOCKET_MANIPULATION` {#err_http2_no_socket_manipulation}

`Http2Session`에 연결된 소켓을 직접 조작(읽기, 쓰기, 일시 중지, 재개 등)하려고 시도했습니다.

### `ERR_HTTP2_ORIGIN_LENGTH` {#err_http2_origin_length}

HTTP/2 `ORIGIN` 프레임은 길이가 16382바이트로 제한됩니다.

### `ERR_HTTP2_OUT_OF_STREAMS` {#err_http2_out_of_streams}

단일 HTTP/2 세션에서 생성된 스트림 수가 최대 제한에 도달했습니다.

### `ERR_HTTP2_PAYLOAD_FORBIDDEN` {#err_http2_payload_forbidden}

페이로드가 금지된 HTTP 응답 코드에 대해 메시지 페이로드가 지정되었습니다.


### `ERR_HTTP2_PING_CANCEL` {#err_http2_ping_cancel}

HTTP/2 핑이 취소되었습니다.

### `ERR_HTTP2_PING_LENGTH` {#err_http2_ping_length}

HTTP/2 핑 페이로드는 정확히 8바이트 길이여야 합니다.

### `ERR_HTTP2_PSEUDOHEADER_NOT_ALLOWED` {#err_http2_pseudoheader_not_allowed}

HTTP/2 유사 헤더가 부적절하게 사용되었습니다. 유사 헤더는 `:` 접두사로 시작하는 헤더 키 이름입니다.

### `ERR_HTTP2_PUSH_DISABLED` {#err_http2_push_disabled}

클라이언트에서 비활성화된 푸시 스트림을 생성하려고 시도했습니다.

### `ERR_HTTP2_SEND_FILE` {#err_http2_send_file}

`Http2Stream.prototype.responseWithFile()` API를 사용하여 디렉터리를 보내려고 시도했습니다.

### `ERR_HTTP2_SEND_FILE_NOSEEK` {#err_http2_send_file_noseek}

`Http2Stream.prototype.responseWithFile()` API를 사용하여 일반 파일이 아닌 것을 보내려고 시도했지만 `offset` 또는 `length` 옵션이 제공되었습니다.

### `ERR_HTTP2_SESSION_ERROR` {#err_http2_session_error}

`Http2Session`이 0이 아닌 오류 코드로 닫혔습니다.

### `ERR_HTTP2_SETTINGS_CANCEL` {#err_http2_settings_cancel}

`Http2Session` 설정이 취소되었습니다.

### `ERR_HTTP2_SOCKET_BOUND` {#err_http2_socket_bound}

이미 다른 `Http2Session` 객체에 바인딩된 `net.Socket` 또는 `tls.TLSSocket`에 `Http2Session` 객체를 연결하려고 시도했습니다.

### `ERR_HTTP2_SOCKET_UNBOUND` {#err_http2_socket_unbound}

이미 닫힌 `Http2Session`의 `socket` 속성을 사용하려고 시도했습니다.

### `ERR_HTTP2_STATUS_101` {#err_http2_status_101}

HTTP/2에서는 `101` 정보 상태 코드의 사용이 금지됩니다.

### `ERR_HTTP2_STATUS_INVALID` {#err_http2_status_invalid}

잘못된 HTTP 상태 코드가 지정되었습니다. 상태 코드는 `100`과 `599` 사이의 정수여야 합니다(경계값 포함).

### `ERR_HTTP2_STREAM_CANCEL` {#err_http2_stream_cancel}

연결된 피어로 데이터가 전송되기 전에 `Http2Stream`이 파괴되었습니다.

### `ERR_HTTP2_STREAM_ERROR` {#err_http2_stream_error}

`RST_STREAM` 프레임에 0이 아닌 오류 코드가 지정되었습니다.

### `ERR_HTTP2_STREAM_SELF_DEPENDENCY` {#err_http2_stream_self_dependency}

HTTP/2 스트림의 우선 순위를 설정할 때 스트림은 부모 스트림의 종속성으로 표시될 수 있습니다. 이 오류 코드는 스트림 자체를 종속 항목으로 표시하려고 할 때 사용됩니다.

### `ERR_HTTP2_TOO_MANY_CUSTOM_SETTINGS` {#err_http2_too_many_custom_settings}

지원되는 사용자 지정 설정 수(10)를 초과했습니다.


### `ERR_HTTP2_TOO_MANY_INVALID_FRAMES` {#err_http2_too_many_invalid_frames}

**Added in: v15.14.0**

`maxSessionInvalidFrames` 옵션을 통해 지정된 피어가 보낸 허용 가능한 잘못된 HTTP/2 프로토콜 프레임 제한을 초과했습니다.

### `ERR_HTTP2_TRAILERS_ALREADY_SENT` {#err_http2_trailers_already_sent}

트레일링 헤더가 `Http2Stream`에서 이미 전송되었습니다.

### `ERR_HTTP2_TRAILERS_NOT_READY` {#err_http2_trailers_not_ready}

`http2stream.sendTrailers()` 메서드는 `Http2Stream` 객체에서 `'wantTrailers'` 이벤트가 발생한 후에 호출할 수 있습니다. `'wantTrailers'` 이벤트는 `Http2Stream`에 대해 `waitForTrailers` 옵션이 설정된 경우에만 발생합니다.

### `ERR_HTTP2_UNSUPPORTED_PROTOCOL` {#err_http2_unsupported_protocol}

`http2.connect()`에 `http:` 또는 `https:` 이외의 프로토콜을 사용하는 URL이 전달되었습니다.

### `ERR_HTTP_BODY_NOT_ALLOWED` {#err_http_body_not_allowed}

콘텐츠를 허용하지 않는 HTTP 응답에 쓰려고 할 때 오류가 발생합니다.

### `ERR_HTTP_CONTENT_LENGTH_MISMATCH` {#err_http_content_length_mismatch}

응답 본문 크기가 지정된 콘텐츠 길이 헤더 값과 일치하지 않습니다.

### `ERR_HTTP_HEADERS_SENT` {#err_http_headers_sent}

헤더가 이미 전송된 후에 더 많은 헤더를 추가하려고 시도했습니다.

### `ERR_HTTP_INVALID_HEADER_VALUE` {#err_http_invalid_header_value}

잘못된 HTTP 헤더 값이 지정되었습니다.

### `ERR_HTTP_INVALID_STATUS_CODE` {#err_http_invalid_status_code}

상태 코드가 일반 상태 코드 범위(100-999)를 벗어났습니다.

### `ERR_HTTP_REQUEST_TIMEOUT` {#err_http_request_timeout}

클라이언트가 허용된 시간 내에 전체 요청을 보내지 않았습니다.

### `ERR_HTTP_SOCKET_ASSIGNED` {#err_http_socket_assigned}

지정된 [`ServerResponse`](/ko/nodejs/api/http#class-httpserverresponse)에 이미 소켓이 할당되었습니다.

### `ERR_HTTP_SOCKET_ENCODING` {#err_http_socket_encoding}

소켓 인코딩 변경은 [RFC 7230 섹션 3](https://tools.ietf.org/html/rfc7230#section-3)에 따라 허용되지 않습니다.

### `ERR_HTTP_TRAILER_INVALID` {#err_http_trailer_invalid}

전송 인코딩이 이를 지원하지 않더라도 `Trailer` 헤더가 설정되었습니다.

### `ERR_ILLEGAL_CONSTRUCTOR` {#err_illegal_constructor}

공용이 아닌 생성자를 사용하여 객체를 생성하려고 시도했습니다.

### `ERR_IMPORT_ATTRIBUTE_MISSING` {#err_import_attribute_missing}

**Added in: v21.1.0**

가져오기 속성이 누락되어 지정된 모듈을 가져올 수 없습니다.


### `ERR_IMPORT_ATTRIBUTE_TYPE_INCOMPATIBLE` {#err_import_attribute_type_incompatible}

**Added in: v21.1.0**

가져오기 `type` 속성이 제공되었지만, 지정된 모듈은 다른 유형입니다.

### `ERR_IMPORT_ATTRIBUTE_UNSUPPORTED` {#err_import_attribute_unsupported}

**Added in: v21.0.0, v20.10.0, v18.19.0**

이 Node.js 버전에서는 가져오기 속성이 지원되지 않습니다.

### `ERR_INCOMPATIBLE_OPTION_PAIR` {#err_incompatible_option_pair}

옵션 쌍이 서로 호환되지 않아 동시에 사용할 수 없습니다.

### `ERR_INPUT_TYPE_NOT_ALLOWED` {#err_input_type_not_allowed}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

`--input-type` 플래그가 파일을 실행하려고 시도하는 데 사용되었습니다. 이 플래그는 `--eval`, `--print` 또는 `STDIN`을 통한 입력에만 사용할 수 있습니다.

### `ERR_INSPECTOR_ALREADY_ACTIVATED` {#err_inspector_already_activated}

`node:inspector` 모듈을 사용하는 동안, 인스펙터가 이미 포트에서 수신 대기하기 시작했을 때 활성화하려고 시도했습니다. 다른 주소에서 활성화하기 전에 `inspector.close()`를 사용하십시오.

### `ERR_INSPECTOR_ALREADY_CONNECTED` {#err_inspector_already_connected}

`node:inspector` 모듈을 사용하는 동안, 인스펙터가 이미 연결되었을 때 연결하려고 시도했습니다.

### `ERR_INSPECTOR_CLOSED` {#err_inspector_closed}

`node:inspector` 모듈을 사용하는 동안, 세션이 이미 닫힌 후 인스펙터를 사용하려고 시도했습니다.

### `ERR_INSPECTOR_COMMAND` {#err_inspector_command}

`node:inspector` 모듈을 통해 명령을 실행하는 동안 오류가 발생했습니다.

### `ERR_INSPECTOR_NOT_ACTIVE` {#err_inspector_not_active}

`inspector.waitForDebugger()`가 호출될 때 `inspector`가 활성화되지 않았습니다.

### `ERR_INSPECTOR_NOT_AVAILABLE` {#err_inspector_not_available}

`node:inspector` 모듈을 사용할 수 없습니다.

### `ERR_INSPECTOR_NOT_CONNECTED` {#err_inspector_not_connected}

`node:inspector` 모듈을 사용하는 동안, 인스펙터가 연결되기 전에 사용하려고 시도했습니다.

### `ERR_INSPECTOR_NOT_WORKER` {#err_inspector_not_worker}

워커 스레드에서만 사용할 수 있는 API가 메인 스레드에서 호출되었습니다.

### `ERR_INTERNAL_ASSERTION` {#err_internal_assertion}

Node.js에 버그가 있거나 Node.js 내부를 잘못 사용했습니다. 오류를 수정하려면 [https://github.com/nodejs/node/issues](https://github.com/nodejs/node/issues)에 문제를 여십시오.


### `ERR_INVALID_ADDRESS` {#err_invalid_address}

제공된 주소를 Node.js API가 이해하지 못합니다.

### `ERR_INVALID_ADDRESS_FAMILY` {#err_invalid_address_family}

제공된 주소 체계를 Node.js API가 이해하지 못합니다.

### `ERR_INVALID_ARG_TYPE` {#err_invalid_arg_type}

잘못된 유형의 인수가 Node.js API에 전달되었습니다.

### `ERR_INVALID_ARG_VALUE` {#err_invalid_arg_value}

주어진 인수에 대해 잘못되었거나 지원되지 않는 값이 전달되었습니다.

### `ERR_INVALID_ASYNC_ID` {#err_invalid_async_id}

잘못된 `asyncId` 또는 `triggerAsyncId`가 `AsyncHooks`를 사용하여 전달되었습니다. -1보다 작은 ID는 발생하지 않아야 합니다.

### `ERR_INVALID_BUFFER_SIZE` {#err_invalid_buffer_size}

`Buffer`에서 스왑이 수행되었지만 해당 크기가 작업과 호환되지 않았습니다.

### `ERR_INVALID_CHAR` {#err_invalid_char}

헤더에서 잘못된 문자가 감지되었습니다.

### `ERR_INVALID_CURSOR_POS` {#err_invalid_cursor_pos}

지정된 스트림의 커서를 지정된 열 없이 지정된 행으로 이동할 수 없습니다.

### `ERR_INVALID_FD` {#err_invalid_fd}

파일 설명자('fd')가 유효하지 않습니다 (예: 음수 값).

### `ERR_INVALID_FD_TYPE` {#err_invalid_fd_type}

파일 설명자('fd') 유형이 유효하지 않습니다.

### `ERR_INVALID_FILE_URL_HOST` {#err_invalid_file_url_host}

`file:` URL을 사용하는 Node.js API (예: [`fs`](/ko/nodejs/api/fs) 모듈의 특정 함수)에서 호환되지 않는 호스트를 가진 파일 URL을 발견했습니다. 이 상황은 `localhost` 또는 빈 호스트만 지원되는 Unix 계열 시스템에서만 발생할 수 있습니다.

### `ERR_INVALID_FILE_URL_PATH` {#err_invalid_file_url_path}

`file:` URL을 사용하는 Node.js API (예: [`fs`](/ko/nodejs/api/fs) 모듈의 특정 함수)에서 호환되지 않는 경로를 가진 파일 URL을 발견했습니다. 경로를 사용할 수 있는지 여부를 결정하는 정확한 의미 체계는 플랫폼에 따라 다릅니다.

### `ERR_INVALID_HANDLE_TYPE` {#err_invalid_handle_type}

IPC 통신 채널을 통해 자식 프로세스로 지원되지 않는 "핸들"을 보내려고 시도했습니다. 자세한 내용은 [`subprocess.send()`](/ko/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) 및 [`process.send()`](/ko/nodejs/api/process#processsendmessage-sendhandle-options-callback)를 참조하십시오.

### `ERR_INVALID_HTTP_TOKEN` {#err_invalid_http_token}

잘못된 HTTP 토큰이 제공되었습니다.

### `ERR_INVALID_IP_ADDRESS` {#err_invalid_ip_address}

IP 주소가 유효하지 않습니다.


### `ERR_INVALID_MIME_SYNTAX` {#err_invalid_mime_syntax}

MIME의 구문이 유효하지 않습니다.

### `ERR_INVALID_MODULE` {#err_invalid_module}

**Added in: v15.0.0, v14.18.0**

존재하지 않거나 유효하지 않은 모듈을 로드하려고 시도했습니다.

### `ERR_INVALID_MODULE_SPECIFIER` {#err_invalid_module_specifier}

가져온 모듈 문자열이 유효하지 않은 URL, 패키지 이름 또는 패키지 하위 경로 지정자입니다.

### `ERR_INVALID_OBJECT_DEFINE_PROPERTY` {#err_invalid_object_define_property}

객체의 속성에 유효하지 않은 속성을 설정하는 동안 오류가 발생했습니다.

### `ERR_INVALID_PACKAGE_CONFIG` {#err_invalid_package_config}

유효하지 않은 [`package.json`](/ko/nodejs/api/packages#nodejs-packagejson-field-definitions) 파일을 구문 분석하지 못했습니다.

### `ERR_INVALID_PACKAGE_TARGET` {#err_invalid_package_target}

`package.json` [`"exports"`](/ko/nodejs/api/packages#exports) 필드에 시도한 모듈 확인에 대한 유효하지 않은 대상 매핑 값이 포함되어 있습니다.

### `ERR_INVALID_PROTOCOL` {#err_invalid_protocol}

유효하지 않은 `options.protocol`이 `http.request()`에 전달되었습니다.

### `ERR_INVALID_REPL_EVAL_CONFIG` {#err_invalid_repl_eval_config}

[`REPL`](/ko/nodejs/api/repl) 구성에서 `breakEvalOnSigint` 및 `eval` 옵션이 모두 설정되었으며 이는 지원되지 않습니다.

### `ERR_INVALID_REPL_INPUT` {#err_invalid_repl_input}

입력을 [`REPL`](/ko/nodejs/api/repl)에서 사용할 수 없습니다. 이 오류가 사용되는 조건은 [`REPL`](/ko/nodejs/api/repl) 문서에 설명되어 있습니다.

### `ERR_INVALID_RETURN_PROPERTY` {#err_invalid_return_property}

함수 옵션이 실행 시 반환된 객체 속성 중 하나에 대해 유효한 값을 제공하지 않는 경우 발생합니다.

### `ERR_INVALID_RETURN_PROPERTY_VALUE` {#err_invalid_return_property_value}

함수 옵션이 실행 시 반환된 객체 속성 중 하나에 대해 예상되는 값 유형을 제공하지 않는 경우 발생합니다.

### `ERR_INVALID_RETURN_VALUE` {#err_invalid_return_value}

함수가 Promise를 반환해야 하는 경우와 같이 함수 옵션이 실행 시 예상되는 값 유형을 반환하지 않는 경우 발생합니다.

### `ERR_INVALID_STATE` {#err_invalid_state}

**Added in: v15.0.0**

유효하지 않은 상태로 인해 작업을 완료할 수 없음을 나타냅니다. 예를 들어 개체가 이미 소멸되었거나 다른 작업을 수행 중일 수 있습니다.

### `ERR_INVALID_SYNC_FORK_INPUT` {#err_invalid_sync_fork_input}

`Buffer`, `TypedArray`, `DataView` 또는 `string`이 비동기 포크에 대한 stdio 입력으로 제공되었습니다. 자세한 내용은 [`child_process`](/ko/nodejs/api/child_process) 모듈에 대한 문서를 참조하세요.


### `ERR_INVALID_THIS` {#err_invalid_this}

Node.js API 함수가 호환되지 않는 `this` 값으로 호출되었습니다.

```js [ESM]
const urlSearchParams = new URLSearchParams('foo=bar&baz=new');

const buf = Buffer.alloc(1);
urlSearchParams.has.call(buf, 'foo');
// 'ERR_INVALID_THIS' 코드가 있는 TypeError를 발생시킵니다.
```
### `ERR_INVALID_TUPLE` {#err_invalid_tuple}

[WHATWG](/ko/nodejs/api/url#the-whatwg-url-api) [`URLSearchParams` 생성자](/ko/nodejs/api/url#new-urlsearchparamsiterable)에 제공된 `iterable`의 요소가 `[name, value]` 튜플을 나타내지 않았습니다. 즉, 요소가 iterable이 아니거나 정확히 두 개의 요소로 구성되지 않은 경우입니다.

### `ERR_INVALID_TYPESCRIPT_SYNTAX` {#err_invalid_typescript_syntax}

**추가된 버전: v23.0.0**

제공된 TypeScript 구문이 유효하지 않거나 지원되지 않습니다. 이는 [타입 제거](/ko/nodejs/api/typescript#type-stripping)를 통해 변환이 필요한 TypeScript 구문을 사용할 때 발생할 수 있습니다.

### `ERR_INVALID_URI` {#err_invalid_uri}

잘못된 URI가 전달되었습니다.

### `ERR_INVALID_URL` {#err_invalid_url}

잘못된 URL이 [WHATWG](/ko/nodejs/api/url#the-whatwg-url-api) [`URL` 생성자](/ko/nodejs/api/url#new-urlinput-base) 또는 레거시 [`url.parse()`](/ko/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost)에 전달되어 구문 분석되었습니다. 발생된 오류 객체에는 일반적으로 구문 분석에 실패한 URL을 포함하는 추가 속성 `'input'`이 있습니다.

### `ERR_INVALID_URL_SCHEME` {#err_invalid_url_scheme}

특정 목적에 맞지 않는 스킴(프로토콜)의 URL을 사용하려고 시도했습니다. 이는 [`fs`](/ko/nodejs/api/fs) 모듈의 [WHATWG URL API](/ko/nodejs/api/url#the-whatwg-url-api) 지원에서만 사용되지만(파일 스킴 `'file'`이 있는 URL만 허용), 향후 다른 Node.js API에서도 사용될 수 있습니다.

### `ERR_IPC_CHANNEL_CLOSED` {#err_ipc_channel_closed}

이미 닫힌 IPC 통신 채널을 사용하려고 시도했습니다.

### `ERR_IPC_DISCONNECTED` {#err_ipc_disconnected}

이미 연결이 끊어진 IPC 통신 채널의 연결을 끊으려고 시도했습니다. 자세한 내용은 [`child_process`](/ko/nodejs/api/child_process) 모듈의 설명서를 참조하세요.

### `ERR_IPC_ONE_PIPE` {#err_ipc_one_pipe}

둘 이상의 IPC 통신 채널을 사용하여 자식 Node.js 프로세스를 만들려고 시도했습니다. 자세한 내용은 [`child_process`](/ko/nodejs/api/child_process) 모듈의 설명서를 참조하세요.


### `ERR_IPC_SYNC_FORK` {#err_ipc_sync_fork}

동기적으로 포크된 Node.js 프로세스와 IPC 통신 채널을 열려고 시도했습니다. 자세한 내용은 [`child_process`](/ko/nodejs/api/child_process) 모듈 문서를 참조하십시오.

### `ERR_IP_BLOCKED` {#err_ip_blocked}

IP가 `net.BlockList`에 의해 차단되었습니다.

### `ERR_LOADER_CHAIN_INCOMPLETE` {#err_loader_chain_incomplete}

**추가된 버전: v18.6.0, v16.17.0**

ESM 로더 후크가 `next()`를 호출하지 않고 명시적으로 단락을 알리지 않고 반환되었습니다.

### `ERR_LOAD_SQLITE_EXTENSION` {#err_load_sqlite_extension}

**추가된 버전: v23.5.0**

SQLite 확장 프로그램을 로드하는 동안 오류가 발생했습니다.

### `ERR_MEMORY_ALLOCATION_FAILED` {#err_memory_allocation_failed}

메모리 할당 시도(일반적으로 C++ 레이어에서)가 실패했습니다.

### `ERR_MESSAGE_TARGET_CONTEXT_UNAVAILABLE` {#err_message_target_context_unavailable}

**추가된 버전: v14.5.0, v12.19.0**

[`MessagePort`](/ko/nodejs/api/worker_threads#class-messageport)로 게시된 메시지를 대상 [vm](/ko/nodejs/api/vm) `Context`에서 역직렬화할 수 없습니다. 모든 Node.js 객체를 현재 모든 컨텍스트에서 성공적으로 인스턴스화할 수 있는 것은 아니며, 이 경우 `postMessage()`를 사용하여 전송하려고 하면 수신 측에서 실패할 수 있습니다.

### `ERR_METHOD_NOT_IMPLEMENTED` {#err_method_not_implemented}

메서드가 필요하지만 구현되지 않았습니다.

### `ERR_MISSING_ARGS` {#err_missing_args}

Node.js API의 필수 인수가 전달되지 않았습니다. 이는 API 사양을 엄격히 준수하기 위해서만 사용됩니다(일부 경우에는 `func(undefined)`는 허용하지만 `func()`는 허용하지 않을 수 있음). 대부분의 네이티브 Node.js API에서 `func(undefined)`와 `func()`는 동일하게 처리되며, 대신 [`ERR_INVALID_ARG_TYPE`](/ko/nodejs/api/errors#err-invalid-arg-type) 오류 코드가 사용될 수 있습니다.

### `ERR_MISSING_OPTION` {#err_missing_option}

옵션 객체를 허용하는 API의 경우 일부 옵션은 필수일 수 있습니다. 필수 옵션이 누락된 경우 이 코드가 발생합니다.

### `ERR_MISSING_PASSPHRASE` {#err_missing_passphrase}

암호 구문을 지정하지 않고 암호화된 키를 읽으려고 시도했습니다.

### `ERR_MISSING_PLATFORM_FOR_WORKER` {#err_missing_platform_for_worker}

이 Node.js 인스턴스에서 사용하는 V8 플랫폼은 Worker 생성을 지원하지 않습니다. 이는 Worker에 대한 임베더 지원 부족으로 인해 발생합니다. 특히 이 오류는 Node.js의 표준 빌드에서는 발생하지 않습니다.


### `ERR_MODULE_NOT_FOUND` {#err_module_not_found}

`import` 작업이나 프로그램 진입점을 로드하는 동안 ECMAScript 모듈 로더가 모듈 파일을 확인할 수 없습니다.

### `ERR_MULTIPLE_CALLBACK` {#err_multiple_callback}

콜백이 두 번 이상 호출되었습니다.

콜백은 쿼리가 충족되거나 거부될 수 있지만 동시에 둘 다 될 수 없으므로 거의 항상 한 번만 호출되도록 되어 있습니다. 후자는 콜백을 두 번 이상 호출하면 가능합니다.

### `ERR_NAPI_CONS_FUNCTION` {#err_napi_cons_function}

`Node-API`를 사용하는 동안 전달된 생성자가 함수가 아니었습니다.

### `ERR_NAPI_INVALID_DATAVIEW_ARGS` {#err_napi_invalid_dataview_args}

`napi_create_dataview()`를 호출하는 동안 주어진 `offset`이 데이터 뷰의 범위를 벗어나거나 `offset + length`가 주어진 `buffer`의 길이보다 컸습니다.

### `ERR_NAPI_INVALID_TYPEDARRAY_ALIGNMENT` {#err_napi_invalid_typedarray_alignment}

`napi_create_typedarray()`를 호출하는 동안 제공된 `offset`이 요소 크기의 배수가 아니었습니다.

### `ERR_NAPI_INVALID_TYPEDARRAY_LENGTH` {#err_napi_invalid_typedarray_length}

`napi_create_typedarray()`를 호출하는 동안 `(length * size_of_element) + byte_offset`이 주어진 `buffer`의 길이보다 컸습니다.

### `ERR_NAPI_TSFN_CALL_JS` {#err_napi_tsfn_call_js}

스레드 안전 함수의 JavaScript 부분을 호출하는 동안 오류가 발생했습니다.

### `ERR_NAPI_TSFN_GET_UNDEFINED` {#err_napi_tsfn_get_undefined}

JavaScript `undefined` 값을 검색하는 동안 오류가 발생했습니다.

### `ERR_NON_CONTEXT_AWARE_DISABLED` {#err_non_context_aware_disabled}

컨텍스트를 인식하지 못하는 네이티브 애드온이 컨텍스트를 허용하지 않는 프로세스에서 로드되었습니다.

### `ERR_NOT_BUILDING_SNAPSHOT` {#err_not_building_snapshot}

Node.js가 V8 시작 스냅샷을 빌드하지 않는데도 V8 시작 스냅샷을 빌드할 때만 사용할 수 있는 작업을 사용하려고 시도했습니다.

### `ERR_NOT_IN_SINGLE_EXECUTABLE_APPLICATION` {#err_not_in_single_executable_application}

**추가된 버전: v21.7.0, v20.12.0**

단일 실행 파일 애플리케이션이 아닌 경우 작업을 수행할 수 없습니다.

### `ERR_NOT_SUPPORTED_IN_SNAPSHOT` {#err_not_supported_in_snapshot}

시작 스냅샷을 빌드할 때 지원되지 않는 작업을 수행하려고 시도했습니다.

### `ERR_NO_CRYPTO` {#err_no_crypto}

Node.js가 OpenSSL 암호화 지원으로 컴파일되지 않았는데도 암호화 기능을 사용하려고 시도했습니다.


### `ERR_NO_ICU` {#err_no_icu}

[ICU](/ko/nodejs/api/intl#internationalization-support)를 필요로 하는 기능을 사용하려고 시도했지만 Node.js가 ICU 지원으로 컴파일되지 않았습니다.

### `ERR_NO_TYPESCRIPT` {#err_no_typescript}

**추가됨: v23.0.0**

[네이티브 TypeScript 지원](/ko/nodejs/api/typescript#type-stripping)을 필요로 하는 기능을 사용하려고 시도했지만 Node.js가 TypeScript 지원으로 컴파일되지 않았습니다.

### `ERR_OPERATION_FAILED` {#err_operation_failed}

**추가됨: v15.0.0**

작업이 실패했습니다. 일반적으로 비동기 작업의 일반적인 실패를 알리는 데 사용됩니다.

### `ERR_OUT_OF_RANGE` {#err_out_of_range}

주어진 값이 허용된 범위를 벗어났습니다.

### `ERR_PACKAGE_IMPORT_NOT_DEFINED` {#err_package_import_not_defined}

`package.json` [`"imports"`](/ko/nodejs/api/packages#imports) 필드에 주어진 내부 패키지 지정자 매핑이 정의되어 있지 않습니다.

### `ERR_PACKAGE_PATH_NOT_EXPORTED` {#err_package_path_not_exported}

`package.json` [`"exports"`](/ko/nodejs/api/packages#exports) 필드에 요청된 하위 경로가 내보내지지 않았습니다. 내보내기는 캡슐화되어 있기 때문에 절대 URL을 사용하지 않는 한 내보내지지 않은 개인 내부 모듈은 패키지 분석을 통해 가져올 수 없습니다.

### `ERR_PARSE_ARGS_INVALID_OPTION_VALUE` {#err_parse_args_invalid_option_value}

**추가됨: v18.3.0, v16.17.0**

`strict`가 `true`로 설정된 경우, [\<문자열\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 유형의 옵션에 대해 [\<부울\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 값이 제공되거나, [\<부울\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 유형의 옵션에 대해 [\<문자열\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 값이 제공되는 경우 [`util.parseArgs()`](/ko/nodejs/api/util#utilparseargsconfig)에 의해 발생합니다.

### `ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL` {#err_parse_args_unexpected_positional}

**추가됨: v18.3.0, v16.17.0**

위치 인수가 제공되고 `allowPositionals`가 `false`로 설정된 경우 [`util.parseArgs()`](/ko/nodejs/api/util#utilparseargsconfig)에 의해 발생합니다.

### `ERR_PARSE_ARGS_UNKNOWN_OPTION` {#err_parse_args_unknown_option}

**추가됨: v18.3.0, v16.17.0**

`strict`가 `true`로 설정된 경우, `options`에 인수가 구성되지 않은 경우 [`util.parseArgs()`](/ko/nodejs/api/util#utilparseargsconfig)에 의해 발생합니다.


### `ERR_PERFORMANCE_INVALID_TIMESTAMP` {#err_performance_invalid_timestamp}

유효하지 않은 타임스탬프 값이 성능 마크 또는 측정에 제공되었습니다.

### `ERR_PERFORMANCE_MEASURE_INVALID_OPTIONS` {#err_performance_measure_invalid_options}

유효하지 않은 옵션이 성능 측정에 제공되었습니다.

### `ERR_PROTO_ACCESS` {#err_proto_access}

`Object.prototype.__proto__`에 접근하는 것은 [`--disable-proto=throw`](/ko/nodejs/api/cli#--disable-protomode)를 사용하여 금지되었습니다. [`Object.getPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) 및 [`Object.setPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)는 객체의 프로토타입을 가져오고 설정하는 데 사용해야 합니다.

### `ERR_QUIC_APPLICATION_ERROR` {#err_quic_application_error}

**추가된 버전: v23.4.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

QUIC 애플리케이션 오류가 발생했습니다.

### `ERR_QUIC_CONNECTION_FAILED` {#err_quic_connection_failed}

**추가된 버전: v23.0.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

QUIC 연결 설정에 실패했습니다.

### `ERR_QUIC_ENDPOINT_CLOSED` {#err_quic_endpoint_closed}

**추가된 버전: v23.0.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

QUIC 엔드포인트가 오류와 함께 종료되었습니다.

### `ERR_QUIC_OPEN_STREAM_FAILED` {#err_quic_open_stream_failed}

**추가된 버전: v23.0.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

QUIC 스트림 열기에 실패했습니다.

### `ERR_QUIC_TRANSPORT_ERROR` {#err_quic_transport_error}

**추가된 버전: v23.4.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

QUIC 전송 오류가 발생했습니다.

### `ERR_QUIC_VERSION_NEGOTIATION_ERROR` {#err_quic_version_negotiation_error}

**추가된 버전: v23.4.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

버전 협상이 필요하기 때문에 QUIC 세션에 실패했습니다.


### `ERR_REQUIRE_ASYNC_MODULE` {#err_require_async_module}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

[ES Module](/ko/nodejs/api/esm)을 `require()`하려고 할 때, 해당 모듈이 비동기인 것으로 밝혀졌습니다. 즉, 최상위 await를 포함합니다.

최상위 await가 어디에 있는지 확인하려면 `--experimental-print-required-tla`를 사용하십시오 (최상위 await를 찾기 전에 모듈을 실행합니다).

### `ERR_REQUIRE_CYCLE_MODULE` {#err_require_cycle_module}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

[ES Module](/ko/nodejs/api/esm)을 `require()`하려고 할 때, CommonJS에서 ESM으로 또는 ESM에서 CommonJS로의 엣지가 즉각적인 순환에 참여합니다. ES 모듈은 이미 평가 중인 동안에는 평가할 수 없으므로 이는 허용되지 않습니다.

순환을 피하려면 순환에 관련된 `require()` 호출이 ES 모듈 (via `createRequire()`) 또는 CommonJS 모듈의 최상위에서 발생하지 않아야 하며 내부 함수에서 지연적으로 수행되어야 합니다.

### `ERR_REQUIRE_ESM` {#err_require_esm}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | require()는 이제 기본적으로 동기 ES 모듈 로드를 지원합니다. |
:::

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 더 이상 사용되지 않음
:::

[ES Module](/ko/nodejs/api/esm)을 `require()`하려는 시도가 있었습니다.

`require()`가 이제 동기 ES 모듈 로드를 지원하므로 이 오류는 더 이상 사용되지 않습니다. `require()`가 최상위 `await`를 포함하는 ES 모듈을 발견하면 대신 [`ERR_REQUIRE_ASYNC_MODULE`](/ko/nodejs/api/errors#err_require_async_module)을 발생시킵니다.

### `ERR_SCRIPT_EXECUTION_INTERRUPTED` {#err_script_execution_interrupted}

스크립트 실행이 `SIGINT`에 의해 중단되었습니다. (예: + 키를 누름)

### `ERR_SCRIPT_EXECUTION_TIMEOUT` {#err_script_execution_timeout}

스크립트 실행 시간이 초과되었습니다. 실행 중인 스크립트에 버그가 있을 수 있습니다.

### `ERR_SERVER_ALREADY_LISTEN` {#err_server_already_listen}

`net.Server`가 이미 수신 중인 동안 [`server.listen()`](/ko/nodejs/api/net#serverlisten) 메서드가 호출되었습니다. 이는 HTTP, HTTPS 및 HTTP/2 `Server` 인스턴스를 포함한 `net.Server`의 모든 인스턴스에 적용됩니다.


### `ERR_SERVER_NOT_RUNNING` {#err_server_not_running}

`net.Server`가 실행되고 있지 않을 때 [`server.close()`](/ko/nodejs/api/net#serverclosecallback) 메서드가 호출되었습니다. 이는 HTTP, HTTPS 및 HTTP/2 `Server` 인스턴스를 포함한 모든 `net.Server` 인스턴스에 적용됩니다.

### `ERR_SINGLE_EXECUTABLE_APPLICATION_ASSET_NOT_FOUND` {#err_single_executable_application_asset_not_found}

**다음 버전부터 추가됨: v21.7.0, v20.12.0**

단일 실행 파일 애플리케이션 API에 자산을 식별하기 위한 키가 전달되었지만 일치하는 항목을 찾을 수 없습니다.

### `ERR_SOCKET_ALREADY_BOUND` {#err_socket_already_bound}

이미 바인딩된 소켓을 바인딩하려는 시도가 있었습니다.

### `ERR_SOCKET_BAD_BUFFER_SIZE` {#err_socket_bad_buffer_size}

[`dgram.createSocket()`](/ko/nodejs/api/dgram#dgramcreatesocketoptions-callback)에서 `recvBufferSize` 또는 `sendBufferSize` 옵션에 유효하지 않은 (음수) 크기가 전달되었습니다.

### `ERR_SOCKET_BAD_PORT` {#err_socket_bad_port}

\>= 0 및 \< 65536 포트를 예상하는 API 함수가 유효하지 않은 값을 받았습니다.

### `ERR_SOCKET_BAD_TYPE` {#err_socket_bad_type}

소켓 유형(`udp4` 또는 `udp6`)을 예상하는 API 함수가 유효하지 않은 값을 받았습니다.

### `ERR_SOCKET_BUFFER_SIZE` {#err_socket_buffer_size}

[`dgram.createSocket()`](/ko/nodejs/api/dgram#dgramcreatesocketoptions-callback)를 사용하는 동안 수신 또는 송신 `Buffer`의 크기를 확인할 수 없습니다.

### `ERR_SOCKET_CLOSED` {#err_socket_closed}

이미 닫힌 소켓에서 작업을 시도했습니다.

### `ERR_SOCKET_CLOSED_BEFORE_CONNECTION` {#err_socket_closed_before_connection}

연결 중인 소켓에서 [`net.Socket.write()`](/ko/nodejs/api/net#socketwritedata-encoding-callback)를 호출하고 연결이 설정되기 전에 소켓이 닫혔습니다.

### `ERR_SOCKET_CONNECTION_TIMEOUT` {#err_socket_connection_timeout}

소켓이 패밀리 자동 선택 알고리즘을 사용할 때 허용된 시간 초과 내에 DNS에서 반환된 주소에 연결할 수 없습니다.

### `ERR_SOCKET_DGRAM_IS_CONNECTED` {#err_socket_dgram_is_connected}

이미 연결된 소켓에서 [`dgram.connect()`](/ko/nodejs/api/dgram#socketconnectport-address-callback) 호출이 이루어졌습니다.

### `ERR_SOCKET_DGRAM_NOT_CONNECTED` {#err_socket_dgram_not_connected}

연결이 끊긴 소켓에서 [`dgram.disconnect()`](/ko/nodejs/api/dgram#socketdisconnect) 또는 [`dgram.remoteAddress()`](/ko/nodejs/api/dgram#socketremoteaddress) 호출이 이루어졌습니다.

### `ERR_SOCKET_DGRAM_NOT_RUNNING` {#err_socket_dgram_not_running}

호출이 이루어졌지만 UDP 서브시스템이 실행되고 있지 않습니다.


### `ERR_SOURCE_MAP_CORRUPT` {#err_source_map_corrupt}

소스 맵이 존재하지 않거나 손상되어 구문 분석할 수 없습니다.

### `ERR_SOURCE_MAP_MISSING_SOURCE` {#err_source_map_missing_source}

소스 맵에서 가져온 파일을 찾을 수 없습니다.

### `ERR_SQLITE_ERROR` {#err_sqlite_error}

**추가된 버전: v22.5.0**

[SQLite](/ko/nodejs/api/sqlite)에서 오류가 반환되었습니다.

### `ERR_SRI_PARSE` {#err_sri_parse}

Subresource Integrity 검사를 위해 문자열이 제공되었지만 구문 분석할 수 없었습니다. [Subresource Integrity 사양](https://www.w3.org/TR/SRI/#the-integrity-attribute)을 참조하여 integrity 속성의 형식을 확인하십시오.

### `ERR_STREAM_ALREADY_FINISHED` {#err_stream_already_finished}

스트림이 완료되었기 때문에 완료할 수 없는 스트림 메서드가 호출되었습니다.

### `ERR_STREAM_CANNOT_PIPE` {#err_stream_cannot_pipe}

[`Writable`](/ko/nodejs/api/stream#class-streamwritable) 스트림에서 [`stream.pipe()`](/ko/nodejs/api/stream#readablepipedestination-options)를 호출하려고 시도했습니다.

### `ERR_STREAM_DESTROYED` {#err_stream_destroyed}

`stream.destroy()`를 사용하여 스트림이 파괴되었기 때문에 완료할 수 없는 스트림 메서드가 호출되었습니다.

### `ERR_STREAM_NULL_VALUES` {#err_stream_null_values}

`null` 청크로 [`stream.write()`](/ko/nodejs/api/stream#writablewritechunk-encoding-callback)를 호출하려고 시도했습니다.

### `ERR_STREAM_PREMATURE_CLOSE` {#err_stream_premature_close}

스트림 또는 파이프라인이 명시적인 오류 없이 정상적으로 종료되지 않을 때 `stream.finished()` 및 `stream.pipeline()`에서 반환되는 오류입니다.

### `ERR_STREAM_PUSH_AFTER_EOF` {#err_stream_push_after_eof}

스트림에 `null`(EOF)이 푸시된 후 [`stream.push()`](/ko/nodejs/api/stream#readablepushchunk-encoding)를 호출하려고 시도했습니다.

### `ERR_STREAM_UNABLE_TO_PIPE` {#err_stream_unable_to_pipe}

파이프라인에서 닫히거나 파괴된 스트림으로 파이프하려고 시도했습니다.

### `ERR_STREAM_UNSHIFT_AFTER_END_EVENT` {#err_stream_unshift_after_end_event}

`'end'` 이벤트가 발생한 후 [`stream.unshift()`](/ko/nodejs/api/stream#readableunshiftchunk-encoding)를 호출하려고 시도했습니다.

### `ERR_STREAM_WRAP` {#err_stream_wrap}

Socket에 문자열 디코더가 설정되었거나 디코더가 `objectMode`에 있는 경우 중단을 방지합니다.

```js [ESM]
const Socket = require('node:net').Socket;
const instance = new Socket();

instance.setEncoding('utf8');
```


### `ERR_STREAM_WRITE_AFTER_END` {#err_stream_write_after_end}

`stream.end()`가 호출된 후 [`stream.write()`](/ko/nodejs/api/stream#writablewritechunk-encoding-callback)를 호출하려는 시도가 있었습니다.

### `ERR_STRING_TOO_LONG` {#err_string_too_long}

허용된 최대 길이보다 긴 문자열을 생성하려는 시도가 있었습니다.

### `ERR_SYNTHETIC` {#err_synthetic}

진단 보고서를 위해 호출 스택을 캡처하는 데 사용되는 인공 오류 객체입니다.

### `ERR_SYSTEM_ERROR` {#err_system_error}

Node.js 프로세스 내에서 지정되지 않았거나 구체적이지 않은 시스템 오류가 발생했습니다. 오류 객체에는 추가 정보가 포함된 `err.info` 객체 속성이 있습니다.

### `ERR_TAP_LEXER_ERROR` {#err_tap_lexer_error}

실패한 렉서 상태를 나타내는 오류입니다.

### `ERR_TAP_PARSER_ERROR` {#err_tap_parser_error}

실패한 파서 상태를 나타내는 오류입니다. 오류를 유발한 토큰에 대한 추가 정보는 `cause` 속성을 통해 사용할 수 있습니다.

### `ERR_TAP_VALIDATION_ERROR` {#err_tap_validation_error}

이 오류는 실패한 TAP 유효성 검사를 나타냅니다.

### `ERR_TEST_FAILURE` {#err_test_failure}

이 오류는 실패한 테스트를 나타냅니다. 실패에 대한 추가 정보는 `cause` 속성을 통해 사용할 수 있습니다. `failureType` 속성은 실패가 발생했을 때 테스트가 무엇을 하고 있었는지 지정합니다.

### `ERR_TLS_ALPN_CALLBACK_INVALID_RESULT` {#err_tls_alpn_callback_invalid_result}

이 오류는 `ALPNCallback`이 클라이언트가 제공한 ALPN 프로토콜 목록에 없는 값을 반환할 때 발생합니다.

### `ERR_TLS_ALPN_CALLBACK_WITH_PROTOCOLS` {#err_tls_alpn_callback_with_protocols}

이 오류는 TLS 옵션에 `ALPNProtocols`와 `ALPNCallback`이 모두 포함된 경우 `TLSServer`를 생성할 때 발생합니다. 이러한 옵션은 상호 배타적입니다.

### `ERR_TLS_CERT_ALTNAME_FORMAT` {#err_tls_cert_altname_format}

이 오류는 사용자 제공 `subjectaltname` 속성이 인코딩 규칙을 위반하는 경우 `checkServerIdentity`에 의해 발생합니다. Node.js 자체에서 생성된 인증서 객체는 항상 인코딩 규칙을 준수하므로 이 오류가 발생하지 않습니다.

### `ERR_TLS_CERT_ALTNAME_INVALID` {#err_tls_cert_altname_invalid}

TLS를 사용하는 동안 피어의 호스트 이름/IP가 인증서의 `subjectAltNames`와 일치하지 않았습니다.

### `ERR_TLS_DH_PARAM_SIZE` {#err_tls_dh_param_size}

TLS를 사용하는 동안 Diffie-Hellman(`DH`) 키 합의 프로토콜에 제공된 매개변수가 너무 작습니다. 기본적으로 키 길이는 취약점을 방지하기 위해 1024비트 이상이어야 하지만 더 강력한 보안을 위해 2048비트 이상을 사용하는 것이 좋습니다.


### `ERR_TLS_HANDSHAKE_TIMEOUT` {#err_tls_handshake_timeout}

TLS/SSL 핸드셰이크 시간이 초과되었습니다. 이 경우 서버도 연결을 중단해야 합니다.

### `ERR_TLS_INVALID_CONTEXT` {#err_tls_invalid_context}

**Added in: v13.3.0**

컨텍스트는 `SecureContext`여야 합니다.

### `ERR_TLS_INVALID_PROTOCOL_METHOD` {#err_tls_invalid_protocol_method}

지정된 `secureProtocol` 메서드가 유효하지 않습니다. 알 수 없거나 보안에 취약하여 비활성화되었습니다.

### `ERR_TLS_INVALID_PROTOCOL_VERSION` {#err_tls_invalid_protocol_version}

유효한 TLS 프로토콜 버전은 `'TLSv1'`, `'TLSv1.1'`, 또는 `'TLSv1.2'`입니다.

### `ERR_TLS_INVALID_STATE` {#err_tls_invalid_state}

**Added in: v13.10.0, v12.17.0**

TLS 소켓이 연결되어 보안이 설정되어야 합니다. 계속하기 전에 'secure' 이벤트가 발생하는지 확인하십시오.

### `ERR_TLS_PROTOCOL_VERSION_CONFLICT` {#err_tls_protocol_version_conflict}

TLS 프로토콜 `minVersion` 또는 `maxVersion`을 설정하려는 시도가 `secureProtocol`을 명시적으로 설정하려는 시도와 충돌합니다. 하나의 메커니즘만 사용하십시오.

### `ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED` {#err_tls_psk_set_identity_hint_failed}

PSK ID 힌트 설정에 실패했습니다. 힌트가 너무 길 수 있습니다.

### `ERR_TLS_RENEGOTIATION_DISABLED` {#err_tls_renegotiation_disabled}

재협상이 비활성화된 소켓 인스턴스에서 TLS를 재협상하려는 시도가 있었습니다.

### `ERR_TLS_REQUIRED_SERVER_NAME` {#err_tls_required_server_name}

TLS를 사용하는 동안 `server.addContext()` 메서드가 첫 번째 매개변수에 호스트 이름을 제공하지 않고 호출되었습니다.

### `ERR_TLS_SESSION_ATTACK` {#err_tls_session_attack}

과도한 양의 TLS 재협상이 감지되었으며, 이는 서비스 거부 공격의 잠재적인 벡터입니다.

### `ERR_TLS_SNI_FROM_SERVER` {#err_tls_sni_from_server}

TLS 서버 측 소켓에서 서버 이름 표시를 발행하려는 시도가 있었습니다. 이는 클라이언트에서만 유효합니다.

### `ERR_TRACE_EVENTS_CATEGORY_REQUIRED` {#err_trace_events_category_required}

`trace_events.createTracing()` 메서드에는 하나 이상의 추적 이벤트 범주가 필요합니다.

### `ERR_TRACE_EVENTS_UNAVAILABLE` {#err_trace_events_unavailable}

Node.js가 `--without-v8-platform` 플래그로 컴파일되었기 때문에 `node:trace_events` 모듈을 로드할 수 없습니다.

### `ERR_TRANSFORM_ALREADY_TRANSFORMING` {#err_transform_already_transforming}

`Transform` 스트림이 변환 중인 동안 완료되었습니다.

### `ERR_TRANSFORM_WITH_LENGTH_0` {#err_transform_with_length_0}

`Transform` 스트림이 쓰기 버퍼에 데이터가 남아 있는 상태로 완료되었습니다.


### `ERR_TTY_INIT_FAILED` {#err_tty_init_failed}

시스템 오류로 인해 TTY 초기화에 실패했습니다.

### `ERR_UNAVAILABLE_DURING_EXIT` {#err_unavailable_during_exit}

[`process.on('exit')`](/ko/nodejs/api/process#event-exit) 핸들러 내에서 호출되어서는 안 되는 함수가 [`process.on('exit')`](/ko/nodejs/api/process#event-exit) 핸들러 내에서 호출되었습니다.

### `ERR_UNCAUGHT_EXCEPTION_CAPTURE_ALREADY_SET` {#err_uncaught_exception_capture_already_set}

[`process.setUncaughtExceptionCaptureCallback()`](/ko/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn)이 콜백을 먼저 `null`로 재설정하지 않고 두 번 호출되었습니다.

이 오류는 다른 모듈에서 등록된 콜백을 실수로 덮어쓰는 것을 방지하기 위해 설계되었습니다.

### `ERR_UNESCAPED_CHARACTERS` {#err_unescaped_characters}

이스케이프되지 않은 문자가 포함된 문자열이 수신되었습니다.

### `ERR_UNHANDLED_ERROR` {#err_unhandled_error}

처리되지 않은 오류가 발생했습니다 (예: [`EventEmitter`](/ko/nodejs/api/events#class-eventemitter)에서 `'error'` 이벤트가 발생했지만 `'error'` 핸들러가 등록되지 않은 경우).

### `ERR_UNKNOWN_BUILTIN_MODULE` {#err_unknown_builtin_module}

일반적으로 사용자 코드로 인해 트리거되어서는 안 되는 특정 종류의 내부 Node.js 오류를 식별하는 데 사용됩니다. 이 오류의 인스턴스는 Node.js 바이너리 자체 내의 내부 버그를 가리킵니다.

### `ERR_UNKNOWN_CREDENTIAL` {#err_unknown_credential}

존재하지 않는 Unix 그룹 또는 사용자 식별자가 전달되었습니다.

### `ERR_UNKNOWN_ENCODING` {#err_unknown_encoding}

API에 잘못되었거나 알 수 없는 인코딩 옵션이 전달되었습니다.

### `ERR_UNKNOWN_FILE_EXTENSION` {#err_unknown_file_extension}

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

알 수 없거나 지원되지 않는 파일 확장명을 가진 모듈을 로드하려고 했습니다.

### `ERR_UNKNOWN_MODULE_FORMAT` {#err_unknown_module_format}

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

알 수 없거나 지원되지 않는 형식을 가진 모듈을 로드하려고 했습니다.

### `ERR_UNKNOWN_SIGNAL` {#err_unknown_signal}

유효한 신호를 기대하는 API (예: [`subprocess.kill()`](/ko/nodejs/api/child_process#subprocesskillsignal))에 잘못되었거나 알 수 없는 프로세스 신호가 전달되었습니다.


### `ERR_UNSUPPORTED_DIR_IMPORT` {#err_unsupported_dir_import}

디렉터리 URL을 `import`하는 것은 지원되지 않습니다. 대신, [이름을 사용하여 패키지를 자체 참조](/ko/nodejs/api/packages#self-referencing-a-package-using-its-name)하고 [`package.json`](/ko/nodejs/api/packages#nodejs-packagejson-field-definitions) 파일의 [`"exports"`](/ko/nodejs/api/packages#exports) 필드에서 [사용자 정의 하위 경로를 정의](/ko/nodejs/api/packages#subpath-exports)하세요.

```js [ESM]
import './'; // 지원되지 않음
import './index.js'; // 지원됨
import 'package-name'; // 지원됨
```
### `ERR_UNSUPPORTED_ESM_URL_SCHEME` {#err_unsupported_esm_url_scheme}

`file` 및 `data` 이외의 URL 체계를 사용하는 `import`는 지원되지 않습니다.

### `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING` {#err_unsupported_node_modules_type_stripping}

**추가됨: v22.6.0**

타입 제거는 `node_modules` 디렉터리의 하위 파일에 대해 지원되지 않습니다.

### `ERR_UNSUPPORTED_RESOLVE_REQUEST` {#err_unsupported_resolve_request}

잘못된 모듈 참조자를 확인하려는 시도가 있었습니다. 이는 다음 중 하나를 사용하여 `import`하거나 `import.meta.resolve()`를 호출할 때 발생할 수 있습니다.

- URL 체계가 `file`이 아닌 모듈에서 빌트인 모듈이 아닌 베어 스펙 지정자.
- URL 체계가 [특수 체계](https://url.spec.whatwg.org/#special-scheme)가 아닌 모듈의 [상대 URL](https://url.spec.whatwg.org/#relative-url-string).

```js [ESM]
try {
  // `data:` URL 모듈에서 'bare-specifier' 패키지를 import하려고 합니다.
  await import('data:text/javascript,import "bare-specifier"');
} catch (e) {
  console.log(e.code); // ERR_UNSUPPORTED_RESOLVE_REQUEST
}
```
### `ERR_USE_AFTER_CLOSE` {#err_use_after_close}

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

이미 닫힌 것을 사용하려는 시도가 있었습니다.

### `ERR_VALID_PERFORMANCE_ENTRY_TYPE` {#err_valid_performance_entry_type}

Performance Timing API(`perf_hooks`)를 사용하는 동안 유효한 성능 항목 유형이 발견되지 않았습니다.

### `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING` {#err_vm_dynamic_import_callback_missing}

동적 import 콜백이 지정되지 않았습니다.

### `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG` {#err_vm_dynamic_import_callback_missing_flag}

`--experimental-vm-modules` 없이 동적 import 콜백이 호출되었습니다.


### `ERR_VM_MODULE_ALREADY_LINKED` {#err_vm_module_already_linked}

연결하려는 모듈이 다음 이유 중 하나로 인해 연결할 수 없습니다.

- 이미 연결되었습니다 (`linkingStatus`가 `'linked'`임).
- 연결 중입니다 (`linkingStatus`가 `'linking'`임).
- 이 모듈에 대한 연결이 실패했습니다 (`linkingStatus`가 `'errored'`임).

### `ERR_VM_MODULE_CACHED_DATA_REJECTED` {#err_vm_module_cached_data_rejected}

모듈 생성자에 전달된 `cachedData` 옵션이 유효하지 않습니다.

### `ERR_VM_MODULE_CANNOT_CREATE_CACHED_DATA` {#err_vm_module_cannot_create_cached_data}

이미 평가된 모듈에 대해서는 캐시된 데이터를 생성할 수 없습니다.

### `ERR_VM_MODULE_DIFFERENT_CONTEXT` {#err_vm_module_different_context}

링커 함수에서 반환되는 모듈이 부모 모듈과 다른 컨텍스트에 있습니다. 연결된 모듈은 동일한 컨텍스트를 공유해야 합니다.

### `ERR_VM_MODULE_LINK_FAILURE` {#err_vm_module_link_failure}

오류로 인해 모듈을 연결할 수 없습니다.

### `ERR_VM_MODULE_NOT_MODULE` {#err_vm_module_not_module}

연결 약속의 이행된 값이 `vm.Module` 객체가 아닙니다.

### `ERR_VM_MODULE_STATUS` {#err_vm_module_status}

현재 모듈의 상태가 이 작업을 허용하지 않습니다. 오류의 특정 의미는 특정 함수에 따라 다릅니다.

### `ERR_WASI_ALREADY_STARTED` {#err_wasi_already_started}

WASI 인스턴스가 이미 시작되었습니다.

### `ERR_WASI_NOT_STARTED` {#err_wasi_not_started}

WASI 인스턴스가 아직 시작되지 않았습니다.

### `ERR_WEBASSEMBLY_RESPONSE` {#err_webassembly_response}

**추가됨: v18.1.0**

`WebAssembly.compileStreaming` 또는 `WebAssembly.instantiateStreaming`에 전달된 `Response`가 유효한 WebAssembly 응답이 아닙니다.

### `ERR_WORKER_INIT_FAILED` {#err_worker_init_failed}

`Worker` 초기화에 실패했습니다.

### `ERR_WORKER_INVALID_EXEC_ARGV` {#err_worker_invalid_exec_argv}

`Worker` 생성자에 전달된 `execArgv` 옵션에 유효하지 않은 플래그가 포함되어 있습니다.

### `ERR_WORKER_MESSAGING_ERRORED` {#err_worker_messaging_errored}

**추가됨: v22.5.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::

대상 스레드가 [`postMessageToThread()`](/ko/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout)를 통해 전송된 메시지를 처리하는 동안 오류를 발생시켰습니다.


### `ERR_WORKER_MESSAGING_FAILED` {#err_worker_messaging_failed}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발 중
:::

[`postMessageToThread()`](/ko/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout)에서 요청된 스레드가 유효하지 않거나 `workerMessage` 리스너가 없습니다.

### `ERR_WORKER_MESSAGING_SAME_THREAD` {#err_worker_messaging_same_thread}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발 중
:::

[`postMessageToThread()`](/ko/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout)에서 요청된 스레드 ID가 현재 스레드 ID입니다.

### `ERR_WORKER_MESSAGING_TIMEOUT` {#err_worker_messaging_timeout}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발 중
:::

[`postMessageToThread()`](/ko/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout)를 통해 메시지를 보내는 데 시간이 초과되었습니다.

### `ERR_WORKER_NOT_RUNNING` {#err_worker_not_running}

`Worker` 인스턴스가 현재 실행 중이 아니기 때문에 작업이 실패했습니다.

### `ERR_WORKER_OUT_OF_MEMORY` {#err_worker_out_of_memory}

`Worker` 인스턴스가 메모리 제한에 도달하여 종료되었습니다.

### `ERR_WORKER_PATH` {#err_worker_path}

워커의 메인 스크립트 경로는 절대 경로도 아니고 `./` 또는 `../`로 시작하는 상대 경로도 아닙니다.

### `ERR_WORKER_UNSERIALIZABLE_ERROR` {#err_worker_unserializable_error}

워커 스레드에서 잡히지 않은 예외를 직렬화하려는 모든 시도가 실패했습니다.

### `ERR_WORKER_UNSUPPORTED_OPERATION` {#err_worker_unsupported_operation}

요청된 기능은 워커 스레드에서 지원되지 않습니다.

### `ERR_ZLIB_INITIALIZATION_FAILED` {#err_zlib_initialization_failed}

잘못된 구성으로 인해 [`zlib`](/ko/nodejs/api/zlib) 객체 생성이 실패했습니다.

### `HPE_CHUNK_EXTENSIONS_OVERFLOW` {#hpe_chunk_extensions_overflow}

**Added in: v21.6.2, v20.11.1, v18.19.1**

청크 확장자에 너무 많은 데이터가 수신되었습니다. 악성 또는 잘못 구성된 클라이언트를 보호하기 위해 16 KiB 이상의 데이터가 수신되면 이 코드가 포함된 `Error`가 발생합니다.


### `HPE_HEADER_OVERFLOW` {#hpe_header_overflow}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v11.4.0, v10.15.0 | `http_parser`의 최대 헤더 크기가 8KiB로 설정되었습니다. |
:::

너무 많은 HTTP 헤더 데이터가 수신되었습니다. 악성 클라이언트 또는 잘못 구성된 클라이언트로부터 보호하기 위해 `maxHeaderSize`보다 많은 HTTP 헤더 데이터가 수신되면 요청 또는 응답 객체를 생성하지 않고 HTTP 파싱이 중단되고 이 코드가 있는 `Error`가 발생합니다.

### `HPE_UNEXPECTED_CONTENT_LENGTH` {#hpe_unexpected_content_length}

서버가 `Content-Length` 헤더와 `Transfer-Encoding: chunked`를 모두 전송하고 있습니다.

`Transfer-Encoding: chunked`를 사용하면 서버가 동적으로 생성된 콘텐츠에 대해 HTTP 영구 연결을 유지할 수 있습니다. 이 경우 `Content-Length` HTTP 헤더를 사용할 수 없습니다.

`Content-Length` 또는 `Transfer-Encoding: chunked`를 사용하세요.

### `MODULE_NOT_FOUND` {#module_not_found}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v12.0.0 | `requireStack` 속성이 추가되었습니다. |
:::

[`require()`](/ko/nodejs/api/modules#requireid) 작업 또는 프로그램 진입점을 로드하는 동안 CommonJS 모듈 로더가 모듈 파일을 확인할 수 없습니다.

## 레거시 Node.js 오류 코드 {#legacy-nodejs-error-codes}

::: danger [안정성: 0 - 사용 중단됨]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 사용 중단됨. 이러한 오류 코드는 일관성이 없거나 제거되었습니다.
:::

### `ERR_CANNOT_TRANSFER_OBJECT` {#err_cannot_transfer_object}

**추가된 버전: v10.5.0**

**제거된 버전: v12.5.0**

`postMessage()`에 전달된 값에 전송을 지원하지 않는 객체가 포함되어 있습니다.

### `ERR_CPU_USAGE` {#err_cpu_usage}

**제거된 버전: v15.0.0**

`process.cpuUsage`의 네이티브 호출을 처리할 수 없습니다.

### `ERR_CRYPTO_HASH_DIGEST_NO_UTF16` {#err_crypto_hash_digest_no_utf16}

**추가된 버전: v9.0.0**

**제거된 버전: v12.12.0**

UTF-16 인코딩이 [`hash.digest()`](/ko/nodejs/api/crypto#hashdigestencoding)와 함께 사용되었습니다. `hash.digest()` 메서드는 `encoding` 인수를 전달하여 메서드가 `Buffer` 대신 문자열을 반환하도록 할 수 있지만 UTF-16 인코딩(예: `ucs` 또는 `utf16le`)은 지원되지 않습니다.


### `ERR_CRYPTO_SCRYPT_INVALID_PARAMETER` {#err_crypto_scrypt_invalid_parameter}

**제거됨: v23.0.0**

호환되지 않는 옵션 조합이 [`crypto.scrypt()`](/ko/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) 또는 [`crypto.scryptSync()`](/ko/nodejs/api/crypto#cryptoscryptsyncpassword-salt-keylen-options)에 전달되었습니다. Node.js의 새 버전에서는 다른 API와 일관성을 유지하기 위해 오류 코드 [`ERR_INCOMPATIBLE_OPTION_PAIR`](/ko/nodejs/api/errors#err_incompatible_option_pair)를 대신 사용합니다.

### `ERR_FS_INVALID_SYMLINK_TYPE` {#err_fs_invalid_symlink_type}

**제거됨: v23.0.0**

유효하지 않은 심볼릭 링크 유형이 [`fs.symlink()`](/ko/nodejs/api/fs#fssymlinktarget-path-type-callback) 또는 [`fs.symlinkSync()`](/ko/nodejs/api/fs#fssymlinksynctarget-path-type) 메서드에 전달되었습니다.

### `ERR_HTTP2_FRAME_ERROR` {#err_http2_frame_error}

**추가됨: v9.0.0**

**제거됨: v10.0.0**

HTTP/2 세션에서 개별 프레임을 보내는 데 실패했을 때 사용됩니다.

### `ERR_HTTP2_HEADERS_OBJECT` {#err_http2_headers_object}

**추가됨: v9.0.0**

**제거됨: v10.0.0**

HTTP/2 헤더 객체가 필요한 경우 사용됩니다.

### `ERR_HTTP2_HEADER_REQUIRED` {#err_http2_header_required}

**추가됨: v9.0.0**

**제거됨: v10.0.0**

필수 헤더가 HTTP/2 메시지에 없는 경우 사용됩니다.

### `ERR_HTTP2_INFO_HEADERS_AFTER_RESPOND` {#err_http2_info_headers_after_respond}

**추가됨: v9.0.0**

**제거됨: v10.0.0**

HTTP/2 정보 헤더는 `Http2Stream.prototype.respond()` 메서드를 호출하기 *전에만* 보내야 합니다.

### `ERR_HTTP2_STREAM_CLOSED` {#err_http2_stream_closed}

**추가됨: v9.0.0**

**제거됨: v10.0.0**

이미 닫힌 HTTP/2 스트림에서 작업이 수행된 경우 사용됩니다.

### `ERR_HTTP_INVALID_CHAR` {#err_http_invalid_char}

**추가됨: v9.0.0**

**제거됨: v10.0.0**

HTTP 응답 상태 메시지(이유 구절)에서 유효하지 않은 문자가 발견된 경우 사용됩니다.

### `ERR_IMPORT_ASSERTION_TYPE_FAILED` {#err_import_assertion_type_failed}

**추가됨: v17.1.0, v16.14.0**

**제거됨: v21.1.0**

가져오기 어설션이 실패하여 지정된 모듈을 가져올 수 없습니다.

### `ERR_IMPORT_ASSERTION_TYPE_MISSING` {#err_import_assertion_type_missing}

**추가됨: v17.1.0, v16.14.0**

**제거됨: v21.1.0**

가져오기 어설션이 누락되어 지정된 모듈을 가져올 수 없습니다.


### `ERR_IMPORT_ASSERTION_TYPE_UNSUPPORTED` {#err_import_assertion_type_unsupported}

**Added in: v17.1.0, v16.14.0**

**Removed in: v21.1.0**

가져오기 어설션이 이 Node.js 버전에서 지원되지 않습니다.

### `ERR_INDEX_OUT_OF_RANGE` {#err_index_out_of_range}

**Added in: v10.0.0**

**Removed in: v11.0.0**

주어진 인덱스가 허용된 범위를 벗어났습니다 (예: 음수 오프셋).

### `ERR_INVALID_OPT_VALUE` {#err_invalid_opt_value}

**Added in: v8.0.0**

**Removed in: v15.0.0**

옵션 객체에 유효하지 않거나 예상치 못한 값이 전달되었습니다.

### `ERR_INVALID_OPT_VALUE_ENCODING` {#err_invalid_opt_value_encoding}

**Added in: v9.0.0**

**Removed in: v15.0.0**

유효하지 않거나 알 수 없는 파일 인코딩이 전달되었습니다.

### `ERR_INVALID_PERFORMANCE_MARK` {#err_invalid_performance_mark}

**Added in: v8.5.0**

**Removed in: v16.7.0**

Performance Timing API(`perf_hooks`)를 사용하는 동안 성능 마크가 유효하지 않습니다.

### `ERR_INVALID_TRANSFER_OBJECT` {#err_invalid_transfer_object}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v21.0.0 | `DOMException`이 대신 발생합니다. |
| v21.0.0 | Removed in: v21.0.0 |
:::

유효하지 않은 전송 객체가 `postMessage()`에 전달되었습니다.

### `ERR_MANIFEST_ASSERT_INTEGRITY` {#err_manifest_assert_integrity}

**Removed in: v22.2.0**

리소스 로드를 시도했지만 리소스가 정책 매니페스트에 정의된 무결성과 일치하지 않았습니다. 자세한 내용은 정책 매니페스트 문서를 참조하십시오.

### `ERR_MANIFEST_DEPENDENCY_MISSING` {#err_manifest_dependency_missing}

**Removed in: v22.2.0**

리소스 로드를 시도했지만 리소스가 로드를 시도한 위치에서 종속성으로 나열되지 않았습니다. 자세한 내용은 정책 매니페스트 문서를 참조하십시오.

### `ERR_MANIFEST_INTEGRITY_MISMATCH` {#err_manifest_integrity_mismatch}

**Removed in: v22.2.0**

정책 매니페스트 로드를 시도했지만 매니페스트에 서로 일치하지 않는 리소스에 대한 여러 항목이 있었습니다. 이 오류를 해결하려면 매니페스트 항목이 일치하도록 업데이트하십시오. 자세한 내용은 정책 매니페스트 문서를 참조하십시오.

### `ERR_MANIFEST_INVALID_RESOURCE_FIELD` {#err_manifest_invalid_resource_field}

**Removed in: v22.2.0**

정책 매니페스트 리소스에 해당 필드 중 하나에 대한 유효하지 않은 값이 있었습니다. 이 오류를 해결하려면 매니페스트 항목이 일치하도록 업데이트하십시오. 자세한 내용은 정책 매니페스트 문서를 참조하십시오.


### `ERR_MANIFEST_INVALID_SPECIFIER` {#err_manifest_invalid_specifier}

**제거됨: v22.2.0**

정책 매니페스트 리소스에 해당 종속성 매핑에 대한 유효하지 않은 값이 있습니다. 이 오류를 해결하려면 매니페스트 항목을 일치하도록 업데이트하십시오. 자세한 내용은 정책 매니페스트 설명서를 참조하십시오.

### `ERR_MANIFEST_PARSE_POLICY` {#err_manifest_parse_policy}

**제거됨: v22.2.0**

정책 매니페스트를 로드하려고 시도했지만 매니페스트를 구문 분석할 수 없습니다. 자세한 내용은 정책 매니페스트 설명서를 참조하십시오.

### `ERR_MANIFEST_TDZ` {#err_manifest_tdz}

**제거됨: v22.2.0**

정책 매니페스트에서 읽기를 시도했지만 매니페스트 초기화가 아직 수행되지 않았습니다. 이는 Node.js의 버그일 가능성이 높습니다.

### `ERR_MANIFEST_UNKNOWN_ONERROR` {#err_manifest_unknown_onerror}

**제거됨: v22.2.0**

정책 매니페스트가 로드되었지만 해당 "onerror" 동작에 대한 알 수 없는 값이 있습니다. 자세한 내용은 정책 매니페스트 설명서를 참조하십시오.

### `ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST` {#err_missing_message_port_in_transfer_list}

**제거됨: v15.0.0**

이 오류 코드는 Node.js v15.0.0에서 [`ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST`](/ko/nodejs/api/errors#err_missing_transferable_in_transfer_list)로 대체되었습니다. 그 이유는 다른 유형의 전송 가능한 객체도 이제 존재하므로 더 이상 정확하지 않기 때문입니다.

### `ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST` {#err_missing_transferable_in_transfer_list}


::: info [History]
| Version | Changes |
| --- | --- |
| v21.0.0 | `DOMException`이 대신 발생합니다. |
| v21.0.0 | 제거됨: v21.0.0 |
| v15.0.0 | 추가됨: v15.0.0 |
:::

`transferList` 인수에 명시적으로 나열해야 하는 객체가 [`postMessage()`](/ko/nodejs/api/worker_threads#portpostmessagevalue-transferlist) 호출에 전달된 객체에 있지만 해당 호출의 `transferList`에 제공되지 않습니다. 일반적으로 이는 `MessagePort`입니다.

v15.0.0 이전의 Node.js 버전에서 여기서 사용되는 오류 코드는 [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/ko/nodejs/api/errors#err_missing_message_port_in_transfer_list)였습니다. 그러나 전송 가능한 객체 유형 세트가 확장되어 `MessagePort`보다 더 많은 유형을 포괄합니다.

### `ERR_NAPI_CONS_PROTOTYPE_OBJECT` {#err_napi_cons_prototype_object}

**추가됨: v9.0.0**

**제거됨: v10.0.0**

`Constructor.prototype`이 객체가 아닐 때 `Node-API`에서 사용됩니다.


### `ERR_NAPI_TSFN_START_IDLE_LOOP` {#err_napi_tsfn_start_idle_loop}

**Added in: v10.6.0, v8.16.0**

**Removed in: v14.2.0, v12.17.0**

메인 스레드에서 스레드 안전 함수와 관련된 큐에서 유휴 루프를 통해 값이 제거됩니다. 이 오류는 루프 시작을 시도할 때 오류가 발생했음을 나타냅니다.

### `ERR_NAPI_TSFN_STOP_IDLE_LOOP` {#err_napi_tsfn_stop_idle_loop}

**Added in: v10.6.0, v8.16.0**

**Removed in: v14.2.0, v12.17.0**

큐에 더 이상 항목이 남아 있지 않으면 유휴 루프를 일시 중단해야 합니다. 이 오류는 유휴 루프가 중지되지 않았음을 나타냅니다.

### `ERR_NO_LONGER_SUPPORTED` {#err_no_longer_supported}

`Buffer.write(string, encoding, offset[, length])`와 같이 지원되지 않는 방식으로 Node.js API가 호출되었습니다.

### `ERR_OUTOFMEMORY` {#err_outofmemory}

**Added in: v9.0.0**

**Removed in: v10.0.0**

작업으로 인해 메모리 부족 상태가 발생했음을 일반적으로 식별하는 데 사용됩니다.

### `ERR_PARSE_HISTORY_DATA` {#err_parse_history_data}

**Added in: v9.0.0**

**Removed in: v10.0.0**

`node:repl` 모듈이 REPL 기록 파일에서 데이터를 파싱할 수 없습니다.

### `ERR_SOCKET_CANNOT_SEND` {#err_socket_cannot_send}

**Added in: v9.0.0**

**Removed in: v14.0.0**

소켓에서 데이터를 보낼 수 없습니다.

### `ERR_STDERR_CLOSE` {#err_stderr_close}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.12.0 | 오류를 발생시키는 대신 `process.stderr.end()`는 이제 스트림 측만 닫고 기본 리소스는 닫지 않아 이 오류가 불필요해졌습니다. |
| v10.12.0 | Removed in: v10.12.0 |
:::

`process.stderr` 스트림을 닫으려고 시도했습니다. 설계상 Node.js는 사용자 코드가 `stdout` 또는 `stderr` 스트림을 닫는 것을 허용하지 않습니다.

### `ERR_STDOUT_CLOSE` {#err_stdout_close}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.12.0 | 오류를 발생시키는 대신 `process.stderr.end()`는 이제 스트림 측만 닫고 기본 리소스는 닫지 않아 이 오류가 불필요해졌습니다. |
| v10.12.0 | Removed in: v10.12.0 |
:::

`process.stdout` 스트림을 닫으려고 시도했습니다. 설계상 Node.js는 사용자 코드가 `stdout` 또는 `stderr` 스트림을 닫는 것을 허용하지 않습니다.

### `ERR_STREAM_READ_NOT_IMPLEMENTED` {#err_stream_read_not_implemented}

**Added in: v9.0.0**

**Removed in: v10.0.0**

[`readable._read()`](/ko/nodejs/api/stream#readable_readsize)를 구현하지 않은 읽기 가능한 스트림을 사용하려고 시도할 때 사용됩니다.


### `ERR_TLS_RENEGOTIATION_FAILED` {#err_tls_renegotiation_failed}

**추가된 버전: v9.0.0**

**제거된 버전: v10.0.0**

TLS 재협상 요청이 특정되지 않은 방식으로 실패했을 때 사용됩니다.

### `ERR_TRANSFERRING_EXTERNALIZED_SHAREDARRAYBUFFER` {#err_transferring_externalized_sharedarraybuffer}

**추가된 버전: v10.5.0**

**제거된 버전: v14.0.0**

JavaScript 엔진이나 Node.js에서 관리하지 않는 메모리를 가진 `SharedArrayBuffer`가 직렬화 중에 발견되었습니다. 이러한 `SharedArrayBuffer`는 직렬화할 수 없습니다.

이것은 네이티브 애드온이 "externalized" 모드에서 `SharedArrayBuffer`를 만들거나 기존 `SharedArrayBuffer`를 externalized 모드로 전환할 때만 발생할 수 있습니다.

### `ERR_UNKNOWN_STDIN_TYPE` {#err_unknown_stdin_type}

**추가된 버전: v8.0.0**

**제거된 버전: v11.7.0**

알 수 없는 `stdin` 파일 유형으로 Node.js 프로세스를 시작하려고 시도했습니다. 이 오류는 일반적으로 Node.js 자체 내의 버그를 나타내지만 사용자 코드가 트리거할 수도 있습니다.

### `ERR_UNKNOWN_STREAM_TYPE` {#err_unknown_stream_type}

**추가된 버전: v8.0.0**

**제거된 버전: v11.7.0**

알 수 없는 `stdout` 또는 `stderr` 파일 유형으로 Node.js 프로세스를 시작하려고 시도했습니다. 이 오류는 일반적으로 Node.js 자체 내의 버그를 나타내지만 사용자 코드가 트리거할 수도 있습니다.

### `ERR_V8BREAKITERATOR` {#err_v8breakiterator}

V8 `BreakIterator` API가 사용되었지만 전체 ICU 데이터 세트가 설치되지 않았습니다.

### `ERR_VALUE_OUT_OF_RANGE` {#err_value_out_of_range}

**추가된 버전: v9.0.0**

**제거된 버전: v10.0.0**

주어진 값이 허용된 범위를 벗어날 때 사용됩니다.

### `ERR_VM_MODULE_LINKING_ERRORED` {#err_vm_module_linking_errored}

**추가된 버전: v10.0.0**

**제거된 버전: v18.1.0, v16.17.0**

링커 함수가 연결에 실패한 모듈을 반환했습니다.

### `ERR_VM_MODULE_NOT_LINKED` {#err_vm_module_not_linked}

모듈은 인스턴스화하기 전에 성공적으로 연결되어야 합니다.

### `ERR_WORKER_UNSUPPORTED_EXTENSION` {#err_worker_unsupported_extension}

**추가된 버전: v11.0.0**

**제거된 버전: v16.9.0**

워커의 메인 스크립트에 사용된 경로 이름에 알 수 없는 파일 확장명이 있습니다.

### `ERR_ZLIB_BINDING_CLOSED` {#err_zlib_binding_closed}

**추가된 버전: v9.0.0**

**제거된 버전: v10.0.0**

이미 닫힌 `zlib` 객체를 사용하려고 시도했을 때 사용됩니다.


## OpenSSL 오류 코드 {#openssl-error-codes}

### 시간 유효성 오류 {#time-validity-errors}

#### `CERT_NOT_YET_VALID` {#cert_not_yet_valid}

인증서가 아직 유효하지 않습니다. notBefore 날짜가 현재 시간 이후입니다.

#### `CERT_HAS_EXPIRED` {#cert_has_expired}

인증서가 만료되었습니다. notAfter 날짜가 현재 시간 이전입니다.

#### `CRL_NOT_YET_VALID` {#crl_not_yet_valid}

인증서 해지 목록(CRL)에 미래 발행 날짜가 있습니다.

#### `CRL_HAS_EXPIRED` {#crl_has_expired}

인증서 해지 목록(CRL)이 만료되었습니다.

#### `CERT_REVOKED` {#cert_revoked}

인증서가 해지되었습니다. 인증서 해지 목록(CRL)에 있습니다.

### 신뢰 또는 체인 관련 오류 {#trust-or-chain-related-errors}

#### `UNABLE_TO_GET_ISSUER_CERT` {#unable_to_get_issuer_cert}

조회된 인증서의 발급자 인증서를 찾을 수 없습니다. 이는 일반적으로 신뢰할 수 있는 인증서 목록이 완전하지 않음을 의미합니다.

#### `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` {#unable_to_get_issuer_cert_locally}

인증서의 발급자를 알 수 없습니다. 발급자가 신뢰할 수 있는 인증서 목록에 포함되지 않은 경우입니다.

#### `DEPTH_ZERO_SELF_SIGNED_CERT` {#depth_zero_self_signed_cert}

전달된 인증서가 자체 서명되었으며 동일한 인증서를 신뢰할 수 있는 인증서 목록에서 찾을 수 없습니다.

#### `SELF_SIGNED_CERT_IN_CHAIN` {#self_signed_cert_in_chain}

인증서의 발급자를 알 수 없습니다. 발급자가 신뢰할 수 있는 인증서 목록에 포함되지 않은 경우입니다.

#### `CERT_CHAIN_TOO_LONG` {#cert_chain_too_long}

인증서 체인 길이가 최대 깊이보다 깁니다.

#### `UNABLE_TO_GET_CRL` {#unable_to_get_crl}

인증서에서 참조하는 CRL을 찾을 수 없습니다.

#### `UNABLE_TO_VERIFY_LEAF_SIGNATURE` {#unable_to_verify_leaf_signature}

체인에 인증서가 하나만 포함되어 있고 자체 서명되지 않았기 때문에 서명을 확인할 수 없습니다.

#### `CERT_UNTRUSTED` {#cert_untrusted}

루트 인증 기관(CA)이 지정된 목적에 대해 신뢰할 수 있는 것으로 표시되지 않았습니다.

### 기본 확장 오류 {#basic-extension-errors}

#### `INVALID_CA` {#invalid_ca}

CA 인증서가 유효하지 않습니다. CA가 아니거나 해당 확장이 제공된 목적과 일치하지 않습니다.

#### `PATH_LENGTH_EXCEEDED` {#path_length_exceeded}

basicConstraints pathlength 매개변수가 초과되었습니다.

### 이름 관련 오류 {#name-related-errors}

#### `HOSTNAME_MISMATCH` {#hostname_mismatch}

인증서가 제공된 이름과 일치하지 않습니다.

### 사용 및 정책 오류 {#usage-and-policy-errors}


#### `INVALID_PURPOSE` {#invalid_purpose}

제공된 인증서를 지정된 용도로 사용할 수 없습니다.

#### `CERT_REJECTED` {#cert_rejected}

루트 CA가 지정된 용도를 거부하도록 표시되었습니다.

### 서식 오류 {#formatting-errors}

#### `CERT_SIGNATURE_FAILURE` {#cert_signature_failure}

인증서의 서명이 유효하지 않습니다.

#### `CRL_SIGNATURE_FAILURE` {#crl_signature_failure}

인증서 해지 목록(CRL)의 서명이 유효하지 않습니다.

#### `ERROR_IN_CERT_NOT_BEFORE_FIELD` {#error_in_cert_not_before_field}

인증서 notBefore 필드에 유효하지 않은 시간이 포함되어 있습니다.

#### `ERROR_IN_CERT_NOT_AFTER_FIELD` {#error_in_cert_not_after_field}

인증서 notAfter 필드에 유효하지 않은 시간이 포함되어 있습니다.

#### `ERROR_IN_CRL_LAST_UPDATE_FIELD` {#error_in_crl_last_update_field}

CRL lastUpdate 필드에 유효하지 않은 시간이 포함되어 있습니다.

#### `ERROR_IN_CRL_NEXT_UPDATE_FIELD` {#error_in_crl_next_update_field}

CRL nextUpdate 필드에 유효하지 않은 시간이 포함되어 있습니다.

#### `UNABLE_TO_DECRYPT_CERT_SIGNATURE` {#unable_to_decrypt_cert_signature}

인증서 서명을 해독할 수 없습니다. 이는 예상 값과 일치하지 않는 것이 아니라 실제 서명 값을 확인할 수 없음을 의미하며, RSA 키에만 의미가 있습니다.

#### `UNABLE_TO_DECRYPT_CRL_SIGNATURE` {#unable_to_decrypt_crl_signature}

인증서 해지 목록(CRL) 서명을 해독할 수 없습니다. 이는 예상 값과 일치하지 않는 것이 아니라 실제 서명 값을 확인할 수 없음을 의미합니다.

#### `UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY` {#unable_to_decode_issuer_public_key}

인증서 SubjectPublicKeyInfo의 공개 키를 읽을 수 없습니다.

### 기타 OpenSSL 오류 {#other-openssl-errors}

#### `OUT_OF_MEM` {#out_of_mem}

메모리를 할당하는 동안 오류가 발생했습니다. 이런 일은 없어야 합니다.

