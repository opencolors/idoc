---
title: Node.js 文件路径
description: 了解 Node.js 中的文件路径，包括系统文件路径、`path` 模块，以及如何从路径中提取信息。
head:
  - - meta
    - name: og:title
      content: Node.js 文件路径 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解 Node.js 中的文件路径，包括系统文件路径、`path` 模块，以及如何从路径中提取信息。
  - - meta
    - name: twitter:title
      content: Node.js 文件路径 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解 Node.js 中的文件路径，包括系统文件路径、`path` 模块，以及如何从路径中提取信息。
---


# Node.js 文件路径

## 系统文件路径

系统中每个文件都有一个路径。在 Linux 和 macOS 上，路径可能看起来像这样：`/users/joe/file.txt`

而 Windows 计算机则具有不同的结构，例如：`C:\users\joe\file.txt`

在应用程序中使用路径时需要注意，因为必须考虑到这种差异。

## 使用 `path` 模块

可以使用以下方式将此模块包含在文件中：

```javascript
const path = require('node:path')
```

然后就可以开始使用它的方法了。

## 从路径中获取信息

给定一个路径，可以使用以下方法从中提取信息：

- `dirname`: 获取文件的父文件夹
- `basename`: 获取文件名部分
- `extname`: 获取文件扩展名

### 示例

::: code-group

```javascript [CJS]
const path = require('node:path')
const notes = '/users/joe/notes.txt'

path.dirname(notes) // /users/joe
path.extname(notes) // .txt
```

```javascript [MJS]
import path from 'node:path'
const notes = '/users/joe/notes.txt'

path.dirname(notes) // /users/joe
path.extname(notes) // .txt
```

:::

可以通过为 `basename` 指定第二个参数来获取不带扩展名的文件名：

```javascript
path.basename(notes, path.extname(notes)) // notes
```

## 使用路径

可以使用 `path.join()` 连接路径的两个或多个部分：

```javascript
path.join('/users', 'joe', 'file.txt') // /users/joe/file.txt
```

可以使用 `path.resolve()` 获取相对路径的绝对路径计算：

```javascript
path.resolve('joe.txt') // 如果从我的主文件夹运行，则为 /Users/joe/joe.txt
path.resolve('tmp', 'joe.txt') // 如果从我的主文件夹运行，则为 /Users/joe/tmp/joe.txt
```

在这种情况下，Node.js 会简单地将 `/joe.txt` 附加到当前工作目录。如果将第二个参数指定为文件夹，则 `resolve` 将使用第一个参数作为第二个参数的基础。

如果第一个参数以斜杠开头，则表示它是绝对路径：

```javascript
path.resolve('/etc', 'joe.txt') // /etc/joe.txt
```

`path.normalize()` 是另一个有用的函数，它会尝试计算包含相对说明符（如 `.` 或 `..`）或双斜杠的实际路径：

```javascript
path.normalize('/users/joe/../test.txt') // /users/test.txt
```

`resolve` 和 `normalize` 都不会检查路径是否存在。它们只是根据获得的信息计算路径。

