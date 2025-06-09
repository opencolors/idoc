---
title: Node.js REPLの使用方法
description: Node.js REPLを使用して、簡単なJavaScriptコードを迅速にテストし、その機能を探索する方法を学びます。マルチラインモード、特殊変数、ドットコマンドなどを含みます。
head:
  - - meta
    - name: og:title
      content: Node.js REPLの使用方法 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js REPLを使用して、簡単なJavaScriptコードを迅速にテストし、その機能を探索する方法を学びます。マルチラインモード、特殊変数、ドットコマンドなどを含みます。
  - - meta
    - name: twitter:title
      content: Node.js REPLの使用方法 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js REPLを使用して、簡単なJavaScriptコードを迅速にテストし、その機能を探索する方法を学びます。マルチラインモード、特殊変数、ドットコマンドなどを含みます。
---


# Node.js REPL の使い方

`node` コマンドは Node.js スクリプトを実行するために使用するコマンドです。

```bash
node script.js
```

実行するスクリプトや引数なしに `node` コマンドを実行すると、REPL セッションが開始されます。

```bash
node
```

::: tip 注
REPL は Read Evaluate Print Loop (読み取り、評価、出力の繰り返し) の略で、プログラミング言語の環境 (基本的にはコンソールウィンドウ) であり、ユーザー入力を単一の式として受け取り、実行後に結果をコンソールに出力します。REPL セッションは、簡単な JavaScript コードをすばやくテストするのに便利な方法を提供します。
:::

ターミナルで試してみると、次のようになります。

```bash
> node
>
```

コマンドはアイドルモードになり、何らかの入力があるまで待機します。

::: tip
ターミナルの開き方がわからない場合は、「your-operating-system でターミナルを開く方法」をググってください。
:::

REPL は、より正確には、JavaScript コードの入力を待機しています。

まず、簡単な例を入力してみましょう。

```bash
> console.log('test')
test
undefined
>
```

最初の値 `test` は、コンソールに出力するように指示した出力です。次に、`console.log()` を実行した戻り値である `undefined` が返されます。Node はこのコード行を読み込み、評価し、結果を出力し、さらにコード行の入力を待機する状態に戻ります。Node は、セッションを終了するまで、REPL で実行するコードごとにこの 3 つのステップを繰り返します。これが REPL の名前の由来です。

Node は、JavaScript コードの任意の行の結果を、指示しなくても自動的に出力します。たとえば、次の行を入力して Enter キーを押します。

```bash
> 5==5
false
>
```

上記の 2 行の出力の違いに注目してください。Node REPL は `console.log()` の実行後には `undefined` を出力しましたが、他方では `5== '5'` の結果を出力しただけです。前者は JavaScript の単なるステートメントであり、後者は式であることに注意する必要があります。

場合によっては、テストしたいコードが複数行にわたる場合があります。たとえば、乱数を生成する関数を定義したいとします。REPL セッションで次の行を入力して Enter キーを押します。

```javascript
function generateRandom()
...
```

Node REPL は、コードの記述がまだ完了していないことを賢く判断し、コードを入力するための複数行モードに移行します。ここで、関数の定義を完了して Enter キーを押します。

```javascript
function generateRandom()
...return Math.random()
```


### 特殊変数:

コードを入力した後で `_` と入力すると、直前の操作の結果が出力されます。

### 上矢印キー:

上矢印キーを押すと、現在の、さらには以前の REPL セッションで実行されたコードの履歴にアクセスできます。

## ドットコマンド

REPL にはいくつかの特別なコマンドがあり、すべてドット `.` で始まります。それらは次のとおりです。
- `.help`: ドットコマンドのヘルプを表示します。
- `.editor`: エディタモードを有効にし、複数行の JavaScript コードを簡単に記述できます。このモードに入ったら、`ctrl-D` を入力して記述したコードを実行します。
- `.break`: 複数行の式を入力しているときに、`.break` コマンドを入力すると、それ以上の入力を中止します。`ctrl-C` を押すのと同じです。
- `.clear`: REPL コンテキストを空のオブジェクトにリセットし、現在入力中の複数行の式をすべてクリアします。
- `.1oad`: 現在の作業ディレクトリを基準にして、JavaScript ファイルをロードします。
- `.save`: REPL セッションで入力したすべてをファイルに保存します (ファイル名を指定してください)。
- `.exit`: REPL を終了します (`ctrl-C` を 2 回押すのと同じです)。

REPL は、`.editor` を呼び出す必要なく、複数行のステートメントを入力していることを認識します。たとえば、次のような反復処理の入力を開始した場合:
```javascript
[1, 2,3].foxEach(num=>{
```
Enter キーを押すと、REPL は 3 つのドットで始まる新しい行に移動し、そのブロックでの作業を続行できることを示します。
```javascript
1... console.log (num)
2...}
```

行末に `.break` を入力すると、複数行モードは停止し、ステートメントは実行されません。

## JavaScript ファイルから REPL を実行する

`repl` を使用して JavaScript ファイルに REPL をインポートできます。
```javascript
const repl = require('node:repl');
```

`repl` 変数を使用して、さまざまな操作を実行できます。REPL コマンドプロンプトを開始するには、次の行を入力します。
```javascript
repl.start();
```

コマンドラインでファイルを実行します。
```bash
node repl.js
```

REPL の開始時に表示される文字列を渡すことができます。デフォルトは '>' (末尾にスペース付き) ですが、カスタムプロンプトを定義できます。
```javascript
// Unix スタイルのプロンプト
const local = repl.start('$ ');
```

REPL の終了時にメッセージを表示できます。

```javascript
local.on('exit', () => {
  console.log('exiting repl');
  process.exit();
});
```

REPL モジュールの詳細については、[repl ドキュメント](/ja/nodejs/api/repl)を参照してください。

