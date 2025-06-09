---
title: Node.js 문서 - 유틸리티
description: Node.js 'util' 모듈의 문서로, Node.js 애플리케이션을 위한 유틸리티 기능을 제공합니다. 디버깅, 객체 검사 등이 포함됩니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - 유틸리티 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 'util' 모듈의 문서로, Node.js 애플리케이션을 위한 유틸리티 기능을 제공합니다. 디버깅, 객체 검사 등이 포함됩니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - 유틸리티 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 'util' 모듈의 문서로, Node.js 애플리케이션을 위한 유틸리티 기능을 제공합니다. 디버깅, 객체 검사 등이 포함됩니다.
---


# Util {#util}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

**소스 코드:** [lib/util.js](https://github.com/nodejs/node/blob/v23.5.0/lib/util.js)

`node:util` 모듈은 Node.js 내부 API의 요구 사항을 지원합니다. 많은 유틸리티가 애플리케이션 및 모듈 개발자에게도 유용합니다. 액세스하려면 다음을 수행합니다.

```js [ESM]
const util = require('node:util');
```
## `util.callbackify(original)` {#utilcallbackifyoriginal}

**추가된 버전: v8.2.0**

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `async` 함수
- 반환: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 콜백 스타일 함수

`async` 함수(또는 `Promise`를 반환하는 함수)를 가져와서 오류 우선 콜백 스타일, 즉 마지막 인수로 `(err, value) => ...` 콜백을 사용하는 함수를 반환합니다. 콜백에서 첫 번째 인수는 거부 이유가 되고(`Promise`가 해결된 경우 `null`), 두 번째 인수는 해결된 값이 됩니다.

```js [ESM]
const util = require('node:util');

async function fn() {
  return 'hello world';
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  if (err) throw err;
  console.log(ret);
});
```
다음이 출력됩니다.

```text [TEXT]
hello world
```
콜백은 비동기적으로 실행되며 제한된 스택 추적을 갖습니다. 콜백이 예외를 던지면 프로세스는 [`'uncaughtException'`](/ko/nodejs/api/process#event-uncaughtexception) 이벤트를 발생시키고, 처리되지 않으면 종료됩니다.

`null`은 콜백의 첫 번째 인수로 특별한 의미를 가지므로 래핑된 함수가 falsy 값을 이유로 `Promise`를 거부하는 경우 해당 값은 `reason`이라는 필드에 원래 값이 저장된 `Error`로 래핑됩니다.

```js [ESM]
function fn() {
  return Promise.reject(null);
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  // Promise가 `null`로 거부된 경우 Error로 래핑되고
  // 원래 값은 `reason`에 저장됩니다.
  err && Object.hasOwn(err, 'reason') && err.reason === null;  // true
});
```

## `util.debuglog(section[, callback])` {#utildebuglogsection-callback}

**다음 버전부터 추가됨: v0.11.3**

- `section` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `debuglog` 함수를 생성할 애플리케이션의 부분을 식별하는 문자열입니다.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 로깅 함수가 더 최적화된 로깅 함수인 함수 인수로 처음 호출될 때 호출되는 콜백입니다.
- 반환: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 로깅 함수

`util.debuglog()` 메서드는 `NODE_DEBUG` 환경 변수의 존재 여부에 따라 디버그 메시지를 `stderr`에 조건부로 작성하는 함수를 만드는 데 사용됩니다. `section` 이름이 해당 환경 변수의 값 내에 나타나면 반환된 함수는 [`console.error()`](/ko/nodejs/api/console#consoleerrordata-args)와 유사하게 작동합니다. 그렇지 않으면 반환된 함수는 아무 작업도 수행하지 않습니다.

```js [ESM]
const util = require('node:util');
const debuglog = util.debuglog('foo');

debuglog('hello from foo [%d]', 123);
```
이 프로그램이 환경에서 `NODE_DEBUG=foo`로 실행되면 다음과 같은 내용이 출력됩니다.

```bash [BASH]
FOO 3245: hello from foo [123]
```
여기서 `3245`는 프로세스 ID입니다. 해당 환경 변수가 설정된 상태로 실행되지 않으면 아무것도 출력되지 않습니다.

`section`은 와일드카드도 지원합니다.

```js [ESM]
const util = require('node:util');
const debuglog = util.debuglog('foo-bar');

debuglog('hi there, it\'s foo-bar [%d]', 2333);
```
환경에서 `NODE_DEBUG=foo*`로 실행되면 다음과 같은 내용이 출력됩니다.

```bash [BASH]
FOO-BAR 3257: hi there, it's foo-bar [2333]
```
쉼표로 구분된 여러 `section` 이름을 `NODE_DEBUG` 환경 변수에 지정할 수 있습니다: `NODE_DEBUG=fs,net,tls`.

선택적 `callback` 인수를 사용하여 초기화 또는 불필요한 래핑이 없는 다른 함수로 로깅 함수를 바꿀 수 있습니다.

```js [ESM]
const util = require('node:util');
let debuglog = util.debuglog('internals', (debug) => {
  // 섹션이 활성화되었는지 테스트하는 것을 최적화하는
  // 로깅 함수로 바꿉니다.
  debuglog = debug;
});
```

### `debuglog().enabled` {#debuglogenabled}

**추가된 버전: v14.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`util.debuglog().enabled` getter는 `NODE_DEBUG` 환경 변수의 존재 여부에 따라 조건문에서 사용할 수 있는 테스트를 만드는 데 사용됩니다. 해당 환경 변수 값 안에 `section` 이름이 나타나면 반환 값은 `true`가 됩니다. 그렇지 않으면 반환 값은 `false`가 됩니다.

```js [ESM]
const util = require('node:util');
const enabled = util.debuglog('foo').enabled;
if (enabled) {
  console.log('hello from foo [%d]', 123);
}
```
이 프로그램을 `NODE_DEBUG=foo` 환경에서 실행하면 다음과 같은 결과가 출력됩니다.

```bash [BASH]
hello from foo [123]
```
## `util.debug(section)` {#utildebugsection}

**추가된 버전: v14.9.0**

`util.debuglog`의 별칭입니다. `util.debuglog().enabled`만 사용할 때 로깅을 암시하지 않도록 가독성을 높입니다.

## `util.deprecate(fn, msg[, code])` {#utildeprecatefn-msg-code}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 더 이상 사용되지 않는 경고는 각 코드에 대해 한 번만 표시됩니다. |
| v0.8.0 | 추가된 버전: v0.8.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 더 이상 사용되지 않는 함수입니다.
- `msg` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 더 이상 사용되지 않는 함수가 호출될 때 표시할 경고 메시지입니다.
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 더 이상 사용되지 않는 코드입니다. 코드 목록은 [더 이상 사용되지 않는 API 목록](/ko/nodejs/api/deprecations#list-of-deprecated-apis)을 참조하세요.
- 반환값: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 경고를 발생시키도록 래핑된 더 이상 사용되지 않는 함수입니다.

`util.deprecate()` 메서드는 `fn`(함수 또는 클래스일 수 있음)을 더 이상 사용되지 않는 것으로 표시되는 방식으로 래핑합니다.

```js [ESM]
const util = require('node:util');

exports.obsoleteFunction = util.deprecate(() => {
  // 여기에 무언가를 수행합니다.
}, 'obsoleteFunction()은 더 이상 사용되지 않습니다. 대신 newShinyFunction()을 사용하세요.');
```
호출되면 `util.deprecate()`는 [`'warning'`](/ko/nodejs/api/process#event-warning) 이벤트를 사용하여 `DeprecationWarning`을 발생시키는 함수를 반환합니다. 경고는 반환된 함수가 처음 호출될 때 `stderr`에 출력되고 표시됩니다. 경고가 표시된 후 래핑된 함수는 경고를 표시하지 않고 호출됩니다.

동일한 선택적 `code`가 `util.deprecate()`에 대한 여러 호출에서 제공되면 해당 `code`에 대해 경고가 한 번만 표시됩니다.

```js [ESM]
const util = require('node:util');

const fn1 = util.deprecate(someFunction, someMessage, 'DEP0001');
const fn2 = util.deprecate(someOtherFunction, someOtherMessage, 'DEP0001');
fn1(); // 코드 DEP0001로 더 이상 사용되지 않는 경고를 표시합니다.
fn2(); // 동일한 코드를 가지므로 더 이상 사용되지 않는 경고를 표시하지 않습니다.
```
`--no-deprecation` 또는 `--no-warnings` 명령줄 플래그가 사용되거나 첫 번째 더 이상 사용되지 않는 경고 *이전*에 `process.noDeprecation` 속성이 `true`로 설정된 경우 `util.deprecate()` 메서드는 아무것도 수행하지 않습니다.

`--trace-deprecation` 또는 `--trace-warnings` 명령줄 플래그가 설정되거나 `process.traceDeprecation` 속성이 `true`로 설정되면 더 이상 사용되지 않는 함수가 처음 호출될 때 경고와 스택 추적이 `stderr`에 출력됩니다.

`--throw-deprecation` 명령줄 플래그가 설정되거나 `process.throwDeprecation` 속성이 `true`로 설정되면 더 이상 사용되지 않는 함수가 호출될 때 예외가 발생합니다.

`--throw-deprecation` 명령줄 플래그와 `process.throwDeprecation` 속성은 `--trace-deprecation` 및 `process.traceDeprecation`보다 우선합니다.


## `util.format(format[, ...args])` {#utilformatformat-args}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v12.11.0 | 이제 `%c` 지정자는 무시됩니다. |
| v12.0.0 | `format` 인수는 이제 실제로 형식 지정자를 포함하는 경우에만 해당 형식으로 간주됩니다. |
| v12.0.0 | `format` 인수가 형식 문자열이 아닌 경우 출력 문자열의 형식은 더 이상 첫 번째 인수의 유형에 의존하지 않습니다. 이 변경 사항은 첫 번째 인수가 문자열이 아닐 때 출력되던 문자열에서 이전에 있던 따옴표를 제거합니다. |
| v11.4.0 | 이제 `%d`, `%f`, `%i` 지정자가 Symbols를 올바르게 지원합니다. |
| v11.4.0 | `%o` 지정자의 `depth`의 기본 깊이가 다시 4입니다. |
| v11.0.0 | 이제 `%o` 지정자의 `depth` 옵션이 기본 깊이로 되돌아갑니다. |
| v10.12.0 | 이제 `%d` 및 `%i` 지정자가 BigInt를 지원합니다. |
| v8.4.0 | 이제 `%o` 및 `%O` 지정자가 지원됩니다. |
| v0.5.3 | 추가됨: v0.5.3 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `printf`와 유사한 형식 문자열입니다.

`util.format()` 메서드는 첫 번째 인수를 0개 이상의 형식 지정자를 포함할 수 있는 `printf`와 유사한 형식 문자열로 사용하여 형식이 지정된 문자열을 반환합니다. 각 지정자는 해당 인수의 변환된 값으로 대체됩니다. 지원되는 지정자는 다음과 같습니다.

- `%s`: `String`은 `BigInt`, `Object` 및 `-0`을 제외한 모든 값을 변환하는 데 사용됩니다. `BigInt` 값은 `n`으로 표시되고 사용자 정의 `toString` 함수가 없는 객체는 `{ depth: 0, colors: false, compact: 3 }` 옵션을 사용하여 `util.inspect()`를 사용하여 검사됩니다.
- `%d`: `Number`는 `BigInt` 및 `Symbol`을 제외한 모든 값을 변환하는 데 사용됩니다.
- `%i`: `parseInt(value, 10)`은 `BigInt` 및 `Symbol`을 제외한 모든 값에 사용됩니다.
- `%f`: `parseFloat(value)`는 `Symbol`을 제외한 모든 값에 사용됩니다.
- `%j`: JSON. 인수가 순환 참조를 포함하는 경우 `'[Circular]'` 문자열로 대체됩니다.
- `%o`: `Object`. 일반 JavaScript 객체 형식으로 객체를 문자열로 표현합니다. `{ showHidden: true, showProxy: true }` 옵션을 사용하는 `util.inspect()`와 유사합니다. 이는 열거할 수 없는 속성 및 프록시를 포함한 전체 객체를 표시합니다.
- `%O`: `Object`. 일반 JavaScript 객체 형식으로 객체를 문자열로 표현합니다. 옵션이 없는 `util.inspect()`와 유사합니다. 이는 열거할 수 없는 속성 및 프록시를 포함하지 않는 전체 객체를 표시합니다.
- `%c`: `CSS`. 이 지정자는 무시되고 전달된 CSS를 건너뜁니다.
- `%%`: 단일 퍼센트 기호(`'%'`). 이는 인수를 소비하지 않습니다.
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 형식이 지정된 문자열

지정자에 해당 인수가 없으면 대체되지 않습니다.

```js [ESM]
util.format('%s:%s', 'foo');
// 반환: 'foo:%s'
```

형식 문자열의 일부가 아닌 값은 해당 유형이 `string`이 아니면 `util.inspect()`를 사용하여 형식이 지정됩니다.

`util.format()` 메서드에 지정자 수보다 많은 인수가 전달되면 추가 인수는 공백으로 구분되어 반환된 문자열에 연결됩니다.

```js [ESM]
util.format('%s:%s', 'foo', 'bar', 'baz');
// 반환: 'foo:bar baz'
```

첫 번째 인수에 유효한 형식 지정자가 포함되어 있지 않으면 `util.format()`는 공백으로 구분된 모든 인수의 연결인 문자열을 반환합니다.

```js [ESM]
util.format(1, 2, 3);
// 반환: '1 2 3'
```

하나의 인수만 `util.format()`에 전달되면 형식이 지정되지 않고 그대로 반환됩니다.

```js [ESM]
util.format('%% %s');
// 반환: '%% %s'
```

`util.format()`은 디버깅 도구로 사용하기 위한 동기 메서드입니다. 일부 입력 값은 이벤트 루프를 차단할 수 있는 상당한 성능 오버헤드를 가질 수 있습니다. 이 함수를 주의해서 사용하고 핫 코드 경로에서는 사용하지 마십시오.


## `util.formatWithOptions(inspectOptions, format[, ...args])` {#utilformatwithoptionsinspectoptions-format-args}

**다음 버전부터 추가됨: v10.0.0**

- `inspectOptions` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이 함수는 [`util.format()`](/ko/nodejs/api/util#utilformatformat-args)과 동일하지만, [`util.inspect()`](/ko/nodejs/api/util#utilinspectobject-options)에 전달되는 옵션을 지정하는 `inspectOptions` 인수를 받습니다.

```js [ESM]
util.formatWithOptions({ colors: true }, '개체 %O 보기', { foo: 42 });
// '개체 { foo: 42 } 보기'를 반환합니다. 여기서 `42`는 터미널에 출력될 때 숫자로 색상이 지정됩니다.
```
## `util.getCallSites(frameCountOrOptions, [options])` {#utilgetcallsitesframecountoroptions-options}

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.3.0 | API 이름이 `util.getCallSite`에서 `util.getCallSites()`로 변경되었습니다. |
| v22.9.0 | 다음 버전부터 추가됨: v22.9.0 |
:::

- `frameCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 콜 사이트 개체로 캡처할 프레임의 선택적 숫자입니다. **기본값:** `10`. 허용 가능한 범위는 1에서 200 사이입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 선택 사항
    - `sourceMap` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 소스 맵에서 스택 추적의 원래 위치를 재구성합니다. `--enable-source-maps` 플래그를 사용하여 기본적으로 활성화됩니다.
  
 
- 반환 값: [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 콜러 함수의 스택을 포함하는 콜 사이트 개체의 배열
    - `functionName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 이 콜 사이트와 관련된 함수의 이름을 반환합니다.
    - `scriptName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 이 콜 사이트에 대한 함수의 스크립트를 포함하는 리소스의 이름을 반환합니다.
    - `lineNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 연결된 함수 호출에 대한 줄 번호(1부터 시작)를 반환합니다.
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 연결된 함수 호출에 대한 줄의 1부터 시작하는 열 오프셋을 반환합니다.
  
 

콜러 함수의 스택을 포함하는 콜 사이트 개체의 배열을 반환합니다.

```js [ESM]
const util = require('node:util');

function exampleFunction() {
  const callSites = util.getCallSites();

  console.log('콜 사이트:');
  callSites.forEach((callSite, index) => {
    console.log(`콜 사이트 ${index + 1}:`);
    console.log(`함수 이름: ${callSite.functionName}`);
    console.log(`스크립트 이름: ${callSite.scriptName}`);
    console.log(`줄 번호: ${callSite.lineNumber}`);
    console.log(`열 번호: ${callSite.column}`);
  });
  // 콜 사이트 1:
  // 함수 이름: exampleFunction
  // 스크립트 이름: /home/example.js
  // 줄 번호: 5
  // 열 번호: 26

  // 콜 사이트 2:
  // 함수 이름: anotherFunction
  // 스크립트 이름: /home/example.js
  // 줄 번호: 22
  // 열 번호: 3

  // ...
}

// 다른 스택 레이어를 시뮬레이션하는 함수
function anotherFunction() {
  exampleFunction();
}

anotherFunction();
```
`sourceMap` 옵션을 `true`로 설정하여 원래 위치를 재구성할 수 있습니다. 소스 맵을 사용할 수 없는 경우 원래 위치는 현재 위치와 동일합니다. `--enable-source-maps` 플래그를 활성화한 경우(예: `--experimental-transform-types` 사용 시) `sourceMap`은 기본적으로 true입니다.

```ts [TYPESCRIPT]
import util from 'node:util';

interface Foo {
  foo: string;
}

const callSites = util.getCallSites({ sourceMap: true });

// sourceMap 사용 시:
// 함수 이름: ''
// 스크립트 이름: example.js
// 줄 번호: 7
// 열 번호: 26

// sourceMap 미사용 시:
// 함수 이름: ''
// 스크립트 이름: example.js
// 줄 번호: 2
// 열 번호: 26
```

## `util.getSystemErrorName(err)` {#utilgetsystemerrornameerr}

**Added in: v9.7.0**

- `err` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Node.js API에서 제공하는 숫자 오류 코드에 대한 문자열 이름을 반환합니다. 오류 코드와 오류 이름 간의 매핑은 플랫폼에 따라 다릅니다. 일반적인 오류 이름은 [일반 시스템 오류](/ko/nodejs/api/errors#common-system-errors)를 참조하세요.

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const name = util.getSystemErrorName(err.errno);
  console.error(name);  // ENOENT
});
```
## `util.getSystemErrorMap()` {#utilgetsystemerrormap}

**Added in: v16.0.0, v14.17.0**

- 반환: [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

Node.js API에서 사용할 수 있는 모든 시스템 오류 코드의 Map을 반환합니다. 오류 코드와 오류 이름 간의 매핑은 플랫폼에 따라 다릅니다. 일반적인 오류 이름은 [일반 시스템 오류](/ko/nodejs/api/errors#common-system-errors)를 참조하세요.

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const errorMap = util.getSystemErrorMap();
  const name = errorMap.get(err.errno);
  console.error(name);  // ENOENT
});
```
## `util.getSystemErrorMessage(err)` {#utilgetsystemerrormessageerr}

**Added in: v23.1.0**

- `err` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Node.js API에서 제공하는 숫자 오류 코드에 대한 문자열 메시지를 반환합니다. 오류 코드와 문자열 메시지 간의 매핑은 플랫폼에 따라 다릅니다.

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const name = util.getSystemErrorMessage(err.errno);
  console.error(name);  // No such file or directory
});
```
## `util.inherits(constructor, superConstructor)` {#utilinheritsconstructor-superconstructor}


::: info [History]
| 버전 | 변경 사항 |
| --- | --- |
| v5.0.0 | 이제 `constructor` 매개변수가 ES6 클래스를 참조할 수 있습니다. |
| v0.3.0 | Added in: v0.3.0 |
:::

::: info [Stable: 3 - Legacy]
[Stable: 3](/ko/nodejs/api/documentation#stability-index) [안정성: 3](/ko/nodejs/api/documentation#stability-index) - 레거시: ES2015 클래스 구문과 `extends` 키워드를 대신 사용하세요.
:::

- `constructor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `superConstructor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

`util.inherits()` 사용은 권장되지 않습니다. 언어 수준의 상속 지원을 받으려면 ES6 `class` 및 `extends` 키워드를 사용하세요. 또한 두 스타일은 [의미상 호환되지 않음](https://github.com/nodejs/node/issues/4179)을 참고하세요.

하나의 [생성자](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor)에서 다른 생성자로 프로토타입 메서드를 상속합니다. `constructor`의 프로토타입은 `superConstructor`에서 생성된 새 객체로 설정됩니다.

이는 주로 `Object.setPrototypeOf(constructor.prototype, superConstructor.prototype)` 위에 몇 가지 입력 유효성 검사를 추가합니다. 추가적인 편의를 위해 `superConstructor`는 `constructor.super_` 속성을 통해 액세스할 수 있습니다.

```js [ESM]
const util = require('node:util');
const EventEmitter = require('node:events');

function MyStream() {
  EventEmitter.call(this);
}

util.inherits(MyStream, EventEmitter);

MyStream.prototype.write = function(data) {
  this.emit('data', data);
};

const stream = new MyStream();

console.log(stream instanceof EventEmitter); // true
console.log(MyStream.super_ === EventEmitter); // true

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('It works!'); // Received data: "It works!"
```
`class` 및 `extends`를 사용하는 ES6 예제:

```js [ESM]
const EventEmitter = require('node:events');

class MyStream extends EventEmitter {
  write(data) {
    this.emit('data', data);
  }
}

const stream = new MyStream();

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('With ES6');
```

## `util.inspect(object[, options])` {#utilinspectobject-options}

## `util.inspect(object[, showHidden[, depth[, colors]]])` {#utilinspectobject-showhidden-depth-colors}


::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v16.18.0 | `Set` 및 `Map` 검사 시 `maxArrayLength`에 대한 지원 추가. |
| v17.3.0, v16.14.0 | `numericSeparator` 옵션이 이제 지원됩니다. |
| v13.0.0 | 순환 참조는 이제 참조에 대한 마커를 포함합니다. |
| v14.6.0, v12.19.0 | `object`가 다른 `vm.Context`에서 온 경우 사용자 지정 검사 함수는 더 이상 컨텍스트별 인수를 받지 않습니다. |
| v13.13.0, v12.17.0 | `maxStringLength` 옵션이 이제 지원됩니다. |
| v13.5.0, v12.16.0 | `showHidden`이 `true`인 경우 사용자 정의 프로토타입 속성이 검사됩니다. |
| v12.0.0 | `compact` 옵션 기본값은 `3`으로 변경되고 `breakLength` 옵션 기본값은 `80`으로 변경되었습니다. |
| v12.0.0 | 내부 속성은 더 이상 사용자 지정 검사 함수의 컨텍스트 인수에 나타나지 않습니다. |
| v11.11.0 | `compact` 옵션은 새로운 출력 모드에 대한 숫자를 허용합니다. |
| v11.7.0 | ArrayBuffer는 이제 바이너리 콘텐츠도 표시합니다. |
| v11.5.0 | `getters` 옵션이 이제 지원됩니다. |
| v11.4.0 | `depth` 기본값이 다시 `2`로 변경되었습니다. |
| v11.0.0 | `depth` 기본값이 `20`으로 변경되었습니다. |
| v11.0.0 | 검사 출력은 이제 약 128MiB로 제한됩니다. 해당 크기를 초과하는 데이터는 완전히 검사되지 않습니다. |
| v10.12.0 | `sorted` 옵션이 이제 지원됩니다. |
| v10.6.0 | 연결 목록 및 유사한 객체를 이제 최대 호출 스택 크기까지 검사할 수 있습니다. |
| v10.0.0 | `WeakMap` 및 `WeakSet` 항목도 이제 검사할 수 있습니다. |
| v9.9.0 | `compact` 옵션이 이제 지원됩니다. |
| v6.6.0 | 사용자 지정 검사 함수는 이제 `this`를 반환할 수 있습니다. |
| v6.3.0 | `breakLength` 옵션이 이제 지원됩니다. |
| v6.1.0 | `maxArrayLength` 옵션이 이제 지원됩니다. 특히 긴 배열은 기본적으로 잘립니다. |
| v6.1.0 | `showProxy` 옵션이 이제 지원됩니다. |
| v0.3.0 | v0.3.0에 추가됨 |
:::

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 모든 JavaScript 기본 형식 또는 `Object`입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `showHidden` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 `object`의 열거 불가능한 심볼 및 속성이 포맷된 결과에 포함됩니다. [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) 및 [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) 항목과 사용자 정의 프로토타입 속성(메서드 속성 제외)도 포함됩니다. **기본값:** `false`.
    - `depth` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `object`를 포맷하는 동안 재귀할 횟수를 지정합니다. 이것은 큰 객체를 검사하는 데 유용합니다. 최대 호출 스택 크기까지 재귀하려면 `Infinity` 또는 `null`을 전달합니다. **기본값:** `2`.
    - `colors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 출력은 ANSI 색상 코드로 스타일이 지정됩니다. 색상은 사용자 정의할 수 있습니다. [Customizing `util.inspect` colors](/ko/nodejs/api/util#customizing-utilinspect-colors)를 참조하세요. **기본값:** `false`.
    - `customInspect` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`인 경우 `[util.inspect.custom](depth, opts, inspect)` 함수가 호출되지 않습니다. **기본값:** `true`.
    - `showProxy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 `Proxy` 검사에는 [`target` 및 `handler`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#Terminology) 객체가 포함됩니다. **기본값:** `false`.
    - `maxArrayLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 포맷할 때 포함할 `Array`, [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set), [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) 및 [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) 요소의 최대 수를 지정합니다. 모든 요소를 표시하려면 `null` 또는 `Infinity`로 설정합니다. 요소를 표시하지 않으려면 `0` 또는 음수로 설정합니다. **기본값:** `100`.
    - `maxStringLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 포맷할 때 포함할 문자의 최대 수를 지정합니다. 모든 요소를 표시하려면 `null` 또는 `Infinity`로 설정합니다. 문자를 표시하지 않으려면 `0` 또는 음수로 설정합니다. **기본값:** `10000`.
    - `breakLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 입력 값이 여러 줄로 분할되는 길이입니다. 입력을 한 줄로 포맷하려면 `Infinity`로 설정합니다(이때 `compact`는 `true` 또는 `1` 이상의 숫자로 설정해야 함). **기본값:** `80`.
    - `compact` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이것을 `false`로 설정하면 각 객체 키가 새 줄에 표시됩니다. `breakLength`보다 긴 텍스트에서 줄 바꿈이 발생합니다. 숫자로 설정하면 모든 속성이 `breakLength`에 맞으면 가장 안쪽 `n`개의 요소가 한 줄로 결합됩니다. 짧은 배열 요소도 함께 그룹화됩니다. 자세한 내용은 아래 예제를 참조하세요. **기본값:** `3`.
    - `sorted` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `true` 또는 함수로 설정하면 객체의 모든 속성과 `Set` 및 `Map` 항목이 결과 문자열에서 정렬됩니다. `true`로 설정하면 [기본 정렬](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)이 사용됩니다. 함수로 설정하면 [비교 함수](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Parameters)로 사용됩니다.
    - `getters` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `true`로 설정하면 getter가 검사됩니다. `'get'`으로 설정하면 해당 setter가 없는 getter만 검사됩니다. `'set'`으로 설정하면 해당 setter가 있는 getter만 검사됩니다. 이는 getter 함수에 따라 부작용을 일으킬 수 있습니다. **기본값:** `false`.
    - `numericSeparator` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`로 설정하면 밑줄이 모든 bigint 및 숫자의 세 자리마다 구분하는 데 사용됩니다. **기본값:** `false`.
  
 
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `object`의 표현.

`util.inspect()` 메서드는 디버깅을 위한 `object`의 문자열 표현을 반환합니다. `util.inspect`의 출력은 언제든지 변경될 수 있으며 프로그래밍 방식으로 의존해서는 안 됩니다. 결과를 변경하는 추가 `options`를 전달할 수 있습니다. `util.inspect()`는 생성자의 이름 및/또는 `@@toStringTag`를 사용하여 검사된 값에 대한 식별 가능한 태그를 만듭니다.

```js [ESM]
class Foo {
  get [Symbol.toStringTag]() {
    return 'bar';
  }
}

class Bar {}

const baz = Object.create(null, { [Symbol.toStringTag]: { value: 'foo' } });

util.inspect(new Foo()); // 'Foo [bar] {}'
util.inspect(new Bar()); // 'Bar {}'
util.inspect(baz);       // '[foo] {}'
```
순환 참조는 참조 인덱스를 사용하여 앵커를 가리킵니다.

```js [ESM]
const { inspect } = require('node:util');

const obj = {};
obj.a = [obj];
obj.b = {};
obj.b.inner = obj.b;
obj.b.obj = obj;

console.log(inspect(obj));
// <ref *1> {
//   a: [ [Circular *1] ],
//   b: <ref *2> { inner: [Circular *2], obj: [Circular *1] }
// }
```
다음 예제는 `util` 객체의 모든 속성을 검사합니다.

```js [ESM]
const util = require('node:util');

console.log(util.inspect(util, { showHidden: true, depth: null }));
```
다음 예제는 `compact` 옵션의 효과를 강조합니다.

```js [ESM]
const util = require('node:util');

const o = {
  a: [1, 2, [[
    'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit, sed do ' +
      'eiusmod \ntempor incididunt ut labore et dolore magna aliqua.',
    'test',
    'foo']], 4],
  b: new Map([['za', 1], ['zb', 'test']]),
};
console.log(util.inspect(o, { compact: true, depth: 5, breakLength: 80 }));

// { a:
//   [ 1,
//     2,
//     [ [ 'Lorem ipsum dolor sit amet,\nconsectetur [...]', // 긴 줄
//           'test',
//           'foo' ] ],
//     4 ],
//   b: Map(2) { 'za' => 1, 'zb' => 'test' } }

// `compact`를 false 또는 정수로 설정하면 더 읽기 쉬운 출력이 생성됩니다.
console.log(util.inspect(o, { compact: false, depth: 5, breakLength: 80 }));

// {
//   a: [
//     1,
//     2,
//     [
//       [
//         'Lorem ipsum dolor sit amet,\n' +
//           'consectetur adipiscing elit, sed do eiusmod \n' +
//           'tempor incididunt ut labore et dolore magna aliqua.',
//         'test',
//         'foo'
//       ]
//     ],
//     4
//   ],
//   b: Map(2) {
//     'za' => 1,
//     'zb' => 'test'
//   }
// }

// `breakLength`를 예를 들어 150으로 설정하면 "Lorem ipsum" 텍스트가 한 줄로 인쇄됩니다.
```
`showHidden` 옵션을 사용하면 [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) 및 [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) 항목을 검사할 수 있습니다. `maxArrayLength`보다 많은 항목이 있는 경우 어떤 항목이 표시되는지 보장할 수 없습니다. 즉, 동일한 [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) 항목을 두 번 검색하면 다른 출력이 발생할 수 있습니다. 또한 강력한 참조가 남아 있지 않은 항목은 언제든지 가비지 수집될 수 있습니다.

```js [ESM]
const { inspect } = require('node:util');

const obj = { a: 1 };
const obj2 = { b: 2 };
const weakSet = new WeakSet([obj, obj2]);

console.log(inspect(weakSet, { showHidden: true }));
// WeakSet { { a: 1 }, { b: 2 } }
```
`sorted` 옵션은 객체의 속성 삽입 순서가 `util.inspect()`의 결과에 영향을 미치지 않도록 합니다.

```js [ESM]
const { inspect } = require('node:util');
const assert = require('node:assert');

const o1 = {
  b: [2, 3, 1],
  a: '`a`는 `b` 앞에 옵니다.',
  c: new Set([2, 3, 1]),
};
console.log(inspect(o1, { sorted: true }));
// { a: '`a`는 `b` 앞에 옵니다.', b: [ 2, 3, 1 ], c: Set(3) { 1, 2, 3 } }
console.log(inspect(o1, { sorted: (a, b) => b.localeCompare(a) }));
// { c: Set(3) { 3, 2, 1 }, b: [ 2, 3, 1 ], a: '`a`는 `b` 앞에 옵니다.' }

const o2 = {
  c: new Set([2, 1, 3]),
  a: '`a`는 `b` 앞에 옵니다.',
  b: [2, 3, 1],
};
assert.strict.equal(
  inspect(o1, { sorted: true }),
  inspect(o2, { sorted: true }),
);
```
`numericSeparator` 옵션은 모든 숫자의 세 자리마다 밑줄을 추가합니다.

```js [ESM]
const { inspect } = require('node:util');

const thousand = 1_000;
const million = 1_000_000;
const bigNumber = 123_456_789n;
const bigDecimal = 1_234.123_45;

console.log(inspect(thousand, { numericSeparator: true }));
// 1_000
console.log(inspect(million, { numericSeparator: true }));
// 1_000_000
console.log(inspect(bigNumber, { numericSeparator: true }));
// 123_456_789n
console.log(inspect(bigDecimal, { numericSeparator: true }));
// 1_234.123_45
```
`util.inspect()`는 디버깅을 위한 동기 메서드입니다. 최대 출력 길이는 약 128MiB입니다. 더 긴 출력을 초래하는 입력은 잘립니다.


### `util.inspect` 색상 사용자 정의하기 {#customizing-utilinspect-colors}

`util.inspect`의 색상 출력(활성화된 경우)은 `util.inspect.styles` 및 `util.inspect.colors` 속성을 통해 전역적으로 사용자 정의할 수 있습니다.

`util.inspect.styles`는 스타일 이름을 `util.inspect.colors`의 색상과 연결하는 맵입니다.

기본 스타일과 연결된 색상은 다음과 같습니다.

- `bigint`: `yellow`
- `boolean`: `yellow`
- `date`: `magenta`
- `module`: `underline`
- `name`: (스타일 없음)
- `null`: `bold`
- `number`: `yellow`
- `regexp`: `red`
- `special`: `cyan` (예: `Proxies`)
- `string`: `green`
- `symbol`: `green`
- `undefined`: `grey`

색상 스타일 지정은 모든 터미널에서 지원되지 않을 수 있는 ANSI 제어 코드를 사용합니다. 색상 지원을 확인하려면 [`tty.hasColors()`](/ko/nodejs/api/tty#writestreamhascolorscount-env)를 사용하세요.

미리 정의된 제어 코드는 아래에 나열되어 있습니다("수정자", "전경색" 및 "배경색"으로 그룹화됨).

#### 수정자 {#modifiers}

수정자 지원은 터미널마다 다릅니다. 지원되지 않는 경우 대부분 무시됩니다.

- `reset` - 모든 (색상) 수정자를 기본값으로 재설정합니다.
- **bold** - 텍스트를 굵게 만듭니다.
- *italic* - 텍스트를 기울임꼴로 만듭니다.
- underline - 텍스트에 밑줄을 긋습니다.
- ~~strikethrough~~ - 텍스트의 중앙을 가로지르는 수평선을 넣습니다(별칭: `strikeThrough`, `crossedout`, `crossedOut`).
- `hidden` - 텍스트를 인쇄하지만 보이지 않게 만듭니다(별칭: conceal).
- dim - 색상 강도를 줄입니다(별칭: `faint`).
- overlined - 텍스트에 윗줄을 긋습니다.
- blink - 일정한 간격으로 텍스트를 숨기고 표시합니다.
- inverse - 전경색과 배경색을 바꿉니다(별칭: `swapcolors`, `swapColors`).
- doubleunderline - 텍스트에 이중 밑줄을 긋습니다(별칭: `doubleUnderline`).
- framed - 텍스트 주위에 프레임을 그립니다.

#### 전경색 {#foreground-colors}

- `black`
- `red`
- `green`
- `yellow`
- `blue`
- `magenta`
- `cyan`
- `white`
- `gray` (별칭: `grey`, `blackBright`)
- `redBright`
- `greenBright`
- `yellowBright`
- `blueBright`
- `magentaBright`
- `cyanBright`
- `whiteBright`

#### 배경색 {#background-colors}

- `bgBlack`
- `bgRed`
- `bgGreen`
- `bgYellow`
- `bgBlue`
- `bgMagenta`
- `bgCyan`
- `bgWhite`
- `bgGray` (별칭: `bgGrey`, `bgBlackBright`)
- `bgRedBright`
- `bgGreenBright`
- `bgYellowBright`
- `bgBlueBright`
- `bgMagentaBright`
- `bgCyanBright`
- `bgWhiteBright`


### 객체에 대한 사용자 정의 검사 함수 {#custom-inspection-functions-on-objects}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v17.3.0, v16.14.0 | 더 나은 상호 운용성을 위해 inspect 인수가 추가되었습니다. |
| v0.1.97 | 추가됨: v0.1.97 |
:::

객체는 자체 [`[util.inspect.custom](depth, opts, inspect)`](/ko/nodejs/api/util#utilinspectcustom) 함수를 정의할 수도 있습니다. 이 함수는 `util.inspect()`가 객체를 검사할 때 호출하여 결과를 사용합니다.

```js [ESM]
const util = require('node:util');

class Box {
  constructor(value) {
    this.value = value;
  }

  [util.inspect.custom](depth, options, inspect) {
    if (depth < 0) {
      return options.stylize('[Box]', 'special');
    }

    const newOptions = Object.assign({}, options, {
      depth: options.depth === null ? null : options.depth - 1,
    });

    // "Box< "의 크기이므로 5개의 공백 패딩.
    const padding = ' '.repeat(5);
    const inner = inspect(this.value, newOptions)
                  .replace(/\n/g, `\n${padding}`);
    return `${options.stylize('Box', 'special')}< ${inner} >`;
  }
}

const box = new Box(true);

util.inspect(box);
// 반환: "Box< true >"
```
사용자 정의 `[util.inspect.custom](depth, opts, inspect)` 함수는 일반적으로 문자열을 반환하지만 `util.inspect()`에 의해 적절하게 형식이 지정될 모든 유형의 값을 반환할 수 있습니다.

```js [ESM]
const util = require('node:util');

const obj = { foo: 'this will not show up in the inspect() output' };
obj[util.inspect.custom] = (depth) => {
  return { bar: 'baz' };
};

util.inspect(obj);
// 반환: "{ bar: 'baz' }"
```
### `util.inspect.custom` {#utilinspectcustom}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.12.0 | 이제 공유 심볼로 정의되었습니다. |
| v6.6.0 | 추가됨: v6.6.0 |
:::

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 사용자 정의 검사 함수를 선언하는 데 사용할 수 있습니다.

`util.inspect.custom`을 통해 액세스할 수 있을 뿐만 아니라 이 심볼은 [전역적으로 등록](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)되어 모든 환경에서 `Symbol.for('nodejs.util.inspect.custom')`으로 액세스할 수 있습니다.

이를 사용하면 코드를 이식 가능한 방식으로 작성할 수 있으므로 사용자 정의 검사 함수가 Node.js 환경에서 사용되고 브라우저에서는 무시됩니다. `util.inspect()` 함수 자체는 추가적인 이식성을 위해 사용자 정의 검사 함수에 세 번째 인수로 전달됩니다.

```js [ESM]
const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');

class Password {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return 'xxxxxxxx';
  }

  [customInspectSymbol](depth, inspectOptions, inspect) {
    return `Password <${this.toString()}>`;
  }
}

const password = new Password('r0sebud');
console.log(password);
// Password <xxxxxxxx>를 출력합니다.
```
자세한 내용은 [객체에 대한 사용자 정의 검사 함수](/ko/nodejs/api/util#custom-inspection-functions-on-objects)를 참조하십시오.


### `util.inspect.defaultOptions` {#utilinspectdefaultoptions}

**추가된 버전: v6.4.0**

`defaultOptions` 값은 `util.inspect`에서 사용하는 기본 옵션을 사용자 정의할 수 있도록 합니다. 이는 `console.log` 또는 `util.format`과 같이 암묵적으로 `util.inspect`를 호출하는 함수에 유용합니다. 하나 이상의 유효한 [`util.inspect()`](/ko/nodejs/api/util#utilinspectobject-options) 옵션을 포함하는 객체로 설정해야 합니다. 옵션 속성을 직접 설정하는 것도 지원됩니다.

```js [ESM]
const util = require('node:util');
const arr = Array(101).fill(0);

console.log(arr); // 잘린 배열을 기록합니다
util.inspect.defaultOptions.maxArrayLength = null;
console.log(arr); // 전체 배열을 기록합니다
```
## `util.isDeepStrictEqual(val1, val2)` {#utilisdeepstrictequalval1-val2}

**추가된 버전: v9.0.0**

- `val1` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `val2` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`val1`과 `val2` 사이에 깊은 엄격한 동일성이 있으면 `true`를 반환합니다. 그렇지 않으면 `false`를 반환합니다.

깊은 엄격한 동일성에 대한 자세한 내용은 [`assert.deepStrictEqual()`](/ko/nodejs/api/assert#assertdeepstrictequalactual-expected-message)을 참조하십시오.

## 클래스: `util.MIMEType` {#class-utilmimetype}

**추가된 버전: v19.1.0, v18.13.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

[MIMEType 클래스](https://bmeck.github.io/node-proposal-mime-api/)의 구현입니다.

브라우저 규칙에 따라 `MIMEType` 객체의 모든 속성은 객체 자체의 데이터 속성이 아닌 클래스 프로토타입의 getter 및 setter로 구현됩니다.

MIME 문자열은 여러 의미 있는 구성 요소를 포함하는 구조화된 문자열입니다. 구문 분석되면 이러한 각 구성 요소에 대한 속성을 포함하는 `MIMEType` 객체가 반환됩니다.

### 생성자: `new MIMEType(input)` {#constructor-new-mimetypeinput}

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 구문 분석할 입력 MIME

`input`을 구문 분석하여 새 `MIMEType` 객체를 만듭니다.



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/plain');
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/plain');
```
:::

`input`이 유효한 MIME이 아니면 `TypeError`가 발생합니다. 주어진 값을 문자열로 강제 변환하려는 노력이 있을 것입니다. 예를 들어:



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';
const myMIME = new MIMEType({ toString: () => 'text/plain' });
console.log(String(myMIME));
// Prints: text/plain
```

```js [CJS]
const { MIMEType } = require('node:util');
const myMIME = new MIMEType({ toString: () => 'text/plain' });
console.log(String(myMIME));
// Prints: text/plain
```
:::


### `mime.type` {#mimetype}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

MIME의 type 부분을 가져오고 설정합니다.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/javascript');
console.log(myMIME.type);
// Prints: text
myMIME.type = 'application';
console.log(myMIME.type);
// Prints: application
console.log(String(myMIME));
// Prints: application/javascript
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/javascript');
console.log(myMIME.type);
// Prints: text
myMIME.type = 'application';
console.log(myMIME.type);
// Prints: application
console.log(String(myMIME));
// Prints: application/javascript
```
:::

### `mime.subtype` {#mimesubtype}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

MIME의 subtype 부분을 가져오고 설정합니다.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/ecmascript');
console.log(myMIME.subtype);
// Prints: ecmascript
myMIME.subtype = 'javascript';
console.log(myMIME.subtype);
// Prints: javascript
console.log(String(myMIME));
// Prints: text/javascript
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/ecmascript');
console.log(myMIME.subtype);
// Prints: ecmascript
myMIME.subtype = 'javascript';
console.log(myMIME.subtype);
// Prints: javascript
console.log(String(myMIME));
// Prints: text/javascript
```
:::

### `mime.essence` {#mimeessence}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

MIME의 essence를 가져옵니다. 이 속성은 읽기 전용입니다. MIME을 변경하려면 `mime.type` 또는 `mime.subtype`을 사용하세요.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/javascript;key=value');
console.log(myMIME.essence);
// Prints: text/javascript
myMIME.type = 'application';
console.log(myMIME.essence);
// Prints: application/javascript
console.log(String(myMIME));
// Prints: application/javascript;key=value
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/javascript;key=value');
console.log(myMIME.essence);
// Prints: text/javascript
myMIME.type = 'application';
console.log(myMIME.essence);
// Prints: application/javascript
console.log(String(myMIME));
// Prints: application/javascript;key=value
```
:::


### `mime.params` {#mimeparams}

- [\<MIMEParams\>](/ko/nodejs/api/util#class-utilmimeparams)

MIME의 매개변수를 나타내는 [`MIMEParams`](/ko/nodejs/api/util#class-utilmimeparams) 객체를 가져옵니다. 이 속성은 읽기 전용입니다. 자세한 내용은 [`MIMEParams`](/ko/nodejs/api/util#class-utilmimeparams) 문서를 참조하세요.

### `mime.toString()` {#mimetostring}

- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`MIMEType` 객체의 `toString()` 메서드는 직렬화된 MIME을 반환합니다.

표준 준수의 필요성 때문에 이 메서드는 사용자가 MIME의 직렬화 프로세스를 사용자 정의할 수 있도록 허용하지 않습니다.

### `mime.toJSON()` {#mimetojson}

- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

[`mime.toString()`](/ko/nodejs/api/util#mimetostring)의 별칭입니다.

이 메서드는 `MIMEType` 객체가 [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)로 직렬화될 때 자동으로 호출됩니다.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIMES = [
  new MIMEType('image/png'),
  new MIMEType('image/gif'),
];
console.log(JSON.stringify(myMIMES));
// Prints: ["image/png", "image/gif"]
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIMES = [
  new MIMEType('image/png'),
  new MIMEType('image/gif'),
];
console.log(JSON.stringify(myMIMES));
// Prints: ["image/png", "image/gif"]
```
:::

## 클래스: `util.MIMEParams` {#class-utilmimeparams}

**다음 버전부터 추가됨: v19.1.0, v18.13.0**

`MIMEParams` API는 `MIMEType`의 매개변수에 대한 읽기 및 쓰기 액세스를 제공합니다.

### 생성자: `new MIMEParams()` {#constructor-new-mimeparams}

비어 있는 매개변수로 새 `MIMEParams` 객체를 생성합니다.

::: code-group
```js [ESM]
import { MIMEParams } from 'node:util';

const myParams = new MIMEParams();
```

```js [CJS]
const { MIMEParams } = require('node:util');

const myParams = new MIMEParams();
```
:::

### `mimeParams.delete(name)` {#mimeparamsdeletename}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이름이 `name`인 모든 이름-값 쌍을 제거합니다.


### `mimeParams.entries()` {#mimeparamsentries}

- 반환: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

매개변수 내 각 이름-값 쌍에 대한 이터레이터를 반환합니다. 이터레이터의 각 항목은 JavaScript `Array`입니다. 배열의 첫 번째 항목은 `name`이고, 배열의 두 번째 항목은 `value`입니다.

### `mimeParams.get(name)` {#mimeparamsgetname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 주어진 `name`을 가진 이름-값 쌍이 없으면 문자열 또는 `null`입니다.

이름이 `name`인 첫 번째 이름-값 쌍의 값을 반환합니다. 이러한 쌍이 없으면 `null`이 반환됩니다.

### `mimeParams.has(name)` {#mimeparamshasname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

이름이 `name`인 이름-값 쌍이 하나 이상 있으면 `true`를 반환합니다.

### `mimeParams.keys()` {#mimeparamskeys}

- 반환: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

각 이름-값 쌍의 이름에 대한 이터레이터를 반환합니다.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=0;bar=1');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   bar
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=0;bar=1');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   bar
```
:::

### `mimeParams.set(name, value)` {#mimeparamssetname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`name`과 연결된 `MIMEParams` 객체의 값을 `value`로 설정합니다. 이름이 `name`인 기존 이름-값 쌍이 있는 경우, 첫 번째 쌍의 값을 `value`로 설정합니다.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=0;bar=1');
params.set('foo', 'def');
params.set('baz', 'xyz');
console.log(params.toString());
// Prints: foo=def;bar=1;baz=xyz
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=0;bar=1');
params.set('foo', 'def');
params.set('baz', 'xyz');
console.log(params.toString());
// Prints: foo=def;bar=1;baz=xyz
```
:::


### `mimeParams.values()` {#mimeparamsvalues}

- 반환값: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

각 이름-값 쌍의 값에 대한 이터레이터를 반환합니다.

### `mimeParams[@@iterator]()` {#mimeparams@@iterator}

- 반환값: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

[`mimeParams.entries()`](/ko/nodejs/api/util#mimeparamsentries)의 별칭입니다.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=bar;xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=bar;xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
```
:::

## `util.parseArgs([config])` {#utilparseargsconfig}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.4.0, v20.16.0 | 입력 `config`에서 부정적인 옵션 허용 지원 추가. |
| v20.0.0 | 이 API는 더 이상 실험적이지 않습니다. |
| v18.11.0, v16.19.0 | 입력 `config`에 기본값 지원 추가. |
| v18.7.0, v16.17.0 | 입력 `config` 및 반환된 속성에서 `tokens`를 사용하여 자세한 구문 분석 정보 반환 지원 추가. |
| v18.3.0, v16.17.0 | 다음 버전에서 추가됨: v18.3.0, v16.17.0 |
:::

-  `config` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 구문 분석에 대한 인수를 제공하고 구문 분석기를 구성하는 데 사용됩니다. `config`는 다음 속성을 지원합니다.
    - `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 인수 문자열 배열. **기본값:** `execPath` 및 `filename`이 제거된 `process.argv`.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 구문 분석기에 알려진 인수를 설명하는 데 사용됩니다. `options`의 키는 옵션의 긴 이름이고 값은 다음 속성을 허용하는 [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)입니다.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 인수의 유형으로 `boolean` 또는 `string`이어야 합니다.
    - `multiple` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 이 옵션을 여러 번 제공할 수 있는지 여부입니다. `true`이면 모든 값이 배열에 수집됩니다. `false`이면 옵션 값이 마지막에 적용됩니다. **기본값:** `false`.
    - `short` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 옵션에 대한 단일 문자 별칭입니다.
    - `default` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 인수로 설정되지 않은 경우 기본 옵션 값입니다. `type` 속성과 동일한 유형이어야 합니다. `multiple`이 `true`이면 배열이어야 합니다.
  
 
    - `strict` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 알 수 없는 인수가 발생하거나 `options`에 구성된 `type`과 일치하지 않는 인수가 전달될 때 오류를 발생시켜야 하는지 여부입니다. **기본값:** `true`.
    - `allowPositionals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 이 명령이 위치 인수를 허용하는지 여부입니다. **기본값:** `strict`가 `true`이면 `false`, 그렇지 않으면 `true`.
    - `allowNegative` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 옵션 이름 앞에 `--no-`를 붙여 부울 옵션을 `false`로 명시적으로 설정할 수 있습니다. **기본값:** `false`.
    - `tokens` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 구문 분석된 토큰을 반환합니다. 이는 추가 검사 추가부터 토큰을 다른 방식으로 재처리하는 것까지 내장된 동작을 확장하는 데 유용합니다. **기본값:** `false`.
  
 
-  반환값: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 구문 분석된 명령줄 인수:
    - `values` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 구문 분석된 옵션 이름과 해당 [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 또는 [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 값의 매핑입니다.
    - `positionals` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 위치 인수입니다.
    - `tokens` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [parseArgs 토큰](/ko/nodejs/api/util#parseargs-tokens) 섹션을 참조하세요. `config`에 `tokens: true`가 포함된 경우에만 반환됩니다.
  
 

`process.argv`와 직접 상호 작용하는 것보다 명령줄 인수 구문 분석을 위한 더 높은 수준의 API를 제공합니다. 예상되는 인수에 대한 사양을 가져와 구문 분석된 옵션과 위치가 있는 구조화된 객체를 반환합니다.



::: code-group
```js [ESM]
import { parseArgs } from 'node:util';
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
  },
};
const {
  values,
  positionals,
} = parseArgs({ args, options });
console.log(values, positionals);
// Prints: [Object: null prototype] { foo: true, bar: 'b' } []
```

```js [CJS]
const { parseArgs } = require('node:util');
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
  },
};
const {
  values,
  positionals,
} = parseArgs({ args, options });
console.log(values, positionals);
// Prints: [Object: null prototype] { foo: true, bar: 'b' } []
```
:::


### `parseArgs` `tokens` {#parseargs-tokens}

구성에서 `tokens: true`를 지정하여 사용자 정의 동작을 추가하기 위한 자세한 구문 분석 정보를 사용할 수 있습니다. 반환된 토큰은 다음을 설명하는 속성을 갖습니다.

- 모든 토큰
    - `kind` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 'option', 'positional' 또는 'option-terminator' 중 하나입니다.
    - `index` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 토큰을 포함하는 `args` 내 요소의 인덱스입니다. 따라서 토큰의 소스 인수는 `args[token.index]`입니다.

 
- 옵션 토큰
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 옵션의 긴 이름입니다.
    - `rawName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `--foo`의 `-f`와 같이 args에서 사용되는 옵션입니다.
    - `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) args에 지정된 옵션 값입니다. 부울 옵션의 경우 정의되지 않습니다.
    - `inlineValue` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `--foo=bar`와 같이 옵션 값이 인라인으로 지정되었는지 여부입니다.

 
- 위치 토큰
    - `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) args에서 위치 인수의 값입니다 (예 : `args[index]`).

 
- option-terminator 토큰

반환된 토큰은 입력 args에서 발견된 순서대로 정렬됩니다. args에 두 번 이상 나타나는 옵션은 각 사용에 대한 토큰을 생성합니다. `-xy`와 같은 짧은 옵션 그룹은 각 옵션에 대한 토큰으로 확장됩니다. 따라서 `-xxx`는 세 개의 토큰을 생성합니다.

예를 들어 `--no-color`와 같은 부정 옵션에 대한 지원을 추가하기 위해 (`allowNegative`가 옵션이 `boolean` 유형일 때 지원함), 반환된 토큰을 다시 처리하여 부정 옵션에 대해 저장된 값을 변경할 수 있습니다.



::: code-group
```js [ESM]
import { parseArgs } from 'node:util';

const options = {
  'color': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  'logfile': { type: 'string' },
  'no-logfile': { type: 'boolean' },
};
const { values, tokens } = parseArgs({ options, tokens: true });

// 옵션 토큰을 다시 처리하고 반환된 값을 덮어씁니다.
tokens
  .filter((token) => token.kind === 'option')
  .forEach((token) => {
    if (token.name.startsWith('no-')) {
      // --no-foo에 대해 foo:false를 저장합니다.
      const positiveName = token.name.slice(3);
      values[positiveName] = false;
      delete values[token.name];
    } else {
      // --foo와 --no-foo가 모두 있는 경우 마지막 것이 우선하도록 값을 다시 저장합니다.
      values[token.name] = token.value ?? true;
    }
  });

const color = values.color;
const logfile = values.logfile ?? 'default.log';

console.log({ logfile, color });
```

```js [CJS]
const { parseArgs } = require('node:util');

const options = {
  'color': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  'logfile': { type: 'string' },
  'no-logfile': { type: 'boolean' },
};
const { values, tokens } = parseArgs({ options, tokens: true });

// 옵션 토큰을 다시 처리하고 반환된 값을 덮어씁니다.
tokens
  .filter((token) => token.kind === 'option')
  .forEach((token) => {
    if (token.name.startsWith('no-')) {
      // --no-foo에 대해 foo:false를 저장합니다.
      const positiveName = token.name.slice(3);
      values[positiveName] = false;
      delete values[token.name];
    } else {
      // --foo와 --no-foo가 모두 있는 경우 마지막 것이 우선하도록 값을 다시 저장합니다.
      values[token.name] = token.value ?? true;
    }
  });

const color = values.color;
const logfile = values.logfile ?? 'default.log';

console.log({ logfile, color });
```
:::

부정 옵션을 보여주는 예제 사용법과 옵션이 여러 가지 방법으로 사용될 때 마지막 것이 우선합니다.

```bash [BASH]
$ node negate.js
{ logfile: 'default.log', color: undefined }
$ node negate.js --no-logfile --no-color
{ logfile: false, color: false }
$ node negate.js --logfile=test.log --color
{ logfile: 'test.log', color: true }
$ node negate.js --no-logfile --logfile=test.log --color --no-color
{ logfile: 'test.log', color: false }
```

## `util.parseEnv(content)` {#utilparseenvcontent}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::

**추가된 버전: v21.7.0, v20.12.0**

- `content` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`.env` 파일의 원시 내용입니다.

- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`.env` 파일의 예시가 주어졌을 때:

::: code-group
```js [CJS]
const { parseEnv } = require('node:util');

parseEnv('HELLO=world\nHELLO=oh my\n');
// 반환: { HELLO: 'oh my' }
```

```js [ESM]
import { parseEnv } from 'node:util';

parseEnv('HELLO=world\nHELLO=oh my\n');
// 반환: { HELLO: 'oh my' }
```
:::

## `util.promisify(original)` {#utilpromisifyoriginal}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.8.0 | `Promise`를 반환하는 함수에 대해 `promisify`를 호출하는 것은 더 이상 사용되지 않습니다. |
| v8.0.0 | 추가된 버전: v8.0.0 |
:::

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

일반적인 오류 우선 콜백 스타일, 즉 마지막 인수로 `(err, value) => ...` 콜백을 취하는 함수를 가져와서 Promise를 반환하는 버전으로 반환합니다.

```js [ESM]
const util = require('node:util');
const fs = require('node:fs');

const stat = util.promisify(fs.stat);
stat('.').then((stats) => {
  // `stats`로 무언가를 수행합니다.
}).catch((error) => {
  // 오류를 처리합니다.
});
```
또는 `async function`을 사용하여 동등하게:

```js [ESM]
const util = require('node:util');
const fs = require('node:fs');

const stat = util.promisify(fs.stat);

async function callStat() {
  const stats = await stat('.');
  console.log(`이 디렉터리는 ${stats.uid}가 소유합니다.`);
}

callStat();
```
`original[util.promisify.custom]` 속성이 있으면 `promisify`는 해당 값을 반환합니다. [사용자 지정 Promisify된 함수](/ko/nodejs/api/util#custom-promisified-functions)를 참조하세요.

`promisify()`는 모든 경우에 `original`이 마지막 인수로 콜백을 취하는 함수라고 가정합니다. `original`이 함수가 아니면 `promisify()`는 오류를 발생시킵니다. `original`이 함수이지만 마지막 인수가 오류 우선 콜백이 아니면 오류 우선 콜백이 마지막 인수로 전달됩니다.

클래스 메서드 또는 `this`를 사용하는 다른 메서드에서 `promisify()`를 사용하는 경우 특별히 처리하지 않으면 예상대로 작동하지 않을 수 있습니다.

```js [ESM]
const util = require('node:util');

class Foo {
  constructor() {
    this.a = 42;
  }

  bar(callback) {
    callback(null, this.a);
  }
}

const foo = new Foo();

const naiveBar = util.promisify(foo.bar);
// TypeError: 정의되지 않은 속성 'a'를 읽을 수 없습니다.
// naiveBar().then(a => console.log(a));

naiveBar.call(foo).then((a) => console.log(a)); // '42'

const bindBar = naiveBar.bind(foo);
bindBar().then((a) => console.log(a)); // '42'
```

### 사용자 정의 프로미스화 함수 {#custom-promisified-functions}

`util.promisify.custom` 심볼을 사용하면 [`util.promisify()`](/ko/nodejs/api/util#utilpromisifyoriginal)의 반환 값을 재정의할 수 있습니다.

```js [ESM]
const util = require('node:util');

function doSomething(foo, callback) {
  // ...
}

doSomething[util.promisify.custom] = (foo) => {
  return getPromiseSomehow();
};

const promisified = util.promisify(doSomething);
console.log(promisified === doSomething[util.promisify.custom]);
// 'true' 출력
```
이것은 원래 함수가 마지막 인수로 에러 우선 콜백을 받는 표준 형식을 따르지 않는 경우에 유용할 수 있습니다.

예를 들어, `(foo, onSuccessCallback, onErrorCallback)`을 입력으로 받는 함수가 있는 경우:

```js [ESM]
doSomething[util.promisify.custom] = (foo) => {
  return new Promise((resolve, reject) => {
    doSomething(foo, resolve, reject);
  });
};
```
`promisify.custom`이 정의되었지만 함수가 아닌 경우 `promisify()`는 에러를 발생시킵니다.

### `util.promisify.custom` {#utilpromisifycustom}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.12.0, v12.16.2 | 이것은 이제 공유 심볼로 정의됩니다. |
| v8.0.0 | v8.0.0에 추가됨 |
:::

- 함수에 대한 사용자 정의 프로미스화된 변형을 선언하는 데 사용할 수 있는 [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)입니다. [사용자 정의 프로미스화 함수](/ko/nodejs/api/util#custom-promisified-functions)를 참조하세요.

`util.promisify.custom`을 통해 접근할 수 있을 뿐만 아니라, 이 심볼은 [전역적으로 등록](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)되어 있으며 모든 환경에서 `Symbol.for('nodejs.util.promisify.custom')`으로 접근할 수 있습니다.

예를 들어, `(foo, onSuccessCallback, onErrorCallback)`을 입력으로 받는 함수가 있는 경우:

```js [ESM]
const kCustomPromisifiedSymbol = Symbol.for('nodejs.util.promisify.custom');

doSomething[kCustomPromisifiedSymbol] = (foo) => {
  return new Promise((resolve, reject) => {
    doSomething(foo, resolve, reject);
  });
};
```

## `util.stripVTControlCharacters(str)` {#utilstripvtcontrolcharactersstr}

**Added in: v16.11.0**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

모든 ANSI 이스케이프 코드가 제거된 `str`을 반환합니다.

```js [ESM]
console.log(util.stripVTControlCharacters('\u001B[4mvalue\u001B[0m'));
// "value" 출력
```
## `util.styleText(format, text[, options])` {#utilstyletextformat-text-options}

::: tip [Stable: 2 - 안정됨]
[Stable: 2](/ko/nodejs/api/documentation#stability-index) [Stability: 2](/ko/nodejs/api/documentation#stability-index) - 안정됨.
:::


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.5.0 | styleText가 이제 안정되었습니다. |
| v22.8.0, v20.18.0 | isTTY 및 NO_COLORS, NODE_DISABLE_COLORS, FORCE_COLOR와 같은 환경 변수를 준수합니다. |
| v21.7.0, v20.12.0 | Added in: v21.7.0, v20.12.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) `util.inspect.colors`에 정의된 텍스트 형식 또는 텍스트 형식 배열입니다.
- `text` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 형식을 지정할 텍스트입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `validateStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) true인 경우 `stream`이 색상을 처리할 수 있는지 확인합니다. **기본값:** `true`.
    - `stream` [\<Stream\>](/ko/nodejs/api/stream#stream) 색상을 처리할 수 있는지 확인될 스트림입니다. **기본값:** `process.stdout`.
  
 

이 함수는 터미널에 인쇄하기 위해 전달된 `format`을 고려하여 형식이 지정된 텍스트를 반환합니다. 터미널의 기능을 인식하고 `NO_COLORS`, `NODE_DISABLE_COLORS` 및 `FORCE_COLOR` 환경 변수를 통해 설정된 구성에 따라 작동합니다.



::: code-group
```js [ESM]
import { styleText } from 'node:util';
import { stderr } from 'node:process';

const successMessage = styleText('green', 'Success!');
console.log(successMessage);

const errorMessage = styleText(
  'red',
  'Error! Error!',
  // process.stderr에 TTY가 있는지 확인
  { stream: stderr },
);
console.error(successMessage);
```

```js [CJS]
const { styleText } = require('node:util');
const { stderr } = require('node:process');

const successMessage = styleText('green', 'Success!');
console.log(successMessage);

const errorMessage = styleText(
  'red',
  'Error! Error!',
  // process.stderr에 TTY가 있는지 확인
  { stream: stderr },
);
console.error(successMessage);
```
:::

`util.inspect.colors`는 `italic` 및 `underline`과 같은 텍스트 형식을 제공하며 둘 다 결합할 수 있습니다.

```js [CJS]
console.log(
  util.styleText(['underline', 'italic'], 'My italic underlined message'),
);
```
형식 배열을 전달할 때 적용되는 형식의 순서는 왼쪽에서 오른쪽이므로 다음 스타일이 이전 스타일을 덮어쓸 수 있습니다.

```js [CJS]
console.log(
  util.styleText(['red', 'green'], 'text'), // green
);
```
전체 형식 목록은 [modifiers](/ko/nodejs/api/util#modifiers)에서 확인할 수 있습니다.


## 클래스: `util.TextDecoder` {#class-utiltextdecoder}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v11.0.0 | 이제 클래스를 전역 객체에서 사용할 수 있습니다. |
| v8.3.0 | 추가됨: v8.3.0 |
:::

[WHATWG 인코딩 표준](https://encoding.spec.whatwg.org/) `TextDecoder` API의 구현입니다.

```js [ESM]
const decoder = new TextDecoder();
const u8arr = new Uint8Array([72, 101, 108, 108, 111]);
console.log(decoder.decode(u8arr)); // Hello
```
### WHATWG 지원 인코딩 {#whatwg-supported-encodings}

[WHATWG 인코딩 표준](https://encoding.spec.whatwg.org/)에 따라 `TextDecoder` API에서 지원하는 인코딩은 아래 표에 간략히 설명되어 있습니다. 각 인코딩에 대해 하나 이상의 별칭을 사용할 수 있습니다.

다양한 Node.js 빌드 구성은 다양한 인코딩 세트를 지원합니다. ([국제화](/ko/nodejs/api/intl) 참조)

#### 기본적으로 지원되는 인코딩 (전체 ICU 데이터 포함) {#encodings-supported-by-default-with-full-icu-data}

| 인코딩 | 별칭 |
| --- | --- |
| `'ibm866'` | `'866'`  ,   `'cp866'`  ,   `'csibm866'` |
| `'iso-8859-2'` | `'csisolatin2'`  ,   `'iso-ir-101'`  ,   `'iso8859-2'`  ,   `'iso88592'`  ,   `'iso_8859-2'`  ,   `'iso_8859-2:1987'`  ,   `'l2'`  ,   `'latin2'` |
| `'iso-8859-3'` | `'csisolatin3'`  ,   `'iso-ir-109'`  ,   `'iso8859-3'`  ,   `'iso88593'`  ,   `'iso_8859-3'`  ,   `'iso_8859-3:1988'`  ,   `'l3'`  ,   `'latin3'` |
| `'iso-8859-4'` | `'csisolatin4'`  ,   `'iso-ir-110'`  ,   `'iso8859-4'`  ,   `'iso88594'`  ,   `'iso_8859-4'`  ,   `'iso_8859-4:1988'`  ,   `'l4'`  ,   `'latin4'` |
| `'iso-8859-5'` | `'csisolatincyrillic'`  ,   `'cyrillic'`  ,   `'iso-ir-144'`  ,   `'iso8859-5'`  ,   `'iso88595'`  ,   `'iso_8859-5'`  ,   `'iso_8859-5:1988'` |
| `'iso-8859-6'` | `'arabic'`  ,   `'asmo-708'`  ,   `'csiso88596e'`  ,   `'csiso88596i'`  ,   `'csisolatinarabic'`  ,   `'ecma-114'`  ,   `'iso-8859-6-e'`  ,   `'iso-8859-6-i'`  ,   `'iso-ir-127'`  ,   `'iso8859-6'`  ,   `'iso88596'`  ,   `'iso_8859-6'`  ,   `'iso_8859-6:1987'` |
| `'iso-8859-7'` | `'csisolatingreek'`  ,   `'ecma-118'`  ,   `'elot_928'`  ,   `'greek'`  ,   `'greek8'`  ,   `'iso-ir-126'`  ,   `'iso8859-7'`  ,   `'iso88597'`  ,   `'iso_8859-7'`  ,   `'iso_8859-7:1987'`  ,   `'sun_eu_greek'` |
| `'iso-8859-8'` | `'csiso88598e'`  ,   `'csisolatinhebrew'`  ,   `'hebrew'`  ,   `'iso-8859-8-e'`  ,   `'iso-ir-138'`  ,   `'iso8859-8'`  ,   `'iso88598'`  ,   `'iso_8859-8'`  ,   `'iso_8859-8:1988'`  ,   `'visual'` |
| `'iso-8859-8-i'` | `'csiso88598i'`  ,   `'logical'` |
| `'iso-8859-10'` | `'csisolatin6'`  ,   `'iso-ir-157'`  ,   `'iso8859-10'`  ,   `'iso885910'`  ,   `'l6'`  ,   `'latin6'` |
| `'iso-8859-13'` | `'iso8859-13'`  ,   `'iso885913'` |
| `'iso-8859-14'` | `'iso8859-14'`  ,   `'iso885914'` |
| `'iso-8859-15'` | `'csisolatin9'`  ,   `'iso8859-15'`  ,   `'iso885915'`  ,   `'iso_8859-15'`  ,   `'l9'` |
| `'koi8-r'` | `'cskoi8r'`  ,   `'koi'`  ,   `'koi8'`  ,   `'koi8_r'` |
| `'koi8-u'` | `'koi8-ru'` |
| `'macintosh'` | `'csmacintosh'`  ,   `'mac'`  ,   `'x-mac-roman'` |
| `'windows-874'` | `'dos-874'`  ,   `'iso-8859-11'`  ,   `'iso8859-11'`  ,   `'iso885911'`  ,   `'tis-620'` |
| `'windows-1250'` | `'cp1250'`  ,   `'x-cp1250'` |
| `'windows-1251'` | `'cp1251'`  ,   `'x-cp1251'` |
| `'windows-1252'` | `'ansi_x3.4-1968'`  ,   `'ascii'`  ,   `'cp1252'`  ,   `'cp819'`  ,   `'csisolatin1'`  ,   `'ibm819'`  ,   `'iso-8859-1'`  ,   `'iso-ir-100'`  ,   `'iso8859-1'`  ,   `'iso88591'`  ,   `'iso_8859-1'`  ,   `'iso_8859-1:1987'`  ,   `'l1'`  ,   `'latin1'`  ,   `'us-ascii'`  ,   `'x-cp1252'` |
| `'windows-1253'` | `'cp1253'`  ,   `'x-cp1253'` |
| `'windows-1254'` | `'cp1254'`  ,   `'csisolatin5'`  ,   `'iso-8859-9'`  ,   `'iso-ir-148'`  ,   `'iso8859-9'`  ,   `'iso88599'`  ,   `'iso_8859-9'`  ,   `'iso_8859-9:1989'`  ,   `'l5'`  ,   `'latin5'`  ,   `'x-cp1254'` |
| `'windows-1255'` | `'cp1255'`  ,   `'x-cp1255'` |
| `'windows-1256'` | `'cp1256'`  ,   `'x-cp1256'` |
| `'windows-1257'` | `'cp1257'`  ,   `'x-cp1257'` |
| `'windows-1258'` | `'cp1258'`  ,   `'x-cp1258'` |
| `'x-mac-cyrillic'` | `'x-mac-ukrainian'` |
| `'gbk'` | `'chinese'`  ,   `'csgb2312'`  ,   `'csiso58gb231280'`  ,   `'gb2312'`  ,   `'gb_2312'`  ,   `'gb_2312-80'`  ,   `'iso-ir-58'`  ,   `'x-gbk'` |
| `'gb18030'` ||
| `'big5'` | `'big5-hkscs'`  ,   `'cn-big5'`  ,   `'csbig5'`  ,   `'x-x-big5'` |
| `'euc-jp'` | `'cseucpkdfmtjapanese'`  ,   `'x-euc-jp'` |
| `'iso-2022-jp'` | `'csiso2022jp'` |
| `'shift_jis'` | `'csshiftjis'`  ,   `'ms932'`  ,   `'ms_kanji'`  ,   `'shift-jis'`  ,   `'sjis'`  ,   `'windows-31j'`  ,   `'x-sjis'` |
| `'euc-kr'` | `'cseuckr'`  ,   `'csksc56011987'`  ,   `'iso-ir-149'`  ,   `'korean'`  ,   `'ks_c_5601-1987'`  ,   `'ks_c_5601-1989'`  ,   `'ksc5601'`  ,   `'ksc_5601'`  ,   `'windows-949'` |

#### Node.js가 `small-icu` 옵션으로 빌드될 때 지원되는 인코딩 {#encodings-supported-when-nodejs-is-built-with-the-small-icu-option}

| 인코딩 | 별칭 |
| --- | --- |
| `'utf-8'` | `'unicode-1-1-utf-8'`  ,   `'utf8'` |
| `'utf-16le'` | `'utf-16'` |
| `'utf-16be'` ||
#### ICU가 비활성화되었을 때 지원되는 인코딩 {#encodings-supported-when-icu-is-disabled}

| 인코딩 | 별칭 |
| --- | --- |
| `'utf-8'` | `'unicode-1-1-utf-8'`  ,   `'utf8'` |
| `'utf-16le'` | `'utf-16'` |
[WHATWG 인코딩 표준](https://encoding.spec.whatwg.org/)에 나열된 `'iso-8859-16'` 인코딩은 지원되지 않습니다.

### `new TextDecoder([encoding[, options]])` {#new-textdecoderencoding-options}

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 이 `TextDecoder` 인스턴스가 지원하는 `encoding`을 식별합니다. **기본값:** `'utf-8'`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `fatal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 디코딩 실패가 치명적인 경우 `true`입니다. ICU가 비활성화된 경우 이 옵션은 지원되지 않습니다( [국제화](/ko/nodejs/api/intl) 참조). **기본값:** `false`.
    - `ignoreBOM` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 `TextDecoder`는 디코딩된 결과에 바이트 순서 표시를 포함합니다. `false`인 경우 바이트 순서 표시가 출력에서 제거됩니다. 이 옵션은 `encoding`이 `'utf-8'`, `'utf-16be'` 또는 `'utf-16le'`인 경우에만 사용됩니다. **기본값:** `false`.
  
 

새로운 `TextDecoder` 인스턴스를 만듭니다. `encoding`은 지원되는 인코딩 또는 별칭 중 하나를 지정할 수 있습니다.

`TextDecoder` 클래스는 전역 객체에서도 사용할 수 있습니다.

### `textDecoder.decode([input[, options]])` {#textdecoderdecodeinput-options}

- `input` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 인코딩된 데이터를 포함하는 `ArrayBuffer`, `DataView` 또는 `TypedArray` 인스턴스입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `stream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 추가 데이터 청크가 예상되는 경우 `true`입니다. **기본값:** `false`.
  
 
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`input`을 디코딩하고 문자열을 반환합니다. `options.stream`이 `true`인 경우 `input`의 끝에서 발생하는 불완전한 바이트 시퀀스는 내부적으로 버퍼링되고 `textDecoder.decode()`에 대한 다음 호출 후에 내보내집니다.

`textDecoder.fatal`이 `true`인 경우 발생하는 디코딩 오류로 인해 `TypeError`가 발생합니다.


### `textDecoder.encoding` {#textdecoderencoding}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`TextDecoder` 인스턴스에서 지원하는 인코딩입니다.

### `textDecoder.fatal` {#textdecoderfatal}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

디코딩 오류로 인해 `TypeError`가 발생하면 값은 `true`가 됩니다.

### `textDecoder.ignoreBOM` {#textdecoderignorebom}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

디코딩 결과에 바이트 순서 표시가 포함되면 값은 `true`가 됩니다.

## Class: `util.TextEncoder` {#class-utiltextencoder}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v11.0.0 | 이제 클래스를 전역 객체에서 사용할 수 있습니다. |
| v8.3.0 | 추가된 버전: v8.3.0 |
:::

[WHATWG 인코딩 표준](https://encoding.spec.whatwg.org/) `TextEncoder` API의 구현입니다. `TextEncoder`의 모든 인스턴스는 UTF-8 인코딩만 지원합니다.

```js [ESM]
const encoder = new TextEncoder();
const uint8array = encoder.encode('this is some data');
```

`TextEncoder` 클래스는 전역 객체에서도 사용할 수 있습니다.

### `textEncoder.encode([input])` {#textencoderencodeinput}

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 인코딩할 텍스트입니다. **기본값:** 빈 문자열.
- 반환: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

`input` 문자열을 UTF-8로 인코딩하고 인코딩된 바이트가 포함된 `Uint8Array`를 반환합니다.

### `textEncoder.encodeInto(src, dest)` {#textencoderencodeintosrc-dest}

**추가된 버전: v12.11.0**

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 인코딩할 텍스트입니다.
- `dest` [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 인코딩 결과를 담을 배열입니다.
- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `read` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) src의 읽힌 유니코드 코드 단위입니다.
    - `written` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) dest의 쓰여진 UTF-8 바이트입니다.

`src` 문자열을 UTF-8로 `dest` Uint8Array에 인코딩하고 읽힌 유니코드 코드 단위와 쓰여진 UTF-8 바이트를 포함하는 객체를 반환합니다.

```js [ESM]
const encoder = new TextEncoder();
const src = 'this is some data';
const dest = new Uint8Array(10);
const { read, written } = encoder.encodeInto(src, dest);
```

### `textEncoder.encoding` {#textencoderencoding}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`TextEncoder` 인스턴스에서 지원하는 인코딩입니다. 항상 `'utf-8'`로 설정됩니다.

## `util.toUSVString(string)` {#utiltousvstringstring}

**추가된 버전: v16.8.0, v14.18.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

모든 서로게이트 코드 포인트(또는 동등하게, 모든 쌍을 이루지 않은 서로게이트 코드 유닛)를 유니코드 "교체 문자" U+FFFD로 바꾼 후의 `string`을 반환합니다.

## `util.transferableAbortController()` {#utiltransferableabortcontroller}

**추가된 버전: v18.11.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

[\<AbortController\>](/ko/nodejs/api/globals#class-abortcontroller) 인스턴스를 생성하고 반환합니다. 이 인스턴스의 [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal)은 전송 가능으로 표시되어 `structuredClone()` 또는 `postMessage()`와 함께 사용할 수 있습니다.

## `util.transferableAbortSignal(signal)` {#utiltransferableabortsignalsignal}

**추가된 버전: v18.11.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal)
- 반환값: [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal)

주어진 [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal)을 전송 가능으로 표시하여 `structuredClone()` 및 `postMessage()`와 함께 사용할 수 있도록 합니다.

```js [ESM]
const signal = transferableAbortSignal(AbortSignal.timeout(100));
const channel = new MessageChannel();
channel.port2.postMessage(signal, [signal]);
```
## `util.aborted(signal, resource)` {#utilabortedsignal-resource}

**추가된 버전: v19.7.0, v18.16.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal)
- `resource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 중단 가능한 작업과 연결되고 약하게 유지되는 널이 아닌 객체입니다. `resource`가 `signal`이 중단되기 전에 가비지 수집되면, 프로미스는 보류 상태로 유지되어 Node.js가 이를 추적하는 것을 중단할 수 있습니다. 이는 장기 실행 또는 취소 불가능한 작업에서 메모리 누수를 방지하는 데 도움이 됩니다.
- 반환값: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

제공된 `signal`에서 abort 이벤트를 수신하고 `signal`이 중단될 때 해결되는 프로미스를 반환합니다. `resource`가 제공되면 작업과 관련된 객체를 약하게 참조하므로, `signal`이 중단되기 전에 `resource`가 가비지 수집되면 반환된 프로미스는 보류 상태로 유지됩니다. 이는 장기 실행 또는 취소 불가능한 작업에서 메모리 누수를 방지합니다.

::: code-group
```js [CJS]
const { aborted } = require('node:util');

// 사용자 정의 리소스 또는 작업과 같은 중단 가능한 신호가 있는 객체를 얻습니다.
const dependent = obtainSomethingAbortable();

// `dependent`를 리소스로 전달하여 `signal`이 중단될 때 `dependent`가 여전히 메모리에 있는 경우에만 프로미스가 해결되도록 나타냅니다.
aborted(dependent.signal, dependent).then(() => {

  // 이 코드는 `dependent`가 중단될 때 실행됩니다.
  console.log('종속 리소스가 중단되었습니다.');
});

// 중단을 트리거하는 이벤트를 시뮬레이션합니다.
dependent.on('event', () => {
  dependent.abort(); // 이로 인해 `aborted` 프로미스가 해결됩니다.
});
```

```js [ESM]
import { aborted } from 'node:util';

// 사용자 정의 리소스 또는 작업과 같은 중단 가능한 신호가 있는 객체를 얻습니다.
const dependent = obtainSomethingAbortable();

// `dependent`를 리소스로 전달하여 `signal`이 중단될 때 `dependent`가 여전히 메모리에 있는 경우에만 프로미스가 해결되도록 나타냅니다.
aborted(dependent.signal, dependent).then(() => {

  // 이 코드는 `dependent`가 중단될 때 실행됩니다.
  console.log('종속 리소스가 중단되었습니다.');
});

// 중단을 트리거하는 이벤트를 시뮬레이션합니다.
dependent.on('event', () => {
  dependent.abort(); // 이로 인해 `aborted` 프로미스가 해결됩니다.
});
```
:::


## `util.types` {#utiltypes}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.3.0 | `require('util/types')`로 노출됨. |
| v10.0.0 | 추가됨: v10.0.0 |
:::

`util.types`는 다양한 종류의 내장 객체에 대한 유형 검사를 제공합니다. `instanceof` 또는 `Object.prototype.toString.call(value)`와 달리 이러한 검사는 JavaScript에서 액세스할 수 있는 객체의 속성(예: 해당 프로토타입)을 검사하지 않으며 일반적으로 C++ 호출 오버헤드가 있습니다.

결과는 일반적으로 값이 JavaScript에서 노출하는 속성 또는 동작 종류에 대한 보장을 제공하지 않습니다. 주로 JavaScript에서 유형 검사를 수행하려는 애드온 개발자에게 유용합니다.

API는 `require('node:util').types` 또는 `require('node:util/types')`를 통해 액세스할 수 있습니다.

### `util.types.isAnyArrayBuffer(value)` {#utiltypesisanyarraybuffervalue}

**추가됨: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 내장 [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 또는 [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 인스턴스인 경우 `true`를 반환합니다.

[`util.types.isArrayBuffer()`](/ko/nodejs/api/util#utiltypesisarraybuffervalue) 및 [`util.types.isSharedArrayBuffer()`](/ko/nodejs/api/util#utiltypesissharedarraybuffervalue)도 참조하십시오.

```js [ESM]
util.types.isAnyArrayBuffer(new ArrayBuffer());  // true 반환
util.types.isAnyArrayBuffer(new SharedArrayBuffer());  // true 반환
```
### `util.types.isArrayBufferView(value)` {#utiltypesisarraybufferviewvalue}

**추가됨: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 유형화된 배열 객체 또는 [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)와 같은 [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 뷰 중 하나의 인스턴스인 경우 `true`를 반환합니다. [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView)와 동일합니다.

```js [ESM]
util.types.isArrayBufferView(new Int8Array());  // true
util.types.isArrayBufferView(Buffer.from('hello world')); // true
util.types.isArrayBufferView(new DataView(new ArrayBuffer(16)));  // true
util.types.isArrayBufferView(new ArrayBuffer());  // false
```

### `util.types.isArgumentsObject(value)` {#utiltypesisargumentsobjectvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 `arguments` 객체이면 `true`를 반환합니다.

```js [ESM]
function foo() {
  util.types.isArgumentsObject(arguments);  // true 반환
}
```
### `util.types.isArrayBuffer(value)` {#utiltypesisarraybuffervalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 내장 [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 인스턴스이면 `true`를 반환합니다. 여기에는 [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 인스턴스가 *포함되지 않습니다*. 일반적으로 둘 다 테스트하는 것이 좋습니다. 이를 위해 [`util.types.isAnyArrayBuffer()`](/ko/nodejs/api/util#utiltypesisanyarraybuffervalue)를 참조하세요.

```js [ESM]
util.types.isArrayBuffer(new ArrayBuffer());  // true 반환
util.types.isArrayBuffer(new SharedArrayBuffer());  // false 반환
```
### `util.types.isAsyncFunction(value)` {#utiltypesisasyncfunctionvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 [비동기 함수](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)이면 `true`를 반환합니다. 이는 JavaScript 엔진이 보고 있는 것만 보고합니다. 특히 트랜스파일 도구가 사용된 경우 반환 값이 원래 소스 코드와 일치하지 않을 수 있습니다.

```js [ESM]
util.types.isAsyncFunction(function foo() {});  // false 반환
util.types.isAsyncFunction(async function foo() {});  // true 반환
```

### `util.types.isBigInt64Array(value)` {#utiltypesisbigint64arrayvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 `BigInt64Array` 인스턴스이면 `true`를 반환합니다.

```js [ESM]
util.types.isBigInt64Array(new BigInt64Array());   // Returns true
util.types.isBigInt64Array(new BigUint64Array());  // Returns false
```
### `util.types.isBigIntObject(value)` {#utiltypesisbigintobjectvalue}

**Added in: v10.4.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 BigInt 객체이면 `true`를 반환합니다. 예를 들어 `Object(BigInt(123))`으로 생성된 객체입니다.

```js [ESM]
util.types.isBigIntObject(Object(BigInt(123)));   // Returns true
util.types.isBigIntObject(BigInt(123));   // Returns false
util.types.isBigIntObject(123);  // Returns false
```
### `util.types.isBigUint64Array(value)` {#utiltypesisbiguint64arrayvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 `BigUint64Array` 인스턴스이면 `true`를 반환합니다.

```js [ESM]
util.types.isBigUint64Array(new BigInt64Array());   // Returns false
util.types.isBigUint64Array(new BigUint64Array());  // Returns true
```
### `util.types.isBooleanObject(value)` {#utiltypesisbooleanobjectvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 boolean 객체이면 `true`를 반환합니다. 예를 들어 `new Boolean()`으로 생성된 객체입니다.

```js [ESM]
util.types.isBooleanObject(false);  // Returns false
util.types.isBooleanObject(true);   // Returns false
util.types.isBooleanObject(new Boolean(false)); // Returns true
util.types.isBooleanObject(new Boolean(true));  // Returns true
util.types.isBooleanObject(Boolean(false)); // Returns false
util.types.isBooleanObject(Boolean(true));  // Returns false
```

### `util.types.isBoxedPrimitive(value)` {#utiltypesisboxedprimitivevalue}

**Added in: v10.11.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 `new Boolean()`, `new String()` 또는 `Object(Symbol())`로 생성된 박스형 원시 객체인 경우 `true`를 반환합니다.

예시:

```js [ESM]
util.types.isBoxedPrimitive(false); // false 반환
util.types.isBoxedPrimitive(new Boolean(false)); // true 반환
util.types.isBoxedPrimitive(Symbol('foo')); // false 반환
util.types.isBoxedPrimitive(Object(Symbol('foo'))); // true 반환
util.types.isBoxedPrimitive(Object(BigInt(5))); // true 반환
```
### `util.types.isCryptoKey(value)` {#utiltypesiscryptokeyvalue}

**Added in: v16.2.0**

- `value` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`value`가 [\<CryptoKey\>](/ko/nodejs/api/webcrypto#class-cryptokey)이면 `true`를 반환하고, 그렇지 않으면 `false`를 반환합니다.

### `util.types.isDataView(value)` {#utiltypesisdataviewvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 내장된 [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 인스턴스인 경우 `true`를 반환합니다.

```js [ESM]
const ab = new ArrayBuffer(20);
util.types.isDataView(new DataView(ab));  // true 반환
util.types.isDataView(new Float64Array());  // false 반환
```
[`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView)도 참조하세요.

### `util.types.isDate(value)` {#utiltypesisdatevalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 내장된 [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) 인스턴스인 경우 `true`를 반환합니다.

```js [ESM]
util.types.isDate(new Date());  // true 반환
```

### `util.types.isExternal(value)` {#utiltypesisexternalvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 네이티브 `External` 값일 경우 `true`를 반환합니다.

네이티브 `External` 값은 네이티브 코드에서 접근하기 위한 원시 C++ 포인터(`void*`)를 포함하고 다른 속성이 없는 특별한 유형의 객체입니다. 이러한 객체는 Node.js 내부 또는 네이티브 애드온에 의해 생성됩니다. JavaScript에서 이 객체는 `null` 프로토타입을 가진 [frozen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) 객체입니다.

```C [C]
#include <js_native_api.h>
#include <stdlib.h>
napi_value result;
static napi_value MyNapi(napi_env env, napi_callback_info info) {
  int* raw = (int*) malloc(1024);
  napi_status status = napi_create_external(env, (void*) raw, NULL, NULL, &result);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "napi_create_external failed");
    return NULL;
  }
  return result;
}
...
DECLARE_NAPI_PROPERTY("myNapi", MyNapi)
...
```
```js [ESM]
const native = require('napi_addon.node');
const data = native.myNapi();
util.types.isExternal(data); // true 반환
util.types.isExternal(0); // false 반환
util.types.isExternal(new String('foo')); // false 반환
```
`napi_create_external`에 대한 자세한 내용은 [`napi_create_external()`](/ko/nodejs/api/n-api#napi_create_external)을 참조하십시오.

### `util.types.isFloat32Array(value)` {#utiltypesisfloat32arrayvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 내장 [`Float32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array) 인스턴스일 경우 `true`를 반환합니다.

```js [ESM]
util.types.isFloat32Array(new ArrayBuffer());  // false 반환
util.types.isFloat32Array(new Float32Array());  // true 반환
util.types.isFloat32Array(new Float64Array());  // false 반환
```

### `util.types.isFloat64Array(value)` {#utiltypesisfloat64arrayvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 내장 [`Float64Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float64Array) 인스턴스이면 `true`를 반환합니다.

```js [ESM]
util.types.isFloat64Array(new ArrayBuffer());  // false 반환
util.types.isFloat64Array(new Uint8Array());  // false 반환
util.types.isFloat64Array(new Float64Array());  // true 반환
```
### `util.types.isGeneratorFunction(value)` {#utiltypesisgeneratorfunctionvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 제너레이터 함수이면 `true`를 반환합니다. 이는 JavaScript 엔진이 보고 있는 내용만 다시 보고합니다. 특히 변환 도구가 사용된 경우 반환 값이 원래 소스 코드와 일치하지 않을 수 있습니다.

```js [ESM]
util.types.isGeneratorFunction(function foo() {});  // false 반환
util.types.isGeneratorFunction(function* foo() {});  // true 반환
```
### `util.types.isGeneratorObject(value)` {#utiltypesisgeneratorobjectvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 내장 제너레이터 함수에서 반환된 제너레이터 객체이면 `true`를 반환합니다. 이는 JavaScript 엔진이 보고 있는 내용만 다시 보고합니다. 특히 변환 도구가 사용된 경우 반환 값이 원래 소스 코드와 일치하지 않을 수 있습니다.

```js [ESM]
function* foo() {}
const generator = foo();
util.types.isGeneratorObject(generator);  // true 반환
```
### `util.types.isInt8Array(value)` {#utiltypesisint8arrayvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 내장 [`Int8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int8Array) 인스턴스이면 `true`를 반환합니다.

```js [ESM]
util.types.isInt8Array(new ArrayBuffer());  // false 반환
util.types.isInt8Array(new Int8Array());  // true 반환
util.types.isInt8Array(new Float64Array());  // false 반환
```

### `util.types.isInt16Array(value)` {#utiltypesisint16arrayvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 내장된 [`Int16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int16Array) 인스턴스이면 `true`를 반환합니다.

```js [ESM]
util.types.isInt16Array(new ArrayBuffer());  // false 반환
util.types.isInt16Array(new Int16Array());  // true 반환
util.types.isInt16Array(new Float64Array());  // false 반환
```
### `util.types.isInt32Array(value)` {#utiltypesisint32arrayvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 내장된 [`Int32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array) 인스턴스이면 `true`를 반환합니다.

```js [ESM]
util.types.isInt32Array(new ArrayBuffer());  // false 반환
util.types.isInt32Array(new Int32Array());  // true 반환
util.types.isInt32Array(new Float64Array());  // false 반환
```
### `util.types.isKeyObject(value)` {#utiltypesiskeyobjectvalue}

**Added in: v16.2.0**

- `value` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`value`가 [\<KeyObject\>](/ko/nodejs/api/crypto#class-keyobject)이면 `true`를, 그렇지 않으면 `false`를 반환합니다.

### `util.types.isMap(value)` {#utiltypesismapvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 내장된 [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 인스턴스이면 `true`를 반환합니다.

```js [ESM]
util.types.isMap(new Map());  // true 반환
```

### `util.types.isMapIterator(value)` {#utiltypesismapiteratorvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 내장된 [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 인스턴스에 대해 반환된 이터레이터인 경우 `true`를 반환합니다.

```js [ESM]
const map = new Map();
util.types.isMapIterator(map.keys());  // Returns true
util.types.isMapIterator(map.values());  // Returns true
util.types.isMapIterator(map.entries());  // Returns true
util.types.isMapIterator(map[Symbol.iterator]());  // Returns true
```
### `util.types.isModuleNamespaceObject(value)` {#utiltypesismodulenamespaceobjectvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 [모듈 네임스페이스 객체](https://tc39.github.io/ecma262/#sec-module-namespace-exotic-objects)의 인스턴스인 경우 `true`를 반환합니다.

```js [ESM]
import * as ns from './a.js';

util.types.isModuleNamespaceObject(ns);  // Returns true
```
### `util.types.isNativeError(value)` {#utiltypesisnativeerrorvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 [내장된 `Error` 타입](https://tc39.es/ecma262/#sec-error-objects)의 생성자에 의해 반환된 경우 `true`를 반환합니다.

```js [ESM]
console.log(util.types.isNativeError(new Error()));  // true
console.log(util.types.isNativeError(new TypeError()));  // true
console.log(util.types.isNativeError(new RangeError()));  // true
```
네이티브 에러 타입의 서브클래스 또한 네이티브 에러입니다:

```js [ESM]
class MyError extends Error {}
console.log(util.types.isNativeError(new MyError()));  // true
```
값이 네이티브 에러 클래스의 `instanceof`인 것은 해당 값에 대해 `isNativeError()`가 `true`를 반환하는 것과 동일하지 않습니다. `isNativeError()`는 다른 [realm](https://tc39.es/ecma262/#realm)에서 온 에러에 대해 `true`를 반환하는 반면 `instanceof Error`는 이러한 에러에 대해 `false`를 반환합니다:

```js [ESM]
const vm = require('node:vm');
const context = vm.createContext({});
const myError = vm.runInContext('new Error()', context);
console.log(util.types.isNativeError(myError)); // true
console.log(myError instanceof Error); // false
```
반대로, `isNativeError()`는 네이티브 에러의 생성자에 의해 반환되지 않은 모든 객체에 대해 `false`를 반환합니다. 여기에는 네이티브 에러의 `instanceof`인 값이 포함됩니다:

```js [ESM]
const myError = { __proto__: Error.prototype };
console.log(util.types.isNativeError(myError)); // false
console.log(myError instanceof Error); // true
```

### `util.types.isNumberObject(value)` {#utiltypesisnumberobjectvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 숫자 객체인 경우 `true`를 반환합니다. 예: `new Number()`로 생성된 객체.

```js [ESM]
util.types.isNumberObject(0);  // false 반환
util.types.isNumberObject(new Number(0));   // true 반환
```
### `util.types.isPromise(value)` {#utiltypesispromisevalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 내장 [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)인 경우 `true`를 반환합니다.

```js [ESM]
util.types.isPromise(Promise.resolve(42));  // true 반환
```
### `util.types.isProxy(value)` {#utiltypesisproxyvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 인스턴스인 경우 `true`를 반환합니다.

```js [ESM]
const target = {};
const proxy = new Proxy(target, {});
util.types.isProxy(target);  // false 반환
util.types.isProxy(proxy);  // true 반환
```
### `util.types.isRegExp(value)` {#utiltypesisregexpvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 정규 표현식 객체인 경우 `true`를 반환합니다.

```js [ESM]
util.types.isRegExp(/abc/);  // true 반환
util.types.isRegExp(new RegExp('abc'));  // true 반환
```

### `util.types.isSet(value)` {#utiltypesissetvalue}

**추가된 버전: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 내장 [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) 인스턴스이면 `true`를 반환합니다.

```js [ESM]
util.types.isSet(new Set());  // true 반환
```
### `util.types.isSetIterator(value)` {#utiltypesissetiteratorvalue}

**추가된 버전: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 내장 [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) 인스턴스에 대해 반환된 반복기이면 `true`를 반환합니다.

```js [ESM]
const set = new Set();
util.types.isSetIterator(set.keys());  // true 반환
util.types.isSetIterator(set.values());  // true 반환
util.types.isSetIterator(set.entries());  // true 반환
util.types.isSetIterator(set[Symbol.iterator]());  // true 반환
```
### `util.types.isSharedArrayBuffer(value)` {#utiltypesissharedarraybuffervalue}

**추가된 버전: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 내장 [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 인스턴스이면 `true`를 반환합니다. 여기에는 [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 인스턴스가 *포함되지 않습니다*. 일반적으로 둘 다 테스트하는 것이 바람직합니다. 이를 위해 [`util.types.isAnyArrayBuffer()`](/ko/nodejs/api/util#utiltypesisanyarraybuffervalue)를 참조하십시오.

```js [ESM]
util.types.isSharedArrayBuffer(new ArrayBuffer());  // false 반환
util.types.isSharedArrayBuffer(new SharedArrayBuffer());  // true 반환
```

### `util.types.isStringObject(value)` {#utiltypesisstringobjectvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 문자열 객체인 경우 `true`를 반환합니다. 예를 들어 `new String()`으로 생성된 경우입니다.

```js [ESM]
util.types.isStringObject('foo');  // false 반환
util.types.isStringObject(new String('foo'));   // true 반환
```
### `util.types.isSymbolObject(value)` {#utiltypesissymbolobjectvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 심볼 객체인 경우 `true`를 반환합니다. 심볼 객체는 `Symbol` 프리미티브에서 `Object()`를 호출하여 생성됩니다.

```js [ESM]
const symbol = Symbol('foo');
util.types.isSymbolObject(symbol);  // false 반환
util.types.isSymbolObject(Object(symbol));   // true 반환
```
### `util.types.isTypedArray(value)` {#utiltypesistypedarrayvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 빌트인 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 인스턴스인 경우 `true`를 반환합니다.

```js [ESM]
util.types.isTypedArray(new ArrayBuffer());  // false 반환
util.types.isTypedArray(new Uint8Array());  // true 반환
util.types.isTypedArray(new Float64Array());  // true 반환
```
[`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView)도 확인하세요.

### `util.types.isUint8Array(value)` {#utiltypesisuint8arrayvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 빌트인 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 인스턴스인 경우 `true`를 반환합니다.

```js [ESM]
util.types.isUint8Array(new ArrayBuffer());  // false 반환
util.types.isUint8Array(new Uint8Array());  // true 반환
util.types.isUint8Array(new Float64Array());  // false 반환
```

### `util.types.isUint8ClampedArray(value)` {#utiltypesisuint8clampedarrayvalue}

**추가된 버전: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 내장 [`Uint8ClampedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray) 인스턴스이면 `true`를 반환합니다.

```js [ESM]
util.types.isUint8ClampedArray(new ArrayBuffer());  // Returns false
util.types.isUint8ClampedArray(new Uint8ClampedArray());  // Returns true
util.types.isUint8ClampedArray(new Float64Array());  // Returns false
```
### `util.types.isUint16Array(value)` {#utiltypesisuint16arrayvalue}

**추가된 버전: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 내장 [`Uint16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array) 인스턴스이면 `true`를 반환합니다.

```js [ESM]
util.types.isUint16Array(new ArrayBuffer());  // Returns false
util.types.isUint16Array(new Uint16Array());  // Returns true
util.types.isUint16Array(new Float64Array());  // Returns false
```
### `util.types.isUint32Array(value)` {#utiltypesisuint32arrayvalue}

**추가된 버전: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 내장 [`Uint32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array) 인스턴스이면 `true`를 반환합니다.

```js [ESM]
util.types.isUint32Array(new ArrayBuffer());  // Returns false
util.types.isUint32Array(new Uint32Array());  // Returns true
util.types.isUint32Array(new Float64Array());  // Returns false
```
### `util.types.isWeakMap(value)` {#utiltypesisweakmapvalue}

**추가된 버전: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 내장 [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) 인스턴스이면 `true`를 반환합니다.

```js [ESM]
util.types.isWeakMap(new WeakMap());  // Returns true
```

### `util.types.isWeakSet(value)` {#utiltypesisweaksetvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

값이 내장 [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) 인스턴스이면 `true`를 반환합니다.

```js [ESM]
util.types.isWeakSet(new WeakSet());  // true를 반환합니다.
```
## 지원 중단된 API {#deprecated-apis}

다음 API는 지원 중단되었으므로 더 이상 사용하지 않아야 합니다. 기존 애플리케이션 및 모듈은 대체 방법을 찾도록 업데이트해야 합니다.

### `util._extend(target, source)` {#util_extendtarget-source}

**Added in: v0.7.5**

**Deprecated since: v6.0.0**

::: danger [안정성: 0 - 지원 중단됨]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 지원 중단됨: 대신 [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)을(를) 사용하세요.
:::

- `target` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `source` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`util._extend()` 메서드는 내부 Node.js 모듈 외부에서 사용하도록 의도되지 않았습니다. 커뮤니티에서 이를 발견하고 어쨌든 사용했습니다.

지원 중단되었으며 새 코드에서 사용해서는 안 됩니다. JavaScript에는 [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)을(를) 통해 매우 유사한 내장 기능이 제공됩니다.

### `util.isArray(object)` {#utilisarrayobject}

**Added in: v0.6.0**

**Deprecated since: v4.0.0**

::: danger [안정성: 0 - 지원 중단됨]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 지원 중단됨: 대신 [`Array.isArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)을(를) 사용하세요.
:::

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`Array.isArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)의 별칭입니다.

제공된 `object`가 `Array`이면 `true`를 반환합니다. 그렇지 않으면 `false`를 반환합니다.

```js [ESM]
const util = require('node:util');

util.isArray([]);
// 반환: true
util.isArray(new Array());
// 반환: true
util.isArray({});
// 반환: false
```

