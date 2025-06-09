---
title: Node.js CLI オプション
description: このページでは、Node.jsで利用可能なコマンドラインオプションについての包括的なガイドを提供し、実行環境の設定、デバッグの管理、実行動作の制御に使用するさまざまなフラグや引数の使い方を詳述しています。
head:
  - - meta
    - name: og:title
      content: Node.js CLI オプション | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: このページでは、Node.jsで利用可能なコマンドラインオプションについての包括的なガイドを提供し、実行環境の設定、デバッグの管理、実行動作の制御に使用するさまざまなフラグや引数の使い方を詳述しています。
  - - meta
    - name: twitter:title
      content: Node.js CLI オプション | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: このページでは、Node.jsで利用可能なコマンドラインオプションについての包括的なガイドを提供し、実行環境の設定、デバッグの管理、実行動作の制御に使用するさまざまなフラグや引数の使い方を詳述しています。
---


# コマンドライン API {#command-line-api}

Node.js には様々な CLI オプションが付属しています。これらのオプションは、組み込みのデバッグ機能、スクリプトを実行する複数の方法、およびその他の役立つランタイムオプションを公開します。

このドキュメントをターミナルでマニュアルページとして表示するには、`man node` を実行してください。

## 概要 {#synopsis}

`node [options] [V8 options] [\<program-entry-point\> | -e "script" | -] [--] [arguments]`

`node inspect [\<program-entry-point\> | -e "script" | \<host\>:\<port\>] …`

`node --v8-options`

引数なしで実行すると、[REPL](/ja/nodejs/api/repl) が起動します。

`node inspect` の詳細については、[デバッガ](/ja/nodejs/api/debugger) のドキュメントを参照してください。

## プログラムエントリポイント {#program-entry-point}

プログラムエントリポイントは、仕様のような文字列です。文字列が絶対パスでない場合、現在の作業ディレクトリからの相対パスとして解決されます。そのパスは、[CommonJS](/ja/nodejs/api/modules) モジュールローダーによって解決されます。対応するファイルが見つからない場合、エラーがスローされます。

ファイルが見つかった場合、そのパスは、次のいずれかの条件の下で、[ES モジュールローダー](/ja/nodejs/api/packages#modules-loaders)に渡されます。

- プログラムが、`--import` などの ECMAScript モジュールローダーでエントリポイントを強制的にロードするコマンドラインフラグで開始された。
- ファイルに `.mjs` 拡張子が付いている。
- ファイルに `.cjs` 拡張子が付いておらず、最も近い親の `package.json` ファイルに、値が `"module"` のトップレベルの [`"type"`](/ja/nodejs/api/packages#type) フィールドが含まれている。

それ以外の場合、ファイルは CommonJS モジュールローダーを使用してロードされます。詳細については、[モジュールローダー](/ja/nodejs/api/packages#modules-loaders)を参照してください。

### ECMAScript モジュールローダーのエントリポイントの注意点 {#ecmascript-modules-loader-entry-point-caveat}

ロード時、[ES モジュールローダー](/ja/nodejs/api/packages#modules-loaders)はプログラムエントリポイントをロードしますが、`node` コマンドは、`.js`、`.mjs`、または `.cjs` 拡張子を持つファイル、および [`--experimental-wasm-modules`](/ja/nodejs/api/cli#--experimental-wasm-modules) が有効になっている場合は `.wasm` 拡張子を持つファイルのみを入力として受け入れます。

## オプション {#options}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.12.0 | Node.js オプションでも、V8 オプションに加えて、ダッシュの代わりにアンダースコアを使用できるようになりました。 |
:::

V8 オプションを含むすべてのオプションで、単語はダッシュ (`-`) とアンダースコア (`_`) の両方で区切ることができます。たとえば、`--pending-deprecation` は `--pending_deprecation` と同等です。

`--max-http-header-size` などの単一の値を取るオプションが複数回渡された場合、最後に渡された値が使用されます。コマンドラインからのオプションは、[`NODE_OPTIONS`](/ja/nodejs/api/cli#node_optionsoptions) 環境変数を介して渡されたオプションよりも優先されます。


### `-` {#-}

**追加:** v8.0.0

stdin のエイリアス。 他のコマンドラインユーティリティでの `-` の使用と同様に、スクリプトが stdin から読み込まれ、残りのオプションがそのスクリプトに渡されることを意味します。

### `--` {#--}

**追加:** v6.11.0

Node.js オプションの終わりを示します。 残りの引数をスクリプトに渡します。 これより前にスクリプトファイル名または eval/print スクリプトが指定されていない場合、次の引数がスクリプトファイル名として使用されます。

### `--abort-on-uncaught-exception` {#--abort-on-uncaught-exception}

**追加:** v0.10.8

終了する代わりにアボートすると、デバッガ（`lldb`、`gdb`、`mdb`など）を使用した事後分析のためにコアファイルが生成されます。

このフラグが渡された場合でも、[`process.setUncaughtExceptionCaptureCallback()`](/ja/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn)（およびそれを使用する `node:domain` モジュールの使用を通じて）を通じて、アボートしないように動作を設定できます。

### `--allow-addons` {#--allow-addons}

**追加:** v21.6.0, v20.12.0

::: warning [安定版: 1 - 実験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定版: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

[Permission Model](/ja/nodejs/api/permissions#permission-model)を使用する場合、プロセスはデフォルトでネイティブアドオンを使用できません。 これを試みると、Node.js の起動時にユーザーが明示的に `--allow-addons` フラグを渡さない限り、`ERR_DLOPEN_DISABLED` がスローされます。

例:

```js [CJS]
// ネイティブアドオンを require しようとします
require('nodejs-addon-example');
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js
node:internal/modules/cjs/loader:1319
  return process.dlopen(module, path.toNamespacedPath(filename));
                 ^

Error: Cannot load native addon because loading addons is disabled.
    at Module._extensions..node (node:internal/modules/cjs/loader:1319:18)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12)
    at Module.require (node:internal/modules/cjs/loader:1115:19)
    at require (node:internal/modules/helpers:130:18)
    at Object.<anonymous> (/home/index.js:1:15)
    at Module._compile (node:internal/modules/cjs/loader:1233:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1287:10)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12) {
  code: 'ERR_DLOPEN_DISABLED'
}
```

### `--allow-child-process` {#--allow-child-process}

**Added in: v20.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

[Permission Model](/ja/nodejs/api/permissions#permission-model)を使用する場合、プロセスはデフォルトでは子プロセスを生成できません。Node.jsの起動時にユーザーが明示的に`--allow-child-process`フラグを渡さない限り、子プロセスを生成しようとすると`ERR_ACCESS_DENIED`がスローされます。

例：

```js [ESM]
const childProcess = require('node:child_process');
// パーミッションを回避しようとします
childProcess.spawn('node', ['-e', 'require("fs").writeFileSync("/new-file", "example")']);
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js
node:internal/child_process:388
  const err = this._handle.spawn(options);
                           ^
Error: Access to this API has been restricted
    at ChildProcess.spawn (node:internal/child_process:388:28)
    at Object.spawn (node:child_process:723:9)
    at Object.<anonymous> (/home/index.js:3:14)
    at Module._compile (node:internal/modules/cjs/loader:1120:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1174:10)
    at Module.load (node:internal/modules/cjs/loader:998:32)
    at Module._load (node:internal/modules/cjs/loader:839:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'ChildProcess'
}
```
### `--allow-fs-read` {#--allow-fs-read}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.5.0 | Permission Modelと--allow-fsフラグが安定版になりました。 |
| v20.7.0 | カンマ（`,`）で区切られたパスは許可されなくなりました。 |
| v20.0.0 | Added in: v20.0.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [Stability: 2](/ja/nodejs/api/documentation#stability-index) - 安定版。
:::

このフラグは、[Permission Model](/ja/nodejs/api/permissions#permission-model)を使用して、ファイルシステムの読み取りパーミッションを設定します。

`--allow-fs-read`フラグの有効な引数は次のとおりです。

- `*` - すべての`FileSystemRead`操作を許可します。
- 複数の`--allow-fs-read`フラグを使用すると、複数のパスを許可できます。例：`--allow-fs-read=/folder1/ --allow-fs-read=/folder1/`

例は、[File System Permissions](/ja/nodejs/api/permissions#file-system-permissions)ドキュメントにあります。

イニシャライザモジュールも許可する必要があります。次の例を考えてみてください。

```bash [BASH]
$ node --permission index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:23:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FileSystemRead',
  resource: '/Users/rafaelgss/repos/os/node/index.js'
}
```
プロセスは`index.js`モジュールにアクセスする必要があります。

```bash [BASH]
node --permission --allow-fs-read=/path/to/index.js index.js
```

### `--allow-fs-write` {#--allow-fs-write}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.5.0 | パーミッションモデルと --allow-fs フラグが安定版になりました。 |
| v20.7.0 | カンマ (`,`) で区切られたパスは許可されなくなりました。 |
| v20.0.0 | v20.0.0 で追加されました |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定。
:::

このフラグは、[パーミッションモデル](/ja/nodejs/api/permissions#permission-model)を使用してファイルシステムの書き込みパーミッションを構成します。

`--allow-fs-write` フラグの有効な引数は次のとおりです。

- `*` - すべての `FileSystemWrite` 操作を許可します。
- 複数の `--allow-fs-write` フラグを使用すると、複数のパスを許可できます。 例：`--allow-fs-write=/folder1/ --allow-fs-write=/folder1/`

カンマ (`,`) で区切られたパスは許可されなくなりました。 カンマ付きの単一のフラグを渡すと、警告が表示されます。

例は、[ファイルシステムパーミッション](/ja/nodejs/api/permissions#file-system-permissions)のドキュメントにあります。

### `--allow-wasi` {#--allow-wasi}

**追加: v22.3.0, v20.16.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

[パーミッションモデル](/ja/nodejs/api/permissions#permission-model)を使用する場合、プロセスはデフォルトで WASI インスタンスを作成できません。 セキュリティ上の理由から、ユーザーがメインの Node.js プロセスで明示的にフラグ `--allow-wasi` を渡さない限り、呼び出しは `ERR_ACCESS_DENIED` をスローします。

例：

```js [ESM]
const { WASI } = require('node:wasi');
// パーミッションをバイパスしようとする
new WASI({
  version: 'preview1',
  // ファイルシステム全体をマウントしようとする
  preopens: {
    '/': '/',
  },
});
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:30:49 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WASI',
}
```
### `--allow-worker` {#--allow-worker}

**追加: v20.0.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

[パーミッションモデル](/ja/nodejs/api/permissions#permission-model)を使用する場合、プロセスはデフォルトで worker スレッドを作成できません。 セキュリティ上の理由から、ユーザーがメインの Node.js プロセスで明示的にフラグ `--allow-worker` を渡さない限り、呼び出しは `ERR_ACCESS_DENIED` をスローします。

例：

```js [ESM]
const { Worker } = require('node:worker_threads');
// パーミッションをバイパスしようとする
new Worker(__filename);
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WorkerThreads'
}
```

### `--build-snapshot` {#--build-snapshot}

**追加:** v18.8.0

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

プロセスが終了するときにスナップショット blob を生成してディスクに書き込みます。これは後で `--snapshot-blob` でロードできます。

スナップショットを構築するときに、`--snapshot-blob` が指定されていない場合、生成された blob はデフォルトで現在の作業ディレクトリの `snapshot.blob` に書き込まれます。それ以外の場合は、`--snapshot-blob` で指定されたパスに書き込まれます。

```bash [BASH]
$ echo "globalThis.foo = 'I am from the snapshot'" > snapshot.js

# アプリケーションを初期化し、その状態を snapshot.blob にスナップショットするために snapshot.js を実行します。 {#run-snapshotjs-to-initialize-the-application-and-snapshot-the}
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js

$ echo "console.log(globalThis.foo)" > index.js

# 生成されたスナップショットをロードし、index.js からアプリケーションを起動します。 {#state-of-it-into-snapshotblob}
$ node --snapshot-blob snapshot.blob index.js
I am from the snapshot
```
[`v8.startupSnapshot` API](/ja/nodejs/api/v8#startup-snapshot-api) を使用して、スナップショットの構築時にエントリポイントを指定できます。これにより、デシリアライズ時に追加のエントリスクリプトは不要になります。

```bash [BASH]
$ echo "require('v8').startupSnapshot.setDeserializeMainFunction(() => console.log('I am from the snapshot'))" > snapshot.js
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js
$ node --snapshot-blob snapshot.blob
I am from the snapshot
```
詳細については、[`v8.startupSnapshot` API](/ja/nodejs/api/v8#startup-snapshot-api) のドキュメントを確認してください。

現在、実行時スナップショットのサポートは試験的です。

### `--build-snapshot-config` {#load-the-generated-snapshot-and-start-the-application-from-indexjs}

**追加:** v21.6.0, v20.12.0

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

スナップショットの作成動作を構成する JSON 構成ファイルへのパスを指定します。

現在、次のオプションがサポートされています。

- `builder` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 必須。[`--build-snapshot`](/ja/nodejs/api/cli#--build-snapshot) がメインスクリプト名として `builder` で渡された場合と同様に、スナップショットを構築する前に実行されるスクリプトの名前を提供します。
- `withoutCodeCache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) オプション。コードキャッシュを含めると、スナップショットに含まれる関数のコンパイルに費やす時間を短縮できますが、スナップショットのサイズが大きくなり、スナップショットの移植性が損なわれる可能性があります。

このフラグを使用する場合、コマンドラインで提供される追加のスクリプトファイルは実行されず、代わりに通常のコマンドライン引数として解釈されます。


### `-c`, `--check` {#--build-snapshot-config}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | `--require`オプションがファイルのチェック時にサポートされるようになりました。 |
| v5.0.0, v4.2.0 | Added in: v5.0.0, v4.2.0 |
:::

実行せずにスクリプトの構文をチェックします。

### `--completion-bash` {#-c---check}

**Added in: v10.12.0**

Node.js のソース可能な bash 補完スクリプトを出力します。

```bash [BASH]
node --completion-bash > node_bash_completion
source node_bash_completion
```
### `-C condition`, `--conditions=condition` {#--completion-bash}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.9.0, v20.18.0 | このフラグは実験的ではなくなりました。 |
| v14.9.0, v12.19.0 | Added in: v14.9.0, v12.19.0 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

カスタムの[条件付きエクスポート](/ja/nodejs/api/packages#conditional-exports)解決条件を提供します。

任意の数のカスタム文字列条件名を許可します。

`"node"`、`"default"`、`"import"`、`"require"`のデフォルトの Node.js 条件は、常に定義どおりに適用されます。

たとえば、「development」解決でモジュールを実行するには:

```bash [BASH]
node -C development app.js
```
### `--cpu-prof` {#-c-condition---conditions=condition}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.4.0, v20.16.0 | `--cpu-prof`フラグが安定版になりました。 |
| v12.0.0 | Added in: v12.0.0 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

起動時に V8 CPU プロファイラを開始し、終了前に CPU プロファイルをディスクに書き込みます。

`--cpu-prof-dir`が指定されていない場合、生成されたプロファイルは現在の作業ディレクトリに配置されます。

`--cpu-prof-name`が指定されていない場合、生成されたプロファイルの名前は `CPU.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.cpuprofile` になります。

```bash [BASH]
$ node --cpu-prof index.js
$ ls *.cpuprofile
CPU.20190409.202950.15293.0.0.cpuprofile
```
### `--cpu-prof-dir` {#--cpu-prof}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.4.0, v20.16.0 | `--cpu-prof`フラグが安定版になりました。 |
| v12.0.0 | Added in: v12.0.0 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

`--cpu-prof`によって生成された CPU プロファイルを配置するディレクトリを指定します。

デフォルト値は、[`--diagnostic-dir`](/ja/nodejs/api/cli#--diagnostic-dirdirectory) コマンドラインオプションによって制御されます。


### `--cpu-prof-interval` {#--cpu-prof-dir}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.4.0, v20.16.0 | `--cpu-prof` フラグが安定版になりました。 |
| v12.2.0 | 追加: v12.2.0 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定版: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

`--cpu-prof` で生成される CPU プロファイルのサンプリング間隔をマイクロ秒単位で指定します。 デフォルトは 1000 マイクロ秒です。

### `--cpu-prof-name` {#--cpu-prof-interval}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.4.0, v20.16.0 | `--cpu-prof` フラグが安定版になりました。 |
| v12.0.0 | 追加: v12.0.0 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定版: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

`--cpu-prof` で生成される CPU プロファイルの名前を指定します。

### `--diagnostic-dir=directory` {#--cpu-prof-name}

すべての診断出力ファイルを書き込むディレクトリを設定します。 デフォルトは現在の作業ディレクトリです。

次のデフォルトの出力ディレクトリに影響します。

- [`--cpu-prof-dir`](/ja/nodejs/api/cli#--cpu-prof-dir)
- [`--heap-prof-dir`](/ja/nodejs/api/cli#--heap-prof-dir)
- [`--redirect-warnings`](/ja/nodejs/api/cli#--redirect-warningsfile)

### `--disable-proto=mode` {#--diagnostic-dir=directory}

**追加: v13.12.0, v12.17.0**

`Object.prototype.__proto__` プロパティを無効にします。 `mode` が `delete` の場合、プロパティは完全に削除されます。 `mode` が `throw` の場合、プロパティへのアクセスはコード `ERR_PROTO_ACCESS` で例外をスローします。

### `--disable-warning=code-or-type` {#--disable-proto=mode}

::: warning [安定版: 1 - 実験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定版: 1](/ja/nodejs/api/documentation#stability-index) - 活発な開発
:::

**追加: v21.3.0, v20.11.0**

`code` または `type` で特定のプロセスの警告を無効にします。

[`process.emitWarning()`](/ja/nodejs/api/process#processemitwarningwarning-options) から出力される警告には、`code` および `type` が含まれている場合があります。 このオプションは、一致する `code` または `type` を持つ警告を出力しません。

[非推奨の警告](/ja/nodejs/api/deprecations#list-of-deprecated-apis)のリスト。

Node.js コアの警告の種類は、`DeprecationWarning` および `ExperimentalWarning` です。

たとえば、次のスクリプトは、`node --disable-warning=DEP0025` で実行すると、[DEP0025 `require('node:sys')`](/ja/nodejs/api/deprecations#dep0025-requirenodesys) を出力しません。

::: code-group
```js [ESM]
import sys from 'node:sys';
```

```js [CJS]
const sys = require('node:sys');
```
:::

たとえば、次のスクリプトは、[DEP0025 `require('node:sys')`](/ja/nodejs/api/deprecations#dep0025-requirenodesys) を出力しますが、`node --disable-warning=ExperimentalWarning` で実行すると、(\<=v21 の [ExperimentalWarning: `vm.measureMemory` は実験的な機能です](/ja/nodejs/api/vm#vmmeasurememoryoptions) など) 実験的な警告は出力しません。

::: code-group
```js [ESM]
import sys from 'node:sys';
import vm from 'node:vm';

vm.measureMemory();
```

```js [CJS]
const sys = require('node:sys');
const vm = require('node:vm');

vm.measureMemory();
```
:::


### `--disable-wasm-trap-handler` {#--disable-warning=code-or-type}

**追加: v22.2.0, v20.15.0**

デフォルトでは、Node.js はトラップハンドラーベースの WebAssembly バウンドチェックを有効にします。その結果、V8 は WebAssembly からコンパイルされたコードにインラインバウンドチェックを挿入する必要がなくなり、WebAssembly の実行が大幅に高速化される可能性があります。ただし、この最適化には大きな仮想メモリケージ（現在は 10GB）の割り当てが必要です。システム構成またはハードウェアの制限により、Node.js プロセスが十分に大きな仮想メモリアドレス空間にアクセスできない場合、ユーザーはこの仮想メモリケージで割り当てを伴う WebAssembly を実行できなくなり、メモリ不足エラーが発生します。

```bash [BASH]
$ ulimit -v 5000000
$ node -p "new WebAssembly.Memory({ initial: 10, maximum: 100 });"
[eval]:1
new WebAssembly.Memory({ initial: 10, maximum: 100 });
^

RangeError: WebAssembly.Memory(): could not allocate memory
    at [eval]:1:1
    at runScriptInThisContext (node:internal/vm:209:10)
    at node:internal/process/execution:118:14
    at [eval]-wrapper:6:24
    at runScript (node:internal/process/execution:101:62)
    at evalScript (node:internal/process/execution:136:3)
    at node:internal/main/eval_string:49:3

```
`--disable-wasm-trap-handler` はこの最適化を無効にするため、Node.js プロセスで利用可能な仮想メモリアドレス空間が V8 WebAssembly メモリケージに必要なものよりも小さい場合でも、ユーザーは少なくとも（最適ではないパフォーマンスで）WebAssembly を実行できます。

### `--disallow-code-generation-from-strings` {#--disable-wasm-trap-handler}

**追加: v9.8.0**

文字列からコードを生成する `eval` や `new Function` のような組み込み言語機能を例外をスローするようにします。これは Node.js `node:vm` モジュールには影響しません。

### `--dns-result-order=order` {#--disallow-code-generation-from-strings}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v22.1.0, v20.13.0 | `ipv6first` がサポートされるようになりました。 |
| v17.0.0 | デフォルト値を `verbatim` に変更しました。 |
| v16.4.0, v14.18.0 | 追加: v16.4.0, v14.18.0 |
:::

[`dns.lookup()`](/ja/nodejs/api/dns#dnslookuphostname-options-callback) と [`dnsPromises.lookup()`](/ja/nodejs/api/dns#dnspromiseslookuphostname-options) で `order` のデフォルト値を設定します。値は次のいずれかになります。

- `ipv4first`: デフォルトの `order` を `ipv4first` に設定します。
- `ipv6first`: デフォルトの `order` を `ipv6first` に設定します。
- `verbatim`: デフォルトの `order` を `verbatim` に設定します。

デフォルトは `verbatim` であり、[`dns.setDefaultResultOrder()`](/ja/nodejs/api/dns#dnssetdefaultresultorderorder) は `--dns-result-order` よりも優先度が高くなります。


### `--enable-fips` {#--dns-result-order=order}

**Added in: v6.0.0**

起動時に FIPS 準拠の暗号化を有効にします。（Node.js が FIPS 互換の OpenSSL に対してビルドされている必要があります。）

### `--enable-network-family-autoselection` {#--enable-fips}

**Added in: v18.18.0**

接続オプションで明示的に無効にしない限り、family 自動選択アルゴリズムを有効にします。

### `--enable-source-maps` {#--enable-network-family-autoselection}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v15.11.0, v14.18.0 | この API は実験的ではなくなりました。 |
| v12.12.0 | Added in: v12.12.0 |
:::

スタックトレースの [Source Map v3](https://sourcemaps.info/spec) サポートを有効にします。

TypeScript などのトランスパイラを使用する場合、アプリケーションによってスローされるスタックトレースは、元のソース位置ではなく、トランスパイルされたコードを参照します。`--enable-source-maps` は、ソースマップのキャッシュを有効にし、元のソースファイルに対するスタックトレースを報告するように最善を尽くします。

`Error.prepareStackTrace` をオーバーライドすると、`--enable-source-maps` がスタックトレースを変更できなくなる場合があります。ソースマップでスタックトレースを変更するには、オーバーライド関数で元の `Error.prepareStackTrace` の結果を呼び出して返します。

```js [ESM]
const originalPrepareStackTrace = Error.prepareStackTrace;
Error.prepareStackTrace = (error, trace) => {
  // エラーとトレースを変更し、元の Error.prepareStackTrace でスタックトレースをフォーマットします。
  return originalPrepareStackTrace(error, trace);
};
```

注: ソースマップを有効にすると、`Error.stack` にアクセスするときにアプリケーションにレイテンシが発生する可能性があります。アプリケーションで `Error.stack` に頻繁にアクセスする場合は、`--enable-source-maps` のパフォーマンスへの影響を考慮してください。

### `--entry-url` {#--enable-source-maps}

**Added in: v23.0.0**

::: warning [安定版: 1 - 実験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定版: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

存在する場合、Node.js はエントリポイントをパスではなく URL として解釈します。

[ECMAScript モジュール](/ja/nodejs/api/esm#modules-ecmascript-modules) の解決規則に従います。

URL 内のクエリパラメータまたはハッシュは、[`import.meta.url`](/ja/nodejs/api/esm#importmetaurl) を介してアクセスできます。

```bash [BASH]
node --entry-url 'file:///path/to/file.js?queryparams=work#and-hashes-too'
node --entry-url --experimental-strip-types 'file.ts?query#hash'
node --entry-url 'data:text/javascript,console.log("Hello")'
```

### `--env-file-if-exists=config` {#--entry-url}

**Added in: v22.9.0**

挙動は[`--env-file`](/ja/nodejs/api/cli#--env-fileconfig)と同じですが、ファイルが存在しない場合にエラーはスローされません。

### `--env-file=config` {#--env-file-if-exists=config}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::


::: info [沿革]
| バージョン | 変更点 |
| --- | --- |
| v21.7.0, v20.12.0 | 複数行の値のサポートを追加。 |
| v20.6.0 | Added in: v20.6.0 |
:::

現在のディレクトリを基準としたファイルから環境変数をロードし、`process.env`上のアプリケーションで利用できるようにします。[Node.jsを構成する環境変数](/ja/nodejs/api/cli#environment-variables)（`NODE_OPTIONS`など）は、パースされ適用されます。同じ変数が環境とファイルの両方で定義されている場合、環境の値が優先されます。

複数の`--env-file`引数を渡すことができます。後続のファイルは、以前のファイルで定義された既存の変数を上書きします。

ファイルが存在しない場合、エラーがスローされます。

```bash [BASH]
node --env-file=.env --env-file=.development.env index.js
```
ファイルの形式は、環境変数名と値を `=` で区切ったキーと値のペアを1行に1つ記述する必要があります。

```text [TEXT]
PORT=3000
```
`#` の後のテキストはコメントとして扱われます。

```text [TEXT]
# これはコメントです {#--env-file=config}
PORT=3000 # これもコメントです
```
値は、```, `"` または `'` の引用符で始まり、終わることができます。それらは値から省略されます。

```text [TEXT]
USERNAME="nodejs" # `nodejs` が値になります。
```
複数行の値がサポートされています。

```text [TEXT]
MULTI_LINE="THIS IS
A MULTILINE"
# `THIS IS\nA MULTILINE` が値になります。 {#this-is-a-comment}
```
キーの前の Export キーワードは無視されます。

```text [TEXT]
export USERNAME="nodejs" # `nodejs` が値になります。
```
存在しない可能性のあるファイルから環境変数をロードする場合は、代わりに[`--env-file-if-exists`](/ja/nodejs/api/cli#--env-file-if-existsconfig)フラグを使用できます。


### `-e`, `--eval "script"` {#will-result-in-this-is\na-multiline-as-the-value}

::: info [履歴]
| バージョン | 変更点 |
|---|---|
| v22.6.0 | Eval は実験的な型削除をサポートするようになりました。 |
| v5.11.0 | 組み込みライブラリが事前定義された変数として利用可能になりました。 |
| v0.5.2 | 追加: v0.5.2 |
:::

以下の引数を JavaScript として評価します。REPL で事前定義されているモジュールも `script` で使用できます。

Windows では、`cmd.exe` を使用している場合、引用符としてダブルクォート `"` のみ認識するため、シングルクォートは正しく機能しません。Powershell または Git bash では、`'` と `"` の両方が使用可能です。

[`--experimental-strip-types`](/ja/nodejs/api/cli#--experimental-strip-types) を渡すことで、インライン型を含むコードを実行できます。

### `--experimental-async-context-frame` {#-e---eval-"script"}

**追加: v22.7.0**

::: warning [Stable: 1 - 実験的]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

async_hooks に依存するデフォルトの実装ではなく、`AsyncContextFrame` によって裏打ちされた [`AsyncLocalStorage`](/ja/nodejs/api/async_context#class-asynclocalstorage) の使用を有効にします。この新しいモデルは非常に異なる方法で実装されているため、アプリケーション内でのコンテキストデータの流れに違いがある可能性があります。そのため、本番環境で使用する前に、この変更によってアプリケーションの動作に影響がないことを確認することをお勧めします。

### `--experimental-eventsource` {#--experimental-async-context-frame}

**追加: v22.3.0, v20.18.0**

グローバルスコープでの [EventSource Web API](https://html.spec.whatwg.org/multipage/server-sent-events#server-sent-events) の公開を有効にします。

### `--experimental-import-meta-resolve` {#--experimental-eventsource}

::: info [履歴]
| バージョン | 変更点 |
|---|---|
| v20.6.0, v18.19.0 | 同期的な import.meta.resolve がデフォルトで利用可能になり、以前サポートされていた実験的な第2引数を有効にするためのフラグが保持されました。 |
| v13.9.0, v12.16.2 | 追加: v13.9.0, v12.16.2 |
:::

実験的な `import.meta.resolve()` の親 URL サポートを有効にします。これにより、コンテキストに応じた解決のために2番目の `parentURL` 引数を渡すことができます。

以前は、`import.meta.resolve` 機能全体を制御していました。


### `--experimental-loader=module` {#--experimental-import-meta-resolve}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.11.1 | このフラグの名前が `--loader` から `--experimental-loader` に変更されました。 |
| v8.8.0 | 追加: v8.8.0 |
:::

エクスポートされた[モジュールカスタマイズフック](/ja/nodejs/api/module#customization-hooks)を含む `module` を指定します。`module` は、[`import` 指定子](/ja/nodejs/api/esm#import-specifiers)として受け入れられる任意の文字列で構いません。

### `--experimental-network-inspection` {#--experimental-loader=module}

**追加: v22.6.0, v20.18.0**

::: warning [安定度: 1 - 試験的]
[安定度: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

Chrome DevToolsを使用したネットワークインスペクションの実験的サポートを有効にします。

### `--experimental-print-required-tla` {#--experimental-network-inspection}

**追加: v22.0.0, v20.17.0**

`require()` されているESモジュールにトップレベルの`await`が含まれている場合、このフラグを使用すると、Node.jsがモジュールを評価し、トップレベルのawaitを見つけようとし、それらの場所を出力して、ユーザーがそれらを見つけやすくすることができます。

### `--experimental-require-module` {#--experimental-print-required-tla}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v23.0.0 | これはデフォルトで true になりました。 |
| v22.0.0, v20.17.0 | 追加: v22.0.0, v20.17.0 |
:::

::: warning [安定度: 1 - 試験的]
[安定度: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 活発な開発
:::

`require()` で同期的なESモジュールグラフのロードをサポートします。

[`require()` を使用した ECMAScript モジュールの読み込み](/ja/nodejs/api/modules#loading-ecmascript-modules-using-require) を参照してください。

### `--experimental-sea-config` {#--experimental-require-module}

**追加: v20.0.0**

::: warning [安定度: 1 - 試験的]
[安定度: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

このフラグを使用して、Node.jsバイナリに注入して[単一実行可能アプリケーション](/ja/nodejs/api/single-executable-applications)を生成できるblobを生成します。詳細については、[この構成](/ja/nodejs/api/single-executable-applications#generating-single-executable-preparation-blobs)に関するドキュメントを参照してください。


### `--experimental-shadow-realm` {#--experimental-sea-config}

**追加: v19.0.0, v18.13.0**

このフラグを使用して、[ShadowRealm](https://github.com/tc39/proposal-shadowrealm) のサポートを有効にします。

### `--experimental-strip-types` {#--experimental-shadow-realm}

**追加: v22.6.0**

::: warning [安定版: 1 - 実験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

TypeScriptファイルの実験的な型ストリッピングを有効にします。詳細については、[TypeScript型ストリッピング](/ja/nodejs/api/typescript#type-stripping)のドキュメントを参照してください。

### `--experimental-test-coverage` {#--experimental-strip-types}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.1.0, v18.17.0 | このオプションは`--test`で使用できます。 |
| v19.7.0, v18.15.0 | 追加: v19.7.0, v18.15.0 |
:::

`node:test`モジュールと組み合わせて使用​​すると、コードカバレッジレポートがテストランナー出力の一部として生成されます。テストが実行されない場合、カバレッジレポートは生成されません。詳細については、[テストからコードカバレッジを収集する](/ja/nodejs/api/test#collecting-code-coverage)のドキュメントを参照してください。

### `--experimental-test-isolation=mode` {#--experimental-test-coverage}

**追加: v22.8.0**

::: warning [安定版: 1 - 実験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index).0 - 初期開発
:::

テストランナーで使用されるテスト分離の種類を設定します。 `mode`が`'process'`の場合、各テストファイルは個別の子プロセスで実行されます。 `mode`が`'none'`の場合、すべてのテストファイルはテストランナーと同じプロセスで実行されます。デフォルトの分離モードは`'process'`です。このフラグは、`--test`フラグが存在しない場合は無視されます。詳細については、[テストランナーの実行モデル](/ja/nodejs/api/test#test-runner-execution-model)セクションを参照してください。

### `--experimental-test-module-mocks` {#--experimental-test-isolation=mode}

**追加: v22.3.0, v20.18.0**

::: warning [安定版: 1 - 実験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index).0 - 初期開発
:::

テストランナーでモジュールモックを有効にします。


### `--experimental-transform-types` {#--experimental-test-module-mocks}

**Added in: v22.7.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index).1 - 開発中
:::

TypeScript のみの構文を JavaScript コードに変換できるようにします。`--experimental-strip-types` と `--enable-source-maps` を暗黙的に指定します。

### `--experimental-vm-modules` {#--experimental-transform-types}

**Added in: v9.6.0**

`node:vm` モジュールで実験的な ES モジュールサポートを有効にします。

### `--experimental-wasi-unstable-preview1` {#--experimental-vm-modules}

::: info [History]
| Version | Changes |
| --- | --- |
| v20.0.0, v18.17.0 | このオプションは、WASI がデフォルトで有効になっているため不要になりましたが、引き続き渡すことができます。 |
| v13.6.0 | `--experimental-wasi-unstable-preview0` から `--experimental-wasi-unstable-preview1` に変更されました。 |
| v13.3.0, v12.16.0 | Added in: v13.3.0, v12.16.0 |
:::

実験的な WebAssembly System Interface (WASI) サポートを有効にします。

### `--experimental-wasm-modules` {#--experimental-wasi-unstable-preview1}

**Added in: v12.3.0**

実験的な WebAssembly モジュールサポートを有効にします。

### `--experimental-webstorage` {#--experimental-wasm-modules}

**Added in: v22.4.0**

実験的な [`Web Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) サポートを有効にします。

### `--expose-gc` {#--experimental-webstorage}

**Added in: v22.3.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的。このフラグは V8 から継承されたものであり、アップストリームで変更される可能性があります。
:::

このフラグは、V8 の gc 拡張機能を公開します。

```js [ESM]
if (globalThis.gc) {
  globalThis.gc();
}
```
### `--force-context-aware` {#--expose-gc}

**Added in: v12.12.0**

[context-aware](/ja/nodejs/api/addons#context-aware-addons) ではないネイティブアドオンのロードを無効にします。

### `--force-fips` {#--force-context-aware}

**Added in: v6.0.0**

起動時に FIPS 準拠の暗号化を強制します。（スクリプトコードから無効にすることはできません。）（`--enable-fips` と同じ要件です。）

### `--force-node-api-uncaught-exceptions-policy` {#--force-fips}

**Added in: v18.3.0, v16.17.0**

Node-API 非同期コールバックで `uncaughtException` イベントを強制します。

既存のアドオンがプロセスをクラッシュさせるのを防ぐため、このフラグはデフォルトでは有効になっていません。将来的には、正しい動作を強制するために、このフラグがデフォルトで有効になります。


### `--frozen-intrinsics` {#--force-node-api-uncaught-exceptions-policy}

**追加: v11.12.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

`Array` や `Object` のような実験的な凍結された組み込み関数を有効にします。

ルートコンテキストのみがサポートされています。`globalThis.Array` が実際にデフォルトの組み込み関数への参照であるという保証はありません。このフラグの下ではコードが壊れる可能性があります。

ポリフィルを追加できるようにするために、[`--require`](/ja/nodejs/api/cli#-r---require-module) と [`--import`](/ja/nodejs/api/cli#--importmodule) は両方とも組み込み関数の凍結前に実行されます。

### `--heap-prof` {#--frozen-intrinsics}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.4.0, v20.16.0 | `--heap-prof` フラグが安定版になりました。 |
| v12.4.0 | 追加: v12.4.0 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定度: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

起動時に V8 ヒーププロファイラを開始し、終了前にヒーププロファイルをディスクに書き込みます。

`--heap-prof-dir` が指定されていない場合、生成されたプロファイルは現在の作業ディレクトリに配置されます。

`--heap-prof-name` が指定されていない場合、生成されたプロファイルの名前は `Heap.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.heapprofile` になります。

```bash [BASH]
$ node --heap-prof index.js
$ ls *.heapprofile
Heap.20190409.202950.15293.0.001.heapprofile
```
### `--heap-prof-dir` {#--heap-prof}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.4.0, v20.16.0 | `--heap-prof` フラグが安定版になりました。 |
| v12.4.0 | 追加: v12.4.0 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定度: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

`--heap-prof` によって生成されたヒーププロファイルが配置されるディレクトリを指定します。

デフォルト値は、[`--diagnostic-dir`](/ja/nodejs/api/cli#--diagnostic-dirdirectory) コマンドラインオプションによって制御されます。

### `--heap-prof-interval` {#--heap-prof-dir}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.4.0, v20.16.0 | `--heap-prof` フラグが安定版になりました。 |
| v12.4.0 | 追加: v12.4.0 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定度: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

`--heap-prof` によって生成されるヒーププロファイルの平均サンプリング間隔をバイト単位で指定します。デフォルトは 512 * 1024 バイトです。


### `--heap-prof-name` {#--heap-prof-interval}

::: info [履歴]
| バージョン | 変更 |
|---|---|
| v22.4.0, v20.16.0 | `--heap-prof` フラグが安定版になりました。 |
| v12.4.0 | 追加: v12.4.0 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定版: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

`--heap-prof` によって生成されるヒーププロファイルファイル名を指定します。

### `--heapsnapshot-near-heap-limit=max_count` {#--heap-prof-name}

**追加: v15.1.0, v14.18.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定版: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

V8ヒープの使用量がヒープ制限に近づくと、V8ヒープスナップショットをディスクに書き込みます。`count` は負でない整数でなければなりません（その場合、Node.jsは最大 `max_count` 個のスナップショットをディスクに書き込みます）。

スナップショットを生成するときに、ガベージコレクションがトリガーされ、ヒープの使用量が低下する可能性があります。したがって、Node.jsインスタンスが最終的にメモリ不足になる前に、複数のスナップショットがディスクに書き込まれる場合があります。これらのヒープスナップショットを比較して、連続するスナップショットの取得中にどのオブジェクトが割り当てられているかを判断できます。Node.jsが正確に `max_count` 個のスナップショットをディスクに書き込むことは保証されていませんが、`max_count` が `0` より大きい場合、Node.jsインスタンスがメモリ不足になる前に、少なくとも1つ、最大で `max_count` 個のスナップショットを生成するように最善を尽くします。

V8スナップショットの生成には、時間とメモリが必要です（V8ヒープによって管理されるメモリと、V8ヒープ外のネイティブメモリの両方）。ヒープが大きいほど、より多くのリソースが必要です。Node.jsは、追加のV8ヒープメモリのオーバーヘッドに対応するようにV8ヒープを調整し、プロセスが利用できるすべてのメモリを使い果たさないように最善を尽くします。プロセスがシステムが適切と見なすよりも多くのメモリを使用すると、システムの構成に応じて、システムによってプロセスが突然終了される場合があります。

```bash [BASH]
$ node --max-old-space-size=100 --heapsnapshot-near-heap-limit=3 index.js
Wrote snapshot to Heap.20200430.100036.49580.0.001.heapsnapshot
Wrote snapshot to Heap.20200430.100037.49580.0.002.heapsnapshot
Wrote snapshot to Heap.20200430.100038.49580.0.003.heapsnapshot

<--- Last few GCs --->

[49580:0x110000000]     4826 ms: Mark-sweep 130.6 (147.8) -> 130.5 (147.8) MB, 27.4 / 0.0 ms  (average mu = 0.126, current mu = 0.034) allocation failure scavenge might not succeed
[49580:0x110000000]     4845 ms: Mark-sweep 130.6 (147.8) -> 130.6 (147.8) MB, 18.8 / 0.0 ms  (average mu = 0.088, current mu = 0.031) allocation failure scavenge might not succeed


<--- JS stacktrace --->

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
....
```

### `--heapsnapshot-signal=signal` {#--heapsnapshot-near-heap-limit=max_count}

**追加: v12.0.0**

指定されたシグナルを受信したときに Node.js プロセスがヒープダンプを書き出すシグナルハンドラを有効にします。 `signal` は有効なシグナル名である必要があります。 デフォルトでは無効になっています。

```bash [BASH]
$ node --heapsnapshot-signal=SIGUSR2 index.js &
$ ps aux
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
node         1  5.5  6.1 787252 247004 ?       Ssl  16:43   0:02 node --heapsnapshot-signal=SIGUSR2 index.js
$ kill -USR2 1
$ ls
Heap.20190718.133405.15554.0.001.heapsnapshot
```
### `-h`, `--help` {#--heapsnapshot-signal=signal}

**追加: v0.1.3**

node コマンドラインオプションを出力します。 このオプションの出力は、このドキュメントよりも詳細ではありません。

### `--icu-data-dir=file` {#-h---help}

**追加: v0.11.15**

ICU データロードパスを指定します。（`NODE_ICU_DATA` を上書きします。）

### `--import=module` {#--icu-data-dir=file}

**追加: v19.0.0, v18.18.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

起動時に指定されたモジュールをプリロードします。 フラグが複数回指定された場合、各モジュールは、[`NODE_OPTIONS`](/ja/nodejs/api/cli#node_optionsoptions) で指定されたものから順に、表示される順に順番に実行されます。

[ECMAScript モジュール](/ja/nodejs/api/esm#modules-ecmascript-modules) の解決規則に従います。 [CommonJS モジュール](/ja/nodejs/api/modules) をロードするには、[`--require`](/ja/nodejs/api/cli#-r---require-module) を使用します。 `--require` でプリロードされたモジュールは、`--import` でプリロードされたモジュールよりも前に実行されます。

モジュールは、メインスレッドだけでなく、ワーカー スレッド、フォークされたプロセス、またはクラスタ化されたプロセスにもプリロードされます。

### `--input-type=type` {#--import=module}

**追加: v12.0.0**

これは、Node.js が `--eval` または `STDIN` 入力を CommonJS または ES モジュールとして解釈するように構成します。 有効な値は `"commonjs"` または `"module"` です。 デフォルトは `"commonjs"` です。

REPL はこのオプションをサポートしていません。 [`--print`](/ja/nodejs/api/cli#-p---print-script) で `--input-type=module` を使用すると、`--print` が ES モジュールの構文をサポートしていないため、エラーがスローされます。


### `--insecure-http-parser` {#--input-type=type}

**追加: v13.4.0, v12.15.0, v10.19.0**

HTTP パーサーで寛容フラグを有効にします。これにより、非準拠の HTTP 実装との相互運用が可能になる場合があります。

有効にすると、パーサーは以下を受け入れます。

- 無効な HTTP ヘッダー値。
- 無効な HTTP バージョン。
- `Transfer-Encoding` と `Content-Length` ヘッダーの両方を含むメッセージを許可します。
- `Connection: close` が存在する場合、メッセージの後の余分なデータを許可します。
- `chunked` が提供された後、追加の転送エンコーディングを許可します。
- `\r\n` の代わりに `\n` をトークン区切り文字として使用することを許可します。
- チャンクの後に `\r\n` を提供しないことを許可します。
- チャンクサイズの後と `\r\n` の前にスペースが存在することを許可します。

上記のすべては、アプリケーションをリクエストスマグリングまたはポイズニング攻撃にさらします。このオプションの使用は避けてください。

#### 警告: パブリック IP:ポートの組み合わせにインスペクターをバインドすることは安全ではありません {#--insecure-http-parser}

開いているポートを持つパブリック IP ( `0.0.0.0` を含む) にインスペクターをバインドすることは安全ではありません。外部ホストがインスペクターに接続し、[リモートコード実行](https://www.owasp.org/index.php/Code_Injection)攻撃を実行できるようになるためです。

ホストを指定する場合は、次のいずれかを確認してください。

- ホストがパブリックネットワークからアクセスできない。
- ファイアウォールがポート上の不要な接続を許可しない。

**より具体的には、ポート（デフォルトでは <code>9229</code>）がファイアウォールで保護されていない場合、<code>--inspect=0.0.0.0</code> は安全ではありません。**

詳細については、[デバッグのセキュリティに関する考慮事項](https://nodejs.org/en/docs/guides/debugging-getting-started/#security-implications)セクションを参照してください。

### `--inspect-brk[=[host:]port]` {#warning-binding-inspector-to-a-public-ipport-combination-is-insecure}

**追加: v7.6.0**

`host:port` でインスペクターをアクティブにし、ユーザースクリプトの開始時に中断します。デフォルトの `host:port` は `127.0.0.1:9229` です。ポート `0` が指定されている場合は、ランダムに使用可能なポートが使用されます。

Node.js デバッガーの詳細については、[Node.js 用の V8 インスペクター統合](/ja/nodejs/api/debugger#v8-inspector-integration-for-nodejs)を参照してください。

### `--inspect-port=[host:]port` {#--inspect-brk=hostport}

**追加: v7.6.0**

インスペクターがアクティブ化されたときに使用する `host:port` を設定します。`SIGUSR1` シグナルを送信してインスペクターをアクティブ化する場合に役立ちます。

デフォルトのホストは `127.0.0.1` です。ポート `0` が指定されている場合は、ランダムに使用可能なポートが使用されます。

`host` パラメータの使用に関する以下の[セキュリティ警告](/ja/nodejs/api/cli#warning-binding-inspector-to-a-public-ipport-combination-is-insecure)を参照してください。


### `--inspect-publish-uid=stderr,http` {#--inspect-port=hostport}

インスペクターの WebSocket URL の公開方法を指定します。

デフォルトでは、インスペクターの WebSocket URL は stderr で利用可能であり、`http://host:port/json/list` の `/json/list` エンドポイントで利用可能です。

### `--inspect-wait[=[host:]port]` {#--inspect-publish-uid=stderrhttp}

**Added in: v22.2.0, v20.15.0**

`host:port` でインスペクターをアクティブにし、デバッガーが接続されるのを待ちます。デフォルトの `host:port` は `127.0.0.1:9229` です。ポート `0` が指定された場合、ランダムに利用可能なポートが使用されます。

Node.js デバッガーの詳細については、[Node.js の V8 インスペクター統合](/ja/nodejs/api/debugger#v8-inspector-integration-for-nodejs) を参照してください。

### `--inspect[=[host:]port]` {#--inspect-wait=hostport}

**Added in: v6.3.0**

`host:port` でインスペクターをアクティブにします。デフォルトは `127.0.0.1:9229` です。ポート `0` が指定された場合、ランダムに利用可能なポートが使用されます。

V8 インスペクター統合により、Chrome DevTools や IDE などのツールを使用して、Node.js インスタンスをデバッグおよびプロファイルできます。これらのツールは、TCP ポート経由で Node.js インスタンスに接続し、[Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) を使用して通信します。Node.js デバッガーの詳細については、[Node.js の V8 インスペクター統合](/ja/nodejs/api/debugger#v8-inspector-integration-for-nodejs) を参照してください。

### `-i`, `--interactive` {#--inspect=hostport}

**Added in: v0.7.7**

stdin が端末ではないと思われる場合でも、REPL を開きます。

### `--jitless` {#-i---interactive}

**Added in: v12.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的。このフラグは V8 から継承されており、上流で変更される可能性があります。
:::

[実行可能メモリのランタイム割り当て](https://v8.dev/blog/jitless)を無効にします。これは、セキュリティ上の理由から一部のプラットフォームで必要になる場合があります。また、他のプラットフォームでの攻撃対象領域を減らすこともできますが、パフォーマンスへの影響は深刻になる可能性があります。

### `--localstorage-file=file` {#--jitless}

**Added in: v22.4.0**

`localStorage` データの保存に使用されるファイル。ファイルが存在しない場合は、`localStorage` に最初にアクセスしたときに作成されます。同じファイルを複数の Node.js プロセスで同時に共有できます。このフラグは、Node.js が `--experimental-webstorage` フラグで起動されていない限り、何もしません。


### `--max-http-header-size=size` {#--localstorage-file=file}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v13.13.0 | HTTPヘッダーの最大デフォルトサイズを8 KiBから16 KiBに変更。 |
| v11.6.0, v10.15.0 | 追加: v11.6.0, v10.15.0 |
:::

HTTPヘッダーの最大サイズをバイト単位で指定します。デフォルトは16 KiBです。

### `--napi-modules` {#--max-http-header-size=size}

**追加: v7.10.0**

このオプションは何もしません。互換性のために維持されています。

### `--network-family-autoselection-attempt-timeout` {#--napi-modules}

**追加: v22.1.0, v20.13.0**

ネットワークファミリーの自動選択試行タイムアウトのデフォルト値を設定します。詳細については、[`net.getDefaultAutoSelectFamilyAttemptTimeout()`](/ja/nodejs/api/net#netgetdefaultautoselectfamilyattempttimeout) を参照してください。

### `--no-addons` {#--network-family-autoselection-attempt-timeout}

**追加: v16.10.0, v14.19.0**

`node-addons` エクスポート条件を無効にし、ネイティブアドオンのロードも無効にします。`--no-addons` が指定されている場合、`process.dlopen` の呼び出しまたはネイティブ C++ アドオンの require は失敗し、例外がスローされます。

### `--no-deprecation` {#--no-addons}

**追加: v0.8.0**

非推奨の警告を抑制します。

### `--no-experimental-detect-module` {#--no-deprecation}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v22.7.0 | 構文検出がデフォルトで有効になりました。 |
| v21.1.0, v20.10.0 | 追加: v21.1.0, v20.10.0 |
:::

[構文検出](/ja/nodejs/api/packages#syntax-detection)を使用してモジュールタイプを決定することを無効にします。

### `--no-experimental-global-navigator` {#--no-experimental-detect-module}

**追加: v21.2.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

グローバルスコープでの [Navigator API](/ja/nodejs/api/globals#navigator) の公開を無効にします。

### `--no-experimental-repl-await` {#--no-experimental-global-navigator}

**追加: v16.6.0**

このフラグを使用して、REPL でのトップレベル await を無効にします。

### `--no-experimental-require-module` {#--no-experimental-repl-await}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v23.0.0 | これはデフォルトで false になりました。 |
| v22.0.0, v20.17.0 | 追加: v22.0.0, v20.17.0 |
:::

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

`require()` での同期 ES モジュールグラフのロードのサポートを無効にします。

[require() を使用した ECMAScript モジュールのロード](/ja/nodejs/api/modules#loading-ecmascript-modules-using-require) を参照してください。


### `--no-experimental-sqlite` {#--no-experimental-require-module}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.4.0 | SQLiteのフラグは解除されましたが、まだ実験的です。 |
| v22.5.0 | 追加: v22.5.0 |
:::

実験的な [`node:sqlite`](/ja/nodejs/api/sqlite) モジュールを無効にします。

### `--no-experimental-websocket` {#--no-experimental-sqlite}

**追加: v22.0.0**

グローバルスコープでの [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) の公開を無効にします。

### `--no-extra-info-on-fatal-exception` {#--no-experimental-websocket}

**追加: v17.0.0**

終了を引き起こす致命的な例外に関する追加情報を非表示にします。

### `--no-force-async-hooks-checks` {#--no-extra-info-on-fatal-exception}

**追加: v9.0.0**

`async_hooks` のランタイムチェックを無効にします。 これらは、`async_hooks` が有効になっている場合は、動的に有効になります。

### `--no-global-search-paths` {#--no-force-async-hooks-checks}

**追加: v16.10.0**

`$HOME/.node_modules` や `$NODE_PATH` のようなグローバルパスからモジュールを検索しません。

### `--no-network-family-autoselection` {#--no-global-search-paths}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.0.0 | フラグの名前が `--no-enable-network-family-autoselection` から `--no-network-family-autoselection` に変更されました。 古い名前はエイリアスとして引き続き機能します。 |
| v19.4.0 | 追加: v19.4.0 |
:::

接続オプションで明示的に有効にしない限り、ファミリーの自動選択アルゴリズムを無効にします。

### `--no-warnings` {#--no-network-family-autoselection}

**追加: v6.0.0**

すべてのプロセスの警告（非推奨を含む）を抑制します。

### `--node-memory-debug` {#--no-warnings}

**追加: v15.0.0, v14.18.0**

Node.js内部のメモリリークに対する追加のデバッグチェックを有効にします。 これは通常、Node.js自体をデバッグする開発者にのみ役立ちます。

### `--openssl-config=file` {#--node-memory-debug}

**追加: v6.9.0**

起動時にOpenSSL構成ファイルをロードします。 特に、Node.jsがFIPS対応のOpenSSLに対して構築されている場合、これを使用してFIPS準拠の暗号化を有効にできます。

### `--openssl-legacy-provider` {#--openssl-config=file}

**追加: v17.0.0, v16.17.0**

OpenSSL 3.0レガシープロバイダーを有効にします。 詳細については、[OSSL_PROVIDER-legacy](https://www.openssl.org/docs/man3.0/man7/OSSL_PROVIDER-legacy)を参照してください。

### `--openssl-shared-config` {#--openssl-legacy-provider}

**追加: v18.5.0, v16.17.0, v14.21.0**

OpenSSLのデフォルト構成セクションである `openssl_conf` がOpenSSL構成ファイルから読み込まれるようにします。 デフォルトの構成ファイルは `openssl.cnf` という名前ですが、これは環境変数 `OPENSSL_CONF` を使用するか、コマンドラインオプション `--openssl-config` を使用して変更できます。 デフォルトのOpenSSL構成ファイルの場所は、OpenSSLがNode.jsにどのようにリンクされているかによって異なります。 OpenSSL構成を共有すると、予期しない影響が生じる可能性があるため、Node.jsに固有の構成セクションである `nodejs_conf` を使用することをお勧めします。これは、このオプションが使用されていない場合のデフォルトです。


### `--pending-deprecation` {#--openssl-shared-config}

**追加: v8.0.0**

保留中の非推奨警告を発行します。

保留中の非推奨は一般的にランタイムの非推奨と同一ですが、デフォルトで *オフ* になっており、`--pending-deprecation` コマンドラインフラグまたは `NODE_PENDING_DEPRECATION=1` 環境変数が設定されない限り発行されない点が異なります。保留中の非推奨は、開発者が非推奨の API 使用を検出するために活用できる、一種の選択的な "早期警告" メカニズムを提供するために使用されます。

### `--permission` {#--pending-deprecation}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.5.0 | 許可モデルが安定しました。 |
| v20.0.0 | 追加: v20.0.0 |
:::

::: tip [安定: 2 - 安定]
[安定: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定。
:::

現在のプロセスに対して許可モデルを有効にします。有効にすると、次の許可が制限されます。

- ファイルシステム - [`--allow-fs-read`](/ja/nodejs/api/cli#--allow-fs-read), [`--allow-fs-write`](/ja/nodejs/api/cli#--allow-fs-write) フラグで管理可能
- 子プロセス - [`--allow-child-process`](/ja/nodejs/api/cli#--allow-child-process) フラグで管理可能
- Workerスレッド - [`--allow-worker`](/ja/nodejs/api/cli#--allow-worker) フラグで管理可能
- WASI - [`--allow-wasi`](/ja/nodejs/api/cli#--allow-wasi) フラグで管理可能
- アドオン - [`--allow-addons`](/ja/nodejs/api/cli#--allow-addons) フラグで管理可能

### `--preserve-symlinks` {#--permission}

**追加: v6.3.0**

モジュールを解決およびキャッシュするときに、シンボリックリンクを保持するようにモジュールローダーに指示します。

デフォルトでは、Node.js がシンボリックリンクされている別のディスク上の場所からモジュールをロードする場合、Node.js はリンクを解決し、モジュールの実際のディスク上の "実パス" を識別子として、また他の依存モジュールを見つけるためのルートパスとして使用します。ほとんどの場合、このデフォルトの動作で問題ありません。ただし、以下の例に示すように、シンボリックリンクされたピア依存関係を使用する場合、`moduleA` が `moduleB` をピア依存関係として require しようとすると、デフォルトの動作により例外がスローされます。

```text [TEXT]
{appDir}
 ├── app
 │   ├── index.js
 │   └── node_modules
 │       ├── moduleA -> {appDir}/moduleA
 │       └── moduleB
 │           ├── index.js
 │           └── package.json
 └── moduleA
     ├── index.js
     └── package.json
```

`--preserve-symlinks` コマンドラインフラグは、Node.js に実パスではなくモジュールのシンボリックリンクパスを使用するように指示し、シンボリックリンクされたピア依存関係を見つけることを可能にします。

ただし、`--preserve-symlinks` を使用すると、他の副作用が発生する可能性があることに注意してください。具体的には、シンボリックリンクされた *ネイティブ* モジュールは、依存関係ツリー内の複数の場所からリンクされている場合、ロードに失敗する可能性があります（Node.js はこれらを 2 つの別個のモジュールとして認識し、モジュールを複数回ロードしようとするため、例外がスローされます）。

`--preserve-symlinks` フラグはメインモジュールには適用されません。これにより、`node --preserve-symlinks node_module/.bin/\<foo\>` が機能します。メインモジュールに同じ動作を適用するには、`--preserve-symlinks-main` も使用します。


### `--preserve-symlinks-main` {#--preserve-symlinks}

**Added in: v10.2.0**

モジュールローダーに、メインモジュール (`require.main`) を解決してキャッシュするときにシンボリックリンクを保持するように指示します。

このフラグが存在するのは、メインモジュールが、`--preserve-symlinks` が他のすべてのインポートに与えるのと同じ動作をオプトインできるようにするためです。ただし、古いバージョンのNode.jsとの下位互換性のために、これらは別々のフラグです。

`--preserve-symlinks-main` は `--preserve-symlinks` を意味しません。相対パスを解決する前にシンボリックリンクをたどることが望ましくない場合は、`--preserve-symlinks-main` に加えて `--preserve-symlinks` を使用してください。

詳細については、[`--preserve-symlinks`](/ja/nodejs/api/cli#--preserve-symlinks) を参照してください。

### `-p`, `--print "script"` {#--preserve-symlinks-main}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v5.11.0 | 組み込みライブラリが定義済みの変数として利用可能になりました。 |
| v0.6.4 | Added in: v0.6.4 |
:::

`-e` と同じですが、結果を出力します。

### `--prof` {#-p---print-"script"}

**Added in: v2.0.0**

V8プロファイラー出力を生成します。

### `--prof-process` {#--prof}

**Added in: v5.2.0**

V8オプション`--prof`を使用して生成されたV8プロファイラー出力を処理します。

### `--redirect-warnings=file` {#--prof-process}

**Added in: v8.0.0**

プロセス警告をstderrに出力する代わりに、指定されたファイルに書き込みます。ファイルが存在しない場合は作成され、存在する場合は追記されます。警告をファイルに書き込もうとしたときにエラーが発生した場合、警告は代わりにstderrに書き込まれます。

`file` 名は絶対パスでもかまいません。そうでない場合、書き込まれるデフォルトのディレクトリは、[`--diagnostic-dir`](/ja/nodejs/api/cli#--diagnostic-dirdirectory) コマンドラインオプションによって制御されます。

### `--report-compact` {#--redirect-warnings=file}

**Added in: v13.12.0, v12.17.0**

レポートをコンパクトな形式、つまり、人間が消費するために設計されたデフォルトの複数行形式よりも、ログ処理システムでより簡単に消費できる単一行JSONで書き込みます。

### `--report-dir=directory`, `report-directory=directory` {#--report-compact}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v13.12.0, v12.17.0 | このオプションは実験的ではなくなりました。 |
| v12.0.0 | `--diagnostic-report-directory` から `--report-directory` に変更されました。 |
| v11.8.0 | Added in: v11.8.0 |
:::

レポートが生成される場所。


### `--report-exclude-env` {#--report-dir=directory-report-directory=directory}

**Added in: v23.3.0**

`--report-exclude-env` が渡されると、生成される診断レポートに `environmentVariables` データが含まれません。

### `--report-exclude-network` {#--report-exclude-env}

**Added in: v22.0.0, v20.13.0**

診断レポートから `header.networkInterfaces` を除外します。デフォルトでは設定されておらず、ネットワークインターフェースは含まれます。

### `--report-filename=filename` {#--report-exclude-network}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v13.12.0, v12.17.0 | このオプションは実験的ではなくなりました。 |
| v12.0.0 | `--diagnostic-report-filename` から `--report-filename` に変更されました。 |
| v11.8.0 | Added in: v11.8.0 |
:::

レポートが書き込まれるファイルの名前。

ファイル名が `'stdout'` または `'stderr'` に設定されている場合、レポートはそれぞれプロセスの stdout または stderr に書き込まれます。

### `--report-on-fatalerror` {#--report-filename=filename}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v14.0.0, v13.14.0, v12.17.0 | このオプションは実験的ではなくなりました。 |
| v12.0.0 | `--diagnostic-report-on-fatalerror` から `--report-on-fatalerror` に変更されました。 |
| v11.8.0 | Added in: v11.8.0 |
:::

アプリケーションの終了につながる致命的なエラー (メモリ不足など、Node.js ランタイム内の内部エラー) でレポートがトリガーされるようにします。ヒープ、スタック、イベントループの状態、リソース消費など、さまざまな診断データ要素を検査して、致命的なエラーについて推論するのに役立ちます。

### `--report-on-signal` {#--report-on-fatalerror}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v13.12.0, v12.17.0 | このオプションは実験的ではなくなりました。 |
| v12.0.0 | `--diagnostic-report-on-signal` から `--report-on-signal` に変更されました。 |
| v11.8.0 | Added in: v11.8.0 |
:::

実行中の Node.js プロセスへの指定された (または事前定義された) シグナルを受信したときにレポートが生成されるようにします。レポートをトリガーするシグナルは、`--report-signal` を使用して指定します。

### `--report-signal=signal` {#--report-on-signal}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v13.12.0, v12.17.0 | このオプションは実験的ではなくなりました。 |
| v12.0.0 | `--diagnostic-report-signal` から `--report-signal` に変更されました。 |
| v11.8.0 | Added in: v11.8.0 |
:::

レポート生成のシグナルを設定またはリセットします (Windows ではサポートされていません)。デフォルトのシグナルは `SIGUSR2` です。


### `--report-uncaught-exception` {#--report-signal=signal}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.8.0, v16.18.0 | 未処理の例外が処理された場合、レポートは生成されません。 |
| v13.12.0, v12.17.0 | このオプションは実験的ではなくなりました。 |
| v12.0.0 | `--diagnostic-report-uncaught-exception` から `--report-uncaught-exception` に変更されました。 |
| v11.8.0 | Added in: v11.8.0 |
:::

未処理の例外が原因でプロセスが終了したときにレポートが生成されるようにします。ネイティブスタックや他のランタイム環境データと組み合わせて JavaScript スタックを検査する場合に役立ちます。

### `-r`, `--require module` {#--report-uncaught-exception}

**Added in: v1.6.0**

起動時に指定されたモジュールをプリロードします。

`require()` のモジュール解決ルールに従います。`module` は、ファイルへのパス、または node モジュール名である場合があります。

CommonJS モジュールのみがサポートされています。 [ECMAScript モジュール](/ja/nodejs/api/esm#modules-ecmascript-modules) をプリロードするには、[`--import`](/ja/nodejs/api/cli#--importmodule) を使用してください。`--require` でプリロードされたモジュールは、`--import` でプリロードされたモジュールよりも先に実行されます。

モジュールは、メインスレッドだけでなく、すべてのワーカーースレッド、フォークされたプロセス、またはクラスタ化されたプロセスにプリロードされます。

### `--run` {#-r---require-module}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.3.0 | NODE_RUN_SCRIPT_NAME 環境変数が追加されました。 |
| v22.3.0 | NODE_RUN_PACKAGE_JSON_PATH 環境変数が追加されました。 |
| v22.3.0 | ルートディレクトリまで遡って `package.json` ファイルを見つけ、そこからコマンドを実行し、それに応じて `PATH` 環境変数を更新します。 |
| v22.0.0 | Added in: v22.0.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

これは、package.json の `"scripts"` オブジェクトから指定されたコマンドを実行します。 `"command"` が見つからない場合は、利用可能なスクリプトが一覧表示されます。

`--run` はルートディレクトリまで遡って `package.json` ファイルを見つけ、そこからコマンドを実行します。

`--run` は、現在のディレクトリの各親の `./node_modules/.bin` を `PATH` に追加して、複数の `node_modules` ディレクトリが存在する異なるフォルダからバイナリを実行できるようにします ( `ancestor-folder/node_modules/.bin` がディレクトリの場合)。

`--run` は、関連する `package.json` を含むディレクトリでコマンドを実行します。

たとえば、次のコマンドは、現在のフォルダにある `package.json` の `test` スクリプトを実行します。

```bash [BASH]
$ node --run test
```

コマンドに引数を渡すこともできます。 `--` の後の引数はすべて、スクリプトに追加されます。

```bash [BASH]
$ node --run test -- --verbose
```

#### 意図的な制限 {#--run}

`node --run` は `npm run` や他のパッケージマネージャーの `run` コマンドの動作と一致することを意図していません。Node.js の実装は、最も一般的なユースケースにおいて最高のパフォーマンスに焦点を当てるため、意図的に制限されています。他の `run` 実装の一部の機能のうち、意図的に除外されているものは次のとおりです。

- 指定されたスクリプトに加えて、`pre` または `post` スクリプトの実行。
- パッケージマネージャー固有の環境変数の定義。

#### 環境変数 {#intentional-limitations}

`--run` でスクリプトを実行する際には、以下の環境変数が設定されます。

- `NODE_RUN_SCRIPT_NAME`: 実行されているスクリプトの名前。たとえば、`--run` を使用して `test` を実行する場合、この変数の値は `test` になります。
- `NODE_RUN_PACKAGE_JSON_PATH`: 処理されている `package.json` へのパス。

### `--secure-heap-min=n` {#environment-variables}

**追加: v15.6.0**

`--secure-heap` を使用する場合、`--secure-heap-min` フラグはセキュアヒープからの最小割り当てを指定します。最小値は `2` です。最大値は `--secure-heap` または `2147483647` のいずれか小さい方です。指定された値は 2 の累乗である必要があります。

### `--secure-heap=n` {#--secure-heap-min=n}

**追加: v15.6.0**

`n` バイトの OpenSSL セキュアヒープを初期化します。初期化されると、セキュアヒープは、キーの生成やその他の操作中に OpenSSL 内の選択された種類の割り当てに使用されます。これは、たとえば、ポインタのオーバーランまたはアンダーランによって機密情報が漏洩するのを防ぐのに役立ちます。

セキュアヒープは固定サイズであり、実行時にサイズ変更できないため、使用する場合は、すべてのアプリケーションの使用をカバーするのに十分な大きさのヒープを選択することが重要です。

指定されたヒープサイズは 2 の累乗である必要があります。2 未満の値はセキュアヒープを無効にします。

セキュアヒープはデフォルトで無効になっています。

セキュアヒープは Windows では利用できません。

詳細については、[`CRYPTO_secure_malloc_init`](https://www.openssl.org/docs/man3.0/man3/CRYPTO_secure_malloc_init) を参照してください。

### `--snapshot-blob=path` {#--secure-heap=n}

**追加: v18.8.0**

::: warning [安定: 1 - 実験的]
[安定: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

`--build-snapshot` と共に使用すると、`--snapshot-blob` は、生成されたスナップショットブロブが書き込まれるパスを指定します。指定されていない場合、生成されたブロブは現在の作業ディレクトリの `snapshot.blob` に書き込まれます。

`--build-snapshot` なしで使用すると、`--snapshot-blob` は、アプリケーションの状態を復元するために使用されるブロブへのパスを指定します。

スナップショットをロードすると、Node.js は以下を確認します。

一致しない場合、Node.js はスナップショットのロードを拒否し、ステータスコード 1 で終了します。


### `--test` {#--snapshot-blob=path}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v20.0.0 | テストランナーが安定版になりました。 |
| v19.2.0, v18.13.0 | テストランナーがウォッチモードでの実行をサポートするようになりました。 |
| v18.1.0, v16.17.0 | v18.1.0、v16.17.0 で追加 |
:::

Node.js コマンドラインテストランナーを起動します。このフラグは、`--watch-path`、`--check`、`--eval`、`--interactive`、またはインスペクターと組み合わせることはできません。詳細については、[コマンドラインからのテストの実行](/ja/nodejs/api/test#running-tests-from-the-command-line)に関するドキュメントを参照してください。

### `--test-concurrency` {#--test}

**追加: v21.0.0, v20.10.0, v18.19.0**

テストランナー CLI が同時実行するテストファイルの最大数。`--experimental-test-isolation` が `'none'` に設定されている場合、このフラグは無視され、並行処理は 1 になります。それ以外の場合、並行処理はデフォルトで `os.availableParallelism() - 1` になります。

### `--test-coverage-branches=threshold` {#--test-concurrency}

**追加: v22.8.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

カバーされるブランチの最小パーセントを要求します。コードカバレッジが指定されたしきい値に達しない場合、プロセスはコード `1` で終了します。

### `--test-coverage-exclude` {#--test-coverage-branches=threshold}

**追加: v22.5.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

絶対ファイルパスと相対ファイルパスの両方に一致する可能性のあるグロブパターンを使用して、コードカバレッジから特定のファイルを除外します。

このオプションを複数回指定して、複数のグロブパターンを除外できます。

`--test-coverage-exclude` と `--test-coverage-include` の両方が指定されている場合、ファイルはカバレッジレポートに含まれるために**両方**の基準を満たす必要があります。

デフォルトでは、一致するすべてのテストファイルがカバレッジレポートから除外されます。このオプションを指定すると、デフォルトの動作がオーバーライドされます。

### `--test-coverage-functions=threshold` {#--test-coverage-exclude}

**追加: v22.8.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

カバーされる関数の最小パーセントを要求します。コードカバレッジが指定されたしきい値に達しない場合、プロセスはコード `1` で終了します。


### `--test-coverage-include` {#--test-coverage-functions=threshold}

**Added in: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

グロブパターンを使用してコードカバレッジに特定のファイルを含めます。グロブパターンは絶対ファイルパスと相対ファイルパスの両方に一致させることができます。

このオプションは、複数のグロブパターンを含めるために複数回指定できます。

`--test-coverage-exclude` と `--test-coverage-include` の両方が指定されている場合、ファイルはカバレッジレポートに含めるためには **両方** の条件を満たす必要があります。

### `--test-coverage-lines=threshold` {#--test-coverage-include}

**Added in: v22.8.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

カバーされた行の最小パーセントを要求します。コードカバレッジが指定された閾値に達しない場合、プロセスはコード `1` で終了します。

### `--test-force-exit` {#--test-coverage-lines=threshold}

**Added in: v22.0.0, v20.14.0**

既知のテストがすべて実行を終了した後でも、イベントループがアクティブなままである場合でも、プロセスを終了するようにテストランナーを構成します。

### `--test-name-pattern` {#--test-force-exit}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.0.0 | テストランナーが安定版になりました。 |
| v18.11.0 | Added in: v18.11.0 |
:::

指定されたパターンに名前が一致するテストのみを実行するようにテストランナーを構成する正規表現。詳細については、[名前によるテストのフィルタリング](/ja/nodejs/api/test#filtering-tests-by-name)のドキュメントを参照してください。

`--test-name-pattern` と `--test-skip-pattern` の両方が指定されている場合、テストを実行するには **両方** の要件を満たす必要があります。

### `--test-only` {#--test-name-pattern}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.0.0 | テストランナーが安定版になりました。 |
| v18.0.0, v16.17.0 | Added in: v18.0.0, v16.17.0 |
:::

`only` オプションが設定されているトップレベルテストのみを実行するようにテストランナーを構成します。テスト分離が無効になっている場合、このフラグは必要ありません。

### `--test-reporter` {#--test-only}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.0.0 | テストランナーが安定版になりました。 |
| v19.6.0, v18.15.0 | Added in: v19.6.0, v18.15.0 |
:::

テストの実行時に使用するテストレポーター。[テストレポーター](/ja/nodejs/api/test#test-reporters)のドキュメントで詳細を参照してください。


### `--test-reporter-destination` {#--test-reporter}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.0.0 | テストランナーが安定版になりました。 |
| v19.6.0, v18.15.0 | 追加: v19.6.0, v18.15.0 |
:::

対応するテストレポーターの出力先を指定します。詳細については、[テストレポーター](/ja/nodejs/api/test#test-reporters)のドキュメントを参照してください。

### `--test-shard` {#--test-reporter-destination}

**追加: v20.5.0, v18.19.0**

実行するテストスイートのシャードを `\<index\>/\<total\>` の形式で指定します。ここで、

`index` は正の整数で、分割された部分のインデックスです。`total` は正の整数で、分割された部分の合計です。このコマンドは、すべてのテストファイルを `total` 個の等しい部分に分割し、`index` の部分にあるものだけを実行します。

たとえば、テストスイートを 3 つの部分に分割するには、次のようにします。

```bash [BASH]
node --test --test-shard=1/3
node --test --test-shard=2/3
node --test --test-shard=3/3
```
### `--test-skip-pattern` {#--test-shard}

**追加: v22.1.0**

指定されたパターンに名前が一致するテストをスキップするようにテストランナーを設定する正規表現。詳細については、[名前によるテストのフィルタリング](/ja/nodejs/api/test#filtering-tests-by-name)のドキュメントを参照してください。

`--test-name-pattern` と `--test-skip-pattern` の両方が指定されている場合、テストを実行するには**両方**の要件を満たす必要があります。

### `--test-timeout` {#--test-skip-pattern}

**追加: v21.2.0, v20.11.0**

テストの実行が失敗するまでのミリ秒数。指定しない場合、サブテストはこの値を親から継承します。デフォルト値は `Infinity` です。

### `--test-update-snapshots` {#--test-timeout}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.4.0 | スナップショットテストは実験的ではなくなりました。 |
| v22.3.0 | 追加: v22.3.0 |
:::

[スナップショットテスト](/ja/nodejs/api/test#snapshot-testing)のためにテストランナーで使用されるスナップショットファイルを再生成します。

### `--throw-deprecation` {#--test-update-snapshots}

**追加: v0.11.14**

非推奨でエラーをスローします。

### `--title=title` {#--throw-deprecation}

**追加: v10.7.0**

起動時に `process.title` を設定します。

### `--tls-cipher-list=list` {#--title=title}

**追加: v4.0.0**

代替のデフォルト TLS 暗号リストを指定します。Node.js が crypto サポート (デフォルト) でビルドされている必要があります。


### `--tls-keylog=file` {#--tls-cipher-list=list}

**Added in: v13.2.0, v12.16.0**

TLS鍵マテリアルをファイルに記録します。キーマテリアルはNSS `SSLKEYLOGFILE` 形式で、(Wiresharkなどの) TLSトラフィックを復号化するためにソフトウェアで使用できます。

### `--tls-max-v1.2` {#--tls-keylog=file}

**Added in: v12.0.0, v10.20.0**

[`tls.DEFAULT_MAX_VERSION`](/ja/nodejs/api/tls#tlsdefault_max_version) を 'TLSv1.2' に設定します。TLSv1.3 のサポートを無効にするために使用します。

### `--tls-max-v1.3` {#--tls-max-v12}

**Added in: v12.0.0**

デフォルトの [`tls.DEFAULT_MAX_VERSION`](/ja/nodejs/api/tls#tlsdefault_max_version) を 'TLSv1.3' に設定します。TLSv1.3 のサポートを有効にするために使用します。

### `--tls-min-v1.0` {#--tls-max-v13}

**Added in: v12.0.0, v10.20.0**

デフォルトの [`tls.DEFAULT_MIN_VERSION`](/ja/nodejs/api/tls#tlsdefault_min_version) を 'TLSv1' に設定します。古い TLS クライアントまたはサーバーとの互換性のために使用します。

### `--tls-min-v1.1` {#--tls-min-v10}

**Added in: v12.0.0, v10.20.0**

デフォルトの [`tls.DEFAULT_MIN_VERSION`](/ja/nodejs/api/tls#tlsdefault_min_version) を 'TLSv1.1' に設定します。古い TLS クライアントまたはサーバーとの互換性のために使用します。

### `--tls-min-v1.2` {#--tls-min-v11}

**Added in: v12.2.0, v10.20.0**

デフォルトの [`tls.DEFAULT_MIN_VERSION`](/ja/nodejs/api/tls#tlsdefault_min_version) を 'TLSv1.2' に設定します。これは 12.x 以降のデフォルトですが、このオプションは古い Node.js バージョンとの互換性のためにサポートされています。

### `--tls-min-v1.3` {#--tls-min-v12}

**Added in: v12.0.0**

デフォルトの [`tls.DEFAULT_MIN_VERSION`](/ja/nodejs/api/tls#tlsdefault_min_version) を 'TLSv1.3' に設定します。TLSv1.2 のサポートを無効にするために使用します。TLSv1.2 は TLSv1.3 ほど安全ではありません。

### `--trace-deprecation` {#--tls-min-v13}

**Added in: v0.8.0**

非推奨のスタックトレースを表示します。

### `--trace-env` {#--trace-deprecation}

**Added in: v23.4.0**

現在の Node.js インスタンスで実行された環境変数へのアクセスに関する情報を stderr に出力します。

- Node.js が内部的に行う環境変数の読み取り。
- `process.env.KEY = "SOME VALUE"` 形式の書き込み。
- `process.env.KEY` 形式の読み取り。
- `Object.defineProperty(process.env, 'KEY', {...})` 形式の定義。
- `Object.hasOwn(process.env, 'KEY')`、`process.env.hasOwnProperty('KEY')`、または `'KEY' in process.env` 形式のクエリ。
- `delete process.env.KEY` 形式の削除。
- `...process.env` または `Object.keys(process.env)` 形式の列挙。

アクセスされている環境変数の名前のみが出力されます。値は出力されません。

アクセス時のスタックトレースを出力するには、`--trace-env-js-stack` または `--trace-env-native-stack` を使用してください。


### `--trace-env-js-stack` {#--trace-env}

**追加:** v23.4.0

`--trace-env` の機能に加え、アクセス時の JavaScript スタックトレースを出力します。

### `--trace-env-native-stack` {#--trace-env-js-stack}

**追加:** v23.4.0

`--trace-env` の機能に加え、アクセス時のネイティブスタックトレースを出力します。

### `--trace-event-categories` {#--trace-env-native-stack}

**追加:** v7.7.0

`--trace-events-enabled` を使用してトレースイベントトレースが有効になっている場合にトレースされるべきカテゴリのカンマ区切りリスト。

### `--trace-event-file-pattern` {#--trace-event-categories}

**追加:** v9.8.0

トレースイベントデータのファイルパスを指定するテンプレート文字列。`${rotation}` と `${pid}` をサポートします。

### `--trace-events-enabled` {#--trace-event-file-pattern}

**追加:** v7.7.0

トレースイベントトレース情報の収集を有効にします。

### `--trace-exit` {#--trace-events-enabled}

**追加:** v13.5.0, v12.16.0

環境が積極的に終了するたびに、つまり `process.exit()` を呼び出すたびに、スタックトレースを出力します。

### `--trace-require-module=mode` {#--trace-exit}

**追加:** v23.5.0

[`require()` を使用した ECMAScript モジュールのロード](/ja/nodejs/api/modules#loading-ecmascript-modules-using-require) の使用状況に関する情報を出力します。

`mode` が `all` の場合、すべての使用状況が出力されます。 `mode` が `no-node-modules` の場合、`node_modules` フォルダからの使用状況は除外されます。

### `--trace-sigint` {#--trace-require-module=mode}

**追加:** v13.9.0, v12.17.0

SIGINT でスタックトレースを出力します。

### `--trace-sync-io` {#--trace-sigint}

**追加:** v2.1.0

イベントループの最初のターン後に同期 I/O が検出されるたびにスタックトレースを出力します。

### `--trace-tls` {#--trace-sync-io}

**追加:** v12.2.0

TLS パケットトレース情報を `stderr` に出力します。 これは TLS 接続の問題をデバッグするために使用できます。

### `--trace-uncaught` {#--trace-tls}

**追加:** v13.1.0

キャッチされない例外のスタックトレースを出力します。 通常、`Error` の作成に関連付けられたスタックトレースが出力されますが、これにより Node.js は値のスローに関連付けられたスタックトレースも出力します (これは `Error` インスタンスである必要はありません)。

このオプションを有効にすると、ガベージコレクションの動作に悪影響を与える可能性があります。

### `--trace-warnings` {#--trace-uncaught}

**追加:** v6.0.0

プロセスの警告（非推奨を含む）のスタックトレースを出力します。


### `--track-heap-objects` {#--trace-warnings}

**追加:** v2.4.0

ヒープスナップショットのためにヒープオブジェクトの割り当てを追跡します。

### `--unhandled-rejections=mode` {#--track-heap-objects}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v15.0.0 | デフォルトモードを `throw` に変更しました。以前は、警告が出力されていました。 |
| v12.0.0, v10.17.0 | 追加: v12.0.0, v10.17.0 |
:::

このフラグを使用すると、未処理のリジェクションが発生したときに何が起こるかを変更できます。次のいずれかのモードを選択できます。

- `throw`: [`unhandledRejection`](/ja/nodejs/api/process#event-unhandledrejection) を発行します。このフックが設定されていない場合は、未処理のリジェクションをキャッチされない例外として発生させます。これがデフォルトです。
- `strict`: 未処理のリジェクションをキャッチされない例外として発生させます。例外が処理された場合、[`unhandledRejection`](/ja/nodejs/api/process#event-unhandledrejection) が発行されます。
- `warn`: [`unhandledRejection`](/ja/nodejs/api/process#event-unhandledrejection) フックが設定されているかどうかに関係なく、常に警告をトリガーしますが、非推奨の警告は出力しません。
- `warn-with-error-code`: [`unhandledRejection`](/ja/nodejs/api/process#event-unhandledrejection) を発行します。このフックが設定されていない場合は、警告をトリガーし、プロセスの終了コードを 1 に設定します。
- `none`: すべての警告を抑制します。

コマンドラインのエントリポイントの ES モジュール静的ロードフェーズ中にリジェクションが発生した場合、常にキャッチされない例外として発生します。

### `--use-bundled-ca`, `--use-openssl-ca` {#--unhandled-rejections=mode}

**追加:** v6.11.0

現在の Node.js バージョンで提供されているバンドルされた Mozilla CA ストアを使用するか、OpenSSL のデフォルト CA ストアを使用します。デフォルトのストアは、ビルド時に選択できます。

Node.js によって提供されるバンドルされた CA ストアは、リリース時に固定された Mozilla CA ストアのスナップショットです。サポートされているすべてのプラットフォームで同一です。

OpenSSL ストアを使用すると、ストアを外部から変更できます。ほとんどの Linux および BSD ディストリビューションでは、このストアはディストリビューションのメンテナおよびシステム管理者によって維持されています。OpenSSL CA ストアの場所は OpenSSL ライブラリの構成に依存しますが、環境変数を使用して実行時に変更できます。

`SSL_CERT_DIR` および `SSL_CERT_FILE` を参照してください。


### `--use-largepages=mode` {#--use-bundled-ca---use-openssl-ca}

**Added in: v13.6.0, v12.17.0**

Node.jsの静的コードを起動時に大きなメモリページに再マップします。ターゲットシステムでサポートされている場合、これにより、Node.jsの静的コードが4 KiBページではなく2 MiBページに移動されます。

`mode`に有効な値は次のとおりです。

- `off`: マッピングは試行されません。これがデフォルトです。
- `on`: OSでサポートされている場合、マッピングが試行されます。マッピングに失敗しても無視され、メッセージが標準エラーに出力されます。
- `silent`: OSでサポートされている場合、マッピングが試行されます。マッピングに失敗しても無視され、報告されません。

### `--v8-options` {#--use-largepages=mode}

**Added in: v0.1.3**

V8のコマンドラインオプションを出力します。

### `--v8-pool-size=num` {#--v8-options}

**Added in: v5.10.0**

バックグラウンドジョブの割り当てに使用されるV8のスレッドプールサイズを設定します。

`0`に設定すると、Node.jsは並列処理の推定量に基づいて、スレッドプールの適切なサイズを選択します。

並列処理の量は、特定のマシンで同時に実行できる計算の数です。一般的に、CPUの数と同じですが、VMやコンテナなどの環境では異なる場合があります。

### `-v`, `--version` {#--v8-pool-size=num}

**Added in: v0.1.3**

Nodeのバージョンを出力します。

### `--watch` {#-v---version}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v22.0.0, v20.13.0 | ウォッチモードが安定しました。 |
| v19.2.0, v18.13.0 | テストランナーがウォッチモードでの実行をサポートするようになりました。 |
| v18.11.0, v16.19.0 | Added in: v18.11.0, v16.19.0 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

Node.jsをウォッチモードで起動します。ウォッチモードでは、監視対象ファイルの変更により、Node.jsプロセスが再起動されます。デフォルトでは、ウォッチモードはエントリポイントと、requireまたはimportされたモジュールを監視します。監視するパスを指定するには、`--watch-path`を使用します。

このフラグは、`--check`、`--eval`、`--interactive`、またはREPLと組み合わせて使用​​することはできません。

```bash [BASH]
node --watch index.js
```

### `--watch-path` {#--watch}

::: info [History]
| Version | Changes |
| --- | --- |
| v22.0.0, v20.13.0 | ウォッチモードが安定版になりました。 |
| v18.11.0, v16.19.0 | 追加: v18.11.0, v16.19.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

Node.js をウォッチモードで起動し、監視するパスを指定します。 ウォッチモードでは、監視対象パスの変更により Node.js プロセスが再起動されます。 これは、`--watch` と組み合わせて使用した場合でも、require または import されたモジュールの監視をオフにします。

このフラグは、`--check`、`--eval`、`--interactive`、`--test`、または REPL と組み合わせて使用することはできません。

```bash [BASH]
node --watch-path=./src --watch-path=./tests index.js
```
このオプションは、macOS および Windows でのみサポートされています。 オプションがサポートされていないプラットフォームで使用すると、`ERR_FEATURE_UNAVAILABLE_ON_PLATFORM` 例外がスローされます。

### `--watch-preserve-output` {#--watch-path}

**追加: v19.3.0, v18.13.0**

ウォッチモードがプロセスを再起動するときに、コンソールのクリアを無効にします。

```bash [BASH]
node --watch --watch-preserve-output test.js
```
### `--zero-fill-buffers` {#--watch-preserve-output}

**追加: v6.0.0**

新しく割り当てられたすべての [`Buffer`](/ja/nodejs/api/buffer#class-buffer) および [`SlowBuffer`](/ja/nodejs/api/buffer#class-slowbuffer) インスタンスを自動的にゼロで埋めます。

## 環境変数 {#--zero-fill-buffers}

### `FORCE_COLOR=[1, 2, 3]` {#environment-variables_1}

`FORCE_COLOR` 環境変数は、ANSI カラー出力の有効化に使用されます。 値は次のいずれかです。

- `1`、`true`、または空の文字列 `''` は 16 色のサポートを示します。
- `2` は 256 色のサポートを示します。
- `3` は 1600 万色のサポートを示します。

`FORCE_COLOR` が使用され、サポートされている値に設定されている場合、`NO_COLOR` および `NODE_DISABLE_COLORS` 環境変数は無視されます。

他の値を使用すると、カラー出力は無効になります。

### `NODE_COMPILE_CACHE=dir` {#force_color=1-2-3}

**追加: v22.1.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

Node.js インスタンスの[モジュールコンパイルキャッシュ](/ja/nodejs/api/module#module-compile-cache)を有効にします。 詳細については、[モジュールコンパイルキャッシュ](/ja/nodejs/api/module#module-compile-cache)のドキュメントを参照してください。


### `NODE_DEBUG=module[,…]` {#node_compile_cache=dir}

**追加:** v0.1.32

デバッグ情報を出力するコアモジュールを `','` で区切ったリスト。

### `NODE_DEBUG_NATIVE=module[,…]` {#node_debug=module}

デバッグ情報を出力するコア C++ モジュールを `','` で区切ったリスト。

### `NODE_DISABLE_COLORS=1` {#node_debug_native=module}

**追加:** v0.3.0

設定すると、REPL で色が使用されなくなります。

### `NODE_DISABLE_COMPILE_CACHE=1` {#node_disable_colors=1}

**追加:** v22.8.0

::: warning [安定: 1 - 実験的]
[安定: 1](/ja/nodejs/api/documentation#stability-index) [安定: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

Node.js インスタンスの[モジュールコンパイルキャッシュ](/ja/nodejs/api/module#module-compile-cache)を無効にします。詳細については、[モジュールコンパイルキャッシュ](/ja/nodejs/api/module#module-compile-cache)のドキュメントを参照してください。

### `NODE_EXTRA_CA_CERTS=file` {#node_disable_compile_cache=1}

**追加:** v7.3.0

設定すると、既知の "ルート" CA (VeriSign など) が `file` 内の追加の証明書で拡張されます。ファイルは、PEM 形式の 1 つ以上の信頼できる証明書で構成されている必要があります。ファイルが見つからないか、形式が正しくない場合、[`process.emitWarning()`](/ja/nodejs/api/process#processemitwarningwarning-options) でメッセージが (一度) 発行されますが、それ以外のエラーは無視されます。

TLS または HTTPS クライアントまたはサーバーに `ca` オプションプロパティが明示的に指定されている場合、既知の証明書も追加の証明書も使用されません。

この環境変数は、`node` が setuid root として実行されているか、Linux ファイルの機能が設定されている場合は無視されます。

`NODE_EXTRA_CA_CERTS` 環境変数は、Node.js プロセスの初回起動時にのみ読み取られます。実行時に `process.env.NODE_EXTRA_CA_CERTS` を使用して値を変更しても、現在のプロセスには影響しません。

### `NODE_ICU_DATA=file` {#node_extra_ca_certs=file}

**追加:** v0.11.15

ICU (`Intl` オブジェクト) データ用のデータパス。 small-icu サポートでコンパイルすると、リンクされたデータが拡張されます。

### `NODE_NO_WARNINGS=1` {#node_icu_data=file}

**追加:** v6.11.0

`1` に設定すると、プロセスの警告は抑制されます。

### `NODE_OPTIONS=options...` {#node_no_warnings=1}

**追加:** v8.0.0

空白で区切られたコマンドラインオプションのリスト。 `options...` はコマンドラインオプションの前に解釈されるため、コマンドラインオプションは `options...` の内容の後にオーバーライドまたは合成されます。環境で許可されていないオプション ( `-p` やスクリプトファイルなど) を使用すると、Node.js はエラーで終了します。

オプションの値にスペースが含まれている場合は、二重引用符を使用してエスケープできます。

```bash [BASH]
NODE_OPTIONS='--require "./my path/file.js"'
```
コマンドラインオプションとして渡されたシングルトンフラグは、`NODE_OPTIONS` に渡された同じフラグをオーバーライドします。

```bash [BASH]
# インスペクターはポート 5555 で利用可能になります {#node_options=options}
NODE_OPTIONS='--inspect=localhost:4444' node --inspect=localhost:5555
```
複数回渡すことができるフラグは、`NODE_OPTIONS` のインスタンスが最初に渡され、次にコマンドラインインスタンスが渡されたかのように扱われます。

```bash [BASH]
NODE_OPTIONS='--require "./a.js"' node --require "./b.js"
# は以下と同等です: {#the-inspector-will-be-available-on-port-5555}
node --require "./a.js" --require "./b.js"
```
許可されている Node.js オプションは、次のリストにあります。オプションが `--XX` と `--no-XX` の両方のバリアントをサポートしている場合、両方がサポートされますが、以下のリストには 1 つのみが含まれています。

- `--allow-addons`
- `--allow-child-process`
- `--allow-fs-read`
- `--allow-fs-write`
- `--allow-wasi`
- `--allow-worker`
- `--conditions`, `-C`
- `--diagnostic-dir`
- `--disable-proto`
- `--disable-warning`
- `--disable-wasm-trap-handler`
- `--dns-result-order`
- `--enable-fips`
- `--enable-network-family-autoselection`
- `--enable-source-maps`
- `--entry-url`
- `--experimental-abortcontroller`
- `--experimental-async-context-frame`
- `--experimental-detect-module`
- `--experimental-eventsource`
- `--experimental-import-meta-resolve`
- `--experimental-json-modules`
- `--experimental-loader`
- `--experimental-modules`
- `--experimental-permission`
- `--experimental-print-required-tla`
- `--experimental-require-module`
- `--experimental-shadow-realm`
- `--experimental-specifier-resolution`
- `--experimental-strip-types`
- `--experimental-top-level-await`
- `--experimental-transform-types`
- `--experimental-vm-modules`
- `--experimental-wasi-unstable-preview1`
- `--experimental-wasm-modules`
- `--experimental-webstorage`
- `--force-context-aware`
- `--force-fips`
- `--force-node-api-uncaught-exceptions-policy`
- `--frozen-intrinsics`
- `--heap-prof-dir`
- `--heap-prof-interval`
- `--heap-prof-name`
- `--heap-prof`
- `--heapsnapshot-near-heap-limit`
- `--heapsnapshot-signal`
- `--http-parser`
- `--icu-data-dir`
- `--import`
- `--input-type`
- `--insecure-http-parser`
- `--inspect-brk`
- `--inspect-port`, `--debug-port`
- `--inspect-publish-uid`
- `--inspect-wait`
- `--inspect`
- `--localstorage-file`
- `--max-http-header-size`
- `--napi-modules`
- `--network-family-autoselection-attempt-timeout`
- `--no-addons`
- `--no-deprecation`
- `--no-experimental-global-navigator`
- `--no-experimental-repl-await`
- `--no-experimental-sqlite`
- `--no-experimental-websocket`
- `--no-extra-info-on-fatal-exception`
- `--no-force-async-hooks-checks`
- `--no-global-search-paths`
- `--no-network-family-autoselection`
- `--no-warnings`
- `--node-memory-debug`
- `--openssl-config`
- `--openssl-legacy-provider`
- `--openssl-shared-config`
- `--pending-deprecation`
- `--permission`
- `--preserve-symlinks-main`
- `--preserve-symlinks`
- `--prof-process`
- `--redirect-warnings`
- `--report-compact`
- `--report-dir`, `--report-directory`
- `--report-exclude-env`
- `--report-exclude-network`
- `--report-filename`
- `--report-on-fatalerror`
- `--report-on-signal`
- `--report-signal`
- `--report-uncaught-exception`
- `--require`, `-r`
- `--secure-heap-min`
- `--secure-heap`
- `--snapshot-blob`
- `--test-coverage-branches`
- `--test-coverage-exclude`
- `--test-coverage-functions`
- `--test-coverage-include`
- `--test-coverage-lines`
- `--test-name-pattern`
- `--test-only`
- `--test-reporter-destination`
- `--test-reporter`
- `--test-shard`
- `--test-skip-pattern`
- `--throw-deprecation`
- `--title`
- `--tls-cipher-list`
- `--tls-keylog`
- `--tls-max-v1.2`
- `--tls-max-v1.3`
- `--tls-min-v1.0`
- `--tls-min-v1.1`
- `--tls-min-v1.2`
- `--tls-min-v1.3`
- `--trace-deprecation`
- `--trace-env-js-stack`
- `--trace-env-native-stack`
- `--trace-env`
- `--trace-event-categories`
- `--trace-event-file-pattern`
- `--trace-events-enabled`
- `--trace-exit`
- `--trace-require-module`
- `--trace-sigint`
- `--trace-sync-io`
- `--trace-tls`
- `--trace-uncaught`
- `--trace-warnings`
- `--track-heap-objects`
- `--unhandled-rejections`
- `--use-bundled-ca`
- `--use-largepages`
- `--use-openssl-ca`
- `--v8-pool-size`
- `--watch-path`
- `--watch-preserve-output`
- `--watch`
- `--zero-fill-buffers`

許可されている V8 オプションは次のとおりです。

- `--abort-on-uncaught-exception`
- `--disallow-code-generation-from-strings`
- `--enable-etw-stack-walking`
- `--expose-gc`
- `--interpreted-frames-native-stack`
- `--jitless`
- `--max-old-space-size`
- `--max-semi-space-size`
- `--perf-basic-prof-only-functions`
- `--perf-basic-prof`
- `--perf-prof-unwinding-info`
- `--perf-prof`
- `--stack-trace-limit`

`--perf-basic-prof-only-functions`、`--perf-basic-prof`、`--perf-prof-unwinding-info`、および `--perf-prof` は Linux でのみ使用できます。

`--enable-etw-stack-walking` は Windows でのみ使用できます。


### `NODE_PATH=path[:…]` {#is-equivalent-to}

**追加:** v0.1.32

モジュール検索パスの先頭に追加されるディレクトリの `':'` で区切られたリストです。

Windows では、代わりに `';'` で区切られたリストになります。

### `NODE_PENDING_DEPRECATION=1` {#node_path=path}

**追加:** v8.0.0

`1` に設定すると、保留中の非推奨警告を発行します。

保留中の非推奨は、一般的にランタイムの非推奨と同じですが、デフォルトで *オフ* になっており、`--pending-deprecation` コマンドラインフラグまたは `NODE_PENDING_DEPRECATION=1` 環境変数が設定されない限り発行されないという点で顕著な例外があります。保留中の非推奨は、開発者が非推奨のAPI使用を検出するために活用できる一種の選択的な「早期警告」メカニズムを提供するために使用されます。

### `NODE_PENDING_PIPE_INSTANCES=instances` {#node_pending_deprecation=1}

パイプサーバーが接続を待機しているときに保留中のパイプインスタンスハンドルの数を設定します。この設定は Windows のみに適用されます。

### `NODE_PRESERVE_SYMLINKS=1` {#node_pending_pipe_instances=instances}

**追加:** v7.1.0

`1` に設定すると、モジュールを解決してキャッシュするときに、モジュールローダーにシンボリックリンクを保持するように指示します。

### `NODE_REDIRECT_WARNINGS=file` {#node_preserve_symlinks=1}

**追加:** v8.0.0

設定すると、プロセスの警告は stderr に出力する代わりに、指定されたファイルに出力されます。ファイルが存在しない場合は作成され、存在する場合は追加されます。警告をファイルに書き込もうとしたときにエラーが発生した場合、警告は代わりに stderr に書き込まれます。これは、`--redirect-warnings=file` コマンドラインフラグを使用するのと同じです。

### `NODE_REPL_EXTERNAL_MODULE=file` {#node_redirect_warnings=file}

::: info [履歴]
| バージョン | 変更点 |
|---|---|
| v22.3.0, v20.16.0 | エンベッダー向けの kDisableNodeOptionsEnv でこの環境変数を使用する可能性を削除しました。 |
| v13.0.0, v12.16.0 | 追加: v13.0.0, v12.16.0 |
:::

組み込み REPL の代わりに使用される Node.js モジュールへのパス。この値を空文字列 (`''`) で上書きすると、組み込み REPL が使用されます。

### `NODE_REPL_HISTORY=file` {#node_repl_external_module=file}

**追加:** v3.0.0

永続的な REPL 履歴を保存するために使用されるファイルへのパス。デフォルトのパスは `~/.node_repl_history` であり、この変数によって上書きされます。値を空文字列 (`''` または `' '`) に設定すると、永続的な REPL 履歴が無効になります。


### `NODE_SKIP_PLATFORM_CHECK=value` {#node_repl_history=file}

**追加: v14.5.0**

`value` が `'1'` に等しい場合、Node.js の起動時にサポートされているプラットフォームのチェックがスキップされます。Node.js は正しく実行されない可能性があります。サポートされていないプラットフォームで発生した問題は修正されません。

### `NODE_TEST_CONTEXT=value` {#node_skip_platform_check=value}

`value` が `'child'` に等しい場合、テストレポーターのオプションはオーバーライドされ、テスト出力は TAP 形式で stdout に送信されます。他の値が指定された場合、Node.js は使用されるレポーターの形式またはその安定性について保証しません。

### `NODE_TLS_REJECT_UNAUTHORIZED=value` {#node_test_context=value}

`value` が `'0'` に等しい場合、TLS 接続の証明書検証が無効になります。これにより、TLS、そして拡張された HTTPS は安全でなくなります。この環境変数の使用は強く推奨されません。

### `NODE_V8_COVERAGE=dir` {#node_tls_reject_unauthorized=value}

設定すると、Node.js は [V8 JavaScript コードカバレッジ](https://v8project.blogspot.com/2017/12/javascript-code-coverage) および [ソースマップ](https://sourcemaps.info/spec) データを引数として指定されたディレクトリに出力し始めます（カバレッジ情報は `coverage` プレフィックスを持つファイルに JSON として書き込まれます）。

`NODE_V8_COVERAGE` はサブプロセスに自動的に伝播するため、`child_process.spawn()` ファミリの関数を呼び出すアプリケーションのインストルメント化が容易になります。`NODE_V8_COVERAGE` を空の文字列に設定して、伝播を防ぐことができます。

### `NO_COLOR=<any>` {#node_v8_coverage=dir}

[`NO_COLOR`](https://no-color.org/) は `NODE_DISABLE_COLORS` のエイリアスです。環境変数の値は任意です。

#### カバレッジ出力 {#no_color=&lt;any&gt;}

カバレッジは、最上位のキー `result` の [ScriptCoverage](https://chromedevtools.github.io/devtools-protocol/tot/Profiler#type-ScriptCoverage) オブジェクトの配列として出力されます。

```json [JSON]
{
  "result": [
    {
      "scriptId": "67",
      "url": "internal/tty.js",
      "functions": []
    }
  ]
}
```
#### ソースマップキャッシュ {#coverage-output}

::: warning [安定版: 1 - 実験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

ソースマップデータが見つかった場合、JSON カバレッジオブジェクトの最上位キー `source-map-cache` に追加されます。

`source-map-cache` は、ソースマップが抽出されたファイルを表すキーを持つオブジェクトであり、値には、生のソースマップ URL（キー `url` 内）、解析されたソースマップ v3 情報（キー `data` 内）、およびソースファイルの行の長さ（キー `lineLengths` 内）が含まれます。

```json [JSON]
{
  "result": [
    {
      "scriptId": "68",
      "url": "file:///absolute/path/to/source.js",
      "functions": []
    }
  ],
  "source-map-cache": {
    "file:///absolute/path/to/source.js": {
      "url": "./path-to-map.json",
      "data": {
        "version": 3,
        "sources": [
          "file:///absolute/path/to/original.js"
        ],
        "names": [
          "Foo",
          "console",
          "info"
        ],
        "mappings": "MAAMA,IACJC,YAAaC",
        "sourceRoot": "./"
      },
      "lineLengths": [
        13,
        62,
        38,
        27
      ]
    }
  }
}
```

### `OPENSSL_CONF=file` {#source-map-cache}

**Added in: v6.11.0**

起動時にOpenSSL設定ファイルを読み込みます。特に、Node.jsが`./configure --openssl-fips`でビルドされている場合、FIPS準拠の暗号化を有効にするために使用できます。

[`--openssl-config`](/ja/nodejs/api/cli#--openssl-configfile)コマンドラインオプションが使用されている場合、この環境変数は無視されます。

### `SSL_CERT_DIR=dir` {#openssl_conf=file}

**Added in: v7.7.0**

`--use-openssl-ca`が有効になっている場合、信頼された証明書を含むOpenSSLのディレクトリを上書きして設定します。

子環境が明示的に設定されていない限り、この環境変数はすべての子プロセスに継承され、それらがOpenSSLを使用する場合、Node.jsと同じCAを信頼する可能性があることに注意してください。

### `SSL_CERT_FILE=file` {#ssl_cert_dir=dir}

**Added in: v7.7.0**

`--use-openssl-ca`が有効になっている場合、信頼された証明書を含むOpenSSLのファイルを上書きして設定します。

子環境が明示的に設定されていない限り、この環境変数はすべての子プロセスに継承され、それらがOpenSSLを使用する場合、Node.jsと同じCAを信頼する可能性があることに注意してください。

### `TZ` {#ssl_cert_file=file}

::: info [History]
| Version | Changes |
| --- | --- |
| v16.2.0 | process.env.TZ = を使用してTZ変数を変更すると、Windowsでもタイムゾーンが変更されます。 |
| v13.0.0 | process.env.TZ = を使用してTZ変数を変更すると、POSIXシステムでタイムゾーンが変更されます。 |
| v0.0.1 | Added in: v0.0.1 |
:::

`TZ`環境変数は、タイムゾーン構成を指定するために使用されます。

Node.jsは、他の環境で`TZ`が処理されるさまざまな[方法](https://www.gnu.org/software/libc/manual/html_node/TZ-Variable)のすべてをサポートしているわけではありませんが、基本的な[タイムゾーンID](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)（`'Etc/UTC'`、`'Europe/Paris'`、`'America/New_York'`など）をサポートしています。 他のいくつかの省略形またはエイリアスをサポートする場合がありますが、これらは強く推奨されず、保証もされていません。

```bash [BASH]
$ TZ=Europe/Dublin node -pe "new Date().toString()"
Wed May 12 2021 20:30:48 GMT+0100 (Irish Standard Time)
```

### `UV_THREADPOOL_SIZE=size` {#tz}

libuv のスレッドプールで使用されるスレッド数を `size` スレッドに設定します。

Node.js では可能な限り非同期システム API が使用されますが、存在しない場合は、libuv のスレッドプールを使用して、同期システム API に基づいた非同期ノード API が作成されます。スレッドプールを使用する Node.js API は次のとおりです。

- ファイルウォッチャー API と明示的に同期的なものを除く、すべての `fs` API
- `crypto.pbkdf2()`、`crypto.scrypt()`、`crypto.randomBytes()`、`crypto.randomFill()`、`crypto.generateKeyPair()` などの非同期 crypto API
- `dns.lookup()`
- 明示的に同期的なものを除く、すべての `zlib` API

libuv のスレッドプールのサイズは固定されているため、何らかの理由でこれらの API のいずれかが長時間かかる場合、libuv のスレッドプールで実行される他の（一見無関係な）API のパフォーマンスが低下します。この問題を軽減するために、`'UV_THREADPOOL_SIZE'` 環境変数を `4`（現在のデフォルト値）より大きい値に設定して、libuv のスレッドプールのサイズを大きくすることが考えられます。ただし、`process.env.UV_THREADPOOL_SIZE=size` を使用してプロセス内部から設定しても、スレッドプールはユーザーコードが実行されるよりもずっと前にランタイム初期化の一部として作成されているため、動作することは保証されません。詳細については、[libuv スレッドプールのドキュメント](https://docs.libuv.org/en/latest/threadpool)を参照してください。

## 役立つ V8 オプション {#uv_threadpool_size=size}

V8 には、独自の CLI オプションのセットがあります。`node` に提供された V8 CLI オプションは、すべて V8 に渡されて処理されます。V8 のオプションには*安定性の保証はありません*。V8 チーム自体は、それらを正式な API の一部とは見なしておらず、いつでも変更する権利を留保しています。同様に、それらは Node.js の安定性保証の対象ではありません。V8 オプションの多くは、V8 開発者のみが対象としています。それにもかかわらず、Node.js に広く適用できる V8 オプションの小さなセットがあり、ここに文書化されています。

### `--abort-on-uncaught-exception` {#useful-v8-options}


### `--disallow-code-generation-from-strings` {#--abort-on-uncaught-exception_1}

### `--enable-etw-stack-walking` {#--disallow-code-generation-from-strings_1}

### `--expose-gc` {#--enable-etw-stack-walking}

### `--harmony-shadow-realm` {#--expose-gc_1}

### `--interpreted-frames-native-stack` {#--harmony-shadow-realm}

### `--jitless` {#--interpreted-frames-native-stack}

### `--max-old-space-size=SIZE` (MiB単位) {#--jitless_1}

V8の古いメモリセクションの最大メモリサイズを設定します。メモリ消費量が制限に近づくと、V8は未使用メモリを解放するためにガベージコレクションにより多くの時間を費やします。

2 GiBのメモリを搭載したマシンでは、他の用途のためにメモリを残し、スワップを避けるために、これを1536（1.5 GiB）に設定することを検討してください。

```bash [BASH]
node --max-old-space-size=1536 index.js
```
### `--max-semi-space-size=SIZE` (MiB単位) {#--max-old-space-size=size-in-mib}

V8の[スカベンジガベージコレクター](https://v8.dev/blog/orinoco-parallel-scavenger)の最大[セミスペース](https://www.memorymanagement.org/glossary/s#semi.space)サイズをMiB（メビバイト）単位で設定します。セミスペースの最大サイズを大きくすると、より多くのメモリを消費する代わりに、Node.jsのスループットが向上する可能性があります。

V8ヒープのヤングジェネレーションサイズはセミスペースのサイズの3倍であるため（V8の[`YoungGenerationSizeFromSemiSpaceSize`](https://chromium.googlesource.com/v8/v8.git/+/refs/tags/10.3.129/src/heap/heap.cc#328)を参照）、セミスペースに1 MiBを追加すると、3つの個々のセミスペースのそれぞれに適用され、ヒープサイズが3 MiB増加します。スループットの向上は、ワークロードによって異なります（[#42511](https://github.com/nodejs/node/issues/42511)を参照）。

デフォルト値は、メモリ制限によって異なります。たとえば、メモリ制限が512 MiBの64ビットシステムでは、セミスペースの最大サイズはデフォルトで1 MiBになります。最大2GiBまでのメモリ制限の場合、セミスペースのデフォルトの最大サイズは、64ビットシステムで16 MiB未満になります。

アプリケーションに最適な構成を取得するには、アプリケーションのベンチマークを実行するときに、さまざまなmax-semi-space-sizeの値を試す必要があります。

たとえば、64ビットシステムのベンチマーク：

```bash [BASH]
for MiB in 16 32 64 128; do
    node --max-semi-space-size=$MiB index.js
done
```

### `--perf-basic-prof` {#--max-semi-space-size=size-in-mib}

### `--perf-basic-prof-only-functions` {#--perf-basic-prof}

### `--perf-prof` {#--perf-basic-prof-only-functions}

### `--perf-prof-unwinding-info` {#--perf-prof}

### `--prof` {#--perf-prof-unwinding-info}

### `--security-revert` {#--prof_1}

### `--stack-trace-limit=limit` {#--security-revert}

エラーのスタックトレースに収集するスタックフレームの最大数。0 に設定すると、スタックトレースの収集が無効になります。デフォルト値は 10 です。

```bash [BASH]
node --stack-trace-limit=12 -p -e "Error.stackTraceLimit" # 12 を出力
```

