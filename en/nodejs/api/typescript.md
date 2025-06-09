---
title: TypeScript Support in Node.js
description: Learn how to use TypeScript with Node.js, including installation, configuration, and best practices for integrating TypeScript into your Node.js projects.
head:
  - - meta
    - name: og:title
      content: TypeScript Support in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Learn how to use TypeScript with Node.js, including installation, configuration, and best practices for integrating TypeScript into your Node.js projects.
  - - meta
    - name: twitter:title
      content: TypeScript Support in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Learn how to use TypeScript with Node.js, including installation, configuration, and best practices for integrating TypeScript into your Node.js projects.
---

# Modules: TypeScript {#modules-typescript}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.6.0 | Type stripping is enabled by default. |
| v22.7.0 | Added `--experimental-transform-types` flag. |
:::

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index).1 - Active development
:::

## Enabling {#enabling}

There are two ways to enable runtime TypeScript support in Node.js:

## Full TypeScript support {#full-typescript-support}

To use TypeScript with full support for all TypeScript features, including `tsconfig.json`, you can use a third-party package. These instructions use [`tsx`](https://tsx.is/) as an example but there are many other similar libraries available.

## Type stripping {#type-stripping}

**Added in: v22.6.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index).1 - Active development
:::

By default Node.js will execute TypeScript files that contains only erasable TypeScript syntax. Node.js will replace TypeScript syntax with whitespace, and no type checking is performed. To enable the transformation of non erasable TypeScript syntax, which requires JavaScript code generation, such as `enum` declarations, parameter properties use the flag [`--experimental-transform-types`](/nodejs/api/cli#--experimental-transform-types). To disable this feature, use the flag [`--no-experimental-strip-types`](/nodejs/api/cli#--no-experimental-strip-types).

Node.js ignores `tsconfig.json` files and therefore features that depend on settings within `tsconfig.json`, such as paths or converting newer JavaScript syntax to older standards, are intentionally unsupported. To get full TypeScript support, see [Full TypeScript support](/nodejs/api/typescript#full-typescript-support).

The type stripping feature is designed to be lightweight. By intentionally not supporting syntaxes that require JavaScript code generation, and by replacing inline types with whitespace, Node.js can run TypeScript code without the need for source maps.

Type stripping is compatible with most versions of TypeScript but we recommend version 5.7 or newer with the following `tsconfig.json` settings:

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
### Determining module system {#determining-module-system}

Node.js supports both [CommonJS](/nodejs/api/modules) and [ES Modules](/nodejs/api/esm) syntax in TypeScript files. Node.js will not convert from one module system to another; if you want your code to run as an ES module, you must use `import` and `export` syntax, and if you want your code to run as CommonJS you must use `require` and `module.exports`.

- `.ts` files will have their module system determined [the same way as `.js` files.](/nodejs/api/packages#determining-module-system) To use `import` and `export` syntax, add `"type": "module"` to the nearest parent `package.json`.
- `.mts` files will always be run as ES modules, similar to `.mjs` files.
- `.cts` files will always be run as CommonJS modules, similar to `.cjs` files.
- `.tsx` files are unsupported.

As in JavaScript files, [file extensions are mandatory](/nodejs/api/esm#mandatory-file-extensions) in `import` statements and `import()` expressions: `import './file.ts'`, not `import './file'`. Because of backward compatibility, file extensions are also mandatory in `require()` calls: `require('./file.ts')`, not `require('./file')`, similar to how the `.cjs` extension is mandatory in `require` calls in CommonJS files.

The `tsconfig.json` option `allowImportingTsExtensions` will allow the TypeScript compiler `tsc` to type-check files with `import` specifiers that include the `.ts` extension.

### TypeScript features {#typescript-features}

Since Node.js is only removing inline types, any TypeScript features that involve *replacing* TypeScript syntax with new JavaScript syntax will error, unless the flag [`--experimental-transform-types`](/nodejs/api/cli#--experimental-transform-types) is passed.

The most prominent features that require transformation are:

- `Enum` declarations
- `namespace` with runtime code
- legacy `module` with runtime code
- parameter properties
- import aliases

`namespaces` and `module` that do not contain runtime code are supported. This example will work correctly:

```ts [TYPESCRIPT]
// This namespace is exporting a type
namespace TypeOnly {
   export type A = string;
}
```
This will result in [`ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`](/nodejs/api/errors#err_unsupported_typescript_syntax) error:

```ts [TYPESCRIPT]
// This namespace is exporting a value
namespace A {
   export let x = 1
}
```
Since Decorators are currently a [TC39 Stage 3 proposal](https://github.com/tc39/proposal-decorators) and will soon be supported by the JavaScript engine, they are not transformed and will result in a parser error. This is a temporary limitation and will be resolved in the future.

In addition, Node.js does not read `tsconfig.json` files and does not support features that depend on settings within `tsconfig.json`, such as paths or converting newer JavaScript syntax into older standards.

### Importing types without `type` keyword {#importing-types-without-type-keyword}

Due to the nature of type stripping, the `type` keyword is necessary to correctly strip type imports. Without the `type` keyword, Node.js will treat the import as a value import, which will result in a runtime error. The tsconfig option [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax) can be used to match this behavior.

This example will work correctly:

```ts [TYPESCRIPT]
import type { Type1, Type2 } from './module.ts';
import { fn, type FnParams } from './fn.ts';
```
This will result in a runtime error:

```ts [TYPESCRIPT]
import { Type1, Type2 } from './module.ts';
import { fn, FnParams } from './fn.ts';
```
### Non-file forms of input {#non-file-forms-of-input}

Type stripping can be enabled for `--eval` and STDIN. The module system will be determined by `--input-type`, as it is for JavaScript.

TypeScript syntax is unsupported in the REPL, `--check`, and `inspect`.

### Source maps {#source-maps}

Since inline types are replaced by whitespace, source maps are unnecessary for correct line numbers in stack traces; and Node.js does not generate them. When [`--experimental-transform-types`](/nodejs/api/cli#--experimental-transform-types) is enabled, source-maps are enabled by default.

### Type stripping in dependencies {#type-stripping-in-dependencies}

To discourage package authors from publishing packages written in TypeScript, Node.js will by default refuse to handle TypeScript files inside folders under a `node_modules` path.

### Paths aliases {#paths-aliases}

[`tsconfig` "paths"](https://www.typescriptlang.org/tsconfig/#paths) won't be transformed and therefore produce an error. The closest feature available is [subpath imports](/nodejs/api/packages#subpath-imports) with the limitation that they need to start with `#`.

