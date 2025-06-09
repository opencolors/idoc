---
title: JavaScript タイマー：setTimeout と setInterval
description: JavaScript タイマーを使用して関数の実行を遅延させ、setTimeout と setInterval でタスクをスケジュールする方法を学びます。
head:
  - - meta
    - name: og:title
      content: JavaScript タイマー：setTimeout と setInterval | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: JavaScript タイマーを使用して関数の実行を遅延させ、setTimeout と setInterval でタスクをスケジュールする方法を学びます。
  - - meta
    - name: twitter:title
      content: JavaScript タイマー：setTimeout と setInterval | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: JavaScript タイマーを使用して関数の実行を遅延させ、setTimeout と setInterval でタスクをスケジュールする方法を学びます。
---


# JavaScript タイマーを見つけよう

### `setTimeout()`

JavaScript コードを書いている際、関数の実行を遅らせたいと思うことがあるかもしれません。

これは `setTimeout` の役割です。後で実行するコールバック関数と、どのくらい後に実行したいかをミリ秒単位で表す値を指定します。

```js
setTimeout(() => {
  // 2 秒後に実行される
}, 2000);
setTimeout(() => {
  // 50 ミリ秒後に実行される
}, 50);
```

この構文は新しい関数を定義します。その中で好きな関数を呼び出すことができます。また、既存の関数名と一連のパラメーターを渡すこともできます。

```js
const myFunction = (firstParam, secondParam) => {
  // 何か処理を行う
};
// 2 秒後に実行される
setTimeout(myFunction, 2000, firstParam, secondParam);
```

`setTimeout` はタイマー ID を返します。これは通常使用されませんが、この ID を保存し、スケジュールされた関数の実行を削除したい場合にクリアできます。

```js
const id = setTimeout(() => {
  // 2 秒後に実行されるはず
}, 2000);
// やっぱりやめた
clearTimeout(id);
```

## ゼロ遅延

タイムアウト遅延を 0 に指定すると、コールバック関数は可能な限り早く、ただし現在の関数の実行後に実行されます。

```js
setTimeout(() => {
  console.log('after ');
}, 0);
console.log(' before ');
```

このコードは以下を出力します。

```bash
before
after
```

これは、CPU を集中的なタスクでブロックすることを避け、スケジューラに関数をキューに入れることで、重い計算を実行中に他の関数を実行できるようにするのに特に役立ちます。

::: tip
一部のブラウザ（IE および Edge）は、これとまったく同じ機能を持つ `setImmediate()` メソッドを実装していますが、標準ではなく、[他のブラウザでは使用できません](https://caniuse.com/#feat=setimmediate)。ただし、Node.js では標準の関数です。
:::

### `setInterval()`

`setInterval` は `setTimeout` と同様の関数ですが、違いがあります。コールバック関数を 1 回実行する代わりに、指定した時間間隔 (ミリ秒単位) で永久に実行します。

```js
setInterval(() => {
  // 2 秒ごとに実行される
}, 2000);
```

上記の関数は、`clearInterval` を使用して停止するように指示しない限り、2 秒ごとに実行されます。`clearInterval` には、`setInterval` が返した間隔 ID を渡します。

```js
const id = setInterval(() => {
  // 2 秒ごとに実行される
}, 2000);
// やっぱりやめた
clearInterval(id);
```

`setInterval` コールバック関数内で `clearInterval` を呼び出し、再び実行するか停止するかを自動的に判断させるのが一般的です。たとえば、このコードは App.somethingIWait の値が到達するまで何かを実行します。


## 再帰的な setTimeout

`setInterval` は、関数が実行を終了したタイミングを考慮せずに、n ミリ秒ごとに関数を開始します。

関数が常に同じ時間かかるのであれば問題ありません。

場合によっては、ネットワークの状態によって関数の実行時間が異なることがあります。

そして、1 回の長い実行が次の実行と重複してしまうかもしれません。

これを避けるために、コールバック関数が終了したときに呼び出される再帰的な setTimeout をスケジュールすることができます。

```js
const myFunction = () => {
  // 何か処理を行う
  setTimeout(myFunction, 1000);
};
setTimeout(myFunction, 1000);
```

`setTimeout` と `setInterval` は、Node.js の [Timers モジュール](/ja/nodejs/api/timers) を通じて利用可能です。

Node.js は `setImmediate()` も提供しており、これは `setTimeout(() => {}, 0)` を使用するのと同じであり、主に Node.js イベントループを操作するために使用されます。

