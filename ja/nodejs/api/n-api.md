---
title: Node.js N-API ドキュメント
description: N-API（Node.js API）は、ネイティブアドオンに対して安定した一貫したインターフェースを提供し、開発者が異なるNode.jsバージョン間で互換性のあるモジュールを作成できるようにします。
head:
  - - meta
    - name: og:title
      content: Node.js N-API ドキュメント | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: N-API（Node.js API）は、ネイティブアドオンに対して安定した一貫したインターフェースを提供し、開発者が異なるNode.jsバージョン間で互換性のあるモジュールを作成できるようにします。
  - - meta
    - name: twitter:title
      content: Node.js N-API ドキュメント | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: N-API（Node.js API）は、ネイティブアドオンに対して安定した一貫したインターフェースを提供し、開発者が異なるNode.jsバージョン間で互換性のあるモジュールを作成できるようにします。
---


# Node-API {#node-api}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [Stability: 2](/ja/nodejs/api/documentation#stability-index) - 安定版
:::

Node-API（旧称 N-API）は、ネイティブアドオンを構築するための API です。これは、基盤となる JavaScript ランタイム（例えば、V8）から独立しており、Node.js 自体の一部としてメンテナンスされています。この API は、Node.js のバージョン間で Application Binary Interface（ABI）の安定性が保たれます。これは、アドオンを基盤となる JavaScript エンジンの変更から隔離し、あるメジャーバージョン用にコンパイルされたモジュールを、再コンパイルせずに後のメジャーバージョンの Node.js で実行できるようにすることを目的としています。[ABI 安定性](https://nodejs.org/en/docs/guides/abi-stability/)ガイドでは、より詳細な説明を提供しています。

アドオンは、[C++ アドオン](/ja/nodejs/api/addons)というタイトルのセクションで概説されているのと同じアプローチ/ツールで構築/パッケージ化されます。唯一の違いは、ネイティブコードで使用される API のセットです。V8 または [Native Abstractions for Node.js](https://github.com/nodejs/nan) API を使用する代わりに、Node-API で利用可能な関数が使用されます。

Node-API によって公開される API は、通常、JavaScript 値の作成と操作に使用されます。概念と操作は、一般的に ECMA-262 言語仕様で指定されているアイデアに対応しています。API には、次のプロパティがあります。

- すべての Node-API 呼び出しは、`napi_status` 型のステータスコードを返します。このステータスは、API 呼び出しが成功したか失敗したかを示します。
- API の戻り値は、出力パラメータを介して渡されます。
- すべての JavaScript 値は、`napi_value` という名前の不透明な型の背後に抽象化されています。
- エラーのステータスコードの場合、`napi_get_last_error_info` を使用して追加の情報を取得できます。詳細については、エラー処理セクション [エラー処理](/ja/nodejs/api/n-api#error-handling) を参照してください。

Node-API は、Node.js のバージョンや異なるコンパイラレベル間で ABI の安定性を保証する C API です。C++ API は、より使いやすくなります。C++ の使用をサポートするために、プロジェクトは [`node-addon-api`](https://github.com/nodejs/node-addon-api) と呼ばれる C++ ラッパーモジュールを維持しています。このラッパーは、インライン化可能な C++ API を提供します。`node-addon-api` で構築されたバイナリは、Node.js によってエクスポートされる Node-API C ベースの関数のシンボルに依存します。`node-addon-api` は、Node-API を呼び出すコードを記述するためのより効率的な方法です。たとえば、次の `node-addon-api` コードを見てください。最初のセクションは `node-addon-api` コードを示し、2 番目のセクションはアドオンで実際に使用されるものを示しています。

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
最終的な結果として、アドオンはエクスポートされた C API のみを使用します。その結果、C API によって提供される ABI の安定性の恩恵を受けることができます。

C API の代わりに `node-addon-api` を使用する場合は、まず `node-addon-api` の API [ドキュメント](https://github.com/nodejs/node-addon-api#api-documentation) から始めてください。

[Node-API リソース](https://nodejs.github.io/node-addon-examples/)は、Node-API と `node-addon-api` を使い始めたばかりの開発者にとって、優れたオリエンテーションとヒントを提供します。追加のメディアリソースは、[Node-API メディア](https://github.com/nodejs/abi-stable-node/blob/HEAD/node-api-media.md)ページにあります。


## ABI の安定性の意味合い {#implications-of-abi-stability}

Node-API は ABI の安定性を保証しますが、Node.js の他の部分は保証していません。また、アドオンから使用される外部ライブラリも保証していない可能性があります。特に、以下の API は、メジャーバージョン間の ABI の安定性を保証していません。

-  Node.js の C++ API (経由で利用可能)
-  libuv API (Node.js にも含まれており、経由で利用可能)
-  V8 API (経由で利用可能)

したがって、アドオンが Node.js のメジャーバージョン間で ABI 互換性を維持するためには、以下の使用に制限して、Node-API のみを使用する必要があります。

```C [C]
#include <node_api.h>
```
また、使用するすべての外部ライブラリについて、その外部ライブラリが Node-API と同様の ABI 安定性を保証していることを確認する必要があります。

## ビルド {#building}

JavaScript で記述されたモジュールとは異なり、Node-API を使用した Node.js ネイティブアドオンの開発とデプロイには、追加のツールセットが必要です。Node.js 向けの開発に必要な基本ツールに加えて、ネイティブアドオン開発者は C および C++ コードをバイナリにコンパイルできるツールチェーンが必要です。さらに、ネイティブアドオンのデプロイ方法によっては、ネイティブアドオンの *ユーザー* も C/C++ ツールチェーンをインストールする必要があります。

Linux 開発者にとって、必要な C/C++ ツールチェーンパッケージはすぐに入手できます。[GCC](https://gcc.gnu.org/) は、Node.js コミュニティでさまざまなプラットフォームでビルドおよびテストするために広く使用されています。多くの開発者にとって、[LLVM](https://llvm.org/) コンパイラインフラストラクチャも良い選択肢です。

Mac 開発者にとって、[Xcode](https://developer.apple.com/xcode/) は必要なすべてのコンパイラツールを提供します。ただし、Xcode IDE 全体をインストールする必要はありません。次のコマンドは、必要なツールチェーンをインストールします。

```bash [BASH]
xcode-select --install
```
Windows 開発者にとって、[Visual Studio](https://visualstudio.microsoft.com/) は必要なすべてのコンパイラツールを提供します。ただし、Visual Studio IDE 全体をインストールする必要はありません。次のコマンドは、必要なツールチェーンをインストールします。

```bash [BASH]
npm install --global windows-build-tools
```
以下のセクションでは、Node.js ネイティブアドオンの開発およびデプロイに利用できる追加のツールについて説明します。


### ビルドツール {#build-tools}

ここにリストされているツールは、ネイティブアドオンの *ユーザー* がネイティブアドオンを正常にインストールするために、C/C++ツールチェーンをインストールしている必要があることを前提としています。

#### node-gyp {#node-gyp}

[node-gyp](https://github.com/nodejs/node-gyp) は、Google の [GYP](https://gyp.gsrc.io/) ツールの [gyp-next](https://github.com/nodejs/gyp-next) フォークに基づくビルドシステムであり、npm に同梱されています。GYP、ひいては node-gyp は、Python がインストールされている必要があります。

歴史的に、node-gyp はネイティブアドオンを構築するためのツールとして選ばれてきました。広く採用され、ドキュメントも充実しています。しかし、一部の開発者は node-gyp の制限に遭遇しています。

#### CMake.js {#cmakejs}

[CMake.js](https://github.com/cmake-js/cmake-js) は、[CMake](https://cmake.org/) に基づく代替ビルドシステムです。

CMake.js は、すでに CMake を使用しているプロジェクトや、node-gyp の制限に影響を受けている開発者にとって良い選択肢です。[`build_with_cmake`](https://github.com/nodejs/node-addon-examples/tree/main/src/8-tooling/build_with_cmake) は、CMake ベースのネイティブアドオンプロジェクトの例です。

### プリコンパイル済みバイナリのアップロード {#uploading-precompiled-binaries}

ここにリストされている3つのツールを使用すると、ネイティブアドオンの開発者とメンテナーは、バイナリを作成して、パブリックまたはプライベートサーバーにアップロードできます。これらのツールは通常、[Travis CI](https://travis-ci.org/) や [AppVeyor](https://www.appveyor.com/) などの CI/CD ビルドシステムと統合して、さまざまなプラットフォームおよびアーキテクチャ用のバイナリを構築およびアップロードします。これらのバイナリは、C/C++ツールチェーンをインストールする必要のないユーザーがダウンロードできます。

#### node-pre-gyp {#node-pre-gyp}

[node-pre-gyp](https://github.com/mapbox/node-pre-gyp) は、開発者が選択したサーバーにバイナリをアップロードする機能を追加する node-gyp に基づくツールです。node-pre-gyp は、Amazon S3 へのバイナリのアップロードを特に強力にサポートしています。

#### prebuild {#prebuild}

[prebuild](https://github.com/prebuild/prebuild) は、node-gyp または CMake.js を使用したビルドをサポートするツールです。さまざまなサーバーをサポートする node-pre-gyp とは異なり、prebuild はバイナリを [GitHub releases](https://help.github.com/en/github/administering-a-repository/about-releases) にのみアップロードします。prebuild は、CMake.js を使用する GitHub プロジェクトに適しています。


#### prebuildify {#prebuildify}

[prebuildify](https://github.com/prebuild/prebuildify) は node-gyp をベースにしたツールです。prebuildify の利点は、ビルドされたバイナリが npm にアップロードされる際にネイティブアドオンにバンドルされることです。バイナリは npm からダウンロードされ、ネイティブアドオンがインストールされるとモジュールユーザーがすぐに利用できます。

## 使用法 {#usage}

Node-API 関数を使用するには、Node 開発ツリーの src ディレクトリにある [`node_api.h`](https://github.com/nodejs/node/blob/HEAD/src/node_api.h) ファイルを含めます。

```C [C]
#include <node_api.h>
```
これにより、Node.js の特定リリースに対するデフォルトの `NAPI_VERSION` が有効になります。Node-API の特定のバージョンとの互換性を確保するために、ヘッダーを含める際にバージョンを明示的に指定できます。

```C [C]
#define NAPI_VERSION 3
#include <node_api.h>
```
これにより、Node-API サーフェスは、指定された（およびそれ以前の）バージョンで利用可能だった機能のみに制限されます。

Node-API サーフェスの一部は実験的であり、明示的なオプトインが必要です。

```C [C]
#define NAPI_EXPERIMENTAL
#include <node_api.h>
```
この場合、実験的な API を含む API サーフェス全体がモジュールコードで利用可能になります。

場合によっては、すでにリリースされて安定している API に影響を与える実験的な機能が導入されることがあります。これらの機能は、オプトアウトによって無効にできます。

```C [C]
#define NAPI_EXPERIMENTAL
#define NODE_API_EXPERIMENTAL_<FEATURE_NAME>_OPT_OUT
#include <node_api.h>
```
ここで、`\<FEATURE_NAME\>` は、実験的および安定した API の両方に影響を与える実験的な機能の名前です。

## Node-API バージョンマトリックス {#node-api-version-matrix}

バージョン 9 までは、Node-API バージョンは追加的であり、Node.js とは独立してバージョン管理されていました。これは、すべてのバージョンが前のバージョンの拡張であり、前のバージョンからのすべての API に追加が加えられていることを意味します。各 Node.js バージョンは、単一の Node-API バージョンのみをサポートしていました。たとえば、v18.15.0 は Node-API バージョン 8 のみをサポートしています。ABI の安定性は、8 が以前のすべてのバージョンの厳密なスーパーセットであるため達成されました。

バージョン 9 以降、Node-API バージョンは引き続き独立してバージョン管理されますが、Node-API バージョン 9 で実行されるアドオンは、Node-API バージョン 10 で実行するためにコードの更新が必要になる場合があります。ただし、ABI の安定性は維持されます。なぜなら、Node-API バージョン 8 より高いバージョンをサポートする Node.js バージョンは、8 からサポートする最高バージョンまでのすべてのバージョンをサポートし、アドオンがより高い Node-API バージョンをオプトインしない限り、バージョン 8 API をデフォルトで提供するためです。このアプローチは、ABI の安定性を維持しながら、既存の Node-API 関数をより適切に最適化する柔軟性を提供します。既存のアドオンは、以前のバージョンの Node-API を使用して再コンパイルせずに実行を継続できます。アドオンが新しい Node-API バージョンの機能を必要とする場合は、既存のコードの変更と再コンパイルが必要になります。

Node.js のバージョンで Node-API バージョン 9 以降をサポートする場合、`NAPI_VERSION=X` を定義し、既存のアドオン初期化マクロを使用すると、実行時にアドオンで使用される要求された Node-API バージョンがアドオンに組み込まれます。`NAPI_VERSION` が設定されていない場合は、デフォルトで 8 になります。

この表は、古いストリームでは最新ではない可能性があります。最新の情報は、次の API ドキュメントにあります。[Node-API バージョンマトリックス](/ja/nodejs/api/n-api#node-api-version-matrix)

| Node-API バージョン | サポート対象 |
| --- | --- |
| 9 | v18.17.0 以降、20.3.0 以降、21.0.0 以降のすべてのバージョン |
| 8 | v12.22.0 以降、v14.17.0 以降、v15.12.0 以降、16.0.0 以降のすべてのバージョン |
| 7 | v10.23.0 以降、v12.19.0 以降、v14.12.0 以降、15.0.0 以降のすべてのバージョン |
| 6 | v10.20.0 以降、v12.17.0 以降、14.0.0 以降のすべてのバージョン |
| 5 | v10.17.0 以降、v12.11.0 以降、13.0.0 以降のすべてのバージョン |
| 4 | v10.16.0 以降、v11.8.0 以降、12.0.0 以降のすべてのバージョン |
| 3 | v6.14.2*、8.11.2 以降、v9.11.0 以降*、10.0.0 以降のすべてのバージョン |
| 2 | v8.10.0 以降*、v9.3.0 以降*、10.0.0 以降のすべてのバージョン |
| 1 | v8.6.0 以降**、v9.0.0 以降*、10.0.0 以降のすべてのバージョン |
* Node-API は実験的でした。

** Node.js 8.0.0 には、Node-API が実験的に含まれていました。Node-API バージョン 1 としてリリースされましたが、Node.js 8.6.0 まで進化し続けました。API は Node.js 8.6.0 より前のバージョンでは異なります。Node-API バージョン 3 以降をお勧めします。

Node-API 用に文書化された各 API には、`added in:` という名前のヘッダーがあり、安定している API には、追加のヘッダー `Node-API version:` があります。API は、`Node-API version:` に示されている Node-API バージョン以上をサポートする Node.js バージョンを使用している場合に直接使用できます。`Node-API version:` がリストされていない場合、または `Node-API version:` がリストされていない Node.js バージョンを使用している場合、API は `#define NAPI_EXPERIMENTAL` が `node_api.h` または `js_native_api.h` のインクルードより前にある場合にのみ使用できます。API が `added in:` に示されているものより後の Node.js のバージョンで使用できないように見える場合、これはおそらく見かけ上の不在の理由です。

ネイティブコードから ECMAScript 機能にアクセスすることに厳密に関連付けられている Node-API は、`js_native_api.h` および `js_native_api_types.h` で個別に見つけることができます。これらのヘッダーで定義されている API は、`node_api.h` および `node_api_types.h` に含まれています。ヘッダーは、Node.js 以外の Node-API の実装を許可するために、このように構成されています。これらの実装では、Node.js 固有の API は適用できない場合があります。

アドオンの Node.js 固有の部分は、JavaScript 環境に実際の機能を公開するコードから分離できるため、後者は Node-API の複数の実装で使用できます。以下の例では、`addon.c` および `addon.h` は `js_native_api.h` のみを参照しています。これにより、`addon.c` を再利用して、Node.js 実装の Node-API または Node.js 以外の Node-API の任意の実装に対してコンパイルできます。

`addon_node.c` は、アドオンの Node.js 固有のエントリポイントを含む別のファイルであり、アドオンが Node.js 環境にロードされるときに `addon.c` を呼び出してアドオンをインスタンス化します。

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

## 環境ライフサイクル API {#environment-life-cycle-apis}

[ECMAScript 言語仕様](https://tc39.github.io/ecma262/) の [セクション 8.7](https://tc39.ecma262/#sec-agents) では、JavaScript コードが実行される自己完結型環境として「エージェント」の概念が定義されています。複数のそのようなエージェントは、プロセスによって同時または順番に開始および終了される場合があります。

Node.js 環境は ECMAScript エージェントに対応します。メインプロセスでは、環境は起動時に作成され、追加の環境は [ワーカー スレッド](https://nodejs.org/api/worker_threads) として機能するように個別のスレッドで作成できます。Node.js が別のアプリケーションに埋め込まれている場合、アプリケーションのメインスレッドもアプリケーションプロセスのライフサイクル中に Node.js 環境を複数回構築および破棄する場合があります。アプリケーションによって作成された各 Node.js 環境は、そのライフサイクル中にワーカー スレッドとして追加の環境を作成および破棄する場合があります。

ネイティブアドオンの観点からすると、これは、それが提供するバインディングが複数のコンテキストから複数回呼び出され、複数のスレッドから同時に呼び出される可能性があることを意味します。

ネイティブアドオンは、アドオンの各インスタンスに固有になるように、Node.js 環境のライフサイクル中に使用するグローバル状態を割り当てる必要がある場合があります。

この目的のために、Node-API は、そのライフサイクルが Node.js 環境のライフサイクルに結び付けられるように、データを関連付ける方法を提供します。

### `napi_set_instance_data` {#napi_set_instance_data}

**追加: v12.8.0, v10.20.0**

**N-API バージョン: 6**

```C [C]
napi_status napi_set_instance_data(node_api_basic_env env,
                                   void* data,
                                   napi_finalize finalize_cb,
                                   void* finalize_hint);
```
- `[in] env`: Node-API 呼び出しが呼び出される環境。
- `[in] data`: このインスタンスのバインディングで使用できるようにするデータ項目。
- `[in] finalize_cb`: 環境が破棄されるときに呼び出す関数。 関数は `data` を受け取るので、それを解放する可能性があります。 [`napi_finalize`](/ja/nodejs/api/n-api#napi_finalize) に詳細が記載されています。
- `[in] finalize_hint`: コレクション中にファイナライズコールバックに渡すオプションのヒント。

API が成功した場合は `napi_ok` を返します。

この API は `data` を現在実行中の Node.js 環境に関連付けます。 `data` は後で `napi_get_instance_data()` を使用して取得できます。 現在実行中の Node.js 環境に関連付けられ、以前の `napi_set_instance_data()` の呼び出しによって設定された既存のデータはすべて上書きされます。 以前の呼び出しで `finalize_cb` が提供された場合、それは呼び出されません。


### `napi_get_instance_data` {#napi_get_instance_data}

**追加:** v12.8.0, v10.20.0**

**N-API バージョン: 6**

```C [C]
napi_status napi_get_instance_data(node_api_basic_env env,
                                   void** data);
```
- `[in] env`: Node-API 呼び出しが実行される環境。
- `[out] data`: 以前に `napi_set_instance_data()` の呼び出しによって現在実行中の Node.js 環境に関連付けられたデータ項目。

API が成功した場合は `napi_ok` を返します。

この API は、以前に `napi_set_instance_data()` を介して現在実行中の Node.js 環境に関連付けられたデータを取得します。 データが設定されていない場合、呼び出しは成功し、`data` は `NULL` に設定されます。

## 基本的な Node-API データ型 {#basic-node-api-data-types}

Node-API は、次の基本的なデータ型を抽象化として公開し、さまざまな API で使用されます。 これらの API は、不透明なものとして扱い、他の Node-API 呼び出しでのみイントロスペクトする必要があります。

### `napi_status` {#napi_status}

**追加:** v8.0.0**

**N-API バージョン: 1**

Node-API 呼び出しの成功または失敗を示す整数ステータスコード。 現在、次のステータスコードがサポートされています。

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
  napi_would_deadlock,  /* 未使用 */
  napi_no_external_buffers_allowed,
  napi_cannot_run_js
} napi_status;
```
API が失敗したステータスを返したときに追加情報が必要な場合は、`napi_get_last_error_info` を呼び出すことで取得できます。

### `napi_extended_error_info` {#napi_extended_error_info}

**追加:** v8.0.0**

**N-API バージョン: 1**

```C [C]
typedef struct {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
} napi_extended_error_info;
```
- `error_message`: VM に依存しないエラーの説明を含む UTF8 エンコードされた文字列。
- `engine_reserved`: VM 固有のエラー詳細のために予約されています。 これは現在、どの VM にも実装されていません。
- `engine_error_code`: VM 固有のエラーコード。 これは現在、どの VM にも実装されていません。
- `error_code`: 最後のエラーで発生した Node-API ステータスコード。

詳細については、[エラー処理](/ja/nodejs/api/n-api#error-handling) セクションを参照してください。


### `napi_env` {#napi_env}

`napi_env`は、基盤となるNode-API実装がVM固有の状態を永続化するために使用できるコンテキストを表すために使用されます。この構造体は、ネイティブ関数が呼び出されるときにネイティブ関数に渡され、Node-API呼び出しを行う際には返される必要があります。具体的には、最初のネイティブ関数が呼び出されたときに渡されたものと同じ`napi_env`を、後続のネストされたNode-API呼び出しに渡す必要があります。一般的な再利用を目的として`napi_env`をキャッシュしたり、異なる[`Worker`](/ja/nodejs/api/worker_threads#class-worker)スレッドで実行されている同じアドオンのインスタンス間で`napi_env`を渡したりすることは許可されていません。ネイティブアドオンのインスタンスがアンロードされると、`napi_env`は無効になります。このイベントの通知は、[`napi_add_env_cleanup_hook`](/ja/nodejs/api/n-api#napi_add_env_cleanup_hook)および[`napi_set_instance_data`](/ja/nodejs/api/n-api#napi_set_instance_data)に渡されるコールバックを通じて配信されます。

### `node_api_basic_env` {#node_api_basic_env}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

`napi_env`のこのバリアントは、同期ファイナライザー（[`node_api_basic_finalize`](/ja/nodejs/api/n-api#node_api_basic_finalize)）に渡されます。`node_api_basic_env`型のパラメーターを最初の引数として受け入れるNode-APIのサブセットがあります。これらのAPIは、JavaScriptエンジンの状態にアクセスしないため、同期ファイナライザーから安全に呼び出すことができます。`napi_env`型のパラメーターをこれらのAPIに渡すことは許可されていますが、JavaScriptエンジンの状態にアクセスするAPIに`node_api_basic_env`型のパラメーターを渡すことは許可されていません。キャストなしでこれを行おうとすると、アドオンがコンパイル時に警告やエラーを発するようにフラグが設定されている場合、コンパイラの警告またはエラーが発生します。そのようなAPIを同期ファイナライザーから呼び出すと、最終的にアプリケーションが終了します。

### `napi_value` {#napi_value}

これは、JavaScript値を表すために使用される不透明なポインタです。


### `napi_threadsafe_function` {#napi_threadsafe_function}

**Added in: v10.6.0**

**N-API version: 4**

これは不透明なポインターであり、`napi_call_threadsafe_function()` を介して複数のスレッドから非同期的に呼び出すことができる JavaScript 関数を表します。

### `napi_threadsafe_function_release_mode` {#napi_threadsafe_function_release_mode}

**Added in: v10.6.0**

**N-API version: 4**

スレッドセーフ関数をすぐに閉じるか (`napi_tsfn_abort`)、単に解放する (`napi_tsfn_release`) かを示すために、`napi_release_threadsafe_function()` に与えられる値。解放された場合、`napi_acquire_threadsafe_function()` と `napi_call_threadsafe_function()` を介して後で使用できます。

```C [C]
typedef enum {
  napi_tsfn_release,
  napi_tsfn_abort
} napi_threadsafe_function_release_mode;
```
### `napi_threadsafe_function_call_mode` {#napi_threadsafe_function_call_mode}

**Added in: v10.6.0**

**N-API version: 4**

スレッドセーフ関数に関連付けられたキューがいっぱいになったときに、呼び出しをブロックするかどうかを示すために、`napi_call_threadsafe_function()` に与えられる値。

```C [C]
typedef enum {
  napi_tsfn_nonblocking,
  napi_tsfn_blocking
} napi_threadsafe_function_call_mode;
```
### Node-API メモリ管理型 {#node-api-memory-management-types}

#### `napi_handle_scope` {#napi_handle_scope}

これは、特定のスコープ内で作成されたオブジェクトのライフタイムを制御および変更するために使用される抽象化です。 一般に、Node-API 値はハンドルスコープのコンテキスト内で作成されます。 JavaScript からネイティブメソッドが呼び出されると、デフォルトのハンドルスコープが存在します。 ユーザーが新しいハンドルスコープを明示的に作成しない場合、Node-API 値はデフォルトのハンドルスコープで作成されます。 ネイティブメソッドの実行外のコードの呼び出し（たとえば、libuv コールバックの呼び出し中）の場合、JavaScript 値の作成につながる可能性のある関数を呼び出す前に、モジュールはスコープを作成する必要があります。

ハンドルスコープは、[`napi_open_handle_scope`](/ja/nodejs/api/n-api#napi_open_handle_scope) を使用して作成され、[`napi_close_handle_scope`](/ja/nodejs/api/n-api#napi_close_handle_scope) を使用して破棄されます。 スコープを閉じると、ハンドルスコープのライフタイム中に作成されたすべての `napi_value` が現在のスタックフレームから参照されなくなったことを GC に示すことができます。

詳細については、[オブジェクトのライフタイム管理](/ja/nodejs/api/n-api#object-lifetime-management) を確認してください。


#### `napi_escapable_handle_scope` {#napi_escapable_handle_scope}

**Added in: v8.0.0**

**N-API version: 1**

エスケープ可能なハンドルスコープは、特定のハンドルスコープ内で作成された値を親スコープに返すための特殊なハンドルスコープです。

#### `napi_ref` {#napi_ref}

**Added in: v8.0.0**

**N-API version: 1**

これは`napi_value`を参照するために使用される抽象化です。これにより、ユーザーは JavaScript の値のライフサイクルを管理し、最小ライフサイクルを明示的に定義することができます。

詳細については、[オブジェクトのライフサイクル管理](/ja/nodejs/api/n-api#object-lifetime-management)を参照してください。

#### `napi_type_tag` {#napi_type_tag}

**Added in: v14.8.0, v12.19.0**

**N-API version: 8**

符号なし 64 ビット整数として格納される 128 ビットの値。特定のタイプであることを保証するために、JavaScript オブジェクトまたは[externals](/ja/nodejs/api/n-api#napi_create_external)に「タグ付け」できる UUID として機能します。これは、オブジェクトのプロトタイプが操作されている場合、偽陽性を報告する可能性があるため、[`napi_instanceof`](/ja/nodejs/api/n-api#napi_instanceof)よりも強力なチェックです。タイプタグ付けは、[`napi_wrap`](/ja/nodejs/api/n-api#napi_wrap)と組み合わせて使用​​すると最も役立ちます。これは、ラップされたオブジェクトから取得されたポインターを、以前に JavaScript オブジェクトに適用されたタイプタグに対応するネイティブタイプに安全にキャストできることを保証するためです。

```C [C]
typedef struct {
  uint64_t lower;
  uint64_t upper;
} napi_type_tag;
```
#### `napi_async_cleanup_hook_handle` {#napi_async_cleanup_hook_handle}

**Added in: v14.10.0, v12.19.0**

[`napi_add_async_cleanup_hook`](/ja/nodejs/api/n-api#napi_add_async_cleanup_hook)によって返される不透明な値。非同期クリーンアップイベントのチェーンが完了したら、[`napi_remove_async_cleanup_hook`](/ja/nodejs/api/n-api#napi_remove_async_cleanup_hook)に渡す必要があります。

### Node-API コールバック型 {#node-api-callback-types}

#### `napi_callback_info` {#napi_callback_info}

**Added in: v8.0.0**

**N-API version: 1**

コールバック関数に渡される不透明なデータ型。コールバックが呼び出されたコンテキストに関する追加情報を取得するために使用できます。

#### `napi_callback` {#napi_callback}

**Added in: v8.0.0**

**N-API version: 1**

Node-API を介して JavaScript に公開されるユーザー提供のネイティブ関数の関数ポインター型。コールバック関数は、次の署名を満たす必要があります。

```C [C]
typedef napi_value (*napi_callback)(napi_env, napi_callback_info);
```
[オブジェクトのライフサイクル管理](/ja/nodejs/api/n-api#object-lifetime-management)で説明されている理由がない限り、`napi_callback`内でハンドルやコールバックスコープを作成する必要はありません。


#### `node_api_basic_finalize` {#node_api_basic_finalize}

**追加:** v21.6.0, v20.12.0, v18.20.0

::: warning [Stable: 1 - 実験的]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

アドオンが提供する関数に対する関数ポインタ型です。これは、外部所有のデータが、それに関連付けられたオブジェクトがガベージコレクションされたためにクリーンアップできる状態になったときに、ユーザーに通知できるようにします。ユーザーは、オブジェクトのコレクション時に呼び出される次のシグネチャを満たす関数を提供する必要があります。現在、`node_api_basic_finalize`は、外部データを持つオブジェクトがいつコレクションされたかを知るために使用できます。

```C [C]
typedef void (*node_api_basic_finalize)(node_api_basic_env env,
                                      void* finalize_data,
                                      void* finalize_hint);
```
[オブジェクトのライフタイム管理](/ja/nodejs/api/n-api#object-lifetime-management)で説明されている理由がない限り、関数本体内でハンドルやコールバックスコープを作成する必要はありません。

これらの関数は、JavaScriptエンジンがJavaScriptコードを実行できない状態にある間に呼び出される可能性があるため、最初のパラメータとして`node_api_basic_env`を受け入れるNode-APIのみを呼び出すことができます。 [`node_api_post_finalizer`](/ja/nodejs/api/n-api#node_api_post_finalizer)は、JavaScriptエンジンの状態へのアクセスを必要とするNode-API呼び出しを、現在のガベージコレクションサイクルが完了した後に実行するようにスケジュールするために使用できます。

[`node_api_create_external_string_latin1`](/ja/nodejs/api/n-api#node_api_create_external_string_latin1) および [`node_api_create_external_string_utf16`](/ja/nodejs/api/n-api#node_api_create_external_string_utf16) の場合、外部文字列は環境シャットダウンの後半に収集される可能性があるため、`env` パラメータは null になる場合があります。

変更履歴:

- 実験的（`NAPI_EXPERIMENTAL`）：最初のパラメータとして`node_api_basic_env`を受け入れるNode-APIのみを呼び出すことができます。そうでない場合、アプリケーションは適切なエラーメッセージで終了します。 この機能は、`NODE_API_EXPERIMENTAL_BASIC_ENV_OPT_OUT`を定義することでオフにできます。


#### `napi_finalize` {#napi_finalize}

**追加:** v8.0.0

**N-API バージョン:** 1

アドオンが提供する関数の関数ポインタ型であり、ガベージコレクションイベントに応答して、ガベージコレクションサイクルが完了した後、Node-APIへの呼び出しグループをスケジュールすることができます。 これらの関数ポインタは、[`node_api_post_finalizer`](/ja/nodejs/api/n-api#node_api_post_finalizer)で使用できます。

```C [C]
typedef void (*napi_finalize)(napi_env env,
                              void* finalize_data,
                              void* finalize_hint);
```
変更履歴:

- 実験的 (`NAPI_EXPERIMENTAL` が定義されている場合): この型の関数は、[`node_api_post_finalizer`](/ja/nodejs/api/n-api#node_api_post_finalizer)以外ではファイナライザーとして使用できなくなりました。 代わりに [`node_api_basic_finalize`](/ja/nodejs/api/n-api#node_api_basic_finalize) を使用する必要があります。 この機能は、`NODE_API_EXPERIMENTAL_BASIC_ENV_OPT_OUT` を定義することで無効にできます。

#### `napi_async_execute_callback` {#napi_async_execute_callback}

**追加:** v8.0.0

**N-API バージョン:** 1

非同期操作をサポートする関数で使用される関数ポインタ。 コールバック関数は、次のシグネチャを満たす必要があります。

```C [C]
typedef void (*napi_async_execute_callback)(napi_env env, void* data);
```
この関数の実装では、JavaScriptを実行したり、JavaScriptオブジェクトと対話したりするNode-API呼び出しを行うことは避けてください。 Node-API呼び出しは、代わりに `napi_async_complete_callback` で行う必要があります。 `napi_env` パラメータは、JavaScriptの実行につながる可能性があるので使用しないでください。

#### `napi_async_complete_callback` {#napi_async_complete_callback}

**追加:** v8.0.0

**N-API バージョン:** 1

非同期操作をサポートする関数で使用される関数ポインタ。 コールバック関数は、次のシグネチャを満たす必要があります。

```C [C]
typedef void (*napi_async_complete_callback)(napi_env env,
                                             napi_status status,
                                             void* data);
```
[オブジェクトのライフタイム管理](/ja/nodejs/api/n-api#object-lifetime-management)で説明されている理由がない限り、関数本体内でハンドルやコールバックスコープを作成する必要はありません。


#### `napi_threadsafe_function_call_js` {#napi_threadsafe_function_call_js}

**Added in: v10.6.0**

**N-API version: 4**

非同期スレッドセーフ関数呼び出しで使用される関数ポインタです。このコールバックはメインスレッドで呼び出されます。その目的は、セカンダリスレッドからのキュー経由で到着したデータ項目を使用して、通常は `napi_call_function` 経由で JavaScript への呼び出しに必要なパラメータを構築し、その後 JavaScript への呼び出しを行うことです。

セカンダリスレッドからキュー経由で到着したデータは `data` パラメータで与えられ、呼び出す JavaScript 関数は `js_callback` パラメータで与えられます。

Node-API はこのコールバックを呼び出す前に環境をセットアップするため、`napi_make_callback` 経由ではなく、`napi_call_function` 経由で JavaScript 関数を呼び出すだけで十分です。

コールバック関数は、次のシグネチャを満たす必要があります。

```C [C]
typedef void (*napi_threadsafe_function_call_js)(napi_env env,
                                                 napi_value js_callback,
                                                 void* context,
                                                 void* data);
```
- `[in] env`: API 呼び出しに使用する環境。または、スレッドセーフ関数が破棄中で `data` を解放する必要がある場合は `NULL`。
- `[in] js_callback`: 呼び出す JavaScript 関数。または、スレッドセーフ関数が破棄中で `data` を解放する必要がある場合は `NULL`。また、スレッドセーフ関数が `js_callback` なしで作成された場合も `NULL` になる可能性があります。
- `[in] context`: スレッドセーフ関数の作成時に指定されたオプションのデータ。
- `[in] data`: セカンダリスレッドによって作成されたデータ。このネイティブデータを JavaScript 値 (Node-API 関数を使用) に変換し、`js_callback` が呼び出されたときにパラメータとして渡せるようにするのは、コールバックの責任です。このポインタは、スレッドとこのコールバックによって完全に管理されます。したがって、このコールバックはデータを解放する必要があります。

[オブジェクトのライフタイム管理](/ja/nodejs/api/n-api#object-lifetime-management) で説明されている理由がない限り、関数本体内でハンドルやコールバックスコープを作成する必要はありません。


#### `napi_cleanup_hook` {#napi_cleanup_hook}

**追加:** v19.2.0, v18.13.0

**N-APIバージョン:** 3

[`napi_add_env_cleanup_hook`](/ja/nodejs/api/n-api#napi_add_env_cleanup_hook) で使用される関数ポインタ。環境が破棄されるときに呼び出されます。

コールバック関数は、次のシグネチャを満たす必要があります。

```C [C]
typedef void (*napi_cleanup_hook)(void* data);
```
- `[in] data`: [`napi_add_env_cleanup_hook`](/ja/nodejs/api/n-api#napi_add_env_cleanup_hook) に渡されたデータ。

#### `napi_async_cleanup_hook` {#napi_async_cleanup_hook}

**追加:** v14.10.0, v12.19.0

[`napi_add_async_cleanup_hook`](/ja/nodejs/api/n-api#napi_add_async_cleanup_hook) で使用される関数ポインタ。環境が破棄されるときに呼び出されます。

コールバック関数は、次のシグネチャを満たす必要があります。

```C [C]
typedef void (*napi_async_cleanup_hook)(napi_async_cleanup_hook_handle handle,
                                        void* data);
```
- `[in] handle`: 非同期クリーンアップの完了後、[`napi_remove_async_cleanup_hook`](/ja/nodejs/api/n-api#napi_remove_async_cleanup_hook) に渡す必要があるハンドル。
- `[in] data`: [`napi_add_async_cleanup_hook`](/ja/nodejs/api/n-api#napi_add_async_cleanup_hook) に渡されたデータ。

関数の本体は、非同期クリーンアップアクションを開始し、その最後に `handle` を [`napi_remove_async_cleanup_hook`](/ja/nodejs/api/n-api#napi_remove_async_cleanup_hook) の呼び出しに渡す必要があります。

## エラー処理 {#error-handling}

Node-API は、エラー処理に戻り値と JavaScript 例外の両方を使用します。次のセクションでは、それぞれのケースのアプローチについて説明します。

### 戻り値 {#return-values}

すべての Node-API 関数は、同じエラー処理パターンを共有します。すべての API 関数の戻り値の型は `napi_status` です。

リクエストが成功し、キャッチされない JavaScript 例外がスローされなかった場合、戻り値は `napi_ok` になります。エラーが発生し、例外がスローされた場合、エラーの `napi_status` 値が返されます。例外がスローされ、エラーが発生しなかった場合、`napi_pending_exception` が返されます。

`napi_ok` または `napi_pending_exception` 以外の戻り値が返された場合は、[`napi_is_exception_pending`](/ja/nodejs/api/n-api#napi_is_exception_pending) を呼び出して、例外が保留中かどうかを確認する必要があります。詳細については、例外に関するセクションを参照してください。

可能な `napi_status` 値の完全なセットは、`napi_api_types.h` で定義されています。

`napi_status` の戻り値は、発生したエラーの VM に依存しない表現を提供します。場合によっては、エラーを表す文字列や VM（エンジン）固有の情報など、より詳細な情報を取得できると便利です。

この情報を取得するために、`napi_extended_error_info` 構造体を返す [`napi_get_last_error_info`](/ja/nodejs/api/n-api#napi_get_last_error_info) が提供されています。`napi_extended_error_info` 構造体の形式は次のとおりです。

**追加:** v8.0.0

**N-APIバージョン:** 1

```C [C]
typedef struct napi_extended_error_info {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
};
```
- `error_message`: 発生したエラーのテキスト表現。
- `engine_reserved`: エンジンの使用のみのために予約された不透明なハンドル。
- `engine_error_code`: VM 固有のエラーコード。
- `error_code`: 最後のエラーの Node-API ステータスコード。

[`napi_get_last_error_info`](/ja/nodejs/api/n-api#napi_get_last_error_info) は、最後に行われた Node-API 呼び出しの情報を返します。

拡張情報のコンテンツまたは形式に依存しないでください。SemVer の対象ではなく、いつでも変更される可能性があります。これは、ロギングのみを目的としています。


#### `napi_get_last_error_info` {#napi_get_last_error_info}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status
napi_get_last_error_info(node_api_basic_env env,
                         const napi_extended_error_info** result);
```
- `[in] env`: APIが起動される環境。
- `[out] result`: エラーに関する詳細情報を持つ `napi_extended_error_info` 構造体。

APIが成功した場合は `napi_ok` を返します。

このAPIは、発生した最後のエラーに関する情報を持つ `napi_extended_error_info` 構造体を取得します。

返される `napi_extended_error_info` の内容は、同じ `env` で Node-API 関数が呼び出されるまでのみ有効です。 これには `napi_is_exception_pending` の呼び出しも含まれるため、後で使用できるように情報をコピーする必要があることがよくあります。 `error_message` で返されるポインターは静的に定義された文字列を指しているため、別のNode-API関数が呼び出される前に `error_message` フィールド（上書きされます）からコピーした場合、そのポインターを安全に使用できます。

拡張情報の内容または形式に依存しないでください。SemVerの対象ではなく、いつでも変更される可能性があります。 これはロギングのみを目的としています。

このAPIは、JavaScriptの例外が保留中の場合でも呼び出すことができます。

### 例外 {#exceptions}

Node-API 関数の呼び出しは、保留中の JavaScript 例外を引き起こす可能性があります。 これは、JavaScript の実行を引き起こさない API 関数にも当てはまります。

関数から返される `napi_status` が `napi_ok` の場合、例外は保留されておらず、追加のアクションは必要ありません。 返される `napi_status` が `napi_ok` または `napi_pending_exception` 以外の場合は、単にすぐに戻るのではなく、回復して続行しようとするために、例外が保留中かどうかを判断するために [`napi_is_exception_pending`](/ja/nodejs/api/n-api#napi_is_exception_pending) を呼び出す必要があります。

多くの場合、Node-API 関数が呼び出され、例外がすでに保留中の場合、関数は `napi_status` の `napi_pending_exception` で直ちに返されます。 ただし、これはすべての関数に当てはまるわけではありません。 Node-APIを使用すると、JavaScriptに戻る前に最小限のクリーンアップを行うために、関数のサブセットを呼び出すことができます。 その場合、`napi_status` は関数のステータスを反映します。 以前の保留中の例外は反映されません。 混乱を避けるために、すべての関数呼び出しの後にエラーステータスを確認してください。

例外が保留中の場合は、2つのアプローチのいずれかを採用できます。

最初のアプローチは、適切なクリーンアップを実行し、実行がJavaScriptに戻るように戻ることです。 JavaScriptへのトランジションの一部として、例外はネイティブメソッドが呼び出されたJavaScriptコードのポイントでスローされます。 ほとんどの Node-API 呼び出しの動作は、例外が保留中の場合は指定されておらず、多くの場合、`napi_pending_exception` が返されるだけなので、できるだけ少なくして JavaScript に戻り、例外を処理できます。

2番目のアプローチは、例外を処理しようとすることです。 ネイティブコードが例外をキャッチし、適切なアクションを実行して、続行できる場合があります。 これは、例外を安全に処理できることがわかっている特定のケースでのみ推奨されます。 これらの場合、[`napi_get_and_clear_last_exception`](/ja/nodejs/api/n-api#napi_get_and_clear_last_exception) を使用して、例外を取得してクリアできます。 成功すると、result には、最後にスローされた JavaScript `Object` へのハンドルが含まれます。 例外を取得した後、例外を処理できないと判断した場合は、[`napi_throw`](/ja/nodejs/api/n-api#napi_throw) で再度スローできます。ここで、error はスローされる JavaScript 値です。

ネイティブコードが例外をスローする必要がある場合、または `napi_value` が JavaScript `Error` オブジェクトのインスタンスであるかどうかを判断する必要がある場合に備えて、次のユーティリティ関数も使用できます：[`napi_throw_error`](/ja/nodejs/api/n-api#napi_throw_error), [`napi_throw_type_error`](/ja/nodejs/api/n-api#napi_throw_type_error), [`napi_throw_range_error`](/ja/nodejs/api/n-api#napi_throw_range_error), [`node_api_throw_syntax_error`](/ja/nodejs/api/n-api#node_api_throw_syntax_error) および [`napi_is_error`](/ja/nodejs/api/n-api#napi_is_error)。

ネイティブコードが `Error` オブジェクトを作成する必要がある場合に備えて、次のユーティリティ関数も使用できます：[`napi_create_error`](/ja/nodejs/api/n-api#napi_create_error), [`napi_create_type_error`](/ja/nodejs/api/n-api#napi_create_type_error), [`napi_create_range_error`](/ja/nodejs/api/n-api#napi_create_range_error) および [`node_api_create_syntax_error`](/ja/nodejs/api/n-api#node_api_create_syntax_error)。ここで、result は新しく作成された JavaScript `Error` オブジェクトを参照する `napi_value` です。

Node.jsプロジェクトは、内部で生成されるすべてのエラーにエラーコードを追加しています。 目標は、アプリケーションがすべてのエラーチェックにこれらのエラーコードを使用することです。 関連するエラーメッセージは残りますが、ロギングと表示のみに使用することを目的としており、メッセージはSemVerを適用せずに変更できると予想されます。 Node-APIでこのモデルをサポートするために、内部機能とモジュール固有の機能の両方（優れたプラクティスとして）、`throw_` および `create_` 関数は、エラーオブジェクトに追加されるコードの文字列であるオプションのコードパラメータを取ります。 オプションのパラメータが `NULL` の場合、エラーに関連付けられるコードはありません。 コードが指定されている場合、エラーに関連付けられている名前も次のように更新されます。

```text [TEXT]
originalName [code]
```
ここで、`originalName` はエラーに関連付けられている元の名前であり、`code` は指定されたコードです。 たとえば、コードが `'ERR_ERROR_1'` で、`TypeError` が作成されている場合、名前は次のようになります。

```text [TEXT]
TypeError [ERR_ERROR_1]
```

#### `napi_throw` {#napi_throw}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw(napi_env env, napi_value error);
```
- `[in] env`: APIが呼び出される環境。
- `[in] error`: スローされるJavaScriptの値。

APIが成功した場合、`napi_ok`を返します。

このAPIは、提供されたJavaScriptの値をスローします。

#### `napi_throw_error` {#napi_throw_error}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw_error(napi_env env,
                                         const char* code,
                                         const char* msg);
```
- `[in] env`: APIが呼び出される環境。
- `[in] code`: エラーに設定されるオプションのエラーコード。
- `[in] msg`: エラーに関連付けられるテキストを表すC文字列。

APIが成功した場合、`napi_ok`を返します。

このAPIは、提供されたテキストを持つJavaScriptの`Error`をスローします。

#### `napi_throw_type_error` {#napi_throw_type_error}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw_type_error(napi_env env,
                                              const char* code,
                                              const char* msg);
```
- `[in] env`: APIが呼び出される環境。
- `[in] code`: エラーに設定されるオプションのエラーコード。
- `[in] msg`: エラーに関連付けられるテキストを表すC文字列。

APIが成功した場合、`napi_ok`を返します。

このAPIは、提供されたテキストを持つJavaScriptの`TypeError`をスローします。

#### `napi_throw_range_error` {#napi_throw_range_error}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw_range_error(napi_env env,
                                               const char* code,
                                               const char* msg);
```
- `[in] env`: APIが呼び出される環境。
- `[in] code`: エラーに設定されるオプションのエラーコード。
- `[in] msg`: エラーに関連付けられるテキストを表すC文字列。

APIが成功した場合、`napi_ok`を返します。

このAPIは、提供されたテキストを持つJavaScriptの`RangeError`をスローします。


#### `node_api_throw_syntax_error` {#node_api_throw_syntax_error}

**追加:** v17.2.0, v16.14.0

**N-APIバージョン:** 9

```C [C]
NAPI_EXTERN napi_status node_api_throw_syntax_error(napi_env env,
                                                    const char* code,
                                                    const char* msg);
```
- `[in] env`: APIが呼び出される環境。
- `[in] code`: エラーに設定されるオプションのエラーコード。
- `[in] msg`: エラーに関連付けられるテキストを表すC文字列。

APIが成功した場合、`napi_ok`を返します。

このAPIは、提供されたテキストとともにJavaScript `SyntaxError`をスローします。

#### `napi_is_error` {#napi_is_error}

**追加:** v8.0.0

**N-APIバージョン:** 1

```C [C]
NAPI_EXTERN napi_status napi_is_error(napi_env env,
                                      napi_value value,
                                      bool* result);
```
- `[in] env`: APIが呼び出される環境。
- `[in] value`: チェックされる`napi_value`。
- `[out] result`: `napi_value`がエラーを表す場合はtrue、そうでない場合はfalseに設定されるブール値。

APIが成功した場合、`napi_ok`を返します。

このAPIは、`napi_value`を照会して、エラーオブジェクトを表すかどうかを確認します。

#### `napi_create_error` {#napi_create_error}

**追加:** v8.0.0

**N-APIバージョン:** 1

```C [C]
NAPI_EXTERN napi_status napi_create_error(napi_env env,
                                          napi_value code,
                                          napi_value msg,
                                          napi_value* result);
```
- `[in] env`: APIが呼び出される環境。
- `[in] code`: エラーに関連付けられるエラーコードの文字列を持つオプションの`napi_value`。
- `[in] msg`: `Error`のメッセージとして使用されるJavaScript `string`を参照する`napi_value`。
- `[out] result`: 作成されたエラーを表す`napi_value`。

APIが成功した場合、`napi_ok`を返します。

このAPIは、提供されたテキストとともにJavaScript `Error`を返します。

#### `napi_create_type_error` {#napi_create_type_error}

**追加:** v8.0.0

**N-APIバージョン:** 1

```C [C]
NAPI_EXTERN napi_status napi_create_type_error(napi_env env,
                                               napi_value code,
                                               napi_value msg,
                                               napi_value* result);
```
- `[in] env`: APIが呼び出される環境。
- `[in] code`: エラーに関連付けられるエラーコードの文字列を持つオプションの`napi_value`。
- `[in] msg`: `Error`のメッセージとして使用されるJavaScript `string`を参照する`napi_value`。
- `[out] result`: 作成されたエラーを表す`napi_value`。

APIが成功した場合、`napi_ok`を返します。

このAPIは、提供されたテキストとともにJavaScript `TypeError`を返します。


#### `napi_create_range_error` {#napi_create_range_error}

**Added in: v8.0.0**

**N-API バージョン: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_range_error(napi_env env,
                                                napi_value code,
                                                napi_value msg,
                                                napi_value* result);
```
- `[in] env`: API が呼び出される環境。
- `[in] code`: エラーに関連付けられるエラーコードの文字列を持つオプションの `napi_value`。
- `[in] msg`: `Error` のメッセージとして使用される JavaScript `string` を参照する `napi_value`。
- `[out] result`: 作成されたエラーを表す `napi_value`。

API が成功した場合 `napi_ok` を返します。

この API は、指定されたテキストを持つ JavaScript `RangeError` を返します。

#### `node_api_create_syntax_error` {#node_api_create_syntax_error}

**Added in: v17.2.0, v16.14.0**

**N-API バージョン: 9**

```C [C]
NAPI_EXTERN napi_status node_api_create_syntax_error(napi_env env,
                                                     napi_value code,
                                                     napi_value msg,
                                                     napi_value* result);
```
- `[in] env`: API が呼び出される環境。
- `[in] code`: エラーに関連付けられるエラーコードの文字列を持つオプションの `napi_value`。
- `[in] msg`: `Error` のメッセージとして使用される JavaScript `string` を参照する `napi_value`。
- `[out] result`: 作成されたエラーを表す `napi_value`。

API が成功した場合 `napi_ok` を返します。

この API は、指定されたテキストを持つ JavaScript `SyntaxError` を返します。

#### `napi_get_and_clear_last_exception` {#napi_get_and_clear_last_exception}

**Added in: v8.0.0**

**N-API バージョン: 1**

```C [C]
napi_status napi_get_and_clear_last_exception(napi_env env,
                                              napi_value* result);
```
- `[in] env`: API が呼び出される環境。
- `[out] result`: 保留中の例外がある場合は例外、それ以外の場合は `NULL`。

API が成功した場合 `napi_ok` を返します。

この API は、保留中の JavaScript 例外がある場合でも呼び出すことができます。


#### `napi_is_exception_pending` {#napi_is_exception_pending}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_is_exception_pending(napi_env env, bool* result);
```
- `[in] env`: APIが呼び出される環境。
- `[out] result`: 例外が保留中の場合、trueに設定されるブール値。

APIが成功した場合`napi_ok`を返します。

このAPIは、JavaScriptの例外が保留中の場合でも呼び出すことができます。

#### `napi_fatal_exception` {#napi_fatal_exception}

**Added in: v9.10.0**

**N-API version: 3**

```C [C]
napi_status napi_fatal_exception(napi_env env, napi_value err);
```
- `[in] env`: APIが呼び出される環境。
- `[in] err`: `'uncaughtException'`に渡されるエラー。

JavaScriptで`'uncaughtException'`をトリガーします。非同期コールバックが回復不能な例外をスローする場合に便利です。

### 致命的なエラー {#fatal-errors}

ネイティブアドオンで回復不能なエラーが発生した場合、プロセスを直ちに終了させるために致命的なエラーをスローすることができます。

#### `napi_fatal_error` {#napi_fatal_error}

**Added in: v8.2.0**

**N-API version: 1**

```C [C]
NAPI_NO_RETURN void napi_fatal_error(const char* location,
                                     size_t location_len,
                                     const char* message,
                                     size_t message_len);
```
- `[in] location`: エラーが発生した場所（オプション）。
- `[in] location_len`: 場所の長さをバイト単位で指定します。null終端の場合は`NAPI_AUTO_LENGTH`。
- `[in] message`: エラーに関連付けられたメッセージ。
- `[in] message_len`: メッセージの長さをバイト単位で指定します。null終端の場合は`NAPI_AUTO_LENGTH`。

この関数呼び出しは戻らず、プロセスは終了します。

このAPIは、JavaScriptの例外が保留中の場合でも呼び出すことができます。

## オブジェクトのライフタイム管理 {#object-lifetime-management}

Node-APIの呼び出しが行われると、基盤となるVMのヒープ内のオブジェクトへのハンドルは`napi_values`として返されることがあります。 これらのハンドルは、ネイティブコードが必要としなくなるまでオブジェクトを「ライブ」に保つ必要があります。そうしないと、ネイティブコードが使用を終える前にオブジェクトが収集される可能性があります。

オブジェクトハンドルが返されると、それらは「スコープ」に関連付けられます。 デフォルトのスコープの有効期間は、ネイティブメソッド呼び出しの有効期間に関連付けられています。 その結果、デフォルトでは、ハンドルは有効なままであり、これらのハンドルに関連付けられたオブジェクトは、ネイティブメソッド呼び出しの有効期間中ライブに保持されます。

ただし、多くの場合、ハンドルがネイティブメソッドの有効期間よりも短いまたは長い有効期間を維持する必要がある場合があります。 以下のセクションでは、ハンドル の寿命をデフォルトから変更するために使用できるNode-API関数について説明します。


### ネイティブメソッドの寿命よりも短いハンドルの寿命を作る {#making-handle-lifespan-shorter-than-that-of-the-native-method}

多くの場合、ネイティブメソッドの寿命よりもハンドルの寿命を短くする必要があります。たとえば、大きな配列の要素を反復処理するループを持つネイティブメソッドについて考えてみます。

```C [C]
for (int i = 0; i < 1000000; i++) {
  napi_value result;
  napi_status status = napi_get_element(env, object, i, &result);
  if (status != napi_ok) {
    break;
  }
  // do something with element
}
```
これにより、多数のハンドルが作成され、多大なリソースが消費されることになります。さらに、ネイティブコードが最新のハンドルしか使用できない場合でも、すべての関連オブジェクトは同じスコープを共有するため、すべて保持されます。

この場合に対応するために、Node-API は、新しく作成されたハンドルが関連付けられる新しい「スコープ」を確立する機能を提供します。これらのハンドルが不要になったら、スコープを「閉じる」ことができ、スコープに関連付けられているすべてのハンドルは無効になります。スコープを開閉するために利用できるメソッドは、[`napi_open_handle_scope`](/ja/nodejs/api/n-api#napi_open_handle_scope) および [`napi_close_handle_scope`](/ja/nodejs/api/n-api#napi_close_handle_scope) です。

Node-API は、スコープの単一の入れ子になった階層のみをサポートします。アクティブなスコープは常に 1 つだけであり、アクティブな間はすべての新しいハンドルがそのスコープに関連付けられます。スコープは、開かれた順序と逆の順序で閉じる必要があります。さらに、ネイティブメソッド内で作成されたすべてのスコープは、そのメソッドから戻る前に閉じる必要があります。

前の例を取り上げて、[`napi_open_handle_scope`](/ja/nodejs/api/n-api#napi_open_handle_scope) および [`napi_close_handle_scope`](/ja/nodejs/api/n-api#napi_close_handle_scope) への呼び出しを追加すると、ループの実行全体で最大で 1 つのハンドルが有効であることが保証されます。

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
  // do something with element
  status = napi_close_handle_scope(env, scope);
  if (status != napi_ok) {
    break;
  }
}
```
スコープを入れ子にすると、内側のスコープからのハンドルがそのスコープの寿命を超えて存続する必要がある場合があります。Node-API は、この場合をサポートするために「エスケープ可能スコープ」をサポートしています。エスケープ可能スコープを使用すると、1 つのハンドルを「昇格」させて、現在のスコープから「エスケープ」させることができ、ハンドルの寿命が現在のスコープから外側のスコープの寿命に変わります。

エスケープ可能スコープを開閉するために利用できるメソッドは、[`napi_open_escapable_handle_scope`](/ja/nodejs/api/n-api#napi_open_escapable_handle_scope) および [`napi_close_escapable_handle_scope`](/ja/nodejs/api/n-api#napi_close_escapable_handle_scope) です。

ハンドルの昇格要求は、一度しか呼び出すことができない [`napi_escape_handle`](/ja/nodejs/api/n-api#napi_escape_handle) を介して行われます。


#### `napi_open_handle_scope` {#napi_open_handle_scope}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
NAPI_EXTERN napi_status napi_open_handle_scope(napi_env env,
                                               napi_handle_scope* result);
```
- `[in] env`: APIが呼び出される環境。
- `[out] result`: 新しいスコープを表す`napi_value`。

APIが成功した場合は`napi_ok`を返します。

このAPIは新しいスコープを開きます。

#### `napi_close_handle_scope` {#napi_close_handle_scope}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
NAPI_EXTERN napi_status napi_close_handle_scope(napi_env env,
                                                napi_handle_scope scope);
```
- `[in] env`: APIが呼び出される環境。
- `[in] scope`: 閉じられるスコープを表す`napi_value`。

APIが成功した場合は`napi_ok`を返します。

このAPIは渡されたスコープを閉じます。スコープは作成された順序と逆の順序で閉じなければなりません。

このAPIは、保留中のJavaScript例外がある場合でも呼び出すことができます。

#### `napi_open_escapable_handle_scope` {#napi_open_escapable_handle_scope}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
NAPI_EXTERN napi_status
    napi_open_escapable_handle_scope(napi_env env,
                                     napi_handle_scope* result);
```
- `[in] env`: APIが呼び出される環境。
- `[out] result`: 新しいスコープを表す`napi_value`。

APIが成功した場合は`napi_ok`を返します。

このAPIは、1つのオブジェクトを外側のスコープに昇格させることができる新しいスコープを開きます。

#### `napi_close_escapable_handle_scope` {#napi_close_escapable_handle_scope}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
NAPI_EXTERN napi_status
    napi_close_escapable_handle_scope(napi_env env,
                                      napi_handle_scope scope);
```
- `[in] env`: APIが呼び出される環境。
- `[in] scope`: 閉じられるスコープを表す`napi_value`。

APIが成功した場合は`napi_ok`を返します。

このAPIは渡されたスコープを閉じます。スコープは作成された順序と逆の順序で閉じなければなりません。

このAPIは、保留中のJavaScript例外がある場合でも呼び出すことができます。


#### `napi_escape_handle` {#napi_escape_handle}

**追加:** v8.0.0

**N-API バージョン:** 1

```C [C]
napi_status napi_escape_handle(napi_env env,
                               napi_escapable_handle_scope scope,
                               napi_value escapee,
                               napi_value* result);
```
- `[in] env`: APIが呼び出される環境。
- `[in] scope`: 現在のスコープを表す `napi_value`。
- `[in] escapee`: エスケープされるJavaScriptの `Object` を表す `napi_value`。
- `[out] result`: 外側のスコープでエスケープされた `Object` へのハンドルを表す `napi_value`。

APIが成功した場合は `napi_ok` を返します。

このAPIは、JavaScriptオブジェクトへのハンドルを昇格させ、外側のスコープの有効期間中有効になるようにします。 これはスコープごとに1回のみ呼び出すことができます。 複数回呼び出すと、エラーが返されます。

このAPIは、保留中のJavaScript例外がある場合でも呼び出すことができます。

### ネイティブメソッドの有効期間よりも長い有効期間を持つ値への参照 {#references-to-values-with-a-lifespan-longer-than-that-of-the-native-method}

場合によっては、アドオンが単一のネイティブメソッド呼び出しよりも長い有効期間を持つ値を作成および参照できる必要が生じます。 たとえば、コンストラクターを作成し、後でインスタンスを作成するリクエストでそのコンストラクターを使用するには、多くの異なるインスタンス作成リクエスト間でコンストラクターオブジェクトを参照できる必要があります。 これは、前のセクションで説明したように、 `napi_value` として返される通常のハンドルでは不可能になります。 通常のハンドルの有効期間はスコープによって管理され、すべてのスコープはネイティブメソッドの終了前に閉じられる必要があります。

Node-APIは、値への永続的な参照を作成するためのメソッドを提供します。 現在、Node-APIは、オブジェクト、外部、関数、シンボルを含む、限られた値の型に対してのみ参照の作成を許可しています。

各参照には、関連付けられたカウントがあり、値は0以上です。このカウントは、参照が対応する値を保持するかどうかを決定します。 カウントが0の参照は、値が収集されるのを防ぎません。 オブジェクト (オブジェクト、関数、外部) およびシンボル型の値は、「弱い」参照になりつつあり、収集されなくてもアクセスできます。 0より大きいカウントは、値が収集されるのを防ぎます。

シンボル値には、さまざまな種類があります。 真の弱い参照動作は、 `napi_create_symbol` 関数またはJavaScriptの `Symbol()` コンストラクター呼び出しで作成されたローカルシンボルでのみサポートされます。 `node_api_symbol_for` 関数またはJavaScriptの `Symbol.for()` 関数呼び出しで作成されたグローバルに登録されたシンボルは、ガベージコレクターがそれらを収集しないため、常に強い参照のままです。 これは、 `Symbol.iterator` などの既知のシンボルにも当てはまります。 それらもガベージコレクターによって収集されることはありません。

参照は、初期参照カウントで作成できます。 カウントは、[`napi_reference_ref`](/ja/nodejs/api/n-api#napi_reference_ref) および [`napi_reference_unref`](/ja/nodejs/api/n-api#napi_reference_unref) を通じて変更できます。 参照のカウントが0の間にオブジェクトが収集された場合、参照に関連付けられたオブジェクトを取得するための後続のすべての呼び出し [`napi_get_reference_value`](/ja/nodejs/api/n-api#napi_get_reference_value) は、返された `napi_value` に対して `NULL` を返します。 オブジェクトが収集された参照に対して [`napi_reference_ref`](/ja/nodejs/api/n-api#napi_reference_ref) を呼び出そうとすると、エラーが発生します。

参照は、アドオンで不要になったら削除する必要があります。 参照が削除されると、対応するオブジェクトが収集されるのを防ぐことはなくなります。 永続的な参照を削除しないと、永続的な参照のネイティブメモリとヒープ上の対応するオブジェクトの両方が永久に保持される「メモリリーク」が発生します。

同じオブジェクトを参照する複数の永続的な参照を作成できます。各参照は、個々のカウントに基づいてオブジェクトを保持するかどうかを決定します。 同じオブジェクトへの複数の永続的な参照は、ネイティブメモリを予期せず保持する可能性があります。 永続的な参照のネイティブ構造は、参照されるオブジェクトのファイナライザーが実行されるまで保持する必要があります。 同じオブジェクトに対して新しい永続的な参照が作成された場合、そのオブジェクトのファイナライザーは実行されず、以前の永続的な参照が指すネイティブメモリは解放されません。 これは、可能な場合は `napi_reference_unref` に加えて `napi_delete_reference` を呼び出すことで回避できます。

**変更履歴:**

- 実験的 (`NAPI_EXPERIMENTAL` が定義されています): すべての値型に対して参照を作成できます。 新しくサポートされる値型は、弱い参照セマンティクスをサポートしていません。これらの型の値は、参照カウントが0になると解放され、参照からアクセスできなくなります。


#### `napi_create_reference` {#napi_create_reference}

**追加: v8.0.0**

**N-API バージョン: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_reference(napi_env env,
                                              napi_value value,
                                              uint32_t initial_refcount,
                                              napi_ref* result);
```
- `[in] env`: API が呼び出される環境。
- `[in] value`: リファレンスが作成される `napi_value`。
- `[in] initial_refcount`: 新しいリファレンスの初期参照カウント。
- `[out] result`: 新しいリファレンスを指す `napi_ref`。

API が成功した場合は `napi_ok` を返します。

この API は、渡された値に対して、指定された参照カウントを持つ新しいリファレンスを作成します。

#### `napi_delete_reference` {#napi_delete_reference}

**追加: v8.0.0**

**N-API バージョン: 1**

```C [C]
NAPI_EXTERN napi_status napi_delete_reference(napi_env env, napi_ref ref);
```
- `[in] env`: API が呼び出される環境。
- `[in] ref`: 削除される `napi_ref`。

API が成功した場合は `napi_ok` を返します。

この API は、渡されたリファレンスを削除します。

この API は、保留中の JavaScript 例外がある場合でも呼び出すことができます。

#### `napi_reference_ref` {#napi_reference_ref}

**追加: v8.0.0**

**N-API バージョン: 1**

```C [C]
NAPI_EXTERN napi_status napi_reference_ref(napi_env env,
                                           napi_ref ref,
                                           uint32_t* result);
```
- `[in] env`: API が呼び出される環境。
- `[in] ref`: 参照カウントが増加される `napi_ref`。
- `[out] result`: 新しい参照カウント。

API が成功した場合は `napi_ok` を返します。

この API は、渡されたリファレンスの参照カウントを増やし、その結果の参照カウントを返します。

#### `napi_reference_unref` {#napi_reference_unref}

**追加: v8.0.0**

**N-API バージョン: 1**

```C [C]
NAPI_EXTERN napi_status napi_reference_unref(napi_env env,
                                             napi_ref ref,
                                             uint32_t* result);
```
- `[in] env`: API が呼び出される環境。
- `[in] ref`: 参照カウントが減少される `napi_ref`。
- `[out] result`: 新しい参照カウント。

API が成功した場合は `napi_ok` を返します。

この API は、渡されたリファレンスの参照カウントを減らし、その結果の参照カウントを返します。


#### `napi_get_reference_value` {#napi_get_reference_value}

**Added in: v8.0.0**

**N-API バージョン: 1**

```C [C]
NAPI_EXTERN napi_status napi_get_reference_value(napi_env env,
                                                 napi_ref ref,
                                                 napi_value* result);
```
- `[in] env`: API が起動される環境。
- `[in] ref`: 対応する値が要求されている `napi_ref`。
- `[out] result`: `napi_ref` によって参照される `napi_value`。

API が成功した場合、`napi_ok` を返します。

まだ有効な場合、この API は `napi_ref` に関連付けられた JavaScript 値を表す `napi_value` を返します。 そうでない場合、result は `NULL` になります。

### 現在の Node.js 環境の終了時のクリーンアップ {#cleanup-on-exit-of-the-current-nodejs-environment}

通常、Node.js プロセスは終了時にすべてのリソースを解放しますが、Node.js の埋め込みや将来の Worker のサポートでは、アドオンが現在の Node.js 環境の終了時に実行されるクリーンアップフックを登録する必要があります。

Node-API は、このようなコールバックを登録および登録解除するための関数を提供します。 これらのコールバックが実行されると、アドオンによって保持されているすべてのリソースを解放する必要があります。

#### `napi_add_env_cleanup_hook` {#napi_add_env_cleanup_hook}

**Added in: v10.2.0**

**N-API バージョン: 3**

```C [C]
NODE_EXTERN napi_status napi_add_env_cleanup_hook(node_api_basic_env env,
                                                  napi_cleanup_hook fun,
                                                  void* arg);
```
現在の Node.js 環境が終了したら、`arg` パラメータで実行される関数として `fun` を登録します。

関数は、異なる `arg` 値で複数回安全に指定できます。 その場合、複数回呼び出されます。 同じ `fun` と `arg` の値を複数回指定することは許可されておらず、プロセスが中止されます。

フックは逆順に呼び出されます。つまり、最後に追加されたものが最初に呼び出されます。

このフックの削除は、[`napi_remove_env_cleanup_hook`](/ja/nodejs/api/n-api#napi_remove_env_cleanup_hook) を使用して行うことができます。 通常、これは、このフックが追加されたリソースがとにかく破棄されている場合に発生します。

非同期クリーンアップの場合、[`napi_add_async_cleanup_hook`](/ja/nodejs/api/n-api#napi_add_async_cleanup_hook) が利用可能です。


#### `napi_remove_env_cleanup_hook` {#napi_remove_env_cleanup_hook}

**Added in: v10.2.0**

**N-API バージョン: 3**

```C [C]
NAPI_EXTERN napi_status napi_remove_env_cleanup_hook(node_api_basic_env env,
                                                     void (*fun)(void* arg),
                                                     void* arg);
```
現在の Node.js 環境が終了したときに、`arg` パラメーターとともに実行される関数として `fun` の登録を解除します。引数と関数の値は正確に一致する必要があります。

関数は元々 `napi_add_env_cleanup_hook` で登録されている必要があります。そうでない場合、プロセスは中止されます。

#### `napi_add_async_cleanup_hook` {#napi_add_async_cleanup_hook}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v14.10.0, v12.19.0 | `hook` コールバックのシグネチャが変更されました。 |
| v14.8.0, v12.19.0 | Added in: v14.8.0, v12.19.0 |
:::

**N-API バージョン: 8**

```C [C]
NAPI_EXTERN napi_status napi_add_async_cleanup_hook(
    node_api_basic_env env,
    napi_async_cleanup_hook hook,
    void* arg,
    napi_async_cleanup_hook_handle* remove_handle);
```
- `[in] env`: API が呼び出される環境。
- `[in] hook`: 環境の破棄時に呼び出す関数ポインター。 [`napi_async_cleanup_hook`](/ja/nodejs/api/n-api#napi_async_cleanup_hook) 型の関数です。
- `[in] arg`: `hook` が呼び出されたときに渡すポインター。
- `[out] remove_handle`: オプションのハンドルで、非同期クリーンアップフックを参照します。

現在の Node.js 環境が終了したときに、`remove_handle` および `arg` パラメーターとともに実行される関数として、[`napi_async_cleanup_hook`](/ja/nodejs/api/n-api#napi_async_cleanup_hook) 型の関数である `hook` を登録します。

[`napi_add_env_cleanup_hook`](/ja/nodejs/api/n-api#napi_add_env_cleanup_hook) とは異なり、フックは非同期にすることができます。

それ以外の場合、動作は一般的に [`napi_add_env_cleanup_hook`](/ja/nodejs/api/n-api#napi_add_env_cleanup_hook) と一致します。

`remove_handle` が `NULL` でない場合は、不透明な値が格納され、フックがすでに呼び出されているかどうかに関係なく、後で [`napi_remove_async_cleanup_hook`](/ja/nodejs/api/n-api#napi_remove_async_cleanup_hook) に渡す必要があります。通常、これはこのフックが追加されたリソースが破棄される場合に発生します。


#### `napi_remove_async_cleanup_hook` {#napi_remove_async_cleanup_hook}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.10.0, v12.19.0 | `env` パラメータを削除しました。 |
| v14.8.0, v12.19.0 | v14.8.0, v12.19.0 で追加されました。 |
:::

```C [C]
NAPI_EXTERN napi_status napi_remove_async_cleanup_hook(
    napi_async_cleanup_hook_handle remove_handle);
```
- `[in] remove_handle`: [`napi_add_async_cleanup_hook`](/ja/nodejs/api/n-api#napi_add_async_cleanup_hook) で作成された非同期クリーンアップフックのハンドル。

`remove_handle` に対応するクリーンアップフックの登録を解除します。 これにより、フックがすでに実行を開始している場合を除き、フックの実行が防止されます。 これは、[`napi_add_async_cleanup_hook`](/ja/nodejs/api/n-api#napi_add_async_cleanup_hook) から取得したすべての `napi_async_cleanup_hook_handle` 値に対して呼び出す必要があります。

### Node.js 環境終了時のファイナライゼーション {#finalization-on-the-exit-of-the-nodejs-environment}

Node.js 環境は、JavaScript の実行が禁止されるとすぐに、[`worker.terminate()`](/ja/nodejs/api/worker_threads#workerterminate) のリクエストのように、任意のタイミングで可能な限り早く破棄される可能性があります。 環境が破棄されるとき、JavaScript オブジェクト、スレッドセーフ関数、および環境インスタンスデータに登録されている `napi_finalize` コールバックは、即座に独立して呼び出されます。

`napi_finalize` コールバックの呼び出しは、手動で登録されたクリーンアップフックの後にスケジュールされます。 環境のシャットダウン中にアドオンのファイナライゼーションが適切な順序で行われ、`napi_finalize` コールバックでの使用後解放を回避するために、アドオンは `napi_add_env_cleanup_hook` および `napi_add_async_cleanup_hook` を使用してクリーンアップフックを登録し、割り当てられたリソースを適切な順序で手動で解放する必要があります。

## モジュールの登録 {#module-registration}

Node-API モジュールは、他のモジュールと同様の方法で登録されます。ただし、`NODE_MODULE` マクロの代わりに、次のものが使用されます。

```C [C]
NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
```
次の違いは、`Init` メソッドのシグネチャです。 Node-API モジュールの場合、次のようになります。

```C [C]
napi_value Init(napi_env env, napi_value exports);
```
`Init` からの戻り値は、モジュールの `exports` オブジェクトとして扱われます。 `Init` メソッドには、便宜上 `exports` パラメータを介して空のオブジェクトが渡されます。 `Init` が `NULL` を返す場合、`exports` として渡されたパラメータがモジュールによってエクスポートされます。 Node-API モジュールは `module` オブジェクトを変更できませんが、モジュールの `exports` プロパティとして任意のもの指定できます。

アドオンによって提供されるメソッドとして呼び出すことができるように、メソッド `hello` を関数として追加するには:

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
アドオンの `require()` によって返される関数を設定するには:

```C [C]
napi_value Init(napi_env env, napi_value exports) {
  napi_value method;
  napi_status status;
  status = napi_create_function(env, "exports", NAPI_AUTO_LENGTH, Method, NULL, &method);
  if (status != napi_ok) return NULL;
  return method;
}
```
新しいインスタンスを作成できるようにクラスを定義するには（[オブジェクトのラップ](/ja/nodejs/api/n-api#object-wrap) でよく使用されます）:

```C [C]
// 注: 部分的な例であり、参照されているコードがすべて含まれているわけではありません
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
`NAPI_MODULE_INIT` マクロを使用することもできます。これは `NAPI_MODULE` の省略形として機能し、`Init` 関数を定義します。

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
パラメータ `env` および `exports` は、`NAPI_MODULE_INIT` マクロの本体に提供されます。

すべての Node-API アドオンはコンテキスト認識型です。つまり、複数回ロードされる可能性があります。 このようなモジュールを宣言する際には、いくつかの設計上の考慮事項があります。[コンテキスト認識アドオン](/ja/nodejs/api/addons#context-aware-addons) に関するドキュメントでは、詳細について説明します。

マクロの呼び出し後、変数 `env` および `exports` は関数本体内で使用可能になります。

オブジェクトのプロパティの設定の詳細については、[JavaScript プロパティの操作](/ja/nodejs/api/n-api#working-with-javascript-properties) のセクションを参照してください。

一般的にアドオンモジュールを構築する方法の詳細については、既存の API を参照してください。


## JavaScript 値の操作 {#working-with-javascript-values}

Node-API は、すべての種類の JavaScript 値を作成するための一連の API を公開しています。これらの型のいくつかは、[ECMAScript 言語仕様](https://tc39.github.io/ecma262/) の [セクション 6](https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values) で文書化されています。

基本的に、これらの API は次のいずれかを行うために使用されます。

Node-API 値は、型 `napi_value` で表されます。JavaScript 値を必要とする Node-API 呼び出しは、`napi_value` を受け取ります。場合によっては、API は `napi_value` の型を事前にチェックします。ただし、パフォーマンスを向上させるには、問題の `napi_value` が API によって予期される JavaScript 型であることを呼び出し元が確認する方が良いでしょう。

### Enum 型 {#enum-types}

#### `napi_key_collection_mode` {#napi_key_collection_mode}

**追加: v13.7.0, v12.17.0, v10.20.0**

**N-API バージョン: 6**

```C [C]
typedef enum {
  napi_key_include_prototypes,
  napi_key_own_only
} napi_key_collection_mode;
```
`Keys/Properties` フィルタ enum を記述します。

`napi_key_collection_mode` は、収集されるプロパティの範囲を制限します。

`napi_key_own_only` は、収集されるプロパティを与えられたオブジェクトのみに制限します。 `napi_key_include_prototypes` は、オブジェクトのプロトタイプチェーンのすべてのキーも含まれます。

#### `napi_key_filter` {#napi_key_filter}

**追加: v13.7.0, v12.17.0, v10.20.0**

**N-API バージョン: 6**

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
プロパティフィルタビット。これらは、複合フィルタを構築するために or 演算できます。

#### `napi_key_conversion` {#napi_key_conversion}

**追加: v13.7.0, v12.17.0, v10.20.0**

**N-API バージョン: 6**

```C [C]
typedef enum {
  napi_key_keep_numbers,
  napi_key_numbers_to_strings
} napi_key_conversion;
```
`napi_key_numbers_to_strings` は、整数のインデックスを文字列に変換します。 `napi_key_keep_numbers` は、整数のインデックスに対して数値を返します。

#### `napi_valuetype` {#napi_valuetype}

```C [C]
typedef enum {
  // ES6 型 (typeof に対応)
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
`napi_value` の型を記述します。これは通常、ECMAScript 言語仕様の [セクション 6.1](https://tc39.github.io/ecma262/#sec-ecmascript-language-types) で説明されている型に対応します。そのセクションの型に加えて、`napi_valuetype` は、外部データを持つ `Function` と `Object` も表すことができます。

型 `napi_external` の JavaScript 値は、プロパティを設定できず、プロトタイプがないプレーンオブジェクトとして JavaScript に表示されます。


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
これは、`TypedArray`の基となるバイナリスカラーデータ型を表します。このenumの要素は、[ECMAScript Language Specification](https://tc39.github.io/ecma262/)の[Section 22.2](https://tc39.github.io/ecma262/#sec-typedarray-objects)に対応しています。

### オブジェクト作成関数 {#object-creation-functions}

#### `napi_create_array` {#napi_create_array}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_create_array(napi_env env, napi_value* result)
```
- `[in] env`: Node-API呼び出しが実行される環境。
- `[out] result`: JavaScript `Array`を表す`napi_value`。

APIが成功した場合は`napi_ok`を返します。

このAPIは、JavaScript `Array`型に対応するNode-API値を返します。JavaScript配列は、ECMAScript Language Specificationの[Section 22.1](https://tc39.github.io/ecma262/#sec-array-objects)で説明されています。

#### `napi_create_array_with_length` {#napi_create_array_with_length}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_create_array_with_length(napi_env env,
                                          size_t length,
                                          napi_value* result)
```
- `[in] env`: APIが実行される環境。
- `[in] length`: `Array`の初期の長さ。
- `[out] result`: JavaScript `Array`を表す`napi_value`。

APIが成功した場合は`napi_ok`を返します。

このAPIは、JavaScript `Array`型に対応するNode-API値を返します。`Array`のlengthプロパティは、渡されたlengthパラメータに設定されます。ただし、配列が作成されたときに、基になるバッファがVMによって事前に割り当てられることは保証されません。その動作は、基になるVM実装に委ねられます。バッファがCを介して直接読み取りおよび/または書き込み可能な連続したメモリブロックである必要がある場合は、[`napi_create_external_arraybuffer`](/ja/nodejs/api/n-api#napi_create_external_arraybuffer)の使用を検討してください。

JavaScript配列は、ECMAScript Language Specificationの[Section 22.1](https://tc39.github.io/ecma262/#sec-array-objects)で説明されています。


#### `napi_create_arraybuffer` {#napi_create_arraybuffer}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_create_arraybuffer(napi_env env,
                                    size_t byte_length,
                                    void** data,
                                    napi_value* result)
```
- `[in] env`: APIが起動される環境。
- `[in] length`: 作成する配列バッファーのバイト単位の長さ。
- `[out] data`: `ArrayBuffer`の基礎となるバイトバッファーへのポインター。 `data`はオプションで、`NULL`を渡すことで無視できます。
- `[out] result`: JavaScriptの`ArrayBuffer`を表す`napi_value`。

APIが成功した場合は`napi_ok`を返します。

このAPIは、JavaScriptの`ArrayBuffer`に対応するNode-API値を返します。 `ArrayBuffer`は、固定長のバイナリデータバッファーを表すために使用されます。 通常、`TypedArray`オブジェクトのバッキングバッファーとして使用されます。 割り当てられた`ArrayBuffer`は、渡された`length`パラメーターによってサイズが決定される基礎となるバイトバッファーを持ちます。 基礎となるバッファーは、呼び出し元がバッファーを直接操作したい場合に備えて、オプションで呼び出し元に返されます。 このバッファーは、ネイティブコードからのみ直接書き込むことができます。 JavaScriptからこのバッファーに書き込むには、型付き配列または`DataView`オブジェクトを作成する必要があります。

JavaScriptの`ArrayBuffer`オブジェクトについては、ECMAScript言語仕様の[セクション24.1](https://tc39.github.io/ecma262/#sec-arraybuffer-objects)で説明されています。

#### `napi_create_buffer` {#napi_create_buffer}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_create_buffer(napi_env env,
                               size_t size,
                               void** data,
                               napi_value* result)
```
- `[in] env`: APIが起動される環境。
- `[in] size`: 基礎となるバッファーのバイト単位のサイズ。
- `[out] data`: 基礎となるバッファーへの生のポインター。 `data`はオプションで、`NULL`を渡すことで無視できます。
- `[out] result`: `node::Buffer`を表す`napi_value`。

APIが成功した場合は`napi_ok`を返します。

このAPIは、`node::Buffer`オブジェクトを割り当てます。 これはまだ完全にサポートされているデータ構造ですが、ほとんどの場合、`TypedArray`を使用すれば十分です。


#### `napi_create_buffer_copy` {#napi_create_buffer_copy}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_create_buffer_copy(napi_env env,
                                    size_t length,
                                    const void* data,
                                    void** result_data,
                                    napi_value* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] size`: 入力バッファのサイズ（バイト単位）（新しいバッファのサイズと同じである必要があります）。
- `[in] data`: コピー元の基になるバッファへの生のポインター。
- `[out] result_data`: 新しい `Buffer` の基になるデータバッファへのポインター。`result_data` は、オプションで `NULL` を渡すことで無視できます。
- `[out] result`: `node::Buffer` を表す `napi_value` 。

APIが成功した場合 `napi_ok` を返します。

このAPIは `node::Buffer` オブジェクトを割り当て、渡されたバッファからコピーされたデータで初期化します。これは完全にサポートされているデータ構造ですが、ほとんどの場合 `TypedArray` を使用すれば十分です。

#### `napi_create_date` {#napi_create_date}

**Added in: v11.11.0, v10.17.0**

**N-API version: 5**

```C [C]
napi_status napi_create_date(napi_env env,
                             double time,
                             napi_value* result);
```
- `[in] env`: APIが呼び出される環境。
- `[in] time`: 1970年1月1日UTCからのミリ秒単位のECMAScript時間値。
- `[out] result`: JavaScriptの `Date` を表す `napi_value` 。

APIが成功した場合 `napi_ok` を返します。

このAPIはうるう秒を観測しません。ECMAScriptはPOSIX時間仕様に準拠しているため、無視されます。

このAPIはJavaScriptの `Date` オブジェクトを割り当てます。

JavaScriptの `Date` オブジェクトは、ECMAScript言語仕様の[セクション20.3](https://tc39.github.io/ecma262/#sec-date-objects)で説明されています。

#### `napi_create_external` {#napi_create_external}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_create_external(napi_env env,
                                 void* data,
                                 napi_finalize finalize_cb,
                                 void* finalize_hint,
                                 napi_value* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] data`: 外部データへの生のポインター。
- `[in] finalize_cb`: 外部値が収集されているときに呼び出すオプションのコールバック。[`napi_finalize`](/ja/nodejs/api/n-api#napi_finalize) は詳細を提供します。
- `[in] finalize_hint`: コレクション中にfinalizeコールバックに渡すオプションのヒント。
- `[out] result`: 外部値を表す `napi_value` 。

APIが成功した場合 `napi_ok` を返します。

このAPIは、外部データが添付されたJavaScript値を割り当てます。これは、JavaScriptコードを介して外部データを渡し、後で [`napi_get_value_external`](/ja/nodejs/api/n-api#napi_get_value_external) を使用してネイティブコードで取得するために使用されます。

このAPIは、作成されたJavaScriptオブジェクトがガベージコレクションされたときに呼び出される `napi_finalize` コールバックを追加します。

作成された値はオブジェクトではないため、追加のプロパティをサポートしていません。これは個別の値の型と見なされます。外部値で `napi_typeof()` を呼び出すと `napi_external` が生成されます。


#### `napi_create_external_arraybuffer` {#napi_create_external_arraybuffer}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status
napi_create_external_arraybuffer(napi_env env,
                                 void* external_data,
                                 size_t byte_length,
                                 napi_finalize finalize_cb,
                                 void* finalize_hint,
                                 napi_value* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] external_data`: `ArrayBuffer`の基となるバイトバッファへのポインタ。
- `[in] byte_length`: 基となるバッファのバイト単位の長さ。
- `[in] finalize_cb`: `ArrayBuffer`が回収される際に呼び出されるオプションのコールバック。 [`napi_finalize`](/ja/nodejs/api/n-api#napi_finalize) で詳細を確認してください。
- `[in] finalize_hint`: 回収中にファイナライズコールバックに渡すオプションのヒント。
- `[out] result`: JavaScriptの`ArrayBuffer`を表す`napi_value`。

APIが成功した場合、`napi_ok`を返します。

**Node.js以外のいくつかのランタイムでは、外部バッファのサポートが削除されています。** Node.js以外のランタイムでは、このメソッドは外部バッファがサポートされていないことを示すために`napi_no_external_buffers_allowed`を返すことがあります。 そのようなランタイムの1つは、このissue [electron/issues/35801](https://github.com/electron/electron/issues/35801) で説明されているElectronです。

すべてのランタイムとの幅広い互換性を維持するために、node-apiヘッダーのインクルード前にアドオンで`NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED`を定義できます。 そうすることで、外部バッファを作成する2つの関数が非表示になります。 これにより、誤ってこれらのメソッドのいずれかを使用した場合にコンパイルエラーが発生することが保証されます。

このAPIは、JavaScriptの`ArrayBuffer`に対応するNode-API値を返します。 `ArrayBuffer`の基となるバイトバッファは外部で割り当てられ、管理されます。 呼び出し元は、ファイナライズコールバックが呼び出されるまで、バイトバッファが有効なままであることを確認する必要があります。

このAPIは、作成されたJavaScriptオブジェクトがガベージコレクションされたときに呼び出される`napi_finalize`コールバックを追加します。

JavaScriptの`ArrayBuffer`は、ECMAScript言語仕様の[セクション24.1](https://tc39.github.io/ecma262/#sec-arraybuffer-objects)で説明されています。


#### `napi_create_external_buffer` {#napi_create_external_buffer}

**追加:** v8.0.0

**N-API バージョン:** 1

```C [C]
napi_status napi_create_external_buffer(napi_env env,
                                        size_t length,
                                        void* data,
                                        napi_finalize finalize_cb,
                                        void* finalize_hint,
                                        napi_value* result)
```
- `[in] env`: API が呼び出される環境。
- `[in] length`: 入力バッファのバイト単位のサイズ (新しいバッファのサイズと同じである必要があります)。
- `[in] data`: JavaScript に公開する基盤となるバッファへの生のポインタ。
- `[in] finalize_cb`: `ArrayBuffer` が回収されるときに呼び出されるオプションのコールバック。 [`napi_finalize`](/ja/nodejs/api/n-api#napi_finalize) で詳細を確認してください。
- `[in] finalize_hint`: 回収時に finalize コールバックに渡すオプションのヒント。
- `[out] result`: `node::Buffer` を表す `napi_value`。

API が成功した場合は `napi_ok` を返します。

**Node.js 以外のいくつかのランタイムでは、外部バッファのサポートが廃止されています。** Node.js 以外のランタイムでは、このメソッドは、外部バッファがサポートされていないことを示すために `napi_no_external_buffers_allowed` を返す場合があります。 このようなランタイムの 1 つは、この問題 [electron/issues/35801](https://github.com/electron/electron/issues/35801) に記載されている Electron です。

すべてのランタイムとの最大の互換性を維持するために、node-api ヘッダーのインクルードの前に、アドオンで `NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED` を定義することができます。 そうすることで、外部バッファを作成する 2 つの関数が非表示になります。 これにより、誤ってこれらのメソッドのいずれかを使用すると、コンパイルエラーが発生することが保証されます。

この API は `node::Buffer` オブジェクトを割り当て、渡されたバッファによってバックアップされたデータで初期化します。 これは依然として完全にサポートされているデータ構造ですが、ほとんどの場合、`TypedArray` を使用すれば十分です。

この API は、作成された JavaScript オブジェクトがガベージコレクションされたときに呼び出される `napi_finalize` コールバックを追加します。

Node.js >=4 の場合、`Buffers` は `Uint8Array` です。


#### `napi_create_object` {#napi_create_object}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_create_object(napi_env env, napi_value* result)
```
- `[in] env`: APIが呼び出される環境。
- `[out] result`: JavaScriptの`Object`を表す`napi_value`。

APIが成功した場合、`napi_ok`を返します。

このAPIは、デフォルトのJavaScript `Object`を割り当てます。 これは、JavaScriptで `new Object()` を実行するのと同じです。

JavaScriptの`Object`型は、ECMAScript言語仕様の[セクション6.1.7](https://tc39.github.io/ecma262/#sec-object-type)で説明されています。

#### `napi_create_symbol` {#napi_create_symbol}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_create_symbol(napi_env env,
                               napi_value description,
                               napi_value* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] description`: シンボルの説明として設定されるJavaScript `string`を参照するオプションの`napi_value`。
- `[out] result`: JavaScriptの`symbol`を表す`napi_value`。

APIが成功した場合、`napi_ok`を返します。

このAPIは、UTF8エンコードされたC文字列からJavaScriptの`symbol`値を作成します。

JavaScriptの`symbol`型は、ECMAScript言語仕様の[セクション19.4](https://tc39.github.io/ecma262/#sec-symbol-objects)で説明されています。

#### `node_api_symbol_for` {#node_api_symbol_for}

**Added in: v17.5.0, v16.15.0**

**N-API version: 9**

```C [C]
napi_status node_api_symbol_for(napi_env env,
                                const char* utf8description,
                                size_t length,
                                napi_value* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] utf8description`: シンボルの説明として使用されるテキストを表すUTF-8 C文字列。
- `[in] length`: 説明文字列の長さ（バイト単位）。null終端の場合は`NAPI_AUTO_LENGTH`。
- `[out] result`: JavaScriptの`symbol`を表す`napi_value`。

APIが成功した場合、`napi_ok`を返します。

このAPIは、指定された説明を持つ既存のシンボルをグローバルレジストリで検索します。 シンボルがすでに存在する場合はそれが返され、存在しない場合はレジストリに新しいシンボルが作成されます。

JavaScriptの`symbol`型は、ECMAScript言語仕様の[セクション19.4](https://tc39.github.io/ecma262/#sec-symbol-objects)で説明されています。


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
- `[in] env`: APIが呼び出される環境。
- `[in] type`: `TypedArray`内の要素のスカラーデータ型。
- `[in] length`: `TypedArray`内の要素数。
- `[in] arraybuffer`: 型付き配列の基礎となる`ArrayBuffer`。
- `[in] byte_offset`: `TypedArray`の投影を開始する`ArrayBuffer`内のバイトオフセット。
- `[out] result`: JavaScriptの`TypedArray`を表す`napi_value`。

APIが成功した場合、`napi_ok`を返します。

このAPIは、既存の`ArrayBuffer`上にJavaScriptの`TypedArray`オブジェクトを作成します。`TypedArray`オブジェクトは、各要素が同じ基礎となるバイナリスカラーデータ型を持つ、基礎となるデータバッファー上の配列のようなビューを提供します。

`(length * size_of_element) + byte_offset`が、渡された配列のバイトサイズ以下である必要があります。そうでない場合、`RangeError`例外が発生します。

JavaScriptの`TypedArray`オブジェクトは、ECMAScript言語仕様の[セクション22.2](https://tc39.github.io/ecma262/#sec-typedarray-objects)で説明されています。

#### `node_api_create_buffer_from_arraybuffer` {#node_api_create_buffer_from_arraybuffer}

**Added in: v23.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

```C [C]
napi_status NAPI_CDECL node_api_create_buffer_from_arraybuffer(napi_env env,
                                                              napi_value arraybuffer,
                                                              size_t byte_offset,
                                                              size_t byte_length,
                                                              napi_value* result)
```
- **<code>[in] env</code>**: APIが呼び出される環境。
- **<code>[in] arraybuffer</code>**: バッファーの作成元となる `ArrayBuffer`。
- **<code>[in] byte_offset</code>**: バッファーの作成を開始する `ArrayBuffer` 内のバイトオフセット。
- **<code>[in] byte_length</code>**: `ArrayBuffer` から作成するバッファーのバイト単位の長さ。
- **<code>[out] result</code>**: 作成された JavaScript `Buffer` オブジェクトを表す `napi_value`。

APIが成功した場合、`napi_ok` を返します。

このAPIは、既存の `ArrayBuffer` から JavaScript `Buffer` オブジェクトを作成します。 `Buffer` オブジェクトは Node.js 固有のクラスであり、JavaScript でバイナリデータを直接操作する方法を提供します。

バイト範囲 `[byte_offset, byte_offset + byte_length)` は、`ArrayBuffer` の範囲内になければなりません。 `byte_offset + byte_length` が `ArrayBuffer` のサイズを超える場合、`RangeError` 例外が発生します。


#### `napi_create_dataview` {#napi_create_dataview}

**Added in: v8.3.0**

**N-API version: 1**

```C [C]
napi_status napi_create_dataview(napi_env env,
                                 size_t byte_length,
                                 napi_value arraybuffer,
                                 size_t byte_offset,
                                 napi_value* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] length`: `DataView` 内の要素数。
- `[in] arraybuffer`: `DataView` の基となる `ArrayBuffer`。
- `[in] byte_offset`: `DataView` の投影を開始する `ArrayBuffer` 内のバイトオフセット。
- `[out] result`: JavaScript の `DataView` を表す `napi_value`。

API が成功した場合は `napi_ok` を返します。

このAPIは、既存の `ArrayBuffer` 上に JavaScript の `DataView` オブジェクトを作成します。`DataView` オブジェクトは、基となるデータバッファに対する配列のようなビューを提供しますが、`ArrayBuffer` 内のさまざまなサイズと型の項目を許可するものです。

`byte_length + byte_offset` が渡された配列のバイト単位のサイズ以下であることが必要です。そうでない場合、`RangeError` 例外が発生します。

JavaScript の `DataView` オブジェクトは、ECMAScript 言語仕様の [Section 24.3](https://tc39.github.io/ecma262/#sec-dataview-objects) で説明されています。

### C型からNode-APIに変換する関数 {#functions-to-convert-from-c-types-to-node-api}

#### `napi_create_int32` {#napi_create_int32}

**Added in: v8.4.0**

**N-API version: 1**

```C [C]
napi_status napi_create_int32(napi_env env, int32_t value, napi_value* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] value`: JavaScript で表現される整数値。
- `[out] result`: JavaScript の `number` を表す `napi_value`。

API が成功した場合は `napi_ok` を返します。

このAPIは、C の `int32_t` 型から JavaScript の `number` 型への変換に使用されます。

JavaScript の `number` 型は、ECMAScript 言語仕様の [Section 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) で説明されています。


#### `napi_create_uint32` {#napi_create_uint32}

**Added in: v8.4.0**

**N-API バージョン: 1**

```C [C]
napi_status napi_create_uint32(napi_env env, uint32_t value, napi_value* result)
```
- `[in] env`: API が起動される環境。
- `[in] value`: JavaScript で表現される符号なし整数値。
- `[out] result`: JavaScript の `number` を表す `napi_value`。

API が成功した場合は `napi_ok` を返します。

この API は、C の `uint32_t` 型から JavaScript の `number` 型に変換するために使用されます。

JavaScript の `number` 型は、ECMAScript 言語仕様の[セクション 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type)で説明されています。

#### `napi_create_int64` {#napi_create_int64}

**Added in: v8.4.0**

**N-API バージョン: 1**

```C [C]
napi_status napi_create_int64(napi_env env, int64_t value, napi_value* result)
```
- `[in] env`: API が起動される環境。
- `[in] value`: JavaScript で表現される整数値。
- `[out] result`: JavaScript の `number` を表す `napi_value`。

API が成功した場合は `napi_ok` を返します。

この API は、C の `int64_t` 型から JavaScript の `number` 型に変換するために使用されます。

JavaScript の `number` 型は、ECMAScript 言語仕様の[セクション 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type)で説明されています。 `int64_t` の完全な範囲は JavaScript で完全な精度で表現できないことに注意してください。 [`Number.MIN_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.min_safe_integer) `-(2**53 - 1)` - [`Number.MAX_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.max_safe_integer) `(2**53 - 1)` の範囲外の整数値は精度が失われます。

#### `napi_create_double` {#napi_create_double}

**Added in: v8.4.0**

**N-API バージョン: 1**

```C [C]
napi_status napi_create_double(napi_env env, double value, napi_value* result)
```
- `[in] env`: API が起動される環境。
- `[in] value`: JavaScript で表現される倍精度値。
- `[out] result`: JavaScript の `number` を表す `napi_value`。

API が成功した場合は `napi_ok` を返します。

この API は、C の `double` 型から JavaScript の `number` 型に変換するために使用されます。

JavaScript の `number` 型は、ECMAScript 言語仕様の[セクション 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type)で説明されています。


#### `napi_create_bigint_int64` {#napi_create_bigint_int64}

**Added in: v10.7.0**

**N-API version: 6**

```C [C]
napi_status napi_create_bigint_int64(napi_env env,
                                     int64_t value,
                                     napi_value* result);
```
- `[in] env`: APIが呼び出される環境。
- `[in] value`: JavaScriptで表現される整数値。
- `[out] result`: JavaScriptの`BigInt`を表す`napi_value`。

APIが成功した場合は`napi_ok`を返します。

このAPIは、Cの`int64_t`型をJavaScriptの`BigInt`型に変換します。

#### `napi_create_bigint_uint64` {#napi_create_bigint_uint64}

**Added in: v10.7.0**

**N-API version: 6**

```C [C]
napi_status napi_create_bigint_uint64(napi_env env,
                                      uint64_t value,
                                      napi_value* result);
```
- `[in] env`: APIが呼び出される環境。
- `[in] value`: JavaScriptで表現される符号なし整数値。
- `[out] result`: JavaScriptの`BigInt`を表す`napi_value`。

APIが成功した場合は`napi_ok`を返します。

このAPIは、Cの`uint64_t`型をJavaScriptの`BigInt`型に変換します。

#### `napi_create_bigint_words` {#napi_create_bigint_words}

**Added in: v10.7.0**

**N-API version: 6**

```C [C]
napi_status napi_create_bigint_words(napi_env env,
                                     int sign_bit,
                                     size_t word_count,
                                     const uint64_t* words,
                                     napi_value* result);
```
- `[in] env`: APIが呼び出される環境。
- `[in] sign_bit`: 結果の`BigInt`が正か負かを決定します。
- `[in] word_count`: `words`配列の長さ。
- `[in] words`: `uint64_t`のリトルエンディアン64ビットワードの配列。
- `[out] result`: JavaScriptの`BigInt`を表す`napi_value`。

APIが成功した場合は`napi_ok`を返します。

このAPIは、符号なし64ビットワードの配列を単一の`BigInt`値に変換します。

結果の`BigInt`は、次のように計算されます: (–1) (`words[0]` × (2) + `words[1]` × (2) + …)


#### `napi_create_string_latin1` {#napi_create_string_latin1}

**追加:** v8.0.0

**N-API バージョン:** 1

```C [C]
napi_status napi_create_string_latin1(napi_env env,
                                      const char* str,
                                      size_t length,
                                      napi_value* result);
```
- `[in] env`: API が起動される環境。
- `[in] str`: ISO-8859-1 エンコードされた文字列を表す文字バッファー。
- `[in] length`: 文字列のバイト単位の長さ。null 終端されている場合は `NAPI_AUTO_LENGTH`。
- `[out] result`: JavaScript の `string` を表す `napi_value`。

API が成功した場合は `napi_ok` を返します。

この API は、ISO-8859-1 エンコードされた C 文字列から JavaScript の `string` 値を作成します。 ネイティブ文字列はコピーされます。

JavaScript の `string` 型は、ECMAScript 言語仕様の [セクション 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) で説明されています。

#### `node_api_create_external_string_latin1` {#node_api_create_external_string_latin1}

**追加:** v20.4.0, v18.18.0

::: warning [安定: 1 - 試験的]
[安定: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
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
- `[in] env`: API が起動される環境。
- `[in] str`: ISO-8859-1 エンコードされた文字列を表す文字バッファー。
- `[in] length`: 文字列のバイト単位の長さ。null 終端されている場合は `NAPI_AUTO_LENGTH`。
- `[in] finalize_callback`: 文字列が回収されるときに呼び出す関数。 この関数は、次のパラメータで呼び出されます。
    - `[in] env`: アドオンが実行されている環境。 文字列がワーカーまたはメインの Node.js インスタンスの終了の一部として回収されている場合、この値は null になることがあります。
    - `[in] data`: これは `void*` ポインターとしての値 `str` です。
    - `[in] finalize_hint`: これは、API に与えられた値 `finalize_hint` です。 [`napi_finalize`](/ja/nodejs/api/n-api#napi_finalize) に詳細が記載されています。 このパラメータはオプションです。 null 値を渡すことは、対応する JavaScript 文字列が回収されるときにアドオンに通知する必要がないことを意味します。


- `[in] finalize_hint`: 回収中にファイナライズコールバックに渡すオプションのヒント。
- `[out] result`: JavaScript の `string` を表す `napi_value`。
- `[out] copied`: 文字列がコピーされたかどうか。 コピーされた場合、ファイナライザーはすでに `str` を破棄するために呼び出されています。

API が成功した場合は `napi_ok` を返します。

この API は、ISO-8859-1 エンコードされた C 文字列から JavaScript の `string` 値を作成します。 ネイティブ文字列はコピーされない可能性があり、したがって、JavaScript 値のライフサイクル全体にわたって存在する必要があります。

JavaScript の `string` 型は、ECMAScript 言語仕様の [セクション 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) で説明されています。


#### `napi_create_string_utf16` {#napi_create_string_utf16}

**追加:** v8.0.0

**N-API バージョン:** 1

```C [C]
napi_status napi_create_string_utf16(napi_env env,
                                     const char16_t* str,
                                     size_t length,
                                     napi_value* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] str`: UTF16-LEエンコードされた文字列を表す文字バッファ。
- `[in] length`: 文字列の長さを2バイトコード単位で指定します。null終端の場合は`NAPI_AUTO_LENGTH`を指定します。
- `[out] result`: JavaScriptの`string`を表す`napi_value`。

APIが成功した場合は`napi_ok`を返します。

このAPIは、UTF16-LEエンコードされたC文字列からJavaScriptの`string`値を生成します。ネイティブ文字列はコピーされます。

JavaScriptの`string`型については、ECMAScript言語仕様の[セクション6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type)で説明されています。

#### `node_api_create_external_string_utf16` {#node_api_create_external_string_utf16}

**追加:** v20.4.0, v18.18.0

::: warning [安定: 1 - 試験的]
[安定: 1](/ja/nodejs/api/documentation#stability-index) [安定: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
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
- `[in] env`: APIが呼び出される環境。
- `[in] str`: UTF16-LEエンコードされた文字列を表す文字バッファ。
- `[in] length`: 文字列の長さを2バイトコード単位で指定します。null終端の場合は`NAPI_AUTO_LENGTH`を指定します。
- `[in] finalize_callback`: 文字列が回収されるときに呼び出される関数。 この関数は、次のパラメーターで呼び出されます。
    - `[in] env`: アドオンが実行されている環境。 この値は、ワーカーまたはメインのNode.jsインスタンスの終了の一部として文字列が収集されている場合は、nullになる場合があります。
    - `[in] data`: これは、`str`が`void*`ポインターとして渡される値です。
    - `[in] finalize_hint`: これは、APIに渡された`finalize_hint`の値です。 [`napi_finalize`](/ja/nodejs/api/n-api#napi_finalize)には詳細が記載されています。 このパラメータはオプションです。 null値を渡すと、対応するJavaScript文字列が収集されたときにアドオンに通知する必要がないことを意味します。


- `[in] finalize_hint`: コレクション中にファイナライズコールバックに渡すオプションのヒント。
- `[out] result`: JavaScriptの`string`を表す`napi_value`。
- `[out] copied`: 文字列がコピーされたかどうか。 コピーされた場合、ファイナライザーはすでに呼び出されて`str`を破棄しています。

APIが成功した場合は`napi_ok`を返します。

このAPIは、UTF16-LEエンコードされたC文字列からJavaScriptの`string`値を生成します。 ネイティブ文字列はコピーされない場合があり、したがってJavaScript値のライフサイクル全体にわたって存在する必要があります。

JavaScriptの`string`型については、ECMAScript言語仕様の[セクション6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type)で説明されています。


#### `napi_create_string_utf8` {#napi_create_string_utf8}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_create_string_utf8(napi_env env,
                                    const char* str,
                                    size_t length,
                                    napi_value* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] str`: UTF8エンコードされた文字列を表す文字バッファ。
- `[in] length`: バイト単位の文字列長。null終端の場合は`NAPI_AUTO_LENGTH`。
- `[out] result`: JavaScriptの`string`を表す`napi_value`。

APIが成功した場合は`napi_ok`を返します。

このAPIは、UTF8エンコードされたC文字列からJavaScriptの`string`値を作成します。ネイティブ文字列はコピーされます。

JavaScriptの`string`型は、ECMAScript言語仕様の[セクション6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type)で説明されています。

### 最適化されたプロパティキーを作成する関数 {#functions-to-create-optimized-property-keys}

V8を含む多くのJavaScriptエンジンは、内部化された文字列をプロパティ値を設定および取得するためのキーとして使用します。 それらは通常、ハッシュテーブルを使用してそのような文字列を作成およびルックアップします。 キーの作成ごとにコストが追加されますが、文字列全体ではなく文字列ポインタの比較を可能にすることで、その後のパフォーマンスが向上します。

新しいJavaScript文字列をプロパティキーとして使用する場合、一部のJavaScriptエンジンでは、このセクションの関数を使用する方が効率的です。 それ以外の場合は、`napi_create_string_utf8`または`node_api_create_external_string_utf8`シリーズの関数を使用してください。プロパティキーの作成メソッドで文字列を作成/格納する際に、追加のオーバーヘッドが発生する可能性があるためです。

#### `node_api_create_property_key_latin1` {#node_api_create_property_key_latin1}

**Added in: v22.9.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_latin1(napi_env env,
                                                           const char* str,
                                                           size_t length,
                                                           napi_value* result);
```
- `[in] env`: APIが呼び出される環境。
- `[in] str`: ISO-8859-1エンコードされた文字列を表す文字バッファ。
- `[in] length`: バイト単位の文字列長。null終端の場合は`NAPI_AUTO_LENGTH`。
- `[out] result`: オブジェクトのプロパティキーとして使用される、最適化されたJavaScriptの`string`を表す`napi_value`。

APIが成功した場合は`napi_ok`を返します。

このAPIは、オブジェクトのプロパティキーとして使用されるISO-8859-1エンコードされたC文字列から、最適化されたJavaScriptの`string`値を作成します。 ネイティブ文字列はコピーされます。 `napi_create_string_latin1`とは対照的に、同じ`str`ポインタを使用してこの関数を後続呼び出すと、エンジンに応じて、要求された`napi_value`の作成が高速化される可能性があります。

JavaScriptの`string`型は、ECMAScript言語仕様の[セクション6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type)で説明されています。


#### `node_api_create_property_key_utf16` {#node_api_create_property_key_utf16}

**Added in: v21.7.0, v20.12.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - Experimental
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_utf16(napi_env env,
                                                          const char16_t* str,
                                                          size_t length,
                                                          napi_value* result);
```
- `[in] env`: API が呼び出される環境。
- `[in] str`: UTF16-LE エンコードされた文字列を表す文字バッファ。
- `[in] length`: 文字列の長さ（2 バイトのコードユニット単位）。null 終端の場合は `NAPI_AUTO_LENGTH`。
- `[out] result`: オブジェクトのプロパティキーとして使用される最適化された JavaScript の `string` を表す `napi_value`。

API が成功した場合 `napi_ok` を返します。

この API は、オブジェクトのプロパティキーとして使用される UTF16-LE エンコードされた C 文字列から、最適化された JavaScript の `string` 値を作成します。ネイティブ文字列はコピーされます。

JavaScript の `string` 型は、ECMAScript 言語仕様の [セクション 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) で説明されています。

#### `node_api_create_property_key_utf8` {#node_api_create_property_key_utf8}

**Added in: v22.9.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - Experimental
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_utf8(napi_env env,
                                                         const char* str,
                                                         size_t length,
                                                         napi_value* result);
```
- `[in] env`: API が呼び出される環境。
- `[in] str`: UTF8 エンコードされた文字列を表す文字バッファ。
- `[in] length`: 文字列の長さ（2 バイトのコードユニット単位）。null 終端の場合は `NAPI_AUTO_LENGTH`。
- `[out] result`: オブジェクトのプロパティキーとして使用される最適化された JavaScript の `string` を表す `napi_value`。

API が成功した場合 `napi_ok` を返します。

この API は、オブジェクトのプロパティキーとして使用される UTF8 エンコードされた C 文字列から、最適化された JavaScript の `string` 値を作成します。ネイティブ文字列はコピーされます。

JavaScript の `string` 型は、ECMAScript 言語仕様の [セクション 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) で説明されています。


### Node-API から C の型に変換する関数 {#functions-to-convert-from-node-api-to-c-types}

#### `napi_get_array_length` {#napi_get_array_length}

**追加: v8.0.0**

**N-API バージョン: 1**

```C [C]
napi_status napi_get_array_length(napi_env env,
                                  napi_value value,
                                  uint32_t* result)
```
- `[in] env`: API が呼び出される環境。
- `[in] value`: 長さを問い合わせる JavaScript `Array` を表す `napi_value`。
- `[out] result`: 配列の長さを表す `uint32`。

API が成功した場合 `napi_ok` を返します。

この API は、配列の長さを返します。

`Array` の長さは、ECMAScript 言語仕様の [セクション 22.1.4.1](https://tc39.github.io/ecma262/#sec-properties-of-array-instances-length) で説明されています。

#### `napi_get_arraybuffer_info` {#napi_get_arraybuffer_info}

**追加: v8.0.0**

**N-API バージョン: 1**

```C [C]
napi_status napi_get_arraybuffer_info(napi_env env,
                                      napi_value arraybuffer,
                                      void** data,
                                      size_t* byte_length)
```
- `[in] env`: API が呼び出される環境。
- `[in] arraybuffer`: 問い合わせる `ArrayBuffer` を表す `napi_value`。
- `[out] data`: `ArrayBuffer` の基になるデータバッファ。 byte_length が `0` の場合、これは `NULL` または他の任意のポインタ値になる可能性があります。
- `[out] byte_length`: 基になるデータバッファのバイト単位の長さ。

API が成功した場合 `napi_ok` を返します。

この API は、`ArrayBuffer` の基になるデータバッファとその長さを取得するために使用されます。

*警告*: この API を使用する際は注意してください。 基になるデータバッファのライフタイムは、返された後でも `ArrayBuffer` によって管理されます。 この API を安全に使用できる可能性のある方法は、[`napi_create_reference`](/ja/nodejs/api/n-api#napi_create_reference) と組み合わせて使用​​することです。これは、`ArrayBuffer` のライフタイムの制御を保証するために使用できます。 また、GC をトリガーする可能性のある他の API を呼び出さない限り、同じコールバック内で返されたデータバッファを使用しても安全です。


#### `napi_get_buffer_info` {#napi_get_buffer_info}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_buffer_info(napi_env env,
                                 napi_value value,
                                 void** data,
                                 size_t* length)
```
- `[in] env`: APIが呼び出される環境。
- `[in] value`: クエリされる`node::Buffer`または`Uint8Array`を表す`napi_value`。
- `[out] data`: `node::Buffer`または`Uint8Array`の基になるデータバッファー。 lengthが`0`の場合、これは`NULL`または他の任意のポインタ値である可能性があります。
- `[out] length`: 基になるデータバッファーのバイト単位の長さ。

APIが成功した場合、`napi_ok`を返します。

このメソッドは、[`napi_get_typedarray_info`](/ja/nodejs/api/n-api#napi_get_typedarray_info)と同一の`data`と`byte_length`を返します。 また、`napi_get_typedarray_info`は、`node::Buffer`（Uint8Array）も値として受け入れます。

このAPIは、`node::Buffer`の基になるデータバッファーとその長さを取得するために使用されます。

*警告*: 基になるデータバッファーの有効期間がVMによって管理されている場合、このAPIの使用には注意が必要です。

#### `napi_get_prototype` {#napi_get_prototype}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_prototype(napi_env env,
                               napi_value object,
                               napi_value* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] object`: プロトタイプを返すJavaScript `Object`を表す`napi_value`。 これは、`Object.getPrototypeOf`と同等です（関数の`prototype`プロパティと同じではありません）。
- `[out] result`: 指定されたオブジェクトのプロトタイプを表す`napi_value`。

APIが成功した場合、`napi_ok`を返します。

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
- `[in] env`: APIが呼び出される環境。
- `[in] typedarray`: プロパティをクエリする`TypedArray`を表す`napi_value`。
- `[out] type`: `TypedArray`内の要素のスカラーデータ型。
- `[out] length`: `TypedArray`内の要素数。
- `[out] data`: `TypedArray`の最初の要素を指すように`byte_offset`値で調整された、`TypedArray`の基になるデータバッファー。 配列の長さが `0` の場合、これは `NULL` または他の任意のポインタ値である可能性があります。
- `[out] arraybuffer`: `TypedArray`の基になる`ArrayBuffer`。
- `[out] byte_offset`: 配列の最初の要素が配置される、基になるネイティブ配列内のバイトオフセット。 dataパラメーターの値は、配列の最初の要素をdataが指すようにすでに調整されています。 したがって、ネイティブ配列の最初のバイトは `data - byte_offset` になります。

APIが成功した場合、`napi_ok`を返します。

このAPIは、型付き配列のさまざまなプロパティを返します。

そのプロパティが不要な場合、出力パラメーターのいずれかが `NULL` になる場合があります。

*警告*: 基になるデータバッファーはVMによって管理されているため、このAPIの使用には注意が必要です。


#### `napi_get_dataview_info` {#napi_get_dataview_info}

**Added in: v8.3.0**

**N-API バージョン: 1**

```C [C]
napi_status napi_get_dataview_info(napi_env env,
                                   napi_value dataview,
                                   size_t* byte_length,
                                   void** data,
                                   napi_value* arraybuffer,
                                   size_t* byte_offset)
```
- `[in] env`: API が呼び出される環境。
- `[in] dataview`: プロパティをクエリする `DataView` を表す `napi_value`。
- `[out] byte_length`: `DataView` 内のバイト数。
- `[out] data`: `DataView` の基になるデータバッファ。 byte_length が `0` の場合、これは `NULL` またはその他のポインタ値になる可能性があります。
- `[out] arraybuffer`: `DataView` の基になる `ArrayBuffer`。
- `[out] byte_offset`: `DataView` の投影を開始するデータバッファ内のバイトオフセット。

API が成功した場合は `napi_ok` を返します。

プロパティが不要な場合、出力パラメータのいずれかが `NULL` になる可能性があります。

この API は、`DataView` のさまざまなプロパティを返します。

#### `napi_get_date_value` {#napi_get_date_value}

**Added in: v11.11.0, v10.17.0**

**N-API バージョン: 5**

```C [C]
napi_status napi_get_date_value(napi_env env,
                                napi_value value,
                                double* result)
```
- `[in] env`: API が呼び出される環境。
- `[in] value`: JavaScript `Date` を表す `napi_value`。
- `[out] result`: 1970 年 1 月 1 日の深夜からのミリ秒として表される `double` としての時間値（UTC）。

この API はうるう秒を監視しません。ECMAScript は POSIX 時間仕様に準拠しているため、うるう秒は無視されます。

API が成功した場合は `napi_ok` を返します。 日付以外の `napi_value` が渡された場合、`napi_date_expected` を返します。

この API は、指定された JavaScript `Date` の時間値の C double プリミティブを返します。

#### `napi_get_value_bool` {#napi_get_value_bool}

**Added in: v8.0.0**

**N-API バージョン: 1**

```C [C]
napi_status napi_get_value_bool(napi_env env, napi_value value, bool* result)
```
- `[in] env`: API が呼び出される環境。
- `[in] value`: JavaScript `Boolean` を表す `napi_value`。
- `[out] result`: 指定された JavaScript `Boolean` と同等の C ブール型プリミティブ。

API が成功した場合は `napi_ok` を返します。 ブール値以外の `napi_value` が渡された場合、`napi_boolean_expected` を返します。

この API は、指定された JavaScript `Boolean` と同等の C ブール型プリミティブを返します。


#### `napi_get_value_double` {#napi_get_value_double}

**Added in: v8.0.0**

**N-API バージョン: 1**

```C [C]
napi_status napi_get_value_double(napi_env env,
                                  napi_value value,
                                  double* result)
```
- `[in] env`: API が呼び出される環境。
- `[in] value`: JavaScript の `number` を表す `napi_value`。
- `[out] result`: 指定された JavaScript の `number` に相当する C の double プリミティブ。

API が成功した場合は `napi_ok` を返します。数値以外の `napi_value` が渡された場合は、`napi_number_expected` を返します。

この API は、指定された JavaScript の `number` に相当する C の double プリミティブを返します。

#### `napi_get_value_bigint_int64` {#napi_get_value_bigint_int64}

**Added in: v10.7.0**

**N-API バージョン: 6**

```C [C]
napi_status napi_get_value_bigint_int64(napi_env env,
                                        napi_value value,
                                        int64_t* result,
                                        bool* lossless);
```
- `[in] env`: API が呼び出される環境。
- `[in] value`: JavaScript の `BigInt` を表す `napi_value`。
- `[out] result`: 指定された JavaScript の `BigInt` に相当する C の `int64_t` プリミティブ。
- `[out] lossless`: `BigInt` 値がロスレスで変換されたかどうかを示します。

API が成功した場合は `napi_ok` を返します。`BigInt` 以外のものが渡された場合は、`napi_bigint_expected` を返します。

この API は、指定された JavaScript の `BigInt` に相当する C の `int64_t` プリミティブを返します。必要に応じて値を切り捨て、`lossless` を `false` に設定します。

#### `napi_get_value_bigint_uint64` {#napi_get_value_bigint_uint64}

**Added in: v10.7.0**

**N-API バージョン: 6**

```C [C]
napi_status napi_get_value_bigint_uint64(napi_env env,
                                        napi_value value,
                                        uint64_t* result,
                                        bool* lossless);
```
- `[in] env`: API が呼び出される環境。
- `[in] value`: JavaScript の `BigInt` を表す `napi_value`。
- `[out] result`: 指定された JavaScript の `BigInt` に相当する C の `uint64_t` プリミティブ。
- `[out] lossless`: `BigInt` 値がロスレスで変換されたかどうかを示します。

API が成功した場合は `napi_ok` を返します。`BigInt` 以外のものが渡された場合は、`napi_bigint_expected` を返します。

この API は、指定された JavaScript の `BigInt` に相当する C の `uint64_t` プリミティブを返します。必要に応じて値を切り捨て、`lossless` を `false` に設定します。


#### `napi_get_value_bigint_words` {#napi_get_value_bigint_words}

**Added in: v10.7.0**

**N-API version: 6**

```C [C]
napi_status napi_get_value_bigint_words(napi_env env,
                                        napi_value value,
                                        int* sign_bit,
                                        size_t* word_count,
                                        uint64_t* words);
```
- `[in] env`: APIが呼び出される環境。
- `[in] value`: JavaScript の `BigInt` を表す `napi_value`。
- `[out] sign_bit`: JavaScript の `BigInt` が正か負かを表す整数。
- `[in/out] word_count`: `words` 配列の長さに初期化する必要があります。戻ると、この `BigInt` を格納するために必要な実際のワード数に設定されます。
- `[out] words`: 事前に割り当てられた 64 ビットのワード配列へのポインタ。

APIが成功した場合は `napi_ok` を返します。

この API は、単一の `BigInt` 値を符号ビット、64 ビットのリトルエンディアン配列、および配列内の要素数に変換します。 `word_count` のみを取得するために、`sign_bit` と `words` の両方を `NULL` に設定できます。

#### `napi_get_value_external` {#napi_get_value_external}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_value_external(napi_env env,
                                    napi_value value,
                                    void** result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] value`: JavaScript の外部値を表す `napi_value`。
- `[out] result`: JavaScript の外部値によってラップされたデータへのポインタ。

APIが成功した場合は `napi_ok` を返します。外部でない `napi_value` が渡された場合は `napi_invalid_arg` を返します。

この API は、以前に `napi_create_external()` に渡された外部データポインタを取得します。

#### `napi_get_value_int32` {#napi_get_value_int32}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_value_int32(napi_env env,
                                 napi_value value,
                                 int32_t* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] value`: JavaScript の `number` を表す `napi_value`。
- `[out] result`: 指定された JavaScript の `number` に相当する C の `int32` プリミティブ。

APIが成功した場合は `napi_ok` を返します。数値でない `napi_value` が渡された場合は `napi_number_expected` を返します。

この API は、指定された JavaScript の `number` に相当する C の `int32` プリミティブを返します。

数値が 32 ビット整数の範囲を超える場合、結果は下位 32 ビットに相当するように切り捨てられます。これにより、値が > 2 - 1 の場合、大きな正の数が負の数になる可能性があります。

非有限数値 (`NaN`、`+Infinity`、または `-Infinity`) は、結果をゼロに設定します。


#### `napi_get_value_int64` {#napi_get_value_int64}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_value_int64(napi_env env,
                                 napi_value value,
                                 int64_t* result)
```
- `[in] env`: APIが呼び出される環境です。
- `[in] value`: JavaScriptの`number`を表す`napi_value`。
- `[out] result`: 指定されたJavaScriptの`number`と同等のCの`int64`プリミティブ。

APIが成功した場合は`napi_ok`を返します。数値以外の`napi_value`が渡された場合は、`napi_number_expected`を返します。

このAPIは、指定されたJavaScriptの`number`と同等のCの`int64`プリミティブを返します。

[`Number.MIN_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.min_safe_integer) `-(2**53 - 1)` - [`Number.MAX_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.max_safe_integer) `(2**53 - 1)`の範囲外の`number`値は、精度が失われます。

非有限数値（`NaN`、`+Infinity`、または`-Infinity`）は、結果をゼロに設定します。

#### `napi_get_value_string_latin1` {#napi_get_value_string_latin1}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_value_string_latin1(napi_env env,
                                         napi_value value,
                                         char* buf,
                                         size_t bufsize,
                                         size_t* result)
```
- `[in] env`: APIが呼び出される環境です。
- `[in] value`: JavaScriptの文字列を表す`napi_value`。
- `[in] buf`: ISO-8859-1エンコードされた文字列を書き込むバッファ。 `NULL`が渡された場合、文字列の長さ（バイト単位、ヌル終端文字を除く）が`result`で返されます。
- `[in] bufsize`: 宛先バッファのサイズ。 この値が不十分な場合、返される文字列は切り捨てられ、ヌル終端されます。
- `[out] result`: バッファにコピーされたバイト数（ヌル終端文字を除く）。

APIが成功した場合は`napi_ok`を返します。 `string`以外の`napi_value`が渡された場合は、`napi_string_expected`を返します。

このAPIは、渡された値に対応するISO-8859-1エンコードされた文字列を返します。


#### `napi_get_value_string_utf8` {#napi_get_value_string_utf8}

**Added in: v8.0.0**

**N-API バージョン: 1**

```C [C]
napi_status napi_get_value_string_utf8(napi_env env,
                                       napi_value value,
                                       char* buf,
                                       size_t bufsize,
                                       size_t* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] value`: JavaScript文字列を表す`napi_value`。
- `[in] buf`: UTF8エンコードされた文字列を書き込むバッファー。 `NULL`が渡された場合、nullターミネータを除いた文字列のバイト長が`result`で返されます。
- `[in] bufsize`: 宛先バッファーのサイズ。 この値が不十分な場合、返される文字列は切り捨てられ、null終端されます。
- `[out] result`: バッファーにコピーされたバイト数（nullターミネータを除く）。

APIが成功した場合は`napi_ok`を返します。 `string`以外の`napi_value`が渡された場合は、`napi_string_expected`を返します。

このAPIは、渡された値に対応するUTF8エンコードされた文字列を返します。

#### `napi_get_value_string_utf16` {#napi_get_value_string_utf16}

**Added in: v8.0.0**

**N-API バージョン: 1**

```C [C]
napi_status napi_get_value_string_utf16(napi_env env,
                                        napi_value value,
                                        char16_t* buf,
                                        size_t bufsize,
                                        size_t* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] value`: JavaScript文字列を表す`napi_value`。
- `[in] buf`: UTF16-LEエンコードされた文字列を書き込むバッファー。 `NULL`が渡された場合、nullターミネータを除いた文字列の2バイトコードユニットの長さが返されます。
- `[in] bufsize`: 宛先バッファーのサイズ。 この値が不十分な場合、返される文字列は切り捨てられ、null終端されます。
- `[out] result`: バッファーにコピーされた2バイトコードユニットの数（nullターミネータを除く）。

APIが成功した場合は`napi_ok`を返します。 `string`以外の`napi_value`が渡された場合は、`napi_string_expected`を返します。

このAPIは、渡された値に対応するUTF16エンコードされた文字列を返します。


#### `napi_get_value_uint32` {#napi_get_value_uint32}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_value_uint32(napi_env env,
                                  napi_value value,
                                  uint32_t* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] value`: JavaScriptの`number`を表す`napi_value`。
- `[out] result`: 指定された`napi_value`に対応するCのプリミティブを`uint32_t`として取得。

APIが成功した場合は`napi_ok`を返します。数値以外の`napi_value`が渡された場合は、`napi_number_expected`を返します。

このAPIは、指定された`napi_value`に対応するCのプリミティブを`uint32_t`として返します。

### グローバルインスタンスを取得する関数 {#functions-to-get-global-instances}

#### `napi_get_boolean` {#napi_get_boolean}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_boolean(napi_env env, bool value, napi_value* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] value`: 取得するbooleanの値。
- `[out] result`: 取得するJavaScriptの`Boolean`シングルトンを表す`napi_value`。

APIが成功した場合は`napi_ok`を返します。

このAPIは、指定されたboolean値を表すために使用されるJavaScriptのシングルトンオブジェクトを返すために使用されます。

#### `napi_get_global` {#napi_get_global}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_global(napi_env env, napi_value* result)
```
- `[in] env`: APIが呼び出される環境。
- `[out] result`: JavaScriptの`global`オブジェクトを表す`napi_value`。

APIが成功した場合は`napi_ok`を返します。

このAPIは`global`オブジェクトを返します。

#### `napi_get_null` {#napi_get_null}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_null(napi_env env, napi_value* result)
```
- `[in] env`: APIが呼び出される環境。
- `[out] result`: JavaScriptの`null`オブジェクトを表す`napi_value`。

APIが成功した場合は`napi_ok`を返します。

このAPIは`null`オブジェクトを返します。

#### `napi_get_undefined` {#napi_get_undefined}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_undefined(napi_env env, napi_value* result)
```
- `[in] env`: APIが呼び出される環境。
- `[out] result`: JavaScriptのUndefined値を表す`napi_value`。

APIが成功した場合は`napi_ok`を返します。

このAPIはUndefinedオブジェクトを返します。


## JavaScriptの値と抽象的な操作の扱い {#working-with-javascript-values-and-abstract-operations}

Node-APIは、JavaScriptの値に対して抽象的な操作を実行するための一連のAPIを公開しています。これらの操作の一部は、[ECMAScript Language Specification](https://tc39.github.io/ecma262/)の[セクション7](https://tc39.github.io/ecma262/#sec-abstract-operations)で文書化されています。

これらのAPIは、次のいずれかの実行をサポートしています。

### `napi_coerce_to_bool` {#napi_coerce_to_bool}

**追加:** v8.0.0

**N-APIバージョン:** 1

```C [C]
napi_status napi_coerce_to_bool(napi_env env,
                                napi_value value,
                                napi_value* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] value`: 強制するJavaScriptの値。
- `[out] result`: 強制されたJavaScript `Boolean`を表す`napi_value`。

APIが成功した場合は`napi_ok`を返します。

このAPIは、ECMAScript Language Specificationの[セクション7.1.2](https://tc39.github.io/ecma262/#sec-toboolean)で定義されている抽象的な操作`ToBoolean()`を実装しています。

### `napi_coerce_to_number` {#napi_coerce_to_number}

**追加:** v8.0.0

**N-APIバージョン:** 1

```C [C]
napi_status napi_coerce_to_number(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] value`: 強制するJavaScriptの値。
- `[out] result`: 強制されたJavaScript `number`を表す`napi_value`。

APIが成功した場合は`napi_ok`を返します。

このAPIは、ECMAScript Language Specificationの[セクション7.1.3](https://tc39.github.io/ecma262/#sec-tonumber)で定義されている抽象的な操作`ToNumber()`を実装しています。 この関数は、渡された値がオブジェクトの場合、JSコードを実行する可能性があります。

### `napi_coerce_to_object` {#napi_coerce_to_object}

**追加:** v8.0.0

**N-APIバージョン:** 1

```C [C]
napi_status napi_coerce_to_object(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] value`: 強制するJavaScriptの値。
- `[out] result`: 強制されたJavaScript `Object`を表す`napi_value`。

APIが成功した場合は`napi_ok`を返します。

このAPIは、ECMAScript Language Specificationの[セクション7.1.13](https://tc39.github.io/ecma262/#sec-toobject)で定義されている抽象的な操作`ToObject()`を実装しています。


### `napi_coerce_to_string` {#napi_coerce_to_string}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_coerce_to_string(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] value`: 強制するJavaScriptの値。
- `[out] result`: 強制されたJavaScriptの`string`を表す`napi_value`。

APIが成功した場合、`napi_ok`を返します。

このAPIは、ECMAScript言語仕様の[セクション7.1.13](https://tc39.github.io/ecma262/#sec-toobject)で定義されている抽象操作`ToString()`を実装します。この関数は、渡された値がオブジェクトの場合、JSコードを実行する可能性があります。

### `napi_typeof` {#napi_typeof}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_typeof(napi_env env, napi_value value, napi_valuetype* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] value`: 型を照会するJavaScriptの値。
- `[out] result`: JavaScriptの値の型。

APIが成功した場合、`napi_ok`を返します。

- `value`の型が既知のECMAScript型でなく、`value`がExternal値でない場合、`napi_invalid_arg`。

このAPIは、ECMAScript言語仕様の[セクション12.5.5](https://tc39.github.io/ecma262/#sec-typeof-operator)で定義されているオブジェクトに対して`typeof`演算子を呼び出すのと同様の動作を表します。ただし、いくつかの違いがあります。

`value`が無効な型である場合、エラーが返されます。

### `napi_instanceof` {#napi_instanceof}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_instanceof(napi_env env,
                            napi_value object,
                            napi_value constructor,
                            bool* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] object`: チェックするJavaScriptの値。
- `[in] constructor`: チェック対象のコンストラクタ関数のJavaScript関数オブジェクト。
- `[out] result`: `object instanceof constructor`が真の場合にtrueに設定されるブール値。

APIが成功した場合、`napi_ok`を返します。

このAPIは、ECMAScript言語仕様の[セクション12.10.4](https://tc39.github.io/ecma262/#sec-instanceofoperator)で定義されているオブジェクトに対して`instanceof`演算子を呼び出すことを表します。


### `napi_is_array` {#napi_is_array}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_is_array(napi_env env, napi_value value, bool* result)
```
- `[in] env`: API が呼び出される環境。
- `[in] value`: チェックする JavaScript の値。
- `[out] result`: 与えられたオブジェクトが配列かどうか。

API が成功した場合、`napi_ok` を返します。

この API は、ECMAScript 言語仕様の [セクション 7.2.2](https://tc39.github.io/ecma262/#sec-isarray) で定義されているオブジェクトに対して `IsArray` 操作を呼び出すことを表します。

### `napi_is_arraybuffer` {#napi_is_arraybuffer}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_is_arraybuffer(napi_env env, napi_value value, bool* result)
```
- `[in] env`: API が呼び出される環境。
- `[in] value`: チェックする JavaScript の値。
- `[out] result`: 与えられたオブジェクトが `ArrayBuffer` かどうか。

API が成功した場合、`napi_ok` を返します。

この API は、渡された `Object` が ArrayBuffer かどうかをチェックします。

### `napi_is_buffer` {#napi_is_buffer}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_is_buffer(napi_env env, napi_value value, bool* result)
```
- `[in] env`: API が呼び出される環境。
- `[in] value`: チェックする JavaScript の値。
- `[out] result`: 与えられた `napi_value` が `node::Buffer` または `Uint8Array` オブジェクトを表すかどうか。

API が成功した場合、`napi_ok` を返します。

この API は、渡された `Object` が Buffer または Uint8Array かどうかをチェックします。 値が Uint8Array かどうかを呼び出し元が確認する必要がある場合は、[`napi_is_typedarray`](/ja/nodejs/api/n-api#napi_is_typedarray) を優先する必要があります。

### `napi_is_date` {#napi_is_date}

**Added in: v11.11.0, v10.17.0**

**N-API version: 5**

```C [C]
napi_status napi_is_date(napi_env env, napi_value value, bool* result)
```
- `[in] env`: API が呼び出される環境。
- `[in] value`: チェックする JavaScript の値。
- `[out] result`: 与えられた `napi_value` が JavaScript の `Date` オブジェクトを表すかどうか。

API が成功した場合、`napi_ok` を返します。

この API は、渡された `Object` が Date かどうかをチェックします。


### `napi_is_error` {#napi_is_error_1}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_is_error(napi_env env, napi_value value, bool* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] value`: チェックする JavaScript の値。
- `[out] result`: 指定された `napi_value` が `Error` オブジェクトを表すかどうか。

API が成功した場合、`napi_ok` を返します。

この API は、渡された `Object` が `Error` であるかどうかをチェックします。

### `napi_is_typedarray` {#napi_is_typedarray}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_is_typedarray(napi_env env, napi_value value, bool* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] value`: チェックする JavaScript の値。
- `[out] result`: 指定された `napi_value` が `TypedArray` を表すかどうか。

API が成功した場合、`napi_ok` を返します。

この API は、渡された `Object` が型付き配列であるかどうかをチェックします。

### `napi_is_dataview` {#napi_is_dataview}

**Added in: v8.3.0**

**N-API version: 1**

```C [C]
napi_status napi_is_dataview(napi_env env, napi_value value, bool* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] value`: チェックする JavaScript の値。
- `[out] result`: 指定された `napi_value` が `DataView` を表すかどうか。

API が成功した場合、`napi_ok` を返します。

この API は、渡された `Object` が `DataView` であるかどうかをチェックします。

### `napi_strict_equals` {#napi_strict_equals}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_strict_equals(napi_env env,
                               napi_value lhs,
                               napi_value rhs,
                               bool* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] lhs`: チェックする JavaScript の値。
- `[in] rhs`: チェック対象の JavaScript の値。
- `[out] result`: 2 つの `napi_value` オブジェクトが等しいかどうか。

API が成功した場合、`napi_ok` を返します。

この API は、ECMAScript 言語仕様の [セクション 7.2.14](https://tc39.github.io/ecma262/#sec-strict-equality-comparison) で定義されている厳密等価性アルゴリズムの呼び出しを表します。


### `napi_detach_arraybuffer` {#napi_detach_arraybuffer}

**追加:** v13.0.0, v12.16.0, v10.22.0

**N-API バージョン:** 7

```C [C]
napi_status napi_detach_arraybuffer(napi_env env,
                                    napi_value arraybuffer)
```
- `[in] env`: API が呼び出される環境。
- `[in] arraybuffer`: デタッチされる JavaScript の `ArrayBuffer`。

API が成功した場合は `napi_ok` を返します。デタッチできない `ArrayBuffer` が渡された場合は、`napi_detachable_arraybuffer_expected` を返します。

一般的に、`ArrayBuffer` は以前にデタッチされた場合、デタッチできません。エンジンは、`ArrayBuffer` がデタッチ可能かどうかについて、追加の条件を課す場合があります。たとえば、V8 では、`ArrayBuffer` が外部であること、つまり [`napi_create_external_arraybuffer`](/ja/nodejs/api/n-api#napi_create_external_arraybuffer) で作成されていることが必要です。

この API は、ECMAScript 言語仕様の [セクション 24.1.1.3](https://tc39.es/ecma262/#sec-detacharraybuffer) で定義されている `ArrayBuffer` のデタッチ操作の呼び出しを表します。

### `napi_is_detached_arraybuffer` {#napi_is_detached_arraybuffer}

**追加:** v13.3.0, v12.16.0, v10.22.0

**N-API バージョン:** 7

```C [C]
napi_status napi_is_detached_arraybuffer(napi_env env,
                                         napi_value arraybuffer,
                                         bool* result)
```
- `[in] env`: API が呼び出される環境。
- `[in] arraybuffer`: チェックされる JavaScript の `ArrayBuffer`。
- `[out] result`: `arraybuffer` がデタッチされているかどうか。

API が成功した場合は `napi_ok` を返します。

`ArrayBuffer` は、その内部データが `null` の場合、デタッチされていると見なされます。

この API は、ECMAScript 言語仕様の [セクション 24.1.1.2](https://tc39.es/ecma262/#sec-isdetachedbuffer) で定義されている `ArrayBuffer` の `IsDetachedBuffer` 操作の呼び出しを表します。

## JavaScript プロパティの操作 {#working-with-javascript-properties}

Node-API は、JavaScript オブジェクトのプロパティを取得および設定するための一連の API を公開しています。これらの型のいくつかは、[ECMAScript 言語仕様](https://tc39.github.io/ecma262/) の [セクション 7](https://tc39.github.io/ecma262/#sec-abstract-operations) でドキュメント化されています。

JavaScript のプロパティは、キーと値のタプルとして表されます。基本的に、Node-API のすべてのプロパティキーは、次のいずれかの形式で表すことができます。

- 名前付き: 単純な UTF8 エンコードされた文字列
- 整数インデックス付き: `uint32_t` で表されるインデックス値
- JavaScript 値: これらは Node-API で `napi_value` で表されます。これは、`string`、`number`、または `symbol` を表す `napi_value` になります。

Node-API 値は、型 `napi_value` で表されます。JavaScript 値が必要な Node-API 呼び出しはすべて、`napi_value` を受け取ります。ただし、問題の `napi_value` が API が予期する JavaScript 型であることを確認するのは、呼び出し側の責任です。

このセクションでドキュメント化されている API は、`napi_value` で表される任意の JavaScript オブジェクトのプロパティを取得および設定するための簡単なインターフェイスを提供します。

たとえば、次の JavaScript コードスニペットを考えてみましょう。

```js [ESM]
const obj = {};
obj.myProp = 123;
```
同等のことは、次のスニペットを使用して Node-API 値で実行できます。

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
インデックス付きプロパティは、同様の方法で設定できます。次の JavaScript スニペットを考えてみましょう。

```js [ESM]
const arr = [];
arr[123] = 'hello';
```
同等のことは、次のスニペットを使用して Node-API 値で実行できます。

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
プロパティは、このセクションで説明されている API を使用して取得できます。次の JavaScript スニペットを考えてみましょう。

```js [ESM]
const arr = [];
const value = arr[123];
```
次は、Node-API の対応するもののほぼ同等です。

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
最後に、パフォーマンス上の理由から、複数のプロパティをオブジェクトに定義することもできます。次の JavaScript を考えてみましょう。

```js [ESM]
const obj = {};
Object.defineProperties(obj, {
  'foo': { value: 123, writable: true, configurable: true, enumerable: true },
  'bar': { value: 456, writable: true, configurable: true, enumerable: true },
});
```
次は、Node-API の対応するもののほぼ同等です。

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

### 構造体 {#structures}

#### `napi_property_attributes` {#napi_property_attributes}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v14.12.0 | `napi_default_method` と `napi_default_property` が追加されました。 |
:::

```C [C]
typedef enum {
  napi_default = 0,
  napi_writable = 1 << 0,
  napi_enumerable = 1 << 1,
  napi_configurable = 1 << 2,

  // クラスの静的プロパティとインスタンスプロパティを区別するために
  // napi_define_class で使用されます。 napi_define_properties では無視されます。
  napi_static = 1 << 10,

  // クラスメソッドのデフォルト。
  napi_default_method = napi_writable | napi_configurable,

  // JS の obj[prop] のようなオブジェクトプロパティのデフォルト。
  napi_default_jsproperty = napi_writable |
                          napi_enumerable |
                          napi_configurable,
} napi_property_attributes;
```
`napi_property_attributes` は、JavaScript オブジェクトに設定されたプロパティの動作を制御するために使用されるフラグです。`napi_static` 以外は、[ECMAScript 言語仕様](https://tc39.github.io/ecma262/)の[セクション 6.1.7.1](https://tc39.github.io/ecma262/#table-2) にリストされている属性に対応します。 それらは、以下のビットフラグの 1 つ以上である可能性があります。

- `napi_default`: プロパティに明示的な属性は設定されていません。 デフォルトでは、プロパティは読み取り専用で、列挙可能ではなく、構成可能ではありません。
- `napi_writable`: プロパティは書き込み可能です。
- `napi_enumerable`: プロパティは列挙可能です。
- `napi_configurable`: プロパティは [ECMAScript 言語仕様](https://tc39.github.io/ecma262/)の[セクション 6.1.7.1](https://tc39.github.io/ecma262/#table-2) で定義されているように構成可能です。
- `napi_static`: プロパティは、デフォルトであるインスタンスプロパティではなく、クラスの静的プロパティとして定義されます。 これは [`napi_define_class`](/ja/nodejs/api/n-api#napi_define_class) でのみ使用されます。 `napi_define_properties` では無視されます。
- `napi_default_method`: JS クラスのメソッドと同様に、プロパティは構成可能で書き込み可能ですが、列挙可能ではありません。
- `napi_default_jsproperty`: JavaScript での代入によって設定されたプロパティと同様に、プロパティは書き込み可能、列挙可能、および構成可能です。


#### `napi_property_descriptor` {#napi_property_descriptor}

```C [C]
typedef struct {
  // utf8nameまたはnameのいずれかはNULLである必要があります。
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
- `utf8name`: プロパティのキーを記述するオプションの文字列。UTF8でエンコードされています。 `utf8name`または`name`のいずれかをプロパティに指定する必要があります。
- `name`: プロパティのキーとして使用されるJavaScript文字列またはシンボルを指すオプションの`napi_value`。 `utf8name`または`name`のいずれかをプロパティに指定する必要があります。
- `value`: プロパティがデータプロパティの場合、プロパティのgetアクセスによって取得される値。 これが渡された場合は、`getter`、`setter`、`method`、および`data`を`NULL`に設定します（これらのメンバーは使用されないため）。
- `getter`: プロパティのgetアクセスが実行されたときに呼び出す関数。 これが渡された場合は、`value`と`method`を`NULL`に設定します（これらのメンバーは使用されないため）。 指定された関数は、JavaScriptコードからプロパティにアクセスされた場合（またはNode-API呼び出しを使用してプロパティでgetが実行された場合）、ランタイムによって暗黙的に呼び出されます。 [`napi_callback`](/ja/nodejs/api/n-api#napi_callback)は、詳細を提供します。
- `setter`: プロパティのsetアクセスが実行されたときに呼び出す関数。 これが渡された場合は、`value`と`method`を`NULL`に設定します（これらのメンバーは使用されないため）。 指定された関数は、JavaScriptコードからプロパティが設定された場合（またはNode-API呼び出しを使用してプロパティが設定された場合）、ランタイムによって暗黙的に呼び出されます。 [`napi_callback`](/ja/nodejs/api/n-api#napi_callback)は、詳細を提供します。
- `method`: この設定により、プロパティ記述子オブジェクトの`value`プロパティが、`method`によって表されるJavaScript関数になります。 これが渡された場合は、`value`、`getter`、および`setter`を`NULL`に設定します（これらのメンバーは使用されないため）。 [`napi_callback`](/ja/nodejs/api/n-api#napi_callback)は、詳細を提供します。
- `attributes`: 特定のプロパティに関連付けられた属性。 [`napi_property_attributes`](/ja/nodejs/api/n-api#napi_property_attributes)を参照してください。
- `data`: この関数が呼び出された場合に、`method`、`getter`、および`setter`に渡されるコールバックデータ。


### 関数 {#functions}

#### `napi_get_property_names` {#napi_get_property_names}

**追加: v8.0.0**

**N-APIバージョン: 1**

```C [C]
napi_status napi_get_property_names(napi_env env,
                                    napi_value object,
                                    napi_value* result);
```
- `[in] env`: Node-API呼び出しが実行される環境。
- `[in] object`: プロパティを取得するオブジェクト。
- `[out] result`: オブジェクトのプロパティ名を表すJavaScript値の配列を表す`napi_value`。このAPIは、[`napi_get_array_length`](/ja/nodejs/api/n-api#napi_get_array_length)と[`napi_get_element`](/ja/nodejs/api/n-api#napi_get_element)を使用して`result`を反復処理するために使用できます。

APIが成功した場合は`napi_ok`を返します。

このAPIは、`object`の列挙可能なプロパティの名前を文字列の配列として返します。キーがシンボルである`object`のプロパティは含まれません。

#### `napi_get_all_property_names` {#napi_get_all_property_names}

**追加: v13.7.0, v12.17.0, v10.20.0**

**N-APIバージョン: 6**

```C [C]
napi_get_all_property_names(napi_env env,
                            napi_value object,
                            napi_key_collection_mode key_mode,
                            napi_key_filter key_filter,
                            napi_key_conversion key_conversion,
                            napi_value* result);
```
- `[in] env`: Node-API呼び出しが実行される環境。
- `[in] object`: プロパティを取得するオブジェクト。
- `[in] key_mode`: プロトタイププロパティも取得するかどうか。
- `[in] key_filter`: 取得するプロパティ (列挙可能/読み取り可能/書き込み可能)。
- `[in] key_conversion`: 番号付きプロパティキーを文字列に変換するかどうか。
- `[out] result`: オブジェクトのプロパティ名を表すJavaScript値の配列を表す`napi_value`。[`napi_get_array_length`](/ja/nodejs/api/n-api#napi_get_array_length)と[`napi_get_element`](/ja/nodejs/api/n-api#napi_get_element)を使用して`result`を反復処理できます。

APIが成功した場合は`napi_ok`を返します。

このAPIは、このオブジェクトで使用可能なプロパティの名前を含む配列を返します。


#### `napi_set_property` {#napi_set_property}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_set_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              napi_value value);
```
- `[in] env`: Node-API呼び出しが起動される環境。
- `[in] object`: プロパティを設定するオブジェクト。
- `[in] key`: 設定するプロパティの名前。
- `[in] value`: プロパティの値。

APIが成功した場合`napi_ok`を返します。

このAPIは、渡された`Object`にプロパティを設定します。

#### `napi_get_property` {#napi_get_property}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              napi_value* result);
```
- `[in] env`: Node-API呼び出しが起動される環境。
- `[in] object`: プロパティを取得するオブジェクト。
- `[in] key`: 取得するプロパティの名前。
- `[out] result`: プロパティの値。

APIが成功した場合`napi_ok`を返します。

このAPIは、渡された`Object`から要求されたプロパティを取得します。

#### `napi_has_property` {#napi_has_property}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_has_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              bool* result);
```
- `[in] env`: Node-API呼び出しが起動される環境。
- `[in] object`: クエリを実行するオブジェクト。
- `[in] key`: 存在を確認するプロパティの名前。
- `[out] result`: プロパティがオブジェクトに存在するかどうか。

APIが成功した場合`napi_ok`を返します。

このAPIは、渡された`Object`に指定された名前のプロパティがあるかどうかを確認します。

#### `napi_delete_property` {#napi_delete_property}

**Added in: v8.2.0**

**N-API version: 1**

```C [C]
napi_status napi_delete_property(napi_env env,
                                 napi_value object,
                                 napi_value key,
                                 bool* result);
```
- `[in] env`: Node-API呼び出しが起動される環境。
- `[in] object`: クエリを実行するオブジェクト。
- `[in] key`: 削除するプロパティの名前。
- `[out] result`: プロパティの削除が成功したかどうか。 `result`は、`NULL`を渡すことでオプションで無視できます。

APIが成功した場合`napi_ok`を返します。

このAPIは、`object`から`key`独自のプロパティを削除しようとします。


#### `napi_has_own_property` {#napi_has_own_property}

**Added in: v8.2.0**

**N-API version: 1**

```C [C]
napi_status napi_has_own_property(napi_env env,
                                  napi_value object,
                                  napi_value key,
                                  bool* result);
```
- `[in] env`: Node-API 呼び出しが起動される環境。
- `[in] object`: クエリするオブジェクト。
- `[in] key`: 存在を確認する独自のプロパティの名前。
- `[out] result`: オブジェクトに独自のプロパティが存在するかどうか。

API が成功した場合、`napi_ok` を返します。

この API は、渡された `Object` に名前付きの独自のプロパティがあるかどうかを確認します。`key` は `string` または `symbol` でなければなりません。そうでない場合、エラーがスローされます。Node-API は、データ型間の変換を実行しません。

#### `napi_set_named_property` {#napi_set_named_property}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_set_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    napi_value value);
```
- `[in] env`: Node-API 呼び出しが起動される環境。
- `[in] object`: プロパティを設定するオブジェクト。
- `[in] utf8Name`: 設定するプロパティの名前。
- `[in] value`: プロパティ値。

API が成功した場合、`napi_ok` を返します。

このメソッドは、`utf8Name` として渡された文字列から作成された `napi_value` を使用して、[`napi_set_property`](/ja/nodejs/api/n-api#napi_set_property) を呼び出すのと同じです。

#### `napi_get_named_property` {#napi_get_named_property}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    napi_value* result);
```
- `[in] env`: Node-API 呼び出しが起動される環境。
- `[in] object`: プロパティを取得するオブジェクト。
- `[in] utf8Name`: 取得するプロパティの名前。
- `[out] result`: プロパティの値。

API が成功した場合、`napi_ok` を返します。

このメソッドは、`utf8Name` として渡された文字列から作成された `napi_value` を使用して、[`napi_get_property`](/ja/nodejs/api/n-api#napi_get_property) を呼び出すのと同じです。


#### `napi_has_named_property` {#napi_has_named_property}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_has_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    bool* result);
```
- `[in] env`: Node-API呼び出しが実行される環境。
- `[in] object`: クエリするオブジェクト。
- `[in] utf8Name`: 存在を確認するプロパティの名前。
- `[out] result`: プロパティがオブジェクトに存在するかどうか。

APIが成功した場合、`napi_ok`を返します。

このメソッドは、`utf8Name`として渡された文字列から作成された`napi_value`を使用して[`napi_has_property`](/ja/nodejs/api/n-api#napi_has_property)を呼び出すことと同等です。

#### `napi_set_element` {#napi_set_element}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_set_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value value);
```
- `[in] env`: Node-API呼び出しが実行される環境。
- `[in] object`: プロパティを設定するオブジェクト。
- `[in] index`: 設定するプロパティのインデックス。
- `[in] value`: プロパティの値。

APIが成功した場合、`napi_ok`を返します。

このAPIは、渡された`Object`の要素を設定します。

#### `napi_get_element` {#napi_get_element}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value* result);
```
- `[in] env`: Node-API呼び出しが実行される環境。
- `[in] object`: プロパティを取得するオブジェクト。
- `[in] index`: 取得するプロパティのインデックス。
- `[out] result`: プロパティの値。

APIが成功した場合、`napi_ok`を返します。

このAPIは、要求されたインデックスにある要素を取得します。

#### `napi_has_element` {#napi_has_element}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_has_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             bool* result);
```
- `[in] env`: Node-API呼び出しが実行される環境。
- `[in] object`: クエリするオブジェクト。
- `[in] index`: 存在を確認するプロパティのインデックス。
- `[out] result`: プロパティがオブジェクトに存在するかどうか。

APIが成功した場合、`napi_ok`を返します。

このAPIは、渡された`Object`が要求されたインデックスに要素を持っているかどうかを返します。


#### `napi_delete_element` {#napi_delete_element}

**Added in: v8.2.0**

**N-API version: 1**

```C [C]
napi_status napi_delete_element(napi_env env,
                                napi_value object,
                                uint32_t index,
                                bool* result);
```
- `[in] env`: Node-API呼び出しが起動される環境。
- `[in] object`: クエリするオブジェクト。
- `[in] index`: 削除するプロパティのインデックス。
- `[out] result`: 要素の削除が成功したかどうか。 `result`は、`NULL`を渡すことで任意に無視できます。

APIが成功した場合は`napi_ok`を返します。

このAPIは、指定された`index`を`object`から削除しようとします。

#### `napi_define_properties` {#napi_define_properties}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_define_properties(napi_env env,
                                   napi_value object,
                                   size_t property_count,
                                   const napi_property_descriptor* properties);
```
- `[in] env`: Node-API呼び出しが起動される環境。
- `[in] object`: プロパティの取得元となるオブジェクト。
- `[in] property_count`: `properties`配列内の要素数。
- `[in] properties`: プロパティ記述子の配列。

APIが成功した場合は`napi_ok`を返します。

このメソッドを使用すると、特定のオブジェクトに対して複数のプロパティを効率的に定義できます。 プロパティはプロパティ記述子を使用して定義されます（[`napi_property_descriptor`](/ja/nodejs/api/n-api#napi_property_descriptor)を参照）。 このようなプロパティ記述子の配列が与えられた場合、このAPIは`DefineOwnProperty()`（ECMA-262仕様の[セクション9.1.6](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots-defineownproperty-p-desc)で説明されています）で定義されているように、オブジェクト上のプロパティを一度に1つずつ設定します。

#### `napi_object_freeze` {#napi_object_freeze}

**Added in: v14.14.0, v12.20.0**

**N-API version: 8**

```C [C]
napi_status napi_object_freeze(napi_env env,
                               napi_value object);
```
- `[in] env`: Node-API呼び出しが起動される環境。
- `[in] object`: フリーズするオブジェクト。

APIが成功した場合は`napi_ok`を返します。

このメソッドは、特定のオブジェクトをフリーズします。 これにより、新しいプロパティの追加、既存のプロパティの削除、既存のプロパティの列挙可能性、構成可能性、または書き込み可能性の変更、および既存のプロパティの値の変更が防止されます。 また、オブジェクトのプロトタイプが変更されるのも防ぎます。 これは、ECMA-262仕様の[セクション19.1.2.6](https://tc39.es/ecma262/#sec-object.freeze)に記載されています。


#### `napi_object_seal` {#napi_object_seal}

**追加:** v14.14.0, v12.20.0

**N-API バージョン: 8**

```C [C]
napi_status napi_object_seal(napi_env env,
                             napi_value object);
```
- `[in] env`: Node-API呼び出しが実行される環境。
- `[in] object`: シールするオブジェクト。

APIが成功した場合は`napi_ok`を返します。

このメソッドは、与えられたオブジェクトをシールします。 これにより、新しいプロパティがオブジェクトに追加されるのを防ぎ、既存のすべてのプロパティを非構成可能としてマークします。 これは、ECMA-262仕様の[セクション19.1.2.20](https://tc39.es/ecma262/#sec-object.seal)で説明されています。

## JavaScript関数との連携 {#working-with-javascript-functions}

Node-APIは、JavaScriptコードがネイティブコードにコールバックできるようにするAPIセットを提供します。 ネイティブコードへのコールバックをサポートするNode-APIは、`napi_callback`型で表されるコールバック関数を受け取ります。 JavaScript VMがネイティブコードにコールバックすると、提供された`napi_callback`関数が呼び出されます。 このセクションで説明されているAPIを使用すると、コールバック関数は次のことができます。

- コールバックが呼び出されたコンテキストに関する情報を取得します。
- コールバックに渡された引数を取得します。
- コールバックから`napi_value`を返します。

さらに、Node-APIは、ネイティブコードからJavaScript関数を呼び出すことを可能にする関数セットを提供します。 関数は、通常のJavaScript関数呼び出しのように、またはコンストラクタ関数として呼び出すことができます。

`napi_property_descriptor`アイテムの`data`フィールドを介してこのAPIに渡される非`NULL`データは、`object`に関連付けられ、`object`とデータを[`napi_add_finalizer`](/ja/nodejs/api/n-api#napi_add_finalizer)に渡すことによって、`object`がガベージコレクションされるたびに解放できます。

### `napi_call_function` {#napi_call_function}

**追加:** v8.0.0

**N-API バージョン: 1**

```C [C]
NAPI_EXTERN napi_status napi_call_function(napi_env env,
                                           napi_value recv,
                                           napi_value func,
                                           size_t argc,
                                           const napi_value* argv,
                                           napi_value* result);
```
- `[in] env`: APIが呼び出される環境。
- `[in] recv`: 呼び出された関数に渡される`this`値。
- `[in] func`: 呼び出すJavaScript関数を表す`napi_value`。
- `[in] argc`: `argv`配列内の要素の数。
- `[in] argv`: 関数への引数として渡されるJavaScript値を表す`napi_values`の配列。
- `[out] result`: 返されたJavaScriptオブジェクトを表す`napi_value`。

APIが成功した場合は`napi_ok`を返します。

このメソッドを使用すると、ネイティブアドオンからJavaScript関数オブジェクトを呼び出すことができます。 これは、アドオンのネイティブコード*から*JavaScript*へ*コールバックする主なメカニズムです。 非同期操作後にJavaScriptにコールバックする特別なケースについては、[`napi_make_callback`](/ja/nodejs/api/n-api#napi_make_callback)を参照してください。

サンプルユースケースは次のようになります。 次のJavaScriptスニペットを検討してください。

```js [ESM]
function AddTwo(num) {
  return num + 2;
}
global.AddTwo = AddTwo;
```
次に、上記の関数は、次のコードを使用してネイティブアドオンから呼び出すことができます。

```C [C]
// グローバルオブジェクトの "AddTwo" という名前の関数を取得します
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

// 結果をネイティブ型に変換します
int32_t result;
status = napi_get_value_int32(env, return_val, &result);
if (status != napi_ok) return;
```

### `napi_create_function` {#napi_create_function}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_create_function(napi_env env,
                                 const char* utf8name,
                                 size_t length,
                                 napi_callback cb,
                                 void* data,
                                 napi_value* result);
```
- `[in] env`: APIが呼び出される環境。
- `[in] utf8Name`: UTF8としてエンコードされた関数のオプションの名前。これは、新しい関数オブジェクトの`name`プロパティとしてJavaScript内で表示されます。
- `[in] length`: `utf8name`のバイト単位の長さ。null終端の場合は`NAPI_AUTO_LENGTH`。
- `[in] cb`: この関数オブジェクトが呼び出されたときに呼び出す必要があるネイティブ関数。詳細は[`napi_callback`](/ja/nodejs/api/n-api#napi_callback)を参照してください。
- `[in] data`: ユーザーが提供するデータコンテキスト。これは、後で呼び出されたときに関数に返されます。
- `[out] result`: 新しく作成された関数のJavaScript関数オブジェクトを表す`napi_value`。

APIが成功した場合は`napi_ok`を返します。

このAPIを使用すると、アドオンの作成者はネイティブコードで関数オブジェクトを作成できます。これは、JavaScript *から*アドオンのネイティブコード*に*呼び出すための主要なメカニズムです。

新しく作成された関数は、この呼び出しの後にスクリプトから自動的に表示されるわけではありません。代わりに、関数がスクリプトからアクセスできるようにするには、JavaScriptに表示されるオブジェクトのプロパティを明示的に設定する必要があります。

関数をアドオンのモジュールエクスポートの一部として公開するには、エクスポートオブジェクトに新しく作成された関数を設定します。サンプルモジュールは次のようになります。

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
上記のコードが与えられた場合、アドオンはJavaScriptから次のように使用できます。

```js [ESM]
const myaddon = require('./addon');
myaddon.sayHello();
```
`require()`に渡される文字列は、`.node`ファイルの作成を担当する`binding.gyp`内のターゲットの名前です。

このAPIに`data`パラメーターを介して渡される`NULL`以外のデータは、結果として得られるJavaScript関数（`result`パラメーターで返されます）に関連付けることができ、JavaScript関数とデータの両方を[`napi_add_finalizer`](/ja/nodejs/api/n-api#napi_add_finalizer)に渡すことによって、関数がガベージコレクションされるたびに解放できます。

JavaScriptの`Function`は、ECMAScript言語仕様の[Section 19.2](https://tc39.github.io/ecma262/#sec-function-objects)で説明されています。


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
- `[in] env`: APIが起動される環境。
- `[in] cbinfo`: コールバック関数に渡されるコールバック情報。
- `[in-out] argc`: 提供された `argv` 配列の長さを指定し、引数の実際の数を受け取ります。 `argc` は、オプションで `NULL` を渡して無視できます。
- `[out] argv`: 引数がコピーされる `napi_value` のC配列。 提供された数よりも引数が多い場合、要求された引数の数のみがコピーされます。 提供された引数が要求された数よりも少ない場合、残りの `argv` は `undefined` を表す `napi_value` 値で埋められます。 `argv` は、オプションで `NULL` を渡して無視できます。
- `[out] thisArg`: 呼び出しに対するJavaScriptの `this` 引数を受け取ります。 `thisArg` は、オプションで `NULL` を渡して無視できます。
- `[out] data`: コールバックのデータポインタを受け取ります。 `data` は、オプションで `NULL` を渡して無視できます。

APIが成功した場合、`napi_ok` を返します。

このメソッドは、コールバック関数内で、指定されたコールバック情報から引数や `this` ポインタなどの呼び出しに関する詳細を取得するために使用されます。

### `napi_get_new_target` {#napi_get_new_target}

**Added in: v8.6.0**

**N-API version: 1**

```C [C]
napi_status napi_get_new_target(napi_env env,
                                napi_callback_info cbinfo,
                                napi_value* result)
```
- `[in] env`: APIが起動される環境。
- `[in] cbinfo`: コールバック関数に渡されるコールバック情報。
- `[out] result`: コンストラクタ呼び出しの `new.target`。

APIが成功した場合、`napi_ok` を返します。

このAPIは、コンストラクタ呼び出しの `new.target` を返します。 現在のコールバックがコンストラクタ呼び出しでない場合、結果は `NULL` になります。


### `napi_new_instance` {#napi_new_instance}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_new_instance(napi_env env,
                              napi_value cons,
                              size_t argc,
                              napi_value* argv,
                              napi_value* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] cons`: コンストラクタとして呼び出すJavaScript関数を表す`napi_value`。
- `[in] argc`: `argv`配列内の要素数。
- `[in] argv`: コンストラクタへの引数を表す`napi_value`としてのJavaScript値の配列。 `argc`がゼロの場合、このパラメータは`NULL`を渡すことで省略できます。
- `[out] result`: 返されるJavaScriptオブジェクトを表す`napi_value`。この場合は構築されたオブジェクトです。

このメソッドは、オブジェクトのコンストラクタを表す指定された`napi_value`を使用して新しいJavaScript値をインスタンス化するために使用されます。 たとえば、次のスニペットを考えてみましょう。

```js [ESM]
function MyObject(param) {
  this.param = param;
}

const arg = 'hello';
const value = new MyObject(arg);
```
次のスニペットを使用して、Node-APIでおおよそ近似できます。

```C [C]
// コンストラクタ関数MyObjectを取得します
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
APIが成功した場合は`napi_ok`を返します。

## オブジェクトのラップ {#object-wrap}

Node-APIは、JavaScriptからクラスのコンストラクタとメソッドを呼び出すことができるように、C++クラスとインスタンスを「ラップ」する方法を提供します。

ラップされたオブジェクトの場合、クラスプロトタイプで呼び出された関数とクラスのインスタンスで呼び出された関数を区別することが難しい場合があります。 この問題に対処するために使用される一般的なパターンは、後で`instanceof`チェックを行うために、クラスコンストラクタへの永続的な参照を保存することです。

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
参照は、不要になったら解放する必要があります。

JavaScriptオブジェクトが特定のネイティブ型のラッパーであることを保証するには、`napi_instanceof()`だけでは不十分な場合があります。 これは特に、ラップされたJavaScriptオブジェクトが、プロトタイプメソッドの`this`値としてではなく、静的メソッドを介してアドオンに渡される場合に当てはまります。 このような場合、正しくないアンラップが発生する可能性があります。

```js [ESM]
const myAddon = require('./build/Release/my_addon.node');

// `openDatabase()`は、ネイティブデータベースをラップするJavaScriptオブジェクトを返します
// ハンドル。
const dbHandle = myAddon.openDatabase();

// `query()`は、ネイティブクエリハンドルをラップするJavaScriptオブジェクトを返します。
const queryHandle = myAddon.query(dbHandle, 'Gimme ALL the things!');

// 下の行には偶発的なエラーがあります。 の最初のパラメータ
// `myAddon.queryHasRecords()`は、データベースハンドル（`dbHandle`）である必要があります。
// クエリハンドル（`query`）であるため、whileループの正しい条件は
// あるはずです
//
// myAddon.queryHasRecords(dbHandle, queryHandle)
//
while (myAddon.queryHasRecords(queryHandle, dbHandle)) {
  // レコードを取得します
}
```
上記の例では、`myAddon.queryHasRecords()`は2つの引数を受け入れるメソッドです。 1つ目はデータベースハンドルで、2つ目はクエリハンドルです。 内部的には、最初の引数をアンラップし、結果のポインタをネイティブデータベースハンドルにキャストします。 次に、2番目の引数をアンラップし、結果のポインタをクエリハンドルにキャストします。 引数が間違った順序で渡された場合、キャストは機能しますが、基になるデータベース操作が失敗したり、無効なメモリアクセスが発生したりする可能性が高くなります。

最初の引数から取得したポインタがデータベースハンドルへのポインタであり、同様に、2番目の引数から取得したポインタがクエリハンドルへのポインタであることを確認するために、`queryHasRecords()`の実装ではタイプ検証を実行する必要があります。 データベースハンドルがインスタンス化されたJavaScriptクラスコンストラクタと、`napi_ref`のクエリハンドルがインスタンス化されたコンストラクタを保持すると、`napi_instanceof()`を使用して、`queryHashRecords()`に渡されたインスタンスが確かに正しいタイプであることを確認できます。

残念ながら、`napi_instanceof()`はプロトタイプ操作から保護しません。 たとえば、データベースハンドルインスタンスのプロトタイプは、クエリハンドルインスタンスのコンストラクタのプロトタイプに設定できます。 この場合、データベースハンドルインスタンスはクエリハンドルインスタンスとして表示され、クエリハンドルインスタンスの`napi_instanceof()`テストに合格しますが、データベースハンドルへのポインタは引き続き含まれます。

この目的のために、Node-APIはタイプタグ付け機能を提供します。

タイプタグは、アドオンに固有の128ビット整数です。 Node-APIは、タイプタグを格納するための`napi_type_tag`構造体を提供します。 このような値が、JavaScriptオブジェクトとともに渡されるか、または`napi_value`に格納されている[外部](/ja/nodejs/api/n-api#napi_create_external)とともに`napi_type_tag_object()`に渡されると、JavaScriptオブジェクトはタイプタグで「マーク」されます。 「マーク」はJavaScript側では見えません。 JavaScriptオブジェクトがネイティブバインディングに到達すると、`napi_check_object_type_tag()`を元のタイプタグとともに使用して、JavaScriptオブジェクトが以前にタイプタグで「マーク」されていたかどうかを判断できます。 これにより、`napi_instanceof()`が提供できるよりも忠実度の高いタイプチェック機能が作成されます。これは、このようなタイプタグ付けがプロトタイプ操作とアドオンのアンロード/リロードに耐えるためです。

上記の例を続けると、次のスケルトンアドオン実装は、`napi_type_tag_object()`と`napi_check_object_type_tag()`の使用法を示しています。

```C [C]
// この値は、データベースハンドルのタイプタグです。 コマンド
//
//   uuidgen | sed -r -e 's/-//g' -e 's/(.{16})(.*)/0x\1, 0x\2/'
//
// 構造体を初期化するために使用する2つの値を取得するために使用できます。
static const napi_type_tag DatabaseHandleTypeTag = {
  0x1edf75a38336451d, 0xa5ed9ce2e4c00c38
};

// この値は、クエリハンドルのタイプタグです。
static const napi_type_tag QueryHandleTypeTag = {
  0x9c73317f9fad44a3, 0x93c3920bf3b0ad6a
};

static napi_value
openDatabase(napi_env env, napi_callback_info info) {
  napi_status status;
  napi_value result;

  // データベースハンドルをもたらす基になるアクションを実行します。
  DatabaseHandle* dbHandle = open_database();

  // 新しい空のJSオブジェクトを作成します。
  status = napi_create_object(env, &result);
  if (status != napi_ok) return NULL;

  // オブジェクトに、`DatabaseHandle`へのポインタを保持していることを示すタグを付けます。
  status = napi_type_tag_object(env, result, &DatabaseHandleTypeTag);
  if (status != napi_ok) return NULL;

  // JSオブジェクト内に`DatabaseHandle`構造体へのポインタを格納します。
  status = napi_wrap(env, result, dbHandle, NULL, NULL, NULL);
  if (status != napi_ok) return NULL;

  return result;
}

// 後で、データベースハンドルであるJavaScriptオブジェクトを受信した場合
// `napi_check_object_type_tag()`を使用して、それが実際にそのようなものであることを確認できます。
// ハンドル。

static napi_value
query(napi_env env, napi_callback_info info) {
  napi_status status;
  size_t argc = 2;
  napi_value argv[2];
  bool is_db_handle;

  status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
  if (status != napi_ok) return NULL;

  // 最初にパラメータとして渡されたオブジェクトに、以前に
  // 適用されたタグ。
  status = napi_check_object_type_tag(env,
                                      argv[0],
                                      &DatabaseHandleTypeTag,
                                      &is_db_handle);
  if (status != napi_ok) return NULL;

  // そうでない場合は`TypeError`をスローします。
  if (!is_db_handle) {
    // TypeErrorをスローします。
    return NULL;
  }
}
```

### `napi_define_class` {#napi_define_class}

**Added in: v8.0.0**

**N-API version: 1**

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
- `[in] env`: APIが呼び出される環境。
- `[in] utf8name`: JavaScriptのコンストラクタ関数の名前。明確にするために、C++クラスをラップする場合はC++クラス名を使用することを推奨します。
- `[in] length`: `utf8name`のバイト単位の長さ。null終端されている場合は`NAPI_AUTO_LENGTH`。
- `[in] constructor`: クラスのインスタンスの構築を処理するコールバック関数。C++クラスをラップする場合、このメソッドは[`napi_callback`](/ja/nodejs/api/n-api#napi_callback)シグネチャを持つstaticメンバである必要があります。C++クラスのコンストラクタは使用できません。詳細は[`napi_callback`](/ja/nodejs/api/n-api#napi_callback)を参照してください。
- `[in] data`: コールバック情報の`data`プロパティとしてコンストラクタコールバックに渡されるオプションのデータ。
- `[in] property_count`: `properties`配列引数の項目数。
- `[in] properties`: クラスのstaticおよびインスタンスデータプロパティ、アクセサ、およびメソッドを記述するプロパティ記述子の配列。`napi_property_descriptor`を参照してください。
- `[out] result`: クラスのコンストラクタ関数を表す`napi_value`。

APIが成功した場合`napi_ok`を返します。

JavaScriptクラスを定義します。

- クラス名を持つJavaScriptコンストラクタ関数。対応するC++クラスをラップする場合、`constructor`を介して渡されるコールバックを使用して、新しいC++クラスインスタンスをインスタンス化できます。これは、[`napi_wrap`](/ja/nodejs/api/n-api#napi_wrap)を使用して構築されるJavaScriptオブジェクトインスタンス内に配置できます。
- 実装が対応するC++クラスの*static*データプロパティ、アクセサ、およびメソッドを呼び出すことができるコンストラクタ関数のプロパティ（`napi_static`属性を持つプロパティ記述子によって定義されます）。
- コンストラクタ関数の`prototype`オブジェクトのプロパティ。C++クラスをラップする場合、JavaScriptオブジェクトインスタンス内に配置されたC++クラスインスタンスを[`napi_unwrap`](/ja/nodejs/api/n-api#napi_unwrap)を使用して取得した後、C++クラスの*非static*データプロパティ、アクセサ、およびメソッドは、`napi_static`属性なしでプロパティ記述子に指定されたstatic関数から呼び出すことができます。

C++クラスをラップする場合、`constructor`を介して渡されるC++コンストラクタコールバックは、実際のクラスコンストラクタを呼び出すクラスのstaticメソッドである必要があります。次に、新しいC++インスタンスをJavaScriptオブジェクトでラップし、ラッパーオブジェクトを返します。詳細については、[`napi_wrap`](/ja/nodejs/api/n-api#napi_wrap)を参照してください。

[`napi_define_class`](/ja/nodejs/api/n-api#napi_define_class)から返されるJavaScriptコンストラクタ関数は、ネイティブコードからクラスの新しいインスタンスを構築したり、指定された値がクラスのインスタンスであるかどうかを確認するために、後で保存して使用されることがよくあります。その場合、関数値がガベージコレクションされるのを防ぐために、[`napi_create_reference`](/ja/nodejs/api/n-api#napi_create_reference)を使用して、それへの強力な永続的な参照を作成し、参照カウントが\>= 1に維持されるようにすることができます。

`data`パラメーターまたは`napi_property_descriptor`配列項目の`data`フィールドを介してこのAPIに渡される`NULL`以外のデータは、結果のJavaScriptコンストラクタ（`result`パラメーターで返されます）に関連付け、JavaScript関数とデータを[`napi_add_finalizer`](/ja/nodejs/api/n-api#napi_add_finalizer)に渡すことによって、クラスがガベージコレクションされるときにいつでも解放できます。


### `napi_wrap` {#napi_wrap}

**追加: v8.0.0**

**N-API バージョン: 1**

```C [C]
napi_status napi_wrap(napi_env env,
                      napi_value js_object,
                      void* native_object,
                      napi_finalize finalize_cb,
                      void* finalize_hint,
                      napi_ref* result);
```
- `[in] env`: API が呼び出される環境。
- `[in] js_object`: ネイティブオブジェクトのラッパーとなる JavaScript オブジェクト。
- `[in] native_object`: JavaScript オブジェクトにラップされるネイティブインスタンス。
- `[in] finalize_cb`: JavaScript オブジェクトがガベージコレクションされたときにネイティブインスタンスを解放するために使用できる、オプションのネイティブコールバック。詳細については、[`napi_finalize`](/ja/nodejs/api/n-api#napi_finalize) を参照してください。
- `[in] finalize_hint`: ファイナライズコールバックに渡されるオプションのコンテキストヒント。
- `[out] result`: ラップされたオブジェクトへのオプションの参照。

API が成功した場合、`napi_ok` を返します。

ネイティブインスタンスを JavaScript オブジェクトでラップします。ネイティブインスタンスは、後で `napi_unwrap()` を使用して取得できます。

JavaScript コードが `napi_define_class()` を使用して定義されたクラスのコンストラクタを呼び出すと、コンストラクタの `napi_callback` が呼び出されます。ネイティブクラスのインスタンスを構築した後、コールバックは `napi_wrap()` を呼び出して、新しく構築されたインスタンスを、コンストラクタコールバックへの `this` 引数であるすでに作成された JavaScript オブジェクトにラップする必要があります。（この `this` オブジェクトは、コンストラクタ関数の `prototype` から作成されたため、すでにすべてのインスタンスプロパティとメソッドの定義を持っています。）

通常、クラスインスタンスをラップするときは、ファイナライズコールバックを提供する必要があります。これは、ファイナライズコールバックへの `data` 引数として受信されるネイティブインスタンスを単純に削除します。

オプションで返される参照は、最初は弱参照です。つまり、参照カウントは 0 です。通常、この参照カウントは、インスタンスを有効な状態に保つ必要のある非同期操作中に一時的にインクリメントされます。

*注意*: オプションで返される参照（取得した場合）は、ファイナライズコールバックの呼び出しに応じてのみ、[`napi_delete_reference`](/ja/nodejs/api/n-api#napi_delete_reference) を介して削除する必要があります。それより前に削除すると、ファイナライズコールバックが呼び出されない可能性があります。したがって、参照を取得するときは、参照の正しい破棄を可能にするために、ファイナライズコールバックも必要です。

ファイナライザーコールバックは遅延される場合があり、オブジェクトがガベージコレクションされ（弱参照が無効になり）、ファイナライザーがまだ呼び出されていないウィンドウが残ります。`napi_wrap()` によって返された弱参照に対して `napi_get_reference_value()` を使用する場合は、空の結果も処理する必要があります。

オブジェクトに対して 2 回目に `napi_wrap()` を呼び出すと、エラーが返されます。別のネイティブインスタンスをオブジェクトに関連付けるには、最初に `napi_remove_wrap()` を使用します。


### `napi_unwrap` {#napi_unwrap}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_unwrap(napi_env env,
                        napi_value js_object,
                        void** result);
```
- `[in] env`: API が呼び出される環境。
- `[in] js_object`: ネイティブインスタンスに関連付けられたオブジェクト。
- `[out] result`: ラップされたネイティブインスタンスへのポインター。

API が成功した場合は `napi_ok` を返します。

`napi_wrap()` を使用して以前に JavaScript オブジェクトにラップされたネイティブインスタンスを取得します。

JavaScript コードがクラスのメソッドまたはプロパティアクセサーを呼び出すと、対応する `napi_callback` が呼び出されます。コールバックがインスタンスメソッドまたはアクセサーの場合、コールバックへの `this` 引数はラッパーオブジェクトです。呼び出しのターゲットであるラップされた C++ インスタンスは、ラッパーオブジェクトで `napi_unwrap()` を呼び出すことで取得できます。

### `napi_remove_wrap` {#napi_remove_wrap}

**Added in: v8.5.0**

**N-API version: 1**

```C [C]
napi_status napi_remove_wrap(napi_env env,
                             napi_value js_object,
                             void** result);
```
- `[in] env`: API が呼び出される環境。
- `[in] js_object`: ネイティブインスタンスに関連付けられたオブジェクト。
- `[out] result`: ラップされたネイティブインスタンスへのポインター。

API が成功した場合は `napi_ok` を返します。

`napi_wrap()` を使用して以前に JavaScript オブジェクト `js_object` にラップされたネイティブインスタンスを取得し、ラッピングを削除します。ファイナライズコールバックがラッピングに関連付けられていた場合、JavaScript オブジェクトがガベージコレクションされても、それは呼び出されなくなります。

### `napi_type_tag_object` {#napi_type_tag_object}

**Added in: v14.8.0, v12.19.0**

**N-API version: 8**

```C [C]
napi_status napi_type_tag_object(napi_env env,
                                 napi_value js_object,
                                 const napi_type_tag* type_tag);
```
- `[in] env`: API が呼び出される環境。
- `[in] js_object`: マークされる JavaScript オブジェクトまたは [external](/ja/nodejs/api/n-api#napi_create_external)。
- `[in] type_tag`: オブジェクトがマークされるタグ。

API が成功した場合は `napi_ok` を返します。

`type_tag` ポインターの値を JavaScript オブジェクトまたは [external](/ja/nodejs/api/n-api#napi_create_external) に関連付けます。`napi_check_object_type_tag()` を使用すると、オブジェクトにアタッチされたタグをアドオンが所有するタグと比較して、オブジェクトの型が正しいことを確認できます。

オブジェクトにすでにタイプタグが関連付けられている場合、この API は `napi_invalid_arg` を返します。


### `napi_check_object_type_tag` {#napi_check_object_type_tag}

**Added in: v14.8.0, v12.19.0**

**N-API version: 8**

```C [C]
napi_status napi_check_object_type_tag(napi_env env,
                                       napi_value js_object,
                                       const napi_type_tag* type_tag,
                                       bool* result);
```
- `[in] env`: APIが呼び出される環境。
- `[in] js_object`: 型タグを調べるJavaScriptオブジェクトまたは[外部](/ja/nodejs/api/n-api#napi_create_external)。
- `[in] type_tag`: オブジェクトに見つかったタグと比較するタグ。
- `[out] result`: 指定された型タグがオブジェクトの型タグと一致するかどうか。 オブジェクトに型タグが見つからなかった場合も`false`が返されます。

APIが成功した場合は`napi_ok`を返します。

`type_tag`として指定されたポインタを`js_object`で見つけることができるものと比較します。 `js_object`にタグが見つからない場合、またはタグが見つかったが`type_tag`と一致しない場合、`result`は`false`に設定されます。 タグが見つかり、`type_tag`と一致する場合、`result`は`true`に設定されます。

### `napi_add_finalizer` {#napi_add_finalizer}

**Added in: v8.0.0**

**N-API version: 5**

```C [C]
napi_status napi_add_finalizer(napi_env env,
                               napi_value js_object,
                               void* finalize_data,
                               node_api_basic_finalize finalize_cb,
                               void* finalize_hint,
                               napi_ref* result);
```
- `[in] env`: APIが呼び出される環境。
- `[in] js_object`: ネイティブデータがアタッチされるJavaScriptオブジェクト。
- `[in] finalize_data`: `finalize_cb`に渡されるオプションのデータ。
- `[in] finalize_cb`: JavaScriptオブジェクトがガベージコレクションされたときに、ネイティブデータを解放するために使用されるネイティブコールバック。 [`napi_finalize`](/ja/nodejs/api/n-api#napi_finalize) で詳細を確認できます。
- `[in] finalize_hint`: ファイナライズコールバックに渡されるオプションのコンテキストヒント。
- `[out] result`: JavaScriptオブジェクトへのオプションの参照。

APIが成功した場合は`napi_ok`を返します。

`js_object`内のJavaScriptオブジェクトがガベージコレクションされたときに呼び出される`napi_finalize`コールバックを追加します。

このAPIは、単一のJavaScriptオブジェクトに対して複数回呼び出すことができます。

*注意*: オプションで返される参照（取得した場合）は、ファイナライズコールバックの呼び出しに応じて**のみ** [`napi_delete_reference`](/ja/nodejs/api/n-api#napi_delete_reference)を介して削除する必要があります。 それより前に削除すると、ファイナライズコールバックが呼び出されない可能性があります。 したがって、参照を取得する場合は、参照の正しい破棄を可能にするために、ファイナライズコールバックも必要になります。


#### `node_api_post_finalizer` {#node_api_post_finalizer}

**追加:** v21.0.0, v20.10.0, v18.19.0

::: warning [Stable: 1 - 実験的]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

```C [C]
napi_status node_api_post_finalizer(node_api_basic_env env,
                                    napi_finalize finalize_cb,
                                    void* finalize_data,
                                    void* finalize_hint);
```
- `[in] env`: APIが呼び出される環境。
- `[in] finalize_cb`: JavaScriptオブジェクトがガベージコレクションされたときに、ネイティブデータを解放するために使用されるネイティブコールバック。 [`napi_finalize`](/ja/nodejs/api/n-api#napi_finalize)により詳細な情報が提供されます。
- `[in] finalize_data`: `finalize_cb`に渡されるオプションのデータ。
- `[in] finalize_hint`: finalizeコールバックに渡されるオプションのコンテキストヒント。

APIが成功した場合`napi_ok`を返します。

イベントループで非同期に呼び出される`napi_finalize`コールバックをスケジュールします。

通常、ファイナライザはGC（ガベージコレクター）がオブジェクトを収集している間に呼び出されます。その時点で、GC状態の変更を引き起こす可能性のあるNode-APIの呼び出しは無効になり、Node.jsがクラッシュします。

`node_api_post_finalizer`は、アドオンがそのようなNode-APIの呼び出しをGCファイナライズの外部の時点に延期できるようにすることで、この制限を回避するのに役立ちます。

## 単純な非同期操作 {#simple-asynchronous-operations}

アドオンモジュールは、実装の一部としてlibuvから非同期ヘルパーを活用する必要があることがよくあります。 これにより、作業が完了する前にメソッドが返ることができるように、非同期で実行される作業をスケジュールできます。 これにより、Node.jsアプリケーション全体の実行がブロックされるのを防ぐことができます。

Node-APIは、最も一般的な非同期ユースケースをカバーするこれらのサポート機能のABI安定インターフェイスを提供します。

Node-APIは、非同期ワーカーの管理に使用される`napi_async_work`構造体を定義します。 インスタンスは、[`napi_create_async_work`](/ja/nodejs/api/n-api#napi_create_async_work)および[`napi_delete_async_work`](/ja/nodejs/api/n-api#napi_delete_async_work)で作成/削除されます。

`execute`および`complete`コールバックは、エグゼキューターが実行準備完了になったとき、およびタスクが完了したときにそれぞれ呼び出される関数です。

`execute`関数は、JavaScriptの実行またはJavaScriptオブジェクトとの対話を招く可能性のあるNode-API呼び出しを避ける必要があります。 ほとんどの場合、Node-API呼び出しを行う必要があるコードは、代わりに`complete`コールバックで行う必要があります。 JavaScriptを実行する可能性が高いため、executeコールバックで`napi_env`パラメーターを使用しないでください。

これらの関数は、次のインターフェイスを実装します。

```C [C]
typedef void (*napi_async_execute_callback)(napi_env env,
                                            void* data);
typedef void (*napi_async_complete_callback)(napi_env env,
                                             napi_status status,
                                             void* data);
```
これらのメソッドが呼び出されると、渡される`data`パラメーターは、アドオンが提供する`void*`データであり、`napi_create_async_work`呼び出しに渡されました。

作成されると、非同期ワーカーは[`napi_queue_async_work`](/ja/nodejs/api/n-api#napi_queue_async_work)関数を使用して実行のためにキューに入れることができます。

```C [C]
napi_status napi_queue_async_work(node_api_basic_env env,
                                  napi_async_work work);
```
作業が実行を開始する前にキャンセルする必要がある場合は、[`napi_cancel_async_work`](/ja/nodejs/api/n-api#napi_cancel_async_work)を使用できます。

[`napi_cancel_async_work`](/ja/nodejs/api/n-api#napi_cancel_async_work)を呼び出した後、`complete`コールバックは`napi_cancelled`のステータス値で呼び出されます。 キャンセルされた場合でも、`complete`コールバックの呼び出し前に作業を削除しないでください。


### `napi_create_async_work` {#napi_create_async_work}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v8.6.0 | `async_resource` および `async_resource_name` パラメータが追加されました。 |
| v8.0.0 | v8.0.0 で追加されました。 |
:::

**N-API バージョン: 1**

```C [C]
napi_status napi_create_async_work(napi_env env,
                                   napi_value async_resource,
                                   napi_value async_resource_name,
                                   napi_async_execute_callback execute,
                                   napi_async_complete_callback complete,
                                   void* data,
                                   napi_async_work* result);
```
- `[in] env`: API が呼び出される環境。
- `[in] async_resource`: オプションで、非同期処理に関連付けられたオブジェクトであり、可能な `async_hooks` の [`init` フック](/ja/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource) に渡されます。
- `[in] async_resource_name`: `async_hooks` API によって公開される診断情報のために提供されるリソースの種類を示す識別子。
- `[in] execute`: ロジックを非同期的に実行するために呼び出されるべきネイティブ関数。 指定された関数は、ワーカースレッドプールから呼び出され、メインイベントループスレッドと並行して実行できます。
- `[in] complete`: 非同期ロジックが完了したかキャンセルされたときに呼び出されるネイティブ関数。 指定された関数は、メインイベントループスレッドから呼び出されます。 詳細は、[`napi_async_complete_callback`](/ja/nodejs/api/n-api#napi_async_complete_callback) を参照してください。
- `[in] data`: ユーザー提供のデータコンテキスト。 これは、execute 関数および complete 関数に返されます。
- `[out] result`: 新しく作成された非同期処理のハンドルである `napi_async_work*`。

API が成功した場合は `napi_ok` を返します。

このAPIは、ロジックを非同期的に実行するために使用されるワークオブジェクトを割り当てます。 ワークが不要になったら、[`napi_delete_async_work`](/ja/nodejs/api/n-api#napi_delete_async_work) を使用して解放する必要があります。

`async_resource_name` は、ヌル終端されたUTF-8エンコードされた文字列である必要があります。

`async_resource_name` 識別子はユーザーによって提供され、実行される非同期処理のタイプを表す必要があります。 モジュール名を含めるなど、名前空間を識別子に適用することも推奨されます。 詳細は、[`async_hooks` ドキュメント](/ja/nodejs/api/async_hooks#type)を参照してください。


### `napi_delete_async_work` {#napi_delete_async_work}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_delete_async_work(napi_env env,
                                   napi_async_work work);
```
- `[in] env`: APIが起動された環境です。
- `[in] work`: `napi_create_async_work`の呼び出しによって返されるハンドルです。

APIが成功した場合`napi_ok`を返します。

このAPIは、以前に割り当てられたworkオブジェクトを解放します。

このAPIは、JavaScriptの例外が保留中の場合でも呼び出すことができます。

### `napi_queue_async_work` {#napi_queue_async_work}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_queue_async_work(node_api_basic_env env,
                                  napi_async_work work);
```
- `[in] env`: APIが起動された環境です。
- `[in] work`: `napi_create_async_work`の呼び出しによって返されるハンドルです。

APIが成功した場合`napi_ok`を返します。

このAPIは、以前に割り当てられたworkの実行をスケジュールするように要求します。 正常に返された場合、同じ`napi_async_work`アイテムでこのAPIを再度呼び出してはなりません。結果は未定義になります。

### `napi_cancel_async_work` {#napi_cancel_async_work}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_cancel_async_work(node_api_basic_env env,
                                   napi_async_work work);
```
- `[in] env`: APIが起動された環境です。
- `[in] work`: `napi_create_async_work`の呼び出しによって返されるハンドルです。

APIが成功した場合`napi_ok`を返します。

このAPIは、キューに登録されたworkがまだ開始されていない場合にキャンセルします。 既に実行を開始している場合は、キャンセルできず、`napi_generic_failure`が返されます。 成功した場合、`complete`コールバックは、ステータス値`napi_cancelled`で呼び出されます。 workは、正常にキャンセルされた場合でも、`complete`コールバックが呼び出される前に削除しないでください。

このAPIは、JavaScriptの例外が保留中の場合でも呼び出すことができます。

## カスタムの非同期操作 {#custom-asynchronous-operations}

上記の単純な非同期work APIは、すべてのシナリオに適しているとは限りません。 他の非同期メカニズムを使用する場合は、非同期操作がランタイムによって適切に追跡されるようにするために、次のAPIが必要です。


### `napi_async_init` {#napi_async_init}

**追加: v8.6.0**

**N-API バージョン: 1**

```C [C]
napi_status napi_async_init(napi_env env,
                            napi_value async_resource,
                            napi_value async_resource_name,
                            napi_async_context* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] async_resource`: `async_hooks`の[`init`フック](/ja/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource)に渡されうる、[`async_hooks.executionAsyncResource()`](/ja/nodejs/api/async_hooks#async_hooksexecutionasyncresource)からアクセスできる、非同期処理に関連付けられたオブジェクト。
- `[in] async_resource_name`: `async_hooks` APIによって公開される診断情報のために提供されているリソースの種類を識別子。
- `[out] result`: 初期化された非同期コンテキスト。

APIが成功した場合、`napi_ok`を返します。

`async_hooks`関連のAPIが正しく動作するように、`async_resource`オブジェクトは[`napi_async_destroy`](/ja/nodejs/api/n-api#napi_async_destroy)まで保持される必要があります。以前のバージョンとのABI互換性を維持するために、メモリリークの発生を避けるために、`napi_async_context`は`async_resource`オブジェクトへの強い参照を保持していません。ただし、`napi_async_context`が`napi_async_destroy`によって破棄される前に`async_resource`がJavaScriptエンジンによってガベージコレクションされた場合、[`napi_open_callback_scope`](/ja/nodejs/api/n-api#napi_open_callback_scope)や[`napi_make_callback`](/ja/nodejs/api/n-api#napi_make_callback)のような`napi_async_context`関連のAPIを呼び出すと、`AsyncLocalStorage` APIを使用する際に非同期コンテキストの損失のような問題が発生する可能性があります。

以前のバージョンとのABI互換性を維持するために、`async_resource`に`NULL`を渡してもエラーにはなりません。ただし、これは推奨されません。これは、`async_hooks`の[`init`フック](/ja/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource)と`async_hooks.executionAsyncResource()`で望ましくない動作を引き起こす可能性があるため、リソースは非同期コールバック間のリンクを提供するために、基盤となる`async_hooks`実装で必要とされるようになりました。


### `napi_async_destroy` {#napi_async_destroy}

**追加:** v8.6.0

**N-API バージョン: 1**

```C [C]
napi_status napi_async_destroy(napi_env env,
                               napi_async_context async_context);
```
- `[in] env`: API が呼び出される環境。
- `[in] async_context`: 破棄される非同期コンテキスト。

API が成功した場合、`napi_ok` を返します。

保留中の JavaScript 例外がある場合でも、この API を呼び出すことができます。

### `napi_make_callback` {#napi_make_callback}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v8.6.0 | `async_context` パラメータを追加しました。 |
| v8.0.0 | 追加: v8.0.0 |
:::

**N-API バージョン: 1**

```C [C]
NAPI_EXTERN napi_status napi_make_callback(napi_env env,
                                           napi_async_context async_context,
                                           napi_value recv,
                                           napi_value func,
                                           size_t argc,
                                           const napi_value* argv,
                                           napi_value* result);
```
- `[in] env`: API が呼び出される環境。
- `[in] async_context`: コールバックを呼び出す非同期操作のコンテキスト。 これは通常、以前に [`napi_async_init`](/ja/nodejs/api/n-api#napi_async_init) から取得した値である必要があります。 以前のバージョンとの ABI 互換性を維持するために、`async_context` に `NULL` を渡してもエラーにはなりません。 ただし、これにより、非同期フックの動作が正しくなくなります。 考えられる問題としては、`AsyncLocalStorage` API を使用する際の非同期コンテキストの損失などがあります。
- `[in] recv`: 呼び出された関数に渡される `this` 値。
- `[in] func`: 呼び出す JavaScript 関数を表す `napi_value`。
- `[in] argc`: `argv` 配列内の要素の数。
- `[in] argv`: 関数の引数を表す `napi_value` としての JavaScript 値の配列。 `argc` がゼロの場合、このパラメータは `NULL` を渡すことで省略できます。
- `[out] result`: 返される JavaScript オブジェクトを表す `napi_value`。

API が成功した場合、`napi_ok` を返します。

このメソッドを使用すると、ネイティブアドオンから JavaScript 関数オブジェクトを呼び出すことができます。 この API は `napi_call_function` と似ています。 ただし、非同期操作から戻った後 (スタックに他のスクリプトがない場合) に、ネイティブコードから JavaScript *に*コールバックする *ため*に使用されます。 これは `node::MakeCallback` の非常に単純なラッパーです。

`napi_async_complete_callback` 内から `napi_make_callback` を使用する必要は *ありません*。 その状況では、コールバックの非同期コンテキストはすでに設定されているため、`napi_call_function` を直接呼び出すだけで十分です。 `napi_create_async_work` を使用しないカスタム非同期動作を実装する場合は、`napi_make_callback` 関数が必要になる場合があります。

コールバック中に JavaScript によってマイクロタスクキューでスケジュールされた `process.nextTick` または Promise は、C/C++ に戻る前に実行されます。


### `napi_open_callback_scope` {#napi_open_callback_scope}

**Added in: v9.6.0**

**N-API version: 3**

```C [C]
NAPI_EXTERN napi_status napi_open_callback_scope(napi_env env,
                                                 napi_value resource_object,
                                                 napi_async_context context,
                                                 napi_callback_scope* result)
```
- `[in] env`: APIが呼び出される環境。
- `[in] resource_object`: `async_hooks` [`init`フック](/ja/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource)に渡される非同期処理に関連付けられたオブジェクト。このパラメータは非推奨であり、実行時には無視されます。代わりに[`napi_async_init`](/ja/nodejs/api/n-api#napi_async_init)の`async_resource`パラメータを使用してください。
- `[in] context`: コールバックを呼び出す非同期操作のコンテキスト。これは、以前に[`napi_async_init`](/ja/nodejs/api/n-api#napi_async_init)から取得した値である必要があります。
- `[out] result`: 新しく作成されたスコープ。

(例えば、promiseを解決するような) 特定のNode-API呼び出しを行う際に、コールバックに関連付けられたスコープと同等のものが存在する必要がある場合があります。スタック上に他のスクリプトがない場合、[`napi_open_callback_scope`](/ja/nodejs/api/n-api#napi_open_callback_scope)と[`napi_close_callback_scope`](/ja/nodejs/api/n-api#napi_close_callback_scope)関数を使用して、必要なスコープを開閉できます。

### `napi_close_callback_scope` {#napi_close_callback_scope}

**Added in: v9.6.0**

**N-API version: 3**

```C [C]
NAPI_EXTERN napi_status napi_close_callback_scope(napi_env env,
                                                  napi_callback_scope scope)
```
- `[in] env`: APIが呼び出される環境。
- `[in] scope`: 閉じられるスコープ。

このAPIは、保留中のJavaScript例外がある場合でも呼び出すことができます。

## バージョン管理 {#version-management}

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
- `[in] env`: APIが呼び出される環境。
- `[out] version`: Node.js自身のバージョン情報へのポインタ。

APIが成功した場合、`napi_ok`を返します。

この関数は、現在実行中のNode.jsのメジャー、マイナー、パッチバージョンを`version`構造体に格納し、`release`フィールドに[`process.release.name`](/ja/nodejs/api/process#processrelease)の値を格納します。

返されるバッファは静的に割り当てられており、解放する必要はありません。


### `napi_get_version` {#napi_get_version}

**Added in: v8.0.0**

**N-API version: 1**

```C [C]
napi_status napi_get_version(node_api_basic_env env,
                             uint32_t* result);
```
- `[in] env`: API が起動される環境。
- `[out] result`: サポートされている Node-API の最高バージョン。

API が成功した場合は `napi_ok` を返します。

この API は、Node.js ランタイムでサポートされている最高の Node-API バージョンを返します。 Node-API は、Node.js の新しいリリースが追加の API 関数をサポートするように、追加される予定です。 アドオンが、それをサポートする Node.js のバージョンで実行されている場合に新しい関数を使用し、それをサポートしない Node.js のバージョンで実行されている場合はフォールバック動作を提供できるようにするには、次の手順を実行します。

- `napi_get_version()` を呼び出して、API が利用可能かどうかを判断します。
- 利用可能な場合は、`uv_dlsym()` を使用して関数へのポインタを動的にロードします。
- 動的にロードされたポインタを使用して関数を呼び出します。
- 関数が利用できない場合は、関数を使用しない代替実装を提供します。

## メモリ管理 {#memory-management}

### `napi_adjust_external_memory` {#napi_adjust_external_memory}

**Added in: v8.5.0**

**N-API version: 1**

```C [C]
NAPI_EXTERN napi_status napi_adjust_external_memory(node_api_basic_env env,
                                                    int64_t change_in_bytes,
                                                    int64_t* result);
```
- `[in] env`: API が起動される環境。
- `[in] change_in_bytes`: JavaScript オブジェクトによって維持されている外部で割り当てられたメモリの変化量。
- `[out] result`: 調整された値

API が成功した場合は `napi_ok` を返します。

この関数は、JavaScript オブジェクトによって維持されている外部で割り当てられたメモリの量（つまり、ネイティブアドオンによって割り当てられた独自のメモリを指す JavaScript オブジェクト）を V8 に示します。 外部で割り当てられたメモリを登録すると、通常よりもグローバルガベージコレクションがより頻繁にトリガーされます。

## Promise {#promises}

Node-API は、ECMA 仕様の [セクション 25.4](https://tc39.github.io/ecma262/#sec-promise-objects) で説明されているように、`Promise` オブジェクトを作成するための機能を提供します。 これは、オブジェクトのペアとしてプロミスを実装します。 `napi_create_promise()` によってプロミスが作成されると、「遅延」オブジェクトが作成され、`Promise` と共に返されます。 遅延オブジェクトは、作成された `Promise` にバインドされ、`napi_resolve_deferred()` または `napi_reject_deferred()` を使用して `Promise` を解決または拒否する唯一の手段です。 `napi_create_promise()` によって作成された遅延オブジェクトは、`napi_resolve_deferred()` または `napi_reject_deferred()` によって解放されます。 `Promise` オブジェクトは JavaScript に返され、通常の方法で使用できます。

たとえば、プロミスを作成して非同期ワーカーに渡すには:

```C [C]
napi_deferred deferred;
napi_value promise;
napi_status status;

// プロミスを作成します。
status = napi_create_promise(env, &deferred, &promise);
if (status != napi_ok) return NULL;

// 遅延を非同期アクションを実行する関数に渡します。
do_something_asynchronous(deferred);

// JS にプロミスを返します
return promise;
```
上記の関数 `do_something_asynchronous()` は、非同期アクションを実行し、遅延を解決または拒否して、プロミスを終了し、遅延を解放します。

```C [C]
napi_deferred deferred;
napi_value undefined;
napi_status status;

// 遅延を終了するための値を作成します。
status = napi_get_undefined(env, &undefined);
if (status != napi_ok) return NULL;

// 非同期アクションが成功したかどうかに応じて、遅延に関連付けられたプロミスを解決または拒否します。
if (asynchronous_action_succeeded) {
  status = napi_resolve_deferred(env, deferred, undefined);
} else {
  status = napi_reject_deferred(env, deferred, undefined);
}
if (status != napi_ok) return NULL;

// この時点で、遅延は解放されているため、NULL を割り当てる必要があります。
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
- `[in] env`: APIが呼び出される環境。
- `[out] deferred`: 新規に作成されたdeferredオブジェクト。関連付けられたPromiseを解決または拒否するために、後で`napi_resolve_deferred()`または`napi_reject_deferred()`に渡すことができます。
- `[out] promise`: deferredオブジェクトに関連付けられたJavaScript Promise。

APIが成功した場合、`napi_ok`を返します。

このAPIは、deferredオブジェクトとJavaScript Promiseを作成します。

### `napi_resolve_deferred` {#napi_resolve_deferred}

**Added in: v8.5.0**

**N-API version: 1**

```C [C]
napi_status napi_resolve_deferred(napi_env env,
                                  napi_deferred deferred,
                                  napi_value resolution);
```
- `[in] env`: APIが呼び出される環境。
- `[in] deferred`: 解決する関連Promiseを持つdeferredオブジェクト。
- `[in] resolution`: Promiseを解決する値。

このAPIは、関連付けられたdeferredオブジェクトを介してJavaScript Promiseを解決します。 したがって、対応するdeferredオブジェクトが利用可能なJavaScript Promiseを解決するためにのみ使用できます。 これは事実上、Promiseが`napi_create_promise()`を使用して作成され、その呼び出しから返されたdeferredオブジェクトがこのAPIに渡されるために保持されている必要があることを意味します。

deferredオブジェクトは、正常に完了すると解放されます。

### `napi_reject_deferred` {#napi_reject_deferred}

**Added in: v8.5.0**

**N-API version: 1**

```C [C]
napi_status napi_reject_deferred(napi_env env,
                                 napi_deferred deferred,
                                 napi_value rejection);
```
- `[in] env`: APIが呼び出される環境。
- `[in] deferred`: 解決する関連Promiseを持つdeferredオブジェクト。
- `[in] rejection`: Promiseを拒否する値。

このAPIは、関連付けられたdeferredオブジェクトを介してJavaScript Promiseを拒否します。 したがって、対応するdeferredオブジェクトが利用可能なJavaScript Promiseを拒否するためにのみ使用できます。 これは事実上、Promiseが`napi_create_promise()`を使用して作成され、その呼び出しから返されたdeferredオブジェクトがこのAPIに渡されるために保持されている必要があることを意味します。

deferredオブジェクトは、正常に完了すると解放されます。


### `napi_is_promise` {#napi_is_promise}

**追加: v8.5.0**

**N-API バージョン: 1**

```C [C]
napi_status napi_is_promise(napi_env env,
                            napi_value value,
                            bool* is_promise);
```
- `[in] env`: API が呼び出される環境。
- `[in] value`: 調査する値。
- `[out] is_promise`: `promise` がネイティブの Promise オブジェクトであるかどうかを示すフラグ（つまり、基盤となるエンジンによって作成された Promise オブジェクト）。

## スクリプトの実行 {#script-execution}

Node-API は、基盤となる JavaScript エンジンを使用して JavaScript を含む文字列を実行するための API を提供します。

### `napi_run_script` {#napi_run_script}

**追加: v8.5.0**

**N-API バージョン: 1**

```C [C]
NAPI_EXTERN napi_status napi_run_script(napi_env env,
                                        napi_value script,
                                        napi_value* result);
```
- `[in] env`: API が呼び出される環境。
- `[in] script`: 実行するスクリプトを含む JavaScript 文字列。
- `[out] result`: スクリプトの実行によって得られた値。

この関数は、JavaScript コードの文字列を実行し、次の注意点とともにその結果を返します。

- `eval` とは異なり、この関数はスクリプトが現在のレキシカルスコープにアクセスすることを許可しないため、[モジュールスコープ](/ja/nodejs/api/modules#the-module-scope)にもアクセスできません。つまり、`require` などの疑似グローバルは使用できません。
- スクリプトは[グローバルスコープ](/ja/nodejs/api/globals)にアクセスできます。スクリプト内の関数と `var` 宣言は、[`global`](/ja/nodejs/api/globals#global) オブジェクトに追加されます。`let` と `const` を使用して行われた変数宣言はグローバルに表示されますが、[`global`](/ja/nodejs/api/globals#global) オブジェクトには追加されません。
- スクリプト内の `this` の値は [`global`](/ja/nodejs/api/globals#global) です。

## libuv イベントループ {#libuv-event-loop}

Node-API は、特定の `napi_env` に関連付けられた現在のイベントループを取得する関数を提供します。

### `napi_get_uv_event_loop` {#napi_get_uv_event_loop}

**追加: v9.3.0, v8.10.0**

**N-API バージョン: 2**

```C [C]
NAPI_EXTERN napi_status napi_get_uv_event_loop(node_api_basic_env env,
                                               struct uv_loop_s** loop);
```
- `[in] env`: API が呼び出される環境。
- `[out] loop`: 現在の libuv ループインスタンス。

注: libuv は時間の経過とともに比較的安定していますが、ABI の安定性は保証されていません。この関数の使用は避ける必要があります。この関数を使用すると、Node.js のバージョン間で動作しないアドオンになる可能性があります。[非同期スレッドセーフ関数呼び出し](/ja/nodejs/api/n-api#asynchronous-thread-safe-function-calls)は、多くのユースケースの代替手段です。


## 非同期スレッドセーフ関数呼び出し {#asynchronous-thread-safe-function-calls}

JavaScript関数は通常、ネイティブアドオンのメインスレッドからのみ呼び出すことができます。アドオンが追加のスレッドを作成する場合、`napi_env`、`napi_value`、または`napi_ref`を必要とするNode-API関数は、それらのスレッドから呼び出してはなりません。

アドオンに追加のスレッドがあり、それらのスレッドによって完了した処理に基づいてJavaScript関数を呼び出す必要がある場合、それらのスレッドはアドオンのメインスレッドと通信して、メインスレッドが代わりにJavaScript関数を呼び出すことができるようにする必要があります。スレッドセーフ関数APIは、これを行う簡単な方法を提供します。

これらのAPIは、型`napi_threadsafe_function`と、この型のオブジェクトを作成、破棄、および呼び出すためのAPIを提供します。`napi_create_threadsafe_function()`は、複数のスレッドから呼び出すことができるJavaScript関数を保持する`napi_value`への永続的な参照を作成します。呼び出しは非同期的に行われます。これは、JavaScriptコールバックで呼び出す値がキューに入れられ、キュー内の各値に対して、最終的にJavaScript関数が呼び出されることを意味します。

`napi_threadsafe_function`の作成時に、`napi_finalize`コールバックを提供できます。このコールバックは、スレッドセーフ関数が破棄されようとしているときに、メインスレッドで呼び出されます。コンテキストと構築中に与えられた終了データを取得し、たとえば`uv_thread_join()`を呼び出すことによって、スレッドの後処理を行う機会を提供します。**メインループスレッドを除き、終了コールバックが完了した後、スレッドセーフ関数を使用するスレッドは存在してはなりません。**

`napi_create_threadsafe_function()`の呼び出し中に与えられた`context`は、`napi_get_threadsafe_function_context()`の呼び出しによって任意のスレッドから取得できます。

### スレッドセーフ関数の呼び出し {#calling-a-thread-safe-function}

`napi_call_threadsafe_function()`を使用して、JavaScriptへの呼び出しを開始できます。`napi_call_threadsafe_function()`は、APIがブロッキング的に動作するかどうかを制御するパラメータを受け入れます。`napi_tsfn_nonblocking`に設定されている場合、APIは非ブロッキング的に動作し、キューがいっぱいでデータがキューに正常に追加されなかった場合は`napi_queue_full`を返します。`napi_tsfn_blocking`に設定されている場合、APIはキューに空きができるまでブロックします。スレッドセーフ関数が最大キューサイズ0で作成された場合、`napi_call_threadsafe_function()`は決してブロックしません。

キューがいっぱいの場合、JavaScriptスレッドがデッドロックする可能性があるため、JavaScriptスレッドから`napi_tsfn_blocking`で`napi_call_threadsafe_function()`を呼び出すべきではありません。

JavaScriptへの実際の呼び出しは、`call_js_cb`パラメータを介して与えられたコールバックによって制御されます。`call_js_cb`は、`napi_call_threadsafe_function()`の正常な呼び出しによってキューに入れられた各値に対して、メインスレッドで一度呼び出されます。そのようなコールバックが与えられていない場合、デフォルトのコールバックが使用され、結果のJavaScript呼び出しには引数がありません。`call_js_cb`コールバックは、呼び出すJavaScript関数を`napi_value`としてパラメータで受け取り、`napi_threadsafe_function`を作成するときに使用された`void*`コンテキストポインタと、セカンダリスレッドのいずれかによって作成された次のデータポインタも受け取ります。次に、コールバックは`napi_call_function()`などのAPIを使用してJavaScriptを呼び出すことができます。

コールバックは、`env`と`call_js_cb`の両方を`NULL`に設定して呼び出すこともできます。これは、JavaScriptへの呼び出しが不可能になったことを示しますが、解放する必要があるアイテムがキューに残っています。これは通常、スレッドセーフ関数がまだアクティブな状態でNode.jsプロセスが終了したときに発生します。

Node-APIはコールバックに適したコンテキストで`call_js_cb`を実行するため、`napi_make_callback()`を介してJavaScriptを呼び出す必要はありません。

イベントループの各ティックで、ゼロ個以上のキューに入れられたアイテムが呼び出される場合があります。アプリケーションは、コールバックの呼び出しが進められ、時間が進むにつれてイベントが呼び出されるという特定の動作以外の特定の動作に依存すべきではありません。


### スレッドセーフ関数の参照カウント {#reference-counting-of-thread-safe-functions}

スレッドは、その存在期間中に `napi_threadsafe_function` オブジェクトに追加および削除できます。 したがって、作成時に初期スレッド数を指定することに加えて、`napi_acquire_threadsafe_function` を呼び出して、新しいスレッドがスレッドセーフ関数を使用し始めることを示すことができます。 同様に、`napi_release_threadsafe_function` を呼び出して、既存のスレッドがスレッドセーフ関数の使用を停止することを示すことができます。

`napi_threadsafe_function` オブジェクトは、オブジェクトを使用するすべてのスレッドが `napi_release_threadsafe_function()` を呼び出したか、`napi_call_threadsafe_function` の呼び出しに応じて `napi_closing` の戻りステータスを受け取った場合に破棄されます。 キューは、`napi_threadsafe_function` が破棄される前に空にされます。 `napi_release_threadsafe_function()` は、特定の `napi_threadsafe_function` と組み合わせて行われる最後API呼び出しである必要があります。これは、呼び出しが完了した後、`napi_threadsafe_function` がまだ割り当てられているという保証がないためです。 同じ理由で、`napi_call_threadsafe_function` の呼び出しに応じて `napi_closing` の戻り値を受け取った後は、スレッドセーフ関数を使用しないでください。 `napi_threadsafe_function` に関連付けられたデータは、`napi_create_threadsafe_function()` に渡された `napi_finalize` コールバックで解放できます。 `napi_create_threadsafe_function` のパラメーター `initial_thread_count` は、作成時に `napi_acquire_threadsafe_function` を複数回呼び出す代わりに、スレッドセーフ関数の最初の取得数をマークします。

`napi_threadsafe_function` を使用するスレッドの数がゼロに達すると、`napi_acquire_threadsafe_function()` を呼び出すことによって、それ以上のスレッドがそれを使用し始めることはできません。 実際、`napi_release_threadsafe_function()` を除く、それに関連付けられた後続のすべてのAPI呼び出しは、`napi_closing` のエラー値を返します。

スレッドセーフ関数は、`napi_release_threadsafe_function()` に `napi_tsfn_abort` の値を渡すことによって「中止」できます。 これにより、参照カウントがゼロに達する前でも、`napi_release_threadsafe_function()` を除く、スレッドセーフ関数に関連付けられた後続のすべてのAPIが `napi_closing` を返します。 特に、`napi_call_threadsafe_function()` は `napi_closing` を返し、スレッドセーフ関数への非同期呼び出しを行うことができなくなったことをスレッドに通知します。 これは、スレッドを終了するための基準として使用できます。 **<code>napi_call_threadsafe_function()</code> から <code>napi_closing</code> の戻り値を受け取ると、スレッドはスレッドセーフ関数が割り当てられていることが保証されなくなるため、それ以上使用してはなりません。**


### プロセスを実行し続けるかどうかの決定 {#deciding-whether-to-keep-the-process-running}

libuvハンドルと同様に、スレッドセーフ関数は「参照」および「非参照」にすることができます。「参照」されたスレッドセーフ関数は、それが作成されたスレッドのイベントループが、スレッドセーフ関数が破棄されるまで生き続けるようにします。対照的に、「非参照」されたスレッドセーフ関数は、イベントループが終了するのを防ぎません。この目的のために、API `napi_ref_threadsafe_function` および `napi_unref_threadsafe_function` が存在します。

`napi_unref_threadsafe_function` はスレッドセーフ関数を破棄可能としてマークせず、 `napi_ref_threadsafe_function` も破棄されるのを防ぎません。

### `napi_create_threadsafe_function` {#napi_create_threadsafe_function}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v12.6.0, v10.17.0 | カスタム `call_js_cb` で `func` パラメータをオプションにしました。 |
| v10.6.0 | v10.6.0 で追加 |
:::

**N-API バージョン: 4**

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
- `[in] env`: API が起動される環境。
- `[in] func`: 別のスレッドから呼び出すオプションの JavaScript 関数。 `NULL` が `call_js_cb` に渡される場合は、提供する必要があります。
- `[in] async_resource`: 可能な `async_hooks` [`init` フック](/ja/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource) に渡される非同期処理に関連付けられたオプションのオブジェクト。
- `[in] async_resource_name`: `async_hooks` API によって公開される診断情報のために提供されているリソースの種類に対する識別子を提供する JavaScript 文字列。
- `[in] max_queue_size`: キューの最大サイズ。制限がない場合は `0`。
- `[in] initial_thread_count`: 取得の初期数、つまり、この関数を使用するメインスレッドを含む、スレッドの初期数。
- `[in] thread_finalize_data`: `thread_finalize_cb` に渡すオプションのデータ。
- `[in] thread_finalize_cb`: `napi_threadsafe_function` が破棄されるときに呼び出すオプションの関数。
- `[in] context`: 結果の `napi_threadsafe_function` にアタッチするオプションのデータ。
- `[in] call_js_cb`: 別のスレッドでの呼び出しに応じて JavaScript 関数を呼び出すオプションのコールバック。このコールバックは、メインスレッドで呼び出されます。指定しない場合、JavaScript 関数はパラメータなしで、 `this` 値として `undefined` を使用して呼び出されます。 [`napi_threadsafe_function_call_js`](/ja/nodejs/api/n-api#napi_threadsafe_function_call_js) は、詳細を提供します。
- `[out] result`: 非同期スレッドセーフ JavaScript 関数。

**変更履歴:**

- 実験的 ( `NAPI_EXPERIMENTAL` が定義されている場合): `call_js_cb` でスローされたキャッチされない例外は、無視される代わりに、[`'uncaughtException'`](/ja/nodejs/api/process#event-uncaughtexception) イベントで処理されます。


### `napi_get_threadsafe_function_context` {#napi_get_threadsafe_function_context}

**Added in: v10.6.0**

**N-API version: 4**

```C [C]
NAPI_EXTERN napi_status
napi_get_threadsafe_function_context(napi_threadsafe_function func,
                                     void** result);
```
- `[in] func`: コンテキストを取得するスレッドセーフ関数。
- `[out] result`: コンテキストを格納する場所。

このAPIは、`func`を使用する任意のスレッドから呼び出すことができます。

### `napi_call_threadsafe_function` {#napi_call_threadsafe_function}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v14.5.0 | `napi_would_deadlock` のサポートは元に戻されました。 |
| v14.1.0 | メインスレッドまたはワーカー スレッドから `napi_tsfn_blocking` を使用して呼び出され、キューがいっぱいの場合は、`napi_would_deadlock` を返します。 |
| v10.6.0 | Added in: v10.6.0 |
:::

**N-API version: 4**

```C [C]
NAPI_EXTERN napi_status
napi_call_threadsafe_function(napi_threadsafe_function func,
                              void* data,
                              napi_threadsafe_function_call_mode is_blocking);
```
- `[in] func`: 呼び出す非同期スレッドセーフ JavaScript 関数。
- `[in] data`: スレッドセーフ JavaScript 関数の作成時に提供されたコールバック `call_js_cb` を介して JavaScript に送信されるデータ。
- `[in] is_blocking`: キューがいっぱいのときに呼び出しをブロックする必要があることを示す `napi_tsfn_blocking`、またはキューがいっぱいのときにステータス `napi_queue_full` で直ちに返される必要があることを示す `napi_tsfn_nonblocking` のいずれかの値を取ることができるフラグ。

JavaScript スレッドから `napi_tsfn_blocking` でこのAPIを呼び出すべきではありません。キューがいっぱいの場合は、JavaScript スレッドがデッドロックする可能性があります。

このAPIは、`napi_release_threadsafe_function()` が任意の スレッドから `abort` を `napi_tsfn_abort` に設定して呼び出された場合、`napi_closing` を返します。この値は、APIが `napi_ok` を返す場合にのみキューに追加されます。

このAPIは、`func`を使用する任意のスレッドから呼び出すことができます。

### `napi_acquire_threadsafe_function` {#napi_acquire_threadsafe_function}

**Added in: v10.6.0**

**N-API version: 4**

```C [C]
NAPI_EXTERN napi_status
napi_acquire_threadsafe_function(napi_threadsafe_function func);
```
- `[in] func`: 使用を開始する非同期スレッドセーフ JavaScript 関数。

スレッドは、他の スレッドセーフ 関数 API に `func` を渡す前に、このAPIを呼び出して、`func` を使用することを示す必要があります。これにより、他のすべての スレッド が `func` の使用を停止したときに、`func` が破棄されるのを防ぎます。

このAPIは、`func` の使用を開始する任意のスレッドから呼び出すことができます。


### `napi_release_threadsafe_function` {#napi_release_threadsafe_function}

**追加: v10.6.0**

**N-API バージョン: 4**

```C [C]
NAPI_EXTERN napi_status
napi_release_threadsafe_function(napi_threadsafe_function func,
                                 napi_threadsafe_function_release_mode mode);
```
- `[in] func`: 参照カウントを減らす非同期スレッドセーフ JavaScript 関数。
- `[in] mode`: フラグ。値は、現在のスレッドがスレッドセーフ関数をこれ以上呼び出さないことを示す `napi_tsfn_release`、または、現在のスレッドだけでなく、他のスレッドもスレッドセーフ関数をこれ以上呼び出さないことを示す `napi_tsfn_abort` のいずれかになります。`napi_tsfn_abort` に設定した場合、`napi_call_threadsafe_function()` のさらなる呼び出しは `napi_closing` を返し、それ以上の値はキューに入れられません。

スレッドは、`func` の使用を停止するときにこの API を呼び出す必要があります。この API を呼び出した後、`func` をスレッドセーフ API に渡すと、`func` が破棄されている可能性があるため、未定義の結果になります。

この API は、`func` の使用を停止する任意のスレッドから呼び出すことができます。

### `napi_ref_threadsafe_function` {#napi_ref_threadsafe_function}

**追加: v10.6.0**

**N-API バージョン: 4**

```C [C]
NAPI_EXTERN napi_status
napi_ref_threadsafe_function(node_api_basic_env env, napi_threadsafe_function func);
```
- `[in] env`: API が呼び出される環境。
- `[in] func`: 参照するスレッドセーフ関数。

この API は、`func` が破棄されるまでメインスレッドで実行されているイベントループが終了しないようにするために使用されます。[`uv_ref`](https://docs.libuv.org/en/v1.x/handle#c.uv_ref) と同様に、べき等でもあります。

`napi_unref_threadsafe_function` はスレッドセーフ関数を破棄可能としてマークするわけでもなく、`napi_ref_threadsafe_function` は破棄されるのを防ぐわけでもありません。その目的のために `napi_acquire_threadsafe_function` と `napi_release_threadsafe_function` が利用可能です。

この API は、メインスレッドからのみ呼び出すことができます。

### `napi_unref_threadsafe_function` {#napi_unref_threadsafe_function}

**追加: v10.6.0**

**N-API バージョン: 4**

```C [C]
NAPI_EXTERN napi_status
napi_unref_threadsafe_function(node_api_basic_env env, napi_threadsafe_function func);
```
- `[in] env`: API が呼び出される環境。
- `[in] func`: 参照解除するスレッドセーフ関数。

この API は、`func` が破棄される前にメインスレッドで実行されているイベントループが終了する可能性があることを示すために使用されます。[`uv_unref`](https://docs.libuv.org/en/v1.x/handle#c.uv_unref) と同様に、べき等でもあります。

この API は、メインスレッドからのみ呼び出すことができます。


## その他のユーティリティ {#miscellaneous-utilities}

### `node_api_get_module_file_name` {#node_api_get_module_file_name}

**追加: v15.9.0, v14.18.0, v12.22.0**

**N-API バージョン: 9**

```C [C]
NAPI_EXTERN napi_status
node_api_get_module_file_name(node_api_basic_env env, const char** result);

```
- `[in] env`: APIが呼び出される環境。
- `[out] result`: アドオンがロードされた場所の絶対パスを含むURL。ローカルファイルシステムのファイルの場合、`file://`で始まります。文字列はnullで終端され、`env`によって所有されるため、変更または解放してはなりません。

アドオンのロードプロセス中にアドオンのファイル名を確立できなかった場合、`result`は空の文字列になることがあります。

