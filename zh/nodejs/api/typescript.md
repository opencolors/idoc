---
title: Node.js 中的 TypeScript 支持
description: 了解如何在 Node.js 中使用 TypeScript，包括安装、配置以及将 TypeScript 集成到 Node.js 项目中的最佳实践。
head:
  - - meta
    - name: og:title
      content: Node.js 中的 TypeScript 支持 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 了解如何在 Node.js 中使用 TypeScript，包括安装、配置以及将 TypeScript 集成到 Node.js 项目中的最佳实践。
  - - meta
    - name: twitter:title
      content: Node.js 中的 TypeScript 支持 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 了解如何在 Node.js 中使用 TypeScript，包括安装、配置以及将 TypeScript 集成到 Node.js 项目中的最佳实践。
---


# 模块：TypeScript {#modules-typescript}

::: info [历史]
| 版本 | 变更 |
| --- | --- |
| v22.7.0 | 添加了 `--experimental-transform-types` 标志。 |
:::

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).1 - 活跃开发
:::

## 启用 {#enabling}

有两种方法可以在 Node.js 中启用运行时 TypeScript 支持：

## 完整的 TypeScript 支持 {#full-typescript-support}

要使用 TypeScript 并完全支持所有 TypeScript 功能，包括 `tsconfig.json`，您可以使用第三方包。 以下说明以 [`tsx`](https://tsx.is/) 为例，但还有许多其他类似的库可用。

## 类型剥离 {#type-stripping}

**添加于: v22.6.0**

::: warning [稳定度: 1 - 实验性]
[稳定度: 1](/zh/nodejs/api/documentation#stability-index) [稳定性: 1](/zh/nodejs/api/documentation#stability-index).1 - 活跃开发
:::

标志 [`--experimental-strip-types`](/zh/nodejs/api/cli#--experimental-strip-types) 允许 Node.js 运行 TypeScript 文件。 默认情况下，Node.js 将仅执行不包含需要转换的 TypeScript 功能（例如枚举或命名空间）的文件。 Node.js 会将内联类型注解替换为空格，并且不执行类型检查。 要启用此类功能的转换，请使用标志 [`--experimental-transform-types`](/zh/nodejs/api/cli#--experimental-transform-types)。 依赖于 `tsconfig.json` 中设置的 TypeScript 功能（例如路径或将较新的 JavaScript 语法转换为较旧的标准）是不支持的。 要获得完整的 TypeScript 支持，请参阅 [完整的 TypeScript 支持](/zh/nodejs/api/typescript#full-typescript-support)。

类型剥离功能旨在轻量化。 通过故意不支持需要 JavaScript 代码生成器语法，并通过将内联类型替换为空格，Node.js 可以在不需要 source map 的情况下运行 TypeScript 代码。

类型剥离适用于大多数 TypeScript 版本，但我们建议使用 5.7 或更高版本，并具有以下 `tsconfig.json` 设置：

```json [JSON]
{
  "compilerOptions": {
     "target": "esnext",
     "module": "nodenext",
     "allowImportingTsExtensions": true,
     "rewriteRelativeImportExtensions": true,
     "verbatimModuleSyntax": true
  }
}
```

### 确定模块系统 {#determining-module-system}

Node.js 在 TypeScript 文件中同时支持 [CommonJS](/zh/nodejs/api/modules) 和 [ES Modules](/zh/nodejs/api/esm) 语法。 Node.js 不会从一个模块系统转换为另一个模块系统； 如果您希望您的代码作为 ES 模块运行，则必须使用 `import` 和 `export` 语法，如果您希望您的代码作为 CommonJS 运行，则必须使用 `require` 和 `module.exports`。

- `.ts` 文件的模块系统将以[与 `.js` 文件相同的方式确定。](/zh/nodejs/api/packages#determining-module-system) 要使用 `import` 和 `export` 语法，请将 `"type": "module"` 添加到最近的父 `package.json` 文件中。
- `.mts` 文件将始终作为 ES 模块运行，类似于 `.mjs` 文件。
- `.cts` 文件将始终作为 CommonJS 模块运行，类似于 `.cjs` 文件。
- 不支持 `.tsx` 文件。

与 JavaScript 文件一样，`import` 语句和 `import()` 表达式中[文件扩展名是强制性的](/zh/nodejs/api/esm#mandatory-file-extensions)：`import './file.ts'`，而不是 `import './file'`。 由于向后兼容性，`require()` 调用中文件扩展名也是强制性的：`require('./file.ts')`，而不是 `require('./file')`，类似于 `.cjs` 扩展名在 CommonJS 文件中的 `require` 调用中是强制性的。

`tsconfig.json` 选项 `allowImportingTsExtensions` 将允许 TypeScript 编译器 `tsc` 对具有包含 `.ts` 扩展名的 `import` 说明符的文件进行类型检查。

### TypeScript 功能 {#typescript-features}

由于 Node.js 仅删除内联类型，因此任何涉及*替换* TypeScript 语法为新的 JavaScript 语法的 TypeScript 功能都会出错，除非传递标志 [`--experimental-transform-types`](/zh/nodejs/api/cli#--experimental-transform-types)。

最突出的需要转换的功能是：

- `Enum`
- `namespaces`
- `legacy module`
- parameter properties

由于装饰器目前是一个 [TC39 Stage 3 提案](https://github.com/tc39/proposal-decorators) 并且很快将被 JavaScript 引擎支持，因此它们不会被转换，并且会导致解析器错误。 这是一个临时的限制，将来会被解决。

此外，Node.js 不读取 `tsconfig.json` 文件，也不支持依赖于 `tsconfig.json` 中设置的功能，例如路径或将较新的 JavaScript 语法转换为较旧的标准。


### 不使用 `type` 关键字导入类型 {#importing-types-without-type-keyword}

由于类型删除的特性，`type` 关键字对于正确删除类型导入是必要的。如果没有 `type` 关键字，Node.js 会将导入视为值导入，这将导致运行时错误。tsconfig 选项 [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax) 可以用于匹配此行为。

这个例子可以正常工作：

```ts [TYPESCRIPT]
import type { Type1, Type2 } from './module.ts';
import { fn, type FnParams } from './fn.ts';
```
这会导致运行时错误：

```ts [TYPESCRIPT]
import { Type1, Type2 } from './module.ts';
import { fn, FnParams } from './fn.ts';
```
### 非文件形式的输入 {#non-file-forms-of-input}

类型删除可以为 `--eval` 启用。模块系统将由 `--input-type` 确定，就像 JavaScript 一样。

TypeScript 语法在 REPL、STDIN 输入、`--print`、`--check` 和 `inspect` 中不受支持。

### 源码映射 {#source-maps}

由于内联类型被空格替换，因此源码映射对于堆栈跟踪中的正确行号是不必要的；并且 Node.js 不会生成它们。当启用 [`--experimental-transform-types`](/zh/nodejs/api/cli#--experimental-transform-types) 时，默认情况下会启用源码映射。

### 依赖项中的类型删除 {#type-stripping-in-dependencies}

为了阻止包作者发布用 TypeScript 编写的包，Node.js 默认情况下会拒绝处理 `node_modules` 路径下文件夹中的 TypeScript 文件。

### 路径别名 {#paths-aliases}

[`tsconfig` "paths"](https://www.typescriptlang.org/tsconfig/#paths) 不会被转换，因此会产生错误。可用的最接近的特性是 [子路径导入](/zh/nodejs/api/packages#subpath-imports)，但限制是它们需要以 `#` 开头。

