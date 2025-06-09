---
title: Node.js を使用したコマンドラインへの出力
description: Node.js では、コンソールモジュールが提供されており、ログ出力、カウント、タイム測定など、コマンドラインとのやり取りを行うためのさまざまなメソッドが用意されています。
head:
  - - meta
    - name: og:title
      content: Node.js を使用したコマンドラインへの出力 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js では、コンソールモジュールが提供されており、ログ出力、カウント、タイム測定など、コマンドラインとのやり取りを行うためのさまざまなメソッドが用意されています。
  - - meta
    - name: twitter:title
      content: Node.js を使用したコマンドラインへの出力 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js では、コンソールモジュールが提供されており、ログ出力、カウント、タイム測定など、コマンドラインとのやり取りを行うためのさまざまなメソッドが用意されています。
---


# Node.js を使用してコマンドラインに出力する

console モジュールを使用した基本的な出力
Node.js は、コマンドラインとのインタラクションに非常に役立つ多くの方法を提供する console モジュールを提供します。これは基本的に、ブラウザにある console オブジェクトと同じです。

最も基本的で最もよく使用されるメソッドは `console.log()` で、渡された文字列をコンソールに出力します。オブジェクトを渡すと、文字列としてレンダリングされます。

複数の変数を `console.log` に渡すことができます。例えば：
```javascript
const x = 'x';
const y = 'y';
console.log(x, y);
```

変数とフォーマット指定子を渡すことによって、きれいなフレーズをフォーマットすることもできます。例えば：
```javascript
console.log('私の %s には %d 個の耳があります', '猫', 2);
```

- %s 変数を文字列としてフォーマットします - %d 変数を数値としてフォーマットします - %i 変数をその整数部分のみとしてフォーマットします - %o 変数をオブジェクトとしてフォーマットします
例：
```javascript
console.log('%o', Number);
```
## コンソールをクリアする

`console.clear()` はコンソールをクリアします（動作は使用されるコンソールによって異なる場合があります）。

## 要素のカウント

`console.count()` は便利なメソッドです。
次のコードを見てください。
```javascript
const x = 1;
const y = 2;
const z = 3;
console.count('x の値は '+x+' であり、チェックされました。何回？');
console.count('x の値は'+x+'でチェックされました。何回？');
console.count('y の値は'+y+'でチェックされました。何回？');
```

何が起こるかというと、`console.count()` は文字列が出力される回数をカウントし、その横にカウントを出力します。

リンゴとオレンジだけをカウントすることができます。

```javascript
const oranges = ['orange', 'orange'];
const apples = ['just one apple'];
oranges.forEach(fruit => console.count(fruit));
apples.forEach(fruit => console.count(fruit));
```

## カウントのリセット

`console.countReset()` メソッドは、`console.count()` で使用されるカウンタをリセットします。

リンゴとオレンジの例を使用してこれをデモンストレーションします。

```javascript
const oranges = ['orange', 'orange'];
const apples = ['just one apple'];
oranges.forEach(fruit => console.count(fruit));
apples.forEach(fruit => console.count(fruit));
console.countReset('orange');
oranges.forEach(fruit => console.count(fruit));
```


## スタックトレースの出力

関数がどのように呼び出されたのか、つまりコードのどの部分からその場所に到達したのかを知りたい場合に、関数のコールスタックトレースを出力することが役立つ場合があります。

これは `console.trace()` を使用して実行できます。

```javascript
const function2 = () => console.trace();
const function1 = () => function2();
function1();
```

これにより、スタックトレースが出力されます。Node.js REPLでこれを試した場合の出力は次のとおりです。

```bash
Trace
at function2 (repl:1:33)
at function1 (rep1:1:25)
at rep1:1:1
at ContextifyScript.Script.xunInThisContext (vm.js:44:33)
at REPLServer.defaultEval(repl.js:239:29)
at bound (domain.js:301:14)
at REPLServer.xunBound [as eval](domain.js:314:12)
at REPLServer.onLine (repl.js:440:10)
at emitone (events.js:120:20)
at REPLServer.emit (events.js:210:7)
```

## 経過時間の計算

`time()` と `timeEnd()` を使用すると、関数が実行されるのにかかる時間を簡単に計算できます。

```javascript
const doSomething = () => console.log('test');
const measureDoingSomething = () => {
    console.time('doSomething()');
    // 何らかの処理を実行し、かかる時間を測定します
    doSomething();
    console.timeEnd('doSomething()');
};
measureDoingSomething();
```

### stdout と stderr

`console.log` はコンソールにメッセージを出力するのに非常に役立ちます。これは標準出力（stdout）と呼ばれます。

`console.error` は stderr ストリームに出力します。

コンソールには表示されませんが、エラーログには表示されます。

## 出力の着色

エスケープシーケンスを使用すると、コンソールのテキストの出力を着色できます。エスケープシーケンスは、色を識別する一連の文字です。

例：

```javascript
console.log('x1b[33ms/x1b[0m', 'hi!');
```

Node.js REPL で試してみると、「hi!」が黄色で表示されます。

ただし、これは低レベルの方法です。コンソール出力を着色する最も簡単な方法は、ライブラリを使用することです。Chalk はそのようなライブラリであり、着色に加えて、テキストを太字、斜体、または下線にするなどの他のスタイル設定機能も提供します。

`npm install chalk` でインストールすると、使用できます。

```javascript
const chalk = require('chalk');
console.log(chalk.yellow('hi!'));
```

`chalk.yellow` を使用する方が、エスケープコードを覚えようとするよりもはるかに便利で、コードもはるかに読みやすくなります。

その他の使用例については、上記のプロジェクトリンクを確認してください。


## プログレスバーの作成

`progress` は、コンソールにプログレスバーを作成するための素晴らしいパッケージです。 `npm install progress` を使用してインストールします。

次のスニペットは、10ステップのプログレスバーを作成し、100ミリ秒ごとに1ステップ完了します。 バーが完了すると、インターバルをクリアします。

```javascript
const ProgressBar = require('progress');
const bar = new ProgressBar(':bar', { total: 10 });
const timer = setInterval(() => {
    bar.tick();
    if (bar.complete) {
        clearInterval(timer);
    }
}, 100);
```

