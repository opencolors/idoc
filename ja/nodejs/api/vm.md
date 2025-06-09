---
title: Node.js VMモジュールのドキュメント
description: Node.jsのVM（仮想マシン）モジュールは、V8 JavaScriptエンジンのコンテキスト内でコードをコンパイルおよび実行するためのAPIを提供します。これにより、隔離されたJavaScript環境の作成、サンドボックス化されたコードの実行、およびスクリプトコンテキストの管理が可能です。
head:
  - - meta
    - name: og:title
      content: Node.js VMモジュールのドキュメント | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのVM（仮想マシン）モジュールは、V8 JavaScriptエンジンのコンテキスト内でコードをコンパイルおよび実行するためのAPIを提供します。これにより、隔離されたJavaScript環境の作成、サンドボックス化されたコードの実行、およびスクリプトコンテキストの管理が可能です。
  - - meta
    - name: twitter:title
      content: Node.js VMモジュールのドキュメント | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのVM（仮想マシン）モジュールは、V8 JavaScriptエンジンのコンテキスト内でコードをコンパイルおよび実行するためのAPIを提供します。これにより、隔離されたJavaScript環境の作成、サンドボックス化されたコードの実行、およびスクリプトコンテキストの管理が可能です。
---


# VM (JavaScript の実行) {#vm-executing-javascript}

::: tip [Stable: 2 - 安定]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [安定度: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/vm.js](https://github.com/nodejs/node/blob/v23.5.0/lib/vm.js)

`node:vm` モジュールは、V8 仮想マシンのコンテキスト内でコードをコンパイルして実行することを可能にします。

**<code>node:vm</code> モジュールはセキュリティ機構ではありません。信頼できないコードを実行するために使用しないでください。**

JavaScript コードは、即座にコンパイルして実行することも、コンパイル、保存して後で実行することもできます。

一般的なユースケースは、異なる V8 コンテキストでコードを実行することです。これは、呼び出されたコードが、呼び出し元のコードとは異なるグローバルオブジェクトを持つことを意味します。

オブジェクトを [*コンテキスト化*](/ja/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) することで、コンテキストを提供できます。呼び出されたコードは、コンテキスト内の任意のプロパティをグローバル変数のように扱います。呼び出されたコードによって引き起こされたグローバル変数への変更は、コンテキストオブジェクトに反映されます。

```js [ESM]
const vm = require('node:vm');

const x = 1;

const context = { x: 2 };
vm.createContext(context); // オブジェクトをコンテキスト化します。

const code = 'x += 40; var y = 17;';
// `x` と `y` はコンテキスト内のグローバル変数です。
// 最初、x は context.x の値である 2 を持ちます。
vm.runInContext(code, context);

console.log(context.x); // 42
console.log(context.y); // 17

console.log(x); // 1; y は定義されていません。
```
## クラス: `vm.Script` {#class-vmscript}

**追加:** v0.3.1

`vm.Script` クラスのインスタンスは、特定のコンテキストで実行できるプリコンパイルされたスクリプトを含みます。

### `new vm.Script(code[, options])` {#new-vmscriptcode-options}


::: info [履歴]
| バージョン | 変更 |
|---|---|
| v21.7.0, v20.12.0 | `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` のサポートを追加。 |
| v17.0.0, v16.12.0 | `importModuleDynamically` パラメータへの import 属性のサポートを追加。 |
| v10.6.0 | `produceCachedData` は `script.createCachedData()` に賛成して非推奨になりました。 |
| v5.7.0 | `cachedData` と `produceCachedData` オプションがサポートされるようになりました。 |
| v0.3.1 | 追加: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) コンパイルする JavaScript コード。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) このスクリプトによって生成されるスタックトレースで使用されるファイル名を指定します。**デフォルト:** `'evalmachine.\<anonymous\>'`。
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) このスクリプトによって生成されるスタックトレースに表示される行番号オフセットを指定します。**デフォルト:** `0`。
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) このスクリプトによって生成されるスタックトレースに表示される最初の行の列番号オフセットを指定します。**デフォルト:** `0`。
    - `cachedData` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 指定されたソースに対する V8 のコードキャッシュデータを持つオプションの `Buffer` または `TypedArray`、または `DataView` を提供します。指定された場合、`cachedDataRejected` の値は、V8 によるデータの受け入れに応じて `true` または `false` に設定されます。
    - `produceCachedData` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` で `cachedData` が存在しない場合、V8 は `code` のコードキャッシュデータの生成を試みます。成功すると、V8 のコードキャッシュデータを持つ `Buffer` が生成され、返された `vm.Script` インスタンスの `cachedData` プロパティに保存されます。`cachedDataProduced` の値は、コードキャッシュデータが正常に生成されたかどうかに応じて、`true` または `false` に設定されます。このオプションは、`script.createCachedData()` に賛成して **非推奨** になりました。**デフォルト:** `false`。
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/ja/nodejs/api/vm#vmconstantsuse_main_context_default_loader) `import()` が呼び出されたときに、このスクリプトの評価中にモジュールをどのようにロードするかを指定するために使用されます。このオプションは、実験的なモジュール API の一部です。本番環境での使用はお勧めしません。詳細については、[コンパイル API での動的な `import()` のサポート](/ja/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis) を参照してください。

 

`options` が文字列の場合、それはファイル名を指定します。

新しい `vm.Script` オブジェクトを作成すると、`code` がコンパイルされますが、実行はされません。コンパイルされた `vm.Script` は、後で複数回実行できます。`code` はどのグローバルオブジェクトにもバインドされません。むしろ、実行のたびに、その実行のためだけにバインドされます。


### `script.cachedDataRejected` {#scriptcacheddatarejected}

**追加: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`cachedData` が `vm.Script` の作成に提供されると、この値は V8 によるデータの受け入れに応じて `true` または `false` に設定されます。 それ以外の場合、値は `undefined` です。

### `script.createCachedData()` {#scriptcreatecacheddata}

**追加: v10.6.0**

- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

`Script` コンストラクタの `cachedData` オプションで使用できるコードキャッシュを作成します。 `Buffer` を返します。 このメソッドはいつでも、何度でも呼び出すことができます。

`Script` のコードキャッシュには、JavaScript で観測可能な状態は含まれていません。 コードキャッシュは、スクリプトソースと一緒に保存し、新しい `Script` インスタンスを複数回構築するために使用しても安全です。

`Script` ソース内の関数は、遅延コンパイルとしてマークすることができ、`Script` の構築時にはコンパイルされません。 これらの関数は、最初に呼び出されたときにコンパイルされます。 コードキャッシュは、V8 が現在 `Script` について知っているメタデータをシリアライズし、将来のコンパイルを高速化するために使用できます。

```js [ESM]
const script = new vm.Script(`
function add(a, b) {
  return a + b;
}

const x = add(1, 2);
`);

const cacheWithoutAdd = script.createCachedData();
// `cacheWithoutAdd` では、関数 `add()` は呼び出し時に完全にコンパイルされるようにマークされています。

script.runInThisContext();

const cacheWithAdd = script.createCachedData();
// `cacheWithAdd` には、完全にコンパイルされた関数 `add()` が含まれています。
```
### `script.runInContext(contextifiedObject[, options])` {#scriptrunincontextcontextifiedobject-options}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v6.3.0 | `breakOnSigint` オプションがサポートされるようになりました。 |
| v0.3.1 | 追加: v0.3.1 |
:::

- `contextifiedObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `vm.createContext()` メソッドによって返される [contextified](/ja/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) オブジェクト。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`code` のコンパイル中に [`Error`](/ja/nodejs/api/errors#class-error) が発生すると、エラーの原因となったコード行がスタックトレースに追加されます。 **デフォルト:** `true`。
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 実行を終了する前に `code` を実行するミリ秒数を指定します。 実行が終了した場合、[`Error`](/ja/nodejs/api/errors#class-error) がスローされます。 この値は厳密に正の整数である必要があります。
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`SIGINT` (+) を受信すると実行が終了し、[`Error`](/ja/nodejs/api/errors#class-error) がスローされます。 `process.on('SIGINT')` を介してアタッチされたイベントの既存のハンドラーは、スクリプトの実行中は無効になりますが、その後も引き続き機能します。 **デフォルト:** `false`。
  
 
- 戻り値: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) スクリプトで最後に実行されたステートメントの結果。

`vm.Script` オブジェクトに含まれるコンパイルされたコードを、指定された `contextifiedObject` 内で実行し、結果を返します。 コードの実行はローカルスコープにアクセスできません。

次の例では、グローバル変数をインクリメントし、別のグローバル変数の値を設定してから、コードを複数回実行するコードをコンパイルします。 グローバル変数は `context` オブジェクトに含まれています。

```js [ESM]
const vm = require('node:vm');

const context = {
  animal: 'cat',
  count: 2,
};

const script = new vm.Script('count += 1; name = "kitty";');

vm.createContext(context);
for (let i = 0; i < 10; ++i) {
  script.runInContext(context);
}

console.log(context);
// Prints: { animal: 'cat', count: 12, name: 'kitty' }
```
`timeout` または `breakOnSigint` オプションを使用すると、新しいイベントループと対応するスレッドが開始され、パフォーマンスのオーバーヘッドが発生します。


### `script.runInNewContext([contextObject[, options]])` {#scriptruninnewcontextcontextobject-options}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.8.0, v20.18.0 | `contextObject` 引数は `vm.constants.DONT_CONTEXTIFY` を受け入れるようになりました。 |
| v14.6.0 | `microtaskMode` オプションがサポートされるようになりました。 |
| v10.0.0 | `contextCodeGeneration` オプションがサポートされるようになりました。 |
| v6.3.0 | `breakOnSigint` オプションがサポートされるようになりました。 |
| v0.3.1 | Added in: v0.3.1 |
:::

- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/ja/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [`vm.constants.DONT_CONTEXTIFY`](/ja/nodejs/api/vm#vmconstantsdont_contextify) か、[コンテキスト化](/ja/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)されるオブジェクト。 `undefined` の場合、後方互換性のために空のコンテキスト化されたオブジェクトが作成されます。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`code` のコンパイル中に [`Error`](/ja/nodejs/api/errors#class-error) が発生すると、エラーの原因となったコード行がスタックトレースに添付されます。 **デフォルト:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 実行を終了するまでに `code` を実行するミリ秒数を指定します。 実行が終了した場合、[`Error`](/ja/nodejs/api/errors#class-error) がスローされます。 この値は厳密に正の整数である必要があります。
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`SIGINT` (+) を受信すると実行が終了し、[`Error`](/ja/nodejs/api/errors#class-error) がスローされます。 `process.on('SIGINT')` を介してアタッチされたイベントの既存のハンドラは、スクリプトの実行中は無効になりますが、その後も引き続き動作します。 **デフォルト:** `false`.
    - `contextName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 新しく作成されたコンテキストの人間が読める名前。 **デフォルト:** `'VM Context i'`。ここで `i` は、作成されたコンテキストの昇順の数値インデックスです。
    - `contextOrigin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 表示を目的として新しく作成されたコンテキストに対応する [オリジン](https://developer.mozilla.org/en-US/docs/Glossary/Origin)。 オリジンは URL のようにフォーマットする必要がありますが、スキーム、ホスト、ポートのみを含みます（必要な場合）。[`URL`](/ja/nodejs/api/url#class-url) オブジェクトの [`url.origin`](/ja/nodejs/api/url#urlorigin) プロパティの値のように。 最も注目すべきことは、この文字列は末尾のスラッシュを省略する必要があるということです。それはパスを示すからです。 **デフォルト:** `''`.
    - `contextCodeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) false に設定すると、`eval` または関数コンストラクター (`Function`、`GeneratorFunction` など) への呼び出しはすべて `EvalError` をスローします。 **デフォルト:** `true`.
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) false に設定すると、WebAssembly モジュールをコンパイルしようとすると `WebAssembly.CompileError` がスローされます。 **デフォルト:** `true`.


    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `afterEvaluate` に設定すると、マイクロタスク (`Promise` と `async function` を通じてスケジュールされたタスク) は、スクリプトの実行直後に実行されます。 その場合、それらは `timeout` と `breakOnSigint` スコープに含まれます。


- 戻り値: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) スクリプトで実行された最後のステートメントの結果。

このメソッドは `script.runInContext(vm.createContext(options), options)` へのショートカットです。 これは一度にいくつかのことを行います:

次の例は、グローバル変数を設定するコードをコンパイルし、次に異なるコンテキストでコードを複数回実行します。 グローバル変数は、個々の `context` 上に設定され、その中に含まれます。

```js [ESM]
const vm = require('node:vm');

const script = new vm.Script('globalVar = "set"');

const contexts = [{}, {}, {}];
contexts.forEach((context) => {
  script.runInNewContext(context);
});

console.log(contexts);
// Prints: [{ globalVar: 'set' }, { globalVar: 'set' }, { globalVar: 'set' }]

// これは、コンテキスト化されたオブジェクトからコンテキストが作成された場合にスローされます。
// vm.constants.DONT_CONTEXTIFY を使用すると、通常のグローバルオブジェクトを使用してコンテキストを作成できます。
// グローバルオブジェクトは凍結できます。
const freezeScript = new vm.Script('Object.freeze(globalThis); globalThis;');
const frozenContext = freezeScript.runInNewContext(vm.constants.DONT_CONTEXTIFY);
```

### `script.runInThisContext([options])` {#scriptruninthiscontextoptions}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v6.3.0 | `breakOnSigint` オプションがサポートされるようになりました。 |
| v0.3.1 | 追加: v0.3.1 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`code` のコンパイル中に [`Error`](/ja/nodejs/api/errors#class-error) が発生すると、エラーの原因となったコード行がスタックトレースに付加されます。**デフォルト:** `true`。
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 実行を終了するまでに `code` を実行するミリ秒数を指定します。実行が終了した場合、[`Error`](/ja/nodejs/api/errors#class-error) がスローされます。この値は厳密に正の整数でなければなりません。
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`SIGINT` (+) を受信すると実行が終了し、[`Error`](/ja/nodejs/api/errors#class-error) がスローされます。`process.on('SIGINT')` を介してアタッチされたイベントの既存のハンドラは、スクリプトの実行中は無効になりますが、その後も動作し続けます。**デフォルト:** `false`。
  
 
- 戻り値: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) スクリプト内で実行された最後のステートメントの結果。

`vm.Script` に含まれるコンパイル済みコードを、現在の `global` オブジェクトのコンテキスト内で実行します。コードの実行はローカルスコープにはアクセスできませんが、現在の `global` オブジェクトにはアクセス *できます*。

次の例は、`global` 変数をインクリメントするコードをコンパイルし、そのコードを複数回実行します。

```js [ESM]
const vm = require('node:vm');

global.globalVar = 0;

const script = new vm.Script('globalVar += 1', { filename: 'myfile.vm' });

for (let i = 0; i < 1000; ++i) {
  script.runInThisContext();
}

console.log(globalVar);

// 1000
```

### `script.sourceMapURL` {#scriptsourcemapurl}

**追加:** v19.1.0, v18.13.0

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

スクリプトがソースマップマジックコメントを含むソースからコンパイルされるとき、このプロパティはソースマップのURLに設定されます。

::: code-group
```js [ESM]
import vm from 'node:vm';

const script = new vm.Script(`
function myFunc() {}
//# sourceMappingURL=sourcemap.json
`);

console.log(script.sourceMapURL);
// Prints: sourcemap.json
```

```js [CJS]
const vm = require('node:vm');

const script = new vm.Script(`
function myFunc() {}
//# sourceMappingURL=sourcemap.json
`);

console.log(script.sourceMapURL);
// Prints: sourcemap.json
```
:::

## クラス: `vm.Module` {#class-vmmodule}

**追加:** v13.0.0, v12.16.0

::: warning [Stable: 1 - 試験的]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

この機能は、`--experimental-vm-modules` コマンドフラグが有効になっている場合にのみ使用できます。

`vm.Module` クラスは、VMコンテキストでECMAScriptモジュールを使用するための低レベルのインターフェースを提供します。これは、ECMAScript仕様で定義されている[モジュールレコード](https://262.ecma-international.org/14.0/#sec-abstract-module-records)を厳密に反映する `vm.Script` クラスの対応物です。

ただし、`vm.Script` とは異なり、すべての `vm.Module` オブジェクトは作成時からコンテキストにバインドされています。 `vm.Module` オブジェクトに対する操作は本質的に非同期ですが、`vm.Script` オブジェクトは同期的な性質を持っています。「async」関数を使用すると、`vm.Module` オブジェクトの操作に役立ちます。

`vm.Module` オブジェクトを使用するには、作成/パース、リンク、評価という3つの異なるステップが必要です。次の例は、これら3つのステップを示しています。

この実装は、[ECMAScriptモジュールローダー](/ja/nodejs/api/esm#modules-ecmascript-modules)よりも低いレベルにあります。また、ローダーとのインタラクションはまだできませんが、サポートが計画されています。

::: code-group
```js [ESM]
import vm from 'node:vm';

const contextifiedObject = vm.createContext({
  secret: 42,
  print: console.log,
});

// ステップ 1
//
// 新しい `vm.SourceTextModule` オブジェクトを構築してモジュールを作成します。これにより、
// 提供されたソーステキストが解析され、何か問題が発生すると `SyntaxError` がスローされます。
// デフォルトでは、モジュールはトップコンテキストに作成されます。ただしここでは、
// このモジュールが属するコンテキストとして `contextifiedObject` を指定します。
//
// ここでは、モジュール "foo" からデフォルトのエクスポートを取得し、
// ローカルバインディング "secret" に配置しようとしています。

const bar = new vm.SourceTextModule(`
  import s from 'foo';
  s;
  print(s);
`, { context: contextifiedObject });

// ステップ 2
//
// このモジュールのインポートされた依存関係を "リンク" します。
//
// 提供されたリンクコールバック（「リンカー」）は、2つの引数を受け取ります。
// 親モジュール（この場合は `bar` ）と、インポートされたモジュールの指定子である文字列です。
// コールバックは、指定された指定子に対応するモジュールを返すことが期待されています。
// `module.link()` に記載されている特定の要件があります。
//
// 返されたモジュールのリンクが開始されていない場合、同じリンカー
// コールバックが返されたモジュールで呼び出されます。
//
// 依存関係のないトップレベルモジュールであっても、明示的にリンクする必要があります。
// ただし、提供されたコールバックが呼び出されることはありません。
//
// link() メソッドは、リンカーによって返されたすべてのPromiseが解決されたときに
// 解決されるPromiseを返します。
//
// 注：これは、リンカー関数が呼び出されるたびに新しい "foo" モジュールを作成するという
// 不自然な例です。本格的なモジュールシステムでは、重複したモジュールを避けるために
// キャッシュが使用される可能性があります。

async function linker(specifier, referencingModule) {
  if (specifier === 'foo') {
    return new vm.SourceTextModule(`
      // "secret" 変数は、コンテキストを作成するときに
      // "contextifiedObject" に追加したグローバル変数を参照します。
      export default secret;
    `, { context: referencingModule.context });

    // ここで `referencingModule.context` の代わりに `contextifiedObject` を使用しても
    // 同じように動作します。
  }
  throw new Error(`Unable to resolve dependency: ${specifier}`);
}
await bar.link(linker);

// ステップ 3
//
// モジュールを評価します。 evaluate() メソッドは、モジュールの評価が完了した後に
// 解決されるPromiseを返します。

// 42 が出力されます。
await bar.evaluate();
```

```js [CJS]
const vm = require('node:vm');

const contextifiedObject = vm.createContext({
  secret: 42,
  print: console.log,
});

(async () => {
  // ステップ 1
  //
  // 新しい `vm.SourceTextModule` オブジェクトを構築してモジュールを作成します。これにより、
  // 提供されたソーステキストが解析され、何か問題が発生すると `SyntaxError` がスローされます。
  // デフォルトでは、モジュールはトップコンテキストに作成されます。ただしここでは、
  // このモジュールが属するコンテキストとして `contextifiedObject` を指定します。
  //
  // ここでは、モジュール "foo" からデフォルトのエクスポートを取得し、
  // ローカルバインディング "secret" に配置しようとしています。

  const bar = new vm.SourceTextModule(`
    import s from 'foo';
    s;
    print(s);
  `, { context: contextifiedObject });

  // ステップ 2
  //
  // このモジュールのインポートされた依存関係を "リンク" します。
  //
  // 提供されたリンクコールバック（「リンカー」）は、2つの引数を受け取ります。
  // 親モジュール（この場合は `bar` ）と、インポートされたモジュールの指定子である文字列です。
  // コールバックは、指定された指定子に対応するモジュールを返すことが期待されています。
  // `module.link()` に記載されている特定の要件があります。
  //
  // 返されたモジュールのリンクが開始されていない場合、同じリンカー
  // コールバックが返されたモジュールで呼び出されます。
  //
  // 依存関係のないトップレベルモジュールであっても、明示的にリンクする必要があります。
  // ただし、提供されたコールバックが呼び出されることはありません。
  //
  // link() メソッドは、リンカーによって返されたすべてのPromiseが解決されたときに
  // 解決されるPromiseを返します。
  //
  // 注：これは、リンカー関数が呼び出されるたびに新しい "foo" モジュールを作成するという
  // 不自然な例です。本格的なモジュールシステムでは、重複したモジュールを避けるために
  // キャッシュが使用される可能性があります。

  async function linker(specifier, referencingModule) {
    if (specifier === 'foo') {
      return new vm.SourceTextModule(`
        // "secret" 変数は、コンテキストを作成するときに
        // "contextifiedObject" に追加したグローバル変数を参照します。
        export default secret;
      `, { context: referencingModule.context });

      // ここで `referencingModule.context` の代わりに `contextifiedObject` を使用しても
      // 同じように動作します。
    }
    throw new Error(`Unable to resolve dependency: ${specifier}`);
  }
  await bar.link(linker);

  // ステップ 3
  //
  // モジュールを評価します。 evaluate() メソッドは、モジュールの評価が完了した後に
  // 解決されるPromiseを返します。

  // 42 が出力されます。
  await bar.evaluate();
})();
```
:::

### `module.dependencySpecifiers` {#moduledependencyspecifiers}

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

このモジュールのすべての依存関係の指定子。返される配列は、変更できないように凍結されます。

ECMAScript仕様の[巡回モジュールレコード](https://tc39.es/ecma262/#sec-cyclic-module-records)の`[[RequestedModules]]`フィールドに対応します。

### `module.error` {#moduleerror}

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`module.status`が`'errored'`の場合、このプロパティにはモジュールの評価中にスローされた例外が含まれます。ステータスがそれ以外の場合、このプロパティにアクセスすると例外がスローされます。

`undefined`という値は、`throw undefined;`との曖昧さの可能性があるため、スローされた例外がない場合には使用できません。

ECMAScript仕様の[巡回モジュールレコード](https://tc39.es/ecma262/#sec-cyclic-module-records)の`[[EvaluationError]]`フィールドに対応します。

### `module.evaluate([options])` {#moduleevaluateoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 実行を終了するまでに評価するミリ秒数を指定します。実行が中断された場合、[`Error`](/ja/nodejs/api/errors#class-error)がスローされます。この値は厳密に正の整数でなければなりません。
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、`SIGINT` (+)を受信すると実行を終了し、[`Error`](/ja/nodejs/api/errors#class-error)をスローします。`process.on('SIGINT')`を介してアタッチされたイベントの既存のハンドラーは、スクリプトの実行中は無効になりますが、その後も引き続き機能します。**デフォルト:** `false`。

- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 成功時に`undefined`で履行します。

モジュールを評価します。

これは、モジュールがリンクされた後に呼び出す必要があります。そうでない場合は拒否されます。また、モジュールがすでに評価されている場合にも呼び出すことができます。その場合、最初の評価が成功で終了した場合は何もしないか（`module.status`が`'evaluated'`の場合）、最初の評価の結果として発生した例外を再度スローします（`module.status`が`'errored'`の場合）。

このメソッドは、モジュールの評価中（`module.status`が`'evaluating'`の場合）には呼び出すことはできません。

ECMAScript仕様の[巡回モジュールレコード](https://tc39.es/ecma262/#sec-cyclic-module-records)の[Evaluate() 抽象メソッド](https://tc39.es/ecma262/#sec-moduleevaluation)フィールドに対応します。


### `module.identifier` {#moduleidentifier}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

コンストラクタで設定された、現在のモジュールの識別子。

### `module.link(linker)` {#modulelinklinker}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v21.1.0, v20.10.0, v18.19.0 | オプション `extra.assert` は `extra.attributes` に名前が変更されました。以前の名前は下位互換性のためにまだ提供されています。 |
:::

- `linker` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) リクエストされたモジュールの指定子:
    - `referencingModule` [\<vm.Module\>](/ja/nodejs/api/vm#class-vmmodule) `link()` が呼び出される `Module` オブジェクト。
    - `extra` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `attributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 属性からのデータ: ECMA-262 に従って、サポートされていない属性が存在する場合、ホストはエラーをトリガーすることが期待されます。
    - `assert` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `extra.attributes` のエイリアス。
  
 
    -  戻り値: [\<vm.Module\>](/ja/nodejs/api/vm#class-vmmodule) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  
 
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

モジュールの依存関係をリンクします。 このメソッドは評価前に呼び出す必要があり、モジュールごとに 1 回だけ呼び出すことができます。

この関数は、`Module` オブジェクト、または最終的に `Module` オブジェクトに解決される `Promise` を返すことが期待されます。 返される `Module` は、次の 2 つの不変条件を満たす必要があります。

- 親 `Module` と同じコンテキストに属している必要があります。
- その `status` は `'errored'` であってはなりません。

返された `Module` の `status` が `'unlinked'` の場合、このメソッドは、提供された同じ `linker` 関数を使用して、返された `Module` に対して再帰的に呼び出されます。

`link()` は、すべてのリンクインスタンスが有効な `Module` に解決されたときに解決されるか、リンカー関数が例外をスローするか、無効な `Module` を返した場合に拒否される `Promise` を返します。

リンカー関数は、ECMAScript 仕様の [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) 抽象操作の実装定義にほぼ対応していますが、いくつかの重要な違いがあります。

- リンカー関数は非同期にすることができますが、[HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) は同期です。

モジュールのリンク中に使用される実際の [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) 実装は、リンク中にリンクされたモジュールを返すものです。 その時点で、すべてのモジュールはすでに完全にリンクされているため、[HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) 実装は仕様に従って完全に同期しています。

ECMAScript 仕様の [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records) の [Link() concrete method](https://tc39.es/ecma262/#sec-moduledeclarationlinking) フィールドに対応します。


### `module.namespace` {#modulenamespace}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

モジュールの名前空間オブジェクト。これはリンク処理 (`module.link()`) が完了した後にのみ利用可能です。

ECMAScript 仕様の [GetModuleNamespace](https://tc39.es/ecma262/#sec-getmodulenamespace) 抽象操作に対応します。

### `module.status` {#modulestatus}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

モジュールの現在のステータス。以下のいずれかになります。

-  `'unlinked'`: `module.link()` がまだ呼び出されていません。
-  `'linking'`: `module.link()` は呼び出されましたが、リンカー関数によって返されたすべての Promise がまだ解決されていません。
-  `'linked'`: モジュールは正常にリンクされ、そのすべての依存関係もリンクされていますが、`module.evaluate()` はまだ呼び出されていません。
-  `'evaluating'`: モジュールは、それ自体または親モジュールに対する `module.evaluate()` を介して評価されています。
-  `'evaluated'`: モジュールは正常に評価されました。
-  `'errored'`: モジュールは評価されましたが、例外がスローされました。

`'errored'` を除き、このステータス文字列は仕様の [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records) の `[[Status]]` フィールドに対応します。`'errored'` は仕様では `'evaluated'` に対応しますが、`[[EvaluationError]]` が `undefined` ではない値に設定されています。

## Class: `vm.SourceTextModule` {#class-vmsourcetextmodule}

**Added in: v9.6.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - Experimental
:::

この機能は、`--experimental-vm-modules` コマンドフラグが有効になっている場合にのみ利用可能です。

- Extends: [\<vm.Module\>](/ja/nodejs/api/vm#class-vmmodule)

`vm.SourceTextModule` クラスは、ECMAScript 仕様で定義されている [Source Text Module Record](https://tc39.es/ecma262/#sec-source-text-module-records) を提供します。

### `new vm.SourceTextModule(code[, options])` {#new-vmsourcetextmodulecode-options}


::: info [History]
| Version | Changes |
| --- | --- |
| v17.0.0, v16.12.0 | `importModuleDynamically` パラメーターへの import 属性のサポートを追加しました。 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 解析する JavaScript モジュールコード
- `options`
    - `identifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) スタックトレースで使用される文字列。**デフォルト:** `'vm:module(i)'`。ここで `i` はコンテキスト固有の昇順インデックスです。
    - `cachedData` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 提供されるソースに対する V8 のコードキャッシュデータを含むオプションの `Buffer` または `TypedArray`、または `DataView` を提供します。`code` は、この `cachedData` が作成されたモジュールと同じである必要があります。
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) この `Module` をコンパイルおよび評価するための、`vm.createContext()` メソッドによって返される [contextified](/ja/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) オブジェクト。コンテキストが指定されていない場合、モジュールは現在の実行コンテキストで評価されます。
    - `lineOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) この `Module` によって生成されるスタックトレースに表示される行番号オフセットを指定します。**デフォルト:** `0`。
    - `columnOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) この `Module` によって生成されるスタックトレースに表示される最初の行の列番号オフセットを指定します。**デフォルト:** `0`。
    - `initializeImportMeta` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `import.meta` を初期化するために、この `Module` の評価中に呼び出されます。
    - `meta` [\<import.meta\>](/ja/nodejs/api/esm#importmeta)
    - `module` [\<vm.SourceTextModule\>](/ja/nodejs/api/vm#class-vmsourcetextmodule)
  
 
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `import()` が呼び出されたときに、このモジュールの評価中にモジュールをどのようにロードするかを指定するために使用されます。このオプションは、実験的なモジュール API の一部です。本番環境での使用はお勧めしません。詳細については、[コンパイル API での動的 `import()` のサポート](/ja/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis) を参照してください。
  
 

新しい `SourceTextModule` インスタンスを作成します。

オブジェクトである `import.meta` オブジェクトに割り当てられたプロパティは、モジュールが指定された `context` の外部の情報にアクセスすることを許可する場合があります。特定のコンテキストでオブジェクトを作成するには、`vm.runInContext()` を使用します。



::: code-group
```js [ESM]
import vm from 'node:vm';

const contextifiedObject = vm.createContext({ secret: 42 });

const module = new vm.SourceTextModule(
  'Object.getPrototypeOf(import.meta.prop).secret = secret;',
  {
    initializeImportMeta(meta) {
      // Note: this object is created in the top context. As such,
      // Object.getPrototypeOf(import.meta.prop) points to the
      // Object.prototype in the top context rather than that in
      // the contextified object.
      meta.prop = {};
    },
  });
// Since module has no dependencies, the linker function will never be called.
await module.link(() => {});
await module.evaluate();

// Now, Object.prototype.secret will be equal to 42.
//
// To fix this problem, replace
//     meta.prop = {};
// above with
//     meta.prop = vm.runInContext('{}', contextifiedObject);
```

```js [CJS]
const vm = require('node:vm');
const contextifiedObject = vm.createContext({ secret: 42 });
(async () => {
  const module = new vm.SourceTextModule(
    'Object.getPrototypeOf(import.meta.prop).secret = secret;',
    {
      initializeImportMeta(meta) {
        // Note: this object is created in the top context. As such,
        // Object.getPrototypeOf(import.meta.prop) points to the
        // Object.prototype in the top context rather than that in
        // the contextified object.
        meta.prop = {};
      },
    });
  // Since module has no dependencies, the linker function will never be called.
  await module.link(() => {});
  await module.evaluate();
  // Now, Object.prototype.secret will be equal to 42.
  //
  // To fix this problem, replace
  //     meta.prop = {};
  // above with
  //     meta.prop = vm.runInContext('{}', contextifiedObject);
})();
```
:::


### `sourceTextModule.createCachedData()` {#sourcetextmodulecreatecacheddata}

**追加:** v13.7.0, v12.17.0

- 戻り値: [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer)

`SourceTextModule` コンストラクターの `cachedData` オプションで使用できるコードキャッシュを作成します。`Buffer` を返します。このメソッドは、モジュールが評価される前に何度でも呼び出すことができます。

`SourceTextModule` のコードキャッシュには、JavaScript から観測可能な状態は含まれていません。コードキャッシュは、スクリプトソースと一緒に保存し、新しい `SourceTextModule` インスタンスを複数回構築するために安全に使用できます。

`SourceTextModule` ソース内の関数は、遅延コンパイルとしてマークでき、`SourceTextModule` の構築時にはコンパイルされません。これらの関数は、最初に呼び出されたときにコンパイルされます。コードキャッシュは、V8 が現在 `SourceTextModule` について把握しているメタデータをシリアライズし、将来のコンパイルを高速化するために使用できます。

```js [ESM]
// 最初のモジュールを作成
const module = new vm.SourceTextModule('const a = 1;');

// このモジュールからキャッシュされたデータを作成
const cachedData = module.createCachedData();

// キャッシュされたデータを使用して新しいモジュールを作成します。コードは同じである必要があります。
const module2 = new vm.SourceTextModule('const a = 1;', { cachedData });
```
## Class: `vm.SyntheticModule` {#class-vmsyntheticmodule}

**追加:** v13.0.0, v12.16.0

::: warning [安定: 1 - 試験的]
[安定: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

この機能は、`--experimental-vm-modules` コマンドフラグが有効になっている場合にのみ使用できます。

- 拡張: [\<vm.Module\>](/ja/nodejs/api/vm#class-vmmodule)

`vm.SyntheticModule` クラスは、WebIDL 仕様で定義されている [Synthetic Module Record](https://heycam.github.io/webidl/#synthetic-module-records) を提供します。シンセティックモジュールの目的は、非 JavaScript ソースを ECMAScript モジュールグラフに公開するための汎用インターフェースを提供することです。

```js [ESM]
const vm = require('node:vm');

const source = '{ "a": 1 }';
const module = new vm.SyntheticModule(['default'], function() {
  const obj = JSON.parse(source);
  this.setExport('default', obj);
});

// リンキングで `module` を使用...
```

### `new vm.SyntheticModule(exportNames, evaluateCallback[, options])` {#new-vmsyntheticmoduleexportnames-evaluatecallback-options}

**追加: v13.0.0, v12.16.0**

- `exportNames` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) モジュールからエクスポートされる名前の配列。
- `evaluateCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) モジュールが評価されるときに呼び出されます。
- `options`
    - `identifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) スタックトレースで使用される文字列。**デフォルト:** `'vm:module(i)'`。ここで、`i` はコンテキスト固有の昇順インデックスです。
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) この `Module` をコンパイルおよび評価するために、`vm.createContext()` メソッドによって返される、[コンテキスト化された](/ja/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)オブジェクト。

新しい `SyntheticModule` インスタンスを作成します。

このインスタンスのエクスポートに割り当てられたオブジェクトにより、モジュールのインポーターは指定された `context` の外部にある情報にアクセスできるようになる場合があります。特定のコンテキストでオブジェクトを作成するには、`vm.runInContext()` を使用します。

### `syntheticModule.setExport(name, value)` {#syntheticmodulesetexportname-value}

**追加: v13.0.0, v12.16.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 設定するエクスポートの名前。
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) エクスポートに設定する値。

このメソッドは、モジュールがリンクされた後、エクスポートの値を設定するために使用されます。モジュールがリンクされる前に呼び出された場合、[`ERR_VM_MODULE_STATUS`](/ja/nodejs/api/errors#err_vm_module_status) エラーがスローされます。

::: code-group
```js [ESM]
import vm from 'node:vm';

const m = new vm.SyntheticModule(['x'], () => {
  m.setExport('x', 1);
});

await m.link(() => {});
await m.evaluate();

assert.strictEqual(m.namespace.x, 1);
```

```js [CJS]
const vm = require('node:vm');
(async () => {
  const m = new vm.SyntheticModule(['x'], () => {
    m.setExport('x', 1);
  });
  await m.link(() => {});
  await m.evaluate();
  assert.strictEqual(m.namespace.x, 1);
})();
```
:::


## `vm.compileFunction(code[, params[, options]])` {#vmcompilefunctioncode-params-options}

::: info [履歴]
| バージョン | 変更点 |
|---|---|
| v21.7.0, v20.12.0 | `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` のサポートを追加。 |
| v19.6.0, v18.15.0 | `cachedData` オプションが渡された場合、戻り値に `vm.Script` バージョンと同じセマンティクスを持つ `cachedDataRejected` が含まれるようになりました。 |
| v17.0.0, v16.12.0 | `importModuleDynamically` パラメーターへの import 属性のサポートを追加。 |
| v15.9.0 | `importModuleDynamically` オプションを再度追加。 |
| v14.3.0 | 互換性の問題のため、`importModuleDynamically` を削除。 |
| v14.1.0, v13.14.0 | `importModuleDynamically` オプションがサポートされるようになりました。 |
| v10.10.0 | 追加: v10.10.0 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) コンパイルする関数の本体。
- `params` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 関数のすべてのパラメーターを含む文字列の配列。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) このスクリプトによって生成されるスタックトレースで使用されるファイル名を指定します。 **デフォルト:** `''`。
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) このスクリプトによって生成されるスタックトレースに表示される行番号のオフセットを指定します。 **デフォルト:** `0`。
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) このスクリプトによって生成されるスタックトレースに表示される最初の行の列番号のオフセットを指定します。 **デフォルト:** `0`。
    - `cachedData` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 指定されたソースに対する V8 のコードキャッシュデータを含むオプションの `Buffer` または `TypedArray`、または `DataView` を提供します。 これは、同じ `code` および `params` を持つ [`vm.compileFunction()`](/ja/nodejs/api/vm#vmcompilefunctioncode-params-options) の以前の呼び出しによって生成される必要があります。
    - `produceCachedData` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 新しいキャッシュデータを生成するかどうかを指定します。 **デフォルト:** `false`。
    - `parsingContext` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 問題の関数をコンパイルする [コンテキスト化](/ja/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) オブジェクト。
    - `contextExtensions` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) コンパイル中に適用されるコンテキスト拡張機能（現在のスコープをラップするオブジェクト）のコレクションを含む配列。 **デフォルト:** `[]`。

- `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/ja/nodejs/api/vm#vmconstantsuse_main_context_default_loader) `import()` が呼び出されたときに、この関数の評価中にモジュールをどのようにロードするかを指定するために使用されます。 このオプションは、実験的なモジュール API の一部です。 本番環境での使用はお勧めしません。 詳細については、[コンパイル API での動的 `import()` のサポート](/ja/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis) を参照してください。
- 戻り値: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

指定されたコードを指定されたコンテキストにコンパイルし（コンテキストが指定されていない場合は、現在のコンテキストが使用されます）、指定された `params` を持つ関数内にラップして返します。


## `vm.constants` {#vmconstants}

**追加:** v21.7.0, v20.12.0

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

VM操作で一般的に使用される定数を含むオブジェクトを返します。

### `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` {#vmconstantsuse_main_context_default_loader}

**追加:** v21.7.0, v20.12.0

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index).1 - アクティブな開発
:::

Node.jsがリクエストされたモジュールをロードするために、メインコンテキストからデフォルトのESMローダーを使用するように、`vm.Script`と`vm.compileFunction()`の`importModuleDynamically`オプションとして使用できる定数です。

詳細については、[コンパイルAPIにおける動的`import()`のサポート](/ja/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis)を参照してください。

## `vm.createContext([contextObject[, options]])` {#vmcreatecontextcontextobject-options}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.8.0, v20.18.0 | `contextObject`引数は`vm.constants.DONT_CONTEXTIFY`を受け入れるようになりました。 |
| v21.7.0, v20.12.0 | `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`のサポートが追加されました。 |
| v21.2.0, v20.11.0 | `importModuleDynamically`オプションがサポートされるようになりました。 |
| v14.6.0 | `microtaskMode`オプションがサポートされるようになりました。 |
| v10.0.0 | 最初の引数は関数ではなくなりました。 |
| v10.0.0 | `codeGeneration`オプションがサポートされるようになりました。 |
| v0.3.1 | 追加: v0.3.1 |
:::

- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/ja/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [`vm.constants.DONT_CONTEXTIFY`](/ja/nodejs/api/vm#vmconstantsdont_contextify)か、[コンテキスト化](/ja/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)されるオブジェクトです。 `undefined`の場合、下位互換性のために空のコンテキスト化されたオブジェクトが作成されます。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 新しく作成されたコンテキストの人間に読みやすい名前。 **デフォルト:** `'VM Context i'`。ここで、`i`は作成されたコンテキストの昇順の数値インデックスです。
    - `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 表示を目的として、新しく作成されたコンテキストに対応する[オリジン](https://developer.mozilla.org/en-US/docs/Glossary/Origin)。 オリジンはURLのようにフォーマットする必要がありますが、[`URL`](/ja/nodejs/api/url#class-url)オブジェクトの[`url.origin`](/ja/nodejs/api/url#urlorigin)プロパティの値のように、スキーム、ホスト、およびポート（必要な場合）のみを含みます。 特に、この文字列は末尾のスラッシュを省略する必要があります。これはパスを示すためです。 **デフォルト:** `''`。
    - `codeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) falseに設定すると、`eval`または関数コンストラクタ（`Function`、`GeneratorFunction`など）への呼び出しは`EvalError`をスローします。 **デフォルト:** `true`。
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) falseに設定すると、WebAssemblyモジュールをコンパイルしようとすると`WebAssembly.CompileError`がスローされます。 **デフォルト:** `true`。
  
 
    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `afterEvaluate`に設定すると、マイクロタスク（`Promise`と`async function`を介してスケジュールされたタスク）は、スクリプトが[`script.runInContext()`](/ja/nodejs/api/vm#scriptrunincontextcontextifiedobject-options)を介して実行された直後に実行されます。 この場合、それらは`timeout`と`breakOnSigint`のスコープに含まれます。
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/ja/nodejs/api/vm#vmconstantsuse_main_context_default_loader) リファラースクリプトまたはモジュールなしでこのコンテキストで`import()`が呼び出されたときに、モジュールをロードする方法を指定するために使用されます。 このオプションは、試験的なモジュールAPIの一部です。 本番環境での使用はお勧めしません。 詳細については、[コンパイルAPIにおける動的`import()`のサポート](/ja/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis)を参照してください。
  
 
- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) コンテキスト化されたオブジェクト。

指定された`contextObject`がオブジェクトの場合、`vm.createContext()`メソッドは[そのオブジェクトを準備し](/ja/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)、[`vm.runInContext()`](/ja/nodejs/api/vm#vmrunincontextcode-contextifiedobject-options)または[`script.runInContext()`](/ja/nodejs/api/vm#scriptrunincontextcontextifiedobject-options)の呼び出しで使用できるように、そのオブジェクトへの参照を返します。 このようなスクリプト内では、グローバルオブジェクトは`contextObject`によってラップされ、既存のすべてのプロパティを保持しますが、標準的な[グローバルオブジェクト](https://es5.github.io/#x15.1)が持つ組み込みオブジェクトと関数も持ちます。 vmモジュールによって実行されるスクリプトの外部では、グローバル変数は変更されません。

```js [ESM]
const vm = require('node:vm');

global.globalVar = 3;

const context = { globalVar: 1 };
vm.createContext(context);

vm.runInContext('globalVar *= 2;', context);

console.log(context);
// Prints: { globalVar: 2 }

console.log(global.globalVar);
// Prints: 3
```
`contextObject`が省略された場合（または明示的に`undefined`として渡された場合）、新しく空の[コンテキスト化された](/ja/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)オブジェクトが返されます。

新しく作成されたコンテキストのグローバルオブジェクトが[コンテキスト化](/ja/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)されると、通常のグローバルオブジェクトと比較して、いくつかの癖があります。 たとえば、凍結できません。 コンテキスト化の癖のないコンテキストを作成するには、`contextObject`引数として[`vm.constants.DONT_CONTEXTIFY`](/ja/nodejs/api/vm#vmconstantsdont_contextify)を渡します。 詳細については、[`vm.constants.DONT_CONTEXTIFY`](/ja/nodejs/api/vm#vmconstantsdont_contextify)のドキュメントを参照してください。

`vm.createContext()`メソッドは、主に複数のスクリプトを実行するために使用できる単一のコンテキストを作成するのに役立ちます。 たとえば、Webブラウザーをエミュレートする場合、このメソッドを使用して、ウィンドウのグローバルオブジェクトを表す単一のコンテキストを作成し、そのコンテキスト内で一緒にすべての`\<script\>`タグを実行できます。

コンテキストに提供された`name`と`origin`は、Inspector APIを通じて表示されます。


## `vm.isContext(object)` {#vmiscontextobject}

**Added in: v0.11.7**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

与えられた `object` オブジェクトが [`vm.createContext()`](/ja/nodejs/api/vm#vmcreatecontextcontextobject-options) を用いて [contextified](/ja/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) されているか、または [`vm.constants.DONT_CONTEXTIFY`](/ja/nodejs/api/vm#vmconstantsdont_contextify) を用いて生成されたコンテキストのグローバルオブジェクトである場合に、`true` を返します。

## `vm.measureMemory([options])` {#vmmeasurememoryoptions}

**Added in: v13.10.0**

::: warning [Stable: 1 - 実験的]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

V8 が把握しており、現在の V8 アイソレートが把握しているすべてのコンテキスト、またはメインコンテキストで使用されているメモリを計測します。

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optional. 
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'summary'` または `'detailed'` のいずれか。 summary モードでは、メインコンテキストのために計測されたメモリのみが返されます。 detailed モードでは、現在の V8 アイソレートが把握しているすべてのコンテキストのために計測されたメモリが返されます。 **Default:** `'summary'`
    - `execution` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'default'` または `'eager'` のいずれか。 デフォルトの実行では、次のスケジュールされたガベージコレクションが開始されるまで (時間がかかる場合や、次の GC の前にプログラムが終了する場合は決して行われない場合があります)、promise は解決されません。 eager 実行では、メモリを計測するために GC がすぐに開始されます。 **Default:** `'default'`
  
 
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) メモリの計測に成功すると、promise はメモリ使用量に関する情報を含むオブジェクトで解決されます。 それ以外の場合は、`ERR_CONTEXT_NOT_INITIALIZED` エラーで拒否されます。

返される Promise が解決する可能性のあるオブジェクトの形式は V8 エンジンに固有であり、V8 のバージョンによって変更される可能性があります。

返される結果は `v8.getHeapSpaceStatistics()` によって返される統計情報とは異なります。`vm.measureMemory()` は V8 エンジンの現在のインスタンスの各 V8 固有のコンテキストから到達可能なメモリを計測しますが、`v8.getHeapSpaceStatistics()` の結果は現在の V8 インスタンスの各ヒープ領域によって占有されているメモリを計測します。

```js [ESM]
const vm = require('node:vm');
// メインコンテキストで使用されているメモリを計測します。
vm.measureMemory({ mode: 'summary' })
  // これは vm.measureMemory() と同じです
  .then((result) => {
    // 現在の形式は次のとおりです。
    // {
    //   total: {
    //      jsMemoryEstimate: 2418479, jsMemoryRange: [ 2418479, 2745799 ]
    //    }
    // }
    console.log(result);
  });

const context = vm.createContext({ a: 1 });
vm.measureMemory({ mode: 'detailed', execution: 'eager' })
  .then((result) => {
    // ここでコンテキストを参照して、計測が完了するまで GC されないようにします。
    console.log(context.a);
    // {
    //   total: {
    //     jsMemoryEstimate: 2574732,
    //     jsMemoryRange: [ 2574732, 2904372 ]
    //   },
    //   current: {
    //     jsMemoryEstimate: 2438996,
    //     jsMemoryRange: [ 2438996, 2768636 ]
    //   },
    //   other: [
    //     {
    //       jsMemoryEstimate: 135736,
    //       jsMemoryRange: [ 135736, 465376 ]
    //     }
    //   ]
    // }
    console.log(result);
  });
```

## `vm.runInContext(code, contextifiedObject[, options])` {#vmrunincontextcode-contextifiedobject-options}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v21.7.0, v20.12.0 | `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` のサポートを追加。 |
| v17.0.0, v16.12.0 | `importModuleDynamically` パラメーターへの import 属性のサポートを追加。 |
| v6.3.0 | `breakOnSigint` オプションがサポートされるようになりました。 |
| v0.3.1 | 追加: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) コンパイルおよび実行する JavaScript コード。
- `contextifiedObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `code` のコンパイルおよび実行時に `global` として使用される、[コンテキスト化された](/ja/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)オブジェクト。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) このスクリプトによって生成されるスタックトレースで使用されるファイル名を指定します。**デフォルト:** `'evalmachine.\<anonymous\>'`。
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) このスクリプトによって生成されるスタックトレースに表示される行番号のオフセットを指定します。**デフォルト:** `0`。
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) このスクリプトによって生成されるスタックトレースに表示される最初の行の列番号のオフセットを指定します。**デフォルト:** `0`。
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`code` のコンパイル中に [`Error`](/ja/nodejs/api/errors#class-error) が発生すると、エラーの原因となったコード行がスタックトレースに付加されます。**デフォルト:** `true`。
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 実行を終了する前に `code` を実行するミリ秒数を指定します。実行が終了した場合、[`Error`](/ja/nodejs/api/errors#class-error) がスローされます。この値は厳密に正の整数でなければなりません。
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`SIGINT` (+) を受信すると実行が終了し、[`Error`](/ja/nodejs/api/errors#class-error) がスローされます。`process.on('SIGINT')` を介してアタッチされたイベントの既存のハンドラーは、スクリプトの実行中は無効になりますが、その後も引き続き機能します。**デフォルト:** `false`。
    - `cachedData` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 指定されたソースに対する V8 のコードキャッシュデータを持つオプションの `Buffer` または `TypedArray`、または `DataView` を提供します。
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/ja/nodejs/api/vm#vmconstantsuse_main_context_default_loader) `import()` が呼び出されたときに、このスクリプトの評価中にモジュールをどのようにロードするかを指定するために使用されます。このオプションは、実験的なモジュール API の一部です。本番環境での使用はお勧めしません。詳細については、[コンパイル API での動的 `import()` のサポート](/ja/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis)を参照してください。

`vm.runInContext()` メソッドは、`code` をコンパイルし、`contextifiedObject` のコンテキスト内で実行し、結果を返します。実行コードはローカルスコープにアクセスできません。`contextifiedObject` オブジェクトは、[`vm.createContext()`](/ja/nodejs/api/vm#vmcreatecontextcontextobject-options) メソッドを使用して、事前に[コンテキスト化](/ja/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)されている*必要*があります。

`options` が文字列の場合、ファイル名を指定します。

次の例は、単一の [コンテキスト化された](/ja/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)オブジェクトを使用して、異なるスクリプトをコンパイルして実行します。

```js [ESM]
const vm = require('node:vm');

const contextObject = { globalVar: 1 };
vm.createContext(contextObject);

for (let i = 0; i < 10; ++i) {
  vm.runInContext('globalVar *= 2;', contextObject);
}
console.log(contextObject);
// Prints: { globalVar: 1024 }
```

## `vm.runInNewContext(code[, contextObject[, options]])` {#vmruninnewcontextcode-contextobject-options}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.8.0, v20.18.0 | `contextObject` 引数は `vm.constants.DONT_CONTEXTIFY` を受け入れるようになりました。 |
| v21.7.0, v20.12.0 | `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` のサポートが追加されました。 |
| v17.0.0, v16.12.0 | `importModuleDynamically` パラメータへの import 属性のサポートが追加されました。 |
| v14.6.0 | `microtaskMode` オプションがサポートされるようになりました。 |
| v10.0.0 | `contextCodeGeneration` オプションがサポートされるようになりました。 |
| v6.3.0 | `breakOnSigint` オプションがサポートされるようになりました。 |
| v0.3.1 | 追加: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) コンパイルおよび実行する JavaScript コード。
- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/ja/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [`vm.constants.DONT_CONTEXTIFY`](/ja/nodejs/api/vm#vmconstantsdont_contextify) または [contextified](/ja/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) されるオブジェクト。`undefined` の場合、下位互換性のために空の contextified オブジェクトが作成されます。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) このスクリプトによって生成されるスタックトレースで使用されるファイル名を指定します。**デフォルト:** `'evalmachine.\<anonymous\>'`。
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) このスクリプトによって生成されるスタックトレースに表示される行番号オフセットを指定します。**デフォルト:** `0`。
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) このスクリプトによって生成されるスタックトレースに表示される最初の行の列番号オフセットを指定します。**デフォルト:** `0`。
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`code` のコンパイル中に [`Error`](/ja/nodejs/api/errors#class-error) が発生すると、エラーの原因となったコード行がスタックトレースにアタッチされます。**デフォルト:** `true`。
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 実行を終了するまでに `code` を実行するミリ秒数を指定します。実行が終了した場合、[`Error`](/ja/nodejs/api/errors#class-error) がスローされます。この値は厳密に正の整数でなければなりません。
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`SIGINT` (+) を受信すると、実行が終了し、[`Error`](/ja/nodejs/api/errors#class-error) がスローされます。`process.on('SIGINT')` を介してアタッチされたイベントの既存のハンドラーは、スクリプトの実行中は無効になりますが、その後も動作し続けます。**デフォルト:** `false`。
    - `contextName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 新しく作成されたコンテキストの人間が読める名前。**デフォルト:** `'VM Context i'`。ここで `i` は、作成されたコンテキストの昇順の数値インデックスです。
    - `contextOrigin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 表示の目的で、新しく作成されたコンテキストに対応する [オリジン](https://developer.mozilla.org/en-US/docs/Glossary/Origin)。オリジンは、URL のようにフォーマットする必要がありますが、スキーム、ホスト、およびポート (必要な場合) のみを含みます。これは、[`URL`](/ja/nodejs/api/url#class-url) オブジェクトの [`url.origin`](/ja/nodejs/api/url#urlorigin) プロパティの値のようです。最も注目すべき点は、この文字列は末尾のスラッシュを省略する必要があることです。これはパスを示すためです。**デフォルト:** `''`。
    - `contextCodeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) false に設定すると、`eval` または関数コンストラクター (`Function`、`GeneratorFunction` など) の呼び出しは `EvalError` をスローします。**デフォルト:** `true`。
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) false に設定すると、WebAssembly モジュールをコンパイルしようとすると `WebAssembly.CompileError` がスローされます。**デフォルト:** `true`。
  
 
    - `cachedData` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 指定されたソースに対して、V8 のコードキャッシュデータを含むオプションの `Buffer` または `TypedArray`、または `DataView` を提供します。
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/ja/nodejs/api/vm#vmconstantsuse_main_context_default_loader) `import()` が呼び出されたときに、このスクリプトの評価中にモジュールをどのようにロードするかを指定するために使用されます。このオプションは、実験的なモジュール API の一部です。本番環境での使用はお勧めしません。詳細については、[コンパイル API での動的な `import()` のサポート](/ja/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis) を参照してください。
    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `afterEvaluate` に設定すると、マイクロタスク (`Promise` および `async function` を介してスケジュールされたタスク) は、スクリプトの実行直後に実行されます。その場合、それらは `timeout` および `breakOnSigint` スコープに含まれます。
  
 
- 戻り値: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) スクリプトで実行された最後のステートメントの結果。

このメソッドは、`(new vm.Script(code, options)).runInContext(vm.createContext(options), options)` へのショートカットです。`options` が文字列の場合、ファイル名を指定します。

これは、いくつかのことを同時に行います。

次の例は、グローバル変数をインクリメントし、新しい変数を設定するコードをコンパイルして実行します。これらのグローバル変数は `contextObject` に含まれています。

```js [ESM]
const vm = require('node:vm');

const contextObject = {
  animal: 'cat',
  count: 2,
};

vm.runInNewContext('count += 1; name = "kitty"', contextObject);
console.log(contextObject);
// Prints: { animal: 'cat', count: 3, name: 'kitty' }

// これは、コンテキストが contextified オブジェクトから作成された場合、例外をスローします。
// vm.constants.DONT_CONTEXTIFY を使用すると、フリーズできる通常のグローバルオブジェクトを持つコンテキストを作成できます。
const frozenContext = vm.runInNewContext('Object.freeze(globalThis); globalThis;', vm.constants.DONT_CONTEXTIFY);
```

## `vm.runInThisContext(code[, options])` {#vmruninthiscontextcode-options}

::: info [履歴]
| バージョン | 変更点 |
|---|---|
| v21.7.0, v20.12.0 | `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` のサポートを追加しました。 |
| v17.0.0, v16.12.0 | `importModuleDynamically` パラメーターへのインポート属性のサポートを追加しました。 |
| v6.3.0 | `breakOnSigint` オプションがサポートされるようになりました。 |
| v0.3.1 | v0.3.1 で追加されました |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) コンパイルおよび実行する JavaScript コード。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) このスクリプトによって生成されるスタックトレースで使用されるファイル名を指定します。 **デフォルト:** `'evalmachine.\<anonymous\>'`。
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) このスクリプトによって生成されるスタックトレースに表示される行番号オフセットを指定します。 **デフォルト:** `0`。
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) このスクリプトによって生成されるスタックトレースに表示される最初の行の列番号オフセットを指定します。 **デフォルト:** `0`。
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`code` のコンパイル中に [`Error`](/ja/nodejs/api/errors#class-error) が発生すると、エラーの原因となったコード行がスタックトレースにアタッチされます。 **デフォルト:** `true`。
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 実行を終了する前に `code` を実行するミリ秒数を指定します。 実行が終了すると、[`Error`](/ja/nodejs/api/errors#class-error) がスローされます。 この値は厳密に正の整数でなければなりません。
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`SIGINT` (+) を受信すると実行が終了し、[`Error`](/ja/nodejs/api/errors#class-error) がスローされます。 `process.on('SIGINT')` を介してアタッチされたイベントの既存のハンドラーは、スクリプトの実行中は無効になりますが、その後も引き続き動作します。 **デフォルト:** `false`。
    - `cachedData` [\<Buffer\>](/ja/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 指定されたソースの V8 のコードキャッシュデータを持つオプションの `Buffer` または `TypedArray`、または `DataView` を提供します。
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/ja/nodejs/api/vm#vmconstantsuse_main_context_default_loader) `import()` が呼び出されたときに、このスクリプトの評価中にモジュールをロードする方法を指定するために使用されます。 このオプションは、実験的なモジュール API の一部です。 本番環境での使用はお勧めしません。 詳細については、[コンパイル API での動的 `import()` のサポート](/ja/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis)を参照してください。

- 戻り値: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) スクリプトで実行された最後のステートメントの結果。

`vm.runInThisContext()` は `code` をコンパイルし、現在の `global` のコンテキスト内で実行し、結果を返します。 実行中のコードはローカルスコープにアクセスできませんが、現在の `global` オブジェクトにはアクセスできます。

`options` が文字列の場合、ファイル名を指定します。

次の例は、`vm.runInThisContext()` と JavaScript の [`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) 関数の両方を使用して同じコードを実行する方法を示しています。

```js [ESM]
const vm = require('node:vm');
let localVar = 'initial value';

const vmResult = vm.runInThisContext('localVar = "vm";');
console.log(`vmResult: '${vmResult}', localVar: '${localVar}'`);
// Prints: vmResult: 'vm', localVar: 'initial value'

const evalResult = eval('localVar = "eval";');
console.log(`evalResult: '${evalResult}', localVar: '${localVar}'`);
// Prints: evalResult: 'eval', localVar: 'eval'
```
`vm.runInThisContext()` はローカルスコープにアクセスできないため、`localVar` は変更されません。 対照的に、[`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) はローカルスコープにアクセスできるため、値 `localVar` が変更されます。 このように、`vm.runInThisContext()` は [間接 `eval()` 呼び出し](https://es5.github.io/#x10.4.2) (例: `(0,eval)('code')`) によく似ています。


## 例：VM内でHTTPサーバーを実行する {#example-running-an-http-server-within-a-vm}

[`script.runInThisContext()`](/ja/nodejs/api/vm#scriptruninthiscontextoptions)または[`vm.runInThisContext()`](/ja/nodejs/api/vm#vmruninthiscontextcode-options)を使用する場合、コードは現在のV8グローバルコンテキスト内で実行されます。このVMコンテキストに渡されるコードは、独自の隔離されたスコープを持ちます。

`node:http`モジュールを使用して簡単なWebサーバーを実行するには、コンテキストに渡されるコードが`require('node:http')`を独自に呼び出すか、`node:http`モジュールへの参照が渡される必要があります。例えば：

```js [ESM]
'use strict';
const vm = require('node:vm');

const code = `
((require) => {
  const http = require('node:http');

  http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World\\n');
  }).listen(8124);

  console.log('Server running at http://127.0.0.1:8124/');
})`;

vm.runInThisContext(code)(require);
```
上記の場合の`require()`は、渡されたコンテキストと状態を共有します。これにより、信頼できないコードが実行される際に、例えばコンテキスト内のオブジェクトを望ましくない方法で変更するなど、リスクが生じる可能性があります。

## オブジェクトを「コンテキスト化」するとはどういう意味ですか？ {#what-does-it-mean-to-"contextify"-an-object?}

Node.js内で実行されるすべてのJavaScriptは、「コンテキスト」のスコープ内で実行されます。[V8 Embedder's Guide](https://v8.dev/docs/embed#contexts)によると：

`vm.createContext()`メソッドがオブジェクトとともに呼び出されると、`contextObject`引数は、V8 Contextの新しいインスタンスのグローバルオブジェクトをラップするために使用されます（`contextObject`が`undefined`の場合、コンテキスト化される前に現在のコンテキストから新しいオブジェクトが作成されます）。このV8 Contextは、`node:vm`モジュールのメソッドを使用して実行される`code`に、操作できる隔離されたグローバル環境を提供します。V8 Contextを作成し、それを外部コンテキストの`contextObject`に関連付けるプロセスは、このドキュメントでオブジェクトを「コンテキスト化」すると呼ばれるものです。

コンテキスト化すると、コンテキスト内の`globalThis`値にいくつかの癖が生じます。たとえば、フリーズできず、外部コンテキストの`contextObject`と参照が等しくありません。

```js [ESM]
const vm = require('node:vm');

// undefinedの`contextObject`オプションは、グローバルオブジェクトをコンテキスト化します。
const context = vm.createContext();
console.log(vm.runInContext('globalThis', context) === context);  // false
// コンテキスト化されたグローバルオブジェクトはフリーズできません。
try {
  vm.runInContext('Object.freeze(globalThis);', context);
} catch (e) {
  console.log(e); // TypeError: Cannot freeze
}
console.log(vm.runInContext('globalThis.foo = 1; foo;', context));  // 1
```
通常のグローバルオブジェクトを持つコンテキストを作成し、癖の少ない外部コンテキストでグローバルプロキシにアクセスするには、`contextObject`引数として`vm.constants.DONT_CONTEXTIFY`を指定します。


### `vm.constants.DONT_CONTEXTIFY` {#vmconstantsdont_contextify}

この定数は、vm API で `contextObject` 引数として使用される場合、Node.js 固有の方法でグローバルオブジェクトを別のオブジェクトでラップせずにコンテキストを作成するように Node.js に指示します。その結果、新しいコンテキスト内の `globalThis` の値は、通常のコンテキストにより近い動作をします。

```js [ESM]
const vm = require('node:vm');

// vm.constants.DONT_CONTEXTIFY を使用してグローバルオブジェクトをフリーズします。
const context = vm.createContext(vm.constants.DONT_CONTEXTIFY);
vm.runInContext('Object.freeze(globalThis);', context);
try {
  vm.runInContext('bar = 1; bar;', context);
} catch (e) {
  console.log(e); // Uncaught ReferenceError: bar is not defined
}
```
`vm.constants.DONT_CONTEXTIFY` が [`vm.createContext()`](/ja/nodejs/api/vm#vmcreatecontextcontextobject-options) の `contextObject` 引数として使用される場合、返されるオブジェクトは、Node.js 固有の癖が少ない、新しく作成されたコンテキストのグローバルオブジェクトへのプロキシのようなオブジェクトです。これは、新しいコンテキスト内の `globalThis` の値と参照が等しく、コンテキストの外部から変更でき、新しいコンテキストの組み込み関数に直接アクセスするために使用できます。

```js [ESM]
const vm = require('node:vm');

const context = vm.createContext(vm.constants.DONT_CONTEXTIFY);

// 返されたオブジェクトは、新しいコンテキスト内の globalThis と参照が等しくなります。
console.log(vm.runInContext('globalThis', context) === context);  // true

// 新しいコンテキストのグローバル変数に直接アクセスするために使用できます。
console.log(context.Array);  // [Function: Array]
vm.runInContext('foo = 1;', context);
console.log(context.foo);  // 1
context.bar = 1;
console.log(vm.runInContext('bar;', context));  // 1

// フリーズでき、内部コンテキストに影響を与えます。
Object.freeze(context);
try {
  vm.runInContext('baz = 1; baz;', context);
} catch (e) {
  console.log(e); // Uncaught ReferenceError: baz is not defined
}
```
## 非同期タスクと Promise のタイムアウトの相互作用 {#timeout-interactions-with-asynchronous-tasks-and-promises}

`Promise` と `async function` は、JavaScript エンジンによって非同期的に実行されるタスクをスケジュールできます。デフォルトでは、これらのタスクは、現在のスタック上のすべての JavaScript 関数の実行が完了した後に実行されます。これにより、`timeout` および `breakOnSigint` オプションの機能を回避できます。

たとえば、タイムアウトが 5 ミリ秒の `vm.runInNewContext()` によって実行される次のコードは、Promise が解決された後に実行される無限ループをスケジュールします。スケジュールされたループは、タイムアウトによって中断されることはありません。

```js [ESM]
const vm = require('node:vm');

function loop() {
  console.log('entering loop');
  while (1) console.log(Date.now());
}

vm.runInNewContext(
  'Promise.resolve().then(() => loop());',
  { loop, console },
  { timeout: 5 },
);
// これは 'entering loop' *の前に* 出力されます (!)
console.log('done executing');
```
これは、`Context` を作成するコードに `microtaskMode: 'afterEvaluate'` を渡すことで対処できます。

```js [ESM]
const vm = require('node:vm');

function loop() {
  while (1) console.log(Date.now());
}

vm.runInNewContext(
  'Promise.resolve().then(() => loop());',
  { loop, console },
  { timeout: 5, microtaskMode: 'afterEvaluate' },
);
```
この場合、`promise.then()` を介してスケジュールされたマイクロタスクは、`vm.runInNewContext()` から戻る前に実行され、`timeout` 機能によって中断されます。これは `vm.Context` で実行されているコードにのみ適用されるため、たとえば、[`vm.runInThisContext()`](/ja/nodejs/api/vm#vmruninthiscontextcode-options) はこのオプションを受け入れません。

Promise コールバックは、作成されたコンテキストのマイクロタスクキューに入力されます。たとえば、上記の例で `() =\> loop()` が `loop` だけで置き換えられた場合、`loop` はグローバルマイクロタスクキューにプッシュされます。これは、それが外部 (メイン) コンテキストからの関数であり、したがってタイムアウトを回避することもできるためです。

`process.nextTick()`、`queueMicrotask()`、`setTimeout()`、`setImmediate()` などの非同期スケジュール関数が `vm.Context` 内で使用できる場合、それらに渡された関数は、すべてのコンテキストで共有されるグローバルキューに追加されます。したがって、これらの関数に渡されたコールバックもタイムアウトによって制御できません。


## コンパイル API における動的 `import()` のサポート {#support-of-dynamic-import-in-compilation-apis}

以下のAPIは、vmモジュールによってコンパイルされたコードで動的 `import()` を有効にするための `importModuleDynamically` オプションをサポートします。

- `new vm.Script`
- `vm.compileFunction()`
- `new vm.SourceTextModule`
- `vm.runInThisContext()`
- `vm.runInContext()`
- `vm.runInNewContext()`
- `vm.createContext()`

このオプションはまだ実験的なモジュール API の一部です。本番環境での使用はお勧めしません。

### `importModuleDynamically` オプションが指定されていないか未定義の場合 {#when-the-importmoduledynamically-option-is-not-specified-or-undefined}

このオプションが指定されていないか、`undefined` の場合でも、`import()` を含むコードは vm API でコンパイルできます。ただし、コンパイルされたコードが実行され、実際に `import()` を呼び出すと、結果は [`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`](/ja/nodejs/api/errors#err_vm_dynamic_import_callback_missing) で拒否されます。

### `importModuleDynamically` が `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` の場合 {#when-importmoduledynamically-is-vmconstantsuse_main_context_default_loader}

このオプションは、現在 `vm.SourceTextModule` ではサポートされていません。

このオプションを使用すると、コンパイルされたコードで `import()` が開始されたときに、Node.js はメインコンテキストからのデフォルトの ESM ローダーを使用して、要求されたモジュールをロードし、実行されているコードに返します。

これにより、コンパイルされているコードは `fs` や `http` などの Node.js 組み込みモジュールにアクセスできるようになります。コードが異なるコンテキストで実行されている場合、メインコンテキストからロードされたモジュールによって作成されたオブジェクトは、新しいコンテキストの組み込みクラスの `instanceof` ではなく、メインコンテキストのオブジェクトであることに注意してください。

::: code-group
```js [CJS]
const { Script, constants } = require('node:vm');
const script = new Script(
  'import("node:fs").then(({readFile}) => readFile instanceof Function)',
  { importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });

// false: メインコンテキストからロードされたURLは、新しいコンテキストのFunctionクラスのインスタンスではありません。
script.runInNewContext().then(console.log);
```

```js [ESM]
import { Script, constants } from 'node:vm';

const script = new Script(
  'import("node:fs").then(({readFile}) => readFile instanceof Function)',
  { importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });

// false: メインコンテキストからロードされたURLは、新しいコンテキストのFunctionクラスのインスタンスではありません。
script.runInNewContext().then(console.log);
```
:::

このオプションを使用すると、スクリプトまたは関数はユーザーモジュールをロードすることもできます。

::: code-group
```js [ESM]
import { Script, constants } from 'node:vm';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';

// 現在実行中のスクリプトがあるディレクトリに test.js と test.txt を書き込みます。
writeFileSync(resolve(import.meta.dirname, 'test.mjs'),
              'export const filename = "./test.json";');
writeFileSync(resolve(import.meta.dirname, 'test.json'),
              '{"hello": "world"}');

// test.mjs をロードし、次に test.json をロードするスクリプトをコンパイルします。
// スクリプトが同じディレクトリに配置されているかのように。
const script = new Script(
  `(async function() {
    const { filename } = await import('./test.mjs');
    return import(filename, { with: { type: 'json' } })
  })();`,
  {
    filename: resolve(import.meta.dirname, 'test-with-default.js'),
    importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
  });

// { default: { hello: 'world' } }
script.runInThisContext().then(console.log);
```

```js [CJS]
const { Script, constants } = require('node:vm');
const { resolve } = require('node:path');
const { writeFileSync } = require('node:fs');

// 現在実行中のスクリプトがあるディレクトリに test.js と test.txt を書き込みます。
writeFileSync(resolve(__dirname, 'test.mjs'),
              'export const filename = "./test.json";');
writeFileSync(resolve(__dirname, 'test.json'),
              '{"hello": "world"}');

// test.mjs をロードし、次に test.json をロードするスクリプトをコンパイルします。
// スクリプトが同じディレクトリに配置されているかのように。
const script = new Script(
  `(async function() {
    const { filename } = await import('./test.mjs');
    return import(filename, { with: { type: 'json' } })
  })();`,
  {
    filename: resolve(__dirname, 'test-with-default.js'),
    importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
  });

// { default: { hello: 'world' } }
script.runInThisContext().then(console.log);
```
:::

メインコンテキストからのデフォルトのローダーを使用してユーザーモジュールをロードする場合、いくつかの注意点があります。


### `importModuleDynamically` が関数の場合 {#when-importmoduledynamically-is-a-function}

`importModuleDynamically` が関数の場合、コンパイルされたコードで `import()` が呼び出されたときに、リクエストされたモジュールをコンパイルおよび評価する方法をユーザーがカスタマイズできるように、この関数が呼び出されます。現在、このオプションを機能させるには、Node.js インスタンスを `--experimental-vm-modules` フラグを付けて起動する必要があります。フラグが設定されていない場合、このコールバックは無視されます。評価されたコードが実際に `import()` を呼び出す場合、結果は [`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG`](/ja/nodejs/api/errors#err_vm_dynamic_import_callback_missing_flag) でリジェクトされます。

コールバック `importModuleDynamically(specifier, referrer, importAttributes)` は、次のシグネチャを持ちます。

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `import()` に渡される指定子
- `referrer` [\<vm.Script\>](/ja/nodejs/api/vm#class-vmscript) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.SourceTextModule\>](/ja/nodejs/api/vm#class-vmsourcetextmodule) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) referrer は、`new vm.Script`、`vm.runInThisContext`、`vm.runInContext` および `vm.runInNewContext` に対してコンパイルされた `vm.Script` です。`vm.compileFunction` に対してコンパイルされた `Function`、`new vm.SourceTextModule` に対してコンパイルされた `vm.SourceTextModule`、`vm.createContext()` に対してコンテキスト `Object` です。
- `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`optionsExpression`](https://tc39.es/proposal-import-attributes/#sec-evaluate-import-call) オプションのパラメータに渡される `"with"` の値。値が指定されていない場合は空のオブジェクト。
- 戻り値: [\<Module Namespace Object\>](https://tc39.github.io/ecma262/#sec-module-namespace-exotic-objects) | [\<vm.Module\>](/ja/nodejs/api/vm#class-vmmodule) エラー追跡を利用し、`then` 関数エクスポートを含む名前空間の問題を回避するために、`vm.Module` を返すことをお勧めします。



::: code-group
```js [ESM]
// このスクリプトは --experimental-vm-modules で実行する必要があります。
import { Script, SyntheticModule } from 'node:vm';

const script = new Script('import("foo.json", { with: { type: "json" } })', {
  async importModuleDynamically(specifier, referrer, importAttributes) {
    console.log(specifier);  // 'foo.json'
    console.log(referrer);   // コンパイルされたスクリプト
    console.log(importAttributes);  // { type: 'json' }
    const m = new SyntheticModule(['bar'], () => { });
    await m.link(() => { });
    m.setExport('bar', { hello: 'world' });
    return m;
  },
});
const result = await script.runInThisContext();
console.log(result);  //  { bar: { hello: 'world' } }
```

```js [CJS]
// このスクリプトは --experimental-vm-modules で実行する必要があります。
const { Script, SyntheticModule } = require('node:vm');

(async function main() {
  const script = new Script('import("foo.json", { with: { type: "json" } })', {
    async importModuleDynamically(specifier, referrer, importAttributes) {
      console.log(specifier);  // 'foo.json'
      console.log(referrer);   // コンパイルされたスクリプト
      console.log(importAttributes);  // { type: 'json' }
      const m = new SyntheticModule(['bar'], () => { });
      await m.link(() => { });
      m.setExport('bar', { hello: 'world' });
      return m;
    },
  });
  const result = await script.runInThisContext();
  console.log(result);  //  { bar: { hello: 'world' } }
})();
```
:::

