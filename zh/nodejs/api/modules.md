---
title: Node.js 文档 - 模块
description: 了解 Node.js 关于模块的文档，包括 CommonJS、ES 模块以及如何管理依赖和模块解析。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 - 模块 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解 Node.js 关于模块的文档，包括 CommonJS、ES 模块以及如何管理依赖和模块解析。
  - - meta
    - name: twitter:title
      content: Node.js 文档 - 模块 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解 Node.js 关于模块的文档，包括 CommonJS、ES 模块以及如何管理依赖和模块解析。
---


# 模块：CommonJS 模块 {#modules-commonjs-modules}

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

CommonJS 模块是 Node.js 最初的 JavaScript 代码打包方式。 Node.js 也支持浏览器和其他 JavaScript 运行时使用的 [ECMAScript 模块](/zh/nodejs/api/esm) 标准。

在 Node.js 中，每个文件都被视为一个单独的模块。 例如，考虑一个名为 `foo.js` 的文件：

```js [ESM]
const circle = require('./circle.js');
console.log(`半径为 4 的圆的面积是 ${circle.area(4)}`);
```
在第一行，`foo.js` 加载了与 `foo.js` 位于同一目录中的模块 `circle.js`。

以下是 `circle.js` 的内容：

```js [ESM]
const { PI } = Math;

exports.area = (r) => PI * r ** 2;

exports.circumference = (r) => 2 * PI * r;
```
模块 `circle.js` 导出了函数 `area()` 和 `circumference()`。 通过在特殊的 `exports` 对象上指定额外的属性，可以将函数和对象添加到模块的根目录。

模块的局部变量将是私有的，因为该模块由 Node.js 包装在一个函数中（请参阅 [模块包装器](/zh/nodejs/api/modules#the-module-wrapper)）。 在此示例中，变量 `PI` 对于 `circle.js` 是私有的。

`module.exports` 属性可以被赋予一个新值（例如函数或对象）。

在以下代码中，`bar.js` 使用 `square` 模块，该模块导出一个 Square 类：

```js [ESM]
const Square = require('./square.js');
const mySquare = new Square(2);
console.log(`mySquare 的面积是 ${mySquare.area()}`);
```
`square` 模块在 `square.js` 中定义：

```js [ESM]
// 赋值给 exports 不会修改模块，必须使用 module.exports
module.exports = class Square {
  constructor(width) {
    this.width = width;
  }

  area() {
    return this.width ** 2;
  }
};
```
CommonJS 模块系统在 [`module` 核心模块](/zh/nodejs/api/module) 中实现。

## 启用 {#enabling}

Node.js 有两个模块系统：CommonJS 模块和 [ECMAScript 模块](/zh/nodejs/api/esm)。

默认情况下，Node.js 会将以下内容视为 CommonJS 模块：

- 扩展名为 `.cjs` 的文件；
- 当最近的父级 `package.json` 文件包含一个顶层字段 [`"type"`](/zh/nodejs/api/packages#type)，其值为 `"commonjs"` 时，扩展名为 `.js` 的文件。
- 当最近的父级 `package.json` 文件不包含顶层字段 [`"type"`](/zh/nodejs/api/packages#type) 或任何父文件夹中没有 `package.json` 时，扩展名为 `.js` 或没有扩展名的文件；除非该文件包含语法错误，除非将其作为 ES 模块进行评估。 包作者应包含 [`"type"`](/zh/nodejs/api/packages#type) 字段，即使在所有源都是 CommonJS 的包中也是如此。 显式指定包的 `type` 将使构建工具和加载程序更容易确定包中的文件应如何解释。
- 扩展名不是 `.mjs`、`.cjs`、`.json`、`.node` 或 `.js` 的文件（当最近的父级 `package.json` 文件包含一个顶层字段 [`"type"`](/zh/nodejs/api/packages#type)，其值为 `"module"` 时，这些文件只有通过 `require()` 引入时才会被识别为 CommonJS 模块，而不是用作程序的命令行入口点）。

有关更多详细信息，请参阅 [确定模块系统](/zh/nodejs/api/packages#determining-module-system)。

调用 `require()` 始终使用 CommonJS 模块加载器。 调用 `import()` 始终使用 ECMAScript 模块加载器。


## 访问主模块 {#accessing-the-main-module}

当一个文件直接从 Node.js 运行时，`require.main` 会被设置为它的 `module`。这意味着可以通过测试 `require.main === module` 来确定一个文件是否被直接运行。

对于文件 `foo.js`，如果通过 `node foo.js` 运行，这将是 `true`，但如果通过 `require('./foo')` 运行，则为 `false`。

当入口点不是 CommonJS 模块时，`require.main` 是 `undefined`，并且无法访问主模块。

## 包管理器提示 {#package-manager-tips}

Node.js `require()` 函数的语义被设计得足够通用，以支持合理的目录结构。诸如 `dpkg`、`rpm` 和 `npm` 之类的包管理器程序有望能够从 Node.js 模块构建原生包，而无需修改。

在下面，我们给出一个建议的目录结构，该结构可能会起作用：

假设我们想让 `/usr/lib/node/\<some-package\>/\<some-version\>` 文件夹保存特定版本的软件包的内容。

软件包可以相互依赖。为了安装软件包 `foo`，可能需要安装特定版本的软件包 `bar`。`bar` 包本身可能具有依赖项，并且在某些情况下，这些依赖项甚至可能发生冲突或形成循环依赖关系。

因为 Node.js 会查找它加载的任何模块的 `realpath`（也就是说，它会解析符号链接），然后[在 `node_modules` 文件夹中查找它们的依赖项](/zh/nodejs/api/modules#loading-from-node_modules-folders)，所以可以使用以下架构来解决这种情况：

- `/usr/lib/node/foo/1.2.3/`: `foo` 软件包的内容，版本 1.2.3。
- `/usr/lib/node/bar/4.3.2/`: `foo` 依赖的 `bar` 软件包的内容。
- `/usr/lib/node/foo/1.2.3/node_modules/bar`: 指向 `/usr/lib/node/bar/4.3.2/` 的符号链接。
- `/usr/lib/node/bar/4.3.2/node_modules/*`: 指向 `bar` 依赖的软件包的符号链接。

因此，即使遇到循环，或者存在依赖关系冲突，每个模块都将能够获得它可以使用的依赖项版本。

当 `foo` 软件包中的代码执行 `require('bar')` 时，它将获得符号链接到 `/usr/lib/node/foo/1.2.3/node_modules/bar` 的版本。然后，当 `bar` 软件包中的代码调用 `require('quux')` 时，它将获得符号链接到 `/usr/lib/node/bar/4.3.2/node_modules/quux` 的版本。

此外，为了使模块查找过程更加优化，我们可以将软件包放置在 `/usr/lib/node_modules/\<name\>/\<version\>` 中，而不是直接放在 `/usr/lib/node` 中。这样，Node.js 就不会费心在 `/usr/node_modules` 或 `/node_modules` 中查找缺少的依赖项。

为了使模块可用于 Node.js REPL，将 `/usr/lib/node_modules` 文件夹添加到 `$NODE_PATH` 环境变量中可能会很有用。由于使用 `node_modules` 文件夹的模块查找都是相对的，并且基于调用 `require()` 的文件的真实路径，因此软件包本身可以位于任何位置。


## 使用 `require()` 加载 ECMAScript 模块 {#loading-ecmascript-modules-using-require}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.5.0 | 默认情况下，此功能不再发出实验性警告，但仍然可以通过 `--trace-require-module` 发出警告。 |
| v23.0.0 | 此功能不再位于 `--experimental-require-module` CLI 标志之后。 |
| v23.0.0 | 支持在 `require(esm)` 中 `'module.exports'` 互操作导出。 |
| v22.0.0, v20.17.0 | 添加于：v22.0.0, v20.17.0 |
:::

::: warning [稳定: 1 - 实验性]
[稳定: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).2 - 发布候选
:::

`.mjs` 扩展名保留给 [ECMAScript 模块](/zh/nodejs/api/esm)。 有关哪些文件被解析为 ECMAScript 模块的更多信息，请参见[确定模块系统](/zh/nodejs/api/packages#determining-module-system)章节。

`require()` 仅支持加载满足以下要求的 ECMAScript 模块：

- 该模块是完全同步的（不包含顶层 `await`）；并且
- 满足以下条件之一：

如果被加载的 ES 模块满足要求，`require()` 可以加载它并返回模块命名空间对象。 在这种情况下，它类似于动态 `import()`，但同步运行并直接返回命名空间对象。

对于以下 ES 模块：

```js [ESM]
// distance.mjs
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }
```
```js [ESM]
// point.mjs
export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}
```
CommonJS 模块可以使用 `require()` 加载它们：

```js [CJS]
const distance = require('./distance.mjs');
console.log(distance);
// [Module: null prototype] {
//   distance: [Function: distance]
// }

const point = require('./point.mjs');
console.log(point);
// [Module: null prototype] {
//   default: [class Point],
//   __esModule: true,
// }
```

为了与现有的将 ES 模块转换为 CommonJS 的工具进行互操作，这些工具然后可以通过 `require()` 加载真正的 ES 模块，返回的命名空间将包含一个 `__esModule: true` 属性（如果它具有 `default` 导出），以便由工具生成的消费代码可以识别真实 ES 模块中的默认导出。 如果命名空间已经定义了 `__esModule`，则不会添加此属性。 此属性是实验性的，将来可能会更改。 它应该只被将 ES 模块转换为 CommonJS 模块的工具使用，遵循现有的生态系统约定。 直接在 CommonJS 中编写的代码应避免依赖它。

当 ES 模块同时包含命名导出和默认导出时，`require()` 返回的结果是模块命名空间对象，该对象将默认导出放在 `.default` 属性中，类似于 `import()` 返回的结果。 要自定义直接由 `require(esm)` 返回的内容，ES 模块可以使用字符串名称 `"module.exports"` 导出所需的值。

```js [ESM]
// point.mjs
export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}

// `distance` 对此模块的 CommonJS 使用者来说是丢失的，除非它作为静态属性添加到 `Point` 中。
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }
export { Point as 'module.exports' }
```
```js [CJS]
const Point = require('./point.mjs');
console.log(Point); // [class Point]

// 当使用 'module.exports' 时，命名导出将会丢失
const { distance } = require('./point.mjs');
console.log(distance); // undefined
```
请注意，在上面的示例中，当使用 `module.exports` 导出名称时，命名导出将对 CommonJS 使用者丢失。 为了允许 CommonJS 使用者继续访问命名导出，模块可以确保默认导出是一个对象，并将命名导出作为属性附加到该对象。 例如，在上面的示例中，`distance` 可以作为静态方法附加到默认导出 `Point` 类。

```js [ESM]
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }

export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
  static distance = distance;
}

export { Point as 'module.exports' }
```
```js [CJS]
const Point = require('./point.mjs');
console.log(Point); // [class Point]

const { distance } = require('./point.mjs');
console.log(distance); // [Function: distance]
```

如果被 `require()` 的模块包含顶层 `await`，或者它 `import` 的模块图包含顶层 `await`，则会抛出 [`ERR_REQUIRE_ASYNC_MODULE`](/zh/nodejs/api/errors#err_require_async_module)。 在这种情况下，用户应使用 [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) 加载异步模块。

如果启用了 `--experimental-print-required-tla`，则 Node.js 不会在评估之前抛出 `ERR_REQUIRE_ASYNC_MODULE`，而是会评估该模块，尝试找到顶层 await，并打印它们的位置以帮助用户修复它们。

使用 `require()` 加载 ES 模块的支持目前是实验性的，可以使用 `--no-experimental-require-module` 禁用。 要打印使用此功能的位置，请使用 [`--trace-require-module`](/zh/nodejs/api/cli#--trace-require-modulemode)。

可以通过检查 [`process.features.require_module`](/zh/nodejs/api/process#processfeaturesrequire_module) 是否为 `true` 来检测此功能。


## 全部组合起来 {#all-together}

要获取在调用 `require()` 时将加载的确切文件名，请使用 `require.resolve()` 函数。

将以上所有内容放在一起，以下是 `require()` 的伪代码高级算法：

```text [TEXT]
require(X) from module at path Y
1. 如果 X 是一个核心模块，
   a. 返回核心模块
   b. 停止
2. 如果 X 以 '/' 开头
   a. 设置 Y 为文件系统根目录
3. 如果 X 以 './' 或 '/' 或 '../' 开头
   a. LOAD_AS_FILE(Y + X)
   b. LOAD_AS_DIRECTORY(Y + X)
   c. 抛出 "not found"
4. 如果 X 以 '#' 开头
   a. LOAD_PACKAGE_IMPORTS(X, dirname(Y))
5. LOAD_PACKAGE_SELF(X, dirname(Y))
6. LOAD_NODE_MODULES(X, dirname(Y))
7. 抛出 "not found"

MAYBE_DETECT_AND_LOAD(X)
1. 如果 X 可以解析为 CommonJS 模块，则将 X 加载为 CommonJS 模块。停止。
2. 否则，如果 X 的源代码可以使用
  <a href="esm.md#resolver-algorithm-specification">在 ESM 解析器中定义的 DETECT_MODULE_SYNTAX</a> 解析为 ECMAScript 模块，
  a. 将 X 加载为 ECMAScript 模块。停止。
3. 抛出在 1 中尝试将 X 解析为 CommonJS 时的 SyntaxError。停止。

LOAD_AS_FILE(X)
1. 如果 X 是一个文件，则以其文件扩展名格式加载 X。停止
2. 如果 X.js 是一个文件，
    a. 找到最接近 X 的包作用域 SCOPE。
    b. 如果未找到作用域
      1. MAYBE_DETECT_AND_LOAD(X.js)
    c. 如果 SCOPE/package.json 包含 "type" 字段，
      1. 如果 "type" 字段是 "module"，则将 X.js 加载为 ECMAScript 模块。停止。
      2. 如果 "type" 字段是 "commonjs"，则将 X.js 加载为 CommonJS 模块。停止。
    d. MAYBE_DETECT_AND_LOAD(X.js)
3. 如果 X.json 是一个文件，则将 X.json 加载到 JavaScript 对象。停止
4. 如果 X.node 是一个文件，则将 X.node 加载为二进制插件。停止

LOAD_INDEX(X)
1. 如果 X/index.js 是一个文件
    a. 找到最接近 X 的包作用域 SCOPE。
    b. 如果未找到作用域，则将 X/index.js 加载为 CommonJS 模块。停止。
    c. 如果 SCOPE/package.json 包含 "type" 字段，
      1. 如果 "type" 字段是 "module"，则将 X/index.js 加载为 ECMAScript 模块。停止。
      2. 否则，将 X/index.js 加载为 CommonJS 模块。停止。
2. 如果 X/index.json 是一个文件，则将 X/index.json 解析为 JavaScript 对象。停止
3. 如果 X/index.node 是一个文件，则将 X/index.node 加载为二进制插件。停止

LOAD_AS_DIRECTORY(X)
1. 如果 X/package.json 是一个文件，
   a. 解析 X/package.json，并查找 "main" 字段。
   b. 如果 "main" 是一个虚值，则转到 2。
   c. let M = X + (json main 字段)
   d. LOAD_AS_FILE(M)
   e. LOAD_INDEX(M)
   f. LOAD_INDEX(X) DEPRECATED
   g. 抛出 "not found"
2. LOAD_INDEX(X)

LOAD_NODE_MODULES(X, START)
1. let DIRS = NODE_MODULES_PATHS(START)
2. for each DIR in DIRS:
   a. LOAD_PACKAGE_EXPORTS(X, DIR)
   b. LOAD_AS_FILE(DIR/X)
   c. LOAD_AS_DIRECTORY(DIR/X)

NODE_MODULES_PATHS(START)
1. let PARTS = path split(START)
2. let I = count of PARTS - 1
3. let DIRS = []
4. while I >= 0,
   a. if PARTS[I] = "node_modules", GOTO d.
   b. DIR = path join(PARTS[0 .. I] + "node_modules")
   c. DIRS = DIR + DIRS
   d. let I = I - 1
5. return DIRS + GLOBAL_FOLDERS

LOAD_PACKAGE_IMPORTS(X, DIR)
1. 找到最接近 DIR 的包作用域 SCOPE。
2. 如果未找到作用域，则返回。
3. 如果 SCOPE/package.json "imports" 为 null 或 undefined，则返回。
4. 如果启用了 `--experimental-require-module`
  a. let CONDITIONS = ["node", "require", "module-sync"]
  b. 否则，let CONDITIONS = ["node", "require"]
5. let MATCH = PACKAGE_IMPORTS_RESOLVE(X, pathToFileURL(SCOPE),
  CONDITIONS) <a href="esm.md#resolver-algorithm-specification">在 ESM 解析器中定义</a>。
6. RESOLVE_ESM_MATCH(MATCH).

LOAD_PACKAGE_EXPORTS(X, DIR)
1. 尝试将 X 解释为 NAME 和 SUBPATH 的组合，其中名称可能具有 @scope/ 前缀，并且子路径以斜杠 (`/`) 开头。
2. 如果 X 不匹配此模式，或者 DIR/NAME/package.json 不是文件，则返回。
3. 解析 DIR/NAME/package.json，并查找 "exports" 字段。
4. 如果 "exports" 为 null 或 undefined，则返回。
5. 如果启用了 `--experimental-require-module`
  a. let CONDITIONS = ["node", "require", "module-sync"]
  b. 否则，let CONDITIONS = ["node", "require"]
6. let MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(DIR/NAME), "." + SUBPATH,
   `package.json` "exports", CONDITIONS) <a href="esm.md#resolver-algorithm-specification">在 ESM 解析器中定义</a>。
7. RESOLVE_ESM_MATCH(MATCH)

LOAD_PACKAGE_SELF(X, DIR)
1. 找到最接近 DIR 的包作用域 SCOPE。
2. 如果未找到作用域，则返回。
3. 如果 SCOPE/package.json "exports" 为 null 或 undefined，则返回。
4. 如果 SCOPE/package.json "name" 不是 X 的第一个段，则返回。
5. let MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(SCOPE),
   "." + X.slice("name".length), `package.json` "exports", ["node", "require"])
   <a href="esm.md#resolver-algorithm-specification">在 ESM 解析器中定义</a>。
6. RESOLVE_ESM_MATCH(MATCH)

RESOLVE_ESM_MATCH(MATCH)
1. let RESOLVED_PATH = fileURLToPath(MATCH)
2. 如果 RESOLVED_PATH 处的文件存在，则以其扩展名格式加载 RESOLVED_PATH。停止
3. 抛出 "not found"
```

## 缓存 {#caching}

模块在第一次加载后会被缓存。这意味着（以及其他含义）每次调用 `require('foo')` 都会返回完全相同的对象，如果它们解析为相同的文件。

假设 `require.cache` 未被修改，多次调用 `require('foo')` 不会导致模块代码被多次执行。这是一个重要的特性。有了它，就可以返回“部分完成”的对象，从而即使在它们导致循环的情况下也能加载传递依赖项。

要使模块多次执行代码，请导出一个函数并调用该函数。

### 模块缓存注意事项 {#module-caching-caveats}

模块根据它们解析后的文件名进行缓存。由于模块可能根据调用模块的位置（从 `node_modules` 文件夹加载）解析为不同的文件名，因此不能 *保证* `require('foo')` 总是返回完全相同的对象，如果它们解析为不同的文件。

此外，在不区分大小写的文件系统或操作系统上，不同的解析文件名可能指向同一个文件，但缓存仍会将它们视为不同的模块，并多次重新加载该文件。例如，`require('./foo')` 和 `require('./FOO')` 返回两个不同的对象，无论 `./foo` 和 `./FOO` 是否是同一个文件。

## 内置模块 {#built-in-modules}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v16.0.0, v14.18.0 | 添加了对 `require(...)` 的 `node:` 导入支持。 |
:::

Node.js 在二进制文件中编译了几个模块。这些模块在本文档的其他地方有更详细的描述。

内置模块在 Node.js 源代码中定义，位于 `lib/` 文件夹中。

内置模块可以使用 `node:` 前缀来标识，在这种情况下，它会绕过 `require` 缓存。例如，即使存在同名的 `require.cache` 条目，`require('node:http')` 也会始终返回内置的 HTTP 模块。

如果将某些内置模块的标识符传递给 `require()`，则始终优先加载这些内置模块。例如，即使存在同名的文件，`require('http')` 也会始终返回内置的 HTTP 模块。无需使用 `node:` 前缀即可加载的内置模块列表在 [`module.builtinModules`](/zh/nodejs/api/module#modulebuiltinmodules) 中公开，列出时没有前缀。


### 具有强制性 `node:` 前缀的内置模块 {#built-in-modules-with-mandatory-node-prefix}

当通过 `require()` 加载时，某些内置模块必须使用 `node:` 前缀进行请求。 存在此要求是为了防止新引入的内置模块与已经占用该名称的用户空间包发生冲突。 目前，需要 `node:` 前缀的内置模块包括：

- [`node:sea`](/zh/nodejs/api/single-executable-applications#single-executable-application-api)
- [`node:sqlite`](/zh/nodejs/api/sqlite)
- [`node:test`](/zh/nodejs/api/test)
- [`node:test/reporters`](/zh/nodejs/api/test#test-reporters)

这些模块的列表在 [`module.builtinModules`](/zh/nodejs/api/module#modulebuiltinmodules) 中公开，包括前缀。

## 循环引用 {#cycles}

当存在循环 `require()` 调用时，模块在返回时可能尚未完成执行。

考虑以下情况：

`a.js`:

```js [ESM]
console.log('a starting');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done');
```
`b.js`:

```js [ESM]
console.log('b starting');
exports.done = false;
const a = require('./a.js');
console.log('in b, a.done = %j', a.done);
exports.done = true;
console.log('b done');
```
`main.js`:

```js [ESM]
console.log('main starting');
const a = require('./a.js');
const b = require('./b.js');
console.log('in main, a.done = %j, b.done = %j', a.done, b.done);
```
当 `main.js` 加载 `a.js` 时，`a.js` 接着加载 `b.js`。 此时，`b.js` 尝试加载 `a.js`。 为了防止无限循环，`a.js` 导出对象的一个**未完成的副本**会被返回到 `b.js` 模块。 然后 `b.js` 完成加载，并且它的 `exports` 对象会被提供给 `a.js` 模块。

当 `main.js` 加载完这两个模块时，它们都完成了。 因此，该程序的输出将是：

```bash [BASH]
$ node main.js
main starting
a starting
b starting
in b, a.done = false
b done
in a, b.done = true
a done
in main, a.done = true, b.done = true
```
需要仔细规划，以允许循环模块依赖关系在应用程序中正常工作。


## 文件模块 {#file-modules}

如果找不到精确的文件名，则 Node.js 将尝试加载带有附加扩展名的所需文件名：`.js`、`.json` 和最后 `.node`。 加载具有不同扩展名（例如 `.cjs`）的文件时，必须将包括文件扩展名在内的完整名称传递给 `require()`（例如 `require('./file.cjs')`）。

`.json` 文件被解析为 JSON 文本文件，`.node` 文件被解释为使用 `process.dlopen()` 加载的已编译的插件模块。 使用任何其他扩展名（或根本没有扩展名）的文件都将被解析为 JavaScript 文本文件。 请参阅[确定模块系统](/zh/nodejs/api/packages#determining-module-system)部分，以了解将使用什么解析目标。

带有 `'/'` 前缀的所需模块是文件的绝对路径。 例如，`require('/home/marco/foo.js')` 将加载 `/home/marco/foo.js` 文件。

带有 `'./'` 前缀的所需模块相对于调用 `require()` 的文件。 也就是说，`circle.js` 必须与 `foo.js` 位于同一目录中，`require('./circle')` 才能找到它。

如果没有前导 `'/'`、`'./'` 或 `'../'` 来指示文件，则该模块必须是核心模块，否则从 `node_modules` 文件夹加载。

如果给定的路径不存在，则 `require()` 将抛出 [`MODULE_NOT_FOUND`](/zh/nodejs/api/errors#module_not_found) 错误。

## 文件夹作为模块 {#folders-as-modules}

::: info [Stable: 3 - Legacy]
[Stable: 3](/zh/nodejs/api/documentation#stability-index) [稳定性: 3](/zh/nodejs/api/documentation#stability-index) - 遗留：请改用[子路径导出](/zh/nodejs/api/packages#subpath-exports)或[子路径导入](/zh/nodejs/api/packages#subpath-imports)。
:::

有三种方法可以将文件夹作为参数传递给 `require()`。

第一种方法是在文件夹的根目录中创建一个 [`package.json`](/zh/nodejs/api/packages#nodejs-packagejson-field-definitions) 文件，该文件指定一个 `main` 模块。 [`package.json`](/zh/nodejs/api/packages#nodejs-packagejson-field-definitions) 文件示例可能如下所示：

```json [JSON]
{ "name" : "some-library",
  "main" : "./lib/some-library.js" }
```
如果这位于 `./some-library` 的文件夹中，则 `require('./some-library')` 将尝试加载 `./some-library/lib/some-library.js`。

如果目录中不存在 [`package.json`](/zh/nodejs/api/packages#nodejs-packagejson-field-definitions) 文件，或者如果缺少 [`"main"`](/zh/nodejs/api/packages#main) 条目或无法解析，则 Node.js 将尝试从该目录中加载一个 `index.js` 或 `index.node` 文件。 例如，如果在上一个示例中没有 [`package.json`](/zh/nodejs/api/packages#nodejs-packagejson-field-definitions) 文件，则 `require('./some-library')` 将尝试加载：

- `./some-library/index.js`
- `./some-library/index.node`

如果这些尝试失败，则 Node.js 将报告整个模块丢失，并显示默认错误：

```bash [BASH]
Error: Cannot find module 'some-library'
```
在以上所有三种情况下，`import('./some-library')` 调用都将导致 [`ERR_UNSUPPORTED_DIR_IMPORT`](/zh/nodejs/api/errors#err_unsupported_dir_import) 错误。 使用包[子路径导出](/zh/nodejs/api/packages#subpath-exports)或[子路径导入](/zh/nodejs/api/packages#subpath-imports)可以提供与文件夹作为模块相同的包含组织优势，并且适用于 `require` 和 `import`。


## 从 `node_modules` 文件夹加载 {#loading-from-node_modules-folders}

如果传递给 `require()` 的模块标识符不是 [内置](/zh/nodejs/api/modules#built-in-modules) 模块，并且不以 `'/'`、`'../'` 或 `'./'` 开头，那么 Node.js 从当前模块的目录开始，添加 `/node_modules`，并尝试从该位置加载模块。Node.js 不会将 `node_modules` 附加到已经以 `node_modules` 结尾的路径。

如果在那里找不到，它会移动到父目录，依此类推，直到到达文件系统的根目录。

例如，如果 `'/home/ry/projects/foo.js'` 中的文件调用 `require('bar.js')`，那么 Node.js 将按以下顺序查找以下位置：

- `/home/ry/projects/node_modules/bar.js`
- `/home/ry/node_modules/bar.js`
- `/home/node_modules/bar.js`
- `/node_modules/bar.js`

这允许程序本地化它们的依赖项，这样它们就不会冲突。

可以通过在模块名称后包含路径后缀来 require 与模块一起分发的特定文件或子模块。例如，`require('example-module/path/to/file')` 将相对于 `example-module` 所在的位置解析 `path/to/file`。后缀路径遵循相同的模块解析语义。

## 从全局文件夹加载 {#loading-from-the-global-folders}

如果 `NODE_PATH` 环境变量设置为以冒号分隔的绝对路径列表，那么如果 Node.js 在其他地方找不到模块，它将在这些路径中搜索模块。

在 Windows 上，`NODE_PATH` 由分号 (`;`) 而不是冒号分隔。

最初创建 `NODE_PATH` 是为了在定义当前 [模块解析](/zh/nodejs/api/modules#all-together) 算法之前，支持从不同的路径加载模块。

`NODE_PATH` 仍然受支持，但现在 Node.js 生态系统已经确定了定位依赖模块的约定，因此不太需要它了。有时依赖于 `NODE_PATH` 的部署会表现出令人惊讶的行为，因为人们不知道必须设置 `NODE_PATH`。有时模块的依赖项会发生变化，导致加载不同的版本（甚至不同的模块），因为搜索了 `NODE_PATH`。

此外，Node.js 将在以下 GLOBAL_FOLDERS 列表中搜索：

- 1: `$HOME/.node_modules`
- 2: `$HOME/.node_libraries`
- 3: `$PREFIX/lib/node`

其中 `$HOME` 是用户的 home 目录，`$PREFIX` 是 Node.js 配置的 `node_prefix`。

这些主要是历史原因。

强烈建议将依赖项放置在本地 `node_modules` 文件夹中。这些将加载得更快，更可靠。


## 模块包装器 {#the-module-wrapper}

在模块的代码被执行之前，Node.js 会用一个函数包装器包装它，如下所示：

```js [ESM]
(function(exports, require, module, __filename, __dirname) {
// 模块代码实际存在于此处
});
```
通过这样做，Node.js 实现了以下几个目标：

- 它使顶层变量（用 `var`、`const` 或 `let` 定义）的作用域限定在模块内，而不是全局对象。
- 它有助于提供一些看起来是全局的变量，但实际上是特定于模块的，例如：
    - `module` 和 `exports` 对象，实现者可以使用它们从模块中导出值。
    - 便捷变量 `__filename` 和 `__dirname`，包含模块的绝对文件名和目录路径。

## 模块作用域 {#the-module-scope}

### `__dirname` {#__dirname}

**添加于: v0.1.27**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

当前模块的目录名。 这与 [`__filename`](/zh/nodejs/api/modules#__filename) 的 [`path.dirname()`](/zh/nodejs/api/path#pathdirnamepath) 相同。

示例：从 `/Users/mjr` 运行 `node example.js`

```js [ESM]
console.log(__dirname);
// 打印：/Users/mjr
console.log(path.dirname(__filename));
// 打印：/Users/mjr
```
### `__filename` {#__filename}

**添加于: v0.0.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

当前模块的文件名。 这是当前模块文件的已解析符号链接的绝对路径。

对于主程序，这不一定与命令行中使用的文件名相同。

有关当前模块的目录名，请参见 [`__dirname`](/zh/nodejs/api/modules#__dirname)。

示例：

从 `/Users/mjr` 运行 `node example.js`

```js [ESM]
console.log(__filename);
// 打印：/Users/mjr/example.js
console.log(__dirname);
// 打印：/Users/mjr
```
给定两个模块：`a` 和 `b`，其中 `b` 是 `a` 的依赖项，并且目录结构为：

- `/Users/mjr/app/a.js`
- `/Users/mjr/app/node_modules/b/b.js`

对 `b.js` 中 `__filename` 的引用将返回 `/Users/mjr/app/node_modules/b/b.js`，而对 `a.js` 中 `__filename` 的引用将返回 `/Users/mjr/app/a.js`。


### `exports` {#exports}

**添加于: v0.1.12**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

一个指向 `module.exports` 的引用，更易于键入。有关何时使用 `exports` 以及何时使用 `module.exports` 的详细信息，请参阅关于 [exports 快捷方式](/zh/nodejs/api/modules#exports-shortcut) 的部分。

### `module` {#module}

**添加于: v0.1.16**

- [\<module\>](/zh/nodejs/api/modules#the-module-object)

一个指向当前模块的引用，请参阅关于 [`module` 对象](/zh/nodejs/api/modules#the-module-object) 的部分。 特别是，`module.exports` 用于定义模块导出的内容并通过 `require()` 提供。

### `require(id)` {#requireid}

**添加于: v0.1.13**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 模块名称或路径
- 返回: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 导出的模块内容

用于导入模块、`JSON` 和本地文件。 可以从 `node_modules` 导入模块。 可以使用相对于 [`__dirname`](/zh/nodejs/api/modules#__dirname) （如果已定义）或当前工作目录解析的相对路径（例如 `./`、`./foo`、`./bar/baz`、`../foo`）导入本地模块和 JSON 文件。 POSIX 样式的相对路径以与操作系统无关的方式解析，这意味着上面的示例在 Windows 上的工作方式与在 Unix 系统上的工作方式相同。

```js [ESM]
// 导入一个本地模块，其路径相对于 `__dirname` 或当前工作目录。
// （在 Windows 上，这将解析为 .\path\myLocalModule。）
const myLocalModule = require('./path/myLocalModule');

// 导入一个 JSON 文件：
const jsonData = require('./path/filename.json');

// 从 node_modules 或 Node.js 内置模块导入一个模块：
const crypto = require('node:crypto');
```
#### `require.cache` {#requirecache}

**添加于: v0.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

模块在被引用时会被缓存在此对象中。 通过删除此对象中的键值，下一次 `require` 将重新加载该模块。 这不适用于[原生插件](/zh/nodejs/api/addons)，重新加载原生插件会导致错误。

添加或替换条目也是可能的。 在内置模块之前检查此缓存，如果将与内置模块匹配的名称添加到缓存中，则只有带有 `node:` 前缀的 require 调用才会接收到该内置模块。 请谨慎使用！

```js [ESM]
const assert = require('node:assert');
const realFs = require('node:fs');

const fakeFs = {};
require.cache.fs = { exports: fakeFs };

assert.strictEqual(require('fs'), fakeFs);
assert.strictEqual(require('node:fs'), realFs);
```

#### `require.extensions` {#requireextensions}

**Added in: v0.3.0**

**Deprecated since: v0.10.6**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

指示 `require` 如何处理特定的文件扩展名。

将扩展名为 `.sjs` 的文件作为 `.js` 处理：

```js [ESM]
require.extensions['.sjs'] = require.extensions['.js'];
```
**已弃用。** 过去，此列表曾用于通过按需编译将非 JavaScript 模块加载到 Node.js 中。 然而，在实践中，有更好的方法来做到这一点，例如通过其他 Node.js 程序加载模块，或提前将它们编译为 JavaScript。

避免使用 `require.extensions`。 使用可能会导致细微的错误，并且随着每个注册的扩展名，解析扩展名会变得更慢。

#### `require.main` {#requiremain}

**Added in: v0.1.17**

- [\<module\>](/zh/nodejs/api/modules#the-module-object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

当 Node.js 进程启动时，表示已加载的入口脚本的 `Module` 对象，如果程序的入口点不是 CommonJS 模块，则为 `undefined`。 参见["访问主模块"](/zh/nodejs/api/modules#accessing-the-main-module)。

在 `entry.js` 脚本中:

```js [ESM]
console.log(require.main);
```
```bash [BASH]
node entry.js
```
```js [ESM]
Module {
  id: '.',
  path: '/absolute/path/to',
  exports: {},
  filename: '/absolute/path/to/entry.js',
  loaded: false,
  children: [],
  paths:
   [ '/absolute/path/to/node_modules',
     '/absolute/path/node_modules',
     '/absolute/node_modules',
     '/node_modules' ] }
```
#### `require.resolve(request[, options])` {#requireresolverequest-options}


::: info [History]
| Version | Changes |
| --- | --- |
| v8.9.0 | The `paths` option is now supported. |
| v0.3.0 | Added in: v0.3.0 |
:::

- `request` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要解析的模块路径。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `paths` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 用于解析模块位置的路径。 如果存在，这些路径将代替默认的解析路径，但 [GLOBAL_FOLDERS](/zh/nodejs/api/modules#loading-from-the-global-folders)（如 `$HOME/.node_modules`）除外，它们始终包含在内。 这些路径中的每一个都用作模块解析算法的起点，这意味着 `node_modules` 层次结构会从此位置进行检查。


- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

使用内部 `require()` 机制来查找模块的位置，但不是加载模块，而是只返回解析后的文件名。

如果找不到模块，则抛出一个 `MODULE_NOT_FOUND` 错误。


##### `require.resolve.paths(request)` {#requireresolvepathsrequest}

**新增于: v8.9.0**

- `request` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要检索其查找路径的模块路径。
- 返回值: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

返回一个数组，其中包含解析 `request` 期间搜索的路径；如果 `request` 字符串引用核心模块（例如 `http` 或 `fs`），则返回 `null`。

## `module` 对象 {#the-module-object}

**新增于: v0.1.16**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

在每个模块中，`module` 自由变量是对表示当前模块的对象的引用。 为了方便起见，也可以通过 `exports` 模块全局变量访问 `module.exports`。 `module` 实际上不是全局的，而是每个模块本地的。

### `module.children` {#modulechildren}

**新增于: v0.1.16**

- [\<module[]\>](/zh/nodejs/api/modules#the-module-object)

这个模块第一次引入的模块对象。

### `module.exports` {#moduleexports}

**新增于: v0.1.16**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`module.exports` 对象由 `Module` 系统创建。 有时这是不可接受的； 许多人希望他们的模块成为某个类的实例。 为此，请将所需的导出对象分配给 `module.exports`。 将所需的导出对象分配给 `exports` 只会重新绑定局部 `exports` 变量，这可能不是想要的。

例如，假设我们正在创建一个名为 `a.js` 的模块：

```js [ESM]
const EventEmitter = require('node:events');

module.exports = new EventEmitter();

// 执行一些工作，并在一段时间后从模块本身发出
// 'ready' 事件。
setTimeout(() => {
  module.exports.emit('ready');
}, 1000);
```
然后在另一个文件中我们可以这样做：

```js [ESM]
const a = require('./a');
a.on('ready', () => {
  console.log('模块 "a" 准备就绪');
});
```
必须立即完成对 `module.exports` 的赋值。 不能在任何回调中完成。 这不起作用：

`x.js`:

```js [ESM]
setTimeout(() => {
  module.exports = { a: 'hello' };
}, 0);
```
`y.js`:

```js [ESM]
const x = require('./x');
console.log(x.a);
```

#### `exports` 快捷方式 {#exports-shortcut}

**添加于: v0.1.16**

`exports` 变量在模块的文件级作用域内可用，并且在模块被求值之前被赋值为 `module.exports` 的值。

它允许一个快捷方式，因此 `module.exports.f = ...` 可以更简洁地写成 `exports.f = ...`。但是，请注意，像任何变量一样，如果将新值分配给 `exports`，它将不再绑定到 `module.exports`：

```js [ESM]
module.exports.hello = true; // 从模块的 require 导出
exports = { hello: false };  // 不导出，仅在模块中可用
```
当 `module.exports` 属性被一个新对象完全替换时，通常也会重新分配 `exports`：

```js [ESM]
module.exports = exports = function Constructor() {
  // ... 等等.
};
```
为了说明这种行为，想象一下 `require()` 的这种假设实现，它与 `require()` 实际执行的操作非常相似：

```js [ESM]
function require(/* ... */) {
  const module = { exports: {} };
  ((module, exports) => {
    // 模块代码在这里。在此示例中，定义一个函数。
    function someFunc() {}
    exports = someFunc;
    // 此时，exports 不再是 module.exports 的快捷方式，并且
    // 此模块仍将导出一个空的默认对象。
    module.exports = someFunc;
    // 此时，该模块现在将导出 someFunc，而不是
    // 默认对象。
  })(module, module.exports);
  return module.exports;
}
```
### `module.filename` {#modulefilename}

**添加于: v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

模块的完全解析的文件名。

### `module.id` {#moduleid}

**添加于: v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

模块的标识符。通常这是完全解析的文件名。

### `module.isPreloading` {#moduleispreloading}

**添加于: v15.4.0, v14.17.0**

- 类型: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)  如果模块在 Node.js 预加载阶段运行，则为 `true`。


### `module.loaded` {#moduleloaded}

**加入版本: v0.1.16**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

模块是否已完成加载，或者是否正在加载中。

### `module.parent` {#moduleparent}

**加入版本: v0.1.16**

**已弃用版本: v14.6.0, v12.19.0**

::: danger [稳定度: 0 - 已弃用]
[稳定度: 0](/zh/nodejs/api/documentation#stability-index) [稳定性: 0](/zh/nodejs/api/documentation#stability-index) - 已弃用: 请改用 [`require.main`](/zh/nodejs/api/modules#requiremain) 和 [`module.children`](/zh/nodejs/api/modules#modulechildren)。
:::

- [\<module\>](/zh/nodejs/api/modules#the-module-object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

第一个 `require` 此模块的模块，如果当前模块是当前进程的入口点，则为 `null`，如果模块是由非 CommonJS 模块（例如：REPL 或 `import`）加载的，则为 `undefined`。

### `module.path` {#modulepath}

**加入版本: v11.14.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

模块的目录名。 这通常与 [`module.id`](/zh/nodejs/api/modules#moduleid) 的 [`path.dirname()`](/zh/nodejs/api/path#pathdirnamepath) 相同。

### `module.paths` {#modulepaths}

**加入版本: v0.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

模块的搜索路径。

### `module.require(id)` {#modulerequireid}

**加入版本: v0.5.1**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 导出的模块内容

`module.require()` 方法提供了一种加载模块的方式，就像从原始模块调用 `require()` 一样。

为了做到这一点，有必要获得对 `module` 对象的引用。 由于 `require()` 返回 `module.exports`，并且 `module` 通常 *只* 在特定模块的代码中可用，因此必须显式导出它才能使用。


## `Module` 对象 {#the-module-object_1}

此章节已移至 [模块：`module` 核心模块](/zh/nodejs/api/module#the-module-object)。

- [`module.builtinModules`](/zh/nodejs/api/module#modulebuiltinmodules)
- [`module.createRequire(filename)`](/zh/nodejs/api/module#modulecreaterequirefilename)
- [`module.syncBuiltinESMExports()`](/zh/nodejs/api/module#modulesyncbuiltinesmexports)

## 源码映射 v3 支持 {#source-map-v3-support}

此章节已移至 [模块：`module` 核心模块](/zh/nodejs/api/module#source-map-v3-support)。

- [`module.findSourceMap(path)`](/zh/nodejs/api/module#modulefindsourcemappath)
- [类: `module.SourceMap`](/zh/nodejs/api/module#class-modulesourcemap)
    - [`new SourceMap(payload)`](/zh/nodejs/api/module#new-sourcemappayload)
    - [`sourceMap.payload`](/zh/nodejs/api/module#sourcemappayload)
    - [`sourceMap.findEntry(lineNumber, columnNumber)`](/zh/nodejs/api/module#sourcemapfindentrylinenumber-columnnumber)

