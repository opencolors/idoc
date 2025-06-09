---
title: Node.js 단일 실행 가능 애플리케이션
description: Node.js를 사용하여 단일 실행 가능 애플리케이션을 생성하고 관리하는 방법을 배우세요. 애플리케이션 번들링, 의존성 관리 및 보안 고려 사항을 포함합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 단일 실행 가능 애플리케이션 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js를 사용하여 단일 실행 가능 애플리케이션을 생성하고 관리하는 방법을 배우세요. 애플리케이션 번들링, 의존성 관리 및 보안 고려 사항을 포함합니다.
  - - meta
    - name: twitter:title
      content: Node.js 단일 실행 가능 애플리케이션 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js를 사용하여 단일 실행 가능 애플리케이션을 생성하고 관리하는 방법을 배우세요. 애플리케이션 번들링, 의존성 관리 및 보안 고려 사항을 포함합니다.
---


# 단일 실행 파일 애플리케이션 {#single-executable-applications}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v20.6.0 | "useSnapshot" 지원 추가. |
| v20.6.0 | "useCodeCache" 지원 추가. |
| v19.7.0, v18.16.0 | 다음 버전에서 추가됨: v19.7.0, v18.16.0 |
:::

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::

**소스 코드:** [src/node_sea.cc](https://github.com/nodejs/node/blob/v23.5.0/src/node_sea.cc)

이 기능은 Node.js가 설치되지 않은 시스템에 Node.js 애플리케이션을 편리하게 배포할 수 있도록 합니다.

Node.js는 번들된 스크립트를 포함할 수 있는 Node.js에서 준비한 Blob을 `node` 바이너리에 삽입할 수 있도록 하여 [단일 실행 파일 애플리케이션](https://github.com/nodejs/single-executable) 생성을 지원합니다. 시작 시 프로그램은 삽입된 내용이 있는지 확인합니다. Blob이 발견되면 Blob의 스크립트를 실행합니다. 그렇지 않으면 Node.js는 정상적으로 작동합니다.

단일 실행 파일 애플리케이션 기능은 현재 [CommonJS](/ko/nodejs/api/modules#modules-commonjs-modules) 모듈 시스템을 사용하여 단일 임베디드 스크립트 실행만 지원합니다.

사용자는 `node` 바이너리 자체와 바이너리에 리소스를 삽입할 수 있는 도구를 사용하여 번들된 스크립트에서 단일 실행 파일 애플리케이션을 만들 수 있습니다.

다음은 [postject](https://github.com/nodejs/postject)와 같은 도구를 사용하여 단일 실행 파일 애플리케이션을 만드는 단계입니다.

## 단일 실행 파일 준비 Blob 생성 {#generating-single-executable-preparation-blobs}

애플리케이션에 삽입되는 단일 실행 파일 준비 Blob은 단일 실행 파일을 빌드하는 데 사용될 Node.js 바이너리의 `--experimental-sea-config` 플래그를 사용하여 생성할 수 있습니다. 이 플래그는 JSON 형식의 구성 파일 경로를 사용합니다. 전달된 경로가 절대 경로가 아니면 Node.js는 현재 작업 디렉터리를 기준으로 경로를 사용합니다.

현재 구성은 다음과 같은 최상위 필드를 읽습니다.

```json [JSON]
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/blob.blob",
  "disableExperimentalSEAWarning": true, // 기본값: false
  "useSnapshot": false,  // 기본값: false
  "useCodeCache": true, // 기본값: false
  "assets": {  // 선택 사항
    "a.dat": "/path/to/a.dat",
    "b.txt": "/path/to/b.txt"
  }
}
```
경로가 절대 경로가 아니면 Node.js는 현재 작업 디렉터리를 기준으로 경로를 사용합니다. Blob을 생성하는 데 사용된 Node.js 바이너리의 버전은 Blob이 삽입될 바이너리의 버전과 동일해야 합니다.

참고: 교차 플랫폼 SEA를 생성할 때(예: `darwin-arm64`에서 `linux-x64`용 SEA 생성), 호환되지 않는 실행 파일 생성을 방지하려면 `useCodeCache` 및 `useSnapshot`을 false로 설정해야 합니다. 코드 캐시와 스냅샷은 컴파일된 동일한 플랫폼에서만 로드할 수 있으므로 생성된 실행 파일은 다른 플랫폼에서 빌드된 코드 캐시 또는 스냅샷을 로드하려고 할 때 시작 시 충돌할 수 있습니다.


### 에셋 {#assets}

사용자는 `assets` 필드로 키-경로 사전을 구성에 추가하여 에셋을 포함할 수 있습니다. 빌드 시 Node.js는 지정된 경로에서 에셋을 읽어 준비 Blob에 번들로 묶습니다. 생성된 실행 파일에서 사용자는 [`sea.getAsset()`](/ko/nodejs/api/single-executable-applications#seagetassetkey-encoding) 및 [`sea.getAssetAsBlob()`](/ko/nodejs/api/single-executable-applications#seagetassetasblobkey-options) API를 사용하여 에셋을 검색할 수 있습니다.

```json [JSON]
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/blob.blob",
  "assets": {
    "a.jpg": "/path/to/a.jpg",
    "b.txt": "/path/to/b.txt"
  }
}
```
단일 실행 파일 애플리케이션은 다음과 같이 에셋에 액세스할 수 있습니다.

```js [CJS]
const { getAsset, getAssetAsBlob, getRawAsset } = require('node:sea');
// ArrayBuffer에서 데이터의 복사본을 반환합니다.
const image = getAsset('a.jpg');
// 에셋에서 UTF8로 디코딩된 문자열을 반환합니다.
const text = getAsset('b.txt', 'utf8');
// 에셋을 포함하는 Blob을 반환합니다.
const blob = getAssetAsBlob('a.jpg');
// 복사하지 않고 원시 에셋을 포함하는 ArrayBuffer를 반환합니다.
const raw = getRawAsset('a.jpg');
```
자세한 내용은 [`sea.getAsset()`](/ko/nodejs/api/single-executable-applications#seagetassetkey-encoding), [`sea.getAssetAsBlob()`](/ko/nodejs/api/single-executable-applications#seagetassetasblobkey-options) 및 [`sea.getRawAsset()`](/ko/nodejs/api/single-executable-applications#seagetrawassetkey) API 설명서를 참조하십시오.

### 시작 스냅샷 지원 {#startup-snapshot-support}

`useSnapshot` 필드를 사용하여 시작 스냅샷 지원을 활성화할 수 있습니다. 이 경우 최종 실행 파일이 시작될 때 `main` 스크립트가 실행되지 않습니다. 대신 단일 실행 파일 애플리케이션 준비 Blob이 빌드 시스템에서 생성될 때 실행됩니다. 생성된 준비 Blob에는 `main` 스크립트에 의해 초기화된 상태를 캡처하는 스냅샷이 포함됩니다. 준비 Blob이 삽입된 최종 실행 파일은 런타임에 스냅샷을 역직렬화합니다.

`useSnapshot`이 true이면 메인 스크립트는 [`v8.startupSnapshot.setDeserializeMainFunction()`](/ko/nodejs/api/v8#v8startupsnapshotsetdeserializemainfunctioncallback-data) API를 호출하여 사용자가 최종 실행 파일을 시작할 때 실행해야 하는 코드를 구성해야 합니다.

단일 실행 파일 애플리케이션에서 스냅샷을 사용하는 일반적인 패턴은 다음과 같습니다.

시작 스냅샷 스크립트의 일반적인 제약 조건은 단일 실행 파일 애플리케이션에 대한 스냅샷을 빌드하는 데 사용되는 메인 스크립트에도 적용되며, 메인 스크립트는 [`v8.startupSnapshot` API](/ko/nodejs/api/v8#startup-snapshot-api)를 사용하여 이러한 제약 조건에 적응할 수 있습니다. [Node.js의 시작 스냅샷 지원에 대한 설명서](/ko/nodejs/api/cli#--build-snapshot)를 참조하십시오.


### V8 코드 캐시 지원 {#v8-code-cache-support}

구성에서 `useCodeCache`가 `true`로 설정된 경우, 단일 실행 파일 준비 blob을 생성하는 동안 Node.js는 `main` 스크립트를 컴파일하여 V8 코드 캐시를 생성합니다. 생성된 코드 캐시는 준비 blob의 일부가 되어 최종 실행 파일에 주입됩니다. 단일 실행 파일 애플리케이션이 시작되면 Node.js는 `main` 스크립트를 처음부터 컴파일하는 대신 코드 캐시를 사용하여 컴파일 속도를 높인 다음 스크립트를 실행하여 시작 성능을 향상시킵니다.

**참고:** `useCodeCache`가 `true`이면 `import()`가 작동하지 않습니다.

## 주입된 main 스크립트에서 {#in-the-injected-main-script}

### 단일 실행 파일 애플리케이션 API {#single-executable-application-api}

`node:sea` 내장 모듈은 실행 파일에 내장된 JavaScript main 스크립트에서 단일 실행 파일 애플리케이션과의 상호 작용을 허용합니다.

#### `sea.isSea()` {#seaissea}

**추가된 버전: v21.7.0, v20.12.0**

- 반환 값: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 이 스크립트가 단일 실행 파일 애플리케이션 내에서 실행 중인지 여부입니다.

### `sea.getAsset(key[, encoding])` {#seagetassetkey-encoding}

**추가된 버전: v21.7.0, v20.12.0**

이 메서드를 사용하여 빌드 시 단일 실행 파일 애플리케이션에 번들로 묶도록 구성된 자산을 검색할 수 있습니다. 일치하는 자산을 찾을 수 없으면 오류가 발생합니다.

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 단일 실행 파일 애플리케이션 구성의 `assets` 필드에 지정된 사전에서 자산의 키입니다.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 지정된 경우 자산은 문자열로 디코딩됩니다. `TextDecoder`에서 지원하는 모든 인코딩이 허용됩니다. 지정하지 않으면 자산의 복사본이 포함된 `ArrayBuffer`가 대신 반환됩니다.
- 반환 값: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)


### `sea.getAssetAsBlob(key[, options])` {#seagetassetasblobkey-options}

**Added in: v21.7.0, v20.12.0**

[`sea.getAsset()`](/ko/nodejs/api/single-executable-applications#seagetassetkey-encoding)과 유사하지만, 결과를 [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)으로 반환합니다. 일치하는 에셋을 찾을 수 없으면 오류가 발생합니다.

- `key`  [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 단일 실행 파일 애플리케이션 구성의 `assets` 필드에 지정된 사전에서 에셋의 키입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Blob의 선택적 MIME 유형입니다.
  
 
- 반환: [\<Blob\>](/ko/nodejs/api/buffer#class-blob)

### `sea.getRawAsset(key)` {#seagetrawassetkey}

**Added in: v21.7.0, v20.12.0**

이 메서드를 사용하여 빌드 시 단일 실행 파일 애플리케이션에 번들로 묶이도록 구성된 에셋을 검색할 수 있습니다. 일치하는 에셋을 찾을 수 없으면 오류가 발생합니다.

`sea.getAsset()` 또는 `sea.getAssetAsBlob()`과 달리 이 메서드는 복사본을 반환하지 않습니다. 대신, 실행 파일 내부에 번들로 묶인 원시 에셋을 반환합니다.

현재 사용자는 반환된 배열 버퍼에 쓰는 것을 피해야 합니다. 삽입된 섹션이 쓰기 가능으로 표시되지 않거나 올바르게 정렬되지 않은 경우 반환된 배열 버퍼에 쓰면 충돌이 발생할 가능성이 높습니다.

- `key`  [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 단일 실행 파일 애플리케이션 구성의 `assets` 필드에 지정된 사전에서 에셋의 키입니다.
- 반환: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

### 주입된 메인 스크립트의 `require(id)`는 파일 기반이 아닙니다. {#requireid-in-the-injected-main-script-is-not-file-based}

주입된 메인 스크립트의 `require()`는 주입되지 않은 모듈에서 사용할 수 있는 [`require()`](/ko/nodejs/api/modules#requireid)와 동일하지 않습니다. 또한 주입되지 않은 [`require()`](/ko/nodejs/api/modules#requireid)가 가진 [`require.main`](/ko/nodejs/api/modules#accessing-the-main-module)을 제외한 어떤 속성도 없습니다. 내장 모듈을 로드하는 데만 사용할 수 있습니다. 파일 시스템에서만 찾을 수 있는 모듈을 로드하려고 하면 오류가 발생합니다.

파일 기반 `require()`에 의존하는 대신 애플리케이션을 독립 실행형 JavaScript 파일로 번들로 묶어 실행 파일에 주입할 수 있습니다. 이렇게 하면 보다 결정적인 종속성 그래프도 보장됩니다.

그러나 파일 기반 `require()`가 여전히 필요한 경우 다음과 같이 달성할 수도 있습니다.

```js [ESM]
const { createRequire } = require('node:module');
require = createRequire(__filename);
```

### 주입된 메인 스크립트의 \`__filename\` 및 \`module.filename\` {#__filename-and-modulefilename-in-the-injected-main-script}

주입된 메인 스크립트에서 \`__filename\` 및 \`module.filename\`의 값은 \[`process.execPath`](/ko/nodejs/api/process#processexecpath)와 같습니다.

### 주입된 메인 스크립트의 \`__dirname\` {#__dirname-in-the-injected-main-script}

주입된 메인 스크립트에서 \`__dirname\`의 값은 \[`process.execPath`](/ko/nodejs/api/process#processexecpath)의 디렉터리 이름과 같습니다.

## 참고 사항 {#notes}

### 단일 실행 파일 애플리케이션 생성 프로세스 {#single-executable-application-creation-process}

단일 실행 파일 Node.js 애플리케이션을 만드는 도구는 `--experimental-sea-config`로 준비된 blob의 내용을 다음 위치에 주입해야 합니다.

- `node` 바이너리가 [PE](https://en.wikipedia.org/wiki/Portable_Executable) 파일인 경우 `NODE_SEA_BLOB`이라는 리소스
- `node` 바이너리가 [Mach-O](https://en.wikipedia.org/wiki/Mach-O) 파일인 경우 `NODE_SEA` 세그먼트의 `NODE_SEA_BLOB`이라는 섹션
- `node` 바이너리가 [ELF](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format) 파일인 경우 `NODE_SEA_BLOB`이라는 노트

바이너리에서 `NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2:0` [fuse](https://www.electronjs.org/docs/latest/tutorial/fuses) 문자열을 검색하고 마지막 문자를 `1`로 뒤집어 리소스가 주입되었음을 나타냅니다.

### 플랫폼 지원 {#platform-support}

단일 실행 파일 지원은 다음 플랫폼에서만 CI에서 정기적으로 테스트됩니다.

- Windows
- macOS
- Linux (Alpine을 제외한 [Node.js에서 지원하는](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list) 모든 배포판 및 s390x를 제외한 [Node.js에서 지원하는](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list) 모든 아키텍처)

이는 다른 플랫폼에서 이 기능을 테스트하는 데 사용할 수 있는 단일 실행 파일 생성 도구가 부족하기 때문입니다.

다른 리소스 주입 도구/워크플로에 대한 제안을 환영합니다. [https://github.com/nodejs/single-executable/discussions](https://github.com/nodejs/single-executable/discussions)에서 토론을 시작하여 문서화하는 데 도움을 주세요.

