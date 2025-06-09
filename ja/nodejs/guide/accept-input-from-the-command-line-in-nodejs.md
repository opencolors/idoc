---
title: Node.js でのユーザー入力の取得
description: readline モジュールと Inquirer.js パッケージを使用して、Node.js の CLI プログラムをインタラクティブにする方法を学びます。
head:
  - - meta
    - name: og:title
      content: Node.js でのユーザー入力の取得 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: readline モジュールと Inquirer.js パッケージを使用して、Node.js の CLI プログラムをインタラクティブにする方法を学びます。
  - - meta
    - name: twitter:title
      content: Node.js でのユーザー入力の取得 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: readline モジュールと Inquirer.js パッケージを使用して、Node.js の CLI プログラムをインタラクティブにする方法を学びます。
---


# Node.js でコマンドラインから入力を受け取る

Node.js CLI プログラムをインタラクティブにするにはどうすればよいでしょうか？

Node.js バージョン 7 以降では、まさにこれを実現するための `readline` モジュールが提供されています。`process.stdin` ストリームのような読み込み可能なストリームから入力を、一度に 1 行ずつ取得します。`process.stdin` ストリームは、Node.js プログラムの実行中はターミナルの入力となります。

```javascript
const readline = require('node:readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("What's your name?", name => {
    console.log('Hi ' + name + '!');
    rl.close();
});
```

このコードは、ユーザーの名前を尋ね、テキストが入力され、ユーザーが Enter キーを押すと、挨拶を送信します。

`question()` メソッドは、最初のパラメータ（質問）を表示し、ユーザーの入力を待ちます。Enter キーが押されると、コールバック関数が呼び出されます。

このコールバック関数では、readline インターフェースを閉じます。

`readline` は、他にもいくつかのメソッドを提供しています。上記のパッケージドキュメントでご確認ください。

パスワードを入力する必要がある場合は、エコーバックせずに、代わりに `*` 記号を表示するのが最善です。

最も簡単な方法は、API の点で非常によく似ており、すぐに使える `readline-sync` パッケージを使用することです。より完全で抽象的なソリューションは、`Inquirer.js` パッケージによって提供されます。

`npm install inquirer` を使用してインストールできます。その後、上記のコードを次のように再現できます。

```javascript
const inquirer = require('inquirer');
const questions = [
    {
        type: 'input',
        name: 'name',
        message: "what's your name?"
    }
];
inquirer.prompt(questions).then(answers => {
    console.log('Hi ' + answers.name + '!');
});
```

`Inquirer.js` を使用すると、複数選択肢の質問、ラジオボタン、確認など、多くのことができます。

すべての代替手段、特に Node.js によって提供される組み込みのものを知っておくことは価値がありますが、CLI 入力を次のレベルに進めることを計画している場合は、`Inquirer.js` が最適な選択肢です。

