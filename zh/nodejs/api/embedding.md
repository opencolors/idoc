---
title: Node.js 嵌入式 API
description: 了解如何将 Node.js 嵌入到 C/C++ 应用程序中，使开发者能够在其原生应用程序中利用 Node.js 的 JavaScript 运行时。
head:
  - - meta
    - name: og:title
      content: Node.js 嵌入式 API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解如何将 Node.js 嵌入到 C/C++ 应用程序中，使开发者能够在其原生应用程序中利用 Node.js 的 JavaScript 运行时。
  - - meta
    - name: twitter:title
      content: Node.js 嵌入式 API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解如何将 Node.js 嵌入到 C/C++ 应用程序中，使开发者能够在其原生应用程序中利用 Node.js 的 JavaScript 运行时。
---


# C++ 嵌入器 API {#c-embedder-api}

Node.js 提供了许多 C++ API，可以用于从其他 C++ 软件在 Node.js 环境中执行 JavaScript。

这些 API 的文档可以在 Node.js 源代码树的 [src/node.h](https://github.com/nodejs/node/blob/HEAD/src/node.h) 中找到。除了 Node.js 公开的 API 之外，V8 嵌入器 API 还提供了一些必需的概念。

因为将 Node.js 用作嵌入式库与编写由 Node.js 执行的代码不同，所以破坏性更改不遵循典型的 Node.js [弃用策略](/zh/nodejs/api/deprecations)，并且可能在每个 semver-major 版本中发生，恕不另行通知。

## 示例嵌入应用程序 {#example-embedding-application}

以下各节将概述如何使用这些 API 从头开始创建一个应用程序，该应用程序将执行与 `node -e \<code\>` 等效的操作，即获取一段 JavaScript 并在特定于 Node.js 的环境中运行它。

完整的代码可以在 [Node.js 源代码树](https://github.com/nodejs/node/blob/HEAD/test/embedding/embedtest.cc) 中找到。

### 设置每个进程的状态 {#setting-up-a-per-process-state}

Node.js 需要一些每个进程的状态管理才能运行：

- Node.js [CLI 选项](/zh/nodejs/api/cli) 的参数解析，
- V8 每个进程的要求，例如 `v8::Platform` 实例。

以下示例显示了如何设置这些内容。一些类名分别来自 `node` 和 `v8` C++ 命名空间。

```C++ [C++]
int main(int argc, char** argv) {
  argv = uv_setup_args(argc, argv);
  std::vector<std::string> args(argv, argv + argc);
  // 解析 Node.js CLI 选项，并打印尝试解析它们时发生的任何错误。
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

  // 创建一个 v8::Platform 实例。`MultiIsolatePlatform::Create()` 是一种创建
  // Node.js 创建 Worker 线程时可以使用的 v8::Platform 实例的方法。
  // 当不存在 `MultiIsolatePlatform` 实例时，Worker 线程将被禁用。
  std::unique_ptr<MultiIsolatePlatform> platform =
      MultiIsolatePlatform::Create(4);
  V8::InitializePlatform(platform.get());
  V8::Initialize();

  // 有关此函数的内容，请参见下文。
  int ret = RunNodeInstance(
      platform.get(), result->args(), result->exec_args());

  V8::Dispose();
  V8::DisposePlatform();

  node::TearDownOncePerProcess();
  return ret;
}
```

### 设置每个实例的状态 {#setting-up-a-per-instance-state}

::: info [历史记录]
| 版本 | 变更 |
|---|---|
| v15.0.0 | 添加了 `CommonEnvironmentSetup` 和 `SpinEventLoop` 实用程序。 |
:::

Node.js 有一个 “Node.js 实例” 的概念，通常被称为 `node::Environment`。 每个 `node::Environment` 都与以下内容关联：

- 恰好一个 `v8::Isolate`，即一个 JS 引擎实例，
- 恰好一个 `uv_loop_t`，即一个事件循环，
- 多个 `v8::Context`，但恰好一个主要的 `v8::Context`，以及
- 一个 `node::IsolateData` 实例，其中包含可以由多个 `node::Environment` 共享的信息。 嵌入器应确保 `node::IsolateData` 仅在使用相同 `v8::Isolate` 的 `node::Environment` 之间共享，Node.js 不执行此检查。

为了设置 `v8::Isolate`，需要提供一个 `v8::ArrayBuffer::Allocator`。 一种可能的选择是默认的 Node.js 分配器，可以通过 `node::ArrayBufferAllocator::Create()` 创建。 当插件使用 Node.js C++ `Buffer` API 时，使用 Node.js 分配器可以进行小的性能优化，并且需要在 [`process.memoryUsage()`](/zh/nodejs/api/process#processmemoryusage) 中跟踪 `ArrayBuffer` 内存。

此外，如果正在使用 `MultiIsolatePlatform` 实例，则每个用于 Node.js 实例的 `v8::Isolate` 都需要向其注册和取消注册，以便平台知道哪个事件循环用于由 `v8::Isolate` 调度的任务。

`node::NewIsolate()` 辅助函数创建一个 `v8::Isolate`，使用一些 Node.js 特定的钩子（例如 Node.js 错误处理程序）对其进行设置，并自动将其注册到平台。

```C++ [C++]
int RunNodeInstance(MultiIsolatePlatform* platform,
                    const std::vector<std::string>& args,
                    const std::vector<std::string>& exec_args) {
  int exit_code = 0;

  // 设置一个 libuv 事件循环，v8::Isolate 和 Node.js Environment。
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
    // 当调用 node::CreateEnvironment() 和
    // node::LoadEnvironment() 时，需要进入 v8::Context。
    Context::Scope context_scope(setup->context());

    // 设置 Node.js 实例以供执行，并在其中运行代码。
    // 还有一个变体，它接受一个回调并为其提供
    // `require` 和 `process` 对象，以便它可以手动编译
    // 并根据需要运行脚本。
    // 此脚本中的 `require` 函数*不*访问文件
    // 系统，只能加载内置的 Node.js 模块。
    // `module.createRequire()` 用于创建一个能够
    // 从磁盘加载文件的实例，并使用标准的 CommonJS 文件加载器
    // 而不是仅供内部使用的 `require` 函数。
    MaybeLocal<Value> loadenv_ret = node::LoadEnvironment(
        env,
        "const publicRequire ="
        "  require('node:module').createRequire(process.cwd() + '/');"
        "globalThis.require = publicRequire;"
        "require('node:vm').runInThisContext(process.argv[1]);");

    if (loadenv_ret.IsEmpty())  // 存在 JS 异常。
      return 1;

    exit_code = node::SpinEventLoop(env).FromMaybe(1);

    // node::Stop() 可用于显式停止事件循环并阻止
    // 进一步的 JavaScript 运行。 可以从任何线程调用它，
    // 如果从另一个线程调用，它的行为类似于 worker.terminate()。
    node::Stop(env);
  }

  return exit_code;
}
```
