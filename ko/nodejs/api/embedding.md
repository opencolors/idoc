---
title: Node.js 임베딩 API
description: Node.js를 C/C++ 애플리케이션에 임베딩하는 방법을 배워, 개발자가 네이티브 애플리케이션 내에서 Node.js의 JavaScript 런타임을 활용할 수 있게 합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 임베딩 API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js를 C/C++ 애플리케이션에 임베딩하는 방법을 배워, 개발자가 네이티브 애플리케이션 내에서 Node.js의 JavaScript 런타임을 활용할 수 있게 합니다.
  - - meta
    - name: twitter:title
      content: Node.js 임베딩 API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js를 C/C++ 애플리케이션에 임베딩하는 방법을 배워, 개발자가 네이티브 애플리케이션 내에서 Node.js의 JavaScript 런타임을 활용할 수 있게 합니다.
---


# C++ 임베더 API {#c-embedder-api}

Node.js는 다른 C++ 소프트웨어에서 Node.js 환경에서 JavaScript를 실행하는 데 사용할 수 있는 여러 C++ API를 제공합니다.

이러한 API에 대한 설명서는 Node.js 소스 트리의 [src/node.h](https://github.com/nodejs/node/blob/HEAD/src/node.h)에서 찾을 수 있습니다. Node.js에서 노출하는 API 외에도 V8 임베더 API에서 몇 가지 필수 개념을 제공합니다.

Node.js를 임베디드 라이브러리로 사용하는 것은 Node.js에서 실행되는 코드를 작성하는 것과 다르기 때문에 주요 변경 사항은 일반적인 Node.js [더 이상 사용되지 않는 정책](/ko/nodejs/api/deprecations)을 따르지 않으며 사전 경고 없이 각 semver 주요 릴리스에서 발생할 수 있습니다.

## 예제 임베딩 애플리케이션 {#example-embedding-application}

다음 섹션에서는 이러한 API를 사용하여 `node -e \<code\>`와 동일한 기능을 수행하는 애플리케이션을 처음부터 만드는 방법, 즉 JavaScript 조각을 가져와 Node.js 특정 환경에서 실행하는 방법에 대한 개요를 제공합니다.

전체 코드는 [Node.js 소스 트리](https://github.com/nodejs/node/blob/HEAD/test/embedding/embedtest.cc)에서 찾을 수 있습니다.

### 프로세스별 상태 설정 {#setting-up-a-per-process-state}

Node.js는 실행을 위해 일부 프로세스별 상태 관리가 필요합니다.

- Node.js [CLI 옵션](/ko/nodejs/api/cli)에 대한 인수 구문 분석,
- `v8::Platform` 인스턴스와 같은 V8 프로세스별 요구 사항.

다음 예제는 이러한 항목을 설정하는 방법을 보여줍니다. 일부 클래스 이름은 각각 `node` 및 `v8` C++ 네임스페이스에서 가져온 것입니다.

```C++ [C++]
int main(int argc, char** argv) {
  argv = uv_setup_args(argc, argv);
  std::vector<std::string> args(argv, argv + argc);
  // Node.js CLI 옵션을 구문 분석하고 구문 분석하는 동안 발생한 오류를 인쇄합니다.
  std::unique_ptr<node::InitializationResult> result =
      node::InitializeOncePerProcess(args, {
        node::ProcessInitializationFlags::kNoInitializeV8,
        node::ProcessInitializationFlags::kNoInitializeNodeV8Platform
      });

  for (const std::string& error : result->errors())
    fprintf(stderr, "%s: %s\n", args[0].c_str(), error.c_str());
  if (result->early_return() != 0) {
    return result->exit_code();
  }

  // v8::Platform 인스턴스를 만듭니다. `MultiIsolatePlatform::Create()`는 Node.js가
  // Worker 스레드를 만들 때 사용할 수 있는 v8::Platform 인스턴스를 만드는 방법입니다.
  // `MultiIsolatePlatform` 인스턴스가 없으면 Worker 스레드가 비활성화됩니다.
  std::unique_ptr<MultiIsolatePlatform> platform =
      MultiIsolatePlatform::Create(4);
  V8::InitializePlatform(platform.get());
  V8::Initialize();

  // 이 함수의 내용은 아래를 참조하십시오.
  int ret = RunNodeInstance(
      platform.get(), result->args(), result->exec_args());

  V8::Dispose();
  V8::DisposePlatform();

  node::TearDownOncePerProcess();
  return ret;
}
```

### 인스턴스별 상태 설정 {#setting-up-a-per-instance-state}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | `CommonEnvironmentSetup` 및 `SpinEventLoop` 유틸리티가 추가되었습니다. |
:::

Node.js에는 일반적으로 `node::Environment`라고 하는 "Node.js 인스턴스" 개념이 있습니다. 각 `node::Environment`는 다음 항목과 연결됩니다.

- 정확히 하나의 `v8::Isolate`, 즉 하나의 JS 엔진 인스턴스,
- 정확히 하나의 `uv_loop_t`, 즉 하나의 이벤트 루프,
- 여러 개의 `v8::Context`이지만 정확히 하나의 메인 `v8::Context`, 그리고
- 여러 개의 `node::Environment`에서 공유할 수 있는 정보가 포함된 하나의 `node::IsolateData` 인스턴스. 포함자는 `node::IsolateData`가 동일한 `v8::Isolate`를 사용하는 `node::Environment`에서만 공유되도록 해야 합니다. Node.js는 이 검사를 수행하지 않습니다.

`v8::Isolate`를 설정하려면 `v8::ArrayBuffer::Allocator`를 제공해야 합니다. 가능한 선택 사항 중 하나는 `node::ArrayBufferAllocator::Create()`를 통해 생성할 수 있는 기본 Node.js 할당자입니다. Node.js 할당자를 사용하면 애드온이 Node.js C++ `Buffer` API를 사용할 때 약간의 성능 최적화가 가능하며, [`process.memoryUsage()`](/ko/nodejs/api/process#processmemoryusage)에서 `ArrayBuffer` 메모리를 추적하는 데 필요합니다.

또한 Node.js 인스턴스에 사용되는 각 `v8::Isolate`는 플랫폼이 `v8::Isolate`에서 예약한 작업에 사용할 이벤트 루프를 알 수 있도록 `MultiIsolatePlatform` 인스턴스에 등록 및 등록 취소해야 합니다(사용 중인 경우).

`node::NewIsolate()` 도우미 함수는 `v8::Isolate`를 만들고 일부 Node.js 관련 후크(예: Node.js 오류 처리기)를 사용하여 설정하고 플랫폼에 자동으로 등록합니다.

```C++ [C++]
int RunNodeInstance(MultiIsolatePlatform* platform,
                    const std::vector<std::string>& args,
                    const std::vector<std::string>& exec_args) {
  int exit_code = 0;

  // libuv 이벤트 루프, v8::Isolate 및 Node.js 환경을 설정합니다.
  std::vector<std::string> errors;
  std::unique_ptr<CommonEnvironmentSetup> setup =
      CommonEnvironmentSetup::Create(platform, &errors, args, exec_args);
  if (!setup) {
    for (const std::string& err : errors)
      fprintf(stderr, "%s: %s\n", args[0].c_str(), err.c_str());
    return 1;
  }

  Isolate* isolate = setup->isolate();
  Environment* env = setup->env();

  {
    Locker locker(isolate);
    Isolate::Scope isolate_scope(isolate);
    HandleScope handle_scope(isolate);
    // node::CreateEnvironment() 및
    // node::LoadEnvironment()를 호출할 때 v8::Context를 입력해야 합니다.
    Context::Scope context_scope(setup->context());

    // 실행을 위해 Node.js 인스턴스를 설정하고 그 안에서 코드를 실행합니다.
    // 또한 콜백을 가져와서 `require` 및 `process` 개체를 제공하여 필요한 경우 수동으로 컴파일하고 스크립트를 실행할 수 있는 변형도 있습니다.
    // 이 스크립트 내부의 `require` 함수는 파일 시스템에 액세스하지 *않으며* 내장된 Node.js 모듈만 로드할 수 있습니다.
    // `module.createRequire()`는 디스크에서 파일을 로드할 수 있고 내부 전용 `require` 함수 대신 표준 CommonJS 파일 로더를 사용하는 파일을 만들기 위해 사용됩니다.
    MaybeLocal<Value> loadenv_ret = node::LoadEnvironment(
        env,
        "const publicRequire ="
        "  require('node:module').createRequire(process.cwd() + '/');"
        "globalThis.require = publicRequire;"
        "require('node:vm').runInThisContext(process.argv[1]);");

    if (loadenv_ret.IsEmpty())  // JS 예외가 발생했습니다.
      return 1;

    exit_code = node::SpinEventLoop(env).FromMaybe(1);

    // node::Stop()을 사용하여 이벤트 루프를 명시적으로 중지하고 추가 JavaScript가 실행되지 않도록 할 수 있습니다. 모든 스레드에서 호출할 수 있으며 다른 스레드에서 호출된 경우 worker.terminate()처럼 작동합니다.
    node::Stop(env);
  }

  return exit_code;
}
```
