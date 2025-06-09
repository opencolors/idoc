---
title: Node.js で環境変数を読み取る方法
description: process.env プロパティと .env ファイルを使用して Node.js で環境変数にアクセスする方法を学びます。
head:
  - - meta
    - name: og:title
      content: Node.js で環境変数を読み取る方法 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: process.env プロパティと .env ファイルを使用して Node.js で環境変数にアクセスする方法を学びます。
  - - meta
    - name: twitter:title
      content: Node.js で環境変数を読み取る方法 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: process.env プロパティと .env ファイルを使用して Node.js で環境変数にアクセスする方法を学びます。
---


# Node.js で環境変数を読み取る方法

Node.js の process コアモジュールは、プロセスが開始された時点で設定されていたすべての環境変数をホストする `env` プロパティを提供します。

以下のコードは `app.js` を実行し、`USER_ID` と `USER_KEY` を設定します。

```bash
USER_ID=239482 USER_KEY=foobar node app.js
```

これにより、ユーザー `USER_ID` は 239482 として、`USER_KEY` は foobar として渡されます。これはテストに適していますが、本番環境では、変数をエクスポートするためにいくつかの bash スクリプトを構成するでしょう。

::: tip NOTE
`process` は `"require"` を必要としません。自動的に利用可能です。
:::

以下は、上記のコードで設定した `USER_ID` と `USER_KEY` 環境変数にアクセスする例です。

```javascript
process.env.USER_ID; // "239482
process.env.USER_KEY; // "foobar
```

同様の方法で、設定したカスタム環境変数にアクセスできます。 Node.js 20 では、実験的な [.env ファイルのサポート](/ja/nodejs/api/cli#env-file-config)が導入されました。

`--env-file` フラグを使用して、Node.js アプリケーションの実行時に環境ファイルを指定できます。以下に `.env` ファイルの例と、`process.env` を使用してその変数にアクセスする方法を示します。

```bash
.env file
PORT=3000
```

js ファイル内

```javascript
process.env.PORT; // 3000
```

`.env` ファイルで設定された環境変数を使用して `app.js` ファイルを実行します。

```js
node --env-file=.env app.js
```

このコマンドは、`.env` ファイルからすべての環境変数をロードし、`process.env` でアプリケーションから利用できるようにします。 また、複数の --env-file 引数を渡すことができます。 後続のファイルは、以前のファイルで定義された既存の変数を上書きします。

```bash
node --env-file=.env --env-file=.development.env app.js
```
::: tip NOTE
同じ変数が環境とファイルの両方で定義されている場合、環境からの値が優先されます。
:::

