---
title: ECMAScript Modules in Node.js
description: This page provides detailed documentation on how to use ECMAScript Modules (ESM) in Node.js, including module resolution, import and export syntax, and compatibility with CommonJS.
head:
  - - meta
    - name: og:title
      content: ECMAScript Modules in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: This page provides detailed documentation on how to use ECMAScript Modules (ESM) in Node.js, including module resolution, import and export syntax, and compatibility with CommonJS.
  - - meta
    - name: twitter:title
      content: ECMAScript Modules in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: This page provides detailed documentation on how to use ECMAScript Modules (ESM) in Node.js, including module resolution, import and export syntax, and compatibility with CommonJS.
---

# Modules: ECMAScript modules {#modules-ecmascript-modules}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.1.0 | Import attributes are no longer experimental. |
| v22.0.0 | Drop support for import assertions. |
| v21.0.0, v20.10.0, v18.20.0 | Add experimental support for import attributes. |
| v20.0.0, v18.19.0 | Module customization hooks are executed off the main thread. |
| v18.6.0, v16.17.0 | Add support for chaining module customization hooks. |
| v17.1.0, v16.14.0 | Add experimental support for import assertions. |
| v17.0.0, v16.12.0 | Consolidate customization hooks, removed `getFormat`, `getSource`, `transformSource`, and `getGlobalPreloadCode` hooks added `load` and `globalPreload` hooks allowed returning `format` from either `resolve` or `load` hooks. |
| v14.8.0 | Unflag Top-Level Await. |
| v15.3.0, v14.17.0, v12.22.0 | Stabilize modules implementation. |
| v14.13.0, v12.20.0 | Support for detection of CommonJS named exports. |
| v14.0.0, v13.14.0, v12.20.0 | Remove experimental modules warning. |
| v13.2.0, v12.17.0 | Loading ECMAScript modules no longer requires a command-line flag. |
| v12.0.0 | Add support for ES modules using `.js` file extension via `package.json` `"type"` field. |
| v8.5.0 | Added in: v8.5.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable
:::

## Introduction {#introduction}

ECMAScript modules are [the official standard format](https://tc39.github.io/ecma262/#sec-modules) to package JavaScript code for reuse. Modules are defined using a variety of [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) and [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) statements.

The following example of an ES module exports a function:

```js [ESM]
// addTwo.mjs
function addTwo(num) {
  return num + 2;
}

export { addTwo };
```
The following example of an ES module imports the function from `addTwo.mjs`:

```js [ESM]
// app.mjs
import { addTwo } from './addTwo.mjs';

// Prints: 6
console.log(addTwo(4));
```
Node.js fully supports ECMAScript modules as they are currently specified and provides interoperability between them and its original module format, [CommonJS](/nodejs/api/modules).

## Enabling {#enabling}

Node.js has two module systems: [CommonJS](/nodejs/api/modules) modules and ECMAScript modules.

Authors can tell Node.js to interpret JavaScript as an ES module via the `.mjs` file extension, the `package.json` [`"type"`](/nodejs/api/packages#type) field with a value `"module"`, or the [`--input-type`](/nodejs/api/cli#--input-typetype) flag with a value of `"module"`. These are explicit markers of code being intended to run as an ES module.

Inversely, authors can explicitly tell Node.js to interpret JavaScript as CommonJS via the `.cjs` file extension, the `package.json` [`"type"`](/nodejs/api/packages#type) field with a value `"commonjs"`, or the [`--input-type`](/nodejs/api/cli#--input-typetype) flag with a value of `"commonjs"`.

When code lacks explicit markers for either module system, Node.js will inspect the source code of a module to look for ES module syntax. If such syntax is found, Node.js will run the code as an ES module; otherwise it will run the module as CommonJS. See [Determining module system](/nodejs/api/packages#determining-module-system) for more details.

## Packages {#packages}

This section was moved to [Modules: Packages](/nodejs/api/packages).

## `import` Specifiers {#import-specifiers}

### Terminology {#terminology}

The *specifier* of an `import` statement is the string after the `from` keyword, e.g. `'node:path'` in `import { sep } from 'node:path'`. Specifiers are also used in `export from` statements, and as the argument to an `import()` expression.

There are three types of specifiers:

-  *Relative specifiers* like `'./startup.js'` or `'../config.mjs'`. They refer to a path relative to the location of the importing file. *The file extension
is always necessary for these.* 
-  *Bare specifiers* like `'some-package'` or `'some-package/shuffle'`. They can refer to the main entry point of a package by the package name, or a specific feature module within a package prefixed by the package name as per the examples respectively. *Including the file extension is only necessary
for packages without an <a href="packages.html#exports"><code>"exports"</code></a> field.* 
-  *Absolute specifiers* like `'file:///opt/nodejs/config.js'`. They refer directly and explicitly to a full path. 

Bare specifier resolutions are handled by the [Node.js module resolution and loading algorithm](/nodejs/api/esm#resolution-algorithm-specification). All other specifier resolutions are always only resolved with the standard relative [URL](https://url.spec.whatwg.org/) resolution semantics.

Like in CommonJS, module files within packages can be accessed by appending a path to the package name unless the package's [`package.json`](/nodejs/api/packages#nodejs-packagejson-field-definitions) contains an [`"exports"`](/nodejs/api/packages#exports) field, in which case files within packages can only be accessed via the paths defined in [`"exports"`](/nodejs/api/packages#exports).

For details on these package resolution rules that apply to bare specifiers in the Node.js module resolution, see the [packages documentation](/nodejs/api/packages).

### Mandatory file extensions {#mandatory-file-extensions}

A file extension must be provided when using the `import` keyword to resolve relative or absolute specifiers. Directory indexes (e.g. `'./startup/index.js'`) must also be fully specified.

This behavior matches how `import` behaves in browser environments, assuming a typically configured server.

### URLs {#urls}

ES modules are resolved and cached as URLs. This means that special characters must be [percent-encoded](/nodejs/api/url#percent-encoding-in-urls), such as `#` with `%23` and `?` with `%3F`.

`file:`, `node:`, and `data:` URL schemes are supported. A specifier like `'https://example.com/app.js'` is not supported natively in Node.js unless using a [custom HTTPS loader](/nodejs/api/module#import-from-https).

#### `file:` URLs {#file-urls}

Modules are loaded multiple times if the `import` specifier used to resolve them has a different query or fragment.

```js [ESM]
import './foo.mjs?query=1'; // loads ./foo.mjs with query of "?query=1"
import './foo.mjs?query=2'; // loads ./foo.mjs with query of "?query=2"
```
The volume root may be referenced via `/`, `//`, or `file:///`. Given the differences between [URL](https://url.spec.whatwg.org/) and path resolution (such as percent encoding details), it is recommended to use [url.pathToFileURL](/nodejs/api/url#urlpathtofileurlpath-options) when importing a path.

#### `data:` imports {#data-imports}

**Added in: v12.10.0**

[`data:` URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) are supported for importing with the following MIME types:

- `text/javascript` for ES modules
- `application/json` for JSON
- `application/wasm` for Wasm

```js [ESM]
import 'data:text/javascript,console.log("hello!");';
import _ from 'data:application/json,"world!"' with { type: 'json' };
```
`data:` URLs only resolve [bare specifiers](/nodejs/api/esm#terminology) for builtin modules and [absolute specifiers](/nodejs/api/esm#terminology). Resolving [relative specifiers](/nodejs/api/esm#terminology) does not work because `data:` is not a [special scheme](https://url.spec.whatwg.org/#special-scheme). For example, attempting to load `./foo` from `data:text/javascript,import "./foo";` fails to resolve because there is no concept of relative resolution for `data:` URLs.

#### `node:` imports {#node-imports}


::: info [History]
| Version | Changes |
| --- | --- |
| v16.0.0, v14.18.0 | Added `node:` import support to `require(...)`. |
| v14.13.1, v12.20.0 | Added in: v14.13.1, v12.20.0 |
:::

`node:` URLs are supported as an alternative means to load Node.js builtin modules. This URL scheme allows for builtin modules to be referenced by valid absolute URL strings.

```js [ESM]
import fs from 'node:fs/promises';
```
## Import attributes {#import-attributes}


::: info [History]
| Version | Changes |
| --- | --- |
| v21.0.0, v20.10.0, v18.20.0 | Switch from Import Assertions to Import Attributes. |
| v17.1.0, v16.14.0 | Added in: v17.1.0, v16.14.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable
:::

[Import attributes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with) are an inline syntax for module import statements to pass on more information alongside the module specifier.

```js [ESM]
import fooData from './foo.json' with { type: 'json' };

const { default: barData } =
  await import('./bar.json', { with: { type: 'json' } });
```
Node.js only supports the `type` attribute, for which it supports the following values:

| Attribute   `type` | Needed for |
| --- | --- |
| `'json'` | [JSON modules](/nodejs/api/esm#json-modules) |
The `type: 'json'` attribute is mandatory when importing JSON modules.

## Built-in modules {#built-in-modules}

[Built-in modules](/nodejs/api/modules#built-in-modules) provide named exports of their public API. A default export is also provided which is the value of the CommonJS exports. The default export can be used for, among other things, modifying the named exports. Named exports of built-in modules are updated only by calling [`module.syncBuiltinESMExports()`](/nodejs/api/module#modulesyncbuiltinesmexports).

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
## `import()` expressions {#import-expressions}

[Dynamic `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) is supported in both CommonJS and ES modules. In CommonJS modules it can be used to load ES modules.

## `import.meta` {#importmeta}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

The `import.meta` meta property is an `Object` that contains the following properties. It is only supported in ES modules.

### `import.meta.dirname` {#importmetadirname}

**Added in: v21.2.0, v20.11.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index).2 - Release candidate
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The directory name of the current module. This is the same as the [`path.dirname()`](/nodejs/api/path#pathdirnamepath) of the [`import.meta.filename`](/nodejs/api/esm#importmetafilename).

### `import.meta.filename` {#importmetafilename}

**Added in: v21.2.0, v20.11.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index).2 - Release candidate
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The full absolute path and filename of the current module, with symlinks resolved.
- This is the same as the [`url.fileURLToPath()`](/nodejs/api/url#urlfileurltopathurl-options) of the [`import.meta.url`](/nodejs/api/esm#importmetaurl).

### `import.meta.url` {#importmetaurl}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The absolute `file:` URL of the module.

This is defined exactly the same as it is in browsers providing the URL of the current module file.

This enables useful patterns such as relative file loading:

```js [ESM]
import { readFileSync } from 'node:fs';
const buffer = readFileSync(new URL('./data.proto', import.meta.url));
```
### `import.meta.resolve(specifier)` {#importmetaresolvespecifier}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.6.0, v18.19.0 | No longer behind `--experimental-import-meta-resolve` CLI flag, except for the non-standard `parentURL` parameter. |
| v20.6.0, v18.19.0 | This API no longer throws when targeting `file:` URLs that do not map to an existing file on the local FS. |
| v20.0.0, v18.19.0 | This API now returns a string synchronously instead of a Promise. |
| v16.2.0, v14.18.0 | Add support for WHATWG `URL` object to `parentURL` parameter. |
| v13.9.0, v12.16.2 | Added in: v13.9.0, v12.16.2 |
:::

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index).2 - Release candidate
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The module specifier to resolve relative to the current module.
- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The absolute URL string that the specifier would resolve to.

[`import.meta.resolve`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve) is a module-relative resolution function scoped to each module, returning the URL string.

```js [ESM]
const dependencyAsset = import.meta.resolve('component-lib/asset.css');
// file:///app/node_modules/component-lib/asset.css
import.meta.resolve('./dep.js');
// file:///app/dep.js
```
All features of the Node.js module resolution are supported. Dependency resolutions are subject to the permitted exports resolutions within the package.

**Caveats**:

- This can result in synchronous file-system operations, which can impact performance similarly to `require.resolve`.
- This feature is not available within custom loaders (it would create a deadlock).

**Non-standard API**:

When using the `--experimental-import-meta-resolve` flag, that function accepts a second argument:

- `parent` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/nodejs/api/url#the-whatwg-url-api) An optional absolute parent module URL to resolve from. **Default:** `import.meta.url`

## Interoperability with CommonJS {#interoperability-with-commonjs}

### `import` statements {#import-statements}

An `import` statement can reference an ES module or a CommonJS module. `import` statements are permitted only in ES modules, but dynamic [`import()`](/nodejs/api/esm#import-expressions) expressions are supported in CommonJS for loading ES modules.

When importing [CommonJS modules](/nodejs/api/esm#commonjs-namespaces), the `module.exports` object is provided as the default export. Named exports may be available, provided by static analysis as a convenience for better ecosystem compatibility.

### `require` {#require}

The CommonJS module `require` currently only supports loading synchronous ES modules (that is, ES modules that do not use top-level `await`).

See [Loading ECMAScript modules using `require()`](/nodejs/api/modules#loading-ecmascript-modules-using-require) for details.

### CommonJS Namespaces {#commonjs-namespaces}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | Added `'module.exports'` export marker to CJS namespaces. |
| v14.13.0 | Added in: v14.13.0 |
:::

CommonJS modules consist of a `module.exports` object which can be of any type.

To support this, when importing CommonJS from an ECMAScript module, a namespace wrapper for the CommonJS module is constructed, which always provides a `default` export key pointing to the CommonJS `module.exports` value.

In addition, a heuristic static analysis is performed against the source text of the CommonJS module to get a best-effort static list of exports to provide on the namespace from values on `module.exports`. This is necessary since these namespaces must be constructed prior to the evaluation of the CJS module.

These CommonJS namespace objects also provide the `default` export as a `'module.exports'` named export, in order to unambiguously indicate that their representation in CommonJS uses this value, and not the namespace value. This mirrors the semantics of the handling of the `'module.exports'` export name in [`require(esm)`](/nodejs/api/modules#loading-ecmascript-modules-using-require) interop support.

When importing a CommonJS module, it can be reliably imported using the ES module default import or its corresponding sugar syntax:

```js [ESM]
import { default as cjs } from 'cjs';
// Identical to the above
import cjsSugar from 'cjs';

console.log(cjs);
console.log(cjs === cjsSugar);
// Prints:
//   <module.exports>
//   true
```
This Module Namespace Exotic Object can be directly observed either when using `import * as m from 'cjs'` or a dynamic import:

```js [ESM]
import * as m from 'cjs';
console.log(m);
console.log(m === await import('cjs'));
// Prints:
//   [Module] { default: <module.exports>, 'module.exports': <module.exports> }
//   true
```
For better compatibility with existing usage in the JS ecosystem, Node.js in addition attempts to determine the CommonJS named exports of every imported CommonJS module to provide them as separate ES module exports using a static analysis process.

For example, consider a CommonJS module written:

```js [CJS]
// cjs.cjs
exports.name = 'exported';
```
The preceding module supports named imports in ES modules:

```js [ESM]
import { name } from './cjs.cjs';
console.log(name);
// Prints: 'exported'

import cjs from './cjs.cjs';
console.log(cjs);
// Prints: { name: 'exported' }

import * as m from './cjs.cjs';
console.log(m);
// Prints:
//   [Module] {
//     default: { name: 'exported' },
//     'module.exports': { name: 'exported' },
//     name: 'exported'
//   }
```
As can be seen from the last example of the Module Namespace Exotic Object being logged, the `name` export is copied off of the `module.exports` object and set directly on the ES module namespace when the module is imported.

Live binding updates or new exports added to `module.exports` are not detected for these named exports.

The detection of named exports is based on common syntax patterns but does not always correctly detect named exports. In these cases, using the default import form described above can be a better option.

Named exports detection covers many common export patterns, reexport patterns and build tool and transpiler outputs. See [cjs-module-lexer](https://github.com/nodejs/cjs-module-lexer/tree/2.0.0) for the exact semantics implemented.

### Differences between ES modules and CommonJS {#differences-between-es-modules-and-commonjs}

#### No `require`, `exports`, or `module.exports` {#no-require-exports-or-moduleexports}

In most cases, the ES module `import` can be used to load CommonJS modules.

If needed, a `require` function can be constructed within an ES module using [`module.createRequire()`](/nodejs/api/module#modulecreaterequirefilename).

#### No `__filename` or `__dirname` {#no-__filename-or-__dirname}

These CommonJS variables are not available in ES modules.

`__filename` and `__dirname` use cases can be replicated via [`import.meta.filename`](/nodejs/api/esm#importmetafilename) and [`import.meta.dirname`](/nodejs/api/esm#importmetadirname).

#### No Addon Loading {#no-addon-loading}

[Addons](/nodejs/api/addons) are not currently supported with ES module imports.

They can instead be loaded with [`module.createRequire()`](/nodejs/api/module#modulecreaterequirefilename) or [`process.dlopen`](/nodejs/api/process#processdlopenmodule-filename-flags).

#### No `require.resolve` {#no-requireresolve}

Relative resolution can be handled via `new URL('./local', import.meta.url)`.

For a complete `require.resolve` replacement, there is the [import.meta.resolve](/nodejs/api/esm#importmetaresolvespecifier) API.

Alternatively `module.createRequire()` can be used.

#### No `NODE_PATH` {#no-node_path}

`NODE_PATH` is not part of resolving `import` specifiers. Please use symlinks if this behavior is desired.

#### No `require.extensions` {#no-requireextensions}

`require.extensions` is not used by `import`. Module customization hooks can provide a replacement.

#### No `require.cache` {#no-requirecache}

`require.cache` is not used by `import` as the ES module loader has its own separate cache.

## JSON modules {#json-modules}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.1.0 | JSON modules are no longer experimental. |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable
:::

JSON files can be referenced by `import`:

```js [ESM]
import packageConfig from './package.json' with { type: 'json' };
```
The `with { type: 'json' }` syntax is mandatory; see [Import Attributes](/nodejs/api/esm#import-attributes).

The imported JSON only exposes a `default` export. There is no support for named exports. A cache entry is created in the CommonJS cache to avoid duplication. The same object is returned in CommonJS if the JSON module has already been imported from the same path.

## Wasm modules {#wasm-modules}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

Importing WebAssembly modules is supported under the `--experimental-wasm-modules` flag, allowing any `.wasm` files to be imported as normal modules while also supporting their module imports.

This integration is in line with the [ES Module Integration Proposal for WebAssembly](https://github.com/webassembly/esm-integration).

For example, an `index.mjs` containing:

```js [ESM]
import * as M from './module.wasm';
console.log(M);
```
executed under:

```bash [BASH]
node --experimental-wasm-modules index.mjs
```
would provide the exports interface for the instantiation of `module.wasm`.

## Top-level `await` {#top-level-await}

**Added in: v14.8.0**

The `await` keyword may be used in the top level body of an ECMAScript module.

Assuming an `a.mjs` with

```js [ESM]
export const five = await Promise.resolve(5);
```
And a `b.mjs` with

```js [ESM]
import { five } from './a.mjs';

console.log(five); // Logs `5`
```
```bash [BASH]
node b.mjs # works
```
If a top level `await` expression never resolves, the `node` process will exit with a `13` [status code](/nodejs/api/process#exit-codes).

```js [ESM]
import { spawn } from 'node:child_process';
import { execPath } from 'node:process';

spawn(execPath, [
  '--input-type=module',
  '--eval',
  // Never-resolving Promise:
  'await new Promise(() => {})',
]).once('exit', (code) => {
  console.log(code); // Logs `13`
});
```
## Loaders {#loaders}

The former Loaders documentation is now at [Modules: Customization hooks](/nodejs/api/module#customization-hooks).

## Resolution and loading algorithm {#resolution-and-loading-algorithm}

### Features {#features}

The default resolver has the following properties:

- FileURL-based resolution as is used by ES modules
- Relative and absolute URL resolution
- No default extensions
- No folder mains
- Bare specifier package resolution lookup through node_modules
- Does not fail on unknown extensions or protocols
- Can optionally provide a hint of the format to the loading phase

The default loader has the following properties

- Support for builtin module loading via `node:` URLs
- Support for "inline" module loading via `data:` URLs
- Support for `file:` module loading
- Fails on any other URL protocol
- Fails on unknown extensions for `file:` loading (supports only `.cjs`, `.js`, and `.mjs`)

### Resolution algorithm {#resolution-algorithm}

The algorithm to load an ES module specifier is given through the **ESM_RESOLVE** method below. It returns the resolved URL for a module specifier relative to a parentURL.

The resolution algorithm determines the full resolved URL for a module load, along with its suggested module format. The resolution algorithm does not determine whether the resolved URL protocol can be loaded, or whether the file extensions are permitted, instead these validations are applied by Node.js during the load phase (for example, if it was asked to load a URL that has a protocol that is not `file:`, `data:` or `node:`.

The algorithm also tries to determine the format of the file based on the extension (see `ESM_FILE_FORMAT` algorithm below). If it does not recognize the file extension (eg if it is not `.mjs`, `.cjs`, or `.json`), then a format of `undefined` is returned, which will throw during the load phase.

The algorithm to determine the module format of a resolved URL is provided by **ESM_FILE_FORMAT**, which returns the unique module format for any file. The *"module"* format is returned for an ECMAScript Module, while the *"commonjs"* format is used to indicate loading through the legacy CommonJS loader. Additional formats such as *"addon"* can be extended in future updates.

In the following algorithms, all subroutine errors are propagated as errors of these top-level routines unless stated otherwise.

*defaultConditions* is the conditional environment name array, `["node", "import"]`.

The resolver can throw the following errors:

- *Invalid Module Specifier*: Module specifier is an invalid URL, package name or package subpath specifier.
- *Invalid Package Configuration*: package.json configuration is invalid or contains an invalid configuration.
- *Invalid Package Target*: Package exports or imports define a target module for the package that is an invalid type or string target.
- *Package Path Not Exported*: Package exports do not define or permit a target subpath in the package for the given module.
- *Package Import Not Defined*: Package imports do not define the specifier.
- *Module Not Found*: The package or module requested does not exist.
- *Unsupported Directory Import*: The resolved path corresponds to a directory, which is not a supported target for module imports.

### Resolution Algorithm Specification {#resolution-algorithm-specification}

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

### Customizing ESM specifier resolution algorithm {#customizing-esm-specifier-resolution-algorithm}

[Module customization hooks](/nodejs/api/module#customization-hooks) provide a mechanism for customizing the ESM specifier resolution algorithm. An example that provides CommonJS-style resolution for ESM specifiers is [commonjs-extension-resolution-loader](https://github.com/nodejs/loaders-test/tree/main/commonjs-extension-resolution-loader).

