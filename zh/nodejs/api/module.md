---
title: Node.js 文档 - 模块系统
description: 本页面详细介绍了Node.js的模块系统，包括CommonJS和ES模块，如何加载模块，模块缓存，以及两种模块系统之间的区别。
head:
  - - meta
    - name: og:title
      content: Node.js 文档 - 模块系统 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 本页面详细介绍了Node.js的模块系统，包括CommonJS和ES模块，如何加载模块，模块缓存，以及两种模块系统之间的区别。
  - - meta
    - name: twitter:title
      content: Node.js 文档 - 模块系统 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 本页面详细介绍了Node.js的模块系统，包括CommonJS和ES模块，如何加载模块，模块缓存，以及两种模块系统之间的区别。
---


# 模块：`node:module` API {#modules-nodemodule-api}

**添加于: v0.3.7**

## `Module` 对象 {#the-module-object}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

在与 `Module` 实例交互时提供通用实用程序方法，`Module` 实例通常在 [CommonJS](/zh/nodejs/api/modules) 模块中看到 `module` 变量。 通过 `import 'node:module'` 或 `require('node:module')` 访问。

### `module.builtinModules` {#modulebuiltinmodules}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.5.0 | 列表现在也包含仅前缀模块。 |
| v9.3.0, v8.10.0, v6.13.0 | 添加于: v9.3.0, v8.10.0, v6.13.0 |
:::

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Node.js 提供的所有模块名称的列表。 可用于验证模块是否由第三方维护。

此上下文中的 `module` 与 [模块包装器](/zh/nodejs/api/modules#the-module-wrapper) 提供的对象不同。 要访问它，请引用 `Module` 模块：

::: code-group
```js [ESM]
// module.mjs
// 在 ECMAScript 模块中
import { builtinModules as builtin } from 'node:module';
```

```js [CJS]
// module.cjs
// 在 CommonJS 模块中
const builtin = require('node:module').builtinModules;
```
:::

### `module.createRequire(filename)` {#modulecreaterequirefilename}

**添加于: v12.2.0**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 用于构造 require 函数的文件名。 必须是文件 URL 对象、文件 URL 字符串或绝对路径字符串。
- 返回：[\<require\>](/zh/nodejs/api/modules#requireid) Require 函数

```js [ESM]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// sibling-module.js 是一个 CommonJS 模块。
const siblingModule = require('./sibling-module');
```
### `module.findPackageJSON(specifier[, base])` {#modulefindpackagejsonspecifier-base}

**添加于: v23.2.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 要检索其 `package.json` 的模块的说明符。 传递*裸说明符*时，将返回包根目录下的 `package.json`。 传递*相对说明符*或*绝对说明符*时，将返回最接近的父 `package.json`。
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 包含模块的绝对位置 (`file:` URL 字符串或 FS 路径)。 对于 CJS，请使用 `__filename`（而不是 `__dirname`！）； 对于 ESM，请使用 `import.meta.url`。 如果 `specifier` 是*绝对说明符*，则无需传递它。
- 返回：[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 如果找到 `package.json`，则为路径。 当 `startLocation` 是一个包时，该包的根 `package.json`；当是相对或未解析时，则为最接近 `startLocation` 的 `package.json`。

```text [TEXT]
/path/to/project
  ├ packages/
    ├ bar/
      ├ bar.js
      └ package.json // name = '@foo/bar'
    └ qux/
      ├ node_modules/
        └ some-package/
          └ package.json // name = 'some-package'
      ├ qux.js
      └ package.json // name = '@foo/qux'
  ├ main.js
  └ package.json // name = '@foo'
```

::: code-group
```js [ESM]
// /path/to/project/packages/bar/bar.js
import { findPackageJSON } from 'node:module';

findPackageJSON('..', import.meta.url);
// '/path/to/project/package.json'
// 传递绝对说明符时结果相同：
findPackageJSON(new URL('../', import.meta.url));
findPackageJSON(import.meta.resolve('../'));

findPackageJSON('some-package', import.meta.url);
// '/path/to/project/packages/bar/node_modules/some-package/package.json'
// 传递绝对说明符时，如果已解析的模块位于具有嵌套 `package.json` 的子文件夹中，则可能会获得不同的结果。
findPackageJSON(import.meta.resolve('some-package'));
// '/path/to/project/packages/bar/node_modules/some-package/some-subfolder/package.json'

findPackageJSON('@foo/qux', import.meta.url);
// '/path/to/project/packages/qux/package.json'
```

```js [CJS]
// /path/to/project/packages/bar/bar.js
const { findPackageJSON } = require('node:module');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

findPackageJSON('..', __filename);
// '/path/to/project/package.json'
// 传递绝对说明符时结果相同：
findPackageJSON(pathToFileURL(path.join(__dirname, '..')));

findPackageJSON('some-package', __filename);
// '/path/to/project/packages/bar/node_modules/some-package/package.json'
// 传递绝对说明符时，如果已解析的模块位于具有嵌套 `package.json` 的子文件夹中，则可能会获得不同的结果。
findPackageJSON(pathToFileURL(require.resolve('some-package')));
// '/path/to/project/packages/bar/node_modules/some-package/some-subfolder/package.json'

findPackageJSON('@foo/qux', __filename);
// '/path/to/project/packages/qux/package.json'
```
:::


### `module.isBuiltin(moduleName)` {#moduleisbuiltinmodulename}

**Added in: v18.6.0, v16.17.0**

- `moduleName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 模块的名称
- 返回: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 如果模块是内置的，则返回 true，否则返回 false

```js [ESM]
import { isBuiltin } from 'node:module';
isBuiltin('node:fs'); // true
isBuiltin('fs'); // true
isBuiltin('wss'); // false
```
### `module.register(specifier[, parentURL][, options])` {#moduleregisterspecifier-parenturl-options}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v20.8.0, v18.19.0 | 添加了对 WHATWG URL 实例的支持。 |
| v20.6.0, v18.19.0 | Added in: v20.6.0, v18.19.0 |
:::

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).2 - 发布候选版本
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 要注册的自定义钩子；这应该与传递给 `import()` 的字符串相同，但如果它是相对的，则相对于 `parentURL` 解析。
- `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 如果要相对于基本 URL（例如 `import.meta.url`）解析 `specifier`，可以在此处传递该 URL。 **默认值:** `'data:'`
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/zh/nodejs/api/url#the-whatwg-url-api) 如果要相对于基本 URL（例如 `import.meta.url`）解析 `specifier`，可以在此处传递该 URL。 如果 `parentURL` 作为第二个参数提供，则忽略此属性。 **默认值:** `'data:'`
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 要传递到 [`initialize`](/zh/nodejs/api/module#initialize) 钩子的任何任意的、可克隆的 JavaScript 值。
    - `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 要传递到 `initialize` 钩子的[可转移对象](/zh/nodejs/api/worker_threads#portpostmessagevalue-transferlist)。

注册一个导出[钩子](/zh/nodejs/api/module#customization-hooks)的模块，该钩子自定义 Node.js 模块解析和加载行为。 参见[自定义钩子](/zh/nodejs/api/module#customization-hooks)。


### `module.registerHooks(options)` {#moduleregisterhooksoptions}

**Added in: v23.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `load` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 参见 [load hook](/zh/nodejs/api/module#loadurl-context-nextload)。 **默认值:** `undefined`。
    - `resolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 参见 [resolve hook](/zh/nodejs/api/module#resolvespecifier-context-nextresolve)。 **默认值:** `undefined`。


注册自定义 Node.js 模块解析和加载行为的 [hooks](/zh/nodejs/api/module#customization-hooks)。 参见 [自定义 hooks](/zh/nodejs/api/module#customization-hooks)。

### `module.stripTypeScriptTypes(code[, options])` {#modulestriptypescripttypescode-options}

**Added in: v23.2.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要移除类型注解的代码。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **默认值:** `'strip'`。 可能的值有：
    - `'strip'` 仅移除类型注解，而不执行 TypeScript 功能的转换。
    - `'transform'` 移除类型注解并将 TypeScript 功能转换为 JavaScript。


    - `sourceMap` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **默认值:** `false`。 仅当 `mode` 为 `'transform'` 时，如果为 `true`，则会为转换后的代码生成源映射。
    - `sourceUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 指定源映射中使用的源 URL。


- 返回值: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 移除类型注解后的代码。 `module.stripTypeScriptTypes()` 从 TypeScript 代码中移除类型注解。 它可用于在运行 `vm.runInContext()` 或 `vm.compileFunction()` 之前从 TypeScript 代码中移除类型注解。 默认情况下，如果代码包含需要转换的 TypeScript 功能（例如 `Enums`），它会抛出错误，有关更多信息，参见 [type-stripping](/zh/nodejs/api/typescript#type-stripping)。 当模式为 `'transform'` 时，它还会将 TypeScript 功能转换为 JavaScript，有关更多信息，参见 [转换 TypeScript 功能](/zh/nodejs/api/typescript#typescript-features)。 当模式为 `'strip'` 时，不会生成源映射，因为位置已保留。 如果提供了 `sourceMap`，则当模式为 `'strip'` 时，将抛出错误。

*警告*：由于 TypeScript 解析器的更改，此函数的输出在 Node.js 版本之间不应被认为是稳定的。

::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code);
console.log(strippedCode);
// Prints: const a         = 1;
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code);
console.log(strippedCode);
// Prints: const a         = 1;
```
:::

如果提供了 `sourceUrl`，它将被用作注释附加在输出的末尾：

::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code, { mode: 'strip', sourceUrl: 'source.ts' });
console.log(strippedCode);
// Prints: const a         = 1\n\n//# sourceURL=source.ts;
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code, { mode: 'strip', sourceUrl: 'source.ts' });
console.log(strippedCode);
// Prints: const a         = 1\n\n//# sourceURL=source.ts;
```
:::

当 `mode` 为 `'transform'` 时，代码将转换为 JavaScript：

::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = `
  namespace MathUtil {
    export const add = (a: number, b: number) => a + b;
  }`;
const strippedCode = stripTypeScriptTypes(code, { mode: 'transform', sourceMap: true });
console.log(strippedCode);
// Prints:
// var MathUtil;
// (function(MathUtil) {
//     MathUtil.add = (a, b)=>a + b;
// })(MathUtil || (MathUtil = {}));
// # sourceMappingURL=data:application/json;base64, ...
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = `
  namespace MathUtil {
    export const add = (a: number, b: number) => a + b;
  }`;
const strippedCode = stripTypeScriptTypes(code, { mode: 'transform', sourceMap: true });
console.log(strippedCode);
// Prints:
// var MathUtil;
// (function(MathUtil) {
//     MathUtil.add = (a, b)=>a + b;
// })(MathUtil || (MathUtil = {}));
// # sourceMappingURL=data:application/json;base64, ...
```
:::


### `module.syncBuiltinESMExports()` {#modulesyncbuiltinesmexports}

**Added in: v12.12.0**

`module.syncBuiltinESMExports()` 方法更新所有内置 [ES 模块](/zh/nodejs/api/esm) 的实时绑定，以匹配 [CommonJS](/zh/nodejs/api/modules) 导出的属性。它不会从 [ES 模块](/zh/nodejs/api/esm) 中添加或删除导出的名称。

```js [ESM]
const fs = require('node:fs');
const assert = require('node:assert');
const { syncBuiltinESMExports } = require('node:module');

fs.readFile = newAPI;

delete fs.readFileSync;

function newAPI() {
  // ...
}

fs.newAPI = newAPI;

syncBuiltinESMExports();

import('node:fs').then((esmFS) => {
  // 它使用新值同步现有的 readFile 属性
  assert.strictEqual(esmFS.readFile, newAPI);
  // readFileSync 已从所需的 fs 中删除
  assert.strictEqual('readFileSync' in fs, false);
  // syncBuiltinESMExports() 不会从 esmFS 中删除 readFileSync
  assert.strictEqual('readFileSync' in esmFS, true);
  // syncBuiltinESMExports() 不添加名称
  assert.strictEqual(esmFS.newAPI, undefined);
});
```
## 模块编译缓存 {#module-compile-cache}


::: info [历史记录]
| 版本 | 更改 |
| --- | --- |
| v22.8.0 | 添加了用于运行时访问的初始 JavaScript API。 |
| v22.1.0 | 添加于: v22.1.0 |
:::

可以使用 [`module.enableCompileCache()`](/zh/nodejs/api/module#moduleenablecompilecachecachedir) 方法或 [`NODE_COMPILE_CACHE=dir`](/zh/nodejs/api/cli#node_compile_cachedir) 环境变量来启用模块编译缓存。启用后，每当 Node.js 编译 CommonJS 或 ECMAScript 模块时，它都会使用磁盘上的 [V8 代码缓存](https://v8.dev/blog/code-caching-for-devs)，该缓存持久存储在指定目录中，以加快编译速度。这可能会减慢模块图的首次加载速度，但如果模块的内容没有更改，则后续加载同一模块图可能会获得显着的加速。

要清理磁盘上生成的编译缓存，只需删除缓存目录。下次将同一目录用于编译缓存存储时，将重新创建缓存目录。为避免陈旧缓存填满磁盘，建议使用 [`os.tmpdir()`](/zh/nodejs/api/os#ostmpdir) 下的目录。如果通过调用 [`module.enableCompileCache()`](/zh/nodejs/api/module#moduleenablecompilecachecachedir) 启用编译缓存而未指定目录，则 Node.js 将使用 [`NODE_COMPILE_CACHE=dir`](/zh/nodejs/api/cli#node_compile_cachedir) 环境变量（如果已设置），否则默认为 `path.join(os.tmpdir(), 'node-compile-cache')`。要查找正在运行的 Node.js 实例使用的编译缓存目录，请使用 [`module.getCompileCacheDir()`](/zh/nodejs/api/module#modulegetcompilecachedir)。

目前，当将编译缓存与 [V8 JavaScript 代码覆盖率](https://v8project.blogspot.com/2017/12/javascript-code-coverage) 一起使用时，V8 收集的覆盖率在从代码缓存反序列化的函数中可能不太精确。建议在运行测试以生成精确覆盖率时关闭此功能。

可以通过 [`NODE_DISABLE_COMPILE_CACHE=1`](/zh/nodejs/api/cli#node_disable_compile_cache1) 环境变量禁用已启用的模块编译缓存。当编译缓存导致意外或不需要的行为时（例如，测试覆盖率不太精确），这可能很有用。

一个 Node.js 版本生成的编译缓存不能被另一个 Node.js 版本重用。如果使用相同的基本目录来持久化缓存，则不同 Node.js 版本生成的缓存将单独存储，因此它们可以共存。

目前，当启用编译缓存并刷新模块时，代码缓存会立即从已编译的代码生成，但只有在 Node.js 实例即将退出时才会写入磁盘。这可能会发生变化。[`module.flushCompileCache()`](/zh/nodejs/api/module#moduleflushcompilecache) 方法可用于确保累积的代码缓存刷新到磁盘，以防应用程序想要生成其他 Node.js 实例，并让它们在父级退出之前很久就共享缓存。


### `module.constants.compileCacheStatus` {#moduleconstantscompilecachestatus}

**Added in: v22.8.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发
:::

以下常量作为 [`module.enableCompileCache()`](/zh/nodejs/api/module#moduleenablecompilecachecachedir) 返回的对象中的 `status` 字段返回，用于指示启用 [模块编译缓存](/zh/nodejs/api/module#module-compile-cache) 的尝试结果。

| 常量 | 描述 |
| --- | --- |
| `ENABLED` | Node.js 已成功启用编译缓存。用于存储编译缓存的目录将返回在返回对象中的 `directory` 字段中。 |
| `ALREADY_ENABLED` | 编译缓存之前已启用，可能是通过先前调用 `module.enableCompileCache()` 或通过 `NODE_COMPILE_CACHE=dir` 环境变量。用于存储编译缓存的目录将返回在返回对象中的 `directory` 字段中。 |
| `FAILED` | Node.js 无法启用编译缓存。这可能是由于缺少使用指定目录的权限或各种文件系统错误导致的。失败的详细信息将返回在返回对象中的 `message` 字段中。 |
| `DISABLED` | Node.js 无法启用编译缓存，因为已设置环境变量 `NODE_DISABLE_COMPILE_CACHE=1`。 |

### `module.enableCompileCache([cacheDir])` {#moduleenablecompilecachecachedir}

**Added in: v22.8.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发
:::

- `cacheDir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 可选路径，用于指定将存储/检索编译缓存的目录。
- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `status` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`module.constants.compileCacheStatus`](/zh/nodejs/api/module#moduleconstantscompilecachestatus) 之一
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 如果 Node.js 无法启用编译缓存，则包含错误消息。仅当 `status` 为 `module.constants.compileCacheStatus.FAILED` 时才设置。
    - `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 如果启用了编译缓存，则包含存储编译缓存的目录的路径。仅当 `status` 为 `module.constants.compileCacheStatus.ENABLED` 或 `module.constants.compileCacheStatus.ALREADY_ENABLED` 时才设置。

在当前 Node.js 实例中启用 [模块编译缓存](/zh/nodejs/api/module#module-compile-cache)。

如果未指定 `cacheDir`，则 Node.js 将使用 [`NODE_COMPILE_CACHE=dir`](/zh/nodejs/api/cli#node_compile_cachedir) 环境变量指定的目录（如果已设置），否则使用 `path.join(os.tmpdir(), 'node-compile-cache')`。对于一般用例，建议调用 `module.enableCompileCache()` 而不指定 `cacheDir`，以便在必要时可以通过 `NODE_COMPILE_CACHE` 环境变量覆盖该目录。

由于编译缓存应该是一种安静的优化，应用程序不需要它才能正常运行，因此此方法旨在在无法启用编译缓存时不会引发任何异常。相反，它将返回一个对象，其中包含 `message` 字段中的错误消息，以帮助调试。如果成功启用了编译缓存，则返回对象中的 `directory` 字段包含存储编译缓存的目录的路径。返回对象中的 `status` 字段将是 `module.constants.compileCacheStatus` 值之一，以指示启用 [模块编译缓存](/zh/nodejs/api/module#module-compile-cache) 的尝试结果。

此方法仅影响当前的 Node.js 实例。要在子工作线程中启用它，要么也在子工作线程中调用此方法，要么将 `process.env.NODE_COMPILE_CACHE` 值设置为编译缓存目录，以便该行为可以继承到子工作线程中。目录可以从此方法返回的 `directory` 字段中获取，也可以使用 [`module.getCompileCacheDir()`](/zh/nodejs/api/module#modulegetcompilecachedir) 获取。


### `module.flushCompileCache()` {#moduleflushcompilecache}

**新增于: v23.0.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发中
:::

将从当前 Node.js 实例中已加载的模块积累的 [模块编译缓存](/zh/nodejs/api/module#module-compile-cache) 刷新到磁盘。无论刷新文件系统操作是否成功，这都会在所有操作结束后返回。如果存在任何错误，这将以静默方式失败，因为编译缓存未命中不应干扰应用程序的实际操作。

### `module.getCompileCacheDir()` {#modulegetcompilecachedir}

**新增于: v22.8.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index).1 - 积极开发中
:::

- 返回: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 如果启用了 [模块编译缓存](/zh/nodejs/api/module#module-compile-cache)，则返回其目录的路径，否则返回 `undefined`。

## 自定义钩子 {#customization-hooks}


::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.5.0 | 增加对同步和线程内钩子的支持。 |
| v20.6.0, v18.19.0 | 增加了 `initialize` 钩子来替换 `globalPreload`。 |
| v18.6.0, v16.17.0 | 增加对链式加载器的支持。 |
| v16.12.0 | 移除 `getFormat`、`getSource`、`transformSource` 和 `globalPreload`；增加 `load` 钩子和 `getGlobalPreload` 钩子。 |
| v8.8.0 | 新增于: v8.8.0 |
:::

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index).2 - 发布候选版本（异步版本） 稳定度: 1.1 - 积极开发中（同步版本）
:::

目前支持两种类型的模块自定义钩子：

### 启用 {#enabling}

可以通过以下方式自定义模块解析和加载：

可以在应用程序代码运行之前使用 [`--import`](/zh/nodejs/api/cli#--importmodule) 或 [`--require`](/zh/nodejs/api/cli#-r---require-module) 标志注册钩子：

```bash [BASH]
node --import ./register-hooks.js ./my-app.js
node --require ./register-hooks.js ./my-app.js
```


::: code-group
```js [ESM]
// register-hooks.js
// 仅当此文件不包含顶层 await 时，才能使用 require() 导入它。
// 使用 module.register() 在专用线程中注册异步钩子。
import { register } from 'node:module';
register('./hooks.mjs', import.meta.url);
```

```js [CJS]
// register-hooks.js
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
// 使用 module.register() 在专用线程中注册异步钩子。
register('./hooks.mjs', pathToFileURL(__filename));
```
:::



::: code-group
```js [ESM]
// 使用 module.registerHooks() 在主线程中注册同步钩子。
import { registerHooks } from 'node:module';
registerHooks({
  resolve(specifier, context, nextResolve) { /* 实现 */ },
  load(url, context, nextLoad) { /* 实现 */ },
});
```

```js [CJS]
// 使用 module.registerHooks() 在主线程中注册同步钩子。
const { registerHooks } = require('node:module');
registerHooks({
  resolve(specifier, context, nextResolve) { /* 实现 */ },
  load(url, context, nextLoad) { /* 实现 */ },
});
```
:::

传递给 `--import` 或 `--require` 的文件也可以是依赖项的导出：

```bash [BASH]
node --import some-package/register ./my-app.js
node --require some-package/register ./my-app.js
```
其中 `some-package` 具有一个 [`"exports"`](/zh/nodejs/api/packages#exports) 字段，该字段定义了 `/register` 导出以映射到调用 `register()` 的文件，如以下 `register-hooks.js` 示例。

使用 `--import` 或 `--require` 可确保在导入任何应用程序文件之前注册钩子，包括应用程序的入口点以及默认情况下所有工作线程。

或者，可以从入口点调用 `register()` 和 `registerHooks()`，但对于应在注册钩子后运行的任何 ESM 代码，必须使用动态 `import()`。



::: code-group
```js [ESM]
import { register } from 'node:module';

register('http-to-https', import.meta.url);

// 因为这是一个动态的 `import()`，`http-to-https` 钩子将运行
// 以处理 `./my-app.js` 及其导入或 require 的任何其他文件。
await import('./my-app.js');
```

```js [CJS]
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

register('http-to-https', pathToFileURL(__filename));

// 因为这是一个动态的 `import()`，`http-to-https` 钩子将运行
// 以处理 `./my-app.js` 及其导入或 require 的任何其他文件。
import('./my-app.js');
```
:::

自定义钩子将为晚于注册加载的任何模块以及它们通过 `import` 和内置 `require` 引用的模块运行。 用户使用 `module.createRequire()` 创建的 `require` 函数只能通过同步钩子进行自定义。

在此示例中，我们正在注册 `http-to-https` 钩子，但它们仅适用于随后导入的模块 - 在这种情况下，`my-app.js` 及其通过 CommonJS 依赖项中的 `import` 或内置 `require` 引用的任何内容。

如果 `import('./my-app.js')` 而是静态的 `import './my-app.js'`，则应用程序将*已经*在注册 `http-to-https` 钩子**之前**加载。 这是由于 ES 模块规范，其中静态导入首先从树的叶子节点求值，然后返回到主干。 `my-app.js` 中可以有静态导入，在动态导入 `my-app.js` 之前不会对其进行求值。

如果使用同步钩子，则支持 `import`、`require` 和使用 `createRequire()` 创建的用户 `require`。



::: code-group
```js [ESM]
import { registerHooks, createRequire } from 'node:module';

registerHooks({ /* 同步钩子的实现 */ });

const require = createRequire(import.meta.url);

// 同步钩子会影响通过 createRequire() 创建的 import、require() 和用户 require() 函数。
await import('./my-app.js');
require('./my-app-2.js');
```

```js [CJS]
const { register, registerHooks } = require('node:module');
const { pathToFileURL } = require('node:url');

registerHooks({ /* 同步钩子的实现 */ });

const userRequire = createRequire(__filename);

// 同步钩子会影响通过 createRequire() 创建的 import、require() 和用户 require() 函数。
import('./my-app.js');
require('./my-app-2.js');
userRequire('./my-app-3.js');
```
:::

最后，如果您只想在您的应用运行之前注册钩子，并且不想为此创建一个单独的文件，您可以将 `data:` URL 传递给 `--import`：

```bash [BASH]
node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("http-to-https", pathToFileURL("./"));' ./my-app.js
```

### 链式调用 {#chaining}

可以多次调用 `register`：

::: code-group
```js [ESM]
// entrypoint.mjs
import { register } from 'node:module';

register('./foo.mjs', import.meta.url);
register('./bar.mjs', import.meta.url);
await import('./my-app.mjs');
```

```js [CJS]
// entrypoint.cjs
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

const parentURL = pathToFileURL(__filename);
register('./foo.mjs', parentURL);
register('./bar.mjs', parentURL);
import('./my-app.mjs');
```
:::

在此示例中，注册的钩子将形成链。这些链以后进先出 (LIFO) 的方式运行。 如果 `foo.mjs` 和 `bar.mjs` 都定义了一个 `resolve` 钩子，它们将被这样调用（注意从右到左）：node 的默认值 ← `./foo.mjs` ← `./bar.mjs` （从 `./bar.mjs` 开始，然后是 `./foo.mjs`，然后是 Node.js 的默认值）。 这同样适用于所有其他钩子。

注册的钩子也会影响 `register` 本身。 在此示例中，`bar.mjs` 将通过 `foo.mjs` 注册的钩子来解析和加载（因为 `foo` 的钩子已经被添加到链中）。 这允许诸如用非 JavaScript 语言编写钩子之类的事情，只要先前注册的钩子被转换为 JavaScript。

`register` 方法不能从定义钩子的模块中调用。

`registerHooks` 的链式调用工作方式类似。如果同步和异步钩子混合使用，则同步钩子始终在异步钩子开始运行之前运行，也就是说，在运行的最后一个同步钩子中，其下一个钩子包括调用异步钩子。

::: code-group
```js [ESM]
// entrypoint.mjs
import { registerHooks } from 'node:module';

const hook1 = { /* 钩子的实现 */ };
const hook2 = { /* 钩子的实现 */ };
// hook2 在 hook1 之前运行。
registerHooks(hook1);
registerHooks(hook2);
```

```js [CJS]
// entrypoint.cjs
const { registerHooks } = require('node:module');

const hook1 = { /* 钩子的实现 */ };
const hook2 = { /* 钩子的实现 */ };
// hook2 在 hook1 之前运行。
registerHooks(hook1);
registerHooks(hook2);
```
:::


### 与模块自定义钩子的通信 {#communication-with-module-customization-hooks}

异步钩子在一个专用的线程上运行，该线程与运行应用程序代码的主线程分离。这意味着改变全局变量不会影响其他线程，并且必须使用消息通道在线程之间进行通信。

`register` 方法可用于将数据传递给 [`initialize`](/zh/nodejs/api/module#initialize) 钩子。传递给钩子的数据可以包括可转移对象，如端口。

::: code-group
```js [ESM]
import { register } from 'node:module';
import { MessageChannel } from 'node:worker_threads';

// 此示例演示了如何使用消息通道
// 通过将 `port2` 发送到钩子来与钩子通信。
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  console.log(msg);
});
port1.unref();

register('./my-hooks.mjs', {
  parentURL: import.meta.url,
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```

```js [CJS]
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
const { MessageChannel } = require('node:worker_threads');

// 此示例展示了如何使用消息通道
// 通过将 `port2` 发送到钩子来与钩子通信。
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  console.log(msg);
});
port1.unref();

register('./my-hooks.mjs', {
  parentURL: pathToFileURL(__filename),
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```
:::

同步模块钩子在运行应用程序代码的同一线程上运行。 它们可以直接改变主线程访问的上下文的全局变量。

### 钩子 {#hooks}

#### `module.register()` 接受的异步钩子 {#asynchronous-hooks-accepted-by-moduleregister}

[`register`](/zh/nodejs/api/module#moduleregisterspecifier-parenturl-options) 方法可用于注册一个模块，该模块导出一组钩子。 钩子是由 Node.js 调用的函数，用于自定义模块解析和加载过程。 导出的函数必须具有特定的名称和签名，并且必须作为命名导出导出。

```js [ESM]
export async function initialize({ number, port }) {
  // 接收来自 `register` 的数据。
}

export async function resolve(specifier, context, nextResolve) {
  // 接受一个 `import` 或 `require` 说明符并将其解析为 URL。
}

export async function load(url, context, nextLoad) {
  // 接受一个解析后的 URL 并返回要计算的源代码。
}
```
异步钩子在与运行应用程序代码的主线程隔离的单独线程中运行。 这意味着它是一个不同的[领域](https://tc39.es/ecma262/#realm)。 钩子线程可以随时被主线程终止，因此不要依赖异步操作（如 `console.log`）完成。 默认情况下，它们被继承到子 worker 中。


#### `module.registerHooks()` 接受的同步钩子 {#synchronous-hooks-accepted-by-moduleregisterhooks}

**添加于: v23.5.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).1 - 活跃开发中
:::

`module.registerHooks()` 方法接受同步钩子函数。不支持也不需要 `initialize()`，因为钩子的实现者可以直接在调用 `module.registerHooks()` 之前运行初始化代码。

```js [ESM]
function resolve(specifier, context, nextResolve) {
  // 接收一个 `import` 或 `require` 标识符，并将其解析为 URL。
}

function load(url, context, nextLoad) {
  // 接收一个已解析的 URL，并返回要评估的源代码。
}
```

同步钩子在加载模块的同一线程和同一[领域](https://tc39.es/ecma262/#realm)中运行。 与异步钩子不同，默认情况下它们不会继承到子 worker 线程中，但如果使用由 [`--import`](/zh/nodejs/api/cli#--importmodule) 或 [`--require`](/zh/nodejs/api/cli#-r---require-module) 预加载的文件注册钩子，则子 worker 线程可以通过 `process.execArgv` 继承预加载的脚本。 有关详细信息，请参阅 [`Worker` 的文档](/zh/nodejs/api/worker_threads#new-workerfilename-options)。

在同步钩子中，用户可以期望 `console.log()` 完成，就像他们期望模块代码中的 `console.log()` 完成一样。

#### 钩子的约定 {#conventions-of-hooks}

钩子是[链](/zh/nodejs/api/module#chaining)的一部分，即使该链仅由一个自定义（用户提供的）钩子和始终存在的默认钩子组成。 钩子函数嵌套：每个函数都必须始终返回一个普通对象，并且链式调用是通过每个函数调用 `next\<hookName\>()` 来实现的，该函数是对后续加载器的钩子的引用（按 LIFO 顺序）。

返回缺少必需属性的值的钩子会触发异常。 未调用 `next\<hookName\>()` *且*未返回 `shortCircuit: true` 的钩子也会触发异常。 这些错误旨在帮助防止链中的意外中断。 从钩子返回 `shortCircuit: true` 以表示链有意在您的钩子处结束。


#### `initialize()` {#initialize}

**添加于: v20.6.0, v18.19.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定度: 1](/zh/nodejs/api/documentation#stability-index).2 - 候选版本
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 来自 `register(loader, import.meta.url, { data })` 的数据。

`initialize` 钩子仅被 [`register`](/zh/nodejs/api/module#moduleregisterspecifier-parenturl-options) 接受。`registerHooks()` 不支持也不需要它，因为为同步钩子完成的初始化可以直接在调用 `registerHooks()` 之前运行。

`initialize` 钩子提供了一种定义自定义函数的方法，该函数在钩子模块初始化时在钩子线程中运行。 初始化发生在通过 [`register`](/zh/nodejs/api/module#moduleregisterspecifier-parenturl-options) 注册钩子模块时。

此钩子可以接收来自 [`register`](/zh/nodejs/api/module#moduleregisterspecifier-parenturl-options) 调用的数据，包括端口和其他可传输对象。 `initialize` 的返回值可以是 [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)，在这种情况下，它将在主应用程序线程恢复执行之前被等待。

模块自定义代码：

```js [ESM]
// path-to-my-hooks.js

export async function initialize({ number, port }) {
  port.postMessage(`increment: ${number + 1}`);
}
```
调用者代码：

::: code-group
```js [ESM]
import assert from 'node:assert';
import { register } from 'node:module';
import { MessageChannel } from 'node:worker_threads';

// 此示例展示了如何使用消息通道在主（应用程序）线程和在钩子线程上运行的钩子之间进行通信，方法是将 `port2` 发送到 `initialize` 钩子。
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  assert.strictEqual(msg, 'increment: 2');
});
port1.unref();

register('./path-to-my-hooks.js', {
  parentURL: import.meta.url,
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```

```js [CJS]
const assert = require('node:assert');
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
const { MessageChannel } = require('node:worker_threads');

// 此示例展示了如何使用消息通道在主（应用程序）线程和在钩子线程上运行的钩子之间进行通信，方法是将 `port2` 发送到 `initialize` 钩子。
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  assert.strictEqual(msg, 'increment: 2');
});
port1.unref();

register('./path-to-my-hooks.js', {
  parentURL: pathToFileURL(__filename),
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```
:::


#### `resolve(specifier, context, nextResolve)` {#resolvespecifier-context-nextresolve}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.5.0 | 添加对同步和线程内钩子的支持。 |
| v21.0.0, v20.10.0, v18.19.0 | 属性 `context.importAssertions` 被替换为 `context.importAttributes`。 仍然支持使用旧名称，但会发出实验性警告。 |
| v18.6.0, v16.17.0 | 添加对链接 resolve 钩子的支持。每个钩子必须调用 `nextResolve()` 或在其返回值中包含设置为 `true` 的 `shortCircuit` 属性。 |
| v17.1.0, v16.14.0 | 添加对导入断言的支持。 |
:::

::: warning [稳定: 1 - 实验性]
[稳定: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).2 - 发布候选版本（异步版本） 稳定性: 1.1 - 积极开发中（同步版本）
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `conditions` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 相关 `package.json` 的导出条件
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 键值对表示要导入的模块的属性的对象
    - `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 导入此模块的模块，如果这是 Node.js 的入口点，则为 undefined

- `nextResolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 链中的后续 `resolve` 钩子，或者在最后一个用户提供的 `resolve` 钩子之后，Node.js 的默认 `resolve` 钩子
    - `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 异步版本采用包含以下属性的对象，或者将解析为该对象的 `Promise`。 同步版本仅接受同步返回的对象。
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 加载钩子的提示（可能会被忽略）`'builtin' | 'commonjs' | 'json' | 'module' | 'wasm'`
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 用于在缓存模块时使用的导入属性（可选；如果排除，将使用输入）
    - `shortCircuit` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 表示此钩子打算终止 `resolve` 钩子链的信号。 **默认值:** `false`
    - `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 此输入解析到的绝对 URL

`resolve` 钩子链负责告诉 Node.js 在哪里找到以及如何缓存给定的 `import` 语句或表达式，或者 `require` 调用。 它可以选择返回一个格式（例如 `'module'`）作为 `load` 钩子的提示。 如果指定了格式，则 `load` 钩子最终负责提供最终的 `format` 值（并且可以自由地忽略 `resolve` 提供的提示）； 如果 `resolve` 提供 `format`，则需要自定义 `load` 钩子，即使只是将该值传递给 Node.js 的默认 `load` 钩子。

导入类型属性是用于将加载的模块保存到内部模块缓存中的缓存键的一部分。 如果模块应使用与源代码中存在的属性不同的属性进行缓存，则 `resolve` 钩子负责返回一个 `importAttributes` 对象。

`context` 中的 `conditions` 属性是一个条件数组，将用于匹配此解析请求的 [package exports conditions](/zh/nodejs/api/packages#conditional-exports)。 它们可用于在其他地方查找条件映射或在调用默认解析逻辑时修改列表。

当前的 [package exports conditions](/zh/nodejs/api/packages#conditional-exports) 始终位于传递到钩子的 `context.conditions` 数组中。 为了保证在调用 `defaultResolve` 时 *默认的 Node.js 模块标识符解析行为*，传递给它的 `context.conditions` 数组*必须*包含最初传递给 `resolve` 钩子的 `context.conditions` 数组的*所有*元素。

```js [ESM]
// module.register() 接受的异步版本。
export async function resolve(specifier, context, nextResolve) {
  const { parentURL = null } = context;

  if (Math.random() > 0.5) { // 一些条件。
    // 对于某些或所有标识符，执行一些自定义逻辑以进行解析。
    // 始终返回 {url: <string>} 形式的对象。
    return {
      shortCircuit: true,
      url: parentURL ?
        new URL(specifier, parentURL).href :
        new URL(specifier).href,
    };
  }

  if (Math.random() < 0.5) { // 另一个条件。
    // 当调用 `defaultResolve` 时，可以修改参数。 在这种情况下，
    // 它添加了另一个用于匹配条件导出的值。
    return nextResolve(specifier, {
      ...context,
      conditions: [...context.conditions, 'another-condition'],
    });
  }

  // 推迟到链中的下一个钩子，如果这是最后一个用户指定的加载器，
  // 它将是 Node.js 的默认解析。
  return nextResolve(specifier);
}
```
```js [ESM]
// module.registerHooks() 接受的同步版本。
function resolve(specifier, context, nextResolve) {
  // 与上面的异步 resolve() 类似，因为它没有任何异步逻辑。
}
```

#### `load(url, context, nextLoad)` {#loadurl-context-nextload}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v23.5.0 | 增加了对同步和线程内版本的支持。 |
| v20.6.0 | 增加了对 `source` 格式为 `commonjs` 的支持。 |
| v18.6.0, v16.17.0 | 增加了对链接 load 钩子的支持。 每个钩子必须调用 `nextLoad()` 或在其返回值中包含一个设置为 `true` 的 `shortCircuit` 属性。 |
:::

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).2 - 发布候选版本 (异步版本) 稳定性: 1.1 - 积极开发 (同步版本)
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `resolve` 链返回的 URL
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `conditions` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 相关 `package.json` 的导出条件
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 由 `resolve` 钩子链可选提供的格式
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)


- `nextLoad` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 链中的后续 `load` 钩子，或者在最后一个用户提供的 `load` 钩子之后的 Node.js 默认 `load` 钩子
    - `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)


- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 异步版本接受包含以下属性的对象，或者将解析为此类对象的 `Promise`。 同步版本仅接受同步返回的对象。
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `shortCircuit` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 表示此钩子打算终止 `load` 钩子链的信号。 **默认值:** `false`
    - `source` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) Node.js 要评估的源代码


`load` 钩子提供了一种定义自定义方法的方式，该方法用于确定如何解释、检索和解析 URL。 它还负责验证导入属性。

`format` 的最终值必须是以下之一：

| `format` | 描述 | `load` 返回的 `source` 的可接受类型 |
| --- | --- | --- |
| `'builtin'` | 加载 Node.js 内置模块 | 不适用 |
| `'commonjs'` | 加载 Node.js CommonJS 模块 | { [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), `null`, `undefined` } |
| `'json'` | 加载 JSON 文件 | { [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
| `'module'` | 加载 ES 模块 | { [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
| `'wasm'` | 加载 WebAssembly 模块 | { [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
对于 `'builtin'` 类型，`source` 的值将被忽略，因为目前无法替换 Node.js 内置（核心）模块的值。


##### 异步 `load` 钩子的注意事项 {#caveat-in-the-asynchronous-load-hook}

当使用异步 `load` 钩子时，省略 `source` 或为 `'commonjs'` 提供 `source` 会产生非常不同的影响：

- 当提供 `source` 时，来自此模块的所有 `require` 调用都将由 ESM 加载器使用已注册的 `resolve` 和 `load` 钩子处理；来自此模块的所有 `require.resolve` 调用都将由 ESM 加载器使用已注册的 `resolve` 钩子处理；只有 CommonJS API 的一个子集可用（例如，没有 `require.extensions`，没有 `require.cache`，没有 `require.resolve.paths`），并且对 CommonJS 模块加载器的 monkey-patching 将不适用。
- 如果 `source` 是未定义或 `null`，它将由 CommonJS 模块加载器处理，并且 `require`/`require.resolve` 调用将不会通过已注册的钩子。 `source` 为 nullish 的这种行为是暂时的——将来将不支持 nullish `source`。

这些注意事项不适用于同步 `load` 钩子，在这种情况下，定制的 CommonJS 模块可以使用完整的 CommonJS API 集，并且 `require`/`require.resolve` 始终通过已注册的钩子。

Node.js 内部异步 `load` 实现是 `load` 链中最后一个钩子的 `next` 值，当 `format` 为 `'commonjs'` 时，为了向后兼容，它返回 `null` 作为 `source`。 这是一个选择使用非默认行为的钩子示例：

```js [ESM]
import { readFile } from 'node:fs/promises';

// module.register() 接受的异步版本。 同步版本不需要此修复，
// module.registerSync() 接受同步版本。
export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (result.format === 'commonjs') {
    result.source ??= await readFile(new URL(result.responseURL ?? url));
  }
  return result;
}
```
这也不适用于同步 `load` 钩子，在这种情况下，无论模块格式如何，返回的 `source` 都包含下一个钩子加载的源代码。

- 特定的 [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 对象是一个 [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)。
- 特定的 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 对象是一个 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)。

如果基于文本的格式（即 `'json'`，`'module'`）的源值不是字符串，则使用 [`util.TextDecoder`](/zh/nodejs/api/util#class-utiltextdecoder) 将其转换为字符串。

`load` 钩子提供了一种定义自定义方法来检索已解析 URL 的源代码的方法。 这将允许加载器可能避免从磁盘读取文件。 它也可以用于将无法识别的格式映射到支持的格式，例如 `yaml` 到 `module`。

```js [ESM]
// module.register() 接受的异步版本。
export async function load(url, context, nextLoad) {
  const { format } = context;

  if (Math.random() > 0.5) { // 某些条件
    /*
      对于某些或所有 URL，执行一些自定义逻辑来检索源。
      始终返回以下形式的对象：
      {
        format: <string>,
        source: <string|buffer>,
      }.
    */
    return {
      format,
      shortCircuit: true,
      source: '...',
    };
  }

  // 延迟到链中的下一个钩子。
  return nextLoad(url);
}
```
```js [ESM]
// module.registerHooks() 接受的同步版本。
function load(url, context, nextLoad) {
  // 与上面的异步 load() 类似，因为该函数没有任何异步逻辑。
}
```
在更高级的场景中，这也可以用于将不支持的源转换为受支持的源（请参阅下面的[示例](/zh/nodejs/api/module#examples)）。


### 示例 {#examples}

各种模块自定义钩子可以一起使用，以实现对 Node.js 代码加载和评估行为的广泛自定义。

#### 从 HTTPS 导入 {#import-from-https}

下面的钩子注册了一些钩子，以实现对此类说明符的基本支持。虽然这看起来像是对 Node.js 核心功能的重大改进，但实际使用这些钩子存在很大的缺点：性能比从磁盘加载文件慢得多，没有缓存，也没有安全性。

```js [ESM]
// https-hooks.mjs
import { get } from 'node:https';

export function load(url, context, nextLoad) {
  // 对于要通过网络加载的 JavaScript，我们需要获取并
  // 返回它。
  if (url.startsWith('https://')) {
    return new Promise((resolve, reject) => {
      get(url, (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({
          // 此示例假定所有网络提供的 JavaScript 都是 ES 模块
          // 代码。
          format: 'module',
          shortCircuit: true,
          source: data,
        }));
      }).on('error', (err) => reject(err));
    });
  }

  // 让 Node.js 处理所有其他 URL。
  return nextLoad(url);
}
```
```js [ESM]
// main.mjs
import { VERSION } from 'https://coffeescript.org/browser-compiler-modern/coffeescript.js';

console.log(VERSION);
```
使用前面的钩子模块，运行 `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./https-hooks.mjs"));' ./main.mjs` 会根据 `main.mjs` 中 URL 的模块打印 CoffeeScript 的当前版本。

#### 转译 {#transpilation}

Node.js 不理解的格式的源可以使用 [`load` 钩子](/zh/nodejs/api/module#loadurl-context-nextload) 转换为 JavaScript。

这比在运行 Node.js 之前转译源文件性能要差；转译器钩子应仅用于开发和测试目的。


##### 异步版本 {#asynchronous-version}

```js [ESM]
// coffeescript-hooks.mjs
import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve as resolvePath } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import coffeescript from 'coffeescript';

const extensionsRegex = /\.(coffee|litcoffee|coffee\.md)$/;

export async function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    // CoffeeScript 文件可以是 CommonJS 或 ES 模块，因此我们希望任何
    // CoffeeScript 文件被 Node.js 以与相同位置的 .js 文件相同的方式处理。
    // 要确定 Node.js 如何解释任意的 .js 文件，请向上搜索文件系统，找到最近的父 package.json 文件
    // 并读取其 "type" 字段。
    const format = await getPackageType(url);

    const { source: rawSource } = await nextLoad(url, { ...context, format });
    // 此钩子将 CoffeeScript 源代码转换为 JavaScript 源代码
    // 用于所有导入的 CoffeeScript 文件。
    const transformedSource = coffeescript.compile(rawSource.toString(), url);

    return {
      format,
      shortCircuit: true,
      source: transformedSource,
    };
  }

  // 让 Node.js 处理所有其他 URL。
  return nextLoad(url);
}

async function getPackageType(url) {
  // `url` 仅在第一次迭代时是从 load() 钩子传递解析后的 url 的文件路径
  // load() 传来的实际文件路径将包含文件扩展名，这是规范要求的
  // 这个简单的真值检查用于确定 `url` 是否包含文件扩展名，适用于大多数项目，但不包括某些边缘情况
  // （例如无扩展名文件或以尾随空格结尾的 url）
  const isFilePath = !!extname(url);
  // 如果是文件路径，则获取它所在的目录
  const dir = isFilePath ?
    dirname(fileURLToPath(url)) :
    url;
  // 组合一个指向同一目录中 package.json 的文件路径，
  // 该文件可能存在也可能不存在
  const packagePath = resolvePath(dir, 'package.json');
  // 尝试读取可能不存在的 package.json
  const type = await readFile(packagePath, { encoding: 'utf8' })
    .then((filestring) => JSON.parse(filestring).type)
    .catch((err) => {
      if (err?.code !== 'ENOENT') console.error(err);
    });
  // 如果 package.json 存在并且包含带有值的 `type` 字段，那么就成功了
  if (type) return type;
  // 否则，（如果不在根目录）继续检查上一级目录
  // 如果在根目录，则停止并返回 false
  return dir.length > 1 && getPackageType(resolvePath(dir, '..'));
}
```

##### 同步版本 {#synchronous-version}

```js [ESM]
// coffeescript-sync-hooks.mjs
import { readFileSync } from 'node:fs/promises';
import { registerHooks } from 'node:module';
import { dirname, extname, resolve as resolvePath } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import coffeescript from 'coffeescript';

const extensionsRegex = /\.(coffee|litcoffee|coffee\.md)$/;

function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    const format = getPackageType(url);

    const { source: rawSource } = nextLoad(url, { ...context, format });
    const transformedSource = coffeescript.compile(rawSource.toString(), url);

    return {
      format,
      shortCircuit: true,
      source: transformedSource,
    };
  }

  return nextLoad(url);
}

function getPackageType(url) {
  const isFilePath = !!extname(url);
  const dir = isFilePath ? dirname(fileURLToPath(url)) : url;
  const packagePath = resolvePath(dir, 'package.json');

  let type;
  try {
    const filestring = readFileSync(packagePath, { encoding: 'utf8' });
    type = JSON.parse(filestring).type;
  } catch (err) {
    if (err?.code !== 'ENOENT') console.error(err);
  }
  if (type) return type;
  return dir.length > 1 && getPackageType(resolvePath(dir, '..'));
}

registerHooks({ load });
```
#### 运行钩子 {#running-hooks}

```coffee [COFFEESCRIPT]
# main.coffee {#maincoffee}
import { scream } from './scream.coffee'
console.log scream 'hello, world'

import { version } from 'node:process'
console.log "Brought to you by Node.js version #{version}"
```
```coffee [COFFEESCRIPT]
# scream.coffee {#screamcoffee}
export scream = (str) -> str.toUpperCase()
```
有了前面的钩子模块，运行 `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./coffeescript-hooks.mjs"));' ./main.coffee` 或 `node --import ./coffeescript-sync-hooks.mjs ./main.coffee` 会导致 `main.coffee` 在其源代码从磁盘加载后但在 Node.js 执行它之前被转换为 JavaScript；对于通过任何已加载文件的 `import` 语句引用的任何 `.coffee`、`.litcoffee` 或 `.coffee.md` 文件也是如此。


#### 导入映射 {#import-maps}

之前的两个例子定义了 `load` 钩子。这是一个 `resolve` 钩子的例子。这个钩子模块读取一个 `import-map.json` 文件，该文件定义了要覆盖到其他 URL 的说明符 (这是一个非常简单的实现，只是 "导入映射" 规范的一个小小的子集)。

##### 异步版本 {#asynchronous-version_1}

```js [ESM]
// import-map-hooks.js
import fs from 'node:fs/promises';

const { imports } = JSON.parse(await fs.readFile('import-map.json'));

export async function resolve(specifier, context, nextResolve) {
  if (Object.hasOwn(imports, specifier)) {
    return nextResolve(imports[specifier], context);
  }

  return nextResolve(specifier, context);
}
```
##### 同步版本 {#synchronous-version_1}

```js [ESM]
// import-map-sync-hooks.js
import fs from 'node:fs/promises';
import module from 'node:module';

const { imports } = JSON.parse(fs.readFileSync('import-map.json', 'utf-8'));

function resolve(specifier, context, nextResolve) {
  if (Object.hasOwn(imports, specifier)) {
    return nextResolve(imports[specifier], context);
  }

  return nextResolve(specifier, context);
}

module.registerHooks({ resolve });
```
##### 使用钩子 {#using-the-hooks}

使用这些文件:

```js [ESM]
// main.js
import 'a-module';
```
```json [JSON]
// import-map.json
{
  "imports": {
    "a-module": "./some-module.js"
  }
}
```
```js [ESM]
// some-module.js
console.log('some module!');
```
运行 `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./import-map-hooks.js"));' main.js` 或 `node --import ./import-map-sync-hooks.js main.js` 应该打印 `some module!`。

## Source map v3 支持 {#source-map-v3-support}

**添加于: v13.7.0, v12.17.0**

::: warning [稳定度: 1 - 实验]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index) - 实验
:::

用于与源映射缓存交互的助手函数。 当启用源映射解析并在模块的页脚中找到 [源映射包含指令](https://sourcemaps.info/spec#h.lmz475t4mvbx) 时，将填充此缓存。

要启用源映射解析，必须使用标志 [`--enable-source-maps`](/zh/nodejs/api/cli#--enable-source-maps) 或通过设置 [`NODE_V8_COVERAGE=dir`](/zh/nodejs/api/cli#node_v8_coveragedir) 启用代码覆盖率来运行 Node.js。



::: code-group
```js [ESM]
// module.mjs
// 在 ECMAScript 模块中
import { findSourceMap, SourceMap } from 'node:module';
```

```js [CJS]
// module.cjs
// 在 CommonJS 模块中
const { findSourceMap, SourceMap } = require('node:module');
```
:::


### `module.findSourceMap(path)` {#modulefindsourcemappath}

**新增于: v13.7.0, v12.17.0**

- `path` [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type)
- 返回: [\<module.SourceMap\>](/zh/nodejs/api/module#class-modulesourcemap) | [\<undefined\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Undefined_type) 如果找到源映射则返回 `module.SourceMap`，否则返回 `undefined`。

`path` 是应该从中获取相应源映射文件的已解析路径。

### 类: `module.SourceMap` {#class-modulesourcemap}

**新增于: v13.7.0, v12.17.0**

#### `new SourceMap(payload[, { lineLengths }])` {#new-sourcemappayload-{-linelengths-}}

- `payload` [\<Object\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `lineLengths` [\<number[]\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Number_type)

创建一个新的 `sourceMap` 实例。

`payload` 是一个对象，其键与 [Source map v3 格式](https://sourcemaps.info/spec#h.mofvlxcwqzej) 匹配：

- `file`: [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type)
- `version`: [\<number\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Number_type)
- `sources`: [\<string[]\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type)
- `sourcesContent`: [\<string[]\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type)
- `names`: [\<string[]\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type)
- `mappings`: [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type)
- `sourceRoot`: [\<string\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#String_type)

`lineLengths` 是一个可选的数组，包含生成代码中每一行的长度。

#### `sourceMap.payload` {#sourcemappayload}

- 返回: [\<Object\>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)

用于构造 [`SourceMap`](/zh/nodejs/api/module#class-modulesourcemap) 实例的有效负载的 Getter。


#### `sourceMap.findEntry(lineOffset, columnOffset)` {#sourcemapfindentrylineoffset-columnoffset}

- `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 生成源文件中从零开始的行号偏移量
- `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 生成源文件中从零开始的列号偏移量
- 返回: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

给定生成源文件中的行偏移量和列偏移量，如果找到，则返回一个表示原始文件中 SourceMap 范围的对象，如果未找到，则返回一个空对象。

返回的对象包含以下键：

- generatedLine: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 生成源中范围起点的行偏移量
- generatedColumn: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 生成源中范围起点的列偏移量
- originalSource: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 原始源文件的文件名，如 SourceMap 中报告的那样
- originalLine: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 原始源中范围起点的行偏移量
- originalColumn: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 原始源中范围起点的列偏移量
- name: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返回值表示 SourceMap 中出现的原始范围，基于从零开始的偏移量，*不是* 1 索引的行号和列号，如 Error 消息和 CallSite 对象中出现的那样。

要从 Error 堆栈和 CallSite 对象报告的 lineNumber 和 columnNumber 获取相应的 1 索引的行号和列号，请使用 `sourceMap.findOrigin(lineNumber, columnNumber)`


#### `sourceMap.findOrigin(lineNumber, columnNumber)` {#sourcemapfindoriginlinenumber-columnnumber}

- `lineNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 生成源码中调用点的从 1 开始的行号
- `columnNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 生成源码中调用点的从 1 开始的列号
- 返回值: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

给定生成源码中调用点的从 1 开始的 `lineNumber` 和 `columnNumber`，找到原始源码中对应的调用点位置。

如果在任何源码映射中都找不到提供的 `lineNumber` 和 `columnNumber`，则返回一个空对象。否则，返回的对象包含以下键：

- name: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 源码映射中范围的名称（如果提供了名称）
- fileName: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 原始源码的文件名，如 SourceMap 中所报告的
- lineNumber: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 原始源码中相应调用点的从 1 开始的行号
- columnNumber: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 原始源码中相应调用点的从 1 开始的列号

