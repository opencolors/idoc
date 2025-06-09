---
title: Node.js ドキュメント
description: Node.jsの包括的なドキュメントを探求し、API、モジュール、使用例をカバーして、開発者がNode.jsを効果的に理解し利用できるようにします。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsの包括的なドキュメントを探求し、API、モジュール、使用例をカバーして、開発者がNode.jsを効果的に理解し利用できるようにします。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsの包括的なドキュメントを探求し、API、モジュール、使用例をカバーして、開発者がNode.jsを効果的に理解し利用できるようにします。
---


# このドキュメントについて {#about-this-documentation}

Node.js の公式 API リファレンスドキュメントへようこそ！

Node.js は [V8 JavaScript エンジン](https://v8.dev/)上に構築された JavaScript ランタイムです。

## コントリビューション {#contributing}

このドキュメントのエラーは、[issue tracker](https://github.com/nodejs/node/issues/new) に報告してください。プルリクエストの送信方法については、[貢献ガイド](https://github.com/nodejs/node/blob/HEAD/CONTRIBUTING.md) を参照してください。

## 安定度インデックス {#stability-index}

ドキュメント全体を通して、セクションの安定度が表示されています。一部の API は十分に実績があり、信頼性が高いため、まったく変更される可能性は低いでしょう。一方、ごく新しい実験的なものや、危険であることがわかっているものもあります。

安定度インデックスは次のとおりです。

::: danger [安定度: 0 - 非推奨]
[安定度: 0](/ja/nodejs/api/documentation#stability-index) 安定度: 0 - 非推奨。この機能は警告を発する場合があります。後方互換性は保証されません。
:::

::: warning [安定度: 1 - 試験的]
[安定度: 1](/ja/nodejs/api/documentation#stability-index) 安定度: 1 - 試験的。この機能は [セマンティックバージョニング](https://semver.org/) のルールに従いません。後方互換性のない変更や削除は、将来のリリースで発生する可能性があります。この機能の利用は、本番環境では推奨されません。
:::

::: tip [安定度: 2 - 安定]
[安定度: 2](/ja/nodejs/api/documentation#stability-index) 安定度: 2 - 安定。npm エコシステムとの互換性が最優先事項です。
:::

::: info [安定度: 3 - レガシー]
[安定度: 3](/ja/nodejs/api/documentation#stability-index) 安定度: 3 - レガシー。この機能は削除される可能性は低く、セマンティックバージョニングの保証も適用されますが、積極的なメンテナンスは行われておらず、他の代替手段が利用可能です。
:::

レガシー機能は、その使用に害がなく、npm エコシステム内で広く利用されている場合に、非推奨ではなくレガシーとしてマークされます。レガシー機能で見つかったバグは修正されない可能性があります。

特にライブラリを作成する場合は、試験的な機能を使用する際には注意してください。ユーザーは、試験的な機能が使用されていることに気付いていない可能性があります。試験的な API の変更が発生すると、バグや動作の変化がユーザーを驚かせる可能性があります。驚きを避けるために、試験的な機能の使用にはコマンドラインフラグが必要になる場合があります。試験的な機能は、[警告](/ja/nodejs/api/process#event-warning) を発することもあります。


## 安定性の概要 {#stability-overview}

| API | 安定性 |
| --- | --- |
| [Assert](/ja/nodejs/api/assert) |<div class="custom-block tip"> (2) Stable </div>|
| [Async hooks](/ja/nodejs/api/async_hooks) |<div class="custom-block warning"> (1) Experimental </div>|
| [Asynchronous context tracking](/ja/nodejs/api/async_context) |<div class="custom-block tip"> (2) Stable </div>|
| [Buffer](/ja/nodejs/api/buffer) |<div class="custom-block tip"> (2) Stable </div>|
| [Child process](/ja/nodejs/api/child_process) |<div class="custom-block tip"> (2) Stable </div>|
| [Cluster](/ja/nodejs/api/cluster) |<div class="custom-block tip"> (2) Stable </div>|
| [Console](/ja/nodejs/api/console) |<div class="custom-block tip"> (2) Stable </div>|
| [Crypto](/ja/nodejs/api/crypto) |<div class="custom-block tip"> (2) Stable </div>|
| [Diagnostics Channel](/ja/nodejs/api/diagnostics_channel) |<div class="custom-block tip"> (2) Stable </div>|
| [DNS](/ja/nodejs/api/dns) |<div class="custom-block tip"> (2) Stable </div>|
| [Domain](/ja/nodejs/api/domain) |<div class="custom-block danger"> (0) Deprecated </div>|
| [File system](/ja/nodejs/api/fs) |<div class="custom-block tip"> (2) Stable </div>|
| [HTTP](/ja/nodejs/api/http) |<div class="custom-block tip"> (2) Stable </div>|
| [HTTP/2](/ja/nodejs/api/http2) |<div class="custom-block tip"> (2) Stable </div>|
| [HTTPS](/ja/nodejs/api/https) |<div class="custom-block tip"> (2) Stable </div>|
| [Inspector](/ja/nodejs/api/inspector) |<div class="custom-block tip"> (2) Stable </div>|
| [Modules: `node:module` API](/ja/nodejs/api/module) |<div class="custom-block warning"> (1) .2 - リリース候補 (非同期バージョン) 安定性: 1.1 - 活発な開発 (同期バージョン) </div>|
| [Modules: CommonJS modules](/ja/nodejs/api/modules) |<div class="custom-block tip"> (2) Stable </div>|
| [Modules: TypeScript](/ja/nodejs/api/typescript) |<div class="custom-block warning"> (1) .1 - 活発な開発 </div>|
| [OS](/ja/nodejs/api/os) |<div class="custom-block tip"> (2) Stable </div>|
| [Path](/ja/nodejs/api/path) |<div class="custom-block tip"> (2) Stable </div>|
| [Performance measurement APIs](/ja/nodejs/api/perf_hooks) |<div class="custom-block tip"> (2) Stable </div>|
| [Punycode](/ja/nodejs/api/punycode) |<div class="custom-block danger"> (0) Deprecated </div>|
| [Query string](/ja/nodejs/api/querystring) |<div class="custom-block tip"> (2) Stable </div>|
| [Readline](/ja/nodejs/api/readline) |<div class="custom-block tip"> (2) Stable </div>|
| [REPL](/ja/nodejs/api/repl) |<div class="custom-block tip"> (2) Stable </div>|
| [Single executable applications](/ja/nodejs/api/single-executable-applications) |<div class="custom-block warning"> (1) .1 - 活発な開発 </div>|
| [SQLite](/ja/nodejs/api/sqlite) |<div class="custom-block warning"> (1) .1 - 活発な開発. </div>|
| [Stream](/ja/nodejs/api/stream) |<div class="custom-block tip"> (2) Stable </div>|
| [String decoder](/ja/nodejs/api/string_decoder) |<div class="custom-block tip"> (2) Stable </div>|
| [Test runner](/ja/nodejs/api/test) |<div class="custom-block tip"> (2) Stable </div>|
| [Timers](/ja/nodejs/api/timers) |<div class="custom-block tip"> (2) Stable </div>|
| [TLS (SSL)](/ja/nodejs/api/tls) |<div class="custom-block tip"> (2) Stable </div>|
| [Trace events](/ja/nodejs/api/tracing) |<div class="custom-block warning"> (1) Experimental </div>|
| [TTY](/ja/nodejs/api/tty) |<div class="custom-block tip"> (2) Stable </div>|
| [UDP/datagram sockets](/ja/nodejs/api/dgram) |<div class="custom-block tip"> (2) Stable </div>|
| [URL](/ja/nodejs/api/url) |<div class="custom-block tip"> (2) Stable </div>|
| [Util](/ja/nodejs/api/util) |<div class="custom-block tip"> (2) Stable </div>|
| [VM (executing JavaScript)](/ja/nodejs/api/vm) |<div class="custom-block tip"> (2) Stable </div>|
| [Web Crypto API](/ja/nodejs/api/webcrypto) |<div class="custom-block tip"> (2) Stable </div>|
| [Web Streams API](/ja/nodejs/api/webstreams) |<div class="custom-block tip"> (2) Stable </div>|
| [WebAssembly System Interface (WASI)](/ja/nodejs/api/wasi) |<div class="custom-block warning"> (1) Experimental </div>|
| [Worker threads](/ja/nodejs/api/worker_threads) |<div class="custom-block tip"> (2) Stable </div>|
| [Zlib](/ja/nodejs/api/zlib) |<div class="custom-block tip"> (2) Stable </div>|


## JSON 出力 {#json-output}

**追加:** v0.6.12

すべての `.html` ドキュメントには、対応する `.json` ドキュメントがあります。これは、IDE やドキュメントを利用するその他のユーティリティのためのものです。

## システムコールと man ページ {#system-calls-and-man-pages}

システムコールをラップする Node.js 関数は、その旨をドキュメントに記載します。ドキュメントは、システムコールの仕組みを記述した対応する man ページにリンクしています。

ほとんどの Unix システムコールには、Windows の類似機能があります。それでも、動作の違いは避けられない場合があります。

