---
title: Node.js 애드온
description: C++를 사용하여 Node.js 애플리케이션의 기능을 확장하는 Node.js 애드온을 만드는 방법을 배웁니다. 예제와 API 참조 포함.
head:
  - - meta
    - name: og:title
      content: Node.js 애드온 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: C++를 사용하여 Node.js 애플리케이션의 기능을 확장하는 Node.js 애드온을 만드는 방법을 배웁니다. 예제와 API 참조 포함.
  - - meta
    - name: twitter:title
      content: Node.js 애드온 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: C++를 사용하여 Node.js 애플리케이션의 기능을 확장하는 Node.js 애드온을 만드는 방법을 배웁니다. 예제와 API 참조 포함.
---


# C++ 애드온 {#c-addons}

*애드온*은 C++로 작성된 동적 링크 공유 객체입니다. [`require()`](/ko/nodejs/api/modules#requireid) 함수는 애드온을 일반적인 Node.js 모듈로 로드할 수 있습니다. 애드온은 JavaScript와 C/C++ 라이브러리 간의 인터페이스를 제공합니다.

애드온을 구현하는 데는 세 가지 옵션이 있습니다.

- Node-API
- `nan` ([Node.js용 Native Abstractions](https://github.com/nodejs/nan))
- 내부 V8, libuv 및 Node.js 라이브러리를 직접 사용

Node-API에서 노출되지 않는 기능에 직접 액세스해야 할 필요가 없는 한 Node-API를 사용하십시오. Node-API에 대한 자세한 내용은 [Node-API를 사용한 C/C++ 애드온](/ko/nodejs/api/n-api)을 참조하십시오.

Node-API를 사용하지 않는 경우 애드온 구현이 더 복잡해져 여러 구성 요소 및 API에 대한 지식이 필요합니다.

- [V8](https://v8.dev/): Node.js가 JavaScript 구현을 제공하기 위해 사용하는 C++ 라이브러리입니다. 객체 생성, 함수 호출 등을 위한 메커니즘을 제공합니다. V8 API는 주로 `v8.h` 헤더 파일(Node.js 소스 트리의 `deps/v8/include/v8.h`)에 문서화되어 있으며 [온라인](https://v8docs.nodesource.com/)에서도 사용할 수 있습니다.
- [libuv](https://github.com/libuv/libuv): Node.js 이벤트 루프, 작업자 스레드 및 플랫폼의 모든 비동기 동작을 구현하는 C 라이브러리입니다. 또한 파일 시스템, 소켓, 타이머 및 시스템 이벤트와 같은 많은 일반적인 시스템 작업에 대해 모든 주요 운영 체제에서 쉽고 POSIX와 유사한 액세스를 제공하는 교차 플랫폼 추상화 라이브러리 역할을 합니다. libuv는 또한 표준 이벤트 루프를 벗어나야 하는 보다 정교한 비동기 애드온을 위해 POSIX 스레드와 유사한 스레딩 추상화를 제공합니다. 애드온 작성자는 I/O 또는 기타 시간이 많이 걸리는 작업으로 인해 이벤트 루프가 차단되는 것을 피해야 합니다. libuv를 통해 비차단 시스템 작업, 작업자 스레드 또는 libuv 스레드의 사용자 지정 사용으로 작업을 오프로드해야 합니다.
- 내부 Node.js 라이브러리: Node.js 자체는 애드온이 사용할 수 있는 C++ API를 내보내며, 가장 중요한 것은 `node::ObjectWrap` 클래스입니다.
- 기타 정적으로 연결된 라이브러리(OpenSSL 포함): 이러한 기타 라이브러리는 Node.js 소스 트리의 `deps/` 디렉토리에 있습니다. libuv, OpenSSL, V8 및 zlib 심볼만 Node.js에서 의도적으로 다시 내보내며 애드온에서 다양한 정도로 사용할 수 있습니다. 자세한 내용은 [Node.js에 포함된 라이브러리에 연결](/ko/nodejs/api/addons#linking-to-libraries-included-with-nodejs)을 참조하십시오.

다음의 모든 예제는 [다운로드](https://github.com/nodejs/node-addon-examples)할 수 있으며 애드온의 시작점으로 사용할 수 있습니다.


## Hello world {#hello-world}

이 "Hello world" 예제는 C++로 작성된 간단한 애드온이며, 다음 JavaScript 코드와 동일합니다.

```js [ESM]
module.exports.hello = () => 'world';
```
먼저 `hello.cc` 파일을 만듭니다.

```C++ [C++]
// hello.cc
#include <node.h>

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::NewStringType;
using v8::Object;
using v8::String;
using v8::Value;

void Method(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(
      isolate, "world", NewStringType::kNormal).ToLocalChecked());
}

void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "hello", Method);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

}  // namespace demo
```
모든 Node.js 애드온은 다음 패턴을 따르는 초기화 함수를 내보내야 합니다.

```C++ [C++]
void Initialize(Local<Object> exports);
NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
```
`NODE_MODULE` 뒤에는 세미콜론이 없습니다. 함수가 아니기 때문입니다( `node.h` 참조).

`module_name`은 최종 바이너리의 파일 이름과 일치해야 합니다( `.node` 접미사 제외).

따라서 `hello.cc` 예제에서 초기화 함수는 `Initialize`이고 애드온 모듈 이름은 `addon`입니다.

`node-gyp`을 사용하여 애드온을 빌드할 때 `NODE_MODULE()`의 첫 번째 매개변수로 매크로 `NODE_GYP_MODULE_NAME`을 사용하면 최종 바이너리 이름이 `NODE_MODULE()`에 전달됩니다.

`NODE_MODULE()`로 정의된 애드온은 여러 컨텍스트 또는 여러 스레드에서 동시에 로드할 수 없습니다.

### 컨텍스트 인식 애드온 {#context-aware-addons}

Node.js 애드온을 여러 컨텍스트에서 여러 번 로드해야 할 수 있는 환경이 있습니다. 예를 들어 [Electron](https://electronjs.org/) 런타임은 단일 프로세스에서 Node.js의 여러 인스턴스를 실행합니다. 각 인스턴스에는 자체 `require()` 캐시가 있으므로 각 인스턴스에는 `require()`를 통해 로드될 때 올바르게 작동하는 네이티브 애드온이 필요합니다. 즉, 애드온은 여러 초기화를 지원해야 합니다.

컨텍스트 인식 애드온은 매크로 `NODE_MODULE_INITIALIZER`를 사용하여 구성할 수 있습니다. 이 매크로는 Node.js가 애드온을 로드할 때 찾을 것으로 예상하는 함수의 이름으로 확장됩니다. 따라서 애드온은 다음 예제와 같이 초기화할 수 있습니다.

```C++ [C++]
using namespace v8;

extern "C" NODE_MODULE_EXPORT void
NODE_MODULE_INITIALIZER(Local<Object> exports,
                        Local<Value> module,
                        Local<Context> context) {
  /* 여기에 애드온 초기화 단계를 수행합니다. */
}
```
또 다른 옵션은 매크로 `NODE_MODULE_INIT()`를 사용하는 것입니다. 이 매크로는 컨텍스트 인식 애드온도 구성합니다. 주어진 애드온 초기화 함수를 중심으로 애드온을 구성하는 데 사용되는 `NODE_MODULE()`와 달리 `NODE_MODULE_INIT()`는 함수 본문이 뒤따르는 초기화 함수에 대한 선언 역할을 합니다.

다음 세 가지 변수는 `NODE_MODULE_INIT()` 호출 뒤에 오는 함수 본문 내에서 사용할 수 있습니다.

- `Local\<Object\> exports`,
- `Local\<Value\> module`, 그리고
- `Local\<Context\> context`

컨텍스트 인식 애드온을 빌드하려면 안정성과 정확성을 보장하기 위해 전역 정적 데이터를 신중하게 관리해야 합니다. 애드온이 여러 번 로드될 수 있으므로 잠재적으로 다른 스레드에서 로드될 수도 있으므로 애드온에 저장된 모든 전역 정적 데이터는 적절하게 보호되어야 하며 JavaScript 객체에 대한 영구 참조를 포함해서는 안 됩니다. 그 이유는 JavaScript 객체는 하나의 컨텍스트에서만 유효하며 잘못된 컨텍스트 또는 생성된 스레드와 다른 스레드에서 액세스하면 충돌이 발생할 수 있기 때문입니다.

컨텍스트 인식 애드온은 다음 단계를 수행하여 전역 정적 데이터를 피하도록 구조화할 수 있습니다.

- 애드온 인스턴스별 데이터를 보유하고 다음 형식의 정적 멤버를 갖는 클래스를 정의합니다.
- 애드온 초기화 프로그램에서 이 클래스의 인스턴스를 힙에 할당합니다. 이는 `new` 키워드를 사용하여 수행할 수 있습니다.
- `node::AddEnvironmentCleanupHook()`을 호출하여 위에서 생성한 인스턴스와 `DeleteInstance()`에 대한 포인터를 전달합니다. 이렇게 하면 환경이 해체될 때 인스턴스가 삭제됩니다.
- 클래스의 인스턴스를 `v8::External`에 저장하고
- `v8::External`을 `v8::FunctionTemplate::New()` 또는 `v8::Function::New()`를 전달하여 JavaScript에 노출된 모든 메서드에 전달합니다. 이렇게 하면 네이티브 지원 JavaScript 함수가 생성됩니다. `v8::FunctionTemplate::New()` 또는 `v8::Function::New()`의 세 번째 매개변수는 `v8::External`을 허용하고 `v8::FunctionCallbackInfo::Data()` 메서드를 사용하여 네이티브 콜백에서 사용할 수 있도록 합니다.

이렇게 하면 애드온 인스턴스별 데이터가 JavaScript에서 호출할 수 있는 각 바인딩에 도달합니다. 애드온 인스턴스별 데이터는 애드온이 만들 수 있는 모든 비동기 콜백에도 전달되어야 합니다.

다음 예제는 컨텍스트 인식 애드온의 구현을 보여줍니다.

```C++ [C++]
#include <node.h>

using namespace v8;

class AddonData {
 public:
  explicit AddonData(Isolate* isolate):
      call_count(0) {
    // 이 애드온 인스턴스별 데이터가 환경 정리 시 삭제되었는지 확인합니다.
    node::AddEnvironmentCleanupHook(isolate, DeleteInstance, this);
  }

  // 애드온별 데이터.
  int call_count;

  static void DeleteInstance(void* data) {
    delete static_cast<AddonData*>(data);
  }
};

static void Method(const v8::FunctionCallbackInfo<v8::Value>& info) {
  // 애드온 인스턴스별 데이터를 검색합니다.
  AddonData* data =
      reinterpret_cast<AddonData*>(info.Data().As<External>()->Value());
  data->call_count++;
  info.GetReturnValue().Set((double)data->call_count);
}

// 이 애드온을 컨텍스트 인식으로 초기화합니다.
NODE_MODULE_INIT(/* exports, module, context */) {
  Isolate* isolate = context->GetIsolate();

  // 이 애드온 인스턴스에 대한 `AddonData`의 새 인스턴스를 만들고
  // 수명 주기를 Node.js 환경의 수명 주기에 연결합니다.
  AddonData* data = new AddonData(isolate);

  // 데이터를 `v8::External`로 래핑하여
  // 노출하는 메서드에 전달할 수 있습니다.
  Local<External> external = External::New(isolate, data);

  // 메서드 `Method`를 JavaScript에 노출하고 위에서 만든
  // 애드온 인스턴스별 데이터를 `FunctionTemplate` 생성자의 세 번째 매개변수로
  // `external`을 전달하여 수신하는지 확인합니다.
  exports->Set(context,
               String::NewFromUtf8(isolate, "method").ToLocalChecked(),
               FunctionTemplate::New(isolate, Method, external)
                  ->GetFunction(context).ToLocalChecked()).FromJust();
}
```

#### Worker 지원 {#worker-support}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.8.0, v12.19.0 | 정리 후크가 이제 비동기적일 수 있습니다. |
:::

애드온이 메인 스레드 및 Worker 스레드와 같은 여러 Node.js 환경에서 로드되려면 다음 중 하나를 수행해야 합니다.

- Node-API 애드온이거나,
- 위에 설명된 대로 `NODE_MODULE_INIT()`을 사용하여 컨텍스트 인식으로 선언됩니다.

[`Worker`](/ko/nodejs/api/worker_threads#class-worker) 스레드를 지원하려면 애드온이 해당 스레드가 종료될 때 할당했을 수 있는 리소스를 정리해야 합니다. 이는 `AddEnvironmentCleanupHook()` 함수를 사용하여 수행할 수 있습니다.

```C++ [C++]
void AddEnvironmentCleanupHook(v8::Isolate* isolate,
                               void (*fun)(void* arg),
                               void* arg);
```
이 함수는 지정된 Node.js 인스턴스가 종료되기 전에 실행될 후크를 추가합니다. 필요한 경우 이러한 후크는 동일한 서명을 가진 `RemoveEnvironmentCleanupHook()`을 사용하여 실행되기 전에 제거할 수 있습니다. 콜백은 후입선출 순서로 실행됩니다.

필요한 경우 정리 후크가 콜백 함수를 취하는 `AddEnvironmentCleanupHook()` 및 `RemoveEnvironmentCleanupHook()` 오버로드 쌍이 추가로 있습니다. 이는 애드온에 등록된 모든 libuv 핸들과 같은 비동기 리소스를 종료하는 데 사용할 수 있습니다.

다음 `addon.cc`는 `AddEnvironmentCleanupHook`을 사용합니다.

```C++ [C++]
// addon.cc
#include <node.h>
#include <assert.h>
#include <stdlib.h>

using node::AddEnvironmentCleanupHook;
using v8::HandleScope;
using v8::Isolate;
using v8::Local;
using v8::Object;

// 참고: 실제 애플리케이션에서는 정적/전역 데이터에 의존하지 마십시오.
static char cookie[] = "yum yum";
static int cleanup_cb1_called = 0;
static int cleanup_cb2_called = 0;

static void cleanup_cb1(void* arg) {
  Isolate* isolate = static_cast<Isolate*>(arg);
  HandleScope scope(isolate);
  Local<Object> obj = Object::New(isolate);
  assert(!obj.IsEmpty());  // VM이 여전히 활성 상태인지 확인
  assert(obj->IsObject());
  cleanup_cb1_called++;
}

static void cleanup_cb2(void* arg) {
  assert(arg == static_cast<void*>(cookie));
  cleanup_cb2_called++;
}

static void sanity_check(void*) {
  assert(cleanup_cb1_called == 1);
  assert(cleanup_cb2_called == 1);
}

// 이 애드온이 컨텍스트 인식을 하도록 초기화합니다.
NODE_MODULE_INIT(/* exports, module, context */) {
  Isolate* isolate = context->GetIsolate();

  AddEnvironmentCleanupHook(isolate, sanity_check, nullptr);
  AddEnvironmentCleanupHook(isolate, cleanup_cb2, cookie);
  AddEnvironmentCleanupHook(isolate, cleanup_cb1, isolate);
}
```
다음을 실행하여 JavaScript에서 테스트합니다.

```js [ESM]
// test.js
require('./build/Release/addon');
```

### 빌드하기 {#building}

소스 코드가 작성되면, 반드시 컴파일되어 바이너리 `addon.node` 파일로 만들어져야 합니다. 이를 위해, JSON과 유사한 포맷을 사용하여 모듈의 빌드 구성을 설명하는 `binding.gyp` 파일을 프로젝트의 최상위 레벨에 생성하십시오. 이 파일은 Node.js 애드온을 컴파일하기 위해 특별히 작성된 도구인 [node-gyp](https://github.com/nodejs/node-gyp)에 의해 사용됩니다.

```json [JSON]
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "hello.cc" ]
    }
  ]
}
```
`node-gyp` 유틸리티의 한 버전은 Node.js와 함께 `npm`의 일부로 번들되어 배포됩니다. 이 버전은 개발자가 직접 사용할 수 있도록 제공되지 않으며, `npm install` 명령을 사용하여 애드온을 컴파일하고 설치하는 기능을 지원하기 위한 것입니다. `node-gyp`를 직접 사용하려는 개발자는 `npm install -g node-gyp` 명령을 사용하여 설치할 수 있습니다. 플랫폼별 요구 사항을 포함한 자세한 내용은 `node-gyp`의 [설치 지침](https://github.com/nodejs/node-gyp#installation)을 참조하십시오.

`binding.gyp` 파일이 생성되면, `node-gyp configure`를 사용하여 현재 플랫폼에 적합한 프로젝트 빌드 파일을 생성합니다. 그러면 `build/` 디렉토리에 `Makefile` (Unix 플랫폼) 또는 `vcxproj` 파일 (Windows)이 생성됩니다.

다음으로, `node-gyp build` 명령을 호출하여 컴파일된 `addon.node` 파일을 생성합니다. 이 파일은 `build/Release/` 디렉토리에 저장됩니다.

`npm install`을 사용하여 Node.js 애드온을 설치할 때, npm은 자체 번들된 `node-gyp` 버전을 사용하여 동일한 작업 집합을 수행하고, 사용자의 플랫폼에 맞는 컴파일된 버전의 애드온을 즉석에서 생성합니다.

빌드가 완료되면, [`require()`](/ko/nodejs/api/modules#requireid)를 빌드된 `addon.node` 모듈로 지정하여 Node.js 내에서 바이너리 애드온을 사용할 수 있습니다.

```js [ESM]
// hello.js
const addon = require('./build/Release/addon');

console.log(addon.hello());
// 출력: 'world'
```
컴파일된 애드온 바이너리의 정확한 경로는 컴파일 방식에 따라 다를 수 있기 때문에 (예: 때로는 `./build/Debug/`에 있을 수 있음), 애드온은 [bindings](https://github.com/TooTallNate/node-bindings) 패키지를 사용하여 컴파일된 모듈을 로드할 수 있습니다.

`bindings` 패키지 구현은 애드온 모듈을 찾는 데 있어 더 정교하지만, 기본적으로 다음과 유사한 `try…catch` 패턴을 사용합니다.

```js [ESM]
try {
  return require('./build/Release/addon.node');
} catch (err) {
  return require('./build/Debug/addon.node');
}
```

### Node.js에 포함된 라이브러리에 연결하기 {#linking-to-libraries-included-with-nodejs}

Node.js는 V8, libuv, OpenSSL과 같은 정적으로 연결된 라이브러리를 사용합니다. 모든 애드온은 V8에 연결해야 하며 다른 종속성에도 연결할 수 있습니다. 일반적으로 적절한 `#include \<...\>` 구문(예: `#include \<v8.h\>`)을 포함하는 것만큼 간단하며 `node-gyp`는 적절한 헤더를 자동으로 찾습니다. 그러나 몇 가지 주의해야 할 사항이 있습니다.

- `node-gyp`를 실행하면 특정 Node.js 릴리스 버전을 감지하고 전체 소스 tarball 또는 헤더만 다운로드합니다. 전체 소스를 다운로드하면 애드온은 전체 Node.js 종속성 세트에 완전히 액세스할 수 있습니다. 그러나 Node.js 헤더만 다운로드하면 Node.js에서 내보낸 기호만 사용할 수 있습니다.
- `node-gyp`는 로컬 Node.js 소스 이미지를 가리키는 `--nodedir` 플래그를 사용하여 실행할 수 있습니다. 이 옵션을 사용하면 애드온은 전체 종속성 세트에 액세스할 수 있습니다.

### `require()`를 사용하여 애드온 로드하기 {#loading-addons-using-require}

컴파일된 애드온 바이너리의 파일 이름 확장자는 `.node`입니다(`.dll` 또는 `.so`와 반대). [`require()`](/ko/nodejs/api/modules#requireid) 함수는 `.node` 파일 확장자를 가진 파일을 찾고 이를 동적으로 연결된 라이브러리로 초기화하도록 작성되었습니다.

[`require()`](/ko/nodejs/api/modules#requireid)를 호출할 때 `.node` 확장자는 일반적으로 생략할 수 있으며 Node.js는 여전히 애드온을 찾아 초기화합니다. 그러나 한 가지 주의 사항은 Node.js가 먼저 동일한 기본 이름을 공유하는 모듈 또는 JavaScript 파일을 찾아 로드하려고 시도한다는 것입니다. 예를 들어 바이너리 `addon.node`와 동일한 디렉터리에 `addon.js` 파일이 있는 경우 [`require('addon')`](/ko/nodejs/api/modules#requireid)은 `addon.js` 파일에 우선 순위를 부여하고 대신 로드합니다.

## Node.js용 기본 추상화 {#native-abstractions-for-nodejs}

이 문서에 설명된 각 예제는 애드온 구현을 위해 Node.js 및 V8 API를 직접 사용합니다. V8 API는 V8 릴리스마다(그리고 Node.js 주요 릴리스마다) 크게 변경될 수 있으며 변경되었습니다. 각 변경 사항마다 애드온은 계속 작동하기 위해 업데이트하고 다시 컴파일해야 할 수 있습니다. Node.js 릴리스 일정은 이러한 변경 사항의 빈도와 영향을 최소화하도록 설계되었지만 Node.js가 V8 API의 안정성을 보장하기 위해 할 수 있는 일은 거의 없습니다.

[Node.js용 기본 추상화](https://github.com/nodejs/nan)(또는 `nan`)는 애드온 개발자가 V8 및 Node.js의 과거 및 미래 릴리스 간의 호환성을 유지하기 위해 사용할 것을 권장하는 도구 세트를 제공합니다. 사용 방법을 보여주는 `nan` [예제](https://github.com/nodejs/nan/tree/HEAD/examples/)를 참조하십시오.


## Node-API {#node-api}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ko/nodejs/api/documentation#stability-index) [Stability: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

Node-API는 네이티브 애드온을 빌드하기 위한 API입니다. 이는 기본 JavaScript 런타임(예: V8)과 독립적이며 Node.js 자체의 일부로 유지 관리됩니다. 이 API는 Node.js 버전 간에 ABI(Application Binary Interface) 안정성을 유지합니다. 이는 애드온을 기본 JavaScript 엔진의 변경 사항으로부터 보호하고 하나의 버전으로 컴파일된 모듈을 재컴파일 없이 이후 Node.js 버전에서 실행할 수 있도록 하기 위한 것입니다. 애드온은 이 문서에 설명된 것과 동일한 접근 방식/도구(node-gyp 등)를 사용하여 빌드/패키징됩니다. 유일한 차이점은 네이티브 코드에서 사용되는 API 세트입니다. V8 또는 [Native Abstractions for Node.js](https://github.com/nodejs/nan) API를 사용하는 대신 Node-API에서 사용할 수 있는 함수가 사용됩니다.

Node-API에서 제공하는 ABI 안정성의 이점을 활용하는 애드온을 생성하고 유지 관리하려면 특정 [구현 고려 사항](/ko/nodejs/api/n-api#implications-of-abi-stability)이 따릅니다.

위의 "Hello world" 예제에서 Node-API를 사용하려면 `hello.cc`의 내용을 다음으로 바꾸십시오. 다른 모든 지침은 동일하게 유지됩니다.

```C++ [C++]
// Node-API를 사용하는 hello.cc
#include <node_api.h>

namespace demo {

napi_value Method(napi_env env, napi_callback_info args) {
  napi_value greeting;
  napi_status status;

  status = napi_create_string_utf8(env, "world", NAPI_AUTO_LENGTH, &greeting);
  if (status != napi_ok) return nullptr;
  return greeting;
}

napi_value init(napi_env env, napi_value exports) {
  napi_status status;
  napi_value fn;

  status = napi_create_function(env, nullptr, 0, Method, nullptr, &fn);
  if (status != napi_ok) return nullptr;

  status = napi_set_named_property(env, exports, "hello", fn);
  if (status != napi_ok) return nullptr;
  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)

}  // namespace demo
```
사용 가능한 함수와 사용 방법은 [Node-API를 사용한 C/C++ 애드온](/ko/nodejs/api/n-api)에 문서화되어 있습니다.


## 애드온 예제 {#addon-examples}

다음은 개발자가 시작하는 데 도움이 되는 애드온 예제입니다. 이 예제는 V8 API를 사용합니다. 다양한 V8 호출에 대한 도움말은 온라인 [V8 참조](https://v8docs.nodesource.com/)를 참조하고, 핸들, 범위, 함수 템플릿 등 사용되는 여러 개념에 대한 설명은 V8의 [Embedder's Guide](https://v8.dev/docs/embed)를 참조하십시오.

다음은 각 예제에서 사용되는 `binding.gyp` 파일입니다.

```json [JSON]
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "addon.cc" ]
    }
  ]
}
```
`.cc` 파일이 두 개 이상인 경우 `sources` 배열에 추가 파일 이름을 추가하십시오.

```json [JSON]
"sources": ["addon.cc", "myexample.cc"]
```
`binding.gyp` 파일이 준비되면 `node-gyp`을 사용하여 예제 애드온을 구성하고 빌드할 수 있습니다.

```bash [BASH]
node-gyp configure build
```
### 함수 인수 {#function-arguments}

애드온은 일반적으로 Node.js 내에서 실행되는 JavaScript에서 액세스할 수 있는 객체와 함수를 노출합니다. JavaScript에서 함수를 호출하면 입력 인수와 반환 값을 C/C++ 코드로 매핑해야 합니다.

다음 예제는 JavaScript에서 전달된 함수 인수를 읽는 방법과 결과를 반환하는 방법을 보여줍니다.

```C++ [C++]
// addon.cc
#include <node.h>

namespace demo {

using v8::Exception;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

// 이것은 "add" 메서드의 구현입니다.
// 입력 인수는 다음을 사용하여 전달됩니다.
// const FunctionCallbackInfo<Value>& args struct
void Add(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  // 전달된 인수의 수를 확인합니다.
  if (args.Length() < 2) {
    // JavaScript로 다시 전달되는 오류를 발생시킵니다.
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "Wrong number of arguments").ToLocalChecked()));
    return;
  }

  // 인수 유형을 확인합니다.
  if (!args[0]->IsNumber() || !args[1]->IsNumber()) {
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "Wrong arguments").ToLocalChecked()));
    return;
  }

  // 작업을 수행합니다.
  double value =
      args[0].As<Number>()->Value() + args[1].As<Number>()->Value();
  Local<Number> num = Number::New(isolate, value);

  // 반환 값을 설정합니다 (전달된 값을 사용).
  // FunctionCallbackInfo<Value>&)
  args.GetReturnValue().Set(num);
}

void Init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "add", Add);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
컴파일되면 예제 애드온을 Node.js 내에서 요구하고 사용할 수 있습니다.

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

console.log('This should be eight:', addon.add(3, 5));
```

### 콜백 {#callbacks}

애드온 내에서 JavaScript 함수를 C++ 함수로 전달하고 거기서 실행하는 것은 일반적인 관행입니다. 다음 예제는 이러한 콜백을 호출하는 방법을 보여줍니다.

```C++ [C++]
// addon.cc
#include <node.h>

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Null;
using v8::Object;
using v8::String;
using v8::Value;

void RunCallback(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();
  Local<Function> cb = Local<Function>::Cast(args[0]);
  const unsigned argc = 1;
  Local<Value> argv[argc] = {
      String::NewFromUtf8(isolate,
                          "hello world").ToLocalChecked() };
  cb->Call(context, Null(isolate), argc, argv).ToLocalChecked();
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", RunCallback);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
이 예제에서는 전체 `module` 객체를 두 번째 인수로 받는 두 개의 인수를 사용하는 `Init()` 형식을 사용합니다. 이를 통해 애드온은 함수를 `exports`의 속성으로 추가하는 대신 단일 함수로 `exports`를 완전히 덮어쓸 수 있습니다.

테스트하려면 다음 JavaScript를 실행합니다.

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

addon((msg) => {
  console.log(msg);
// Prints: 'hello world'
});
```
이 예제에서는 콜백 함수가 동기적으로 호출됩니다.

### 객체 팩토리 {#object-factory}

애드온은 다음 예제에서 설명한 것처럼 C++ 함수 내에서 새 객체를 만들고 반환할 수 있습니다. 객체가 생성되어 `createObject()`에 전달된 문자열을 에코하는 `msg` 속성과 함께 반환됩니다.

```C++ [C++]
// addon.cc
#include <node.h>

namespace demo {

using v8::Context;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  Local<Object> obj = Object::New(isolate);
  obj->Set(context,
           String::NewFromUtf8(isolate,
                               "msg").ToLocalChecked(),
                               args[0]->ToString(context).ToLocalChecked())
           .FromJust();

  args.GetReturnValue().Set(obj);
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", CreateObject);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
JavaScript에서 테스트하려면:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj1 = addon('hello');
const obj2 = addon('world');
console.log(obj1.msg, obj2.msg);
// Prints: 'hello world'
```

### 함수 팩토리 {#function-factory}

또 다른 일반적인 시나리오는 C++ 함수를 래핑하고 JavaScript로 다시 반환하는 JavaScript 함수를 만드는 것입니다.

```C++ [C++]
// addon.cc
#include <node.h>

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void MyFunction(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(
      isolate, "hello world").ToLocalChecked());
}

void CreateFunction(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  Local<Context> context = isolate->GetCurrentContext();
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, MyFunction);
  Local<Function> fn = tpl->GetFunction(context).ToLocalChecked();

  // 익명으로 만들려면 이 부분을 생략하세요.
  fn->SetName(String::NewFromUtf8(
      isolate, "theFunction").ToLocalChecked());

  args.GetReturnValue().Set(fn);
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", CreateFunction);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
테스트 방법:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const fn = addon();
console.log(fn());
// Prints: 'hello world'
```
### C++ 객체 래핑 {#wrapping-c-objects}

JavaScript `new` 연산자를 사용하여 새 인스턴스를 만들 수 있는 방식으로 C++ 객체/클래스를 래핑할 수도 있습니다.

```C++ [C++]
// addon.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using v8::Local;
using v8::Object;

void InitAll(Local<Object> exports) {
  MyObject::Init(exports);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}  // namespace demo
```
그런 다음 `myobject.h`에서 래퍼 클래스는 `node::ObjectWrap`에서 상속됩니다.

```C++ [C++]
// myobject.h
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class MyObject : public node::ObjectWrap {
 public:
  static void Init(v8::Local<v8::Object> exports);

 private:
  explicit MyObject(double value = 0);
  ~MyObject();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void PlusOne(const v8::FunctionCallbackInfo<v8::Value>& args);

  double value_;
};

}  // namespace demo

#endif
```
`myobject.cc`에서 노출될 다양한 메서드를 구현합니다. 다음 코드에서 메서드 `plusOne()`은 생성자의 프로토타입에 추가하여 노출됩니다.

```C++ [C++]
// myobject.cc
#include "myobject.h"

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::ObjectTemplate;
using v8::String;
using v8::Value;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init(Local<Object> exports) {
  Isolate* isolate = exports->GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  Local<ObjectTemplate> addon_data_tpl = ObjectTemplate::New(isolate);
  addon_data_tpl->SetInternalFieldCount(1);  // MyObject::New()에 대한 1개의 필드
  Local<Object> addon_data =
      addon_data_tpl->NewInstance(context).ToLocalChecked();

  // 생성자 템플릿 준비
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New, addon_data);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  // 프로토타입
  NODE_SET_PROTOTYPE_METHOD(tpl, "plusOne", PlusOne);

  Local<Function> constructor = tpl->GetFunction(context).ToLocalChecked();
  addon_data->SetInternalField(0, constructor);
  exports->Set(context, String::NewFromUtf8(
      isolate, "MyObject").ToLocalChecked(),
      constructor).FromJust();
}

void MyObject::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    // 생성자로 호출됨: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // 일반 함수 `MyObject(...)`로 호출됨, 구성 호출로 변환합니다.
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons =
        args.Data().As<Object>()->GetInternalField(0)
            .As<Value>().As<Function>();
    Local<Object> result =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(result);
  }
}

void MyObject::PlusOne(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  MyObject* obj = ObjectWrap::Unwrap<MyObject>(args.This());
  obj->value_ += 1;

  args.GetReturnValue().Set(Number::New(isolate, obj->value_));
}

}  // namespace demo
```
이 예제를 빌드하려면 `myobject.cc` 파일을 `binding.gyp`에 추가해야 합니다.

```json [JSON]
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [
        "addon.cc",
        "myobject.cc"
      ]
    }
  ]
}
```
다음과 같이 테스트합니다.

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj = new addon.MyObject(10);
console.log(obj.plusOne());
// Prints: 11
console.log(obj.plusOne());
// Prints: 12
console.log(obj.plusOne());
// Prints: 13
```
래퍼 객체에 대한 소멸자는 객체가 가비지 수집될 때 실행됩니다. 소멸자 테스트를 위해 가비지 수집을 강제로 수행할 수 있도록 하는 데 사용할 수 있는 명령줄 플래그가 있습니다. 이러한 플래그는 기본 V8 JavaScript 엔진에서 제공됩니다. 언제든지 변경되거나 제거될 수 있습니다. Node.js 또는 V8에서 문서화되지 않으며 테스트 외부에서는 절대 사용해서는 안 됩니다.

프로세스 또는 작업자 스레드가 종료되는 동안 소멸자는 JS 엔진에서 호출되지 않습니다. 따라서 리소스 누수를 방지하려면 이러한 객체를 추적하고 적절한 파괴를 보장하는 것은 사용자의 책임입니다.


### 래핑된 객체의 팩터리 {#factory-of-wrapped-objects}

또는 JavaScript `new` 연산자를 사용하여 명시적으로 객체 인스턴스를 생성하는 것을 피하기 위해 팩터리 패턴을 사용할 수 있습니다.

```js [ESM]
const obj = addon.createObject();
// 다음 대신:
// const obj = new addon.Object();
```
먼저 `addon.cc`에서 `createObject()` 메서드를 구현합니다.

```C++ [C++]
// addon.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  MyObject::NewInstance(args);
}

void InitAll(Local<Object> exports, Local<Object> module) {
  MyObject::Init(exports->GetIsolate());

  NODE_SET_METHOD(module, "exports", CreateObject);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}  // namespace demo
```
`myobject.h`에서 정적 메서드 `NewInstance()`가 객체 인스턴스화를 처리하기 위해 추가되었습니다. 이 메서드는 JavaScript에서 `new`를 사용하는 것을 대체합니다.

```C++ [C++]
// myobject.h
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class MyObject : public node::ObjectWrap {
 public:
  static void Init(v8::Isolate* isolate);
  static void NewInstance(const v8::FunctionCallbackInfo<v8::Value>& args);

 private:
  explicit MyObject(double value = 0);
  ~MyObject();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void PlusOne(const v8::FunctionCallbackInfo<v8::Value>& args);
  static v8::Global<v8::Function> constructor;
  double value_;
};

}  // namespace demo

#endif
```
`myobject.cc`의 구현은 이전 예제와 유사합니다.

```C++ [C++]
// myobject.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using node::AddEnvironmentCleanupHook;
using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Global;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

// Warning! This is not thread-safe, this addon cannot be used for worker
// threads.
Global<Function> MyObject::constructor;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init(Isolate* isolate) {
  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  // Prototype
  NODE_SET_PROTOTYPE_METHOD(tpl, "plusOne", PlusOne);

  Local<Context> context = isolate->GetCurrentContext();
  constructor.Reset(isolate, tpl->GetFunction(context).ToLocalChecked());

  AddEnvironmentCleanupHook(isolate, [](void*) {
    constructor.Reset();
  }, nullptr);
}

void MyObject::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // Invoked as plain function `MyObject(...)`, turn into construct call.
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons = Local<Function>::New(isolate, constructor);
    Local<Object> instance =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(instance);
  }
}

void MyObject::NewInstance(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  const unsigned argc = 1;
  Local<Value> argv[argc] = { args[0] };
  Local<Function> cons = Local<Function>::New(isolate, constructor);
  Local<Context> context = isolate->GetCurrentContext();
  Local<Object> instance =
      cons->NewInstance(context, argc, argv).ToLocalChecked();

  args.GetReturnValue().Set(instance);
}

void MyObject::PlusOne(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  MyObject* obj = ObjectWrap::Unwrap<MyObject>(args.This());
  obj->value_ += 1;

  args.GetReturnValue().Set(Number::New(isolate, obj->value_));
}

}  // namespace demo
```
다시 말하지만, 이 예제를 빌드하려면 `myobject.cc` 파일을 `binding.gyp`에 추가해야 합니다.

```json [JSON]
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [
        "addon.cc",
        "myobject.cc"
      ]
    }
  ]
}
```
다음을 사용하여 테스트합니다.

```js [ESM]
// test.js
const createObject = require('./build/Release/addon');

const obj = createObject(10);
console.log(obj.plusOne());
// Prints: 11
console.log(obj.plusOne());
// Prints: 12
console.log(obj.plusOne());
// Prints: 13

const obj2 = createObject(20);
console.log(obj2.plusOne());
// Prints: 21
console.log(obj2.plusOne());
// Prints: 22
console.log(obj2.plusOne());
// Prints: 23
```

### 래핑된 객체 전달하기 {#passing-wrapped-objects-around}

C++ 객체를 래핑하고 반환하는 것 외에도 Node.js 도우미 함수 `node::ObjectWrap::Unwrap`으로 래핑을 해제하여 래핑된 객체를 전달할 수 있습니다. 다음 예제는 두 개의 `MyObject` 객체를 입력 인수로 사용할 수 있는 `add()` 함수를 보여줍니다.

```C++ [C++]
// addon.cc
#include <node.h>
#include <node_object_wrap.h>
#include "myobject.h"

namespace demo {

using v8::Context;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  MyObject::NewInstance(args);
}

void Add(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  MyObject* obj1 = node::ObjectWrap::Unwrap<MyObject>(
      args[0]->ToObject(context).ToLocalChecked());
  MyObject* obj2 = node::ObjectWrap::Unwrap<MyObject>(
      args[1]->ToObject(context).ToLocalChecked());

  double sum = obj1->value() + obj2->value();
  args.GetReturnValue().Set(Number::New(isolate, sum));
}

void InitAll(Local<Object> exports) {
  MyObject::Init(exports->GetIsolate());

  NODE_SET_METHOD(exports, "createObject", CreateObject);
  NODE_SET_METHOD(exports, "add", Add);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}  // namespace demo
```
`myobject.h`에서 객체 래핑 해제 후 개인 값에 접근할 수 있도록 새로운 public 메서드가 추가되었습니다.

```C++ [C++]
// myobject.h
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class MyObject : public node::ObjectWrap {
 public:
  static void Init(v8::Isolate* isolate);
  static void NewInstance(const v8::FunctionCallbackInfo<v8::Value>& args);
  inline double value() const { return value_; }

 private:
  explicit MyObject(double value = 0);
  ~MyObject();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static v8::Global<v8::Function> constructor;
  double value_;
};

}  // namespace demo

#endif
```
`myobject.cc`의 구현은 이전 버전과 유사하게 유지됩니다.

```C++ [C++]
// myobject.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using node::AddEnvironmentCleanupHook;
using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Global;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

// Warning! This is not thread-safe, this addon cannot be used for worker
// threads.
Global<Function> MyObject::constructor;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init(Isolate* isolate) {
  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  Local<Context> context = isolate->GetCurrentContext();
  constructor.Reset(isolate, tpl->GetFunction(context).ToLocalChecked());

  AddEnvironmentCleanupHook(isolate, [](void*) {
    constructor.Reset();
  }, nullptr);
}

void MyObject::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // Invoked as plain function `MyObject(...)`, turn into construct call.
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons = Local<Function>::New(isolate, constructor);
    Local<Object> instance =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(instance);
  }
}

void MyObject::NewInstance(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  const unsigned argc = 1;
  Local<Value> argv[argc] = { args[0] };
  Local<Function> cons = Local<Function>::New(isolate, constructor);
  Local<Context> context = isolate->GetCurrentContext();
  Local<Object> instance =
      cons->NewInstance(context, argc, argv).ToLocalChecked();

  args.GetReturnValue().Set(instance);
}

}  // namespace demo
```
다음을 사용하여 테스트합니다.

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj1 = addon.createObject(10);
const obj2 = addon.createObject(20);
const result = addon.add(obj1, obj2);

console.log(result);
// Prints: 30
```
