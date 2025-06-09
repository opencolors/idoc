---
title: Node.js の ECMAScript 2015（ES6）とその先
description: Node.js は V8 エンジンを通じて最新の ECMAScript 機能をサポートし、新しい機能や改善が適時に行われています。
head:
  - - meta
    - name: og:title
      content: Node.js の ECMAScript 2015（ES6）とその先 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js は V8 エンジンを通じて最新の ECMAScript 機能をサポートし、新しい機能や改善が適時に行われています。
  - - meta
    - name: twitter:title
      content: Node.js の ECMAScript 2015（ES6）とその先 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js は V8 エンジンを通じて最新の ECMAScript 機能をサポートし、新しい機能や改善が適時に行われています。
---


# ECMAScript 2015 (ES6) 以降

Node.js は最新バージョンの [V8](https://v8.dev/) を基に構築されています。このエンジンの最新リリースに追従することで、[JavaScript ECMA-262 仕様](https://tc39.es/ecma262/) の新しい機能が Node.js 開発者にタイムリーに提供されるだけでなく、パフォーマンスと安定性の継続的な向上が保証されます。

すべての ECMAScript 2015 (ES6) 機能は、`shipping`、`staged`、および `in progress` 機能の 3 つのグループに分けられます。

+ V8 が安定していると見なす `shipping` 機能はすべて、`Node.js でデフォルトで有効` になっており、ランタイムフラグは一切 `不要` です。
+ `Staged` 機能は、ほぼ完成しているものの、V8 チームによって安定していると見なされていない機能であり、ランタイムフラグ `--harmony` が必要です。
+ `In progress` 機能は、それぞれの harmony フラグによって個別にアクティブ化できますが、テスト目的以外では強くお勧めしません。注: これらのフラグは V8 によって公開されており、非推奨の通知なしに変更される可能性があります。

## どの機能がどの Node.js バージョンでデフォルトで提供されますか？

ウェブサイト [node.green](https://node.green) は、kangax の compat-table に基づいて、さまざまなバージョンの Node.js でサポートされている ECMAScript 機能の優れた概要を提供します。

## どの機能が in progress ですか？

新しい機能は V8 エンジンに常に追加されています。一般的に言って、今後の Node.js リリースで利用できるようになることを期待できますが、時期は不明です。

`--v8-options` 引数を grep することで、各 Node.js リリースで利用可能なすべての in progress 機能を一覧表示できます。これらは V8 の未完成で、場合によっては壊れている機能であるため、ご自身の責任で使用してください。

```sh
node --v8-options | grep "in progress"
```

## `--harmony` フラグを活用するようにインフラストラクチャを設定しています。削除する必要がありますか？

Node.js での `--harmony` フラグの現在の動作は、`staged` 機能のみを有効にすることです。結局のところ、これは現在 `--es_staging` の同義語です。上記のように、これらはまだ安定しているとは見なされていない完了した機能です。特に本番環境では、安全を期したい場合は、V8 で、したがって Node.js でデフォルトで提供されるまで、このランタイムフラグを削除することを検討してください。これを有効にしたままにする場合は、V8 が標準により厳密に従うようにセマンティクスを変更した場合、Node.js のアップグレードによってコードが破損する可能性があることに備えておく必要があります。


## 特定のバージョンのNode.jsに同梱されているV8のバージョンを調べるにはどうすればよいですか？

Node.jsでは、`process`グローバルオブジェクトを通じて、特定のバイナリに同梱されているすべての依存関係とそのバージョンを簡単にリストアップできます。V8エンジンの場合、そのバージョンを取得するには、ターミナルで次のコマンドを入力します。

```sh
node -p process.versions.v8
```

