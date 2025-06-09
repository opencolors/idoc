---
title: Node.js ファイル統計
description: Node.js を使用して fs モジュールの stat() メソッドでファイルの詳細情報を確認する方法を学びます。ファイルの種類、サイズなどを含みます。
head:
  - - meta
    - name: og:title
      content: Node.js ファイル統計 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js を使用して fs モジュールの stat() メソッドでファイルの詳細情報を確認する方法を学びます。ファイルの種類、サイズなどを含みます。
  - - meta
    - name: twitter:title
      content: Node.js ファイル統計 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js を使用して fs モジュールの stat() メソッドでファイルの詳細情報を確認する方法を学びます。ファイルの種類、サイズなどを含みます。
---


# Node.js ファイルの統計情報

すべてのファイルには、Node.js を使用して調べることができる詳細情報のセットが付属しています。特に、[fs モジュール](/ja/nodejs/api/fs)によって提供される `stat()` メソッドを使用します。

ファイルパスを渡して呼び出すと、Node.js はファイルの詳細情報を取得した後、渡されたコールバック関数を、エラーメッセージとファイル統計情報の 2 つのパラメータで呼び出します。

```js
import fs from 'node:fs'
fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err)
  }
  // `stats` でファイル統計情報にアクセスできます
})
```

Node.js は、ファイル統計情報の準備が整うまでスレッドをブロックする同期メソッドも提供します。

```js
import fs from 'node:fs'
try {
  const stats = fs.statSync('/Users/joe/test.txt')
} catch (err) {
  console.error(err)
}
```

ファイル情報は、stats 変数に含まれています。stats を使用して、どのような情報を抽出できますか？

**以下を含む多くの情報があります。**

- `stats.isFile()` および `stats.isDirectory()` を使用して、ファイルがディレクトリかファイルか
- `stats.isSymbolicLink()` を使用して、ファイルがシンボリックリンクかどうか
- `stats.size` を使用して、ファイルのサイズをバイト単位で取得

他にも高度なメソッドがありますが、日常のプログラミングで使用するものの大部分はこれです。

```js
import fs from 'node:fs'
fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err)
    return
  }
  stats.isFile() // true
  stats.isDirectory() // false
  stats.isSymbolicLink() // false
  stats.size // 1024000 //= 1MB
})
```

必要に応じて、`fs/promises` モジュールによって提供される promise ベースの `fsPromises.stat()` メソッドを使用することもできます。

```js
import fs from 'node:fs/promises'
try {
  const stats = await fs.stat('/Users/joe/test.txt')
  stats.isFile() // true
  stats.isDirectory() // false
  stats.isSymbolicLink() // false
  stats.size // 1024000 //= 1MB
} catch (err) {
  console.log(err)
}
```

fs モジュールの詳細については、[ファイルシステムモジュール](/ja/nodejs/api/fs)のドキュメントを参照してください。

