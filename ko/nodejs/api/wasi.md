---
title: Node.js WASI 문서
description: Node.js의 WebAssembly 시스템 인터페이스(WASI)에 대한 문서를 탐색하여 Node.js 환경에서 WASI를 사용하는 방법을 자세히 설명합니다. 파일 시스템 작업, 환경 변수 등의 API를 포함합니다.
head:
  - - meta
    - name: og:title
      content: Node.js WASI 문서 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 WebAssembly 시스템 인터페이스(WASI)에 대한 문서를 탐색하여 Node.js 환경에서 WASI를 사용하는 방법을 자세히 설명합니다. 파일 시스템 작업, 환경 변수 등의 API를 포함합니다.
  - - meta
    - name: twitter:title
      content: Node.js WASI 문서 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 WebAssembly 시스템 인터페이스(WASI)에 대한 문서를 탐색하여 Node.js 환경에서 WASI를 사용하는 방법을 자세히 설명합니다. 파일 시스템 작업, 환경 변수 등의 API를 포함합니다.
---


# WebAssembly System Interface (WASI) {#webassembly-system-interface-wasi}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

**<code>node:wasi</code> 모듈은 일부 WASI 런타임에서 제공하는 포괄적인 파일 시스템 보안 속성을 현재 제공하지 않습니다. 안전한 파일 시스템 샌드박싱에 대한 완전한 지원은 향후 구현될 수도 있고 구현되지 않을 수도 있습니다. 그 동안 신뢰할 수 없는 코드를 실행하는 데 의존하지 마십시오.**

**소스 코드:** [lib/wasi.js](https://github.com/nodejs/node/blob/v23.5.0/lib/wasi.js)

WASI API는 [WebAssembly System Interface](https://wasi.dev/) 사양의 구현을 제공합니다. WASI는 WebAssembly 애플리케이션에 POSIX와 유사한 함수 모음을 통해 기본 운영 체제에 대한 액세스를 제공합니다.

::: code-group
```js [ESM]
import { readFile } from 'node:fs/promises';
import { WASI } from 'node:wasi';
import { argv, env } from 'node:process';

const wasi = new WASI({
  version: 'preview1',
  args: argv,
  env,
  preopens: {
    '/local': '/some/real/path/that/wasm/can/access',
  },
});

const wasm = await WebAssembly.compile(
  await readFile(new URL('./demo.wasm', import.meta.url)),
);
const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());

wasi.start(instance);
```

```js [CJS]
'use strict';
const { readFile } = require('node:fs/promises');
const { WASI } = require('node:wasi';
const { argv, env } = require('node:process';
const { join } = require('node:path';

const wasi = new WASI({
  version: 'preview1',
  args: argv,
  env,
  preopens: {
    '/local': '/some/real/path/that/wasm/can/access',
  },
});

(async () => {
  const wasm = await WebAssembly.compile(
    await readFile(join(__dirname, 'demo.wasm')),
  );
  const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());

  wasi.start(instance);
})();
```
:::

위의 예제를 실행하려면 `demo.wat`라는 새 WebAssembly 텍스트 형식 파일을 만드십시오.

```text [TEXT]
(module
    ;; Import the required fd_write WASI function which will write the given io vectors to stdout
    ;; The function signature for fd_write is:
    ;; (File Descriptor, *iovs, iovs_len, nwritten) -> Returns number of bytes written
    (import "wasi_snapshot_preview1" "fd_write" (func $fd_write (param i32 i32 i32 i32) (result i32)))

    (memory 1)
    (export "memory" (memory 0))

    ;; Write 'hello world\n' to memory at an offset of 8 bytes
    ;; Note the trailing newline which is required for the text to appear
    (data (i32.const 8) "hello world\n")

    (func $main (export "_start")
        ;; Creating a new io vector within linear memory
        (i32.store (i32.const 0) (i32.const 8))  ;; iov.iov_base - This is a pointer to the start of the 'hello world\n' string
        (i32.store (i32.const 4) (i32.const 12))  ;; iov.iov_len - The length of the 'hello world\n' string

        (call $fd_write
            (i32.const 1) ;; file_descriptor - 1 for stdout
            (i32.const 0) ;; *iovs - The pointer to the iov array, which is stored at memory location 0
            (i32.const 1) ;; iovs_len - We're printing 1 string stored in an iov - so one.
            (i32.const 20) ;; nwritten - A place in memory to store the number of bytes written
        )
        drop ;; Discard the number of bytes written from the top of the stack
    )
)
```
[wabt](https://github.com/WebAssembly/wabt)를 사용하여 `.wat`를 `.wasm`으로 컴파일합니다.

```bash [BASH]
wat2wasm demo.wat
```

## 보안 {#security}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v21.2.0, v20.11.0 | WASI 보안 속성 명확화. |
| v21.2.0, v20.11.0 | 추가됨: v21.2.0, v20.11.0 |
:::

WASI는 애플리케이션에 자체 사용자 지정 `env`, `preopens`, `stdin`, `stdout`, `stderr` 및 `exit` 기능을 제공하는 기능 기반 모델을 제공합니다.

**현재 Node.js 위협 모델은 일부 WASI 런타임에 있는 것과 같은 안전한 샌드박싱을 제공하지 않습니다.**

기능 기능은 지원되지만 Node.js에서는 보안 모델을 구성하지 않습니다. 예를 들어 파일 시스템 샌드박싱은 다양한 기술로 이스케이프할 수 있습니다. 프로젝트에서는 이러한 보안 보장이 향후 추가될 수 있는지 여부를 모색하고 있습니다.

## 클래스: `WASI` {#class-wasi}

**추가됨: v13.3.0, v12.16.0**

`WASI` 클래스는 WASI 시스템 호출 API와 WASI 기반 애플리케이션 작업을 위한 추가 편의 메서드를 제공합니다. 각 `WASI` 인스턴스는 고유한 환경을 나타냅니다.

### `new WASI([options])` {#new-wasioptions}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.1.0 | returnOnExit의 기본값이 true로 변경됨. |
| v20.0.0 | 이제 version 옵션이 필수이며 기본값이 없습니다. |
| v19.8.0 | options에 version 필드가 추가됨. |
| v13.3.0, v12.16.0 | 추가됨: v13.3.0, v12.16.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `args` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) WebAssembly 애플리케이션이 명령줄 인수로 보게 될 문자열 배열입니다. 첫 번째 인수는 WASI 명령 자체의 가상 경로입니다. **기본값:** `[]`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) WebAssembly 애플리케이션이 해당 환경으로 보게 될 `process.env`와 유사한 객체입니다. **기본값:** `{}`.
    - `preopens` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 이 객체는 WebAssembly 애플리케이션의 로컬 디렉터리 구조를 나타냅니다. `preopens`의 문자열 키는 파일 시스템 내의 디렉터리로 처리됩니다. `preopens`의 해당 값은 호스트 머신의 해당 디렉터리에 대한 실제 경로입니다.
    - `returnOnExit` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 기본적으로 WASI 애플리케이션이 `__wasi_proc_exit()`를 호출하면 `wasi.start()`는 프로세스를 종료하는 대신 지정된 종료 코드로 반환됩니다. 이 옵션을 `false`로 설정하면 Node.js 프로세스가 지정된 종료 코드로 종료됩니다. **기본값:** `true`.
    - `stdin` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) WebAssembly 애플리케이션에서 표준 입력으로 사용되는 파일 설명자입니다. **기본값:** `0`.
    - `stdout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) WebAssembly 애플리케이션에서 표준 출력으로 사용되는 파일 설명자입니다. **기본값:** `1`.
    - `stderr` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) WebAssembly 애플리케이션에서 표준 오류로 사용되는 파일 설명자입니다. **기본값:** `2`.
    - `version` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 요청된 WASI 버전입니다. 현재 지원되는 유일한 버전은 `unstable` 및 `preview1`입니다. 이 옵션은 필수입니다.


### `wasi.getImportObject()` {#wasigetimportobject}

**Added in: v19.8.0**

WASI에서 제공하는 것 외에 다른 WASM 가져오기가 필요하지 않은 경우 `WebAssembly.instantiate()`에 전달할 수 있는 가져오기 객체를 반환합니다.

`unstable` 버전이 생성자에 전달된 경우 다음을 반환합니다.

```json [JSON]
{ wasi_unstable: wasi.wasiImport }
```
`preview1` 버전이 생성자에 전달되었거나 버전이 지정되지 않은 경우 다음을 반환합니다.

```json [JSON]
{ wasi_snapshot_preview1: wasi.wasiImport }
```
### `wasi.start(instance)` {#wasistartinstance}

**Added in: v13.3.0, v12.16.0**

- `instance` [\<WebAssembly.Instance\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)

`_start()` 내보내기를 호출하여 `instance`의 실행을 WASI 명령으로 시작하려고 시도합니다. `instance`에 `_start()` 내보내기가 없거나 `instance`에 `_initialize()` 내보내기가 포함된 경우 예외가 발생합니다.

`start()`는 `instance`가 `memory`라는 이름의 [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory)를 내보내도록 요구합니다. `instance`에 `memory` 내보내기가 없으면 예외가 발생합니다.

`start()`가 두 번 이상 호출되면 예외가 발생합니다.

### `wasi.initialize(instance)` {#wasiinitializeinstance}

**Added in: v14.6.0, v12.19.0**

- `instance` [\<WebAssembly.Instance\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)

`_initialize()` 내보내기가 있는 경우 이를 호출하여 `instance`를 WASI 리액터로 초기화하려고 시도합니다. `instance`에 `_start()` 내보내기가 포함된 경우 예외가 발생합니다.

`initialize()`는 `instance`가 `memory`라는 이름의 [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory)를 내보내도록 요구합니다. `instance`에 `memory` 내보내기가 없으면 예외가 발생합니다.

`initialize()`가 두 번 이상 호출되면 예외가 발생합니다.

### `wasi.wasiImport` {#wasiwasiimport}

**Added in: v13.3.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`wasiImport`는 WASI 시스템 호출 API를 구현하는 객체입니다. 이 객체는 [`WebAssembly.Instance`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)를 인스턴스화하는 동안 `wasi_snapshot_preview1` 가져오기로 전달해야 합니다.

