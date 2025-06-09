---
title: Node.js 包文档
description: 查看 Node.js 官方关于包的文档，了解如何管理、创建和发布包，包括 package.json、依赖关系和包管理工具的详细信息。
head:
  - - meta
    - name: og:title
      content: Node.js 包文档 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 查看 Node.js 官方关于包的文档，了解如何管理、创建和发布包，包括 package.json、依赖关系和包管理工具的详细信息。
  - - meta
    - name: twitter:title
      content: Node.js 包文档 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 查看 Node.js 官方关于包的文档，了解如何管理、创建和发布包，包括 package.json、依赖关系和包管理工具的详细信息。
---


# 模块：包 {#modules-packages}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.13.0, v12.20.0 | 添加对 `"exports"` 模式的支持。 |
| v14.6.0, v12.19.0 | 添加包 `"imports"` 字段。 |
| v13.7.0, v12.17.0 | 取消对条件导出的标记。 |
| v13.7.0, v12.16.0 | 移除 `--experimental-conditional-exports` 选项。 在 12.16.0 中，条件导出仍然隐藏在 `--experimental-modules` 之后。 |
| v13.6.0, v12.16.0 | 取消使用其名称自引用包的标记。 |
| v12.7.0 | 引入 `"exports"` `package.json` 字段，作为经典 `"main"` 字段的更强大的替代方案。 |
| v12.0.0 | 通过 `package.json` `"type"` 字段添加对使用 `.js` 文件扩展名的 ES 模块的支持。 |
:::

## 介绍 {#introduction}

包是一个由 `package.json` 文件描述的文件夹树。 包由包含 `package.json` 文件的文件夹和所有子文件夹组成，直到包含另一个 `package.json` 文件的下一个文件夹或名为 `node_modules` 的文件夹。

本页为编写 `package.json` 文件的包作者提供指导，并提供 Node.js 定义的 [`package.json`](/zh/nodejs/api/packages#nodejs-packagejson-field-definitions) 字段的参考。

## 确定模块系统 {#determining-module-system}

### 介绍 {#introduction_1}

当作为初始输入传递给 `node`，或由 `import` 语句或 `import()` 表达式引用时，Node.js 会将以下内容视为 [ES 模块](/zh/nodejs/api/esm)：

- 具有 `.mjs` 扩展名的文件。
- 当最近的父 `package.json` 文件包含一个值为 `"module"` 的顶级 [`"type"`](/zh/nodejs/api/packages#type) 字段时，具有 `.js` 扩展名的文件。
- 作为参数传递给 `--eval` 的字符串，或通过 `STDIN` 通过管道传递给 `node` 的字符串，并带有标志 `--input-type=module`。
- 包含仅作为 [ES 模块](/zh/nodejs/api/esm) 成功解析的语法的代码，例如 `import` 或 `export` 语句或 `import.meta`，而没有关于如何解释它的显式标记。 显式标记是 `.mjs` 或 `.cjs` 扩展名，`package.json` `"type"` 字段（值为 `"module"` 或 `"commonjs"`），或 `--input-type` 标志。 动态 `import()` 表达式在 CommonJS 或 ES 模块中都支持，并且不会强制将文件视为 ES 模块。 参见 [语法检测](/zh/nodejs/api/packages#syntax-detection)。

当作为初始输入传递给 `node`，或由 `import` 语句或 `import()` 表达式引用时，Node.js 会将以下内容视为 [CommonJS](/zh/nodejs/api/modules)：

- 具有 `.cjs` 扩展名的文件。
- 当最近的父 `package.json` 文件包含一个值为 `"commonjs"` 的顶级字段 [`"type"`](/zh/nodejs/api/packages#type) 时，具有 `.js` 扩展名的文件。
- 作为参数传递给 `--eval` 或 `--print` 的字符串，或通过 `STDIN` 通过管道传递给 `node` 的字符串，并带有标志 `--input-type=commonjs`。
- 没有父 `package.json` 文件或最近的父 `package.json` 文件缺少 `type` 字段，并且代码可以作为 CommonJS 成功求值的具有 `.js` 扩展名的文件。 换句话说，Node.js 首先尝试将此类“模棱两可”的文件作为 CommonJS 运行，如果作为 CommonJS 的求值失败，因为它解析器找到了 ES 模块语法，它将重试将其作为 ES 模块求值。

在“模棱两可”的文件中编写 ES 模块语法会产生性能成本，因此鼓励作者尽可能明确。 特别是，包作者应始终在其 `package.json` 文件中包含 [`"type"`](/zh/nodejs/api/packages#type) 字段，即使在所有源都是 CommonJS 的包中也是如此。 明确包的 `type` 将使包在 Node.js 的默认类型发生更改时具有前瞻性，并且还可以让构建工具和加载器更容易确定包中的文件应如何解释。


### 语法检测 {#syntax-detection}

::: info [历史记录]
| 版本 | 更改 |
| --- | --- |
| v22.7.0 | 默认启用语法检测。 |
| v21.1.0, v20.10.0 | 添加于：v21.1.0, v20.10.0 |
:::

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).2 - 发布候选版本
:::

Node.js 将检查模糊输入的源代码，以确定它是否包含 ES 模块语法；如果检测到此类语法，则该输入将被视为 ES 模块。

模糊输入定义为：

- 扩展名为 `.js` 或没有扩展名的文件；并且没有控制 `package.json` 文件或缺少 `type` 字段。
- 未指定 `--input-type` 时，字符串输入（`--eval` 或 `STDIN`）。

ES 模块语法定义为在作为 CommonJS 计算时会抛出异常的语法。 这包括以下内容：

- `import` 语句（但 *不包括* `import()` 表达式，该表达式在 CommonJS 中有效）。
- `export` 语句。
- `import.meta` 引用。
- 模块顶层的 `await`。
- CommonJS 包装器变量（`require`、`module`、`exports`、`__dirname`、`__filename`）的词法重新声明。

### 模块加载器 {#modules-loaders}

Node.js 有两个系统用于解析说明符和加载模块。

一个是 CommonJS 模块加载器：

- 它是完全同步的。
- 它负责处理 `require()` 调用。
- 它是可以猴子补丁的。
- 它支持[文件夹作为模块](/zh/nodejs/api/modules#folders-as-modules)。
- 在解析说明符时，如果没有找到完全匹配，它将尝试添加扩展名（`.js`、`.json` 和最后的 `.node`），然后尝试将[文件夹解析为模块](/zh/nodejs/api/modules#folders-as-modules)。
- 它将 `.json` 视为 JSON 文本文件。
- `.node` 文件被解释为使用 `process.dlopen()` 加载的已编译的插件模块。
- 它将缺少 `.json` 或 `.node` 扩展名的所有文件视为 JavaScript 文本文件。
- 如果模块图是同步的（不包含顶层的 `await`），则只能用于[从 CommonJS 模块加载 ECMAScript 模块](/zh/nodejs/api/modules#loading-ecmascript-modules-using-require)。当用于加载不是 ECMAScript 模块的 JavaScript 文本文件时，该文件将被加载为 CommonJS 模块。

一个是 ECMAScript 模块加载器：

- 它是异步的，除非它用于为 `require()` 加载模块。
- 它负责处理 `import` 语句和 `import()` 表达式。
- 它不可猴子补丁，可以使用[加载器钩子](/zh/nodejs/api/esm#loaders)进行自定义。
- 它不支持将文件夹作为模块，必须完全指定目录索引（例如 `'. /startup/index.js'`）。
- 它不进行扩展名搜索。 当说明符是相对或绝对文件 URL 时，必须提供文件扩展名。
- 它可以加载 JSON 模块，但需要导入类型属性。
- 它只接受 JavaScript 文本文件的 `.js`、`.mjs` 和 `.cjs` 扩展名。
- 它可用于加载 JavaScript CommonJS 模块。 此类模块通过 `cjs-module-lexer` 传递，以尝试识别命名导出，如果可以通过静态分析确定这些导出，则可以使用。 导入的 CommonJS 模块将其 URL 转换为绝对路径，然后通过 CommonJS 模块加载器加载。


### `package.json` 和文件扩展名 {#packagejson-and-file-extensions}

在一个包中，[`package.json`](/zh/nodejs/api/packages#nodejs-packagejson-field-definitions) 中的 [`"type"`](/zh/nodejs/api/packages#type) 字段定义了 Node.js 应该如何解释 `.js` 文件。 如果 `package.json` 文件没有 `"type"` 字段，则 `.js` 文件会被视为 [CommonJS](/zh/nodejs/api/modules)。

`package.json` 中 `"type"` 的值为 `"module"` 时，告诉 Node.js 将该包中的 `.js` 文件解释为使用 [ES 模块](/zh/nodejs/api/esm) 语法。

`"type"` 字段不仅适用于初始入口点（`node my-app.js`），还适用于 `import` 语句和 `import()` 表达式引用的文件。

```js [ESM]
// my-app.js, 被视为 ES 模块，因为在同一文件夹中存在一个 package.json
// 文件，其中 "type": "module"。

import './startup/init.js';
// 被加载为 ES 模块，因为 ./startup 不包含 package.json 文件，
// 因此从上一级继承 "type" 值。

import 'commonjs-package';
// 被加载为 CommonJS，因为 ./node_modules/commonjs-package/package.json
// 缺少 "type" 字段或包含 "type": "commonjs"。

import './node_modules/commonjs-package/index.js';
// 被加载为 CommonJS，因为 ./node_modules/commonjs-package/package.json
// 缺少 "type" 字段或包含 "type": "commonjs"。
```
无论最近的父级 `package.json` 如何，以 `.mjs` 结尾的文件始终加载为 [ES 模块](/zh/nodejs/api/esm)。

无论最近的父级 `package.json` 如何，以 `.cjs` 结尾的文件始终加载为 [CommonJS](/zh/nodejs/api/modules)。

```js [ESM]
import './legacy-file.cjs';
// 被加载为 CommonJS，因为 .cjs 始终被加载为 CommonJS。

import 'commonjs-package/src/index.mjs';
// 被加载为 ES 模块，因为 .mjs 始终被加载为 ES 模块。
```
`.mjs` 和 `.cjs` 扩展名可用于在同一包中混合类型：

- 在 `"type": "module"` 包中，可以通过将特定文件命名为 `.cjs` 扩展名来指示 Node.js 将其解释为 [CommonJS](/zh/nodejs/api/modules)（因为在 `"module"` 包中，`.js` 和 `.mjs` 文件都被视为 ES 模块）。
- 在 `"type": "commonjs"` 包中，可以通过将特定文件命名为 `.mjs` 扩展名来指示 Node.js 将其解释为 [ES 模块](/zh/nodejs/api/esm)（因为在 `"commonjs"` 包中，`.js` 和 `.cjs` 文件都被视为 CommonJS）。


### `--input-type` 标志 {#--input-type-flag}

**添加于: v12.0.0**

当设置 `--input-type=module` 标志时，作为参数传递给 `--eval`（或 `-e`）的字符串，或通过 `STDIN` 管道传递给 `node` 的字符串，将被视为 [ES 模块](/zh/nodejs/api/esm)。

```bash [BASH]
node --input-type=module --eval "import { sep } from 'node:path'; console.log(sep);"

echo "import { sep } from 'node:path'; console.log(sep);" | node --input-type=module
```
为了完整性，还有 `--input-type=commonjs`，用于显式地将字符串输入作为 CommonJS 运行。如果未指定 `--input-type`，这是默认行为。

## 确定包管理器 {#determining-package-manager}

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

虽然所有 Node.js 项目在发布后都应可由所有包管理器安装，但它们的开发团队通常需要使用一个特定的包管理器。 为了简化此过程，Node.js 附带了一个名为 [Corepack](/zh/nodejs/api/corepack) 的工具，旨在使所有包管理器在您的环境中透明地可用 - 前提是您已安装 Node.js。

默认情况下，Corepack 不会强制执行任何特定的包管理器，并将使用与每个 Node.js 版本关联的通用“最近已知良好”版本，但您可以通过在项目的 `package.json` 中设置 [`"packageManager"`](/zh/nodejs/api/packages#packagemanager) 字段来改善此体验。

## 包入口点 {#package-entry-points}

在包的 `package.json` 文件中，两个字段可以定义包的入口点：[`"main"`](/zh/nodejs/api/packages#main) 和 [`"exports"`](/zh/nodejs/api/packages#exports)。 两个字段都适用于 ES 模块和 CommonJS 模块入口点。

[`"main"`](/zh/nodejs/api/packages#main) 字段在所有版本的 Node.js 中都受支持，但其功能有限：它仅定义包的主入口点。

[`"exports"`](/zh/nodejs/api/packages#exports) 提供了一种现代替代方案，取代了 [`"main"`](/zh/nodejs/api/packages#main)，允许定义多个入口点，支持环境之间的条件入口分辨率，并且**防止任何其他入口点（除了那些在 <a href="#exports"><code>"exports"</code></a> 中定义的）**。 这种封装允许模块作者清楚地定义其包的公共接口。

对于针对当前支持的 Node.js 版本的新包，建议使用 [`"exports"`](/zh/nodejs/api/packages#exports) 字段。 对于支持 Node.js 10 及更低版本的包，则需要 [`"main"`](/zh/nodejs/api/packages#main) 字段。 如果同时定义了 [`"exports"`](/zh/nodejs/api/packages#exports) 和 [`"main"`](/zh/nodejs/api/packages#main)，则在支持的 Node.js 版本中，[`"exports"`](/zh/nodejs/api/packages#exports) 字段优先于 [`"main"`](/zh/nodejs/api/packages#main)。

[条件导出](/zh/nodejs/api/packages#conditional-exports) 可以在 [`"exports"`](/zh/nodejs/api/packages#exports) 中使用，以定义每个环境的不同包入口点，包括包是通过 `require` 还是通过 `import` 引用。 有关在单个包中支持 CommonJS 和 ES 模块的更多信息，请参阅 [双重 CommonJS/ES 模块包部分](/zh/nodejs/api/packages#dual-commonjses-module-packages)。

引入 [`"exports"`](/zh/nodejs/api/packages#exports) 字段的现有包将阻止包的使用者使用任何未定义的入口点，包括 [`package.json`](/zh/nodejs/api/packages#nodejs-packagejson-field-definitions) (例如 `require('your-package/package.json')`)。 **这很可能会是一项重大更改。**

为了使 [`"exports"`](/zh/nodejs/api/packages#exports) 的引入不会造成破坏性更改，请确保导出每个先前支持的入口点。 最好显式指定入口点，以便很好地定义包的公共 API。 例如，一个先前导出 `main`、`lib`、`feature` 和 `package.json` 的项目可以使用以下 `package.exports`：

```json [JSON]
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./lib": "./lib/index.js",
    "./lib/index": "./lib/index.js",
    "./lib/index.js": "./lib/index.js",
    "./feature": "./feature/index.js",
    "./feature/index": "./feature/index.js",
    "./feature/index.js": "./feature/index.js",
    "./package.json": "./package.json"
  }
}
```
或者，项目可以选择使用导出模式导出整个文件夹，无论是否带有扩展子路径：

```json [JSON]
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./lib": "./lib/index.js",
    "./lib/*": "./lib/*.js",
    "./lib/*.js": "./lib/*.js",
    "./feature": "./feature/index.js",
    "./feature/*": "./feature/*.js",
    "./feature/*.js": "./feature/*.js",
    "./package.json": "./package.json"
  }
}
```
以上为任何次要包版本提供了向后兼容性，包的未来主要更改可以正确地将导出限制为仅暴露的特定功能导出：

```json [JSON]
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./feature/*.js": "./feature/*.js",
    "./feature/internal/*": null
  }
}
```

### 主要入口点导出 {#main-entry-point-export}

编写新包时，建议使用 [`"exports"`](/zh/nodejs/api/packages#exports) 字段：

```json [JSON]
{
  "exports": "./index.js"
}
```
当定义了 [`"exports"`](/zh/nodejs/api/packages#exports) 字段时，该包的所有子路径都会被封装，并且对导入者不再可用。例如，`require('pkg/subpath.js')` 会抛出一个 [`ERR_PACKAGE_PATH_NOT_EXPORTED`](/zh/nodejs/api/errors#err_package_path_not_exported) 错误。

这种导出封装为工具提供了更可靠的包接口保证，并在处理包的语义版本升级时提供了保证。 这不是一个强封装，因为直接 require 包的任何绝对子路径（例如 `require('/path/to/node_modules/pkg/subpath.js')`）仍然会加载 `subpath.js`。

所有当前支持的 Node.js 版本和现代构建工具都支持 `"exports"` 字段。 对于使用旧版本 Node.js 或相关构建工具的项目，可以通过在 `"main"` 字段旁边包含 `"exports"` 并指向同一个模块来实现兼容性：

```json [JSON]
{
  "main": "./index.js",
  "exports": "./index.js"
}
```
### 子路径导出 {#subpath-exports}

**添加于: v12.7.0**

使用 [`"exports"`](/zh/nodejs/api/packages#exports) 字段时，可以通过将主入口点视为 `"."` 子路径来定义自定义子路径以及主入口点：

```json [JSON]
{
  "exports": {
    ".": "./index.js",
    "./submodule.js": "./src/submodule.js"
  }
}
```
现在，只有 [`"exports"`](/zh/nodejs/api/packages#exports) 中定义的子路径才能被使用者导入：

```js [ESM]
import submodule from 'es-module-package/submodule.js';
// 加载 ./node_modules/es-module-package/src/submodule.js
```
而其他子路径将会报错：

```js [ESM]
import submodule from 'es-module-package/private-module.js';
// 抛出 ERR_PACKAGE_PATH_NOT_EXPORTED
```
#### 子路径中的扩展名 {#extensions-in-subpaths}

包作者应该在其导出中提供带扩展名的（`import 'pkg/subpath.js'`）或不带扩展名的（`import 'pkg/subpath'`）子路径。 这确保了每个导出的模块只有一个子路径，以便所有依赖项导入相同的统一说明符，从而使包契约对使用者保持清晰，并简化包子路径补全。

传统上，包倾向于使用不带扩展名的样式，这种样式具有可读性和屏蔽包内文件真实路径的优点。

由于 [import maps](https://github.com/WICG/import-maps) 现在为浏览器和其他 JavaScript 运行时中的包解析提供了一个标准，因此使用不带扩展名的样式可能会导致 import map 定义膨胀。 显式文件扩展名可以通过允许导入映射利用 [packages 文件夹映射](https://github.com/WICG/import-maps#packages-via-trailing-slashes) 在可能的情况下映射多个子路径，而不是每个包子路径导出使用单独的映射条目，从而避免此问题。 这也反映了在相对和绝对导入说明符中使用 [完整的说明符路径](/zh/nodejs/api/esm#mandatory-file-extensions) 的要求。


### 导出简写 {#exports-sugar}

**添加于: v12.11.0**

如果 `"."` 导出是唯一的导出，则 [`"exports"`](/zh/nodejs/api/packages#exports) 字段为此情况提供简写，即直接使用 [`"exports"`](/zh/nodejs/api/packages#exports) 字段值。

```json [JSON]
{
  "exports": {
    ".": "./index.js"
  }
}
```
可以写成：

```json [JSON]
{
  "exports": "./index.js"
}
```
### 子路径导入 {#subpath-imports}

**添加于: v14.6.0, v12.19.0**

除了 [`"exports"`](/zh/nodejs/api/packages#exports) 字段之外，还有一个包 `"imports"` 字段，用于创建仅适用于包本身内部导入说明符的私有映射。

`"imports"` 字段中的条目必须始终以 `#` 开头，以确保它们与外部包说明符区分开。

例如，imports 字段可用于获得内部模块条件导出的好处：

```json [JSON]
// package.json
{
  "imports": {
    "#dep": {
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    }
  },
  "dependencies": {
    "dep-node-native": "^1.0.0"
  }
}
```
其中 `import '#dep'` 不会获得外部包 `dep-node-native` 的解析（包括其导出的内容），而是在其他环境中获取相对于包的本地文件 `./dep-polyfill.js`。

与 `"exports"` 字段不同，`"imports"` 字段允许映射到外部包。

imports 字段的解析规则与其他方面与 exports 字段类似。

### 子路径模式 {#subpath-patterns}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v16.10.0, v14.19.0 | 支持 "imports" 字段中的模式尾部。 |
| v16.9.0, v14.19.0 | 支持模式尾部。 |
| v14.13.0, v12.20.0 | 添加于: v14.13.0, v12.20.0 |
:::

对于导出或导入数量较少的包，我们建议显式列出每个导出子路径条目。 但是对于具有大量子路径的包，这可能会导致 `package.json` 膨胀和维护问题。

对于这些用例，可以改用子路径导出模式：

```json [JSON]
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./features/*.js": "./src/features/*.js"
  },
  "imports": {
    "#internal/*.js": "./src/internal/*.js"
  }
}
```
**<code>*</code> 映射公开嵌套子路径，因为它只是字符串替换语法。**

右侧的所有 `*` 实例都将被替换为该值，包括它是否包含任何 `/` 分隔符。

```js [ESM]
import featureX from 'es-module-package/features/x.js';
// 加载 ./node_modules/es-module-package/src/features/x.js

import featureY from 'es-module-package/features/y/y.js';
// 加载 ./node_modules/es-module-package/src/features/y/y.js

import internalZ from '#internal/z.js';
// 加载 ./node_modules/es-module-package/src/internal/z.js
```
这是一个直接的静态匹配和替换，对文件扩展名没有任何特殊处理。 在映射的两侧都包含 `"*.js"` 将公开的包导出限制为仅 JS 文件。

导出的属性是静态可枚举的，它通过导出模式来维护，因为可以通过将右侧的目标模式视为相对于包中文件列表的 `**` glob 来确定包的各个导出。 因为 `node_modules` 路径在导出目标中被禁止，所以这种扩展仅依赖于包本身的文件。

要从模式中排除私有子文件夹，可以使用 `null` 目标：

```json [JSON]
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./features/*.js": "./src/features/*.js",
    "./features/private-internal/*": null
  }
}
```
```js [ESM]
import featureInternal from 'es-module-package/features/private-internal/m.js';
// 抛出：ERR_PACKAGE_PATH_NOT_EXPORTED

import featureX from 'es-module-package/features/x.js';
// 加载 ./node_modules/es-module-package/src/features/x.js
```

### 条件导出 {#conditional-exports}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.7.0, v12.16.0 | 取消条件导出的标记。 |
| v13.2.0, v12.16.0 | 添加于：v13.2.0, v12.16.0 |
:::

条件导出提供了一种根据特定条件映射到不同路径的方法。 CommonJS 和 ES 模块导入都支持它们。

例如，一个希望为 `require()` 和 `import` 提供不同 ES 模块导出的包可以这样编写：

```json [JSON]
// package.json
{
  "exports": {
    "import": "./index-module.js",
    "require": "./index-require.cjs"
  },
  "type": "module"
}
```
Node.js 实现了以下条件，按照从最具体到最不具体的顺序列出，因为应该定义条件：

- `"node-addons"` - 类似于 `"node"`，并且匹配任何 Node.js 环境。 此条件可用于提供一个使用本机 C++ 插件的入口点，而不是一个更通用且不依赖于本机插件的入口点。 可以通过 [`--no-addons` 标志](/zh/nodejs/api/cli#--no-addons)禁用此条件。
- `"node"` - 匹配任何 Node.js 环境。 可以是 CommonJS 或 ES 模块文件。 *在大多数情况下，显式调用 Node.js 平台是不必要的。*
- `"import"` - 当包通过 `import` 或 `import()` 加载时，或通过 ECMAScript 模块加载器的任何顶级导入或解析操作加载时匹配。 适用于目标文件的模块格式。 *始终与 <code>"require"</code> 互斥。*
- `"require"` - 当包通过 `require()` 加载时匹配。 引用的文件应该可以通过 `require()` 加载，尽管条件匹配与目标文件的模块格式无关。 预期格式包括 CommonJS、JSON、本机插件和 ES 模块。 *始终与 <code>"import"</code> 互斥。*
- `"module-sync"` - 无论包是通过 `import`、`import()` 还是 `require()` 加载，都会匹配。 格式预计为 ES 模块，其模块图中不包含顶级 await - 如果包含，当 `require()` 该模块时，将抛出 `ERR_REQUIRE_ASYNC_MODULE`。
- `"default"` - 始终匹配的通用回退。 可以是 CommonJS 或 ES 模块文件。 *此条件应始终排在最后。*

在 [`"exports"`](/zh/nodejs/api/packages#exports) 对象中，键的顺序很重要。 在条件匹配期间，较早的条目具有更高的优先级，并且优先于较晚的条目。 *一般规则是，条件在对象顺序中应从最具体到最不具体。*

使用 `"import"` 和 `"require"` 条件可能会导致一些危险，这在[双 CommonJS/ES 模块包部分](/zh/nodejs/api/packages#dual-commonjses-module-packages)中进一步解释。

`"node-addons"` 条件可用于提供一个使用本机 C++ 插件的入口点。 但是，可以通过 [`--no-addons` 标志](/zh/nodejs/api/cli#--no-addons)禁用此条件。 使用 `"node-addons"` 时，建议将 `"default"` 视为一种增强，它可以提供更通用的入口点，例如使用 WebAssembly 而不是本机插件。

条件导出也可以扩展到导出子路径，例如：

```json [JSON]
{
  "exports": {
    ".": "./index.js",
    "./feature.js": {
      "node": "./feature-node.js",
      "default": "./feature.js"
    }
  }
}
```
定义一个包，其中 `require('pkg/feature.js')` 和 `import 'pkg/feature.js')` 可以在 Node.js 和其他 JS 环境之间提供不同的实现。

使用环境分支时，请尽可能始终包含 `"default"` 条件。 提供 `"default"` 条件可确保任何未知的 JS 环境都能够使用此通用实现，这有助于避免这些 JS 环境不得不伪装成现有环境才能支持具有条件导出的包。 因此，使用 `"node"` 和 `"default"` 条件分支通常比使用 `"node"` 和 `"browser"` 条件分支更好。


### 嵌套条件 {#nested-conditions}

除了直接映射之外，Node.js 还支持嵌套条件对象。

例如，定义一个仅在 Node.js 中具有双模式入口点，但在浏览器中没有的包：

```json [JSON]
{
  "exports": {
    "node": {
      "import": "./feature-node.mjs",
      "require": "./feature-node.cjs"
    },
    "default": "./feature.mjs"
  }
}
```

条件会像扁平条件一样，按照顺序进行匹配。 如果一个嵌套条件没有任何映射，它将继续检查父条件的其余条件。 通过这种方式，嵌套条件的行为类似于嵌套的 JavaScript `if` 语句。

### 解析用户条件 {#resolving-user-conditions}

**新增于: v14.9.0, v12.19.0**

运行 Node.js 时，可以使用 `--conditions` 标志添加自定义用户条件：

```bash [BASH]
node --conditions=development index.js
```

然后它将解析包导入和导出中的 `"development"` 条件，同时适当地解析现有的 `"node"`、`"node-addons"`、`"default"`、`"import"` 和 `"require"` 条件。

可以使用重复标志设置任意数量的自定义条件。

典型的条件应仅包含字母数字字符，并在必要时使用 ":", "-" 或 "=" 作为分隔符。 否则可能会在 node 之外遇到兼容性问题。

在 node 中，条件几乎没有限制，但具体来说包括：

### 社区条件定义 {#community-conditions-definitions}

默认情况下，Node.js 内核中实现的 `"import"`、`"require"`、`"node"`、`"module-sync"`、`"node-addons"` 和 `"default"` 条件之外的条件字符串会被忽略。

其他平台可能会实现其他条件，并且可以通过 [`--conditions` / `-C` 标志](/zh/nodejs/api/packages#resolving-user-conditions) 在 Node.js 中启用用户条件。

由于自定义包条件需要明确的定义才能确保正确使用，因此下面提供了一个常见的已知包条件及其严格定义的列表，以帮助进行生态系统协调。

- `"types"` - 可由类型系统使用来解析给定导出的类型文件。 *此条件应始终首先包含。*
- `"browser"` - 任何 Web 浏览器环境。
- `"development"` - 可用于定义仅用于开发的入口点，例如在开发模式下运行时提供额外的调试上下文，例如更好的错误消息。 *必须始终与 <code>"production"</code> 互斥。*
- `"production"` - 可用于定义生产环境入口点。 *必须始终与 <code>"development"</code> 互斥。*

对于其他运行时，特定于平台的条件键定义由 [WinterCG](https://wintercg.org/) 在 [运行时键](https://runtime-keys.proposal.wintercg.org/) 提案规范中维护。

可以通过创建一个拉取请求到 [Node.js 文档的此部分](https://github.com/nodejs/node/blob/HEAD/doc/api/packages.md#conditions-definitions) 将新的条件定义添加到此列表中。 此处列出新条件定义的要求是：

- 对于所有实现者，定义应清晰明确。
- 应该清楚地证明为什么需要该条件的使用案例。
- 应该存在足够的现有实现使用情况。
- 条件名称不应与另一个条件定义或广泛使用的条件冲突。
- 条件定义的列出应为生态系统提供协调收益，否则这是不可能的。 例如，对于公司特定或应用程序特定的条件，情况不一定如此。
- 该条件应该是 Node.js 用户希望它位于 Node.js 核心文档中的条件。 `"types"` 条件就是一个很好的例子：它实际上不属于 [运行时键](https://runtime-keys.proposal.wintercg.org/) 提案，但在 Node.js 文档中非常合适。

上述定义可能会在适当的时候移动到专用的条件注册表中。


### 使用包名称自引用包 {#self-referencing-a-package-using-its-name}

::: info [历史记录]
| 版本 | 更改 |
| --- | --- |
| v13.6.0, v12.16.0 | 取消使用包名称自引用的标记。 |
| v13.1.0, v12.16.0 | 添加于：v13.1.0, v12.16.0 |
:::

在一个包中，可以通过包的名称引用包的 `package.json` 文件的 [`"exports"`](/zh/nodejs/api/packages#exports) 字段中定义的值。 例如，假设 `package.json` 是：

```json [JSON]
// package.json
{
  "name": "a-package",
  "exports": {
    ".": "./index.mjs",
    "./foo.js": "./foo.js"
  }
}
```
然后，*该包中*的任何模块都可以引用包本身的导出：

```js [ESM]
// ./a-module.mjs
import { something } from 'a-package'; // 从 ./index.mjs 导入 "something"。
```
只有当 `package.json` 具有 [`"exports"`](/zh/nodejs/api/packages#exports) 时，自引用才可用，并且只允许导入 [`"exports"`](/zh/nodejs/api/packages#exports)（在 `package.json` 中）允许的内容。 因此，在给定前一个包的情况下，下面的代码会生成运行时错误：

```js [ESM]
// ./another-module.mjs

// 从 ./m.mjs 导入 "another"。 失败，因为
// "package.json" 的 "exports" 字段
// 未提供名为 "./m.mjs" 的导出。
import { another } from 'a-package/m.mjs';
```
在使用 `require` 时，自引用也可用，无论是在 ES 模块中还是在 CommonJS 模块中。 例如，此代码也可以工作：

```js [CJS]
// ./a-module.js
const { something } = require('a-package/foo.js'); // 从 ./foo.js 加载。
```
最后，自引用也适用于作用域包。 例如，此代码也可以工作：

```json [JSON]
// package.json
{
  "name": "@my/package",
  "exports": "./index.js"
}
```
```js [CJS]
// ./index.js
module.exports = 42;
```
```js [CJS]
// ./other.js
console.log(require('@my/package'));
```
```bash [BASH]
$ node other.js
42
```
## 双 CommonJS/ES 模块包 {#dual-commonjs/es-module-packages}

有关详细信息，请参阅[包示例仓库](https://github.com/nodejs/package-examples)。

## Node.js `package.json` 字段定义 {#nodejs-packagejson-field-definitions}

本节介绍 Node.js 运行时使用的字段。 其他工具（例如 [npm](https://docs.npmjs.com/cli/v8/configuring-npm/package-json)）使用 Node.js 忽略的其他字段，此处未作记录。

Node.js 中使用了 `package.json` 文件中的以下字段：

- [`"name"`](/zh/nodejs/api/packages#name) - 在包中使用命名导入时相关。 也被包管理器用作包的名称。
- [`"main"`](/zh/nodejs/api/packages#main) - 加载包时的默认模块，如果未指定 exports，以及在 Node.js 引入 exports 之前的版本中。
- [`"packageManager"`](/zh/nodejs/api/packages#packagemanager) - 建议在向包贡献时使用的包管理器。 由 [Corepack](/zh/nodejs/api/corepack) 垫片利用。
- [`"type"`](/zh/nodejs/api/packages#type) - 包类型，用于确定是将 `.js` 文件加载为 CommonJS 还是 ES 模块。
- [`"exports"`](/zh/nodejs/api/packages#exports) - 包导出和条件导出。 存在时，限制可以从包中加载哪些子模块。
- [`"imports"`](/zh/nodejs/api/packages#imports) - 包导入，供包本身中的模块使用。


### `"name"` {#"name"}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.6.0, v12.16.0 | 移除 `--experimental-resolve-self` 选项。 |
| v13.1.0, v12.16.0 | 添加于: v13.1.0, v12.16.0 |
:::

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "name": "package-name"
}
```
`"name"` 字段定义了你的包名。发布到 *npm* 仓库需要一个满足[特定要求](https://docs.npmjs.com/files/package.json#name)的名称。

除了 [`"exports"`](/zh/nodejs/api/packages#exports) 字段之外，`"name"` 字段还可以用于[使用其名称自引用](/zh/nodejs/api/packages#self-referencing-a-package-using-its-name)一个包。

### `"main"` {#"main"}

**添加于: v0.4.0**

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "main": "./index.js"
}
```
`"main"` 字段定义了通过 `node_modules` 查找按名称导入包时的入口点。 它的值是一个路径。

当一个包具有 [`"exports"`](/zh/nodejs/api/packages#exports) 字段时，通过名称导入包时，它将优先于 `"main"` 字段。

它还定义了当[通过 `require()` 加载包目录](/zh/nodejs/api/modules#folders-as-modules)时使用的脚本。

```js [CJS]
// 这会解析到 ./path/to/directory/index.js。
require('./path/to/directory');
```
### `"packageManager"` {#"packagemanager"}

**添加于: v16.9.0, v14.19.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "packageManager": "<package manager name>@<version>"
}
```
`"packageManager"` 字段定义了在当前项目上工作时期望使用的包管理器。 它可以设置为任何[支持的包管理器](/zh/nodejs/api/corepack#supported-package-managers)，并将确保你的团队使用完全相同的包管理器版本，而无需安装 Node.js 之外的任何其他内容。

此字段目前是实验性的，需要选择启用； 有关该过程的详细信息，请查看 [Corepack](/zh/nodejs/api/corepack) 页面。


### `"type"` {#"type"}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v13.2.0, v12.17.0 | 取消 `--experimental-modules` 标志。 |
| v12.0.0 | 添加于: v12.0.0 |
:::

- 类型: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`"type"` 字段定义了 Node.js 用于所有 `.js` 文件的模块格式，这些文件将该 `package.json` 文件作为其最近的父级文件。

当最近的父级 `package.json` 文件包含一个值为 `"module"` 的顶级字段 `"type"` 时，以 `.js` 结尾的文件将被加载为 ES 模块。

最近的父级 `package.json` 被定义为在当前文件夹、该文件夹的父级等位置搜索时找到的第一个 `package.json`，直到到达 node_modules 文件夹或卷根。

```json [JSON]
// package.json
{
  "type": "module"
}
```
```bash [BASH]
# 与前面的 package.json 在同一文件夹中 {#in-same-folder-as-preceding-packagejson}
node my-app.js # 作为 ES 模块运行
```
如果最近的父级 `package.json` 缺少 `"type"` 字段，或者包含 `"type": "commonjs"`，则 `.js` 文件被视为 [CommonJS](/zh/nodejs/api/modules)。 如果到达卷根并且没有找到 `package.json`，则 `.js` 文件被视为 [CommonJS](/zh/nodejs/api/modules)。

如果最近的父级 `package.json` 包含 `"type": "module"`，则 `.js` 文件的 `import` 语句被视为 ES 模块。

```js [ESM]
// my-app.js，与上面的示例是同一部分
import './startup.js'; // 由于 package.json，作为 ES 模块加载
```
无论 `"type"` 字段的值如何，`.mjs` 文件始终被视为 ES 模块，`.cjs` 文件始终被视为 CommonJS。

### `"exports"` {#"exports"}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v14.13.0, v12.20.0 | 添加对 `"exports"` 模式的支持。 |
| v13.7.0, v12.17.0 | 取消 conditional exports 标志。 |
| v13.7.0, v12.16.0 | 实现逻辑 conditional exports 排序。 |
| v13.7.0, v12.16.0 | 删除 `--experimental-conditional-exports` 选项。 在 12.16.0 中，conditional exports 仍然在 `--experimental-modules` 之后。 |
| v13.2.0, v12.16.0 | 实现 conditional exports。 |
| v12.7.0 | 添加于: v12.7.0 |
:::

- 类型: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "exports": "./index.js"
}
```
`"exports"` 字段允许定义通过名称导入的包的[入口点](/zh/nodejs/api/packages#package-entry-points)，这些入口点通过 `node_modules` 查找或[自引用](/zh/nodejs/api/packages#self-referencing-a-package-using-its-name)其自身名称来加载。 它在 Node.js 12+ 中作为 [`"main"`](/zh/nodejs/api/packages#main) 的替代方案受到支持，可以支持定义[子路径导出](/zh/nodejs/api/packages#subpath-exports)和[条件导出](/zh/nodejs/api/packages#conditional-exports)，同时封装内部未导出的模块。

[条件导出](/zh/nodejs/api/packages#conditional-exports)也可以在 `"exports"` 中使用，以定义每个环境的不同包入口点，包括该包是通过 `require` 还是通过 `import` 引用。

`"exports"` 中定义的所有路径必须是以 `./` 开头的相对文件 URL。


### `"imports"` {#"imports"}

**添加于: v14.6.0, v12.19.0**

- 类型: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

```json [JSON]
// package.json
{
  "imports": {
    "#dep": {
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    }
  },
  "dependencies": {
    "dep-node-native": "^1.0.0"
  }
}
```

imports 字段中的条目必须是以 `#` 开头的字符串。

包导入允许映射到外部包。

此字段为当前包定义 [子路径导入](/zh/nodejs/api/packages#subpath-imports)。

