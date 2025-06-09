---
title: Node.js の概要
description: Node.js はオープンソースのクロスプラットフォーム JavaScript ランタイム環境で、開発者がサーバーサイドで JavaScript を実行することを可能にし、高パフォーマンスとスケーラビリティを提供します。
head:
  - - meta
    - name: og:title
      content: Node.js の概要 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js はオープンソースのクロスプラットフォーム JavaScript ランタイム環境で、開発者がサーバーサイドで JavaScript を実行することを可能にし、高パフォーマンスとスケーラビリティを提供します。
  - - meta
    - name: twitter:title
      content: Node.js の概要 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js はオープンソースのクロスプラットフォーム JavaScript ランタイム環境で、開発者がサーバーサイドで JavaScript を実行することを可能にし、高パフォーマンスとスケーラビリティを提供します。
---


# Node.js入門

Node.jsは、オープンソースでクロスプラットフォームのJavaScriptランタイム環境です。ほぼすべての種類のプロジェクトで人気のあるツールです！

Node.jsは、Google ChromeのコアであるV8 JavaScriptエンジンをブラウザの外で実行します。これにより、Node.jsは非常に高いパフォーマンスを発揮します。

Node.jsアプリは、リクエストごとに新しいスレッドを作成することなく、単一のプロセスで実行されます。Node.jsは、JavaScriptコードがブロックされるのを防ぐための非同期I/Oプリミティブのセットを標準ライブラリで提供しており、一般的に、Node.jsのライブラリはノンブロッキングパラダイムを使用して記述されているため、ブロッキング動作は例外であり、normではありません。

Node.jsがネットワークからの読み取り、データベースへのアクセス、ファイルシステムへのアクセスなどのI/O操作を実行する場合、スレッドをブロックしてCPUサイクルを無駄に待つ代わりに、Node.jsは応答が返ってきたときに操作を再開します。

これにより、Node.jsは、スレッドの同時実行性の管理という負担を導入することなく、単一のサーバーで数千の同時接続を処理できます。これはバグの重要な原因となる可能性があります。

Node.jsには独自の利点があります。ブラウザ用にJavaScriptを記述する数百万人のフロントエンド開発者が、完全に異なる言語を学ぶ必要なく、クライアント側のコードに加えてサーバー側のコードを記述できるようになったためです。

Node.jsでは、すべてのユーザーがブラウザを更新するのを待つ必要がないため、新しいECMAScript標準を問題なく使用できます。Node.jsのバージョンを変更することで、使用するECMAScriptバージョンを決定できます。また、フラグを指定してNode.jsを実行することで、特定の実験的な機能を有効にすることもできます。

## Node.jsアプリケーションの例

Node.jsの最も一般的なHello Worldの例は、Webサーバーです。

```js
import { createServer } from 'node:http'
const hostname = '127.0.0.1'
const port = 3000
const server = createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World')
})
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
```

このスニペットを実行するには、`server.js`ファイルとして保存し、ターミナルで`node server.js`を実行します。コードのmjsバージョンを使用する場合は、`server.mjs`ファイルとして保存し、ターミナルで`node server.mjs`を実行する必要があります。

このコードは、最初にNode.jsの[httpモジュール](/ja/nodejs/api/http)を含みます。

Node.jsには、ネットワーキングのファーストクラスのサポートを含む、素晴らしい[標準ライブラリ](/ja/nodejs/api/synopsis)があります。

`http`の`createServer()`メソッドは、新しいHTTPサーバーを作成して返します。

サーバーは、指定されたポートとホスト名でリッスンするように設定されています。サーバーの準備が整うと、コールバック関数が呼び出されます。この場合、サーバーが実行されていることを通知します。

新しいリクエストが受信されるたびに、[requestイベント](/ja/nodejs/api/http)が呼び出され、2つのオブジェクト、リクエスト（`http.IncomingMessage`オブジェクト）とレスポンス（`http.ServerResponse`オブジェクト）が提供されます。

これらの2つのオブジェクトは、HTTP呼び出しを処理するために不可欠です。

最初のオブジェクトは、リクエストの詳細を提供します。この簡単な例では、これは使用されていませんが、リクエストヘッダーとリクエストデータにアクセスできます。

2番目のオブジェクトは、データを呼び出し元に返すために使用されます。

この場合：

```js
res.setHeader('Content-Type', 'text/plain')
```

statusCodeプロパティを200に設定して、成功した応答を示します。

Content-Typeヘッダーを設定します。

```js
res.setHeader('Content-Type', 'text/plain')
```

そして、コンテンツを引数として`end()`に追加して、レスポンスを閉じます。

```js
res.end('Hello World')
```

これにより、レスポンスがクライアントに送信されます。

