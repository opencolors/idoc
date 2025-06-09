---
title: Node.js シングル実行可能アプリケーション
description: Node.jsでシングル実行可能アプリケーションを作成・管理する方法を学びます。アプリケーションのバンドル、依存関係の管理、セキュリティの考慮事項について説明します。
head:
  - - meta
    - name: og:title
      content: Node.js シングル実行可能アプリケーション | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsでシングル実行可能アプリケーションを作成・管理する方法を学びます。アプリケーションのバンドル、依存関係の管理、セキュリティの考慮事項について説明します。
  - - meta
    - name: twitter:title
      content: Node.js シングル実行可能アプリケーション | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsでシングル実行可能アプリケーションを作成・管理する方法を学びます。アプリケーションのバンドル、依存関係の管理、セキュリティの考慮事項について説明します。
---


# シングル実行可能アプリケーション {#single-executable-applications}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.6.0 | "useSnapshot" のサポートを追加しました。 |
| v20.6.0 | "useCodeCache" のサポートを追加しました。 |
| v19.7.0, v18.16.0 | v19.7.0, v18.16.0 で追加されました |
:::

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index)。1 - 積極的な開発
:::

**ソースコード:** [src/node_sea.cc](https://github.com/nodejs/node/blob/v23.5.0/src/node_sea.cc)

この機能により、Node.js がインストールされていないシステムへの Node.js アプリケーションの配布が容易になります。

Node.js は、バンドルされたスクリプトを含むことができる Node.js によって準備された BLOB を `node` バイナリに注入できるようにすることで、[シングル実行可能アプリケーション](https://github.com/nodejs/single-executable)の作成をサポートしています。起動時に、プログラムは何か注入されたものがあるかどうかを確認します。BLOB が見つかった場合、BLOB 内のスクリプトを実行します。それ以外の場合、Node.js は通常どおりに動作します。

シングル実行可能アプリケーション機能は、現在、[CommonJS](/ja/nodejs/api/modules#modules-commonjs-modules)モジュールシステムを使用した単一の埋め込みスクリプトの実行のみをサポートしています。

ユーザーは、`node` バイナリ自体、およびリソースをバイナリに注入できるツールを使用して、バンドルされたスクリプトからシングル実行可能アプリケーションを作成できます。

そのようなツールの 1 つである [postject](https://github.com/nodejs/postject) を使用してシングル実行可能アプリケーションを作成する手順を以下に示します。

## シングル実行可能準備 BLOB の生成 {#generating-single-executable-preparation-blobs}

アプリケーションに注入されるシングル実行可能準備 BLOB は、シングル実行可能ファイルのビルドに使用される Node.js バイナリの `--experimental-sea-config` フラグを使用して生成できます。これは、JSON 形式の設定ファイルへのパスを受け取ります。渡されたパスが絶対パスでない場合、Node.js は現在の作業ディレクトリからの相対パスを使用します。

設定は現在、次のトップレベルのフィールドを読み取ります。

```json [JSON]
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/blob.blob",
  "disableExperimentalSEAWarning": true, // デフォルト: false
  "useSnapshot": false,  // デフォルト: false
  "useCodeCache": true, // デフォルト: false
  "assets": {  // オプション
    "a.dat": "/path/to/a.dat",
    "b.txt": "/path/to/b.txt"
  }
}
```
パスが絶対パスでない場合、Node.js は現在の作業ディレクトリからの相対パスを使用します。BLOB の生成に使用される Node.js バイナリのバージョンは、BLOB が注入されるバイナリのバージョンと同じである必要があります。

注意: クロスプラットフォーム SEA を生成する場合 (例: `darwin-arm64` で `linux-x64` 用の SEA を生成する場合)、互換性のない実行ファイルの生成を避けるために、`useCodeCache` と `useSnapshot` を false に設定する必要があります。コードキャッシュとスナップショットは、コンパイルされたプラットフォームでのみロードできるため、異なるプラットフォームでビルドされたコードキャッシュまたはスナップショットをロードしようとすると、生成された実行ファイルが起動時にクラッシュする可能性があります。


### アセット {#assets}

ユーザーは、キーとパスの辞書を `assets` フィールドとして設定に追加することで、アセットを含めることができます。ビルド時に、Node.js は指定されたパスからアセットを読み取り、それらを準備 BLOB にバンドルします。生成された実行可能ファイルでは、ユーザーは [`sea.getAsset()`](/ja/nodejs/api/single-executable-applications#seagetassetkey-encoding) および [`sea.getAssetAsBlob()`](/ja/nodejs/api/single-executable-applications#seagetassetasblobkey-options) API を使用してアセットを取得できます。

```json [JSON]
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/blob.blob",
  "assets": {
    "a.jpg": "/path/to/a.jpg",
    "b.txt": "/path/to/b.txt"
  }
}
```
シングル実行可能アプリケーションは、次のようにアセットにアクセスできます。

```js [CJS]
const { getAsset, getAssetAsBlob, getRawAsset } = require('node:sea');
// ArrayBuffer のデータのコピーを返します。
const image = getAsset('a.jpg');
// アセットから UTF8 としてデコードされた文字列を返します。
const text = getAsset('b.txt', 'utf8');
// アセットを含む Blob を返します。
const blob = getAssetAsBlob('a.jpg');
// コピーせずに生の資産を含む ArrayBuffer を返します。
const raw = getRawAsset('a.jpg');
```
詳細については、[`sea.getAsset()`](/ja/nodejs/api/single-executable-applications#seagetassetkey-encoding)、[`sea.getAssetAsBlob()`](/ja/nodejs/api/single-executable-applications#seagetassetasblobkey-options) および [`sea.getRawAsset()`](/ja/nodejs/api/single-executable-applications#seagetrawassetkey) API のドキュメントを参照してください。

### スタートアップスナップショットのサポート {#startup-snapshot-support}

`useSnapshot` フィールドを使用して、スタートアップスナップショットのサポートを有効にできます。この場合、最終的な実行可能ファイルが起動されたときには、`main` スクリプトは実行されません。代わりに、シングル実行可能アプリケーションの準備 BLOB がビルドマシンで生成されるときに実行されます。生成された準備 BLOB には、`main` スクリプトによって初期化された状態をキャプチャするスナップショットが含まれます。準備 BLOB が挿入された最終的な実行可能ファイルは、実行時にスナップショットをデシリアライズします。

`useSnapshot` が true の場合、メインスクリプトは [`v8.startupSnapshot.setDeserializeMainFunction()`](/ja/nodejs/api/v8#v8startupsnapshotsetdeserializemainfunctioncallback-data) API を呼び出して、ユーザーによって最終的な実行可能ファイルが起動されたときに実行する必要のあるコードを設定する必要があります。

シングル実行可能アプリケーションでスナップショットを使用するアプリケーションの典型的なパターンは次のとおりです。

スタートアップスナップショットスクリプトの一般的な制約は、シングル実行可能アプリケーションのスナップショットを構築するために使用されるメインスクリプトにも適用され、メインスクリプトは [`v8.startupSnapshot` API](/ja/nodejs/api/v8#startup-snapshot-api) を使用してこれらの制約に適応できます。Node.js での[スタートアップスナップショットサポートに関するドキュメント](/ja/nodejs/api/cli#--build-snapshot)を参照してください。


### V8 コードキャッシュのサポート {#v8-code-cache-support}

構成で `useCodeCache` が `true` に設定されている場合、シングル実行可能ファイル準備 blob の生成中に、Node.js は `main` スクリプトをコンパイルして V8 コードキャッシュを生成します。生成されたコードキャッシュは準備 blob の一部となり、最終的な実行可能ファイルに注入されます。シングル実行可能アプリケーションが起動されると、Node.js は `main` スクリプトを最初からコンパイルする代わりに、コードキャッシュを使用してコンパイルを高速化し、スクリプトを実行します。これにより、起動パフォーマンスが向上します。

**注記:** `useCodeCache` が `true` の場合、`import()` は動作しません。

## 注入された main スクリプト内 {#in-the-injected-main-script}

### シングル実行可能アプリケーション API {#single-executable-application-api}

`node:sea` ビルトインを使用すると、実行可能ファイルに埋め込まれた JavaScript メインスクリプトからシングル実行可能アプリケーションとやり取りできます。

#### `sea.isSea()` {#seaissea}

**追加: v21.7.0, v20.12.0**

- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) このスクリプトがシングル実行可能アプリケーション内で実行されているかどうか。

### `sea.getAsset(key[, encoding])` {#seagetassetkey-encoding}

**追加: v21.7.0, v20.12.0**

このメソッドを使用すると、ビルド時にシングル実行可能ファイルにバンドルされるように構成されたアセットを取得できます。一致するアセットが見つからない場合、エラーがスローされます。

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) シングル実行可能アプリケーション構成の `assets` フィールドで指定された辞書内のアセットのキー。
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 指定された場合、アセットは文字列としてデコードされます。`TextDecoder` でサポートされているエンコーディングはすべて受け入れられます。指定されていない場合、アセットのコピーを含む `ArrayBuffer` が代わりに返されます。
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)


### `sea.getAssetAsBlob(key[, options])` {#seagetassetasblobkey-options}

**Added in: v21.7.0, v20.12.0**

[`sea.getAsset()`](/ja/nodejs/api/single-executable-applications#seagetassetkey-encoding) と同様ですが、結果を [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) で返します。一致するアセットが見つからない場合はエラーがスローされます。

- `key`  [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) シングル実行可能アプリケーション構成の `assets` フィールドで指定されたディクショナリ内のアセットのキー。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Blob のオプションの mime タイプ。
  
 
- 戻り値: [\<Blob\>](/ja/nodejs/api/buffer#class-blob)

### `sea.getRawAsset(key)` {#seagetrawassetkey}

**Added in: v21.7.0, v20.12.0**

このメソッドは、ビルド時にシングル実行可能アプリケーションにバンドルされるように構成されたアセットを取得するために使用できます。一致するアセットが見つからない場合はエラーがスローされます。

`sea.getAsset()` または `sea.getAssetAsBlob()` とは異なり、このメソッドはコピーを返しません。代わりに、実行可能ファイル内にバンドルされた生の資産を返します。

今のところ、ユーザーは返された配列バッファへの書き込みを避ける必要があります。注入されたセクションが書き込み可能としてマークされていない場合、または適切にアラインされていない場合、返された配列バッファへの書き込みはクラッシュにつながる可能性があります。

- `key`  [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) シングル実行可能アプリケーション構成の `assets` フィールドで指定されたディクショナリ内のアセットのキー。
- 戻り値: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

### 注入されたメインスクリプト内の `require(id)` はファイルベースではありません {#requireid-in-the-injected-main-script-is-not-file-based}

注入されたメインスクリプト内の `require()` は、注入されていないモジュールで使用できる [`require()`](/ja/nodejs/api/modules#requireid) と同じではありません。また、注入されていない [`require()`](/ja/nodejs/api/modules#requireid) が持つプロパティ ([`require.main`](/ja/nodejs/api/modules#accessing-the-main-module) を除く) もありません。組み込みモジュールをロードするためにのみ使用できます。ファイルシステムにのみ存在するモジュールをロードしようとすると、エラーがスローされます。

ファイルベースの `require()` に依存する代わりに、ユーザーはアプリケーションをスタンドアロンの JavaScript ファイルにバンドルして、実行可能ファイルに注入できます。これにより、より決定論的な依存関係グラフも保証されます。

ただし、ファイルベースの `require()` が依然として必要な場合は、次の方法でも実現できます。

```js [ESM]
const { createRequire } = require('node:module');
require = createRequire(__filename);
```

### インジェクトされたメインスクリプトにおける `__filename` と `module.filename` {#__filename-and-modulefilename-in-the-injected-main-script}

インジェクトされたメインスクリプトにおける `__filename` と `module.filename` の値は、[`process.execPath`](/ja/nodejs/api/process#processexecpath) と等しくなります。

### インジェクトされたメインスクリプトにおける `__dirname` {#__dirname-in-the-injected-main-script}

インジェクトされたメインスクリプトにおける `__dirname` の値は、[`process.execPath`](/ja/nodejs/api/process#processexecpath) のディレクトリ名と等しくなります。

## 注記 {#notes}

### シングル実行可能アプリケーションの作成プロセス {#single-executable-application-creation-process}

シングル実行可能な Node.js アプリケーションを作成することを目的とするツールは、`--experimental-sea-config"` で準備された blob の内容を次のようにインジェクトする必要があります。

- `node` バイナリが [PE](https://en.wikipedia.org/wiki/Portable_Executable) ファイルである場合、`NODE_SEA_BLOB` という名前のリソース
- `node` バイナリが [Mach-O](https://en.wikipedia.org/wiki/Mach-O) ファイルである場合、`NODE_SEA` セグメント内の `NODE_SEA_BLOB` という名前のセクション
- `node` バイナリが [ELF](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format) ファイルである場合、`NODE_SEA_BLOB` という名前のノート

バイナリ内で `NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2:0` [fuse](https://www.electronjs.org/docs/latest/tutorial/fuses) 文字列を検索し、最後の文字を `1` に反転させて、リソースがインジェクトされたことを示します。

### プラットフォームサポート {#platform-support}

シングル実行可能ファイルのサポートは、次のプラットフォームでのみ CI で定期的にテストされています。

- Windows
- macOS
- Linux (Alpine を除く [Node.js でサポートされているすべてのディストリビューション](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list) と、s390x を除く [Node.js でサポートされているすべてのアーキテクチャ](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list))

これは、他のプラットフォームでこの機能をテストするために使用できるシングル実行可能ファイルを生成するためのより良いツールがないためです。

他のリソースインジェクションツール/ワークフローに関する提案を歓迎します。 それらを文書化するために、[https://github.com/nodejs/single-executable/discussions](https://github.com/nodejs/single-executable/discussions) で議論を開始してください。

