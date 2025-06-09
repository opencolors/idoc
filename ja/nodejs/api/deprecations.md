---
title: Node.jsの非推奨機能
description: このページでは、Node.jsで非推奨となった機能を文書化し、古いAPIや慣行を使用しないようにコードを更新するためのガイダンスを提供します。
head:
  - - meta
    - name: og:title
      content: Node.jsの非推奨機能 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: このページでは、Node.jsで非推奨となった機能を文書化し、古いAPIや慣行を使用しないようにコードを更新するためのガイダンスを提供します。
  - - meta
    - name: twitter:title
      content: Node.jsの非推奨機能 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: このページでは、Node.jsで非推奨となった機能を文書化し、古いAPIや慣行を使用しないようにコードを更新するためのガイダンスを提供します。
---


# 非推奨 API {#deprecated-apis}

Node.js API は、以下のいずれかの理由で非推奨になることがあります。

- API の使用が安全でない。
- より改善された代替 API が利用可能である。
- 将来のメジャーリリースで API に破壊的な変更が予想される。

Node.js は、4 種類の非推奨を使用します。

- ドキュメントのみ
- アプリケーション（`node_modules` コード以外のみ）
- ランタイム（すべてのコード）
- 寿命終了

ドキュメントのみの非推奨は、Node.js API ドキュメント内でのみ表現されるものです。 これらは、Node.js の実行中に副作用を発生させません。 一部のドキュメントのみの非推奨は、[`--pending-deprecation`](/ja/nodejs/api/cli#--pending-deprecation) フラグ（またはその代替である `NODE_PENDING_DEPRECATION=1` 環境変数）を指定して起動した場合、以下のランタイムの非推奨と同様に、ランタイム警告をトリガーします。 そのフラグをサポートするドキュメントのみの非推奨は、[非推奨 API のリスト](/ja/nodejs/api/deprecations#list-of-deprecated-apis)で明示的にラベル付けされています。

`node_modules` コード以外のみのアプリケーションの非推奨は、デフォルトで、非推奨の API が `node_modules` からロードされないコードで使用された最初のときに、`stderr` に出力されるプロセス警告を生成します。 [`--throw-deprecation`](/ja/nodejs/api/cli#--throw-deprecation) コマンドラインフラグが使用されると、ランタイムの非推奨によりエラーがスローされます。 [`--pending-deprecation`](/ja/nodejs/api/cli#--pending-deprecation) が使用されると、`node_modules` からロードされたコードについても警告が発行されます。

すべてのコードに対するランタイムの非推奨は、`node_modules` コードに対するランタイムの非推奨と似ていますが、`node_modules` からロードされたコードについても警告を発行する点が異なります。

寿命終了の非推奨は、機能が Node.js から削除されるか、またはすぐに削除される場合に使用されます。

## 非推奨の取り消し {#revoking-deprecations}

場合によっては、API の非推奨が取り消されることがあります。 そのような状況では、このドキュメントは決定に関連する情報で更新されます。 ただし、非推奨識別子は変更されません。

## 非推奨 API のリスト {#list-of-deprecated-apis}

### DEP0001: `http.OutgoingMessage.prototype.flush` {#dep0001-httpoutgoingmessageprototypeflush}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.0.0 | 寿命終了。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v1.6.0 | ランタイムの非推奨。 |
:::

種類: 寿命終了

`OutgoingMessage.prototype.flush()` は削除されました。 代わりに `OutgoingMessage.prototype.flushHeaders()` を使用してください。


### DEP0002: `require('_linklist')` {#dep0002-require_linklist}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v8.0.0 | 寿命終了。 |
| v6.12.0 | 非推奨コードが割り当てられました。 |
| v5.0.0 | ランタイム非推奨。 |
:::

種類: 寿命終了

`_linklist` モジュールは非推奨です。ユーザーランドの代替を使用してください。

### DEP0003: `_writableState.buffer` {#dep0003-_writablestatebuffer}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.0.0 | 寿命終了。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v0.11.15 | ランタイム非推奨。 |
:::

種類: 寿命終了

`_writableState.buffer` は削除されました。代わりに `_writableState.getBuffer()` を使用してください。

### DEP0004: `CryptoStream.prototype.readyState` {#dep0004-cryptostreamprototypereadystate}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | 寿命終了。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v0.4.0 | ドキュメントのみの非推奨。 |
:::

種類: 寿命終了

`CryptoStream.prototype.readyState` プロパティは削除されました。

### DEP0005: `Buffer()` コンストラクタ {#dep0005-buffer-constructor}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | ランタイム非推奨。 |
| v6.12.0 | 非推奨コードが割り当てられました。 |
| v6.0.0 | ドキュメントのみの非推奨。 |
:::

種類: アプリケーション ( `node_modules` コードのみ)

`Buffer()` 関数と `new Buffer()` コンストラクタは、誤ってセキュリティ上の問題を引き起こす可能性のある API の使いやすさの問題により、非推奨となりました。

代替手段として、`Buffer` オブジェクトを構築するには、次のいずれかのメソッドを使用してください。

- [`Buffer.alloc(size[, fill[, encoding]])`](/ja/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding): *初期化された* メモリを持つ `Buffer` を作成します。
- [`Buffer.allocUnsafe(size)`](/ja/nodejs/api/buffer#static-method-bufferallocunsafesize): *初期化されていない* メモリを持つ `Buffer` を作成します。
- [`Buffer.allocUnsafeSlow(size)`](/ja/nodejs/api/buffer#static-method-bufferallocunsafeslowsize): *初期化されていない* メモリを持つ `Buffer` を作成します。
- [`Buffer.from(array)`](/ja/nodejs/api/buffer#static-method-bufferfromarray): `array` のコピーを持つ `Buffer` を作成します。
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/ja/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) - 指定された `arrayBuffer` をラップする `Buffer` を作成します。
- [`Buffer.from(buffer)`](/ja/nodejs/api/buffer#static-method-bufferfrombuffer): `buffer` をコピーする `Buffer` を作成します。
- [`Buffer.from(string[, encoding])`](/ja/nodejs/api/buffer#static-method-bufferfromstring-encoding): `string` をコピーする `Buffer` を作成します。

`--pending-deprecation` を指定しない場合、ランタイム警告は `node_modules` にないコードに対してのみ発生します。これは、依存関係での `Buffer()` の使用に対する非推奨警告がないことを意味します。`--pending-deprecation` を指定すると、`Buffer()` の使用箇所に関係なく、ランタイム警告が発生します。


### DEP0006: `child_process` `options.customFds` {#dep0006-child_process-optionscustomfds}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.0.0 | サポート終了。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v0.11.14 | ランタイムでの非推奨。 |
| v0.5.10 | ドキュメントのみの非推奨。 |
:::

種類: サポート終了

[`child_process`](/ja/nodejs/api/child_process) モジュールの `spawn()`、`fork()`、および `exec()` メソッドにおいて、`options.customFds` オプションは非推奨です。代わりに `options.stdio` オプションを使用する必要があります。

### DEP0007: `cluster` `worker.suicide` を `worker.exitedAfterDisconnect` で置き換える {#dep0007-replace-cluster-workersuicide-with-workerexitedafterdisconnect}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v9.0.0 | サポート終了。 |
| v7.0.0 | ランタイムでの非推奨。 |
| v6.12.0 | 非推奨コードが割り当てられました。 |
| v6.0.0 | ドキュメントのみの非推奨。 |
:::

種類: サポート終了

以前のバージョンの Node.js `cluster` では、`Worker` オブジェクトに `suicide` という名前のブール値プロパティが追加されました。このプロパティの目的は、`Worker` インスタンスがどのように、そしてなぜ終了したかを示すことでした。Node.js 6.0.0 では、古いプロパティは非推奨となり、新しい [`worker.exitedAfterDisconnect`](/ja/nodejs/api/cluster#workerexitedafterdisconnect) プロパティに置き換えられました。古いプロパティ名は、実際のセマンティクスを正確に記述しておらず、不必要に感情的でした。

### DEP0008: `require('node:constants')` {#dep0008-requirenodeconstants}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v6.12.0 | 非推奨コードが割り当てられました。 |
| v6.3.0 | ドキュメントのみの非推奨。 |
:::

種類: ドキュメントのみ

`node:constants` モジュールは非推奨です。特定の Node.js 組み込みモジュールに関連する定数へのアクセスが必要な場合、開発者は代わりに、関連するモジュールによって公開される `constants` プロパティを参照する必要があります。たとえば、`require('node:fs').constants` や `require('node:os').constants` などです。

### DEP0009: ダイジェストなしの `crypto.pbkdf2` {#dep0009-cryptopbkdf2-without-digest}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.0.0 | サポート終了 (`digest === null` の場合)。 |
| v11.0.0 | ランタイムでの非推奨 (`digest === null` の場合)。 |
| v8.0.0 | サポート終了 (`digest === undefined` の場合)。 |
| v6.12.0 | 非推奨コードが割り当てられました。 |
| v6.0.0 | ランタイムでの非推奨 (`digest === undefined` の場合)。 |
:::

種類: サポート終了

ダイジェストを指定せずに [`crypto.pbkdf2()`](/ja/nodejs/api/crypto#cryptopbkdf2password-salt-iterations-keylen-digest-callback) API を使用することは、メソッドが非推奨の `'SHA1'` ダイジェストをデフォルトで使用していたため、Node.js 6.0 で非推奨になりました。以前は、非推奨警告が表示されていました。Node.js 8.0.0 以降では、`digest` を `undefined` に設定して `crypto.pbkdf2()` または `crypto.pbkdf2Sync()` を呼び出すと、`TypeError` がスローされます。

Node.js v11.0.0 以降では、`digest` を `null` に設定してこれらの関数を呼び出すと、`digest` が `undefined` の場合と同じ動作をするように、非推奨警告が表示されます。

ただし、現在では、`undefined` または `null` のいずれかを渡すと、`TypeError` がスローされます。


### DEP0010: `crypto.createCredentials` {#dep0010-cryptocreatecredentials}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v11.0.0 | 寿命終了。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v0.11.13 | ランタイムでの非推奨。 |
:::

種類: 寿命終了

`crypto.createCredentials()` API は削除されました。代わりに [`tls.createSecureContext()`](/ja/nodejs/api/tls#tlscreatesecurecontextoptions) を使用してください。

### DEP0011: `crypto.Credentials` {#dep0011-cryptocredentials}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v11.0.0 | 寿命終了。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v0.11.13 | ランタイムでの非推奨。 |
:::

種類: 寿命終了

`crypto.Credentials` クラスは削除されました。代わりに [`tls.SecureContext`](/ja/nodejs/api/tls#tlscreatesecurecontextoptions) を使用してください。

### DEP0012: `Domain.dispose` {#dep0012-domaindispose}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v9.0.0 | 寿命終了。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v0.11.7 | ランタイムでの非推奨。 |
:::

種類: 寿命終了

`Domain.dispose()` は削除されました。代わりに、ドメインに設定されたエラーイベントハンドラーを介して、失敗した I/O アクションから明示的に回復してください。

### DEP0013: コールバックのない `fs` 非同期関数 {#dep0013-fs-asynchronous-function-without-callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | 寿命終了。 |
| v7.0.0 | ランタイムでの非推奨。 |
:::

種類: 寿命終了

コールバックなしで非同期関数を呼び出すと、Node.js 10.0.0 以降では `TypeError` がスローされます。 [https://github.com/nodejs/node/pull/12562](https://github.com/nodejs/node/pull/12562) を参照してください。

### DEP0014: `fs.read` レガシー String インターフェース {#dep0014-fsread-legacy-string-interface}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v8.0.0 | 寿命終了。 |
| v6.0.0 | ランタイムでの非推奨。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v0.1.96 | ドキュメントのみの非推奨。 |
:::

種類: 寿命終了

[`fs.read()`](/ja/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback) レガシー `String` インターフェースは非推奨です。ドキュメントに記載されているように、`Buffer` API を代わりに使用してください。

### DEP0015: `fs.readSync` レガシー String インターフェース {#dep0015-fsreadsync-legacy-string-interface}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v8.0.0 | 寿命終了。 |
| v6.0.0 | ランタイムでの非推奨。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v0.1.96 | ドキュメントのみの非推奨。 |
:::

種類: 寿命終了

[`fs.readSync()`](/ja/nodejs/api/fs#fsreadsyncfd-buffer-offset-length-position) レガシー `String` インターフェースは非推奨です。ドキュメントに記載されているように、`Buffer` API を代わりに使用してください。


### DEP0016: `GLOBAL`/`root` {#dep0016-global/root}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.0.0 | 寿命終了。 |
| v6.12.0 | 非推奨コードが割り当てられました。 |
| v6.0.0 | ランタイム非推奨。 |
:::

タイプ: 寿命終了

`global`プロパティのエイリアスである`GLOBAL`と`root`は、Node.js 6.0.0で非推奨となり、その後削除されました。

### DEP0017: `Intl.v8BreakIterator` {#dep0017-intlv8breakiterator}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v9.0.0 | 寿命終了。 |
| v7.0.0 | ランタイム非推奨。 |
:::

タイプ: 寿命終了

`Intl.v8BreakIterator`は非標準の拡張機能であり、削除されました。[`Intl.Segmenter`](https://github.com/tc39/proposal-intl-segmenter)を参照してください。

### DEP0018: 未処理の Promise のリジェクト {#dep0018-unhandled-promise-rejections}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.0.0 | 寿命終了。 |
| v7.0.0 | ランタイム非推奨。 |
:::

タイプ: 寿命終了

未処理の Promise のリジェクトは非推奨です。 デフォルトでは、処理されない Promise のリジェクトは、0 以外の終了コードで Node.js プロセスを終了させます。 Node.js が未処理のリジェクトをどのように扱うかを変更するには、[`--unhandled-rejections`](/ja/nodejs/api/cli#--unhandled-rejectionsmode) コマンドラインオプションを使用してください。

### DEP0019: `require('.')` がディレクトリ外で解決される {#dep0019-require-resolved-outside-directory}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.0.0 | 機能が削除されました。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v1.8.1 | ランタイム非推奨。 |
:::

タイプ: 寿命終了

特定の場合において、`require('.')`はパッケージディレクトリ外で解決される可能性がありました。 この挙動は削除されました。

### DEP0020: `Server.connections` {#dep0020-serverconnections}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.0.0 | Server.connections が削除されました。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v0.9.7 | ランタイム非推奨。 |
:::

タイプ: 寿命終了

`Server.connections`プロパティはNode.js v0.9.7で非推奨となり、削除されました。 代わりに[`Server.getConnections()`](/ja/nodejs/api/net#servergetconnectionscallback)メソッドを使用してください。

### DEP0021: `Server.listenFD` {#dep0021-serverlistenfd}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.0.0 | 寿命終了。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v0.7.12 | ランタイム非推奨。 |
:::

タイプ: 寿命終了

`Server.listenFD()`メソッドは非推奨となり、削除されました。 代わりに[`Server.listen({fd: \<number\>})`](/ja/nodejs/api/net#serverlistenhandle-backlog-callback)を使用してください。


### DEP0022: `os.tmpDir()` {#dep0022-ostmpdir}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.0.0 | 寿命終了。 |
| v7.0.0 | ランタイムでの非推奨。 |
:::

種類: 寿命終了

`os.tmpDir()` API は Node.js 7.0.0 で非推奨となり、その後削除されました。代わりに [`os.tmpdir()`](/ja/nodejs/api/os#ostmpdir) を使用してください。

### DEP0023: `os.getNetworkInterfaces()` {#dep0023-osgetnetworkinterfaces}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.0.0 | 寿命終了。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v0.6.0 | ランタイムでの非推奨。 |
:::

種類: 寿命終了

`os.getNetworkInterfaces()` メソッドは非推奨です。代わりに [`os.networkInterfaces()`](/ja/nodejs/api/os#osnetworkinterfaces) メソッドを使用してください。

### DEP0024: `REPLServer.prototype.convertToContext()` {#dep0024-replserverprototypeconverttocontext}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v9.0.0 | 寿命終了。 |
| v7.0.0 | ランタイムでの非推奨。 |
:::

種類: 寿命終了

`REPLServer.prototype.convertToContext()` API は削除されました。

### DEP0025: `require('node:sys')` {#dep0025-requirenodesys}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v1.0.0 | ランタイムでの非推奨。 |
:::

種類: ランタイム

`node:sys` モジュールは非推奨です。代わりに [`util`](/ja/nodejs/api/util) モジュールを使用してください。

### DEP0026: `util.print()` {#dep0026-utilprint}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.0.0 | 寿命終了。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v0.11.3 | ランタイムでの非推奨。 |
:::

種類: 寿命終了

`util.print()` は削除されました。代わりに [`console.log()`](/ja/nodejs/api/console#consolelogdata-args) を使用してください。

### DEP0027: `util.puts()` {#dep0027-utilputs}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.0.0 | 寿命終了。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v0.11.3 | ランタイムでの非推奨。 |
:::

種類: 寿命終了

`util.puts()` は削除されました。代わりに [`console.log()`](/ja/nodejs/api/console#consolelogdata-args) を使用してください。

### DEP0028: `util.debug()` {#dep0028-utildebug}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.0.0 | 寿命終了。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v0.11.3 | ランタイムでの非推奨。 |
:::

種類: 寿命終了

`util.debug()` は削除されました。代わりに [`console.error()`](/ja/nodejs/api/console#consoleerrordata-args) を使用してください。


### DEP0029: `util.error()` {#dep0029-utilerror}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.0.0 | 寿命終了。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v0.11.3 | 実行時の非推奨。 |
:::

タイプ: 寿命終了

`util.error()` は削除されました。代わりに [`console.error()`](/ja/nodejs/api/console#consoleerrordata-args) を使用してください。

### DEP0030: `SlowBuffer` {#dep0030-slowbuffer}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v6.12.0 | 非推奨コードが割り当てられました。 |
| v6.0.0 | ドキュメントのみの非推奨。 |
:::

タイプ: ドキュメントのみ

[`SlowBuffer`](/ja/nodejs/api/buffer#class-slowbuffer) クラスは非推奨です。代わりに [`Buffer.allocUnsafeSlow(size)`](/ja/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) を使用してください。

### DEP0031: `ecdh.setPublicKey()` {#dep0031-ecdhsetpublickey}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v6.12.0 | 非推奨コードが割り当てられました。 |
| v5.2.0 | ドキュメントのみの非推奨。 |
:::

タイプ: ドキュメントのみ

[`ecdh.setPublicKey()`](/ja/nodejs/api/crypto#ecdhsetpublickeypublickey-encoding) メソッドは、API に含めることが有用ではないため、非推奨になりました。

### DEP0032: `node:domain` モジュール {#dep0032-nodedomain-module}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v1.4.2 | ドキュメントのみの非推奨。 |
:::

タイプ: ドキュメントのみ

[`domain`](/ja/nodejs/api/domain) モジュールは非推奨であり、使用すべきではありません。

### DEP0033: `EventEmitter.listenerCount()` {#dep0033-eventemitterlistenercount}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v3.2.0 | ドキュメントのみの非推奨。 |
:::

タイプ: ドキュメントのみ

[`events.listenerCount(emitter, eventName)`](/ja/nodejs/api/events#eventslistenercountemitter-eventname) API は非推奨です。代わりに [`emitter.listenerCount(eventName)`](/ja/nodejs/api/events#emitterlistenercounteventname-listener) を使用してください。

### DEP0034: `fs.exists(path, callback)` {#dep0034-fsexistspath-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v1.0.0 | ドキュメントのみの非推奨。 |
:::

タイプ: ドキュメントのみ

[`fs.exists(path, callback)`](/ja/nodejs/api/fs#fsexistspath-callback) API は非推奨です。代わりに [`fs.stat()`](/ja/nodejs/api/fs#fsstatpath-options-callback) または [`fs.access()`](/ja/nodejs/api/fs#fsaccesspath-mode-callback) を使用してください。


### DEP0035: `fs.lchmod(path, mode, callback)` {#dep0035-fslchmodpath-mode-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v0.4.7 | ドキュメントのみの非推奨。 |
:::

種類: ドキュメントのみ

[`fs.lchmod(path, mode, callback)`](/ja/nodejs/api/fs#fslchmodpath-mode-callback) API は非推奨です。

### DEP0036: `fs.lchmodSync(path, mode)` {#dep0036-fslchmodsyncpath-mode}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v0.4.7 | ドキュメントのみの非推奨。 |
:::

種類: ドキュメントのみ

[`fs.lchmodSync(path, mode)`](/ja/nodejs/api/fs#fslchmodsyncpath-mode) API は非推奨です。

### DEP0037: `fs.lchown(path, uid, gid, callback)` {#dep0037-fslchownpath-uid-gid-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.6.0 | 非推奨が取り消されました。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v0.4.7 | ドキュメントのみの非推奨。 |
:::

種類: 非推奨の取り消し

[`fs.lchown(path, uid, gid, callback)`](/ja/nodejs/api/fs#fslchownpath-uid-gid-callback) API は非推奨となりました。 必要なサポートAPIがlibuvに追加されたため、非推奨は取り消されました。

### DEP0038: `fs.lchownSync(path, uid, gid)` {#dep0038-fslchownsyncpath-uid-gid}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.6.0 | 非推奨が取り消されました。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v0.4.7 | ドキュメントのみの非推奨。 |
:::

種類: 非推奨の取り消し

[`fs.lchownSync(path, uid, gid)`](/ja/nodejs/api/fs#fslchownsyncpath-uid-gid) API は非推奨となりました。 必要なサポートAPIがlibuvに追加されたため、非推奨は取り消されました。

### DEP0039: `require.extensions` {#dep0039-requireextensions}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v0.10.6 | ドキュメントのみの非推奨。 |
:::

種類: ドキュメントのみ

[`require.extensions`](/ja/nodejs/api/modules#requireextensions) プロパティは非推奨です。

### DEP0040: `node:punycode` モジュール {#dep0040-nodepunycode-module}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v21.0.0 | ランタイムの非推奨。 |
| v16.6.0 | `--pending-deprecation` のサポートが追加されました。 |
| v7.0.0 | ドキュメントのみの非推奨。 |
:::

種類: ランタイム

[`punycode`](/ja/nodejs/api/punycode) モジュールは非推奨です。 代わりにユーザランドの代替手段を使用してください。


### DEP0041: `NODE_REPL_HISTORY_FILE` 環境変数 {#dep0041-node_repl_history_file-environment-variable}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v3.0.0 | ドキュメントのみの非推奨。 |
:::

種類: End-of-Life

`NODE_REPL_HISTORY_FILE` 環境変数は削除されました。代わりに `NODE_REPL_HISTORY` を使用してください。

### DEP0042: `tls.CryptoStream` {#dep0042-tlscryptostream}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v0.11.3 | ドキュメントのみの非推奨。 |
:::

種類: End-of-Life

[`tls.CryptoStream`](/ja/nodejs/api/tls#class-tlscryptostream) クラスは削除されました。代わりに [`tls.TLSSocket`](/ja/nodejs/api/tls#class-tlstlssocket) を使用してください。

### DEP0043: `tls.SecurePair` {#dep0043-tlssecurepair}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v8.0.0 | ランタイム非推奨。 |
| v6.12.0 | 非推奨コードが割り当てられました。 |
| v6.0.0 | ドキュメントのみの非推奨。 |
| v0.11.15 | 非推奨の取り消し。 |
| v0.11.3 | ランタイム非推奨。 |
:::

種類: ドキュメントのみ

[`tls.SecurePair`](/ja/nodejs/api/tls#class-tlssecurepair) クラスは非推奨です。代わりに [`tls.TLSSocket`](/ja/nodejs/api/tls#class-tlstlssocket) を使用してください。

### DEP0044: `util.isArray()` {#dep0044-utilisarray}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v22.0.0 | ランタイム非推奨。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v4.0.0, v3.3.1 | ドキュメントのみの非推奨。 |
:::

種類: ランタイム

[`util.isArray()`](/ja/nodejs/api/util#utilisarrayobject) API は非推奨です。代わりに `Array.isArray()` を使用してください。

### DEP0045: `util.isBoolean()` {#dep0045-utilisboolean}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v23.0.0 | End-of-Life 非推奨。 |
| v22.0.0 | ランタイム非推奨。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v4.0.0, v3.3.1 | ドキュメントのみの非推奨。 |
:::

種類: End-of-Life

`util.isBoolean()` API は削除されました。代わりに `typeof arg === 'boolean'` を使用してください。

### DEP0046: `util.isBuffer()` {#dep0046-utilisbuffer}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v23.0.0 | End-of-Life 非推奨。 |
| v22.0.0 | ランタイム非推奨。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v4.0.0, v3.3.1 | ドキュメントのみの非推奨。 |
:::

種類: End-of-Life

`util.isBuffer()` API は削除されました。代わりに [`Buffer.isBuffer()`](/ja/nodejs/api/buffer#static-method-bufferisbufferobj) を使用してください。


### DEP0047: `util.isDate()` {#dep0047-utilisdate}

::: info [履歴]
| Version | 変更点 |
| --- | --- |
| v23.0.0 | 寿命終了による非推奨化。 |
| v22.0.0 | ランタイムでの非推奨化。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v4.0.0, v3.3.1 | ドキュメントのみの非推奨化。 |
:::

Type: 寿命終了

`util.isDate()` API は削除されました。代わりに `arg instanceof Date` を使用してください。

### DEP0048: `util.isError()` {#dep0048-utiliserror}

::: info [履歴]
| Version | 変更点 |
| --- | --- |
| v23.0.0 | 寿命終了による非推奨化。 |
| v22.0.0 | ランタイムでの非推奨化。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v4.0.0, v3.3.1 | ドキュメントのみの非推奨化。 |
:::

Type: 寿命終了

`util.isError()` API は削除されました。代わりに `Object.prototype.toString(arg) === '[object Error]' || arg instanceof Error` を使用してください。

### DEP0049: `util.isFunction()` {#dep0049-utilisfunction}

::: info [履歴]
| Version | 変更点 |
| --- | --- |
| v23.0.0 | 寿命終了による非推奨化。 |
| v22.0.0 | ランタイムでの非推奨化。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v4.0.0, v3.3.1 | ドキュメントのみの非推奨化。 |
:::

Type: 寿命終了

`util.isFunction()` API は削除されました。代わりに `typeof arg === 'function'` を使用してください。

### DEP0050: `util.isNull()` {#dep0050-utilisnull}

::: info [履歴]
| Version | 変更点 |
| --- | --- |
| v23.0.0 | 寿命終了による非推奨化。 |
| v22.0.0 | ランタイムでの非推奨化。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v4.0.0, v3.3.1 | ドキュメントのみの非推奨化。 |
:::

Type: 寿命終了

`util.isNull()` API は削除されました。代わりに `arg === null` を使用してください。

### DEP0051: `util.isNullOrUndefined()` {#dep0051-utilisnullorundefined}

::: info [履歴]
| Version | 変更点 |
| --- | --- |
| v23.0.0 | 寿命終了による非推奨化。 |
| v22.0.0 | ランタイムでの非推奨化。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v4.0.0, v3.3.1 | ドキュメントのみの非推奨化。 |
:::

Type: 寿命終了

`util.isNullOrUndefined()` API は削除されました。代わりに `arg === null || arg === undefined` を使用してください。


### DEP0052: `util.isNumber()` {#dep0052-utilisnumber}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.0.0 | 寿命終了による非推奨化。 |
| v22.0.0 | ランタイムでの非推奨化。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v4.0.0, v3.3.1 | ドキュメントのみの非推奨化。 |
:::

タイプ: 寿命終了

`util.isNumber()` APIは削除されました。代わりに `typeof arg === 'number'` を使用してください。

### DEP0053: `util.isObject()` {#dep0053-utilisobject}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.0.0 | 寿命終了による非推奨化。 |
| v22.0.0 | ランタイムでの非推奨化。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v4.0.0, v3.3.1 | ドキュメントのみの非推奨化。 |
:::

タイプ: 寿命終了

`util.isObject()` APIは削除されました。代わりに `arg && typeof arg === 'object'` を使用してください。

### DEP0054: `util.isPrimitive()` {#dep0054-utilisprimitive}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.0.0 | 寿命終了による非推奨化。 |
| v22.0.0 | ランタイムでの非推奨化。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v4.0.0, v3.3.1 | ドキュメントのみの非推奨化。 |
:::

タイプ: 寿命終了

`util.isPrimitive()` APIは削除されました。代わりに `arg === null || (typeof arg !=='object' && typeof arg !== 'function')` を使用してください。

### DEP0055: `util.isRegExp()` {#dep0055-utilisregexp}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.0.0 | 寿命終了による非推奨化。 |
| v22.0.0 | ランタイムでの非推奨化。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v4.0.0, v3.3.1 | ドキュメントのみの非推奨化。 |
:::

タイプ: 寿命終了

`util.isRegExp()` APIは削除されました。代わりに `arg instanceof RegExp` を使用してください。

### DEP0056: `util.isString()` {#dep0056-utilisstring}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.0.0 | 寿命終了による非推奨化。 |
| v22.0.0 | ランタイムでの非推奨化。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v4.0.0, v3.3.1 | ドキュメントのみの非推奨化。 |
:::

タイプ: 寿命終了

`util.isString()` APIは削除されました。代わりに `typeof arg === 'string'` を使用してください。


### DEP0057: `util.isSymbol()` {#dep0057-utilissymbol}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v23.0.0 | 廃止終了。 |
| v22.0.0 | ランタイムでの非推奨。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v4.0.0, v3.3.1 | ドキュメントのみの非推奨。 |
:::

タイプ: 廃止終了

`util.isSymbol()` API は削除されました。代わりに `typeof arg === 'symbol'` を使用してください。

### DEP0058: `util.isUndefined()` {#dep0058-utilisundefined}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v23.0.0 | 廃止終了。 |
| v22.0.0 | ランタイムでの非推奨。 |
| v6.12.0, v4.8.6 | 非推奨コードが割り当てられました。 |
| v4.0.0, v3.3.1 | ドキュメントのみの非推奨。 |
:::

タイプ: 廃止終了

`util.isUndefined()` API は削除されました。代わりに `arg === undefined` を使用してください。

### DEP0059: `util.log()` {#dep0059-utillog}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v23.0.0 | 廃止終了。 |
| v22.0.0 | ランタイムでの非推奨。 |
| v6.12.0 | 非推奨コードが割り当てられました。 |
| v6.0.0 | ドキュメントのみの非推奨。 |
:::

タイプ: 廃止終了

`util.log()` API は、保守されていないレガシー API であり、誤ってユーザーランドに公開されたため削除されました。代わりに、特定のニーズに基づいて、次の代替手段を検討してください。

-  **サードパーティのロギングライブラリ**
-  **<code>console.log(new Date().toLocaleString(), message)</code> の使用**

これらの代替手段のいずれかを採用することで、`util.log()` から移行し、アプリケーションの特定の要件と複雑さに合わせたロギング戦略を選択できます。

### DEP0060: `util._extend()` {#dep0060-util_extend}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v22.0.0 | ランタイムでの非推奨。 |
| v6.12.0 | 非推奨コードが割り当てられました。 |
| v6.0.0 | ドキュメントのみの非推奨。 |
:::

タイプ: ランタイム

[`util._extend()`](/ja/nodejs/api/util#util_extendtarget-source) API は、保守されていないレガシー API であり、誤ってユーザーランドに公開されたため非推奨となりました。代わりに `target = Object.assign(target, source)` を使用してください。


### DEP0061: `fs.SyncWriteStream` {#dep0061-fssyncwritestream}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v11.0.0 | 寿命終了。 |
| v8.0.0 | ランタイムの非推奨。 |
| v7.0.0 | ドキュメントのみの非推奨。 |
:::

タイプ: 寿命終了

`fs.SyncWriteStream` クラスは、公開されている API として意図されたものではなく、削除されました。代替 API はありません。ユーザーランドの代替手段を使用してください。

### DEP0062: `node --debug` {#dep0062-node---debug}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.0.0 | 寿命終了。 |
| v8.0.0 | ランタイムの非推奨。 |
:::

タイプ: 寿命終了

`--debug` はレガシー V8 デバッガーインターフェースをアクティブにします。これは V8 5.8 で削除されました。代わりに `--inspect` でアクティブ化される Inspector に置き換えられています。

### DEP0063: `ServerResponse.prototype.writeHeader()` {#dep0063-serverresponseprototypewriteheader}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v8.0.0 | ドキュメントのみの非推奨。 |
:::

タイプ: ドキュメントのみ

`node:http` モジュールの `ServerResponse.prototype.writeHeader()` API は非推奨です。代わりに `ServerResponse.prototype.writeHead()` を使用してください。

`ServerResponse.prototype.writeHeader()` メソッドは、公式にサポートされている API としてドキュメント化されたことはありません。

### DEP0064: `tls.createSecurePair()` {#dep0064-tlscreatesecurepair}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v8.0.0 | ランタイムの非推奨。 |
| v6.12.0 | 非推奨コードが割り当てられました。 |
| v6.0.0 | ドキュメントのみの非推奨。 |
| v0.11.15 | 非推奨は取り消されました。 |
| v0.11.3 | ランタイムの非推奨。 |
:::

タイプ: ランタイム

`tls.createSecurePair()` API は、Node.js 0.11.3 のドキュメントで非推奨となりました。代わりに `tls.Socket` を使用する必要があります。

### DEP0065: `repl.REPL_MODE_MAGIC` および `NODE_REPL_MODE=magic` {#dep0065-replrepl_mode_magic-and-node_repl_mode=magic}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | 寿命終了。 |
| v8.0.0 | ドキュメントのみの非推奨。 |
:::

タイプ: 寿命終了

`node:repl` モジュールの `replMode` オプションに使用される `REPL_MODE_MAGIC` 定数は削除されました。V8 5.0 がインポートされた Node.js 6.0.0 以降、その動作は `REPL_MODE_SLOPPY` の動作と機能的に同一です。代わりに `REPL_MODE_SLOPPY` を使用してください。

`NODE_REPL_MODE` 環境変数は、インタラクティブな `node` セッションの基になる `replMode` を設定するために使用されます。その値 `magic` も削除されました。代わりに `sloppy` を使用してください。


### DEP0066: `OutgoingMessage.prototype._headers, OutgoingMessage.prototype._headerNames` {#dep0066-outgoingmessageprototype_headers-outgoingmessageprototype_headernames}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v12.0.0 | ランタイムでの非推奨化。 |
| v8.0.0 | ドキュメントのみの非推奨化。 |
:::

種類: ランタイム

`node:http` モジュールの `OutgoingMessage.prototype._headers` および `OutgoingMessage.prototype._headerNames` プロパティは非推奨です。送信ヘッダーを操作するには、パブリックメソッド（`OutgoingMessage.prototype.getHeader()`、`OutgoingMessage.prototype.getHeaders()`、`OutgoingMessage.prototype.getHeaderNames()`、`OutgoingMessage.prototype.getRawHeaderNames()`、`OutgoingMessage.prototype.hasHeader()`、`OutgoingMessage.prototype.removeHeader()`、`OutgoingMessage.prototype.setHeader()` など）のいずれかを使用してください。

`OutgoingMessage.prototype._headers` および `OutgoingMessage.prototype._headerNames` プロパティは、公式にサポートされているプロパティとして文書化されたことはありません。

### DEP0067: `OutgoingMessage.prototype._renderHeaders` {#dep0067-outgoingmessageprototype_renderheaders}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v8.0.0 | ドキュメントのみの非推奨化。 |
:::

種類: ドキュメントのみ

`node:http` モジュールの `OutgoingMessage.prototype._renderHeaders()` API は非推奨です。

`OutgoingMessage.prototype._renderHeaders` プロパティは、公式にサポートされている API として文書化されたことはありません。

### DEP0068: `node debug` {#dep0068-node-debug}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v15.0.0 | レガシーな `node debug` コマンドは削除されました。 |
| v8.0.0 | ランタイムでの非推奨化。 |
:::

種類: 寿命終了

`node debug` はレガシーな CLI デバッガーに対応しており、`node inspect` を通じて利用できる V8 インスペクターベースの CLI デバッガーに置き換えられました。

### DEP0069: `vm.runInDebugContext(string)` {#dep0069-vmrunindebugcontextstring}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | 寿命終了。 |
| v9.0.0 | ランタイムでの非推奨化。 |
| v8.0.0 | ドキュメントのみの非推奨化。 |
:::

種類: 寿命終了

DebugContext は V8 で削除され、Node.js 10 以降では利用できません。

DebugContext は実験的な API でした。

### DEP0070: `async_hooks.currentId()` {#dep0070-async_hookscurrentid}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v9.0.0 | 寿命終了。 |
| v8.2.0 | ランタイムでの非推奨化。 |
:::

種類: 寿命終了

`async_hooks.currentId()` は、明確にするために `async_hooks.executionAsyncId()` に名前が変更されました。

この変更は、`async_hooks` が実験的な API であったときに行われました。


### DEP0071: `async_hooks.triggerId()` {#dep0071-async_hookstriggerid}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v9.0.0 | 寿命終了。 |
| v8.2.0 | ランタイム廃止。 |
:::

種類: 寿命終了

`async_hooks.triggerId()` は、明確にするために `async_hooks.triggerAsyncId()` に名前が変更されました。

この変更は、`async_hooks` が実験的な API であった間に行われました。

### DEP0072: `async_hooks.AsyncResource.triggerId()` {#dep0072-async_hooksasyncresourcetriggerid}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v9.0.0 | 寿命終了。 |
| v8.2.0 | ランタイム廃止。 |
:::

種類: 寿命終了

`async_hooks.AsyncResource.triggerId()` は、明確にするために `async_hooks.AsyncResource.triggerAsyncId()` に名前が変更されました。

この変更は、`async_hooks` が実験的な API であった間に行われました。

### DEP0073: `net.Server` のいくつかの内部プロパティ {#dep0073-several-internal-properties-of-netserver}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | 寿命終了。 |
| v9.0.0 | ランタイム廃止。 |
:::

種類: 寿命終了

不適切な名前を持つ `net.Server` インスタンスのいくつかの内部的な、ドキュメント化されていないプロパティへのアクセスは非推奨となりました。

元の API はドキュメント化されておらず、通常は非内部コードには役に立たないため、代替 API は提供されません。

### DEP0074: `REPLServer.bufferedCommand` {#dep0074-replserverbufferedcommand}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v15.0.0 | 寿命終了。 |
| v9.0.0 | ランタイム廃止。 |
:::

種類: 寿命終了

`REPLServer.bufferedCommand` プロパティは、[`REPLServer.clearBufferedCommand()`](/ja/nodejs/api/repl#replserverclearbufferedcommand) を優先して非推奨となりました。

### DEP0075: `REPLServer.parseREPLKeyword()` {#dep0075-replserverparsereplkeyword}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v15.0.0 | 寿命終了。 |
| v9.0.0 | ランタイム廃止。 |
:::

種類: 寿命終了

`REPLServer.parseREPLKeyword()` は、ユーザーランドの可視性から削除されました。

### DEP0076: `tls.parseCertString()` {#dep0076-tlsparsecertstring}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | 寿命終了。 |
| v9.0.0 | ランタイム廃止。 |
| v8.6.0 | ドキュメントのみの廃止。 |
:::

種類: 寿命終了

`tls.parseCertString()` は、誤って公開された単純な解析ヘルパーでした。証明書のサブジェクトと発行者の文字列を解析することになっていましたが、マルチバリューの相対識別名を正しく処理することはありませんでした。

このドキュメントの以前のバージョンでは、`tls.parseCertString()` の代替として `querystring.parse()` を使用することを推奨していました。ただし、`querystring.parse()` もすべての証明書のサブジェクトを正しく処理できるわけではないため、使用すべきではありません。


### DEP0077: `Module._debug()` {#dep0077-module_debug}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v9.0.0 | ランタイムの非推奨。 |
:::

タイプ: ランタイム

`Module._debug()` は非推奨です。

`Module._debug()` 関数は、公式にサポートされている API として文書化されたことはありません。

### DEP0078: `REPLServer.turnOffEditorMode()` {#dep0078-replserverturnoffeditormode}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v15.0.0 | 寿命終了。 |
| v9.0.0 | ランタイムの非推奨。 |
:::

タイプ: 寿命終了

`REPLServer.turnOffEditorMode()` はユーザーランドの可視性から削除されました。

### DEP0079: オブジェクトのカスタム検査関数(`.inspect()`経由) {#dep0079-custom-inspection-function-on-objects-via-inspect}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v11.0.0 | 寿命終了。 |
| v10.0.0 | ランタイムの非推奨。 |
| v8.7.0 | ドキュメントのみの非推奨。 |
:::

タイプ: 寿命終了

オブジェクトの `inspect` という名前のプロパティを使用して [`util.inspect()`](/ja/nodejs/api/util#utilinspectobject-options) のカスタム検査関数を指定することは非推奨です。代わりに [`util.inspect.custom`](/ja/nodejs/api/util#utilinspectcustom) を使用してください。バージョン 6.4.0 より前の Node.js との下位互換性のために、両方を指定できます。

### DEP0080: `path._makeLong()` {#dep0080-path_makelong}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v9.0.0 | ドキュメントのみの非推奨。 |
:::

タイプ: ドキュメントのみ

内部 `path._makeLong()` は、一般公開を意図したものではありませんでした。ただし、ユーザーランドモジュールはそれが有用であることを見つけました。内部 API は非推奨となり、同一の公開 `path.toNamespacedPath()` メソッドに置き換えられました。

### DEP0081: ファイルディスクリプタを使用した `fs.truncate()` {#dep0081-fstruncate-using-a-file-descriptor}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v9.0.0 | ランタイムの非推奨。 |
:::

タイプ: ランタイム

`fs.truncate()` `fs.truncateSync()` のファイルディスクリプタ付きの使用は非推奨です。ファイルディスクリプタを扱うには、`fs.ftruncate()` または `fs.ftruncateSync()` を使用してください。

### DEP0082: `REPLServer.prototype.memory()` {#dep0082-replserverprototypememory}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v15.0.0 | 寿命終了。 |
| v9.0.0 | ランタイムの非推奨。 |
:::

タイプ: 寿命終了

`REPLServer.prototype.memory()` は、`REPLServer` 自体の内部メカニズムにのみ必要です。この関数を使用しないでください。


### DEP0083: `ecdhCurve` を `false` に設定して ECDH を無効にする {#dep0083-disabling-ecdh-by-setting-ecdhcurve-to-false}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | サポート終了。 |
| v9.2.0 | ランタイムでの非推奨化。 |
:::

Type: サポート終了。

`tls.createSecureContext()` および `tls.TLSSocket` の `ecdhCurve` オプションは、サーバー上でのみ ECDH を完全に無効にするために `false` に設定できました。 このモードは、OpenSSL 1.1.0 への移行およびクライアントとの整合性を図るために非推奨となり、現在はサポートされていません。 代わりに `ciphers` パラメーターを使用してください。

### DEP0084: バンドルされた内部依存関係を要求する {#dep0084-requiring-bundled-internal-dependencies}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v12.0.0 | この機能は削除されました。 |
| v10.0.0 | ランタイムでの非推奨化。 |
:::

Type: サポート終了

Node.js バージョン 4.4.0 および 5.2.0 以降、内部使用のみを目的としたいくつかのモジュールが、誤って `require()` を通してユーザーコードに公開されていました。 これらのモジュールは次のとおりです。

- `v8/tools/codemap`
- `v8/tools/consarray`
- `v8/tools/csvparser`
- `v8/tools/logreader`
- `v8/tools/profile_view`
- `v8/tools/profile`
- `v8/tools/SourceMap`
- `v8/tools/splaytree`
- `v8/tools/tickprocessor-driver`
- `v8/tools/tickprocessor`
- `node-inspect/lib/_inspect` (7.6.0 以降)
- `node-inspect/lib/internal/inspect_client` (7.6.0 以降)
- `node-inspect/lib/internal/inspect_repl` (7.6.0 以降)

`v8/*` モジュールにはエクスポートがなく、特定の順序でインポートされない場合、実際にはエラーが発生します。 そのため、`require()` を介してインポートする正当なユースケースはほとんどありません。

一方、`node-inspect` は、同じ名前で npm レジストリで公開されているため、パッケージマネージャーを介してローカルにインストールできます。 その場合、ソースコードの変更は必要ありません。

### DEP0085: AsyncHooks センシティブ API {#dep0085-asynchooks-sensitive-api}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | サポート終了。 |
| v9.4.0, v8.10.0 | ランタイムでの非推奨化。 |
:::

Type: サポート終了

AsyncHooks センシティブ API は文書化されておらず、さまざまな小さな問題がありました。 代わりに `AsyncResource` API を使用してください。 [https://github.com/nodejs/node/issues/15572](https://github.com/nodejs/node/issues/15572) を参照してください。


### DEP0086: `runInAsyncIdScope` の削除 {#dep0086-remove-runinasyncidscope}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | 寿命終了。 |
| v9.4.0, v8.10.0 | ランタイムでの非推奨。 |
:::

種類: 寿命終了

`runInAsyncIdScope` は `'before'` や `'after'` イベントを発行しないため、多くの問題を引き起こす可能性があります。[https://github.com/nodejs/node/issues/14328](https://github.com/nodejs/node/issues/14328) を参照してください。

### DEP0089: `require('node:assert')` {#dep0089-requirenodeassert}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.8.0 | 非推奨を取り消し。 |
| v9.9.0, v8.13.0 | ドキュメントのみの非推奨。 |
:::

種類: 非推奨を取り消し

assert を直接インポートすることは、公開された関数が緩い等価性チェックを使用するため推奨されていませんでした。`node:assert` モジュールの使用は推奨されておらず、非推奨は開発者の混乱を招いたため、非推奨は取り消されました。

### DEP0090: 無効な GCM 認証タグ長 {#dep0090-invalid-gcm-authentication-tag-lengths}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v11.0.0 | 寿命終了。 |
| v10.0.0 | ランタイムでの非推奨。 |
:::

種類: 寿命終了

Node.js は、[`decipher.setAuthTag()`](/ja/nodejs/api/crypto#deciphersetauthtagbuffer-encoding) の呼び出し時に OpenSSL で受け入れられるすべての GCM 認証タグ長をサポートしていました。Node.js v11.0.0 以降では、128、120、112、104、96、64、および 32 ビットの認証タグ長のみが許可されます。その他の長さの認証タグは、[NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf) に準拠して無効です。

### DEP0091: `crypto.DEFAULT_ENCODING` {#dep0091-cryptodefault_encoding}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v20.0.0 | 寿命終了。 |
| v10.0.0 | ランタイムでの非推奨。 |
:::

種類: 寿命終了

`crypto.DEFAULT_ENCODING` プロパティは、バージョン 0.9.3 より前の Node.js リリースとの互換性のためだけに存在し、削除されました。

### DEP0092: トップレベルの `this` が `module.exports` にバインドされる {#dep0092-top-level-this-bound-to-moduleexports}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | ドキュメントのみの非推奨。 |
:::

種類: ドキュメントのみ

`module.exports` の代替としてトップレベルの `this` にプロパティを割り当てることは非推奨です。開発者は代わりに `exports` または `module.exports` を使用する必要があります。


### DEP0093: `crypto.fips` は非推奨となり、代替手段が提供されました {#dep0093-cryptofips-is-deprecated-and-replaced}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.0.0 | ランタイムの非推奨。 |
| v10.0.0 | ドキュメントのみの非推奨。 |
:::

種類: ランタイム

[`crypto.fips`](/ja/nodejs/api/crypto#cryptofips) プロパティは非推奨です。代わりに `crypto.setFips()` および `crypto.getFips()` を使用してください。

### DEP0094: 複数の引数を持つ `assert.fail()` の使用 {#dep0094-using-assertfail-with-more-than-one-argument}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | ランタイムの非推奨。 |
:::

種類: ランタイム

複数の引数を持つ `assert.fail()` の使用は非推奨です。引数を1つだけ持つ `assert.fail()` を使用するか、別の `node:assert` モジュールメソッドを使用してください。

### DEP0095: `timers.enroll()` {#dep0095-timersenroll}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | ランタイムの非推奨。 |
:::

種類: ランタイム

`timers.enroll()` は非推奨です。代わりに、公開ドキュメント化されている [`setTimeout()`](/ja/nodejs/api/timers#settimeoutcallback-delay-args) または [`setInterval()`](/ja/nodejs/api/timers#setintervalcallback-delay-args) を使用してください。

### DEP0096: `timers.unenroll()` {#dep0096-timersunenroll}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | ランタイムの非推奨。 |
:::

種類: ランタイム

`timers.unenroll()` は非推奨です。代わりに、公開ドキュメント化されている [`clearTimeout()`](/ja/nodejs/api/timers#cleartimeouttimeout) または [`clearInterval()`](/ja/nodejs/api/timers#clearintervaltimeout) を使用してください。

### DEP0097: `domain` プロパティを持つ `MakeCallback` {#dep0097-makecallback-with-domain-property}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | ランタイムの非推奨。 |
:::

種類: ランタイム

コンテキストを伝達するために `domain` プロパティを追加する `MakeCallback` のユーザーは、`MakeCallback` または `CallbackScope` の `async_context` バリアント、または高レベルの `AsyncResource` クラスの使用を開始する必要があります。

### DEP0098: AsyncHooks エンベッダー `AsyncResource.emitBefore` および `AsyncResource.emitAfter` API {#dep0098-asynchooks-embedder-asyncresourceemitbefore-and-asyncresourceemitafter-apis}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v12.0.0 | 寿命終了。 |
| v10.0.0, v9.6.0, v8.12.0 | ランタイムの非推奨。 |
:::

種類: 寿命終了

AsyncHooks によって提供される埋め込み API は、誤って使用すると回復不能なエラーにつながる可能性が非常に高い `.emitBefore()` および `.emitAfter()` メソッドを公開します。

代わりに、より安全で便利な代替手段を提供する [`asyncResource.runInAsyncScope()`](/ja/nodejs/api/async_context#asyncresourceruninasyncscopefn-thisarg-args) API を使用してください。[https://github.com/nodejs/node/pull/18513](https://github.com/nodejs/node/pull/18513) を参照してください。


### DEP0099: Async context-unaware `node::MakeCallback` C++ APIs {#dep0099-async-context-unaware-nodemakecallback-c-apis}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | コンパイル時非推奨。 |
:::

種類: コンパイル時

ネイティブアドオンで利用可能な特定のバージョンの `node::MakeCallback` API は非推奨です。`async_context` パラメーターを受け入れる API のバージョンを使用してください。

### DEP0100: `process.assert()` {#dep0100-processassert}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.0.0 | 寿命終了。 |
| v10.0.0 | ランタイム非推奨。 |
| v0.3.7 | ドキュメントのみの非推奨。 |
:::

種類: 寿命終了

`process.assert()` は非推奨です。代わりに [`assert`](/ja/nodejs/api/assert) モジュールを使用してください。

これはドキュメント化された機能ではありませんでした。

### DEP0101: `--with-lttng` {#dep0101---with-lttng}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | 寿命終了。 |
:::

種類: 寿命終了

`--with-lttng` コンパイル時オプションは削除されました。

### DEP0102: `Buffer#(read|write)` 操作での `noAssert` の使用 {#dep0102-using-noassert-in-bufferread|write-operations}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | 寿命終了。 |
:::

種類: 寿命終了

`noAssert` 引数の使用は、もはや機能しません。すべての入力は `noAssert` の値に関係なく検証されます。検証をスキップすると、見つけにくいエラーやクラッシュにつながる可能性があります。

### DEP0103: `process.binding('util').is[...]` 型チェック {#dep0103-processbindingutilis-typechecks}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.9.0 | [DEP0111](/ja/nodejs/api/deprecations#DEP0111) に置き換えられました。 |
| v10.0.0 | ドキュメントのみの非推奨。 |
:::

種類: ドキュメントのみ ([`--pending-deprecation`](/ja/nodejs/api/cli#--pending-deprecation) をサポート)

一般的に `process.binding()` の使用は避けるべきです。特に型チェックメソッドは、[`util.types`](/ja/nodejs/api/util#utiltypes) を使用することで置き換えることができます。

この非推奨は、`process.binding()` API の非推奨 ([DEP0111](/ja/nodejs/api/deprecations#DEP0111)) に置き換えられました。

### DEP0104: `process.env` 文字列強制 {#dep0104-processenv-string-coercion}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | ドキュメントのみの非推奨。 |
:::

種類: ドキュメントのみ ([`--pending-deprecation`](/ja/nodejs/api/cli#--pending-deprecation) をサポート)

文字列以外のプロパティを [`process.env`](/ja/nodejs/api/process#processenv) に割り当てる場合、割り当てられた値は暗黙的に文字列に変換されます。割り当てられた値が文字列、ブール値、または数値ではない場合、この動作は非推奨となります。将来的には、このような割り当てはエラーをスローする可能性があります。`process.env` に割り当てる前に、プロパティを文字列に変換してください。


### DEP0105: `decipher.finaltol` {#dep0105-decipherfinaltol}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v11.0.0 | 寿命終了。 |
| v10.0.0 | ランタイムでの非推奨。 |
:::

型: 寿命終了

`decipher.finaltol()` はドキュメント化されたことがなく、[`decipher.final()`](/ja/nodejs/api/crypto#decipherfinaloutputencoding) のエイリアスでした。このAPIは削除されました。代わりに [`decipher.final()`](/ja/nodejs/api/crypto#decipherfinaloutputencoding) を使用することをお勧めします。

### DEP0106: `crypto.createCipher` と `crypto.createDecipher` {#dep0106-cryptocreatecipher-and-cryptocreatedecipher}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v22.0.0 | 寿命終了。 |
| v11.0.0 | ランタイムでの非推奨。 |
| v10.0.0 | ドキュメントのみの非推奨。 |
:::

型: 寿命終了

`crypto.createCipher()` と `crypto.createDecipher()` は、弱い鍵導出関数（ソルトなしの MD5）と静的な初期化ベクトルを使用するため削除されました。ランダムなソルトを使用して [`crypto.pbkdf2()`](/ja/nodejs/api/crypto#cryptopbkdf2password-salt-iterations-keylen-digest-callback) または [`crypto.scrypt()`](/ja/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) を使用して鍵を導出し、[`crypto.createCipheriv()`](/ja/nodejs/api/crypto#cryptocreatecipherivalgorithm-key-iv-options) および [`crypto.createDecipheriv()`](/ja/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) を使用して [`Cipher`](/ja/nodejs/api/crypto#class-cipher) および [`Decipher`](/ja/nodejs/api/crypto#class-decipher) オブジェクトをそれぞれ取得することをお勧めします。

### DEP0107: `tls.convertNPNProtocols()` {#dep0107-tlsconvertnpnprotocols}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v11.0.0 | 寿命終了。 |
| v10.0.0 | ランタイムでの非推奨。 |
:::

型: 寿命終了

これは Node.js コアの外部での使用を意図していない、ドキュメント化されていないヘルパー関数であり、NPN (Next Protocol Negotiation) サポートの削除により廃止されました。

### DEP0108: `zlib.bytesRead` {#dep0108-zlibbytesread}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v23.0.0 | 寿命終了。 |
| v11.0.0 | ランタイムでの非推奨。 |
| v10.0.0 | ドキュメントのみの非推奨。 |
:::

型: 寿命終了

[`zlib.bytesWritten`](/ja/nodejs/api/zlib#zlibbyteswritten) の非推奨のエイリアス。この元の名前は、エンジンによって読み取られたバイト数として値を解釈することもできるため選択されましたが、これらの名前で値を公開する Node.js の他のストリームと一貫性がありません。


### DEP0109: 無効な URL に対する `http`、`https`、および `tls` のサポート {#dep0109-http-https-and-tls-support-for-invalid-urls}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.0.0 | サポート終了。 |
| v11.0.0 | ランタイムでの非推奨。 |
:::

種類: サポート終了

一部の以前にサポートされていた (ただし厳密には無効な) URL は、レガシーの `url.parse()` API で受け入れられていたため、[`http.request()`](/ja/nodejs/api/http#httprequestoptions-callback)、[`http.get()`](/ja/nodejs/api/http#httpgetoptions-callback)、[`https.request()`](/ja/nodejs/api/https#httpsrequestoptions-callback)、[`https.get()`](/ja/nodejs/api/https#httpsgetoptions-callback)、および [`tls.checkServerIdentity()`](/ja/nodejs/api/tls#tlscheckserveridentityhostname-cert) API で受け入れられていました。言及された API は、厳密に有効な URL を必要とする WHATWG URL パーサーを使用するようになりました。無効な URL を渡すことは非推奨であり、サポートは将来削除されます。

### DEP0110: `vm.Script` キャッシュされたデータ {#dep0110-vmscript-cached-data}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.6.0 | ドキュメントのみの非推奨。 |
:::

種類: ドキュメントのみ

`produceCachedData` オプションは非推奨です。代わりに [`script.createCachedData()`](/ja/nodejs/api/vm#scriptcreatecacheddata) を使用してください。

### DEP0111: `process.binding()` {#dep0111-processbinding}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v11.12.0 | `--pending-deprecation` のサポートを追加。 |
| v10.9.0 | ドキュメントのみの非推奨。 |
:::

種類: ドキュメントのみ ([`--pending-deprecation`](/ja/nodejs/api/cli#--pending-deprecation) をサポート)

`process.binding()` は、Node.js の内部コード専用です。

`process.binding()` は一般的にサポート終了ステータスに達していませんが、[パーミッションモデル](/ja/nodejs/api/permissions#permission-model) が有効になっている場合は使用できません。

### DEP0112: `dgram` プライベート API {#dep0112-dgram-private-apis}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v11.0.0 | ランタイムでの非推奨。 |
:::

種類: ランタイム

`node:dgram` モジュールには、以前、Node.js コアの外部からアクセスすることを意図していなかった API がいくつか含まれていました: `Socket.prototype._handle`, `Socket.prototype._receiving`, `Socket.prototype._bindState`, `Socket.prototype._queue`, `Socket.prototype._reuseAddr`, `Socket.prototype._healthCheck()`, `Socket.prototype._stopReceiving()`, および `dgram._createSocketHandle()`。


### DEP0113: `Cipher.setAuthTag()`, `Decipher.getAuthTag()` {#dep0113-ciphersetauthtag-deciphergetauthtag}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v11.0.0 | ランタイムでの非推奨化。 |
:::

タイプ: End-of-Life

`Cipher.setAuthTag()` と `Decipher.getAuthTag()` は利用できなくなりました。 これらはドキュメント化されておらず、呼び出すと例外をスローしていました。

### DEP0114: `crypto._toBuf()` {#dep0114-crypto_tobuf}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v11.0.0 | ランタイムでの非推奨化。 |
:::

タイプ: End-of-Life

`crypto._toBuf()` 関数は、Node.js コア以外のモジュールで使用することを意図しておらず、削除されました。

### DEP0115: `crypto.prng()`, `crypto.pseudoRandomBytes()`, `crypto.rng()` {#dep0115-cryptoprng-cryptopseudorandombytes-cryptorng}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v11.0.0 | `--pending-deprecation` サポートによるドキュメントのみの非推奨化を追加。 |
:::

タイプ: ドキュメントのみ ([`--pending-deprecation`](/ja/nodejs/api/cli#--pending-deprecation) をサポート)

最近のバージョンの Node.js では、[`crypto.randomBytes()`](/ja/nodejs/api/crypto#cryptorandombytessize-callback) と `crypto.pseudoRandomBytes()` に違いはありません。 後者は、ドキュメント化されていないエイリアス `crypto.prng()` および `crypto.rng()` とともに非推奨となり、[`crypto.randomBytes()`](/ja/nodejs/api/crypto#cryptorandombytessize-callback) が推奨され、将来のリリースで削除される可能性があります。

### DEP0116: レガシー URL API {#dep0116-legacy-url-api}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.0.0, v18.13.0 | `url.parse()` は DEP0169 で再び非推奨になりました。 |
| v15.13.0, v14.17.0 | 非推奨化を撤回。 ステータスを "Legacy" に変更。 |
| v11.0.0 | ドキュメントのみの非推奨化。 |
:::

タイプ: 非推奨化を撤回

[レガシー URL API](/ja/nodejs/api/url#legacy-url-api) は非推奨です。 これには、[`url.format()`](/ja/nodejs/api/url#urlformaturlobject)、[`url.parse()`](/ja/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost)、[`url.resolve()`](/ja/nodejs/api/url#urlresolvefrom-to)、および[レガシー `urlObject`](/ja/nodejs/api/url#legacy-urlobject) が含まれます。 代わりに、[WHATWG URL API](/ja/nodejs/api/url#the-whatwg-url-api) を使用してください。


### DEP0117: ネイティブ暗号ハンドル {#dep0117-native-crypto-handles}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v12.0.0 | 寿命終了。 |
| v11.0.0 | ランタイム非推奨。 |
:::

タイプ: 寿命終了

以前のバージョンの Node.js では、`Cipher`、`Decipher`、`DiffieHellman`、`DiffieHellmanGroup`、`ECDH`、`Hash`、`Hmac`、`Sign`、および `Verify` クラスの `_handle` プロパティを介して、内部ネイティブオブジェクトへのハンドルを公開していました。 ネイティブオブジェクトの不適切な使用はアプリケーションのクラッシュにつながる可能性があるため、`_handle` プロパティは削除されました。

### DEP0118: falsy なホスト名に対する `dns.lookup()` のサポート {#dep0118-dnslookup-support-for-a-falsy-host-name}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v11.0.0 | ランタイム非推奨。 |
:::

タイプ: ランタイム

以前のバージョンの Node.js では、下位互換性のために `dns.lookup(false)` のように falsy なホスト名を持つ `dns.lookup()` をサポートしていました。 この動作はドキュメント化されておらず、実際のアプリケーションでは使用されていないと考えられています。 今後のバージョンの Node.js ではエラーになります。

### DEP0119: `process.binding('uv').errname()` プライベート API {#dep0119-processbindinguverrname-private-api}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v11.0.0 | ドキュメントのみの非推奨。 |
:::

タイプ: ドキュメントのみ ([`--pending-deprecation`](/ja/nodejs/api/cli#--pending-deprecation) をサポート)

`process.binding('uv').errname()` は非推奨になりました。 代わりに [`util.getSystemErrorName()`](/ja/nodejs/api/util#utilgetsystemerrornameerr) を使用してください。

### DEP0120: Windows パフォーマンスカウンタのサポート {#dep0120-windows-performance-counter-support}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v12.0.0 | 寿命終了。 |
| v11.0.0 | ランタイム非推奨。 |
:::

タイプ: 寿命終了

Windows パフォーマンスカウンタのサポートが Node.js から削除されました。 ドキュメント化されていない `COUNTER_NET_SERVER_CONNECTION()`、`COUNTER_NET_SERVER_CONNECTION_CLOSE()`、`COUNTER_HTTP_SERVER_REQUEST()`、`COUNTER_HTTP_SERVER_RESPONSE()`、`COUNTER_HTTP_CLIENT_REQUEST()`、および `COUNTER_HTTP_CLIENT_RESPONSE()` 関数は非推奨になりました。

### DEP0121: `net._setSimultaneousAccepts()` {#dep0121-net_setsimultaneousaccepts}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v12.0.0 | ランタイム非推奨。 |
:::

タイプ: ランタイム

ドキュメント化されていない `net._setSimultaneousAccepts()` 関数は、元々 Windows で `node:child_process` および `node:cluster` モジュールを使用する際のデバッグとパフォーマンス調整を目的としていました。 この関数は一般的には有用ではなく、削除されています。 こちらの議論を参照してください: [https://github.com/nodejs/node/issues/18391](https://github.com/nodejs/node/issues/18391)


### DEP0122: `tls` `Server.prototype.setOptions()` {#dep0122-tls-serverprototypesetoptions}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.0.0 | ランタイムの非推奨。 |
:::

種類: ランタイム

代わりに `Server.prototype.setSecureContext()` を使用してください。

### DEP0123: TLS ServerName に IP アドレスを設定する {#dep0123-setting-the-tls-servername-to-an-ip-address}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.0.0 | ランタイムの非推奨。 |
:::

種類: ランタイム

TLS ServerName に IP アドレスを設定することは、[RFC 6066](https://tools.ietf.org/html/rfc6066#section-3) で許可されていません。これは将来のバージョンで無視されます。

### DEP0124: `REPLServer.rli` の使用 {#dep0124-using-replserverrli}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.0.0 | 寿命終了。 |
| v12.0.0 | ランタイムの非推奨。 |
:::

種類: 寿命終了

このプロパティは、インスタンス自体への参照です。

### DEP0125: `require('node:_stream_wrap')` {#dep0125-requirenode_stream_wrap}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.0.0 | ランタイムの非推奨。 |
:::

種類: ランタイム

`node:_stream_wrap` モジュールは非推奨です。

### DEP0126: `timers.active()` {#dep0126-timersactive}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v11.14.0 | ランタイムの非推奨。 |
:::

種類: ランタイム

以前はドキュメント化されていなかった `timers.active()` は非推奨です。代わりに、公開されている [`timeout.refresh()`](/ja/nodejs/api/timers#timeoutrefresh) を使用してください。タイムアウトを再度参照する必要がある場合は、Node.js 10 以降はパフォーマンスに影響を与えずに [`timeout.ref()`](/ja/nodejs/api/timers#timeoutref) を使用できます。

### DEP0127: `timers._unrefActive()` {#dep0127-timers_unrefactive}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v11.14.0 | ランタイムの非推奨。 |
:::

種類: ランタイム

以前はドキュメント化されていなかった "private" な `timers._unrefActive()` は非推奨です。代わりに、公開されている [`timeout.refresh()`](/ja/nodejs/api/timers#timeoutrefresh) を使用してください。タイムアウトの参照を解除する必要がある場合は、Node.js 10 以降はパフォーマンスに影響を与えずに [`timeout.unref()`](/ja/nodejs/api/timers#timeoutunref) を使用できます。

### DEP0128: 無効な `main` エントリと `index.js` ファイルを持つモジュール {#dep0128-modules-with-an-invalid-main-entry-and-an-indexjs-file}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.0.0 | ランタイムの非推奨。 |
| v12.0.0 | ドキュメントのみ。 |
:::

種類: ランタイム

無効な `main` エントリ (例: `./does-not-exist.js`) を持ち、トップレベルディレクトリに `index.js` ファイルもあるモジュールは、`index.js` ファイルを解決します。これは非推奨であり、将来の Node.js バージョンではエラーをスローします。


### DEP0129: `ChildProcess._channel` {#dep0129-childprocess_channel}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v13.0.0 | ランタイムでの非推奨化。 |
| v11.14.0 | ドキュメントのみ。 |
:::

タイプ: ランタイム

`spawn()` や類似の関数によって返される子プロセスオブジェクトの `_channel` プロパティは、パブリックでの使用を意図していません。代わりに `ChildProcess.channel` を使用してください。

### DEP0130: `Module.createRequireFromPath()` {#dep0130-modulecreaterequirefrompath}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.0.0 | 寿命終了。 |
| v13.0.0 | ランタイムでの非推奨化。 |
| v12.2.0 | ドキュメントのみ。 |
:::

タイプ: 寿命終了

代わりに [`module.createRequire()`](/ja/nodejs/api/module#modulecreaterequirefilename) を使用してください。

### DEP0131: レガシー HTTP パーサー {#dep0131-legacy-http-parser}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v13.0.0 | この機能は削除されました。 |
| v12.22.0 | ランタイムでの非推奨化。 |
| v12.3.0 | ドキュメントのみ。 |
:::

タイプ: 寿命終了

Node.js の 12.0.0 より前のバージョンでデフォルトで使用されていたレガシー HTTP パーサーは非推奨となり、v13.0.0 で削除されました。v13.0.0 より前のバージョンでは、`--http-parser=legacy` コマンドラインフラグを使用して、レガシーパーサーの使用に戻すことができました。

### DEP0132: コールバック付きの `worker.terminate()` {#dep0132-workerterminate-with-callback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.5.0 | ランタイムでの非推奨化。 |
:::

タイプ: ランタイム

[`worker.terminate()`](/ja/nodejs/api/worker_threads#workerterminate) にコールバックを渡すことは非推奨です。代わりに、返された `Promise` またはワーカーの `'exit'` イベントに対するリスナーを使用してください。

### DEP0133: `http` `connection` {#dep0133-http-connection}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.12.0 | ドキュメントのみの非推奨化。 |
:::

タイプ: ドキュメントのみ

[`response.connection`](/ja/nodejs/api/http#responseconnection) よりも [`response.socket`](/ja/nodejs/api/http#responsesocket) を、[`request.connection`](/ja/nodejs/api/http#requestconnection) よりも [`request.socket`](/ja/nodejs/api/http#requestsocket) を優先してください。

### DEP0134: `process._tickCallback` {#dep0134-process_tickcallback}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v12.12.0 | ドキュメントのみの非推奨化。 |
:::

タイプ: ドキュメントのみ ([`--pending-deprecation`](/ja/nodejs/api/cli#--pending-deprecation) をサポート)

`process._tickCallback` プロパティは、公式にサポートされている API としてドキュメント化されたことはありません。


### DEP0135: `WriteStream.open()` および `ReadStream.open()` は内部APIです {#dep0135-writestreamopen-and-readstreamopen-are-internal}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v13.0.0 | ランタイムでの非推奨化 |
:::

タイプ: ランタイム

[`WriteStream.open()`](/ja/nodejs/api/fs#class-fswritestream) および [`ReadStream.open()`](/ja/nodejs/api/fs#class-fsreadstream) は、ドキュメント化されていない内部 API であり、ユーザーランドで使用しても意味がありません。ファイルストリームは、対応するファクトリメソッド [`fs.createWriteStream()`](/ja/nodejs/api/fs#fscreatewritestreampath-options) および [`fs.createReadStream()`](/ja/nodejs/api/fs#fscreatereadstreampath-options) を使用するか、オプションでファイルディスクリプタを渡すことによって常に開かれるべきです。

### DEP0136: `http` `finished` {#dep0136-http-finished}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v13.4.0, v12.16.0 | ドキュメントのみの非推奨化 |
:::

タイプ: ドキュメントのみ

[`response.finished`](/ja/nodejs/api/http#responsefinished) は、[`response.end()`](/ja/nodejs/api/http#responseenddata-encoding-callback) が呼び出されたかどうかを示し、`'finish'` が発行されたかどうか、および基になるデータがフラッシュされたかどうかは示しません。

曖昧さを避けるために、代わりに [`response.writableFinished`](/ja/nodejs/api/http#responsewritablefinished) または [`response.writableEnded`](/ja/nodejs/api/http#responsewritableended) を適宜使用してください。

既存の動作を維持するには、`response.finished` を `response.writableEnded` に置き換える必要があります。

### DEP0137: ガベージコレクションでの fs.FileHandle のクローズ {#dep0137-closing-fsfilehandle-on-garbage-collection}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.0.0 | ランタイムでの非推奨化 |
:::

タイプ: ランタイム

[`fs.FileHandle`](/ja/nodejs/api/fs#class-filehandle) オブジェクトがガベージコレクションでクローズされることを許可することは非推奨です。将来的には、そうするとエラーがスローされ、プロセスが終了する可能性があります。

すべての `fs.FileHandle` オブジェクトが不要になった場合は、`FileHandle.prototype.close()` を使用して明示的にクローズされるようにしてください。

```js [ESM]
const fsPromises = require('node:fs').promises;
async function openAndClose() {
  let filehandle;
  try {
    filehandle = await fsPromises.open('thefile.txt', 'r');
  } finally {
    if (filehandle !== undefined)
      await filehandle.close();
  }
}
```

### DEP0138: `process.mainModule` {#dep0138-processmainmodule}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.0.0 | ドキュメントのみの非推奨。 |
:::

タイプ: ドキュメントのみ

[`process.mainModule`](/ja/nodejs/api/process#processmainmodule) は CommonJS のみの機能ですが、`process` グローバルオブジェクトは非 CommonJS 環境と共有されます。ECMAScript モジュール内でのその使用はサポートされていません。

同じ目的を果たし、CommonJS 環境でのみ利用可能であるため、[`require.main`](/ja/nodejs/api/modules#accessing-the-main-module) の方が推奨されます。

### DEP0139: 引数なしの `process.umask()` {#dep0139-processumask-with-no-arguments}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.0.0, v12.19.0 | ドキュメントのみの非推奨。 |
:::

タイプ: ドキュメントのみ

引数なしで `process.umask()` を呼び出すと、プロセス全体の umask が 2 回書き込まれます。これはスレッド間の競合状態を引き起こし、潜在的なセキュリティ脆弱性となります。安全なクロスプラットフォームの代替 API はありません。

### DEP0140: `request.abort()` の代わりに `request.destroy()` を使用する {#dep0140-use-requestdestroy-instead-of-requestabort}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.1.0, v13.14.0 | ドキュメントのみの非推奨。 |
:::

タイプ: ドキュメントのみ

[`request.abort()`](/ja/nodejs/api/http#requestabort) の代わりに [`request.destroy()`](/ja/nodejs/api/http#requestdestroyerror) を使用してください。

### DEP0141: `repl.inputStream` と `repl.outputStream` {#dep0141-replinputstream-and-reploutputstream}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.3.0 | ドキュメントのみ ( [`--pending-deprecation`][] をサポート)。 |
:::

タイプ: ドキュメントのみ ( [`--pending-deprecation`](/ja/nodejs/api/cli#--pending-deprecation) をサポート)

`node:repl` モジュールは、入力ストリームと出力ストリームを 2 回エクスポートしました。`.inputStream` の代わりに `.input` を、`.outputStream` の代わりに `.output` を使用してください。

### DEP0142: `repl._builtinLibs` {#dep0142-repl_builtinlibs}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.3.0 | ドキュメントのみ ( [`--pending-deprecation`][] をサポート)。 |
:::

タイプ: ドキュメントのみ

`node:repl` モジュールは、組み込みモジュールの配列を含む `_builtinLibs` プロパティをエクスポートします。これはこれまで不完全であったため、`require('node:module').builtinModules` に依存する方が適切です。


### DEP0143: `Transform._transformState` {#dep0143-transform_transformstate}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.5.0 | ランタイムでの非推奨化。 |
:::

型: ランタイム `Transform._transformState` は、実装の簡素化により不要になった将来のバージョンで削除されます。

### DEP0144: `module.parent` {#dep0144-moduleparent}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.6.0, v12.19.0 | ドキュメントのみの非推奨化。 |
:::

型: ドキュメントのみ ([`--pending-deprecation`](/ja/nodejs/api/cli#--pending-deprecation) をサポート)

CommonJS モジュールは、`module.parent` を使用して、それを要求した最初のモジュールにアクセスできます。 この機能は、ECMAScript モジュールが存在する場合に一貫して機能せず、CommonJS モジュールグラフの不正確な表現を与えるため、非推奨となりました。

一部のモジュールは、現在のプロセスのエントリポイントであるかどうかを確認するためにこれを使用します。 代わりに、`require.main` と `module` を比較することをお勧めします。

```js [ESM]
if (require.main === module) {
  // 現在のファイルがエントリポイントである場合にのみ実行されるコードセクション。
}
```

現在のモジュールを要求した CommonJS モジュールを探す場合は、`require.cache` と `module.children` を使用できます。

```js [ESM]
const moduleParents = Object.values(require.cache)
  .filter((m) => m.children.includes(module));
```

### DEP0145: `socket.bufferSize` {#dep0145-socketbuffersize}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.6.0 | ドキュメントのみの非推奨化。 |
:::

型: ドキュメントのみ

[`socket.bufferSize`](/ja/nodejs/api/net#socketbuffersize) は、[`writable.writableLength`](/ja/nodejs/api/stream#writablewritablelength) のエイリアスにすぎません。

### DEP0146: `new crypto.Certificate()` {#dep0146-new-cryptocertificate}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v14.9.0 | ドキュメントのみの非推奨化。 |
:::

型: ドキュメントのみ

[`crypto.Certificate()` コンストラクタ](/ja/nodejs/api/crypto#legacy-api) は非推奨です。 代わりに [`crypto.Certificate()` の static メソッド](/ja/nodejs/api/crypto#class-certificate) を使用してください。

### DEP0147: `fs.rmdir(path, { recursive: true })` {#dep0147-fsrmdirpath-{-recursive-true-}}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.0.0 | ランタイムでの非推奨化。 |
| v15.0.0 | 寛容な動作に対するランタイムでの非推奨化。 |
| v14.14.0 | ドキュメントのみの非推奨化。 |
:::

型: ランタイム

Node.js の将来のバージョンでは、`recursive` オプションは `fs.rmdir`、`fs.rmdirSync`、および `fs.promises.rmdir` で無視されます。

代わりに `fs.rm(path, { recursive: true, force: true })`、`fs.rmSync(path, { recursive: true, force: true })`、または `fs.promises.rm(path, { recursive: true, force: true })` を使用してください。


### DEP0148: `"exports"` 内のフォルダーマッピング (末尾の `"/"`) {#dep0148-folder-mappings-in-"exports"-trailing-"/"}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v17.0.0 | End-of-Life。 |
| v16.0.0 | ランタイムでの非推奨化。 |
| v15.1.0 | 自己参照インポートに対するランタイムでの非推奨化。 |
| v14.13.0 | ドキュメントのみの非推奨化。 |
:::

種類: ランタイム

[サブパスエクスポート](/ja/nodejs/api/packages#subpath-exports)または[サブパスインポート](/ja/nodejs/api/packages#subpath-imports)フィールドで、サブパスフォルダーマッピングを定義するために末尾の `"/"` を使用することは非推奨です。[サブパターンのパターン](/ja/nodejs/api/packages#subpath-patterns)を代わりに使用してください。

### DEP0149: `http.IncomingMessage#connection` {#dep0149-httpincomingmessageconnection}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.0.0 | ドキュメントのみの非推奨化。 |
:::

種類: ドキュメントのみ。

[`message.connection`](/ja/nodejs/api/http#messageconnection)よりも[`message.socket`](/ja/nodejs/api/http#messagesocket)を優先してください。

### DEP0150: `process.config` の値の変更 {#dep0150-changing-the-value-of-processconfig}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.0.0 | End-of-Life。 |
| v16.0.0 | ランタイムでの非推奨化。 |
:::

種類: End-of-Life

`process.config` プロパティは、Node.js のコンパイル時設定へのアクセスを提供します。ただし、このプロパティは可変であり、改ざんされる可能性があります。値を変更する機能は、Node.js の将来のバージョンで削除されます。

### DEP0151: メインインデックスの検索と拡張子の検索 {#dep0151-main-index-lookup-and-extension-searching}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.0.0 | ランタイムでの非推奨化。 |
| v15.8.0, v14.18.0 | `--pending-deprecation` サポート付きのドキュメントのみの非推奨化。 |
:::

種類: ランタイム

以前は、`index.js` と拡張子の検索は、ESモジュールを解決する場合でも、`import 'pkg'` メインエントリポイントの解決に適用されていました。

この非推奨化により、すべてのESモジュールのメインエントリポイントの解決には、正確なファイル拡張子を持つ明示的な[`"exports"` または `"main"` エントリ](/ja/nodejs/api/packages#main-entry-point-export)が必要です。

### DEP0152: Extension PerformanceEntry プロパティ {#dep0152-extension-performanceentry-properties}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v16.0.0 | ランタイムでの非推奨化。 |
:::

種類: ランタイム

`'gc'`、`'http2'`、および `'http'` の[\<PerformanceEntry\>](/ja/nodejs/api/perf_hooks#class-performanceentry)オブジェクトタイプには、追加情報を提供する追加のプロパティが割り当てられています。これらのプロパティは、標準の `PerformanceEntry` オブジェクトの `detail` プロパティ内で利用できるようになりました。既存のアクセサーは非推奨となり、使用すべきではありません。


### DEP0153: `dns.lookup` および `dnsPromises.lookup` オプションの型強制 {#dep0153-dnslookup-and-dnspromiseslookup-options-type-coercion}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | サポート終了。 |
| v17.0.0 | ランタイムの非推奨。 |
| v16.8.0 | ドキュメントのみの非推奨。 |
:::

型: サポート終了

`family` オプションに nullish でない整数以外の値、`hints` オプションに nullish でない数値以外の値、`all` オプションに nullish でない boolean 以外の値、または [`dns.lookup()`](/ja/nodejs/api/dns#dnslookuphostname-options-callback) および [`dnsPromises.lookup()`](/ja/nodejs/api/dns#dnspromiseslookuphostname-options) で `verbatim` オプションに nullish でない boolean 以外の値を使用すると、`ERR_INVALID_ARG_TYPE` エラーがスローされます。

### DEP0154: RSA-PSS 鍵ペア生成オプション {#dep0154-rsa-pss-generate-key-pair-options}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.0.0 | ランタイムの非推奨。 |
| v16.10.0 | ドキュメントのみの非推奨。 |
:::

型: ランタイム

`'hash'` および `'mgf1Hash'` オプションは `'hashAlgorithm'` および `'mgf1HashAlgorithm'` に置き換えられました。

### DEP0155: パターン指定子の解決における末尾のスラッシュ {#dep0155-trailing-slashes-in-pattern-specifier-resolutions}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v17.0.0 | ランタイムの非推奨。 |
| v16.10.0 | `--pending-deprecation` サポートによるドキュメントのみの非推奨。 |
:::

型: ランタイム

`import 'pkg/x/'` のように `"/"` で終わる指定子のリマッピングは、パッケージ `"exports"` および `"imports"` パターンの解決では非推奨です。

### DEP0156: `http` の `.aborted` プロパティと `'abort'`, `'aborted'` イベント {#dep0156-aborted-property-and-abort-aborted-event-in-http}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v17.0.0, v16.12.0 | ドキュメントのみの非推奨。 |
:::

型: ドキュメントのみ

代わりに [\<Stream\>](/ja/nodejs/api/stream#stream) API に移行してください。[`http.ClientRequest`](/ja/nodejs/api/http#class-httpclientrequest)、[`http.ServerResponse`](/ja/nodejs/api/http#class-httpserverresponse)、および [`http.IncomingMessage`](/ja/nodejs/api/http#class-httpincomingmessage) はすべてストリームベースであるためです。`.aborted` プロパティの代わりに `stream.destroyed` を確認し、`'abort'`, `'aborted'` イベントの代わりに `'close'` をリッスンしてください。

`.aborted` プロパティと `'abort'` イベントは、`.abort()` 呼び出しの検出にのみ役立ちます。リクエストを早期に閉じるには、ストリーム `.destroy([error])` を使用し、`.destroyed` プロパティを確認します。また、`'close'` イベントは同じ効果があるはずです。受信側は、[`http.IncomingMessage`](/ja/nodejs/api/http#class-httpincomingmessage) の [`readable.readableEnded`](/ja/nodejs/api/stream#readablereadableended) の値を確認して、中断されたのか、正常に破棄されたのかを確認する必要があります。


### DEP0157: ストリームにおける Thenable のサポート {#dep0157-thenable-support-in-streams}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | 寿命終了。 |
| v17.2.0, v16.14.0 | ドキュメントのみの非推奨化。 |
:::

タイプ: 寿命終了

Node.js ストリームのドキュメント化されていない機能は、実装メソッドで thenable をサポートすることでした。これは非推奨になったため、代わりにコールバックを使用し、ストリーム実装メソッドに async 関数を使用しないでください。

この機能により、ユーザーがコールバックスタイルで関数を実装したが、例えば async メソッドを使用した場合に予期しない問題が発生しました。これは、promise とコールバックのセマンティクスを混在させることは無効であるため、エラーが発生します。

```js [ESM]
const w = new Writable({
  async final(callback) {
    await someOp();
    callback();
  },
});
```
### DEP0158: `buffer.slice(start, end)` {#dep0158-bufferslicestart-end}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v17.5.0, v16.15.0 | ドキュメントのみの非推奨化。 |
:::

タイプ: ドキュメントのみ

このメソッドは、`Uint8Array.prototype.slice()` と互換性がないため、非推奨になりました。`Uint8Array.prototype.slice()` は `Buffer` のスーパークラスです。

代わりに同じ動作をする [`buffer.subarray`](/ja/nodejs/api/buffer#bufsubarraystart-end) を使用してください。

### DEP0159: `ERR_INVALID_CALLBACK` {#dep0159-err_invalid_callback}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | 寿命終了。 |
:::

タイプ: 寿命終了

このエラーコードは、値の型の検証に使用されるエラーに混乱を招くため、削除されました。

### DEP0160: `process.on('multipleResolves', handler)` {#dep0160-processonmultipleresolves-handler}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.0.0 | ランタイムの非推奨化。 |
| v17.6.0, v16.15.0 | ドキュメントのみの非推奨化。 |
:::

タイプ: ランタイム。

このイベントは、V8 promise コンビネータでは機能せず、その有用性が低下したため、非推奨になりました。

### DEP0161: `process._getActiveRequests()` および `process._getActiveHandles()` {#dep0161-process_getactiverequests-and-process_getactivehandles}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v17.6.0, v16.15.0 | ドキュメントのみの非推奨化。 |
:::

タイプ: ドキュメントのみ

`process._getActiveHandles()` および `process._getActiveRequests()` 関数は、一般向けの使用を意図したものではなく、将来のリリースで削除される可能性があります。

実際のリファレンスではなく、アクティブなリソースのタイプのリストを取得するには、[`process.getActiveResourcesInfo()`](/ja/nodejs/api/process#processgetactiveresourcesinfo) を使用してください。


### DEP0162: `fs.write()`, `fs.writeFileSync()` の文字列への型強制 {#dep0162-fswrite-fswritefilesync-coercion-to-string}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v19.0.0 | 廃止。 |
| v18.0.0 | ランタイムでの非推奨。 |
| v17.8.0, v16.15.0 | ドキュメントのみの非推奨。 |
:::

タイプ: 廃止

[`fs.write()`](/ja/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback), [`fs.writeFile()`](/ja/nodejs/api/fs#fswritefilefile-data-options-callback), [`fs.appendFile()`](/ja/nodejs/api/fs#fsappendfilepath-data-options-callback), [`fs.writeFileSync()`](/ja/nodejs/api/fs#fswritefilesyncfile-data-options), および [`fs.appendFileSync()`](/ja/nodejs/api/fs#fsappendfilesyncpath-data-options) で、2 番目の引数として渡された独自の `toString` プロパティを持つオブジェクトの暗黙的な型強制は非推奨です。それらをプリミティブな文字列に変換してください。

### DEP0163: `channel.subscribe(onMessage)`, `channel.unsubscribe(onMessage)` {#dep0163-channelsubscribeonmessage-channelunsubscribeonmessage}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v18.7.0, v16.17.0 | ドキュメントのみの非推奨。 |
:::

タイプ: ドキュメントのみ

これらのメソッドは、イベントを受信するのに十分な時間、チャネル参照を保持しない方法で使用できるため、非推奨になりました。

代わりに、[`diagnostics_channel.subscribe(name, onMessage)`](/ja/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage) または [`diagnostics_channel.unsubscribe(name, onMessage)`](/ja/nodejs/api/diagnostics_channel#diagnostics_channelunsubscribename-onmessage) を使用してください。これらは同じことを行います。

### DEP0164: `process.exit(code)`, `process.exitCode` の整数への型強制 {#dep0164-processexitcode-processexitcode-coercion-to-integer}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.0.0 | 廃止。 |
| v19.0.0 | ランタイムでの非推奨。 |
| v18.10.0, v16.18.0 | `process.exitCode` の整数型強制に関するドキュメントのみの非推奨。 |
| v18.7.0, v16.17.0 | `process.exit(code)` の整数型強制に関するドキュメントのみの非推奨。 |
:::

タイプ: 廃止

[`process.exit()`](/ja/nodejs/api/process#processexitcode) の `code` パラメータの値、および [`process.exitCode`](/ja/nodejs/api/process#processexitcode_1) に割り当てる値として、`undefined`, `null`, 整数、および整数の文字列 (例: `'1'`) 以外の値を使用することは非推奨です。


### DEP0165: `--trace-atomics-wait` {#dep0165---trace-atomics-wait}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v23.0.0 | サポート終了。 |
| v22.0.0 | 実行時の非推奨化。 |
| v18.8.0, v16.18.0 | ドキュメントのみの非推奨化。 |
:::

種類: サポート終了

`--trace-atomics-wait` フラグは、V8 のフック `SetAtomicsWaitCallback` を使用しており、今後の V8 リリースで削除されるため、削除されました。

### DEP0166: インポートおよびエクスポートのターゲットにおける二重スラッシュ {#dep0166-double-slashes-in-imports-and-exports-targets}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.0.0 | 実行時の非推奨化。 |
| v18.10.0 | `--pending-deprecation` サポートによるドキュメントのみの非推奨化。 |
:::

種類: 実行時

二重スラッシュ（*"/"* または *"\"*）を含むパスにマッピングするパッケージのインポートおよびエクスポートのターゲットは非推奨となり、今後のリリースでは解決の検証エラーが発生します。 この非推奨は、スラッシュで始まるまたは終わるパターンマッチにも適用されます。

### DEP0167: 脆弱な `DiffieHellmanGroup` インスタンス (`modp1`, `modp2`, `modp5`) {#dep0167-weak-diffiehellmangroup-instances-modp1-modp2-modp5}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.10.0, v16.18.0 | ドキュメントのみの非推奨化。 |
:::

種類: ドキュメントのみ

既知の MODP グループ `modp1`、`modp2`、および `modp5` は、実際的な攻撃に対して安全ではないため、非推奨とされています。 詳しくは、[RFC 8247 Section 2.4](https://www.rfc-editor.org/rfc/rfc8247#section-2.4) を参照してください。

これらのグループは、Node.js の将来のバージョンで削除される可能性があります。 これらのグループに依存するアプリケーションは、代わりに、より強力な MODP グループの使用を検討する必要があります。

### DEP0168: Node-API コールバックでの未処理の例外 {#dep0168-unhandled-exception-in-node-api-callbacks}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v18.3.0, v16.17.0 | 実行時の非推奨化。 |
:::

種類: 実行時

Node-API コールバックでのキャッチされない例外の暗黙的な抑制は、非推奨になりました。

[`--force-node-api-uncaught-exceptions-policy`](/ja/nodejs/api/cli#--force-node-api-uncaught-exceptions-policy) フラグを設定して、例外が Node-API コールバックで処理されない場合に、Node.js が [`'uncaughtException'`](/ja/nodejs/api/process#event-uncaughtexception) イベントを発行するように強制します。


### DEP0169: 安全でない url.parse() {#dep0169-insecure-urlparse}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.9.0, v18.17.0 | `--pending-deprecation` のサポートを追加しました。 |
| v19.0.0, v18.13.0 | ドキュメントのみの非推奨。 |
:::

種類: ドキュメントのみ ([`--pending-deprecation`](/ja/nodejs/api/cli#--pending-deprecation) をサポート)

[`url.parse()`](/ja/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) の動作は標準化されておらず、セキュリティ上の影響を与えるエラーが発生しやすいです。代わりに [WHATWG URL API](/ja/nodejs/api/url#the-whatwg-url-api) を使用してください。CVE は `url.parse()` の脆弱性に対して発行されません。

### DEP0170: `url.parse()` を使用する場合の無効なポート {#dep0170-invalid-port-when-using-urlparse}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v20.0.0 | ランタイム非推奨。 |
| v19.2.0, v18.13.0 | ドキュメントのみの非推奨。 |
:::

種類: ランタイム

[`url.parse()`](/ja/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) は、数値ではないポートを持つ URL を受け入れます。この動作は、予期しない入力によるホスト名の詐称を引き起こす可能性があります。これらの URL は、[WHATWG URL API](/ja/nodejs/api/url#the-whatwg-url-api) が既に行っているように、将来のバージョンの Node.js でエラーをスローします。

### DEP0171: `http.IncomingMessage` ヘッダーとトレーラーのセッター {#dep0171-setters-for-httpincomingmessage-headers-and-trailers}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v19.3.0, v18.13.0 | ドキュメントのみの非推奨。 |
:::

種類: ドキュメントのみ

将来のバージョンの Node.js では、[`message.headers`](/ja/nodejs/api/http#messageheaders)、[`message.headersDistinct`](/ja/nodejs/api/http#messageheadersdistinct)、[`message.trailers`](/ja/nodejs/api/http#messagetrailers)、[`message.trailersDistinct`](/ja/nodejs/api/http#messagetrailersdistinct) は読み取り専用になります。

### DEP0172: `AsyncResource` バインド関数の `asyncResource` プロパティ {#dep0172-the-asyncresource-property-of-asyncresource-bound-functions}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v20.0.0 | ランタイム非推奨。 |
:::

種類: ランタイム

将来のバージョンの Node.js では、関数が `AsyncResource` にバインドされても `asyncResource` プロパティは追加されなくなります。

### DEP0173: `assert.CallTracker` クラス {#dep0173-the-assertcalltracker-class}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v20.1.0 | ドキュメントのみの非推奨。 |
:::

種類: ドキュメントのみ

将来のバージョンの Node.js では、[`assert.CallTracker`](/ja/nodejs/api/assert#class-assertcalltracker) は削除されます。[`mock`](/ja/nodejs/api/test#mocking) ヘルパー関数などの代替手段の使用を検討してください。


### DEP0174: `Promise` を返す関数に対して `promisify` を呼び出す {#dep0174-calling-promisify-on-a-function-that-returns-a-promise}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v21.0.0 | ランタイムでの非推奨。 |
| v20.8.0 | ドキュメントのみの非推奨。 |
:::

タイプ: ランタイム

[`util.promisify`](/ja/nodejs/api/util#utilpromisifyoriginal) を、`Promise` を返す関数に対して呼び出すと、

### DEP0175: `util.toUSVString` {#dep0175-utiltousvstring}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.8.0 | ドキュメントのみの非推奨。 |
:::

タイプ: ドキュメントのみ

[`util.toUSVString()`](/ja/nodejs/api/util#utiltousvstringstring) API は非推奨です。代わりに [`String.prototype.toWellFormed`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toWellFormed) を使用してください。

### DEP0176: `fs.F_OK`, `fs.R_OK`, `fs.W_OK`, `fs.X_OK` {#dep0176-fsf_ok-fsr_ok-fsw_ok-fsx_ok}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.8.0 | ドキュメントのみの非推奨。 |
:::

タイプ: ドキュメントのみ

`node:fs` で直接公開されている `F_OK`, `R_OK`, `W_OK`, `X_OK` ゲッターは非推奨です。代わりに `fs.constants` または `fs.promises.constants` から取得してください。

### DEP0177: `util.types.isWebAssemblyCompiledModule` {#dep0177-utiltypesiswebassemblycompiledmodule}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v21.7.0, v20.12.0 | 寿命終了。 |
| v21.3.0, v20.11.0 | 非推奨コードが割り当てられました。 |
| v14.0.0 | ドキュメントのみの非推奨。 |
:::

タイプ: 寿命終了

`util.types.isWebAssemblyCompiledModule` API は削除されました。代わりに `value instanceof WebAssembly.Module` を使用してください。

### DEP0178: `dirent.path` {#dep0178-direntpath}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.0.0 | ランタイムでの非推奨。 |
| v21.5.0, v20.12.0, v18.20.0 | ドキュメントのみの非推奨。 |
:::

タイプ: ランタイム

[`dirent.path`](/ja/nodejs/api/fs#direntpath) は、リリースライン全体での一貫性がないため、非推奨となりました。代わりに [`dirent.parentPath`](/ja/nodejs/api/fs#direntparentpath) を使用してください。

### DEP0179: `Hash` コンストラクター {#dep0179-hash-constructor}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.0.0 | ランタイムでの非推奨。 |
| v21.5.0, v20.12.0 | ドキュメントのみの非推奨。 |
:::

タイプ: ランタイム

`Hash()` または `new Hash()` で `Hash` クラスを直接呼び出すことは、内部的なものであり、一般公開を意図していないため、非推奨です。`Hash` インスタンスを作成するには、[`crypto.createHash()`](/ja/nodejs/api/crypto#cryptocreatehashalgorithm-options) メソッドを使用してください。


### DEP0180: `fs.Stats` コンストラクター {#dep0180-fsstats-constructor}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v22.0.0 | ランタイムの非推奨。 |
| v20.13.0 | ドキュメントのみの非推奨。 |
:::

種類: ランタイム

`fs.Stats` クラスを `Stats()` または `new Stats()` で直接呼び出すことは、内部使用のものであり、一般公開を意図していないため、非推奨です。

### DEP0181: `Hmac` コンストラクター {#dep0181-hmac-constructor}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v22.0.0 | ランタイムの非推奨。 |
| v20.13.0 | ドキュメントのみの非推奨。 |
:::

種類: ランタイム

`Hmac` クラスを `Hmac()` または `new Hmac()` で直接呼び出すことは、内部使用のものであり、一般公開を意図していないため、非推奨です。Hmac インスタンスを作成するには、[`crypto.createHmac()`](/ja/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) メソッドを使用してください。

### DEP0182: 明示的な `authTagLength` のない短い GCM 認証タグ {#dep0182-short-gcm-authentication-tags-without-explicit-authtaglength}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v23.0.0 | ランタイムの非推奨。 |
| v20.13.0 | ドキュメントのみの非推奨。 |
:::

種類: ランタイム

デフォルトの認証タグ長よりも短い認証タグを使用するアプリケーションは、[`crypto.createDecipheriv()`](/ja/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) 関数の `authTagLength` オプションを適切な長さに設定する必要があります。

GCM モードの暗号の場合、[`decipher.setAuthTag()`](/ja/nodejs/api/crypto#deciphersetauthtagbuffer-encoding) 関数は、有効な長さの認証タグを受け入れます ( [DEP0090](/ja/nodejs/api/deprecations#DEP0090)を参照)。この動作は、[NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf) に準拠するために非推奨となりました。

### DEP0183: OpenSSL エンジンベースの API {#dep0183-openssl-engine-based-apis}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v22.4.0, v20.16.0 | ドキュメントのみの非推奨。 |
:::

種類: ドキュメントのみ

OpenSSL 3 は、カスタムエンジンのサポートを非推奨とし、新しいプロバイダーモデルに切り替えることを推奨しています。`https.request()` の `clientCertEngine` オプション、[`tls.createSecureContext()`](/ja/nodejs/api/tls#tlscreatesecurecontextoptions)、および [`tls.createServer()`](/ja/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener); [`tls.createSecureContext()`](/ja/nodejs/api/tls#tlscreatesecurecontextoptions) の `privateKeyEngine` および `privateKeyIdentifier`; および [`crypto.setEngine()`](/ja/nodejs/api/crypto#cryptosetengineengine-flags) はすべて、OpenSSL のこの機能に依存しています。


### DEP0184: `node:zlib` クラスを `new` なしでインスタンス化する {#dep0184-instantiating-nodezlib-classes-without-new}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.9.0, v20.18.0 | ドキュメントのみの非推奨化。 |
:::

タイプ: ドキュメントのみ

`node:zlib` モジュールによってエクスポートされたクラスを `new` 修飾子なしでインスタンス化することは非推奨です。代わりに `new` 修飾子を使用することをお勧めします。これは、`Deflate`、`DeflateRaw`、`Gunzip`、`Inflate`、`InflateRaw`、`Unzip`、`Zlib` など、すべての Zlib クラスに適用されます。

### DEP0185: `node:repl` クラスを `new` なしでインスタンス化する {#dep0185-instantiating-noderepl-classes-without-new}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.9.0, v20.18.0 | ドキュメントのみの非推奨化。 |
:::

タイプ: ドキュメントのみ

`node:repl` モジュールによってエクスポートされたクラスを `new` 修飾子なしでインスタンス化することは非推奨です。代わりに `new` 修飾子を使用することをお勧めします。これは、`REPLServer` や `Recoverable` を含むすべての REPL クラスに適用されます。

### DEP0187: 無効な引数の型を `fs.existsSync` に渡す {#dep0187-passing-invalid-argument-types-to-fsexistssync}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.4.0 | ドキュメントのみ。 |
:::

タイプ: ドキュメントのみ

サポートされていない引数の型を渡すことは非推奨となり、`false` を返す代わりに、将来のバージョンではエラーが発生します。

### DEP0188: `process.features.ipv6` と `process.features.uv` {#dep0188-processfeaturesipv6-and-processfeaturesuv}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.4.0 | ドキュメントのみの非推奨化。 |
:::

タイプ: ドキュメントのみ

これらのプロパティは無条件に `true` です。これらのプロパティに基づくチェックは冗長です。

### DEP0189: `process.features.tls_*` {#dep0189-processfeaturestls_*}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.4.0 | ドキュメントのみの非推奨化。 |
:::

タイプ: ドキュメントのみ

`process.features.tls_alpn`、`process.features.tls_ocsp`、および `process.features.tls_sni` は、それらの値が `process.features.tls` の値と同一であることが保証されているため、非推奨です。

