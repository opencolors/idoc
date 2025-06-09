---
title: Node.js のファイルパス
description: Node.js のファイルパスについて、システムファイルパス、`path` モジュール、パスから情報を抽出する方法を学びます。
head:
  - - meta
    - name: og:title
      content: Node.js のファイルパス | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js のファイルパスについて、システムファイルパス、`path` モジュール、パスから情報を抽出する方法を学びます。
  - - meta
    - name: twitter:title
      content: Node.js のファイルパス | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js のファイルパスについて、システムファイルパス、`path` モジュール、パスから情報を抽出する方法を学びます。
---


# Node.js ファイルパス

## システムファイルパス

システム内のすべてのファイルにはパスがあります。LinuxとmacOSでは、パスは次のようになります。`/users/joe/file.txt`

一方、Windowsコンピュータは次のような異なる構造を持っています。`C:\users\joe\file.txt`

アプリケーションでパスを使用する場合は、この違いを考慮する必要があるため、注意が必要です。

## `path`モジュールの使用

このモジュールは、次のようにしてファイルに含めます。

```javascript
const path = require('node:path')
```

これで、そのメソッドの使用を開始できます。

## パスから情報を取得する

パスが与えられた場合、次のメソッドを使用してそこから情報を抽出できます。

- `dirname`: ファイルの親フォルダを取得します
- `basename`: ファイル名部分を取得します
- `extname`: ファイル拡張子を取得します

### 例

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

`basename`に2番目の引数として拡張子を指定することで、拡張子なしでファイル名を取得できます。

```javascript
path.basename(notes, path.extname(notes)) // notes
```

## パスの操作

`path.join()`を使用すると、パスの2つ以上の部分を結合できます。

```javascript
path.join('/users', 'joe', 'file.txt') // /users/joe/file.txt
```

`path.resolve()`を使用して、相対パスの絶対パス計算を取得できます。

```javascript
path.resolve('joe.txt') // ホームフォルダから実行した場合 /Users/joe/joe.txt
path.resolve('tmp', 'joe.txt') // ホームフォルダから実行した場合 /Users/joe/tmp/joe.txt
```

この場合、Node.jsは単に`/joe.txt`を現在の作業ディレクトリに追加します。2番目のパラメータをフォルダとして指定すると、`resolve`は最初のパラメータを2番目のパラメータのベースとして使用します。

最初のパラメータがスラッシュで始まる場合、それは絶対パスであることを意味します。

```javascript
path.resolve('/etc', 'joe.txt') // /etc/joe.txt
```

`path.normalize()`は、`.`や`..`のような相対指定子、または二重スラッシュが含まれている場合に、実際のパスを計算しようとするもう1つの便利な関数です。

```javascript
path.normalize('/users/joe/../test.txt') // /users/test.txt
```

`resolve`も`normalize`も、パスが存在するかどうかを確認しません。それらは、取得した情報に基づいてパスを計算するだけです。

