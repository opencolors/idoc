---
title: Node.js TTY 문서
description: Node.js의 TTY 모듈은 TTY(텔레타이프라이터) 장치와 상호작용하기 위한 인터페이스를 제공하며, 스트림이 TTY인지 확인하는 방법, 창 크기 가져오기, 터미널 이벤트 처리를 포함합니다.
head:
  - - meta
    - name: og:title
      content: Node.js TTY 문서 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 TTY 모듈은 TTY(텔레타이프라이터) 장치와 상호작용하기 위한 인터페이스를 제공하며, 스트림이 TTY인지 확인하는 방법, 창 크기 가져오기, 터미널 이벤트 처리를 포함합니다.
  - - meta
    - name: twitter:title
      content: Node.js TTY 문서 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 TTY 모듈은 TTY(텔레타이프라이터) 장치와 상호작용하기 위한 인터페이스를 제공하며, 스트림이 TTY인지 확인하는 방법, 창 크기 가져오기, 터미널 이벤트 처리를 포함합니다.
---


# TTY {#tty}

::: tip [Stable: 2 - 안정적]
[Stable: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

**소스 코드:** [lib/tty.js](https://github.com/nodejs/node/blob/v23.5.0/lib/tty.js)

`node:tty` 모듈은 `tty.ReadStream` 및 `tty.WriteStream` 클래스를 제공합니다. 대부분의 경우 이 모듈을 직접 사용할 필요가 없거나 불가능할 것입니다. 그러나 다음을 사용하여 액세스할 수 있습니다.

```js [ESM]
const tty = require('node:tty');
```

Node.js가 텍스트 터미널("TTY")이 연결된 상태로 실행되고 있음을 감지하면 기본적으로 [`process.stdin`](/ko/nodejs/api/process#processstdin)은 `tty.ReadStream`의 인스턴스로 초기화되고 [`process.stdout`](/ko/nodejs/api/process#processstdout) 및 [`process.stderr`](/ko/nodejs/api/process#processstderr) 둘 다 기본적으로 `tty.WriteStream`의 인스턴스가 됩니다. Node.js가 TTY 컨텍스트 내에서 실행되고 있는지 여부를 확인하는 가장 좋은 방법은 `process.stdout.isTTY` 속성 값이 `true`인지 확인하는 것입니다.

```bash [BASH]
$ node -p -e "Boolean(process.stdout.isTTY)"
true
$ node -p -e "Boolean(process.stdout.isTTY)" | cat
false
```

대부분의 경우 애플리케이션에서 `tty.ReadStream` 및 `tty.WriteStream` 클래스의 인스턴스를 수동으로 만들 이유가 거의 없습니다.

## 클래스: `tty.ReadStream` {#class-ttyreadstream}

**추가됨: v0.5.8**

- 확장: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket)

TTY의 읽기 가능한 측면을 나타냅니다. 일반적인 상황에서 [`process.stdin`](/ko/nodejs/api/process#processstdin)은 Node.js 프로세스에서 유일한 `tty.ReadStream` 인스턴스이며 추가 인스턴스를 만들 이유가 없어야 합니다.

### `readStream.isRaw` {#readstreamisraw}

**추가됨: v0.7.7**

TTY가 현재 원시 장치로 작동하도록 구성된 경우 `true`인 `boolean`입니다.

터미널이 원시 모드로 작동하더라도 프로세스가 시작될 때 이 플래그는 항상 `false`입니다. 해당 값은 `setRawMode`에 대한 후속 호출에 따라 변경됩니다.

### `readStream.isTTY` {#readstreamistty}

**추가됨: v0.5.8**

`tty.ReadStream` 인스턴스의 경우 항상 `true`인 `boolean`입니다.


### `readStream.setRawMode(mode)` {#readstreamsetrawmodemode}

**Added in: v0.7.7**

- `mode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우, `tty.ReadStream`이 원시 장치로 작동하도록 구성합니다. `false`인 경우, `tty.ReadStream`이 기본 모드로 작동하도록 구성합니다. `readStream.isRaw` 속성은 결과 모드로 설정됩니다.
- 반환: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) 읽기 스트림 인스턴스.

`tty.ReadStream`이 원시 장치로 작동하도록 구성할 수 있습니다.

원시 모드에서는 수정자를 포함하지 않고 입력이 항상 문자 단위로 제공됩니다. 또한 입력 문자 에코를 포함하여 터미널에서 문자에 대한 모든 특수 처리가 비활성화됩니다. 이 모드에서는 +가 더 이상 `SIGINT`를 발생시키지 않습니다.

## 클래스: `tty.WriteStream` {#class-ttywritestream}

**Added in: v0.5.8**

- 확장: [\<net.Socket\>](/ko/nodejs/api/net#class-netsocket)

TTY의 쓰기 가능한 측면을 나타냅니다. 일반적인 상황에서는 [`process.stdout`](/ko/nodejs/api/process#processstdout) 및 [`process.stderr`](/ko/nodejs/api/process#processstderr)가 Node.js 프로세스에 대해 생성된 유일한 `tty.WriteStream` 인스턴스이며 추가 인스턴스를 만들 이유가 없어야 합니다.

### `new tty.ReadStream(fd[, options])` {#new-ttyreadstreamfd-options}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v0.9.4 | `options` 인수가 지원됩니다. |
| v0.5.8 | Added in: v0.5.8 |
:::

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) TTY와 연결된 파일 디스크립터입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 상위 `net.Socket`에 전달되는 옵션입니다. [`net.Socket` 생성자](/ko/nodejs/api/net#new-netsocketoptions)의 `options`를 참조하십시오.
- 반환 [\<tty.ReadStream\>](/ko/nodejs/api/tty#class-ttyreadstream)

TTY와 연결된 `fd`에 대한 `ReadStream`을 만듭니다.

### `new tty.WriteStream(fd)` {#new-ttywritestreamfd}

**Added in: v0.5.8**

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) TTY와 연결된 파일 디스크립터입니다.
- 반환 [\<tty.WriteStream\>](/ko/nodejs/api/tty#class-ttywritestream)

TTY와 연결된 `fd`에 대한 `WriteStream`을 만듭니다.


### 이벤트: `'resize'` {#event-resize}

**추가된 버전: v0.7.7**

`'resize'` 이벤트는 `writeStream.columns` 또는 `writeStream.rows` 속성이 변경될 때마다 발생합니다. 호출 시 리스너 콜백에 전달되는 인수는 없습니다.

```js [ESM]
process.stdout.on('resize', () => {
  console.log('화면 크기가 변경되었습니다!');
  console.log(`${process.stdout.columns}x${process.stdout.rows}`);
});
```
### `writeStream.clearLine(dir[, callback])` {#writestreamclearlinedir-callback}


::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v12.7.0 | 스트림의 write() 콜백 및 반환 값이 노출됩니다. |
| v0.7.7 | 추가된 버전: v0.7.7 |
:::

- `dir` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: 커서 왼쪽
    - `1`: 커서 오른쪽
    - `0`: 전체 라인
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 작업이 완료되면 호출됩니다.
- 반환 값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 스트림이 추가 데이터를 계속 쓰기 전에 호출 코드가 `'drain'` 이벤트가 발생할 때까지 기다리기를 원하는 경우 `false`입니다. 그렇지 않으면 `true`입니다.

`writeStream.clearLine()`은 `dir`로 식별된 방향으로 이 `WriteStream`의 현재 라인을 지웁니다.

### `writeStream.clearScreenDown([callback])` {#writestreamclearscreendowncallback}


::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v12.7.0 | 스트림의 write() 콜백 및 반환 값이 노출됩니다. |
| v0.7.7 | 추가된 버전: v0.7.7 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 작업이 완료되면 호출됩니다.
- 반환 값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 스트림이 추가 데이터를 계속 쓰기 전에 호출 코드가 `'drain'` 이벤트가 발생할 때까지 기다리기를 원하는 경우 `false`입니다. 그렇지 않으면 `true`입니다.

`writeStream.clearScreenDown()`은 이 `WriteStream`을 현재 커서 아래에서 지웁니다.


### `writeStream.columns` {#writestreamcolumns}

**추가된 버전: v0.7.7**

TTY가 현재 가지고 있는 열의 수를 지정하는 `number`입니다. 이 속성은 `'resize'` 이벤트가 발생할 때마다 업데이트됩니다.

### `writeStream.cursorTo(x[, y][, callback])` {#writestreamcursortox-y-callback}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.7.0 | 스트림의 write() 콜백과 반환 값이 노출됩니다. |
| v0.7.7 | 추가된 버전: v0.7.7 |
:::

- `x` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 작업이 완료되면 호출됩니다.
- 반환값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 스트림이 추가 데이터를 쓰기 전에 호출 코드가 `'drain'` 이벤트가 발생할 때까지 기다리기를 원하는 경우 `false`입니다. 그렇지 않으면 `true`입니다.

`writeStream.cursorTo()`는 이 `WriteStream`의 커서를 지정된 위치로 이동합니다.

### `writeStream.getColorDepth([env])` {#writestreamgetcolordepthenv}

**추가된 버전: v9.9.0**

- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 확인할 환경 변수를 포함하는 객체입니다. 이를 통해 특정 터미널의 사용을 시뮬레이션할 수 있습니다. **기본값:** `process.env`.
- 반환값: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

반환값:

- 2색의 경우 `1`,
- 16색의 경우 `4`,
- 256색의 경우 `8`,
- 16,777,216색을 지원하는 경우 `24`입니다.

이것을 사용하여 터미널이 지원하는 색상을 결정합니다. 터미널의 색상 특성상 거짓 긍정 또는 거짓 부정이 발생할 수 있습니다. 이는 프로세스 정보와 사용된 터미널에 대해 거짓 정보를 제공할 수 있는 환경 변수에 따라 달라집니다. `env` 객체를 전달하여 특정 터미널의 사용을 시뮬레이션할 수 있습니다. 이는 특정 환경 설정이 어떻게 동작하는지 확인하는 데 유용할 수 있습니다.

특정 색상 지원을 강제하려면 아래 환경 설정 중 하나를 사용하십시오.

- 2색: `FORCE_COLOR = 0` (색상 비활성화)
- 16색: `FORCE_COLOR = 1`
- 256색: `FORCE_COLOR = 2`
- 16,777,216색: `FORCE_COLOR = 3`

`NO_COLOR` 및 `NODE_DISABLE_COLORS` 환경 변수를 사용하여 색상 지원을 비활성화할 수도 있습니다.


### `writeStream.getWindowSize()` {#writestreamgetwindowsize}

**추가된 버전: v0.7.7**

- 반환값: [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`writeStream.getWindowSize()`는 이 `WriteStream`에 해당하는 TTY의 크기를 반환합니다. 배열은 `[numColumns, numRows]` 유형이며, `numColumns`와 `numRows`는 해당 TTY의 열과 행 수를 나타냅니다.

### `writeStream.hasColors([count][, env])` {#writestreamhascolorscount-env}

**추가된 버전: v11.13.0, v10.16.0**

- `count` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 요청된 색상의 수 (최소 2). **기본값:** 16.
- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 확인할 환경 변수를 포함하는 객체입니다. 특정 터미널의 사용을 시뮬레이션할 수 있습니다. **기본값:** `process.env`.
- 반환값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`writeStream`이 `count`에 제공된 것만큼 많은 색상을 지원하는 경우 `true`를 반환합니다. 최소 지원은 2 (흑백)입니다.

이는 [`writeStream.getColorDepth()`](/ko/nodejs/api/tty#writestreamgetcolordepthenv)에 설명된 것과 동일한 위양성 및 음성 위반을 갖습니다.

```js [ESM]
process.stdout.hasColors();
// `stdout`이 최소 16가지 색상을 지원하는지 여부에 따라 true 또는 false를 반환합니다.
process.stdout.hasColors(256);
// `stdout`이 최소 256가지 색상을 지원하는지 여부에 따라 true 또는 false를 반환합니다.
process.stdout.hasColors({ TMUX: '1' });
// true를 반환합니다.
process.stdout.hasColors(2 ** 24, { TMUX: '1' });
// false를 반환합니다 (환경 설정은 2 ** 8개의 색상을 지원하는 척합니다).
```
### `writeStream.isTTY` {#writestreamistty}

**추가된 버전: v0.5.8**

항상 `true`인 `boolean`입니다.

### `writeStream.moveCursor(dx, dy[, callback])` {#writestreammovecursordx-dy-callback}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.7.0 | 스트림의 write() 콜백 및 반환 값이 노출됩니다. |
| v0.7.7 | 추가된 버전: v0.7.7 |
:::

- `dx` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 작업이 완료되면 호출됩니다.
- 반환값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 추가 데이터를 계속 쓰기 전에 호출 코드가 `'drain'` 이벤트가 발생할 때까지 기다리기를 원하는 경우 `false`; 그렇지 않으면 `true`입니다.

`writeStream.moveCursor()`는 이 `WriteStream`의 커서를 현재 위치를 기준으로 *상대적으로* 이동합니다.


### `writeStream.rows` {#writestreamrows}

**추가된 버전: v0.7.7**

TTY가 현재 가지고 있는 행 수를 지정하는 `number`입니다. 이 속성은 `'resize'` 이벤트가 발생할 때마다 업데이트됩니다.

## `tty.isatty(fd)` {#ttyisattyfd}

**추가된 버전: v0.5.8**

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 숫자 파일 설명자
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`tty.isatty()` 메서드는 주어진 `fd`가 TTY와 연결되어 있으면 `true`를 반환하고, 그렇지 않으면 `false`를 반환합니다. `fd`가 음수가 아닌 정수가 아닌 경우도 포함됩니다.

