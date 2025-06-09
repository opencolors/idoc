---
title: Node.js でファイルを読み取る
description: fs.readFile()、fs.readFileSync()、fsPromises.readFile() メソッドを使用して Node.js でファイルを読み取る方法を学びます。
head:
  - - meta
    - name: og:title
      content: Node.js でファイルを読み取る | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: fs.readFile()、fs.readFileSync()、fsPromises.readFile() メソッドを使用して Node.js でファイルを読み取る方法を学びます。
  - - meta
    - name: twitter:title
      content: Node.js でファイルを読み取る | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: fs.readFile()、fs.readFileSync()、fsPromises.readFile() メソッドを使用して Node.js でファイルを読み取る方法を学びます。
---


# Node.js でのファイルの読み込み

Node.js でファイルを読み込む最も簡単な方法は、`fs.readFile()` メソッドを使用し、ファイルパス、エンコーディング、およびファイルデータ（とエラー）とともに呼び出されるコールバック関数を渡すことです。

```javascript
const fs = require('node:fs')

fs.readFile('/Users/joe/test.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(data)
})
```

あるいは、同期バージョンの `fs.readFileSync()` を使用することもできます。

```javascript
const fs = require('node:fs')

try {
  const data = fs.readFileSync('/Users/joe/test.txt', 'utf8')
  console.log(data)
} catch (err) {
  console.error(err)
}
```

また、`fs/promises` モジュールで提供されている Promise ベースの `fsPromises.readFile()` メソッドを使用することもできます。

```javascript
const fs = require('node:fs/promises')

async function example() {
  try {
    const data = await fs.readFile('/Users/joe/test.txt', { encoding: 'utf8' })
    console.log(data)
  } catch (err) {
    console.log(err)
  }
}

example()
```

`fs.readFile()`、`fs.readFileSync()`、`fsPromises.readFile()` のすべてが、データを返す前にファイルの内容全体をメモリに読み込みます。

これは、大きなファイルがメモリ消費量とプログラムの実行速度に大きな影響を与えることを意味します。

この場合、ストリームを使用してファイルの内容を読み取る方が良い選択肢です。

