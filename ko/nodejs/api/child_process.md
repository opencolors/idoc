---
title: Node.js 문서 - 자식 프로세스
description: Node.js 자식 프로세스 모듈에 대한 문서로, 자식 프로세스를 생성하고, 그 생명주기를 관리하며, 프로세스 간 통신을 처리하는 방법을 자세히 설명합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - 자식 프로세스 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 자식 프로세스 모듈에 대한 문서로, 자식 프로세스를 생성하고, 그 생명주기를 관리하며, 프로세스 간 통신을 처리하는 방법을 자세히 설명합니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - 자식 프로세스 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 자식 프로세스 모듈에 대한 문서로, 자식 프로세스를 생성하고, 그 생명주기를 관리하며, 프로세스 간 통신을 처리하는 방법을 자세히 설명합니다.
---


# 자식 프로세스 {#child-process}

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

**소스 코드:** [lib/child_process.js](https://github.com/nodejs/node/blob/v23.5.0/lib/child_process.js)

`node:child_process` 모듈은 [`popen(3)`](http://man7.org/linux/man-pages/man3/popen.3)과 유사하지만 동일하지 않은 방식으로 서브 프로세스를 생성하는 기능을 제공합니다. 이 기능은 주로 [`child_process.spawn()`](/ko/nodejs/api/child_process#child_processspawncommand-args-options) 함수에 의해 제공됩니다.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::

기본적으로 `stdin`, `stdout`, `stderr`에 대한 파이프는 부모 Node.js 프로세스와 생성된 서브 프로세스 사이에 설정됩니다. 이러한 파이프는 제한된 (플랫폼 특정) 용량을 가집니다. 서브 프로세스가 캡처되지 않고 해당 제한을 초과하여 stdout에 쓰는 경우, 서브 프로세스는 파이프 버퍼가 더 많은 데이터를 수락할 때까지 기다리는 동안 차단됩니다. 이는 쉘에서 파이프의 동작과 동일합니다. 출력이 사용되지 않는 경우 `{ stdio: 'ignore' }` 옵션을 사용하세요.

명령어 조회는 `options` 객체에 `env`가 있는 경우 `options.env.PATH` 환경 변수를 사용하여 수행됩니다. 그렇지 않으면 `process.env.PATH`가 사용됩니다. `options.env`가 `PATH` 없이 설정된 경우, Unix에서의 조회는 `/usr/bin:/bin`의 기본 검색 경로 검색에서 수행되고 (execvpe/execvp에 대한 운영 체제 설명서 참조), Windows에서는 현재 프로세스의 환경 변수 `PATH`가 사용됩니다.

Windows에서는 환경 변수가 대소문자를 구분하지 않습니다. Node.js는 `env` 키를 사전순으로 정렬하고 대소문자를 구분하지 않고 일치하는 첫 번째 키를 사용합니다. 사전순으로 가장 먼저 나오는 항목만 서브 프로세스에 전달됩니다. 이로 인해 `PATH` 및 `Path`와 같이 동일한 키의 여러 변형이 있는 객체를 `env` 옵션에 전달할 때 Windows에서 문제가 발생할 수 있습니다.

[`child_process.spawn()`](/ko/nodejs/api/child_process#child_processspawncommand-args-options) 메서드는 Node.js 이벤트 루프를 차단하지 않고 서브 프로세스를 비동기적으로 생성합니다. [`child_process.spawnSync()`](/ko/nodejs/api/child_process#child_processspawnsynccommand-args-options) 함수는 생성된 프로세스가 종료되거나 종료될 때까지 이벤트 루프를 차단하는 동기적인 방식으로 동일한 기능을 제공합니다.

편의를 위해 `node:child_process` 모듈은 [`child_process.spawn()`](/ko/nodejs/api/child_process#child_processspawncommand-args-options) 및 [`child_process.spawnSync()`](/ko/nodejs/api/child_process#child_processspawnsynccommand-args-options)에 대한 몇 가지 동기 및 비동기 대안을 제공합니다. 이러한 각 대안은 [`child_process.spawn()`](/ko/nodejs/api/child_process#child_processspawncommand-args-options) 또는 [`child_process.spawnSync()`](/ko/nodejs/api/child_process#child_processspawnsynccommand-args-options)를 기반으로 구현됩니다.

- [`child_process.exec()`](/ko/nodejs/api/child_process#child_processexeccommand-options-callback): 쉘을 생성하고 해당 쉘 내에서 명령을 실행하고 완료되면 `stdout` 및 `stderr`를 콜백 함수에 전달합니다.
- [`child_process.execFile()`](/ko/nodejs/api/child_process#child_processexecfilefile-args-options-callback): 기본적으로 쉘을 먼저 생성하지 않고 명령을 직접 생성한다는 점을 제외하고 [`child_process.exec()`](/ko/nodejs/api/child_process#child_processexeccommand-options-callback)와 유사합니다.
- [`child_process.fork()`](/ko/nodejs/api/child_process#child_processforkmodulepath-args-options): 새로운 Node.js 프로세스를 생성하고 부모와 자식 간에 메시지를 보낼 수 있는 IPC 통신 채널이 설정된 지정된 모듈을 호출합니다.
- [`child_process.execSync()`](/ko/nodejs/api/child_process#child_processexecsynccommand-options): Node.js 이벤트 루프를 차단하는 [`child_process.exec()`](/ko/nodejs/api/child_process#child_processexeccommand-options-callback)의 동기 버전입니다.
- [`child_process.execFileSync()`](/ko/nodejs/api/child_process#child_processexecfilesyncfile-args-options): Node.js 이벤트 루프를 차단하는 [`child_process.execFile()`](/ko/nodejs/api/child_process#child_processexecfilefile-args-options-callback)의 동기 버전입니다.

쉘 스크립트 자동화와 같은 특정 사용 사례의 경우, [동기 대응](/ko/nodejs/api/child_process#synchronous-process-creation)이 더 편리할 수 있습니다. 그러나 많은 경우 동기 메서드는 생성된 프로세스가 완료되는 동안 이벤트 루프를 중단시키기 때문에 성능에 상당한 영향을 미칠 수 있습니다.


## 비동기 프로세스 생성 {#asynchronous-process-creation}

[`child_process.spawn()`](/ko/nodejs/api/child_process#child_processspawncommand-args-options), [`child_process.fork()`](/ko/nodejs/api/child_process#child_processforkmodulepath-args-options), [`child_process.exec()`](/ko/nodejs/api/child_process#child_processexeccommand-options-callback), 및 [`child_process.execFile()`](/ko/nodejs/api/child_process#child_processexecfilefile-args-options-callback) 메서드는 모두 다른 Node.js API의 일반적인 관용적 비동기 프로그래밍 패턴을 따릅니다.

각 메서드는 [`ChildProcess`](/ko/nodejs/api/child_process#class-childprocess) 인스턴스를 반환합니다. 이러한 객체는 Node.js [`EventEmitter`](/ko/nodejs/api/events#class-eventemitter) API를 구현하여 부모 프로세스가 자식 프로세스의 수명 주기 동안 특정 이벤트가 발생할 때 호출되는 리스너 함수를 등록할 수 있도록 합니다.

[`child_process.exec()`](/ko/nodejs/api/child_process#child_processexeccommand-options-callback) 및 [`child_process.execFile()`](/ko/nodejs/api/child_process#child_processexecfilefile-args-options-callback) 메서드는 선택적으로 자식 프로세스가 종료될 때 호출되는 `callback` 함수를 지정할 수도 있습니다.

### Windows에서 `.bat` 및 `.cmd` 파일 스폰 {#spawning-bat-and-cmd-files-on-windows}

[`child_process.exec()`](/ko/nodejs/api/child_process#child_processexeccommand-options-callback)와 [`child_process.execFile()`](/ko/nodejs/api/child_process#child_processexecfilefile-args-options-callback) 간의 구별의 중요성은 플랫폼에 따라 다를 수 있습니다. Unix 유형 운영 체제(Unix, Linux, macOS)에서 [`child_process.execFile()`](/ko/nodejs/api/child_process#child_processexecfilefile-args-options-callback)은 기본적으로 셸을 스폰하지 않기 때문에 더 효율적일 수 있습니다. 그러나 Windows에서 `.bat` 및 `.cmd` 파일은 터미널 없이는 자체적으로 실행할 수 없으므로 [`child_process.execFile()`](/ko/nodejs/api/child_process#child_processexecfilefile-args-options-callback)을 사용하여 시작할 수 없습니다. Windows에서 실행할 때 `.bat` 및 `.cmd` 파일은 `shell` 옵션이 설정된 [`child_process.spawn()`](/ko/nodejs/api/child_process#child_processspawncommand-args-options), [`child_process.exec()`](/ko/nodejs/api/child_process#child_processexeccommand-options-callback) 또는 `cmd.exe`를 스폰하고 `.bat` 또는 `.cmd` 파일을 인수로 전달하여 호출할 수 있습니다(`shell` 옵션 및 [`child_process.exec()`](/ko/nodejs/api/child_process#child_processexeccommand-options-callback)이 수행하는 작업). 어쨌든 스크립트 파일 이름에 공백이 포함되어 있으면 따옴표로 묶어야 합니다.

::: code-group
```js [CJS]
// OR...
const { exec, spawn } = require('node:child_process');

exec('my.bat', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

// Script with spaces in the filename:
const bat = spawn('"my script.cmd"', ['a', 'b'], { shell: true });
// or:
exec('"my script.cmd" a b', (err, stdout, stderr) => {
  // ...
});
```

```js [ESM]
// OR...
import { exec, spawn } from 'node:child_process';

exec('my.bat', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

// Script with spaces in the filename:
const bat = spawn('"my script.cmd"', ['a', 'b'], { shell: true });
// or:
exec('"my script.cmd" a b', (err, stdout, stderr) => {
  // ...
});
```
:::


### `child_process.exec(command[, options][, callback])` {#child_processexeccommand-options-callback}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v15.4.0 | AbortSignal 지원이 추가되었습니다. |
| v16.4.0, v14.18.0 | `cwd` 옵션은 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. |
| v8.8.0 | `windowsHide` 옵션이 이제 지원됩니다. |
| v0.1.90 | v0.1.90에 추가됨 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 실행할 명령이며 공백으로 구분된 인수가 함께 제공됩니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 자식 프로세스의 현재 작업 디렉터리. **기본값:** `process.cwd()`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 환경 키-값 쌍. **기본값:** `process.env`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'utf8'`
    - `shell` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 명령을 실행할 셸. [셸 요구 사항](/ko/nodejs/api/child_process#shell-requirements) 및 [기본 Windows 셸](/ko/nodejs/api/child_process#default-windows-shell)을 참조하세요. **기본값:** Unix에서는 `'/bin/sh'`, Windows에서는 `process.env.ComSpec`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) AbortSignal을 사용하여 자식 프로세스를 중단할 수 있습니다.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0`
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) stdout 또는 stderr에서 허용되는 최대 데이터 양(바이트). 초과하면 자식 프로세스가 종료되고 모든 출력이 잘립니다. [`maxBuffer` 및 유니코드](/ko/nodejs/api/child_process#maxbuffer-and-unicode)에서 주의 사항을 참조하세요. **기본값:** `1024 * 1024`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `'SIGTERM'`
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스의 사용자 ID를 설정합니다( [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2) 참조).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스의 그룹 ID를 설정합니다( [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2) 참조).
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Windows 시스템에서 일반적으로 생성되는 하위 프로세스 콘솔 창을 숨깁니다. **기본값:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 프로세스가 종료될 때 출력과 함께 호출됩니다.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stdout` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)
    - `stderr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)


- 반환: [\<ChildProcess\>](/ko/nodejs/api/child_process#class-childprocess)

셸을 생성한 다음 해당 셸 내에서 `command`를 실행하여 생성된 모든 출력을 버퍼링합니다. exec 함수에 전달된 `command` 문자열은 셸에서 직접 처리되며 특수 문자(셸에 따라 다름([셸](https://en.wikipedia.org/wiki/List_of_command-line_interpreters) 참조))는 적절하게 처리해야 합니다.

::: code-group
```js [CJS]
const { exec } = require('node:child_process');

exec('"/path/to/test file/test.sh" arg1 arg2');
// 경로의 공백이 여러 인수의 구분 기호로 해석되지 않도록 큰따옴표가 사용됩니다.

exec('echo "The \\$HOME variable is $HOME"');
// $HOME 변수는 첫 번째 인스턴스에서는 이스케이프되지만 두 번째 인스턴스에서는 이스케이프되지 않습니다.
```

```js [ESM]
import { exec } from 'node:child_process';

exec('"/path/to/test file/test.sh" arg1 arg2');
// 경로의 공백이 여러 인수의 구분 기호로 해석되지 않도록 큰따옴표가 사용됩니다.

exec('echo "The \\$HOME variable is $HOME"');
// $HOME 변수는 첫 번째 인스턴스에서는 이스케이프되지만 두 번째 인스턴스에서는 이스케이프되지 않습니다.
```
:::

**살균되지 않은 사용자 입력을 이 함수에 절대 전달하지 마세요. 셸 메타 문자를 포함하는 입력은 임의의 명령 실행을 트리거하는 데 사용될 수 있습니다.**

`callback` 함수가 제공되면 `(error, stdout, stderr)` 인수로 호출됩니다. 성공하면 `error`는 `null`이 됩니다. 오류가 발생하면 `error`는 [`Error`](/ko/nodejs/api/errors#class-error)의 인스턴스가 됩니다. `error.code` 속성은 프로세스의 종료 코드가 됩니다. 규칙에 따라 `0`이 아닌 모든 종료 코드는 오류를 나타냅니다. `error.signal`은 프로세스를 종료한 신호입니다.

콜백에 전달된 `stdout` 및 `stderr` 인수는 자식 프로세스의 stdout 및 stderr 출력을 포함합니다. 기본적으로 Node.js는 출력을 UTF-8로 디코딩하고 문자열을 콜백에 전달합니다. `encoding` 옵션을 사용하여 stdout 및 stderr 출력을 디코딩하는 데 사용되는 문자 인코딩을 지정할 수 있습니다. `encoding`이 `'buffer'`이거나 인식할 수 없는 문자 인코딩인 경우 `Buffer` 객체가 대신 콜백에 전달됩니다.

::: code-group
```js [CJS]
const { exec } = require('node:child_process');
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```

```js [ESM]
import { exec } from 'node:child_process';
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```
:::

`timeout`이 `0`보다 크면 자식 프로세스가 `timeout` 밀리초보다 오래 실행되는 경우 부모 프로세스는 `killSignal` 속성으로 식별되는 신호(기본값은 `'SIGTERM'`)를 보냅니다.

[`exec(3)`](http://man7.org/linux/man-pages/man3/exec.3) POSIX 시스템 호출과 달리 `child_process.exec()`는 기존 프로세스를 대체하지 않고 셸을 사용하여 명령을 실행합니다.

이 메서드가 [`util.promisify()`](/ko/nodejs/api/util#utilpromisifyoriginal)ed 버전으로 호출되면 `stdout` 및 `stderr` 속성이 있는 `Object`에 대한 `Promise`를 반환합니다. 반환된 `ChildProcess` 인스턴스는 `Promise`에 `child` 속성으로 연결됩니다. 오류(0이 아닌 종료 코드를 생성하는 오류 포함)의 경우 콜백에 제공된 것과 동일한 `error` 객체와 함께 거부된 Promise가 반환되지만 두 개의 추가 속성 `stdout` 및 `stderr`가 있습니다.

::: code-group
```js [CJS]
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
```

```js [ESM]
import { promisify } from 'node:util';
import child_process from 'node:child_process';
const exec = promisify(child_process.exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
```
:::

`signal` 옵션이 활성화된 경우 해당 `AbortController`에서 `.abort()`를 호출하는 것은 자식 프로세스에서 `.kill()`을 호출하는 것과 유사하지만 콜백에 전달된 오류는 `AbortError`가 됩니다.

::: code-group
```js [CJS]
const { exec } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const child = exec('grep ssh', { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```

```js [ESM]
import { exec } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const child = exec('grep ssh', { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```
:::


### `child_process.execFile(file[, args][, options][, callback])` {#child_processexecfilefile-args-options-callback}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v16.4.0, v14.18.0 | `cwd` 옵션은 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. |
| v15.4.0, v14.17.0 | AbortSignal 지원이 추가되었습니다. |
| v8.8.0 | 이제 `windowsHide` 옵션이 지원됩니다. |
| v0.1.91 | v0.1.91에 추가됨 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 실행할 실행 파일의 이름 또는 경로입니다.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 문자열 인수의 목록입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 자식 프로세스의 현재 작업 디렉터리입니다.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 환경 키-값 쌍입니다. **기본값:** `process.env`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'utf8'`
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `0`
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) stdout 또는 stderr에서 허용되는 최대 데이터 양(바이트)입니다. 이 값을 초과하면 자식 프로세스가 종료되고 모든 출력이 잘립니다. [`maxBuffer` 및 유니코드](/ko/nodejs/api/child_process#maxbuffer-and-unicode)의 주의 사항을 참조하십시오. **기본값:** `1024 * 1024`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **기본값:** `'SIGTERM'`
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스의 사용자 ID를 설정합니다(참조: [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스의 그룹 ID를 설정합니다(참조: [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 일반적으로 Windows 시스템에서 생성되는 하위 프로세스 콘솔 창을 숨깁니다. **기본값:** `false`.
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Windows에서는 인용 또는 이스케이프가 수행되지 않습니다. Unix에서는 무시됩니다. **기본값:** `false`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `true`인 경우 셸 내부에서 `command`를 실행합니다. Unix에서는 `'/bin/sh'`를 사용하고 Windows에서는 `process.env.ComSpec`를 사용합니다. 다른 셸을 문자열로 지정할 수 있습니다. [셸 요구 사항](/ko/nodejs/api/child_process#shell-requirements) 및 [기본 Windows 셸](/ko/nodejs/api/child_process#default-windows-shell)을 참조하십시오. **기본값:** `false`(셸 없음).
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) AbortSignal을 사용하여 자식 프로세스를 중단할 수 있습니다.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 프로세스가 종료될 때 출력과 함께 호출됩니다.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stdout` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)
    - `stderr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)
  
 
- 반환값: [\<ChildProcess\>](/ko/nodejs/api/child_process#class-childprocess)

`child_process.execFile()` 함수는 기본적으로 셸을 생성하지 않는다는 점을 제외하고는 [`child_process.exec()`](/ko/nodejs/api/child_process#child_processexeccommand-options-callback)와 유사합니다. 대신 지정된 실행 파일 `file`이 새 프로세스로 직접 생성되어 [`child_process.exec()`](/ko/nodejs/api/child_process#child_processexeccommand-options-callback)보다 약간 더 효율적입니다.

[`child_process.exec()`](/ko/nodejs/api/child_process#child_processexeccommand-options-callback)와 동일한 옵션이 지원됩니다. 셸이 생성되지 않으므로 I/O 리디렉션 및 파일 글로빙과 같은 동작은 지원되지 않습니다.

::: code-group
```js [CJS]
const { execFile } = require('node:child_process');
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```

```js [ESM]
import { execFile } from 'node:child_process';
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```
:::

콜백에 전달된 `stdout` 및 `stderr` 인수는 자식 프로세스의 stdout 및 stderr 출력을 포함합니다. 기본적으로 Node.js는 출력을 UTF-8로 디코딩하고 문자열을 콜백에 전달합니다. `encoding` 옵션을 사용하여 stdout 및 stderr 출력을 디코딩하는 데 사용되는 문자 인코딩을 지정할 수 있습니다. `encoding`이 `'buffer'`이거나 인식할 수 없는 문자 인코딩인 경우 `Buffer` 객체가 대신 콜백에 전달됩니다.

이 메서드가 [`util.promisify()`](/ko/nodejs/api/util#utilpromisifyoriginal) 버전으로 호출되면 `stdout` 및 `stderr` 속성이 있는 `Object`에 대한 `Promise`를 반환합니다. 반환된 `ChildProcess` 인스턴스는 `child` 속성으로 `Promise`에 연결됩니다. 오류(0 이외의 종료 코드를 초래하는 오류 포함)가 발생하면 거부된 Promise가 반환되며 콜백에 제공된 것과 동일한 `error` 객체가 반환되지만 두 개의 추가 속성 `stdout` 및 `stderr`가 있습니다.

::: code-group
```js [CJS]
const util = require('node:util');
const execFile = util.promisify(require('node:child_process').execFile);
async function getVersion() {
  const { stdout } = await execFile('node', ['--version']);
  console.log(stdout);
}
getVersion();
```

```js [ESM]
import { promisify } from 'node:util';
import child_process from 'node:child_process';
const execFile = promisify(child_process.execFile);
async function getVersion() {
  const { stdout } = await execFile('node', ['--version']);
  console.log(stdout);
}
getVersion();
```
:::

**<code>shell</code> 옵션을 활성화한 경우 안전하지 않은 사용자 입력을 이 함수에 전달하지 마십시오. 셸 메타 문자를 포함하는 모든 입력은 임의의 명령 실행을 트리거하는 데 사용될 수 있습니다.**

`signal` 옵션을 활성화한 경우 해당 `AbortController`에서 `.abort()`를 호출하는 것은 자식 프로세스에서 `.kill()`을 호출하는 것과 유사하지만 콜백에 전달된 오류는 `AbortError`가 됩니다.

::: code-group
```js [CJS]
const { execFile } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const child = execFile('node', ['--version'], { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```

```js [ESM]
import { execFile } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const child = execFile('node', ['--version'], { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```
:::


### `child_process.fork(modulePath[, args][, options])` {#child_processforkmodulepath-args-options}

::: info [내역]
| 버전 | 변경 사항 |
| --- | --- |
| v17.4.0, v16.14.0 | `modulePath` 매개변수는 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. |
| v16.4.0, v14.18.0 | `cwd` 옵션은 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. |
| v15.13.0, v14.18.0 | timeout이 추가되었습니다. |
| v15.11.0, v14.18.0 | AbortSignal에 대한 killSignal이 추가되었습니다. |
| v15.6.0, v14.17.0 | AbortSignal 지원이 추가되었습니다. |
| v13.2.0, v12.16.0 | 이제 `serialization` 옵션이 지원됩니다. |
| v8.0.0 | 이제 `stdio` 옵션은 문자열이 될 수 있습니다. |
| v6.4.0 | 이제 `stdio` 옵션이 지원됩니다. |
| v0.5.0 | 추가됨: v0.5.0 |
:::

- `modulePath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 자식에서 실행할 모듈입니다.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 문자열 인수 목록입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 자식 프로세스의 현재 작업 디렉터리입니다.
    - `detached` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 자식 프로세스가 부모 프로세스와 독립적으로 실행되도록 준비합니다. 특정 동작은 플랫폼에 따라 다릅니다. [`options.detached`](/ko/nodejs/api/child_process#optionsdetached)를 참조하세요.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 환경 키-값 쌍입니다. **기본값:** `process.env`.
    - `execPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 자식 프로세스를 만드는 데 사용되는 실행 파일입니다.
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 실행 파일에 전달되는 문자열 인수 목록입니다. **기본값:** `process.execArgv`.
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스의 그룹 ID를 설정합니다([`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2) 참조).
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 프로세스 간에 메시지를 보내는 데 사용되는 직렬화 종류를 지정합니다. 가능한 값은 `'json'` 및 `'advanced'`입니다. 자세한 내용은 [고급 직렬화](/ko/nodejs/api/child_process#advanced-serialization)를 참조하세요. **기본값:** `'json'`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) AbortSignal을 사용하여 자식 프로세스를 닫을 수 있습니다.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 스폰된 프로세스가 타임아웃 또는 중단 신호에 의해 종료될 때 사용될 신호 값입니다. **기본값:** `'SIGTERM'`.
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 자식 프로세스의 stdin, stdout 및 stderr이 부모 프로세스로 파이프되고, 그렇지 않으면 부모 프로세스에서 상속됩니다. 자세한 내용은 [`child_process.spawn()`](/ko/nodejs/api/child_process#child_processspawncommand-args-options)의 [`stdio`](/ko/nodejs/api/child_process#optionsstdio)에 대한 `'pipe'` 및 `'inherit'` 옵션을 참조하세요. **기본값:** `false`.
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [`child_process.spawn()`](/ko/nodejs/api/child_process#child_processspawncommand-args-options)의 [`stdio`](/ko/nodejs/api/child_process#optionsstdio)를 참조하세요. 이 옵션이 제공되면 `silent`를 덮어씁니다. 배열 변형을 사용하는 경우 `'ipc'` 값을 가진 항목을 정확히 하나 포함해야 합니다. 그렇지 않으면 오류가 발생합니다. 예를 들어 `[0, 1, 2, 'ipc']`입니다.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스의 사용자 ID를 설정합니다([`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2) 참조).
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Windows에서는 인수의 인용 부호 또는 이스케이프가 수행되지 않습니다. Unix에서는 무시됩니다. **기본값:** `false`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스가 실행될 수 있는 최대 시간(밀리초)입니다. **기본값:** `undefined`.
  
 
- 반환: [\<ChildProcess\>](/ko/nodejs/api/child_process#class-childprocess)

`child_process.fork()` 메서드는 새로운 Node.js 프로세스를 스폰하기 위해 특별히 사용되는 [`child_process.spawn()`](/ko/nodejs/api/child_process#child_processspawncommand-args-options)의 특수한 경우입니다. [`child_process.spawn()`](/ko/nodejs/api/child_process#child_processspawncommand-args-options)와 마찬가지로 [`ChildProcess`](/ko/nodejs/api/child_process#class-childprocess) 객체가 반환됩니다. 반환된 [`ChildProcess`](/ko/nodejs/api/child_process#class-childprocess)에는 부모와 자식 간에 메시지를 주고받을 수 있는 추가 통신 채널이 내장되어 있습니다. 자세한 내용은 [`subprocess.send()`](/ko/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback)를 참조하세요.

스폰된 Node.js 자식 프로세스는 두 프로세스 사이에 설정된 IPC 통신 채널을 제외하고는 부모 프로세스와 독립적이라는 점에 유의하세요. 각 프로세스에는 자체 V8 인스턴스와 함께 자체 메모리가 있습니다. 필요한 추가 리소스 할당으로 인해 많은 수의 자식 Node.js 프로세스를 스폰하는 것은 권장되지 않습니다.

기본적으로 `child_process.fork()`는 부모 프로세스의 [`process.execPath`](/ko/nodejs/api/process#processexecpath)를 사용하여 새로운 Node.js 인스턴스를 스폰합니다. `options` 객체의 `execPath` 속성을 사용하면 대체 실행 경로를 사용할 수 있습니다.

사용자 지정 `execPath`로 시작된 Node.js 프로세스는 자식 프로세스의 환경 변수 `NODE_CHANNEL_FD`를 사용하여 식별된 파일 설명자(fd)를 사용하여 부모 프로세스와 통신합니다.

[`fork(2)`](http://man7.org/linux/man-pages/man2/fork.2) POSIX 시스템 호출과 달리 `child_process.fork()`는 현재 프로세스를 복제하지 않습니다.

[`child_process.spawn()`](/ko/nodejs/api/child_process#child_processspawncommand-args-options)에서 사용할 수 있는 `shell` 옵션은 `child_process.fork()`에서 지원되지 않으며 설정된 경우 무시됩니다.

`signal` 옵션이 활성화된 경우 해당 `AbortController`에서 `.abort()`를 호출하는 것은 자식 프로세스에서 `.kill()`을 호출하는 것과 유사하지만 콜백에 전달되는 오류는 `AbortError`가 됩니다.

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const process = require('node:process');

if (process.argv[2] === 'child') {
  setTimeout(() => {
    console.log(`Hello from ${process.argv[2]}!`);
  }, 1_000);
} else {
  const controller = new AbortController();
  const { signal } = controller;
  const child = fork(__filename, ['child'], { signal });
  child.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
  });
  controller.abort(); // Stops the child process
}
```

```js [ESM]
import { fork } from 'node:child_process';
import process from 'node:process';

if (process.argv[2] === 'child') {
  setTimeout(() => {
    console.log(`Hello from ${process.argv[2]}!`);
  }, 1_000);
} else {
  const controller = new AbortController();
  const { signal } = controller;
  const child = fork(import.meta.url, ['child'], { signal });
  child.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
  });
  controller.abort(); // Stops the child process
}
```
:::


### `child_process.spawn(command[, args][, options])` {#child_processspawncommand-args-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.4.0, v14.18.0 | `cwd` 옵션은 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. |
| v15.13.0, v14.18.0 | timeout이 추가되었습니다. |
| v15.11.0, v14.18.0 | AbortSignal에 대한 killSignal이 추가되었습니다. |
| v15.5.0, v14.17.0 | AbortSignal 지원이 추가되었습니다. |
| v13.2.0, v12.16.0 | `serialization` 옵션이 이제 지원됩니다. |
| v8.8.0 | `windowsHide` 옵션이 이제 지원됩니다. |
| v6.4.0 | `argv0` 옵션이 이제 지원됩니다. |
| v5.7.0 | `shell` 옵션이 이제 지원됩니다. |
| v0.1.90 | 추가됨: v0.1.90 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 실행할 명령어입니다.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 문자열 인수의 목록입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 자식 프로세스의 현재 작업 디렉터리입니다.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 환경 키-값 쌍입니다. **기본값:** `process.env`.
    - `argv0` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 자식 프로세스로 전송되는 `argv[0]` 값을 명시적으로 설정합니다. 지정하지 않으면 `command`로 설정됩니다.
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 자식의 stdio 구성 ([`options.stdio`](/ko/nodejs/api/child_process#optionsstdio) 참조).
    - `detached` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 자식 프로세스가 부모 프로세스와 독립적으로 실행되도록 준비합니다. 특정 동작은 플랫폼에 따라 다릅니다 ([`options.detached`](/ko/nodejs/api/child_process#optionsdetached) 참조).
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스의 사용자 ID를 설정합니다 ([`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2) 참조).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스의 그룹 ID를 설정합니다 ([`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2) 참조).
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 프로세스 간에 메시지를 보내는 데 사용되는 직렬화 종류를 지정합니다. 가능한 값은 `'json'` 및 `'advanced'`입니다. 자세한 내용은 [고급 직렬화](/ko/nodejs/api/child_process#advanced-serialization)를 참조하십시오. **기본값:** `'json'`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `true`인 경우, `command`를 셸 내부에서 실행합니다. Unix에서는 `'/bin/sh'`를 사용하고 Windows에서는 `process.env.ComSpec`를 사용합니다. 문자열로 다른 셸을 지정할 수 있습니다. [셸 요구 사항](/ko/nodejs/api/child_process#shell-requirements) 및 [기본 Windows 셸](/ko/nodejs/api/child_process#default-windows-shell)을 참조하십시오. **기본값:** `false` (셸 없음).
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Windows에서는 인수의 따옴표 붙이기나 이스케이프 처리가 수행되지 않습니다. Unix에서는 무시됩니다. 이것은 `shell`이 지정되고 CMD인 경우 자동으로 `true`로 설정됩니다. **기본값:** `false`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 일반적으로 Windows 시스템에서 생성되는 하위 프로세스 콘솔 창을 숨깁니다. **기본값:** `false`.
    - `signal` [\<AbortSignal\>](/ko/nodejs/api/globals#class-abortsignal) AbortSignal을 사용하여 자식 프로세스를 중단할 수 있습니다.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스가 실행될 수 있는 최대 시간(밀리초)입니다. **기본값:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 스폰된 프로세스가 타임아웃 또는 중단 신호로 인해 종료될 때 사용될 신호 값입니다. **기본값:** `'SIGTERM'`.

- 반환값: [\<ChildProcess\>](/ko/nodejs/api/child_process#class-childprocess)

`child_process.spawn()` 메서드는 주어진 `command`를 사용하여 새로운 프로세스를 스폰하고, 명령줄 인수는 `args`에 있습니다. 생략하면 `args`는 기본적으로 빈 배열이 됩니다.

**<code>shell</code> 옵션이 활성화된 경우, 이 함수에 살균되지 않은 사용자 입력을 전달하지 마십시오. 셸 메타 문자를 포함하는 입력은 임의의 명령 실행을 트리거하는 데 사용될 수 있습니다.**

세 번째 인수를 사용하여 추가 옵션을 지정할 수 있으며, 이러한 기본값이 있습니다.

```js [ESM]
const defaults = {
  cwd: undefined,
  env: process.env,
};
```
`cwd`를 사용하여 프로세스가 스폰되는 작업 디렉터리를 지정합니다. 지정하지 않으면 기본적으로 현재 작업 디렉터리를 상속합니다. 지정했지만 경로가 존재하지 않으면 자식 프로세스는 `ENOENT` 오류를 발생시키고 즉시 종료됩니다. `ENOENT`는 명령어가 존재하지 않을 때도 발생합니다.

`env`를 사용하여 새 프로세스에 표시될 환경 변수를 지정하며, 기본값은 [`process.env`](/ko/nodejs/api/process#processenv)입니다.

`env`의 `undefined` 값은 무시됩니다.

`ls -lh /usr`을 실행하고 `stdout`, `stderr` 및 종료 코드를 캡처하는 예제:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::

예제: `ps ax | grep ssh`를 실행하는 매우 정교한 방법

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(data.toString());
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(data.toString());
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
```
:::

`spawn` 실패를 확인하는 예제:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
```
:::

특정 플랫폼 (macOS, Linux)은 프로세스 제목에 `argv[0]` 값을 사용하는 반면 다른 플랫폼 (Windows, SunOS)은 `command`를 사용합니다.

Node.js는 시작 시 `argv[0]`을 `process.execPath`로 덮어쓰므로 Node.js 자식 프로세스의 `process.argv[0]`은 부모에서 `spawn`에 전달된 `argv0` 매개변수와 일치하지 않습니다. 대신 `process.argv0` 속성으로 검색합니다.

`signal` 옵션을 활성화한 경우, 해당 `AbortController`에서 `.abort()`를 호출하는 것은 자식 프로세스에서 `.kill()`을 호출하는 것과 유사하지만 콜백에 전달된 오류는 `AbortError`가 됩니다.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const grep = spawn('grep', ['ssh'], { signal });
grep.on('error', (err) => {
  // 컨트롤러가 중단되면 err가 AbortError인 상태로 호출됩니다.
});
controller.abort(); // 자식 프로세스를 중지합니다.
```

```js [ESM]
import { spawn } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const grep = spawn('grep', ['ssh'], { signal });
grep.on('error', (err) => {
  // 컨트롤러가 중단되면 err가 AbortError인 상태로 호출됩니다.
});
controller.abort(); // 자식 프로세스를 중지합니다.
```
:::


#### `options.detached` {#optionsdetached}

**추가된 버전: v0.7.10**

Windows에서는 `options.detached`를 `true`로 설정하면 부모 프로세스가 종료된 후에도 자식 프로세스가 계속 실행될 수 있습니다. 자식 프로세스는 자체 콘솔 창을 갖게 됩니다. 자식 프로세스에 대해 활성화되면 비활성화할 수 없습니다.

Windows가 아닌 플랫폼에서 `options.detached`가 `true`로 설정되면 자식 프로세스는 새 프로세스 그룹 및 세션의 리더가 됩니다. 자식 프로세스는 분리 여부에 관계없이 부모가 종료된 후에도 계속 실행될 수 있습니다. 자세한 내용은 [`setsid(2)`](http://man7.org/linux/man-pages/man2/setsid.2)를 참조하세요.

기본적으로 부모는 분리된 자식 프로세스가 종료될 때까지 기다립니다. 부모 프로세스가 특정 `subprocess`의 종료를 기다리지 않도록 하려면 `subprocess.unref()` 메서드를 사용하세요. 이렇게 하면 부모 프로세스의 이벤트 루프가 참조 횟수에 자식 프로세스를 포함하지 않아 부모 프로세스가 자식 프로세스와 독립적으로 종료될 수 있습니다. 단, 자식 프로세스와 부모 프로세스 간에 설정된 IPC 채널이 있는 경우는 예외입니다.

`detached` 옵션을 사용하여 장기 실행 프로세스를 시작할 때, 프로세스는 부모에 연결되지 않은 `stdio` 구성이 제공되지 않으면 부모가 종료된 후에도 백그라운드에서 실행되지 않습니다. 부모 프로세스의 `stdio`가 상속되면 자식 프로세스는 제어 터미널에 연결된 상태로 유지됩니다.

다음은 분리하고 부모의 `stdio` 파일 디스크립터를 무시하여 부모의 종료를 무시하는 장기 실행 프로세스의 예입니다.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```
:::

또는 자식 프로세스의 출력을 파일로 리디렉션할 수 있습니다.

::: code-group
```js [CJS]
const { openSync } = require('node:fs');
const { spawn } = require('node:child_process');
const out = openSync('./out.log', 'a');
const err = openSync('./out.log', 'a');

const subprocess = spawn('prg', [], {
  detached: true,
  stdio: [ 'ignore', out, err ],
});

subprocess.unref();
```

```js [ESM]
import { openSync } from 'node:fs');
import { spawn } from 'node:child_process';
const out = openSync('./out.log', 'a');
const err = openSync('./out.log', 'a');

const subprocess = spawn('prg', [], {
  detached: true,
  stdio: [ 'ignore', out, err ],
});

subprocess.unref();
```
:::


#### `options.stdio` {#optionsstdio}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.6.0, v14.18.0 | `overlapped` stdio 플래그가 추가되었습니다. |
| v3.3.1 | 이제 값 `0`이 파일 설명자로 허용됩니다. |
| v0.7.10 | 추가됨: v0.7.10 |
:::

`options.stdio` 옵션은 부모 프로세스와 자식 프로세스 간에 설정되는 파이프를 구성하는 데 사용됩니다. 기본적으로 자식의 stdin, stdout 및 stderr는 [`ChildProcess`](/ko/nodejs/api/child_process#class-childprocess) 객체의 해당 [`subprocess.stdin`](/ko/nodejs/api/child_process#subprocessstdin), [`subprocess.stdout`](/ko/nodejs/api/child_process#subprocessstdout) 및 [`subprocess.stderr`](/ko/nodejs/api/child_process#subprocessstderr) 스트림으로 리디렉션됩니다. 이는 `options.stdio`를 `['pipe', 'pipe', 'pipe']`로 설정하는 것과 같습니다.

편의를 위해 `options.stdio`는 다음 문자열 중 하나일 수 있습니다.

- `'pipe'`: `['pipe', 'pipe', 'pipe']`(기본값)와 같습니다.
- `'overlapped'`: `['overlapped', 'overlapped', 'overlapped']`와 같습니다.
- `'ignore'`: `['ignore', 'ignore', 'ignore']`와 같습니다.
- `'inherit'`: `['inherit', 'inherit', 'inherit']` 또는 `[0, 1, 2]`와 같습니다.

그렇지 않으면 `options.stdio`의 값은 각 인덱스가 자식의 fd에 해당하는 배열입니다. fd 0, 1 및 2는 각각 stdin, stdout 및 stderr에 해당합니다. 부모와 자식 간에 추가 파이프를 만들기 위해 추가 fd를 지정할 수 있습니다. 값은 다음 중 하나입니다.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

// 자식은 부모의 stdio를 사용합니다.
spawn('prg', [], { stdio: 'inherit' });

// stderr만 공유하는 자식 스폰.
spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] });

// startd 스타일 인터페이스를 제공하는 프로그램과 상호 작용하기 위해
// 추가 fd=4를 엽니다.
spawn('prg', [], { stdio: ['pipe', null, null, null, 'pipe'] });
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

// 자식은 부모의 stdio를 사용합니다.
spawn('prg', [], { stdio: 'inherit' });

// stderr만 공유하는 자식 스폰.
spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] });

// startd 스타일 인터페이스를 제공하는 프로그램과 상호 작용하기 위해
// 추가 fd=4를 엽니다.
spawn('prg', [], { stdio: ['pipe', null, null, null, 'pipe'] });
```
:::

*부모 프로세스와 자식 프로세스 사이에 IPC 채널이 설정되고 자식 프로세스가 Node.js 인스턴스인 경우,
자식 프로세스는 <a href="process.html#event-disconnect"><code>'disconnect'</code></a> 이벤트 또는 <a href="process.html#event-message"><code>'message'</code></a> 이벤트에 대한 이벤트 핸들러를 등록할 때까지 IPC 채널이 참조 해제된 상태(<code>unref()</code> 사용)로 시작됩니다.
이를 통해 자식 프로세스는 열린 IPC 채널에 의해 프로세스가 열린 상태로 유지되지 않고 정상적으로 종료될 수 있습니다.* 다음도 참조하십시오. [`child_process.exec()`](/ko/nodejs/api/child_process#child_processexeccommand-options-callback) 및 [`child_process.fork()`](/ko/nodejs/api/child_process#child_processforkmodulepath-args-options).


## 동기식 프로세스 생성 {#synchronous-process-creation}

[`child_process.spawnSync()`](/ko/nodejs/api/child_process#child_processspawnsynccommand-args-options), [`child_process.execSync()`](/ko/nodejs/api/child_process#child_processexecsynccommand-options) 및 [`child_process.execFileSync()`](/ko/nodejs/api/child_process#child_processexecfilesyncfile-args-options) 메서드는 동기식이며 Node.js 이벤트 루프를 차단하여 스폰된 프로세스가 종료될 때까지 추가 코드의 실행을 일시 중지합니다.

이러한 블로킹 호출은 주로 범용 스크립팅 작업을 단순화하고 시작 시 애플리케이션 구성의 로드/처리를 단순화하는 데 유용합니다.

### `child_process.execFileSync(file[, args][, options])` {#child_processexecfilesyncfile-args-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.4.0, v14.18.0 | `cwd` 옵션은 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. |
| v10.10.0 | `input` 옵션은 이제 모든 `TypedArray` 또는 `DataView`가 될 수 있습니다. |
| v8.8.0 | 이제 `windowsHide` 옵션이 지원됩니다. |
| v8.0.0 | `input` 옵션은 이제 `Uint8Array`가 될 수 있습니다. |
| v6.2.1, v4.5.0 | 이제 `encoding` 옵션을 명시적으로 `buffer`로 설정할 수 있습니다. |
| v0.11.12 | 추가됨: v0.11.12 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 실행할 실행 파일의 이름 또는 경로입니다.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 문자열 인수의 목록입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 자식 프로세스의 현재 작업 디렉터리입니다.
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 스폰된 프로세스에 stdin으로 전달될 값입니다. `stdio[0]`이 `'pipe'`로 설정된 경우 이 값을 제공하면 `stdio[0]`을 덮어씁니다.
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 자식의 stdio 구성입니다. [`child_process.spawn()`](/ko/nodejs/api/child_process#child_processspawncommand-args-options)의 [`stdio`](/ko/nodejs/api/child_process#optionsstdio)를 참조하십시오. `stdio`가 지정되지 않은 경우 기본적으로 `stderr`는 부모 프로세스의 stderr로 출력됩니다. **기본값:** `'pipe'`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 환경 키-값 쌍입니다. **기본값:** `process.env`.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스의 사용자 ID를 설정합니다( [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2) 참조).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스의 그룹 ID를 설정합니다( [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2) 참조).
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스가 실행될 수 있는 최대 시간(밀리초)입니다. **기본값:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 스폰된 프로세스가 종료될 때 사용될 신호 값입니다. **기본값:** `'SIGTERM'`.
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) stdout 또는 stderr에서 허용되는 최대 데이터 양(바이트)입니다. 초과하면 자식 프로세스가 종료됩니다. [`maxBuffer` 및 유니코드](/ko/nodejs/api/child_process#maxbuffer-and-unicode)의 주의 사항을 참조하십시오. **기본값:** `1024 * 1024`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 모든 stdio 입력 및 출력에 사용되는 인코딩입니다. **기본값:** `'buffer'`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 일반적으로 Windows 시스템에서 생성되는 하위 프로세스 콘솔 창을 숨깁니다. **기본값:** `false`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `true`인 경우 `command`를 셸 내부에서 실행합니다. Unix에서는 `'/bin/sh'`를 사용하고 Windows에서는 `process.env.ComSpec`를 사용합니다. 다른 셸을 문자열로 지정할 수 있습니다. [셸 요구 사항](/ko/nodejs/api/child_process#shell-requirements) 및 [기본 Windows 셸](/ko/nodejs/api/child_process#default-windows-shell)을 참조하십시오. **기본값:** `false` (셸 없음).

- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 명령의 stdout입니다.

`child_process.execFileSync()` 메서드는 일반적으로 [`child_process.execFile()`](/ko/nodejs/api/child_process#child_processexecfilefile-args-options-callback)과 동일하지만 자식 프로세스가 완전히 닫힐 때까지 메서드가 반환되지 않는다는 점이 다릅니다. 시간 제한이 발생하고 `killSignal`이 전송되면 프로세스가 완전히 종료될 때까지 메서드는 반환되지 않습니다.

자식 프로세스가 `SIGTERM` 신호를 가로채서 처리하고 종료되지 않으면 부모 프로세스는 자식 프로세스가 종료될 때까지 기다립니다.

프로세스가 시간 초과되거나 0이 아닌 종료 코드를 가질 경우 이 메서드는 기본 [`child_process.spawnSync()`](/ko/nodejs/api/child_process#child_processspawnsynccommand-args-options)의 전체 결과를 포함하는 [`Error`](/ko/nodejs/api/errors#class-error)를 발생시킵니다.

**<code>shell</code> 옵션이 활성화된 경우 살균되지 않은 사용자 입력을 이 함수에 전달하지 마십시오.
셸 메타 문자가 포함된 입력은 임의의 명령 실행을 트리거하는 데 사용될 수 있습니다.**

::: code-group
```js [CJS]
const { execFileSync } = require('node:child_process');

try {
  const stdout = execFileSync('my-script.sh', ['my-arg'], {
    // 자식 프로세스에서 stdout 및 stderr을 캡처합니다.
    // 자식 stderr을 부모 stderr로 스트리밍하는 기본 동작을 덮어씁니다.
    stdio: 'pipe',

    // stdio 파이프에 utf8 인코딩을 사용합니다.
    encoding: 'utf8',
  });

  console.log(stdout);
} catch (err) {
  if (err.code) {
    // 자식 프로세스 생성 실패
    console.error(err.code);
  } else {
    // 자식이 생성되었지만 0이 아닌 종료 코드로 종료되었습니다.
    // 오류에는 자식의 stdout 및 stderr이 포함되어 있습니다.
    const { stdout, stderr } = err;

    console.error({ stdout, stderr });
  }
}
```

```js [ESM]
import { execFileSync } from 'node:child_process';

try {
  const stdout = execFileSync('my-script.sh', ['my-arg'], {
    // 자식 프로세스에서 stdout 및 stderr을 캡처합니다.
    // 자식 stderr을 부모 stderr로 스트리밍하는 기본 동작을 덮어씁니다.
    stdio: 'pipe',

    // stdio 파이프에 utf8 인코딩을 사용합니다.
    encoding: 'utf8',
  });

  console.log(stdout);
} catch (err) {
  if (err.code) {
    // 자식 프로세스 생성 실패
    console.error(err.code);
  } else {
    // 자식이 생성되었지만 0이 아닌 종료 코드로 종료되었습니다.
    // 오류에는 자식의 stdout 및 stderr이 포함되어 있습니다.
    const { stdout, stderr } = err;

    console.error({ stdout, stderr });
  }
}
```
:::


### `child_process.execSync(command[, options])` {#child_processexecsynccommand-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.4.0, v14.18.0 | `cwd` 옵션은 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체가 될 수 있습니다. |
| v10.10.0 | `input` 옵션은 이제 모든 `TypedArray` 또는 `DataView`가 될 수 있습니다. |
| v8.8.0 | `windowsHide` 옵션이 지원됩니다. |
| v8.0.0 | `input` 옵션은 이제 `Uint8Array`가 될 수 있습니다. |
| v0.11.12 | 추가됨: v0.11.12 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 실행할 명령어입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 자식 프로세스의 현재 작업 디렉터리입니다.
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 생성된 프로세스에 stdin으로 전달될 값입니다. `stdio[0]`이 `'pipe'`로 설정된 경우 이 값을 제공하면 `stdio[0]`을 덮어씁니다.
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 자식 stdio 구성입니다. [`child_process.spawn()`](/ko/nodejs/api/child_process#child_processspawncommand-args-options)의 [`stdio`](/ko/nodejs/api/child_process#optionsstdio)를 참조하십시오. `stdio`가 지정되지 않은 경우 기본적으로 `stderr`는 부모 프로세스의 stderr로 출력됩니다. **기본값:** `'pipe'`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 환경 키-값 쌍입니다. **기본값:** `process.env`.
    - `shell` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 명령을 실행할 셸입니다. [셸 요구 사항](/ko/nodejs/api/child_process#shell-requirements) 및 [기본 Windows 셸](/ko/nodejs/api/child_process#default-windows-shell)을 참조하십시오. **기본값:** Unix에서는 `'/bin/sh'`, Windows에서는 `process.env.ComSpec`.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스의 사용자 ID를 설정합니다. ([`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2) 참조).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스의 그룹 ID를 설정합니다. ([`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2) 참조).
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스가 실행될 수 있는 최대 시간을 밀리초 단위로 나타냅니다. **기본값:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 생성된 프로세스를 종료할 때 사용할 신호 값입니다. **기본값:** `'SIGTERM'`.
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) stdout 또는 stderr에서 허용되는 최대 데이터 양(바이트)입니다. 초과하면 자식 프로세스가 종료되고 모든 출력이 잘립니다. [`maxBuffer` 및 유니코드](/ko/nodejs/api/child_process#maxbuffer-and-unicode)의 주의 사항을 참조하십시오. **기본값:** `1024 * 1024`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 모든 stdio 입력 및 출력에 사용되는 인코딩입니다. **기본값:** `'buffer'`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 일반적으로 Windows 시스템에서 생성되는 하위 프로세스 콘솔 창을 숨깁니다. **기본값:** `false`.

- 반환값: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 명령의 stdout입니다.

`child_process.execSync()` 메서드는 일반적으로 [`child_process.exec()`](/ko/nodejs/api/child_process#child_processexeccommand-options-callback)와 동일하지만, 자식 프로세스가 완전히 닫힐 때까지 메서드가 반환되지 않는다는 점이 다릅니다. 시간 초과가 발생하고 `killSignal`이 전송되면 프로세스가 완전히 종료될 때까지 메서드가 반환되지 않습니다. 자식 프로세스가 `SIGTERM` 신호를 가로채서 처리하고 종료되지 않으면 부모 프로세스는 자식 프로세스가 종료될 때까지 기다립니다.

프로세스 시간이 초과되거나 0이 아닌 종료 코드가 있는 경우 이 메서드는 오류를 발생시킵니다. [`Error`](/ko/nodejs/api/errors#class-error) 객체에는 [`child_process.spawnSync()`](/ko/nodejs/api/child_process#child_processspawnsynccommand-args-options)의 전체 결과가 포함됩니다.

**이 함수에 살균되지 않은 사용자 입력을 전달하지 마십시오. 셸 메타 문자를 포함하는 모든 입력은 임의의 명령 실행을 트리거하는 데 사용될 수 있습니다.**


### `child_process.spawnSync(command[, args][, options])` {#child_processspawnsynccommand-args-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.4.0, v14.18.0 | `cwd` 옵션은 `file:` 프로토콜을 사용하는 WHATWG `URL` 객체일 수 있습니다. |
| v10.10.0 | 이제 `input` 옵션은 모든 `TypedArray` 또는 `DataView`가 될 수 있습니다. |
| v8.8.0 | 이제 `windowsHide` 옵션이 지원됩니다. |
| v8.0.0 | 이제 `input` 옵션은 `Uint8Array`가 될 수 있습니다. |
| v5.7.0 | 이제 `shell` 옵션이 지원됩니다. |
| v6.2.1, v4.5.0 | 이제 `encoding` 옵션을 명시적으로 `buffer`로 설정할 수 있습니다. |
| v0.11.12 | v0.11.12에 추가됨 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 실행할 명령어입니다.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 문자열 인자 목록입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 자식 프로세스의 현재 작업 디렉터리입니다.
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 생성된 프로세스에 stdin으로 전달될 값입니다. `stdio[0]`이 `'pipe'`로 설정된 경우 이 값을 제공하면 `stdio[0]`을 덮어씁니다.
    - `argv0` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 자식 프로세스에 전송된 `argv[0]`의 값을 명시적으로 설정합니다. 지정하지 않으면 `command`로 설정됩니다.
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 자식의 stdio 구성입니다. [`child_process.spawn()`](/ko/nodejs/api/child_process#child_processspawncommand-args-options)의 [`stdio`](/ko/nodejs/api/child_process#optionsstdio)를 참조하십시오. **기본값:** `'pipe'`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 환경 키-값 쌍입니다. **기본값:** `process.env`.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스의 사용자 ID를 설정합니다([`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2) 참조).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스의 그룹 ID를 설정합니다([`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2) 참조).
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 프로세스가 실행될 수 있는 최대 시간(밀리초)입니다. **기본값:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 생성된 프로세스를 종료할 때 사용할 신호 값입니다. **기본값:** `'SIGTERM'`.
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) stdout 또는 stderr에서 허용되는 최대 데이터 양(바이트)입니다. 초과하면 자식 프로세스가 종료되고 모든 출력이 잘립니다. [`maxBuffer` 및 유니코드](/ko/nodejs/api/child_process#maxbuffer-and-unicode)의 주의 사항을 참조하십시오. **기본값:** `1024 * 1024`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 모든 stdio 입력 및 출력에 사용되는 인코딩입니다. **기본값:** `'buffer'`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `true`이면 `command`를 셸 내부에서 실행합니다. Unix에서는 `'/bin/sh'`를 사용하고 Windows에서는 `process.env.ComSpec`를 사용합니다. 다른 셸을 문자열로 지정할 수 있습니다. [셸 요구 사항](/ko/nodejs/api/child_process#shell-requirements) 및 [기본 Windows 셸](/ko/nodejs/api/child_process#default-windows-shell)을 참조하십시오. **기본값:** `false` (셸 없음).
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Windows에서는 인용 또는 이스케이프가 수행되지 않습니다. Unix에서는 무시됩니다. `shell`이 지정되고 CMD인 경우 자동으로 `true`로 설정됩니다. **기본값:** `false`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Windows 시스템에서 일반적으로 생성되는 하위 프로세스 콘솔 창을 숨깁니다. **기본값:** `false`.

- 반환값: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `pid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 자식 프로세스의 Pid입니다.
    - `output` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) stdio 출력의 결과 배열입니다.
    - `stdout` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `output[1]`의 내용입니다.
    - `stderr` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `output[2]`의 내용입니다.
    - `status` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 하위 프로세스의 종료 코드이거나, 신호로 인해 하위 프로세스가 종료된 경우 `null`입니다.
    - `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 하위 프로세스를 종료하는 데 사용된 신호이거나, 신호로 인해 하위 프로세스가 종료되지 않은 경우 `null`입니다.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 자식 프로세스가 실패하거나 시간 초과된 경우의 오류 객체입니다.

`child_process.spawnSync()` 메서드는 일반적으로 [`child_process.spawn()`](/ko/nodejs/api/child_process#child_processspawncommand-args-options)와 동일하지만, 자식 프로세스가 완전히 닫힐 때까지 함수가 반환되지 않는다는 점이 다릅니다. 시간 초과가 발생하고 `killSignal`이 전송되면 프로세스가 완전히 종료될 때까지 메서드가 반환되지 않습니다. 프로세스가 `SIGTERM` 신호를 가로채서 처리하고 종료하지 않으면 부모 프로세스는 자식 프로세스가 종료될 때까지 기다립니다.

**<code>shell</code> 옵션을 활성화한 경우, 이 함수에 살균되지 않은 사용자 입력을 전달하지 마십시오. 셸 메타 문자를 포함하는 모든 입력은 임의의 명령 실행을 트리거하는 데 사용될 수 있습니다.**


## 클래스: `ChildProcess` {#class-childprocess}

**추가됨: v2.2.0**

- 확장: [\<EventEmitter\>](/ko/nodejs/api/events#class-eventemitter)

`ChildProcess` 인스턴스는 생성된 자식 프로세스를 나타냅니다.

`ChildProcess` 인스턴스는 직접 생성하기 위한 것이 아닙니다. 대신 [`child_process.spawn()`](/ko/nodejs/api/child_process#child_processspawncommand-args-options), [`child_process.exec()`](/ko/nodejs/api/child_process#child_processexeccommand-options-callback), [`child_process.execFile()`](/ko/nodejs/api/child_process#child_processexecfilefile-args-options-callback) 또는 [`child_process.fork()`](/ko/nodejs/api/child_process#child_processforkmodulepath-args-options) 메서드를 사용하여 `ChildProcess` 인스턴스를 생성합니다.

### 이벤트: `'close'` {#event-close}

**추가됨: v0.7.7**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 자식 프로세스가 자체적으로 종료된 경우 종료 코드입니다.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 자식 프로세스가 종료된 신호입니다.

`'close'` 이벤트는 프로세스가 종료된 *후* 자식 프로세스의 stdio 스트림이 닫힌 후에 발생합니다. 이는 여러 프로세스가 동일한 stdio 스트림을 공유할 수 있으므로 [`'exit'`](/ko/nodejs/api/child_process#event-exit) 이벤트와는 다릅니다. `'close'` 이벤트는 항상 [`'exit'`](/ko/nodejs/api/child_process#event-exit)가 이미 발생했거나 자식 프로세스가 스폰되지 못한 경우 [`'error'`](/ko/nodejs/api/child_process#event-error)가 발생한 후에 발생합니다.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::


### 이벤트: `'disconnect'` {#event-disconnect}

**추가된 버전: v0.7.2**

`'disconnect'` 이벤트는 부모 프로세스에서 [`subprocess.disconnect()`](/ko/nodejs/api/child_process#subprocessdisconnect) 메서드 또는 자식 프로세스에서 [`process.disconnect()`](/ko/nodejs/api/process#processdisconnect)를 호출한 후에 발생합니다. 연결이 끊어진 후에는 메시지를 보내거나 받을 수 없으며, [`subprocess.connected`](/ko/nodejs/api/child_process#subprocessconnected) 속성은 `false`가 됩니다.

### 이벤트: `'error'` {#event-error}

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 에러입니다.

`'error'` 이벤트는 다음과 같은 경우에 발생합니다.

- 프로세스를 생성할 수 없는 경우
- 프로세스를 종료할 수 없는 경우
- 자식 프로세스로 메시지를 보내는 데 실패한 경우
- 자식 프로세스가 `signal` 옵션을 통해 중단된 경우

`'exit'` 이벤트는 오류가 발생한 후에 발생할 수도 있고 발생하지 않을 수도 있습니다. `'exit'` 및 `'error'` 이벤트를 모두 수신하는 경우, 핸들러 함수를 실수로 여러 번 호출하지 않도록 주의하십시오.

[`subprocess.kill()`](/ko/nodejs/api/child_process#subprocesskillsignal) 및 [`subprocess.send()`](/ko/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback)도 참조하십시오.

### 이벤트: `'exit'` {#event-exit}

**추가된 버전: v0.1.90**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 자식 프로세스가 스스로 종료된 경우의 종료 코드입니다.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 자식 프로세스가 종료된 신호입니다.

`'exit'` 이벤트는 자식 프로세스가 종료된 후에 발생합니다. 프로세스가 종료되면 `code`는 프로세스의 최종 종료 코드이고, 그렇지 않으면 `null`입니다. 프로세스가 신호 수신으로 인해 종료되면 `signal`은 신호의 문자열 이름이고, 그렇지 않으면 `null`입니다. 둘 중 하나는 항상 `null`이 아닙니다.

`'exit'` 이벤트가 트리거되면 자식 프로세스 stdio 스트림이 여전히 열려 있을 수 있습니다.

Node.js는 `SIGINT` 및 `SIGTERM`에 대한 신호 처리기를 설정하며, Node.js 프로세스는 해당 신호를 수신하더라도 즉시 종료되지 않습니다. 대신 Node.js는 일련의 정리 작업을 수행한 다음 처리된 신호를 다시 발생시킵니다.

[`waitpid(2)`](http://man7.org/linux/man-pages/man2/waitpid.2)를 참조하십시오.


### 이벤트: `'message'` {#event-message}

**추가된 버전: v0.5.9**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 구문 분석된 JSON 객체 또는 원시 값입니다.
- `sendHandle` [\<Handle\>](/ko/nodejs/api/net#serverlistenhandle-backlog-callback) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `undefined`이거나 [`net.Socket`](/ko/nodejs/api/net#class-netsocket), [`net.Server`](/ko/nodejs/api/net#class-netserver) 또는 [`dgram.Socket`](/ko/nodejs/api/dgram#class-dgramsocket) 객체입니다.

자식 프로세스가 [`process.send()`](/ko/nodejs/api/process#processsendmessage-sendhandle-options-callback)를 사용하여 메시지를 보낼 때 `'message'` 이벤트가 트리거됩니다.

메시지는 직렬화 및 구문 분석을 거칩니다. 결과 메시지는 원래 전송된 메시지와 동일하지 않을 수 있습니다.

자식 프로세스를 생성할 때 `serialization` 옵션이 `'advanced'`로 설정된 경우, `message` 인수는 JSON이 나타낼 수 없는 데이터를 포함할 수 있습니다. 자세한 내용은 [고급 직렬화](/ko/nodejs/api/child_process#advanced-serialization)를 참조하세요.

### 이벤트: `'spawn'` {#event-spawn}

**추가된 버전: v15.1.0, v14.17.0**

`'spawn'` 이벤트는 자식 프로세스가 성공적으로 생성된 후 한 번 발생합니다. 자식 프로세스가 성공적으로 생성되지 않으면 `'spawn'` 이벤트가 발생하지 않고 대신 `'error'` 이벤트가 발생합니다.

발생하는 경우 `'spawn'` 이벤트는 다른 모든 이벤트보다 먼저 발생하고 `stdout` 또는 `stderr`를 통해 데이터를 수신하기 전에 발생합니다.

`'spawn'` 이벤트는 생성된 프로세스 **내부**에서 오류가 발생하는지 여부에 관계없이 발생합니다. 예를 들어, `bash some-command`가 성공적으로 생성되면 `'spawn'` 이벤트가 발생하지만 `bash`는 `some-command`를 생성하지 못할 수 있습니다. 이러한 주의 사항은 `{ shell: true }`를 사용할 때도 적용됩니다.

### `subprocess.channel` {#subprocesschannel}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.0.0 | 객체가 더 이상 실수로 네이티브 C++ 바인딩을 노출하지 않습니다. |
| v7.1.0 | 추가된 버전: v7.1.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 자식 프로세스에 대한 IPC 채널을 나타내는 파이프입니다.

`subprocess.channel` 속성은 자식의 IPC 채널에 대한 참조입니다. IPC 채널이 없으면 이 속성은 `undefined`입니다.


#### `subprocess.channel.ref()` {#subprocesschannelref}

**Added in: v7.1.0**

이 메서드는 이전에 `.unref()`가 호출된 경우 IPC 채널이 상위 프로세스의 이벤트 루프를 계속 실행하도록 합니다.

#### `subprocess.channel.unref()` {#subprocesschannelunref}

**Added in: v7.1.0**

이 메서드는 IPC 채널이 상위 프로세스의 이벤트 루프를 계속 실행하지 않도록 하고 채널이 열려 있는 동안에도 완료되도록 합니다.

### `subprocess.connected` {#subprocessconnected}

**Added in: v0.7.2**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `subprocess.disconnect()`가 호출된 후 `false`로 설정됩니다.

`subprocess.connected` 속성은 자식 프로세스에서 메시지를 보내고 받을 수 있는지 여부를 나타냅니다. `subprocess.connected`가 `false`이면 더 이상 메시지를 보내거나 받을 수 없습니다.

### `subprocess.disconnect()` {#subprocessdisconnect}

**Added in: v0.7.2**

상위 및 자식 프로세스 간의 IPC 채널을 닫아 다른 연결이 유지되지 않으면 자식 프로세스가 정상적으로 종료되도록 합니다. 이 메서드를 호출하면 상위 및 자식 프로세스(각각)에서 `subprocess.connected` 및 `process.connected` 속성이 `false`로 설정되고 프로세스 간에 메시지를 더 이상 전달할 수 없습니다.

수신 중인 메시지가 없으면 `'disconnect'` 이벤트가 발생합니다. 이는 `subprocess.disconnect()`를 호출한 직후에 가장 자주 트리거됩니다.

자식 프로세스가 Node.js 인스턴스인 경우(예: [`child_process.fork()`](/ko/nodejs/api/child_process#child_processforkmodulepath-args-options)를 사용하여 생성됨) 자식 프로세스 내에서 `process.disconnect()` 메서드를 호출하여 IPC 채널을 닫을 수도 있습니다.

### `subprocess.exitCode` {#subprocessexitcode}

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`subprocess.exitCode` 속성은 자식 프로세스의 종료 코드를 나타냅니다. 자식 프로세스가 여전히 실행 중인 경우 필드는 `null`이 됩니다.

### `subprocess.kill([signal])` {#subprocesskillsignal}

**Added in: v0.1.90**

- `signal` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`subprocess.kill()` 메서드는 자식 프로세스에 신호를 보냅니다. 인수가 제공되지 않으면 프로세스에 `'SIGTERM'` 신호가 전송됩니다. 사용 가능한 신호 목록은 [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7)을 참조하십시오. 이 함수는 [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2)가 성공하면 `true`를 반환하고, 그렇지 않으면 `false`를 반환합니다.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
  console.log(
    `자식 프로세스가 신호 ${signal}의 수신으로 인해 종료되었습니다.`);
});

// 프로세스에 SIGHUP을 보냅니다.
grep.kill('SIGHUP');
```

```js [ESM]
import { spawn } from 'node:child_process';
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
  console.log(
    `자식 프로세스가 신호 ${signal}의 수신으로 인해 종료되었습니다.`);
});

// 프로세스에 SIGHUP을 보냅니다.
grep.kill('SIGHUP');
```
:::

신호를 전달할 수 없으면 [`ChildProcess`](/ko/nodejs/api/child_process#class-childprocess) 객체가 [`'error'`](/ko/nodejs/api/child_process#event-error) 이벤트를 발생시킬 수 있습니다. 이미 종료된 자식 프로세스에 신호를 보내는 것은 오류는 아니지만 예기치 않은 결과가 발생할 수 있습니다. 특히 프로세스 식별자(PID)가 다른 프로세스에 재할당된 경우 신호가 대신 해당 프로세스에 전달되어 예상치 못한 결과가 발생할 수 있습니다.

함수 이름은 `kill`이지만 자식 프로세스에 전달된 신호가 실제로 프로세스를 종료하지 않을 수 있습니다.

참조용으로 [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2)를 참조하십시오.

POSIX 신호가 존재하지 않는 Windows에서는 `signal` 인수가 무시됩니다(단, `'SIGKILL'`, `'SIGTERM'`, `'SIGINT'` 및 `'SIGQUIT'` 제외). 프로세스는 항상 강제로 갑작스럽게 종료됩니다( `'SIGKILL'`과 유사). 자세한 내용은 [신호 이벤트](/ko/nodejs/api/process#signal-events)를 참조하십시오.

Linux에서는 자식 프로세스의 부모를 종료하려고 시도할 때 자식 프로세스의 자식 프로세스가 종료되지 않습니다. 이는 셸에서 새 프로세스를 실행하거나 `ChildProcess`의 `shell` 옵션을 사용할 때 발생할 수 있습니다.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');

const subprocess = spawn(
  'sh',
  [
    '-c',
    `node -e "setInterval(() => {
      console.log(process.pid, 'is alive')
    }, 500);"`,
  ], {
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

setTimeout(() => {
  subprocess.kill(); // 셸에서 Node.js 프로세스를 종료하지 않습니다.
}, 2000);
```

```js [ESM]
import { spawn } from 'node:child_process';

const subprocess = spawn(
  'sh',
  [
    '-c',
    `node -e "setInterval(() => {
      console.log(process.pid, 'is alive')
    }, 500);"`,
  ], {
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

setTimeout(() => {
  subprocess.kill(); // 셸에서 Node.js 프로세스를 종료하지 않습니다.
}, 2000);
```
:::


### `subprocess[Symbol.dispose]()` {#subprocesssymboldispose}

**추가된 버전: v20.5.0, v18.18.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

`'SIGTERM'`을 사용하여 [`subprocess.kill()`](/ko/nodejs/api/child_process#subprocesskillsignal)을 호출합니다.

### `subprocess.killed` {#subprocesskilled}

**추가된 버전: v0.5.10**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `subprocess.kill()`이 자식 프로세스에 신호를 성공적으로 보내는 데 사용된 후 `true`로 설정됩니다.

`subprocess.killed` 속성은 자식 프로세스가 `subprocess.kill()`로부터 신호를 성공적으로 수신했는지 여부를 나타냅니다. `killed` 속성은 자식 프로세스가 종료되었음을 나타내지 않습니다.

### `subprocess.pid` {#subprocesspid}

**추가된 버전: v0.1.90**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

자식 프로세스의 프로세스 식별자(PID)를 반환합니다. 오류로 인해 자식 프로세스가 생성되지 못하면 값은 `undefined`이고 `error`가 발생합니다.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const grep = spawn('grep', ['ssh']);

console.log(`Spawned child pid: ${grep.pid}`);
grep.stdin.end();
```

```js [ESM]
import { spawn } from 'node:child_process';
const grep = spawn('grep', ['ssh']);

console.log(`Spawned child pid: ${grep.pid}`);
grep.stdin.end();
```
:::

### `subprocess.ref()` {#subprocessref}

**추가된 버전: v0.7.10**

`subprocess.unref()`를 호출한 후 `subprocess.ref()`를 호출하면 자식 프로세스에 대해 제거된 참조 횟수가 복원되어 부모 프로세스가 종료되기 전에 자식 프로세스가 종료될 때까지 기다립니다.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
subprocess.ref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
subprocess.ref();
```
:::


### `subprocess.send(message[, sendHandle[, options]][, callback])` {#subprocesssendmessage-sendhandle-options-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v5.8.0 | 이제 `options` 매개변수와 특히 `keepOpen` 옵션이 지원됩니다. |
| v5.0.0 | 이 메서드는 이제 흐름 제어를 위해 부울 값을 반환합니다. |
| v4.0.0 | 이제 `callback` 매개변수가 지원됩니다. |
| v0.5.9 | v0.5.9에 추가됨 |
:::

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<Handle\>](/ko/nodejs/api/net#serverlistenhandle-backlog-callback) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `undefined` 또는 [`net.Socket`](/ko/nodejs/api/net#class-netsocket), [`net.Server`](/ko/nodejs/api/net#class-netserver) 또는 [`dgram.Socket`](/ko/nodejs/api/dgram#class-dgramsocket) 객체입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `options` 인수는 특정 유형의 핸들 전송을 매개변수화하는 데 사용되는 객체입니다. `options`는 다음 속성을 지원합니다.
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `net.Socket` 인스턴스를 전달할 때 사용할 수 있는 값입니다. `true`이면 소켓이 전송 프로세스에서 열린 상태로 유지됩니다. **기본값:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

부모와 자식 프로세스 사이에 IPC 채널이 설정된 경우(예: [`child_process.fork()`](/ko/nodejs/api/child_process#child_processforkmodulepath-args-options)를 사용하는 경우) `subprocess.send()` 메서드를 사용하여 자식 프로세스에 메시지를 보낼 수 있습니다. 자식 프로세스가 Node.js 인스턴스인 경우 이러한 메시지는 [`'message'`](/ko/nodejs/api/process#event-message) 이벤트를 통해 수신할 수 있습니다.

메시지는 직렬화 및 구문 분석을 거칩니다. 결과 메시지는 원래 보낸 메시지와 동일하지 않을 수 있습니다.

예를 들어, 부모 스크립트에서:

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const forkedProcess = fork(`${__dirname}/sub.js`);

forkedProcess.on('message', (message) => {
  console.log('PARENT got message:', message);
});

// 자식이 CHILD got message: { hello: 'world' }를 출력하도록 합니다.
forkedProcess.send({ hello: 'world' });
```

```js [ESM]
import { fork } from 'node:child_process';
const forkedProcess = fork(`${import.meta.dirname}/sub.js`);

forkedProcess.on('message', (message) => {
  console.log('PARENT got message:', message);
});

// 자식이 CHILD got message: { hello: 'world' }를 출력하도록 합니다.
forkedProcess.send({ hello: 'world' });
```
:::

그리고 자식 스크립트 `'sub.js'`는 다음과 같습니다.

```js [ESM]
process.on('message', (message) => {
  console.log('CHILD got message:', message);
});

// 부모가 PARENT got message: { foo: 'bar', baz: null }를 출력하도록 합니다.
process.send({ foo: 'bar', baz: NaN });
```

자식 Node.js 프로세스에는 자식 프로세스가 부모 프로세스에 메시지를 다시 보낼 수 있도록 하는 자체 [`process.send()`](/ko/nodejs/api/process#processsendmessage-sendhandle-options-callback) 메서드가 있습니다.

`{cmd: 'NODE_foo'}` 메시지를 보내는 특별한 경우가 있습니다. `cmd` 속성에 `NODE_` 접두사가 포함된 메시지는 Node.js 코어 내에서 사용하도록 예약되어 있으며 자식의 [`'message'`](/ko/nodejs/api/process#event-message) 이벤트에서 발생하지 않습니다. 대신 이러한 메시지는 `'internalMessage'` 이벤트를 사용하여 발생하며 Node.js에서 내부적으로 소비됩니다. 응용 프로그램은 예고 없이 변경될 수 있으므로 이러한 메시지를 사용하거나 `'internalMessage'` 이벤트를 수신하지 않아야 합니다.

`subprocess.send()`에 전달될 수 있는 선택적 `sendHandle` 인수는 TCP 서버 또는 소켓 객체를 자식 프로세스에 전달하기 위한 것입니다. 자식 프로세스는 [`'message'`](/ko/nodejs/api/process#event-message) 이벤트에 등록된 콜백 함수에 전달된 두 번째 인수로 객체를 받습니다. 소켓에서 수신되어 버퍼링된 데이터는 자식에게 전송되지 않습니다. Windows에서는 IPC 소켓 전송이 지원되지 않습니다.

선택적 `callback`은 메시지가 전송된 후이지만 자식 프로세스가 메시지를 수신하기 전에 호출되는 함수입니다. 함수는 성공 시 `null`, 실패 시 [`Error`](/ko/nodejs/api/errors#class-error) 객체의 단일 인수로 호출됩니다.

`callback` 함수가 제공되지 않고 메시지를 보낼 수 없는 경우 [`ChildProcess`](/ko/nodejs/api/child_process#class-childprocess) 객체에서 `'error'` 이벤트가 발생합니다. 이는 예를 들어 자식 프로세스가 이미 종료된 경우에 발생할 수 있습니다.

채널이 닫혔거나 전송되지 않은 메시지의 백로그가 더 이상 보내는 것이 현명하지 않은 임계값을 초과하면 `subprocess.send()`는 `false`를 반환합니다. 그렇지 않으면 메서드는 `true`를 반환합니다. `callback` 함수를 사용하여 흐름 제어를 구현할 수 있습니다.


#### 예시: 서버 객체 전송 {#example-sending-a-server-object}

`sendHandle` 인수는 예를 들어 아래 예제에서 보이는 것처럼 TCP 서버 객체의 핸들을 자식 프로세스에 전달하는 데 사용할 수 있습니다.

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const subprocess = fork('subprocess.js');

// 서버 객체를 열고 핸들을 전송합니다.
const server = createServer();
server.on('connection', (socket) => {
  socket.end('handled by parent');
});
server.listen(1337, () => {
  subprocess.send('server', server);
});
```

```js [ESM]
import { fork } from 'node:child_process';
import { createServer } from 'node:net';

const subprocess = fork('subprocess.js');

// 서버 객체를 열고 핸들을 전송합니다.
const server = createServer();
server.on('connection', (socket) => {
  socket.end('handled by parent');
});
server.listen(1337, () => {
  subprocess.send('server', server);
});
```
:::

그러면 자식 프로세스는 서버 객체를 다음과 같이 받습니다.

```js [ESM]
process.on('message', (m, server) => {
  if (m === 'server') {
    server.on('connection', (socket) => {
      socket.end('handled by child');
    });
  }
});
```
이제 서버가 부모와 자식 간에 공유되면 일부 연결은 부모가 처리하고 일부 연결은 자식이 처리할 수 있습니다.

위의 예에서는 `node:net` 모듈을 사용하여 생성된 서버를 사용하지만, `node:dgram` 모듈 서버는 `'connection'` 대신 `'message'` 이벤트에 수신 대기하고 `server.listen()` 대신 `server.bind()`를 사용하는 것을 제외하고는 정확히 동일한 워크플로를 사용합니다. 그러나 이는 유닉스 플랫폼에서만 지원됩니다.

#### 예시: 소켓 객체 전송 {#example-sending-a-socket-object}

마찬가지로 `sendHandler` 인수를 사용하여 소켓의 핸들을 자식 프로세스에 전달할 수 있습니다. 아래 예제는 각각 "일반" 또는 "특수" 우선 순위로 연결을 처리하는 두 개의 자식을 생성합니다.

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const normal = fork('subprocess.js', ['normal']);
const special = fork('subprocess.js', ['special']);

// 서버를 열고 소켓을 자식에게 보냅니다. pauseOnConnect를 사용하여
// 소켓이 자식 프로세스로 전송되기 전에 읽히지 않도록 합니다.
const server = createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {

  // 특별 우선 순위인 경우...
  if (socket.remoteAddress === '74.125.127.100') {
    special.send('socket', socket);
    return;
  }
  // 이것은 일반 우선 순위입니다.
  normal.send('socket', socket);
});
server.listen(1337);
```

```js [ESM]
import { fork } from 'node:child_process';
import { createServer } from 'node:net';

const normal = fork('subprocess.js', ['normal']);
const special = fork('subprocess.js', ['special']);

// 서버를 열고 소켓을 자식에게 보냅니다. pauseOnConnect를 사용하여
// 소켓이 자식 프로세스로 전송되기 전에 읽히지 않도록 합니다.
const server = createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {

  // 특별 우선 순위인 경우...
  if (socket.remoteAddress === '74.125.127.100') {
    special.send('socket', socket);
    return;
  }
  // 이것은 일반 우선 순위입니다.
  normal.send('socket', socket);
});
server.listen(1337);
```
:::

`subprocess.js`는 이벤트 콜백 함수에 전달된 두 번째 인수로 소켓 핸들을 받습니다.

```js [ESM]
process.on('message', (m, socket) => {
  if (m === 'socket') {
    if (socket) {
      // 클라이언트 소켓이 존재하는지 확인합니다.
      // 소켓이 전송된 시점과 자식 프로세스에서 수신된 시점 사이에 소켓이 닫힐 수 있습니다.
      socket.end(`Request handled with ${process.argv[2]} priority`);
    }
  }
});
```
하위 프로세스에 전달된 소켓에서는 `.maxConnections`를 사용하지 마십시오. 부모는 소켓이 소멸되는 시점을 추적할 수 없습니다.

하위 프로세스의 모든 `'message'` 핸들러는 연결을 하위 프로세스로 보내는 데 걸리는 시간 동안 연결이 닫혔을 수 있으므로 `socket`이 존재하는지 확인해야 합니다.


### `subprocess.signalCode` {#subprocesssignalcode}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

`subprocess.signalCode` 속성은 자식 프로세스가 수신한 신호(있는 경우)를 나타내고, 그렇지 않으면 `null`을 나타냅니다.

### `subprocess.spawnargs` {#subprocessspawnargs}

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

`subprocess.spawnargs` 속성은 자식 프로세스가 시작될 때 사용된 전체 명령줄 인수 목록을 나타냅니다.

### `subprocess.spawnfile` {#subprocessspawnfile}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`subprocess.spawnfile` 속성은 시작된 자식 프로세스의 실행 파일 이름을 나타냅니다.

[`child_process.fork()`](/ko/nodejs/api/child_process#child_processforkmodulepath-args-options)의 경우, 해당 값은 [`process.execPath`](/ko/nodejs/api/process#processexecpath)와 같습니다. [`child_process.spawn()`](/ko/nodejs/api/child_process#child_processspawncommand-args-options)의 경우, 해당 값은 실행 파일의 이름입니다. [`child_process.exec()`](/ko/nodejs/api/child_process#child_processexeccommand-options-callback)의 경우, 해당 값은 자식 프로세스가 시작되는 셸의 이름입니다.

### `subprocess.stderr` {#subprocessstderr}

**추가된 버전: v0.1.90**

- [\<stream.Readable\>](/ko/nodejs/api/stream#class-streamreadable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

자식 프로세스의 `stderr`을 나타내는 `Readable Stream`입니다.

자식 프로세스가 `stdio[2]`가 `'pipe'` 이외의 값으로 설정되어 생성된 경우, 이는 `null`이 됩니다.

`subprocess.stderr`는 `subprocess.stdio[2]`의 별칭입니다. 두 속성 모두 동일한 값을 참조합니다.

자식 프로세스를 성공적으로 생성하지 못한 경우 `subprocess.stderr` 속성은 `null` 또는 `undefined`가 될 수 있습니다.


### `subprocess.stdin` {#subprocessstdin}

**추가된 버전: v0.1.90**

- [\<stream.Writable\>](/ko/nodejs/api/stream#class-streamwritable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

자식 프로세스의 `stdin`을 나타내는 `Writable Stream`입니다.

자식 프로세스가 모든 입력을 읽을 때까지 기다리는 경우, 이 스트림이 `end()`를 통해 닫힐 때까지 자식 프로세스는 계속되지 않습니다.

자식 프로세스가 `stdio[0]`을 `'pipe'` 이외의 다른 값으로 설정하여 생성된 경우, 이는 `null`이 됩니다.

`subprocess.stdin`은 `subprocess.stdio[0]`의 별칭입니다. 두 속성 모두 동일한 값을 참조합니다.

자식 프로세스를 성공적으로 생성할 수 없는 경우 `subprocess.stdin` 속성은 `null` 또는 `undefined`가 될 수 있습니다.

### `subprocess.stdio` {#subprocessstdio}

**추가된 버전: v0.7.10**

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

[`child_process.spawn()`](/ko/nodejs/api/child_process#child_processspawncommand-args-options)에 전달된 [`stdio`](/ko/nodejs/api/child_process#optionsstdio) 옵션에서 `'pipe'` 값으로 설정된 위치에 해당하는 자식 프로세스에 대한 파이프의 스파스 배열입니다. `subprocess.stdio[0]`, `subprocess.stdio[1]`, `subprocess.stdio[2]`는 각각 `subprocess.stdin`, `subprocess.stdout`, `subprocess.stderr`로도 사용할 수 있습니다.

다음 예제에서는 자식의 fd `1`(stdout)만 파이프로 구성되므로 부모의 `subprocess.stdio[1]`만 스트림이고 배열의 다른 모든 값은 `null`입니다.

::: code-group
```js [CJS]
const assert = require('node:assert');
const fs = require('node:fs');
const child_process = require('node:child_process');

const subprocess = child_process.spawn('ls', {
  stdio: [
    0, // Use parent's stdin for child.
    'pipe', // Pipe child's stdout to parent.
    fs.openSync('err.out', 'w'), // Direct child's stderr to a file.
  ],
});

assert.strictEqual(subprocess.stdio[0], null);
assert.strictEqual(subprocess.stdio[0], subprocess.stdin);

assert(subprocess.stdout);
assert.strictEqual(subprocess.stdio[1], subprocess.stdout);

assert.strictEqual(subprocess.stdio[2], null);
assert.strictEqual(subprocess.stdio[2], subprocess.stderr);
```

```js [ESM]
import assert from 'node:assert';
import fs from 'node:fs';
import child_process from 'node:child_process';

const subprocess = child_process.spawn('ls', {
  stdio: [
    0, // Use parent's stdin for child.
    'pipe', // Pipe child's stdout to parent.
    fs.openSync('err.out', 'w'), // Direct child's stderr to a file.
  ],
});

assert.strictEqual(subprocess.stdio[0], null);
assert.strictEqual(subprocess.stdio[0], subprocess.stdin);

assert(subprocess.stdout);
assert.strictEqual(subprocess.stdio[1], subprocess.stdout);

assert.strictEqual(subprocess.stdio[2], null);
assert.strictEqual(subprocess.stdio[2], subprocess.stderr);
```
:::

자식 프로세스를 성공적으로 생성할 수 없는 경우 `subprocess.stdio` 속성은 `undefined`가 될 수 있습니다.


### `subprocess.stdout` {#subprocessstdout}

**Added in: v0.1.90**

- [\<stream.Readable\>](/ko/nodejs/api/stream#class-streamreadable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

자식 프로세스의 `stdout`을 나타내는 `Readable Stream`입니다.

자식 프로세스가 `stdio[1]`이 `'pipe'`가 아닌 다른 값으로 설정된 상태로 생성된 경우, 이 값은 `null`이 됩니다.

`subprocess.stdout`은 `subprocess.stdio[1]`의 별칭입니다. 두 속성 모두 동일한 값을 참조합니다.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');

const subprocess = spawn('ls');

subprocess.stdout.on('data', (data) => {
  console.log(`Received chunk ${data}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';

const subprocess = spawn('ls');

subprocess.stdout.on('data', (data) => {
  console.log(`Received chunk ${data}`);
});
```
:::

자식 프로세스를 성공적으로 생성할 수 없는 경우 `subprocess.stdout` 속성은 `null` 또는 `undefined`일 수 있습니다.

### `subprocess.unref()` {#subprocessunref}

**Added in: v0.7.10**

기본적으로 부모 프로세스는 분리된 자식 프로세스가 종료될 때까지 기다립니다. 부모 프로세스가 특정 `subprocess`가 종료될 때까지 기다리지 않도록 하려면 `subprocess.unref()` 메서드를 사용하세요. 이렇게 하면 부모의 이벤트 루프가 자식 프로세스를 참조 횟수에 포함하지 않게 되어, 자식과 부모 프로세스 간에 설정된 IPC 채널이 없는 경우 부모가 자식과 독립적으로 종료될 수 있습니다.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```
:::


## `maxBuffer` 및 유니코드 {#maxbuffer-and-unicode}

`maxBuffer` 옵션은 `stdout` 또는 `stderr`에서 허용되는 최대 바이트 수를 지정합니다. 이 값을 초과하면 자식 프로세스가 종료됩니다. 이는 UTF-8 또는 UTF-16과 같은 멀티바이트 문자 인코딩을 포함하는 출력에 영향을 미칩니다. 예를 들어 `console.log('中文测试')`는 4개의 문자만 있지만 13개의 UTF-8 인코딩된 바이트를 `stdout`으로 보냅니다.

## 셸 요구 사항 {#shell-requirements}

셸은 `-c` 스위치를 이해해야 합니다. 셸이 `'cmd.exe'`인 경우 `/d /s /c` 스위치를 이해해야 하며 명령줄 구문 분석이 호환되어야 합니다.

## 기본 Windows 셸 {#default-windows-shell}

Microsoft는 `%COMSPEC%`이 루트 환경에서 `'cmd.exe'`의 경로를 포함해야 한다고 지정하지만, 자식 프로세스는 항상 동일한 요구 사항을 따르지 않습니다. 따라서 셸이 생성될 수 있는 `child_process` 함수에서 `process.env.ComSpec`을 사용할 수 없는 경우 `'cmd.exe'`가 대체 방법으로 사용됩니다.

## 고급 직렬화 {#advanced-serialization}

**추가된 버전: v13.2.0, v12.16.0**

자식 프로세스는 [HTML 구조적 복제 알고리즘](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)을 기반으로 하는 [`node:v8` 모듈의 직렬화 API](/ko/nodejs/api/v8#serialization-api)를 기반으로 하는 IPC를 위한 직렬화 메커니즘을 지원합니다. 이는 일반적으로 더 강력하며 `BigInt`, `Map` 및 `Set`, `ArrayBuffer` 및 `TypedArray`, `Buffer`, `Error`, `RegExp` 등과 같은 더 많은 내장 JavaScript 객체 유형을 지원합니다.

그러나 이 형식은 JSON의 완전한 상위 집합이 아니며, 예를 들어 이러한 내장 유형의 객체에 설정된 속성은 직렬화 단계를 통해 전달되지 않습니다. 또한 전달된 데이터의 구조에 따라 성능이 JSON과 동일하지 않을 수 있습니다. 따라서 이 기능을 사용하려면 [`child_process.spawn()`](/ko/nodejs/api/child_process#child_processspawncommand-args-options) 또는 [`child_process.fork()`](/ko/nodejs/api/child_process#child_processforkmodulepath-args-options)를 호출할 때 `serialization` 옵션을 `'advanced'`로 설정하여 옵트인해야 합니다.

