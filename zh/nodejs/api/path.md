---
title: Node.js 路径模块文档
description: Node.js 的路径模块提供了处理文件和目录路径的工具。它提供了跨平台的方法来处理和转换文件路径，包括路径规范化、路径拼接、路径解析和路径解析。
head:
  - - meta
    - name: og:title
      content: Node.js 路径模块文档 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 的路径模块提供了处理文件和目录路径的工具。它提供了跨平台的方法来处理和转换文件路径，包括路径规范化、路径拼接、路径解析和路径解析。
  - - meta
    - name: twitter:title
      content: Node.js 路径模块文档 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 的路径模块提供了处理文件和目录路径的工具。它提供了跨平台的方法来处理和转换文件路径，包括路径规范化、路径拼接、路径解析和路径解析。
---


# Path {#path}

::: tip [Stable: 2 - 稳定]
[Stable: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

**源代码:** [lib/path.js](https://github.com/nodejs/node/blob/v23.5.0/lib/path.js)

`node:path` 模块提供了用于处理文件和目录路径的实用工具。它可以通过以下方式访问：

::: code-group
```js [CJS]
const path = require('node:path');
```

```js [ESM]
import path from 'node:path';
```
:::

## Windows vs. POSIX {#windows-vs-posix}

`node:path` 模块的默认操作因 Node.js 应用程序运行的操作系统而异。 具体来说，在 Windows 操作系统上运行时，`node:path` 模块将假定正在使用 Windows 样式的路径。

因此，在 POSIX 和 Windows 上使用 `path.basename()` 可能会产生不同的结果：

在 POSIX 上：

```js [ESM]
path.basename('C:\\temp\\myfile.html');
// 返回: 'C:\\temp\\myfile.html'
```
在 Windows 上：

```js [ESM]
path.basename('C:\\temp\\myfile.html');
// 返回: 'myfile.html'
```
要在任何操作系统上处理 Windows 文件路径时获得一致的结果，请使用 [`path.win32`](/zh/nodejs/api/path#pathwin32)：

在 POSIX 和 Windows 上：

```js [ESM]
path.win32.basename('C:\\temp\\myfile.html');
// 返回: 'myfile.html'
```
要在任何操作系统上处理 POSIX 文件路径时获得一致的结果，请使用 [`path.posix`](/zh/nodejs/api/path#pathposix)：

在 POSIX 和 Windows 上：

```js [ESM]
path.posix.basename('/tmp/myfile.html');
// 返回: 'myfile.html'
```
在 Windows 上，Node.js 遵循每个驱动器工作目录的概念。 当使用没有反斜杠的驱动器路径时，可以观察到这种行为。 例如，`path.resolve('C:\\')` 可能会返回与 `path.resolve('C:')` 不同的结果。 有关更多信息，请参见 [此 MSDN 页面](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#fully-qualified-vs-relative-paths)。

## `path.basename(path[, suffix])` {#pathbasenamepath-suffix}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v6.0.0 | 现在将非字符串作为 `path` 参数传递会抛出错误。 |
| v0.1.25 | 添加于: v0.1.25 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `suffix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要移除的可选后缀
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`path.basename()` 方法返回 `path` 的最后一部分，类似于 Unix `basename` 命令。 尾部的[目录分隔符](/zh/nodejs/api/path#pathsep)会被忽略。

```js [ESM]
path.basename('/foo/bar/baz/asdf/quux.html');
// 返回: 'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// 返回: 'quux'
```
虽然 Windows 通常以不区分大小写的方式处理文件名（包括文件扩展名），但此函数不是。 例如，`C:\\foo.html` 和 `C:\\foo.HTML` 指的是同一个文件，但 `basename` 将扩展名视为区分大小写的字符串：

```js [ESM]
path.win32.basename('C:\\foo.html', '.html');
// 返回: 'foo'

path.win32.basename('C:\\foo.HTML', '.html');
// 返回: 'foo.HTML'
```
如果 `path` 不是字符串，或者如果给定了 `suffix` 且不是字符串，则会抛出 [`TypeError`](/zh/nodejs/api/errors#class-typeerror)。


## `path.delimiter` {#pathdelimiter}

**添加于: v0.9.3**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

提供特定于平台的路径分隔符：

- 对于 Windows 是 `;`
- 对于 POSIX 是 `:`

例如，在 POSIX 上：

```js [ESM]
console.log(process.env.PATH);
// 打印: '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

process.env.PATH.split(path.delimiter);
// 返回: ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin']
```
在 Windows 上：

```js [ESM]
console.log(process.env.PATH);
// 打印: 'C:\Windows\system32;C:\Windows;C:\Program Files\node\'

process.env.PATH.split(path.delimiter);
// 返回 ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\']
```
## `path.dirname(path)` {#pathdirnamepath}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v6.0.0 | 现在将非字符串作为 `path` 参数传递会抛出错误。 |
| v0.1.16 | 添加于: v0.1.16 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`path.dirname()` 方法返回 `path` 的目录名，类似于 Unix 的 `dirname` 命令。 尾部的目录分隔符会被忽略，参见 [`path.sep`](/zh/nodejs/api/path#pathsep)。

```js [ESM]
path.dirname('/foo/bar/baz/asdf/quux');
// 返回: '/foo/bar/baz/asdf'
```
如果 `path` 不是字符串，则会抛出 [`TypeError`](/zh/nodejs/api/errors#class-typeerror)。

## `path.extname(path)` {#pathextnamepath}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v6.0.0 | 现在将非字符串作为 `path` 参数传递会抛出错误。 |
| v0.1.25 | 添加于: v0.1.25 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`path.extname()` 方法返回 `path` 的扩展名，从 `path` 最后部分的最后一个 `.` （句点）字符到字符串的结尾。 如果 `path` 的最后一部分中没有 `.` ，或者除了 `path` 的基本名称的第一个字符之外没有 `.` 字符（参见 `path.basename()`），则返回一个空字符串。

```js [ESM]
path.extname('index.html');
// 返回: '.html'

path.extname('index.coffee.md');
// 返回: '.md'

path.extname('index.');
// 返回: '.'

path.extname('index');
// 返回: ''

path.extname('.index');
// 返回: ''

path.extname('.index.md');
// 返回: '.md'
```
如果 `path` 不是字符串，则会抛出 [`TypeError`](/zh/nodejs/api/errors#class-typeerror)。


## `path.format(pathObject)` {#pathformatpathobject}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v19.0.0 | 如果未在 `ext` 中指定，则会添加点。 |
| v0.11.15 | 添加于: v0.11.15 |
:::

- `pathObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 任何具有以下属性的 JavaScript 对象：
    - `dir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `root` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `ext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`path.format()` 方法从对象返回路径字符串。 这与 [`path.parse()`](/zh/nodejs/api/path#pathparsepath) 相反。

在为 `pathObject` 提供属性时，请记住存在一些组合，其中一个属性的优先级高于另一个属性：

- 如果提供了 `pathObject.dir`，则 `pathObject.root` 将被忽略
- 如果存在 `pathObject.base`，则 `pathObject.ext` 和 `pathObject.name` 将被忽略

例如，在 POSIX 上：

```js [ESM]
// 如果提供了 `dir`、`root` 和 `base`，
// 将返回 `${dir}${path.sep}${base}`。 `root` 将被忽略。
path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.txt',
});
// 返回: '/home/user/dir/file.txt'

// 如果未指定 `dir`，则将使用 `root`。
// 如果仅提供 `root` 或 `dir` 等于 `root`，则不包括平台分隔符。 `ext` 将被忽略。
path.format({
  root: '/',
  base: 'file.txt',
  ext: 'ignored',
});
// 返回: '/file.txt'

// 如果未指定 `base`，则将使用 `name` + `ext`。
path.format({
  root: '/',
  name: 'file',
  ext: '.txt',
});
// 返回: '/file.txt'

// 如果未在 `ext` 中指定点，则会添加点。
path.format({
  root: '/',
  name: 'file',
  ext: 'txt',
});
// 返回: '/file.txt'
```
在 Windows 上：

```js [ESM]
path.format({
  dir: 'C:\\path\\dir',
  base: 'file.txt',
});
// 返回: 'C:\\path\\dir\\file.txt'
```

## `path.matchesGlob(path, pattern)` {#pathmatchesglobpath-pattern}

**Added in: v22.5.0, v20.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要进行 glob 匹配的路径。
- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 用于检查路径的 glob 模式。
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `path` 是否与 `pattern` 匹配。

`path.matchesGlob()` 方法确定 `path` 是否与 `pattern` 匹配。

例如：

```js [ESM]
path.matchesGlob('/foo/bar', '/foo/*'); // true
path.matchesGlob('/foo/bar*', 'foo/bird'); // false
```
如果 `path` 或 `pattern` 不是字符串，则会抛出 [`TypeError`](/zh/nodejs/api/errors#class-typeerror)。

## `path.isAbsolute(path)` {#pathisabsolutepath}

**Added in: v0.11.2**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`path.isAbsolute()` 方法确定 `path` 是否为绝对路径。

如果给定的 `path` 是一个零长度的字符串，将返回 `false`。

例如，在 POSIX 系统上：

```js [ESM]
path.isAbsolute('/foo/bar'); // true
path.isAbsolute('/baz/..');  // true
path.isAbsolute('qux/');     // false
path.isAbsolute('.');        // false
```
在 Windows 系统上：

```js [ESM]
path.isAbsolute('//server');    // true
path.isAbsolute('\\\\server');  // true
path.isAbsolute('C:/foo/..');   // true
path.isAbsolute('C:\\foo\\..'); // true
path.isAbsolute('bar\\baz');    // false
path.isAbsolute('bar/baz');     // false
path.isAbsolute('.');           // false
```
如果 `path` 不是字符串，则会抛出 [`TypeError`](/zh/nodejs/api/errors#class-typeerror)。

## `path.join([...paths])` {#pathjoinpaths}

**Added in: v0.1.16**

- `...paths` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 一系列路径片段
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`path.join()` 方法使用平台特定的分隔符作为分隔符，将所有给定的 `path` 片段连接在一起，然后规范化生成的路径。

零长度的 `path` 片段会被忽略。 如果连接后的路径字符串是一个零长度的字符串，则将返回 `'.'`，表示当前工作目录。

```js [ESM]
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// 返回: '/foo/bar/baz/asdf'

path.join('foo', {}, 'bar');
// 抛出 'TypeError: Path must be a string. Received {}'
```
如果任何路径片段不是字符串，则会抛出 [`TypeError`](/zh/nodejs/api/errors#class-typeerror)。


## `path.normalize(path)` {#pathnormalizepath}

**Added in: v0.1.23**

- `path` [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type)

`path.normalize()` 方法会规范化给定的 `path`，解析 `'..'` 和 `'.'` 片段。

当找到多个连续的路径段分隔符（例如 POSIX 上的 `/` 和 Windows 上的 `\` 或 `/`）时，它们会被平台特定的路径段分隔符的单个实例替换（POSIX 上为 `/`，Windows 上为 `\`）。尾部的分隔符会被保留。

如果 `path` 是一个零长度的字符串，则返回 `'.'`，表示当前工作目录。

在 POSIX 上，此函数应用的规范化类型并不严格遵守 POSIX 规范。 例如，此函数会将两个前导正斜杠替换为单个斜杠，就像它是常规的绝对路径一样，而一些 POSIX 系统会为以两个正斜杠开头的路径赋予特殊含义。 类似地，此函数执行的其他替换（例如删除 `..` 段）可能会更改底层系统解析路径的方式。

例如，在 POSIX 上：

```js [ESM]
path.normalize('/foo/bar//baz/asdf/quux/..');
// 返回: '/foo/bar/baz/asdf'
```
在 Windows 上：

```js [ESM]
path.normalize('C:\\temp\\\\foo\\bar\\..\\');
// 返回: 'C:\\temp\\foo\\'
```
由于 Windows 识别多个路径分隔符，因此这两个分隔符都将被 Windows 首选分隔符 (`\`) 的实例替换：

```js [ESM]
path.win32.normalize('C:////temp\\\\/\\/\\/foo/bar');
// 返回: 'C:\\temp\\foo\\bar'
```
如果 `path` 不是字符串，则会抛出一个 [`TypeError`](/zh/nodejs/api/errors#class-typeerror)。

## `path.parse(path)` {#pathparsepath}

**Added in: v0.11.15**

- `path` [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<Object\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)

`path.parse()` 方法返回一个对象，该对象的属性表示 `path` 的重要元素。 尾部的目录分隔符会被忽略，请参阅 [`path.sep`](/zh/nodejs/api/path#pathsep)。

返回的对象将具有以下属性：

- `dir` [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type)
- `root` [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type)
- `base` [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type)
- `name` [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type)
- `ext` [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type)

例如，在 POSIX 上：

```js [ESM]
path.parse('/home/user/dir/file.txt');
// 返回:
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
(“” 行中的所有空格都应忽略。 它们仅用于格式化。)
```
在 Windows 上：

```js [ESM]
path.parse('C:\\path\\dir\\file.txt');
// 返回:
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
(“” 行中的所有空格都应忽略。 它们仅用于格式化。)
```
如果 `path` 不是字符串，则会抛出一个 [`TypeError`](/zh/nodejs/api/errors#class-typeerror)。


## `path.posix` {#pathposix}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.3.0 | 作为 `require('path/posix')` 暴露。 |
| v0.11.15 | 添加于：v0.11.15 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`path.posix` 属性提供了访问 `path` 方法的 POSIX 特定实现。

该 API 可通过 `require('node:path').posix` 或 `require('node:path/posix')` 访问。

## `path.relative(from, to)` {#pathrelativefrom-to}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v6.8.0 | 在 Windows 上，UNC 路径的前导斜杠现在包含在返回值中。 |
| v0.5.0 | 添加于：v0.5.0 |
:::

- `from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回：[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`path.relative()` 方法基于当前工作目录返回从 `from` 到 `to` 的相对路径。 如果 `from` 和 `to` 各自解析到相同的路径（在分别对每个路径调用 `path.resolve()` 之后），则返回零长度的字符串。

如果将零长度的字符串作为 `from` 或 `to` 传递，则将使用当前工作目录而不是零长度的字符串。

例如，在 POSIX 上：

```js [ESM]
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// 返回: '../../impl/bbb'
```
在 Windows 上：

```js [ESM]
path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb');
// 返回: '..\\..\\impl\\bbb'
```
如果 `from` 或 `to` 不是字符串，则抛出 [`TypeError`](/zh/nodejs/api/errors#class-typeerror)。

## `path.resolve([...paths])` {#pathresolvepaths}

**添加于: v0.3.4**

- `...paths` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 路径或路径段的序列
- 返回：[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`path.resolve()` 方法将路径或路径段的序列解析为绝对路径。

给定的路径序列从右到左处理，每个后续的 `path` 都会被添加到前面，直到构建出一个绝对路径。 例如，给定路径段序列：`/foo`、`/bar`、`baz`，调用 `path.resolve('/foo', '/bar', 'baz')` 将返回 `/bar/baz`，因为 `'baz'` 不是绝对路径，但 `'/bar' + '/' + 'baz'` 是。

如果在处理完所有给定的 `path` 段后，尚未生成绝对路径，则使用当前工作目录。

生成的路径会被规范化，并且尾部的斜杠会被移除，除非该路径解析为根目录。

零长度的 `path` 段会被忽略。

如果没有传递 `path` 段，`path.resolve()` 将返回当前工作目录的绝对路径。

```js [ESM]
path.resolve('/foo/bar', './baz');
// 返回: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// 返回: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// 如果当前工作目录是 /home/myself/node,
// 则返回 '/home/myself/node/wwwroot/static_files/gif/image.gif'
```
如果任何参数不是字符串，则抛出 [`TypeError`](/zh/nodejs/api/errors#class-typeerror)。


## `path.sep` {#pathsep}

**添加于: v0.7.9**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

提供特定于平台的路径段分隔符：

- Windows 上为 `\`
- POSIX 上为 `/`

例如，在 POSIX 上：

```js [ESM]
'foo/bar/baz'.split(path.sep);
// 返回: ['foo', 'bar', 'baz']
```
在 Windows 上：

```js [ESM]
'foo\\bar\\baz'.split(path.sep);
// 返回: ['foo', 'bar', 'baz']
```
在 Windows 上，正斜杠 (`/`) 和反斜杠 (`\`) 都被接受为路径段分隔符；但是，`path` 方法仅添加反斜杠 (`\`)。

## `path.toNamespacedPath(path)` {#pathtonamespacedpathpath}

**添加于: v9.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

仅在 Windows 系统上，返回给定 `path` 的等效 [命名空间前缀路径](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#namespaces)。 如果 `path` 不是字符串，则 `path` 将在不修改的情况下返回。

此方法仅在 Windows 系统上有意义。 在 POSIX 系统上，该方法不可操作，并且始终返回未修改的 `path`。

## `path.win32` {#pathwin32}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v15.3.0 | 作为 `require('path/win32')` 暴露。 |
| v0.11.15 | 添加于: v0.11.15 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`path.win32` 属性提供了对 `path` 方法的特定于 Windows 的实现的访问。

该 API 可通过 `require('node:path').win32` 或 `require('node:path/win32')` 访问。

