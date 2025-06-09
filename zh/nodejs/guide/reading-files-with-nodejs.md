---
title: 使用 Node.js 读取文件
description: 了解如何使用 fs.readFile()、fs.readFileSync() 和 fsPromises.readFile() 方法在 Node.js 中读取文件。
head:
  - - meta
    - name: og:title
      content: 使用 Node.js 读取文件 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解如何使用 fs.readFile()、fs.readFileSync() 和 fsPromises.readFile() 方法在 Node.js 中读取文件。
  - - meta
    - name: twitter:title
      content: 使用 Node.js 读取文件 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解如何使用 fs.readFile()、fs.readFileSync() 和 fsPromises.readFile() 方法在 Node.js 中读取文件。
---


# 使用 Node.js 读取文件

在 Node.js 中读取文件最简单的方法是使用 `fs.readFile()` 方法，传递文件路径、编码和一个回调函数，该函数将被调用并传递文件数据（和错误）：

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

或者，你可以使用同步版本 `fs.readFileSync()`：

```javascript
const fs = require('node:fs')

try {
  const data = fs.readFileSync('/Users/joe/test.txt', 'utf8')
  console.log(data)
} catch (err) {
  console.error(err)
}
```

你也可以使用 `fs/promises` 模块提供的基于 Promise 的 `fsPromises.readFile()` 方法：

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

`fs.readFile()`、`fs.readFileSync()` 和 `fsPromises.readFile()` 都会在返回数据之前将文件的全部内容读取到内存中。

这意味着大文件将对你的内存消耗和程序的执行速度产生重大影响。

在这种情况下，更好的选择是使用流来读取文件内容。

