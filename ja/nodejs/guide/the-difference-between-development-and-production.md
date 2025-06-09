---
title: Node.js の開発環境と本番環境の違い
description: Node.js の NODE_ENV の役割と開発環境および本番環境への影響について理解する。
head:
  - - meta
    - name: og:title
      content: Node.js の開発環境と本番環境の違い | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js の NODE_ENV の役割と開発環境および本番環境への影響について理解する。
  - - meta
    - name: twitter:title
      content: Node.js の開発環境と本番環境の違い | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js の NODE_ENV の役割と開発環境および本番環境への影響について理解する。
---


# Node.js、開発環境と本番環境の違い

`Node.jsでは、開発環境と本番環境に違いはありません`。つまり、Node.jsを本番構成で動作させるために適用する必要がある特定の設定はありません。ただし、npmレジストリの一部のライブラリは、`NODE_ENV`変数を使用することを認識し、デフォルトで`development`設定になります。Node.jsを実行するときは、常に`NODE_ENV=production`を設定してください。

アプリケーションを構成する一般的な方法として、[12 Factor App](https://12factor.net)の原則があります。

## ExpressにおけるNODE_ENV

非常に人気のある[express](https://expressjs.com)フレームワークでは、NODE_ENVをproductionに設定すると、一般的に次のことが保証されます。

+ ロギングは最小限の必須レベルに抑えられます
+ パフォーマンスを最適化するために、より多くのキャッシュレベルが実行されます

これは通常、シェルで次のコマンドを実行することによって行われます。

```bash
export NODE_ENV=production
```

ただし、システム再起動の場合に設定が保持されないため、シェル構成ファイル（例：Bashシェルの場合は`.bash_profile`）に記述することをお勧めします。

環境変数をアプリケーションの初期化コマンドに付加することで適用することもできます。

```bash
NODE_ENV=production node app.js
```

たとえば、Expressアプリでは、これを使用して環境ごとに異なるエラーハンドラーを設定できます。

```javascript
if (process.env.NODE_ENV === 'development') {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}
if (process.env.NODE_ENV === 'production') {
  app.use(express.errorHandler());
}
```

たとえば、[Express.js](https://expressjs.com)で使用されるテンプレートライブラリである[Pug](https://pugjs.org)は、`NODE_ENV`が`production`に設定されていない場合、デバッグモードでコンパイルされます。Expressビューは、開発モードではリクエストごとにコンパイルされますが、本番環境ではキャッシュされます。他にも多くの例があります。

`この環境変数は、外部ライブラリで広く使用されている慣例ですが、Node.js自体では使用されていません。`

## なぜNODE_ENVはアンチパターンと見なされるのか？

環境とは、エンジニアがソフトウェア製品を構築、テスト、デプロイ、および管理できるデジタルプラットフォームまたはシステムです。通常、アプリケーションが実行される環境には、次の4つの段階または種類があります。

+ 開発
+ ステージング
+ 本番
+ テスト

`NODE_ENV`の根本的な問題は、開発者が最適化とソフトウェアの動作を実行中の環境と組み合わせていることに起因します。その結果、次のようなコードになります。

```javascript
if (process.env.NODE_ENV === 'development') {
  // ...
}
if (process.env.NODE_ENV === 'staging') {
  // ...
}
if (process.env.NODE_ENV === 'production') {
  // ...
}
if (process.env.NODE_ENV === 'testing') {
  // ...
}
```

これは無害に見えるかもしれませんが、本番環境とステージング環境を異なるものにし、信頼性の高いテストを不可能にします。たとえば、テストと、したがって製品の機能は、`NODE_ENV`が`development`に設定されている場合は合格する可能性がありますが、`NODE_ENV`を`production`に設定すると失敗する可能性があります。したがって、`NODE_ENV`を`production`以外に設定することはアンチパターンと見なされます。

