---
title: Node.js CLI 옵션
description: 이 페이지는 Node.js에서 사용 가능한 명령줄 옵션에 대한 포괄적인 가이드를 제공하며, 실행 환경 설정, 디버깅 관리, 실행 동작 제어에 사용되는 다양한 플래그와 인수의 사용 방법을 자세히 설명합니다.
head:
  - - meta
    - name: og:title
      content: Node.js CLI 옵션 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 이 페이지는 Node.js에서 사용 가능한 명령줄 옵션에 대한 포괄적인 가이드를 제공하며, 실행 환경 설정, 디버깅 관리, 실행 동작 제어에 사용되는 다양한 플래그와 인수의 사용 방법을 자세히 설명합니다.
  - - meta
    - name: twitter:title
      content: Node.js CLI 옵션 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 이 페이지는 Node.js에서 사용 가능한 명령줄 옵션에 대한 포괄적인 가이드를 제공하며, 실행 환경 설정, 디버깅 관리, 실행 동작 제어에 사용되는 다양한 플래그와 인수의 사용 방법을 자세히 설명합니다.
---


# 명령줄 API {#command-line-api}

Node.js는 다양한 CLI 옵션을 제공합니다. 이러한 옵션은 내장 디버깅, 스크립트 실행의 여러 방법 및 기타 유용한 런타임 옵션을 노출합니다.

이 문서를 터미널에서 매뉴얼 페이지로 보려면 `man node`를 실행하세요.

## 개요 {#synopsis}

`node [options] [V8 options] [\<program-entry-point\> | -e "script" | -] [--] [arguments]`

`node inspect [\<program-entry-point\> | -e "script" | \<host\>:\<port\>] …`

`node --v8-options`

인수 없이 실행하여 [REPL](/ko/nodejs/api/repl)을 시작합니다.

`node inspect`에 대한 자세한 내용은 [디버거](/ko/nodejs/api/debugger) 문서를 참조하세요.

## 프로그램 진입점 {#program-entry-point}

프로그램 진입점은 지정자 같은 문자열입니다. 문자열이 절대 경로가 아니면 현재 작업 디렉터리를 기준으로 상대 경로로 확인됩니다. 그런 다음 해당 경로는 [CommonJS](/ko/nodejs/api/modules) 모듈 로더에 의해 확인됩니다. 해당 파일이 없으면 오류가 발생합니다.

파일이 발견되면 다음 조건 중 하나에서 해당 경로는 [ES 모듈 로더](/ko/nodejs/api/packages#modules-loaders)에 전달됩니다.

- 프로그램이 `--import`와 같이 진입점을 ECMAScript 모듈 로더로 강제 로드하는 명령줄 플래그로 시작되었습니다.
- 파일에 `.mjs` 확장자가 있습니다.
- 파일에 `.cjs` 확장자가 없고 가장 가까운 상위 `package.json` 파일에 최상위 [`"type"`](/ko/nodejs/api/packages#type) 필드에 `"module"` 값이 포함되어 있습니다.

그렇지 않으면 파일은 CommonJS 모듈 로더를 사용하여 로드됩니다. 자세한 내용은 [모듈 로더](/ko/nodejs/api/packages#modules-loaders)를 참조하세요.

### ECMAScript 모듈 로더 진입점 주의 사항 {#ecmascript-modules-loader-entry-point-caveat}

로드할 때 [ES 모듈 로더](/ko/nodejs/api/packages#modules-loaders)는 프로그램 진입점을 로드하며, `node` 명령은 `.js`, `.mjs` 또는 `.cjs` 확장자를 가진 파일만 입력으로 허용합니다. 그리고 [`--experimental-wasm-modules`](/ko/nodejs/api/cli#--experimental-wasm-modules)이 활성화된 경우 `.wasm` 확장자를 허용합니다.

## 옵션 {#options}


::: info [내역]
| 버전 | 변경 사항 |
| --- | --- |
| v10.12.0 | 대시 대신 밑줄을 Node.js 옵션에 사용할 수 있으며 V8 옵션에도 사용할 수 있습니다. |
:::

V8 옵션을 포함한 모든 옵션은 단어들을 대시(`-`)와 밑줄(`_`)로 구분할 수 있습니다. 예를 들어 `--pending-deprecation`은 `--pending_deprecation`과 동일합니다.

단일 값을 사용하는 옵션(예: `--max-http-header-size`)이 두 번 이상 전달되면 마지막으로 전달된 값이 사용됩니다. 명령줄의 옵션은 [`NODE_OPTIONS`](/ko/nodejs/api/cli#node_optionsoptions) 환경 변수를 통해 전달된 옵션보다 우선합니다.


### `-` {#-}

**추가됨: v8.0.0**

stdin의 별칭입니다. 다른 명령줄 유틸리티에서 `-`를 사용하는 것과 유사하게 스크립트가 stdin에서 읽히고 나머지 옵션이 해당 스크립트로 전달됨을 의미합니다.

### `--` {#--}

**추가됨: v6.11.0**

node 옵션의 끝을 나타냅니다. 나머지 인수를 스크립트로 전달합니다. 이전에 스크립트 파일 이름이나 eval/print 스크립트가 제공되지 않은 경우 다음 인수가 스크립트 파일 이름으로 사용됩니다.

### `--abort-on-uncaught-exception` {#--abort-on-uncaught-exception}

**추가됨: v0.10.8**

종료 대신 중단하면 디버거(`lldb`, `gdb`, `mdb` 등)를 사용하여 사후 분석을 수행하기 위한 코어 파일이 생성됩니다.

이 플래그가 전달되면 [`process.setUncaughtExceptionCaptureCallback()`](/ko/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn)(및 이를 사용하는 `node:domain` 모듈 사용)을 통해 중단하지 않도록 동작을 설정할 수 있습니다.

### `--allow-addons` {#--allow-addons}

**추가됨: v21.6.0, v20.12.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::

[권한 모델](/ko/nodejs/api/permissions#permission-model)을 사용하는 경우 프로세스는 기본적으로 네이티브 애드온을 사용할 수 없습니다. 사용자가 Node.js를 시작할 때 `--allow-addons` 플래그를 명시적으로 전달하지 않으면 그렇게 하려는 시도가 `ERR_DLOPEN_DISABLED`를 발생시킵니다.

예시:

```js [CJS]
// 네이티브 애드온을 요구하려고 시도합니다.
require('nodejs-addon-example');
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js
node:internal/modules/cjs/loader:1319
  return process.dlopen(module, path.toNamespacedPath(filename));
                 ^

Error: Cannot load native addon because loading addons is disabled.
    at Module._extensions..node (node:internal/modules/cjs/loader:1319:18)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12)
    at Module.require (node:internal/modules/cjs/loader:1115:19)
    at require (node:internal/modules/helpers:130:18)
    at Object.<anonymous> (/home/index.js:1:15)
    at Module._compile (node:internal/modules/cjs/loader:1233:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1287:10)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12) {
  code: 'ERR_DLOPEN_DISABLED'
}
```

### `--allow-child-process` {#--allow-child-process}

**추가된 버전: v20.0.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발 중
:::

[권한 모델](/ko/nodejs/api/permissions#permission-model)을 사용하는 경우, 프로세스는 기본적으로 자식 프로세스를 생성할 수 없습니다. 사용자가 Node.js를 시작할 때 명시적으로 `--allow-child-process` 플래그를 전달하지 않는 한, 그렇게 하려고 하면 `ERR_ACCESS_DENIED` 오류가 발생합니다.

예시:

```js [ESM]
const childProcess = require('node:child_process');
// 권한 우회 시도
childProcess.spawn('node', ['-e', 'require("fs").writeFileSync("/new-file", "example")']);
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js
node:internal/child_process:388
  const err = this._handle.spawn(options);
                           ^
Error: Access to this API has been restricted
    at ChildProcess.spawn (node:internal/child_process:388:28)
    at Object.spawn (node:child_process:723:9)
    at Object.<anonymous> (/home/index.js:3:14)
    at Module._compile (node:internal/modules/cjs/loader:1120:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1174:10)
    at Module.load (node:internal/modules/cjs/loader:998:32)
    at Module._load (node:internal/modules/cjs/loader:839:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'ChildProcess'
}
```
### `--allow-fs-read` {#--allow-fs-read}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.5.0 | 권한 모델 및 --allow-fs 플래그가 안정화되었습니다. |
| v20.7.0 | 쉼표(`,`)로 구분된 경로는 더 이상 허용되지 않습니다. |
| v20.0.0 | 추가된 버전: v20.0.0 |
:::

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

이 플래그는 [권한 모델](/ko/nodejs/api/permissions#permission-model)을 사용하여 파일 시스템 읽기 권한을 구성합니다.

`--allow-fs-read` 플래그에 유효한 인수는 다음과 같습니다.

- `*` - 모든 `FileSystemRead` 작업을 허용합니다.
- 여러 `--allow-fs-read` 플래그를 사용하여 여러 경로를 허용할 수 있습니다. 예: `--allow-fs-read=/folder1/ --allow-fs-read=/folder1/`

예시는 [파일 시스템 권한](/ko/nodejs/api/permissions#file-system-permissions) 문서에서 찾을 수 있습니다.

초기화 모듈도 허용되어야 합니다. 다음 예시를 고려하십시오.

```bash [BASH]
$ node --permission index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:23:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FileSystemRead',
  resource: '/Users/rafaelgss/repos/os/node/index.js'
}
```
프로세스는 `index.js` 모듈에 대한 접근 권한이 필요합니다.

```bash [BASH]
node --permission --allow-fs-read=/path/to/index.js index.js
```

### `--allow-fs-write` {#--allow-fs-write}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.5.0 | 권한 모델 및 --allow-fs 플래그가 안정화되었습니다. |
| v20.7.0 | 쉼표(`,`)로 구분된 경로는 더 이상 허용되지 않습니다. |
| v20.0.0 | 다음 버전에서 추가됨: v20.0.0 |
:::

::: tip [안정적: 2 - 안정적]
[안정적: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적입니다.
:::

이 플래그는 [권한 모델](/ko/nodejs/api/permissions#permission-model)을 사용하여 파일 시스템 쓰기 권한을 구성합니다.

`--allow-fs-write` 플래그에 유효한 인수는 다음과 같습니다.

- `*` - 모든 `FileSystemWrite` 작업을 허용합니다.
- 여러 `--allow-fs-write` 플래그를 사용하여 여러 경로를 허용할 수 있습니다. 예: `--allow-fs-write=/folder1/ --allow-fs-write=/folder1/`

쉼표(`,`)로 구분된 경로는 더 이상 허용되지 않습니다. 쉼표와 함께 단일 플래그를 전달하면 경고가 표시됩니다.

예제는 [파일 시스템 권한](/ko/nodejs/api/permissions#file-system-permissions) 문서에서 확인할 수 있습니다.

### `--allow-wasi` {#--allow-wasi}

**다음 버전에서 추가됨: v22.3.0, v20.16.0**

::: warning [안정적: 1 - 실험적]
[안정적: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발 중
:::

[권한 모델](/ko/nodejs/api/permissions#permission-model)을 사용하는 경우 프로세스는 기본적으로 WASI 인스턴스를 생성할 수 없습니다. 보안상의 이유로 사용자가 기본 Node.js 프로세스에서 `--allow-wasi` 플래그를 명시적으로 전달하지 않으면 호출 시 `ERR_ACCESS_DENIED`가 발생합니다.

예:

```js [ESM]
const { WASI } = require('node:wasi');
// 권한 우회 시도
new WASI({
  version: 'preview1',
  // 전체 파일 시스템 마운트 시도
  preopens: {
    '/': '/',
  },
});
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:30:49 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WASI',
}
```
### `--allow-worker` {#--allow-worker}

**다음 버전에서 추가됨: v20.0.0**

::: warning [안정적: 1 - 실험적]
[안정적: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발 중
:::

[권한 모델](/ko/nodejs/api/permissions#permission-model)을 사용하는 경우 프로세스는 기본적으로 워커 스레드를 생성할 수 없습니다. 보안상의 이유로 사용자가 기본 Node.js 프로세스에서 `--allow-worker` 플래그를 명시적으로 전달하지 않으면 호출 시 `ERR_ACCESS_DENIED`가 발생합니다.

예:

```js [ESM]
const { Worker } = require('node:worker_threads');
// 권한 우회 시도
new Worker(__filename);
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WorkerThreads'
}
```

### `--build-snapshot` {#--build-snapshot}

**추가됨: v18.8.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

프로세스가 종료될 때 스냅샷 블롭을 생성하고 디스크에 씁니다. 나중에 `--snapshot-blob`으로 로드할 수 있습니다.

스냅샷을 빌드할 때 `--snapshot-blob`이 지정되지 않은 경우 생성된 블롭은 기본적으로 현재 작업 디렉터리의 `snapshot.blob`에 기록됩니다. 그렇지 않으면 `--snapshot-blob`에 지정된 경로에 기록됩니다.

```bash [BASH]
$ echo "globalThis.foo = 'I am from the snapshot'" > snapshot.js

# 애플리케이션을 초기화하고 스냅샷 상태를 {#run-snapshotjs-to-initialize-the-application-and-snapshot-the}
# snapshot.blob에 저장하기 위해 snapshot.js를 실행합니다.
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js

$ echo "console.log(globalThis.foo)" > index.js

# 생성된 스냅샷을 로드하고 index.js에서 애플리케이션을 시작합니다. {#state-of-it-into-snapshotblob}
$ node --snapshot-blob snapshot.blob index.js
I am from the snapshot
```
[`v8.startupSnapshot` API](/ko/nodejs/api/v8#startup-snapshot-api)는 스냅샷 빌드 시 진입점을 지정하는 데 사용할 수 있으므로 역직렬화 시 추가적인 진입 스크립트가 필요하지 않습니다.

```bash [BASH]
$ echo "require('v8').startupSnapshot.setDeserializeMainFunction(() => console.log('I am from the snapshot'))" > snapshot.js
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js
$ node --snapshot-blob snapshot.blob
I am from the snapshot
```
자세한 내용은 [`v8.startupSnapshot` API](/ko/nodejs/api/v8#startup-snapshot-api) 문서를 참조하십시오.

현재 런타임 스냅샷에 대한 지원은 다음과 같은 점에서 실험적입니다.

### `--build-snapshot-config` {#load-the-generated-snapshot-and-start-the-application-from-indexjs}

**추가됨: v21.6.0, v20.12.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

스냅샷 생성 동작을 구성하는 JSON 구성 파일의 경로를 지정합니다.

현재 다음과 같은 옵션이 지원됩니다.

- `builder` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 필수. [`--build-snapshot`](/ko/nodejs/api/cli#--build-snapshot)이 `builder`를 주 스크립트 이름으로 전달한 것처럼 스냅샷을 빌드하기 전에 실행되는 스크립트의 이름을 제공합니다.
- `withoutCodeCache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 선택 사항. 코드 캐시를 포함하면 스냅샷에 포함된 함수를 컴파일하는 데 소요되는 시간을 줄일 수 있지만 스냅샷 크기가 커지고 스냅샷의 이식성이 손상될 수 있습니다.

이 플래그를 사용하는 경우 명령줄에 제공된 추가 스크립트 파일은 실행되지 않고 일반 명령줄 인수로 해석됩니다.


### `-c`, `--check` {#--build-snapshot-config}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v10.0.0 | 이제 파일을 검사할 때 `--require` 옵션이 지원됩니다. |
| v5.0.0, v4.2.0 | 추가됨: v5.0.0, v4.2.0 |
:::

스크립트를 실행하지 않고 구문만 검사합니다.

### `--completion-bash` {#-c---check}

**추가됨: v10.12.0**

Node.js용으로 소스를 제공할 수 있는 bash 완성 스크립트를 출력합니다.

```bash [BASH]
node --completion-bash > node_bash_completion
source node_bash_completion
```
### `-C condition`, `--conditions=condition` {#--completion-bash}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v22.9.0, v20.18.0 | 플래그가 더 이상 실험적이지 않습니다. |
| v14.9.0, v12.19.0 | 추가됨: v14.9.0, v12.19.0 |
:::

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

사용자 지정 [조건부 내보내기](/ko/nodejs/api/packages#conditional-exports) 확인 조건을 제공합니다.

임의의 사용자 지정 문자열 조건 이름을 허용합니다.

`"node"`, `"default"`, `"import"` 및 `"require"`의 기본 Node.js 조건은 항상 정의된 대로 적용됩니다.

예를 들어 "개발" 확인으로 모듈을 실행하려면 다음을 수행합니다.

```bash [BASH]
node -C development app.js
```
### `--cpu-prof` {#-c-condition---conditions=condition}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v22.4.0, v20.16.0 | 이제 `--cpu-prof` 플래그가 안정적입니다. |
| v12.0.0 | 추가됨: v12.0.0 |
:::

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

시작 시 V8 CPU 프로파일러를 시작하고 종료하기 전에 CPU 프로필을 디스크에 씁니다.

`--cpu-prof-dir`가 지정되지 않은 경우 생성된 프로필은 현재 작업 디렉토리에 배치됩니다.

`--cpu-prof-name`이 지정되지 않은 경우 생성된 프로필의 이름은 `CPU.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.cpuprofile`입니다.

```bash [BASH]
$ node --cpu-prof index.js
$ ls *.cpuprofile
CPU.20190409.202950.15293.0.0.cpuprofile
```
### `--cpu-prof-dir` {#--cpu-prof}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v22.4.0, v20.16.0 | 이제 `--cpu-prof` 플래그가 안정적입니다. |
| v12.0.0 | 추가됨: v12.0.0 |
:::

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

`--cpu-prof`에서 생성된 CPU 프로필이 배치될 디렉토리를 지정합니다.

기본값은 [`--diagnostic-dir`](/ko/nodejs/api/cli#--diagnostic-dirdirectory) 명령줄 옵션에 의해 제어됩니다.


### `--cpu-prof-interval` {#--cpu-prof-dir}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v22.4.0, v20.16.0 | `--cpu-prof` 플래그가 이제 안정화되었습니다. |
| v12.2.0 | 추가됨: v12.2.0 |
:::

::: tip [안정됨: 2 - 안정됨]
[안정됨: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정됨
:::

`--cpu-prof`로 생성된 CPU 프로필에 대한 샘플링 간격을 마이크로초 단위로 지정합니다. 기본값은 1000마이크로초입니다.

### `--cpu-prof-name` {#--cpu-prof-interval}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v22.4.0, v20.16.0 | `--cpu-prof` 플래그가 이제 안정화되었습니다. |
| v12.0.0 | 추가됨: v12.0.0 |
:::

::: tip [안정됨: 2 - 안정됨]
[안정됨: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정됨
:::

`--cpu-prof`로 생성된 CPU 프로필의 파일 이름을 지정합니다.

### `--diagnostic-dir=directory` {#--cpu-prof-name}

모든 진단 출력 파일이 기록될 디렉터리를 설정합니다. 기본값은 현재 작업 디렉터리입니다.

다음에 대한 기본 출력 디렉터리에 영향을 줍니다.

- [`--cpu-prof-dir`](/ko/nodejs/api/cli#--cpu-prof-dir)
- [`--heap-prof-dir`](/ko/nodejs/api/cli#--heap-prof-dir)
- [`--redirect-warnings`](/ko/nodejs/api/cli#--redirect-warningsfile)

### `--disable-proto=mode` {#--diagnostic-dir=directory}

**추가됨: v13.12.0, v12.17.0**

`Object.prototype.__proto__` 속성을 비활성화합니다. `mode`가 `delete`이면 속성이 완전히 제거됩니다. `mode`가 `throw`이면 속성에 대한 액세스는 코드 `ERR_PROTO_ACCESS`와 함께 예외를 발생시킵니다.

### `--disable-warning=code-or-type` {#--disable-proto=mode}

::: warning [안정됨: 1 - 실험적]
[안정됨: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::

**추가됨: v21.3.0, v20.11.0**

`code` 또는 `type`으로 특정 프로세스 경고를 비활성화합니다.

[`process.emitWarning()`](/ko/nodejs/api/process#processemitwarningwarning-options)에서 내보낸 경고에는 `code`와 `type`이 포함될 수 있습니다. 이 옵션은 일치하는 `code` 또는 `type`을 가진 경고를 내보내지 않습니다.

[사용되지 않는 API 목록](/ko/nodejs/api/deprecations#list-of-deprecated-apis).

Node.js 코어 경고 유형은 `DeprecationWarning` 및 `ExperimentalWarning`입니다.

예를 들어 다음 스크립트는 `node --disable-warning=DEP0025`로 실행될 때 [DEP0025 `require('node:sys')`](/ko/nodejs/api/deprecations#dep0025-requirenodesys)를 내보내지 않습니다.

::: code-group
```js [ESM]
import sys from 'node:sys';
```

```js [CJS]
const sys = require('node:sys');
```
:::

예를 들어 다음 스크립트는 [DEP0025 `require('node:sys')`](/ko/nodejs/api/deprecations#dep0025-requirenodesys)를 내보내지만, `node --disable-warning=ExperimentalWarning`로 실행될 때 (\<=v21의 [ExperimentalWarning: `vm.measureMemory`는 실험적 기능입니다](/ko/nodejs/api/vm#vmmeasurememoryoptions)와 같은) 모든 실험적 경고를 내보내지 않습니다.

::: code-group
```js [ESM]
import sys from 'node:sys';
import vm from 'node:vm';

vm.measureMemory();
```

```js [CJS]
const sys = require('node:sys');
const vm = require('node:vm');

vm.measureMemory();
```
:::


### `--disable-wasm-trap-handler` {#--disable-warning=code-or-type}

**추가된 버전: v22.2.0, v20.15.0**

기본적으로 Node.js는 트랩 핸들러 기반 WebAssembly 바운드 검사를 활성화합니다. 결과적으로 V8은 WebAssembly에서 컴파일된 코드에 인라인 바운드 검사를 삽입할 필요가 없어 WebAssembly 실행 속도를 크게 높일 수 있지만 이 최적화에는 큰 가상 메모리 케이지(현재 10GB)를 할당해야 합니다. Node.js 프로세스가 시스템 구성 또는 하드웨어 제한으로 인해 충분히 큰 가상 메모리 주소 공간에 액세스할 수 없는 경우 사용자는 이 가상 메모리 케이지에 할당과 관련된 WebAssembly를 실행할 수 없으며 메모리 부족 오류가 발생합니다.

```bash [BASH]
$ ulimit -v 5000000
$ node -p "new WebAssembly.Memory({ initial: 10, maximum: 100 });"
[eval]:1
new WebAssembly.Memory({ initial: 10, maximum: 100 });
^

RangeError: WebAssembly.Memory(): 메모리를 할당할 수 없습니다.
    at [eval]:1:1
    at runScriptInThisContext (node:internal/vm:209:10)
    at node:internal/process/execution:118:14
    at [eval]-wrapper:6:24
    at runScript (node:internal/process/execution:101:62)
    at evalScript (node:internal/process/execution:136:3)
    at node:internal/main/eval_string:49:3

```
`--disable-wasm-trap-handler`는 이 최적화를 비활성화하여 사용자가 Node.js 프로세스에 사용 가능한 가상 메모리 주소 공간이 V8 WebAssembly 메모리 케이지에 필요한 것보다 적을 때 (성능이 최적화되지 않은) WebAssembly를 최소한 실행할 수 있도록 합니다.

### `--disallow-code-generation-from-strings` {#--disable-wasm-trap-handler}

**추가된 버전: v9.8.0**

문자열에서 코드를 생성하는 `eval` 및 `new Function`과 같은 기본 제공 언어 기능을 예외를 발생시키도록 만듭니다. 이는 Node.js `node:vm` 모듈에 영향을 미치지 않습니다.

### `--dns-result-order=order` {#--disallow-code-generation-from-strings}


::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v22.1.0, v20.13.0 | 이제 `ipv6first`가 지원됩니다. |
| v17.0.0 | 기본값이 `verbatim`으로 변경되었습니다. |
| v16.4.0, v14.18.0 | 추가된 버전: v16.4.0, v14.18.0 |
:::

[`dns.lookup()`](/ko/nodejs/api/dns#dnslookuphostname-options-callback) 및 [`dnsPromises.lookup()`](/ko/nodejs/api/dns#dnspromiseslookuphostname-options)에서 `order`의 기본값을 설정합니다. 값은 다음과 같습니다.

- `ipv4first`: 기본 `order`를 `ipv4first`로 설정합니다.
- `ipv6first`: 기본 `order`를 `ipv6first`로 설정합니다.
- `verbatim`: 기본 `order`를 `verbatim`으로 설정합니다.

기본값은 `verbatim`이며 [`dns.setDefaultResultOrder()`](/ko/nodejs/api/dns#dnssetdefaultresultorderorder)가 `--dns-result-order`보다 우선 순위가 높습니다.


### `--enable-fips` {#--dns-result-order=order}

**추가된 버전: v6.0.0**

시작 시 FIPS 호환 암호화를 활성화합니다. (Node.js가 FIPS 호환 OpenSSL에 대해 빌드되어야 합니다.)

### `--enable-network-family-autoselection` {#--enable-fips}

**추가된 버전: v18.18.0**

연결 옵션에서 명시적으로 비활성화하지 않는 한, 패밀리 자동 선택 알고리즘을 활성화합니다.

### `--enable-source-maps` {#--enable-network-family-autoselection}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.11.0, v14.18.0 | 이 API는 더 이상 실험적이지 않습니다. |
| v12.12.0 | 추가된 버전: v12.12.0 |
:::

스택 추적을 위한 [소스 맵 v3](https://sourcemaps.info/spec) 지원을 활성화합니다.

TypeScript와 같은 트랜스파일러를 사용하는 경우 애플리케이션에서 발생하는 스택 추적은 원본 소스 위치가 아닌 트랜스파일된 코드를 참조합니다. `--enable-source-maps`는 소스 맵 캐싱을 활성화하고 원본 소스 파일을 기준으로 스택 추적을 보고하기 위해 최선을 다합니다.

`Error.prepareStackTrace`를 재정의하면 `--enable-source-maps`가 스택 추적을 수정하지 못할 수 있습니다. 소스 맵으로 스택 추적을 수정하려면 재정의 함수에서 원래 `Error.prepareStackTrace`의 결과를 호출하고 반환하세요.

```js [ESM]
const originalPrepareStackTrace = Error.prepareStackTrace;
Error.prepareStackTrace = (error, trace) => {
  // 오류 및 추적을 수정하고 원래 Error.prepareStackTrace로 스택 추적을 포맷합니다.
  return originalPrepareStackTrace(error, trace);
};
```

참고: 소스 맵을 활성화하면 `Error.stack`에 액세스할 때 애플리케이션에 대기 시간이 발생할 수 있습니다. 애플리케이션에서 `Error.stack`에 자주 액세스하는 경우 `--enable-source-maps`의 성능 영향을 고려하십시오.

### `--entry-url` {#--enable-source-maps}

**추가된 버전: v23.0.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

있는 경우 Node.js는 진입점을 경로가 아닌 URL로 해석합니다.

[ECMAScript 모듈](/ko/nodejs/api/esm#modules-ecmascript-modules) 해결 규칙을 따릅니다.

URL의 모든 쿼리 매개변수 또는 해시는 [`import.meta.url`](/ko/nodejs/api/esm#importmetaurl)을 통해 액세스할 수 있습니다.

```bash [BASH]
node --entry-url 'file:///path/to/file.js?queryparams=work#and-hashes-too'
node --entry-url --experimental-strip-types 'file.ts?query#hash'
node --entry-url 'data:text/javascript,console.log("Hello")'
```

### `--env-file-if-exists=config` {#--entry-url}

**Added in: v22.9.0**

동작은 [`--env-file`](/ko/nodejs/api/cli#--env-fileconfig)과 동일하지만, 파일이 존재하지 않으면 오류가 발생하지 않습니다.

### `--env-file=config` {#--env-file-if-exists=config}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::


::: info [History]
| 버전 | 변경 사항 |
| --- | --- |
| v21.7.0, v20.12.0 | 여러 줄 값에 대한 지원을 추가합니다. |
| v20.6.0 | Added in: v20.6.0 |
:::

현재 디렉터리를 기준으로 파일에서 환경 변수를 로드하여 `process.env`에서 애플리케이션에 사용할 수 있도록 합니다. `NODE_OPTIONS`와 같이 [Node.js를 구성하는 환경 변수](/ko/nodejs/api/cli#environment-variables)가 구문 분석되어 적용됩니다. 동일한 변수가 환경 및 파일에 정의된 경우 환경의 값이 우선합니다.

여러 개의 `--env-file` 인수를 전달할 수 있습니다. 후속 파일은 이전 파일에 정의된 기존 변수를 덮어씁니다.

파일이 존재하지 않으면 오류가 발생합니다.

```bash [BASH]
node --env-file=.env --env-file=.development.env index.js
```
파일 형식은 환경 변수 이름과 값을 `=`로 구분하여 키-값 쌍으로 한 줄에 하나씩 표시해야 합니다.

```text [TEXT]
PORT=3000
```
`#` 뒤의 텍스트는 주석으로 처리됩니다.

```text [TEXT]
# 이것은 주석입니다. {#--env-file=config}
PORT=3000 # 이것도 주석입니다.
```
값은 다음과 같은 따옴표로 시작하고 끝날 수 있습니다. ```, `"` 또는 `'`. 값에서 생략됩니다.

```text [TEXT]
USERNAME="nodejs" # `nodejs`를 값으로 사용합니다.
```
여러 줄 값이 지원됩니다.

```text [TEXT]
MULTI_LINE="THIS IS
A MULTILINE"
# `THIS IS\nA MULTILINE`을 값으로 사용합니다. {#this-is-a-comment}
```
키 앞의 내보내기 키워드는 무시됩니다.

```text [TEXT]
export USERNAME="nodejs" # `nodejs`를 값으로 사용합니다.
```
존재하지 않을 수 있는 파일에서 환경 변수를 로드하려면 대신 [`--env-file-if-exists`](/ko/nodejs/api/cli#--env-file-if-existsconfig) 플래그를 사용할 수 있습니다.


### `-e`, `--eval "script"` {#will-result-in-this-is\na-multiline-as-the-value}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.6.0 | 이제 Eval이 실험적 타입 제거를 지원합니다. |
| v5.11.0 | 내장 라이브러리를 이제 미리 정의된 변수로 사용할 수 있습니다. |
| v0.5.2 | 추가됨: v0.5.2 |
:::

다음 인수를 JavaScript로 평가합니다. REPL에서 미리 정의된 모듈을 `script`에서도 사용할 수 있습니다.

Windows, `cmd.exe`에서는 작은 따옴표가 따옴표로 묶는 데 더블 `"`만 인식하므로 제대로 작동하지 않습니다. Powershell 또는 Git bash에서는 `'`와 `"`를 모두 사용할 수 있습니다.

[`--experimental-strip-types`](/ko/nodejs/api/cli#--experimental-strip-types)를 전달하여 인라인 유형을 포함하는 코드를 실행할 수 있습니다.

### `--experimental-async-context-frame` {#-e---eval-"script"}

**추가됨: v22.7.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

async_hooks에 의존하는 기본 구현이 아닌 `AsyncContextFrame`에 의해 지원되는 [`AsyncLocalStorage`](/ko/nodejs/api/async_context#class-asynclocalstorage) 사용을 활성화합니다. 이 새로운 모델은 매우 다르게 구현되었으므로 애플리케이션 내에서 컨텍스트 데이터가 흐르는 방식에 차이가 있을 수 있습니다. 따라서 현재 프로덕션 환경에서 사용하기 전에 이 변경 사항이 애플리케이션 동작에 영향을 미치지 않는지 확인하는 것이 좋습니다.

### `--experimental-eventsource` {#--experimental-async-context-frame}

**추가됨: v22.3.0, v20.18.0**

글로벌 범위에서 [EventSource Web API](https://html.spec.whatwg.org/multipage/server-sent-events#server-sent-events) 노출을 활성화합니다.

### `--experimental-import-meta-resolve` {#--experimental-eventsource}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.6.0, v18.19.0 | 동기식 import.meta.resolve를 기본적으로 사용할 수 있으며, 이전과 같이 실험적 두 번째 인수를 활성화하기 위한 플래그가 유지됩니다. |
| v13.9.0, v12.16.2 | 추가됨: v13.9.0, v12.16.2 |
:::

컨텍스트 해석을 위해 두 번째 `parentURL` 인수를 전달할 수 있는 실험적 `import.meta.resolve()` 상위 URL 지원을 활성화합니다.

이전에는 전체 `import.meta.resolve` 기능을 제어했습니다.


### `--experimental-loader=module` {#--experimental-import-meta-resolve}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.11.1 | 이 플래그의 이름이 `--loader`에서 `--experimental-loader`로 변경되었습니다. |
| v8.8.0 | 추가됨: v8.8.0 |
:::

내보낸 [모듈 사용자 지정 후크](/ko/nodejs/api/module#customization-hooks)가 포함된 `module`을 지정합니다. `module`은 [`import` 지정자](/ko/nodejs/api/esm#import-specifiers)로 허용되는 모든 문자열일 수 있습니다.

### `--experimental-network-inspection` {#--experimental-loader=module}

**추가됨: v22.6.0, v20.18.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

Chrome DevTools를 사용한 네트워크 검사에 대한 실험적 지원을 활성화합니다.

### `--experimental-print-required-tla` {#--experimental-network-inspection}

**추가됨: v22.0.0, v20.17.0**

`require()`되는 ES 모듈에 최상위 `await`가 포함된 경우, 이 플래그를 사용하면 Node.js가 모듈을 평가하고, 최상위 awaits의 위치를 찾고, 해당 위치를 출력하여 사용자가 찾을 수 있도록 지원합니다.

### `--experimental-require-module` {#--experimental-print-required-tla}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 이제 기본적으로 true입니다. |
| v22.0.0, v20.17.0 | 추가됨: v22.0.0, v20.17.0 |
:::

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 활발한 개발 중
:::

`require()`에서 동기 ES 모듈 그래프 로드를 지원합니다.

[ `require()`를 사용하여 ECMAScript 모듈 로드](/ko/nodejs/api/modules#loading-ecmascript-modules-using-require)를 참조하세요.

### `--experimental-sea-config` {#--experimental-require-module}

**추가됨: v20.0.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

이 플래그를 사용하여 Node.js 바이너리에 삽입하여 [단일 실행 가능 응용 프로그램](/ko/nodejs/api/single-executable-applications)을 생성할 수 있는 Blob을 생성합니다. 자세한 내용은 [이 구성](/ko/nodejs/api/single-executable-applications#generating-single-executable-preparation-blobs)에 대한 설명서를 참조하세요.


### `--experimental-shadow-realm` {#--experimental-sea-config}

**추가됨: v19.0.0, v18.13.0**

이 플래그를 사용하여 [ShadowRealm](https://github.com/tc39/proposal-shadowrealm) 지원을 활성화합니다.

### `--experimental-strip-types` {#--experimental-shadow-realm}

**추가됨: v22.6.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::

TypeScript 파일에 대한 실험적 타입 제거를 활성화합니다. 자세한 내용은 [TypeScript 타입 제거](/ko/nodejs/api/typescript#type-stripping) 문서를 참조하십시오.

### `--experimental-test-coverage` {#--experimental-strip-types}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.1.0, v18.17.0 | 이 옵션은 `--test`와 함께 사용할 수 있습니다. |
| v19.7.0, v18.15.0 | 추가됨: v19.7.0, v18.15.0 |
:::

`node:test` 모듈과 함께 사용하면 테스트 러너 출력의 일부로 코드 커버리지 보고서가 생성됩니다. 실행되는 테스트가 없으면 커버리지 보고서가 생성되지 않습니다. 자세한 내용은 [테스트에서 코드 커버리지 수집](/ko/nodejs/api/test#collecting-code-coverage)에 대한 문서를 참조하십시오.

### `--experimental-test-isolation=mode` {#--experimental-test-coverage}

**추가됨: v22.8.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).0 - 초기 개발
:::

테스트 러너에서 사용되는 테스트 격리 유형을 구성합니다. `mode`가 `'process'`인 경우 각 테스트 파일은 별도의 자식 프로세스에서 실행됩니다. `mode`가 `'none'`인 경우 모든 테스트 파일은 테스트 러너와 동일한 프로세스에서 실행됩니다. 기본 격리 모드는 `'process'`입니다. 이 플래그는 `--test` 플래그가 없으면 무시됩니다. 자세한 내용은 [테스트 러너 실행 모델](/ko/nodejs/api/test#test-runner-execution-model) 섹션을 참조하십시오.

### `--experimental-test-module-mocks` {#--experimental-test-isolation=mode}

**추가됨: v22.3.0, v20.18.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).0 - 초기 개발
:::

테스트 러너에서 모듈 모의를 활성화합니다.


### `--experimental-transform-types` {#--experimental-test-module-mocks}

**추가됨: v22.7.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::

TypeScript 전용 구문을 JavaScript 코드로 변환할 수 있도록 합니다. `--experimental-strip-types` 및 `--enable-source-maps`를 의미합니다.

### `--experimental-vm-modules` {#--experimental-transform-types}

**추가됨: v9.6.0**

`node:vm` 모듈에서 실험적 ES Module 지원을 활성화합니다.

### `--experimental-wasi-unstable-preview1` {#--experimental-vm-modules}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.0.0, v18.17.0 | 이 옵션은 WASI가 기본적으로 활성화되어 더 이상 필요하지 않지만 여전히 전달할 수 있습니다. |
| v13.6.0 | `--experimental-wasi-unstable-preview0`에서 `--experimental-wasi-unstable-preview1`로 변경되었습니다. |
| v13.3.0, v12.16.0 | 추가됨: v13.3.0, v12.16.0 |
:::

실험적 WebAssembly System Interface (WASI) 지원을 활성화합니다.

### `--experimental-wasm-modules` {#--experimental-wasi-unstable-preview1}

**추가됨: v12.3.0**

실험적 WebAssembly 모듈 지원을 활성화합니다.

### `--experimental-webstorage` {#--experimental-wasm-modules}

**추가됨: v22.4.0**

실험적 [`Web Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) 지원을 활성화합니다.

### `--expose-gc` {#--experimental-webstorage}

**추가됨: v22.3.0, v20.18.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적. 이 플래그는 V8에서 상속되었으며 업스트림에서 변경될 수 있습니다.
:::

이 플래그는 V8에서 gc 확장을 노출합니다.

```js [ESM]
if (globalThis.gc) {
  globalThis.gc();
}
```
### `--force-context-aware` {#--expose-gc}

**추가됨: v12.12.0**

[컨텍스트 인식](/ko/nodejs/api/addons#context-aware-addons)이 아닌 네이티브 애드온 로드를 비활성화합니다.

### `--force-fips` {#--force-context-aware}

**추가됨: v6.0.0**

시작 시 FIPS 규격 암호화를 강제합니다. (스크립트 코드에서 비활성화할 수 없습니다.) (`--enable-fips`와 동일한 요구 사항입니다.)

### `--force-node-api-uncaught-exceptions-policy` {#--force-fips}

**추가됨: v18.3.0, v16.17.0**

Node-API 비동기 콜백에서 `uncaughtException` 이벤트를 적용합니다.

기존 애드온이 프로세스를 충돌시키는 것을 방지하기 위해 이 플래그는 기본적으로 활성화되지 않습니다. 앞으로는 이 플래그가 기본적으로 활성화되어 올바른 동작을 적용합니다.


### `--frozen-intrinsics` {#--force-node-api-uncaught-exceptions-policy}

**Added in: v11.12.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - Experimental
:::

`Array` 및 `Object`와 같은 실험적 고정 내장 함수를 활성화합니다.

루트 컨텍스트만 지원됩니다. `globalThis.Array`가 실제로 기본 내장 함수 참조라는 보장은 없습니다. 이 플래그 아래에서 코드가 손상될 수 있습니다.

polyfill을 추가할 수 있도록 [`--require`](/ko/nodejs/api/cli#-r---require-module) 및 [`--import`](/ko/nodejs/api/cli#--importmodule)는 모두 내장 함수를 고정하기 전에 실행됩니다.

### `--heap-prof` {#--frozen-intrinsics}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.4.0, v20.16.0 | `--heap-prof` 플래그가 이제 안정화되었습니다. |
| v12.4.0 | Added in: v12.4.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/ko/nodejs/api/documentation#stability-index) [Stability: 2](/ko/nodejs/api/documentation#stability-index) - Stable
:::

시작 시 V8 힙 프로파일러를 시작하고 종료하기 전에 힙 프로파일을 디스크에 씁니다.

`--heap-prof-dir`이 지정되지 않은 경우 생성된 프로파일은 현재 작업 디렉터리에 배치됩니다.

`--heap-prof-name`이 지정되지 않은 경우 생성된 프로파일의 이름은 `Heap.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.heapprofile`입니다.

```bash [BASH]
$ node --heap-prof index.js
$ ls *.heapprofile
Heap.20190409.202950.15293.0.001.heapprofile
```
### `--heap-prof-dir` {#--heap-prof}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.4.0, v20.16.0 | `--heap-prof` 플래그가 이제 안정화되었습니다. |
| v12.4.0 | Added in: v12.4.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/ko/nodejs/api/documentation#stability-index) [Stability: 2](/ko/nodejs/api/documentation#stability-index) - Stable
:::

`--heap-prof`로 생성된 힙 프로파일이 배치될 디렉터리를 지정합니다.

기본값은 [`--diagnostic-dir`](/ko/nodejs/api/cli#--diagnostic-dirdirectory) 명령줄 옵션으로 제어됩니다.

### `--heap-prof-interval` {#--heap-prof-dir}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.4.0, v20.16.0 | `--heap-prof` 플래그가 이제 안정화되었습니다. |
| v12.4.0 | Added in: v12.4.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/ko/nodejs/api/documentation#stability-index) [Stability: 2](/ko/nodejs/api/documentation#stability-index) - Stable
:::

`--heap-prof`로 생성된 힙 프로파일의 평균 샘플링 간격을 바이트 단위로 지정합니다. 기본값은 512 * 1024바이트입니다.


### `--heap-prof-name` {#--heap-prof-interval}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v22.4.0, v20.16.0 | `--heap-prof` 플래그가 이제 안정화되었습니다. |
| v12.4.0 | 추가됨: v12.4.0 |
:::

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

`--heap-prof`로 생성된 힙 프로파일의 파일 이름을 지정합니다.

### `--heapsnapshot-near-heap-limit=max_count` {#--heap-prof-name}

**추가됨: v15.1.0, v14.18.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

V8 힙 사용량이 힙 제한에 가까워지면 V8 힙 스냅샷을 디스크에 씁니다. `count`는 음수가 아닌 정수여야 합니다(이 경우 Node.js는 `max_count`개 이하의 스냅샷을 디스크에 씁니다).

스냅샷을 생성할 때 가비지 수집이 트리거되어 힙 사용량이 줄어들 수 있습니다. 따라서 Node.js 인스턴스가 결국 메모리가 부족해지기 전에 여러 스냅샷이 디스크에 기록될 수 있습니다. 이러한 힙 스냅샷을 비교하여 연속적인 스냅샷을 찍는 동안 어떤 객체가 할당되고 있는지 확인할 수 있습니다. Node.js가 정확히 `max_count`개의 스냅샷을 디스크에 쓴다고 보장할 수는 없지만 `max_count`가 `0`보다 클 때 Node.js 인스턴스가 메모리가 부족해지기 전에 최소 하나, 최대 `max_count`개의 스냅샷을 생성하려고 최선을 다할 것입니다.

V8 스냅샷을 생성하는 데는 시간과 메모리(V8 힙에서 관리하는 메모리와 V8 힙 외부의 네이티브 메모리 모두)가 소요됩니다. 힙이 클수록 더 많은 리소스가 필요합니다. Node.js는 추가적인 V8 힙 메모리 오버헤드를 수용하도록 V8 힙을 조정하고 프로세스에 사용 가능한 모든 메모리를 소모하지 않도록 최선을 다할 것입니다. 프로세스가 시스템에서 적절하다고 판단하는 것보다 더 많은 메모리를 사용하면 시스템 구성에 따라 시스템에서 프로세스가 갑자기 종료될 수 있습니다.

```bash [BASH]
$ node --max-old-space-size=100 --heapsnapshot-near-heap-limit=3 index.js
Wrote snapshot to Heap.20200430.100036.49580.0.001.heapsnapshot
Wrote snapshot to Heap.20200430.100037.49580.0.002.heapsnapshot
Wrote snapshot to Heap.20200430.100038.49580.0.003.heapsnapshot

<--- Last few GCs --->

[49580:0x110000000]     4826 ms: Mark-sweep 130.6 (147.8) -> 130.5 (147.8) MB, 27.4 / 0.0 ms  (average mu = 0.126, current mu = 0.034) allocation failure scavenge might not succeed
[49580:0x110000000]     4845 ms: Mark-sweep 130.6 (147.8) -> 130.6 (147.8) MB, 18.8 / 0.0 ms  (average mu = 0.088, current mu = 0.031) allocation failure scavenge might not succeed


<--- JS stacktrace --->

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
....
```

### `--heapsnapshot-signal=signal` {#--heapsnapshot-near-heap-limit=max_count}

**추가된 버전: v12.0.0**

지정된 신호를 수신할 때 Node.js 프로세스가 힙 덤프를 쓰도록 하는 신호 핸들러를 활성화합니다. `signal`은 유효한 신호 이름이어야 합니다. 기본적으로 비활성화됩니다.

```bash [BASH]
$ node --heapsnapshot-signal=SIGUSR2 index.js &
$ ps aux
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
node         1  5.5  6.1 787252 247004 ?       Ssl  16:43   0:02 node --heapsnapshot-signal=SIGUSR2 index.js
$ kill -USR2 1
$ ls
Heap.20190718.133405.15554.0.001.heapsnapshot
```
### `-h`, `--help` {#--heapsnapshot-signal=signal}

**추가된 버전: v0.1.3**

node 명령줄 옵션을 출력합니다. 이 옵션의 출력은 이 문서보다 자세하지 않습니다.

### `--icu-data-dir=file` {#-h---help}

**추가된 버전: v0.11.15**

ICU 데이터 로드 경로를 지정합니다. (`NODE_ICU_DATA`를 재정의합니다.)

### `--import=module` {#--icu-data-dir=file}

**추가된 버전: v19.0.0, v18.18.0**

::: 경고 [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

시작 시 지정된 모듈을 미리 로드합니다. 플래그가 여러 번 제공되면 각 모듈은 [`NODE_OPTIONS`](/ko/nodejs/api/cli#node_optionsoptions)에 제공된 모듈부터 시작하여 나타나는 순서대로 순차적으로 실행됩니다.

[ECMAScript 모듈](/ko/nodejs/api/esm#modules-ecmascript-modules) 해결 규칙을 따릅니다. [CommonJS 모듈](/ko/nodejs/api/modules)을 로드하려면 [`--require`](/ko/nodejs/api/cli#-r---require-module)를 사용하십시오. `--require`로 미리 로드된 모듈은 `--import`로 미리 로드된 모듈보다 먼저 실행됩니다.

모듈은 메인 스레드뿐만 아니라 모든 워커 스레드, 포크된 프로세스 또는 클러스터링된 프로세스에도 미리 로드됩니다.

### `--input-type=type` {#--import=module}

**추가된 버전: v12.0.0**

Node.js가 `--eval` 또는 `STDIN` 입력을 CommonJS 또는 ES 모듈로 해석하도록 구성합니다. 유효한 값은 `"commonjs"` 또는 `"module"`입니다. 기본값은 `"commonjs"`입니다.

REPL은 이 옵션을 지원하지 않습니다. [`--print`](/ko/nodejs/api/cli#-p---print-script)와 함께 `--input-type=module`을 사용하면 `--print`가 ES 모듈 구문을 지원하지 않으므로 오류가 발생합니다.


### `--insecure-http-parser` {#--input-type=type}

**추가된 버전: v13.4.0, v12.15.0, v10.19.0**

HTTP 파서에 관용 플래그를 활성화합니다. 이는 비준수 HTTP 구현과의 상호 운용성을 허용할 수 있습니다.

활성화되면 파서는 다음을 허용합니다.

- 잘못된 HTTP 헤더 값.
- 잘못된 HTTP 버전.
- `Transfer-Encoding` 및 `Content-Length` 헤더를 모두 포함하는 메시지 허용.
- `Connection: close`가 있을 때 메시지 이후 추가 데이터 허용.
- `chunked`가 제공된 후 추가 전송 인코딩 허용.
- `\n`을 `\r\n` 대신 토큰 구분 기호로 사용하도록 허용.
- 청크 후에 `\r\n`이 제공되지 않도록 허용.
- 청크 크기 뒤와 `\r\n` 앞에 공백이 있도록 허용.

위의 모든 것은 애플리케이션을 요청 스머글링 또는 포이즈닝 공격에 노출시킵니다. 이 옵션을 사용하지 마십시오.

#### 경고: 공개 IP:포트 조합에 검사기 바인딩은 안전하지 않습니다 {#--insecure-http-parser}

열린 포트로 검사기를 공개 IP(``0.0.0.0`` 포함)에 바인딩하는 것은 안전하지 않습니다. 외부 호스트가 검사기에 연결하여 [원격 코드 실행](https://www.owasp.org/index.php/Code_Injection) 공격을 수행할 수 있기 때문입니다.

호스트를 지정하는 경우 다음 중 하나인지 확인하십시오.

- 호스트가 공용 네트워크에서 액세스할 수 없습니다.
- 방화벽이 포트에서 원치 않는 연결을 허용하지 않습니다.

**더 구체적으로 말하면, 포트(기본적으로 <code>9229</code>)가 방화벽으로 보호되지 않는 경우 <code>--inspect=0.0.0.0</code>은 안전하지 않습니다.**

자세한 내용은 [디버깅 보안 영향](https://nodejs.org/en/docs/guides/debugging-getting-started/#security-implications) 섹션을 참조하십시오.

### `--inspect-brk[=[host:]port]` {#warning-binding-inspector-to-a-public-ipport-combination-is-insecure}

**추가된 버전: v7.6.0**

`host:port`에서 검사기를 활성화하고 사용자 스크립트 시작 시 중단합니다. 기본 `host:port`는 `127.0.0.1:9229`입니다. 포트 `0`이 지정되면 임의의 사용 가능한 포트가 사용됩니다.

Node.js 디버거에 대한 자세한 설명은 [Node.js용 V8 검사기 통합](/ko/nodejs/api/debugger#v8-inspector-integration-for-nodejs)을 참조하십시오.

### `--inspect-port=[host:]port` {#--inspect-brk=hostport}

**추가된 버전: v7.6.0**

검사기가 활성화될 때 사용할 `host:port`를 설정합니다. `SIGUSR1` 신호를 보내 검사기를 활성화할 때 유용합니다.

기본 호스트는 `127.0.0.1`입니다. 포트 `0`이 지정되면 임의의 사용 가능한 포트가 사용됩니다.

`host` 매개 변수 사용에 대한 아래의 [보안 경고](/ko/nodejs/api/cli#warning-binding-inspector-to-a-public-ipport-combination-is-insecure)를 참조하십시오.


### `--inspect-publish-uid=stderr,http` {#--inspect-port=hostport}

inspector 웹 소켓 URL 노출 방법을 지정합니다.

기본적으로 inspector 웹 소켓 URL은 stderr에서 사용할 수 있으며 `http://host:port/json/list`의 `/json/list` 엔드포인트에서 사용할 수 있습니다.

### `--inspect-wait[=[host:]port]` {#--inspect-publish-uid=stderrhttp}

**추가된 버전: v22.2.0, v20.15.0**

`host:port`에서 inspector를 활성화하고 디버거가 연결될 때까지 기다립니다. 기본 `host:port`는 `127.0.0.1:9229`입니다. 포트 `0`을 지정하면 사용 가능한 임의의 포트가 사용됩니다.

Node.js 디버거에 대한 자세한 내용은 [Node.js용 V8 Inspector 통합](/ko/nodejs/api/debugger#v8-inspector-integration-for-nodejs)을 참조하세요.

### `--inspect[=[host:]port]` {#--inspect-wait=hostport}

**추가된 버전: v6.3.0**

`host:port`에서 inspector를 활성화합니다. 기본값은 `127.0.0.1:9229`입니다. 포트 `0`을 지정하면 사용 가능한 임의의 포트가 사용됩니다.

V8 inspector 통합을 통해 Chrome DevTools 및 IDE와 같은 도구를 사용하여 Node.js 인스턴스를 디버깅하고 프로파일링할 수 있습니다. 도구는 TCP 포트를 통해 Node.js 인스턴스에 연결하고 [Chrome DevTools 프로토콜](https://chromedevtools.github.io/devtools-protocol/)을 사용하여 통신합니다. Node.js 디버거에 대한 자세한 내용은 [Node.js용 V8 Inspector 통합](/ko/nodejs/api/debugger#v8-inspector-integration-for-nodejs)을 참조하세요.

### `-i`, `--interactive` {#--inspect=hostport}

**추가된 버전: v0.7.7**

stdin이 터미널이 아닌 것으로 보이더라도 REPL을 엽니다.

### `--jitless` {#-i---interactive}

**추가된 버전: v12.0.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적. 이 플래그는 V8에서 상속되었으며 업스트림에서 변경될 수 있습니다.
:::

[실행 가능한 메모리의 런타임 할당](https://v8.dev/blog/jitless)을 비활성화합니다. 이는 보안상의 이유로 일부 플랫폼에서 필요할 수 있습니다. 또한 다른 플랫폼에서 공격 표면을 줄일 수 있지만 성능에 미치는 영향은 심각할 수 있습니다.

### `--localstorage-file=file` {#--jitless}

**추가된 버전: v22.4.0**

`localStorage` 데이터를 저장하는 데 사용되는 파일입니다. 파일이 존재하지 않으면 `localStorage`에 처음 액세스할 때 생성됩니다. 동일한 파일은 여러 Node.js 프로세스 간에 동시에 공유될 수 있습니다. 이 플래그는 Node.js가 `--experimental-webstorage` 플래그로 시작되지 않는 한 아무런 작업도 수행하지 않습니다.


### `--max-http-header-size=size` {#--localstorage-file=file}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.13.0 | HTTP 헤더의 최대 기본 크기를 8KiB에서 16KiB로 변경했습니다. |
| v11.6.0, v10.15.0 | 추가됨: v11.6.0, v10.15.0 |
:::

HTTP 헤더의 최대 크기를 바이트 단위로 지정합니다. 기본값은 16KiB입니다.

### `--napi-modules` {#--max-http-header-size=size}

**추가됨: v7.10.0**

이 옵션은 아무 작업도 수행하지 않습니다. 호환성을 위해 유지됩니다.

### `--network-family-autoselection-attempt-timeout` {#--napi-modules}

**추가됨: v22.1.0, v20.13.0**

네트워크 패밀리 자동 선택 시도 시간 초과에 대한 기본값을 설정합니다. 자세한 내용은 [`net.getDefaultAutoSelectFamilyAttemptTimeout()`](/ko/nodejs/api/net#netgetdefaultautoselectfamilyattempttimeout)을 참조하십시오.

### `--no-addons` {#--network-family-autoselection-attempt-timeout}

**추가됨: v16.10.0, v14.19.0**

`node-addons` 내보내기 조건을 비활성화하고 네이티브 애드온 로드를 비활성화합니다. `--no-addons`가 지정되면 `process.dlopen`을 호출하거나 네이티브 C++ 애드온을 요구하면 실패하고 예외가 발생합니다.

### `--no-deprecation` {#--no-addons}

**추가됨: v0.8.0**

더 이상 사용되지 않는 경고를 표시하지 않습니다.

### `--no-experimental-detect-module` {#--no-deprecation}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.7.0 | 구문 감지가 기본적으로 활성화됩니다. |
| v21.1.0, v20.10.0 | 추가됨: v21.1.0, v20.10.0 |
:::

[구문 감지](/ko/nodejs/api/packages#syntax-detection)를 사용하여 모듈 유형을 결정하는 것을 비활성화합니다.

### `--no-experimental-global-navigator` {#--no-experimental-detect-module}

**추가됨: v21.2.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

글로벌 범위에서 [Navigator API](/ko/nodejs/api/globals#navigator)의 노출을 비활성화합니다.

### `--no-experimental-repl-await` {#--no-experimental-global-navigator}

**추가됨: v16.6.0**

REPL에서 최상위 await를 비활성화하려면 이 플래그를 사용하십시오.

### `--no-experimental-require-module` {#--no-experimental-repl-await}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 이제 기본적으로 false입니다. |
| v22.0.0, v20.17.0 | 추가됨: v22.0.0, v20.17.0 |
:::

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::

`require()`에서 동기식 ES 모듈 그래프 로드에 대한 지원을 비활성화합니다.

[`require()`를 사용하여 ECMAScript 모듈 로드](/ko/nodejs/api/modules#loading-ecmascript-modules-using-require)를 참조하십시오.


### `--no-experimental-sqlite` {#--no-experimental-require-module}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v23.4.0 | SQLite가 플래그 해제되었지만 여전히 실험적입니다. |
| v22.5.0 | 추가됨: v22.5.0 |
:::

실험적 [`node:sqlite`](/ko/nodejs/api/sqlite) 모듈을 비활성화합니다.

### `--no-experimental-websocket` {#--no-experimental-sqlite}

**추가됨: v22.0.0**

전역 범위에서 [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) 노출을 비활성화합니다.

### `--no-extra-info-on-fatal-exception` {#--no-experimental-websocket}

**추가됨: v17.0.0**

종료를 유발하는 치명적인 예외에 대한 추가 정보를 숨깁니다.

### `--no-force-async-hooks-checks` {#--no-extra-info-on-fatal-exception}

**추가됨: v9.0.0**

`async_hooks`에 대한 런타임 검사를 비활성화합니다. `async_hooks`가 활성화되면 이러한 검사는 동적으로 활성화됩니다.

### `--no-global-search-paths` {#--no-force-async-hooks-checks}

**추가됨: v16.10.0**

`$HOME/.node_modules` 및 `$NODE_PATH`와 같은 전역 경로에서 모듈을 검색하지 않습니다.

### `--no-network-family-autoselection` {#--no-global-search-paths}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v20.0.0 | 플래그 이름이 `--no-enable-network-family-autoselection`에서 `--no-network-family-autoselection`으로 변경되었습니다. 이전 이름도 여전히 별칭으로 작동할 수 있습니다. |
| v19.4.0 | 추가됨: v19.4.0 |
:::

연결 옵션이 명시적으로 활성화하지 않는 한 패밀리 자동 선택 알고리즘을 비활성화합니다.

### `--no-warnings` {#--no-network-family-autoselection}

**추가됨: v6.0.0**

모든 프로세스 경고(더 이상 사용되지 않는 항목 포함)를 숨깁니다.

### `--node-memory-debug` {#--no-warnings}

**추가됨: v15.0.0, v14.18.0**

Node.js 내부의 메모리 누수에 대한 추가 디버그 검사를 활성화합니다. 이는 일반적으로 Node.js 자체를 디버깅하는 개발자에게만 유용합니다.

### `--openssl-config=file` {#--node-memory-debug}

**추가됨: v6.9.0**

시작 시 OpenSSL 구성 파일을 로드합니다. 다른 용도 중에서 Node.js가 FIPS 지원 OpenSSL에 대해 빌드된 경우 이를 사용하여 FIPS 호환 암호화를 활성화할 수 있습니다.

### `--openssl-legacy-provider` {#--openssl-config=file}

**추가됨: v17.0.0, v16.17.0**

OpenSSL 3.0 레거시 공급자를 활성화합니다. 자세한 내용은 [OSSL_PROVIDER-legacy](https://www.openssl.org/docs/man3.0/man7/OSSL_PROVIDER-legacy)를 참조하세요.

### `--openssl-shared-config` {#--openssl-legacy-provider}

**추가됨: v18.5.0, v16.17.0, v14.21.0**

OpenSSL 구성 파일에서 OpenSSL 기본 구성 섹션 `openssl_conf`를 읽도록 활성화합니다. 기본 구성 파일의 이름은 `openssl.cnf`이지만 환경 변수 `OPENSSL_CONF`를 사용하거나 명령줄 옵션 `--openssl-config`를 사용하여 변경할 수 있습니다. 기본 OpenSSL 구성 파일의 위치는 OpenSSL이 Node.js에 연결되는 방식에 따라 다릅니다. OpenSSL 구성을 공유하면 원치 않는 결과가 발생할 수 있으므로 이 옵션을 사용하지 않을 때 기본값인 Node.js 전용 구성 섹션인 `nodejs_conf`를 사용하는 것이 좋습니다.


### `--pending-deprecation` {#--openssl-shared-config}

**Added in: v8.0.0**

대기 중인 더 이상 사용 경고를 내보냅니다.

대기 중인 더 이상 사용은 일반적으로 런타임 더 이상 사용과 동일하지만 `--pending-deprecation` 명령줄 플래그 또는 `NODE_PENDING_DEPRECATION=1` 환경 변수가 설정되지 않으면 기본적으로 *꺼져* 있고 내보내지지 않는다는 주목할 만한 예외가 있습니다. 대기 중인 더 이상 사용은 개발자가 더 이상 사용된 API 사용을 감지하는 데 활용할 수 있는 일종의 선택적 "조기 경고" 메커니즘을 제공하는 데 사용됩니다.

### `--permission` {#--pending-deprecation}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.5.0 | 권한 모델이 이제 안정화되었습니다. |
| v20.0.0 | 추가됨: v20.0.0 |
:::

::: tip [안정됨: 2 - 안정됨]
[안정됨: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정됨.
:::

현재 프로세스에 대한 권한 모델을 활성화합니다. 활성화되면 다음 권한이 제한됩니다.

- 파일 시스템 - [`--allow-fs-read`](/ko/nodejs/api/cli#--allow-fs-read), [`--allow-fs-write`](/ko/nodejs/api/cli#--allow-fs-write) 플래그를 통해 관리 가능
- 자식 프로세스 - [`--allow-child-process`](/ko/nodejs/api/cli#--allow-child-process) 플래그를 통해 관리 가능
- 워커 스레드 - [`--allow-worker`](/ko/nodejs/api/cli#--allow-worker) 플래그를 통해 관리 가능
- WASI - [`--allow-wasi`](/ko/nodejs/api/cli#--allow-wasi) 플래그를 통해 관리 가능
- 애드온 - [`--allow-addons`](/ko/nodejs/api/cli#--allow-addons) 플래그를 통해 관리 가능

### `--preserve-symlinks` {#--permission}

**Added in: v6.3.0**

모듈을 확인하고 캐시할 때 심볼릭 링크를 유지하도록 모듈 로더에 지시합니다.

기본적으로 Node.js는 다른 온디스크 위치에 심볼릭 링크된 경로에서 모듈을 로드할 때 링크를 역참조하고 모듈의 실제 온디스크 "실제 경로"를 식별자 및 다른 종속성 모듈을 찾기 위한 루트 경로로 사용합니다. 대부분의 경우 이 기본 동작은 허용됩니다. 그러나 아래 예에 설명된 대로 심볼릭 링크된 피어 종속성을 사용하는 경우 `moduleA`가 `moduleB`를 피어 종속성으로 요구하려고 하면 기본 동작으로 인해 예외가 발생합니다.

```text [TEXT]
{appDir}
 ├── app
 │   ├── index.js
 │   └── node_modules
 │       ├── moduleA -> {appDir}/moduleA
 │       └── moduleB
 │           ├── index.js
 │           └── package.json
 └── moduleA
     ├── index.js
     └── package.json
```
`--preserve-symlinks` 명령줄 플래그는 Node.js가 실제 경로가 아닌 모듈의 심볼릭 링크 경로를 사용하도록 지시하여 심볼릭 링크된 피어 종속성을 찾을 수 있도록 합니다.

그러나 `--preserve-symlinks`를 사용하면 다른 부작용이 발생할 수 있습니다. 특히 심볼릭 링크된 *네이티브* 모듈은 종속성 트리의 둘 이상의 위치에서 링크된 경우 로드에 실패할 수 있습니다(Node.js는 이를 두 개의 별도 모듈로 보고 모듈을 여러 번 로드하려고 시도하여 예외가 발생함).

`--preserve-symlinks` 플래그는 메인 모듈에는 적용되지 않으므로 `node --preserve-symlinks node_module/.bin/\<foo\>`가 작동할 수 있습니다. 메인 모듈에 대해 동일한 동작을 적용하려면 `--preserve-symlinks-main`도 사용하십시오.


### `--preserve-symlinks-main` {#--preserve-symlinks}

**Added in: v10.2.0**

모듈 로더에게 메인 모듈(`require.main`)을 확인하고 캐싱할 때 심볼릭 링크를 보존하도록 지시합니다.

이 플래그는 메인 모듈이 `--preserve-symlinks`가 다른 모든 import에 제공하는 것과 동일한 동작을 선택할 수 있도록 존재합니다. 하지만 이전 Node.js 버전과의 호환성을 위해 별도의 플래그입니다.

`--preserve-symlinks-main`은 `--preserve-symlinks`를 의미하지 않습니다. 상대 경로를 확인하기 전에 심볼릭 링크를 따라가는 것이 바람직하지 않은 경우 `--preserve-symlinks`에 추가하여 `--preserve-symlinks-main`을 사용하십시오.

자세한 내용은 [`--preserve-symlinks`](/ko/nodejs/api/cli#--preserve-symlinks)를 참조하십시오.

### `-p`, `--print "script"` {#--preserve-symlinks-main}


::: info [History]
| Version | Changes |
| --- | --- |
| v5.11.0 | 이제 내장 라이브러리를 미리 정의된 변수로 사용할 수 있습니다. |
| v0.6.4 | Added in: v0.6.4 |
:::

`-e`와 동일하지만 결과를 출력합니다.

### `--prof` {#-p---print-"script"}

**Added in: v2.0.0**

V8 프로파일러 출력을 생성합니다.

### `--prof-process` {#--prof}

**Added in: v5.2.0**

V8 옵션 `--prof`를 사용하여 생성된 V8 프로파일러 출력을 처리합니다.

### `--redirect-warnings=file` {#--prof-process}

**Added in: v8.0.0**

프로세스 경고를 stderr에 출력하는 대신 지정된 파일에 씁니다. 파일이 없으면 생성되고, 있으면 추가됩니다. 파일에 경고를 쓰는 동안 오류가 발생하면 경고가 stderr에 대신 기록됩니다.

`file` 이름은 절대 경로일 수 있습니다. 그렇지 않은 경우 쓰여질 기본 디렉터리는 [`--diagnostic-dir`](/ko/nodejs/api/cli#--diagnostic-dirdirectory) 명령줄 옵션에 의해 제어됩니다.

### `--report-compact` {#--redirect-warnings=file}

**Added in: v13.12.0, v12.17.0**

보고서를 사람이 소비하도록 설계된 기본 다중 라인 형식보다 로그 처리 시스템에서 더 쉽게 사용할 수 있는 컴팩트 형식인 단일 라인 JSON으로 작성합니다.

### `--report-dir=directory`, `report-directory=directory` {#--report-compact}


::: info [History]
| Version | Changes |
| --- | --- |
| v13.12.0, v12.17.0 | 이 옵션은 더 이상 실험적이지 않습니다. |
| v12.0.0 | `--diagnostic-report-directory`에서 `--report-directory`로 변경되었습니다. |
| v11.8.0 | Added in: v11.8.0 |
:::

보고서가 생성될 위치입니다.


### `--report-exclude-env` {#--report-dir=directory-report-directory=directory}

**Added in: v23.3.0**

`--report-exclude-env`를 전달하면 생성된 진단 보고서에 `environmentVariables` 데이터가 포함되지 않습니다.

### `--report-exclude-network` {#--report-exclude-env}

**Added in: v22.0.0, v20.13.0**

진단 보고서에서 `header.networkInterfaces`를 제외합니다. 기본적으로 설정되지 않으며 네트워크 인터페이스가 포함됩니다.

### `--report-filename=filename` {#--report-exclude-network}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.12.0, v12.17.0 | 이 옵션은 더 이상 실험적이지 않습니다. |
| v12.0.0 | `--diagnostic-report-filename`에서 `--report-filename`으로 변경되었습니다. |
| v11.8.0 | Added in: v11.8.0 |
:::

보고서를 작성할 파일 이름입니다.

파일 이름을 `'stdout'` 또는 `'stderr'`로 설정하면 보고서가 각각 프로세스의 stdout 또는 stderr에 작성됩니다.

### `--report-on-fatalerror` {#--report-filename=filename}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.0.0, v13.14.0, v12.17.0 | 이 옵션은 더 이상 실험적이지 않습니다. |
| v12.0.0 | `--diagnostic-report-on-fatalerror`에서 `--report-on-fatalerror`로 변경되었습니다. |
| v11.8.0 | Added in: v11.8.0 |
:::

응용 프로그램 종료로 이어지는 심각한 오류(메모리 부족과 같은 Node.js 런타임 내의 내부 오류)에서 보고서가 트리거되도록 합니다. 힙, 스택, 이벤트 루프 상태, 리소스 소비 등과 같은 다양한 진단 데이터 요소를 검사하여 심각한 오류에 대해 추론하는 데 유용합니다.

### `--report-on-signal` {#--report-on-fatalerror}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.12.0, v12.17.0 | 이 옵션은 더 이상 실험적이지 않습니다. |
| v12.0.0 | `--diagnostic-report-on-signal`에서 `--report-on-signal`로 변경되었습니다. |
| v11.8.0 | Added in: v11.8.0 |
:::

실행 중인 Node.js 프로세스에 지정된(또는 미리 정의된) 신호를 수신할 때 보고서가 생성되도록 합니다. 보고서를 트리거하는 신호는 `--report-signal`을 통해 지정됩니다.

### `--report-signal=signal` {#--report-on-signal}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.12.0, v12.17.0 | 이 옵션은 더 이상 실험적이지 않습니다. |
| v12.0.0 | `--diagnostic-report-signal`에서 `--report-signal`로 변경되었습니다. |
| v11.8.0 | Added in: v11.8.0 |
:::

보고서 생성에 대한 신호를 설정하거나 재설정합니다(Windows에서는 지원되지 않음). 기본 신호는 `SIGUSR2`입니다.


### `--report-uncaught-exception` {#--report-signal=signal}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v18.8.0, v16.18.0 | 처리되지 않은 예외가 처리되면 보고서가 생성되지 않습니다. |
| v13.12.0, v12.17.0 | 이 옵션은 더 이상 실험적이지 않습니다. |
| v12.0.0 | `--diagnostic-report-uncaught-exception`에서 `--report-uncaught-exception`으로 변경되었습니다. |
| v11.8.0 | 추가된 버전: v11.8.0 |
:::

처리되지 않은 예외로 인해 프로세스가 종료될 때 보고서가 생성되도록 합니다. 네이티브 스택 및 기타 런타임 환경 데이터와 함께 JavaScript 스택을 검사할 때 유용합니다.

### `-r`, `--require module` {#--report-uncaught-exception}

**추가된 버전: v1.6.0**

시작 시 지정된 모듈을 미리 로드합니다.

`require()`의 모듈 확인 규칙을 따릅니다. `module`은 파일 경로 또는 Node.js 모듈 이름일 수 있습니다.

CommonJS 모듈만 지원됩니다. [ECMAScript 모듈](/ko/nodejs/api/esm#modules-ecmascript-modules)을 미리 로드하려면 [`--import`](/ko/nodejs/api/cli#--importmodule)를 사용하세요. `--require`로 미리 로드된 모듈은 `--import`로 미리 로드된 모듈보다 먼저 실행됩니다.

모듈은 메인 스레드뿐만 아니라 모든 워커 스레드, 포크된 프로세스 또는 클러스터링된 프로세스에도 미리 로드됩니다.

### `--run` {#-r---require-module}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v22.3.0 | NODE_RUN_SCRIPT_NAME 환경 변수가 추가되었습니다. |
| v22.3.0 | NODE_RUN_PACKAGE_JSON_PATH 환경 변수가 추가되었습니다. |
| v22.3.0 | 루트 디렉토리까지 탐색하여 명령을 실행할 `package.json` 파일을 찾고, 그에 따라 `PATH` 환경 변수를 업데이트합니다. |
| v22.0.0 | 추가된 버전: v22.0.0 |
:::

::: tip [안정됨: 2 - 안정됨]
[안정됨: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정됨
:::

이것은 package.json의 `"scripts"` 객체에서 지정된 명령을 실행합니다. 누락된 `"command"`가 제공되면 사용 가능한 스크립트를 나열합니다.

`--run`은 루트 디렉토리까지 탐색하여 명령을 실행할 `package.json` 파일을 찾습니다.

`--run`은 현재 디렉토리의 각 상위 디렉토리에 대해 `./node_modules/.bin`을 `PATH`에 추가하여 여러 `node_modules` 디렉토리가 있는 다른 폴더에서 바이너리를 실행합니다(만약 `ancestor-folder/node_modules/.bin`이 디렉토리인 경우).

`--run`은 관련 `package.json`이 포함된 디렉토리에서 명령을 실행합니다.

예를 들어, 다음 명령은 현재 폴더에 있는 `package.json`의 `test` 스크립트를 실행합니다.

```bash [BASH]
$ node --run test
```
명령에 인수를 전달할 수도 있습니다. `--` 뒤의 모든 인수는 스크립트에 추가됩니다.

```bash [BASH]
$ node --run test -- --verbose
```

#### 의도적인 제한 사항 {#--run}

`node --run`은 `npm run` 또는 다른 패키지 관리자의 `run` 명령의 동작과 일치하도록 만들어지지 않았습니다. Node.js 구현은 가장 일반적인 사용 사례에 대한 최고의 성능에 집중하기 위해 의도적으로 더 제한적입니다. 의도적으로 제외된 다른 `run` 구현의 일부 기능은 다음과 같습니다.

- 지정된 스크립트 외에 `pre` 또는 `post` 스크립트 실행.
- 패키지 관리자별 환경 변수 정의.

#### 환경 변수 {#intentional-limitations}

`--run`으로 스크립트를 실행할 때 다음 환경 변수가 설정됩니다.

- `NODE_RUN_SCRIPT_NAME`: 실행 중인 스크립트의 이름입니다. 예를 들어 `--run`을 사용하여 `test`를 실행하는 경우 이 변수의 값은 `test`가 됩니다.
- `NODE_RUN_PACKAGE_JSON_PATH`: 처리 중인 `package.json`의 경로입니다.

### `--secure-heap-min=n` {#environment-variables}

**추가된 버전: v15.6.0**

`--secure-heap`을 사용하는 경우 `--secure-heap-min` 플래그는 보안 힙에서 최소 할당량을 지정합니다. 최소값은 `2`입니다. 최대값은 `--secure-heap` 또는 `2147483647` 중 더 작은 값입니다. 제공된 값은 2의 거듭제곱이어야 합니다.

### `--secure-heap=n` {#--secure-heap-min=n}

**추가된 버전: v15.6.0**

`n`바이트의 OpenSSL 보안 힙을 초기화합니다. 초기화되면 보안 힙은 키 생성 및 기타 작업 중 OpenSSL 내에서 선택된 유형의 할당에 사용됩니다. 이는 예를 들어 포인터 오버런 또는 언더런으로 인해 중요한 정보가 유출되는 것을 방지하는 데 유용합니다.

보안 힙은 고정 크기이며 런타임에 크기를 조정할 수 없으므로 사용하는 경우 모든 응용 프로그램 사용을 커버할 수 있을 만큼 충분히 큰 힙을 선택하는 것이 중요합니다.

제공된 힙 크기는 2의 거듭제곱이어야 합니다. 2보다 작은 값은 보안 힙을 비활성화합니다.

보안 힙은 기본적으로 비활성화되어 있습니다.

보안 힙은 Windows에서 사용할 수 없습니다.

자세한 내용은 [`CRYPTO_secure_malloc_init`](https://www.openssl.org/docs/man3.0/man3/CRYPTO_secure_malloc_init)를 참조하십시오.

### `--snapshot-blob=path` {#--secure-heap=n}

**추가된 버전: v18.8.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

`--build-snapshot`과 함께 사용하면 `--snapshot-blob`은 생성된 스냅샷 Blob이 기록되는 경로를 지정합니다. 지정하지 않으면 생성된 Blob은 현재 작업 디렉터리의 `snapshot.blob`에 기록됩니다.

`--build-snapshot` 없이 사용하면 `--snapshot-blob`은 응용 프로그램 상태를 복원하는 데 사용되는 Blob의 경로를 지정합니다.

스냅샷을 로드할 때 Node.js는 다음을 확인합니다.

일치하지 않으면 Node.js는 스냅샷 로드를 거부하고 상태 코드 1로 종료합니다.


### `--test` {#--snapshot-blob=path}

::: info [연혁]
| 버전 | 변경 사항 |
|---|---|
| v20.0.0 | 테스트 러너가 이제 안정화되었습니다. |
| v19.2.0, v18.13.0 | 테스트 러너가 이제 감시 모드 실행을 지원합니다. |
| v18.1.0, v16.17.0 | 추가됨: v18.1.0, v16.17.0 |
:::

Node.js 명령줄 테스트 러너를 시작합니다. 이 플래그는 `--watch-path`, `--check`, `--eval`, `--interactive` 또는 검사기와 함께 사용할 수 없습니다. 자세한 내용은 [명령줄에서 테스트 실행](/ko/nodejs/api/test#running-tests-from-the-command-line) 문서를 참조하세요.

### `--test-concurrency` {#--test}

**추가됨: v21.0.0, v20.10.0, v18.19.0**

테스트 러너 CLI가 동시에 실행할 최대 테스트 파일 수입니다. `--experimental-test-isolation`이 `'none'`으로 설정된 경우 이 플래그는 무시되고 동시성은 1로 설정됩니다. 그렇지 않으면 동시성은 기본적으로 `os.availableParallelism() - 1`입니다.

### `--test-coverage-branches=threshold` {#--test-concurrency}

**추가됨: v22.8.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

커버된 분기의 최소 백분율을 요구합니다. 코드 커버리지가 지정된 임계값에 도달하지 못하면 프로세스가 코드 `1`로 종료됩니다.

### `--test-coverage-exclude` {#--test-coverage-branches=threshold}

**추가됨: v22.5.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

절대 및 상대 파일 경로 모두와 일치할 수 있는 glob 패턴을 사용하여 코드 커버리지에서 특정 파일을 제외합니다.

이 옵션은 여러 glob 패턴을 제외하기 위해 여러 번 지정할 수 있습니다.

`--test-coverage-exclude`와 `--test-coverage-include`가 모두 제공되면 파일은 커버리지 보고서에 포함되려면 **두** 기준을 모두 충족해야 합니다.

기본적으로 일치하는 모든 테스트 파일은 커버리지 보고서에서 제외됩니다. 이 옵션을 지정하면 기본 동작이 재정의됩니다.

### `--test-coverage-functions=threshold` {#--test-coverage-exclude}

**추가됨: v22.8.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

커버된 함수의 최소 백분율을 요구합니다. 코드 커버리지가 지정된 임계값에 도달하지 못하면 프로세스가 코드 `1`로 종료됩니다.


### `--test-coverage-include` {#--test-coverage-functions=threshold}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

절대 및 상대 파일 경로 모두와 일치할 수 있는 glob 패턴을 사용하여 코드 커버리지에 특정 파일을 포함합니다.

이 옵션은 여러 glob 패턴을 포함하기 위해 여러 번 지정할 수 있습니다.

`--test-coverage-exclude`와 `--test-coverage-include`가 모두 제공되면 파일은 커버리지 보고서에 포함되기 위해 **두 가지** 기준을 모두 충족해야 합니다.

### `--test-coverage-lines=threshold` {#--test-coverage-include}

**Added in: v22.8.0**

::: warning [Stable: 1 - Experimental]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

커버된 라인의 최소 퍼센트를 요구합니다. 코드 커버리지가 지정된 임계값에 도달하지 못하면 프로세스는 코드 `1`로 종료됩니다.

### `--test-force-exit` {#--test-coverage-lines=threshold}

**Added in: v22.0.0, v20.14.0**

이벤트 루프가 활성 상태로 유지되더라도 알려진 모든 테스트가 실행을 완료하면 테스트 러너가 프로세스를 종료하도록 구성합니다.

### `--test-name-pattern` {#--test-force-exit}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.0.0 | 이제 테스트 러너가 안정적입니다. |
| v18.11.0 | Added in: v18.11.0 |
:::

제공된 패턴과 이름이 일치하는 테스트만 실행하도록 테스트 러너를 구성하는 정규식입니다. 자세한 내용은 [이름으로 테스트 필터링](/ko/nodejs/api/test#filtering-tests-by-name)에 대한 문서를 참조하세요.

`--test-name-pattern`과 `--test-skip-pattern`이 모두 제공되면 테스트는 실행되기 위해 **두 가지** 요구 사항을 모두 충족해야 합니다.

### `--test-only` {#--test-name-pattern}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.0.0 | 이제 테스트 러너가 안정적입니다. |
| v18.0.0, v16.17.0 | Added in: v18.0.0, v16.17.0 |
:::

`only` 옵션이 설정된 최상위 테스트만 실행하도록 테스트 러너를 구성합니다. 테스트 격리가 비활성화된 경우에는 이 플래그가 필요하지 않습니다.

### `--test-reporter` {#--test-only}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.0.0 | 이제 테스트 러너가 안정적입니다. |
| v19.6.0, v18.15.0 | Added in: v19.6.0, v18.15.0 |
:::

테스트를 실행할 때 사용할 테스트 리포터입니다. 자세한 내용은 [테스트 리포터](/ko/nodejs/api/test#test-reporters)에 대한 문서를 참조하세요.


### `--test-reporter-destination` {#--test-reporter}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.0.0 | 테스트 러너가 이제 안정화되었습니다. |
| v19.6.0, v18.15.0 | 추가됨: v19.6.0, v18.15.0 |
:::

해당 테스트 리포터의 대상입니다. 자세한 내용은 [테스트 리포터](/ko/nodejs/api/test#test-reporters) 문서를 참조하십시오.

### `--test-shard` {#--test-reporter-destination}

**추가됨: v20.5.0, v18.19.0**

실행할 테스트 스위트 샤드 형식은 `\<index\>/\<total\>`입니다.

여기서 `index`는 양의 정수이며, 분할된 부분의 인덱스입니다. `total`은 양의 정수이며, 분할된 부분의 총합입니다. 이 명령은 모든 테스트 파일을 `total`개의 동일한 부분으로 나누고 `index` 부분에 있는 테스트만 실행합니다.

예를 들어 테스트 스위트를 세 부분으로 나누려면 다음과 같이 사용합니다.

```bash [BASH]
node --test --test-shard=1/3
node --test --test-shard=2/3
node --test --test-shard=3/3
```
### `--test-skip-pattern` {#--test-shard}

**추가됨: v22.1.0**

제공된 패턴과 이름이 일치하는 테스트를 건너뛰도록 테스트 러너를 구성하는 정규식입니다. 자세한 내용은 [이름으로 테스트 필터링](/ko/nodejs/api/test#filtering-tests-by-name) 문서를 참조하십시오.

`--test-name-pattern`과 `--test-skip-pattern`이 모두 제공된 경우 테스트를 실행하려면 **두** 요구 사항을 모두 충족해야 합니다.

### `--test-timeout` {#--test-skip-pattern}

**추가됨: v21.2.0, v20.11.0**

테스트 실행이 실패하는 밀리초 단위의 시간입니다. 지정하지 않으면 하위 테스트는 상위 테스트에서 이 값을 상속합니다. 기본값은 `Infinity`입니다.

### `--test-update-snapshots` {#--test-timeout}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.4.0 | 스냅샷 테스트가 더 이상 실험적이지 않습니다. |
| v22.3.0 | 추가됨: v22.3.0 |
:::

[스냅샷 테스트](/ko/nodejs/api/test#snapshot-testing)를 위해 테스트 러너가 사용하는 스냅샷 파일을 다시 생성합니다.

### `--throw-deprecation` {#--test-update-snapshots}

**추가됨: v0.11.14**

더 이상 사용되지 않는 기능에 대한 오류를 발생시킵니다.

### `--title=title` {#--throw-deprecation}

**추가됨: v10.7.0**

시작 시 `process.title`을 설정합니다.

### `--tls-cipher-list=list` {#--title=title}

**추가됨: v4.0.0**

대체 기본 TLS 암호 목록을 지정합니다. Node.js가 암호화 지원(기본값)으로 빌드되어야 합니다.


### `--tls-keylog=file` {#--tls-cipher-list=list}

**추가된 버전: v13.2.0, v12.16.0**

TLS 키 자료를 파일에 기록합니다. 키 자료는 NSS `SSLKEYLOGFILE` 형식이며 Wireshark와 같은 소프트웨어가 TLS 트래픽을 해독하는 데 사용할 수 있습니다.

### `--tls-max-v1.2` {#--tls-keylog=file}

**추가된 버전: v12.0.0, v10.20.0**

[`tls.DEFAULT_MAX_VERSION`](/ko/nodejs/api/tls#tlsdefault_max_version)을 'TLSv1.2'로 설정합니다. TLSv1.3에 대한 지원을 비활성화하는 데 사용합니다.

### `--tls-max-v1.3` {#--tls-max-v12}

**추가된 버전: v12.0.0**

기본 [`tls.DEFAULT_MAX_VERSION`](/ko/nodejs/api/tls#tlsdefault_max_version)을 'TLSv1.3'으로 설정합니다. TLSv1.3에 대한 지원을 활성화하는 데 사용합니다.

### `--tls-min-v1.0` {#--tls-max-v13}

**추가된 버전: v12.0.0, v10.20.0**

기본 [`tls.DEFAULT_MIN_VERSION`](/ko/nodejs/api/tls#tlsdefault_min_version)을 'TLSv1'로 설정합니다. 이전 TLS 클라이언트 또는 서버와의 호환성을 위해 사용합니다.

### `--tls-min-v1.1` {#--tls-min-v10}

**추가된 버전: v12.0.0, v10.20.0**

기본 [`tls.DEFAULT_MIN_VERSION`](/ko/nodejs/api/tls#tlsdefault_min_version)을 'TLSv1.1'로 설정합니다. 이전 TLS 클라이언트 또는 서버와의 호환성을 위해 사용합니다.

### `--tls-min-v1.2` {#--tls-min-v11}

**추가된 버전: v12.2.0, v10.20.0**

기본 [`tls.DEFAULT_MIN_VERSION`](/ko/nodejs/api/tls#tlsdefault_min_version)을 'TLSv1.2'로 설정합니다. 이는 12.x 이상 버전의 기본값이지만 이전 Node.js 버전과의 호환성을 위해 이 옵션이 지원됩니다.

### `--tls-min-v1.3` {#--tls-min-v12}

**추가된 버전: v12.0.0**

기본 [`tls.DEFAULT_MIN_VERSION`](/ko/nodejs/api/tls#tlsdefault_min_version)을 'TLSv1.3'으로 설정합니다. TLSv1.3보다 보안이 약한 TLSv1.2에 대한 지원을 비활성화하는 데 사용합니다.

### `--trace-deprecation` {#--tls-min-v13}

**추가된 버전: v0.8.0**

더 이상 사용되지 않는 기능에 대한 스택 추적을 출력합니다.

### `--trace-env` {#--trace-deprecation}

**추가된 버전: v23.4.0**

현재 Node.js 인스턴스에서 수행된 환경 변수에 대한 모든 액세스 정보를 stderr로 출력합니다. 다음을 포함합니다.

- Node.js가 내부적으로 수행하는 환경 변수 읽기.
- `process.env.KEY = "SOME VALUE"` 형식의 쓰기.
- `process.env.KEY` 형식의 읽기.
- `Object.defineProperty(process.env, 'KEY', {...})` 형식의 정의.
- `Object.hasOwn(process.env, 'KEY')`, `process.env.hasOwnProperty('KEY')` 또는 `'KEY' in process.env` 형식의 쿼리.
- `delete process.env.KEY` 형식의 삭제.
- `...process.env` 또는 `Object.keys(process.env)` 형식의 열거.

액세스 중인 환경 변수의 이름만 출력됩니다. 값은 출력되지 않습니다.

액세스 스택 추적을 출력하려면 `--trace-env-js-stack` 및/또는 `--trace-env-native-stack`을 사용합니다.


### `--trace-env-js-stack` {#--trace-env}

**추가됨: v23.4.0**

`--trace-env`가 하는 것 외에도 액세스의 JavaScript 스택 추적을 출력합니다.

### `--trace-env-native-stack` {#--trace-env-js-stack}

**추가됨: v23.4.0**

`--trace-env`가 하는 것 외에도 액세스의 네이티브 스택 추적을 출력합니다.

### `--trace-event-categories` {#--trace-env-native-stack}

**추가됨: v7.7.0**

`--trace-events-enabled`를 사용하여 추적 이벤트 추적을 활성화할 때 추적해야 하는 쉼표로 구분된 범주 목록입니다.

### `--trace-event-file-pattern` {#--trace-event-categories}

**추가됨: v9.8.0**

추적 이벤트 데이터의 파일 경로를 지정하는 템플릿 문자열로, `${rotation}` 및 `${pid}`를 지원합니다.

### `--trace-events-enabled` {#--trace-event-file-pattern}

**추가됨: v7.7.0**

추적 이벤트 추적 정보의 수집을 활성화합니다.

### `--trace-exit` {#--trace-events-enabled}

**추가됨: v13.5.0, v12.16.0**

환경이 적극적으로 종료될 때마다 스택 추적을 출력합니다. 즉, `process.exit()`를 호출합니다.

### `--trace-require-module=mode` {#--trace-exit}

**추가됨: v23.5.0**

[`require()`를 사용하여 ECMAScript 모듈 로드](/ko/nodejs/api/modules#loading-ecmascript-modules-using-require)의 사용량에 대한 정보를 출력합니다.

`mode`가 `all`이면 모든 사용량이 출력됩니다. `mode`가 `no-node-modules`이면 `node_modules` 폴더의 사용량이 제외됩니다.

### `--trace-sigint` {#--trace-require-module=mode}

**추가됨: v13.9.0, v12.17.0**

SIGINT에서 스택 추적을 출력합니다.

### `--trace-sync-io` {#--trace-sigint}

**추가됨: v2.1.0**

이벤트 루프의 첫 번째 턴 이후에 동기 I/O가 감지될 때마다 스택 추적을 출력합니다.

### `--trace-tls` {#--trace-sync-io}

**추가됨: v12.2.0**

TLS 패킷 추적 정보를 `stderr`로 출력합니다. 이는 TLS 연결 문제를 디버그하는 데 사용할 수 있습니다.

### `--trace-uncaught` {#--trace-tls}

**추가됨: v13.1.0**

잡히지 않은 예외에 대한 스택 추적을 출력합니다. 일반적으로 `Error` 생성과 관련된 스택 추적이 출력되지만, 이를 통해 Node.js는 값 던지기와 관련된 스택 추적도 출력합니다(이는 `Error` 인스턴스일 필요는 없습니다).

이 옵션을 활성화하면 가비지 수집 동작에 부정적인 영향을 미칠 수 있습니다.

### `--trace-warnings` {#--trace-uncaught}

**추가됨: v6.0.0**

프로세스 경고(더 이상 사용되지 않는 경고 포함)에 대한 스택 추적을 출력합니다.


### `--track-heap-objects` {#--trace-warnings}

**Added in: v2.4.0**

힙 스냅샷을 위해 힙 객체 할당을 추적합니다.

### `--unhandled-rejections=mode` {#--track-heap-objects}


::: info [History]
| Version | Changes |
| --- | --- |
| v15.0.0 | 기본 모드를 `throw`로 변경했습니다. 이전에는 경고가 발생했습니다. |
| v12.0.0, v10.17.0 | Added in: v12.0.0, v10.17.0 |
:::

이 플래그를 사용하면 처리되지 않은 거부가 발생했을 때 수행할 작업을 변경할 수 있습니다. 다음 모드 중 하나를 선택할 수 있습니다.

- `throw`: [`unhandledRejection`](/ko/nodejs/api/process#event-unhandledrejection)을 발생시킵니다. 이 후크가 설정되지 않은 경우 처리되지 않은 거부를 잡히지 않은 예외로 발생시킵니다. 이것이 기본값입니다.
- `strict`: 처리되지 않은 거부를 잡히지 않은 예외로 발생시킵니다. 예외가 처리되면 [`unhandledRejection`](/ko/nodejs/api/process#event-unhandledrejection)이 발생합니다.
- `warn`: [`unhandledRejection`](/ko/nodejs/api/process#event-unhandledrejection) 후크가 설정되었는지 여부에 관계없이 항상 경고를 트리거하지만 더 이상 사용되지 않는 경고를 인쇄하지 않습니다.
- `warn-with-error-code`: [`unhandledRejection`](/ko/nodejs/api/process#event-unhandledrejection)을 발생시킵니다. 이 후크가 설정되지 않은 경우 경고를 트리거하고 프로세스 종료 코드를 1로 설정합니다.
- `none`: 모든 경고를 묵살합니다.

명령줄 진입점의 ES 모듈 정적 로딩 단계에서 거부가 발생하면 항상 잡히지 않은 예외로 발생시킵니다.

### `--use-bundled-ca`, `--use-openssl-ca` {#--unhandled-rejections=mode}

**Added in: v6.11.0**

현재 Node.js 버전에서 제공하는 번들된 Mozilla CA 저장소를 사용하거나 OpenSSL의 기본 CA 저장소를 사용합니다. 기본 저장소는 빌드 시 선택할 수 있습니다.

Node.js에서 제공하는 번들된 CA 저장소는 릴리스 시점에 고정된 Mozilla CA 저장소의 스냅샷입니다. 지원되는 모든 플랫폼에서 동일합니다.

OpenSSL 저장소를 사용하면 저장소의 외부 수정이 가능합니다. 대부분의 Linux 및 BSD 배포판의 경우 이 저장소는 배포판 유지 관리자 및 시스템 관리자가 유지 관리합니다. OpenSSL CA 저장소 위치는 OpenSSL 라이브러리의 구성에 따라 다르지만 런타임 시 환경 변수를 사용하여 변경할 수 있습니다.

`SSL_CERT_DIR` 및 `SSL_CERT_FILE`을 참조하십시오.


### `--use-largepages=mode` {#--use-bundled-ca---use-openssl-ca}

**Added in: v13.6.0, v12.17.0**

시작 시 Node.js 정적 코드를 큰 메모리 페이지에 다시 매핑합니다. 대상 시스템에서 지원되는 경우 Node.js 정적 코드가 4KiB 페이지 대신 2MiB 페이지로 이동됩니다.

`mode`에 유효한 값은 다음과 같습니다.

- `off`: 매핑이 시도되지 않습니다. 기본값입니다.
- `on`: OS에서 지원하는 경우 매핑이 시도됩니다. 매핑 실패는 무시되고 표준 오류에 메시지가 출력됩니다.
- `silent`: OS에서 지원하는 경우 매핑이 시도됩니다. 매핑 실패는 무시되고 보고되지 않습니다.

### `--v8-options` {#--use-largepages=mode}

**Added in: v0.1.3**

V8 명령줄 옵션을 출력합니다.

### `--v8-pool-size=num` {#--v8-options}

**Added in: v5.10.0**

백그라운드 작업을 할당하는 데 사용되는 V8의 스레드 풀 크기를 설정합니다.

`0`으로 설정하면 Node.js는 병렬 처리량 추정치를 기반으로 스레드 풀의 적절한 크기를 선택합니다.

병렬 처리량은 주어진 시스템에서 동시에 수행할 수 있는 계산 수를 의미합니다. 일반적으로 CPU 수와 동일하지만 VM 또는 컨테이너와 같은 환경에서는 다를 수 있습니다.

### `-v`, `--version` {#--v8-pool-size=num}

**Added in: v0.1.3**

Node.js 버전을 출력합니다.

### `--watch` {#-v---version}

::: info [History]
| Version | Changes |
| --- | --- |
| v22.0.0, v20.13.0 | 이제 감시 모드가 안정화되었습니다. |
| v19.2.0, v18.13.0 | 이제 테스트 러너가 감시 모드에서 실행을 지원합니다. |
| v18.11.0, v16.19.0 | Added in: v18.11.0, v16.19.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

Node.js를 감시 모드로 시작합니다. 감시 모드에서는 감시 대상 파일의 변경 사항으로 인해 Node.js 프로세스가 다시 시작됩니다. 기본적으로 감시 모드는 진입점과 모든 필수 또는 가져온 모듈을 감시합니다. 감시할 경로를 지정하려면 `--watch-path`를 사용하십시오.

이 플래그는 `--check`, `--eval`, `--interactive` 또는 REPL과 함께 사용할 수 없습니다.

```bash [BASH]
node --watch index.js
```

### `--watch-path` {#--watch}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.0.0, v20.13.0 | 감시 모드가 이제 안정화되었습니다. |
| v18.11.0, v16.19.0 | 추가됨: v18.11.0, v16.19.0 |
:::

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

Node.js를 감시 모드로 시작하고 감시할 경로를 지정합니다. 감시 모드에서는 감시되는 경로의 변경 사항으로 인해 Node.js 프로세스가 다시 시작됩니다. `--watch`와 함께 사용하더라도 필요한 모듈 또는 가져온 모듈의 감시는 해제됩니다.

이 플래그는 `--check`, `--eval`, `--interactive`, `--test` 또는 REPL과 함께 사용할 수 없습니다.

```bash [BASH]
node --watch-path=./src --watch-path=./tests index.js
```
이 옵션은 macOS 및 Windows에서만 지원됩니다. 옵션을 지원하지 않는 플랫폼에서 사용하면 `ERR_FEATURE_UNAVAILABLE_ON_PLATFORM` 예외가 발생합니다.

### `--watch-preserve-output` {#--watch-path}

**추가됨: v19.3.0, v18.13.0**

감시 모드가 프로세스를 다시 시작할 때 콘솔 지우기를 비활성화합니다.

```bash [BASH]
node --watch --watch-preserve-output test.js
```
### `--zero-fill-buffers` {#--watch-preserve-output}

**추가됨: v6.0.0**

새로 할당된 모든 [`Buffer`](/ko/nodejs/api/buffer#class-buffer) 및 [`SlowBuffer`](/ko/nodejs/api/buffer#class-slowbuffer) 인스턴스를 자동으로 0으로 채웁니다.

## 환경 변수 {#--zero-fill-buffers}

### `FORCE_COLOR=[1, 2, 3]` {#environment-variables_1}

`FORCE_COLOR` 환경 변수는 ANSI 색상 출력을 활성화하는 데 사용됩니다. 값은 다음과 같습니다.

- `1`, `true` 또는 빈 문자열 `''`은 16색 지원을 나타냅니다.
- `2`는 256색 지원을 나타냅니다.
- `3`은 1,600만 색 지원을 나타냅니다.

`FORCE_COLOR`가 사용되고 지원되는 값으로 설정되면 `NO_COLOR` 및 `NODE_DISABLE_COLORS` 환경 변수가 모두 무시됩니다.

다른 값은 색상 출력이 비활성화됩니다.

### `NODE_COMPILE_CACHE=dir` {#force_color=1-2-3}

**추가됨: v22.1.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::

Node.js 인스턴스에 대한 [모듈 컴파일 캐시](/ko/nodejs/api/module#module-compile-cache)를 활성화합니다. 자세한 내용은 [모듈 컴파일 캐시](/ko/nodejs/api/module#module-compile-cache) 문서를 참조하십시오.


### `NODE_DEBUG=module[,…]` {#node_compile_cache=dir}

**추가됨: v0.1.32**

디버그 정보를 출력해야 하는 핵심 모듈의 `','`로 구분된 목록입니다.

### `NODE_DEBUG_NATIVE=module[,…]` {#node_debug=module}

디버그 정보를 출력해야 하는 핵심 C++ 모듈의 `','`로 구분된 목록입니다.

### `NODE_DISABLE_COLORS=1` {#node_debug_native=module}

**추가됨: v0.3.0**

설정되면 REPL에서 색상이 사용되지 않습니다.

### `NODE_DISABLE_COMPILE_CACHE=1` {#node_disable_colors=1}

**추가됨: v22.8.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::

Node.js 인스턴스에 대한 [모듈 컴파일 캐시](/ko/nodejs/api/module#module-compile-cache)를 비활성화합니다. 자세한 내용은 [모듈 컴파일 캐시](/ko/nodejs/api/module#module-compile-cache) 문서를 참조하십시오.

### `NODE_EXTRA_CA_CERTS=file` {#node_disable_compile_cache=1}

**추가됨: v7.3.0**

설정되면 잘 알려진 "루트" CA (예: VeriSign)가 `file`의 추가 인증서로 확장됩니다. 파일은 PEM 형식의 하나 이상의 신뢰할 수 있는 인증서로 구성되어야 합니다. 파일이 없거나 잘못된 형식이면 [`process.emitWarning()`](/ko/nodejs/api/process#processemitwarningwarning-options)으로 메시지가 (한 번) 발생하지만 다른 오류는 무시됩니다.

TLS 또는 HTTPS 클라이언트 또는 서버에 대해 `ca` 옵션 속성이 명시적으로 지정된 경우 잘 알려진 인증서나 추가 인증서가 사용되지 않습니다.

이 환경 변수는 `node`가 setuid 루트로 실행되거나 Linux 파일 기능이 설정된 경우 무시됩니다.

`NODE_EXTRA_CA_CERTS` 환경 변수는 Node.js 프로세스가 처음 시작될 때만 읽습니다. 런타임에 `process.env.NODE_EXTRA_CA_CERTS`를 사용하여 값을 변경해도 현재 프로세스에는 영향을 미치지 않습니다.

### `NODE_ICU_DATA=file` {#node_extra_ca_certs=file}

**추가됨: v0.11.15**

ICU (`Intl` 객체) 데이터의 데이터 경로입니다. small-icu 지원으로 컴파일할 때 링크된 데이터를 확장합니다.

### `NODE_NO_WARNINGS=1` {#node_icu_data=file}

**추가됨: v6.11.0**

`1`로 설정하면 프로세스 경고가 표시되지 않습니다.

### `NODE_OPTIONS=options...` {#node_no_warnings=1}

**추가됨: v8.0.0**

공백으로 구분된 명령줄 옵션 목록입니다. `options...`는 명령줄 옵션보다 먼저 해석되므로 명령줄 옵션은 `options...`의 모든 항목 다음에 재정의하거나 복합됩니다. 환경에서 허용되지 않는 옵션 (예: `-p` 또는 스크립트 파일)이 사용되면 Node.js가 오류와 함께 종료됩니다.

옵션 값에 공백이 포함된 경우 큰따옴표를 사용하여 이스케이프할 수 있습니다.

```bash [BASH]
NODE_OPTIONS='--require "./my path/file.js"'
```
명령줄 옵션으로 전달된 싱글톤 플래그는 `NODE_OPTIONS`로 전달된 동일한 플래그를 재정의합니다.

```bash [BASH]
# 검사기는 포트 5555에서 사용할 수 있습니다. {#node_options=options}
NODE_OPTIONS='--inspect=localhost:4444' node --inspect=localhost:5555
```
여러 번 전달할 수 있는 플래그는 `NODE_OPTIONS` 인스턴스가 먼저 전달된 다음 명령줄 인스턴스가 나중에 전달된 것처럼 처리됩니다.

```bash [BASH]
NODE_OPTIONS='--require "./a.js"' node --require "./b.js"
# 다음과 같습니다. {#the-inspector-will-be-available-on-port-5555}
node --require "./a.js" --require "./b.js"
```
허용되는 Node.js 옵션은 다음 목록에 있습니다. 옵션이 --XX 및 --no-XX 변형을 모두 지원하는 경우 둘 다 지원되지만 아래 목록에는 하나만 포함됩니다.

- `--allow-addons`
- `--allow-child-process`
- `--allow-fs-read`
- `--allow-fs-write`
- `--allow-wasi`
- `--allow-worker`
- `--conditions`, `-C`
- `--diagnostic-dir`
- `--disable-proto`
- `--disable-warning`
- `--disable-wasm-trap-handler`
- `--dns-result-order`
- `--enable-fips`
- `--enable-network-family-autoselection`
- `--enable-source-maps`
- `--entry-url`
- `--experimental-abortcontroller`
- `--experimental-async-context-frame`
- `--experimental-detect-module`
- `--experimental-eventsource`
- `--experimental-import-meta-resolve`
- `--experimental-json-modules`
- `--experimental-loader`
- `--experimental-modules`
- `--experimental-permission`
- `--experimental-print-required-tla`
- `--experimental-require-module`
- `--experimental-shadow-realm`
- `--experimental-specifier-resolution`
- `--experimental-strip-types`
- `--experimental-top-level-await`
- `--experimental-transform-types`
- `--experimental-vm-modules`
- `--experimental-wasi-unstable-preview1`
- `--experimental-wasm-modules`
- `--experimental-webstorage`
- `--force-context-aware`
- `--force-fips`
- `--force-node-api-uncaught-exceptions-policy`
- `--frozen-intrinsics`
- `--heap-prof-dir`
- `--heap-prof-interval`
- `--heap-prof-name`
- `--heap-prof`
- `--heapsnapshot-near-heap-limit`
- `--heapsnapshot-signal`
- `--http-parser`
- `--icu-data-dir`
- `--import`
- `--input-type`
- `--insecure-http-parser`
- `--inspect-brk`
- `--inspect-port`, `--debug-port`
- `--inspect-publish-uid`
- `--inspect-wait`
- `--inspect`
- `--localstorage-file`
- `--max-http-header-size`
- `--napi-modules`
- `--network-family-autoselection-attempt-timeout`
- `--no-addons`
- `--no-deprecation`
- `--no-experimental-global-navigator`
- `--no-experimental-repl-await`
- `--no-experimental-sqlite`
- `--no-experimental-websocket`
- `--no-extra-info-on-fatal-exception`
- `--no-force-async-hooks-checks`
- `--no-global-search-paths`
- `--no-network-family-autoselection`
- `--no-warnings`
- `--node-memory-debug`
- `--openssl-config`
- `--openssl-legacy-provider`
- `--openssl-shared-config`
- `--pending-deprecation`
- `--permission`
- `--preserve-symlinks-main`
- `--preserve-symlinks`
- `--prof-process`
- `--redirect-warnings`
- `--report-compact`
- `--report-dir`, `--report-directory`
- `--report-exclude-env`
- `--report-exclude-network`
- `--report-filename`
- `--report-on-fatalerror`
- `--report-on-signal`
- `--report-signal`
- `--report-uncaught-exception`
- `--require`, `-r`
- `--secure-heap-min`
- `--secure-heap`
- `--snapshot-blob`
- `--test-coverage-branches`
- `--test-coverage-exclude`
- `--test-coverage-functions`
- `--test-coverage-include`
- `--test-coverage-lines`
- `--test-name-pattern`
- `--test-only`
- `--test-reporter-destination`
- `--test-reporter`
- `--test-shard`
- `--test-skip-pattern`
- `--throw-deprecation`
- `--title`
- `--tls-cipher-list`
- `--tls-keylog`
- `--tls-max-v1.2`
- `--tls-max-v1.3`
- `--tls-min-v1.0`
- `--tls-min-v1.1`
- `--tls-min-v1.2`
- `--tls-min-v1.3`
- `--trace-deprecation`
- `--trace-env-js-stack`
- `--trace-env-native-stack`
- `--trace-env`
- `--trace-event-categories`
- `--trace-event-file-pattern`
- `--trace-events-enabled`
- `--trace-exit`
- `--trace-require-module`
- `--trace-sigint`
- `--trace-sync-io`
- `--trace-tls`
- `--trace-uncaught`
- `--trace-warnings`
- `--track-heap-objects`
- `--unhandled-rejections`
- `--use-bundled-ca`
- `--use-largepages`
- `--use-openssl-ca`
- `--v8-pool-size`
- `--watch-path`
- `--watch-preserve-output`
- `--watch`
- `--zero-fill-buffers`

허용되는 V8 옵션은 다음과 같습니다.

- `--abort-on-uncaught-exception`
- `--disallow-code-generation-from-strings`
- `--enable-etw-stack-walking`
- `--expose-gc`
- `--interpreted-frames-native-stack`
- `--jitless`
- `--max-old-space-size`
- `--max-semi-space-size`
- `--perf-basic-prof-only-functions`
- `--perf-basic-prof`
- `--perf-prof-unwinding-info`
- `--perf-prof`
- `--stack-trace-limit`

`--perf-basic-prof-only-functions`, `--perf-basic-prof`, `--perf-prof-unwinding-info` 및 `--perf-prof`는 Linux에서만 사용할 수 있습니다.

`--enable-etw-stack-walking`는 Windows에서만 사용할 수 있습니다.


### `NODE_PATH=path[:…]` {#is-equivalent-to}

**추가된 버전: v0.1.32**

모듈 검색 경로 앞에 추가되는 디렉터리의 `':'`로 구분된 목록입니다.

Windows에서는 `';'`로 구분된 목록입니다.

### `NODE_PENDING_DEPRECATION=1` {#node_path=path}

**추가된 버전: v8.0.0**

`1`로 설정하면 보류 중인 사용 중단 경고를 발생시킵니다.

보류 중인 사용 중단은 일반적으로 런타임 사용 중단과 동일하지만, 기본적으로 *해제*되어 있으며 `--pending-deprecation` 명령줄 플래그 또는 `NODE_PENDING_DEPRECATION=1` 환경 변수가 설정되지 않으면 발생하지 않습니다. 보류 중인 사용 중단은 개발자가 사용 중단된 API 사용을 감지하는 데 활용할 수 있는 일종의 선택적 "조기 경고" 메커니즘을 제공하는 데 사용됩니다.

### `NODE_PENDING_PIPE_INSTANCES=instances` {#node_pending_deprecation=1}

파이프 서버가 연결을 기다리는 동안 보류 중인 파이프 인스턴스 핸들 수를 설정합니다. 이 설정은 Windows에만 적용됩니다.

### `NODE_PRESERVE_SYMLINKS=1` {#node_pending_pipe_instances=instances}

**추가된 버전: v7.1.0**

`1`로 설정하면 모듈 로더가 모듈을 확인하고 캐싱할 때 심볼릭 링크를 보존하도록 지시합니다.

### `NODE_REDIRECT_WARNINGS=file` {#node_preserve_symlinks=1}

**추가된 버전: v8.0.0**

설정되면 프로세스 경고가 stderr에 인쇄하는 대신 지정된 파일로 발생합니다. 파일이 존재하지 않으면 생성되고, 존재하는 경우 추가됩니다. 파일에 경고를 쓰려고 시도하는 동안 오류가 발생하면 경고가 대신 stderr에 기록됩니다. 이는 `--redirect-warnings=file` 명령줄 플래그를 사용하는 것과 같습니다.

### `NODE_REPL_EXTERNAL_MODULE=file` {#node_redirect_warnings=file}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.3.0, v20.16.0 | 임베더를 위해 kDisableNodeOptionsEnv와 함께 이 환경 변수를 사용할 가능성을 제거합니다. |
| v13.0.0, v12.16.0 | 추가된 버전: v13.0.0, v12.16.0 |
:::

내장 REPL 대신 로드될 Node.js 모듈의 경로입니다. 이 값을 빈 문자열(`''`)로 덮어쓰면 내장 REPL이 사용됩니다.

### `NODE_REPL_HISTORY=file` {#node_repl_external_module=file}

**추가된 버전: v3.0.0**

영구 REPL 기록을 저장하는 데 사용되는 파일의 경로입니다. 기본 경로는 `~/.node_repl_history`이며, 이 변수에 의해 덮어쓰여집니다. 값을 빈 문자열(`''` 또는 `' '`)로 설정하면 영구 REPL 기록이 비활성화됩니다.


### `NODE_SKIP_PLATFORM_CHECK=value` {#node_repl_history=file}

**다음 버전부터 추가됨: v14.5.0**

`value`가 `'1'`이면 Node.js 시작 시 지원되는 플랫폼인지 확인하는 과정을 건너뜁니다. Node.js가 올바르게 실행되지 않을 수 있습니다. 지원되지 않는 플랫폼에서 발생하는 문제는 수정되지 않습니다.

### `NODE_TEST_CONTEXT=value` {#node_skip_platform_check=value}

`value`가 `'child'`이면 테스트 리포터 옵션이 재정의되고 테스트 결과가 TAP 형식으로 stdout으로 전송됩니다. 다른 값이 제공되면 Node.js는 사용된 리포터 형식 또는 해당 안정성에 대해 어떠한 보증도 하지 않습니다.

### `NODE_TLS_REJECT_UNAUTHORIZED=value` {#node_test_context=value}

`value`가 `'0'`이면 TLS 연결에 대한 인증서 유효성 검사가 비활성화됩니다. 이로 인해 TLS와 HTTPS가 안전하지 않게 됩니다. 이 환경 변수의 사용은 강력히 권장되지 않습니다.

### `NODE_V8_COVERAGE=dir` {#node_tls_reject_unauthorized=value}

설정되면 Node.js는 [V8 JavaScript 코드 커버리지](https://v8project.blogspot.com/2017/12/javascript-code-coverage) 및 [소스 맵](https://sourcemaps.info/spec) 데이터를 인수로 제공된 디렉터리에 출력하기 시작합니다 (커버리지 정보는 `coverage` 접두사가 붙은 JSON 파일로 작성됨).

`NODE_V8_COVERAGE`는 자동으로 하위 프로세스로 전파되어 `child_process.spawn()` 함수군을 호출하는 애플리케이션을 쉽게 계측할 수 있도록 합니다. `NODE_V8_COVERAGE`를 빈 문자열로 설정하여 전파를 방지할 수 있습니다.

### `NO_COLOR=<any>` {#node_v8_coverage=dir}

[`NO_COLOR`](https://no-color.org/)는 `NODE_DISABLE_COLORS`의 별칭입니다. 환경 변수의 값은 임의적입니다.

#### 커버리지 출력 {#no_color=&lt;any&gt;}

커버리지는 최상위 키 `result`에서 [ScriptCoverage](https://chromedevtools.github.io/devtools-protocol/tot/Profiler#type-ScriptCoverage) 객체의 배열로 출력됩니다.

```json [JSON]
{
  "result": [
    {
      "scriptId": "67",
      "url": "internal/tty.js",
      "functions": []
    }
  ]
}
```
#### 소스 맵 캐시 {#coverage-output}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

찾은 경우 소스 맵 데이터는 JSON 커버리지 객체의 최상위 키 `source-map-cache`에 추가됩니다.

`source-map-cache`는 소스 맵이 추출된 파일을 나타내는 키와 원시 소스 맵 URL (키 `url`에 있음), 구문 분석된 소스 맵 v3 정보 (키 `data`에 있음) 및 소스 파일의 줄 길이를 포함하는 값을 포함하는 객체입니다 (키 `lineLengths`에 있음).

```json [JSON]
{
  "result": [
    {
      "scriptId": "68",
      "url": "file:///absolute/path/to/source.js",
      "functions": []
    }
  ],
  "source-map-cache": {
    "file:///absolute/path/to/source.js": {
      "url": "./path-to-map.json",
      "data": {
        "version": 3,
        "sources": [
          "file:///absolute/path/to/original.js"
        ],
        "names": [
          "Foo",
          "console",
          "info"
        ],
        "mappings": "MAAMA,IACJC,YAAaC",
        "sourceRoot": "./"
      },
      "lineLengths": [
        13,
        62,
        38,
        27
      ]
    }
  }
}
```

### `OPENSSL_CONF=file` {#source-map-cache}

**추가된 버전: v6.11.0**

시작 시 OpenSSL 구성 파일을 로드합니다. 다른 용도 중에서도, Node.js가 `./configure --openssl-fips`로 빌드된 경우 FIPS 호환 암호화를 활성화하는 데 사용할 수 있습니다.

[`--openssl-config`](/ko/nodejs/api/cli#--openssl-configfile) 명령줄 옵션을 사용하면 환경 변수는 무시됩니다.

### `SSL_CERT_DIR=dir` {#openssl_conf=file}

**추가된 버전: v7.7.0**

`--use-openssl-ca`가 활성화된 경우, 신뢰할 수 있는 인증서를 포함하는 OpenSSL의 디렉터리를 재정의하고 설정합니다.

자식 환경이 명시적으로 설정되지 않은 경우, 이 환경 변수는 모든 자식 프로세스에 상속되며, 자식 프로세스가 OpenSSL을 사용하는 경우 node와 동일한 CA를 신뢰하게 될 수 있습니다.

### `SSL_CERT_FILE=file` {#ssl_cert_dir=dir}

**추가된 버전: v7.7.0**

`--use-openssl-ca`가 활성화된 경우, 신뢰할 수 있는 인증서를 포함하는 OpenSSL의 파일을 재정의하고 설정합니다.

자식 환경이 명시적으로 설정되지 않은 경우, 이 환경 변수는 모든 자식 프로세스에 상속되며, 자식 프로세스가 OpenSSL을 사용하는 경우 node와 동일한 CA를 신뢰하게 될 수 있습니다.

### `TZ` {#ssl_cert_file=file}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.2.0 | process.env.TZ =를 사용하여 TZ 변수를 변경하면 Windows에서도 시간대가 변경됩니다. |
| v13.0.0 | process.env.TZ =를 사용하여 TZ 변수를 변경하면 POSIX 시스템에서도 시간대가 변경됩니다. |
| v0.0.1 | 추가된 버전: v0.0.1 |
:::

`TZ` 환경 변수는 시간대 구성을 지정하는 데 사용됩니다.

Node.js는 [`TZ`가 다른 환경에서 처리되는 다양한 방법](https://www.gnu.org/software/libc/manual/html_node/TZ-Variable)을 모두 지원하지는 않지만, 기본적인 [시간대 ID](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) (예: `'Etc/UTC'`, `'Europe/Paris'` 또는 `'America/New_York'`)를 지원합니다. 몇 가지 다른 약어 또는 별칭을 지원할 수 있지만, 이는 권장되지 않으며 보장되지 않습니다.

```bash [BASH]
$ TZ=Europe/Dublin node -pe "new Date().toString()"
Wed May 12 2021 20:30:48 GMT+0100 (Irish Standard Time)
```

### `UV_THREADPOOL_SIZE=크기` {#tz}

libuv의 스레드 풀에서 사용되는 스레드 수를 `크기` 스레드로 설정합니다.

Node.js는 가능한 경우 비동기 시스템 API를 사용하지만, 존재하지 않는 경우 libuv의 스레드 풀을 사용하여 동기 시스템 API를 기반으로 비동기 노드 API를 생성합니다. 스레드 풀을 사용하는 Node.js API는 다음과 같습니다.

- 파일 감시 API 및 명시적으로 동기적인 API를 제외한 모든 `fs` API
- `crypto.pbkdf2()`, `crypto.scrypt()`, `crypto.randomBytes()`, `crypto.randomFill()`, `crypto.generateKeyPair()`와 같은 비동기 암호화 API
- `dns.lookup()`
- 명시적으로 동기적인 API를 제외한 모든 `zlib` API

libuv의 스레드 풀은 크기가 고정되어 있으므로, 어떤 이유로든 이러한 API 중 일부가 시간이 오래 걸리는 경우 libuv의 스레드 풀에서 실행되는 다른 (겉보기에 관련 없는) API의 성능이 저하될 수 있습니다. 이 문제를 완화하기 위해 잠재적인 해결 방법 중 하나는 `'UV_THREADPOOL_SIZE'` 환경 변수를 `4` (현재 기본값)보다 큰 값으로 설정하여 libuv의 스레드 풀 크기를 늘리는 것입니다. 그러나 `process.env.UV_THREADPOOL_SIZE=크기`를 사용하여 프로세스 내부에서 설정하는 것은 스레드 풀이 사용자 코드가 실행되기 훨씬 전에 런타임 초기화의 일부로 생성되었으므로 작동이 보장되지 않습니다. 자세한 내용은 [libuv 스레드 풀 설명서](https://docs.libuv.org/en/latest/threadpool)를 참조하십시오.

## 유용한 V8 옵션 {#uv_threadpool_size=size}

V8에는 자체 CLI 옵션 세트가 있습니다. `node`에 제공된 모든 V8 CLI 옵션은 V8에서 처리하도록 전달됩니다. V8 옵션에는 *안정성 보장이 없습니다*. V8 팀 자체는 이를 공식 API의 일부로 간주하지 않으며 언제든지 변경할 권리를 보유합니다. 마찬가지로 Node.js 안정성 보장도 적용되지 않습니다. 많은 V8 옵션은 V8 개발자에게만 관심이 있습니다. 그럼에도 불구하고 Node.js에 널리 적용할 수 있는 V8 옵션의 작은 세트가 있으며 여기에 설명되어 있습니다.

### `--abort-on-uncaught-exception` {#useful-v8-options}


### `--disallow-code-generation-from-strings` {#--abort-on-uncaught-exception_1}

### `--enable-etw-stack-walking` {#--disallow-code-generation-from-strings_1}

### `--expose-gc` {#--enable-etw-stack-walking}

### `--harmony-shadow-realm` {#--expose-gc_1}

### `--interpreted-frames-native-stack` {#--harmony-shadow-realm}

### `--jitless` {#--interpreted-frames-native-stack}

### `--max-old-space-size=SIZE` (MiB 단위) {#--jitless_1}

V8의 오래된 메모리 섹션의 최대 메모리 크기를 설정합니다. 메모리 소비가 제한에 가까워지면 V8은 사용하지 않는 메모리를 확보하기 위해 가비지 수집에 더 많은 시간을 할애합니다.

2GiB의 메모리를 가진 시스템에서는 다른 용도로 메모리를 남겨두고 스와핑을 피하기 위해 1536(1.5GiB)으로 설정하는 것을 고려해 볼 수 있습니다.

```bash [BASH]
node --max-old-space-size=1536 index.js
```
### `--max-semi-space-size=SIZE` (MiB 단위) {#--max-old-space-size=size-in-mib}

V8의 [스캐빈지 가비지 컬렉터](https://v8.dev/blog/orinoco-parallel-scavenger)에 대한 최대 [세미 스페이스](https://www.memorymanagement.org/glossary/s#semi.space) 크기를 MiB(메비바이트) 단위로 설정합니다. 세미 스페이스의 최대 크기를 늘리면 더 많은 메모리 소비를 감수하는 대신 Node.js의 처리량을 향상시킬 수 있습니다.

V8 힙의 young generation 크기는 세미 스페이스 크기의 세 배이므로 (V8의 [`YoungGenerationSizeFromSemiSpaceSize`](https://chromium.googlesource.com/v8/v8.git/+/refs/tags/10.3.129/src/heap/heap.cc#328) 참조) 세미 스페이스에 1MiB를 증가시키면 세 개의 개별 세미 스페이스 각각에 적용되어 힙 크기가 3MiB 증가합니다. 처리량 개선은 워크로드에 따라 다릅니다 ([#42511](https://github.com/nodejs/node/issues/42511) 참조).

기본값은 메모리 제한에 따라 다릅니다. 예를 들어 메모리 제한이 512MiB인 64비트 시스템에서는 세미 스페이스의 최대 크기가 기본적으로 1MiB입니다. 최대 2GiB의 메모리 제한의 경우, 64비트 시스템에서 세미 스페이스의 기본 최대 크기는 16MiB 미만입니다.

애플리케이션에 가장 적합한 구성을 얻으려면 애플리케이션에 대한 벤치마크를 실행할 때 다양한 max-semi-space-size 값을 시도해야 합니다.

예를 들어 64비트 시스템에서 벤치마크를 실행합니다.

```bash [BASH]
for MiB in 16 32 64 128; do
    node --max-semi-space-size=$MiB index.js
done
```

### `--perf-basic-prof` {#--max-semi-space-size=size-in-mib}

### `--perf-basic-prof-only-functions` {#--perf-basic-prof}

### `--perf-prof` {#--perf-basic-prof-only-functions}

### `--perf-prof-unwinding-info` {#--perf-prof}

### `--prof` {#--perf-prof-unwinding-info}

### `--security-revert` {#--prof_1}

### `--stack-trace-limit=limit` {#--security-revert}

오류 스택 트레이스에서 수집할 최대 스택 프레임 수입니다. 0으로 설정하면 스택 트레이스 수집이 비활성화됩니다. 기본값은 10입니다.

```bash [BASH]
node --stack-trace-limit=12 -p -e "Error.stackTraceLimit" # 12 출력
```

