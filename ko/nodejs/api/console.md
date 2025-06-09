---
title: Node.js 콘솔 API 문서
description: Node.js 콘솔 API는 웹 브라우저가 제공하는 JavaScript 콘솔 메커니즘과 유사한 간단한 디버깅 콘솔을 제공합니다. 이 문서에서는 Node.js 환경에서 JavaScript 객체의 로깅, 디버깅 및 검사를 위한 사용 가능한 메서드를 자세히 설명합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 콘솔 API 문서 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 콘솔 API는 웹 브라우저가 제공하는 JavaScript 콘솔 메커니즘과 유사한 간단한 디버깅 콘솔을 제공합니다. 이 문서에서는 Node.js 환경에서 JavaScript 객체의 로깅, 디버깅 및 검사를 위한 사용 가능한 메서드를 자세히 설명합니다.
  - - meta
    - name: twitter:title
      content: Node.js 콘솔 API 문서 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 콘솔 API는 웹 브라우저가 제공하는 JavaScript 콘솔 메커니즘과 유사한 간단한 디버깅 콘솔을 제공합니다. 이 문서에서는 Node.js 환경에서 JavaScript 객체의 로깅, 디버깅 및 검사를 위한 사용 가능한 메서드를 자세히 설명합니다.
---


# Console {#console}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적임
:::

**소스 코드:** [lib/console.js](https://github.com/nodejs/node/blob/v23.5.0/lib/console.js)

`node:console` 모듈은 웹 브라우저에서 제공하는 JavaScript 콘솔 메커니즘과 유사한 간단한 디버깅 콘솔을 제공합니다.

이 모듈은 두 가지 특정 구성 요소를 내보냅니다.

- 모든 Node.js 스트림에 쓰는 데 사용할 수 있는 `console.log()`, `console.error()`, `console.warn()`과 같은 메서드가 있는 `Console` 클래스.
- [`process.stdout`](/ko/nodejs/api/process#processstdout) 및 [`process.stderr`](/ko/nodejs/api/process#processstderr)에 쓰도록 구성된 전역 `console` 인스턴스. 전역 `console`은 `require('node:console')`을 호출하지 않고도 사용할 수 있습니다.

*<strong>경고</strong>*: 전역 console 객체의 메서드는 브라우저 API와 유사하게 일관적으로 동기적이지도 않고 다른 모든 Node.js 스트림과 같이 일관적으로 비동기적이지도 않습니다. 콘솔 함수의 동기/비동기 동작에 의존하려는 프로그램은 먼저 콘솔의 지원 스트림의 특성을 파악해야 합니다. 이는 스트림이 기본 플랫폼과 현재 프로세스의 표준 스트림 구성에 따라 다르기 때문입니다. 자세한 내용은 [프로세스 I/O에 대한 참고 사항](/ko/nodejs/api/process#a-note-on-process-io)을 참조하십시오.

전역 `console`을 사용하는 예:

```js [ESM]
console.log('hello world');
// stdout에 출력: hello world
console.log('hello %s', 'world');
// stdout에 출력: hello world
console.error(new Error('Whoops, something bad happened'));
// stderr에 오류 메시지 및 스택 추적을 출력합니다.
//   Error: Whoops, something bad happened
//     at [eval]:5:15
//     at Script.runInThisContext (node:vm:132:18)
//     at Object.runInThisContext (node:vm:309:38)
//     at node:internal/process/execution:77:19
//     at [eval]-wrapper:6:22
//     at evalScript (node:internal/process/execution:76:60)
//     at node:internal/main/eval_string:23:3

const name = 'Will Robinson';
console.warn(`Danger ${name}! Danger!`);
// stderr에 출력: Danger Will Robinson! Danger!
```
`Console` 클래스를 사용하는 예:

```js [ESM]
const out = getStreamSomehow();
const err = getStreamSomehow();
const myConsole = new console.Console(out, err);

myConsole.log('hello world');
// out에 출력: hello world
myConsole.log('hello %s', 'world');
// out에 출력: hello world
myConsole.error(new Error('Whoops, something bad happened'));
// err에 출력: [Error: Whoops, something bad happened]

const name = 'Will Robinson';
myConsole.warn(`Danger ${name}! Danger!`);
// err에 출력: Danger Will Robinson! Danger!
```

## 클래스: `Console` {#class-console}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v8.0.0 | 기본 스트림에 쓰는 동안 발생하는 오류는 기본적으로 무시됩니다. |
:::

`Console` 클래스를 사용하여 구성 가능한 출력 스트림이 있는 간단한 로거를 만들 수 있으며 `require('node:console').Console` 또는 `console.Console` (또는 해당 구조 분해된 대응 항목)을 사용하여 액세스할 수 있습니다.

::: code-group
```js [ESM]
import { Console } from 'node:console';
```

```js [CJS]
const { Console } = require('node:console');
```
:::

```js [ESM]
const { Console } = console;
```
### `new Console(stdout[, stderr][, ignoreErrors])` {#new-consolestdout-stderr-ignoreerrors}

### `new Console(options)` {#new-consoleoptions}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.2.0, v12.17.0 | `groupIndentation` 옵션이 도입되었습니다. |
| v11.7.0 | `inspectOptions` 옵션이 도입되었습니다. |
| v10.0.0 | `Console` 생성자는 이제 `options` 인수를 지원하며 `colorMode` 옵션이 도입되었습니다. |
| v8.0.0 | `ignoreErrors` 옵션이 도입되었습니다. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `stdout` [\<stream.Writable\>](/ko/nodejs/api/stream#class-streamwritable)
    - `stderr` [\<stream.Writable\>](/ko/nodejs/api/stream#class-streamwritable)
    - `ignoreErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 기본 스트림에 쓸 때 오류를 무시합니다. **기본값:** `true`.
    - `colorMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 이 `Console` 인스턴스에 대한 색상 지원을 설정합니다. `true`로 설정하면 값을 검사하는 동안 색상이 활성화됩니다. `false`로 설정하면 값을 검사하는 동안 색상이 비활성화됩니다. `'auto'`로 설정하면 색상 지원이 `isTTY` 속성 값과 각 스트림에서 `getColorDepth()`가 반환한 값에 따라 달라집니다. `inspectOptions.colors`도 설정된 경우 이 옵션을 사용할 수 없습니다. **기본값:** `'auto'`.
    - `inspectOptions` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`util.inspect()`](/ko/nodejs/api/util#utilinspectobject-options)로 전달되는 옵션을 지정합니다.
    - `groupIndentation` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 그룹 들여쓰기를 설정합니다. **기본값:** `2`.

하나 또는 두 개의 쓰기 가능한 스트림 인스턴스로 새 `Console`을 만듭니다. `stdout`은 로그 또는 정보 출력을 인쇄하는 쓰기 가능한 스트림입니다. `stderr`는 경고 또는 오류 출력에 사용됩니다. `stderr`가 제공되지 않으면 `stdout`이 `stderr`에 사용됩니다.

::: code-group
```js [ESM]
import { createWriteStream } from 'node:fs';
import { Console } from 'node:console';
// Alternatively
// const { Console } = console;

const output = createWriteStream('./stdout.log');
const errorOutput = createWriteStream('./stderr.log');
// Custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
// In stdout.log: count 5
```

```js [CJS]
const fs = require('node:fs');
const { Console } = require('node:console');
// Alternatively
// const { Console } = console;

const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
// Custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
// In stdout.log: count 5
```
:::

전역 `console`은 출력이 [`process.stdout`](/ko/nodejs/api/process#processstdout) 및 [`process.stderr`](/ko/nodejs/api/process#processstderr)로 전송되는 특수 `Console`입니다. 이는 다음을 호출하는 것과 같습니다.

```js [ESM]
new Console({ stdout: process.stdout, stderr: process.stderr });
```

### `console.assert(value[, ...message])` {#consoleassertvalue-message}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 구현이 이제 사양을 준수하며 더 이상 오류를 발생시키지 않습니다. |
| v0.1.101 | 추가됨: v0.1.101 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 참으로 테스트되는 값입니다.
- `...message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `value`를 제외한 모든 인수는 오류 메시지로 사용됩니다.

`console.assert()`는 `value`가 [거짓](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)이거나 생략된 경우 메시지를 작성합니다. 메시지만 작성하고 실행에 다른 영향을 주지 않습니다. 출력은 항상 `"Assertion failed"`로 시작합니다. 제공된 경우 `message`는 [`util.format()`](/ko/nodejs/api/util#utilformatformat-args)을 사용하여 형식이 지정됩니다.

`value`가 [참](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)이면 아무 일도 일어나지 않습니다.

```js [ESM]
console.assert(true, 'does nothing');

console.assert(false, 'Whoops %s work', 'didn\'t');
// Assertion failed: Whoops didn't work

console.assert();
// Assertion failed
```
### `console.clear()` {#consoleclear}

**추가됨: v8.3.0**

`stdout`이 TTY인 경우 `console.clear()`를 호출하면 TTY를 지우려고 시도합니다. `stdout`이 TTY가 아니면 이 메서드는 아무것도 수행하지 않습니다.

`console.clear()`의 특정 작업은 운영 체제 및 터미널 유형에 따라 다를 수 있습니다. 대부분의 Linux 운영 체제에서 `console.clear()`는 `clear` 셸 명령과 유사하게 작동합니다. Windows에서 `console.clear()`는 Node.js 바이너리의 현재 터미널 뷰포트의 출력만 지웁니다.

### `console.count([label])` {#consolecountlabel}

**추가됨: v8.3.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 카운터의 표시 레이블입니다. **기본값:** `'default'`.

`label`에 특정한 내부 카운터를 유지하고 주어진 `label`로 `console.count()`가 호출된 횟수를 `stdout`으로 출력합니다.

```js [ESM]
> console.count()
default: 1
undefined
> console.count('default')
default: 2
undefined
> console.count('abc')
abc: 1
undefined
> console.count('xyz')
xyz: 1
undefined
> console.count('abc')
abc: 2
undefined
> console.count()
default: 3
undefined
>
```

### `console.countReset([label])` {#consolecountresetlabel}

**Added in: v8.3.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 카운터의 표시 레이블입니다. **기본값:** `'default'`.

`label`에 해당하는 내부 카운터를 재설정합니다.

```js [ESM]
> console.count('abc');
abc: 1
undefined
> console.countReset('abc');
undefined
> console.count('abc');
abc: 1
undefined
>
```
### `console.debug(data[, ...args])` {#consoledebugdata-args}


::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v8.10.0 | `console.debug`는 이제 `console.log`의 별칭입니다. |
| v8.0.0 | Added in: v8.0.0 |
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`console.debug()` 함수는 [`console.log()`](/ko/nodejs/api/console#consolelogdata-args)의 별칭입니다.

### `console.dir(obj[, options])` {#consoledirobj-options}

**Added in: v0.1.101**

- `obj` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `showHidden` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 객체의 열거 불가능 및 심볼 속성도 표시됩니다. **기본값:** `false`.
    - `depth` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 객체를 포맷하는 동안 얼마나 많이 재귀할지 [`util.inspect()`](/ko/nodejs/api/util#utilinspectobject-options)에 알려줍니다. 이는 크고 복잡한 객체를 검사하는 데 유용합니다. 무한정 재귀하도록 하려면 `null`을 전달합니다. **기본값:** `2`.
    - `colors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 출력이 ANSI 색상 코드로 스타일 지정됩니다. 색상은 사용자 정의할 수 있습니다. [ `util.inspect()` 색상 사용자 정의](/ko/nodejs/api/util#customizing-utilinspect-colors)를 참조하십시오. **기본값:** `false`.
  
 

`obj`에 대해 [`util.inspect()`](/ko/nodejs/api/util#utilinspectobject-options)를 사용하고 결과 문자열을 `stdout`에 출력합니다. 이 함수는 `obj`에 정의된 모든 사용자 정의 `inspect()` 함수를 무시합니다.


### `console.dirxml(...data)` {#consoledirxmldata}

::: info [History]
| Version | Changes |
| --- | --- |
| v9.3.0 | `console.dirxml`은 이제 인수들에 대해 `console.log`를 호출합니다. |
| v8.0.0 | 추가됨: v8.0.0 |
:::

- `...data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

이 메서드는 받은 인수를 전달하여 `console.log()`를 호출합니다. 이 메서드는 XML 형식을 생성하지 않습니다.

### `console.error([data][, ...args])` {#consoleerrordata-args}

**추가됨: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

줄바꿈과 함께 `stderr`에 출력합니다. 여러 인수를 전달할 수 있으며, 첫 번째 인수는 주 메시지로 사용되고 모든 추가 인수는 [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3)와 유사한 대체 값으로 사용됩니다 (인수는 모두 [`util.format()`](/ko/nodejs/api/util#utilformatformat-args)에 전달됩니다).

```js [ESM]
const code = 5;
console.error('error #%d', code);
// stderr에 error #5 출력
console.error('error', code);
// stderr에 error 5 출력
```
포맷 요소(예: `%d`)가 첫 번째 문자열에서 발견되지 않으면 각 인수에 대해 [`util.inspect()`](/ko/nodejs/api/util#utilinspectobject-options)가 호출되고 결과 문자열 값이 연결됩니다. 자세한 내용은 [`util.format()`](/ko/nodejs/api/util#utilformatformat-args)을 참조하세요.

### `console.group([...label])` {#consolegrouplabel}

**추가됨: v8.5.0**

- `...label` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

이후 줄의 들여쓰기를 `groupIndentation` 길이만큼 공백으로 늘립니다.

하나 이상의 `label`이 제공되면 추가 들여쓰기 없이 먼저 인쇄됩니다.

### `console.groupCollapsed()` {#consolegroupcollapsed}

**추가됨: v8.5.0**

[`console.group()`](/ko/nodejs/api/console#consolegrouplabel)의 별칭입니다.

### `console.groupEnd()` {#consolegroupend}

**추가됨: v8.5.0**

이후 줄의 들여쓰기를 `groupIndentation` 길이만큼 공백으로 줄입니다.


### `console.info([data][, ...args])` {#consoleinfodata-args}

**추가된 버전: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`console.info()` 함수는 [`console.log()`](/ko/nodejs/api/console#consolelogdata-args)의 별칭입니다.

### `console.log([data][, ...args])` {#consolelogdata-args}

**추가된 버전: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

줄 바꿈 문자와 함께 `stdout`에 출력합니다. 여러 인수를 전달할 수 있으며, 첫 번째 인수는 기본 메시지로 사용되고 추가 인수는 [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3)와 유사한 대체 값으로 사용됩니다(인수는 모두 [`util.format()`](/ko/nodejs/api/util#utilformatformat-args)로 전달됨).

```js [ESM]
const count = 5;
console.log('count: %d', count);
// Prints: count: 5, to stdout
console.log('count:', count);
// Prints: count: 5, to stdout
```
자세한 내용은 [`util.format()`](/ko/nodejs/api/util#utilformatformat-args)를 참조하십시오.

### `console.table(tabularData[, properties])` {#consoletabletabulardata-properties}

**추가된 버전: v10.0.0**

- `tabularData` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `properties` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 테이블을 구성하기 위한 대체 속성입니다.

`tabularData`의 속성 열(또는 `properties` 사용)과 `tabularData`의 행으로 테이블을 구성하고 기록해 봅니다. 테이블 형식으로 구문 분석할 수 없는 경우 인수를 로깅하는 것으로 대체됩니다.

```js [ESM]
// 테이블 데이터로 구문 분석할 수 없습니다.
console.table(Symbol());
// Symbol()

console.table(undefined);
// undefined

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }]);
// ┌─────────┬─────┬─────┐
// │ (index) │ a   │ b   │
// ├─────────┼─────┼─────┤
// │ 0       │ 1   │ 'Y' │
// │ 1       │ 'Z' │ 2   │
// └─────────┴─────┴─────┘

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }], ['a']);
// ┌─────────┬─────┐
// │ (index) │ a   │
// ├─────────┼─────┤
// │ 0       │ 1   │
// │ 1       │ 'Z' │
// └─────────┴─────┘
```

### `console.time([label])` {#consoletimelabel}

**추가된 버전: v0.1.104**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'default'`

작업 시간을 계산하는 데 사용할 수 있는 타이머를 시작합니다. 타이머는 고유한 `label`로 식별됩니다. [`console.timeEnd()`](/ko/nodejs/api/console#consoletimeendlabel)를 호출할 때 동일한 `label`을 사용하여 타이머를 중지하고 적절한 시간 단위로 경과 시간을 `stdout`에 출력합니다. 예를 들어, 경과 시간이 3869ms인 경우 `console.timeEnd()`는 "3.869s"를 표시합니다.

### `console.timeEnd([label])` {#consoletimeendlabel}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.0.0 | 경과 시간이 적절한 시간 단위로 표시됩니다. |
| v6.0.0 | 이 메서드는 더 이상 개별 `console.time()` 호출에 매핑되지 않는 여러 호출을 지원하지 않습니다. 자세한 내용은 아래를 참조하십시오. |
| v0.1.104 | 추가된 버전: v0.1.104 |
:::

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'default'`

[`console.time()`](/ko/nodejs/api/console#consoletimelabel)을 호출하여 이전에 시작한 타이머를 중지하고 결과를 `stdout`에 출력합니다.

```js [ESM]
console.time('bunch-of-stuff');
// Do a bunch of stuff.
console.timeEnd('bunch-of-stuff');
// Prints: bunch-of-stuff: 225.438ms
```
### `console.timeLog([label][, ...data])` {#consoletimeloglabel-data}

**추가된 버전: v10.7.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'default'`
- `...data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

[`console.time()`](/ko/nodejs/api/console#consoletimelabel)을 호출하여 이전에 시작한 타이머에 대해 경과 시간 및 기타 `data` 인수를 `stdout`에 출력합니다.

```js [ESM]
console.time('process');
const value = expensiveProcess1(); // Returns 42
console.timeLog('process', value);
// Prints "process: 365.227ms 42".
doExpensiveProcess2(value);
console.timeEnd('process');
```
### `console.trace([message][, ...args])` {#consoletracemessage-args}

**추가된 버전: v0.1.104**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`stderr`에 문자열 `'Trace: '`를 출력하고, 그 뒤에 [`util.format()`](/ko/nodejs/api/util#utilformatformat-args) 형식의 메시지와 코드의 현재 위치에 대한 스택 추적을 출력합니다.

```js [ESM]
console.trace('Show me');
// Prints: (stack trace will vary based on where trace is called)
//  Trace: Show me
//    at repl:2:9
//    at REPLServer.defaultEval (repl.js:248:27)
//    at bound (domain.js:287:14)
//    at REPLServer.runBound [as eval] (domain.js:300:12)
//    at REPLServer.<anonymous> (repl.js:412:12)
//    at emitOne (events.js:82:20)
//    at REPLServer.emit (events.js:169:7)
//    at REPLServer.Interface._onLine (readline.js:210:10)
//    at REPLServer.Interface._line (readline.js:549:8)
//    at REPLServer.Interface._ttyWrite (readline.js:826:14)
```

### `console.warn([data][, ...args])` {#consolewarndata-args}

**추가됨: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`console.warn()` 함수는 [`console.error()`](/ko/nodejs/api/console#consoleerrordata-args)의 별칭입니다.

## 검사기 전용 메서드 {#inspector-only-methods}

다음 메서드는 일반 API에서 V8 엔진에 의해 노출되지만 [검사기](/ko/nodejs/api/debugger)(`--inspect` 플래그)와 함께 사용되지 않는 한 아무것도 표시하지 않습니다.

### `console.profile([label])` {#consoleprofilelabel}

**추가됨: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이 메서드는 검사기에서 사용되지 않는 한 아무것도 표시하지 않습니다. `console.profile()` 메서드는 [`console.profileEnd()`](/ko/nodejs/api/console#consoleprofileendlabel)가 호출될 때까지 선택적 레이블로 JavaScript CPU 프로파일을 시작합니다. 그런 다음 프로파일은 검사기의 **프로파일** 패널에 추가됩니다.

```js [ESM]
console.profile('MyLabel');
// Some code
console.profileEnd('MyLabel');
// 검사기의 프로필 패널에 'MyLabel' 프로필을 추가합니다.
```
### `console.profileEnd([label])` {#consoleprofileendlabel}

**추가됨: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이 메서드는 검사기에서 사용되지 않는 한 아무것도 표시하지 않습니다. 시작된 경우 현재 JavaScript CPU 프로파일링 세션을 중지하고 보고서를 검사기의 **프로필** 패널에 인쇄합니다. 예제는 [`console.profile()`](/ko/nodejs/api/console#consoleprofilelabel)을 참조하십시오.

이 메서드가 레이블 없이 호출되면 가장 최근에 시작된 프로필이 중지됩니다.

### `console.timeStamp([label])` {#consoletimestamplabel}

**추가됨: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이 메서드는 검사기에서 사용되지 않는 한 아무것도 표시하지 않습니다. `console.timeStamp()` 메서드는 검사기의 **타임라인** 패널에 'label' 레이블이 있는 이벤트를 추가합니다.

