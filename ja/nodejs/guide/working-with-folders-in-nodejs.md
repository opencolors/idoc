---
title: Node.js でフォルダを操作する
description: Node.js で fs モジュールを使用してフォルダを操作する方法を学びます。フォルダの存在を確認する、フォルダを作成する、ディレクトリの内容を読み取る、フォルダを名前変更する、フォルダを削除するなどです。
head:
  - - meta
    - name: og:title
      content: Node.js でフォルダを操作する | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js で fs モジュールを使用してフォルダを操作する方法を学びます。フォルダの存在を確認する、フォルダを作成する、ディレクトリの内容を読み取る、フォルダを名前変更する、フォルダを削除するなどです。
  - - meta
    - name: twitter:title
      content: Node.js でフォルダを操作する | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js で fs モジュールを使用してフォルダを操作する方法を学びます。フォルダの存在を確認する、フォルダを作成する、ディレクトリの内容を読み取る、フォルダを名前変更する、フォルダを削除するなどです。
---


# Node.js でのフォルダー操作

Node.js の `fs` コアモジュールは、フォルダー操作に使用できる多くの便利なメソッドを提供します。

## フォルダーが存在するかどうかの確認

`fs.access()` (およびその Promise ベースの対応物 `fsPromises.access()`) を使用して、フォルダーが存在するかどうか、および Node.js がその権限でアクセスできるかどうかを確認します。
```javascript
const fs = require('node:fs');

try {
  await fs.promises.access('/Users/joe');
} catch (err) {
  throw err;
}
```

## 新しいフォルダーの作成

`fs.mkdir()` または `fs.mkdirSync()` または `fsPromises.mkdir()` を使用して、新しいフォルダーを作成します。
```javascript
const fs = require('node:fs');
const folderName = '/Users/joe/test';

try {
  fs.mkdirSync(folderName);
} catch (err) {
  console.error(err);
}
```

## ディレクトリの内容の読み取り

`fs.readdir()` または `fs.readdirSync()` または `fsPromises.readdir()` を使用して、ディレクトリの内容を読み取ります。

このコードは、フォルダーの内容 (ファイルとサブフォルダーの両方) を読み取り、それらの相対パスを返します。
```javascript
const fs = require('node:fs');
const folderPath = '/Users/joe';
fs.readdirSync(folderPath).map(fileName => {
  return path.join(folderPath, fileName);
});
```

フルパスを取得できます。
```javascript
fs.readdirSync(folderPath)
  .map(fileName => path.join(folderPath, fileName));
```

結果をフィルタリングして、ファイルのみを返し、フォルダーを除外することもできます。
```javascript
const fs = require('node:fs');
const isFile = fileName => !fileName.includes(path.sep);

fs.readdirSync(folderPath)
  .map(fileName => path.join(folderPath, fileName))
  .filter(isFile);
```

## フォルダーの名前変更

`fs.rename()` または `fs.renameSync()` または `fsPromises.rename()` を使用して、フォルダーの名前を変更します。最初のパラメーターは現在のパス、2 番目のパラメーターは新しいパスです。
```javascript
const fs = require('node:fs');
fs.rename('/Users/joe', '/Users/roger', err => {
  if (err) {
    console.error(err);
  }
});
```

`fs.renameSync()` は同期バージョンです。
```javascript
const fs = require('node:fs');
try {
  fs.renameSync('/Users/joe', '/Users/roger');
} catch (err) {
  console.error(err);
}
```

`fsPromises.rename()` は Promise ベースのバージョンです。
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


## フォルダを削除する

フォルダを削除するには、`fs.rmdir()`、`fs.rmdirSync()`、または `fsPromises.rmdir()` を使用します。
```javascript
const fs = require('node:fs');
fs.rmdir(dir, err => {
  if (err) {
    throw err;
  }
  console.log(`${dir} is deleted!`);
});
```

コンテンツが含まれているフォルダを削除するには、`fs.rm()` をオプション `{ recursive: true }` と共に使用して、コンテンツを再帰的に削除します。

`{ recursive: true, force: true }` を使用すると、フォルダが存在しない場合に例外が無視されます。
```javascript
const fs = require('node:fs');
fs.rm(dir, { recursive: true, force: true }, err => {
  if (err) {
    throw err;
  }
  console.log(`${dir} is deleted!`);
});
```
