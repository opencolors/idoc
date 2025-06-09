---
title: Node.js REPL 문서
description: Node.js REPL(Read-Eval-Print Loop)을 탐색하여 JavaScript 코드 실행, 디버깅 및 Node.js 애플리케이션 테스트를 위한 인터랙티브한 환경을 제공합니다.
head:
  - - meta
    - name: og:title
      content: Node.js REPL 문서 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js REPL(Read-Eval-Print Loop)을 탐색하여 JavaScript 코드 실행, 디버깅 및 Node.js 애플리케이션 테스트를 위한 인터랙티브한 환경을 제공합니다.
  - - meta
    - name: twitter:title
      content: Node.js REPL 문서 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js REPL(Read-Eval-Print Loop)을 탐색하여 JavaScript 코드 실행, 디버깅 및 Node.js 애플리케이션 테스트를 위한 인터랙티브한 환경을 제공합니다.
---


# REPL {#repl}

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

**소스 코드:** [lib/repl.js](https://github.com/nodejs/node/blob/v23.5.0/lib/repl.js)

`node:repl` 모듈은 독립 실행형 프로그램 또는 다른 애플리케이션에 포함될 수 있는 REPL(Read-Eval-Print-Loop) 구현을 제공합니다. 다음과 같이 액세스할 수 있습니다.

::: code-group
```js [ESM]
import repl from 'node:repl';
```

```js [CJS]
const repl = require('node:repl');
```
:::

## 디자인 및 기능 {#design-and-features}

`node:repl` 모듈은 [`repl.REPLServer`](/ko/nodejs/api/repl#class-replserver) 클래스를 내보냅니다. 실행 중인 동안 [`repl.REPLServer`](/ko/nodejs/api/repl#class-replserver) 인스턴스는 개별 사용자 입력 줄을 수락하고 사용자 정의 평가 함수에 따라 해당 입력을 평가한 다음 결과를 출력합니다. 입력 및 출력은 각각 `stdin` 및 `stdout`에서 가져오거나 임의의 Node.js [스트림](/ko/nodejs/api/stream)에 연결할 수 있습니다.

[`repl.REPLServer`](/ko/nodejs/api/repl#class-replserver) 인스턴스는 입력 자동 완성, 완성 미리 보기, 단순한 Emacs 스타일 줄 편집, 다중 줄 입력, [ZSH](https://en.wikipedia.org/wiki/Z_shell)와 유사한 역방향 i 검색, [ZSH](https://en.wikipedia.org/wiki/Z_shell)와 유사한 부분 문자열 기반 기록 검색, ANSI 스타일 출력, 현재 REPL 세션 상태 저장 및 복원, 오류 복구 및 사용자 정의 가능한 평가 함수를 지원합니다. ANSI 스타일과 Emacs 스타일 줄 편집을 지원하지 않는 터미널은 자동으로 제한된 기능 세트로 대체됩니다.

### 명령 및 특수 키 {#commands-and-special-keys}

다음 특수 명령은 모든 REPL 인스턴스에서 지원됩니다.

- `.break`: 여러 줄 표현식을 입력하는 과정에서 `.break` 명령을 입력하거나 +를 누르면 해당 표현식의 추가 입력 또는 처리가 중단됩니다.
- `.clear`: REPL `context`를 빈 객체로 재설정하고 입력 중인 모든 여러 줄 표현식을 지웁니다.
- `.exit`: I/O 스트림을 닫아 REPL을 종료합니다.
- `.help`: 이 특수 명령 목록을 표시합니다.
- `.save`: 현재 REPL 세션을 파일에 저장합니다. `\> .save ./file/to/save.js`
- `.load`: 파일을 현재 REPL 세션으로 로드합니다. `\> .load ./file/to/load.js`
- `.editor`: 편집기 모드로 들어갑니다.(+로 완료, +로 취소).

```bash [BASH]
> .editor
// 편집기 모드 진입 (^D로 완료, ^C로 취소)
function welcome(name) {
  return `Hello ${name}!`;
}

welcome('Node.js User');

// ^D
'Hello Node.js User!'
>
```
REPL에서 다음 키 조합은 다음과 같은 특별한 효과를 갖습니다.

- +: 한 번 누르면 `.break` 명령과 같은 효과가 있습니다. 빈 줄에서 두 번 누르면 `.exit` 명령과 같은 효과가 있습니다.
- +: `.exit` 명령과 같은 효과가 있습니다.
- : 빈 줄에서 누르면 전역 및 로컬(범위) 변수를 표시합니다. 다른 입력을 입력하는 동안 누르면 관련 자동 완성 옵션을 표시합니다.

역방향 i 검색과 관련된 키 바인딩은 [`역방향 i 검색`](/ko/nodejs/api/repl#reverse-i-search)을 참조하십시오. 다른 모든 키 바인딩은 [TTY 키 바인딩](/ko/nodejs/api/readline#tty-keybindings)을 참조하십시오.


### 기본 평가 {#default-evaluation}

기본적으로 모든 [`repl.REPLServer`](/ko/nodejs/api/repl#class-replserver) 인스턴스는 JavaScript 표현식을 평가하고 Node.js 내장 모듈에 대한 액세스를 제공하는 평가 함수를 사용합니다. 이 기본 동작은 [`repl.REPLServer`](/ko/nodejs/api/repl#class-replserver) 인스턴스를 생성할 때 대체 평가 함수를 전달하여 재정의할 수 있습니다.

#### JavaScript 표현식 {#javascript-expressions}

기본 평가기는 JavaScript 표현식의 직접 평가를 지원합니다.

```bash [BASH]
> 1 + 1
2
> const m = 2
undefined
> m + 1
3
```
블록이나 함수 내에서 달리 범위가 지정되지 않는 한, 암시적으로 또는 `const`, `let` 또는 `var` 키워드를 사용하여 선언된 변수는 전역 범위에서 선언됩니다.

#### 전역 및 로컬 범위 {#global-and-local-scope}

기본 평가기는 전역 범위에 존재하는 모든 변수에 대한 액세스를 제공합니다. 각 `REPLServer`와 관련된 `context` 객체에 변수를 할당하여 REPL에 명시적으로 변수를 노출할 수 있습니다.

::: code-group
```js [ESM]
import repl from 'node:repl';
const msg = 'message';

repl.start('> ').context.m = msg;
```

```js [CJS]
const repl = require('node:repl');
const msg = 'message';

repl.start('> ').context.m = msg;
```
:::

`context` 객체의 속성은 REPL 내에서 로컬로 나타납니다.

```bash [BASH]
$ node repl_test.js
> m
'message'
```
컨텍스트 속성은 기본적으로 읽기 전용이 아닙니다. 읽기 전용 전역 변수를 지정하려면 `Object.defineProperty()`를 사용하여 컨텍스트 속성을 정의해야 합니다.

::: code-group
```js [ESM]
import repl from 'node:repl';
const msg = 'message';

const r = repl.start('> ');
Object.defineProperty(r.context, 'm', {
  configurable: false,
  enumerable: true,
  value: msg,
});
```

```js [CJS]
const repl = require('node:repl');
const msg = 'message';

const r = repl.start('> ');
Object.defineProperty(r.context, 'm', {
  configurable: false,
  enumerable: true,
  value: msg,
});
```
:::

#### 핵심 Node.js 모듈 액세스 {#accessing-core-nodejs-modules}

기본 평가기는 사용 시 Node.js 핵심 모듈을 자동으로 REPL 환경으로 로드합니다. 예를 들어, 전역 또는 범위 변수로 달리 선언되지 않은 경우 입력 `fs`는 `global.fs = require('node:fs')`로 온디맨드 방식으로 평가됩니다.

```bash [BASH]
> fs.createReadStream('./some/file');
```

#### 전역 포착되지 않은 예외 {#global-uncaught-exceptions}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v12.3.0 | 이제 repl이 독립 실행형 프로그램으로 사용되는 경우 `'uncaughtException'` 이벤트가 트리거됩니다. |
:::

REPL은 [`domain`](/ko/nodejs/api/domain) 모듈을 사용하여 해당 REPL 세션에 대해 포착되지 않은 모든 예외를 포착합니다.

REPL에서 [`domain`](/ko/nodejs/api/domain) 모듈을 사용하면 다음과 같은 부작용이 있습니다.

- 포착되지 않은 예외는 독립 실행형 REPL에서만 [`'uncaughtException'`](/ko/nodejs/api/process#event-uncaughtexception) 이벤트를 발생시킵니다. 다른 Node.js 프로그램 내의 REPL에서 이 이벤트에 대한 리스너를 추가하면 [`ERR_INVALID_REPL_INPUT`](/ko/nodejs/api/errors#err_invalid_repl_input)이 발생합니다.
- [`process.setUncaughtExceptionCaptureCallback()`](/ko/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn)을 사용하려고 하면 [`ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE`](/ko/nodejs/api/errors#err_domain_cannot_set_uncaught_exception_capture) 오류가 발생합니다.

#### `_` (밑줄) 변수 할당 {#assignment-of-the-_-underscore-variable}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v9.8.0 | `_error` 지원이 추가되었습니다. |
:::

기본 평가기는 기본적으로 가장 최근에 평가된 표현식의 결과를 특수 변수 `_` (밑줄)에 할당합니다. `_`에 값을 명시적으로 설정하면 이 동작이 비활성화됩니다.

```bash [BASH]
> [ 'a', 'b', 'c' ]
[ 'a', 'b', 'c' ]
> _.length
3
> _ += 1
이제 _에 대한 표현식 할당이 비활성화되었습니다.
4
> 1 + 1
2
> _
4
```

마찬가지로 `_error`는 마지막으로 발견된 오류가 있는 경우 해당 오류를 참조합니다. `_error`에 값을 명시적으로 설정하면 이 동작이 비활성화됩니다.

```bash [BASH]
> throw new Error('foo');
Uncaught Error: foo
> _error.message
'foo'
```
#### `await` 키워드 {#await-keyword}

`await` 키워드에 대한 지원은 최상위 수준에서 활성화됩니다.

```bash [BASH]
> await Promise.resolve(123)
123
> await Promise.reject(new Error('REPL await'))
Uncaught Error: REPL await
    at REPL2:1:54
> const timeout = util.promisify(setTimeout);
undefined
> const old = Date.now(); await timeout(1000); console.log(Date.now() - old);
1002
undefined
```

REPL에서 `await` 키워드를 사용할 때 알려진 한 가지 제한 사항은 `const` 및 `let` 키워드의 어휘 범위 지정이 무효화된다는 것입니다.

예를 들어:

```bash [BASH]
> const m = await Promise.resolve(123)
undefined
> m
123
> const m = await Promise.resolve(234)
undefined
> m
234
```

[`--no-experimental-repl-await`](/ko/nodejs/api/cli#--no-experimental-repl-await)는 REPL에서 최상위 await을 비활성화합니다.


### 역방향 i-search {#reverse-i-search}

**추가된 버전: v13.6.0, v12.17.0**

REPL은 [ZSH](https://en.wikipedia.org/wiki/Z_shell)와 유사한 양방향 역방향 i-search를 지원합니다. 뒤로 검색하려면 +를 누르고, 앞으로 검색하려면 +를 누르면 트리거됩니다.

중복된 기록 항목은 건너뜁니다.

항목은 역방향 검색에 해당하지 않는 키를 누르는 즉시 허용됩니다. 취소는  또는 +를 눌러 가능합니다.

방향을 변경하면 예상되는 방향에서 현재 위치에서 다음 항목을 즉시 검색합니다.

### 사용자 정의 평가 함수 {#custom-evaluation-functions}

새 [`repl.REPLServer`](/ko/nodejs/api/repl#class-replserver)가 생성될 때 사용자 정의 평가 함수를 제공할 수 있습니다. 예를 들어 이를 사용하여 완전히 사용자 정의된 REPL 애플리케이션을 구현할 수 있습니다.

다음은 주어진 숫자를 제곱하는 REPL의 예입니다.

::: code-group
```js [ESM]
import repl from 'node:repl';

function byThePowerOfTwo(number) {
  return number * number;
}

function myEval(cmd, context, filename, callback) {
  callback(null, byThePowerOfTwo(cmd));
}

repl.start({ prompt: 'Enter a number: ', eval: myEval });
```

```js [CJS]
const repl = require('node:repl');

function byThePowerOfTwo(number) {
  return number * number;
}

function myEval(cmd, context, filename, callback) {
  callback(null, byThePowerOfTwo(cmd));
}

repl.start({ prompt: 'Enter a number: ', eval: myEval });
```
:::

#### 복구 가능한 오류 {#recoverable-errors}

REPL 프롬프트에서 를 누르면 현재 입력 줄이 `eval` 함수로 전송됩니다. 다중 줄 입력을 지원하기 위해 `eval` 함수는 제공된 콜백 함수에 `repl.Recoverable`의 인스턴스를 반환할 수 있습니다.

```js [ESM]
function myEval(cmd, context, filename, callback) {
  let result;
  try {
    result = vm.runInThisContext(cmd);
  } catch (e) {
    if (isRecoverableError(e)) {
      return callback(new repl.Recoverable(e));
    }
  }
  callback(null, result);
}

function isRecoverableError(error) {
  if (error.name === 'SyntaxError') {
    return /^(Unexpected end of input|Unexpected token)/.test(error.message);
  }
  return false;
}
```

### REPL 출력 사용자 정의하기 {#customizing-repl-output}

기본적으로 [`repl.REPLServer`](/ko/nodejs/api/repl#class-replserver) 인스턴스는 제공된 `Writable` 스트림(기본값은 `process.stdout`)에 출력을 쓰기 전에 [`util.inspect()`](/ko/nodejs/api/util#utilinspectobject-options) 메서드를 사용하여 출력을 포맷합니다. `showProxy` 검사 옵션은 기본적으로 true로 설정되고 `colors` 옵션은 REPL의 `useColors` 옵션에 따라 true로 설정됩니다.

`useColors` 부울 옵션은 생성 시에 지정하여 기본 작성기가 `util.inspect()` 메서드의 출력을 색상화하기 위해 ANSI 스타일 코드를 사용하도록 지시할 수 있습니다.

REPL이 독립 실행형 프로그램으로 실행되는 경우 REPL 내부에서 [`util.inspect()`](/ko/nodejs/api/util#utilinspectobject-options)의 `defaultOptions`를 미러링하는 `inspect.replDefaults` 속성을 사용하여 REPL의 [검사 기본값](/ko/nodejs/api/util#utilinspectobject-options)을 변경할 수도 있습니다.

```bash [BASH]
> util.inspect.replDefaults.compact = false;
false
> [1]
[
  1
]
>
```
[`repl.REPLServer`](/ko/nodejs/api/repl#class-replserver) 인스턴스의 출력을 완전히 사용자 정의하려면 생성 시에 `writer` 옵션에 대한 새 함수를 전달하십시오. 예를 들어 다음 예제는 모든 입력 텍스트를 대문자로 변환합니다.

::: code-group
```js [ESM]
import repl from 'node:repl';

const r = repl.start({ prompt: '> ', eval: myEval, writer: myWriter });

function myEval(cmd, context, filename, callback) {
  callback(null, cmd);
}

function myWriter(output) {
  return output.toUpperCase();
}
```

```js [CJS]
const repl = require('node:repl');

const r = repl.start({ prompt: '> ', eval: myEval, writer: myWriter });

function myEval(cmd, context, filename, callback) {
  callback(null, cmd);
}

function myWriter(output) {
  return output.toUpperCase();
}
```
:::

## 클래스: `REPLServer` {#class-replserver}

**추가된 버전: v0.1.91**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [`repl.start()`](/ko/nodejs/api/repl#replstartoptions) 참조
- 확장: [\<readline.Interface\>](/ko/nodejs/api/readline#class-readlineinterface)

`repl.REPLServer`의 인스턴스는 [`repl.start()`](/ko/nodejs/api/repl#replstartoptions) 메서드를 사용하거나 JavaScript `new` 키워드를 직접 사용하여 생성됩니다.

::: code-group
```js [ESM]
import repl from 'node:repl';

const options = { useColors: true };

const firstInstance = repl.start(options);
const secondInstance = new repl.REPLServer(options);
```

```js [CJS]
const repl = require('node:repl');

const options = { useColors: true };

const firstInstance = repl.start(options);
const secondInstance = new repl.REPLServer(options);
```
:::


### Event: `'exit'` {#event-exit}

**Added in: v0.7.7**

`'exit'` 이벤트는 REPL이 종료될 때 발생합니다. REPL은 `.exit` 명령어를 입력받거나, 사용자가 + 키를 두 번 눌러 `SIGINT` 시그널을 보내거나, + 키를 눌러 입력 스트림에 `'end'` 시그널을 보내는 방식으로 종료될 수 있습니다. 리스너 콜백은 인자 없이 호출됩니다.

```js [ESM]
replServer.on('exit', () => {
  console.log('REPL에서 "exit" 이벤트를 받았습니다!');
  process.exit();
});
```
### Event: `'reset'` {#event-reset}

**Added in: v0.11.0**

`'reset'` 이벤트는 REPL의 컨텍스트가 재설정될 때 발생합니다. 이는 REPL이 기본 평가기를 사용하고 `repl.REPLServer` 인스턴스가 `useGlobal` 옵션을 `true`로 설정하여 생성된 경우가 *아닌 한*, `.clear` 명령어가 입력으로 수신될 때마다 발생합니다. 리스너 콜백은 `context` 객체에 대한 참조와 함께 유일한 인수로 호출됩니다.

이는 주로 REPL 컨텍스트를 미리 정의된 상태로 다시 초기화하는 데 사용할 수 있습니다.

::: code-group
```js [ESM]
import repl from 'node:repl';

function initializeContext(context) {
  context.m = 'test';
}

const r = repl.start({ prompt: '> ' });
initializeContext(r.context);

r.on('reset', initializeContext);
```

```js [CJS]
const repl = require('node:repl');

function initializeContext(context) {
  context.m = 'test';
}

const r = repl.start({ prompt: '> ' });
initializeContext(r.context);

r.on('reset', initializeContext);
```
:::

이 코드가 실행되면 전역 `'m'` 변수를 수정할 수 있지만 `.clear` 명령어를 사용하여 초기 값으로 재설정할 수 있습니다.

```bash [BASH]
$ ./node example.js
> m
'test'
> m = 1
1
> m
1
> .clear
Clearing context...
> m
'test'
>
```
### `replServer.defineCommand(keyword, cmd)` {#replserverdefinecommandkeyword-cmd}

**Added in: v0.3.0**

- `keyword` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 명령어 키워드 (앞에 `.` 문자가 *없음*).
- `cmd` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 명령어가 처리될 때 호출될 함수.

`replServer.defineCommand()` 메서드는 새로운 `.` 접두사가 붙은 명령어를 REPL 인스턴스에 추가하는 데 사용됩니다. 이러한 명령어는 `.` 다음에 `keyword`를 입력하여 호출됩니다. `cmd`는 `Function`이거나 다음 속성을 가진 `Object`입니다.

- `help` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `.help`를 입력했을 때 표시될 도움말 텍스트 (선택 사항).
- `action` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 실행할 함수이며 선택적으로 단일 문자열 인수를 허용합니다.

다음 예제는 REPL 인스턴스에 추가된 두 개의 새로운 명령어를 보여줍니다.

::: code-group
```js [ESM]
import repl from 'node:repl';

const replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('sayhello', {
  help: 'Say hello',
  action(name) {
    this.clearBufferedCommand();
    console.log(`Hello, ${name}!`);
    this.displayPrompt();
  },
});
replServer.defineCommand('saybye', function saybye() {
  console.log('Goodbye!');
  this.close();
});
```

```js [CJS]
const repl = require('node:repl');

const replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('sayhello', {
  help: 'Say hello',
  action(name) {
    this.clearBufferedCommand();
    console.log(`Hello, ${name}!`);
    this.displayPrompt();
  },
});
replServer.defineCommand('saybye', function saybye() {
  console.log('Goodbye!');
  this.close();
});
```
:::

새로운 명령어는 REPL 인스턴스 내에서 사용할 수 있습니다.

```bash [BASH]
> .sayhello Node.js User
Hello, Node.js User!
> .saybye
Goodbye!
```

### `replServer.displayPrompt([preserveCursor])` {#replserverdisplaypromptpreservecursor}

**Added in: v0.1.91**

- `preserveCursor` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`replServer.displayPrompt()` 메서드는 사용자로부터 입력을 받을 수 있도록 REPL 인스턴스를 준비하고, 구성된 `prompt`를 `output`의 새 줄에 출력하고, 새 입력을 받기 위해 `input`을 재개합니다.

여러 줄의 입력이 입력되면 'prompt' 대신 줄임표가 출력됩니다.

`preserveCursor`가 `true`이면 커서 위치가 `0`으로 재설정되지 않습니다.

`replServer.displayPrompt` 메서드는 주로 `replServer.defineCommand()` 메서드를 사용하여 등록된 명령에 대한 액션 함수 내에서 호출하도록 설계되었습니다.

### `replServer.clearBufferedCommand()` {#replserverclearbufferedcommand}

**Added in: v9.0.0**

`replServer.clearBufferedCommand()` 메서드는 버퍼링되었지만 아직 실행되지 않은 명령을 모두 지웁니다. 이 메서드는 주로 `replServer.defineCommand()` 메서드를 사용하여 등록된 명령에 대한 액션 함수 내에서 호출하도록 설계되었습니다.

### `replServer.setupHistory(historyPath, callback)` {#replserversetuphistoryhistorypath-callback}

**Added in: v11.10.0**

- `historyPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 히스토리 파일의 경로
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 히스토리 쓰기가 준비되거나 오류 발생 시 호출됨
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `repl` [\<repl.REPLServer\>](/ko/nodejs/api/repl#class-replserver)
  
 

REPL 인스턴스에 대한 히스토리 로그 파일을 초기화합니다. Node.js 바이너리를 실행하고 명령줄 REPL을 사용하는 경우 히스토리 파일이 기본적으로 초기화됩니다. 그러나 프로그래밍 방식으로 REPL을 생성하는 경우에는 그렇지 않습니다. 프로그래밍 방식으로 REPL 인스턴스를 사용할 때 히스토리 로그 파일을 초기화하려면 이 메서드를 사용하십시오.

## `repl.builtinModules` {#replbuiltinmodules}

**Added in: v14.5.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

모든 Node.js 모듈의 이름 목록 (예: `'http'`).


## `repl.start([options])` {#replstartoptions}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v13.4.0, v12.17.0 | 이제 `preview` 옵션을 사용할 수 있습니다. |
| v12.0.0 | `terminal` 옵션이 이제 모든 경우에 기본 설명을 따르고 `useColors`는 사용 가능한 경우 `hasColors()`를 확인합니다. |
| v10.0.0 | `REPL_MAGIC_MODE` `replMode`가 제거되었습니다. |
| v6.3.0 | 이제 `breakEvalOnSigint` 옵션이 지원됩니다. |
| v5.8.0 | 이제 `options` 매개변수가 선택 사항입니다. |
| v0.1.91 | v0.1.91에서 추가됨 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 표시할 입력 프롬프트입니다. **기본값:** `'\> '` (뒤에 공백 포함).
    - `input` [\<stream.Readable\>](/ko/nodejs/api/stream#class-streamreadable) REPL 입력이 읽혀질 `Readable` 스트림입니다. **기본값:** `process.stdin`.
    - `output` [\<stream.Writable\>](/ko/nodejs/api/stream#class-streamwritable) REPL 출력이 쓰여질 `Writable` 스트림입니다. **기본값:** `process.stdout`.
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우, `output`이 TTY 터미널로 취급되어야 함을 지정합니다. **기본값:** 인스턴스화 시 `output` 스트림에서 `isTTY` 속성의 값을 확인합니다.
    - `eval` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 주어진 각 입력 줄을 평가할 때 사용할 함수입니다. **기본값:** JavaScript `eval()` 함수에 대한 비동기 래퍼입니다. `eval` 함수는 입력이 불완전함을 나타내고 추가 줄을 묻는 `repl.Recoverable`로 오류를 발생시킬 수 있습니다.
    - `useColors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우, 기본 `writer` 함수가 REPL 출력에 ANSI 색상 스타일을 포함해야 함을 지정합니다. 사용자 정의 `writer` 함수가 제공되면 이는 아무런 영향을 미치지 않습니다. **기본값:** REPL 인스턴스의 `terminal` 값이 `true`인 경우 `output` 스트림에서 색상 지원을 확인합니다.
    - `useGlobal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우, 기본 평가 함수가 REPL 인스턴스에 대한 새 분리된 컨텍스트를 만드는 대신 JavaScript `global`을 컨텍스트로 사용함을 지정합니다. 노드 CLI REPL은 이 값을 `true`로 설정합니다. **기본값:** `false`.
    - `ignoreUndefined` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우, 기본 작성기가 `undefined`로 평가되는 경우 명령의 반환 값을 출력하지 않도록 지정합니다. **기본값:** `false`.
    - `writer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `output`에 쓰기 전에 각 명령의 출력을 포맷하기 위해 호출할 함수입니다. **기본값:** [`util.inspect()`](/ko/nodejs/api/util#utilinspectobject-options).
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 사용자 정의 Tab 자동 완성에 사용되는 선택적 함수입니다. 예제는 [`readline.InterfaceCompleter`](/ko/nodejs/api/readline#use-of-the-completer-function)를 참조하십시오.
    - `replMode` [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) 기본 평가기가 모든 JavaScript 명령을 엄격 모드 또는 기본(허술한) 모드로 실행할지 여부를 지정하는 플래그입니다. 허용되는 값은 다음과 같습니다.
    - 허술한 모드에서 표현식을 평가하는 `repl.REPL_MODE_SLOPPY`입니다.
    - 엄격 모드에서 표현식을 평가하는 `repl.REPL_MODE_STRICT`입니다. 이는 모든 REPL 문 앞에 `'use strict'`를 붙이는 것과 같습니다.


    - `breakEvalOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `SIGINT`가 수신될 때, 예를 들어 + 키를 누를 때 현재 코드 조각의 평가를 중지합니다. 이는 사용자 정의 `eval` 함수와 함께 사용할 수 없습니다. **기본값:** `false`.
    - `preview` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 자동 완성 및 출력 미리보기를 인쇄할지 여부를 정의합니다. **기본값:** 기본 eval 함수를 사용하는 경우 `true`, 사용자 정의 eval 함수를 사용하는 경우 `false`입니다. `terminal`이 falsy인 경우 미리보기가 없으며 `preview` 값은 영향을 미치지 않습니다.


- 반환: [\<repl.REPLServer\>](/ko/nodejs/api/repl#class-replserver)

`repl.start()` 메서드는 [`repl.REPLServer`](/ko/nodejs/api/repl#class-replserver) 인스턴스를 생성하고 시작합니다.

`options`가 문자열인 경우 입력 프롬프트를 지정합니다.

::: code-group
```js [ESM]
import repl from 'node:repl';

// 유닉스 스타일 프롬프트
repl.start('$ ');
```

```js [CJS]
const repl = require('node:repl');

// 유닉스 스타일 프롬프트
repl.start('$ ');
```
:::


## Node.js REPL {#the-nodejs-repl}

Node.js 자체는 JavaScript 실행을 위한 자체 대화형 인터페이스를 제공하기 위해 `node:repl` 모듈을 사용합니다. 이는 인수를 전달하지 않고 (또는 `-i` 인수를 전달하여) Node.js 바이너리를 실행하여 사용할 수 있습니다.

```bash [BASH]
$ node
> const a = [1, 2, 3];
undefined
> a
[ 1, 2, 3 ]
> a.forEach((v) => {
...   console.log(v);
...   });
1
2
3
```
### 환경 변수 옵션 {#environment-variable-options}

Node.js REPL의 다양한 동작은 다음 환경 변수를 사용하여 사용자 정의할 수 있습니다.

- `NODE_REPL_HISTORY`: 유효한 경로가 주어지면 영구 REPL 기록이 사용자 홈 디렉터리의 `.node_repl_history` 대신 지정된 파일에 저장됩니다. 이 값을 `''` (빈 문자열)로 설정하면 영구 REPL 기록이 비활성화됩니다. 값에서 공백이 제거됩니다. Windows 플랫폼에서는 빈 값을 가진 환경 변수가 유효하지 않으므로 영구 REPL 기록을 비활성화하려면 이 변수를 하나 이상의 공백으로 설정하십시오.
- `NODE_REPL_HISTORY_SIZE`: 기록을 사용할 수 있는 경우 유지할 기록 줄 수를 제어합니다. 양수여야 합니다. **기본값:** `1000`.
- `NODE_REPL_MODE`: `'sloppy'` 또는 `'strict'`일 수 있습니다. **기본값:** `'sloppy'`이며, 비엄격 모드 코드를 실행할 수 있습니다.

### 영구 기록 {#persistent-history}

기본적으로 Node.js REPL은 사용자 홈 디렉터리에 있는 `.node_repl_history` 파일에 입력을 저장하여 `node` REPL 세션 간에 기록을 유지합니다. 이는 환경 변수 `NODE_REPL_HISTORY=''`를 설정하여 비활성화할 수 있습니다.

### 고급 라인 편집기와 함께 Node.js REPL 사용 {#using-the-nodejs-repl-with-advanced-line-editors}

고급 라인 편집기의 경우 환경 변수 `NODE_NO_READLINE=1`로 Node.js를 시작하십시오. 이렇게 하면 주 REPL과 디버거 REPL이 정규 터미널 설정으로 시작되어 `rlwrap`과 함께 사용할 수 있습니다.

예를 들어 다음을 `.bashrc` 파일에 추가할 수 있습니다.

```bash [BASH]
alias node="env NODE_NO_READLINE=1 rlwrap node"
```
### 단일 실행 인스턴스에 대해 여러 REPL 인스턴스 시작 {#starting-multiple-repl-instances-against-a-single-running-instance}

단일 `global` 객체를 공유하지만 별도의 I/O 인터페이스를 가진 Node.js의 단일 실행 인스턴스에 대해 여러 REPL 인스턴스를 만들고 실행할 수 있습니다.

예를 들어 다음 예제는 `stdin`, Unix 소켓 및 TCP 소켓에 별도의 REPL을 제공합니다.

::: code-group
```js [ESM]
import net from 'node:net';
import repl from 'node:repl';
import process from 'node:process';

let connections = 0;

repl.start({
  prompt: 'Node.js via stdin> ',
  input: process.stdin,
  output: process.stdout,
});

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via Unix socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen('/tmp/node-repl-sock');

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via TCP socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen(5001);
```

```js [CJS]
const net = require('node:net');
const repl = require('node:repl');
let connections = 0;

repl.start({
  prompt: 'Node.js via stdin> ',
  input: process.stdin,
  output: process.stdout,
});

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via Unix socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen('/tmp/node-repl-sock');

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via TCP socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen(5001);
```
:::

명령줄에서 이 응용 프로그램을 실행하면 stdin에서 REPL이 시작됩니다. 다른 REPL 클라이언트는 Unix 소켓 또는 TCP 소켓을 통해 연결할 수 있습니다. 예를 들어 `telnet`은 TCP 소켓에 연결하는 데 유용하고, `socat`은 Unix 및 TCP 소켓에 모두 연결하는 데 사용할 수 있습니다.

stdin 대신 Unix 소켓 기반 서버에서 REPL을 시작하면 다시 시작하지 않고도 장기 실행 Node.js 프로세스에 연결할 수 있습니다.

`net.Server` 및 `net.Socket` 인스턴스를 통해 "완전한 기능" (`terminal`) REPL을 실행하는 예는 [https://gist.github.com/TooTallNate/2209310](https://gist.github.com/TooTallNate/2209310)을 참조하십시오.

[`curl(1)`](https://curl.haxx.se/docs/manpage)을 통해 REPL 인스턴스를 실행하는 예는 [https://gist.github.com/TooTallNate/2053342](https://gist.github.com/TooTallNate/2053342)를 참조하십시오.

이 예제는 Node.js REPL을 다양한 I/O 스트림을 사용하여 시작할 수 있는 방법을 보여주기 위한 순전히 교육적인 목적입니다. 추가 보호 조치 없이 프로덕션 환경이나 보안이 중요한 모든 컨텍스트에서 **사용해서는 안 됩니다**. 실제 응용 프로그램에서 REPL을 구현해야 하는 경우 보안 입력 메커니즘을 사용하고 개방형 네트워크 인터페이스를 피하는 등 이러한 위험을 완화하는 대체 접근 방식을 고려하십시오.

