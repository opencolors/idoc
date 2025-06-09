---
title: Node.js 문서
description: Node.js의 포괄적인 문서를 탐색하여 API, 모듈 및 사용 예제를 다루어 개발자가 Node.js를 효과적으로 이해하고 사용할 수 있도록 돕습니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 포괄적인 문서를 탐색하여 API, 모듈 및 사용 예제를 다루어 개발자가 Node.js를 효과적으로 이해하고 사용할 수 있도록 돕습니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 포괄적인 문서를 탐색하여 API, 모듈 및 사용 예제를 다루어 개발자가 Node.js를 효과적으로 이해하고 사용할 수 있도록 돕습니다.
---


# 이 문서에 대하여 {#about-this-documentation}

Node.js 공식 API 참조 문서에 오신 것을 환영합니다!

Node.js는 [V8 JavaScript 엔진](https://v8.dev/) 위에 구축된 JavaScript 런타임입니다.

## 기여 {#contributing}

이 문서의 오류는 [이슈 트래커](https://github.com/nodejs/node/issues/new)에 보고해주세요. 풀 리퀘스트 제출 방법에 대한 지침은 [기여 가이드](https://github.com/nodejs/node/blob/HEAD/CONTRIBUTING.md)를 참조하세요.

## 안정성 지수 {#stability-index}

문서 전체에서 섹션의 안정성을 나타내는 표시가 있습니다. 일부 API는 매우 입증되고 널리 사용되어 변경될 가능성이 거의 없습니다. 다른 API는 최신 및 실험적이거나 위험한 것으로 알려져 있습니다.

안정성 지수는 다음과 같습니다.

::: danger [안정성: 0 - 지원 중단됨]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) 안정성: 0 - 지원 중단됨. 기능이 경고를 표시할 수 있습니다. 이전 버전과의 호환성은 보장되지 않습니다.
:::

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) 안정성: 1 - 실험적. 이 기능은 [시맨틱 버전 관리](https://semver.org/) 규칙의 적용을 받지 않습니다. 이전 버전과 호환되지 않는 변경 또는 제거가 향후 릴리스에서 발생할 수 있습니다. 프로덕션 환경에서는 이 기능의 사용을 권장하지 않습니다.
:::

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) 안정성: 2 - 안정적. npm 생태계와의 호환성이 최우선 순위입니다.
:::

::: info [안정성: 3 - 레거시]
[안정성: 3](/ko/nodejs/api/documentation#stability-index) 안정성: 3 - 레거시. 이 기능이 제거될 가능성은 낮고 시맨틱 버전 관리 보장이 적용되지만 더 이상 활발하게 유지 관리되지 않으며 다른 대안을 사용할 수 있습니다.
:::

기능 사용에 해가 없고 npm 생태계 내에서 널리 사용되는 경우 지원 중단보다는 레거시로 표시됩니다. 레거시 기능에서 발견된 버그는 수정될 가능성이 낮습니다.

특히 라이브러리를 제작할 때 실험적 기능을 사용할 때는 주의하십시오. 사용자는 실험적 기능이 사용되고 있다는 것을 알지 못할 수 있습니다. 실험적 API 수정이 발생하면 버그 또는 동작 변경으로 인해 사용자가 놀랄 수 있습니다. 놀라움을 피하기 위해 실험적 기능을 사용하려면 명령줄 플래그가 필요할 수 있습니다. 실험적 기능은 또한 [경고](/ko/nodejs/api/process#event-warning)를 표시할 수 있습니다.


## 안정성 개요 {#stability-overview}

| API | 안정성 |
| --- | --- |
| [Assert](/ko/nodejs/api/assert) |<div class="custom-block tip"> (2) 안정적 </div>|
| [Async hooks](/ko/nodejs/api/async_hooks) |<div class="custom-block warning"> (1) 실험적 </div>|
| [비동기 컨텍스트 추적](/ko/nodejs/api/async_context) |<div class="custom-block tip"> (2) 안정적 </div>|
| [Buffer](/ko/nodejs/api/buffer) |<div class="custom-block tip"> (2) 안정적 </div>|
| [자식 프로세스](/ko/nodejs/api/child_process) |<div class="custom-block tip"> (2) 안정적 </div>|
| [Cluster](/ko/nodejs/api/cluster) |<div class="custom-block tip"> (2) 안정적 </div>|
| [Console](/ko/nodejs/api/console) |<div class="custom-block tip"> (2) 안정적 </div>|
| [Crypto](/ko/nodejs/api/crypto) |<div class="custom-block tip"> (2) 안정적 </div>|
| [진단 채널](/ko/nodejs/api/diagnostics_channel) |<div class="custom-block tip"> (2) 안정적 </div>|
| [DNS](/ko/nodejs/api/dns) |<div class="custom-block tip"> (2) 안정적 </div>|
| [Domain](/ko/nodejs/api/domain) |<div class="custom-block danger"> (0) 더 이상 사용되지 않음 </div>|
| [파일 시스템](/ko/nodejs/api/fs) |<div class="custom-block tip"> (2) 안정적 </div>|
| [HTTP](/ko/nodejs/api/http) |<div class="custom-block tip"> (2) 안정적 </div>|
| [HTTP/2](/ko/nodejs/api/http2) |<div class="custom-block tip"> (2) 안정적 </div>|
| [HTTPS](/ko/nodejs/api/https) |<div class="custom-block tip"> (2) 안정적 </div>|
| [Inspector](/ko/nodejs/api/inspector) |<div class="custom-block tip"> (2) 안정적 </div>|
| [Modules: `node:module` API](/ko/nodejs/api/module) |<div class="custom-block warning"> (1) .2 - 릴리스 후보 (비동기 버전) 안정성: 1.1 - 활발한 개발 (동기 버전) </div>|
| [Modules: CommonJS modules](/ko/nodejs/api/modules) |<div class="custom-block tip"> (2) 안정적 </div>|
| [Modules: TypeScript](/ko/nodejs/api/typescript) |<div class="custom-block warning"> (1) .1 - 활발한 개발 </div>|
| [OS](/ko/nodejs/api/os) |<div class="custom-block tip"> (2) 안정적 </div>|
| [Path](/ko/nodejs/api/path) |<div class="custom-block tip"> (2) 안정적 </div>|
| [성능 측정 API](/ko/nodejs/api/perf_hooks) |<div class="custom-block tip"> (2) 안정적 </div>|
| [Punycode](/ko/nodejs/api/punycode) |<div class="custom-block danger"> (0) 더 이상 사용되지 않음 </div>|
| [Query string](/ko/nodejs/api/querystring) |<div class="custom-block tip"> (2) 안정적 </div>|
| [Readline](/ko/nodejs/api/readline) |<div class="custom-block tip"> (2) 안정적 </div>|
| [REPL](/ko/nodejs/api/repl) |<div class="custom-block tip"> (2) 안정적 </div>|
| [단일 실행 파일 애플리케이션](/ko/nodejs/api/single-executable-applications) |<div class="custom-block warning"> (1) .1 - 활발한 개발 </div>|
| [SQLite](/ko/nodejs/api/sqlite) |<div class="custom-block warning"> (1) .1 - 활발한 개발. </div>|
| [Stream](/ko/nodejs/api/stream) |<div class="custom-block tip"> (2) 안정적 </div>|
| [String decoder](/ko/nodejs/api/string_decoder) |<div class="custom-block tip"> (2) 안정적 </div>|
| [테스트 러너](/ko/nodejs/api/test) |<div class="custom-block tip"> (2) 안정적 </div>|
| [Timers](/ko/nodejs/api/timers) |<div class="custom-block tip"> (2) 안정적 </div>|
| [TLS (SSL)](/ko/nodejs/api/tls) |<div class="custom-block tip"> (2) 안정적 </div>|
| [Trace events](/ko/nodejs/api/tracing) |<div class="custom-block warning"> (1) 실험적 </div>|
| [TTY](/ko/nodejs/api/tty) |<div class="custom-block tip"> (2) 안정적 </div>|
| [UDP/데이터그램 소켓](/ko/nodejs/api/dgram) |<div class="custom-block tip"> (2) 안정적 </div>|
| [URL](/ko/nodejs/api/url) |<div class="custom-block tip"> (2) 안정적 </div>|
| [Util](/ko/nodejs/api/util) |<div class="custom-block tip"> (2) 안정적 </div>|
| [VM (JavaScript 실행)](/ko/nodejs/api/vm) |<div class="custom-block tip"> (2) 안정적 </div>|
| [Web Crypto API](/ko/nodejs/api/webcrypto) |<div class="custom-block tip"> (2) 안정적 </div>|
| [Web Streams API](/ko/nodejs/api/webstreams) |<div class="custom-block tip"> (2) 안정적 </div>|
| [WebAssembly System Interface (WASI)](/ko/nodejs/api/wasi) |<div class="custom-block warning"> (1) 실험적 </div>|
| [Worker threads](/ko/nodejs/api/worker_threads) |<div class="custom-block tip"> (2) 안정적 </div>|
| [Zlib](/ko/nodejs/api/zlib) |<div class="custom-block tip"> (2) 안정적 </div>|


## JSON 출력 {#json-output}

**추가된 버전: v0.6.12**

모든 `.html` 문서에는 해당하는 `.json` 문서가 있습니다. 이는 IDE 및 문서를 사용하는 기타 유틸리티를 위한 것입니다.

## 시스템 호출 및 man 페이지 {#system-calls-and-man-pages}

시스템 호출을 래핑하는 Node.js 함수는 이를 문서화합니다. 문서는 시스템 호출 작동 방식을 설명하는 해당 man 페이지에 연결됩니다.

대부분의 Unix 시스템 호출에는 Windows 아날로그가 있습니다. 그럼에도 불구하고 동작 차이는 불가피할 수 있습니다.

