---
title: Node.js の setImmediate() の理解
description: Node.js の setImmediate() の動作、setTimeout()、process.nextTick()、Promise.then() との違い、イベント ループやキューとの相互作用について学びます。
head:
  - - meta
    - name: og:title
      content: Node.js の setImmediate() の理解 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js の setImmediate() の動作、setTimeout()、process.nextTick()、Promise.then() との違い、イベント ループやキューとの相互作用について学びます。
  - - meta
    - name: twitter:title
      content: Node.js の setImmediate() の理解 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js の setImmediate() の動作、setTimeout()、process.nextTick()、Promise.then() との違い、イベント ループやキューとの相互作用について学びます。
---


# `setImmediate()` の理解

コードを非同期に、ただしできるだけ早く実行したい場合、Node.js が提供する `setImmediate()` 関数を使用する方法があります。

```js
setImmediate(() => {
    // 何らかの処理
})
```

`setImmediate()` の引数として渡された関数はすべて、イベントループの次のイテレーションで実行されるコールバックです。

`setImmediate()` は `setTimeout(() => {}, 0)` (0ms のタイムアウトを渡す) や `process.nextTick()`、`Promise.then()` とどう違うのでしょうか？

`process.nextTick()` に渡された関数は、現在の操作が終了した後、イベントループの現在のイテレーションで実行されます。これは、常に `setTimeout` および `setImmediate` より前に実行されることを意味します。

0ms の遅延を持つ `setTimeout()` コールバックは、`setImmediate()` と非常によく似ています。実行順序はさまざまな要因に依存しますが、どちらもイベントループの次のイテレーションで実行されます。

`process.nextTick` コールバックは **process.nextTick キュー** に追加されます。`Promise.then()` コールバックは、Promise の **マイクロタスクキュー** に追加されます。`setTimeout`、`setImmediate` コールバックは **マクロタスクキュー** に追加されます。

イベントループは、最初に **process.nextTick キュー** のタスクを実行し、次に **Promise マイクロタスクキュー** を実行し、最後に `setTimeout` または `setImmediate` **マクロタスクキュー** を実行します。

`setImmediate()`、`process.nextTick()`、`Promise.then()` の間の順序を示す例を次に示します。

```js
const baz = () => console.log('baz');
const foo = () => console.log('foo');
const zoo = () => console.log('zoo');
const start = () => {
  console.log('start');
  setImmediate(baz);
  new Promise((resolve, reject) => {
    resolve('bar');
  }).then(resolve => {
    console.log(resolve);
    process.nextTick(zoo);
  });
  process.nextTick(foo);
};
start();
// start foo bar zoo baz
```

このコードは最初に `start()` を呼び出し、次に **process.nextTick キュー** の `foo()` を呼び出します。その後、**Promise マイクロタスクキュー** を処理し、bar を出力すると同時に **process.nextTick キュー** に `zoo()` を追加します。次に、追加されたばかりの `zoo()` を呼び出します。最後に、**マクロタスクキュー** の `baz()` が呼び出されます。

前述の原則は CommonJS のケースに当てはまりますが、ES Modules (例: `mjs` ファイル) では、実行順序が異なることに注意してください。

```js
// start bar foo zoo baz
```

これは、ロードされる ES Module が非同期操作としてラップされるため、スクリプト全体が実際にはすでに **Promise マイクロタスクキュー** に存在するためです。したがって、Promise がすぐに解決されると、そのコールバックは **マイクロタスクキュー** に追加されます。Node.js は、他のキューに移動するまでキューをクリアしようとするため、最初に bar が出力されるのを確認できます。

