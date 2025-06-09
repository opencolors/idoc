---
title: Node.js の process.nextTick() の理解
description: Node.js の process.nextTick() の動作と setImmediate() および setTimeout() との違いについて学びます。イベント ループと nextTick() を使用してコードを非同期に実行する方法を理解します。
head:
  - - meta
    - name: og:title
      content: Node.js の process.nextTick() の理解 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js の process.nextTick() の動作と setImmediate() および setTimeout() との違いについて学びます。イベント ループと nextTick() を使用してコードを非同期に実行する方法を理解します。
  - - meta
    - name: twitter:title
      content: Node.js の process.nextTick() の理解 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js の process.nextTick() の動作と setImmediate() および setTimeout() との違いについて学びます。イベント ループと nextTick() を使用してコードを非同期に実行する方法を理解します。
---


# `process.nextTick()` を理解する

Node.js のイベントループを理解しようとする際に、重要な部分の一つが `process.nextTick()` です。イベントループが一周するたびに、それをティックと呼びます。

関数を process.nextTick() に渡すと、現在の操作の終了時、かつ次のイベントループティックが開始する前に、この関数を呼び出すようにエンジンに指示します。

```js
process.nextTick(() => {
  // 何かをする
})
```

イベントループは現在の関数コードの処理でビジー状態です。この操作が終了すると、JS エンジンはその操作中に `nextTick` 呼び出しに渡されたすべての関数を実行します。

これは、JS エンジンに非同期的に（現在の関数の後で）関数を処理するように指示するものの、キューに入れずに可能な限り早く処理する方法です。

`setTimeout(() => {}, 0)` を呼び出すと、次のティックの最後に実行されますが、`nextTick()` を使用すると、呼び出しが優先され、次のティックの開始直前に実行されるため、はるかに早く実行されます。

コードが次のイベントループの反復で既に実行されていることを確認したい場合は、`nextTick()` を使用します。

## イベントの順序の例：

```js
console.log('Hello => number 1')
setImmediate(() => {
  console.log('Running before the timeout => number 3')
})
setTimeout(() => {
  console.log('The timeout running last => number 4')
}, 0)
process.nextTick(() => {
  console.log('Running at next tick => number 2')
})
```

## 出力例：

```bash
Hello => number 1
Running at next tick => number 2
Running before the timeout => number 3
The timeout running last => number 4
```

正確な出力は、実行ごとに異なる場合があります。

