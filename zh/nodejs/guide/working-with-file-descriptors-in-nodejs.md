---
title: 在 Node.js 中打开文件
description: 了解如何使用 fs 模块在 Node.js 中打开文件，包括同步和异步方法，以及基于 promise 的方法。
head:
  - - meta
    - name: og:title
      content: 在 Node.js 中打开文件 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解如何使用 fs 模块在 Node.js 中打开文件，包括同步和异步方法，以及基于 promise 的方法。
  - - meta
    - name: twitter:title
      content: 在 Node.js 中打开文件 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解如何使用 fs 模块在 Node.js 中打开文件，包括同步和异步方法，以及基于 promise 的方法。
---


# 在 Node.js 中使用文件描述符

在您可以与文件系统中存在的文件进行交互之前，您必须获取一个文件描述符。文件描述符是对打开文件的引用，是一个数字 (fd)，通过使用 `fs` 模块提供的 `open()` 方法打开文件来返回。此数字 (fd) 唯一标识操作系统中的一个打开文件。

## 打开文件

### CommonJS (CJS)

```javascript
const fs = require('node:fs');
fs.open('/Users/joe/test.txt', 'r', (err, fd) => {
  // fd 是我们的文件描述符
});
```

请注意我们用作 `fs.open()` 调用的第二个参数的 `'r'`。该标志表示我们打开文件以进行读取。您常用的其他标志是：

| 标志   | 描述                                                                   |
|------|------------------------------------------------------------------------|
| `'w+'`| 此标志打开文件以进行读取和写入。它将流定位在文件的开头。                                      |
| `'a+'`| 此标志打开文件以进行读取和写入，并将流定位在文件的末尾。                                      |

您还可以使用 `fs.openSync` 方法打开文件，该方法返回文件描述符，而不是在回调中提供它：

```javascript
const fs = require('node:fs');

try {
  const fd = fs.openSync('/Users/joe/test.txt', 'r');
} catch (err) {
  console.error(err);
}
```

## 执行操作

无论您选择哪种方式获取文件描述符，您都可以执行所有需要它的操作，例如调用 `fs.close()` 和许多其他与文件系统交互的操作。

## 使用 fsPromises

您还可以使用 `fs/promises` 模块提供的基于 Promise 的 `fsPromises.open` 方法打开文件。 `fs/promises` 模块仅从 Node.js v14 开始提供。在 v14 之前，在 v10 之后，您可以改用 `require('fs').promises`。在 v10 之前，在 v8 之后，您可以使用 `util.promisify` 将 `fs` 方法转换为基于 Promise 的方法。

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


## util.promisify 的例子

这是一个使用 `util.promisify` 将 `fs.open` 转换为基于 Promise 的函数的例子：

```javascript
const fs = require('node:fs');
const util = require('node:util');

const open = util.promisify(fs.open);

open('test.txt', 'r')
  .then((fd) => {
    // 使用文件描述符
  })
  .catch((err) => {
    // 处理错误
  });
```

要查看关于 `fs/promises` 模块的更多细节，请查阅 [fs/promises API 文档](/zh/nodejs/api/fs#promises)。

