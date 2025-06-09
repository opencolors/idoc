---
title: Node.js 폐기 기능
description: 이 페이지는 Node.js에서 폐기된 기능을 문서화하고, 오래된 API와 관행을 사용하지 않도록 코드를 업데이트하는 방법에 대한 지침을 제공합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 폐기 기능 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 이 페이지는 Node.js에서 폐기된 기능을 문서화하고, 오래된 API와 관행을 사용하지 않도록 코드를 업데이트하는 방법에 대한 지침을 제공합니다.
  - - meta
    - name: twitter:title
      content: Node.js 폐기 기능 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 이 페이지는 Node.js에서 폐기된 기능을 문서화하고, 오래된 API와 관행을 사용하지 않도록 코드를 업데이트하는 방법에 대한 지침을 제공합니다.
---


# 지원 중단된 API {#deprecated-apis}

Node.js API는 다음과 같은 이유로 지원이 중단될 수 있습니다.

- API 사용이 안전하지 않습니다.
- 개선된 대체 API를 사용할 수 있습니다.
- 향후 주요 릴리스에서 API에 대한 주요 변경 사항이 예상됩니다.

Node.js는 네 가지 종류의 지원 중단을 사용합니다.

- 문서 전용
- 애플리케이션 (`node_modules` 코드만 해당되지 않음)
- 런타임 (모든 코드)
- 수명 종료

문서 전용 지원 중단은 Node.js API 문서 내에서만 표현됩니다. 이러한 지원 중단은 Node.js를 실행하는 동안 부작용을 생성하지 않습니다. 일부 문서 전용 지원 중단은 [`--pending-deprecation`](/ko/nodejs/api/cli#--pending-deprecation) 플래그 (또는 대안인 `NODE_PENDING_DEPRECATION=1` 환경 변수)로 시작할 때 런타임 경고를 트리거합니다. 이는 아래의 런타임 지원 중단과 유사합니다. 해당 플래그를 지원하는 문서 전용 지원 중단은 [지원 중단된 API 목록](/ko/nodejs/api/deprecations#list-of-deprecated-apis)에 명시적으로 레이블이 지정됩니다.

`node_modules` 코드가 아닌 코드에 대한 애플리케이션 지원 중단은 기본적으로 `node_modules`에서 로드되지 않은 코드에서 더 이상 사용되지 않는 API가 처음 사용될 때 `stderr`에 인쇄되는 프로세스 경고를 생성합니다. [`--throw-deprecation`](/ko/nodejs/api/cli#--throw-deprecation) 명령줄 플래그를 사용하면 런타임 지원 중단으로 인해 오류가 발생합니다. [`--pending-deprecation`](/ko/nodejs/api/cli#--pending-deprecation)을 사용하면 `node_modules`에서 로드된 코드에 대해서도 경고가 발생합니다.

모든 코드에 대한 런타임 지원 중단은 `node_modules` 코드가 아닌 코드에 대한 런타임 지원 중단과 유사하지만 `node_modules`에서 로드된 코드에 대해서도 경고를 발생시킨다는 점이 다릅니다.

수명 종료 지원 중단은 기능이 Node.js에서 제거되었거나 곧 제거될 예정인 경우에 사용됩니다.

## 지원 중단 철회 {#revoking-deprecations}

경우에 따라 API 지원 중단이 취소될 수 있습니다. 이러한 상황에서는 이 문서가 결정과 관련된 정보로 업데이트됩니다. 그러나 지원 중단 식별자는 수정되지 않습니다.

## 지원 중단된 API 목록 {#list-of-deprecated-apis}

### DEP0001: `http.OutgoingMessage.prototype.flush` {#dep0001-httpoutgoingmessageprototypeflush}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.0.0 | 수명 종료. |
| v6.12.0, v4.8.6 | 지원 중단 코드가 할당되었습니다. |
| v1.6.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

`OutgoingMessage.prototype.flush()`가 제거되었습니다. 대신 `OutgoingMessage.prototype.flushHeaders()`를 사용하세요.


### DEP0002: `require('_linklist')` {#dep0002-require_linklist}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v8.0.0 | 수명 종료. |
| v6.12.0 | 더 이상 사용되지 않는 코드 할당됨. |
| v5.0.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

`_linklist` 모듈은 더 이상 사용되지 않습니다. 사용자 영역의 대안을 사용하십시오.

### DEP0003: `_writableState.buffer` {#dep0003-_writablestatebuffer}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v14.0.0 | 수명 종료. |
| v6.12.0, v4.8.6 | 더 이상 사용되지 않는 코드 할당됨. |
| v0.11.15 | 런타임 지원 중단. |
:::

유형: 수명 종료

`_writableState.buffer`가 제거되었습니다. 대신 `_writableState.getBuffer()`를 사용하십시오.

### DEP0004: `CryptoStream.prototype.readyState` {#dep0004-cryptostreamprototypereadystate}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 수명 종료. |
| v6.12.0, v4.8.6 | 더 이상 사용되지 않는 코드 할당됨. |
| v0.4.0 | 문서에서만 지원 중단됨. |
:::

유형: 수명 종료

`CryptoStream.prototype.readyState` 속성이 제거되었습니다.

### DEP0005: `Buffer()` 생성자 {#dep0005-buffer-constructor}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 런타임 지원 중단. |
| v6.12.0 | 더 이상 사용되지 않는 코드 할당됨. |
| v6.0.0 | 문서에서만 지원 중단됨. |
:::

유형: 애플리케이션 (`node_modules` 코드에만 해당하지 않음)

`Buffer()` 함수 및 `new Buffer()` 생성자는 우발적인 보안 문제로 이어질 수 있는 API 사용성 문제로 인해 더 이상 사용되지 않습니다.

대안으로, 다음 방법 중 하나를 사용하여 `Buffer` 객체를 구성하십시오.

- [`Buffer.alloc(size[, fill[, encoding]])`](/ko/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding): *초기화된* 메모리로 `Buffer`를 만듭니다.
- [`Buffer.allocUnsafe(size)`](/ko/nodejs/api/buffer#static-method-bufferallocunsafesize): *초기화되지 않은* 메모리로 `Buffer`를 만듭니다.
- [`Buffer.allocUnsafeSlow(size)`](/ko/nodejs/api/buffer#static-method-bufferallocunsafeslowsize): *초기화되지 않은* 메모리로 `Buffer`를 만듭니다.
- [`Buffer.from(array)`](/ko/nodejs/api/buffer#static-method-bufferfromarray): `array`의 복사본으로 `Buffer`를 만듭니다.
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/ko/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) - 주어진 `arrayBuffer`를 래핑하는 `Buffer`를 만듭니다.
- [`Buffer.from(buffer)`](/ko/nodejs/api/buffer#static-method-bufferfrombuffer): `buffer`를 복사하는 `Buffer`를 만듭니다.
- [`Buffer.from(string[, encoding])`](/ko/nodejs/api/buffer#static-method-bufferfromstring-encoding): `string`을 복사하는 `Buffer`를 만듭니다.

`--pending-deprecation`이 없으면 런타임 경고는 `node_modules`에 없는 코드에 대해서만 발생합니다. 즉, 종속성의 `Buffer()` 사용에 대한 지원 중단 경고는 발생하지 않습니다. `--pending-deprecation`을 사용하면 `Buffer()` 사용이 발생하는 위치에 관계없이 런타임 경고가 발생합니다.


### DEP0006: `child_process` `options.customFds` {#dep0006-child_process-optionscustomfds}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.0.0 | 지원 종료. |
| v6.12.0, v4.8.6 | 폐기 코드 할당됨. |
| v0.11.14 | 런타임 폐기. |
| v0.5.10 | 문서 전용 폐기. |
:::

유형: 지원 종료

[`child_process`](/ko/nodejs/api/child_process) 모듈의 `spawn()`, `fork()` 및 `exec()` 메서드 내에서 `options.customFds` 옵션은 더 이상 사용되지 않습니다. 대신 `options.stdio` 옵션을 사용해야 합니다.

### DEP0007: `cluster` `worker.suicide`를 `worker.exitedAfterDisconnect`로 대체 {#dep0007-replace-cluster-workersuicide-with-workerexitedafterdisconnect}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v9.0.0 | 지원 종료. |
| v7.0.0 | 런타임 폐기. |
| v6.12.0 | 폐기 코드 할당됨. |
| v6.0.0 | 문서 전용 폐기. |
:::

유형: 지원 종료

Node.js `cluster`의 이전 버전에서 `Worker` 객체에 `suicide`라는 부울 속성이 추가되었습니다. 이 속성의 목적은 `Worker` 인스턴스가 종료된 이유와 방법에 대한 표시를 제공하는 것이었습니다. Node.js 6.0.0에서 이전 속성은 더 이상 사용되지 않고 새로운 [`worker.exitedAfterDisconnect`](/ko/nodejs/api/cluster#workerexitedafterdisconnect) 속성으로 대체되었습니다. 이전 속성 이름은 실제 의미를 정확하게 설명하지 않았고 불필요하게 감정적이었습니다.

### DEP0008: `require('node:constants')` {#dep0008-requirenodeconstants}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v6.12.0 | 폐기 코드 할당됨. |
| v6.3.0 | 문서 전용 폐기. |
:::

유형: 문서 전용

`node:constants` 모듈은 더 이상 사용되지 않습니다. 특정 Node.js 내장 모듈과 관련된 상수에 대한 액세스가 필요한 경우 개발자는 대신 해당 모듈에서 노출하는 `constants` 속성을 참조해야 합니다. 예를 들어 `require('node:fs').constants` 및 `require('node:os').constants`를 참조하십시오.

### DEP0009: 다이제스트 없는 `crypto.pbkdf2` {#dep0009-cryptopbkdf2-without-digest}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.0.0 | 지원 종료 (`digest === null`의 경우). |
| v11.0.0 | 런타임 폐기 (`digest === null`의 경우). |
| v8.0.0 | 지원 종료 (`digest === undefined`의 경우). |
| v6.12.0 | 폐기 코드 할당됨. |
| v6.0.0 | 런타임 폐기 (`digest === undefined`의 경우). |
:::

유형: 지원 종료

다이제스트를 지정하지 않고 [`crypto.pbkdf2()`](/ko/nodejs/api/crypto#cryptopbkdf2password-salt-iterations-keylen-digest-callback) API를 사용하는 것은 메서드가 권장되지 않는 `'SHA1'` 다이제스트를 기본적으로 사용했기 때문에 Node.js 6.0에서 더 이상 사용되지 않습니다. 이전에는 폐기 경고가 표시되었습니다. Node.js 8.0.0부터 `digest`가 `undefined`로 설정된 상태에서 `crypto.pbkdf2()` 또는 `crypto.pbkdf2Sync()`를 호출하면 `TypeError`가 발생합니다.

Node.js v11.0.0부터 `digest`가 `null`로 설정된 상태에서 이러한 함수를 호출하면 `digest`가 `undefined`일 때의 동작과 일치하도록 폐기 경고가 표시됩니다.

그러나 이제 `undefined` 또는 `null`을 전달하면 `TypeError`가 발생합니다.


### DEP0010: `crypto.createCredentials` {#dep0010-cryptocreatecredentials}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v11.0.0 | 수명 종료. |
| v6.12.0, v4.8.6 | 더 이상 사용되지 않는 코드가 할당되었습니다. |
| v0.11.13 | 런타임 지원 중단. |
:::

유형: 수명 종료

`crypto.createCredentials()` API가 제거되었습니다. 대신 [`tls.createSecureContext()`](/ko/nodejs/api/tls#tlscreatesecurecontextoptions)를 사용하세요.

### DEP0011: `crypto.Credentials` {#dep0011-cryptocredentials}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v11.0.0 | 수명 종료. |
| v6.12.0, v4.8.6 | 더 이상 사용되지 않는 코드가 할당되었습니다. |
| v0.11.13 | 런타임 지원 중단. |
:::

유형: 수명 종료

`crypto.Credentials` 클래스가 제거되었습니다. 대신 [`tls.SecureContext`](/ko/nodejs/api/tls#tlscreatesecurecontextoptions)를 사용하세요.

### DEP0012: `Domain.dispose` {#dep0012-domaindispose}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v9.0.0 | 수명 종료. |
| v6.12.0, v4.8.6 | 더 이상 사용되지 않는 코드가 할당되었습니다. |
| v0.11.7 | 런타임 지원 중단. |
:::

유형: 수명 종료

`Domain.dispose()`가 제거되었습니다. 대신 도메인에 설정된 오류 이벤트 처리기를 통해 실패한 I/O 작업을 명시적으로 복구하세요.

### DEP0013: 콜백 없는 `fs` 비동기 함수 {#dep0013-fs-asynchronous-function-without-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 수명 종료. |
| v7.0.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

콜백 없는 비동기 함수를 호출하면 Node.js 10.0.0부터 `TypeError`가 발생합니다. [https://github.com/nodejs/node/pull/12562](https://github.com/nodejs/node/pull/12562)를 참조하세요.

### DEP0014: `fs.read` 레거시 문자열 인터페이스 {#dep0014-fsread-legacy-string-interface}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v8.0.0 | 수명 종료. |
| v6.0.0 | 런타임 지원 중단. |
| v6.12.0, v4.8.6 | 더 이상 사용되지 않는 코드가 할당되었습니다. |
| v0.1.96 | 문서 전용 지원 중단. |
:::

유형: 수명 종료

[`fs.read()`](/ko/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback) 레거시 `String` 인터페이스는 더 이상 사용되지 않습니다. 대신 문서에 언급된 대로 `Buffer` API를 사용하세요.

### DEP0015: `fs.readSync` 레거시 문자열 인터페이스 {#dep0015-fsreadsync-legacy-string-interface}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v8.0.0 | 수명 종료. |
| v6.0.0 | 런타임 지원 중단. |
| v6.12.0, v4.8.6 | 더 이상 사용되지 않는 코드가 할당되었습니다. |
| v0.1.96 | 문서 전용 지원 중단. |
:::

유형: 수명 종료

[`fs.readSync()`](/ko/nodejs/api/fs#fsreadsyncfd-buffer-offset-length-position) 레거시 `String` 인터페이스는 더 이상 사용되지 않습니다. 대신 문서에 언급된 대로 `Buffer` API를 사용하세요.


### DEP0016: `GLOBAL`/`root` {#dep0016-global/root}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.0.0 | 수명 종료. |
| v6.12.0 | 더 이상 사용되지 않는 코드 할당됨. |
| v6.0.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

`global` 속성에 대한 `GLOBAL` 및 `root` 별칭은 Node.js 6.0.0에서 더 이상 사용되지 않으며 이후 제거되었습니다.

### DEP0017: `Intl.v8BreakIterator` {#dep0017-intlv8breakiterator}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v9.0.0 | 수명 종료. |
| v7.0.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

`Intl.v8BreakIterator`는 비표준 확장이었으며 제거되었습니다. [`Intl.Segmenter`](https://github.com/tc39/proposal-intl-segmenter)를 참조하세요.

### DEP0018: 처리되지 않은 프로미스 거부 {#dep0018-unhandled-promise-rejections}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | 수명 종료. |
| v7.0.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

처리되지 않은 프로미스 거부는 더 이상 사용되지 않습니다. 기본적으로 처리되지 않은 프로미스 거부는 0이 아닌 종료 코드로 Node.js 프로세스를 종료합니다. Node.js가 처리되지 않은 거부를 처리하는 방식을 변경하려면 [`--unhandled-rejections`](/ko/nodejs/api/cli#--unhandled-rejectionsmode) 명령줄 옵션을 사용하십시오.

### DEP0019: 디렉터리 외부에서 확인된 `require('.')` {#dep0019-require-resolved-outside-directory}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.0.0 | 제거된 기능. |
| v6.12.0, v4.8.6 | 더 이상 사용되지 않는 코드 할당됨. |
| v1.8.1 | 런타임 지원 중단. |
:::

유형: 수명 종료

특정 경우에 `require('.')`는 패키지 디렉터리 외부에서 확인할 수 있습니다. 이 동작은 제거되었습니다.

### DEP0020: `Server.connections` {#dep0020-serverconnections}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | Server.connections가 제거되었습니다. |
| v6.12.0, v4.8.6 | 더 이상 사용되지 않는 코드 할당됨. |
| v0.9.7 | 런타임 지원 중단. |
:::

유형: 수명 종료

`Server.connections` 속성은 Node.js v0.9.7에서 더 이상 사용되지 않으며 제거되었습니다. 대신 [`Server.getConnections()`](/ko/nodejs/api/net#servergetconnectionscallback) 메서드를 사용하십시오.

### DEP0021: `Server.listenFD` {#dep0021-serverlistenfd}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.0.0 | 수명 종료. |
| v6.12.0, v4.8.6 | 더 이상 사용되지 않는 코드 할당됨. |
| v0.7.12 | 런타임 지원 중단. |
:::

유형: 수명 종료

`Server.listenFD()` 메서드는 더 이상 사용되지 않으며 제거되었습니다. 대신 [`Server.listen({fd: \<number\>})`](/ko/nodejs/api/net#serverlistenhandle-backlog-callback)를 사용하십시오.


### DEP0022: `os.tmpDir()` {#dep0022-ostmpdir}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.0.0 | 수명 종료. |
| v7.0.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

`os.tmpDir()` API는 Node.js 7.0.0에서 지원 중단되었으며 이후 제거되었습니다. 대신 [`os.tmpdir()`](/ko/nodejs/api/os#ostmpdir)을 사용하세요.

### DEP0023: `os.getNetworkInterfaces()` {#dep0023-osgetnetworkinterfaces}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.0.0 | 수명 종료. |
| v6.12.0, v4.8.6 | 지원 중단 코드가 할당되었습니다. |
| v0.6.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

`os.getNetworkInterfaces()` 메서드는 지원 중단되었습니다. 대신 [`os.networkInterfaces()`](/ko/nodejs/api/os#osnetworkinterfaces) 메서드를 사용하세요.

### DEP0024: `REPLServer.prototype.convertToContext()` {#dep0024-replserverprototypeconverttocontext}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v9.0.0 | 수명 종료. |
| v7.0.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

`REPLServer.prototype.convertToContext()` API가 제거되었습니다.

### DEP0025: `require('node:sys')` {#dep0025-requirenodesys}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v6.12.0, v4.8.6 | 지원 중단 코드가 할당되었습니다. |
| v1.0.0 | 런타임 지원 중단. |
:::

유형: 런타임

`node:sys` 모듈은 지원 중단되었습니다. 대신 [`util`](/ko/nodejs/api/util) 모듈을 사용하세요.

### DEP0026: `util.print()` {#dep0026-utilprint}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.0.0 | 수명 종료. |
| v6.12.0, v4.8.6 | 지원 중단 코드가 할당되었습니다. |
| v0.11.3 | 런타임 지원 중단. |
:::

유형: 수명 종료

`util.print()`가 제거되었습니다. 대신 [`console.log()`](/ko/nodejs/api/console#consolelogdata-args)를 사용하세요.

### DEP0027: `util.puts()` {#dep0027-utilputs}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.0.0 | 수명 종료. |
| v6.12.0, v4.8.6 | 지원 중단 코드가 할당되었습니다. |
| v0.11.3 | 런타임 지원 중단. |
:::

유형: 수명 종료

`util.puts()`가 제거되었습니다. 대신 [`console.log()`](/ko/nodejs/api/console#consolelogdata-args)를 사용하세요.

### DEP0028: `util.debug()` {#dep0028-utildebug}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.0.0 | 수명 종료. |
| v6.12.0, v4.8.6 | 지원 중단 코드가 할당되었습니다. |
| v0.11.3 | 런타임 지원 중단. |
:::

유형: 수명 종료

`util.debug()`가 제거되었습니다. 대신 [`console.error()`](/ko/nodejs/api/console#consoleerrordata-args)를 사용하세요.


### DEP0029: `util.error()` {#dep0029-utilerror}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.0.0 | 수명 종료. |
| v6.12.0, v4.8.6 | 폐기 코드가 할당되었습니다. |
| v0.11.3 | 런타임 폐기. |
:::

유형: 수명 종료

`util.error()`가 제거되었습니다. [`console.error()`](/ko/nodejs/api/console#consoleerrordata-args)를 대신 사용하세요.

### DEP0030: `SlowBuffer` {#dep0030-slowbuffer}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v6.12.0 | 폐기 코드가 할당되었습니다. |
| v6.0.0 | 문서 전용 폐기. |
:::

유형: 문서 전용

[`SlowBuffer`](/ko/nodejs/api/buffer#class-slowbuffer) 클래스는 폐기되었습니다. [`Buffer.allocUnsafeSlow(size)`](/ko/nodejs/api/buffer#static-method-bufferallocunsafeslowsize)를 대신 사용하세요.

### DEP0031: `ecdh.setPublicKey()` {#dep0031-ecdhsetpublickey}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v6.12.0 | 폐기 코드가 할당되었습니다. |
| v5.2.0 | 문서 전용 폐기. |
:::

유형: 문서 전용

[`ecdh.setPublicKey()`](/ko/nodejs/api/crypto#ecdhsetpublickeypublickey-encoding) 메서드는 API에 포함하는 것이 유용하지 않으므로 이제 폐기되었습니다.

### DEP0032: `node:domain` 모듈 {#dep0032-nodedomain-module}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v6.12.0, v4.8.6 | 폐기 코드가 할당되었습니다. |
| v1.4.2 | 문서 전용 폐기. |
:::

유형: 문서 전용

[`domain`](/ko/nodejs/api/domain) 모듈은 폐기되었으므로 사용하지 않아야 합니다.

### DEP0033: `EventEmitter.listenerCount()` {#dep0033-eventemitterlistenercount}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v6.12.0, v4.8.6 | 폐기 코드가 할당되었습니다. |
| v3.2.0 | 문서 전용 폐기. |
:::

유형: 문서 전용

[`events.listenerCount(emitter, eventName)`](/ko/nodejs/api/events#eventslistenercountemitter-eventname) API는 폐기되었습니다. [`emitter.listenerCount(eventName)`](/ko/nodejs/api/events#emitterlistenercounteventname-listener)를 대신 사용하세요.

### DEP0034: `fs.exists(path, callback)` {#dep0034-fsexistspath-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v6.12.0, v4.8.6 | 폐기 코드가 할당되었습니다. |
| v1.0.0 | 문서 전용 폐기. |
:::

유형: 문서 전용

[`fs.exists(path, callback)`](/ko/nodejs/api/fs#fsexistspath-callback) API는 폐기되었습니다. [`fs.stat()`](/ko/nodejs/api/fs#fsstatpath-options-callback) 또는 [`fs.access()`](/ko/nodejs/api/fs#fsaccesspath-mode-callback)를 대신 사용하세요.


### DEP0035: `fs.lchmod(path, mode, callback)` {#dep0035-fslchmodpath-mode-callback}

::: info [기록]
| 버전 | 변경사항 |
| --- | --- |
| v6.12.0, v4.8.6 | 더 이상 사용되지 않음 코드가 할당되었습니다. |
| v0.4.7 | 문서 전용 더 이상 사용되지 않음. |
:::

유형: 문서 전용

[`fs.lchmod(path, mode, callback)`](/ko/nodejs/api/fs#fslchmodpath-mode-callback) API는 더 이상 사용되지 않습니다.

### DEP0036: `fs.lchmodSync(path, mode)` {#dep0036-fslchmodsyncpath-mode}

::: info [기록]
| 버전 | 변경사항 |
| --- | --- |
| v6.12.0, v4.8.6 | 더 이상 사용되지 않음 코드가 할당되었습니다. |
| v0.4.7 | 문서 전용 더 이상 사용되지 않음. |
:::

유형: 문서 전용

[`fs.lchmodSync(path, mode)`](/ko/nodejs/api/fs#fslchmodsyncpath-mode) API는 더 이상 사용되지 않습니다.

### DEP0037: `fs.lchown(path, uid, gid, callback)` {#dep0037-fslchownpath-uid-gid-callback}

::: info [기록]
| 버전 | 변경사항 |
| --- | --- |
| v10.6.0 | 더 이상 사용되지 않음이 취소되었습니다. |
| v6.12.0, v4.8.6 | 더 이상 사용되지 않음 코드가 할당되었습니다. |
| v0.4.7 | 문서 전용 더 이상 사용되지 않음. |
:::

유형: 더 이상 사용되지 않음이 취소됨

[`fs.lchown(path, uid, gid, callback)`](/ko/nodejs/api/fs#fslchownpath-uid-gid-callback) API는 더 이상 사용되지 않았습니다. 필수 지원 API가 libuv에 추가되었기 때문에 더 이상 사용되지 않음이 취소되었습니다.

### DEP0038: `fs.lchownSync(path, uid, gid)` {#dep0038-fslchownsyncpath-uid-gid}

::: info [기록]
| 버전 | 변경사항 |
| --- | --- |
| v10.6.0 | 더 이상 사용되지 않음이 취소되었습니다. |
| v6.12.0, v4.8.6 | 더 이상 사용되지 않음 코드가 할당되었습니다. |
| v0.4.7 | 문서 전용 더 이상 사용되지 않음. |
:::

유형: 더 이상 사용되지 않음이 취소됨

[`fs.lchownSync(path, uid, gid)`](/ko/nodejs/api/fs#fslchownsyncpath-uid-gid) API는 더 이상 사용되지 않았습니다. 필수 지원 API가 libuv에 추가되었기 때문에 더 이상 사용되지 않음이 취소되었습니다.

### DEP0039: `require.extensions` {#dep0039-requireextensions}

::: info [기록]
| 버전 | 변경사항 |
| --- | --- |
| v6.12.0, v4.8.6 | 더 이상 사용되지 않음 코드가 할당되었습니다. |
| v0.10.6 | 문서 전용 더 이상 사용되지 않음. |
:::

유형: 문서 전용

[`require.extensions`](/ko/nodejs/api/modules#requireextensions) 속성은 더 이상 사용되지 않습니다.

### DEP0040: `node:punycode` 모듈 {#dep0040-nodepunycode-module}

::: info [기록]
| 버전 | 변경사항 |
| --- | --- |
| v21.0.0 | 런타임 사용 중단. |
| v16.6.0 | `--pending-deprecation`에 대한 지원이 추가되었습니다. |
| v7.0.0 | 문서 전용 더 이상 사용되지 않음. |
:::

유형: 런타임

[`punycode`](/ko/nodejs/api/punycode) 모듈은 더 이상 사용되지 않습니다. 대신 사용자 공간 대안을 사용하십시오.


### DEP0041: `NODE_REPL_HISTORY_FILE` 환경 변수 {#dep0041-node_repl_history_file-environment-variable}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 수명 종료. |
| v6.12.0, v4.8.6 | 더 이상 사용되지 않는 코드 할당됨. |
| v3.0.0 | 문서 전용으로 더 이상 사용되지 않음. |
:::

유형: 수명 종료

`NODE_REPL_HISTORY_FILE` 환경 변수가 제거되었습니다. 대신 `NODE_REPL_HISTORY`를 사용하십시오.

### DEP0042: `tls.CryptoStream` {#dep0042-tlscryptostream}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 수명 종료. |
| v6.12.0, v4.8.6 | 더 이상 사용되지 않는 코드 할당됨. |
| v0.11.3 | 문서 전용으로 더 이상 사용되지 않음. |
:::

유형: 수명 종료

[`tls.CryptoStream`](/ko/nodejs/api/tls#class-tlscryptostream) 클래스가 제거되었습니다. 대신 [`tls.TLSSocket`](/ko/nodejs/api/tls#class-tlstlssocket)을 사용하십시오.

### DEP0043: `tls.SecurePair` {#dep0043-tlssecurepair}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v8.0.0 | 런타임 지원 중단. |
| v6.12.0 | 더 이상 사용되지 않는 코드 할당됨. |
| v6.0.0 | 문서 전용으로 더 이상 사용되지 않음. |
| v0.11.15 | 지원 중단 취소됨. |
| v0.11.3 | 런타임 지원 중단. |
:::

유형: 문서 전용

[`tls.SecurePair`](/ko/nodejs/api/tls#class-tlssecurepair) 클래스는 더 이상 사용되지 않습니다. 대신 [`tls.TLSSocket`](/ko/nodejs/api/tls#class-tlstlssocket)을 사용하십시오.

### DEP0044: `util.isArray()` {#dep0044-utilisarray}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.0.0 | 런타임 지원 중단. |
| v6.12.0, v4.8.6 | 더 이상 사용되지 않는 코드 할당됨. |
| v4.0.0, v3.3.1 | 문서 전용으로 더 이상 사용되지 않음. |
:::

유형: 런타임

[`util.isArray()`](/ko/nodejs/api/util#utilisarrayobject) API는 더 이상 사용되지 않습니다. 대신 `Array.isArray()`를 사용하십시오.

### DEP0045: `util.isBoolean()` {#dep0045-utilisboolean}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 수명 종료 지원 중단. |
| v22.0.0 | 런타임 지원 중단. |
| v6.12.0, v4.8.6 | 더 이상 사용되지 않는 코드 할당됨. |
| v4.0.0, v3.3.1 | 문서 전용으로 더 이상 사용되지 않음. |
:::

유형: 수명 종료

`util.isBoolean()` API가 제거되었습니다. 대신 `typeof arg === 'boolean'`을 사용하십시오.

### DEP0046: `util.isBuffer()` {#dep0046-utilisbuffer}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 수명 종료 지원 중단. |
| v22.0.0 | 런타임 지원 중단. |
| v6.12.0, v4.8.6 | 더 이상 사용되지 않는 코드 할당됨. |
| v4.0.0, v3.3.1 | 문서 전용으로 더 이상 사용되지 않음. |
:::

유형: 수명 종료

`util.isBuffer()` API가 제거되었습니다. 대신 [`Buffer.isBuffer()`](/ko/nodejs/api/buffer#static-method-bufferisbufferobj)를 사용하십시오.


### DEP0047: `util.isDate()` {#dep0047-utilisdate}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 수명 종료(End-of-Life) 지원 중단. |
| v22.0.0 | 런타임 지원 중단. |
| v6.12.0, v4.8.6 | 지원 중단 코드가 할당되었습니다. |
| v4.0.0, v3.3.1 | 문서 전용 지원 중단. |
:::

유형: 수명 종료

`util.isDate()` API가 제거되었습니다. 대신 `arg instanceof Date`를 사용하십시오.

### DEP0048: `util.isError()` {#dep0048-utiliserror}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 수명 종료(End-of-Life) 지원 중단. |
| v22.0.0 | 런타임 지원 중단. |
| v6.12.0, v4.8.6 | 지원 중단 코드가 할당되었습니다. |
| v4.0.0, v3.3.1 | 문서 전용 지원 중단. |
:::

유형: 수명 종료

`util.isError()` API가 제거되었습니다. 대신 `Object.prototype.toString(arg) === '[object Error]' || arg instanceof Error`를 사용하십시오.

### DEP0049: `util.isFunction()` {#dep0049-utilisfunction}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 수명 종료(End-of-Life) 지원 중단. |
| v22.0.0 | 런타임 지원 중단. |
| v6.12.0, v4.8.6 | 지원 중단 코드가 할당되었습니다. |
| v4.0.0, v3.3.1 | 문서 전용 지원 중단. |
:::

유형: 수명 종료

`util.isFunction()` API가 제거되었습니다. 대신 `typeof arg === 'function'`을 사용하십시오.

### DEP0050: `util.isNull()` {#dep0050-utilisnull}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 수명 종료(End-of-Life) 지원 중단. |
| v22.0.0 | 런타임 지원 중단. |
| v6.12.0, v4.8.6 | 지원 중단 코드가 할당되었습니다. |
| v4.0.0, v3.3.1 | 문서 전용 지원 중단. |
:::

유형: 수명 종료

`util.isNull()` API가 제거되었습니다. 대신 `arg === null`을 사용하십시오.

### DEP0051: `util.isNullOrUndefined()` {#dep0051-utilisnullorundefined}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 수명 종료(End-of-Life) 지원 중단. |
| v22.0.0 | 런타임 지원 중단. |
| v6.12.0, v4.8.6 | 지원 중단 코드가 할당되었습니다. |
| v4.0.0, v3.3.1 | 문서 전용 지원 중단. |
:::

유형: 수명 종료

`util.isNullOrUndefined()` API가 제거되었습니다. 대신 `arg === null || arg === undefined`를 사용하십시오.


### DEP0052: `util.isNumber()` {#dep0052-utilisnumber}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 수명 종료 폐기. |
| v22.0.0 | 런타임 폐기. |
| v6.12.0, v4.8.6 | 폐기 코드가 할당되었습니다. |
| v4.0.0, v3.3.1 | 문서 전용 폐기. |
:::

유형: 수명 종료

`util.isNumber()` API가 제거되었습니다. 대신 `typeof arg === 'number'`를 사용하세요.

### DEP0053: `util.isObject()` {#dep0053-utilisobject}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 수명 종료 폐기. |
| v22.0.0 | 런타임 폐기. |
| v6.12.0, v4.8.6 | 폐기 코드가 할당되었습니다. |
| v4.0.0, v3.3.1 | 문서 전용 폐기. |
:::

유형: 수명 종료

`util.isObject()` API가 제거되었습니다. 대신 `arg && typeof arg === 'object'`를 사용하세요.

### DEP0054: `util.isPrimitive()` {#dep0054-utilisprimitive}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 수명 종료 폐기. |
| v22.0.0 | 런타임 폐기. |
| v6.12.0, v4.8.6 | 폐기 코드가 할당되었습니다. |
| v4.0.0, v3.3.1 | 문서 전용 폐기. |
:::

유형: 수명 종료

`util.isPrimitive()` API가 제거되었습니다. 대신 `arg === null || (typeof arg !=='object' && typeof arg !== 'function')`를 사용하세요.

### DEP0055: `util.isRegExp()` {#dep0055-utilisregexp}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 수명 종료 폐기. |
| v22.0.0 | 런타임 폐기. |
| v6.12.0, v4.8.6 | 폐기 코드가 할당되었습니다. |
| v4.0.0, v3.3.1 | 문서 전용 폐기. |
:::

유형: 수명 종료

`util.isRegExp()` API가 제거되었습니다. 대신 `arg instanceof RegExp`를 사용하세요.

### DEP0056: `util.isString()` {#dep0056-utilisstring}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 수명 종료 폐기. |
| v22.0.0 | 런타임 폐기. |
| v6.12.0, v4.8.6 | 폐기 코드가 할당되었습니다. |
| v4.0.0, v3.3.1 | 문서 전용 폐기. |
:::

유형: 수명 종료

`util.isString()` API가 제거되었습니다. 대신 `typeof arg === 'string'`를 사용하세요.


### DEP0057: `util.isSymbol()` {#dep0057-utilissymbol}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 수명 종료 폐기. |
| v22.0.0 | 런타임 폐기. |
| v6.12.0, v4.8.6 | 폐기 코드가 할당되었습니다. |
| v4.0.0, v3.3.1 | 문서 전용 폐기. |
:::

유형: 수명 종료

`util.isSymbol()` API가 제거되었습니다. 대신 `typeof arg === 'symbol'`을 사용하십시오.

### DEP0058: `util.isUndefined()` {#dep0058-utilisundefined}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 수명 종료 폐기. |
| v22.0.0 | 런타임 폐기. |
| v6.12.0, v4.8.6 | 폐기 코드가 할당되었습니다. |
| v4.0.0, v3.3.1 | 문서 전용 폐기. |
:::

유형: 수명 종료

`util.isUndefined()` API가 제거되었습니다. 대신 `arg === undefined`를 사용하십시오.

### DEP0059: `util.log()` {#dep0059-utillog}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 수명 종료 폐기. |
| v22.0.0 | 런타임 폐기. |
| v6.12.0 | 폐기 코드가 할당되었습니다. |
| v6.0.0 | 문서 전용 폐기. |
:::

유형: 수명 종료

`util.log()` API는 유지 관리되지 않는 레거시 API이며 실수로 사용자 영역에 노출되었기 때문에 제거되었습니다. 대신 특정 요구 사항에 따라 다음 대안을 고려하십시오.

-  **타사 로깅 라이브러리**
-  **<code>console.log(new Date().toLocaleString(), message)</code> 사용**

이러한 대안 중 하나를 채택함으로써 `util.log()`에서 벗어나 애플리케이션의 특정 요구 사항 및 복잡성에 맞는 로깅 전략을 선택할 수 있습니다.

### DEP0060: `util._extend()` {#dep0060-util_extend}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.0.0 | 런타임 폐기. |
| v6.12.0 | 폐기 코드가 할당되었습니다. |
| v6.0.0 | 문서 전용 폐기. |
:::

유형: 런타임

[`util._extend()`](/ko/nodejs/api/util#util_extendtarget-source) API는 유지 관리되지 않는 레거시 API이며 실수로 사용자 영역에 노출되었기 때문에 폐기되었습니다. 대신 `target = Object.assign(target, source)`를 사용하십시오.


### DEP0061: `fs.SyncWriteStream` {#dep0061-fssyncwritestream}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v11.0.0 | 수명 종료. |
| v8.0.0 | 런타임 사용 중단. |
| v7.0.0 | 문서 전용 사용 중단. |
:::

유형: 수명 종료

`fs.SyncWriteStream` 클래스는 공개적으로 접근 가능한 API로 의도된 적이 없으며 제거되었습니다. 대체 API는 사용할 수 없습니다. 사용자 공간 대안을 사용하십시오.

### DEP0062: `node --debug` {#dep0062-node---debug}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.0.0 | 수명 종료. |
| v8.0.0 | 런타임 사용 중단. |
:::

유형: 수명 종료

`--debug`는 레거시 V8 디버거 인터페이스를 활성화하며, 이는 V8 5.8부터 제거되었습니다. 대신 `--inspect`로 활성화되는 Inspector로 대체됩니다.

### DEP0063: `ServerResponse.prototype.writeHeader()` {#dep0063-serverresponseprototypewriteheader}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v8.0.0 | 문서 전용 사용 중단. |
:::

유형: 문서 전용

`node:http` 모듈 `ServerResponse.prototype.writeHeader()` API는 사용 중단되었습니다. 대신 `ServerResponse.prototype.writeHead()`를 사용하십시오.

`ServerResponse.prototype.writeHeader()` 메서드는 공식적으로 지원되는 API로 문서화된 적이 없습니다.

### DEP0064: `tls.createSecurePair()` {#dep0064-tlscreatesecurepair}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v8.0.0 | 런타임 사용 중단. |
| v6.12.0 | 사용 중단 코드가 할당되었습니다. |
| v6.0.0 | 문서 전용 사용 중단. |
| v0.11.15 | 사용 중단 취소. |
| v0.11.3 | 런타임 사용 중단. |
:::

유형: 런타임

`tls.createSecurePair()` API는 Node.js 0.11.3에서 문서에서 사용 중단되었습니다. 사용자는 대신 `tls.Socket`을 사용해야 합니다.

### DEP0065: `repl.REPL_MODE_MAGIC` 및 `NODE_REPL_MODE=magic` {#dep0065-replrepl_mode_magic-and-node_repl_mode=magic}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 수명 종료. |
| v8.0.0 | 문서 전용 사용 중단. |
:::

유형: 수명 종료

`node:repl` 모듈의 `replMode` 옵션에 사용되는 `REPL_MODE_MAGIC` 상수가 제거되었습니다. V8 5.0이 가져온 Node.js 6.0.0 이후로 해당 동작은 `REPL_MODE_SLOPPY`와 기능적으로 동일했습니다. 대신 `REPL_MODE_SLOPPY`를 사용하십시오.

`NODE_REPL_MODE` 환경 변수는 대화형 `node` 세션의 기본 `replMode`를 설정하는 데 사용됩니다. 해당 값 `magic`도 제거되었습니다. 대신 `sloppy`를 사용하십시오.


### DEP0066: `OutgoingMessage.prototype._headers, OutgoingMessage.prototype._headerNames` {#dep0066-outgoingmessageprototype_headers-outgoingmessageprototype_headernames}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.0.0 | 런타임 지원 중단. |
| v8.0.0 | 문서 전용 지원 중단. |
:::

유형: 런타임

`node:http` 모듈 `OutgoingMessage.prototype._headers` 및 `OutgoingMessage.prototype._headerNames` 속성은 지원 중단되었습니다. 발신 헤더를 작업하려면 공개 메서드 중 하나(`OutgoingMessage.prototype.getHeader()`, `OutgoingMessage.prototype.getHeaders()`, `OutgoingMessage.prototype.getHeaderNames()`, `OutgoingMessage.prototype.getRawHeaderNames()`, `OutgoingMessage.prototype.hasHeader()`, `OutgoingMessage.prototype.removeHeader()`, `OutgoingMessage.prototype.setHeader()`)를 사용하십시오.

`OutgoingMessage.prototype._headers` 및 `OutgoingMessage.prototype._headerNames` 속성은 공식적으로 지원되는 속성으로 문서화된 적이 없습니다.

### DEP0067: `OutgoingMessage.prototype._renderHeaders` {#dep0067-outgoingmessageprototype_renderheaders}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v8.0.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용

`node:http` 모듈 `OutgoingMessage.prototype._renderHeaders()` API는 지원 중단되었습니다.

`OutgoingMessage.prototype._renderHeaders` 속성은 공식적으로 지원되는 API로 문서화된 적이 없습니다.

### DEP0068: `node debug` {#dep0068-node-debug}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | 레거시 `node debug` 명령이 제거되었습니다. |
| v8.0.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

`node debug`는 `node inspect`를 통해 사용할 수 있는 V8-inspector 기반 CLI 디버거로 대체된 레거시 CLI 디버거에 해당합니다.

### DEP0069: `vm.runInDebugContext(string)` {#dep0069-vmrunindebugcontextstring}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 수명 종료. |
| v9.0.0 | 런타임 지원 중단. |
| v8.0.0 | 문서 전용 지원 중단. |
:::

유형: 수명 종료

DebugContext는 V8에서 제거되었으며 Node.js 10+에서는 사용할 수 없습니다.

DebugContext는 실험적 API였습니다.

### DEP0070: `async_hooks.currentId()` {#dep0070-async_hookscurrentid}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v9.0.0 | 수명 종료. |
| v8.2.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

`async_hooks.currentId()`는 명확성을 위해 `async_hooks.executionAsyncId()`로 이름이 변경되었습니다.

이 변경 사항은 `async_hooks`가 실험적 API인 동안 이루어졌습니다.


### DEP0071: `async_hooks.triggerId()` {#dep0071-async_hookstriggerid}

::: info [내역]
| 버전 | 변경 사항 |
|---|---|
| v9.0.0 | 지원 종료. |
| v8.2.0 | 런타임 지원 중단. |
:::

유형: 지원 종료

`async_hooks.triggerId()`는 명확성을 위해 `async_hooks.triggerAsyncId()`로 이름이 변경되었습니다.

이 변경은 `async_hooks`가 실험적 API였을 때 이루어졌습니다.

### DEP0072: `async_hooks.AsyncResource.triggerId()` {#dep0072-async_hooksasyncresourcetriggerid}

::: info [내역]
| 버전 | 변경 사항 |
|---|---|
| v9.0.0 | 지원 종료. |
| v8.2.0 | 런타임 지원 중단. |
:::

유형: 지원 종료

`async_hooks.AsyncResource.triggerId()`는 명확성을 위해 `async_hooks.AsyncResource.triggerAsyncId()`로 이름이 변경되었습니다.

이 변경은 `async_hooks`가 실험적 API였을 때 이루어졌습니다.

### DEP0073: `net.Server`의 여러 내부 속성 {#dep0073-several-internal-properties-of-netserver}

::: info [내역]
| 버전 | 변경 사항 |
|---|---|
| v10.0.0 | 지원 종료. |
| v9.0.0 | 런타임 지원 중단. |
:::

유형: 지원 종료

부적절한 이름을 가진 `net.Server` 인스턴스의 여러 내부 문서화되지 않은 속성에 접근하는 것은 더 이상 사용되지 않습니다.

원래 API는 문서화되지 않았고 일반적으로 내부 코드가 아닌 코드에는 유용하지 않았으므로 대체 API는 제공되지 않습니다.

### DEP0074: `REPLServer.bufferedCommand` {#dep0074-replserverbufferedcommand}

::: info [내역]
| 버전 | 변경 사항 |
|---|---|
| v15.0.0 | 지원 종료. |
| v9.0.0 | 런타임 지원 중단. |
:::

유형: 지원 종료

`REPLServer.bufferedCommand` 속성은 [`REPLServer.clearBufferedCommand()`](/ko/nodejs/api/repl#replserverclearbufferedcommand)를 대신하여 더 이상 사용되지 않습니다.

### DEP0075: `REPLServer.parseREPLKeyword()` {#dep0075-replserverparsereplkeyword}

::: info [내역]
| 버전 | 변경 사항 |
|---|---|
| v15.0.0 | 지원 종료. |
| v9.0.0 | 런타임 지원 중단. |
:::

유형: 지원 종료

`REPLServer.parseREPLKeyword()`는 사용자 랜드 가시성에서 제거되었습니다.

### DEP0076: `tls.parseCertString()` {#dep0076-tlsparsecertstring}

::: info [내역]
| 버전 | 변경 사항 |
|---|---|
| v18.0.0 | 지원 종료. |
| v9.0.0 | 런타임 지원 중단. |
| v8.6.0 | 문서 전용 지원 중단. |
:::

유형: 지원 종료

`tls.parseCertString()`은 실수로 공개된 간단한 구문 분석 도우미였습니다. 인증서 제목 및 발급자 문자열을 구문 분석해야 했지만 다중 값 상대 고유 이름을 올바르게 처리하지 못했습니다.

이 문서의 이전 버전에서는 `tls.parseCertString()`의 대안으로 `querystring.parse()`를 사용할 것을 제안했습니다. 그러나 `querystring.parse()`도 모든 인증서 제목을 올바르게 처리하지 못하므로 사용해서는 안 됩니다.


### DEP0077: `Module._debug()` {#dep0077-module_debug}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v9.0.0 | 런타임 지원 중단. |
:::

유형: 런타임

`Module._debug()`은(는) 더 이상 사용되지 않습니다.

`Module._debug()` 함수는 공식적으로 지원되는 API로 문서화된 적이 없습니다.

### DEP0078: `REPLServer.turnOffEditorMode()` {#dep0078-replserverturnoffeditormode}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | 수명 종료. |
| v9.0.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

`REPLServer.turnOffEditorMode()`은(는) 사용자 영역 가시성에서 제거되었습니다.

### DEP0079: `.inspect()`을(를) 통해 객체에 대한 사용자 지정 검사 함수 {#dep0079-custom-inspection-function-on-objects-via-inspect}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v11.0.0 | 수명 종료. |
| v10.0.0 | 런타임 지원 중단. |
| v8.7.0 | 문서 전용 지원 중단. |
:::

유형: 수명 종료

객체에서 `inspect`라는 속성을 사용하여 [`util.inspect()`](/ko/nodejs/api/util#utilinspectobject-options)에 대한 사용자 지정 검사 함수를 지정하는 것은 더 이상 사용되지 않습니다. 대신 [`util.inspect.custom`](/ko/nodejs/api/util#utilinspectcustom)을(를) 사용하십시오. 버전 6.4.0 이전의 Node.js와의 이전 버전과의 호환성을 위해 둘 다 지정할 수 있습니다.

### DEP0080: `path._makeLong()` {#dep0080-path_makelong}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v9.0.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용

내부 `path._makeLong()`은(는) 공용으로 사용하기 위한 것이 아닙니다. 그러나 사용자 영역 모듈은 유용하다고 생각했습니다. 내부 API는 더 이상 사용되지 않으며 동일한 공용 `path.toNamespacedPath()` 메서드로 대체되었습니다.

### DEP0081: 파일 설명자를 사용하는 `fs.truncate()` {#dep0081-fstruncate-using-a-file-descriptor}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v9.0.0 | 런타임 지원 중단. |
:::

유형: 런타임

파일 설명자와 함께 `fs.truncate()` `fs.truncateSync()`를 사용하는 것은 더 이상 사용되지 않습니다. 파일 설명자로 작업하려면 `fs.ftruncate()` 또는 `fs.ftruncateSync()`를 사용하십시오.

### DEP0082: `REPLServer.prototype.memory()` {#dep0082-replserverprototypememory}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | 수명 종료. |
| v9.0.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

`REPLServer.prototype.memory()`는 `REPLServer` 자체의 내부 메커니즘에만 필요합니다. 이 함수를 사용하지 마십시오.


### DEP0083: `ecdhCurve`를 `false`로 설정하여 ECDH 비활성화 {#dep0083-disabling-ecdh-by-setting-ecdhcurve-to-false}


::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v10.0.0 | 수명 종료. |
| v9.2.0 | 런타임 지원 중단. |
:::

유형: 수명 종료.

`tls.createSecureContext()` 및 `tls.TLSSocket`에 대한 `ecdhCurve` 옵션을 `false`로 설정하여 서버에서만 ECDH를 완전히 비활성화할 수 있었습니다. 이 모드는 OpenSSL 1.1.0으로 마이그레이션하고 클라이언트와의 일관성을 유지하기 위해 더 이상 사용되지 않으며 현재는 지원되지 않습니다. 대신 `ciphers` 매개변수를 사용하십시오.

### DEP0084: 번들 내부 종속성 필요 {#dep0084-requiring-bundled-internal-dependencies}


::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v12.0.0 | 이 기능이 제거되었습니다. |
| v10.0.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

Node.js 버전 4.4.0 및 5.2.0 이후로 내부 사용만을 위한 여러 모듈이 실수로 `require()`를 통해 사용자 코드에 노출되었습니다. 이러한 모듈은 다음과 같습니다.

- `v8/tools/codemap`
- `v8/tools/consarray`
- `v8/tools/csvparser`
- `v8/tools/logreader`
- `v8/tools/profile_view`
- `v8/tools/profile`
- `v8/tools/SourceMap`
- `v8/tools/splaytree`
- `v8/tools/tickprocessor-driver`
- `v8/tools/tickprocessor`
- `node-inspect/lib/_inspect` (7.6.0부터)
- `node-inspect/lib/internal/inspect_client` (7.6.0부터)
- `node-inspect/lib/internal/inspect_repl` (7.6.0부터)

`v8/*` 모듈은 내보내기가 없으며 특정 순서로 가져오지 않으면 실제로 오류가 발생합니다. 따라서 `require()`를 통해 가져오는 합법적인 사용 사례는 거의 없습니다.

반면에 `node-inspect`는 동일한 이름으로 npm 레지스트리에 게시되므로 패키지 관리자를 통해 로컬로 설치할 수 있습니다. 이 경우 소스 코드 수정이 필요하지 않습니다.

### DEP0085: AsyncHooks 민감한 API {#dep0085-asynchooks-sensitive-api}


::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v10.0.0 | 수명 종료. |
| v9.4.0, v8.10.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

AsyncHooks 민감한 API는 문서화된 적이 없으며 여러 가지 사소한 문제가 있었습니다. 대신 `AsyncResource` API를 사용하십시오. [https://github.com/nodejs/node/issues/15572](https://github.com/nodejs/node/issues/15572)를 참조하십시오.


### DEP0086: `runInAsyncIdScope` 제거 {#dep0086-remove-runinasyncidscope}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 수명 종료. |
| v9.4.0, v8.10.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

`runInAsyncIdScope`는 `'before'` 또는 `'after'` 이벤트를 발생시키지 않으므로 많은 문제를 일으킬 수 있습니다. [https://github.com/nodejs/node/issues/14328](https://github.com/nodejs/node/issues/14328)을 참조하십시오.

### DEP0089: `require('node:assert')` {#dep0089-requirenodeassert}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.8.0 | 지원 중단 철회됨. |
| v9.9.0, v8.13.0 | 문서 전용 지원 중단. |
:::

유형: 지원 중단 철회됨

assert를 직접 가져오는 것은 노출된 함수가 느슨한 동등성 검사를 사용하기 때문에 권장되지 않았습니다. `node:assert` 모듈의 사용이 권장되지 않고 지원 중단으로 인해 개발자 혼란이 발생했기 때문에 지원 중단이 철회되었습니다.

### DEP0090: 잘못된 GCM 인증 태그 길이 {#dep0090-invalid-gcm-authentication-tag-lengths}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v11.0.0 | 수명 종료. |
| v10.0.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

Node.js는 [`decipher.setAuthTag()`](/ko/nodejs/api/crypto#deciphersetauthtagbuffer-encoding)를 호출할 때 OpenSSL에서 허용하는 모든 GCM 인증 태그 길이를 지원했습니다. Node.js v11.0.0부터는 128, 120, 112, 104, 96, 64 및 32비트의 인증 태그 길이만 허용됩니다. 다른 길이의 인증 태그는 [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf)에 따라 유효하지 않습니다.

### DEP0091: `crypto.DEFAULT_ENCODING` {#dep0091-cryptodefault_encoding}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.0.0 | 수명 종료. |
| v10.0.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

`crypto.DEFAULT_ENCODING` 속성은 버전 0.9.3 이전의 Node.js 릴리스와의 호환성을 위해서만 존재했으며 제거되었습니다.

### DEP0092: 최상위 `this`가 `module.exports`에 바인딩됨 {#dep0092-top-level-this-bound-to-moduleexports}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용

`module.exports`의 대안으로 최상위 `this`에 속성을 할당하는 것은 더 이상 사용되지 않습니다. 개발자는 대신 `exports` 또는 `module.exports`를 사용해야 합니다.


### DEP0093: `crypto.fips`가 더 이상 사용되지 않고 대체되었습니다. {#dep0093-cryptofips-is-deprecated-and-replaced}


::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 런타임 지원 중단. |
| v10.0.0 | 문서 전용 지원 중단. |
:::

유형: 런타임

[`crypto.fips`](/ko/nodejs/api/crypto#cryptofips) 속성은 더 이상 사용되지 않습니다. 대신 `crypto.setFips()` 및 `crypto.getFips()`를 사용하십시오.

### DEP0094: 둘 이상의 인수로 `assert.fail()` 사용하기 {#dep0094-using-assertfail-with-more-than-one-argument}


::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 런타임 지원 중단. |
:::

유형: 런타임

둘 이상의 인수로 `assert.fail()`을 사용하는 것은 더 이상 사용되지 않습니다. 하나의 인수만으로 `assert.fail()`을 사용하거나 다른 `node:assert` 모듈 메서드를 사용하십시오.

### DEP0095: `timers.enroll()` {#dep0095-timersenroll}


::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 런타임 지원 중단. |
:::

유형: 런타임

`timers.enroll()`은 더 이상 사용되지 않습니다. 대신 공개적으로 문서화된 [`setTimeout()`](/ko/nodejs/api/timers#settimeoutcallback-delay-args) 또는 [`setInterval()`](/ko/nodejs/api/timers#setintervalcallback-delay-args)을 사용하십시오.

### DEP0096: `timers.unenroll()` {#dep0096-timersunenroll}


::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 런타임 지원 중단. |
:::

유형: 런타임

`timers.unenroll()`은 더 이상 사용되지 않습니다. 대신 공개적으로 문서화된 [`clearTimeout()`](/ko/nodejs/api/timers#cleartimeouttimeout) 또는 [`clearInterval()`](/ko/nodejs/api/timers#clearintervaltimeout)을 사용하십시오.

### DEP0097: `domain` 속성을 가진 `MakeCallback` {#dep0097-makecallback-with-domain-property}


::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 런타임 지원 중단. |
:::

유형: 런타임

컨텍스트를 전달하기 위해 `domain` 속성을 추가하는 `MakeCallback` 사용자는 `MakeCallback` 또는 `CallbackScope`의 `async_context` 변형 또는 상위 레벨 `AsyncResource` 클래스를 사용하기 시작해야 합니다.

### DEP0098: AsyncHooks 임베더 `AsyncResource.emitBefore` 및 `AsyncResource.emitAfter` API {#dep0098-asynchooks-embedder-asyncresourceemitbefore-and-asyncresourceemitafter-apis}


::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v12.0.0 | 수명 종료. |
| v10.0.0, v9.6.0, v8.12.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

AsyncHooks에서 제공하는 임베디드 API는 오용하기 매우 쉬운 `.emitBefore()` 및 `.emitAfter()` 메서드를 노출하여 복구 불가능한 오류를 초래할 수 있습니다.

훨씬 더 안전하고 편리한 대안을 제공하는 [`asyncResource.runInAsyncScope()`](/ko/nodejs/api/async_context#asyncresourceruninasyncscopefn-thisarg-args) API를 대신 사용하십시오. [https://github.com/nodejs/node/pull/18513](https://github.com/nodejs/node/pull/18513)을 참조하십시오.


### DEP0099: 비동기 컨텍스트를 인식하지 않는 `node::MakeCallback` C++ API {#dep0099-async-context-unaware-nodemakecallback-c-apis}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 컴파일 시간 지원 중단. |
:::

유형: 컴파일 시간

네이티브 애드온에서 사용할 수 있는 특정 버전의 `node::MakeCallback` API는 지원 중단되었습니다. `async_context` 매개변수를 사용하는 API 버전을 사용하세요.

### DEP0100: `process.assert()` {#dep0100-processassert}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 수명 종료. |
| v10.0.0 | 런타임 지원 중단. |
| v0.3.7 | 문서 전용 지원 중단. |
:::

유형: 수명 종료

`process.assert()`는 지원 중단되었습니다. [`assert`](/ko/nodejs/api/assert) 모듈을 대신 사용하세요.

이것은 문서화된 기능이 아니었습니다.

### DEP0101: `--with-lttng` {#dep0101---with-lttng}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 수명 종료. |
:::

유형: 수명 종료

`--with-lttng` 컴파일 시간 옵션이 제거되었습니다.

### DEP0102: `Buffer#(read|write)` 작업에서 `noAssert` 사용 {#dep0102-using-noassert-in-bufferread|write-operations}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 수명 종료. |
:::

유형: 수명 종료

`noAssert` 인수를 사용하는 것은 더 이상 아무런 기능이 없습니다. `noAssert` 값에 관계없이 모든 입력이 확인됩니다. 확인을 건너뛰면 찾기 어려운 오류와 충돌이 발생할 수 있습니다.

### DEP0103: `process.binding('util').is[...]` 타입 검사 {#dep0103-processbindingutilis-typechecks}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.9.0 | [DEP0111](/ko/nodejs/api/deprecations#DEP0111)에 의해 대체됨. |
| v10.0.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용 ([`--pending-deprecation`](/ko/nodejs/api/cli#--pending-deprecation) 지원)

일반적으로 `process.binding()`을 사용하는 것은 피해야 합니다. 특히 타입 검사 메서드는 [`util.types`](/ko/nodejs/api/util#utiltypes)를 사용하여 대체할 수 있습니다.

이 지원 중단은 `process.binding()` API 지원 중단([DEP0111](/ko/nodejs/api/deprecations#DEP0111))으로 대체되었습니다.

### DEP0104: `process.env` 문자열 강제 변환 {#dep0104-processenv-string-coercion}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용 ([`--pending-deprecation`](/ko/nodejs/api/cli#--pending-deprecation) 지원)

문자열이 아닌 속성을 [`process.env`](/ko/nodejs/api/process#processenv)에 할당할 때 할당된 값은 암시적으로 문자열로 변환됩니다. 할당된 값이 문자열, 부울 또는 숫자가 아닌 경우 이 동작은 지원 중단됩니다. 앞으로 이러한 할당은 오류를 발생시킬 수 있습니다. 속성을 `process.env`에 할당하기 전에 문자열로 변환하세요.


### DEP0105: `decipher.finaltol` {#dep0105-decipherfinaltol}

::: info [내역]
| 버전 | 변경 사항 |
| --- | --- |
| v11.0.0 | 수명 종료. |
| v10.0.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

`decipher.finaltol()`은 문서화된 적이 없으며 [`decipher.final()`](/ko/nodejs/api/crypto#decipherfinaloutputencoding)의 별칭이었습니다. 이 API는 제거되었으며, 대신 [`decipher.final()`](/ko/nodejs/api/crypto#decipherfinaloutputencoding)을 사용하는 것이 좋습니다.

### DEP0106: `crypto.createCipher` 및 `crypto.createDecipher` {#dep0106-cryptocreatecipher-and-cryptocreatedecipher}

::: info [내역]
| 버전 | 변경 사항 |
| --- | --- |
| v22.0.0 | 수명 종료. |
| v11.0.0 | 런타임 지원 중단. |
| v10.0.0 | 문서 전용 지원 중단. |
:::

유형: 수명 종료

`crypto.createCipher()` 및 `crypto.createDecipher()`는 취약한 키 파생 함수(솔트 없는 MD5)와 정적 초기화 벡터를 사용하므로 제거되었습니다. [`crypto.pbkdf2()`](/ko/nodejs/api/crypto#cryptopbkdf2password-salt-iterations-keylen-digest-callback) 또는 [`crypto.scrypt()`](/ko/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback)를 사용하여 임의의 솔트로 키를 파생하고, [`crypto.createCipheriv()`](/ko/nodejs/api/crypto#cryptocreatecipherivalgorithm-key-iv-options) 및 [`crypto.createDecipheriv()`](/ko/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options)를 사용하여 각각 [`Cipher`](/ko/nodejs/api/crypto#class-cipher) 및 [`Decipher`](/ko/nodejs/api/crypto#class-decipher) 객체를 얻는 것이 좋습니다.

### DEP0107: `tls.convertNPNProtocols()` {#dep0107-tlsconvertnpnprotocols}

::: info [내역]
| 버전 | 변경 사항 |
| --- | --- |
| v11.0.0 | 수명 종료. |
| v10.0.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

이는 Node.js 코어 외부에서 사용할 수 없는 문서화되지 않은 헬퍼 함수였으며 NPN(다음 프로토콜 협상) 지원 제거로 인해 더 이상 사용되지 않습니다.

### DEP0108: `zlib.bytesRead` {#dep0108-zlibbytesread}

::: info [내역]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 수명 종료. |
| v11.0.0 | 런타임 지원 중단. |
| v10.0.0 | 문서 전용 지원 중단. |
:::

유형: 수명 종료

[`zlib.bytesWritten`](/ko/nodejs/api/zlib#zlibbyteswritten)의 사용되지 않는 별칭입니다. 원래 이름은 값을 엔진에서 읽은 바이트 수로 해석하는 것이 합리적이었기 때문에 선택되었지만, 이러한 이름으로 값을 노출하는 Node.js의 다른 스트림과 일치하지 않습니다.


### DEP0109: 잘못된 URL에 대한 `http`, `https`, `tls` 지원 {#dep0109-http-https-and-tls-support-for-invalid-urls}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.0.0 | 수명 종료. |
| v11.0.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

일부 이전에 지원되었지만 엄밀히 말해 유효하지 않은 URL은 레거시 `url.parse()` API에서 허용되었기 때문에 [`http.request()`](/ko/nodejs/api/http#httprequestoptions-callback), [`http.get()`](/ko/nodejs/api/http#httpgetoptions-callback), [`https.request()`](/ko/nodejs/api/https#httpsrequestoptions-callback), [`https.get()`](/ko/nodejs/api/https#httpsgetoptions-callback) 및 [`tls.checkServerIdentity()`](/ko/nodejs/api/tls#tlscheckserveridentityhostname-cert) API를 통해 허용되었습니다. 언급된 API는 이제 엄격하게 유효한 URL을 요구하는 WHATWG URL 파서를 사용합니다. 유효하지 않은 URL을 전달하는 것은 더 이상 사용되지 않으며 향후 지원이 제거될 것입니다.

### DEP0110: `vm.Script` 캐시된 데이터 {#dep0110-vmscript-cached-data}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.6.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용

`produceCachedData` 옵션은 더 이상 사용되지 않습니다. 대신 [`script.createCachedData()`](/ko/nodejs/api/vm#scriptcreatecacheddata)를 사용하세요.

### DEP0111: `process.binding()` {#dep0111-processbinding}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v11.12.0 | `--pending-deprecation` 지원 추가. |
| v10.9.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용 ([`--pending-deprecation`](/ko/nodejs/api/cli#--pending-deprecation) 지원)

`process.binding()`은 Node.js 내부 코드 전용입니다.

`process.binding()`은 일반적으로 수명 종료 상태에 도달하지 않았지만 [권한 모델](/ko/nodejs/api/permissions#permission-model)이 활성화된 경우에는 사용할 수 없습니다.

### DEP0112: `dgram` 비공개 API {#dep0112-dgram-private-apis}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v11.0.0 | 런타임 지원 중단. |
:::

유형: 런타임

`node:dgram` 모듈에는 이전에 Node.js 코어 외부에서 액세스할 수 없는 여러 API가 포함되어 있었습니다. `Socket.prototype._handle`, `Socket.prototype._receiving`, `Socket.prototype._bindState`, `Socket.prototype._queue`, `Socket.prototype._reuseAddr`, `Socket.prototype._healthCheck()`, `Socket.prototype._stopReceiving()` 및 `dgram._createSocketHandle()`.


### DEP0113: `Cipher.setAuthTag()`, `Decipher.getAuthTag()` {#dep0113-ciphersetauthtag-deciphergetauthtag}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.0.0 | 수명 종료. |
| v11.0.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

`Cipher.setAuthTag()` 및 `Decipher.getAuthTag()`는 더 이상 사용할 수 없습니다. 문서화된 적이 없으며 호출 시 오류가 발생합니다.

### DEP0114: `crypto._toBuf()` {#dep0114-crypto_tobuf}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.0.0 | 수명 종료. |
| v11.0.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

`crypto._toBuf()` 함수는 Node.js 코어 외부의 모듈에서 사용하도록 설계되지 않았으며 제거되었습니다.

### DEP0115: `crypto.prng()`, `crypto.pseudoRandomBytes()`, `crypto.rng()` {#dep0115-cryptoprng-cryptopseudorandombytes-cryptorng}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v11.0.0 | `--pending-deprecation` 지원으로 문서 전용 지원 중단이 추가되었습니다. |
:::

유형: 문서 전용 ([`--pending-deprecation`](/ko/nodejs/api/cli#--pending-deprecation) 지원)

최신 버전의 Node.js에서는 [`crypto.randomBytes()`](/ko/nodejs/api/crypto#cryptorandombytessize-callback)와 `crypto.pseudoRandomBytes()` 사이에 차이가 없습니다. 후자는 문서화되지 않은 별칭인 `crypto.prng()` 및 `crypto.rng()`와 함께 [`crypto.randomBytes()`](/ko/nodejs/api/crypto#cryptorandombytessize-callback)를 대신하여 더 이상 사용되지 않으며 향후 릴리스에서 제거될 수 있습니다.

### DEP0116: 레거시 URL API {#dep0116-legacy-url-api}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0, v18.13.0 | `url.parse()`가 DEP0169에서 다시 지원 중단됩니다. |
| v15.13.0, v14.17.0 | 지원 중단 취소됨. 상태가 "레거시"로 변경되었습니다. |
| v11.0.0 | 문서 전용 지원 중단. |
:::

유형: 지원 중단 취소됨

[레거시 URL API](/ko/nodejs/api/url#legacy-url-api)는 더 이상 사용되지 않습니다. 여기에는 [`url.format()`](/ko/nodejs/api/url#urlformaturlobject), [`url.parse()`](/ko/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost), [`url.resolve()`](/ko/nodejs/api/url#urlresolvefrom-to) 및 [레거시 `urlObject`](/ko/nodejs/api/url#legacy-urlobject)가 포함됩니다. 대신 [WHATWG URL API](/ko/nodejs/api/url#the-whatwg-url-api)를 사용하십시오.


### DEP0117: 네이티브 암호화 핸들 {#dep0117-native-crypto-handles}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.0.0 | 수명 종료. |
| v11.0.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

이전 버전의 Node.js는 `Cipher`, `Decipher`, `DiffieHellman`, `DiffieHellmanGroup`, `ECDH`, `Hash`, `Hmac`, `Sign` 및 `Verify` 클래스의 `_handle` 속성을 통해 내부 네이티브 객체에 대한 핸들을 노출했습니다. 네이티브 객체를 잘못 사용하면 애플리케이션이 충돌할 수 있으므로 `_handle` 속성이 제거되었습니다.

### DEP0118: 거짓 호스트 이름에 대한 `dns.lookup()` 지원 {#dep0118-dnslookup-support-for-a-falsy-host-name}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v11.0.0 | 런타임 지원 중단. |
:::

유형: 런타임

이전 버전의 Node.js는 이전 버전과의 호환성 때문에 `dns.lookup(false)`와 같은 거짓 호스트 이름으로 `dns.lookup()`을 지원했습니다. 이 동작은 문서화되지 않았으며 실제 앱에서 사용되지 않는 것으로 간주됩니다. Node.js의 향후 버전에서는 오류가 발생합니다.

### DEP0119: `process.binding('uv').errname()` 개인 API {#dep0119-processbindinguverrname-private-api}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v11.0.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용 ([`--pending-deprecation`](/ko/nodejs/api/cli#--pending-deprecation) 지원)

`process.binding('uv').errname()`은 더 이상 사용되지 않습니다. 대신 [`util.getSystemErrorName()`](/ko/nodejs/api/util#utilgetsystemerrornameerr)을 사용하세요.

### DEP0120: Windows 성능 카운터 지원 {#dep0120-windows-performance-counter-support}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.0.0 | 수명 종료. |
| v11.0.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

Windows 성능 카운터 지원이 Node.js에서 제거되었습니다. 문서화되지 않은 `COUNTER_NET_SERVER_CONNECTION()`, `COUNTER_NET_SERVER_CONNECTION_CLOSE()`, `COUNTER_HTTP_SERVER_REQUEST()`, `COUNTER_HTTP_SERVER_RESPONSE()`, `COUNTER_HTTP_CLIENT_REQUEST()` 및 `COUNTER_HTTP_CLIENT_RESPONSE()` 함수는 더 이상 사용되지 않습니다.

### DEP0121: `net._setSimultaneousAccepts()` {#dep0121-net_setsimultaneousaccepts}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.0.0 | 런타임 지원 중단. |
:::

유형: 런타임

문서화되지 않은 `net._setSimultaneousAccepts()` 함수는 원래 Windows에서 `node:child_process` 및 `node:cluster` 모듈을 사용할 때 디버깅 및 성능 튜닝을 위해 고안되었습니다. 이 함수는 일반적으로 유용하지 않으며 제거될 예정입니다. 자세한 내용은 [https://github.com/nodejs/node/issues/18391](https://github.com/nodejs/node/issues/18391)에서 확인하세요.


### DEP0122: `tls` `Server.prototype.setOptions()` {#dep0122-tls-serverprototypesetoptions}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v12.0.0 | 런타임 지원 중단. |
:::

유형: 런타임

`Server.prototype.setSecureContext()`를 대신 사용하십시오.

### DEP0123: TLS ServerName을 IP 주소로 설정 {#dep0123-setting-the-tls-servername-to-an-ip-address}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v12.0.0 | 런타임 지원 중단. |
:::

유형: 런타임

TLS ServerName을 IP 주소로 설정하는 것은 [RFC 6066](https://tools.ietf.org/html/rfc6066#section-3)에서 허용되지 않습니다. 이는 향후 버전에서 무시됩니다.

### DEP0124: `REPLServer.rli` 사용 {#dep0124-using-replserverrli}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v15.0.0 | 수명 종료. |
| v12.0.0 | 런타임 지원 중단. |
:::

유형: 수명 종료

이 속성은 인스턴스 자체에 대한 참조입니다.

### DEP0125: `require('node:_stream_wrap')` {#dep0125-requirenode_stream_wrap}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v12.0.0 | 런타임 지원 중단. |
:::

유형: 런타임

`node:_stream_wrap` 모듈은 더 이상 사용되지 않습니다.

### DEP0126: `timers.active()` {#dep0126-timersactive}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v11.14.0 | 런타임 지원 중단. |
:::

유형: 런타임

이전에 문서화되지 않은 `timers.active()`는 더 이상 사용되지 않습니다. 공개적으로 문서화된 [`timeout.refresh()`](/ko/nodejs/api/timers#timeoutrefresh)를 대신 사용하십시오. 시간 초과를 다시 참조해야 하는 경우 Node.js 10 이후로는 성능에 영향을 미치지 않으므로 [`timeout.ref()`](/ko/nodejs/api/timers#timeoutref)를 사용할 수 있습니다.

### DEP0127: `timers._unrefActive()` {#dep0127-timers_unrefactive}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v11.14.0 | 런타임 지원 중단. |
:::

유형: 런타임

이전에 문서화되지 않고 "비공개"인 `timers._unrefActive()`는 더 이상 사용되지 않습니다. 공개적으로 문서화된 [`timeout.refresh()`](/ko/nodejs/api/timers#timeoutrefresh)를 대신 사용하십시오. 시간 초과를 해제해야 하는 경우 Node.js 10 이후로는 성능에 영향을 미치지 않으므로 [`timeout.unref()`](/ko/nodejs/api/timers#timeoutunref)를 사용할 수 있습니다.

### DEP0128: 잘못된 `main` 항목과 `index.js` 파일이 있는 모듈 {#dep0128-modules-with-an-invalid-main-entry-and-an-indexjs-file}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v16.0.0 | 런타임 지원 중단. |
| v12.0.0 | 문서 전용. |
:::

유형: 런타임

잘못된 `main` 항목(예: `./does-not-exist.js`)이 있고 최상위 디렉터리에 `index.js` 파일도 있는 모듈은 `index.js` 파일을 확인합니다. 이는 더 이상 사용되지 않으며 향후 Node.js 버전에서 오류를 발생시킵니다.


### DEP0129: `ChildProcess._channel` {#dep0129-childprocess_channel}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.0.0 | 런타임 지원 중단. |
| v11.14.0 | 문서 전용. |
:::

유형: 런타임

`spawn()` 및 유사 함수에서 반환된 하위 프로세스 객체의 `_channel` 속성은 공용으로 사용하기 위한 것이 아닙니다. 대신 `ChildProcess.channel`을 사용하세요.

### DEP0130: `Module.createRequireFromPath()` {#dep0130-modulecreaterequirefrompath}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.0.0 | 수명 종료. |
| v13.0.0 | 런타임 지원 중단. |
| v12.2.0 | 문서 전용. |
:::

유형: 수명 종료

대신 [`module.createRequire()`](/ko/nodejs/api/module#modulecreaterequirefilename)를 사용하세요.

### DEP0131: 레거시 HTTP 파서 {#dep0131-legacy-http-parser}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.0.0 | 이 기능은 제거되었습니다. |
| v12.22.0 | 런타임 지원 중단. |
| v12.3.0 | 문서 전용. |
:::

유형: 수명 종료

Node.js 12.0.0 이전 버전에서 기본적으로 사용된 레거시 HTTP 파서는 지원 중단되었으며 v13.0.0에서 제거되었습니다. v13.0.0 이전에는 `--http-parser=legacy` 명령줄 플래그를 사용하여 레거시 파서 사용으로 되돌릴 수 있었습니다.

### DEP0132: 콜백이 있는 `worker.terminate()` {#dep0132-workerterminate-with-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.5.0 | 런타임 지원 중단. |
:::

유형: 런타임

콜백을 [`worker.terminate()`](/ko/nodejs/api/worker_threads#workerterminate)에 전달하는 것은 지원 중단되었습니다. 대신 반환된 `Promise` 또는 worker의 `'exit'` 이벤트에 대한 리스너를 사용하세요.

### DEP0133: `http` `connection` {#dep0133-http-connection}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.12.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용

[`response.connection`](/ko/nodejs/api/http#responseconnection) 대신 [`response.socket`](/ko/nodejs/api/http#responsesocket)을 사용하고, [`request.connection`](/ko/nodejs/api/http#requestconnection) 대신 [`request.socket`](/ko/nodejs/api/http#requestsocket)을 사용하세요.

### DEP0134: `process._tickCallback` {#dep0134-process_tickcallback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v12.12.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용 ([`--pending-deprecation`](/ko/nodejs/api/cli#--pending-deprecation) 지원)

`process._tickCallback` 속성은 공식적으로 지원되는 API로 문서화된 적이 없습니다.


### DEP0135: `WriteStream.open()` 및 `ReadStream.open()`은 내부 API임 {#dep0135-writestreamopen-and-readstreamopen-are-internal}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.0.0 | 런타임 지원 중단. |
:::

유형: 런타임

[`WriteStream.open()`](/ko/nodejs/api/fs#class-fswritestream) 및 [`ReadStream.open()`](/ko/nodejs/api/fs#class-fsreadstream)은 사용자 공간에서 사용하는 것이 적절하지 않은 문서화되지 않은 내부 API입니다. 파일 스트림은 항상 해당 팩토리 메서드인 [`fs.createWriteStream()`](/ko/nodejs/api/fs#fscreatewritestreampath-options) 및 [`fs.createReadStream()`](/ko/nodejs/api/fs#fscreatereadstreampath-options)을 통해 열거나 옵션에서 파일 디스크립터를 전달하여 열어야 합니다.

### DEP0136: `http` `finished` {#dep0136-http-finished}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.4.0, v12.16.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용

[`response.finished`](/ko/nodejs/api/http#responsefinished)는 [`response.end()`](/ko/nodejs/api/http#responseenddata-encoding-callback)가 호출되었는지 여부를 나타내며, `'finish'`가 발생했는지 여부와 기본 데이터가 플러시되었는지 여부는 나타내지 않습니다.

모호성을 피하기 위해 [`response.writableFinished`](/ko/nodejs/api/http#responsewritablefinished) 또는 [`response.writableEnded`](/ko/nodejs/api/http#responsewritableended)를 대신 사용하세요.

기존 동작을 유지하려면 `response.finished`를 `response.writableEnded`로 바꿔야 합니다.

### DEP0137: 가비지 컬렉션 시 fs.FileHandle 닫기 {#dep0137-closing-fsfilehandle-on-garbage-collection}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.0.0 | 런타임 지원 중단. |
:::

유형: 런타임

[`fs.FileHandle`](/ko/nodejs/api/fs#class-filehandle) 객체가 가비지 컬렉션 시 닫히도록 허용하는 것은 더 이상 사용되지 않습니다. 앞으로 이렇게 하면 프로세스를 종료하는 오류가 발생할 수 있습니다.

`fs.FileHandle`이 더 이상 필요하지 않으면 `FileHandle.prototype.close()`를 사용하여 모든 `fs.FileHandle` 객체를 명시적으로 닫으십시오.

```js [ESM]
const fsPromises = require('node:fs').promises;
async function openAndClose() {
  let filehandle;
  try {
    filehandle = await fsPromises.open('thefile.txt', 'r');
  } finally {
    if (filehandle !== undefined)
      await filehandle.close();
  }
}
```

### DEP0138: `process.mainModule` {#dep0138-processmainmodule}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.0.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용

[`process.mainModule`](/ko/nodejs/api/process#processmainmodule)은 CommonJS 전용 기능이지만 `process` 전역 객체는 비 CommonJS 환경과 공유됩니다. ECMAScript 모듈 내에서의 사용은 지원되지 않습니다.

동일한 목적을 수행하고 CommonJS 환경에서만 사용할 수 있으므로 [`require.main`](/ko/nodejs/api/modules#accessing-the-main-module)을 사용하는 것이 좋습니다.

### DEP0139: 인수가 없는 `process.umask()` {#dep0139-processumask-with-no-arguments}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.0.0, v12.19.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용

인수 없이 `process.umask()`를 호출하면 프로세스 전체 umask가 두 번 작성됩니다. 이는 스레드 간의 경합 조건을 발생시키고 잠재적인 보안 취약점입니다. 안전하고 크로스 플랫폼을 지원하는 대체 API가 없습니다.

### DEP0140: `request.abort()` 대신 `request.destroy()` 사용 {#dep0140-use-requestdestroy-instead-of-requestabort}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.1.0, v13.14.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용

[`request.abort()`](/ko/nodejs/api/http#requestabort) 대신 [`request.destroy()`](/ko/nodejs/api/http#requestdestroyerror)를 사용하세요.

### DEP0141: `repl.inputStream` 및 `repl.outputStream` {#dep0141-replinputstream-and-reploutputstream}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.3.0 | 문서 전용 ([`--pending-deprecation`][] 지원). |
:::

유형: 문서 전용 ([`--pending-deprecation`](/ko/nodejs/api/cli#--pending-deprecation) 지원)

`node:repl` 모듈은 입력 및 출력 스트림을 두 번 내보냈습니다. `.inputStream` 대신 `.input`을 사용하고 `.outputStream` 대신 `.output`을 사용하세요.

### DEP0142: `repl._builtinLibs` {#dep0142-repl_builtinlibs}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.3.0 | 문서 전용 ([`--pending-deprecation`][] 지원). |
:::

유형: 문서 전용

`node:repl` 모듈은 내장 모듈 배열을 포함하는 `_builtinLibs` 속성을 내보냅니다. 지금까지 불완전했으므로 `require('node:module').builtinModules`를 사용하는 것이 좋습니다.


### DEP0143: `Transform._transformState` {#dep0143-transform_transformstate}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.5.0 | 런타임 지원 중단. |
:::

유형: 런타임 `Transform._transformState`는 구현 간소화로 인해 더 이상 필요하지 않게 되는 향후 버전에서 제거될 예정입니다.

### DEP0144: `module.parent` {#dep0144-moduleparent}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.6.0, v12.19.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용 ([`--pending-deprecation`](/ko/nodejs/api/cli#--pending-deprecation) 지원)

CommonJS 모듈은 `module.parent`를 사용하여 자신을 요구한 첫 번째 모듈에 접근할 수 있습니다. 이 기능은 ECMAScript 모듈이 있는 경우 일관되게 작동하지 않고 CommonJS 모듈 그래프를 부정확하게 나타내기 때문에 지원이 중단되었습니다.

일부 모듈은 현재 프로세스의 진입점인지 확인하기 위해 이 기능을 사용합니다. 대신 `require.main`과 `module`을 비교하는 것이 좋습니다.

```js [ESM]
if (require.main === module) {
  // 현재 파일이 진입점인 경우에만 실행되는 코드 섹션입니다.
}
```
현재 모듈을 요구한 CommonJS 모듈을 찾을 때는 `require.cache`와 `module.children`을 사용할 수 있습니다.

```js [ESM]
const moduleParents = Object.values(require.cache)
  .filter((m) => m.children.includes(module));
```
### DEP0145: `socket.bufferSize` {#dep0145-socketbuffersize}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.6.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용

[`socket.bufferSize`](/ko/nodejs/api/net#socketbuffersize)는 [`writable.writableLength`](/ko/nodejs/api/stream#writablewritablelength)의 별칭일 뿐입니다.

### DEP0146: `new crypto.Certificate()` {#dep0146-new-cryptocertificate}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.9.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용

[`crypto.Certificate()` 생성자](/ko/nodejs/api/crypto#legacy-api)는 지원이 중단되었습니다. 대신 [`crypto.Certificate()`의 정적 메서드](/ko/nodejs/api/crypto#class-certificate)를 사용하세요.

### DEP0147: `fs.rmdir(path, { recursive: true })` {#dep0147-fsrmdirpath-{-recursive-true-}}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.0.0 | 런타임 지원 중단. |
| v15.0.0 | 관대한 동작에 대한 런타임 지원 중단. |
| v14.14.0 | 문서 전용 지원 중단. |
:::

유형: 런타임

향후 Node.js 버전에서는 `recursive` 옵션이 `fs.rmdir`, `fs.rmdirSync` 및 `fs.promises.rmdir`에 대해 무시됩니다.

대신 `fs.rm(path, { recursive: true, force: true })`, `fs.rmSync(path, { recursive: true, force: true })` 또는 `fs.promises.rm(path, { recursive: true, force: true })`를 사용하세요.


### DEP0148: `"exports"`의 폴더 매핑 (후행 `"/"`) {#dep0148-folder-mappings-in-"exports"-trailing-"/"}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v17.0.0 | 지원 종료. |
| v16.0.0 | 런타임 사용 중단. |
| v15.1.0 | 자체 참조 임포트에 대한 런타임 사용 중단. |
| v14.13.0 | 문서 전용 사용 중단. |
:::

유형: 런타임

[서브패스 exports](/ko/nodejs/api/packages#subpath-exports) 또는 [서브패스 imports](/ko/nodejs/api/packages#subpath-imports) 필드에서 서브패스 폴더 매핑을 정의하기 위해 후행 `"/"`를 사용하는 것은 더 이상 사용되지 않습니다. 대신 [서브패스 패턴](/ko/nodejs/api/packages#subpath-patterns)을 사용하십시오.

### DEP0149: `http.IncomingMessage#connection` {#dep0149-httpincomingmessageconnection}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.0.0 | 문서 전용 사용 중단. |
:::

유형: 문서 전용.

[`message.connection`](/ko/nodejs/api/http#messageconnection) 대신 [`message.socket`](/ko/nodejs/api/http#messagesocket)을 사용하십시오.

### DEP0150: `process.config` 값 변경 {#dep0150-changing-the-value-of-processconfig}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 지원 종료. |
| v16.0.0 | 런타임 사용 중단. |
:::

유형: 지원 종료

`process.config` 속성은 Node.js 컴파일 시간 설정에 대한 액세스를 제공합니다. 그러나 속성은 변경 가능하며 따라서 변조될 수 있습니다. 값을 변경하는 기능은 향후 Node.js 버전에서 제거됩니다.

### DEP0151: 주요 인덱스 조회 및 확장자 검색 {#dep0151-main-index-lookup-and-extension-searching}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.0.0 | 런타임 사용 중단. |
| v15.8.0, v14.18.0 | `--pending-deprecation` 지원과 함께 문서 전용 사용 중단. |
:::

유형: 런타임

이전에는 `index.js` 및 확장자 검색 조회가 ES 모듈을 해결하는 경우에도 `import 'pkg'` 메인 진입점 해결에 적용되었습니다.

이 사용 중단으로 인해 모든 ES 모듈 메인 진입점 해결에는 정확한 파일 확장자를 가진 명시적 [`"exports"` 또는 `"main"` 진입점](/ko/nodejs/api/packages#main-entry-point-export)이 필요합니다.

### DEP0152: 확장 PerformanceEntry 속성 {#dep0152-extension-performanceentry-properties}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.0.0 | 런타임 사용 중단. |
:::

유형: 런타임

`'gc'`, `'http2'`, 및 `'http'` [\<PerformanceEntry\>](/ko/nodejs/api/perf_hooks#class-performanceentry) 객체 유형에는 추가 정보를 제공하는 추가 속성이 할당되어 있습니다. 이러한 속성은 이제 `PerformanceEntry` 객체의 표준 `detail` 속성 내에서 사용할 수 있습니다. 기존 접근자는 더 이상 사용되지 않으며 더 이상 사용해서는 안 됩니다.


### DEP0153: `dns.lookup` 및 `dnsPromises.lookup` 옵션 유형 강제 변환 {#dep0153-dnslookup-and-dnspromiseslookup-options-type-coercion}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 수명 종료. |
| v17.0.0 | 런타임 지원 중단. |
| v16.8.0 | 문서 전용 지원 중단. |
:::

유형: 수명 종료

[`dns.lookup()`](/ko/nodejs/api/dns#dnslookuphostname-options-callback) 및 [`dnsPromises.lookup()`](/ko/nodejs/api/dns#dnspromiseslookuphostname-options)에서 `family` 옵션에 nullish가 아니고 정수가 아닌 값을, `hints` 옵션에 nullish가 아니고 숫자가 아닌 값을, `all` 옵션에 nullish가 아니고 부울이 아닌 값을, 또는 `verbatim` 옵션에 nullish가 아니고 부울이 아닌 값을 사용하면 `ERR_INVALID_ARG_TYPE` 오류가 발생합니다.

### DEP0154: RSA-PSS 키 쌍 생성 옵션 {#dep0154-rsa-pss-generate-key-pair-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.0.0 | 런타임 지원 중단. |
| v16.10.0 | 문서 전용 지원 중단. |
:::

유형: 런타임

`'hash'` 및 `'mgf1Hash'` 옵션이 `'hashAlgorithm'` 및 `'mgf1HashAlgorithm'`으로 대체되었습니다.

### DEP0155: 패턴 지정자 확인 시 후행 슬래시 {#dep0155-trailing-slashes-in-pattern-specifier-resolutions}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v17.0.0 | 런타임 지원 중단. |
| v16.10.0 | `--pending-deprecation` 지원으로 문서 전용 지원 중단. |
:::

유형: 런타임

`import 'pkg/x/'`와 같이 `"/"`로 끝나는 지정자의 재매핑은 패키지 `"exports"` 및 `"imports"` 패턴 확인에서 더 이상 사용되지 않습니다.

### DEP0156: `http`의 `.aborted` 속성 및 `'abort'`, `'aborted'` 이벤트 {#dep0156-aborted-property-and-abort-aborted-event-in-http}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v17.0.0, v16.12.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용

[`http.ClientRequest`](/ko/nodejs/api/http#class-httpclientrequest), [`http.ServerResponse`](/ko/nodejs/api/http#class-httpserverresponse) 및 [`http.IncomingMessage`](/ko/nodejs/api/http#class-httpincomingmessage)는 모두 스트림 기반이므로 대신 [\<Stream\>](/ko/nodejs/api/stream#stream) API로 이동합니다. `.aborted` 속성 대신 `stream.destroyed`를 확인하고 `'abort'`, `'aborted'` 이벤트 대신 `'close'`를 수신 대기합니다.

`.aborted` 속성 및 `'abort'` 이벤트는 `.abort()` 호출을 감지하는 데만 유용합니다. 요청을 조기에 닫으려면 스트림 `.destroy([error])`를 사용한 다음 `.destroyed` 속성을 확인하고 `'close'` 이벤트가 동일한 효과를 가져야 합니다. 수신 측에서는 [`http.IncomingMessage`](/ko/nodejs/api/http#class-httpincomingmessage)에서 [`readable.readableEnded`](/ko/nodejs/api/stream#readablereadableended) 값을 확인하여 중단된 destroy인지 정상적인 destroy인지 확인해야 합니다.


### DEP0157: 스트림에서 Thenable 지원 {#dep0157-thenable-support-in-streams}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 수명 종료. |
| v17.2.0, v16.14.0 | 문서 전용 지원 중단. |
:::

유형: 수명 종료

Node.js 스트림의 문서화되지 않은 기능은 구현 메서드에서 thenable을 지원하는 것이었습니다. 이제 이는 더 이상 사용되지 않으므로 콜백을 대신 사용하고 스트림 구현 메서드에 async 함수를 사용하지 마십시오.

이 기능으로 인해 사용자가 콜백 스타일로 함수를 구현하지만 예를 들어 비동기 메서드를 사용하는 경우 예기치 않은 문제가 발생했습니다. 프로미스와 콜백 의미 체계를 혼합하는 것은 유효하지 않기 때문입니다.

```js [ESM]
const w = new Writable({
  async final(callback) {
    await someOp();
    callback();
  },
});
```
### DEP0158: `buffer.slice(start, end)` {#dep0158-bufferslicestart-end}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v17.5.0, v16.15.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용

이 메서드는 `Buffer`의 슈퍼클래스인 `Uint8Array.prototype.slice()`와 호환되지 않기 때문에 더 이상 사용되지 않습니다.

대신 동일한 작업을 수행하는 [`buffer.subarray`](/ko/nodejs/api/buffer#bufsubarraystart-end)를 사용하십시오.

### DEP0159: `ERR_INVALID_CALLBACK` {#dep0159-err_invalid_callback}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 수명 종료. |
:::

유형: 수명 종료

이 오류 코드는 값 유형 유효성 검사에 사용되는 오류에 더 많은 혼란을 추가하여 제거되었습니다.

### DEP0160: `process.on('multipleResolves', handler)` {#dep0160-processonmultipleresolves-handler}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 런타임 지원 중단. |
| v17.6.0, v16.15.0 | 문서 전용 지원 중단. |
:::

유형: 런타임.

이 이벤트는 V8 프로미스 결합자와 작동하지 않아 유용성이 떨어지기 때문에 더 이상 사용되지 않습니다.

### DEP0161: `process._getActiveRequests()` 및 `process._getActiveHandles()` {#dep0161-process_getactiverequests-and-process_getactivehandles}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v17.6.0, v16.15.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용

`process._getActiveHandles()` 및 `process._getActiveRequests()` 함수는 공개적으로 사용하기 위한 것이 아니며 향후 릴리스에서 제거될 수 있습니다.

실제 참조가 아닌 활성 리소스 유형 목록을 얻으려면 [`process.getActiveResourcesInfo()`](/ko/nodejs/api/process#processgetactiveresourcesinfo)를 사용하십시오.


### DEP0162: `fs.write()`, `fs.writeFileSync()` 문자열 강제 변환 {#dep0162-fswrite-fswritefilesync-coercion-to-string}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 수명 종료. |
| v18.0.0 | 런타임 지원 중단. |
| v17.8.0, v16.15.0 | 문서 전용 지원 중단. |
:::

유형: 수명 종료

[`fs.write()`](/ko/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback), [`fs.writeFile()`](/ko/nodejs/api/fs#fswritefilefile-data-options-callback), [`fs.appendFile()`](/ko/nodejs/api/fs#fsappendfilepath-data-options-callback), [`fs.writeFileSync()`](/ko/nodejs/api/fs#fswritefilesyncfile-data-options), [`fs.appendFileSync()`](/ko/nodejs/api/fs#fsappendfilesyncpath-data-options)에서 두 번째 매개변수로 전달된 자체 `toString` 속성이 있는 객체의 암시적 강제 변환은 더 이상 사용되지 않습니다. 이를 기본 문자열로 변환하십시오.

### DEP0163: `channel.subscribe(onMessage)`, `channel.unsubscribe(onMessage)` {#dep0163-channelsubscribeonmessage-channelunsubscribeonmessage}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.7.0, v16.17.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용

이러한 메서드는 이벤트를 받기 위해 채널 참조를 충분히 오래 유지하지 못하는 방식으로 사용될 수 있기 때문에 더 이상 사용되지 않습니다.

대신 동일한 작업을 수행하는 [`diagnostics_channel.subscribe(name, onMessage)`](/ko/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage) 또는 [`diagnostics_channel.unsubscribe(name, onMessage)`](/ko/nodejs/api/diagnostics_channel#diagnostics_channelunsubscribename-onmessage)를 사용하십시오.

### DEP0164: `process.exit(code)`, `process.exitCode` 정수 강제 변환 {#dep0164-processexitcode-processexitcode-coercion-to-integer}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.0.0 | 수명 종료. |
| v19.0.0 | 런타임 지원 중단. |
| v18.10.0, v16.18.0 | `process.exitCode` 정수 강제 변환에 대한 문서 전용 지원 중단. |
| v18.7.0, v16.17.0 | `process.exit(code)` 정수 강제 변환에 대한 문서 전용 지원 중단. |
:::

유형: 수명 종료

[`process.exit()`](/ko/nodejs/api/process#processexitcode)의 `code` 매개변수 값과 [`process.exitCode`](/ko/nodejs/api/process#processexitcode_1)에 할당할 값으로 `undefined`, `null`, 정수 숫자 및 정수 문자열(예: `'1'`) 이외의 값은 더 이상 사용되지 않습니다.


### DEP0165: `--trace-atomics-wait` {#dep0165---trace-atomics-wait}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 지원 종료. |
| v22.0.0 | 런타임 지원 중단. |
| v18.8.0, v16.18.0 | 문서 전용 지원 중단. |
:::

유형: 지원 종료

`--trace-atomics-wait` 플래그는 V8 훅 `SetAtomicsWaitCallback`을 사용하므로 제거되었습니다. 해당 훅은 향후 V8 릴리스에서 제거될 예정입니다.

### DEP0166: 가져오기 및 내보내기 대상의 이중 슬래시 {#dep0166-double-slashes-in-imports-and-exports-targets}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0 | 런타임 지원 중단. |
| v18.10.0 | `--pending-deprecation` 지원을 통한 문서 전용 지원 중단. |
:::

유형: 런타임

패키지 가져오기 및 내보내기 대상이 이중 슬래시 ( *"/"* 또는 *"\"*)를 포함하는 경로에 매핑되는 것은 지원 중단되었으며 향후 릴리스에서는 확인 유효성 검사 오류와 함께 실패합니다. 이와 동일한 지원 중단은 슬래시로 시작하거나 끝나는 패턴 일치에도 적용됩니다.

### DEP0167: 약한 `DiffieHellmanGroup` 인스턴스(`modp1`, `modp2`, `modp5`) {#dep0167-weak-diffiehellmangroup-instances-modp1-modp2-modp5}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.10.0, v16.18.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용

잘 알려진 MODP 그룹 `modp1`, `modp2`, `modp5`는 실제 공격에 대해 안전하지 않기 때문에 지원 중단되었습니다. 자세한 내용은 [RFC 8247 섹션 2.4](https://www.rfc-editor.org/rfc/rfc8247#section-2.4)를 참조하십시오.

이러한 그룹은 향후 Node.js 버전에서 제거될 수 있습니다. 이러한 그룹에 의존하는 애플리케이션은 대신 더 강력한 MODP 그룹을 사용하는 것을 평가해야 합니다.

### DEP0168: Node-API 콜백의 처리되지 않은 예외 {#dep0168-unhandled-exception-in-node-api-callbacks}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.3.0, v16.17.0 | 런타임 지원 중단. |
:::

유형: 런타임

Node-API 콜백에서 처리되지 않은 예외의 암시적 억제가 이제 더 이상 사용되지 않습니다.

예외가 Node-API 콜백에서 처리되지 않은 경우 Node.js가 [`'uncaughtException'`](/ko/nodejs/api/process#event-uncaughtexception) 이벤트를 강제로 발생시키려면 [`--force-node-api-uncaught-exceptions-policy`](/ko/nodejs/api/cli#--force-node-api-uncaught-exceptions-policy) 플래그를 설정하십시오.


### DEP0169: 안전하지 않은 url.parse() {#dep0169-insecure-urlparse}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.9.0, v18.17.0 | `--pending-deprecation` 지원이 추가되었습니다. |
| v19.0.0, v18.13.0 | 문서 전용 사용 중단. |
:::

유형: 문서 전용 ([`--pending-deprecation`](/ko/nodejs/api/cli#--pending-deprecation) 지원)

[`url.parse()`](/ko/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) 동작은 표준화되지 않았으며 보안상 영향을 미치는 오류가 발생하기 쉽습니다. 대신 [WHATWG URL API](/ko/nodejs/api/url#the-whatwg-url-api)를 사용하십시오. `url.parse()` 취약점에 대해서는 CVE가 발행되지 않습니다.

### DEP0170: `url.parse()` 사용 시 잘못된 포트 {#dep0170-invalid-port-when-using-urlparse}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.0.0 | 런타임 사용 중단. |
| v19.2.0, v18.13.0 | 문서 전용 사용 중단. |
:::

유형: 런타임

[`url.parse()`](/ko/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost)는 숫자가 아닌 포트가 있는 URL을 허용합니다. 이 동작은 예기치 않은 입력으로 호스트 이름 스푸핑을 초래할 수 있습니다. 이러한 URL은 [WHATWG URL API](/ko/nodejs/api/url#the-whatwg-url-api)가 이미 수행하고 있는 것처럼 이후 버전의 Node.js에서 오류를 발생시킵니다.

### DEP0171: `http.IncomingMessage` 헤더 및 트레일러에 대한 설정자 {#dep0171-setters-for-httpincomingmessage-headers-and-trailers}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.3.0, v18.13.0 | 문서 전용 사용 중단. |
:::

유형: 문서 전용

향후 Node.js 버전에서는 [`message.headers`](/ko/nodejs/api/http#messageheaders), [`message.headersDistinct`](/ko/nodejs/api/http#messageheadersdistinct), [`message.trailers`](/ko/nodejs/api/http#messagetrailers) 및 [`message.trailersDistinct`](/ko/nodejs/api/http#messagetrailersdistinct)가 읽기 전용이 됩니다.

### DEP0172: `AsyncResource` 바운드 함수의 `asyncResource` 속성 {#dep0172-the-asyncresource-property-of-asyncresource-bound-functions}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.0.0 | 런타임 사용 중단. |
:::

유형: 런타임

향후 Node.js 버전에서는 함수가 `AsyncResource`에 바인딩될 때 `asyncResource` 속성이 더 이상 추가되지 않습니다.

### DEP0173: `assert.CallTracker` 클래스 {#dep0173-the-assertcalltracker-class}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.1.0 | 문서 전용 사용 중단. |
:::

유형: 문서 전용

향후 Node.js 버전에서는 [`assert.CallTracker`](/ko/nodejs/api/assert#class-assertcalltracker)가 제거됩니다. [`mock`](/ko/nodejs/api/test#mocking) 헬퍼 함수와 같은 대안을 사용하는 것이 좋습니다.


### DEP0174: `Promise`를 반환하는 함수에서 `promisify` 호출 {#dep0174-calling-promisify-on-a-function-that-returns-a-promise}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v21.0.0 | 런타임 지원 중단. |
| v20.8.0 | 문서 전용 지원 중단. |
:::

유형: 런타임

`Promise`를 반환하는 함수에서 [`util.promisify`](/ko/nodejs/api/util#utilpromisifyoriginal)를 호출합니다.

### DEP0175: `util.toUSVString` {#dep0175-utiltousvstring}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.8.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용

[`util.toUSVString()`](/ko/nodejs/api/util#utiltousvstringstring) API는 지원 중단되었습니다. 대신 [`String.prototype.toWellFormed`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toWellFormed)를 사용하십시오.

### DEP0176: `fs.F_OK`, `fs.R_OK`, `fs.W_OK`, `fs.X_OK` {#dep0176-fsf_ok-fsr_ok-fsw_ok-fsx_ok}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.8.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용

`node:fs`에 직접 노출된 `F_OK`, `R_OK`, `W_OK`, `X_OK` getter는 지원 중단되었습니다. 대신 `fs.constants` 또는 `fs.promises.constants`에서 가져오십시오.

### DEP0177: `util.types.isWebAssemblyCompiledModule` {#dep0177-utiltypesiswebassemblycompiledmodule}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v21.7.0, v20.12.0 | 수명 종료. |
| v21.3.0, v20.11.0 | 지원 중단 코드가 할당되었습니다. |
| v14.0.0 | 문서 전용 지원 중단. |
:::

유형: 수명 종료

`util.types.isWebAssemblyCompiledModule` API가 제거되었습니다. 대신 `value instanceof WebAssembly.Module`을 사용하십시오.

### DEP0178: `dirent.path` {#dep0178-direntpath}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 런타임 지원 중단. |
| v21.5.0, v20.12.0, v18.20.0 | 문서 전용 지원 중단. |
:::

유형: 런타임

[`dirent.path`](/ko/nodejs/api/fs#direntpath)는 릴리스 라인 간의 일관성이 부족하여 지원 중단되었습니다. 대신 [`dirent.parentPath`](/ko/nodejs/api/fs#direntparentpath)를 사용하십시오.

### DEP0179: `Hash` 생성자 {#dep0179-hash-constructor}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.0.0 | 런타임 지원 중단. |
| v21.5.0, v20.12.0 | 문서 전용 지원 중단. |
:::

유형: 런타임

`Hash()` 또는 `new Hash()`로 `Hash` 클래스를 직접 호출하는 것은 내부적으로 사용되는 것으로 간주되어 공개 사용을 위한 것이 아니므로 지원 중단되었습니다. Hash 인스턴스를 생성하려면 [`crypto.createHash()`](/ko/nodejs/api/crypto#cryptocreatehashalgorithm-options) 메서드를 사용하십시오.


### DEP0180: `fs.Stats` 생성자 {#dep0180-fsstats-constructor}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.0.0 | 런타임 지원 중단. |
| v20.13.0 | 문서 전용 지원 중단. |
:::

유형: 런타임

`Stats()` 또는 `new Stats()`로 `fs.Stats` 클래스를 직접 호출하는 것은 내부 용도로 사용되며 공용으로 사용할 수 없으므로 지원 중단되었습니다.

### DEP0181: `Hmac` 생성자 {#dep0181-hmac-constructor}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.0.0 | 런타임 지원 중단. |
| v20.13.0 | 문서 전용 지원 중단. |
:::

유형: 런타임

`Hmac()` 또는 `new Hmac()`로 `Hmac` 클래스를 직접 호출하는 것은 내부 용도로 사용되며 공용으로 사용할 수 없으므로 지원 중단되었습니다. [`crypto.createHmac()`](/ko/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) 메서드를 사용하여 Hmac 인스턴스를 만드십시오.

### DEP0182: 명시적인 `authTagLength` 없는 짧은 GCM 인증 태그 {#dep0182-short-gcm-authentication-tags-without-explicit-authtaglength}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | 런타임 지원 중단. |
| v20.13.0 | 문서 전용 지원 중단. |
:::

유형: 런타임

기본 인증 태그 길이보다 짧은 인증 태그를 사용하려는 애플리케이션은 [`crypto.createDecipheriv()`](/ko/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) 함수의 `authTagLength` 옵션을 적절한 길이로 설정해야 합니다.

GCM 모드의 암호의 경우, [`decipher.setAuthTag()`](/ko/nodejs/api/crypto#deciphersetauthtagbuffer-encoding) 함수는 유효한 길이의 인증 태그를 허용합니다([DEP0090](/ko/nodejs/api/deprecations#DEP0090) 참조). 이 동작은 [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf)에 따른 권장 사항에 더 잘 부합하기 위해 지원 중단되었습니다.

### DEP0183: OpenSSL 엔진 기반 API {#dep0183-openssl-engine-based-apis}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.4.0, v20.16.0 | 문서 전용 지원 중단. |
:::

유형: 문서 전용

OpenSSL 3은 사용자 정의 엔진에 대한 지원을 중단하고 새로운 공급자 모델로 전환할 것을 권장했습니다. `https.request()`에 대한 `clientCertEngine` 옵션, [`tls.createSecureContext()`](/ko/nodejs/api/tls#tlscreatesecurecontextoptions) 및 [`tls.createServer()`](/ko/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener); [`tls.createSecureContext()`](/ko/nodejs/api/tls#tlscreatesecurecontextoptions)에 대한 `privateKeyEngine` 및 `privateKeyIdentifier`; 그리고 [`crypto.setEngine()`](/ko/nodejs/api/crypto#cryptosetengineengine-flags)은 모두 OpenSSL의 이 기능에 의존합니다.


### DEP0184: `node:zlib` 클래스를 `new` 없이 인스턴스화하기 {#dep0184-instantiating-nodezlib-classes-without-new}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.9.0, v20.18.0 | 문서 전용 사용 중단. |
:::

유형: 문서 전용

`node:zlib` 모듈에서 내보낸 클래스를 `new` 한정자 없이 인스턴스화하는 것은 더 이상 사용되지 않습니다. 대신 `new` 한정자를 사용하는 것이 좋습니다. 이는 `Deflate`, `DeflateRaw`, `Gunzip`, `Inflate`, `InflateRaw`, `Unzip` 및 `Zlib`과 같은 모든 Zlib 클래스에 적용됩니다.

### DEP0185: `node:repl` 클래스를 `new` 없이 인스턴스화하기 {#dep0185-instantiating-noderepl-classes-without-new}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.9.0, v20.18.0 | 문서 전용 사용 중단. |
:::

유형: 문서 전용

`node:repl` 모듈에서 내보낸 클래스를 `new` 한정자 없이 인스턴스화하는 것은 더 이상 사용되지 않습니다. 대신 `new` 한정자를 사용하는 것이 좋습니다. 이는 `REPLServer` 및 `Recoverable`을 포함한 모든 REPL 클래스에 적용됩니다.

### DEP0187: `fs.existsSync`에 유효하지 않은 인수 유형 전달하기 {#dep0187-passing-invalid-argument-types-to-fsexistssync}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.4.0 | 문서 전용. |
:::

유형: 문서 전용

지원되지 않는 인수 유형을 전달하는 것은 더 이상 사용되지 않으며, `false`를 반환하는 대신 향후 버전에서 오류를 throw합니다.

### DEP0188: `process.features.ipv6` 및 `process.features.uv` {#dep0188-processfeaturesipv6-and-processfeaturesuv}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.4.0 | 문서 전용 사용 중단. |
:::

유형: 문서 전용

이러한 속성은 무조건 `true`입니다. 이러한 속성을 기반으로 한 모든 검사는 중복됩니다.

### DEP0189: `process.features.tls_*` {#dep0189-processfeaturestls_*}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.4.0 | 문서 전용 사용 중단. |
:::

유형: 문서 전용

`process.features.tls_alpn`, `process.features.tls_ocsp` 및 `process.features.tls_sni`는 더 이상 사용되지 않습니다. 그 값은 `process.features.tls`의 값과 동일한 것으로 보장되기 때문입니다.

