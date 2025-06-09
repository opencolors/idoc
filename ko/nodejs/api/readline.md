---
title: Node.js 문서 - Readline
description: Node.js의 readline 모듈은 Readable 스트림(예 process.stdin)에서 한 줄씩 데이터를 읽기 위한 인터페이스를 제공합니다. 콘솔에서 입력 읽기, 사용자 입력을 처리하고, 줄 단위로 작업을 관리하기 위한 인터페이스를 생성하는 것을 지원합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - Readline | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 readline 모듈은 Readable 스트림(예 process.stdin)에서 한 줄씩 데이터를 읽기 위한 인터페이스를 제공합니다. 콘솔에서 입력 읽기, 사용자 입력을 처리하고, 줄 단위로 작업을 관리하기 위한 인터페이스를 생성하는 것을 지원합니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - Readline | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 readline 모듈은 Readable 스트림(예 process.stdin)에서 한 줄씩 데이터를 읽기 위한 인터페이스를 제공합니다. 콘솔에서 입력 읽기, 사용자 입력을 처리하고, 줄 단위로 작업을 관리하기 위한 인터페이스를 생성하는 것을 지원합니다.
---


# Readline {#readline}

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

**소스 코드:** [lib/readline.js](https://github.com/nodejs/node/blob/v23.5.0/lib/readline.js)

`node:readline` 모듈은 한 번에 한 줄씩 [Readable](/ko/nodejs/api/stream#readable-streams) 스트림(예: [`process.stdin`](/ko/nodejs/api/process#processstdin))에서 데이터를 읽기 위한 인터페이스를 제공합니다.

Promise 기반 API를 사용하려면 다음을 수행하십시오.

::: code-group
```js [ESM]
import * as readline from 'node:readline/promises';
```

```js [CJS]
const readline = require('node:readline/promises');
```
:::

콜백 및 동기 API를 사용하려면 다음을 수행하십시오.

::: code-group
```js [ESM]
import * as readline from 'node:readline';
```

```js [CJS]
const readline = require('node:readline');
```
:::

다음의 간단한 예제는 `node:readline` 모듈의 기본적인 사용법을 보여줍니다.

::: code-group
```js [ESM]
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

const answer = await rl.question('What do you think of Node.js? ');

console.log(`Thank you for your valuable feedback: ${answer}`);

rl.close();
```

```js [CJS]
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

rl.question('What do you think of Node.js? ', (answer) => {
  // TODO: Log the answer in a database
  console.log(`Thank you for your valuable feedback: ${answer}`);

  rl.close();
});
```
:::

이 코드가 호출되면 인터페이스가 `input` 스트림에서 데이터를 수신하기를 기다리므로 Node.js 애플리케이션은 `readline.Interface`가 닫힐 때까지 종료되지 않습니다.

## 클래스: `InterfaceConstructor` {#class-interfaceconstructor}

**추가됨: v0.1.104**

- 확장: [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter)

`InterfaceConstructor` 클래스의 인스턴스는 `readlinePromises.createInterface()` 또는 `readline.createInterface()` 메서드를 사용하여 생성됩니다. 각 인스턴스는 단일 `input` [Readable](/ko/nodejs/api/stream#readable-streams) 스트림과 단일 `output` [Writable](/ko/nodejs/api/stream#writable-streams) 스트림과 연결됩니다. `output` 스트림은 `input` 스트림에 도착하여 읽은 사용자 입력에 대한 프롬프트를 인쇄하는 데 사용됩니다.


### 이벤트: `'close'` {#event-close}

**추가된 버전: v0.1.98**

다음 중 하나가 발생하면 `'close'` 이벤트가 발생합니다.

- `rl.close()` 메서드가 호출되고 `InterfaceConstructor` 인스턴스가 `input` 및 `output` 스트림에 대한 제어를 포기했습니다.
- `input` 스트림이 `'end'` 이벤트를 수신합니다.
- `input` 스트림이 전송 종료(EOT)를 알리는 +를 수신합니다.
- `input` 스트림이 `SIGINT`를 알리는 +를 수신하고 `InterfaceConstructor` 인스턴스에 등록된 `'SIGINT'` 이벤트 리스너가 없습니다.

리스너 함수는 인수를 전달하지 않고 호출됩니다.

`InterfaceConstructor` 인스턴스는 `'close'` 이벤트가 발생하면 완료됩니다.

### 이벤트: `'line'` {#event-line}

**추가된 버전: v0.1.98**

`'line'` 이벤트는 `input` 스트림이 줄 바꿈 입력(`\n`, `\r` 또는 `\r\n`)을 수신할 때마다 발생합니다. 이는 일반적으로 사용자가  또는  키를 누를 때 발생합니다.

`'line'` 이벤트는 스트림에서 새 데이터가 읽혀졌고 해당 스트림이 최종 줄 바꿈 마커 없이 종료되는 경우에도 발생합니다.

리스너 함수는 수신된 입력의 단일 줄을 포함하는 문자열과 함께 호출됩니다.

```js [ESM]
rl.on('line', (input) => {
  console.log(`Received: ${input}`);
});
```
### 이벤트: `'history'` {#event-history}

**추가된 버전: v15.8.0, v14.18.0**

`'history'` 이벤트는 히스토리 배열이 변경될 때마다 발생합니다.

리스너 함수는 히스토리 배열을 포함하는 배열과 함께 호출됩니다. `historySize` 및 `removeHistoryDuplicates`로 인한 모든 변경 사항, 추가된 줄 및 제거된 줄을 반영합니다.

주요 목적은 리스너가 히스토리를 유지할 수 있도록 하는 것입니다. 리스너가 히스토리 객체를 변경하는 것도 가능합니다. 이는 비밀번호와 같이 특정 줄이 히스토리에 추가되는 것을 방지하는 데 유용할 수 있습니다.

```js [ESM]
rl.on('history', (history) => {
  console.log(`Received: ${history}`);
});
```
### 이벤트: `'pause'` {#event-pause}

**추가된 버전: v0.7.5**

다음 중 하나가 발생하면 `'pause'` 이벤트가 발생합니다.

- `input` 스트림이 일시 중지됩니다.
- `input` 스트림이 일시 중지되지 않았고 `'SIGCONT'` 이벤트를 수신합니다. ([`'SIGTSTP'`](/ko/nodejs/api/readline#event-sigtstp) 및 [`'SIGCONT'`](/ko/nodejs/api/readline#event-sigcont) 이벤트 참조)

리스너 함수는 인수를 전달하지 않고 호출됩니다.

```js [ESM]
rl.on('pause', () => {
  console.log('Readline paused.');
});
```

### Event: `'resume'` {#event-resume}

**Added in: v0.7.5**

`'resume'` 이벤트는 `input` 스트림이 재개될 때마다 발생합니다.

리스너 함수는 인수를 전달하지 않고 호출됩니다.

```js [ESM]
rl.on('resume', () => {
  console.log('Readline resumed.');
});
```
### Event: `'SIGCONT'` {#event-sigcont}

**Added in: v0.7.5**

`'SIGCONT'` 이벤트는 Node.js 프로세스가 +를 사용하여 백그라운드로 이동했다가(즉, `SIGTSTP`) [`fg(1p)`](http://man7.org/linux/man-pages/man1/fg.1p)을 사용하여 다시 포그라운드로 돌아올 때 발생합니다.

`input` 스트림이 `SIGTSTP` 요청 *이전에* 일시 중지된 경우 이 이벤트는 발생하지 않습니다.

리스너 함수는 인수를 전달하지 않고 호출됩니다.

```js [ESM]
rl.on('SIGCONT', () => {
  // `prompt`는 자동으로 스트림을 재개합니다.
  rl.prompt();
});
```
`'SIGCONT'` 이벤트는 Windows에서 지원되지 *않습니다*.

### Event: `'SIGINT'` {#event-sigint}

**Added in: v0.3.0**

`'SIGINT'` 이벤트는 `input` 스트림이  입력을 받을 때마다 발생하며 일반적으로 `SIGINT`로 알려져 있습니다. `input` 스트림이 `SIGINT`를 받을 때 등록된 `'SIGINT'` 이벤트 리스너가 없으면 `'pause'` 이벤트가 발생합니다.

리스너 함수는 인수를 전달하지 않고 호출됩니다.

```js [ESM]
rl.on('SIGINT', () => {
  rl.question('종료하시겠습니까? ', (answer) => {
    if (answer.match(/^y(es)?$/i)) rl.pause();
  });
});
```
### Event: `'SIGTSTP'` {#event-sigtstp}

**Added in: v0.7.5**

`'SIGTSTP'` 이벤트는 `input` 스트림이 + 입력을 받을 때 발생하며 일반적으로 `SIGTSTP`로 알려져 있습니다. `input` 스트림이 `SIGTSTP`를 받을 때 등록된 `'SIGTSTP'` 이벤트 리스너가 없으면 Node.js 프로세스가 백그라운드로 전송됩니다.

[`fg(1p)`](http://man7.org/linux/man-pages/man1/fg.1p)을 사용하여 프로그램을 재개하면 `'pause'` 및 `'SIGCONT'` 이벤트가 발생합니다. 이들은 `input` 스트림을 재개하는 데 사용할 수 있습니다.

프로세스가 백그라운드로 전송되기 전에 `input`이 일시 중지된 경우 `'pause'` 및 `'SIGCONT'` 이벤트는 발생하지 않습니다.

리스너 함수는 인수를 전달하지 않고 호출됩니다.

```js [ESM]
rl.on('SIGTSTP', () => {
  // 이렇게 하면 SIGTSTP가 재정의되고 프로그램이 백그라운드로 이동하는 것을 방지할 수 있습니다.
  console.log('Caught SIGTSTP.');
});
```
`'SIGTSTP'` 이벤트는 Windows에서 지원되지 *않습니다*.


### `rl.close()` {#rlclose}

**추가된 버전: v0.1.98**

`rl.close()` 메서드는 `InterfaceConstructor` 인스턴스를 닫고 `input` 및 `output` 스트림에 대한 제어권을 포기합니다. 호출되면 `'close'` 이벤트가 발생합니다.

`rl.close()`를 호출해도 `InterfaceConstructor` 인스턴스에서 다른 이벤트(`'line'` 포함)가 발생하는 것이 즉시 중단되지는 않습니다.

### `rl.pause()` {#rlpause}

**추가된 버전: v0.3.4**

`rl.pause()` 메서드는 `input` 스트림을 일시 중지하여 필요한 경우 나중에 다시 시작할 수 있도록 합니다.

`rl.pause()`를 호출해도 `InterfaceConstructor` 인스턴스에서 다른 이벤트(`'line'` 포함)가 발생하는 것이 즉시 중단되지는 않습니다.

### `rl.prompt([preserveCursor])` {#rlpromptpreservecursor}

**추가된 버전: v0.1.98**

- `preserveCursor` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 커서 위치가 `0`으로 재설정되는 것을 방지합니다.

`rl.prompt()` 메서드는 `InterfaceConstructor` 인스턴스의 구성된 `prompt`를 `output`의 새 줄에 작성하여 사용자에게 입력을 제공할 수 있는 새로운 위치를 제공합니다.

호출되면 `rl.prompt()`는 일시 중지된 경우 `input` 스트림을 다시 시작합니다.

`InterfaceConstructor`가 `output`을 `null` 또는 `undefined`로 설정하여 생성된 경우 프롬프트가 작성되지 않습니다.

### `rl.resume()` {#rlresume}

**추가된 버전: v0.3.4**

`rl.resume()` 메서드는 일시 중지된 경우 `input` 스트림을 다시 시작합니다.

### `rl.setPrompt(prompt)` {#rlsetpromptprompt}

**추가된 버전: v0.1.98**

- `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`rl.setPrompt()` 메서드는 `rl.prompt()`가 호출될 때마다 `output`에 작성될 프롬프트를 설정합니다.

### `rl.getPrompt()` {#rlgetprompt}

**추가된 버전: v15.3.0, v14.17.0**

- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 현재 프롬프트 문자열

`rl.getPrompt()` 메서드는 `rl.prompt()`에서 사용하는 현재 프롬프트를 반환합니다.

### `rl.write(data[, key])` {#rlwritedata-key}

**추가된 버전: v0.1.98**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ctrl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 키를 나타내려면 `true`입니다.
    - `meta` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 키를 나타내려면 `true`입니다.
    - `shift` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 키를 나타내려면 `true`입니다.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 키의 이름입니다.

`rl.write()` 메서드는 `data` 또는 `key`로 식별되는 키 시퀀스를 `output`에 씁니다. `key` 인수는 `output`이 [TTY](/ko/nodejs/api/tty) 텍스트 터미널인 경우에만 지원됩니다. 키 조합 목록은 [TTY 키 바인딩](/ko/nodejs/api/readline#tty-keybindings)을 참조하십시오.

`key`가 지정되면 `data`는 무시됩니다.

호출되면 `rl.write()`는 일시 중지된 경우 `input` 스트림을 다시 시작합니다.

`InterfaceConstructor`가 `output`을 `null` 또는 `undefined`로 설정하여 생성된 경우 `data` 및 `key`는 작성되지 않습니다.

```js [ESM]
rl.write('이것을 삭제하세요!');
// Ctrl+U를 시뮬레이션하여 이전에 작성된 줄 삭제
rl.write(null, { ctrl: true, name: 'u' });
```

`rl.write()` 메서드는 `readline` `Interface`의 `input`에 데이터를 *마치 사용자가 제공한 것처럼* 작성합니다.


### `rl[Symbol.asyncIterator]()` {#rlsymbolasynciterator}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v11.14.0, v10.17.0 | Symbol.asyncIterator 지원이 더 이상 실험적이지 않습니다. |
| v11.4.0, v10.16.0 | 추가됨: v11.4.0, v10.16.0 |
:::

- 반환: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)

입력 스트림의 각 라인을 문자열로 반복하는 `AsyncIterator` 객체를 만듭니다. 이 메서드를 사용하면 `for await...of` 루프를 통해 `InterfaceConstructor` 객체를 비동기적으로 반복할 수 있습니다.

입력 스트림의 오류는 전달되지 않습니다.

루프가 `break`, `throw` 또는 `return`으로 종료되면 [`rl.close()`](/ko/nodejs/api/readline#rlclose)가 호출됩니다. 즉, `InterfaceConstructor`를 반복하면 항상 입력 스트림을 완전히 소비합니다.

성능은 기존 `'line'` 이벤트 API와 동일하지 않습니다. 성능에 민감한 애플리케이션에서는 대신 `'line'`을 사용하십시오.

```js [ESM]
async function processLineByLine() {
  const rl = readline.createInterface({
    // ...
  });

  for await (const line of rl) {
    // readline 입력의 각 라인은 여기서 `line`으로 연속적으로 사용할 수 있습니다.
  }
}
```
`readline.createInterface()`는 호출되는 즉시 입력 스트림을 소비하기 시작합니다. 인터페이스 생성과 비동기 반복 사이에 비동기 작업이 있으면 일부 라인이 누락될 수 있습니다.

### `rl.line` {#rlline}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v15.8.0, v14.18.0 | 값은 항상 문자열이며 undefined가 아닙니다. |
| v0.1.98 | 추가됨: v0.1.98 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

node에서 처리 중인 현재 입력 데이터입니다.

TTY 스트림에서 입력을 수집할 때 `line` 이벤트가 발생하기 전에 지금까지 처리된 현재 값을 검색하는 데 사용할 수 있습니다. `line` 이벤트가 발생하면 이 속성은 빈 문자열이 됩니다.

인스턴스 런타임 중에 값을 수정하면 `rl.cursor`도 제어되지 않는 경우 의도하지 않은 결과가 발생할 수 있습니다.

**입력에 TTY 스트림을 사용하지 않는 경우 <a href="#event-line"><code>'line'</code></a> 이벤트를 사용하십시오.**

가능한 사용 사례는 다음과 같습니다.

```js [ESM]
const values = ['lorem ipsum', 'dolor sit amet'];
const rl = readline.createInterface(process.stdin);
const showResults = debounce(() => {
  console.log(
    '\n',
    values.filter((val) => val.startsWith(rl.line)).join(' '),
  );
}, 300);
process.stdin.on('keypress', (c, k) => {
  showResults();
});
```

### `rl.cursor` {#rlcursor}

**Added in: v0.1.98**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`rl.line`을 기준으로 한 커서 위치입니다.

TTY 스트림에서 입력을 읽을 때 현재 커서가 입력 문자열의 어디에 있는지 추적합니다. 커서 위치는 입력이 처리될 때 수정될 입력 문자열의 부분을 결정하고 터미널 캐럿이 렌더링될 열을 결정합니다.

### `rl.getCursorPos()` {#rlgetcursorpos}

**Added in: v13.5.0, v12.16.0**

- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `rows` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 커서가 현재 위치하는 프롬프트 행
    - `cols` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 커서가 현재 위치하는 화면 열
  
 

입력 프롬프트 + 문자열과 관련된 커서의 실제 위치를 반환합니다. 긴 입력 (줄 바꿈) 문자열과 여러 줄 프롬프트가 계산에 포함됩니다.

## Promises API {#promises-api}

**Added in: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

### 클래스: `readlinePromises.Interface` {#class-readlinepromisesinterface}

**Added in: v17.0.0**

- 확장: [\<readline.InterfaceConstructor\>](/ko/nodejs/api/readline#class-interfaceconstructor)

`readlinePromises.Interface` 클래스의 인스턴스는 `readlinePromises.createInterface()` 메서드를 사용하여 생성됩니다. 모든 인스턴스는 단일 `input` [Readable](/ko/nodejs/api/stream#readable-streams) 스트림과 단일 `output` [Writable](/ko/nodejs/api/stream#writable-streams) 스트림과 연결됩니다. `output` 스트림은 `input` 스트림에서 도착하여 읽히는 사용자 입력에 대한 프롬프트를 인쇄하는 데 사용됩니다.


#### `rl.question(query[, options])` {#rlquestionquery-options}

**Added in: v17.0.0**

- `query` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `output`에 쓸 구문 또는 쿼리입니다. 프롬프트 앞에 추가됩니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 필요에 따라 `AbortSignal`을 사용하여 `question()`을 취소할 수 있습니다.

- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) `query`에 대한 응답으로 사용자의 입력을 사용하여 이행되는 Promise입니다.

`rl.question()` 메서드는 `query`를 `output`에 써서 표시하고, `input`에서 사용자 입력을 기다린 다음, 제공된 입력을 첫 번째 인수로 전달하여 `callback` 함수를 호출합니다.

호출되면 `rl.question()`은 일시 중지된 경우 `input` 스트림을 다시 시작합니다.

`readlinePromises.Interface`가 `output`을 `null` 또는 `undefined`로 설정하여 생성된 경우 `query`는 쓰여지지 않습니다.

`rl.close()` 이후에 질문이 호출되면 거부된 Promise를 반환합니다.

사용 예시:

```js [ESM]
const answer = await rl.question('What is your favorite food? ');
console.log(`Oh, so your favorite food is ${answer}`);
```
`AbortSignal`을 사용하여 질문을 취소합니다.

```js [ESM]
const signal = AbortSignal.timeout(10_000);

signal.addEventListener('abort', () => {
  console.log('The food question timed out');
}, { once: true });

const answer = await rl.question('What is your favorite food? ', { signal });
console.log(`Oh, so your favorite food is ${answer}`);
```
### Class: `readlinePromises.Readline` {#class-readlinepromisesreadline}

**Added in: v17.0.0**

#### `new readlinePromises.Readline(stream[, options])` {#new-readlinepromisesreadlinestream-options}

**Added in: v17.0.0**

- `stream` [\<stream.Writable\>](/ko/nodejs/api/stream#class-streamwritable) [TTY](/ko/nodejs/api/tty) 스트림입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `autoCommit` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 `rl.commit()`을 호출할 필요가 없습니다.


#### `rl.clearLine(dir)` {#rlclearlinedir}

**Added in: v17.0.0**

- `dir` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: 커서를 기준으로 왼쪽
    - `1`: 커서를 기준으로 오른쪽
    - `0`: 전체 라인
  
 
- 반환값: this

`rl.clearLine()` 메서드는 `dir`로 식별되는 지정된 방향으로 연결된 `stream`의 현재 라인을 지우는 작업을 보류 중인 작업의 내부 목록에 추가합니다. `autoCommit: true`가 생성자에 전달되지 않은 경우 이 메서드의 효과를 보려면 `rl.commit()`을 호출하세요.

#### `rl.clearScreenDown()` {#rlclearscreendown}

**Added in: v17.0.0**

- 반환값: this

`rl.clearScreenDown()` 메서드는 연결된 스트림을 커서의 현재 위치부터 아래로 지우는 작업을 보류 중인 작업의 내부 목록에 추가합니다. `autoCommit: true`가 생성자에 전달되지 않은 경우 이 메서드의 효과를 보려면 `rl.commit()`을 호출하세요.

#### `rl.commit()` {#rlcommit}

**Added in: v17.0.0**

- 반환값: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

`rl.commit()` 메서드는 보류 중인 모든 작업을 연결된 `stream`에 보내고 보류 중인 작업의 내부 목록을 지웁니다.

#### `rl.cursorTo(x[, y])` {#rlcursortox-y}

**Added in: v17.0.0**

- `x` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 반환값: this

`rl.cursorTo()` 메서드는 연결된 `stream`에서 커서를 지정된 위치로 이동하는 작업을 보류 중인 작업의 내부 목록에 추가합니다. `autoCommit: true`가 생성자에 전달되지 않은 경우 이 메서드의 효과를 보려면 `rl.commit()`을 호출하세요.

#### `rl.moveCursor(dx, dy)` {#rlmovecursordx-dy}

**Added in: v17.0.0**

- `dx` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 반환값: this

`rl.moveCursor()` 메서드는 연결된 `stream`에서 커서를 현재 위치를 기준으로 *상대적으로* 이동하는 작업을 보류 중인 작업의 내부 목록에 추가합니다. `autoCommit: true`가 생성자에 전달되지 않은 경우 이 메서드의 효과를 보려면 `rl.commit()`을 호출하세요.


#### `rl.rollback()` {#rlrollback}

**Added in: v17.0.0**

- 반환: this

`rl.rollback` 메서드는 연결된 `stream`으로 보내지 않고 보류 중인 작업의 내부 목록을 지웁니다.

### `readlinePromises.createInterface(options)` {#readlinepromisescreateinterfaceoptions}

**Added in: v17.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `input` [\<stream.Readable\>](/ko/nodejs/api/stream#class-streamreadable) 수신 대기할 [Readable](/ko/nodejs/api/stream#readable-streams) 스트림입니다. 이 옵션은 *필수*입니다.
    - `output` [\<stream.Writable\>](/ko/nodejs/api/stream#class-streamwritable) readline 데이터를 쓸 [Writable](/ko/nodejs/api/stream#writable-streams) 스트림입니다.
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Tab 자동 완성에 사용되는 선택적 함수입니다.
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `input` 및 `output` 스트림을 TTY처럼 처리하고 ANSI/VT100 이스케이프 코드를 작성해야 하는 경우 `true`입니다. **기본값:** 인스턴스화 시 `output` 스트림에서 `isTTY`를 확인합니다.
    - `history` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 히스토리 라인의 초기 목록입니다. 이 옵션은 사용자가 또는 내부 `output` 검사에 의해 `terminal`이 `true`로 설정된 경우에만 의미가 있습니다. 그렇지 않으면 히스토리 캐싱 메커니즘이 전혀 초기화되지 않습니다. **기본값:** `[]`.
    - `historySize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 유지되는 히스토리 라인의 최대 개수입니다. 히스토리를 비활성화하려면 이 값을 `0`으로 설정하십시오. 이 옵션은 사용자가 또는 내부 `output` 검사에 의해 `terminal`이 `true`로 설정된 경우에만 의미가 있습니다. 그렇지 않으면 히스토리 캐싱 메커니즘이 전혀 초기화되지 않습니다. **기본값:** `30`.
    - `removeHistoryDuplicates` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 히스토리 목록에 추가된 새 입력 라인이 이전 라인과 중복되면 이전 라인이 목록에서 제거됩니다. **기본값:** `false`.
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 사용할 프롬프트 문자열입니다. **기본값:** `'\> '`.
    - `crlfDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `\r`과 `\n` 사이의 지연이 `crlfDelay` 밀리초를 초과하면 `\r`과 `\n`이 모두 별도의 줄 끝 입력으로 처리됩니다. `crlfDelay`는 `100`보다 작지 않은 숫자로 강제 변환됩니다. 이를 `Infinity`로 설정할 수 있으며, 이 경우 `\r` 다음에 `\n`이 오는 경우는 항상 단일 줄 바꿈으로 간주됩니다(`\r\n` 줄 구분 기호로 [파일 읽기](/ko/nodejs/api/readline#example-read-file-stream-line-by-line)에 적합할 수 있음). **기본값:** `100`.
    - `escapeCodeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `readlinePromises`가 문자를 기다리는 시간(밀리초 단위로 지금까지 읽은 입력을 사용하여 완전한 키 시퀀스를 형성할 수 있고 더 긴 키 시퀀스를 완료하기 위해 추가 입력을 사용할 수 있는 모호한 키 시퀀스를 읽을 때)입니다. **기본값:** `500`.
    - `tabSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 탭과 동일한 공백 수 (최소 1). **기본값:** `8`.


- 반환: [\<readlinePromises.Interface\>](/ko/nodejs/api/readline#class-readlinepromisesinterface)

`readlinePromises.createInterface()` 메서드는 새로운 `readlinePromises.Interface` 인스턴스를 만듭니다.

::: code-group
```js [ESM]
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
});
```

```js [CJS]
const { createInterface } = require('node:readline/promises');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
```
:::

`readlinePromises.Interface` 인스턴스가 생성되면 가장 일반적인 경우는 `'line'` 이벤트를 수신하는 것입니다.

```js [ESM]
rl.on('line', (line) => {
  console.log(`Received: ${line}`);
});
```
이 인스턴스에 대해 `terminal`이 `true`이면 `output` 스트림이 `output.columns` 속성을 정의하고 열이 변경될 때마다 `output`에서 `'resize'` 이벤트를 발생시키면 최상의 호환성을 얻을 수 있습니다([`process.stdout`](/ko/nodejs/api/process#processstdout)은 TTY일 때 이를 자동으로 수행함).


#### `completer` 함수 사용 {#use-of-the-completer-function}

`completer` 함수는 사용자가 입력한 현재 라인을 인수로 받아서, 다음 두 항목이 있는 `Array`를 반환합니다.

- 자동 완성에 해당하는 항목이 있는 `Array`입니다.
- 매칭에 사용된 하위 문자열입니다.

예를 들어: `[[substr1, substr2, ...], originalsubstring]`.

```js [ESM]
function completer(line) {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // 찾은 자동 완성 항목이 없으면 모든 자동 완성 항목을 표시합니다.
  return [hits.length ? hits : completions, line];
}
```
`completer` 함수는 [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)를 반환하거나 비동기적일 수도 있습니다.

```js [ESM]
async function completer(linePartial) {
  await someAsyncWork();
  return [['123'], linePartial];
}
```
## 콜백 API {#callback-api}

**추가된 버전: v0.1.104**

### 클래스: `readline.Interface` {#class-readlineinterface}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v17.0.0 | `readline.Interface` 클래스가 이제 `Interface`에서 상속됩니다. |
| v0.1.104 | 추가된 버전: v0.1.104 |
:::

- 확장: [\<readline.InterfaceConstructor\>](/ko/nodejs/api/readline#class-interfaceconstructor)

`readline.Interface` 클래스의 인스턴스는 `readline.createInterface()` 메서드를 사용하여 생성됩니다. 모든 인스턴스는 단일 `input` [Readable](/ko/nodejs/api/stream#readable-streams) 스트림 및 단일 `output` [Writable](/ko/nodejs/api/stream#writable-streams) 스트림과 연결됩니다. `output` 스트림은 `input` 스트림에서 도착하여 읽은 사용자 입력에 대한 프롬프트를 인쇄하는 데 사용됩니다.

#### `rl.question(query[, options], callback)` {#rlquestionquery-options-callback}

**추가된 버전: v0.3.3**

- `query` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 프롬프트 앞에 추가되는 `output`에 쓰여지는 문장 또는 쿼리입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) 선택적으로 `AbortController`를 사용하여 `question()`을 취소할 수 있습니다.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `query`에 대한 응답으로 사용자의 입력과 함께 호출되는 콜백 함수입니다.

`rl.question()` 메서드는 `output`에 작성하여 `query`를 표시하고, `input`에서 사용자 입력이 제공될 때까지 기다린 다음, 제공된 입력을 첫 번째 인수로 전달하여 `callback` 함수를 호출합니다.

호출되면 `rl.question()`은 일시 중지된 경우 `input` 스트림을 다시 시작합니다.

`readline.Interface`가 `output`을 `null` 또는 `undefined`로 설정하여 생성된 경우 `query`는 작성되지 않습니다.

`rl.question()`에 전달된 `callback` 함수는 첫 번째 인수로 `Error` 객체 또는 `null`을 받는 일반적인 패턴을 따르지 않습니다. `callback`은 제공된 답변을 유일한 인수로 사용하여 호출됩니다.

`rl.close()` 이후에 `rl.question()`을 호출하면 오류가 발생합니다.

사용 예:

```js [ESM]
rl.question('가장 좋아하는 음식이 무엇인가요? ', (answer) => {
  console.log(`아, 가장 좋아하는 음식이 ${answer}군요`);
});
```
`AbortController`를 사용하여 질문을 취소합니다.

```js [ESM]
const ac = new AbortController();
const signal = ac.signal;

rl.question('가장 좋아하는 음식이 무엇인가요? ', { signal }, (answer) => {
  console.log(`아, 가장 좋아하는 음식이 ${answer}군요`);
});

signal.addEventListener('abort', () => {
  console.log('음식 질문 시간이 초과되었습니다.');
}, { once: true });

setTimeout(() => ac.abort(), 10000);
```

### `readline.clearLine(stream, dir[, callback])` {#readlineclearlinestream-dir-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v12.7.0 | 스트림의 write() 콜백 및 반환 값이 노출됩니다. |
| v0.7.7 | 추가됨: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/ko/nodejs/api/stream#class-streamwritable)
- `dir` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: 커서 왼쪽
    - `1`: 커서 오른쪽
    - `0`: 전체 줄
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 작업이 완료되면 호출됩니다.
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `stream`이 추가 데이터를 계속 쓰기 전에 호출 코드가 `'drain'` 이벤트가 발생하기를 기다리기를 원하는 경우 `false`; 그렇지 않으면 `true`입니다.

`readline.clearLine()` 메서드는 `dir`로 식별되는 지정된 방향으로 주어진 [TTY](/ko/nodejs/api/tty) 스트림의 현재 줄을 지웁니다.

### `readline.clearScreenDown(stream[, callback])` {#readlineclearscreendownstream-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v12.7.0 | 스트림의 write() 콜백 및 반환 값이 노출됩니다. |
| v0.7.7 | 추가됨: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/ko/nodejs/api/stream#class-streamwritable)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 작업이 완료되면 호출됩니다.
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `stream`이 추가 데이터를 계속 쓰기 전에 호출 코드가 `'drain'` 이벤트가 발생하기를 기다리기를 원하는 경우 `false`; 그렇지 않으면 `true`입니다.

`readline.clearScreenDown()` 메서드는 주어진 [TTY](/ko/nodejs/api/tty) 스트림을 커서의 현재 위치에서 아래로 지웁니다.


### `readline.createInterface(options)` {#readlinecreateinterfaceoptions}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.14.0, v14.18.0 | 이제 `signal` 옵션이 지원됩니다. |
| v15.8.0, v14.18.0 | 이제 `history` 옵션이 지원됩니다. |
| v13.9.0 | 이제 `tabSize` 옵션이 지원됩니다. |
| v8.3.0, v6.11.4 | `crlfDelay` 옵션의 최대 제한을 제거합니다. |
| v6.6.0 | 이제 `crlfDelay` 옵션이 지원됩니다. |
| v6.3.0 | 이제 `prompt` 옵션이 지원됩니다. |
| v6.0.0 | 이제 `historySize` 옵션이 `0`이 될 수 있습니다. |
| v0.1.98 | v0.1.98에 추가됨 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `input` [\<stream.Readable\>](/ko/nodejs/api/stream#class-streamreadable) 수신 대기할 [Readable](/ko/nodejs/api/stream#readable-streams) 스트림입니다. 이 옵션은 *필수*입니다.
    - `output` [\<stream.Writable\>](/ko/nodejs/api/stream#class-streamwritable) readline 데이터를 쓸 [Writable](/ko/nodejs/api/stream#writable-streams) 스트림입니다.
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 탭 자동 완성에 사용되는 선택적 함수입니다.
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `input` 및 `output` 스트림을 TTY처럼 처리하고 ANSI/VT100 이스케이프 코드를 스트림에 써야 하는 경우 `true`입니다. **기본값:** 인스턴스화 시 `output` 스트림에서 `isTTY`를 확인합니다.
    - `history` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 기록 줄의 초기 목록입니다. 이 옵션은 사용자가 또는 내부 `output` 검사에 의해 `terminal`이 `true`로 설정된 경우에만 의미가 있습니다. 그렇지 않으면 기록 캐싱 메커니즘이 전혀 초기화되지 않습니다. **기본값:** `[]`.
    - `historySize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 유지되는 최대 기록 줄 수입니다. 기록을 비활성화하려면 이 값을 `0`으로 설정하십시오. 이 옵션은 사용자가 또는 내부 `output` 검사에 의해 `terminal`이 `true`로 설정된 경우에만 의미가 있습니다. 그렇지 않으면 기록 캐싱 메커니즘이 전혀 초기화되지 않습니다. **기본값:** `30`.
    - `removeHistoryDuplicates` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 기록 목록에 추가된 새 입력 줄이 이전 줄을 복제하면 목록에서 이전 줄을 제거합니다. **기본값:** `false`.
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 사용할 프롬프트 문자열입니다. **기본값:** `'\> '`.
    - `crlfDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `\r`과 `\n` 사이의 지연 시간이 `crlfDelay` 밀리초를 초과하면 `\r`과 `\n`이 모두 별도의 줄 끝 입력으로 처리됩니다. `crlfDelay`는 `100`보다 작지 않은 숫자로 강제 변환됩니다. `Infinity`로 설정할 수 있습니다. 이 경우 `\r` 뒤에 `\n`이 오는 경우는 항상 단일 줄 바꿈으로 간주됩니다(이는 `\r\n` 줄 구분 기호가 있는 [파일 읽기](/ko/nodejs/api/readline#example-read-file-stream-line-by-line)에 적합할 수 있습니다). **기본값:** `100`.
    - `escapeCodeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `readline`이 모호한 키 시퀀스를 읽을 때 문자(밀리초 단위)를 기다리는 시간(지금까지 읽은 입력을 사용하여 완전한 키 시퀀스를 형성할 수 있고 추가 입력을 받아 더 긴 키 시퀀스를 완료할 수 있는 시간)입니다. **기본값:** `500`.
    - `tabSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 탭이 차지하는 공백 수(최소 1)입니다. **기본값:** `8`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) AbortSignal을 사용하여 인터페이스를 닫을 수 있습니다. 신호를 중단하면 인터페이스에서 내부적으로 `close`가 호출됩니다.

- 반환: [\<readline.Interface\>](/ko/nodejs/api/readline#class-readlineinterface)

`readline.createInterface()` 메서드는 새 `readline.Interface` 인스턴스를 만듭니다.

::: code-group
```js [ESM]
import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
});
```

```js [CJS]
const { createInterface } = require('node:readline');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
```
:::

`readline.Interface` 인스턴스가 생성되면 가장 일반적인 경우는 `'line'` 이벤트를 수신하는 것입니다.

```js [ESM]
rl.on('line', (line) => {
  console.log(`받음: ${line}`);
});
```
이 인스턴스에 대해 `terminal`이 `true`이면 `output` 스트림은 `output.columns` 속성을 정의하고 열이 변경될 때마다 `output`에서 `'resize'` 이벤트를 발생시키는 경우 최상의 호환성을 얻습니다(TTY인 경우 [`process.stdout`](/ko/nodejs/api/process#processstdout)이 자동으로 수행합니다).

`stdin`을 입력으로 사용하여 `readline.Interface`를 생성할 때 프로그램은 [EOF 문자](https://en.wikipedia.org/wiki/End-of-file#EOF_character)를 받을 때까지 종료되지 않습니다. 사용자 입력을 기다리지 않고 종료하려면 `process.stdin.unref()`를 호출하십시오.


#### `completer` 함수 사용법 {#use-of-the-completer-function_1}

`completer` 함수는 사용자가 입력한 현재 줄을 인수로 받아 다음 두 항목으로 구성된 `Array`를 반환합니다.

- 자동 완성에 대한 일치 항목이 있는 `Array`.
- 일치에 사용된 하위 문자열.

예시: `[[substr1, substr2, ...], originalsubstring]`.

```js [ESM]
function completer(line) {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // 찾은 항목이 없으면 모든 자동 완성 항목 표시
  return [hits.length ? hits : completions, line];
}
```
`completer` 함수는 두 개의 인수를 허용하는 경우 비동기적으로 호출할 수 있습니다.

```js [ESM]
function completer(linePartial, callback) {
  callback(null, [['123'], linePartial]);
}
```
### `readline.cursorTo(stream, x[, y][, callback])` {#readlinecursortostream-x-y-callback}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v12.7.0 | 스트림의 write() 콜백 및 반환 값이 노출됩니다. |
| v0.7.7 | v0.7.7에 추가됨 |
:::

- `stream` [\<stream.Writable\>](/ko/nodejs/api/stream#class-streamwritable)
- `x` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 작업이 완료되면 호출됩니다.
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `stream`이 추가 데이터를 계속 쓰기 전에 호출 코드가 `'drain'` 이벤트가 발생할 때까지 기다리기를 원하면 `false`이고, 그렇지 않으면 `true`입니다.

`readline.cursorTo()` 메서드는 지정된 [TTY](/ko/nodejs/api/tty) `stream`에서 커서를 지정된 위치로 이동합니다.

### `readline.moveCursor(stream, dx, dy[, callback])` {#readlinemovecursorstream-dx-dy-callback}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v12.7.0 | 스트림의 write() 콜백 및 반환 값이 노출됩니다. |
| v0.7.7 | v0.7.7에 추가됨 |
:::

- `stream` [\<stream.Writable\>](/ko/nodejs/api/stream#class-streamwritable)
- `dx` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 작업이 완료되면 호출됩니다.
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `stream`이 추가 데이터를 계속 쓰기 전에 호출 코드가 `'drain'` 이벤트가 발생할 때까지 기다리기를 원하면 `false`이고, 그렇지 않으면 `true`입니다.

`readline.moveCursor()` 메서드는 지정된 [TTY](/ko/nodejs/api/tty) `stream`에서 커서를 현재 위치를 *기준으로* 이동합니다.


## `readline.emitKeypressEvents(stream[, interface])` {#readlineemitkeypresseventsstream-interface}

**Added in: v0.7.7**

- `stream` [\<stream.Readable\>](/ko/nodejs/api/stream#class-streamreadable)
- `interface` [\<readline.InterfaceConstructor\>](/ko/nodejs/api/readline#class-interfaceconstructor)

`readline.emitKeypressEvents()` 메서드는 주어진 [Readable](/ko/nodejs/api/stream#readable-streams) 스트림이 수신된 입력에 해당하는 `'keypress'` 이벤트를 내보내기 시작하도록 합니다.

선택적으로 `interface`는 복사-붙여넣기된 입력이 감지될 때 자동 완성이 비활성화되는 `readline.Interface` 인스턴스를 지정합니다.

`stream`이 [TTY](/ko/nodejs/api/tty)인 경우, raw 모드여야 합니다.

이는 `input`이 터미널인 경우 readline 인스턴스에 의해 자동으로 호출됩니다. `readline` 인스턴스를 닫아도 `input`이 `'keypress'` 이벤트를 내보내는 것을 멈추지 않습니다.

```js [ESM]
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
```
## 예제: 작은 CLI {#example-tiny-cli}

다음 예제는 작은 명령줄 인터페이스를 구현하기 위해 `readline.Interface` 클래스를 사용하는 방법을 보여줍니다.

::: code-group
```js [ESM]
import { createInterface } from 'node:readline';
import { exit, stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
  prompt: 'OHAI> ',
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  exit(0);
});
```

```js [CJS]
const { createInterface } = require('node:readline');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'OHAI> ',
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});
```
:::


## 예시: 파일 스트림을 한 줄씩 읽기 {#example-read-file-stream-line-by-line}

`readline`의 일반적인 사용 사례는 입력 파일을 한 번에 한 줄씩 소비하는 것입니다. 가장 쉬운 방법은 [`fs.ReadStream`](/ko/nodejs/api/fs#class-fsreadstream) API와 `for await...of` 루프를 활용하는 것입니다.

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

async function processLineByLine() {
  const fileStream = createReadStream('input.txt');

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // 참고: 입력 파일 input.txt에서 CR LF('\r\n')의 모든 인스턴스를 단일 줄 바꿈으로 인식하기 위해 crlfDelay 옵션을 사용합니다.

  for await (const line of rl) {
    // input.txt의 각 줄은 여기에서 `line`으로 연속적으로 사용할 수 있습니다.
    console.log(`파일에서 읽은 줄: ${line}`);
  }
}

processLineByLine();
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

async function processLineByLine() {
  const fileStream = createReadStream('input.txt');

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // 참고: 입력 파일 input.txt에서 CR LF('\r\n')의 모든 인스턴스를 단일 줄 바꿈으로 인식하기 위해 crlfDelay 옵션을 사용합니다.

  for await (const line of rl) {
    // input.txt의 각 줄은 여기에서 `line`으로 연속적으로 사용할 수 있습니다.
    console.log(`파일에서 읽은 줄: ${line}`);
  }
}

processLineByLine();
```
:::

또는 [`'line'`](/ko/nodejs/api/readline#event-line) 이벤트를 사용할 수도 있습니다.

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const rl = createInterface({
  input: createReadStream('sample.txt'),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  console.log(`파일에서 읽은 줄: ${line}`);
});
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

const rl = createInterface({
  input: createReadStream('sample.txt'),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  console.log(`파일에서 읽은 줄: ${line}`);
});
```
:::

현재 `for await...of` 루프는 약간 느릴 수 있습니다. `async` / `await` 흐름과 속도가 모두 중요한 경우 혼합된 접근 방식을 적용할 수 있습니다.

::: code-group
```js [ESM]
import { once } from 'node:events';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('big-file.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      // 줄을 처리합니다.
    });

    await once(rl, 'close');

    console.log('파일 처리 완료.');
  } catch (err) {
    console.error(err);
  }
})();
```

```js [CJS]
const { once } = require('node:events');
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('big-file.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      // 줄을 처리합니다.
    });

    await once(rl, 'close');

    console.log('파일 처리 완료.');
  } catch (err) {
    console.error(err);
  }
})();
```
:::


## TTY 키 바인딩 {#tty-keybindings}

| 키 바인딩 | 설명 | 참고 |
|---|---|---|
|  +   +  | 왼쪽 줄 삭제 | Linux, Mac 및 Windows에서 작동하지 않음 |
|  +   +  | 오른쪽 줄 삭제 | Mac에서 작동하지 않음 |
|  +  | `SIGINT` 전송 또는 readline 인스턴스 닫기 | |
|  +  | 왼쪽 삭제 | |
|  +  | 오른쪽 삭제 또는 현재 줄이 비어있는 경우 readline 인스턴스 닫기 / EOF | Windows에서 작동하지 않음 |
|  +  | 현재 위치에서 줄 시작까지 삭제 | |
|  +  | 현재 위치에서 줄 끝까지 삭제 | |
|  +  | 이전에 삭제된 텍스트를 Yank (Recall) |  +  또는  + 로 삭제된 텍스트에서만 작동 |
|  +  | 이전에 삭제된 텍스트 순환 | 마지막 키 입력이  +  또는  + 인 경우에만 사용 가능 |
|  +  | 줄 시작으로 이동 | |
|  +  | 줄 끝으로 이동 | |
|  +  | 한 글자 뒤로 | |
|  +  | 한 글자 앞으로 | |
|  +  | 화면 지우기 | |
|  +  | 다음 히스토리 항목 | |
|  +  | 이전 히스토리 항목 | |
|  +  | 이전 변경 사항 되돌리기 | 키 코드 `0x1F` 를 전송하는 모든 키 입력이 이 작업을 수행합니다. 예를 들어 많은 터미널 (예: `xterm`)에서  + 에 바인딩됩니다. |
|  +  | 이전 변경 사항 재실행 | 많은 터미널에는 기본 재실행 키 입력이 없습니다. 재실행을 수행하기 위해 키 코드 `0x1E` 를 선택합니다. `xterm` 에서는 기본적으로  + 에 바인딩됩니다. |
|  +  | 실행 중인 프로세스를 백그라운드로 이동합니다. `fg` 를 입력하고  를 눌러 돌아갑니다. | Windows에서 작동하지 않음 |
|  +   또는   +  | 단어 경계까지 뒤로 삭제 |  +  는 Linux, Mac 및 Windows에서 작동하지 않습니다. |
|  +  | 단어 경계까지 앞으로 삭제 | Mac에서 작동하지 않음 |
|  +   또는   +  | 왼쪽 단어 |  +  는 Mac에서 작동하지 않습니다. |
|  +   또는   +  | 오른쪽 단어 |  +  는 Mac에서 작동하지 않습니다. |
|  +   또는   +  | 오른쪽 단어 삭제 |  +  는 Windows에서 작동하지 않습니다. |
|  +  | 왼쪽 단어 삭제 | Mac에서 작동하지 않음 |

