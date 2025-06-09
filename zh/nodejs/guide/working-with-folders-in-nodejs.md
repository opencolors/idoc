---
title: 在 Node.js 中使用文件夹
description: 了解如何使用 Node.js 的 fs 核心模块处理文件夹，包括检查文件夹是否存在、创建新文件夹、读取文件夹内容、重命名文件夹和删除文件夹。
head:
  - - meta
    - name: og:title
      content: 在 Node.js 中使用文件夹 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解如何使用 Node.js 的 fs 核心模块处理文件夹，包括检查文件夹是否存在、创建新文件夹、读取文件夹内容、重命名文件夹和删除文件夹。
  - - meta
    - name: twitter:title
      content: 在 Node.js 中使用文件夹 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解如何使用 Node.js 的 fs 核心模块处理文件夹，包括检查文件夹是否存在、创建新文件夹、读取文件夹内容、重命名文件夹和删除文件夹。
---


# 在 Node.js 中处理文件夹

Node.js 的 `fs` 核心模块提供了许多方便的方法，可用于处理文件夹。

## 检查文件夹是否存在

使用 `fs.access()`（以及其基于 Promise 的对应项 `fsPromises.access()`）来检查文件夹是否存在，以及 Node.js 是否可以使用其权限访问它。
```javascript
const fs = require('node:fs');

try {
  await fs.promises.access('/Users/joe');
} catch (err) {
  throw err;
}
```

## 创建新文件夹

使用 `fs.mkdir()` 或 `fs.mkdirSync()` 或 `fsPromises.mkdir()` 来创建新文件夹。
```javascript
const fs = require('node:fs');
const folderName = '/Users/joe/test';

try {
  fs.mkdirSync(folderName);
} catch (err) {
  console.error(err);
}
```

## 读取目录的内容

使用 `fs.readdir()` 或 `fs.readdirSync()` 或 `fsPromises.readdir()` 来读取目录的内容。

这段代码读取一个文件夹的内容，包括文件和子文件夹，并返回它们的相对路径：
```javascript
const fs = require('node:fs');
const folderPath = '/Users/joe';
fs.readdirSync(folderPath).map(fileName => {
  return path.join(folderPath, fileName);
});
```

你可以获取完整路径：
```javascript
fs.readdirSync(folderPath)
  .map(fileName => path.join(folderPath, fileName));
```

你也可以过滤结果，只返回文件，排除文件夹：
```javascript
const fs = require('node:fs');
const isFile = fileName => !fileName.includes(path.sep);

fs.readdirSync(folderPath)
  .map(fileName => path.join(folderPath, fileName))
  .filter(isFile);
```

## 重命名文件夹

使用 `fs.rename()` 或 `fs.renameSync()` 或 `fsPromises.rename()` 来重命名文件夹。第一个参数是当前路径，第二个参数是新路径：
```javascript
const fs = require('node:fs');
fs.rename('/Users/joe', '/Users/roger', err => {
  if (err) {
    console.error(err);
  }
});
```

`fs.renameSync()` 是同步版本：
```javascript
const fs = require('node:fs');
try {
  fs.renameSync('/Users/joe', '/Users/roger');
} catch (err) {
  console.error(err);
}
```

`fsPromises.rename()` 是基于 Promise 的版本：
```javascript
const fs = require('node:fs/promises');
async function example() {
  try {
    await fs.rename('/Users/joe', '/Users/roger');
  } catch (err) {
    console.log(err);
  }
}
example();
```

## 移除文件夹

使用 `fs.rmdir()` 或 `fs.rmdirSync()` 或 `fsPromises.rmdir()` 移除文件夹。
```javascript
const fs = require('node:fs');
fs.rmdir(dir, err => {
  if (err) {
    throw err;
  }
  console.log(`${dir} is deleted!`);
});
```

要移除包含内容的文件夹，使用 `fs.rm()` 并设置选项 `{ recursive: true }` 来递归地移除内容。

`{ recursive: true, force: true }` 使异常在文件夹不存在时被忽略。
```javascript
const fs = require('node:fs');
fs.rm(dir, { recursive: true, force: true }, err => {
  if (err) {
    throw err;
  }
  console.log(`${dir} is deleted!`);
});
```

