---
title: Node.js 文件状态
description: 了解如何使用 Node.js 的 fs 模块的 stat() 方法来检查文件详细信息，包括文件类型、大小等。
head:
  - - meta
    - name: og:title
      content: Node.js 文件状态 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解如何使用 Node.js 的 fs 模块的 stat() 方法来检查文件详细信息，包括文件类型、大小等。
  - - meta
    - name: twitter:title
      content: Node.js 文件状态 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解如何使用 Node.js 的 fs 模块的 stat() 方法来检查文件详细信息，包括文件类型、大小等。
---


# Node.js 文件状态

每个文件都附带一组我们可以使用 Node.js 检查的详细信息。 特别是，使用 [fs 模块](/zh/nodejs/api/fs) 提供的 `stat()` 方法。

你调用它并传递一个文件路径，一旦 Node.js 获取了文件详细信息，它将调用你传递的回调函数，带有 2 个参数：一个错误消息和文件状态：

```js
import fs from 'node:fs'
fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err)
  }
  // 我们可以在 `stats` 中访问文件状态
})
```

Node.js 还提供了一个同步方法，它会阻塞线程直到文件状态准备就绪：

```js
import fs from 'node:fs'
try {
  const stats = fs.statSync('/Users/joe/test.txt')
} catch (err) {
  console.error(err)
}
```

文件信息包含在 stats 变量中。 我们可以使用 stats 提取什么样的信息？

**很多，包括：**

- 使用 `stats.isFile()` 和 `stats.isDirectory()` 来判断文件是目录还是文件
- 使用 `stats.isSymbolicLink()` 判断文件是否为符号链接
- 使用 `stats.size` 获取文件大小（以字节为单位）。

还有其他高级方法，但你日常编程中会用到的大部分就是这些。

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

如果你愿意，也可以使用基于 Promise 的 `fsPromises.stat()` 方法，它由 `fs/promises` 模块提供：

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

你可以在 [文件系统模块](/zh/nodejs/api/fs) 文档中阅读有关 fs 模块的更多信息。

