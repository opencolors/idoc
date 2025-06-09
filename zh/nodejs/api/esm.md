---
title: Node.js 中的 ECMAScript 模块
description: 本页面详细介绍了在 Node.js 中使用 ECMAScript 模块（ESM）的方法，包括模块解析、导入和导出语法，以及与 CommonJS 的兼容性。
head:
  - - meta
    - name: og:title
      content: Node.js 中的 ECMAScript 模块 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 本页面详细介绍了在 Node.js 中使用 ECMAScript 模块（ESM）的方法，包括模块解析、导入和导出语法，以及与 CommonJS 的兼容性。
  - - meta
    - name: twitter:title
      content: Node.js 中的 ECMAScript 模块 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 本页面详细介绍了在 Node.js 中使用 ECMAScript 模块（ESM）的方法，包括模块解析、导入和导出语法，以及与 CommonJS 的兼容性。
---


# 模块：ECMAScript 模块 {#modules-ecmascript-modules}

::: info [历史记录]
| 版本 | 变更 |
| --- | --- |
| v23.1.0 | 导入属性不再是实验性的。 |
| v22.0.0 | 移除对导入断言的支持。 |
| v21.0.0, v20.10.0, v18.20.0 | 增加对导入属性的实验性支持。 |
| v20.0.0, v18.19.0 | 模块自定义钩子在主线程之外执行。 |
| v18.6.0, v16.17.0 | 增加对链接模块自定义钩子的支持。 |
| v17.1.0, v16.14.0 | 增加对导入断言的实验性支持。 |
| v17.0.0, v16.12.0 | 合并自定义钩子，移除 `getFormat`、`getSource`、`transformSource` 和 `getGlobalPreloadCode` 钩子，增加 `load` 和 `globalPreload` 钩子，允许从 `resolve` 或 `load` 钩子返回 `format`。 |
| v14.8.0 | 取消对顶层 await 的标记。 |
| v15.3.0, v14.17.0, v12.22.0 | 稳定模块实现。 |
| v14.13.0, v12.20.0 | 支持检测 CommonJS 命名导出。 |
| v14.0.0, v13.14.0, v12.20.0 | 移除实验性模块警告。 |
| v13.2.0, v12.17.0 | 加载 ECMAScript 模块不再需要命令行标志。 |
| v12.0.0 | 增加通过 `package.json` `"type"` 字段支持使用 `.js` 文件扩展名的 ES 模块。 |
| v8.5.0 | 添加于: v8.5.0 |
:::

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

## 简介 {#introduction}

ECMAScript 模块是[官方标准格式](https://tc39.github.io/ecma262/#sec-modules)，用于打包 JavaScript 代码以供重用。 模块使用各种 [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 和 [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) 语句定义。

以下 ES 模块示例导出一个函数：

```js [ESM]
// addTwo.mjs
function addTwo(num) {
  return num + 2;
}

export { addTwo };
```
以下 ES 模块示例从 `addTwo.mjs` 导入函数：

```js [ESM]
// app.mjs
import { addTwo } from './addTwo.mjs';

// 打印：6
console.log(addTwo(4));
```
Node.js 完全支持当前指定的 ECMAScript 模块，并提供它们与其原始模块格式 [CommonJS](/zh/nodejs/api/modules) 之间的互操作性。


## 启用 {#enabling}

Node.js 有两个模块系统：[CommonJS](/zh/nodejs/api/modules) 模块和 ECMAScript 模块。

作者可以通过 `.mjs` 文件扩展名、`package.json` 文件中 `"type"` 字段的值为 `"module"`，或者使用 [`--input-type`](/zh/nodejs/api/cli#--input-typetype) 标志并将其值设置为 `"module"` 来告诉 Node.js 将 JavaScript 解释为 ES 模块。这些都是将代码明确标记为打算作为 ES 模块运行的标志。

相反，作者可以通过 `.cjs` 文件扩展名、`package.json` 文件中 `"type"` 字段的值为 `"commonjs"`，或者使用 [`--input-type`](/zh/nodejs/api/cli#--input-typetype) 标志并将其值设置为 `"commonjs"` 来显式地告诉 Node.js 将 JavaScript 解释为 CommonJS。

当代码缺少任何模块系统的显式标记时，Node.js 将检查模块的源代码以查找 ES 模块语法。 如果找到这样的语法，Node.js 将把代码作为 ES 模块运行； 否则，它将把模块作为 CommonJS 运行。 有关更多详细信息，请参阅 [确定模块系统](/zh/nodejs/api/packages#determining-module-system)。

## 包 {#packages}

本节已移至 [模块：包](/zh/nodejs/api/packages)。

## `import` 说明符 {#import-specifiers}

### 术语 {#terminology}

`import` 语句的*说明符*是 `from` 关键字后面的字符串，例如 `import { sep } from 'node:path'` 中的 `'node:path'`。 说明符也用于 `export from` 语句中，并用作 `import()` 表达式的参数。

说明符有三种类型：

- *相对说明符*，例如 `'./startup.js'` 或 `'../config.mjs'`。 它们指的是相对于导入文件位置的路径。 *对于这些，文件扩展名始终是必需的。*
- *裸说明符*，例如 `'some-package'` 或 `'some-package/shuffle'`。 它们可以通过包名称引用包的主入口点，或者引用包中的特定功能模块（如示例中所示，以包名称为前缀）。 *只有对于没有 <a href="packages.html#exports"><code>"exports"</code></a> 字段的包，才需要包含文件扩展名。*
- *绝对说明符*，例如 `'file:///opt/nodejs/config.js'`。 它们直接且显式地引用完整路径。

裸说明符解析由 [Node.js 模块解析和加载算法](/zh/nodejs/api/esm#resolution-algorithm-specification) 处理。 所有其他说明符解析始终仅通过标准相对 [URL](https://url.spec.whatwg.org/) 解析语义来解析。

与 CommonJS 中一样，可以通过将路径附加到包名称来访问包中的模块文件，除非包的 [`package.json`](/zh/nodejs/api/packages#nodejs-packagejson-field-definitions) 包含 [`"exports"`](/zh/nodejs/api/packages#exports) 字段，在这种情况下，只能通过 [`"exports"`](/zh/nodejs/api/packages#exports) 中定义的路径来访问包中的文件。

有关适用于 Node.js 模块解析中裸说明符的这些包解析规则的详细信息，请参阅 [包文档](/zh/nodejs/api/packages)。


### 强制的文件扩展名 {#mandatory-file-extensions}

当使用 `import` 关键字来解析相对或绝对说明符时，必须提供文件扩展名。目录索引（例如 `'./startup/index.js'`）也必须完全指定。

这种行为与浏览器环境中 `import` 的行为一致，假设服务器配置正常。

### URLs {#urls}

ES 模块被解析并缓存为 URL。这意味着特殊字符必须进行 [百分比编码](/zh/nodejs/api/url#percent-encoding-in-urls)，例如 `#` 编码为 `%23`，`?` 编码为 `%3F`。

支持 `file:`、`node:` 和 `data:` URL 方案。除非使用 [自定义 HTTPS 加载器](/zh/nodejs/api/module#import-from-https)，否则 Node.js 本身不支持 `'https://example.com/app.js'` 这样的说明符。

#### `file:` URLs {#file-urls}

如果用于解析模块的 `import` 说明符具有不同的查询或片段，则模块会被多次加载。

```js [ESM]
import './foo.mjs?query=1'; // 加载 ./foo.mjs，查询字符串为 "?query=1"
import './foo.mjs?query=2'; // 加载 ./foo.mjs，查询字符串为 "?query=2"
```
卷根目录可以通过 `/`、`//` 或 `file:///` 引用。 鉴于 [URL](https://url.spec.whatwg.org/) 和路径解析之间的差异（例如百分比编码细节），建议在导入路径时使用 [url.pathToFileURL](/zh/nodejs/api/url#urlpathtofileurlpath-options)。

#### `data:` 导入 {#data-imports}

**添加于: v12.10.0**

[`data:` URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) 支持以下 MIME 类型导入：

- `text/javascript` 用于 ES 模块
- `application/json` 用于 JSON
- `application/wasm` 用于 Wasm

```js [ESM]
import 'data:text/javascript,console.log("hello!");';
import _ from 'data:application/json,"world!"' with { type: 'json' };
```
`data:` URLs 仅解析内置模块的 [裸说明符](/zh/nodejs/api/esm#terminology) 和 [绝对说明符](/zh/nodejs/api/esm#terminology)。解析[相对说明符](/zh/nodejs/api/esm#terminology)不起作用，因为 `data:` 不是 [特殊方案](https://url.spec.whatwg.org/#special-scheme)。 例如，尝试从 `data:text/javascript,import "./foo";` 加载 `./foo` 会解析失败，因为 `data:` URL 没有相对解析的概念。


#### `node:` 导入 {#node-imports}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v16.0.0, v14.18.0 | 添加了 `node:` 导入对 `require(...)` 的支持。 |
| v14.13.1, v12.20.0 | 添加于：v14.13.1, v12.20.0 |
:::

`node:` URL 作为加载 Node.js 内置模块的替代方法被支持。 这种 URL 方案允许通过有效的绝对 URL 字符串引用内置模块。

```js [ESM]
import fs from 'node:fs/promises';
```
## 导入属性 {#import-attributes}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v21.0.0, v20.10.0, v18.20.0 | 从导入断言切换到导入属性。 |
| v17.1.0, v16.14.0 | 添加于：v17.1.0, v16.14.0 |
:::

::: tip [稳定度: 2 - 稳定]
[稳定度: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

[导入属性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with)是一种内联语法，用于模块导入语句，以便在模块说明符旁边传递更多信息。

```js [ESM]
import fooData from './foo.json' with { type: 'json' };

const { default: barData } =
  await import('./bar.json', { with: { type: 'json' } });
```
Node.js 仅支持 `type` 属性，它支持以下值：

| 属性   `type` | 所需用于 |
| --- | --- |
| `'json'` | [JSON 模块](/zh/nodejs/api/esm#json-modules) |
导入 JSON 模块时，`type: 'json'` 属性是强制性的。

## 内置模块 {#built-in-modules}

[内置模块](/zh/nodejs/api/modules#built-in-modules) 提供其公共 API 的命名导出。 还提供了一个默认导出，它是 CommonJS 导出的值。 默认导出可用于（包括）修改命名导出。 内置模块的命名导出仅通过调用 [`module.syncBuiltinESMExports()`](/zh/nodejs/api/module#modulesyncbuiltinesmexports) 来更新。

```js [ESM]
import EventEmitter from 'node:events';
const e = new EventEmitter();
```
```js [ESM]
import { readFile } from 'node:fs';
readFile('./foo.txt', (err, source) => {
  if (err) {
    console.error(err);
  } else {
    console.log(source);
  }
});
```
```js [ESM]
import fs, { readFileSync } from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { Buffer } from 'node:buffer';

fs.readFileSync = () => Buffer.from('Hello, ESM');
syncBuiltinESMExports();

fs.readFileSync === readFileSync;
```

## `import()` 表达式 {#import-expressions}

CommonJS 和 ES 模块都支持 [动态 `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)。在 CommonJS 模块中，它可用于加载 ES 模块。

## `import.meta` {#importmeta}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`import.meta` 元属性是一个 `Object`，其中包含以下属性。它仅在 ES 模块中受支持。

### `import.meta.dirname` {#importmetadirname}

**添加于: v21.2.0, v20.11.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).2 - 发布候选版本
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 当前模块的目录名。这与 [`import.meta.filename`](/zh/nodejs/api/esm#importmetafilename) 的 [`path.dirname()`](/zh/nodejs/api/path#pathdirnamepath) 相同。

### `import.meta.filename` {#importmetafilename}

**添加于: v21.2.0, v20.11.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).2 - 发布候选版本
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 当前模块的完整绝对路径和文件名，并解析符号链接。
- 这与 [`import.meta.url`](/zh/nodejs/api/esm#importmetaurl) 的 [`url.fileURLToPath()`](/zh/nodejs/api/url#urlfileurltopathurl-options) 相同。

### `import.meta.url` {#importmetaurl}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 模块的绝对 `file:` URL。

其定义与浏览器中提供当前模块文件的 URL 的定义完全相同。

这支持有用的模式，例如相对文件加载：

```js [ESM]
import { readFileSync } from 'node:fs';
const buffer = readFileSync(new URL('./data.proto', import.meta.url));
```
### `import.meta.resolve(specifier)` {#importmetaresolvespecifier}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.6.0, v18.19.0 | 不再位于 `--experimental-import-meta-resolve` CLI 标志之后，除非是非标准的 `parentURL` 参数。 |
| v20.6.0, v18.19.0 | 此 API 在定位到不映射到本地 FS 上的现有文件的 `file:` URL 时不再抛出错误。 |
| v20.0.0, v18.19.0 | 此 API 现在同步返回一个字符串，而不是 Promise。 |
| v16.2.0, v14.18.0 | 添加了对 WHATWG `URL` 对象到 `parentURL` 参数的支持。 |
| v13.9.0, v12.16.2 | 添加于: v13.9.0, v12.16.2 |
:::

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).2 - 发布候选版本
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要相对于当前模块解析的模块标识符。
- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 标识符将解析为的绝对 URL 字符串。

[`import.meta.resolve`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve) 是一个作用域限定于每个模块的模块相关解析函数，返回 URL 字符串。

```js [ESM]
const dependencyAsset = import.meta.resolve('component-lib/asset.css');
// file:///app/node_modules/component-lib/asset.css
import.meta.resolve('./dep.js');
// file:///app/dep.js
```
支持 Node.js 模块解析的所有功能。 依赖项解析受包中允许的导出解析的约束。

**注意事项**:

- 这可能会导致同步文件系统操作，这可能会对性能产生类似于 `require.resolve` 的影响。
- 此功能在自定义加载器中不可用（它会创建死锁）。

**非标准 API**:

当使用 `--experimental-import-meta-resolve` 标志时，该函数接受第二个参数：

- `parent` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 一个可选的父模块绝对 URL，用于从中进行解析。 **默认值:** `import.meta.url`


## 与 CommonJS 的互操作性 {#interoperability-with-commonjs}

### `import` 语句 {#import-statements}

`import` 语句可以引用 ES 模块或 CommonJS 模块。`import` 语句仅允许在 ES 模块中使用，但动态 [`import()`](/zh/nodejs/api/esm#import-expressions) 表达式在 CommonJS 中受支持，用于加载 ES 模块。

当导入 [CommonJS 模块](/zh/nodejs/api/esm#commonjs-namespaces)时，`module.exports` 对象作为默认导出提供。命名导出可能是可用的，通过静态分析提供，以便更好地兼容生态系统。

### `require` {#require}

CommonJS 模块 `require` 目前仅支持加载同步 ES 模块（即，不使用顶层 `await` 的 ES 模块）。

有关详细信息，请参阅[使用 `require()` 加载 ECMAScript 模块](/zh/nodejs/api/modules#loading-ecmascript-modules-using-require)。

### CommonJS 命名空间 {#commonjs-namespaces}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.0.0 | 将 `'module.exports'` 导出标记添加到 CJS 命名空间。 |
| v14.13.0 | 添加于：v14.13.0 |
:::

CommonJS 模块由一个 `module.exports` 对象组成，该对象可以是任何类型。

为了支持这一点，当从 ECMAScript 模块导入 CommonJS 时，将构造 CommonJS 模块的命名空间包装器，该包装器始终提供一个 `default` 导出键，指向 CommonJS `module.exports` 值。

此外，还会对 CommonJS 模块的源代码执行启发式静态分析，以获得一个尽力而为的静态导出列表，以便从 `module.exports` 上的值提供给命名空间。 这是必要的，因为这些命名空间必须在 CJS 模块评估之前构建。

这些 CommonJS 命名空间对象还提供 `default` 导出作为 `'module.exports'` 命名导出，以便明确表明它们在 CommonJS 中的表示形式使用此值，而不是命名空间值。 这反映了 [`require(esm)`](/zh/nodejs/api/modules#loading-ecmascript-modules-using-require) 互操作支持中 `'module.exports'` 导出名称的处理语义。

当导入 CommonJS 模块时，可以使用 ES 模块默认导入或其相应的语法糖来可靠地导入它：

```js [ESM]
import { default as cjs } from 'cjs';
// 与上面相同
import cjsSugar from 'cjs';

console.log(cjs);
console.log(cjs === cjsSugar);
// 打印：
//   <module.exports>
//   true
```

无论何时使用 `import * as m from 'cjs'` 或动态导入，都可以直接观察到此模块命名空间异构对象：

```js [ESM]
import * as m from 'cjs';
console.log(m);
console.log(m === await import('cjs'));
// 打印：
//   [Module] { default: <module.exports>, 'module.exports': <module.exports> }
//   true
```

为了更好地与 JS 生态系统中的现有用法兼容，Node.js 还会尝试确定每个导入的 CommonJS 模块的 CommonJS 命名导出，以使用静态分析过程将其作为单独的 ES 模块导出提供。

例如，考虑一个编写的 CommonJS 模块：

```js [CJS]
// cjs.cjs
exports.name = 'exported';
```

前面的模块支持 ES 模块中的命名导入：

```js [ESM]
import { name } from './cjs.cjs';
console.log(name);
// 打印：'exported'

import cjs from './cjs.cjs';
console.log(cjs);
// 打印：{ name: 'exported' }

import * as m from './cjs.cjs';
console.log(m);
// 打印：
//   [Module] {
//     default: { name: 'exported' },
//     'module.exports': { name: 'exported' },
//     name: 'exported'
//   }
```

从记录模块命名空间异构对象的最后一个示例可以看出，`name` 导出是从 `module.exports` 对象复制下来的，并在导入模块时直接设置在 ES 模块命名空间上。

不会检测到实时绑定更新或添加到 `module.exports` 的新导出以获取这些命名导出。

命名导出检测基于常见语法模式，但并非总是能正确检测命名导出。 在这些情况下，使用上述默认导入形式可能是一个更好的选择。

命名导出检测涵盖许多常见的导出模式、重新导出模式以及构建工具和转换器输出。 有关已实现的精确语义，请参阅 [cjs-module-lexer](https://github.com/nodejs/cjs-module-lexer/tree/1.2.2)。


### ES 模块和 CommonJS 的区别 {#differences-between-es-modules-and-commonjs}

#### 没有 `require`、`exports` 或 `module.exports` {#no-require-exports-or-moduleexports}

在大多数情况下，ES 模块 `import` 可以用来加载 CommonJS 模块。

如果需要，可以使用 [`module.createRequire()`](/zh/nodejs/api/module#modulecreaterequirefilename) 在 ES 模块中构造 `require` 函数。

#### 没有 `__filename` 或 `__dirname` {#no-__filename-or-__dirname}

这些 CommonJS 变量在 ES 模块中不可用。

`__filename` 和 `__dirname` 的用例可以通过 [`import.meta.filename`](/zh/nodejs/api/esm#importmetafilename) 和 [`import.meta.dirname`](/zh/nodejs/api/esm#importmetadirname) 复制。

#### 不支持加载插件 {#no-addon-loading}

目前，ES 模块导入不支持[插件](/zh/nodejs/api/addons)。

它们可以通过 [`module.createRequire()`](/zh/nodejs/api/module#modulecreaterequirefilename) 或 [`process.dlopen`](/zh/nodejs/api/process#processdlopenmodule-filename-flags) 加载。

#### 没有 `require.resolve` {#no-requireresolve}

相对路径解析可以通过 `new URL('./local', import.meta.url)` 来处理。

要完全替代 `require.resolve`，可以使用 [import.meta.resolve](/zh/nodejs/api/esm#importmetaresolvespecifier) API。

或者，可以使用 `module.createRequire()`。

#### 没有 `NODE_PATH` {#no-node_path}

`NODE_PATH` 不是解析 `import` 规范的一部分。 如果需要此行为，请使用符号链接。

#### 没有 `require.extensions` {#no-requireextensions}

`require.extensions` 不被 `import` 使用。 模块自定义钩子可以提供替代方案。

#### 没有 `require.cache` {#no-requirecache}

`require.cache` 不被 `import` 使用，因为 ES 模块加载器有自己的独立缓存。

## JSON 模块 {#json-modules}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.1.0 | JSON 模块不再是实验性的。 |
:::

::: tip [稳定: 2 - 稳定]
[稳定: 2](/zh/nodejs/api/documentation#stability-index) [稳定性: 2](/zh/nodejs/api/documentation#stability-index) - 稳定
:::

JSON 文件可以通过 `import` 引用：

```js [ESM]
import packageConfig from './package.json' with { type: 'json' };
```
`with { type: 'json' }` 语法是强制性的；请参阅 [导入属性](/zh/nodejs/api/esm#import-attributes)。

导入的 JSON 只公开一个 `default` 导出。 不支持命名导出。 在 CommonJS 缓存中创建一个缓存条目以避免重复。 如果 JSON 模块已经从同一路径导入，则在 CommonJS 中返回相同的对象。


## Wasm 模块 {#wasm-modules}

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验性
:::

导入 WebAssembly 模块在 `--experimental-wasm-modules` 标志下被支持，允许将任何 `.wasm` 文件作为普通模块导入，同时也支持它们的模块导入。

这种集成与 [WebAssembly 的 ES 模块集成提案](https://github.com/webassembly/esm-integration) 相一致。

例如，一个包含以下内容的 `index.mjs`：

```js [ESM]
import * as M from './module.wasm';
console.log(M);
```
在以下命令下执行：

```bash [BASH]
node --experimental-wasm-modules index.mjs
```
将会为 `module.wasm` 的实例化提供导出接口。

## 顶层 `await` {#top-level-await}

**添加于: v14.8.0**

`await` 关键字可以在 ECMAScript 模块的顶层主体中使用。

假设一个 `a.mjs` 包含：

```js [ESM]
export const five = await Promise.resolve(5);
```
以及一个 `b.mjs` 包含：

```js [ESM]
import { five } from './a.mjs';

console.log(five); // 输出 `5`
```
```bash [BASH]
node b.mjs # 可以运行
```
如果一个顶层 `await` 表达式永远无法解决，`node` 进程将以 `13` [状态码](/zh/nodejs/api/process#exit-codes) 退出。

```js [ESM]
import { spawn } from 'node:child_process';
import { execPath } from 'node:process';

spawn(execPath, [
  '--input-type=module',
  '--eval',
  // 永不解决的 Promise:
  'await new Promise(() => {})',
]).once('exit', (code) => {
  console.log(code); // 输出 `13`
});
```
## 加载器 {#loaders}

以前的加载器文档现在位于 [模块：自定义钩子](/zh/nodejs/api/module#customization-hooks)。

## 解析和加载算法 {#resolution-and-loading-algorithm}

### 特性 {#features}

默认解析器具有以下属性：

- 基于 FileURL 的解析，与 ES 模块使用的相同
- 相对和绝对 URL 解析
- 没有默认扩展名
- 没有文件夹主入口
- 通过 node_modules 进行裸标识符包解析查找
- 不会因为未知的扩展名或协议而失败
- 可以选择性地提供格式提示给加载阶段

默认加载器具有以下属性：

- 通过 `node:` URL 支持内置模块加载
- 通过 `data:` URL 支持“内联”模块加载
- 支持 `file:` 模块加载
- 在任何其他 URL 协议上失败
- 在 `file:` 加载的未知扩展名上失败（仅支持 `.cjs`、`.js` 和 `.mjs`）


### 解析算法 {#resolution-algorithm}

加载 ES 模块标识符的算法通过下面的 **ESM_RESOLVE** 方法给出。它返回相对于 parentURL 的模块标识符的已解析 URL。

解析算法确定模块加载的完整已解析 URL，以及建议的模块格式。解析算法不确定已解析 URL 协议是否可以加载，或者是否允许文件扩展名，相反，这些验证由 Node.js 在加载阶段应用（例如，如果它被要求加载一个具有非 `file:`、`data:` 或 `node:` 协议的 URL）。

该算法还尝试根据扩展名确定文件的格式（参见下面的 `ESM_FILE_FORMAT` 算法）。如果它无法识别文件扩展名（例如，如果它不是 `.mjs`、`.cjs` 或 `.json`），则返回 `undefined` 格式，这将在加载阶段抛出错误。

确定已解析 URL 的模块格式的算法由 **ESM_FILE_FORMAT** 提供，它返回任何文件的唯一模块格式。对于 ECMAScript 模块，返回 *"module"* 格式，而 *"commonjs"* 格式用于指示通过遗留的 CommonJS 加载器进行加载。未来更新中可以扩展其他格式，例如 *"addon"*。

在以下算法中，所有子例程错误都作为这些顶级例程的错误传播，除非另有说明。

*defaultConditions* 是条件环境名称数组，`["node", "import"]`。

解析器可以抛出以下错误：

- *无效的模块标识符*：模块标识符是无效的 URL、包名或包子路径标识符。
- *无效的包配置*：package.json 配置无效或包含无效的配置。
- *无效的包目标*：包 exports 或 imports 定义的包的目标模块是无效的类型或字符串目标。
- *包路径未导出*：包 exports 未定义或允许给定模块的包中的目标子路径。
- *未定义包导入*：包 imports 未定义标识符。
- *未找到模块*：请求的包或模块不存在。
- *不支持的目录导入*：已解析的路径对应于一个目录，该目录不是模块导入支持的目标。


### 解析算法规范 {#resolution-algorithm-specification}

**ESM_RESOLVE**(*specifier*, *parentURL*)

**PACKAGE_RESOLVE**(*packageSpecifier*, *parentURL*)

**PACKAGE_SELF_RESOLVE**(*packageName*, *packageSubpath*, *parentURL*)

**PACKAGE_EXPORTS_RESOLVE**(*packageURL*, *subpath*, *exports*, *conditions*)

**PACKAGE_IMPORTS_RESOLVE**(*specifier*, *parentURL*, *conditions*)

**PACKAGE_IMPORTS_EXPORTS_RESOLVE**(*matchKey*, *matchObj*, *packageURL*, *isImports*, *conditions*)

**PATTERN_KEY_COMPARE**(*keyA*, *keyB*)

**PACKAGE_TARGET_RESOLVE**(*packageURL*, *target*, *patternMatch*, *isImports*, *conditions*)

**ESM_FILE_FORMAT**(*url*)

**LOOKUP_PACKAGE_SCOPE**(*url*)

**READ_PACKAGE_JSON**(*packageURL*)

**DETECT_MODULE_SYNTAX**(*source*)

### 自定义 ESM 标识符解析算法 {#customizing-esm-specifier-resolution-algorithm}

[模块自定义钩子](/zh/nodejs/api/module#customization-hooks) 提供了一种自定义 ESM 标识符解析算法的机制。一个为 ESM 标识符提供 CommonJS 风格解析的示例是 [commonjs-extension-resolution-loader](https://github.com/nodejs/loaders-test/tree/main/commonjs-extension-resolution-loader)。

