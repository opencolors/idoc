---
title: Node.js のブロッキングとノンブロッキング
description: この記事では、Node.js のブロッキングとノンブロッキングの呼び出しの違いを説明します。また、イベントループと並行性への影響についても説明します。
head:
  - - meta
    - name: og:title
      content: Node.js のブロッキングとノンブロッキング | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: この記事では、Node.js のブロッキングとノンブロッキングの呼び出しの違いを説明します。また、イベントループと並行性への影響についても説明します。
  - - meta
    - name: twitter:title
      content: Node.js のブロッキングとノンブロッキング | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: この記事では、Node.js のブロッキングとノンブロッキングの呼び出しの違いを説明します。また、イベントループと並行性への影響についても説明します。
---


# ブロッキングとノンブロッキングの概要

この概要では、Node.js におけるブロッキング呼び出しとノンブロッキング呼び出しの違いについて説明します。この概要では、イベントループと libuv について言及しますが、これらのトピックに関する事前の知識は必要ありません。読者は、JavaScript 言語と Node.js の [コールバックパターン](/ja/nodejs/guide/javascript-asynchronous-programming-and-callbacks) について基本的な理解があることを前提としています。

::: info
「I/O」とは、主に [libuv](https://libuv.org/) によってサポートされているシステムのディスクおよびネットワークとの対話を指します。
:::

## ブロッキング

**ブロッキング** とは、Node.js プロセスにおける追加の JavaScript の実行が、非 JavaScript 操作が完了するまで待機しなければならない場合を指します。これは、**ブロッキング** 操作が発生している間、イベントループが JavaScript の実行を継続できないために起こります。

Node.js では、I/O などの非 JavaScript 操作の待機ではなく、CPU 負荷が高いためにパフォーマンスが低下する JavaScript は、通常 **ブロッキング** とは呼ばれません。libuv を使用する Node.js 標準ライブラリの同期メソッドは、最も一般的に使用される **ブロッキング** 操作です。ネイティブモジュールにも **ブロッキング** メソッドが含まれている場合があります。

Node.js 標準ライブラリのすべての I/O メソッドは、**ノンブロッキング** な非同期バージョンを提供しており、コールバック関数を受け入れます。一部のメソッドには、`Sync` で終わる名前を持つ **ブロッキング** な対応するものもあります。

## コードの比較

**ブロッキング** メソッドは **同期的に** 実行され、**ノンブロッキング** メソッドは **非同期的に** 実行されます。

File System モジュールを例にとると、これは **同期的な** ファイル読み込みです。

```js
const fs = require('node:fs')
const data = fs.readFileSync('/file.md') // ファイルが読み込まれるまでここでブロックします
```

そして、これは同等の **非同期的な** 例です。

```js
const fs = require('node:fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
})
```

最初の例は 2 番目の例よりも単純に見えますが、2 行目がファイル全体が読み込まれるまで追加の JavaScript の実行を **ブロッキング** するという欠点があります。同期バージョンでは、エラーがスローされた場合、それをキャッチする必要があるか、プロセスがクラッシュすることに注意してください。非同期バージョンでは、エラーをスローするかどうかは作成者が判断する必要があります。

例を少し拡張してみましょう。

```js
const fs = require('node:fs')
const data = fs.readFileSync('/file.md') // ファイルが読み込まれるまでここでブロックします
console.log(data)
moreWork() // console.log の後に実行されます
```

そして、これは同様ですが、同等ではない非同期の例です。

```js
const fs = require('node:fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
  console.log(data)
})
moreWork() // console.log の前に実行されます
```

上記の最初の例では、`console.log` は `moreWork()` の前に呼び出されます。2 番目の例では、`fs.readFile()` は **ノンブロッキング** であるため、JavaScript の実行を継続でき、`moreWork()` が最初に呼び出されます。ファイルの読み込みが完了するのを待たずに `moreWork()` を実行できることは、より高いスループットを可能にするための重要な設計上の選択です。


## 並行性とスループット

Node.js における JavaScript の実行はシングルスレッドであるため、並行性とは、他の作業が完了した後、イベントループが JavaScript のコールバック関数を実行する能力を指します。並行して実行されることが期待されるコードは、I/O などの非 JavaScript 操作が発生している間、イベントループが実行を継続できるようにする必要があります。

例として、Web サーバーへの各リクエストの完了に 50ms かかり、その 50ms のうち 45ms が非同期で実行できるデータベース I/O である場合を考えてみましょう。ノンブロッキングな非同期操作を選択すると、リクエストごとに 45ms が解放され、他のリクエストを処理できるようになります。これは、ブロッキングメソッドの代わりにノンブロッキングメソッドを選択するだけで、処理能力に大きな違いが生じることを示しています。

イベントループは、並行作業を処理するために追加のスレッドが作成される可能性のある、他の多くの言語のモデルとは異なります。

## ブロッキングコードとノンブロッキングコードの混在の危険性

I/O を扱う際には避けるべきパターンがいくつかあります。例を見てみましょう。

```js
const fs = require('node:fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
  console.log(data)
})
fs.unlinkSync('/file.md')
```

上記の例では、`fs.unlinkSync()` が `fs.readFile()` の前に実行される可能性が高く、`file.md` が実際に読み取られる前に削除されてしまいます。これをより適切に記述する方法として、完全にノンブロッキングで正しい順序で実行されることが保証されているのは次のとおりです。

```js
const fs = require('node:fs')
fs.readFile('/file.md', (readFileErr, data) => {
  if (readFileErr) throw readFileErr
  console.log(data)
  fs.unlink('/file.md', unlinkErr => {
    if (unlinkErr) throw unlinkErr
  })
})
```

上記では、`fs.readFile()` のコールバック内で `fs.unlink()` への **ノンブロッキング** 呼び出しを行っており、操作の正しい順序が保証されています。

