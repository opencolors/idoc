---
title: Node.js でファイルにコンテンツを追加する
description: Node.js で fs.appendFile() と fs.appendFileSync() メソッドを使用してファイルにコンテンツを追加する方法を学びます。サンプルコードとコードスニペットを含みます。
head:
  - - meta
    - name: og:title
      content: Node.js でファイルにコンテンツを追加する | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js で fs.appendFile() と fs.appendFileSync() メソッドを使用してファイルにコンテンツを追加する方法を学びます。サンプルコードとコードスニペットを含みます。
  - - meta
    - name: twitter:title
      content: Node.js でファイルにコンテンツを追加する | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js で fs.appendFile() と fs.appendFileSync() メソッドを使用してファイルにコンテンツを追加する方法を学びます。サンプルコードとコードスニペットを含みます。
---


# Node.js でのファイル書き込み

## ファイルを書き込む

Node.js でファイルに書き込む最も簡単な方法は、`fs.writeFile()` API を使用することです。

```javascript
const fs = require('node:fs')
const content = '何らかのコンテンツ!'

fs.writeFile('/Users/joe/test.txt', content, err => {
  if (err) {
    console.error(err)
  } else {
    // ファイルは正常に書き込まれました
  }
})
```

### ファイルを同期的に書き込む

または、同期バージョンの `fs.writeFileSync` を使用できます。

```javascript
const fs = require('node:fs')
const content = '何らかのコンテンツ!'

try {
  fs.writeFileSync('/Users/joe/test.txt', content)
} catch (err) {
  console.error(err)
}
```

`fs/promises` モジュールによって提供される、Promise ベースの `fsPromises.writeFile()` メソッドも使用できます。

```javascript
const fs = require('node:fs/promises')
async function example() {
  try {
    const content = '何らかのコンテンツ!'
    await fs.writeFile('/Users/joe/test.txt', content)
  } catch (err) {
    console.log(err)
  }
}

example()
```

デフォルトでは、この API はファイルが既に存在する場合、ファイルの内容を置き換えます。

フラグを指定して、デフォルトを変更できます。

```javascript
fs.writeFile('/Users/joe/test.txt', content, { flag: 'a+' }, err => [])
```

使用する可能性の高いフラグは次のとおりです。
| フラグ | 説明 | ファイルが存在しない場合に作成される |
| --- | --- | --- |
| `r+` | このフラグは、ファイルを読み取りと書き込みのために開きます | :x: |
| `w+` | このフラグは、ファイルを読み取りと書き込みのために開き、ストリームをファイルの先頭に配置します | :white_check_mark: |
| `a` | このフラグは、ファイルを書き込みのために開き、ストリームをファイルの最後に配置します | :white_check_mark: |
| `a+` | このストリームは、ファイルを読み取りと書き込みのために開き、ストリームをファイルの最後に配置します | :white_check_mark: |

フラグの詳細については、fs のドキュメントを参照してください。

## ファイルにコンテンツを追加する

ファイルへの追加は、新しいコンテンツでファイルを上書きするのではなく、ファイルに追加する場合に便利です。


### 例

ファイルにコンテンツを追加するのに便利な方法は、`fs.appendFile()`（およびその同期的バージョンである`fs.appendFileSync()`）です。

```javascript
const fs = require('node:fs')
const content = 'Some content!'

fs.appendFile('file_log', content, err => {
  if (err) {
    console.error(err)
  } else {
    // done!
  }
})
```

### Promise を使用した例

`fsPromises.appendFile()` の例を以下に示します。

```javascript
const fs = require('node:fs/promises')
async function example() {
  try {
    const content = 'Some content!'
    await fs.appendFile('/Users/joe/test.txt', content)
  } catch (err) {
    console.log(err)
  }
}

example()
```

