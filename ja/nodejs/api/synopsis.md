---
title: Node.js ドキュメント - 概要
description: Node.jsの概要、イベント駆動の非同期アーキテクチャ、主要モジュール、およびNode.js開発の開始方法を詳述。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - 概要 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsの概要、イベント駆動の非同期アーキテクチャ、主要モジュール、およびNode.js開発の開始方法を詳述。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - 概要 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsの概要、イベント駆動の非同期アーキテクチャ、主要モジュール、およびNode.js開発の開始方法を詳述。
---


# 利用法と例 {#usage-and-example}

## 利用法 {#usage}

`node [オプション] [V8オプション] [script.js | -e "script" | - ] [引数]`

詳細については、[コマンドラインオプション](/ja/nodejs/api/cli#options)ドキュメントを参照してください。

## 例 {#example}

Node.js で記述された `'Hello, World!'` を返す [Web サーバー](/ja/nodejs/api/http)の例:

このドキュメントのコマンドは、ユーザーのターミナルでの表示方法を再現するために `$` または `\>` で始まります。`$` および `\>` 文字を含めないでください。これらは、各コマンドの開始を示すためにあります。

`$` または `\>` 文字で始まらない行は、前のコマンドの出力を示しています。

まず、Node.js をダウンロードしてインストールしていることを確認してください。詳細なインストール情報については、[パッケージマネージャー経由で Node.js をインストールする](https://nodejs.org/en/download/package-manager/) を参照してください。

次に、`projects` という名前の空のプロジェクトフォルダーを作成し、その中に移動します。

Linux および Mac:

```bash [BASH]
mkdir ~/projects
cd ~/projects
```
Windows CMD:

```bash [BASH]
mkdir %USERPROFILE%\projects
cd %USERPROFILE%\projects
```
Windows PowerShell:

```bash [BASH]
mkdir $env:USERPROFILE\projects
cd $env:USERPROFILE\projects
```
次に、`projects` フォルダーに新しいソースファイルを作成し、`hello-world.js` という名前を付けます。

任意のテキストエディターで `hello-world.js` を開き、次のコンテンツを貼り付けます。

```js [ESM]
const http = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```
ファイルを保存します。次に、ターミナルウィンドウで、`hello-world.js` ファイルを実行するには、次のように入力します。

```bash [BASH]
node hello-world.js
```
次のような出力がターミナルに表示されるはずです。

```bash [BASH]
Server running at http://127.0.0.1:3000/
```
次に、任意の Web ブラウザーを開き、`http://127.0.0.1:3000` にアクセスします。

ブラウザーに文字列 `Hello, World!` が表示された場合、サーバーが動作していることを示します。

