---
title: Node.js 中追加文件内容
description: 了解如何使用 Node.js 中的 fs.appendFile() 和 fs.appendFileSync() 方法追加文件内容，包括示例代码和代码片段。
head:
  - - meta
    - name: og:title
      content: Node.js 中追加文件内容 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解如何使用 Node.js 中的 fs.appendFile() 和 fs.appendFileSync() 方法追加文件内容，包括示例代码和代码片段。
  - - meta
    - name: twitter:title
      content: Node.js 中追加文件内容 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解如何使用 Node.js 中的 fs.appendFile() 和 fs.appendFileSync() 方法追加文件内容，包括示例代码和代码片段。
---


# 使用 Node.js 写入文件

## 写入文件

在 Node.js 中写入文件的最简单方法是使用 `fs.writeFile()` API。

```javascript
const fs = require('node:fs')
const content = 'Some content!'

fs.writeFile('/Users/joe/test.txt', content, err => {
  if (err) {
    console.error(err)
  } else {
    // file written successfully
  }
})
```

### 同步写入文件

或者，您可以使用同步版本 `fs.writeFileSync`:

```javascript
const fs = require('node:fs')
const content = 'Some content!'

try {
  fs.writeFileSync('/Users/joe/test.txt', content)
} catch (err) {
  console.error(err)
}
```

您还可以使用由 `fs/promises` 模块提供的基于 Promise 的 `fsPromises.writeFile()` 方法：

```javascript
const fs = require('node:fs/promises')
async function example() {
  try {
    const content = 'Some content!'
    await fs.writeFile('/Users/joe/test.txt', content)
  } catch (err) {
    console.log(err)
  }
}

example()
```

默认情况下，如果文件已存在，此 API 将替换该文件的内容。

您可以通过指定一个标志来修改默认行为：

```javascript
fs.writeFile('/Users/joe/test.txt', content, { flag: 'a+' }, err => [])
```

您可能会用到的标志有：
| 标志 | 描述 | 如果文件不存在是否创建 |
| --- | --- | --- |
| `r+` | 此标志打开文件以进行读取和写入 | :x: |
| `w+` | 此标志打开文件以进行读取和写入，并且还将流定位在文件的开头 | :white_check_mark: |
| `a` | 此标志打开文件以进行写入，并且还将流定位在文件的末尾 | :white_check_mark: |
| `a+` | 此标志打开文件以进行读取和写入，并且还将流定位在文件的末尾 | :white_check_mark: |

您可以在 fs 文档中找到有关这些标志的更多信息。

## 向文件中追加内容

当您不想用新内容覆盖文件，而是想添加到文件中时，追加到文件会很方便。


### 示例

一种方便地将内容附加到文件末尾的方法是 `fs.appendFile()` (以及它的同步对应方法 `fs.appendFileSync()`):

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

### 使用 Promise 的示例

这是一个 `fsPromises.appendFile()` 的示例:

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

