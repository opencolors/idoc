---
title: Node.js 埋め込みAPI
description: Node.jsをC/C++アプリケーションに埋め込む方法を学び、開発者がネイティブアプリケーション内でNode.jsのJavaScriptランタイムを活用できるようにします。
head:
  - - meta
    - name: og:title
      content: Node.js 埋め込みAPI | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsをC/C++アプリケーションに埋め込む方法を学び、開発者がネイティブアプリケーション内でNode.jsのJavaScriptランタイムを活用できるようにします。
  - - meta
    - name: twitter:title
      content: Node.js 埋め込みAPI | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsをC/C++アプリケーションに埋め込む方法を学び、開発者がネイティブアプリケーション内でNode.jsのJavaScriptランタイムを活用できるようにします。
---


# C++ エンベッダー API {#c-embedder-api}

Node.js は、他の C++ ソフトウェアから Node.js 環境で JavaScript を実行するために使用できる多数の C++ API を提供しています。

これらの API のドキュメントは、Node.js のソースツリーの [src/node.h](https://github.com/nodejs/node/blob/HEAD/src/node.h) にあります。Node.js によって公開されている API に加えて、いくつかの必要な概念は V8 エンベッダー API によって提供されます。

Node.js を埋め込みライブラリとして使用することは、Node.js によって実行されるコードを記述することとは異なるため、重大な変更は通常の Node.js の [非推奨ポリシー](/ja/nodejs/api/deprecations) に従わず、事前の警告なしにセマンティックバージョンのメジャーリリースごとに行われる可能性があります。

## 埋め込みアプリケーションの例 {#example-embedding-application}

以下のセクションでは、これらの API を使用して、`node -e \<code\>` と同等のアプリケーション、つまり JavaScript の一部を受け取り、Node.js 固有の環境で実行するアプリケーションを最初から作成する方法の概要を説明します。

完全なコードは、[Node.js のソースツリー](https://github.com/nodejs/node/blob/HEAD/test/embedding/embedtest.cc) にあります。

### プロセスごとの状態の設定 {#setting-up-a-per-process-state}

Node.js を実行するには、プロセスごとの状態管理が必要です。

- Node.js の [CLI オプション](/ja/nodejs/api/cli) の引数解析
- `v8::Platform` インスタンスなど、V8 のプロセスごとの要件

次の例は、これらをどのように設定できるかを示しています。いくつかのクラス名は、それぞれ `node` と `v8` の C++ 名前空間からのものです。

```C++ [C++]
int main(int argc, char** argv) {
  argv = uv_setup_args(argc, argv);
  std::vector<std::string> args(argv, argv + argc);
  // Node.js の CLI オプションを解析し、解析中に発生したエラーを出力します。
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

  // v8::Platform インスタンスを作成します。`MultiIsolatePlatform::Create()` は、
  // Node.js が Worker スレッドを作成するときに使用できる v8::Platform インスタンスを作成する方法です。
  // `MultiIsolatePlatform` インスタンスが存在しない場合、Worker スレッドは無効になります。
  std::unique_ptr<MultiIsolatePlatform> platform =
      MultiIsolatePlatform::Create(4);
  V8::InitializePlatform(platform.get());
  V8::Initialize();

  // この関数の内容については、以下を参照してください。
  int ret = RunNodeInstance(
      platform.get(), result->args(), result->exec_args());

  V8::Dispose();
  V8::DisposePlatform();

  node::TearDownOncePerProcess();
  return ret;
}
```

### インスタンスごとの状態の設定 {#setting-up-a-per-instance-state}

::: info [履歴]
| バージョン | 変更点 |
|---|---|
| v15.0.0 | `CommonEnvironmentSetup` および `SpinEventLoop` ユーティリティが追加されました。 |
:::

Node.js には、「Node.js インスタンス」という概念があり、一般的に `node::Environment` と呼ばれています。各 `node::Environment` は以下に関連付けられています。

- 厳密に 1 つの `v8::Isolate`、つまり 1 つの JS エンジンインスタンス、
- 厳密に 1 つの `uv_loop_t`、つまり 1 つのイベントループ、
- 多数の `v8::Context`、ただし厳密に 1 つのメイン `v8::Context`、および
- 複数の `node::Environment` で共有できる情報を含む 1 つの `node::IsolateData` インスタンス。埋め込み側は、`node::IsolateData` が同じ `v8::Isolate` を使用する `node::Environment` 間でのみ共有されるようにする必要があります。Node.js はこのチェックを実行しません。

`v8::Isolate` をセットアップするには、`v8::ArrayBuffer::Allocator` を提供する必要があります。可能な選択肢の 1 つは、`node::ArrayBufferAllocator::Create()` を介して作成できるデフォルトの Node.js アロケータです。Node.js アロケータを使用すると、アドオンが Node.js C++ `Buffer` API を使用する場合にわずかなパフォーマンス最適化が可能になり、[`process.memoryUsage()`](/ja/nodejs/api/process#processmemoryusage) で `ArrayBuffer` メモリを追跡するために必要です。

さらに、Node.js インスタンスに使用される各 `v8::Isolate` は、プラットフォームが `v8::Isolate` によってスケジュールされたタスクに使用するイベントループを知るために、`MultiIsolatePlatform` インスタンスを使用している場合は、登録および登録解除する必要があります。

`node::NewIsolate()` ヘルパー関数は、`v8::Isolate` を作成し、いくつかの Node.js 固有のフック（Node.js エラーハンドラーなど）を設定し、プラットフォームに自動的に登録します。

```C++ [C++]
int RunNodeInstance(MultiIsolatePlatform* platform,
                    const std::vector<std::string>& args,
                    const std::vector<std::string>& exec_args) {
  int exit_code = 0;

  // libuv イベントループ、v8::Isolate、および Node.js Environment をセットアップします。
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
    // node::CreateEnvironment() および
    // node::LoadEnvironment() が呼び出されるときには、v8::Context を入力する必要があります。
    Context::Scope context_scope(setup->context());

    // 実行のために Node.js インスタンスをセットアップし、その中でコードを実行します。
    // コールバックを受け取り、`require` および `process` オブジェクトを提供するバリアントもあり、必要に応じて手動でコンパイルしてスクリプトを実行できます。
    // このスクリプト内の `require` 関数はファイルシステムにアクセス*しません*。組み込みの Node.js モジュールのみをロードできます。
    // `module.createRequire()` は、ディスクからファイルをロードでき、内部のみの `require` 関数の代わりに標準の CommonJS ファイルローダーを使用するファイルを作成するために使用されています。
    MaybeLocal<Value> loadenv_ret = node::LoadEnvironment(
        env,
        "const publicRequire ="
        "  require('node:module').createRequire(process.cwd() + '/');"
        "globalThis.require = publicRequire;"
        "require('node:vm').runInThisContext(process.argv[1]);");

    if (loadenv_ret.IsEmpty())  // JS 例外が発生しました。
      return 1;

    exit_code = node::SpinEventLoop(env).FromMaybe(1);

    // node::Stop() は、イベントループを明示的に停止し、それ以上の JavaScript の実行を防ぐために使用できます。任意の スレッドから呼び出すことができ、別のスレッドから呼び出された場合は worker.terminate() のように動作します。
    node::Stop(env);
  }

  return exit_code;
}
```
