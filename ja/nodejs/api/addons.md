---
title: Node.js アドオン
description: C++を使用してNode.jsアプリケーションの機能を拡張するためのNode.jsアドオンの作成方法を学びます。例とAPIリファレンスを含む。
head:
  - - meta
    - name: og:title
      content: Node.js アドオン | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: C++を使用してNode.jsアプリケーションの機能を拡張するためのNode.jsアドオンの作成方法を学びます。例とAPIリファレンスを含む。
  - - meta
    - name: twitter:title
      content: Node.js アドオン | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: C++を使用してNode.jsアプリケーションの機能を拡張するためのNode.jsアドオンの作成方法を学びます。例とAPIリファレンスを含む。
---


# C++ アドオン {#c-addons}

*アドオン* は、C++ で記述された動的にリンクされた共有オブジェクトです。[`require()`](/ja/nodejs/api/modules#requireid) 関数は、アドオンを通常の Node.js モジュールとしてロードできます。アドオンは、JavaScript と C/C++ ライブラリ間のインターフェースを提供します。

アドオンを実装するには、3 つのオプションがあります。

- Node-API
- `nan` ([Native Abstractions for Node.js](https://github.com/nodejs/nan))
- 内部の V8、libuv、および Node.js ライブラリの直接使用

Node-API によって公開されていない機能への直接アクセスが必要な場合を除き、Node-API を使用してください。Node-API の詳細については、[Node-API を使用した C/C++ アドオン](/ja/nodejs/api/n-api)を参照してください。

Node-API を使用しない場合、アドオンの実装はより複雑になり、複数のコンポーネントと API に関する知識が必要になります。

-  [V8](https://v8.dev/): Node.js が JavaScript の実装を提供するために使用する C++ ライブラリ。オブジェクトの作成、関数の呼び出しなどのメカニズムを提供します。V8 の API は、主に `v8.h` ヘッダー ファイル（Node.js ソース ツリーの `deps/v8/include/v8.h`）でドキュメント化されており、[オンライン](https://v8docs.nodesource.com/) でも入手できます。
-  [libuv](https://github.com/libuv/libuv): Node.js イベント ループ、そのワーカースレッド、およびプラットフォームのすべての非同期動作を実装する C ライブラリ。また、クロスプラットフォーム抽象化ライブラリとしても機能し、ファイル システム、ソケット、タイマー、システム イベントとの対話など、一般的なシステムタスクへの POSIX ライクなアクセスを主要なオペレーティング システム全体で容易にします。libuv は、標準のイベント ループを超える必要がある、より洗練された非同期アドオンのために、POSIX スレッドに類似したスレッド抽象化も提供します。アドオンの作成者は、libuv を介してノンブロッキング システム操作、ワーカースレッド、または libuv スレッドのカスタム使用に作業をオフロードすることにより、I/O またはその他の時間集約的なタスクでイベント ループをブロックすることを避ける必要があります。
-  内部 Node.js ライブラリ: Node.js 自体がアドオンが使用できる C++ API をエクスポートします。その中で最も重要なのは、`node::ObjectWrap` クラスです。
-  その他の静的にリンクされたライブラリ (OpenSSL を含む): これらのその他のライブラリは、Node.js ソース ツリーの `deps/` ディレクトリにあります。libuv、OpenSSL、V8、および zlib のシンボルのみが、Node.js によって意図的に再エクスポートされ、アドオンによってさまざまな程度で使用される場合があります。詳細については、[Node.js に含まれるライブラリへのリンク](/ja/nodejs/api/addons#linking-to-libraries-included-with-nodejs)を参照してください。

以下のすべての例は、[ダウンロード](https://github.com/nodejs/node-addon-examples) 可能であり、アドオンの出発点として使用できます。


## Hello world {#hello-world}

この "Hello world" の例は、C++ で書かれた簡単なアドオンであり、次の JavaScript コードと同等です。

```js [ESM]
module.exports.hello = () => 'world';
```
まず、`hello.cc` ファイルを作成します。

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
すべての Node.js アドオンは、次のパターンに従って初期化関数をエクスポートする必要があります。

```C++ [C++]
void Initialize(Local<Object> exports);
NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
```
`NODE_MODULE` の後にはセミコロンはありません。これは関数ではないためです (`node.h` を参照)。

`module_name` は、最終的なバイナリのファイル名 (`.node` サフィックスを除く) と一致する必要があります。

したがって、`hello.cc` の例では、初期化関数は `Initialize` であり、アドオンモジュール名は `addon` です。

`node-gyp` を使用してアドオンを構築する場合、マクロ `NODE_GYP_MODULE_NAME` を `NODE_MODULE()` の最初のパラメータとして使用すると、最終的なバイナリの名前が `NODE_MODULE()` に確実に渡されます。

`NODE_MODULE()` で定義されたアドオンは、複数のコンテキストまたは複数のスレッドで同時にロードできません。

### コンテキスト対応アドオン {#context-aware-addons}

Node.js アドオンを複数のコンテキストで複数回ロードする必要がある環境があります。 たとえば、[Electron](https://electronjs.org/) ランタイムは、1 つのプロセスで Node.js の複数のインスタンスを実行します。 各インスタンスには独自の `require()` キャッシュがあるため、各インスタンスは `require()` を介してロードされるときに正しく動作するためにネイティブアドオンを必要とします。 これは、アドオンが複数の初期化をサポートする必要があることを意味します。

コンテキスト対応アドオンは、マクロ `NODE_MODULE_INITIALIZER` を使用して構築できます。このマクロは、Node.js がアドオンをロードするときに見つけることを期待する関数の名前に展開されます。 したがって、アドオンは次の例のように初期化できます。

```C++ [C++]
using namespace v8;

extern "C" NODE_MODULE_EXPORT void
NODE_MODULE_INITIALIZER(Local<Object> exports,
                        Local<Value> module,
                        Local<Context> context) {
  /* ここでアドオンの初期化手順を実行します。 */
}
```
別のオプションは、マクロ `NODE_MODULE_INIT()` を使用することです。これにより、コンテキスト対応アドオンも構築されます。 特定のアドオン初期化関数を中心にアドオンを構築するために使用される `NODE_MODULE()` とは異なり、`NODE_MODULE_INIT()` は、関数本体が続くそのような初期化子の宣言として機能します。

`NODE_MODULE_INIT()` の呼び出しに続く関数本体内で、次の 3 つの変数を使用できます。

- `Local\<Object\> exports`、
- `Local\<Value\> module`、および
- `Local\<Context\> context`

コンテキスト対応アドオンを構築するには、安定性と正確性を確保するために、グローバル静的データを慎重に管理する必要があります。 アドオンは複数回ロードされる可能性があり、異なるスレッドからロードされる可能性さえあるため、アドオンに格納されているグローバル静的データは適切に保護する必要があり、JavaScript オブジェクトへの永続的な参照を含んではなりません。 その理由は、JavaScript オブジェクトは 1 つのコンテキストでのみ有効であり、間違ったコンテキストまたは作成されたスレッドとは異なるスレッドからアクセスすると、クラッシュが発生する可能性が高いためです。

コンテキスト対応アドオンは、次の手順を実行することにより、グローバル静的データを回避するように構造化できます。

- アドオンインスタンスごとのデータを保持するクラスを定義し、次の形式の静的メンバーを持ちます。
- アドオン初期化子でこのクラスのインスタンスをヒープ割り当てします。 これは、`new` キーワードを使用して実行できます。
- `node::AddEnvironmentCleanupHook()` を呼び出し、上記の作成されたインスタンスと `DeleteInstance()` へのポインタを渡します。 これにより、環境が破棄されるときにインスタンスが確実に削除されます。
- クラスのインスタンスを `v8::External` に格納し、
- `v8::FunctionTemplate::New()` または `v8::Function::New()` に渡すことによって、JavaScript に公開されるすべてのメソッドに `v8::External` を渡します。これにより、ネイティブバック JavaScript 関数が作成されます。 `v8::FunctionTemplate::New()` または `v8::Function::New()` の 3 番目のパラメータは、`v8::External` を受け入れ、`v8::FunctionCallbackInfo::Data()` メソッドを使用してネイティブコールバックで利用できるようにします。

これにより、アドオンインスタンスごとのデータが JavaScript から呼び出すことができる各バインディングに確実に到達します。 アドオンインスタンスごとのデータは、アドオンが作成する可能性のある非同期コールバックにも渡す必要があります。

次の例は、コンテキスト対応アドオンの実装を示しています。

```C++ [C++]
#include <node.h>

using namespace v8;

class AddonData {
 public:
  explicit AddonData(Isolate* isolate):
      call_count(0) {
    // 環境のクリーンアップ時に、このアドオンインスタンスごとのデータが削除されるようにします。
    node::AddEnvironmentCleanupHook(isolate, DeleteInstance, this);
  }

  // アドオンごとのデータ。
  int call_count;

  static void DeleteInstance(void* data) {
    delete static_cast<AddonData*>(data);
  }
};

static void Method(const v8::FunctionCallbackInfo<v8::Value>& info) {
  // アドオンインスタンスごとのデータを取得します。
  AddonData* data =
      reinterpret_cast<AddonData*>(info.Data().As<External>()->Value());
  data->call_count++;
  info.GetReturnValue().Set((double)data->call_count);
}

// このアドオンをコンテキスト対応として初期化します。
NODE_MODULE_INIT(/* exports, module, context */) {
  Isolate* isolate = context->GetIsolate();

  // このアドオンのインスタンスの `AddonData` の新しいインスタンスを作成し、
  // そのライフサイクルを Node.js 環境のライフサイクルに関連付けます。
  AddonData* data = new AddonData(isolate);

  // データを `v8::External` でラップして、公開するメソッドに渡すことができるようにします。
  Local<External> external = External::New(isolate, data);

  // メソッド `Method` を JavaScript に公開し、上記の作成したアドオンインスタンスごとのデータが確実に受信されるように、
  // `FunctionTemplate` コンストラクタの 3 番目のパラメータとして `external` を渡します。
  exports->Set(context,
               String::NewFromUtf8(isolate, "method").ToLocalChecked(),
               FunctionTemplate::New(isolate, Method, external)
                  ->GetFunction(context).ToLocalChecked()).FromJust();
}
```

#### Worker のサポート {#worker-support}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v14.8.0, v12.19.0 | クリーンアップフックが非同期になる場合があります。 |
:::

アドオンが、メインスレッドや Worker スレッドなどの複数の Node.js 環境からロードされるためには、次のいずれかの条件を満たす必要があります。

- Node-API アドオンである
- 上記のように `NODE_MODULE_INIT()` を使用してコンテキスト対応として宣言されている

[`Worker`](/ja/nodejs/api/worker_threads#class-worker) スレッドをサポートするために、アドオンは、そのようなスレッドが終了するときに割り当てた可能性のあるすべてのリソースをクリーンアップする必要があります。これは、`AddEnvironmentCleanupHook()` 関数を使用することで実現できます。

```C++ [C++]
void AddEnvironmentCleanupHook(v8::Isolate* isolate,
                               void (*fun)(void* arg),
                               void* arg);
```
この関数は、特定の Node.js インスタンスがシャットダウンする前に実行されるフックを追加します。必要に応じて、これらのフックは、`RemoveEnvironmentCleanupHook()` を使用して実行される前に削除できます。これは、同じシグネチャを持ちます。コールバックは、後入れ先出し (LIFO) の順序で実行されます。

必要に応じて、クリーンアップフックがコールバック関数を受け取る `AddEnvironmentCleanupHook()` および `RemoveEnvironmentCleanupHook()` の追加のペアがあります。これは、アドオンによって登録された libuv ハンドルなど、非同期リソースをシャットダウンするために使用できます。

次の `addon.cc` は `AddEnvironmentCleanupHook` を使用しています。

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

// 注: 実際のアプリケーションでは、静的/グローバルデータに依存しないでください。
static char cookie[] = "yum yum";
static int cleanup_cb1_called = 0;
static int cleanup_cb2_called = 0;

static void cleanup_cb1(void* arg) {
  Isolate* isolate = static_cast<Isolate*>(arg);
  HandleScope scope(isolate);
  Local<Object> obj = Object::New(isolate);
  assert(!obj.IsEmpty());  // VM がまだ生きていることをアサートします
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

// このアドオンがコンテキスト対応になるように初期化します。
NODE_MODULE_INIT(/* exports, module, context */) {
  Isolate* isolate = context->GetIsolate();

  AddEnvironmentCleanupHook(isolate, sanity_check, nullptr);
  AddEnvironmentCleanupHook(isolate, cleanup_cb2, cookie);
  AddEnvironmentCleanupHook(isolate, cleanup_cb1, isolate);
}
```
JavaScript で次を実行してテストします。

```js [ESM]
// test.js
require('./build/Release/addon');
```

### ビルド {#building}

ソースコードが記述されたら、それをバイナリの `addon.node` ファイルにコンパイルする必要があります。そのためには、JSONライクな形式でモジュールのビルド構成を記述する `binding.gyp` というファイルをプロジェクトのトップレベルに作成します。このファイルは、Node.jsアドオンをコンパイルするために特別に作成されたツールである [node-gyp](https://github.com/nodejs/node-gyp) によって使用されます。

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
`node-gyp` ユーティリティのバージョンは、Node.jsに `npm` の一部としてバンドルされ、配布されています。このバージョンは、開発者が直接使用できるようにするものではなく、`npm install` コマンドを使用してアドオンをコンパイルおよびインストールする機能をサポートすることのみを目的としています。 `node-gyp` を直接使用したい開発者は、コマンド `npm install -g node-gyp` を使用してインストールできます。プラットフォーム固有の要件を含む詳細については、`node-gyp` の [インストール手順](https://github.com/nodejs/node-gyp#installation) を参照してください。

`binding.gyp` ファイルが作成されたら、`node-gyp configure` を使用して、現在のプラットフォームに適したプロジェクトビルドファイルを生成します。これにより、`Makefile` (Unixプラットフォームの場合) または `vcxproj` ファイル (Windowsの場合) が `build/` ディレクトリに生成されます。

次に、`node-gyp build` コマンドを呼び出して、コンパイルされた `addon.node` ファイルを生成します。これは `build/Release/` ディレクトリに配置されます。

Node.jsアドオンをインストールするために `npm install` を使用すると、npm はバンドルされている `node-gyp` のバージョンを使用して、これと同じ一連のアクションを実行し、ユーザーのプラットフォーム向けにコンパイルされたバージョンのアドオンをオンデマンドで生成します。

ビルドが完了すると、[`require()`](/ja/nodejs/api/modules#requireid) をビルドされた `addon.node` モジュールに向けることで、Node.js 内からバイナリアドオンを使用できます。

```js [ESM]
// hello.js
const addon = require('./build/Release/addon');

console.log(addon.hello());
// Prints: 'world'
```
コンパイルされたアドオンバイナリへの正確なパスは、コンパイル方法によって異なる場合があるため (つまり、`./build/Debug/` にある場合もあります)、アドオンは [bindings](https://github.com/TooTallNate/node-bindings) パッケージを使用して、コンパイルされたモジュールをロードできます。

`bindings` パッケージの実装は、アドオンモジュールの検索方法においてより洗練されていますが、基本的には次のような `try…catch` パターンを使用しています。

```js [ESM]
try {
  return require('./build/Release/addon.node');
} catch (err) {
  return require('./build/Debug/addon.node');
}
```

### Node.js に同梱されているライブラリへのリンク {#linking-to-libraries-included-with-nodejs}

Node.js は、V8、libuv、OpenSSL などの静的にリンクされたライブラリを使用します。すべてのアドオンは V8 へのリンクが必須であり、他の依存関係にもリンクできます。通常、これは適切な `#include \<...\>` ステートメント (例: `#include \<v8.h\>`) を含めるだけで簡単に行え、`node-gyp` が適切なヘッダーを自動的に検出します。ただし、注意すべき点がいくつかあります。

- `node-gyp` を実行すると、Node.js の特定のリリースのバージョンが検出され、完全なソース tarball またはヘッダーのみがダウンロードされます。完全なソースがダウンロードされた場合、アドオンは Node.js の依存関係の完全なセットにアクセスできます。ただし、Node.js ヘッダーのみがダウンロードされた場合、Node.js によってエクスポートされたシンボルのみが利用可能になります。
- `node-gyp` は、ローカルの Node.js ソースイメージを指す `--nodedir` フラグを使用して実行できます。このオプションを使用すると、アドオンは依存関係の完全なセットにアクセスできます。

### `require()` を使用したアドオンのロード {#loading-addons-using-require}

コンパイルされたアドオンバイナリのファイル名拡張子は `.node` です (`.dll` や `.so` とは異なります)。[`require()`](/ja/nodejs/api/modules#requireid) 関数は、`.node` ファイル拡張子を持つファイルを検索し、それらを動的にリンクされたライブラリとして初期化するように記述されています。

[`require()`](/ja/nodejs/api/modules#requireid) を呼び出す場合、通常、`.node` 拡張子は省略でき、Node.js はアドオンを見つけて初期化します。ただし、1 つ注意点として、Node.js はまず、同じベース名を共有するモジュールまたは JavaScript ファイルを検索してロードしようとします。たとえば、バイナリ `addon.node` と同じディレクトリに `addon.js` ファイルがある場合、[`require('addon')`](/ja/nodejs/api/modules#requireid) は `addon.js` ファイルを優先してロードします。

## Node.js 用のネイティブ抽象化 {#native-abstractions-for-nodejs}

このドキュメントで説明されている各例では、アドオンを実装するために Node.js および V8 API を直接使用しています。V8 API は、V8 のリリースごと (および Node.js のメジャーリリースごと) に大幅に変更される可能性があります。変更ごとに、アドオンは更新され、再コンパイルされて、引き続き機能するようにする必要がある場合があります。Node.js のリリーススケジュールは、このような変更の頻度と影響を最小限に抑えるように設計されていますが、Node.js が V8 API の安定性を保証するためにできることはほとんどありません。

[Node.js 用のネイティブ抽象化](https://github.com/nodejs/nan) (または `nan`) は、アドオン開発者が V8 および Node.js の過去と将来のリリース間の互換性を維持するために使用することを推奨する一連のツールを提供します。その使用方法の例については、`nan` の[例](https://github.com/nodejs/nan/tree/HEAD/examples/)を参照してください。


## Node-API {#node-api}

::: tip [Stable: 2 - 安定版]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [Stability: 2](/ja/nodejs/api/documentation#stability-index) - 安定版
:::

Node-API は、ネイティブアドオンを構築するための API です。これは、基盤となる JavaScript ランタイム（V8 など）から独立しており、Node.js 自体の一部として維持されています。この API は、Node.js のバージョン間で Application Binary Interface (ABI) の安定性を保ちます。これは、アドオンを基盤となる JavaScript エンジンの変更から隔離し、あるバージョン用にコンパイルされたモジュールを、再コンパイルせずに Node.js の後のバージョンで実行できるようにすることを目的としています。アドオンは、このドキュメント（node-gyp など）で概説されているのと同じアプローチ/ツールで構築/パッケージ化されます。唯一の違いは、ネイティブコードで使用される API のセットです。V8 または [Native Abstractions for Node.js](https://github.com/nodejs/nan) API を使用する代わりに、Node-API で利用可能な関数が使用されます。

Node-API によって提供される ABI の安定性の恩恵を受けるアドオンを作成および維持するには、特定の[実装上の考慮事項](/ja/nodejs/api/n-api#implications-of-abi-stability)が伴います。

上記の「Hello world」の例で Node-API を使用するには、`hello.cc` の内容を以下に置き換えます。他のすべての手順は同じままです。

```C++ [C++]
// Node-API を使用した hello.cc
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
利用可能な関数とその使用方法については、[Node-API を使用した C/C++ アドオン](/ja/nodejs/api/n-api)で説明されています。


## アドオンの例 {#addon-examples}

以下は、開発者が始めるのに役立つことを目的としたアドオンの例です。これらの例では、V8 APIを使用しています。さまざまなV8呼び出しの詳細については、オンラインの[V8リファレンス](https://v8docs.nodesource.com/)を参照し、ハンドル、スコープ、関数テンプレートなど、使用されているいくつかの概念の説明については、V8の[Embedder's Guide](https://v8.dev/docs/embed)を参照してください。

これらの各例では、次の`binding.gyp`ファイルを使用します。

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
複数の`.cc`ファイルがある場合は、追加のファイル名を`sources`配列に追加するだけです。

```json [JSON]
"sources": ["addon.cc", "myexample.cc"]
```
`binding.gyp`ファイルの準備ができたら、`node-gyp`を使用して、アドオンの例を設定してビルドできます。

```bash [BASH]
node-gyp configure build
```
### 関数の引数 {#function-arguments}

アドオンは通常、Node.js内で実行されているJavaScriptからアクセスできるオブジェクトと関数を公開します。関数がJavaScriptから呼び出されると、入力引数と戻り値はC/C++コードとの間でマッピングされる必要があります。

次の例は、JavaScriptから渡された関数の引数を読み取り、結果を返す方法を示しています。

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

// これは"add"メソッドの実装です
// 入力引数は、
// const FunctionCallbackInfo<Value>& args structを使用して渡されます
void Add(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  // 渡された引数の数を確認します。
  if (args.Length() < 2) {
    // JavaScriptに返されるErrorをスローします
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "Wrong number of arguments").ToLocalChecked()));
    return;
  }

  // 引数の型を確認します
  if (!args[0]->IsNumber() || !args[1]->IsNumber()) {
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "Wrong arguments").ToLocalChecked()));
    return;
  }

  // 操作を実行します
  double value =
      args[0].As<Number>()->Value() + args[1].As<Number>()->Value();
  Local<Number> num = Number::New(isolate, value);

  // 戻り値を設定します (渡された
  // FunctionCallbackInfo<Value>&を使用)
  args.GetReturnValue().Set(num);
}

void Init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "add", Add);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
コンパイルされると、アドオンの例はNode.js内からrequireして使用できます。

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

console.log('This should be eight:', addon.add(3, 5));
```

### コールバック {#callbacks}

アドオンでは、JavaScript関数をC++関数に渡し、そこから実行するのが一般的な方法です。次の例は、そのようなコールバックを呼び出す方法を示しています。

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
この例では、完全な`module`オブジェクトを2番目の引数として受け取る2引数形式の`Init()`を使用しています。これにより、アドオンは`exports`のプロパティとして関数を追加する代わりに、単一の関数で`exports`を完全に上書きできます。

これをテストするには、次のJavaScriptを実行します。

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

addon((msg) => {
  console.log(msg);
// Prints: 'hello world'
});
```
この例では、コールバック関数は同期的に呼び出されます。

### オブジェクトファクトリ {#object-factory}

アドオンは、次の例に示すように、C++関数内から新しいオブジェクトを作成して返すことができます。オブジェクトが作成され、`createObject()`に渡された文字列をエコーする`msg`プロパティとともに返されます。

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
JavaScriptでテストするには:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj1 = addon('hello');
const obj2 = addon('world');
console.log(obj1.msg, obj2.msg);
// Prints: 'hello world'
```

### 関数ファクトリ {#function-factory}

もう 1 つの一般的なシナリオは、C++ 関数をラップする JavaScript 関数を作成し、それらを JavaScript に返すことです。

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

  // 匿名にする場合は省略
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
テストするには：

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const fn = addon();
console.log(fn());
// Prints: 'hello world'
```
### C++ オブジェクトのラップ {#wrapping-c-objects}

JavaScript の `new` 演算子を使用して新しいインスタンスを作成できるように、C++ オブジェクト/クラスをラップすることも可能です。

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
次に、`myobject.h` で、ラッパークラスは `node::ObjectWrap` から継承します。

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
`myobject.cc` で、公開するさまざまなメソッドを実装します。 次のコードでは、メソッド `plusOne()` はコンストラクターのプロトタイプに追加することで公開されます。

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
  addon_data_tpl->SetInternalFieldCount(1);  // MyObject::New() 用のフィールドを 1 つ
  Local<Object> addon_data =
      addon_data_tpl->NewInstance(context).ToLocalChecked();

  // コンストラクターテンプレートの準備
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New, addon_data);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  // プロトタイプ
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
    // コンストラクターとして呼び出された場合: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // プレーンな関数 `MyObject(...)` として呼び出された場合、コンストラクター呼び出しに変換する。
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
この例をビルドするには、`myobject.cc` ファイルを `binding.gyp` に追加する必要があります。

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
以下でテストします。

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
ラッパーオブジェクトのデストラクタは、オブジェクトがガベージコレクションされるときに実行されます。 デストラクタのテストのために、ガベージコレクションを強制的に実行できるようにするコマンドラインフラグがあります。 これらのフラグは、基盤となる V8 JavaScript エンジンによって提供されます。 これらは、いつでも変更または削除される可能性があります。 これらは、Node.js または V8 によってドキュメント化されておらず、テスト以外では絶対に使用しないでください。

プロセスのシャットダウン中、またはワーカースレッドのデストラクタは JS エンジンによって呼び出されません。 したがって、これらのオブジェクトを追跡し、リソースリークを回避するために適切な破棄を保証するのはユーザーの責任です。


### ラップされたオブジェクトのファクトリ {#factory-of-wrapped-objects}

あるいは、ファクトリパターンを使用することで、JavaScript の `new` 演算子を使用してオブジェクトインスタンスを明示的に作成することを回避できます。

```js [ESM]
const obj = addon.createObject();
// 代わりに:
// const obj = new addon.Object();
```
まず、`createObject()` メソッドが `addon.cc` に実装されます。

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
`myobject.h` では、オブジェクトのインスタンス化を処理するために、静的メソッド `NewInstance()` が追加されています。このメソッドは JavaScript で `new` を使用する代わりに使用されます。

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
`myobject.cc` の実装は、前の例と似ています。

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

// 警告! これはスレッドセーフではありません。このアドオンはワーカースレッドに使用できません。
Global<Function> MyObject::constructor;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init(Isolate* isolate) {
  // コンストラクタテンプレートを準備
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  // プロトタイプ
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
    // コンストラクタとして呼び出された場合: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // プレーンな関数 `MyObject(...)` として呼び出された場合、コンストラクタ呼び出しに変換する。
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
この例をビルドするには、`myobject.cc` ファイルを `binding.gyp` に追加する必要があります。

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
以下でテストします。

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

### ラップされたオブジェクトの受け渡し {#passing-wrapped-objects-around}

C++オブジェクトをラップして返すことに加えて、Node.jsヘルパー関数 `node::ObjectWrap::Unwrap` を使用してアンラップすることで、ラップされたオブジェクトを受け渡すことができます。次の例は、2つの `MyObject` オブジェクトを入力引数として受け取ることができる関数 `add()` を示しています。

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
`myobject.h` では、オブジェクトをアンラップした後でプライベート値にアクセスできるように、新しいパブリックメソッドが追加されています。

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
`myobject.cc` の実装は、前のバージョンとほぼ同じです。

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
以下でテストします。

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj1 = addon.createObject(10);
const obj2 = addon.createObject(20);
const result = addon.add(obj1, obj2);

console.log(result);
// Prints: 30
```

