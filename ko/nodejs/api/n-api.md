---
title: Node.js N-API 문서
description: N-API(Node.js API)는 네이티브 애드온에 대해 안정적이고 일관된 인터페이스를 제공하여, 개발자가 다양한 Node.js 버전과 호환되는 모듈을 만들 수 있게 합니다.
head:
  - - meta
    - name: og:title
      content: Node.js N-API 문서 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: N-API(Node.js API)는 네이티브 애드온에 대해 안정적이고 일관된 인터페이스를 제공하여, 개발자가 다양한 Node.js 버전과 호환되는 모듈을 만들 수 있게 합니다.
  - - meta
    - name: twitter:title
      content: Node.js N-API 문서 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: N-API(Node.js API)는 네이티브 애드온에 대해 안정적이고 일관된 인터페이스를 제공하여, 개발자가 다양한 Node.js 버전과 호환되는 모듈을 만들 수 있게 합니다.
---


# Node-API {#node-api}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ko/nodejs/api/documentation#stability-index) [Stability: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

Node-API (이전 명칭: N-API)는 네이티브 애드온을 빌드하기 위한 API입니다. 기본 JavaScript 런타임(예: V8)과는 독립적이며 Node.js 자체의 일부로 유지 관리됩니다. 이 API는 Node.js 버전 간에 ABI(Application Binary Interface) 안정성을 유지합니다. 이는 애드온이 기본 JavaScript 엔진의 변경 사항으로부터 격리되도록 하고, 한 주요 버전에 대해 컴파일된 모듈이 재컴파일 없이 이후 주요 버전의 Node.js에서 실행될 수 있도록 하기 위한 것입니다. [ABI 안정성](https://nodejs.org/en/docs/guides/abi-stability/) 가이드에서 더 자세한 설명을 제공합니다.

애드온은 [C++ 애드온](/ko/nodejs/api/addons) 섹션에 설명된 것과 동일한 접근 방식/도구를 사용하여 빌드/패키징됩니다. 유일한 차이점은 네이티브 코드에서 사용되는 API 세트입니다. V8 또는 [Native Abstractions for Node.js](https://github.com/nodejs/nan) API 대신 Node-API에서 사용 가능한 함수가 사용됩니다.

Node-API에서 노출하는 API는 일반적으로 JavaScript 값을 만들고 조작하는 데 사용됩니다. 개념 및 작업은 일반적으로 ECMA-262 언어 사양에 지정된 아이디어에 매핑됩니다. API에는 다음과 같은 속성이 있습니다.

- 모든 Node-API 호출은 `napi_status` 유형의 상태 코드를 반환합니다. 이 상태는 API 호출이 성공했는지 실패했는지 나타냅니다.
- API의 반환 값은 출력 매개변수를 통해 전달됩니다.
- 모든 JavaScript 값은 `napi_value`라는 불투명 유형 뒤에 추상화됩니다.
- 오류 상태 코드의 경우 `napi_get_last_error_info`를 사용하여 추가 정보를 얻을 수 있습니다. 자세한 내용은 오류 처리 섹션 [오류 처리](/ko/nodejs/api/n-api#error-handling)에서 확인할 수 있습니다.

Node-API는 Node.js 버전 및 다양한 컴파일러 수준에서 ABI 안정성을 보장하는 C API입니다. C++ API는 사용하기 더 쉬울 수 있습니다. C++ 사용을 지원하기 위해 프로젝트는 [`node-addon-api`](https://github.com/nodejs/node-addon-api)라는 C++ 래퍼 모듈을 유지 관리합니다. 이 래퍼는 인라인 가능한 C++ API를 제공합니다. `node-addon-api`로 빌드된 바이너리는 Node.js에서 내보낸 Node-API C 기반 함수의 기호에 의존합니다. `node-addon-api`는 Node-API를 호출하는 코드를 작성하는 더 효율적인 방법입니다. 다음 `node-addon-api` 코드를 예로 들어보겠습니다. 첫 번째 섹션은 `node-addon-api` 코드를 보여주고 두 번째 섹션은 애드온에서 실제로 사용되는 코드를 보여줍니다.

```C++ [C++]
Object obj = Object::New(env);
obj["foo"] = String::New(env, "bar");
```
```C++ [C++]
napi_status status;
napi_value object, string;
status = napi_create_object(env, &object);
if (status != napi_ok) {
  napi_throw_error(env, ...);
  return;
}

status = napi_create_string_utf8(env, "bar", NAPI_AUTO_LENGTH, &string);
if (status != napi_ok) {
  napi_throw_error(env, ...);
  return;
}

status = napi_set_named_property(env, object, "foo", string);
if (status != napi_ok) {
  napi_throw_error(env, ...);
  return;
}
```
최종 결과는 애드온이 내보낸 C API만 사용한다는 것입니다. 결과적으로 C API에서 제공하는 ABI 안정성의 이점을 얻을 수 있습니다.

C API 대신 `node-addon-api`를 사용하는 경우 `node-addon-api`에 대한 API [문서](https://github.com/nodejs/node-addon-api#api-documentation)부터 시작하십시오.

[Node-API 리소스](https://nodejs.github.io/node-addon-examples/)는 Node-API 및 `node-addon-api`를 처음 시작하는 개발자를 위한 훌륭한 방향 제시 및 팁을 제공합니다. 추가 미디어 리소스는 [Node-API 미디어](https://github.com/nodejs/abi-stable-node/blob/HEAD/node-api-media.md) 페이지에서 찾을 수 있습니다.


## ABI 안정성의 의미 {#implications-of-abi-stability}

Node-API는 ABI 안정성을 보장하지만, Node.js의 다른 부분은 그렇지 않으며, 애드온에서 사용되는 모든 외부 라이브러리도 마찬가지일 수 있습니다. 특히, 다음 API는 주요 버전 간에 ABI 안정성을 보장하지 않습니다.

- 다음을 통해 사용할 수 있는 Node.js C++ API
- Node.js에 포함되어 다음을 통해 사용할 수 있는 libuv API
- 다음을 통해 사용할 수 있는 V8 API

따라서 애드온이 Node.js 주요 버전에서 ABI 호환성을 유지하려면 다음을 사용하여 Node-API를 독점적으로 사용해야 합니다.

```C [C]
#include <node_api.h>
```
그리고 사용하는 모든 외부 라이브러리에 대해 해당 외부 라이브러리가 Node-API와 유사한 ABI 안정성 보장을 하는지 확인해야 합니다.

## 빌드 {#building}

JavaScript로 작성된 모듈과 달리 Node-API를 사용하여 Node.js 네이티브 애드온을 개발하고 배포하려면 추가적인 도구 세트가 필요합니다. Node.js 개발에 필요한 기본 도구 외에도 네이티브 애드온 개발자는 C 및 C++ 코드를 바이너리로 컴파일할 수 있는 툴체인이 필요합니다. 또한 네이티브 애드온 배포 방식에 따라 네이티브 애드온 *사용자*도 C/C++ 툴체인을 설치해야 합니다.

Linux 개발자의 경우 필요한 C/C++ 툴체인 패키지를 쉽게 구할 수 있습니다. [GCC](https://gcc.gnu.org/)는 다양한 플랫폼에서 빌드 및 테스트하기 위해 Node.js 커뮤니티에서 널리 사용됩니다. 많은 개발자에게 [LLVM](https://llvm.org/) 컴파일러 인프라도 좋은 선택입니다.

Mac 개발자의 경우 [Xcode](https://developer.apple.com/xcode/)는 필요한 모든 컴파일러 도구를 제공합니다. 그러나 전체 Xcode IDE를 설치할 필요는 없습니다. 다음 명령은 필요한 툴체인을 설치합니다.

```bash [BASH]
xcode-select --install
```
Windows 개발자의 경우 [Visual Studio](https://visualstudio.microsoft.com/)는 필요한 모든 컴파일러 도구를 제공합니다. 그러나 전체 Visual Studio IDE를 설치할 필요는 없습니다. 다음 명령은 필요한 툴체인을 설치합니다.

```bash [BASH]
npm install --global windows-build-tools
```
아래 섹션에서는 Node.js 네이티브 애드온을 개발하고 배포하는 데 사용할 수 있는 추가 도구에 대해 설명합니다.


### 빌드 도구 {#build-tools}

여기에 나열된 도구들은 네이티브 애드온의 *사용자*가 네이티브 애드온을 성공적으로 설치하려면 C/C++ 툴체인이 설치되어 있어야 합니다.

#### node-gyp {#node-gyp}

[node-gyp](https://github.com/nodejs/node-gyp)는 Google의 [GYP](https://gyp.gsrc.io/) 도구의 [gyp-next](https://github.com/nodejs/gyp-next) 포크를 기반으로 하는 빌드 시스템이며 npm과 함께 번들로 제공됩니다. GYP와 node-gyp은 Python이 설치되어 있어야 합니다.

과거에 node-gyp는 네이티브 애드온 빌드를 위한 도구로 선택되었습니다. 널리 채택되고 문서화되었습니다. 그러나 일부 개발자는 node-gyp의 제한 사항에 직면했습니다.

#### CMake.js {#cmakejs}

[CMake.js](https://github.com/cmake-js/cmake-js)는 [CMake](https://cmake.org/)를 기반으로 하는 대안 빌드 시스템입니다.

CMake.js는 이미 CMake를 사용하는 프로젝트나 node-gyp의 제한 사항에 영향을 받는 개발자에게 좋은 선택입니다. [`build_with_cmake`](https://github.com/nodejs/node-addon-examples/tree/main/src/8-tooling/build_with_cmake)는 CMake 기반 네이티브 애드온 프로젝트의 예입니다.

### 미리 컴파일된 바이너리 업로드 {#uploading-precompiled-binaries}

여기에 나열된 세 가지 도구를 사용하면 네이티브 애드온 개발자와 유지 관리자가 바이너리를 공용 또는 개인 서버에 만들고 업로드할 수 있습니다. 이러한 도구는 일반적으로 [Travis CI](https://travis-ci.org/) 및 [AppVeyor](https://www.appveyor.com/)와 같은 CI/CD 빌드 시스템과 통합되어 다양한 플랫폼 및 아키텍처에 대한 바이너리를 빌드하고 업로드합니다. 이러한 바이너리는 C/C++ 툴체인을 설치할 필요가 없는 사용자가 다운로드할 수 있습니다.

#### node-pre-gyp {#node-pre-gyp}

[node-pre-gyp](https://github.com/mapbox/node-pre-gyp)는 개발자가 선택한 서버에 바이너리를 업로드하는 기능을 추가하는 node-gyp 기반 도구입니다. node-pre-gyp는 특히 Amazon S3에 바이너리를 업로드하는 데 대한 지원이 좋습니다.

#### prebuild {#prebuild}

[prebuild](https://github.com/prebuild/prebuild)는 node-gyp 또는 CMake.js를 사용하여 빌드를 지원하는 도구입니다. 다양한 서버를 지원하는 node-pre-gyp와 달리 prebuild는 바이너리를 [GitHub 릴리스](https://help.github.com/en/github/administering-a-repository/about-releases)에만 업로드합니다. prebuild는 CMake.js를 사용하는 GitHub 프로젝트에 좋은 선택입니다.


#### prebuildify {#prebuildify}

[prebuildify](https://github.com/prebuild/prebuildify)는 node-gyp을 기반으로 하는 도구입니다. prebuildify의 장점은 빌드된 바이너리가 npm에 업로드될 때 네이티브 애드온과 함께 번들로 제공된다는 것입니다. 바이너리는 npm에서 다운로드되며 네이티브 애드온이 설치될 때 모듈 사용자에게 즉시 제공됩니다.

## 사용법 {#usage}

Node-API 함수를 사용하려면 Node 개발 트리의 src 디렉토리에 있는 [`node_api.h`](https://github.com/nodejs/node/blob/HEAD/src/node_api.h) 파일을 포함하세요.

```C [C]
#include <node_api.h>
```
이렇게 하면 주어진 Node.js 릴리스에 대한 기본 `NAPI_VERSION`을 선택합니다. 특정 버전의 Node-API와의 호환성을 보장하려면 헤더를 포함할 때 버전을 명시적으로 지정할 수 있습니다.

```C [C]
#define NAPI_VERSION 3
#include <node_api.h>
```
이렇게 하면 Node-API 표면이 지정된 (및 이전) 버전에서 사용할 수 있는 기능으로만 제한됩니다.

Node-API 표면의 일부는 실험적이며 명시적인 선택이 필요합니다.

```C [C]
#define NAPI_EXPERIMENTAL
#include <node_api.h>
```
이 경우 실험적 API를 포함한 전체 API 표면을 모듈 코드에서 사용할 수 있습니다.

경우에 따라 이미 릴리스되고 안정적인 API에 영향을 미치는 실험적 기능이 도입됩니다. 이러한 기능은 옵트 아웃으로 비활성화할 수 있습니다.

```C [C]
#define NAPI_EXPERIMENTAL
#define NODE_API_EXPERIMENTAL_<FEATURE_NAME>_OPT_OUT
#include <node_api.h>
```
여기서 `\<FEATURE_NAME\>`은 실험적 및 안정적인 API 모두에 영향을 미치는 실험적 기능의 이름입니다.

## Node-API 버전 매트릭스 {#node-api-version-matrix}

버전 9까지 Node-API 버전은 추가적이었고 Node.js와 독립적으로 버전이 관리되었습니다. 즉, 모든 버전은 이전 버전의 모든 API와 몇 가지 추가 사항이 있는 이전 버전의 확장이라는 의미입니다. 각 Node.js 버전은 단일 Node-API 버전만 지원했습니다. 예를 들어 v18.15.0은 Node-API 버전 8만 지원합니다. ABI 안정성은 8이 이전 버전의 엄격한 슈퍼셋이었기 때문에 달성되었습니다.

버전 9부터 Node-API 버전은 계속 독립적으로 버전이 관리되지만 Node-API 버전 9로 실행되는 애드온은 Node-API 버전 10으로 실행하려면 코드 업데이트가 필요할 수 있습니다. 그러나 ABI 안정성은 유지됩니다. Node-API 버전 9 이상을 지원하는 Node.js 버전은 8과 지원하는 최고 버전 사이의 모든 버전을 지원하고 애드온이 더 높은 Node-API 버전을 선택하지 않는 한 기본적으로 버전 8 API를 제공하기 때문입니다. 이 접근 방식은 ABI 안정성을 유지하면서 기존 Node-API 함수를 더 잘 최적화할 수 있는 유연성을 제공합니다. 기존 애드온은 이전 버전의 Node-API를 사용하여 다시 컴파일하지 않고도 계속 실행할 수 있습니다. 애드온에 최신 Node-API 버전의 기능이 필요한 경우 해당 새 기능을 사용하려면 기존 코드를 변경하고 다시 컴파일해야 합니다.

Node-API 버전 9 이상을 지원하는 Node.js 버전에서 `NAPI_VERSION=X`를 정의하고 기존 애드온 초기화 매크로를 사용하면 런타임에 사용될 요청된 Node-API 버전이 애드온에 내장됩니다. `NAPI_VERSION`이 설정되지 않으면 기본적으로 8로 설정됩니다.

이 표는 이전 스트림에서 최신 상태가 아닐 수 있으며, 최신 정보는 [Node-API 버전 매트릭스](/ko/nodejs/api/n-api#node-api-version-matrix)의 최신 API 문서에 있습니다.

| Node-API 버전 | 지원되는 버전 |
|---|---|
| 9 | v18.17.0+, 20.3.0+, 21.0.0 이상 모든 버전 |
| 8 | v12.22.0+, v14.17.0+, v15.12.0+, 16.0.0 이상 모든 버전 |
| 7 | v10.23.0+, v12.19.0+, v14.12.0+, 15.0.0 이상 모든 버전 |
| 6 | v10.20.0+, v12.17.0+, 14.0.0 이상 모든 버전 |
| 5 | v10.17.0+, v12.11.0+, 13.0.0 이상 모든 버전 |
| 4 | v10.16.0+, v11.8.0+, 12.0.0 이상 모든 버전 |
| 3 | v6.14.2*, 8.11.2+, v9.11.0+*, 10.0.0 이상 모든 버전 |
| 2 | v8.10.0+*, v9.3.0+*, 10.0.0 이상 모든 버전 |
| 1 | v8.6.0+**, v9.0.0+*, 10.0.0 이상 모든 버전 |

* Node-API는 실험적이었습니다.

** Node.js 8.0.0은 Node-API를 실험적으로 포함했습니다. Node-API 버전 1로 릴리스되었지만 Node.js 8.6.0까지 계속 발전했습니다. API는 Node.js 8.6.0 이전 버전에서 다릅니다. Node-API 버전 3 이상을 사용하는 것이 좋습니다.

Node-API에 대해 문서화된 각 API에는 `added in:`이라는 헤더가 있고, 안정적인 API에는 추가 헤더 `Node-API version:`이 있습니다. API는 `Node-API version:`에 표시된 Node-API 버전 이상을 지원하는 Node.js 버전을 사용할 때 직접 사용할 수 있습니다. `Node-API version:`이 나열되지 않았거나 `Node-API version:`이 나열되지 않은 Node.js 버전을 사용하는 경우 `#define NAPI_EXPERIMENTAL`이 `node_api.h` 또는 `js_native_api.h` 포함 앞에 오는 경우에만 API를 사용할 수 있습니다. API가 `added in:`에 표시된 것보다 최신 Node.js 버전에서 사용할 수 없는 것으로 나타나면 이것이 명백한 부재의 가장 큰 이유일 가능성이 높습니다.

네이티브 코드에서 ECMAScript 기능에 액세스하는 것과 엄격하게 관련된 Node-API는 `js_native_api.h` 및 `js_native_api_types.h`에서 별도로 찾을 수 있습니다. 이러한 헤더에 정의된 API는 `node_api.h` 및 `node_api_types.h`에 포함되어 있습니다. 헤더는 Node.js 외부에서 Node-API 구현을 허용하기 위해 이러한 방식으로 구성됩니다. 이러한 구현의 경우 Node.js 특정 API가 적용되지 않을 수 있습니다.

애드온의 Node.js 특정 부분을 JavaScript 환경에 실제 기능을 노출하는 코드와 분리하여 후자를 Node-API의 여러 구현과 함께 사용할 수 있도록 할 수 있습니다. 아래 예에서 `addon.c` 및 `addon.h`는 `js_native_api.h`만 참조합니다. 이렇게 하면 `addon.c`를 Node-API의 Node.js 구현 또는 Node.js 외부의 Node-API 구현에 대해 컴파일하는 데 재사용할 수 있습니다.

`addon_node.c`는 애드온에 대한 Node.js 특정 진입점을 포함하고 애드온이 Node.js 환경에 로드될 때 `addon.c`를 호출하여 애드온을 인스턴스화하는 별도의 파일입니다.

```C [C]
// addon.h
#ifndef _ADDON_H_
#define _ADDON_H_
#include <js_native_api.h>
napi_value create_addon(napi_env env);
#endif  // _ADDON_H_
```
```C [C]
// addon.c
#include "addon.h"

#define NODE_API_CALL(env, call)                                  \
  do {                                                            \
    napi_status status = (call);                                  \
    if (status != napi_ok) {                                      \
      const napi_extended_error_info* error_info = NULL;          \
      napi_get_last_error_info((env), &error_info);               \
      const char* err_message = error_info->error_message;        \
      bool is_pending;                                            \
      napi_is_exception_pending((env), &is_pending);              \
      /* If an exception is already pending, don't rethrow it */  \
      if (!is_pending) {                                          \
        const char* message = (err_message == NULL)               \
            ? "empty error message"                               \
            : err_message;                                        \
        napi_throw_error((env), NULL, message);                   \
      }                                                           \
      return NULL;                                                \
    }                                                             \
  } while(0)

static napi_value
DoSomethingUseful(napi_env env, napi_callback_info info) {
  // Do something useful.
  return NULL;
}

napi_value create_addon(napi_env env) {
  napi_value result;
  NODE_API_CALL(env, napi_create_object(env, &result));

  napi_value exported_function;
  NODE_API_CALL(env, napi_create_function(env,
                                          "doSomethingUseful",
                                          NAPI_AUTO_LENGTH,
                                          DoSomethingUseful,
                                          NULL,
                                          &exported_function));

  NODE_API_CALL(env, napi_set_named_property(env,
                                             result,
                                             "doSomethingUseful",
                                             exported_function));

  return result;
}
```
```C [C]
// addon_node.c
#include <node_api.h>
#include "addon.h"

NAPI_MODULE_INIT(/* napi_env env, napi_value exports */) {
  // This function body is expected to return a `napi_value`.
  // The variables `napi_env env` and `napi_value exports` may be used within
  // the body, as they are provided by the definition of `NAPI_MODULE_INIT()`.
  return create_addon(env);
}
```

## 환경 수명 주기 API {#environment-life-cycle-apis}

[ECMAScript 언어 사양](https://tc39.github.io/ecma262/)의 [섹션 8.7](https://tc39.github.io/ecma262/#sec-agents)은 JavaScript 코드가 실행되는 자체 포함 환경인 "에이전트"의 개념을 정의합니다. 이러한 에이전트는 프로세스에 의해 동시에 또는 순차적으로 시작 및 종료될 수 있습니다.

Node.js 환경은 ECMAScript 에이전트에 해당합니다. 기본 프로세스에서는 환경이 시작 시 생성되고 추가 환경은 별도의 스레드에서 생성되어 [워커 스레드](https://nodejs.org/api/worker_threads) 역할을 할 수 있습니다. Node.js가 다른 애플리케이션에 내장된 경우 애플리케이션의 기본 스레드는 애플리케이션 프로세스의 수명 주기 동안 Node.js 환경을 여러 번 생성하고 소멸시킬 수도 있습니다. 따라서 애플리케이션에서 생성한 각 Node.js 환경은 수명 주기 동안 워커 스레드로 추가 환경을 생성하고 소멸시킬 수 있습니다.

네이티브 애드온의 관점에서 이는 바인딩이 여러 컨텍스트에서 여러 번 호출될 수 있고 여러 스레드에서 동시에 호출될 수도 있음을 의미합니다.

네이티브 애드온은 Node.js 환경의 수명 주기 동안 사용하는 전역 상태를 할당해야 할 수 있습니다. 따라서 상태는 애드온의 각 인스턴스에 고유할 수 있습니다.

이를 위해 Node-API는 수명 주기가 Node.js 환경의 수명 주기에 연결되도록 데이터를 연결하는 방법을 제공합니다.

### `napi_set_instance_data` {#napi_set_instance_data}

**추가된 버전: v12.8.0, v10.20.0**

**N-API 버전: 6**

```C [C]
napi_status napi_set_instance_data(node_api_basic_env env,
                                   void* data,
                                   napi_finalize finalize_cb,
                                   void* finalize_hint);
```
- `[in] env`: Node-API 호출이 호출되는 환경입니다.
- `[in] data`: 이 인스턴스의 바인딩에 사용할 수 있도록 할 데이터 항목입니다.
- `[in] finalize_cb`: 환경이 해체될 때 호출할 함수입니다. 함수는 `data`를 수신하므로 해제할 수 있습니다. [`napi_finalize`](/ko/nodejs/api/n-api#napi_finalize)는 자세한 내용을 제공합니다.
- `[in] finalize_hint`: 수집 중에 종료 콜백에 전달할 선택적 힌트입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 `data`를 현재 실행 중인 Node.js 환경과 연결합니다. `data`는 나중에 `napi_get_instance_data()`를 사용하여 검색할 수 있습니다. `napi_set_instance_data()`에 대한 이전 호출을 통해 설정된 현재 실행 중인 Node.js 환경과 연결된 기존 데이터는 덮어쓰여집니다. 이전 호출에서 `finalize_cb`가 제공된 경우 호출되지 않습니다.


### `napi_get_instance_data` {#napi_get_instance_data}

**추가된 버전: v12.8.0, v10.20.0**

**N-API 버전: 6**

```C [C]
napi_status napi_get_instance_data(node_api_basic_env env,
                                   void** data);
```
- `[in] env`: Node-API 호출이 호출되는 환경입니다.
- `[out] data`: `napi_set_instance_data()` 호출에 의해 이전에 현재 실행 중인 Node.js 환경과 연결된 데이터 항목입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 `napi_set_instance_data()`를 통해 이전에 현재 실행 중인 Node.js 환경과 연결된 데이터를 검색합니다. 데이터가 설정되지 않은 경우 호출은 성공하고 `data`는 `NULL`로 설정됩니다.

## 기본 Node-API 데이터 형식 {#basic-node-api-data-types}

Node-API는 다양한 API에서 사용되는 추상화로서 다음과 같은 기본 데이터 형식을 노출합니다. 이러한 API는 불투명하게 처리되어야 하며 다른 Node-API 호출로만 조사할 수 있습니다.

### `napi_status` {#napi_status}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

Node-API 호출의 성공 또는 실패를 나타내는 정수 상태 코드입니다. 현재 다음과 같은 상태 코드가 지원됩니다.

```C [C]
typedef enum {
  napi_ok,
  napi_invalid_arg,
  napi_object_expected,
  napi_string_expected,
  napi_name_expected,
  napi_function_expected,
  napi_number_expected,
  napi_boolean_expected,
  napi_array_expected,
  napi_generic_failure,
  napi_pending_exception,
  napi_cancelled,
  napi_escape_called_twice,
  napi_handle_scope_mismatch,
  napi_callback_scope_mismatch,
  napi_queue_full,
  napi_closing,
  napi_bigint_expected,
  napi_date_expected,
  napi_arraybuffer_expected,
  napi_detachable_arraybuffer_expected,
  napi_would_deadlock,  /* 사용되지 않음 */
  napi_no_external_buffers_allowed,
  napi_cannot_run_js
} napi_status;
```
API가 실패 상태를 반환할 때 추가 정보가 필요한 경우 `napi_get_last_error_info`를 호출하여 얻을 수 있습니다.

### `napi_extended_error_info` {#napi_extended_error_info}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
typedef struct {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
} napi_extended_error_info;
```
- `error_message`: VM 중립적인 오류 설명을 포함하는 UTF8 인코딩된 문자열입니다.
- `engine_reserved`: VM별 오류 세부 정보에 예약되어 있습니다. 현재 어떤 VM에도 구현되지 않았습니다.
- `engine_error_code`: VM별 오류 코드입니다. 현재 어떤 VM에도 구현되지 않았습니다.
- `error_code`: 마지막 오류에서 발생한 Node-API 상태 코드입니다.

자세한 내용은 [오류 처리](/ko/nodejs/api/n-api#error-handling) 섹션을 참조하세요.


### `napi_env` {#napi_env}

`napi_env`는 Node-API 구현체가 VM 관련 상태를 유지하는 데 사용할 수 있는 컨텍스트를 나타내는 데 사용됩니다. 이 구조체는 네이티브 함수가 호출될 때 네이티브 함수에 전달되며 Node-API 호출 시 다시 전달해야 합니다. 특히, 초기 네이티브 함수가 호출될 때 전달된 동일한 `napi_env`가 후속 중첩된 Node-API 호출에 전달되어야 합니다. 일반적인 재사용을 위해 `napi_env`를 캐싱하거나 다른 [`Worker`](/ko/nodejs/api/worker_threads#class-worker) 스레드에서 실행되는 동일한 애드온의 인스턴스 간에 `napi_env`를 전달하는 것은 허용되지 않습니다. 네이티브 애드온의 인스턴스가 언로드되면 `napi_env`는 유효하지 않게 됩니다. 이 이벤트에 대한 알림은 [`napi_add_env_cleanup_hook`](/ko/nodejs/api/n-api#napi_add_env_cleanup_hook) 및 [`napi_set_instance_data`](/ko/nodejs/api/n-api#napi_set_instance_data)에 제공된 콜백을 통해 전달됩니다.

### `node_api_basic_env` {#node_api_basic_env}

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

이 `napi_env` 변형은 동기식 종료자([`node_api_basic_finalize`](/ko/nodejs/api/n-api#node_api_basic_finalize))에 전달됩니다. `node_api_basic_env` 유형의 매개변수를 첫 번째 인수로 사용하는 Node-API의 하위 집합이 있습니다. 이러한 API는 JavaScript 엔진의 상태에 액세스하지 않으므로 동기식 종료자에서 호출하기에 안전합니다. `napi_env` 유형의 매개변수를 이러한 API에 전달하는 것은 허용되지만 `node_api_basic_env` 유형의 매개변수를 JavaScript 엔진 상태에 액세스하는 API에 전달하는 것은 허용되지 않습니다. 캐스트 없이 이렇게 하려고 하면 애드온이 잘못된 포인터 유형이 함수에 전달될 때 경고 및/또는 오류를 발생시키는 플래그로 컴파일될 때 컴파일러 경고 또는 오류가 발생합니다. 동기식 종료자에서 이러한 API를 호출하면 결국 애플리케이션이 종료됩니다.

### `napi_value` {#napi_value}

이는 JavaScript 값을 나타내는 데 사용되는 불투명 포인터입니다.


### `napi_threadsafe_function` {#napi_threadsafe_function}

**Added in: v10.6.0**

**N-API version: 4**

이는 `napi_call_threadsafe_function()`을 통해 여러 스레드에서 비동기적으로 호출할 수 있는 JavaScript 함수를 나타내는 불투명 포인터입니다.

### `napi_threadsafe_function_release_mode` {#napi_threadsafe_function_release_mode}

**Added in: v10.6.0**

**N-API version: 4**

스레드로부터 안전한 함수를 즉시 닫을지(`napi_tsfn_abort`) 또는 단순히 해제할지(`napi_tsfn_release`)를 나타내기 위해 `napi_release_threadsafe_function()`에 제공되는 값입니다. 해제된 경우 `napi_acquire_threadsafe_function()` 및 `napi_call_threadsafe_function()`을 통해 이후에 사용할 수 있습니다.

```C [C]
typedef enum {
  napi_tsfn_release,
  napi_tsfn_abort
} napi_threadsafe_function_release_mode;
```
### `napi_threadsafe_function_call_mode` {#napi_threadsafe_function_call_mode}

**Added in: v10.6.0**

**N-API version: 4**

스레드로부터 안전한 함수와 연결된 큐가 가득 찰 때마다 호출을 차단해야 하는지 여부를 나타내기 위해 `napi_call_threadsafe_function()`에 제공되는 값입니다.

```C [C]
typedef enum {
  napi_tsfn_nonblocking,
  napi_tsfn_blocking
} napi_threadsafe_function_call_mode;
```
### Node-API 메모리 관리 유형 {#node-api-memory-management-types}

#### `napi_handle_scope` {#napi_handle_scope}

이는 특정 범위 내에서 생성된 객체의 수명을 제어하고 수정하는 데 사용되는 추상화입니다. 일반적으로 Node-API 값은 핸들 범위의 컨텍스트 내에서 생성됩니다. JavaScript에서 네이티브 메서드가 호출되면 기본 핸들 범위가 존재합니다. 사용자가 명시적으로 새 핸들 범위를 만들지 않으면 Node-API 값이 기본 핸들 범위에서 생성됩니다. 네이티브 메서드 실행 외부에서 코드 호출 (예: libuv 콜백 호출 중)의 경우 모듈은 JavaScript 값 생성을 초래할 수 있는 함수를 호출하기 전에 범위를 만들어야 합니다.

핸들 범위는 [`napi_open_handle_scope`](/ko/nodejs/api/n-api#napi_open_handle_scope)를 사용하여 생성되고 [`napi_close_handle_scope`](/ko/nodejs/api/n-api#napi_close_handle_scope)를 사용하여 소멸됩니다. 범위를 닫으면 GC에 핸들 범위의 수명 동안 생성된 모든 `napi_value`가 현재 스택 프레임에서 더 이상 참조되지 않는다는 것을 나타낼 수 있습니다.

자세한 내용은 [객체 수명 관리](/ko/nodejs/api/n-api#object-lifetime-management)를 검토하십시오.


#### `napi_escapable_handle_scope` {#napi_escapable_handle_scope}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

Escapable 핸들 스코프는 특정 핸들 스코프 내에서 생성된 값을 상위 스코프로 반환하기 위한 특수한 유형의 핸들 스코프입니다.

#### `napi_ref` {#napi_ref}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

이는 `napi_value`를 참조하는 데 사용되는 추상화입니다. 이를 통해 사용자는 JavaScript 값의 수명을 관리하고 최소 수명을 명시적으로 정의할 수 있습니다.

자세한 내용은 [객체 수명 관리](/ko/nodejs/api/n-api#object-lifetime-management)를 검토하십시오.

#### `napi_type_tag` {#napi_type_tag}

**추가된 버전: v14.8.0, v12.19.0**

**N-API 버전: 8**

두 개의 부호 없는 64비트 정수로 저장된 128비트 값입니다. 특정 유형인지 확인하기 위해 JavaScript 객체 또는 [externals](/ko/nodejs/api/n-api#napi_create_external)에 "태그"를 지정할 수 있는 UUID 역할을 합니다. 이는 객체의 프로토타입이 조작된 경우 거짓 양성을 보고할 수 있기 때문에 [`napi_instanceof`](/ko/nodejs/api/n-api#napi_instanceof)보다 강력한 검사입니다. 유형 태깅은 [`napi_wrap`](/ko/nodejs/api/n-api#napi_wrap)과 함께 사용할 때 가장 유용합니다. 왜냐하면 래핑된 객체에서 검색된 포인터가 이전에 JavaScript 객체에 적용되었던 유형 태그에 해당하는 네이티브 유형으로 안전하게 캐스팅될 수 있도록 보장하기 때문입니다.

```C [C]
typedef struct {
  uint64_t lower;
  uint64_t upper;
} napi_type_tag;
```
#### `napi_async_cleanup_hook_handle` {#napi_async_cleanup_hook_handle}

**추가된 버전: v14.10.0, v12.19.0**

[`napi_add_async_cleanup_hook`](/ko/nodejs/api/n-api#napi_add_async_cleanup_hook)에서 반환된 불투명 값입니다. 비동기 정리 이벤트 체인이 완료되면 [`napi_remove_async_cleanup_hook`](/ko/nodejs/api/n-api#napi_remove_async_cleanup_hook)에 전달되어야 합니다.

### Node-API 콜백 유형 {#node-api-callback-types}

#### `napi_callback_info` {#napi_callback_info}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

콜백 함수에 전달되는 불투명 데이터 유형입니다. 콜백이 호출된 컨텍스트에 대한 추가 정보를 얻는 데 사용할 수 있습니다.

#### `napi_callback` {#napi_callback}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

Node-API를 통해 JavaScript에 노출될 사용자 제공 네이티브 함수에 대한 함수 포인터 유형입니다. 콜백 함수는 다음 서명을 충족해야 합니다.

```C [C]
typedef napi_value (*napi_callback)(napi_env, napi_callback_info);
```
[객체 수명 관리](/ko/nodejs/api/n-api#object-lifetime-management)에서 논의된 이유가 아니면 `napi_callback` 내부에 핸들 및/또는 콜백 스코프를 생성할 필요가 없습니다.


#### `node_api_basic_finalize` {#node_api_basic_finalize}

**추가된 버전: v21.6.0, v20.12.0, v18.20.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

애드온 제공 함수에 대한 함수 포인터 유형으로, 연결된 객체가 가비지 수집되었기 때문에 외부 소유 데이터가 정리될 준비가 되면 사용자에게 알릴 수 있습니다. 사용자는 객체가 수집될 때 호출될 다음 서명을 만족하는 함수를 제공해야 합니다. 현재, `node_api_basic_finalize`는 외부 데이터를 가진 객체가 수집될 때를 알아내는 데 사용될 수 있습니다.

```C [C]
typedef void (*node_api_basic_finalize)(node_api_basic_env env,
                                      void* finalize_data,
                                      void* finalize_hint);
```

[객체 수명 관리](/ko/nodejs/api/n-api#object-lifetime-management)에서 논의된 이유가 아니라면, 함수 본문 내에서 핸들 및/또는 콜백 범위를 생성할 필요가 없습니다.

이러한 함수는 JavaScript 엔진이 JavaScript 코드를 실행할 수 없는 상태에 있을 때 호출될 수 있으므로 `node_api_basic_env`를 첫 번째 매개변수로 허용하는 Node-API만 호출할 수 있습니다. [`node_api_post_finalizer`](/ko/nodejs/api/n-api#node_api_post_finalizer)는 현재 가비지 수집 주기가 완료된 후 JavaScript 엔진의 상태에 대한 액세스가 필요한 Node-API 호출을 예약하는 데 사용할 수 있습니다.

[`node_api_create_external_string_latin1`](/ko/nodejs/api/n-api#node_api_create_external_string_latin1) 및 [`node_api_create_external_string_utf16`](/ko/nodejs/api/n-api#node_api_create_external_string_utf16)의 경우, 외부 문자열은 환경 종료의 후반부에 수집될 수 있으므로 `env` 매개변수는 null일 수 있습니다.

변경 이력:

- 실험적 (`NAPI_EXPERIMENTAL`): `node_api_basic_env`를 첫 번째 매개변수로 허용하는 Node-API만 호출할 수 있으며, 그렇지 않으면 응용 프로그램이 적절한 오류 메시지와 함께 종료됩니다. 이 기능은 `NODE_API_EXPERIMENTAL_BASIC_ENV_OPT_OUT`을 정의하여 끌 수 있습니다.


#### `napi_finalize` {#napi_finalize}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

사용자가 가비지 수집 주기 완료 후 가비지 수집 이벤트에 대한 응답으로 Node-API에 대한 호출 그룹을 예약할 수 있도록 애드온이 제공하는 함수의 함수 포인터 유형입니다. 이러한 함수 포인터는 [`node_api_post_finalizer`](/ko/nodejs/api/n-api#node_api_post_finalizer)와 함께 사용할 수 있습니다.

```C [C]
typedef void (*napi_finalize)(napi_env env,
                              void* finalize_data,
                              void* finalize_hint);
```
변경 내역:

-  실험적 (`NAPI_EXPERIMENTAL`이 정의됨): 이 유형의 함수는 더 이상 [`node_api_post_finalizer`](/ko/nodejs/api/n-api#node_api_post_finalizer)와 함께 사용하는 경우를 제외하고는 파이널라이저로 사용할 수 없습니다. 대신 [`node_api_basic_finalize`](/ko/nodejs/api/n-api#node_api_basic_finalize)를 사용해야 합니다. `NODE_API_EXPERIMENTAL_BASIC_ENV_OPT_OUT`를 정의하여 이 기능을 끌 수 있습니다.

#### `napi_async_execute_callback` {#napi_async_execute_callback}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

비동기 작업을 지원하는 함수와 함께 사용되는 함수 포인터입니다. 콜백 함수는 다음 시그니처를 충족해야 합니다.

```C [C]
typedef void (*napi_async_execute_callback)(napi_env env, void* data);
```
이 함수의 구현은 JavaScript를 실행하거나 JavaScript 객체와 상호 작용하는 Node-API 호출을 피해야 합니다. Node-API 호출은 대신 `napi_async_complete_callback`에 있어야 합니다. JavaScript 실행 가능성이 높으므로 `napi_env` 매개변수를 사용하지 마십시오.

#### `napi_async_complete_callback` {#napi_async_complete_callback}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

비동기 작업을 지원하는 함수와 함께 사용되는 함수 포인터입니다. 콜백 함수는 다음 시그니처를 충족해야 합니다.

```C [C]
typedef void (*napi_async_complete_callback)(napi_env env,
                                             napi_status status,
                                             void* data);
```
[객체 수명 관리](/ko/nodejs/api/n-api#object-lifetime-management)에 설명된 이유가 아닌 한 함수 본문 내에서 핸들 및/또는 콜백 스코프를 생성할 필요가 없습니다.


#### `napi_threadsafe_function_call_js` {#napi_threadsafe_function_call_js}

**Added in: v10.6.0**

**N-API version: 4**

비동기 스레드 안전 함수 호출에 사용되는 함수 포인터입니다. 콜백은 메인 스레드에서 호출됩니다. 이 콜백의 목적은 보조 스레드 중 하나에서 큐를 통해 도착하는 데이터 항목을 사용하여 JavaScript 호출에 필요한 매개변수를 구성하고, 일반적으로 `napi_call_function`을 통해 JavaScript를 호출하는 것입니다.

큐를 통해 보조 스레드에서 도착하는 데이터는 `data` 매개변수에 제공되고, 호출할 JavaScript 함수는 `js_callback` 매개변수에 제공됩니다.

Node-API는 이 콜백을 호출하기 전에 환경을 설정하므로 `napi_make_callback`이 아닌 `napi_call_function`을 통해 JavaScript 함수를 호출하는 것으로 충분합니다.

콜백 함수는 다음 서명을 충족해야 합니다.

```C [C]
typedef void (*napi_threadsafe_function_call_js)(napi_env env,
                                                 napi_value js_callback,
                                                 void* context,
                                                 void* data);
```
- `[in] env`: API 호출에 사용할 환경 또는 스레드 안전 함수가 해체 중이고 `data`를 해제해야 하는 경우 `NULL`입니다.
- `[in] js_callback`: 호출할 JavaScript 함수 또는 스레드 안전 함수가 해체 중이고 `data`를 해제해야 하는 경우 `NULL`입니다. 스레드 안전 함수가 `js_callback` 없이 생성된 경우 `NULL`일 수도 있습니다.
- `[in] context`: 스레드 안전 함수가 생성된 선택적 데이터입니다.
- `[in] data`: 보조 스레드에서 생성된 데이터입니다. 이 콜백은 이 네이티브 데이터를 JavaScript 값으로 변환(Node-API 함수 사용)하여 `js_callback`이 호출될 때 매개변수로 전달할 수 있도록 해야 합니다. 이 포인터는 스레드와 이 콜백에 의해 완전히 관리됩니다. 따라서 이 콜백은 데이터를 해제해야 합니다.

[Object Lifetime Management](/ko/nodejs/api/n-api#object-lifetime-management)에서 설명된 이유가 아니면 함수 본문 내부에 핸들 및/또는 콜백 범위를 만들 필요가 없습니다.


#### `napi_cleanup_hook` {#napi_cleanup_hook}

**추가된 버전: v19.2.0, v18.13.0**

**N-API 버전: 3**

[`napi_add_env_cleanup_hook`](/ko/nodejs/api/n-api#napi_add_env_cleanup_hook)과 함께 사용되는 함수 포인터입니다. 이 함수는 환경이 해체될 때 호출됩니다.

콜백 함수는 다음 서명을 충족해야 합니다.

```C [C]
typedef void (*napi_cleanup_hook)(void* data);
```
- `[in] data`: [`napi_add_env_cleanup_hook`](/ko/nodejs/api/n-api#napi_add_env_cleanup_hook)에 전달된 데이터입니다.

#### `napi_async_cleanup_hook` {#napi_async_cleanup_hook}

**추가된 버전: v14.10.0, v12.19.0**

[`napi_add_async_cleanup_hook`](/ko/nodejs/api/n-api#napi_add_async_cleanup_hook)과 함께 사용되는 함수 포인터입니다. 이 함수는 환경이 해체될 때 호출됩니다.

콜백 함수는 다음 서명을 충족해야 합니다.

```C [C]
typedef void (*napi_async_cleanup_hook)(napi_async_cleanup_hook_handle handle,
                                        void* data);
```
- `[in] handle`: 비동기 정리 완료 후 [`napi_remove_async_cleanup_hook`](/ko/nodejs/api/n-api#napi_remove_async_cleanup_hook)에 전달해야 하는 핸들입니다.
- `[in] data`: [`napi_add_async_cleanup_hook`](/ko/nodejs/api/n-api#napi_add_async_cleanup_hook)에 전달된 데이터입니다.

함수 본문은 비동기 정리 작업을 시작해야 하며, 작업이 완료되면 `handle`을 [`napi_remove_async_cleanup_hook`](/ko/nodejs/api/n-api#napi_remove_async_cleanup_hook) 호출에 전달해야 합니다.

## 오류 처리 {#error-handling}

Node-API는 오류 처리를 위해 반환 값과 JavaScript 예외를 모두 사용합니다. 다음 섹션에서는 각 경우에 대한 접근 방식을 설명합니다.

### 반환 값 {#return-values}

모든 Node-API 함수는 동일한 오류 처리 패턴을 공유합니다. 모든 API 함수의 반환 유형은 `napi_status`입니다.

요청이 성공하고 포착되지 않은 JavaScript 예외가 발생하지 않은 경우 반환 값은 `napi_ok`입니다. 오류가 발생하고 예외가 발생한 경우 오류에 대한 `napi_status` 값이 반환됩니다. 예외가 발생하고 오류가 발생하지 않은 경우 `napi_pending_exception`이 반환됩니다.

`napi_ok` 또는 `napi_pending_exception`이 아닌 다른 반환 값이 반환되는 경우 [`napi_is_exception_pending`](/ko/nodejs/api/n-api#napi_is_exception_pending)을 호출하여 예외가 보류 중인지 확인해야 합니다. 자세한 내용은 예외 섹션을 참조하세요.

가능한 `napi_status` 값의 전체 집합은 `napi_api_types.h`에 정의되어 있습니다.

`napi_status` 반환 값은 발생한 오류에 대한 VM 독립적인 표현을 제공합니다. 경우에 따라 오류를 나타내는 문자열과 VM (엔진) 관련 정보를 포함하여 더 자세한 정보를 얻을 수 있는 것이 유용합니다.

이 정보를 검색하기 위해 `napi_extended_error_info` 구조체를 반환하는 [`napi_get_last_error_info`](/ko/nodejs/api/n-api#napi_get_last_error_info)가 제공됩니다. `napi_extended_error_info` 구조체의 형식은 다음과 같습니다.

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
typedef struct napi_extended_error_info {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
};
```
- `error_message`: 발생한 오류의 텍스트 표현입니다.
- `engine_reserved`: 엔진 전용으로 예약된 불투명 핸들입니다.
- `engine_error_code`: VM 관련 오류 코드입니다.
- `error_code`: 마지막 오류에 대한 Node-API 상태 코드입니다.

[`napi_get_last_error_info`](/ko/nodejs/api/n-api#napi_get_last_error_info)는 마지막으로 수행된 Node-API 호출에 대한 정보를 반환합니다.

확장된 정보의 내용 또는 형식은 SemVer의 적용을 받지 않으며 언제든지 변경될 수 있으므로 이에 의존하지 마십시오. 로깅 용도로만 사용됩니다.


#### `napi_get_last_error_info` {#napi_get_last_error_info}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status
napi_get_last_error_info(node_api_basic_env env,
                         const napi_extended_error_info** result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[out] result`: 오류에 대한 자세한 정보가 포함된 `napi_extended_error_info` 구조체입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 발생한 마지막 오류에 대한 정보가 포함된 `napi_extended_error_info` 구조체를 검색합니다.

반환된 `napi_extended_error_info`의 내용은 동일한 `env`에서 Node-API 함수가 호출될 때까지만 유효합니다. 여기에는 `napi_is_exception_pending`에 대한 호출이 포함되므로 나중에 사용할 수 있도록 정보를 복사해야 하는 경우가 많습니다. `error_message`에 반환된 포인터는 정적으로 정의된 문자열을 가리키므로 다른 Node-API 함수가 호출되기 전에 `error_message` 필드에서 복사한 경우 해당 포인터를 안전하게 사용할 수 있습니다(덮어쓰기됨).

확장 정보의 내용이나 형식에 의존하지 마십시오. 이는 SemVer의 적용을 받지 않으며 언제든지 변경될 수 있습니다. 로깅 목적으로만 사용됩니다.

이 API는 보류 중인 JavaScript 예외가 있는 경우에도 호출할 수 있습니다.

### 예외 {#exceptions}

모든 Node-API 함수 호출은 보류 중인 JavaScript 예외를 발생시킬 수 있습니다. 이는 JavaScript 실행을 유발하지 않는 API 함수에도 해당됩니다.

함수에서 반환된 `napi_status`가 `napi_ok`이면 예외가 보류 중이지 않으므로 추가 작업이 필요하지 않습니다. 반환된 `napi_status`가 `napi_ok` 또는 `napi_pending_exception`이 아닌 경우 즉시 반환하는 대신 복구하고 계속 진행하려면 [`napi_is_exception_pending`](/ko/nodejs/api/n-api#napi_is_exception_pending)을 호출하여 예외가 보류 중인지 여부를 확인해야 합니다.

Node-API 함수가 호출되고 예외가 이미 보류 중인 경우 함수는 `napi_pending_exception`의 `napi_status`로 즉시 반환됩니다. 그러나 이는 모든 함수에 해당하는 것은 아닙니다. Node-API를 사용하면 JavaScript로 반환되기 전에 최소한의 정리 작업을 수행할 수 있도록 함수의 하위 집합을 호출할 수 있습니다. 이 경우 `napi_status`는 함수의 상태를 반영합니다. 이전의 보류 중인 예외는 반영하지 않습니다. 혼동을 피하기 위해 모든 함수 호출 후에 오류 상태를 확인하십시오.

예외가 보류 중인 경우 두 가지 접근 방식을 사용할 수 있습니다.

첫 번째 접근 방식은 적절한 정리 작업을 수행한 다음 반환하여 실행이 JavaScript로 반환되도록 하는 것입니다. JavaScript로 다시 전환하는 과정에서 예외는 네이티브 메서드가 호출된 JavaScript 코드 지점에서 발생합니다. 대부분의 Node-API 호출의 동작은 예외가 보류 중인 동안 지정되지 않으며 대부분은 단순히 `napi_pending_exception`을 반환하므로 가능한 한 적게 수행한 다음 예외를 처리할 수 있는 JavaScript로 반환합니다.

두 번째 접근 방식은 예외를 처리하려고 시도하는 것입니다. 네이티브 코드가 예외를 잡고 적절한 조치를 취한 다음 계속 진행할 수 있는 경우가 있습니다. 이는 예외를 안전하게 처리할 수 있다고 알려진 특정 경우에만 권장됩니다. 이러한 경우 [`napi_get_and_clear_last_exception`](/ko/nodejs/api/n-api#napi_get_and_clear_last_exception)을 사용하여 예외를 가져오고 지울 수 있습니다. 성공하면 result에 마지막으로 throw된 JavaScript `Object`에 대한 핸들이 포함됩니다. 예외를 검색한 후 예외를 처리할 수 없다고 판단되면 [`napi_throw`](/ko/nodejs/api/n-api#napi_throw)로 다시 throw할 수 있습니다. 여기서 error는 throw할 JavaScript 값입니다.

네이티브 코드가 예외를 throw하거나 `napi_value`가 JavaScript `Error` 객체의 인스턴스인지 확인해야 하는 경우 다음 유틸리티 함수도 사용할 수 있습니다. [`napi_throw_error`](/ko/nodejs/api/n-api#napi_throw_error), [`napi_throw_type_error`](/ko/nodejs/api/n-api#napi_throw_type_error), [`napi_throw_range_error`](/ko/nodejs/api/n-api#napi_throw_range_error), [`node_api_throw_syntax_error`](/ko/nodejs/api/n-api#node_api_throw_syntax_error) 및 [`napi_is_error`](/ko/nodejs/api/n-api#napi_is_error).

네이티브 코드가 `Error` 객체를 만들어야 하는 경우 다음 유틸리티 함수도 사용할 수 있습니다. [`napi_create_error`](/ko/nodejs/api/n-api#napi_create_error), [`napi_create_type_error`](/ko/nodejs/api/n-api#napi_create_type_error), [`napi_create_range_error`](/ko/nodejs/api/n-api#napi_create_range_error) 및 [`node_api_create_syntax_error`](/ko/nodejs/api/n-api#node_api_create_syntax_error). 여기서 result는 새로 생성된 JavaScript `Error` 객체를 참조하는 `napi_value`입니다.

Node.js 프로젝트는 내부적으로 생성된 모든 오류에 오류 코드를 추가하고 있습니다. 목표는 애플리케이션이 모든 오류 검사에 이러한 오류 코드를 사용하는 것입니다. 관련 오류 메시지는 유지되지만 로깅 및 표시에만 사용되며 메시지는 SemVer 적용 없이 변경될 수 있습니다. 내부 기능과 모듈 특정 기능 모두에서 Node-API를 통해 이 모델을 지원하기 위해(모범 사례로) `throw_` 및 `create_` 함수는 오류 객체에 추가할 코드에 대한 문자열인 선택적 코드 매개변수를 사용합니다. 선택적 매개변수가 `NULL`이면 오류와 관련된 코드가 없습니다. 코드가 제공되면 오류와 관련된 이름도 다음과 같이 업데이트됩니다.

```text [TEXT]
originalName [code]
```
여기서 `originalName`은 오류와 관련된 원래 이름이고 `code`는 제공된 코드입니다. 예를 들어 코드가 `'ERR_ERROR_1'`이고 `TypeError`가 생성되는 경우 이름은 다음과 같습니다.

```text [TEXT]
TypeError [ERR_ERROR_1]
```

#### `napi_throw` {#napi_throw}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw(napi_env env, napi_value error);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] error`: 던질 JavaScript 값입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 제공된 JavaScript 값을 던집니다.

#### `napi_throw_error` {#napi_throw_error}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw_error(napi_env env,
                                         const char* code,
                                         const char* msg);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] code`: 오류에 설정할 선택적 오류 코드입니다.
- `[in] msg`: 오류와 연결할 텍스트를 나타내는 C 문자열입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 제공된 텍스트와 함께 JavaScript `Error`를 던집니다.

#### `napi_throw_type_error` {#napi_throw_type_error}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw_type_error(napi_env env,
                                              const char* code,
                                              const char* msg);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] code`: 오류에 설정할 선택적 오류 코드입니다.
- `[in] msg`: 오류와 연결할 텍스트를 나타내는 C 문자열입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 제공된 텍스트와 함께 JavaScript `TypeError`를 던집니다.

#### `napi_throw_range_error` {#napi_throw_range_error}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw_range_error(napi_env env,
                                               const char* code,
                                               const char* msg);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] code`: 오류에 설정할 선택적 오류 코드입니다.
- `[in] msg`: 오류와 연결할 텍스트를 나타내는 C 문자열입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 제공된 텍스트와 함께 JavaScript `RangeError`를 던집니다.


#### `node_api_throw_syntax_error` {#node_api_throw_syntax_error}

**추가된 버전: v17.2.0, v16.14.0**

**N-API 버전: 9**

```C [C]
NAPI_EXTERN napi_status node_api_throw_syntax_error(napi_env env,
                                                    const char* code,
                                                    const char* msg);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] code`: 오류에 설정할 선택적 오류 코드입니다.
- `[in] msg`: 오류와 연결할 텍스트를 나타내는 C 문자열입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 제공된 텍스트와 함께 JavaScript `SyntaxError`를 발생시킵니다.

#### `napi_is_error` {#napi_is_error}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
NAPI_EXTERN napi_status napi_is_error(napi_env env,
                                      napi_value value,
                                      bool* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: 검사할 `napi_value`입니다.
- `[out] result`: `napi_value`가 오류를 나타내는 경우 true로 설정되고, 그렇지 않으면 false로 설정되는 부울 값입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 `napi_value`가 오류 객체를 나타내는지 확인하기 위해 쿼리합니다.

#### `napi_create_error` {#napi_create_error}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_error(napi_env env,
                                          napi_value code,
                                          napi_value msg,
                                          napi_value* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] code`: 오류와 연결할 오류 코드에 대한 문자열이 있는 선택적 `napi_value`입니다.
- `[in] msg`: `Error`에 대한 메시지로 사용할 JavaScript `string`을 참조하는 `napi_value`입니다.
- `[out] result`: 생성된 오류를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 제공된 텍스트와 함께 JavaScript `Error`를 반환합니다.

#### `napi_create_type_error` {#napi_create_type_error}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_type_error(napi_env env,
                                               napi_value code,
                                               napi_value msg,
                                               napi_value* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] code`: 오류와 연결할 오류 코드에 대한 문자열이 있는 선택적 `napi_value`입니다.
- `[in] msg`: `Error`에 대한 메시지로 사용할 JavaScript `string`을 참조하는 `napi_value`입니다.
- `[out] result`: 생성된 오류를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 제공된 텍스트와 함께 JavaScript `TypeError`를 반환합니다.


#### `napi_create_range_error` {#napi_create_range_error}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_range_error(napi_env env,
                                                napi_value code,
                                                napi_value msg,
                                                napi_value* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] code`: 오류와 연결할 오류 코드에 대한 문자열이 있는 선택적 `napi_value`입니다.
- `[in] msg`: `Error`의 메시지로 사용할 JavaScript `string`을 참조하는 `napi_value`입니다.
- `[out] result`: 생성된 오류를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 제공된 텍스트로 JavaScript `RangeError`를 반환합니다.

#### `node_api_create_syntax_error` {#node_api_create_syntax_error}

**Added in: v17.2.0, v16.14.0**

**N-API version: 9**

```C [C]
NAPI_EXTERN napi_status node_api_create_syntax_error(napi_env env,
                                                     napi_value code,
                                                     napi_value msg,
                                                     napi_value* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] code`: 오류와 연결할 오류 코드에 대한 문자열이 있는 선택적 `napi_value`입니다.
- `[in] msg`: `Error`의 메시지로 사용할 JavaScript `string`을 참조하는 `napi_value`입니다.
- `[out] result`: 생성된 오류를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 제공된 텍스트로 JavaScript `SyntaxError`를 반환합니다.

#### `napi_get_and_clear_last_exception` {#napi_get_and_clear_last_exception}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_and_clear_last_exception(napi_env env,
                                              napi_value* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[out] result`: 보류 중인 예외가 있으면 예외이고, 그렇지 않으면 `NULL`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 보류 중인 JavaScript 예외가 있는 경우에도 호출할 수 있습니다.


#### `napi_is_exception_pending` {#napi_is_exception_pending}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_is_exception_pending(napi_env env, bool* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[out] result`: 예외가 보류 중인 경우 true로 설정되는 부울 값입니다.

API가 성공하면 `napi_ok`를 반환합니다.

보류 중인 JavaScript 예외가 있는 경우에도 이 API를 호출할 수 있습니다.

#### `napi_fatal_exception` {#napi_fatal_exception}

**추가된 버전: v9.10.0**

**N-API 버전: 3**

```C [C]
napi_status napi_fatal_exception(napi_env env, napi_value err);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] err`: `'uncaughtException'`에 전달되는 오류입니다.

JavaScript에서 `'uncaughtException'`을 트리거합니다. 복구할 방법 없이 비동기 콜백이 예외를 throw하는 경우에 유용합니다.

### 치명적인 오류 {#fatal-errors}

네이티브 애드온에서 복구할 수 없는 오류가 발생한 경우 프로세스를 즉시 종료하기 위해 치명적인 오류를 throw할 수 있습니다.

#### `napi_fatal_error` {#napi_fatal_error}

**추가된 버전: v8.2.0**

**N-API 버전: 1**

```C [C]
NAPI_NO_RETURN void napi_fatal_error(const char* location,
                                     size_t location_len,
                                     const char* message,
                                     size_t message_len);
```
- `[in] location`: 오류가 발생한 선택적 위치입니다.
- `[in] location_len`: 위치의 바이트 단위 길이입니다. null로 종료된 경우 `NAPI_AUTO_LENGTH`입니다.
- `[in] message`: 오류와 연결된 메시지입니다.
- `[in] message_len`: 메시지의 바이트 단위 길이입니다. null로 종료된 경우 `NAPI_AUTO_LENGTH`입니다.

함수 호출은 반환되지 않으며 프로세스가 종료됩니다.

보류 중인 JavaScript 예외가 있는 경우에도 이 API를 호출할 수 있습니다.

## 객체 수명 관리 {#object-lifetime-management}

Node-API가 호출되면 기본 VM의 힙에 있는 객체에 대한 핸들이 `napi_values`로 반환될 수 있습니다. 이러한 핸들은 네이티브 코드에 더 이상 필요하지 않을 때까지 객체를 '라이브' 상태로 유지해야 합니다. 그렇지 않으면 네이티브 코드가 사용을 마치기 전에 객체가 수집될 수 있습니다.

객체 핸들이 반환되면 '스코프'와 연결됩니다. 기본 스코프의 수명은 네이티브 메서드 호출의 수명과 연결됩니다. 그 결과 기본적으로 핸들은 유효하게 유지되고 이러한 핸들과 연결된 객체는 네이티브 메서드 호출의 수명 동안 라이브 상태로 유지됩니다.

그러나 많은 경우 핸들이 네이티브 메서드의 수명보다 짧거나 긴 수명 동안 유효하게 유지되어야 합니다. 다음 섹션에서는 핸들 수명을 기본값에서 변경하는 데 사용할 수 있는 Node-API 함수에 대해 설명합니다.


### 네이티브 메서드의 수명보다 핸들 수명을 더 짧게 만들기 {#making-handle-lifespan-shorter-than-that-of-the-native-method}

핸들의 수명을 네이티브 메서드의 수명보다 더 짧게 만들어야 하는 경우가 종종 있습니다. 예를 들어, 큰 배열의 요소를 반복하는 루프가 있는 네이티브 메서드를 생각해 보세요.

```C [C]
for (int i = 0; i < 1000000; i++) {
  napi_value result;
  napi_status status = napi_get_element(env, object, i, &result);
  if (status != napi_ok) {
    break;
  }
  // 요소로 작업 수행
}
```

이렇게 하면 많은 수의 핸들이 생성되어 상당한 리소스가 소비됩니다. 또한, 네이티브 코드는 가장 최근 핸들만 사용할 수 있지만 연결된 모든 개체가 동일한 범위를 공유하므로 계속 유지됩니다.

이러한 경우를 처리하기 위해 Node-API는 새로 생성된 핸들이 연결될 새로운 '범위'를 설정하는 기능을 제공합니다. 이러한 핸들이 더 이상 필요하지 않으면 범위를 '닫을' 수 있으며 범위와 연결된 모든 핸들이 무효화됩니다. 범위를 열고 닫는 데 사용할 수 있는 메서드는 [`napi_open_handle_scope`](/ko/nodejs/api/n-api#napi_open_handle_scope) 및 [`napi_close_handle_scope`](/ko/nodejs/api/n-api#napi_close_handle_scope)입니다.

Node-API는 단일 중첩 범위 계층 구조만 지원합니다. 언제든지 하나의 활성 범위만 존재하며 모든 새 핸들은 활성 상태인 동안 해당 범위와 연결됩니다. 범위는 열린 순서의 역순으로 닫아야 합니다. 또한 네이티브 메서드 내에서 생성된 모든 범위는 해당 메서드에서 반환되기 전에 닫아야 합니다.

이전 예제를 사용하여 [`napi_open_handle_scope`](/ko/nodejs/api/n-api#napi_open_handle_scope) 및 [`napi_close_handle_scope`](/ko/nodejs/api/n-api#napi_close_handle_scope)에 대한 호출을 추가하면 루프 실행 내내 최대 하나의 핸들만 유효하게 됩니다.

```C [C]
for (int i = 0; i < 1000000; i++) {
  napi_handle_scope scope;
  napi_status status = napi_open_handle_scope(env, &scope);
  if (status != napi_ok) {
    break;
  }
  napi_value result;
  status = napi_get_element(env, object, i, &result);
  if (status != napi_ok) {
    break;
  }
  // 요소로 작업 수행
  status = napi_close_handle_scope(env, scope);
  if (status != napi_ok) {
    break;
  }
}
```

범위를 중첩할 때 내부 범위의 핸들이 해당 범위의 수명을 넘어 유지되어야 하는 경우가 있습니다. Node-API는 이러한 경우를 지원하기 위해 '이스케이프 가능 범위'를 지원합니다. 이스케이프 가능 범위는 하나의 핸들을 '승격'시켜 현재 범위를 '이스케이프'하고 핸들의 수명을 현재 범위에서 외부 범위로 변경할 수 있도록 합니다.

이스케이프 가능 범위를 열고 닫는 데 사용할 수 있는 메서드는 [`napi_open_escapable_handle_scope`](/ko/nodejs/api/n-api#napi_open_escapable_handle_scope) 및 [`napi_close_escapable_handle_scope`](/ko/nodejs/api/n-api#napi_close_escapable_handle_scope)입니다.

핸들 승격 요청은 한 번만 호출할 수 있는 [`napi_escape_handle`](/ko/nodejs/api/n-api#napi_escape_handle)을 통해 이루어집니다.


#### `napi_open_handle_scope` {#napi_open_handle_scope}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
NAPI_EXTERN napi_status napi_open_handle_scope(napi_env env,
                                               napi_handle_scope* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[out] result`: 새 스코프를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 새 스코프를 엽니다.

#### `napi_close_handle_scope` {#napi_close_handle_scope}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
NAPI_EXTERN napi_status napi_close_handle_scope(napi_env env,
                                                napi_handle_scope scope);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] scope`: 닫을 스코프를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 전달된 스코프를 닫습니다. 스코프는 생성된 역순으로 닫아야 합니다.

이 API는 보류 중인 JavaScript 예외가 있는 경우에도 호출할 수 있습니다.

#### `napi_open_escapable_handle_scope` {#napi_open_escapable_handle_scope}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
NAPI_EXTERN napi_status
    napi_open_escapable_handle_scope(napi_env env,
                                     napi_handle_scope* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[out] result`: 새 스코프를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 하나의 객체를 외부 스코프로 승격시킬 수 있는 새 스코프를 엽니다.

#### `napi_close_escapable_handle_scope` {#napi_close_escapable_handle_scope}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
NAPI_EXTERN napi_status
    napi_close_escapable_handle_scope(napi_env env,
                                      napi_handle_scope scope);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] scope`: 닫을 스코프를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 전달된 스코프를 닫습니다. 스코프는 생성된 역순으로 닫아야 합니다.

이 API는 보류 중인 JavaScript 예외가 있는 경우에도 호출할 수 있습니다.


#### `napi_escape_handle` {#napi_escape_handle}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_escape_handle(napi_env env,
                               napi_escapable_handle_scope scope,
                               napi_value escapee,
                               napi_value* result);
```
- `[in] env`: API가 호출된 환경입니다.
- `[in] scope`: 현재 스코프를 나타내는 `napi_value`입니다.
- `[in] escapee`: 이스케이프할 JavaScript `Object`를 나타내는 `napi_value`입니다.
- `[out] result`: 외부 스코프에서 이스케이프된 `Object`에 대한 핸들을 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 JavaScript 객체에 대한 핸들을 승격하여 외부 스코프의 수명 동안 유효하도록 합니다. 스코프당 한 번만 호출할 수 있습니다. 두 번 이상 호출하면 오류가 반환됩니다.

보류 중인 JavaScript 예외가 있는 경우에도 이 API를 호출할 수 있습니다.

### 네이티브 메서드보다 수명이 더 긴 값에 대한 참조 {#references-to-values-with-a-lifespan-longer-than-that-of-the-native-method}

경우에 따라 애드온은 단일 네이티브 메서드 호출보다 수명이 더 긴 값을 생성하고 참조할 수 있어야 합니다. 예를 들어 생성자를 만들고 나중에 인스턴스 생성 요청에서 해당 생성자를 사용하려면 여러 인스턴스 생성 요청에서 생성자 객체를 참조할 수 있어야 합니다. 앞 섹션에서 설명한 대로 `napi_value`로 반환된 일반 핸들로는 불가능합니다. 일반 핸들의 수명은 스코프에 의해 관리되며 모든 스코프는 네이티브 메서드가 끝나기 전에 닫아야 합니다.

Node-API는 값에 대한 영구 참조를 생성하는 방법을 제공합니다. 현재 Node-API는 객체, 외부, 함수 및 기호를 포함한 제한된 값 유형 집합에 대해서만 참조를 생성할 수 있도록 합니다.

각 참조에는 연결된 카운트가 있으며, 해당 값은 0 이상입니다. 이 카운트는 참조가 해당 값을 활성 상태로 유지할지 여부를 결정합니다. 카운트가 0인 참조는 값이 수집되는 것을 방지하지 않습니다. 객체(객체, 함수, 외부) 및 기호 유형의 값은 '약한' 참조가 되고 수집되지 않는 동안에도 계속 액세스할 수 있습니다. 0보다 큰 카운트는 값이 수집되는 것을 방지합니다.

기호 값에는 다양한 종류가 있습니다. 진정한 약한 참조 동작은 `napi_create_symbol` 함수 또는 JavaScript `Symbol()` 생성자 호출로 생성된 로컬 기호에서만 지원됩니다. `node_api_symbol_for` 함수 또는 JavaScript `Symbol.for()` 함수 호출로 생성된 전역적으로 등록된 기호는 가비지 수집기가 수집하지 않으므로 항상 강력한 참조로 유지됩니다. `Symbol.iterator`와 같은 잘 알려진 기호도 마찬가지입니다. 또한 가비지 수집기에 의해 수집되지 않습니다.

참조는 초기 참조 카운트와 함께 생성할 수 있습니다. 그런 다음 카운트는 [`napi_reference_ref`](/ko/nodejs/api/n-api#napi_reference_ref) 및 [`napi_reference_unref`](/ko/nodejs/api/n-api#napi_reference_unref)를 통해 수정할 수 있습니다. 참조에 대한 카운트가 0인 동안 객체가 수집되면 참조와 연결된 객체를 가져오기 위해 이후에 호출되는 모든 함수 [`napi_get_reference_value`](/ko/nodejs/api/n-api#napi_get_reference_value)는 반환된 `napi_value`에 대해 `NULL`을 반환합니다. 객체가 수집된 참조에 대해 [`napi_reference_ref`](/ko/nodejs/api/n-api#napi_reference_ref)를 호출하려는 시도는 오류를 발생시킵니다.

참조는 애드온에 더 이상 필요하지 않으면 삭제해야 합니다. 참조가 삭제되면 해당 객체가 수집되는 것을 더 이상 방지하지 않습니다. 영구 참조를 삭제하지 못하면 영구 참조에 대한 네이티브 메모리와 힙의 해당 객체가 모두 영원히 유지되는 '메모리 누수'가 발생합니다.

동일한 객체를 참조하는 여러 영구 참조가 생성될 수 있으며, 각 참조는 개별 카운트를 기반으로 객체를 활성 상태로 유지할지 여부를 결정합니다. 동일한 객체에 대한 여러 영구 참조는 예기치 않게 네이티브 메모리를 활성 상태로 유지할 수 있습니다. 영구 참조에 대한 네이티브 구조는 참조된 객체에 대한 종료자가 실행될 때까지 활성 상태로 유지되어야 합니다. 동일한 객체에 대한 새 영구 참조가 생성되면 해당 객체에 대한 종료자가 실행되지 않고 이전 영구 참조에서 가리키는 네이티브 메모리가 해제되지 않습니다. 이는 가능한 경우 `napi_reference_unref` 외에도 `napi_delete_reference`를 호출하여 피할 수 있습니다.

**변경 이력:**

-  실험적(`NAPI_EXPERIMENTAL`이 정의됨): 모든 값 유형에 대해 참조를 생성할 수 있습니다. 새로 지원되는 값 유형은 약한 참조 의미 체계를 지원하지 않으며 이러한 유형의 값은 참조 카운트가 0이 되면 해제되고 더 이상 참조에서 액세스할 수 없습니다.


#### `napi_create_reference` {#napi_create_reference}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_reference(napi_env env,
                                              napi_value value,
                                              uint32_t initial_refcount,
                                              napi_ref* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: 참조가 생성될 `napi_value`입니다.
- `[in] initial_refcount`: 새 참조의 초기 참조 횟수입니다.
- `[out] result`: 새 참조를 가리키는 `napi_ref`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 전달된 값에 대해 지정된 참조 횟수로 새 참조를 생성합니다.

#### `napi_delete_reference` {#napi_delete_reference}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
NAPI_EXTERN napi_status napi_delete_reference(napi_env env, napi_ref ref);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] ref`: 삭제될 `napi_ref`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 전달된 참조를 삭제합니다.

이 API는 보류 중인 JavaScript 예외가 있는 경우에도 호출할 수 있습니다.

#### `napi_reference_ref` {#napi_reference_ref}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
NAPI_EXTERN napi_status napi_reference_ref(napi_env env,
                                           napi_ref ref,
                                           uint32_t* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] ref`: 참조 횟수가 증가될 `napi_ref`입니다.
- `[out] result`: 새로운 참조 횟수입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 전달된 참조의 참조 횟수를 증가시키고 결과 참조 횟수를 반환합니다.

#### `napi_reference_unref` {#napi_reference_unref}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
NAPI_EXTERN napi_status napi_reference_unref(napi_env env,
                                             napi_ref ref,
                                             uint32_t* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] ref`: 참조 횟수가 감소될 `napi_ref`입니다.
- `[out] result`: 새로운 참조 횟수입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 전달된 참조의 참조 횟수를 감소시키고 결과 참조 횟수를 반환합니다.


#### `napi_get_reference_value` {#napi_get_reference_value}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
NAPI_EXTERN napi_status napi_get_reference_value(napi_env env,
                                                 napi_ref ref,
                                                 napi_value* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] ref`: 해당 값을 요청하는 `napi_ref`입니다.
- `[out] result`: `napi_ref`가 참조하는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

여전히 유효하면, 이 API는 `napi_ref`와 연결된 JavaScript 값을 나타내는 `napi_value`를 반환합니다. 그렇지 않으면, result는 `NULL`이 됩니다.

### 현재 Node.js 환경 종료 시 정리 {#cleanup-on-exit-of-the-current-nodejs-environment}

일반적으로 Node.js 프로세스는 종료 시 모든 리소스를 해제하지만, Node.js를 포함하는 임베더 또는 향후 Worker 지원은 현재 Node.js 환경이 종료되면 실행될 정리 후크를 애드온이 등록하도록 요구할 수 있습니다.

Node-API는 이러한 콜백을 등록 및 등록 취소하는 기능을 제공합니다. 이러한 콜백이 실행되면 애드온이 보유하고 있는 모든 리소스를 해제해야 합니다.

#### `napi_add_env_cleanup_hook` {#napi_add_env_cleanup_hook}

**Added in: v10.2.0**

**N-API version: 3**

```C [C]
NODE_EXTERN napi_status napi_add_env_cleanup_hook(node_api_basic_env env,
                                                  napi_cleanup_hook fun,
                                                  void* arg);
```
현재 Node.js 환경이 종료되면 `arg` 매개변수와 함께 실행될 함수로 `fun`을 등록합니다.

함수는 다른 `arg` 값으로 여러 번 안전하게 지정할 수 있습니다. 이 경우 여러 번 호출됩니다. 동일한 `fun` 및 `arg` 값을 여러 번 제공하는 것은 허용되지 않으며 프로세스가 중단됩니다.

후크는 역순으로 호출됩니다. 즉, 가장 최근에 추가된 후크가 먼저 호출됩니다.

이 후크를 제거하는 방법은 [`napi_remove_env_cleanup_hook`](/ko/nodejs/api/n-api#napi_remove_env_cleanup_hook)을 사용하는 것입니다. 일반적으로 이 후크가 추가된 리소스가 어쨌든 해체될 때 발생합니다.

비동기 정리를 위해 [`napi_add_async_cleanup_hook`](/ko/nodejs/api/n-api#napi_add_async_cleanup_hook)를 사용할 수 있습니다.


#### `napi_remove_env_cleanup_hook` {#napi_remove_env_cleanup_hook}

**추가된 버전: v10.2.0**

**N-API 버전: 3**

```C [C]
NAPI_EXTERN napi_status napi_remove_env_cleanup_hook(node_api_basic_env env,
                                                     void (*fun)(void* arg),
                                                     void* arg);
```
현재 Node.js 환경이 종료될 때 `arg` 매개변수와 함께 실행될 함수로 `fun`을 등록 취소합니다. 인수와 함수 값 모두 정확히 일치해야 합니다.

이 함수는 원래 `napi_add_env_cleanup_hook`에 등록되어 있어야 하며, 그렇지 않으면 프로세스가 중단됩니다.

#### `napi_add_async_cleanup_hook` {#napi_add_async_cleanup_hook}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.10.0, v12.19.0 | `hook` 콜백의 시그니처가 변경되었습니다. |
| v14.8.0, v12.19.0 | 추가된 버전: v14.8.0, v12.19.0 |
:::

**N-API 버전: 8**

```C [C]
NAPI_EXTERN napi_status napi_add_async_cleanup_hook(
    node_api_basic_env env,
    napi_async_cleanup_hook hook,
    void* arg,
    napi_async_cleanup_hook_handle* remove_handle);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] hook`: 환경 해체 시 호출할 함수 포인터입니다. 함수 타입은 [`napi_async_cleanup_hook`](/ko/nodejs/api/n-api#napi_async_cleanup_hook)입니다.
- `[in] arg`: 호출될 때 `hook`에 전달할 포인터입니다.
- `[out] remove_handle`: 선택적 핸들로 비동기 정리 훅을 참조합니다.

현재 Node.js 환경이 종료될 때 `remove_handle` 및 `arg` 매개변수와 함께 실행될 함수로 타입 [`napi_async_cleanup_hook`](/ko/nodejs/api/n-api#napi_async_cleanup_hook)의 함수인 `hook`을 등록합니다.

[`napi_add_env_cleanup_hook`](/ko/nodejs/api/n-api#napi_add_env_cleanup_hook)와 달리 훅은 비동기적으로 수행될 수 있습니다.

그렇지 않으면 동작은 일반적으로 [`napi_add_env_cleanup_hook`](/ko/nodejs/api/n-api#napi_add_env_cleanup_hook)의 동작과 일치합니다.

`remove_handle`이 `NULL`이 아니면 불투명한 값이 저장되어 훅이 이미 호출되었는지 여부에 관계없이 나중에 [`napi_remove_async_cleanup_hook`](/ko/nodejs/api/n-api#napi_remove_async_cleanup_hook)에 전달해야 합니다. 일반적으로 이 훅이 추가된 리소스가 이미 해체될 때 발생합니다.


#### `napi_remove_async_cleanup_hook` {#napi_remove_async_cleanup_hook}

::: info [History]
| Version | Changes |
| --- | --- |
| v14.10.0, v12.19.0 | `env` 매개변수가 제거되었습니다. |
| v14.8.0, v12.19.0 | 추가됨: v14.8.0, v12.19.0 |
:::

```C [C]
NAPI_EXTERN napi_status napi_remove_async_cleanup_hook(
    napi_async_cleanup_hook_handle remove_handle);
```
- `[in] remove_handle`: [`napi_add_async_cleanup_hook`](/ko/nodejs/api/n-api#napi_add_async_cleanup_hook)으로 생성된 비동기 정리 훅에 대한 핸들입니다.

`remove_handle`에 해당하는 정리 훅을 등록 해제합니다. 이렇게 하면 훅이 이미 실행되기 시작하지 않은 한 실행되지 않습니다. 이는 [`napi_add_async_cleanup_hook`](/ko/nodejs/api/n-api#napi_add_async_cleanup_hook)에서 얻은 모든 `napi_async_cleanup_hook_handle` 값에 대해 호출되어야 합니다.

### Node.js 환경 종료 시 마무리 {#finalization-on-the-exit-of-the-nodejs-environment}

Node.js 환경은 JavaScript 실행이 허용되지 않은 채 가능한 한 빨리 임의의 시간에 해체될 수 있습니다. 예를 들어 [`worker.terminate()`](/ko/nodejs/api/worker_threads#workerterminate) 요청 시에 그렇습니다. 환경이 해체될 때 JavaScript 객체, 스레드 안전 함수 및 환경 인스턴스 데이터의 등록된 `napi_finalize` 콜백이 즉시 독립적으로 호출됩니다.

`napi_finalize` 콜백 호출은 수동으로 등록된 정리 훅 이후에 예약됩니다. 환경 종료 중 애드온 마무리의 적절한 순서를 보장하여 `napi_finalize` 콜백에서 use-after-free를 방지하기 위해 애드온은 `napi_add_env_cleanup_hook` 및 `napi_add_async_cleanup_hook`으로 정리 훅을 등록하여 적절한 순서로 할당된 리소스를 수동으로 해제해야 합니다.

## 모듈 등록 {#module-registration}

Node-API 모듈은 다른 모듈과 유사한 방식으로 등록되지만 `NODE_MODULE` 매크로 대신 다음이 사용됩니다.

```C [C]
NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
```
다음 차이점은 `Init` 메서드의 서명입니다. Node-API 모듈의 경우 다음과 같습니다.

```C [C]
napi_value Init(napi_env env, napi_value exports);
```
`Init`의 반환 값은 모듈의 `exports` 객체로 처리됩니다. `Init` 메서드에는 편의를 위해 `exports` 매개변수를 통해 빈 객체가 전달됩니다. `Init`가 `NULL`을 반환하면 `exports`로 전달된 매개변수가 모듈에서 내보내집니다. Node-API 모듈은 `module` 객체를 수정할 수 없지만 모듈의 `exports` 속성으로 무엇이든 지정할 수 있습니다.

애드온에서 제공하는 메서드로 호출할 수 있도록 메서드 `hello`를 함수로 추가하려면 다음을 수행합니다.

```C [C]
napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_property_descriptor desc = {
    "hello",
    NULL,
    Method,
    NULL,
    NULL,
    NULL,
    napi_writable | napi_enumerable | napi_configurable,
    NULL
  };
  status = napi_define_properties(env, exports, 1, &desc);
  if (status != napi_ok) return NULL;
  return exports;
}
```
애드온에 대한 `require()`에서 반환될 함수를 설정하려면 다음을 수행합니다.

```C [C]
napi_value Init(napi_env env, napi_value exports) {
  napi_value method;
  napi_status status;
  status = napi_create_function(env, "exports", NAPI_AUTO_LENGTH, Method, NULL, &method);
  if (status != napi_ok) return NULL;
  return method;
}
```
새 인스턴스를 만들 수 있도록 클래스를 정의하려면 (종종 [객체 래핑](/ko/nodejs/api/n-api#object-wrap)과 함께 사용):

```C [C]
// 참고: 부분 예제이며 참조된 코드가 모두 포함되어 있지는 않습니다.
napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_property_descriptor properties[] = {
    { "value", NULL, NULL, GetValue, SetValue, NULL, napi_writable | napi_configurable, NULL },
    DECLARE_NAPI_METHOD("plusOne", PlusOne),
    DECLARE_NAPI_METHOD("multiply", Multiply),
  };

  napi_value cons;
  status =
      napi_define_class(env, "MyObject", New, NULL, 3, properties, &cons);
  if (status != napi_ok) return NULL;

  status = napi_create_reference(env, cons, 1, &constructor);
  if (status != napi_ok) return NULL;

  status = napi_set_named_property(env, exports, "MyObject", cons);
  if (status != napi_ok) return NULL;

  return exports;
}
```
`NAPI_MODULE` 및 `Init` 함수 정의에 대한 약칭 역할을 하는 `NAPI_MODULE_INIT` 매크로를 사용할 수도 있습니다.

```C [C]
NAPI_MODULE_INIT(/* napi_env env, napi_value exports */) {
  napi_value answer;
  napi_status result;

  status = napi_create_int64(env, 42, &answer);
  if (status != napi_ok) return NULL;

  status = napi_set_named_property(env, exports, "answer", answer);
  if (status != napi_ok) return NULL;

  return exports;
}
```
매개변수 `env` 및 `exports`는 `NAPI_MODULE_INIT` 매크로 본문에 제공됩니다.

모든 Node-API 애드온은 컨텍스트를 인식하므로 여러 번 로드될 수 있습니다. 이러한 모듈을 선언할 때 몇 가지 설계 고려 사항이 있습니다. [컨텍스트 인식 애드온](/ko/nodejs/api/addons#context-aware-addons)에 대한 문서에서 자세한 내용을 제공합니다.

변수 `env` 및 `exports`는 매크로 호출 후 함수 본문 내에서 사용할 수 있습니다.

객체 속성 설정에 대한 자세한 내용은 [JavaScript 속성 작업](/ko/nodejs/api/n-api#working-with-javascript-properties) 섹션을 참조하십시오.

일반적으로 애드온 모듈 구축에 대한 자세한 내용은 기존 API를 참조하십시오.


## JavaScript 값 작업 {#working-with-javascript-values}

Node-API는 모든 유형의 JavaScript 값을 생성하는 API 집합을 제공합니다. 이러한 유형 중 일부는 [ECMAScript 언어 사양](https://tc39.github.io/ecma262/)의 [섹션 6](https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values)에 설명되어 있습니다.

기본적으로 이러한 API는 다음 중 하나를 수행하는 데 사용됩니다.

Node-API 값은 `napi_value` 유형으로 표시됩니다. JavaScript 값이 필요한 모든 Node-API 호출은 `napi_value`를 사용합니다. 경우에 따라 API는 `napi_value`의 유형을 미리 확인합니다. 그러나 더 나은 성능을 위해서는 호출자가 해당 `napi_value`가 API에서 예상하는 JavaScript 유형인지 확인하는 것이 좋습니다.

### Enum 유형 {#enum-types}

#### `napi_key_collection_mode` {#napi_key_collection_mode}

**추가된 버전: v13.7.0, v12.17.0, v10.20.0**

**N-API 버전: 6**

```C [C]
typedef enum {
  napi_key_include_prototypes,
  napi_key_own_only
} napi_key_collection_mode;
```
`키/속성` 필터 enum을 설명합니다.

`napi_key_collection_mode`는 수집된 속성의 범위를 제한합니다.

`napi_key_own_only`는 수집된 속성을 지정된 객체로만 제한합니다. `napi_key_include_prototypes`는 객체 프로토타입 체인의 모든 키를 포함합니다.

#### `napi_key_filter` {#napi_key_filter}

**추가된 버전: v13.7.0, v12.17.0, v10.20.0**

**N-API 버전: 6**

```C [C]
typedef enum {
  napi_key_all_properties = 0,
  napi_key_writable = 1,
  napi_key_enumerable = 1 << 1,
  napi_key_configurable = 1 << 2,
  napi_key_skip_strings = 1 << 3,
  napi_key_skip_symbols = 1 << 4
} napi_key_filter;
```
속성 필터 비트입니다. OR 연산자를 사용하여 복합 필터를 빌드할 수 있습니다.

#### `napi_key_conversion` {#napi_key_conversion}

**추가된 버전: v13.7.0, v12.17.0, v10.20.0**

**N-API 버전: 6**

```C [C]
typedef enum {
  napi_key_keep_numbers,
  napi_key_numbers_to_strings
} napi_key_conversion;
```
`napi_key_numbers_to_strings`는 정수 인덱스를 문자열로 변환합니다. `napi_key_keep_numbers`는 정수 인덱스에 대해 숫자를 반환합니다.

#### `napi_valuetype` {#napi_valuetype}

```C [C]
typedef enum {
  // ES6 유형 (typeof에 해당)
  napi_undefined,
  napi_null,
  napi_boolean,
  napi_number,
  napi_string,
  napi_symbol,
  napi_object,
  napi_function,
  napi_external,
  napi_bigint,
} napi_valuetype;
```
`napi_value`의 유형을 설명합니다. 이는 일반적으로 ECMAScript 언어 사양의 [섹션 6.1](https://tc39.github.io/ecma262/#sec-ecmascript-language-types)에 설명된 유형에 해당합니다. 해당 섹션의 유형 외에도 `napi_valuetype`은 외부 데이터가 있는 `Function` 및 `Object`도 나타낼 수 있습니다.

`napi_external` 유형의 JavaScript 값은 JavaScript에서 속성을 설정할 수 없고 프로토타입이 없는 일반 객체로 나타납니다.


#### `napi_typedarray_type` {#napi_typedarray_type}

```C [C]
typedef enum {
  napi_int8_array,
  napi_uint8_array,
  napi_uint8_clamped_array,
  napi_int16_array,
  napi_uint16_array,
  napi_int32_array,
  napi_uint32_array,
  napi_float32_array,
  napi_float64_array,
  napi_bigint64_array,
  napi_biguint64_array,
} napi_typedarray_type;
```
이는 `TypedArray`의 기본 이진 스칼라 데이터 유형을 나타냅니다. 이 enum의 요소는 [ECMAScript 언어 사양](https://tc39.github.io/ecma262/)의 [섹션 22.2](https://tc39.github.io/ecma262/#sec-typedarray-objects)에 해당합니다.

### 객체 생성 함수 {#object-creation-functions}

#### `napi_create_array` {#napi_create_array}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_create_array(napi_env env, napi_value* result)
```
- `[in] env`: Node-API 호출이 호출되는 환경입니다.
- `[out] result`: JavaScript `Array`를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 JavaScript `Array` 유형에 해당하는 Node-API 값을 반환합니다. JavaScript 배열은 ECMAScript 언어 사양의 [섹션 22.1](https://tc39.github.io/ecma262/#sec-array-objects)에 설명되어 있습니다.

#### `napi_create_array_with_length` {#napi_create_array_with_length}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_create_array_with_length(napi_env env,
                                          size_t length,
                                          napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] length`: `Array`의 초기 길이입니다.
- `[out] result`: JavaScript `Array`를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 JavaScript `Array` 유형에 해당하는 Node-API 값을 반환합니다. `Array`의 length 속성은 전달된 length 매개변수로 설정됩니다. 그러나 배열이 생성될 때 기본 버퍼가 VM에 의해 미리 할당된다는 보장은 없습니다. 해당 동작은 기본 VM 구현에 맡겨져 있습니다. 버퍼가 C를 통해 직접 읽고 쓸 수 있는 연속된 메모리 블록이어야 하는 경우 [`napi_create_external_arraybuffer`](/ko/nodejs/api/n-api#napi_create_external_arraybuffer)를 사용하는 것이 좋습니다.

JavaScript 배열은 ECMAScript 언어 사양의 [섹션 22.1](https://tc39.github.io/ecma262/#sec-array-objects)에 설명되어 있습니다.


#### `napi_create_arraybuffer` {#napi_create_arraybuffer}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_create_arraybuffer(napi_env env,
                                    size_t byte_length,
                                    void** data,
                                    napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] length`: 생성할 배열 버퍼의 바이트 단위 길이입니다.
- `[out] data`: `ArrayBuffer`의 기본 바이트 버퍼에 대한 포인터입니다. `data`는 선택적으로 `NULL`을 전달하여 무시할 수 있습니다.
- `[out] result`: JavaScript `ArrayBuffer`를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 JavaScript `ArrayBuffer`에 해당하는 Node-API 값을 반환합니다. `ArrayBuffer`는 고정 길이의 이진 데이터 버퍼를 나타내는 데 사용됩니다. 일반적으로 `TypedArray` 객체의 지원 버퍼로 사용됩니다. 할당된 `ArrayBuffer`는 전달된 `length` 매개변수에 의해 결정되는 크기의 기본 바이트 버퍼를 갖습니다. 기본 버퍼는 호출자가 버퍼를 직접 조작하려는 경우 선택적으로 호출자에게 다시 반환됩니다. 이 버퍼는 네이티브 코드에서 직접 작성할 수 있습니다. JavaScript에서 이 버퍼에 쓰려면 typed array 또는 `DataView` 객체를 생성해야 합니다.

JavaScript `ArrayBuffer` 객체는 ECMAScript 언어 사양의 [섹션 24.1](https://tc39.github.io/ecma262/#sec-arraybuffer-objects)에 설명되어 있습니다.

#### `napi_create_buffer` {#napi_create_buffer}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_create_buffer(napi_env env,
                               size_t size,
                               void** data,
                               napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] size`: 기본 버퍼의 바이트 단위 크기입니다.
- `[out] data`: 기본 버퍼에 대한 원시 포인터입니다. `data`는 선택적으로 `NULL`을 전달하여 무시할 수 있습니다.
- `[out] result`: `node::Buffer`를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 `node::Buffer` 객체를 할당합니다. 이것은 여전히 완전히 지원되는 데이터 구조이지만, 대부분의 경우 `TypedArray`를 사용하는 것으로 충분합니다.


#### `napi_create_buffer_copy` {#napi_create_buffer_copy}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_create_buffer_copy(napi_env env,
                                    size_t length,
                                    const void* data,
                                    void** result_data,
                                    napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] size`: 입력 버퍼의 크기(바이트 단위)입니다 (새 버퍼의 크기와 동일해야 함).
- `[in] data`: 복사할 기본 버퍼에 대한 원시 포인터입니다.
- `[out] result_data`: 새 `Buffer`의 기본 데이터 버퍼에 대한 포인터입니다. `result_data`는 선택적으로 `NULL`을 전달하여 무시할 수 있습니다.
- `[out] result`: `node::Buffer`를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 `node::Buffer` 객체를 할당하고 전달된 버퍼에서 복사한 데이터로 초기화합니다. 이것은 여전히 완전히 지원되는 데이터 구조이지만, 대부분의 경우 `TypedArray`를 사용하는 것으로 충분합니다.

#### `napi_create_date` {#napi_create_date}

**추가된 버전: v11.11.0, v10.17.0**

**N-API 버전: 5**

```C [C]
napi_status napi_create_date(napi_env env,
                             double time,
                             napi_value* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] time`: 1970년 1월 1일 이후 UTC 기준 밀리초 단위의 ECMAScript 시간 값입니다.
- `[out] result`: JavaScript `Date`를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 윤초를 고려하지 않습니다. ECMAScript는 POSIX 시간 사양에 따라 정렬되므로 윤초는 무시됩니다.

이 API는 JavaScript `Date` 객체를 할당합니다.

JavaScript `Date` 객체는 ECMAScript 언어 사양의 [섹션 20.3](https://tc39.github.io/ecma262/#sec-date-objects)에 설명되어 있습니다.

#### `napi_create_external` {#napi_create_external}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_create_external(napi_env env,
                                 void* data,
                                 napi_finalize finalize_cb,
                                 void* finalize_hint,
                                 napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] data`: 외부 데이터에 대한 원시 포인터입니다.
- `[in] finalize_cb`: 외부 값이 수집될 때 호출할 선택적 콜백입니다. [`napi_finalize`](/ko/nodejs/api/n-api#napi_finalize)는 더 자세한 정보를 제공합니다.
- `[in] finalize_hint`: 수집 중에 종료 콜백에 전달할 선택적 힌트입니다.
- `[out] result`: 외부 값을 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 외부 데이터가 첨부된 JavaScript 값을 할당합니다. 이는 JavaScript 코드를 통해 외부 데이터를 전달하는 데 사용되므로 [`napi_get_value_external`](/ko/nodejs/api/n-api#napi_get_value_external)을 사용하여 네이티브 코드에서 나중에 검색할 수 있습니다.

이 API는 방금 생성된 JavaScript 객체가 가비지 수집되면 호출될 `napi_finalize` 콜백을 추가합니다.

생성된 값은 객체가 아니므로 추가 속성을 지원하지 않습니다. 이는 고유한 값 유형으로 간주됩니다. 외부 값으로 `napi_typeof()`를 호출하면 `napi_external`이 생성됩니다.


#### `napi_create_external_arraybuffer` {#napi_create_external_arraybuffer}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status
napi_create_external_arraybuffer(napi_env env,
                                 void* external_data,
                                 size_t byte_length,
                                 napi_finalize finalize_cb,
                                 void* finalize_hint,
                                 napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] external_data`: `ArrayBuffer`의 기본 바이트 버퍼에 대한 포인터입니다.
- `[in] byte_length`: 기본 버퍼의 바이트 단위 길이입니다.
- `[in] finalize_cb`: `ArrayBuffer`가 수집될 때 호출할 선택적 콜백입니다. [`napi_finalize`](/ko/nodejs/api/n-api#napi_finalize)에서 자세한 내용을 제공합니다.
- `[in] finalize_hint`: 수집 중에 종료 콜백에 전달할 선택적 힌트입니다.
- `[out] result`: JavaScript `ArrayBuffer`를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

**Node.js 이외의 일부 런타임에서는 외부 버퍼에 대한 지원이 중단되었습니다**. Node.js 이외의 런타임에서는 이 메서드가 `napi_no_external_buffers_allowed`를 반환하여 외부 버퍼가 지원되지 않음을 나타낼 수 있습니다. 이러한 런타임 중 하나는 이 이슈 [electron/issues/35801](https://github.com/electron/electron/issues/35801)에 설명된 Electron입니다.

모든 런타임과의 폭넓은 호환성을 유지하려면 노드 API 헤더에 대한 includes 전에 애드온에서 `NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED`를 정의할 수 있습니다. 이렇게 하면 외부 버퍼를 생성하는 2개의 함수가 숨겨집니다. 이렇게 하면 실수로 이러한 메서드 중 하나를 사용하는 경우 컴파일 오류가 발생합니다.

이 API는 JavaScript `ArrayBuffer`에 해당하는 Node-API 값을 반환합니다. `ArrayBuffer`의 기본 바이트 버퍼는 외부에서 할당되고 관리됩니다. 호출자는 종료 콜백이 호출될 때까지 바이트 버퍼가 유효한 상태로 유지되도록 해야 합니다.

이 API는 방금 생성된 JavaScript 객체가 가비지 수집될 때 호출되는 `napi_finalize` 콜백을 추가합니다.

JavaScript `ArrayBuffer`는 ECMAScript 언어 사양의 [섹션 24.1](https://tc39.github.io/ecma262/#sec-arraybuffer-objects)에 설명되어 있습니다.


#### `napi_create_external_buffer` {#napi_create_external_buffer}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_create_external_buffer(napi_env env,
                                        size_t length,
                                        void* data,
                                        napi_finalize finalize_cb,
                                        void* finalize_hint,
                                        napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] length`: 입력 버퍼의 크기(바이트 단위)입니다 (새 버퍼의 크기와 동일해야 함).
- `[in] data`: JavaScript에 노출할 기본 버퍼에 대한 원시 포인터입니다.
- `[in] finalize_cb`: `ArrayBuffer`가 수집될 때 호출할 선택적 콜백입니다. [`napi_finalize`](/ko/nodejs/api/n-api#napi_finalize)에서 자세한 내용을 제공합니다.
- `[in] finalize_hint`: 수집 중에 finalize 콜백에 전달할 선택적 힌트입니다.
- `[out] result`: `node::Buffer`를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

**Node.js 이외의 일부 런타임에서는 외부 버퍼에 대한 지원이 중단되었습니다**. Node.js 이외의 런타임에서는 이 메서드가 `napi_no_external_buffers_allowed`를 반환하여 외부 버퍼가 지원되지 않음을 나타낼 수 있습니다. 이러한 런타임 중 하나는 이 문제에 설명된 Electron입니다. [electron/issues/35801](https://github.com/electron/electron/issues/35801).

모든 런타임과의 광범위한 호환성을 유지하려면 node-api 헤더에 대한 include 전에 애드온에서 `NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED`를 정의할 수 있습니다. 이렇게 하면 외부 버퍼를 생성하는 2개의 함수가 숨겨집니다. 이렇게 하면 실수로 이러한 메서드 중 하나를 사용하는 경우 컴파일 오류가 발생합니다.

이 API는 `node::Buffer` 객체를 할당하고 전달된 버퍼로 지원되는 데이터로 초기화합니다. 이것은 여전히 완전히 지원되는 데이터 구조이지만 대부분의 경우 `TypedArray`를 사용하는 것으로 충분합니다.

이 API는 방금 생성된 JavaScript 객체가 가비지 수집되었을 때 호출되는 `napi_finalize` 콜백을 추가합니다.

Node.js \>=4의 경우 `Buffers`는 `Uint8Array`입니다.


#### `napi_create_object` {#napi_create_object}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_create_object(napi_env env, napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[out] result`: JavaScript `Object`를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 기본 JavaScript `Object`를 할당합니다. JavaScript에서 `new Object()`를 수행하는 것과 같습니다.

JavaScript `Object` 유형은 ECMAScript 언어 사양의 [섹션 6.1.7](https://tc39.github.io/ecma262/#sec-object-type)에 설명되어 있습니다.

#### `napi_create_symbol` {#napi_create_symbol}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_create_symbol(napi_env env,
                               napi_value description,
                               napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] description`: 심볼에 대한 설명으로 설정될 JavaScript `string`을 참조하는 선택적 `napi_value`입니다.
- `[out] result`: JavaScript `symbol`을 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 UTF8로 인코딩된 C 문자열에서 JavaScript `symbol` 값을 생성합니다.

JavaScript `symbol` 유형은 ECMAScript 언어 사양의 [섹션 19.4](https://tc39.github.io/ecma262/#sec-symbol-objects)에 설명되어 있습니다.

#### `node_api_symbol_for` {#node_api_symbol_for}

**Added in: v17.5.0, v16.15.0**

**N-API version: 9**

```C [C]
napi_status node_api_symbol_for(napi_env env,
                                const char* utf8description,
                                size_t length,
                                napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] utf8description`: 심볼에 대한 설명으로 사용될 텍스트를 나타내는 UTF-8 C 문자열입니다.
- `[in] length`: 설명 문자열의 바이트 단위 길이이거나, null로 끝나는 경우 `NAPI_AUTO_LENGTH`입니다.
- `[out] result`: JavaScript `symbol`을 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 주어진 설명이 있는 기존 심볼에 대해 전역 레지스트리를 검색합니다. 심볼이 이미 존재하는 경우 반환되고, 그렇지 않으면 레지스트리에 새 심볼이 생성됩니다.

JavaScript `symbol` 유형은 ECMAScript 언어 사양의 [섹션 19.4](https://tc39.github.io/ecma262/#sec-symbol-objects)에 설명되어 있습니다.


#### `napi_create_typedarray` {#napi_create_typedarray}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_create_typedarray(napi_env env,
                                   napi_typedarray_type type,
                                   size_t length,
                                   napi_value arraybuffer,
                                   size_t byte_offset,
                                   napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] type`: `TypedArray` 내의 요소의 스칼라 데이터 유형입니다.
- `[in] length`: `TypedArray`의 요소 수입니다.
- `[in] arraybuffer`: 유형화된 배열의 기본 `ArrayBuffer`입니다.
- `[in] byte_offset`: `ArrayBuffer` 내에서 `TypedArray` 프로젝션을 시작할 바이트 오프셋입니다.
- `[out] result`: JavaScript `TypedArray`를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 기존 `ArrayBuffer` 위에 JavaScript `TypedArray` 객체를 만듭니다. `TypedArray` 객체는 각 요소가 동일한 기본 이진 스칼라 데이터 유형을 갖는 기본 데이터 버퍼에 대한 배열과 유사한 뷰를 제공합니다.

`(length * size_of_element) + byte_offset`이 전달된 배열의 바이트 크기보다 작거나 같아야 합니다. 그렇지 않으면 `RangeError` 예외가 발생합니다.

JavaScript `TypedArray` 객체는 ECMAScript 언어 사양의 [섹션 22.2](https://tc39.github.io/ecma262/#sec-typedarray-objects)에 설명되어 있습니다.

#### `node_api_create_buffer_from_arraybuffer` {#node_api_create_buffer_from_arraybuffer}

**Added in: v23.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

```C [C]
napi_status NAPI_CDECL node_api_create_buffer_from_arraybuffer(napi_env env,
                                                              napi_value arraybuffer,
                                                              size_t byte_offset,
                                                              size_t byte_length,
                                                              napi_value* result)
```
- **<code>[in] env</code>**: API가 호출되는 환경입니다.
- **<code>[in] arraybuffer</code>**: 버퍼가 생성될 `ArrayBuffer`입니다.
- **<code>[in] byte_offset</code>**: 버퍼 생성을 시작할 `ArrayBuffer` 내의 바이트 오프셋입니다.
- **<code>[in] byte_length</code>**: `ArrayBuffer`에서 생성할 버퍼의 바이트 단위 길이입니다.
- **<code>[out] result</code>**: 생성된 JavaScript `Buffer` 객체를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 기존 `ArrayBuffer`에서 JavaScript `Buffer` 객체를 만듭니다. `Buffer` 객체는 JavaScript에서 직접 이진 데이터를 처리하는 방법을 제공하는 Node.js 관련 클래스입니다.

바이트 범위 `[byte_offset, byte_offset + byte_length)`는 `ArrayBuffer`의 경계 내에 있어야 합니다. `byte_offset + byte_length`가 `ArrayBuffer`의 크기를 초과하면 `RangeError` 예외가 발생합니다.


#### `napi_create_dataview` {#napi_create_dataview}

**추가된 버전: v8.3.0**

**N-API 버전: 1**

```C [C]
napi_status napi_create_dataview(napi_env env,
                                 size_t byte_length,
                                 napi_value arraybuffer,
                                 size_t byte_offset,
                                 napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] length`: `DataView` 내의 요소 수입니다.
- `[in] arraybuffer`: `DataView`의 기본 `ArrayBuffer`입니다.
- `[in] byte_offset`: `DataView` 투영을 시작할 `ArrayBuffer` 내의 바이트 오프셋입니다.
- `[out] result`: JavaScript `DataView`를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 기존 `ArrayBuffer`에 대한 JavaScript `DataView` 객체를 생성합니다. `DataView` 객체는 기본 데이터 버퍼에 대한 배열과 유사한 뷰를 제공하지만 `ArrayBuffer`에서 다른 크기와 유형의 항목을 허용합니다.

`byte_length + byte_offset`가 전달된 배열의 바이트 크기보다 작거나 같아야 합니다. 그렇지 않으면 `RangeError` 예외가 발생합니다.

JavaScript `DataView` 객체는 ECMAScript 언어 사양의 [섹션 24.3](https://tc39.github.io/ecma262/#sec-dataview-objects)에 설명되어 있습니다.

### C 유형에서 Node-API로 변환하는 함수 {#functions-to-convert-from-c-types-to-node-api}

#### `napi_create_int32` {#napi_create_int32}

**추가된 버전: v8.4.0**

**N-API 버전: 1**

```C [C]
napi_status napi_create_int32(napi_env env, int32_t value, napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: JavaScript로 표현될 정수 값입니다.
- `[out] result`: JavaScript `number`를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 C `int32_t` 유형에서 JavaScript `number` 유형으로 변환하는 데 사용됩니다.

JavaScript `number` 유형은 ECMAScript 언어 사양의 [섹션 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type)에 설명되어 있습니다.


#### `napi_create_uint32` {#napi_create_uint32}

**추가됨: v8.4.0**

**N-API 버전: 1**

```C [C]
napi_status napi_create_uint32(napi_env env, uint32_t value, napi_value* result)
```
- `[in] env`: API가 호출된 환경입니다.
- `[in] value`: JavaScript에서 표현할 부호 없는 정수 값입니다.
- `[out] result`: JavaScript `number`를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 C `uint32_t` 유형에서 JavaScript `number` 유형으로 변환하는 데 사용됩니다.

JavaScript `number` 유형은 ECMAScript 언어 사양의 [섹션 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type)에 설명되어 있습니다.

#### `napi_create_int64` {#napi_create_int64}

**추가됨: v8.4.0**

**N-API 버전: 1**

```C [C]
napi_status napi_create_int64(napi_env env, int64_t value, napi_value* result)
```
- `[in] env`: API가 호출된 환경입니다.
- `[in] value`: JavaScript에서 표현할 정수 값입니다.
- `[out] result`: JavaScript `number`를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 C `int64_t` 유형에서 JavaScript `number` 유형으로 변환하는 데 사용됩니다.

JavaScript `number` 유형은 ECMAScript 언어 사양의 [섹션 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type)에 설명되어 있습니다. `int64_t`의 전체 범위는 JavaScript에서 완전한 정밀도로 표현할 수 없습니다. [`Number.MIN_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.min_safe_integer) `-(2**53 - 1)` - [`Number.MAX_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.max_safe_integer) `(2**53 - 1)` 범위 밖의 정수 값은 정밀도를 잃게 됩니다.

#### `napi_create_double` {#napi_create_double}

**추가됨: v8.4.0**

**N-API 버전: 1**

```C [C]
napi_status napi_create_double(napi_env env, double value, napi_value* result)
```
- `[in] env`: API가 호출된 환경입니다.
- `[in] value`: JavaScript에서 표현할 배정밀도 값입니다.
- `[out] result`: JavaScript `number`를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 C `double` 유형에서 JavaScript `number` 유형으로 변환하는 데 사용됩니다.

JavaScript `number` 유형은 ECMAScript 언어 사양의 [섹션 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type)에 설명되어 있습니다.


#### `napi_create_bigint_int64` {#napi_create_bigint_int64}

**추가된 버전: v10.7.0**

**N-API 버전: 6**

```C [C]
napi_status napi_create_bigint_int64(napi_env env,
                                     int64_t value,
                                     napi_value* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: JavaScript에 표현될 정수 값입니다.
- `[out] result`: JavaScript `BigInt`를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 C `int64_t` 형식을 JavaScript `BigInt` 형식으로 변환합니다.

#### `napi_create_bigint_uint64` {#napi_create_bigint_uint64}

**추가된 버전: v10.7.0**

**N-API 버전: 6**

```C [C]
napi_status napi_create_bigint_uint64(napi_env env,
                                      uint64_t value,
                                      napi_value* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: JavaScript에 표현될 부호 없는 정수 값입니다.
- `[out] result`: JavaScript `BigInt`를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 C `uint64_t` 형식을 JavaScript `BigInt` 형식으로 변환합니다.

#### `napi_create_bigint_words` {#napi_create_bigint_words}

**추가된 버전: v10.7.0**

**N-API 버전: 6**

```C [C]
napi_status napi_create_bigint_words(napi_env env,
                                     int sign_bit,
                                     size_t word_count,
                                     const uint64_t* words,
                                     napi_value* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] sign_bit`: 결과 `BigInt`가 양수인지 음수인지 결정합니다.
- `[in] word_count`: `words` 배열의 길이입니다.
- `[in] words`: `uint64_t` little-endian 64비트 워드의 배열입니다.
- `[out] result`: JavaScript `BigInt`를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 부호 없는 64비트 워드 배열을 단일 `BigInt` 값으로 변환합니다.

결과 `BigInt`는 다음과 같이 계산됩니다. (–1) (`words[0]` × (2) + `words[1]` × (2) + …)


#### `napi_create_string_latin1` {#napi_create_string_latin1}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_create_string_latin1(napi_env env,
                                      const char* str,
                                      size_t length,
                                      napi_value* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] str`: ISO-8859-1로 인코딩된 문자열을 나타내는 문자 버퍼입니다.
- `[in] length`: 바이트 단위의 문자열 길이입니다. null로 종료되는 경우 `NAPI_AUTO_LENGTH`입니다.
- `[out] result`: JavaScript `string`을 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 ISO-8859-1로 인코딩된 C 문자열에서 JavaScript `string` 값을 만듭니다. 네이티브 문자열은 복사됩니다.

JavaScript `string` 유형은 ECMAScript 언어 사양의 [섹션 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type)에 설명되어 있습니다.

#### `node_api_create_external_string_latin1` {#node_api_create_external_string_latin1}

**추가된 버전: v20.4.0, v18.18.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

```C [C]
napi_status
node_api_create_external_string_latin1(napi_env env,
                                       char* str,
                                       size_t length,
                                       napi_finalize finalize_callback,
                                       void* finalize_hint,
                                       napi_value* result,
                                       bool* copied);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] str`: ISO-8859-1로 인코딩된 문자열을 나타내는 문자 버퍼입니다.
- `[in] length`: 바이트 단위의 문자열 길이입니다. null로 종료되는 경우 `NAPI_AUTO_LENGTH`입니다.
- `[in] finalize_callback`: 문자열이 수집될 때 호출할 함수입니다. 이 함수는 다음 매개변수로 호출됩니다.
    - `[in] env`: 애드온이 실행 중인 환경입니다. 이 값은 문자열이 작업자 또는 기본 Node.js 인스턴스의 종료의 일부로 수집되는 경우 null일 수 있습니다.
    - `[in] data`: `void*` 포인터인 `str` 값입니다.
    - `[in] finalize_hint`: API에 제공된 `finalize_hint` 값입니다. [`napi_finalize`](/ko/nodejs/api/n-api#napi_finalize)에서 자세한 내용을 제공합니다. 이 매개변수는 선택 사항입니다. null 값을 전달하면 해당 JavaScript 문자열이 수집될 때 애드온에 알릴 필요가 없음을 의미합니다.
  
 
- `[in] finalize_hint`: 수집 중 finalize 콜백에 전달할 선택적 힌트입니다.
- `[out] result`: JavaScript `string`을 나타내는 `napi_value`입니다.
- `[out] copied`: 문자열이 복사되었는지 여부입니다. 복사된 경우 finalizer는 이미 `str`을 파괴하기 위해 호출되었습니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 ISO-8859-1로 인코딩된 C 문자열에서 JavaScript `string` 값을 만듭니다. 네이티브 문자열은 복사되지 않을 수 있으므로 JavaScript 값의 전체 수명 주기 동안 존재해야 합니다.

JavaScript `string` 유형은 ECMAScript 언어 사양의 [섹션 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type)에 설명되어 있습니다.


#### `napi_create_string_utf16` {#napi_create_string_utf16}

**추가됨: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_create_string_utf16(napi_env env,
                                     const char16_t* str,
                                     size_t length,
                                     napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] str`: UTF16-LE로 인코딩된 문자열을 나타내는 문자 버퍼입니다.
- `[in] length`: 문자열의 길이를 2바이트 코드 단위로 나타내거나, null로 종료된 경우 `NAPI_AUTO_LENGTH`를 사용합니다.
- `[out] result`: JavaScript `string`을 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 UTF16-LE로 인코딩된 C 문자열에서 JavaScript `string` 값을 생성합니다. 네이티브 문자열은 복사됩니다.

JavaScript `string` 유형은 ECMAScript Language Specification의 [섹션 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type)에 설명되어 있습니다.

#### `node_api_create_external_string_utf16` {#node_api_create_external_string_utf16}

**추가됨: v20.4.0, v18.18.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

```C [C]
napi_status
node_api_create_external_string_utf16(napi_env env,
                                      char16_t* str,
                                      size_t length,
                                      napi_finalize finalize_callback,
                                      void* finalize_hint,
                                      napi_value* result,
                                      bool* copied);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] str`: UTF16-LE로 인코딩된 문자열을 나타내는 문자 버퍼입니다.
- `[in] length`: 문자열의 길이를 2바이트 코드 단위로 나타내거나, null로 종료된 경우 `NAPI_AUTO_LENGTH`를 사용합니다.
- `[in] finalize_callback`: 문자열이 수집될 때 호출할 함수입니다. 이 함수는 다음 매개변수와 함께 호출됩니다.
    - `[in] env`: 애드온이 실행 중인 환경입니다. 문자열이 작업자 또는 기본 Node.js 인스턴스의 종료 과정의 일부로 수집되는 경우 이 값은 null일 수 있습니다.
    - `[in] data`: `void*` 포인터로 변환된 `str` 값입니다.
    - `[in] finalize_hint`: API에 제공된 `finalize_hint` 값입니다. [`napi_finalize`](/ko/nodejs/api/n-api#napi_finalize)에서 자세한 내용을 제공합니다. 이 매개변수는 선택 사항입니다. null 값을 전달하면 해당 JavaScript 문자열이 수집될 때 애드온에 알릴 필요가 없음을 의미합니다.

- `[in] finalize_hint`: 수집 중에 finalize 콜백에 전달할 선택적 힌트입니다.
- `[out] result`: JavaScript `string`을 나타내는 `napi_value`입니다.
- `[out] copied`: 문자열이 복사되었는지 여부입니다. 복사된 경우 finalizer가 이미 호출되어 `str`을 제거했을 것입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 UTF16-LE로 인코딩된 C 문자열에서 JavaScript `string` 값을 생성합니다. 네이티브 문자열은 복사되지 않을 수 있으므로 JavaScript 값의 전체 수명 주기 동안 존재해야 합니다.

JavaScript `string` 유형은 ECMAScript Language Specification의 [섹션 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type)에 설명되어 있습니다.


#### `napi_create_string_utf8` {#napi_create_string_utf8}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_create_string_utf8(napi_env env,
                                    const char* str,
                                    size_t length,
                                    napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] str`: UTF8로 인코딩된 문자열을 나타내는 문자 버퍼입니다.
- `[in] length`: 문자열의 바이트 길이입니다. null로 종료되는 경우 `NAPI_AUTO_LENGTH`입니다.
- `[out] result`: JavaScript `string`을 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 UTF8로 인코딩된 C 문자열에서 JavaScript `string` 값을 만듭니다. 네이티브 문자열은 복사됩니다.

JavaScript `string` 유형은 ECMAScript 언어 사양의 [섹션 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type)에 설명되어 있습니다.

### 최적화된 속성 키를 생성하는 함수 {#functions-to-create-optimized-property-keys}

V8을 포함한 많은 JavaScript 엔진은 내부화된 문자열을 키로 사용하여 속성 값을 설정하고 가져옵니다. 일반적으로 해시 테이블을 사용하여 이러한 문자열을 만들고 조회합니다. 키 생성당 약간의 비용이 추가되지만 전체 문자열 대신 문자열 포인터를 비교할 수 있도록 하여 그 이후의 성능을 향상시킵니다.

새 JavaScript 문자열을 속성 키로 사용하려는 경우 일부 JavaScript 엔진의 경우 이 섹션의 함수를 사용하는 것이 더 효율적입니다. 그렇지 않으면 속성 키 생성 방법으로 문자열을 만들거나 저장하는 데 추가 오버헤드가 있을 수 있으므로 `napi_create_string_utf8` 또는 `node_api_create_external_string_utf8` 시리즈 함수를 사용하십시오.

#### `node_api_create_property_key_latin1` {#node_api_create_property_key_latin1}

**Added in: v22.9.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_latin1(napi_env env,
                                                           const char* str,
                                                           size_t length,
                                                           napi_value* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] str`: ISO-8859-1로 인코딩된 문자열을 나타내는 문자 버퍼입니다.
- `[in] length`: 문자열의 바이트 길이입니다. null로 종료되는 경우 `NAPI_AUTO_LENGTH`입니다.
- `[out] result`: 객체의 속성 키로 사용할 최적화된 JavaScript `string`을 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 객체의 속성 키로 사용할 ISO-8859-1로 인코딩된 C 문자열에서 최적화된 JavaScript `string` 값을 만듭니다. 네이티브 문자열은 복사됩니다. `napi_create_string_latin1`과 달리 동일한 `str` 포인터로 이 함수를 후속적으로 호출하면 엔진에 따라 요청된 `napi_value`를 더 빠르게 만들 수 있습니다.

JavaScript `string` 유형은 ECMAScript 언어 사양의 [섹션 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type)에 설명되어 있습니다.


#### `node_api_create_property_key_utf16` {#node_api_create_property_key_utf16}

**Added in: v21.7.0, v20.12.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - Experimental
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_utf16(napi_env env,
                                                          const char16_t* str,
                                                          size_t length,
                                                          napi_value* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] str`: UTF16-LE로 인코딩된 문자열을 나타내는 문자 버퍼입니다.
- `[in] length`: 문자열의 길이를 2바이트 코드 단위로 나타냅니다. null로 종료된 경우 `NAPI_AUTO_LENGTH`입니다.
- `[out] result`: 객체의 속성 키로 사용될 최적화된 JavaScript `string`을 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 객체의 속성 키로 사용될 UTF16-LE로 인코딩된 C 문자열에서 최적화된 JavaScript `string` 값을 생성합니다. 네이티브 문자열이 복사됩니다.

JavaScript `string` 유형은 ECMAScript 언어 사양의 [섹션 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type)에 설명되어 있습니다.

#### `node_api_create_property_key_utf8` {#node_api_create_property_key_utf8}

**Added in: v22.9.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index) - Experimental
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_utf8(napi_env env,
                                                         const char* str,
                                                         size_t length,
                                                         napi_value* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] str`: UTF8로 인코딩된 문자열을 나타내는 문자 버퍼입니다.
- `[in] length`: 문자열의 길이를 2바이트 코드 단위로 나타냅니다. null로 종료된 경우 `NAPI_AUTO_LENGTH`입니다.
- `[out] result`: 객체의 속성 키로 사용될 최적화된 JavaScript `string`을 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 객체의 속성 키로 사용될 UTF8로 인코딩된 C 문자열에서 최적화된 JavaScript `string` 값을 생성합니다. 네이티브 문자열이 복사됩니다.

JavaScript `string` 유형은 ECMAScript 언어 사양의 [섹션 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type)에 설명되어 있습니다.


### Node-API에서 C 타입으로 변환하는 함수 {#functions-to-convert-from-node-api-to-c-types}

#### `napi_get_array_length` {#napi_get_array_length}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_get_array_length(napi_env env,
                                  napi_value value,
                                  uint32_t* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: 길이를 쿼리할 JavaScript `Array`를 나타내는 `napi_value`입니다.
- `[out] result`: 배열의 길이를 나타내는 `uint32`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 배열의 길이를 반환합니다.

`Array` 길이는 ECMAScript 언어 사양의 [섹션 22.1.4.1](https://tc39.github.io/ecma262/#sec-properties-of-array-instances-length)에 설명되어 있습니다.

#### `napi_get_arraybuffer_info` {#napi_get_arraybuffer_info}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_get_arraybuffer_info(napi_env env,
                                      napi_value arraybuffer,
                                      void** data,
                                      size_t* byte_length)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] arraybuffer`: 쿼리할 `ArrayBuffer`를 나타내는 `napi_value`입니다.
- `[out] data`: `ArrayBuffer`의 기본 데이터 버퍼입니다. byte_length가 `0`이면 `NULL`이거나 다른 포인터 값일 수 있습니다.
- `[out] byte_length`: 기본 데이터 버퍼의 바이트 단위 길이입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 `ArrayBuffer`의 기본 데이터 버퍼와 길이를 검색하는 데 사용됩니다.

*경고*: 이 API를 사용하는 동안 주의하십시오. 기본 데이터 버퍼의 수명은 반환된 후에도 `ArrayBuffer`에 의해 관리됩니다. 이 API를 사용하는 안전한 방법은 [`napi_create_reference`](/ko/nodejs/api/n-api#napi_create_reference)와 함께 사용하는 것입니다. 이는 `ArrayBuffer`의 수명에 대한 제어를 보장하는 데 사용할 수 있습니다. GC를 트리거할 수 있는 다른 API 호출이 없는 한 동일한 콜백 내에서 반환된 데이터 버퍼를 사용하는 것도 안전합니다.


#### `napi_get_buffer_info` {#napi_get_buffer_info}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_buffer_info(napi_env env,
                                 napi_value value,
                                 void** data,
                                 size_t* length)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: 쿼리 중인 `node::Buffer` 또는 `Uint8Array`를 나타내는 `napi_value`입니다.
- `[out] data`: `node::Buffer` 또는 `Uint8Array`의 기본 데이터 버퍼입니다. 길이가 `0`이면 `NULL` 또는 다른 포인터 값일 수 있습니다.
- `[out] length`: 기본 데이터 버퍼의 바이트 단위 길이입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 메서드는 [`napi_get_typedarray_info`](/ko/nodejs/api/n-api#napi_get_typedarray_info)와 동일한 `data`와 `byte_length`를 반환합니다. 또한 `napi_get_typedarray_info`는 `node::Buffer` (Uint8Array)를 값으로 허용합니다.

이 API는 `node::Buffer`의 기본 데이터 버퍼와 길이를 검색하는 데 사용됩니다.

*경고*: 기본 데이터 버퍼가 VM에 의해 관리되는 경우 수명이 보장되지 않으므로 이 API를 사용할 때는 주의하십시오.

#### `napi_get_prototype` {#napi_get_prototype}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_prototype(napi_env env,
                               napi_value object,
                               napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] object`: 반환할 프로토타입이 있는 JavaScript `Object`를 나타내는 `napi_value`입니다. 이것은 `Object.getPrototypeOf`와 동일한 값을 반환합니다 (함수의 `prototype` 속성과는 다름).
- `[out] result`: 주어진 객체의 프로토타입을 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

#### `napi_get_typedarray_info` {#napi_get_typedarray_info}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_typedarray_info(napi_env env,
                                     napi_value typedarray,
                                     napi_typedarray_type* type,
                                     size_t* length,
                                     void** data,
                                     napi_value* arraybuffer,
                                     size_t* byte_offset)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] typedarray`: 속성을 쿼리할 `TypedArray`를 나타내는 `napi_value`입니다.
- `[out] type`: `TypedArray` 내 요소의 스칼라 데이터 유형입니다.
- `[out] length`: `TypedArray`의 요소 수입니다.
- `[out] data`: `TypedArray`의 첫 번째 요소를 가리키도록 `byte_offset` 값으로 조정된 `TypedArray`의 기본 데이터 버퍼입니다. 배열의 길이가 `0`이면 `NULL` 또는 다른 포인터 값일 수 있습니다.
- `[out] arraybuffer`: `TypedArray`의 기본 `ArrayBuffer`입니다.
- `[out] byte_offset`: 배열의 첫 번째 요소가 있는 기본 네이티브 배열 내의 바이트 오프셋입니다. 데이터 매개변수에 대한 값은 이미 조정되어 데이터가 배열의 첫 번째 요소를 가리키도록 했습니다. 따라서 네이티브 배열의 첫 번째 바이트는 `data - byte_offset`에 있습니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 유형화된 배열의 다양한 속성을 반환합니다.

해당 속성이 필요하지 않은 경우 모든 out 매개변수가 `NULL`일 수 있습니다.

*경고*: 기본 데이터 버퍼가 VM에 의해 관리되므로 이 API를 사용할 때는 주의하십시오.


#### `napi_get_dataview_info` {#napi_get_dataview_info}

**Added in: v8.3.0**

**N-API version: 1**

```C [C]
napi_status napi_get_dataview_info(napi_env env,
                                   napi_value dataview,
                                   size_t* byte_length,
                                   void** data,
                                   napi_value* arraybuffer,
                                   size_t* byte_offset)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] dataview`: 쿼리할 속성을 가진 `DataView`를 나타내는 `napi_value`입니다.
- `[out] byte_length`: `DataView`의 바이트 수입니다.
- `[out] data`: `DataView`의 기본 데이터 버퍼입니다. byte_length가 `0`이면 `NULL` 또는 다른 포인터 값이 될 수 있습니다.
- `[out] arraybuffer`: `DataView`의 기본 `ArrayBuffer`입니다.
- `[out] byte_offset`: `DataView` 프로젝션을 시작할 데이터 버퍼 내의 바이트 오프셋입니다.

API가 성공하면 `napi_ok`를 반환합니다.

해당 속성이 필요하지 않으면 출력 매개변수 중 하나가 `NULL`일 수 있습니다.

이 API는 `DataView`의 다양한 속성을 반환합니다.

#### `napi_get_date_value` {#napi_get_date_value}

**Added in: v11.11.0, v10.17.0**

**N-API version: 5**

```C [C]
napi_status napi_get_date_value(napi_env env,
                                napi_value value,
                                double* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: JavaScript `Date`를 나타내는 `napi_value`입니다.
- `[out] result`: 1970년 1월 1일 0시 이후의 밀리초로 표시되는 `double`로 표시되는 시간 값입니다 (UTC 기준).

이 API는 윤초를 관찰하지 않습니다. ECMAScript가 POSIX 시간 사양과 일치하므로 무시됩니다.

API가 성공하면 `napi_ok`를 반환합니다. 날짜가 아닌 `napi_value`가 전달되면 `napi_date_expected`를 반환합니다.

이 API는 주어진 JavaScript `Date`에 대한 시간 값의 C double 기본형을 반환합니다.

#### `napi_get_value_bool` {#napi_get_value_bool}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_value_bool(napi_env env, napi_value value, bool* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: JavaScript `Boolean`을 나타내는 `napi_value`입니다.
- `[out] result`: 주어진 JavaScript `Boolean`과 동일한 C 부울 기본형입니다.

API가 성공하면 `napi_ok`를 반환합니다. 부울이 아닌 `napi_value`가 전달되면 `napi_boolean_expected`를 반환합니다.

이 API는 주어진 JavaScript `Boolean`과 동일한 C 부울 기본형을 반환합니다.


#### `napi_get_value_double` {#napi_get_value_double}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_get_value_double(napi_env env,
                                  napi_value value,
                                  double* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: JavaScript `number`를 나타내는 `napi_value`입니다.
- `[out] result`: 주어진 JavaScript `number`에 상응하는 C double 기본형입니다.

API가 성공하면 `napi_ok`를 반환합니다. 숫자가 아닌 `napi_value`가 전달되면 `napi_number_expected`를 반환합니다.

이 API는 주어진 JavaScript `number`에 상응하는 C double 기본형을 반환합니다.

#### `napi_get_value_bigint_int64` {#napi_get_value_bigint_int64}

**추가된 버전: v10.7.0**

**N-API 버전: 6**

```C [C]
napi_status napi_get_value_bigint_int64(napi_env env,
                                        napi_value value,
                                        int64_t* result,
                                        bool* lossless);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: JavaScript `BigInt`를 나타내는 `napi_value`입니다.
- `[out] result`: 주어진 JavaScript `BigInt`에 상응하는 C `int64_t` 기본형입니다.
- `[out] lossless`: `BigInt` 값이 손실 없이 변환되었는지 여부를 나타냅니다.

API가 성공하면 `napi_ok`를 반환합니다. `BigInt`가 아닌 값이 전달되면 `napi_bigint_expected`를 반환합니다.

이 API는 주어진 JavaScript `BigInt`에 상응하는 C `int64_t` 기본형을 반환합니다. 필요한 경우 값을 자르고 `lossless`를 `false`로 설정합니다.

#### `napi_get_value_bigint_uint64` {#napi_get_value_bigint_uint64}

**추가된 버전: v10.7.0**

**N-API 버전: 6**

```C [C]
napi_status napi_get_value_bigint_uint64(napi_env env,
                                        napi_value value,
                                        uint64_t* result,
                                        bool* lossless);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: JavaScript `BigInt`를 나타내는 `napi_value`입니다.
- `[out] result`: 주어진 JavaScript `BigInt`에 상응하는 C `uint64_t` 기본형입니다.
- `[out] lossless`: `BigInt` 값이 손실 없이 변환되었는지 여부를 나타냅니다.

API가 성공하면 `napi_ok`를 반환합니다. `BigInt`가 아닌 값이 전달되면 `napi_bigint_expected`를 반환합니다.

이 API는 주어진 JavaScript `BigInt`에 상응하는 C `uint64_t` 기본형을 반환합니다. 필요한 경우 값을 자르고 `lossless`를 `false`로 설정합니다.


#### `napi_get_value_bigint_words` {#napi_get_value_bigint_words}

**추가된 버전: v10.7.0**

**N-API 버전: 6**

```C [C]
napi_status napi_get_value_bigint_words(napi_env env,
                                        napi_value value,
                                        int* sign_bit,
                                        size_t* word_count,
                                        uint64_t* words);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: JavaScript `BigInt`를 나타내는 `napi_value`입니다.
- `[out] sign_bit`: JavaScript `BigInt`가 양수인지 음수인지 나타내는 정수입니다.
- `[in/out] word_count`: `words` 배열의 길이로 초기화해야 합니다. 반환 시 이 `BigInt`를 저장하는 데 필요한 실제 단어 수로 설정됩니다.
- `[out] words`: 미리 할당된 64비트 단어 배열에 대한 포인터입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 단일 `BigInt` 값을 부호 비트, 64비트 리틀 엔디언 배열 및 배열의 요소 수로 변환합니다. `word_count`만 가져오기 위해 `sign_bit`와 `words`를 모두 `NULL`로 설정할 수 있습니다.

#### `napi_get_value_external` {#napi_get_value_external}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_get_value_external(napi_env env,
                                    napi_value value,
                                    void** result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: JavaScript 외부 값을 나타내는 `napi_value`입니다.
- `[out] result`: JavaScript 외부 값으로 래핑된 데이터에 대한 포인터입니다.

API가 성공하면 `napi_ok`를 반환합니다. 외부가 아닌 `napi_value`가 전달되면 `napi_invalid_arg`를 반환합니다.

이 API는 이전에 `napi_create_external()`에 전달된 외부 데이터 포인터를 검색합니다.

#### `napi_get_value_int32` {#napi_get_value_int32}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_get_value_int32(napi_env env,
                                 napi_value value,
                                 int32_t* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: JavaScript `number`를 나타내는 `napi_value`입니다.
- `[out] result`: 주어진 JavaScript `number`와 동일한 C `int32` 기본 형식입니다.

API가 성공하면 `napi_ok`를 반환합니다. 숫자가 아닌 `napi_value`가 전달되면 `napi_number_expected`를 반환합니다.

이 API는 주어진 JavaScript `number`와 동일한 C `int32` 기본 형식을 반환합니다.

숫자가 32비트 정수 범위를 초과하면 결과는 하위 32비트와 동일하게 잘립니다. 이로 인해 값이 \> 2 - 1인 경우 큰 양수가 음수가 될 수 있습니다.

유한하지 않은 숫자 값(`NaN`, `+Infinity` 또는 `-Infinity`)은 결과를 0으로 설정합니다.


#### `napi_get_value_int64` {#napi_get_value_int64}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_get_value_int64(napi_env env,
                                 napi_value value,
                                 int64_t* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: JavaScript `number`를 나타내는 `napi_value`입니다.
- `[out] result`: 주어진 JavaScript `number`와 동일한 C `int64` 프리미티브입니다.

API가 성공하면 `napi_ok`를 반환합니다. 숫자가 아닌 `napi_value`가 전달되면 `napi_number_expected`를 반환합니다.

이 API는 주어진 JavaScript `number`와 동일한 C `int64` 프리미티브를 반환합니다.

[`Number.MIN_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.min_safe_integer) `-(2**53 - 1)` - [`Number.MAX_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.max_safe_integer) `(2**53 - 1)` 범위를 벗어난 `number` 값은 정밀도를 잃게 됩니다.

유한하지 않은 숫자 값(`NaN`, `+Infinity` 또는 `-Infinity`)은 결과를 0으로 설정합니다.

#### `napi_get_value_string_latin1` {#napi_get_value_string_latin1}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_get_value_string_latin1(napi_env env,
                                         napi_value value,
                                         char* buf,
                                         size_t bufsize,
                                         size_t* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: JavaScript 문자열을 나타내는 `napi_value`입니다.
- `[in] buf`: ISO-8859-1로 인코딩된 문자열을 쓸 버퍼입니다. `NULL`이 전달되면 null 종결자를 제외한 문자열의 바이트 길이가 `result`에 반환됩니다.
- `[in] bufsize`: 대상 버퍼의 크기입니다. 이 값이 부족하면 반환된 문자열이 잘리고 null로 끝납니다.
- `[out] result`: null 종결자를 제외하고 버퍼에 복사된 바이트 수입니다.

API가 성공하면 `napi_ok`를 반환합니다. `string`이 아닌 `napi_value`가 전달되면 `napi_string_expected`를 반환합니다.

이 API는 전달된 값에 해당하는 ISO-8859-1로 인코딩된 문자열을 반환합니다.


#### `napi_get_value_string_utf8` {#napi_get_value_string_utf8}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_value_string_utf8(napi_env env,
                                       napi_value value,
                                       char* buf,
                                       size_t bufsize,
                                       size_t* result)
```
- `[in] env`: API가 호출된 환경입니다.
- `[in] value`: JavaScript 문자열을 나타내는 `napi_value`입니다.
- `[in] buf`: UTF8로 인코딩된 문자열을 쓸 버퍼입니다. `NULL`이 전달되면 null 종결자를 제외한 문자열의 바이트 길이가 `result`에 반환됩니다.
- `[in] bufsize`: 대상 버퍼의 크기입니다. 이 값이 부족하면 반환된 문자열이 잘리고 null로 끝납니다.
- `[out] result`: null 종결자를 제외하고 버퍼에 복사된 바이트 수입니다.

API가 성공하면 `napi_ok`를 반환합니다. `string`이 아닌 `napi_value`가 전달되면 `napi_string_expected`를 반환합니다.

이 API는 전달된 값에 해당하는 UTF8로 인코딩된 문자열을 반환합니다.

#### `napi_get_value_string_utf16` {#napi_get_value_string_utf16}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_value_string_utf16(napi_env env,
                                        napi_value value,
                                        char16_t* buf,
                                        size_t bufsize,
                                        size_t* result)
```
- `[in] env`: API가 호출된 환경입니다.
- `[in] value`: JavaScript 문자열을 나타내는 `napi_value`입니다.
- `[in] buf`: UTF16-LE로 인코딩된 문자열을 쓸 버퍼입니다. `NULL`이 전달되면 null 종결자를 제외한 문자열의 2바이트 코드 단위 길이가 반환됩니다.
- `[in] bufsize`: 대상 버퍼의 크기입니다. 이 값이 부족하면 반환된 문자열이 잘리고 null로 끝납니다.
- `[out] result`: null 종결자를 제외하고 버퍼에 복사된 2바이트 코드 단위 수입니다.

API가 성공하면 `napi_ok`를 반환합니다. `string`이 아닌 `napi_value`가 전달되면 `napi_string_expected`를 반환합니다.

이 API는 전달된 값에 해당하는 UTF16로 인코딩된 문자열을 반환합니다.


#### `napi_get_value_uint32` {#napi_get_value_uint32}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_value_uint32(napi_env env,
                                  napi_value value,
                                  uint32_t* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: JavaScript `number`를 나타내는 `napi_value`입니다.
- `[out] result`: 주어진 `napi_value`와 동등한 C 프리미티브이며 `uint32_t`입니다.

API가 성공하면 `napi_ok`를 반환합니다. 숫자가 아닌 `napi_value`가 전달되면 `napi_number_expected`를 반환합니다.

이 API는 주어진 `napi_value`와 동등한 C 프리미티브를 `uint32_t`로 반환합니다.

### 전역 인스턴스를 가져오는 함수 {#functions-to-get-global-instances}

#### `napi_get_boolean` {#napi_get_boolean}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_boolean(napi_env env, bool value, napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: 검색할 부울 값입니다.
- `[out] result`: 검색할 JavaScript `Boolean` 싱글톤을 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 주어진 부울 값을 나타내는 데 사용되는 JavaScript 싱글톤 객체를 반환하는 데 사용됩니다.

#### `napi_get_global` {#napi_get_global}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_global(napi_env env, napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[out] result`: JavaScript `global` 객체를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 `global` 객체를 반환합니다.

#### `napi_get_null` {#napi_get_null}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_null(napi_env env, napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[out] result`: JavaScript `null` 객체를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 `null` 객체를 반환합니다.

#### `napi_get_undefined` {#napi_get_undefined}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_undefined(napi_env env, napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[out] result`: JavaScript Undefined 값을 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 Undefined 객체를 반환합니다.


## JavaScript 값 및 추상적 작업 다루기 {#working-with-javascript-values-and-abstract-operations}

Node-API는 JavaScript 값에 대해 일부 추상적 작업을 수행하는 API 세트를 노출합니다. 이러한 작업 중 일부는 [ECMAScript 언어 사양](https://tc39.github.io/ecma262/)의 [섹션 7](https://tc39.github.io/ecma262/#sec-abstract-operations)에 문서화되어 있습니다.

이러한 API는 다음 중 하나를 수행하는 것을 지원합니다.

### `napi_coerce_to_bool` {#napi_coerce_to_bool}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_coerce_to_bool(napi_env env,
                                napi_value value,
                                napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: 강제 변환할 JavaScript 값입니다.
- `[out] result`: 강제 변환된 JavaScript `Boolean`을 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 ECMAScript 언어 사양의 [섹션 7.1.2](https://tc39.github.io/ecma262/#sec-toboolean)에 정의된 추상적 작업 `ToBoolean()`을 구현합니다.

### `napi_coerce_to_number` {#napi_coerce_to_number}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_coerce_to_number(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: 강제 변환할 JavaScript 값입니다.
- `[out] result`: 강제 변환된 JavaScript `number`를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 ECMAScript 언어 사양의 [섹션 7.1.3](https://tc39.github.io/ecma262/#sec-tonumber)에 정의된 추상적 작업 `ToNumber()`를 구현합니다. 이 함수는 전달된 값이 객체인 경우 잠재적으로 JS 코드를 실행합니다.

### `napi_coerce_to_object` {#napi_coerce_to_object}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_coerce_to_object(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: 강제 변환할 JavaScript 값입니다.
- `[out] result`: 강제 변환된 JavaScript `Object`를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 ECMAScript 언어 사양의 [섹션 7.1.13](https://tc39.github.io/ecma262/#sec-toobject)에 정의된 추상적 작업 `ToObject()`를 구현합니다.


### `napi_coerce_to_string` {#napi_coerce_to_string}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_coerce_to_string(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: 강제 변환할 JavaScript 값입니다.
- `[out] result`: 강제 변환된 JavaScript `string`을 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 ECMAScript 언어 사양의 [섹션 7.1.13](https://tc39.github.io/ecma262/#sec-toobject)에 정의된 추상 연산 `ToString()`을 구현합니다. 이 함수는 전달된 값이 객체인 경우 잠재적으로 JS 코드를 실행합니다.

### `napi_typeof` {#napi_typeof}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_typeof(napi_env env, napi_value value, napi_valuetype* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: 유형을 쿼리할 JavaScript 값입니다.
- `[out] result`: JavaScript 값의 유형입니다.

API가 성공하면 `napi_ok`를 반환합니다.

- `value`의 유형이 알려진 ECMAScript 유형이 아니고 `value`가 외부 값이 아니면 `napi_invalid_arg`를 반환합니다.

이 API는 ECMAScript 언어 사양의 [섹션 12.5.5](https://tc39.github.io/ecma262/#sec-typeof-operator)에 정의된 객체에 `typeof` 연산자를 호출하는 것과 유사한 동작을 나타냅니다. 그러나 몇 가지 차이점이 있습니다.

`value`에 유효하지 않은 유형이 있는 경우 오류가 반환됩니다.

### `napi_instanceof` {#napi_instanceof}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_instanceof(napi_env env,
                            napi_value object,
                            napi_value constructor,
                            bool* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] object`: 확인할 JavaScript 값입니다.
- `[in] constructor`: 확인할 생성자 함수의 JavaScript 함수 객체입니다.
- `[out] result`: `object instanceof constructor`가 참이면 참으로 설정되는 부울입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 ECMAScript 언어 사양의 [섹션 12.10.4](https://tc39.github.io/ecma262/#sec-instanceofoperator)에 정의된 객체에 `instanceof` 연산자를 호출하는 것을 나타냅니다.


### `napi_is_array` {#napi_is_array}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_is_array(napi_env env, napi_value value, bool* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: 검사할 JavaScript 값입니다.
- `[out] result`: 주어진 객체가 배열인지 여부입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 ECMAScript 언어 사양의 [섹션 7.2.2](https://tc39.github.io/ecma262/#sec-isarray)에 정의된 대로 객체에 대해 `IsArray` 작업을 호출하는 것을 나타냅니다.

### `napi_is_arraybuffer` {#napi_is_arraybuffer}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_is_arraybuffer(napi_env env, napi_value value, bool* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: 검사할 JavaScript 값입니다.
- `[out] result`: 주어진 객체가 `ArrayBuffer`인지 여부입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 전달된 `Object`가 배열 버퍼인지 확인합니다.

### `napi_is_buffer` {#napi_is_buffer}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_is_buffer(napi_env env, napi_value value, bool* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: 검사할 JavaScript 값입니다.
- `[out] result`: 주어진 `napi_value`가 `node::Buffer` 또는 `Uint8Array` 객체를 나타내는지 여부입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 전달된 `Object`가 버퍼 또는 Uint8Array인지 확인합니다. 호출자가 값이 Uint8Array인지 확인해야 하는 경우 [`napi_is_typedarray`](/ko/nodejs/api/n-api#napi_is_typedarray)를 사용하는 것이 좋습니다.

### `napi_is_date` {#napi_is_date}

**추가된 버전: v11.11.0, v10.17.0**

**N-API 버전: 5**

```C [C]
napi_status napi_is_date(napi_env env, napi_value value, bool* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: 검사할 JavaScript 값입니다.
- `[out] result`: 주어진 `napi_value`가 JavaScript `Date` 객체를 나타내는지 여부입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 전달된 `Object`가 날짜인지 확인합니다.


### `napi_is_error` {#napi_is_error_1}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_is_error(napi_env env, napi_value value, bool* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: 확인할 JavaScript 값입니다.
- `[out] result`: 주어진 `napi_value`가 `Error` 객체를 나타내는지 여부입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 전달된 `Object`가 `Error`인지 확인합니다.

### `napi_is_typedarray` {#napi_is_typedarray}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_is_typedarray(napi_env env, napi_value value, bool* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: 확인할 JavaScript 값입니다.
- `[out] result`: 주어진 `napi_value`가 `TypedArray`를 나타내는지 여부입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 전달된 `Object`가 typed array인지 확인합니다.

### `napi_is_dataview` {#napi_is_dataview}

**Added in: v8.3.0**

**N-API version: 1**

```C [C]
napi_status napi_is_dataview(napi_env env, napi_value value, bool* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: 확인할 JavaScript 값입니다.
- `[out] result`: 주어진 `napi_value`가 `DataView`를 나타내는지 여부입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 전달된 `Object`가 `DataView`인지 확인합니다.

### `napi_strict_equals` {#napi_strict_equals}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_strict_equals(napi_env env,
                               napi_value lhs,
                               napi_value rhs,
                               bool* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] lhs`: 확인할 JavaScript 값입니다.
- `[in] rhs`: 비교할 JavaScript 값입니다.
- `[out] result`: 두 `napi_value` 객체가 같은지 여부입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 ECMAScript Language Specification의 [Section 7.2.14](https://tc39.github.io/ecma262/#sec-strict-equality-comparison)에 정의된 Strict Equality 알고리즘의 호출을 나타냅니다.


### `napi_detach_arraybuffer` {#napi_detach_arraybuffer}

**추가된 버전: v13.0.0, v12.16.0, v10.22.0**

**N-API 버전: 7**

```C [C]
napi_status napi_detach_arraybuffer(napi_env env,
                                    napi_value arraybuffer)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] arraybuffer`: 분리할 JavaScript `ArrayBuffer`입니다.

API가 성공하면 `napi_ok`를 반환합니다. 분리할 수 없는 `ArrayBuffer`가 전달되면 `napi_detachable_arraybuffer_expected`를 반환합니다.

일반적으로 `ArrayBuffer`는 이전에 분리된 경우 분리할 수 없습니다. 엔진은 `ArrayBuffer`를 분리할 수 있는지 여부에 대한 추가 조건을 적용할 수 있습니다. 예를 들어 V8은 `ArrayBuffer`가 외부여야 합니다. 즉, [`napi_create_external_arraybuffer`](/ko/nodejs/api/n-api#napi_create_external_arraybuffer)로 생성되어야 합니다.

이 API는 ECMAScript 언어 사양의 [섹션 24.1.1.3](https://tc39.es/ecma262/#sec-detacharraybuffer)에 정의된 `ArrayBuffer` 분리 작업의 호출을 나타냅니다.

### `napi_is_detached_arraybuffer` {#napi_is_detached_arraybuffer}

**추가된 버전: v13.3.0, v12.16.0, v10.22.0**

**N-API 버전: 7**

```C [C]
napi_status napi_is_detached_arraybuffer(napi_env env,
                                         napi_value arraybuffer,
                                         bool* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] arraybuffer`: 확인할 JavaScript `ArrayBuffer`입니다.
- `[out] result`: `arraybuffer`가 분리되었는지 여부입니다.

API가 성공하면 `napi_ok`를 반환합니다.

`ArrayBuffer`의 내부 데이터가 `null`이면 분리된 것으로 간주됩니다.

이 API는 ECMAScript 언어 사양의 [섹션 24.1.1.2](https://tc39.es/ecma262/#sec-isdetachedbuffer)에 정의된 `ArrayBuffer` `IsDetachedBuffer` 작업의 호출을 나타냅니다.

## JavaScript 속성 작업 {#working-with-javascript-properties}

Node-API는 JavaScript 객체의 속성을 가져오고 설정하기 위한 API 세트를 제공합니다. 이러한 유형 중 일부는 [ECMAScript 언어 사양](https://tc39.github.io/ecma262/)의 [섹션 7](https://tc39.github.io/ecma262/#sec-abstract-operations)에 문서화되어 있습니다.

JavaScript의 속성은 키와 값의 튜플로 표현됩니다. 근본적으로 Node-API의 모든 속성 키는 다음 형식 중 하나로 표현할 수 있습니다.

- Named: 간단한 UTF8 인코딩 문자열
- Integer-Indexed: `uint32_t`로 표현되는 인덱스 값
- JavaScript 값: Node-API에서 `napi_value`로 표현됩니다. 이는 `string`, `number` 또는 `symbol`을 나타내는 `napi_value`일 수 있습니다.

Node-API 값은 `napi_value` 유형으로 표현됩니다. JavaScript 값이 필요한 Node-API 호출은 `napi_value`를 받습니다. 그러나 해당 `napi_value`가 API에서 예상하는 JavaScript 유형인지 확인하는 것은 호출자의 책임입니다.

이 섹션에 문서화된 API는 `napi_value`로 표현되는 임의의 JavaScript 객체의 속성을 가져오고 설정하기 위한 간단한 인터페이스를 제공합니다.

예를 들어 다음 JavaScript 코드 스니펫을 고려하십시오.

```js [ESM]
const obj = {};
obj.myProp = 123;
```
동일한 작업을 다음 스니펫으로 Node-API 값을 사용하여 수행할 수 있습니다.

```C [C]
napi_status status = napi_generic_failure;

// const obj = {}
napi_value obj, value;
status = napi_create_object(env, &obj);
if (status != napi_ok) return status;

// Create a napi_value for 123
status = napi_create_int32(env, 123, &value);
if (status != napi_ok) return status;

// obj.myProp = 123
status = napi_set_named_property(env, obj, "myProp", value);
if (status != napi_ok) return status;
```
인덱스된 속성은 비슷한 방식으로 설정할 수 있습니다. 다음 JavaScript 스니펫을 고려하십시오.

```js [ESM]
const arr = [];
arr[123] = 'hello';
```
동일한 작업을 다음 스니펫으로 Node-API 값을 사용하여 수행할 수 있습니다.

```C [C]
napi_status status = napi_generic_failure;

// const arr = [];
napi_value arr, value;
status = napi_create_array(env, &arr);
if (status != napi_ok) return status;

// Create a napi_value for 'hello'
status = napi_create_string_utf8(env, "hello", NAPI_AUTO_LENGTH, &value);
if (status != napi_ok) return status;

// arr[123] = 'hello';
status = napi_set_element(env, arr, 123, value);
if (status != napi_ok) return status;
```
이 섹션에 설명된 API를 사용하여 속성을 검색할 수 있습니다. 다음 JavaScript 스니펫을 고려하십시오.

```js [ESM]
const arr = [];
const value = arr[123];
```
다음은 Node-API 대응물의 대략적인 동일 항목입니다.

```C [C]
napi_status status = napi_generic_failure;

// const arr = []
napi_value arr, value;
status = napi_create_array(env, &arr);
if (status != napi_ok) return status;

// const value = arr[123]
status = napi_get_element(env, arr, 123, &value);
if (status != napi_ok) return status;
```
마지막으로 성능상의 이유로 객체에 여러 속성을 정의할 수도 있습니다. 다음 JavaScript를 고려하십시오.

```js [ESM]
const obj = {};
Object.defineProperties(obj, {
  'foo': { value: 123, writable: true, configurable: true, enumerable: true },
  'bar': { value: 456, writable: true, configurable: true, enumerable: true },
});
```
다음은 Node-API 대응물의 대략적인 동일 항목입니다.

```C [C]
napi_status status = napi_status_generic_failure;

// const obj = {};
napi_value obj;
status = napi_create_object(env, &obj);
if (status != napi_ok) return status;

// Create napi_values for 123 and 456
napi_value fooValue, barValue;
status = napi_create_int32(env, 123, &fooValue);
if (status != napi_ok) return status;
status = napi_create_int32(env, 456, &barValue);
if (status != napi_ok) return status;

// Set the properties
napi_property_descriptor descriptors[] = {
  { "foo", NULL, NULL, NULL, NULL, fooValue, napi_writable | napi_configurable, NULL },
  { "bar", NULL, NULL, NULL, NULL, barValue, napi_writable | napi_configurable, NULL }
}
status = napi_define_properties(env,
                                obj,
                                sizeof(descriptors) / sizeof(descriptors[0]),
                                descriptors);
if (status != napi_ok) return status;
```

### Structures {#structures}

#### `napi_property_attributes` {#napi_property_attributes}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.12.0 | `napi_default_method` 및 `napi_default_property`를 추가했습니다. |
:::

```C [C]
typedef enum {
  napi_default = 0,
  napi_writable = 1 << 0,
  napi_enumerable = 1 << 1,
  napi_configurable = 1 << 2,

  // napi_define_class와 함께 사용하여 정적 속성을
  // 인스턴스 속성과 구분합니다. napi_define_properties는 무시합니다.
  napi_static = 1 << 10,

  // 클래스 메서드의 기본값입니다.
  napi_default_method = napi_writable | napi_configurable,

  // JS obj[prop]와 같은 객체 속성의 기본값입니다.
  napi_default_jsproperty = napi_writable |
                          napi_enumerable |
                          napi_configurable,
} napi_property_attributes;
```
`napi_property_attributes`는 JavaScript 객체에 설정된 속성의 동작을 제어하는 데 사용되는 플래그입니다. `napi_static` 외에 [ECMAScript 언어 사양](https://tc39.github.io/ecma262/)의 [섹션 6.1.7.1](https://tc39.github.io/ecma262/#table-2)에 나열된 속성에 해당합니다. 다음 비트 플래그 중 하나 이상일 수 있습니다.

- `napi_default`: 속성에 명시적 속성이 설정되지 않았습니다. 기본적으로 속성은 읽기 전용이고 열거 가능하지 않으며 구성 가능하지 않습니다.
- `napi_writable`: 속성을 쓸 수 있습니다.
- `napi_enumerable`: 속성을 열거할 수 있습니다.
- `napi_configurable`: 속성은 [ECMAScript 언어 사양](https://tc39.github.io/ecma262/)의 [섹션 6.1.7.1](https://tc39.github.io/ecma262/#table-2)에 정의된 대로 구성할 수 있습니다.
- `napi_static`: 속성은 기본값인 인스턴스 속성과 달리 클래스의 정적 속성으로 정의됩니다. 이는 [`napi_define_class`](/ko/nodejs/api/n-api#napi_define_class)에서만 사용됩니다. `napi_define_properties`는 이를 무시합니다.
- `napi_default_method`: JS 클래스의 메서드와 마찬가지로 속성을 구성하고 쓸 수 있지만 열거할 수는 없습니다.
- `napi_default_jsproperty`: JavaScript에서 할당을 통해 설정된 속성과 마찬가지로 속성은 쓸 수 있고 열거할 수 있으며 구성할 수 있습니다.


#### `napi_property_descriptor` {#napi_property_descriptor}

```C [C]
typedef struct {
  // utf8name 또는 name 중 하나는 NULL이어야 합니다.
  const char* utf8name;
  napi_value name;

  napi_callback method;
  napi_callback getter;
  napi_callback setter;
  napi_value value;

  napi_property_attributes attributes;
  void* data;
} napi_property_descriptor;
```
- `utf8name`: 속성의 키를 설명하는 선택적 문자열로, UTF8로 인코딩됩니다. 속성에 대해 `utf8name` 또는 `name` 중 하나를 제공해야 합니다.
- `name`: 속성의 키로 사용할 JavaScript 문자열 또는 심볼을 가리키는 선택적 `napi_value`입니다. 속성에 대해 `utf8name` 또는 `name` 중 하나를 제공해야 합니다.
- `value`: 속성이 데이터 속성인 경우 속성에 대한 get 액세스로 검색되는 값입니다. 이 값이 전달되면 `getter`, `setter`, `method` 및 `data`를 `NULL`로 설정합니다(이러한 멤버는 사용되지 않으므로).
- `getter`: 속성에 대한 get 액세스가 수행될 때 호출할 함수입니다. 이 값이 전달되면 `value` 및 `method`를 `NULL`로 설정합니다(이러한 멤버는 사용되지 않으므로). 주어진 함수는 JavaScript 코드에서 속성에 액세스할 때 (또는 Node-API 호출을 사용하여 속성에 대한 get이 수행된 경우) 런타임에 의해 암시적으로 호출됩니다. [`napi_callback`](/ko/nodejs/api/n-api#napi_callback)에서 자세한 내용을 제공합니다.
- `setter`: 속성에 대한 set 액세스가 수행될 때 호출할 함수입니다. 이 값이 전달되면 `value` 및 `method`를 `NULL`로 설정합니다(이러한 멤버는 사용되지 않으므로). 주어진 함수는 JavaScript 코드에서 속성을 설정할 때 (또는 Node-API 호출을 사용하여 속성을 설정한 경우) 런타임에 의해 암시적으로 호출됩니다. [`napi_callback`](/ko/nodejs/api/n-api#napi_callback)에서 자세한 내용을 제공합니다.
- `method`: 속성 설명자 객체의 `value` 속성이 `method`로 표시되는 JavaScript 함수가 되도록 설정합니다. 이 값이 전달되면 `value`, `getter` 및 `setter`를 `NULL`로 설정합니다(이러한 멤버는 사용되지 않으므로). [`napi_callback`](/ko/nodejs/api/n-api#napi_callback)에서 자세한 내용을 제공합니다.
- `attributes`: 특정 속성과 관련된 속성입니다. [`napi_property_attributes`](/ko/nodejs/api/n-api#napi_property_attributes)를 참조하세요.
- `data`: 이 함수가 호출되면 `method`, `getter` 및 `setter`에 전달되는 콜백 데이터입니다.


### 함수 {#functions}

#### `napi_get_property_names` {#napi_get_property_names}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_get_property_names(napi_env env,
                                    napi_value object,
                                    napi_value* result);
```
- `[in] env`: Node-API 호출이 호출되는 환경입니다.
- `[in] object`: 속성을 검색할 객체입니다.
- `[out] result`: 객체의 속성 이름을 나타내는 JavaScript 값의 배열을 나타내는 `napi_value`입니다. API는 [`napi_get_array_length`](/ko/nodejs/api/n-api#napi_get_array_length) 및 [`napi_get_element`](/ko/nodejs/api/n-api#napi_get_element)를 사용하여 `result`를 반복하는 데 사용할 수 있습니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 `object`의 열거 가능한 속성 이름을 문자열 배열로 반환합니다. 키가 기호인 `object`의 속성은 포함되지 않습니다.

#### `napi_get_all_property_names` {#napi_get_all_property_names}

**추가된 버전: v13.7.0, v12.17.0, v10.20.0**

**N-API 버전: 6**

```C [C]
napi_get_all_property_names(napi_env env,
                            napi_value object,
                            napi_key_collection_mode key_mode,
                            napi_key_filter key_filter,
                            napi_key_conversion key_conversion,
                            napi_value* result);
```
- `[in] env`: Node-API 호출이 호출되는 환경입니다.
- `[in] object`: 속성을 검색할 객체입니다.
- `[in] key_mode`: 프로토타입 속성도 검색할지 여부입니다.
- `[in] key_filter`: 검색할 속성 (열거 가능/읽기 가능/쓰기 가능)입니다.
- `[in] key_conversion`: 번호가 매겨진 속성 키를 문자열로 변환할지 여부입니다.
- `[out] result`: 객체의 속성 이름을 나타내는 JavaScript 값의 배열을 나타내는 `napi_value`입니다. [`napi_get_array_length`](/ko/nodejs/api/n-api#napi_get_array_length) 및 [`napi_get_element`](/ko/nodejs/api/n-api#napi_get_element)를 사용하여 `result`를 반복할 수 있습니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 이 객체의 사용 가능한 속성 이름을 포함하는 배열을 반환합니다.


#### `napi_set_property` {#napi_set_property}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_set_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              napi_value value);
```
- `[in] env`: Node-API 호출이 호출되는 환경입니다.
- `[in] object`: 속성을 설정할 객체입니다.
- `[in] key`: 설정할 속성의 이름입니다.
- `[in] value`: 속성 값입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 전달된 `Object`에 속성을 설정합니다.

#### `napi_get_property` {#napi_get_property}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_get_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              napi_value* result);
```
- `[in] env`: Node-API 호출이 호출되는 환경입니다.
- `[in] object`: 속성을 검색할 객체입니다.
- `[in] key`: 검색할 속성의 이름입니다.
- `[out] result`: 속성 값입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 전달된 `Object`에서 요청된 속성을 가져옵니다.

#### `napi_has_property` {#napi_has_property}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_has_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              bool* result);
```
- `[in] env`: Node-API 호출이 호출되는 환경입니다.
- `[in] object`: 쿼리할 객체입니다.
- `[in] key`: 존재 여부를 확인할 속성의 이름입니다.
- `[out] result`: 객체에 속성이 있는지 여부입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 전달된 `Object`에 명명된 속성이 있는지 확인합니다.

#### `napi_delete_property` {#napi_delete_property}

**추가된 버전: v8.2.0**

**N-API 버전: 1**

```C [C]
napi_status napi_delete_property(napi_env env,
                                 napi_value object,
                                 napi_value key,
                                 bool* result);
```
- `[in] env`: Node-API 호출이 호출되는 환경입니다.
- `[in] object`: 쿼리할 객체입니다.
- `[in] key`: 삭제할 속성의 이름입니다.
- `[out] result`: 속성 삭제가 성공했는지 여부입니다. `result`는 `NULL`을 전달하여 선택적으로 무시할 수 있습니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 `object`에서 `key` 자체 속성을 삭제하려고 시도합니다.


#### `napi_has_own_property` {#napi_has_own_property}

**Added in: v8.2.0**

**N-API version: 1**

```C [C]
napi_status napi_has_own_property(napi_env env,
                                  napi_value object,
                                  napi_value key,
                                  bool* result);
```
- `[in] env`: Node-API 호출이 호출되는 환경입니다.
- `[in] object`: 쿼리할 객체입니다.
- `[in] key`: 확인하려는 자체 속성의 이름입니다.
- `[out] result`: 자체 속성이 객체에 있는지 여부입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 전달된 `Object`에 명명된 자체 속성이 있는지 확인합니다. `key`는 `string` 또는 `symbol`이어야 하며, 그렇지 않으면 오류가 발생합니다. Node-API는 데이터 유형 간의 변환을 수행하지 않습니다.

#### `napi_set_named_property` {#napi_set_named_property}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_set_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    napi_value value);
```
- `[in] env`: Node-API 호출이 호출되는 환경입니다.
- `[in] object`: 속성을 설정할 객체입니다.
- `[in] utf8Name`: 설정할 속성의 이름입니다.
- `[in] value`: 속성 값입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 메서드는 `utf8Name`으로 전달된 문자열에서 생성된 `napi_value`로 [`napi_set_property`](/ko/nodejs/api/n-api#napi_set_property)를 호출하는 것과 같습니다.

#### `napi_get_named_property` {#napi_get_named_property}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    napi_value* result);
```
- `[in] env`: Node-API 호출이 호출되는 환경입니다.
- `[in] object`: 속성을 검색할 객체입니다.
- `[in] utf8Name`: 가져올 속성의 이름입니다.
- `[out] result`: 속성 값입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 메서드는 `utf8Name`으로 전달된 문자열에서 생성된 `napi_value`로 [`napi_get_property`](/ko/nodejs/api/n-api#napi_get_property)를 호출하는 것과 같습니다.


#### `napi_has_named_property` {#napi_has_named_property}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_has_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    bool* result);
```
- `[in] env`: Node-API 호출이 호출되는 환경입니다.
- `[in] object`: 쿼리할 객체입니다.
- `[in] utf8Name`: 확인할 속성의 이름입니다.
- `[out] result`: 객체에 속성이 있는지 여부입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 메서드는 `utf8Name`으로 전달된 문자열에서 생성된 `napi_value`로 [`napi_has_property`](/ko/nodejs/api/n-api#napi_has_property)를 호출하는 것과 같습니다.

#### `napi_set_element` {#napi_set_element}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_set_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value value);
```
- `[in] env`: Node-API 호출이 호출되는 환경입니다.
- `[in] object`: 속성을 설정할 객체입니다.
- `[in] index`: 설정할 속성의 인덱스입니다.
- `[in] value`: 속성 값입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 전달된 `Object`에 요소를 설정합니다.

#### `napi_get_element` {#napi_get_element}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_get_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value* result);
```
- `[in] env`: Node-API 호출이 호출되는 환경입니다.
- `[in] object`: 속성을 검색할 객체입니다.
- `[in] index`: 가져올 속성의 인덱스입니다.
- `[out] result`: 속성 값입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 요청된 인덱스에서 요소를 가져옵니다.

#### `napi_has_element` {#napi_has_element}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_has_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             bool* result);
```
- `[in] env`: Node-API 호출이 호출되는 환경입니다.
- `[in] object`: 쿼리할 객체입니다.
- `[in] index`: 확인할 속성의 인덱스입니다.
- `[out] result`: 객체에 속성이 있는지 여부입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 전달된 `Object`에 요청된 인덱스에 요소가 있는지 여부를 반환합니다.


#### `napi_delete_element` {#napi_delete_element}

**추가된 버전: v8.2.0**

**N-API 버전: 1**

```C [C]
napi_status napi_delete_element(napi_env env,
                                napi_value object,
                                uint32_t index,
                                bool* result);
```
- `[in] env`: Node-API 호출이 호출되는 환경입니다.
- `[in] object`: 쿼리할 객체입니다.
- `[in] index`: 삭제할 속성의 인덱스입니다.
- `[out] result`: 요소 삭제 성공 여부입니다. `result`는 `NULL`을 전달하여 선택적으로 무시할 수 있습니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 지정된 `index`를 `object`에서 삭제하려고 시도합니다.

#### `napi_define_properties` {#napi_define_properties}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_define_properties(napi_env env,
                                   napi_value object,
                                   size_t property_count,
                                   const napi_property_descriptor* properties);
```
- `[in] env`: Node-API 호출이 호출되는 환경입니다.
- `[in] object`: 속성을 검색할 객체입니다.
- `[in] property_count`: `properties` 배열의 요소 수입니다.
- `[in] properties`: 속성 설명자 배열입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 메서드를 사용하면 주어진 객체에 여러 속성을 효율적으로 정의할 수 있습니다. 속성은 속성 설명자를 사용하여 정의됩니다([`napi_property_descriptor`](/ko/nodejs/api/n-api#napi_property_descriptor) 참조). 이러한 속성 설명자 배열이 주어지면 이 API는 `DefineOwnProperty()`에 정의된 대로 객체에 속성을 한 번에 하나씩 설정합니다(ECMA-262 사양의 [섹션 9.1.6](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots-defineownproperty-p-desc)에 설명되어 있음).

#### `napi_object_freeze` {#napi_object_freeze}

**추가된 버전: v14.14.0, v12.20.0**

**N-API 버전: 8**

```C [C]
napi_status napi_object_freeze(napi_env env,
                               napi_value object);
```
- `[in] env`: Node-API 호출이 호출되는 환경입니다.
- `[in] object`: 고정할 객체입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 메서드는 주어진 객체를 고정합니다. 이렇게 하면 새 속성이 추가되는 것을 방지하고, 기존 속성이 제거되는 것을 방지하고, 기존 속성의 열거 가능성, 구성 가능성 또는 쓰기 가능성이 변경되는 것을 방지하고, 기존 속성의 값이 변경되는 것을 방지합니다. 또한 객체의 프로토타입이 변경되는 것을 방지합니다. 이는 ECMA-262 사양의 [섹션 19.1.2.6](https://tc39.es/ecma262/#sec-object.freeze)에 설명되어 있습니다.


#### `napi_object_seal` {#napi_object_seal}

**추가된 버전: v14.14.0, v12.20.0**

**N-API 버전: 8**

```C [C]
napi_status napi_object_seal(napi_env env,
                             napi_value object);
```
- `[in] env`: Node-API 호출이 호출되는 환경입니다.
- `[in] object`: 봉인할 객체입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 메서드는 지정된 객체를 봉인합니다. 이렇게 하면 새 속성이 추가되는 것을 방지하고 기존 속성을 모두 구성 불가능으로 표시합니다. 이는 ECMA-262 사양의 [섹션 19.1.2.20](https://tc39.es/ecma262/#sec-object.seal)에 설명되어 있습니다.

## JavaScript 함수 작업 {#working-with-javascript-functions}

Node-API는 JavaScript 코드가 네이티브 코드로 다시 호출할 수 있도록 하는 API 세트를 제공합니다. 네이티브 코드로의 콜백을 지원하는 Node-API는 `napi_callback` 유형으로 표시되는 콜백 함수를 사용합니다. JavaScript VM이 네이티브 코드로 다시 호출하면 제공된 `napi_callback` 함수가 호출됩니다. 이 섹션에 설명된 API를 통해 콜백 함수는 다음을 수행할 수 있습니다.

- 콜백이 호출된 컨텍스트에 대한 정보를 가져옵니다.
- 콜백으로 전달된 인수를 가져옵니다.
- 콜백에서 `napi_value`를 다시 반환합니다.

또한 Node-API는 네이티브 코드에서 JavaScript 함수를 호출할 수 있도록 하는 함수 세트를 제공합니다. 함수를 일반 JavaScript 함수 호출처럼 호출하거나 생성자 함수로 호출할 수 있습니다.

`napi_property_descriptor` 항목의 `data` 필드를 통해 이 API에 전달되는 `NULL`이 아닌 데이터는 `object`와 연결될 수 있으며 `object`와 데이터를 모두 [`napi_add_finalizer`](/ko/nodejs/api/n-api#napi_add_finalizer)에 전달하여 `object`가 가비지 수집될 때마다 해제될 수 있습니다.

### `napi_call_function` {#napi_call_function}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
NAPI_EXTERN napi_status napi_call_function(napi_env env,
                                           napi_value recv,
                                           napi_value func,
                                           size_t argc,
                                           const napi_value* argv,
                                           napi_value* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] recv`: 호출된 함수에 전달된 `this` 값입니다.
- `[in] func`: 호출될 JavaScript 함수를 나타내는 `napi_value`입니다.
- `[in] argc`: `argv` 배열의 요소 수입니다.
- `[in] argv`: 함수에 대한 인수로 전달되는 JavaScript 값을 나타내는 `napi_values` 배열입니다.
- `[out] result`: 반환된 JavaScript 객체를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 메서드를 사용하면 네이티브 애드온에서 JavaScript 함수 객체를 호출할 수 있습니다. 이것은 애드온의 네이티브 코드 *에서* JavaScript *로* 다시 호출하는 주요 메커니즘입니다. 비동기 작업 후에 JavaScript로 호출하는 특별한 경우에는 [`napi_make_callback`](/ko/nodejs/api/n-api#napi_make_callback)을 참조하십시오.

샘플 사용 사례는 다음과 같습니다. 다음 JavaScript 스니펫을 고려하십시오.

```js [ESM]
function AddTwo(num) {
  return num + 2;
}
global.AddTwo = AddTwo;
```
그런 다음 위의 함수는 다음 코드를 사용하여 네이티브 애드온에서 호출할 수 있습니다.

```C [C]
// 전역 객체에서 "AddTwo"라는 함수를 가져옵니다.
napi_value global, add_two, arg;
napi_status status = napi_get_global(env, &global);
if (status != napi_ok) return;

status = napi_get_named_property(env, global, "AddTwo", &add_two);
if (status != napi_ok) return;

// const arg = 1337
status = napi_create_int32(env, 1337, &arg);
if (status != napi_ok) return;

napi_value* argv = &arg;
size_t argc = 1;

// AddTwo(arg);
napi_value return_val;
status = napi_call_function(env, global, add_two, argc, argv, &return_val);
if (status != napi_ok) return;

// 결과를 네이티브 유형으로 다시 변환합니다.
int32_t result;
status = napi_get_value_int32(env, return_val, &result);
if (status != napi_ok) return;
```

### `napi_create_function` {#napi_create_function}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_create_function(napi_env env,
                                 const char* utf8name,
                                 size_t length,
                                 napi_callback cb,
                                 void* data,
                                 napi_value* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] utf8Name`: UTF8로 인코딩된 함수의 선택적 이름입니다. 이는 JavaScript 내에서 새 함수 객체의 `name` 속성으로 표시됩니다.
- `[in] length`: `utf8name`의 길이(바이트)이거나 null로 종료된 경우 `NAPI_AUTO_LENGTH`입니다.
- `[in] cb`: 이 함수 객체가 호출될 때 호출되어야 하는 네이티브 함수입니다. [`napi_callback`](/ko/nodejs/api/n-api#napi_callback)에서 자세한 내용을 제공합니다.
- `[in] data`: 사용자 제공 데이터 컨텍스트입니다. 이는 나중에 호출될 때 함수로 다시 전달됩니다.
- `[out] result`: 새로 생성된 함수에 대한 JavaScript 함수 객체를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API를 통해 애드온 작성자는 네이티브 코드에서 함수 객체를 생성할 수 있습니다. 이것은 JavaScript *에서* 애드온의 네이티브 코드로 *호출*할 수 있도록 하는 주요 메커니즘입니다.

새로 생성된 함수는 이 호출 후 스크립트에서 자동으로 표시되지 않습니다. 대신 함수가 스크립트에서 액세스할 수 있도록 JavaScript에 표시되는 모든 객체에 속성을 명시적으로 설정해야 합니다.

함수를 애드온 모듈 내보내기의 일부로 노출하려면 내보내기 객체에 새로 생성된 함수를 설정하십시오. 샘플 모듈은 다음과 같을 수 있습니다.

```C [C]
napi_value SayHello(napi_env env, napi_callback_info info) {
  printf("Hello\n");
  return NULL;
}

napi_value Init(napi_env env, napi_value exports) {
  napi_status status;

  napi_value fn;
  status = napi_create_function(env, NULL, 0, SayHello, NULL, &fn);
  if (status != napi_ok) return NULL;

  status = napi_set_named_property(env, exports, "sayHello", fn);
  if (status != napi_ok) return NULL;

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
```
위의 코드가 주어지면 JavaScript에서 다음과 같이 애드온을 사용할 수 있습니다.

```js [ESM]
const myaddon = require('./addon');
myaddon.sayHello();
```
`require()`에 전달된 문자열은 `.node` 파일 생성을 담당하는 `binding.gyp`의 대상 이름입니다.

`data` 매개변수를 통해 이 API에 전달된 `NULL`이 아닌 데이터는 결과 JavaScript 함수(결과 매개변수에 반환됨)와 연결될 수 있으며 JavaScript 함수와 데이터를 모두 [`napi_add_finalizer`](/ko/nodejs/api/n-api#napi_add_finalizer)에 전달하여 함수가 가비지 수집될 때마다 해제될 수 있습니다.

JavaScript `Function`은 ECMAScript 언어 사양의 [섹션 19.2](https://tc39.github.io/ecma262/#sec-function-objects)에 설명되어 있습니다.


### `napi_get_cb_info` {#napi_get_cb_info}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_cb_info(napi_env env,
                             napi_callback_info cbinfo,
                             size_t* argc,
                             napi_value* argv,
                             napi_value* thisArg,
                             void** data)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] cbinfo`: 콜백 함수에 전달되는 콜백 정보입니다.
- `[in-out] argc`: 제공된 `argv` 배열의 길이를 지정하고 실제 인수 개수를 받습니다. `argc`는 선택적으로 `NULL`을 전달하여 무시할 수 있습니다.
- `[out] argv`: 인수가 복사될 `napi_value`의 C 배열입니다. 제공된 개수보다 많은 인수가 있는 경우 요청된 인수 수만 복사됩니다. 제공된 인수 수가 주장된 것보다 적으면 나머지 `argv`는 `undefined`를 나타내는 `napi_value` 값으로 채워집니다. `argv`는 선택적으로 `NULL`을 전달하여 무시할 수 있습니다.
- `[out] thisArg`: 호출에 대한 JavaScript `this` 인수를 받습니다. `thisArg`는 선택적으로 `NULL`을 전달하여 무시할 수 있습니다.
- `[out] data`: 콜백에 대한 데이터 포인터를 받습니다. `data`는 선택적으로 `NULL`을 전달하여 무시할 수 있습니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 메서드는 콜백 함수 내에서 주어진 콜백 정보에서 인수 및 `this` 포인터와 같은 호출에 대한 세부 정보를 검색하는 데 사용됩니다.

### `napi_get_new_target` {#napi_get_new_target}

**Added in: v8.6.0**

**N-API version: 1**

```C [C]
napi_status napi_get_new_target(napi_env env,
                                napi_callback_info cbinfo,
                                napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] cbinfo`: 콜백 함수에 전달되는 콜백 정보입니다.
- `[out] result`: 생성자 호출의 `new.target`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 생성자 호출의 `new.target`을 반환합니다. 현재 콜백이 생성자 호출이 아니면 결과는 `NULL`입니다.


### `napi_new_instance` {#napi_new_instance}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_new_instance(napi_env env,
                              napi_value cons,
                              size_t argc,
                              napi_value* argv,
                              napi_value* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] cons`: 생성자로 호출될 JavaScript 함수를 나타내는 `napi_value`입니다.
- `[in] argc`: `argv` 배열의 요소 수입니다.
- `[in] argv`: 생성자에 대한 인수를 나타내는 `napi_value` 형태의 JavaScript 값 배열입니다. `argc`가 0이면 `NULL`을 전달하여 이 매개변수를 생략할 수 있습니다.
- `[out] result`: 반환된 JavaScript 객체를 나타내는 `napi_value`입니다. 이 경우 생성된 객체입니다.

이 메서드는 객체의 생성자를 나타내는 주어진 `napi_value`를 사용하여 새로운 JavaScript 값을 인스턴스화하는 데 사용됩니다. 예를 들어 다음 스니펫을 고려해 보겠습니다.

```js [ESM]
function MyObject(param) {
  this.param = param;
}

const arg = 'hello';
const value = new MyObject(arg);
```
다음은 다음 스니펫을 사용하여 Node-API에서 근사적으로 나타낼 수 있습니다.

```C [C]
// 생성자 함수 MyObject 가져오기
napi_value global, constructor, arg, value;
napi_status status = napi_get_global(env, &global);
if (status != napi_ok) return;

status = napi_get_named_property(env, global, "MyObject", &constructor);
if (status != napi_ok) return;

// const arg = "hello"
status = napi_create_string_utf8(env, "hello", NAPI_AUTO_LENGTH, &arg);
if (status != napi_ok) return;

napi_value* argv = &arg;
size_t argc = 1;

// const value = new MyObject(arg)
status = napi_new_instance(env, constructor, argc, argv, &value);
```
API가 성공하면 `napi_ok`를 반환합니다.

## 객체 래핑 {#object-wrap}

Node-API는 C++ 클래스 및 인스턴스를 "래핑"하여 클래스 생성자 및 메서드를 JavaScript에서 호출할 수 있는 방법을 제공합니다.

래핑된 객체의 경우 클래스 프로토타입에서 호출된 함수와 클래스 인스턴스에서 호출된 함수를 구별하기 어려울 수 있습니다. 이 문제를 해결하는 데 사용되는 일반적인 패턴은 나중에 `instanceof` 검사를 위해 클래스 생성자에 대한 영구 참조를 저장하는 것입니다.

```C [C]
napi_value MyClass_constructor = NULL;
status = napi_get_reference_value(env, MyClass::es_constructor, &MyClass_constructor);
assert(napi_ok == status);
bool is_instance = false;
status = napi_instanceof(env, es_this, MyClass_constructor, &is_instance);
assert(napi_ok == status);
if (is_instance) {
  // napi_unwrap() ...
} else {
  // otherwise...
}
```
더 이상 필요하지 않으면 참조를 해제해야 합니다.

JavaScript 객체가 특정 네이티브 유형에 대한 래퍼인지 확인하기 위해 `napi_instanceof()`가 충분하지 않은 경우가 있습니다. 이는 특히 래핑된 JavaScript 객체가 프로토타입 메서드의 `this` 값으로 전달되는 대신 정적 메서드를 통해 애드온으로 다시 전달되는 경우에 해당합니다. 이러한 경우 잘못 언래핑될 가능성이 있습니다.

```js [ESM]
const myAddon = require('./build/Release/my_addon.node');

// `openDatabase()`는 네이티브 데이터베이스 핸들을 래핑하는 JavaScript 객체를 반환합니다.
const dbHandle = myAddon.openDatabase();

// `query()`는 네이티브 쿼리 핸들을 래핑하는 JavaScript 객체를 반환합니다.
const queryHandle = myAddon.query(dbHandle, 'Gimme ALL the things!');

// 아래 줄에 실수로 오류가 있습니다. `myAddon.queryHasRecords()`에 대한 첫 번째 매개변수는
// 쿼리 핸들(`query`)이 아닌 데이터베이스 핸들(`dbHandle`)이어야 하므로 while 루프에 대한 올바른 조건은 다음과 같아야 합니다.
//
// myAddon.queryHasRecords(dbHandle, queryHandle)
//
while (myAddon.queryHasRecords(queryHandle, dbHandle)) {
  // 레코드 검색
}
```
위의 예에서 `myAddon.queryHasRecords()`는 두 개의 인수를 허용하는 메서드입니다. 첫 번째는 데이터베이스 핸들이고 두 번째는 쿼리 핸들입니다. 내부적으로 첫 번째 인수를 언래핑하고 결과 포인터를 네이티브 데이터베이스 핸들로 캐스팅합니다. 그런 다음 두 번째 인수를 언래핑하고 결과 포인터를 쿼리 핸들로 캐스팅합니다. 인수가 잘못된 순서로 전달되면 캐스트는 작동하지만 기본 데이터베이스 작업이 실패하거나 잘못된 메모리 액세스를 유발할 가능성이 높습니다.

첫 번째 인수에서 검색된 포인터가 실제로 데이터베이스 핸들에 대한 포인터인지 확인하고, 유사하게 두 번째 인수에서 검색된 포인터가 실제로 쿼리 핸들에 대한 포인터인지 확인하려면 `queryHasRecords()`의 구현에서 유형 유효성 검사를 수행해야 합니다. 데이터베이스 핸들이 인스턴스화된 JavaScript 클래스 생성자와 `napi_ref`에서 쿼리 핸들이 인스턴스화된 생성자를 유지하면 `napi_instanceof()`를 사용하여 `queryHashRecords()`에 전달된 인스턴스가 실제로 올바른 유형인지 확인할 수 있습니다.

안타깝게도 `napi_instanceof()`는 프로토타입 조작으로부터 보호하지 않습니다. 예를 들어 데이터베이스 핸들 인스턴스의 프로토타입을 쿼리 핸들 인스턴스에 대한 생성자의 프로토타입으로 설정할 수 있습니다. 이 경우 데이터베이스 핸들 인스턴스가 쿼리 핸들 인스턴스로 나타날 수 있으며 쿼리 핸들 인스턴스에 대한 `napi_instanceof()` 테스트를 통과하는 동시에 데이터베이스 핸들에 대한 포인터를 계속 포함합니다.

이를 위해 Node-API는 유형 태깅 기능을 제공합니다.

유형 태그는 애드온에 고유한 128비트 정수입니다. Node-API는 유형 태그를 저장하기 위한 `napi_type_tag` 구조체를 제공합니다. 이러한 값이 JavaScript 객체 또는 `napi_value`에 저장된 [외부](/ko/nodejs/api/n-api#napi_create_external)와 함께 `napi_type_tag_object()`에 전달되면 JavaScript 객체는 유형 태그로 "표시"됩니다. "표시"는 JavaScript 쪽에서 보이지 않습니다. JavaScript 객체가 네이티브 바인딩에 도착하면 `napi_check_object_type_tag()`를 원래 유형 태그와 함께 사용하여 JavaScript 객체가 이전에 유형 태그로 "표시"되었는지 여부를 확인할 수 있습니다. 이렇게 하면 프로토타입 조작 및 애드온 언로드/재로드를 통해 이러한 유형 태깅이 유지되기 때문에 `napi_instanceof()`가 제공할 수 있는 것보다 높은 정확도의 유형 검사 기능이 생성됩니다.

위의 예제를 계속하면 다음 스켈레톤 애드온 구현은 `napi_type_tag_object()` 및 `napi_check_object_type_tag()`의 사용을 보여줍니다.

```C [C]
// 이 값은 데이터베이스 핸들에 대한 유형 태그입니다. 명령어
//
//   uuidgen | sed -r -e 's/-//g' -e 's/(.{16})(.*)/0x\1, 0x\2/'
//
// 구조체를 초기화할 두 개의 값을 얻는 데 사용할 수 있습니다.
static const napi_type_tag DatabaseHandleTypeTag = {
  0x1edf75a38336451d, 0xa5ed9ce2e4c00c38
};

// 이 값은 쿼리 핸들에 대한 유형 태그입니다.
static const napi_type_tag QueryHandleTypeTag = {
  0x9c73317f9fad44a3, 0x93c3920bf3b0ad6a
};

static napi_value
openDatabase(napi_env env, napi_callback_info info) {
  napi_status status;
  napi_value result;

  // 데이터베이스 핸들을 생성하는 기본 작업을 수행합니다.
  DatabaseHandle* dbHandle = open_database();

  // 새로운 빈 JS 객체를 만듭니다.
  status = napi_create_object(env, &result);
  if (status != napi_ok) return NULL;

  // 객체가 `DatabaseHandle`에 대한 포인터를 보유하고 있음을 나타내기 위해 객체에 태그를 지정합니다.
  status = napi_type_tag_object(env, result, &DatabaseHandleTypeTag);
  if (status != napi_ok) return NULL;

  // JS 객체 내부에 `DatabaseHandle` 구조체에 대한 포인터를 저장합니다.
  status = napi_wrap(env, result, dbHandle, NULL, NULL, NULL);
  if (status != napi_ok) return NULL;

  return result;
}

// 나중에 데이터베이스 핸들이라고 주장하는 JavaScript 객체를 받으면
// `napi_check_object_type_tag()`를 사용하여 실제로 그러한 핸들인지 확인할 수 있습니다.

static napi_value
query(napi_env env, napi_callback_info info) {
  napi_status status;
  size_t argc = 2;
  napi_value argv[2];
  bool is_db_handle;

  status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
  if (status != napi_ok) return NULL;

  // 첫 번째 매개변수로 전달된 객체에 이전에 적용된 태그가 있는지 확인합니다.
  status = napi_check_object_type_tag(env,
                                      argv[0],
                                      &DatabaseHandleTypeTag,
                                      &is_db_handle);
  if (status != napi_ok) return NULL;

  // 그렇지 않은 경우 `TypeError`를 throw합니다.
  if (!is_db_handle) {
    // TypeError를 throw합니다.
    return NULL;
  }
}
```

### `napi_define_class` {#napi_define_class}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_define_class(napi_env env,
                              const char* utf8name,
                              size_t length,
                              napi_callback constructor,
                              void* data,
                              size_t property_count,
                              const napi_property_descriptor* properties,
                              napi_value* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] utf8name`: JavaScript 생성자 함수의 이름입니다. 명확성을 위해 C++ 클래스를 래핑할 때 C++ 클래스 이름을 사용하는 것이 좋습니다.
- `[in] length`: `utf8name`의 바이트 단위 길이입니다. null로 종료되는 경우 `NAPI_AUTO_LENGTH`입니다.
- `[in] constructor`: 클래스의 인스턴스를 생성하는 콜백 함수입니다. C++ 클래스를 래핑할 때 이 메서드는 [`napi_callback`](/ko/nodejs/api/n-api#napi_callback) 서명이 있는 정적 멤버여야 합니다. C++ 클래스 생성자는 사용할 수 없습니다. [`napi_callback`](/ko/nodejs/api/n-api#napi_callback)에서 자세한 내용을 제공합니다.
- `[in] data`: 콜백 정보의 `data` 속성으로 생성자 콜백에 전달될 선택적 데이터입니다.
- `[in] property_count`: `properties` 배열 인수의 항목 수입니다.
- `[in] properties`: 클래스의 정적 및 인스턴스 데이터 속성, 접근자 및 메서드를 설명하는 속성 설명자 배열입니다. `napi_property_descriptor`를 참조하세요.
- `[out] result`: 클래스의 생성자 함수를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

다음 내용을 포함하는 JavaScript 클래스를 정의합니다.

- 클래스 이름을 가진 JavaScript 생성자 함수입니다. 해당 C++ 클래스를 래핑할 때 `constructor`를 통해 전달된 콜백을 사용하여 새 C++ 클래스 인스턴스를 인스턴스화할 수 있습니다. 그런 다음 [`napi_wrap`](/ko/nodejs/api/n-api#napi_wrap)을 사용하여 생성 중인 JavaScript 객체 인스턴스 내부에 배치할 수 있습니다.
- 구현이 해당 C++ 클래스의 *정적* 데이터 속성, 접근자 및 메서드( `napi_static` 속성이 있는 속성 설명자로 정의됨)를 호출할 수 있는 생성자 함수의 속성입니다.
- 생성자 함수의 `prototype` 객체의 속성입니다. C++ 클래스를 래핑할 때 [`napi_unwrap`](/ko/nodejs/api/n-api#napi_unwrap)을 사용하여 JavaScript 객체 인스턴스 내부에 배치된 C++ 클래스 인스턴스를 검색한 후 `napi_static` 속성이 없는 속성 설명자에 제공된 정적 함수에서 C++ 클래스의 *비정적* 데이터 속성, 접근자 및 메서드를 호출할 수 있습니다.

C++ 클래스를 래핑할 때 `constructor`를 통해 전달된 C++ 생성자 콜백은 실제 클래스 생성자를 호출하는 클래스의 정적 메서드여야 합니다. 그런 다음 새 C++ 인스턴스를 JavaScript 객체로 래핑하고 래퍼 객체를 반환합니다. 자세한 내용은 [`napi_wrap`](/ko/nodejs/api/n-api#napi_wrap)을 참조하세요.

[`napi_define_class`](/ko/nodejs/api/n-api#napi_define_class)에서 반환된 JavaScript 생성자 함수는 네이티브 코드에서 클래스의 새 인스턴스를 생성하거나 제공된 값이 클래스의 인스턴스인지 확인하는 데 나중에 저장되고 사용되는 경우가 많습니다. 이 경우 함수 값이 가비지 수집되지 않도록 하려면 [`napi_create_reference`](/ko/nodejs/api/n-api#napi_create_reference)를 사용하여 강력한 영구 참조를 만들어 참조 횟수가 \>= 1로 유지되도록 할 수 있습니다.

`data` 매개변수 또는 `napi_property_descriptor` 배열 항목의 `data` 필드를 통해 이 API에 전달되는 `NULL`이 아닌 모든 데이터는 결과 JavaScript 생성자( `result` 매개변수로 반환됨)와 연결될 수 있으며 JavaScript 함수와 데이터를 모두 [`napi_add_finalizer`](/ko/nodejs/api/n-api#napi_add_finalizer)에 전달하여 클래스가 가비지 수집될 때마다 해제될 수 있습니다.


### `napi_wrap` {#napi_wrap}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_wrap(napi_env env,
                      napi_value js_object,
                      void* native_object,
                      napi_finalize finalize_cb,
                      void* finalize_hint,
                      napi_ref* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] js_object`: 네이티브 객체의 래퍼가 될 JavaScript 객체입니다.
- `[in] native_object`: JavaScript 객체에 래핑될 네이티브 인스턴스입니다.
- `[in] finalize_cb`: JavaScript 객체가 가비지 수집되었을 때 네이티브 인스턴스를 해제하는 데 사용할 수 있는 선택적 네이티브 콜백입니다. [`napi_finalize`](/ko/nodejs/api/n-api#napi_finalize)에서 자세한 내용을 제공합니다.
- `[in] finalize_hint`: finalize 콜백에 전달되는 선택적 컨텍스트 힌트입니다.
- `[out] result`: 래핑된 객체에 대한 선택적 참조입니다.

API가 성공하면 `napi_ok`를 반환합니다.

JavaScript 객체에 네이티브 인스턴스를 래핑합니다. 네이티브 인스턴스는 나중에 `napi_unwrap()`을 사용하여 검색할 수 있습니다.

JavaScript 코드가 `napi_define_class()`를 사용하여 정의된 클래스에 대한 생성자를 호출하면 생성자에 대한 `napi_callback`이 호출됩니다. 네이티브 클래스의 인스턴스를 생성한 후 콜백은 `napi_wrap()`을 호출하여 새로 생성된 인스턴스를 생성자 콜백에 대한 `this` 인수인 이미 생성된 JavaScript 객체에 래핑해야 합니다. (`this` 객체는 생성자 함수의 `prototype`에서 생성되었으므로 이미 모든 인스턴스 속성 및 메서드의 정의가 있습니다.)

일반적으로 클래스 인스턴스를 래핑할 때 finalize 콜백은 finalize 콜백에 대한 `data` 인수로 수신되는 네이티브 인스턴스를 단순히 삭제하는 기능을 제공해야 합니다.

선택적으로 반환되는 참조는 처음에 약한 참조입니다. 즉, 참조 횟수가 0입니다. 일반적으로 이 참조 횟수는 인스턴스가 유효하게 유지되어야 하는 비동기 작업 중에 일시적으로 증가됩니다.

*주의*: 선택적으로 반환되는 참조(획득한 경우)는 finalize 콜백 호출에 대한 응답으로만 [`napi_delete_reference`](/ko/nodejs/api/n-api#napi_delete_reference)를 통해 삭제해야 합니다. 그 전에 삭제되면 finalize 콜백이 호출되지 않을 수 있습니다. 따라서 참조를 얻을 때 참조의 올바른 폐기를 활성화하려면 finalize 콜백도 필요합니다.

종료자 콜백은 지연될 수 있으며, 객체가 가비지 수집된 (그리고 약한 참조가 유효하지 않은) 창이 있지만 종료자가 아직 호출되지 않은 상태로 남습니다. `napi_wrap()`에서 반환된 약한 참조에 대해 `napi_get_reference_value()`를 사용하는 경우에도 빈 결과를 처리해야 합니다.

객체에서 `napi_wrap()`을 두 번 호출하면 오류가 반환됩니다. 다른 네이티브 인스턴스를 객체와 연결하려면 먼저 `napi_remove_wrap()`을 사용하세요.


### `napi_unwrap` {#napi_unwrap}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_unwrap(napi_env env,
                        napi_value js_object,
                        void** result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] js_object`: 네이티브 인스턴스와 연결된 객체입니다.
- `[out] result`: 래핑된 네이티브 인스턴스에 대한 포인터입니다.

API가 성공하면 `napi_ok`를 반환합니다.

`napi_wrap()`을 사용하여 JavaScript 객체에 이전에 래핑된 네이티브 인스턴스를 검색합니다.

JavaScript 코드가 클래스에서 메서드 또는 속성 접근자를 호출하면 해당 `napi_callback`이 호출됩니다. 콜백이 인스턴스 메서드 또는 접근자를 위한 것이면 콜백에 대한 `this` 인수는 래퍼 객체입니다. 호출 대상인 래핑된 C++ 인스턴스는 래퍼 객체에서 `napi_unwrap()`을 호출하여 얻을 수 있습니다.

### `napi_remove_wrap` {#napi_remove_wrap}

**Added in: v8.5.0**

**N-API version: 1**

```C [C]
napi_status napi_remove_wrap(napi_env env,
                             napi_value js_object,
                             void** result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] js_object`: 네이티브 인스턴스와 연결된 객체입니다.
- `[out] result`: 래핑된 네이티브 인스턴스에 대한 포인터입니다.

API가 성공하면 `napi_ok`를 반환합니다.

`napi_wrap()`을 사용하여 JavaScript 객체 `js_object`에 이전에 래핑된 네이티브 인스턴스를 검색하고 래핑을 제거합니다. finalize 콜백이 래핑과 연결된 경우 JavaScript 객체가 가비지 수집될 때 더 이상 호출되지 않습니다.

### `napi_type_tag_object` {#napi_type_tag_object}

**Added in: v14.8.0, v12.19.0**

**N-API version: 8**

```C [C]
napi_status napi_type_tag_object(napi_env env,
                                 napi_value js_object,
                                 const napi_type_tag* type_tag);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] js_object`: 마크될 JavaScript 객체 또는 [external](/ko/nodejs/api/n-api#napi_create_external)입니다.
- `[in] type_tag`: 객체가 마크될 태그입니다.

API가 성공하면 `napi_ok`를 반환합니다.

`type_tag` 포인터의 값을 JavaScript 객체 또는 [external](/ko/nodejs/api/n-api#napi_create_external)과 연결합니다. 그런 다음 `napi_check_object_type_tag()`를 사용하여 객체에 연결된 태그를 애드온이 소유한 태그와 비교하여 객체가 올바른 유형인지 확인할 수 있습니다.

객체에 이미 연결된 유형 태그가 있는 경우 이 API는 `napi_invalid_arg`를 반환합니다.


### `napi_check_object_type_tag` {#napi_check_object_type_tag}

**추가된 버전: v14.8.0, v12.19.0**

**N-API 버전: 8**

```C [C]
napi_status napi_check_object_type_tag(napi_env env,
                                       napi_value js_object,
                                       const napi_type_tag* type_tag,
                                       bool* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] js_object`: 검사할 유형 태그가 있는 JavaScript 객체 또는 [외부](/ko/nodejs/api/n-api#napi_create_external)입니다.
- `[in] type_tag`: 객체에서 발견된 태그와 비교할 태그입니다.
- `[out] result`: 주어진 유형 태그가 객체의 유형 태그와 일치하는지 여부입니다. 객체에서 유형 태그를 찾을 수 없는 경우 `false`도 반환됩니다.

API가 성공하면 `napi_ok`를 반환합니다.

`type_tag`로 주어진 포인터를 `js_object`에서 찾을 수 있는 포인터와 비교합니다. `js_object`에서 태그를 찾을 수 없거나 태그를 찾았지만 `type_tag`와 일치하지 않으면 `result`가 `false`로 설정됩니다. 태그를 찾았고 `type_tag`와 일치하면 `result`가 `true`로 설정됩니다.

### `napi_add_finalizer` {#napi_add_finalizer}

**추가된 버전: v8.0.0**

**N-API 버전: 5**

```C [C]
napi_status napi_add_finalizer(napi_env env,
                               napi_value js_object,
                               void* finalize_data,
                               node_api_basic_finalize finalize_cb,
                               void* finalize_hint,
                               napi_ref* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] js_object`: 네이티브 데이터가 연결될 JavaScript 객체입니다.
- `[in] finalize_data`: `finalize_cb`에 전달될 선택적 데이터입니다.
- `[in] finalize_cb`: JavaScript 객체가 가비지 수집되었을 때 네이티브 데이터를 해제하는 데 사용될 네이티브 콜백입니다. [`napi_finalize`](/ko/nodejs/api/n-api#napi_finalize)에서 자세한 내용을 제공합니다.
- `[in] finalize_hint`: 종료 콜백에 전달되는 선택적 컨텍스트 힌트입니다.
- `[out] result`: JavaScript 객체에 대한 선택적 참조입니다.

API가 성공하면 `napi_ok`를 반환합니다.

`js_object`의 JavaScript 객체가 가비지 수집되었을 때 호출될 `napi_finalize` 콜백을 추가합니다.

이 API는 단일 JavaScript 객체에서 여러 번 호출할 수 있습니다.

*주의*: 반환된 선택적 참조(획득한 경우)는 종료 콜백 호출에 대한 응답으로만 [`napi_delete_reference`](/ko/nodejs/api/n-api#napi_delete_reference)를 통해 삭제해야 합니다. 그 전에 삭제하면 종료 콜백이 호출되지 않을 수 있습니다. 따라서 참조를 얻을 때 참조의 올바른 처리를 활성화하려면 종료 콜백도 필요합니다.


#### `node_api_post_finalizer` {#node_api_post_finalizer}

**추가된 버전: v21.0.0, v20.10.0, v18.19.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

```C [C]
napi_status node_api_post_finalizer(node_api_basic_env env,
                                    napi_finalize finalize_cb,
                                    void* finalize_data,
                                    void* finalize_hint);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] finalize_cb`: JavaScript 객체가 가비지 수집될 때 네이티브 데이터를 해제하는 데 사용될 네이티브 콜백입니다. [`napi_finalize`](/ko/nodejs/api/n-api#napi_finalize)에서 자세한 내용을 제공합니다.
- `[in] finalize_data`: `finalize_cb`에 전달될 선택적 데이터입니다.
- `[in] finalize_hint`: finalize 콜백에 전달되는 선택적 컨텍스트 힌트입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이벤트 루프에서 비동기적으로 호출될 `napi_finalize` 콜백을 예약합니다.

일반적으로 finalizer는 GC(가비지 수집기)가 객체를 수집하는 동안 호출됩니다. 이때 GC 상태 변경을 유발할 수 있는 Node-API를 호출하면 비활성화되고 Node.js가 충돌합니다.

`node_api_post_finalizer`는 애드온이 GC 종료 외부 시점에 이러한 Node-API 호출을 연기할 수 있도록 하여 이 제한 사항을 해결하는 데 도움이 됩니다.

## 간단한 비동기 작업 {#simple-asynchronous-operations}

애드온 모듈은 구현의 일부로 libuv의 비동기 도우미를 활용해야 하는 경우가 많습니다. 이를 통해 작업을 비동기적으로 실행하도록 예약할 수 있으므로 메서드가 작업 완료 전에 반환될 수 있습니다. 이를 통해 Node.js 애플리케이션의 전체 실행을 차단하는 것을 방지할 수 있습니다.

Node-API는 가장 일반적인 비동기 사용 사례를 다루는 이러한 지원 기능에 대한 ABI 안정적 인터페이스를 제공합니다.

Node-API는 비동기 작업을 관리하는 데 사용되는 `napi_async_work` 구조를 정의합니다. 인스턴스는 [`napi_create_async_work`](/ko/nodejs/api/n-api#napi_create_async_work) 및 [`napi_delete_async_work`](/ko/nodejs/api/n-api#napi_delete_async_work)로 생성/삭제됩니다.

`execute` 및 `complete` 콜백은 executor가 실행할 준비가 되었을 때와 작업 완료 시 각각 호출되는 함수입니다.

`execute` 함수는 JavaScript 실행 또는 JavaScript 객체와의 상호 작용을 유발할 수 있는 Node-API 호출을 수행하지 않아야 합니다. 대부분의 경우 Node-API 호출을 수행해야 하는 코드는 `complete` 콜백에서 대신 수행해야 합니다. JavaScript를 실행할 가능성이 있으므로 execute 콜백에서 `napi_env` 매개변수를 사용하지 마십시오.

이러한 함수는 다음 인터페이스를 구현합니다.

```C [C]
typedef void (*napi_async_execute_callback)(napi_env env,
                                            void* data);
typedef void (*napi_async_complete_callback)(napi_env env,
                                             napi_status status,
                                             void* data);
```
이러한 메서드가 호출되면 전달되는 `data` 매개변수는 애드온에서 제공한 `void*` 데이터로 `napi_create_async_work` 호출에 전달되었습니다.

생성되면 [`napi_queue_async_work`](/ko/nodejs/api/n-api#napi_queue_async_work) 함수를 사용하여 비동기 작업을 실행 대기열에 넣을 수 있습니다.

```C [C]
napi_status napi_queue_async_work(node_api_basic_env env,
                                  napi_async_work work);
```
작업이 실행을 시작하기 전에 취소해야 하는 경우 [`napi_cancel_async_work`](/ko/nodejs/api/n-api#napi_cancel_async_work)를 사용할 수 있습니다.

[`napi_cancel_async_work`](/ko/nodejs/api/n-api#napi_cancel_async_work)를 호출한 후에는 `complete` 콜백이 `napi_cancelled` 상태 값으로 호출됩니다. 작업이 취소된 경우에도 `complete` 콜백이 호출되기 전에 작업을 삭제해서는 안 됩니다.


### `napi_create_async_work` {#napi_create_async_work}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v8.6.0 | `async_resource` 및 `async_resource_name` 매개변수가 추가되었습니다. |
| v8.0.0 | 추가됨: v8.0.0 |
:::

**N-API 버전: 1**

```C [C]
napi_status napi_create_async_work(napi_env env,
                                   napi_value async_resource,
                                   napi_value async_resource_name,
                                   napi_async_execute_callback execute,
                                   napi_async_complete_callback complete,
                                   void* data,
                                   napi_async_work* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] async_resource`: 가능한 `async_hooks` [`init` 후크](/ko/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource)에 전달될 비동기 작업과 연결된 선택적 객체입니다.
- `[in] async_resource_name`: `async_hooks` API에서 노출하는 진단 정보에 제공되는 리소스 종류에 대한 식별자입니다.
- `[in] execute`: 로직을 비동기적으로 실행하기 위해 호출해야 하는 네이티브 함수입니다. 지정된 함수는 워커 풀 스레드에서 호출되며 주 이벤트 루프 스레드와 병렬로 실행할 수 있습니다.
- `[in] complete`: 비동기 로직이 완료되거나 취소될 때 호출될 네이티브 함수입니다. 지정된 함수는 주 이벤트 루프 스레드에서 호출됩니다. [`napi_async_complete_callback`](/ko/nodejs/api/n-api#napi_async_complete_callback)은 더 자세한 정보를 제공합니다.
- `[in] data`: 사용자가 제공한 데이터 컨텍스트입니다. 이는 실행 및 완료 함수에 다시 전달됩니다.
- `[out] result`: 새로 생성된 비동기 작업에 대한 핸들인 `napi_async_work*`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 로직을 비동기적으로 실행하는 데 사용되는 작업 객체를 할당합니다. 작업이 더 이상 필요하지 않으면 [`napi_delete_async_work`](/ko/nodejs/api/n-api#napi_delete_async_work)를 사용하여 해제해야 합니다.

`async_resource_name`은 null로 끝나는 UTF-8 인코딩 문자열이어야 합니다.

`async_resource_name` 식별자는 사용자가 제공하며 수행되는 비동기 작업 유형을 나타내야 합니다. 모듈 이름을 포함하는 등 식별자에 네임스페이스를 적용하는 것이 좋습니다. 자세한 내용은 [`async_hooks` 문서](/ko/nodejs/api/async_hooks#type)를 참조하세요.


### `napi_delete_async_work` {#napi_delete_async_work}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_delete_async_work(napi_env env,
                                   napi_async_work work);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] work`: `napi_create_async_work` 호출에서 반환된 핸들입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 이전에 할당된 작업 객체를 해제합니다.

이 API는 보류 중인 JavaScript 예외가 있는 경우에도 호출할 수 있습니다.

### `napi_queue_async_work` {#napi_queue_async_work}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_queue_async_work(node_api_basic_env env,
                                  napi_async_work work);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] work`: `napi_create_async_work` 호출에서 반환된 핸들입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 이전에 할당된 작업이 실행되도록 예약하도록 요청합니다. 성공적으로 반환되면 동일한 `napi_async_work` 항목으로 이 API를 다시 호출해서는 안 되며 결과는 정의되지 않습니다.

### `napi_cancel_async_work` {#napi_cancel_async_work}

**추가된 버전: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_cancel_async_work(node_api_basic_env env,
                                   napi_async_work work);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] work`: `napi_create_async_work` 호출에서 반환된 핸들입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 아직 시작되지 않은 대기 중인 작업을 취소합니다. 이미 실행이 시작된 경우 취소할 수 없으며 `napi_generic_failure`가 반환됩니다. 성공하면 `complete` 콜백이 `napi_cancelled` 상태 값으로 호출됩니다. 작업이 성공적으로 취소된 경우에도 `complete` 콜백 호출 전에 작업을 삭제해서는 안 됩니다.

이 API는 보류 중인 JavaScript 예외가 있는 경우에도 호출할 수 있습니다.

## 사용자 정의 비동기 작업 {#custom-asynchronous-operations}

위의 간단한 비동기 작업 API가 모든 시나리오에 적합하지 않을 수 있습니다. 다른 비동기 메커니즘을 사용하는 경우 비동기 작업이 런타임에서 올바르게 추적되도록 하려면 다음 API가 필요합니다.


### `napi_async_init` {#napi_async_init}

**추가된 버전: v8.6.0**

**N-API 버전: 1**

```C [C]
napi_status napi_async_init(napi_env env,
                            napi_value async_resource,
                            napi_value async_resource_name,
                            napi_async_context* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] async_resource`: 가능한 `async_hooks` [`init` 후크](/ko/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource)에 전달될 비동기 작업과 연결된 객체이며 [`async_hooks.executionAsyncResource()`](/ko/nodejs/api/async_hooks#async_hooksexecutionasyncresource)에서 액세스할 수 있습니다.
- `[in] async_resource_name`: `async_hooks` API에서 노출하는 진단 정보를 위해 제공되는 리소스 종류의 식별자입니다.
- `[out] result`: 초기화된 비동기 컨텍스트입니다.

API가 성공하면 `napi_ok`를 반환합니다.

`async_hooks` 관련 API가 올바르게 작동하도록 하려면 [`napi_async_destroy`](/ko/nodejs/api/n-api#napi_async_destroy)까지 `async_resource` 객체를 활성 상태로 유지해야 합니다. 이전 버전과의 ABI 호환성을 유지하기 위해 `napi_async_context`는 메모리 누수를 유발하는 것을 방지하기 위해 `async_resource` 객체에 대한 강력한 참조를 유지하지 않습니다. 그러나 `napi_async_context`가 `napi_async_destroy`에 의해 파괴되기 전에 JavaScript 엔진에 의해 `async_resource`가 가비지 수집되면 [`napi_open_callback_scope`](/ko/nodejs/api/n-api#napi_open_callback_scope) 및 [`napi_make_callback`](/ko/nodejs/api/n-api#napi_make_callback)과 같은 `napi_async_context` 관련 API를 호출하면 `AsyncLocalStorage` API를 사용할 때 비동기 컨텍스트 손실과 같은 문제가 발생할 수 있습니다.

이전 버전과의 ABI 호환성을 유지하기 위해 `async_resource`에 `NULL`을 전달해도 오류가 발생하지 않습니다. 그러나 이는 `async_hooks` [`init` 후크](/ko/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource) 및 `async_hooks.executionAsyncResource()`에서 바람직하지 않은 동작을 초래할 수 있으므로 권장되지 않습니다. 그 이유는 기본 `async_hooks` 구현에서 비동기 콜백 간의 연결을 제공하기 위해 이제 리소스가 필요하기 때문입니다.


### `napi_async_destroy` {#napi_async_destroy}

**추가됨: v8.6.0**

**N-API 버전: 1**

```C [C]
napi_status napi_async_destroy(napi_env env,
                               napi_async_context async_context);
```
- `[in] env`: API가 호출된 환경입니다.
- `[in] async_context`: 삭제할 비동기 컨텍스트입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 보류 중인 JavaScript 예외가 있는 경우에도 호출할 수 있습니다.

### `napi_make_callback` {#napi_make_callback}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v8.6.0 | `async_context` 매개변수 추가됨. |
| v8.0.0 | 추가됨: v8.0.0 |
:::

**N-API 버전: 1**

```C [C]
NAPI_EXTERN napi_status napi_make_callback(napi_env env,
                                           napi_async_context async_context,
                                           napi_value recv,
                                           napi_value func,
                                           size_t argc,
                                           const napi_value* argv,
                                           napi_value* result);
```
- `[in] env`: API가 호출된 환경입니다.
- `[in] async_context`: 콜백을 호출하는 비동기 작업의 컨텍스트입니다. 이는 일반적으로 [`napi_async_init`](/ko/nodejs/api/n-api#napi_async_init)에서 이전에 얻은 값이어야 합니다. 이전 버전과의 ABI 호환성을 유지하기 위해 `async_context`에 대해 `NULL`을 전달해도 오류가 발생하지 않습니다. 그러나 이렇게 하면 비동기 후크가 올바르게 작동하지 않습니다. 잠재적인 문제에는 `AsyncLocalStorage` API를 사용할 때 비동기 컨텍스트 손실이 포함됩니다.
- `[in] recv`: 호출된 함수에 전달되는 `this` 값입니다.
- `[in] func`: 호출할 JavaScript 함수를 나타내는 `napi_value`입니다.
- `[in] argc`: `argv` 배열의 요소 수입니다.
- `[in] argv`: 함수에 대한 인수를 나타내는 `napi_value`로서의 JavaScript 값 배열입니다. `argc`가 0이면 이 매개변수는 `NULL`을 전달하여 생략할 수 있습니다.
- `[out] result`: 반환된 JavaScript 객체를 나타내는 `napi_value`입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 메서드를 사용하면 네이티브 추가 기능에서 JavaScript 함수 객체를 호출할 수 있습니다. 이 API는 `napi_call_function`과 유사합니다. 그러나 비동기 작업에서 반환된 *후* (스택에 다른 스크립트가 없을 때) 네이티브 코드에서 JavaScript *안으로* 다시 호출하는 데 사용됩니다. 이는 `node::MakeCallback`을 래핑하는 비교적 간단한 래퍼입니다.

`napi_async_complete_callback` 내에서 `napi_make_callback`을 사용할 필요가 *없습니다*. 해당 상황에서는 콜백의 비동기 컨텍스트가 이미 설정되었으므로 `napi_call_function`을 직접 호출하는 것으로 충분하고 적절합니다. `napi_create_async_work`를 사용하지 않는 사용자 지정 비동기 동작을 구현할 때 `napi_make_callback` 함수를 사용해야 할 수 있습니다.

콜백 중에 JavaScript에서 마이크로태스크 큐에 예약된 모든 `process.nextTick` 또는 Promise는 C/C++로 다시 반환되기 전에 실행됩니다.


### `napi_open_callback_scope` {#napi_open_callback_scope}

**Added in: v9.6.0**

**N-API version: 3**

```C [C]
NAPI_EXTERN napi_status napi_open_callback_scope(napi_env env,
                                                 napi_value resource_object,
                                                 napi_async_context context,
                                                 napi_callback_scope* result)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] resource_object`: 가능한 `async_hooks` [`init` hooks](/ko/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource)에 전달될 비동기 작업과 관련된 객체입니다. 이 매개변수는 더 이상 사용되지 않으며 런타임 시 무시됩니다. 대신 [`napi_async_init`](/ko/nodejs/api/n-api#napi_async_init)의 `async_resource` 매개변수를 사용하세요.
- `[in] context`: 콜백을 호출하는 비동기 작업의 컨텍스트입니다. 이는 이전에 [`napi_async_init`](/ko/nodejs/api/n-api#napi_async_init)에서 얻은 값이어야 합니다.
- `[out] result`: 새로 생성된 범위입니다.

특정 Node-API 호출을 할 때 콜백과 관련된 범위와 동등한 범위를 갖는 것이 필요한 경우가 있습니다 (예: 프로미스 해결). 스택에 다른 스크립트가 없는 경우 [`napi_open_callback_scope`](/ko/nodejs/api/n-api#napi_open_callback_scope) 및 [`napi_close_callback_scope`](/ko/nodejs/api/n-api#napi_close_callback_scope) 함수를 사용하여 필요한 범위를 열고 닫을 수 있습니다.

### `napi_close_callback_scope` {#napi_close_callback_scope}

**Added in: v9.6.0**

**N-API version: 3**

```C [C]
NAPI_EXTERN napi_status napi_close_callback_scope(napi_env env,
                                                  napi_callback_scope scope)
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] scope`: 닫을 범위입니다.

이 API는 보류 중인 JavaScript 예외가 있는 경우에도 호출할 수 있습니다.

## 버전 관리 {#version-management}

### `napi_get_node_version` {#napi_get_node_version}

**Added in: v8.4.0**

**N-API version: 1**

```C [C]
typedef struct {
  uint32_t major;
  uint32_t minor;
  uint32_t patch;
  const char* release;
} napi_node_version;

napi_status napi_get_node_version(node_api_basic_env env,
                                  const napi_node_version** version);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[out] version`: 현재 실행 중인 Node.js 자체의 버전 정보에 대한 포인터입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 함수는 `version` 구조체를 현재 실행 중인 Node.js의 major, minor 및 patch 버전으로 채우고 `release` 필드를 [`process.release.name`](/ko/nodejs/api/process#processrelease) 값으로 채웁니다.

반환된 버퍼는 정적으로 할당되며 해제할 필요가 없습니다.


### `napi_get_version` {#napi_get_version}

**추가됨: v8.0.0**

**N-API 버전: 1**

```C [C]
napi_status napi_get_version(node_api_basic_env env,
                             uint32_t* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[out] result`: 지원되는 Node-API의 최고 버전입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 Node.js 런타임에서 지원하는 가장 높은 Node-API 버전을 반환합니다. Node-API는 Node.js의 최신 릴리스에서 추가 API 함수를 지원할 수 있도록 추가적으로 계획됩니다. Node.js를 지원하는 버전에서 새 기능을 사용하고, 지원하지 않는 Node.js 버전에서 대체 동작을 제공하기 위해 다음을 수행합니다.

- `napi_get_version()`을 호출하여 API를 사용할 수 있는지 확인합니다.
- 사용 가능한 경우 `uv_dlsym()`을 사용하여 함수에 대한 포인터를 동적으로 로드합니다.
- 동적으로 로드된 포인터를 사용하여 함수를 호출합니다.
- 함수를 사용할 수 없는 경우 함수를 사용하지 않는 대체 구현을 제공합니다.

## 메모리 관리 {#memory-management}

### `napi_adjust_external_memory` {#napi_adjust_external_memory}

**추가됨: v8.5.0**

**N-API 버전: 1**

```C [C]
NAPI_EXTERN napi_status napi_adjust_external_memory(node_api_basic_env env,
                                                    int64_t change_in_bytes,
                                                    int64_t* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] change_in_bytes`: JavaScript 객체에 의해 활성 상태로 유지되는 외부적으로 할당된 메모리의 변경 사항입니다.
- `[out] result`: 조정된 값입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 함수는 V8에 JavaScript 객체에 의해 활성 상태로 유지되는 외부적으로 할당된 메모리 양을 알려줍니다(즉, 네이티브 애드온에 의해 할당된 자체 메모리를 가리키는 JavaScript 객체). 외부적으로 할당된 메모리를 등록하면 그렇지 않은 경우보다 더 자주 전역 가비지 수집이 트리거됩니다.

## 프로미스 {#promises}

Node-API는 ECMA 사양의 [섹션 25.4](https://tc39.github.io/ecma262/#sec-promise-objects)에 설명된 대로 `Promise` 객체를 생성하기 위한 기능을 제공합니다. 프로미스를 한 쌍의 객체로 구현합니다. `napi_create_promise()`에 의해 프로미스가 생성되면 "지연된" 객체가 생성되어 `Promise`와 함께 반환됩니다. 지연된 객체는 생성된 `Promise`에 바인딩되고 `napi_resolve_deferred()` 또는 `napi_reject_deferred()`를 사용하여 `Promise`를 해결하거나 거부하는 유일한 수단입니다. `napi_create_promise()`에 의해 생성된 지연된 객체는 `napi_resolve_deferred()` 또는 `napi_reject_deferred()`에 의해 해제됩니다. `Promise` 객체는 일반적인 방식으로 사용할 수 있는 JavaScript로 반환될 수 있습니다.

예를 들어 프로미스를 생성하고 비동기 작업자에 전달하려면 다음과 같습니다.

```C [C]
napi_deferred deferred;
napi_value promise;
napi_status status;

// 프로미스를 생성합니다.
status = napi_create_promise(env, &deferred, &promise);
if (status != napi_ok) return NULL;

// 지연된 값을 비동기 작업을 수행하는 함수에 전달합니다.
do_something_asynchronous(deferred);

// 프로미스를 JS에 반환합니다.
return promise;
```
위의 함수 `do_something_asynchronous()`는 비동기 작업을 수행한 다음 지연된 값을 해결하거나 거부하여 프로미스를 완료하고 지연된 값을 해제합니다.

```C [C]
napi_deferred deferred;
napi_value undefined;
napi_status status;

// 지연된 값을 완료하는 데 사용할 값을 만듭니다.
status = napi_get_undefined(env, &undefined);
if (status != napi_ok) return NULL;

// 비동기 작업이 성공했는지 여부에 따라 지연된 값과 연결된 프로미스를 해결하거나 거부합니다.
if (asynchronous_action_succeeded) {
  status = napi_resolve_deferred(env, deferred, undefined);
} else {
  status = napi_reject_deferred(env, deferred, undefined);
}
if (status != napi_ok) return NULL;

// 이 시점에서 지연된 값이 해제되었으므로 NULL을 할당해야 합니다.
deferred = NULL;
```

### `napi_create_promise` {#napi_create_promise}

**Added in: v8.5.0**

**N-API version: 1**

```C [C]
napi_status napi_create_promise(napi_env env,
                                napi_deferred* deferred,
                                napi_value* promise);
```
- `[in] env`: API가 호출된 환경입니다.
- `[out] deferred`: 새로 생성된 deferred 객체입니다. 이 객체는 나중에 `napi_resolve_deferred()` 또는 `napi_reject_deferred()`에 전달되어 연결된 Promise를 각각 resolve 또는 reject할 수 있습니다.
- `[out] promise`: deferred 객체와 연결된 JavaScript Promise입니다.

API가 성공하면 `napi_ok`를 반환합니다.

이 API는 deferred 객체와 JavaScript Promise를 생성합니다.

### `napi_resolve_deferred` {#napi_resolve_deferred}

**Added in: v8.5.0**

**N-API version: 1**

```C [C]
napi_status napi_resolve_deferred(napi_env env,
                                  napi_deferred deferred,
                                  napi_value resolution);
```
- `[in] env`: API가 호출된 환경입니다.
- `[in] deferred`: resolve할 연결된 Promise가 있는 deferred 객체입니다.
- `[in] resolution`: Promise를 resolve할 값입니다.

이 API는 연결된 deferred 객체를 통해 JavaScript Promise를 resolve합니다. 따라서, 이 API는 해당 deferred 객체를 사용할 수 있는 JavaScript Promise를 resolve하는 데만 사용할 수 있습니다. 이는 Promise가 `napi_create_promise()`를 사용하여 생성되었고 해당 호출에서 반환된 deferred 객체를 이 API에 전달하기 위해 유지했어야 함을 의미합니다.

deferred 객체는 성공적으로 완료되면 해제됩니다.

### `napi_reject_deferred` {#napi_reject_deferred}

**Added in: v8.5.0**

**N-API version: 1**

```C [C]
napi_status napi_reject_deferred(napi_env env,
                                 napi_deferred deferred,
                                 napi_value rejection);
```
- `[in] env`: API가 호출된 환경입니다.
- `[in] deferred`: resolve할 연결된 Promise가 있는 deferred 객체입니다.
- `[in] rejection`: Promise를 reject할 값입니다.

이 API는 연결된 deferred 객체를 통해 JavaScript Promise를 reject합니다. 따라서, 이 API는 해당 deferred 객체를 사용할 수 있는 JavaScript Promise를 reject하는 데만 사용할 수 있습니다. 이는 Promise가 `napi_create_promise()`를 사용하여 생성되었고 해당 호출에서 반환된 deferred 객체를 이 API에 전달하기 위해 유지했어야 함을 의미합니다.

deferred 객체는 성공적으로 완료되면 해제됩니다.


### `napi_is_promise` {#napi_is_promise}

**추가된 버전: v8.5.0**

**N-API 버전: 1**

```C [C]
napi_status napi_is_promise(napi_env env,
                            napi_value value,
                            bool* is_promise);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] value`: 검사할 값입니다.
- `[out] is_promise`: `promise`가 기본 엔진에서 생성된 네이티브 Promise 객체인지 여부를 나타내는 플래그입니다.

## 스크립트 실행 {#script-execution}

Node-API는 기본 JavaScript 엔진을 사용하여 JavaScript를 포함하는 문자열을 실행하기 위한 API를 제공합니다.

### `napi_run_script` {#napi_run_script}

**추가된 버전: v8.5.0**

**N-API 버전: 1**

```C [C]
NAPI_EXTERN napi_status napi_run_script(napi_env env,
                                        napi_value script,
                                        napi_value* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] script`: 실행할 스크립트를 포함하는 JavaScript 문자열입니다.
- `[out] result`: 스크립트 실행 결과로 생성된 값입니다.

이 함수는 다음과 같은 주의 사항과 함께 JavaScript 코드 문자열을 실행하고 그 결과를 반환합니다.

- `eval`과 달리 이 함수는 스크립트가 현재 어휘 범위에 액세스하는 것을 허용하지 않으므로 [모듈 범위](/ko/nodejs/api/modules#the-module-scope)에 액세스하는 것도 허용하지 않습니다. 즉, `require`와 같은 유사-전역 변수를 사용할 수 없습니다.
- 스크립트는 [전역 범위](/ko/nodejs/api/globals)에 액세스할 수 있습니다. 스크립트의 함수 및 `var` 선언은 [`global`](/ko/nodejs/api/globals#global) 객체에 추가됩니다. `let` 및 `const`를 사용하여 수행된 변수 선언은 전역적으로 표시되지만 [`global`](/ko/nodejs/api/globals#global) 객체에 추가되지는 않습니다.
- 스크립트 내에서 `this` 값은 [`global`](/ko/nodejs/api/globals#global)입니다.

## libuv 이벤트 루프 {#libuv-event-loop}

Node-API는 특정 `napi_env`와 연결된 현재 이벤트 루프를 가져오기 위한 함수를 제공합니다.

### `napi_get_uv_event_loop` {#napi_get_uv_event_loop}

**추가된 버전: v9.3.0, v8.10.0**

**N-API 버전: 2**

```C [C]
NAPI_EXTERN napi_status napi_get_uv_event_loop(node_api_basic_env env,
                                               struct uv_loop_s** loop);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[out] loop`: 현재 libuv 루프 인스턴스입니다.

참고: libuv는 시간이 지남에 따라 비교적 안정적이지만 ABI 안정성 보장을 제공하지 않습니다. 이 함수의 사용은 피해야 합니다. 이 함수의 사용은 Node.js 버전에서 작동하지 않는 애드온을 초래할 수 있습니다. [비동기-스레드-안전-함수-호출](/ko/nodejs/api/n-api#asynchronous-thread-safe-function-calls)이 많은 사용 사례에 대한 대안입니다.


## 비동기 스레드 안전 함수 호출 {#asynchronous-thread-safe-function-calls}

JavaScript 함수는 일반적으로 네이티브 애드온의 주 스레드에서만 호출할 수 있습니다. 애드온이 추가 스레드를 생성하는 경우 `napi_env`, `napi_value` 또는 `napi_ref`가 필요한 Node-API 함수는 이러한 스레드에서 호출해서는 안 됩니다.

애드온에 추가 스레드가 있고 해당 스레드에서 완료된 처리를 기반으로 JavaScript 함수를 호출해야 하는 경우 해당 스레드는 애드온의 주 스레드와 통신하여 주 스레드가 대신 JavaScript 함수를 호출할 수 있도록 해야 합니다. 스레드 안전 함수 API는 이를 쉽게 수행할 수 있는 방법을 제공합니다.

이러한 API는 `napi_threadsafe_function` 유형과 이 유형의 객체를 생성, 제거 및 호출하는 API를 제공합니다. `napi_create_threadsafe_function()`은 여러 스레드에서 호출할 수 있는 JavaScript 함수를 보유하는 `napi_value`에 대한 영구 참조를 생성합니다. 호출은 비동기적으로 발생합니다. 즉, JavaScript 콜백을 호출할 값이 큐에 배치되고 큐의 각 값에 대해 결국 JavaScript 함수가 호출됩니다.

`napi_threadsafe_function`을 생성할 때 `napi_finalize` 콜백을 제공할 수 있습니다. 이 콜백은 스레드 안전 함수가 제거되기 직전에 주 스레드에서 호출됩니다. 생성 중에 제공된 컨텍스트와 종료 데이터를 수신하고 `uv_thread_join()`을 호출하여 스레드 정리 후 정리할 수 있는 기회를 제공합니다. **주 루프 스레드를 제외하고
종료 콜백이 완료된 후에는 스레드 안전 함수를 사용하는 스레드가 없어야 합니다.**

`napi_create_threadsafe_function()` 호출 중에 제공된 `context`는 `napi_get_threadsafe_function_context()`를 호출하여 모든 스레드에서 검색할 수 있습니다.

### 스레드 안전 함수 호출 {#calling-a-thread-safe-function}

`napi_call_threadsafe_function()`은 JavaScript 호출을 시작하는 데 사용할 수 있습니다. `napi_call_threadsafe_function()`은 API가 차단 방식으로 동작하는지 여부를 제어하는 매개변수를 허용합니다. `napi_tsfn_nonblocking`으로 설정하면 API는 큐가 가득 차서 데이터를 큐에 성공적으로 추가할 수 없는 경우 `napi_queue_full`을 반환하면서 차단되지 않고 동작합니다. `napi_tsfn_blocking`으로 설정하면 API는 큐에서 공간이 확보될 때까지 차단됩니다. 스레드 안전 함수가 최대 큐 크기가 0으로 생성된 경우 `napi_call_threadsafe_function()`은 차단되지 않습니다.

JavaScript 스레드에서 `napi_call_threadsafe_function()`을 `napi_tsfn_blocking`으로 호출해서는 안 됩니다. 큐가 가득 찬 경우 JavaScript 스레드가 교착 상태에 빠질 수 있기 때문입니다.

JavaScript에 대한 실제 호출은 `call_js_cb` 매개변수를 통해 제공된 콜백에 의해 제어됩니다. `call_js_cb`는 `napi_call_threadsafe_function()`에 대한 성공적인 호출로 큐에 배치된 각 값에 대해 한 번 주 스레드에서 호출됩니다. 이러한 콜백이 제공되지 않으면 기본 콜백이 사용되고 결과 JavaScript 호출에는 인수가 없습니다. `call_js_cb` 콜백은 호출할 JavaScript 함수를 매개변수에서 `napi_value`로 수신하고, `napi_threadsafe_function`을 생성할 때 사용된 `void*` 컨텍스트 포인터와 보조 스레드 중 하나에서 생성된 다음 데이터 포인터를 수신합니다. 그런 다음 콜백은 `napi_call_function()`과 같은 API를 사용하여 JavaScript를 호출할 수 있습니다.

콜백은 `env` 및 `call_js_cb`가 모두 `NULL`로 설정된 상태로 호출되어 JavaScript에 대한 호출이 더 이상 불가능하고 해제해야 할 항목이 큐에 남아 있음을 나타낼 수도 있습니다. 이는 일반적으로 활성 상태인 스레드 안전 함수가 있는 동안 Node.js 프로세스가 종료될 때 발생합니다.

Node-API는 콜백에 적합한 컨텍스트에서 `call_js_cb`를 실행하므로 `napi_make_callback()`을 통해 JavaScript를 호출할 필요가 없습니다.

이벤트 루프의 각 틱에서 0개 이상의 큐에 넣은 항목을 호출할 수 있습니다. 애플리케이션은 콜백 호출 진행과 시간이 지남에 따라 이벤트가 호출된다는 점 외에 특정 동작에 의존해서는 안 됩니다.


### 스레드 안전 함수에 대한 참조 카운팅 {#reference-counting-of-thread-safe-functions}

스레드가 존재하는 동안 `napi_threadsafe_function` 객체에 스레드를 추가하거나 제거할 수 있습니다. 따라서 생성 시 초기 스레드 수를 지정하는 것 외에도 `napi_acquire_threadsafe_function`을 호출하여 새 스레드가 스레드 안전 함수를 사용하기 시작함을 나타낼 수 있습니다. 마찬가지로 `napi_release_threadsafe_function`을 호출하여 기존 스레드가 스레드 안전 함수 사용을 중단함을 나타낼 수 있습니다.

`napi_threadsafe_function` 객체는 객체를 사용하는 모든 스레드가 `napi_release_threadsafe_function()`을 호출했거나 `napi_call_threadsafe_function` 호출에 대한 응답으로 `napi_closing` 반환 상태를 받았을 때 소멸됩니다. `napi_threadsafe_function`이 소멸되기 전에 큐가 비워집니다. `napi_release_threadsafe_function()`은 지정된 `napi_threadsafe_function`과 관련하여 수행되는 마지막 API 호출이어야 합니다. 호출이 완료된 후에는 `napi_threadsafe_function`이 여전히 할당되어 있는지 보장할 수 없기 때문입니다. 같은 이유로 `napi_call_threadsafe_function` 호출에 대한 응답으로 `napi_closing` 반환 값을 받은 후에는 스레드 안전 함수를 사용하지 마십시오. `napi_threadsafe_function`과 연결된 데이터는 `napi_create_threadsafe_function()`에 전달된 `napi_finalize` 콜백에서 해제할 수 있습니다. `napi_create_threadsafe_function`의 매개변수 `initial_thread_count`는 생성 시 `napi_acquire_threadsafe_function`을 여러 번 호출하는 대신 스레드 안전 함수의 초기 획득 수를 표시합니다.

`napi_threadsafe_function`을 사용하는 스레드 수가 0에 도달하면 더 이상 `napi_acquire_threadsafe_function()`을 호출하여 스레드를 시작할 수 없습니다. 실제로 `napi_release_threadsafe_function()`을 제외한 모든 후속 API 호출은 `napi_closing` 오류 값을 반환합니다.

`napi_release_threadsafe_function()`에 `napi_tsfn_abort` 값을 지정하여 스레드 안전 함수를 "중단"할 수 있습니다. 이렇게 하면 참조 카운트가 0에 도달하기 전에도 `napi_release_threadsafe_function()`을 제외한 스레드 안전 함수와 관련된 모든 후속 API가 `napi_closing`을 반환합니다. 특히 `napi_call_threadsafe_function()`은 `napi_closing`을 반환하여 스레드에 스레드 안전 함수에 대한 비동기 호출을 더 이상 수행할 수 없음을 알립니다. 이는 스레드를 종료하는 기준으로 사용할 수 있습니다. **<code>napi_call_threadsafe_function()</code>에서 <code>napi_closing</code> 반환 값을 받은 스레드는 더 이상 스레드 안전 함수를 사용해서는 안 됩니다. 스레드 안전 함수가 더 이상 할당되어 있는지 보장할 수 없기 때문입니다.**


### 프로세스를 계속 실행할지 여부 결정 {#deciding-whether-to-keep-the-process-running}

libuv 핸들과 마찬가지로 스레드 안전 함수는 "참조" 및 "참조 해제"될 수 있습니다. "참조된" 스레드 안전 함수는 스레드 안전 함수가 소멸될 때까지 해당 함수가 생성된 스레드의 이벤트 루프가 활성 상태를 유지하도록 합니다. 반면 "참조 해제된" 스레드 안전 함수는 이벤트 루프가 종료되는 것을 방지하지 않습니다. API `napi_ref_threadsafe_function` 및 `napi_unref_threadsafe_function`은 이러한 용도로 존재합니다.

`napi_unref_threadsafe_function`은 스레드 안전 함수를 소멸될 수 있는 것으로 표시하지 않으며 `napi_ref_threadsafe_function`은 스레드 안전 함수가 소멸되는 것을 방지하지 않습니다.

### `napi_create_threadsafe_function` {#napi_create_threadsafe_function}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v12.6.0, v10.17.0 | 사용자 지정 `call_js_cb`를 사용하여 `func` 매개변수를 선택 사항으로 만들었습니다. |
| v10.6.0 | v10.6.0에 추가됨 |
:::

**N-API 버전: 4**

```C [C]
NAPI_EXTERN napi_status
napi_create_threadsafe_function(napi_env env,
                                napi_value func,
                                napi_value async_resource,
                                napi_value async_resource_name,
                                size_t max_queue_size,
                                size_t initial_thread_count,
                                void* thread_finalize_data,
                                napi_finalize thread_finalize_cb,
                                void* context,
                                napi_threadsafe_function_call_js call_js_cb,
                                napi_threadsafe_function* result);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] func`: 다른 스레드에서 호출할 선택적 JavaScript 함수입니다. `NULL`이 `call_js_cb`에 전달되는 경우 제공되어야 합니다.
- `[in] async_resource`: 가능한 `async_hooks` [`init` 후크](/ko/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource)에 전달될 비동기 작업과 연결된 선택적 객체입니다.
- `[in] async_resource_name`: `async_hooks` API에서 노출하는 진단 정보를 위해 제공되는 리소스 종류에 대한 식별자를 제공하는 JavaScript 문자열입니다.
- `[in] max_queue_size`: 큐의 최대 크기입니다. 제한이 없으면 `0`입니다.
- `[in] initial_thread_count`: 초기 획득 횟수, 즉 이 함수를 사용할 메인 스레드를 포함한 초기 스레드 수입니다.
- `[in] thread_finalize_data`: `thread_finalize_cb`에 전달할 선택적 데이터입니다.
- `[in] thread_finalize_cb`: `napi_threadsafe_function`이 소멸될 때 호출할 선택적 함수입니다.
- `[in] context`: 결과 `napi_threadsafe_function`에 연결할 선택적 데이터입니다.
- `[in] call_js_cb`: 다른 스레드의 호출에 대한 응답으로 JavaScript 함수를 호출하는 선택적 콜백입니다. 이 콜백은 메인 스레드에서 호출됩니다. 제공되지 않은 경우 JavaScript 함수는 매개변수 없이 호출되고 `undefined`가 `this` 값으로 사용됩니다. [`napi_threadsafe_function_call_js`](/ko/nodejs/api/n-api#napi_threadsafe_function_call_js)에 자세한 내용이 나와 있습니다.
- `[out] result`: 비동기 스레드 안전 JavaScript 함수입니다.

**변경 내역:**

- 실험적 (`NAPI_EXPERIMENTAL`이 정의됨): `call_js_cb`에서 발생한 처리되지 않은 예외는 무시되는 대신 [`'uncaughtException'`](/ko/nodejs/api/process#event-uncaughtexception) 이벤트로 처리됩니다.


### `napi_get_threadsafe_function_context` {#napi_get_threadsafe_function_context}

**추가된 버전: v10.6.0**

**N-API 버전: 4**

```C [C]
NAPI_EXTERN napi_status
napi_get_threadsafe_function_context(napi_threadsafe_function func,
                                     void** result);
```
- `[in] func`: 컨텍스트를 검색할 스레드 안전 함수입니다.
- `[out] result`: 컨텍스트를 저장할 위치입니다.

이 API는 `func`를 사용하는 모든 스레드에서 호출할 수 있습니다.

### `napi_call_threadsafe_function` {#napi_call_threadsafe_function}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.5.0 | `napi_would_deadlock` 지원이 되돌려졌습니다. |
| v14.1.0 | 메인 스레드 또는 워커 스레드에서 `napi_tsfn_blocking`으로 호출되고 큐가 가득 찬 경우 `napi_would_deadlock`을 반환합니다. |
| v10.6.0 | 추가된 버전: v10.6.0 |
:::

**N-API 버전: 4**

```C [C]
NAPI_EXTERN napi_status
napi_call_threadsafe_function(napi_threadsafe_function func,
                              void* data,
                              napi_threadsafe_function_call_mode is_blocking);
```
- `[in] func`: 호출할 비동기 스레드 안전 JavaScript 함수입니다.
- `[in] data`: 스레드 안전 JavaScript 함수 생성 중에 제공된 콜백 `call_js_cb`를 통해 JavaScript로 보낼 데이터입니다.
- `[in] is_blocking`: 큐가 가득 찬 경우 호출이 차단되어야 함을 나타내는 `napi_tsfn_blocking` 또는 큐가 가득 찰 때마다 `napi_queue_full` 상태로 즉시 반환되어야 함을 나타내는 `napi_tsfn_nonblocking`일 수 있는 플래그입니다.

이 API는 JavaScript 스레드에서 `napi_tsfn_blocking`으로 호출해서는 안 됩니다. 큐가 가득 찬 경우 JavaScript 스레드가 교착 상태에 빠질 수 있기 때문입니다.

이 API는 모든 스레드에서 `abort`가 `napi_tsfn_abort`로 설정된 상태로 `napi_release_threadsafe_function()`이 호출된 경우 `napi_closing`을 반환합니다. API가 `napi_ok`를 반환하는 경우에만 값이 큐에 추가됩니다.

이 API는 `func`를 사용하는 모든 스레드에서 호출할 수 있습니다.

### `napi_acquire_threadsafe_function` {#napi_acquire_threadsafe_function}

**추가된 버전: v10.6.0**

**N-API 버전: 4**

```C [C]
NAPI_EXTERN napi_status
napi_acquire_threadsafe_function(napi_threadsafe_function func);
```
- `[in] func`: 사용하기 시작할 비동기 스레드 안전 JavaScript 함수입니다.

스레드는 다른 스레드 안전 함수 API에 `func`를 전달하기 전에 이 API를 호출하여 `func`를 사용하고 있음을 나타내야 합니다. 이렇게 하면 다른 모든 스레드가 사용을 중단했을 때 `func`가 제거되는 것을 방지할 수 있습니다.

이 API는 `func`를 사용하기 시작하는 모든 스레드에서 호출할 수 있습니다.


### `napi_release_threadsafe_function` {#napi_release_threadsafe_function}

**Added in: v10.6.0**

**N-API version: 4**

```C [C]
NAPI_EXTERN napi_status
napi_release_threadsafe_function(napi_threadsafe_function func,
                                 napi_threadsafe_function_release_mode mode);
```
- `[in] func`: 참조 횟수를 감소시킬 비동기 스레드 안전 JavaScript 함수입니다.
- `[in] mode`: 플래그 값은 현재 스레드가 스레드 안전 함수를 더 이상 호출하지 않음을 나타내는 `napi_tsfn_release` 또는 현재 스레드뿐만 아니라 다른 스레드도 스레드 안전 함수를 더 이상 호출하지 않아야 함을 나타내는 `napi_tsfn_abort` 중 하나일 수 있습니다. `napi_tsfn_abort`로 설정하면 `napi_call_threadsafe_function()`에 대한 추가 호출은 `napi_closing`을 반환하고 더 이상 값을 큐에 넣지 않습니다.

스레드는 `func` 사용을 중지할 때 이 API를 호출해야 합니다. 이 API를 호출한 후 `func`를 스레드 안전 API에 전달하면 `func`가 소멸될 수 있으므로 정의되지 않은 결과가 발생합니다.

이 API는 `func` 사용을 중지할 스레드에서 호출할 수 있습니다.

### `napi_ref_threadsafe_function` {#napi_ref_threadsafe_function}

**Added in: v10.6.0**

**N-API version: 4**

```C [C]
NAPI_EXTERN napi_status
napi_ref_threadsafe_function(node_api_basic_env env, napi_threadsafe_function func);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] func`: 참조할 스레드 안전 함수입니다.

이 API는 기본 스레드에서 실행되는 이벤트 루프가 `func`가 소멸될 때까지 종료되지 않도록 지정하는 데 사용됩니다. [`uv_ref`](https://docs.libuv.org/en/v1.x/handle#c.uv_ref)와 유사하게 멱등성도 있습니다.

`napi_unref_threadsafe_function`은 스레드 안전 함수를 소멸 가능으로 표시하지 않으며 `napi_ref_threadsafe_function`은 소멸되는 것을 방지하지 않습니다. `napi_acquire_threadsafe_function` 및 `napi_release_threadsafe_function`을 사용하여 이를 수행할 수 있습니다.

이 API는 기본 스레드에서만 호출할 수 있습니다.

### `napi_unref_threadsafe_function` {#napi_unref_threadsafe_function}

**Added in: v10.6.0**

**N-API version: 4**

```C [C]
NAPI_EXTERN napi_status
napi_unref_threadsafe_function(node_api_basic_env env, napi_threadsafe_function func);
```
- `[in] env`: API가 호출되는 환경입니다.
- `[in] func`: 참조 해제할 스레드 안전 함수입니다.

이 API는 기본 스레드에서 실행되는 이벤트 루프가 `func`가 소멸되기 전에 종료될 수 있음을 나타내는 데 사용됩니다. [`uv_unref`](https://docs.libuv.org/en/v1.x/handle#c.uv_unref)와 유사하게 멱등성도 있습니다.

이 API는 기본 스레드에서만 호출할 수 있습니다.


## 기타 유틸리티 {#miscellaneous-utilities}

### `node_api_get_module_file_name` {#node_api_get_module_file_name}

**추가된 버전: v15.9.0, v14.18.0, v12.22.0**

**N-API 버전: 9**

```C [C]
NAPI_EXTERN napi_status
node_api_get_module_file_name(node_api_basic_env env, const char** result);

```
- `[in] env`: API가 호출되는 환경입니다.
- `[out] result`: 애드온이 로드된 위치의 절대 경로를 포함하는 URL입니다. 로컬 파일 시스템의 파일의 경우 `file://`로 시작합니다. 문자열은 null로 끝나고 `env`가 소유하므로 수정하거나 해제해서는 안 됩니다.

애드온 로드 프로세스 중에 애드온의 파일 이름을 설정하지 못하면 `result`는 빈 문자열이 될 수 있습니다.

