---
title: Node.js ドキュメント - モジュールシステム
description: このページでは、Node.jsのモジュールシステムについて詳しく説明しています。CommonJSおよびESモジュール、モジュールの読み込み方法、モジュールのキャッシュ、そして2つのモジュールシステムの違いについて記載しています。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - モジュールシステム | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: このページでは、Node.jsのモジュールシステムについて詳しく説明しています。CommonJSおよびESモジュール、モジュールの読み込み方法、モジュールのキャッシュ、そして2つのモジュールシステムの違いについて記載しています。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - モジュールシステム | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: このページでは、Node.jsのモジュールシステムについて詳しく説明しています。CommonJSおよびESモジュール、モジュールの読み込み方法、モジュールのキャッシュ、そして2つのモジュールシステムの違いについて記載しています。
---


# モジュール: `node:module` API {#modules-nodemodule-api}

**追加: v0.3.7**

## `Module` オブジェクト {#the-module-object}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[`Module`](/ja/nodejs/api/module#the-module-object) のインスタンスとやり取りする際に、一般的なユーティリティメソッドを提供します。[`module`](/ja/nodejs/api/module#the-module-object) 変数は、[CommonJS](/ja/nodejs/api/modules) モジュールでよく見られます。`import 'node:module'` または `require('node:module')` を介してアクセスします。

### `module.builtinModules` {#modulebuiltinmodules}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v23.5.0 | リストにプレフィックスのみのモジュールも含まれるようになりました。 |
| v9.3.0, v8.10.0, v6.13.0 | 追加: v9.3.0, v8.10.0, v6.13.0 |
:::

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Node.js によって提供されるすべてのモジュールの名前のリスト。モジュールがサードパーティによって管理されているかどうかを確認するために使用できます。

このコンテキストの `module` は、[モジュールラッパー](/ja/nodejs/api/modules#the-module-wrapper)によって提供されるオブジェクトと同じではありません。アクセスするには、`Module` モジュールをrequireします。

::: code-group
```js [ESM]
// module.mjs
// ECMAScript モジュールの場合
import { builtinModules as builtin } from 'node:module';
```

```js [CJS]
// module.cjs
// CommonJS モジュールの場合
const builtin = require('node:module').builtinModules;
```
:::

### `module.createRequire(filename)` {#modulecreaterequirefilename}

**追加: v12.2.0**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) require関数を構築するために使用されるファイル名。ファイルURLオブジェクト、ファイルURL文字列、または絶対パス文字列である必要があります。
- 戻り値: [\<require\>](/ja/nodejs/api/modules#requireid) Require 関数

```js [ESM]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// sibling-module.js は CommonJS モジュールです。
const siblingModule = require('./sibling-module');
```

### `module.findPackageJSON(specifier[, base])` {#modulefindpackagejsonspecifier-base}

**追加: v23.2.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) 取得する `package.json` を持つモジュールの識別子。 *Bare specifier* を渡すと、パッケージのルートにある `package.json` が返されます。 *相対 specifier* または *絶対 specifier* を渡すと、最も近い親の `package.json` が返されます。
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) 含まれているモジュールの絶対位置（`file:` URL 文字列または FS パス）。 CJS の場合は、`__filename` を使用します (`__dirname` ではありません)。 ESM の場合は、`import.meta.url` を使用します。 `specifier` が *絶対 specifier* の場合は、渡す必要はありません。
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `package.json` が見つかった場合はパス。 `startLocation` がパッケージの場合、パッケージのルート `package.json`。 相対または未解決の場合、`startLocation` に最も近い `package.json`。

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
// 代わりに絶対 specifier を渡した場合も同じ結果:
findPackageJSON(new URL('../', import.meta.url));
findPackageJSON(import.meta.resolve('../'));

findPackageJSON('some-package', import.meta.url);
// '/path/to/project/packages/bar/node_modules/some-package/package.json'
// 絶対 specifier を渡すと、解決されたモジュールがネストされた `package.json` を持つサブフォルダー内にある場合、異なる結果になる可能性があります。
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
// 代わりに絶対 specifier を渡した場合も同じ結果:
findPackageJSON(pathToFileURL(path.join(__dirname, '..')));

findPackageJSON('some-package', __filename);
// '/path/to/project/packages/bar/node_modules/some-package/package.json'
// 絶対 specifier を渡すと、解決されたモジュールがネストされた `package.json` を持つサブフォルダー内にある場合、異なる結果になる可能性があります。
findPackageJSON(pathToFileURL(require.resolve('some-package')));
// '/path/to/project/packages/bar/node_modules/some-package/some-subfolder/package.json'

findPackageJSON('@foo/qux', __filename);
// '/path/to/project/packages/qux/package.json'
```
:::


### `module.isBuiltin(moduleName)` {#moduleisbuiltinmodulename}

**Added in: v18.6.0, v16.17.0**

- `moduleName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) モジュールの名前
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) モジュールが組み込みの場合は true、そうでない場合は false を返します

```js [ESM]
import { isBuiltin } from 'node:module';
isBuiltin('node:fs'); // true
isBuiltin('fs'); // true
isBuiltin('wss'); // false
```
### `module.register(specifier[, parentURL][, options])` {#moduleregisterspecifier-parenturl-options}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.8.0, v18.19.0 | WHATWG URL インスタンスのサポートを追加。 |
| v20.6.0, v18.19.0 | Added in: v20.6.0, v18.19.0 |
:::

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index).2 - リリース候補
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) 登録されるカスタマイズフック。これは `import()` に渡される文字列と同じである必要があります。ただし、相対的な場合は、`parentURL` を基準に解決されます。
- `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) `import.meta.url` などのベース URL を基準に `specifier` を解決する場合は、ここにその URL を渡すことができます。 **既定:** `'data:'`
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) `import.meta.url` などのベース URL を基準に `specifier` を解決する場合は、ここにその URL を渡すことができます。 このプロパティは、`parentURL` が 2 番目の引数として指定されている場合は無視されます。 **既定:** `'data:'`
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) [`initialize`](/ja/nodejs/api/module#initialize) フックに渡す任意のクローン可能な JavaScript 値。
    - `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `initialize` フックに渡される [転送可能なオブジェクト](/ja/nodejs/api/worker_threads#portpostmessagevalue-transferlist)。
  
 

Node.js モジュールの解決と読み込みの動作をカスタマイズする[フック](/ja/nodejs/api/module#customization-hooks)をエクスポートするモジュールを登録します。[カスタマイズフック](/ja/nodejs/api/module#customization-hooks) を参照してください。


### `module.registerHooks(options)` {#moduleregisterhooksoptions}

**Added in: v23.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `load` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [load hook](/ja/nodejs/api/module#loadurl-context-nextload) を参照。 **デフォルト:** `undefined`.
    - `resolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [resolve hook](/ja/nodejs/api/module#resolvespecifier-context-nextresolve) を参照。 **デフォルト:** `undefined`.
  
 

Node.js のモジュール解決とロードの動作をカスタマイズする [hooks](/ja/nodejs/api/module#customization-hooks) を登録します。[Customization hooks](/ja/nodejs/api/module#customization-hooks) を参照してください。

### `module.stripTypeScriptTypes(code[, options])` {#modulestriptypescripttypescode-options}

**Added in: v23.2.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 型アノテーションを削除するコード。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **デフォルト:** `'strip'`. 可能な値は次のとおりです:
    - `'strip'` TypeScriptの機能を変換せずに、型アノテーションのみを削除します。
    - `'transform'` 型アノテーションを削除し、TypeScript の機能を JavaScript に変換します。
  
 
    - `sourceMap` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **デフォルト:** `false`. `mode` が `'transform'` の場合にのみ、`true` の場合、変換されたコードのソースマップが生成されます。
    - `sourceUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ソースマップで使用されるソース URL を指定します。
  
 
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 型アノテーションが削除されたコード。 `module.stripTypeScriptTypes()` は、TypeScript コードから型アノテーションを削除します。これは、`vm.runInContext()` または `vm.compileFunction()` で実行する前に、TypeScript コードから型アノテーションを削除するために使用できます。 デフォルトでは、コードに `Enums` などの変換が必要な TypeScript 機能が含まれている場合、エラーがスローされます。詳細については、[type-stripping](/ja/nodejs/api/typescript#type-stripping) を参照してください。 mode が `'transform'` の場合、TypeScript の機能を JavaScript に変換します。詳細については、[transform TypeScript features](/ja/nodejs/api/typescript#typescript-features) を参照してください。 mode が `'strip'` の場合、場所が保持されるため、ソースマップは生成されません。 `sourceMap` が指定されている場合、mode が `'strip'` の場合、エラーがスローされます。

*警告*: TypeScript パーサーの変更により、この関数の出力は Node.js のバージョン間で安定しているとは見なされません。

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

`sourceUrl` が指定されている場合、出力の最後にコメントとして追加されます。

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

`mode` が `'transform'` の場合、コードは JavaScript に変換されます。

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

**追加:** v12.12.0

`module.syncBuiltinESMExports()` メソッドは、組み込みの [ES Modules](/ja/nodejs/api/esm) のすべてのライブバインディングを更新して、[CommonJS](/ja/nodejs/api/modules) エクスポートのプロパティと一致させます。[ES Modules](/ja/nodejs/api/esm) からエクスポートされた名前を追加または削除しません。

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
  // 既存のreadFileプロパティを新しい値と同期します
  assert.strictEqual(esmFS.readFile, newAPI);
  // readFileSync は必要な fs から削除されました
  assert.strictEqual('readFileSync' in fs, false);
  // syncBuiltinESMExports() は esmFS から readFileSync を削除しません
  assert.strictEqual('readFileSync' in esmFS, true);
  // syncBuiltinESMExports() は名前を追加しません
  assert.strictEqual(esmFS.newAPI, undefined);
});
```
## モジュールコンパイルキャッシュ {#module-compile-cache}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v22.8.0 | ランタイムアクセス用の初期JavaScript APIを追加。 |
| v22.1.0 | 追加: v22.1.0 |
:::

モジュールコンパイルキャッシュは、[`module.enableCompileCache()`](/ja/nodejs/api/module#moduleenablecompilecachecachedir) メソッドまたは [`NODE_COMPILE_CACHE=dir`](/ja/nodejs/api/cli#node_compile_cachedir) 環境変数を使用して有効にできます。有効にすると、Node.js が CommonJS または ECMAScript モジュールをコンパイルするたびに、指定されたディレクトリに永続化されたオンディスクの [V8 コードキャッシュ](https://v8.dev/blog/code-caching-for-devs) を使用して、コンパイルを高速化します。これにより、モジュールグラフの最初のロードが遅くなる可能性がありますが、モジュールの内容が変更されない場合、同じモジュールグラフの後続のロードは大幅に高速化される可能性があります。

ディスク上に生成されたコンパイルキャッシュをクリーンアップするには、キャッシュディレクトリを削除するだけです。キャッシュディレクトリは、次回同じディレクトリがコンパイルキャッシュストレージに使用されるときに再作成されます。古いキャッシュでディスクがいっぱいになるのを防ぐために、[`os.tmpdir()`](/ja/nodejs/api/os#ostmpdir) の下のディレクトリを使用することをお勧めします。ディレクトリを指定せずに [`module.enableCompileCache()`](/ja/nodejs/api/module#moduleenablecompilecachecachedir) の呼び出しによってコンパイルキャッシュが有効になっている場合、Node.js は [`NODE_COMPILE_CACHE=dir`](/ja/nodejs/api/cli#node_compile_cachedir) 環境変数（設定されている場合）を使用するか、デフォルトで `path.join(os.tmpdir(), 'node-compile-cache')` を使用します。実行中の Node.js インスタンスで使用されているコンパイルキャッシュディレクトリを見つけるには、[`module.getCompileCacheDir()`](/ja/nodejs/api/module#modulegetcompilecachedir) を使用します。

現在、[V8 JavaScript コードカバレッジ](https://v8project.blogspot.com/2017/12/javascript-code-coverage) でコンパイルキャッシュを使用する場合、V8 によって収集されるカバレッジは、コードキャッシュからデシリアライズされた関数では精度が低い可能性があります。正確なカバレッジを生成するためにテストを実行するときは、これをオフにすることをお勧めします。

有効になっているモジュールコンパイルキャッシュは、[`NODE_DISABLE_COMPILE_CACHE=1`](/ja/nodejs/api/cli#node_disable_compile_cache1) 環境変数で無効にできます。これは、コンパイルキャッシュが予期しない動作または望ましくない動作（たとえば、テストカバレッジの精度が低い）につながる場合に役立ちます。

あるバージョンの Node.js で生成されたコンパイルキャッシュは、別のバージョンの Node.js では再利用できません。異なるバージョンの Node.js で生成されたキャッシュは、キャッシュの永続化に同じベースディレクトリが使用されている場合は個別に保存されるため、共存できます。

現時点では、コンパイルキャッシュが有効になっていて、モジュールが新たにロードされると、コンパイルされたコードからすぐにコードキャッシュが生成されますが、Node.js インスタンスが終了しようとするときにのみディスクに書き込まれます。これは変更される可能性があります。[`module.flushCompileCache()`](/ja/nodejs/api/module#moduleflushcompilecache) メソッドを使用すると、アプリケーションが他の Node.js インスタンスを生成し、親が終了するずっと前にキャッシュを共有できるようにする場合に、蓄積されたコードキャッシュがディスクにフラッシュされるようにすることができます。


### `module.constants.compileCacheStatus` {#moduleconstantscompilecachestatus}

**Added in: v22.8.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

以下の定数は、[`module.enableCompileCache()`](/ja/nodejs/api/module#moduleenablecompilecachecachedir)によって返されるオブジェクトの`status`フィールドとして返され、[モジュールコンパイルキャッシュ](/ja/nodejs/api/module#module-compile-cache)を有効にする試みの結果を示します。

| 定数 | 説明 |
| --- | --- |
| `ENABLED` | Node.jsはコンパイルキャッシュを正常に有効にしました。コンパイルキャッシュの保存に使用されるディレクトリは、返されるオブジェクトの`directory`フィールドに返されます。 |
| `ALREADY_ENABLED` | コンパイルキャッシュは、以前に`module.enableCompileCache()`を呼び出すか、`NODE_COMPILE_CACHE=dir`環境変数によって既に有効になっています。コンパイルキャッシュの保存に使用されるディレクトリは、返されるオブジェクトの`directory`フィールドに返されます。 |
| `FAILED` | Node.jsはコンパイルキャッシュを有効にできません。これは、指定されたディレクトリを使用する権限がないこと、またはさまざまな種類のファイルシステムエラーが原因である可能性があります。失敗の詳細は、返されるオブジェクトの`message`フィールドに返されます。 |
| `DISABLED` | 環境変数`NODE_DISABLE_COMPILE_CACHE=1`が設定されているため、Node.jsはコンパイルキャッシュを有効にできません。 |

### `module.enableCompileCache([cacheDir])` {#moduleenablecompilecachecachedir}

**Added in: v22.8.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

- `cacheDir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) コンパイルキャッシュが保存/取得されるディレクトリを指定するオプションのパス。
- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `status` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`module.constants.compileCacheStatus`](/ja/nodejs/api/module#moduleconstantscompilecachestatus) のいずれか
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Node.jsがコンパイルキャッシュを有効にできない場合、これにはエラーメッセージが含まれます。`status`が`module.constants.compileCacheStatus.FAILED`の場合のみ設定されます。
    - `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) コンパイルキャッシュが有効になっている場合、これにはコンパイルキャッシュが保存されているディレクトリが含まれます。`status`が`module.constants.compileCacheStatus.ENABLED`または`module.constants.compileCacheStatus.ALREADY_ENABLED`の場合のみ設定されます。

現在のNode.jsインスタンスで[モジュールコンパイルキャッシュ](/ja/nodejs/api/module#module-compile-cache)を有効にします。

`cacheDir`が指定されていない場合、Node.jsは、[`NODE_COMPILE_CACHE=dir`](/ja/nodejs/api/cli#node_compile_cachedir)環境変数が設定されている場合はそれによって指定されたディレクトリを使用し、それ以外の場合は`path.join(os.tmpdir(), 'node-compile-cache')`を使用します。一般的なユースケースでは、`cacheDir`を指定せずに`module.enableCompileCache()`を呼び出すことをお勧めします。これにより、必要に応じて`NODE_COMPILE_CACHE`環境変数でディレクトリをオーバーライドできます。

コンパイルキャッシュは、アプリケーションが機能するために必須ではない静かな最適化であると想定されているため、このメソッドは、コンパイルキャッシュを有効にできない場合に例外をスローしないように設計されています。代わりに、デバッグを支援するために、`message`フィールドにエラーメッセージを含むオブジェクトを返します。コンパイルキャッシュが正常に有効になっている場合、返されるオブジェクトの`directory`フィールドには、コンパイルキャッシュが保存されているディレクトリへのパスが含まれます。返されるオブジェクトの`status`フィールドは、[モジュールコンパイルキャッシュ](/ja/nodejs/api/module#module-compile-cache)を有効にする試みの結果を示す`module.constants.compileCacheStatus`の値のいずれかになります。

このメソッドは、現在のNode.jsインスタンスにのみ影響します。子ワーカースレッドで有効にするには、子ワーカースレッドでもこのメソッドを呼び出すか、`process.env.NODE_COMPILE_CACHE`の値をコンパイルキャッシュディレクトリに設定して、動作を子ワーカーに継承できるようにします。ディレクトリは、このメソッドによって返される`directory`フィールドから、または[`module.getCompileCacheDir()`](/ja/nodejs/api/module#modulegetcompilecachedir)を使用して取得できます。

### `module.flushCompileCache()` {#moduleflushcompilecache}

**Added in: v23.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

現在の Node.js インスタンスに既にロードされているモジュールから蓄積された[モジュールコンパイルキャッシュ](/ja/nodejs/api/module#module-compile-cache)をディスクにフラッシュします。これは、フラッシュファイルシステム操作が成功するかどうかにかかわらず、すべて終了した後に返されます。エラーが発生した場合、コンパイルキャッシュのミスはアプリケーションの実際の動作を妨げるべきではないため、これは静かに失敗します。

### `module.getCompileCacheDir()` {#modulegetcompilecachedir}

**Added in: v22.8.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [モジュールコンパイルキャッシュ](/ja/nodejs/api/module#module-compile-cache)ディレクトリが有効になっている場合はそのパス、そうでない場合は `undefined`。

## カスタマイズフック {#customization-hooks}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v23.5.0 | 同期およびインスレッドフックのサポートを追加。 |
| v20.6.0, v18.19.0 | `globalPreload` を置き換える `initialize` フックを追加。 |
| v18.6.0, v16.17.0 | ローダーのチェーンのサポートを追加。 |
| v16.12.0 | `getFormat`、`getSource`、`transformSource`、および `globalPreload` を削除。`load` フックと `getGlobalPreload` フックを追加。 |
| v8.8.0 | Added in: v8.8.0 |
:::

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index).2 - リリース候補 (非同期バージョン) 安定性: 1.1 - 活発な開発 (同期バージョン)
:::

現在サポートされているモジュールのカスタマイズフックには、2つのタイプがあります。

### 有効化 {#enabling}

モジュールの解決とロードは、以下によってカスタマイズできます。

フックは、[`--import`](/ja/nodejs/api/cli#--importmodule) または [`--require`](/ja/nodejs/api/cli#-r---require-module) フラグを使用して、アプリケーションコードが実行される前に登録できます。

```bash [BASH]
node --import ./register-hooks.js ./my-app.js
node --require ./register-hooks.js ./my-app.js
```

::: code-group
```js [ESM]
// register-hooks.js
// このファイルは、トップレベルの await が含まれていない場合にのみ require() できます。
// 専用のスレッドで非同期フックを登録するには、module.register() を使用します。
import { register } from 'node:module';
register('./hooks.mjs', import.meta.url);
```

```js [CJS]
// register-hooks.js
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
// 専用のスレッドで非同期フックを登録するには、module.register() を使用します。
register('./hooks.mjs', pathToFileURL(__filename));
```
:::

::: code-group
```js [ESM]
// メインスレッドで同期フックを登録するには、module.registerHooks() を使用します。
import { registerHooks } from 'node:module';
registerHooks({
  resolve(specifier, context, nextResolve) { /* 実装 */ },
  load(url, context, nextLoad) { /* 実装 */ },
});
```

```js [CJS]
// メインスレッドで同期フックを登録するには、module.registerHooks() を使用します。
const { registerHooks } = require('node:module');
registerHooks({
  resolve(specifier, context, nextResolve) { /* 実装 */ },
  load(url, context, nextLoad) { /* 実装 */ },
});
```
:::

`--import` または `--require` に渡されるファイルは、依存関係からのエクスポートにすることもできます。

```bash [BASH]
node --import some-package/register ./my-app.js
node --require some-package/register ./my-app.js
```

ここで、`some-package` には、次の `register-hooks.js` の例のように、`register()` を呼び出すファイルにマッピングされる `/register` エクスポートを定義する [`"exports"`](/ja/nodejs/api/packages#exports) フィールドがあります。

`--import` または `--require` を使用すると、アプリケーションのエントリポイントやデフォルトでワーカー スレッドを含む、すべてのアプリケーションファイルがインポートされる前にフックが登録されることが保証されます。

または、エントリポイントから `register()` と `registerHooks()` を呼び出すこともできますが、フックが登録された後に実行される ESM コードには、動的な `import()` を使用する必要があります。

::: code-group
```js [ESM]
import { register } from 'node:module';

register('http-to-https', import.meta.url);

// これは動的な `import()` であるため、`http-to-https` フックが実行されて
// `./my-app.js` およびそれがインポートまたは require する他のすべてのファイルを処理します。
await import('./my-app.js');
```

```js [CJS]
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

register('http-to-https', pathToFileURL(__filename));

// これは動的な `import()` であるため、`http-to-https` フックが実行されて
// `./my-app.js` およびそれがインポートまたは require する他のすべてのファイルを処理します。
import('./my-app.js');
```
:::

カスタマイズフックは、登録よりも後にロードされるすべてのモジュールと、`import` および組み込みの `require` を介して参照するモジュールに対して実行されます。`module.createRequire()` を使用してユーザーが作成した `require` 関数は、同期フックによってのみカスタマイズできます。

この例では、`http-to-https` フックを登録していますが、それらは後続のインポートされたモジュールでのみ使用できます。この場合、`my-app.js` と、CommonJS 依存関係の `import` または組み込み `require` を介して参照するすべてのモジュールです。

`import('./my-app.js')` が代わりに静的な `import './my-app.js'` であった場合、`http-to-https` フックが登録される**前に**アプリケーションは*既に*ロードされていたでしょう。これは、静的なインポートが最初にツリーの葉から評価され、次に幹に戻るという ES モジュール仕様によるものです。`my-app.js` 内に静的なインポートが存在する可能性があり、これらは `my-app.js` が動的にインポートされるまで評価されません。

同期フックが使用されている場合、`import`、`require`、および `createRequire()` を使用して作成されたユーザー `require` の両方がサポートされます。

::: code-group
```js [ESM]
import { registerHooks, createRequire } from 'node:module';

registerHooks({ /* 同期フックの実装 */ });

const require = createRequire(import.meta.url);

// 同期フックは、import、require()、および createRequire() を介して作成されたユーザー require() 関数に影響を与えます。
await import('./my-app.js');
require('./my-app-2.js');
```

```js [CJS]
const { register, registerHooks } = require('node:module');
const { pathToFileURL } = require('node:url');

registerHooks({ /* 同期フックの実装 */ });

const userRequire = createRequire(__filename);

// 同期フックは、import、require()、および createRequire() を介して作成されたユーザー require() 関数に影響を与えます。
import('./my-app.js');
require('./my-app-2.js');
userRequire('./my-app-3.js');
```
:::

最後に、アプリケーションを実行する前にフックを登録するだけでよく、そのために別のファイルを作成したくない場合は、`data:` URL を `--import` に渡すことができます。

```bash [BASH]
node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("http-to-https", pathToFileURL("./"));' ./my-app.js
```

### チェーン化 {#chaining}

`register` は複数回呼び出すことが可能です。

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
const { pathToFileURL } from require('node:url');

const parentURL = pathToFileURL(__filename);
register('./foo.mjs', parentURL);
register('./bar.mjs', parentURL);
import('./my-app.mjs');
```
:::

この例では、登録されたフックはチェーンを形成します。これらのチェーンは、後入れ先出し (LIFO) で実行されます。`foo.mjs` と `bar.mjs` の両方が `resolve` フックを定義している場合、それらは次のように呼び出されます (右から左に注意): node のデフォルト ← `./foo.mjs` ← `./bar.mjs` (まず `./bar.mjs`、次に `./foo.mjs`、そして Node.js のデフォルト)。これは他のすべてのフックにも当てはまります。

登録されたフックは `register` 自体にも影響を与えます。この例では、`bar.mjs` は `foo.mjs` によって登録されたフックを介して解決およびロードされます (`foo` のフックはすでにチェーンに追加されているため)。これにより、以前に登録されたフックが JavaScript にトランスパイルされる限り、JavaScript 以外の言語でフックを記述するなどのことが可能になります。

`register` メソッドは、フックを定義するモジュール内から呼び出すことはできません。

`registerHooks` のチェーン化も同様に機能します。同期フックと非同期フックが混在している場合、同期フックは常に非同期フックが実行される前に最初に実行されます。つまり、最後に実行される同期フックでは、次のフックに非同期フックの呼び出しが含まれます。

::: code-group
```js [ESM]
// entrypoint.mjs
import { registerHooks } from 'node:module';

const hook1 = { /* フックの実装 */ };
const hook2 = { /* フックの実装 */ };
// hook2 は hook1 より前に実行されます。
registerHooks(hook1);
registerHooks(hook2);
```

```js [CJS]
// entrypoint.cjs
const { registerHooks } = require('node:module');

const hook1 = { /* フックの実装 */ };
const hook2 = { /* フックの実装 */ };
// hook2 は hook1 より前に実行されます。
registerHooks(hook1);
registerHooks(hook2);
```
:::


### モジュールカスタマイズフックとの通信 {#communication-with-module-customization-hooks}

非同期フックは、アプリケーションコードを実行するメインスレッドとは別の専用スレッドで実行されます。これは、グローバル変数を変更しても他のスレッドには影響せず、スレッド間の通信にはメッセージチャネルを使用する必要があることを意味します。

`register`メソッドを使用して、[`initialize`](/ja/nodejs/api/module#initialize)フックにデータを渡すことができます。フックに渡されるデータには、ポートのような転送可能なオブジェクトが含まれる場合があります。

::: code-group
```js [ESM]
import { register } from 'node:module';
import { MessageChannel } from 'node:worker_threads';

// この例は、`port2`をフックに送信することで、
// メッセージチャネルがフックとの通信に使用できる方法を示しています。
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

// この例は、`port2`をフックに送信することで、
// メッセージチャネルがフックとの通信に使用できる方法を示しています。
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

同期モジュールフックは、アプリケーションコードが実行されるのと同じスレッドで実行されます。メインスレッドがアクセスするコンテキストのグローバル変数を直接変更できます。

### フック {#hooks}

#### `module.register()` で受け入れられる非同期フック {#asynchronous-hooks-accepted-by-moduleregister}

[`register`](/ja/nodejs/api/module#moduleregisterspecifier-parenturl-options) メソッドを使用して、フックのセットをエクスポートするモジュールを登録できます。フックは、モジュールの解決とロードのプロセスをカスタマイズするために Node.js によって呼び出される関数です。エクスポートされた関数は、特定の名前とシグネチャを持ち、名前付きエクスポートとしてエクスポートする必要があります。

```js [ESM]
export async function initialize({ number, port }) {
  // `register` からデータを受け取ります。
}

export async function resolve(specifier, context, nextResolve) {
  // `import` または `require` の specifier を受け取り、URL に解決します。
}

export async function load(url, context, nextLoad) {
  // 解決された URL を受け取り、評価されるソースコードを返します。
}
```
非同期フックは、アプリケーションコードが実行されるメインスレッドから分離された別のスレッドで実行されます。つまり、異なる [realm](https://tc39.es/ecma262/#realm) です。フックスレッドは、メインスレッドによっていつでも終了される可能性があるため、（`console.log` のような）非同期操作が完了することを前提としないでください。それらはデフォルトで子ワーカーに継承されます。


#### `module.registerHooks()` で受け入れられる同期フック {#synchronous-hooks-accepted-by-moduleregisterhooks}

**追加: v23.5.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

`module.registerHooks()` メソッドは、同期フック関数を受け入れます。フックの実装者は `module.registerHooks()` を呼び出す直前に初期化コードを直接実行できるため、`initialize()` はサポートされておらず、必要ありません。

```js [ESM]
function resolve(specifier, context, nextResolve) {
  // `import` または `require` の specifier を受け取り、URL に解決します。
}

function load(url, context, nextLoad) {
  // 解決された URL を受け取り、評価されるソースコードを返します。
}
```
同期フックは、モジュールがロードされるのと同じスレッドと [realm](https://tc39.es/ecma262/#realm) で実行されます。非同期フックとは異なり、デフォルトでは子 worker スレッドに継承されませんが、フックが [`--import`](/ja/nodejs/api/cli#--importmodule) または [`--require`](/ja/nodejs/api/cli#-r---require-module) によってプリロードされたファイルを使用して登録されている場合、子 worker スレッドは `process.execArgv` の継承を通じてプリロードされたスクリプトを継承できます。詳細は [`Worker` のドキュメント](/ja/nodejs/api/worker_threads#new-workerfilename-options) を参照してください。

同期フックでは、ユーザーはモジュールコードで `console.log()` が完了することを期待するのと同じように、`console.log()` が完了することを期待できます。

#### フックの規約 {#conventions-of-hooks}

フックは [チェーン](/ja/nodejs/api/module#chaining) の一部です。たとえそのチェーンが 1 つのカスタム（ユーザー提供）フックと常に存在するデフォルトフックのみで構成されていたとしてもです。フック関数はネストされます。それぞれの関数は常にプレーンなオブジェクトを返し、チェインは各関数が `next\<hookName\>()` を呼び出すことによって発生します。これは、後続のローダーのフックへの参照 (LIFO 順) です。

必須プロパティを欠いている値を返すフックは、例外をトリガーします。`next\<hookName\>()` を呼び出さずに、*かつ* `shortCircuit: true` を返さずに戻るフックも、例外をトリガーします。これらのエラーは、チェーンの意図しない中断を防ぐのに役立ちます。チェーンを意図的に自分のフックで終了させる場合は、フックから `shortCircuit: true` を返してください。


#### `initialize()` {#initialize}

**追加:** v20.6.0, v18.19.0

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定版: 1](/ja/nodejs/api/documentation#stability-index).2 - リリース候補
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `register(loader, import.meta.url, { data })` からのデータ。

`initialize` フックは、[`register`](/ja/nodejs/api/module#moduleregisterspecifier-parenturl-options) によってのみ受け入れられます。同期フックの初期化は `registerHooks()` の呼び出しの直前に直接実行できるため、`registerHooks()` はサポートも必要としません。

`initialize` フックは、フックモジュールの初期化時にフックのスレッドで実行されるカスタム関数を定義する方法を提供します。初期化は、フックモジュールが [`register`](/ja/nodejs/api/module#moduleregisterspecifier-parenturl-options) を介して登録されるときに発生します。

このフックは、ポートやその他の転送可能なオブジェクトなど、[`register`](/ja/nodejs/api/module#moduleregisterspecifier-parenturl-options) の呼び出しからデータを受け取ることができます。`initialize` の戻り値は、[\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) にすることができます。その場合、メインアプリケーションスレッドの実行が再開される前に待機されます。

モジュールカスタマイズコード:

```js [ESM]
// path-to-my-hooks.js

export async function initialize({ number, port }) {
  port.postMessage(`increment: ${number + 1}`);
}
```
呼び出し元のコード:



::: code-group
```js [ESM]
import assert from 'node:assert';
import { register } from 'node:module';
import { MessageChannel } from 'node:worker_threads';

// この例では、`port2` を `initialize` フックに送信することで、メッセージチャネルを使用して、メイン (アプリケーション) スレッドとフックスレッドで実行されているフックの間で通信する方法を示します。
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

// この例では、`port2` を `initialize` フックに送信することで、メッセージチャネルを使用して、メイン (アプリケーション) スレッドとフックスレッドで実行されているフックの間で通信する方法を示します。
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

::: info [History]
| Version | Changes |
| --- | --- |
| v23.5.0 | 同期およびインスレッドフックのサポートを追加しました。 |
| v21.0.0, v20.10.0, v18.19.0 | プロパティ`context.importAssertions`が`context.importAttributes`に置き換えられました。古い名前の使用も引き続きサポートされ、実験的な警告が表示されます。 |
| v18.6.0, v16.17.0 | resolveフックの連鎖のサポートを追加しました。各フックは、`nextResolve()`を呼び出すか、返り値に`shortCircuit`プロパティを`true`に設定する必要があります。 |
| v17.1.0, v16.14.0 | import assertionsのサポートを追加しました。 |
:::

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index).2 - リリース候補（非同期バージョン）Stability: 1.1 - アクティブな開発（同期バージョン）
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `conditions` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 関連する`package.json`のエクスポート条件
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) インポートするモジュールの属性を表すキーと値のペアのオブジェクト
    - `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) これをインポートするモジュール。Node.jsのエントリーポイントの場合はundefined
  
 
- `nextResolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) チェーン内の後続の`resolve`フック、または最後のユーザー指定の`resolve`フックの後のNode.jsのデフォルトの`resolve`フック
    - `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 
- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 非同期バージョンは、次のプロパティを含むオブジェクト、またはそのようなオブジェクトに解決される`Promise`のいずれかを受け取ります。同期バージョンは、同期的に返されるオブジェクトのみを受け入れます。
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) loadフックへのヒント（無視される可能性があります） `'builtin' | 'commonjs' | 'json' | 'module' | 'wasm'`
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) モジュールをキャッシュするときに使用するインポート属性（オプション; 除外された場合、入力が使用されます）
    - `shortCircuit` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) このフックが`resolve`フックのチェーンを終了させる意図があるというシグナル。 **Default:** `false`
    - `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) この入力が解決される絶対URL
  
 

`resolve`フックチェーンは、Node.jsに特定の`import`ステートメントまたは式、あるいは`require`呼び出しをどこで見つけてどのようにキャッシュするかを指示する役割を担います。オプションで、`load`フックへのヒントとしてフォーマット（`'module'`など）を返すことができます。フォーマットが指定されている場合、`load`フックは最終的な`format`値を提供する責任を負います（そして、`resolve`によって提供されたヒントを自由に無視できます）。`resolve`が`format`を提供する場合は、値をNode.jsのデフォルトの`load`フックに渡すだけの場合でも、カスタム`load`フックが必要です。

インポートタイプの属性は、ロードされたモジュールを内部モジュールキャッシュに保存するためのキャッシュキーの一部です。`resolve`フックは、モジュールをソースコードに存在する属性とは異なる属性でキャッシュする必要がある場合に、`importAttributes`オブジェクトを返す責任を負います。

`context`の`conditions`プロパティは、この解決要求の[package exports conditions](/ja/nodejs/api/packages#conditional-exports)に一致するために使用される条件の配列です。これらは、他の場所で条件付きマッピングを検索したり、デフォルトの解決ロジックを呼び出すときにリストを変更したりするために使用できます。

現在の[package exports conditions](/ja/nodejs/api/packages#conditional-exports)は、常にフックに渡される`context.conditions`配列にあります。`defaultResolve`を呼び出すときに*デフォルトのNode.jsモジュール指定子解決動作*を保証するには、それに渡される`context.conditions`配列に、元々`resolve`フックに渡された`context.conditions`配列の*すべての*要素が含まれている*必要があります*。

```js [ESM]
// module.register() で受け入れられる非同期バージョン。
export async function resolve(specifier, context, nextResolve) {
  const { parentURL = null } = context;

  if (Math.random() > 0.5) { // 何らかの条件。
    // 一部のまたはすべての指定子について、解決するためのカスタムロジックを実行します。
    // 常に {url: <string>} 形式のオブジェクトを返します。
    return {
      shortCircuit: true,
      url: parentURL ?
        new URL(specifier, parentURL).href :
        new URL(specifier).href,
    };
  }

  if (Math.random() < 0.5) { // 別の条件。
    // `defaultResolve`を呼び出すとき、引数を変更できます。 この場合、
    // 条件付きエクスポートを照合するための別の値を追加しています。
    return nextResolve(specifier, {
      ...context,
      conditions: [...context.conditions, 'another-condition'],
    });
  }

  // チェーン内の次のフックに委ねます。これは、これが最後のユーザー指定の
  // ローダーである場合、Node.jsのデフォルトの解決になります。
  return nextResolve(specifier);
}
```
```js [ESM]
// module.registerHooks() で受け入れられる同期バージョン。
function resolve(specifier, context, nextResolve) {
  // 上記の非同期の resolve() と同様です。非同期ロジックがないためです。
}
```

#### `load(url, context, nextLoad)` {#loadurl-context-nextload}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.5.0 | 同期およびインスレッドバージョンのサポートを追加。 |
| v20.6.0 | `commonjs`形式の`source`のサポートを追加。 |
| v18.6.0, v16.17.0 | loadフックのチェーンのサポートを追加。各フックは、`nextLoad()`を呼び出すか、返り値に`shortCircuit`プロパティを`true`に設定して含める必要があります。 |
:::

::: warning [安定版: 1 - 実験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index).2 - リリース候補 (非同期バージョン) 安定度: 1.1 - アクティブ開発 (同期バージョン)
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `resolve`チェーンによって返されるURL
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `conditions` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 関連する`package.json`のエクスポート条件
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `resolve`フックチェーンによってオプションで提供される形式
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 
- `nextLoad` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) チェーン内の後続の`load`フック、または最後のユーザー提供の`load`フック後のNode.jsのデフォルト`load`フック
    - `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 
- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 非同期バージョンは、以下のプロパティを含むオブジェクト、またはそのようなオブジェクトに解決される`Promise`のいずれかを受け取ります。同期バージョンは、同期的に返されたオブジェクトのみを受け入れます。
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `shortCircuit` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) このフックが`load`フックのチェーンを終了させる意図があることを示すシグナル。**デフォルト:** `false`
    - `source` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) Node.jsが評価するソース
  
 

`load`フックは、URLをどのように解釈、取得、および解析するかを決定するためのカスタムメソッドを定義する方法を提供します。また、インポート属性を検証する役割も担っています。

`format`の最終的な値は、次のいずれかである必要があります。

| `format` | 説明 | `load`によって返される`source`に対して許容される型 |
| --- | --- | --- |
| `'builtin'` | Node.js組み込みモジュールをロードする | 該当なし |
| `'commonjs'` | Node.js CommonJSモジュールをロードする | {   [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)  ,   [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)  ,   [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)  ,   `null`  ,   `undefined`   } |
| `'json'` | JSONファイルをロードする | {   [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)  ,   [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)  ,   [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)   } |
| `'module'` | ESモジュールをロードする | {   [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)  ,   [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)  ,   [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)   } |
| `'wasm'` | WebAssemblyモジュールをロードする | {   [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)  ,   [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)   } |
`source`の値は`'builtin'`型では無視されます。これは現在、Node.js組み込み（コア）モジュールの値を置き換えることができないためです。


##### 非同期 `load` フックにおける注意点 {#caveat-in-the-asynchronous-load-hook}

非同期 `load` フックを使用する場合、`'commonjs'` に対して `source` を省略するか提供するかで、非常に異なる影響があります。

- `source` が提供される場合、このモジュールからのすべての `require` 呼び出しは、登録された `resolve` および `load` フックを持つ ESM ローダーによって処理されます。このモジュールからのすべての `require.resolve` 呼び出しは、登録された `resolve` フックを持つ ESM ローダーによって処理されます。CommonJS API のサブセットのみが利用可能になり（例：`require.extensions`、`require.cache`、`require.resolve.paths` は利用不可）、CommonJS モジュールローダーに対するモンキーパッチは適用されません。
- `source` が未定義または `null` の場合、CommonJS モジュールローダーによって処理され、`require`/`require.resolve` 呼び出しは登録されたフックを経由しません。`null` 値の `source` に対するこの挙動は一時的なものです — 将来的には、`null` 値の `source` はサポートされません。

これらの注意点は同期 `load` フックには適用されません。その場合、カスタマイズされた CommonJS モジュールで利用可能な CommonJS API の完全なセットが提供され、`require`/`require.resolve` は常に登録されたフックを経由します。

Node.js の内部非同期 `load` 実装は、`load` チェーンの最後のフックの `next` の値であり、下位互換性のために `format` が `'commonjs'` の場合、`source` に対して `null` を返します。非デフォルトの動作を使用することを選択するフックの例を以下に示します。

```js [ESM]
import { readFile } from 'node:fs/promises';

// module.register() によって受け入れられる非同期バージョン。この修正は
// module.registerSync() によって受け入れられる同期バージョンには必要ありません。
export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (result.format === 'commonjs') {
    result.source ??= await readFile(new URL(result.responseURL ?? url));
  }
  return result;
}
```
これも同期 `load` フックには適用されません。その場合、返される `source` には、モジュール形式に関係なく、次のフックによってロードされたソースコードが含まれます。

- 特定の [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) オブジェクトは [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) です。
- 特定の [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) オブジェクトは [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) です。

テキストベースの形式（つまり、`'json'`、`'module'`）のソース値が文字列でない場合、[`util.TextDecoder`](/ja/nodejs/api/util#class-utiltextdecoder) を使用して文字列に変換されます。

`load` フックは、解決された URL のソースコードを取得するためのカスタムメソッドを定義する方法を提供します。これにより、ローダーはディスクからファイルを読み取ることを回避できる可能性があります。また、認識されない形式をサポートされている形式にマッピングするためにも使用できます。たとえば、`yaml` から `module` などです。

```js [ESM]
// module.register() によって受け入れられる非同期バージョン。
export async function load(url, context, nextLoad) {
  const { format } = context;

  if (Math.random() > 0.5) { // 何らかの条件
    /*
      一部またはすべての URL について、ソースを取得するためのカスタムロジックを実行します。
      常に次の形式のオブジェクトを返します。
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

  // チェーン内の次のフックに委ねます。
  return nextLoad(url);
}
```
```js [ESM]
// module.registerHooks() によって受け入れられる同期バージョン。
function load(url, context, nextLoad) {
  // 上記の非同期 load() と同様です。非同期ロジックが含まれていないためです。
}
```
より高度なシナリオでは、これをサポートされていないソースをサポートされているソースに変換するためにも使用できます（下記の [例](/ja/nodejs/api/module#examples) を参照）。


### 例 {#examples}

さまざまなモジュールのカスタマイズフックを一緒に使用して、Node.js のコードのロードと評価の動作を広範囲にカスタマイズできます。

#### HTTPS からのインポート {#import-from-https}

以下のフックは、そのような指定子に対する基本的なサポートを有効にするフックを登録します。これは Node.js のコア機能の大幅な改善のように見えるかもしれませんが、実際にこれらのフックを使用することには大きな欠点があります。パフォーマンスはディスクからファイルをロードするよりもはるかに遅く、キャッシュがなく、セキュリティもありません。

```js [ESM]
// https-hooks.mjs
import { get } from 'node:https';

export function load(url, context, nextLoad) {
  // ネットワーク経由でロードされる JavaScript の場合、フェッチして返す必要があります。
  if (url.startsWith('https://')) {
    return new Promise((resolve, reject) => {
      get(url, (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({
          // この例では、ネットワークから提供されるすべての JavaScript が ES モジュールコードであると想定しています。
          format: 'module',
          shortCircuit: true,
          source: data,
        }));
      }).on('error', (err) => reject(err));
    });
  }

  // 他のすべての URL は Node.js に処理させます。
  return nextLoad(url);
}
```
```js [ESM]
// main.mjs
import { VERSION } from 'https://coffeescript.org/browser-compiler-modern/coffeescript.js';

console.log(VERSION);
```
上記のフックモジュールを使用すると、`node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./https-hooks.mjs"));' ./main.mjs` を実行すると、`main.mjs` の URL にあるモジュールごとの CoffeeScript の現在のバージョンが出力されます。

#### トランスパイル {#transpilation}

Node.js が理解できない形式のソースは、[`load` フック](/ja/nodejs/api/module#loadurl-context-nextload) を使用して JavaScript に変換できます。

これは、Node.js を実行する前にソースファイルをトランスパイルするよりもパフォーマンスが低くなります。トランスパイラーフックは、開発およびテスト目的でのみ使用してください。


##### 非同期バージョン {#asynchronous-version}

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
    // CoffeeScriptファイルはCommonJSまたはESモジュールのいずれかである可能性があるため、
    // 任意のCoffeeScriptファイルが、同じ場所にある.jsファイルと同じようにNode.jsによって
    // 扱われるようにする必要があります。 Node.jsが任意の.jsファイルをどのように解釈するかを
    // 判断するには、ファイルシステムを検索して、最も近い親package.jsonファイルを見つけ、
    // その「type」フィールドを読み取ります。
    const format = await getPackageType(url);

    const { source: rawSource } = await nextLoad(url, { ...context, format });
    // このフックは、インポートされたすべてのCoffeeScriptファイルのCoffeeScriptソースコードを
    // JavaScriptソースコードに変換します。
    const transformedSource = coffeescript.compile(rawSource.toString(), url);

    return {
      format,
      shortCircuit: true,
      source: transformedSource,
    };
  }

  // 他のすべてのURLはNode.jsに処理させます。
  return nextLoad(url);
}

async function getPackageType(url) {
  // `url`は、load()フックから解決されたurlを渡された最初のイテレーションの間のみ、ファイルパスです
  // load()からの実際のファイルパスには、仕様で必須であるファイル拡張子が含まれます
  // `url`にファイル拡張子が含まれているかどうかに関するこの単純な真偽値チェックは、
  // ほとんどのプロジェクトで機能しますが、いくつかのエッジケース（拡張子のないファイルや末尾にスペースがあるurlなど）はカバーしていません。
  const isFilePath = !!extname(url);
  // ファイルパスの場合は、それが含まれているディレクトリを取得します
  const dir = isFilePath ?
    dirname(fileURLToPath(url)) :
    url;
  // 同じディレクトリにあるpackage.jsonへのファイルパスを作成します。
  // これは存在する場合と存在しない場合があります
  const packagePath = resolvePath(dir, 'package.json');
  // 存在する可能性のないpackage.jsonを読み取ろうとします
  const type = await readFile(packagePath, { encoding: 'utf8' })
    .then((filestring) => JSON.parse(filestring).type)
    .catch((err) => {
      if (err?.code !== 'ENOENT') console.error(err);
    });
  // package.jsonが存在し、値を持つ`type`フィールドが含まれている場合、はい、そうです
  if (type) return type;
  // それ以外の場合、（ルートにない場合は）次の上位ディレクトリのチェックを続行します
  // ルートにある場合は、停止してfalseを返します
  return dir.length > 1 && getPackageType(resolvePath(dir, '..'));
}
```

##### 同期バージョン {#synchronous-version}

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
#### フックの実行 {#running-hooks}

```coffee [COFFEECRIPT]
# main.coffee {#maincoffee}
import { scream } from './scream.coffee'
console.log scream 'hello, world'

import { version } from 'node:process'
console.log "Node.js バージョン #{version} がお届けします"
```
```coffee [COFFEECRIPT]
# scream.coffee {#screamcoffee}
export scream = (str) -> str.toUpperCase()
```
上記のフックモジュールを使用すると、`node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./coffeescript-hooks.mjs"));' ./main.coffee` または `node --import ./coffeescript-sync-hooks.mjs ./main.coffee` を実行すると、`main.coffee` は、そのソースコードがディスクからロードされた後、Node.js がそれを実行する前に JavaScript に変換されます。また、ロードされたファイルの `import` ステートメントを介して参照される `.coffee`、`.litcoffee`、または `.coffee.md` ファイルについても同様です。


#### インポートマップ {#import-maps}

前の2つの例では、`load`フックを定義しました。これは`resolve`フックの例です。このフックモジュールは、どの指定子を他のURLに上書きするかを定義する`import-map.json`ファイルを読み取ります（これは、「インポートマップ」仕様の小さなサブセットの非常に単純な実装です）。

##### 非同期バージョン {#asynchronous-version_1}

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
##### 同期バージョン {#synchronous-version_1}

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
##### フックの使用 {#using-the-hooks}

これらのファイルを使用します。

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
`node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./import-map-hooks.js"));' main.js` または `node --import ./import-map-sync-hooks.js main.js` を実行すると、`some module!` が出力されるはずです。

## Source map v3 サポート {#source-map-v3-support}

**Added in: v13.7.0, v12.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - Experimental
:::

ソースマップキャッシュとやり取りするためのヘルパー。このキャッシュは、ソースマップ解析が有効になっていて、モジュールのフッターに[ソースマップインクルードディレクティブ](https://sourcemaps.info/spec#h.lmz475t4mvbx)が見つかった場合に作成されます。

ソースマップ解析を有効にするには、Node.jsをフラグ[`--enable-source-maps`](/ja/nodejs/api/cli#--enable-source-maps)、または[`NODE_V8_COVERAGE=dir`](/ja/nodejs/api/cli#node_v8_coveragedir)を設定してコードカバレッジを有効にして実行する必要があります。



::: code-group
```js [ESM]
// module.mjs
// In an ECMAScript module
import { findSourceMap, SourceMap } from 'node:module';
```

```js [CJS]
// module.cjs
// In a CommonJS module
const { findSourceMap, SourceMap } = require('node:module');
```
:::


### `module.findSourceMap(path)` {#modulefindsourcemappath}

**追加:** v13.7.0, v12.17.0

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<module.SourceMap\>](/ja/nodejs/api/module#class-modulesourcemap) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) ソースマップが見つかった場合は `module.SourceMap` を、そうでない場合は `undefined` を返します。

`path` は、対応するソースマップを取得するファイルの解決済みのパスです。

### Class: `module.SourceMap` {#class-modulesourcemap}

**追加:** v13.7.0, v12.17.0

#### `new SourceMap(payload[, { lineLengths }])` {#new-sourcemappayload-{-linelengths-}}

- `payload` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `lineLengths` [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

新しい `sourceMap` インスタンスを作成します。

`payload` は、[Source map v3 フォーマット](https://sourcemaps.info/spec#h.mofvlxcwqzej) に一致するキーを持つオブジェクトです:

- `file`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `version`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `sources`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `sourcesContent`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `names`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `mappings`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `sourceRoot`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`lineLengths` は、生成されたコードの各行の長さのオプションの配列です。

#### `sourceMap.payload` {#sourcemappayload}

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[`SourceMap`](/ja/nodejs/api/module#class-modulesourcemap) インスタンスの構築に使用されたペイロードのゲッター。


#### `sourceMap.findEntry(lineOffset, columnOffset)` {#sourcemapfindentrylineoffset-columnoffset}

- `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 生成されたソースにおけるゼロから始まる行番号オフセット
- `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 生成されたソースにおけるゼロから始まる列番号オフセット
- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

生成されたソースファイル内の行オフセットと列オフセットを指定すると、見つかった場合は元のファイル内のSourceMap範囲を表すオブジェクトを返し、見つからない場合は空のオブジェクトを返します。

返されるオブジェクトには、次のキーが含まれています。

- generatedLine: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 生成されたソース内の範囲の開始行オフセット
- generatedColumn: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 生成されたソース内の範囲の開始列オフセット
- originalSource: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) SourceMapで報告されている元のソースのファイル名
- originalLine: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 元のソース内の範囲の開始行オフセット
- originalColumn: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 元のソース内の範囲の開始列オフセット
- name: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

返される値は、エラーメッセージとCallSiteオブジェクトに表示される1から始まる行番号と列番号*ではなく*、ゼロから始まるオフセットに基づいて、SourceMapに表示される生の範囲を表します。

ErrorスタックとCallSiteオブジェクトによって報告されるlineNumberとcolumnNumberから対応する1から始まる行番号と列番号を取得するには、`sourceMap.findOrigin(lineNumber, columnNumber)`を使用します。


#### `sourceMap.findOrigin(lineNumber, columnNumber)` {#sourcemapfindoriginlinenumber-columnnumber}

- `lineNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 生成されたソースの呼び出し元の 1 から始まる行番号
- `columnNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 生成されたソースの呼び出し元の 1 から始まる列番号
- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

生成されたソースの呼び出し元の 1 から始まる `lineNumber` と `columnNumber` が与えられた場合、元のソースに対応する呼び出し元の場所を見つけます。

指定された `lineNumber` と `columnNumber` がどのソースマップにも見つからない場合、空のオブジェクトが返されます。それ以外の場合、返されるオブジェクトには次のキーが含まれています。

- name: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) ソースマップで提供されている範囲の名前（提供されている場合）
- fileName: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) SourceMap で報告されている元のソースのファイル名
- lineNumber: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 元のソースの対応する呼び出し元の 1 から始まる lineNumber
- columnNumber: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 元のソースの対応する呼び出し元の 1 から始まる columnNumber

