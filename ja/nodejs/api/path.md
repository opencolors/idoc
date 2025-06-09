---
title: Node.js パスモジュールのドキュメント
description: Node.jsのパスモジュールは、ファイルおよびディレクトリのパスを扱うためのユーティリティを提供します。プラットフォームに依存しない方法でファイルパスの処理や変換を行うためのメソッドを提供しており、例えばパス正規化、パス結合、パス解決、パス解析などが含まれます。
head:
  - - meta
    - name: og:title
      content: Node.js パスモジュールのドキュメント | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのパスモジュールは、ファイルおよびディレクトリのパスを扱うためのユーティリティを提供します。プラットフォームに依存しない方法でファイルパスの処理や変換を行うためのメソッドを提供しており、例えばパス正規化、パス結合、パス解決、パス解析などが含まれます。
  - - meta
    - name: twitter:title
      content: Node.js パスモジュールのドキュメント | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのパスモジュールは、ファイルおよびディレクトリのパスを扱うためのユーティリティを提供します。プラットフォームに依存しない方法でファイルパスの処理や変換を行うためのメソッドを提供しており、例えばパス正規化、パス結合、パス解決、パス解析などが含まれます。
---


# Path {#path}

::: tip [Stable: 2 - 安定]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [安定度: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/path.js](https://github.com/nodejs/node/blob/v23.5.0/lib/path.js)

`node:path` モジュールは、ファイルとディレクトリのパスを扱うためのユーティリティを提供します。 これは以下を使用してアクセスできます。

::: code-group
```js [CJS]
const path = require('node:path');
```

```js [ESM]
import path from 'node:path';
```
:::

## Windows 対 POSIX {#windows-vs-posix}

`node:path` モジュールのデフォルトの動作は、Node.js アプリケーションが実行されているオペレーティングシステムによって異なります。 具体的には、Windows オペレーティングシステム上で実行する場合、`node:path` モジュールは Windows 形式のパスが使用されていると想定します。

そのため、`path.basename()` を使用すると、POSIX と Windows で異なる結果が得られる可能性があります。

POSIX の場合:

```js [ESM]
path.basename('C:\\temp\\myfile.html');
// 返り値: 'C:\\temp\\myfile.html'
```
Windows の場合:

```js [ESM]
path.basename('C:\\temp\\myfile.html');
// 返り値: 'myfile.html'
```
任意のオペレーティングシステムで Windows ファイルパスを扱う際に一貫した結果を得るには、[`path.win32`](/ja/nodejs/api/path#pathwin32) を使用してください。

POSIX と Windows の場合:

```js [ESM]
path.win32.basename('C:\\temp\\myfile.html');
// 返り値: 'myfile.html'
```
任意のオペレーティングシステムで POSIX ファイルパスを扱う際に一貫した結果を得るには、[`path.posix`](/ja/nodejs/api/path#pathposix) を使用してください。

POSIX と Windows の場合:

```js [ESM]
path.posix.basename('/tmp/myfile.html');
// 返り値: 'myfile.html'
```
Windows Node.js は、ドライブごとのワーキングディレクトリの概念に従います。 この動作は、バックスラッシュなしでドライブパスを使用する場合に観察できます。 たとえば、`path.resolve('C:\\')` は `path.resolve('C:')` とは異なる結果を返す可能性があります。 詳細については、[この MSDN ページ](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#fully-qualified-vs-relative-paths) を参照してください。

## `path.basename(path[, suffix])` {#pathbasenamepath-suffix}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v6.0.0 | `path` 引数として文字列以外を渡すと例外がスローされるようになりました。 |
| v0.1.25 | 追加: v0.1.25 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `suffix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 削除するオプションのサフィックス
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`path.basename()` メソッドは、Unix の `basename` コマンドと同様に、`path` の最後の部分を返します。 末尾の [ディレクトリ区切り文字](/ja/nodejs/api/path#pathsep) は無視されます。

```js [ESM]
path.basename('/foo/bar/baz/asdf/quux.html');
// 返り値: 'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// 返り値: 'quux'
```
通常、Windows はファイル拡張子を含むファイル名を大文字と小文字を区別しない方法で扱いますが、この関数はそうではありません。 たとえば、`C:\\foo.html` と `C:\\foo.HTML` は同じファイルを参照しますが、`basename` は拡張子を大文字と小文字を区別する文字列として扱います。

```js [ESM]
path.win32.basename('C:\\foo.html', '.html');
// 返り値: 'foo'

path.win32.basename('C:\\foo.HTML', '.html');
// 返り値: 'foo.HTML'
```
`path` が文字列でない場合、または `suffix` が指定されていて文字列でない場合は、[`TypeError`](/ja/nodejs/api/errors#class-typeerror) がスローされます。


## `path.delimiter` {#pathdelimiter}

**Added in: v0.9.3**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

プラットフォーム固有のパス区切り文字を提供します。

- Windows の場合は `;`
- POSIX の場合は `:`

例えば、POSIX の場合:

```js [ESM]
console.log(process.env.PATH);
// Prints: '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

process.env.PATH.split(path.delimiter);
// Returns: ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin']
```
Windows の場合:

```js [ESM]
console.log(process.env.PATH);
// Prints: 'C:\Windows\system32;C:\Windows;C:\Program Files\node\'

process.env.PATH.split(path.delimiter);
// Returns ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\']
```
## `path.dirname(path)` {#pathdirnamepath}


::: info [History]
| Version | Changes |
| --- | --- |
| v6.0.0 | `path` 引数として文字列以外を渡すと、例外がスローされるようになりました。 |
| v0.1.16 | Added in: v0.1.16 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`path.dirname()` メソッドは、Unix の `dirname` コマンドと同様に、`path` のディレクトリ名を返します。末尾のディレクトリ区切り文字は無視されます。[`path.sep`](/ja/nodejs/api/path#pathsep) を参照してください。

```js [ESM]
path.dirname('/foo/bar/baz/asdf/quux');
// Returns: '/foo/bar/baz/asdf'
```
`path` が文字列でない場合、[`TypeError`](/ja/nodejs/api/errors#class-typeerror) がスローされます。

## `path.extname(path)` {#pathextnamepath}


::: info [History]
| Version | Changes |
| --- | --- |
| v6.0.0 | `path` 引数として文字列以外を渡すと、例外がスローされるようになりました。 |
| v0.1.25 | Added in: v0.1.25 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`path.extname()` メソッドは、`path` の拡張子を返します。拡張子は、`path` の最後の部分にある `.` (ピリオド) 文字の最後の出現から文字列の最後までです。`path` の最後の部分に `.` がない場合、または `path` のベース名 ( `path.basename()`を参照) の最初の文字以外の `.` 文字がない場合は、空の文字列が返されます。

```js [ESM]
path.extname('index.html');
// Returns: '.html'

path.extname('index.coffee.md');
// Returns: '.md'

path.extname('index.');
// Returns: '.'

path.extname('index');
// Returns: ''

path.extname('.index');
// Returns: ''

path.extname('.index.md');
// Returns: '.md'
```
`path` が文字列でない場合、[`TypeError`](/ja/nodejs/api/errors#class-typeerror) がスローされます。


## `path.format(pathObject)` {#pathformatpathobject}

::: info [History]
| Version | Changes |
| --- | --- |
| v19.0.0 | `ext` でドットが指定されていない場合、ドットが追加されます。 |
| v0.11.15 | Added in: v0.11.15 |
:::

- `pathObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 以下のプロパティを持つ任意の JavaScript オブジェクト: 
    - `dir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `root` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `ext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`path.format()` メソッドは、オブジェクトからパス文字列を返します。これは、[`path.parse()`](/ja/nodejs/api/path#pathparsepath) の反対です。

`pathObject` にプロパティを指定する場合、あるプロパティが別のプロパティよりも優先される組み合わせがあることに注意してください。

- `pathObject.dir` が指定されている場合、`pathObject.root` は無視されます。
- `pathObject.base` が存在する場合、`pathObject.ext` と `pathObject.name` は無視されます。

たとえば、POSIX では次のようになります。

```js [ESM]
// `dir`、`root`、および `base` が指定されている場合、
// `${dir}${path.sep}${base}`
// が返されます。`root` は無視されます。
path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.txt',
});
// 返り値: '/home/user/dir/file.txt'

// `dir` が指定されていない場合は `root` が使用されます。
// `root` のみが指定されているか、`dir` が `root` と等しい場合、
// プラットフォームの区切り文字は含まれません。`ext` は無視されます。
path.format({
  root: '/',
  base: 'file.txt',
  ext: 'ignored',
});
// 返り値: '/file.txt'

// `base` が指定されていない場合は `name` + `ext` が使用されます。
path.format({
  root: '/',
  name: 'file',
  ext: '.txt',
});
// 返り値: '/file.txt'

// `ext` でドットが指定されていない場合、ドットが追加されます。
path.format({
  root: '/',
  name: 'file',
  ext: 'txt',
});
// 返り値: '/file.txt'
```
Windows の場合:

```js [ESM]
path.format({
  dir: 'C:\\path\\dir',
  base: 'file.txt',
});
// 返り値: 'C:\\path\\dir\\file.txt'
```

## `path.matchesGlob(path, pattern)` {#pathmatchesglobpath-pattern}

**追加:** v22.5.0, v20.17.0

::: warning [Stable: 1 - 実験的]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) グロブマッチを行うパス。
- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) パスをチェックするグロブ。
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `path` が `pattern` に一致するかどうか。

`path.matchesGlob()` メソッドは、`path` が `pattern` に一致するかどうかを判断します。

例：

```js [ESM]
path.matchesGlob('/foo/bar', '/foo/*'); // true
path.matchesGlob('/foo/bar*', 'foo/bird'); // false
```
`path` または `pattern` が文字列でない場合、[`TypeError`](/ja/nodejs/api/errors#class-typeerror) がスローされます。

## `path.isAbsolute(path)` {#pathisabsolutepath}

**追加:** v0.11.2

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`path.isAbsolute()` メソッドは、`path` が絶対パスかどうかを判断します。

指定された `path` が長さゼロの文字列の場合、`false` が返されます。

たとえば、POSIX では次のようになります。

```js [ESM]
path.isAbsolute('/foo/bar'); // true
path.isAbsolute('/baz/..');  // true
path.isAbsolute('qux/');     // false
path.isAbsolute('.');        // false
```
Windows の場合:

```js [ESM]
path.isAbsolute('//server');    // true
path.isAbsolute('\\\\server');  // true
path.isAbsolute('C:/foo/..');   // true
path.isAbsolute('C:\\foo\\..'); // true
path.isAbsolute('bar\\baz');    // false
path.isAbsolute('bar/baz');     // false
path.isAbsolute('.');           // false
```
`path` が文字列でない場合、[`TypeError`](/ja/nodejs/api/errors#class-typeerror) がスローされます。

## `path.join([...paths])` {#pathjoinpaths}

**追加:** v0.1.16

- `...paths` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) パスセグメントのシーケンス
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`path.join()` メソッドは、指定されたすべての `path` セグメントを、プラットフォーム固有の区切り文字を使用して結合し、結果のパスを正規化します。

長さゼロの `path` セグメントは無視されます。 結合されたパス文字列が長さゼロの文字列である場合、現在のワーキングディレクトリを表す `'.'` が返されます。

```js [ESM]
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// 返り値: '/foo/bar/baz/asdf'

path.join('foo', {}, 'bar');
// 'TypeError: Path must be a string. Received {}' がスローされます
```
いずれかのパスセグメントが文字列でない場合、[`TypeError`](/ja/nodejs/api/errors#class-typeerror) がスローされます。


## `path.normalize(path)` {#pathnormalizepath}

**Added in: v0.1.23**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`path.normalize()` メソッドは、与えられた `path` を正規化し、`'..'` と `'.'` セグメントを解決します。

複数の連続したパスセグメント区切り文字が見つかった場合 (例えば、POSIX では `/` で、Windows では `\` または `/`)、それらはプラットフォーム固有のパスセグメント区切り文字の単一のインスタンスに置き換えられます (POSIX では `/`、Windows では `\` )。末尾の区切り文字は保持されます。

`path` が長さ 0 の文字列の場合、現在の作業ディレクトリを表す `'.'` が返されます。

POSIX では、この関数によって適用される正規化の種類は、POSIX 仕様に厳密に準拠していません。たとえば、この関数は、先頭の 2 つのスラッシュを、通常の絶対パスであるかのように単一のスラッシュに置き換えますが、いくつかの POSIX システムでは、先頭に 2 つのスラッシュが付いたパスに特別な意味を割り当てています。同様に、`..` セグメントの削除など、この関数によって実行される他の置換は、基盤となるシステムがパスを解決する方法を変更する可能性があります。

例えば、POSIX では:

```js [ESM]
path.normalize('/foo/bar//baz/asdf/quux/..');
// Returns: '/foo/bar/baz/asdf'
```
Windows の場合:

```js [ESM]
path.normalize('C:\\temp\\\\foo\\bar\\..\\');
// Returns: 'C:\\temp\\foo\\'
```
Windows は複数のパス区切り文字を認識するため、両方の区切り文字が Windows で推奨される区切り文字 (`\`) のインスタンスに置き換えられます。

```js [ESM]
path.win32.normalize('C:////temp\\\\/\\/\\/foo/bar');
// Returns: 'C:\\temp\\foo\\bar'
```
`path` が文字列でない場合、[`TypeError`](/ja/nodejs/api/errors#class-typeerror) がスローされます。

## `path.parse(path)` {#pathparsepath}

**Added in: v0.11.15**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`path.parse()` メソッドは、プロパティが `path` の重要な要素を表すオブジェクトを返します。末尾のディレクトリ区切り文字は無視されます。[`path.sep`](/ja/nodejs/api/path#pathsep) を参照してください。

返されるオブジェクトは、次のプロパティを持ちます。

- `dir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `root` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `ext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

例えば、POSIX では:

```js [ESM]
path.parse('/home/user/dir/file.txt');
// Returns:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```
```text [TEXT]
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
(All spaces in the "" line should be ignored. They are purely for formatting.)
```
Windows の場合:

```js [ESM]
path.parse('C:\\path\\dir\\file.txt');
// Returns:
// { root: 'C:\\',
//   dir: 'C:\\path\\dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```
```text [TEXT]
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
" C:\      path\dir   \ file  .txt "
└──────┴──────────────┴──────┴─────┘
(All spaces in the "" line should be ignored. They are purely for formatting.)
```
`path` が文字列でない場合、[`TypeError`](/ja/nodejs/api/errors#class-typeerror) がスローされます。


## `path.posix` {#pathposix}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v15.3.0 | `require('path/posix')` として公開されました。 |
| v0.11.15 | 追加: v0.11.15 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`path.posix` プロパティは、`path` メソッドの POSIX 固有の実装へのアクセスを提供します。

この API には、`require('node:path').posix` または `require('node:path/posix')` でアクセスできます。

## `path.relative(from, to)` {#pathrelativefrom-to}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v6.8.0 | Windows では、UNC パスの先頭のスラッシュが戻り値に含まれるようになりました。 |
| v0.5.0 | 追加: v0.5.0 |
:::

- `from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`path.relative()` メソッドは、現在のワーキングディレクトリに基づいて、`from` から `to` への相対パスを返します。`from` と `to` がそれぞれ同じパスに解決される場合（それぞれに対して `path.resolve()` を呼び出した後）、長さ 0 の文字列が返されます。

長さ 0 の文字列が `from` または `to` として渡された場合、長さ 0 の文字列の代わりに現在のワーキングディレクトリが使用されます。

たとえば、POSIX では次のようになります。

```js [ESM]
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// 戻り値: '../../impl/bbb'
```
Windows の場合：

```js [ESM]
path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb');
// 戻り値: '..\\..\\impl\\bbb'
```
`from` または `to` が文字列でない場合、[`TypeError`](/ja/nodejs/api/errors#class-typeerror) がスローされます。

## `path.resolve([...paths])` {#pathresolvepaths}

**追加: v0.3.4**

- `...paths` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) パスまたはパスセグメントのシーケンス
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`path.resolve()` メソッドは、パスまたはパスセグメントのシーケンスを絶対パスに解決します。

与えられたパスのシーケンスは右から左に処理され、絶対パスが構築されるまで後続の `path` が先頭に追加されます。たとえば、パスセグメントのシーケンス `/foo`、`/bar`、`baz` が与えられた場合、`path.resolve('/foo', '/bar', 'baz')` を呼び出すと `/bar/baz` が返されます。これは、`'baz'` が絶対パスではないものの、`'/bar' + '/' + 'baz'` は絶対パスであるためです。

与えられたすべての `path` セグメントの処理後、まだ絶対パスが生成されていない場合は、現在のワーキングディレクトリが使用されます。

結果のパスは正規化され、パスがルートディレクトリに解決されない限り、末尾のスラッシュは削除されます。

長さ 0 の `path` セグメントは無視されます。

`path` セグメントが渡されない場合、`path.resolve()` は現在のワーキングディレクトリの絶対パスを返します。

```js [ESM]
path.resolve('/foo/bar', './baz');
// 戻り値: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// 戻り値: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// 現在のワーキングディレクトリが /home/myself/node の場合、
// これは '/home/myself/node/wwwroot/static_files/gif/image.gif' を返します。
```
いずれかの引数が文字列でない場合、[`TypeError`](/ja/nodejs/api/errors#class-typeerror) がスローされます。


## `path.sep` {#pathsep}

**Added in: v0.7.9**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

プラットフォーム固有のパスセグメントの区切り文字を提供します。

- Windows では `\`
- POSIX では `/`

たとえば、POSIX の場合:

```js [ESM]
'foo/bar/baz'.split(path.sep);
// Returns: ['foo', 'bar', 'baz']
```
Windows の場合:

```js [ESM]
'foo\\bar\\baz'.split(path.sep);
// Returns: ['foo', 'bar', 'baz']
```
Windows では、スラッシュ (`/`) とバックスラッシュ (`\`) の両方がパスセグメントの区切り文字として受け入れられます。ただし、`path` メソッドはバックスラッシュ (`\`) のみを追加します。

## `path.toNamespacedPath(path)` {#pathtonamespacedpathpath}

**Added in: v9.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Windows システムのみで、指定された `path` に相当する [名前空間プレフィックス付きパス](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#namespaces) を返します。`path` が文字列でない場合、`path` は変更されずに返されます。

このメソッドは、Windows システムでのみ意味があります。POSIX システムでは、このメソッドは動作せず、常に `path` を変更せずに返します。

## `path.win32` {#pathwin32}

::: info [History]
| Version | Changes |
| --- | --- |
| v15.3.0 | `require('path/win32')` として公開されました。 |
| v0.11.15 | Added in: v0.11.15 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`path.win32` プロパティは、`path` メソッドの Windows 固有の実装へのアクセスを提供します。

この API は、`require('node:path').win32` または `require('node:path/win32')` を介してアクセスできます。

