---
title: API встраивания Node.js
description: Узнайте, как встроить Node.js в приложения на C/C++, позволяя разработчикам использовать среду выполнения JavaScript Node.js в их нативных приложениях.
head:
  - - meta
    - name: og:title
      content: API встраивания Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Узнайте, как встроить Node.js в приложения на C/C++, позволяя разработчикам использовать среду выполнения JavaScript Node.js в их нативных приложениях.
  - - meta
    - name: twitter:title
      content: API встраивания Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Узнайте, как встроить Node.js в приложения на C/C++, позволяя разработчикам использовать среду выполнения JavaScript Node.js в их нативных приложениях.
---


# C++ embedder API {#c-embedder-api}

Node.js предоставляет ряд C++ API, которые можно использовать для выполнения JavaScript в среде Node.js из другого C++ программного обеспечения.

Документацию по этим API можно найти в [src/node.h](https://github.com/nodejs/node/blob/HEAD/src/node.h) в исходном коде Node.js. В дополнение к API, предоставляемым Node.js, некоторые необходимые концепции предоставляются API V8 embedder.

Поскольку использование Node.js в качестве встроенной библиотеки отличается от написания кода, который выполняется Node.js, критические изменения не соответствуют типичной [политике устаревания](/ru/nodejs/api/deprecations) Node.js и могут происходить при каждом мажорном semver-релизе без предварительного предупреждения.

## Пример встроенного приложения {#example-embedding-application}

В следующих разделах будет представлен обзор того, как использовать эти API для создания приложения с нуля, которое будет выполнять эквивалент `node -e \<code\>`, т. е. которое будет брать фрагмент JavaScript и запускать его в среде, специфичной для Node.js.

Полный код можно найти [в исходном коде Node.js](https://github.com/nodejs/node/blob/HEAD/test/embedding/embedtest.cc).

### Настройка состояния для каждого процесса {#setting-up-a-per-process-state}

Node.js требует некоторого управления состоянием для каждого процесса для запуска:

- Разбор аргументов для [параметров CLI](/ru/nodejs/api/cli) Node.js,
- Требования V8 для каждого процесса, такие как экземпляр `v8::Platform`.

В следующем примере показано, как их можно настроить. Некоторые имена классов взяты из C++ пространств имен `node` и `v8` соответственно.

```C++ [C++]
int main(int argc, char** argv) {
  argv = uv_setup_args(argc, argv);
  std::vector<std::string> args(argv, argv + argc);
  // Parse Node.js CLI options, and print any errors that have occurred while
  // trying to parse them.
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

  // Create a v8::Platform instance. `MultiIsolatePlatform::Create()` is a way
  // to create a v8::Platform instance that Node.js can use when creating
  // Worker threads. When no `MultiIsolatePlatform` instance is present,
  // Worker threads are disabled.
  std::unique_ptr<MultiIsolatePlatform> platform =
      MultiIsolatePlatform::Create(4);
  V8::InitializePlatform(platform.get());
  V8::Initialize();

  // See below for the contents of this function.
  int ret = RunNodeInstance(
      platform.get(), result->args(), result->exec_args());

  V8::Dispose();
  V8::DisposePlatform();

  node::TearDownOncePerProcess();
  return ret;
}
```

### Настройка состояния для каждого экземпляра {#setting-up-a-per-instance-state}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Добавлены утилиты `CommonEnvironmentSetup` и `SpinEventLoop`. |
:::

Node.js имеет концепцию "экземпляра Node.js", который обычно называется `node::Environment`. Каждый `node::Environment` связан с:

- Ровно одним `v8::Isolate`, т.е. одним экземпляром JS Engine,
- Ровно одним `uv_loop_t`, т.е. одним циклом событий,
- Несколькими `v8::Context`s, но ровно одним главным `v8::Context`, и
- Одним экземпляром `node::IsolateData`, который содержит информацию, которая может быть разделена между несколькими `node::Environment`s. Встраивающая сторона должна убедиться, что `node::IsolateData` используется совместно только между `node::Environment`s, которые используют один и тот же `v8::Isolate`, Node.js не выполняет эту проверку.

Для настройки `v8::Isolate` необходимо предоставить `v8::ArrayBuffer::Allocator`. Одним из возможных вариантов является аллокатор Node.js по умолчанию, который можно создать с помощью `node::ArrayBufferAllocator::Create()`. Использование аллокатора Node.js позволяет немного оптимизировать производительность, когда аддоны используют C++ API `Buffer` Node.js, и требуется для отслеживания памяти `ArrayBuffer` в [`process.memoryUsage()`](/ru/nodejs/api/process#processmemoryusage).

Кроме того, каждый `v8::Isolate`, который используется для экземпляра Node.js, должен быть зарегистрирован и отменен регистрацию в экземпляре `MultiIsolatePlatform`, если он используется, чтобы платформа знала, какой цикл событий использовать для задач, запланированных `v8::Isolate`.

Вспомогательная функция `node::NewIsolate()` создает `v8::Isolate`, настраивает его с помощью некоторых хуков, специфичных для Node.js (например, обработчик ошибок Node.js), и автоматически регистрирует его на платформе.

```C++ [C++]
int RunNodeInstance(MultiIsolatePlatform* platform,
                    const std::vector<std::string>& args,
                    const std::vector<std::string>& exec_args) {
  int exit_code = 0;

  // Настройка цикла событий libuv, v8::Isolate и Node.js Environment.
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
    // v8::Context необходимо ввести, когда вызываются node::CreateEnvironment() и
    // node::LoadEnvironment().
    Context::Scope context_scope(setup->context());

    // Настройка экземпляра Node.js для выполнения и запуск кода внутри него.
    // Существует также вариант, который принимает обратный вызов и предоставляет ему
    // объекты `require` и `process`, чтобы он мог вручную компилировать
    // и запускать скрипты по мере необходимости.
    // Функция `require` внутри этого скрипта *не* обращается к файловой системе,
    // и может загружать только встроенные модули Node.js.
    // `module.createRequire()` используется для создания одного, который способен
    // загружать файлы с диска и использует стандартный загрузчик файлов CommonJS
    // вместо предназначенной только для внутреннего использования функции `require`.
    MaybeLocal<Value> loadenv_ret = node::LoadEnvironment(
        env,
        "const publicRequire ="
        "  require('node:module').createRequire(process.cwd() + '/');"
        "globalThis.require = publicRequire;"
        "require('node:vm').runInThisContext(process.argv[1]);");

    if (loadenv_ret.IsEmpty())  // Произошло исключение JS.
      return 1;

    exit_code = node::SpinEventLoop(env).FromMaybe(1);

    // node::Stop() можно использовать для явной остановки цикла событий и предотвращения
    // дальнейшего выполнения JavaScript. Его можно вызвать из любого потока,
    // и он будет действовать как worker.terminate(), если его вызвать из другого потока.
    node::Stop(env);
  }

  return exit_code;
}
```
