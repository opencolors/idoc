---
title: Node.js でファイルを開く
description: fs モジュールを使用して Node.js でファイルを開く方法を学びます。同期および非同期メソッド、および promise ベースのアプローチを含みます。
head:
  - - meta
    - name: og:title
      content: Node.js でファイルを開く | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: fs モジュールを使用して Node.js でファイルを開く方法を学びます。同期および非同期メソッド、および promise ベースのアプローチを含みます。
  - - meta
    - name: twitter:title
      content: Node.js でファイルを開く | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: fs モジュールを使用して Node.js でファイルを開く方法を学びます。同期および非同期メソッド、および promise ベースのアプローチを含みます。
---


# Node.js でのファイル記述子の操作

ファイルシステムに存在するファイルとやり取りするには、まずファイル記述子を取得する必要があります。ファイル記述子とは、開いているファイルへの参照であり、`fs` モジュールによって提供される `open()` メソッドを使用してファイルを開くことで返される数値 (fd) です。この数値 (fd) は、オペレーティングシステムで開いているファイルを一意に識別します。

## ファイルを開く

### CommonJS (CJS)

```javascript
const fs = require('node:fs');
fs.open('/Users/joe/test.txt', 'r', (err, fd) => {
  // fd はファイル記述子です
});
```

`fs.open()` 呼び出しの 2 番目のパラメータとして使用した `'r'` に注目してください。このフラグは、読み取り用にファイルを開くことを意味します。一般的に使用するその他のフラグは次のとおりです。

| フラグ | 説明                                                                                                          |
|------|-------------------------------------------------------------------------------------------------------------|
| `'w+'`| このフラグは、読み取りと書き込みのためにファイルを開きます。ストリームをファイルの先頭に配置します。                                                                 |
| `'a+'`| このフラグは、読み取りと書き込みのためにファイルを開き、ストリームをファイルの末尾にも配置します。                                                                |

`fs.openSync` メソッドを使用してファイルを開くこともできます。このメソッドは、コールバックでファイル記述子を提供する代わりに、ファイル記述子を返します。

```javascript
const fs = require('node:fs');

try {
  const fd = fs.openSync('/Users/joe/test.txt', 'r');
} catch (err) {
  console.error(err);
}
```

## 操作の実行

任意の方法でファイル記述子を取得したら、`fs.close()` の呼び出しや、ファイルシステムとやり取りするその他の多くの操作など、それを必要とするすべての操作を実行できます。

## fsPromises の使用

`fs/promises` モジュールによって提供される promise ベースの `fsPromises.open` メソッドを使用してファイルを開くこともできます。`fs/promises` モジュールは、Node.js v14 からのみ使用可能です。v14 より前、v10 以降では、代わりに `require('fs').promises` を使用できます。v10 より前、v8 以降では、`util.promisify` を使用して `fs` メソッドを promise ベースのメソッドに変換できます。

### ES Modules (MJS)

```javascript
import fs from 'node:fs/promises';

async function run() {
  const fileHandle = await fs.open('example.txt', 'r');
  try {
    filehandle = await fs.open('/Users/joe/test.txt', 'r');
    console.log(filehandle.fd);
    console.log(await filehandle.readFile({ encoding: 'utf8' }));
  } finally {
    await fileHandle.close();
  }
}

run().catch(console.error);
```


## util.promisify の例

`util.promisify` を使用して `fs.open` を Promise ベースの関数に変換する例を次に示します。

```javascript
const fs = require('node:fs');
const util = require('node:util');

const open = util.promisify(fs.open);

open('test.txt', 'r')
  .then((fd) => {
    // Use file descriptor
  })
  .catch((err) => {
    // Handle error
  });
```

`fs/promises` モジュールの詳細については、[fs/promises API ドキュメント](/ja/nodejs/api/fs#promises) を参照してください。

