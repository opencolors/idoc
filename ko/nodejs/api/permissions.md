---
title: Node.js 권한 API
description: Node.js 권한 API 문서는 Node.js 애플리케이션 내에서 다양한 작업의 권한을 관리하고 제어하는 방법을 설명하여 시스템 자원에 대한 안전하고 통제된 접근을 보장합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 권한 API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 권한 API 문서는 Node.js 애플리케이션 내에서 다양한 작업의 권한을 관리하고 제어하는 방법을 설명하여 시스템 자원에 대한 안전하고 통제된 접근을 보장합니다.
  - - meta
    - name: twitter:title
      content: Node.js 권한 API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 권한 API 문서는 Node.js 애플리케이션 내에서 다양한 작업의 권한을 관리하고 제어하는 방법을 설명하여 시스템 자원에 대한 안전하고 통제된 접근을 보장합니다.
---


# 권한 {#permissions}

권한은 Node.js 프로세스가 액세스할 수 있는 시스템 리소스 또는 프로세스가 해당 리소스로 수행할 수 있는 작업을 제어하는 데 사용될 수 있습니다.

- [프로세스 기반 권한](/ko/nodejs/api/permissions#process-based-permissions)은 Node.js 프로세스의 리소스 액세스를 제어합니다. 리소스는 완전히 허용되거나 거부될 수 있으며, 관련 작업은 제어될 수 있습니다. 예를 들어 파일 시스템 읽기는 허용하면서 쓰기는 거부할 수 있습니다. 이 기능은 악성 코드로부터 보호하지 않습니다. Node.js [보안 정책](https://github.com/nodejs/node/blob/main/SECURITY.md)에 따라 Node.js는 실행하도록 요청받은 모든 코드를 신뢰합니다.

권한 모델은 "안전 벨트" 접근 방식을 구현하여 신뢰할 수 있는 코드가 의도치 않게 파일을 변경하거나 명시적으로 권한이 부여되지 않은 리소스를 사용하는 것을 방지합니다. 악성 코드가 있는 경우 보안 보증을 제공하지 않습니다. 악성 코드는 권한 모델을 우회하고 권한 모델에서 부과하는 제한 없이 임의 코드를 실행할 수 있습니다.

잠재적인 보안 취약점을 발견한 경우 [보안 정책](https://github.com/nodejs/node/blob/main/SECURITY.md)을 참조하십시오.

## 프로세스 기반 권한 {#process-based-permissions}

### 권한 모델 {#permission-model}

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적.
:::

Node.js 권한 모델은 실행 중에 특정 리소스에 대한 액세스를 제한하는 메커니즘입니다. API는 플래그 [`--permission`](/ko/nodejs/api/cli#--permission) 뒤에 존재하며, 활성화되면 사용 가능한 모든 권한에 대한 액세스를 제한합니다.

사용 가능한 권한은 [`--permission`](/ko/nodejs/api/cli#--permission) 플래그에 의해 문서화됩니다.

`--permission`으로 Node.js를 시작하면 `fs` 모듈을 통해 파일 시스템에 액세스하고, 프로세스를 생성하고, `node:worker_threads`를 사용하고, 네이티브 애드온을 사용하고, WASI를 사용하고, 런타임 검사기를 활성화하는 기능이 제한됩니다.

```bash [BASH]
$ node --permission index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:23:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FileSystemRead',
  resource: '/home/user/index.js'
}
```
프로세스 생성을 허용하고 워커 스레드를 생성하는 것은 각각 [`--allow-child-process`](/ko/nodejs/api/cli#--allow-child-process) 및 [`--allow-worker`](/ko/nodejs/api/cli#--allow-worker)를 사용하여 수행할 수 있습니다.

권한 모델을 사용할 때 네이티브 애드온을 허용하려면 [`--allow-addons`](/ko/nodejs/api/cli#--allow-addons) 플래그를 사용하십시오. WASI의 경우 [`--allow-wasi`](/ko/nodejs/api/cli#--allow-wasi) 플래그를 사용하십시오.


#### 런타임 API {#runtime-api}

[`--permission`](/ko/nodejs/api/cli#--permission) 플래그를 통해 권한 모델을 활성화하면 `process` 객체에 새로운 속성인 `permission`이 추가됩니다. 이 속성은 하나의 함수를 포함합니다.

##### `permission.has(scope[, reference])` {#permissionhasscope-reference}

런타임 시 권한을 확인하기 위한 API 호출입니다. ([`permission.has()`](/ko/nodejs/api/process#processpermissionhasscope-reference))

```js [ESM]
process.permission.has('fs.write'); // true
process.permission.has('fs.write', '/home/rafaelgss/protected-folder'); // true

process.permission.has('fs.read'); // true
process.permission.has('fs.read', '/home/rafaelgss/protected-folder'); // false
```
#### 파일 시스템 권한 {#file-system-permissions}

권한 모델은 기본적으로 `node:fs` 모듈을 통해 파일 시스템에 대한 접근을 제한합니다. 이것은 사용자가 `node:sqlite` 모듈과 같은 다른 수단을 통해 파일 시스템에 접근할 수 없음을 보장하지 않습니다.

파일 시스템에 대한 접근을 허용하려면 [`--allow-fs-read`](/ko/nodejs/api/cli#--allow-fs-read) 및 [`--allow-fs-write`](/ko/nodejs/api/cli#--allow-fs-write) 플래그를 사용하십시오.

```bash [BASH]
$ node --permission --allow-fs-read=* --allow-fs-write=* index.js
Hello world!
```
두 플래그에 대한 유효한 인수는 다음과 같습니다.

- `*` - 각각 모든 `FileSystemRead` 또는 `FileSystemWrite` 작업을 허용합니다.
- 쉼표(`,`)로 구분된 경로는 각각 일치하는 `FileSystemRead` 또는 `FileSystemWrite` 작업만 허용합니다.

예:

- `--allow-fs-read=*` - 모든 `FileSystemRead` 작업을 허용합니다.
- `--allow-fs-write=*` - 모든 `FileSystemWrite` 작업을 허용합니다.
- `--allow-fs-write=/tmp/` - `/tmp/` 폴더에 대한 `FileSystemWrite` 접근을 허용합니다.
- `--allow-fs-read=/tmp/ --allow-fs-read=/home/.gitignore` - `/tmp/` 폴더 **및** `/home/.gitignore` 경로에 대한 `FileSystemRead` 접근을 허용합니다.

와일드카드도 지원됩니다.

- `--allow-fs-read=/home/test*`는 와일드카드와 일치하는 모든 것에 대한 읽기 접근을 허용합니다. 예: `/home/test/file1` 또는 `/home/test2`

와일드카드 문자(`*`)를 전달한 후에는 모든 후속 문자가 무시됩니다. 예를 들어 `/home/*.js`는 `/home/*`와 유사하게 작동합니다.

권한 모델이 초기화되면 지정된 디렉터리가 존재하는 경우 자동으로 와일드카드(*)를 추가합니다. 예를 들어 `/home/test/files`가 존재하면 `/home/test/files/*`로 처리됩니다. 그러나 디렉터리가 존재하지 않으면 와일드카드가 추가되지 않고 접근은 `/home/test/files`로 제한됩니다. 아직 존재하지 않는 폴더에 대한 접근을 허용하려면 와일드카드를 명시적으로 포함해야 합니다. `/my-path/folder-do-not-exist/*`.


#### 권한 모델 제약 조건 {#permission-model-constraints}

이 시스템을 사용하기 전에 알아야 할 제약 조건이 있습니다.

- 모델은 자식 노드 프로세스 또는 워커 스레드로 상속되지 않습니다.
- 권한 모델을 사용할 때 다음 기능이 제한됩니다.
    - 네이티브 모듈
    - 자식 프로세스
    - 워커 스레드
    - 검사기 프로토콜
    - 파일 시스템 액세스
    - WASI
  
 
- 권한 모델은 Node.js 환경이 설정된 후에 초기화됩니다. 그러나 `--env-file` 또는 `--openssl-config`와 같은 특정 플래그는 환경 초기화 전에 파일을 읽도록 설계되었습니다. 결과적으로 이러한 플래그는 권한 모델의 규칙을 따르지 않습니다. `v8.setFlagsFromString`을 통해 런타임을 통해 설정할 수 있는 V8 플래그에도 동일하게 적용됩니다.
- 권한 모델이 활성화된 경우 런타임에 OpenSSL 엔진을 요청할 수 없으므로 기본 crypto, https 및 tls 모듈에 영향을 미칩니다.
- 권한 모델이 활성화된 경우 런타임 로드 가능 확장 프로그램을 로드할 수 없으므로 sqlite 모듈에 영향을 미칩니다.
- `node:fs` 모듈을 통해 기존 파일 설명자를 사용하면 권한 모델을 우회합니다.

#### 제한 사항 및 알려진 문제점 {#limitations-and-known-issues}

- 기호 링크는 액세스 권한이 부여된 경로 집합 외부의 위치로도 따라갑니다. 상대 기호 링크는 임의의 파일 및 디렉터리에 대한 액세스를 허용할 수 있습니다. 권한 모델을 활성화한 상태로 애플리케이션을 시작할 때 액세스 권한이 부여된 경로에 상대 기호 링크가 포함되어 있지 않은지 확인해야 합니다.

